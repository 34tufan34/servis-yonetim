(function () {
  "use strict";

  if (window.__SYS_COMMAND_PREVIEW_V44835__) return;
  window.__SYS_COMMAND_PREVIEW_V44835__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);

  function makePanel() {
    const nav = $(".nav");
    const main = $("#contentScroll");
    if (!nav || !main || $("#screen-command-preview")) return;

    const navButton = document.createElement("button");
    navButton.className = "nav-btn command-preview-nav";
    navButton.type = "button";
    navButton.dataset.commandPreview = "1";
    navButton.innerHTML = '<span class="nav-label"><span class="dot"></span>Yeni Komuta <small>ÖN İZLEME</small></span>';
    nav.insertBefore(navButton, nav.children[1] || null);

    const screen = document.createElement("section");
    screen.className = "module-screen command-preview-screen";
    screen.id = "screen-command-preview";
    screen.innerHTML = `
      <div class="command-preview-shell">
        <header class="command-preview-hero">
          <div class="command-preview-shade"></div>
          <div class="command-preview-topline"><span>SYS AI · OPERASYON MERKEZİ</span><b>ALTERNATİF TASARIM</b></div>
          <div class="command-preview-clock"><strong id="previewClock">--:--</strong><span id="previewDate">Tarih hazırlanıyor</span></div>
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
              <div class="command-preview-stage"><small>AKŞAM SERVİSİ AKIŞI</small><strong id="previewPersonnelStage">Servis başlatılmayı bekliyor</strong><span id="previewPersonnelStageHelp">Akşam servisinde önce tüm personelin binişi onaylanır.</span></div>
              <div class="command-preview-marks"><button class="bindi" type="button" data-preview-proxy='[data-action="command-personnel-mark"][data-status="Bindi"]'>BİNDİ</button><button class="indi" type="button" data-preview-proxy='[data-action="command-personnel-mark"][data-status="İndi"]'>İNDİ</button><button class="yok" type="button" data-preview-proxy='[data-action="command-personnel-mark"][data-status="Yok"]'>YOK</button></div>
              <button class="command-preview-distribution" id="previewPersonnelFinish" type="button" data-preview-proxy="#commandPersonnelFinishBtn" disabled>DAĞITIMA BAŞLA</button>
              <div class="command-preview-actions"><button type="button" data-preview-proxy="#commandPersonnelSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="personnel">Detaya Git</button></div>
            </article>
            <article class="command-preview-service school" id="previewSchoolCard">
              <div class="command-preview-card-head"><span class="command-preview-icon">O</span><div><small>OKUL OPERASYONU</small><h3>Okul Servisi</h3></div><b id="previewSchoolState">BEKLEMEDE</b></div>
              <p id="previewSchoolMeta">Başlatılmış servis bulunmuyor.</p>
              <div class="command-preview-passenger"><small>SIRADAKİ ÖĞRENCİ</small><strong id="previewSchoolName">Aktif operasyon yok</strong><span id="previewSchoolAddress">Servis başladığında öğrenci burada görünür.</span></div>
              <div class="command-preview-marks"><button class="bindi" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="Bindi"]'>BİNDİ</button><button class="indi" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="İndi"]'>İNDİ</button><button class="yok" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="Yok"]'>YOK</button></div>
              <div class="command-preview-actions"><button type="button" data-preview-proxy="#commandSchoolSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="school">Detaya Git</button></div>
            </article>
          </div>
          <aside class="command-preview-rail">
            <div><small>SAHA DURUMU</small><strong id="previewRailStatus">Operasyonlar beklemede</strong></div>
            <div><small>ARAÇ UYARILARI</small><strong id="previewAlertCount">0</strong><span>bakım / evrak kaydı</span></div>
            <button type="button" data-preview-action="command">Klasik Komuta Paneline Dön</button>
          </aside>
        </div>
      </div>`;
    main.insertBefore(screen, main.firstChild);

    navButton.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));
      document.querySelectorAll(".module-screen").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active");
      screen.classList.add("active");
      if ($("#pageTitle")) $("#pageTitle").textContent = "Yeni Komuta Paneli · Ön İzleme";
      if ($("#pageLead")) $("#pageLead").textContent = "Mercedes görselli alternatif operasyon tasarımı. Mevcut Komuta Paneli korunmaktadır.";
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
      if (action === "command") return $('.nav-btn[data-module="command"]')?.click();
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest(".nav-btn[data-module]")) navButton.classList.remove("active");
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

    const personnelActive = $("#commandPersonnelCard")?.classList.contains("is-live");
    const personnelMeta = $("#commandPersonnelMeta")?.textContent || "";
    const isEvening = personnelActive && /Akşam Dönüş/i.test(personnelMeta);
    const originalFinish = $("#commandPersonnelFinishBtn");
    const finishLabel = originalFinish?.querySelector("strong")?.textContent?.trim() || "Servisi Bitir";
    const distributionReady = isEvening && finishLabel === "Dağıtıma Başla" && !originalFinish?.disabled;
    const isDropoff = isEvening && $("#commandPersonnelNext .command-stage strong")?.textContent?.toLocaleLowerCase("tr-TR").includes("dağıt");
    const personnelMarkButtons = [...document.querySelectorAll('#previewPersonnelCard [data-preview-proxy]')];
    const markButton = (status) => personnelMarkButtons.find((button) => button.dataset.previewProxy?.includes(`data-status="${status}"`));
    const bindiButton = markButton("Bindi");
    const indiButton = markButton("İndi");
    const yokButton = markButton("Yok");
    if (bindiButton) bindiButton.disabled = !personnelActive || (isEvening && isDropoff);
    if (yokButton) yokButton.disabled = !personnelActive || (isEvening && isDropoff);
    if (indiButton) indiButton.disabled = !personnelActive || (isEvening && !isDropoff);
    const previewFinish = $("#previewPersonnelFinish");
    if (previewFinish) {
      previewFinish.textContent = distributionReady ? "SERVİS HAREKET ETTİ · DAĞITIMA BAŞLA" : finishLabel.toLocaleUpperCase("tr-TR");
      previewFinish.disabled = !personnelActive || Boolean(originalFinish?.disabled);
    }
    if ($("#previewPersonnelStage")) {
      $("#previewPersonnelStage").textContent = !personnelActive ? "Servis başlatılmayı bekliyor" : !isEvening ? "Servis Aktif" : isDropoff ? "Personel Dağıtılıyor" : distributionReady ? "Dağıtıma Hazır" : "Personel Toplanıyor";
      $("#previewPersonnelStageHelp").textContent = !isEvening ? "Aktif operasyon bilgileri yukarıdaki kartta gösterilir." : isDropoff ? "Yalnızca araca binen personeller için iniş onayı verilir." : distributionReady ? "Tüm binişler onaylandı. Araç artık dağıtıma çıkabilir." : "Tüm personel için Bindi, Yok veya İzinli seçimi tamamlanmalıdır.";
    }

    const personnelLive = personnelActive;
    const schoolLive = $("#commandSchoolCard")?.classList.contains("is-live");
    $("#previewPersonnelCard")?.classList.toggle("is-live", Boolean(personnelLive));
    $("#previewSchoolCard")?.classList.toggle("is-live", Boolean(schoolLive));
    const liveCount = Number($("#commandLiveCount")?.textContent || 0);
    if ($("#previewRailStatus")) $("#previewRailStatus").textContent = liveCount ? `${liveCount} servis sahada` : "Operasyonlar beklemede";
    const alertText = $("#commandMaintenanceState")?.textContent || "0";
    if ($("#previewAlertCount")) $("#previewAlertCount").textContent = (alertText.match(/\d+/) || ["0"])[0];
    const now = new Date();
    if ($("#previewClock")) $("#previewClock").textContent = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    if ($("#previewDate")) $("#previewDate").textContent = now.toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long" });
  }

  function install() {
    makePanel();
    syncPanel();
    const source = $("#screen-command");
    if (source && window.MutationObserver) new MutationObserver(syncPanel).observe(source, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class"] });
    window.setInterval(syncPanel, 5000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
