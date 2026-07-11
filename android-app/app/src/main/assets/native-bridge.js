(function () {
  "use strict";
  if (window.__SERVIS_ANDROID_BRIDGE_INSTALLED__) return;
  if (!window.AndroidBridge) return;
  window.__SERVIS_ANDROID_BRIDGE_INSTALLED__ = true;

  const toDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Dosya okunamadı"));
    reader.readAsDataURL(blob);
  });

  const nativeShare = async (payload) => {
    const data = payload || {};
    const files = data.files ? Array.from(data.files) : [];
    if (files.length) {
      const file = files[0];
      const dataUrl = await toDataUrl(file);
      window.AndroidBridge.shareFile(
        dataUrl,
        file.name || "evrak",
        file.type || "application/octet-stream",
        data.title || "",
        data.text || ""
      );
      return;
    }
    window.AndroidBridge.shareText(data.title || "", data.text || "", data.url || "");
  };

  try {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      enumerable: true,
      value: nativeShare
    });
  } catch (_) {
    try { navigator.share = nativeShare; } catch (_) {}
  }

  const nativeCanShare = (payload) => {
    if (!payload || !payload.files) return true;
    const files = Array.from(payload.files || []);
    return files.length <= 1 && files.every((file) => Number(file.size || 0) <= 16 * 1024 * 1024);
  };

  try {
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      enumerable: true,
      value: nativeCanShare
    });
  } catch (_) {
    try { navigator.canShare = nativeCanShare; } catch (_) {}
  }

  document.addEventListener("click", async (event) => {
    const target = event.target instanceof Element ? event.target.closest("a[download]") : null;
    if (!target) return;
    const href = String(target.href || "");
    if (!href.startsWith("blob:") && !href.startsWith("data:")) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      const response = await fetch(href);
      const blob = await response.blob();
      const dataUrl = await toDataUrl(blob);
      window.AndroidBridge.saveFile(
        dataUrl,
        target.download || "servis-yonetim-dosya",
        blob.type || "application/octet-stream"
      );
    } catch (error) {
      console.error("Android dosya kaydı başarısız:", error);
    }
  }, true);

  document.documentElement.setAttribute("data-servis-android-apk", "true");
  const installButton = document.getElementById("installAppBtn");
  if (installButton) {
    installButton.disabled = true;
    installButton.textContent = "APK olarak kurulu";
  }
  const modeBadge = document.getElementById("pwaModeBadge");
  if (modeBadge) modeBadge.textContent = "Android APK";
  const pwaStatus = document.getElementById("pwaStatus");
  if (pwaStatus) {
    pwaStatus.textContent = "Android APK üzerinden çalışıyor. GitHub güncellemesi için Çevrimdışı Dosyaları Güncelle düğmesini kullan.";
  }
})();
