export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** Screen pixels -> world units on the z=0 plane (canvas is full-screen and fixed). */
export function toWorld(px: number, py: number, vp: { width: number; height: number }) {
  return {
    x: (px / window.innerWidth - 0.5) * vp.width,
    y: -(py / window.innerHeight - 0.5) * vp.height,
  };
}

/** Pixels -> world units, horizontally. */
export const pxToUnits = (px: number, vp: { width: number }) => (px / window.innerWidth) * vp.width;
