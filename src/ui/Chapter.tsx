import type { CSSProperties } from 'react';
import type { Chapter as ChapterData } from '../content/story';

export function Chapter({ c }: { c: ChapterData }) {
  return (
    <section
      className="chapter"
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
          {c.steps.map((s) => (
            <li key={s.title + s.period} className="step">
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
        <span className="bar" aria-hidden="true" />
      </div>
    </section>
  );
}
