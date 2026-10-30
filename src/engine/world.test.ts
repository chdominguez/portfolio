import { describe, expect, it } from 'vitest';
import { derive, world } from './world';

describe('derive', () => {
  it('starts with the molecule and nothing else', () => {
    derive([0, 0, 0]);
    expect(world).toMatchObject({ mol: 1, impact: 0, snake: 0, racks: 0, lit: 0, visible: 1 });
  });
  it('ends with the racks lit and the canvas hidden', () => {
    derive([1, 1, 1]);
    expect(world).toMatchObject({ mol: 0, snake: 1, racks: 1, lit: 1 });
    expect(world.visible).toBeCloseTo(0);
  });
  it('every channel is monotonic in chapter progress', () => {
    const last = { impact: -1, snake: -1, lit: -1 };
    for (let k = 0; k <= 20; k++) {
      derive([k / 20, k / 20, k / 20]);
      for (const key of Object.keys(last) as (keyof typeof last)[]) {
        expect(world[key]).toBeGreaterThanOrEqual(last[key]);
        last[key] = world[key];
      }
    }
  });
});
