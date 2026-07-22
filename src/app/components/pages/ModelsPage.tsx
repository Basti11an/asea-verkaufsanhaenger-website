import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ReferenceSubmitPanel } from '../references/ReferenceSubmitPanel';
import { getRevealAnimate, getRevealInitial, useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';

interface ModelsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

// Static detail data keyed by AdminModel.id
const STATIC_DETAILS: Record<number, {
  id: string;
  category: string;
  images: string[];
  shortDescription: string;
  features: string[];
  specs: { label: string; value: string }[];
  price: string;
  baseEquipment: string[];
  construction: string[];
}> = {
  1: {
    id: '1',
    category: 'sales',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-10.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-86.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-87.jpg',
    ],
    shortDescription: 'Ihr praktischer Begleiter bei Verkaufstouren',
    features: [
      'Geringes Eigengewicht - mehr Zuladung',
      'Maximale Flexibilität im Einsatz',
      'Großzügige Verkaufsfläche',
      'Robuste und langlebige Bauweise',
      'Wetterfeste Konstruktion',
      'Individuelle Innenausstattung möglich',
      'LED-Beleuchtung innen und außen',
      'Komplette elektrische Ausstattung 230V',
    ],
    specs: [
      { label: 'Länge', value: '3,50 m' },
      { label: 'Breite', value: '2,00 m' },
      { label: 'Höhe', value: '2,40 m' },
      { label: 'Eigengewicht', value: 'ca. 650 kg' },
      { label: 'Zul. Gesamtgewicht', value: '1.300 kg' },
      { label: 'Nutzlast', value: 'ca. 650 kg' },
      { label: 'Verkaufsfläche', value: '7 m²' },
      { label: 'Stromanschluss', value: '230V' },
    ],
    price: 'ab 8.900 €',
    baseEquipment: [
      'Verkaufsanhänger mit komplettem Aufbau',
      'Vollständig isolierte Konstruktion (Wände, Dach, Boden)',
      'Elektrische Grundausstattung 230V mit Sicherungskasten',
      'Große Verkaufsklappe mit Gasdruckfedern',
      'Abschließbare Türen und Klappen',
      'Stützrad und professionelles Bremssystem',
      'LED-Innenbeleuchtung',
      'Wetterfeste Außenmaterialien',
      'Hochwertige Verarbeitung',
      'TÜV-geprüft und straßenzugelassen',
    ],
    construction: [
      'Robuster verzinkter Stahlrahmen',
      'Isolierte Wände und Dach (30mm)',
      'Hochwertige Alu-Verbundplatten außen',
      'Innenverkleidung weiß',
      'Langlebige Materialien',
      'Moderne Bautechnik',
      'Alle Komponenten TÜV-geprüft',
    ],
  },
  2: {
    id: '2',
    category: 'cooling',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-3.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-71.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-72.jpg',
    ],
    shortDescription: 'Frische Waren sicher transportiert',
    features: [
      'Professionelle Kühltechnik',
      'Präzise Temperaturkontrolle',
      'Energieeffiziente Kühlung',
      'Lebensmittelgerechte Ausstattung',
      'Zuverlässige Dauerkühlung',
      'Großes Kühlvolumen',
      'Einfache Reinigung und Wartung',
      'Hochwertige Isolierung',
    ],
    specs: [
      { label: 'Länge', value: '4,00 m' },
      { label: 'Breite', value: '2,20 m' },
      { label: 'Höhe', value: '2,50 m' },
      { label: 'Eigengewicht', value: 'ca. 950 kg' },
      { label: 'Zul. Gesamtgewicht', value: '2.000 kg' },
      { label: 'Nutzlast', value: 'ca. 1.050 kg' },
      { label: 'Kühlvolumen', value: '16 m³' },
      { label: 'Temperaturbereich', value: '-5°C bis +10°C' },
      { label: 'Energieversorgung', value: '230V/12V' },
    ],
    price: 'ab 14.900 €',
    baseEquipment: [
      'Professionelles Kühlsystem mit Thermostat',
      'Digitale Temperaturregelung und -anzeige',
      'Vollständige Isolierung (80mm Stärke)',
      'Lebensmittelgerechte Edelstahlverkleidung innen',
      'Abschließbare isolierte Türen',
      'LED-Innenbeleuchtung',
      'Stromanschluss 230V und 12V',
      'Bodenentwässerung',
      'TÜV-geprüft',
      'Inkl. Kühlflüssigkeit',
    ],
    construction: [
      'Hochwertige Kühltechnik namhafter Hersteller',
      'Professionelle Vollschaumisolierung 80mm',
      'GFK-Außenhaut wetterbeständig',
      'Edelstahl-Innenverkleidung',
      'Robuster Aluminiumrahmen',
      'Energieeffiziente Bauweise',
      'Wartungsfreundliche Konstruktion',
    ],
  },
  3: {
    id: '3',
    category: 'exhibition',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-5.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-6.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-81.jpg',
    ],
    shortDescription: 'Perfekt für Events und Präsentationen',
    features: [
      'Professionelle Präsentationsfläche',
      'Eigene autarke Elektrik',
      'Optimal für Outdoor-Events',
      'Repräsentatives Design',
      'Flexibel und vielseitig einsetzbar',
      'Witterungsbeständig und robust',
      'Hochwertige Innenausstattung',
      'Individuelle Gestaltung und Branding möglich',
    ],
    specs: [
      { label: 'Länge', value: '5,00 m' },
      { label: 'Breite', value: '2,50 m' },
      { label: 'Höhe', value: '2,80 m' },
      { label: 'Eigengewicht', value: 'ca. 1.100 kg' },
      { label: 'Zul. Gesamtgewicht', value: '2.500 kg' },
      { label: 'Nutzlast', value: 'ca. 1.400 kg' },
      { label: 'Präsentationsfläche', value: '12,5 m²' },
      { label: 'Stromanschluss', value: '230V autark' },
      { label: 'Stehhöhe innen', value: '2,20 m' },
    ],
    price: 'ab 16.500 €',
    baseEquipment: [
      'Professioneller Messeaufbau mit großen Klappen',
      'Eigene autarke Elektrikversorgung 230V',
      'Integriertes Beleuchtungssystem LED',
      'Großzügige Präsentationsflächen innen',
      'Wetterfeste und robuste Konstruktion',
      'Repräsentatives modernes Design',
      'Abschließbare Türen und Klappen',
      'Flexible Innenraumgestaltung',
      'Steckdosen und Lichtschalter',
      'TÜV-geprüft und zugelassen',
    ],
    construction: [
      'Hochwertige GFK-Außenverkleidung',
      'Professionelle Isolierung',
      'Moderne Elektroinstallation',
      'Robuster Stahlrahmen verzinkt',
      'Witterungsbeständige Materialien',
      'Hochwertige Innenverkleidung',
      'Individuell gestaltbar (Folierung, Lack)',
      'Langlebige Bauweise',
    ],
  },
};

export function ModelsPage({ onNavigate }: ModelsPageProps) {
  const { models: adminModels } = useAdminData();
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();

  const models = adminModels
    .filter((m) => m.active)
    .map((m) => {
      const details = STATIC_DETAILS[m.id];
      return {
        ...details,
        name: m.name,
        description: m.description,
        shortDescription: m.description.length > 70
          ? m.description.slice(0, 70) + '…'
          : m.description,
        image: m.imageUrl,
      };
    });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#f8f7f3] py-16 md:py-20 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b08a57]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{t('models_hero_title')}</h1>
            <p className="text-base md:text-xl text-[#b08a57] leading-relaxed">{t('models_hero_desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-16 md:py-20 gradient-accent">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          {models.length === 0 ? (
            <p className="text-center text-[#77756f] py-16 md:py-20">{t('models_no_models')}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  className="group glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2f2f2d]/70 to-transparent z-10" />
                    <ImageWithFallback
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <motion.div
                      className="absolute top-4 right-4 gradient-primary text-[#2f2f2d] px-3 py-1 rounded-full text-sm z-20 shadow-lg font-bold"
                      initial={getRevealInitial(touchFriendlyMotion, 100)}
                      animate={getRevealAnimate(touchFriendlyMotion)}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    >
                      {model.price}
                    </motion.div>
                  </div>

                  <div className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-2xl text-[#2f2f2d] mb-2">{model.name}</h3>
                    <p className="text-[#77756f] mb-4">{model.shortDescription}</p>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onNavigate('model-detail', { model })}
                        className="flex-1 gradient-secondary text-white hover:shadow-xl transition-all duration-300 group/btn"
                      >
                        {t('models_view_details')}
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-[#b08a57]/0 to-[#b08a57]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}

          <ReferenceSubmitPanel
            className="mt-10 md:mt-12"
            description="Nutzen Sie einen ASEA Anhänger? Teilen Sie Ihre Erfahrung. Nach der Prüfung im Admin-Bereich wird sie veröffentlicht."
            buttonLabel="Bewertung schreiben"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="text-[#2f2f2d]" size={40} />
            </motion.div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl text-[#2f2f2d] mb-4 md:mb-6 font-bold">{t('models_cta_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">{t('models_cta_desc')}</p>

            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="gradient-secondary text-white hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="mr-2" size={20} />
              {t('models_cta_button')}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
