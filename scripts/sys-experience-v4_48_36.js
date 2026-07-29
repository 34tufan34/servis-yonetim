(function () {
  "use strict";
  if (window.__SYS_EXPERIENCE_V44836__) return;
  window.__SYS_EXPERIENCE_V44836__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);

  function installStyles() {
    const style = document.createElement("style");
    style.id = "sys-experience-v44836";
    style.textContent = `
      .command-preview-actions .is-service-active{background:linear-gradient(135deg,rgba(34,197,94,.28),rgba(21,128,61,.18));border-color:rgba(74,222,128,.62);color:#bbf7d0;box-shadow:0 0 22px rgba(34,197,94,.16)}
      .sys-ai-nav .dot{background:#a78bfa!important;box-shadow:0 0 12px rgba(167,139,250,.8)}
      .sys-ai-hub{display:grid;gap:14px}.sys-ai-hub-hero{padding:22px;border:1px solid rgba(167,139,250,.28);border-radius:22px;background:radial-gradient(circle at 90% 0%,rgba(124,58,237,.22),transparent 38%),linear-gradient(145deg,rgba(17,24,39,.98),rgba(5,8,15,.98));display:flex;align-items:center;justify-content:space-between;gap:20px}.sys-ai-hub-hero small{color:#c4b5fd;font-weight:950;letter-spacing:.13em}.sys-ai-hub-hero h2{margin:7px 0 5px;font-size:clamp(25px,4vw,42px)}.sys-ai-hub-hero p{margin:0;color:var(--muted);max-width:760px}.sys-ai-hub-state{padding:13px 17px;border:1px solid rgba(74,222,128,.35);border-radius:16px;background:rgba(34,197,94,.10);color:#86efac;font-weight:950;white-space:nowrap}.sys-ai-hub-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.sys-ai-hub-action{min-height:104px;padding:15px;border:1px solid rgba(148,163,184,.16);border-radius:17px;background:var(--panel);color:var(--text);text-align:left;cursor:pointer}.sys-ai-hub-action b{display:block;color:#c4b5fd;font-size:20px}.sys-ai-hub-action strong{display:block;margin-top:8px}.sys-ai-hub-action span{display:block;margin-top:5px;color:var(--muted);font-size:10px;line-height:1.4}.sys-ai-hub-content{display:grid;gap:12px}.sys-ai-hub-content>.school-ai-center{margin:0!important}.sys-ai-hub-note{padding:13px 15px;border:1px solid var(--border);border-radius:15px;color:var(--muted);background:var(--panel)}
      #screen-driver{background:radial-gradient(circle at 50% -15%,rgba(14,165,233,.13),transparent 38%),#05080d!important}.driver-shell{max-width:1440px!important;margin:auto!important;gap:12px!important}.driver-service-switch{position:sticky;top:0;z-index:8;padding:8px!important;border-radius:18px!important;background:rgba(5,8,13,.92)!important;backdrop-filter:blur(18px)}.driver-service-tab{min-height:72px!important;border-radius:15px!important}.driver-service-tab.active{border-color:rgba(56,189,248,.58)!important;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(15,23,42,.9))!important}.driver-info-bar{grid-template-columns:repeat(4,minmax(0,1fr)) auto!important;padding:11px 14px!important;border-radius:16px!important}.driver-workspace{grid-template-columns:minmax(0,1.22fr) minmax(320px,.78fr)!important;gap:12px!important}.driver-panel{border-radius:20px!important;background:rgba(10,15,24,.96)!important}.driver-current-card{border-color:rgba(56,189,248,.28)!important;background:radial-gradient(circle at 100% 0%,rgba(14,165,233,.16),transparent 42%),rgba(15,23,42,.86)!important}.driver-current-name{font-size:clamp(30px,5vw,60px)!important;line-height:1!important}.driver-current-order{min-width:72px!important;height:72px!important;font-size:30px!important}.driver-current-address{font-size:15px!important;line-height:1.5!important}.driver-actions{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important}.driver-action{min-height:96px!important;border-radius:18px!important}.driver-action strong{font-size:19px!important}.driver-action.primary{background:linear-gradient(145deg,#15803d,#166534)!important;border-color:#4ade80!important}.driver-action.danger{background:linear-gradient(145deg,#991b1b,#7f1d1d)!important}.driver-action.warning{background:linear-gradient(145deg,#a16207,#854d0e)!important}.driver-finish-btn{min-height:68px!important;border-radius:17px!important;font-size:18px!important}.driver-finish-btn.ready,.driver-finish-btn.distribution{background:linear-gradient(135deg,#16a34a,#166534)!important;color:#fff!important;border-color:#4ade80!important}.driver-list{max-height:calc(100dvh - 285px)!important}.driver-passenger-row.active{border-color:#38bdf8!important;box-shadow:0 0 0 2px rgba(56,189,248,.14)!important}.driver-call-btn,.driver-current-call-btn{min-height:48px!important}.driver-time-box strong,.driver-stat strong{font-size:22px!important}
      @media(max-width:1000px){.sys-ai-hub-actions{grid-template-columns:repeat(2,1fr)}.driver-workspace{grid-template-columns:1fr!important}.driver-list{max-height:420px!important}.driver-actions{grid-template-columns:repeat(3,1fr)!important}}
      @media(max-width:620px){.sys-ai-hub-hero{align-items:flex-start;flex-direction:column}.sys-ai-hub-actions{grid-template-columns:1fr 1fr}.driver-info-bar{grid-template-columns:1fr 1fr!important}.driver-current-main{grid-template-columns:auto 1fr!important}.driver-current-tools{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr!important}.driver-actions{grid-template-columns:1fr 1fr!important}.driver-action{min-height:82px!important}.driver-current-name{font-size:34px!important}}
    `;
    document.head.appendChild(style);
  }

  function buildAiHub() {
    const main = $("#contentScroll");
    const nav = $(".nav");
    if (!main || !nav || $("#screen-sys-ai")) return;
    const navButton = document.createElement("button");
    navButton.className = "nav-btn sys-ai-nav";
    navButton.type = "button";
    navButton.innerHTML = '<span class="nav-label"><span class="dot"></span>SYS AI <small>MERKEZ</small></span>';
    nav.appendChild(navButton);
    const screen = document.createElement("section");
    screen.className = "module-screen";
    screen.id = "screen-sys-ai";
    screen.innerHTML = `<div class="sys-ai-hub">
      <header class="sys-ai-hub-hero"><div><small>SYS AI · SİSTEM GENELİ AKILLI İŞLEMLER</small><h2>Akıllı Kontrol Merkezi</h2><p>Personel, okul, araç, finans ve geçmiş servis kontrollerini tek bölümden yönet.</p></div><div class="sys-ai-hub-state">● DENETİM HAZIR</div></header>
      <div class="sys-ai-hub-actions">
        <button class="sys-ai-hub-action" data-action="ai-open-inspector"><b>01</b><strong>Operasyon Denetçisi</strong><span>Kritik kayıtları ve servis ön kontrollerini aç.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-open-finance-radar"><b>02</b><strong>Finans Radarı</strong><span>Tahsilat, fatura ve ödeme risklerini incele.</span></button>
        <button class="sys-ai-hub-action" data-action="school-ai-payments"><b>03</b><strong>Okul Tahsilatları</strong><span>Öğrenci ödeme açıklarını doğrudan görüntüle.</span></button>
        <button class="sys-ai-hub-action" data-action="ai-refresh"><b>04</b><strong>Tümünü Yeniden Tara</strong><span>Sistem genelindeki akıllı bulguları güncelle.</span></button>
      </div><div class="sys-ai-hub-content" id="sysAiHubContent"><div class="sys-ai-hub-note">Okul güvenliği dâhil tüm akıllı denetimler artık bu merkezde toplanır.</div></div></div>`;
    main.appendChild(screen);
    const schoolAi = $("#schoolAiSafetyCenter");
    if (schoolAi) $("#sysAiHubContent").appendChild(schoolAi);
    navButton.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));
      document.querySelectorAll(".module-screen").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active"); screen.classList.add("active");
      if ($("#pageTitle")) $("#pageTitle").textContent = "SYS AI · Akıllı Kontrol Merkezi";
      if ($("#pageLead")) $("#pageLead").textContent = "Sistem genelindeki akıllı denetim ve karar işlemleri.";
      $("#sidebar")?.classList.remove("open"); $("#contentScroll")?.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.addEventListener("click", (event) => { if (event.target.closest(".nav-btn") !== navButton) navButton.classList.remove("active"); }, true);
  }

  function install() { installStyles(); buildAiHub(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true }); else install();
})();
