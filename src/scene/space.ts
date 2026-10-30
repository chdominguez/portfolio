/** Screen pixels to world units on the z=0 plane (the canvas is fixed and full-screen). */
export function toWorld(px: number, py: number, vp: { width: number; height: number }) {
  return {
    x: (px / window.innerWidth - 0.5) * vp.width,
    y: -(py / window.innerHeight - 0.5) * vp.height,
  };
}

export const smooth = (t: number) => t * t * (3 - 2 * t);
export const narrow = (vp: { width: number; height: number }) => vp.width / vp.height < 0.9;

/** Where the figure sits: right of the text on desktop, above it on phones. */
export function stage(vp: { width: number; height: number }) {
  return narrow(vp)
    ? { x: 0, y: vp.height * 0.2, scale: 0.55 }
    : { x: vp.width * 0.22, y: 0, scale: 1 };
}
