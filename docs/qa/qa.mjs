// QA sweep for the portfolio. Does not touch source.
// Usage: BASE=http://localhost:5173 PW_DIR=/path/with/node_modules node docs/qa/qa.mjs [outDir]
// Needs Playwright with chromium; PW_DIR is a folder whose node_modules has `playwright`.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const require = createRequire(path.resolve(process.env.PW_DIR || '.') + '/');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = process.argv[2] || 'docs/qa/shots';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];
const SECTIONS = ['top', 'timeline', 'publications', 'projects', 'stack', 'education', 'contact'];
const ANCHORS = ['temple', 'nostrum2', 'nostrum1', 'python', 'bsc2', 'bsc1', 'ub', 'uab'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = { base: BASE, viewports: {}, reduced: {}, links: [], content: {} };

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function open(vp, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, ...opts });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => logs.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => r.status() >= 400 && logs.push(`http ${r.status()}: ${r.url()}`));
  await page.goto(BASE, { waitUntil: 'load' });
  await wait(3000); // lazy 3D chunk + fonts
  return { ctx, page, logs };
}

const scrollTo = async (page, y) => {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await wait(250);
};

for (const vp of VIEWPORTS) {
  const { ctx, page, logs } = await open(vp);
  const r = { overflow: [], hit: {}, canvas: 0, shots: [], focusOrder: [] };
  r.canvas = await page.locator('canvas').count();

  // horizontal overflow at the top and after a full scroll
  const overflow = () =>
    page.evaluate(() => ({
      doc: document.documentElement.scrollWidth - innerWidth,
      body: document.body.scrollWidth - innerWidth,
      wide: [...document.querySelectorAll('body *')]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.stage'))
        .slice(0, 5)
        .map((e) => `${e.tagName}.${e.className}`),
    }));
  r.overflow.push({ at: 'top', ...(await overflow()) });

  // section screenshots, then a sweep in viewport-height steps
  for (const id of SECTIONS) {
    const y = await page.evaluate((id) => document.getElementById(id)?.getBoundingClientRect().top + scrollY, id);
    await scrollTo(page, y);
    const f = `${OUT}/${vp.name}-sec-${id}.png`;
    await page.screenshot({ path: f });
    r.shots.push(f);
  }
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  r.pageHeight = total;
  for (let y = 0, i = 0; y < total; y += vp.height * 0.9, i++) {
    await scrollTo(page, y);
    await page.screenshot({ path: `${OUT}/${vp.name}-sweep-${String(i).padStart(2, '0')}.png` });
  }
  r.overflow.push({ at: 'bottom', ...(await overflow()) });

  // anchors: centre each card, then sweep 0..1 progress and watch .hit
  for (const id of ANCHORS) {
    const info = await page.evaluate((id) => {
      const el = document.querySelector(`[data-anchor="${id}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: b.top + scrollY, h: b.height };
    }, id);
    if (!info) { r.hit[id] = 'missing'; continue; }
    // p = (vh - rect.top)/(vh + h); scroll from p=0 to p=1 in small steps
    const from = info.top - vp.height, to = info.top + info.h;
    const seen = [];
    for (let y = from; y <= to; y += 80) {
      await scrollTo(page, Math.max(0, y));
      const p = await page.evaluate((id) => {
        const el = document.querySelector(`[data-anchor="${id}"]`);
        const b = el.getBoundingClientRect();
        return { p: +((innerHeight - b.top) / (innerHeight + b.height)).toFixed(3), hit: el.classList.contains('hit') };
      }, id);
      seen.push(p);
    }
    const on = seen.filter((s) => s.hit);
    r.hit[id] = on.length ? { firstP: on[0].p, lastP: on.at(-1).p, frames: on.length } : 'never';
    // screenshots at landing (p~0.45) and at mid approach (p~0.25)
    for (const [tag, target] of [['approach', 0.25], ['impact', 0.45], ['after', 0.8]]) {
      const y = info.top - vp.height + target * (vp.height + info.h);
      await scrollTo(page, Math.max(0, y));
      await page.screenshot({ path: `${OUT}/${vp.name}-anchor-${id}-${tag}.png` });
    }
    // scrubbing back up must clear .hit
    await scrollTo(page, Math.max(0, from - 200));
    r.hit[id + ':clearedOnReverse'] = await page.evaluate((id) => !document.querySelector(`[data-anchor="${id}"]`).classList.contains('hit'), id);
  }

  // keyboard tab order
  await scrollTo(page, 0);
  await page.evaluate(() => document.activeElement?.blur());
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const d = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const b = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return {
        t: (e.textContent || '').trim().slice(0, 30), href: e.getAttribute('href'),
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        inView: b.top >= 0 && b.bottom <= innerHeight,
      };
    });
    if (!d) break;
    r.focusOrder.push(d);
  }

  r.console = logs;
  results.viewports[vp.name] = r;
  await ctx.close();
}

// reduced motion: no canvas, everything visible
{
  const { ctx, page, logs } = await open(VIEWPORTS[0], { reducedMotion: 'reduce' });
  results.reduced = await page.evaluate(() => ({
    canvas: document.querySelectorAll('canvas').length,
    hiddenReveal: [...document.querySelectorAll('.reveal')].filter((e) => +getComputedStyle(e).opacity < 1).length,
    cards: [...document.querySelectorAll('.card')].map((e) => ({ id: e.dataset.anchor, op: getComputedStyle(e).opacity })),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  results.reduced.console = logs;
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await wait(400);
  await page.screenshot({ path: `${OUT}/reduced-bottom.png` });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await wait(400);
  await page.screenshot({ path: `${OUT}/reduced-mid.png` });
  await ctx.close();
}

// links
{
  const { ctx, page } = await open(VIEWPORTS[0]);
  const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href))]);
  for (const href of links) {
    if (href.startsWith(BASE + '/#') || href.startsWith('mailto:')) { results.links.push({ href, status: 'skipped' }); continue; }
    try {
      const resp = await ctx.request.get(href, { maxRedirects: 5, timeout: 20000, headers: { 'user-agent': 'Mozilla/5.0' } });
      results.links.push({ href, status: resp.status(), type: resp.headers()['content-type'] });
    } catch (e) {
      results.links.push({ href, status: 'error', err: e.message.split('\n')[0] });
    }
  }
  // anchors referenced by nav exist
  results.navTargets = await page.evaluate(() =>
    [...document.querySelectorAll('.nav a[href^="#"]')].map((a) => [a.getAttribute('href'), !!document.querySelector(a.getAttribute('href'))]));
  results.bodyText = await page.evaluate(() => document.body.innerText);
  await ctx.close();
}

// content vs PDF: every period, DOI, email and org string on the page should appear in the PDF text
{
  const pdf = execFileSync('pdftotext', ['-layout', 'public/cv_english.pdf', '-']).toString().replace(/\s+/g, ' ');
  const norm = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\s*[–—-]\s*/g, '-').replace(/\s+/g, ' ');
  const text = norm(results.bodyText);
  const p = norm(pdf);
  const probes = ['Feb 2026-Present', 'Jan 2026-Oct 2026', '2023-Dec 2025', '2025-Dec 2025', '2023-2024', '2022-2023', '2021-2023', '2017-2021',
    'christian.99dominguez@gmail.com', 'github.com/chdominguez', 'github.com/temple-compute'];
  results.content.probes = probes.map((s) => ({ s, inPdf: p.includes(s), inPage: text.includes(s) }));
  // DOIs live in hrefs, not visible text; the site domain is not rendered at all
  for (const d of ['10.1101/2025.09.26.678751', '10.1039/d2cp04051d'])
    results.content.probes.push({ s: d, inPdf: p.includes(d), inPage: results.links.some((l) => l.href.endsWith(d)) });
  results.content.pdfWords = p.length;
  results.content.pageWords = text.length;
  writeFileSync(`${OUT}/page-text.txt`, results.bodyText);
}
delete results.bodyText;
writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
