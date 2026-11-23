// Screenshots of public routes as a returning visitor: the splash has played and the
// cookie choice is made ("rejected", so no location prompt and no tracking writes from
// the banner), so the page itself is visible. Used for the Hallmark redesign reviews.
// Usage: node scripts/shoot-returning-visitor.mjs <baseUrl> <outDir> <prefix> <route> [route ...] [--hero]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const args = process.argv.slice(2);
const heroOnly = args.includes("--hero");
const [base, outDir, prefix, ...routes] = args.filter((a) => a !== "--hero");
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
mkdirSync(outDir, { recursive: true });

const sizes = heroOnly
  ? [[1280, 800], [1440, 900], [1920, 1080], [375, 812]]
  : [[1440, 900], [375, 812]];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  for (const route of routes) {
    for (const [w, h] of sizes) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument((theme) => {
        try {
          if (theme) { localStorage.setItem("theme", theme); localStorage.setItem("closeDesk-theme", theme); }
          sessionStorage.setItem("aicyro_visited", "true");
          sessionStorage.setItem("hasSeenSplash", "true");
          document.cookie =
            "aicyro_cookie_consent=" +
            encodeURIComponent(JSON.stringify({ status: "rejected", timestamp: Date.now() })) +
            "; path=/; max-age=3600";
        } catch (e) {}
      }, process.env.THEME || "");
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 120000 });
      await new Promise((r) => setTimeout(r, 4000));
      const slug = (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-")) || "home";
      const full = !heroOnly && w === 1440;
      const name = heroOnly ? `${prefix}-hero-${slug}-${w}x${h}.png` : `${prefix}-${slug}-${w}${full ? "-full" : ""}.png`;
      if (full) {
        // Scroll through once so lazy images and the one reveal settle
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
        await new Promise((r) => setTimeout(r, 800));
      }
      // Hide the chatbot's proactive teaser (a returning visitor has seen it) and wait,
      // up to 150s, for every image to finish (the CMS images are large and slow).
      await page.addStyleTag({ content: ".cdw-teaser{display:none!important}" });
      const waited = await page
        .waitForFunction(
          (wholePage) =>
            [...document.images]
              .filter((i) => {
                const r = i.getBoundingClientRect();
                return r.height > 0 && (wholePage || r.top < window.innerHeight);
              })
              .every((i) => i.complete && i.naturalWidth > 0),
          { timeout: Number(process.env.IMG_WAIT || 150000), polling: 1000 },
          full
        )
        .then(() => "images loaded")
        .catch(() => "images still loading after 150s");
      console.log(`${route} @${w}: ${waited}`);
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: path.join(outDir, name), fullPage: full });
      console.log(path.join(outDir, name));
      await page.close();
    }
  }
} finally {
  await browser.close();
}
