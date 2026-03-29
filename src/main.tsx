import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from './contexts/SettingsContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { CurrencyList } from './components/CurrencyList'
import { TrendChart } from './components/TrendChart'
import { CurrencyListSkeleton } from './components/Skeleton'
import { ErrorState } from './components/ErrorState'
import { SettingsModal } from './components/Settings'

import { useCurrency } from './contexts/CurrencyContext'
import './index.css'

function App() {
  return (
    <SettingsProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </SettingsProvider>
  )
}

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
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
        <RatesContent />
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

function RatesContent() {
  const { rates, loading, error } = useCurrency()

  if (loading) {
    return <CurrencyListSkeleton />
  }

  if (error || !rates) {
    return <ErrorState onRetry={() => window.location.reload()} />
  }

  return (
    <>
      <CurrencyList rates={rates} />
      <TrendChart />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
