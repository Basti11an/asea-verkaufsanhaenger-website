import { useLanguage } from '../context/LanguageContext';

export function SettingsDropdown() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex rounded-[3px] border border-white/[0.12] overflow-hidden">
      {(['de', 'en'] as const).map((code) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={isActive}
            className={`px-3 py-1.5 text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#b08a57]/50 ${
              isActive
                ? 'bg-[#b08a57] text-white'
                : 'bg-transparent text-[#9c9a93] hover:text-white hover:bg-white/10'
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
