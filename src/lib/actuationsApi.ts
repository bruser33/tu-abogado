// src/lib/actuationsApi.ts
import { supabase } from "../auth/supabase.ts";

/** ===== Tipos ===== */
export type Actuacion = {
    id: string;
    case_id: string;
    nombre: string;
    descripcion: string;
    entidades?: string | null;   // gubernamentales u otras (opcional)
    adjuntos?: string[] | null;  // rutas en storage
    created_at: string;
    updated_at: string;
};

export type NewActuacionInput = {
    case_id: string;
    nombre: string;
    descripcion: string;
    entidades?: string | null;
    adjuntos?: string[] | null;
};

/** ===== Listar por caso ===== */
export async function listActuaciones(caseId: string): Promise<Actuacion[]> {
    const { data, error } = await supabase
        .from("actuaciones")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Actuacion[];
}

/** ===== Crear ===== */
export async function createActuacion(
    payload: NewActuacionInput
): Promise<Actuacion> {
    const { data, error } = await supabase
        .from("actuaciones")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data as Actuacion;
}

/** ===== Subir 1 archivo al bucket "actuaciones" (ruta: <caseId>/...) =====
 * IMPORTANTE: el path debe comenzar con `${caseId}/` para que pase las policies.
 */
export async function uploadActFile(file: File, caseId: string): Promise<string> {
    const sanitizedName = file.name.replace(/\s+/g, " ");
    const path = `${caseId}/${Date.now()}-${sanitizedName}`;

    const { error } = await supabase.storage
        .from("actuaciones")
        .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;
    return path; // guarda esta ruta en "adjuntos"
}

/** Subir varios archivos y devolver los paths (conserva el orden) */
export async function uploadActFiles(
    files: File[],
    caseId: string
): Promise<string[]> {
    const results: string[] = [];
    for (const f of files) {
        // se suben secuencialmente para evitar colisiones de nombre
        const p = await uploadActFile(f, caseId);
        results.push(p);
    }
    return results;
}

/** Obtener URL pública (si la policy de lectura es pública) */
export function getPublicUrl(path: string): string {
    const { data } = supabase.storage.from("actuaciones").getPublicUrl(path);
    return data.publicUrl;
}

/** Eliminar Actuación (borra el registro; no elimina archivos en Storage) */
export async function deleteActuacion(id: string): Promise<void> {
    const { error } = await supabase.from("actuaciones").delete().eq("id", id);
    if (error) throw error;
}

/** Eliminar un archivo de Storage (ruta = path devuelto por upload) */
export async function removeActFile(path: string): Promise<void> {
    const { error } = await supabase.storage.from("actuaciones").remove([path]);
    if (error) throw error;
}

/** Adjuntar un archivo (path) a una actuación (append en el array adjuntos) */
export async function appendAdjuntoToActuacion(
    actuacionId: string,
    path: string
): Promise<void> {
    // Leemos adjuntos actuales y hacemos append en cliente (simple y portable)
    const { data, error } = await supabase
        .from("actuaciones")
        .select("adjuntos")
        .eq("id", actuacionId)
        .single();

    if (error) throw error;

    const current = (data?.adjuntos ?? []) as string[];
    const next = [...current, path];

    const { error: updErr } = await supabase
        .from("actuaciones")
        .update({ adjuntos: next })
        .eq("id", actuacionId);

    if (updErr) throw updErr;
}

/** Reemplazar por completo los adjuntos de una actuación */
export async function setAdjuntosForActuacion(
    actuacionId: string,
    paths: string[]
): Promise<void> {
    const { error } = await supabase
        .from("actuaciones")
        .update({ adjuntos: paths })
        .eq("id", actuacionId);

    if (error) throw error;
}
