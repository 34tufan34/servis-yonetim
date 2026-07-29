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
  [!html.includes('id="commandMissingServicePanel"') && !html.includes('id="commandCompleteMissingServiceBtn"'), "Eksik Servisi Tamamla Komuta Paneli'nden kaldırılmamış."],
  [html.includes('id="historicalServiceCard"') && html.includes('id="openHistoricalServiceBtn"'), "Eksik servis tamamlama sistemi Ayarlar'da bulunmuyor."],
  [appVersion.includes("command-preview-v4_48_42.js") && appVersion.includes("sys-experience-v4_48_42.js"), "Yeni deneyim yükleyicileri eksik."],
  [read("scripts/sys-experience-v4_48_42.js").includes("installDiscountFuelSettings") && read("scripts/sys-experience-v4_48_42.js").includes("discountFuelPercent") && read("scripts/sys-experience-v4_48_42.js").includes("discountFuelSource"), "İndirimli mazot ayarları eksik."],
  [read("scripts/command-preview-v4_48_42.js").includes("previewDiscountFuelPrice") && read("scripts/command-preview-v4_48_42.js").includes("İndirimli alış:"), "İndirimli mazot Komuta Paneli özeti eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("screen-command-preview") && read("scripts/command-preview-v4_48_41.js").includes("previewClock"), "Komuta paneli geliştirmeleri eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("command-personnel-mark") && read("scripts/command-preview-v4_48_41.js").includes("command-school-mark"), "Yeni komuta hızlı yolcu işlemleri eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("Personel Toplanıyor") && read("scripts/command-preview-v4_48_41.js").includes("Personel Dağıtılıyor") && read("scripts/command-preview-v4_48_41.js").includes("SERVİS HAREKET ETTİ"), "Akşam personel servisi aşamaları yeni komuta panelinde eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("previewPersonnelPrimary") && read("scripts/command-preview-v4_48_41.js").includes('personnelActive ? "Servisi Bitir"'), "Aktif servis ana düğmesi güncellenmiyor."],
  [html.includes('value="both">Sabah + Akşam') && html.includes('periods = correction.period === "both"'), "Sabah ve akşam toplu geçmiş servis tamamlama eksik."],
  [read("scripts/sys-experience-v4_48_41.js").includes("Personel Servisi Zekâsı") && read("scripts/sys-experience-v4_48_41.js").includes("collectAiPanels"), "Sistem geneli SYS AI merkezi eksik."],
  [read("scripts/sys-experience-v4_48_41.js").includes("grid-template-columns:58px") && read("scripts/sys-experience-v4_48_41.js").includes("driver-finish-btn.ready:not"), "Şoför adı/adres yerleşimi veya bitir düğmesi düzeltmesi eksik."],
  [read("scripts/sys-experience-v4_48_41.js").includes("navigator.contacts") && read("scripts/sys-experience-v4_48_41.js").includes("contactImportFile"), "Telefon rehberi içe aktarma eksik."],
  [html.includes("SYS_FIRST_SETUP_PENDING_V1") && read("scripts/sys-experience-v4_48_41.js").includes("showFirstSetup"), "Tam sıfırlama sonrası ilk kurulum eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("previewFuelDifferenceTitle") && read("scripts/command-preview-v4_48_41.js").includes("previewShellPrice"), "Komuta paneli mazot özetleri eksik."],
  [html.includes("selectAllAddressesBtn") && read("scripts/sys-experience-v4_48_41.js").includes("installAddressBulkDelete"), "Adres Defteri toplu silme eksik."],
  [!read("scripts/command-preview-v4_48_41.js").includes("ÖN İZLEME") && read("scripts/sys-experience-v4_48_41.js").includes("command-panel-backend"), "Yeni komuta paneli ana panel olarak etkin değil."],
  [read("scripts/sys-experience-v4_48_41.js").includes('SYS AI</span>') && read("scripts/sys-experience-v4_48_41.js").includes("sys-ai-personnel-panel"), "SYS AI başlığı veya personel analiz paneli eksik."],
  [read("scripts/sys-experience-v4_48_41.js").includes("overflow-y:auto!important") && read("scripts/sys-experience-v4_48_41.js").includes("sysAiScan"), "SYS AI kaydırma veya tarama animasyonu eksik."],
  [read("scripts/sys-experience-v4_48_41.js").includes("Öğrenci Güvenlik Analizi") && read("scripts/sys-experience-v4_48_41.js").includes("Araç ve Evrak Analizi") && read("scripts/sys-experience-v4_48_41.js").includes("Finans Radarı Analizi"), "SYS AI kartları ayrı analiz sonuçlarına bağlı değil."],
  [read("scripts/command-preview-v4_48_41.js").includes("previewShellLogo") && read("scripts/command-preview-v4_48_41.js").includes("previewFuelDifferencePercent"), "Mazot logoları veya güncel yüzde değeri eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes('!originalFinish?.classList.contains("is-inactive")'), "Komuta paneli aktif servis düğmesi güvenli biçimde doğrulanmıyor."],
  [read("scripts/sys-experience-v4_48_41.js").includes("sysAiPersonnelSafetyCenter") && read("scripts/sys-experience-v4_48_41.js").includes("sys-ai-detail-findings"), "Personel güvenlik merkezi veya detaylı SYS AI bulguları eksik."],
  [read("scripts/command-preview-v4_48_41.js").includes("commandFuelStatusPill") && read("scripts/sys-experience-v4_48_41.js").includes("previewFuelDifferencePercent.is-due"), "Mazot farkı eşik renkleri eksik."],
  [html.includes("`${total} Servis Aktif`") && !html.includes("servis şu anda canlı"), "Servis Aktif terminolojisi uygulanmamış."],
  [html.includes('id="authRememberDevice"') && html.includes("REMEMBERED_SESSION_KEY") && !html.includes("password: password"), "Güvenli cihaz hatırlama seçeneği eksik."],
  [html.includes("command-mercedes-v44833.png"), "Mercedes komuta paneli görseli arayüzde kullanılmıyor."],
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
