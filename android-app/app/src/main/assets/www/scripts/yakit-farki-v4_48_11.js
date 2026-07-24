(function () {
  "use strict";

  const MODULE_ID = "sys-fuel-difference-v4-48-11";
  const MODULE_VERSION = "4.48.11";
  if (window.__SYS_FUEL_DIFFERENCE_MODULE__ === MODULE_VERSION) return;
  window.__SYS_FUEL_DIFFERENCE_MODULE__ = MODULE_VERSION;

  const byId = (id) => document.getElementById(id);
  const numberValue = (value) => {
    const parsed = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const roundMoney = (value) => Math.round((numberValue(value) + Number.EPSILON) * 100) / 100;
  const formatMoney = (value) => {
    try {
      if (typeof formatTRY === "function") return formatTRY(numberValue(value));
    } catch (_) {}
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(numberValue(value));
  };
  const safeText = (value) => {
    try {
      if (typeof escapeHtml === "function") return escapeHtml(String(value ?? ""));
    } catch (_) {}
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };
  const today = () => {
    try {
      if (typeof todayISO === "function") return todayISO();
    } catch (_) {}
    return new Date().toISOString().slice(0, 10);
  };

  function ensureStateCompatibility() {
    if (typeof state === "undefined" || !state || !Array.isArray(state.jobs)) {
      throw new Error("SYS durum verisi hazır değil.");
    }
  }

  function liveFuelPrices() {
    const cache = state?.settings?.fuelPriceCache || {};
    const shell = numberValue(cache.shell);
    const opet = numberValue(cache.opet);
    const available = [shell, opet].filter((value) => value > 0);
    return {
      shell,
      opet,
      average: available.length ? available.reduce((sum, value) => sum + value, 0) / available.length : 0,
      updatedAt: cache.updatedAt || "",
      source: cache.source || ""
    };
  }

  function normalizeFuelAdjustment(job) {
    const raw = job?.fuelAdjustment && typeof job.fuelAdjustment === "object" ? job.fuelAdjustment : {};
    return {
      enabled: Boolean(raw.enabled),
      referencePrice: numberValue(raw.referencePrice),
      threshold: numberValue(raw.threshold) > 0 ? numberValue(raw.threshold) : 30,
      source: ["average", "shell", "opet", "manual"].includes(raw.source) ? raw.source : "average",
      manualCurrentPrice: numberValue(raw.manualCurrentPrice),
      calculationMode: ["actual", "fuelShare", "full"].includes(raw.calculationMode) ? raw.calculationMode : "actual",
      dailyKm: numberValue(raw.dailyKm),
      consumption: numberValue(raw.consumption) || 12,
      fuelShare: numberValue(raw.fuelShare) || 35,
      lastAppliedAt: raw.lastAppliedAt || "",
      lastAppliedPrice: numberValue(raw.lastAppliedPrice),
      lastAppliedIncreasePercent: numberValue(raw.lastAppliedIncreasePercent),
      lastEvaluatedPrice: numberValue(raw.lastEvaluatedPrice),
      history: Array.isArray(raw.history) ? raw.history.slice(-50) : []
    };
  }

  function currentPriceFor(adjustment) {
    const prices = liveFuelPrices();
    if (adjustment.source === "shell") return prices.shell;
    if (adjustment.source === "opet") return prices.opet;
    if (adjustment.source === "manual") return adjustment.manualCurrentPrice;
    return prices.average;
  }

  function workdaysPerMonth(job) {
    const selected = Array.isArray(job?.workDays) && job.workDays.length ? job.workDays.length : 5;
    return selected * 4.33;
  }

  function calculateFuelDifference(job, suppliedAdjustment) {
    const adjustment = suppliedAdjustment || normalizeFuelAdjustment(job);
    const referencePrice = numberValue(adjustment.referencePrice);
    const currentPrice = currentPriceFor(adjustment);
    const threshold = Math.max(numberValue(adjustment.threshold) || 30, 0.01);
    const increasePercent = referencePrice > 0 ? ((currentPrice - referencePrice) / referencePrice) * 100 : 0;
    const baseContractPrice = job?.billingModel === "monthly"
      ? numberValue(job?.monthlyPrice)
      : numberValue(job?.tripPrice);

    let suggestedDifference = 0;
    let dailyDifference = 0;
    let perTripDifference = 0;
    let monthlyDifference = 0;

    if (referencePrice > 0 && currentPrice > 0) {
      if (adjustment.calculationMode === "actual") {
        const litersPerDay = Math.max(numberValue(adjustment.dailyKm), 0) * Math.max(numberValue(adjustment.consumption), 0) / 100;
        dailyDifference = (currentPrice - referencePrice) * litersPerDay;
        const plannedTrips = Math.max(numberValue(job?.plannedTripsPerDay) || 1, 1);
        perTripDifference = dailyDifference / plannedTrips;
        monthlyDifference = dailyDifference * workdaysPerMonth(job);
        suggestedDifference = job?.billingModel === "monthly" ? monthlyDifference : perTripDifference;
      } else if (adjustment.calculationMode === "fuelShare") {
        suggestedDifference = baseContractPrice * (Math.max(numberValue(adjustment.fuelShare), 0) / 100) * (increasePercent / 100);
        if (job?.billingModel === "monthly") monthlyDifference = suggestedDifference;
        else perTripDifference = suggestedDifference;
      } else {
        suggestedDifference = baseContractPrice * (increasePercent / 100);
        if (job?.billingModel === "monthly") monthlyDifference = suggestedDifference;
        else perTripDifference = suggestedDifference;
      }
    }

    suggestedDifference = roundMoney(Math.max(suggestedDifference, 0));
    dailyDifference = roundMoney(Math.max(dailyDifference, 0));
    perTripDifference = roundMoney(Math.max(perTripDifference, 0));
    monthlyDifference = roundMoney(Math.max(monthlyDifference, 0));

    let code = "disabled";
    let label = "Takip Kapalı";
    if (adjustment.enabled) {
      if (!(referencePrice > 0) || !(currentPrice > 0)) {
        code = "missing";
        label = "Fiyat Bilgisi Eksik";
      } else if (increasePercent >= threshold) {
        code = "due";
        label = "Yakıt Farkı Kes";
      } else if (increasePercent >= Math.max(threshold - 5, threshold * 0.82)) {
        code = "near";
        label = "Sınıra Yaklaşıyor";
      } else if (increasePercent < 0) {
        code = "down";
        label = "Motorin Fiyatı Düştü";
      } else {
        code = "normal";
        label = "Normal";
      }
    }

    return {
      adjustment,
      referencePrice,
      currentPrice,
      threshold,
      increasePercent,
      baseContractPrice,
      suggestedDifference,
      newContractPrice: roundMoney(baseContractPrice + suggestedDifference),
      dailyDifference,
      perTripDifference,
      monthlyDifference,
      code,
      label
    };
  }

  function fuelSourceLabel(source) {
    if (source === "shell") return "Shell canlı fiyat";
    if (source === "opet") return "OPET canlı fiyat";
    if (source === "manual") return "Manuel fiyat";
    return "Shell + OPET ortalaması";
  }

  function calculationLabel(mode) {
    if (mode === "fuelShare") return "Sözleşmedeki yakıt payı";
    if (mode === "full") return "Sözleşme bedelinin tamamı";
    return "KM ve gerçek tüketim";
  }

  function injectStyles() {
    if (byId(`${MODULE_ID}-style`)) return;
    const style = document.createElement("style");
    style.id = `${MODULE_ID}-style`;
    style.textContent = `
      .sys-fuel-contract {
        grid-column: 1 / -1;
        margin: 4px 0 2px;
        padding: 16px;
        border: 1px solid rgba(245,158,11,.28);
        border-radius: 16px;
        background: linear-gradient(145deg, rgba(245,158,11,.09), rgba(255,255,255,.025));
      }
      .sys-fuel-contract-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
      .sys-fuel-contract-title { font-weight:850; font-size:16px; letter-spacing:-.02em; }
      .sys-fuel-contract-sub { margin-top:4px; color:var(--muted); font-size:12px; line-height:1.45; }
      .sys-fuel-switch { display:flex; align-items:center; gap:8px; white-space:nowrap; font-weight:750; }
      .sys-fuel-switch input { width:18px; height:18px; accent-color:#f59e0b; }
      .sys-fuel-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
      .sys-fuel-grid .field { margin:0; }
      .sys-fuel-grid .field.span-2 { grid-column:span 2; }
      .sys-fuel-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
      .sys-fuel-preview { margin-top:12px; display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px; }
      .sys-fuel-metric { min-height:76px; padding:10px 11px; border:1px solid var(--line); border-radius:13px; background:rgba(0,0,0,.16); }
      .sys-fuel-metric span { display:block; color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.06em; }
      .sys-fuel-metric strong { display:block; margin-top:7px; font-size:15px; line-height:1.2; }
      .sys-fuel-status { margin-top:10px; padding:11px 12px; border-radius:13px; border:1px solid var(--line); background:rgba(255,255,255,.04); line-height:1.45; }
      .sys-fuel-status.due { border-color:rgba(255,77,94,.55); background:rgba(255,77,94,.13); }
      .sys-fuel-status.near { border-color:rgba(245,158,11,.55); background:rgba(245,158,11,.12); }
      .sys-fuel-status.normal { border-color:rgba(46,204,113,.42); background:rgba(46,204,113,.09); }
      .sys-fuel-status.missing { border-color:rgba(106,167,255,.45); background:rgba(106,167,255,.09); }
      .sys-fuel-history-note { margin-top:8px; color:var(--muted); font-size:11px; }
      .sys-fuel-inline { margin-top:7px; display:inline-flex; align-items:center; gap:6px; padding:5px 8px; border-radius:999px; font-size:11px; font-weight:800; border:1px solid var(--line); }
      .sys-fuel-inline.due { color:#fff; background:rgba(255,77,94,.18); border-color:rgba(255,77,94,.5); }
      .sys-fuel-inline.near { color:#ffe0a3; background:rgba(245,158,11,.14); border-color:rgba(245,158,11,.45); }
      .sys-fuel-inline.normal { color:#a7f3c0; background:rgba(46,204,113,.10); border-color:rgba(46,204,113,.34); }
      .sys-fuel-inline.missing { color:#bcd6ff; background:rgba(106,167,255,.10); border-color:rgba(106,167,255,.35); }
      .sys-fuel-command-banner { display:none; padding:12px 14px; border-radius:15px; border:1px solid rgba(255,77,94,.42); background:linear-gradient(135deg,rgba(255,77,94,.15),rgba(245,158,11,.08)); align-items:center; justify-content:space-between; gap:12px; }
      .sys-fuel-command-banner.active { display:flex; }
      .sys-fuel-command-banner strong { display:block; font-size:14px; }
      .sys-fuel-command-banner small { display:block; margin-top:4px; color:var(--muted); }
      .sys-fuel-warning-card { cursor:pointer; text-align:left; width:100%; }
      @media (max-width:980px) {
        .sys-fuel-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .sys-fuel-preview { grid-template-columns:repeat(2,minmax(0,1fr)); }
      }
      @media (max-width:640px) {
        .sys-fuel-contract-head { flex-direction:column; }
        .sys-fuel-grid { grid-template-columns:1fr; }
        .sys-fuel-grid .field.span-2 { grid-column:auto; }
        .sys-fuel-preview { grid-template-columns:1fr; }
        .sys-fuel-command-banner { align-items:flex-start; flex-direction:column; }
      }
    `;
    document.head.appendChild(style);
  }

  function formMarkup() {
    return `
      <section class="sys-fuel-contract" id="jobFuelDifferenceSection">
        <div class="sys-fuel-contract-head">
          <div>
            <div class="sys-fuel-contract-title">Sözleşme Yakıt Farkı Takibi</div>
            <div class="sys-fuel-contract-sub">Sözleşme başlangıç motorin fiyatını güncel Shell/OPET verisiyle karşılaştırır ve eşik aşıldığında uyarır.</div>
          </div>
          <label class="sys-fuel-switch"><input id="jobFuelEnabled" type="checkbox"> Takibi Aç</label>
        </div>
        <div class="sys-fuel-grid">
          <div class="field">
            <label for="jobFuelReferencePrice">Sözleşme Motorin Fiyatı (₺/L)</label>
            <input id="jobFuelReferencePrice" min="0" step="0.01" type="number" placeholder="Örn. 60.00">
          </div>
          <div class="field">
            <label for="jobFuelThreshold">Uyarı Eşiği (%)</label>
            <input id="jobFuelThreshold" min="0.01" step="0.1" type="number" value="30">
          </div>
          <div class="field">
            <label for="jobFuelSource">Güncel Fiyat Kaynağı</label>
            <select id="jobFuelSource">
              <option value="average">Shell + OPET Ortalaması</option>
              <option value="shell">Shell</option>
              <option value="opet">OPET</option>
              <option value="manual">Manuel</option>
            </select>
          </div>
          <div class="field">
            <label for="jobFuelCurrentPrice">Güncel Motorin Fiyatı (₺/L)</label>
            <input id="jobFuelCurrentPrice" min="0" step="0.01" type="number" placeholder="Canlı fiyat bekleniyor">
          </div>
          <div class="field span-2">
            <label for="jobFuelCalculationMode">Fark Hesaplama Yöntemi</label>
            <select id="jobFuelCalculationMode">
              <option value="actual">KM ve gerçek tüketim</option>
              <option value="fuelShare">Sözleşmedeki yakıt payı</option>
              <option value="full">Sözleşme bedelinin tamamına artış</option>
            </select>
          </div>
          <div class="field" data-fuel-actual-field>
            <label for="jobFuelDailyKm">Günlük Toplam KM</label>
            <input id="jobFuelDailyKm" min="0" step="0.1" type="number" placeholder="Örn. 120">
          </div>
          <div class="field" data-fuel-actual-field>
            <label for="jobFuelConsumption">Tüketim (L/100 KM)</label>
            <input id="jobFuelConsumption" min="0" step="0.1" type="number" value="12">
          </div>
          <div class="field" data-fuel-share-field>
            <label for="jobFuelShare">Sözleşmedeki Yakıt Payı (%)</label>
            <input id="jobFuelShare" min="0" max="100" step="0.1" type="number" value="35">
          </div>
        </div>
        <div class="sys-fuel-actions">
          <button class="btn small" id="jobFuelUseCurrentAsReference" type="button">Güncel Fiyatı Başlangıç Yap</button>
          <button class="btn small primary" id="jobFuelApplyDifference" type="button">Yakıt Farkını Uygula</button>
        </div>
        <div class="sys-fuel-preview" id="jobFuelPreview"></div>
        <div class="sys-fuel-status" id="jobFuelStatus"></div>
        <div class="sys-fuel-history-note" id="jobFuelHistoryNote"></div>
      </section>
    `;
  }

  function injectFormSection() {
    const form = byId("jobForm");
    if (!form || byId("jobFuelDifferenceSection")) return false;
    const anchor = byId("jobRouteDescription")?.closest(".field") || byId("jobNote")?.closest(".field");
    if (!anchor) return false;
    anchor.insertAdjacentHTML("beforebegin", formMarkup());
    bindFuelFormEvents();
    resetFuelForm();
    return true;
  }

  function fuelFormAdjustment(existing = {}) {
    const source = byId("jobFuelSource")?.value || "average";
    return {
      enabled: Boolean(byId("jobFuelEnabled")?.checked),
      referencePrice: numberValue(byId("jobFuelReferencePrice")?.value),
      threshold: Math.max(numberValue(byId("jobFuelThreshold")?.value) || 30, 0.01),
      source,
      manualCurrentPrice: source === "manual" ? numberValue(byId("jobFuelCurrentPrice")?.value) : numberValue(existing.manualCurrentPrice),
      calculationMode: byId("jobFuelCalculationMode")?.value || "actual",
      dailyKm: numberValue(byId("jobFuelDailyKm")?.value),
      consumption: numberValue(byId("jobFuelConsumption")?.value) || 12,
      fuelShare: numberValue(byId("jobFuelShare")?.value) || 35,
      lastAppliedAt: existing.lastAppliedAt || "",
      lastAppliedPrice: numberValue(existing.lastAppliedPrice),
      lastAppliedIncreasePercent: numberValue(existing.lastAppliedIncreasePercent),
      lastEvaluatedPrice: numberValue(byId("jobFuelCurrentPrice")?.value),
      history: Array.isArray(existing.history) ? existing.history.slice(-50) : []
    };
  }

  function jobDraftFromForm() {
    const editingJob = typeof getJob === "function" ? getJob(byId("jobId")?.value || "") : null;
    return {
      ...(editingJob || {}),
      billingModel: byId("jobBillingModel")?.value || editingJob?.billingModel || "trip",
      tripPrice: numberValue(byId("jobTripPrice")?.value || editingJob?.tripPrice),
      monthlyPrice: numberValue(byId("jobMonthlyPrice")?.value || editingJob?.monthlyPrice),
      plannedTripsPerDay: numberValue(byId("jobPlannedTrips")?.value || editingJob?.plannedTripsPerDay || 1),
      workDays: Array.from(document.querySelectorAll("#jobWorkDays input:checked")).map((input) => input.value)
    };
  }

  function syncCurrentPriceField() {
    const source = byId("jobFuelSource")?.value || "average";
    const field = byId("jobFuelCurrentPrice");
    if (!field) return;
    const existing = normalizeFuelAdjustment(typeof getJob === "function" ? getJob(byId("jobId")?.value || "") : null);
    const adjustment = fuelFormAdjustment(existing);
    field.readOnly = source !== "manual";
    if (source !== "manual") field.value = currentPriceFor(adjustment) > 0 ? currentPriceFor(adjustment).toFixed(2) : "";
    field.title = source === "manual" ? "Manuel fiyat girişi" : "Yakıt fiyatları panelinden otomatik alınır";
  }

  function toggleCalculationFields() {
    const mode = byId("jobFuelCalculationMode")?.value || "actual";
    document.querySelectorAll("[data-fuel-actual-field]").forEach((element) => element.classList.toggle("hidden", mode !== "actual"));
    document.querySelectorAll("[data-fuel-share-field]").forEach((element) => element.classList.toggle("hidden", mode !== "fuelShare"));
  }

  function updateFuelPreview() {
    if (!byId("jobFuelPreview")) return;
    syncCurrentPriceField();
    toggleCalculationFields();
    const job = jobDraftFromForm();
    const existing = normalizeFuelAdjustment(typeof getJob === "function" ? getJob(byId("jobId")?.value || "") : null);
    const adjustment = fuelFormAdjustment(existing);
    const result = calculateFuelDifference(job, adjustment);
    const increaseText = result.referencePrice > 0 && result.currentPrice > 0 ? `%${result.increasePercent.toFixed(2)}` : "-";
    const sourceUpdated = liveFuelPrices().updatedAt ? new Date(liveFuelPrices().updatedAt).toLocaleString("tr-TR") : "Güncelleme yok";

    byId("jobFuelPreview").innerHTML = `
      <div class="sys-fuel-metric"><span>Başlangıç</span><strong>${result.referencePrice > 0 ? formatMoney(result.referencePrice) + " / L" : "-"}</strong></div>
      <div class="sys-fuel-metric"><span>Güncel</span><strong>${result.currentPrice > 0 ? formatMoney(result.currentPrice) + " / L" : "-"}</strong></div>
      <div class="sys-fuel-metric"><span>Artış</span><strong>${increaseText}</strong></div>
      <div class="sys-fuel-metric"><span>Önerilen Fark</span><strong>${formatMoney(result.suggestedDifference)}</strong></div>
      <div class="sys-fuel-metric"><span>Yeni Fiyat</span><strong>${formatMoney(result.newContractPrice)}</strong></div>
    `;

    const detail = adjustment.calculationMode === "actual"
      ? `Günlük fark ${formatMoney(result.dailyDifference)} · Sefer başına ${formatMoney(result.perTripDifference)} · Aylık tahmin ${formatMoney(result.monthlyDifference)}`
      : `${calculationLabel(adjustment.calculationMode)} yöntemiyle hesaplandı.`;
    const status = byId("jobFuelStatus");
    status.className = `sys-fuel-status ${result.code}`;
    status.innerHTML = `<strong>${safeText(result.label)}</strong><br>${safeText(detail)}<br><small>${safeText(fuelSourceLabel(adjustment.source))} · ${safeText(sourceUpdated)}</small>`;

    const history = byId("jobFuelHistoryNote");
    history.textContent = adjustment.lastAppliedAt
      ? `Son uygulama: ${new Date(adjustment.lastAppliedAt).toLocaleString("tr-TR")} · Referans ${formatMoney(adjustment.lastAppliedPrice)} / L`
      : "Henüz yakıt farkı uygulanmadı. İlk sözleşme fiyatı uygulama geçmişinde korunur.";

    const applyButton = byId("jobFuelApplyDifference");
    if (applyButton) {
      applyButton.disabled = result.code !== "due" || !byId("jobId")?.value;
      applyButton.title = !byId("jobId")?.value ? "Önce sözleşmeyi kaydet" : result.code !== "due" ? "Yakıt farkı eşiği henüz aşılmadı" : "Hesaplanan farkı sözleşme fiyatına uygula";
    }
  }

  function resetFuelForm() {
    if (!byId("jobFuelDifferenceSection")) return;
    byId("jobFuelEnabled").checked = false;
    byId("jobFuelReferencePrice").value = "";
    byId("jobFuelThreshold").value = "30";
    byId("jobFuelSource").value = "average";
    byId("jobFuelCurrentPrice").value = "";
    byId("jobFuelCalculationMode").value = "actual";
    byId("jobFuelDailyKm").value = "";
    byId("jobFuelConsumption").value = "12";
    byId("jobFuelShare").value = "35";
    updateFuelPreview();
  }

  function fillFuelForm(job) {
    if (!byId("jobFuelDifferenceSection")) return;
    const adjustment = normalizeFuelAdjustment(job);
    byId("jobFuelEnabled").checked = adjustment.enabled;
    byId("jobFuelReferencePrice").value = adjustment.referencePrice || "";
    byId("jobFuelThreshold").value = adjustment.threshold || 30;
    byId("jobFuelSource").value = adjustment.source;
    byId("jobFuelCalculationMode").value = adjustment.calculationMode;
    byId("jobFuelDailyKm").value = adjustment.dailyKm || "";
    byId("jobFuelConsumption").value = adjustment.consumption || 12;
    byId("jobFuelShare").value = adjustment.fuelShare || 35;
    byId("jobFuelCurrentPrice").value = adjustment.source === "manual" ? (adjustment.manualCurrentPrice || "") : "";
    updateFuelPreview();
  }

  async function confirmAction(message, options = {}) {
    try {
      if (typeof appConfirm === "function") return await appConfirm(message, options);
    } catch (_) {}
    return window.confirm(message);
  }

  async function applyFuelDifference() {
    const jobId = byId("jobId")?.value || "";
    const job = typeof getJob === "function" ? getJob(jobId) : null;
    if (!job) {
      if (typeof showToast === "function") showToast("Önce iş / sözleşme kaydını kaydet.");
      return;
    }
    const existing = normalizeFuelAdjustment(job);
    const adjustment = fuelFormAdjustment(existing);
    const result = calculateFuelDifference(job, adjustment);
    if (result.code !== "due") {
      if (typeof showToast === "function") showToast("Yakıt farkı eşiği henüz aşılmadı.");
      return;
    }
    const priceLabel = job.billingModel === "monthly" ? "aylık sözleşme fiyatı" : "tek sefer fiyatı";
    const approved = await confirmAction(
      `${job.name} için ${priceLabel} ${formatMoney(result.baseContractPrice)} → ${formatMoney(result.newContractPrice)} olarak güncellensin mi?`,
      { title: "Yakıt Farkını Uygula", confirmText: "Uygula", danger: false, icon: "⛽" }
    );
    if (!approved) return;

    const historyEntry = {
      appliedAt: new Date().toISOString(),
      previousReferencePrice: result.referencePrice,
      currentFuelPrice: result.currentPrice,
      increasePercent: roundMoney(result.increasePercent),
      previousContractPrice: result.baseContractPrice,
      differenceAmount: result.suggestedDifference,
      newContractPrice: result.newContractPrice,
      calculationMode: adjustment.calculationMode,
      source: adjustment.source
    };

    if (job.billingModel === "monthly") job.monthlyPrice = result.newContractPrice;
    else job.tripPrice = result.newContractPrice;
    job.fuelAdjustment = {
      ...adjustment,
      referencePrice: result.currentPrice,
      lastAppliedAt: historyEntry.appliedAt,
      lastAppliedPrice: result.currentPrice,
      lastAppliedIncreasePercent: result.increasePercent,
      lastEvaluatedPrice: result.currentPrice,
      history: [...adjustment.history, historyEntry].slice(-50)
    };
    job.updatedAt = new Date().toISOString();

    if (typeof saveState === "function") saveState();
    if (typeof appendAudit === "function") {
      appendAudit("Yakıt Farkı", "Sözleşme fiyatı güncellendi", `${job.name} · ${formatMoney(result.baseContractPrice)} → ${formatMoney(result.newContractPrice)} · motorin %${result.increasePercent.toFixed(2)}`);
    }
    if (byId("jobTripPrice")) byId("jobTripPrice").value = job.tripPrice || "";
    if (byId("jobMonthlyPrice")) byId("jobMonthlyPrice").value = job.monthlyPrice || "";
    fillFuelForm(job);
    refreshFuelSurfaces();
    if (typeof showToast === "function") showToast("Yakıt farkı sözleşme fiyatına uygulandı.");
  }

  function bindFuelFormEvents() {
    const ids = [
      "jobFuelEnabled", "jobFuelReferencePrice", "jobFuelThreshold", "jobFuelSource", "jobFuelCurrentPrice",
      "jobFuelCalculationMode", "jobFuelDailyKm", "jobFuelConsumption", "jobFuelShare",
      "jobBillingModel", "jobTripPrice", "jobMonthlyPrice", "jobPlannedTrips"
    ];
    ids.forEach((id) => {
      const element = byId(id);
      if (!element || element.dataset.fuelBound) return;
      element.dataset.fuelBound = "1";
      element.addEventListener(element.tagName === "SELECT" || element.type === "checkbox" ? "change" : "input", updateFuelPreview);
    });
    document.querySelectorAll("#jobWorkDays input").forEach((input) => {
      if (input.dataset.fuelBound) return;
      input.dataset.fuelBound = "1";
      input.addEventListener("change", updateFuelPreview);
    });
    byId("jobFuelUseCurrentAsReference")?.addEventListener("click", () => {
      syncCurrentPriceField();
      const current = numberValue(byId("jobFuelCurrentPrice")?.value);
      if (!(current > 0)) {
        if (typeof showToast === "function") showToast("Güncel motorin fiyatı bulunamadı.");
        return;
      }
      byId("jobFuelReferencePrice").value = current.toFixed(2);
      updateFuelPreview();
    });
    byId("jobFuelApplyDifference")?.addEventListener("click", applyFuelDifference);
  }

  function installJobHooks() {
    const form = byId("jobForm");
    if (!form || form.dataset.fuelSaveHook === "1") return;
    form.dataset.fuelSaveHook = "1";

    const coreSaveJob = saveJob;
    const coreClearJobForm = clearJobForm;
    const coreEditJob = editJob;

    form.removeEventListener("submit", coreSaveJob);
    form.addEventListener("submit", function saveJobWithFuel(event) {
      const editingId = byId("jobId")?.value || "";
      const existingJob = editingId && typeof getJob === "function" ? getJob(editingId) : null;
      const existingAdjustment = normalizeFuelAdjustment(existingJob);
      const adjustment = fuelFormAdjustment(existingAdjustment);
      const beforeIds = new Set(state.jobs.map((job) => job.id));
      const beforeUpdatedAt = existingJob?.updatedAt || "";

      coreSaveJob(event);

      let savedJob = null;
      if (editingId) {
        const candidate = typeof getJob === "function" ? getJob(editingId) : null;
        if (candidate && candidate.updatedAt !== beforeUpdatedAt) savedJob = candidate;
      } else {
        savedJob = state.jobs.find((job) => !beforeIds.has(job.id)) || null;
      }
      if (!savedJob) return;

      savedJob.fuelAdjustment = {
        ...adjustment,
        lastEvaluatedPrice: currentPriceFor(adjustment),
        history: existingAdjustment.history
      };
      if (typeof persistStateSnapshot === "function") persistStateSnapshot();
      else if (typeof saveState === "function") saveState();
      refreshFuelSurfaces();
    });

    clearJobForm = function clearJobFormWithFuel() {
      coreClearJobForm();
      resetFuelForm();
    };
    ["clearJobFormBtn", "cancelJobEditBtn"].forEach((id) => {
      const button = byId(id);
      if (!button) return;
      button.removeEventListener("click", coreClearJobForm);
      button.addEventListener("click", clearJobForm);
    });

    editJob = function editJobWithFuel(id) {
      coreEditJob(id);
      const job = typeof getJob === "function" ? getJob(id) : null;
      window.setTimeout(() => fillFuelForm(job), 0);
    };
  }

  function allFuelResults() {
    return state.jobs
      .filter((job) => job && ["Aktif", "Beklemede"].includes(job.status))
      .map((job) => ({ job, company: typeof getCompany === "function" ? getCompany(job.companyId) : null, result: calculateFuelDifference(job) }))
      .filter((item) => item.result.adjustment.enabled);
  }

  function decorateJobsTable() {
    const host = byId("jobsTableHost");
    if (!host) return;
    host.querySelectorAll('button[data-action="edit-job"][data-id]').forEach((button) => {
      const job = typeof getJob === "function" ? getJob(button.dataset.id) : null;
      const row = button.closest("tr");
      const priceCell = row?.children?.[3];
      if (!job || !priceCell) return;
      priceCell.querySelectorAll(".sys-fuel-inline").forEach((node) => node.remove());
      const result = calculateFuelDifference(job);
      if (!result.adjustment.enabled) return;
      const badge = document.createElement("div");
      badge.className = `sys-fuel-inline ${result.code}`;
      badge.textContent = result.code === "missing" ? result.label : `${result.label} · %${result.increasePercent.toFixed(1)}`;
      priceCell.appendChild(badge);
    });
  }

  function decorateJobsSummary() {
    const host = byId("jobsSummary");
    if (!host || host.querySelector("[data-fuel-summary-chip]")) return;
    const results = allFuelResults();
    const due = results.filter((item) => item.result.code === "due").length;
    const near = results.filter((item) => item.result.code === "near").length;
    const chip = document.createElement("div");
    chip.dataset.fuelSummaryChip = "1";
    chip.className = `insight-chip ${due > 0 ? "risk" : ""}`;
    chip.innerHTML = `<div class="insight-label">Yakıt Farkı</div><div class="insight-value">${due} kes · ${near} yakın</div>`;
    host.appendChild(chip);
  }

  function decorateWarnings() {
    const list = byId("warningList");
    const summary = byId("warningSummary");
    if (!list || !summary) return;
    list.querySelectorAll("[data-fuel-warning]").forEach((node) => node.remove());
    summary.querySelectorAll("[data-fuel-warning-summary]").forEach((node) => node.remove());

    const results = allFuelResults();
    const due = results.filter((item) => item.result.code === "due");
    const near = results.filter((item) => item.result.code === "near");
    const summaryChip = document.createElement("div");
    summaryChip.dataset.fuelWarningSummary = "1";
    summaryChip.className = `insight-chip ${due.length ? "risk" : ""}`;
    summaryChip.innerHTML = `<div class="insight-label">Yakıt farkı</div><div class="insight-value">${due.length} kes · ${near.length} yakın</div>`;
    summary.appendChild(summaryChip);

    if (due.length || near.length) list.querySelector(".empty")?.remove();

    [...due, ...near].forEach(({ job, company, result }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.fuelWarning = "1";
      button.dataset.jobId = job.id;
      button.className = "warning-card risk sys-fuel-warning-card";
      button.innerHTML = `
        <div class="warning-type">Yakıt Farkı · ${safeText(result.label)}</div>
        <div class="warning-message">${safeText(company?.name || "Firma yok")} / ${safeText(job.name)}: motorin artışı %${safeText(result.increasePercent.toFixed(2))}. Önerilen fark ${safeText(formatMoney(result.suggestedDifference))}. →</div>
      `;
      button.addEventListener("click", () => openJobFuelRecord(job.id));
      list.appendChild(button);
    });
  }

  function ensureCommandBanner() {
    const dashboard = document.querySelector("#screen-command .command-dashboard");
    if (!dashboard) return null;
    let banner = byId("commandFuelDifferenceBanner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "commandFuelDifferenceBanner";
      banner.className = "sys-fuel-command-banner";
      banner.innerHTML = `<div><strong id="commandFuelDifferenceTitle">Yakıt farkı takibi</strong><small id="commandFuelDifferenceText"></small></div><button class="btn small primary" type="button">Sözleşmeleri Aç</button>`;
      banner.querySelector("button").addEventListener("click", () => openJobFuelRecord("") );
      dashboard.insertBefore(banner, dashboard.firstChild);
    }
    return banner;
  }

  function renderCommandBanner() {
    const banner = ensureCommandBanner();
    if (!banner) return;
    const results = allFuelResults();
    const due = results.filter((item) => item.result.code === "due");
    const near = results.filter((item) => item.result.code === "near");
    banner.classList.toggle("active", due.length > 0 || near.length > 0);
    if (!due.length && !near.length) return;
    byId("commandFuelDifferenceTitle").textContent = due.length
      ? `${due.length} sözleşmede yakıt farkı kesilmeli`
      : `${near.length} sözleşme yakıt farkı sınırına yaklaştı`;
    byId("commandFuelDifferenceText").textContent = due.length
      ? `${due.map((item) => item.company?.name || item.job.name).slice(0, 3).join(", ")}${due.length > 3 ? "…" : ""}`
      : `${near.map((item) => item.company?.name || item.job.name).slice(0, 3).join(", ")}${near.length > 3 ? "…" : ""}`;
  }

  function openJobFuelRecord(jobId) {
    try {
      if (typeof activateModule === "function") activateModule("registry");
      if (typeof activateRegistryTab === "function") activateRegistryTab("jobs");
      if (jobId && typeof editJob === "function") editJob(jobId);
      if (typeof scrollContentTop === "function") scrollContentTop();
    } catch (error) {
      console.error("Yakıt farkı sözleşmesi açılamadı:", error);
    }
  }

  function refreshFuelSurfaces() {
    window.requestAnimationFrame(() => {
      decorateJobsTable();
      decorateJobsSummary();
      decorateWarnings();
      renderCommandBanner();
      if (byId("jobFuelDifferenceSection")) updateFuelPreview();
      announceDueOnce();
    });
  }

  function installRenderHooks() {
    if (window.__SYS_FUEL_RENDER_HOOKS__) return;
    window.__SYS_FUEL_RENDER_HOOKS__ = true;

    if (typeof renderJobsTable === "function") {
      const coreRenderJobsTable = renderJobsTable;
      renderJobsTable = function renderJobsTableWithFuel() {
        const result = coreRenderJobsTable.apply(this, arguments);
        window.requestAnimationFrame(() => { decorateJobsTable(); decorateJobsSummary(); });
        return result;
      };
    }

    if (typeof renderWarningsPanel === "function") {
      const coreRenderWarningsPanel = renderWarningsPanel;
      renderWarningsPanel = function renderWarningsPanelWithFuel() {
        const result = coreRenderWarningsPanel.apply(this, arguments);
        window.requestAnimationFrame(decorateWarnings);
        return result;
      };
    }

    ["jobSearch", "jobCompanyFilter", "jobStatusFilter"].forEach((id) => {
      const element = byId(id);
      if (!element || element.dataset.fuelSurfaceBound) return;
      element.dataset.fuelSurfaceBound = "1";
      element.addEventListener(element.tagName === "INPUT" ? "input" : "change", () => window.setTimeout(refreshFuelSurfaces, 0));
    });

    document.querySelectorAll('[data-tab="warnings"], [data-registry-tab="jobs"], [data-module="command"]').forEach((button) => {
      if (button.dataset.fuelSurfaceBound) return;
      button.dataset.fuelSurfaceBound = "1";
      button.addEventListener("click", () => window.setTimeout(refreshFuelSurfaces, 0));
    });
  }

  function announceDueOnce() {
    const due = allFuelResults().filter((item) => item.result.code === "due");
    if (!due.length) return;
    const key = `sysFuelDue:${today()}:${due.map((item) => item.job.id).sort().join(",")}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    window.setTimeout(() => {
      if (typeof showToast === "function") showToast(`${due.length} sözleşmede yakıt farkı sınırı aşıldı.`);
    }, 900);
  }

  function boot() {
    try {
      ensureStateCompatibility();
      injectStyles();
      injectFormSection();
      installJobHooks();
      installRenderHooks();
      refreshFuelSurfaces();
      announceDueOnce();
      window.setInterval(refreshFuelSurfaces, 30000);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) refreshFuelSurfaces();
      });
      console.info(`SYS Yakıt Farkı Modülü ${MODULE_VERSION} hazır.`);
    } catch (error) {
      console.error("SYS Yakıt Farkı Modülü başlatılamadı:", error);
      window.setTimeout(boot, 800);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();

