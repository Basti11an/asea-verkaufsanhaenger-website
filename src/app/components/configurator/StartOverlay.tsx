import { BookOpen, Play } from "lucide-react";
import { useConfiguratorCopy } from "./copy";

type StartOverlayProps = {
  visible: boolean;
  onTutorialStart: () => void;
  onDirectStart: () => void;
};

export function StartOverlay({ visible, onTutorialStart, onDirectStart }: StartOverlayProps) {
  const { text } = useConfiguratorCopy();

  return (
    <div className={`asea-start-layer${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <div className="asea-start-panel">
        <h1>{text("startTitle")}</h1>
        <p>{text("startDescription")}</p>
        <p className="asea-start-notice">{text("startNotice")}</p>
        <div className="asea-start-choice">
          <h2>{text("tutorialChoiceTitle")}</h2>
          <button type="button" className="asea-start-tutorial" onClick={onTutorialStart} tabIndex={visible ? 0 : -1}>
            <BookOpen size={17} aria-hidden="true" />
            <span>
              {text("tutorialStart")}
              <small>{text("tutorialStartHint")}</small>
            </span>
          </button>
          <button type="button" className="asea-start-direct" onClick={onDirectStart} tabIndex={visible ? 0 : -1}>
            <Play size={16} fill="currentColor" aria-hidden="true" />
            {text("tutorialDirect")}
          </button>
        </div>
      </div>
    </div>
  );
}
