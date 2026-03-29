import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/CurrencyList.css'
import { CurrencyList } from './components/CurrencyList'
import type { ExchangeRate } from './types'

// Demo exchange rates for development
const demoRates: ExchangeRate = {
  try: 1,
  btc: 4500000,
  eth: 280000,
  usd: 38.50,
  eur: 41.20,
  gbp: 48.90,
  timestamp: Date.now(),
};

function App() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <CurrencyList rates={demoRates} />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
