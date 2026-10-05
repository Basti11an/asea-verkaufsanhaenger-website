import { ArrowRight, RotateCcw, Package, ChevronRight } from "lucide-react";
import { productById } from "./demoProducts";
import { useConfiguratorCopy } from "./copy";
import type { Placement } from "./types";
export function EquipmentList({
  items,
  draftId,
  onEdit,
  onReset,
  onFinish,
}: {
  items: Placement[];
  draftId?: string;
  onEdit: (p: Placement) => void;
  onReset: () => void;
  onFinish: () => void;
}) {
  const { text, name } = useConfiguratorCopy();
  return (
    <aside className="asea-equipment">
      <h2>
        {text("equipment")} <span>{items.length}</span>
      </h2>
      <div className="asea-equipment-items">
        {items.length ? (
          items.map((p) => (
            <button
              key={p.id}
              aria-pressed={draftId === p.id}
              onClick={() => onEdit(p)}
            >
              <span>{name(productById(p.productId).name)}</span>
              <ChevronRight size={16} />
            </button>
          ))
        ) : (
          <div className="asea-empty">
            <Package size={32} strokeWidth={1} />
            <p>{text("empty")}</p>
          </div>
        )}
      </div>
      <button
        className="asea-reset"
        onClick={onReset}
        disabled={!items.length && !draftId}
      >
        <RotateCcw size={16} />
        {text("reset")}
      </button>
      {items.length > 0 && (
        <button
          className="asea-primary"
          disabled={!!draftId}
          onClick={onFinish}
        >
          {text("finish")}
          <ArrowRight size={16} />
        </button>
      )}
    </aside>
  );
}
