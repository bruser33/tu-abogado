import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CallIcon from '@mui/icons-material/Call'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function Hero() {
    const BRAND_BLUE = '#173760'

    return (
        <Box
            id="inicio"
            sx={{
                position: 'relative',
                minHeight: { xs: 520, md: 640 },
                display: 'flex',
                alignItems: 'center',
                bgcolor: BRAND_BLUE,
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            position: 'relative',
                            p: { xs: 2, md: 4 },
                            borderRadius: { xs: 0, md: 3 },                 // sin bordes redondeados en mobile
                            overflow: 'hidden',
                            bgcolor: 'transparent',
                            boxShadow: { xs: 'none', md: '0 10px 30px rgba(0,0,0,.25)' }, // sin sombra en mobile
                        }}
                    >
                        {/* Vidrio SOLO en desktop/tablet */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },          // <- oculto en mobile
                                position: 'absolute',
                                inset: 0,
                                left: { md: '40%' },
                                bgcolor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(6px)',
                                pointerEvents: 'none',
                            }}
                        />

                        <Box
                            sx={{
                                position: 'relative',
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' },
                                gap: { xs: 2, md: 3.5 },
                                alignItems: 'center',
                                color: '#fff',
                                textAlign: 'center',
                            }}
                        >
                            {/* Logo a la izquierda (arriba en mobile) */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box
                                    component="img"
                                    src="/tu-abogado.png"
                                    alt="Tu Abogado en Tránsito"
                                    sx={{ width: { xs: '70%', sm: '60%', md: '80%' }, maxWidth: 420, height: 'auto', display: 'block' }}
                                />
                            </Box>

                            {/* Contenido a la derecha (centrado) */}
                            <Box>
                                <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
                                    Asesoría legal clara y rápida en la Región Metropolitana. Tramitación eficiente y atención profesional.
                                </Typography>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ color: '#fff' }}
                                        startIcon={<WhatsAppIcon />}
                                        onClick={() => window.open('https://wa.me/56912345678', '_blank', 'noopener')}
                                    >
                                        Contáctanos
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ color: '#fff' }}
                                        startIcon={<CallIcon />}
                                        onClick={() => window.open('tel:+56912345678', '_self')}
                                    >
                                        Llamar
                                    </Button>
                                </Stack>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                        justifyItems: 'center',
                                        gap: 1.5,
                                        color: 'rgba(255,255,255,0.92)',
                                    }}
                                >
                                    {['Atención rápida', 'Profesionales certificados', 'Respuestas claras', 'Precios transparentes'].map(
                                        (txt) => (
                                            <Box key={txt} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleIcon fontSize="small" />
                                                <Typography variant="body2">{txt}</Typography>
                                            </Box>
                                        ),
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}
