import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { getRevealAnimate, getRevealInitial, useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';
import { GoogleMapsEmbed } from '../GoogleMapsEmbed';

export function AboutPage() {
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();

  const teamMembers = [
    {
      image: '/about-team-alfred-placeholder.png',
      nameKey: 'about_team_member1_name' as const,
      roleKey: 'about_team_member1_role' as const,
      descKey: 'about_team_member1_desc' as const,
    },
    {
      image: '/about-team-florian-placeholder.png',
      nameKey: 'about_team_member2_name' as const,
      roleKey: 'about_team_member2_role' as const,
      descKey: 'about_team_member2_desc' as const,
    },
    {
      image: '/about-team-lukas-placeholder.png',
      nameKey: 'about_team_member3_name' as const,
      roleKey: 'about_team_member3_role' as const,
      descKey: 'about_team_member3_desc' as const,
    },
    {
      image: '/about-team-sarah-placeholder.png',
      nameKey: 'about_team_member4_name' as const,
      roleKey: 'about_team_member4_role' as const,
      descKey: 'about_team_member4_desc' as const,
    },
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
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-4 md:mb-6">{t('about_story_title')}</h1>
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

      {/* Team Section */}
      <section className="bg-[#f8f7f3] py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9a7445]">
              {t('about_team_eyebrow')}
            </p>
            <div className="mx-auto mt-5 h-px w-12 bg-[#b08a57]" />
            <h2 className="mt-6 text-3xl font-light leading-tight text-[#2f2f2d] md:text-5xl lg:text-6xl">
              {t('about_team_title')}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#77756f] md:text-lg">
              {t('about_team_intro')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-9 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {teamMembers.map((member) => (
              <article key={member.nameKey} className="text-center">
                <div className="mx-auto h-44 w-44 overflow-hidden rounded-full bg-[#e8e1d6] md:h-52 md:w-52 lg:h-56 lg:w-56">
                  <ImageWithFallback
                    src={member.image}
                    alt={t(member.nameKey)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 text-xl font-medium leading-tight text-[#2f2f2d] md:text-2xl">
                  {t(member.nameKey)}
                </h3>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#77756f]">
                  {t(member.roleKey)}
                </p>
                <div className="mx-auto mt-4 h-px w-10 bg-[#b08a57]/55" />
                <p className="mx-auto mt-4 max-w-[17rem] text-sm leading-relaxed text-[#77756f]">
                  {t(member.descKey)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 overflow-hidden rounded-md bg-[#e8e1d6] md:mt-20">
            <div className="aspect-[16/6] min-h-[210px] md:aspect-[24/7]">
              <ImageWithFallback
                src="/about-team-group-placeholder.png"
                alt={t('about_team_group_alt')}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9a7445]">
                {t('about_team_group_eyebrow')}
              </p>
              <div className="mt-5 h-px w-12 bg-[#b08a57]" />
              <h3 className="mt-6 text-2xl font-light leading-tight text-[#2f2f2d] md:text-3xl">
                {t('about_team_group_title')}
              </h3>
            </div>
            <p className="text-base leading-relaxed text-[#77756f] md:text-lg">
              {t('about_team_group_desc')}
            </p>
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
    </div>
  );
}
