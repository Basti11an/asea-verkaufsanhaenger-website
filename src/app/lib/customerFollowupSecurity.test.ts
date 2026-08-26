import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SQL = readFileSync(join(ROOT, 'supabase/customer_followups.sql'), 'utf8').toLowerCase();
const FOLLOWUP_API = readFileSync(join(ROOT, 'api/customer-followups.ts'), 'utf8');

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walkFiles(path);
    return path;
  });
}

describe('customer follow-up security migration', () => {
  it('enables RLS on all private customer tables', () => {
    expect(SQL).toContain('alter table public.customers enable row level security;');
    expect(SQL).toContain('alter table public.customer_followup_events enable row level security;');
    expect(SQL).toContain('alter table public.customer_followup_unsubscribe_tokens enable row level security;');
    expect(SQL).toContain('alter table public.customer_review_tokens enable row level security;');
  });

  it('does not grant anon direct access to private customer tables', () => {
    expect(SQL).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+on table public\.customers\s+to anon/);
    expect(SQL).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+on table public\.customer_followup_events\s+to anon/);
    expect(SQL).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+on table public\.customer_followup_unsubscribe_tokens\s+to anon/);
    expect(SQL).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+on table public\.customer_review_tokens\s+to anon/);
  });

  it('keeps reminder cron RPCs service-role only', () => {
    expect(SQL).toContain('grant execute on function public.claim_due_customer_reminders(integer) to service_role;');
    expect(SQL).toContain('grant execute on function public.verify_customer_reminder_claim(bigint, text) to service_role;');
    expect(SQL).toContain('grant execute on function public.register_customer_unsubscribe_token(bigint, text) to service_role;');
    expect(SQL).toContain('grant execute on function public.register_customer_review_token(bigint, text, text) to service_role;');
    expect(SQL).toContain('grant execute on function public.record_customer_reminder_result(bigint, text, text, text) to service_role;');
    expect(SQL).not.toMatch(/grant execute on function public\.claim_due_customer_reminders\(integer\) to (anon|authenticated)/);
  });

  it('allows public review submission only through a token RPC', () => {
    expect(SQL).toContain('create table if not exists public.customer_review_tokens');
    expect(SQL).toContain('create or replace function public.submit_customer_review_with_token');
    expect(SQL).toContain('grant execute on function public.submit_customer_review_with_token(text, integer, text, text, boolean) to anon, authenticated;');
    expect(SQL).toContain("v_token_hash := encode(digest(p_token, 'sha256'), 'hex');");
  });

  it('keeps non-consented reviews out of public reference reads', () => {
    expect(SQL).toContain('public_consent boolean not null default true');
    expect(SQL).toContain('status = \'approved\' and sichtbar = true and public_consent = true');
  });

  it('uses secure token review links instead of the old contact anchor', () => {
    expect(FOLLOWUP_API).toContain('/bewertung?token=');
    expect(FOLLOWUP_API).not.toContain('/kontakt#erfahrung-teilen');
    expect(FOLLOWUP_API).not.toContain('customer_email}');
  });

  it('rechecks review matching when a customer email changes', () => {
    expect(SQL).toContain('create or replace function public.rematch_customer_references_for_customer()');
    expect(SQL).toContain('after insert or update of email on public.customers');
  });

  it('does not put server-only secret names into frontend source files', () => {
    const forbidden = [
      'SUPABASE_SERVICE_ROLE_KEY',
      'RESEND_API_KEY',
      'FOLLOWUP_FROM_EMAIL',
      'FOLLOWUP_REPLY_TO_EMAIL',
    ];

    const frontendFiles = walkFiles(join(ROOT, 'src'))
      .filter((path) => /\.(ts|tsx|js|jsx)$/.test(path))
      .filter((path) => !path.endsWith('customerFollowupSecurity.test.ts'));

    for (const file of frontendFiles) {
      const content = readFileSync(file, 'utf8');
      for (const secretName of forbidden) {
        expect(content, `${secretName} must not be referenced in ${file}`).not.toContain(secretName);
      }
    }
  });
});
