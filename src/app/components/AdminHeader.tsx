import { Lock, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const TABS = [
  { id: 'modelle', label: 'Modelle' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'eingaenge', label: 'Eingänge' },
];

export function AdminHeader({ activeTab, setActiveTab, onNavigate, onLogout }: AdminHeaderProps) {
  return (
    <header
      className="text-white px-6 flex items-center gap-6 sticky top-0 z-50 border-b border-white/10 shadow-xl"
      style={{ backgroundColor: '#1e2a3a', height: '52px' }}
    >
      {/* Left: Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <Lock size={14} className="text-[#c8a96e]" />
        <span
          className="text-[#c8a96e] text-sm tracking-widest select-none"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
        >
          ASEA Admin
        </span>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex items-center flex-1 justify-center h-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative h-full px-5 text-sm transition-all duration-200 flex items-center gap-2
              ${activeTab === tab.id
                ? 'text-white border-b-2 border-[#b08a57]'
                : 'text-white/55 hover:text-white/85 border-b-2 border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('home')}
          className="h-7 border-white/30 text-white hover:bg-white/10 bg-transparent text-xs px-3"
        >
          ← Startseite
        </Button>
        <Button
          size="sm"
          onClick={onLogout}
          className="h-7 bg-red-900/70 hover:bg-red-800 text-white border-none text-xs px-3"
        >
          <LogOut size={12} className="mr-1.5" />
          Abmelden
        </Button>
      </div>
    </header>
  );
}
