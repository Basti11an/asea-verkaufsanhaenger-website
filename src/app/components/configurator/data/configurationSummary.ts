import type { EquipmentSide } from "../types";
import {
  equipmentPlacementDefinitions,
  fixedGasCabinet,
  getEquipmentInterval,
  type EquipmentConfigurationState,
} from "./equipmentConfiguration";
import { productById } from "./products";

export type CountertopInterval = {
  startCm: number;
  endCm: number;
};

export type ConfigurationDetailRow = {
  id: string;
  name: string;
  widthCm: number;
  centerCm: number;
  note?: string;
};

const TRAILER_LENGTH_CM = 360;

function mergeIntervals(intervals: readonly CountertopInterval[]) {
  return [...intervals]
    .map((interval) => ({
      startCm: Math.max(0, interval.startCm),
      endCm: Math.min(TRAILER_LENGTH_CM, interval.endCm),
    }))
    .filter((interval) => interval.endCm > interval.startCm)
    .sort((a, b) => a.startCm - b.startCm)
    .reduce<CountertopInterval[]>((result, interval) => {
      const previous = result.at(-1);
      if (!previous || interval.startCm > previous.endCm) result.push({ ...interval });
      else previous.endCm = Math.max(previous.endCm, interval.endCm);
      return result;
    }, []);
}

export function getCountertopIntervals(
  state: EquipmentConfigurationState,
  side: EquipmentSide,
) {
  const blocked = state.items
    .filter((item) => item.side === side && equipmentPlacementDefinitions[item.productId].blocksCountertop)
    .map((item) => getEquipmentInterval(item));

  if (side === fixedGasCabinet.side) {
    blocked.push({ startCm: fixedGasCabinet.startCm, endCm: fixedGasCabinet.endCm });
  }

  const merged = mergeIntervals(blocked);
  const free: CountertopInterval[] = [];
  let cursor = 0;

  merged.forEach((interval) => {
    if (interval.startCm > cursor) free.push({ startCm: cursor, endCm: interval.startCm });
    cursor = Math.max(cursor, interval.endCm);
  });
  if (cursor < TRAILER_LENGTH_CM) free.push({ startCm: cursor, endCm: TRAILER_LENGTH_CM });

  return free;
}

export function getConfigurationRows(
  state: EquipmentConfigurationState,
  side: EquipmentSide,
) {
  const equipmentRows: ConfigurationDetailRow[] = state.items
    .filter((item) => item.side === side)
    .map((item) => {
      const definition = equipmentPlacementDefinitions[item.productId];
      const product = productById.get(item.productId);
      return {
        id: item.id,
        name: product?.name[0] ?? item.productId,
        widthCm: definition.widthCm,
        centerCm: item.centerCm,
      };
    });

  if (side === fixedGasCabinet.side) {
    equipmentRows.push({
      id: "fixed-gas-cabinet",
      name: "Gasschrank",
      widthCm: fixedGasCabinet.endCm - fixedGasCabinet.startCm,
      centerCm: (fixedGasCabinet.startCm + fixedGasCabinet.endCm) / 2,
      note: "fix, hinten links",
    });
  }

  const countertopRows = getCountertopIntervals(state, side).map((interval, index) => ({
    id: `${side}-countertop-${index}`,
    name: "Arbeitsfläche",
    widthCm: interval.endCm - interval.startCm,
    centerCm: (interval.startCm + interval.endCm) / 2,
  }));

  return [...equipmentRows, ...countertopRows].sort((a, b) => a.centerCm - b.centerCm);
}
