(function () {
  "use strict";

  if (window.__SYS_STATE_STORAGE_V4490__) return;
  window.__SYS_STATE_STORAGE_V4490__ = true;

  const DB_NAME = "SYS_SERVIS_YONETIM_V2";
  const DB_VERSION = 1;
  const SNAPSHOT_STORE = "snapshots";
  const COLLECTION_STORE = "collections";
  const LOCAL_KEY = "SYS_V1_PERSONEL_SERVISI";
  const COLLECTIONS = [
    "attendance", "schoolAttendance", "serviceSessions", "schoolServiceSessions",
    "financeRecords", "schoolPayments", "staffPayments", "vehicleExpenses",
    "vehicleMaintenance", "vehicleKmRecords", "privateVehicleUses", "auditLogs"
  ];

  let databasePromise = null;
  let writeTimer = 0;

  function clone(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function openDatabase() {
    if (!window.indexedDB) return Promise.reject(new Error("IndexedDB desteklenmiyor."));
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) db.createObjectStore(SNAPSHOT_STORE, { keyPath: "savedAt" });
        if (!db.objectStoreNames.contains(COLLECTION_STORE)) db.createObjectStore(COLLECTION_STORE, { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Veri arşivi açılamadı."));
    });
    return databasePromise;
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error || new Error("Veri arşivi yazılamadı."));
      transaction.onabort = () => reject(transaction.error || new Error("Veri arşivi işlemi durduruldu."));
    });
  }

  async function archiveSnapshot(snapshot) {
    const db = await openDatabase();
    const savedAt = String(snapshot?.lastSavedAt || new Date().toISOString());
    const tx = db.transaction([SNAPSHOT_STORE, COLLECTION_STORE], "readwrite");
    tx.objectStore(SNAPSHOT_STORE).put({ savedAt, appVersion: snapshot?.appVersion || "", schemaVersion: snapshot?.schemaVersion || 0, state: clone(snapshot) });
    const collections = tx.objectStore(COLLECTION_STORE);
    COLLECTIONS.forEach((name) => {
      const rows = Array.isArray(snapshot?.[name]) ? snapshot[name] : [];
      collections.put({ key: name, savedAt, rows: clone(rows) });
    });
    await transactionDone(tx);
    trimSnapshots().catch(() => {});
    return true;
  }

  async function trimSnapshots(limit = 20) {
    const db = await openDatabase();
    const tx = db.transaction(SNAPSHOT_STORE, "readwrite");
    const store = tx.objectStore(SNAPSHOT_STORE);
    const keys = await new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    keys.sort().slice(0, Math.max(0, keys.length - limit)).forEach((key) => store.delete(key));
    await transactionDone(tx);
  }

  async function latestSnapshot() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SNAPSHOT_STORE, "readonly");
      const request = tx.objectStore(SNAPSHOT_STORE).openCursor(null, "prev");
      request.onsuccess = () => resolve(request.result?.value?.state || null);
      request.onerror = () => reject(request.error || new Error("Arşiv okunamadı."));
    });
  }

  function queueArchive(snapshot) {
    window.clearTimeout(writeTimer);
    const copy = clone(snapshot);
    writeTimer = window.setTimeout(() => archiveSnapshot(copy).catch((error) => console.warn("IndexedDB arşivi yazılamadı:", error)), 120);
  }

  function installPersistenceMirror() {
    try {
      if (typeof persistStateSnapshot !== "function" || persistStateSnapshot.__indexedDbMirror) return;
      const previous = persistStateSnapshot;
      const wrapped = function () {
        const result = previous.apply(this, arguments);
        if (result && typeof state !== "undefined") queueArchive(state);
        return result;
      };
      wrapped.__indexedDbMirror = true;
      persistStateSnapshot = wrapped;
    } catch (error) {
      console.warn("Kalıcı veri aynası kurulamadı:", error);
    }
  }

  async function restoreIfNeeded() {
    if (localStorage.getItem(LOCAL_KEY)) return false;
    const snapshot = await latestSnapshot();
    if (!snapshot || typeof snapshot !== "object") return false;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
    try {
      state = snapshot;
      if (typeof renderAll === "function") renderAll();
      if (typeof initSecurity === "function") initSecurity();
      if (typeof showToast === "function") showToast("Son cihaz arşivi otomatik geri yüklendi.");
    } catch (error) {
      console.warn("Arşiv çalışma belleğine alınamadı:", error);
    }
    return true;
  }

  window.SYS_STATE_ARCHIVE = {
    database: DB_NAME,
    collections: COLLECTIONS.slice(),
    saveNow: () => typeof state === "undefined" ? Promise.resolve(false) : archiveSnapshot(state),
    latest: latestSnapshot,
    restoreLatest: async () => {
      const snapshot = await latestSnapshot();
      if (!snapshot) return false;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
      window.location.reload();
      return true;
    }
  };

  function install() {
    installPersistenceMirror();
    restoreIfNeeded().catch((error) => console.warn("IndexedDB kurtarma kontrolü yapılamadı:", error));
    try { if (typeof state !== "undefined") queueArchive(state); } catch (_) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
