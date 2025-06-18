import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'; // Added import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* Added wrapper */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
