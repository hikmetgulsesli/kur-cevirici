import './ErrorState.css';

export type ErrorType = 'generic' | 'rate_limit';

interface ErrorStateProps {
  type?: ErrorType;
  onRetry?: () => void;
  className?: string;
}

const ERROR_MESSAGES: Record<ErrorType, string> = {
  generic: 'Kur bilgisi yüklenemedi. Lütfen tekrar deneyin.',
  rate_limit: 'Çok fazla istek gönderildi. 5 dakika bekleyin.',
};

const ERROR_TITLES: Record<ErrorType, string> = {
  generic: 'Kur bilgisi yüklenemedi',
  rate_limit: 'İstek limiti aşıldı',
};

export function ErrorState({ type = 'generic', onRetry, className }: ErrorStateProps) {
  return (
    <div className={`error-state-container ${className || ''}`} role="alert">
      <span className="material-symbols-outlined error-icon" aria-hidden="true">error</span>
      <h3 className="error-title">{ERROR_TITLES[type]}</h3>
      <p className="error-message">{ERROR_MESSAGES[type]}</p>
      {onRetry && type !== 'rate_limit' && (
        <button type="button" className="error-retry-btn" onClick={onRetry}>
          <span className="material-symbols-outlined error-retry-icon" aria-hidden="true">refresh</span>
          Tekrar dene
        </button>
      )}
    </div>
  );
}
