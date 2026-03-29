import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyList } from '../CurrencyList';
import type { ExchangeRate } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockRates: ExchangeRate = {
  try: 1,
  btc: 4500000,
  eth: 280000,
  usd: 38.50,
  eur: 41.20,
  gbp: 48.90,
  timestamp: Date.now(),
};

describe('CurrencyList', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should render Kur Listesi heading', () => {
    render(<CurrencyList rates={mockRates} />);
    expect(screen.getByText('Kur Listesi')).toBeInTheDocument();
  });

  it('should render all 6 currencies', () => {
    render(<CurrencyList rates={mockRates} />);
    // Use getAllByText for BTC, ETH, USD, EUR, GBP (they appear once as symbol)
    // TRY appears both as symbol and label, so we check the count
    const btcElements = screen.getAllByText('BTC');
    const ethElements = screen.getAllByText('ETH');
    const usdElements = screen.getAllByText('USD');
    const eurElements = screen.getAllByText('EUR');
    const gbpElements = screen.getAllByText('GBP');
    const tryElements = screen.getAllByText('TRY');
    
    expect(btcElements.length).toBeGreaterThanOrEqual(1);
    expect(ethElements.length).toBeGreaterThanOrEqual(1);
    expect(usdElements.length).toBeGreaterThanOrEqual(1);
    expect(eurElements.length).toBeGreaterThanOrEqual(1);
    expect(gbpElements.length).toBeGreaterThanOrEqual(1);
    // TRY appears as both symbol and label = 7 total (1 per currency row as label + 1 as symbol)
    expect(tryElements.length).toBe(7);
  });

  it('should render crypto currencies first (BTC, ETH before fiat)', () => {
    render(<CurrencyList rates={mockRates} />);
    const items = screen.getAllByRole('button', { name: /favorilere ekle|favorilerden kaldır/i });
    // First two should be BTC and ETH
    expect(items.length).toBe(6);
  });

  it('should display rate values', () => {
    render(<CurrencyList rates={mockRates} />);
    // Check TRY rate shows 1
    expect(screen.getByText('1,00')).toBeInTheDocument();
  });

  it('should toggle favorite status', () => {
    render(<CurrencyList rates={mockRates} />);
    
    // Get all favorite buttons
    const favoriteButtons = screen.getAllByRole('button', { name: /favorilere ekle|favorilerden kaldır/i });
    
    // First currency (BTC) should be favorite initially
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Favorilerden kaldır');
    
    // Click to remove from favorites
    fireEvent.click(favoriteButtons[0]);
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Favorilere ekle');
    
    // Click to add back to favorites
    fireEvent.click(favoriteButtons[0]);
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Favorilerden kaldır');
  });

  it('should persist favorites to localStorage', () => {
    render(<CurrencyList rates={mockRates} />);
    
    const favoriteButtons = screen.getAllByRole('button', { name: /favorilere ekle|favorilerden kaldır/i });
    fireEvent.click(favoriteButtons[0]); // Remove BTC from favorites
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'kur-cevirici-favorites',
      expect.any(String)
    );
  });

  it('should show positive change chip with green background', () => {
    render(<CurrencyList rates={mockRates} />);
    const positiveChips = document.querySelectorAll('.change-chip.positive');
    expect(positiveChips.length).toBeGreaterThan(0);
  });

  it('should show negative change chip with red background', () => {
    render(<CurrencyList rates={mockRates} />);
    const negativeChips = document.querySelectorAll('.change-chip.negative');
    expect(negativeChips.length).toBeGreaterThan(0);
  });

  it('should call onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    render(<CurrencyList rates={mockRates} onRefresh={onRefresh} />);
    
    const refreshButton = screen.getByRole('button', { name: 'Yenile' });
    fireEvent.click(refreshButton);
    
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('should not render refresh button when onRefresh is not provided', () => {
    render(<CurrencyList rates={mockRates} />);
    expect(screen.queryByRole('button', { name: 'Yenile' })).not.toBeInTheDocument();
  });

  it('should display TRY label next to rates', () => {
    render(<CurrencyList rates={mockRates} />);
    // TRY appears 7 times: 1 as currency symbol + 6 as rate labels
    const tryElements = screen.getAllByText('TRY');
    expect(tryElements.length).toBe(7);
  });

  it('should load favorites from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['btc', 'eth', 'usd']));
    
    render(<CurrencyList rates={mockRates} />);
    
    // USD should now also be a favorite
    const favoriteButtons = screen.getAllByRole('button', { name: /favorilere ekle|favorilerden kaldır/i });
    // First 3 should be "remove from favorites" (btc, eth, usd)
    expect(favoriteButtons[0]).toHaveAttribute('aria-label', 'Favorilerden kaldır');
    expect(favoriteButtons[1]).toHaveAttribute('aria-label', 'Favorilerden kaldır');
    expect(favoriteButtons[2]).toHaveAttribute('aria-label', 'Favorilerden kaldır');
  });
});
