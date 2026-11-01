import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LockKeyhole,
  MoveHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { sidebarEquipmentIds, standardEquipment } from "./data/defaultConfiguration";
import {
  equipmentPlacementDefinitions,
  isMovableStandardEquipmentId,
  type StandardEquipmentState,
} from "./data/standardEquipmentState";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  notice: string | null;
  selectedEquipmentId: string | null;
  equipmentState: StandardEquipmentState;
  onEquipmentSelect: (equipmentId: string) => void;
  onEquipmentCenterChange: (equipmentId: string, value: number) => void;
  onEquipmentRemove: (equipmentId: string) => void;
  onFinish: () => void;
};

export function EquipmentSidebar({
  notice,
  selectedEquipmentId,
  equipmentState,
  onEquipmentSelect,
  onEquipmentCenterChange,
  onEquipmentRemove,
  onFinish,
}: EquipmentSidebarProps) {
  const { text, name } = useConfiguratorCopy();
  const equipment = standardEquipment.filter((item) => (
    sidebarEquipmentIds.includes(item.id as (typeof sidebarEquipmentIds)[number])
    && (!isMovableStandardEquipmentId(item.id) || equipmentState[item.id].active)
  ));
  const selectedId = selectedEquipmentId && isMovableStandardEquipmentId(selectedEquipmentId)
    ? selectedEquipmentId
    : null;
  const selectedDefinition = selectedId ? equipmentPlacementDefinitions[selectedId] : null;
  const selectedState = selectedId ? equipmentState[selectedId] : null;
  const selectedItem = selectedId ? standardEquipment.find((item) => item.id === selectedId) : null;
  const selectedHelp = selectedId === "standard-gas-griddles"
    ? text("gasGriddleMoveHelp")
    : selectedId === "standard-hygiene"
      ? text("hygieneMoveHelp")
      : text("equipmentMoveHelp");

  return (
    <aside className="asea-equipment-sidebar">
      <div className="asea-sidebar-heading">
        <ClipboardCheck size={18} aria-hidden="true" />
        <h2>{text("equipment")}</h2>
      </div>
      <ul className="asea-standard-list">
        {equipment.map((item) => {
          const isMovable = isMovableStandardEquipmentId(item.id);
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
      {selectedId && selectedDefinition && selectedState && selectedItem ? (
        <div className="asea-placement-panel">
          <div className="asea-placement-heading">
            <MoveHorizontal size={16} aria-hidden="true" />
            <strong>{name(selectedItem.name)}</strong>
          </div>
          <label htmlFor="equipment-position">{text("centerFromLeft")}</label>
          <input
            id="equipment-position"
            type="range"
            min={selectedDefinition.minCenterCm}
            max={selectedDefinition.maxCenterCm}
            step={0.5}
            value={selectedState.centerCm}
            onChange={(event) => onEquipmentCenterChange(selectedId, Number(event.target.value))}
          />
          <div className="asea-centimeter-control">
            <button
              type="button"
              title={text("moveLeft")}
              aria-label={text("moveLeft")}
              disabled={selectedState.centerCm <= selectedDefinition.minCenterCm}
              onClick={() => onEquipmentCenterChange(selectedId, selectedState.centerCm - 1)}
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <div>
              <input
                type="number"
                min={selectedDefinition.minCenterCm}
                max={selectedDefinition.maxCenterCm}
                step={0.5}
                value={selectedState.centerCm}
                aria-label={text("centerFromLeft")}
                onChange={(event) => onEquipmentCenterChange(selectedId, Number(event.target.value))}
              />
              <span>cm</span>
            </div>
            <button
              type="button"
              title={text("moveRight")}
              aria-label={text("moveRight")}
              disabled={selectedState.centerCm >= selectedDefinition.maxCenterCm}
              onClick={() => onEquipmentCenterChange(selectedId, selectedState.centerCm + 1)}
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
          <p>{selectedHelp}</p>
          <div className="asea-placement-actions">
            <button
              type="button"
              className="asea-reset-position"
              disabled={selectedState.centerCm === selectedDefinition.defaultCenterCm}
              onClick={() => onEquipmentCenterChange(selectedId, selectedDefinition.defaultCenterCm)}
            >
              <RotateCcw size={14} aria-hidden="true" />
              {text("resetPosition")}
            </button>
            <button
              type="button"
              className="asea-remove-equipment"
              onClick={() => onEquipmentRemove(selectedId)}
            >
              <Trash2 size={14} aria-hidden="true" />
              {text("removeEquipment")}
            </button>
          </div>
        </div>
      ) : null}
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
