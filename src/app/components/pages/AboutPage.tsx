import { Target, Heart, Lightbulb, MapPin, Users, Award } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { icon: Award, titleKey: 'about_value1_title' as const, descKey: 'about_value1_desc' as const },
    { icon: Heart, titleKey: 'about_value2_title' as const, descKey: 'about_value2_desc' as const },
    { icon: Lightbulb, titleKey: 'about_value3_title' as const, descKey: 'about_value3_desc' as const },
    { icon: Users, titleKey: 'about_value4_title' as const, descKey: 'about_value4_desc' as const },
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
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{t('about_hero_title')}</h1>
            <p className="text-base md:text-xl text-[#b08a57] leading-relaxed">{t('about_hero_desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#b08a57]/20 to-transparent z-10" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762712393685-fbe773b97605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHNtYW4lMjB3b3Jrc2hvcCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI4NjMzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="ASEA Werkstatt"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 gradient-primary rounded-full blur-2xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 gradient-accent relative overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-[#b08a57]/15 rounded-full pointer-events-none" />

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="glass p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon className="text-[#2f2f2d]" size={32} />
                  </div>
                  <h3 className="text-xl text-[#2f2f2d] mb-3">{t(value.titleKey)}</h3>
                  <p className="text-[#77756f] leading-relaxed">{t(value.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="text-[#2f2f2d]" size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d]">{t('about_location_title')}</h2>
              </div>

              <div className="space-y-4 text-[#77756f] leading-relaxed mb-8">
                <p>{t('about_location_p1')}</p>
                <p>{t('about_location_p2')}</p>
              </div>

              <div className="glass p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl text-[#2f2f2d] mb-4">{t('about_contact_info_title')}</h3>
                <div className="space-y-3 text-[#77756f]">
                  <p><strong>{t('about_address_label')}</strong><br />Lahrndorf 34<br />A-4240 Waldburg, Österreich</p>
                  <p><strong>{t('about_phone_label')}</strong> +43 664 410 5 007</p>
                  <p><strong>{t('about_email_label')}</strong> office@verkaufsanhaenger-asea.at</p>
                  <p><strong>{t('about_hours_label')}</strong><br />{t('about_hours_weekday')}<br />{t('about_hours_saturday')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden h-80 lg:h-full min-h-[400px] shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Lahrndorf+34,+A-4240+Waldburg,+%C3%96sterreich&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Standort Verkaufsanhänger ASEA"
              />
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
              { icon: Users, titleKey: 'about_team1_title' as const, descKey: 'about_team1_desc' as const },
              { icon: Target, titleKey: 'about_team2_title' as const, descKey: 'about_team2_desc' as const },
              { icon: Award, titleKey: 'about_team3_title' as const, descKey: 'about_team3_desc' as const },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-[#c8a96e] to-[#b08a57] rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Icon size={48} className="text-white" />
                  </div>
                  <h3 className="text-xl text-[#2f2f2d] mb-2">{t(item.titleKey)}</h3>
                  <p className="text-[#77756f]">{t(item.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
