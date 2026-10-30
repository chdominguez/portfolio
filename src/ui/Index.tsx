import { profile, projects, publications, skills, spoken } from '../content/cv';

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <img
        src="/christian.webp"
        width="519"
        height="640"
        alt="Christian Domínguez"
        loading="lazy"
        decoding="async"
      />
      <div>
        <h2 id="about-title">Hi, I'm Christian.</h2>
        <p className="about-lead">
          I run Temple Compute and write the software behind it. Since 2023 I have built production
          platforms for scientists at Barcelona Supercomputing Center and Nostrum Biodiscovery,
          after a chemistry degree and research in quantum chemistry.
        </p>
        <dl>
          <div>
            <dt>Now</dt>
            <dd>CEO and CTO, Temple Compute. Building Horus, a workflow runtime for HPC.</dd>
          </div>
          <div>
            <dt>Strongest at</dt>
            <dd>
              Python backends (FastAPI, Flask), React and TypeScript, Docker, CI/CD, auth with
              Keycloak and OAuth2.
            </dd>
          </div>
          <div>
            <dt>Domains</dt>
            <dd>HPC, bioinformatics, molecular dynamics, machine learning pipelines.</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Barcelona. Spanish and Catalan native, English C1.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Work() {
  const [lead, ...rest] = projects;
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="reveal">
        Work
      </h2>
      <a className="lead-project reveal" href={lead.href}>
        <span className="lead-name">{lead.name}</span>
        <span className="lead-desc">{lead.desc} Open source from Temple Compute.</span>
        <span className="mono">{lead.tools.join(', ')}</span>
      </a>
      <ul className="projects">
        {rest.map((p) => (
          <li key={p.name} className="reveal">
            <h3>{p.href ? <a href={p.href}>{p.name}</a> : p.name}</h3>
            <p>{p.desc}</p>
            <p className="mono">{p.tools.join(', ')}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title">
      <h2 id="skills-title" className="reveal">
        Skills
      </h2>
      <p className="intro reveal">What I use each tool for, and where it shipped.</p>
      <div className="skills">
        {skills.map((g) => (
          <article key={g.name} className="reveal">
            <h3>{g.name}</h3>
            {g.since && <p className="mono">since {g.since}</p>}
            <p>{g.use}</p>
            <ul>
              {g.evidence.map((e) => (
                <li key={e.what}>
                  {e.what} <span className="where">{e.where}</span>
                </li>
              ))}
            </ul>
            <p className="mono">{g.tools.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Papers() {
  return (
    <section id="papers" aria-labelledby="papers-title">
      <h2 id="papers-title" className="reveal">
        Papers
      </h2>
      <ul className="papers">
        {publications.map((p) => (
          <li key={p.doi} className="reveal">
            <span className="mono">{p.year}</span>
            <a href={`https://doi.org/${p.doi}`}>{p.title}</a>
            <p>{p.authors}</p>
            <p className="mono">{p.venue}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  return (
    <footer id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="reveal">
        Let's build something.
      </h2>
      <a className="mail reveal" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <p className="links reveal">
        <a href={profile.github}>GitHub</a>
        <a href={profile.templeGithub}>Temple Compute</a>
        <a href="/cv_english.pdf">CV as PDF</a>
      </p>
      <p className="mono reveal">{spoken.map((s) => `${s.lang} ${s.level}`).join(', ')}</p>
    </footer>
  );
}
