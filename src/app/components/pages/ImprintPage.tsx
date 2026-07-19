import { useLanguage } from '../../context/LanguageContext';

export function ImprintPage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#f8f7f3] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{t('imprint_hero_title')}</h1>
            <p className="text-base md:text-xl text-[#77756f] leading-relaxed">{t('imprint_hero_subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
            {/* Company Information */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_company_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p><strong className="text-[#2f2f2d]">Verkaufsanhänger ASEA</strong></p>
                <p>Inhaber: Mst. Alfred Gaffal</p>
                <p>Lahrndorf 34</p>
                <p>A-4240 Waldburg</p>
                <p>Österreich</p>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_contact_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p><strong className="text-[#2f2f2d]">Telefon:</strong> +43 664 410 5 007</p>
                <p><strong className="text-[#2f2f2d]">E-Mail:</strong> office@verkaufsanhaenger-asea.at</p>
                <p><strong className="text-[#2f2f2d]">Website:</strong> www.verkaufsanhaenger-asea.at</p>
              </div>
            </div>

            {/* Management */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_management_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p>Mst. Alfred Gaffal</p>
              </div>
            </div>

            {/* Register */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_register_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p><strong className="text-[#2f2f2d]">{t('imprint_firm_no')}</strong> FN 123456a</p>
                <p><strong className="text-[#2f2f2d]">{t('imprint_firm_court')}</strong> Landesgericht Wels</p>
                <p><strong className="text-[#2f2f2d]">{t('imprint_uid')}</strong> ATU12345678</p>
              </div>
            </div>

            {/* Professional */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_profession_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p><strong className="text-[#2f2f2d]">{t('imprint_chamber_label')}</strong> Wirtschaftskammer Oberösterreich</p>
                <p><strong className="text-[#2f2f2d]">{t('imprint_profession_label')}</strong> Metalltechnik / Fahrzeugbau</p>
                <p><strong className="text-[#2f2f2d]">{t('imprint_trade_reg_label')}</strong> Gewerbeordnung (GewO)</p>
                <p><strong className="text-[#2f2f2d]">{t('imprint_authority_label')}</strong> Bezirkshauptmannschaft Wels-Land</p>
              </div>
            </div>

            {/* Responsible */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_responsible_title')}</h2>
              <div className="space-y-1.5 text-[#77756f]">
                <p>Mst. Alfred Gaffal</p>
                <p>Verkaufsanhänger ASEA</p>
                <p>Lahrndorf 34</p>
                <p>A-4240 Waldburg, Österreich</p>
              </div>
            </div>

            {/* EU Dispute */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_eu_dispute_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>
                  {t('imprint_eu_dispute_text')}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b08a57] hover:underline ml-1"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p>{t('imprint_eu_dispute_email')}</p>
              </div>
            </div>

            {/* Consumer Dispute */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_consumer_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('imprint_consumer_text')}</p>
              </div>
            </div>

            {/* Copyright */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_copyright_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <p>{t('imprint_copyright_p1')}</p>
                <p>{t('imprint_copyright_p2')}</p>
                <p>{t('imprint_copyright_p3')}</p>
              </div>
            </div>

            {/* Photo Credits */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_photo_title')}</h2>
              <div className="space-y-2 text-[#77756f]">
                <p>{t('imprint_photo_text')}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{t('imprint_disclaimer_title')}</h2>
              <div className="space-y-4 text-[#77756f] leading-relaxed">
                <div>
                  <h3 className="text-lg text-[#2f2f2d] mb-2">{t('imprint_liability_content_title')}</h3>
                  <p>{t('imprint_liability_content_text')}</p>
                </div>
                <div>
                  <h3 className="text-lg text-[#2f2f2d] mb-2">{t('imprint_liability_links_title')}</h3>
                  <p>{t('imprint_liability_links_text')}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="pt-6 border-t border-[#dfd9cf]">
              <p className="text-sm text-[#77756f]/60">{t('imprint_date')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
