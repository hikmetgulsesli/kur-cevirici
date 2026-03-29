// Exchange rate type
export interface ExchangeRate {
  try: number;
  eth: number;
  usd: number;
  eur: number;
  gbp: number;
  btc: number;
  timestamp: number;
  stale?: boolean;
}

// Chart data point
export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

// Chart data response
export interface ChartData {
  coinId: string;
  days: number;
  data: ChartDataPoint[];
  stale?: boolean;
}

// CoinGecko API response types
export interface CoinGeckoMarketCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
}

export interface CoinGeckoChartResponse {
  prices: [number, number][];
}

// Cache entry type
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
