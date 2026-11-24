type TutorialCopyKey =
  | "tutorialStep1Title" | "tutorialStep1Text"
  | "tutorialStep2Title" | "tutorialStep2Text"
  | "tutorialStep3Title" | "tutorialStep3Text"
  | "tutorialStep4Title" | "tutorialStep4Text" | "tutorialStep4Hint"
  | "tutorialStep5Title" | "tutorialStep5Text"
  | "tutorialStep6Title" | "tutorialStep6Text" | "tutorialStep6Hint"
  | "tutorialStep7Title" | "tutorialStep7Text"
  | "tutorialStep8Title" | "tutorialStep8Text";

export type TutorialStep = {
  target: string;
  fallbackTarget?: string;
  title: TutorialCopyKey;
  text: TutorialCopyKey;
  hint?: TutorialCopyKey;
};

export const tutorialSteps: readonly TutorialStep[] = [
  { target: "viewport", title: "tutorialStep1Title", text: "tutorialStep1Text" },
  { target: "view-switcher", title: "tutorialStep2Title", text: "tutorialStep2Text" },
  { target: "categories", title: "tutorialStep3Title", text: "tutorialStep3Text" },
  { target: "product-list", title: "tutorialStep4Title", text: "tutorialStep4Text", hint: "tutorialStep4Hint" },
  { target: "product-editor", fallbackTarget: "equipment-list", title: "tutorialStep5Title", text: "tutorialStep5Text" },
  { target: "position-slider", title: "tutorialStep6Title", text: "tutorialStep6Text", hint: "tutorialStep6Hint" },
  { target: "equipment-list", title: "tutorialStep7Title", text: "tutorialStep7Text" },
  { target: "finish", title: "tutorialStep8Title", text: "tutorialStep8Text" },
] as const;
