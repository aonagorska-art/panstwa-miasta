import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)
window.addEventListener('load', () => requestAnimationFrame(() => window.scrollTo(0, 0)), { once: true })

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Bezpieczny fallback bez zewnętrznego raportowania. */ }
  render() {
    if (this.state.failed) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}><section style={{ maxWidth: 520, padding: 32, border: '3px solid #2b0a34', borderRadius: 24, background: '#fff4d8', boxShadow: '8px 8px 0 #f36c60' }}><h1>Coś poszło nie tak.</h1><p>Balbina twierdzi, że to nie ona. Odśwież stronę — zapisana rozgrywka nadal jest na urządzeniu.</p><button className="primary" onClick={() => location.reload()}>Odśwież grę</button></section></main>
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>)

if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => undefined)
