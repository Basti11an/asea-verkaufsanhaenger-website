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
          'Diese Website nutzt Supabase für freigegebene Kundenreferenzen, neu eingereichte Referenzen, Kontaktanfragen und den geschützten Admin-Login.',
          'Referenzeinreichungen können Name/Firma, Ort, Anhängermodell, Jahr, Beschreibung, E-Mail, Telefonnummer und optional einen Bildlink enthalten. Neue Referenzen werden zunächst nicht öffentlich angezeigt und erst nach Prüfung im Adminbereich freigegeben.',
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
        title: 'Kundenverwaltung und Bewertungs-Follow-up',
        paragraphs: [
          'Nach einem tatsächlichen Verkauf kann ASEA Kundendaten wie Name, E-Mail-Adresse, Kaufdatum, gekauftes Produkt und interne Notizen im geschützten Adminbereich verwalten. Normale Kontaktformular-Absender werden dadurch nicht automatisch zu Kunden.',
          'Wenn eine zulässige Versandberechtigung dokumentiert ist, kann das System zeitlich gestaffelte Zufriedenheits- und Bewertungsanfragen vorbereiten. Ohne dokumentierte Berechtigung, nach Widerspruch, nach vorhandener Bewertung oder nach manueller Deaktivierung werden keine automatischen Bewertungsmails versendet.',
          'Zur internen Zuordnung kann die E-Mail-Adresse aus einer eingereichten Bewertung mit Kundendaten verglichen werden. Diese E-Mail-Adresse wird nicht öffentlich angezeigt und nicht in öffentlichen Ausgaben oder URLs verwendet.',
          'Jede automatische Bewertungsanfrage enthält einen Abmeldelink mit zufälligem Token. In der Datenbank wird nur der Hash dieses Tokens gespeichert. Der Betreiber muss Rechtsgrundlage, Einwilligungstexte, Speicherdauer und eingesetzten E-Mail-Dienstleister organisatorisch prüfen und dokumentieren.',
        ],
      },
      {
        title: 'Statistik und lokaler Speicher',
        paragraphs: [
          'Die Statistik ist optional. Sie startet erst, wenn Sie Statistik in den Datenschutzeinstellungen erlauben. Aktuell wird dafür Vercel Web Analytics für die allgemeine Auswertung von Seitenaufrufen eingebunden.',
        ],
        bullets: [
          'asea-lang: lokale Spracheinstellung im localStorage, technisch zweckmäßig, bis zur Änderung oder Löschung im Browser',
          'asea-privacy-consent: gewählte Datenschutzeinstellung im localStorage, technisch erforderlich zur Speicherung Ihrer Entscheidung',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps wird auf dieser Website erst nach Ihrer Einwilligung geladen. Diese Einwilligung kann über „Alle akzeptieren" im Datenschutzbanner oder über den Button direkt im Kartenbereich erfolgen.',
          'Beim Laden der Karte kann Google Ireland Limited personenbezogene Daten wie Ihre IP-Adresse und technische Zugriffsdaten verarbeiten; eine Übermittlung in die USA kann nicht ausgeschlossen werden. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie § 165 TKG 2021.',
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
          'This website uses Supabase for approved customer references, newly submitted references, contact requests and protected admin login.',
          'Reference submissions may contain name/company, place, trailer model, year, description, email address, phone number and optionally an image link. New references are initially not public and are only published after review in the admin area.',
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
        title: 'Customer Management and Review Follow-up',
        paragraphs: [
          'After an actual sale, ASEA may manage customer data such as name, email address, purchase date, purchased product and internal notes in the protected admin area. Normal contact form senders are not automatically turned into customers.',
          'If a lawful sending permission is documented, the system can prepare staged satisfaction and review requests. Without documented permission, after opt-out, after an existing review or after manual deactivation, no automatic review emails are sent.',
          'For internal matching, the email address from a submitted review may be compared with customer data. This email address is not displayed publicly and is not used in public output or URLs.',
          'Every automatic review request contains an unsubscribe link with a random token. Only the hash of this token is stored in the database. The operator must organisationally review and document the legal basis, consent texts, retention period and email service provider used.',
        ],
      },
      {
        title: 'Statistics and Local Storage',
        paragraphs: [
          'Statistics are optional. They only start after you allow statistics in the privacy settings. Currently, Vercel Web Analytics is included for general page-view analysis.',
        ],
        bullets: [
          'asea-lang: local language preference in localStorage, technically useful, until changed or deleted in the browser',
          'asea-privacy-consent: selected privacy setting in localStorage, technically necessary to store your choice',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps is loaded on this website only after your consent. Consent can be given via “Accept all" in the privacy banner or via the button directly in the map area.',
          'When the map is loaded, Google Ireland Limited may process personal data such as your IP address and technical access data; transfer to the USA cannot be excluded. The legal basis is your consent under Art. 6(1)(a) GDPR and § 165 Austrian Telecommunications Act 2021.',
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
          'Táto webová stránka používa Supabase pre schválené zákaznícke referencie, novo odoslané referencie, kontaktné požiadavky a chránené prihlásenie do administrácie.',
          'Odoslané referencie môžu obsahovať meno/firmu, miesto, model prívesu, rok, popis, e-mail, telefónne číslo a voliteľne odkaz na obrázok. Nové referencie nie sú najskôr verejné a zverejnia sa až po kontrole v administrácii.',
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
        title: 'Správa zákazníkov a následné hodnotenia',
        paragraphs: [
          'Po skutočnom predaji môže ASEA spravovať údaje zákazníka, napríklad meno, e-mailovú adresu, dátum nákupu, zakúpený produkt a interné poznámky v chránenom administračnom priestore. Odosielatelia bežného kontaktného formulára sa automaticky nestávajú zákazníkmi.',
          'Ak je zdokumentované povolenie na odosielanie, systém môže pripraviť postupné otázky spokojnosti a žiadosti o hodnotenie. Bez zdokumentovaného povolenia, po odmietnutí, po existujúcom hodnotení alebo po manuálnej deaktivácii sa automatické e-maily s hodnotením neodosielajú.',
          'Na interné priradenie sa môže e-mailová adresa z odoslaného hodnotenia porovnať s údajmi zákazníka. Táto e-mailová adresa sa verejne nezobrazuje a nepoužíva sa vo verejných výstupoch ani v URL.',
          'Každá automatická žiadosť o hodnotenie obsahuje odhlasovací odkaz s náhodným tokenom. V databáze sa ukladá iba hash tohto tokenu. Prevádzkovateľ musí organizačne skontrolovať a zdokumentovať právny základ, texty súhlasu, dobu uchovávania a použitého e-mailového poskytovateľa.',
        ],
      },
      {
        title: 'Štatistika a lokálne úložisko',
        paragraphs: [
          'Štatistiky sú voliteľné. Spustia sa až po vašom povolení v nastaveniach ochrany údajov. Aktuálne sa používa Vercel Web Analytics na všeobecnú analýzu zobrazení stránok.',
        ],
        bullets: [
          'asea-lang: lokálne nastavenie jazyka v localStorage, technicky účelné, do zmeny alebo vymazania v prehliadači',
          'asea-privacy-consent: zvolené nastavenie ochrany údajov v localStorage, technicky potrebné na uloženie vášho rozhodnutia',
        ],
      },
      {
        title: 'Google Maps',
        paragraphs: [
          'Google Maps sa na tejto webovej stránke načíta až po vašom súhlase. Súhlas je možné udeliť cez „Prijať všetko" v banneri ochrany údajov alebo tlačidlom priamo v oblasti mapy.',
          'Pri načítaní mapy môže Google Ireland Limited spracúvať osobné údaje, napríklad vašu IP adresu a technické prístupové údaje; prenos do USA nemožno vylúčiť. Právnym základom je váš súhlas podľa čl. 6 ods. 1 písm. a GDPR a § 165 rakúskeho TKG 2021.',
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
