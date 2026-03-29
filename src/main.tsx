import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/TrendChart.css'
import { TrendChart } from './components/TrendChart'

function App() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <TrendChart />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
