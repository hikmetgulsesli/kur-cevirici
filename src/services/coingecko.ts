import type { ExchangeRate, ChartData, ChartDataPoint, CoinGeckoMarketCoin, CoinGeckoChartResponse } from '../types';

const CACHE_DURATION_MS = 5 * 60 * 1000;

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();

// CoinGecko API base URL
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Supported currencies
const SUPPORTED_CURRENCIES = ['btc', 'eth', 'usd', 'eur', 'gbp', 'try'];

/**
 * Helper to get valid (non-expired) cache entry
 */
function getValidCache<T>(key: string): T | null {
  const cachedItem = cache.get(key);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION_MS) {
    return cachedItem.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetches exchange rates from CoinGecko
 * Returns TRY-based exchange rates for BTC, ETH, USD, EUR, GBP, TRY
 */
export async function getExchangeRates(): Promise<ExchangeRate> {
  const cacheKey = 'exchangeRates';

  // Check valid cache first
  const cached = getValidCache<ExchangeRate>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const ids = ['bitcoin', 'ethereum'];
    const vsCurrencies = 'try';
    const url = `${COINGECKO_API}/coins/markets?vs_currency=${vsCurrencies}&ids=${ids.join(',')}&precision=6`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited - return stale cache if available
        const staleCache = cache.get(cacheKey);
        if (staleCache) {
          return {
            ...(staleCache.data as ExchangeRate),
            stale: true,
          };
        }
        const err = new Error('Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.');
        err.cause = response.status;
        throw err;
      }
      const err = new Error(`API hatası: ${response.status}`);
      err.cause = response.status;
      throw err;
    }

    const data = await response.json() as CoinGeckoMarketCoin[];

    // Create a map of coin id to price
    const priceMap = new Map<string, number>();
    for (const coin of data) {
      priceMap.set(coin.id, coin.current_price);
    }

    // Build exchange rate object with TRY as base
    const exchangeRates: ExchangeRate = {
      try: 1,
      btc: priceMap.get('bitcoin') || 0,
      eth: priceMap.get('ethereum') || 0,
      usd: 0,
      eur: 0,
      gbp: 0,
      timestamp: Date.now(),
    };

    // Fetch USD, EUR, GBP rates against TRY using stablecoin proxies
    try {
      // Use stablecoin proxies for fiat currencies: usd-coin (USD), euro-coin (EUR), poundtoken (GBP)
      const forexUrl = `${COINGECKO_API}/simple/price?vs_currencies=try&ids=usd-coin,euro-coin,poundtoken`;
      const forexResponse = await fetch(forexUrl);

      if (forexResponse.ok) {
        const forexData = await forexResponse.json() as Record<string, { try?: number }>;
        exchangeRates.usd = forexData['usd-coin']?.try || 0;
        exchangeRates.eur = forexData['euro-coin']?.try || 0;
        exchangeRates.gbp = forexData['poundtoken']?.try || 0;
      }
    } catch {
      // If forex fetch fails, use fallback values
    }

    setCache(cacheKey, exchangeRates);
    return exchangeRates;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Çok fazla')) {
      throw error;
    }
    if (error instanceof Error) {
      const err = new Error(`Ağ hatası: ${error.message}`);
      err.cause = error;
      throw err;
    }
    const err = new Error('Kur bilgileri alınamadı. İnternet bağlantınızı kontrol edin.');
    err.cause = error;
    throw err;
  }
}

/**
 * Fetches chart data for a specific coin
 * @param coinId - CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
 * @param days - Number of days of data (default 7)
 */
export async function getChartData(coinId: string, days: number = 7): Promise<ChartData> {
  const cacheKey = `chart_${coinId}_${days}`;

  // Check valid cache first
  const cached = getValidCache<ChartData>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const url = `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=try&days=${days}&precision=6`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited - return stale cache if available
        const staleCache = cache.get(cacheKey);
        if (staleCache) {
          return {
            ...(staleCache.data as ChartData),
            stale: true,
          };
        }
        const err = new Error('Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.');
        err.cause = response.status;
        throw err;
      }
      const err = new Error(`API hatası: ${response.status}`);
      err.cause = response.status;
      throw err;
    }

    const data = await response.json() as CoinGeckoChartResponse;

    // Transform CoinGecko response to our format
    const chartDataPoints: ChartDataPoint[] = data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));

    const chartData: ChartData = {
      coinId,
      days,
      data: chartDataPoints,
    };

    setCache(cacheKey, chartData);
    return chartData;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Çok fazla')) {
      throw error;
    }
    if (error instanceof Error) {
      const err = new Error(`Ağ hatası: ${error.message}`);
      err.cause = error;
      throw err;
    }
    const err = new Error('Grafik verileri alınamadı. İnternet bağlantınızı kontrol edin.');
    err.cause = error;
    throw err;
  }
}

/**
 * Clears all cached data
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Returns supported currency list
 */
export function getSupportedCurrencies(): string[] {
  return [...SUPPORTED_CURRENCIES];
}
