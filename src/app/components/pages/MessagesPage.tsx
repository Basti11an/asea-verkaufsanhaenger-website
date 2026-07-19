import { Toaster } from 'sonner';
import { ModelleTab } from '../admin/ModelleTab';
import { ReferenzenTab } from '../admin/ReferenzenTab';
import { EingaengeTab } from '../admin/EingaengeTab';

interface MessagesPageProps {
  activeTab: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function MessagesPage({ activeTab }: MessagesPageProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Toaster position="top-right" richColors />

      {/* All tabs always mounted — hidden via CSS to preserve local edit state */}
      <div className={activeTab === 'modelle' ? '' : 'hidden'}>
        <ModelleTab />
      </div>

      <div className={activeTab === 'referenzen' ? '' : 'hidden'}>
        <ReferenzenTab />
      </div>

      <div className={activeTab === 'eingaenge' ? '' : 'hidden'}>
        <EingaengeTab />
      </div>
    </div>
  );
}
