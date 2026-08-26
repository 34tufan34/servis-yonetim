(function () {
  "use strict";

  if (window.__SYS_SETTINGS_FUEL_V4490__) return;
  window.__SYS_SETTINGS_FUEL_V4490__ = true;

  const OWNER = "34tufan34";
  const REPOSITORY = "servis-yonetim";
  const BRANCH = "agent/v4-48-49-komuta-tam-boy";
  const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/${BRANCH}/fuel-prices.json`;
  const PAGES_URL = `https://${OWNER}.github.io/${REPOSITORY}/fuel-prices.json`;
  const CDN_URL = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPOSITORY}@${BRANCH}/fuel-prices.json`;

  function unique(values) {
    return values.filter((value, index, list) => value && list.indexOf(value) === index);
  }

  function sources(endpointText, region) {
    const custom = String(endpointText || "").replaceAll("{region}", encodeURIComponent(region || "istanbul-avrupa"));
    return unique([custom && !/^\.\/?fuel-prices\.json$/i.test(custom) ? custom : "", RAW_URL, PAGES_URL, CDN_URL, custom, "./fuel-prices.json"]);
  }

  window.SYS_FUEL_SOURCES = { owner: OWNER, repository: REPOSITORY, branch: BRANCH, raw: RAW_URL, pages: PAGES_URL, cdn: CDN_URL, candidates: sources };

  try {
    if (typeof buildFuelEndpointCandidates === "function") {
      buildFuelEndpointCandidates = sources;
    }
  } catch (error) {
    console.warn("Yakıt kaynak sırası güncellenemedi:", error);
  }

  function normalizeStoredEndpoint() {
    try {
      if (typeof state === "undefined" || !state?.settings) return;
      const endpoint = String(state.settings.fuelLiveEndpoint || "");
      if (!endpoint || endpoint.includes("sys-ai-test-v4-48-12-eski-panel")) {
        state.settings.fuelLiveEndpoint = "./fuel-prices.json";
        if (typeof saveState === "function") saveState();
      }
    } catch (error) {
      console.warn("Yakıt ayarı dönüştürülemedi:", error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", normalizeStoredEndpoint, { once: true });
  else normalizeStoredEndpoint();
})();
