"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const branch = "agent/v4-48-49-komuta-tam-boy";

const html = read("index.html");
const version = read("scripts/app-version.js");
const command = read("scripts/command-preview-v4_49_0.js");
const experience = read("scripts/sys-experience-v4_49_0.js");
const architecture = read("scripts/information-architecture-v4_49_0.js");
const storage = read("scripts/state-storage-v4_49_0.js");
const settings = read("scripts/settings-panel-v4_49_0.js");
const fuel = read("scripts/settings-fuel-v4_49_0.js");
const build = read("android-app/app/build.gradle");
const appConfig = read("android-app/app/src/main/java/com/tufan/servisyonetim/AppConfig.java");
const workflow = read(".github/workflows/build-android-apk.yml");
const sw = read("sw.js");
const strings = read("android-app/app/src/main/res/values/strings.xml");
const debugStrings = read("android-app/app/src/debug/res/values/strings.xml");
const installStart = experience.indexOf("function install()");
const experienceInstall = experience.slice(installStart, experience.indexOf("if (document.readyState", installStart));
const dataImageCount = (html.match(/data:image\/png;base64,/g) || []).length;

const checks = [
  [version.includes('const VERSION = "4.49.0"') && html.includes("const SCHEMA_VERSION = 40"), "Sürüm 4.49.0 veya veri şeması 40 değil."],
  [version.includes("command-preview-v4_49_0.js") && version.includes("sys-experience-v4_49_0.js") && version.includes("information-architecture-v4_49_0.js") && version.includes("state-storage-v4_49_0.js"), "Yeni modül yükleme zinciri eksik."],
  [html.includes('data-module="operations"') && html.includes('id="screen-operations"'), "Operasyonlar merkezi eksik."],
  [html.includes('data-module="vehicle"') && html.includes('id="screen-vehicle"'), "Araç Merkezi eksik."],
  [html.includes("Sürüş Ekranı") && !html.includes('<span class="nav-label"><span class="dot"></span>Şoför Modu</span>'), "Şoför Modu menü adı sadeleştirilmemiş."],
  [html.includes('data-registry-tab="addresses"') && html.includes('data-registry-tab="offers"'), "Adres ve fiyat teklifleri Temel Kayıtlar'a alınmamış."],
  [html.includes('source: "#screen-addresses .address-book-layout"') && html.includes('source: "#priceOffersWorkarea"'), "Birleştirilen kayıt kaynakları eksik."],
  [html.includes('data-registry-tab="parts"') && html.includes('id="maintenancePartCatalogForm"'), "Parça Kataloğu eksik."],
  [html.includes('value="driver">Şoför</option>') && html.includes('modules: ["command", "driver"]'), "Şoför rolü veya sınırlı yetkisi eksik."],
  [!html.includes('id="sessionUserAvatar"') && !command.includes("previewProfileAvatar"), "Komuta alanındaki profil resmi kaldırılmamış."],
  [command.includes("boardingPending") && command.includes("DAĞITIMA BAŞLA") && command.includes('isDropoff ? ["İndi"]'), "Akşam biniş-dağıtım akışı eksik."],
  [command.includes("previewHealthRadar") && command.includes("SYS_MAINTENANCE_INTELLIGENCE"), "Araç Sağlığı ve Bakım Radarı eksik."],
  [read("scripts/command-full-height-v4_48_49.js").includes("justify-content: flex-start !important"), "Sıradaki yolcu sol üst hizası eksik."],
  [html.includes('data-finance-flow-tab="debts"') && html.includes('id="vehicleExpensePaymentStatus"') && html.includes("vehicleExpenseDebtAmount"), "Veresiye ve borç sistemi eksik."],
  [html.includes('data-finance-flow-tab="annual"') && html.includes('id="financeAnnualYear"') && html.includes("financeAnnualRows"), "Seçilebilir yıllık gelir-gider görünümü eksik."],
  [html.includes('id="maintenancePartSelect"') && html.includes("maintenancePartAnalysis") && html.includes("maintenanceTrackingAnalysis"), "Bakım ve parça tahmin sistemi eksik."],
  [html.includes('id="vehicleExpenseKmLabel"') && html.includes("vehicleMonthlyMileageEstimate") && html.includes("Yakıt KM kayıtları"), "Yakıt KM verisinin bakım tahminine bağlantısı eksik."],
  [html.includes('id="maintenanceSubtabs"') && html.includes('data-maintenance-screen="history"') && html.includes('data-maintenance-screen="intelligence"'), "Bakım alt sekmeleri eksik."],
  [architecture.includes("FINANCE_GROUPS") && architecture.includes("Gelir & Tahsilat") && architecture.includes("Gider & Borçlar"), "Finans menüsü gruplanmamış."],
  [architecture.includes("vehicle-expense-summary-panel") && architecture.includes('data-finance-flow-screen="expenses"'), "Araç gideri özet/geçmiş birleştirmesi doğrulanamadı."],
  [architecture.includes("#finance-tab-maintenance") && architecture.includes("#finance-tab-km") && architecture.includes("#finance-tab-depreciation"), "Araç modülleri Araç Merkezi'ne taşınmıyor."],
  [architecture.includes("#historicalServiceCard") && architecture.includes("#operationsHistoryHost"), "Geçmiş servis düzeltmesi Operasyonlar'a taşınmıyor."],
  [architecture.includes(".settings-csv-card") && architecture.includes("#finance-tab-reports"), "Rapor dışa aktarma Finans'a taşınmıyor."],
  [!settings.includes('id: "operations"') && !settings.includes('id: "reports"') && settings.includes('id: "appearance"') && settings.includes('id: "backup"'), "Ayarlar tekrarları temizlenmemiş."],
  [!experienceInstall.includes("buildAiHub()") && !experienceInstall.includes("buildPriceOffersPanel()"), "Bağımsız SYS AI veya Fiyat Teklifleri ekranı hâlâ kuruluyor."],
  [experienceInstall.includes("installKmOfferRecords()") && experience.includes('#priceOffersWorkarea'), "Fiyat teklifleri kayıt motoru korunmamış."],
  [storage.includes("SYS_SERVIS_YONETIM_V2") && storage.includes("snapshots") && storage.includes("collections") && storage.includes("SYS_STATE_ARCHIVE"), "IndexedDB veri arşivi eksik."],
  [fuel.includes(branch) && appConfig.includes(branch), "Yakıt kaynağı doğru üretim dalına bağlı değil."],
  [build.includes("syncWebAssets") && build.includes("generated/sysWebAssets") && build.includes("preBuild"), "APK web dosyalarını otomatik eşitlemiyor."],
  [build.includes('applicationId "com.tufan.servisyonetim.komuta.v44849"'), "Ayrı kurulabilir uygulama kimliği değişmiş."],
  [strings.includes("Servis Yönetimi 4.49.0") && debugStrings.includes("Servis Yönetimi 4.49.0 Test"), "Android uygulama adları güncel değil."],
  [!exists("android-app/app/src/main/assets/www") && exists("android-app/app/src/main/assets/native-bridge.js"), "Eski kopya web ağacı kaldırılmamış veya native köprü kayıp."],
  [!exists(".github/workflows/build-android-ai-test.yml") && workflow.includes("servis-yonetim-v${{ env.APP_VERSION }}"), "Tek üretim APK akışı sağlanmamış."],
  [sw.includes("servis-sys-v4-49-0") && sw.includes("information-architecture-v4_49_0.js") && sw.includes("state-storage-v4_49_0.js"), "Service Worker yeni sürümü önbelleğe almıyor."],
  [html.includes("command-mercedes-v44849.png") && !html.includes("command-mercedes-v44833.png"), "Komuta arka planı eski görsele bağlı."],
  [html.includes("./icons/sys-logo-wide.png") && dataImageCount === 2, "Tekrarlanan gömülü SYS logoları temizlenmemiş."],
  [html.includes('id="addressBookPhone"') && experience.includes("installCurrentLocationAddress") && experience.includes("installAddressBulkDelete"), "Adres Defteri özellikleri korunmamış."],
  [html.includes("renderSchoolAiCenter") && html.includes("renderFinanceRiskDetail") && html.includes("renderVehicleAlerts"), "Bağlamsal akıllı denetimler kaybolmuş."],
  [read("scripts/command-layout-v4_48_23.js").includes("grid-template-rows: auto minmax(0, 1fr)"), "Tam boy komuta kart yerleşimi eksik."],
  [workflow.includes("node scripts/ui-regression-check.js") && workflow.includes("node scripts/finance-maintenance-regression-check.js"), "APK iş akışında regresyon testleri eksik."]
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) throw new Error(failures.join("\n"));
console.log(`Arayüz ve mimari regresyon kontrolleri geçti (${checks.length} kontrol).`);
