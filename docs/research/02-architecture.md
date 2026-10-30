# 02 - Architecture for a scroll-driven 3D portfolio

Stack (package.json): react 18.3.1, @react-three/fiber 8, @react-three/drei 9, three ^0.186, gsap ^3.15 (all plugins free since 3.13), lenis ^1.3, vite 8.
Status tags: [V] verified in a fetched doc, [M] from memory / not confirmed in this session, [I] my inference.

## 0. Diagnosis of the current code
- `src/scroll.ts`: Lenis is already on gsap.ticker (correct, [V] matches Lenis README). But `anchor()` re-measures on every `scroll` event, and every actor (`HeroMolecule`, `Projectile`, `Snake`, `CodeGlyphs`, `Cluster`) calls `useFrame` and reads `window.scrollY` / anchors itself. No single source of truth, so each actor invents its own mapping and timing.
- `Stage.tsx`: `frameloop="demand"` + a `Pacer` that re-invalidates while anything is visible, and a native `scroll` listener. That is a second clock next to Lenis/gsap. Lenis scroll != native scroll events on the same tick, so the canvas can lag a frame behind ScrollTrigger.
- Actors are choreographed by position math, not by a timeline. Nothing is authored, scrubbable, reversible or inspectable, which is why it feels unimpactful: there are no beats, only continuous drift.

## 1. One clock
Rule: `gsap.ticker` is the only rAF. Lenis, ScrollTrigger and R3F render all run inside it, in that order.

Order per tick: (1) lenis.raf -> updates scroll, fires `scroll` -> ScrollTrigger.update -> scrubbed timelines write the store; (2) R3F `advance()` renders with the freshly written store. Register Lenis with a lower ticker priority than the render (GSAP ticker `add(fn, false, false)` order = insertion order, so add Lenis first) [I].

Official wiring [V - Lenis README]: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`; do not enable `autoRaf` (default false).
R3F: `<Canvas frameloop="never">` and call `advance(t)` from the ticker. `frameloop` accepts always|demand|never [V - https://r3f.docs.pmnd.rs/api/canvas]; `advance(timestamp)` on the store state [M - exists in v8 `state.advance`, docs page I fetched did not show it; verify with a 5-line spike].
Why `never` and not `demand`: demand needs invalidate plumbing from every source (the current `Pacer`); `never` + ticker gives deterministic order and lets you skip rendering when nothing changed (dirty flag from the store, see below).

```ts
// src/core/clock.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

type Renderer = (timeMs: number) => void;
let render: Renderer | null = null;
export const setRenderer = (fn: Renderer | null) => { render = fn; };

export function startClock() {
  const lenis = new Lenis({ lerp: 0.1 });            // smoothing lives here; use scrub:true, not scrub:1
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => { lenis.raf(t * 1000); render?.(t * 1000); };
  gsap.ticker.add(tick);                              // ONE callback => guaranteed order
  gsap.ticker.lagSmoothing(0);
  return { lenis, stop() { gsap.ticker.remove(tick); lenis.destroy(); } };
}
```
Do not use `scrub: 1` on top of Lenis: double smoothing makes the 3D feel mushy and late [I]. Use `scrub: true`.

### StrictMode / cleanup
React 18 StrictMode mounts effects twice in dev [V - https://gsap.com/resources/React/]. Pattern: create everything inside one effect, return cleanup that reverts the gsap.context, removes the ticker fn, destroys Lenis. Use `useGSAP` from `@gsap/react` (extra dep, not installed) or plain `useLayoutEffect` + `gsap.context` (no new dep, recommended).
```tsx
// src/core/ScrollProvider.tsx
useLayoutEffect(() => {
  const clock = startClock();
  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add(
      { full: '(min-width: 761px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 760px) and (prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)' },
      (c) => {
        const { full, mobile, reduce } = c.conditions!;
        if (reduce) { applyStaticPose(store); return; }       // no timeline, no Lenis scrubbing
        buildTimeline({ store, quality: full ? 'high' : 'low' });
      });
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => { mm.revert(); ctx.revert(); clock.stop(); };
}, []);
```
`gsap.matchMedia()` is the supported API; `ScrollTrigger.matchMedia` is deprecated [V - https://gsap.com/docs/v3/Plugins/ScrollTrigger/]. Create ScrollTriggers in page order or set `refreshPriority` [V]. `normalizeScroll` is opt-in/experimental and the docs say nothing about Lenis; do not enable it with Lenis [V partial]. On iOS consider `ScrollTrigger.config({ ignoreMobileResize: true })` [V].
Disable Lenis for reduced-motion (current code already does). Stop Lenis (`lenis.stop()`) while a modal is open; use `data-lenis-prevent` on nested scrollers [V].

## 2. Master timeline + mutable store
Principle: DOM scroll -> GSAP (scrub) -> plain mutable object -> `useFrame`/`advance` reads it. Zero React state per frame. Actors become dumb: each reads only `store`, never `window.scrollY`, never the DOM.

Authoring: one `buildTimeline()` creates one timeline per chapter, each with its own ScrollTrigger (`trigger: section, start:'top top', end:'+=150%', pin: true, scrub: true, anticipatePin: 1`) [V pin/scrub/anticipatePin]. Pin the section wrapper, animate its children, never the pinned element itself [V]. Chapter timelines tween properties of `store` (a plain object) and `camera` waypoints; `invalidateOnRefresh: true` so function-based values re-read layout after resize [V].
Why per-chapter not one giant timeline: pins add spacing, so a single global timeline's time-to-pixel map shifts on every refresh. Per-chapter triggers let ScrollTrigger own that math [I].

```ts
// src/store/world.ts  (plain object, no zustand needed; add a tiny subscribe only for rare UI events)
export interface Actor { x:number; y:number; z:number; rx:number; ry:number; rz:number; s:number; visible:boolean; }
export const world = {
  scroll: { y: 0, velocity: 0 },
  cam:   { x:0, y:0, z:10, lookX:0, lookY:0, lookZ:0, fov:50 },
  actors: { hero:{...}, snake:{...}, projectile:{...} } as Record<string, Actor>,
  impact: 0,           // 0..1 pulse, mirrored to CSS var
  dirty: true,         // set by timeline onUpdate; renderer skips when false and nothing is animating
  rects: new Map<string, {x:number;y:number;w:number;h:number}>(), // see section 3
};
```
```ts
// src/timeline/chapters/impact.ts
export function impact(section: HTMLElement, w = world) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: '+=150%', pin: true, scrub: true,
                     invalidateOnRefresh: true, onUpdate: () => { w.dirty = true; } },
  });
  tl.fromTo(w.actors.projectile, { x: () => rectToWorld('uab').x - 8 }, { x: () => rectToWorld('uab').x, duration: 1, ease: 'power2.in' })
    .addLabel('hit')
    .to(w, { impact: 1, duration: 0.15, ease: 'power4.out' }, 'hit')
    .to(w, { impact: 0, duration: 0.6, ease: 'elastic.out(1,.4)' }, 'hit+=0.15')
    .to(w.cam, { x: 1.5, duration: 0.3 }, 'hit');
  return tl;
}
```
Typing: `Actor`, `Chapter = (section: HTMLElement, w: World) => gsap.core.Timeline`; chapters registered in `chapters/index.ts` as an ordered array so creation order == page order.

Perf: scrubbed tweens write ~dozens of numbers per tick; trivial. Keep `useFrame` out entirely: one `<Rig/>` component applies `world` to refs inside the ticker `advance` callback (a single `useFrame` is fine too, since `advance` triggers useFrame subscribers; the rule is "all of them read `world` only").

Vitest: pure functions only (`rectToWorld`, `clamp`, chapter progress math, camera interpolation). Importing gsap in node is fine; ScrollTrigger needs a DOM, so keep it out of unit tests.

## 3. Making 3D truly interact with the DOM (recommendation: ONE approach)
Recommended: "DOM stays the text; canvas sits between two DOM layers; impact is expressed by per-glyph DOM transforms scrubbed on the same timeline; the 3D object's target position comes from cached DOM rects."
Rejected as primary: html-in-canvas (WICG) - Chrome origin trial only, API names still changing (texElementImage2D -> texElementSubImage2D, `content="drawable"` attribute) [V via search snippets of developer.chrome.com/blog/html-in-canvas-ot-changes; fetch of the post failed, verify]; no Safari/Firefox, so it can only be progressive enhancement. drei `<Html occlude>` - DOM transformed per frame, occlusion is raycast based, bad for large text; fine for labels only [M]. Troika/MSDF text in WebGL - best for shader distortion but you lose selection, SEO, a11y, native font rendering, and must maintain layout parity [I]. Per-glyph DOM is accessible, crisp, SEO-safe, cheap (a few dozen spans) and deterministic.

### 3a. Layers
```
z 0  .bg            page background, section art
z 1  <canvas.stage> fixed, pointer-events:none
z 2  .fg            headings/body that must stay legible; the glyphs that react live here
```
To make the object appear to pass behind some words and in front of others: render those words in `.bg` (below the canvas) and the rest in `.fg`. Two copies of the same heading (one aria-hidden) with clip-path split at the object's x is the cheap trick; or simply choose per-element: titles above, body below [I]. Keep the stacking context simple: `isolation:isolate` on the wrapper and a `position: fixed` canvas outside any transformed/pinned ancestor (pinning with transform ancestors breaks, [V] ScrollTrigger pin docs).

### 3b. Rect tracking (not per frame)
ScrollTrigger pins already compensate scroll; what changes rects is resize/font load/refresh. Store rects in *document space* and convert with scroll in the cheap path.
```ts
// src/dom/anchors.ts
const els = new Map<string, HTMLElement>();
export const register = (id:string, el:HTMLElement|null) => el ? els.set(id, el) : els.delete(id);
export function measureAll() {                     // call from ScrollTrigger 'refresh' + ResizeObserver
  const sy = window.scrollY;
  for (const [id, el] of els) { const r = el.getBoundingClientRect();
    world.rects.set(id, { x: r.left, y: r.top + sy, w: r.width, h: r.height }); } // document space
}
ScrollTrigger.addEventListener('refresh', measureAll);
// per frame: viewportY = rect.y - lenis.scroll   (one subtraction, no layout)
```
Caveat: rects inside pinned sections: measure *at the pinned state* by measuring on `refresh` (ScrollTrigger refreshes with pins applied), or register the element relative to the pin and use viewport coords (pinned content does not move) [I - test].
Make a `ResizeObserver` on the anchored elements call `ScrollTrigger.refresh()` (debounced) so layout shifts re-sync [M].

### 3c. World mapping
Use a perspective camera whose z makes 1 world unit = 1 CSS px at z=0, then mapping is trivial and resolution-independent:
```ts
// camera.z = (innerHeight/2) / tan(fov/2 * PI/180);  world.x = px - innerWidth/2; world.y = innerHeight/2 - py
export const toWorld = (px:number, py:number, w:number, h:number) => ({ x: px - w/2, y: h/2 - py });
```
Actors then use pixel-ish units; shrink via actor scale. Existing `toWorld(..., viewport)` does the same at z=0 via R3F viewport; keep it but call it from the timeline `() =>` function values (evaluated on refresh), not from `useFrame`.

### 3d. Impact on text
- Split once with GSAP `SplitText` (free in 3.13+ [V - https://gsap.com/blog/3-13/]; `autoSplit`/`onSplit` re-split on resize/font load [V via secondary source]; verify mask option in docs). Mark with `aria-label` on the parent, spans `aria-hidden` (SplitText does that by default [M]).
- The impact tween drives displacement per char with function-based values using a precomputed distance from the hit point (distance computed at refresh from cached rects):
```ts
const chars = split.chars as HTMLElement[];
tl.to(chars, { x: (i,el)=> push(i)*40, y: (i)=> (Math.random()-.5)*30, rotate:(i)=>(i%2?1:-1)*20,
               duration:.25, ease:'power3.out', stagger:{ amount:.12, from: hitIndex } }, 'hit')
  .to(chars, { x:0, y:0, rotate:0, duration:.9, ease:'elastic.out(1,.35)' }, 'hit+=.25');
```
Because it is a scrubbed timeline, it reverses when scrolling up, which a one-shot onEnter animation cannot do.
- CSS variable bridge for cheap global effects (shake, chromatic text-shadow, blur): `gsap.quickSetter(document.documentElement,'--impact')` called from the timeline `onUpdate` (not per frame): `.fg{ transform: translate3d(calc(var(--impact)*-4px),0,0); text-shadow: calc(var(--impact)*3px) 0 #f0f }` [I]. CSS vars on the root trigger style recalc of dependents; scope the variable to the one element (`el.style.setProperty`) to keep recalc small [M].

## 4. Rendering molecules cheaply and well
- Atoms: one `InstancedMesh` of icospheres (or true ray-cast impostor quads: fragment shader computes sphere normal + `gl_FragDepth`). For a handful of molecules (<500 atoms) plain instanced icosahedron (detail 2-3, ~320 tris) is simpler and equally cheap; impostors only pay off past thousands of atoms [I]. Bonds: second `InstancedMesh` of low-poly cylinders (6-8 sides) oriented from atom pairs; compute matrices once, animate via the group transform.
- Material: `MeshStandardMaterial` (or `MeshMatcapMaterial` for ultra-cheap; one tiny generated matcap texture via canvas, no download) is the default. Avoid `MeshPhysicalMaterial.transmission`: it adds a full scene re-render pass per transmissive material type and more with `backside` [V - https://drei.docs.pmnd.rs/shaders/mesh-transmission-material, discourse thread https://discourse.threejs.org/t/transmission-effect-pbr-material-performance/59274]. Fake glass with fresnel + `onBeforeCompile` emissive rim.
- Lighting without HDR downloads: drei `<Environment>` presets fetch HDRIs from a CDN and docs say not for production [V - https://drei.docs.pmnd.rs/staging/environment]. Use `<Environment resolution={64}>` with `<Lightformer>` children (renders once to a cube camera; `frames={1}` default) [V for children/resolution; M for Lightformer usage]. Zero network, ~1 cube render.
- Tone mapping: `gl.toneMapping = ACESFilmicToneMapping` (R3F default for Canvas is ACES + sRGB already in v8 non-`flat`) [M]. Keep `flat` off for physically plausible lights.
- Postprocessing (`@react-three/postprocessing`, not currently installed): each pass is a full-screen draw; merged effects share one pass (EffectPass) [V]. Set `multisampling={0}` and use SMAA or no AA, because MSAA on composer targets "kills performance" [V - react-postprocessing README / pmndrs issue 82]. Budget: Bloom (mipmap blur, luminanceThreshold high, `mipmapBlur`) + Vignette only. Skip DOF and anything that re-renders the scene (SSAO, selective bloom masks) on integrated GPUs [V general; no iGPU benchmark found]. Gate on the PerformanceMonitor tier. Cheaper alternative: fake bloom with additive sprites/halo meshes, no composer.
- Because the canvas is transparent (`alpha:true`) over DOM, composer + alpha is fiddly (premultiplied alpha artifacts) [M]; another reason to prefer no composer, and fake glow.
- Snake: `TubeGeometry(CatmullRomCurve3(points), 200, r, 8)`; for slither do not rebuild geometry per frame. Build once along a straight/sampled curve, then in the vertex shader displace by `sin(uv.x*freq - uTime*speed) * amp` along a normal axis, and for scroll-driven travel offset a `uHead` uniform with `discard`/alpha cut by `uv.x` so it draws on/off as scroll progress (uniform written from `world`). Rebuilding TubeGeometry per frame is the main thing that kills this effect [I]. Scale uniform for DPR-independent line width.

## 5. Performance and robustness
- Pause offscreen: with `frameloop="never"` the render callback simply early-returns unless `world.dirty || anyAnimating` and the canvas is visible; also `document.hidden` (gsap.ticker already sleeps in hidden tabs; `visibilitychange` lagSmoothing caveat [M]). Use IntersectionObserver per chapter to toggle `actor.visible` (cuts draw calls).
- Adaptive DPR: drei `<PerformanceMonitor onChange={({factor}) => setDpr(1 + factor*0.75)} flipflops={3} onFallback={() => setTier('low')}>` [V behaviour - https://r3f.docs.pmnd.rs/advanced/scaling-performance]. Start `dpr={[1, 1.5]}`. With `never` loop, feed it by calling `advance` through R3F so its internal frame sampling still runs [M, check].
- Context loss: listen on `gl.domElement` for `webglcontextlost` (`preventDefault()`) and `webglcontextrestored`; on restore re-`invalidate` and let R3F re-upload; R3F docs only mention an error boundary and the `fallback` prop for no-WebGL [V partial]. Wrap Canvas in an ErrorBoundary showing the poster.
- Fallback poster: static hero image (webp, <60 KB) rendered in DOM first (LCP), canvas mounts after idle. Show poster if: no WebGL2 (`Canvas fallback`), `prefers-reduced-motion`, `navigator.connection.saveData`, `deviceMemory<=2`, or PerformanceMonitor fallback after 3 flipflops [M for signals].
- Loader: nothing external to download if procedural; drive a progress from `useProgress` (drei) only if you add fonts/GLBs. Block `lenis.stop()` until first frame rendered, then reveal canvas with a 300ms fade.
- Bundle: `React.lazy(() => import('./scene/Stage'))` so three/r3f/drei are a separate chunk after first paint; import drei by name (`import { PerformanceMonitor } from '@react-three/drei'` tree-shakes in Vite/Rollup, but drei 9 pulls many deps; check with `rollup-plugin-visualizer`) [M]. `manualChunks: { three: ['three'], gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText'] }`.
- Tests: Playwright smoke - load at 3 viewports, scroll to each chapter label via `lenis`-aware `page.mouse.wheel`, assert canvas non-blank via `canvas.toDataURL` hash differs between scroll positions, and `page.emulateMedia({reducedMotion:'reduce'})` shows poster. Use `--use-gl=swiftshader` / `--enable-unsafe-swiftshader` in CI [M]. Vitest for store math (`toWorld`, chapter progress, rect-to-world, easing). Snapshots of screenshots only with fixed `world` state via a `?t=0.42` debug param that sets the timelines' progress (`tl.progress(0.42)`), so visuals are deterministic.

## 6. Recommended tree
```
src/
  main.tsx  App.tsx
  core/        clock.ts  ScrollProvider.tsx  media.ts (matchMedia conditions)  quality.ts (tier)
  store/       world.ts  types.ts
  dom/         anchors.ts  split.ts (SplitText + impact helpers)  Poster.tsx
  timeline/    index.ts (buildTimeline)  camera.ts  chapters/{hero,impact,snake,cluster}.ts
  scene/       Stage.tsx  Rig.tsx  actors/{Molecule,Snake,Projectile}.tsx  materials/{glassish,slither}.ts  lighting.tsx
  sections/    (existing)
  content/     (existing)
  __tests__/   world.test.ts  toWorld.test.ts
e2e/           smoke.spec.ts
```
Vitest is not installed; add `vitest` (devDependency) only when store math tests are written.

## 7. Migration order (smallest steps)
1. Add `world` store + `clock.ts` single ticker; switch Canvas to `frameloop="never"`; delete `Pacer`, native scroll listener.
2. Convert `HeroMolecule` to read `world.actors.hero`; write hero chapter timeline; delete `window.scrollY` reads.
3. Move each actor one at a time; delete `anchor()` p-math in favor of cached rects.
4. Add impact chapter with SplitText + `--impact`.
5. Quality tiers, poster, context-loss, lazy chunk, tests.

## Pitfalls (sources)
- Lenis + ScrollTrigger desync if Lenis runs its own rAF: use ticker only [V Lenis README].
- StrictMode double-effects duplicate `from()` tweens: revert context in cleanup [V gsap React guide].
- Animating the pinned element or a transformed ancestor breaks pin [V ScrollTrigger docs].
- ScrollTrigger positions are static; call `refresh()` after fonts/images/ResizeObserver changes [V].
- `scrub:number` + Lenis double smoothing [I].
- Transmission material = extra scene pass [V]. Postprocessing MSAA cost [V].
- `Environment preset` hits CDN, not for production [V].
- html-in-canvas is unstable/OT-only [V partial].
- Fetch of Chrome html-in-canvas post, Codrops Trionn article (403) failed; their claims are search-snippet only.

## Sources
- https://github.com/darkroomengineering/lenis
- https://gsap.com/resources/React/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()/
- https://gsap.com/blog/3-13/
- https://r3f.docs.pmnd.rs/api/canvas
- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://drei.docs.pmnd.rs/staging/environment
- https://drei.docs.pmnd.rs/shaders/mesh-transmission-material
- https://discourse.threejs.org/t/transmission-effect-pbr-material-performance/59274
- https://github.com/pmndrs/react-postprocessing , https://github.com/pmndrs/postprocessing/issues/82
- https://developer.chrome.com/blog/html-in-canvas-ot-changes
- https://tympanus.net/codrops/?p=117096 (Trionn architecture; not fetched, 403)
