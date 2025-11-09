// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './design/theme'
import { AuthProvider } from './auth/AuthProvider'
import ResetPassword from '@pages/ResetPassword'     // OK si tu archivo existe así
import CasesPage from '@pages/CasesPage'             // 👈 OJO: tu carpeta real es CasesPage

const baseName = import.meta.env.BASE_URL
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter basename={baseName}>
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route path="/cases" element={<CasesPage />} />
                            <Route path="/reset" element={<ResetPassword />} />
                            <Route path="*" element={<App />} />
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
)
