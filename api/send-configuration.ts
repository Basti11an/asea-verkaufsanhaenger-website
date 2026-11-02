import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

type ConfigurationRequest = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  pdfDataUrl: string;
  pdfFileName: string;
};

type ValidatedConfiguration = Omit<ConfigurationRequest, 'pdfDataUrl'> & {
  pdfBase64: string;
};

type ResendErrorBody = {
  name?: string;
  message?: string;
  statusCode?: number;
};

const MAX_REQUEST_BYTES = 3_500_000;
const MAX_PDF_BYTES = 2_000_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEnv(name: string) {
  return process.env[name]?.trim() ?? '';
}

function sendJson(res: ServerResponse, status: number, payload: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_REQUEST_BYTES) throw new Error('request_too_large');
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    throw new Error('invalid_json');
  }
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function sanitizePdfFileName(value: unknown) {
  const cleaned = cleanText(value, 160)
    .replace(/[^a-zA-Z0-9ÄÖÜäöüß._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : `${cleaned || 'ASEA-Konfiguration'}.pdf`;
}

export function validateConfigurationRequest(value: unknown): ValidatedConfiguration {
  if (!value || typeof value !== 'object') throw new Error('invalid_request');
  const body = value as Partial<ConfigurationRequest>;
  const firstName = cleanText(body.firstName, 80);
  const lastName = cleanText(body.lastName, 80);
  const email = cleanText(body.email, 254).toLowerCase();
  const message = cleanText(body.message, 5000);
  const pdfFileName = sanitizePdfFileName(body.pdfFileName);

  if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) throw new Error('invalid_customer');
  if (typeof body.pdfDataUrl !== 'string') throw new Error('invalid_pdf');

  const match = /^data:application\/pdf(?:;filename=[^;]+)?;base64,([a-zA-Z0-9+/=]+)$/i.exec(body.pdfDataUrl);
  if (!match) throw new Error('invalid_pdf');
  const pdfBuffer = Buffer.from(match[1], 'base64');
  if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_PDF_BYTES) throw new Error('invalid_pdf_size');
  if (pdfBuffer.subarray(0, 5).toString('ascii') !== '%PDF-') throw new Error('invalid_pdf');

  return {
    firstName,
    lastName,
    email,
    message,
    pdfBase64: pdfBuffer.toString('base64'),
    pdfFileName,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function emailShell(title: string, body: string) {
  return `<!doctype html>
<html lang="de">
  <body style="margin:0;background:#f4f1eb;font-family:Arial,sans-serif;color:#252724">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1eb;padding:28px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #ddd8cf">
          <tr><td style="padding:28px 32px 12px;font-size:25px;font-weight:700;letter-spacing:4px">ASEA</td></tr>
          <tr><td style="padding:0 32px"><div style="height:1px;background:#9b7545"></div></td></tr>
          <tr><td style="padding:28px 32px 34px">
            <h1 style="margin:0 0 18px;font-size:21px">${title}</h1>
            ${body}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function buildConfigurationEmails(configuration: ValidatedConfiguration, internalRecipient: string) {
  const fullName = `${configuration.firstName} ${configuration.lastName}`;
  const escapedName = escapeHtml(fullName);
  const escapedEmail = escapeHtml(configuration.email);
  const escapedMessage = configuration.message
    ? escapeHtml(configuration.message).replaceAll('\n', '<br>')
    : 'Keine zusätzliche Nachricht.';
  const attachment = {
    content: configuration.pdfBase64,
    filename: configuration.pdfFileName,
  };

  return {
    internal: {
      to: [internalRecipient],
      subject: `Neue ASEA-Konfiguration von ${fullName}`,
      html: emailShell('Neue Konfigurationsanfrage', `
        <p style="line-height:1.6"><strong>Kunde:</strong> ${escapedName}<br><strong>E-Mail:</strong> ${escapedEmail}</p>
        <p style="line-height:1.6"><strong>Nachricht:</strong><br>${escapedMessage}</p>
        <p style="line-height:1.6">Das vollständige Konfigurationsblatt befindet sich im PDF-Anhang.</p>`),
      text: `Neue Konfigurationsanfrage\n\nKunde: ${fullName}\nE-Mail: ${configuration.email}\n\nNachricht:\n${configuration.message || 'Keine zusätzliche Nachricht.'}`,
      attachments: [attachment],
    },
    customer: {
      to: [configuration.email],
      subject: 'Ihre ASEA-Konfiguration',
      html: emailShell('Ihre ASEA-Konfiguration', `
        <p style="line-height:1.6">Guten Tag ${escapedName},</p>
        <p style="line-height:1.6">vielen Dank für Ihre Konfiguration. Ihre Anfrage wurde erfolgreich an ASEA übermittelt.</p>
        <p style="line-height:1.6">Das vollständige Konfigurationsblatt finden Sie im PDF-Anhang dieser E-Mail.</p>
        <p style="line-height:1.6;margin-bottom:0">Freundliche Grüße<br><strong>Ihr ASEA-Team</strong></p>`),
      text: `Guten Tag ${fullName},\n\nvielen Dank für Ihre Konfiguration. Ihre Anfrage wurde erfolgreich an ASEA übermittelt. Das Konfigurationsblatt finden Sie im PDF-Anhang.\n\nFreundliche Grüße\nIhr ASEA-Team`,
      attachments: [attachment],
    },
  };
}

async function sendResendEmail({
  apiKey,
  from,
  replyTo,
  idempotencyKey,
  email,
}: {
  apiKey: string;
  from: string;
  replyTo: string;
  idempotencyKey: string;
  email: ReturnType<typeof buildConfigurationEmails>['internal'];
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from,
      reply_to: replyTo,
      ...email,
    }),
  });

  if (!response.ok) {
    let errorBody: ResendErrorBody = {};
    try {
      errorBody = await response.json() as ResendErrorBody;
    } catch {
      // The status code still provides a stable diagnostic if Resend returns no JSON body.
    }
    const error = new Error(errorBody.name || 'resend_send_failed') as Error & {
      status?: number;
      providerMessage?: string;
    };
    error.status = response.status;
    error.providerMessage = errorBody.message;
    throw error;
  }

  const result = await response.json() as { id?: unknown };
  if (typeof result.id !== 'string' || !result.id) {
    throw new Error('resend_missing_message_id');
  }

  return result.id;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
    return;
  }

  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('CONFIGURATOR_FROM_EMAIL') || getEnv('FOLLOWUP_FROM_EMAIL');
  const replyTo = getEnv('FOLLOWUP_REPLY_TO_EMAIL') || 'office@verkaufsanhaenger-asea.at';
  const internalRecipient = getEnv('CONFIGURATOR_INTERNAL_RECIPIENT') || replyTo;

  if (!apiKey || !from || !internalRecipient) {
    console.error('Configurator email failed: required Resend environment variables are missing.');
    sendJson(res, 500, { ok: false, error: 'email_not_configured' });
    return;
  }

  try {
    const configuration = validateConfigurationRequest(await readJsonBody(req));
    const emails = buildConfigurationEmails(configuration, internalRecipient);
    const fingerprint = createHash('sha256')
      .update(configuration.email)
      .update(configuration.pdfBase64)
      .digest('hex')
      .slice(0, 32);

    const internalMessageId = await sendResendEmail({
      apiKey,
      from,
      replyTo,
      idempotencyKey: `asea-configuration-${fingerprint}-internal`,
      email: emails.internal,
    });
    const customerMessageId = await sendResendEmail({
      apiKey,
      from,
      replyTo,
      idempotencyKey: `asea-configuration-${fingerprint}-customer`,
      email: emails.customer,
    });

    console.info('Configurator emails accepted by Resend.', {
      internalMessageId,
      customerMessageId,
      internalRecipientDomain: internalRecipient.split('@').at(-1),
      customerRecipientDomain: configuration.email.split('@').at(-1),
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    const details = error as Error & { status?: number; providerMessage?: string };
    console.error('Configurator email failed.', {
      name: details.message,
      status: details.status,
      providerMessage: details.providerMessage,
    });
    const status = details.message === 'request_too_large' ? 413 : details.status ? 502 : 400;
    sendJson(res, status, { ok: false, error: 'configuration_send_failed' });
  }
}
