import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary:   { main: '#0ea5e9', light: '#7dd3fc', dark: '#0284c7', contrastText: '#ffffff' },
        secondary: { main: '#22c55e', light: '#86efac', dark: '#16a34a', contrastText: '#ffffff' },
        info:      { main: '#14b8a6', contrastText: '#ffffff' },
        background: { default: '#f7fbff' },
        text: { primary: '#0f172a', secondary: '#475569' },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: ['Inter','ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Arial'].join(','),
        h1: { fontWeight: 800, letterSpacing: '-.02em' },
        h2: { fontWeight: 800, letterSpacing: '-.02em' },
        h3: { fontWeight: 700 },
        button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.85))',
                    backdropFilter: 'saturate(140%) blur(6px)',
                    borderBottom: '1px solid #e5e7eb',
                }
            }
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 10 },
                containedPrimary:   { color: '#ffffff' }, // redundante con contrastText, pero asegura
                containedSecondary: { color: '#ffffff' },
                containedInfo:      { color: '#ffffff' },
            }
        }
    }
})

export default theme
