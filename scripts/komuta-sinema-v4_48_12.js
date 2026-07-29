(function(){
  "use strict";
  if(window.__SYS_CINEMA_COMMAND_V44812__) return;
  window.__SYS_CINEMA_COMMAND_V44812__ = true;

  const $ = (s,r=document)=>r.querySelector(s);
  const esc = (v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmtTime=(d=new Date())=>d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
  const fmtDate=(d=new Date())=>d.toLocaleDateString("tr-TR",{day:"2-digit",month:"long",year:"numeric",weekday:"long"});

  function activePersonnelSession(){
    try { return (state.serviceSessions||[]).find(s=>s.status && s.status!=="Tamamlandı") || null; } catch(_){ return null; }
  }
  function activeSchoolSession(){
    try { return (state.schoolServiceSessions||[]).find(s=>s.status && s.status!=="Tamamlandı") || null; } catch(_){ return null; }
  }
  function getCompanyName(session){
    try {
      if(session?.companyId) return state.companies.find(c=>c.id===session.companyId)?.name||"Personel Servisi";
      if(session?.routeId) return state.routes.find(r=>r.id===session.routeId)?.name||"Personel Servisi";
    }catch(_){}
    return "Personel Servisi";
  }
  function schoolName(session){
    try{return state.schools.find(s=>s.id===session?.schoolId)?.name||"Okul Servisi";}catch(_){return "Okul Servisi";}
  }
  function nextPerson(session){
    try{
      const people=(state.people||[]).filter(p=>p.status==="Aktif");
      const period=session?.period||"morning";
      const sorted=[...people].sort((a,b)=>Number(period==="evening"?a.eveningOrder:a.morningOrder)-Number(period==="evening"?b.eveningOrder:b.morningOrder));
      const done=new Set(session?.completedPersonIds||session?.processedPersonIds||[]);
      return sorted.find(p=>!done.has(p.id))||sorted[0]||null;
    }catch(_){return null;}
  }
  function nextStudent(session){
    try{
      const students=(state.students||[]).filter(s=>s.status!=="Pasif" && (!session?.schoolId||s.schoolId===session.schoolId));
      const done=new Set(session?.completedStudentIds||session?.processedStudentIds||[]);
      return students.find(s=>!done.has(s.id))||students[0]||null;
    }catch(_){return null;}
  }
  function vehicleInfo(session,schoolSession){
    try{
      const school=schoolSession?state.schools.find(s=>s.id===schoolSession.schoolId):null;
      const company=session?.companyId?state.companies.find(c=>c.id===session.companyId):null;
      const vid=session?.vehicleId||schoolSession?.vehicleId||school?.vehicleId||company?.defaultVehicleId||"";
      return state.vehicles.find(v=>v.id===vid)||state.vehicles.find(v=>v.status==="Aktif")||{};
    }catch(_){return {};}
  }
  function countInfo(pSession,sSession){
    try{
      if(sSession){
        const total=(state.students||[]).filter(s=>s.status!=="Pasif"&&(!sSession.schoolId||s.schoolId===sSession.schoolId)).length;
        const done=(sSession.completedStudentIds||sSession.processedStudentIds||[]).length;
        return {total,done,waiting:Math.max(total-done,0),label:"Öğrenci"};
      }
      const total=(state.people||[]).filter(p=>p.status==="Aktif").length;
      const done=(pSession?.completedPersonIds||pSession?.processedPersonIds||[]).length;
      return {total,done,waiting:Math.max(total-done,0),label:"Yolcu"};
    }catch(_){return {total:0,done:0,waiting:0,label:"Yolcu"};}
  }
  function trigger(id){ const el=document.getElementById(id); if(el){el.click();return true;} return false; }
  function openService(kind){
    try{ activateModule(kind==="school"?"school":"personnel"); if(kind!=="school") activateTab("service"); }catch(_){}
  }
  function action(type){
    if(type==="start"){ if(!trigger("startServiceBtn")){openService("personnel");} }
    if(type==="finish"){ if(!trigger("finishServiceBtn")){openService("personnel");} }
    if(type==="board"){ if(!trigger("commandBoardBtn")&&!trigger("markBoardedBtn")) openService("personnel"); }
    if(type==="leave"){ if(!trigger("commandLeaveBtn")&&!trigger("markLeftBtn")) openService("personnel"); }
    if(type==="next"){ if(!trigger("commandNextBtn")&&!trigger("nextStopBtn")) openService("personnel"); }
    if(type==="messages"){ try{activateModule("messages");}catch(_){ const b=[...document.querySelectorAll("button")].find(x=>/mesaj/i.test(x.textContent)); b?.click(); } }
  }

  function install(){
    const screen=document.getElementById("screen-command");
    if(!screen||screen.dataset.cinemaV44812) return;
    screen.dataset.cinemaV44812="1";
    const old=[...screen.children]; old.forEach(el=>el.classList.add("sys-command-old-hidden"));
    const root=document.createElement("div");
    root.id="sysCinemaCommand";
    root.innerHTML=`
      <div class="scc-head"><div><span>SİNEMA MODU PANEL</span><h2>Premium Yolculuk Deneyimi</h2></div><div class="scc-clock"><b id="sccClock">--:--</b><small id="sccDate">-</small></div></div>
      <div class="scc-grid">
        <section class="scc-hero">
          <div class="scc-hero-bg"></div>
          <div class="scc-left-metrics"><article><span>Servis Aktif</span><b id="sccLive">0</b><small id="sccServiceType">Hazır</small></article><article><span id="sccCountLabel">Yolcu</span><b id="sccCount">0</b><small>Araçta / planlı</small></article></div>
          <div class="scc-next"><span>Sıradaki Durak</span><b id="sccNext">Servis başlamadı</b><small id="sccNextSub">Rota seçildiğinde gösterilir</small></div>
          <div class="scc-remaining"><span>Kalan Süre</span><b id="sccRemain">--</b><small>Tahmini</small></div>
          <div class="scc-ai"><i>AI</i><div><b id="sccAiTitle">SYS AI HAZIR</b><span id="sccAiText">Servis başlatıldığında operasyon analizi başlayacak.</span></div><em id="sccAiScore">●</em></div>
          <div class="scc-actions">
            <button data-scc="start" class="go">▶<span>Servisi Başlat</span></button><button data-scc="finish" class="stop">■<span>Servisi Bitir</span></button><button data-scc="board" class="board">●<span>Bindi</span></button><button data-scc="leave" class="leave">↪<span>İndi</span></button><button data-scc="next" class="next">Ⅱ<span>Durak Geç</span></button>
          </div>
          <button class="scc-message" data-scc="messages">✉ Mesajlar</button>
        </section>
        <aside class="scc-side">
          <section><h3>Servis Bilgileri</h3><div class="scc-info"><p><span>Canlı servis</span><b id="sccInfoLive">0</b></p><p><span>Sıradaki durak</span><b id="sccInfoNext">-</b></p><p><span>Kalan süre</span><b id="sccInfoRemain">-</b></p><p><span>Tahmini varış</span><b id="sccArrival">-</b></p></div></section>
          <section><h3>Rota İlerleyişi</h3><div class="scc-route"><i></i><i class="active"></i><i></i><i></i><i></i><div class="scc-bus">▰</div></div><div class="scc-route-labels"><span>Başlangıç</span><span id="sccRouteCurrent">Şimdi</span><span>3. Durak</span><span>4. Durak</span><span>Varış</span></div></section>
          <section><h3>AI Öneri & Durum</h3><div class="scc-ai-card"><strong id="sccAiSideTitle">Sistem hazır</strong><p id="sccAiSideText">Canlı servis verileri bekleniyor.</p><div><span>Operasyon güveni</span><b id="sccConfidence">--</b></div></div></section>
        </aside>
      </div>`;
    screen.appendChild(root);
    root.addEventListener("click",e=>{const b=e.target.closest("[data-scc]");if(b)action(b.dataset.scc);});
    update(); setInterval(update,1000);
  }

  function update(){
    const root=document.getElementById("sysCinemaCommand"); if(!root)return;
    const ps=activePersonnelSession(), ss=activeSchoolSession(), active=ps||ss;
    const vehicle=vehicleInfo(ps,ss), counts=countInfo(ps,ss);
    const next=ss?nextStudent(ss):nextPerson(ps);
    const nextMain=ss?(next?.stop||next?.address||next?.name):(next?.morningAddress||next?.eveningAddress||next?.stop||next?.name);
    const nextSub=ss?(next?.name||schoolName(ss)):(next?.name||getCompanyName(ps));
    const live=(ps?1:0)+(ss?1:0);
    const remain=active?(active.remainingText||active.countdownText||"Aktif"):"--";
    const arrival=active?(active.estimatedArrival||active.arrivalTime||"Hesaplanıyor"):"-";
    const serviceType=ss?"Okul servisi":ps?"Personel servisi":"Hazır";
    const safe=active&&counts.waiting===0;
    const aiTitle=!active?"SYS AI HAZIR":safe?"HAREKET İÇİN UYGUN":`${counts.waiting} ${counts.label.toLowerCase()} bekleniyor`;
    const aiText=!active?"Servis başlatıldığında operasyon analizi başlayacak.":safe?"Tüm yolcular tamamlandı. Rota planlandığı gibi ilerliyor.":"Hareket öncesi yoklama tamamlanmalı.";
    const confidence=!active?"--":safe?"%96":counts.waiting<=2?"%82":"%68";
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
    set("sccClock",fmtTime()); set("sccDate",fmtDate()); set("sccLive",live); set("sccInfoLive",live); set("sccServiceType",serviceType);
    set("sccCountLabel",counts.label); set("sccCount",counts.done||counts.total); set("sccNext",nextMain||"Sıradaki durak bekleniyor"); set("sccNextSub",nextSub||serviceType);
    set("sccRemain",remain); set("sccInfoRemain",remain); set("sccInfoNext",nextMain||"-"); set("sccArrival",arrival); set("sccRouteCurrent",nextMain||"Şimdi");
    set("sccAiTitle",aiTitle); set("sccAiText",aiText); set("sccAiSideTitle",aiTitle); set("sccAiSideText",aiText); set("sccConfidence",confidence);
    root.classList.toggle("is-active",!!active); root.classList.toggle("is-ready",safe);
    const foot=document.querySelector(".sidebar-footer"); if(foot&&vehicle?.plate) foot.innerHTML=`Araç<br><strong>${esc(vehicle.plate)}</strong><br><small>${esc(vehicle.driverName||"Şoför tanımlı değil")}</small>`;
  }

  const style=document.createElement("style");
  style.textContent=`
  #screen-command .sys-command-old-hidden{display:none!important}#sysCinemaCommand{height:100%;min-height:0;color:#f5f8ff;overflow:auto;padding:2px 2px 16px}.scc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}.scc-head span{color:#35a8ff;font-size:12px;font-weight:900;letter-spacing:.12em}.scc-head h2{margin:4px 0 0;font-size:clamp(22px,2.2vw,34px);letter-spacing:-.04em}.scc-clock{text-align:right}.scc-clock b{font-size:30px}.scc-clock small{display:block;color:#8ea3b8}.scc-grid{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(320px,.9fr);gap:14px;min-height:calc(100% - 70px)}.scc-hero,.scc-side>section{border:1px solid rgba(60,160,255,.22);border-radius:22px;background:linear-gradient(160deg,rgba(3,14,28,.96),rgba(6,19,34,.9));box-shadow:0 22px 60px #0008}.scc-hero{position:relative;overflow:hidden;padding:18px;display:grid;grid-template-columns:120px 1fr 150px;grid-template-rows:1fr auto auto;gap:12px;min-height:640px}.scc-hero-bg{position:absolute;inset:0;background:linear-gradient(90deg,rgba(1,8,16,.95),rgba(2,12,23,.22),rgba(1,8,16,.82)),url('./icons/sys-cinema-command-v44812.webp') center/cover no-repeat;opacity:.82}.scc-hero>*:not(.scc-hero-bg){position:relative;z-index:1}.scc-left-metrics{display:grid;gap:12px;align-content:start}.scc-left-metrics article,.scc-next,.scc-remaining{padding:16px;border:1px solid rgba(55,155,255,.28);border-radius:18px;background:rgba(1,12,24,.78);backdrop-filter:blur(10px)}.scc-left-metrics span,.scc-next span,.scc-remaining span{display:block;color:#79c9ff;font-size:11px;text-transform:uppercase}.scc-left-metrics b{display:block;font-size:42px;margin:8px 0}.scc-left-metrics small,.scc-next small,.scc-remaining small{color:#a9bbcf}.scc-next{grid-column:3;align-self:start}.scc-next b{display:block;font-size:28px;line-height:1.1;margin:12px 0}.scc-remaining{grid-column:3;align-self:end}.scc-remaining b{display:block;font-size:40px;margin-top:8px}.scc-ai{grid-column:1/-1;align-self:end;display:flex;align-items:center;gap:14px;padding:14px 18px;border:1px solid rgba(0,205,255,.42);border-radius:999px;background:rgba(1,17,31,.88)}.scc-ai i{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;border:2px solid #18cfff;color:#18cfff;font-style:normal;font-weight:900;box-shadow:0 0 24px #00bfff66}.scc-ai div{flex:1}.scc-ai b{display:block;color:#39ef73}.scc-ai span{display:block;margin-top:5px;color:#d6e4ef}.scc-ai em{color:#39ef73;font-style:normal;font-size:28px}.scc-actions{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.scc-actions button{min-height:118px;border-radius:18px;border:1px solid currentColor;color:#fff;font-size:30px;background:#123;box-shadow:inset 0 0 28px #0005}.scc-actions button span{display:block;font-size:14px;font-weight:900;margin-top:12px}.scc-actions .go{background:linear-gradient(145deg,#0d7c31,#062f18)}.scc-actions .stop{background:linear-gradient(145deg,#b92d2d,#4a0d0d)}.scc-actions .board{background:linear-gradient(145deg,#c57308,#4d2500)}.scc-actions .leave{background:linear-gradient(145deg,#0567c7,#062c5a)}.scc-actions .next{background:linear-gradient(145deg,#6b34bd,#2b1251)}.scc-message{grid-column:1/-1;min-height:58px;border-radius:16px;border:1px solid rgba(90,165,255,.32);background:rgba(5,22,38,.9);color:#cfe4ff;font-size:18px;font-weight:900}.scc-side{display:grid;grid-template-rows:auto auto 1fr;gap:14px}.scc-side>section{padding:16px}.scc-side h3{margin:0 0 12px;font-size:15px;text-transform:uppercase;color:#d9e8f6}.scc-info{display:grid}.scc-info p{display:grid;grid-template-columns:1fr auto;gap:12px;margin:0;padding:12px 0;border-bottom:1px solid #ffffff12}.scc-info p:last-child{border:0}.scc-info span{color:#a6bacd}.scc-info b{color:#42a9ff}.scc-route{position:relative;display:flex;justify-content:space-between;align-items:center;padding:24px 10px}.scc-route:before{content:"";position:absolute;left:18px;right:18px;height:5px;background:linear-gradient(90deg,#35df6f,#2985ff 42%,#44536a 42%);border-radius:99px}.scc-route i{position:relative;width:18px;height:18px;border-radius:50%;background:#44536a;border:4px solid #13253a}.scc-route i.active{background:#2c92ff;box-shadow:0 0 18px #2c92ff}.scc-bus{position:absolute;left:38%;top:2px;color:#44aaff;font-size:27px}.scc-route-labels{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:9px;text-align:center;color:#8fa6ba}.scc-ai-card{padding:16px;border:1px solid rgba(0,205,255,.25);border-radius:18px;background:radial-gradient(circle at 10% 20%,rgba(0,190,255,.18),transparent 35%),rgba(2,15,28,.7)}.scc-ai-card strong{color:#38eb76;font-size:18px}.scc-ai-card p{color:#c4d5e2;line-height:1.5}.scc-ai-card div{display:flex;justify-content:space-between;border-top:1px solid #ffffff18;padding-top:12px}.scc-ai-card div b{color:#38eb76}@media(max-width:1050px){.scc-grid{grid-template-columns:1fr}.scc-hero{min-height:600px}.scc-side{grid-template-columns:repeat(3,1fr);grid-template-rows:auto}.scc-side>section{min-width:0}}@media(max-width:760px){.scc-head{align-items:center}.scc-clock small{display:none}.scc-grid{display:block}.scc-hero{grid-template-columns:88px 1fr 110px;min-height:650px}.scc-left-metrics b{font-size:30px}.scc-next b{font-size:19px}.scc-actions{grid-template-columns:repeat(3,1fr)}.scc-actions button{min-height:90px}.scc-side{display:grid;grid-template-columns:1fr;margin-top:12px}.scc-hero-bg{background-position:center}.scc-ai{border-radius:18px}.scc-ai em{display:none}}
  `;
  document.head.appendChild(style);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
