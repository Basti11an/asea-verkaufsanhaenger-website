import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const sourceHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
const siteOrigin = 'https://asea-anhaenger.com';
const ogImage = `${siteOrigin}/images/asea-startseite-verkaufsanhaenger.jpg`;

const basePaths = {
  home: '/', models: '/modelle', equipment: '/ausstattung', about: '/ueber-uns', contact: '/kontakt',
  reviews: '/bewertungen', configurator: '/konfigurator', imprint: '/impressum', privacy: '/datenschutz',
};

const pages = {
  de: {
    home: ['Verkaufsanhänger kaufen | ASEA Oberösterreich', 'Hochwertige Verkaufsanhänger, Kühlanhänger und Messeanhänger von ASEA. Individuelle Ausstattung, persönliche Beratung und umfassender Service. Jetzt entdecken!', 'Verkaufsanhänger aus Oberösterreich', 'ASEA bietet Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger mit persönlicher Beratung und direktem Kontakt.'],
    models: ['Verkaufsanhänger & Modelle | ASEA', 'Entdecken Sie Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger von ASEA. Persönlich beraten und direkt abgestimmt.', 'Verkaufsanhänger und Modelle', 'Entdecken Sie Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger von ASEA.'],
    equipment: ['Ausstattung für Verkaufsanhänger | ASEA', 'Entdecken Sie Ausstattungsoptionen und individuelle Lösungen für Ihren Verkaufsanhänger von ASEA.', 'Ausstattung für Verkaufsanhänger', 'Welche Ausstattung sinnvoll ist, hängt vom geplanten Einsatz ab. ASEA stimmt die Möglichkeiten persönlich mit Ihnen ab.'],
    about: ['Über ASEA | Verkaufsanhänger aus Oberösterreich', 'Lernen Sie ASEA aus Waldburg in Oberösterreich kennen. Persönliche Beratung und direkte Begleitung rund um Ihren Verkaufsanhänger seit 2021.', 'Über ASEA', 'ASEA ist ein familiär geführtes Unternehmen aus Waldburg in Oberösterreich mit persönlicher Beratung und direkter Abstimmung.'],
    contact: ['Kontakt & Beratung | ASEA Verkaufsanhänger', 'Kontaktieren Sie ASEA über Kontaktformular, Telefon, E-Mail oder WhatsApp. Persönliche Beratung und Antwort in der Regel innerhalb von 24 Stunden.', 'Kontakt und persönliche Beratung', 'Sprechen Sie mit ASEA über Ihren Verkaufsanhänger. Sie erreichen uns über das Kontaktformular, telefonisch, per E-Mail oder WhatsApp.'],
    reviews: ['Kundenbewertungen & Erfahrungen | ASEA', 'Lesen Sie freigegebene Kundenbewertungen und Erfahrungen mit Verkaufsanhänger ASEA aus Oberösterreich.', 'Kundenbewertungen', 'Hier finden Sie veröffentlichte Erfahrungen von Kundinnen und Kunden mit ASEA.'],
    configurator: ['Verkaufsanhänger konfigurieren | ASEA', 'Planen Sie die Innenausstattung Ihres ASEA-Verkaufsanhängers im interaktiven 3D-Konfigurator und erhalten Sie einen anschaulichen Einblick in Ihre Konfiguration.', 'ASEA 3D-Konfigurator', 'Planen Sie die Innenausstattung Ihres Verkaufsanhängers und betrachten Sie die Zusammenstellung aus verschiedenen Perspektiven.'],
    imprint: ['Impressum | ASEA', 'Impressum und Unternehmensinformationen von ASEA Verkaufsanhänger aus Waldburg in Oberösterreich.', 'Impressum', 'Unternehmensinformationen und gesetzliche Angaben zu ASEA Verkaufsanhänger.'],
    privacy: ['Datenschutz | ASEA', 'Datenschutzerklärung der Website von ASEA Verkaufsanhänger und Informationen zur Verarbeitung personenbezogener Daten.', 'Datenschutz', 'Informationen zur Verarbeitung personenbezogener Daten auf der Website von ASEA Verkaufsanhänger.'],
  },
  en: {
    home: ['Sales trailers | ASEA Upper Austria', 'Discover sales trailers, refrigerated trailers and exhibition trailers from ASEA with personal advice, individual equipment and comprehensive service.', 'Sales trailers from Upper Austria', 'ASEA offers sales trailers, refrigerated trailers and exhibition trailers with personal advice and direct contact.'],
    models: ['Sales trailers & models | ASEA', 'Explore ASEA sales trailers, refrigerated trailers and exhibition trailers. We provide personal advice and coordinate suitable solutions directly with you.', 'Sales trailers and models', 'Explore sales trailers, refrigerated trailers and exhibition trailers from ASEA.'],
    equipment: ['Equipment for sales trailers | ASEA', 'Discover equipment options and individual solutions for your ASEA sales trailer, coordinated personally for your intended use.', 'Equipment for sales trailers', 'ASEA personally coordinates suitable equipment options with you for the intended use.'],
    about: ['About ASEA | Sales trailers from Austria', 'Meet ASEA from Waldburg in Upper Austria. Since 2021, we have provided personal advice and direct support for sales trailer projects.', 'About ASEA', 'ASEA is a family-run company from Waldburg in Upper Austria with personal advice and direct coordination.'],
    contact: ['Contact & advice | ASEA sales trailers', 'Contact ASEA by form, phone, email or WhatsApp for personal advice about sales trailers, equipment and your individual project.', 'Contact and personal advice', 'Contact ASEA about your sales trailer by form, phone, email or WhatsApp.'],
    reviews: ['Customer reviews & experiences | ASEA', 'Read approved customer reviews and experiences with ASEA sales trailers and our personal service from Upper Austria.', 'Customer reviews', 'Read published experiences from customers of ASEA.'],
    configurator: ['Configure a sales trailer | ASEA', 'Plan the interior equipment of your ASEA sales trailer in the interactive 3D configurator and view your configuration from different perspectives.', 'ASEA 3D configurator', 'Plan the interior equipment of your sales trailer and view the configuration from different perspectives.'],
    imprint: ['Legal notice | ASEA', 'Legal notice and company information for ASEA sales trailers in Waldburg, Upper Austria.', 'Legal notice', 'Company information and legal details for ASEA sales trailers.'],
    privacy: ['Privacy policy | ASEA', 'Privacy information for the ASEA sales trailer website and its online services.', 'Privacy policy', 'Information about the processing of personal data on the ASEA website.'],
  },
  sk: {
    home: ['Predajné prívesy | ASEA Horné Rakúsko', 'Objavte predajné, chladiace a výstavné prívesy ASEA s osobným poradenstvom, individuálnym vybavením a komplexným servisom.', 'Predajné prívesy z Horného Rakúska', 'ASEA ponúka predajné, chladiace a výstavné prívesy s osobným poradenstvom a priamym kontaktom.'],
    models: ['Predajné prívesy a modely | ASEA', 'Prezrite si predajné, chladiace a výstavné prívesy ASEA. Vhodné riešenie a vybavenie s vami osobne dohodneme.', 'Predajné prívesy a modely', 'Prezrite si predajné, chladiace a výstavné prívesy ASEA.'],
    equipment: ['Vybavenie predajných prívesov | ASEA', 'Objavte možnosti vybavenia a individuálne riešenia pre predajný príves ASEA podľa plánovaného použitia.', 'Vybavenie predajných prívesov', 'ASEA s vami osobne dohodne vhodné vybavenie podľa plánovaného použitia.'],
    about: ['O spoločnosti ASEA | Predajné prívesy z Rakúska', 'Spoznajte spoločnosť ASEA z Waldburgu v Hornom Rakúsku. Od roku 2021 poskytujeme osobné poradenstvo pri predajných prívesoch.', 'O spoločnosti ASEA', 'ASEA je rodinná firma z Waldburgu v Hornom Rakúsku s osobným poradenstvom a priamou komunikáciou.'],
    contact: ['Kontakt a poradenstvo | ASEA', 'Kontaktujte ASEA formulárom, telefonicky, e-mailom alebo cez WhatsApp a získajte osobné poradenstvo k predajnému prívesu.', 'Kontakt a osobné poradenstvo', 'Kontaktujte ASEA ohľadom predajného prívesu formulárom, telefonicky, e-mailom alebo cez WhatsApp.'],
    reviews: ['Hodnotenia a skúsenosti zákazníkov | ASEA', 'Prečítajte si schválené hodnotenia a skúsenosti zákazníkov s predajnými prívesmi ASEA a naším osobným servisom.', 'Hodnotenia zákazníkov', 'Prečítajte si zverejnené skúsenosti zákazníkov spoločnosti ASEA.'],
    configurator: ['Konfigurátor predajného prívesu | ASEA', 'Naplánujte vnútorné vybavenie prívesu ASEA v interaktívnom 3D konfigurátore a prezrite si zostavu z rôznych pohľadov.', 'ASEA 3D konfigurátor', 'Naplánujte vnútorné vybavenie predajného prívesu a prezrite si zostavu z rôznych pohľadov.'],
    imprint: ['Tiráž | ASEA', 'Tiráž a firemné informácie spoločnosti ASEA z Waldburgu v Hornom Rakúsku.', 'Tiráž', 'Firemné informácie a zákonné údaje spoločnosti ASEA.'],
    privacy: ['Ochrana osobných údajov | ASEA', 'Informácie o ochrane osobných údajov na webovej stránke predajných prívesov ASEA.', 'Ochrana osobných údajov', 'Informácie o spracúvaní osobných údajov na webovej stránke ASEA.'],
  },
};

const languageCodes = { de: 'de-AT', en: 'en', sk: 'sk' };
const ogLocales = { de: 'de_AT', en: 'en_GB', sk: 'sk_SK' };
const navLabels = {
  de: ['Startseite', 'Modelle', 'Ausstattung', 'Konfigurator', 'Bewertungen', 'Über uns', 'Kontakt'],
  en: ['Home', 'Models', 'Equipment', 'Configurator', 'Reviews', 'About us', 'Contact'],
  sk: ['Domov', 'Modely', 'Vybavenie', 'Konfigurátor', 'Hodnotenia', 'O nás', 'Kontakt'],
};
const navPages = ['home', 'models', 'equipment', 'configurator', 'reviews', 'about', 'contact'];

function localizedPath(page, lang) {
  const basePath = basePaths[page];
  if (lang === 'de') return basePath;
  return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`;
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`SEO build failed: ${label} was not found in dist/index.html.`);
  return html.replace(pattern, replacement);
}

function structuredData(page, lang, canonicalUrl, title, description) {
  const organizationId = `${siteOrigin}/#organization`;
  const websiteId = `${siteOrigin}/#website`;
  const graph = [
    { '@type': 'WebSite', '@id': websiteId, url: `${siteOrigin}/`, name: 'ASEA Verkaufsanhänger', alternateName: ['ASEA', 'asea-anhaenger.com'], publisher: { '@id': organizationId }, inLanguage: languageCodes[lang] },
    { '@type': ['Organization', 'LocalBusiness'], '@id': organizationId, name: 'ASEA Verkaufsanhänger', url: `${siteOrigin}/`, logo: `${siteOrigin}/android-chrome-512x512.png`, image: ogImage, telephone: '+43 664 410 5 007', email: 'office@verkaufsanhaenger-asea.at', address: { '@type': 'PostalAddress', streetAddress: 'Lahrndorf 34', postalCode: '4240', addressLocality: 'Waldburg', addressCountry: 'AT' }, openingHours: ['Mo-Sa 10:00-18:00'] },
    { '@type': 'WebPage', '@id': `${canonicalUrl}#webpage`, url: canonicalUrl, name: title, description, inLanguage: languageCodes[lang], isPartOf: { '@id': websiteId }, about: { '@id': organizationId } },
  ];
  if (page !== 'home') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: navLabels[lang][0], item: `${siteOrigin}${localizedPath('home', lang)}` }, { '@type': 'ListItem', position: 2, name: pages[lang][page][2], item: canonicalUrl }] });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}

function alternateLinks(page) {
  const links = Object.keys(pages).map((lang) => `<link rel="alternate" hreflang="${languageCodes[lang]}" href="${siteOrigin}${localizedPath(page, lang)}" data-asea-hreflang="${languageCodes[lang]}" />`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${siteOrigin}${localizedPath(page, 'de')}" data-asea-hreflang="x-default" />`);
  return links.join('\n    ');
}

function staticContent(page, lang, heading, intro) {
  const links = navPages.map((navPage, index) => `<a href="${localizedPath(navPage, lang)}" style="color:#765a37;text-decoration:none">${escapeHtml(navLabels[lang][index])}</a>`).join('');
  return `<!-- SEO_STATIC_START --><div id="root"><main data-seo-static style="min-height:100%;background:#f8f7f3;color:#2f2f2d;font-family:Arial,sans-serif"><header style="padding:24px;border-bottom:2px solid #b08a57"><a href="${localizedPath('home', lang)}" style="color:#161615;font-weight:700;letter-spacing:.14em;text-decoration:none">ASEA Verkaufsanhänger</a></header><section style="max-width:960px;margin:0 auto;padding:72px 24px"><h1 style="font-size:clamp(2rem,5vw,4rem);margin:0 0 24px">${escapeHtml(heading)}</h1><p style="max-width:760px;font-size:1.1rem;line-height:1.7">${escapeHtml(intro)}</p><nav aria-label="Hauptnavigation" style="display:flex;flex-wrap:wrap;gap:20px;margin-top:40px">${links}</nav></section></main></div><!-- SEO_STATIC_END -->`;
}

function buildPage(page, lang) {
  const [title, description, heading, intro] = pages[lang][page];
  const canonicalUrl = `${siteOrigin}${localizedPath(page, lang)}`;
  let html = sourceHtml;
  html = replaceRequired(html, /<html lang="[^"]+">/, `<html lang="${languageCodes[lang]}">`, 'html language');
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, 'title');
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`, 'description');
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`, 'canonical');
  html = html.replace(/\s*<link rel="alternate"[^>]+data-asea-hreflang="[^"]+"\s*\/>/g, '');
  html = replaceRequired(html, /(<link rel="icon")/, `${alternateLinks(page)}\n    $1`, 'favicon marker');
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`, 'Open Graph title');
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`, 'Open Graph description');
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`, 'Open Graph URL');
  html = replaceRequired(html, /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${ogLocales[lang]}" />`, 'Open Graph locale');
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`, 'Twitter title');
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(description)}" />`, 'Twitter description');
  html = replaceRequired(html, /<script type="application\/ld\+json" data-asea-schema="main">[\s\S]*?<\/script>/, `<script type="application/ld+json" data-asea-schema="main">${structuredData(page, lang, canonicalUrl, title, description)}</script>`, 'structured data');
  html = replaceRequired(html, /<!-- SEO_STATIC_START -->[\s\S]*?<!-- SEO_STATIC_END -->/, staticContent(page, lang, heading, intro), 'static content');
  return html;
}

function buildPrivatePage(title, description, pathname) {
  let html = sourceHtml;
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, 'private title');
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`, 'private description');
  html = replaceRequired(html, /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex,nofollow" />', 'private robots');
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${siteOrigin}${pathname}" />`, 'private canonical');
  html = html.replace(/\s*<link rel="alternate"[^>]+data-asea-hreflang="[^"]+"\s*\/>/g, '');
  html = replaceRequired(html, /<!-- SEO_STATIC_START -->[\s\S]*?<!-- SEO_STATIC_END -->/, '<!-- SEO_STATIC_START --><div id="root"></div><!-- SEO_STATIC_END -->', 'private root');
  return html;
}

const outputs = [];
for (const lang of Object.keys(pages)) {
  const directory = path.join(distDirectory, 'seo', lang);
  await mkdir(directory, { recursive: true });
  for (const page of Object.keys(pages[lang])) outputs.push(writeFile(path.join(directory, `${page}.html`), buildPage(page, lang), 'utf8'));
}
await Promise.all(outputs);

const privateDirectory = path.join(distDirectory, 'seo', 'private');
await mkdir(privateDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(privateDirectory, 'admin.html'), buildPrivatePage('Adminbereich | ASEA', 'Geschützter Adminbereich der ASEA Website.', '/admin'), 'utf8'),
  writeFile(path.join(privateDirectory, 'review.html'), buildPrivatePage('Bewertung abgeben | ASEA', 'Geschützte Bewertungsseite für ASEA Kundinnen und Kunden.', '/bewertung'), 'utf8'),
  writeFile(path.join(privateDirectory, 'review-unsubscribe.html'), buildPrivatePage('Bewertungs-Erinnerungen abmelden | ASEA', 'Geschützte Abmeldeseite für automatische ASEA Bewertungs-Erinnerungen.', '/bewertung-abmelden'), 'utf8'),
]);

const sitemapRows = [];
for (const page of Object.keys(basePaths)) {
  for (const lang of Object.keys(pages)) {
    const canonicalUrl = `${siteOrigin}${localizedPath(page, lang)}`;
    const alternates = Object.keys(pages).map((alternateLang) => `    <xhtml:link rel="alternate" hreflang="${languageCodes[alternateLang]}" href="${siteOrigin}${localizedPath(page, alternateLang)}" />`).join('\n');
    const image = page === 'home' ? `\n    <image:image><image:loc>${ogImage}</image:loc><image:title>ASEA Verkaufsanhänger</image:title></image:image>` : '';
    sitemapRows.push(`  <url>\n    <loc>${canonicalUrl}</loc>\n    <lastmod>2026-11-12</lastmod>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${siteOrigin}${localizedPath(page, 'de')}" />${image}\n  </url>`);
  }
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapRows.join('\n')}\n</urlset>\n`;
await writeFile(path.join(distDirectory, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${outputs.length} localized crawlable SEO entry pages and the multilingual sitemap.`);
