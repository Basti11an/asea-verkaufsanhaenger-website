import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { availableLanguages, useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-2 select-none">
      {availableLanguages.map((code, i) => (
        <div key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-[#161615]/25">|</span>}
          <button
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`text-[13px] uppercase tracking-[0.12em] transition-colors duration-300 outline-none ${
              lang === code
                ? 'text-[#b08a57] font-semibold'
                : 'text-[#161615]/45 hover:text-[#161615]'
            }`}
          >
            {code.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('nav_home') },
    { id: 'about', label: t('nav_about') },
    { id: 'models', label: t('nav_models') },
    { id: 'contact', label: t('nav_contact') },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f8f7f3] border-b-2 border-[#b08a57] shadow-[0_1px_24px_rgba(22,22,21,0.05)] transition-all duration-500">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="relative flex items-center justify-between h-[92px]">
          {/* Wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('home')}
              className="text-[#b08a57] tracking-[0.22em] hover:opacity-75 transition-opacity duration-500 outline-none -ml-2 border-r-2 border-[#2f2f2d]/15 pr-8"
              style={{ fontSize: '30px', fontWeight: 700, lineHeight: 1 }}
            >
              ASEA
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 xl:gap-16">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`relative py-2 transition-all duration-500 text-[13px] xl:text-[14px] uppercase tracking-[0.15em] group outline-none ${
                  currentPage === item.id
                    ? 'text-[#b08a57]'
                    : 'text-[#161615]/70 hover:text-[#161615]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#b08a57] transition-all duration-500 ease-out ${
                    currentPage === item.id ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-6 group-hover:opacity-50'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Desktop Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-10 xl:gap-12 pr-4 xl:pr-8">
            <LanguageToggle />
            <Button
              onClick={() => handleNavigate('contact')}
              className="bg-[#b08a57] text-white hover:bg-[#9a7749] text-[13px] uppercase tracking-[0.15em] h-[50px] px-8 rounded-[2px] transition-all duration-500 hover:shadow-[0_4px_24px_rgba(176,138,87,0.3)] flex items-center gap-2.5"
            >
              {t('nav_cta')}
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#161615]/70 hover:text-[#b08a57] transition-colors duration-300 outline-none"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>


        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-[92px] left-0 right-0 bg-[#f8f7f3] border-b border-[#161615]/10 p-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`block w-full text-center px-4 py-4 transition-all duration-500 text-[14px] uppercase tracking-[0.15em] rounded-[2px] ${
                    currentPage === item.id
                      ? 'text-[#b08a57] bg-[#b08a57]/[0.06]'
                      : 'text-[#161615]/70 hover:text-[#161615] hover:bg-[#161615]/[0.03]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex justify-center py-4 border-t border-[#161615]/10">
                <LanguageToggle />
              </div>
              <div className="pt-6 mt-2 border-t border-[#161615]/10">
                <Button
                  onClick={() => handleNavigate('contact')}
                  className="w-full bg-[#b08a57] text-white hover:bg-[#9a7749] text-[13px] uppercase tracking-[0.15em] h-[52px] rounded-[2px] transition-all duration-500 flex items-center justify-center gap-2.5"
                >
                  {t('nav_cta')}
                  <ArrowRight size={16} strokeWidth={2} />
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
