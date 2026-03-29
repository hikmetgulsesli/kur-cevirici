import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from './contexts/SettingsContext'
import { SettingsModal } from './components/Settings'
import './index.css'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <SettingsProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Kur Çevirici</h1>
          <button
            className="settings-icon-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Ayarlar"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </header>
        <main className="app-main">
          <p style={{ color: 'var(--on-surface-variant)', textAlign: 'center', marginTop: '2rem' }}>
            Ayarlar modalini acmak icin sag ustteki çark simgesine tiklayin.
          </p>
        </main>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </SettingsProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
