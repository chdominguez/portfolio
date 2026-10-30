# Recruiter audit, christiandominguez.info (local build)

Method: read story.ts, cv.ts, Index.tsx, Chapter.tsx, App.tsx, index.html; diffed against `pdftotext public/cv_english.pdf`; rendered at 1440x900 and 390x844 (20 shots in `docs/qa/shots-recruiter/`: d00-d07/dend desktop, m00-m09/mend mobile). Page height is about 15.8k px desktop and 17.1k px mobile. Links in the DOM were enumerated; all 16 resolve to a sensible target (no 404 checked over network, DOIs and GitHub not fetched).

## Verdict in one paragraph

Content is faithful to the CV, with no invented jobs, dates or degrees. The real problems are omissions and framing. There are zero numbers anywhere (users, datasets, uptime, team size, years), seniority is stated as a title but never evidenced, Temple Compute has no product explanation or website, and the most skimmable career data is hidden inside three scroll-pinned chapters. The About block (screen 2) is the best recruiter content on the page and should be closer to the top.

## Persona A: technical recruiter, senior/lead full-stack or platform, 30 seconds

First 10 seconds (d00/m00): sees "From molecules to the compute they run on." (poetic, says nothing), then "CEO and CTO of Temple Compute. A chemist turned engineer, building workflow software for HPC and bioinformatics." Understands: founder, scientific software. Does NOT understand: is this person an IC engineer I can place? What stack? Where?

Findability:
1. Current role/seniority: CEO/CTO yes (hero). "Software Engineering Lead" is only inside the Code chapter step 4, ends Oct 2026. No "years of experience" anywhere. Since 2023 means about 3.5 years professional; a recruiter doing the math reads "mid, not senior" unless lead scope is shown (team size, what was owned).
2. Skills with evidence: strong. The Skills section (tool, use, evidence, where) is the best part of the site. But it is at about 70% scroll depth, after three pinned chapters. Nav on mobile shows only "About" (CSS hides Work/Skills/Papers at narrow widths), so on phone there is no way to jump to Skills.
3. Impact/results: none. Every bullet is a duty ("Built", "Led", "Production apps"). No scale, no latency, no users, no "replaced X".
4. Contact/CV: good. Hero has Read the CV and Email me. Footer repeats. No LinkedIn (a technical recruiter's first click). Email is a personal gmail while claiming to run a company.
5. Location/languages: "Based in: Barcelona" only in About (screen 2). No work authorisation, remote/relocation or availability line. Languages in About and footer. OK.

Bounce/distrust: "CEO/CTO" of a young company (Feb 2026) reads as "will he leave in 3 months / is he really available?" with no statement about availability. Jargon wall in chapters (see jargon list). 15k px of scrolling before Work. Mobile email wraps mid-word as "christian.99dominguez@gmail.c / om" (mend.png), which looks broken at the exact moment of contact.

## Persona B: hiring manager, scientific computing / biotech

First 10 seconds: lands well. "Chemist turned engineer", HPC, bioinformatics, TCCM, quantum chemistry. This audience is the best match for the story; the Molecules chapter is persuasive for them.

Findability:
1. Role/seniority: ok. Lead role at Nostrum plus BSC Research Engineer I/II is visible. "Dual affiliation" is jargon-y but they get it.
2. Skills: Nextflow, SLURM, Docker Swarm, Keycloak, MongoDB all present with where-shipped. Good.
3. Impact: missing. They will want: how many users/labs use MDPosit, what VSE repository holds (samples, sequences), whether PredIG/aMLProt are published or in production. None stated. The 2021 PCCP paper and Horus preprint exist but the Horus preprint is described as "Co-authored", while he is FIRST author on both (CV author lists). That undersells the strongest scientific credential.
4. CV/contact: fine.
5. Location: ok.

Bounce/distrust: papers hidden under "Papers" at the bottom, not in the chapters (PCCP paper is not mentioned in the Molecules chapter at all although it is his 2021 research output). MDPosit, PredIG, aMLProt, YieldDB are one bullet each with no description of what they do for the scientist; PredIG is "T-cell epitope immunogenicity predictor" in the CV but just "PredIG" on the site, so the biotech hook is lost. Missing TCCM details (Perugia: OpenMPI/GPU/ML coursework; Salamanca Hartree-Fock is there). Missing BSC internal training and Udemy certs (low value, fine to skip, but the CV lists them).

## Persona C: startup investor / partner assessing the founder

First 10 seconds: "CEO and CTO of Temple Compute", then nothing about Temple Compute. What is it? For whom? Is there a customer? The only company hook is a GitHub org link labelled "Temple Compute" in the footer and a project card "Horus ... Open source from Temple Compute" (claim "Open source" is not in the CV; it is inferred from github.com/temple-compute. Verify the license before keeping it).

Findability:
1. Role: yes, CEO/CTO with "Co-founded". No co-founder names, no company site, no stage (pre-seed? funded?), no team size. The CV itself says "investor relations and early team hiring", yet the site gives no proof of either.
2. Skills/evidence: strong for the CTO half, nothing for the CEO half (no business results, no pitch, no traction).
3. Impact: zero traction. No users, pilots, grants, revenue, partnerships.
4. Contact: gmail only. Investors expect a company address and a deck/one-pager link.
5. Location: Barcelona. Fine.

Distrust: timeline overlap. Temple Compute starts Feb 2026 while Nostrum Lead runs Jan-Oct 2026 and BSC Visitor Jan 2026-present. The site never says he is full-time on Temple now, which is the first question an investor asks. Also the "Compute" chapter has two entries, one of which is a preprint dated 2025, which makes the chapter look thin ("2025-now" label while the company starts 2026).

## Fact check against the CV PDF

Accurate (spot-checked line by line): all roles, orgs, dates, degrees, both publications and DOIs, languages and levels, the six projects, tc-os stack (FastAPI, PostgreSQL, Redis, MinIO; CV also says SQLModel, omitted on the site), VSE stack, MDPosit/PredIG/aMLProt/YieldDB names, Mol* contribution, LDAP/Keycloak/Caddy stack.

Discrepancies and soft overclaims:
- "platforms ... that scientists use every day" (story.ts lede, code chapter). CV gives no usage data. Overclaim. Replace with something verifiable.
- "VSE enterovirus repository: ... shipped with self-hosted GitLab CI/CD". CV says CI/CD pipelines for "multiple concurrent projects", not VSE specifically. Mild invention of linkage.
- Skills: "Auth and security: Single sign-on and access control for internal and external users". CV does not say SSO or "external users" for this stack. Mild embellishment.
- Skills: OpenMPI listed under Scientific computing. In the CV it is TCCM coursework only, no professional use. Same for NGINX (listed in tools, no evidence entry) and Scikit-learn, SQLAlchemy (CV tools list, no project named). Fine as a tool list but "since 2021/2023" labels imply depth. Keep OpenMPI but drop from the work-evidence framing or tag "coursework".
- "Backend and APIs ... since 2023" includes SQLAlchemy/Flask; Python itself dates from 2021 research, so internally consistent but the label implies 2023 start for backend while Languages says 2021. Fine, just confirm.
- "Co-authored the paper" for Horus preprint: CV lists him first author. Understated, fix.
- "Co-founded the company behind Horus": Horus's origin is BSC (2023) per CV; the phrase suggests Temple created it. Acceptable but state the lineage: "Horus started at BSC in 2023".
- PCCP paper year: CV and site say 2021 but DOI d2cp04051d is a 2022-series PCCP identifier. Check the true publication year before it is read by a chemist.
- Title: site "Full Stack and Platform Engineer"; CV "Full Stack Developer, Platform Engineer". Harmless but ATS keyword match drops "Developer".
- Hero "Compute" years "2025-now" vs Temple start Feb 2026. Explained only by the preprint year.
- Horus card tools "Python, FastAPI, Redis": CV says tc-os backend is FastAPI/Redis, horus-runtime language is not stated. Verify Python.
- "Open source from Temple Compute": see investor section, not in CV.
- Inconsistent spelling: skills evidence uses "Universitat Autonoma de Barcelona" (no accent), elsewhere "Autònoma". Name shown "Domínguez" on site, CV footer "Dominguez".

Invented content: none found (no fake metrics, awards or employers). That is a strength; keep it.

## Missing from the site vs CV

- Visitor role: present only as half a sentence in the RE II step. OK but should appear as its own line in Compute chapter or About.
- Certifications/training: Udemy (Web dev, Quantum computing, Swift & SwiftUI) and BSC internal training absent. Low priority.
- TCCM: Perugia coursework (web deploys, ML/AI for science, OpenMPI + GPU) absent.
- Project links: CV gives URLs for Atomic Molecular Visualizer, MC Simulations, Charted! (App Store) and horus-runtime. Site links only the org page. Four easy trust-building links lost.
- Horus-runtime repo link and CV header links (the second handle "chrisdomdal" and the personal site) not carried over; confirm whether one is LinkedIn.
- Skills list items not shown anywhere: Supabase, Redis in skills tool list, LDAP present, "Swift" fine, HTML/CSS ok. Minor.
- "Last updated September 2026" exists in `profile.updated` but is not shown (verify). Useful trust signal for recruiters.

## Copy quality

AI-sounding or generic:
- Tagline "From molecules to the compute they run on." Elegant, but a recruiter learns nothing. Keep as hero headline, fix with the sub-line.
- "Let's build something." Generic CTA. Replace.
- "Then the scripts became platforms", "Now the runtime itself." Narrative fragments; acceptable in a story section, but they are the only text on screen while the real facts scroll by.
- "Hi, I'm Christian." plus "I run Temple Compute and write the software behind it." is fine, human.
- "Chemistry first: ..." fine.

Jargon a non-specialist recruiter will not parse: HPC (never expanded anywhere), SLURM, Nextflow, Mol*, tc-os, MinIO, OIDC, oauth2-proxy, "runtime", "scaffolding", "dual affiliation", "Nostrum Suite", "VSE", "MDPosit", "PredIG", "aMLProt", "Horus" (never defined on first use except "workflow runtime for HPC"). Fix by expanding HPC once ("high-performance computing, i.e. clusters and supercomputers") and adding a one-clause gloss to each project name.

Dashes: grep of src/ and index.html finds no em dash or en dash characters. Ranges use hyphens ("2017-2021", "Jan-Oct 2026"), which complies. Bullet markers are CSS lines, not characters. Titles use "|" and "/" correctly. Pass.

Links: all 16 anchors map to sane hrefs. Issues: Work lead card links to the org page, not a repo; TipTapChat/MedSum have no link (CV has none either, so say "private" or add demo); no LinkedIn; no company site; "Skip to content" goes to #work, which skips About (minor a11y).

Layout observations from screenshots:
- d00: hero is clean, CTAs clear. Strong.
- d01/d02: pinned chapters show one step at a time then stack; readable, but every chapter costs several screens of scroll for content a recruiter can read in 5 lines.
- m00: mobile hero puts molecules above the fold and pushes the Email button to a second row; fine.
- Mobile nav hides Work, Skills, Papers. Mobile footer email wraps mid-word (mend).
- mend: contact block is clean, but CV link is third in a quiet text row.

## Prioritised changes (max 12)

1. Add a quantified "Impact" line set (needs Christian's real numbers; do not guess). In About `<dl>` add a row:
   `Impact` / `[N] users across [N] labs on MDPosit; [N] sequences in the VSE repository; led [N] engineers.`
   Until real numbers exist, use only verifiable scope: `Led the engineering team for concurrent platform projects; sole architect of the MDPosit AWS deployment.` (CV supports "architected".) Remove "that scientists use every day".

2. Fix the hero sub-line so a recruiter sees seniority and stack in 10 seconds. Replace with:
   `CEO and CTO of Temple Compute, building Horus, an open-source workflow runtime for high-performance computing. Software engineering lead, Python and TypeScript, based in Barcelona.`
   (Drop "open-source" if the license is not confirmed.)

3. Say what Temple Compute is and that he is full-time. In the Temple step replace first bullet with:
   `Co-founded Temple Compute to turn Horus, which began at BSC in 2023, into a runtime that runs scientific workflows on any cluster or cloud, with LLM-assisted workflow scaffolding.`
   Add to Compute lede or About: `Full-time on Temple Compute since November 2026.` (confirm date; he left Nostrum Oct 2026 per CV.) Also add a company link and a company email to Contact when they exist.

4. Correct the authorship understatement. Compute chapter step: points `['First author of the paper describing the Horus workflow manager (BioRxiv, 2025).']`. Also list the 2021 PCCP first-author paper in the Molecules chapter under the 2021-2023 research (e.g. under Researcher UAB: `First author, Phys. Chem. Chem. Phys.: water formation on interstellar silicates.`). Verify the PCCP year against the DOI first.

5. Make mobile navigable and the email not break. Show all four nav links on mobile (or add a compact menu) and set `.mail { overflow-wrap: anywhere; font-size: clamp(1rem, 5vw, 1.6rem) }` so the address stays on one line at 390 px.

6. Move proof closer to the top. Either reorder so Skills follows About, or add under the About `<dl>` a row `Roles` / `Software Engineering Lead (Nostrum, 2026), Research Engineer (BSC, 2023-2025), Full Stack and Platform Engineer (Nostrum, 2023-2025).` Recruiters then read the whole career in one block. No redesign needed.

7. Expand jargon once. About `Domains` row: `High-performance computing (HPC: clusters and supercomputers), bioinformatics, molecular dynamics, machine learning pipelines.` In cv.ts project/step text add short glosses: `MDPosit (molecular dynamics database)`, `PredIG (T-cell epitope immunogenicity predictor)`, `aMLProt (ML pipeline for protein data)`, `YieldDB (protein expression data platform)`.

8. Add the missing links from the CV: Atomic Molecular Visualizer `https://github.com/chdominguez/atomic-molecular-visualizer`, MC Simulations `https://github.com/chdominguez/mc-simulations`, Charted! `https://apps.apple.com/app/charted-regression-charts`, and point the Horus card to the horus-runtime repo (`https://github.com/temple-compute/horus-runtime`, confirm URL). Add LinkedIn if one exists, else say nothing.

9. Tighten overclaims. (a) Auth `use`: `Login and access control for internal users and external collaborators.` becomes `Authentication stack for scientific web apps: LDAP, Keycloak, OAuth2.` (b) VSE step: change `shipped with self-hosted GitLab CI/CD.` to end at `Redis.` and move GitLab CI/CD to a separate bullet: `Ran self-hosted GitLab CI/CD for several concurrent projects.` (c) Tag OpenMPI as `OpenMPI (coursework)` or drop from the tools array. (d) Use `Full Stack Developer and Platform Engineer` as the title for ATS parity.

10. Replace the generic closing line. `Let's build something.` becomes `Hiring, investing or collaborating on scientific software? Email me.` Move the CV link up as a button-styled link next to the email.

11. Add availability and location line to Contact or About: `Based in Barcelona. Open to [roles / collaborations] [remote / hybrid / relocation].` (Christian to fill; recruiters bounce without it.)

12. Show the Visitor role and update date. Add to Compute chapter a one-line step: `Jan 2026-now, External Visitor, Barcelona Supercomputing Center: continued affiliation with BSC projects.` and render `Updated {profile.updated}` small in the footer (field exists, shown nowhere as far as App/Index code reveals).

## What not to touch

Skills evidence structure (tool, purpose, where shipped) is the most credible element and the main reason a technical reader will trust the page. Hyphen-only dash discipline is clean. No invented facts exist; keep it that way when adding numbers by sourcing them from Christian.

## Not verified

External link status (DOIs, GitHub, App Store) not fetched; PCCP publication year and horus-runtime repo URL unverified; the desktop pinned-chapter states between scroll positions sampled only at 2.2 viewport steps.
