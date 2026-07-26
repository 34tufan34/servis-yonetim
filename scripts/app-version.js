(function () {
  "use strict";

  const VERSION = "4.48.23";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
  }

  function loadCommandLayoutFix() {
    if (window.__SYS_V44822_COMMAND_LAYOUT_LOADER__) return;
    window.__SYS_V44822_COMMAND_LAYOUT_LOADER__ = true;

    const script = document.createElement("script");
    script.src = "./scripts/command-layout-v4_48_23.js?v=4.48.23";
    script.defer = true;
    script.onerror = () => console.error("SYS v4.48.23 komuta paneli düzeltmesi yüklenemedi.");
    document.head.appendChild(script);
  }

  function applyVersion() {
    document.title = `Servis Yönetim Sistemi | ${DISPLAY_VERSION} · SYS AI`;
    setText("[data-app-version]", DISPLAY_VERSION);

    const appVersion = document.getElementById("appVersionDisplay");
    if (appVersion) appVersion.textContent = `${DISPLAY_VERSION} · SYS AI`;

    document.querySelectorAll(".brand-sub").forEach((element) => {
      if (/Servis Yönetimi/i.test(element.textContent || "")) {
        element.textContent = `Servis Yönetimi ${DISPLAY_VERSION} · SYS AI`;
      }
    });

    loadCommandLayoutFix();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyVersion, { once: true });
  } else {
    applyVersion();
  }
})();
