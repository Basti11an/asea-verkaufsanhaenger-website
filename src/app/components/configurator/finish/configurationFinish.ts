import type { EquipmentConfigurationState } from "../data/equipmentConfiguration";
import type { ConfigurationScreenshots } from "../three/configurationScreenshots";
import { sendConfiguratorEmails } from "../../../lib/emailService";
import { createConfigurationPdf } from "./ConfigurationPdf";
import type { ConfigurationCustomer } from "./finishValidation";

type FinishConfigurationInput = {
  customer: ConfigurationCustomer;
  equipmentState: EquipmentConfigurationState;
  captureScreenshots: () => ConfigurationScreenshots | Promise<ConfigurationScreenshots>;
};

export async function finishConfiguration({
  customer,
  equipmentState,
  captureScreenshots,
}: FinishConfigurationInput) {
  const screenshots = await captureScreenshots();
  const pdf = await createConfigurationPdf({ customer, equipmentState, screenshots });
  if (pdf.pageCount !== 2) throw new Error("Configuration PDF must contain exactly two pages.");

  await sendConfiguratorEmails({
    ...customer,
    pdfDataUrl: pdf.dataUrl,
    pdfFileName: pdf.fileName,
  });

  return { fileName: pdf.fileName, byteLength: pdf.byteLength };
}
