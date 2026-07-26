import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import { ReferenceSubmitPanel } from '../references/ReferenceSubmitPanel';
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
      <section className="relative bg-[#f8f7f3] py-16 md:py-20 overflow-hidden">
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
            descriptionKey="models_reference_desc"
            buttonLabelKey="references_write_review"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-[#2f2f2d] mb-4 md:mb-6 font-bold">{t('models_cta_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">{t('models_cta_desc')}</p>

            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="gradient-secondary text-white hover:shadow-xl transition-all duration-300"
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
