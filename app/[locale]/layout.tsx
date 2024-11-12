import '@mantine/core/styles.css';
import './index.css';

import React, { ReactNode } from 'react';
import { Outfit } from 'next/font/google';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
// i18n
import { routing } from '@/i18n/routing';
import Background from '@/resources/Background.png';
import { theme } from '../../theme';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Christian Dominguez | Web Developer',
  description: 'Christian Dominguez portfolio',
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${outfit.className}`}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Image src={Background} alt="Background" id="background" />
        <NextIntlClientProvider messages={messages}>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
