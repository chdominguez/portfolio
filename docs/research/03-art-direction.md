# 03 Art direction: Christian Dominguez portfolio

Research depth: light (about 12 searches/fetches). Items marked [UNVERIFIED] come from model memory or secondary sources and must be checked before shipping.

## 1. Visual language survey

Evidence gathered:
- Linear rebuilt its theme generator on LCH (perceptually even lightness) and moved headings to Inter Display; 98 theme variables cut to 3 (base, accent, contrast). Secondary write-up, hex values approximate. https://linear.app/now/how-we-redesigned-the-linear-ui , https://sspai.com/post/104449
- Isomorphic Labs identity by Pentagram: Söhne (Klim, commercial, not free), moving 3D cubes. https://www.pentagram.com/work/isomorphic-labs
- Teenage Engineering: monospace-only across touchpoints (secondary source; pure-black canvas claim [UNVERIFIED]). https://blakecrosley.com/guides/design/teenage-engineering
- Swiss/International style: grid-led, typography as the main element, sans serif. Müller-Brockmann, Grid Systems in Graphic Design. https://ecampusontario.pressbooks.pub/graphicdesign/chapter/1-6-its/ , https://paris-la.com/archive2008-2020/the-swiss-grid
- Molecular rendering: Mol* "Illustrative" quick style emulates Goodsell (outline + occlusion + ignore-light); PDBe viewer offers flat, flat+outline, matte, glossy. https://molstar.org/viewer-docs/tips/illustrative-style/ , https://www.ebi.ac.uk/pdbe/node/16973 . Goodsell: very flat shading, strong simple colour, consistent 1,000,000x scale. https://www.asbmb.org/asbmb-today/people/080111/david-goodsell-the-master-of-mol-art , https://pdb101.rcsb.org/sci-art/goodsell-gallery . Illustrate tool (non-photorealistic): https://ccsb.scripps.edu/illustrate
- Not researched (no fetch): Stripe Press, Are.na, Nothing, Anthropic, Vercel. Do not cite them as evidence.

### Three directions
A. **Technical plate.** Flat-shaded, outlined molecules (Goodsell/Illustrate look) drawn as numbered figures on a hairline grid; captions like "Fig. 1". Swiss grid, tabular data. Risk: can feel academic/static.
B. **Notebook meets terminal.** Mono-forward, log-line rhythm, timestamps, run IDs, cursor-free. Risk: the most common "dev portfolio" trope.
C. **Matte instrument.** Teenage-Engineering-like hardware panel: matte surfaces, one lit indicator, labelled dials. Risk: skeuomorphic drift, hard on mobile.

### Recommendation: A, with a thin B layer
"Technical plate" fits molecules -> code -> clusters: the same flat+outline atom glyph is reused at three scales (molecule, call graph, node grid), like a figure series. It is ownable because the Goodsell/PDB look is rare in portfolios, scientifically honest, and cheap to render (SVG/canvas, no glow). Use mono only for metadata (run IDs, dates, units), which gives the terminal feel without the cliché. Applies to existing hero molecule scene in src/scene.

## 2. Palette (contrast computed with WCAG 2.x relative luminance)

Bg #0E1113 (repo currently #07080d, bluer; this is slightly greener-neutral, change is optional).

| Role | Hex | vs bg | vs surface #161A1D |
|---|---|---|---|
| Text | #E6E8E3 | 15.35 | 14.18 |
| Muted text (neutral 1) | #9AA39F | 7.32 | 6.76 |
| Dim (neutral 2) | #6B7571 | 3.98 FAIL for body | 3.67 |
| Hairline | #2A3136 | 1.44 (non-text, decorative) | n/a |
| Accent, phosphor mint | #7FD6B0 | 10.96 | 10.13 |
| Bg text on accent button | #0E1113 | 10.96 | n/a |

Decision: Dim is for decorative marks/disabled only, or lighten to about #7D8783 if text is needed (not computed). Accent is mint rather than violet/neon; it is one accent only. Note mint-green can read "terminal"; fall back to a warm-white-only accent if it feels cliché [taste judgement].

CPK-inspired atom colours, desaturated to sit on the bg (all AA 3:1+ vs bg; contrast computed):
- H #E6E8E3 (15.35), C #B4BDB8 (9.85), N #7FA6E8 (7.69), O #E8806F (6.99), S #E6C75A (11.44), P #E8A25C (8.8).
Classic CPK: H white, C grey/black, N blue, O red, S yellow, P orange. Sources: Wikipedia https://en.wikipedia.org/wiki/CPK_coloring (fetch failed; confirmed only via search snippets), H=FFFFFF, C=909090 per https://tug.ctan.org/graphics/asymptote/examples/cpkcolors.asy , P=FFA500 per https://www.umass.edu/microbio/rasmol/rascolor.htm . Jmol N 3050F8, O FF0D0D, S FFFF30 are from memory [UNVERIFIED]. Our values are deliberate muted variants, not canonical. Rule: atom colours appear only inside molecule figures, never as UI accents, so "one accent" holds.

## 3. Type system

Pick (all OFL-1.1 per Fontsource pages; install as @fontsource-variable/<name> [package names UNVERIFIED, install pages did not render]):
- Display + body: **Schibsted Grotesk** (variable, 400-900, OFL-1.1) https://fontsource.org/fonts/schibsted-grotesk . Alternative display: **Bricolage Grotesque** (variable wght/wdth/opsz, OFL-1.1) https://fontsource.org/fonts/bricolage-grotesque . Use Bricolage at wdth narrow for the hero only if more character is wanted; otherwise one family reduces payload.
- Mono: **Geist Mono** (variable, 100-900, OFL-1.1) https://fontsource.org/fonts/geist-mono
- Avoided: Inter, serifs, Space Grotesk (overused) [taste].

Fluid scale (clamp, 360px to 1440px viewports):
- Hero: clamp(2.5rem, 1.2rem + 5.6vw, 6rem); weight 600; tracking -0.03em; line-height 0.98; max 12ch per line, sentence case, solid colour (no gradient text).
- H2: clamp(1.75rem, 1.2rem + 2.2vw, 3rem); tracking -0.02em; lh 1.08.
- H3: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem); tracking -0.01em; lh 1.2.
- Body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); tracking 0; lh 1.6; measure 62ch.
- Mono meta: 0.8125rem; tracking +0.02em; lh 1.4; tabular-nums; uppercase not required.
Hero treatment: headline in text colour, one key word underlined by a 2px accent hairline (not coloured text); molecule figure carries a small "Fig. 1" mono caption.

### 3b. Layout and components
- Grid: 12 columns desktop, max 1200px, 24px gutters; 4 columns on mobile with 16px gutters. Long text spans cols 1-7; figures/meta in 9-12.
- Spacing: 4px base: 4, 8, 12, 16, 24, 32, 48, 72, 112. Section gap 112 desktop / 72 mobile.
- Radius: one value, 4px, for everything (buttons, figure frames, tags). No pills.
- Hairlines: 1px #2A3136 for row separators and figure frames; one 1px accent hairline max per viewport.
- CV in pinned scroll story: left pinned column holds role, org, dates (mono) and the figure that changes scale per role; right column scrolls 3-4 bullets as plain numbered lines (01, 02...) separated by hairlines, each bullet one sentence with one concrete metric or artefact. Highlight the active bullet by raising its opacity (muted -> text), no cards, no zigzag.
- Skills with evidence: a ruled table, not cards: columns skill | what I did with it | evidence link (repo, paper, Horus doc). Expand a row on click/focus to show 2 lines; each row must have at least one link or be omitted. Level bars/percentages banned (not evidence).
- Publications: dense bibliographic list, year in mono left, title large, venue and authors muted, DOI link; the featured one gets a wider row with a figure thumbnail. Projects: one lead project at full width (figure + 3 lines), the rest as an index list with hairlines; never three equal cards.

## 4. Copy
Tone: first person, plain, specific, no superlatives, no "passionate".
Hero headline options (no em-dashes):
1. "I started with molecules. Now I build the compute they run on."
2. "Chemist turned engineer, building workflow tools for HPC."
3. "From molecular dynamics to the clusters that run it."
Subtext (<=20 words): "Founder of Temple Compute (Horus). Previously at Barcelona Supercomputing Center, orchestrating molecular dynamics and bioinformatics workflows at scale." (18 words) Verify employment/claims with Christian before publishing.
CTAs (one label per intent): "See the work" (primary, scroll to projects), "Read the CV" (secondary), "Email me" (contact). Use the same label everywhere an intent repeats.

## Gaps / unverified
Stripe Press, Are.na, Nothing, Anthropic, Vercel Geist, PyMOL/ChimeraX default colour tables were not examined. Fontsource install names, Jmol hexes, and Linear hexes unverified. Accent hue untested against the 3D scene.
