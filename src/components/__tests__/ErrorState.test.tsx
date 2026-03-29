/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  describe('Generic Error', () => {
    it('should render generic error with correct title', () => {
      render(<ErrorState type="generic" />);
      expect(screen.getByText('Kur bilgisi yüklenemedi')).toBeInTheDocument();
    });

    it('should render generic error message', () => {
      render(<ErrorState type="generic" />);
      expect(screen.getByText('Kur bilgisi yüklenemedi. Lütfen tekrar deneyin.')).toBeInTheDocument();
    });

    it('should render error icon with material-symbols-outlined', () => {
      const { container } = render(<ErrorState type="generic" />);
      const icon = container.querySelector('.material-symbols-outlined.error-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Rate Limit Error', () => {
    it('should render rate limit error title', () => {
      render(<ErrorState type="rate_limit" />);
      expect(screen.getByText('İstek limiti aşıldı')).toBeInTheDocument();
    });

    it('should render 5 dakika bekleyin message', () => {
      render(<ErrorState type="rate_limit" />);
      expect(screen.getByText('Çok fazla istek gönderildi. 5 dakika bekleyin.')).toBeInTheDocument();
    });

    it('should NOT show retry button for rate limit error', () => {
      render(<ErrorState type="rate_limit" onRetry={vi.fn()} />);
      expect(screen.queryByRole('button', { name: /tekrar dene/i })).not.toBeInTheDocument();
    });
  });

  describe('Retry Button', () => {
    it('should show retry button when onRetry is provided', () => {
      render(<ErrorState type="generic" onRetry={vi.fn()} />);
      expect(screen.getByRole('button', { name: /tekrar dene/i })).toBeInTheDocument();
    });

    it('should NOT show retry button when onRetry is not provided', () => {
      render(<ErrorState type="generic" />);
      expect(screen.queryByRole('button', { name: /tekrar dene/i })).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const handleRetry = vi.fn();
      render(<ErrorState type="generic" onRetry={handleRetry} />);
      const retryButton = screen.getByRole('button', { name: /tekrar dene/i });
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', () => {
      const { container } = render(<ErrorState type="generic" />);
      expect(container.firstChild).toHaveAttribute('role', 'alert');
    });
  });
});
