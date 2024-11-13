'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { HoverCard, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section } from '../Section';
import classes from './Skills.module.css';

type SkillType = {
  title: string;
  description: string;
  icon: string;
};

const getSkills = (locales: ReturnType<typeof useTranslations>): SkillType[] => [
  {
    title: 'Python',
    description: locales('python_description'),
    icon: '/skills/python.png',
  },
  {
    title: 'HTML, CSS, JS',
    description: locales('html_description'),
    icon: '/skills/html.png',
  },
  {
    title: 'TypeScript',
    description: locales('typescript_description'),
    icon: '/skills/typescript.png',
  },
  {
    title: 'Shell (bash, zsh...)',
    description: locales('shell_description'),
    icon: '/skills/bash.png',
  },
  {
    title: 'C',
    description: locales('c_description'),
    icon: '/skills/c.png',
  },
  {
    title: 'Swift',
    description: locales('swift_description'),
    icon: '/skills/swift.png',
  },
];
export function Skills() {
  const t = useTranslations('Skills');
  return (
    <Section sectionID="Skills" sectionName={t('skills')} mt={0}>
      <div className={classes.skills_container}>
        {getSkills(t).map((skill) => (
          <SkillView key={skill.title} {...skill} />
        ))}
      </div>
    </Section>
  );
}

function SkillView(props: SkillType) {
  const [opened, { open, close }] = useDisclosure();

  return (
    <div onMouseOver={open} onMouseLeave={close} className={classes.skill_container}>
      <Image src={props.icon} width={100} height={100} alt={props.title} />
      <HorizontalCollapse opened={opened}>
        <SkillDescription title={props.title} description={props.description} />
      </HorizontalCollapse>
    </div>
  );
}

function SkillDescription({ title, description }: { title: string; description: string }) {
  return (
    <Stack className={classes.description_container} gap={0}>
      <span className={classes.title}>{title}</span>
      <p className={classes.description}>{description}</p>
    </Stack>
  );
}

function HorizontalCollapse({ children, opened }: { children: React.ReactNode; opened: boolean }) {
  return (
    <div className={`${classes.horizontal_collapse} ${opened ? classes.opened : ''}`}>
      {children}
    </div>
  );
}
const getFrameworks = (locales: ReturnType<typeof useTranslations>): SkillType[] => [
  {
    title: 'Git',
    description: locales('git_description'),
    icon: '/frameworks/git.png',
  },
  {
    title: 'MongoDB',
    description: locales('mongodb_description'),
    icon: '/frameworks/mongodb.png',
  },
  {
    title: 'React',
    description: locales('react_description'),
    icon: '/frameworks/react.png',
  },
  {
    title: 'Keycloak',
    description: locales('keycloak_description'),
    icon: '/frameworks/keycloak.png',
  },
  {
    title: 'FastAPI',
    description: locales('fastapi_description'),
    icon: '/frameworks/fastapi.png',
  },
  {
    title: 'Flask',
    description: locales('flask_description'),
    icon: '/frameworks/flask.png',
  },
  {
    title: 'Vite',
    description: locales('vite_description'),
    icon: '/frameworks/vite.png',
  },
  {
    title: 'Next.js',
    description: locales('nextjs_description'),
    icon: '/frameworks/nextjs.png',
  },
  {
    title: 'NGINX',
    description: locales('nginx_description'),
    icon: '/frameworks/nginx.png',
  },
  {
    title: 'Docker',
    description: locales('docker_description'),
    icon: '/frameworks/docker.png',
  },
  {
    title: 'CI/CD',
    description: locales('cicd_description'),
    icon: '/frameworks/actions.png',
  },
];
export function Frameworks() {
  const t = useTranslations('Frameworks');

  return (
    <Section sectionID="Frameworks" sectionName={t('frameworks')} mt={0}>
      <div className={classes.frameworks_grid}>
        {getFrameworks(t).map((skill) => (
          <FrameWorkView key={skill.title} {...skill} />
        ))}
      </div>
    </Section>
  );
}

function FrameWorkView(props: SkillType) {
  return (
    <HoverCard>
      <HoverCard.Target>
        <Image src={props.icon} width={100} height={100} alt={props.title} />
      </HoverCard.Target>
      <HoverCard.Dropdown
        style={{
          background: 'none',
          border: 'none',
        }}
      >
        <FrameworkDescription title={props.title} description={props.description} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

function FrameworkDescription({ title, description }: { title: string; description: string }) {
  return (
    <Stack className={classes.description_container_framework} gap={0}>
      <span className={classes.title}>{title}</span>
      <p
        className={classes.description}
        style={{
          width: 'auto',
        }}
      >
        {description}
      </p>
    </Stack>
  );
}
