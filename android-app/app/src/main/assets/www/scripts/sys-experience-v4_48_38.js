(function () {
  "use strict";
  if (window.__SYS_EXPERIENCE_V44838__) return;
  window.__SYS_EXPERIENCE_V44838__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);

  function installStyles() {
    const style = document.createElement("style");
    style.id = "sys-experience-v44838";
    style.textContent = `
      .command-preview-actions button{border-color:color-mix(in srgb,var(--accent) 42%,var(--border))!important;background:color-mix(in srgb,var(--accent) 13%,var(--panel-2))!important;color:var(--text)!important}.command-preview-actions .is-service-active{background:linear-gradient(135deg,rgba(185,28,28,.24),rgba(127,29,29,.18))!important;border-color:rgba(248,113,113,.52)!important;color:#fecaca!important;box-shadow:0 0 18px rgba(239,68,68,.12)}
      .sys-ai-nav .dot{background:#a78bfa!important;box-shadow:0 0 12px rgba(167,139,250,.8)}
      .sys-ai-hub{display:grid;gap:14px}.sys-ai-hub-hero{padding:22px;border:1px solid rgba(167,139,250,.28);border-radius:22px;background:radial-gradient(circle at 90% 0%,rgba(124,58,237,.22),transparent 38%),linear-gradient(145deg,rgba(17,24,39,.98),rgba(5,8,15,.98));display:flex;align-items:center;justify-content:space-between;gap:20px}.sys-ai-hub-hero small{color:#c4b5fd;font-weight:950;letter-spacing:.13em}.sys-ai-hub-hero h2{margin:7px 0 5px;font-size:clamp(25px,4vw,42px)}.sys-ai-hub-hero p{margin:0;color:var(--muted);max-width:760px}.sys-ai-hub-state{padding:13px 17px;border:1px solid rgba(74,222,128,.35);border-radius:16px;background:rgba(34,197,94,.10);color:#86efac;font-weight:950;white-space:nowrap}.sys-ai-hub-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.sys-ai-hub-action{min-height:104px;padding:15px;border:1px solid rgba(148,163,184,.16);border-radius:17px;background:var(--panel);color:var(--text);text-align:left;cursor:pointer}.sys-ai-hub-action b{display:block;color:#c4b5fd;font-size:20px}.sys-ai-hub-action strong{display:block;margin-top:8px}.sys-ai-hub-action span{display:block;margin-top:5px;color:var(--muted);font-size:10px;line-height:1.4}.sys-ai-hub-content{display:grid;gap:12px}.sys-ai-hub-content>.school-ai-center{margin:0!important}.sys-ai-hub-note{padding:13px 15px;border:1px solid var(--border);border-radius:15px;color:var(--muted);background:var(--panel)}
      #screen-driver{background:radial-gradient(circle at 50% -15%,rgba(14,165,233,.13),transparent 38%),#05080d!important}.driver-shell{max-width:1440px!important;margin:auto!important;gap:12px!important}.driver-service-switch{position:sticky;top:0;z-index:8;padding:8px!important;border-radius:18px!important;background:rgba(5,8,13,.92)!important;backdrop-filter:blur(18px)}.driver-service-tab{min-height:72px!important;border-radius:15px!important}.driver-service-tab.active{border-color:rgba(56,189,248,.58)!important;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(15,23,42,.9))!important}.driver-info-bar{grid-template-columns:repeat(4,minmax(0,1fr)) auto!important;padding:11px 14px!important;border-radius:16px!important}.driver-workspace{grid-template-columns:minmax(0,1.22fr) minmax(320px,.78fr)!important;gap:12px!important}.driver-panel{border-radius:20px!important;background:rgba(10,15,24,.96)!important}.driver-current-card{border-color:rgba(56,189,248,.28)!important;background:radial-gradient(circle at 100% 0%,rgba(14,165,233,.16),transparent 42%),rgba(15,23,42,.86)!important}.driver-current-name{font-size:clamp(30px,5vw,60px)!important;line-height:1!important}.driver-current-order{min-width:72px!important;height:72px!important;font-size:30px!important}.driver-current-address{font-size:15px!important;line-height:1.5!important}.driver-actions{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important}.driver-action{min-height:96px!important;border-radius:18px!important}.driver-action strong{font-size:19px!important}.driver-action.primary{background:linear-gradient(145deg,#15803d,#166534)!important;border-color:#4ade80!important}.driver-action.danger{background:linear-gradient(145deg,#991b1b,#7f1d1d)!important}.driver-action.warning{background:linear-gradient(145deg,#a16207,#854d0e)!important}.driver-finish-btn{min-height:68px!important;border-radius:17px!important;font-size:18px!important}.driver-finish-btn.ready,.driver-finish-btn.distribution{background:linear-gradient(135deg,#16a34a,#166534)!important;color:#fff!important;border-color:#4ade80!important}.driver-list{max-height:calc(100dvh - 285px)!important}.driver-passenger-row.active{border-color:#38bdf8!important;box-shadow:0 0 0 2px rgba(56,189,248,.14)!important}.driver-call-btn,.driver-current-call-btn{min-height:48px!important}.driver-time-box strong,.driver-stat strong{font-size:22px!important}
      @media(max-width:1000px){.sys-ai-hub-actions{grid-template-columns:repeat(2,1fr)}.driver-workspace{grid-template-columns:1fr!important}.driver-list{max-height:420px!important}.driver-actions{grid-template-columns:repeat(3,1fr)!important}}
      @media(max-width:620px){.sys-ai-hub-hero{align-items:flex-start;flex-direction:column}.sys-ai-hub-actions{grid-template-columns:1fr 1fr}.driver-info-bar{grid-template-columns:1fr 1fr!important}.driver-current-main{grid-template-columns:auto 1fr!important}.driver-current-tools{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr!important}.driver-actions{grid-template-columns:1fr 1fr!important}.driver-action{min-height:82px!important}.driver-current-name{font-size:34px!important}}
      #screen-command.command-panel-backend{display:none!important}#screen-driver .driver-current-main{min-width:0!important;grid-template-columns:58px minmax(0,1fr)!important;align-items:start!important}#screen-driver .driver-current-main>div:nth-child(2){min-width:0!important}#screen-driver .driver-current-order{min-width:54px!important;width:54px!important;height:54px!important;font-size:23px!important}#screen-driver .driver-current-name{max-width:100%!important;overflow-wrap:anywhere!important;word-break:break-word!important;white-space:normal!important;font-size:clamp(22px,3.2vw,36px)!important;line-height:1.08!important}#screen-driver .driver-current-address{position:static!important;display:block!important;margin-top:8px!important;overflow-wrap:anywhere!important;word-break:break-word!important}#screen-driver .driver-current-tools{grid-column:1/-1!important;width:100%!important}#screen-driver .driver-finish-btn.ready:not(.distribution){background:linear-gradient(135deg,rgba(185,28,28,.92),rgba(127,29,29,.96))!important;border-color:rgba(248,113,113,.65)!important;color:#fff!important;box-shadow:0 0 18px rgba(239,68,68,.13)!important}.command-preview-fuel,.command-preview-fuel-difference{border-color:rgba(245,158,11,.28)!important;background:rgba(120,53,15,.12)!important}.address-bulk-select{width:20px;height:20px;accent-color:var(--accent);flex:0 0 auto}.address-book-bulk-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
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
      if ($("#pageTitle")) $("#pageTitle").textContent = "SYS AI · Akıllı Kontrol Merkezi";
      if ($("#pageLead")) $("#pageLead").textContent = "Sistem genelindeki akıllı denetim ve karar işlemleri.";
      $("#sidebar")?.classList.remove("open"); $("#contentScroll")?.scrollTo({ top: 0, behavior: "smooth" });
    });
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

  function showFirstSetup() {
    if (localStorage.getItem("SYS_FIRST_SETUP_PENDING_V1") !== "1" || $("#sysFirstSetupLayer")) return;
    const layer = document.createElement("div"); layer.id = "sysFirstSetupLayer"; layer.style.cssText = "position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:16px;background:rgba(2,6,12,.88);backdrop-filter:blur(14px)";
    layer.innerHTML = `<section style="width:min(720px,100%);max-height:94vh;overflow:auto;padding:24px;border:1px solid rgba(96,165,250,.32);border-radius:24px;background:var(--panel);color:var(--text)"><small style="color:var(--accent);font-weight:950;letter-spacing:.12em">SYS · İLK KURULUM</small><h2 style="margin:8px 0">Temel bilgileri birlikte hazırlayalım</h2><p style="color:var(--muted)">Bütün alanlar isteğe bağlıdır. Şimdi doldurabilir veya kurulumu atlayıp daha sonra kayıtlardan tamamlayabilirsin.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:11px"><label class="field"><span>İşletme / Kullanıcı Adı</span><input id="setupOwner" placeholder="Örn. Tufan Turizm"></label><label class="field"><span>Telefon</span><input id="setupPhone" inputmode="tel" placeholder="05xx xxx xx xx"></label><label class="field"><span>İlk Firma</span><input id="setupCompany" placeholder="İsteğe bağlı"></label><label class="field"><span>İlk Araç Plakası</span><input id="setupPlate" placeholder="34 ABC 123"></label><label class="field"><span>Şoför Adı</span><input id="setupDriver" placeholder="İsteğe bağlı"></label><label class="field"><span>Tema</span><select id="setupTheme"><option value="">Mevcut tema</option><option value="dark">Koyu</option><option value="navy">Lacivert</option><option value="turquoise">Turkuaz</option><option value="light">Açık</option></select></label></div><div style="display:flex;justify-content:flex-end;gap:9px;flex-wrap:wrap;margin-top:18px"><button class="btn" id="skipFirstSetup" type="button">Şimdilik Atla</button><button class="btn primary" id="saveFirstSetup" type="button">Kurulumu Tamamla</button></div></section>`;
    document.body.appendChild(layer);
    const finish = (save) => { if (save) { const owner = $("#setupOwner").value.trim(), phone = $("#setupPhone").value.trim(), companyName = $("#setupCompany").value.trim(), plate = $("#setupPlate").value.trim(), driverName = $("#setupDriver").value.trim(), theme = $("#setupTheme").value; state.settings = { ...(state.settings || {}), businessName: owner, businessPhone: phone, ...(theme ? { theme } : {}) }; const admin = state.users?.find((user) => user.role === "admin"); if (admin && owner) admin.fullName = owner; let vehicleId = ""; if (plate) { vehicleId = uid("vehicle"); state.vehicles.push({ id: vehicleId, plate, driverName, status: "Aktif", createdAt: new Date().toISOString() }); } if (companyName) { const routeId = uid("route"); state.routes.push({ id: routeId, name: `${companyName} Servisi`, status: "Aktif" }); state.companies.push({ id: uid("company"), name: companyName, routeId, defaultVehicleId: vehicleId, status: "Aktif" }); } saveState(); } localStorage.removeItem("SYS_FIRST_SETUP_PENDING_V1"); layer.remove(); renderAll(); showToast(save ? "İlk kurulum tamamlandı." : "İlk kurulum atlandı. Bilgileri daha sonra ekleyebilirsin."); };
    $("#skipFirstSetup").addEventListener("click", () => finish(false)); $("#saveFirstSetup").addEventListener("click", () => finish(true));
  }

  function install() { installStyles(); buildAiHub(); installContactImport(); installAddressBulkDelete(); showFirstSetup(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true }); else install();
})();
