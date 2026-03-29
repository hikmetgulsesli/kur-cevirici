import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import type { Theme } from '../types';
import './Settings.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD — Amerikan Doları' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — İngiliz Sterlini' },
  { value: 'TRY', label: 'TRY — Türk Lirası' },
  { value: 'BTC', label: 'BTC — Bitcoin' },
  { value: 'ETH', label: 'ETH — Ethereum' },
];

interface ModalContentProps {
  settings: ReturnType<typeof useSettings>['settings'];
  onSave: (theme: Theme, source: string, target: string) => void;
  onCancel: () => void;
}

function ModalContent({ settings, onSave, onCancel }: ModalContentProps) {
  const [localSource, setLocalSource] = useState(settings.defaultSourceCurrency);
  const [localTarget, setLocalTarget] = useState(settings.defaultTargetCurrency);
  const [localTheme, setLocalTheme] = useState<Theme>(settings.theme);

  const handleThemeToggle = (theme: Theme) => {
    setLocalTheme(theme);
  };

  const handleSave = () => {
    onSave(localTheme, localSource, localTarget);
  };

  const handleSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocalSource(e.target.value);
  };

  const handleTargetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocalTarget(e.target.value);
  };

  return (
    <>
      <header className="settings-header">
        <h2 id="settings-title" className="settings-title">Ayarlar</h2>
        <button
          className="settings-close-btn"
          onClick={onCancel}
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="settings-body">
        {/* Tema Section */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="material-symbols-outlined settings-section-icon">palette</span>
            <h3 className="settings-section-title">Tema</h3>
          </div>
          <div className="settings-section-content">
            <div className="theme-toggle-container">
              <button
                type="button"
                className={`theme-toggle-btn ${localTheme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeToggle('dark')}
                aria-pressed={localTheme === 'dark'}
              >
                <span className="material-symbols-outlined theme-toggle-icon">dark_mode</span>
                Koyu
              </button>
              <button
                type="button"
                className={`theme-toggle-btn ${localTheme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeToggle('light')}
                aria-pressed={localTheme === 'light'}
              >
                <span className="material-symbols-outlined theme-toggle-icon">light_mode</span>
                Acik
              </button>
            </div>
          </div>
        </section>

        {/* Varsayilan Birimler Section */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="material-symbols-outlined settings-section-icon">currency_exchange</span>
            <h3 className="settings-section-title">Varsayilan Birimler</h3>
          </div>
          <div className="settings-section-content">
            <div className="select-container">
              <label className="select-label" htmlFor="source-currency">Varsayilan kaynak birim</label>
              <select
                id="source-currency"
                className="settings-select"
                value={localSource}
                onChange={handleSourceChange}
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="select-container">
              <label className="select-label" htmlFor="target-currency">Varsayilan hedef birim</label>
              <select
                id="target-currency"
                className="settings-select"
                value={localTarget}
                onChange={handleTargetChange}
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>

      <footer className="settings-footer">
        <button type="button" className="settings-btn-cancel" onClick={onCancel}>
          Iptal
        </button>
        <button type="button" className="settings-btn-save" onClick={handleSave}>
          Kaydet
        </button>
      </footer>
    </>
  );
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, setTheme, setDefaultSourceCurrency, setDefaultTargetCurrency } = useSettings();

  const handleSave = (theme: Theme, source: string, target: string) => {
    setTheme(theme);
    setDefaultSourceCurrency(source);
    setDefaultTargetCurrency(target);
    onClose();
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <ModalContent
          key={String(isOpen)} // Force re-mount when opened to reset state
          settings={settings}
          onSave={handleSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
