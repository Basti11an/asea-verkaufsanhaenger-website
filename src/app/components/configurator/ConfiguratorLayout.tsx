import { useState } from "react";
import { Monitor } from "lucide-react";
import { ConfiguratorTopbar } from "./ConfiguratorTopbar";
import { EquipmentSidebar } from "./EquipmentSidebar";
import { EquipmentEditor } from "./EquipmentEditor";
import { ProductBar } from "./ProductBar";
import { StartOverlay } from "./StartOverlay";
import { ConfiguratorScene } from "./three/ConfiguratorScene";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import {
  createDefaultStandardEquipmentState,
  isUserConfigurableEquipmentId,
  moveStandardEquipmentAssembly,
  removeStandardEquipmentAssembly,
  restoreStandardEquipmentAssembly,
  standardEquipmentIdByProductId,
} from "./data/standardEquipmentState";
import "./configurator.css";

export function ConfiguratorLayout() {
  const { text } = useConfiguratorCopy();
  const [view, setView] = useState<ConfiguratorView>("three");
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [equipmentState, setEquipmentState] = useState(createDefaultStandardEquipmentState);

  function selectEquipment(equipmentId: string) {
    if (!isUserConfigurableEquipmentId(equipmentId) || !equipmentState[equipmentId].active) return;
    setStarted(true);
    setSelectedEquipmentId(equipmentId);
    setNotice(null);
  }

  function handleProductClick(product: ProductDefinition) {
    const equipmentId = standardEquipmentIdByProductId.get(product.id);
    if (!equipmentId) {
      setNotice(text("productNotice"));
      return;
    }

    if (!equipmentState[equipmentId].active) {
      const result = restoreStandardEquipmentAssembly(equipmentState, equipmentId);
      if (!result.restored) {
        setNotice(text("noSpaceNotice"));
        return;
      }
      setEquipmentState(result.state);
      setNotice(text("restoredNotice"));
    } else {
      setNotice(null);
    }

    setStarted(true);
    setSelectedEquipmentId(equipmentId);
  }

  function handleEquipmentSelect(equipmentId: string) {
    selectEquipment(equipmentId);
  }

  function handleEquipmentCenterChange(equipmentId: string, centerCm: number) {
    if (!isUserConfigurableEquipmentId(equipmentId)) return;
    const result = moveStandardEquipmentAssembly(equipmentState, equipmentId, centerCm);
    if (result.collisionWith) {
      setNotice(text("collisionNotice"));
      return;
    }
    setEquipmentState(result.state);
    setNotice(null);
  }

  function handleEquipmentRemove(equipmentId: string) {
    if (!isUserConfigurableEquipmentId(equipmentId)) return;
    setEquipmentState(removeStandardEquipmentAssembly(equipmentState, equipmentId));
    setSelectedEquipmentId(null);
    setNotice(text("removedNotice"));
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
              equipmentState={equipmentState}
            />
            <StartOverlay visible={!started} onStart={() => setStarted(true)} />
          </main>
          <EquipmentSidebar
            notice={notice}
            selectedEquipmentId={selectedEquipmentId}
            equipmentState={equipmentState}
            onEquipmentSelect={handleEquipmentSelect}
            onFinish={() => setNotice(text("finishNotice"))}
          />
        </div>
        <EquipmentEditor
          selectedEquipmentId={selectedEquipmentId}
          equipmentState={equipmentState}
          onEquipmentCenterChange={handleEquipmentCenterChange}
          onEquipmentRemove={handleEquipmentRemove}
        />
        <ProductBar onProductClick={handleProductClick} />
      </div>
    </section>
  );
}
