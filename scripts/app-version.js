(function () {
  "use strict";

  // BUNDAN SONRA SADECE BU SATIR DEĞİŞTİRİLECEK.
  const VERSION = "4.48.12";
  const DISPLAY_VERSION = `v${VERSION}`;

  window.SYS_APP_VERSION = VERSION;
  window.SYS_DISPLAY_VERSION = DISPLAY_VERSION;

  const versionPattern = /(?:v)?(?:4\.\d+\.\d+|1\.1\.\d+)(?:-debug)?/gi;
  const versionKeywords = /(sürüm|versiyon|version|servis yönetimi|sys ai)/i;

  let updateTimer = null;

  function updateVisibleVersions() {
    updateTimer = null;

    document.title = `Servis Yönetim Sistemi | ${DISPLAY_VERSION} · SYS AI`;

    document.querySelectorAll("[data-app-version]").forEach((element) => {
      if (element.textContent !== DISPLAY_VERSION) {
        element.textContent = DISPLAY_VERSION;
      }
    });

    if (!document.body) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      const parent = node.parentElement;

      if (
        !parent ||
        /^(SCRIPT|STYLE|TEXTAREA|OPTION|CODE|PRE)$/i.test(parent.tagName)
      ) {
        return;
      }

      const currentText = node.nodeValue || "";

      versionPattern.lastIndex = 0;

      if (
        !versionKeywords.test(currentText) ||
        !versionPattern.test(currentText)
      ) {
        versionPattern.lastIndex = 0;
        return;
      }

      versionPattern.lastIndex = 0;

      const updatedText = currentText.replace(
        versionPattern,
        DISPLAY_VERSION
      );

      if (updatedText !== currentText) {
        node.nodeValue = updatedText;
      }
    });
  }

  function scheduleVersionUpdate() {
    if (updateTimer !== null) {
      clearTimeout(updateTimer);
    }

    updateTimer = window.setTimeout(updateVisibleVersions, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      scheduleVersionUpdate,
      { once: true }
    );
  } else {
    scheduleVersionUpdate();
  }

  const observer = new MutationObserver(scheduleVersionUpdate);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
