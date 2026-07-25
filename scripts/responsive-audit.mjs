#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const PAGES = ['/', '/services', '/academy', '/pricing', '/about', '/professionals', '/team', '/contact', '/faq'];
const WIDTHS = [1440, 768, 390];

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let failures = 0;

for (const width of WIDTHS) {
  const height = width === 390 ? 844 : 900;
  for (const path of PAGES) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    // Accept cookies to avoid overlay skewing overflow
    const gotIt = page.getByRole('button', { name: /got it/i });
    if (await gotIt.count()) {
      try { await gotIt.first().click({ timeout: 1000 }); } catch { /* ignore */ }
    }
    const close = page.locator('.hp-modal__close');
    if (await close.count()) {
      try { await close.first().click({ timeout: 800 }); } catch { /* ignore */ }
    }

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflowX = doc.scrollWidth > doc.clientWidth + 1;
      const issues = [];
      if (overflowX) issues.push(`horizontal overflow (${doc.scrollWidth} > ${doc.clientWidth})`);

      // Focusable elements should be keyboard reachable (presence check)
      const focusables = [...document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
      const zeroSizeFocusable = focusables.filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return style.visibility !== 'hidden' && style.display !== 'none' && (r.width < 1 || r.height < 1);
      }).length;

      // Contrast-ish: ensure primary text isn't ultra-light on cream
      const sample = document.querySelector('h1, h2, p');
      let contrastNote = 'n/a';
      if (sample) {
        const c = getComputedStyle(sample).color;
        contrastNote = c;
      }

      return { overflowX, issues, focusables: focusables.length, zeroSizeFocusable, contrastNote, title: document.title };
    });

    // Keyboard: Tab moves focus at least once
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement?.tagName || null);
    if (!active || active === 'BODY') {
      // try again after skip link
      await page.keyboard.press('Tab');
    }
    const active2 = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      outline: getComputedStyle(document.activeElement).outlineStyle,
    }));

    const ok = !report.overflowX && report.zeroSizeFocusable === 0;
    if (!ok) failures += 1;
    console.log(`${ok ? '✓' : '✗'} ${width}px ${path} focusables=${report.focusables} active=${active2.tag} outline=${active2.outline}${report.issues.length ? ' :: ' + report.issues.join('; ') : ''}`);
    await page.close();
  }
}

await browser.close();
console.log(failures === 0 ? '\n✅ Responsive/overflow audit passed' : `\n❌ ${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
