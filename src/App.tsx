import { lazy, Suspense, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { initScroll, reducedMotion } from './scroll';
import { Contact, Education, Hero, Projects, Publications, Timeline } from './sections/Sections';
import { Skills } from './sections/Skills';

// The 3D stack loads after first paint, so the text is readable immediately.
const Stage = lazy(() => import('./scene/Stage'));

export function App() {
  useEffect(() => initScroll(), []);
  return (
    <>
      <Analytics />
      <nav className="nav">
        <a href="#top">CD</a>
        <span>
          <a href="#timeline">Timeline</a>
          <a href="#projects">Projects</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </span>
      </nav>
      {!reducedMotion && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}
      <main>
        <Hero />
        <Timeline />
        <Publications />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
