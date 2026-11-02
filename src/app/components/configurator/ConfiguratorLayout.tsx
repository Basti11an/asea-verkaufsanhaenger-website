import { useRef, useState } from "react";
import { Monitor } from "lucide-react";
import { ConfiguratorTopbar } from "./ConfiguratorTopbar";
import { EquipmentSidebar } from "./EquipmentSidebar";
import { EquipmentEditor } from "./EquipmentEditor";
import { ProductBar } from "./ProductBar";
import { StartOverlay } from "./StartOverlay";
import { ConfiguratorScene, type ConfiguratorSceneHandle } from "./three/ConfiguratorScene";
import { ConfiguratorFinishModal } from "./finish/ConfiguratorFinishModal";
import { finishConfiguration } from "./finish/configurationFinish";
import type { ConfigurationCustomer } from "./finish/finishValidation";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import {
  addEquipment,
  createDefaultEquipmentConfiguration,
  moveEquipment,
  moveEquipmentSide,
  removeEquipment,
  type EquipmentConfigurationState,
} from "./data/equipmentConfiguration";
import { isConfigurableProductId } from "./data/productPlacement";
import "./configurator.css";

export function ConfiguratorLayout() {
  const { text } = useConfiguratorCopy();
  const sceneRef = useRef<ConfiguratorSceneHandle>(null);
  const [view, setView] = useState<ConfiguratorView>("three");
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [equipmentState, setEquipmentState] = useState<EquipmentConfigurationState>(createDefaultEquipmentConfiguration);
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  function selectEquipment(equipmentId: string) {
    if (!equipmentState.items.some((item) => item.id === equipmentId)) return;
    setStarted(true);
    setSelectedEquipmentId(equipmentId);
    setNotice(null);
  }

  function handleProductClick(product: ProductDefinition) {
    if (!isConfigurableProductId(product.id)) {
      setNotice(text("productNotice"));
      return;
    }

    const preferredSide = view === "rear" ? "sales-hatch" : "closed-wall";
    const result = addEquipment(equipmentState, product.id, preferredSide);
    if (result.item === null) {
      setNotice(text("noSpaceNotice"));
      return;
    }

    setEquipmentState(result.state);
    setStarted(true);
    setSelectedEquipmentId(result.item.id);
    setNotice(null);
  }

  function handleEquipmentSelect(equipmentId: string) {
    selectEquipment(equipmentId);
  }

  function handleEquipmentCenterChange(equipmentId: string, centerCm: number) {
    const result = moveEquipment(equipmentState, equipmentId, centerCm);
    if (result.collisionWith) {
      setNotice(text(result.collisionWith === "wheel-arch" ? "wheelArchNotice" : "collisionNotice"));
      return;
    }
    setEquipmentState(result.state);
    setNotice(null);
  }

  function handleEquipmentRemove(equipmentId: string) {
    setEquipmentState(removeEquipment(equipmentState, equipmentId));
    setSelectedEquipmentId(null);
    setNotice(text("removedNotice"));
  }

  function handleEquipmentSideChange(equipmentId: string, side: "closed-wall" | "sales-hatch") {
    const result = moveEquipmentSide(equipmentState, equipmentId, side);
    if (result.collisionWith) {
      setNotice(text("noSpaceNotice"));
      return;
    }
    setEquipmentState(result.state);
    setNotice(null);
  }

  async function handleFinishSubmit(customer: ConfigurationCustomer) {
    const scene = sceneRef.current;
    if (!scene) throw new Error("Configurator scene is not ready.");
    return finishConfiguration({
      customer,
      equipmentState,
      captureScreenshots: () => scene.captureConfigurationViews(),
    });
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
              ref={sceneRef}
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
            onFinish={() => {
              setStarted(true);
              setNotice(null);
              setFinishModalOpen(true);
            }}
          />
        </div>
        <EquipmentEditor
          selectedEquipmentId={selectedEquipmentId}
          equipmentState={equipmentState}
          onEquipmentCenterChange={handleEquipmentCenterChange}
          onEquipmentSideChange={handleEquipmentSideChange}
          onEquipmentRemove={handleEquipmentRemove}
        />
        <ProductBar onProductClick={handleProductClick} />
      </div>
      <ConfiguratorFinishModal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        onSubmit={handleFinishSubmit}
      />
    </section>
  );
}
