import { isSupabaseConfigured, supabase } from './supabase';

export type AdminAccessStatus = 'checking' | 'guest' | 'admin';

export interface AdminAccessResult {
  status: Exclude<AdminAccessStatus, 'checking'>;
  error?: string;
}

const ADMIN_ACCESS_ERROR = 'E-Mail-Adresse oder Passwort ist nicht korrekt oder der Zugriff ist nicht freigegeben.';

export async function isCurrentUserAdmin() {
  if (!isSupabaseConfigured || !supabase) return false;

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) return false;

  const { data, error } = await supabase.rpc('is_admin');

  if (error) {
    console.warn('Admin access check failed:', error);
    return false;
  }

  return data === true;
}

export async function getAdminAccess(): Promise<AdminAccessResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      status: 'guest',
      error: 'Der Admin-Login ist erst nach der Supabase-Konfiguration verfügbar.',
    };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.warn('Admin session check failed:', sessionError);
    return { status: 'guest', error: ADMIN_ACCESS_ERROR };
  }

  if (!session) return { status: 'guest' };

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { status: 'guest', error: ADMIN_ACCESS_ERROR };
  }

  return { status: 'admin' };
}
