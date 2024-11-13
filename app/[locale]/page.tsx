'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AppShell, Modal, Stack } from '@mantine/core';
import { useDisclosure, useIsFirstRender, useMediaQuery } from '@mantine/hooks';
import { Header } from '@/components/Header/Header';
import { Contact } from '@/components/Sections/Contact/Contact';
import {
  Education,
  Experience,
} from '@/components/Sections/EducationExperience/EducationExperienceSection';
import { FindMe } from '@/components/Sections/FindMe/Find';
import { Languages } from '@/components/Sections/Languages/Languages';
import { Projects } from '@/components/Sections/Projects/Projects';
import { Frameworks, Skills } from '@/components/Sections/SkillsFrameworks/Skills';
import { Welcome } from '../../components/Welcome/Welcome';

export default function HomePage() {
  const firstRender = useIsFirstRender();
  const isMobile = useMediaQuery('(max-width: 40em)');
  const [opened, { close, open }] = useDisclosure(isMobile && firstRender);

  const t = useTranslations('Mobile');

  useEffect(() => {
    if (isMobile) {
      open();
    }
  }, [isMobile]);

  return (
    <AppShell>
      <Header />
      <AppShell.Main>
        <Stack gap={50} className="main-container">
          <Modal opened={opened} onClose={close} title={t('title')} size="sm">
            <div>{t('message')}</div>
          </Modal>
          <Welcome />
          <Education />
          <Experience />
          <Projects />
          <FindMe />
          <Skills />
          <Frameworks />
          <Languages />
          <Contact />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
