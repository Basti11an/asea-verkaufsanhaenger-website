import { useState } from "react";
import { Monitor } from "lucide-react";
import { ConfiguratorTopbar } from "./ConfiguratorTopbar";
import { EquipmentSidebar } from "./EquipmentSidebar";
import { ProductBar } from "./ProductBar";
import { StartOverlay } from "./StartOverlay";
import { ConfiguratorScene } from "./three/ConfiguratorScene";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import { gasGriddlePlacement } from "./data/defaultConfiguration";
import { clampGasGriddleCenterCm } from "./utils/gasGriddlePlacement";
import "./configurator.css";

const GAS_GRIDDLE_EQUIPMENT_ID = "standard-gas-griddles";

export function ConfiguratorLayout() {
  const { text } = useConfiguratorCopy();
  const [view, setView] = useState<ConfiguratorView>("three");
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [gasGriddleCenterCm, setGasGriddleCenterCm] = useState(gasGriddlePlacement.defaultCenterCm);

  function selectGasGriddleAssembly() {
    setStarted(true);
    setSelectedEquipmentId(GAS_GRIDDLE_EQUIPMENT_ID);
    setNotice(null);
    setView("top");
  }

  function handleProductClick(product: ProductDefinition) {
    if (product.id === "gas-griddle") {
      selectGasGriddleAssembly();
      return;
    }
    setNotice(text("productNotice"));
  }

  function handleEquipmentSelect(equipmentId: string) {
    if (equipmentId === GAS_GRIDDLE_EQUIPMENT_ID) selectGasGriddleAssembly();
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
            <ConfiguratorScene
              view={view}
              started={started}
              gasGriddleCenterCm={gasGriddleCenterCm}
            />
            <StartOverlay visible={!started} onStart={() => setStarted(true)} />
          </main>
          <EquipmentSidebar
            notice={notice}
            selectedEquipmentId={selectedEquipmentId}
            gasGriddleCenterCm={gasGriddleCenterCm}
            onEquipmentSelect={handleEquipmentSelect}
            onGasGriddleCenterChange={(value) => setGasGriddleCenterCm(clampGasGriddleCenterCm(value))}
            onFinish={() => setNotice(text("finishNotice"))}
          />
        </div>
        <ProductBar onProductClick={handleProductClick} />
      </div>
    </section>
  );
}
