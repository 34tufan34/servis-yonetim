(function () {
  "use strict";

  const VERSION = "4.48.19";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
  }

  function loadTabletCommandFix() {
    if (window.__SYS_V44819_TABLET_COMMAND_FIX_LOADER__) return;
    window.__SYS_V44819_TABLET_COMMAND_FIX_LOADER__ = true;

    const script = document.createElement("script");
    script.src = "./scripts/tablet-command-layout-v4_48_19.js?v=4.48.19";
    script.defer = true;
    script.onerror = () => {
      console.error("SYS v4.48.19 tablet komuta paneli düzeltmesi yüklenemedi.");
    };
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

    loadTabletCommandFix();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyVersion, { once: true });
  } else {
    applyVersion();
  }
})();
