import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { getRevealAnimate, getRevealInitial, useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';
import { GoogleMapsEmbed } from '../GoogleMapsEmbed';

export function AboutPage() {
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();

  const values = [
    { titleKey: 'about_value1_title' as const, descKey: 'about_value1_desc' as const },
    { titleKey: 'about_value2_title' as const, descKey: 'about_value2_desc' as const },
    { titleKey: 'about_value3_title' as const, descKey: 'about_value3_desc' as const },
    { titleKey: 'about_value4_title' as const, descKey: 'about_value4_desc' as const },
  ];

  const timeline = [
    { year: '2000', titleKey: 'about_timeline_2000_title' as const, descKey: 'about_timeline_2000_desc' as const },
    { year: '2005', titleKey: 'about_timeline_2005_title' as const, descKey: 'about_timeline_2005_desc' as const },
    { year: '2012', titleKey: 'about_timeline_2012_title' as const, descKey: 'about_timeline_2012_desc' as const },
    { year: '2020', titleKey: 'about_timeline_2020_title' as const, descKey: 'about_timeline_2020_desc' as const },
    { year: '2026', titleKey: 'about_timeline_2026_title' as const, descKey: 'about_timeline_2026_desc' as const },
  ];

  return (
    <div>
      {/* Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={getRevealInitial(touchFriendlyMotion, -50)}
              whileInView={getRevealAnimate(touchFriendlyMotion)}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-4 md:mb-6">{t('about_story_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('about_story_p1')}</p>
                <p>{t('about_story_p2')}</p>
                <p>{t('about_story_p3')}</p>
                <p>{t('about_story_p4')}</p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={getRevealInitial(touchFriendlyMotion, 50)}
              whileInView={getRevealAnimate(touchFriendlyMotion)}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#b08a57]/20 to-transparent z-10" />
                <ImageWithFallback
                  src="https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg"
                  alt="ASEA Werkstatt"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 gradient-accent relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <motion.div
              className="border-l-2 border-[#b08a57] pl-5 md:pl-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-4">{t('about_values_title')}</h2>
              <p className="text-base md:text-lg text-[#77756f] leading-relaxed max-w-xl">{t('about_values_subtitle')}</p>
            </motion.div>

            <div className="grid gap-0 border-y border-[#dfd9cf] bg-white/55 md:grid-cols-2">
              {values.map((value, index) => (
                <motion.div
                  key={value.titleKey}
                  className={`p-5 md:p-7 ${
                    index % 2 === 1 ? 'md:border-l' : ''
                  } ${index > 1 ? 'border-t' : index > 0 ? 'border-t md:border-t-0' : ''} border-[#dfd9cf]`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <div className="mb-4 h-px w-12 bg-[#b08a57]" />
                  <h3 className="text-lg md:text-xl text-[#2f2f2d] mb-3">{t(value.titleKey)}</h3>
                  <p className="text-sm md:text-base text-[#77756f] leading-relaxed">{t(value.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={getRevealInitial(touchFriendlyMotion, -50)}
              whileInView={getRevealAnimate(touchFriendlyMotion)}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-6">{t('about_location_title')}</h2>

              <div className="space-y-4 text-[#77756f] leading-relaxed mb-8">
                <p>{t('about_location_p1')}</p>
                <p>{t('about_location_p2')}</p>
              </div>

              <div className="glass p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl text-[#2f2f2d] mb-4">{t('about_contact_info_title')}</h3>
                <div className="space-y-3 text-[#77756f]">
                  <p><strong>{t('about_address_label')}</strong><br />Lahrndorf 34<br />A-4240 Waldburg, {t('contact_country')}</p>
                  <p><strong>{t('about_phone_label')}</strong> +43 664 410 5 007</p>
                  <p><strong>{t('about_email_label')}</strong> office@verkaufsanhaenger-asea.at</p>
                  <p><strong>{t('about_hours_label')}</strong><br />{t('about_hours_weekday')}<br />{t('about_hours_saturday')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden h-80 lg:h-full min-h-[400px] shadow-lg"
              initial={getRevealInitial(touchFriendlyMotion, 50)}
              whileInView={getRevealAnimate(touchFriendlyMotion)}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GoogleMapsEmbed title={t('contact_map_iframe_title')} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="border-l-2 border-[#b08a57] pl-5 md:pl-7">
                <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-4">{t('about_team_title')}</h2>
                <p className="text-base md:text-lg text-[#77756f] leading-relaxed max-w-xl">{t('about_team_subtitle')}</p>
              </div>
            </motion.div>

            <div className="border-y border-[#dfd9cf]">
              {[
                { titleKey: 'about_team1_title' as const, descKey: 'about_team1_desc' as const },
                { titleKey: 'about_team2_title' as const, descKey: 'about_team2_desc' as const },
                { titleKey: 'about_team3_title' as const, descKey: 'about_team3_desc' as const },
              ].map((item, index) => (
                <motion.div
                  key={item.titleKey}
                  className="grid gap-3 border-b border-[#dfd9cf] py-6 last:border-b-0 md:grid-cols-[190px_1fr] md:gap-8 md:py-7"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <h3 className="text-lg md:text-xl text-[#2f2f2d]">{t(item.titleKey)}</h3>
                  <p className="text-sm md:text-base text-[#77756f] leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
