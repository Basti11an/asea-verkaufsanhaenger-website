import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AdminDataProvider } from './context/AdminDataContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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
import { MessagesPage } from './components/pages/MessagesPage';
import { AdminLogin } from './components/AdminLogin';
import { ConfiguratorPage } from './components/pages/ConfiguratorPage';
import { PrivacyConsentBanner } from './components/PrivacyConsentBanner';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { trackAnalyticsEvent } from './lib/analytics';
import { hasStatisticsConsent } from './lib/privacyConsent';
import { getAdminAccess, type AdminAccessStatus } from './lib/adminAuth';

const PUBLIC_ANALYTICS_PAGES: Record<string, string> = {
  home: 'home',
  about: 'about',
  configurator: 'configurator',
  models: 'models',
  'model-detail': 'model-detail',
  equipment: 'equipment',
  contact: 'contact',
  imprint: 'imprint',
  privacy: 'privacy',
};

const PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/ueber-uns',
  configurator: '/konfigurator',
  models: '/modelle',
  equipment: '/ausstattung',
  contact: '/kontakt',
  imprint: '/impressum',
  privacy: '/datenschutz',
  messages: '/admin',
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

function AppInner() {
  const { lang } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>(getPageFromLocation);
  const [navData, setNavData] = useState<any>(null);
  const [adminAccessStatus, setAdminAccessStatus] = useState<AdminAccessStatus>('guest');
  const [adminAccessMessage, setAdminAccessMessage] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [navigationTick, setNavigationTick] = useState(0);
  const [privacySettingsOpen, setPrivacySettingsOpen] = useState(false);
  const [consentVersion, setConsentVersion] = useState(0);
  const lastAnalyticsKeyRef = useRef('');

  const scrollToTop = () => {
    const html = document.documentElement;
    const body = document.body;
    const scrollingElement = document.scrollingElement || html;
    const previousHtmlBehavior = html.style.scrollBehavior;
    const previousBodyBehavior = body.style.scrollBehavior;

    html.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    const run = () => {
      window.scrollTo(0, 0);
      scrollingElement.scrollTop = 0;
      html.scrollTop = 0;
      body.scrollTop = 0;
    };

    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 0);
    window.setTimeout(run, 80);
    window.setTimeout(() => {
      html.style.scrollBehavior = previousHtmlBehavior;
      body.style.scrollBehavior = previousBodyBehavior;
    }, 120);
  };

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
      setAdminActiveTab('dashboard');

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
    scrollToTop();
  }, [currentPage, navigationTick]);

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
    const existingMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-asea-dynamic="true"]');

    if (currentPage === 'messages') {
      const meta = existingMeta ?? document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex,nofollow';
      meta.dataset.aseaDynamic = 'true';

      if (!existingMeta) {
        document.head.appendChild(meta);
      }

      return;
    }

    existingMeta?.remove();
  }, [currentPage]);

  useEffect(() => {
    const pagePath = PUBLIC_ANALYTICS_PAGES[currentPage];
    if (!pagePath) return;

    if (!hasStatisticsConsent()) {
      lastAnalyticsKeyRef.current = '';
      return;
    }

    const model = currentPage === 'model-detail' ? navData?.model : null;
    const modelId = model ? String(model.id ?? model.name ?? '') : '';
    const analyticsKey = `${currentPage}|${modelId}`;

    if (lastAnalyticsKeyRef.current === analyticsKey) return;
    lastAnalyticsKeyRef.current = analyticsKey;

    void trackAnalyticsEvent('page_view', {
      pagePath,
      language: lang,
    });

    if (currentPage === 'model-detail' && model) {
      void trackAnalyticsEvent('model_view', {
        modelId: modelId || String(model.name),
        modelName: String(model.name ?? ''),
        language: lang,
      });
    }
  }, [currentPage, navData, lang, consentVersion]);

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
        setAdminActiveTab('dashboard');
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
    setAdminActiveTab('dashboard');
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
      {showNormalHeader && (
        <PrivacyConsentBanner
          forceOpen={privacySettingsOpen}
          onClose={() => setPrivacySettingsOpen(false)}
          onConsentChange={() => setConsentVersion((version) => version + 1)}
          onNavigate={handleNavigate}
        />
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
