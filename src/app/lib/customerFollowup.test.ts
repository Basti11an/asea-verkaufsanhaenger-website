import { describe, expect, it } from 'vitest';
import {
  addCalendarMonths,
  getCustomerStopReason,
  getNextReminder,
  isReminderDue,
  normalizeEmail,
  type CustomerFollowupSnapshot,
} from './customerFollowup';

function customer(overrides: Partial<CustomerFollowupSnapshot> = {}): CustomerFollowupSnapshot {
  return {
    purchaseDate: '2026-01-31',
    deletedAt: null,
    followUpEnabled: true,
    followUpPermissionStatus: 'consented',
    followUpOptOut: false,
    reviewStatus: 'none',
    reviewFoundAt: null,
    manualReviewConfirmedAt: null,
    twoMonthEmailStatus: 'pending',
    twoMonthEmailSentAt: null,
    twoMonthEmailAttempts: 0,
    sixMonthEmailStatus: 'pending',
    sixMonthEmailSentAt: null,
    sixMonthEmailAttempts: 0,
    twelveMonthEmailStatus: 'pending',
    twelveMonthEmailSentAt: null,
    twelveMonthEmailAttempts: 0,
    ...overrides,
  };
}

describe('customer follow-up logic', () => {
  it('normalizes email addresses for internal matching', () => {
    expect(normalizeEmail('  MAX.Mustermann@Example.AT  ')).toBe('max.mustermann@example.at');
  });

  it('adds calendar months instead of fixed day counts', () => {
    expect(addCalendarMonths('2026-01-31', 2)).toBe('2026-03-31');
    expect(addCalendarMonths('2026-08-31', 6)).toBe('2027-02-28');
    expect(addCalendarMonths('2024-02-29', 12)).toBe('2025-02-28');
  });

  it('detects the first due two-month reminder', () => {
    const result = getNextReminder(customer(), '2026-03-31');
    expect(result).toEqual({
      stage: 'two_month',
      dueDate: '2026-03-31',
      isDue: true,
    });
    expect(isReminderDue(customer(), 'two_month', '2026-03-31')).toBe(true);
  });

  it('does not send without documented permission', () => {
    const snapshot = customer({ followUpPermissionStatus: 'unknown' });
    expect(getCustomerStopReason(snapshot)).toBe('permission_missing');
    expect(getNextReminder(snapshot, '2026-03-31')).toBeNull();
  });

  it('detects six-month and twelve-month reminders after earlier reminders were sent', () => {
    const afterTwoMonth = customer({
      twoMonthEmailStatus: 'sent',
      twoMonthEmailSentAt: '2026-03-31T08:00:00Z',
    });
    expect(isReminderDue(afterTwoMonth, 'six_month', '2026-07-31')).toBe(true);

    const afterSixMonth = customer({
      twoMonthEmailStatus: 'sent',
      twoMonthEmailSentAt: '2026-03-31T08:00:00Z',
      sixMonthEmailStatus: 'sent',
      sixMonthEmailSentAt: '2026-07-31T08:00:00Z',
    });
    expect(isReminderDue(afterSixMonth, 'twelve_month', '2027-01-31')).toBe(true);
  });

  it('does not send when follow-up was manually disabled', () => {
    const snapshot = customer({ followUpEnabled: false });
    expect(getCustomerStopReason(snapshot)).toBe('follow_up_disabled');
    expect(getNextReminder(snapshot, '2026-03-31')).toBeNull();
  });

  it('stops after opt-out, automatic review or manual review', () => {
    expect(getCustomerStopReason(customer({ followUpOptOut: true }))).toBe('opted_out');
    expect(getCustomerStopReason(customer({ reviewStatus: 'auto_matched' }))).toBe('review_found');
    expect(getCustomerStopReason(customer({ reviewStatus: 'manual_confirmed' }))).toBe('manual_review');
  });

  it('does not send the same reminder twice', () => {
    const snapshot = customer({
      twoMonthEmailStatus: 'sent',
      twoMonthEmailSentAt: '2026-03-31T08:00:00Z',
    });

    const result = getNextReminder(snapshot, '2026-07-31');
    expect(result?.stage).toBe('six_month');
  });

  it('stops after the twelve-month reminder was sent', () => {
    const snapshot = customer({
      twelveMonthEmailStatus: 'sent',
      twelveMonthEmailSentAt: '2027-01-31T08:00:00Z',
    });

    expect(getCustomerStopReason(snapshot)).toBe('completed');
    expect(getNextReminder(snapshot, '2027-02-01')).toBeNull();
  });
});
