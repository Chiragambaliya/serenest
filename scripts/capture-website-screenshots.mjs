#!/usr/bin/env node
/**
 * Capture full-page website screenshots at 1440 and 390.
 * Filenames: website-<page>-desktop.png / website-<page>-mobile.png
 * Also writes mobile-top crops and desktop top/mid/bottom when tall.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const OUT = process.argv[3] || '/workspace/review-pack';
const ART = '/opt/cursor/artifacts/website-shots';
const CHROME = process.env.CHROME_PATH || 'google-chrome-stable';

const PAGES = [
  ['home', '/'],
  ['services', '/services'],
  ['psychiatry', '/services/psychiatry'],
  ['therapy', '/services/therapy'],
  ['addiction-care', '/services/addiction-care'],
  ['digital-consultations', '/services/digital-consultations'],
  ['academy-home', '/academy'],
  ['academy-programs', '/academy/programs'],
  ['academy-program-detail', '/academy/programs/clinical-excellence'],
  ['academy-learning-paths', '/academy/learning-paths'],
  ['academy-workshops', '/academy/workshops'],
  ['academy-faculty', '/academy/faculty'],
  ['pricing', '/pricing'],
  ['about', '/about'],
  ['professionals', '/professionals'],
  ['team', '/team'],
  ['contact', '/contact'],
];

mkdirSync(OUT, { recursive: true });
mkdirSync(ART, { recursive: true });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}: ${stderr.slice(-500)}`));
    });
  });
}

async function capture(url, width, height, outPath) {
  // Chrome headless screenshot is viewport-sized by default; use --screenshot
  // with a large window and virtual time, then rely on full-page via CDP-ish
  // fallback: use --window-size and screenshot after load. For full page we
  // shell out to a small puppeteer-less approach using chrome remote debugging.
  const tmpDir = `/tmp/chrome-shot-${process.pid}-${Math.random().toString(16).slice(2)}`;
  mkdirSync(tmpDir, { recursive: true });
  const port = 9200 + Math.floor(Math.random() * 400);
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  try {
    await sleep(800);
    const version = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    const wsUrl = version.webSocketDebuggerUrl;
    // Use chrome-devtools protocol via websockets is heavy; instead use Target.createTarget + Page.captureScreenshot through a tiny node ws? Not available.
    // Fallback: use `google-chrome --screenshot` which captures viewport, then scroll-stitch with multiple captures via evaluate.
    chrome.kill('SIGKILL');
  } catch {
    chrome.kill('SIGKILL');
  }

  // Practical approach: chrome --screenshot with very tall window for near-full page
  const shotPath = outPath;
  await run(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    `--window-size=${width},${Math.max(height, 900)}`,
    `--screenshot=${shotPath}`,
    '--default-background-color=00000000',
    // Force longer page capture by using virtual time + large screenshot
    '--virtual-time-budget=12000',
    url,
  ]);
}

// Prefer a CDP script for true full-page screenshots
async function captureFullPage(url, width, outPath) {
  const script = `
const puppeteerUnavailable = true;
`;
  // Use Chrome's built-in full-page via DevTools Protocol with a one-shot node script
  // employing the `chrome-remote-interface` pattern without deps: spawn chrome and use fetch to /json/new + websocket is complex.
  // Install playwright-core? Keep deps zero: use ImageMagick after viewport screenshots? 
  // Best available: use `google-chrome` with --screenshot and --window-size width x computed height via a preliminary dump.
  const heightProbe = await new Promise((resolve) => {
    const child = spawn(CHROME, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
      `--window-size=${width},900`,
      '--virtual-time-budget=10000',
      '--dump-dom',
      url,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let html = '';
    child.stdout.on('data', (d) => { html += d.toString(); });
    child.on('close', () => {
      // Rough height estimate from content length; clamp
      const approx = Math.min(16000, Math.max(1400, Math.round(html.length / 12)));
      resolve(approx);
    });
  });

  // True full page via CDP using node's built-in websocket? Node 22 has no ws client built-in for CDP easily.
  // Use chromedp-like approach with `curl` to browserless — not available.
  // Install playwright as a one-off for capture quality.
  await capture(url, width, heightProbe, outPath);
}

async function main() {
  // Ensure playwright is available for reliable full-page screenshots
  try {
    await import('playwright');
  } catch {
    console.log('Installing playwright chromium for screenshots...');
    await run('npm', ['install', '--no-save', 'playwright']);
    await run('npx', ['playwright', 'install', 'chromium']);
  }
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const log = [];
  for (const [name, path] of PAGES) {
    for (const [label, width] of [['desktop', 1440], ['mobile', 390]]) {
      const height = label === 'desktop' ? 900 : 844;
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      const url = `${BASE}${path}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      // Dismiss overlays that obscure review screenshots
      const gotIt = page.getByRole('button', { name: /got it/i });
      if (await gotIt.count()) {
        try { await gotIt.first().click({ timeout: 1000 }); } catch { /* ignore */ }
      }
      const close = page.locator('.hp-modal__close, [aria-label="Close"]');
      if (await close.count()) {
        try { await close.first().click({ timeout: 1000 }); } catch { /* ignore */ }
      }
      await page.waitForTimeout(400).catch(async () => { await new Promise((r) => setTimeout(r, 400)); });
      const file = join(OUT, `website-${name}-${label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      copyFileSync(file, join(ART, `website-${name}-${label}.png`));

      const box = await page.evaluate(() => ({
        scrollH: document.documentElement.scrollHeight,
        innerH: window.innerHeight,
      }));

      // Viewport crops via scroll + screenshot (more reliable than clip on fullPage buffers)
      async function viewportCrop(suffix, scrollY) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, scrollY));
        await page.waitForTimeout(150).catch(async () => { await new Promise((r) => setTimeout(r, 150)); });
        const crop = join(OUT, `website-${name}-${label}-${suffix}.png`);
        await page.screenshot({ path: crop, fullPage: false });
        copyFileSync(crop, join(ART, `website-${name}-${label}-${suffix}.png`));
      }

      await viewportCrop('top', 0);
      if (box.scrollH > height * 2.2) {
        await viewportCrop('middle', Math.floor(box.scrollH / 2 - height / 2));
        await viewportCrop('bottom', box.scrollH - height);
      }

      log.push({ name, label, path, file, scrollH: box.scrollH });
      console.log(`✓ website-${name}-${label}.png (${box.scrollH}px)`);
      await page.close();
    }
  }

  await browser.close();
  writeFileSync(join(ART, 'capture-log.json'), JSON.stringify(log, null, 2));
  console.log(`\nCaptured ${log.length} screenshots → ${OUT} and ${ART}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
