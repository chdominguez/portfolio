import { Stack, Title } from '@mantine/core';
import classes from './Section.module.css';

export function Section({
  sectionName,
  mt,
  children,
}: {
  sectionName: string;
  mt: number;
  children: React.ReactNode;
}) {
  return (
    <Stack mt={mt}>
      <Title className={classes.section_title} id={sectionName}>
        {sectionName}
      </Title>
      {children}
    </Stack>
  );
}
