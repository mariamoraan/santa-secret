import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './core/routes/app-router'
import { TanstackQueryProvider } from './core/tanstack/tanstack.provider'
import { ToastContainer } from 'react-toastify';
import '@/core/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <AppRouter />
      <ToastContainer />
    </TanstackQueryProvider>
  </StrictMode>,
)
