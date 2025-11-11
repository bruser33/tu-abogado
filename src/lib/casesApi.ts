// src/lib/casesApi.ts

import {supabase} from "../auth/supabase.ts";

/** === Tipos de dominio === */
export type JuzgadoTipo = 'regional' | 'departamental' | 'otro'
export type CaseTipo = 'transito' | 'civil' | 'penal' | 'terrorista'

export type LegalCase = {
    id: string
    // nuevo modelo
    cedula_demandante: string
    demandados: string[]          // personas tipo "demandado" (lista simple para mínimo cambio)
    tipo: CaseTipo
    juzgado_tipo: JuzgadoTipo
    juzgado_nombre: string
    numero_radicado: string

    // ya existentes / administrativos
    assigned_lawyer: string
    created_at: string
    updated_at: string
}

/** === Listar === */
export async function listCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((c: Partial<LegalCase>): LegalCase => ({
        ...c,
        demandados: Array.isArray(c.demandados)
            ? c.demandados
            : (c.demandados ? [String(c.demandados)] : []),
        cedula_demandante: c.cedula_demandante ?? '',
        tipo: (c.tipo as LegalCase['tipo']) ?? 'transito',
        juzgado_tipo: (c.juzgado_tipo as LegalCase['juzgado_tipo']) ?? 'regional',
        juzgado_nombre: c.juzgado_nombre ?? '',
        numero_radicado: c.numero_radicado ?? '',
        assigned_lawyer: c.assigned_lawyer ?? '',
        id: c.id ?? '',
        created_at: c.created_at ?? '',
        updated_at: c.updated_at ?? '',
    }))

}

/** === Crear === */
export async function createCase(payload: Partial<LegalCase>): Promise<LegalCase> {
    const clean = {
        cedula_demandante: payload.cedula_demandante ?? '',
        demandados: payload.demandados ?? [],
        tipo: payload.tipo ?? 'transito',
        juzgado_tipo: payload.juzgado_tipo ?? 'regional',
        juzgado_nombre: payload.juzgado_nombre ?? '',
        numero_radicado: payload.numero_radicado ?? '',
        assigned_lawyer: payload.assigned_lawyer!,
    }

    const { data, error } = await supabase
        .from('cases')
        .insert(clean)
        .select()
        .single()

    if (error) throw error
    return data as LegalCase
}

/** === Actualizar === */
export async function updateCase(id: string, patch: Partial<LegalCase>): Promise<LegalCase> {
    const { data, error } = await supabase
        .from('cases')
        .update(patch)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as LegalCase
}

/** === Eliminar === */
export async function deleteCase(id: string): Promise<void> {
    const { error } = await supabase.from('cases').delete().eq('id', id)
    if (error) throw error
}
