import {
  Check,
  ClipboardCheck,
  LockKeyhole,
  MoveHorizontal,
} from "lucide-react";
import { sidebarEquipmentIds, standardEquipment } from "./data/defaultConfiguration";
import {
  isUserConfigurableEquipmentId,
  type StandardEquipmentState,
} from "./data/standardEquipmentState";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  notice: string | null;
  selectedEquipmentId: string | null;
  equipmentState: StandardEquipmentState;
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
  const equipment = standardEquipment.filter((item) => (
    sidebarEquipmentIds.includes(item.id as (typeof sidebarEquipmentIds)[number])
    && (!isUserConfigurableEquipmentId(item.id) || equipmentState[item.id].active)
  ));
  const selectedId = selectedEquipmentId && isUserConfigurableEquipmentId(selectedEquipmentId)
    ? selectedEquipmentId
    : null;

  return (
    <aside className="asea-equipment-sidebar">
      <div className="asea-sidebar-heading">
        <ClipboardCheck size={18} aria-hidden="true" />
        <h2>{text("equipment")}</h2>
      </div>
      <ul className="asea-standard-list">
        {equipment.map((item) => {
          const isMovable = isUserConfigurableEquipmentId(item.id);
          const isFixed = item.id === "standard-gas-cabinet";
          const isSelected = item.id === selectedId;

          return (
            <li key={item.id} className={isSelected ? "is-selected" : undefined}>
              {isMovable ? (
                <button
                  type="button"
                  className="asea-standard-item-button"
                  aria-pressed={isSelected}
                  onClick={() => onEquipmentSelect(item.id)}
                >
                  <span className="asea-standard-check"><MoveHorizontal size={13} aria-hidden="true" /></span>
                  <span>{name(item.name)}</span>
                </button>
              ) : (
                <>
                  <span className="asea-standard-check">
                    {isFixed ? <LockKeyhole size={12} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}
                  </span>
                  <span>{name(item.name)}</span>
                </>
              )}
            </li>
          );
        })}
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
