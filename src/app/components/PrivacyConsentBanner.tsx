import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getPrivacyConsent, savePrivacyConsent } from '../lib/privacyConsent';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyConsentBannerProps {
  forceOpen: boolean;
  onClose: () => void;
  onConsentChange: () => void;
  onNavigate: (page: string) => void;
}

const TEXT = {
  de: {
    title: 'Datenschutzeinstellungen',
    body: 'Wir verwenden notwendige lokale Einstellungen für Sprache und Datenschutz. Optionale Statistik hilft uns, Seitenaufrufe datensparsam mit Vercel Analytics auszuwerten.',
    settings: 'Einstellungen',
    acceptAll: 'Alle akzeptieren',
    necessary: 'Nur notwendige',
    statsLabel: 'Statistik',
    statsHelp: 'Web Analytics in Vercel. Die eigene Supabase-Statistik ist aktuell pausiert.',
    save: 'Auswahl speichern',
    back: 'Zurück',
    privacy: 'Datenschutzerklärung',
    saved: 'Einstellung gespeichert.',
  },
  en: {
    title: 'Privacy Settings',
    body: 'We use necessary local settings for language and privacy. Optional statistics help us evaluate page views sparingly with Vercel Analytics.',
    settings: 'Settings',
    acceptAll: 'Accept all',
    necessary: 'Necessary only',
    statsLabel: 'Statistics',
    statsHelp: 'Web Analytics in Vercel. The custom Supabase statistics are currently paused.',
    save: 'Save selection',
    back: 'Back',
    privacy: 'Privacy policy',
    saved: 'Setting saved.',
  },
  sk: {
    title: 'Nastavenia súkromia',
    body: 'Používame nevyhnutné lokálne nastavenia pre jazyk a súkromie. Voliteľná štatistika nám pomáha úsporne vyhodnocovať zobrazenia stránok cez Vercel Analytics.',
    settings: 'Nastavenia',
    acceptAll: 'Prijať všetko',
    necessary: 'Iba nevyhnutné',
    statsLabel: 'Štatistika',
    statsHelp: 'Web Analytics vo Vercel. Vlastné štatistiky Supabase sú aktuálne pozastavené.',
    save: 'Uložiť výber',
    back: 'Späť',
    privacy: 'Ochrana údajov',
    saved: 'Nastavenie uložené.',
  },
};

export function PrivacyConsentBanner({ forceOpen, onClose, onConsentChange, onNavigate }: PrivacyConsentBannerProps) {
  const { lang } = useLanguage();
  const copy = TEXT[lang] ?? TEXT.de;
  const [hasStoredChoice, setHasStoredChoice] = useState(() => Boolean(getPrivacyConsent()));
  const [showSettings, setShowSettings] = useState(false);
  const [statisticsChoice, setStatisticsChoice] = useState(() => getPrivacyConsent()?.statistics ?? false);
  const [saved, setSaved] = useState(false);
  const isOpen = forceOpen || !hasStoredChoice;

  useEffect(() => {
    const stored = getPrivacyConsent();
    setHasStoredChoice(Boolean(stored));
    setStatisticsChoice(stored?.statistics ?? false);
    if (forceOpen) setShowSettings(false);
  }, [forceOpen]);

  const choose = (statistics: boolean) => {
    savePrivacyConsent(statistics);
    setHasStoredChoice(true);
    setSaved(true);
    onConsentChange();
    window.setTimeout(() => setSaved(false), 2200);
    onClose();
  };

  if (!isOpen && !saved) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-3xl rounded-xl border border-[#dfd9cf] bg-white p-4 shadow-2xl md:p-5">
      {isOpen && !showSettings ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#2f2f2d]">{copy.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#77756f]">{copy.body}</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('privacy');
              }}
              className="mt-2 text-sm font-medium text-[#9a7445] underline underline-offset-4"
            >
              {copy.privacy}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 md:min-w-[390px]">
            <Button
              type="button"
              variant="outline"
              onClick={() => choose(false)}
              className="border-[#b08a57]/40 text-[#2f2f2d]"
            >
              {copy.necessary}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="border-[#b08a57]/40 text-[#2f2f2d]"
            >
              {copy.settings}
            </Button>
            <Button
              type="button"
              onClick={() => choose(true)}
              className="bg-[#2f2f2d] text-white hover:bg-[#1c1c1a]"
            >
              {copy.acceptAll}
            </Button>
          </div>
        </div>
      ) : isOpen ? (
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="text-base font-semibold text-[#2f2f2d]">{copy.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#77756f]">{copy.body}</p>
            <label className="mt-4 flex items-start gap-3 rounded-lg border border-[#dfd9cf] bg-[#f8f7f3] p-3">
              <input
                type="checkbox"
                checked={statisticsChoice}
                onChange={(event) => setStatisticsChoice(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#9a7445]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#2f2f2d]">{copy.statsLabel}</span>
                <span className="block text-sm leading-relaxed text-[#77756f]">{copy.statsHelp}</span>
              </span>
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:min-w-[260px]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="border-[#b08a57]/40 text-[#2f2f2d]"
            >
              {copy.back}
            </Button>
            <Button
              type="button"
              onClick={() => choose(statisticsChoice)}
              className="bg-[#2f2f2d] text-white hover:bg-[#1c1c1a]"
            >
              {copy.save}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#55524c]">{copy.saved}</p>
      )}
    </div>
  );
}
