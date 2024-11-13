import Image from 'next/image';
import { IconExternalLink } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import PlusIcon from '@/resources/plus_icon.svg';
import { Section } from '../Section';
import classes from './Projects.module.css';

type PROJECT = {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
};

const getProjects = (locales: ReturnType<typeof useTranslations>): PROJECT[] => [
  {
    title: 'Charted!',
    description: locales('charted_description'),
    icon: <Image src="/project_logos/ChartIcon.png" alt="Charted!" width={120} height={120} />,
    link: 'https://apps.apple.com/es/app/charted/id1576758403',
  },
  {
    title: 'Atomic',
    description: locales('atomic_description'),
    icon: <Image src="/project_logos/atomic03_2.png" alt="Atomic" width={120} height={120} />,
    link: 'https://github.com/chdominguez/Atomic/',
  },
  {
    title: 'MC Simulations',
    description: locales('mc_description'),
    icon: <Image src="/project_logos/MC.png" alt="MC" width={120} height={120} />,
    link: 'https://github.com/chdominguez/monte_carlo_liquid',
  },
  {
    title: 'YieldDB',
    description: locales('yielddb_description'),
    icon: <Image src="/project_logos/EAPM.png" alt="YieldDB" width={120} height={120} />,
    link: 'https://yielddb.bsc.es/',
  },
  {
    title: 'Nostrum Suite WebApp',
    description: locales('nostrum_description'),
    icon: <Image src="/project_logos/nostrum.png" alt="Nostrum" width={120} height={120} />,
    link: 'https://www.nostrumbiodiscovery.com/web-app/',
  },
  {
    title: 'Horus',
    description: locales('horus_description'),
    icon: <Image src="/project_logos/horus_logo.png" alt="Horus" width={120} height={120} />,
    link: 'https://horus.bsc.es/download',
  },
  {
    title: 'Horus Plugin Repository',
    description: locales('horus_plugin_repo_description'),
    icon: <Image src="/project_logos/repo_logo.png" alt="Horus Repo" width={120} height={120} />,
    link: 'https://horus.bsc.es/repo',
  },
  {
    title: locales('this_portfolio'),
    description: locales('this_portfolio_description'),
    icon: (
      <Image src="/project_logos/user.png" alt="Christian Dominguez" width={120} height={120} />
    ),
    link: 'https://www.christiandominguez.info',
  },
];

const getYourNextProject = (locales: ReturnType<typeof useTranslations>) => ({
  title: locales('your_next_project'),
  description: locales('your_next_project_description'),
  icon: <Image src="/project_logos/rocket.png" alt="Rocket" width={120} height={120} />,
  link: 'mailto:cdominguezdalmases@gmail.com',
});

export function Projects() {
  const t = useTranslations('Projects');

  return (
    <Section sectionName={t('projects')} mt={0}>
      <div className={classes.projects_container}>
        {getProjects(t).map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
        <ProjectCardBase {...getYourNextProject(t)} linkIcon={<PlusIconComponent />} />
      </div>
    </Section>
  );
}

function ExternalLinkIcon() {
  return <IconExternalLink size={30} color="white" className={classes.link} />;
}

function PlusIconComponent() {
  return <Image src={PlusIcon} alt="Plus" width={60} height={60} className={classes.plus_link} />;
}

function ProjectCard({ title, description, icon, link }: PROJECT) {
  return (
    <ProjectCardBase
      title={title}
      description={description}
      icon={icon}
      link={link}
      linkIcon={<ExternalLinkIcon />}
    />
  );
}

function ProjectCardBase({
  title,
  description,
  icon,
  link,
  linkIcon,
}: PROJECT & { linkIcon: React.ReactNode }) {
  return (
    <a href={link}>
      <div className={`${classes.card} ${classes.animated_gradient}`}>
        {linkIcon}
        <div className={classes.iconWrapper}>{icon}</div>
        <span className={classes.title}>{title}</span>
        <span className={classes.description}>{description}</span>
      </div>
    </a>
  );
}
