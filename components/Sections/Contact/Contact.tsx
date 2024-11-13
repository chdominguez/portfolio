import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconExternalLink,
  IconMail,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { ChristianButton } from '@/components/Button/Button';
import { Section } from '../Section';
import classes from './Contact.module.css';

export function Contact() {
  const t = useTranslations('FindMe');

  return (
    <Section sectionID="Contact" sectionName={t('contact')} mt={100}>
      <div className={classes.contact_container}>
        <MailContact />
        <LinkedIn />
        <GitHub />
      </div>
    </Section>
  );
}

function MailContact() {
  return (
    <a href="mailto:cdominguezdalmases@gmail.com" target="_blank" rel="noreferrer">
      <IconMail className={classes.icon} />
      <ChristianButton>
        <span>cdominguezdalmases@gmail.com</span>
        <IconExternalLink />
      </ChristianButton>
    </a>
  );
}

function LinkedIn() {
  return (
    <a href="https://www.linkedin.com/in/chrisdomdal/" target="_blank" rel="noreferrer">
      <IconBrandLinkedin className={classes.icon} />
      <ChristianButton>
        <span>Christian Dominguez Dalmases</span>
        <IconExternalLink />
      </ChristianButton>
    </a>
  );
}

function GitHub() {
  return (
    <a href="https://github.com/chdominguez" target="_blank" rel="noreferrer">
      <IconBrandGithub className={classes.icon} />
      <ChristianButton>
        <span>chdominguez</span>
        <IconExternalLink />
      </ChristianButton>
    </a>
  );
}
