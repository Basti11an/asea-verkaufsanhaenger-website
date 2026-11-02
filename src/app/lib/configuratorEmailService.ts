import type { ConfigurationCustomer } from '../components/configurator/finish/finishValidation';

export type ConfiguratorResendRequest = ConfigurationCustomer & {
  pdfDataUrl: string;
  pdfFileName: string;
};

export async function sendConfiguratorEmails(request: ConfiguratorResendRequest) {
  const response = await fetch('/api/send-configuration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`configuration_send_failed_${response.status}`);
  }
}
