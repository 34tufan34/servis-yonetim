(function(){
  "use strict";
  if(window.__SYS_CLOUD_BACKUP_V44812__)return;window.__SYS_CLOUD_BACKUP_V44812__=true;
  const byId=id=>document.getElementById(id);
  const native=()=>window.AndroidBridge&&typeof AndroidBridge.syncBackupPayload==="function";
  function cfg(){
    try{return {...{enabled:false,time:"23:30",keepDays:30,wifiOnly:false,password:""},...(state.settings.cloudBackup||{})};}catch(_){return {enabled:false,time:"23:30",keepDays:30,wifiOnly:false,password:""};}
  }
  function sync(){
    if(!native())return;
    try{AndroidBridge.syncBackupPayload(JSON.stringify({exportedAt:new Date().toISOString(),appVersion:state.appVersion||"4.48.12",schemaVersion:state.schemaVersion||0,data:state}));}catch(e){console.warn("Bulut yedek senkronu başarısız",e);}
  }
  function configure(){
    const c={enabled:byId("cloudBackupEnabled")?.checked||false,time:byId("cloudBackupTime")?.value||"23:30",keepDays:Number(byId("cloudBackupKeep")?.value||30),wifiOnly:byId("cloudBackupWifi")?.checked||false,password:byId("cloudBackupPassword")?.value||""};
    state.settings.cloudBackup=c; try{saveState();}catch(_){localStorage.setItem("SYS_V1_PERSONEL_SERVISI",JSON.stringify(state));}
    if(native()){AndroidBridge.configureCloudBackup(JSON.stringify(c));sync();}
    renderStatus(); if(typeof showToast==="function")showToast("Bulut yedekleme ayarları kaydedildi.");
  }
  function renderStatus(){
    const host=byId("cloudBackupStatus");if(!host)return;
    let status={connected:false,message:"Android uygulamasında klasör seçilmedi."};
    try{if(native())status=JSON.parse(AndroidBridge.getCloudBackupStatus()||"{}");}catch(_){}
    host.className="cloud-backup-status "+(status.connected?"ok":"warn");
    host.innerHTML=`<b>${status.connected?"Google Drive klasörü bağlı":"Bulut klasörü bağlı değil"}</b><span>${status.lastSuccess?"Son başarılı yedek: "+status.lastSuccess:(status.message||"Drive klasörünü seç.")}</span>${status.lastError?`<small>${status.lastError}</small>`:""}`;
  }
  function install(){
    const screen=byId("screen-settings");if(!screen||byId("cloudBackupCard"))return;
    const host=screen.querySelector(".settings-grid")||screen;
    const c=cfg();
    const card=document.createElement("section");card.id="cloudBackupCard";card.className="card panel cloud-backup-card";
    card.innerHTML=`<div class="panel-header"><div><h2 class="panel-title">Google Drive Otomatik Yedekleme</h2><div class="panel-sub">Belirlediğin saatte tam yedek oluşturur; internet geldiğinde seçtiğin Drive klasörüne yükler.</div></div><span class="pill">SYS Cloud</span></div><div class="cloud-backup-grid"><label><span>Otomatik yedekleme</span><input id="cloudBackupEnabled" type="checkbox" ${c.enabled?"checked":""}></label><label><span>Yedekleme saati</span><input id="cloudBackupTime" type="time" value="${c.time}"></label><label><span>Saklama süresi</span><select id="cloudBackupKeep"><option value="15" ${c.keepDays==15?"selected":""}>15 gün</option><option value="30" ${c.keepDays==30?"selected":""}>30 gün</option><option value="60" ${c.keepDays==60?"selected":""}>60 gün</option><option value="90" ${c.keepDays==90?"selected":""}>90 gün</option></select></label><label><span>Yalnızca Wi‑Fi</span><input id="cloudBackupWifi" type="checkbox" ${c.wifiOnly?"checked":""}></label><label class="wide"><span>Yedekleme parolası</span><input id="cloudBackupPassword" type="password" value="${c.password||""}" placeholder="En az 6 karakter"><small>Dosya AES ile şifrelenir. Bu parola unutulursa yedek açılamaz.</small></label></div><div id="cloudBackupStatus" class="cloud-backup-status"></div><div class="cloud-backup-actions"><button class="btn primary" id="cloudChooseFolder">Google Drive Klasörünü Seç</button><button class="btn" id="cloudSaveSettings">Ayarları Kaydet</button><button class="btn" id="cloudBackupNow">Şimdi Buluta Yedekle</button></div><div class="form-hint">Android klasör seçicisinde Google Drive → <strong>SYS Servis Yedekleri</strong> klasörünü seç. Uygulama hesabının şifresini görmez.</div>`;
    host.appendChild(card);
    byId("cloudChooseFolder").onclick=()=>{if(native())AndroidBridge.selectCloudBackupFolder();else alert("Bu özellik Android SYS-AI Test uygulamasında çalışır.");};
    byId("cloudSaveSettings").onclick=configure;
    byId("cloudBackupNow").onclick=()=>{configure();if(native())AndroidBridge.runCloudBackupNow();};
    renderStatus();sync();setInterval(renderStatus,5000);
  }
  const style=document.createElement("style");style.textContent=`.cloud-backup-card{grid-column:1/-1}.cloud-backup-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.cloud-backup-grid label{display:flex;flex-direction:column;gap:7px;padding:12px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.03)}.cloud-backup-grid label.wide{grid-column:span 2}.cloud-backup-grid span{font-size:12px;color:var(--muted)}.cloud-backup-grid input,.cloud-backup-grid select{min-height:42px}.cloud-backup-grid input[type=checkbox]{width:24px;min-height:24px;accent-color:#2ecc71}.cloud-backup-grid small{color:var(--muted);line-height:1.4}.cloud-backup-status{margin-top:12px;padding:13px 15px;border-radius:14px;display:flex;flex-direction:column;gap:4px;border:1px solid var(--line)}.cloud-backup-status.ok{border-color:#2ecc7166;background:#2ecc7112}.cloud-backup-status.warn{border-color:#f59e0b66;background:#f59e0b12}.cloud-backup-status span,.cloud-backup-status small{color:var(--muted)}.cloud-backup-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}@media(max-width:800px){.cloud-backup-grid{grid-template-columns:1fr 1fr}.cloud-backup-grid label.wide{grid-column:1/-1}}`;
  document.head.appendChild(style);
  const oldSave=window.saveState; if(typeof oldSave==="function"){window.saveState=function(){const r=oldSave.apply(this,arguments);setTimeout(sync,30);return r;};}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
