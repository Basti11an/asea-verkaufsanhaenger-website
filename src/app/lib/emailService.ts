import emailjs from '@emailjs/browser';
import type { ContactRequestInput } from './contactRequestsRepository';

const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() ?? '',
  internalTemplateId: import.meta.env.VITE_EMAILJS_INTERNAL_TEMPLATE_ID?.trim() ?? '',
  customerTemplateId: import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID?.trim() ?? '',
  internalRecipient: import.meta.env.VITE_EMAILJS_INTERNAL_RECIPIENT?.trim() ?? '',
};

const EMAILJS_SEND_DELAY_MS = 1100;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatSubmittedAt(date = new Date()) {
  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${formattedDate}, ${formattedTime} Uhr`;
}

function assertEmailJsConfigured() {
  if (
    !emailJsConfig.serviceId ||
    !emailJsConfig.publicKey ||
    !emailJsConfig.internalTemplateId ||
    !emailJsConfig.customerTemplateId ||
    !emailJsConfig.internalRecipient
  ) {
    throw new Error('EmailJS ist noch nicht vollständig konfiguriert.');
  }
}

export function isEmailJsConfigured() {
  return Boolean(
    emailJsConfig.serviceId &&
      emailJsConfig.publicKey &&
      emailJsConfig.internalTemplateId &&
      emailJsConfig.customerTemplateId &&
      emailJsConfig.internalRecipient,
  );
}

export async function sendContactRequestEmails(request: ContactRequestInput) {
  assertEmailJsConfigured();

  const templateParams = {
    customer_name: request.name,
    customer_email: request.email,
    customer_phone: request.phone || 'Nicht angegeben',
    subject: request.subject,
    message: request.message,
  };

  await emailjs.send(
    emailJsConfig.serviceId,
    emailJsConfig.internalTemplateId,
    {
      ...templateParams,
      submitted_at: formatSubmittedAt(),
      to_email: emailJsConfig.internalRecipient,
      recipient_email: emailJsConfig.internalRecipient,
    },
    { publicKey: emailJsConfig.publicKey },
  );

  await wait(EMAILJS_SEND_DELAY_MS);

  await emailjs.send(
    emailJsConfig.serviceId,
    emailJsConfig.customerTemplateId,
    {
      ...templateParams,
      to_email: request.email,
      recipient_email: request.email,
    },
    { publicKey: emailJsConfig.publicKey },
  );
}
