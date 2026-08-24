export interface PrivacyConsent {
  necessary: true;
  statistics: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'asea-privacy-consent';

export function getPrivacyConsent(): PrivacyConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as Partial<PrivacyConsent>;

    return {
      necessary: true,
      statistics: Boolean(parsed.statistics),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function savePrivacyConsent(statistics: boolean): PrivacyConsent {
  const consent: PrivacyConsent = {
    necessary: true,
    statistics,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}

  return consent;
}

export function hasStatisticsConsent() {
  return getPrivacyConsent()?.statistics === true;
}
