import { describe, expect, it } from "vitest";
import {
  createDefaultStandardEquipmentState,
  equipmentCenterToWorldOffset,
  findEquipmentCollision,
  moveStandardEquipmentAssembly,
  moveStandardEquipment,
  removeStandardEquipmentAssembly,
  removeStandardEquipment,
  restoreStandardEquipmentAssembly,
  restoreStandardEquipment,
  standardEquipmentIdByProductId,
} from "./standardEquipmentState";

describe("standard equipment placement", () => {
  it("preserves every current standard position", () => {
    const state = createDefaultStandardEquipmentState();

    expect(state["standard-double-fryer"].centerCm).toBe(100.5);
    expect(state["standard-hygiene"].centerCm).toBe(245);
    expect(state["standard-gas-griddles"].centerCm).toBe(180);
    expect(state["standard-undercounter-fridge"].centerCm).toBe(330);
    expect(state["standard-hood"].centerCm).toBe(101);
    expect(equipmentCenterToWorldOffset("standard-hygiene", 245)).toBe(0);
  });

  it("blocks floor equipment from overlapping the fixed gas cabinet", () => {
    const state = createDefaultStandardEquipmentState();

    expect(findEquipmentCollision(state, "standard-double-fryer", 50)).toBe("standard-gas-cabinet");
  });

  it("blocks equipment only when horizontal and vertical space overlap", () => {
    const state = createDefaultStandardEquipmentState();

    expect(findEquipmentCollision(state, "standard-undercounter-fridge", 101)).toBe("standard-double-fryer");
    expect(findEquipmentCollision(state, "standard-hood", 100)).toBeNull();
    expect(findEquipmentCollision(state, "standard-hood", 245)).toBe("standard-hygiene");
  });

  it("keeps the previous position after a blocked move", () => {
    const state = createDefaultStandardEquipmentState();
    const result = moveStandardEquipment(state, "standard-hygiene", 150);

    expect(result.state).toBe(state);
    expect(result.collisionWith).toBe("standard-double-fryer");
  });

  it("accepts exact whole and half-centimeter center positions", () => {
    const state = removeStandardEquipment(createDefaultStandardEquipmentState(), "standard-hygiene");
    const wholeCentimeter = moveStandardEquipment(state, "standard-double-fryer", 200);
    const halfCentimeter = moveStandardEquipment(state, "standard-double-fryer", 200.5);

    expect(wholeCentimeter.state["standard-double-fryer"].centerCm).toBe(200);
    expect(halfCentimeter.state["standard-double-fryer"].centerCm).toBe(200.5);
  });

  it("can delete and restore equipment at the nearest free position", () => {
    const state = createDefaultStandardEquipmentState();
    const removed = removeStandardEquipment(state, "standard-hygiene");
    const restored = restoreStandardEquipment(removed, "standard-hygiene");

    expect(removed["standard-hygiene"].active).toBe(false);
    expect(restored.restored).toBe(true);
    expect(restored.state["standard-hygiene"]).toEqual({ active: true, centerCm: 245 });
  });

  it("treats the double fryer and extractor hood as one product", () => {
    expect(standardEquipmentIdByProductId.get("double-fryer")).toBe("standard-double-fryer");
    expect(standardEquipmentIdByProductId.get("extractor-hood")).toBe("standard-double-fryer");
  });

  it("moves the double fryer and extractor hood together", () => {
    const state = removeStandardEquipment(createDefaultStandardEquipmentState(), "standard-hygiene");
    const result = moveStandardEquipmentAssembly(state, "standard-double-fryer", 180);

    expect(result.collisionWith).toBeNull();
    expect(result.state["standard-double-fryer"].centerCm).toBe(180);
    expect(result.state["standard-hood"].centerCm).toBe(180.5);
  });

  it("deletes and restores the complete fryer assembly", () => {
    const state = createDefaultStandardEquipmentState();
    const removed = removeStandardEquipmentAssembly(state, "standard-double-fryer");
    const restored = restoreStandardEquipmentAssembly(removed, "standard-double-fryer");

    expect(removed["standard-double-fryer"].active).toBe(false);
    expect(removed["standard-hood"].active).toBe(false);
    expect(restored.restored).toBe(true);
    expect(restored.state["standard-double-fryer"]).toEqual({ active: true, centerCm: 100.5 });
    expect(restored.state["standard-hood"]).toEqual({ active: true, centerCm: 101 });
  });
});
