import type { ReactNode } from 'react';
import { useLanguage, type Lang } from '../../context/LanguageContext';

type ImprintCopy = {
  title: string;
  subtitle: string;
  serviceProviderTitle: string;
  contactTitle: string;
  businessTitle: string;
  disclosureTitle: string;
  copyrightTitle: string;
  liabilityTitle: string;
  date: string;
  owner: string;
  country: string;
  phoneLabel: string;
  emailLabel: string;
  websiteLabel: string;
  glnLabel: string;
  chamberLabel: string;
  authorityLabel: string;
  activityLabel: string;
  tradeLawLabel: string;
  tradeLaw: string;
  activity: string;
  direction: string;
  copyright: string;
  images: string;
  liability: string;
  dispute: string;
};

const COPY: Record<Lang, ImprintCopy> = {
  de: {
    title: 'Impressum',
    subtitle: 'Informationen nach den geltenden österreichischen Informationspflichten.',
    serviceProviderTitle: 'Medieninhaber und Diensteanbieter',
    contactTitle: 'Kontakt',
    businessTitle: 'Unternehmensinformationen',
    disclosureTitle: 'Offenlegung nach Mediengesetz',
    copyrightTitle: 'Urheberrecht und Bildnachweise',
    liabilityTitle: 'Haftung und externe Links',
    date: 'Stand: August 2026',
    owner: 'Inhaber: Mst. Alfred Gaffal / Alfred Erwin Gaffal',
    country: 'Österreich',
    phoneLabel: 'Telefon:',
    emailLabel: 'E-Mail:',
    websiteLabel: 'Website:',
    glnLabel: 'GLN der öffentlichen Verwaltung:',
    chamberLabel: 'Mitgliedschaft:',
    authorityLabel: 'Zuständige Behörde:',
    activityLabel: 'Tätigkeitsbeschreibung:',
    tradeLawLabel: 'Berufsrechtliche Vorschriften:',
    tradeLaw: 'Gewerbeordnung 1994',
    activity: 'Handel mit Automobilen, Motorrädern inkl. Bereifung, Zubehör',
    direction:
      'Grundlegende Richtung der Website: Information über das Unternehmen Verkaufsanhänger ASEA sowie dessen Produkte, Leistungen und Kontaktmöglichkeiten.',
    copyright:
      'Die auf dieser Website erstellten Inhalte und Werke unterliegen dem österreichischen Urheberrecht. Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.',
    images:
      'Die verwendeten Produkt- und Unternehmensbilder stammen nach Projektstand überwiegend aus ASEA-Unterlagen bzw. dem bisherigen ASEA-Webauftritt. Rechte an Kundenfotos und Referenzbildern sind vor Veröffentlichung organisatorisch zu prüfen.',
    liability:
      'Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für Vollständigkeit, Aktualität und Richtigkeit kann dennoch keine Gewähr übernommen werden, soweit gesetzlich zulässig. Gesetzlich zwingende Haftung bleibt unberührt.',
    dispute:
      'Die frühere EU-Plattform zur Online-Streitbeilegung wurde eingestellt. Eine freiwillige Teilnahme an alternativen Streitbeilegungsverfahren wird auf dieser Website nicht zugesagt; eine allfällige Teilnahmebereitschaft ist vom Betreiber gesondert zu bestätigen.',
  },
  en: {
    title: 'Imprint',
    subtitle: 'Information under the applicable Austrian information obligations.',
    serviceProviderTitle: 'Media Owner and Service Provider',
    contactTitle: 'Contact',
    businessTitle: 'Business Information',
    disclosureTitle: 'Disclosure under Austrian Media Law',
    copyrightTitle: 'Copyright and Image Credits',
    liabilityTitle: 'Liability and External Links',
    date: 'Last updated: August 2026',
    owner: 'Owner: Mst. Alfred Gaffal / Alfred Erwin Gaffal',
    country: 'Austria',
    phoneLabel: 'Phone:',
    emailLabel: 'Email:',
    websiteLabel: 'Website:',
    glnLabel: 'Public administration GLN:',
    chamberLabel: 'Membership:',
    authorityLabel: 'Competent authority:',
    activityLabel: 'Business activity:',
    tradeLawLabel: 'Professional regulations:',
    tradeLaw: 'Austrian Trade Regulation Act 1994',
    activity: 'Trade in automobiles and motorcycles including tyres and accessories',
    direction:
      'General direction of the website: information about Verkaufsanhänger ASEA, its products, services and contact options.',
    copyright:
      'The content and works created for this website are subject to Austrian copyright law. Use beyond statutory limits requires prior consent from the respective rights holder.',
    images:
      'According to the project status, product and company images are mainly from ASEA materials or the previous ASEA website. Rights to customer photos and reference images must be checked organisationally before publication.',
    liability:
      'The content of this website is prepared with care. Completeness, timeliness and accuracy cannot be guaranteed to the extent permitted by law. Mandatory statutory liability remains unaffected.',
    dispute:
      'The former EU online dispute resolution platform has been discontinued. This website does not state voluntary participation in alternative dispute resolution procedures; any willingness to participate must be confirmed separately by the operator.',
  },
  sk: {
    title: 'Impresum',
    subtitle: 'Informácie podľa platných rakúskych informačných povinností.',
    serviceProviderTitle: 'Vlastník média a poskytovateľ služby',
    contactTitle: 'Kontakt',
    businessTitle: 'Informácie o podnikaní',
    disclosureTitle: 'Zverejnenie podľa rakúskeho mediálneho zákona',
    copyrightTitle: 'Autorské právo a obrazové zdroje',
    liabilityTitle: 'Zodpovednosť a externé odkazy',
    date: 'Stav: august 2026',
    owner: 'Majiteľ: Mst. Alfred Gaffal / Alfred Erwin Gaffal',
    country: 'Rakúsko',
    phoneLabel: 'Telefón:',
    emailLabel: 'E-mail:',
    websiteLabel: 'Web:',
    glnLabel: 'GLN verejnej správy:',
    chamberLabel: 'Členstvo:',
    authorityLabel: 'Príslušný orgán:',
    activityLabel: 'Opis činnosti:',
    tradeLawLabel: 'Profesijné predpisy:',
    tradeLaw: 'Rakúsky živnostenský zákon 1994',
    activity: 'Obchod s automobilmi a motocyklami vrátane pneumatík a príslušenstva',
    direction:
      'Základné zameranie webovej stránky: informácie o spoločnosti Verkaufsanhänger ASEA, jej produktoch, službách a možnostiach kontaktu.',
    copyright:
      'Obsah a diela vytvorené pre túto webovú stránku podliehajú rakúskemu autorskému právu. Použitie nad rámec zákonných limitov vyžaduje predchádzajúci súhlas príslušného držiteľa práv.',
    images:
      'Podľa stavu projektu pochádzajú produktové a firemné obrázky prevažne z materiálov ASEA alebo z predchádzajúcej webovej stránky ASEA. Práva ku klientskym fotografiám a referenčným obrázkom je potrebné organizačne skontrolovať pred zverejnením.',
    liability:
      'Obsah tejto webovej stránky je pripravovaný starostlivo. Úplnosť, aktuálnosť a správnosť však nemožno zaručiť v rozsahu povolenom zákonom. Povinná zákonná zodpovednosť zostáva nedotknutá.',
    dispute:
      'Bývalá platforma EÚ na online riešenie sporov bola ukončená. Táto webová stránka neuvádza dobrovoľnú účasť na alternatívnom riešení sporov; prípadnú ochotu zúčastniť sa musí prevádzkovateľ samostatne potvrdiť.',
  },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{title}</h2>
      <div className="space-y-3 text-[#77756f] leading-relaxed">{children}</div>
    </section>
  );
}

export function ImprintPage() {
  const { lang } = useLanguage();
  const copy = COPY[lang] ?? COPY.de;

  return (
    <div>
      <section className="relative bg-[#f8f7f3] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{copy.title}</h1>
            <p className="text-base md:text-xl text-[#77756f] leading-relaxed">{copy.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
            <Section title={copy.serviceProviderTitle}>
              <div className="space-y-1.5">
                <p className="text-[#2f2f2d] font-medium">Verkaufsanhänger ASEA</p>
                <p>{copy.owner}</p>
                <p>Lahrndorf 34</p>
                <p>4240 Waldburg</p>
                <p>{copy.country}</p>
              </div>
            </Section>

            <Section title={copy.contactTitle}>
              <p>
                <strong className="text-[#2f2f2d]">{copy.phoneLabel}</strong>{' '}
                <a href="tel:+436644105007" className="text-[#b08a57] hover:underline">
                  +43 664 410 5 007
                </a>
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.emailLabel}</strong>{' '}
                <a href="mailto:office@verkaufsanhaenger-asea.at" className="text-[#b08a57] hover:underline">
                  office@verkaufsanhaenger-asea.at
                </a>
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.websiteLabel}</strong>{' '}
                <a
                  href="https://www.verkaufsanhaenger-asea.at/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b08a57] hover:underline"
                >
                  www.verkaufsanhaenger-asea.at
                </a>
              </p>
            </Section>

            <Section title={copy.businessTitle}>
              <p>
                <strong className="text-[#2f2f2d]">{copy.glnLabel}</strong> 9110004831331
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.chamberLabel}</strong> Wirtschaftskammer Oberösterreich
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.authorityLabel}</strong> Bezirkshauptmannschaft Freistadt
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.activityLabel}</strong> {copy.activity}
              </p>
              <p>
                <strong className="text-[#2f2f2d]">{copy.tradeLawLabel}</strong>{' '}
                <a
                  href="https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b08a57] hover:underline"
                >
                  {copy.tradeLaw}
                </a>
              </p>
            </Section>

            <Section title={copy.disclosureTitle}>
              <p>{copy.direction}</p>
            </Section>

            <Section title={copy.copyrightTitle}>
              <p>{copy.copyright}</p>
              <p>{copy.images}</p>
            </Section>

            <Section title={copy.liabilityTitle}>
              <p>{copy.liability}</p>
              <p>{copy.dispute}</p>
            </Section>

            <div className="pt-6 border-t border-[#dfd9cf]">
              <p className="text-sm text-[#77756f]/60">{copy.date}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
