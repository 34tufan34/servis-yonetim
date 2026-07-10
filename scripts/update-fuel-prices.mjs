import { chromium } from "playwright";
import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGION = "İstanbul Avrupa";
const SOURCES = {
  shell: {
    brand: "Shell",
    url: "https://www.shell.com.tr/suruculer/shell-yakitlari/akaryakit-pompa-satis-fiyatlari.html",
    products: [
      "Shell FuelSave Motorin",
      "Shell FuelSave Diesel",
      "FuelSave Motorin",
      "FuelSave Diesel",
      "Shell V-Power Diesel",
      "V-Power Diesel",
      "V-Power Motorin"
    ]
  },
  opet: {
    brand: "OPET",
    url: "https://www.opet.com.tr/akaryakit-fiyatlari/istanbul-avrupa",
    products: [
      "Ultra Force Motorin",
      "Eco Force Motorin",
      "Ultra Euro Diesel",
      "OPET Motorin"
    ]
  }
};

const MAX_RESPONSE_BYTES = 2_000_000;
const PRICE_PATTERN = /(?:₺|TL|TRY)?\s*([1-9]\d{1,2}[.,]\d{1,3})\s*(?:₺|TL|TRY)?/giu;

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trLower(value) {
  return normalizeText(value).toLocaleLowerCase("tr-TR");
}

function parsePrice(value) {
  const number = Number(String(value).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(number) || number < 20 || number > 250) return null;
  return Math.round(number * 100) / 100;
}

function findPriceNearProduct(text, products) {
  const clean = normalizeText(text);
  const lower = trLower(clean);
  let best = null;

  products.forEach((product, productIndex) => {
    const needle = trLower(product);
    let productIndexInText = lower.indexOf(needle);

    while (productIndexInText >= 0) {
      const start = Math.max(0, productIndexInText - 220);
      const end = Math.min(clean.length, productIndexInText + needle.length + 420);
      const windowText = clean.slice(start, end);
      const productOffset = productIndexInText - start;

      for (const match of windowText.matchAll(PRICE_PATTERN)) {
        const price = parsePrice(match[1]);
        if (price == null) continue;

        const matchOffset = match.index ?? 0;
        const distance = Math.abs(matchOffset - productOffset);
        const currencyBonus = /₺|\bTL\b|\bTRY\b/i.test(match[0]) ? 30 : 0;
        const afterBonus = matchOffset >= productOffset ? 12 : 0;
        const priorityBonus = Math.max(0, 50 - productIndex * 7);
        const score = 200 - Math.min(distance, 200) + currencyBonus + afterBonus + priorityBonus;

        if (!best || score > best.score) {
          best = { price, product, score, excerpt: windowText.slice(Math.max(0, matchOffset - 90), matchOffset + 110) };
        }
      }

      productIndexInText = lower.indexOf(needle, productIndexInText + needle.length);
    }
  });

  return best;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
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
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if ([".git", "node_modules", ".github"].includes(entry.name)) continue;
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
  } catch {
    return {};
  }
}

async function acceptCookies(page) {
  const expressions = [
    /tümünü kabul et/i,
    /tüm tanımlama bilgilerini kabul et/i,
    /kabul et/i,
    /accept all/i
  ];

  for (const expression of expressions) {
    try {
      const button = page.getByRole("button", { name: expression }).first();
      if (await button.isVisible({ timeout: 1200 })) {
        await button.click({ timeout: 2500 });
        await page.waitForTimeout(700);
        return;
      }
    } catch {
      // Çerez penceresi her zaman görünmeyebilir.
    }
  }
}

async function chooseIstanbulEurope(page) {
  // Önce standart select alanlarını dene.
  const selects = page.locator("select");
  const selectCount = await selects.count();
  for (let i = 0; i < selectCount; i += 1) {
    const select = selects.nth(i);
    let options = [];
    try {
      options = await select.locator("option").allTextContents();
    } catch {
      continue;
    }

    const targetIndex = options.findIndex((text) => /istanbul\s*avrupa/i.test(text));
    const fallbackIndex = options.findIndex((text) => /istanbul/i.test(text));
    const optionIndex = targetIndex >= 0 ? targetIndex : fallbackIndex;
    if (optionIndex < 0) continue;

    try {
      const optionValue = await select.locator("option").nth(optionIndex).getAttribute("value");
      if (optionValue != null) await select.selectOption(optionValue);
      else await select.selectOption({ index: optionIndex });
      await page.waitForTimeout(2500);
    } catch {
      // Özel tasarımlı seçim kutularında select işlemi başarısız olabilir.
    }
  }

  // Özel açılır menü veya buton metinlerini dene.
  for (const expression of [/istanbul\s*avrupa/i, /avrupa\s*yakası/i]) {
    try {
      const candidate = page.getByText(expression, { exact: false }).first();
      if (await candidate.isVisible({ timeout: 1200 })) {
        await candidate.click({ timeout: 2500 });
        await page.waitForTimeout(2500);
      }
    } catch {
      // Metin tıklanabilir olmayabilir.
    }
  }
}

async function scrapeSource(browser, config) {
  const context = await browser.newContext({
    locale: "tr-TR",
    timezoneId: "Europe/Istanbul",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
  });
  const page = await context.newPage();
  const texts = [];
  const responseJobs = [];

  page.on("response", (response) => {
    const job = (async () => {
      try {
        if (response.status() < 200 || response.status() >= 300) return;
        const headers = response.headers();
        const contentType = headers["content-type"] || "";
        const contentLength = Number(headers["content-length"] || 0);
        const responseUrl = response.url();
        const interestingUrl = /fuel|price|fiyat|akaryakit|diesel|motorin|product|station/i.test(responseUrl);
        const interestingType = /json|text|javascript|html/i.test(contentType);
        if (!interestingUrl && !interestingType) return;
        if (contentLength && contentLength > MAX_RESPONSE_BYTES) return;
        const body = await response.text();
        if (body.length <= MAX_RESPONSE_BYTES) texts.push(body);
      } catch {
        // Bazı cevap gövdeleri tarayıcı tarafından erişime kapalı olabilir.
      }
    })();
    responseJobs.push(job);
  });

  try {
    await page.goto(config.url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(4500);
    await acceptCookies(page);
    await chooseIstanbulEurope(page);

    try {
      await page.waitForLoadState("networkidle", { timeout: 15_000 });
    } catch {
      // Sürekli ağ isteği yapan sayfalarda networkidle oluşmayabilir.
    }
    await page.waitForTimeout(3500);

    texts.push(await page.locator("body").innerText({ timeout: 15_000 }));
    texts.push(await page.content());
    await Promise.allSettled(responseJobs);

    let best = null;
    for (const text of texts) {
      const found = findPriceNearProduct(text, config.products);
      if (found && (!best || found.score > best.score)) best = found;
    }

    if (!best) {
      throw new Error(`${config.brand} sayfasında motorin ürünü yanında geçerli fiyat bulunamadı.`);
    }

    console.log(`${config.brand}: ${best.product} = ${best.price.toFixed(2)} TL`);
    return {
      price: best.price,
      product: best.product,
      officialUrl: config.url
    };
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
      try {
        results[key] = await scrapeSource(browser, config);
      } catch (error) {
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
  const hasFreshValue = Boolean(results.shell || results.opet);
  const payload = {
    region: REGION,
    updatedAt: hasFreshValue ? now : (previous.updatedAt || null),
    lastAttemptAt: now,
    source: "GitHub Actions · Resmî Shell/OPET sayfaları",
    status: Object.keys(errors).length ? "partial" : "ok",
    shell: {
      diesel: shellPrice,
      product: results.shell?.product || previous.shell?.product || "Shell FuelSave Motorin",
      updated: Boolean(results.shell),
      officialUrl: SOURCES.shell.url
    },
    opet: {
      diesel: opetPrice,
      product: results.opet?.product || previous.opet?.product || "OPET Ultra Force Motorin",
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
