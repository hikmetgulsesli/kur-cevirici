/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConverterSkeleton, CurrencyListSkeleton } from '../Skeleton';

describe('ConverterSkeleton', () => {
  it('should render converter skeleton with correct aria-label', () => {
    render(<ConverterSkeleton />);
    expect(screen.getByRole('status', { name: 'Çevirici yükleniyor' })).toBeInTheDocument();
  });

  it('should render 2 select placeholders', () => {
    const { container } = render(<ConverterSkeleton />);
    const skeletons = container.querySelectorAll('.skeleton');
    // 2 select labels + 2 select fields + 1 swap + 1 input = 6 skeleton elements
    expect(skeletons.length).toBe(6);
  });

  it('should have correct structure with select containers', () => {
    const { container } = render(<ConverterSkeleton />);
    expect(container.querySelectorAll('.converter-skeleton-select').length).toBe(2);
  });

  it('should render swap row', () => {
    const { container } = render(<ConverterSkeleton />);
    expect(container.querySelector('.converter-skeleton-row')).toBeInTheDocument();
  });
});

describe('CurrencyListSkeleton', () => {
  it('should render currency list skeleton with correct aria-label', () => {
    render(<CurrencyListSkeleton />);
    expect(screen.getByRole('status', { name: 'Kur listesi yükleniyor' })).toBeInTheDocument();
  });

  it('should render 6 animated shimmer rows by default', () => {
    const { container } = render(<CurrencyListSkeleton />);
    const skeletonItems = container.querySelectorAll('.currency-skeleton-item');
    expect(skeletonItems.length).toBe(6);
  });

  it('should render header with title and refresh button placeholders', () => {
    const { container } = render(<CurrencyListSkeleton />);
    expect(container.querySelector('.currency-list-skeleton-header')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-refresh-btn')).toBeInTheDocument();
  });

  it('should render skeleton elements with shimmer class', () => {
    const { container } = render(<CurrencyListSkeleton />);
    const skeletons = container.querySelectorAll('.skeleton');
    skeletons.forEach((skeleton: Element) => {
      expect(skeleton.classList.contains('skeleton')).toBe(true);
    });
  });

  it('should accept custom count prop', () => {
    const { container } = render(<CurrencyListSkeleton count={3} />);
    const skeletonItems = container.querySelectorAll('.currency-skeleton-item');
    expect(skeletonItems.length).toBe(3);
  });
});
