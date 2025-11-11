// src/lib/casesApi.ts
import { supabase } from '@auth/supabase'

export type LegalCase = {
    id: string
    cedula_demandante: string
    demandados: string[]
    tipo: 'transito' | 'civil' | 'penal' | 'terrorista'
    juzgado_tipo: 'regional' | 'departamental' | 'otro'
    juzgado_nombre: string
    numero_radicado: string
    assigned_lawyer: string
    created_at: string
    updated_at: string
}

// Campos antiguos que NO deben viajar al backend
const LEGACY_KEYS = new Set<string>([
    'title',
    'case_type',
    'status',
    'client_name',
    'court',
    'docket',
    'opposing_party',
    'next_hearing_at',
    'value_amount',
    'notes',
    'juzgado', // <- el culpable del 400
])

function cleanCasePayload(input: Record<string, unknown>) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
        if (v === undefined) continue
        if (LEGACY_KEYS.has(k)) continue
        if (k === 'demandados') {
            out.demandados = Array.isArray(v)
                ? (v as unknown[]).map(String)
                : (v ? [String(v)] : [])
            continue
        }
        out[k] = v
    }
    return out
}

export async function listCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('updated_at', { ascending: false })
    if (error) throw error

    return (data ?? []).map((c: any) => ({
        id: c.id,
        cedula_demandante: c.cedula_demandante ?? '',
        demandados: Array.isArray(c.demandados) ? c.demandados : (c.demandados ? [String(c.demandados)] : []),
        tipo: (c.tipo ?? 'transito') as LegalCase['tipo'],
        juzgado_tipo: (c.juzgado_tipo ?? 'regional') as LegalCase['juzgado_tipo'],
        juzgado_nombre: c.juzgado_nombre ?? '',
        numero_radicado: c.numero_radicado ?? '',
        assigned_lawyer: c.assigned_lawyer ?? '',
        created_at: c.created_at ?? '',
        updated_at: c.updated_at ?? '',
    }))
}

export async function createCase(
    payload: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>
): Promise<LegalCase> {
    const body = cleanCasePayload(payload as unknown as Record<string, unknown>)
    const { data, error } = await supabase
        .from('cases')
        .insert(body)
        .select('*')
        .single()
    if (error) throw error
    return data as LegalCase
}

export async function updateCase(
    id: string,
    patch: Partial<LegalCase>
): Promise<LegalCase> {
    const body = cleanCasePayload(patch as Record<string, unknown>)
    const { data, error } = await supabase
        .from('cases')
        .update(body)
        .eq('id', id)
        .select('*')
        .single()
    if (error) throw error
    return data as LegalCase
}

export async function deleteCase(id: string) {
    const { error } = await supabase.from('cases').delete().eq('id', id)
    if (error) throw error
}
