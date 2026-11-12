import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Analytics as VercelAnalytics, type BeforeSendEvent } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AdminDataProvider } from './context/AdminDataContext';
import { LanguageProvider, useLanguage, type Lang } from './context/LanguageContext';
import { Header } from './components/Header';
import { AdminHeader } from './components/AdminHeader';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ModelsPage } from './components/pages/ModelsPage';
import { ModelDetailPage } from './components/pages/ModelDetailPage';
import { EquipmentPage } from './components/pages/EquipmentPage';
import { ContactPage } from './components/pages/ContactPage';
import { ImprintPage } from './components/pages/ImprintPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { CustomerReviewPage } from './components/pages/CustomerReviewPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { ReviewOptOutPage } from './components/pages/ReviewOptOutPage';
import { MessagesPage } from './components/pages/MessagesPage';
import { AdminLogin } from './components/AdminLogin';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { PrivacyConsentBanner } from './components/PrivacyConsentBanner';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { hasStatisticsConsent } from './lib/privacyConsent';
import { getAdminAccess, type AdminAccessStatus } from './lib/adminAuth';
import { getLanguageFromPath, getLocalizedPath, stripLanguagePrefix } from './lib/siteRoutes';

const ConfiguratorPage = lazy(() =>
  import('./components/pages/ConfiguratorPage').then((module) => ({
    default: module.ConfiguratorPage,
  })),
);

const PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/ueber-uns',
  configurator: '/konfigurator',
  models: '/modelle',
  equipment: '/ausstattung',
  contact: '/kontakt',
  imprint: '/impressum',
  privacy: '/datenschutz',
  reviews: '/bewertungen',
  customerReview: '/bewertung',
  reviewOptOut: '/bewertung-abmelden',
  messages: '/admin',
  notFound: '/',
};

const SITE_ORIGIN = 'https://asea-anhaenger.com';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/asea-startseite-verkaufsanhaenger.jpg`;

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const SEO_CONFIG: Record<string, SeoConfig> = {
  home: {
    title: 'Verkaufsanhänger kaufen | ASEA Oberösterreich',
    description: 'Hochwertige Verkaufsanhänger, Kühlanhänger und Messeanhänger von ASEA. Individuelle Ausstattung, persönliche Beratung und umfassender Service. Jetzt entdecken!',
    path: '/',
  },
  models: {
    title: 'Verkaufsanhänger & Modelle | ASEA',
    description: 'Entdecken Sie Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger von ASEA. Persönlich beraten und direkt abgestimmt.',
    path: '/modelle',
  },
  'model-detail': {
    title: 'Verkaufsanhänger & Modelle | ASEA',
    description: 'Entdecken Sie Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger von ASEA. Persönlich beraten und direkt abgestimmt.',
    path: '/modelle',
  },
  equipment: {
    title: 'Ausstattung für Verkaufsanhänger | ASEA',
    description: 'Entdecken Sie Ausstattungsoptionen und individuelle Lösungen für Ihren Verkaufsanhänger von ASEA.',
    path: '/ausstattung',
  },
  about: {
    title: 'Über ASEA | Verkaufsanhänger aus Oberösterreich',
    description: 'Lernen Sie ASEA aus Waldburg in Oberösterreich kennen. Persönliche Beratung und direkte Begleitung rund um Ihren Verkaufsanhänger seit 2021.',
    path: '/ueber-uns',
  },
  contact: {
    title: 'Kontakt & Beratung | ASEA Verkaufsanhänger',
    description: 'Kontaktieren Sie ASEA über Kontaktformular, Telefon, E-Mail oder WhatsApp. Persönliche Beratung und Antwort in der Regel innerhalb von 24 Stunden.',
    path: '/kontakt',
  },
  reviews: {
    title: 'Kundenbewertungen & Erfahrungen | ASEA',
    description: 'Lesen Sie freigegebene Kundenbewertungen und Erfahrungen mit Verkaufsanhänger ASEA aus Oberösterreich.',
    path: '/bewertungen',
  },
  configurator: {
    title: 'Verkaufsanhänger konfigurieren | ASEA',
    description: 'Planen Sie die Innenausstattung Ihres ASEA-Verkaufsanhängers im interaktiven 3D-Konfigurator und erhalten Sie einen anschaulichen Einblick in Ihre Konfiguration.',
    path: '/konfigurator',
  },
  imprint: {
    title: 'Impressum | ASEA',
    description: 'Impressum und Unternehmensinformationen von Verkaufsanhänger ASEA.',
    path: '/impressum',
  },
  privacy: {
    title: 'Datenschutz | ASEA',
    description: 'Datenschutzerklärung von Verkaufsanhänger ASEA.',
    path: '/datenschutz',
  },
  customerReview: {
    title: 'Bewertung abgeben | ASEA',
    description: 'Geschützte Bewertungsseite für ASEA Kundinnen und Kunden.',
    path: '/bewertung',
    robots: 'noindex,nofollow',
  },
  reviewOptOut: {
    title: 'Bewertungs-Erinnerungen abmelden | ASEA',
    description: 'Geschützte Abmeldeseite für automatische ASEA Bewertungs-Erinnerungen.',
    path: '/bewertung-abmelden',
    robots: 'noindex,nofollow',
  },
  messages: {
    title: 'Adminbereich | ASEA',
    description: 'Geschützter Adminbereich der ASEA Website.',
    path: '/admin',
    robots: 'noindex,nofollow',
  },
  notFound: {
    title: 'Seite nicht gefunden | ASEA',
    description: 'Die angeforderte Seite wurde nicht gefunden.',
    path: '/',
    robots: 'noindex,nofollow',
  },
};

const LOCALIZED_SEO: Record<Exclude<Lang, 'de'>, Record<string, Pick<SeoConfig, 'title' | 'description'>>> = {
  en: {
    home: {
      title: 'Sales trailers | ASEA Upper Austria',
      description: 'Discover sales trailers, refrigerated trailers and exhibition trailers from ASEA with personal advice, individual equipment and comprehensive service.',
    },
    models: {
      title: 'Sales trailers & models | ASEA',
      description: 'Explore ASEA sales trailers, refrigerated trailers and exhibition trailers. We provide personal advice and coordinate suitable solutions directly with you.',
    },
    'model-detail': {
      title: 'Sales trailers & models | ASEA',
      description: 'Explore ASEA sales trailers, refrigerated trailers and exhibition trailers with personal advice and directly coordinated equipment.',
    },
    equipment: {
      title: 'Equipment for sales trailers | ASEA',
      description: 'Discover equipment options and individual solutions for your ASEA sales trailer, coordinated personally for your intended use.',
    },
    about: {
      title: 'About ASEA | Sales trailers from Austria',
      description: 'Meet ASEA from Waldburg in Upper Austria. Since 2021, we have provided personal advice and direct support for sales trailer projects.',
    },
    contact: {
      title: 'Contact & advice | ASEA sales trailers',
      description: 'Contact ASEA by form, phone, email or WhatsApp for personal advice about sales trailers, equipment and your individual project.',
    },
    reviews: {
      title: 'Customer reviews & experiences | ASEA',
      description: 'Read approved customer reviews and experiences with ASEA sales trailers and our personal service from Upper Austria.',
    },
    configurator: {
      title: 'Configure a sales trailer | ASEA',
      description: 'Plan the interior equipment of your ASEA sales trailer in the interactive 3D configurator and view your configuration from different perspectives.',
    },
    imprint: {
      title: 'Legal notice | ASEA',
      description: 'Legal notice and company information for ASEA sales trailers in Waldburg, Upper Austria.',
    },
    privacy: {
      title: 'Privacy policy | ASEA',
      description: 'Privacy information for the ASEA sales trailer website and its online services.',
    },
  },
  sk: {
    home: {
      title: 'Predajné prívesy | ASEA Horné Rakúsko',
      description: 'Objavte predajné, chladiace a výstavné prívesy ASEA s osobným poradenstvom, individuálnym vybavením a komplexným servisom.',
    },
    models: {
      title: 'Predajné prívesy a modely | ASEA',
      description: 'Prezrite si predajné, chladiace a výstavné prívesy ASEA. Vhodné riešenie a vybavenie s vami osobne dohodneme.',
    },
    'model-detail': {
      title: 'Predajné prívesy a modely | ASEA',
      description: 'Prezrite si predajné, chladiace a výstavné prívesy ASEA s osobným poradenstvom a individuálne dohodnutým vybavením.',
    },
    equipment: {
      title: 'Vybavenie predajných prívesov | ASEA',
      description: 'Objavte možnosti vybavenia a individuálne riešenia pre predajný príves ASEA podľa plánovaného použitia.',
    },
    about: {
      title: 'O spoločnosti ASEA | Predajné prívesy z Rakúska',
      description: 'Spoznajte spoločnosť ASEA z Waldburgu v Hornom Rakúsku. Od roku 2021 poskytujeme osobné poradenstvo pri predajných prívesoch.',
    },
    contact: {
      title: 'Kontakt a poradenstvo | ASEA',
      description: 'Kontaktujte ASEA formulárom, telefonicky, e-mailom alebo cez WhatsApp a získajte osobné poradenstvo k predajnému prívesu.',
    },
    reviews: {
      title: 'Hodnotenia a skúsenosti zákazníkov | ASEA',
      description: 'Prečítajte si schválené hodnotenia a skúsenosti zákazníkov s predajnými prívesmi ASEA a naším osobným servisom.',
    },
    configurator: {
      title: 'Konfigurátor predajného prívesu | ASEA',
      description: 'Naplánujte vnútorné vybavenie prívesu ASEA v interaktívnom 3D konfigurátore a prezrite si zostavu z rôznych pohľadov.',
    },
    imprint: {
      title: 'Tiráž | ASEA',
      description: 'Tiráž a firemné informácie spoločnosti ASEA z Waldburgu v Hornom Rakúsku.',
    },
    privacy: {
      title: 'Ochrana osobných údajov | ASEA',
      description: 'Informácie o ochrane osobných údajov na webovej stránke predajných prívesov ASEA.',
    },
  },
};

const PATH_PAGES: Record<string, string> = {
  '/': 'home',
  '/ueber-uns': 'about',
  '/about': 'about',
  '/konfigurator': 'configurator',
  '/configurator': 'configurator',
  '/modelle': 'models',
  '/models': 'models',
  '/ausstattung': 'equipment',
  '/equipment': 'equipment',
  '/kontakt': 'contact',
  '/contact': 'contact',
  '/impressum': 'imprint',
  '/imprint': 'imprint',
  '/datenschutz': 'privacy',
  '/privacy': 'privacy',
  '/bewertungen': 'reviews',
  '/reviews': 'reviews',
  '/bewertung': 'customerReview',
  '/review': 'customerReview',
  '/bewertung-abmelden': 'reviewOptOut',
  '/review-unsubscribe': 'reviewOptOut',
  '/admin': 'messages',
};

function getPageFromLocation() {
  if (typeof window === 'undefined') return 'home';

  const normalizedPath = stripLanguagePrefix(window.location.pathname).replace(/\/+$/, '') || '/';
  return PATH_PAGES[normalizedPath] ?? 'notFound';
}

function canUseCleanBrowserUrls() {
  return typeof window !== 'undefined' && window.location.protocol !== 'file:';
}

function filterPublicVercelEvent<T extends { url: string }>(event: T): T | null {
  try {
    const url = new URL(event.url, window.location.origin);

    if (url.pathname.startsWith('/admin')) {
      return null;
    }

    if (url.pathname === '/bewertung' || url.pathname === '/review' || url.pathname === '/bewertung-abmelden') {
      url.search = '';
      return { ...event, url: url.toString() };
    }

    return event;
  } catch {
    return event;
  }
}

function filterPublicVercelAnalyticsEvent(event: BeforeSendEvent) {
  return filterPublicVercelEvent(event);
}

function upsertMetaByName(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function upsertMetaByProperty(property: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = href;
}

function updateLanguageAlternates(page: string, enabled: boolean) {
  document.head.querySelectorAll('link[data-asea-hreflang]').forEach((link) => link.remove());
  if (!enabled) return;

  const alternates: Array<[string, Lang]> = [['de-AT', 'de'], ['en', 'en'], ['sk', 'sk']];
  for (const [hreflang, lang] of alternates) {
    const path = getLocalizedPath(page, lang);
    if (!path) continue;

    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = `${SITE_ORIGIN}${path}`;
    link.dataset.aseaHreflang = hreflang;
    document.head.appendChild(link);
  }

  const fallbackPath = getLocalizedPath(page, 'de');
  if (fallbackPath) {
    const fallback = document.createElement('link');
    fallback.rel = 'alternate';
    fallback.hreflang = 'x-default';
    fallback.href = `${SITE_ORIGIN}${fallbackPath}`;
    fallback.dataset.aseaHreflang = 'x-default';
    document.head.appendChild(fallback);
  }
}

function upsertJsonLd(id: string, data: unknown) {
  let script = document.head.querySelector<HTMLScriptElement>(`script[type="application/ld+json"][data-asea-schema="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.aseaSchema = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function getSeoForPage(page: string, lang: Lang, navData?: any): SeoConfig {
  if (lang === 'de' && page === 'model-detail' && navData?.model?.name) {
    const modelName = String(navData.model.name).toLowerCase();

    if (modelName.includes('kühl') || modelName.includes('kuehl')) {
      return {
        title: 'Kühlanhänger | ASEA',
        description: 'Kühlanhänger von ASEA als feste Ausführung für gekühlte Waren. Persönliche Beratung und direkter Kontakt.',
        path: '/modelle',
      };
    }

    if (modelName.includes('messe') || modelName.includes('präsentation') || modelName.includes('praesentation')) {
      return {
        title: 'Messe- & Präsentationsanhänger | ASEA',
        description: 'Messe- und Präsentationsanhänger von ASEA für Veranstaltungen, Promotion und professionelle mobile Auftritte.',
        path: '/modelle',
      };
    }

    return {
      title: 'Verkaufsanhänger nach Maß | ASEA',
      description: 'Verkaufsanhänger von ASEA werden gemeinsam mit Ihnen auf den geplanten Einsatz abgestimmt.',
      path: '/modelle',
    };
  }

  const base = SEO_CONFIG[page] ?? SEO_CONFIG.home;
  const localized = lang === 'de' ? null : LOCALIZED_SEO[lang][page];
  const localizedPath = getLocalizedPath(page, lang) ?? base.path;

  return {
    ...base,
    ...localized,
    path: localizedPath,
  };
}

function getBreadcrumbName(page: string, lang: Lang, navData?: any) {
  if (page === 'model-detail' && navData?.model?.name) {
    return String(navData.model.name);
  }

  const names: Record<Lang, Record<string, string>> = {
    de: { home: 'Startseite', models: 'Modelle', equipment: 'Ausstattung', about: 'Über uns', contact: 'Kontakt', reviews: 'Bewertungen', configurator: 'Konfigurator', imprint: 'Impressum', privacy: 'Datenschutz' },
    en: { home: 'Home', models: 'Models', equipment: 'Equipment', about: 'About us', contact: 'Contact', reviews: 'Reviews', configurator: 'Configurator', imprint: 'Legal notice', privacy: 'Privacy policy' },
    sk: { home: 'Domov', models: 'Modely', equipment: 'Vybavenie', about: 'O nás', contact: 'Kontakt', reviews: 'Hodnotenia', configurator: 'Konfigurátor', imprint: 'Tiráž', privacy: 'Ochrana údajov' },
  };

  return names[lang][page] ?? names[lang].home;
}

function buildStructuredData(page: string, seo: SeoConfig, canonicalUrl: string, lang: Lang, navData?: any) {
  const organizationId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${SITE_ORIGIN}/#website`;
  const currentPageName = getBreadcrumbName(page, lang, navData);
  const languageCode = lang === 'de' ? 'de-AT' : lang;

  const graph: unknown[] = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_ORIGIN}/`,
      name: 'ASEA Verkaufsanhänger',
      alternateName: ['ASEA', 'asea-anhaenger.com'],
      publisher: {
        '@id': organizationId,
      },
      inLanguage: languageCode,
    },
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': organizationId,
      name: 'ASEA Verkaufsanhänger',
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/android-chrome-512x512.png`,
      image: DEFAULT_OG_IMAGE,
      telephone: '+43 664 410 5 007',
      email: 'office@verkaufsanhaenger-asea.at',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lahrndorf 34',
        postalCode: '4240',
        addressLocality: 'Waldburg',
        addressCountry: 'AT',
      },
      openingHours: [
        'Mo-Sa 10:00-18:00',
      ],
    },
  ];

  graph.push({
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seo.title,
    description: seo.description,
    inLanguage: languageCode,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
  });

  if (!seo.robots?.includes('noindex')) {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: `${SITE_ORIGIN}/`,
      },
    ];

    if (page !== 'home') {
      itemListElement.push({
        '@type': 'ListItem',
        position: 2,
        name: currentPageName,
        item: canonicalUrl,
      });
    }

    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function applySeoForPage(page: string, lang: Lang, navData?: any) {
  const seo = getSeoForPage(page, lang, navData);
  const canonicalUrl = `${SITE_ORIGIN}${seo.path}`;
  const robots = seo.robots ?? 'index,follow';

  document.title = seo.title;
  upsertMetaByName('description', seo.description);
  upsertMetaByName('robots', robots);
  upsertCanonical(canonicalUrl);
  updateLanguageAlternates(page, !robots.includes('noindex') && Boolean(getLocalizedPath(page, lang)));
  upsertMetaByProperty('og:title', seo.title);
  upsertMetaByProperty('og:description', seo.description);
  upsertMetaByProperty('og:url', canonicalUrl);
  upsertMetaByProperty('og:type', 'website');
  upsertMetaByProperty('og:site_name', 'ASEA Verkaufsanhänger');
  upsertMetaByProperty('og:locale', lang === 'de' ? 'de_AT' : lang === 'en' ? 'en_GB' : 'sk_SK');
  upsertMetaByProperty('og:image', DEFAULT_OG_IMAGE);
  upsertMetaByProperty('og:image:width', '3361');
  upsertMetaByProperty('og:image:height', '1911');
  upsertMetaByProperty('og:image:alt', 'ASEA Verkaufsanhänger vor dem Firmenstandort in Waldburg');
  upsertMetaByName('twitter:card', 'summary_large_image');
  upsertMetaByName('twitter:title', seo.title);
  upsertMetaByName('twitter:description', seo.description);
  upsertMetaByName('twitter:image', DEFAULT_OG_IMAGE);
  upsertJsonLd('main', buildStructuredData(page, seo, canonicalUrl, lang, navData));
}

function AdminAccessLoading() {
  return (
    <div className="min-h-screen bg-[#f8f7f3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#b08a57]/20 shadow-lg p-6 text-center">
        <div className="w-10 h-10 mx-auto mb-4 border-2 border-[#b08a57] border-t-transparent rounded-full animate-spin" />
        <h1 className="text-xl font-semibold text-[#2f2f2f]">Adminzugriff wird geprüft</h1>
        <p className="text-sm text-[#77756f] mt-2">Bitte einen Moment warten.</p>
      </div>
    </div>
  );
}

function scrollPageToTop() {
  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById('root');
  const scrollingElement = document.scrollingElement || html;
  const previousHtmlBehavior = html.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  const run = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    scrollingElement.scrollTop = 0;
    html.scrollTop = 0;
    body.scrollTop = 0;

    if (root) {
      root.scrollTop = 0;
    }
  };

  run();
  requestAnimationFrame(run);
  requestAnimationFrame(() => requestAnimationFrame(run));
  window.setTimeout(run, 0);
  window.setTimeout(run, 80);
  window.setTimeout(run, 180);
  window.setTimeout(() => {
    html.style.scrollBehavior = previousHtmlBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
  }, 220);
}

function AppInner() {
  const { lang, setLang } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>(getPageFromLocation);
  const [navData, setNavData] = useState<any>(null);
  const [adminAccessStatus, setAdminAccessStatus] = useState<AdminAccessStatus>('guest');
  const [adminAccessMessage, setAdminAccessMessage] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('eingaenge');
  const [navigationTick, setNavigationTick] = useState(0);
  const [privacySettingsOpen, setPrivacySettingsOpen] = useState(false);
  const [statisticsAllowed, setStatisticsAllowed] = useState(hasStatisticsConsent);

  const handleNavigate = (page: string, data?: any) => {
    setNavData(data ?? null);
    setNavigationTick((tick) => tick + 1);

    const targetPage = page === 'model-detail' ? 'models' : page;
    const path = getLocalizedPath(targetPage, lang) ?? PAGE_PATHS[targetPage];

    if (path && canUseCleanBrowserUrls() && window.location.pathname !== path) {
      try {
        window.history.pushState({}, '', path);
      } catch (error) {
        console.warn('Navigation URL update failed:', error);
      }
    }

    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  const refreshAdminAccess = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setAdminAccessStatus('guest');
      setAdminAccessMessage('Der Admin-Login ist erst nach der Supabase-Konfiguration verfügbar.');
      return false;
    }

    setAdminAccessStatus('checking');

    const access = await getAdminAccess();

    if (access.status !== 'admin') {
      setAdminAccessStatus('guest');
      setAdminAccessMessage(access.error ?? '');
      setAdminActiveTab('eingaenge');

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await supabase.auth.signOut();
      }

      return false;
    }

    setAdminAccessStatus('admin');
    setAdminAccessMessage('');
    return true;
  }, []);

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [currentPage, navigationTick]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePageShow = () => {
      scrollPageToTop();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const pathLanguage = getLanguageFromPath(window.location.pathname);
      setLang(pathLanguage ?? 'de');
      setNavData(null);
      setNavigationTick((tick) => tick + 1);
      setCurrentPage(getPageFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLang]);

  useEffect(() => {
    const localizedPath = getLocalizedPath(currentPage === 'model-detail' ? 'models' : currentPage, lang);
    if (!localizedPath || !canUseCleanBrowserUrls() || window.location.pathname === localizedPath) return;

    window.history.replaceState({}, '', `${localizedPath}${window.location.search}${window.location.hash}`);
  }, [currentPage, lang]);

  useEffect(() => {
    applySeoForPage(currentPage, lang, navData);
  }, [currentPage, lang, navData]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAdminAccessStatus('guest');
      setAdminAccessMessage('Der Admin-Login ist erst nach der Supabase-Konfiguration verfügbar.');
      return;
    }

    void refreshAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAdminAccessStatus('guest');
        setAdminActiveTab('eingaenge');
        return;
      }

      void refreshAdminAccess();
    });

    return () => subscription.unsubscribe();
  }, [refreshAdminAccess]);

  const handleAdminLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setAdminAccessStatus('guest');
    setAdminAccessMessage('');
    setAdminActiveTab('eingaenge');
    handleNavigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'configurator':
        return (
          <Suspense fallback={<div className="h-dvh bg-[#eceeea]" />}>
            <ConfiguratorPage />
          </Suspense>
        );
      case 'models':
        return <ModelsPage onNavigate={handleNavigate} />;
      case 'model-detail':
        return navData?.model
          ? <ModelDetailPage model={navData.model} onNavigate={handleNavigate} />
          : <ModelsPage onNavigate={handleNavigate} />;
      case 'equipment':
        return <EquipmentPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage prefillData={navData} onNavigate={handleNavigate} />;
      case 'imprint':
        return <ImprintPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'customerReview':
        return <CustomerReviewPage onNavigate={handleNavigate} />;
      case 'reviewOptOut':
        return <ReviewOptOutPage onNavigate={handleNavigate} />;
      case 'messages':
        if (adminAccessStatus === 'checking') {
          return <AdminAccessLoading />;
        }

        return adminAccessStatus === 'admin' ? (
          <MessagesPage
            activeTab={adminActiveTab}
            onLogout={handleAdminLogout}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminLogin onLogin={refreshAdminAccess} onNavigate={handleNavigate} accessMessage={adminAccessMessage} />
        );
      case 'notFound':
        return <NotFoundPage onNavigate={handleNavigate} />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  const isAdminMode = currentPage === 'messages' && adminAccessStatus === 'admin';
  const isConfiguratorMode = currentPage === 'configurator';
  const showNormalHeader = currentPage !== 'messages' && !isConfiguratorMode;
  const showFooter = currentPage !== 'messages' && !isConfiguratorMode;

  return (
    <div className={isConfiguratorMode ? 'flex h-dvh min-h-0 flex-col overflow-hidden bg-[#eceeea]' : 'flex min-h-screen flex-col bg-gray-50'}>
      {showNormalHeader && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      {isAdminMode && (
        <AdminHeader
          activeTab={adminActiveTab}
          setActiveTab={setAdminActiveTab}
          onNavigate={handleNavigate}
          onLogout={handleAdminLogout}
        />
      )}
      <main className={isConfiguratorMode ? 'min-h-0 flex-1 overflow-hidden' : 'flex-1'}>
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={handleNavigate} onOpenPrivacySettings={() => setPrivacySettingsOpen(true)} />}
      {showNormalHeader && (
        <PrivacyConsentBanner
          forceOpen={privacySettingsOpen}
          onClose={() => setPrivacySettingsOpen(false)}
          onConsentChange={() => setStatisticsAllowed(hasStatisticsConsent())}
          onNavigate={handleNavigate}
        />
      )}
      {statisticsAllowed && (
        <>
          <VercelAnalytics beforeSend={filterPublicVercelAnalyticsEvent} />
          <SpeedInsights beforeSend={filterPublicVercelEvent} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminDataProvider>
        <AppInner />
      </AdminDataProvider>
    </LanguageProvider>
  );
}
