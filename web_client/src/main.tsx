import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SignalingProvider } from './context/SignalingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignalingProvider>
      <App />
    </SignalingProvider>
  </StrictMode>,
)
