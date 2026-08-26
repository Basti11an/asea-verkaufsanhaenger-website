export interface PrivacyConsent {
  necessary: true;
  statistics: boolean;
  googleServices: boolean;
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
      googleServices: Boolean(parsed.googleServices),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function savePrivacyConsent(statistics: boolean, googleServices = false): PrivacyConsent {
  const consent: PrivacyConsent = {
    necessary: true,
    statistics,
    googleServices,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new Event('asea-privacy-consent-change'));
  } catch {}

  return consent;
}

export function hasStatisticsConsent() {
  return getPrivacyConsent()?.statistics === true;
}

export function hasGoogleServicesConsent() {
  return getPrivacyConsent()?.googleServices === true;
}

export function saveGoogleServicesConsent() {
  const current = getPrivacyConsent();
  return savePrivacyConsent(current?.statistics ?? false, true);
}
