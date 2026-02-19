import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext' 
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O AuthProvider tem que ter tudo dentro do seu escopo */}
    <AuthProvider>
      <App />
      <Toaster /> 
    </AuthProvider>
  </React.StrictMode>,
)