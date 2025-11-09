// src/components/pages/Cases/CasesPage.tsx
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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCases, createCase, updateCase, deleteCase, type LegalCase } from '@lib/casesApi.ts'
import { useAuth } from '../../../auth/AuthProvider.tsx'
import CaseForm from '@organisms/cases/CaseForm/CaseForm.tsx'

export default function CasesPage() {
    const { user } = useAuth()
    const qc = useQueryClient()

    // ✨ No hagas fetch si no hay sesión
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['cases'],
        queryFn: listCases,
        enabled: !!user,
    })

    const [openForm, setOpenForm] = useState(false)
    const [editing, setEditing] = useState<LegalCase | null>(null)

    const createMut = useMutation({
        mutationFn: createCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })
    const updateMut = useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<LegalCase> }) =>
            updateCase(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })
    const deleteMut = useMutation({
        mutationFn: deleteCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const rows = useMemo(() => data ?? [], [data])

    const onCreate = () => {
        setEditing(null)
        setOpenForm(true)
    }
    const onEdit = (row: LegalCase) => {
        setEditing(row)
        setOpenForm(true)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Mis casos</Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={onCreate}
                    disabled={!user}
                >
                    Nuevo caso
                </Button>
            </Stack>

            {/* Estado: sin sesión */}
            {!user && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Inicia sesión para ver y gestionar tus casos.
                </Alert>
            )}

            {/* Estado: error de fetch */}
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {(error as any)?.message || 'No se pudieron cargar los casos.'}
                </Alert>
            )}

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Próx. audiencia</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Cargando */}
                        {user && (isLoading || isFetching) && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <CircularProgress size={18} /> Cargando…
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Vacío */}
                        {user && !isLoading && rows.length === 0 && !isError && (
                            <TableRow>
                                <TableCell colSpan={6}>No hay casos aún.</TableCell>
                            </TableRow>
                        )}

                        {/* Filas */}
                        {rows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.case_type}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.client_name}</TableCell>
                                <TableCell>
                                    {row.next_hearing_at ? new Date(row.next_hearing_at).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar">
                    <span>
                      <IconButton onClick={() => onEdit(row)} disabled={!user}>
                        <EditIcon />
                      </IconButton>
                    </span>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                    <span>
                      <IconButton
                          color="error"
                          onClick={() => deleteMut.mutate(row.id)}
                          disabled={!user}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
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
                        await updateMut.mutateAsync({ id: editing.id, patch: form })
                    } else {
                        await createMut.mutateAsync({ ...form, assigned_lawyer: user.id })
                    }
                    setOpenForm(false)
                }}
            />
        </Container>
    )
}
