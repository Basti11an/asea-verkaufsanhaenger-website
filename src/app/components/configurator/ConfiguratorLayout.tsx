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
import { ConfiguratorTutorial } from "./ConfiguratorTutorial";
import { finishConfiguration } from "./finish/configurationFinish";
import type { ConfigurationCustomer } from "./finish/finishValidation";
import type { ConfiguratorView, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";
import {
  addEquipment,
  createDefaultEquipmentConfiguration,
  moveEquipment,
  moveEquipmentCorner,
  moveEquipmentSide,
  moveEquipmentToCrossPlacement,
  removeEquipment,
  setEquipmentAccessoryEnabled,
  setEquipmentAccessoryLength,
  type AutomaticAccessoryId,
  type EquipmentConfigurationState,
  type EquipmentCorner,
} from "./data/equipmentConfiguration";
import { isConfigurableProductId } from "./data/productPlacement";
import "./configurator.css";

type ConfiguratorLayoutProps = {
  onBack: () => void;
};

export function ConfiguratorLayout({ onBack }: ConfiguratorLayoutProps) {
  const { text } = useConfiguratorCopy();
  const sceneRef = useRef<ConfiguratorSceneHandle>(null);
  const [view, setView] = useState<ConfiguratorView>("three");
  const [started, setStarted] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [equipmentState, setEquipmentState] = useState<EquipmentConfigurationState>(createDefaultEquipmentConfiguration);
  const [worktopMaterial, setWorktopMaterial] = useState<"stainless" | "gray">("stainless");
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const showNotice = (message: string, id?: string) => toast(message, { duration: 3200, id });

  function handleTutorialStepChange(nextStep: number) {
    setTutorialStep(nextStep);
    // Only the editor view changes during these two steps; no equipment data is modified.
    setSelectedEquipmentId(nextStep === 4 || nextStep === 5 ? "standard-double-fryer" : null);
  }

  function closeTutorial() {
    setTutorialActive(false);
    setSelectedEquipmentId(null);
  }

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

  function handleEquipmentCenterChange(equipmentId: string, centerCm: number, notifyCollision = true) {
    const result = moveEquipment(equipmentState, equipmentId, centerCm);
    if (result.collisionWith) {
      if (notifyCollision) {
        showNotice(
          text(result.collisionWith === "wheel-arch"
            ? "wheelArchNotice"
            : result.collisionWith === "sink-clearance"
              ? "sinkClearanceNotice"
              : "collisionNotice"),
          "placement-collision",
        );
      }
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

  function handleEquipmentCornerChange(equipmentId: string, corner: EquipmentCorner) {
    const result = moveEquipmentCorner(equipmentState, equipmentId, corner);
    if (result.collisionWith) {
      showNotice(text("noSpaceNotice"));
      return;
    }
    setEquipmentState(result.state);
  }

  function handleEquipmentCrossPositionChange(equipmentId: string) {
    const result = moveEquipmentToCrossPlacement(equipmentState, equipmentId);
    if (result.collisionWith) {
      showNotice(text("noSpaceNotice"));
      return;
    }
    setEquipmentState(result.state);
  }

  function handleAccessoryEnabledChange(
    equipmentId: string,
    accessoryId: AutomaticAccessoryId,
    enabled: boolean,
  ) {
    setEquipmentState((state) => setEquipmentAccessoryEnabled(state, equipmentId, accessoryId, enabled));
  }

  function handleAccessoryLengthChange(equipmentId: string, lengthCm: number) {
    setEquipmentState((state) => setEquipmentAccessoryLength(state, equipmentId, "splash-guard", lengthCm));
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
        <ConfiguratorTopbar view={view} disabled={!started} onBack={onBack} onViewChange={setView} />
        <div className="asea-config-workspace">
          <main className="asea-config-stage" data-tour="viewport">
            <ConfiguratorScene
              ref={sceneRef}
              view={view}
              started={started}
              equipmentState={equipmentState}
              selectedEquipmentId={selectedEquipmentId}
            />
            <StartOverlay
              visible={!started}
              onTutorialStart={() => {
                setStarted(true);
                handleTutorialStepChange(0);
                setTutorialActive(true);
              }}
              onDirectStart={() => setStarted(true)}
            />
          </main>
          {selectedEquipmentId ? (
            <EquipmentEditor
              selectedEquipmentId={selectedEquipmentId}
              equipmentState={equipmentState}
              onEquipmentCenterChange={handleEquipmentCenterChange}
              onEquipmentSideChange={handleEquipmentSideChange}
              onEquipmentCornerChange={handleEquipmentCornerChange}
              onEquipmentCrossPositionChange={handleEquipmentCrossPositionChange}
              onAccessoryEnabledChange={handleAccessoryEnabledChange}
              onAccessoryLengthChange={handleAccessoryLengthChange}
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
        <ProductBar
          onProductClick={handleProductClick}
          editing={Boolean(selectedEquipmentId)}
          worktopMaterial={worktopMaterial}
          onWorktopMaterialChange={setWorktopMaterial}
        />
        <ConfiguratorTutorial
          active={tutorialActive}
          step={tutorialStep}
          onStepChange={handleTutorialStepChange}
          onSkip={closeTutorial}
          onComplete={() => {
            closeTutorial();
            showNotice(text("tutorialComplete"), "tutorial-complete");
          }}
        />
      </div>
      <ConfiguratorFinishModal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        onSubmit={handleFinishSubmit}
      />
    </section>
  );
}
