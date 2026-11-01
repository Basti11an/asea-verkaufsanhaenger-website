import { centimetersToMeters } from "../utils/coordinates";

export const movableStandardEquipmentIds = [
  "standard-double-fryer",
  "standard-hygiene",
  "standard-gas-griddles",
  "standard-undercounter-fridge",
  "standard-hood",
] as const;

export type MovableStandardEquipmentId = (typeof movableStandardEquipmentIds)[number];

export const userConfigurableEquipmentIds = [
  "standard-double-fryer",
  "standard-hygiene",
  "standard-gas-griddles",
  "standard-undercounter-fridge",
] as const;

export type UserConfigurableEquipmentId = (typeof userConfigurableEquipmentIds)[number];

export type EquipmentPlacementState = {
  active: boolean;
  centerCm: number;
};

export type StandardEquipmentState = Record<MovableStandardEquipmentId, EquipmentPlacementState>;

export type EquipmentPlacementDefinition = {
  id: MovableStandardEquipmentId;
  productId: string;
  side: "closed-wall" | "sales-hatch";
  defaultCenterCm: number;
  minCenterCm: number;
  maxCenterCm: number;
  widthCm: number;
  heightStartCm: number;
  heightEndCm: number;
  blocksCountertop: boolean;
};

export const equipmentPlacementDefinitions: Record<MovableStandardEquipmentId, EquipmentPlacementDefinition> = {
  "standard-double-fryer": {
    id: "standard-double-fryer",
    productId: "double-fryer",
    side: "closed-wall",
    defaultCenterCm: 100.5,
    minCenterCm: 29.5,
    maxCenterCm: 329.5,
    widthCm: 59,
    heightStartCm: 43.28,
    heightEndCm: 85,
    blocksCountertop: true,
  },
  "standard-hygiene": {
    id: "standard-hygiene",
    productId: "hygiene-area",
    side: "closed-wall",
    defaultCenterCm: 245,
    minCenterCm: 50,
    maxCenterCm: 310,
    widthCm: 100,
    heightStartCm: 0,
    heightEndCm: 211,
    blocksCountertop: true,
  },
  "standard-gas-griddles": {
    id: "standard-gas-griddles",
    productId: "gas-griddle",
    side: "sales-hatch",
    defaultCenterCm: 180,
    minCenterCm: 39,
    maxCenterCm: 321,
    widthCm: 77,
    heightStartCm: 0,
    heightEndCm: 125.12,
    blocksCountertop: true,
  },
  "standard-undercounter-fridge": {
    id: "standard-undercounter-fridge",
    productId: "undercounter-fridge",
    side: "closed-wall",
    defaultCenterCm: 330,
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    heightStartCm: 0,
    heightEndCm: 81,
    blocksCountertop: false,
  },
  "standard-hood": {
    id: "standard-hood",
    productId: "extractor-hood",
    side: "closed-wall",
    defaultCenterCm: 101,
    minCenterCm: 30,
    maxCenterCm: 330,
    widthCm: 60,
    heightStartCm: 136,
    heightEndCm: 224,
    blocksCountertop: false,
  },
};

const fixedObstacles = [
  {
    id: "standard-gas-cabinet",
    side: "closed-wall" as const,
    startCm: 0,
    endCm: 71,
    heightStartCm: 0,
    heightEndCm: 85,
  },
] as const;

export const standardEquipmentIdByProductId = new Map<string, UserConfigurableEquipmentId>([
  ["double-fryer", "standard-double-fryer"],
  ["extractor-hood", "standard-double-fryer"],
  ["hygiene-area", "standard-hygiene"],
  ["gas-griddle", "standard-gas-griddles"],
  ["undercounter-fridge", "standard-undercounter-fridge"],
]);

export function isMovableStandardEquipmentId(id: string): id is MovableStandardEquipmentId {
  return movableStandardEquipmentIds.includes(id as MovableStandardEquipmentId);
}

export function isUserConfigurableEquipmentId(id: string): id is UserConfigurableEquipmentId {
  return userConfigurableEquipmentIds.includes(id as UserConfigurableEquipmentId);
}

export function createDefaultStandardEquipmentState(): StandardEquipmentState {
  return Object.fromEntries(
    movableStandardEquipmentIds.map((id) => [
      id,
      { active: true, centerCm: equipmentPlacementDefinitions[id].defaultCenterCm },
    ]),
  ) as StandardEquipmentState;
}

export function clampEquipmentCenterCm(id: MovableStandardEquipmentId, value: number) {
  const definition = equipmentPlacementDefinitions[id];
  const fallback = definition.defaultCenterCm;
  const numericValue = Number.isFinite(value) ? value : fallback;
  const steppedValue = Math.round(numericValue * 2) / 2;
  return Math.min(definition.maxCenterCm, Math.max(definition.minCenterCm, steppedValue));
}

function intervalsOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && endA > startB;
}

export function findEquipmentCollision(
  state: StandardEquipmentState,
  movingId: MovableStandardEquipmentId,
  requestedCenterCm: number,
) {
  const moving = equipmentPlacementDefinitions[movingId];
  const centerCm = clampEquipmentCenterCm(movingId, requestedCenterCm);
  const movingStart = centerCm - moving.widthCm / 2;
  const movingEnd = centerCm + moving.widthCm / 2;

  const fixedCollision = fixedObstacles.find((obstacle) => (
    obstacle.side === moving.side
    && intervalsOverlap(movingStart, movingEnd, obstacle.startCm, obstacle.endCm)
    && intervalsOverlap(moving.heightStartCm, moving.heightEndCm, obstacle.heightStartCm, obstacle.heightEndCm)
  ));
  if (fixedCollision) return fixedCollision.id;

  return movableStandardEquipmentIds.find((otherId) => {
    if (otherId === movingId || !state[otherId].active) return false;
    const other = equipmentPlacementDefinitions[otherId];
    if (other.side !== moving.side) return false;
    const otherStart = state[otherId].centerCm - other.widthCm / 2;
    const otherEnd = state[otherId].centerCm + other.widthCm / 2;
    return intervalsOverlap(movingStart, movingEnd, otherStart, otherEnd)
      && intervalsOverlap(moving.heightStartCm, moving.heightEndCm, other.heightStartCm, other.heightEndCm);
  }) ?? null;
}

export function moveStandardEquipment(
  state: StandardEquipmentState,
  id: MovableStandardEquipmentId,
  requestedCenterCm: number,
) {
  const centerCm = clampEquipmentCenterCm(id, requestedCenterCm);
  const collisionWith = findEquipmentCollision(state, id, centerCm);
  if (collisionWith) return { state, collisionWith };

  return {
    state: { ...state, [id]: { ...state[id], centerCm } },
    collisionWith: null,
  };
}

export function removeStandardEquipment(state: StandardEquipmentState, id: MovableStandardEquipmentId) {
  return { ...state, [id]: { ...state[id], active: false } };
}

export function restoreStandardEquipment(state: StandardEquipmentState, id: MovableStandardEquipmentId) {
  const definition = equipmentPlacementDefinitions[id];
  const candidates: number[] = [definition.defaultCenterCm];
  const maxDistance = Math.ceil(definition.maxCenterCm - definition.minCenterCm);

  for (let distance = 1; distance <= maxDistance; distance += 1) {
    candidates.push(definition.defaultCenterCm - distance, definition.defaultCenterCm + distance);
  }

  for (const candidate of candidates) {
    if (candidate < definition.minCenterCm || candidate > definition.maxCenterCm) continue;
    if (!findEquipmentCollision(state, id, candidate)) {
      return {
        state: { ...state, [id]: { active: true, centerCm: candidate } },
        restored: true,
      };
    }
  }

  return { state, restored: false };
}

const fryerAssemblyOffsetCm = 0.5;

function withoutFryerAssembly(state: StandardEquipmentState): StandardEquipmentState {
  return {
    ...state,
    "standard-double-fryer": { ...state["standard-double-fryer"], active: false },
    "standard-hood": { ...state["standard-hood"], active: false },
  };
}

function canPlaceFryerAssembly(state: StandardEquipmentState, fryerCenterCm: number) {
  const stateWithoutAssembly = withoutFryerAssembly(state);
  const hoodCenterCm = fryerCenterCm + fryerAssemblyOffsetCm;
  return !findEquipmentCollision(stateWithoutAssembly, "standard-double-fryer", fryerCenterCm)
    && !findEquipmentCollision(stateWithoutAssembly, "standard-hood", hoodCenterCm);
}

export function moveStandardEquipmentAssembly(
  state: StandardEquipmentState,
  id: UserConfigurableEquipmentId,
  requestedCenterCm: number,
) {
  if (id !== "standard-double-fryer") {
    return moveStandardEquipment(state, id, requestedCenterCm);
  }

  const fryerCenterCm = clampEquipmentCenterCm(id, requestedCenterCm);
  if (!canPlaceFryerAssembly(state, fryerCenterCm)) {
    return { state, collisionWith: "equipment" };
  }

  return {
    state: {
      ...state,
      "standard-double-fryer": { active: true, centerCm: fryerCenterCm },
      "standard-hood": { active: true, centerCm: fryerCenterCm + fryerAssemblyOffsetCm },
    },
    collisionWith: null,
  };
}

export function removeStandardEquipmentAssembly(
  state: StandardEquipmentState,
  id: UserConfigurableEquipmentId,
) {
  if (id !== "standard-double-fryer") return removeStandardEquipment(state, id);
  return withoutFryerAssembly(state);
}

export function restoreStandardEquipmentAssembly(
  state: StandardEquipmentState,
  id: UserConfigurableEquipmentId,
) {
  if (id !== "standard-double-fryer") return restoreStandardEquipment(state, id);

  const definition = equipmentPlacementDefinitions[id];
  const candidates: number[] = [definition.defaultCenterCm];
  const maxDistanceInHalfCentimeters = Math.ceil(
    (definition.maxCenterCm - definition.minCenterCm) * 2,
  );

  for (let step = 1; step <= maxDistanceInHalfCentimeters; step += 1) {
    const distance = step / 2;
    candidates.push(definition.defaultCenterCm - distance, definition.defaultCenterCm + distance);
  }

  for (const candidate of candidates) {
    if (candidate < definition.minCenterCm || candidate > definition.maxCenterCm) continue;
    if (canPlaceFryerAssembly(state, candidate)) {
      return {
        state: {
          ...state,
          "standard-double-fryer": { active: true, centerCm: candidate },
          "standard-hood": { active: true, centerCm: candidate + fryerAssemblyOffsetCm },
        },
        restored: true,
      };
    }
  }

  return { state, restored: false };
}

export function equipmentCenterToWorldOffset(id: MovableStandardEquipmentId, centerCm: number) {
  return centimetersToMeters(centerCm - equipmentPlacementDefinitions[id].defaultCenterCm);
}

export function getEquipmentIntervalCm(state: StandardEquipmentState, id: MovableStandardEquipmentId) {
  const definition = equipmentPlacementDefinitions[id];
  const centerCm = state[id].centerCm;
  return {
    startCm: centerCm - definition.widthCm / 2,
    endCm: centerCm + definition.widthCm / 2,
  };
}
