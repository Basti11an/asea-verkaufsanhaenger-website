import type { AdminReference } from '../context/AdminDataContext';
import type { TranslationKey } from '../context/LanguageContext';

type Translate = (key: TranslationKey) => string;

const REFERENCE_MODEL_LABEL_KEYS: Record<string, TranslationKey> = {
  verkaufsanhänger: 'reference_model_sales',
  kühlanhänger: 'reference_model_cooling',
  'messe- und präsentationsanhänger': 'reference_model_exhibition',
};

const REFERENCE_DESCRIPTION_KEYS: Record<string, TranslationKey> = {
  'Mobiler Würstelstand im Wiener Prater - täglich im Einsatz.': 'reference_seed1_desc',
  'Café-Präsentationen bei Events und Stadtfesten in Salzburg.': 'reference_seed2_desc',
  'Frischlieferungen von Getränken an Gastronomiebetriebe im Großraum Linz.': 'reference_seed3_desc',
  'Schnellimbiss am Hauptplatz Graz - beliebt bei Marktbesuchern.': 'reference_seed4_desc',
  'Frische Backwaren direkt vom Anhänger auf dem Wochenmarkt.': 'reference_seed5_desc',
  'Professionelle Event-Bewirtung bei Tiroler Outdoor-Veranstaltungen.': 'reference_seed6_desc',
};

export function normalizeModelName(modelName: string) {
  return modelName.trim().toLowerCase();
}

export function getReferenceModelLabel(modelName: string, t: Translate) {
  const labelKey = REFERENCE_MODEL_LABEL_KEYS[normalizeModelName(modelName)];
  return labelKey ? t(labelKey) : modelName;
}

export function getReferenceDescription(reference: AdminReference, t: Translate) {
  const descriptionKey = REFERENCE_DESCRIPTION_KEYS[reference.beschreibung.trim()];
  return descriptionKey ? t(descriptionKey) : reference.beschreibung;
}

export function isApprovedVisibleReference(reference: AdminReference) {
  return reference.status === 'approved' && reference.sichtbar;
}

export function sortReferencesNewestFirst(references: AdminReference[]) {
  return [...references].sort((a, b) => b.id - a.id);
}

export function getLatestApprovedReferences(references: AdminReference[], limit: number) {
  return sortReferencesNewestFirst(references)
    .filter(isApprovedVisibleReference)
    .slice(0, limit);
}

export function getApprovedReferencesForModel(
  references: AdminReference[],
  modelName: string,
  limit: number,
) {
  const normalizedModelName = normalizeModelName(modelName);

  return sortReferencesNewestFirst(references)
    .filter((reference) => (
      isApprovedVisibleReference(reference)
      && normalizeModelName(reference.modell) === normalizedModelName
    ))
    .slice(0, limit);
}
