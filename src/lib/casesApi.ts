import {supabase} from "../auth/supabase.ts";

export type CaseStatus = 'nuevo'|'en_progreso'|'suspendido'|'cerrado'
export interface LegalCase {
    id: string
    title: string
    case_type: string
    status: CaseStatus
    client_name: string
    court?: string | null
    docket?: string | null
    opposing_party?: string | null
    next_hearing_at?: string | null
    value_amount?: number | null
    notes?: string | null
    assigned_lawyer: string
    created_at: string
    updated_at: string
}

const TABLE = 'cases'

export async function listCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('updated_at', { ascending: false })
    if (error) throw error
    return data as LegalCase[]
}

export async function createCase(payload: Partial<LegalCase>) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select()
        .single()
    if (error) throw error
    return data as LegalCase
}

export async function updateCase(id: string, patch: Partial<LegalCase>) {
    const { data, error } = await supabase
        .from(TABLE)
        .update(patch)
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data as LegalCase
}

export async function deleteCase(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
}
