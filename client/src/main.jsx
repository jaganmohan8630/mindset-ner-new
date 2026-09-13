import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


if (Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  // Capacitor packages the current web bundle inside the APK. An old browser
  // service-worker cache can otherwise keep serving a previous bundle.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
} else if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('MINDSET-NER service worker registration failed:', error);
    });
  });
}
