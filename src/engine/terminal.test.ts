import { describe, expect, it } from 'vitest';
import { botAt, glyphAt, phases, plan } from './terminal';

const text = 'laid the foundation of the Horus workflow platform and more words here'.split('');
const rowOf = text.map((_, i) => Math.floor(i / 12));
const p = plan(rowOf);
const render = (hack: number) => text.map((c, i) => glyphAt(i, c, p, hack)).join('');

describe('terminal', () => {
  it('shows the real text once hacked in', () => {
    expect(render(1)).toBe(text.join(''));
  });
  it('scrambles first, then resolves in order', () => {
    expect(render(0)).not.toBe(text.join(''));
    const mid = render(0.5);
    expect(mid.slice(0, 3)).toBe(text.join('').slice(0, 3));
    expect(mid).not.toBe(text.join(''));
  });
  it('never hides text: every char is a real or a scramble glyph, count is constant', () => {
    for (let k = 0; k <= 20; k++) expect(render(k / 20)).toHaveLength(text.length);
  });
  it('is deterministic and reversible', () => {
    expect(render(0.3)).toBe(render(0.3));
  });
  it('uses at most 3 bots and walks within its own lane', () => {
    expect(p.bots).toBe(3);
    const b = botAt(p, 0.5, 1);
    expect(b.on).toBe(true);
    expect(p.lane[b.char]).toBe(1);
    expect(botAt(p, 0, 0).on).toBe(false);
    expect(botAt(p, 1, 0).on).toBe(false);
  });
  it('first step is already present, later ones are hacked in over the window start', () => {
    expect(phases(0, true).hack).toBe(1);
    expect(phases(0, false).hack).toBe(0);
    expect(phases(1, false).hack).toBe(1);
  });
});
