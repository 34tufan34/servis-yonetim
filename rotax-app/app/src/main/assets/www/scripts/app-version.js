(function () {
  "use strict";

  const VERSION = "2.0.0";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
  }

  function loadCommandLayoutFix() {
    if (window.__SYS_V44830_COMMAND_LAYOUT_LOADER__) return;
    window.__SYS_V44830_COMMAND_LAYOUT_LOADER__ = true;

    const script = document.createElement("script");
    script.src = "./scripts/command-layout-v4_48_23.js?v=4.48.30";
    script.defer = true;
    script.onerror = () => console.error("SYS v4.48.30 komuta paneli düzeltmesi yüklenemedi.");
    document.head.appendChild(script);

    const routeScript = document.createElement("script");
    routeScript.src = "./scripts/live-route-v4_48_29.js?v=4.48.30";
    routeScript.defer = true;
    routeScript.onerror = () => console.error("SYS v4.48.30 canlı GPS rota modülü yüklenemedi.");
    document.head.appendChild(routeScript);
  }

  function applyVersion() {
    document.title = `RotaX Servis Yönetimi | ${DISPLAY_VERSION}`;
    setText("[data-app-version]", DISPLAY_VERSION);

    const appVersion = document.getElementById("appVersionDisplay");
    if (appVersion) appVersion.textContent = `${DISPLAY_VERSION} · RotaX`;

    document.querySelectorAll(".brand-sub").forEach((element) => {
      if (/Servis Yönetimi/i.test(element.textContent || "")) {
        element.textContent = `RotaX Servis Yönetimi ${DISPLAY_VERSION}`;
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
