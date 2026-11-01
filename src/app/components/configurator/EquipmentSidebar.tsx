import { Check, ClipboardCheck, LockKeyhole, MoveHorizontal } from "lucide-react";
import { productById } from "./data/products";
import type { EquipmentConfigurationState } from "./data/equipmentConfiguration";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  notice: string | null;
  selectedEquipmentId: string | null;
  equipmentState: EquipmentConfigurationState;
  onEquipmentSelect: (equipmentId: string) => void;
  onFinish: () => void;
};

export function EquipmentSidebar({
  notice,
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
        <li>
          <span className="asea-standard-check"><LockKeyhole size={12} aria-hidden="true" /></span>
          <span>{text("gasCabinetFixed")}</span>
        </li>
        {equipmentState.items.map((item, index) => {
          const product = productById.get(item.productId);
          if (!product) return null;
          const isSelected = item.id === selectedEquipmentId;
          const duplicateCount = equipmentState.items
            .slice(0, index)
            .filter((other) => other.productId === item.productId).length;
          const label = duplicateCount > 0 ? `${name(product.name)} ${duplicateCount + 1}` : name(product.name);

          return (
            <li key={item.id} className={isSelected ? "is-selected" : undefined}>
              <button
                type="button"
                className="asea-standard-item-button"
                aria-pressed={isSelected}
                onClick={() => onEquipmentSelect(item.id)}
              >
                <span className="asea-standard-check"><MoveHorizontal size={13} aria-hidden="true" /></span>
                <span>{label}</span>
              </button>
            </li>
          );
        })}
        <li>
          <span className="asea-standard-check"><Check size={13} aria-hidden="true" /></span>
          <span>{text("workSurfacesFixed")}</span>
        </li>
      </ul>
      <div className="asea-sidebar-finish">
        <p className="asea-inline-notice" role="status" aria-live="polite">{notice}</p>
        <button type="button" className="asea-finish-button" onClick={onFinish}>
          <Check size={16} aria-hidden="true" />
          {text("finish")}
        </button>
      </div>
    </aside>
  );
}
