(function () {
  "use strict";

  const VERSION = "4.48.18";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent !== value) element.textContent = value;
    });
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyVersion, { once: true });
  } else {
    applyVersion();
  }
})();
