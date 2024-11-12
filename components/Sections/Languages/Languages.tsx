import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Section } from '../Section';
import classes from './Languages.module.css';

type LanguageType = {
  title: string;
  icon: string;
  code: string;
};

const LANGUAGES: LanguageType[] = [
  {
    title: 'Español',
    icon: '/languages/spanish.png',
    code: 'es',
  },
  {
    title: 'Català',
    icon: '/languages/catalan.png',
    code: 'ca',
  },
  {
    title: 'English',
    icon: '/languages/english.png',
    code: 'en',
  },
  {
    title: 'Français',
    icon: '/languages/french.png',
    code: 'fr',
  },
  {
    title: '中文',
    icon: '/languages/chinese.png',
    code: 'zh-CN',
  },
];

export function Languages() {
  const t = useTranslations('Languages');

  return (
    <Section sectionName={t('languages')} mt={0}>
      <div className={classes.languages_container}>
        {LANGUAGES.map((language) => (
          <LanguageView key={language.title} {...language} />
        ))}
      </div>
      <div className={classes.arrow_container}>
        <Image
          src="/arrow_language.svg"
          alt="Curly Arrow"
          className={classes.arrow}
          width={250}
          height={100}
        />
        <p>{t('change_language')}</p>
      </div>
    </Section>
  );
}

function LanguageView(props: LanguageType) {
  return (
    <a className={classes.language_container} href={`/${props.code}`}>
      <Image src={props.icon} width={100} height={100} alt={props.title} />
      <span>{props.title}</span>
    </a>
  );
}
