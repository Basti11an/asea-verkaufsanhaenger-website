import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('@emailjs/browser', () => ({ default: { send: sendMock } }));

describe('EmailJS contact form', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_test');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'public_test');
    vi.stubEnv('VITE_EMAILJS_INTERNAL_TEMPLATE_ID', 'template_internal');
    vi.stubEnv('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID', 'template_customer');
    vi.stubEnv('VITE_EMAILJS_INTERNAL_RECIPIENT', 'asea@example.at');
    sendMock.mockReset().mockResolvedValue({ status: 200, text: 'OK' });
  });

  it('still sends the contact request and customer confirmation through EmailJS', async () => {
    const { sendContactRequestEmails } = await import('./emailService');
    const sending = sendContactRequestEmails({
      name: 'Max Mustermann',
      email: 'max@example.at',
      phone: '+43 123 456',
      subject: 'Kontaktanfrage',
      message: 'Bitte um Rückruf.',
    });
    await vi.runAllTimersAsync();
    await sending;

    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(sendMock.mock.calls[0][1]).toBe('template_internal');
    expect(sendMock.mock.calls[1][1]).toBe('template_customer');
    expect(sendMock.mock.calls[0][2].to_email).toBe('asea@example.at');
    expect(sendMock.mock.calls[1][2].to_email).toBe('max@example.at');
  });
});
