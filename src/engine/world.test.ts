import { describe, expect, it } from 'vitest';
import { atomAt, N } from './layouts';
import { derive, world } from './world';

describe('derive', () => {
  it('starts as a molecule and ends as a cluster', () => {
    derive([0, 0, 0]);
    expect(world.morph).toBe(0);
    derive([1, 1, 1]);
    expect(world.morph).toBe(2);
    expect(world.visible).toBeCloseTo(0);
  });
  it('morph is monotonic in chapter progress', () => {
    let last = -1;
    for (let k = 0; k <= 20; k++) {
      derive([1, k / 20, 0]);
      expect(world.morph).toBeGreaterThanOrEqual(last);
      last = world.morph;
    }
  });
});

describe('atomAt', () => {
  it('is continuous across the morph and stays finite', () => {
    const a: [number, number, number] = [0, 0, 0];
    const b: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < N; i++) {
      atomAt(i, 0.999, a);
      atomAt(i, 1.001, b);
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(0.05);
      expect(a.every(Number.isFinite)).toBe(true);
    }
  });
});
