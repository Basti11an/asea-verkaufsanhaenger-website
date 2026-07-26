import { useLanguage } from '../../context/LanguageContext';

export function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#f8f7f3] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{t('privacy_hero_title')}</h1>
            <p className="text-base md:text-xl text-[#77756f] leading-relaxed">{t('privacy_hero_subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
            {/* Section 1 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s1_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <h3 className="text-base md:text-lg text-[#2f2f2d]">{t('privacy_s1_general_title')}</h3>
                <p>{t('privacy_s1_p1')}</p>
                <p>{t('privacy_s1_p2')}</p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s2_title')}</h2>
              <div className="space-y-6 text-[#77756f] leading-relaxed">
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s2_responsible_title')}</h3>
                  <p>{t('privacy_s2_responsible_text')}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s2_collect_title')}</h3>
                  <p>{t('privacy_s2_collect_p1')}</p>
                  <p className="mt-3">{t('privacy_s2_collect_p2')}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s2_use_title')}</h3>
                  <p>{t('privacy_s2_use_text')}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s2_rights_title')}</h3>
                  <p>{t('privacy_s2_rights_text')}</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s3_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s3_p1')}</p>
                <p>{t('privacy_s3_p2')}</p>
                <p>{t('privacy_s3_p3')}</p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s4_title')}</h2>
              <div className="space-y-6 text-[#77756f] leading-relaxed">
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s4_privacy_title')}</h3>
                  <p>{t('privacy_s4_privacy_p1')}</p>
                  <p className="mt-3">{t('privacy_s4_privacy_p2')}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s4_responsible_title')}</h3>
                  <p>{t('privacy_s4_responsible_intro')}</p>
                  <div className="mt-3 p-4 bg-[#f8f7f3] rounded-lg border border-[#dfd9cf]">
                    <p className="text-[#2f2f2d]">{t('legal_company_name')}</p>
                    <p>{t('legal_owner_line')}</p>
                    <p>Lahrndorf 34</p>
                    <p>A-4240 Waldburg, {t('contact_country')}</p>
                    <p className="mt-2">{t('legal_phone_label')} +43 664 410 5 007</p>
                    <p>{t('legal_email_label')} office@verkaufsanhaenger-asea.at</p>
                  </div>
                  <p className="mt-3">{t('privacy_s4_responsible_outro')}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-[#2f2f2d] mb-3">{t('privacy_s4_storage_title')}</h3>
                  <p>{t('privacy_s4_storage_text')}</p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s5_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s5_intro')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(['privacy_s5_right1', 'privacy_s5_right2', 'privacy_s5_right3', 'privacy_s5_right4', 'privacy_s5_right5', 'privacy_s5_right6', 'privacy_s5_right7'] as const).map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ul>
                <p className="mt-4">{t('privacy_s5_contact')}</p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s6_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s6_p1')}</p>
                <p>{t('privacy_s6_p2')}</p>
                <p>{t('privacy_s6_p3')}</p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s7_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s7_p1')}</p>
                <p>{t('privacy_s7_p2')}</p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s8_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s8_p1')}</p>
                <p>{t('privacy_s8_p2')}</p>
                <p>{t('privacy_s8_p3')}</p>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s9_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s9_p1')}</p>
                <p>{t('privacy_s9_p2')}</p>
                <p>{t('privacy_s9_p3')}</p>
              </div>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('privacy_s10_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('privacy_s10_text')}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-[#dfd9cf]">
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6">{t('privacy_contact_title')}</h2>
              <div className="bg-[#f3efe8] border border-[#b08a57]/20 p-5 md:p-6 rounded-xl">
                <p className="text-[#77756f] mb-4">{t('privacy_contact_text')}</p>
                <div className="text-[#77756f] space-y-1">
                  <p className="text-[#2f2f2d] font-medium">{t('legal_company_name')}</p>
                  <p>Mst. Alfred Gaffal</p>
                  <p>Lahrndorf 34, A-4240 Waldburg</p>
                  <p>{t('legal_email_label')} office@verkaufsanhaenger-asea.at</p>
                  <p>{t('legal_phone_label')} +43 664 410 5 007</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="pt-4">
              <p className="text-sm text-[#77756f]/60">{t('privacy_date')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
