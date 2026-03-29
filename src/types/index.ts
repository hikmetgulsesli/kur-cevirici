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
