import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ExchangeRate, CurrencyContextType } from '../types';
import { getExchangeRates } from '../services/coingecko';

const CurrencyContext = createContext<CurrencyContextType | null>(null);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [rates, setRates] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExchangeRates();
      setRates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kur bilgileri alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <CurrencyContext.Provider value={{ rates, loading, error, refetch: fetchRates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
