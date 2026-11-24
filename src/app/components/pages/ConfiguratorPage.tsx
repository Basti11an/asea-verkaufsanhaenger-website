import { ConfiguratorLayout } from "../configurator/ConfiguratorLayout";

type ConfiguratorPageProps = {
  onNavigate: (page: string) => void;
};

export function ConfiguratorPage({ onNavigate }: ConfiguratorPageProps) {
  return <ConfiguratorLayout onBack={() => onNavigate("models")} />;
}
