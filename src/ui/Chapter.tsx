import type { CSSProperties } from 'react';
import type { Chapter as ChapterData } from '../content/story';
import { Bots } from './Bots';

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function Chapter({ c }: { c: ChapterData }) {
  return (
    <section
      className={c.id === 'code' ? 'chapter term' : 'chapter'}
      id={c.id}
      style={{ '--n': c.steps.length } as CSSProperties}
      aria-labelledby={`${c.id}-title`}
    >
      <div className="pin">
        <div className="lead">
          <h2 id={`${c.id}-title`}>{c.title}</h2>
          <p className="years">{c.years}</p>
          <p className="lede">{c.lede}</p>
        </div>
        <ol className="steps">
          {c.steps.map((s, i) => (
            // the first step starts active so the panel is never an empty box before scroll takes over
            <li key={s.title + s.period} className={i === 0 ? 'step is-active' : 'step'}>
              {c.id === 'code' && (
                <p className="prompt" aria-hidden="true">
                  $ cat roles/{slug(s.title)}.md
                </p>
              )}
              <p className="period">{s.period}</p>
              <h3>{s.title}</h3>
              <p className="org">{s.org}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        {c.id === 'code' && <Bots />}
        <span className="bar" aria-hidden="true" />
      </div>
    </section>
  );
}
