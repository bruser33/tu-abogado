// src/lib/actuationsApi.ts
import { supabase } from '@auth/supabase'

export type Actuacion = {
    id: string
    case_id: string
    nombre: string
    descripcion?: string
    entidades?: string
    adjuntos?: string[]        // rutas en el bucket 'actuaciones'
    created_at: string
    updated_at: string
}

export async function listActuaciones(caseId: string): Promise<Actuacion[]> {
    const { data, error } = await supabase
        .from('actuaciones')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as Actuacion[]
}

export async function createActuacion(payload: {
    case_id: string
    nombre: string
    descripcion?: string
    entidades?: string
    adjuntos?: string[]
}): Promise<Actuacion> {
    const { data, error } = await supabase
        .from('actuaciones')
        .insert(payload)
        .select('*')
        .single()

    if (error) throw error
    return data as Actuacion
}

export async function updateActuacion(
    id: string,
    patch: {
        nombre?: string
        descripcion?: string
        entidades?: string
        adjuntos?: string[]
    }
): Promise<Actuacion> {
    const { data, error } = await supabase
        .from('actuaciones')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single()

    if (error) throw error
    return data as Actuacion
}

export async function deleteActuacion(id: string): Promise<void> {
    const { error } = await supabase
        .from('actuaciones')
        .delete()
        .eq('id', id)
    if (error) throw error
}

/**
 * Sube un archivo al bucket 'actuaciones' bajo: <caseId>/<timestamp>-<nombre>
 * Devuelve la RUTA (path) guardada en Storage (no la URL).
 */
export async function uploadActFile(file: File, caseId: string): Promise<string> {
    const path = `${caseId}/${Date.now()}-${file.name}`
    const { error } = await supabase
        .storage
        .from('actuaciones')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined,
        })
    if (error) throw error
    return path
}

/**
 * Devuelve la URL pública (requiere bucket 'actuaciones' PUBLIC).
 * Si tu bucket es privado, cambia a createSignedUrl.
 */
export function getPublicUrl(path: string): string {
    const { data } = supabase.storage.from('actuaciones').getPublicUrl(path)
    return data.publicUrl
}
