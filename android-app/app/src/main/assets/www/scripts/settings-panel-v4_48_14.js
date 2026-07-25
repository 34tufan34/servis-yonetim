(function () {
  "use strict";

  if (window.__SYS_SETTINGS_PANEL_V44814__) return;
  window.__SYS_SETTINGS_PANEL_V44814__ = true;

  const STORAGE_KEY = "SYS_SETTINGS_PANEL_SECTIONS_V44814";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const GROUPS = [
    {
      id: "operations",
      label: "Operasyon Düzeltmeleri",
      eyebrow: "01 · OPERASYON",
      description: "Eksik geçmiş servis kayıtlarını kontrollü biçimde tamamla.",
      selectors: ["#historicalServiceCard"],
      defaultOpen: true
    },
    {
      id: "appearance",
      label: "Görünüm ve Kullanım",
      eyebrow: "02 · ARAYÜZ",
      description: "Tema, ekran koruyucu ve cihaz kullanım tercihlerini tek noktadan yönet.",
      selectors: [".theme-settings-card", "#screenSaverSettingsCard"],
      defaultOpen: true
    },
    {
      id: "backup",
      label: "Yedekleme ve Veri Güvenliği",
      eyebrow: "03 · VERİ GÜVENLİĞİ",
      description: "JSON, yerel kurtarma ve Google Drive yedeklerini birlikte yönet.",
      selectors: [".settings-data-card", "#cloudBackupCard", "#backupRecoveryCard"],
      defaultOpen: true
    },
    {
      id: "system",
      label: "Sistem ve Güncelleme",
      eyebrow: "04 · SİSTEM",
      description: "Çevrimdışı kullanım, yakıt kaynağı, lisans ve sürüm bilgilerini kontrol et.",
      selectors: ["#pwaInstallCard", "#fuelPriceSettingsCard", "#licenseSettingsCard", ".settings-version-card"],
      defaultOpen: true
    },
    {
      id: "reports",
      label: "Rapor ve Dışa Aktarma",
      eyebrow: "05 · RAPORLAR",
      description: "Personel ve çetele kayıtlarını CSV veya PDF olarak dışa aktar.",
      selectors: [".settings-csv-card"],
      defaultOpen: true
    },
    {
      id: "security",
      label: "Kullanıcı ve Güvenlik",
      eyebrow: "06 · YETKİLER",
      description: "Kullanıcı rollerini, erişimleri ve işlem geçmişini denetle.",
      selectors: ["#userManagementCard", "#auditLogCard"],
      defaultOpen: false
    },
    {
      id: "danger",
      label: "Tehlikeli İşlemler",
      eyebrow: "07 · DİKKAT",
      description: "Demo temizliği ve geri alınamayan veri silme işlemleri.",
      selectors: ["#fullDemoDataCard", ".settings-danger-card"],
      defaultOpen: false,
      danger: true
    }
  ];

  function safeState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function saveState(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (_) {}
  }

  function createElement(tag, className, html) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (html !== undefined) element.innerHTML = html;
    return element;
  }

  function clickExisting(selector) {
    const target = $(selector);
    if (!target) {
      if (typeof window.showToast === "function") {
        window.showToast("Bu işlem henüz hazır değil.");
      }
      return;
    }
    target.click();
  }

  function buildHero(screen, grid) {
    if ($(".sys-settings-hero", screen)) return;

    const hero = createElement(
      "header",
      "sys-settings-hero",
      `
        <div class="sys-settings-hero-copy">
          <span class="sys-settings-kicker">SYS · YÖNETİM MERKEZİ</span>
          <h1>Ayarlar ve Veri Güvenliği</h1>
          <p>Görünüm, yedekleme, sistem, rapor ve kullanıcı kontrolleri artık tek düzen içinde.</p>
        </div>
        <div class="sys-settings-quick-actions" aria-label="Hızlı ayar işlemleri">
          <button type="button" data-settings-action="#backupBtn">JSON Yedek Al</button>
          <button type="button" data-settings-action="#cloudBackupNow">Drive Yedekle</button>
          <button type="button" data-settings-action="#refreshOfflineCacheBtn">Dosyaları Güncelle</button>
          <button type="button" data-settings-action="#revalidateLicenseBtn">Lisansı Kontrol Et</button>
        </div>
        <div class="sys-settings-status-grid">
          <button type="button" class="sys-settings-status" data-open-group="system">
            <span>SÜRÜM</span><strong id="sysSettingsVersion">v4.48.14</strong><small>Çalışan uygulama</small>
          </button>
          <button type="button" class="sys-settings-status" data-open-group="system">
            <span>LİSANS</span><strong id="sysSettingsLicense">Kontrol ediliyor</strong><small id="sysSettingsLicenseNote">Cihaz durumu</small>
          </button>
          <button type="button" class="sys-settings-status" data-open-group="backup">
            <span>YEREL YEDEK</span><strong id="sysSettingsLocalBackup">Hazırlanıyor</strong><small>Bu cihazdaki kurtarma</small>
          </button>
          <button type="button" class="sys-settings-status" data-open-group="backup">
            <span>GOOGLE DRIVE</span><strong id="sysSettingsCloudBackup">Klasör bekliyor</strong><small>Bulut yedekleme</small>
          </button>
        </div>
      `
    );

    const nav = createElement("nav", "sys-settings-nav");
    nav.setAttribute("aria-label", "Ayarlar bölümleri");
    GROUPS.forEach((group) => {
      const button = createElement("button", group.danger ? "danger" : "");
      button.type = "button";
      button.dataset.settingsNav = group.id;
      button.textContent = group.label;
      nav.appendChild(button);
    });

    screen.insertBefore(hero, grid);
    screen.insertBefore(nav, grid);

    $$("[data-settings-action]", hero).forEach((button) => {
      button.addEventListener("click", () => clickExisting(button.dataset.settingsAction));
    });
  }

  function buildGroup(group, savedState) {
    const section = createElement("section", `sys-settings-section${group.danger ? " danger" : ""}`);
    section.id = `settings-group-${group.id}`;
    section.dataset.settingsGroup = group.id;

    const isOpen = Object.prototype.hasOwnProperty.call(savedState, group.id)
      ? Boolean(savedState[group.id])
      : group.defaultOpen;

    section.classList.toggle("collapsed", !isOpen);
    section.innerHTML = `
      <button type="button" class="sys-settings-section-head" aria-expanded="${isOpen ? "true" : "false"}">
        <span class="sys-settings-section-index">${group.eyebrow.split(" · ")[0]}</span>
        <span class="sys-settings-section-copy">
          <small>${group.eyebrow}</small>
          <strong>${group.label}</strong>
          <em>${group.description}</em>
        </span>
        <span class="sys-settings-section-meta"><b data-group-count>0</b><i aria-hidden="true">⌄</i></span>
      </button>
      <div class="sys-settings-section-body">
        <div class="sys-settings-section-grid"></div>
      </div>
    `;

    const head = $(".sys-settings-section-head", section);
    head.addEventListener("click", () => {
      const nextOpen = section.classList.contains("collapsed");
      section.classList.toggle("collapsed", !nextOpen);
      head.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      const state = safeState();
      state[group.id] = nextOpen;
      saveState(state);
    });

    return section;
  }

  function placeCards(screen, grid) {
    const savedState = safeState();
    const sections = new Map();

    GROUPS.forEach((group) => {
      let section = $(`[data-settings-group="${group.id}"]`, grid);
      if (!section) {
        section = buildGroup(group, savedState);
        grid.appendChild(section);
      }
      sections.set(group.id, section);
    });

    GROUPS.forEach((group) => {
      const section = sections.get(group.id);
      const host = $(".sys-settings-section-grid", section);

      group.selectors.forEach((selector) => {
        $$(selector, screen).forEach((card) => {
          if (card.closest(".sys-settings-section") === section) return;
          host.appendChild(card);
        });
      });

      const cards = Array.from(host.children).filter((node) => node.matches(".settings-panel, .card, .cloud-backup-card"));
      const count = $("[data-group-count]", section);
      if (count) setText(count, String(cards.length));
      section.hidden = cards.length === 0;
    });
  }

  function expandAndScroll(groupId) {
    const section = $(`[data-settings-group="${groupId}"]`);
    if (!section) return;
    section.hidden = false;
    section.classList.remove("collapsed");
    $(".sys-settings-section-head", section)?.setAttribute("aria-expanded", "true");
    const state = safeState();
    state[groupId] = true;
    saveState(state);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function installNavigation(screen) {
    $$("[data-settings-nav]", screen).forEach((button) => {
      button.addEventListener("click", () => expandAndScroll(button.dataset.settingsNav));
    });
    $$("[data-open-group]", screen).forEach((button) => {
      button.addEventListener("click", () => expandAndScroll(button.dataset.openGroup));
    });
  }

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function compactText(value, fallback) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text) return fallback;
    return text.length > 34 ? `${text.slice(0, 31)}…` : text;
  }

  function updateOverview() {
    const version = window.SYS_DISPLAY_VERSION || window.SYS_APP_VERSION || window.state?.appVersion || $("#appVersionDisplay")?.textContent || "v4.48.14";
    const licenseBadge = $("#licenseSettingsBadge");
    const licenseCompany = $("#licenseSettingsCompany");
    const localBackup = $("#backupHealth");
    const cloudStatus = $("#cloudBackupStatus");

    const versionTarget = $("#sysSettingsVersion");
    setText(versionTarget, compactText(version, "v4.48.14"));

    const licenseTarget = $("#sysSettingsLicense");
    const licenseNote = $("#sysSettingsLicenseNote");
    setText(licenseTarget, compactText(licenseBadge?.textContent, "Kontrol ediliyor"));
    setText(licenseNote, compactText(licenseCompany?.textContent, "Cihaz durumu"));

    const localTarget = $("#sysSettingsLocalBackup");
    setText(localTarget, compactText(localBackup?.textContent, "Henüz yedek yok"));

    const cloudTarget = $("#sysSettingsCloudBackup");
    if (cloudTarget) {
      const cloudTitle = $("b", cloudStatus)?.textContent || cloudStatus?.textContent;
      setText(cloudTarget, compactText(cloudTitle, "Klasör bekliyor"));
    }
  }

  function hideEmptyGroups(screen) {
    $$(".sys-settings-section", screen).forEach((section) => {
      const cards = $$(".settings-panel, .cloud-backup-card", $(".sys-settings-section-grid", section) || section)
        .filter((card) => getComputedStyle(card).display !== "none");
      section.classList.toggle("no-visible-cards", cards.length === 0);
    });
  }

  function installStyles() {
    if ($("#sysSettingsPanelV44814Styles")) return;
    const style = createElement("style");
    style.id = "sysSettingsPanelV44814Styles";
    style.textContent = `
      #screen-settings.sys-settings-redesign {
        --settings-accent: var(--red-2, #ff3347);
        --settings-soft: color-mix(in srgb, var(--settings-accent) 14%, transparent);
        overflow: auto !important;
        padding: clamp(14px, 1.8vw, 24px) !important;
        scrollbar-gutter: stable;
      }
      #screen-settings.sys-settings-redesign > .settings-grid {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 14px !important;
        max-width: 1500px;
        margin: 0 auto;
        padding: 0 0 30px !important;
        overflow: visible !important;
        height: auto !important;
        min-height: 0 !important;
      }
      .sys-settings-hero,
      .sys-settings-nav {
        width: min(1500px, 100%);
        margin-inline: auto;
      }
      .sys-settings-hero {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr);
        gap: 18px 24px;
        padding: clamp(20px, 2.4vw, 32px);
        margin-bottom: 12px;
        border: 1px solid color-mix(in srgb, var(--settings-accent) 32%, var(--line));
        border-radius: 24px;
        background:
          radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--settings-accent) 19%, transparent), transparent 34%),
          linear-gradient(145deg, color-mix(in srgb, var(--panel-2, #171a23) 92%, #000), color-mix(in srgb, var(--panel, #11131a) 96%, #000));
        box-shadow: 0 24px 60px rgba(0,0,0,.24);
      }
      .sys-settings-hero::after {
        content: "SYS";
        position: absolute;
        right: -18px;
        top: -50px;
        font-size: clamp(120px, 16vw, 250px);
        font-weight: 950;
        letter-spacing: -.09em;
        color: rgba(255,255,255,.025);
        pointer-events: none;
      }
      .sys-settings-hero-copy { position: relative; z-index: 1; align-self: center; }
      .sys-settings-kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--settings-accent);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .16em;
      }
      .sys-settings-kicker::before { content: ""; width: 22px; height: 2px; background: currentColor; border-radius: 99px; }
      .sys-settings-hero h1 {
        margin: 9px 0 7px;
        max-width: 720px;
        font-size: clamp(27px, 3.1vw, 46px);
        line-height: 1;
        letter-spacing: -.045em;
      }
      .sys-settings-hero p { margin: 0; max-width: 760px; color: var(--muted); line-height: 1.55; }
      .sys-settings-quick-actions {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        align-content: center;
      }
      .sys-settings-quick-actions button,
      .sys-settings-nav button {
        appearance: none;
        border: 1px solid var(--line);
        color: var(--text);
        background: color-mix(in srgb, var(--panel-2, #171a23) 90%, transparent);
        font: inherit;
        font-weight: 800;
        cursor: pointer;
        transition: border-color .18s ease, transform .18s ease, background .18s ease;
      }
      .sys-settings-quick-actions button {
        min-height: 48px;
        padding: 10px 13px;
        border-radius: 14px;
        text-align: left;
      }
      .sys-settings-quick-actions button:first-child,
      .sys-settings-quick-actions button:nth-child(2) {
        border-color: color-mix(in srgb, var(--settings-accent) 40%, var(--line));
        background: var(--settings-soft);
      }
      .sys-settings-quick-actions button:hover,
      .sys-settings-nav button:hover { transform: translateY(-1px); border-color: var(--settings-accent); }
      .sys-settings-status-grid {
        position: relative;
        z-index: 1;
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .sys-settings-status {
        appearance: none;
        min-width: 0;
        padding: 13px 15px;
        text-align: left;
        border: 1px solid var(--line);
        border-radius: 15px;
        background: rgba(255,255,255,.025);
        color: var(--text);
        cursor: pointer;
      }
      .sys-settings-status span,
      .sys-settings-status strong,
      .sys-settings-status small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .sys-settings-status span { color: var(--muted); font-size: 9px; font-weight: 900; letter-spacing: .14em; }
      .sys-settings-status strong { margin-top: 5px; font-size: 14px; }
      .sys-settings-status small { margin-top: 3px; color: var(--muted); font-size: 10px; }
      .sys-settings-nav {
        position: relative;
        top: auto;
        z-index: 6;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 8px;
        overflow: visible;
        padding: 8px 0 14px;
        margin-bottom: 4px;
        background: transparent;
      }
      .sys-settings-nav button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 0;
        min-height: 44px;
        height: auto;
        padding: 10px 12px;
        border-radius: 13px;
        font-size: 11px;
        line-height: 1.25;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        text-align: center;
      }
      .sys-settings-nav button.danger { color: #ff6978; border-color: rgba(255,70,90,.3); }
      .sys-settings-section {
        scroll-margin-top: 64px;
        border: 1px solid var(--line);
        border-radius: 22px;
        background: color-mix(in srgb, var(--panel, #11131a) 94%, transparent);
        overflow: clip;
        box-shadow: 0 14px 34px rgba(0,0,0,.14);
      }
      .sys-settings-section.danger { border-color: rgba(255,64,82,.34); background: linear-gradient(150deg, rgba(255,50,70,.065), color-mix(in srgb, var(--panel, #11131a) 96%, #000)); }
      .sys-settings-section-head {
        width: 100%;
        appearance: none;
        display: grid;
        grid-template-columns: 44px minmax(0,1fr) auto;
        align-items: center;
        gap: 13px;
        padding: 17px 19px;
        border: 0;
        color: var(--text);
        background: transparent;
        text-align: left;
        cursor: pointer;
      }
      .sys-settings-section-index {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border: 1px solid color-mix(in srgb, var(--settings-accent) 42%, var(--line));
        border-radius: 13px;
        background: var(--settings-soft);
        color: var(--settings-accent);
        font-size: 11px;
        font-weight: 950;
      }
      .danger .sys-settings-section-index { border-color: rgba(255,65,83,.42); background: rgba(255,40,60,.1); color: #ff6574; }
      .sys-settings-section-copy { min-width: 0; }
      .sys-settings-section-copy small,
      .sys-settings-section-copy strong,
      .sys-settings-section-copy em { display: block; }
      .sys-settings-section-copy small { color: var(--muted); font-size: 9px; font-weight: 900; letter-spacing: .13em; }
      .sys-settings-section-copy strong { margin-top: 3px; font-size: 17px; letter-spacing: -.02em; }
      .sys-settings-section-copy em { margin-top: 4px; color: var(--muted); font-size: 11px; font-style: normal; line-height: 1.4; }
      .sys-settings-section-meta { display: flex; align-items: center; gap: 12px; }
      .sys-settings-section-meta b {
        display: grid;
        place-items: center;
        min-width: 29px;
        height: 29px;
        padding: 0 8px;
        border-radius: 999px;
        background: rgba(255,255,255,.055);
        color: var(--muted);
        font-size: 11px;
      }
      .sys-settings-section-meta i { font-size: 20px; font-style: normal; transition: transform .2s ease; }
      .sys-settings-section.collapsed .sys-settings-section-meta i { transform: rotate(-90deg); }
      .sys-settings-section-body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .22s ease; }
      .sys-settings-section.collapsed .sys-settings-section-body { grid-template-rows: 0fr; }
      .sys-settings-section-grid {
        min-height: 0;
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 12px;
        padding: 0 14px 14px;
      }
      .sys-settings-section.collapsed .sys-settings-section-grid { padding-bottom: 0; }
      #screen-settings.sys-settings-redesign .sys-settings-section-grid > .settings-panel,
      #screen-settings.sys-settings-redesign .sys-settings-section-grid > .cloud-backup-card {
        min-width: 0 !important;
        height: auto !important;
        max-height: none !important;
        margin: 0 !important;
        overflow: visible !important;
        border-radius: 17px !important;
        box-shadow: none !important;
      }
      #settings-group-operations .settings-panel { grid-column: 1 / -1 !important; }
      #settings-group-appearance .settings-panel { grid-column: span 6 !important; }
      #settings-group-backup .settings-data-card { grid-column: span 5 !important; }
      #settings-group-backup #cloudBackupCard { grid-column: span 7 !important; }
      #settings-group-backup #backupRecoveryCard { grid-column: 1 / -1 !important; }
      #settings-group-system #pwaInstallCard,
      #settings-group-system #licenseSettingsCard,
      #settings-group-system .settings-version-card { grid-column: span 4 !important; }
      #settings-group-system #fuelPriceSettingsCard { grid-column: 1 / -1 !important; }
      #settings-group-reports .settings-panel { grid-column: 1 / -1 !important; }
      #settings-group-security .settings-panel { grid-column: 1 / -1 !important; }
      #settings-group-danger #fullDemoDataCard { grid-column: span 8 !important; }
      #settings-group-danger .settings-danger-card { grid-column: span 4 !important; }
      #screen-settings.sys-settings-redesign .settings-panel > .panel-header {
        min-height: auto !important;
        margin: 0 0 13px !important;
        padding-bottom: 11px !important;
      }
      #screen-settings.sys-settings-redesign .settings-panel .panel-title { font-size: 15px !important; }
      #screen-settings.sys-settings-redesign .settings-panel .panel-sub { font-size: 10.5px !important; line-height: 1.45 !important; }
      #screen-settings.sys-settings-redesign .settings-panel .btn { min-height: 40px; }
      #screen-settings.sys-settings-redesign .theme-preview-row { max-height: 170px; overflow: auto; padding-right: 4px; }
      #screen-settings.sys-settings-redesign .cloud-backup-card { padding: 16px !important; }
      .sys-settings-section.no-visible-cards { display: none; }
      @media (max-width: 1100px) {
        .sys-settings-hero { grid-template-columns: 1fr; }
        .sys-settings-quick-actions { grid-template-columns: repeat(4, minmax(0,1fr)); }
        .sys-settings-status-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        #settings-group-backup .settings-data-card,
        #settings-group-backup #cloudBackupCard,
        #settings-group-system #pwaInstallCard,
        #settings-group-system #licenseSettingsCard,
        #settings-group-system .settings-version-card,
        #settings-group-danger #fullDemoDataCard,
        #settings-group-danger .settings-danger-card { grid-column: span 6 !important; }
      }
      @media (max-width: 760px) {
        #screen-settings.sys-settings-redesign { padding: 10px !important; }
        .sys-settings-hero { padding: 18px; border-radius: 19px; }
        .sys-settings-hero h1 { font-size: 29px; }
        .sys-settings-quick-actions { grid-template-columns: 1fr 1fr; }
        .sys-settings-status-grid { grid-template-columns: 1fr 1fr; }
        .sys-settings-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; padding: 6px 0 12px; }
        .sys-settings-nav button { min-height: 46px; padding: 9px 8px; font-size: 10.5px; }
        .sys-settings-section-head { grid-template-columns: 38px minmax(0,1fr) auto; padding: 14px; gap: 10px; }
        .sys-settings-section-index { width: 36px; height: 36px; }
        .sys-settings-section-copy em { display: none; }
        .sys-settings-section-grid { grid-template-columns: 1fr; padding: 0 10px 10px; }
        #screen-settings.sys-settings-redesign .sys-settings-section-grid > * { grid-column: 1 / -1 !important; }
        #screen-settings.sys-settings-redesign .settings-panel { padding: 14px !important; }
      }
      @media (max-width: 430px) {
        .sys-settings-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sys-settings-nav button { min-height: 48px; font-size: 10px; }
        .sys-settings-status-grid,
        .sys-settings-quick-actions { grid-template-columns: 1fr; }
        .sys-settings-status-grid { gap: 7px; }
      }
    `;
    document.head.appendChild(style);
  }

  function install() {
    const screen = $("#screen-settings");
    const grid = $(".settings-grid", screen);
    if (!screen || !grid) return;

    installStyles();
    screen.classList.add("sys-settings-redesign");
    buildHero(screen, grid);
    placeCards(screen, grid);
    installNavigation(screen);
    updateOverview();
    hideEmptyGroups(screen);

    let timer = 0;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        placeCards(screen, grid);
        updateOverview();
        hideEmptyGroups(screen);
      }, 80);
    });
    observer.observe(screen, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "style"] });

    window.setInterval(updateOverview, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
