import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from '../Settings';
import { SettingsProvider, useSettings } from '../../contexts/SettingsContext';
import type { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test helper component to access settings context
function TestConsumer() {
  const { settings, setTheme, setDefaultSourceCurrency, setDefaultTargetCurrency } = useSettings();
  return (
    <div>
      <span data-testid="theme">{settings.theme}</span>
      <span data-testid="source">{settings.defaultSourceCurrency}</span>
      <span data-testid="target">{settings.defaultTargetCurrency}</span>
      <button onClick={() => setTheme('light')}>setLight</button>
      <button onClick={() => setDefaultSourceCurrency('EUR')}>setEUR</button>
      <button onClick={() => setDefaultTargetCurrency('BTC')}>setBTC</button>
    </div>
  );
}

function renderWithProvider(ui: ReactNode) {
  return render(
    <SettingsProvider>
      {ui}
    </SettingsProvider>
  );
}

describe('SettingsModal', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderWithProvider(<SettingsModal isOpen={false} onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display Ayarlar heading', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Ayarlar')).toBeInTheDocument();
    });

    it('should display Tema section', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Tema')).toBeInTheDocument();
    });

    it('should display Koyu and Acik theme buttons', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: /Koyu/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Acik/i })).toBeInTheDocument();
    });

    it('should display Varsayilan Birimler section', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Varsayilan Birimler')).toBeInTheDocument();
    });

    it('should display source and target currency labels', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Varsayilan kaynak birim')).toBeInTheDocument();
      expect(screen.getByText('Varsayilan hedef birim')).toBeInTheDocument();
    });

    it('should display Iptal and Kaydet buttons', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Iptal' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Kaydet' })).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should have Koyu active by default', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const koyuBtn = screen.getByRole('button', { name: /Koyu/i });
      expect(koyuBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should toggle to Acik theme when clicked', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const acikBtn = screen.getByRole('button', { name: /Acik/i });
      fireEvent.click(acikBtn);
      expect(acikBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onClose when Kaydet is clicked', () => {
      const onClose = vi.fn();
      renderWithProvider(<SettingsModal isOpen={true} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when Iptal is clicked', () => {
      const onClose = vi.fn();
      renderWithProvider(<SettingsModal isOpen={true} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: 'Iptal' }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Currency Selects', () => {
    it('should have USD as default source currency', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const sourceSelect = screen.getByLabelText('Varsayilan kaynak birim') as HTMLSelectElement;
      expect(sourceSelect.value).toBe('USD');
    });

    it('should have TRY as default target currency', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const targetSelect = screen.getByLabelText('Varsayilan hedef birim') as HTMLSelectElement;
      expect(targetSelect.value).toBe('TRY');
    });

    it('should allow changing source currency', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const sourceSelect = screen.getByLabelText('Varsayilan kaynak birim');
      fireEvent.change(sourceSelect, { target: { value: 'EUR' } });
      expect((sourceSelect as HTMLSelectElement).value).toBe('EUR');
    });

    it('should allow changing target currency', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={vi.fn()} />);
      const targetSelect = screen.getByLabelText('Varsayilan hedef birim');
      fireEvent.change(targetSelect, { target: { value: 'BTC' } });
      expect((targetSelect as HTMLSelectElement).value).toBe('BTC');
    });
  });

  describe('localStorage Persistence', () => {
    it('should save settings to localStorage on Kaydet', () => {
      const onClose = vi.fn();
      renderWithProvider(<SettingsModal isOpen={true} onClose={onClose} />);

      // Change theme to light
      fireEvent.click(screen.getByRole('button', { name: /Acik/i }));

      // Save
      fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should load settings from localStorage on mount', () => {
      // Pre-populate localStorage
      localStorageMock.setItem('kur-cevirici-settings', JSON.stringify({
        theme: 'light',
        defaultSourceCurrency: 'EUR',
        defaultTargetCurrency: 'BTC',
      }));

      renderWithProvider(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('source')).toHaveTextContent('EUR');
      expect(screen.getByTestId('target')).toHaveTextContent('BTC');
    });

    it('should use defaults when localStorage is empty', () => {
      renderWithProvider(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('source')).toHaveTextContent('USD');
      expect(screen.getByTestId('target')).toHaveTextContent('TRY');
    });
  });

  describe('Theme Application', () => {
    it('should add dark class to html element when dark theme is active', () => {
      renderWithProvider(<TestConsumer />);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from html element when light theme is set', () => {
      renderWithProvider(<TestConsumer />);

      // Change to light
      fireEvent.click(screen.getByText('setLight'));

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when overlay is clicked', () => {
      const onClose = vi.fn();
      renderWithProvider(<SettingsModal isOpen={true} onClose={onClose} />);

      // Click the overlay (outside the modal)
      const overlay = document.querySelector('.settings-modal-overlay');
      if (overlay) {
        fireEvent.click(overlay);
      }

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      renderWithProvider(<SettingsModal isOpen={true} onClose={onClose} />);

      fireEvent.click(screen.getByLabelText('Kapat'));

      expect(onClose).toHaveBeenCalled();
    });
  });
});

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error when useSettings is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useSettings must be used within a SettingsProvider');

    consoleSpy.mockRestore();
  });

  it('should update source currency', () => {
    renderWithProvider(<TestConsumer />);
    fireEvent.click(screen.getByText('setEUR'));
    expect(screen.getByTestId('source')).toHaveTextContent('EUR');
  });

  it('should update target currency', () => {
    renderWithProvider(<TestConsumer />);
    fireEvent.click(screen.getByText('setBTC'));
    expect(screen.getByTestId('target')).toHaveTextContent('BTC');
  });

  it('should persist settings changes to localStorage', () => {
    renderWithProvider(<TestConsumer />);
    fireEvent.click(screen.getByText('setLight'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'kur-cevirici-settings',
      expect.stringContaining('"theme":"light"')
    );
  });
});
