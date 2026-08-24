import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase, supabaseAdminEmail } from '../lib/supabase';
import {
  createReferenceInSupabase,
  deleteReferenceFromSupabase,
  fetchReferencesFromSupabase,
  submitReferenceToSupabase,
  updateReferenceInSupabase,
} from '../lib/referencesRepository';

export type ReferenceStatus = 'approved' | 'pending' | 'rejected';

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
  status: ReferenceStatus;
  kontaktEmail: string;
  kontaktTelefon: string;
  createdAt?: string;
}

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

const INITIAL_REFERENCES: AdminReference[] = [];

interface AdminDataContextType {
  models: AdminModel[];
  setModels: React.Dispatch<React.SetStateAction<AdminModel[]>>;
  equipment: AdminEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<AdminEquipment[]>>;
  references: AdminReference[];
  setReferences: React.Dispatch<React.SetStateAction<AdminReference[]>>;
  referencesLoading: boolean;
  referencesError: string | null;
  reloadReferences: () => Promise<void>;
  createReference: (reference: Omit<AdminReference, 'id'>) => Promise<AdminReference>;
  submitReference: (reference: Omit<AdminReference, 'id' | 'sichtbar' | 'status'>) => Promise<void>;
  updateReference: (id: number, changes: Partial<AdminReference>) => Promise<AdminReference>;
  deleteReference: (id: number) => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

function nextLocalReferenceId(references: AdminReference[]) {
  return references.length > 0 ? Math.max(...references.map((reference) => reference.id)) + 1 : 1;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unbekannter Supabase-Fehler';
}

async function isCurrentAdminSession() {
  if (!isSupabaseConfigured || !supabase || !supabaseAdminEmail) return false;

  const { data } = await supabase.auth.getSession();
  const sessionEmail = data.session?.user?.email?.trim().toLowerCase();
  return sessionEmail === supabaseAdminEmail.toLowerCase();
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<AdminModel[]>(INITIAL_MODELS);
  const [equipment, setEquipment] = useState<AdminEquipment[]>(INITIAL_EQUIPMENT);
  const [references, setReferences] = useState<AdminReference[]>(INITIAL_REFERENCES);
  const [referencesLoading, setReferencesLoading] = useState(false);
  const [referencesError, setReferencesError] = useState<string | null>(null);

  const reloadReferences = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    setReferencesLoading(true);
    setReferencesError(null);

    try {
      const remoteReferences = await fetchReferencesFromSupabase(await isCurrentAdminSession());
      setReferences(remoteReferences);
    } catch (error) {
      setReferencesError(getErrorMessage(error));
    } finally {
      setReferencesLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadReferences();

    if (!isSupabaseConfigured || !supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void reloadReferences();
    });

    return () => subscription.unsubscribe();
  }, [reloadReferences]);

  const createReference = async (reference: Omit<AdminReference, 'id'>) => {
    if (isSupabaseConfigured) {
      const savedReference = await createReferenceInSupabase(reference);
      setReferences((prev) => [savedReference, ...prev]);
      return savedReference;
    }

    const localReference = { ...reference, id: nextLocalReferenceId(references) };
    setReferences((prev) => [localReference, ...prev]);
    return localReference;
  };

  const submitReference = async (reference: Omit<AdminReference, 'id' | 'sichtbar' | 'status'>) => {
    const pendingReference: Omit<AdminReference, 'id'> = {
      ...reference,
      sichtbar: false,
      status: 'pending',
    };

    if (isSupabaseConfigured) {
      await submitReferenceToSupabase(pendingReference);
      return;
    }

    const localReference = { ...pendingReference, id: nextLocalReferenceId(references) };
    setReferences((prev) => [localReference, ...prev]);
  };

  const updateReference = async (id: number, changes: Partial<AdminReference>) => {
    if (isSupabaseConfigured) {
      const savedReference = await updateReferenceInSupabase(id, changes);
      setReferences((prev) => prev.map((reference) => (reference.id === id ? savedReference : reference)));
      return savedReference;
    }

    let updatedReference: AdminReference | null = null;

    setReferences((prev) =>
      prev.map((reference) => {
        if (reference.id !== id) return reference;
        updatedReference = { ...reference, ...changes };
        return updatedReference;
      }),
    );

    if (!updatedReference) throw new Error('Referenz wurde nicht gefunden.');
    return updatedReference;
  };

  const deleteReference = async (id: number) => {
    if (isSupabaseConfigured) {
      await deleteReferenceFromSupabase(id);
    }

    setReferences((prev) => prev.filter((reference) => reference.id !== id));
  };

  return (
    <AdminDataContext.Provider
      value={{
        models,
        setModels,
        equipment,
        setEquipment,
        references,
        setReferences,
        referencesLoading,
        referencesError,
        reloadReferences,
        createReference,
        submitReference,
        updateReference,
        deleteReference,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextType {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside <AdminDataProvider>');
  return ctx;
}
