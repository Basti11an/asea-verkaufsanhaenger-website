import { describe, expect, it } from 'vitest';
import { clampPosition, isDemoValid } from './placementDemo';

describe('prototype placement zones', () => {
  it('keeps the entire rectangle inside the planning surface', () => {
    expect(clampPosition(-15, 120)).toEqual({ x: 0, y: 78 });
    expect(clampPosition(120, -15)).toEqual({ x: 84, y: 0 });
  });
  it('accepts the initial position', () => {
    expect(isDemoValid({ x: 27, y: 39 })).toBe(true);
  });
  it('rejects partial overlap with the cabinet and both wheel zones', () => {
    expect(isDemoValid({ x: 21, y: 29 })).toBe(false);
    expect(isDemoValid({ x: 40, y: 10 })).toBe(false);
    expect(isDemoValid({ x: 40, y: 70 })).toBe(false);
  });
  it('allows touching a restricted zone without overlapping it', () => {
    expect(isDemoValid({ x: 22, y: 0 })).toBe(true);
  });
});
