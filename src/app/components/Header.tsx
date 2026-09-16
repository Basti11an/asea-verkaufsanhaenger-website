import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { availableLanguages, useLanguage, type Lang } from '../context/LanguageContext';
import { AseaWordmark } from './AseaWordmark';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
}

const languageLabels: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  sk: 'Slovenčina',
};

function LanguageDropdown() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectLanguage = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div
      className="relative select-none"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 min-w-[72px] items-center justify-between gap-2 border border-[#161615]/15 bg-[#f8f7f3] px-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#2f2f2d] outline-none transition-colors duration-200 hover:border-[#b08a57]/50 hover:text-[#9a7445] md:min-w-[78px]"
      >
        <span>{lang.toUpperCase()}</span>
        <span className="text-[10px] leading-none text-[#b08a57]" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-36 border border-[#161615]/10 bg-[#f8f7f3] py-1 shadow-[0_8px_20px_rgba(22,22,21,0.08)]"
        >
          {availableLanguages.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitem"
              onClick={() => selectLanguage(code)}
              className={`block w-full px-4 py-2.5 text-left text-[13px] transition-colors duration-150 ${
                lang === code
                  ? 'bg-[#b08a57]/10 text-[#9a7445]'
                  : 'text-[#2f2f2d]/70 hover:bg-[#b08a57]/[0.07] hover:text-[#2f2f2d]'
              }`}
            >
              {languageLabels[code]}
            </button>
          ))}
        </div>
      )}
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
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f8f7f3] border-b-2 border-[#b08a57] shadow-[0_1px_24px_rgba(22,22,21,0.05)]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="relative flex h-[92px] items-center justify-between lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8 xl:gap-10">
          {/* Wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('home')}
              className="outline-none transition-opacity duration-200 hover:opacity-80"
            >
              <AseaWordmark size="header" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden min-w-0 items-center justify-center gap-11 lg:flex xl:gap-14">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`group relative py-2 text-[13px] uppercase tracking-[0.15em] outline-none transition-colors duration-200 xl:text-[14px] ${
                  currentPage === item.id
                    ? 'text-[#b08a57]'
                    : 'text-[#161615]/70 hover:text-[#161615]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 bg-[#b08a57] transition-all duration-200 ease-out ${
                    currentPage === item.id ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-6 group-hover:opacity-50'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Desktop Right: CTA + Language */}
          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            <Button
              onClick={() => handleNavigate('contact')}
              className="h-[50px] rounded-[2px] bg-[#b08a57] px-8 text-[13px] uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-[#9a7749]"
            >
              {t('nav_cta')}
            </Button>
            <LanguageDropdown />
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageDropdown />
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
              <div className="pt-6 mt-2 border-t border-[#161615]/10">
                <Button
                  onClick={() => handleNavigate('contact')}
                  className="w-full bg-[#b08a57] text-white hover:bg-[#9a7749] text-[13px] uppercase tracking-[0.15em] h-[52px] rounded-[2px] transition-all duration-500 flex items-center justify-center gap-2.5"
                >
                  {t('nav_cta')}
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
