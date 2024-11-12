import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card } from '@mantine/core';
import { ChristianButton } from '@/components/Button/Button';
import College from '@/resources/College.svg';
import Company from '@/resources/Company.svg';
import { Section } from '../Section';
import classes from './EducationExperienceSection.module.css';

function UniversityIcon() {
  const t = useTranslations('Alts');

  return <Image src={College} alt={t('college')} />;
}

function CompanyIcon() {
  const t = useTranslations('Alts');
  return <Image src={Company} alt={t('company')} />;
}

function EducationCard({
  title,
  description,
  date,
  icon,
}: {
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className={classes.card}>
      <div className={classes.card_content}>
        {icon}
        <div className={classes.card_body}>
          <span className={classes.date}>{date}</span>
          <span className={classes.title}>{title}</span>
          <span className={classes.description}>{description}</span>
        </div>
      </div>
    </Card>
  );
}

function LearnMore() {
  const t = useTranslations('Alts');

  return (
    <div style={{ display: 'flex', justifyContent: 'end' }}>
      <a href="mailto:cdominguezdalmases@gmail.com">
        <ChristianButton>{t('learn_more')}</ChristianButton>
      </a>
    </div>
  );
}

export function Education() {
  const t = useTranslations('Education');

  return (
    <Section sectionName={t('education')} mt={100}>
      <EducationCard
        title={t('ub_title')}
        date="2021-2023"
        description={t('ub_description')}
        icon={<UniversityIcon />}
      />
      <EducationCard
        title={t('uab_title')}
        date="2021-2023"
        description={t('uab_description')}
        icon={<UniversityIcon />}
      />
      <LearnMore />
    </Section>
  );
}

export function Experience() {
  const t = useTranslations('Experience');
  return (
    <Section sectionName={t('experience')} mt={0}>
      <EducationCard
        title={t('bsc_title')}
        date="2022-Now"
        description={t('bsc_description')}
        icon={<CompanyIcon />}
      />
      <EducationCard
        title={t('ub_title')}
        date="2021-2023"
        description={t('ub_description')}
        icon={<CompanyIcon />}
      />
      <LearnMore />
    </Section>
  );
}
