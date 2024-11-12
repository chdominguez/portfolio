import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Center, Container, Stack } from '@mantine/core';
import classes from './Find.module.css';

export function FindMe() {
  return (
    <Container>
      <CurlyArrow />
      <Center>
        <Stack mt={20} align="center">
          <Image
            src="/christian.png"
            alt="Christian"
            id="christian"
            width={250}
            height={300}
            className={classes.photo}
          />
          <FindMeButton />
        </Stack>
      </Center>
    </Container>
  );
}

function CurlyArrow() {
  return (
    <Image
      src="/curly_arrow.png"
      alt="Curly Arrow"
      className={classes.arrow}
      width={100}
      height={100}
    />
  );
}

function FindMeButton() {
  const t = useTranslations('FindMe');
  return (
    <a href="mailto:cdominguezdalmases@gmail.com" className={classes.find_button}>
      {t('find_me')}
    </a>
  );
}
