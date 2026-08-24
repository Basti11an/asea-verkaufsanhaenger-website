import type { ReactNode } from 'react';
import { useLanguage, type Lang } from '../../context/LanguageContext';

type PrivacySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type PrivacyCopy = {
  title: string;
  subtitle: string;
  controllerTitle: string;
  controllerIntro: string;
  phoneLabel: string;
  emailLabel: string;
  rightsTitle: string;
  rightsIntro: string;
  rights: string[];
  authority: string;
  date: string;
  sections: PrivacySection[];
};

const COPY: Record<Lang, PrivacyCopy> = {
  de: {
    title: 'Datenschutzerklärung',
    subtitle: 'Konkrete Informationen zur Datenverarbeitung auf dieser ASEA-Website.',
    controllerTitle: 'Verantwortlicher',
    controllerIntro: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:',
    phoneLabel: 'Telefon:',
    emailLabel: 'E-Mail:',
    rightsTitle: 'Ihre Rechte',
    rightsIntro: 'Sie haben nach Maßgabe der DSGVO insbesondere folgende Rechte:',
    rights: [
      'Auskunft über die verarbeiteten personenbezogenen Daten',
      'Berichtigung unrichtiger oder unvollständiger Daten',
      'Löschung, soweit keine gesetzlichen Aufbewahrungs- oder Nachweispflichten entgegenstehen',
      'Einschränkung der Verarbeitung',
      'Datenübertragbarkeit, soweit anwendbar',
      'Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen',
      'Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft',
    ],
    authority:
      'Sie können sich außerdem bei der Österreichischen Datenschutzbehörde, Barichgasse 40-42, 1030 Wien, dsb@dsb.gv.at, beschweren.',
    date: 'Stand: August 2026',
    sections: [
      {
        title: 'Überblick',
        paragraphs: [
          'Diese Erklärung beschreibt nur die Datenverarbeitungen, die nach dem aktuellen technischen Stand dieser Website tatsächlich vorgesehen sind.',
          'Es werden keine Google-Analytics-, Meta-Pixel-, Google-Ads-, Newsletter-, Zahlungs- oder externen KI-Dienste eingebunden.',
        ],
      },
      {
        title: 'Hosting über Vercel',
        paragraphs: [
          'Die Website wird über Vercel bereitgestellt. Beim Aufruf der Website verarbeitet Vercel technisch notwendige Zugriffsdaten wie IP-Adresse, angeforderte Adresse, Zeitpunkt, Statuscode und technische Request-Metadaten, damit die Website sicher und stabil ausgeliefert werden kann.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: unser berechtigtes Interesse an einer sicheren, schnellen und zuverlässigen Bereitstellung der Website. Eine Verarbeitung außerhalb der EU/des EWR kann je nach Vercel-Infrastruktur nicht ausgeschlossen werden. Der Betreiber muss sicherstellen, dass ein passender Auftragsverarbeitungsvertrag und geeignete Transfermechanismen bestehen.',
        ],
      },
      {
        title: 'Supabase',
        paragraphs: [
          'Diese Website nutzt Supabase für freigegebene Kundenreferenzen, neu eingereichte Referenzen, Kontaktanfragen, den geschützten Admin-Login und aggregierte interne Statistikdaten, sofern Statistik erlaubt wurde.',
          'Referenzeinreichungen können Name/Firma, Ort, Anhängermodell, Jahr, Beschreibung, E-Mail, Telefonnummer und optional einen Bildlink enthalten. Neue Referenzen werden zunächst nicht öffentlich angezeigt und erst nach Prüfung im Adminbereich freigegeben.',
          'Die Tabellen für interne Statistiken speichern nur zusammengefasste Tageswerte, Seiten, Modellaufrufe, Sprache, Gerätetyp und Herkunftskategorie. IP-Adressen, vollständige Referrer-URLs, Mausbewegungen, Scrollpositionen oder dauerhafte Nutzerprofile werden dort nicht gespeichert.',
          'Rechtsgrundlagen sind je nach Verarbeitung Art. 6 Abs. 1 lit. b DSGVO für angefragte Leistungen, Art. 6 Abs. 1 lit. f DSGVO für Betrieb, Sicherheit und Adminverwaltung sowie Art. 6 Abs. 1 lit. a DSGVO für optionale Statistik. Der Betreiber muss die Supabase-Region, Auftragsverarbeitung, Unterauftragsverarbeiter und Löschfristen organisatorisch bestätigen.',
        ],
      },
      {
        title: 'Kontaktformular, E-Mail und Telefon',
        paragraphs: [
          'Wenn Sie ASEA per Formular, E-Mail oder Telefon kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage und für mögliche Anschlussfragen verarbeitet. Name, E-Mail und Nachricht sind für eine Formularanfrage erforderlich; die Telefonnummer ist optional.',
          'Das Kontaktformular speichert die Anfrage in Supabase, damit sie im geschützten Adminbereich bearbeitet und dokumentiert werden kann. Zusätzlich werden über EmailJS eine interne Benachrichtigung und eine Bestätigung an die angegebene Kunden-E-Mail ausgelöst.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche oder vertragliche Anfragen, sonst Art. 6 Abs. 1 lit. f DSGVO für die sachliche Bearbeitung eingehender Kommunikation. Die Daten werden nur so lange aufbewahrt, wie es für die Bearbeitung, Nachweise oder gesetzliche Pflichten erforderlich ist.',
        ],
      },
      {
        title: 'Kundenreferenzen',
        paragraphs: [
          'Über das Referenzformular können Kundenerfahrungen eingereicht werden. Diese Daten werden bei Supabase gespeichert und im Adminbereich geprüft.',
          'Öffentlich angezeigt werden nur Referenzen, die im Adminbereich freigegeben und sichtbar geschaltet wurden. Vor der Veröffentlichung von personenbezogenen Angaben, Bildern, Kennzeichen oder erkennbaren Personen muss der Betreiber die erforderlichen Rechte und Einwilligungen organisatorisch sicherstellen.',
        ],
      },
      {
        title: 'Statistik und lokaler Speicher',
        paragraphs: [
          'Die interne Statistik ist optional. Sie startet erst, wenn Sie Statistik in den Datenschutzeinstellungen erlauben. Dabei werden nur aggregierte Zähler an Supabase gesendet, etwa Seitenaufrufe, Modellaufrufe, ausgewählte Sprache, einfacher Gerätetyp und Herkunftskategorie.',
          'Zur Vermeidung mehrfacher Besucherzählungen innerhalb einer Sitzung nutzt die Website eine anonyme Sitzungskennung im sessionStorage. Diese Kennung wird nicht an Supabase übertragen und endet grundsätzlich mit der Browsersitzung.',
        ],
        bullets: [
          'asea-lang: lokale Spracheinstellung im localStorage, technisch zweckmäßig, bis zur Änderung oder Löschung im Browser',
          'asea-privacy-consent: gewählte Datenschutzeinstellung im localStorage, technisch erforderlich zur Speicherung Ihrer Entscheidung',
          'asea-analytics-session-id und zugehörige Tagesmarkierung: anonyme Sitzungszählung im sessionStorage, nur bei erlaubter Statistik',
          'asea-analytics-source: grobe Herkunftskategorie im sessionStorage, nur bei erlaubter Statistik',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps wird auf dieser Website nicht automatisch geladen. Stattdessen erscheint zunächst ein lokaler Hinweis. Erst wenn Sie die Karte aktiv laden, wird eine Verbindung zu Google hergestellt.',
          'Beim Laden der Karte kann Google Ireland Limited personenbezogene Daten wie Ihre IP-Adresse und technische Zugriffsdaten verarbeiten; eine Übermittlung in die USA kann nicht ausgeschlossen werden. Rechtsgrundlage für das aktive Laden ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie § 165 TKG 2021.',
        ],
      },
      {
        title: 'Sicherheit und Verschlüsselung',
        paragraphs: [
          'Die Website wird über HTTPS ausgeliefert. Zusätzlich werden Eingaben im Frontend begrenzt und Formulare mit einem einfachen Honeypot-Feld gegen automatisierten Missbrauch geschützt, ohne zusätzliche Tracking-Dienste einzubinden.',
          'Technische und organisatorische Maßnahmen werden laufend an den tatsächlichen Betrieb angepasst. Bestehende gesetzliche Dokumentations-, Lösch- und Nachweispflichten bleiben zu beachten.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'Specific information on data processing on this ASEA website.',
    controllerTitle: 'Controller',
    controllerIntro: 'The controller responsible for data processing on this website is:',
    phoneLabel: 'Phone:',
    emailLabel: 'Email:',
    rightsTitle: 'Your Rights',
    rightsIntro: 'Under the GDPR, you have in particular the following rights:',
    rights: [
      'Access to personal data processed about you',
      'Rectification of inaccurate or incomplete data',
      'Erasure, unless statutory retention or evidence obligations apply',
      'Restriction of processing',
      'Data portability, where applicable',
      'Objection to processing based on legitimate interests',
      'Withdrawal of consent with effect for the future',
    ],
    authority:
      'You may also lodge a complaint with the Austrian Data Protection Authority, Barichgasse 40-42, 1030 Vienna, dsb@dsb.gv.at.',
    date: 'Last updated: August 2026',
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          'This policy describes only the processing activities that are actually intended according to the current technical status of this website.',
          'No Google Analytics, Meta Pixel, Google Ads, newsletter, payment or external AI services are embedded.',
        ],
      },
      {
        title: 'Hosting via Vercel',
        paragraphs: [
          'The website is provided through Vercel. When the website is accessed, Vercel processes technically necessary access data such as IP address, requested address, time, status code and technical request metadata so that the website can be delivered securely and reliably.',
          'The legal basis is Art. 6(1)(f) GDPR: our legitimate interest in secure, fast and reliable website delivery. Processing outside the EU/EEA cannot be excluded depending on Vercel infrastructure. The operator must ensure that a suitable data processing agreement and transfer mechanisms are in place.',
        ],
      },
      {
        title: 'Supabase',
        paragraphs: [
          'This website uses Supabase for approved customer references, newly submitted references, contact requests, protected admin login and aggregated internal statistics where statistics have been allowed.',
          'Reference submissions may contain name/company, place, trailer model, year, description, email address, phone number and optionally an image link. New references are initially not public and are only published after review in the admin area.',
          'The internal statistics tables store only aggregated daily values, pages, model views, language, device type and source category. IP addresses, full referrer URLs, mouse movements, scroll positions or permanent user profiles are not stored there.',
          'Depending on the processing activity, the legal bases are Art. 6(1)(b) GDPR for requested services, Art. 6(1)(f) GDPR for operation, security and admin management, and Art. 6(1)(a) GDPR for optional statistics. The operator must confirm the Supabase region, data processing agreement, subprocessors and retention periods organisationally.',
        ],
      },
      {
        title: 'Contact Form, Email and Phone',
        paragraphs: [
          'If you contact ASEA by form, email or phone, your details are processed to handle the request and possible follow-up questions. Name, email and message are required for a form enquiry; the phone number is optional.',
          'The contact form stores the enquiry in Supabase so that it can be processed and documented in the protected admin area. In addition, EmailJS triggers an internal notification and a confirmation to the customer email address provided.',
          'The legal basis is Art. 6(1)(b) GDPR for pre-contractual or contractual enquiries, otherwise Art. 6(1)(f) GDPR for proper handling of incoming communication. Data is retained only as long as necessary for processing, evidence or statutory obligations.',
        ],
      },
      {
        title: 'Customer References',
        paragraphs: [
          'Customer experiences can be submitted via the reference form. These data are stored in Supabase and reviewed in the admin area.',
          'Only references approved and marked visible in the admin area are displayed publicly. Before publishing personal details, images, licence plates or recognisable persons, the operator must ensure the required rights and consents organisationally.',
        ],
      },
      {
        title: 'Statistics and Local Storage',
        paragraphs: [
          'Internal statistics are optional. They only start after you allow statistics in the privacy settings. Only aggregated counters are sent to Supabase, such as page views, model views, selected language, basic device type and source category.',
          'To avoid counting the same visitor repeatedly within a session, the website uses an anonymous session identifier in sessionStorage. This identifier is not sent to Supabase and generally ends with the browser session.',
        ],
        bullets: [
          'asea-lang: local language preference in localStorage, technically useful, until changed or deleted in the browser',
          'asea-privacy-consent: selected privacy setting in localStorage, technically necessary to store your choice',
          'asea-analytics-session-id and related daily marker: anonymous session counting in sessionStorage, only if statistics are allowed',
          'asea-analytics-source: broad source category in sessionStorage, only if statistics are allowed',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps is not loaded automatically on this website. A local notice is shown first. A connection to Google is only established after you actively load the map.',
          'When the map is loaded, Google Ireland Limited may process personal data such as your IP address and technical access data; transfer to the USA cannot be excluded. The legal basis for active loading is your consent under Art. 6(1)(a) GDPR and § 165 Austrian Telecommunications Act 2021.',
        ],
      },
      {
        title: 'Security and Encryption',
        paragraphs: [
          'The website is delivered via HTTPS. Inputs are also limited in the frontend and forms are protected by a simple honeypot field against automated misuse without adding additional tracking services.',
          'Technical and organisational measures are adapted to actual operation on an ongoing basis. Existing statutory documentation, deletion and evidence obligations remain to be observed.',
        ],
      },
    ],
  },
  sk: {
    title: 'Zásady ochrany osobných údajov',
    subtitle: 'Konkrétne informácie o spracúvaní údajov na tejto webovej stránke ASEA.',
    controllerTitle: 'Prevádzkovateľ',
    controllerIntro: 'Za spracúvanie údajov na tejto webovej stránke zodpovedá:',
    phoneLabel: 'Telefón:',
    emailLabel: 'E-mail:',
    rightsTitle: 'Vaše práva',
    rightsIntro: 'Podľa GDPR máte najmä tieto práva:',
    rights: [
      'Prístup k spracúvaným osobným údajom',
      'Oprava nesprávnych alebo neúplných údajov',
      'Vymazanie, pokiaľ neexistujú zákonné povinnosti uchovávania alebo dokazovania',
      'Obmedzenie spracúvania',
      'Prenosnosť údajov, ak je uplatniteľná',
      'Namietať proti spracúvaniu na základe oprávnených záujmov',
      'Odvolať udelený súhlas s účinkom do budúcnosti',
    ],
    authority:
      'Sťažnosť môžete podať aj rakúskemu úradu pre ochranu údajov: Österreichische Datenschutzbehörde, Barichgasse 40-42, 1030 Viedeň, dsb@dsb.gv.at.',
    date: 'Stav: august 2026',
    sections: [
      {
        title: 'Prehľad',
        paragraphs: [
          'Tieto zásady opisujú iba spracúvania, ktoré sú podľa aktuálneho technického stavu tejto webovej stránky skutočne plánované.',
          'Nie sú vložené služby Google Analytics, Meta Pixel, Google Ads, newsletter, platobné služby ani externé služby umelej inteligencie.',
        ],
      },
      {
        title: 'Hosting cez Vercel',
        paragraphs: [
          'Webová stránka je poskytovaná cez Vercel. Pri otvorení stránky Vercel spracúva technicky potrebné prístupové údaje, napríklad IP adresu, požadovanú adresu, čas, stavový kód a technické metadáta požiadavky, aby mohla byť stránka doručená bezpečne a spoľahlivo.',
          'Právnym základom je čl. 6 ods. 1 písm. f GDPR: náš oprávnený záujem na bezpečnom, rýchlom a spoľahlivom poskytovaní webovej stránky. V závislosti od infraštruktúry Vercel nemožno vylúčiť spracúvanie mimo EÚ/EHP. Prevádzkovateľ musí zabezpečiť vhodnú zmluvu o spracúvaní údajov a mechanizmy prenosu.',
        ],
      },
      {
        title: 'Supabase',
        paragraphs: [
          'Táto webová stránka používa Supabase pre schválené zákaznícke referencie, novo odoslané referencie, kontaktné požiadavky, chránené prihlásenie do administrácie a agregované interné štatistiky, ak boli štatistiky povolené.',
          'Odoslané referencie môžu obsahovať meno/firmu, miesto, model prívesu, rok, popis, e-mail, telefónne číslo a voliteľne odkaz na obrázok. Nové referencie nie sú najskôr verejné a zverejnia sa až po kontrole v administrácii.',
          'Interné štatistické tabuľky ukladajú iba súhrnné denné hodnoty, stránky, zobrazenia modelov, jazyk, typ zariadenia a kategóriu zdroja. IP adresy, úplné referrer URL, pohyby myši, pozície rolovania ani trvalé používateľské profily sa tam neukladajú.',
          'Právnym základom je podľa typu spracúvania čl. 6 ods. 1 písm. b GDPR pre požadované služby, čl. 6 ods. 1 písm. f GDPR pre prevádzku, bezpečnosť a správu administrácie a čl. 6 ods. 1 písm. a GDPR pre voliteľné štatistiky. Prevádzkovateľ musí organizačne potvrdiť región Supabase, zmluvu o spracúvaní, subdodávateľov a lehoty uchovávania.',
        ],
      },
      {
        title: 'Kontaktný formulár, e-mail a telefón',
        paragraphs: [
          'Ak kontaktujete ASEA formulárom, e-mailom alebo telefonicky, vaše údaje sa spracúvajú na vybavenie požiadavky a prípadných doplňujúcich otázok. Meno, e-mail a správa sú pri formulári potrebné; telefónne číslo je voliteľné.',
          'Kontaktný formulár ukladá požiadavku v Supabase, aby ju bolo možné spracovať a zdokumentovať v chránenom administračnom priestore. EmailJS zároveň odošle interné upozornenie a potvrdenie na uvedenú e-mailovú adresu zákazníka.',
          'Právnym základom je čl. 6 ods. 1 písm. b GDPR pre predzmluvné alebo zmluvné požiadavky, inak čl. 6 ods. 1 písm. f GDPR pre vecné spracovanie prichádzajúcej komunikácie. Údaje sa uchovávajú len tak dlho, ako je potrebné na spracovanie, dôkazné účely alebo zákonné povinnosti.',
        ],
      },
      {
        title: 'Zákaznícke referencie',
        paragraphs: [
          'Zákaznícke skúsenosti je možné odoslať cez referenčný formulár. Tieto údaje sa ukladajú v Supabase a kontrolujú sa v administrácii.',
          'Verejne sa zobrazujú iba referencie schválené a označené ako viditeľné v administrácii. Pred zverejnením osobných údajov, obrázkov, evidenčných čísel alebo rozpoznateľných osôb musí prevádzkovateľ organizačne zabezpečiť potrebné práva a súhlasy.',
        ],
      },
      {
        title: 'Štatistika a lokálne úložisko',
        paragraphs: [
          'Interné štatistiky sú voliteľné. Spustia sa až po vašom povolení v nastaveniach ochrany údajov. Do Supabase sa posielajú iba agregované počítadlá, napríklad zobrazenia stránok, zobrazenia modelov, zvolený jazyk, jednoduchý typ zariadenia a kategória zdroja.',
          'Aby sa zabránilo opakovanému započítaniu toho istého návštevníka v rámci jednej relácie, webová stránka používa anonymný identifikátor relácie v sessionStorage. Tento identifikátor sa neposiela do Supabase a spravidla končí s reláciou prehliadača.',
        ],
        bullets: [
          'asea-lang: lokálne nastavenie jazyka v localStorage, technicky účelné, do zmeny alebo vymazania v prehliadači',
          'asea-privacy-consent: zvolené nastavenie ochrany údajov v localStorage, technicky potrebné na uloženie vášho rozhodnutia',
          'asea-analytics-session-id a súvisiace denné označenie: anonymné počítanie relácie v sessionStorage, iba ak sú povolené štatistiky',
          'asea-analytics-source: hrubá kategória zdroja v sessionStorage, iba ak sú povolené štatistiky',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps sa na tejto webovej stránke nenačíta automaticky. Najprv sa zobrazí lokálne upozornenie. Spojenie so spoločnosťou Google sa vytvorí až po aktívnom načítaní mapy.',
          'Pri načítaní mapy môže Google Ireland Limited spracúvať osobné údaje, napríklad vašu IP adresu a technické prístupové údaje; prenos do USA nemožno vylúčiť. Právnym základom aktívneho načítania je váš súhlas podľa čl. 6 ods. 1 písm. a GDPR a § 165 rakúskeho TKG 2021.',
        ],
      },
      {
        title: 'Bezpečnosť a šifrovanie',
        paragraphs: [
          'Webová stránka sa doručuje cez HTTPS. Vstupy sú zároveň obmedzené vo frontende a formuláre sú chránené jednoduchým honeypot poľom proti automatizovanému zneužitiu bez pridania ďalších sledovacích služieb.',
          'Technické a organizačné opatrenia sa priebežne prispôsobujú skutočnej prevádzke. Existujúce zákonné povinnosti dokumentácie, vymazania a dokazovania zostávajú zachované.',
        ],
      },
    ],
  },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl text-[#2f2f2d] mb-4 md:mb-6 pb-2 border-b border-[#dfd9cf]">{title}</h2>
      <div className="space-y-4 text-[#77756f] leading-relaxed">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
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
            <Section title={copy.controllerTitle}>
              <p>{copy.controllerIntro}</p>
              <div className="mt-3 p-4 bg-[#f8f7f3] rounded-lg border border-[#dfd9cf] space-y-1.5">
                <p className="text-[#2f2f2d] font-medium">Verkaufsanhänger ASEA</p>
                <p>Inhaber: Mst. Alfred Gaffal / Alfred Erwin Gaffal</p>
                <p>Lahrndorf 34</p>
                <p>4240 Waldburg, Österreich</p>
                <p className="pt-2">
                  {copy.phoneLabel}{' '}
                  <a href="tel:+436644105007" className="text-[#b08a57] hover:underline">
                    +43 664 410 5 007
                  </a>
                </p>
                <p>
                  {copy.emailLabel}{' '}
                  <a href="mailto:office@verkaufsanhaenger-asea.at" className="text-[#b08a57] hover:underline">
                    office@verkaufsanhaenger-asea.at
                  </a>
                </p>
              </div>
            </Section>

            {copy.sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </Section>
            ))}

            <Section title={copy.rightsTitle}>
              <p>{copy.rightsIntro}</p>
              <ul className="list-disc pl-5 space-y-2">
                {copy.rights.map((right) => (
                  <li key={right}>{right}</li>
                ))}
              </ul>
              <p>{copy.authority}</p>
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
