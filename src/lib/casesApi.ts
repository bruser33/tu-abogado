// src/lib/casesApi.ts
import { supabase } from '@auth/supabase'

/** ===== Tipos ===== */
export type LegalCase = {
    id: string
    cedula_demandante: string
    demandados: string[]        // persistimos como text[] en BD o serializamos/parseamos
    tipo: 'transito' | 'civil' | 'penal' | 'terrorista'
    juzgado: string             // 👈 NUEVO (lo pedía tu UI)
    numero_radicado: string
    assigned_lawyer: string
    created_at: string
    updated_at: string
}

/** ===== Helpers de mapeo (opcional si usas text[]) =====
 Si en tu tabla guardas text[] real, puedes quitar estos helpers.
 Si guardas como text y separas por coma, deja estos parse/stringify.
 */
const fromRow = (r: any): LegalCase => ({
    ...r,
    demandados: Array.isArray(r.demandados)
        ? r.demandados
        : (r.demandados ? String(r.demandados).split(',').map((s) => s.trim()).filter(Boolean) : []),
})

const toRow = (c: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>) => ({
    ...c,
    // si tu columna es text[] en Postgres, puedes pasar el array directo
    // si es text, conviértelo a csv:
    demandados: Array.isArray(c.demandados) ? c.demandados.join(',') : c.demandados,
})

/** ===== CRUD ===== */
export async function listCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map(fromRow)
}

export async function getCase(id: string): Promise<LegalCase | null> {
    const { data, error } = await supabase.from('cases').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? fromRow(data) : null
}

export async function createCase(
    input: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>
): Promise<LegalCase> {
    const { data, error } = await supabase.from('cases').insert([toRow(input)]).select('*').single()
    if (error) throw error
    return fromRow(data!)
}

export async function updateCase(
    id: string,
    patch: Partial<Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>>
): Promise<LegalCase> {
    const { data, error } = await supabase.from('cases').update(toRow(patch as any)).eq('id', id).select('*').single()
    if (error) throw error
    return fromRow(data!)
}

export async function deleteCase(id: string) {
    const { error } = await supabase.from('cases').delete().eq('id', id)
    if (error) throw error
}
