-- Debug fuer ASEA Kunden-Follow-ups im Supabase SQL Editor.
-- Wichtig: Ersetze DEINE_TESTKUNDEN_EMAIL durch die E-Mail-Adresse des Testkunden.
-- Die ersten vier Abfragen veraendern keine Daten.

-- 1) Vollstaendiger relevanter customers-Datensatz
with target as (
  select id
  from public.customers
  where lower(btrim(email)) = lower(btrim('DEINE_TESTKUNDEN_EMAIL'))
  order by id desc
  limit 1
)
select
  id,
  name,
  email,
  purchase_date,
  purchased_item,
  preferred_language,
  deleted_at,
  follow_up_enabled,
  follow_up_permission_status,
  follow_up_permission_captured_at,
  follow_up_permission_source,
  follow_up_permission_text_version,
  follow_up_opt_out,
  follow_up_opted_out_at,
  review_status,
  review_found_at,
  manual_review_confirmed_at,
  two_month_email_status,
  two_month_email_sent_at,
  two_month_email_attempted_at,
  two_month_email_attempts,
  six_month_email_status,
  six_month_email_sent_at,
  six_month_email_attempted_at,
  six_month_email_attempts,
  twelve_month_email_status,
  twelve_month_email_sent_at,
  twelve_month_email_attempted_at,
  twelve_month_email_attempts,
  created_at,
  updated_at
from public.customers
where id = (select id from target);

-- 2) Alle Follow-up-Events zum Testkunden
with target as (
  select id
  from public.customers
  where lower(btrim(email)) = lower(btrim('DEINE_TESTKUNDEN_EMAIL'))
  order by id desc
  limit 1
)
select
  id,
  customer_id,
  event_type,
  reminder_stage,
  status,
  error_code,
  actor_user_id,
  created_at
from public.customer_followup_events
where customer_id = (select id from target)
order by created_at desc, id desc;

-- 3) Welche Reminder-Stufe berechnet die Hilfsfunktion?
with target_customer as (
  select *
  from public.customers
  where lower(btrim(email)) = lower(btrim('DEINE_TESTKUNDEN_EMAIL'))
  order by id desc
  limit 1
)
select
  id,
  (now() at time zone 'Europe/Vienna')::date as today_vienna,
  purchase_date,
  (purchase_date + interval '2 months')::date as two_month_due_date,
  (purchase_date + interval '6 months')::date as six_month_due_date,
  (purchase_date + interval '12 months')::date as twelve_month_due_date,
  public.get_customer_claimable_reminder_stage(
    purchase_date,
    two_month_email_status,
    two_month_email_sent_at,
    two_month_email_attempted_at,
    two_month_email_attempts,
    six_month_email_status,
    six_month_email_sent_at,
    six_month_email_attempted_at,
    six_month_email_attempts,
    twelve_month_email_status,
    twelve_month_email_sent_at,
    twelve_month_email_attempted_at,
    twelve_month_email_attempts
  ) as calculated_stage
from target_customer;

-- 4) Wuerde die Claim-Auswahl diesen Kunden theoretisch auswaehlen?
with candidate as (
  select
    c.*,
    due.stage as calculated_stage
  from public.customers c
  cross join lateral (
    select public.get_customer_claimable_reminder_stage(
      c.purchase_date,
      c.two_month_email_status,
      c.two_month_email_sent_at,
      c.two_month_email_attempted_at,
      c.two_month_email_attempts,
      c.six_month_email_status,
      c.six_month_email_sent_at,
      c.six_month_email_attempted_at,
      c.six_month_email_attempts,
      c.twelve_month_email_status,
      c.twelve_month_email_sent_at,
      c.twelve_month_email_attempted_at,
      c.twelve_month_email_attempts
    ) as stage
  ) due
  where lower(btrim(c.email)) = lower(btrim('DEINE_TESTKUNDEN_EMAIL'))
  order by c.id desc
  limit 1
)
select
  id,
  calculated_stage,
  case
    when deleted_at is not null then 'blocked: deleted_at'
    when coalesce(follow_up_enabled, true) <> true then 'blocked: follow_up_enabled'
    when coalesce(follow_up_opt_out, false) <> false then 'blocked: follow_up_opt_out'
    when coalesce(follow_up_permission_status, 'unknown') not in ('consented', 'existing_customer_permitted') then 'blocked: follow_up_permission_status'
    when coalesce(review_status, 'none') <> 'none' then 'blocked: review_status'
    when review_found_at is not null then 'blocked: review_found_at'
    when manual_review_confirmed_at is not null then 'blocked: manual_review_confirmed_at'
    when coalesce(twelve_month_email_status, 'pending') = 'sent' then 'blocked: twelve_month_email_status sent'
    when twelve_month_email_sent_at is not null then 'blocked: twelve_month_email_sent_at'
    when calculated_stage is null then 'blocked: no claimable stage'
    else 'would be claimed'
  end as claim_diagnosis
from candidate;

-- 5) Welche RPC-Versionen existieren wirklich?
select
  p.oid::regprocedure as signature,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as returns,
  p.prosecdef as security_definer,
  p.proacl as grants
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'claim_due_customer_reminders',
    'get_customer_claimable_reminder_stage',
    'verify_customer_reminder_claim'
  )
order by p.proname, p.oid::regprocedure::text;

-- 6) ACHTUNG: Diese Abfrage veraendert Daten wirklich.
-- Sie claimt faellige Kunden und setzt den jeweiligen Reminder auf processing.
-- Nur ausfuehren, wenn du danach bewusst die API oder record_customer_reminder_result verwendest.
--
-- select * from public.claim_due_customer_reminders(20);
