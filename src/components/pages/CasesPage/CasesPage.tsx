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
import RuleFolderIcon from '@mui/icons-material/RuleFolder'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { listCases, createCase, updateCase, deleteCase, type LegalCase } from '@lib/casesApi'
import { useAuth } from '@auth/AuthProvider'
import CaseForm from '@cases/CaseForm/CaseForm'
import ActuationsDialog from '@cases/ActuationsDialog/ActuationsDialog'

export default function CasesPage() {
    const { user } = useAuth()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: ['cases'], queryFn: listCases })
    const [openForm, setOpenForm] = useState(false)
    const [editing, setEditing] = useState<LegalCase | null>(null)
    const [openActs, setOpenActs] = useState<{ open: boolean; caseId?: string; caseTitle?: string }>({ open: false })

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

    const onCreate = () => { setEditing(null); setOpenForm(true) }
    const onEdit = (row: LegalCase) => { setEditing(row); setOpenForm(true) }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Mis casos</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>Nuevo caso</Button>
            </Stack>

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Radicado</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Juzgado</TableCell>
                            <TableCell>Demandante (Cédula)</TableCell>
                            <TableCell>Demandados</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6}>Cargando…</TableCell></TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow><TableCell colSpan={6}>No hay casos aún.</TableCell></TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} hover>
                                <TableCell>{row.numero_radicado || '-'}</TableCell>
                                <TableCell>{row.tipo}</TableCell>
                                <TableCell>{`${row.juzgado_tipo} — ${row.juzgado_nombre}`}</TableCell>
                                <TableCell>{row.cedula_demandante || '-'}</TableCell>
                                <TableCell>{(row.demandados ?? []).join(', ') || '-'}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Actuaciones">
                                        <IconButton onClick={() => setOpenActs({ open: true, caseId: row.id, caseTitle: row.numero_radicado || row.id })}>
                                            <RuleFolderIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => onEdit(row)}><EditIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => deleteMut.mutate(row.id)}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <CaseForm
                open={openForm}
                initial={editing ?? undefined}
                onClose={() => setOpenForm(false)}
                onSubmit={async (form) => {
                    if (!user) return
                    if (editing) {
                        // UPDATE sin assigned_lawyer
                        const { assigned_lawyer, ...patch } = form as Partial<LegalCase>
                        await updateMut.mutateAsync({ id: editing.id, patch })
                    } else {
                        // CREATE con assigned_lawyer
                        await createMut.mutateAsync({ ...form, assigned_lawyer: user.id })
                    }
                    setOpenForm(false)
                }}
            />

            <ActuationsDialog
                open={openActs.open}
                caseId={openActs.caseId}
                title={`Actuaciones — ${openActs.caseTitle ?? ''}`}
                onClose={() => setOpenActs({ open: false })}
            />
        </Container>
    )
}
