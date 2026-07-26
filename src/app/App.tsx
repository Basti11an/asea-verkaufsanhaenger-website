import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { trackAnalyticsEvent } from './lib/analytics';

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

function AppInner() {
  const { lang } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navData, setNavData] = useState<any>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [navigationTick, setNavigationTick] = useState(0);
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

    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  useLayoutEffect(() => {
    scrollToTop();
  }, [currentPage, navigationTick]);

  useEffect(() => {
    const pagePath = PUBLIC_ANALYTICS_PAGES[currentPage];
    if (!pagePath) return;

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
  }, [currentPage, navData, lang]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setIsAdminAuthenticated(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setIsAdminAuthenticated(false);
    setAdminActiveTab('dashboard');
    setCurrentPage('home');
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
        return <ContactPage prefillData={navData} />;
      case 'imprint':
        return <ImprintPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'messages':
        return isAdminAuthenticated ? (
          <MessagesPage
            activeTab={adminActiveTab}
            onLogout={handleAdminLogout}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} onNavigate={handleNavigate} />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminMode = currentPage === 'messages' && isAdminAuthenticated;
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
      <main className={isFullscreenPage ? 'flex-1 flex flex-col relative lg:overflow-hidden' : 'flex-1'}>
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={handleNavigate} />}
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
