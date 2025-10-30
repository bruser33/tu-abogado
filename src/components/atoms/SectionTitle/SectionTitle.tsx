import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = { id?: string; children: React.ReactNode };

export default function SectionTitle({ id, children }: Props) {
    return (
        <Box id={id} sx={{ mb: 2, scrollMarginTop: '72px' /* compensa header */ }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#fff' }}>
                {children}
            </Typography>
        </Box>
    );
}
