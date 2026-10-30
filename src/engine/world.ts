/**
 * Plain mutable bridge between the DOM timeline and the WebGL scene. Scroll writes it, actors
 * read it inside the render loop. Never put this in React state.
 */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export interface World {
  /** hero molecule presence, 1 until the Code chapter starts */
  mol: number;
  /** 1 while the About section is in view: the pool steps aside */
  gap: number;
  /** fragment flight + burst, 0..1 */
  impact: number;
  /** screen px of the title the fragment hits */
  target: { x: number; y: number };
  /** snake crossing, 0..1 */
  snake: number;
  /** racks appear, 0..1 */
  racks: number;
  /** racks lit, 0..1 */
  lit: number;
  /** canvas visibility 0..1 */
  visible: number;
  /** intro scale 0..1 */
  reveal: number;
  velocity: number;
}

export const world: World = {
  mol: 1,
  gap: 0,
  impact: 0,
  target: { x: 0, y: 0 },
  snake: 0,
  racks: 0,
  lit: 0,
  visible: 1,
  reveal: 0,
  velocity: 0,
};

/** Progress of the three pinned chapters (0 before, 1 after) to world state. */
export function derive(p: readonly [number, number, number], w: World = world) {
  w.impact = clamp((p[0] - 0.1) / 0.5);
  w.mol = 1 - clamp(p[1] / 0.12);
  w.snake = clamp((p[1] - 0.2) / 0.75);
  w.racks = clamp(p[2] / 0.15);
  w.lit = clamp((p[2] - 0.3) / 0.6);
  w.visible = 1 - clamp((p[2] - 0.92) / 0.08);
  return w;
}
