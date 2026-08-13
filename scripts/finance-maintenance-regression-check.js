"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function sourceBlock(startText, endText) {
  const start = html.indexOf(startText);
  const end = html.indexOf(endText, start);
  if (start < 0 || end < 0) throw new Error(`Kaynak bloğu bulunamadı: ${startText}`);
  return html.slice(start, end);
}

const context = {
  console,
  state: { vehicleMaintenance: [], maintenancePartCatalog: [], vehicleExpenses: [], vehicleKmRecords: [], privateVehicleUses: [], documents: [], financeRecords: [], staffPayments: [], schoolPayments: [], vehicles: [] },
  window: {},
  normalize: (value) => String(value ?? "").toLocaleLowerCase("tr-TR").trim(),
  todayISO: () => "2026-08-13",
  dateOnlyValue: (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? new Date(`${value}T00:00:00`) : null,
  getFinanceMonth: () => "2026-08",
  financeOverviewTotals: (month) => ({
    revenue: Number(month.slice(-2)) * 100,
    collected: 50,
    vehicle: { total: 20, debt: 5 },
    staff: { total: 10 },
    depreciation: { total: 2 },
    totalExpense: 32,
    net: Number(month.slice(-2)) * 100 - 32
  }),
  $: () => null,
  parseFinanceDecimal: (value) => Number(value || 0),
  formatTRY: (value) => String(value),
  jobDateText: (value) => String(value),
  escapeHtml: (value) => String(value),
  uid: (prefix) => `${prefix}-test`,
  financeMonthTitle: (month) => month,
  financeSummaryChipHtml: () => "",
  appConfirm: async () => true,
  saveState: () => true,
  showToast: () => {},
  activateFinanceFlowTab: () => {},
  vehicleLabel: (id) => id,
  daysFromToday: () => 1,
  document: { querySelectorAll: () => [] },
  Date
};

vm.createContext(context);
vm.runInContext([
  sourceBlock("    const EXPENSE_PAYMENT_STATUS_LABELS", "    function clampExpenseShare"),
  sourceBlock("    const DEFAULT_MAINTENANCE_PART_CATALOG", "    function defaultMaintenancePartCatalog"),
  sourceBlock("    const MAINTENANCE_TYPE_TRACKING_DEFAULTS", "    function renderVehicleMaintenanceOptions"),
  sourceBlock("    function financeAvailableYears", "    function profitabilityMargin"),
  "this.api = { vehicleExpenseDebtAmount, maintenancePartAnalysis, maintenanceTrackingAnalysis, maintenancePredictionRows, vehicleCurrentKmFromActivity, vehicleMonthlyMileageEstimate, financeAnnualRows };"
].join("\n"), context);

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const { vehicleExpenseDebtAmount, maintenancePartAnalysis, maintenanceTrackingAnalysis, maintenancePredictionRows, vehicleCurrentKmFromActivity, vehicleMonthlyMileageEstimate, financeAnnualRows } = context.api;
check(vehicleExpenseDebtAmount({ amount: 500, paymentMethod: "Nakit" }) === 0, "Eski nakit kayıt borca dönüşmemeli.");
check(vehicleExpenseDebtAmount({ amount: 900, paymentMethod: "Veresiye" }) === 900, "Veresiye kaydı açık borç olmalı.");
check(vehicleExpenseDebtAmount({ amount: 900, paymentStatus: "partial", paidAmount: 250 }) === 650, "Kısmi ödeme kalanı yanlış.");

context.state.maintenancePartCatalog = [{ id: "part-brake", name: "Fren Balatası", category: "Fren Sistemi", status: "Aktif", defaultIntervalKm: 30000, defaultIntervalMonths: 24 }];
context.state.vehicleMaintenance = [
  { id: "m1", vehicleId: "v1", date: "2025-01-01", km: 100000, parts: [{ catalogPartId: "part-brake", name: "Fren Balatası" }] },
  { id: "m2", vehicleId: "v1", date: "2025-08-01", km: 120000, parts: [{ catalogPartId: "part-brake", name: "Fren Balatası" }] },
  { id: "m3", vehicleId: "v1", date: "2026-03-01", km: 142000, parts: [{ catalogPartId: "part-brake", name: "Fren Balatası" }] }
];
context.state.vehicles = [{ id: "v1", plate: "34 TEST 01", currentKm: 146000 }];

const prediction = maintenancePartAnalysis("v1", "Fren Balatası");
check(prediction.sampleCount === 2, "Parça değişim aralığı sayısı yanlış.");
check(prediction.intervalKm === 21300, "Ağırlıklı değişim aralığı yanlış.");
check(prediction.nextKm === 163300, "Sonraki değişim tahmini yanlış.");

const editPrediction = maintenancePartAnalysis("v1", "Fren Balatası", { excludeId: "m3", currentKm: 142000, currentDate: "2026-03-01" });
check(editPrediction.nextKm === 163300, "Düzenleme sırasındaki tahmin yanlış.");
context.state.maintenancePartCatalog[0].name = "Ön Fren Balatası";
const renamedCatalogPrediction = maintenancePartAnalysis("v1", "Ön Fren Balatası", { catalogPartId: "part-brake" });
check(renamedCatalogPrediction.nextKm === 163300, "Katalog adı değiştiğinde parça geçmişi kimlikle korunmalı.");

context.state.vehicleExpenses = [
  { id: "fuel1", vehicleId: "v1", type: "Yakıt", date: "2026-01-01", km: 142000 },
  { id: "fuel2", vehicleId: "v1", type: "Yakıt", date: "2026-02-01", km: 145000 },
  { id: "fuel3", vehicleId: "v1", type: "Yakıt", date: "2026-03-01", km: 148000 }
];
check(vehicleCurrentKmFromActivity("v1") === 148000, "Yakıt kaydı araç güncel KM değerini beslemeli.");
const mileage = vehicleMonthlyMileageEstimate("v1");
check(mileage.source === "Yakıt KM kayıtları", "Aylık kullanımda yakıt KM kaynağı öncelikli olmalı.");
check(mileage.monthlyKm === 3096, "Yakıt geçmişinden aylık KM tahmini yanlış.");

context.state.vehicles.push({ id: "v2", plate: "34 TEST 02", currentKm: 50000 });
context.state.vehicleMaintenance.push({ id: "service1", vehicleId: "v2", vehiclePlate: "34 TEST 02", date: "2026-08-13", km: 50000, type: "Periyodik Bakım", parts: [] });
const servicePrediction = maintenanceTrackingAnalysis("v2", "maintenance:periyodik bakım");
check(servicePrediction.nextKm === 65000, "İlk periyodik bakım kaydı başlangıç aralığıyla hedef üretmeli.");
const trackingRows = maintenancePredictionRows({ allVehicles: true });
check(trackingRows.some((row) => row.vehicleId === "v2" && row.kind === "maintenance" && row.itemName === "Periyodik Bakım"), "Parçasız bakım kaydı akıllı takipte görünmeli.");
check(trackingRows.some((row) => row.kind === "part" && row.itemName === "Fren Balatası"), "Parça geçmişi akıllı takipte korunmalı.");

const annual = financeAnnualRows(2026);
check(annual.length === 12, "Yıllık görünüm 12 ay üretmeli.");
check(annual[11].month === "2026-12" && annual[11].debt === 5, "Yıllık ay veya borç verisi yanlış.");

console.log(`Finans ve bakım işlev kontrolleri geçti (16 kontrol). Tahmin: ${prediction.intervalKm} km → ${prediction.nextKm} km.`);
