import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 1000,
      gcTime: 15 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HashRouter>
  </StrictMode>,
)

