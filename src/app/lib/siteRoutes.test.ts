import { describe, expect, it } from 'vitest';
import { getLanguageFromPath, getLocalizedPath, stripLanguagePrefix } from './siteRoutes';

describe('localized public routes', () => {
  it('keeps German on the existing canonical paths', () => {
    expect(getLocalizedPath('home', 'de')).toBe('/');
    expect(getLocalizedPath('equipment', 'de')).toBe('/ausstattung');
  });

  it('adds stable English and Slovak URL prefixes', () => {
    expect(getLocalizedPath('contact', 'en')).toBe('/en/kontakt');
    expect(getLocalizedPath('configurator', 'sk')).toBe('/sk/konfigurator');
  });

  it('recognizes supported language prefixes only', () => {
    expect(getLanguageFromPath('/en/modelle')).toBe('en');
    expect(getLanguageFromPath('/sk')).toBe('sk');
    expect(getLanguageFromPath('/de/modelle')).toBeNull();
  });

  it('resolves localized paths back to the existing application route', () => {
    expect(stripLanguagePrefix('/en/ausstattung')).toBe('/ausstattung');
    expect(stripLanguagePrefix('/sk')).toBe('/');
  });
});
