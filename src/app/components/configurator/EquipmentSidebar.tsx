import { Check, ChevronLeft, ChevronRight, ClipboardCheck, MoveHorizontal, RotateCcw } from "lucide-react";
import { gasGriddlePlacement, sidebarEquipmentIds, standardEquipment } from "./data/defaultConfiguration";
import { useConfiguratorCopy } from "./copy";

type EquipmentSidebarProps = {
  notice: string | null;
  selectedEquipmentId: string | null;
  gasGriddleCenterCm: number;
  onEquipmentSelect: (equipmentId: string) => void;
  onGasGriddleCenterChange: (value: number) => void;
  onFinish: () => void;
};

const GAS_GRIDDLE_EQUIPMENT_ID = "standard-gas-griddles";

export function EquipmentSidebar({
  notice,
  selectedEquipmentId,
  gasGriddleCenterCm,
  onEquipmentSelect,
  onGasGriddleCenterChange,
  onFinish,
}: EquipmentSidebarProps) {
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
        {equipment.map((item) => {
          const isMovable = item.id === GAS_GRIDDLE_EQUIPMENT_ID;
          const isSelected = item.id === selectedEquipmentId;

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
                  <span className="asea-standard-check"><Check size={13} aria-hidden="true" /></span>
                  <span>{name(item.name)}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {selectedEquipmentId === GAS_GRIDDLE_EQUIPMENT_ID ? (
        <div className="asea-placement-panel">
          <div className="asea-placement-heading">
            <MoveHorizontal size={16} aria-hidden="true" />
            <strong>{text("position")}</strong>
          </div>
          <label htmlFor="gas-griddle-position">{text("centerFromLeft")}</label>
          <input
            id="gas-griddle-position"
            type="range"
            min={gasGriddlePlacement.minCenterCm}
            max={gasGriddlePlacement.maxCenterCm}
            step={gasGriddlePlacement.stepCm}
            value={gasGriddleCenterCm}
            onChange={(event) => onGasGriddleCenterChange(Number(event.target.value))}
          />
          <div className="asea-centimeter-control">
            <button
              type="button"
              title={text("moveLeft")}
              aria-label={text("moveLeft")}
              disabled={gasGriddleCenterCm <= gasGriddlePlacement.minCenterCm}
              onClick={() => onGasGriddleCenterChange(gasGriddleCenterCm - 1)}
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <div>
              <input
                type="number"
                min={gasGriddlePlacement.minCenterCm}
                max={gasGriddlePlacement.maxCenterCm}
                step={gasGriddlePlacement.stepCm}
                value={gasGriddleCenterCm}
                aria-label={text("centerFromLeft")}
                onChange={(event) => onGasGriddleCenterChange(Number(event.target.value))}
              />
              <span>cm</span>
            </div>
            <button
              type="button"
              title={text("moveRight")}
              aria-label={text("moveRight")}
              disabled={gasGriddleCenterCm >= gasGriddlePlacement.maxCenterCm}
              onClick={() => onGasGriddleCenterChange(gasGriddleCenterCm + 1)}
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
          <p>{text("gasGriddleMoveHelp")}</p>
          <button
            type="button"
            className="asea-reset-position"
            disabled={gasGriddleCenterCm === gasGriddlePlacement.defaultCenterCm}
            onClick={() => onGasGriddleCenterChange(gasGriddlePlacement.defaultCenterCm)}
          >
            <RotateCcw size={14} aria-hidden="true" />
            {text("resetPosition")}
          </button>
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
