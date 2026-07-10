import { chromium } from "playwright";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGION = "İstanbul Avrupa";
const SOURCES = {
  shell: {
    brand: "Shell",
    url: "https://www.shell.com.tr/suruculer/shell-yakitlari/akaryakit-pompa-satis-fiyatlari.html",
    products: [
      "Shell FuelSave Motorin", "Shell FuelSave Diesel", "FuelSave Motorin",
      "FuelSave Diesel", "Shell V-Power Diesel", "V-Power Diesel",
      "V-Power Motorin", "Motorin", "Diesel"
    ]
  },
  opet: {
    brand: "OPET",
    url: "https://www.opet.com.tr/akaryakit-fiyatlari/istanbul-avrupa",
    products: [
      "Ultra Force Motorin", "Eco Force Motorin", "Ultra Euro Diesel",
      "OPET Motorin", "Motorin", "Diesel"
    ]
  }
};

const MAX_RESPONSE_BYTES = 4_000_000;
const PRICE_PATTERN = /(?:₺|TL|TRY)?\s*([1-9]\d{1,2}[.,]\d{1,3})\s*(?:₺|TL|TRY)?/giu;
const PRODUCT_PATTERN = /motorin|diesel|fuelsave|v-power|ultra\s*force|eco\s*force/i;
const PRICE_KEY_PATTERN = /price|fiyat|amount|tutar|value|unitprice|salesprice|pump/i;

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function trLower(value) {
  return normalizeText(value).toLocaleLowerCase("tr-TR");
}

function parsePrice(value) {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 20 || value > 250) return null;
    return Math.round(value * 100) / 100;
  }
  const match = String(value ?? "").match(/([1-9]\d{1,2}[.,]\d{1,3})/);
  if (!match) return null;
  const number = Number(match[1].replace(",", "."));
  if (!Number.isFinite(number) || number < 20 || number > 250) return null;
  return Math.round(number * 100) / 100;
}

function findPriceNearProduct(text, products, sourceBonus = 0) {
  const clean = normalizeText(text);
  if (!clean) return null;
  const lower = trLower(clean);
  let best = null;

  products.forEach((product, productPriority) => {
    const needle = trLower(product);
    let idx = lower.indexOf(needle);

    while (idx >= 0) {
      const start = Math.max(0, idx - 500);
      const end = Math.min(clean.length, idx + needle.length + 1500);
      const windowText = clean.slice(start, end);
      const productOffset = idx - start;

      for (const match of windowText.matchAll(PRICE_PATTERN)) {
        const price = parsePrice(match[1]);
        if (price == null) continue;
        const matchOffset = match.index ?? 0;
        const distance = Math.abs(matchOffset - productOffset);
        const currencyBonus = /₺|\bTL\b|\bTRY\b/i.test(match[0]) ? 60 : 0;
        const afterBonus = matchOffset >= productOffset ? 25 : 0;
        const priorityBonus = Math.max(0, 90 - productPriority * 8);
        const score = 450 - Math.min(distance, 450) + currencyBonus + afterBonus + priorityBonus + sourceBonus;

        if (!best || score > best.score) {
          best = {
            price,
            product,
            score,
            excerpt: windowText.slice(Math.max(0, matchOffset - 150), matchOffset + 180)
          };
        }
      }
      idx = lower.indexOf(needle, idx + needle.length);
    }
  });
  return best;
}

function extractJsonCandidates(value, products, pathParts = [], depth = 0, out = []) {
  if (depth > 10 || value == null) return out;

  if (Array.isArray(value)) {
    value.forEach((item, index) => extractJsonCandidates(item, products, [...pathParts, String(index)], depth + 1, out));
    return out;
  }

  if (typeof value !== "object") return out;

  let objectText = "";
  try {
    objectText = normalizeText(JSON.stringify(value));
  } catch {
    objectText = "";
  }

  const lowerObject = trLower(objectText);
  const matchedProduct = products.find((p) => lowerObject.includes(trLower(p))) || (PRODUCT_PATTERN.test(objectText) ? "Motorin/Diesel" : null);

  if (matchedProduct) {
    for (const [key, raw] of Object.entries(value)) {
      const price = parsePrice(raw);
      if (price == null) continue;
      const keyBonus = PRICE_KEY_PATTERN.test(key) ? 180 : 0;
      const pathBonus = PRICE_KEY_PATTERN.test(pathParts.join(".")) ? 80 : 0;
      out.push({
        price,
        product: matchedProduct,
        score: 700 + keyBonus + pathBonus,
        excerpt: `${pathParts.join(".")}.${key}=${String(raw)}`
      });
    }
  }

  for (const [key, child] of Object.entries(value)) {
    extractJsonCandidates(child, products, [...pathParts, key], depth + 1, out);
  }
  return out;
}

function tryParseJson(text) {
  const clean = String(text ?? "").trim();
  if (!clean || (!clean.startsWith("{") && !clean.startsWith("["))) return null;
  try { return JSON.parse(clean); } catch { return null; }
}

async function fileExists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function findAppDirectory() {
  const preferred = [
    ROOT,
    path.join(ROOT, "servis_yonetim_sistemi_v4_23_pwa"),
    path.join(ROOT, "servis_yonetim_sistemi_v4_24_pwa")
  ];

  for (const directory of preferred) {
    const indexPath = path.join(directory, "index.html");
    if (!await fileExists(indexPath)) continue;
    const html = await readFile(indexPath, "utf8");
    if (/Servis Yönetim Sistemi|SYS_V1_PERSONEL_SERVISI/i.test(html)) return directory;
  }

  const queue = [{ directory: ROOT, depth: 0 }];
  while (queue.length) {
    const { directory, depth } = queue.shift();
    if (depth > 3) continue;
    let entries = [];
    try { entries = await readdir(directory, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      if (!entry.isDirectory() || [".git", "node_modules", ".github"].includes(entry.name)) continue;
      const child = path.join(directory, entry.name);
      const indexPath = path.join(child, "index.html");
      if (await fileExists(indexPath)) {
        const html = await readFile(indexPath, "utf8");
        if (/Servis Yönetim Sistemi|SYS_V1_PERSONEL_SERVISI/i.test(html)) return child;
      }
      queue.push({ directory: child, depth: depth + 1 });
    }
  }
  throw new Error("Servis Yönetim Sistemi index.html dosyası bulunamadı.");
}

async function loadPrevious(outputPath) {
  try {
    const parsed = JSON.parse(await readFile(outputPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}

async function acceptCookies(page) {
  for (const expression of [/tümünü kabul et/i, /tüm tanımlama bilgilerini kabul et/i, /kabul et/i, /accept all/i]) {
    try {
      const button = page.getByRole("button", { name: expression }).first();
      if (await button.isVisible({ timeout: 1500 })) {
        await button.click({ timeout: 3000 });
        await page.waitForTimeout(800);
        return;
      }
    } catch {}
  }
}

async function chooseIstanbulEurope(page) {
  const selects = page.locator("select");
  const count = await selects.count();
  for (let i = 0; i < count; i += 1) {
    const select = selects.nth(i);
    let options = [];
    try { options = await select.locator("option").allTextContents(); } catch { continue; }
    const targetIndex = options.findIndex((text) => /istanbul\s*avrupa|avrupa\s*yakası/i.test(text));
    const fallbackIndex = options.findIndex((text) => /istanbul/i.test(text));
    const optionIndex = targetIndex >= 0 ? targetIndex : fallbackIndex;
    if (optionIndex < 0) continue;
    try {
      const optionValue = await select.locator("option").nth(optionIndex).getAttribute("value");
      if (optionValue != null) await select.selectOption(optionValue);
      else await select.selectOption({ index: optionIndex });
      await page.waitForTimeout(3000);
    } catch {}
  }

  for (const expression of [/istanbul\s*avrupa/i, /avrupa\s*yakası/i]) {
    try {
      const candidate = page.getByText(expression, { exact: false }).first();
      if (await candidate.isVisible({ timeout: 1500 })) {
        await candidate.click({ timeout: 3000 });
        await page.waitForTimeout(3000);
      }
    } catch {}
  }
}

async function collectFrameTexts(page) {
  const texts = [];
  for (const frame of page.frames()) {
    try {
      const bodyText = await frame.locator("body").innerText({ timeout: 8000 });
      if (bodyText) texts.push(bodyText);
    } catch {}
    try {
      const html = await frame.content();
      if (html) texts.push(html);
    } catch {}
  }
  return texts;
}

async function collectNearbyDomTexts(page) {
  const texts = [];
  for (const frame of page.frames()) {
    try {
      const locators = frame.locator("text=/motorin|diesel|fuelsave|ultra force|eco force/i");
      const count = Math.min(await locators.count(), 40);
      for (let i = 0; i < count; i += 1) {
        const item = locators.nth(i);
        for (const selector of ["xpath=..", "xpath=../..", "xpath=../../..", "xpath=../../../.."] ) {
          try {
            const text = await item.locator(selector).innerText({ timeout: 1200 });
            if (text) texts.push(text);
          } catch {}
        }
      }
    } catch {}
  }
  return texts;
}

async function scrapeSource(browser, config) {
  const context = await browser.newContext({
    locale: "tr-TR",
    timezoneId: "Europe/Istanbul",
    viewport: { width: 1440, height: 1600 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();
  const texts = [];
  const jsonValues = [];
  const responseJobs = [];
  const responseUrls = new Set();

  page.on("response", (response) => {
    const job = (async () => {
      try {
        const status = response.status();
        if (status < 200 || status >= 400) return;
        const headers = response.headers();
        const contentType = headers["content-type"] || "";
        const contentLength = Number(headers["content-length"] || 0);
        const responseUrl = response.url();
        const interestingUrl = /fuel|price|fiyat|akaryakit|diesel|motorin|product|station|api/i.test(responseUrl);
        const interestingType = /json|text|javascript|html/i.test(contentType);
        if (!interestingUrl && !interestingType) return;
        if (contentLength && contentLength > MAX_RESPONSE_BYTES) return;
        responseUrls.add(responseUrl);
        const body = await response.text();
        if (!body || body.length > MAX_RESPONSE_BYTES) return;
        texts.push(body);
        const parsed = tryParseJson(body);
        if (parsed) jsonValues.push(parsed);
      } catch {}
    })();
    responseJobs.push(job);
  });

  try {
    await page.goto(config.url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(5000);
    await acceptCookies(page);
    await chooseIstanbulEurope(page);

    for (let y = 0; y <= 4; y += 1) {
      try { await page.evaluate((factor) => window.scrollTo(0, document.body.scrollHeight * factor), y / 4); } catch {}
      await page.waitForTimeout(800);
    }

    try { await page.waitForLoadState("networkidle", { timeout: 20_000 }); } catch {}
    await page.waitForTimeout(5000);
    await Promise.allSettled(responseJobs);

    texts.push(...await collectFrameTexts(page));
    texts.push(...await collectNearbyDomTexts(page));

    const candidates = [];
    for (const text of texts) {
      const found = findPriceNearProduct(text, config.products, 0);
      if (found) candidates.push(found);
      const parsed = tryParseJson(text);
      if (parsed) jsonValues.push(parsed);
    }
    for (const jsonValue of jsonValues) {
      extractJsonCandidates(jsonValue, config.products, [], 0, candidates);
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0] || null;

    console.log(`${config.brand} incelenen yanıt sayısı: ${responseUrls.size}`);
    [...responseUrls].slice(0, 30).forEach((url) => console.log(`${config.brand} yanıt: ${url}`));

    if (!best) {
      const diagnostic = texts
        .map(normalizeText)
        .filter((t) => PRODUCT_PATTERN.test(t))
        .slice(0, 5)
        .map((t) => t.slice(0, 500));
      diagnostic.forEach((text, i) => console.log(`${config.brand} tanı metni ${i + 1}: ${text}`));
      throw new Error(`${config.brand} sayfasında motorin ürünü yanında geçerli fiyat bulunamadı.`);
    }

    console.log(`${config.brand}: ${best.product} = ${best.price.toFixed(2)} TL`);
    console.log(`${config.brand} kanıt: ${normalizeText(best.excerpt).slice(0, 350)}`);
    return { price: best.price, product: best.product, officialUrl: config.url };
  } finally {
    await context.close();
  }
}

function validPreviousPrice(value) {
  const parsed = parsePrice(value);
  return parsed == null ? null : parsed;
}

async function main() {
  const appDirectory = await findAppDirectory();
  const outputPath = path.join(appDirectory, "fuel-prices.json");
  const outputRelative = path.relative(ROOT, outputPath).split(path.sep).join("/");
  const previous = await loadPrevious(outputPath);
  const browser = await chromium.launch({ headless: true });
  const results = {};
  const errors = {};

  try {
    for (const [key, config] of Object.entries(SOURCES)) {
      try { results[key] = await scrapeSource(browser, config); }
      catch (error) {
        errors[key] = error instanceof Error ? error.message : String(error);
        console.error(`${config.brand} alınamadı: ${errors[key]}`);
      }
    }
  } finally {
    await browser.close();
  }

  const shellPrice = results.shell?.price ?? validPreviousPrice(previous.shell?.diesel ?? previous.shell);
  const opetPrice = results.opet?.price ?? validPreviousPrice(previous.opet?.diesel ?? previous.opet);

  if (shellPrice == null && opetPrice == null) {
    throw new Error("Shell ve OPET fiyatlarının ikisi de alınamadı; eski geçerli kayıt da bulunmuyor.");
  }

  const now = new Date().toISOString();
  const payload = {
    region: REGION,
    updatedAt: (results.shell || results.opet) ? now : (previous.updatedAt || null),
    lastAttemptAt: now,
    source: "GitHub Actions · Resmî Shell/OPET sayfaları",
    status: Object.keys(errors).length ? "partial" : "ok",
    shell: {
      diesel: shellPrice,
      product: results.shell?.product || previous.shell?.product || "Shell Motorin",
      updated: Boolean(results.shell),
      officialUrl: SOURCES.shell.url
    },
    opet: {
      diesel: opetPrice,
      product: results.opet?.product || previous.opet?.product || "OPET Motorin",
      updated: Boolean(results.opet),
      officialUrl: SOURCES.opet.url
    },
    errors
  };

  await mkdir(appDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(path.join(ROOT, ".fuel-output-path"), `${outputRelative}\n`, "utf8");
  console.log(`Yakıt JSON dosyası yazıldı: ${outputRelative}`);
  console.log(JSON.stringify(payload, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
