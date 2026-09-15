export const CUSTOMER_REVIEW_RPC_NAME = 'submit_customer_review_with_token';

export const CUSTOMER_REVIEW_RPC_PARAM_NAMES = [
  'p_token',
  'p_rating',
  'p_beschreibung',
  'p_ort',
  'p_public_consent',
] as const;

export interface CustomerReviewRpcInput {
  token: string;
  rating: number;
  description: string;
  location?: string | null;
  publicConsent: boolean;
}

export type CustomerReviewRpcPayload = {
  p_token: string;
  p_rating: number;
  p_beschreibung: string;
  p_ort: string;
  p_public_consent: boolean;
};

export interface SafeSupabaseError {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  status?: unknown;
}

function normalizeIntegerRating(value: number) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.trunc(numericValue);
}

export function createCustomerReviewRpcPayload(input: CustomerReviewRpcInput): CustomerReviewRpcPayload {
  return {
    p_token: String(input.token),
    p_rating: normalizeIntegerRating(input.rating),
    p_beschreibung: String(input.description),
    p_ort: String(input.location ?? ''),
    p_public_consent: Boolean(input.publicConsent),
  };
}

export function getReviewErrorCode(error: unknown) {
  const maybeError = error as SafeSupabaseError | null;

  if (typeof maybeError?.code === 'string' && maybeError.code.trim()) {
    return `supabase_${maybeError.code.trim().toLowerCase()}`;
  }

  if (typeof maybeError?.status === 'number') {
    return `http_${maybeError.status}`;
  }

  const message = typeof maybeError?.message === 'string' ? maybeError.message.toLowerCase() : '';
  if (message.includes('failed to fetch') || message.includes('network')) return 'network_error';
  if (message.includes('row-level security')) return 'rls_blocked';
  if (message.includes('function') && message.includes('does not exist')) return 'rpc_missing';

  return 'review_rpc_error';
}

export function createSafeReviewRpcErrorLog(error: unknown) {
  const maybeError = error as SafeSupabaseError | null;

  return {
    provider: 'supabase',
    rpc: CUSTOMER_REVIEW_RPC_NAME,
    param_names: CUSTOMER_REVIEW_RPC_PARAM_NAMES,
    code: maybeError?.code,
    message: maybeError?.message,
    details: maybeError?.details,
    hint: maybeError?.hint,
  };
}
