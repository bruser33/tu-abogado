import { useState } from 'react'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import {supabase} from "../../auth/supabase.ts";

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)
        if (error) return alert(error.message)
        setDone(true)
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Restablecer contraseña
                </Typography>
                {done ? (
                    <Typography>
                        ¡Listo! Ya puedes cerrar esta pestaña e iniciar sesión con tu nueva contraseña.
                    </Typography>
                ) : (
                    <Stack component="form" onSubmit={onSubmit} gap={2}>
                        <TextField
                            label="Nueva contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || password.length < 6}
                        >
                            {loading ? 'Guardando…' : 'Guardar contraseña'}
                        </Button>
                    </Stack>
                )}
            </Paper>
        </Container>
    )
}
