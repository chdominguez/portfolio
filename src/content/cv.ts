export type Era = 'chem' | 'research' | 'platform' | 'horus';

export interface Role {
  title: string;
  org: string;
  period: string;
  era: Era;
  bullets: string[];
  stack?: string[];
}

export const profile = {
  name: 'Christian Domínguez',
  tagline: 'From molecules to code.',
  role: 'CEO / CTO at Temple Compute',
  location: 'Barcelona',
  email: 'christian.99dominguez@gmail.com',
  site: 'christiandominguez.info',
  github: 'https://github.com/chdominguez',
  templeGithub: 'https://github.com/temple-compute',
  updated: 'September 2026',
};

// Newest first, as in the CV.
export const roles: Role[] = [
  {
    title: 'CEO / CTO',
    org: 'Temple Compute',
    period: 'Feb 2026 – Present',
    era: 'horus',
    bullets: [
      'Co-founded Temple Compute, building Horus, a runtime and workflow orchestration platform for executing HPC workflows, spanning bioinformatics and broader scientific computing, with LLM-driven workflow scaffolding and flexible compute environments.',
      'Leading technical strategy and business development: product architecture, engineering execution, investor relations and early team hiring.',
      'Driving core platform development, including horus-runtime async subprocess streaming and the tc-os backend (FastAPI, SQLModel/PostgreSQL, Redis, MinIO).',
    ],
  },
  {
    title: 'Software Engineering Lead',
    org: 'Nostrum Biodiscovery',
    period: 'Jan 2026 – Oct 2026',
    era: 'platform',
    bullets: [
      'Team lead for software engineering, owning architecture decisions, code quality and delivery cadence across concurrent platform projects.',
      'Continued development of the Nostrum Suite plugin ecosystem and web application, while directing technical priorities for the team.',
    ],
  },
  {
    title: 'Full Stack Developer, Platform Engineer',
    org: 'Nostrum Biodiscovery',
    period: '2023 – Dec 2025',
    era: 'platform',
    bullets: [
      'Engineered custom scientific applications for internal users and external collaborators across bioinformatics and computational biology.',
      'Architected production web apps for molecular dynamics databases, bioinformatics pipelines and ML prediction tools.',
      'Built cross-platform desktop apps with web technologies that work locally and offline.',
      'Ran CI/CD on self-hosted GitLab for multiple concurrent projects.',
      'VSE Vall d’Hebron Enterovirus Repository: Keycloak auth, Nextflow orchestration, Next.js frontend, PostgreSQL + FastAPI, Celery + Redis job queue.',
      'Nostrum Suite plugins: modular architecture with Flask + Pydantic and a Vite + React + TypeScript frontend for simulation setup and execution.',
      'Nostrum Suite WebApp: browser interface to launch and manage molecular simulations (Flask, SQLite, React).',
    ],
    stack: [
      'Flask',
      'FastAPI',
      'Pydantic',
      'React',
      'Next.js',
      'TypeScript',
      'Vite',
      'Docker',
      'GitLab CI/CD',
    ],
  },
  {
    title: 'Research Engineer II',
    org: 'Barcelona Supercomputing Center (BSC)',
    period: '2025 – Dec 2025',
    era: 'platform',
    bullets: [
      'Platform engineer on HPC and bioinformatics tooling, in dual affiliation with Nostrum Biodiscovery. Visitor at BSC since Jan 2026.',
      'MDPosit: molecular dynamics database on AWS with MongoDB and Docker Swarm for high availability.',
      'PredIG: interpretable T-cell epitope immunogenicity predictor as a Horus plugin (Pandas, Transformers, Docker).',
      'aMLProt: ML pipeline plugin for feature extraction, selection, outlier detection and model training.',
      'YieldDB: protein expression data platform (FastAPI, SQLite, React).',
    ],
    stack: [
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'MongoDB',
      'Keycloak',
      'Nextflow',
      'Celery',
      'AWS',
      'Transformers',
    ],
  },
  {
    title: 'Research Engineer I',
    org: 'Barcelona Supercomputing Center (BSC)',
    period: '2023 – 2024',
    era: 'platform',
    bullets: [
      'Joined BSC laying the technical foundation for the Horus HPC workflow platform.',
      'Horus Workflow Manager: workflow engine with React + Flask, and a Next.js/MongoDB/FastAPI plugin repository portal.',
      'Horus-OpenAuth-LDAP: LDAP as source of truth, Keycloak OIDC/OAuth2, oauth2-proxy and Caddy enforcement, custom provisioning middleware.',
      'Mol*: contributed rendering and interaction features to the open-source molecular viewer.',
    ],
    stack: ['Flask', 'FastAPI', 'React', 'Keycloak', 'LDAP', 'OAuth2', 'Caddy'],
  },
  {
    title: 'Researcher',
    org: 'Universitat de Barcelona',
    period: '2022 – 2023',
    era: 'research',
    bullets: [
      'Simulated catalytic surfaces for CO2 conversion in energy-efficient reaction environments.',
      'Built ParAMS AutoTrain, a Python automation tool that speeds up parameter-fitting workflows and model training.',
      'Improved throughput and reproducibility through automation and HPC integration.',
    ],
  },
  {
    title: 'Researcher',
    org: 'Universitat Autònoma de Barcelona',
    period: '2021',
    era: 'chem',
    bullets: [
      'Modeled interstellar chemical reaction pathways with quantum chemical simulations on HPC clusters.',
      'Automated job submission and post-processing with Bash, Python and SLURM, cutting time-to-results.',
    ],
  },
];

export const education = [
  {
    title: 'MSc Theoretical Chemistry and Computational Modelling',
    org: 'Erasmus Mundus Joint Master (TCCM)',
    period: '2021 – 2023',
    detail:
      'Quantum chemistry, molecular simulation and HPC across European universities; OpenMPI and GPU programming, ML tools at Perugia; a Hartree–Fock H₂ implementation at Salamanca.',
  },
  {
    title: 'BSc Chemistry',
    org: 'Universitat Autònoma de Barcelona',
    period: '2017 – 2021',
    detail:
      'Physical chemistry and computational methods; undergraduate research in theoretical modeling.',
  },
  {
    title: 'Internal Training Programs',
    org: 'Barcelona Supercomputing Center',
    period: '2023 – Present',
    detail: 'HPC fundamentals, software design patterns, advanced Docker, CI/CD.',
  },
  {
    title: 'Web Development Certifications',
    org: 'Udemy',
    period: '2023',
    detail: 'HTML/CSS, JavaScript, React, SQL, quantum computing, Swift & SwiftUI.',
  },
];

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
    href: 'https://github.com/chdominguez/atomic-molecular-visualizer',
  },
  {
    name: 'MC Simulations',
    desc: 'Monte Carlo algorithms for simulating atomic liquids.',
    tools: ['C'],
    href: 'https://github.com/chdominguez/mc-simulations',
  },
  {
    name: 'Charted!',
    desc: 'Create and view regression charts on iOS with interactive touch controls.',
    tools: ['Swift', 'SwiftUI'],
    href: 'https://apps.apple.com/app/charted-regression-charts',
  },
];

export const skills = {
  languages: ['Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SASS', 'C', 'Swift', 'Shell'],
  tools: [
    'FastAPI',
    'Flask',
    'Pydantic',
    'Dash',
    'React',
    'Next.js',
    'Vite',
    'WebPack',
    'ParcelJS',
    'PostgreSQL',
    'MongoDB',
    'SQLite',
    'SQLAlchemy',
    'Redis',
    'Celery',
    'Keycloak',
    'LDAP',
    'OAuth2',
    'NGINX',
    'Caddy',
    'Docker',
    'Docker Swarm',
    'Git',
    'CI/CD',
    'AWS',
    'Nextflow',
    'Supabase',
    'Vercel',
  ],
  ml: [
    'Transformers',
    'Hugging Face',
    'Pandas',
    'Scikit-learn',
    'Feature Engineering',
    'Model Training',
  ],
};

export const spoken = [
  { lang: 'Spanish · Catalan', level: 'Native' },
  { lang: 'English', level: 'C1' },
  { lang: 'French', level: 'A2' },
  { lang: 'Chinese', level: 'HSK2' },
];
