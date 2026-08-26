import { describe, expect, it } from 'vitest';
import {
  buildFollowupEmail,
  createResendSendError,
  getSafeSendFailureDetails,
  type ClaimedReminder,
  type PreferredLanguage,
  type ReminderStage,
} from '../../../api/customer-followups';

const baseReminder: ClaimedReminder = {
  customer_id: 1,
  reminder_stage: 'two_month',
  customer_name: 'Bastian Hochreither',
  customer_email: 'bastian@example.com',
  preferred_language: 'de',
  purchased_item: 'Verkaufsanhänger',
  purchase_date: '2026-01-15',
};

function buildEmail(overrides: Partial<ClaimedReminder> = {}) {
  return buildFollowupEmail(
    { ...baseReminder, ...overrides },
    'https://asea.example',
    'review-token_123',
    'unsubscribe-token_456',
  );
}

describe('customer follow-up email template', () => {
  it.each([
    ['two_month', 'Wie zufrieden sind Sie mit Ihrem ASEA Anhänger?', 'Wie zufrieden sind Sie bisher mit Ihrem ASEA Anhänger?', 'Erfahrung teilen'],
    ['six_month', 'Ihre Erfahrung mit Ihrem ASEA Anhänger', 'Wie hat sich Ihr ASEA Anhänger bisher im Alltag bewährt?', 'Bewertung abgeben'],
    ['twelve_month', 'Ein Jahr mit Ihrem ASEA Anhänger', 'Wie hat sich Ihr ASEA Anhänger im ersten Jahr bewährt?', 'Erfahrung nach einem Jahr teilen'],
  ] satisfies [ReminderStage, string, string, string][])(
    'renders the German %s mail with the expected copy',
    (stage, subject, question, cta) => {
      const email = buildEmail({ reminder_stage: stage, preferred_language: 'de' });

      expect(email.subject).toBe(subject);
      expect(email.html).toContain(question);
      expect(email.html).toContain(cta);
      expect(email.html).toContain('Verkaufsanhänger ASEA');
      expect(email.html).toContain('background:#1c1c1a');
      expect(email.html).toContain('background:#c8a96e');
      expect(email.html).toContain('border-left:4px solid #c8a96e');
      expect(email.text).toContain(question);
    },
  );

  it.each([
    ['de', 'Guten Tag Bastian Hochreither,', 'Weitere Bewertungsanfragen deaktivieren'],
    ['en', 'Hello Bastian Hochreither,', 'Disable further review requests'],
    ['sk', 'Dobrý deň Bastian Hochreither,', 'Deaktivovať ďalšie žiadosti o hodnotenie'],
  ] satisfies [PreferredLanguage, string, string][])(
    'renders natural language-specific copy for %s',
    (language, greeting, unsubscribeText) => {
      const email = buildEmail({ preferred_language: language });

      expect(email.html).toContain(greeting);
      expect(email.html).toContain(unsubscribeText);
      expect(email.text).toContain(greeting);
      expect(email.text).toContain(unsubscribeText);
    },
  );

  it('uses the secure personal review route and keeps the unsubscribe route unchanged', () => {
    const email = buildEmail();

    expect(email.html).toContain('https://asea.example/bewertung?token=review-token_123');
    expect(email.text).toContain('https://asea.example/bewertung?token=review-token_123');
    expect(email.html).toContain('https://asea.example/bewertung-abmelden?token=unsubscribe-token_456');
    expect(email.text).toContain('https://asea.example/bewertung-abmelden?token=unsubscribe-token_456');
    expect(`${email.html}\n${email.text}`).not.toContain('/kontakt#erfahrung-teilen');
  });

  it('falls back cleanly when customer name or product is missing', () => {
    const email = buildEmail({
      customer_name: '',
      purchased_item: '',
    });

    expect(email.html).toContain('Guten Tag,');
    expect(email.text).toContain('Guten Tag,');
    expect(email.html).toContain('Ihr ASEA Anhänger ist seit dem Kauf');
    expect(email.text).toContain('Ihr ASEA Anhänger ist seit dem Kauf');
    expect(`${email.html}\n${email.text}`).not.toMatch(/\b(undefined|null)\b/i);
  });

  it('treats literal undefined and null values as empty dynamic input', () => {
    const email = buildEmail({
      customer_name: 'undefined',
      purchased_item: 'null',
    });

    expect(email.html).toContain('Guten Tag,');
    expect(email.html).toContain('Ihr ASEA Anhänger ist seit dem Kauf');
    expect(`${email.html}\n${email.text}`).not.toMatch(/\b(undefined|null)\b/i);
  });

  it('escapes untrusted customer and product names in HTML', () => {
    const email = buildEmail({
      customer_name: '<script>alert(1)</script>',
      purchased_item: '<img src=x onerror=alert(1)>',
    });

    expect(email.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(email.html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(email.html).not.toContain('<script>alert(1)</script>');
    expect(email.html).not.toContain('<img src=x onerror=alert(1)>');
  });

  it('does not include stars or rating influence in the email itself', () => {
    const email = buildEmail({ reminder_stage: 'six_month' });
    const content = `${email.html}\n${email.text}`;

    expect(content).not.toContain('★');
    expect(content).not.toMatch(/5\s*sterne/i);
    expect(content).not.toMatch(/5\s*stars/i);
  });

  it('includes a readable plain-text fallback', () => {
    const email = buildEmail({ reminder_stage: 'twelve_month' });

    expect(email.text).toContain('Guten Tag Bastian Hochreither,');
    expect(email.text).toContain('Bewertungslink: https://asea.example/bewertung?token=review-token_123');
    expect(email.text).toContain('Abmeldelink: https://asea.example/bewertung-abmelden?token=unsubscribe-token_456');
    expect(email.text).toContain('Verkaufsanhänger ASEA');
    expect(email.text).toContain('Lahrndorf 34');
  });

  it('extracts and masks detailed Resend provider errors for safe logs', async () => {
    const response = new Response(JSON.stringify({
      name: 'validation_error',
      message: 'You can only send testing emails to your own email address (bastianhochreither@gmx.at).',
    }), {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    });

    const error = await createResendSendError(response);
    const details = getSafeSendFailureDetails(error);

    expect(details).toEqual({
      provider: 'resend',
      http_status: 403,
      error_code: 'resend_403_validation_error',
      error_message: 'You can only send testing emails to your own email address ([email]).',
    });
  });
});
