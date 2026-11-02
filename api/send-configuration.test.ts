import { Readable } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler, { buildConfigurationEmails, validateConfigurationRequest } from './send-configuration';

const PDF_BASE64 = Buffer.from('%PDF-1.4\nASEA test PDF').toString('base64');

function validRequest() {
  return {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.at',
    message: 'Bitte um Rückruf.',
    pdfDataUrl: `data:application/pdf;base64,${PDF_BASE64}`,
    pdfFileName: 'ASEA-Konfiguration-Max-Mustermann.pdf',
  };
}

function createRequest(body: unknown) {
  const request = Readable.from([JSON.stringify(body)]) as Readable & { method?: string };
  request.method = 'POST';
  return request;
}

function createResponse() {
  const headers = new Map<string, string>();
  let body = '';
  const response = {
    statusCode: 0,
    setHeader(name: string, value: string) {
      headers.set(name, value);
    },
    end(value = '') {
      body = String(value);
    },
  };
  return { response, headers, getBody: () => body };
}

describe('configurator Resend function', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('FOLLOWUP_FROM_EMAIL', 'ASEA <noreply@example.at>');
    vi.stubEnv('FOLLOWUP_REPLY_TO_EMAIL', 'office@example.at');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses the identical PDF attachment for ASEA and the customer', () => {
    const configuration = validateConfigurationRequest(validRequest());
    const emails = buildConfigurationEmails(configuration, 'office@example.at');

    expect(emails.internal.to).toEqual(['office@example.at']);
    expect(emails.customer.to).toEqual(['max@example.at']);
    expect(emails.internal.attachments[0]).toEqual(emails.customer.attachments[0]);
    expect(emails.internal.attachments[0].content).toBe(PDF_BASE64);
  });

  it('rejects content that is not a PDF', () => {
    expect(() => validateConfigurationRequest({
      ...validRequest(),
      pdfDataUrl: `data:application/pdf;base64,${Buffer.from('not a pdf').toString('base64')}`,
    })).toThrow('invalid_pdf');
  });

  it('sends both emails through Resend from the server', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'email-id' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const { response, getBody } = createResponse();

    await handler(createRequest(validRequest()) as never, response as never);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(getBody())).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const internalRequest = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    const customerRequest = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(internalRequest.to).toEqual(['office@example.at']);
    expect(customerRequest.to).toEqual(['max@example.at']);
    expect(internalRequest.attachments).toEqual(customerRequest.attachments);
  });
});
