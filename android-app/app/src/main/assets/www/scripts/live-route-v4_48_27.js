(function () {
  "use strict";

  if (window.__SYS_LIVE_ROUTE_V44824__) return;
  window.__SYS_LIVE_ROUTE_V44824__ = true;

  const ROUTE_ENDPOINT = "https://router.project-osrm.org/route/v1/driving";
  const REFRESH_MS = 15000;
  let latestPosition = null;
  let lastRequestAt = 0;
  let lastRouteKey = "";
  let routeResult = null;
  let routeState = "Konum izni bekleniyor";
  let requestSerial = 0;
  let currentContext = null;
  let activated = false;
  let watchId = null;
  let requestedPanel = "";

  function parseCoordinate(value) {
    const text = String(value || "").trim();
    if (!text) return null;
    const decoded = (() => { try { return decodeURIComponent(text); } catch (_) { return text; } })();
    const patterns = [
      /@(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/,
      /[?&](?:query|q|destination)=(-?\d{1,2}(?:\.\d+)?)(?:%2C|,|\s)+(-?\d{1,3}(?:\.\d+)?)/i,
      /!3d(-?\d{1,2}(?:\.\d+))!4d(-?\d{1,3}(?:\.\d+))/,
      /(?:geo:)?\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)/i
    ];
    for (const pattern of patterns) {
      const match = decoded.match(pattern);
      if (!match) continue;
      const lat = Number(match[1]);
      const lon = Number(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) return { lat, lon };
    }
    return null;
  }

  function passengerTarget(context) {
    const passenger = context?.current;
    if (!passenger) return null;
    const values = context.kind === "school"
      ? [passenger.mapQuery, passenger.homeAddress]
      : context.period === "evening"
        ? [passenger.eveningMapQuery, passenger.eveningAddress, passenger.stop]
        : [passenger.morningMapQuery, passenger.morningAddress, passenger.stop];
    for (const value of values) {
      const point = parseCoordinate(value);
      if (point) return { ...point, passengerId: String(passenger.id || ""), name: String(passenger.name || "Yolcu") };
    }
    return null;
  }

  function activeContext() {
    try { return driverContext(); } catch (_) { return null; }
  }

  function panelContext(kind) {
    try { return kind === "school" ? driverSchoolContext() : driverPersonnelContext(); } catch (_) { return null; }
  }

  function formatDistance(meters) {
    if (!Number.isFinite(meters)) return "—";
    if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)} m`;
    return `${(meters / 1000).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
  }

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds)) return "—";
    const minutes = Math.max(1, Math.round(seconds / 60));
    if (minutes < 60) return `${minutes} dk`;
    const hours = Math.floor(minutes / 60);
    return `${hours} sa ${minutes % 60} dk`;
  }

  async function requestRoute(context, force) {
    const target = passengerTarget(context);
    if (!target) {
      routeResult = null;
      routeState = context?.current ? "Yolcu kartında geçerli koordinat yok" : "Aktif yolcu bekleniyor";
      renderMetrics();
      return;
    }
    if (!latestPosition) {
      routeState = "Tablet GPS konumu bekleniyor";
      renderMetrics();
      return;
    }
    const origin = latestPosition.coords;
    const key = `${target.passengerId}:${origin.latitude.toFixed(4)},${origin.longitude.toFixed(4)}:${target.lat.toFixed(5)},${target.lon.toFixed(5)}`;
    if (!force && key === lastRouteKey && Date.now() - lastRequestAt < REFRESH_MS) return;
    lastRouteKey = key;
    lastRequestAt = Date.now();
    const serial = ++requestSerial;
    routeState = "Gerçek yol güzergâhı hesaplanıyor";
    renderMetrics();
    try {
      const url = `${ROUTE_ENDPOINT}/${origin.longitude},${origin.latitude};${target.lon},${target.lat}?overview=false&steps=false`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Rota servisi ${response.status}`);
      const payload = await response.json();
      const route = payload?.routes?.[0];
      if (!route || !Number.isFinite(Number(route.distance)) || !Number.isFinite(Number(route.duration))) throw new Error("Rota bulunamadı");
      if (serial !== requestSerial) return;
      routeResult = { distance: Number(route.distance), duration: Number(route.duration), target, updatedAt: Date.now(), accuracy: Number(origin.accuracy || 0) };
      routeState = "Canlı GPS · gerçek karayolu rotası";
    } catch (error) {
      if (serial !== requestSerial) return;
      routeResult = null;
      routeState = navigator.onLine ? "Rota hesaplanamadı · tekrar deneyin" : "İnternet bağlantısı yok";
      console.warn("Canlı rota hesaplanamadı:", error);
    }
    renderMetrics();
  }

  function metricHtml(compact, panel, display) {
    const result = display?.result ?? routeResult;
    const state = display?.state ?? routeState;
    const distance = result ? formatDistance(result.distance) : "—";
    const duration = result ? formatDuration(result.duration) : "—";
    const updated = result ? new Date(result.updatedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "";
    return `<div class="sys-live-route ${compact ? "compact" : ""}">
      <div class="sys-live-route-value"><small>Yolcuya Kalan</small><strong>${distance}</strong></div>
      <div class="sys-live-route-value"><small>Tahmini Varış</small><strong>${duration}</strong></div>
      <div class="sys-live-route-state"><span class="sys-live-route-dot"></span><span>${state}${updated ? ` · ${updated}` : ""}</span></div>
      <button class="sys-live-route-refresh" type="button" data-live-route-refresh${panel ? ` data-live-route-panel="${panel}"` : ""}>GPS / Rotayı Yenile</button>
    </div>`;
  }

  function renderMetrics() {
    const driverCard = document.querySelector("#driverCurrentHost .driver-current-card");
    if (driverCard) {
      let host = driverCard.querySelector(".sys-live-route-host");
      if (!host) {
        host = document.createElement("div");
        host.className = "sys-live-route-host";
        driverCard.appendChild(host);
      }
      const html = metricHtml(false, currentContext?.kind || "");
      if (host.innerHTML !== html) host.innerHTML = html;
    }
    ["personnel", "school"].forEach((panel) => {
      const card = document.getElementById(panel === "personnel" ? "commandPersonnelNext" : "commandSchoolNext");
      if (!card) return;
      let host = card.querySelector(".sys-live-route-host");
      if (!host) {
        host = document.createElement("div");
        host.className = "sys-live-route-host";
        card.appendChild(host);
      }
      const context = panelContext(panel);
      const isCurrent = currentContext?.kind === panel;
      const inactiveState = context?.current ? "GPS / Rotayı Yenile ile hesaplayın" : "Aktif yolcu bekleniyor";
      const html = metricHtml(true, panel, isCurrent ? null : { result: null, state: inactiveState });
      if (host.innerHTML !== html) host.innerHTML = html;
    });
  }

  function removeExternalNavigation() {
    document.querySelectorAll("#screen-command #commandOpenFuelJobsBtn, #screen-command #commandOpenSettingsFuelBtn, #screen-command button[data-action$='details'], #screen-driver button[data-driver-action='map'], #screen-driver button[data-driver-action='ordered-map']").forEach((element) => element.remove());
    document.querySelectorAll("#commandPersonnelCard > .command-card-summary, #commandSchoolCard > .command-card-summary").forEach((element) => {
      element.removeAttribute("data-action");
      element.removeAttribute("aria-label");
      element.classList.add("sys-panel-static");
    });
    ["commandPersonnelNext", "commandSchoolNext"].forEach((id) => {
      const card = document.getElementById(id);
      if (!card) return;
      card.removeAttribute("data-action");
      card.removeAttribute("role");
      card.removeAttribute("tabindex");
      card.removeAttribute("aria-label");
    });
  }

  function refresh(force, panel) {
    if (!activated) return;
    removeExternalNavigation();
    if (panel) requestedPanel = panel;
    currentContext = requestedPanel ? panelContext(requestedPanel) : activeContext();
    requestRoute(currentContext, Boolean(force));
    renderMetrics();
  }

  function startGps(force) {
    if (!navigator.geolocation) {
      routeState = "Bu cihaz GPS konumu sunmuyor";
      renderMetrics();
      return;
    }
    if (force && watchId !== null && navigator.geolocation.clearWatch) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (watchId !== null) return;
    if (force) {
      latestPosition = null;
      routeResult = null;
      routeState = "GPS yeniden başlatılıyor";
      renderMetrics();
    }
    watchId = navigator.geolocation.watchPosition((position) => {
      latestPosition = position;
      routeState = "GPS alındı · rota hazırlanıyor";
      refresh(false);
    }, (error) => {
      latestPosition = null;
      routeResult = null;
      routeState = error?.code === 1 ? "Konum izni verilmedi" : "GPS sinyali alınamıyor";
      renderMetrics();
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
  }

  function installStyle() {
    const style = document.createElement("style");
    style.id = "sys-live-route-v44827-style";
    style.textContent = `
      .sys-live-route-host{grid-column:1/-1;width:100%;margin-top:9px}
      .sys-live-route{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:10px;border:1px solid rgba(56,189,248,.28);border-radius:14px;background:linear-gradient(135deg,rgba(14,165,233,.10),rgba(15,23,42,.38))}
      .sys-live-route-value{padding:9px 11px;border-radius:11px;background:rgba(2,6,23,.32);text-align:center}
      .sys-live-route-value small{display:block;color:var(--muted);font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.07em}
      .sys-live-route-value strong{display:block;margin-top:4px;font-size:clamp(18px,2vw,28px);line-height:1;color:var(--text);font-variant-numeric:tabular-nums}
      .sys-live-route-state{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:6px;min-height:20px;color:var(--muted);font-size:10px;text-align:center}
      .sys-live-route-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px rgba(34,197,94,.7)}
      .sys-live-route-refresh{grid-column:1/-1;min-height:34px;border:1px solid rgba(56,189,248,.34);border-radius:10px;background:rgba(14,165,233,.12);color:#dff6ff;font:800 10px inherit;cursor:pointer}
      .sys-live-route.compact{padding:7px;gap:6px}
      .sys-live-route.compact .sys-live-route-value{padding:6px 8px}
      .sys-live-route.compact .sys-live-route-value strong{font-size:16px}
      .sys-live-route.compact .sys-live-route-refresh{min-height:28px}
      #screen-command .command-next-passenger{cursor:default!important}
      @media(max-width:760px){.sys-live-route{grid-template-columns:1fr}.sys-live-route-state,.sys-live-route-refresh{grid-column:1}}
    `;
    document.head.appendChild(style);
  }

  window.SYSLiveRoute = Object.freeze({
    version: "4.48.27",
    parseCoordinate,
    refresh: () => { startGps(true); refresh(true); },
    status: () => ({ hasGps: Boolean(latestPosition), routeState, routeResult })
  });

  document.addEventListener("click", (event) => {
    const refreshButton = event.target.closest("[data-live-route-refresh]");
    if (refreshButton) {
      event.preventDefault();
      event.stopPropagation();
      const panel = refreshButton.dataset.liveRoutePanel || "";
      startGps(true);
      refresh(true, panel);
    }
  }, true);

  function activate() {
    if (activated) return;
    activated = true;
    startGps();
    let pendingRender = 0;
    const observer = new MutationObserver(() => {
      if (pendingRender) return;
      pendingRender = window.setTimeout(() => {
        pendingRender = 0;
        removeExternalNavigation();
        renderMetrics();
      }, 50);
    });
    [document.getElementById("screen-command"), document.getElementById("screen-driver")].filter(Boolean).forEach((screen) => observer.observe(screen, { childList: true, subtree: true }));
    setInterval(() => refresh(false), REFRESH_MS);
    setTimeout(() => refresh(false), 300);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) startGps(true);
    });
  }

  function boot() {
    installStyle();
    const gate = document.getElementById("licenseGate");
    if (!gate || gate.classList.contains("hidden")) {
      activate();
      return;
    }
    const gateObserver = new MutationObserver(() => {
      if (!gate.classList.contains("hidden")) return;
      gateObserver.disconnect();
      activate();
    });
    gateObserver.observe(gate, { attributes: true, attributeFilter: ["class"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
