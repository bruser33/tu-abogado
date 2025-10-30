import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = {
    icon?: React.ReactNode;
    title: string;
    desc: string;
};

export default function LawServices({ icon, title, desc }: Props) {
    return (
        <Paper
            elevation={3}
            sx={{
                minWidth: { xs: 260, sm: 300, md: 340 },
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(6px)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.25 }}>
                {icon && <Box sx={{ fontSize: 34, lineHeight: 0 }}>{icon}</Box>}
                <Typography variant="h6" fontWeight={800}>{title}</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {desc}
            </Typography>
        </Paper>
    );
}
