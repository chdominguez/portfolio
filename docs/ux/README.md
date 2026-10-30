# UX pass

Screenshots at 1440x900 (`*-desktop-*`) and 390x844 (`*-mobile-*`), before and after, at hero, timeline, projects and end of page.

- Mobile hero: text sits above the molecule and the buttons below it, so nothing overlaps. Buttons fit one row.
- Nav: compact on mobile (all four links visible), 8px tap padding, active section highlighted (`aria-current`), semi-opaque background for contrast.
- Scroll progress bar under the nav (CSS scroll timeline, no JS; hidden where unsupported).
- Timeline cards: the year is a sticky bar under the nav while its card scrolls; the rail is an ordered list.
- Hero: one-line value proposition.
- Keyboard focus ring, hover states on buttons, panels and links, `prefers-reduced-motion` disables transitions and the hit shake.
- Landmarks: labelled nav and sections, decorative scroll cue hidden from assistive tech.
- Contrast: muted text on the dark background is about 6.6:1, teal and body text higher.
