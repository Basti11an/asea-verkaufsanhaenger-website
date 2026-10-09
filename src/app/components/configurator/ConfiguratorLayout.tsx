import { useState } from "react";
import { Monitor } from "lucide-react";
import { ConfiguratorTopbar } from "./ConfiguratorTopbar";
import { EquipmentSidebar } from "./EquipmentSidebar";
import { ProductBar } from "./ProductBar";
import { StartOverlay } from "./StartOverlay";
import { ConfiguratorScene } from "./three/ConfiguratorScene";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import "./configurator.css";

export function ConfiguratorLayout() {
  const { text } = useConfiguratorCopy();
  const [view, setView] = useState<ConfiguratorView>("three");
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handleProductClick(_product: ProductDefinition) {
    setNotice(text("productNotice"));
  }

  return (
    <section className="asea-configurator">
      <div className="asea-small-screen">
        <Monitor size={46} strokeWidth={1} />
        <h1>{text("smallTitle")}</h1>
        <p>{text("small")}</p>
        <p>{text("device")}</p>
      </div>
      <div className="asea-config-desktop">
        <ConfiguratorTopbar view={view} disabled={!started} onViewChange={setView} />
        <div className="asea-config-workspace">
          <main className="asea-config-stage">
            <ConfiguratorScene view={view} started={started} />
            <StartOverlay visible={!started} onStart={() => setStarted(true)} />
          </main>
          <EquipmentSidebar
            notice={notice}
            onFinish={() => setNotice(text("finishNotice"))}
          />
        </div>
        <ProductBar onProductClick={handleProductClick} />
      </div>
    </section>
  );
}
