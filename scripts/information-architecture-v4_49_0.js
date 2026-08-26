(function () {
  "use strict";

  if (window.__SYS_INFORMATION_ARCHITECTURE_V4490__) return;
  window.__SYS_INFORMATION_ARCHITECTURE_V4490__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const FINANCE_GROUPS = [
    { label: "Özet", tabs: [["overview", "Genel Özet"]] },
    { label: "Gelir & Tahsilat", tabs: [["personnel", "Personel"], ["invoices", "Fatura / Tahsilat"], ["school", "Okul"]] },
    { label: "Gider & Borçlar", tabs: [["flow", "Gider / Borç"], ["staff", "Şoför / Rehber"]] },
    { label: "Maliyet & Kârlılık", tabs: [["cost-report", "Maliyet"], ["profitability", "Kârlılık"]] },
    { label: "Raporlar", tabs: [["reports", "Rapor Merkezi"]] }
  ];

  const VEHICLE_TABS = [
    ["overview", "Genel Durum"],
    ["records", "Araç Giderleri"],
    ["maintenance", "Bakım & Mekanik"],
    ["fuel", "Yakıt"],
    ["km", "KM Analizi"],
    ["depreciation", "Amortisman"]
  ];

  function installStyles() {
    if ($("#sys-information-architecture-v4490")) return;
    const style = document.createElement("style");
    style.id = "sys-information-architecture-v4490";
    style.textContent = `
      .nav-submenu{display:grid;gap:3px;margin:-2px 0 5px 14px;padding-left:10px;border-left:1px solid color-mix(in srgb,var(--border) 75%,transparent)}
      .nav-submenu .nav-btn{min-height:39px;padding:8px 12px;font-size:12px}.nav-submenu .dot{width:7px;height:7px}
      .nav-btn[data-module="operations"] .dot{background:#38bdf8;box-shadow:0 0 11px rgba(56,189,248,.65)}
      .nav-btn[data-module="vehicle"] .dot{background:#f97316;box-shadow:0 0 11px rgba(249,115,22,.65)}
      #screen-operations,#screen-vehicle{height:100%;overflow:auto!important;padding:clamp(12px,1.6vw,22px);scrollbar-gutter:stable}
      .center-shell{display:grid;gap:14px;min-width:0;padding-bottom:22px}.center-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;padding:20px;border:1px solid rgba(56,189,248,.22);border-radius:20px;background:radial-gradient(circle at 100% 0%,rgba(14,165,233,.14),transparent 40%),var(--panel)}
      .center-hero small{color:#7dd3fc;font-weight:950;letter-spacing:.12em}.center-hero h2{margin:6px 0;font-size:clamp(23px,3vw,36px)}.center-hero p{max-width:760px;margin:0;color:var(--muted);line-height:1.45}.center-hero-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
      .center-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.center-metric{padding:14px;border:1px solid var(--border);border-radius:16px;background:var(--panel);text-align:left;color:var(--text)}.center-metric span,.center-metric strong,.center-metric small{display:block}.center-metric span{color:var(--muted);font-size:9px;letter-spacing:.08em}.center-metric strong{margin-top:5px;font-size:24px}.center-metric small{margin-top:3px;color:var(--muted)}
      .center-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.center-action-card{min-height:150px;padding:17px;border:1px solid var(--border);border-radius:18px;background:var(--panel);color:var(--text);text-align:left;cursor:pointer}.center-action-card b{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:rgba(56,189,248,.12);color:#7dd3fc}.center-action-card strong{display:block;margin-top:14px;font-size:17px}.center-action-card span{display:block;margin-top:7px;color:var(--muted);line-height:1.45}
      .center-host{display:grid;gap:12px;min-width:0}.center-host:empty{display:none}.center-host>.card,.center-host>.settings-panel,.center-host>.finance-tab-screen{width:100%!important;max-width:none!important;margin:0!important}
      .vehicle-center-tabs{display:flex;gap:7px;overflow:auto;padding:3px 0 6px}.vehicle-center-tab{flex:0 0 auto;min-height:42px;padding:9px 14px;border:1px solid var(--border);border-radius:999px;background:var(--panel);color:var(--muted);font-weight:800;cursor:pointer}.vehicle-center-tab.active{border-color:rgba(56,189,248,.44);background:rgba(14,165,233,.13);color:#bae6fd}
      .vehicle-center-view{display:none;min-width:0}.vehicle-center-view.active{display:grid;gap:12px}.vehicle-center-view>.finance-tab-screen{display:block!important}.vehicle-center-view .finance-section-period{display:none!important}
      #vehicle-center-records .finance-flow-subscreen{display:block!important}#vehicle-center-records .vehicle-expense-summary-panel{margin-bottom:12px!important}
      #financeTabs.finance-grouped-tabs{display:flex!important;align-items:stretch;gap:8px;overflow:auto;padding:5px 2px}.finance-tab-group{display:flex;align-items:center;gap:5px;padding:5px;border:1px solid var(--border);border-radius:15px;background:color-mix(in srgb,var(--panel) 88%,transparent)}.finance-tab-group>small{padding:0 5px;color:var(--muted);font-size:8px;letter-spacing:.08em;white-space:nowrap}.finance-tab-group .tab{min-height:36px!important;padding:8px 10px!important;white-space:nowrap}
      #screen-finance .finance-section-period{display:none!important}#screen-finance>.finance-global-period,#screen-finance .finance-global-period{display:flex!important}
      .top-warning-center{position:relative;min-width:42px}.top-warning-center.has-warning{border-color:rgba(245,158,11,.45);color:#fbbf24}.top-warning-center b{display:inline-grid;place-items:center;min-width:17px;height:17px;margin-left:4px;padding:0 4px;border-radius:999px;background:rgba(245,158,11,.16);font-size:9px}
      #screen-school .school-ai-center .school-ai-body,#screen-school .school-ai-center .school-ai-metrics{display:none!important}#screen-school .school-ai-center{padding:12px!important}.session-user-chip{padding-left:10px!important}
      @media(max-width:1050px){.center-metrics{grid-template-columns:1fr 1fr}.center-card-grid{grid-template-columns:1fr}.center-hero{display:grid}.center-hero-actions{justify-content:flex-start}.finance-tab-group>small{display:none}}
      @media(max-width:620px){.center-metrics{grid-template-columns:1fr}.nav-submenu{margin-left:8px}.vehicle-center-tabs{position:sticky;top:0;z-index:4;background:var(--bg);padding-top:7px}}
    `;
    document.head.appendChild(style);
  }

  function callModule(moduleName, callback) {
    if (typeof activateModule === "function") activateModule(moduleName);
    if (typeof callback === "function") window.setTimeout(callback, 40);
  }

  function buildOperationsCenter() {
    const screen = $("#screen-operations");
    if (!screen || screen.dataset.ready === "1") return;
    screen.dataset.ready = "1";
    screen.innerHTML = `
      <div class="center-shell operations-center-shell">
        <header class="center-hero"><div><small>GÜNLÜK OPERASYON MERKEZİ</small><h2>Servis akışları tek yerde</h2><p>Canlı servisler Komuta Paneli'nde kalır; planlama, düzeltme ve günlük kontrol işlemleri burada yönetilir.</p></div><div class="center-hero-actions"><button class="btn primary" data-center-module="driver" type="button">Sürüş Ekranı</button><button class="btn" data-operation-warning type="button">Uyarıları Kontrol Et</button></div></header>
        <div class="center-metrics"><button class="center-metric" data-center-module="personnel"><span>AKTİF SERVİS</span><strong id="operationsActiveCount">0</strong><small>Personel + okul</small></button><button class="center-metric" data-center-module="registry" data-registry-target="people"><span>AKTİF PERSONEL</span><strong id="operationsPeopleCount">0</strong><small>Kayıtlı personel</small></button><button class="center-metric" data-center-module="registry" data-registry-target="students"><span>AKTİF ÖĞRENCİ</span><strong id="operationsStudentCount">0</strong><small>Kayıtlı öğrenci</small></button><button class="center-metric" data-operation-history><span>EKSİK SERVİS</span><strong id="operationsMissingCount">0</strong><small>Düzeltme bekleyen</small></button></div>
        <div class="center-card-grid"><button class="center-action-card" data-center-module="personnel"><b>P</b><strong>Personel Operasyonu</strong><span>Servis planı, yoklama, rota ve günlük hareketleri yönet.</span></button><button class="center-action-card" data-center-module="school"><b>O</b><strong>Okul Operasyonu</strong><span>Öğrenci, rehber, veli bildirimi ve okul servis akışını yönet.</span></button><button class="center-action-card" data-center-module="driver"><b>↗</b><strong>Sürüş Ekranı</strong><span>Sahada yalnız gereken düğmelerle personel veya okul servisini yürüt.</span></button></div>
        <div class="center-host" id="operationsHistoryHost"></div>
      </div>`;
    const historical = $("#historicalServiceCard");
    if (historical) {
      const kicker = $(".historical-service-kicker", historical);
      if (kicker) kicker.textContent = "OPERASYONLAR · GEÇMİŞ SERVİS DÜZELTME";
      $("#operationsHistoryHost")?.appendChild(historical);
    }
    screen.addEventListener("click", (event) => {
      const moduleButton = event.target.closest("[data-center-module]");
      if (moduleButton) {
        const target = moduleButton.dataset.registryTarget;
        return callModule(moduleButton.dataset.centerModule, target && typeof activateRegistryTab === "function" ? () => activateRegistryTab(target) : null);
      }
      if (event.target.closest("[data-operation-warning]")) return openWarningCenter();
      if (event.target.closest("[data-operation-history]")) $("#historicalServiceCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function vehicleDebt(record) {
    try { return typeof vehicleExpenseDebtAmount === "function" ? vehicleExpenseDebtAmount(record) : Math.max(0, Number(record?.amount || 0) - Number(record?.paidAmount || 0)); }
    catch (_) { return 0; }
  }

  function renderOperationsCenter() {
    if (!$("#screen-operations")) return;
    let personnel = 0, school = 0;
    try { personnel = activePersonnelServiceSessions().length; } catch (_) {}
    try { school = activeSchoolServiceSessions().length; } catch (_) {}
    if ($("#operationsActiveCount")) $("#operationsActiveCount").textContent = String(personnel + school);
    if ($("#operationsPeopleCount")) $("#operationsPeopleCount").textContent = String((state.people || []).filter((item) => item.status === "Aktif").length);
    if ($("#operationsStudentCount")) $("#operationsStudentCount").textContent = String((state.students || []).filter((item) => item.status === "Aktif").length);
    const missing = Number($("#historicalServiceMissingCount")?.textContent || 0);
    if ($("#operationsMissingCount")) $("#operationsMissingCount").textContent = String(missing);
  }

  function moveToHost(selector, hostSelector) {
    const node = $(selector);
    const host = $(hostSelector);
    if (node && host && node.parentElement !== host) host.appendChild(node);
    return node;
  }

  function buildVehicleCenter() {
    const screen = $("#screen-vehicle");
    if (!screen || screen.dataset.ready === "1") return;
    screen.dataset.ready = "1";
    screen.innerHTML = `
      <div class="center-shell vehicle-center-shell">
        <header class="center-hero"><div><small>ARAÇ MERKEZİ</small><h2>Aracın maliyeti ve sağlığı</h2><p>Gider, bakım, parça, yakıt kilometresi, tahmin ve amortisman aynı araç geçmişinde birleşir.</p></div><div class="center-hero-actions"><select id="vehicleCenterMonth" aria-label="Araç merkezi ayı"></select><button class="btn primary" data-vehicle-tab-open="records" type="button">Yeni Gider</button></div></header>
        <div class="center-metrics"><div class="center-metric"><span>ARAÇ</span><strong id="vehicleCenterVehicleCount">0</strong><small>Aktif kayıt</small></div><div class="center-metric"><span>BAKIM KAYDI</span><strong id="vehicleCenterMaintenanceCount">0</strong><small>Geçmiş kayıt</small></div><div class="center-metric"><span>AÇIK BORÇ</span><strong id="vehicleCenterDebt">₺0</strong><small>Araç giderleri</small></div><div class="center-metric"><span>KM KAYDI</span><strong id="vehicleCenterKmCount">0</strong><small>Yakıt ve manuel giriş</small></div></div>
        <nav class="vehicle-center-tabs" aria-label="Araç merkezi bölümleri">${VEHICLE_TABS.map(([id,label]) => `<button class="vehicle-center-tab ${id === "overview" ? "active" : ""}" data-vehicle-tab="${id}" type="button">${label}</button>`).join("")}</nav>
        <section class="vehicle-center-view active" data-vehicle-view="overview"><div class="center-card-grid"><button class="center-action-card" data-vehicle-tab-open="maintenance"><b>⚙</b><strong>Bakım & Mekanik</strong><span>Bakım gideri, parça geçmişi ve öğrenen değişim tahminleri.</span></button><button class="center-action-card" data-vehicle-tab-open="fuel"><b>⛽</b><strong>Yakıt ve KM</strong><span>Motorin fiyatı, indirim ve yakıt alımlarından gelen kilometre.</span></button><button class="center-action-card" data-vehicle-tab-open="depreciation"><b>₺</b><strong>Amortisman</strong><span>Araç değer kaybı ve aylık maliyet yükü.</span></button></div></section>
        <section class="vehicle-center-view" id="vehicle-center-records" data-vehicle-view="records"></section>
        <section class="vehicle-center-view" id="vehicle-center-maintenance" data-vehicle-view="maintenance"></section>
        <section class="vehicle-center-view" id="vehicle-center-fuel" data-vehicle-view="fuel"></section>
        <section class="vehicle-center-view" id="vehicle-center-km" data-vehicle-view="km"></section>
        <section class="vehicle-center-view" id="vehicle-center-depreciation" data-vehicle-view="depreciation"></section>
      </div>`;

    const expenseSummary = $(".vehicle-expense-summary-panel");
    const monthly = $('[data-finance-flow-screen="monthly"]');
    if (expenseSummary && monthly) monthly.insertBefore(expenseSummary, monthly.firstChild);
    $('[data-finance-flow-screen="expenses"]')?.remove();
    moveToHost('[data-finance-flow-screen="monthly"]', "#vehicle-center-records");
    moveToHost("#finance-tab-maintenance", "#vehicle-center-maintenance");
    moveToHost("#fuelPriceSettingsCard", "#vehicle-center-fuel");
    moveToHost("#discountFuelSettingsCard", "#vehicle-center-fuel");
    moveToHost("#finance-tab-km", "#vehicle-center-km");
    moveToHost("#finance-tab-depreciation", "#vehicle-center-depreciation");

    const monthSelect = $("#vehicleCenterMonth");
    const financeMonth = $("#financeMonth");
    if (monthSelect && financeMonth) {
      monthSelect.innerHTML = financeMonth.innerHTML;
      monthSelect.value = financeMonth.value;
      monthSelect.addEventListener("change", () => {
        financeMonth.value = monthSelect.value;
        financeMonth.dispatchEvent(new Event("change", { bubbles: true }));
        renderVehicleCenter();
      });
    }
    screen.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-vehicle-tab],[data-vehicle-tab-open]")?.dataset.vehicleTab || event.target.closest("[data-vehicle-tab-open]")?.dataset.vehicleTabOpen;
      if (tab) showVehicleTab(tab);
    });
  }

  function showVehicleTab(tabName = "overview") {
    const target = VEHICLE_TABS.some(([id]) => id === tabName) ? tabName : "overview";
    $$("[data-vehicle-tab]").forEach((button) => button.classList.toggle("active", button.dataset.vehicleTab === target));
    $$("[data-vehicle-view]").forEach((view) => view.classList.toggle("active", view.dataset.vehicleView === target));
    if (target === "records" && typeof renderVehicleExpenses === "function") renderVehicleExpenses();
    if (target === "maintenance") {
      if (typeof renderVehicleMaintenance === "function") renderVehicleMaintenance();
      if (typeof activateMaintenanceSubTab === "function") activateMaintenanceSubTab($("[data-maintenance-subtab].active")?.dataset.maintenanceSubtab || "entry");
    }
    if (target === "km" && typeof renderVehicleKmAnalysis === "function") renderVehicleKmAnalysis();
    if (target === "depreciation" && typeof renderFinanceDepreciation === "function") renderFinanceDepreciation();
    $("#screen-vehicle")?.scrollTo({ top: 0, behavior: "smooth" });
    renderVehicleCenter();
  }

  function renderVehicleCenter() {
    if ($("#vehicleCenterVehicleCount")) $("#vehicleCenterVehicleCount").textContent = String((state.vehicles || []).filter((item) => item.status !== "Pasif").length);
    if ($("#vehicleCenterMaintenanceCount")) $("#vehicleCenterMaintenanceCount").textContent = String((state.vehicleMaintenance || []).length);
    if ($("#vehicleCenterKmCount")) $("#vehicleCenterKmCount").textContent = String((state.vehicleKmRecords || []).length);
    const debt = (state.vehicleExpenses || []).reduce((sum, item) => sum + vehicleDebt(item), 0) + (state.vehicleMaintenance || []).reduce((sum, item) => sum + vehicleDebt(item), 0);
    if ($("#vehicleCenterDebt")) $("#vehicleCenterDebt").textContent = debt.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
  }

  function groupFinanceNavigation() {
    const tabs = $("#financeTabs");
    if (!tabs || tabs.classList.contains("finance-grouped-tabs")) return;
    const buttons = new Map($$("[data-finance-tab]", tabs).map((button) => [button.dataset.financeTab, button]));
    tabs.replaceChildren();
    FINANCE_GROUPS.forEach((group) => {
      const host = document.createElement("div");
      host.className = "finance-tab-group";
      host.innerHTML = `<small>${group.label}</small>`;
      group.tabs.forEach(([id, label]) => {
        const button = buttons.get(id);
        if (!button) return;
        button.textContent = label;
        host.appendChild(button);
      });
      tabs.appendChild(host);
    });
    tabs.classList.add("finance-grouped-tabs");

    const flowTabs = $("#financeFlowSubtabs");
    if (flowTabs) {
      const entry = $('[data-finance-flow-tab="entry"]', flowTabs);
      const monthly = $('[data-finance-flow-tab="monthly"]', flowTabs);
      if (entry) entry.textContent = "Gider Kaydı";
      if (monthly) monthly.textContent = "Araç Giderleri";
      $('[data-finance-flow-tab="expenses"]', flowTabs)?.remove();
    }
    const entryTitle = $('[data-finance-flow-screen="entry"] .finance-flow-table-panel .panel-title');
    if (entryTitle) entryTitle.textContent = "Gelir / Gider Kayıtları";
  }

  function moveReportTools() {
    const reports = $("#finance-tab-reports");
    const csvCard = $(".settings-csv-card");
    if (reports && csvCard && !reports.contains(csvCard)) reports.insertBefore(csvCard, reports.firstChild);
    if (reports && !$("#financeAttendanceShortcuts")) {
      const shortcuts = document.createElement("section");
      shortcuts.className = "card panel";
      shortcuts.id = "financeAttendanceShortcuts";
      shortcuts.innerHTML = '<div class="panel-header"><div><h2 class="panel-title">Operasyon Raporları</h2><div class="panel-sub">Personel ve okul çetele raporlarına hızlı erişim.</div></div></div><div class="settings-actions"><button class="btn" data-report-shortcut="personnel" type="button">Personel Raporları</button><button class="btn" data-report-shortcut="school" type="button">Okul Raporları</button></div>';
      reports.insertBefore(shortcuts, reports.firstChild);
      shortcuts.addEventListener("click", (event) => {
        const kind = event.target.closest("[data-report-shortcut]")?.dataset.reportShortcut;
        if (kind === "personnel") return callModule("personnel", () => typeof activateTab === "function" && activateTab("reports"));
        if (kind === "school") return callModule("school", () => typeof activateSchoolTab === "function" && activateSchoolTab("reports"));
      });
    }
  }

  function installFinanceRouting() {
    if (typeof activateFinanceFlowTab === "function" && !activateFinanceFlowTab.__v4490) {
      const previousFlow = activateFinanceFlowTab;
      const wrappedFlow = function (tabName, options) { return previousFlow(tabName === "expenses" ? "monthly" : tabName, options); };
      wrappedFlow.__v4490 = true;
      activateFinanceFlowTab = wrappedFlow;
    }
    if (typeof activateFinanceTab === "function" && !activateFinanceTab.__v4490) {
      const previousFinance = activateFinanceTab;
      const wrappedFinance = function (tabName) {
        if (["maintenance", "km", "depreciation"].includes(tabName)) {
          if (typeof activateModule === "function") activateModule("vehicle");
          return showVehicleTab(tabName);
        }
        return previousFinance(tabName);
      };
      wrappedFinance.__v4490 = true;
      activateFinanceTab = wrappedFinance;
    }
  }

  function warningCount() {
    try {
      if (typeof buildAiFindings === "function") return buildAiFindings().filter((item) => !item.ignored).length;
    } catch (_) {}
    let count = 0;
    try { count += getOperationWarnings().length; } catch (_) {}
    try { count += schoolWarningCount(); } catch (_) {}
    try { count += financeSidebarWarningCount(); } catch (_) {}
    return count;
  }

  function openWarningCenter() {
    if (typeof openAiInspector === "function") return openAiInspector();
    if (typeof activateModule === "function") activateModule("operations");
  }

  function installTopWarningCenter() {
    const controls = $("#sessionControls");
    const search = $("#globalSmartSearchBtn");
    if (!controls || $("#topWarningCenter")) return;
    const button = document.createElement("button");
    button.id = "topWarningCenter";
    button.className = "btn small top-warning-center";
    button.type = "button";
    button.innerHTML = 'Uyarılar <b>0</b>';
    button.addEventListener("click", openWarningCenter);
    controls.insertBefore(button, search || controls.firstChild);
  }

  function renderWarningCenter() {
    const button = $("#topWarningCenter");
    if (!button) return;
    const count = warningCount();
    $("b", button).textContent = count > 99 ? "99+" : String(count);
    button.classList.toggle("has-warning", count > 0);
    button.title = count ? `${count} kayıt kontrol bekliyor` : "Açık uyarı yok";
  }

  function installRenderHook() {
    if (typeof renderAll !== "function" || renderAll.__architectureV4490) return;
    const previous = renderAll;
    const wrapped = function () {
      const result = previous.apply(this, arguments);
      renderOperationsCenter();
      renderVehicleCenter();
      renderWarningCenter();
      return result;
    };
    wrapped.__architectureV4490 = true;
    renderAll = wrapped;
  }

  function install() {
    installStyles();
    $(".sys-ai-nav")?.remove();
    $("#screen-sys-ai")?.remove();
    buildOperationsCenter();
    buildVehicleCenter();
    groupFinanceNavigation();
    moveReportTools();
    installFinanceRouting();
    installTopWarningCenter();
    installRenderHook();
    renderOperationsCenter();
    renderVehicleCenter();
    renderWarningCenter();
    window.SYS_OPEN_VEHICLE_CENTER = (tab = "overview") => { if (typeof activateModule === "function") activateModule("vehicle"); showVehicleTab(tab); };
    window.SYS_OPEN_WARNING_CENTER = openWarningCenter;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
