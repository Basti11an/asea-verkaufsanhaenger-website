import type { PositionCm } from "../types";
import { trailerConfiguration } from "../data/defaultConfiguration";

export const CENTIMETERS_PER_METER = 100;
export const GLB_RAW_UNITS_PER_METER = trailerConfiguration.rawUnitsPerMeter;

export function centimetersToMeters(value: number) {
  return value / CENTIMETERS_PER_METER;
}

export function configurationToWorld(position: PositionCm): [number, number, number] {
  const [originX, originY, originZ] = trailerConfiguration.modelPosition;

  return [
    originX + centimetersToMeters(position.longitudinal),
    originY + centimetersToMeters(position.height),
    originZ - centimetersToMeters(position.depth),
  ];
}

export function glbRawToConfiguration(raw: readonly [number, number, number]): PositionCm {
  const centimetersPerRawUnit = CENTIMETERS_PER_METER / GLB_RAW_UNITS_PER_METER;

  return {
    longitudinal: raw[0] * centimetersPerRawUnit,
    height: raw[1] * centimetersPerRawUnit,
    depth: -raw[2] * centimetersPerRawUnit,
  };
}
