import { Check, Trash2, X } from "lucide-react";
import { useConfiguratorCopy } from "./copy";
import { productById } from "./demoProducts";
import type { Placement } from "./types";
export function ProductEditor({
  draft,
  editing,
  onPosition,
  onConfirm,
  onCancel,
  onRemove,
}: {
  draft: Placement;
  editing: boolean;
  onPosition: (x: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const { text, name } = useConfiguratorCopy();
  return (
    <div className="asea-editor">
      <strong>{name(productById(draft.productId).name)}</strong>
      <label>
        {text("position")}{" "}
        <input
          aria-label={text("position")}
          type="number"
          min={0}
          max={252}
          value={Math.round(draft.x * 3)}
          onChange={(e) => {
            if (e.target.value !== "") onPosition(Number(e.target.value) / 3);
          }}
        />{" "}
        cm
      </label>
      <button className="asea-primary" onClick={onConfirm}>
        <Check size={16} />
        {text(editing ? "change" : "confirm")}
      </button>
      {editing && (
        <button
          onClick={onRemove}
          title={text("remove")}
          aria-label={text("remove")}
        >
          <Trash2 size={18} />
        </button>
      )}
      <button
        onClick={onCancel}
        title={text("cancel")}
        aria-label={text("cancel")}
      >
        <X size={18} />
      </button>
    </div>
  );
}
