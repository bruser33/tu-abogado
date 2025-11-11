import { useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
    type Actuacion,
    listActuaciones,
    createActuacion,
    updateActuacion,
    deleteActuacion,
    uploadActFile,
    getPublicUrl,
} from '@lib/actuationsApi'

export default function ActuationsDialog({
                                             open, onClose, caseId, title,
                                         }: {
    open: boolean
    onClose: () => void
    caseId?: string
    title?: string
}) {
    const qc = useQueryClient()
    const enabled = !!caseId

    const { data } = useQuery({
        queryKey: ['acts', caseId],
        queryFn: () => listActuaciones(caseId!),
        enabled,
    })

    // form state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [nombre, setNombre] = useState<string>('')
    const [descripcion, setDescripcion] = useState<string>('')
    const [entidades, setEntidades] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [adjuntosExistentes, setAdjuntosExistentes] = useState<string[]>([])

    const createMut = useMutation({
        mutationFn: createActuacion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['acts', caseId] }),
    })
    const updateMut = useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateActuacion>[1] }) =>
            updateActuacion(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['acts', caseId] }),
    })
    const deleteMut = useMutation({
        mutationFn: deleteActuacion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['acts', caseId] }),
    })

    const acts: Actuacion[] = useMemo(() => data ?? [], [data])

    const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return
        setFiles(Array.from(e.target.files))
    }

    const resetForm = () => {
        setEditingId(null)
        setNombre('')
        setDescripcion('')
        setEntidades('')
        setFiles([])
        setAdjuntosExistentes([])
    }

    const onEdit = (a: Actuacion) => {
        setEditingId(a.id)
        setNombre(a.nombre ?? '')
        setDescripcion(a.descripcion ?? '')
        setEntidades(a.entidades ?? '')
        setAdjuntosExistentes(Array.isArray(a.adjuntos) ? a.adjuntos : [])
        setFiles([])
    }

    const onRemoveExisting = (path: string) => {
        setAdjuntosExistentes(prev => prev.filter(p => p !== path))
    }

    const onCreate = async () => {
        if (!caseId || !nombre.trim()) return

        const paths: string[] = []
        for (const f of files) {
            const p = await uploadActFile(f, caseId)
            paths.push(p)
        }

        await createMut.mutateAsync({
            case_id: caseId,
            nombre: nombre.trim(),
            descripcion: descripcion.trim() || undefined,
            entidades: entidades.trim() || undefined,
            adjuntos: paths.length ? paths : undefined,
        })

        resetForm()
    }

    const onUpdate = async () => {
        if (!editingId) return

        const newPaths: string[] = []
        if (caseId) {
            for (const f of files) {
                const p = await uploadActFile(f, caseId)
                newPaths.push(p)
            }
        }

        // adjuntos = existentes (posiblem. removidos) + nuevos
        const mergedAdjuntos = [...adjuntosExistentes, ...newPaths]

        await updateMut.mutateAsync({
            id: editingId,
            patch: {
                nombre: nombre.trim() || undefined,
                descripcion: descripcion.trim() || undefined,
                entidades: entidades.trim() || undefined,
                adjuntos: mergedAdjuntos.length ? mergedAdjuntos : [],
            },
        })

        resetForm()
    }

    const primaryActionDisabled = !nombre.trim() || (editingId ? false : !caseId)

    return (
        <Dialog open={open} onClose={() => { onClose(); resetForm() }} maxWidth="md" fullWidth>
            <DialogTitle>{title ?? 'Actuaciones'}</DialogTitle>
            <DialogContent dividers>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mb: 2 }}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        label="Entidades (opcional)"
                        fullWidth
                        value={entidades}
                        onChange={(e) => setEntidades(e.target.value)}
                    />
                </Stack>

                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ mb: 2 }}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                {/* Adjuntos existentes (solo en edición) */}
                {editingId && adjuntosExistentes.length > 0 && (
                    <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        {adjuntosExistentes.map((p) => {
                            const url = getPublicUrl(p)
                            return (
                                <Chip
                                    key={p}
                                    label={<a href={url} target="_blank" rel="noreferrer">adjunto</a>}
                                    onDelete={() => onRemoveExisting(p)}
                                />
                            )
                        })}
                    </Stack>
                )}

                <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 2 }}>
                    <Button component="label" startIcon={<UploadFileIcon />}>
                        {editingId ? 'Agregar archivos' : 'Adjuntar archivos'}
                        <input type="file" hidden multiple onChange={onPickFiles} />
                    </Button>
                    {files.map((f: File) => <Chip key={f.name} label={f.name} />)}
                </Stack>

                <List dense>
                    {acts.map((a: Actuacion) => (
                        <ListItem
                            key={a.id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" onClick={() => onEdit(a)} sx={{ mr: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => deleteMut.mutate(a.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={a.nombre}
                                secondary={
                                    <>
                                        {a.entidades ? `Entidades: ${a.entidades} — ` : ''}
                                        {a.descripcion ?? ''}
                                        {(a.adjuntos && a.adjuntos.length > 0) && (
                                            <>
                                                {' — Adjuntos: '}
                                                {a.adjuntos.map((p: string, idx: number, arr: string[]) => {
                                                    const url = getPublicUrl(p)
                                                    return (
                                                        <span key={p}>
                              <a href={url} target="_blank" rel="noreferrer">archivo{idx + 1}</a>
                                                            {idx < arr.length - 1 ? ', ' : ''}
                            </span>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                    {acts.length === 0 && (
                        <ListItem>
                            <ListItemText primary="Sin actuaciones." />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                {editingId && (
                    <Button onClick={resetForm} color="inherit">
                        Cancelar edición
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={editingId ? onUpdate : onCreate}
                    disabled={primaryActionDisabled}
                >
                    {editingId ? 'Guardar cambios' : 'Agregar'}
                </Button>
                <Button onClick={() => { onClose(); resetForm() }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
