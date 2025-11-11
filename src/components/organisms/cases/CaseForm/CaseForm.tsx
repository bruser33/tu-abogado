import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { useForm, type DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LegalCase } from '@lib/casesApi'

/** === Form schema (coincide con tu LegalCase actual) === */
const schema = z.object({
    cedula_demandante: z.string().min(3, 'Requerido'),
    demandados_csv: z.string().default(''), // string garantizada
    tipo: z.enum(['transito', 'civil', 'penal', 'terrorista']),
    juzgado: z.string().min(2, 'Requerido'),
    numero_radicado: z.string().min(1, 'Requerido'),
})

type FormData = z.infer<typeof schema>
const TIPO_OPTS: Array<FormData['tipo']> = ['transito', 'civil', 'penal', 'terrorista']

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
        cedula_demandante: initial?.cedula_demandante ?? '',
        demandados_csv: (initial?.demandados ?? []).join(', '),
        tipo: (initial?.tipo as FormData['tipo']) ?? 'transito',
        juzgado: initial?.juzgado ?? '',
        numero_radicado: initial?.numero_radicado ?? '',
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        // ✅ Fix de tipos: forzamos el resolver para evitar el choque del genérico
        resolver: zodResolver(schema) as any,
        defaultValues: defaults,
    })

    useEffect(() => {
        reset({
            cedula_demandante: initial?.cedula_demandante ?? '',
            demandados_csv: (initial?.demandados ?? []).join(', '),
            tipo: (initial?.tipo as FormData['tipo']) ?? 'transito',
            juzgado: initial?.juzgado ?? '',
            numero_radicado: initial?.numero_radicado ?? '',
        })
    }, [initial, reset])

    const submit = handleSubmit((form) => {
        const demandados = form.demandados_csv
            ? form.demandados_csv
                .split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
            : []

        const payload: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'> = {
            cedula_demandante: form.cedula_demandante,
            demandados,
            tipo: form.tipo,
            juzgado: form.juzgado,
            numero_radicado: form.numero_radicado,
            // No incluimos assigned_lawyer porque no está en tu LegalCase actual
        }

        onSubmit(payload)
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
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    }}
                >
                    <TextField
                        label="Cédula demandante"
                        fullWidth
                        {...register('cedula_demandante')}
                        error={!!errors.cedula_demandante}
                        helperText={errors.cedula_demandante?.message}
                    />

                    <TextField
                        label="Demandados (separados por coma)"
                        fullWidth
                        {...register('demandados_csv')}
                        placeholder="Ej: Juan Pérez, Empresa XYZ"
                    />

                    <TextField label="Tipo" select fullWidth {...register('tipo')}>
                        {TIPO_OPTS.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Juzgado"
                        fullWidth
                        {...register('juzgado')}
                        error={!!errors.juzgado}
                        helperText={errors.juzgado?.message}
                        placeholder="Ej: Juzgado 3º Civil de Medellín"
                    />

                    <TextField
                        label="Número radicado"
                        fullWidth
                        {...register('numero_radicado')}
                        error={!!errors.numero_radicado}
                        helperText={errors.numero_radicado?.message}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Stack direction="row" gap={1}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={submit} variant="contained" disabled={isSubmitting}>
                        Guardar
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}
