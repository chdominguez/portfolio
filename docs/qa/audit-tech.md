# Technical QA audit

Scope: read-only. Dev server on :5173 (HEAD moved mid-audit from aacb7c5 to f387230: portrait removed, Code terminal now stacks all steps). All layout, axe, behaviour and state numbers below were re-run on f387230 unless marked "(pre-f387230)". Screenshots: `docs/qa/shots-tech/` (named `<width>-<section>-<progress>.png`). Browser: Playwright Chromium, SwiftShader (software GL), so GPU frame cost is NOT representative.

## Ranked findings

### H1. HIGH: Code chapter overflows horizontally and vertically on phones (regression in f387230)
- Repro: 390x844 or 360x740, scroll to `#code` (progress 0.1 to 0.95).
- Evidence: `documentElement.scrollWidth` = 441 vs clientWidth 390/360 (whole page can pan sideways). Overflowing nodes: `.lead`, `h2`, `.years`, `ol.steps` (right edge 441). `.pin` content height = 1650 px at 390x844 and 1610 px at 360x740 (viewport 844/740), so the terminal runs far below the fold; it is `position: sticky` so the bottom half is never reachable while pinned. Shots: `390-code-0.1.png`, `390-code-0.95.png`, `360-code-*.png`. At 0.95 the right of the terminal is clipped ("Full Stack and Platform Engine..."), and the step text is missing (steps 2-4 show only the prompt and header, bodies are blank gaps).
- Cause: `.term .step` uses `grid-template-columns: max-content max-content 1fr` (period / title / org in one row), and `.term .pin { max-width: none }`; max-content tracks widen the grid past 100% on narrow screens, and the SplitText chars keep it from wrapping.
- Fix: inside `@media (max-width:760px)` set `.term .step { grid-template-columns: 1fr }` (period, h3, org stacked) and `.term .pin { min-width: 0 }`, `.term .steps { min-width: 0; overflow-wrap: anywhere }`; hide `.is-past ul` is already there, also fold past steps' headers to one line. Add `overflow-x: clip` on `body` as a safety net. Ideally re-measure with `pinScroll <= innerHeight` at 360x740.
- Also 1280x720: code `.pin` scrollHeight 772 vs 720 when step 1 is active (all 4 steps reserved: last row hangs ~50 px under the fold; ok at 0.95 where past steps fold). Same for Molecules at 1280x720 (754), 1024x768 (806) and 360x740 (916) when the first step is active: reserved space of not-yet-visible steps overflows the sticky pin, harmless visually (they are opacity 0) but the bottom hairline `.bar` collides with it.

### H2. HIGH: 3D racks (Compute) draw over the step text at 768 and 390 wide
- Repro: 768x1024 and 390x844, `#compute` at 0.5. Shots `768-compute-0.5.png`, `390-compute-0.5.png` (pre-f387230, Compute code unchanged since).
- Evidence: the racks sit at x ~270-510 (768) and ~100-300 (390) over the lead paragraph, step title "CEO and CTO", "Temple Compute" and bullets. On 390 the h3 and org line are completely hidden behind the figure; the lede is partly covered. The canvas is above the DOM (`--z-stage: 5` > content).
- Fix: on `max-width:1024px` portrait, move the figure off the text column. Options: shift `Racks` group to the lower third (text pinned top, figure below at y > 55%) or add `world.target` per-breakpoint layouts; at minimum lower canvas opacity behind text (`mix-blend`/`opacity: .35`) on narrow screens.

### H3. HIGH: WebGL context loss leaves a broken static page
- Repro: while on `#molecules`, `canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`. Shots `ctx-lost-molecules.png`, `ctx-lost-code.png`.
- Evidence: handler sets `data-motion="off"` and kills the render hook (good, no crash, no console error), but: (a) ScrollTrigger and the SplitText on the Molecules title are not reverted, so the title chars stay displaced (`translate(-9.4px,-4.5px) rotate(-2.8deg)` still on the glyphs) in the "static" page; (b) the document collapses (pinned chapters go from ~4000 px to ~850 px), so the scroll position jumps by thousands of px with no re-anchoring; (c) there is no `webglcontextrestored` path, so the site stays degraded for the session; (d) `initTerminal`'s hacked glyphs are not reverted either (terminal text is whatever scramble state it was in).
- Fix: on loss call the cleanup returned by `initStory()` (`mm.revert()`), then `ScrollTrigger.refresh()` and `scrollTo` the nearest section id; optionally handle `webglcontextrestored` by re-enabling.

### H4. MEDIUM-HIGH: Accessibility, Code terminal text and axe `aria-prohibited-attr` (serious)
- axe 4.x, normal motion, 1440x900: 2 violations. (1) `aria-prohibited-attr` serious, 8 nodes: `<p aria-label="2023-2024">`, `.org` etc. SplitText puts `aria-label` on each split element and `aria-hidden` on the 965 char spans; `aria-label` is not allowed on `<p>`/generic, so the period and org lines in #code and the Molecules title are ignored or unspoken by some screen readers (the `li` and `h3` ones are fine). (2) `region` moderate: `.stage` canvas is outside any landmark.
- Fix: pass `aria: 'none'` to `SplitText.create` and keep the real text readable by rendering a visually-hidden duplicate (`.sr-only`) per step, or put the chars in `aria-hidden` wrapper with a sibling `.sr-only` text. For the canvas: `aria-hidden="true"` and `role="presentation"` on `.stage`.
- Lighthouse (separate run) accessibility 95, only this audit failing.
- Reduced motion (emulated `reduce`): `data-motion="off"`, no canvas, `.pin` static, 0 steps hidden, axe 0 violations. Pass. Caveat: only evaluated once at load (`main.tsx`); toggling the OS setting after load does nothing (no `matchMedia` change listener; gsap.matchMedia reverts the animation but `Stage` stays mounted).

### H5. MEDIUM: scroll-linked title shake never settles at some scroll positions
- Repro: 1440x900, `#molecules` progress 0.5; 1024x768 and 360x740 too. Shots `1440-molecules-0.5.png`, `1024-molecules-0.5.png`, `360-molecules-0.5.png`.
- Evidence: the word "Molecules" is still visibly scrambled (glyphs offset +-60 px / rotated) and sits at the same time as the dust cloud from the fragment, then recovers by 0.95. This is the intended post-impact "displace", but the amplitude depends on `hit` (progress), so stopping the scroll at 0.4-0.6 leaves a garbled `<h2>` (legibility, and the displaced glyphs overlap the lede at 1024 and 360). On mobile (`360-molecules-0.5.png`) the 3D molecule also overlays the step list (titles "BSc Chemistry" and "Researcher" partially covered).
- Fix: damp faster (`exp(-hit*7)`) or snap to 0 after `hit>0.5`; on `<760px` keep the molecule right/top-aligned away from `.steps`.

### H6. MEDIUM: mobile nav drops Work / Skills / Papers
- `@media (max-width:760px) { .nav span a:nth-child(n+2) { display:none } }` leaves only "About". The task's anchors `#work #skills #papers` are unreachable from the nav on phones (desktop anchors all land correctly, see Behaviour). Fix: keep all four in a condensed row or add a menu button.

### H7. MEDIUM: contact email breaks mid-word on mobile
- `word-break: break-all` on `.mail`: at 360 it renders `christian.99dominguez@gmai` / `l.com` (`360-contact.png`). Fix: `overflow-wrap: anywhere` and smaller clamp (`clamp(18px, 5.6vw, 64px)`) so it fits on one line (~28 chars at 360 needs ~17 px).

### H8. MEDIUM: contrast of the folded "past" steps is below AA
- `.chapter:not(.term) .step.is-past { opacity: .72 }` on `--muted`: effective #737a78 on #0e1113 = 4.32:1 (needs 4.5 for the 14-15 px body, org and bullet text). axe does not catch it (opacity transition and canvas). `--muted` itself is 7.32:1 (pass), `.mono` 13 px muted passes. Fix: opacity .85 or lighten colour instead of opacity (.85 gives about 5.7:1).
- `.term .step.is-past` is .8 (about 5.3:1, pass).

### H9. LOW-MEDIUM: skip link and focus
- `Skip to content` targets `#work`: it skips About and the three chapters, which are most of the page content; use `#about` (or `main` with `tabindex=-1`). `.skip` is `position:absolute`, so if it gains focus while the page is scrolled it is off-screen (use `position:fixed`).
- Tab order is logical: skip, brand, About, Work, Skills, Papers, hero CTAs (See the work / Read the CV / Email me), Work project links, Papers, mail, GitHub, Temple Compute, CV. Every focused element had a 2 px solid mint outline and was scrolled into view (22 tabs). Chapters contain no focusable items, so nothing is hidden under the fixed nav.
- Heading outline: h1 > h2 > h3 clean, no skipped levels. Landmarks: nav (labelled), main, header (in main: no banner role, fine), footer (in `.index` div, so `contentinfo` role is lost; wrap `Contact` in the main flow is fine but could use `<section>`), 7 labelled sections. The `.stage` canvas is not in a landmark (see H4).
- Scrambled `<h3>` text: at rest `textContent` of the non-active Code steps is glyph noise (`#?|* ~*<%/ =<*...`); fine for AT thanks to aria-label, but anything that reads DOM text without executing aria (crawlers, copy-paste, "reader mode") gets garbage in the Code chapter. The SEO content for #code relies on the hack not having run.
- Images: none now (portrait removed); no img alts to check. Canvas has no alt/role.

### H10. LOW: performance and loading
- Production build (`vite build`, f387230): `index.html` 1.9 kB; `index-*.js` 304.0 kB / 106.9 kB gz; `index-*.css` 11.5 kB / 3.3 kB gz; `Stage-*.js` (three + r3f) 917.8 kB / 243.9 kB gz; fonts: Schibsted latin 46.8 kB + latin-ext 20.9 kB, Geist Mono latin 23.1 kB (+4 other subsets, 6-15 kB each, loaded only on demand by unicode-range); `snake.glb` 216.7 kB (uncompressed in dist; Draco/meshopt not used).
- 3D chunk IS lazy (`React.lazy(() => import('./scene/Stage'))`, not in index.html modulepreload) but is fetched right after first paint on every visit incl. mobile; 9 requests, 627 KiB total transfer in Lighthouse (JS 341 KiB gz, fonts 69 KiB, glb 212 KiB). On reduced motion / no WebGL it is not fetched.
- Lighthouse 13, mobile emulation, headless SwiftShader, preview server: Performance 97, A11y 95, Best practices 96, SEO 100. FCP 0.8 s, LCP 0.8 s, CLS 0, TBT 180 ms, TTI 5.8 s (software GL inflates main-thread work: mainthread-work 7.9 s), Speed Index 1.4 s. Unused JS est. 152 KiB (three.js tree). Best-practices drop is a console error from Vercel Analytics (`/_vercel/insights/script.js` 404 off-Vercel); not a prod issue.
- Scroll frame cost (rAF deltas during a scripted 12 s full-page scroll, SwiftShader, 1440x900): 721 frames, avg 16.7 ms, p95 17.0, p99 18.5, max 31.6, 0 frames over 50 ms, 0 long tasks. Caveat: headless rAF is vsync-capped at 60 Hz and software GL; this shows the JS and layout side is cheap (no jank from GSAP, Lenis, SplitText), not GPU cost. Per-frame `getBoundingClientRect` is only on refresh, good. Real-device cost (low-end Android, 4k) is NOT verified.
- Suggestions: add `<link rel="modulepreload">`/`rel=prefetch` for Stage after `load` to shave TTI; Draco/meshopt-compress `snake.glb`; subset the `Geist Mono` latin-ext faces if unused; set long-cache headers for `/assets` and `/models` in `vercel.json` (currently only a rewrite).

### H11. LOW: console
- No `error`/`pageerror`/failed or 4xx requests on dev at any viewport. Warnings: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` (three 0.186, come from @react-three/fiber 8 internals, upgrade to R3F 9 when possible); `GPU stall due to ReadPixels` GL driver messages (SwiftShader only, ignore).

## 1. Layout matrix (f387230 unless noted)

| Viewport | h-overflow | Pinned content vs viewport | Text vs canvas | Notes |
|---|---|---|---|---|
| 1440x900 | none (1440/1440) | all pins fit (<= 776 of 900) | Code: bots (3 ASCII sprites) over terminal text by design; snake passes below terminal | OK. Molecules, Compute clean |
| 1280x720 | none | Molecules 754, Code 772 vs 720 reserved (invisible steps, see H1) | molecules figure right of text, clear | OK visually |
| 1024x768 | none | Molecules 806 vs 768 reserved; Code 752 ok | dust cloud and title shake overlap lede at 0.5 (H5) | acceptable |
| 768x1024 | none | fits (1024) | racks overlap lede and step bodies at Compute 0.5 (H2) | fix H2 |
| 390x844 | YES 441 (Code) | Code 1650 vs 844 (H1) | racks cover Compute step title; molecule overlays Molecules steps; snake covers Code text (pre-f387230) | worst |
| 360x740 | YES 441 (Code) | Code 1610, Molecules 916 reserved | same, plus h2 at 344/360 tight | worst |

Other sections (About, Work, Skills, Papers, Contact) were checked in all six viewports (`<w>-about|work|skills|papers|contact.png`): no clipping, no overflow, grids collapse to one column at <= 760. About after f387230 is a single left column (860 px max), fine. Gaps: at 1440 About leaves a large empty right side (design, not bug). Stacked Molecules/Compute steps: in all viewports at progress 0.95 the visible stack bottoms at <= 760 px of 900 (1440), 590 (1280x720 Code), 575 (1024x768 Code), 913 of 1024 (768 Molecules, close), 454 of 844 (390 Molecules), 495 of 740 (360). 768x1024 Molecules bottom is 89 px from the fold, tightest fit. Code/terminal on desktop fits at 0.95: bottom 610 of 720.

## 2. Accessibility checklist

| Check | Result |
|---|---|
| axe normal motion | 2 violations (H4) |
| axe reduced motion | 0 violations, static page, no canvas, doc height 7472 px at 1440 |
| Landmarks / headings | OK, footer is a `div` child so `contentinfo` role not exposed (minor) |
| Skip link | present, works, target poor and not fixed-position (H9) |
| Focus visibility | pass (2 px mint outline everywhere) |
| Image alts | no images present; the canvas has no role (aria-hidden recommended) |
| Muted contrast | `--muted` 7.32:1 pass; folded steps 4.32:1 fail (H8) |
| Code terminal text for SR | split into 965 aria-hidden chars with aria-label on `li`/`h3` (ok) and on `p` (prohibited, H4) |
| Reduced motion content | all steps visible, chapters `height:auto`, bots hidden, same text; pass. Not live-reactive (H4 caveat) |
| Keyboard operability of hero CTAs | pass |

Not verified: real screen-reader output (NVDA/VoiceOver), forced-colors, 200 percent zoom, touch targets (nav links ~20 px high, below the 24 px target size minimum, WCAG 2.2 AA 2.5.8; likely an axe `target-size` miss since the rule is off by default).

## 3. Behaviour

- Anchors (Lenis, 1440x900): clicking nav About / Work / Skills / Papers lands each section top at y=0 with the h2 at 96 (About) or 140 px (others), below the 64 px fixed nav. URL hash updated. Pass. Mobile: only About is visible in the nav (H6). `#top` brand link not tested for scroll-to-top; not verified.
- Resize mid-page: 1440x900 -> 900x700 at `#code` (y=7580): scroll preserved at 7580, no horizontal overflow (900), canvas resized to 900x700, pin height 700. Pass. After resize back to 1440x900 page was stable. Not tested: orientation change on a phone (390x844 -> 844x390).
- Reversibility: step classes, title transform state and terminal text were identical at 7 sampled scroll positions (Molecules 1000/2400, Code 800/2000/3000, Compute 900/1500) between going down and coming back up (`state true` all seven, DOM-based). Pixel comparison could not confirm because the 3D scene has idle motion (the scene differs 70 to 15000 px between two screenshots taken 0.7 s apart at the same position, noise floor above or near the diff measured on reverse: 955, 5490, 0, 1527, 705, 17106, 24942 px). So: DOM state reversible (verified); 3D visual reversibility not conclusively verified. Compute 8580 (code/compute junction): 0 px diff both ways.
- Context loss: see H3.
- Failed requests: none. Console: see H11.

## 4. SEO / meta (index.html at f387230)

| Item | Result |
|---|---|
| `<html lang>` | `en` pass |
| title | "Christian Domínguez \| CEO/CTO at Temple Compute, Software Engineer", 66 chars, slightly long (Google truncates near 60) |
| meta description | 142 chars, good |
| canonical | `https://christiandominguez.info/` pass; `og:url` is without trailing slash (mismatch, minor) |
| Open Graph | og:title, og:description, og:type, og:image (absolute URL), og:url present; missing og:site_name, og:image:width/height/alt, og:locale |
| Twitter | `twitter:card=summary_large_image` only; missing twitter:title/description/image (Twitter falls back to OG, fine) and no `twitter:image:alt` |
| JSON-LD | parses (Person: name, url, jobTitle, worksFor, alumniOf as plain strings, knowsAbout, address, sameAs). `alumniOf` should be `EducationalOrganization` objects; the portrait `image` was removed in f387230 (good, the file was deleted). No `email`. Valid JSON, not run through the Google Rich Results validator (not verified) |
| robots.txt | `Allow: /` + Sitemap; fine |
| sitemap.xml | one URL, no lastmod; valid XML |
| favicon | `/favicon.svg` (334 B); no `apple-touch-icon`, no `.ico` fallback, no PNG 192/512 |
| `public/og.png` | 1200x630 RGB PNG, 70 kB. It is a hero screenshot including the fake nav bar (About / Work / Skills / Papers) and buttons; text is readable at thumbnail size. Consider a dedicated card without UI chrome |
| theme-color | `#0e1113` ok |
| Rendering | `<div id="root"></div>` empty and no `<noscript>`, so JS-less crawlers and link unfurlers (except meta) see a blank page; Googlebot executes JS but the Code chapter text is scrambled in the DOM until scrolled (see H9). Add a `<noscript>` summary or prerender |
| vercel.json | catch-all rewrite to `/index.html` (static files still served first); every unknown URL returns 200 (soft 404). Not verified on the live host |

## 5. Could not verify / limits
- Real GPU performance, real mobile browsers (Safari iOS 100dvh/URL-bar behaviour with sticky pins), touch scrolling with Lenis, screen readers, Rich Results validator, live deployment headers.
- First sweep of 360/390 shots (before f387230) of `*-code-*.png` shows the old single-step terminal (bots eating); regenerated later sweep supersedes them for the same file names; `about` shots at 768 (pre) had the portrait.
- Lighthouse numbers are from software GL, treat TTI/TBT as pessimistic.
- Dev-server behaviour only (HMR active) for layout/behaviour; build output used for sizes and Lighthouse.
