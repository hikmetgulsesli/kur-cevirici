import './Skeleton.css';

interface ConverterSkeletonProps {
  className?: string;
}

export function ConverterSkeleton({ className }: ConverterSkeletonProps) {
  return (
    <div className={`converter-skeleton ${className || ''}`} role="status" aria-label="Çevirici yükleniyor">
      {/* From currency select */}
      <div className="converter-skeleton-select">
        <div className="skeleton skeleton-select-label" />
        <div className="skeleton skeleton-select-field" />
      </div>

      {/* Swap button row */}
      <div className="converter-skeleton-row">
        <div className="skeleton converter-skeleton-swap" />
        <div className="skeleton converter-skeleton-input-field" />
      </div>

      {/* To currency select */}
      <div className="converter-skeleton-select">
        <div className="skeleton skeleton-select-label" />
        <div className="skeleton skeleton-select-field" />
      </div>
    </div>
  );
}

interface CurrencyListSkeletonProps {
  className?: string;
  count?: number;
}

export function CurrencyListSkeleton({ className, count = 6 }: CurrencyListSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`currency-list-skeleton ${className || ''}`} role="status" aria-label="Kur listesi yükleniyor">
      {/* Header */}
      <div className="currency-list-skeleton-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-refresh-btn" />
      </div>

      {/* Currency items */}
      <div className="currency-list-skeleton-items">
        {items.map((item) => (
          <div key={item} className="currency-skeleton-item">
            <div className="currency-skeleton-info">
              <div className="skeleton skeleton-currency-symbol" />
              <div className="skeleton skeleton-currency-name" />
            </div>
            <div className="currency-skeleton-rate">
              <div className="skeleton skeleton-rate-value" />
              <div className="skeleton skeleton-change-chip" />
            </div>
            <div className="currency-skeleton-actions">
              <div className="skeleton skeleton-favorite-btn" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
