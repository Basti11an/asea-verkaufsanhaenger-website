import type { Placement } from "./types";
// Percent coordinates and a fictional 300 cm scale, not actual trailer measurements.
export const DEMO_WIDTH = 16;
export const DEMO_HEIGHT = 22;
export const blockedZones = [
  { x: 0, y: 0, w: 22, h: 30 },
  { x: 43, y: 0, w: 20, h: 15 },
  { x: 43, y: 85, w: 20, h: 15 },
];
export const clampPosition = (x: number, y: number) => ({
  x: Math.max(0, Math.min(100 - DEMO_WIDTH, x)),
  y: Math.max(0, Math.min(100 - DEMO_HEIGHT, y)),
});
export const isDemoValid = (p: Pick<Placement, "x" | "y">) =>
  blockedZones.every(
    (z) =>
      p.x + DEMO_WIDTH <= z.x ||
      p.x >= z.x + z.w ||
      p.y + DEMO_HEIGHT <= z.y ||
      p.y >= z.y + z.h,
  );
