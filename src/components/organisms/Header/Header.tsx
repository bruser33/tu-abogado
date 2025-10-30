import { useState } from 'react'
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
import CallIcon from '@mui/icons-material/Call'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import HomeIcon from '@mui/icons-material/Home'
import BuildIcon from '@mui/icons-material/Build'
import MailIcon from '@mui/icons-material/Mail'

export default function Header() {
    const [open, setOpen] = useState(false)

    const BRAND_BLUE = '#173760'
    const BRAND_BLUE_ALT = '#406B8E'

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
                    py: 0,
                    minHeight: { xs: 56, md: 60 },
                    alignItems: 'center',
                    gap: { xs: 1.25, md: 1.5 },
                }}
            >
                {/* Marca (sin logo ni subtítulo) */}
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

                {/* Botones compactos */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.5)',
                            py: 0.5,
                            px: 1.25,
                            '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                        }}
                        startIcon={<CallIcon fontSize="small" />}
                        onClick={() => window.open('tel:+56912345678', '_self')}
                    >
                        +56 9 1234 5678
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{
                            color: '#fff',
                            bgcolor: BRAND_BLUE_ALT,
                            py: 0.5,
                            px: 1.25,
                            '&:hover': { bgcolor: '#355E81' },
                        }}
                        startIcon={<WhatsAppIcon fontSize="small" />}
                        onClick={() => window.open('https://wa.me/56912345678', '_blank', 'noopener')}
                    >
                        Contáctanos
                    </Button>
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
                        {/* Encabezado del drawer sin logo ni subtítulo */}
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
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    )
}
