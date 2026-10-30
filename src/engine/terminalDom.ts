import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { botAt, glyphAt, phases, plan, SPRITES, type Plan } from './terminal';

type StepData = {
  chars: HTMLElement[];
  real: string[];
  shown: string[];
  plan: Plan;
  x: number[];
  y: number[];
  key: string;
};

/** DOM side of the #code terminal. Geometry is measured on ScrollTrigger refresh only; update() just writes text and transforms. */
export function initTerminal(chapter: HTMLElement) {
  const pin = chapter.querySelector<HTMLElement>('.pin');
  const holder = chapter.querySelector<HTMLElement>('.steps');
  const bots = Array.from(chapter.querySelectorAll<HTMLElement>('.bot'));
  if (!pin || !holder) return null;
  const els = Array.from(chapter.querySelectorAll<HTMLElement>('.step'));
  const splits: SplitText[] = [];
  const steps: StepData[] = els.map((s) => {
    const split = SplitText.create(s.querySelectorAll('.period, h3, .org, ul li'), {
      type: 'words,chars',
    });
    splits.push(split);
    const chars = split.chars as HTMLElement[];
    return {
      chars,
      real: chars.map((c) => c.textContent ?? ''),
      shown: [],
      plan: plan([]),
      x: [],
      y: [],
      key: '',
    };
  });
  let last = 0;

  const update = (p: number) => {
    last = p;
    const n = steps.length;
    let hacking = false;
    steps.forEach((s, k) => {
      if (!s.x.length) return; // not measured yet; the refresh event calls update again
      const { hack } = phases(p * n - k, k === 0);
      const key = `${Math.round(hack * 500)}`;
      if (key !== s.key) {
        s.key = key;
        s.chars.forEach((c, i) => {
          const g = glyphAt(i, s.real[i], s.plan, hack);
          if (g === s.shown[i]) return;
          s.shown[i] = g;
          c.textContent = g;
          c.classList.toggle('g', g !== s.real[i]);
        });
      }
      if (hack > 0 && hack < 1) {
        hacking = true;
        bots.forEach((b, j) => {
          if (j >= s.plan.bots) return void (b.style.visibility = 'hidden');
          const st = botAt(s.plan, hack, j);
          b.style.visibility = 'visible';
          b.textContent = SPRITES[j][st.frame];
          b.style.transform = `translate(${s.x[st.char].toFixed(1)}px, ${s.y[st.char].toFixed(1)}px)`;
        });
      }
    });
    if (!hacking) bots.forEach((b) => (b.style.visibility = 'hidden'));
  };

  const measure = () => {
    const pr = pin.getBoundingClientRect();
    const hr = holder.getBoundingClientRect();
    els.forEach((el, k) => {
      const s = steps[k];
      const er = el.getBoundingClientRect();
      // char offset inside the step is transform-proof; step offset inside .steps is its static position
      const ox = hr.left - pr.left + el.offsetLeft - er.left;
      const oy = hr.top - pr.top + el.offsetTop - er.top;
      const rowOf: number[] = [];
      let row = -1;
      let top = -1e9;
      s.x = [];
      s.y = [];
      s.chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (Math.abs(r.top - top) > r.height * 0.5) {
          row++;
          top = r.top;
        }
        rowOf.push(row);
        s.x.push(r.left + ox);
        s.y.push(r.top + oy);
      });
      s.plan = plan(rowOf);
      s.key = '';
    });
    update(last);
  };

  ScrollTrigger.addEventListener('refresh', measure);
  measure();
  return {
    update,
    revert() {
      ScrollTrigger.removeEventListener('refresh', measure);
      splits.forEach((s) => s.revert());
      bots.forEach((b) => (b.style.visibility = 'hidden'));
    },
  };
}
