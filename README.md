# Portfolio

Scroll-driven 3D landing page: Vite + React + TypeScript, react-three-fiber, GSAP, Lenis.

- `yarn dev` / `yarn build` / `yarn test`
- Content lives in `src/content/cv.ts` (source: `public/cv_english.pdf`).
- One fixed canvas (`src/scene/Stage.tsx`); each actor reads DOM `data-anchor` rects via `src/scroll.ts`.
