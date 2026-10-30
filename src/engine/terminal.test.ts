import { describe, expect, it } from 'vitest';
import { botAt, GONE, glyphAt, phases, plan } from './terminal';

const text = 'laid the foundation of the Horus workflow platform and more words here'.split('');
const rowOf = text.map((_, i) => Math.floor(i / 12));
const p = plan(rowOf);
const render = (eat: number, hack: number) =>
  text.map((c, i) => glyphAt(i, c, p, eat, hack)).join('');

describe('terminal', () => {
  it('restores the real text at eat=0 and hack=1', () => {
    expect(render(0, 1)).toBe(text.join(''));
  });
  it('scrambles then resolves to the real text', () => {
    expect(render(0, 0)).not.toBe(text.join(''));
    expect(render(0, 0.5).slice(0, 10)).toBe(text.join('').slice(0, 10));
    expect(render(0, 1)).toBe(text.join(''));
  });
  it('is deterministic', () => {
    expect(render(0, 0.3)).toBe(render(0, 0.3));
  });
  it('eats monotonically and ends fully gone', () => {
    let prev = 0;
    for (let k = 0; k <= 100; k++) {
      const gone = [...render(k / 100, 1)].filter((c, i) => c !== text[i]).length;
      expect(gone).toBeGreaterThanOrEqual(prev);
      prev = gone;
    }
    expect([...render(1, 1)].every((c) => c === GONE)).toBe(true);
  });
  it('uses at most 3 bots and walks within the text', () => {
    expect(p.bots).toBe(3);
    const b = botAt(p, 0.5, 1);
    expect(b.on).toBe(true);
    expect(p.lane[b.char]).toBe(1);
    expect(botAt(p, 0, 0).on).toBe(false);
    expect(botAt(p, 1, 0).on).toBe(false);
  });
  it('windows: first never hacked, last never eaten', () => {
    expect(phases(0, true, false).hack).toBe(1);
    expect(phases(1, false, true).eat).toBe(0);
    expect(phases(0.5, false, false)).toEqual({ eat: 0, hack: 1 });
    expect(phases(1, false, false).eat).toBeCloseTo(1);
  });
});
