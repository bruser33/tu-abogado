// src/components/organisms/cases/ActuationsDialog/ActuationsDialog.tsx
import { useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import UploadIcon from '@mui/icons-material/UploadFile'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    listActuaciones,
    createActuacion,
    updateActuacion,
    deleteActuacion,
    uploadActFile,
} from '@lib/actuationsApi'
import type { Actuacion } from '@lib/actuationsApi'

type Props = {
    open: boolean
    caseId: string
    onClose: () => void
    onChanged?: () => void
}

// ====== Validación con Zod ======
const schema = z.object({
    nombre: z.string().min(2, 'Mínimo 2 caracteres'),
    descripcion: z.string().optional(),
    entidades: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ActuationsDialog({ open, caseId, onClose, onChanged }: Props) {
    const qc = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [editingAct, setEditingAct] = useState<Actuacion | null>(null)

    // Resolver tipado
    const resolver: Resolver<FormData> = zodResolver(schema) as unknown as Resolver<FormData>

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver,
        defaultValues: { nombre: '', descripcion: '', entidades: '' },
    })

    // === Fetch actuaciones ===
    const { data: actuaciones, isLoading } = useQuery({
        queryKey: ['actuaciones', caseId],
        queryFn: () => listActuaciones(caseId),
        enabled: open && !!caseId,
    })

    // === Mutaciones CRUD ===
    const createMut = useMutation({
        mutationFn: (payload: { case_id: string; nombre: string; descripcion?: string; entidades?: string }) =>
            createActuacion(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['actuaciones', caseId] })
            onChanged?.()
        },
    })

    const updateMut = useMutation({
        mutationFn: (args: { id: string; patch: { nombre?: string; descripcion?: string; entidades?: string } }) =>
            updateActuacion(args),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['actuaciones', caseId] })
            onChanged?.()
        },
    })

    const deleteMut = useMutation({
        mutationFn: (id: string) => deleteActuacion(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['actuaciones', caseId] })
            onChanged?.()
        },
    })

    const uploadMut = useMutation({
        mutationFn: (args: { file: File; caseId: string }) => uploadActFile(args),
    })

    // === Handlers ===
    const onSubmit = handleSubmit(async (form) => {
        const payload = {
            case_id: caseId,
            nombre: form.nombre,
            descripcion: form.descripcion || '',
            entidades: form.entidades || '',
        }

        if (editingAct) {
            await updateMut.mutateAsync({
                id: editingAct.id,
                patch: {
                    nombre: payload.nombre,
                    descripcion: payload.descripcion,
                    entidades: payload.entidades,
                },
            })
        } else {
            await createMut.mutateAsync(payload)
        }

        setEditingAct(null)
        reset({ nombre: '', descripcion: '', entidades: '' })
    })

    const onEdit = (act: Actuacion) => {
        setEditingAct(act)
        reset({
            nombre: act.nombre ?? '',
            descripcion: act.descripcion ?? '',
            entidades: act.entidades ?? '',
        })
    }

    const onDelete = async (id: string) => {
        await deleteMut.mutateAsync(id)
        if (editingAct?.id === id) {
            setEditingAct(null)
            reset({ nombre: '', descripcion: '', entidades: '' })
        }
    }

    const onAddFilesClick = () => fileInputRef.current?.click()

    const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        for (const file of files) {
            await uploadMut.mutateAsync({ file, caseId })
        }
        e.target.value = ''
    }

    useEffect(() => {
        if (!open) {
            setEditingAct(null)
            reset({ nombre: '', descripcion: '', entidades: '' })
        }
    }, [open, reset])

    const saving = isSubmitting || createMut.isPending || updateMut.isPending

    // ======= UI =======
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{editingAct ? 'Editar actuación' : 'Nueva actuación'}</DialogTitle>

            <DialogContent dividers>
                {/* Form principal */}
                <Stack
                    key={editingAct?.id ?? 'new'}
                    component="form"
                    onSubmit={onSubmit}
                    gap={2}
                    sx={{ pt: 1 }}
                >
                    <TextField
                        label="Nombre"
                        fullWidth
                        autoFocus
                        autoComplete="off"
                        InputLabelProps={{ shrink: true }}
                        {...register('nombre')}
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        minRows={2}
                        autoComplete="off"
                        InputLabelProps={{ shrink: true }}
                        {...register('descripcion')}
                    />
                    <TextField
                        label="Entidades (opcional)"
                        fullWidth
                        autoComplete="off"
                        InputLabelProps={{ shrink: true }}
                        {...register('entidades')}
                    />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Lista de actuaciones */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Actuaciones del caso</Typography>
                    {isLoading && <CircularProgress size={16} />}
                </Stack>

                <List dense>
                    {(actuaciones ?? []).map((act: Actuacion) => (
                        <ListItem key={act.id} disableGutters divider>
                            <ListItemText
                                primary={act.nombre}
                                secondary={
                                    <>
                                        {act.descripcion && <span>{act.descripcion}</span>}
                                        {act.entidades && (
                                            <span style={{ marginLeft: 8, opacity: 0.7 }}>
                        · Entidades: {act.entidades}
                      </span>
                                        )}
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(act)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => onDelete(act.id)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}

                    {(!actuaciones || actuaciones.length === 0) && (
                        <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                            Aún no hay actuaciones registradas.
                        </Typography>
                    )}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Archivos */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Archivos del caso
                </Typography>
                <input ref={fileInputRef} type="file" multiple hidden onChange={onFilesSelected} />
                <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={onAddFilesClick}
                    disabled={uploadMut.isPending}
                >
                    Agregar archivos
                </Button>
                {uploadMut.isPending && (
                    <Typography variant="caption" sx={{ ml: 1 }}>
                        Subiendo…
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
                <Button onClick={onSubmit} variant="contained" disabled={saving}>
                    {saving ? (
                        <CircularProgress size={18} />
                    ) : editingAct ? (
                        'Guardar cambios'
                    ) : (
                        'Crear actuación'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
