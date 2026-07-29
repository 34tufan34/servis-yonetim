"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const html = read("index.html");
const appVersion = read("scripts/app-version.js");
const mainActivity = read("android-app/app/src/main/java/com/tufan/servisyonetim/MainActivity.java");

const checks = [
  [html.includes('id="commandPersonnelCard"') && html.includes("Personel Servisi"), "Personel Servisi panel başlığı eksik."],
  [html.includes('id="commandSchoolCard"') && html.includes("Okul Servisi"), "Okul Servisi panel başlığı eksik."],
  [html.includes('id="commandMissingServicePanel"') && html.includes('id="commandCompleteMissingServiceBtn"') && html.includes("Eksik Servisi Tamamla"), "Eksik Servisler komuta bölümü eksik."],
  [html.includes('renderHistoricalServiceCard();') && html.includes('commandPanel.classList.toggle("permission-hidden", !allowed)'), "Yönetici girişinde eksik servis bölümünü yenileme güvencesi eksik."],
  [html.includes('personnelCard.classList.remove("command-live-hidden")') && html.includes('schoolCard.classList.remove("command-live-hidden")'), "Canlı servis sırasında iki kartın görünürlük güvencesi eksik."],
  [html.includes('addEventListener("dblclick"') && html.includes("cycleLedgerDay(target.dataset.date, 2)"), "Çetele çift tıklama işlemi eksik."],
  [html.includes("touch-action: manipulation"), "Çetele dokunmatik çift tıklama koruması eksik."],
  [!appVersion.includes("live-route-") && !appVersion.includes("routeScript"), "Komuta paneli GPS modülü hâlâ yükleniyor."],
  [mainActivity.includes("settings.setGeolocationEnabled(true)"), "Android WebView konum desteği kapalı."],
  [mainActivity.includes("isTrustedGeolocationOrigin(origin)"), "Yerel APK konum kaynağı güven zincirine bağlı değil."],
  [mainActivity.includes("GeolocationPermissions.getInstance().clearAll()"), "Eski WebView konum reddi temizlenmiyor."],
  [read("scripts/command-layout-v4_48_23.js").includes("grid-template-rows: auto minmax(0, 1fr)"), "Servis kartlarının üst boşluk düzeltmesi eksik."],
  [html.includes('id="commandFuelPriceIncrease"') && html.includes("currentPrice - top.result.referencePrice"), "Mazot farkının litre başına TL artışı eksik."]
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) throw new Error(failures.join("\n"));
console.log(`Arayüz regresyon kontrolleri geçti (${checks.length} kontrol).`);
