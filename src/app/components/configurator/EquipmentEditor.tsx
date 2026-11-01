import { ChevronLeft, ChevronRight, MoveHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { useConfiguratorCopy } from "./copy";
import { productById } from "./data/products";
import {
  equipmentPlacementDefinitions,
  type EquipmentConfigurationState,
} from "./data/equipmentConfiguration";
import type { EquipmentSide } from "./types";

type EquipmentEditorProps = {
  selectedEquipmentId: string | null;
  equipmentState: EquipmentConfigurationState;
  onEquipmentCenterChange: (equipmentId: string, value: number) => void;
  onEquipmentSideChange: (equipmentId: string, side: EquipmentSide) => void;
  onEquipmentRemove: (equipmentId: string) => void;
};

export function EquipmentEditor({
  selectedEquipmentId,
  equipmentState,
  onEquipmentCenterChange,
  onEquipmentSideChange,
  onEquipmentRemove,
}: EquipmentEditorProps) {
  const { text, name } = useConfiguratorCopy();
  const placement = equipmentState.items.find((item) => item.id === selectedEquipmentId);
  if (!placement) return null;

  const definition = equipmentPlacementDefinitions[placement.productId];
  const product = productById.get(placement.productId);
  if (!product) return null;

  const help = placement.productId === "hygiene-area"
    ? text("hygieneMoveHelp")
    : placement.productId === "gas-griddle"
      ? text("gasGriddleMoveHelp")
      : placement.productId === "fryer" || placement.productId === "double-fryer"
        ? text("fryerMoveHelp")
        : text("equipmentMoveHelp");
  const defaultCenter = definition.defaultCenterCm[placement.side];

  return (
    <section className="asea-equipment-editor" aria-label={text("editEquipment")}>
      <div className="asea-editor-identity">
        <MoveHorizontal size={18} aria-hidden="true" />
        <div>
          <strong>{name(product.name)}</strong>
          <span>{help}</span>
        </div>
      </div>
      <div className="asea-editor-side" role="group" aria-label={text("allowedSide")}>
        {definition.allowedSides.map((side) => (
          <button
            key={side}
            type="button"
            aria-pressed={placement.side === side}
            onClick={() => onEquipmentSideChange(placement.id, side)}
          >
            {text(side === "closed-wall" ? "closedWall" : "salesHatch")}
          </button>
        ))}
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
          onChange={(event) => onEquipmentCenterChange(placement.id, Number(event.target.value))}
        />
      </label>
      <div className="asea-centimeter-control">
        <button
          type="button"
          title={text("moveLeft")}
          aria-label={text("moveLeft")}
          disabled={placement.centerCm <= definition.minCenterCm}
          onClick={() => onEquipmentCenterChange(placement.id, placement.centerCm - 1)}
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
            onChange={(event) => onEquipmentCenterChange(placement.id, Number(event.target.value))}
          />
          <span>cm</span>
        </div>
        <button
          type="button"
          title={text("moveRight")}
          aria-label={text("moveRight")}
          disabled={placement.centerCm >= definition.maxCenterCm}
          onClick={() => onEquipmentCenterChange(placement.id, placement.centerCm + 1)}
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
          disabled={placement.centerCm === defaultCenter}
          onClick={() => onEquipmentCenterChange(placement.id, defaultCenter)}
        >
          <RotateCcw size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="asea-remove-equipment"
          title={text("removeEquipment")}
          aria-label={text("removeEquipment")}
          onClick={() => onEquipmentRemove(placement.id)}
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
