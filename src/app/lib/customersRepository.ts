import { isSupabaseConfigured, supabase } from './supabase';
import {
  type CustomerFollowupSnapshot,
  type CustomerReviewSource,
  type CustomerReviewStatus,
  type FollowUpPermissionStatus,
  type MailStatus,
  type ReminderStage,
  normalizeEmail,
} from './customerFollowup';
import type { Lang } from '../context/LanguageContext';

export interface Customer extends CustomerFollowupSnapshot {
  id: number;
  name: string;
  email: string;
  emailNormalized: string;
  purchaseDate: string;
  purchasedItem: string;
  notes: string;
  preferredLanguage: Lang;
  reviewSource: CustomerReviewSource | null;
  matchedReferenceId: number | null;
  manualReviewSource: CustomerReviewSource | null;
  followUpPermissionCapturedAt: string | null;
  followUpPermissionSource: string;
  followUpPermissionTextVersion: string;
  followUpPermissionInformation: string;
  followUpOptedOutAt: string | null;
  twoMonthEmailAttemptedAt: string | null;
  twoMonthEmailAttempts: number;
  sixMonthEmailAttemptedAt: string | null;
  sixMonthEmailAttempts: number;
  twelveMonthEmailAttemptedAt: string | null;
  twelveMonthEmailAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  purchaseDate: string;
  purchasedItem: string;
  notes: string;
  preferredLanguage: Lang;
  followUpEnabled: boolean;
  followUpPermissionStatus: FollowUpPermissionStatus;
  followUpPermissionCapturedAt?: string | null;
  followUpPermissionSource: string;
  followUpPermissionTextVersion: string;
  followUpPermissionInformation: string;
}

export interface CustomerUpdateInput extends Partial<CustomerInput> {
  reviewStatus?: CustomerReviewStatus;
  reviewFoundAt?: string | null;
  reviewSource?: CustomerReviewSource | null;
  manualReviewConfirmedAt?: string | null;
  manualReviewSource?: CustomerReviewSource | null;
  followUpOptOut?: boolean;
  followUpOptedOutAt?: string | null;
}

type CustomerRow = {
  id: number;
  name: string;
  email: string;
  email_normalized: string;
  purchase_date: string;
  purchased_item: string;
  notes: string;
  preferred_language: Lang;
  review_status: CustomerReviewStatus;
  review_found_at: string | null;
  review_source: CustomerReviewSource | null;
  matched_reference_id: number | null;
  manual_review_confirmed_at: string | null;
  manual_review_source: CustomerReviewSource | null;
  follow_up_enabled: boolean;
  follow_up_permission_status: FollowUpPermissionStatus;
  follow_up_permission_captured_at: string | null;
  follow_up_permission_source: string;
  follow_up_permission_text_version: string;
  follow_up_permission_information: string;
  follow_up_opt_out: boolean;
  follow_up_opted_out_at: string | null;
  two_month_email_status: MailStatus;
  two_month_email_sent_at: string | null;
  two_month_email_attempted_at: string | null;
  two_month_email_attempts: number;
  six_month_email_status: MailStatus;
  six_month_email_sent_at: string | null;
  six_month_email_attempted_at: string | null;
  six_month_email_attempts: number;
  twelve_month_email_status: MailStatus;
  twelve_month_email_sent_at: string | null;
  twelve_month_email_attempted_at: string | null;
  twelve_month_email_attempts: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const CUSTOMER_COLUMNS = [
  'id',
  'name',
  'email',
  'email_normalized',
  'purchase_date',
  'purchased_item',
  'notes',
  'preferred_language',
  'review_status',
  'review_found_at',
  'review_source',
  'matched_reference_id',
  'manual_review_confirmed_at',
  'manual_review_source',
  'follow_up_enabled',
  'follow_up_permission_status',
  'follow_up_permission_captured_at',
  'follow_up_permission_source',
  'follow_up_permission_text_version',
  'follow_up_permission_information',
  'follow_up_opt_out',
  'follow_up_opted_out_at',
  'two_month_email_status',
  'two_month_email_sent_at',
  'two_month_email_attempted_at',
  'two_month_email_attempts',
  'six_month_email_status',
  'six_month_email_sent_at',
  'six_month_email_attempted_at',
  'six_month_email_attempts',
  'twelve_month_email_status',
  'twelve_month_email_sent_at',
  'twelve_month_email_attempted_at',
  'twelve_month_email_attempts',
  'created_at',
  'updated_at',
  'deleted_at',
].join(',');

function getClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase ist noch nicht konfiguriert.');
  }

  return supabase;
}

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name ?? '',
    email: row.email ?? '',
    emailNormalized: row.email_normalized ?? normalizeEmail(row.email ?? ''),
    purchaseDate: row.purchase_date,
    purchasedItem: row.purchased_item ?? '',
    notes: row.notes ?? '',
    preferredLanguage: row.preferred_language ?? 'de',
    reviewStatus: row.review_status ?? 'none',
    reviewFoundAt: row.review_found_at,
    reviewSource: row.review_source,
    matchedReferenceId: row.matched_reference_id,
    manualReviewConfirmedAt: row.manual_review_confirmed_at,
    manualReviewSource: row.manual_review_source,
    followUpEnabled: Boolean(row.follow_up_enabled),
    followUpPermissionStatus: row.follow_up_permission_status ?? 'unknown',
    followUpPermissionCapturedAt: row.follow_up_permission_captured_at,
    followUpPermissionSource: row.follow_up_permission_source ?? '',
    followUpPermissionTextVersion: row.follow_up_permission_text_version ?? '',
    followUpPermissionInformation: row.follow_up_permission_information ?? '',
    followUpOptOut: Boolean(row.follow_up_opt_out),
    followUpOptedOutAt: row.follow_up_opted_out_at,
    twoMonthEmailStatus: row.two_month_email_status ?? 'pending',
    twoMonthEmailSentAt: row.two_month_email_sent_at,
    twoMonthEmailAttemptedAt: row.two_month_email_attempted_at,
    twoMonthEmailAttempts: row.two_month_email_attempts ?? 0,
    sixMonthEmailStatus: row.six_month_email_status ?? 'pending',
    sixMonthEmailSentAt: row.six_month_email_sent_at,
    sixMonthEmailAttemptedAt: row.six_month_email_attempted_at,
    sixMonthEmailAttempts: row.six_month_email_attempts ?? 0,
    twelveMonthEmailStatus: row.twelve_month_email_status ?? 'pending',
    twelveMonthEmailSentAt: row.twelve_month_email_sent_at,
    twelveMonthEmailAttemptedAt: row.twelve_month_email_attempted_at,
    twelveMonthEmailAttempts: row.twelve_month_email_attempts ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function toCustomerPayload(input: Partial<CustomerInput> & CustomerUpdateInput) {
  return {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.email !== undefined ? { email: normalizeEmail(input.email) } : {}),
    ...(input.purchaseDate !== undefined ? { purchase_date: input.purchaseDate } : {}),
    ...(input.purchasedItem !== undefined ? { purchased_item: input.purchasedItem.trim() } : {}),
    ...(input.notes !== undefined ? { notes: input.notes.trim() } : {}),
    ...(input.preferredLanguage !== undefined ? { preferred_language: input.preferredLanguage } : {}),
    ...(input.followUpEnabled !== undefined ? { follow_up_enabled: input.followUpEnabled } : {}),
    ...(input.followUpPermissionStatus !== undefined ? { follow_up_permission_status: input.followUpPermissionStatus } : {}),
    ...(input.followUpPermissionCapturedAt !== undefined
      ? { follow_up_permission_captured_at: input.followUpPermissionCapturedAt }
      : {}),
    ...(input.followUpPermissionSource !== undefined
      ? { follow_up_permission_source: input.followUpPermissionSource.trim() }
      : {}),
    ...(input.followUpPermissionTextVersion !== undefined
      ? { follow_up_permission_text_version: input.followUpPermissionTextVersion.trim() }
      : {}),
    ...(input.followUpPermissionInformation !== undefined
      ? { follow_up_permission_information: input.followUpPermissionInformation.trim() }
      : {}),
    ...(input.reviewStatus !== undefined ? { review_status: input.reviewStatus } : {}),
    ...(input.reviewFoundAt !== undefined ? { review_found_at: input.reviewFoundAt } : {}),
    ...(input.reviewSource !== undefined ? { review_source: input.reviewSource } : {}),
    ...(input.manualReviewConfirmedAt !== undefined
      ? { manual_review_confirmed_at: input.manualReviewConfirmedAt }
      : {}),
    ...(input.manualReviewSource !== undefined ? { manual_review_source: input.manualReviewSource } : {}),
    ...(input.followUpOptOut !== undefined ? { follow_up_opt_out: input.followUpOptOut } : {}),
    ...(input.followUpOptedOutAt !== undefined ? { follow_up_opted_out_at: input.followUpOptedOutAt } : {}),
  };
}

export async function fetchCustomersFromSupabase(): Promise<Customer[]> {
  const client = getClient();
  const { data, error } = await client
    .from('customers')
    .select(CUSTOMER_COLUMNS)
    .is('deleted_at', null)
    .order('purchase_date', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toCustomer(row as unknown as CustomerRow));
}

export async function createCustomerInSupabase(input: CustomerInput): Promise<Customer> {
  const client = getClient();
  const { data, error } = await client
    .from('customers')
    .insert(toCustomerPayload(input))
    .select(CUSTOMER_COLUMNS)
    .single();

  if (error) throw error;
  return toCustomer(data as unknown as CustomerRow);
}

export async function updateCustomerInSupabase(id: number, changes: CustomerUpdateInput): Promise<Customer> {
  const client = getClient();
  const { data, error } = await client
    .from('customers')
    .update(toCustomerPayload(changes))
    .eq('id', id)
    .select(CUSTOMER_COLUMNS)
    .single();

  if (error) throw error;
  return toCustomer(data as unknown as CustomerRow);
}

export async function resetFailedCustomerReminderInSupabase(id: number, stage: ReminderStage): Promise<Customer> {
  const client = getClient();
  const { data, error } = await client.rpc('reset_failed_customer_reminder_for_admin', {
    p_customer_id: id,
    p_stage: stage,
  });

  if (error) throw error;
  if (data !== true) {
    throw new Error('Kein fehlgeschlagener Versand zum Zurücksetzen gefunden.');
  }

  const { data: customer, error: customerError } = await client
    .from('customers')
    .select(CUSTOMER_COLUMNS)
    .eq('id', id)
    .single();

  if (customerError) throw customerError;
  return toCustomer(customer as unknown as CustomerRow);
}

export async function deleteCustomerFromSupabase(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
