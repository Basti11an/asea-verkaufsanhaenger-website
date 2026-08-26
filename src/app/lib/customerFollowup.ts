export type ReminderStage = 'two_month' | 'six_month' | 'twelve_month';
export type MailStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'skipped';
export type FollowUpPermissionStatus =
  | 'unknown'
  | 'consented'
  | 'existing_customer_permitted'
  | 'revoked'
  | 'blocked';
export type CustomerReviewStatus = 'none' | 'auto_matched' | 'manual_confirmed';
export type CustomerReviewSource = 'asea_website' | 'google' | 'personal' | 'phone' | 'other';
export type StopReason =
  | 'deleted'
  | 'opted_out'
  | 'review_found'
  | 'manual_review'
  | 'follow_up_disabled'
  | 'permission_missing'
  | 'completed';

export interface CustomerFollowupSnapshot {
  purchaseDate: string;
  deletedAt?: string | null;
  followUpEnabled: boolean;
  followUpPermissionStatus: FollowUpPermissionStatus;
  followUpOptOut: boolean;
  reviewStatus: CustomerReviewStatus;
  reviewFoundAt?: string | null;
  manualReviewConfirmedAt?: string | null;
  twoMonthEmailStatus: MailStatus;
  twoMonthEmailSentAt?: string | null;
  twoMonthEmailAttemptedAt?: string | null;
  twoMonthEmailAttempts?: number;
  sixMonthEmailStatus: MailStatus;
  sixMonthEmailSentAt?: string | null;
  sixMonthEmailAttemptedAt?: string | null;
  sixMonthEmailAttempts?: number;
  twelveMonthEmailStatus: MailStatus;
  twelveMonthEmailSentAt?: string | null;
  twelveMonthEmailAttemptedAt?: string | null;
  twelveMonthEmailAttempts?: number;
}

export interface NextReminder {
  stage: ReminderStage;
  dueDate: string;
  isDue: boolean;
}

const ALLOWED_PERMISSION_STATUSES: FollowUpPermissionStatus[] = [
  'consented',
  'existing_customer_permitted',
];

const REMINDER_MONTHS: Record<ReminderStage, number> = {
  two_month: 2,
  six_month: 6,
  twelve_month: 12,
};

const STAGE_ORDER: ReminderStage[] = ['two_month', 'six_month', 'twelve_month'];

export const REMINDER_LABELS: Record<ReminderStage, string> = {
  two_month: '2-Monats-Mail',
  six_month: '6-Monats-Mail',
  twelve_month: '12-Monats-Mail',
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

export function toIsoDate(value: Date) {
  return `${value.getUTCFullYear()}-${padDatePart(value.getUTCMonth() + 1)}-${padDatePart(value.getUTCDate())}`;
}

export function dateOnly(value: string | Date) {
  if (value instanceof Date) return toIsoDate(value);
  return value.trim().slice(0, 10);
}

function parseIsoDate(value: string | Date) {
  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  const [year, month, day] = dateOnly(value).split('-').map(Number);
  if (!year || !month || !day) return null;

  return new Date(Date.UTC(year, month - 1, day));
}

function lastDayOfMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function addCalendarMonths(value: string | Date, months: number) {
  const date = parseIsoDate(value);
  if (!date) return '';

  const targetMonthIndex = date.getUTCMonth() + months;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const day = Math.min(date.getUTCDate(), lastDayOfMonth(targetYear, normalizedMonthIndex));

  return toIsoDate(new Date(Date.UTC(targetYear, normalizedMonthIndex, day)));
}

export function getReminderDueDate(purchaseDate: string, stage: ReminderStage) {
  return addCalendarMonths(purchaseDate, REMINDER_MONTHS[stage]);
}

export function hasAllowedFollowupPermission(status: FollowUpPermissionStatus) {
  return ALLOWED_PERMISSION_STATUSES.includes(status);
}

export function hasCustomerReview(customer: CustomerFollowupSnapshot) {
  return (
    customer.reviewStatus === 'auto_matched' ||
    customer.reviewStatus === 'manual_confirmed' ||
    Boolean(customer.reviewFoundAt) ||
    Boolean(customer.manualReviewConfirmedAt)
  );
}

export function getCustomerStopReason(customer: CustomerFollowupSnapshot): StopReason | null {
  if (customer.deletedAt) return 'deleted';
  if (customer.followUpOptOut || customer.followUpPermissionStatus === 'revoked') return 'opted_out';
  if (customer.reviewStatus === 'auto_matched' || customer.reviewFoundAt) return 'review_found';
  if (customer.reviewStatus === 'manual_confirmed' || customer.manualReviewConfirmedAt) return 'manual_review';
  if (!customer.followUpEnabled) return 'follow_up_disabled';
  if (!hasAllowedFollowupPermission(customer.followUpPermissionStatus)) return 'permission_missing';
  if (customer.twelveMonthEmailStatus === 'sent' || customer.twelveMonthEmailSentAt) return 'completed';
  return null;
}

function getStageStatus(customer: CustomerFollowupSnapshot, stage: ReminderStage) {
  if (stage === 'two_month') {
    return {
      status: customer.twoMonthEmailStatus,
      sentAt: customer.twoMonthEmailSentAt,
      attemptedAt: customer.twoMonthEmailAttemptedAt,
      attempts: customer.twoMonthEmailAttempts ?? 0,
    };
  }

  if (stage === 'six_month') {
    return {
      status: customer.sixMonthEmailStatus,
      sentAt: customer.sixMonthEmailSentAt,
      attemptedAt: customer.sixMonthEmailAttemptedAt,
      attempts: customer.sixMonthEmailAttempts ?? 0,
    };
  }

  return {
    status: customer.twelveMonthEmailStatus,
    sentAt: customer.twelveMonthEmailSentAt,
    attemptedAt: customer.twelveMonthEmailAttemptedAt,
    attempts: customer.twelveMonthEmailAttempts ?? 0,
  };
}

function toComparableTime(value: string | Date) {
  if (value instanceof Date) return value.getTime();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00.000Z`).getTime();
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function isRetryCoolingDown(status: MailStatus, attemptedAt: string | null | undefined, now: string | Date) {
  if (status !== 'failed' && status !== 'processing') return false;
  if (!attemptedAt) return false;

  const attemptedTime = new Date(attemptedAt).getTime();
  if (!Number.isFinite(attemptedTime)) return false;

  return toComparableTime(now) - attemptedTime < 24 * 60 * 60 * 1000;
}

export function getNextReminder(customer: CustomerFollowupSnapshot, today: string | Date = new Date()): NextReminder | null {
  if (getCustomerStopReason(customer)) return null;

  const todayDate = dateOnly(today);

  for (const stage of STAGE_ORDER) {
    const { status, sentAt, attemptedAt, attempts } = getStageStatus(customer, stage);
    if (status === 'sent' || status === 'skipped' || sentAt) continue;
    if (attempts >= 3) continue;

    const dueDate = getReminderDueDate(customer.purchaseDate, stage);
    if (!dueDate) continue;

    if (isRetryCoolingDown(status, attemptedAt, today)) {
      return {
        stage,
        dueDate,
        isDue: false,
      };
    }

    return {
      stage,
      dueDate,
      isDue: dueDate <= todayDate,
    };
  }

  return null;
}

export function isReminderDue(customer: CustomerFollowupSnapshot, stage: ReminderStage, today: string | Date = new Date()) {
  if (getCustomerStopReason(customer)) return false;

  const nextReminder = getNextReminder(customer, today);
  return Boolean(nextReminder && nextReminder.stage === stage && nextReminder.isDue);
}
