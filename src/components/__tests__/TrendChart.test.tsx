import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TrendChart } from '../TrendChart';

describe('TrendChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render 7 Gunluk Trend heading', () => {
      render(<TrendChart />);
      expect(screen.getByText('7 Gunluk Trend')).toBeInTheDocument();
    });

    it('should render all currency tabs (BTC, ETH, USD, EUR, GBP)', () => {
      render(<TrendChart />);
      expect(screen.getByRole('tab', { name: 'BTC' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'ETH' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'USD' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'EUR' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'GBP' })).toBeInTheDocument();
    });

    it('should render the chart wrapper', () => {
      render(<TrendChart />);
      const chartWrapper = screen.getByRole('tabpanel', { name: /BTC 7 gunluk trend grafigi/i });
      expect(chartWrapper).toBeInTheDocument();
    });

    it('should have BTC tab selected by default', () => {
      render(<TrendChart />);
      const btcTab = screen.getByRole('tab', { name: 'BTC' });
      expect(btcTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Currency Selection', () => {
    it('should switch to ETH tab when clicked', () => {
      render(<TrendChart />);
      const ethTab = screen.getByRole('tab', { name: 'ETH' });
      fireEvent.click(ethTab);
      expect(ethTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to USD tab when clicked', () => {
      render(<TrendChart />);
      const usdTab = screen.getByRole('tab', { name: 'USD' });
      fireEvent.click(usdTab);
      expect(usdTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should update chart wrapper label when currency changes', () => {
      render(<TrendChart />);
      const usdTab = screen.getByRole('tab', { name: 'USD' });
      fireEvent.click(usdTab);
      const chartWrapper = screen.getByRole('tabpanel', { name: /USD 7 gunluk trend grafigi/i });
      expect(chartWrapper).toBeInTheDocument();
    });

    it('should allow switching between multiple currencies', () => {
      render(<TrendChart />);
      
      // Select GBP
      const gbpTab = screen.getByRole('tab', { name: 'GBP' });
      fireEvent.click(gbpTab);
      expect(gbpTab).toHaveAttribute('aria-selected', 'true');
      
      // Select EUR
      const eurTab = screen.getByRole('tab', { name: 'EUR' });
      fireEvent.click(eurTab);
      expect(eurTab).toHaveAttribute('aria-selected', 'true');
      
      // BTC should no longer be selected
      const btcTab = screen.getByRole('tab', { name: 'BTC' });
      expect(btcTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Data Generation', () => {
    it('should generate 7 day labels in gg.aa format', () => {
      render(<TrendChart />);
      const dayLabels = screen.getAllByText(/^\d{2}\.\d{2}$/);
      expect(dayLabels).toHaveLength(7);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role="tablist" for currency tabs', () => {
      render(<TrendChart />);
      const tablist = screen.getByRole('tablist', { name: 'Para birimi seçimi' });
      expect(tablist).toBeInTheDocument();
    });

    it('should have aria-selected on tabs', () => {
      render(<TrendChart />);
      const btcTab = screen.getByRole('tab', { name: 'BTC' });
      expect(btcTab).toHaveAttribute('aria-selected');
    });

    it('should have aria-label on chart wrapper', () => {
      render(<TrendChart />);
      const chartWrapper = screen.getByRole('tabpanel');
      expect(chartWrapper).toHaveAttribute('aria-label');
    });
  });
});
