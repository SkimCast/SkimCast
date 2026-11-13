// SkimCast map view: a full-screen map of every beach, colored by the score for the day you pick (today and the next 4 days).
// Opened by the Map button on the top bar. Loads only when someone taps it, so the homepage stays fast.
// Scores come from the same forecast the rest of the site uses (the quick all-beach scan, or the full forecast once a beach is loaded).
// Map data: US states (US Census via us-atlas), countries (Natural Earth via world-atlas), close-up coastline (OpenStreetMap via geo-maps).
(() => {
"use strict";
const PIN = {w:"#FF2E63", good:"#1ED67A", fair:"#E8FF3A", skip:"#B8B3A9"};      // W Skim pink-red, Good green, Fair neon yellow, Skip grey
const PIN_TXT = {w:"#fff", good:"#1D1C1A", fair:"#1D1C1A", skip:"#1D1C1A"};
const NAME = {w:"W Skim", good:"Good", fair:"Fair", skip:"Skip it"};
const TH = {ocean:"#BFDCE8", land:"#FFFFFF", other:"#F5F3EE", border:"#C8C2B5", coast:"#7FA9BA", county:"#EEEBE4", cb:"#8C8576", grat:"#AFCFDC", halo:"#D8EBF2"};
const WESTSIDE = new Set(["San Diego","Orange County","Los Angeles","Central Coast","NorCal","Tampa Bay","Sarasota","Southwest Florida","Panhandle","Keys","Texas"]);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hr = h => (h%12||12) + (h<12 ? "am" : "pm");
const compass = d => ["N","NE","E","SE","S","SW","W","NW"][Math.round(((d%360)+360)%360/45)%8];

let root, built = false, opening = null, pushed = false, coastReq = null;
let day = 0, scan5 = {}, scan5Ts = 0, scan5Req = null, dates = [];
let S = [], GEO = null, proj = null, map = null, sel = null, scores = new Map(), regs = [], gR, gB, rNodes, bNodes, sheet, ui, pollT = 0;

function loadScript(src){ return new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => no(new Error("Could not load the map library")); document.head.appendChild(s); }); }
async function getJSON(u){ const r = await fetch(u); if (!r.ok) throw new Error("Could not load the map (" + r.status + ")"); return r.json(); }

/* ---------- scores from the site's forecast ---------- */
// Today uses the site's quick scan; the other days use the map's own 5-day scan (loaded once the map opens).
function scoreOf(i){
  const c = fcCache[i] || scan5[i] || (day === 0 ? scanFc[i] : null); if (!c) return null;
  try{ return withSpot(i, () => { const D = build(c); if (!dates.length && D.length > 1) setDates(D);
    const di = day === 0 && D[0].over && D[1] ? 1 : day, d = D[di]; if (!d) return null;
    return {s: d.best.s, d, di, tomorrow: day === 0 && di === 1}; }); }catch(e){ return null; }
}
// One wave request and one wind request for all beaches, 5 days out. Same data the homepage scan uses, just more days.
function scan5Load(){
  if (scan5Req || Date.now() - scan5Ts < 30*60e3) return scan5Req;
  const q = `latitude=${SPOTS.map(x=>x.lat).join(",")}&longitude=${SPOTS.map(x=>x.lon).join(",")}&timezone=auto&forecast_days=5`;
  scan5Req = Promise.all([jget(`https://marine-api.open-meteo.com/v1/marine?${q}&hourly=${SCAN_MARINE}`),
    jget(`https://api.open-meteo.com/v1/forecast?${q}&hourly=${WEATHER}&daily=sunrise,sunset&wind_speed_unit=mph&temperature_unit=fahrenheit`)])
    .then(([M, W]) => { const arr = r => Array.isArray(r) ? r : [r], MM = arr(M), WW = arr(W), no = {status:"rejected"};
      SPOTS.forEach((sp, i) => { try{ if (MM[i] && WW[i]) scan5[i] = buildForecast(MM[i], null, WW[i], no, no, sp); }catch(e){} });
      scan5Ts = Date.now(); })
    .catch(() => { if (day) setStatus("Couldn't load the other days. Try again in a minute."); })
    .finally(() => { scan5Req = null; if (root && !root.hidden) poll(); });
  return scan5Req;
}
function setDates(D){ dates = D.map(x => x.date); dayChips(); }
function dayChips(){
  const box = root && root.querySelector("#mvDays"); if (!box) return;
  const t0 = new Date(); t0.setHours(12, 0, 0, 0);
  const lab = k => dates[k] || new Date(t0.getTime() + k*864e5).toLocaleDateString("en-CA");
  box.innerHTML = Array.from({length: 5}, (_, k) => `<button class="mv-chip${k === day ? " mv-on" : ""}" data-day="${k}" aria-pressed="${k === day}">${k === 0 ? "Today" : k === 1 ? "Tmrw" : dayName(lab(k))}</button>`).join("");
}
function rescore(){ scores = new Map(); S.forEach(p => { const q = scoreOf(p.i); if (q) scores.set(p.i, q); }); }
const sOf = p => scores.has(p.i) ? scores.get(p.i).s : null;
const tier = s => s == null ? null : gradeOf(s);
function regionBest(r){ let b = null; r.pts.forEach(p => { const s = sOf(p); if (s != null && (b == null || s > b)) b = s; }); return b; }

/* ---------- page shell ---------- */
function shell(){
  root = document.createElement("div"); root.id = "mapview"; root.hidden = true;
  root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Beach map");
  root.innerHTML = `<div class="mv-map" id="mvMap"></div>
  <div class="mv-top"><div class="mv-search"><button class="mv-back" id="mvBack" aria-label="Back to forecast" title="Back to forecast"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
    <span class="mv-brand">SKIMCAST<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M1 6 Q36 1 99 6" stroke="#D2425A" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:2.4px"/></svg></span>
    <input id="mvQ" type="search" placeholder="Search ${S.length} beaches" aria-label="Search beaches" autocomplete="off" list="mvList"><datalist id="mvList">${S.map(p => `<option value="${esc(p.name)}">`).join("")}</datalist>
    <button class="mv-chip" id="mvNear">◎ Near me</button></div>
    <div class="mv-row"><span class="mv-days" id="mvDays" role="group" aria-label="Day"></span><span class="mv-gap"></span><button class="mv-chip" data-m="wave">Wave riding</button><button class="mv-chip" data-m="flat">Flatland</button><span class="mv-status" id="mvStatus"></span></div></div>
  <div class="mv-zoom"><button aria-label="Zoom in" data-z="1.8">+</button><button aria-label="Zoom out" data-z="0.5556">−</button></div>
  <div class="mv-leg">${["w","good","fair","skip"].map(t => `<span><i style="background:${PIN[t]}"></i>${NAME[t]}</span>`).join("")}</div>
  <div class="mv-sheet" id="mvSheet" aria-live="polite"></div>`;
  document.body.appendChild(root);
  sheet = root.querySelector("#mvSheet"); ui = root.querySelector(".mv-top");
  root.querySelector("#mvBack").onclick = () => close();
  root.querySelectorAll("[data-z]").forEach(b => b.onclick = () => map.top.transition().duration(250).call(map.zoom.scaleBy, +b.dataset.z));
  root.querySelector("#mvDays").addEventListener("click", e => { const b = e.target.closest("[data-day]"); if (!b) return;
    day = +b.dataset.day; dayChips(); scan5Load(); poll(); });
  root.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { if (mode !== b.dataset.m){ setMode(b.dataset.m); } refresh(); });
  const q = root.querySelector("#mvQ");
  const go = () => { const v = q.value.trim().toLowerCase(); if (!v) return;
    const hit = S.find(p => p.name.toLowerCase() === v) || S.find(p => p.name.toLowerCase().startsWith(v)) || S.find(p => p.name.toLowerCase().includes(v) || p.region.toLowerCase().includes(v));
    if (hit){ q.blur(); select(hit, true); } else setStatus("No beach called “" + q.value.trim() + "”"); };
  q.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  q.addEventListener("change", go);
  root.querySelector("#mvNear").onclick = nearMe;
  sheet.addEventListener("click", e => {
    if (e.target.closest("[data-close]")){ sheet.classList.remove("open"); sel = null; layout(map.t); }
    const f = e.target.closest("[data-go]"); if (f){ const i = +f.dataset.go, di = f.dataset.di ? +f.dataset.di : (day || null); close(true); pick(i, di); }
    const s = e.target.closest("[data-fav]"); if (s){ toggleFav(+s.dataset.fav); s.textContent = isFav(+s.dataset.fav) ? "★ Saved" : "☆ Save"; }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !root.hidden) close(); });
}
function setStatus(t){ const el = root && root.querySelector("#mvStatus"); if (el) el.textContent = t || ""; }

/* ---------- the map ---------- */
function makeMap(host){
  const W = host.clientWidth, H = host.clientHeight;
  host.innerHTML = "";
  const base = d3.select(host).append("svg").attr("width", W).attr("height", H).attr("class", "mv-svg");
  const land = base.append("g");
  land.append("path").attr("d", GEO.grat).attr("fill","none").attr("stroke", TH.grat).attr("stroke-width", .6).attr("stroke-dasharray","2 3");
  const halo = land.append("g");
  halo.append("path").attr("d", GEO.other).attr("fill","none").attr("stroke", TH.halo).attr("stroke-width", 7).attr("stroke-linejoin","round");
  halo.append("path").attr("d", GEO.states.join("")).attr("fill","none").attr("stroke", TH.halo).attr("stroke-width", 7).attr("stroke-linejoin","round");
  land.append("path").attr("d", GEO.other).attr("fill", TH.other).attr("stroke", TH.border).attr("stroke-width", .6);
  land.append("path").attr("d", GEO.states.join("")).attr("fill", TH.land);
  const hiW = land.append("g").attr("display","none");
  const counties = land.append("path").attr("d", GEO.counties).attr("fill","none").attr("stroke", TH.county).attr("stroke-width", .6).attr("display","none");
  land.append("path").attr("d", GEO.borders).attr("fill","none").attr("stroke", TH.border).attr("stroke-width", .9);
  land.append("path").attr("d", GEO.cborders).attr("fill","none").attr("stroke", TH.cb).attr("stroke-width", 1.6).attr("stroke-dasharray","6 3 1.5 3");
  const hiC = land.append("g").attr("display","none");
  const coast = land.append("path").attr("d", GEO.states.join("")).attr("fill","none").attr("stroke", TH.coast).attr("stroke-width", .8).attr("opacity", .9);
  land.selectAll("path").attr("vector-effect", "non-scaling-stroke");
  const top = d3.select(host).append("svg").attr("width", W).attr("height", H).attr("class", "mv-svg");
  top.append("rect").attr("width", W).attr("height", H).attr("fill", "transparent");
  const labels = top.append("g").style("pointer-events","none");
  const layer = top.append("g");
  const api = {W, H, t: d3.zoomIdentity, top, layer, listeners: []};
  let hasCoast = false;
  api.addCoast = hires => { if (hasCoast) return; hasCoast = true;
    hires.forEach(h => { hiW.append("path").attr("d", h.rect).attr("fill", TH.ocean); hiW.append("path").attr("d", h.land).attr("fill", TH.land).attr("fill-rule","evenodd");
      hiC.append("path").attr("d", h.land).attr("fill","none").attr("stroke", TH.coast).attr("stroke-width", .9).attr("vector-effect","non-scaling-stroke"); });
    api.listeners.forEach(f => f(api.t)); };
  api.zoom = d3.zoom().scaleExtent([0.6, 90]).on("zoom", e => { api.t = e.transform; land.attr("transform", api.t); api.listeners.forEach(f => f(api.t)); });
  top.call(api.zoom);
  api.pt = p => api.t.apply([p.x, p.y]);
  api.fitT = (b, pad={}) => { const P = {t:20,r:20,b:20,l:20,...pad};
    const k = Math.min(70, (W-P.l-P.r)/Math.max(b[2]-b[0], 4), (H-P.t-P.b)/Math.max(b[3]-b[1], 4)), cx = (b[0]+b[2])/2, cy = (b[1]+b[3])/2;
    return d3.zoomIdentity.translate(P.l + (W-P.l-P.r)/2 - k*cx, P.t + (H-P.t-P.b)/2 - k*cy).scale(k); };
  api.fly = (b, pad, dur=750) => { const t = api.fitT(b, pad); if (dur && !reduced()) top.transition().duration(dur).call(api.zoom.transform, t); else top.call(api.zoom.transform, t); };
  api.flyTo = (p, k, pad={}, dur=750) => { const P = {t:0,r:0,b:0,l:0,...pad};
    const t = d3.zoomIdentity.translate(P.l + (W-P.l-P.r)/2 - k*p.x, P.t + (H-P.t-P.b)/2 - k*p.y).scale(k);
    if (reduced()) top.call(api.zoom.transform, t); else top.transition().duration(dur).call(api.zoom.transform, t); };
  api.onZoom = f => { api.listeners.push(f); f(api.t); };

  // labels: countries, water, states, cities (more appear as you zoom in)
  const haloT = s => s.attr("paint-order","stroke").attr("stroke","#fff").attr("stroke-width",3).attr("stroke-linejoin","round");
  const cL = haloT(labels.selectAll(".cl").data(GEO.cLabels).join("text").attr("text-anchor","middle").attr("fill","#8C8576").attr("font-size",12).attr("font-weight",700).attr("letter-spacing","0.28em").text(d => d[0]));
  const wL = labels.selectAll(".wl").data(GEO.water).join("text").attr("text-anchor","middle").attr("fill","#4F8197").attr("font-style","italic")
    .attr("font-size", d => d[3] === 0 ? 12 : 10.5).attr("letter-spacing", d => d[3] === 0 ? "0.22em" : "0.04em").text(d => d[0]);
  const sL = haloT(labels.selectAll(".sl").data(GEO.stLabels).join("text").attr("text-anchor","middle").attr("fill","#A39C8E").attr("font-weight",600));
  const cityG = labels.selectAll(".ci").data(GEO.cities).join("g");
  cityG.append("circle").attr("r", d => d[3] === 0 ? 2.8 : 2.2).attr("fill","#fff").attr("stroke","#4A463F").attr("stroke-width",1.2);
  haloT(cityG.append("text").attr("x",5).attr("dy",".35em").attr("fill","#4A463F").attr("font-size", d => d[3] === 0 ? 11.5 : 10.5).attr("font-weight", d => d[3] === 0 ? 700 : 500).text(d => d[0]));
  const cityMin = [1.2, 2.6, 6, 11];
  api.onZoom(t => { const k = t.k, P = (x, y) => t.apply([x, y]);
    counties.attr("display", k >= 3 ? null : "none");
    const hi = hasCoast && k >= 4; hiW.attr("display", hi ? null : "none"); hiC.attr("display", hi ? null : "none"); coast.attr("display", hi ? "none" : null); halo.attr("display", hi ? "none" : null);
    cL.attr("display", k < 14 ? null : "none").attr("x", d => P(d[1], d[2])[0]).attr("y", d => P(d[1], d[2])[1]);
    wL.attr("display", d => (d[3] === 0 ? k < 7 : d[3] === 1 ? k >= 2 : d[3] === 2 ? k >= 3.5 : k >= 8) ? null : "none").attr("x", d => P(d[1], d[2])[0]).attr("y", d => P(d[1], d[2])[1]);
    sL.attr("x", d => P(d[2], d[3])[0]).attr("y", d => P(d[2], d[3])[1]).attr("display", d => (k < 2.2 ? d[4] > 900 / k : k < 30) ? null : "none")
      .attr("font-size", k < 2.2 ? 10 : 11).attr("letter-spacing", k < 2.2 ? "0.04em" : "0.2em").text(d => k < 2.2 ? d[1] : d[0].toUpperCase());
    const items = GEO.cities.map(d => { const [sx,sy] = P(d[1], d[2]); return {d, sx, sy, ok: k >= cityMin[d[3]] && sx > -50 && sy > -20 && sx < W + 50 && sy < H + 20}; }).filter(i => i.ok).sort((a,b) => a.d[3] - b.d[3]);
    const placed = []; items.forEach(i => { i.show = !placed.some(q => Math.abs(q.sx - i.sx) < 70 && Math.abs(q.sy - i.sy) < 16); if (i.show) placed.push(i); });
    const vis = new Map(items.filter(i => i.show).map(i => [i.d, i]));
    cityG.attr("display", d => vis.has(d) ? null : "none").attr("transform", d => vis.has(d) ? `translate(${vis.get(d).sx},${vis.get(d).sy})` : null);
  });
  return api;
}
function placeLabels(items, minD){ const placed = [];
  items.forEach(it => { it.show = !placed.some(q => Math.abs(q.sx-it.sx) < minD.x && Math.abs(q.sy-it.sy) < minD.y); if (it.show) placed.push(it); }); }
function bbox(pts, pad=0){ const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y); return [Math.min(...xs)-pad, Math.min(...ys)-pad, Math.max(...xs)+pad, Math.max(...ys)+pad]; }
const phone = () => innerWidth < 700;

function markers(){
  regs = [...new Set(S.map(p => p.region))].map(r => { const pts = S.filter(p => p.region === r); return {r, pts, x: d3.mean(pts, p=>p.x), y: d3.mean(pts, p=>p.y)}; });
  gR = map.layer.append("g"); gB = map.layer.append("g");
  rNodes = gR.selectAll("g").data(regs).join("g").attr("class","mv-mk").attr("role","button").attr("aria-label", d => d.r)
    .on("click", (e,d) => map.fly(bbox(d.pts, 1.2), {t:120, b: phone() ? 60 : 40}));
  rNodes.append("circle").attr("r", 17).attr("stroke", "#1D1C1A").attr("stroke-width", 2);
  rNodes.append("text").attr("class","n").attr("text-anchor","middle").attr("dy", "0.35em").attr("font-size", 11.5);
  rNodes.append("text").attr("text-anchor","middle").attr("y", 29).attr("font-size", 9.5).attr("fill", "#24221E").attr("font-weight", 700)
    .attr("paint-order","stroke").attr("stroke","#fff").attr("stroke-width",3).text(d => d.r.length > 13 ? d.r.split(" ")[0] : d.r);
  bNodes = gB.selectAll("g").data(S).join("g").attr("class","mv-mk").attr("role","button").attr("aria-label", d => d.name)
    .on("click", (e,d) => { e.stopPropagation(); select(d, true); });
  bNodes.append("circle").attr("class","dot").attr("stroke","#141312").attr("stroke-width",1.5);
  bNodes.append("rect").attr("class","pill").attr("x",-17).attr("y",-11).attr("width",34).attr("height",22).attr("rx",11).attr("stroke","#141312").attr("stroke-width",1.5);
  bNodes.append("text").attr("text-anchor","middle").attr("dy","0.36em").attr("font-size", 11);
}
function paint(){
  rNodes.each(function(d){ const s = regionBest(d), t = tier(s), g = d3.select(this);
    g.select("circle").attr("fill", t ? PIN[t] : "#fff").attr("stroke-dasharray", t ? null : "3 3");
    g.select(".n").text(s == null ? "…" : s.toFixed(1)).attr("fill", t ? PIN_TXT[t] : "#6A655C"); });
  bNodes.each(function(d){ const s = sOf(d), t = tier(s), g = d3.select(this);
    g.selectAll("circle,rect").attr("fill", t ? PIN[t] : "#fff");
    g.select("text").text(s == null ? "…" : s.toFixed(1)).attr("fill", t ? PIN_TXT[t] : "#6A655C"); });
  if (sel && sheet.classList.contains("open")) sheet.innerHTML = card(sel);
}
function layout(t){
  if (!rNodes) return;
  const k = t.k, showR = k < 4.2, val = p => sOf(p) ?? -1;
  gR.attr("display", showR ? null : "none"); gB.attr("display", showR ? "none" : null);
  if (showR){
    const items = regs.map(d => { const [sx,sy] = map.pt(d); return {d, sx, sy, s: regionBest(d) ?? -1}; }).sort((a,b) => b.s - a.s);
    placeLabels(items, {x:36, y:44}); items.forEach(it => { it.d._v = it; });
    rNodes.attr("transform", d => `translate(${d._v.sx},${d._v.sy})`).attr("display", d => d._v.show ? null : "none"); return; }
  const W = map.W, H = map.H;
  const items = S.map(d => { const [sx,sy] = map.pt(d); return {d, sx, sy, s: val(d)}; }).sort((a,b) => b.s - a.s);
  placeLabels(items.filter(it => it.sx > -40 && it.sy > -40 && it.sx < W+40 && it.sy < H+40), {x:36, y:24}); items.forEach(it => { it.d._v = it; });
  const big = k >= 9;
  bNodes.attr("transform", d => `translate(${d._v.sx},${d._v.sy})`);
  bNodes.select(".dot").attr("r", d => d === sel ? 8 : (k < 7 ? 4 : 5)).attr("display", d => big && d._v.show ? "none" : null);
  bNodes.select(".pill").attr("display", d => big && d._v.show ? null : "none").attr("stroke-width", d => d === sel ? 3.5 : 1.5).attr("transform", d => d === sel ? "scale(1.2)" : null);
  bNodes.select("text").attr("display", d => big && d._v.show ? null : "none");
  if (big) bNodes.filter(d => d._v.show).raise();     // score pills sit on top of the small dots next to them
  if (sel) bNodes.filter(d => d === sel).raise();
}

/* ---------- beach card ---------- */
const whenTxt = di => di === 0 ? "Today" : di === 1 ? "Tomorrow" : dates[di] ? new Date(dates[di] + "T12:00").toLocaleDateString(undefined, {weekday:"long"}) : "";
function card(p){
  const q = scores.get(p.i), nm = esc(p.name.replace(/, [A-Z]{2}$/, "")), st = (p.name.match(/, ([A-Z]{2})$/) || [])[1] || "";
  const head = (tag, sc) => `<div class="mv-grab"></div><div class="mv-r1"><div><div class="mv-nm">${nm}</div><div class="mv-rg">${esc(p.region)}${st ? " · " + st : ""} · ${q ? whenTxt(q.di) : day === 0 ? "Today" : whenTxt(day)}</div>${tag}</div>
    <div class="mv-scw">${sc}<button class="mv-x" data-close aria-label="Close">×</button></div></div>`;
  if (!q) return `<div class="mv-card">${head("", "")}<p class="mv-best">Still loading this beach's score…</p><div class="mv-acts"><button class="mv-pri" data-go="${p.i}">Full forecast</button></div></div>`;
  const d = q.d, b = d.best, t = gradeOf(q.s), [wa, wb] = bestWindow(d);
  const bars = d.hrs.map(x => `<i title="${hr(+x.t.slice(11,13))}: ${x.s.toFixed(1)}" style="height:${Math.max(6, x.s*10)}%;background:${PIN[gradeOf(x.s)]}"></i>`).join("");
  const h0 = +d.hrs[0].t.slice(11,13), h1 = +d.hrs[d.hrs.length-1].t.slice(11,13);
  const lows = d.all.filter((x, k, A) => k>0 && k<A.length-1 && x.tide <= A[k-1].tide && x.tide < A[k+1].tide && +x.t.slice(11,13) >= h0 && +x.t.slice(11,13) <= h1);
  const tideTxt = lows.length ? "Low " + hr(+lows[0].t.slice(11,13)) : "Tide " + (b.tide >= 0 ? "+" : "") + b.tide.toFixed(1) + " ft";
  return `<div class="mv-card">${head(`<span class="mv-tier mv-t-${t}">${NAME[t]}</span>`, `<div class="mv-sc">${q.s.toFixed(1)}<small>/10</small></div>`)}
    <p class="mv-best">Best window <b>${winText(wa, wb)}</b></p>
    <div class="mv-hrs" style="grid-template-columns:repeat(${d.hrs.length},1fr)" aria-label="Score by hour">${bars}</div><div class="mv-hrl"><span>${hr(h0)}</span><span>${hr(h1)}</span></div>
    <div class="mv-stats"><div>Shorebreak<b>${(b.wave*3.281).toFixed(1)} ft</b></div><div>Wind<b>${Math.round(b.wind)} mph ${compass(b.wdir)}</b></div><div>${lows.length ? "Tide" : "At best time"}<b>${tideTxt}</b></div></div>
    <div class="mv-acts"><button class="mv-pri" data-go="${p.i}" data-di="${q.di}">Full forecast</button><button data-fav="${p.i}">${isFav(p.i) ? "★ Saved" : "☆ Save"}</button></div></div>`;
}
function select(p, fly){
  sel = p; sheet.innerHTML = card(p); sheet.classList.add("open");
  if (!fcCache[p.i]) forecastFor(p.i, false).then(() => { const q = scoreOf(p.i); if (q){ scores.set(p.i, q); paint(); layout(map.t); } }).catch(() => {});
  if (fly) map.flyTo(p, Math.max(map.t.k, 16), phone() ? {b: 330, t: 110} : {r: 380});
  else layout(map.t);
}
function nearMe(){
  const fallback = () => { const c = S[spotIdx] || S[0]; map.fly(bbox(S.filter(p => p.region === c.region), 1), {t:120, b:60}); };
  if (!navigator.geolocation) return fallback();
  setStatus("Finding you…");
  navigator.geolocation.getCurrentPosition(pos => { setStatus("");
    const xy = proj([pos.coords.longitude, pos.coords.latitude]), me = {x: xy[0], y: xy[1]};
    const near = S.slice().sort((a,b) => Math.hypot(a.x-me.x, a.y-me.y) - Math.hypot(b.x-me.x, b.y-me.y)).slice(0, 8);
    map.fly(bbox(near.concat([me]), .5), {t:120, b:60}); }, () => { setStatus(""); fallback(); }, {timeout: 8000, maximumAge: 600000});
}

/* ---------- live data ---------- */
function refresh(){
  rescore(); paint(); layout(map.t);
  root.querySelectorAll("[data-m]").forEach(b => b.classList.toggle("mv-on", b.dataset.m === mode));
  const have = scores.size;
  setStatus(have < S.length ? (have ? `Loading scores… ${have}/${S.length}` : "Loading scores…") : "");
  if (!dates.length) dayChips();
}
function poll(){ clearTimeout(pollT); if (root.hidden) return; refresh(); if (scores.size < S.length && (day === 0 || scan5Req)) pollT = setTimeout(poll, 1500); }

/* ---------- open / close ---------- */
async function ensure(){
  if (built) return;
  if (!opening) opening = (async () => {
    const [geo] = await Promise.all([getJSON("/map-geo.json"), window.d3 ? null : loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js")]);
    GEO = geo; proj = d3.geoConicEqualArea().parallels([29.5,45.5]).rotate([96,0]).center([0,38.2]).scale(geo.proj.scale).translate(geo.proj.translate);
    S = SPOTS.map((sp, i) => { const [x, y] = proj([sp.lon, sp.lat]); return {i, name: sp.name, region: sp.region, x, y}; });
    shell(); built = true;
  })();
  try { await opening; } catch(e){ opening = null; throw e; }
}
function draw(){
  map = makeMap(root.querySelector("#mvMap")); markers(); map.onZoom(layout);
  if (!coastReq) coastReq = getJSON("/map-coast.json").catch(() => null);
  coastReq.then(h => { if (h && map) map.addCoast(h); });
  const c = S[spotIdx];
  map.fly(bbox(S, 10), {t: phone() ? 110 : 90, b: 40, l: 20, r: 20}, 0);
  if (c) map.fly(bbox(S.filter(p => p.region === c.region), 1.2), {t: 120, b: phone() ? 60 : 40}, reduced() ? 0 : 1100);
  sel = null; sheet.classList.remove("open");
}
async function open(fromHash){
  const btns = document.querySelectorAll(".mapbtn"); btns.forEach(b => b.setAttribute("aria-busy", "true"));
  try { await ensure(); }
  catch(e){ btns.forEach(b => b.removeAttribute("aria-busy")); alertBox(e.message); return; }
  btns.forEach(b => b.removeAttribute("aria-busy"));
  root.hidden = false; document.documentElement.classList.add("mv-lock");
  if (!fromHash && location.hash !== "#map"){ try{ history.pushState({map:1}, "", location.pathname + location.search + "#map"); pushed = true; }catch(e){} }
  draw(); if (!scanTs) wScan(); poll(); setTimeout(scan5Load, 2500);
  setTimeout(() => root.querySelector("#mvBack").focus({preventScroll:true}), 50);
}
function close(keepHistory){
  if (!root || root.hidden) return;
  root.hidden = true; document.documentElement.classList.remove("mv-lock"); clearTimeout(pollT);
  if (location.hash === "#map"){ if (pushed && !keepHistory){ pushed = false; history.back(); } else { try{ history.replaceState(null, "", location.pathname + location.search); }catch(e){} pushed = false; } }
  const b = [...document.querySelectorAll(".mapbtn")].find(x => x.offsetParent); if (b) b.focus({preventScroll:true});
}
function alertBox(msg){ const el = document.createElement("div"); el.className = "mv-toast"; el.textContent = msg + ". Check your connection and try again."; document.body.appendChild(el); setTimeout(() => el.remove(), 4000); }

window.addEventListener("popstate", () => { if (location.hash === "#map") open(true); else close(true); });
let rz; window.addEventListener("resize", () => { if (!root || root.hidden) return; clearTimeout(rz); rz = setTimeout(() => { const t = map.t, keep = sel; draw(); map.top.call(map.zoom.transform, t); if (keep) select(keep, false); refresh(); }, 250); });
document.querySelectorAll(".mapbtn").forEach(b => b.addEventListener("click", () => open(false)));
if (location.hash === "#map") open(true);
})();
