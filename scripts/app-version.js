(function () {
  "use strict";

  const VERSION = "4.49.0";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
  }

  function loadCommandLayoutFix() {
    if (window.__SYS_V4490_MODULE_LOADER__) return;
    window.__SYS_V4490_MODULE_LOADER__ = true;

    const script = document.createElement("script");
    script.src = "./scripts/command-layout-v4_48_23.js?v=4.49.0";
    script.defer = true;
    script.onerror = () => console.error("SYS v4.49.0 komuta yerleşimi yüklenemedi.");
    document.head.appendChild(script);

    const previewScript = document.createElement("script");
    previewScript.src = "./scripts/command-preview-v4_49_0.js?v=4.49.0";
    previewScript.defer = true;
    previewScript.onerror = () => console.error("SYS v4.49.0 komuta paneli yüklenemedi.");
    document.head.appendChild(previewScript);

    const experienceScript = document.createElement("script");
    experienceScript.src = "./scripts/sys-experience-v4_49_0.js?v=4.49.0";
    experienceScript.defer = true;
    experienceScript.onerror = () => console.error("SYS v4.49.0 kullanım deneyimi yüklenemedi.");
    experienceScript.addEventListener("load", () => {
      const fullHeightScript = document.createElement("script");
      fullHeightScript.src = "./scripts/command-full-height-v4_48_49.js?v=4.49.0";
      fullHeightScript.defer = true;
      fullHeightScript.onerror = () => console.error("SYS v4.49.0 tam boy komuta kartları yüklenemedi.");
      document.head.appendChild(fullHeightScript);

      const architectureScript = document.createElement("script");
      architectureScript.src = "./scripts/information-architecture-v4_49_0.js?v=4.49.0";
      architectureScript.defer = true;
      architectureScript.onerror = () => console.error("SYS v4.49.0 merkez düzeni yüklenemedi.");
      document.head.appendChild(architectureScript);

      const storageScript = document.createElement("script");
      storageScript.src = "./scripts/state-storage-v4_49_0.js?v=4.49.0";
      storageScript.defer = true;
      storageScript.onerror = () => console.error("SYS v4.49.0 veri arşivi yüklenemedi.");
      document.head.appendChild(storageScript);
    }, { once: true });
    document.head.appendChild(experienceScript);

  }

  function applyVersion() {
    document.title = `Servis Yönetim Sistemi | ${DISPLAY_VERSION}`;
    setText("[data-app-version]", DISPLAY_VERSION);

    const appVersion = document.getElementById("appVersionDisplay");
    if (appVersion) appVersion.textContent = DISPLAY_VERSION;

    document.querySelectorAll(".brand-sub").forEach((element) => {
      if (/Servis Yönetimi/i.test(element.textContent || "")) {
        element.textContent = `Servis Yönetimi ${DISPLAY_VERSION}`;
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
