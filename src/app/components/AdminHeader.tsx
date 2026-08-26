import { Lock, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAdminData } from '../context/AdminDataContext';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const TABS = [
  { id: 'eingaenge', label: 'Eingänge' },
  { id: 'modelle', label: 'Modelle' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'dashboard', label: 'Dashboard', status: 'Außer Betrieb' },
];

export function AdminHeader({ activeTab, setActiveTab, onNavigate, onLogout }: AdminHeaderProps) {
  const { references, contactRequests } = useAdminData();
  const newEntriesCount =
    references.filter((reference) => reference.status === 'pending').length +
    contactRequests.filter((request) => request.status === 'new' && !request.isRead).length;

  return (
    <header
      className="text-white sticky top-0 z-50 border-b border-white/10 shadow-xl"
      style={{ backgroundColor: '#1e2a3a' }}
    >
      <div className="flex w-full flex-col gap-2 px-3 py-2 md:h-[52px] md:flex-row md:items-center md:gap-6 md:px-6 md:py-0">
        <div className="flex items-center justify-between gap-3 md:contents">
          <div className="flex items-center gap-2 shrink-0">
            <Lock size={14} className="text-[#c8a96e]" />
            <span
              className="text-[#c8a96e] text-sm tracking-widest select-none"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            >
              ASEA Admin
            </span>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('home')}
              className="h-8 border-white/30 text-white hover:bg-white/10 bg-transparent text-xs px-2.5"
            >
              Start
            </Button>
            <Button
              size="sm"
              onClick={onLogout}
              className="h-8 bg-red-900/70 hover:bg-red-800 text-white border-none text-xs px-2.5"
              aria-label="Abmelden"
              title="Abmelden"
            >
              <LogOut size={13} />
            </Button>
          </div>
        </div>

        <nav className="-mx-3 flex overflow-x-auto px-3 md:mx-0 md:h-full md:flex-1 md:items-center md:justify-center md:overflow-visible md:px-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative h-10 shrink-0 px-4 text-sm transition-all duration-200 flex items-center gap-2 md:h-full md:px-5
                ${activeTab === tab.id
                  ? 'text-white border-b-2 border-[#b08a57]'
                  : 'text-white/55 hover:text-white/85 border-b-2 border-transparent'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.id === 'eingaenge' && newEntriesCount > 0 && (
                <span className="min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white shadow-sm">
                  {newEntriesCount > 99 ? '99+' : newEntriesCount}
                </span>
              )}
              {tab.id === 'dashboard' && 'status' in tab && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-amber-200">
                  {tab.status}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 shrink-0 md:flex">
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
      </div>
    </header>
  );
}
