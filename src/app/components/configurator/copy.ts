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
  startNotice: [
    "Hinweis: Dieser Konfigurator ist ein Maturaprojekt der BBS Rohrbach. Deshalb können einzelne Inhalte oder Darstellungen noch Fehler enthalten und von der späteren Ausführung abweichen. Trotzdem bietet das Tool einen guten Einblick in den Anhänger und seine Ausstattung. Durch die 3D-Modelle kann es beim ersten Start zu kurzen Ladezeiten kommen.",
    "Please note: This configurator is a graduation project by BBS Rohrbach. Some content or visual details may therefore still contain errors or differ from the final implementation. It nevertheless provides a useful insight into the trailer and its equipment. The 3D models may cause a short loading time when starting the configurator.",
    "Upozornenie: Tento konfigurátor je maturitným projektom školy BBS Rohrbach. Niektorý obsah alebo zobrazenia preto môžu ešte obsahovať chyby a môžu sa líšiť od neskoršieho vyhotovenia. Nástroj však ponúka dobrý pohľad na príves a jeho vybavenie. 3D modely môžu pri prvom spustení spôsobiť krátke načítanie.",
  ],
  startButton: ["Konfiguration starten", "Start configuration", "Spustiť konfiguráciu"],
  finish: ["Konfiguration abschließen", "Complete configuration", "Dokončiť konfiguráciu"],
  finishNotice: [
    "Die Abschlussfunktion wird im nächsten Ausbauschritt integriert.",
    "The completion function will be added in the next development step.",
    "Funkcia dokončenia bude doplnená v ďalšom kroku vývoja.",
  ],
  finishModalTitle: ["Konfiguration abschließen", "Complete configuration", "Dokončiť konfiguráciu"],
  finishModalText: [
    "Um Ihr fertiges Konfigurationsblatt zu erhalten, senden Sie Ihre Konfiguration an ASEA. Nach dem Absenden erhalten Sie das Konfigurationsblatt automatisch per E-Mail.",
    "Send your configuration to ASEA to receive the completed configuration sheet. After submitting, it will be sent to you automatically by email.",
    "Odošlite svoju konfiguráciu spoločnosti ASEA, aby ste dostali hotový konfiguračný list. Po odoslaní vám bude automaticky doručený e-mailom.",
  ],
  finishFirstName: ["Vorname *", "First name *", "Meno *"],
  finishLastName: ["Nachname *", "Last name *", "Priezvisko *"],
  finishEmail: ["E-Mail *", "Email *", "E-mail *"],
  finishMessage: ["Nachricht - optional", "Message - optional", "Správa - voliteľná"],
  finishBack: ["Zurück", "Back", "Späť"],
  finishSubmit: ["Konfiguration absenden", "Send configuration", "Odoslať konfiguráciu"],
  finishCreating: ["Konfiguration wird erstellt …", "Configuration is being created …", "Konfigurácia sa vytvára …"],
  finishRequired: ["Bitte füllen Sie dieses Feld aus.", "Please complete this field.", "Vyplňte toto pole."],
  finishInvalidEmail: ["Bitte geben Sie eine gültige E-Mail-Adresse ein.", "Please enter a valid email address.", "Zadajte platnú e-mailovú adresu."],
  finishSendError: [
    "Die Konfiguration konnte leider nicht versendet werden. Bitte versuchen Sie es erneut.",
    "The configuration could not be sent. Please try again.",
    "Konfiguráciu sa nepodarilo odoslať. Skúste to znova.",
  ],
  finishSuccessTitle: ["Konfiguration erfolgreich gesendet", "Configuration sent successfully", "Konfigurácia bola úspešne odoslaná"],
  finishSuccessText: [
    "Vielen Dank. Ihre Konfiguration wurde an ASEA übermittelt. Das Konfigurationsblatt wurde zusätzlich an Ihre E-Mail-Adresse gesendet.",
    "Thank you. Your configuration was sent to ASEA. The configuration sheet was also sent to your email address.",
    "Ďakujeme. Vaša konfigurácia bola odoslaná spoločnosti ASEA. Konfiguračný list bol zároveň odoslaný na vašu e-mailovú adresu.",
  ],
  finishClose: ["Schließen", "Close", "Zavrieť"],
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
    "Fritteuse und Dunstabzug werden getrennt voneinander verschoben.",
    "The fryer and extractor hood are positioned independently.",
    "Fritéza a odsávač pár sa umiestňujú samostatne.",
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
  wheelArchNotice: [
    "Diese Position ist durch den Radkasten blockiert.",
    "This position is blocked by the wheel arch.",
    "Táto poloha je blokovaná podbehom kolesa.",
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
