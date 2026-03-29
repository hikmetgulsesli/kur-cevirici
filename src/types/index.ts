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

// Theme type
export type Theme = 'dark' | 'light';

// Settings state
export interface SettingsState {
  theme: Theme;
  defaultSourceCurrency: string;
  defaultTargetCurrency: string;
}

// Settings context type
export interface SettingsContextType {
  settings: SettingsState;
  setTheme: (theme: Theme) => void;
  setDefaultSourceCurrency: (currency: string) => void;
  setDefaultTargetCurrency: (currency: string) => void;
}

// Currency context type
export interface CurrencyContextType {
  rates: ExchangeRate | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
