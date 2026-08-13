(function () {
  "use strict";

  const VERSION = "4.48.53";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
  }

  function loadCommandLayoutFix() {
    if (window.__SYS_V44853_COMMAND_LAYOUT_LOADER__) return;
    window.__SYS_V44853_COMMAND_LAYOUT_LOADER__ = true;

    const script = document.createElement("script");
    script.src = "./scripts/command-layout-v4_48_23.js?v=4.48.53";
    script.defer = true;
    script.onerror = () => console.error("SYS v4.48.53 komuta paneli düzeltmesi yüklenemedi.");
    document.head.appendChild(script);

    const previewScript = document.createElement("script");
    previewScript.src = "./scripts/command-preview-v4_48_49.js?v=4.48.53";
    previewScript.defer = true;
    previewScript.onerror = () => console.error("SYS v4.48.53 komuta paneli yüklenemedi.");
    document.head.appendChild(previewScript);

    const experienceScript = document.createElement("script");
    experienceScript.src = "./scripts/sys-experience-v4_48_49.js?v=4.48.53";
    experienceScript.defer = true;
    experienceScript.onerror = () => console.error("SYS v4.48.53 kullanım deneyimi yüklenemedi.");
    experienceScript.addEventListener("load", () => {
      const fullHeightScript = document.createElement("script");
      fullHeightScript.src = "./scripts/command-full-height-v4_48_49.js?v=4.48.53-bakim-sekmeleri-1";
      fullHeightScript.defer = true;
      fullHeightScript.onerror = () => console.error("SYS v4.48.53 tam boy komuta kartları yüklenemedi.");
      document.head.appendChild(fullHeightScript);
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
