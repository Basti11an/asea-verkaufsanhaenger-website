import { TrailerConfigurator } from '../configurator/TrailerConfigurator';

interface ConfiguratorPageProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function ConfiguratorPage({ onNavigate }: ConfiguratorPageProps) {
  return (
    <div className="w-full bg-[#f8f7f3] flex flex-col lg:h-full lg:overflow-hidden">
      <div className="flex-1 w-full p-4 md:p-6 lg:p-8 xl:p-12 lg:overflow-hidden">
        <TrailerConfigurator onNavigate={onNavigate} />
      </div>
    </div>
  );
}
