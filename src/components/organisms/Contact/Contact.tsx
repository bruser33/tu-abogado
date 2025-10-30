import { useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import { alpha } from '@mui/material/styles';
import SectionTitle from '@atoms/SectionTitle';

const WHATSAPP_NUMBER = '+56912345678';      // <-- cámbialo si corresponde
const BRAND_BLUE = '#173760';                // azul de fondo (mismo Hero)
const CALL_BLUE  = '#4FB5FF';                // azul claro para "Llamar"
const CALL_BLUE_HOVER = '#3AA9FB';           // hover un poco más oscuro

function normalizePhone(s: string) {
    return s.replace(/[^\d+]/g, '');
}
function waUrl(number: string, text: string) {
    const n = normalizePhone(number).replace(/^\+/, '');
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export default function Contact() {
    // refs para leer los valores sin volver controlados los inputs
    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const msgRef = useRef<HTMLTextAreaElement>(null);

    const sendWhatsApp = () => {
        const name = nameRef.current?.value?.trim() || '';
        const phone = phoneRef.current?.value?.trim() || '';
        const email = emailRef.current?.value?.trim() || '';
        const message = msgRef.current?.value?.trim() || '';
        const payload = [
            '*Nuevo contacto desde la web*',
            name && `Nombre: ${name}`,
            phone && `Teléfono: ${normalizePhone(phone)}`,
            email && `Email: ${email}`,
            'Mensaje:',
            message || 'Hola, me gustaría recibir asesoría.',
            '—',
            `Origen: ${typeof window !== 'undefined' ? window.location.href : 'web'}`,
        ]
            .filter(Boolean)
            .join('\n');

        window.open(waUrl(WHATSAPP_NUMBER, payload), '_blank', 'noopener,noreferrer');
    };

    return (
        <Box sx={{ bgcolor: BRAND_BLUE, py: { xs: 4, md: 6 } }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <SectionTitle id="contacto">Contacto</SectionTitle>

                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        bgcolor: alpha('#ffffff', 0.06),
                        color: '#fff',
                        border: `1px solid ${alpha('#ffffff', 0.18)}`,
                        backdropFilter: 'blur(6px)',
                    }}
                >
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                variant="outlined"
                                inputRef={nameRef}
                                InputLabelProps={{ sx: { color: alpha('#fff', 0.9) } }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: '#fff',
                                        backgroundColor: alpha('#ffffff', 0.06),
                                        borderRadius: 3,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.2) },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.35) },
                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#9BE15D',
                                        boxShadow: `0 0 0 2px ${alpha('#9BE15D', 0.25)}`,
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Teléfono"
                                variant="outlined"
                                type="tel"
                                inputRef={phoneRef}
                                placeholder="+56 9 1234 5678"
                                InputLabelProps={{ sx: { color: alpha('#fff', 0.9) } }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: '#fff',
                                        backgroundColor: alpha('#ffffff', 0.06),
                                        borderRadius: 3,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.2) },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.35) },
                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#9BE15D',
                                        boxShadow: `0 0 0 2px ${alpha('#9BE15D', 0.25)}`,
                                    },
                                }}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            label="Email (opcional)"
                            variant="outlined"
                            type="email"
                            inputRef={emailRef}
                            InputLabelProps={{ sx: { color: alpha('#fff', 0.9) } }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: '#fff',
                                    backgroundColor: alpha('#ffffff', 0.06),
                                    borderRadius: 3,
                                },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.2) },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.35) },
                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#9BE15D',
                                    boxShadow: `0 0 0 2px ${alpha('#9BE15D', 0.25)}`,
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Mensaje"
                            variant="outlined"
                            multiline
                            rows={4}
                            inputRef={msgRef}
                            InputLabelProps={{ sx: { color: alpha('#fff', 0.9) } }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: '#fff',
                                    backgroundColor: alpha('#ffffff', 0.06),
                                    borderRadius: 3,
                                },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.2) },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#ffffff', 0.35) },
                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#9BE15D',
                                    boxShadow: `0 0 0 2px ${alpha('#9BE15D', 0.25)}`,
                                },
                            }}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Button
                                variant="contained"
                                startIcon={<WhatsAppIcon />}
                                onClick={sendWhatsApp}
                                sx={{
                                    flex: 1,
                                    fontWeight: 700,
                                    bgcolor: '#25D366',          // verde WhatsApp
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#1EC65C' },
                                }}
                            >
                                Enviar por WhatsApp
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<CallIcon />}
                                sx={{
                                    flex: 1,
                                    fontWeight: 700,
                                    bgcolor: CALL_BLUE,          // azul claro como en Hero
                                    color: '#fff',
                                    '&:hover': { bgcolor: CALL_BLUE_HOVER },
                                }}
                                onClick={() =>
                                    window.open(`tel:${normalizePhone(WHATSAPP_NUMBER)}`, '_self')
                                }
                            >
                                Llamar
                            </Button>
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
