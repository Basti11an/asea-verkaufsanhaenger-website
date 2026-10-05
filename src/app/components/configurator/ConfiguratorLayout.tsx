import { useRef, useState } from "react";
import { Box, LayoutDashboard, Monitor } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useConfiguratorCopy } from "./copy";
import { productById } from "./demoProducts";
import { clampPosition, isDemoValid } from "./placementDemo";
import { PlanningView, ThreePlaceholder } from "./PlanningView";
import { ProductSelector } from "./ProductSelector";
import { ProductEditor } from "./ProductEditor";
import { EquipmentList } from "./EquipmentList";
import { ConfiguratorSummary } from "./ConfiguratorSummary";
import type { Placement, Product, View } from "./types";
import "./configurator.css";

export function ConfiguratorLayout() {
  const { text } = useConfiguratorCopy();
  const nextId = useRef(0);
  const [items, setItems] = useState<Placement[]>([]);
  const [draft, setDraft] = useState<Placement | null>(null);
  const [view, setView] = useState<View>("top");
  const [mode, setMode] = useState<"planning" | "three">("planning");
  const [summary, setSummary] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const editing = items.some((p) => p.id === draft?.id);
  function openDraft(p: Placement) {
    setDraft({ ...p });
    setView(productById(p.productId).preferredView);
    setMode("planning");
    setInvalid(false);
  }
  function select(p: Product) {
    openDraft({
      id: `demo-${++nextId.current}`,
      productId: p.id,
      x: 27,
      y: 39,
    });
  }
  function move(p: Placement) {
    setDraft(p);
    setInvalid(false);
  }
  function confirm() {
    if (!draft) return;
    if (!isDemoValid(draft)) {
      setInvalid(true);
      return;
    }
    setItems((previous) =>
      editing
        ? previous.map((p) => (p.id === draft.id ? { ...draft } : p))
        : [...previous, { ...draft }],
    );
    setDraft(null);
    setInvalid(false);
  }
  function reset() {
    setItems([]);
    setDraft(null);
    setView("top");
    setMode("planning");
    setSummary(false);
    setInvalid(false);
    setResetOpen(false);
  }
  return (
    <section className="asea-configurator">
      <div className="asea-small">
        <Monitor size={46} strokeWidth={1} />
        <h1>{text("smallTitle")}</h1>
        <p>{text("small")}</p>
        <p>{text("device")}</p>
      </div>
      <div className="asea-desktop">
        {summary ? (
          <ConfiguratorSummary items={items} onBack={() => setSummary(false)} />
        ) : (
          <>
            <header className="asea-config-heading">
              <div>
                <h1>{text("title")}</h1>
                <p>{text("intro")}</p>
              </div>
              <div className="asea-status">
                <span>{text("prototype")}</span>
                <span>
                  {items.length} {text("count")}
                </span>
              </div>
            </header>
            <div className="asea-workspace">
              <main className="asea-workbench">
                <div className="asea-toolbar">
                  <div className="asea-segments">
                    {(["planning", "three"] as const).map((m) => (
                      <button
                        key={m}
                        aria-pressed={mode === m}
                        onClick={() => setMode(m)}
                      >
                        {m === "planning" ? (
                          <LayoutDashboard size={17} />
                        ) : (
                          <Box size={17} />
                        )}
                        {text(m)}
                      </button>
                    ))}
                  </div>
                  {mode === "planning" && (
                    <div className="asea-tabs">
                      {(["top", "side", "front"] as const).map((v) => (
                        <button
                          key={v}
                          aria-pressed={view === v}
                          onClick={() => setView(v)}
                        >
                          {text(v)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {mode === "planning" ? (
                  <PlanningView
                    view={view}
                    items={items}
                    draft={draft}
                    onMove={move}
                    onInvalid={() => setInvalid(true)}
                    onEdit={openDraft}
                  />
                ) : (
                  <ThreePlaceholder />
                )}
                <div className="asea-editor-area">
                  {draft && mode === "planning" && (
                    <ProductEditor
                      draft={draft}
                      editing={editing}
                      onPosition={(x) => {
                        const next = { ...draft, ...clampPosition(x, draft.y) };
                        if (Number.isFinite(x) && isDemoValid(next)) move(next);
                        else setInvalid(true);
                      }}
                      onConfirm={confirm}
                      onCancel={() => {
                        setDraft(null);
                        setInvalid(false);
                      }}
                      onRemove={() => {
                        setItems(items.filter((p) => p.id !== draft.id));
                        setDraft(null);
                        setInvalid(false);
                      }}
                    />
                  )}
                  {invalid && (
                    <p role="alert" className="asea-error">
                      {text("invalid")}
                    </p>
                  )}
                </div>
              </main>
              <EquipmentList
                items={items}
                draftId={draft?.id}
                onEdit={openDraft}
                onReset={() => setResetOpen(true)}
                onFinish={() => setSummary(true)}
              />
            </div>
            <ProductSelector selected={draft?.productId} onSelect={select} />
          </>
        )}
      </div>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogTitle>{text("reset")}</DialogTitle>
          <DialogDescription>{text("resetQuestion")}</DialogDescription>
          <div className="asea-dialog-actions">
            <button onClick={() => setResetOpen(false)}>
              {text("cancel")}
            </button>
            <button onClick={reset}>{text("reset")}</button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
