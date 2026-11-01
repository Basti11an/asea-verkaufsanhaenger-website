import { describe, expect, it } from "vitest";
import {
  addEquipment,
  createDefaultEquipmentConfiguration,
  equipmentPlacementDefinitions,
  findConfigurationCollision,
  moveEquipment,
  moveEquipmentSide,
  type EquipmentPlacement,
} from "./equipmentConfiguration";

describe("configurable equipment rules", () => {
  it("keeps the standard equipment in its existing places", () => {
    const state = createDefaultEquipmentConfiguration();

    expect(state.items).toMatchObject([
      { productId: "double-fryer", side: "closed-wall", centerCm: 100.5 },
      { productId: "hygiene-area", side: "closed-wall", centerCm: 245 },
      { productId: "gas-griddle", side: "sales-hatch", centerCm: 180 },
      { productId: "undercounter-fridge", side: "closed-wall", centerCm: 330 },
    ]);
  });

  it("allows multiple independent splash guards and wall cabinets", () => {
    let state = createDefaultEquipmentConfiguration();
    const firstSplash = addEquipment(state, "splash-guard", "sales-hatch");
    expect(firstSplash.item).not.toBeNull();
    state = firstSplash.state;
    const secondSplash = addEquipment(state, "splash-guard", "sales-hatch");
    expect(secondSplash.item).not.toBeNull();
    expect(secondSplash.state.items.filter((item) => item.productId === "splash-guard")).toHaveLength(2);

    const firstCabinet = addEquipment(state, "wall-cabinet", "closed-wall");
    expect(firstCabinet.item).not.toBeNull();
    const secondCabinet = addEquipment(firstCabinet.state, "wall-cabinet", "closed-wall");
    expect(secondCabinet.item).not.toBeNull();
  });

  it("keeps hygiene and wall cabinet on the rear side", () => {
    const state = createDefaultEquipmentConfiguration();
    const hygiene = addEquipment(state, "hygiene-area", "sales-hatch");
    expect(hygiene.item).toBeNull();
    expect(equipmentPlacementDefinitions["wall-cabinet"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["double-sink"].allowedSides).toEqual(["closed-wall"]);
  });

  it("blocks refrigerators from the wheel arch interval", () => {
    const state = { items: [] };
    const fridge: EquipmentPlacement = {
      id: "fridge",
      productId: "bottle-fridge",
      side: "closed-wall",
      centerCm: 180,
    };
    expect(findConfigurationCollision(state, fridge)).toBe("wheel-arch");
    expect(moveEquipment({ items: [fridge] }, "fridge", 180).collisionWith).toBe("wheel-arch");
  });

  it("moves an allowed appliance between the two sides", () => {
    const state = { items: [] };
    const added = addEquipment(state, "contact-grill", "closed-wall");
    expect(added.item).not.toBeNull();
    const moved = moveEquipmentSide(added.state, added.item!.id, "sales-hatch");
    expect(moved.collisionWith).toBeNull();
    expect(moved.state.items[0].side).toBe("sales-hatch");
  });
});
