import { Check, ChevronRight, ClipboardCheck, Droplets, Flame, PackageOpen, Snowflake } from "lucide-react";
import { productById } from "./data/products";
import type { EquipmentConfigurationState } from "./data/equipmentConfiguration";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  selectedEquipmentId: string | null;
  equipmentState: EquipmentConfigurationState;
  onEquipmentSelect: (equipmentId: string) => void;
  onFinish: () => void;
};

export function EquipmentSidebar({
  selectedEquipmentId,
  equipmentState,
  onEquipmentSelect,
  onFinish,
}: EquipmentSidebarProps) {
  const { text, name } = useConfiguratorCopy();

  return (
    <aside className="asea-equipment-sidebar">
      <div className="asea-sidebar-heading">
        <ClipboardCheck size={18} aria-hidden="true" />
        <h2>{text("equipment")}</h2>
      </div>
      <ul className="asea-standard-list">
        {equipmentState.items.map((item, index) => {
          const product = productById.get(item.productId);
          if (!product) return null;
          const isSelected = item.id === selectedEquipmentId;
          const duplicateCount = equipmentState.items
            .slice(0, index)
            .filter((other) => other.productId === item.productId).length;
          const label = duplicateCount > 0 ? `${name(product.name)} ${duplicateCount + 1}` : name(product.name);
          const Icon = product.category === "cooking" ? Flame : product.category === "cooling" ? Snowflake : product.category === "hygiene" ? Droplets : PackageOpen;

          return (
            <li key={item.id} className={isSelected ? "is-selected" : undefined}>
              <button
                type="button"
                className="asea-standard-item-button"
                aria-pressed={isSelected}
                onClick={() => onEquipmentSelect(item.id)}
              >
                <span className="asea-standard-icon"><Icon size={14} aria-hidden="true" /></span>
                <span className="asea-standard-name">{label}</span>
                <ChevronRight size={14} className="asea-standard-chevron" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="asea-sidebar-finish">
        <button type="button" className="asea-finish-button" onClick={onFinish}>
          <Check size={16} aria-hidden="true" />
          {text("finish")}
        </button>
      </div>
    </aside>
  );
}
