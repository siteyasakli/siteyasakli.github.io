/* ============================================================
   Shared logic used by positions.html and match.html
   Depends on POSITIONS_DATA from data.js
   ============================================================ */

const POSITIONS = (typeof POSITIONS_DATA !== "undefined") ? POSITIONS_DATA.positions : [];

// Turns a position name into the same filename used by its static page,
// e.g. "Rock 'n' Roll" -> "rock-n-roll". Used both at build time (Python)
// and at runtime here, so the two must stay in sync.
function slugify(name){
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- label dictionaries (Turkish UI copy over English data keys) ---------- */

const TR = {
  fields: {
    deep_penetration: "Derinlik",
    g_spot_stimulation: "G-noktası uyarımı",
    clitoral_stimulation: "Klitoral uyarım",
    male_effort: "Erkek eforu",
    female_effort: "Kadın eforu",
    overweight_suitability: "Kilolu birey uyumu",
    eye_contact_intimacy: "Göz teması / yakınlık",
    communication_ease: "Konuşma kolaylığı",
    lower_back_load: "Bel yükü",
    knee_load: "Diz yükü",
    shoulder_wrist_load: "Omuz / bilek yükü",
    neck_load: "Boyun yükü",
    condom_slip_risk: "Kondom kayma riski",
    flexibility_required: "Gereken esneklik",
    privacy_noise_level: "Mahremiyet / sessizlik",
    vaginismus_dyspareunia_suitability: "Vajinismus / ağrılı ilişki uyumu",
    erectile_difficulty_suitability: "Ereksiyon güçlüğü uyumu",
    long_penis_suitability: "Uzun penis uyumu",
    short_penis_suitability: "Kısa penis uyumu",
    premature_ejaculation_suitability: "Erken boşalma uyumu",
    postpartum_recovery_suitability: "Doğum sonrası uygunluk",
    mobility_limitation_suitability: "Hareket kısıtlılığı uygunluğu",
    pain_condition_recommended: "Ağrı durumunda önerilir",
    kissing_possible: "Öpüşme imkanı",
    penetration_control: "Kontrol kimde",
    experience_level: "Deneyim seviyesi",
    equipment_needed: "Gereken ekipman",
    pregnancy_suitability: "Hamilelik uygunluğu",
  },
  enum: {
    penetration_control: { male:"Erkekte", female:"Kadında", shared:"Paylaşımlı", self:"Kendinde" },
    experience_level: { beginner:"Başlangıç", intermediate:"Orta", advanced:"İleri" },
    equipment_needed: { none:"Ekipman yok", bed_edge:"Yatak kenarı", chair:"Sandalye", wall_support:"Duvar desteği", pillow:"Yastık", other:"Diğer" },
    condom_slip_risk: { low:"Düşük", medium:"Orta", high:"Yüksek" },
    flexibility_required: { low:"Düşük", medium:"Orta", high:"Yüksek" },
    privacy_noise_level: { low:"Düşük", medium:"Orta", high:"Yüksek" },
    vaginismus_dyspareunia_suitability: { poor:"Kötü", medium:"Orta", good:"İyi" },
    erectile_difficulty_suitability: { poor:"Kötü", medium:"Orta", good:"İyi" },
    long_penis_suitability: { poor:"Kötü", medium:"Orta", good:"İyi" },
    short_penis_suitability: { poor:"Kötü", medium:"Orta", good:"İyi" },
    premature_ejaculation_suitability: { poor:"Kötü", medium:"Orta", good:"İyi" },
    pregnancy_suitability: {
      not_suitable:"Hamilelikte önerilmez",
      early_pregnancy_only:"Sadece hamileliğin ilk döneminde uygun",
      until_mid_pregnancy:"Hamileliğin ortasına kadar uygun",
      safe_all_trimesters:"Hamilelik boyunca uygun",
      case_by_case:"Kişiye/duruma göre değişir",
    },
  },
  bool: { true:"Evet", false:"Hayır" },
};

/* ---------- field metadata: drives both the detail view and the filter panel ---------- */

const ORDER3 = ["low","medium","high"];
const ORDER3_GMP = ["poor","medium","good"];
const ORDER_EXP = ["beginner","intermediate","advanced"];

const FIELD_META = [
  // 1-5 dial scales
  { key:"deep_penetration", type:"scale", group:"Fiziksel etki" },
  { key:"g_spot_stimulation", type:"scale", group:"Fiziksel etki" },
  { key:"clitoral_stimulation", type:"scale", group:"Fiziksel etki" },
  { key:"male_effort", type:"scale", group:"Efor ve yük" },
  { key:"female_effort", type:"scale", group:"Efor ve yük" },
  { key:"lower_back_load", type:"scale", group:"Efor ve yük" },
  { key:"knee_load", type:"scale", group:"Efor ve yük" },
  { key:"shoulder_wrist_load", type:"scale", group:"Efor ve yük" },
  { key:"neck_load", type:"scale", group:"Efor ve yük" },
  { key:"overweight_suitability", type:"scale", group:"Vücut uyumu" },
  { key:"eye_contact_intimacy", type:"scale", group:"Duygusal yakınlık" },
  { key:"communication_ease", type:"scale", group:"Duygusal yakınlık" },
  // 3-step ordinal (low/medium/high or poor/medium/good) -> level bar
  { key:"condom_slip_risk", type:"level3", order:ORDER3, group:"Pratik" },
  { key:"flexibility_required", type:"level3", order:ORDER3, group:"Efor ve yük" },
  { key:"privacy_noise_level", type:"level3", order:ORDER3, group:"Pratik" },
  { key:"vaginismus_dyspareunia_suitability", type:"level3", order:ORDER3_GMP, group:"Sağlık uyumu" },
  { key:"erectile_difficulty_suitability", type:"level3", order:ORDER3_GMP, group:"Sağlık uyumu" },
  { key:"long_penis_suitability", type:"level3", order:ORDER3_GMP, group:"Anatomik uyum" },
  { key:"short_penis_suitability", type:"level3", order:ORDER3_GMP, group:"Anatomik uyum" },
  { key:"premature_ejaculation_suitability", type:"level3", order:ORDER3_GMP, group:"Anatomik uyum" },
  // booleans -> traffic light
  { key:"postpartum_recovery_suitability", type:"bool", group:"Sağlık uyumu" },
  { key:"mobility_limitation_suitability", type:"bool", group:"Sağlık uyumu" },
  { key:"pain_condition_recommended", type:"bool", group:"Sağlık uyumu" },
  { key:"kissing_possible", type:"bool", group:"Duygusal yakınlık" },
  // control -> male/female icon
  { key:"penetration_control", type:"control", group:"Pratik" },
  // experience -> text badge, ordinal
  { key:"experience_level", type:"explevel", order:ORDER_EXP, group:"Pratik" },
  // equipment -> icon, nominal
  { key:"equipment_needed", type:"equipment", group:"Pratik" },
  // pregnancy -> nominal badge
  { key:"pregnancy_suitability", type:"nominal", group:"Sağlık uyumu" },
];

/* ---------- small inline icon set ---------- */

const EQUIP_ICON = {
  none: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M6 6l12 12" stroke="currentColor" stroke-width="1.6"/></svg>`,
  bed_edge: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M3 18v2M21 18v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="5" y="7" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.6"/></svg>`,
  chair: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4v10M6 4h9v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 14h9v3M6 20l1-3M15 20l-1-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  wall_support: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 3v18M4 21h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="15" cy="7" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M13 20l2-7 2 2 2 5M15 13l-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  pillow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 8c0-1.6 1.4-3 4-3s3 1.6 4 1.6S13.6 5 16 5s4 1.4 4 3-1.4 3-4 3-3-1.6-4-1.6S8.4 11 6 11s-2-1.5-2-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" transform="translate(0,4)"/></svg>`,
  other: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>`,
};

/* ---------- renderers used in the position detail overlay ---------- */

function renderDial(value){
  // semicircle speedometer, value 1-5
  const pct = Math.max(0, Math.min(1, (value-0.2)/4.8)); // small floor so 1 shows a sliver
  const startAngle = -120, endAngle = 120; // degrees, 0 = up
  const angle = startAngle + (endAngle-startAngle)*pct;
  const r = 26, cx = 32, cy = 32;
  const toXY = (deg)=>{
    const rad = (deg-90)*Math.PI/180;
    return [cx + r*Math.cos(rad), cy + r*Math.sin(rad)];
  };
  const [sx,sy] = toXY(startAngle);
  const [ex,ey] = toXY(endAngle);
  const [vx,vy] = toXY(angle);
  const large = (angle-startAngle) > 180 ? 1 : 0;
  const color = value>=4 ? "var(--lvl-3)" : value>=2.5 ? "var(--lvl-2)" : "var(--lvl-1)";
  return `
  <div class="dial">
    <svg width="64" height="46" viewBox="0 0 64 46">
      <path d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${64-sx} ${sy}" fill="none" stroke="var(--lvl-track)" stroke-width="6" stroke-linecap="round"/>
      <path d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${vx} ${vy}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="2.6" fill="${color}"/>
    </svg>
    <span class="dial-value">${value}/5</span>
  </div>`;
}

function renderLevelBar(rawValue, order, labelMap){
  const rank = order.indexOf(rawValue) + 1; // 1..3
  let segs = "";
  for(let i=1;i<=3;i++){
    segs += `<span class="seg ${i<=rank ? "on-"+i : ""}"></span>`;
  }
  const label = labelMap ? labelMap[rawValue] : rawValue;
  return `<div class="levelbar"><span class="lvl-text">${label}</span><span class="segments">${segs}</span></div>`;
}

function renderLight(boolValue){
  const cls = boolValue ? "on" : "off";
  return `<div class="light"><span class="lt-text">${TR.bool[boolValue]}</span><span class="dot ${cls}"></span></div>`;
}

function renderControl(value){
  const male = value==="male", female = value==="female", shared = value==="shared", self = value==="self";
  return `<div class="control">
    <span class="sym ${(male||shared) ? "active" : ""}" title="Erkek">♂</span>
    <span class="sym ${(female||shared) ? "active female" : ""}" title="Kadın">♀</span>
    ${self ? `<span class="sym active" title="Kendinde">S</span>` : ``}
  </div>`;
}

function renderExpLevel(value){
  return `<div class="explevel"><span class="pill ${value}">${TR.enum.experience_level[value]}</span></div>`;
}

function renderEquipment(value){
  return `<div class="equip"><span class="icon-box">${EQUIP_ICON[value]||EQUIP_ICON.other}</span><span class="eq-text">${TR.enum.equipment_needed[value]}</span></div>`;
}

function renderNominalBadge(fieldKey, value){
  return `<div class="badge-note">${TR.enum[fieldKey][value]}</div>`;
}

function fieldValueEl(fieldKey, value){
  const meta = FIELD_META.find(m=>m.key===fieldKey);
  switch(meta.type){
    case "scale": return renderDial(value);
    case "level3": {
      const labelMap = TR.enum[fieldKey];
      return renderLevelBar(value, meta.order, labelMap);
    }
    case "bool": return renderLight(value);
    case "control": return renderControl(value);
    case "explevel": return renderExpLevel(value);
    case "equipment": return renderEquipment(value);
    case "nominal": return renderNominalBadge(fieldKey, value);
    default: return `<span>${value}</span>`;
  }
}

function buildDetailStatsHTML(pos){
  const groups = {};
  FIELD_META.forEach(m=>{
    groups[m.group] = groups[m.group] || [];
    groups[m.group].push(m);
  });
  let html = "";
  Object.keys(groups).forEach(groupName=>{
    html += `<div class="detail-section-title">${groupName}</div>`;
    groups[groupName].forEach(m=>{
      const val = pos[m.key];
      html += `<div class="stat-row"><div class="stat-label">${TR.fields[m.key]}</div>${fieldValueEl(m.key, val)}</div>`;
    });
  });
  return html;
}

/* ============================================================
   MATCH ENGINE  (used by match.html)
   ============================================================ */

// Reads the live filter panel DOM and returns an array of active filter checks.
// Each check = { key, test(pos)->bool }
function collectActiveFilters(){
  const active = [];

  FIELD_META.forEach(m=>{
    if(m.type==="scale"){
      const enableAbove = document.getElementById(`f-${m.key}-above`);
      const enableBelow = document.getElementById(`f-${m.key}-below`);
      const slider = document.getElementById(`f-${m.key}-val`);
      if(!slider) return;
      const threshold = Number(slider.value);
      if(enableAbove && enableAbove.checked){
        active.push({ key:m.key, test:(pos)=> pos[m.key] >= threshold });
      }
      if(enableBelow && enableBelow.checked){
        active.push({ key:m.key+"-below", test:(pos)=> pos[m.key] <= threshold });
      }
    } else if(m.type==="level3" || m.type==="explevel"){
      const slider = document.getElementById(`f-${m.key}-val`);
      const enableAbove = document.getElementById(`f-${m.key}-above`);
      const enableBelow = document.getElementById(`f-${m.key}-below`);
      if(!slider) return;
      const rank = Number(slider.value); // 1..order.length
      const order = m.order;
      if(enableAbove && enableAbove.checked){
        active.push({ key:m.key, test:(pos)=> (order.indexOf(pos[m.key])+1) >= rank });
      }
      if(enableBelow && enableBelow.checked){
        active.push({ key:m.key+"-below", test:(pos)=> (order.indexOf(pos[m.key])+1) <= rank });
      }
    } else if(m.type==="bool"){
      const trueBox = document.getElementById(`f-${m.key}-true`);
      const falseBox = document.getElementById(`f-${m.key}-false`);
      const wanted = [];
      if(trueBox && trueBox.checked) wanted.push(true);
      if(falseBox && falseBox.checked) wanted.push(false);
      if(wanted.length>0){
        active.push({ key:m.key, test:(pos)=> wanted.includes(pos[m.key]) });
      }
    } else if(m.type==="control" || m.type==="equipment" || m.type==="nominal"){
      const options = m.type==="control" ? ["male","female","shared","self"]
        : m.type==="equipment" ? Object.keys(EQUIP_ICON)
        : Object.keys(TR.enum[m.key]);
      const wanted = options.filter(opt=>{
        const box = document.getElementById(`f-${m.key}-${opt}`);
        return box && box.checked;
      });
      if(wanted.length>0){
        active.push({ key:m.key, test:(pos)=> wanted.includes(pos[m.key]) });
      }
    }
  });

  return active;
}

function scorePosition(pos, activeFilters){
  if(activeFilters.length===0) return null;
  let matched = 0;
  activeFilters.forEach(f=>{ if(f.test(pos)) matched++; });
  return Math.round((matched/activeFilters.length)*100);
}

function runMatch(){
  const activeFilters = collectActiveFilters();
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("active-filter-count");
  countEl.innerHTML = `<span><b>${activeFilters.length}</b> aktif özellik seçili</span>`;

  if(activeFilters.length===0){
    resultsEl.innerHTML = `<div class="empty-state">Soldaki panelden en az bir özellik seçtiğinde, tüm pozisyonlar burada uygunluk sırasına göre listelenecek.</div>`;
    return;
  }

  const scored = POSITIONS.map(pos=>({ pos, score:scorePosition(pos, activeFilters) }));
  const best = scored.filter(s=>s.score>=80).sort((a,b)=>b.score-a.score);
  const ok = scored.filter(s=>s.score>=40 && s.score<80).sort((a,b)=>b.score-a.score);
  const worst = scored.filter(s=>s.score<40).sort((a,b)=>b.score-a.score);

  const renderGroup = (title, cls, items)=>{
    if(items.length===0) return `<div class="result-group ${cls}"><h3><span class="dot"></span>${title} <span class="count">(0)</span></h3><div class="empty-state">Bu aralıkta pozisyon yok.</div></div>`;
    const cards = items.map(({pos,score})=>`
      <a class="result-card" href="positions/${slugify(pos.name)}/${slugify(pos.name)}.html">
        <div class="rc-left">
          <div class="rc-name">${pos.name}</div>
          <div class="rc-cat">${pos.category}</div>
        </div>
        <div class="rc-score">%${score}</div>
      </a>`).join("");
    return `<div class="result-group ${cls}"><h3><span class="dot"></span>${title} <span class="count">(${items.length})</span></h3>${cards}</div>`;
  };

  resultsEl.innerHTML =
    renderGroup("En uygun · %80 ve üzeri", "best", best) +
    renderGroup("Uygun · %40 – %79", "ok", ok) +
    renderGroup("En az uygun · %39 ve altı", "worst", worst);
}
