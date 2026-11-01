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
  gasCabinetFixed: ["Gasschrank (fix)", "Gas cabinet (fixed)", "Plynová skriňa (fixná)"],
  workSurfacesFixed: ["Arbeitsflächen", "Work surfaces", "Pracovné plochy"],
  products: ["Ausstattung", "Equipment", "Vybavenie"],
  three: ["3D", "3D", "3D"],
  top: ["Draufsicht", "Top view", "Pohľad zhora"],
  front: ["Vorne", "Front", "Spredu"],
  rear: ["Hinten", "Rear", "Zozadu"],
  startTitle: ["Ihr ASEA-Innenraum", "Your ASEA interior", "Váš interiér ASEA"],
  startDescription: [
    "Prüfen Sie die ASEA-Standardausstattung im maßgenauen Innenraum aus verschiedenen Perspektiven.",
    "Review the standard ASEA equipment in the dimensionally accurate interior from different perspectives.",
    "Prezrite si štandardnú výbavu ASEA v rozmerovo presnom interiéri z rôznych pohľadov.",
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
  position: ["Position", "Position", "Poloha"],
  centerFromLeft: ["Mittelpunkt von links", "Centre from the left", "Stred zľava"],
  allowedSide: ["Erlaubte Seite", "Allowed side", "Povolená strana"],
  closedWall: ["Hinten", "Rear", "Vzadu"],
  salesHatch: ["Vorne", "Front", "Vpredu"],
  gasGriddleMoveHelp: [
    "Gasbräter, Unterbau und Spritzschutz bewegen sich gemeinsam.",
    "Gas griddles, base and splash guard move together.",
    "Plynové grily, podstavec a ochranné sklo sa pohybujú spolu.",
  ],
  equipmentMoveHelp: [
    "Das ausgewählte Gerät wird als vollständige Einheit verschoben.",
    "The selected appliance moves as one complete unit.",
    "Vybrané zariadenie sa presúva ako jeden celok.",
  ],
  hygieneMoveHelp: [
    "Hängeschrank, Spüle und Wasserhahn bewegen sich gemeinsam.",
    "Wall cabinet, sink and tap move together.",
    "Nástenná skrinka, drez a batéria sa pohybujú spolu.",
  ],
  fryerMoveHelp: [
    "Doppelfritteuse und Dunstabzug bewegen sich gemeinsam.",
    "Double fryer and extractor hood move together.",
    "Dvojitá fritéza a odsávač pár sa pohybujú spolu.",
  ],
  editEquipment: [
    "Ausgewählte Ausstattung bearbeiten",
    "Edit selected equipment",
    "Upraviť vybrané vybavenie",
  ],
  moveLeft: ["1 cm nach links", "Move 1 cm left", "Posunúť o 1 cm doľava"],
  moveRight: ["1 cm nach rechts", "Move 1 cm right", "Posunúť o 1 cm doprava"],
  resetPosition: ["Standardposition", "Default position", "Predvolená poloha"],
  removeEquipment: ["Aus Ausstattung entfernen", "Remove from equipment", "Odstrániť z vybavenia"],
  collisionNotice: [
    "Diese Position ist bereits belegt.",
    "This position is already occupied.",
    "Táto poloha je už obsadená.",
  ],
  removedNotice: [
    "Das Gerät wurde entfernt. Über die Ausstattung unten kann es wieder hinzugefügt werden.",
    "The appliance was removed. It can be added again from the equipment bar below.",
    "Zariadenie bolo odstránené. Znova ho môžete pridať z panela vybavenia dole.",
  ],
  restoredNotice: [
    "Das Gerät wurde wieder zur Ausstattung hinzugefügt.",
    "The appliance was added back to the equipment.",
    "Zariadenie bolo znova pridané do vybavenia.",
  ],
  noSpaceNotice: [
    "Für dieses Gerät ist derzeit kein freier Platz vorhanden.",
    "There is currently no free space for this appliance.",
    "Pre toto zariadenie momentálne nie je voľné miesto.",
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
  resetTitle: ["Konfigurator", "Configurator", "Konfigurátor"],
  resetDescription: [
    "Der Konfigurator befindet sich derzeit in Arbeit.",
    "The configurator is currently being rebuilt.",
    "Konfigurátor sa momentálne nanovo pripravuje.",
  ],
  resetHint: [
    "Die 3D-Modelle werden vollständig neu ausgerichtet und anschließend wieder integriert.",
    "The 3D models are being realigned from scratch and will then be integrated again.",
    "3D modely sa nanovo správne nastavia a následne sa opäť integrujú.",
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
