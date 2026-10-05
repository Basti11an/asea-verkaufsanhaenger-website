import { useLanguage } from "../../context/LanguageContext";
const copy = {
  title: [
    "Innenraum konfigurieren",
    "Configure your interior",
    "Konfigurácia interiéru",
  ],
  intro: [
    "Stellen Sie Ihre Innenausstattung zusammen.",
    "Choose your interior equipment.",
    "Zostavte si vnútorné vybavenie.",
  ],
  prototype: ["UI-Prototyp", "UI prototype", "Prototyp rozhrania"],
  planning: ["Planung", "Planning", "Plánovanie"],
  top: ["Draufsicht", "Top view", "Pohľad zhora"],
  side: ["Seitenansicht", "Side view", "Bočný pohľad"],
  front: ["Frontansicht", "Front view", "Čelný pohľad"],
  three: ["3D-Ansicht", "3D view", "3D pohľad"],
  placeholder: [
    "3D-Ansicht wird später hier dargestellt.",
    "The 3D view will be displayed here later.",
    "3D pohľad sa tu zobrazí neskôr.",
  ],
  equipment: ["Ihre Ausstattung", "Your equipment", "Vaše vybavenie"],
  empty: [
    "Noch keine Produkte bestätigt.",
    "No products confirmed yet.",
    "Zatiaľ neboli potvrdené žiadne produkty.",
  ],
  products: ["Produkte", "Products", "Produkty"],
  position: ["Position", "Position", "Poloha"],
  confirm: ["Position bestätigen", "Confirm position", "Potvrdiť polohu"],
  change: ["Änderung bestätigen", "Confirm changes", "Potvrdiť zmeny"],
  remove: ["Produkt entfernen", "Remove product", "Odstrániť produkt"],
  cancel: ["Abbrechen", "Cancel", "Zrušiť"],
  invalid: [
    "Diese Position ist für dieses Produkt nicht möglich.",
    "This position is not available for this product.",
    "Táto poloha nie je pre tento produkt dostupná.",
  ],
  reset: [
    "Konfiguration zurücksetzen",
    "Reset configuration",
    "Obnoviť konfiguráciu",
  ],
  resetQuestion: [
    "Möchten Sie die aktuelle Konfiguration wirklich zurücksetzen?",
    "Do you really want to reset the current configuration?",
    "Naozaj chcete obnoviť aktuálnu konfiguráciu?",
  ],
  finish: [
    "Konfiguration abschließen",
    "Complete configuration",
    "Dokončiť konfiguráciu",
  ],
  summary: ["Ihre Konfiguration", "Your configuration", "Vaša konfigurácia"],
  preview: ["3D-Vorschau", "3D preview", "3D náhľad"],
  selected: [
    "Ausgewählte Ausstattung",
    "Selected equipment",
    "Vybrané vybavenie",
  ],
  back: [
    "Zurück zur Konfiguration",
    "Back to configuration",
    "Späť ku konfigurácii",
  ],
  inquiry: ["Anfrage vorbereiten", "Prepare inquiry", "Pripraviť dopyt"],
  later: [
    "Anfrage- und PDF-Funktion wird später integriert.",
    "Inquiry and PDF functionality will be added later.",
    "Funkcie dopytu a PDF budú pridané neskôr.",
  ],
  smallTitle: ["Konfigurator", "Configurator", "Konfigurátor"],
  small: [
    "Der ASEA-Innenraum-Konfigurator ist für größere Bildschirme optimiert.",
    "The ASEA interior configurator is optimized for larger screens.",
    "Konfigurátor interiéru ASEA je optimalizovaný pre väčšie obrazovky.",
  ],
  device: [
    "Bitte öffnen Sie den Konfigurator auf einem Tablet, Laptop oder Desktop-PC.",
    "Please open the configurator on a tablet, laptop or desktop computer.",
    "Otvorte konfigurátor na tablete, notebooku alebo stolnom počítači.",
  ],
  gas: ["Gasschrank", "Gas cabinet", "Plynová skrinka"],
  wheel: ["Radkasten", "Wheel arch", "Podbeh"],
  blocked: [
    "Demo-Sperrbereich",
    "Demo restricted area",
    "Ukážková zakázaná zóna",
  ],
  demo: [
    "Schematische Ansicht · Demo-Maße",
    "Schematic view · Demo dimensions",
    "Schematický pohľad · Ukážkové rozmery",
  ],
  count: ["bestätigt", "confirmed", "potvrdené"],
} as const;
export function useConfiguratorCopy() {
  const { lang } = useLanguage();
  const index = { de: 0, en: 1, sk: 2 }[lang];
  return {
    text: (key: keyof typeof copy) => copy[key][index],
    name: (names: readonly string[]) => names[index],
  };
}
