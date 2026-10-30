export interface Step {
  period: string;
  title: string;
  org: string;
  points: string[];
}

export interface Chapter {
  id: string;
  title: string;
  years: string;
  lede: string;
  steps: Step[];
}

export const chapters: Chapter[] = [
  {
    id: 'molecules',
    title: 'Molecules',
    years: '2017-2023',
    lede: 'Chemistry first: quantum models, reaction pathways and HPC clusters, with scripts to make them repeatable.',
    steps: [
      {
        period: '2017-2021',
        title: 'BSc Chemistry',
        org: 'Universitat Autònoma de Barcelona',
        points: [
          'Physical chemistry and computational methods.',
          'Undergraduate research in theoretical modeling.',
        ],
      },
      {
        period: '2021',
        title: 'Researcher',
        org: 'Universitat Autònoma de Barcelona',
        points: [
          'Modeled interstellar reaction pathways with quantum chemistry on HPC clusters.',
          'Automated job submission and post-processing with Bash, Python and SLURM.',
        ],
      },
      {
        period: '2021-2023',
        title: 'MSc Theoretical Chemistry and Computational Modelling',
        org: 'Erasmus Mundus Joint Master (TCCM)',
        points: [
          'Quantum chemistry, molecular simulation and HPC across European universities.',
          'Wrote a Hartree-Fock code for the hydrogen molecule.',
        ],
      },
      {
        period: '2022-2023',
        title: 'Researcher',
        org: 'Universitat de Barcelona',
        points: [
          'Simulated catalytic surfaces for CO2 conversion.',
          'Built ParAMS AutoTrain, a Python tool that automates parameter fitting.',
        ],
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    years: '2023-2026',
    lede: 'Then the scripts became platforms: web apps, plugin systems and pipelines that scientists use every day.',
    steps: [
      {
        period: '2023-2024',
        title: 'Research Engineer I',
        org: 'Barcelona Supercomputing Center',
        points: [
          'Laid the foundation of the Horus workflow platform: React and Flask engine, Next.js plugin portal.',
          'Built the LDAP, Keycloak and Caddy login stack. Contributed rendering features to Mol*.',
        ],
      },
      {
        period: '2023-Dec 2025',
        title: 'Full Stack and Platform Engineer',
        org: 'Nostrum Biodiscovery',
        points: [
          'Production apps for molecular dynamics databases, bioinformatics pipelines and ML predictions.',
          'VSE enterovirus repository: Keycloak, Nextflow, Next.js, FastAPI, PostgreSQL, Celery and Redis, shipped with self-hosted GitLab CI/CD.',
        ],
      },
      {
        period: '2025',
        title: 'Research Engineer II',
        org: 'Barcelona Supercomputing Center',
        points: [
          'MDPosit on AWS with MongoDB and Docker Swarm. PredIG, aMLProt and YieldDB.',
          'Dual affiliation with Nostrum. Visitor at BSC since January 2026.',
        ],
      },
      {
        period: 'Jan-Oct 2026',
        title: 'Software Engineering Lead',
        org: 'Nostrum Biodiscovery',
        points: [
          'Led the engineering team: architecture, code quality and delivery across concurrent projects.',
          'Kept growing the Nostrum Suite plugin ecosystem and web app.',
        ],
      },
    ],
  },
  {
    id: 'compute',
    title: 'Compute',
    years: '2025-now',
    lede: 'Now the runtime itself. Horus runs scientific workflows wherever the compute is.',
    steps: [
      {
        period: 'Feb 2026-now',
        title: 'CEO and CTO',
        org: 'Temple Compute',
        points: [
          'Co-founded the company behind Horus, a runtime and orchestration platform for HPC workflows with LLM-assisted scaffolding.',
          'Own technical strategy, investor relations and early hiring. Building horus-runtime and the tc-os backend (FastAPI, PostgreSQL, Redis, MinIO).',
        ],
      },
      {
        period: '2025',
        title: 'Horus: a reproducible workflow manager for bioinformatics',
        org: 'BioRxiv preprint',
        points: ['Co-authored the paper that describes the Horus workflow manager.'],
      },
    ],
  },
];
