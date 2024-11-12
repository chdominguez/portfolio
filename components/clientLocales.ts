'use client';

export async function getMessages(locale: string) {
  return import(`../locales/${locale}.json`);
}
