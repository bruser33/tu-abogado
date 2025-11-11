import { useState, useMemo } from 'react'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DescriptionIcon from '@mui/icons-material/Description'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCases, createCase, updateCase, deleteCase, type LegalCase } from '@lib/casesApi'
import CaseForm from '@organisms/cases/CaseForm/CaseForm'
import ActuationsDialog from '@organisms/cases/ActuationsDialog/ActuationsDialog'
import {useAuth} from "../../../auth/AuthProvider.tsx";

export default function CasesPage() {
    const { user } = useAuth()
    const qc = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['cases'],
        queryFn: listCases,
    })

    const [openForm, setOpenForm] = useState(false)
    const [editingCase, setEditingCase] = useState<LegalCase | null>(null)

    // Estado para ver/editar ACTUACIONES
    const [openActs, setOpenActs] = useState(false)
    const [actsCaseId, setActsCaseId] = useState<string | null>(null)

    const createMut = useMutation({
        mutationFn: createCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const updateMut = useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<LegalCase> }) => updateCase(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const deleteMut = useMutation({
        mutationFn: deleteCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const rows = useMemo(() => data ?? [], [data])

    const onCreate = () => {
        setEditingCase(null)
        setOpenForm(true)
    }

    const onEdit = (row: LegalCase) => {
        setEditingCase(row)
        setOpenForm(true)
    }

    const onOpenActs = (row: LegalCase) => {
        setActsCaseId(row.id)
        setOpenActs(true)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Mis casos</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>
                    Nuevo caso
                </Button>
            </Stack>

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cédula demandante</TableCell>
                            <TableCell>Demandados</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Juzgado</TableCell>
                            <TableCell>Nº radicado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Cargando…</TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>No hay casos aún.</TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.cedula_demandante || '—'}</TableCell>
                                    <TableCell>
                                        {Array.isArray(row.demandados) && row.demandados.length > 0
                                            ? row.demandados.join(', ')
                                            : '—'}
                                    </TableCell>
                                    <TableCell>{row.tipo}</TableCell>
                                    <TableCell>{row.juzgado}</TableCell>
                                    <TableCell>{row.numero_radicado || '—'}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Actuaciones">
                                            <IconButton onClick={() => onOpenActs(row)}>
                                                <DescriptionIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton onClick={() => onEdit(row)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton color="error" onClick={() => deleteMut.mutate(row.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Formulario crear/editar caso */}
            <CaseForm
                open={openForm}
                initial={editingCase ?? undefined}
                onClose={() => setOpenForm(false)}
                onSubmit={async (form) => {
                    if (!user) return
                    if (editingCase) {
                        await updateMut.mutateAsync({ id: editingCase.id, patch: form })
                    } else {
                        await createMut.mutateAsync(form)
                    }
                    setOpenForm(false)
                }}
            />

            {/* Diálogo de Actuaciones */}
            <ActuationsDialog
                open={openActs}
                caseId={actsCaseId ?? ''}
                onClose={() => setOpenActs(false)}
            />
        </Container>
    )
}
