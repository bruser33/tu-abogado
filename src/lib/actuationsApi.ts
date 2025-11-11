// src/lib/actuacionesApi.ts
import { supabase } from '@auth/supabase'

export type Actuacion = {
    id: string
    case_id: string
    nombre: string
    descripcion: string
    entidades: string | null
    created_at: string
    updated_at: string
}

// ===== CRUD Actuaciones (tabla: actuaciones) =====

export async function listActuaciones(caseId: string): Promise<Actuacion[]> {
    const { data, error } = await supabase
        .from('actuaciones')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
}

export async function createActuacion(input: {
    case_id: string
    nombre: string
    descripcion?: string
    entidades?: string
}): Promise<Actuacion> {
    const payload = {
        case_id: input.case_id,
        nombre: input.nombre,
        descripcion: input.descripcion ?? '',
        entidades: input.entidades ?? null,
    }
    const { data, error } = await supabase
        .from('actuaciones')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateActuacion(params: {
    id: string
    patch: Partial<Pick<Actuacion, 'nombre' | 'descripcion' | 'entidades'> & { case_id: string }>
}): Promise<Actuacion> {
    const { id, patch } = params
    const { data, error } = await supabase
        .from('actuaciones')
        .update(patch)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteActuacion(id: string): Promise<void> {
    const { error } = await supabase.from('actuaciones').delete().eq('id', id)
    if (error) throw error
}

// ===== Storage para archivos por caso (bucket: actuaciones) =====

const BUCKET = 'actuaciones'

export async function uploadActFile(params: { caseId: string; file: File }): Promise<string> {
    const { caseId, file } = params
    const key = `${caseId}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
        upsert: false,
    })
    if (error) throw error
    return key
}
