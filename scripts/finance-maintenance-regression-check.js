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
  state: { vehicleMaintenance: [], vehicleExpenses: [], financeRecords: [], staffPayments: [], schoolPayments: [], vehicles: [] },
  normalize: (value) => String(value ?? "").toLocaleLowerCase("tr-TR").trim(),
  todayISO: () => "2026-08-13",
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
  sourceBlock("    const MAINTENANCE_PART_CATALOG", "    function renderVehicleMaintenanceOptions"),
  sourceBlock("    function financeAvailableYears", "    function profitabilityMargin"),
  "this.api = { vehicleExpenseDebtAmount, maintenancePartAnalysis, financeAnnualRows };"
].join("\n"), context);

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const { vehicleExpenseDebtAmount, maintenancePartAnalysis, financeAnnualRows } = context.api;
check(vehicleExpenseDebtAmount({ amount: 500, paymentMethod: "Nakit" }) === 0, "Eski nakit kayıt borca dönüşmemeli.");
check(vehicleExpenseDebtAmount({ amount: 900, paymentMethod: "Veresiye" }) === 900, "Veresiye kaydı açık borç olmalı.");
check(vehicleExpenseDebtAmount({ amount: 900, paymentStatus: "partial", paidAmount: 250 }) === 650, "Kısmi ödeme kalanı yanlış.");

context.state.vehicleMaintenance = [
  { id: "m1", vehicleId: "v1", date: "2025-01-01", km: 100000, parts: [{ name: "Fren Balatası" }] },
  { id: "m2", vehicleId: "v1", date: "2025-08-01", km: 120000, parts: [{ name: "Fren Balatası" }] },
  { id: "m3", vehicleId: "v1", date: "2026-03-01", km: 142000, parts: [{ name: "Fren Balatası" }] }
];

const prediction = maintenancePartAnalysis("v1", "Fren Balatası");
check(prediction.sampleCount === 2, "Parça değişim aralığı sayısı yanlış.");
check(prediction.intervalKm === 21300, "Ağırlıklı değişim aralığı yanlış.");
check(prediction.nextKm === 163300, "Sonraki değişim tahmini yanlış.");

const editPrediction = maintenancePartAnalysis("v1", "Fren Balatası", { excludeId: "m3", currentKm: 142000, currentDate: "2026-03-01" });
check(editPrediction.nextKm === 163300, "Düzenleme sırasındaki tahmin yanlış.");

const annual = financeAnnualRows(2026);
check(annual.length === 12, "Yıllık görünüm 12 ay üretmeli.");
check(annual[11].month === "2026-12" && annual[11].debt === 5, "Yıllık ay veya borç verisi yanlış.");

console.log(`Finans ve bakım işlev kontrolleri geçti (9 kontrol). Tahmin: ${prediction.intervalKm} km → ${prediction.nextKm} km.`);
