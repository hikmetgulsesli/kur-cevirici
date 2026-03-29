import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary mb-4">
          Kur Çevirici
        </h1>
        <p className="text-on-surface-variant">
          Döviz ve kripto para çevirici uygulaması
        </p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
