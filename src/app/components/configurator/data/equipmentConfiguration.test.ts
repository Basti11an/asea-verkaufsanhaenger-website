import { describe, expect, it } from "vitest";
import {
  addEquipment,
  createDefaultEquipmentConfiguration,
  equipmentPlacementDefinitions,
  findConfigurationCollision,
  moveEquipment,
  moveEquipmentCorner,
  moveEquipmentSide,
  removeEquipment,
  type EquipmentPlacement,
} from "./equipmentConfiguration";

describe("configurable equipment rules", () => {
  it("keeps the standard equipment in its existing places", () => {
    const state = createDefaultEquipmentConfiguration();

    expect(state.items).toMatchObject([
      { productId: "double-fryer", side: "closed-wall", centerCm: 100.5 },
      { productId: "hygiene-area", side: "closed-wall", centerCm: 245 },
      { productId: "wall-cabinet", side: "closed-wall", centerCm: 245 },
      { productId: "gas-griddle", side: "sales-hatch", centerCm: 180 },
      { productId: "undercounter-fridge", side: "closed-wall", centerCm: 330 },
      {
        productId: "splash-guard",
        side: "sales-hatch",
        centerCm: 180,
        parentEquipmentId: "standard-gas-griddles",
        automaticAccessory: "splash-guard",
      },
    ]);
  });

  it("creates the required automatic accessories from one central product rule", () => {
    expect(equipmentPlacementDefinitions.fryer.automaticAccessories).toEqual({ "closed-wall": ["extractor-hood"] });
    expect(equipmentPlacementDefinitions["gas-griddle"].automaticAccessories).toEqual({
      "sales-hatch": ["splash-guard"],
      "closed-wall": ["extractor-hood"],
    });
    expect(equipmentPlacementDefinitions["contact-grill"].automaticAccessories).toEqual({ "sales-hatch": ["splash-guard"] });
    expect(equipmentPlacementDefinitions["electric-griddle"].automaticAccessories).toEqual({ "sales-hatch": ["splash-guard"] });
    expect(equipmentPlacementDefinitions.induction.automaticAccessories).toEqual({
      "sales-hatch": ["splash-guard"],
      "closed-wall": ["extractor-hood"],
    });
    expect(equipmentPlacementDefinitions["kebab-spit"].automaticAccessories).toEqual({ "closed-wall": ["extractor-hood"] });
  });

  it("adds exactly one linked splash guard for each eligible front appliance", () => {
    for (const productId of ["gas-griddle", "contact-grill", "electric-griddle", "induction"] as const) {
      const added = addEquipment({ items: [] }, productId, "sales-hatch");
      const main = added.item!;
      expect(added.state.items.filter((item) => item.parentEquipmentId === main.id)).toEqual([
        expect.objectContaining({ productId: "splash-guard", side: "sales-hatch", automaticAccessory: "splash-guard" }),
      ]);
    }
  });

  it("adds only the required rear extractor hoods", () => {
    for (const productId of ["fryer", "gas-griddle", "induction", "kebab-spit"] as const) {
      const added = addEquipment({ items: [] }, productId, "closed-wall");
      const main = added.item!;
      expect(added.state.items.filter((item) => item.parentEquipmentId === main.id)).toEqual([
        expect.objectContaining({ productId: "extractor-hood", side: "closed-wall", automaticAccessory: "extractor-hood" }),
      ]);
    }
    const contactGrill = addEquipment({ items: [] }, "contact-grill", "closed-wall");
    expect(contactGrill.state.items).toHaveLength(1);
  });

  it("uses the top installation and wall-distance constraints for the extractor hood", () => {
    expect(equipmentPlacementDefinitions["extractor-hood"].placementConstraints).toEqual({
      vertical: "top",
      topMinYCm: 202,
      maxDistanceToLeftWallCm: 28,
      maxDistanceToRightWallCm: 28,
    });
  });

  it("uses the real installation widths for collision checks", () => {
    expect(equipmentPlacementDefinitions["gas-griddle"].widthCm).toBe(100);
    expect(equipmentPlacementDefinitions["gas-griddle"].countertopCutoutWidthCm).toBe(72.05);
    expect(equipmentPlacementDefinitions["electric-griddle"].widthCm).toBe(66);
    expect(equipmentPlacementDefinitions.induction.widthCm).toBe(33);
    expect(equipmentPlacementDefinitions["double-sink"].widthCm).toBe(100);
    expect(equipmentPlacementDefinitions["wall-cabinet"].widthCm).toBe(100);
  });

  it("keeps the complete gas griddle unit inside the trailer", () => {
    const state = createDefaultEquipmentConfiguration();
    const gasGriddle = state.items.find((item) => item.productId === "gas-griddle")!;

    const movedLeft = moveEquipment(state, gasGriddle.id, 0);
    expect(movedLeft.collisionWith).toBeNull();
    expect(movedLeft.state.items.find((item) => item.id === gasGriddle.id)?.centerCm).toBe(50);

    const movedRight = moveEquipment(state, gasGriddle.id, 360);
    expect(movedRight.collisionWith).toBeNull();
    expect(movedRight.state.items.find((item) => item.id === gasGriddle.id)?.centerCm).toBe(310);
  });

  it("keeps automatic accessories synchronized when their parent moves, changes side or is removed", () => {
    const added = addEquipment({ items: [] }, "gas-griddle", "sales-hatch");
    const gasGriddle = added.item!;
    const moved = moveEquipment(added.state, gasGriddle.id, 220);
    expect(moved.state.items.find((item) => item.parentEquipmentId === gasGriddle.id)).toMatchObject({
      productId: "splash-guard",
      centerCm: 220,
    });

    const movedRear = moveEquipmentSide(moved.state, gasGriddle.id, "closed-wall");
    expect(movedRear.state.items.filter((item) => item.parentEquipmentId === gasGriddle.id)).toEqual([
      expect.objectContaining({ productId: "extractor-hood", side: "closed-wall", centerCm: 180 }),
    ]);
    expect(movedRear.state.items.filter((item) => item.productId === "splash-guard")).toHaveLength(0);

    const removed = removeEquipment(movedRear.state, gasGriddle.id);
    expect(removed.items).toHaveLength(0);

    const anotherCabinet = addEquipment(createDefaultEquipmentConfiguration(), "wall-cabinet", "closed-wall");
    expect(anotherCabinet.item).toBeNull();
  });

  it("keeps hygiene and wall cabinet on the rear side", () => {
    const state = createDefaultEquipmentConfiguration();
    const hygiene = addEquipment(state, "hygiene-area", "sales-hatch");
    expect(hygiene.item).toBeNull();
    expect(equipmentPlacementDefinitions["wall-cabinet"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["double-sink"].allowedSides).toEqual(["closed-wall"]);
  });

  it("keeps refrigerator wheel-arch detection while locking its fixed position", () => {
    const state = { items: [] };
    const fridge: EquipmentPlacement = {
      id: "fridge",
      productId: "bottle-fridge",
      side: "closed-wall",
      centerCm: 180,
    };
    expect(findConfigurationCollision(state, fridge)).toBe("wheel-arch");
    expect(moveEquipment({ items: [fridge] }, "fridge", 180).collisionWith).toBe("position-locked");
    expect(findConfigurationCollision(state, fridge, 111.5)).toBeNull();
    expect(findConfigurationCollision(state, fridge, 248.5)).toBeNull();
  });

  it("moves an allowed appliance between the two sides", () => {
    const state = { items: [] };
    const added = addEquipment(state, "contact-grill", "closed-wall");
    expect(added.item).not.toBeNull();
    const moved = moveEquipmentSide(added.state, added.item!.id, "sales-hatch");
    expect(moved.collisionWith).toBeNull();
    expect(moved.state.items[0].side).toBe("sales-hatch");
  });

  it("stores the requested side placement rules centrally", () => {
    expect(equipmentPlacementDefinitions.fryer.allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["double-fryer"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["extractor-hood"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["gas-griddle"].allowedSides).toEqual(["closed-wall", "sales-hatch"]);
    expect(equipmentPlacementDefinitions["contact-grill"].allowedSides).toEqual(["closed-wall", "sales-hatch"]);
    expect(equipmentPlacementDefinitions["electric-griddle"].allowedSides).toEqual(["sales-hatch"]);
    expect(equipmentPlacementDefinitions.induction.allowedSides).toEqual(["closed-wall", "sales-hatch"]);
    expect(equipmentPlacementDefinitions["double-sink"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["hygiene-area"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["wall-cabinet"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["splash-guard"].allowedSides).toEqual(["sales-hatch"]);
    expect(equipmentPlacementDefinitions["kebab-spit"].allowedSides).toEqual(["closed-wall"]);
  });

  it("uses fixed, cross and corner placement types for special products", () => {
    expect(equipmentPlacementDefinitions["bottle-fridge"]).toMatchObject({
      placementType: "fixed",
      fixedPlacement: { id: "rear-right", side: "closed-wall", centerCm: 329 },
    });
    expect(equipmentPlacementDefinitions["cooling-top"]).toMatchObject({
      placementType: "cross",
      widthCm: 40,
      displayWidthCm: 120,
      crossPlacement: { id: "trailer-end", centerCm: 340, rotationDeg: -90 },
    });
    expect(equipmentPlacementDefinitions["undercounter-fridge"]).toMatchObject({
      placementType: "corner",
      allowedCorners: ["front-left", "front-right", "rear-right"],
    });
    expect(equipmentPlacementDefinitions["undercounter-fridge"].allowedCorners).not.toContain("rear-left");
  });

  it("places the cooling top across the trailer end and locks free movement", () => {
    const added = addEquipment({ items: [] }, "cooling-top");
    expect(added.item).toMatchObject({
      side: "closed-wall",
      centerCm: 340,
      placementKey: "trailer-end",
    });
    expect(moveEquipment(added.state, added.item!.id, 250).collisionWith).toBe("position-locked");
  });

  it("moves an undercounter fridge only between configured corners", () => {
    const added = addEquipment({ items: [] }, "undercounter-fridge");
    expect(added.item).toMatchObject({ side: "closed-wall", centerCm: 330, placementKey: "rear-right" });

    const moved = moveEquipmentCorner(added.state, added.item!.id, "front-left");
    expect(moved.collisionWith).toBeNull();
    expect(moved.state.items[0]).toMatchObject({ side: "sales-hatch", centerCm: 30, placementKey: "front-left" });
    expect(moveEquipment(moved.state, added.item!.id, 100).collisionWith).toBe("position-locked");
  });
});
