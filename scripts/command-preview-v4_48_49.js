(function () {
  "use strict";

  if (window.__SYS_COMMAND_PANEL_V44849__) return;
  window.__SYS_COMMAND_PANEL_V44849__ = true;


  const $ = (selector, root = document) => root.querySelector(selector);

  function makePanel() {
    const nav = $(".nav");
    const main = $("#contentScroll");
    if (!nav || !main || $("#screen-command-preview")) return;

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
          <div class="command-preview-profile"><div id="previewProfileAvatar">?</div><span><strong id="previewProfileName">Kullanıcı</strong><small id="previewProfileRole">-</small></span></div>
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
              <div class="command-preview-actions"><button id="previewPersonnelPrimary" type="button" data-preview-proxy="#commandPersonnelSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="personnel">Detaya Git</button></div>
            </article>
            <article class="command-preview-service school" id="previewSchoolCard">
              <div class="command-preview-card-head"><span class="command-preview-icon">O</span><div><small>OKUL OPERASYONU</small><h3>Okul Servisi</h3></div><b id="previewSchoolState">BEKLEMEDE</b></div>
              <p id="previewSchoolMeta">Başlatılmış servis bulunmuyor.</p>
              <div class="command-preview-passenger"><small>SIRADAKİ ÖĞRENCİ</small><strong id="previewSchoolName">Aktif operasyon yok</strong><span id="previewSchoolAddress">Servis başladığında öğrenci burada görünür.</span></div>
              <div class="command-preview-marks"><button class="bindi" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="Bindi"]'>BİNDİ</button><button class="indi" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="İndi"]'>İNDİ</button><button class="yok" type="button" data-preview-proxy='[data-action="command-school-mark"][data-status="Yok"]'>YOK</button></div>
              <div class="command-preview-actions"><button id="previewSchoolPrimary" type="button" data-preview-proxy="#commandSchoolSmartStartBtn">Servisi Başlat</button><button type="button" data-preview-action="school">Detaya Git</button></div>
            </article>
          </div>
          <aside class="command-preview-rail">
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
      if ($("#pageLead")) $("#pageLead").textContent = "Personel ve okul servislerini, saha durumunu ve mazot uyarılarını tek merkezden yönet.";
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
    const personnelActive = $("#commandPersonnelCard")?.classList.contains("is-live") && !originalFinish?.classList.contains("is-inactive");
    const personnelMeta = $("#commandPersonnelMeta")?.textContent || "";
    const isEvening = personnelActive && /Akşam Dönüş/i.test(personnelMeta);
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
    const previewPrimary = $("#previewPersonnelPrimary");
    if (previewPrimary) {
      previewPrimary.textContent = personnelActive ? "Servisi Bitir" : "Servisi Başlat";
      previewPrimary.dataset.previewProxy = personnelActive ? "#commandPersonnelFinishBtn" : "#commandPersonnelSmartStartBtn";
      previewPrimary.classList.toggle("is-service-active", personnelActive);
      previewPrimary.disabled = personnelActive ? (distributionReady || Boolean(originalFinish?.disabled)) : false;
    }
    if ($("#previewPersonnelStage")) {
      $("#previewPersonnelStage").textContent = !personnelActive ? "Servis başlatılmayı bekliyor" : !isEvening ? "Servis Aktif" : isDropoff ? "Personel Dağıtılıyor" : distributionReady ? "Dağıtıma Hazır" : "Personel Toplanıyor";
      $("#previewPersonnelStageHelp").textContent = !isEvening ? "Aktif operasyon bilgileri yukarıdaki kartta gösterilir." : isDropoff ? "Yalnızca araca binen personeller için iniş onayı verilir." : distributionReady ? "Tüm binişler onaylandı. Araç artık dağıtıma çıkabilir." : "Tüm personel için Bindi, Yok veya İzinli seçimi tamamlanmalıdır.";
    }

    const personnelLive = personnelActive;
    const schoolFinish = $("#commandSchoolFinishBtn");
    const schoolLive = $("#commandSchoolCard")?.classList.contains("is-live") && !schoolFinish?.classList.contains("is-inactive");
    const schoolPrimary = $("#previewSchoolPrimary");
    if (schoolPrimary) {
      schoolPrimary.textContent = schoolLive ? "Servisi Bitir" : "Servisi Başlat";
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
    const profileAvatar = $("#previewProfileAvatar");
    if (profileAvatar) {
      profileAvatar.replaceChildren();
      if (user?.profilePhoto) { const image = document.createElement("img"); image.alt = ""; image.src = user.profilePhoto; profileAvatar.appendChild(image); }
      else profileAvatar.textContent = String((user?.fullName || user?.username || "?").split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toLocaleUpperCase("tr-TR"));
    }
    if ($("#previewProfileName")) $("#previewProfileName").textContent = user?.fullName || user?.username || "Kullanıcı";
    if ($("#previewProfileRole")) $("#previewProfileRole").textContent = user?.role === "admin" ? "Yönetici" : user?.role === "accounting" ? "Muhasebe" : "Operasyon";
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
