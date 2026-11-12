import type { Lang } from '../context/LanguageContext';

export const PUBLIC_PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/ueber-uns',
  configurator: '/konfigurator',
  models: '/modelle',
  'model-detail': '/modelle',
  equipment: '/ausstattung',
  contact: '/kontakt',
  imprint: '/impressum',
  privacy: '/datenschutz',
  reviews: '/bewertungen',
};

export function getLanguageFromPath(pathname: string): Lang | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment === 'en' || firstSegment === 'sk' ? firstSegment : null;
}

export function stripLanguagePrefix(pathname: string) {
  const language = getLanguageFromPath(pathname);
  if (!language) return pathname;

  const stripped = pathname.slice(language.length + 1);
  return stripped || '/';
}

export function getLocalizedPath(page: string, lang: Lang) {
  const basePath = PUBLIC_PAGE_PATHS[page];
  if (!basePath) return null;
  if (lang === 'de') return basePath;
  return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`;
}
