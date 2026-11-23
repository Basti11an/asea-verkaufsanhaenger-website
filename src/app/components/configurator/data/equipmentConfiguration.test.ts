import { describe, expect, it } from "vitest";
import {
  addEquipment,
  createDefaultEquipmentConfiguration,
  equipmentPlacementDefinitions,
  findConfigurationCollision,
  getAccessoryRules,
  moveEquipment,
  moveEquipmentCorner,
  moveEquipmentSide,
  moveEquipmentToCrossPlacement,
  removeEquipment,
  setEquipmentAccessoryEnabled,
  setEquipmentAccessoryLength,
  synchronizeAutomaticAccessories,
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
        productId: "extractor-hood",
        side: "closed-wall",
        centerCm: 100.5,
        widthCm: 60,
        parentEquipmentId: "standard-double-fryer",
        automaticAccessory: "extractor-hood",
      },
      {
        productId: "splash-guard",
        side: "sales-hatch",
        centerCm: 180,
        parentEquipmentId: "standard-gas-griddles",
        automaticAccessory: "splash-guard",
      },
    ]);
  });

  it("stores required and optional accessories in one central product rule", () => {
    expect(equipmentPlacementDefinitions.fryer.accessoryRules?.["closed-wall"]).toEqual([
      expect.objectContaining({ id: "extractor-hood", requirement: "optional" }),
    ]);
    expect(equipmentPlacementDefinitions["double-fryer"].accessoryRules?.["closed-wall"]).toEqual([
      expect.objectContaining({ id: "extractor-hood", requirement: "required" }),
    ]);
    expect(equipmentPlacementDefinitions["gas-griddle"].accessoryRules?.["sales-hatch"]).toEqual([
      expect.objectContaining({ id: "splash-guard", requirement: "required" }),
    ]);
    expect(equipmentPlacementDefinitions["contact-grill"].accessoryRules?.["sales-hatch"]).toEqual([
      expect.objectContaining({ id: "splash-guard", requirement: "optional" }),
    ]);
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
      minDistanceToSideWallsCm: 28,
    });
    expect(equipmentPlacementDefinitions["extractor-hood"]).toMatchObject({
      widthCm: 60,
      minCenterCm: 58,
      maxCenterCm: 302,
    });
  });

  it("keeps automatic hoods 28 cm clear of both rounded end walls", () => {
    const state = synchronizeAutomaticAccessories({ items: [
      { id: "left-fryer", productId: "fryer", side: "closed-wall", centerCm: 15 },
      { id: "right-fryer", productId: "fryer", side: "closed-wall", centerCm: 345 },
    ] });
    expect(state.items.find((item) => item.parentEquipmentId === "left-fryer")?.centerCm).toBe(43);
    expect(state.items.find((item) => item.parentEquipmentId === "right-fryer")?.centerCm).toBe(317);

    const standalone = addEquipment({ items: [] }, "extractor-hood", "closed-wall");
    expect(moveEquipment(standalone.state, standalone.item!.id, 0).state.items[0].centerCm).toBe(58);
    expect(moveEquipment(standalone.state, standalone.item!.id, 360).state.items[0].centerCm).toBe(302);

    expect(createDefaultEquipmentConfiguration().items.find((item) => item.productId === "extractor-hood")?.centerCm).toBe(100.5);
  });

  it("sizes each rear hood to the appliance below it without spanning the whole wall", () => {
    const state = synchronizeAutomaticAccessories({ items: [
      { id: "fryer", productId: "fryer", side: "closed-wall", centerCm: 155 },
      { id: "griddle", productId: "gas-griddle", side: "closed-wall", centerCm: 310 },
    ] });
    expect(state.items.find((item) => item.parentEquipmentId === "fryer")).toMatchObject({ widthCm: 30, centerCm: 155 });
    expect(state.items.find((item) => item.parentEquipmentId === "griddle")).toMatchObject({ widthCm: 100, centerCm: 282 });
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
    expect(anotherCabinet.item).toMatchObject({ productId: "wall-cabinet", side: "closed-wall" });
  });

  it("keeps hygiene and wall cabinet on the rear side", () => {
    const state = createDefaultEquipmentConfiguration();
    const hygiene = addEquipment(state, "hygiene-area", "sales-hatch");
    expect(hygiene.item).toBeNull();
    expect(equipmentPlacementDefinitions["wall-cabinet"].allowedSides).toEqual(["closed-wall"]);
    expect(equipmentPlacementDefinitions["double-sink"].allowedSides).toEqual(["closed-wall"]);
  });

  it("places wall cabinets above normal equipment while retaining wall-mounted collision checks", () => {
    const lowerEquipment: EquipmentPlacement = {
      id: "sink",
      productId: "double-sink",
      side: "closed-wall",
      centerCm: 180,
    };
    const cabinet: EquipmentPlacement = {
      id: "cabinet",
      productId: "wall-cabinet",
      side: "closed-wall",
      centerCm: 180,
    };
    const secondCabinet: EquipmentPlacement = { ...cabinet, id: "second-cabinet" };

    expect(findConfigurationCollision({ items: [lowerEquipment] }, cabinet)).toBeNull();
    expect(findConfigurationCollision({ items: [cabinet] }, secondCabinet)).toBe("cabinet");
    expect(addEquipment({ items: [lowerEquipment] }, "wall-cabinet", "closed-wall").item).not.toBeNull();
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

  it("uses fixed, cross-option and corner placement types for special products", () => {
    expect(equipmentPlacementDefinitions["bottle-fridge"]).toMatchObject({
      placementType: "fixed",
      fixedPlacement: { id: "rear-right", side: "closed-wall", centerCm: 329 },
    });
    expect(equipmentPlacementDefinitions["cooling-top"]).toMatchObject({
      placementType: "side",
      allowedSides: ["sales-hatch"],
      widthCm: 40,
      displayWidthCm: 120,
      crossPlacement: { id: "trailer-end", centerCm: 35.5, rotationDeg: -90 },
    });
    expect(equipmentPlacementDefinitions["undercounter-fridge"]).toMatchObject({
      placementType: "corner",
      allowedCorners: ["front-left", "front-right", "rear-right"],
    });
    expect(equipmentPlacementDefinitions["undercounter-fridge"].allowedCorners).not.toContain("rear-left");
  });

  it("switches the cooling top between the front work surface and cross-trailer end position", () => {
    const added = addEquipment({ items: [] }, "cooling-top");
    expect(added.item).toMatchObject({
      side: "sales-hatch",
      centerCm: 180,
    });
    expect(moveEquipment(added.state, added.item!.id, 250).state.items[0]).toMatchObject({ centerCm: 250 });

    const cross = moveEquipmentToCrossPlacement(added.state, added.item!.id);
    expect(cross.state.items[0]).toMatchObject({
      side: "closed-wall",
      centerCm: 35.5,
      placementKey: "trailer-end",
    });
    expect(moveEquipment(cross.state, added.item!.id, 250).collisionWith).toBe("position-locked");

    const front = moveEquipmentSide(cross.state, added.item!.id, "sales-hatch");
    expect(front.state.items[0]).toMatchObject({ side: "sales-hatch", placementKey: undefined });
  });

  it("moves an undercounter fridge only between configured corners", () => {
    const added = addEquipment({ items: [] }, "undercounter-fridge");
    expect(added.item).toMatchObject({ side: "closed-wall", centerCm: 330, placementKey: "rear-right" });

    const moved = moveEquipmentCorner(added.state, added.item!.id, "front-left");
    expect(moved.collisionWith).toBeNull();
    expect(moved.state.items[0]).toMatchObject({ side: "sales-hatch", centerCm: 31, placementKey: "front-left" });
    expect(moveEquipment(moved.state, added.item!.id, 100).collisionWith).toBe("position-locked");
  });

  it("uses the gas cabinet top only as support for suitable countertop appliances", () => {
    const induction: EquipmentPlacement = { id: "induction", productId: "induction", side: "closed-wall", centerCm: 35.5 };
    const grill: EquipmentPlacement = { id: "grill", productId: "contact-grill", side: "closed-wall", centerCm: 35.5 };
    const kebab: EquipmentPlacement = { id: "kebab", productId: "kebab-spit", side: "closed-wall", centerCm: 35.5 };

    expect(findConfigurationCollision({ items: [] }, induction)).toBeNull();
    expect(findConfigurationCollision({ items: [] }, grill)).toBeNull();
    expect(findConfigurationCollision({ items: [] }, kebab)).toBe("fixed-gas-cabinet");
    expect(equipmentPlacementDefinitions.induction.canStandOnGasCabinet).toBe(true);
    expect(equipmentPlacementDefinitions["kebab-spit"].canStandOnGasCabinet).toBe(false);
  });

  it("measures the fryer clearance from the real outer edges of the sink", () => {
    const sink: EquipmentPlacement = { id: "sink", productId: "double-sink", side: "closed-wall", centerCm: 250 };
    const fryer: EquipmentPlacement = { id: "fryer", productId: "fryer", side: "closed-wall", centerCm: 146 };
    expect(findConfigurationCollision({ items: [sink] }, fryer, 146)).toBeNull();
    expect(findConfigurationCollision({ items: [sink] }, fryer, 147)).toBeNull();
    expect(findConfigurationCollision({ items: [sink] }, fryer, 150)).toBe("sink-clearance");
    expect(moveEquipment({ items: [sink, fryer] }, fryer.id, 150).state.items.find((item) => item.id === fryer.id)?.centerCm).toBe(146);
  });

  it("allows optional accessories to be toggled but keeps required ones enabled", () => {
    const optionalFryer = addEquipment({ items: [] }, "fryer", "closed-wall");
    const disabled = setEquipmentAccessoryEnabled(optionalFryer.state, optionalFryer.item!.id, "extractor-hood", false);
    expect(disabled.items.some((item) => item.automaticAccessory === "extractor-hood")).toBe(false);

    const requiredFryer = addEquipment({ items: [] }, "double-fryer", "closed-wall");
    const unchanged = setEquipmentAccessoryEnabled(requiredFryer.state, requiredFryer.item!.id, "extractor-hood", false);
    expect(unchanged.items.some((item) => item.automaticAccessory === "extractor-hood")).toBe(true);
    expect(getAccessoryRules(requiredFryer.item!)[0].requirement).toBe("required");
  });

  it("stores splash guards at 130 cm minimum and scales them from central accessory state", () => {
    const added = addEquipment({ items: [] }, "contact-grill", "sales-hatch");
    expect(added.state.items.find((item) => item.automaticAccessory === "splash-guard")?.widthCm).toBe(130);
    const enlarged = setEquipmentAccessoryLength(added.state, added.item!.id, "splash-guard", 180);
    expect(enlarged.items.find((item) => item.automaticAccessory === "splash-guard")?.widthCm).toBe(180);
    const clamped = setEquipmentAccessoryLength(enlarged, added.item!.id, "splash-guard", 120);
    expect(clamped.items.find((item) => item.automaticAccessory === "splash-guard")?.widthCm).toBe(130);
  });

  it("clips the hood before a wall cabinet without creating an overlap", () => {
    const state = synchronizeAutomaticAccessories({ items: [
      { id: "griddle", productId: "gas-griddle", side: "closed-wall", centerCm: 180 },
      { id: "cabinet", productId: "wall-cabinet", side: "closed-wall", centerCm: 245 },
    ] });
    const hood = state.items.find((item) => item.parentEquipmentId === "griddle")!;
    expect(hood).toMatchObject({ centerCm: 162.5, widthCm: 65 });
    expect(hood.centerCm + hood.widthCm! / 2).toBeLessThanOrEqual(195);
  });

  it("applies the 28 cm end-wall rule to the real wall-cabinet edges", () => {
    expect(equipmentPlacementDefinitions["wall-cabinet"]).toMatchObject({ minCenterCm: 78, maxCenterCm: 282, widthCm: 100 });
    const cabinet = addEquipment({ items: [] }, "wall-cabinet", "closed-wall");
    expect(moveEquipment(cabinet.state, cabinet.item!.id, 0).state.items[0].centerCm).toBe(78);
    expect(moveEquipment(cabinet.state, cabinet.item!.id, 360).state.items[0].centerCm).toBe(282);
  });

  it("uses the same recessed installation data for electric and gas griddles", () => {
    expect(equipmentPlacementDefinitions["gas-griddle"].countertopCutoutWidthCm).toBeDefined();
    expect(equipmentPlacementDefinitions["electric-griddle"]).toMatchObject({ countertopCutoutWidthCm: 66, blocksCountertop: true });
  });
});
