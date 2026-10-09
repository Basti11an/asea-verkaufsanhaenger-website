import { Box, PanelTop, Store, Warehouse } from "lucide-react";
import type { ConfiguratorView } from "./types";
import { useConfiguratorCopy } from "./copy";

type ConfiguratorTopbarProps = {
  view: ConfiguratorView;
  disabled: boolean;
  onViewChange: (view: ConfiguratorView) => void;
};

const views = [
  { id: "three", icon: Box },
  { id: "top", icon: PanelTop },
  { id: "front", icon: Store },
  { id: "rear", icon: Warehouse },
] as const;

export function ConfiguratorTopbar({ view, disabled, onViewChange }: ConfiguratorTopbarProps) {
  const { text } = useConfiguratorCopy();

  return (
    <header className="asea-config-topbar">
      <div className="asea-config-brand">
        <img src="/asea-logo.png" alt="ASEA" />
        <span>{text("title")}</span>
      </div>
      <div className="asea-view-switcher" role="group" aria-label={text("viewSelector")}>
        {views.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={view === id}
            disabled={disabled}
            title={text(id)}
            onClick={() => onViewChange(id)}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{text(id)}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
