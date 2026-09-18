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
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '…' },
      { labelKey: 'spec_breite', value: '…' },
      { labelKey: 'spec_hoehe', value: '…' },
      { labelKey: 'spec_eigengewicht', value: '…' },
      { labelKey: 'spec_gesamtgewicht', value: '…' },
      { labelKey: 'spec_nutzlast', value: '…' },
      { labelKey: 'spec_verkaufsflaeche', value: '…' },
      { labelKey: 'spec_stromanschluss', value: '…' },
    ],
    priceKey: 'model_sales_price',
    baseEquipmentKeys: [
      'model_sales_base1',
    ],
    constructionKeys: [
      'model_sales_construction1',
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
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '…' },
      { labelKey: 'spec_breite', value: '…' },
      { labelKey: 'spec_hoehe', value: '…' },
      { labelKey: 'spec_eigengewicht', value: '…' },
      { labelKey: 'spec_gesamtgewicht', value: '…' },
      { labelKey: 'spec_nutzlast', value: '…' },
      { labelKey: 'spec_kuehlvolumen', value: '…' },
      { labelKey: 'spec_temperatur', value: '…' },
      { labelKey: 'spec_energie', value: '…' },
    ],
    priceKey: 'model_cooling_price',
    baseEquipmentKeys: [
      'model_cooling_base1',
    ],
    constructionKeys: [
      'model_cooling_construction1',
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
    ],
    specs: [
      { labelKey: 'spec_laenge', value: '…' },
      { labelKey: 'spec_breite', value: '…' },
      { labelKey: 'spec_hoehe', value: '…' },
      { labelKey: 'spec_eigengewicht', value: '…' },
      { labelKey: 'spec_gesamtgewicht', value: '…' },
      { labelKey: 'spec_nutzlast', value: '…' },
      { labelKey: 'spec_praesentationsflaeche', value: '…' },
      { labelKey: 'spec_stromanschluss', value: '…' },
      { labelKey: 'spec_stehoehe', value: '…' },
    ],
    priceKey: 'model_exhibition_price',
    baseEquipmentKeys: [
      'model_exhibition_base1',
    ],
    constructionKeys: [
      'model_exhibition_construction1',
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
      {/* Models Grid */}
      <section className="gradient-accent pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <h1 className="sr-only">{t('models_hero_title')}</h1>
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
