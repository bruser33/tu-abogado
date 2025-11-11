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
    cedula_demandante: z.string().min(3, 'Requerida'),
    demandados_text: z.string().optional(), // UI simple: coma-separado
    tipo: z.enum(['transito', 'civil', 'penal', 'terrorista']),
    juzgado_tipo: z.enum(['regional', 'departamental', 'otro']),
    juzgado_nombre: z.string().min(2, 'Requerido'),
    numero_radicado: z.string().min(2, 'Requerido'),
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
    onSubmit: (data: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>) => void
}) {
    const defaults: DefaultValues<FormData> = {
        cedula_demandante: '',
        demandados_text: '',
        tipo: 'transito',
        juzgado_tipo: 'regional',
        juzgado_nombre: '',
        numero_radicado: '',
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm<FormData>({ resolver: zodResolver(schema), defaultValues: defaults })

    useEffect(() => {
        if (!initial) { reset(defaults); return }
        reset({
            cedula_demandante: initial.cedula_demandante ?? '',
            demandados_text: Array.isArray(initial.demandados) ? initial.demandados.join(', ') : '',
            tipo: (initial.tipo as any) ?? 'transito',
            juzgado_tipo: (initial.juzgado_tipo as any) ?? 'regional',
            juzgado_nombre: initial.juzgado_nombre ?? '',
            numero_radicado: initial.numero_radicado ?? '',
        })
    }, [initial, reset])

    const submit = handleSubmit((form) => {
        const demandados = (form.demandados_text ?? '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)

        // NO enviar assigned_lawyer desde el form (lo agrega el caller en create)
        onSubmit({
            cedula_demandante: form.cedula_demandante,
            demandados,
            tipo: form.tipo,
            juzgado_tipo: form.juzgado_tipo,
            juzgado_nombre: form.juzgado_nombre,
            numero_radicado: form.numero_radicado,
            assigned_lawyer: (initial?.assigned_lawyer ?? '') as string, // ignorado en update por cleanCasePayload si viene vacío
        } as Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>)
    })

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
                            label="Cédula Demandante"
                            fullWidth
                            {...register('cedula_demandante')}
                            error={!!errors.cedula_demandante}
                            helperText={errors.cedula_demandante?.message}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField select label="Tipo de caso" fullWidth {...register('tipo')}>
                            {['transito', 'civil', 'penal', 'terrorista'].map(t => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                        <TextField select label="Juzgado (tipo)" fullWidth {...register('juzgado_tipo')}>
                            {['regional', 'departamental', 'otro'].map(t => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* fila 2 */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                        <TextField
                            label="Nombre del Juzgado"
                            fullWidth
                            {...register('juzgado_nombre')}
                            error={!!errors.juzgado_nombre}
                            helperText={errors.juzgado_nombre?.message}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                        <TextField
                            label="Número de Radicado"
                            fullWidth
                            {...register('numero_radicado')}
                            error={!!errors.numero_radicado}
                            helperText={errors.numero_radicado?.message}
                        />
                    </Box>

                    {/* fila 3 */}
                    <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField
                            label="Demandados (separar por coma)"
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="Juan Pérez, ACME Ltda., ..."
                            {...register('demandados_text')}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={submit} variant="contained" disabled={isSubmitting}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
