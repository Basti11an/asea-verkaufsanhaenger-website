import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

interface GoogleMapsEmbedProps {
  className?: string;
  title: string;
}

const MAP_URL = 'https://maps.google.com/maps?q=Lahrndorf+34,+A-4240+Waldburg,+%C3%96sterreich&t=&z=15&ie=UTF8&iwloc=&output=embed';

const TEXT = {
  de: {
    title: 'Google Maps ist deaktiviert.',
    text: 'Beim Laden der Karte können Daten, insbesondere Ihre IP-Adresse, an Google übertragen werden.',
    button: 'Google Maps laden',
    privacy: 'Weitere Informationen in der Datenschutzerklärung.',
  },
  en: {
    title: 'Google Maps is disabled.',
    text: 'Loading the map may transfer data, especially your IP address, to Google.',
    button: 'Load Google Maps',
    privacy: 'More information is available in the privacy policy.',
  },
  sk: {
    title: 'Google Maps je deaktivované.',
    text: 'Pri načítaní mapy sa môžu preniesť údaje, najmä vaša IP adresa, spoločnosti Google.',
    button: 'Načítať Google Maps',
    privacy: 'Viac informácií nájdete v zásadách ochrany údajov.',
  },
};

export function GoogleMapsEmbed({ className = '', title }: GoogleMapsEmbedProps) {
  const { lang } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  const copy = TEXT[lang] ?? TEXT.de;

  if (enabled) {
    return (
      <iframe
        src={MAP_URL}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className={className}
      />
    );
  }

  return (
    <div className={`flex h-full min-h-[320px] items-center justify-center bg-[#f3efe8] p-6 text-center ${className}`}>
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#b08a57] shadow-sm">
          <MapPin size={24} />
        </div>
        <h3 className="text-lg font-semibold text-[#2f2f2d]">{copy.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#77756f]">{copy.text}</p>
        <Button
          type="button"
          onClick={() => setEnabled(true)}
          className="mt-5 bg-[#2f2f2d] text-white hover:bg-[#1c1c1a]"
        >
          {copy.button}
        </Button>
        <a href="/datenschutz" className="mt-3 block text-xs text-[#9a7445] underline underline-offset-4">
          {copy.privacy}
        </a>
      </div>
    </div>
  );
}
