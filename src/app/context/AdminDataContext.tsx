import { createContext, useContext, useState } from 'react';

// ─── Shared types ────────────────────────────────────────────────────────────

export interface AdminModel {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

export interface AdminEquipment {
  id: number;
  name: string;
  beschreibung: string;
  preis: number;
  kategorie: string;
  aktiv: boolean;
}

export interface AdminReference {
  id: number;
  kundenname: string;
  ort: string;
  modell: string;
  jahr: number;
  beschreibung: string;
  bildUrl: string;
  sichtbar: boolean;
}

// ─── Initial data (single source of truth) ───────────────────────────────────

const INITIAL_MODELS: AdminModel[] = [
  {
    id: 1,
    name: 'Verkaufsanhänger',
    description:
      'Unsere Verkaufsanhänger sind Ihr praktischer Begleiter bei Ihren Verkaufstouren. Besonders wenig Eigengewicht für maximalen Warentransport.',
    imageUrl:
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg',
    active: true,
  },
  {
    id: 2,
    name: 'Kühlanhänger',
    description:
      'Mit unseren Kühlanhänger bringen Sie jede Ware bestens zum gewünschten Lieferort. Egal ob Getränke oder Lebensmittel, Ihre Lieferung bleibt frisch.',
    imageUrl:
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg',
    active: true,
  },
  {
    id: 3,
    name: 'Messe- und Präsentationsanhänger',
    description:
      'Optimal für jedes Event ausgerüstet, mit eigener Elektrik für Outdoor-Events. Höchste Qualität zum fairen Preis-Leistungs-Verhältnis.',
    imageUrl:
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg',
    active: true,
  },
];

const INITIAL_EQUIPMENT: AdminEquipment[] = [
  { id: 1, name: 'Kühlvitrine', beschreibung: 'Gekühlte Präsentationsvitrine', preis: 1200, kategorie: 'Kühlung', aktiv: true },
  { id: 2, name: 'Fritteuse', beschreibung: 'Professionelle Fritteuse für den Außeneinsatz', preis: 450, kategorie: 'Küche', aktiv: true },
  { id: 3, name: 'Warmhaltebehälter', beschreibung: 'Behälter für warme Speisen', preis: 280, kategorie: 'Küche', aktiv: true },
  { id: 4, name: 'Zapfanlage', beschreibung: 'Zwei-Leitungs-Zapfanlage mit Kühlung', preis: 890, kategorie: 'Getränke', aktiv: true },
  { id: 5, name: 'LED-Beleuchtung', beschreibung: 'Innen- und Außenbeleuchtung LED', preis: 320, kategorie: 'Elektrik', aktiv: true },
  { id: 6, name: 'Markise', beschreibung: 'Ausziehbare Sonnenschutzmarkise', preis: 560, kategorie: 'Außen', aktiv: true },
  { id: 7, name: 'Edelstahltheke', beschreibung: 'Servicetheke aus Edelstahl mit Unterbauten', preis: 740, kategorie: 'Einrichtung', aktiv: true },
  { id: 8, name: 'Kassenlade', beschreibung: 'Stabiler Geldlade-Einsatz', preis: 180, kategorie: 'Elektrik', aktiv: false },
];

const INITIAL_REFERENCES: AdminReference[] = [
  { id: 1, kundenname: 'Würstelstand Huber', ort: 'Wien', modell: 'Verkaufsanhänger', jahr: 2023, beschreibung: 'Mobiler Würstelstand im Wiener Prater – täglich im Einsatz.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg', sichtbar: true },
  { id: 2, kundenname: 'Café Moser', ort: 'Salzburg', modell: 'Messe- und Präsentationsanhänger', jahr: 2022, beschreibung: 'Café-Präsentationen bei Events und Stadtfesten in Salzburg.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg', sichtbar: true },
  { id: 3, kundenname: 'Getränke Steinbauer', ort: 'Linz', modell: 'Kühlanhänger', jahr: 2024, beschreibung: 'Frischlieferungen von Getränken an Gastronomiebetriebe im Großraum Linz.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg', sichtbar: true },
  { id: 4, kundenname: 'Imbiss Kowalski', ort: 'Graz', modell: 'Verkaufsanhänger', jahr: 2023, beschreibung: 'Schnellimbiss am Hauptplatz Graz – beliebt bei Marktbesuchern.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-10.jpg', sichtbar: true },
  { id: 5, kundenname: 'Bäckerei Pichler', ort: 'Wels', modell: 'Verkaufsanhänger', jahr: 2022, beschreibung: 'Frische Backwaren direkt vom Anhänger auf dem Wochenmarkt.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-86.jpg', sichtbar: false },
  { id: 6, kundenname: 'Eventservice Huemer', ort: 'Innsbruck', modell: 'Messe- und Präsentationsanhänger', jahr: 2024, beschreibung: 'Professionelle Event-Bewirtung bei Tiroler Outdoor-Veranstaltungen.', bildUrl: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-5.jpg', sichtbar: true },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface AdminDataContextType {
  models: AdminModel[];
  setModels: React.Dispatch<React.SetStateAction<AdminModel[]>>;
  equipment: AdminEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<AdminEquipment[]>>;
  references: AdminReference[];
  setReferences: React.Dispatch<React.SetStateAction<AdminReference[]>>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<AdminModel[]>(INITIAL_MODELS);
  const [equipment, setEquipment] = useState<AdminEquipment[]>(INITIAL_EQUIPMENT);
  const [references, setReferences] = useState<AdminReference[]>(INITIAL_REFERENCES);

  return (
    <AdminDataContext.Provider value={{ models, setModels, equipment, setEquipment, references, setReferences }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextType {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside <AdminDataProvider>');
  return ctx;
}
