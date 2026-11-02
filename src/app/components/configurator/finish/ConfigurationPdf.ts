import { getConfigurationRows } from "../data/configurationSummary";
import { trailerConfiguration } from "../data/defaultConfiguration";
import type { EquipmentConfigurationState } from "../data/equipmentConfiguration";
import type { ConfigurationScreenshots } from "../three/configurationScreenshots";
import type { ConfigurationCustomer } from "./finishValidation";

export type ConfigurationPdfResult = {
  blob: Blob;
  dataUrl: string;
  fileName: string;
  byteLength: number;
  pageCount: number;
};

type ConfigurationPdfInput = {
  customer: ConfigurationCustomer;
  equipmentState: EquipmentConfigurationState;
  screenshots: ConfigurationScreenshots;
  logoDataUrl?: string;
};

const BRONZE = [155, 117, 69] as const;
const INK = [28, 29, 27] as const;
const MUTED = [92, 94, 89] as const;

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Logo could not be read."));
    reader.readAsDataURL(blob);
  });
}

async function loadLogoDataUrl() {
  const response = await fetch("/asea-logo.png");
  if (!response.ok) throw new Error("ASEA logo could not be loaded.");
  const blob = await response.blob();
  if (typeof createImageBitmap !== "function") return blobToDataUrl(blob);

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = Math.round(canvas.width / (1458 / 347));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return blobToDataUrl(blob);
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/png");
}

function safeFilePart(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "Kunde";
}

function formatCm(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1).replace(".", ",")} cm`;
}

function addLogo(pdf: import("jspdf").jsPDF, logoDataUrl: string, alias: string, y = 14) {
  const width = 46;
  const height = width / (1458 / 347);
  pdf.addImage(logoDataUrl, "PNG", 18, y, width, height, alias, "FAST");
}

function addScreenshot(
  pdf: import("jspdf").jsPDF,
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  pdf.setDrawColor(226, 224, 218);
  pdf.setLineWidth(0.25);
  pdf.roundedRect(x, y, width, height, 1.2, 1.2, "S");
  pdf.addImage(dataUrl, "JPEG", x + 0.3, y + 0.3, width - 0.6, height - 0.6, undefined, "FAST");
}

function addPageOne(
  pdf: import("jspdf").jsPDF,
  customer: ConfigurationCustomer,
  screenshots: ConfigurationScreenshots,
  logoDataUrl: string,
) {
  addLogo(pdf, logoDataUrl, "asea-logo-page-1");
  pdf.setDrawColor(...BRONZE);
  pdf.setLineWidth(0.45);
  pdf.line(78, 13, 78, 31);
  pdf.setTextColor(...INK);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Konfigurationsübersicht", 88, 24.5);

  pdf.setFontSize(13);
  pdf.text("Kunde", 18, 48);
  pdf.setFontSize(11.5);
  pdf.text(`${customer.firstName.trim()} ${customer.lastName.trim()}`, 18, 58);

  pdf.setDrawColor(...BRONZE);
  pdf.setLineWidth(0.4);
  pdf.line(18, 68, 192, 68);

  addScreenshot(pdf, screenshots.top, 18, 77, 174, 110);
  addScreenshot(pdf, screenshots.front, 18, 194, 84, 53.2);
  addScreenshot(pdf, screenshots.rear, 108, 194, 84, 53.2);
}

function addDetailRows(
  pdf: import("jspdf").jsPDF,
  title: string,
  rows: ReturnType<typeof getConfigurationRows>,
  startY: number,
  rowHeight: number,
) {
  pdf.setTextColor(...INK);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(Math.max(9, Math.min(12, rowHeight + 4)));
  pdf.text(title, 18, startY);
  let y = startY + rowHeight;

  pdf.setTextColor(...MUTED);
  pdf.setFontSize(Math.max(6.8, Math.min(8.5, rowHeight + 1.5)));
  pdf.text("Produkt", 18, y);
  pdf.text("Breite", 119, y);
  pdf.text("Position (Mitte von links)", 148, y);
  y += rowHeight * 0.75;
  pdf.setDrawColor(218, 216, 210);
  pdf.setLineWidth(0.2);
  pdf.line(18, y, 192, y);
  y += rowHeight * 0.75;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(Math.max(6.8, Math.min(9.5, rowHeight + 2)));
  rows.forEach((row) => {
    pdf.setTextColor(...INK);
    pdf.text(row.name, 18, y, { maxWidth: 96 });
    pdf.text(formatCm(row.widthCm), 119, y);
    pdf.text(row.note ?? formatCm(row.centerCm), 148, y, { maxWidth: 44 });
    y += rowHeight;
  });
  return y;
}

function addPageTwo(
  pdf: import("jspdf").jsPDF,
  equipmentState: EquipmentConfigurationState,
  logoDataUrl: string,
) {
  pdf.addPage("a4", "portrait");
  addLogo(pdf, logoDataUrl, "asea-logo-page-2");
  pdf.setDrawColor(...BRONZE);
  pdf.setLineWidth(0.4);
  pdf.line(18, 38, 192, 38);
  pdf.setTextColor(...INK);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Ausstattungsdetails", 18, 53);

  const plan = trailerConfiguration.planReference;
  const baseRows = [
    ["Modell", "Verkaufsanhänger Standard"],
    ["Innenlänge", formatCm(plan.interiorLengthCm)],
    ["Innenbreite", formatCm(plan.interiorWidthCm)],
    ["Innenhöhe", formatCm(plan.interiorHeightCm)],
  ] as const;
  let y = 65;
  pdf.setFontSize(9.5);
  baseRows.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(label, 18, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(value, 60, y);
    y += 6;
  });

  const frontRows = getConfigurationRows(equipmentState, "sales-hatch");
  const rearRows = getConfigurationRows(equipmentState, "closed-wall");
  const totalDetailLines = frontRows.length + rearRows.length + 7;
  const availableHeight = 190;
  const rowHeight = Math.max(4.2, Math.min(6.5, availableHeight / Math.max(totalDetailLines, 1)));

  y += 7;
  y = addDetailRows(pdf, "Ausstattung vorne", frontRows, y, rowHeight);
  y += rowHeight * 1.5;
  addDetailRows(pdf, "Ausstattung hinten", rearRows, y, rowHeight);
}

export async function createConfigurationPdf({
  customer,
  equipmentState,
  screenshots,
  logoDataUrl,
}: ConfigurationPdfInput): Promise<ConfigurationPdfResult> {
  const [{ jsPDF }, resolvedLogo] = await Promise.all([
    import("jspdf"),
    logoDataUrl ? Promise.resolve(logoDataUrl) : loadLogoDataUrl(),
  ]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  pdf.setProperties({ title: "ASEA Konfigurationsübersicht", creator: "ASEA Konfigurator" });
  addPageOne(pdf, customer, screenshots, resolvedLogo);
  addPageTwo(pdf, equipmentState, resolvedLogo);

  const blob = pdf.output("blob");
  const dataUrl = pdf.output("datauristring");
  const fileName = `ASEA-Konfiguration-${safeFilePart(customer.firstName)}-${safeFilePart(customer.lastName)}.pdf`;
  return {
    blob,
    dataUrl,
    fileName,
    byteLength: blob.size,
    pageCount: pdf.getNumberOfPages(),
  };
}
