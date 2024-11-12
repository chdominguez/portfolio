import { useTranslations } from 'next-intl';
import { Stack, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  const t = useTranslations('Welcome');

  return (
    <Stack gap="50px" mt={100}>
      <Title className={classes.title} ta="center" mt={100}>
        Christian Domínguez
      </Title>
      <Title className={classes.subtitle} ta="center">
        {'</> '} {t('subtitle')} {' </>'}
      </Title>
    </Stack>
  );
}
