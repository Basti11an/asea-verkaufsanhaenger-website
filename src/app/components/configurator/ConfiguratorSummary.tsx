import { useState } from "react";
import { ArrowLeft, ArrowRight, Box } from "lucide-react";
import { productById } from "./demoProducts";
import { useConfiguratorCopy } from "./copy";
import { WatermarkOverlay } from "./WatermarkOverlay";
import type { Placement } from "./types";
export function ConfiguratorSummary({
  items,
  onBack,
}: {
  items: Placement[];
  onBack: () => void;
}) {
  const { text, name } = useConfiguratorCopy();
  const [notice, setNotice] = useState(false);
  return (
    <div className="asea-summary">
      <h1>{text("summary")}</h1>
      <div className="asea-three">
        <WatermarkOverlay />
        <Box size={56} strokeWidth={1} />
        <p>{text("preview")}</p>
      </div>
      <h2>{text("selected")}</h2>
      <ul>
        {items.map((p) => (
          <li key={p.id}>{name(productById(p.productId).name)}</li>
        ))}
      </ul>
      <div className="asea-summary-actions">
        <button onClick={onBack}>
          <ArrowLeft size={16} />
          {text("back")}
        </button>
        <button className="asea-primary" onClick={() => setNotice(true)}>
          {text("inquiry")}
          <ArrowRight size={16} />
        </button>
      </div>
      {notice && <p role="status">{text("later")}</p>}
    </div>
  );
}
