import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGION = "İstanbul Avrupa";
const TARGET = "https://www.doviz.com/akaryakit-fiyatlari";

function normalizeFuelText(text) {
  return String(text || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?(?:tr|p|div|li|section|article|br|table|thead|tbody)[^>]*>/gi, "\n")
    .replace(/<\/?(?:td|th)[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8378;|&8378;/gi, "₺")
    .replace(/\u00a0/g, " ")
    .replace(/[\t ]+/g, " ");
}

function parseFuelBrandLine(text, brand) {
  const lines = normalizeFuelText(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const brandRx = new RegExp(`\\b${brand}\\b`, "i");

  for (let i = 0; i < lines.length; i += 1) {
    if (!brandRx.test(lines[i])) continue;

    const segments = [
      lines[i],
      lines.slice(i, Math.min(lines.length, i + 2)).join(" | ")
    ];

    for (const segment of segments) {
      const numbers = [...segment.matchAll(/(?:₺|TL(?:\/LT)?\s*)?(\d{2,3}[.,]\d{2})/gi)]
        .map((match) => Number(match[1].replace(",", ".")))
        .filter((value) => Number.isFinite(value) && value >= 20 && value <= 200);

      const date = (segment.match(/\b(\d{2}[.\/-]\d{2}[.\/-]\d{4})\b/) || [])[1];

      // Doviz.com tablo sırası: Benzin, Motorin, LPG, Tarih.
      if (numbers.length >= 2) {
        return {
          diesel: Math.round(numbers[1] * 100) / 100,
          date: date || null,
          evidence: segment.slice(0, 400)
        };
      }
    }
  }

  return null;
}

function fuelDateToIso(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = String(value).match(/^(\d{2})[.\/-](\d{2})[.\/-](\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function ageDays(isoDate) {
  if (!isoDate) return Infinity;
  const date = new Date(`${isoDate}T00:00:00+03:00`);
  if (Number.isNaN(date.getTime())) return Infinity;
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

async function fetchText(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "Accept": "text/html,text/plain,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
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
  } catch {
    return {};
  }
}

function previousPrice(previous, brand) {
  const value = previous?.[brand]?.diesel ?? previous?.[brand];
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 20 && parsed <= 200
    ? Math.round(parsed * 100) / 100
    : null;
}

async function collectPrices() {
  const stamp = Date.now();
  const endpoints = [
    TARGET,
    `https://r.jina.ai/http://www.doviz.com/akaryakit-fiyatlari?fresh=${stamp}`,
    `https://r.jina.ai/https://www.doviz.com/akaryakit-fiyatlari?fresh=${stamp}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`${TARGET}?fresh=${stamp}`)}`
  ];

  const errors = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Kaynak deneniyor: ${endpoint}`);
      const text = await fetchText(endpoint);
      const shell = parseFuelBrandLine(text, "Shell");
      const opet = parseFuelBrandLine(text, "Opet");

      if (!shell || !opet) {
        throw new Error("Shell veya OPET marka satırı çözümlenemedi.");
      }

      const priceDate = fuelDateToIso(opet.date || shell.date);
      if (!priceDate) throw new Error("Fiyat tarihi bulunamadı.");
      if (ageDays(priceDate) > 7) throw new Error(`Kaynak tarihi eski: ${priceDate}`);

      console.log(`Shell motorin: ${shell.diesel.toFixed(2)} TL`);
      console.log(`OPET motorin: ${opet.diesel.toFixed(2)} TL`);
      console.log(`Fiyat tarihi: ${priceDate}`);

      return { shell, opet, priceDate, endpoint };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${endpoint} → ${message}`);
      console.warn(`Kaynak başarısız: ${message}`);
    }
  }

  throw new Error(`Doviz.com fiyatları alınamadı.\n${errors.join("\n")}`);
}

async function main() {
  const appDirectory = await findAppDirectory();
  const outputPath = path.join(appDirectory, "fuel-prices.json");
  const outputRelative = path.relative(ROOT, outputPath).split(path.sep).join("/");
  const previous = await loadPrevious(outputPath);
  const now = new Date().toISOString();

  let result = null;
  let errorMessage = "";

  try {
    result = await collectPrices();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
    console.error(errorMessage);
  }

  const shellPrice = result?.shell?.diesel ?? previousPrice(previous, "shell");
  const opetPrice = result?.opet?.diesel ?? previousPrice(previous, "opet");

  if (shellPrice == null && opetPrice == null) {
    throw new Error("Shell ve OPET fiyatları alınamadı; korunacak eski geçerli kayıt da yok.");
  }

  const payload = {
    region: REGION,
    updatedAt: result ? now : (previous.updatedAt || null),
    lastAttemptAt: now,
    priceDate: result?.priceDate || previous.priceDate || null,
    source: result
      ? "Doviz.com dağıtıcı tablosu"
      : (previous.source || "Son geçerli kayıt"),
    sourceUrl: TARGET,
    status: result ? "ok" : "cached",
    shell: {
      diesel: shellPrice,
      product: "Shell Motorin",
      updated: Boolean(result?.shell),
      officialUrl: "https://www.shell.com.tr/suruculer/shell-yakitlari/akaryakit-pompa-satis-fiyatlari.html"
    },
    opet: {
      diesel: opetPrice,
      product: "OPET Motorin",
      updated: Boolean(result?.opet),
      officialUrl: "https://www.opet.com.tr/akaryakit-fiyatlari/istanbul-avrupa"
    },
    errors: errorMessage ? { doviz: errorMessage } : {}
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
