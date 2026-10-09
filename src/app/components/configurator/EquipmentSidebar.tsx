import { Check, ClipboardCheck } from "lucide-react";
import { sidebarEquipmentIds, standardEquipment } from "./data/defaultConfiguration";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  notice: string | null;
  onFinish: () => void;
};

export function EquipmentSidebar({ notice, onFinish }: EquipmentSidebarProps) {
  const { text, name } = useConfiguratorCopy();
  const equipment = standardEquipment.filter((item) => sidebarEquipmentIds.includes(
    item.id as (typeof sidebarEquipmentIds)[number],
  ));

  return (
    <aside className="asea-equipment-sidebar">
      <div className="asea-sidebar-heading">
        <ClipboardCheck size={18} aria-hidden="true" />
        <h2>{text("equipment")}</h2>
      </div>
      <ul className="asea-standard-list">
        {equipment.map((item) => (
          <li key={item.id}>
            <span className="asea-standard-check"><Check size={13} aria-hidden="true" /></span>
            <span>{name(item.name)}</span>
          </li>
        ))}
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
