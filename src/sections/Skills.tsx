import { skills } from '../content/cv';

// Keeps id="stack" so the nav link and scroll anchors still work.
export function Skills() {
  return (
    <section id="stack">
      <h2 className="reveal">Skills</h2>
      <p className="sub reveal">What I use each tool for, and where I used it.</p>
      <div className="skills-grid">
        {skills.map((g) => (
          <details key={g.name} className="skill reveal">
            <summary>
              <span className="skill-name">{g.name}</span>
              {g.since && <span className="period">Since {g.since}</span>}
              <span className="skill-use">{g.use}</span>
              <span className="tags">
                {g.tools.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
            </summary>
            <ul>
              {g.evidence.map((e) => (
                <li key={e.what}>
                  {e.what} <span className="skill-where">{e.where}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
