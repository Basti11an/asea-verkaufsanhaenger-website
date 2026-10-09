import { Play } from "lucide-react";
import { useConfiguratorCopy } from "./copy";

type StartOverlayProps = {
  visible: boolean;
  onStart: () => void;
};

export function StartOverlay({ visible, onStart }: StartOverlayProps) {
  const { text } = useConfiguratorCopy();

  return (
    <div className={`asea-start-layer${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div className="asea-start-panel">
        <h1>{text("startTitle")}</h1>
        <p>{text("startDescription")}</p>
        <button type="button" onClick={onStart} tabIndex={visible ? 0 : -1}>
          <Play size={17} fill="currentColor" aria-hidden="true" />
          {text("startButton")}
        </button>
      </div>
    </div>
  );
}
