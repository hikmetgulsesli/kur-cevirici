import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getExchangeRates, getChartData, clearCache } from '../coingecko';

describe('CoinGecko API Service', () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  describe('getExchangeRates', () => {
    it('should return exchange rates with TRY as base currency', async () => {
      const mockResponse = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 45000, try_price: 1450000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2500, try_price: 85000 },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }) as unknown as typeof fetch;

      const rates = await getExchangeRates();

      expect(rates).toHaveProperty('try', 1);
      expect(rates).toHaveProperty('btc');
      expect(rates).toHaveProperty('eth');
      expect(rates).toHaveProperty('usd');
      expect(rates).toHaveProperty('eur');
      expect(rates).toHaveProperty('gbp');
      expect(rates).toHaveProperty('timestamp');
    });

    it('should throw Turkish error message on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(getExchangeRates()).rejects.toThrow(/Ağ hatası/);
    });

    it('should throw Turkish error message on API error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getExchangeRates()).rejects.toThrow(/API hatası/);
    });

    it('should return stale cache when rate limited and stale cache exists', async () => {
      // First call - set cache
      const mockResponse = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 45000, try_price: 1450000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2500, try_price: 85000 },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }) as unknown as typeof fetch;

      await getExchangeRates();

      // Second call - rate limited but with stale cache available
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      });

      const rates = await getExchangeRates();
      expect(rates.stale).toBe(true);
    });
  });

  describe('getChartData', () => {
    it('should return chart data for a coin', async () => {
      const mockChartResponse = {
        prices: [
          [1704067200000, 1450000],
          [1704153600000, 1460000],
          [1704240000000, 1470000],
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartResponse),
      }) as unknown as typeof fetch;

      const chartData = await getChartData('bitcoin', 7);

      expect(chartData.coinId).toBe('bitcoin');
      expect(chartData.days).toBe(7);
      expect(chartData.data).toHaveLength(3);
      expect(chartData.data[0]).toHaveProperty('timestamp');
      expect(chartData.data[0]).toHaveProperty('price');
    });

    it('should throw Turkish error message on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(getChartData('bitcoin')).rejects.toThrow(/Ağ hatası/);
    });

    it('should throw Turkish error message on rate limit', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      });

      await expect(getChartData('bitcoin')).rejects.toThrow(/Çok fazla istek/);
    });

    it('should return stale cache when rate limited and stale cache exists', async () => {
      // First call - set cache
      const mockChartResponse = {
        prices: [
          [1704067200000, 1450000],
          [1704153600000, 1460000],
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartResponse),
      }) as unknown as typeof fetch;

      await getChartData('bitcoin', 7);

      // Second call - rate limited but with stale cache available
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      });

      const chartData = await getChartData('bitcoin', 7);
      expect(chartData.stale).toBe(true);
    });
  });
});
