'use client';

import { AppShell, Stack } from '@mantine/core';
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
  return (
    <AppShell>
      <Header />
      <AppShell.Main>
        <Stack gap={50} className="main-container">
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
