import { lazy, Suspense, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { startClock } from './engine/clock';
import { initStory } from './engine/story';
import { chapters } from './content/story';
import { profile } from './content/cv';
import { Chapter } from './ui/Chapter';
import { About, Contact, Papers, Skills, Work } from './ui/Index';

// The 3D stack loads after first paint, so the text is readable immediately.
const Stage = lazy(() => import('./scene/Stage'));

export const motionOn = () => document.documentElement.dataset.motion !== 'off';

export function App() {
  const [on, setOn] = useState(motionOn);

  useEffect(() => {
    if (!on) return;
    const stopStory = initStory();
    const stopClock = startClock();
    return () => {
      stopStory();
      stopClock();
    };
  }, [on]);

  // a lost WebGL context drops the page to the static layout (all content, no canvas)
  useEffect(() => {
    const off = () => {
      document.documentElement.dataset.motion = 'off';
      setOn(false);
    };
    window.addEventListener('portfolio:gl-lost', off);
    return () => window.removeEventListener('portfolio:gl-lost', off);
  }, []);

  return (
    <>
      <Analytics />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <nav className="nav" aria-label="Main">
        <a href="#top" className="brand" aria-label={profile.name}>
          <span className="full">{profile.name}</span>
          <span className="short" aria-hidden="true">
            CD
          </span>
        </a>
        <span>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#papers">Papers</a>
        </span>
      </nav>
      {on && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}
      <main id="main" tabIndex={-1}>
        <header className="hero" id="top">
          <h1 data-in>{profile.tagline}</h1>
          <p data-in>
            CEO and CTO of Temple Compute. Chemist turned engineer, building HPC workflow software
            used by 100+ people in 10+ labs.
          </p>
          <div className="cta" data-in>
            <a className="btn primary" href="#work">
              See the work
            </a>
            <a className="btn" href="/cv_english.pdf">
              Read the CV
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Email me
            </a>
          </div>
        </header>
        <About />
        {chapters.map((c) => (
          <Chapter key={c.id} c={c} />
        ))}
        <div className="index">
          <Work />
          <Skills />
          <Papers />
          <Contact />
        </div>
      </main>
    </>
  );
}
