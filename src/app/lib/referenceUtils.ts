import type { AdminReference } from '../context/AdminDataContext';
import type { TranslationKey } from '../context/LanguageContext';

type Translate = (key: TranslationKey) => string;

const REFERENCE_MODEL_LABEL_KEYS: Record<string, TranslationKey> = {
  verkaufsanhänger: 'reference_model_sales',
  kühlanhänger: 'reference_model_cooling',
  'messe- und präsentationsanhänger': 'reference_model_exhibition',
};

export function normalizeModelName(modelName: string) {
  return modelName.trim().toLowerCase();
}

export function getReferenceModelLabel(modelName: string, t: Translate) {
  const labelKey = REFERENCE_MODEL_LABEL_KEYS[normalizeModelName(modelName)];
  return labelKey ? t(labelKey) : modelName;
}

export function getReferenceDescription(reference: AdminReference) {
  return reference.beschreibung;
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
