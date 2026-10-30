# Portfolio

Scroll-driven 3D portfolio. Vite, React, TypeScript, react-three-fiber, GSAP (ScrollTrigger, SplitText), Lenis.

- `yarn dev`, `yarn build`, `yarn test` (prettier, vitest, typecheck, build)
- Content: `src/content/story.ts` (the three chapters) and `src/content/cv.ts` (profile, skills, projects, papers). Source: `public/cv_english.pdf`.
- Engine: `src/engine` (one gsap ticker drives Lenis and the render, `world` is the DOM-to-WebGL bridge, `layouts` holds the morph targets).
- Scene: `src/scene`. UI: `src/ui`. Design spec: `docs/design.md`, research: `docs/research/`.
- Reduced motion or no WebGL renders the same content as a static page.
