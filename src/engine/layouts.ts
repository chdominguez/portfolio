// 48 atoms in a 6 x 8 lattice. The same indices (and edges) are laid out three ways, so the
// morph between chapters is a plain interpolation of positions.
export const COLS = 8;
export const ROWS = 6;
export const N = COLS * ROWS;

export type Layout = Float32Array;

const make = (f: (r: number, c: number) => [number, number, number]): Layout => {
  const out = new Float32Array(N * 3);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) out.set(f(r, c), (r * COLS + c) * 3);
  return out;
};

/** Twisted ring stack, a nanotube-like molecule. */
export const molecule = make((r, c) => {
  const a = (c / COLS) * Math.PI * 2 + r * (Math.PI / COLS);
  return [Math.cos(a) * 2, (r - (ROWS - 1) / 2) * 1.0, Math.sin(a) * 2];
});

/** Loose layered call graph. */
export const graph = make((r, c) => [
  (c - (COLS - 1) / 2) * 1.1 + Math.sin(r * 3.1 + c * 1.3) * 0.45,
  ((ROWS - 1) / 2 - r) * 1.3 + Math.cos(c * 2.1 + r) * 0.35,
  Math.sin(r * 1.7 + c) * 0.4,
]);

/** Compute nodes on a plate. */
export const cluster = make((r, c) => [(c - (COLS - 1) / 2) * 1.0, ((ROWS - 1) / 2 - r) * 1.0, 0]);

/** Edge index pairs: along each row, and between rows. */
export const EDGES: [number, number][] = [];
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    if (c < COLS - 1) EDGES.push([i, i + 1]);
    if (r < ROWS - 1) EDGES.push([i, i + COLS]);
  }

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Writes the morphed position of atom `i` (morph 0..2) into `out`. */
export function atomAt(i: number, morph: number, out: [number, number, number]) {
  const t1 = smooth(Math.min(1, Math.max(0, morph)));
  const t2 = smooth(Math.min(1, Math.max(0, morph - 1)));
  for (let k = 0; k < 3; k++) {
    const a = molecule[i * 3 + k];
    const b = graph[i * 3 + k];
    const c = cluster[i * 3 + k];
    const ab = a + (b - a) * t1;
    out[k] = ab + (c - ab) * t2;
  }
  return out;
}
