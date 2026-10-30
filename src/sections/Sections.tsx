import { education, profile, projects, publications, roles, skills, spoken } from '../content/cv';

const ids = ['temple', 'nostrum2', 'nostrum1', 'bsc2', 'bsc1', 'ub', 'uab'];

export function Hero() {
  return (
    <header className="hero" id="top" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow">
          {profile.location} · {profile.role}
        </p>
        <h1 id="hero-title">
          {profile.name.split(' ')[0]}
          <br />
          <span className="grad">{profile.name.split(' ')[1]}</span>
        </h1>
        <p className="lead">
          {profile.tagline} I build workflow software that runs scientific computing on HPC.
        </p>
      </div>
      <div>
        <div className="cta">
          <a className="btn primary" href="#timeline">
            See the journey
          </a>
          <a className="btn" href="/cv_english.pdf">
            Download CV
          </a>
          <a className="btn" href={profile.github}>
            GitHub
          </a>
        </div>
        <span className="scroll-cue" aria-hidden="true">
          scroll
        </span>
      </div>
    </header>
  );
}

export function Timeline() {
  const chrono = [...roles].reverse();
  return (
    <section id="timeline" className="timeline" aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="reveal">
        The timeline
      </h2>
      <p className="sub reveal">Atoms first, then code. Scroll.</p>
      <ol className="rail">
        {chrono.map((r, i) => {
          const id = ids[roles.length - 1 - i];
          const align = i % 2 ? 'right' : 'left';
          return (
            <li key={id}>
              <article className={`card ${align} era-${r.era}`} data-anchor={id}>
                <span className="period">{r.period}</span>
                <h3>{r.title}</h3>
                <p className="org">{r.org}</p>
                <ul>
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {r.stack && (
                  <p className="tags">
                    {r.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </p>
                )}
              </article>
              {id === 'nostrum1' && (
                <div className="python" data-anchor="python">
                  <strong>Python backend</strong>
                  <span>Flask · FastAPI · Pydantic · SQLAlchemy · Celery · Dash</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function Publications() {
  return (
    <section id="publications" aria-labelledby="publications-title">
      <h2 id="publications-title" className="reveal">
        Publications
      </h2>
      <div className="grid two">
        {publications.map((p) => (
          <a key={p.doi} className="panel reveal" href={`https://doi.org/${p.doi}`}>
            <span className="period">
              {p.year} · {p.venue}
            </span>
            <h3>{p.title}</h3>
            <p className="org">{p.authors}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="reveal">
        Projects
      </h2>
      <div className="grid three">
        {projects.map((p) => {
          const Tag = p.href ? 'a' : 'div';
          return (
            <Tag key={p.name} className="panel reveal" {...(p.href ? { href: p.href } : {})}>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <p className="tags">
                {p.tools.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </p>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

export function Stack() {
  const rows: [string, string[]][] = [
    ['Languages', skills.languages],
    ['Frameworks & tools', skills.tools],
    ['Machine learning', skills.ml],
  ];
  return (
    <section id="stack">
      <h2 className="reveal">Stack</h2>
      {rows.map(([label, items]) => (
        <div key={label} className="reveal stack-row">
          <h3>{label}</h3>
          <p className="tags">
            {items.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title">
      <h2 id="education-title" className="reveal">
        Education
      </h2>
      <div className="grid two">
        {education.map((e) => (
          <div key={e.title} className="panel reveal">
            <span className="period">{e.period}</span>
            <h3>{e.title}</h3>
            <p className="org">{e.org}</p>
            <p>{e.detail}</p>
          </div>
        ))}
      </div>
      <p className="langs reveal">
        {spoken.map((s) => (
          <span key={s.lang}>
            <b>{s.lang}</b> {s.level}
          </span>
        ))}
      </p>
    </section>
  );
}

export function Contact() {
  return (
    <footer id="contact" className="contact">
      <h2 className="reveal">Let’s build something.</h2>
      <p className="reveal">
        <a className="btn primary" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
      <p className="reveal links">
        <a href={profile.github}>github.com/chdominguez</a>
        <a href={profile.templeGithub}>github.com/temple-compute</a>
        <a href="/cv_english.pdf">CV (PDF)</a>
      </p>
      <small>CV last updated {profile.updated}</small>
    </footer>
  );
}
