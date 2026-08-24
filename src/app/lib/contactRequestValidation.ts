import type { ContactRequestInput, ContactRequestSource } from './contactRequestsRepository';

interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type ValidationResult =
  | { ok: true; value: ContactRequestInput }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d\s()\-/.]{5,60}$/;

function normalizeText(value: string) {
  return value.trim().replace(/\r\n/g, '\n');
}

function rejectSuspiciousText(value: string) {
  return /<\s*script/i.test(value) || /javascript\s*:/i.test(value);
}

export function validateContactRequest(input: ContactFormInput, source: ContactRequestSource): ValidationResult {
  const name = normalizeText(input.name);
  const email = normalizeText(input.email).toLowerCase();
  const phone = normalizeText(input.phone);
  const subject = normalizeText(input.subject);
  const message = normalizeText(input.message);

  if (!name || !email || !subject || !message) {
    return { ok: false, error: 'Bitte füllen Sie alle Pflichtfelder aus.' };
  }

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: 'Bitte geben Sie einen gültigen Namen mit 2 bis 120 Zeichen ein.' };
  }

  if (email.length > 160 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' };
  }

  if (phone) {
    const digitCount = phone.replace(/\D/g, '').length;
    if (phone.length > 60 || digitCount < 5 || !PHONE_PATTERN.test(phone)) {
      return { ok: false, error: 'Bitte geben Sie eine gültige Telefonnummer ein oder lassen Sie das Feld leer.' };
    }
  }

  if (subject.length < 3 || subject.length > 160) {
    return { ok: false, error: 'Bitte geben Sie einen Betreff mit 3 bis 160 Zeichen ein.' };
  }

  if (message.length < 10 || message.length > 3000) {
    return { ok: false, error: 'Bitte geben Sie eine Nachricht mit 10 bis 3000 Zeichen ein.' };
  }

  if ([name, email, phone, subject, message].some(rejectSuspiciousText)) {
    return { ok: false, error: 'Die Eingabe enthält nicht erlaubte Zeichenfolgen.' };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      subject,
      message,
      source,
    },
  };
}
