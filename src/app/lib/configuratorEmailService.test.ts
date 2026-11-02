import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendConfiguratorEmails } from './configuratorEmailService';

const request = {
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.at',
  message: 'Test',
  pdfDataUrl: 'data:application/pdf;base64,UERG',
  pdfFileName: 'ASEA-Konfiguration.pdf',
};

describe('configurator email client', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends the PDF to the server function', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await sendConfiguratorEmails(request);

    expect(fetchMock).toHaveBeenCalledWith('/api/send-configuration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  });

  it('reports a failed server send', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 502 })));

    await expect(sendConfiguratorEmails(request)).rejects.toThrow('configuration_send_failed_502');
  });
});
