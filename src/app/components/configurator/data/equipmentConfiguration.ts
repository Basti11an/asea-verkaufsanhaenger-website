import type { EquipmentSide } from "../types";
import { trailerConfiguration } from "./defaultConfiguration";

export type ConfigurableProductId =
  | "fryer"
  | "double-fryer"
  | "extractor-hood"
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
  | "splash-guard"
  | "kebab-spit";

export type EquipmentPlacementType = "side" | "corner" | "cross" | "fixed";
export type EquipmentCorner = "front-left" | "front-right" | "rear-right";
export type EquipmentSpecialPosition = "trailer-end" | "rear-right";

export type EquipmentPlacementAnchor = {
  side: EquipmentSide;
  centerCm: number;
  rotationDeg: number;
};

type CollisionChannel = "floor" | "counter" | "wall" | "backsplash";

export type EquipmentPlacement = {
  id: string;
  productId: ConfigurableProductId;
  side: EquipmentSide;
  centerCm: number;
  placementKey?: EquipmentCorner | EquipmentSpecialPosition;
  standard?: boolean;
};

export type EquipmentConfigurationState = {
  items: EquipmentPlacement[];
};

export type EquipmentPlacementDefinition = {
  productId: ConfigurableProductId;
  placementType: EquipmentPlacementType;
  allowedSides: readonly EquipmentSide[];
  allowedCorners?: readonly EquipmentCorner[];
  cornerPlacements?: Readonly<Record<EquipmentCorner, EquipmentPlacementAnchor>>;
  defaultCorner?: EquipmentCorner;
  fixedPlacement?: EquipmentPlacementAnchor & { id: EquipmentSpecialPosition };
  crossPlacement?: EquipmentPlacementAnchor & { id: EquipmentSpecialPosition };
  defaultCenterCm: Readonly<Record<EquipmentSide, number>>;
  minCenterCm: number;
  maxCenterCm: number;
  widthCm: number;
  displayWidthCm?: number;
  maxInstances?: number;
  placementConstraints?: {
    vertical?: "top";
    topMinYCm?: number;
    maxDistanceToLeftWallCm?: number;
    maxDistanceToRightWallCm?: number;
  };
  countertopCutoutWidthCm?: number;
  collisionChannels: readonly CollisionChannel[];
  blocksCountertop: boolean;
  avoidsWheelArch: boolean;
};

const allSides: readonly EquipmentSide[] = ["closed-wall", "sales-hatch"];
const rearOnly: readonly EquipmentSide[] = ["closed-wall"];
const frontOnly: readonly EquipmentSide[] = ["sales-hatch"];
const undercounterCorners: Readonly<Record<EquipmentCorner, EquipmentPlacementAnchor>> = {
  "front-left": { side: "sales-hatch", centerCm: 30, rotationDeg: 90 },
  "front-right": { side: "sales-hatch", centerCm: 330, rotationDeg: 90 },
  "rear-right": { side: "closed-wall", centerCm: 330, rotationDeg: -90 },
};

export const equipmentPlacementDefinitions: Record<ConfigurableProductId, EquipmentPlacementDefinition> = {
  fryer: {
    productId: "fryer",
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 155, "sales-hatch": 155 },
    minCenterCm: 15,
    maxCenterCm: 345,
    widthCm: 30,
    collisionChannels: ["floor", "counter"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "double-fryer": {
    productId: "double-fryer",
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 100.5, "sales-hatch": 100.5 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    collisionChannels: ["floor", "counter"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "extractor-hood": {
    productId: "extractor-hood",
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 100.5, "sales-hatch": 100.5 },
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    placementConstraints: {
      vertical: "top",
      topMinYCm: trailerConfiguration.planReference.interiorHeightCm - 28,
      maxDistanceToLeftWallCm: 28,
      maxDistanceToRightWallCm: 28,
    },
    collisionChannels: ["wall"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "gas-griddle": {
    productId: "gas-griddle",
    placementType: "side",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    countertopCutoutWidthCm: 72.05,
    collisionChannels: ["floor", "counter", "backsplash"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "contact-grill": {
    productId: "contact-grill",
    placementType: "side",
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
    placementType: "side",
    allowedSides: frontOnly,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 33,
    maxCenterCm: 327,
    widthCm: 66,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  induction: {
    productId: "induction",
    placementType: "side",
    allowedSides: allSides,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 16.5,
    maxCenterCm: 343.5,
    widthCm: 33,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "bottle-fridge": {
    productId: "bottle-fridge",
    placementType: "fixed",
    allowedSides: rearOnly,
    fixedPlacement: { id: "rear-right", side: "closed-wall", centerCm: 329, rotationDeg: -90 },
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
    placementType: "cross",
    allowedSides: allSides,
    crossPlacement: { id: "trailer-end", side: "closed-wall", centerCm: 340, rotationDeg: -90 },
    defaultCenterCm: { "closed-wall": 340, "sales-hatch": 340 },
    minCenterCm: 340,
    maxCenterCm: 340,
    widthCm: 40,
    displayWidthCm: 120,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "undercounter-fridge": {
    productId: "undercounter-fridge",
    placementType: "corner",
    allowedSides: allSides,
    allowedCorners: ["front-left", "front-right", "rear-right"],
    cornerPlacements: undercounterCorners,
    defaultCorner: "rear-right",
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
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 245, "sales-hatch": 245 },
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    collisionChannels: ["floor", "counter", "wall"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  "hygiene-area": {
    productId: "hygiene-area",
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 245, "sales-hatch": 245 },
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    collisionChannels: ["floor", "counter"],
    blocksCountertop: true,
    avoidsWheelArch: false,
  },
  worktable: {
    productId: "worktable",
    placementType: "side",
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
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 245, "sales-hatch": 245 },
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    maxInstances: 1,
    collisionChannels: ["wall"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "splash-guard": {
    productId: "splash-guard",
    placementType: "side",
    allowedSides: frontOnly,
    defaultCenterCm: { "closed-wall": 180, "sales-hatch": 180 },
    minCenterCm: 39,
    maxCenterCm: 321,
    widthCm: 77,
    collisionChannels: ["backsplash"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
  "kebab-spit": {
    productId: "kebab-spit",
    placementType: "side",
    allowedSides: rearOnly,
    defaultCenterCm: { "closed-wall": 165, "sales-hatch": 165 },
    minCenterCm: 30.5,
    maxCenterCm: 329.5,
    widthCm: 61,
    collisionChannels: ["counter"],
    blocksCountertop: false,
    avoidsWheelArch: false,
  },
};

const wheelArchIntervals = trailerConfiguration.wheelArchesFromModelCm.map((arch) => ({
  startCm: arch.longitudinalStart,
  endCm: arch.longitudinalEnd,
}));

export const fixedGasCabinet = {
  placementType: "fixed" as const,
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
      { id: "standard-hood", productId: "extractor-hood", side: "closed-wall", centerCm: 100.5, standard: true },
      { id: "standard-hygiene", productId: "hygiene-area", side: "closed-wall", centerCm: 245, standard: true },
      { id: "standard-wall-cabinet", productId: "wall-cabinet", side: "closed-wall", centerCm: 245, standard: true },
      { id: "standard-gas-griddles", productId: "gas-griddle", side: "sales-hatch", centerCm: 180, standard: true },
      { id: "standard-undercounter-fridge", productId: "undercounter-fridge", side: "closed-wall", centerCm: 330, placementKey: "rear-right", standard: true },
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

function occupiedSides(definition: EquipmentPlacementDefinition, side: EquipmentSide) {
  return definition.placementType === "cross" ? allSides : [side];
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
  const requestedSides = occupiedSides(definition, requestedSide);

  if (definition.avoidsWheelArch && overlapsWheelArch(centerCm, definition.widthCm)) return "wheel-arch";

  if (requestedSides.includes(fixedGasCabinet.side)
    && channelsOverlap(definition.collisionChannels, fixedGasCabinet.collisionChannels)
    && intervalsOverlap(itemInterval.startCm, itemInterval.endCm, fixedGasCabinet.startCm, fixedGasCabinet.endCm)) {
    return "fixed-gas-cabinet";
  }

  return state.items.find((other) => {
    if (other.id === item.id) return false;
    const otherDefinition = equipmentPlacementDefinitions[other.productId];
    const otherSides = occupiedSides(otherDefinition, other.side);
    if (!requestedSides.some((side) => otherSides.includes(side))) return false;
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
  if (definition.maxInstances !== undefined
    && state.items.filter((item) => item.productId === productId).length >= definition.maxInstances) {
    return { state, item: null, collisionWith: "no-space" };
  }

  if (definition.placementType === "corner") {
    const defaultCorner = definition.defaultCorner;
    const corners = definition.allowedCorners ?? [];
    const orderedCorners = defaultCorner
      ? [defaultCorner, ...corners.filter((corner) => corner !== defaultCorner)]
      : [...corners];
    for (const corner of orderedCorners) {
      const anchor = definition.cornerPlacements?.[corner];
      if (!anchor) continue;
      const item: EquipmentPlacement = {
        id: makeId(productId),
        productId,
        side: anchor.side,
        centerCm: anchor.centerCm,
        placementKey: corner,
      };
      if (!findConfigurationCollision(state, item)) {
        return { state: { items: [...state.items, item] }, item, collisionWith: null };
      }
    }
    return { state, item: null, collisionWith: "no-space" };
  }

  const anchoredPlacement = definition.placementType === "cross"
    ? definition.crossPlacement
    : definition.placementType === "fixed"
      ? definition.fixedPlacement
      : null;
  if (anchoredPlacement) {
    const item: EquipmentPlacement = {
      id: makeId(productId),
      productId,
      side: anchoredPlacement.side,
      centerCm: anchoredPlacement.centerCm,
      placementKey: anchoredPlacement.id,
    };
    if (findConfigurationCollision(state, item)) return { state, item: null, collisionWith: "no-space" };
    return { state: { items: [...state.items, item] }, item, collisionWith: null };
  }

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
  if (equipmentPlacementDefinitions[item.productId].placementType !== "side") {
    return { state, collisionWith: "position-locked" };
  }
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
  if (definition.placementType !== "side") return { state, collisionWith: "side-not-allowed" };
  if (!definition.allowedSides.includes(side)) return { state, collisionWith: "side-not-allowed" };
  const centerCm = findFreeEquipmentCenter(state, item.productId, side);
  if (centerCm === null) return { state, collisionWith: "no-space" };
  return {
    state: { items: state.items.map((entry) => entry.id === id ? { ...entry, side, centerCm } : entry) },
    collisionWith: null,
  };
}

export function moveEquipmentCorner(
  state: EquipmentConfigurationState,
  id: string,
  corner: EquipmentCorner,
) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return { state, collisionWith: "missing" };
  const definition = equipmentPlacementDefinitions[item.productId];
  if (definition.placementType !== "corner" || !definition.allowedCorners?.includes(corner)) {
    return { state, collisionWith: "corner-not-allowed" };
  }
  const anchor = definition.cornerPlacements?.[corner];
  if (!anchor) return { state, collisionWith: "corner-not-allowed" };
  const candidate: EquipmentPlacement = {
    ...item,
    side: anchor.side,
    centerCm: anchor.centerCm,
    placementKey: corner,
  };
  const collisionWith = findConfigurationCollision(state, candidate, anchor.centerCm, anchor.side);
  if (collisionWith) return { state, collisionWith };
  return {
    state: { items: state.items.map((entry) => entry.id === id ? candidate : entry) },
    collisionWith: null,
  };
}

export function removeEquipment(state: EquipmentConfigurationState, id: string) {
  return { items: state.items.filter((item) => item.id !== id) };
}

export function getEquipmentInterval(item: EquipmentPlacement) {
  return interval(item.centerCm, equipmentPlacementDefinitions[item.productId].widthCm);
}

export function getCountertopCutoutInterval(item: EquipmentPlacement) {
  const definition = equipmentPlacementDefinitions[item.productId];
  return interval(item.centerCm, definition.countertopCutoutWidthCm ?? definition.widthCm);
}
