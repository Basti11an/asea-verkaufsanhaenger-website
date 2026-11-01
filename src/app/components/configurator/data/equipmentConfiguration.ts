import type { EquipmentSide } from "../types";

export type ConfigurableProductId =
  | "fryer"
  | "double-fryer"
  | "gas-griddle"
  | "contact-grill"
  | "electric-griddle"
  | "induction"
  | "bottle-fridge"
  | "cooling-top"
  | "undercounter-fridge"
  | "double-sink"
  | "hygiene-area"
  | "worktable"
  | "wall-cabinet"
  | "splash-guard";

type CollisionChannel = "floor" | "counter" | "wall" | "backsplash";

export type EquipmentPlacement = {
  id: string;
  productId: ConfigurableProductId;
  side: EquipmentSide;
  centerCm: number;
  standard?: boolean;
};

export type EquipmentConfigurationState = {
  items: EquipmentPlacement[];
};

export type EquipmentPlacementDefinition = {
  productId: ConfigurableProductId;
  allowedSides: readonly EquipmentSide[];
  defaultCenterCm: Readonly<Record<EquipmentSide, number>>;
  minCenterCm: number;
  maxCenterCm: number;
  widthCm: number;
  collisionChannels: readonly CollisionChannel[];
  blocksCountertop: boolean;
  avoidsWheelArch: boolean;
};

const allSides: readonly EquipmentSide[] = ["closed-wall", "sales-hatch"];
const rearOnly: readonly EquipmentSide[] = ["closed-wall"];

export const equipmentPlacementDefinitions: Record<ConfigurableProductId, EquipmentPlacementDefinition> = {
  fryer: {
    productId: "fryer",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 155, "sales-hatch": 155 },
    minCenterCm: 15,
    maxCenterCm: 345,
    widthCm: 30,
    collisionChannels: ["floor", "counter", "wall"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "double-fryer": {
    productId: "double-fryer",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 100.5, "sales-hatch": 100.5 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    collisionChannels: ["floor", "counter", "wall"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "gas-griddle": {
    productId: "gas-griddle",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 39,
    maxCenterCm: 321,
    widthCm: 77,
    collisionChannels: ["floor", "counter", "backsplash"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "contact-grill": {
    productId: "contact-grill",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 21,
    maxCenterCm: 339,
    widthCm: 41,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "electric-griddle": {
    productId: "electric-griddle",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  induction: {
    productId: "induction",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 25,
    maxCenterCm: 335,
    widthCm: 50,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "bottle-fridge": {
    productId: "bottle-fridge",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 330, "sales-hatch": 330 },
    minCenterCm: 31,
    maxCenterCm: 329,
    widthCm: 61,
    collisionChannels: ["floor", "counter", "wall"],
    blocksCountertop: true,
    avoidsWheelArch: true,
  },
  "cooling-top": {
    productId: "cooling-top",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 60,
    maxCenterCm: 300,
    widthCm: 120,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "undercounter-fridge": {
    productId: "undercounter-fridge",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 330, "sales-hatch": 330 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    collisionChannels: ["floor"],
    blocksCountertop: false,
    avoidsWheelArch: true,
  },
  "double-sink": {
    productId: "double-sink",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 345, "sales-hatch": 345 },
    minCenterCm: 45,
    maxCenterCm: 315,
    widthCm: 90,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "hygiene-area": {
    productId: "hygiene-area",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 245, "sales-hatch": 245 },
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    collisionChannels: ["floor", "counter", "wall"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  worktable: {
    productId: "worktable",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 60,
    maxCenterCm: 300,
    widthCm: 120,
    collisionChannels: ["floor", "counter"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "wall-cabinet": {
    productId: "wall-cabinet",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 330, "sales-hatch": 330 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    collisionChannels: ["wall"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "splash-guard": {
    productId: "splash-guard",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 39,
    maxCenterCm: 321,
    widthCm: 77,
    collisionChannels: ["backsplash"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
};

const wheelArchIntervals = [{ startCm: 125, endCm: 235 }] as const;

export const fixedGasCabinet = {
  side: "closed-wall" as const,
  startCm: 0,
  endCm: 71,
  collisionChannels: ["floor", "counter"] as const,
};

function makeId(productId: ConfigurableProductId) {
  return `${productId}-${crypto.randomUUID()}`;
}

export function createDefaultEquipmentConfiguration(): EquipmentConfigurationState {
  return {
    items: [
      { id: "standard-double-fryer", productId: "double-fryer", side: "closed-wall", centerCm: 100.5, standard: true },
      { id: "standard-hygiene", productId: "hygiene-area", side: "closed-wall", centerCm: 245, standard: true },
      { id: "standard-gas-griddles", productId: "gas-griddle", side: "sales-hatch", centerCm: 180, standard: true },
      { id: "standard-undercounter-fridge", productId: "undercounter-fridge", side: "closed-wall", centerCm: 330, standard: true },
    ],
  };
}

export function clampEquipmentCenter(productId: ConfigurableProductId, value: number) {
  const definition = equipmentPlacementDefinitions[productId];
  const numericValue = Number.isFinite(value) ? value : definition.defaultCenterCm[definition.allowedSides[0]];
  const steppedValue = Math.round(numericValue * 2) / 2;
  return Math.min(definition.maxCenterCm, Math.max(definition.minCenterCm, steppedValue));
}

function intervalsOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && endA > startB;
}

function channelsOverlap(a: readonly CollisionChannel[], b: readonly CollisionChannel[]) {
  return a.some((channel) => b.includes(channel));
}

function interval(centerCm: number, widthCm: number) {
  return { startCm: centerCm - widthCm / 2, endCm: centerCm + widthCm / 2 };
}

function overlapsWheelArch(centerCm: number, widthCm: number) {
  const itemInterval = interval(centerCm, widthCm);
  return wheelArchIntervals.some((arch) => intervalsOverlap(itemInterval.startCm, itemInterval.endCm, arch.startCm, arch.endCm));
}

export function findConfigurationCollision(
  state: EquipmentConfigurationState,
  item: EquipmentPlacement,
  requestedCenterCm = item.centerCm,
  requestedSide = item.side,
) {
  const definition = equipmentPlacementDefinitions[item.productId];
  const centerCm = clampEquipmentCenter(item.productId, requestedCenterCm);
  const itemInterval = interval(centerCm, definition.widthCm);

  if (definition.avoidsWheelArch && overlapsWheelArch(centerCm, definition.widthCm)) return "wheel-arch";

  if (requestedSide === fixedGasCabinet.side
    && channelsOverlap(definition.collisionChannels, fixedGasCabinet.collisionChannels)
    && intervalsOverlap(itemInterval.startCm, itemInterval.endCm, fixedGasCabinet.startCm, fixedGasCabinet.endCm)) {
    return "fixed-gas-cabinet";
  }

  return state.items.find((other) => {
    if (other.id === item.id || other.side !== requestedSide) return false;
    const otherDefinition = equipmentPlacementDefinitions[other.productId];
    if (!channelsOverlap(definition.collisionChannels, otherDefinition.collisionChannels)) return false;
    const otherInterval = interval(other.centerCm, otherDefinition.widthCm);
    return intervalsOverlap(itemInterval.startCm, itemInterval.endCm, otherInterval.startCm, otherInterval.endCm);
  })?.id ?? null;
}

function candidateCenters(productId: ConfigurableProductId, side: EquipmentSide) {
  const definition = equipmentPlacementDefinitions[productId];
  const values = [definition.defaultCenterCm[side]];
  for (let distance = 1; distance <= 360; distance += 0.5) {
    values.push(definition.defaultCenterCm[side] - distance, definition.defaultCenterCm[side] + distance);
  }
  return values;
}

export function findFreeEquipmentCenter(
  state: EquipmentConfigurationState,
  productId: ConfigurableProductId,
  side: EquipmentSide,
) {
  const definition = equipmentPlacementDefinitions[productId];
  if (!definition.allowedSides.includes(side)) return null;
  const item: EquipmentPlacement = { id: "candidate", productId, side, centerCm: definition.defaultCenterCm[side] };
  for (const candidate of candidateCenters(productId, side)) {
    if (candidate < definition.minCenterCm || candidate > definition.maxCenterCm) continue;
    if (!findConfigurationCollision(state, item, candidate, side)) return clampEquipmentCenter(productId, candidate);
  }
  return null;
}

export function addEquipment(
  state: EquipmentConfigurationState,
  productId: ConfigurableProductId,
  preferredSide?: EquipmentSide,
) {
  const definition = equipmentPlacementDefinitions[productId];
  const sides = preferredSide && definition.allowedSides.includes(preferredSide)
    ? [preferredSide, ...definition.allowedSides.filter((side) => side !== preferredSide)]
    : [...definition.allowedSides];

  for (const side of sides) {
    const centerCm = findFreeEquipmentCenter(state, productId, side);
    if (centerCm === null) continue;
    const item: EquipmentPlacement = { id: makeId(productId), productId, side, centerCm };
    return { state: { items: [...state.items, item] }, item, collisionWith: null };
  }

  return { state, item: null, collisionWith: "no-space" };
}

export function moveEquipment(
  state: EquipmentConfigurationState,
  id: string,
  requestedCenterCm: number,
) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return { state, collisionWith: "missing" };
  const centerCm = clampEquipmentCenter(item.productId, requestedCenterCm);
  const collisionWith = findConfigurationCollision(state, item, centerCm, item.side);
  if (collisionWith) return { state, collisionWith };
  return {
    state: { items: state.items.map((entry) => entry.id === id ? { ...entry, centerCm } : entry) },
    collisionWith: null,
  };
}

export function moveEquipmentSide(state: EquipmentConfigurationState, id: string, side: EquipmentSide) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return { state, collisionWith: "missing" };
  const definition = equipmentPlacementDefinitions[item.productId];
  if (!definition.allowedSides.includes(side)) return { state, collisionWith: "side-not-allowed" };
  const centerCm = findFreeEquipmentCenter(state, item.productId, side);
  if (centerCm === null) return { state, collisionWith: "no-space" };
  return {
    state: { items: state.items.map((entry) => entry.id === id ? { ...entry, side, centerCm } : entry) },
    collisionWith: null,
  };
}

export function removeEquipment(state: EquipmentConfigurationState, id: string) {
  return { items: state.items.filter((item) => item.id !== id) };
}

export function getEquipmentInterval(item: EquipmentPlacement) {
  return interval(item.centerCm, equipmentPlacementDefinitions[item.productId].widthCm);
}
