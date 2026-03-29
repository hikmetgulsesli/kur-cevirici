import { useState, useCallback } from 'react';
import type { ExchangeRate } from '../types';

interface CurrencyInfo {
  id: string;
  symbol: string;
  name: string;
  nameTr: string;
  type: 'crypto' | 'fiat';
}

const CURRENCIES: CurrencyInfo[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', nameTr: 'Bitcoin', type: 'crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', nameTr: 'Ethereum', type: 'crypto' },
  { id: 'usd', symbol: 'USD', name: 'US Dollar', nameTr: 'Amerikan Doları', type: 'fiat' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', nameTr: 'Euro', type: 'fiat' },
  { id: 'gbp', symbol: 'GBP', name: 'British Pound', nameTr: 'İngiliz Sterlini', type: 'fiat' },
  { id: 'try', symbol: 'TRY', name: 'Turkish Lira', nameTr: 'Türk Lirası', type: 'fiat' },
];

const STORAGE_KEY = 'kur-cevirici-favorites';

function getStoredFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : ['btc', 'eth'];
  } catch {
    return ['btc', 'eth'];
  }
}

function storeFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage not available
  }
}

interface CurrencyListProps {
  rates: ExchangeRate;
  onRefresh?: () => void;
}

export function CurrencyList({ rates, onRefresh }: CurrencyListProps) {
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  // Sort: crypto first (by favorites), then fiat (by favorites)
  const sortedCurrencies = useCallback(() => {
    const crypto = CURRENCIES.filter(c => c.type === 'crypto');
    const fiat = CURRENCIES.filter(c => c.type === 'fiat');
    
    const sortByFavorites = (arr: CurrencyInfo[]) => {
      return [...arr].sort((a, b) => {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
      });
    };
    
    return [...sortByFavorites(crypto), ...sortByFavorites(fiat)];
  }, [favorites]);

  const toggleFavorite = useCallback((currencyId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(currencyId)
        ? prev.filter(id => id !== currencyId)
        : [...prev, currencyId];
      storeFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // Generate mock 24h change for demo purposes
  const get24hChange = (currencyId: string): number => {
    // Generate consistent pseudo-random values based on currency id
    const seed = currencyId.charCodeAt(0) + currencyId.charCodeAt(1) * 0.1;
    const value = Math.sin(seed * 1000) * 10;
    return Math.round(value * 100) / 100;
  };

  const formatRate = (rate: number): string => {
    if (rate === 0) return '—';
    if (rate >= 1000000) return rate.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
    if (rate >= 1) return rate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return rate.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  };

  const currencies = sortedCurrencies();

  return (
    <div className="currency-list">
      <div className="currency-list-header">
        <h2 className="currency-list-title">Kur Listesi</h2>
        {onRefresh && (
          <button 
            className="refresh-button"
            onClick={onRefresh}
            aria-label="Yenile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="currency-list-items">
        {currencies.map(currency => {
          const rate = rates[currency.id as keyof ExchangeRate] as number;
          const change = get24hChange(currency.id);
          const isPositive = change >= 0;
          const isFavorite = favorites.includes(currency.id);
          
          return (
            <div key={currency.id} className="currency-item">
              <div className="currency-info">
                <div className="currency-main">
                  <span className="currency-symbol">{currency.symbol}</span>
                  <span className="currency-name">{currency.nameTr}</span>
                </div>
                <div className="currency-rate">
                  <span className="rate-value">{formatRate(rate)}</span>
                  <span className="rate-label">TRY</span>
                </div>
              </div>
              
              <div className="currency-actions">
                <span className={`change-chip ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </span>
                <button
                  className={`favorite-button ${isFavorite ? 'active' : ''}`}
                  onClick={() => toggleFavorite(currency.id)}
                  aria-label={isFavorite ? 'Favorilerden kaldır' : 'Favorilere ekle'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
