// Screenshot one element (by CSS selector) of a public route as a returning visitor.
// Usage: node scripts/shoot-element.mjs <baseUrl> <outDir> <route> <selector> <name> [width=1440] [theme=light] [hoverSelector]
// With a hoverSelector, the mouse rests on that element before the shot (to show hover states).
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const [base, outDir, route, selector, name, w = "1440", theme = "light", hover] = process.argv.slice(2);
const width = Number(w);
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height: width < 600 ? 812 : 900, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem("theme", t);
      localStorage.setItem("closeDesk-theme", t);
      sessionStorage.setItem("aicyro_visited", "true");
      sessionStorage.setItem("hasSeenSplash", "true");
      document.cookie = "aicyro_cookie_consent=" + encodeURIComponent(JSON.stringify({ status: "rejected", timestamp: Date.now() })) + "; path=/; max-age=3600";
    } catch (e) {}
  }, theme);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));
  await page.addStyleTag({ content: ".cdw-teaser,.cdw-launcher,[class*='cdw-launch']{display:none!important} .js .www [data-reveal]{opacity:1!important;transform:none!important}" });
  await page.waitForSelector(selector, { timeout: 30000 });
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "center" }), selector);
  await new Promise((r) => setTimeout(r, 2500));
  if (hover) {
    await page.hover(hover);
    await new Promise((r) => setTimeout(r, 1200));
  }
  const el = await page.$(selector);
  const file = path.join(outDir, `${name}-${width}-${theme}.png`);
  await el.screenshot({ path: file });
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`${name} @${width} ${theme}: ${file}, scrollWidth ${sw}${errors.length ? ", errors: " + errors.join(" | ") : ""}`);
} finally {
  await browser.close();
}
