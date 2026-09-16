import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Analytics as VercelAnalytics, type BeforeSendEvent } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AdminDataProvider } from './context/AdminDataContext';
import { LanguageProvider } from './context/LanguageContext';
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
import { ConfiguratorPage } from './components/pages/ConfiguratorPage';
import { PrivacyConsentBanner } from './components/PrivacyConsentBanner';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { hasStatisticsConsent } from './lib/privacyConsent';
import { getAdminAccess, type AdminAccessStatus } from './lib/adminAuth';

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
};

const SITE_ORIGIN = 'https://asea-anhaenger.com';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/asea-og-image.png`;

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const SEO_CONFIG: Record<string, SeoConfig> = {
  home: {
    title: 'Verkaufsanhänger nach Maß aus Österreich | ASEA',
    description: 'ASEA aus Waldburg in Oberösterreich – individuelle Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger nach Kundenwunsch.',
    path: '/',
  },
  models: {
    title: 'Verkaufsanhänger & Modelle | ASEA Österreich',
    description: 'Entdecken Sie die Anhänger von ASEA: Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger für individuelle Anforderungen.',
    path: '/modelle',
  },
  'model-detail': {
    title: 'Verkaufsanhänger & Modelle | ASEA Österreich',
    description: 'Entdecken Sie die Anhänger von ASEA: Verkaufsanhänger, Kühlanhänger sowie Messe- und Präsentationsanhänger für individuelle Anforderungen.',
    path: '/modelle',
  },
  equipment: {
    title: 'Ausstattung für Verkaufsanhänger | ASEA',
    description: 'Entdecken Sie Ausstattungsoptionen und individuelle Lösungen für Ihren Verkaufsanhänger von ASEA.',
    path: '/ausstattung',
  },
  about: {
    title: 'Über ASEA | Verkaufsanhänger aus Waldburg',
    description: 'Erfahren Sie mehr über Verkaufsanhänger ASEA aus Waldburg in Oberösterreich und unsere individuelle Planung nach Kundenwunsch.',
    path: '/ueber-uns',
  },
  contact: {
    title: 'Kontakt & Beratung | Verkaufsanhänger ASEA',
    description: 'Kontaktieren Sie ASEA für Beratung rund um Verkaufsanhänger, Kühlanhänger und individuelle Anhängerlösungen.',
    path: '/kontakt',
  },
  reviews: {
    title: 'Kundenprojekte & Bewertungen | ASEA',
    description: 'Entdecken Sie realisierte Anhängerprojekte und Erfahrungen von Kunden mit Verkaufsanhänger ASEA.',
    path: '/bewertungen',
  },
  configurator: {
    title: 'Verkaufsanhänger konfigurieren | ASEA',
    description: 'Planen Sie Ihren Verkaufsanhänger mit dem ASEA Konfigurator und stellen Sie Ausstattung, Farben und Details individuell zusammen.',
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

  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
  return PATH_PAGES[normalizedPath] ?? 'home';
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

function getSeoForPage(page: string, navData?: any): SeoConfig {
  if (page === 'model-detail' && navData?.model?.name) {
    const modelName = String(navData.model.name).toLowerCase();

    if (modelName.includes('kühl') || modelName.includes('kuehl')) {
      return {
        title: 'Kühlanhänger nach Maß | ASEA Oberösterreich',
        description: 'Kühlanhänger von ASEA für professionelle Anwendungen. Individuelle Planung und persönliche Beratung aus Waldburg in Oberösterreich.',
        path: '/modelle',
      };
    }

    if (modelName.includes('messe') || modelName.includes('präsentation') || modelName.includes('praesentation')) {
      return {
        title: 'Messe- & Präsentationsanhänger | ASEA',
        description: 'Individuelle Messe- und Präsentationsanhänger von ASEA. Maßgeschneiderte Lösungen für Präsentationen, Veranstaltungen und Unternehmen.',
        path: '/modelle',
      };
    }

    return {
      title: 'Verkaufsanhänger nach Maß | ASEA Oberösterreich',
      description: 'Individuelle Verkaufsanhänger von ASEA aus Waldburg. Planung nach Kundenwunsch mit passender Ausstattung für Ihren Einsatzbereich.',
      path: '/modelle',
    };
  }

  return SEO_CONFIG[page] ?? SEO_CONFIG.home;
}

function applySeoForPage(page: string, navData?: any) {
  const seo = getSeoForPage(page, navData);
  const canonicalUrl = `${SITE_ORIGIN}${seo.path}`;
  const robots = seo.robots ?? 'index,follow';

  document.title = seo.title;
  upsertMetaByName('description', seo.description);
  upsertMetaByName('robots', robots);
  upsertCanonical(canonicalUrl);
  upsertMetaByProperty('og:title', seo.title);
  upsertMetaByProperty('og:description', seo.description);
  upsertMetaByProperty('og:url', canonicalUrl);
  upsertMetaByProperty('og:type', 'website');
  upsertMetaByProperty('og:image', DEFAULT_OG_IMAGE);
  upsertMetaByName('twitter:card', 'summary_large_image');
  upsertMetaByName('twitter:title', seo.title);
  upsertMetaByName('twitter:description', seo.description);
  upsertMetaByName('twitter:image', DEFAULT_OG_IMAGE);
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

    const path = PAGE_PATHS[page === 'model-detail' ? 'models' : page];

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
      setNavData(null);
      setNavigationTick((tick) => tick + 1);
      setCurrentPage(getPageFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    applySeoForPage(currentPage, navData);
  }, [currentPage, navData]);

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
        return <ConfiguratorPage onNavigate={handleNavigate} navData={navData} />;
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
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminMode = currentPage === 'messages' && adminAccessStatus === 'admin';
  const isFullscreenPage = currentPage === 'configurator';
  const showNormalHeader = currentPage !== 'messages';
  const showFooter = currentPage !== 'messages' && !isFullscreenPage;

  return (
    <div className={`flex flex-col bg-gray-50 ${isFullscreenPage ? 'min-h-screen lg:h-screen lg:overflow-hidden' : 'min-h-screen'}`}>
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
      <main className={isFullscreenPage ? 'flex-1 min-h-0 flex flex-col relative lg:overflow-hidden' : 'flex-1'}>
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={handleNavigate} onOpenPrivacySettings={() => setPrivacySettingsOpen(true)} />}
      {showNormalHeader && !isFullscreenPage && (
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
