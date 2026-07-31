(function () {
  "use strict";
  if (window.__SYS_EXPERIENCE_V44843__) return;
  window.__SYS_EXPERIENCE_V44843__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);

  function installStyles() {
    const style = document.createElement("style");
    style.id = "sys-experience-v44843";
    style.textContent = `
      .command-preview-actions button{border-color:color-mix(in srgb,var(--accent) 42%,var(--border))!important;background:color-mix(in srgb,var(--accent) 13%,var(--panel-2))!important;color:var(--text)!important}.command-preview-actions .is-service-active{background:linear-gradient(135deg,rgba(185,28,28,.24),rgba(127,29,29,.18))!important;border-color:rgba(248,113,113,.52)!important;color:#fecaca!important;box-shadow:0 0 18px rgba(239,68,68,.12)}
      .sys-ai-nav .dot{background:#a78bfa!important;box-shadow:0 0 12px rgba(167,139,250,.8)}
      #screen-sys-ai{overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;padding-right:4px}#screen-sys-ai .sys-ai-hub{display:grid;gap:14px;padding-bottom:24px}.sys-ai-hub-hero{padding:22px;border:1px solid rgba(167,139,250,.28);border-radius:22px;background:radial-gradient(circle at 90% 0%,rgba(124,58,237,.22),transparent 38%),linear-gradient(145deg,rgba(17,24,39,.98),rgba(5,8,15,.98));display:flex;align-items:center;justify-content:space-between;gap:20px}.sys-ai-hub-hero small{color:#c4b5fd;font-weight:950;letter-spacing:.13em}.sys-ai-hub-hero h2{margin:7px 0 5px;font-size:clamp(25px,4vw,42px)}.sys-ai-hub-hero p{margin:0;color:var(--muted);max-width:760px}.sys-ai-hub-state{padding:13px 17px;border:1px solid rgba(74,222,128,.35);border-radius:16px;background:rgba(34,197,94,.10);color:#86efac;font-weight:950;white-space:nowrap}.sys-ai-personnel-panel{padding:18px;border:1px solid rgba(56,189,248,.3);border-radius:20px;background:radial-gradient(circle at 100% 0%,rgba(14,165,233,.15),transparent 42%),var(--panel)}.sys-ai-personnel-panel header{display:flex;justify-content:space-between;gap:12px;align-items:center}.sys-ai-personnel-panel h3{margin:4px 0;font-size:22px}.sys-ai-personnel-panel p{margin:0;color:var(--muted)}.sys-ai-personnel-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:14px}.sys-ai-personnel-stats div{padding:12px;border:1px solid var(--border);border-radius:14px;background:rgba(2,6,23,.35)}.sys-ai-personnel-stats strong,.sys-ai-personnel-stats span{display:block}.sys-ai-personnel-stats strong{font-size:22px;color:#7dd3fc}.sys-ai-personnel-stats span{font-size:10px;color:var(--muted);margin-top:3px}.sys-ai-hub-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.sys-ai-hub-action{position:relative;overflow:hidden;min-height:104px;padding:15px;border:1px solid rgba(148,163,184,.16);border-radius:17px;background:var(--panel);color:var(--text);text-align:left;cursor:pointer}.sys-ai-hub-action b{display:block;color:#c4b5fd;font-size:20px}.sys-ai-hub-action strong{display:block;margin-top:8px}.sys-ai-hub-action span{display:block;margin-top:5px;color:var(--muted);font-size:10px;line-height:1.4}.sys-ai-hub-action.scanning{border-color:#a78bfa;box-shadow:0 0 25px rgba(139,92,246,.22)}.sys-ai-hub-action.scanning:after{content:"";position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c4b5fd,#38bdf8,transparent);box-shadow:0 0 12px #8b5cf6;animation:sysAiScan 1.15s ease-in-out}.sys-ai-hub-action.scanning strong:after{content:" · TARANIYOR";color:#a78bfa;font-size:9px;letter-spacing:.09em}@keyframes sysAiScan{0%{top:0;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:100%;opacity:0}}.sys-ai-hub-content{display:grid;gap:12px}.sys-ai-hub-content>.school-ai-center{margin:0!important}.sys-ai-hub-note{padding:13px 15px;border:1px solid var(--border);border-radius:15px;color:var(--muted);background:var(--panel)}
      #screen-driver{background:radial-gradient(circle at 50% -15%,rgba(14,165,233,.13),transparent 38%),#05080d!important}.driver-shell{max-width:1440px!important;margin:auto!important;gap:12px!important}.driver-service-switch{position:sticky;top:0;z-index:8;padding:8px!important;border-radius:18px!important;background:rgba(5,8,13,.92)!important;backdrop-filter:blur(18px)}.driver-service-tab{min-height:72px!important;border-radius:15px!important}.driver-service-tab.active{border-color:rgba(56,189,248,.58)!important;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(15,23,42,.9))!important}.driver-info-bar{grid-template-columns:repeat(4,minmax(0,1fr)) auto!important;padding:11px 14px!important;border-radius:16px!important}.driver-workspace{grid-template-columns:minmax(0,1.22fr) minmax(320px,.78fr)!important;gap:12px!important}.driver-panel{border-radius:20px!important;background:rgba(10,15,24,.96)!important}.driver-current-card{border-color:rgba(56,189,248,.28)!important;background:radial-gradient(circle at 100% 0%,rgba(14,165,233,.16),transparent 42%),rgba(15,23,42,.86)!important}.driver-current-name{font-size:clamp(30px,5vw,60px)!important;line-height:1!important}.driver-current-order{min-width:72px!important;height:72px!important;font-size:30px!important}.driver-current-address{font-size:15px!important;line-height:1.5!important}.driver-actions{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important}.driver-action{min-height:96px!important;border-radius:18px!important}.driver-action strong{font-size:19px!important}.driver-action.primary{background:linear-gradient(145deg,#15803d,#166534)!important;border-color:#4ade80!important}.driver-action.danger{background:linear-gradient(145deg,#991b1b,#7f1d1d)!important}.driver-action.warning{background:linear-gradient(145deg,#a16207,#854d0e)!important}.driver-finish-btn{min-height:68px!important;border-radius:17px!important;font-size:18px!important}.driver-finish-btn.ready,.driver-finish-btn.distribution{background:linear-gradient(135deg,#16a34a,#166534)!important;color:#fff!important;border-color:#4ade80!important}.driver-list{max-height:calc(100dvh - 285px)!important}.driver-passenger-row.active{border-color:#38bdf8!important;box-shadow:0 0 0 2px rgba(56,189,248,.14)!important}.driver-call-btn,.driver-current-call-btn{min-height:48px!important}.driver-time-box strong,.driver-stat strong{font-size:22px!important}
      @media(max-width:1000px){.sys-ai-hub-actions{grid-template-columns:repeat(2,1fr)}.driver-workspace{grid-template-columns:1fr!important}.driver-list{max-height:420px!important}.driver-actions{grid-template-columns:repeat(3,1fr)!important}}
      @media(max-width:620px){.sys-ai-hub-hero{align-items:flex-start;flex-direction:column}.sys-ai-hub-actions{grid-template-columns:1fr 1fr}.sys-ai-personnel-panel header{align-items:flex-start;flex-direction:column}.sys-ai-personnel-stats{grid-template-columns:1fr 1fr}.driver-info-bar{grid-template-columns:1fr 1fr!important}.driver-current-main{grid-template-columns:auto 1fr!important}.driver-current-tools{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr!important}.driver-actions{grid-template-columns:1fr 1fr!important}.driver-action{min-height:82px!important}.driver-current-name{font-size:34px!important}}
      #screen-command.command-panel-backend{display:none!important}#screen-driver .driver-current-main{min-width:0!important;grid-template-columns:58px minmax(0,1fr)!important;align-items:start!important}#screen-driver .driver-current-main>div:nth-child(2){min-width:0!important}#screen-driver .driver-current-order{min-width:54px!important;width:54px!important;height:54px!important;font-size:23px!important}#screen-driver .driver-current-name{max-width:100%!important;overflow-wrap:anywhere!important;word-break:break-word!important;white-space:normal!important;font-size:clamp(22px,3.2vw,36px)!important;line-height:1.08!important}#screen-driver .driver-current-address{position:static!important;display:block!important;margin-top:8px!important;overflow-wrap:anywhere!important;word-break:break-word!important}#screen-driver .driver-current-tools{grid-column:1/-1!important;width:100%!important}#screen-driver .driver-finish-btn.ready:not(.distribution){background:linear-gradient(135deg,rgba(185,28,28,.92),rgba(127,29,29,.96))!important;border-color:rgba(248,113,113,.65)!important;color:#fff!important;box-shadow:0 0 18px rgba(239,68,68,.13)!important}.command-preview-fuel,.command-preview-fuel-difference{border-color:rgba(245,158,11,.28)!important;background:rgba(120,53,15,.12)!important}.address-bulk-select{width:20px;height:20px;accent-color:var(--accent);flex:0 0 auto}.address-book-bulk-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
    `;
    style.textContent += `.sys-ai-personnel-panel{position:relative;overflow:hidden}.sys-ai-personnel-panel.scanning{border-color:#38bdf8!important;box-shadow:0 0 25px rgba(56,189,248,.18)}.sys-ai-personnel-panel.scanning:after{content:"";position:absolute;z-index:2;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c4b5fd,#38bdf8,transparent);box-shadow:0 0 12px #38bdf8;animation:sysAiScan 1.15s ease-in-out}`;
    style.textContent += `.sys-ai-analysis-result{display:none;padding:18px;border:1px solid rgba(167,139,250,.3);border-radius:19px;background:linear-gradient(145deg,rgba(76,29,149,.13),var(--panel))}.sys-ai-analysis-result.active{display:block}.sys-ai-analysis-result h3{margin:5px 0 8px;font-size:22px}.sys-ai-analysis-result p{margin:0;color:var(--muted);line-height:1.55}.sys-ai-analysis-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}.sys-ai-analysis-metrics div{padding:12px;border:1px solid var(--border);border-radius:13px;background:rgba(2,6,23,.32)}.sys-ai-analysis-metrics strong,.sys-ai-analysis-metrics span{display:block}.sys-ai-analysis-metrics strong{font-size:21px;color:#c4b5fd}.sys-ai-analysis-metrics span{margin-top:3px;color:var(--muted);font-size:9px}.preview-fuel-brand-row{display:flex!important;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}.preview-fuel-logo{display:inline-grid!important;place-items:center;min-width:48px;padding:5px 7px;border-radius:8px;font-size:8px!important;font-weight:950;letter-spacing:.04em}.preview-fuel-logo.shell{color:#d71920;background:#ffd500;border:1px solid #fff0a0}.preview-fuel-logo.opet{color:#fff;background:#0057a8;border:1px solid #44a2e8}.command-preview-fuel-difference #previewFuelDifferencePercent{font-size:25px;color:#fbbf24}@media(max-width:1000px){#screen-driver{overflow-y:auto!important;overflow-x:hidden!important}.driver-shell{height:auto!important;min-height:100%!important;overflow:visible!important}.driver-workspace{overflow:visible!important;min-height:auto!important}.driver-panel{min-height:320px!important}.driver-list{max-height:440px!important}}@media(max-width:620px){.sys-ai-analysis-metrics{grid-template-columns:1fr 1fr}.driver-panel{min-height:280px!important}}`;
    style.textContent += `:root{--accent:#38bdf8;--accent-rgb:56,189,248;--blue:#38bdf8;--green:#22c55e;--warning:#f59e0b}.sys-ai-hub-hero,.sys-ai-personnel-panel,.sys-ai-analysis-result,#sysAiHubContent>.school-ai-center,#sysAiHubContent>.sys-ai-finance-radar{background:radial-gradient(circle at 100% 0%,rgba(245,158,11,.10),transparent 34%),linear-gradient(145deg,rgba(10,18,31,.98),rgba(3,8,18,.98))!important;border-color:rgba(56,189,248,.28)!important;color:var(--text)!important}.sys-ai-hub-action{background:linear-gradient(145deg,rgba(15,23,42,.96),rgba(5,10,20,.96))!important;border-color:rgba(56,189,248,.18)!important}.sys-ai-hub-action b,.sys-ai-analysis-result>small,.sys-ai-personnel-panel>header small{color:#38bdf8!important}.sys-ai-safety-findings,.sys-ai-detail-findings{display:grid;gap:8px;margin-top:13px}.sys-ai-finding{display:flex;align-items:flex-start;gap:9px;padding:10px 12px;border:1px solid rgba(56,189,248,.16);border-radius:12px;background:rgba(2,8,18,.42)}.sys-ai-finding i{width:8px;height:8px;margin-top:5px;border-radius:50%;background:#22c55e;box-shadow:0 0 9px rgba(34,197,94,.5)}.sys-ai-finding.warn i{background:#f59e0b;box-shadow:0 0 9px rgba(245,158,11,.5)}.sys-ai-finding.danger i{background:#ef4444;box-shadow:0 0 9px rgba(239,68,68,.5)}.sys-ai-finding strong,.sys-ai-finding span{display:block}.sys-ai-finding span{margin-top:2px;color:var(--muted);font-size:10px}.preview-fuel-logo-host{display:grid;place-items:center;width:58px;height:42px}.preview-fuel-logo-host .fuel-brand-logo{width:58px!important;height:42px!important;padding:3px!important}.preview-fuel-logo-host img{max-width:50px!important;max-height:35px!important;object-fit:contain}.command-preview-fuel-difference #previewFuelDifferencePercent.is-safe{color:#4ade80!important}.command-preview-fuel-difference #previewFuelDifferencePercent.is-due{color:#f87171!important;text-shadow:0 0 12px rgba(239,68,68,.35)}body.driver-focus-mode .content-scroll{padding-left:4px!important;padding-right:4px!important}#screen-driver,#screen-driver .driver-shell,#screen-driver .driver-workspace{width:100%!important;max-width:none!important}#screen-driver .driver-workspace{grid-template-columns:minmax(0,1.18fr) minmax(0,.82fr)!important;gap:8px!important}#screen-driver .driver-panel{width:100%!important;border-radius:14px!important}@media(max-width:1000px){#screen-driver .driver-workspace{grid-template-columns:1fr!important}.driver-current-card{padding-left:12px!important;padding-right:12px!important}}`;
    style.textContent += `.discount-fuel-preview{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:13px}.discount-fuel-preview div{padding:12px;border:1px solid rgba(56,189,248,.2);border-radius:13px;background:rgba(2,8,18,.42)}.discount-fuel-preview span,.discount-fuel-preview strong{display:block}.discount-fuel-preview span{color:var(--muted);font-size:9px}.discount-fuel-preview strong{margin-top:5px;font-size:19px;color:#7dd3fc}.preview-discount-fuel{display:block!important;margin-top:10px!important;padding-top:8px;border-top:1px solid rgba(56,189,248,.16);color:#7dd3fc!important;font-size:9px!important;line-height:1.4}.discount-fuel-note{margin-top:10px;color:var(--muted);font-size:10px;line-height:1.5}@media(max-width:620px){.discount-fuel-preview{grid-template-columns:1fr}}`;
    style.textContent += `.km-offer-form{display:grid;grid-template-columns:1.35fr repeat(3,1fr);gap:9px;align-items:end}.km-offer-auto{padding:12px;border:1px solid rgba(56,189,248,.24);border-radius:13px;background:rgba(2,8,18,.45)}.km-offer-auto span,.km-offer-auto strong{display:block}.km-offer-auto span{color:var(--muted);font-size:9px}.km-offer-auto strong{margin-top:5px;color:#7dd3fc;font-size:21px}.km-offer-list{display:grid;gap:8px;margin-top:15px}.km-offer-row{display:grid;grid-template-columns:minmax(150px,1.4fr) repeat(4,minmax(70px,.7fr)) auto;gap:8px;align-items:center;padding:11px;border:1px solid rgba(56,189,248,.16);border-radius:13px;background:rgba(2,8,18,.38)}.km-offer-row>div span,.km-offer-row>div strong{display:block}.km-offer-row>div span{color:var(--muted);font-size:8px;letter-spacing:.05em}.km-offer-row>div strong{margin-top:3px;font-size:12px}.km-offer-row-actions{display:flex;gap:6px}@media(max-width:900px){.km-offer-form{grid-template-columns:1fr 1fr}.km-offer-row{grid-template-columns:1fr 1fr}.km-offer-row-actions{grid-column:1/-1}}@media(max-width:560px){.km-offer-form{grid-template-columns:1fr}.km-offer-row{grid-template-columns:1fr 1fr}}`;
    document.head.appendChild(style);
  }

  function buildAiHub() {
    const main = $("#contentScroll");
    const nav = $(".nav");
    if (!main || !nav || $("#screen-sys-ai")) return;
    const navButton = document.createElement("button");
    navButton.className = "nav-btn sys-ai-nav";
    navButton.type = "button";
    navButton.innerHTML = '<span class="nav-label"><span class="dot"></span>SYS AI</span>';
    nav.appendChild(navButton);
    const screen = document.createElement("section");
    screen.className = "module-screen";
    screen.id = "screen-sys-ai";
    screen.innerHTML = `<div class="sys-ai-hub">
      <header class="sys-ai-hub-hero"><div><small>SYS AI · SİSTEM GENELİ AKILLI İŞLEMLER</small><h2>Akıllı Kontrol Merkezi</h2><p>Personel, okul, araç, finans ve geçmiş servis kontrollerini tek bölümden yönet.</p></div><div class="sys-ai-hub-state">● DENETİM HAZIR</div></header>
      <section class="sys-ai-personnel-panel"><header><div><small>PERSONEL SERVİSİ ANALİZİ</small><h3>Personel operasyonu akıllı kontrolü</h3><p>Aktif personel, firma, güzergâh ve servis hareketlerini birlikte denetler.</p></div><button class="btn small" type="button" data-action="ai-open-dashboard">Personel Analizi Yap</button></header><div class="sys-ai-personnel-stats"><div><strong id="sysAiPersonnelCount">0</strong><span>AKTİF PERSONEL</span></div><div><strong id="sysAiCompanyCount">0</strong><span>AKTİF FİRMA</span></div><div><strong id="sysAiRouteCount">0</strong><span>GÜZERGÂH</span></div><div><strong id="sysAiPersonnelSessionCount">0</strong><span>AKTİF SERVİS</span></div></div></section>
      <div class="sys-ai-hub-actions">
        <button class="sys-ai-hub-action" data-action="ai-open-dashboard"><b>01</b><strong>Personel Servisi Zekâsı</strong><span>Personel, vardiya, firma, biniş ve dağıtım risklerini denetle.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-open-dashboard"><b>02</b><strong>Okul Güvenliği</strong><span>Öğrenci, veli, rehber, kapasite ve yoklama açıklarını incele.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-open-dashboard"><b>03</b><strong>Araç ve Evrak</strong><span>Bakım, muayene, sigorta ve kapasite uyarılarını kontrol et.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-open-dashboard"><b>04</b><strong>Finans Radarı</strong><span>Tahsilat, fatura, ödeme ve yakıt farkı risklerini incele.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-open-dashboard"><b>05</b><strong>Eksik Servis Denetimi</strong><span>Tamamlanmamış geçmiş seferleri ve çetele uyumunu bul.</span></button>
        <button class="sys-ai-hub-action" data-action="school-ai-payments"><b>06</b><strong>Tahsilat İşlemleri</strong><span>Öğrenci ödeme açıklarını doğrudan görüntüle.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-refresh"><b>07</b><strong>Tüm Sistemi Tara</strong><span>Bütün akıllı bulguları tek işlemle yeniden hesapla.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-export"><b>08</b><strong>Akıllı Özet</strong><span>Günlük operasyon, okul ve finans özetini oluştur.</span></button>
      </div><div class="sys-ai-hub-content" id="sysAiHubContent"><div class="sys-ai-hub-note">Okul güvenliği dâhil tüm akıllı denetimler artık bu merkezde toplanır.</div></div></div>`;
    main.appendChild(screen);
    const personnelSafetyCenter = $(".sys-ai-personnel-panel", screen);
    if (personnelSafetyCenter) {
      personnelSafetyCenter.id = "sysAiPersonnelSafetyCenter";
      personnelSafetyCenter.querySelector("h3").textContent = "Personel Güvenlik Merkezi";
      personnelSafetyCenter.querySelector("p").textContent = "Personel, telefon, adres, firma, güzergâh ve servis güvenlik bağlarını birlikte denetler.";
      const safetyFindings = document.createElement("div");
      safetyFindings.className = "sys-ai-safety-findings";
      safetyFindings.id = "sysAiPersonnelSafetyFindings";
      safetyFindings.innerHTML = '<div class="sys-ai-finding"><i></i><div><strong>Analize hazır</strong><span>Personel güvenlik bulguları tarama sonrasında burada ayrıntılı gösterilir.</span></div></div>';
      personnelSafetyCenter.appendChild(safetyFindings);
    }
    const analysisResult = document.createElement("section");
    analysisResult.className = "sys-ai-analysis-result";
    analysisResult.id = "sysAiAnalysisResult";
    $(".sys-ai-hub-actions", screen)?.after(analysisResult);
    const analysisType = (action) => {
      if (action.closest(".sys-ai-personnel-panel")) return "personnel";
      return ({ "01": "personnel", "02": "school", "03": "vehicle", "04": "finance", "05": "missing" })[action.querySelector("b")?.textContent?.trim()] || "";
    };
    const showAnalysis = (type) => {
      const activePeople = (state.people || []).filter((item) => item.status !== "Pasif").length;
      const activeStudents = (state.students || []).filter((item) => item.status !== "Pasif").length;
      const activeVehicles = (state.vehicles || []).filter((item) => item.status !== "Pasif").length;
      const missingDocuments = (state.documents || []).filter((item) => !item.expiryDate || new Date(item.expiryDate) < new Date()).length;
      const openSchool = (state.schoolServiceSessions || []).filter((item) => item.isActive).length;
      const openPersonnel = (state.serviceSessions || []).filter((item) => item.isActive).length;
      const unpaid = (state.schoolPayments || []).filter((item) => item.status !== "Ödendi").length;
      const incomplete = (state.serviceSessions || []).filter((item) => !item.isActive && item.status !== "Tamamlandı").length;
      const missingPersonPhone = (state.people || []).filter((item) => item.status !== "Pasif" && !String(item.phone || item.mobile || "").trim()).length;
      const missingPersonAddress = (state.people || []).filter((item) => item.status !== "Pasif" && !String(item.address || item.location || "").trim()).length;
      const unassignedPeople = (state.people || []).filter((item) => item.status !== "Pasif" && !item.routeId && !item.companyId).length;
      const expiredMaintenance = (state.vehicleMaintenance || []).filter((item) => item.nextDate && new Date(item.nextDate) < new Date()).length;
      const data = {
        personnel: ["Personel Güvenlik Analizi", "Personel, firma, güzergâh ve aktif sefer bağlantıları birlikte tarandı.", [[activePeople,"Aktif personel"],[(state.companies||[]).length,"Firma"],[openPersonnel,"Aktif personel servisi"]], [[missingPersonPhone,"Telefonu eksik personel"],[missingPersonAddress,"Adresi eksik personel"],[unassignedPeople,"Firma/güzergâh ataması eksik"]]],
        school: ["Öğrenci Güvenlik Analizi", "Öğrenci, veli, rehber ve okul servis oturumları güvenlik açısından incelendi.", [[activeStudents,"Aktif öğrenci"],[(state.guides||[]).length,"Rehber"],[openSchool,"Aktif okul servisi"]], [[Math.max(0,activeStudents-(state.guides||[]).length),"Rehber kapsaması kontrolü"],[(state.schoolAttendance||[]).filter(item=>item.status==="Bekliyor").length,"Bekleyen yoklama"],[openSchool,"Canlı okul operasyonu"]]],
        vehicle: ["Araç ve Evrak Analizi", "Araç kapasitesi, bakım kayıtları ve süresi yaklaşan ya da eksik evraklar kontrol edildi.", [[activeVehicles,"Aktif araç"],[(state.vehicleMaintenance||[]).length,"Bakım kaydı"],[missingDocuments,"Evrak uyarısı"]], [[missingDocuments,"Eksik/süresi geçen evrak"],[expiredMaintenance,"Geciken bakım"],[(state.vehicles||[]).filter(item=>!item.driverName).length,"Şoför ataması eksik"]]],
        finance: ["Finans Radarı Analizi", "Tahsilat, ödeme, fatura ve mazot farkı sinyalleri finans riski için tarandı.", [[(state.financeRecords||[]).length,"Finans kaydı"],[unpaid,"Açık ödeme"],[$("#commandFuelPercent")?.textContent||"%0","Mazot değişimi"]], [[unpaid,"Takip edilecek tahsilat"],[(state.financeRecords||[]).filter(item=>!item.invoiceNo).length,"Fatura numarası eksik"],[$("#commandFuelStatusPill")?.textContent||"Hazır","Mazot farkı durumu"]]],
        missing: ["Eksik Servis Analizi", "Planlanmış seferler, kapanış durumları ve çetele uyumu eksik kayıtlar için tarandı.", [[incomplete,"Kontrol edilecek"],[(state.manualServiceCorrections||[]).length,"Düzeltme kaydı"],[(state.dayMarks||[]).length,"Çetele kaydı"]], [[incomplete,"Kapanışı kontrol edilecek sefer"],[(state.dayMarks||[]).filter(item=>!item.status).length,"Durumu eksik çetele"],[(state.manualServiceCorrections||[]).length,"Uygulanmış operasyon düzeltmesi"]]]
      }[type];
      if (!data) return;
      analysisResult.innerHTML = `<small>SYS AI · DETAYLI ANALİZ</small><h3>${data[0]}</h3><p>${data[1]}</p><div class="sys-ai-analysis-metrics">${data[2].map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join("")}</div><div class="sys-ai-detail-findings">${data[3].map(([value,label])=>`<div class="sys-ai-finding ${Number(value)>0?'warn':''}"><i></i><div><strong>${value}</strong><span>${label}</span></div></div>`).join("")}</div>`;
      if (type === "personnel" && $("#sysAiPersonnelSafetyFindings")) $("#sysAiPersonnelSafetyFindings").innerHTML = data[3].map(([value,label])=>`<div class="sys-ai-finding ${Number(value)>0?'warn':''}"><i></i><div><strong>${value}</strong><span>${label}</span></div></div>`).join("");
      analysisResult.classList.add("active");
      window.setTimeout(() => analysisResult.scrollIntoView({ behavior: "smooth", block: "nearest" }), 1200);
    };
    const updatePersonnelSummary = () => {
      const set = (selector, value) => { const element = $(selector); if (element) element.textContent = String(value); };
      set("#sysAiPersonnelCount", (state.people || []).filter((item) => item.status !== "Pasif").length);
      set("#sysAiCompanyCount", (state.companies || []).filter((item) => item.status !== "Pasif").length);
      set("#sysAiRouteCount", (state.routes || []).filter((item) => item.status !== "Pasif").length);
      set("#sysAiPersonnelSessionCount", (state.serviceSessions || []).filter((item) => item.isActive).length);
    };
    updatePersonnelSummary();
    const collectAiPanels = () => {
      const host = $("#sysAiHubContent");
      if (!host) return;
      ["#schoolAiSafetyCenter", "#sysAiInspectorCard", "#sysAiDomainPulseCard", "#sysAiCommandDock", "#sysAiFinanceRadar"].forEach((selector) => {
        const panel = $(selector); if (panel && panel.parentElement !== host) host.appendChild(panel);
      });
    };
    collectAiPanels();
    new MutationObserver(collectAiPanels).observe(document.body, { childList: true, subtree: true });
    navButton.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));
      document.querySelectorAll(".module-screen").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active"); screen.classList.add("active");
      if ($("#pageTitle")) $("#pageTitle").textContent = "SYS AI";
      if ($("#pageLead")) $("#pageLead").textContent = "Sistem genelindeki akıllı denetim ve karar işlemleri.";
      updatePersonnelSummary();
      $("#sidebar")?.classList.remove("open"); screen.scrollTo({ top: 0, behavior: "smooth" });
    });
    screen.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      const card = action.classList.contains("sys-ai-hub-action") ? action : action.closest(".sys-ai-personnel-panel");
      if (!card || card.classList.contains("scanning")) return;
      const selectedAnalysis = analysisType(action);
      if (selectedAnalysis) event.stopImmediatePropagation();
      card.classList.add("scanning");
      const stateLabel = $(".sys-ai-hub-state");
      if (stateLabel) stateLabel.textContent = "◌ SİSTEM TARANIYOR";
      window.setTimeout(() => { card.classList.remove("scanning"); if (stateLabel) stateLabel.textContent = "● ANALİZ TAMAMLANDI"; updatePersonnelSummary(); showAnalysis(selectedAnalysis); }, 1250);
    }, true);
    document.addEventListener("click", (event) => { if (event.target.closest(".nav-btn") !== navButton) navButton.classList.remove("active"); }, true);
  }

  function addImportedContacts(items) {
    if (!Array.isArray(state.addressBook)) state.addressBook = [];
    const existing = new Set(state.addressBook.map((item) => `${String(item.name || "").toLocaleLowerCase("tr-TR")}|${String(item.note || "")}`));
    let added = 0;
    items.forEach((item) => {
      const name = String(item.name || "").trim(); const phone = String(item.phone || "").trim(); const address = String(item.address || "").trim();
      if (!name && !phone) return;
      const note = [phone ? `Telefon: ${phone}` : "", item.note || ""].filter(Boolean).join(" · ");
      const key = `${name.toLocaleLowerCase("tr-TR")}|${note}`; if (existing.has(key)) return;
      const now = new Date().toISOString(); state.addressBook.push({ id: uid("address"), name: name || phone, location: address || "Adres henüz eklenmedi", note, createdAt: now, updatedAt: now, source: "phone-import" }); existing.add(key); added += 1;
    });
    saveState(); renderAddressBook(); showToast(added ? `${added} telefon kişisi adres defterine aktarıldı.` : "Yeni kişi bulunamadı veya kayıtlar zaten mevcut.");
  }

  function parseContactFile(text, name) {
    if (/\.json$/i.test(name)) { const parsed = JSON.parse(text); const rows = Array.isArray(parsed) ? parsed : (parsed.addressBook || parsed.contacts || []); return rows.map((row) => ({ name: row.name || row.fullName, phone: row.phone || row.tel || row.note?.match(/[+\d][\d\s()-]{6,}/)?.[0] || "", address: row.location || row.address || "", note: row.note || "" })); }
    if (/\.vcf$|\.vcard$/i.test(name) || /BEGIN:VCARD/i.test(text)) return text.split(/END:VCARD/i).map((block) => { const value = (key) => (block.match(new RegExp(`(?:^|\\n)${key}[^:]*:(.*)`, "i"))?.[1] || "").replace(/\\n/g, " ").trim(); return { name: value("FN") || value("N").split(";").reverse().join(" ").trim(), phone: value("TEL"), address: value("ADR").replace(/;/g, " ").replace(/\s+/g, " ") }; }).filter((row) => row.name || row.phone);
    const lines = text.split(/\r?\n/).filter(Boolean); if (!lines.length) return [];
    const delimiter = lines[0].includes(";") ? ";" : ","; const headers = lines.shift().split(delimiter).map((value) => value.replace(/^"|"$/g, "").trim().toLocaleLowerCase("tr-TR"));
    const find = (words) => headers.findIndex((header) => words.some((word) => header.includes(word)));
    const nameIndex = find(["name", "ad soyad", "isim"]), phoneIndex = find(["phone", "telefon", "tel"]), addressIndex = find(["address", "adres"]);
    return lines.map((line) => { const cells = line.split(delimiter).map((value) => value.replace(/^"|"$/g, "").trim()); return { name: cells[nameIndex] || "", phone: cells[phoneIndex] || "", address: cells[addressIndex] || "" }; });
  }

  function installContactImport() {
    const form = $("#addressBookForm"); if (!form || $("#phoneContactImport")) return;
    const box = document.createElement("div"); box.className = "address-book-hint"; box.id = "phoneContactImport";
    box.innerHTML = `<strong>Telefon rehberi / yedek aktarımı</strong><br>Desteklenirse telefondan kişi seçebilir; ayrıca .vcf, .csv veya SYS .json yedeği yükleyebilirsin.<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px"><button class="btn small" id="pickPhoneContactsBtn" type="button">Telefondan Kişi Seç</button><button class="btn small" id="importContactFileBtn" type="button">Rehber Yedeği Yükle</button><input id="contactImportFile" type="file" accept=".vcf,.vcard,.csv,.json,text/vcard,text/csv,application/json" hidden></div>`;
    form.querySelector(".address-book-actions")?.before(box);
    $("#pickPhoneContactsBtn").addEventListener("click", async () => {
      if (!navigator.contacts?.select) { showToast("Bu telefonda doğrudan rehber seçimi desteklenmiyor. Rehberi .vcf olarak dışa aktarıp ‘Rehber Yedeği Yükle’yi kullan."); return; }
      try { const contacts = await navigator.contacts.select(["name", "tel", "address"], { multiple: true }); addImportedContacts(contacts.map((contact) => ({ name: contact.name?.[0] || "", phone: contact.tel?.[0] || "", address: contact.address?.[0]?.addressLine?.join(" ") || "" }))); } catch (error) { if (error?.name !== "AbortError") showToast("Telefon rehberi açılamadı."); }
    });
    $("#importContactFileBtn").addEventListener("click", () => $("#contactImportFile").click());
    $("#contactImportFile").addEventListener("change", async (event) => { const file = event.target.files?.[0]; if (!file) return; try { addImportedContacts(parseContactFile(await file.text(), file.name)); } catch (error) { console.error(error); showToast("Rehber yedeği okunamadı. VCF, CSV veya JSON dosyasını kontrol et."); } event.target.value = ""; });
  }

  function installAddressBulkDelete() {
    const list = $("#addressBookList");
    const selectAll = $("#selectAllAddressesBtn");
    const remove = $("#deleteSelectedAddressesBtn");
    if (!list || !selectAll || !remove || remove.dataset.ready) return;
    remove.dataset.ready = "1";
    const selectedIds = () => [...list.querySelectorAll("[data-address-select]:checked")].map((box) => box.dataset.addressSelect);
    const refresh = () => {
      const boxes = [...list.querySelectorAll("[data-address-select]")];
      const count = selectedIds().length;
      remove.disabled = count === 0;
      remove.textContent = count ? `Seçilenleri Sil (${count})` : "Seçilenleri Sil";
      selectAll.textContent = boxes.length && count === boxes.length ? "Seçimi Kaldır" : "Tümünü Seç";
    };
    list.addEventListener("change", (event) => { if (event.target.matches("[data-address-select]")) refresh(); });
    selectAll.addEventListener("click", () => {
      const boxes = [...list.querySelectorAll("[data-address-select]")];
      const mark = boxes.some((box) => !box.checked);
      boxes.forEach((box) => { box.checked = mark; });
      refresh();
    });
    remove.addEventListener("click", async () => {
      const ids = selectedIds();
      if (!ids.length || !await appConfirm(`${ids.length} adres kaydı kalıcı olarak silinsin mi?`, { title: "Adresleri Toplu Sil", danger: true, confirmText: "Seçilenleri Sil", icon: "!" })) return;
      state.addressBook = (state.addressBook || []).filter((item) => !ids.includes(item.id));
      appendAudit("Adres Defteri", "Adresler toplu silindi", `${ids.length} kayıt`);
      saveState();
      renderAddressBook();
      refresh();
      showToast(`${ids.length} adres kaydı silindi.`);
    });
    new MutationObserver(refresh).observe(list, { childList: true });
    refresh();
  }

  function installDiscountFuelSettings() {
    const fuelCard = $("#fuelPriceSettingsCard");
    if (!fuelCard || $("#discountFuelSettingsCard")) return;
    const saved = state.settings?.discountFuel || {};
    const card = document.createElement("div");
    card.className = "card panel settings-panel fuel-settings-card";
    card.id = "discountFuelSettingsCard";
    card.innerHTML = `<div class="panel-header"><div><h2 class="panel-title">İndirimli Mazot</h2><div class="panel-sub">Anlaşmalı indirim oranını güncel pompa fiyatına uygula.</div></div></div><div class="two"><div class="field"><label for="discountFuelPercent">İndirim Oranı (%)</label><input id="discountFuelPercent" type="number" min="0" max="100" step="0.01" inputmode="decimal" value="${Number(saved.percent || 0)}"></div><div class="field"><label for="discountFuelSource">Hesaplama Fiyatı</label><select id="discountFuelSource"><option value="average">Shell + Opet Ortalaması</option><option value="shell">Shell Güncel Fiyatı</option><option value="opet">Opet Güncel Fiyatı</option></select></div></div><div class="discount-fuel-preview"><div><span>GÜNCEL BAZ FİYAT</span><strong id="discountFuelBasePrice">—</strong></div><div><span>İNDİRİM TUTARI</span><strong id="discountFuelSaving">—</strong></div><div><span>MAZOTU ALDIĞINIZ FİYAT</span><strong id="discountFuelPurchasePrice">—</strong></div></div><div class="discount-fuel-note">Hesaplanan alış fiyatı Komuta Paneli’ndeki Mazot Fiyatları kartında da gösterilir.</div><div class="settings-actions"><button class="btn primary" id="saveDiscountFuelBtn" type="button">İndirimli Mazotu Kaydet</button></div>`;
    fuelCard.after(card);
    $("#discountFuelSource").value = ["average","shell","opet"].includes(saved.source) ? saved.source : "average";
    const readPrice = (selector) => { const raw = $(selector)?.textContent || ""; const normalized = raw.replace(/[^0-9,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", "."); return Number.parseFloat(normalized) || 0; };
    const money = (value) => value > 0 ? `₺${value.toFixed(2).replace(".", ",")}/L` : "—";
    const calculate = () => {
      const percent = Math.max(0, Math.min(100, Number($("#discountFuelPercent").value || 0)));
      const source = $("#discountFuelSource").value;
      const shell = readPrice("#shellFuelPrice"), opet = readPrice("#opetFuelPrice");
      const base = source === "shell" ? shell : source === "opet" ? opet : shell && opet ? (shell + opet) / 2 : (shell || opet);
      const saving = base * percent / 100;
      $("#discountFuelBasePrice").textContent = money(base);
      $("#discountFuelSaving").textContent = money(saving);
      $("#discountFuelPurchasePrice").textContent = money(base - saving);
      return { percent, source, base, purchase: base - saving };
    };
    $("#discountFuelPercent").addEventListener("input", calculate);
    $("#discountFuelSource").addEventListener("change", calculate);
    $("#saveDiscountFuelBtn").addEventListener("click", () => {
      const result = calculate();
      state.settings = state.settings || {};
      state.settings.discountFuel = { percent: result.percent, source: result.source, updatedAt: new Date().toISOString() };
      saveState();
      showToast(result.percent > 0 ? `İndirimli mazot oranı %${result.percent.toLocaleString("tr-TR")} olarak kaydedildi.` : "İndirimli mazot hesaplaması kapatıldı.");
    });
    const prices = $("#shellFuelCard")?.parentElement;
    if (prices && window.MutationObserver) new MutationObserver(calculate).observe(prices, { subtree: true, childList: true, characterData: true });
    calculate();
  }

  function installKmOfferRecords() {
    const anchor = $("#discountFuelSettingsCard") || $("#fuelPriceSettingsCard");
    if (!anchor || $("#kmOfferRecordsCard")) return;
    state.settings = state.settings || {};
    if (!Array.isArray(state.settings.kmOfferRecords)) state.settings.kmOfferRecords = [];
    const card = document.createElement("div");
    card.className = "card panel settings-panel settings-wide-card";
    card.id = "kmOfferRecordsCard";
    card.innerHTML = `<div class="panel-header"><div><h2 class="panel-title">KM Teklif Kayıtları</h2><div class="panel-sub">Gelen işleri firma, kilometre, personel ve fiyat bilgisiyle kalıcı olarak kaydet.</div></div></div><form id="kmOfferForm"><input id="kmOfferId" type="hidden"><div class="km-offer-form"><div class="field"><label for="kmOfferCompany">Firma Adı *</label><input id="kmOfferCompany" maxlength="100" required placeholder="Firma adı"></div><div class="field"><label for="kmOfferKm">Toplam KM *</label><input id="kmOfferKm" type="number" min="0.01" step="0.01" inputmode="decimal" required placeholder="80"></div><div class="field"><label for="kmOfferPeople">Toplam Personel *</label><input id="kmOfferPeople" type="number" min="1" step="1" inputmode="numeric" required placeholder="4"></div><div class="field"><label for="kmOfferPrice">Fiyat *</label><input id="kmOfferPrice" type="number" min="0" step="0.01" inputmode="decimal" required placeholder="4500"></div></div><div class="km-offer-auto"><span>KM FİYATI · FİYAT / TOPLAM KM</span><strong id="kmOfferUnitPrice">₺0,00/km</strong></div><div class="settings-actions"><button class="btn primary" id="saveKmOfferBtn" type="submit">Teklifi Kaydet</button><button class="btn" id="clearKmOfferBtn" type="button">Temizle</button></div></form><div class="km-offer-list" id="kmOfferList"></div>`;
    anchor.after(card);
    const money = (value) => Number(value || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const calculate = () => {
      const km = Number($("#kmOfferKm").value || 0), price = Number($("#kmOfferPrice").value || 0);
      const unit = km > 0 ? price / km : 0;
      $("#kmOfferUnitPrice").textContent = `${money(unit)}/km`;
      return unit;
    };
    const clear = () => { $("#kmOfferId").value = ""; $("#kmOfferForm").reset(); $("#saveKmOfferBtn").textContent = "Teklifi Kaydet"; calculate(); };
    const render = () => {
      const rows = [...state.settings.kmOfferRecords].sort((a,b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
      $("#kmOfferList").innerHTML = rows.length ? rows.map((item) => `<article class="km-offer-row"><div><span>FİRMA</span><strong>${escapeHtml(item.company)}</strong></div><div><span>TOPLAM KM</span><strong>${Number(item.totalKm).toLocaleString("tr-TR")} km</strong></div><div><span>PERSONEL</span><strong>${Number(item.totalPeople).toLocaleString("tr-TR")} kişi</strong></div><div><span>FİYAT</span><strong>${money(item.price)}</strong></div><div><span>KM FİYATI</span><strong>${money(item.unitPrice)}/km</strong></div><div class="km-offer-row-actions"><button class="btn small" type="button" data-km-offer-edit="${escapeHtml(item.id)}">Düzenle</button><button class="btn small danger" type="button" data-km-offer-delete="${escapeHtml(item.id)}">Sil</button></div></article>`).join("") : '<div class="sys-ai-hub-note">Henüz KM teklif kaydı bulunmuyor.</div>';
    };
    $("#kmOfferKm").addEventListener("input", calculate);
    $("#kmOfferPrice").addEventListener("input", calculate);
    $("#clearKmOfferBtn").addEventListener("click", clear);
    $("#kmOfferForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const company = $("#kmOfferCompany").value.trim(), totalKm = Number($("#kmOfferKm").value), totalPeople = Number($("#kmOfferPeople").value), price = Number($("#kmOfferPrice").value);
      if (!company || totalKm <= 0 || totalPeople < 1 || price < 0) { showToast("Firma, KM, personel ve fiyat bilgilerini kontrol et."); return; }
      const id = $("#kmOfferId").value || uid("kmOffer");
      const previous = state.settings.kmOfferRecords.find((item) => item.id === id);
      const record = { id, company, totalKm, totalPeople, price, unitPrice: price / totalKm, createdAt: previous?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
      state.settings.kmOfferRecords = previous ? state.settings.kmOfferRecords.map((item) => item.id === id ? record : item) : [...state.settings.kmOfferRecords, record];
      appendAudit("KM Teklif", previous ? "Teklif güncellendi" : "Teklif kaydedildi", `${company} · ${totalKm} km · ${money(price)}`);
      saveState(); render(); clear(); showToast(previous ? "KM teklif kaydı güncellendi." : "KM teklif kaydı kalıcı olarak kaydedildi.");
    });
    $("#kmOfferList").addEventListener("click", async (event) => {
      const editId = event.target.closest("[data-km-offer-edit]")?.dataset.kmOfferEdit;
      const deleteId = event.target.closest("[data-km-offer-delete]")?.dataset.kmOfferDelete;
      if (editId) { const item = state.settings.kmOfferRecords.find((row) => row.id === editId); if (!item) return; $("#kmOfferId").value=item.id; $("#kmOfferCompany").value=item.company; $("#kmOfferKm").value=item.totalKm; $("#kmOfferPeople").value=item.totalPeople; $("#kmOfferPrice").value=item.price; $("#saveKmOfferBtn").textContent="Değişiklikleri Kaydet"; calculate(); card.scrollIntoView({behavior:"smooth",block:"start"}); return; }
      if (deleteId) { const item = state.settings.kmOfferRecords.find((row) => row.id === deleteId); if (!item || !await appConfirm(`“${item.company}” KM teklif kaydı silinsin mi?`, { title:"KM Teklif Kaydını Sil", danger:true, confirmText:"Sil", icon:"!" })) return; state.settings.kmOfferRecords = state.settings.kmOfferRecords.filter((row) => row.id !== deleteId); appendAudit("KM Teklif", "Teklif silindi", item.company); saveState(); render(); showToast("KM teklif kaydı silindi."); }
    });
    render(); calculate();
  }

  function showFirstSetup() {
    if (localStorage.getItem("SYS_FIRST_SETUP_PENDING_V1") !== "1" || $("#sysFirstSetupLayer")) return;
    const layer = document.createElement("div"); layer.id = "sysFirstSetupLayer"; layer.style.cssText = "position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:16px;background:rgba(2,6,12,.88);backdrop-filter:blur(14px)";
    layer.innerHTML = `<section style="width:min(720px,100%);max-height:94vh;overflow:auto;padding:24px;border:1px solid rgba(96,165,250,.32);border-radius:24px;background:var(--panel);color:var(--text)"><small style="color:var(--accent);font-weight:950;letter-spacing:.12em">SYS · İLK KURULUM</small><h2 style="margin:8px 0">Temel bilgileri birlikte hazırlayalım</h2><p style="color:var(--muted)">Bütün alanlar isteğe bağlıdır. Şimdi doldurabilir veya kurulumu atlayıp daha sonra kayıtlardan tamamlayabilirsin.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:11px"><label class="field"><span>İşletme / Kullanıcı Adı</span><input id="setupOwner" placeholder="Örn. Tufan Turizm"></label><label class="field"><span>Telefon</span><input id="setupPhone" inputmode="tel" placeholder="05xx xxx xx xx"></label><label class="field"><span>İlk Firma</span><input id="setupCompany" placeholder="İsteğe bağlı"></label><label class="field"><span>İlk Araç Plakası</span><input id="setupPlate" placeholder="34 ABC 123"></label><label class="field"><span>Şoför Adı</span><input id="setupDriver" placeholder="İsteğe bağlı"></label><label class="field"><span>Tema</span><select id="setupTheme"><option value="">Mevcut tema</option><option value="dark">Koyu</option><option value="navy">Lacivert</option><option value="turquoise">Turkuaz</option><option value="light">Açık</option></select></label></div><div style="display:flex;justify-content:flex-end;gap:9px;flex-wrap:wrap;margin-top:18px"><button class="btn" id="skipFirstSetup" type="button">Şimdilik Atla</button><button class="btn primary" id="saveFirstSetup" type="button">Kurulumu Tamamla</button></div></section>`;
    document.body.appendChild(layer);
    const finish = (save) => { if (save) { const owner = $("#setupOwner").value.trim(), phone = $("#setupPhone").value.trim(), companyName = $("#setupCompany").value.trim(), plate = $("#setupPlate").value.trim(), driverName = $("#setupDriver").value.trim(), theme = $("#setupTheme").value; state.settings = { ...(state.settings || {}), businessName: owner, businessPhone: phone, ...(theme ? { theme } : {}) }; const admin = state.users?.find((user) => user.role === "admin"); if (admin && owner) admin.fullName = owner; let vehicleId = ""; if (plate) { vehicleId = uid("vehicle"); state.vehicles.push({ id: vehicleId, plate, driverName, status: "Aktif", createdAt: new Date().toISOString() }); } if (companyName) { const routeId = uid("route"); state.routes.push({ id: routeId, name: `${companyName} Servisi`, status: "Aktif" }); state.companies.push({ id: uid("company"), name: companyName, routeId, defaultVehicleId: vehicleId, status: "Aktif" }); } saveState(); } localStorage.removeItem("SYS_FIRST_SETUP_PENDING_V1"); layer.remove(); renderAll(); showToast(save ? "İlk kurulum tamamlandı." : "İlk kurulum atlandı. Bilgileri daha sonra ekleyebilirsin."); };
    $("#skipFirstSetup").addEventListener("click", () => finish(false)); $("#saveFirstSetup").addEventListener("click", () => finish(true));
  }

  function install() { installStyles(); buildAiHub(); installContactImport(); installAddressBulkDelete(); installDiscountFuelSettings(); installKmOfferRecords(); showFirstSetup(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true }); else install();
})();
