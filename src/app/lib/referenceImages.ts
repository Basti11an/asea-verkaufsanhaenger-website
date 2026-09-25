const MAX_REFERENCE_IMAGES = 3;
const REFERENCE_IMAGES_PREFIX = 'asea-reference-images:';

export function getMaxReferenceImages() {
  return MAX_REFERENCE_IMAGES;
}

export function serializeReferenceImageUrls(urls: string[]) {
  const cleanUrls = urls.map((url) => url.trim()).filter(Boolean).slice(0, MAX_REFERENCE_IMAGES);
  if (cleanUrls.length === 0) return '';
  if (cleanUrls.length === 1) return cleanUrls[0];
  return `${REFERENCE_IMAGES_PREFIX}${JSON.stringify(cleanUrls)}`;
}

export function getReferenceImageUrls(value?: string | null) {
  const rawValue = value?.trim() ?? '';
  if (!rawValue) return [];

  if (!rawValue.startsWith(REFERENCE_IMAGES_PREFIX)) {
    return [rawValue];
  }

  try {
    const parsed = JSON.parse(rawValue.slice(REFERENCE_IMAGES_PREFIX.length));
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((url): url is string => typeof url === 'string')
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, MAX_REFERENCE_IMAGES);
  } catch {
    return [];
  }
}

export function getPrimaryReferenceImageUrl(value?: string | null) {
  return getReferenceImageUrls(value)[0] ?? '';
}
