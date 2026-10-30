import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { world } from './world';

gsap.registerPlugin(ScrollTrigger);

/** Set by the Stage once the canvas exists; called from the single ticker below. */
export const renderHook: { fn: ((ms: number) => void) | null } = { fn: null };

/** Lenis, ScrollTrigger and the WebGL render share one gsap.ticker callback. */
export function startClock() {
  const lenis = new Lenis({ anchors: true });
  lenis.on('scroll', (l: Lenis) => {
    world.velocity = l.velocity;
    ScrollTrigger.update();
  });
  const tick = (t: number) => {
    lenis.raf(t * 1000);
    renderHook.fn?.(t * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
