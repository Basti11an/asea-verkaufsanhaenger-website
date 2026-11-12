import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const sourceHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
const siteOrigin = 'https://asea-anhaenger.com';

const pages = [
  {
    slug: 'ausstattung',
    title: 'Ausstattung für Verkaufsanhänger | ASEA',
    description: 'Entdecken Sie Ausstattungsoptionen und individuelle Lösungen für Ihren Verkaufsanhänger von ASEA.',
    heading: 'Ausstattung für Verkaufsanhänger',
    intro: 'Welche Ausstattung sinnvoll ist, hängt vom geplanten Einsatz ab. ASEA stimmt die verfügbaren Möglichkeiten persönlich mit Ihnen ab.',
  },
  {
    slug: 'kontakt',
    title: 'Kontakt & persönliche Beratung | ASEA',
    description: 'Kontaktieren Sie ASEA über Kontaktformular, Telefon, E-Mail oder WhatsApp. Persönliche Beratung und Antwort in der Regel innerhalb von 24 Stunden.',
    heading: 'Kontakt und persönliche Beratung',
    intro: 'Sprechen Sie mit ASEA über Ihren Verkaufsanhänger. Sie erreichen uns über das Kontaktformular, telefonisch, per E-Mail oder über WhatsApp.',
  },
  {
    slug: 'konfigurator',
    title: 'Verkaufsanhänger konfigurieren | ASEA',
    description: 'Planen Sie die Innenausstattung Ihres ASEA-Verkaufsanhängers im interaktiven 3D-Konfigurator und erhalten Sie einen anschaulichen Einblick in Ihre Konfiguration.',
    heading: 'ASEA 3D-Konfigurator',
    intro: 'Planen Sie die Innenausstattung Ihres Verkaufsanhängers und betrachten Sie die Zusammenstellung aus verschiedenen Perspektiven.',
  },
  {
    slug: 'bewertungen',
    title: 'Kundenbewertungen | ASEA',
    description: 'Lesen Sie freigegebene Kundenbewertungen und Erfahrungen mit Verkaufsanhänger ASEA aus Oberösterreich.',
    heading: 'Kundenbewertungen',
    intro: 'Hier finden Sie veröffentlichte Erfahrungen von Kundinnen und Kunden mit ASEA.',
  },
];

const navigation = [
  ['Startseite', '/'],
  ['Modelle', '/modelle'],
  ['Ausstattung', '/ausstattung'],
  ['Konfigurator', '/konfigurator'],
  ['Bewertungen', '/bewertungen'],
  ['Kontakt', '/kontakt'],
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`SEO build failed: ${label} was not found in dist/index.html.`);
  }

  return html.replace(pattern, replacement);
}

function buildStaticContent(page) {
  const links = navigation
    .map(([label, href]) => `<a href="${href}" style="color:#765a37;text-decoration:none">${escapeHtml(label)}</a>`)
    .join('');

  return `<div id="root"><main style="min-height:100%;background:#f8f7f3;color:#2f2f2d;font-family:Arial,sans-serif"><header style="padding:24px;border-bottom:2px solid #b08a57"><a href="/" style="color:#161615;font-weight:700;letter-spacing:.14em;text-decoration:none">ASEA</a></header><section style="max-width:960px;margin:0 auto;padding:72px 24px"><h1 style="font-size:clamp(2rem,5vw,4rem);margin:0 0 24px">${escapeHtml(page.heading)}</h1><p style="max-width:760px;font-size:1.1rem;line-height:1.7">${escapeHtml(page.intro)}</p><nav aria-label="Hauptnavigation" style="display:flex;flex-wrap:wrap;gap:20px;margin-top:40px">${links}</nav></section></main></div>`;
}

function buildStructuredData(page, canonicalUrl) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: page.heading,
        description: page.description,
        url: canonicalUrl,
        isPartOf: { '@id': `${siteOrigin}/#website` },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        name: 'ASEA Verkaufsanhänger',
        url: `${siteOrigin}/`,
        inLanguage: 'de-AT',
      },
    ],
  }).replaceAll('<', '\\u003c');
}

function buildPage(page) {
  const canonicalUrl = `${siteOrigin}/${page.slug}`;
  let html = sourceHtml;

  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`, 'title');
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(page.description)}" />`, 'description');
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`, 'canonical');
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`, 'Open Graph title');
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(page.description)}" />`, 'Open Graph description');
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`, 'Open Graph URL');
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`, 'Twitter title');
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`, 'Twitter description');
  html = replaceRequired(html, /<div id="root"><\/div>/, buildStaticContent(page), 'root container');
  html = replaceRequired(
    html,
    /<\/head>/,
    `    <script type="application/ld+json" data-asea-schema="main">${buildStructuredData(page, canonicalUrl)}</script>\n  </head>`,
    'head closing tag',
  );

  return html;
}

const outputDirectory = path.join(distDirectory, 'seo');
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  pages.map((page) => writeFile(path.join(outputDirectory, `${page.slug}.html`), buildPage(page), 'utf8')),
);

console.log(`Generated ${pages.length} crawlable SEO entry pages.`);
