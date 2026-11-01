import {
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useConfiguratorCopy } from "./copy";
import { standardEquipment } from "./data/defaultConfiguration";
import {
  equipmentPlacementDefinitions,
  isUserConfigurableEquipmentId,
  type StandardEquipmentState,
} from "./data/standardEquipmentState";

type EquipmentEditorProps = {
  selectedEquipmentId: string | null;
  equipmentState: StandardEquipmentState;
  onEquipmentCenterChange: (equipmentId: string, value: number) => void;
  onEquipmentRemove: (equipmentId: string) => void;
};

export function EquipmentEditor({
  selectedEquipmentId,
  equipmentState,
  onEquipmentCenterChange,
  onEquipmentRemove,
}: EquipmentEditorProps) {
  const { text, name } = useConfiguratorCopy();
  const selectedId = selectedEquipmentId && isUserConfigurableEquipmentId(selectedEquipmentId)
    ? selectedEquipmentId
    : null;

  if (!selectedId || !equipmentState[selectedId].active) return null;

  const definition = equipmentPlacementDefinitions[selectedId];
  const placement = equipmentState[selectedId];
  const equipment = standardEquipment.find((item) => item.id === selectedId);
  if (!equipment) return null;

  const help = selectedId === "standard-gas-griddles"
    ? text("gasGriddleMoveHelp")
    : selectedId === "standard-hygiene"
      ? text("hygieneMoveHelp")
      : selectedId === "standard-double-fryer"
        ? text("fryerMoveHelp")
        : text("equipmentMoveHelp");

  return (
    <section className="asea-equipment-editor" aria-label={text("editEquipment")}>
      <div className="asea-editor-identity">
        <MoveHorizontal size={18} aria-hidden="true" />
        <div>
          <strong>{name(equipment.name)}</strong>
          <span>{help}</span>
        </div>
      </div>
      <label className="asea-editor-slider" htmlFor="equipment-position">
        <span>{text("centerFromLeft")}</span>
        <input
          id="equipment-position"
          type="range"
          min={definition.minCenterCm}
          max={definition.maxCenterCm}
          step={0.5}
          value={placement.centerCm}
          onChange={(event) => onEquipmentCenterChange(selectedId, Number(event.target.value))}
        />
      </label>
      <div className="asea-centimeter-control">
        <button
          type="button"
          title={text("moveLeft")}
          aria-label={text("moveLeft")}
          disabled={placement.centerCm <= definition.minCenterCm}
          onClick={() => onEquipmentCenterChange(selectedId, placement.centerCm - 1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <input
            type="number"
            min={definition.minCenterCm}
            max={definition.maxCenterCm}
            step={0.5}
            value={placement.centerCm}
            aria-label={text("centerFromLeft")}
            onChange={(event) => onEquipmentCenterChange(selectedId, Number(event.target.value))}
          />
          <span>cm</span>
        </div>
        <button
          type="button"
          title={text("moveRight")}
          aria-label={text("moveRight")}
          disabled={placement.centerCm >= definition.maxCenterCm}
          onClick={() => onEquipmentCenterChange(selectedId, placement.centerCm + 1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="asea-editor-actions">
        <button
          type="button"
          className="asea-reset-position"
          title={text("resetPosition")}
          aria-label={text("resetPosition")}
          disabled={placement.centerCm === definition.defaultCenterCm}
          onClick={() => onEquipmentCenterChange(selectedId, definition.defaultCenterCm)}
        >
          <RotateCcw size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="asea-remove-equipment"
          title={text("removeEquipment")}
          aria-label={text("removeEquipment")}
          onClick={() => onEquipmentRemove(selectedId)}
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
