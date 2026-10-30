import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initTerminal } from './terminalDom';
import { clamp, derive, world } from './world';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Wires the DOM chapters to the world. Each chapter is a tall section with a sticky pin, so
 * ScrollTrigger only has to report progress (no pinning, which fights smooth scrolling).
 */
export function initStory() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const progress: [number, number, number] = [0, 0, 0];
    const chapters = gsap.utils.toArray<HTMLElement>('.chapter');
    const title = document.querySelector<HTMLElement>('#molecules h2');
    const split = title ? SplitText.create(title, { type: 'chars' }) : null;
    const seeds = split?.chars.map((_, i) => ({
      x: (Math.sin(i * 12.9898) * 43758) % 1,
      y: (Math.sin(i * 78.233) * 12345) % 1,
    }));

    const measureTarget = () => {
      if (!title) return;
      const r = title.getBoundingClientRect();
      world.target.x = r.left + r.width * 0.9;
      world.target.y = r.top + r.height / 2;
    };

    const codeEl = document.querySelector<HTMLElement>('#code');
    const term = codeEl ? initTerminal(codeEl) : null; // #code terminal: bots eat, text is hacked in

    // the pool steps aside while About is on screen, then returns for the Molecules chapter
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 85%',
      end: 'bottom 15%',
      onUpdate: (self) => {
        const q = self.progress;
        world.gap = clamp(Math.min(q / 0.2, (1 - q) / 0.2));
      },
      onLeave: () => (world.gap = 0),
      onLeaveBack: () => (world.gap = 0),
    });

    chapters.forEach((el, i) => {
      const steps = Array.from(el.querySelectorAll<HTMLElement>('.step'));
      let current = -1;
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onRefresh: measureTarget,
        onUpdate: (self) => {
          progress[i] = self.progress;
          derive(progress);
          if (i === 0) measureTarget();
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (idx !== current) {
            current = idx;
            steps.forEach((s, k) => {
              s.classList.toggle('is-active', k === idx);
              s.classList.toggle('is-past', k < idx);
            });
          }
          if (el === codeEl) term?.update(self.progress);
          el.style.setProperty('--p', self.progress.toFixed(3));
          if (i === 0 && split && seeds) {
            // damped shake once the fragment lands (impact 0.7..1), reversible on scroll up
            const hit = clamp((world.impact - 0.7) / 0.3);
            const pulse = hit === 0 ? 0 : Math.sin(hit * 14) * Math.exp(-hit * 3.5);
            split.chars.forEach((c, k) => {
              gsap.set(c, {
                x: seeds[k].x * 60 * pulse,
                y: seeds[k].y * 40 * pulse,
                rotation: seeds[k].x * 18 * pulse,
              });
            });
          }
        },
      });
    });

    // keep progress-derived state correct on load and after a resize
    ScrollTrigger.addEventListener('refresh', () => derive(progress));
    gsap.to(world, { reveal: 1, duration: 1.6, ease: 'power3.out', delay: 0.15 });
    gsap.from('[data-in]', {
      y: 28,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.09,
      delay: 0.1,
      clearProps: 'all',
    });
    gsap.utils.toArray<HTMLElement>('.index .reveal').forEach((el) =>
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    );

    return () => {
      term?.revert();
      split?.revert();
    };
  });
  return () => mm.revert();
}
