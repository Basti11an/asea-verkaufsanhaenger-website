import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useConfiguratorCopy } from "./copy";
import { tutorialSteps, type TutorialStep } from "./tutorialSteps";

type TutorialRect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type TooltipPosition = { left: number; top: number };

type ConfiguratorTutorialProps = {
  active: boolean;
  step: number;
  onStepChange: (step: number) => void;
  onSkip: () => void;
  onComplete: () => void;
};

const VIEWPORT_MARGIN = 12;
const TARGET_PADDING = 6;
const TOOLTIP_GAP = 16;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function findTarget(step: TutorialStep) {
  return document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`)
    ?? (step.fallbackTarget ? document.querySelector<HTMLElement>(`[data-tour="${step.fallbackTarget}"]`) : null);
}

function paddedRect(rect: DOMRect): TutorialRect {
  const left = Math.max(0, rect.left - TARGET_PADDING);
  const top = Math.max(0, rect.top - TARGET_PADDING);
  const right = Math.min(window.innerWidth, rect.right + TARGET_PADDING);
  const bottom = Math.min(window.innerHeight, rect.bottom + TARGET_PADDING);
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function placeTooltip(target: TutorialRect, width: number, height: number): TooltipPosition {
  const centeredTop = target.top + (target.height - height) / 2;
  const centeredLeft = target.left + (target.width - width) / 2;
  const candidates = [
    {
      left: target.right + TOOLTIP_GAP,
      top: clamp(centeredTop, VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN),
    },
    {
      left: target.left - TOOLTIP_GAP - width,
      top: clamp(centeredTop, VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN),
    },
    {
      left: clamp(centeredLeft, VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN),
      top: target.top - TOOLTIP_GAP - height,
    },
    {
      left: clamp(centeredLeft, VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN),
      top: target.bottom + TOOLTIP_GAP,
    },
  ];
  const fitting = candidates.find((candidate) =>
    candidate.left >= VIEWPORT_MARGIN
    && candidate.top >= VIEWPORT_MARGIN
    && candidate.left + width <= window.innerWidth - VIEWPORT_MARGIN
    && candidate.top + height <= window.innerHeight - VIEWPORT_MARGIN,
  );

  if (fitting) return fitting;

  const preferInsideRight = target.width > width + 40;
  const fallbackLeft = preferInsideRight ? target.right - width - TOOLTIP_GAP : target.left;
  const fallbackTop = target.height > height + 40 ? target.bottom - height - TOOLTIP_GAP : target.top;
  return {
    left: clamp(fallbackLeft, VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN),
    top: clamp(fallbackTop, VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN),
  };
}

export function ConfiguratorTutorial({ active, step, onStepChange, onSkip, onComplete }: ConfiguratorTutorialProps) {
  const { text } = useConfiguratorCopy();
  const tooltipRef = useRef<HTMLElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [targetRect, setTargetRect] = useState<TutorialRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ left: VIEWPORT_MARGIN, top: VIEWPORT_MARGIN });
  const currentStep = tutorialSteps[step];
  const targetReady = Boolean(targetRect);

  useLayoutEffect(() => {
    if (!active || !currentStep) return;
    let frame = 0;
    let observer: ResizeObserver | null = null;

    const update = () => {
      const target = findTarget(currentStep);
      if (!target) return;
      const rect = paddedRect(target.getBoundingClientRect());
      const tooltipWidth = tooltipRef.current?.offsetWidth ?? 328;
      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 240;
      setTargetRect(rect);
      setTooltipPosition(placeTooltip(rect, tooltipWidth, tooltipHeight));
      if (!observer) {
        observer = new ResizeObserver(update);
        observer.observe(target);
      }
    };

    frame = window.requestAnimationFrame(() => {
      update();
      frame = window.requestAnimationFrame(update);
    });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [active, currentStep, step]);

  useEffect(() => {
    if (!active) return;
    nextButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onSkip();
      if (event.key === "ArrowRight") {
        if (step === tutorialSteps.length - 1) onComplete();
        else onStepChange(step + 1);
      }
      if (event.key === "ArrowLeft" && step > 0) onStepChange(step - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onComplete, onSkip, onStepChange, step, targetReady]);

  if (!active || !currentStep || !targetRect) return null;

  const isLastStep = step === tutorialSteps.length - 1;
  return createPortal(
    <div className="asea-tutorial" aria-live="polite">
      <div className="asea-tutorial-mask" style={{ left: 0, top: 0, right: 0, height: targetRect.top }} />
      <div className="asea-tutorial-mask" style={{ left: 0, top: targetRect.top, width: targetRect.left, height: targetRect.height }} />
      <div className="asea-tutorial-mask" style={{ left: targetRect.right, top: targetRect.top, right: 0, height: targetRect.height }} />
      <div className="asea-tutorial-mask" style={{ left: 0, top: targetRect.bottom, right: 0, bottom: 0 }} />
      <div
        className="asea-tutorial-spotlight"
        style={{ left: targetRect.left, top: targetRect.top, width: targetRect.width, height: targetRect.height }}
        aria-hidden="true"
      />
      <aside
        ref={tooltipRef}
        className="asea-tutorial-card"
        style={tooltipPosition}
        role="dialog"
        aria-modal="true"
        aria-labelledby="asea-tutorial-title"
      >
        <div className="asea-tutorial-progress">
          <span>{step + 1} {text("tutorialOf")} {tutorialSteps.length}</span>
          <span className="asea-tutorial-dots" aria-hidden="true">
            {tutorialSteps.map((_, index) => <i key={index} className={index <= step ? "is-complete" : undefined} />)}
          </span>
        </div>
        <h2 id="asea-tutorial-title">{text(currentStep.title)}</h2>
        <p>{text(currentStep.text)}</p>
        {currentStep.hint && <small>{text(currentStep.hint)}</small>}
        <div className="asea-tutorial-actions">
          <button type="button" className="asea-tutorial-back" disabled={step === 0} onClick={() => onStepChange(step - 1)}>
            {text("tutorialBack")}
          </button>
          <button
            ref={nextButtonRef}
            type="button"
            className="asea-tutorial-next"
            onClick={() => isLastStep ? onComplete() : onStepChange(step + 1)}
          >
            {text(isLastStep ? "tutorialFinish" : "tutorialNext")}
          </button>
        </div>
        <button type="button" className="asea-tutorial-skip" onClick={onSkip}>
          {text("tutorialSkip")}
        </button>
      </aside>
    </div>,
    document.body,
  );
}
