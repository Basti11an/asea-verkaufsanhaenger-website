import { useRef } from "react";
import { Box } from "lucide-react";
import { productById } from "./demoProducts";
import { useConfiguratorCopy } from "./copy";
import { blockedZones, clampPosition, isDemoValid } from "./placementDemo";
import { WatermarkOverlay } from "./WatermarkOverlay";
import type { Placement, View } from "./types";

export function ThreePlaceholder() {
  const { text } = useConfiguratorCopy();
  return (
    <div className="asea-three">
      <WatermarkOverlay />
      <Box size={56} strokeWidth={1} />
      <p>{text("placeholder")}</p>
    </div>
  );
}
export function PlanningView({
  view,
  items,
  draft,
  onMove,
  onInvalid,
  onEdit,
}: {
  view: View;
  items: Placement[];
  draft: Placement | null;
  onMove: (p: Placement) => void;
  onInvalid: () => void;
  onEdit: (p: Placement) => void;
}) {
  const { text, name } = useConfiguratorCopy();
  const surface = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    start: Placement;
    px: number;
    py: number;
    current: Placement;
  } | null>(null);
  const shown = items.filter((i) => i.id !== draft?.id);
  if (draft) shown.push(draft);
  return (
    <div className="asea-planning">
      <div className="asea-plan-caption">
        <span>{text(view)}</span>
        <span>{text("demo")}</span>
      </div>
      <div ref={surface} className={`asea-plan asea-plan-${view}`}>
        <div className="asea-gas">{text("gas")}</div>
        <div className="asea-wheel asea-wheel-one">{text("wheel")}</div>
        <div className="asea-wheel asea-wheel-two">{text("wheel")}</div>
        {draft &&
          blockedZones.map((z, i) => (
            <div
              key={i}
              className="asea-blocked"
              style={{
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
              }}
              title={text("blocked")}
            />
          ))}
        {shown.map((p) => (
          <button
            key={p.id}
            className={`asea-placed ${p.id === draft?.id ? "is-editing" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-label={name(productById(p.productId).name)}
            onClick={() => {
              if (p.id !== draft?.id) onEdit(p);
            }}
            onPointerDown={(e) => {
              if (p.id !== draft?.id) return;
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                start: { ...p },
                px: e.clientX,
                py: e.clientY,
                current: p,
              };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d || !surface.current) return;
              const rect = surface.current.getBoundingClientRect();
              d.current = {
                ...d.start,
                ...clampPosition(
                  d.start.x + ((e.clientX - d.px) / rect.width) * 100,
                  d.start.y + ((e.clientY - d.py) / rect.height) * 100,
                ),
              };
              onMove(d.current);
            }}
            onPointerUp={() => {
              const d = drag.current;
              drag.current = null;
              if (d && !isDemoValid(d.current)) {
                onMove(d.start);
                onInvalid();
              }
            }}
            onPointerCancel={() => {
              if (drag.current) onMove(drag.current.start);
              drag.current = null;
            }}
            onKeyDown={(e) => {
              if (
                p.id !== draft?.id ||
                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key,
                )
              )
                return;
              e.preventDefault();
              const next = {
                ...p,
                ...clampPosition(
                  p.x +
                    (e.key === "ArrowRight"
                      ? 1
                      : e.key === "ArrowLeft"
                        ? -1
                        : 0),
                  p.y +
                    (e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0),
                ),
              };
              if (isDemoValid(next)) onMove(next);
              else onInvalid();
            }}
          >
            {name(productById(p.productId).name)}
            {p.id === draft?.id && <small>{Math.round(p.x * 3)} cm</small>}
          </button>
        ))}
        <WatermarkOverlay />
      </div>
    </div>
  );
}
