import { useLanguage } from "../../context/LanguageContext";

const copy = {
  title: ["ASEA Konfigurator", "ASEA Configurator", "Konfigurátor ASEA"],
  viewSelector: ["Ansicht auswählen", "Select view", "Vybrať pohľad"],
  sceneLabel: [
    "Interaktives 3D-Modell des ASEA Verkaufsanhängers",
    "Interactive 3D model of the ASEA sales trailer",
    "Interaktívny 3D model predajného prívesu ASEA",
  ],
  equipment: ["Ihre Ausstattung", "Your equipment", "Vaše vybavenie"],
  products: ["Ausstattung", "Equipment", "Vybavenie"],
  three: ["3D", "3D", "3D"],
  top: ["Draufsicht", "Top view", "Pohľad zhora"],
  front: ["Vorne", "Front", "Spredu"],
  rear: ["Hinten", "Rear", "Zozadu"],
  startTitle: ["Ihr ASEA-Innenraum", "Your ASEA interior", "Váš interiér ASEA"],
  startDescription: [
    "Stellen Sie die Innenausstattung Ihres Verkaufsanhängers nach Ihren Vorstellungen zusammen. Wählen Sie Produkte aus, platzieren Sie diese im Innenraum und prüfen Sie Ihre Konfiguration aus verschiedenen Perspektiven.",
    "Configure your sales trailer interior to suit your needs. Select products, place them inside and review your configuration from different perspectives.",
    "Zostavte si interiér predajného prívesu podľa svojich predstáv. Vyberte produkty, umiestnite ich v interiéri a skontrolujte konfiguráciu z rôznych pohľadov.",
  ],
  startButton: ["Konfiguration starten", "Start configuration", "Spustiť konfiguráciu"],
  finish: ["Konfiguration abschließen", "Complete configuration", "Dokončiť konfiguráciu"],
  finishNotice: [
    "Die Abschlussfunktion wird im nächsten Ausbauschritt integriert.",
    "The completion function will be added in the next development step.",
    "Funkcia dokončenia bude doplnená v ďalšom kroku vývoja.",
  ],
  productNotice: [
    "Die Platzierung der Produkte folgt im nächsten Schritt.",
    "Product placement will follow in the next step.",
    "Umiestňovanie produktov bude doplnené v ďalšom kroku.",
  ],
  loading: ["3D-Modell wird geladen ...", "Loading 3D model ...", "Načítava sa 3D model ..."],
  loadError: [
    "Das 3D-Modell konnte nicht geladen werden.",
    "The 3D model could not be loaded.",
    "3D model sa nepodarilo načítať.",
  ],
  interactionHint: [
    "Ziehen zum Drehen · Mausrad zum Zoomen",
    "Drag to rotate · Scroll to zoom",
    "Ťahaním otáčajte · Kolieskom približujte",
  ],
  smallTitle: ["Konfigurator", "Configurator", "Konfigurátor"],
  small: [
    "Der ASEA-Innenraum-Konfigurator ist für größere Bildschirme optimiert.",
    "The ASEA interior configurator is optimized for larger screens.",
    "Konfigurátor interiéru ASEA je optimalizovaný pre väčšie obrazovky.",
  ],
  device: [
    "Bitte öffnen Sie ihn auf einem Tablet, Laptop oder Desktop-PC.",
    "Please open it on a tablet, laptop or desktop computer.",
    "Otvorte ho na tablete, notebooku alebo stolnom počítači.",
  ],
} as const;

export function useConfiguratorCopy() {
  const { lang } = useLanguage();
  const index = { de: 0, en: 1, sk: 2 }[lang];
  return {
    text: (key: keyof typeof copy) => copy[key][index],
    name: (names: readonly string[]) => names[index],
  };
}
