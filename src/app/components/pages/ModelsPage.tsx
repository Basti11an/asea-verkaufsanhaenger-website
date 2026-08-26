import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import { getRevealAnimate, getRevealInitial, useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';

interface ModelsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface StaticModelDetails {
  id: string;
  category: string;
  referenceModelName: string;
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
  shortDescriptionKey: TranslationKey;
  images: string[];
  featureKeys: TranslationKey[];
  specs: { labelKey: TranslationKey; value: string }[];
  priceKey: TranslationKey;
  baseEquipmentKeys: TranslationKey[];
  constructionKeys: TranslationKey[];
}

// Static detail data keyed by AdminModel.id
const STATIC_DETAILS: Record<number, StaticModelDetails> = {
  1: {
    id: '1',
    category: 'sales',
    referenceModelName: 'Verkaufsanhänger',
    nameKey: 'home_model1_name',
    descriptionKey: 'home_model1_desc',
    shortDescriptionKey: 'model_sales_short',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-10.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-86.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-87.jpg',
    ],
    featureKeys: [
      'model_sales_feature1',
      'model_sales_feature2',
      'model_sales_feature3',
      'model_sales_feature4',
      'model_sales_feature5',
      'model_sales_feature6',
      'model_sales_feature7',
      'model_sales_feature8',
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '3,50 m' },
      { labelKey: 'spec_breite', value: '2,00 m' },
      { labelKey: 'spec_hoehe', value: '2,40 m' },
      { labelKey: 'spec_eigengewicht', value: 'ca. 650 kg' },
      { labelKey: 'spec_gesamtgewicht', value: '1.300 kg' },
      { labelKey: 'spec_nutzlast', value: 'ca. 650 kg' },
      { labelKey: 'spec_verkaufsflaeche', value: '7 m²' },
      { labelKey: 'spec_stromanschluss', value: '230V' },
    ],
    priceKey: 'model_sales_price',
    baseEquipmentKeys: [
      'model_sales_base1',
      'model_sales_base2',
      'model_sales_base3',
      'model_sales_base4',
      'model_sales_base5',
      'model_sales_base6',
      'model_sales_base7',
      'model_sales_base8',
      'model_sales_base9',
      'model_sales_base10',
    ],
    constructionKeys: [
      'model_sales_construction1',
      'model_sales_construction2',
      'model_sales_construction3',
      'model_sales_construction4',
      'model_sales_construction5',
      'model_sales_construction6',
      'model_sales_construction7',
    ],
  },
  2: {
    id: '2',
    category: 'cooling',
    referenceModelName: 'Kühlanhänger',
    nameKey: 'home_model2_name',
    descriptionKey: 'home_model2_desc',
    shortDescriptionKey: 'model_cooling_short',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-3.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-71.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-72.jpg',
    ],
    featureKeys: [
      'model_cooling_feature1',
      'model_cooling_feature2',
      'model_cooling_feature3',
      'model_cooling_feature4',
      'model_cooling_feature5',
      'model_cooling_feature6',
      'model_cooling_feature7',
      'model_cooling_feature8',
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '4,00 m' },
      { labelKey: 'spec_breite', value: '2,20 m' },
      { labelKey: 'spec_hoehe', value: '2,50 m' },
      { labelKey: 'spec_eigengewicht', value: 'ca. 950 kg' },
      { labelKey: 'spec_gesamtgewicht', value: '2.000 kg' },
      { labelKey: 'spec_nutzlast', value: 'ca. 1.050 kg' },
      { labelKey: 'spec_kuehlvolumen', value: '16 m³' },
      { labelKey: 'spec_temperatur', value: '-5°C bis +10°C' },
      { labelKey: 'spec_energie', value: '230V/12V' },
    ],
    priceKey: 'model_cooling_price',
    baseEquipmentKeys: [
      'model_cooling_base1',
      'model_cooling_base2',
      'model_cooling_base3',
      'model_cooling_base4',
      'model_cooling_base5',
      'model_cooling_base6',
      'model_cooling_base7',
      'model_cooling_base8',
      'model_cooling_base9',
      'model_cooling_base10',
    ],
    constructionKeys: [
      'model_cooling_construction1',
      'model_cooling_construction2',
      'model_cooling_construction3',
      'model_cooling_construction4',
      'model_cooling_construction5',
      'model_cooling_construction6',
      'model_cooling_construction7',
    ],
  },
  3: {
    id: '3',
    category: 'exhibition',
    referenceModelName: 'Messe- und Präsentationsanhänger',
    nameKey: 'home_model3_name',
    descriptionKey: 'home_model3_desc',
    shortDescriptionKey: 'model_exhibition_short',
    images: [
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-5.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-6.jpg',
      'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-81.jpg',
    ],
    featureKeys: [
      'model_exhibition_feature1',
      'model_exhibition_feature2',
      'model_exhibition_feature3',
      'model_exhibition_feature4',
      'model_exhibition_feature5',
      'model_exhibition_feature6',
      'model_exhibition_feature7',
      'model_exhibition_feature8',
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '5,00 m' },
      { labelKey: 'spec_breite', value: '2,50 m' },
      { labelKey: 'spec_hoehe', value: '2,80 m' },
      { labelKey: 'spec_eigengewicht', value: 'ca. 1.100 kg' },
      { labelKey: 'spec_gesamtgewicht', value: '2.500 kg' },
      { labelKey: 'spec_nutzlast', value: 'ca. 1.400 kg' },
      { labelKey: 'spec_praesentationsflaeche', value: '12,5 m²' },
      { labelKey: 'spec_stromanschluss', value: '230V autark' },
      { labelKey: 'spec_stehoehe', value: '2,20 m' },
    ],
    priceKey: 'model_exhibition_price',
    baseEquipmentKeys: [
      'model_exhibition_base1',
      'model_exhibition_base2',
      'model_exhibition_base3',
      'model_exhibition_base4',
      'model_exhibition_base5',
      'model_exhibition_base6',
      'model_exhibition_base7',
      'model_exhibition_base8',
      'model_exhibition_base9',
      'model_exhibition_base10',
    ],
    constructionKeys: [
      'model_exhibition_construction1',
      'model_exhibition_construction2',
      'model_exhibition_construction3',
      'model_exhibition_construction4',
      'model_exhibition_construction5',
      'model_exhibition_construction6',
      'model_exhibition_construction7',
      'model_exhibition_construction8',
    ],
  },
};

export function ModelsPage({ onNavigate }: ModelsPageProps) {
  const { models: adminModels } = useAdminData();
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();

  const models = adminModels
    .filter((m) => m.active && STATIC_DETAILS[m.id])
    .map((m) => {
      const details = STATIC_DETAILS[m.id];
      return {
        ...details,
        name: t(details.nameKey),
        description: t(details.descriptionKey),
        shortDescription: t(details.shortDescriptionKey),
        image: m.imageUrl,
        features: details.featureKeys.map((key) => t(key)),
        specs: details.specs.map((spec) => ({ label: t(spec.labelKey), value: spec.value })),
        price: t(details.priceKey),
        baseEquipment: details.baseEquipmentKeys.map((key) => t(key)),
        construction: details.constructionKeys.map((key) => t(key)),
      };
    });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: '480px' }}>
        <ImageWithFallback
          src="https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg"
          alt={t('models_hero_title')}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 48%' }}
        />

        <div
          className="absolute inset-0 z-10 md:hidden"
          style={{ background: 'linear-gradient(to top, #f8f7f3 30%, rgba(248,247,243,0.88) 52%, rgba(248,247,243,0.3) 75%, transparent 100%)' }}
        />

        <div
          className="absolute inset-0 z-10 hidden md:block"
          style={{ clipPath: 'polygon(0 0, 54% 0, 42% 100%, 0 100%)', background: '#f8f7f3' }}
        />

        <div
          className="absolute inset-0 z-20 hidden md:block"
          style={{
            clipPath: 'polygon(53.7% 0, 54.5% 0, 42.3% 100%, 41.5% 100%)',
            background: 'linear-gradient(to bottom, #161615 0%, #161615 80%, #b08a57 80%, #b08a57 100%)',
          }}
        />

        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end md:justify-center pb-8 md:pb-0 px-6 md:px-12 lg:px-16 xl:px-24"
          initial={getRevealInitial(touchFriendlyMotion, -30)}
          animate={getRevealAnimate(touchFriendlyMotion)}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-full md:max-w-[38%]">
            <h1 className="text-[28px] sm:text-[34px] md:text-[27px] lg:text-[34px] xl:text-[42px] font-bold leading-tight tracking-[0.1em] text-[#2f2f2d] uppercase mb-3 md:mb-5">
              {t('models_hero_title')}
            </h1>

            <div className="mb-5 md:mb-8 pl-3 md:pl-4 border-l-2 border-[#b08a57]/40">
              <p className="text-[13px] md:text-[15px] font-medium leading-relaxed tracking-[0.03em] text-[#2f2f2d]/70">
                {t('models_hero_desc')}
              </p>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 border border-[#2f2f2d]/25 text-[#2f2f2d]/70 text-[11px] md:text-[13px] font-medium uppercase tracking-[0.18em] px-5 py-2 md:px-6 md:py-2.5 hover:bg-[#2f2f2d]/5 hover:border-[#2f2f2d]/50 hover:text-[#2f2f2d] transition-all duration-200 w-fit"
            >
              {t('models_cta_button')}
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Models Grid */}
      <section className="py-16 md:py-20 gradient-accent">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          {models.length === 0 ? (
            <p className="text-center text-[#77756f] py-16 md:py-20">{t('models_no_models')}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  className="group glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative h-full flex flex-col"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={touchFriendlyMotion ? undefined : { y: -8 }}
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

                  <div className="p-6 bg-white/80 backdrop-blur-sm flex flex-1 flex-col">
                    <h3 className="text-2xl text-[#2f2f2d] mb-2 leading-tight min-h-[4rem]">{model.name}</h3>
                    <p className="text-[#77756f] mb-5 leading-relaxed min-h-[4.5rem] line-clamp-3">{model.shortDescription}</p>

                    <div className="flex gap-2 mt-auto">
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

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#1c1c1a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#b08a57]" />
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="grid lg:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="border-l-2 border-[#b08a57] pl-5 md:pl-7">
              <h2 className="text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-5 font-bold">
                {t('models_cta_title')}
              </h2>
              <p className="text-base md:text-xl text-white/72 leading-relaxed max-w-3xl">
                {t('models_cta_desc')}
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-[#b08a57] text-white hover:bg-[#9a7445] hover:shadow-xl transition-all duration-300 justify-self-start lg:justify-self-end"
            >
              {t('models_cta_button')}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
