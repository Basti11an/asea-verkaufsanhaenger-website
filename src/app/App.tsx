import { useState } from 'react';
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
import { MessagesPage } from './components/pages/MessagesPage';
import { AdminLogin } from './components/AdminLogin';
import { ConfiguratorPage } from './components/pages/ConfiguratorPage';

function AppInner() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navData, setNavData] = useState<any>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('modelle');

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setNavData(data ?? null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminActiveTab('modelle');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'configurator':
        return <ConfiguratorPage onNavigate={handleNavigate} />;
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
