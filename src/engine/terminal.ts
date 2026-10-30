/** Pure math for the #code terminal: each step is "hacked in" by bots as it arrives, then stays. */
export const HACK = 0.45;
export const MAX_BOTS = 3;
export const SAFE = '01#$%&*+=<>/|~?';
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

/** t is the step-local progress (may be outside 0..1). The first step is already there. */
export function phases(t: number, first: boolean) {
  return { hack: first ? 1 : clamp(t / HACK) };
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

/** What char i shows: scrambled ahead of its bot, the real char behind it. */
export function glyphAt(i: number, real: string, p: Plan, hack: number) {
  if (hack < 1 && p.at[i] >= hack * p.order[p.lane[i]].length)
    return SAFE[Math.floor(hash(i, Math.floor(hack * 30)) * SAFE.length)];
  return real;
}

/** Bot b: the char it is working on and which sprite frame to show. */
export function botAt(p: Plan, hack: number, b: number) {
  const list = p.order[b];
  const head = hack * list.length;
  return {
    on: hack > 0 && hack < 1,
    char: list[Math.min(Math.floor(head), list.length - 1)],
    frame: Math.floor(head / 2) % 2,
  };
}
