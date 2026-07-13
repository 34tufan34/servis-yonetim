"use strict";

const CACHE_NAME = "servis-sys-v4-46-3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/shell-logo.png"
];

async function cacheShell() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" })));
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
  const isFuelPriceFile = requestUrl.origin === self.location.origin && requestUrl.pathname.endsWith("/fuel-prices.json");

  if (isFuelPriceFile) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const fresh = await fetch(request, { cache: "no-store" });
        if (!fresh.ok) throw new Error(`HTTP ${fresh.status}`);
        await cache.put("./fuel-prices.json", fresh.clone());
        return fresh;
      } catch {
        return (await cache.match("./fuel-prices.json")) || Response.error();
      }
    })());
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: "no-store" });
        const cache = await caches.open(CACHE_NAME);
        await cache.put("./index.html", fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match("./index.html"));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (requestUrl.origin === self.location.origin) {
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
