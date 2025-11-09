import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useForm, type DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LegalCase } from '@lib/casesApi'

const schema = z.object({
    title: z.string().min(3),
    case_type: z.string().min(2),
    status: z.enum(['nuevo', 'en_progreso', 'suspendido', 'cerrado']),
    client_name: z.string().min(2),
    court: z.string().optional(),
    docket: z.string().optional(),
    opposing_party: z.string().optional(),
    next_hearing_at: z.string().optional(),
    value_amount: z.coerce.number().optional(),
    notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CaseForm({
                                     open,
                                     initial,
                                     onClose,
                                     onSubmit,
                                 }: {
    open: boolean
    initial?: Partial<LegalCase>
    onClose: () => void
    onSubmit: (data: FormData) => void
}) {
    const defaults: DefaultValues<FormData> = {
        title: '',
        case_type: 'transito',
        status: 'nuevo',
        client_name: '',
        court: '',
        docket: '',
        opposing_party: '',
        next_hearing_at: '',
        value_amount: undefined,
        notes: '',
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        // ⚠️ Forzamos any para evitar los TS2719/2558/2322 del build
        resolver: zodResolver(schema) as any,
        defaultValues: defaults as any,
    })

    useEffect(() => {
        reset({ ...(defaults as any), ...(initial as any) })
    }, [initial, reset])

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initial?.id ? 'Editar caso' : 'Nuevo caso'}</DialogTitle>
            <DialogContent dividers>
                <Box
                    sx={{
                        mt: 0.5,
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                    }}
                >
                    {/* fila 1 */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                        <TextField
                            label="Título"
                            fullWidth
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField label="Tipo" select fullWidth {...register('case_type')}>
                            {['transito', 'civil', 'laboral', 'penal', 'familia', 'otro'].map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField label="Estado" select fullWidth {...register('status')}>
                            {['nuevo', 'en_progreso', 'suspendido', 'cerrado'].map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* fila 2 */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                        <TextField
                            label="Cliente"
                            fullWidth
                            {...register('client_name')}
                            error={!!errors.client_name}
                            helperText={errors.client_name?.message}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField label="Tribunal" fullWidth {...register('court')} />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField label="RIT/RUC" fullWidth {...register('docket')} />
                    </Box>

                    {/* fila 3 */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                        <TextField label="Contraparte" fullWidth {...register('opposing_party')} />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField
                            label="Próx. audiencia"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...register('next_hearing_at')}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField label="Monto" type="number" fullWidth {...register('value_amount' as any)} />
                    </Box>

                    {/* fila 4 */}
                    <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField label="Notas" fullWidth multiline minRows={3} {...register('notes')} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                {/* Forzamos el tipo en handleSubmit para evitar TS2345 */}
                <Button
                    onClick={handleSubmit((d) => onSubmit(d as any))}
                    variant="contained"
                    disabled={isSubmitting}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
