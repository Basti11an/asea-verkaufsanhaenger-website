import type { AdminReference } from '../context/AdminDataContext';

export function normalizeModelName(modelName: string) {
  return modelName.trim().toLowerCase();
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
