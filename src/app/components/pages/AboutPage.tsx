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
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-3 md:mb-4">{t('about_values_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] max-w-2xl mx-auto">{t('about_values_subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-9">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="border-t border-[#dfd9cf] pt-5"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <span className="block text-sm font-semibold text-[#b08a57] mb-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl text-[#2f2f2d] mb-3">{t(value.titleKey)}</h3>
                <p className="text-[#77756f] leading-relaxed">{t(value.descKey)}</p>
              </motion.div>
            ))}
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
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-3 md:mb-4">{t('about_team_title')}</h2>
            <p className="text-base md:text-xl text-[#77756f] max-w-2xl mx-auto">{t('about_team_subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { titleKey: 'about_team1_title' as const, descKey: 'about_team1_desc' as const },
              { titleKey: 'about_team2_title' as const, descKey: 'about_team2_desc' as const },
              { titleKey: 'about_team3_title' as const, descKey: 'about_team3_desc' as const },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center border-t border-[#dfd9cf] pt-6"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <span className="block text-sm font-semibold text-[#b08a57] mb-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl text-[#2f2f2d] mb-2">{t(item.titleKey)}</h3>
                <p className="text-[#77756f]">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
