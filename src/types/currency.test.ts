import { describe, it, expect } from 'vitest';
import type {
  Currency,
  ExchangeRate,
  ChartDataPoint,
  Settings,
  ConversionResult,
  CoinGeckoMarketData,
  CoinGeckoSimplePriceResponse,
  CoinGeckoChartResponse,
} from './currency';

describe('Currency type', () => {
  it('should define TRY currency', () => {
    const tryCurrency: Currency = {
      code: 'TRY',
      name: 'Turkish Lira',
      symbol: '₺',
      isCrypto: false,
    };
    expect(tryCurrency.code).toBe('TRY');
    expect(tryCurrency.isCrypto).toBe(false);
  });

  it('should define BTC crypto currency', () => {
    const btc: Currency = {
      code: 'BTC',
      name: 'Bitcoin',
      symbol: '₿',
      isCrypto: true,
    };
    expect(btc.isCrypto).toBe(true);
  });
});

describe('ExchangeRate type', () => {
  it('should define USD/TRY rate', () => {
    const rate: ExchangeRate = {
      baseCurrency: 'USD',
      targetCurrency: 'TRY',
      rate: 38.5,
      inverseRate: 0.02597,
      timestamp: Date.now(),
    };
    expect(rate.rate).toBeGreaterThan(0);
    expect(rate.inverseRate).toBeCloseTo(1 / 38.5, 4);
  });
});

describe('ChartDataPoint type', () => {
  it('should define a data point with price', () => {
    const point: ChartDataPoint = {
      timestamp: 1711008000000,
      price: 65432.1,
    };
    expect(point.price).toBe(65432.1);
  });

  it('should support optional volume field', () => {
    const point: ChartDataPoint = {
      timestamp: 1711008000000,
      price: 65432.1,
      volume: 1234567890,
    };
    expect(point.volume).toBe(1234567890);
  });
});

describe('Settings type', () => {
  it('should define default settings', () => {
    const settings: Settings = {
      baseCurrency: 'USD',
      targetCurrency: 'TRY',
      favoriteCurrencies: ['EUR', 'GBP', 'BTC'],
      theme: 'dark',
      refreshInterval: 30000,
    };
    expect(settings.favoriteCurrencies).toContain('BTC');
    expect(settings.theme).toBe('dark');
  });
});

describe('ConversionResult type', () => {
  it('should define a conversion result', () => {
    const result: ConversionResult = {
      fromCurrency: 'USD',
      toCurrency: 'TRY',
      amount: 100,
      rate: 38.5,
      result: 3850,
      timestamp: Date.now(),
    };
    expect(result.result).toBe(3850);
  });
});

describe('CoinGeckoMarketData type', () => {
  it('should match CoinGecko API response shape', () => {
    const marketData: CoinGeckoMarketData = {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 65432,
      market_cap: 1234567890123,
      market_cap_rank: 1,
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d_in_currency: 5.2,
      ath: 73000,
      atl: 67.81,
      last_updated: '2024-03-20T10:00:00Z',
    };
    expect(marketData.id).toBe('bitcoin');
    expect(marketData.current_price).toBeGreaterThan(0);
  });
});

describe('CoinGeckoSimplePriceResponse type', () => {
  it('should match simple price API response', () => {
    const response: CoinGeckoSimplePriceResponse = {
      bitcoin: { try: 1950000, usd: 50000 },
      ethereum: { try: 95000, usd: 2500 },
    };
    expect(response.bitcoin.try).toBe(1950000);
  });
});

describe('CoinGeckoChartResponse type', () => {
  it('should match chart API response', () => {
    const response: CoinGeckoChartResponse = {
      prices: [
        [1710969600000, 50000],
        [1711056000000, 51000],
        [1711142400000, 49500],
      ],
      market_caps: [[1710969600000, 980000000000]],
      total_volumes: [[1710969600000, 25000000000]],
    };
    expect(response.prices).toHaveLength(3);
    expect(response.prices[0][0]).toBe(1710969600000);
  });
});
