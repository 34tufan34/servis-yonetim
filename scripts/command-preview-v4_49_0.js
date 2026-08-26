(function () {
  "use strict";

  if (window.__SYS_COMMAND_PANEL_V4490__) return;
  window.__SYS_COMMAND_PANEL_V4490__ = true;


  const $ = (selector, root = document) => root.querySelector(selector);
  const escapePreviewHtml = (value) => String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));

  function installHealthRadarStyle() {
    if ($("#sys-command-health-radar-v4490")) return;
    const style = document.createElement("style");
    style.id = "sys-command-health-radar-v4490";
    style.textContent = `
      .command-preview-health-radar{padding:12px 5px!important;border:0!important;border-bottom:1px solid rgba(56,189,248,.18)!important;border-radius:0!important;background:transparent!important;color:#f8fafc;flex:0 1 auto;min-height:0}
      .preview-health-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.preview-health-head small{color:#7dd3fc!important;font-weight:900}.preview-health-badge{display:inline-flex!important;align-items:center;justify-content:center;margin:0!important;padding:4px 7px;border:1px solid rgba(34,197,94,.34);border-radius:999px;background:rgba(34,197,94,.12);color:#86efac!important;font-size:8px!important;font-weight:950;white-space:nowrap}.command-preview-health-radar.is-warning .preview-health-badge{border-color:rgba(245,158,11,.46);background:rgba(245,158,11,.13);color:#fde68a!important}.command-preview-health-radar.is-danger .preview-health-badge{border-color:rgba(248,113,113,.52);background:rgba(127,29,29,.30);color:#fecaca!important}
      .preview-health-title{margin-top:6px!important;font-size:14px!important;line-height:1.22}.preview-health-list{display:grid;gap:5px;margin-top:8px}.preview-health-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:6px 7px;border:1px solid rgba(56,189,248,.13);border-radius:9px;background:rgba(2,8,18,.38)}.preview-health-row>span{min-width:0;margin:0!important}.preview-health-row strong{margin:0!important;font-size:10px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.preview-health-row small{margin-top:2px;color:#64748b!important;font-size:8px!important;letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.preview-health-state{margin:0!important;color:#86efac!important;font-size:8px!important;font-weight:900;white-space:nowrap}.preview-health-row.warning .preview-health-state{color:#fbbf24!important}.preview-health-row.danger .preview-health-state{color:#fca5a5!important}.preview-health-empty{padding:8px;border:1px dashed rgba(56,189,248,.20);border-radius:9px;color:#94a3b8;font-size:9px;line-height:1.35}
      .preview-health-metrics{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:7px}.preview-health-metrics span{margin:0!important;padding:6px;border-radius:8px;background:rgba(148,163,184,.07);color:#94a3b8!important;font-size:8px!important}.preview-health-metrics b{display:block;color:#e2e8f0;font-size:12px}.preview-health-open{width:100%;min-height:30px!important;margin-top:7px!important;padding:6px!important;border-color:rgba(56,189,248,.35)!important;background:rgba(14,165,233,.09)!important;color:#7dd3fc!important;font-size:9px}
      .command-preview-marks{grid-template-columns:repeat(var(--preview-mark-count,3),minmax(0,1fr))!important}.command-preview-marks .izinli{color:#d8b4fe;border-color:rgba(168,85,247,.30)}.command-preview-marks.is-hidden,.command-preview-marks .is-hidden,.command-preview-distribution.is-hidden,.command-preview-actions button.is-hidden{display:none!important}
      @media(max-width:1050px){.command-preview-health-radar{grid-column:1/-1!important;padding:12px!important;border:1px solid rgba(56,189,248,.24)!important;border-radius:16px!important}.preview-health-list{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:720px){.preview-health-list{grid-template-columns:1fr}.preview-health-metrics{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(style);
  }

  function makePanel() {
    const nav = $(".nav");
    const main = $("#contentScroll");
    if (!nav || !main || $("#screen-command-preview")) return;

    installHealthRadarStyle();
    const navButton = document.createElement("button");
    navButton.className = "nav-btn command-preview-nav";
    navButton.type = "button";
    navButton.dataset.commandPreview = "1";
    navButton.innerHTML = '<span class="nav-label"><span class="dot"></span>Komuta Paneli</span>';
    nav.insertBefore(navButton, nav.children[1] || null);

    const screen = document.createElement("section");
    screen.className = "module-screen command-preview-screen";
    screen.id = "screen-command-preview";
    screen.innerHTML = `
      <div class="command-preview-shell">
        <header class="command-preview-hero">
          <div class="command-preview-shade"></div>
          <div class="command-preview-topline"><span><strong>SYS</strong><i>KOMUTA PANELİ</i></span><b>● CANLI</b></div>
          <div class="command-preview-clock"><strong id="previewClock">--:--</strong><span id="previewDate">Tarih hazırlanıyor</span></div>
          <div class="command-preview-profile"><span><strong id="previewProfileName">Kullanıcı</strong><small id="previewProfileRole">-</small></span></div>
          <div class="command-preview-intro">
            <p>Mercedes Executive Command</p>
            <h2 id="previewLiveTitle">Aktif servis yok</h2>
            <span id="previewLiveText">Personel ve okul operasyonlarını tek ekrandan yönetin.</span>
          </div>
          <div class="command-preview-live"><strong id="previewLiveCount">0</strong><span>SERVİS<br>AKTİF</span></div>
        </header>
        <div class="command-preview-body">
          <div class="command-preview-services">
            <article class="command-preview-service personnel" id="previewPersonnelCard">
              <div class="command-preview-card-head"><span class="command-preview-icon">P</span><div><small>PERSONEL OPERASYONU</small><h3>Personel Servisi</h3></div><b id="previewPersonnelState">BEKLEMEDE</b></div>
              <p id="previewPersonnelMeta">Başlatılmış servis bulunmuyor.</p>
              <div class="command-preview-passenger"><small>SIRADAKİ PERSONEL</small><strong id="previewPersonnelName">Aktif operasyon yok</strong><span id="previewPersonnelAddress">Servis başladığında yolcu burada görünür.</span></div>
              <div class="command-preview-stage"><small id="previewPersonnelStageLabel">AKŞAM SERVİSİ AKIŞI</small><strong id="previewPersonnelStage">Servis başlatılmayı bekliyor</strong><span id="previewPersonnelStageHelp">Akşam servisinde önce tüm personelin binişi onaylanır.</span></div>
              <div class="command-preview-marks"><button class="bindi" type="button" data-preview-status="Bindi" data-preview-proxy='[data-action="command-personnel-mark"][data-status="Bindi"]'>BİNDİ</button><button class="indi" type="button" data-preview-status="İndi" data-preview-proxy='[data-action="command-personnel-mark"][data-status="İndi"]'>İNDİ</button><button class="yok" type="button" data-preview-status="Yok" data-preview-proxy='[data-action="command-personnel-mark"][data-status="Yok"]'>YOK</button><button class="izinli" type="button" data-preview-status="İzinli" data-preview-proxy='[data-action="command-personnel-mark"][data-status="İzinli"]'>İZİNLİ</button></div>
              <button class="command-preview-distribution" id="previewPersonnelFinish" type="button" data-preview-proxy="#commandPersonnelFinishBtn" disabled>DAĞITIMA BAŞLA</button>
              <div class="command-preview-actions"><button id="previewPersonnelPrimary" type="button" data-preview-proxy="#commandPersonnelSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="personnel">Detaya Git</button></div>
            </article>
            <article class="command-preview-service school" id="previewSchoolCard">
              <div class="command-preview-card-head"><span class="command-preview-icon">O</span><div><small>OKUL OPERASYONU</small><h3>Okul Servisi</h3></div><b id="previewSchoolState">BEKLEMEDE</b></div>
              <p id="previewSchoolMeta">Başlatılmış servis bulunmuyor.</p>
              <div class="command-preview-passenger"><small>SIRADAKİ ÖĞRENCİ</small><strong id="previewSchoolName">Aktif operasyon yok</strong><span id="previewSchoolAddress">Servis başladığında öğrenci burada görünür.</span></div>
              <div class="command-preview-marks"><button class="bindi" type="button" data-preview-status="Bindi" data-preview-proxy='[data-action="command-school-mark"][data-status="Bindi"]'>BİNDİ</button><button class="indi" type="button" data-preview-status="İndi" data-preview-proxy='[data-action="command-school-mark"][data-status="İndi"]'>İNDİ</button><button class="yok" type="button" data-preview-status="Yok" data-preview-proxy='[data-action="command-school-mark"][data-status="Yok"]'>YOK</button><button class="izinli" type="button" data-preview-status="İzinli" data-preview-proxy='[data-action="command-school-mark"][data-status="İzinli"]'>İZİNLİ</button></div>
              <div class="command-preview-actions"><button id="previewSchoolPrimary" type="button" data-preview-proxy="#commandSchoolSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="school">Detaya Git</button></div>
            </article>
          </div>
          <aside class="command-preview-rail">
            <section class="command-preview-health-radar" id="previewHealthRadar">
              <div class="preview-health-head"><small>ARAÇ SAĞLIĞI &amp; BAKIM RADARI</small><span class="preview-health-badge" id="previewHealthRadarBadge">GÜNCEL</span></div>
              <strong class="preview-health-title" id="previewHealthRadarTitle">Bakım kayıtları izleniyor</strong>
              <div class="preview-health-list" id="previewHealthRadarList"><div class="preview-health-empty">İlk bakım kaydından sonra tahminler burada görünür.</div></div>
              <div class="preview-health-metrics"><span><b id="previewHealthAlertMetric">0</b>evrak / araç uyarısı</span><span><b id="previewHealthDebtMetric">0</b>açık bakım borcu</span></div>
              <button class="preview-health-open" type="button" data-preview-action="maintenance">Bakım Takibini Aç</button>
            </section>
            <div><small>SAHA DURUMU</small><strong id="previewRailStatus">Operasyonlar beklemede</strong></div>
            <div><small>ARAÇ UYARILARI</small><strong id="previewAlertCount">0</strong><span>bakım / evrak kaydı</span></div>
            <div class="command-preview-fuel"><small>MAZOT FİYATLARI</small><div class="preview-fuel-brand-row"><span class="preview-fuel-logo-host" id="previewShellLogo">SHELL</span><strong id="previewShellPrice">—</strong></div><div class="preview-fuel-brand-row"><span class="preview-fuel-logo-host" id="previewOpetLogo">OPET</span><strong id="previewOpetPrice">—</strong></div><span class="preview-discount-fuel" id="previewDiscountFuelPrice">İndirimli alış fiyatı Ayarlar’dan belirlenebilir.</span></div>
            <div class="command-preview-fuel-difference"><small>MAZOT FARKI UYARISI</small><strong id="previewFuelDifferencePercent">%0</strong><strong id="previewFuelDifferenceTitle">Uyarı yok</strong><span id="previewFuelDifferenceText">Sözleşmeler güncel.</span></div>
          </aside>
        </div>
      </div>`;
    main.insertBefore(screen, main.firstChild);

    navButton.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));
      document.querySelectorAll(".module-screen").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active");
      screen.classList.add("active");
      document.body.classList.add("modern-command-active");
      if ($("#pageTitle")) $("#pageTitle").textContent = "Komuta Paneli";
      if ($("#pageLead")) $("#pageLead").textContent = "Personel ve okul servislerini, araç bakım tahminlerini, saha durumunu ve mazot uyarılarını tek merkezden yönet.";
      $("#sidebar")?.classList.remove("open");
      $("#contentScroll")?.scrollTo({ top: 0, behavior: "smooth" });
      syncPanel();
    });

    screen.addEventListener("click", (event) => {
      const proxy = event.target.closest("[data-preview-proxy]");
      if (proxy) return $(proxy.dataset.previewProxy)?.click();
      const action = event.target.closest("[data-preview-action]")?.dataset.previewAction;
      if (action === "personnel") return $('[data-action="open-personnel-live"]')?.click();
      if (action === "school") return $('[data-action="open-school-live"]')?.click();
      if (action === "maintenance") {
        if (typeof window.SYS_OPEN_VEHICLE_CENTER === "function") return window.SYS_OPEN_VEHICLE_CENTER("maintenance");
        $('[data-module="finance"]')?.click();
        window.setTimeout(() => {
          $('[data-finance-tab="maintenance"]')?.click();
          window.setTimeout(() => $('[data-maintenance-subtab="intelligence"]')?.click(), 60);
        }, 60);
      }
    });

    document.addEventListener("click", (event) => {
      const clickedNav = event.target.closest(".nav-btn");
      if (clickedNav && clickedNav !== navButton) { navButton.classList.remove("active"); document.body.classList.remove("modern-command-active"); }
    }, true);
  }

  function mirrorText(sourceSelector, targetSelector, fallback) {
    const value = $(sourceSelector)?.textContent?.trim();
    const target = $(targetSelector);
    if (target) target.textContent = value || fallback;
  }

  function mirrorPassenger(sourceSelector, nameSelector, addressSelector) {
    mirrorText(`${sourceSelector} .command-next-name`, nameSelector, "Aktif operasyon yok");
    mirrorText(`${sourceSelector} .command-next-address`, addressSelector, "Servis başladığında yolcu burada görünür.");
  }

  function setPreviewVisible(element, visible) {
    if (!element) return;
    element.hidden = !visible;
    element.classList.toggle("is-hidden", !visible);
  }

  function configurePreviewMarks(cardSelector, allowedStatuses) {
    const host = $(`${cardSelector} .command-preview-marks`);
    if (!host) return;
    const allowed = new Set(allowedStatuses);
    host.querySelectorAll("[data-preview-status]").forEach((button) => {
      const visible = allowed.has(button.dataset.previewStatus);
      setPreviewVisible(button, visible);
      button.disabled = !visible;
    });
    host.style.setProperty("--preview-mark-count", String(Math.max(1, allowed.size)));
    setPreviewVisible(host, allowed.size > 0);
  }

  function previewActiveSession(kind) {
    try {
      if (kind === "school" && typeof activeSchoolServiceSessions === "function") return activeSchoolServiceSessions()[0] || null;
      if (kind === "personnel" && typeof activePersonnelServiceSessions === "function") return activePersonnelServiceSessions()[0] || null;
    } catch (error) { console.warn("Komuta servisi okunamadı:", error); }
    return null;
  }

  function previewRecommendedPeriod(kind) {
    try { if (typeof commandRecommendedPeriod === "function") return commandRecommendedPeriod(kind); } catch (error) { console.warn("Önerilen servis dönemi okunamadı:", error); }
    return "morning";
  }

  function previewStartLabel(kind) {
    return previewRecommendedPeriod(kind) === "evening" ? "Akşam Servisini Başlat" : "Sabah Servisini Başlat";
  }

  function syncPanel() {
    if (!$("#screen-command-preview")) return;
    mirrorText("#commandLiveTitle", "#previewLiveTitle", "Aktif servis yok");
    mirrorText("#commandLiveText", "#previewLiveText", "Personel ve okul operasyonlarını tek ekrandan yönetin.");
    mirrorText("#commandLiveCount", "#previewLiveCount", "0");
    mirrorText("#commandPersonnelMeta", "#previewPersonnelMeta", "Başlatılmış servis bulunmuyor.");
    mirrorText("#commandSchoolMeta", "#previewSchoolMeta", "Başlatılmış servis bulunmuyor.");
    mirrorText("#commandPersonnelState", "#previewPersonnelState", "Beklemede");
    mirrorText("#commandSchoolState", "#previewSchoolState", "Beklemede");
    mirrorPassenger("#commandPersonnelNext", "#previewPersonnelName", "#previewPersonnelAddress");
    mirrorPassenger("#commandSchoolNext", "#previewSchoolName", "#previewSchoolAddress");

    const originalFinish = $("#commandPersonnelFinishBtn");
    const personnelSession = previewActiveSession("personnel");
    const personnelActive = Boolean(personnelSession) || Boolean($("#commandPersonnelCard")?.classList.contains("is-live") && !originalFinish?.classList.contains("is-inactive"));
    const personnelMeta = $("#commandPersonnelMeta")?.textContent || "";
    const personnelPeriod = personnelSession?.period || (/Akşam/i.test(personnelMeta) ? "evening" : "morning");
    const isEvening = personnelActive && personnelPeriod === "evening";
    let personnelPhase = "service";
    try { personnelPhase = isEvening && typeof serviceSessionPhase === "function" ? serviceSessionPhase(personnelSession) : "service"; } catch {}
    if (isEvening && !personnelSession) personnelPhase = $("#commandPersonnelNext .command-stage strong")?.textContent?.toLocaleLowerCase("tr-TR").includes("dağıt") ? "dropoff" : "boarding";
    let personnelCounts = null;
    try {
      if (personnelSession && typeof serviceCounts === "function") personnelCounts = serviceCounts(personnelSession.date, personnelSession.routeId, personnelSession.period, personnelSession.jobId || "", personnelSession.shiftKey || "", personnelSession);
    } catch (error) { console.warn("Personel servis sayımları okunamadı:", error); }
    const finishLabel = originalFinish?.querySelector("strong")?.textContent?.trim() || "Servisi Bitir";
    const fallbackDistributionReady = finishLabel === "Dağıtıma Başla" && !originalFinish?.disabled;
    const boardingPending = Number(personnelCounts?.boardingPending ?? (fallbackDistributionReady ? 0 : 1));
    const boarded = Number(personnelCounts?.bindi ?? (fallbackDistributionReady ? 1 : 0));
    const isBoarding = isEvening && personnelPhase === "boarding";
    const isDropoff = isEvening && personnelPhase === "dropoff";
    configurePreviewMarks("#previewPersonnelCard", !personnelActive ? [] : isDropoff ? ["İndi"] : ["Bindi", "Yok", "İzinli"]);

    const previewFinish = $("#previewPersonnelFinish");
    const showDistribution = isBoarding && (boardingPending > 0 || boarded > 0);
    if (previewFinish) {
      setPreviewVisible(previewFinish, showDistribution);
      previewFinish.textContent = boardingPending > 0 ? `${boardingPending} BİNİŞ BEKLİYOR` : "DAĞITIMA BAŞLA";
      previewFinish.disabled = boardingPending > 0 || boarded <= 0 || Boolean(originalFinish?.disabled);
    }
    const previewPrimary = $("#previewPersonnelPrimary");
    if (previewPrimary) {
      const showPrimary = !personnelActive || !showDistribution;
      setPreviewVisible(previewPrimary, showPrimary);
      previewPrimary.textContent = personnelActive ? "Servisi Bitir" : previewStartLabel("personnel");
      previewPrimary.dataset.previewProxy = personnelActive ? "#commandPersonnelFinishBtn" : "#commandPersonnelSmartStartBtn";
      previewPrimary.classList.toggle("is-service-active", personnelActive);
      previewPrimary.disabled = personnelActive ? Boolean(originalFinish?.disabled) : false;
    }
    if ($("#previewPersonnelStage")) {
      const startPeriod = previewRecommendedPeriod("personnel") === "evening" ? "Akşam" : "Sabah";
      $("#previewPersonnelStageLabel").textContent = !personnelActive ? "ÖNERİLEN SERVİS" : isEvening ? "AKŞAM SERVİSİ AKIŞI" : "SABAH SERVİSİ AKIŞI";
      $("#previewPersonnelStage").textContent = !personnelActive ? `${startPeriod} servisi başlatılabilir` : !isEvening ? "Personel Toplanıyor" : isDropoff ? "Personel Dağıtılıyor" : boardingPending === 0 && boarded > 0 ? "Dağıtıma Hazır" : "Biniş Kontrolü Yapılıyor";
      $("#previewPersonnelStageHelp").textContent = !personnelActive ? "Servis başlayınca uygun yoklama düğmeleri otomatik açılır." : !isEvening ? "Her personel için Bindi, Yok veya İzinli kaydı girilir." : isDropoff ? "Yalnızca araca binen personeller için İndi onayı verilir." : boardingPending === 0 && boarded > 0 ? "Tüm binişler tamamlandı. Dağıtıma Başla düğmesi hazır." : `${boardingPending} personel için Bindi, Yok veya İzinli seçimi bekleniyor.`;
    }

    const personnelLive = personnelActive;
    const schoolFinish = $("#commandSchoolFinishBtn");
    const schoolSession = previewActiveSession("school");
    const schoolLive = Boolean(schoolSession) || Boolean($("#commandSchoolCard")?.classList.contains("is-live") && !schoolFinish?.classList.contains("is-inactive"));
    const schoolMeta = $("#commandSchoolMeta")?.textContent || "";
    const schoolPeriod = schoolSession?.period || (/Akşam/i.test(schoolMeta) ? "evening" : "morning");
    configurePreviewMarks("#previewSchoolCard", !schoolLive ? [] : schoolPeriod === "evening" ? ["İndi", "İzinli"] : ["Bindi", "Yok", "İzinli"]);
    const schoolPrimary = $("#previewSchoolPrimary");
    if (schoolPrimary) {
      schoolPrimary.textContent = schoolLive ? "Servisi Bitir" : previewStartLabel("school");
      schoolPrimary.dataset.previewProxy = schoolLive ? "#commandSchoolFinishBtn" : "#commandSchoolSmartStartBtn";
      schoolPrimary.classList.toggle("is-service-active", Boolean(schoolLive));
      schoolPrimary.disabled = schoolLive ? Boolean(schoolFinish?.disabled) : false;
    }
    $("#previewPersonnelCard")?.classList.toggle("is-live", Boolean(personnelLive));
    $("#previewSchoolCard")?.classList.toggle("is-live", Boolean(schoolLive));
    const liveCount = Number($("#commandLiveCount")?.textContent || 0);
    if ($("#previewRailStatus")) $("#previewRailStatus").textContent = liveCount ? `${liveCount} servis sahada` : "Operasyonlar beklemede";
    const alertText = $("#commandMaintenanceState")?.textContent || "0";
    if ($("#previewAlertCount")) $("#previewAlertCount").textContent = (alertText.match(/\d+/) || ["0"])[0];
    let health = null;
    try { health = window.SYS_MAINTENANCE_INTELLIGENCE?.snapshot?.() || null; } catch (error) { console.warn("Bakım radarı güncellenemedi:", error); }
    const radar = $("#previewHealthRadar");
    const dueCount = Number(health?.dueCount || 0);
    const warningCount = Number(health?.warningCount || 0);
    radar?.classList.toggle("is-danger", dueCount > 0);
    radar?.classList.toggle("is-warning", dueCount === 0 && warningCount > 0);
    if ($("#previewHealthRadarBadge")) $("#previewHealthRadarBadge").textContent = dueCount > 0 ? `${dueCount} ACİL` : warningCount > 0 ? `${warningCount} YAKLAŞAN` : "GÜNCEL";
    if ($("#previewHealthRadarTitle")) $("#previewHealthRadarTitle").textContent = dueCount > 0 ? "Bakım zamanı gelen araç var" : warningCount > 0 ? "Yaklaşan bakımlar var" : health?.rows?.length ? "Bakım planı güncel" : "İlk bakım kaydı bekleniyor";
    const radarList = $("#previewHealthRadarList");
    if (radarList) {
      const topRows = Array.isArray(health?.topRows) ? health.topRows : [];
      radarList.innerHTML = topRows.length ? topRows.map((row) => {
        const remaining = row.remainingKm === null || row.remainingKm === undefined
          ? (row.analysis?.remainingDays === null || row.analysis?.remainingDays === undefined ? "Öğreniyor" : row.analysis.remainingDays <= 0 ? `${Math.abs(row.analysis.remainingDays)} gün geçti` : `${row.analysis.remainingDays} gün`)
          : row.remainingKm <= 0 ? `${Math.abs(row.remainingKm).toLocaleString("tr-TR")} km geçti` : `${row.remainingKm.toLocaleString("tr-TR")} km kaldı`;
        const estimate = row.analysis?.estimatedDate ? new Date(`${row.analysis.estimatedDate}T00:00:00`).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) : "tarih için yakıt KM bekleniyor";
        return `<div class="preview-health-row ${escapePreviewHtml(row.stateName || "ok")}"><span><strong>${escapePreviewHtml(row.vehicle?.plate || row.vehiclePlate || "Araç")} · ${escapePreviewHtml(row.itemName || "Bakım")}</strong><small>${escapePreviewHtml(estimate)}</small></span><b class="preview-health-state">${escapePreviewHtml(remaining)}</b></div>`;
      }).join("") : '<div class="preview-health-empty">Bakım türü veya parça kaydı eklediğinde, yakıt kilometreleriyle öğrenen tahminler burada görünür.</div>';
    }
    if ($("#previewHealthAlertMetric")) $("#previewHealthAlertMetric").textContent = String(Number(health?.vehicleAlertCount || 0));
    if ($("#previewHealthDebtMetric")) $("#previewHealthDebtMetric").textContent = String(Number(health?.debtCount || 0));
    mirrorText("#shellFuelPrice", "#previewShellPrice", "—");
    mirrorText("#opetFuelPrice", "#previewOpetPrice", "—");
    mirrorText("#commandFuelPercent", "#previewFuelDifferencePercent", "%0");
    const copyFuelLogo = (source, target) => { const sourceLogo = $(source); const targetHost = $(target); if (sourceLogo && targetHost && targetHost.dataset.logoReady !== "1") { targetHost.innerHTML = sourceLogo.outerHTML; targetHost.dataset.logoReady = "1"; } };
    copyFuelLogo("#shellFuelCard .fuel-brand-logo", "#previewShellLogo");
    copyFuelLogo("#opetFuelCard .fuel-brand-logo", "#previewOpetLogo");
    const fuelPercent = $("#previewFuelDifferencePercent");
    const thresholdReached = $("#commandFuelStatusPill")?.classList.contains("due");
    fuelPercent?.classList.toggle("is-due", Boolean(thresholdReached));
    fuelPercent?.classList.toggle("is-safe", !thresholdReached);
    const discountLine = $("#previewDiscountFuelPrice");
    const discountSettings = typeof state !== "undefined" ? (state.settings?.discountFuel || {}) : {};
    const discountRate = Math.max(0, Math.min(100, Number(discountSettings.percent || 0)));
    const parseFuelPrice = (selector) => { const raw = $(selector)?.textContent || ""; const normalized = raw.replace(/[^0-9,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", "."); return Number.parseFloat(normalized) || 0; };
    const shellPrice = parseFuelPrice("#shellFuelPrice");
    const opetPrice = parseFuelPrice("#opetFuelPrice");
    const sourceName = discountSettings.source === "shell" ? "Shell" : discountSettings.source === "opet" ? "Opet" : "Ortalama";
    const basePrice = discountSettings.source === "shell" ? shellPrice : discountSettings.source === "opet" ? opetPrice : shellPrice && opetPrice ? (shellPrice + opetPrice) / 2 : (shellPrice || opetPrice);
    const purchasePrice = basePrice > 0 ? basePrice * (1 - discountRate / 100) : 0;
    if (discountLine) discountLine.textContent = discountRate > 0 && purchasePrice > 0 ? `İndirimli alış: ₺${purchasePrice.toFixed(2).replace(".", ",")}/L · ${sourceName} · %${discountRate.toFixed(2).replace(/\.00$/, "").replace(".", ",")}` : "İndirimli alış fiyatı Ayarlar’dan belirlenebilir.";
    const fuelBanner = $("#commandFuelDifferenceBanner");
    const fuelActive = fuelBanner?.classList.contains("active");
    mirrorText("#commandFuelDifferenceTitle", "#previewFuelDifferenceTitle", fuelActive ? "Mazot farkını kontrol et" : "Uyarı yok");
    mirrorText("#commandFuelDifferenceText", "#previewFuelDifferenceText", fuelActive ? "Sözleşme kontrolü gerekiyor." : "Sözleşmeler güncel.");
    const now = new Date();
    if ($("#previewClock")) $("#previewClock").textContent = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    if ($("#previewDate")) $("#previewDate").textContent = now.toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long" });
    const user = typeof activeUser !== "undefined" ? activeUser : null;
    if ($("#previewProfileName")) $("#previewProfileName").textContent = user?.fullName || user?.username || "Kullanıcı";
    if ($("#previewProfileRole")) $("#previewProfileRole").textContent = user?.role === "admin" ? "Yönetici" : user?.role === "accounting" ? "Muhasebe" : user?.role === "driver" ? "Şoför" : "Operasyon";
  }

  function install() {
    makePanel();
    const classicNav = $('.nav-btn[data-module="command"]');
    if (classicNav) classicNav.style.display = "none";
    const classicScreen = $("#screen-command");
    if (classicScreen) classicScreen.classList.add("command-panel-backend");
    $(".command-preview-nav")?.click();
    syncPanel();
    const source = $("#screen-command");
    if (source && window.MutationObserver) new MutationObserver(syncPanel).observe(source, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class"] });
    window.setInterval(syncPanel, 5000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
