(function () {
  "use strict";

  if (window.__SYS_V44816_SETTINGS_COMMAND_FIX__) return;
  window.__SYS_V44816_SETTINGS_COMMAND_FIX__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const STABLE_BRANCH = "sys-ai-test-v4-48-12-eski-panel";
  const REPOSITORY = "34tufan34/servis-yonetim";

  function installStyles() {
    if ($("#sysV44815SettingsCommandStyles")) return;
    const style = document.createElement("style");
    style.id = "sysV44815SettingsCommandStyles";
    style.textContent = `
      /* Ayarlar başlıkları ve sekmeleri: Türkçe karakterler kesilmesin. */
      #screen-settings.sys-settings-redesign .sys-settings-hero {
        overflow: visible !important;
      }
      #screen-settings.sys-settings-redesign .sys-settings-hero h1 {
        line-height: 1.16 !important;
        padding: 2px 0 5px !important;
        overflow: visible !important;
      }
      #screen-settings.sys-settings-redesign .sys-settings-nav {
        align-items: stretch !important;
        grid-auto-rows: minmax(58px, auto) !important;
      }
      #screen-settings.sys-settings-redesign .sys-settings-nav button {
        min-height: 58px !important;
        height: 100% !important;
        padding: 11px 13px !important;
        line-height: 1.34 !important;
        overflow: visible !important;
        white-space: normal !important;
        word-break: normal !important;
        text-wrap: balance;
      }
      #screen-settings.sys-settings-redesign .sys-settings-section-head {
        min-height: 76px !important;
        overflow: visible !important;
      }
      #screen-settings.sys-settings-redesign .sys-settings-section-copy,
      #screen-settings.sys-settings-redesign .sys-settings-section-copy strong,
      #screen-settings.sys-settings-redesign .sys-settings-section-copy small,
      #screen-settings.sys-settings-redesign .sys-settings-section-copy em {
        overflow: visible !important;
      }
      #screen-settings.sys-settings-redesign .sys-settings-section-copy strong {
        line-height: 1.28 !important;
        padding-bottom: 2px;
      }

      /* Motorin kartı ve butonlar dar ekranda kırpılmasın. */
      #screen-settings #fuelPriceSettingsCard .panel-header {
        align-items: flex-start !important;
        gap: 10px !important;
        flex-wrap: wrap !important;
      }
      #screen-settings #fuelPriceSettingsCard .panel-header > div {
        min-width: min(100%, 280px) !important;
        flex: 1 1 420px !important;
      }
      #screen-settings #fuelPriceSettingsCard .settings-actions,
      #screen-settings #fuelPriceSettingsCard .fuel-source-links {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)) !important;
        gap: 9px !important;
        width: 100% !important;
        overflow: visible !important;
      }
      #screen-settings #fuelPriceSettingsCard .settings-actions .btn,
      #screen-settings #fuelPriceSettingsCard .fuel-source-links .btn {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 46px !important;
        height: auto !important;
        padding: 10px 12px !important;
        line-height: 1.25 !important;
        white-space: normal !important;
        text-align: center !important;
        overflow: visible !important;
      }
      #screen-command #commandFuelPanel .fuel-live-head {
        align-items: flex-start !important;
        gap: 12px !important;
        flex-wrap: wrap !important;
      }
      #screen-command #commandFuelPanel .fuel-live-head > div:first-child {
        min-width: min(100%, 250px) !important;
        flex: 1 1 250px !important;
      }
      #screen-command #commandFuelPanel .fuel-live-actions {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        gap: 8px !important;
        flex: 1 1 300px !important;
        max-width: 100% !important;
      }
      #screen-command #commandFuelPanel .fuel-live-actions .pill {
        grid-column: 1 / -1 !important;
        justify-self: stretch !important;
        text-align: center !important;
      }
      #screen-command #commandFuelPanel .fuel-live-actions .btn {
        min-width: 0 !important;
        width: 100% !important;
        min-height: 46px !important;
        height: auto !important;
        padding: 9px 10px !important;
        line-height: 1.22 !important;
        white-space: normal !important;
        overflow: visible !important;
      }

      /* Komuta Paneli — SYS AI iki düğmeyle açılır. */
      #screen-command .sys-ai-card,
      #screen-command .sys-ai-domain-card {
        display: none !important;
      }
      .sys-ai-command-dock {
        position: relative;
        overflow: hidden;
        padding: 16px !important;
        border: 1px solid color-mix(in srgb, var(--blue, #6aa7ff) 38%, var(--line));
        border-radius: 22px;
        background:
          radial-gradient(circle at 0 0, color-mix(in srgb, var(--blue, #6aa7ff) 16%, transparent), transparent 38%),
          linear-gradient(145deg, color-mix(in srgb, var(--panel-2, #171a23) 96%, #040810), color-mix(in srgb, var(--panel, #11131a) 97%, #000));
        box-shadow: 0 18px 42px rgba(0,0,0,.18);
      }
      .sys-ai-command-dock::after {
        content: "AI";
        position: absolute;
        right: -8px;
        top: -38px;
        font-size: 132px;
        font-weight: 950;
        color: rgba(255,255,255,.025);
        pointer-events: none;
      }
      .sys-ai-command-head,
      .sys-ai-command-launchers,
      .sys-ai-command-signal-grid,
      .sys-ai-command-foot { position: relative; z-index: 1; }
      .sys-ai-command-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }
      .sys-ai-command-kicker {
        color: var(--blue, #6aa7ff);
        font-size: 10px;
        font-weight: 950;
        letter-spacing: .13em;
      }
      .sys-ai-command-head h3 { margin: 5px 0 4px; font-size: 21px; line-height: 1.15; }
      .sys-ai-command-head p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.42; }
      .sys-ai-command-live {
        flex: 0 0 auto;
        padding: 6px 9px;
        border: 1px solid rgba(50,220,140,.28);
        border-radius: 999px;
        background: rgba(35,210,125,.09);
        color: #55e39a;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .08em;
      }
      .sys-ai-command-launchers {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
      }
      .sys-ai-command-launch {
        position: relative;
        appearance: none;
        min-width: 0;
        min-height: 82px;
        padding: 13px 12px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255,255,255,.028);
        color: var(--text);
        text-align: left;
        cursor: pointer;
        transition: transform .18s ease, border-color .18s ease, background .18s ease;
      }
      .sys-ai-command-launch:hover { transform: translateY(-1px); border-color: var(--blue, #6aa7ff); background: rgba(90,150,255,.075); }
      .sys-ai-command-launch-icon {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        margin-bottom: 9px;
        border-radius: 11px;
        background: rgba(90,150,255,.12);
        color: var(--blue, #6aa7ff);
        font-size: 11px;
        font-weight: 950;
      }
      .sys-ai-command-launch strong { display: block; font-size: 12px; line-height: 1.25; }
      .sys-ai-command-launch small { display: block; margin-top: 4px; color: var(--muted); font-size: 9.5px; line-height: 1.3; }
      .sys-ai-command-badge {
        position: absolute;
        right: 9px;
        top: 9px;
        display: none;
        place-items: center;
        min-width: 25px;
        height: 25px;
        padding: 0 7px;
        border: 2px solid color-mix(in srgb, var(--panel, #11131a) 90%, #000);
        border-radius: 999px;
        background: #ff4055;
        color: #fff;
        font-size: 10px;
        font-weight: 950;
        box-shadow: 0 0 0 4px rgba(255,64,85,.12);
      }
      .sys-ai-command-badge.visible { display: grid; }
      .sys-ai-command-signal-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
        margin-top: 10px;
      }
      .sys-ai-command-signal {
        min-width: 0;
        padding: 9px;
        border: 1px solid var(--line);
        border-radius: 13px;
        background: rgba(255,255,255,.022);
      }
      .sys-ai-command-signal span,
      .sys-ai-command-signal strong,
      .sys-ai-command-signal small { display: block; min-width: 0; }
      .sys-ai-command-signal span { color: var(--muted); font-size: 8px; font-weight: 900; letter-spacing: .08em; }
      .sys-ai-command-signal strong { margin-top: 4px; font-size: 16px; }
      .sys-ai-command-signal small { margin-top: 2px; color: var(--muted); font-size: 8.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sys-ai-command-signal.critical strong { color: #ff596b; }
      .sys-ai-command-signal.attention strong { color: #ffc85c; }
      .sys-ai-command-signal.good strong { color: #50df96; }
      .sys-ai-command-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--line);
        color: var(--muted);
        font-size: 9.5px;
      }
      .sys-ai-command-foot button {
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--blue, #6aa7ff);
        font: inherit;
        font-weight: 900;
        cursor: pointer;
      }

      .sys-ai-dock-layer {
        position: fixed;
        inset: 0;
        z-index: 2500;
        display: none;
        place-items: center;
        padding: 18px;
        background: rgba(2,5,10,.78);
        backdrop-filter: blur(12px);
      }
      .sys-ai-dock-layer.open { display: grid; }
      .sys-ai-dock-modal {
        width: min(920px, 100%);
        max-height: min(88vh, 900px);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--blue, #6aa7ff) 42%, var(--line));
        border-radius: 24px;
        background: color-mix(in srgb, var(--panel, #11131a) 98%, #000);
        box-shadow: 0 34px 90px rgba(0,0,0,.5);
      }
      .sys-ai-dock-modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel-2, #171a23) 92%, #000);
      }
      .sys-ai-dock-modal-head small { display: block; color: var(--blue, #6aa7ff); font-size: 9px; font-weight: 950; letter-spacing: .12em; }
      .sys-ai-dock-modal-head strong { display: block; margin-top: 3px; font-size: 16px; }
      .sys-ai-dock-close {
        appearance: none;
        width: 38px;
        height: 38px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: rgba(255,255,255,.035);
        color: var(--text);
        font-size: 20px;
        cursor: pointer;
      }
      .sys-ai-dock-modal-body { min-height: 0; overflow: auto; padding: 14px; }
      .sys-ai-dock-modal-body > .sys-ai-card,
      .sys-ai-dock-modal-body > .sys-ai-domain-card {
        display: block !important;
        width: 100% !important;
        min-height: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
      }

      @media (max-width: 760px) {
        #screen-settings.sys-settings-redesign .sys-settings-nav { grid-auto-rows: minmax(64px, auto) !important; }
        #screen-settings.sys-settings-redesign .sys-settings-nav button { min-height: 64px !important; font-size: 11px !important; }
        #screen-settings #fuelPriceSettingsCard .settings-actions,
        #screen-settings #fuelPriceSettingsCard .fuel-source-links { grid-template-columns: 1fr !important; }
        #screen-command #commandFuelPanel .fuel-live-actions { grid-template-columns: 1fr !important; }
        #screen-command #commandFuelPanel .fuel-live-actions .pill { grid-column: auto !important; }
        .sys-ai-command-signal-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 520px) {
        .sys-ai-command-launchers { grid-template-columns: 1fr; }
        .sys-ai-command-launch { min-height: 68px; }
        .sys-ai-dock-layer { padding: 8px; }
        .sys-ai-dock-modal { max-height: 94vh; border-radius: 18px; }
      }
    `;
    document.head.appendChild(style);
  }

  function setFuelButtonLabels() {
    const label = "Motorin Fiyatlarını Güncelle";
    const settingsButton = $("#refreshFuelOfficialHtmlSettingsBtn");
    if (settingsButton && settingsButton.textContent !== label) settingsButton.textContent = label;
    const commandButton = $("#refreshFuelOfficialHtmlBtn");
    if (commandButton && commandButton.textContent !== label) commandButton.textContent = label;
  }

  function fuelCandidates(cfg) {
    const endpoint = String(cfg?.endpoint || "./fuel-prices.json").trim() || "./fuel-prices.json";
    const stableRaw = `https://raw.githubusercontent.com/${REPOSITORY}/${STABLE_BRANCH}/fuel-prices.json`;
    const stableCdn = `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${STABLE_BRANCH}/fuel-prices.json`;
    const pages = `https://34tufan34.github.io/servis-yonetim/fuel-prices.json`;
    return [...new Set([endpoint, "./fuel-prices.json", stableRaw, stableCdn, pages])];
  }

  async function fetchFuelCandidate(candidate) {
    const url = new URL(candidate, window.location.href);
    url.searchParams.set("_fuel", String(Date.now()));
    const response = await fetch(url.href, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const parsed = typeof extractFuelPayload === "function" ? extractFuelPayload(payload) : payload;
    parsed.source = parsed.source || (candidate.includes("raw.githubusercontent")
      ? "GitHub RAW canlı fiyat dosyası"
      : candidate.includes("jsdelivr")
        ? "jsDelivr canlı fiyat dosyası"
        : candidate.includes("github.io")
          ? "GitHub Pages canlı fiyat dosyası"
          : "Yerel canlı fiyat dosyası");
    return parsed;
  }

  function applyFuelPayload(parsed, cfg) {
    const previous = cfg.cache || {};
    if (!state.settings || typeof state.settings !== "object") state.settings = {};
    state.settings.fuelDataMode = "endpoint";
    state.settings.fuelLiveEndpoint = cfg.endpoint || "./fuel-prices.json";
    state.settings.fuelPriceCache = {
      region: parsed.region || cfg.region,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      source: parsed.source,
      shell: parsed.shell ?? previous.shell ?? null,
      opet: parsed.opet ?? previous.opet ?? null,
      shellProduct: parsed.shellProduct || previous.shellProduct || "Shell Motorin",
      opetProduct: parsed.opetProduct || previous.opetProduct || "OPET Motorin",
      previousShell: parsed.shell != null && typeof fuelNumber === "function" && fuelNumber(previous.shell) != null && parsed.shell !== fuelNumber(previous.shell)
        ? previous.shell
        : previous.previousShell ?? previous.shell ?? null,
      previousOpet: parsed.opet != null && typeof fuelNumber === "function" && fuelNumber(previous.opet) != null && parsed.opet !== fuelNumber(previous.opet)
        ? previous.opet
        : previous.previousOpet ?? previous.opet ?? null,
      status: "ok",
      message: ""
    };
    if (typeof saveState === "function") saveState();
    if (typeof renderFuelPricePanel === "function") renderFuelPricePanel();
    if (typeof appendAudit === "function") {
      const region = typeof fuelRegionLabel === "function" ? fuelRegionLabel(cfg.region) : cfg.region;
      const shell = typeof fuelPriceText === "function" ? fuelPriceText(parsed.shell) : parsed.shell;
      const opet = typeof fuelPriceText === "function" ? fuelPriceText(parsed.opet) : parsed.opet;
      appendAudit("Yakıt", "Motorin fiyatları sağlam yedek kaynaktan güncellendi", `${region} · Shell ${shell} · OPET ${opet}`);
    }
  }

  function setFuelBusy(busy) {
    ["#refreshFuelOfficialHtmlBtn", "#refreshFuelPricesBtn", "#refreshFuelOfficialHtmlSettingsBtn", "#testFuelConnectionBtn"].forEach((selector) => {
      const button = $(selector);
      if (!button) return;
      button.disabled = busy;
      button.classList.toggle("is-loading", busy);
    });
  }

  function installFuelRefresh() {
    if (window.__SYS_V44816_FUEL_REFRESH_INSTALLED__) return;
    window.__SYS_V44816_FUEL_REFRESH_INSTALLED__ = true;

    const previousRefresh = typeof window.refreshFuelPrices === "function" ? window.refreshFuelPrices : null;
    let busy = false;

    async function robustFuelRefresh(options = {}) {
      if (busy) return false;
      const cfg = typeof fuelSettings === "function" ? fuelSettings() : { dataMode: "endpoint", endpoint: "./fuel-prices.json", region: "istanbul-avrupa", cache: {} };
      if (cfg.dataMode === "manual") {
        if (!options.silent && typeof showToast === "function") showToast("Veri kaynağı manuel modda. Manuel Fiyatı Uygula düğmesini kullan.");
        return false;
      }

      busy = true;
      setFuelBusy(true);
      let lastError = null;
      try {
        for (const candidate of fuelCandidates(cfg)) {
          try {
            const parsed = await fetchFuelCandidate(candidate);
            applyFuelPayload(parsed, cfg);
            if (!options.silent && typeof showToast === "function") showToast("Shell ve OPET motorin fiyatları güncellendi.");
            if (typeof scheduleFuelRefresh === "function") scheduleFuelRefresh();
            return true;
          } catch (error) {
            lastError = error;
          }
        }

        if (previousRefresh) {
          try {
            const result = await previousRefresh({ ...options, silent: true });
            if (result) {
              if (!options.silent && typeof showToast === "function") showToast("Shell ve OPET motorin fiyatları güncellendi.");
              return true;
            }
          } catch (error) {
            lastError = error;
          }
        }

        const cache = cfg.cache || {};
        cache.status = cache.shell != null || cache.opet != null ? "stale" : "error";
        cache.message = `Canlı kaynaklara ulaşılamadı${lastError?.message ? `: ${lastError.message}` : ""}. Son geçerli fiyat korunuyor.`;
        if (!state.settings || typeof state.settings !== "object") state.settings = {};
        state.settings.fuelPriceCache = cache;
        if (typeof saveState === "function") saveState();
        if (typeof renderFuelPricePanel === "function") renderFuelPricePanel();
        if (!options.silent && typeof showToast === "function") {
          showToast(cache.shell != null || cache.opet != null
            ? "Canlı fiyat kaynağına ulaşılamadı; son geçerli motorin fiyatı gösteriliyor."
            : "Motorin fiyat kaynağına ulaşılamadı. İnternet bağlantısını kontrol edin.");
        }
        return false;
      } finally {
        busy = false;
        setFuelBusy(false);
      }
    }

    window.refreshFuelPrices = robustFuelRefresh;

    ["refreshFuelOfficialHtmlBtn", "refreshFuelPricesBtn", "refreshFuelOfficialHtmlSettingsBtn", "testFuelConnectionBtn"].forEach((id) => {
      const oldButton = document.getElementById(id);
      if (!oldButton || oldButton.dataset.v44816Bound === "1") return;
      const button = oldButton.cloneNode(true);
      button.dataset.v44816Bound = "1";
      oldButton.replaceWith(button);
      button.addEventListener("click", (event) => {
        event.preventDefault();
        robustFuelRefresh();
      });
    });
  }

  function createAiLayer(id, title, kicker, card) {
    if (!card || $("#" + id)) return $("#" + id);
    const layer = document.createElement("div");
    layer.className = "sys-ai-dock-layer";
    layer.id = id;
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <section class="sys-ai-dock-modal" role="dialog" aria-modal="true" aria-label="${title}">
        <header class="sys-ai-dock-modal-head">
          <div><small>${kicker}</small><strong>${title}</strong></div>
          <button type="button" class="sys-ai-dock-close" aria-label="Paneli kapat">×</button>
        </header>
        <div class="sys-ai-dock-modal-body"></div>
      </section>`;
    $(".sys-ai-dock-modal-body", layer).appendChild(card);
    document.body.appendChild(layer);
    $(".sys-ai-dock-close", layer).addEventListener("click", () => closeAiLayer(layer));
    layer.addEventListener("click", (event) => { if (event.target === layer) closeAiLayer(layer); });
    return layer;
  }

  function openAiLayer(layer) {
    if (!layer) return;
    layer.classList.add("open");
    layer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".sys-ai-dock-close", layer)?.focus();
  }

  function closeAiLayer(layer) {
    if (!layer) return;
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
    if (!$(".sys-ai-dock-layer.open")) document.body.style.overflow = "";
  }

  function buildAiDock() {
    const side = $("#screen-command .command-side-column");
    const fuel = $("#commandFuelPanel");
    const inspector = $("#sysAiInspectorCard");
    const pulse = $("#sysAiDomainPulseCard");
    if (!side || !fuel || !inspector || !pulse) return;

    const inspectorLayer = createAiLayer("sysAiOperationsLayer", "SYS AI Operasyon Zekâsı", "SYS AI · RİSK MERKEZİ", inspector);
    const pulseLayer = createAiLayer("sysAiPulseLayer", "SYS AI Karar Nabzı", "SYS AI · ÜÇ MERKEZ", pulse);

    let dock = $("#sysAiCommandDock");
    if (!dock) {
      dock = document.createElement("section");
      dock.className = "card sys-ai-command-dock";
      dock.id = "sysAiCommandDock";
      dock.innerHTML = `
        <div class="sys-ai-command-head">
          <div>
            <div class="sys-ai-command-kicker">SYS AI · KONTROL MERKEZİ</div>
            <h3>Kararı gerektiğinde aç</h3>
            <p>Komuta ekranını kalabalıklaştırmadan risk ve karar panellerine eriş.</p>
          </div>
          <span class="sys-ai-command-live" id="sysAiDockLive">CANLI</span>
        </div>
        <div class="sys-ai-command-launchers">
          <button class="sys-ai-command-launch" id="openAiOperationsBtn" type="button">
            <span class="sys-ai-command-badge" id="aiOperationsWarningBadge">0</span>
            <span class="sys-ai-command-launch-icon">AI</span>
            <strong>Operasyon Zekâsı</strong>
            <small>Kritik bulgular, güven skoru ve aksiyon listesi</small>
          </button>
          <button class="sys-ai-command-launch" id="openAiPulseBtn" type="button">
            <span class="sys-ai-command-badge" id="aiPulseWarningBadge">0</span>
            <span class="sys-ai-command-launch-icon">⌁</span>
            <strong>Karar Nabzı</strong>
            <small>Operasyon, okul güvenliği ve finans sinyalleri</small>
          </button>
        </div>
        <div class="sys-ai-command-signal-grid">
          <div class="sys-ai-command-signal critical"><span>KRİTİK</span><strong id="aiDockCritical">0</strong><small>Acil kontrol</small></div>
          <div class="sys-ai-command-signal attention"><span>DİKKAT</span><strong id="aiDockAttention">0</strong><small>İzlenecek kayıt</small></div>
          <div class="sys-ai-command-signal good"><span>GÜVEN</span><strong id="aiDockScore">100</strong><small>Sistem skoru</small></div>
          <div class="sys-ai-command-signal"><span>FIRSAT</span><strong id="aiDockSuggestion">0</strong><small>İyileştirme</small></div>
        </div>
        <div class="sys-ai-command-foot">
          <span id="aiDockLastRun">Analiz zamanı hazırlanıyor</span>
          <button type="button" id="aiDockRefreshBtn">Analizi Yenile</button>
        </div>`;
      side.insertBefore(dock, fuel);
    }

    $("#openAiOperationsBtn")?.addEventListener("click", () => openAiLayer(inspectorLayer));
    $("#openAiPulseBtn")?.addEventListener("click", () => openAiLayer(pulseLayer));
    $("#aiDockRefreshBtn")?.addEventListener("click", () => {
      if (typeof aiRefreshInspector === "function") aiRefreshInspector();
      updateAiDock();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      $$(".sys-ai-dock-layer.open").forEach(closeAiLayer);
    });

    updateAiDock();
  }

  function aiRows() {
    try {
      return typeof buildAiFindings === "function" ? buildAiFindings() : [];
    } catch (error) {
      console.warn("SYS AI düğme sayacı oluşturulamadı:", error);
      return [];
    }
  }

  function setTextIfChanged(element, value) {
    if (element && element.textContent !== String(value)) element.textContent = String(value);
  }

  function updateBadge(element, value) {
    if (!element) return;
    const count = Math.max(0, Number(value || 0));
    setTextIfChanged(element, count > 99 ? "99+" : String(count));
    element.classList.toggle("visible", count > 0);
  }

  function updateAiDock() {
    const dock = $("#sysAiCommandDock");
    if (!dock) return;
    const rows = aiRows();
    const critical = rows.filter((row) => row.severity === "critical").length;
    const attention = rows.filter((row) => row.severity === "attention").length;
    const suggestion = rows.filter((row) => row.severity === "suggestion").length;
    const operationRows = rows.filter((row) => {
      try { return typeof isSchoolAiFinding === "function" ? row.module !== "finance" && !isSchoolAiFinding(row) : row.module !== "finance" && row.module !== "school"; }
      catch (_) { return row.module !== "finance" && row.module !== "school"; }
    });
    const operationWarnings = operationRows.filter((row) => row.severity === "critical" || row.severity === "attention").length;
    const totalWarnings = critical + attention;
    const score = typeof aiOperationScore === "function" ? aiOperationScore(rows) : Math.max(0, 100 - critical * 16 - attention * 7 - suggestion * 2);

    updateBadge($("#aiOperationsWarningBadge"), operationWarnings);
    updateBadge($("#aiPulseWarningBadge"), totalWarnings);
    setTextIfChanged($("#aiDockCritical"), critical);
    setTextIfChanged($("#aiDockAttention"), attention);
    setTextIfChanged($("#aiDockSuggestion"), suggestion);
    setTextIfChanged($("#aiDockScore"), score);

    let config = null;
    try { config = typeof aiInspectorConfig === "function" ? aiInspectorConfig() : null; } catch (_) {}
    const enabled = config?.enabled !== false;
    if ($("#sysAiDockLive")) {
      setTextIfChanged($("#sysAiDockLive"), enabled ? "CANLI" : "AI KAPALI");
      $("#sysAiDockLive").style.opacity = enabled ? "1" : ".55";
    }
    const lastRun = config?.lastRunAt ? new Date(config.lastRunAt) : null;
    if ($("#aiDockLastRun")) {
      setTextIfChanged($("#aiDockLastRun"), lastRun && !Number.isNaN(lastRun.getTime())
        ? `Son analiz · ${lastRun.toLocaleDateString("tr-TR")} ${lastRun.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
        : "Yeni kayıt geldikçe analiz yenilenir");
    }
  }

  function install() {
    installStyles();
    setFuelButtonLabels();
    installFuelRefresh();
    buildAiDock();

    let observerTimer = null;
    const observer = new MutationObserver(() => {
      if (observerTimer !== null) return;
      observerTimer = window.setTimeout(() => {
        observerTimer = null;
        setFuelButtonLabels();
        buildAiDock();
        updateAiDock();
      }, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setInterval(() => {
      buildAiDock();
      updateAiDock();
    }, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
