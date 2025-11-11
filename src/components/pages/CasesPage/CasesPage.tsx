// src/components/pages/CasesPage/CasesPage.tsx
import { useMemo, useState } from 'react'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description' // abrir actuaciones

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    listCases,
    createCase,
    updateCase,
    deleteCase,
    type LegalCase,
} from '@lib/casesApi'

import CaseForm from '@cases/CaseForm/CaseForm'
import ActuationsDialog from '@cases/ActuationsDialog/ActuationsDialog'

export default function CasesPage() {
    const qc = useQueryClient()

    // dialogs
    const [caseFormOpen, setCaseFormOpen] = useState(false)
    const [editingCase, setEditingCase] = useState<LegalCase | null>(null)

    const [actDlgOpen, setActDlgOpen] = useState(false)
    const [actCaseId, setActCaseId] = useState<string | null>(null)

    // data
    const { data: cases = [] } = useQuery({
        queryKey: ['cases'],
        queryFn: listCases,
    })

    const createMut = useMutation({
        mutationFn: createCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const updateMut = useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'> }) =>
            updateCase(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const deleteMut = useMutation({
        mutationFn: deleteCase,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    })

    const onCreateClick = () => {
        setEditingCase(null)
        setCaseFormOpen(true)
    }

    const onEditClick = (row: LegalCase) => {
        setEditingCase(row)
        setCaseFormOpen(true)
    }

    const onDeleteClick = async (row: LegalCase) => {
        if (!confirm('¿Eliminar este caso?')) return
        await deleteMut.mutateAsync(row.id)
    }

    const onActuationsClick = (row: LegalCase) => {
        setActCaseId(row.id)
        setActDlgOpen(true)
    }

    // submit del formulario de caso
    const handleSubmit = async (payload: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>) => {
        if (editingCase?.id) {
            await updateMut.mutateAsync({ id: editingCase.id, patch: payload })
        } else {
            await createMut.mutateAsync(payload)
        }
        setCaseFormOpen(false)
    }

    const rows = useMemo(() => cases, [cases])

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    Mis casos
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateClick}>
                    Nuevo caso
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cédula demandante</TableCell>
                            <TableCell>Demandados</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Juzgado</TableCell>
                            <TableCell>Nº radicado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{row.cedula_demandante}</TableCell>
                                <TableCell>{row.demandados?.join(', ') || '—'}</TableCell>
                                <TableCell>{row.tipo}</TableCell>
                                <TableCell>{row.juzgado}</TableCell>
                                <TableCell>{row.numero_radicado}</TableCell>
                                <TableCell align="center">
                                    {/* ⚠️ IMPORTANTE: dentro del <tr> solo <td> y dentro de <td> ponemos los iconos. Nada de texto suelto */}
                                    <IconButton size="small" onClick={() => onActuationsClick(row)} title="Actuaciones">
                                        <DescriptionIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => onEditClick(row)} title="Editar">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => onDeleteClick(row)} title="Eliminar">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialogo crear/editar caso */}
            <CaseForm
                open={caseFormOpen}
                initial={editingCase ?? undefined}
                onClose={() => setCaseFormOpen(false)}
                onSubmit={handleSubmit}
            />

            {/* Dialogo de actuaciones */}
            <ActuationsDialog
                open={actDlgOpen}
                caseId={actCaseId ?? ''}
                onClose={() => setActDlgOpen(false)}
            />
        </Box>
    )
}
