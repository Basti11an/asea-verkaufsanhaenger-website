import { describe, expect, it } from "vitest";
import { readFile, writeFile } from "node:fs/promises";
import { createDefaultEquipmentConfiguration } from "../data/equipmentConfiguration";
import { createConfigurationPdf } from "./ConfigurationPdf";

describe("createConfigurationPdf", () => {
  it("creates exactly two pages without exposing a download", async () => {
    const logoPath = process.env.ASEA_PDF_QA_LOGO ?? "public/asea-logo.png";
    const screenshotDirectory = process.env.ASEA_PDF_QA_SCREENSHOTS;
    const logoDataUrl = `data:image/png;base64,${(await readFile(logoPath)).toString("base64")}`;
    const fallbackScreenshot = `data:image/jpeg;base64,${(await readFile("public/images/asea-startseite-verkaufsanhaenger.jpg")).toString("base64")}`;
    const screenshots = screenshotDirectory
      ? {
          top: `data:image/jpeg;base64,${(await readFile(`${screenshotDirectory}/top.jpg`)).toString("base64")}`,
          front: `data:image/jpeg;base64,${(await readFile(`${screenshotDirectory}/front.jpg`)).toString("base64")}`,
          rear: `data:image/jpeg;base64,${(await readFile(`${screenshotDirectory}/rear.jpg`)).toString("base64")}`,
        }
      : { top: fallbackScreenshot, front: fallbackScreenshot, rear: fallbackScreenshot };
    const result = await createConfigurationPdf({
      customer: { firstName: "Mäx", lastName: "Mustermann", email: "max@example.at", message: "" },
      equipmentState: createDefaultEquipmentConfiguration(),
      screenshots,
      logoDataUrl,
    });

    expect(result.pageCount).toBe(2);
    expect(result.fileName).toBe("ASEA-Konfiguration-Max-Mustermann.pdf");
    expect(result.dataUrl).toMatch(/^data:application\/pdf/);
    expect(result.byteLength).toBeGreaterThan(1000);

    if (process.env.ASEA_PDF_QA_OUTPUT) {
      await writeFile(process.env.ASEA_PDF_QA_OUTPUT, Buffer.from(await result.blob.arrayBuffer()));
    }
  });
});
