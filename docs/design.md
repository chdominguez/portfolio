# Design spec

Reading: founder-engineer portfolio for investors, collaborators and recruiters in scientific computing, "technical plate" language (outlined figures on a hairline grid), GSAP + R3F + native CSS, single dark theme. Dials: variance 8, motion 8, density 3.

Story: three pinned chapters (Molecules, Code, Compute). One 48-atom object morphs between them (nanotube lattice -> call graph -> node grid). Text is real DOM. A fragment of the molecule hits the chapter-1 title and displaces its glyphs. The snake crosses the screen in chapter 2. The grid lights up in chapter 3. After that the canvas fades and the index sections (Work, Skills, Papers, Contact) are calm.

Tokens: bg #0E1113, text #E6E8E3, muted #9AA39F (7.3:1), hairline #2A3136, accent mint #7FD6B0. Atom colours (muted CPK) only inside the figure. Radius 4px. Fonts: Schibsted Grotesk (display and body), Geist Mono (metadata), self-hosted via Fontsource.

Engineering: one clock (gsap.ticker drives Lenis and the R3F render, `frameloop="never"`), pinned chapters use CSS `position: sticky`, ScrollTrigger only reads progress, a plain mutable `world` object bridges DOM and WebGL (no React state per frame), pure derive function with unit tests, reduced-motion and no-WebGL render a fully static page.
Research: docs/research/01-03.
