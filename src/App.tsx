import { lazy, Suspense, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { initScroll, reducedMotion } from './scroll';
import {
  Contact,
  Education,
  Hero,
  Projects,
  Publications,
  Stack,
  Timeline,
} from './sections/Sections';

// The 3D stack loads after first paint, so the text is readable immediately.
const Stage = lazy(() => import('./scene/Stage'));

const links = ['timeline', 'projects', 'stack', 'contact'];

/** Id of the section crossing a band near the top third of the viewport; '' over the hero. */
function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setActive(e.target.id === 'top' ? '' : e.target.id)
        ),
      { rootMargin: '-30% 0px -65% 0px' }
    );
    ['top', ...links].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export function App() {
  useEffect(() => initScroll(), []);
  const active = useActiveSection();
  return (
    <>
      <Analytics />
      <nav className="nav" aria-label="Primary">
        <a href="#top" aria-label="Back to top">
          CD
        </a>
        <span>
          {links.map((id) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </span>
        <div className="progress" aria-hidden="true" />
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
        <Stack />
        <Education />
        <Contact />
      </main>
    </>
  );
}
