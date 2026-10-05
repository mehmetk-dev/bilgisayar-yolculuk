// Bilgisayarın İçine Yolculuk — ana uygulama
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as C from './content.js';
import { disposeTree } from './geom.js';
import { setAniso } from './textures.js';
import { buildModel, ruler, registerIO } from './compare.js';
import { cpuSchemaSVG, cpuSchemaFacts } from './cpuSchema.js';
import { ERA_BUILDERS, ERA_IO } from './eras/index.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const PI = Math.PI;
for (const [e, cfg] of Object.entries(ERA_IO)) registerIO(e, cfg);

// ================================================================ Durum
const S = {
  era: '2000', level: 'k', labels: true, paused: false, quality: 'high',
  opts: { 1990: {}, 2000: { caseColor: 'beige' }, 2010: {}, 2025: { variant: 'oyun', rgb: true } },
  asm: null, explode: 0, explodeTarget: 0, open: 0, openTarget: 0, tray: 0, trayTarget: 0, disk: 0, diskTarget: 0,
  selected: null, cableMode: null, cablePart: null, inside: new Set(), quiz: null, compare: null, feature: null, focusSet: null,
  powerState: 'oyun', ready: false, time: 0,
};
window.APP = { S };

// ================================================================ Görüntüleyici
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
setAniso(Math.min(8, renderer.capabilities.getMaxAnisotropy()));

const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a2029');
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;
scene.environmentIntensity = 0.6;

const camera = new THREE.PerspectiveCamera(38, 1, 1, 2000);
camera.position.set(40, 36, 80);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 8;
controls.maxDistance = 260;
controls.maxPolarAngle = PI * 0.53;
controls.target.set(0, 21, 0);

function makeLights(sc) {
  const hemi = new THREE.HemisphereLight('#e6eeff', '#3a3229', 0.55);
  sc.add(hemi);
  const key = new THREE.DirectionalLight('#fff6ea', 1.7);
  key.position.set(-70, 110, 75);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -60; key.shadow.camera.right = 60; key.shadow.camera.top = 60; key.shadow.camera.bottom = -40;
  key.shadow.camera.near = 20; key.shadow.camera.far = 320;
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03;
  sc.add(key);
  const fill = new THREE.DirectionalLight('#cfe0ff', 0.7);
  fill.position.set(70, 50, -60);
  sc.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 0.5);
  rim.position.set(20, 40, 120);
  sc.add(rim);
  return { hemi, key, fill, rim };
}
const lights = makeLights(scene);
// kameraya bağlı yumuşak ışık: arka panel ve iç kısımlar da okunaklı olsun
const headLight = new THREE.DirectionalLight('#ffffff', 0.55);
camera.add(headLight);
headLight.position.set(0, 0, 1);
headLight.target.position.set(0, 0, -1);
camera.add(headLight.target);
scene.add(camera);
// masa yüzeyi
const floor = new THREE.Mesh(new THREE.CircleGeometry(420, 64), new THREE.MeshStandardMaterial({ color: '#2b313a', roughness: 0.92, metalness: 0 }));
floor.rotation.x = -PI / 2;
floor.position.y = -1.2;
floor.receiveShadow = true;
scene.add(floor);
const hlGroup = new THREE.Group();
scene.add(hlGroup);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, S.quality === 'high' ? 1.75 : 1));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const dx = w > 900 ? Math.round(($('#tools')?.offsetWidth || 0) / 2) : 0;
  camera.setViewOffset(w, h, -dx, 0, w, h);
  camera.updateProjectionMatrix();
  cmpCam.aspect = w / h;
  cmpCam.setViewOffset(w, h, 0, -Math.round(h * 0.17), w, h);
  cmpCam.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// ================================================================ Tween
const tweens = [];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function tween(dur, fn, done, tag) { tweens.push({ t: 0, dur, fn, done, tag }); }
function flyTo(pos, target, dur = 1.0) {
  for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].tag === 'cam') tweens.splice(i, 1);
  const p0 = camera.position.clone(), t0 = controls.target.clone();
  const p1 = new THREE.Vector3(...pos), t1 = new THREE.Vector3(...target);
  tween(dur, (k) => { camera.position.lerpVectors(p0, p1, k); controls.target.lerpVectors(t0, t1, k); }, null, 'cam');
}

// ================================================================ Dönem kurulumu
function buildEra(era) {
  const builder = ERA_BUILDERS[era];
  const t0 = performance.now();
  const asm = builder(S.opts[era] || {});
  console.log(`[dönem ${era}] kuruldu: ${(performance.now() - t0).toFixed(0)} ms`);
  setTimeout(() => console.log(`[dönem ${era}] çizim: ${renderer.info.render.calls} çağrı, ${(renderer.info.render.triangles / 1000).toFixed(0)}k üçgen`), 1500);
  return asm;
}

let animObjs = { spin: [], swing: [], sled: [], laser: [], discs: [], rgbMats: new Set(), leds: [] };

function setEra(era, { keepCamera = false } = {}) {
  if (!ERA_BUILDERS[era]) return;
  const fade = $('#fade');
  fade.classList.add('on');
  setTimeout(() => {
    resetModes();
    if (S.asm) { scene.remove(S.asm.root); disposeTree(S.asm.root); }
    S.era = era;
    S.asm = buildEra(era);
    scene.add(S.asm.root);
    S.explode = S.explodeTarget = 0; S.open = S.openTarget = 0; S.tray = S.trayTarget = 0; S.disk = S.diskTarget = 0;
    $('#explode').value = 0;
    collectAnim();
    buildLabels();
    updateEraUI();
    $$('.tool[data-act="view"]').forEach((b) => b.classList.toggle('on', !keepCamera && b.dataset.v === 'front'));
    if (!keepCamera) {
      const c = S.asm.cameras.front;
      camera.position.set(...c.pos); controls.target.set(...c.target);
    }
    lights.key.target.position.copy(S.asm.center);
    lights.key.target.updateMatrixWorld();
    if ($('#powerPanel').classList.contains('open')) renderPower();
    if ($('#eraPanel').classList.contains('open')) renderEraPanel();
    fade.classList.remove('on');
    S.ready = true;
  }, 260);
}

function collectAnim() {
  animObjs = { spin: [], swing: [], sled: [], laser: [], discs: [], rgbMats: new Set(), leds: [] };
  S.asm.root.traverse((o) => {
    if (o.userData.spin) animObjs.spin.push(o);
    if (o.userData.swing) animObjs.swing.push(o);
    if (o.userData.sled) animObjs.sled.push(o);
    if (o.userData.discSpin) animObjs.discs.push(o);
    if (o.name === 'laser') animObjs.laser.push(o);
    if (o.userData.led) animObjs.leds.push(o);
    if (o.isMesh && (o.userData.rgb || o.material?.userData?.rgb)) animObjs.rgbMats.add(o.material);
  });
  const layers = [...new Set(S.asm.parts.filter((p) => p.explode.lengthSq() > 0).map((p) => p.layer))].sort((a, b) => a - b);
  S.asm.layerIndex = new Map(layers.map((l, i) => [l, i]));
  S.asm.layerCount = layers.length;
}

function partById(id) { return S.asm?.parts.find((p) => p.id === id); }
function partName(p) { return C.PARTS[p.type]?.name || p.id; }

// ================================================================ Görünür durum (soluklaştırma)
const fadeCache = new Map();
function fadedMat(m, op) {
  const key = m.uuid + '|' + op;
  let f = fadeCache.get(key);
  if (!f) {
    f = m.clone();
    f.transparent = true;
    f.opacity = op * (m.opacity ?? 1);
    f.depthWrite = false;
    f.userData = { faded: true };
    fadeCache.set(key, f);
  }
  return f;
}
function setObjFade(obj, op) {
  obj.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.userData.origMat) o.userData.origMat = o.material;
    o.material = op >= 1 ? o.userData.origMat : fadedMat(o.userData.origMat, op);
  });
}

function applyVisual() {
  if (!S.asm) return;
  const parts = S.asm.parts;
  let keep = null; // tam görünür parça kimlikleri
  if (S.quiz) keep = null;
  else if (S.selected) keep = new Set([S.selected]);
  else if (S.cableMode) {
    keep = new Set();
    for (const c of S.asm.cables) if (cableActive(c)) c.parts.forEach((id) => keep.add(id));
    keep.delete('kasa');
    if (S.cableMode === 'data') (S.asm.dataNoCable || []).forEach((id) => keep.add(id));
  } else if (S.feature) keep = new Set(['anakart']);
  else if (S.focusSet) keep = new Set(S.focusSet);
  for (const p of parts) {
    let op = 1;
    if (keep && !keep.has(p.id) && !(p.type === 'ram' && [...keep].some((k) => partById(k)?.type === 'ram' && S.cableMode))) op = S.cableMode ? 0.12 : 0.1;
    if (p._op !== op) { setObjFade(p.obj, op); p._op = op; }
    // iç görünüm: kapak soluk
    const cover = p.obj.getObjectByName('cover');
    if (cover) setObjFade(cover, S.inside.has(p.id) ? 0.07 : op);
    const disc = p.type === 'optik' && p.obj.getObjectByName('disc');
    if (disc) setObjFade(disc, S.inside.has(p.id) ? 0.35 : op);
  }
  // kablolar
  for (const c of S.asm.cables) {
    const act = cableActive(c);
    const anyRemoved = c.parts.some((id) => { const p = partById(id); return p && p.removed > 0.02; });
    const show = S.explode < 0.02 && !anyRemoved && (!(S.cableMode || S.cablePart) || act) && !(S.selected && !S.cablePart);
    c.obj.visible = show || (act && S.explode < 0.02);
    const glow = act ? (c.kind === 'power' ? '#ff9a2e' : '#36d6ff') : '#000000';
    for (const m of c.mats) { m.emissive = new THREE.Color(glow); m.emissiveIntensity = act ? 0.6 : 0; }
  }
}
function cableActive(c) {
  if (S.cablePart) return c.parts.includes(S.cablePart) && c.parts.length >= 2;
  if (S.cableMode) return c.kind === S.cableMode;
  return false;
}

// ================================================================ Etiketler
const labelLayer = $('#labels');
let labelEls = [];
function buildLabels() {
  labelLayer.innerHTML = '';
  labelEls = [];
  for (const p of S.asm.parts) {
    if (p.id === 'ram2' || p.id === 'kasa') continue;
    const el = document.createElement('div');
    el.className = 'lbl';
    el.innerHTML = `<span>${partName(p)}</span>`;
    el.addEventListener('click', (e) => { e.stopPropagation(); selectPart(p.id); });
    labelLayer.appendChild(el);
    labelEls.push({ el, p, kind: 'part' });
  }
  for (const c of S.asm.cables) {
    const el = document.createElement('div');
    el.className = 'lbl cable ' + c.kind;
    el.innerHTML = `<span>${c.label}</span>`;
    labelLayer.appendChild(el);
    labelEls.push({ el, c, kind: 'cable' });
  }
  for (const r of S.asm.regions || []) {
    const el = document.createElement('div');
    el.className = 'lbl region';
    el.innerHTML = `<span>${r.label}</span>`;
    labelLayer.appendChild(el);
    labelEls.push({ el, r, kind: 'region' });
  }
  const fl = document.createElement('div');
  fl.className = 'lbl feature';
  labelLayer.appendChild(fl);
  labelEls.push({ el: fl, kind: 'feature' });
}

const _v = new THREE.Vector3();
function updateLabels() {
  const W = window.innerWidth, H = window.innerHeight;
  const placed = [];
  const items = [];
  for (const L of labelEls) {
    let show = false, world = null;
    if (L.kind === 'part') {
      const p = L.p;
      const isSel = S.selected === p.id;
      const c = S.asm.center, cp = camera.position;
      const front = cp.z > c.z - 5, back = cp.z < c.z + 5, left = cp.x < c.x;
      const outside = (['onPanel', 'optik', 'disket'].includes(p.type) && front) || (p.type === 'yanPanel' && left) || (p.type === 'camPanel') ||
        (p.id === 'fanArka' && back) || (p.id === 'onFanlar' && (front || S.era === '2025')) || (p.type === 'psu' && back && S.era !== '2025') ||
        (S.era === '2025' && ['ekranKarti', 'sogutucu', 'ram', 'psuBolmesi', 'anakart'].includes(p.type) && left);
      const insideVisible = S.open > 0.5 || S.explode > 0.1 || p.removed > 0.5;
      show = (S.labels && !S.quiz && !S.compare && !S.cableMode && !S.cablePart && !S.feature && (!S.selected || isSel) && (!S.focusSet || S.focusSet.includes(p.id)) && (outside || insideVisible || isSel)) || (S.focusSet && S.focusSet.includes(p.id) && !S.quiz);
      if (p.obj.visible === false) show = false;
      if (!isSel && S.asm.regions && camera.position.z - S.asm.center.z < -22 && S.explode < 0.05) show = false;
      if (show) world = p.obj.localToWorld(_v.copy(p.labelLocal));
      L.el.classList.toggle('sel', isSel);
      if (S.inside.has(p.id)) show = false;
    } else if (L.kind === 'cable') {
      show = !S.compare && L.c.obj.visible && cableActive(L.c);
      if (show) world = _v.copy(L.c.end);
    } else if (L.kind === 'region') {
      const behind = camera.position.z - S.asm.center.z < -22;
      show = behind && S.labels && !S.quiz && !S.compare && !S.selected && !S.cableMode && !S.cablePart && !S.feature && S.explode < 0.05;
      if (show) world = L.r.obj.localToWorld(_v.copy(L.r.local));
    } else if (L.kind === 'feature') {
      show = !!S.feature && !S.compare && !!S.featureCenter;
      if (show) { world = _v.copy(S.featureCenter); L.el.innerHTML = `<span>${C.FEATURES[S.feature].name}</span>`; }
    }
    if (!show) { L.el.style.display = 'none'; continue; }
    const q = world.clone().project(S.compare ? cmpCam : camera);
    if (q.z > 1 || q.x < -1.1 || q.x > 1.1 || q.y < -1.1 || q.y > 1.1) { L.el.style.display = 'none'; continue; }
    const d = world.distanceTo(camera.position);
    items.push({ L, x: (q.x * 0.5 + 0.5) * W, y: (-q.y * 0.5 + 0.5) * H, d });
  }
  items.sort((a, b) => a.d - b.d);
  const tb = $('#tools').getBoundingClientRect(), top = $('#top').getBoundingClientRect(), bot = $('#bottom').getBoundingClientRect();
  const ir = info.classList.contains('open') ? info.getBoundingClientRect() : null;
  const safe = { l: S.compare ? 8 : tb.right + 8, t: S.compare ? 70 : top.bottom + 2, r: ir ? ir.left - 8 : W - 8, b: S.compare ? H * 0.5 : bot.top - 4 };
  for (const it of items) {
    const el = it.L.el;
    if (it.x < safe.l || it.x > safe.r || it.y > safe.b || it.y < safe.t + 20) { el.style.display = 'none'; continue; }
    el.style.display = 'block';
    const w = el.offsetWidth, h = el.offsetHeight;
    let x = THREE.MathUtils.clamp(it.x - w / 2, safe.l, safe.r - w), y = it.y - h - 26;
    let ok = false, below = false;
    const free = (r) => !placed.some((o) => r.x < o.x + o.w + 4 && r.x + r.w + 4 > o.x && r.y < o.y + o.h + 3 && r.y + r.h + 3 > o.y);
    for (let k = 0; k < 6; k++) {
      const r = { x, y, w, h };
      if (r.y < safe.t) break;
      if (free(r)) { ok = true; placed.push(r); break; }
      y -= h + 6;
    }
    if (!ok) {
      // üstte yer yoksa altına yerleştir
      y = it.y + 26;
      const r = { x, y, w, h };
      if (y + h < safe.b && free(r)) { ok = true; below = true; placed.push(r); }
    }
    if (!ok) { el.style.display = 'none'; continue; }
    el.classList.toggle('below', below);
    el.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
    el.style.setProperty('--stem', `${(below ? y - it.y : it.y - (y + h)).toFixed(0)}px`);
    el.style.setProperty('--sx', `${(it.x - x - w / 2).toFixed(0)}px`);
  }
}

// ================================================================ Vurgu kutuları
function clearHighlights() { while (hlGroup.children.length) { const c = hlGroup.children.pop(); c.geometry.dispose(); } }
function addHighlight(box, color = '#ffd166', pad = 0.25) {
  const size = box.getSize(new THREE.Vector3()).addScalar(pad * 2);
  const ctr = box.getCenter(new THREE.Vector3());
  const g = new THREE.BoxGeometry(size.x, size.y, size.z);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, depthTest: false, depthWrite: false }));
  m.position.copy(ctr);
  m.renderOrder = 20;
  m.userData.pulse = true;
  hlGroup.add(m);
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color, transparent: true, depthTest: false }));
  e.position.copy(ctr);
  e.renderOrder = 21;
  hlGroup.add(e);
}

// ================================================================ Seçim
function resetModes() {
  S.selected = null; S.cableMode = null; S.cablePart = null; S.feature = null; S.featureCenter = null; S.focusSet = null; S.inside.clear();
  S.quiz = null;
  $('#quizBar').classList.remove('open');
  $$('.tool[data-act="cables"]').forEach((b) => b.classList.remove('on'));
  closeInfo();
  clearHighlights();
}

function selectPart(id, { fly = true } = {}) {
  const p = partById(id);
  if (!p) return;
  if (S.quiz) return quizPick(p);
  S.cableMode = null; S.cablePart = null; S.feature = null; S.focusSet = null;
  $$('.tool[data-act="cables"]').forEach((b) => b.classList.remove('on'));
  clearHighlights();
  S.selected = id;
  applyVisual();
  showPartInfo(p);
  if (fly) focusPart(p);
}

// Parçanın animasyon bittiğindeki sınır kutusu
function finalBox(p) {
  const asm = S.asm, n = Math.max(1, asm.layerCount);
  let k = 0;
  if (p.explode.lengthSq() > 0) {
    const i = asm.layerIndex.get(p.layer);
    const start = n > 1 ? (i / (n - 1)) * 0.7 : 0;
    k = ease(THREE.MathUtils.clamp((S.explodeTarget - start) / 0.3, 0, 1));
  }
  const old = p.obj.position.clone();
  p.obj.position.copy(p.base).addScaledVector(p.explode, k).addScaledVector(p.removeVec, p.removedTarget);
  p.obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(p.obj);
  p.obj.position.copy(old);
  p.obj.updateMatrixWorld(true);
  return box;
}
function focusPart(p, mul = 1, forceDir = null) {
  const box = finalBox(p);
  const ctr = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const dir = forceDir ? forceDir.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
  if (p.type === 'yanPanel' || p.type === 'camPanel') dir.set(-0.9, 0.35, 0.4).normalize();
  const dist = Math.max(14, size * 1.35 * mul + 6);
  flyTo(ctr.clone().addScaledVector(dir, dist).toArray(), ctr.toArray(), 0.9);
}

function deselect() {
  S.selected = null; S.cablePart = null; S.focusSet = null; S.feature = null; S.featureCenter = null;
  clearHighlights();
  applyVisual();
  closeInfo();
}

// ================================================================ Bilgi paneli
const info = $('#info');
function closeInfo() { info.classList.remove('open'); info.innerHTML = ''; }
function lvl(o) { return o ? (o[S.level] ?? o.k) : ''; }

const COMPARE_FOR = { hdd: 'depolama', ssd: 'depolama', m2: 'depolama', ram: 'bellek', ekranKarti: 'ekranKarti', disket: 'cikarilabilir', optik: 'cikarilabilir', islemci: 'islemci', psu: 'psu', anakart: 'arkaPanel' };

function showPartInfo(p, tab = 'ne') {
  const P = C.PARTS[p.type] || { name: p.id };
  const E = C.ERA_PART[S.era]?.[p.type] || C.ERA_PART[S.era]?.[p.type === 'camPanel' ? 'yanPanel' : p.type];
  const tabs = [['ne', 'Ne işe yarar?'], ['nereye', 'Nereye takılır?'], ['donem', 'Bu dönemde nasıldı?']];
  let body = '';
  if (tab === 'ne') body = lvl(P.ne);
  else if (tab === 'nereye') body = lvl(P.nereye);
  else body = E ? lvl(E) : 'Bu dönem için ek bilgi yok.';
  const btns = [];
  btns.push(`<button data-b="remove">${p.removedTarget ? '↩ Yerine tak' : '⤴ Çıkar'}</button>`);
  if (['hdd', 'ssd', 'm2', 'optik'].includes(p.type)) btns.push(`<button data-b="inside">${S.inside.has(p.id) ? 'Kapağı kapat' : '🔍 İçini göster'}</button>`);
  if (p.type === 'islemci') btns.push(`<button data-b="schema">🔍 İç yapısı (şema)</button>`);
  if (p.type === 'optik') btns.push(`<button data-b="tray">${S.trayTarget ? 'Tepsiyi kapat' : '⏏ Tepsiyi aç'}</button>`);
  if (p.type === 'disket') btns.push(`<button data-b="disk">${S.diskTarget ? 'Disketi tak' : '⏏ Disketi çıkar'}</button>`);
  if (S.asm.cables.some((c) => c.parts.includes(p.id)) && p.type !== 'kasa') btns.push(`<button data-b="cables">🔌 Kablolarını göster</button>`);
  if (p.type === 'anakart') btns.push(`<button data-b="features">Soketleri ve yuvaları göster</button>`);
  if (COMPARE_FOR[p.type]) btns.push(`<button data-b="compare">⇄ Eski–yeni karşılaştır</button>`);
  if (p.type === 'psu') btns.push(`<button data-b="power">⚡ Güç tüketimi</button>`);
  info.innerHTML = `
    <div class="ihead"><div><div class="ikind">Parça</div><h2>${P.name}</h2></div><button class="x" data-b="close" title="Kapat">✕</button></div>
    ${E?.spec ? `<div class="spec">${E.spec}</div>` : ''}
    <div class="tabs">${tabs.map(([k, n]) => `<button class="${k === tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
    <div class="ibody">${body}</div>
    <div class="ibtns">${btns.join('')}</div>`;
  info.classList.add('open');
  info.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => showPartInfo(p, b.dataset.tab));
  info.querySelectorAll('[data-b]').forEach((b) => b.onclick = () => partAction(p, b.dataset.b, tab));
}

function partAction(p, a, tab) {
  if (a === 'close') return deselect();
  if (a === 'remove') { p.removedTarget = p.removedTarget ? 0 : 1; focusPart(p, p.removedTarget ? 1.4 : 1); }
  if (a === 'inside') toggleInside(p);
  if (a === 'schema') openSchema();
  if (a === 'tray') S.trayTarget = S.trayTarget ? 0 : 1;
  if (a === 'disk') S.diskTarget = S.diskTarget ? 0 : 1;
  if (a === 'cables') {
    S.cablePart = p.id; S.selected = null; S.focusSet = [p.id];
    S.focusSet = [...new Set(S.asm.cables.filter((c) => c.parts.includes(p.id)).flatMap((c) => c.parts))].filter((x) => x !== 'kasa');
    S.explodeTarget = 0; $('#explode').value = 0;
    applyVisual();
    showCableLegend(S.asm.cables.filter((c) => c.parts.includes(p.id)), `${partName(p)}: bağlantıları`, p.type === 'hdd' ? 'Sabit disk İKİ kabloya ihtiyaç duyar: <b class="pw">güç</b> (güç kaynağından) ve <b class="dt">veri</b> (anakarttan).' : '');
    const v = S.asm.cameras.inside; flyTo(v.pos, v.target);
    S.openTarget = 1;
    return;
  }
  if (a === 'features') return openFeatureMenu();
  if (a === 'compare') return openCompare(COMPARE_FOR[p.type]);
  if (a === 'power') return togglePanel('powerPanel', renderPower);
  applyVisual();
  showPartInfo(p, tab);
}

function toggleInside(p) {
  if (S.inside.has(p.id)) { S.inside.delete(p.id); p.removedTarget = 0; }
  else {
    S.inside.add(p.id);
    if (p.type !== 'm2') p.removedTarget = 1;
  }
  applyVisual();
  focusPart(p, 0.85, S.inside.has(p.id) ? new THREE.Vector3(-0.45, 1.0, 0.65) : null);
}

// Port bilgisi
function portLocation(obj) {
  let o = obj;
  while (o) {
    if (o.userData.partType) {
      const t = o.userData.partType;
      if (t === 'ekranKarti') return 'Ekran kartının çıkışı';
      if (t === 'anakart') return 'Anakartın arka paneli';
      if (t === 'psu') return 'Güç kaynağı';
      if (t === 'kasa' || t === 'onPanel') return 'Kasanın ön paneli';
      if (t === 'sesKarti') return 'Ses kartı';
      if (t === 'modem') return 'Modem kartı';
      return C.PARTS[t]?.name || '';
    }
    o = o.parent;
  }
  return '';
}
function showPortInfo(obj) {
  const id = obj.userData.portId;
  const P = C.PORTS[id];
  if (!P) return;
  clearHighlights();
  addHighlight(new THREE.Box3().setFromObject(obj), '#36d6ff', 0.2);
  const loc = portLocation(obj);
  info.innerHTML = `
    <div class="ihead"><div><div class="ikind">Port / giriş · ${loc}</div><h2>${P.name}</h2></div><button class="x" data-b="close">✕</button></div>
    <h3>Ne işe yarar?</h3><div class="ibody">${S.level === 'k' ? P.k : P.t}</div>
    <h3>Bu dönemde nasıldı?</h3><div class="ibody">${P.donem}</div>
    ${loc === 'Anakartın arka paneli' && S.asm.gpu && ['hdmiMb', 'dpMb'].includes(id) ? '<div class="warn">Bu bilgisayarda ayrı ekran kartı var: monitör kablosunu ekran kartının çıkışlarına takın!</div>' : ''}`;
  info.classList.add('open');
  info.querySelector('[data-b="close"]').onclick = () => { clearHighlights(); closeInfo(); };
}

function showCableInfo(c) {
  const names = c.parts.map((id) => partById(id)).filter(Boolean).map(partName);
  info.innerHTML = `<div class="ihead"><div><div class="ikind">${c.kind === 'power' ? 'Güç kablosu' : 'Veri bağlantısı'}</div><h2>${c.label}</h2></div><button class="x" data-b="close">✕</button></div>
  <div class="ibody">${c.kind === 'power' ? 'Güç kaynağından elektrik taşır.' : 'Bilgiyi (veriyi) taşır.'} Bağladığı parçalar: <b>${names.join(' ↔ ')}</b>.</div>`;
  info.classList.add('open');
  info.querySelector('[data-b="close"]').onclick = closeInfo;
}

// ================================================================ Kablo modları
function showCables(kind) {
  if (S.cableMode === kind) { S.cableMode = null; $('#legend').classList.remove('open'); }
  else {
    S.cableMode = kind; S.cablePart = null; S.selected = null; S.feature = null; S.focusSet = null; closeInfo(); clearHighlights();
    S.explodeTarget = 0; $('#explode').value = 0;
    S.openTarget = 1;
    const list = S.asm.cables.filter((c) => c.kind === kind);
    let note = kind === 'power' ? 'Turuncu kablolar güç kaynağından parçalara elektrik taşır.' : 'Mavi bağlantılar parçalar arasında bilgi (veri) taşır.';
    if (kind === 'data' && S.asm.dataNote) note += ' ' + S.asm.dataNote;
    showCableLegend(list, kind === 'power' ? 'Güç kabloları' : 'Veri bağlantıları', note);
    if (kind === 'data') for (const id of S.asm.dataNoCable || []) { const p = partById(id); if (p) addHighlight(new THREE.Box3().setFromObject(p.obj), '#36d6ff', 0.3); }
    const v = S.asm.cameras.inside; flyTo(v.pos, v.target);
  }
  $$('.tool[data-act="cables"]').forEach((b) => b.classList.toggle('on', b.dataset.kind === S.cableMode));
  applyVisual();
}
function showCableLegend(list, title, note) {
  const lg = $('#legend');
  lg.innerHTML = `<div class="ihead"><h3>${title}</h3><button class="x">✕</button></div>${note ? `<p>${note}</p>` : ''}<ul>${list.map((c, i) => `<li data-i="${S.asm.cables.indexOf(c)}"><i class="${c.kind}"></i>${c.label}</li>`).join('')}</ul>`;
  lg.classList.add('open');
  lg.querySelector('.x').onclick = () => { lg.classList.remove('open'); S.cableMode = null; S.cablePart = null; S.focusSet = null; $$('.tool[data-act="cables"]').forEach((b) => b.classList.remove('on')); applyVisual(); };
  lg.querySelectorAll('li').forEach((li) => li.onclick = () => {
    const c = S.asm.cables[+li.dataset.i];
    const p = c.end;
    const dir = camera.position.clone().sub(controls.target).normalize();
    flyTo(p.clone().addScaledVector(dir, 28).toArray(), p.toArray(), 0.8);
  });
}

// ================================================================ Anakart soketleri
function openFeatureMenu() {
  const m = $('#featureMenu');
  m.innerHTML = `<div class="ihead"><h3>Anakart: soketler ve yuvalar</h3><button class="x">✕</button></div>` +
    ['cpuSocket', 'ramSlots', 'expSlots', 'storage', 'power', 'chipset', 'io'].map((k) => `<button data-f="${k}" class="${S.feature === k ? 'on' : ''}">${C.FEATURES[k].name}</button>`).join('');
  m.classList.add('open');
  m.querySelector('.x').onclick = () => { m.classList.remove('open'); clearFeature(); };
  m.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { showFeature(b.dataset.f); openFeatureMenu(); });
}
function clearFeature() { S.feature = null; S.featureCenter = null; clearHighlights(); applyVisual(); closeInfo(); }
function showFeature(key) {
  S.selected = null; S.cableMode = null; S.cablePart = null; S.focusSet = null;
  S.feature = key;
  clearHighlights();
  const groups = [];
  S.asm.board.traverse((o) => { if (o.userData.feature === key) groups.push(o); });
  const all = new THREE.Box3();
  for (const g of groups) {
    // gruptaki her alt parçayı ayrı vurgula
    const kids = g.children.filter((c) => c.isGroup || c.isMesh);
    const subs = kids.length > 1 && kids.length < 12 && key !== 'io' ? kids : [g];
    for (const s of subs) { const b = new THREE.Box3().setFromObject(s); if (!b.isEmpty()) { addHighlight(b, '#ffd166', 0.2); all.union(b); } }
  }
  S.featureCenter = all.isEmpty() ? null : all.getCenter(new THREE.Vector3());
  if (['cpuSocket', 'ramSlots', 'expSlots', 'storage', 'power', 'chipset'].includes(key)) { S.explodeTarget = 1; $('#explode').value = 100; }
  applyVisual();
  const F = C.FEATURES[key];
  info.innerHTML = `<div class="ihead"><div><div class="ikind">Anakart üzerinde</div><h2>${F.name}</h2></div><button class="x" data-b="close">✕</button></div>
    <div class="ibody">${S.level === 'k' ? F.k + '<br><br>' + (F.t[S.era] || '') : F.t[S.era] || F.k}</div>`;
  info.classList.add('open');
  info.querySelector('[data-b="close"]').onclick = () => { $('#featureMenu').classList.remove('open'); clearFeature(); };
  if (S.featureCenter) {
    const size = all.getSize(new THREE.Vector3()).length();
    const isTower = S.era !== '1990';
    const off = key === 'io' ? new THREE.Vector3(-0.25, 0.15, -1) : isTower ? new THREE.Vector3(-1, 0.25, 0.25) : new THREE.Vector3(0.1, 1, 0.5);
    flyTo(S.featureCenter.clone().addScaledVector(off.normalize(), Math.max(24, size * 1.2)).toArray(), S.featureCenter.toArray(), 1.0);
  }
}

// ================================================================ Görünümler
function setView(v) {
  let c = S.asm.cameras[v];
  if (!c) return;
  if (v === 'io' && S.asm.board?.userData.anchors.io) {
    // arka panel yakın çekim: I/O kümesinin dünya konumundan hesapla
    const t = S.asm.board.userData.anchors.io.getWorldPosition(new THREE.Vector3());
    const d = S.era === '1990' ? new THREE.Vector3(-0.15, 0.35, -1) : new THREE.Vector3(-0.42, 0.08, -1);
    c = { pos: t.clone().addScaledVector(d.normalize(), 34).toArray(), target: t.toArray() };
  }
  if (v === 'inside') S.openTarget = 1;
  flyTo(c.pos, c.target, 1.1);
  $$('.tool[data-act="view"]').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
}

// ================================================================ Güç paneli
function powerData() {
  const k = S.era === '2025' && S.opts[2025].variant === 'ofis' ? '2025ofis' : S.era;
  return C.POWER[k];
}
function renderPower() {
  const D = powerData();
  const st = D.states[S.powerState];
  const total = Object.values(st).reduce((a, b) => a + b, 0);
  const wall = Math.round(total / D.eff);
  const pct = (v) => (v / D.psu) * 100;
  const states = C.POWER_STATES.map(([k, n]) => `<button data-s="${k}" class="${k === S.powerState ? 'on' : ''}">${(D.labels && D.labels[k]) || n}</button>`).join('');
  const segs = C.POWER_COMP.filter(([k]) => st[k] > 0).map(([k, n, c]) => `<div class="seg" style="width:${pct(st[k])}%;background:${c}" title="${n}: ${st[k]} W"></div>`).join('');
  const legend = C.POWER_COMP.filter(([k]) => st[k] > 0).map(([k, n, c]) => `<span><i style="background:${c}"></i>${n}: ${st[k]} W</span>`).join('');
  $('#powerPanel').innerHTML = `
    <div class="ihead"><h3>⚡ Güç: kapasite ve tüketim · ${C.ERAS[S.era].name}</h3><button class="x">✕</button></div>
    ${S.era === '2025' ? `<div class="variant"><button data-v="ofis" class="${S.opts[2025].variant === 'ofis' ? 'on' : ''}">Ofis bilgisayarı</button><button data-v="oyun" class="${S.opts[2025].variant !== 'ofis' ? 'on' : ''}">Oyun bilgisayarı</button></div>` : ''}
    <div class="states">${states}</div>
    <div class="pbar-l">Güç kaynağının verebileceği en fazla güç: <b>${D.psu} W</b></div>
    <div class="pbar cap"><div style="width:100%"></div><span>${D.psu} W</span></div>
    <div class="pbar-l">Bilgisayarın şu an çektiği (tahmini): <b>${total} W</b> · kapasitenin %${Math.round(pct(total))}'i</div>
    <div class="pbar use">${segs}<span>${total} W</span></div>
    <div class="plegend">${legend}</div>
    <div class="pnote">Prizden çekilen ≈ <b>${wall} W</b> · ${D.effLabel}. ${D.note}</div>
    <div class="pnote small">Değerler temsilîdir ve tahminidir; gerçek ölçüm parçalara ve yazılıma göre değişir.</div>`;
  const pp = $('#powerPanel');
  pp.querySelector('.x').onclick = () => pp.classList.remove('open');
  pp.querySelectorAll('[data-s]').forEach((b) => b.onclick = () => { S.powerState = b.dataset.s; renderPower(); });
  pp.querySelectorAll('[data-v]').forEach((b) => b.onclick = () => { S.opts[2025].variant = b.dataset.v; setEra('2025', { keepCamera: true }); });
}

function togglePanel(id, render) {
  const el = $('#' + id);
  if (el.classList.contains('open')) el.classList.remove('open');
  else { render && render(); el.classList.add('open'); }
}

// ================================================================ CPU şeması
function openSchema() {
  const f = cpuSchemaFacts(S.era, S.level);
  $('#cpuModal').innerHTML = `<div class="mbox"><div class="ihead"><h3>İşlemcinin içi · ${f.title}</h3><button class="x">✕</button></div>
    <div class="schema">${cpuSchemaSVG(S.era, S.level)}</div>
    <table class="facts">${f.rows.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</table>
    <p class="small">Bu çizim öğretmek için sadeleştirilmiş bir şemadır; blokların boyutları ve yerleri gerçek yongayla aynı değildir.</p></div>`;
  $('#cpuModal').classList.add('open');
  $('#cpuModal .x').onclick = () => $('#cpuModal').classList.remove('open');
}

// ================================================================ Karşılaştırma
const cmpScene = new THREE.Scene();
cmpScene.background = new THREE.Color('#1a2029');
cmpScene.environment = envTex;
cmpScene.environmentIntensity = 0.8;
const cmpLights = makeLights(cmpScene);
cmpLights.key.shadow.camera.left = -40; cmpLights.key.shadow.camera.right = 40; cmpLights.key.shadow.camera.top = 40; cmpLights.key.shadow.camera.bottom = -40;
const cmpFloor = floor.clone();
cmpFloor.position.y = -0.2;
cmpScene.add(cmpFloor);
const cmpCam = new THREE.PerspectiveCamera(35, 1, 0.5, 1000);
let cmpModels = [];
let savedCam = null;

function openCompare(cat = 'depolama') {
  const def = C.COMPARE[cat];
  if (!S.compare) savedCam = { pos: camera.position.clone(), target: controls.target.clone() };
  S.compare = { cat, left: S.compare?.cat === cat ? S.compare.left : def.default[0], right: S.compare?.cat === cat ? S.compare.right : def.default[1] };
  buildCompare();
}
function buildCompare() {
  const { cat, left, right } = S.compare;
  const def = C.COMPARE[cat];
  for (const m of cmpModels) { cmpScene.remove(m); disposeTree(m); }
  cmpModels = [];
  const A = buildModel(def.items[left].model), B = buildModel(def.items[right].model);
  const wa = A.userData.box.getSize(new THREE.Vector3()), wb = B.userData.box.getSize(new THREE.Vector3());
  const gap = 4;
  A.position.x = -(wa.x / 2 + gap / 2) - (A.userData.box.getCenter(new THREE.Vector3()).x);
  B.position.x = wb.x / 2 + gap / 2 - (B.userData.box.getCenter(new THREE.Vector3()).x);
  A.position.z -= A.userData.box.getCenter(new THREE.Vector3()).z;
  B.position.z -= B.userData.box.getCenter(new THREE.Vector3()).z;
  const R = ruler(Math.max(wa.x + wb.x + gap + 4, 20));
  R.position.set(0, 0, Math.max(wa.z, wb.z) / 2 + 2.2);
  cmpScene.add(A, B, R);
  cmpModels = [A, B, R];
  const span = Math.max(wa.x + wb.x + gap, 14), hgt = Math.max(wa.y, wb.y, 4);
  const dist = Math.max(span, hgt * 2.2) * 1.25 + 8;
  cmpCam.position.set(0, hgt * 0.9 + dist * 0.42, dist);
  controls.target.set(0, hgt * 0.35, 0);
  controls.object = cmpCam;
  // tablo
  const rowsA = def.items[left].rows, rowsB = def.items[right].rows;
  const keys = [...new Set([...Object.keys(rowsA), ...Object.keys(rowsB)])];
  const lenA = A.userData.len, lenB = B.userData.len;
  let badge = '';
  if (lenA && lenB) {
    const r = lenB / lenA;
    badge = r > 1.15 ? `<span class="badge up">Uzunluk: ${lenA} → ${lenB} cm · BÜYÜDÜ</span>` : r < 0.87 ? `<span class="badge down">Uzunluk: ${lenA} → ${lenB} cm · KÜÇÜLDÜ</span>` : `<span class="badge same">Uzunluk: ${lenA} → ${lenB} cm · YAKLAŞIK AYNI</span>`;
  }
  const sel = (side, val) => `<select data-side="${side}">${Object.keys(def.items).map((e) => `<option value="${e}" ${e === val ? 'selected' : ''}>${C.ERAS[e].name}: ${def.items[e].title}</option>`).join('')}</select>`;
  $('#comparePanel').innerHTML = `
    <div class="ctop"><h3>⇄ Karşılaştır</h3><div class="cats">${Object.entries(C.COMPARE).map(([k, v]) => `<button data-c="${k}" class="${k === cat ? 'on' : ''}">${v.name}</button>`).join('')}</div><button class="closeBtn">✕ Kapat</button></div>
    <div class="cbottom">
      <div class="lesson">${def.lesson} ${badge}</div>
      <table class="ctable"><tr><th></th><th>${sel('left', left)}</th><th>${sel('right', right)}</th></tr>
      ${keys.map((k) => `<tr><th>${k}</th><td>${rowsA[k] || '—'}</td><td>${rowsB[k] || '—'}</td></tr>`).join('')}</table>
      <div class="small">Modeller aynı ölçekte; alttaki cetvel santimetre gösterir. Sürükleyerek döndürebilirsiniz.</div>
    </div>`;
  const cp = $('#comparePanel');
  cp.classList.add('open');
  document.body.classList.add('comparing');
  cp.querySelector('.closeBtn').onclick = closeCompare;
  cp.querySelectorAll('[data-c]').forEach((b) => b.onclick = () => openCompare(b.dataset.c));
  cp.querySelectorAll('select').forEach((s) => s.onchange = () => { S.compare[s.dataset.side] = s.value; buildCompare(); });
}
function closeCompare() {
  for (const m of cmpModels) { cmpScene.remove(m); disposeTree(m); }
  cmpModels = [];
  S.compare = null;
  controls.object = camera;
  if (savedCam) { camera.position.copy(savedCam.pos); controls.target.copy(savedCam.target); }
  $('#comparePanel').classList.remove('open');
  document.body.classList.remove('comparing');
}

// ================================================================ Buldurma oyunu
function startQuiz() {
  resetModes();
  const types = new Set(S.asm.parts.map((p) => p.type));
  const list = C.QUIZ.filter((q) => q.targets.some((t) => types.has(t)) && (!q.need || [].concat(q.need).some((t) => types.has(t))));
  S.quiz = { list, i: 0, score: 0, tries: 0 };
  S.explodeTarget = 0; $('#explode').value = 0;
  S.openTarget = 1;
  setView('inside');
  renderQuiz();
}
function renderQuiz(msg = '', cls = '') {
  const q = S.quiz.list[S.quiz.i];
  const bar = $('#quizBar');
  bar.innerHTML = q ? `<div class="qq">❓ ${q.q}</div><div class="qmsg ${cls}">${msg || 'Parçanın üzerine tıklayın.'}</div><div class="qscore">Puan: ${S.quiz.score} / ${S.quiz.list.length}</div><button data-q="next">Sonraki soru ▶</button><button data-q="end">Bitir</button>`
    : `<div class="qq">🎉 Bitti! Puan: ${S.quiz.score} / ${S.quiz.list.length}</div><button data-q="again">Yeniden başla</button><button data-q="end">Kapat</button>`;
  bar.classList.add('open');
  bar.querySelectorAll('[data-q]').forEach((b) => b.onclick = () => {
    const a = b.dataset.q;
    if (a === 'next') { S.quiz.i++; S.quiz.tries = 0; clearHighlights(); renderQuiz(); }
    if (a === 'again') startQuiz();
    if (a === 'end') { S.quiz = null; bar.classList.remove('open'); clearHighlights(); applyVisual(); }
  });
}
function quizPick(p) {
  const q = S.quiz.list[S.quiz.i];
  if (!q) return;
  clearHighlights();
  if (q.targets.includes(p.type)) {
    if (S.quiz.tries >= 0) S.quiz.score++;
    S.quiz.tries = -99;
    S.asm.parts.filter((x) => q.targets.includes(x.type)).forEach((x) => addHighlight(new THREE.Box3().setFromObject(x.obj), '#3ddc84'));
    renderQuiz(`✔ ${q.ok} (${partName(p)})`, 'ok');
  } else {
    S.quiz.tries++;
    addHighlight(new THREE.Box3().setFromObject(p.obj), '#ff5a5a');
    renderQuiz(`✘ Bu: ${partName(p)}. Tekrar dene!${S.quiz.tries >= 2 ? ' İpucu: ' + q.hint : ''}`, 'bad');
  }
}

// ================================================================ Kavramlar / dönem paneli / yardım
function renderConcepts() {
  $('#conceptsPanel').innerHTML = `<div class="ihead"><h3>💡 Doğru bilinmesi gereken kavramlar</h3><button class="x">✕</button></div>` +
    C.CONCEPTS.map((c, i) => `<div class="concept"><h4>${c.title}</h4><p>${S.level === 'k' ? c.k : c.t}</p>
      <div class="cbtns">${c.show ? `<button data-k="show" data-i="${i}">Bu bilgisayarda göster</button>` : ''}${c.compare ? `<button data-k="cmp" data-i="${i}">Karşılaştırmada gör</button>` : ''}${c.cables ? `<button data-k="cab">Sabit disk kablolarını göster</button>` : ''}${c.power ? `<button data-k="pow">Güç panelini aç</button>` : ''}</div></div>`).join('');
  const el = $('#conceptsPanel');
  el.querySelector('.x').onclick = () => el.classList.remove('open');
  el.querySelectorAll('[data-k]').forEach((b) => b.onclick = () => {
    const k = b.dataset.k, c = C.CONCEPTS[+b.dataset.i];
    el.classList.remove('open');
    if (k === 'show') showStorageTypes();
    if (k === 'cmp') openCompare(c.compare);
    if (k === 'cab') { const h = S.asm.parts.find((p) => p.type === 'hdd') || S.asm.parts.find((p) => p.type === 'ssd'); if (h) { selectPart(h.id, { fly: false }); partAction(h, 'cables'); } else { toast('Bu bilgisayarda sabit disk yok: M.2 SSD kablosuz takılır. Başka bir döneme geçin.'); } }
    if (k === 'pow') togglePanel('powerPanel', renderPower);
  });
}
function showStorageTypes() {
  resetModes();
  const perm = S.asm.parts.filter((p) => ['hdd', 'ssd', 'm2'].includes(p.type));
  const rem = S.asm.parts.filter((p) => ['disket', 'optik'].includes(p.type));
  S.focusSet = [...perm, ...rem].map((p) => p.id);
  perm.forEach((p) => addHighlight(new THREE.Box3().setFromObject(p.obj), '#3ddc84'));
  rem.forEach((p) => addHighlight(new THREE.Box3().setFromObject(p.obj), '#c792ff'));
  S.openTarget = 1;
  applyVisual();
  info.innerHTML = `<div class="ihead"><div><div class="ikind">Kavram</div><h2>Depolama türleri</h2></div><button class="x">✕</button></div>
   <div class="ibody"><p><b class="g">■ Kalıcı depolama</b> (yeşil): ${perm.map(partName).join(', ') || '—'} — bilgiler içeride kalır.</p>
   <p><b class="p">■ Çıkarılabilir ortam sürücüsü</b> (mor): ${rem.map(partName).join(', ') || 'bu bilgisayarda yok — 2025\'te USB bellek ve internet kullanılıyor'}.</p>
   <p>${rem.length ? 'İkisi aynı bilgisayarda BİRLİKTE bulunur; biri diğerinin yerine geçmez.' : ''}</p></div>`;
  info.classList.add('open');
  info.querySelector('.x').onclick = deselect;
  const v = S.asm.cameras.front; flyTo(v.pos, v.target);
}
function renderEraPanel() {
  const E = C.ERAS[S.era];
  $('#eraPanel').innerHTML = `<div class="ihead"><div><div class="ikind">${E.period}</div><h3>${E.name}: ${E.title}</h3></div><button class="x">✕</button></div>
    <p>${S.level === 'k' ? E.k : E.t}</p><ul>${E.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
    <p class="small">Temsilî sistem: o dönemin farkını anlatmak için seçilmiş tipik parçalar; kesin tarih değildir.</p>
    <details><summary>Kaynaklar ve notlar</summary><ul class="small">${C.SOURCES.map((s) => `<li>${s}</li>`).join('')}</ul></details>`;
  const el = $('#eraPanel');
  el.querySelector('.x').onclick = () => el.classList.remove('open');
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('on'), 3800);
}

// ================================================================ UI bağlama
function updateEraUI() {
  $$('#timeline .era').forEach((b) => b.classList.toggle('on', b.dataset.era === S.era));
  const E = C.ERAS[S.era];
  $('#eraBadge').innerHTML = `<b>${E.name}</b> · ${E.period}`;
  $('#variantBox').innerHTML = S.era === '2025'
    ? `<button data-o="variant" class="${S.opts[2025].variant === 'ofis' ? '' : 'on'}">${S.opts[2025].variant === 'ofis' ? 'Ofis bilgisayarı' : 'Oyun bilgisayarı'}</button>${S.opts[2025].variant !== 'ofis' ? `<button data-o="rgb" class="${S.opts[2025].rgb ? 'on' : ''}">RGB ışık: ${S.opts[2025].rgb ? 'açık' : 'kapalı'}</button>` : ''}`
    : S.era === '2000' ? `<button data-o="color">Kasa: ${S.opts[2000].caseColor === 'beige' ? 'bej' : 'siyah-gümüş'}</button>` : '';
  $$('#variantBox [data-o]').forEach((b) => b.onclick = () => {
    const o = b.dataset.o;
    if (o === 'variant') S.opts[2025].variant = S.opts[2025].variant === 'ofis' ? 'oyun' : 'ofis';
    if (o === 'rgb') S.opts[2025].rgb = !S.opts[2025].rgb;
    if (o === 'color') S.opts[2000].caseColor = S.opts[2000].caseColor === 'beige' ? 'black' : 'beige';
    setEra(S.era, { keepCamera: true });
  });
  $('#openBtn').textContent = S.openTarget ? 'Kasayı kapat' : 'Kasayı aç';
  const hasTray = S.asm.parts.some((p) => p.type === 'optik'), hasDisk = S.asm.parts.some((p) => p.type === 'disket');
  $('#trayBtn').style.display = hasTray ? '' : 'none';
  $('#diskBtn').style.display = hasDisk ? '' : 'none';
}

function tourStep(d) {
  const list = C.TOUR[S.era].filter((id) => partById(id));
  let i = list.indexOf(S.selected);
  i = i < 0 ? (d > 0 ? 0 : list.length - 1) : (i + d + list.length) % list.length;
  selectPart(list[i]);
}

function bindUI() {
  $$('#timeline .era').forEach((b) => b.onclick = () => { if (ERA_BUILDERS[b.dataset.era]) setEra(b.dataset.era); else toast('Bu dönem hazırlanıyor.'); });
  $('#explode').oninput = (e) => { S.explodeTarget = e.target.value / 100; if (S.explodeTarget > 0) { S.cableMode = null; S.cablePart = null; } applyVisual(); };
  $('#prevBtn').onclick = () => tourStep(-1);
  $('#nextBtn').onclick = () => tourStep(1);
  $('#openBtn').onclick = () => { S.openTarget = S.openTarget ? 0 : 1; updateEraUI(); };
  $('#trayBtn').onclick = () => { S.trayTarget = S.trayTarget ? 0 : 1; const p = S.asm.parts.find((x) => x.type === 'optik'); if (p) focusPartFront(p); };
  $('#diskBtn').onclick = () => { S.diskTarget = S.diskTarget ? 0 : 1; const p = S.asm.parts.find((x) => x.type === 'disket'); if (p) focusPartFront(p); };
  $$('.tool[data-act="view"]').forEach((b) => b.onclick = () => setView(b.dataset.v));
  $$('.tool[data-act="cables"]').forEach((b) => b.onclick = () => showCables(b.dataset.kind));
  $('#featBtn').onclick = () => openFeatureMenu();
  $('#powerBtn').onclick = () => togglePanel('powerPanel', renderPower);
  $('#cmpBtn').onclick = () => (S.compare ? closeCompare() : openCompare('depolama'));
  $('#quizBtn').onclick = () => (S.quiz ? (S.quiz = null, $('#quizBar').classList.remove('open'), applyVisual()) : startQuiz());
  $('#conceptBtn').onclick = () => togglePanel('conceptsPanel', renderConcepts);
  $('#eraBtn').onclick = () => togglePanel('eraPanel', renderEraPanel);
  $('#levelBtn').onclick = () => {
    S.level = S.level === 'k' ? 't' : 'k';
    $('#levelBtn').innerHTML = S.level === 'k' ? '👦 Çocuklar' : '🎓 Gençler (teknik)';
    const p = partById(S.selected); if (p) showPartInfo(p);
    if ($('#conceptsPanel').classList.contains('open')) renderConcepts();
    if ($('#eraPanel').classList.contains('open')) renderEraPanel();
    if (S.feature) showFeature(S.feature);
  };
  $('#labelBtn').onclick = () => { S.labels = !S.labels; $('#labelBtn').classList.toggle('on', S.labels); };
  $('#pauseBtn').onclick = () => { S.paused = !S.paused; $('#pauseBtn').innerHTML = S.paused ? '▶ Animasyon' : '⏸ Animasyon'; $('#pauseBtn').classList.toggle('on', !S.paused); };
  $('#qualBtn').onclick = () => { S.quality = S.quality === 'high' ? 'low' : 'high'; renderer.shadowMap.enabled = S.quality === 'high'; lights.key.castShadow = S.quality === 'high'; scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); $('#qualBtn').textContent = S.quality === 'high' ? 'Grafik: yüksek' : 'Grafik: düşük'; resize(); };
  $('#fsBtn').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
  $('#fontUp').onclick = () => setFont(1);
  $('#fontDown').onclick = () => setFont(-1);
  $('#helpBtn').onclick = () => $('#help').classList.toggle('open');
  $('#help').onclick = () => $('#help').classList.remove('open');

  // tıklama / seçme
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    pick(e.clientX, e.clientY);
  });
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    const k = e.key.toLowerCase();
    if (k === 'arrowright' || k === 'pagedown') tourStep(1);
    else if (k === 'arrowleft' || k === 'pageup') tourStep(-1);
    else if (k === ' ') { e.preventDefault(); $('#pauseBtn').click(); }
    else if (k === 'l') $('#labelBtn').click();
    else if (k === 'f') $('#fsBtn').click();
    else if (k === 'o') $('#openBtn').click();
    else if (k === 'escape') { if (S.compare) closeCompare(); else { deselect(); S.cableMode = null; applyVisual(); $$('.panel').forEach((p) => p.classList.remove('open')); } }
    else if (['1', '2', '3', '4'].includes(k)) { const era = C.ERA_KEYS[+k - 1]; if (ERA_BUILDERS[era]) setEra(era); }
  });
}
let fontStep = 0;
function setFont(d) { fontStep = Math.max(-2, Math.min(4, fontStep + d)); document.documentElement.style.setProperty('--fs', `${19 + fontStep * 2}px`); }

function focusPartFront(p) {
  const box = new THREE.Box3().setFromObject(p.obj);
  const c = box.getCenter(new THREE.Vector3());
  flyTo([c.x + 18, c.y + 10, c.z + 42], [c.x, c.y, c.z + 6], 0.9);
}

const ray = new THREE.Raycaster();
function pick(x, y) {
  const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  if (S.compare) return;
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObject(S.asm.root, true).filter((h) => {
    let o = h.object;
    while (o) { if (!o.visible) return false; o = o.parent; }
    const m = h.object.material;
    if (m && m.userData?.faded && !S.quiz) return false;
    if (m && m.alphaTest && h.uv && m.alphaMap) return true;
    return true;
  });
  if (!hits.length) { if (!S.quiz) deselect(); return; }
  const o = hits[0].object;
  // port mu?
  let a = o;
  while (a) {
    if (a.userData.portId && !S.quiz) return showPortInfo(a);
    if (a.userData.cable && !S.quiz) return showCableInfo(S.asm.cables.find((c) => c.obj === a));
    if (a.userData.partId) {
      if (a.userData.partId === 'kasa' && hits.length > 1 && (S.openTarget || S.explode > 0.3)) { /* kasa iç yüzü */ }
      return selectPart(a.userData.partId);
    }
    a = a.parent;
  }
}

// ================================================================ Döngü
const clock = new THREE.Timer();
const _tmp = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  clock.update(); const rdt = Math.min(clock.getDelta(), 0.5); const dt = Math.min(rdt, 0.1);
  S.time += dt; fpsN++; fpsT += rdt;
  autoQuality(rdt);
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += rdt / tw.dur;
    const k = ease(Math.min(1, tw.t));
    tw.fn(k);
    if (tw.t >= 1) { tweens.splice(i, 1); tw.done && tw.done(); }
  }
  if (S.asm && !S.compare) updateParts(dt);
  // vurgu nabzı
  const pulse = 0.12 + 0.1 * (0.5 + 0.5 * Math.sin(S.time * 5));
  for (const h of hlGroup.children) if (h.userData.pulse) h.material.opacity = pulse;
  controls.update();
  if (S.compare) {
    renderer.render(cmpScene, cmpCam);
  } else {
    renderer.render(scene, camera);
    updateLabels();
  }
}

// İlk saniyelerde kare hızı düşükse grafiği otomatik düşür (okul bilgisayarları için)
let aq = { t: 0, n: 0, done: false };
function autoQuality(rdt) {
  if (aq.done || !S.ready || document.hidden) return;
  aq.t += rdt; aq.n++;
  if (aq.t > 4) {
    aq.done = true;
    const fps = aq.n / aq.t;
    if (fps < 24 && S.quality === 'high' && !/HeadlessChrome/.test(navigator.userAgent)) { $('#qualBtn').click(); toast(`Akıcılık için grafik kalitesi düşürüldü (${fps.toFixed(0)} kare/sn). Üstteki "Grafik" düğmesiyle değiştirebilirsiniz.`); }
  }
}

let lastVisualExplode = -1;
function updateParts(dt) {
  const asm = S.asm;
  const lerp = (a, b, s) => a + (b - a) * Math.min(1, dt * s);
  S.explode = lerp(S.explode, S.explodeTarget, 4);
  if (Math.abs(S.explode - S.explodeTarget) < 0.001) S.explode = S.explodeTarget;
  S.open = lerp(S.open, S.openTarget, 3.5);
  S.tray = lerp(S.tray, S.trayTarget, 3);
  S.disk = lerp(S.disk, S.diskTarget, 3);
  const n = Math.max(1, asm.layerCount);
  for (const p of asm.parts) {
    p.removed = lerp(p.removed, p.removedTarget, 4);
    let k = 0;
    if (p.explode.lengthSq() > 0) {
      const i = asm.layerIndex.get(p.layer);
      const start = n > 1 ? (i / (n - 1)) * 0.7 : 0;
      k = ease(THREE.MathUtils.clamp((S.explode - start) / 0.3, 0, 1));
    }
    p.obj.position.copy(p.base).addScaledVector(p.explode, k).addScaledVector(p.removeVec, ease(p.removed));
    if (p.type === 'yanPanel' || p.type === 'camPanel') {
      const o = p.obj.userData.open;
      if (o) {
        const e = ease(S.open);
        const ph = (i) => THREE.MathUtils.clamp(e * 3 - i, 0, 1);
        p.obj.position.z += (o.slide || 0) * ph(0);
        p.obj.position.addScaledVector(o.dir, o.dist * ph(1));
        p.obj.position.y += (o.lift || 0) * ph(1);
        if (o.aside) { p.obj.position.x += o.aside[0] * ph(2); p.obj.position.y += o.aside[1] * ph(2); p.obj.position.z += o.aside[2] * ph(2); }
        p.obj.rotation.z = (o.tilt || 0) * ph(1);
      }
    }
  }
  // tepsi / disket
  for (const p of asm.parts) {
    if (p.type === 'optik') { const t = p.obj.getObjectByName('tray'); if (t) t.position.z = t.userData.openZ * ease(S.tray); }
    if (p.type === 'disket') { const d = p.obj.getObjectByName('disk'); if (d) { d.userData.z0 ??= d.position.z; d.position.z = d.userData.z0 + d.userData.ejectZ * ease(S.disk); } }
  }
  // kablolar: patlatmada gizle
  const ve = S.explode > 0.02 ? 1 : 0;
  const removedSig = asm.parts.map((p) => (p.removed > 0.02 ? 1 : 0)).join('');
  if (ve !== lastVisualExplode || removedSig !== asm._rs) { lastVisualExplode = ve; asm._rs = removedSig; applyVisual(); }
  if (!S.paused) {
    for (const o of animObjs.spin) {
      const ax = o.userData.spin.axis;
      o.rotation[ax] += o.userData.spin.speed * dt * (ax === 'z' ? -1 : 1);
    }
    for (const o of animObjs.swing) { const s = o.userData.swing; o.rotation.y = s.min + (s.max - s.min) * (0.5 + 0.5 * Math.sin(S.time * s.speed + Math.sin(S.time * 2.3))); }
    const optik = asm.parts.find((p) => p.type === 'optik');
    const reading = optik && S.inside.has(optik.id);
    for (const o of animObjs.discs) if (reading || S.tray < 0.01) o.rotation.y += dt * (reading ? 25 : 0);
    for (const o of animObjs.sled) { const s = o.userData.sled; o.position.z = s.base + (reading ? s.min + (s.max - s.min) * (0.5 + 0.5 * Math.sin(S.time * 0.8)) : 0); }
    for (const o of animObjs.laser) o.visible = !!reading;
    if (animObjs.rgbMats.size) {
      const c = new THREE.Color().setHSL((S.time * 0.06) % 1, 1.0, 0.45);
      for (const m of animObjs.rgbMats) { if (m.emissive) m.emissive.copy(c); m.color && m.userData.rgb && m.color.copy(c); }
    }
    for (const o of animObjs.leds) if (o.userData.led === 'hdd') o.material.emissiveIntensity = Math.random() < 0.15 ? 2.5 : 0.2;
  } else {
    for (const o of animObjs.laser) o.visible = false;
  }
}

// ================================================================ Başlat
resize();
bindUI();
setEra('2000');
requestAnimationFrame(frame);
setTimeout(() => $('#loading').classList.add('done'), 600);

let fpsN = 0, fpsT = 0;
Object.assign(window.APP, {
  settle: () => { for (const tw of tweens) { tw.fn(1); tw.done && tw.done(); } tweens.length = 0; S.explode = S.explodeTarget; S.open = S.openTarget; S.tray = S.trayTarget; S.disk = S.diskTarget; S.asm.parts.forEach((p) => (p.removed = p.removedTarget)); controls.update(); },
  fps: () => fpsN / Math.max(0.001, fpsT),
  frame: (id, dir = [-1, 0.4, 0.3], mul = 1) => {
    const p = partById(id); const box = new THREE.Box3().setFromObject(p.obj);
    const c = box.getCenter(new THREE.Vector3()); const d = Math.max(10, box.getSize(new THREE.Vector3()).length() * 1.2 * mul);
    const v = new THREE.Vector3(...dir).normalize();
    camera.position.copy(c).addScaledVector(v, d); controls.target.copy(c); controls.update();
  },
  labels: (v) => { S.labels = v; },
  setEra, setView, selectPart, deselect, showCables, openCompare, closeCompare, showFeature, startQuiz, openSchema, toggleInside: (id) => toggleInside(partById(id)),
  setExplode: (t) => { S.explodeTarget = t; $('#explode').value = t * 100; applyVisual(); },
  openCase: (v = true) => { S.openTarget = v ? 1 : 0; updateEraUI(); },
  power: () => togglePanel('powerPanel', renderPower), concepts: () => togglePanel('conceptsPanel', renderConcepts), eraPanel: () => togglePanel('eraPanel', renderEraPanel),
  camera, controls, scene, renderer, flyTo, partById, showPortInfo, showStorageTypes, partAction: (id, a) => partAction(partById(id), a, 'ne'),
  setLevel: (l) => { if (S.level !== l) $('#levelBtn').click(); },
});
