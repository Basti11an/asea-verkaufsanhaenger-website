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
  rating?: number | null;
  public_consent?: boolean;
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
    rating: row.rating ?? null,
    publicConsent: row.public_consent ?? true,
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
    ...(reference.rating !== undefined ? { rating: reference.rating } : {}),
    ...(reference.publicConsent !== undefined ? { public_consent: reference.publicConsent } : {}),
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
  const basePublicColumns = 'id,kundenname,ort,modell,jahr,beschreibung,bild_url,sichtbar,status,created_at';
  const publicColumns = `${basePublicColumns},rating`;

  if (includePrivateFields) {
    const { data, error } = await client
      .from('customer_references')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => toAdminReference(row as unknown as ReferenceRow));
  }

  const publicResult = await client
    .from('customer_references_public')
    .select(publicColumns)
    .order('id', { ascending: false });

  if (!publicResult.error) {
    return (publicResult.data ?? []).map((row) => toAdminReference(row as unknown as ReferenceRow));
  }

  if (publicResult.error.code === '42703' || publicResult.error.code === 'PGRST204') {
    const legacyPublicResult = await client
      .from('customer_references_public')
      .select(basePublicColumns)
      .order('id', { ascending: false });

    if (!legacyPublicResult.error) {
      return (legacyPublicResult.data ?? []).map((row) => toAdminReference(row as unknown as ReferenceRow));
    }
  }

  if (publicResult.error.code !== 'PGRST205' && publicResult.error.code !== '42P01') {
    throw publicResult.error;
  }

  console.warn('Public references view is missing. Falling back to filtered table read until supabase/references.sql is applied.');

  const fallbackResult = await client
    .from('customer_references')
    .select(basePublicColumns)
    .eq('status', 'approved')
    .eq('sichtbar', true)
    .order('id', { ascending: false });

  if (fallbackResult.error) throw fallbackResult.error;
  return (fallbackResult.data ?? []).map((row) => toAdminReference(row as unknown as ReferenceRow));
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
