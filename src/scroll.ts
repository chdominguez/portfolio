import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isNarrow = () => window.innerWidth < 760;

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

const cache = new Map<string, HTMLElement | null>();

export function anchor(id: string): Anchor | null {
  let el = cache.get(id);
  if (!el || !el.isConnected) {
    el = document.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
    cache.set(id, el);
  }
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { el, rect, p: (window.innerHeight - rect.top) / (window.innerHeight + rect.height) };
}
