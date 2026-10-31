import { gasGriddlePlacement } from "../data/defaultConfiguration";
import { centimetersToMeters } from "./coordinates";

export function clampGasGriddleCenterCm(value: number) {
  const roundedValue = Math.round(value);
  return Math.min(gasGriddlePlacement.maxCenterCm, Math.max(gasGriddlePlacement.minCenterCm, roundedValue));
}

export function gasGriddleCenterToWorldOffset(centerCm: number) {
  return centimetersToMeters(clampGasGriddleCenterCm(centerCm) - gasGriddlePlacement.defaultCenterCm);
}
