import { ArrowRight, Award, Users, Wrench, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ReferenceCard } from '../references/ReferenceCard';
import { ReferenceSubmitPanel } from '../references/ReferenceSubmitPanel';
import { getLatestApprovedReferences } from '../../lib/referenceUtils';
import { getRevealAnimate, getRevealInitial, useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { references } = useAdminData();
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();
  const visibleRefs = getLatestApprovedReferences(references, 6);

  const features = [
    { icon: Award, titleKey: 'home_feature1_title' as const, descKey: 'home_feature1_desc' as const },
    { icon: Wrench, titleKey: 'home_feature2_title' as const, descKey: 'home_feature2_desc' as const },
    { icon: Users, titleKey: 'home_feature3_title' as const, descKey: 'home_feature3_desc' as const },
    { icon: CheckCircle2, titleKey: 'home_feature4_title' as const, descKey: 'home_feature4_desc' as const },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: '480px' }}>
        <ImageWithFallback
          src="https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/slider/cache/4014a61e3251bd6603ba5f355908e033/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-7.webp"
          alt="ASEA Verkaufsanhänger"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 45%' }}
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
            <h1 className="text-[28px] sm:text-[34px] md:text-[27px] lg:text-[34px] xl:text-[42px] font-bold leading-tight tracking-[0.1em] text-[#2f2f2d] uppercase mb-0">
              Verkaufsanhänger
            </h1>
            <p className="text-[60px] sm:text-[72px] md:text-[96px] lg:text-[116px] xl:text-[136px] font-extrabold leading-[0.85] tracking-tight text-[#b08a57] uppercase mb-4 md:mb-6">
              ASEA
            </p>

            <div className="mb-5 md:mb-8 pl-3 md:pl-4 border-l-2 border-[#b08a57]/40 space-y-1 md:space-y-2">
              <p className="text-[12px] md:text-[15px] font-medium tracking-[0.06em] text-[#2f2f2d]/70">Individuelle Lösungen.</p>
              <p className="text-[12px] md:text-[15px] font-medium tracking-[0.06em] text-[#2f2f2d]/70">Höchste Qualität.</p>
              <p className="text-[12px] md:text-[15px] font-medium tracking-[0.06em] text-[#2f2f2d]/70">Für Ihren Erfolg.</p>
            </div>

            <button
              onClick={() => onNavigate('models')}
              className="inline-flex items-center gap-2 border border-[#2f2f2d]/25 text-[#2f2f2d]/70 text-[11px] md:text-[13px] font-medium uppercase tracking-[0.18em] px-5 py-2 md:px-6 md:py-2.5 hover:bg-[#2f2f2d]/5 hover:border-[#2f2f2d]/50 hover:text-[#2f2f2d] transition-all duration-200 w-fit"
            >
              {t('home_model_learn_more')}
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#f8f7f3] py-12 md:py-16 relative">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '25+', labelKey: 'home_stat1_label' as const, delay: 0 },
              { value: '750+', labelKey: 'home_stat2_label' as const, delay: 0.1 },
              { value: '100%', labelKey: 'home_stat3_label' as const, delay: 0.2 },
              { value: '15', labelKey: 'home_stat4_label' as const, delay: 0.3 },
            ].map(({ value, labelKey, delay }) => (
              <motion.div
                key={labelKey}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#77756f] mb-2 md:mb-3">
                  {value}
                </div>
                <div className="text-sm md:text-base text-[#77756f] font-medium">{t(labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Erfahrungen Section */}
      <section className="py-10 md:py-12 gradient-accent relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          {visibleRefs.length > 0 && (
            <div className="reference-marquee mb-8 md:mb-10">
              <div className="reference-marquee-track">
                {[0, 1].map((groupIndex) => (
                  <div
                    key={groupIndex}
                    className="reference-marquee-group"
                    aria-hidden={groupIndex === 1}
                  >
                    {visibleRefs.map((reference) => (
                      <ReferenceCard
                        key={`${groupIndex}-${reference.id}`}
                        reference={reference}
                        className="w-[280px] md:w-[340px] shrink-0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReferenceSubmitPanel className="max-w-5xl mx-auto" />
        </div>
      </section>

      {/* Models Preview Section */}
      <section className="py-16 md:py-20 gradient-accent relative">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-5xl text-[#2f2f2d] mb-3 md:mb-4">{t('home_models_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] max-w-2xl mx-auto">{t('home_models_subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                src: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg',
                nameKey: 'home_model1_name' as const,
                descKey: 'home_model1_desc' as const,
                delay: 0,
              },
              {
                src: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg',
                nameKey: 'home_model2_name' as const,
                descKey: 'home_model2_desc' as const,
                delay: 0.1,
              },
              {
                src: 'https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg',
                nameKey: 'home_model3_name' as const,
                descKey: 'home_model3_desc' as const,
                delay: 0.2,
              },
            ].map(({ src, nameKey, descKey, delay }) => (
              <motion.div
                key={nameKey}
                className="group glass rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
                whileHover={{ y: -6 }}
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2f2f2d]/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <ImageWithFallback
                    src={src}
                    alt={t(nameKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 md:p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg md:text-xl text-[#2f2f2d] mb-2">{t(nameKey)}</h3>
                  <p className="text-sm md:text-base text-[#77756f] mb-4 line-clamp-2">{t(descKey)}</p>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('models')}
                    className="group/btn border-[#b08a57]/50 text-[#2f2f2d] hover:bg-[#b08a57]/10 w-full sm:w-auto"
                  >
                    {t('home_model_learn_more')}
                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10 md:mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => onNavigate('models')}
              className="gradient-secondary text-white hover:shadow-xl transition-all duration-300"
            >
              {t('home_models_view_all')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-5xl text-[#2f2f2d] mb-3 md:mb-4">{t('home_features_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] max-w-2xl mx-auto">{t('home_features_subtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="glass p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 gradient-primary rounded-xl flex items-center justify-center mb-5 md:mb-6 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Icon className="text-[#2f2f2d]" size={24} />
                  </div>
                  <h3 className="text-base md:text-xl text-[#2f2f2d] mb-2 md:mb-3">{t(feature.titleKey)}</h3>
                  <p className="text-sm md:text-base text-[#77756f] leading-relaxed">{t(feature.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 gradient-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Phone className="mx-auto mb-5 md:mb-6 text-white opacity-90" size={44} />
            <h2 className="text-2xl md:text-3xl lg:text-5xl mb-4 md:mb-6 text-white font-bold">{t('home_cta_title')}</h2>
            <p className="text-base md:text-xl text-white/85 mb-6 md:mb-8 leading-relaxed">{t('home_cta_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('contact')}
                className="bg-white text-[#b08a57] hover:bg-white/90 hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Phone className="mr-2" size={18} />
                +43 664 410 5 007
              </Button>
              <Button
                size="lg"
                onClick={() => onNavigate('contact')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/15 transition-all duration-300 font-semibold"
              >
                {t('home_cta_form')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
