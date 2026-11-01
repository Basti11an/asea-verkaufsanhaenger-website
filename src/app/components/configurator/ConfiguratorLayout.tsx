import { useState } from "react";
import { Monitor } from "lucide-react";
import { ConfiguratorTopbar } from "./ConfiguratorTopbar";
import { EquipmentSidebar } from "./EquipmentSidebar";
import { ProductBar } from "./ProductBar";
import { StartOverlay } from "./StartOverlay";
import { ConfiguratorScene } from "./three/ConfiguratorScene";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import {
  createDefaultStandardEquipmentState,
  isMovableStandardEquipmentId,
  moveStandardEquipment,
  removeStandardEquipment,
  restoreStandardEquipment,
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
    if (!isMovableStandardEquipmentId(equipmentId) || !equipmentState[equipmentId].active) return;
    setStarted(true);
    setSelectedEquipmentId(equipmentId);
    setNotice(null);
    setView("top");
  }

  function handleProductClick(product: ProductDefinition) {
    const equipmentId = standardEquipmentIdByProductId.get(product.id);
    if (!equipmentId) {
      setNotice(text("productNotice"));
      return;
    }

    if (!equipmentState[equipmentId].active) {
      const result = restoreStandardEquipment(equipmentState, equipmentId);
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
    setView("top");
  }

  function handleEquipmentSelect(equipmentId: string) {
    selectEquipment(equipmentId);
  }

  function handleEquipmentCenterChange(equipmentId: string, centerCm: number) {
    if (!isMovableStandardEquipmentId(equipmentId)) return;
    const result = moveStandardEquipment(equipmentState, equipmentId, centerCm);
    if (result.collisionWith) {
      setNotice(text("collisionNotice"));
      return;
    }
    setEquipmentState(result.state);
    setNotice(null);
  }

  function handleEquipmentRemove(equipmentId: string) {
    if (!isMovableStandardEquipmentId(equipmentId)) return;
    setEquipmentState(removeStandardEquipment(equipmentState, equipmentId));
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
            onEquipmentCenterChange={handleEquipmentCenterChange}
            onEquipmentRemove={handleEquipmentRemove}
            onFinish={() => setNotice(text("finishNotice"))}
          />
        </div>
        <ProductBar onProductClick={handleProductClick} />
      </div>
    </section>
  );
}
