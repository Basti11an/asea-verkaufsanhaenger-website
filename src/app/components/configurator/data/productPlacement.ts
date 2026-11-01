import type { ConfigurableProductId } from "./equipmentConfiguration";

export const configurableProductIds: readonly ConfigurableProductId[] = [
  "fryer",
  "double-fryer",
  "gas-griddle",
  "contact-grill",
  "electric-griddle",
  "induction",
  "bottle-fridge",
  "cooling-top",
  "undercounter-fridge",
  "double-sink",
  "hygiene-area",
  "worktable",
  "wall-cabinet",
  "splash-guard",
];

export function isConfigurableProductId(id: string): id is ConfigurableProductId {
  return configurableProductIds.includes(id as ConfigurableProductId);
}
