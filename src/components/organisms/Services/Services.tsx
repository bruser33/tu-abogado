import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BalanceIcon from '@mui/icons-material/Balance';
import SectionTitle from "@atoms/SectionTitle";
import LawServices from "@molecules/LawServices";
const services = [
    {
        icon: <DirectionsCarFilledIcon />,
        title: 'Tránsito y comparendos',
        desc: 'Defensas, apelaciones, y asesoría integral en infracciones de tránsito.',
    },
    {
        icon: <GavelIcon />,
        title: 'Representación judicial',
        desc: 'Demandas, contestaciones, audiencias y medidas cautelares.',
    },
    {
        icon: <LocalPoliceIcon />,
        title: 'Accidentes de tránsito',
        desc: 'Responsabilidad civil, seguros, indemnizaciones y acuerdos.',
    },
    {
        icon: <BalanceIcon />,
        title: 'Contratos & asesoría',
        desc: 'Redacción y revisión de contratos. Orientación legal preventiva.',
    },
];

export default function Services() {
    return (
        <Box
            sx={{
                bgcolor: '#173760',
                py: { xs: 4, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <SectionTitle id="servicios">Servicios</SectionTitle>

                {/* Carrusel scroll-snap */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        pb: 1,
                        '& > *': { scrollSnapAlign: 'start' },
                        // Ocultar scrollbar visual (sin romper scroll)
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}
                >
                    {services.map((s) => (
                        <LawServices key={s.title} icon={s.icon} title={s.title} desc={s.desc} />
                    ))}
                </Box>

                {/* Dots simples (opcionales). Si quieres, se pueden activar con JS */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="center">
                    {[0, 1, 2, 3].map((i) => (
                        <Box key={i} sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.35)'
                        }} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
