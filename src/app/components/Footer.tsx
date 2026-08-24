import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImage from '../../imports/LOGO_Neu.png';

interface FooterProps {
  onNavigate: (page: string, data?: any) => void;
  onOpenPrivacySettings?: () => void;
}

export function Footer({ onNavigate, onOpenPrivacySettings }: FooterProps) {
  const { t } = useLanguage();

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  return (
    <footer className="bg-[#1c1c1a] text-white relative overflow-hidden">
      {/* Decorative Bronze Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c8a96e] to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#b08a57]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b08a57]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Company Info */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImage}
                alt="ASEA Logo"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-[#77756f]">
              {t('footer_desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 font-semibold">{t('footer_navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav_home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('models')}
                  className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav_models')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav_contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4 font-semibold">{t('footer_contact_title')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 group">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-[#c8a96e] transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[#77756f]">Lahrndorf 34<br />A-4240 Waldburg</span>
              </li>
              <li className="flex items-center gap-2 group">
                <Phone size={16} className="flex-shrink-0 text-[#c8a96e] transition-transform duration-300 group-hover:scale-110" />
                <a href="tel:+436644105007" className="text-[#77756f] hover:text-[#b08a57] transition-colors">
                  +43 664 410 5 007
                </a>
              </li>
              <li className="flex items-center gap-2 group">
                <Mail size={16} className="flex-shrink-0 text-[#c8a96e] transition-transform duration-300 group-hover:scale-110" />
                <a href="mailto:office@verkaufsanhaenger-asea.at" className="text-[#77756f] hover:text-[#b08a57] transition-colors break-all">
                  office@verkaufsanhaenger-asea.at
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white mb-4 font-semibold">{t('footer_hours_title')}</h3>
            <ul className="space-y-2 text-sm text-[#77756f]">
              <li className="flex justify-between">
                <span>{t('footer_hours_mofr')}</span>
                <span className="text-white">08:00 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span>{t('footer_hours_sat')}</span>
                <span className="text-white">09:00 - 13:00</span>
              </li>
              <li className="flex justify-between">
                <span>{t('footer_hours_sun')}</span>
                <span className="text-white">{t('footer_hours_closed')}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#2f2f2d] flex items-center justify-center text-[#77756f] hover:bg-[#b08a57] hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#2f2f2d] flex items-center justify-center text-[#77756f] hover:bg-[#b08a57] hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#2f2f2d] flex items-center justify-center text-[#77756f] hover:bg-[#b08a57] hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#77756f]/20 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[#77756f]">{t('footer_copyright')}</p>
          <div className="flex gap-6">
            <button
              onClick={() => handleNavigate('imprint')}
              className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:underline"
            >
              {t('footer_imprint')}
            </button>
            <button
              onClick={() => handleNavigate('privacy')}
              className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:underline"
            >
              {t('footer_privacy')}
            </button>
            {onOpenPrivacySettings && (
              <button
                onClick={onOpenPrivacySettings}
                className="text-[#77756f] hover:text-[#b08a57] transition-all duration-300 hover:underline"
              >
                {t('footer_privacy_settings')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
