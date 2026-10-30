# QA report

Branch `qa`, base commit `bbabddc`. Run with `docs/qa/qa.mjs` (Playwright, headless Chromium with SwiftShader WebGL) against `yarn dev` and against `yarn build` + `yarn preview`. Both runs gave the same results except where noted. `yarn test` (prettier, typecheck, build) passes. No source files were changed.

Viewports: 1440x900, 1024x768, 390x844. The script regenerates screenshots into `docs/qa/shots` (not committed).

## Summary

| # | Severity | Issue |
|---|----------|-------|
| 1 | Medium | Mobile: hero molecule sits on top of the lead text and CTA buttons |
| 2 | Medium | Three project links return 404 (two GitHub repos, one App Store page) |
| 3 | Low | Code glyphs draw over card text at 1024 and 1440 |
| 4 | Low | Snake head covers the "Python backend" chip text while it burrows |
| 5 | Low | Production build logs a 404 for `/_vercel/insights/script.js` off Vercel |
| 6 | Low | `THREE.Clock` deprecation warning on every load |
| 7 | Low | Mobile nav drops Timeline, Projects, Stack |
| 8 | Low | Tablet: hero molecule touches the lead text |
| 9 | Low | Reduced motion is read once at load and never updates |
| 10 | Low | PCCP paper year is 2021 (Crossref: 2022) |
| 11 | Info | Small content gaps vs the CV |
| 12 | Info | `isNarrow` (<760) and the CSS breakpoint (<=760) disagree at exactly 760px |

## Passed

- **Horizontal overflow:** none at any viewport, at the top or bottom of the page, with the canvas on or off.
- **Impact classes:** `.hit` toggles only on `uab` and `ub`, the only anchors with a projectile. It turns on near p=0.44-0.48, off near p=0.66-0.72, and is cleared when scrolling back up (`clearedOnReverse` true for every anchor). Same at all three viewports.
- **Snake / python anchor:** the snake enters from the right, crosses the chip and ends at its left quarter at all viewports. No errors.
- **Cluster at temple:** shown at 1440 and 1024, hidden below 760 by design. It lights up node by node as the card scrolls past and fits in the right gap without clipping.
- **Reduced motion (`reducedMotion: 'reduce'`):** 0 canvases, 0 hidden `.reveal` elements, all 7 cards at opacity 1, no overflow, no console output.
- **Tab order:** nav, hero buttons, publications, linked projects, contact links, in DOM order. Every focus stop has a visible outline. Projects without a link (TipTapChat, MedSum) are correctly not focusable.
- **Links:** `/cv_english.pdf` 200 `application/pdf`, `github.com/chdominguez` 200, `github.com/temple-compute` 200, bioRxiv DOI 200, nav anchors all resolve.
- **Build and preview:** `yarn build` and `yarn preview` serve and behave the same as dev. The Stage chunk is 986 kB (272 kB gzip), loaded lazily.
- **Content:** every period, org, bullet and skill checked against `pdftotext -layout public/cv_english.pdf`. All skill tags are in the CV and the whole CV skill list is on the site. See 10 and 11 for exceptions.

## Findings

### 1. Medium: mobile hero molecule covers the text and buttons

- **Steps:** open at 390x844 and stay at the top.
- **Evidence:** `docs/qa/shots/mobile-sec-top.png`. The benzene ring is centred at x=50% (`HeroMolecule`, `isNarrow()` branch) and crosses "From molecules to code...", "See the journey" and "Download CV". The canvas is `z-index: 5` over the content, so the text is partly hidden.
- **Fix:** on narrow screens place the molecule above the title or in the empty area below the buttons, for example `window.innerHeight * 0.82` instead of `* 0.5` in `src/scene/Stage.tsx`.

### 2. Medium: three project links return 404

- **Steps:** click Atomic Molecular Visualizer, MC Simulations or Charted! in Projects.
- **Evidence:** `github.com/chdominguez/atomic-molecular-visualizer` 404, `github.com/chdominguez/mc-simulations` 404, `apps.apple.com/app/charted-regression-charts` 404 (no app id). The same URLs are printed in `public/cv_english.pdf`, so the CV has the same problem. The public repos that exist are `chdominguez/Atomic` and `chdominguez/monte_carlo_liquid`.
- **Fix:** in `src/content/cv.ts` point to `https://github.com/chdominguez/Atomic`, `https://github.com/chdominguez/monte_carlo_liquid` and the real App Store URL with its `id...`. Update the CV PDF too.
- **Note:** `doi.org/10.1039/d2cp04051d` returns 403 to the script (publisher bot block). Crossref resolves it, so this is not a bug.

### 3. Low: code glyphs overlap card text

- **Steps:** scroll to the Temple Compute card at 1024x768, or any card at 1440.
- **Evidence:** `tablet-anchor-temple-impact.png` shows "def", "SELECT" and "tsx" over the first bullets. `desktop-anchor-temple-impact.png` shows "SELECT/def" on the card's left edge. Glyphs sit at 84-98% of half the viewport width, which lands inside the card column on narrower screens.
- **Fix:** keep glyphs outside the content column, or skip glyphs whose x falls inside `main`. At minimum lower their opacity under 1100px.

### 4. Low: snake head covers chip text

- **Evidence:** `desktop-anchor-python-impact.png`, `mobile-anchor-python-impact.png`. The head sits on "SQLAlchemy" and "Pydantic" mid-crawl. It clears once the snake burrows, so this is part of the effect.
- **Fix:** only if legibility matters, aim the path just above the chip text line.

### 5. Low: Vercel Analytics 404 off Vercel

- **Steps:** `yarn build && yarn preview`, open the console.
- **Evidence:** `GET /_vercel/insights/script.js 404` and a failed-resource error on every load. Preview only; dev is clean. Expected on a non-Vercel host.
- **Fix:** none needed on Vercel. Optionally render `<Analytics />` only in production.

### 6. Low: `THREE.Clock` deprecation warning

- **Evidence:** `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` on every load. `@react-three/fiber@8.18.0` still creates a `THREE.Clock` and `three` is 0.186.
- **Fix:** harmless today. Upgrade `@react-three/fiber` when a release supports `THREE.Timer`.

### 7. Low: mobile nav shows only Contact

- **Evidence:** `.nav span a:not(:last-child) { display: none }` at <=760px. Timeline, Projects and Stack are not reachable from the nav on phones.
- **Fix:** keep all links with smaller gaps, or use a compact menu.

### 8. Low: hero molecule touches the lead text at 1024

- **Evidence:** `tablet-sec-top.png`. The ring starts about 35px from "engineer,". At 1440 it only lightly touches the "z" of Domínguez.
- **Fix:** move the x factor from 0.72 to about 0.78 below 1100px.

### 9. Low: reduced motion is read once

- **Evidence:** `src/scroll.ts` computes `reducedMotion` at module load, so toggling the OS setting while the page is open has no effect until reload.
- **Fix:** listen to the `matchMedia` change event, or accept a reload.

### 10. Low: PCCP publication year

- **Evidence:** the site and the CV say 2021. Crossref lists 10.1039/d2cp04051d as 2022.
- **Fix:** confirm and correct in `src/content/cv.ts` and the CV.

### 11. Info: content gaps vs the CV

- BSC "Visitor, Jan 2026 - Present" is not its own entry. It is a sentence in the Research Engineer II card.
- TipTapChat tools omit React and shadcn/ui.
- CV header items (site `christiandominguez.info`, social handle) and the `horus-runtime` link on the Temple Compute entry are not shown.
- Nostrum "Jan 2026 - Oct 2026" is copied from the CV, which is dated September 2026, so the end date was in the future when the CV was written.
- Bullets are shortened but keep the meaning. No dates or figures were changed.

### 12. Info: breakpoint mismatch

- `isNarrow()` is `innerWidth < 760`. CSS uses `max-width: 760px`. At exactly 760px the layout is mobile but the scene runs desktop actors (Cluster visible).
- **Fix:** use `<= 760` in `isNarrow`.

## Notes on the script

- `PW_DIR` must point at a folder whose `node_modules` has `playwright` (the repo does not depend on it). `BASE` is the dev or preview URL. Usage is in the script header.
- A full run takes about 8 minutes because each anchor is scrubbed in 80px steps at three viewports.
- Headless runs print a GPU `ReadPixels` stall warning. It is a SwiftShader artefact and not reported above.
