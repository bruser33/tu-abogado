// src/components/organisms/cases/CaseForm/CaseForm.tsx
import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useForm, type DefaultValues, type SubmitHandler, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LegalCase } from '@lib/casesApi'

/** Form: usamos CSV para demandados en la UI y lo convertimos a string[] */
const schema = z.object({
    cedula_demandante: z.string().min(1, 'Requerido'),
    demandados_csv: z.string().optional().default(''), // con default, Zod infiere string
    tipo: z.enum(['transito', 'civil', 'penal', 'terrorista']),
    juzgado: z.string().min(1, 'Requerido'),
    numero_radicado: z.string().min(1, 'Requerido'),
})

type FormData = z.infer<typeof schema>

export default function CaseForm(props: {
    open: boolean
    initial?: Partial<LegalCase>
    onClose: () => void
    onSubmit: (data: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>) => void
}) {
    const { open, initial, onClose, onSubmit } = props

    const defaults: DefaultValues<FormData> = {
        cedula_demandante: initial?.cedula_demandante ?? '',
        demandados_csv: Array.isArray(initial?.demandados) ? initial!.demandados.join(', ') : '',
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
        // 🔧 Fix de tipos del resolver
        resolver: zodResolver(schema) as unknown as Resolver<FormData>,
        defaultValues: defaults,
    })

    useEffect(() => {
        reset(defaults)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // 🔧 Tipar como SubmitHandler<FormData> para que case con handleSubmit
    const submit: SubmitHandler<FormData> = (form) => {
        const demandados = (form.demandados_csv ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

        const payload: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'> = {
            cedula_demandante: form.cedula_demandante,
            demandados,
            tipo: form.tipo,
            juzgado: form.juzgado,
            numero_radicado: form.numero_radicado,
            assigned_lawyer: (initial?.assigned_lawyer ?? '') as string,
            // estos campos los rellena la BD; se ignoran en insert/update
            created_at: '' as any,
            updated_at: '' as any,
            id: '' as any,
        } as any

        onSubmit(payload)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initial?.id ? 'Editar caso' : 'Nuevo caso'}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
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
                        error={!!errors.demandados_csv}
                        helperText={errors.demandados_csv?.message}
                    />

                    <TextField
                        select
                        label="Tipo"
                        fullWidth
                        {...register('tipo')}
                        error={!!errors.tipo}
                        helperText={errors.tipo?.message}
                    >
                        {['transito', 'civil', 'penal', 'terrorista'].map((t) => (
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
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit(submit)}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
