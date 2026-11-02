import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("@emailjs/browser", () => ({ default: { send: sendMock } }));

describe("sendConfiguratorEmails", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "public_test");
    vi.stubEnv("VITE_EMAILJS_INTERNAL_TEMPLATE_ID", "template_internal");
    vi.stubEnv("VITE_EMAILJS_CUSTOMER_TEMPLATE_ID", "template_customer");
    vi.stubEnv("VITE_EMAILJS_INTERNAL_RECIPIENT", "asea@example.at");
    sendMock.mockReset().mockResolvedValue({ status: 200, text: "OK" });
  });

  it("sends the identical PDF to ASEA and the customer", async () => {
    const { sendConfiguratorEmails } = await import("./emailService");
    const sending = sendConfiguratorEmails({
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.at",
      message: "Test",
      pdfDataUrl: "data:application/pdf;base64,PDFDATA",
      pdfFileName: "ASEA-Konfiguration-Max-Mustermann.pdf",
    });
    await vi.runAllTimersAsync();
    await sending;

    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(sendMock.mock.calls[0][1]).toBe("template_internal");
    expect(sendMock.mock.calls[1][1]).toBe("template_customer");
    expect(sendMock.mock.calls[0][2].configuration_pdf).toBe("data:application/pdf;base64,PDFDATA");
    expect(sendMock.mock.calls[1][2].configuration_pdf).toBe("data:application/pdf;base64,PDFDATA");
    expect(sendMock.mock.calls[0][2].to_email).toBe("asea@example.at");
    expect(sendMock.mock.calls[1][2].to_email).toBe("max@example.at");
  });
});
