import { createContext, useContext, useState, ReactNode } from 'react';
import { de } from '../translations/de';
import { en } from '../translations/en';
import { sk } from '../translations/sk';

export type Lang = 'de' | 'en' | 'sk';
export type TranslationKey = keyof typeof de;

export const availableLanguages: Lang[] = ['de', 'en', 'sk'];

const translations = { de, en, sk };

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'de',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('asea-lang') as Lang;
      return availableLanguages.includes(saved) ? saved : 'de';
    } catch {
      return 'de';
    }
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('asea-lang', newLang);
    } catch {}
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[lang] as Record<string, string>;
    const fallback = translations.de as Record<string, string>;
    return dict[key] ?? fallback[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
