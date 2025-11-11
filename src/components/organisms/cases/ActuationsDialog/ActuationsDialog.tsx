// src/components/organisms/cases/ActuationsDialog/ActuationsDialog.tsx
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
import Chip from '@mui/material/Chip'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    type Actuacion,
    listActuaciones,
    createActuacion,
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

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [entidades, setEntidades] = useState('')
    const [files, setFiles] = useState<File[]>([])

    const createMut = useMutation({
        mutationFn: createActuacion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['acts', caseId] }),
    })
    const deleteMut = useMutation({
        mutationFn: deleteActuacion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['acts', caseId] }),
    })

    const acts = useMemo(() => data ?? [], [data])

    const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return
        setFiles(Array.from(e.target.files))
    }

    const onCreate = async () => {
        if (!caseId || !nombre.trim()) return
        const paths: string[] = []
        for (const f of files) {
            const p = await uploadActFile(f, caseId)
            paths.push(p)
        }
        // ✅ payload SOLO con campos permitidos por Omit<Actuacion, 'id'|'created_at'|'updated_at'>
        await createMut.mutateAsync({
            case_id: caseId,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            entidades: entidades.trim() || null,
            adjuntos: paths.length ? paths : null,
        })
        setNombre(''); setDescripcion(''); setEntidades(''); setFiles([])
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title ?? 'Actuaciones'}</DialogTitle>
            <DialogContent dividers>
                {/* Formulario simple */}
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mb: 2 }}>
                    <TextField label="Nombre" fullWidth value={nombre} onChange={e => setNombre(e.target.value)} />
                    <TextField label="Entidades (opcional)" fullWidth value={entidades} onChange={e => setEntidades(e.target.value)} />
                </Stack>
                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ mb: 2 }}
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />

                <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 2 }}>
                    <Button component="label" startIcon={<UploadFileIcon />}>
                        Adjuntar archivos
                        <input type="file" hidden multiple onChange={onPickFiles} />
                    </Button>
                    {files.map(f => <Chip key={f.name} label={f.name} />)}
                </Stack>

                {/* Lista */}
                <List dense>
                    {acts.map((a: Actuacion) => (
                        <ListItem
                            key={a.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => deleteMut.mutate(a.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={a.nombre}
                                secondary={
                                    <>
                                        {a.entidades ? `Entidades: ${a.entidades} — ` : ''}
                                        {a.descripcion}
                                        {Array.isArray(a.adjuntos) && a.adjuntos.length > 0 && (
                                            <>
                                                {' — Adjuntos: '}
                                                {a.adjuntos.map((p, idx) => {
                                                    const url = getPublicUrl(p)
                                                    return <a key={p} href={url} target="_blank" rel="noreferrer">archivo{idx + 1}</a>
                                                }).reduce((prev, curr) => prev === null ? [curr] : [...prev, ', ', curr], null as any)}
                                            </>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                    {acts.length === 0 && <ListItem><ListItemText primary="Sin actuaciones." /></ListItem>}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
                <Button variant="contained" onClick={onCreate} disabled={!caseId || !nombre.trim()}>Agregar</Button>
            </DialogActions>
        </Dialog>
    )
}
