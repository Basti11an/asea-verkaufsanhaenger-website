import { isSupabaseConfigured, supabase } from './supabase';

export type ContactRequestStatus = 'new' | 'open' | 'answered';
export type ContactRequestSource = 'contact' | 'configurator';

export interface ContactRequestInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: ContactRequestSource;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: ContactRequestSource;
  status: ContactRequestStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

type ContactRequestRow = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subject: string;
  message: string;
  source: ContactRequestSource;
  status: ContactRequestStatus;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

function getClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase ist noch nicht konfiguriert.');
  }

  return supabase;
}

function toContactRequest(row: ContactRequestRow): ContactRequest {
  return {
    id: row.id,
    name: row.customer_name ?? '',
    email: row.customer_email ?? '',
    phone: row.customer_phone ?? '',
    subject: row.subject ?? '',
    message: row.message ?? '',
    source: row.source ?? 'contact',
    status: row.status ?? 'new',
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toInsertPayload(request: ContactRequestInput) {
  return {
    customer_name: request.name,
    customer_email: request.email,
    customer_phone: request.phone,
    subject: request.subject,
    message: request.message,
    source: request.source,
  };
}

function toUpdatePayload(changes: Partial<Pick<ContactRequest, 'status' | 'isRead'>>) {
  return {
    ...(changes.status !== undefined ? { status: changes.status } : {}),
    ...(changes.isRead !== undefined ? { is_read: changes.isRead } : {}),
  };
}

export async function submitContactRequestToSupabase(request: ContactRequestInput): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('contact_requests')
    .insert(toInsertPayload(request));

  if (error) throw error;
}

export async function fetchContactRequestsFromSupabase(): Promise<ContactRequest[]> {
  const client = getClient();
  const { data, error } = await client
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toContactRequest(row as ContactRequestRow));
}

export async function updateContactRequestInSupabase(
  id: number,
  changes: Partial<Pick<ContactRequest, 'status' | 'isRead'>>,
): Promise<ContactRequest> {
  const client = getClient();
  const { data, error } = await client
    .from('contact_requests')
    .update(toUpdatePayload(changes))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toContactRequest(data as ContactRequestRow);
}
