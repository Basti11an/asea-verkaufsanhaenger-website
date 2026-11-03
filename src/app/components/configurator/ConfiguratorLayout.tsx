import { useRef, useState } from "react";
import { Monitor } from "lucide-react";
import { Toaster, toast } from "sonner";
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
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [equipmentState, setEquipmentState] = useState<EquipmentConfigurationState>(createDefaultEquipmentConfiguration);
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  const showNotice = (message: string) => toast(message, { duration: 3200 });

  function selectEquipment(equipmentId: string) {
    if (!equipmentState.items.some((item) => item.id === equipmentId)) return;
    setStarted(true);
    setSelectedEquipmentId(equipmentId);
  }

  function handleProductClick(product: ProductDefinition) {
    if (!isConfigurableProductId(product.id)) {
      showNotice(text("productNotice"));
      return;
    }

    const preferredSide = view === "rear" ? "sales-hatch" : "closed-wall";
    const result = addEquipment(equipmentState, product.id, preferredSide);
    if (result.item === null) {
      showNotice(text("noSpaceNotice"));
      return;
    }

    setEquipmentState(result.state);
    setStarted(true);
    setSelectedEquipmentId(result.item.id);
  }

  function handleEquipmentSelect(equipmentId: string) {
    selectEquipment(equipmentId);
  }

  function handleEquipmentCenterChange(equipmentId: string, centerCm: number) {
    const result = moveEquipment(equipmentState, equipmentId, centerCm);
    if (result.collisionWith) {
      showNotice(text(result.collisionWith === "wheel-arch" ? "wheelArchNotice" : "collisionNotice"));
      return;
    }
    setEquipmentState(result.state);
  }

  function handleEquipmentRemove(equipmentId: string) {
    setEquipmentState(removeEquipment(equipmentState, equipmentId));
    setSelectedEquipmentId(null);
    showNotice(text("removedNotice"));
  }

  function handleEquipmentSideChange(equipmentId: string, side: "closed-wall" | "sales-hatch") {
    const result = moveEquipmentSide(equipmentState, equipmentId, side);
    if (result.collisionWith) {
      showNotice(text("noSpaceNotice"));
      return;
    }
    setEquipmentState(result.state);
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
      <Toaster position="top-right" duration={3200} />
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
              selectedEquipmentId={selectedEquipmentId}
            />
            <StartOverlay visible={!started} onStart={() => setStarted(true)} />
          </main>
          {selectedEquipmentId ? (
            <EquipmentEditor
              selectedEquipmentId={selectedEquipmentId}
              equipmentState={equipmentState}
              onEquipmentCenterChange={handleEquipmentCenterChange}
              onEquipmentSideChange={handleEquipmentSideChange}
              onEquipmentRemove={handleEquipmentRemove}
              onCancel={() => setSelectedEquipmentId(null)}
              onConfirm={() => setSelectedEquipmentId(null)}
            />
          ) : (
            <EquipmentSidebar
              selectedEquipmentId={selectedEquipmentId}
              equipmentState={equipmentState}
              onEquipmentSelect={handleEquipmentSelect}
              onFinish={() => {
                setStarted(true);
                setFinishModalOpen(true);
              }}
            />
          )}
        </div>
        <ProductBar onProductClick={handleProductClick} editing={Boolean(selectedEquipmentId)} />
      </div>
      <ConfiguratorFinishModal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        onSubmit={handleFinishSubmit}
      />
    </section>
  );
}
