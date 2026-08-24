import type { AdminReference } from '../context/AdminDataContext';
import { isSupabaseConfigured, supabase } from './supabase';

type ReferenceRow = {
  id: number;
  kundenname: string;
  ort: string;
  modell: string;
  jahr: number;
  beschreibung: string;
  bild_url: string;
  sichtbar: boolean;
  status: 'approved' | 'pending' | 'rejected';
  kontakt_email?: string;
  kontakt_telefon?: string;
  created_at: string;
};

function toAdminReference(row: ReferenceRow): AdminReference {
  return {
    id: row.id,
    kundenname: row.kundenname ?? '',
    ort: row.ort ?? '',
    modell: row.modell ?? '',
    jahr: row.jahr,
    beschreibung: row.beschreibung ?? '',
    bildUrl: row.bild_url ?? '',
    sichtbar: row.sichtbar,
    status: row.status ?? 'approved',
    kontaktEmail: row.kontakt_email ?? '',
    kontaktTelefon: row.kontakt_telefon ?? '',
    createdAt: row.created_at,
  };
}

function toReferencePayload(reference: Partial<Omit<AdminReference, 'id'>>) {
  return {
    ...(reference.kundenname !== undefined ? { kundenname: reference.kundenname } : {}),
    ...(reference.ort !== undefined ? { ort: reference.ort } : {}),
    ...(reference.modell !== undefined ? { modell: reference.modell } : {}),
    ...(reference.jahr !== undefined ? { jahr: reference.jahr } : {}),
    ...(reference.beschreibung !== undefined ? { beschreibung: reference.beschreibung } : {}),
    ...(reference.bildUrl !== undefined ? { bild_url: reference.bildUrl } : {}),
    ...(reference.sichtbar !== undefined ? { sichtbar: reference.sichtbar } : {}),
    ...(reference.status !== undefined ? { status: reference.status } : {}),
    ...(reference.kontaktEmail !== undefined ? { kontakt_email: reference.kontaktEmail } : {}),
    ...(reference.kontaktTelefon !== undefined ? { kontakt_telefon: reference.kontaktTelefon } : {}),
  };
}

function getClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase ist noch nicht konfiguriert.');
  }

  return supabase;
}

export async function fetchReferencesFromSupabase(includePrivateFields = false): Promise<AdminReference[]> {
  const client = getClient();
  const columns = includePrivateFields
    ? '*'
    : 'id,kundenname,ort,modell,jahr,beschreibung,bild_url,sichtbar,status,created_at';

  let query = client.from('customer_references').select(columns);

  if (!includePrivateFields) {
    query = query.eq('status', 'approved').eq('sichtbar', true);
  }

  const { data, error } = await query.order('id', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toAdminReference(row as ReferenceRow));
}

export async function createReferenceInSupabase(reference: Omit<AdminReference, 'id'>): Promise<AdminReference> {
  const client = getClient();
  const { data, error } = await client
    .from('customer_references')
    .insert(toReferencePayload(reference))
    .select('*')
    .single();

  if (error) throw error;
  return toAdminReference(data as ReferenceRow);
}

export async function submitReferenceToSupabase(reference: Omit<AdminReference, 'id'>): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('customer_references')
    .insert(toReferencePayload(reference));

  if (error) throw error;
}

export async function updateReferenceInSupabase(
  id: number,
  changes: Partial<AdminReference>,
): Promise<AdminReference> {
  const client = getClient();
  const { data, error } = await client
    .from('customer_references')
    .update(toReferencePayload(changes))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toAdminReference(data as ReferenceRow);
}

export async function deleteReferenceFromSupabase(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('customer_references')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
