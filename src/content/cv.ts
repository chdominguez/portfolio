export const profile = {
  name: 'Christian Domínguez',
  tagline: 'From molecules to the compute they run on.',
  role: 'CEO / CTO at Temple Compute',
  location: 'Barcelona',
  email: 'christian.99dominguez@gmail.com',
  site: 'christiandominguez.info',
  github: 'https://github.com/chdominguez',
  templeGithub: 'https://github.com/temple-compute',
  updated: 'September 2026',
};

export const publications = [
  {
    title: 'Horus: A reproducible workflow manager for bioinformatics',
    authors: 'C. Domínguez-Dalmases, A. Cañellas-Solé, R. Lambea-Jané, M. Municoy, V. Guallar',
    venue: 'BioRxiv',
    year: 2025,
    doi: '10.1101/2025.09.26.678751',
  },
  {
    title:
      'Water formation on interstellar silicates: role of Fe²⁺/H₂ interactions in the O + H₂ → H₂O reaction',
    authors: 'C. Domínguez-Dalmases, A. Rimola, M. Serra-Peralta',
    venue: 'Physical Chemistry Chemical Physics',
    year: 2021,
    doi: '10.1039/d2cp04051d',
  },
];

export const projects = [
  {
    name: 'Horus',
    desc: 'Runtime and workflow orchestration for HPC and scientific computing.',
    tools: ['Python', 'FastAPI', 'Redis'],
    href: 'https://github.com/temple-compute',
  },
  {
    name: 'TipTapChat',
    desc: 'AI travel planner with multi-version trip comparison, calendar sync and drag-and-drop scheduling.',
    tools: ['TypeScript', 'Next.js', 'Supabase', 'Vercel'],
  },
  {
    name: 'MedSum',
    desc: 'Privacy-preserving medical report summarizer using local AI models, fully offline.',
    tools: ['FastAPI', 'Vite', 'React', 'Transformers'],
  },
  {
    name: 'Atomic Molecular Visualizer',
    desc: 'Render and manipulate atomic structures on macOS and iPadOS.',
    tools: ['Swift', 'SwiftUI', 'SceneKit'],
  },
  {
    name: 'MC Simulations',
    desc: 'Monte Carlo algorithms for simulating atomic liquids.',
    tools: ['C'],
  },
  {
    name: 'Charted!',
    desc: 'Create and view regression charts on iOS with interactive touch controls.',
    tools: ['Swift', 'SwiftUI'],
  },
];

export interface SkillGroup {
  name: string;
  use: string;
  tools: string[];
  /** Only set when a CV role date supports it. */
  since?: number;
  evidence: { what: string; where: string }[];
}

export const skills: SkillGroup[] = [
  {
    name: 'Backend and APIs',
    use: 'Services and APIs behind scientific web apps.',
    tools: ['FastAPI', 'Flask', 'Pydantic', 'SQLAlchemy', 'PostgreSQL', 'MongoDB', 'SQLite'],
    since: 2023,
    evidence: [
      {
        what: 'FastAPI + PostgreSQL backend with a Celery and Redis queue for async jobs.',
        where: 'VSE Enterovirus Repository, Nostrum Biodiscovery',
      },
      {
        what: 'Flask + Pydantic backend for a modular plugin architecture.',
        where: 'Nostrum Suite plugins',
      },
      {
        what: 'FastAPI, SQLModel/PostgreSQL, Redis and MinIO backend.',
        where: 'tc-os, Temple Compute',
      },
    ],
  },
  {
    name: 'Frontend',
    use: 'Browser and offline desktop interfaces for simulations and data.',
    tools: ['React', 'Next.js', 'TypeScript', 'Vite', 'WebPack', 'ParcelJS', 'HTML', 'CSS', 'SASS'],
    since: 2023,
    evidence: [
      {
        what: 'Next.js frontend for a bioinformatics platform.',
        where: 'VSE Enterovirus Repository',
      },
      {
        what: 'Vite + React + TypeScript UI to configure and run molecular simulations.',
        where: 'Nostrum Suite plugins and WebApp',
      },
      {
        what: 'Plugin repository portal for community plugin sharing.',
        where: 'Horus Workflow Manager, BSC',
      },
    ],
  },
  {
    name: 'Data and ML',
    use: 'Prediction pipelines and tools for protein and immunology data.',
    tools: ['Pandas', 'Scikit-learn', 'Transformers', 'Hugging Face', 'Feature Engineering'],
    evidence: [
      {
        what: 'Immunogenicity predictor with Pandas and Transformers.',
        where: 'PredIG, BSC',
      },
      {
        what: 'Pipeline for feature extraction, selection, outlier detection and model training.',
        where: 'aMLProt, BSC',
      },
      {
        what: 'Local models for private medical report summaries.',
        where: 'MedSum, personal project',
      },
    ],
  },
  {
    name: 'Infra and DevOps',
    use: 'Containers, deployment and pipelines for production apps.',
    tools: [
      'Docker',
      'Docker Swarm',
      'CI/CD',
      'GitLab CI',
      'NGINX',
      'Caddy',
      'AWS',
      'Vercel',
      'Git',
    ],
    since: 2023,
    evidence: [
      {
        what: 'High-availability molecular dynamics database on AWS with MongoDB and Docker Swarm.',
        where: 'MDPosit, BSC',
      },
      {
        what: 'Self-hosted GitLab CI/CD for several concurrent projects.',
        where: 'Nostrum Biodiscovery',
      },
      {
        what: 'Caddy reverse proxy enforcing authentication.',
        where: 'Horus auth integration, BSC',
      },
    ],
  },
  {
    name: 'Auth and security',
    use: 'Single sign-on and access control for internal and external users.',
    tools: ['Keycloak', 'LDAP', 'OAuth2', 'oauth2-proxy'],
    since: 2023,
    evidence: [
      {
        what: 'LDAP as source of truth, Keycloak as OIDC/OAuth2 provider, oauth2-proxy and Caddy in front, custom user provisioning.',
        where: 'Horus-OpenAuth-LDAP Integration, BSC',
      },
      {
        what: 'Keycloak authentication in a full-stack platform.',
        where: 'VSE Enterovirus Repository',
      },
    ],
  },
  {
    name: 'Scientific computing and HPC',
    use: 'Workflows, simulations and automation on clusters.',
    tools: ['Nextflow', 'SLURM', 'Bash', 'OpenMPI', 'Workflow orchestration'],
    since: 2021,
    evidence: [
      {
        what: 'Job submission and post-processing scripts on HPC clusters.',
        where: 'Researcher, Universitat Autonoma de Barcelona',
      },
      {
        what: 'Core workflow engine and plugin ecosystem for HPC workflows.',
        where: 'Horus, BSC and Temple Compute',
      },
      {
        what: 'Nextflow pipeline orchestration.',
        where: 'VSE Enterovirus Repository',
      },
    ],
  },
  {
    name: 'Languages',
    use: 'Python for most work, TypeScript for the web, C and Swift on the side.',
    tools: ['Python', 'TypeScript', 'JavaScript', 'C', 'Swift', 'Shell'],
    since: 2021,
    evidence: [
      {
        what: 'Python and Bash automation for HPC jobs, from my first research role.',
        where: 'Universitat Autonoma de Barcelona, 2021',
      },
      {
        what: 'Monte Carlo simulations in C; Swift and SwiftUI apps for macOS, iPadOS and iOS.',
        where: 'MC Simulations, Atomic Molecular Visualizer, Charted!',
      },
    ],
  },
];

export const spoken = [
  { lang: 'Spanish and Catalan', level: 'Native' },
  { lang: 'English', level: 'C1' },
  { lang: 'French', level: 'A2' },
  { lang: 'Chinese', level: 'HSK2' },
];
