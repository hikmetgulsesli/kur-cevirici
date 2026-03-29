import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SettingsState, SettingsContextType, Theme } from '../types';

const SETTINGS_STORAGE_KEY = 'kur-cevirici-settings';

const defaultSettings: SettingsState = {
  theme: 'dark',
  defaultSourceCurrency: 'USD',
  defaultTargetCurrency: 'TRY',
};

function loadSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SettingsState>;
      return {
        theme: parsed.theme ?? defaultSettings.theme,
        defaultSourceCurrency: parsed.defaultSourceCurrency ?? defaultSettings.defaultSourceCurrency,
        defaultTargetCurrency: parsed.defaultTargetCurrency ?? defaultSettings.defaultTargetCurrency,
      };
    }
  } catch {
    // localStorage not available or parse error
  }
  return defaultSettings;
}

function saveSettings(settings: SettingsState): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage not available
  }
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [settings.theme]);

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const setDefaultSourceCurrency = (currency: string) => {
    setSettings(prev => ({ ...prev, defaultSourceCurrency: currency }));
  };

  const setDefaultTargetCurrency = (currency: string) => {
    setSettings(prev => ({ ...prev, defaultTargetCurrency: currency }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        setDefaultSourceCurrency,
        setDefaultTargetCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
