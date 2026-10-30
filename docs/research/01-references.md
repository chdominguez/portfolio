# 01 - Reference research: scroll-driven 3D storytelling and developer portfolios (2025-26)

Method and limits (read first): research was done with text-only fetch tools. JS/WebGL sites return only DOM text, so
"first 5 seconds" visuals are NOT observed for most sites; they are marked `[inferred]` or `[unverified]`.
codrops (tympanus.net) returned HTTP 403 to every fetch, so Codrops claims come from search-result excerpts only.
Awwwards pages (scores, credits, palettes, case studies) were fetched successfully and are the most solid evidence.
Not reached at all: Active Theory, Locomotive, Resn, Dogstudio, Darkroom, Cuberto, Ponpon Mania, Valentin Gassend,
Paco Coursey, Jesper Landberg, Sleep Well, Arc Institute, Recursion, Ginkgo, Anthropic/OpenAI research pages.
Recommend a follow-up with a real browser (Playwright is already in the repo) for first-5-seconds and scroll captures.

## 1. Sites actually opened/read

| Site | URL | Evidence | Structure / pacing | Type + color | 3D/DOM | Steal |
|---|---|---|---|---|---|---|
| Messenger (abeto) | https://www.awwwards.com/sites/messenger ; case study https://www.awwwards.com/messenger.html | Awwwards SOTD 10 Nov 2025 (7.92), Dev Award 8.21 (Animations 9.0, WPO 8.8); 2025 Developer Site of the Year per https://www.awwwards.com/annual-awards/winners (page does not state year explicitly) | 15-min game, 7 areas, no tutorial, story added last | Palette #81BFBC / #C9D5C3 (pastel teal/sage) | UI itself rendered in WebGL; WASM glyphs for sharp text | Hand-drawn outlines, single 16x16 colour atlas to retheme whole world, aggressive mobile memory discipline |
| Igloo Inc (abeto + Bureaux) | https://www.awwwards.com/sites/igloo-inc ; case study https://www.awwwards.com/igloo-inc-case-study.html | SOTD 23 Jul 2024 (7.92), Dev 7.66 (Animations 9.6, but SEO/a11y 6.6) | Only 3 sections; each project is an ice-encased object; intro animation; links section is a particle sim; transitions = chromatic aberration + displacement + frost | Palette #b6bac5 / #383e4e (cold grey-blue) | Glitch/scramble text done in WebGL shaders instead of CSS; custom VDB volume exporter smaller than a typical web image | Few sections, each with one strong object; previs/grey-mock journeys before building; iterate in browser |
| Lando Norris (OFF+BRAND) | https://www.awwwards.com/sites/lando-norris | Site of the Year 2025 (SOTD 17 Nov 2025, 8.18; Users 8.86); tags WebGL, GSAP, Webflow | "On Track" / "Off Track" split homepage (per https://www.designrush.com/best-designs/websites/lando-norris-website-design) | #D2FF00 lime on #111112 near-black | Cursor-reactive blob overlays on hero image (DesignRush); WebGL dev notes https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/ (excerpt only) | One acid accent colour on near-black; two-sided narrative split; cursor as material |
| Immersive Garden v. new | https://www.awwwards.com/case-study-immersive-gardens-new-website.html | SOTD 7 Jan 2025 (search result, https://www.awwwards.com/sites/immersive-garden-website); case study fetched | Minimal, atmospheric; bas-relief 3D; 3D Roman numerals as menu anchors; hidden "Backstage" section with technical breakdowns | Not captured | three.js + Nuxt/Vue, GSAP, Lenis, Strapi; KTX compression, channel packing, gltf-transform export pipeline | "More time removing than adding"; show process as content; asset pipeline discipline |
| Lusion v3 | https://www.awwwards.com/sites/lusion-v3 ; live https://lusion.co | SOTD 2 Oct 2023 (8.25), Dev 8.41 (Animations 10.0, WPO 9.0) | Live page text: hero statement, reel (Play/Mute), featured work grid of 10, big statement bands, "continue to scroll" cues | #1a2ffb electric blue / #f0f1fa off-white (Awwwards listing; swatch links inconsistent) | Reactive cursor + scroll animation tagged by Awwwards; 3D/DOM split `[unverified]` | Single saturated blue + off-white; big declarative hero line; labs/R&D link as credibility |
| Bruno Simon | https://bruno-simon.com | Fetched text | Driveable world, map/achievements/whispers, quality + renderer (WebGPU) options | Fonts Amatic SC + Nunito | Three.js (WebGL+WebGPU via TSL), Rapier physics, Howler; front-end MIT on GitHub | Playfulness and secrets as retention; quality toggle; open source builds trust. Loader/first seconds `[unverified]` |
| Brittany Chiang | https://brittanychiang.com | Fetched text | Single page: About, Experience (6 roles), Projects, Writing | Inter only; Next.js + Tailwind (per footer) | None | Restraint, clear hierarchy, résumé-grade scannability; a "click to time travel" TARDIS easter egg. Colors `[unverified]` |
| Rauno Freiberg | https://rauno.me | Fetched text | Name + one-line bio, nav, 7-line "Make it..." manifesto | Not captured | None | Tiny, opinionated, craft-signalling copy. Visuals `[unverified]` |
| Isomorphic Labs | https://www.pentagram.com/work/isomorphic-labs/story | Pentagram case study via search summary only; live site blocked | Brand idea "Seek to Find", understated | Klim Söhne typeface; extended palette/gradients | Bespoke real-time 3D tool (with Marcin Ignac / Variable) for 4K stills + video; site built by On Associates | Scientific humility in tone; one custom 3D tool feeds both stills and site. Live scroll `[unverified]` |
| Stefan Vitasovic '25 | https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/ | Search excerpt only (403) | Typographic animation, WebGL video grid, page transitions | Minimal | Lethargy + custom controller on Virtual Scroll; videos as WebGL textures to keep mesh count low | Texture-driven media grid |
| Roman Jean-Elie '25 | https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/ | Search excerpt only | WebGL planes synced to DOM bounds | - | R3F, GSAP MorphSVG, scroll-velocity distortion on project titles | DOM-synced planes + velocity distortion |
| Scroll-driven 3D world (Apr 2026) | https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/ | Search excerpt only | Scroll mode switches per scene via GSAP Observer | - | Three.js + GSAP | Per-scene scroll modes (pinned vs free) |
| Tomasz Szmajda (Jun 2026) | https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/ | Search excerpt only | Brush-stroke colour reveals, GSAP Observer | - | Custom shader, no 3D models | Shader-only 3D: ideal for a molecule/code metaphor with no heavy assets |
| Martin Laxenaire '25 | https://tympanus.net/codrops/2025/10/06/self-doubt-and-the-quest-for-fun-how-i-ended-up-turning-my-portfolio-into-a-game/ | Search excerpt only | Scroll scenes become a horizontal carousel | - | - | Mixed scroll axes |
| Studio375 "Ten Years Away" | https://tympanus.net/codrops/2026/07/08/ten-years-away-designing-an-interactive-comic-for-studio375s-tenth-anniversary/ | Search excerpt only | Interactive comic | - | Lenis, GSAP, R3F, GLSL background reacting to scroll speed | Scroll-speed-reactive background |
| Active Theory v5 | https://www.commarts.com/webpicks/active-theory-1 | Search excerpt only | Switchable real-time environments, large screen as centre | - | Internal JS framework, custom CMS | Environment switching as navigation |

## 2. Technique articles
- Infinite fullscreen sections with Lenis + GSAP ScrollTrigger (Lenis events forwarded to ScrollTrigger; snap per section): https://tympanus.net/codrops/?p=108074 (excerpt).
- CSS scroll-driven animations: Chrome 115+, Safari 26+ full support (Sept 2025), Firefox behind flag (secondhand skill guide, https://skills.cat/skills/doodledood/claude-code-plugins/scrollytelling) `[secondhand]`.
- Workflow advice: wire Lenis into GSAP ticker; add scrubbed pinned scenes last, after static layout works (https://open-design.ai/plugins/cinematic-scroll-storytelling/) `[secondhand]`.
- Awwwards Developer-award criteria used as a checklist: Semantics/SEO, Animations/Transitions, Accessibility, WPO, Responsive, Markup (visible on every site page above). Note the pattern: winners score 9-10 on animation but 6.6-7.6 on SEO/a11y; that is a gap we can beat.

## 3. Patterns that create impact (ranked)
1. Restraint plus one hero object per chapter. Igloo uses 3 sections only, each an unmistakable object (ice-encased project) (https://www.awwwards.com/igloo-inc-case-study.html). Immersive Garden: "more time removing than adding" (case study link above). For us: one molecule/lattice per chapter, not scenes full of stuff.
2. Transformation as the transition. Igloo's chromatic aberration + displacement + frost transitions make scene change itself the spectacle. Map to our story: atoms -> bonds -> graph -> DAG/code; the morph IS the chapter break.
3. Pinned, scrubbed chapters with mode switching per scene (GSAP Observer / ScrollTrigger pin), added after static layout works (Codrops Apr 2026 excerpt; open-design guide).
4. Type as hero with a constrained system: single family (Inter at Chiang, Söhne at Isomorphic, Amatic+Nunito at Simon) and large declarative headline (Lusion hero). One typeface plus mono for code is enough.
5. One saturated accent on a restrained base: Lando #D2FF00 on #111112; Lusion #1a2ffb on #f0f1fa; Igloo cool greys; Messenger two pastels. All use 2-colour Awwwards palettes.
6. DOM-synced WebGL: planes tracked to DOM bounds, scroll-velocity distortion (Jean-Elie excerpt), scroll-speed reactive backgrounds (Studio375 excerpt). Keeps text real (SEO/a11y) while 3D carries emotion.
7. Cursor as material: reactive blobs (Lando, via DesignRush), Lusion's "reactive cursor interaction" (Awwwards tags).
8. Reward exploration: Simon's secrets/achievements, Immersive Garden hidden Backstage, Chiang's TARDIS. Cheap, memorable.
9. Show the craft: Backstage and open-source builds (Simon's MIT repo) convert a portfolio into evidence for a technical founder.
10. Performance as a design feature: KTX compression, channel packing, custom geometry/volume exporters, staged texture loading, background shader compilation, tiered quality toggle (Immersive Garden, Igloo, Simon case links above). Messenger's Dev score for WPO 8.8 comes from per-asset freeing and 4-level LOD.
11. Previs first: grey mockup journeys before art (Igloo case study).
12. Shader-only visuals: no 3D models needed (Szmajda excerpt); a molecule can be instanced spheres + SDF/impostors, tiny payload.

## 4. What makes sites feel cheap (evidence-based or inferred)
- Many sections with the same card treatment; Igloo explicitly named "keeping engagement across few sections" as the challenge and solved it with variety per object.
- Effects without narrative (WebGL decoration). Active Theory quote on "WebGL with purpose" (https://lbbonline.com/news/Craft-Matters-by-Active-Theory) `[excerpt]`.
- UI in DOM with heavy CSS animation where shader would do (Igloo moved glitch/scramble into WebGL to avoid style recalcs).
- Ignoring mobile memory: Safari can kill pages silently (Messenger case study).
- Inconsistent type/colour: every winner above holds to 1 family and 2-colour palette.
- Weak semantics/a11y: even winners score 6.4-7.6; shipping a skip link, real headings, reduced-motion fallback is differentiating (Chiang uses "Skip to Content").
- Tutorials/hand-holding arrows in an exploratory piece (Messenger removed them).
- Pre-rendered video intros: Igloo rendered the intro in real time with shaders to keep size down.

## 5. Recommendations for the molecules -> code story (our synthesis, not sourced)
- 5-6 pinned chapters (Chemistry / Simulation / HPC / Workflow / Horus / Contact), one object each, morph transitions between them.
- Palette: near-black base, one accent; type: one sans + one mono.
- Instanced-sphere molecule on a shader pipeline, DOM text real, WebGL canvas fixed behind.
- Reduced-motion and low-quality tier; budget under a few MB; test iOS Safari memory.

## 6. Unverified / open
- Live first-5-seconds for every site (no browser rendering available).
- Lusion 3D/DOM split, loader behaviour for Simon, Chiang/Rauno colours.
- Isomorphic Labs live scroll; Arc, Recursion, Ginkgo, Anthropic/OpenAI pages: not fetched.
- Messenger "Developer Site of the Year" year (winners page has no year).
- Immersive Garden "Agency of the Year 2025": not confirmed (search found only a Jan 2025 SOTD).
