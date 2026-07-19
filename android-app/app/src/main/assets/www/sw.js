"use strict";

const CACHE_NAME = "servis-sys-v4-46-9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192-v50.png",
  "./icons/icon-512-v50.png",
  "./icons/sys-logo-v50.png",
  "./icons/sys-logo-splash-4k.png",
  "./icons/shell-logo.png",
  "./fuel-prices.json"
];

async function fetchWithTimeout(request, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function cacheShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(APP_SHELL.map(async (url) => {
    try {
      const response = await fetchWithTimeout(new Request(url, { cache: "reload" }), {}, 10000);
      if (response.ok) await cache.put(url, response.clone());
    } catch {
      // Tek bir ikon veya ağ gecikmesi Service Worker kurulumunu tamamen bozmasın.
    }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isFuelPriceFile = isSameOrigin && requestUrl.pathname.endsWith("/fuel-prices.json");

  if (isFuelPriceFile) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match("./fuel-prices.json");
      try {
        const fresh = await fetchWithTimeout(request, { cache: "no-store" }, 7000);
        if (!fresh.ok) throw new Error(`HTTP ${fresh.status}`);
        await cache.put("./fuel-prices.json", fresh.clone());
        return fresh;
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = (await cache.match("./index.html")) || (await caches.match(request));

      // Kayıtlı uygulama varsa açılış anında onu ver; ağ güncellemesini arka planda yap.
      if (cached) {
        event.waitUntil((async () => {
          try {
            const fresh = await fetchWithTimeout(request, { cache: "no-store" }, 7000);
            if (fresh.ok) await cache.put("./index.html", fresh.clone());
          } catch {
            // Ağ yoksa mevcut güvenli kopya kullanılmaya devam eder.
          }
        })());
        return cached;
      }

      // İlk kurulumda da ağ sonsuza kadar beklenmez.
      try {
        const fresh = await fetchWithTimeout(request, { cache: "no-store" }, 10000);
        if (!fresh.ok) throw new Error(`HTTP ${fresh.status}`);
        await cache.put("./index.html", fresh.clone());
        return fresh;
      } catch {
        return new Response(
          "<!doctype html><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>body{margin:0;background:#08090d;color:#fff;font:16px system-ui;display:grid;place-items:center;min-height:100vh}.box{max-width:520px;padding:28px;border:1px solid #29424a;border-radius:18px;background:#122026}button{padding:12px 18px;border:0;border-radius:10px;font-weight:700}</style><div class='box'><h2>Uygulama açılamadı</h2><p>İlk kurulum dosyaları henüz indirilemedi. İnternet bağlantısını kontrol edip tekrar deneyin.</p><button onclick='location.reload()'>Tekrar Dene</button></div>",
          { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetchWithTimeout(request, {}, 8000);
      if (isSameOrigin && fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, fresh.clone());
      }
      return fresh;
    } catch {
      return Response.error();
    }
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data?.type === "REFRESH_CACHE") {
    event.waitUntil((async () => {
      await caches.delete(CACHE_NAME);
      await cacheShell();
    })());
  }
});
