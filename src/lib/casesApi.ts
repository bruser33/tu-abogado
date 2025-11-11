// src/lib/casesApi.ts

import {supabase} from "../auth/supabase.ts";

/** ============ Tipos ============ */
export type LegalCase = {
    id: string
    cedula_demandante: string
    demandados: string[]
    tipo: 'transito' | 'civil' | 'penal' | 'terrorista'
    juzgado: string
    juzgado_nivel?: 'regional' | 'departamental' | null
    numero_radicado: string
    created_at: string
    updated_at: string
}

export type Actuacion = {
    id: string
    case_id: string
    nombre: string
    descripcion: string
    entidades?: string | null
    created_at: string
    updated_at: string
}

export type ActuacionInsert = Omit<Actuacion, 'id' | 'created_at' | 'updated_at'>

/** ============ Casos ============ */
export async function listCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function createCase(payload: Omit<LegalCase, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('cases').insert(payload).select().single()
    if (error) throw error
    return data as LegalCase
}

export async function updateCase(id: string, patch: Partial<LegalCase>) {
    const { data, error } = await supabase.from('cases').update(patch).eq('id', id).select().single()
    if (error) throw error
    return data as LegalCase
}

export async function deleteCase(id: string) {
    const { error } = await supabase.from('cases').delete().eq('id', id)
    if (error) throw error
}

/** ============ Actuaciones ============ */
export async function listActuaciones(caseId: string): Promise<Actuacion[]> {
    const { data, error } = await supabase
        .from('actuaciones')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function createActuacion(payload: ActuacionInsert) {
    const { data, error } = await supabase
        .from('actuaciones')
        .insert(payload)
        .select()
        .single()
    if (error) throw error
    return data as Actuacion
}

/** NUEVO: actualizar una actuación */
export async function updateActuacion(id: string, patch: Partial<Actuacion>) {
    const { data, error } = await supabase
        .from('actuaciones')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data as Actuacion
}

export async function deleteActuacion(id: string) {
    const { error } = await supabase.from('actuaciones').delete().eq('id', id)
    if (error) throw error
}

/** ============ Archivos en bucket “actuaciones” ============ */

const BUCKET = 'actuaciones'

export type UploadedFile = {
    path: string
    publicUrl: string
}

/** Sube 1 archivo al path `<caseId>/<timestamp>-<filename>` */
export async function uploadActuacionFile(
    caseId: string,
    file: File,
): Promise<UploadedFile> {
    const key = `${caseId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from(BUCKET).upload(key, file, {
        cacheControl: '3600',
        upsert: false,
    })
    if (error) throw error
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return { path: data.path, publicUrl: pub.publicUrl }
}

/** Lista archivos de una actuación (carpeta = caseId; opcionalmente filtra por prefijo) */
export async function listActuacionFiles(caseId: string) {
    const { data, error } = await supabase.storage.from(BUCKET).list(caseId)
    if (error) throw error
    return data ?? []
}

export async function removeActuacionFile(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw error
}
