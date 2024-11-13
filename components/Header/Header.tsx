'use client';

import { useTranslations } from 'next-intl';
import { Anchor, AppShell, Burger, Center, Group, Transition } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import classes from './Header.module.css';

function smoothScroll(id: string) {
  document.querySelector(id)?.scrollIntoView({
    behavior: 'smooth',
  });
}

function SmoothAnchor(props: any) {
  return (
    <Anchor
      {...props}
      href={undefined}
      onClick={() => {
        smoothScroll(props.href);
      }}
    />
  );
}

export function Header() {
  const { width } = useViewportSize();
  const [opened, { toggle }] = useDisclosure(false);

  const t = useTranslations('Header');

  const isMobile = width < 1200;

  const header = (
    <Group className={classes.header}>
      <SmoothAnchor component="a" href="#Education">
        {t('education')}
      </SmoothAnchor>
      <SmoothAnchor component="a" href="#Experience">
        {t('experience')}
      </SmoothAnchor>
      <SmoothAnchor component="a" href="#Projects">
        {t('projects')}
      </SmoothAnchor>
      <SmoothAnchor component="a" href="#Skills">
        {t('skills')}
      </SmoothAnchor>
      <SmoothAnchor component="a" href="#Languages">
        {t('languages')}
      </SmoothAnchor>
      <SmoothAnchor component="a" href="#Contact">
        {t('contact')}
      </SmoothAnchor>
    </Group>
  );

  return (
    <AppShell.Header className={classes.header_shell}>
      {isMobile ? (
        <>
          <div className={classes.header}>
            <Burger
              opened={opened}
              onClick={toggle}
              color="white"
              style={{
                display: 'grid',
                placeContent: 'center',
                width: '100%',
              }}
            />
          </div>
          <Transition mounted={opened} transition="fade-down" duration={200} timingFunction="ease">
            {(styles) => <div style={styles}>{header}</div>}
          </Transition>
        </>
      ) : (
        <Center w="100%" px={50}>
          {header}
        </Center>
      )}
    </AppShell.Header>
  );
}
