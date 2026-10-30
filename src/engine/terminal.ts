/** Pure math for the #code terminal: bots eat text at the end of a step, text is hacked in at the start. */
export const EDGE = 0.22;
export const TRAIL = 4;
export const MAX_BOTS = 3;
export const SAFE = '01#$%&*+=<>/|~?';
export const TRAIL_GLYPHS = '█▓▒░';
export const GONE = ' ';
/** Two walk frames per bot, three distinct bots. */
export const SPRITES = [
  ['<(o_o)>', '>(o_o)<'],
  ['[o_o]=', '=[o_o]'],
  ['(>_<)', '(<_<)'],
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/** Seeded hash of an index, 0..1. No Math.random, so scroll up replays the same frames. */
export function hash(i: number, k = 0) {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/** t is the step-local progress (may be outside 0..1). First step is never hacked, last never eaten. */
export function phases(t: number, first: boolean, last: boolean) {
  return { eat: last ? 0 : clamp((t - (1 - EDGE)) / EDGE), hack: first ? 1 : clamp(t / EDGE) };
}

export type Plan = { bots: number; lane: number[]; at: number[]; order: number[][] };

/** rowOf: visual row of each char (nondecreasing). Rows are dealt round-robin to bots. */
export function plan(rowOf: number[], maxBots = MAX_BOTS): Plan {
  const rows = rowOf.length ? rowOf[rowOf.length - 1] + 1 : 0;
  const bots = Math.min(maxBots, rows);
  const order: number[][] = Array.from({ length: bots }, () => []);
  const lane: number[] = [];
  const at: number[] = [];
  rowOf.forEach((r, i) => {
    const b = r % bots;
    lane.push(b);
    at.push(order[b].length);
    order[b].push(i);
  });
  return { bots, lane, at, order };
}

/** What char i shows. real at eat=0 and hack=1. */
export function glyphAt(i: number, real: string, p: Plan, eat: number, hack: number) {
  if (hack < 1 && i >= hack * p.lane.length)
    return SAFE[Math.floor(hash(i, Math.floor(hack * 30)) * SAFE.length)];
  if (eat > 0) {
    const d = eat * (p.order[p.lane[i]].length + TRAIL) - p.at[i];
    if (d > TRAIL) return GONE;
    if (d > 0) return TRAIL_GLYPHS[Math.ceil(d) - 1];
  }
  return real;
}

/** Bot b: the char it is chewing and which sprite frame to show. */
export function botAt(p: Plan, eat: number, b: number) {
  const list = p.order[b];
  const head = eat * (list.length + TRAIL);
  return {
    on: eat > 0 && eat < 1,
    char: list[Math.min(Math.floor(head), list.length - 1)],
    frame: Math.floor(head / 2) % 2,
  };
}
