// Core domain types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
}

export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  inverseRate: number;
  timestamp: number;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface ChartSeries {
  currency: string;
  data: ChartDataPoint[];
}

export interface Settings {
  baseCurrency: string;
  targetCurrency: string;
  favoriteCurrencies: string[];
  theme: 'dark' | 'light';
  refreshInterval: number;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  result: number;
  timestamp: number;
}

// CoinGecko API response types
export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  ath: number;
  atl: number;
  last_updated: string;
}

export interface CoinGeckoSimplePriceResponse {
  [key: string]: {
    [currency: string]: number;
  };
}

export interface CoinGeckoChartResponse {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

export interface CoinGeckoSearchResponse {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
  }>;
}
