import { lazy, Suspense, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { startClock } from './engine/clock';
import { initStory } from './engine/story';
import { chapters } from './content/story';
import { profile } from './content/cv';
import { Chapter } from './ui/Chapter';
import { Contact, Papers, Skills, Work } from './ui/Index';

// The 3D stack loads after first paint, so the text is readable immediately.
const Stage = lazy(() => import('./scene/Stage'));

export const motionOn = () => document.documentElement.dataset.motion !== 'off';

export function App() {
  useEffect(() => {
    if (!motionOn()) return;
    const stopStory = initStory();
    const stopClock = startClock();
    return () => {
      stopStory();
      stopClock();
    };
  }, []);

  return (
    <>
      <Analytics />
      <a className="skip" href="#work">
        Skip to content
      </a>
      <nav className="nav" aria-label="Main">
        <a href="#top" className="brand">
          {profile.name}
        </a>
        <span>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#papers">Papers</a>
        </span>
      </nav>
      {motionOn() && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}
      <main>
        <header className="hero" id="top">
          <h1 data-in>{profile.tagline}</h1>
          <p data-in>
            CEO and CTO of Temple Compute. A chemist turned engineer, building workflow software for
            HPC and bioinformatics.
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
