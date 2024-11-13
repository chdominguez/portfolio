import { Stack, Title } from '@mantine/core';
import classes from './Section.module.css';

export function Section({
  sectionID,
  sectionName,
  mt,
  children,
}: {
  sectionID: string;
  sectionName: string;
  mt: number;
  children: React.ReactNode;
}) {
  return (
    <Stack mt={mt}>
      <Title className={classes.section_title} id={sectionID}>
        {sectionName}
      </Title>
      {children}
    </Stack>
  );
}
