import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isNarrow = () => window.innerWidth <= 760;

/** Smooth scroll synced with the GSAP ticker, plus scroll-triggered reveals. */
export function initScroll() {
  if (reducedMotion) return () => {};
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) =>
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    );
  });
  // Pinned positions drift if fonts load after the first measure.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

export interface Anchor {
  el: HTMLElement;
  rect: DOMRect;
  /** 0 when the element enters at the bottom of the viewport, 1 when it leaves at the top. */
  p: number;
}

const cache = new Map<string, Anchor | null>();

// Rects only change on scroll, resize or a ScrollTrigger refresh, so measure once per change.
let dirty = true;
const markDirty = () => {
  dirty = true;
};
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', markDirty, { passive: true });
  window.addEventListener('resize', markDirty);
  ScrollTrigger.addEventListener('refresh', markDirty);
}

export function anchor(id: string): Anchor | null {
  if (dirty) {
    dirty = false;
    for (const a of cache.values()) if (a) measure(a);
  }
  let a = cache.get(id);
  if (!a || !a.el.isConnected) {
    const el = document.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
    a = el && measure({ el, rect: el.getBoundingClientRect(), p: 0 });
    cache.set(id, a);
  }
  return a;
}

function measure(a: Anchor) {
  a.rect = a.el.getBoundingClientRect();
  a.p = (window.innerHeight - a.rect.top) / (window.innerHeight + a.rect.height);
  return a;
}
