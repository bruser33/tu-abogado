import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import SectionTitle from '@/components/atoms/SectionTitle';

export default function Contact() {
    return (
        <Box
            sx={{
                bgcolor: '#173760',
                py: { xs: 4, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <SectionTitle id="contacto">Contacto</SectionTitle>

                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(6px)',
                    }}
                >
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField fullWidth label="Nombre" variant="outlined" />
                            <TextField fullWidth label="Teléfono" variant="outlined" />
                        </Stack>
                        <TextField fullWidth label="Email" variant="outlined" />
                        <TextField fullWidth label="Mensaje" variant="outlined" multiline rows={4} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<WhatsAppIcon />}
                                sx={{ color: '#fff', flex: 1 }}
                                onClick={() => window.open('https://wa.me/56912345678', '_blank', 'noopener')}
                            >
                                WhatsApp
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<CallIcon />}
                                sx={{ color: '#fff', flex: 1 }}
                                onClick={() => window.open('tel:+56912345678', '_self')}
                            >
                                Llamar
                            </Button>
                            {/* Si luego integras backend/email, aquí va el submit */}
                        </Stack>

                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            También atendemos por correo: contacto@tuabogado.cl
                        </Typography>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
