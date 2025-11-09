// src/components/organisms/Header/Header.tsx
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import BuildIcon from '@mui/icons-material/Build'
import MailIcon from '@mui/icons-material/Mail'

// === imports para auth UI ===
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../../auth/AuthProvider.tsx'
import { supabase } from '../../../auth/supabase.ts'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = LoginForm

export default function Header() {
    const [open, setOpen] = useState(false)
    const { user } = useAuth()

    // diálogos
    const [openLogin, setOpenLogin] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const [openForgot, setOpenForgot] = useState(false)

    // menú usuario
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const openMenu = Boolean(anchorEl)

    // forms
    const {
        register: regLogin,
        handleSubmit: submitLogin,
        formState: { errors: eLogin, isSubmitting: loadingLogin },
        reset: resetLogin,
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

    const {
        register: regRegister,
        handleSubmit: submitRegister,
        formState: { errors: eRegister, isSubmitting: loadingRegister },
        reset: resetRegister,
    } = useForm<RegisterForm>({ resolver: zodResolver(loginSchema) })

    const [resetEmail, setResetEmail] = useState('')
    const [loadingReset, setLoadingReset] = useState(false)

    // URL base (funciona en dev y en Pages)
    const baseUrl = new URL(import.meta.env.BASE_URL, location.origin).toString()

    // handlers supabase
    const onLogin = submitLogin(async ({ email, password }) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return alert(error.message)
        setOpenLogin(false)
        resetLogin()
    })

    const onRegister = submitRegister(async ({ email, password }) => {
        // 👇 FIX: forzar redirect al entorno actual (GitHub Pages en prod)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: baseUrl },
        })
        if (error) return alert(error.message)
        alert('Te enviamos un correo para confirmar la cuenta.')
        setOpenRegister(false)
        resetRegister()
    })

    const onForgot = async () => {
        try {
            setLoadingReset(true)
            const redirectTo = new URL(`${import.meta.env.BASE_URL}reset`, location.origin).toString()
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo })
            if (error) return alert(error.message)
            alert('Revisa tu correo para restablecer tu contraseña.')
            setOpenForgot(false)
            setResetEmail('')
        } finally {
            setLoadingReset(false)
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setAnchorEl(null)
    }

    const BRAND_BLUE = '#173760'

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: BRAND_BLUE,
                color: '#fff',
                backgroundImage: 'none !important',
                backdropFilter: 'none !important',
                boxShadow: 'none',
                py: 0,
            }}
        >
            <Toolbar
                variant="dense"
                disableGutters
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    width: '100%',
                    px: { xs: 2, md: 2 },
                    minHeight: { xs: 56, md: 60 },
                    alignItems: 'center',
                    gap: { xs: 1.25, md: 1.5 },
                }}
            >
                {/* Marca */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                    <Typography
                        component="div"
                        fontWeight={800}
                        sx={{
                            lineHeight: 1,
                            fontSize: { xs: 18, md: 20 },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        Tu Abogado en Tránsito
                    </Typography>
                </Box>

                {/* Navegación desktop */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, mr: 1 }}>
                    <Link href="#inicio" underline="none" sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff' } }}>
                        Inicio
                    </Link>
                    <Link href="#servicios" underline="none" sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff' } }}>
                        Servicios
                    </Link>
                    <Link href="#contacto" underline="none" sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#fff' } }}>
                        Contacto
                    </Link>
                </Box>

                {/* Auth / Usuario */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                    {!user ? (
                        <>
                            <Button color="inherit" onClick={() => setOpenLogin(true)}>Ingresar</Button>
                            <Button variant="contained" color="secondary" onClick={() => setOpenRegister(true)}>
                                Crear cuenta
                            </Button>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                                <Avatar sx={{ width: 36, height: 36 }}>
                                    {(user.email ?? 'U')[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem disabled>{user.email}</MenuItem>
                                <Divider />
                                {/* Acceso directo al CRUD de casos */}
                                <MenuItem component={RouterLink} to="/cases" onClick={() => setAnchorEl(null)}>
                                    Mis casos
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>

                {/* Menú móvil */}
                <IconButton
                    aria-label="abrir menú"
                    sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#fff' }}
                    onClick={() => setOpen(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                    <Box sx={{ width: 300, p: 2, bgcolor: BRAND_BLUE, color: '#fff', height: '100%' }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                            Tu Abogado en Tránsito
                        </Typography>

                        <List sx={{ color: '#fff' }}>
                            <ListItem disablePadding>
                                <ListItemButton component="a" href="#inicio" onClick={() => setOpen(false)}>
                                    <ListItemIcon sx={{ color: 'inherit' }}><HomeIcon /></ListItemIcon>
                                    <ListItemText primary="Inicio" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component="a" href="#servicios" onClick={() => setOpen(false)}>
                                    <ListItemIcon sx={{ color: 'inherit' }}><BuildIcon /></ListItemIcon>
                                    <ListItemText primary="Servicios" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component="a" href="#contacto" onClick={() => setOpen(false)}>
                                    <ListItemIcon sx={{ color: 'inherit' }}><MailIcon /></ListItemIcon>
                                    <ListItemText primary="Contacto" />
                                </ListItemButton>
                            </ListItem>
                        </List>

                        {/* acciones auth en móvil */}
                        {!user ? (
                            <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { setOpen(false); setOpenLogin(true) }}
                                >
                                    Ingresar
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => { setOpen(false); setOpenRegister(true) }}
                                >
                                    Crear cuenta
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to="/cases"
                                    onClick={() => setOpen(false)}
                                >
                                    Mis casos
                                </Button>
                                <Button fullWidth variant="outlined" color="inherit" onClick={logout}>
                                    Salir
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Drawer>
            </Toolbar>

            {/* ===== Dialog: Login ===== */}
            <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Ingresar</DialogTitle>
                <DialogContent dividers>
                    <Stack component="form" onSubmit={onLogin} gap={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Email"
                            type="email"
                            {...regLogin('email')}
                            error={!!eLogin.email}
                            helperText={eLogin.email?.message}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            {...regLogin('password')}
                            error={!!eLogin.password}
                            helperText={eLogin.password?.message}
                            fullWidth
                        />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Link
                                component="button"
                                type="button"
                                onClick={() => { setOpenLogin(false); setOpenForgot(true) }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                            <Button type="submit" variant="contained" disabled={loadingLogin}>
                                {loadingLogin ? <CircularProgress size={18} /> : 'Entrar'}
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenLogin(false); setOpenRegister(true) }}>Crear cuenta</Button>
                    <Button onClick={() => setOpenLogin(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* ===== Dialog: Registro ===== */}
            <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Crear cuenta</DialogTitle>
                <DialogContent dividers>
                    <Stack component="form" onSubmit={onRegister} gap={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Email"
                            type="email"
                            {...regRegister('email')}
                            error={!!eRegister.email}
                            helperText={eRegister.email?.message}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            {...regRegister('password')}
                            error={!!eRegister.password}
                            helperText={eRegister.password?.message}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" disabled={loadingRegister}>
                            {loadingRegister ? <CircularProgress size={18} /> : 'Registrarme'}
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenRegister(false); setOpenLogin(true) }}>Ya tengo cuenta</Button>
                    <Button onClick={() => setOpenRegister(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* ===== Dialog: Recuperar ===== */}
            <Dialog open={openForgot} onClose={() => setOpenForgot(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Recuperar contraseña</DialogTitle>
                <DialogContent dividers>
                    <Stack gap={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        <Typography variant="body2" color="text.secondary">
                            Te enviaremos un enlace para restablecer tu contraseña.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onForgot} variant="contained" disabled={loadingReset || !resetEmail}>
                        {loadingReset ? <CircularProgress size={18} /> : 'Enviar enlace'}
                    </Button>
                    <Button onClick={() => setOpenForgot(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    )
}
