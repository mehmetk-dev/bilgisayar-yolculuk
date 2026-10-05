// Anakart oluşturucu. Yerel çerçeve: PCB XZ düzleminde, bileşen yüzü +Y.
// x: arka kenar boyunca (0..W), z: arka kenardan (0) öne (D). Arka I/O z<0 yönüne bakar.
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, rrectPath, arrayGeo, polyShape } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { pcbTex, chipTex, makeTex, rng } from '../textures.js';
import { makePort, ioShield } from './ports.js';

const PI = Math.PI;
export const PCB_T = 0.16;
const T = PCB_T;

function feature(parent, key) {
  const g = group(parent);
  g.userData.feature = key;
  g.userData.mergeRoot = true;
  return g;
}
function anchor(board, name, pos, rotY = 0) {
  const o = new THREE.Object3D();
  o.position.set(...pos);
  o.rotation.y = rotY;
  o.name = name;
  board.add(o);
  board.userData.anchors[name] = o;
  return o;
}

// ---------------------------------------------------------------- Yonga (QFP / BGA / DIP)
export function chip(parent, { x, z, w, d, h = 0.12, lines = ['IC'], kind = 'qfp', rot = 0, bg = '#1a1a1a', fg = '#bbbbbb', y = T }) {
  const g = group(parent, [x, y, z], [0, rot, 0]);
  const tex = chipTex(lines, { w: 256, h: Math.max(64, Math.round(256 * d / w)), bg, fg });
  add(g, G.box(w, h, d), M.epoxy, [0, h / 2, 0]);
  add(g, G.plane(w * 0.98, d * 0.98), texMat(tex, { rough: 0.55 }), [0, h + 0.002, 0], [-PI / 2, 0, 0], { cast: false });
  if (kind === 'qfp') {
    const n = Math.max(6, Math.round(w / 0.065));
    const legs = [];
    for (let i = 0; i < n; i++) {
      const t = (i - (n - 1) / 2) * (w * 0.9 / n);
      legs.push([t, 0.03, d / 2 + 0.05], [t, 0.03, -d / 2 - 0.05]);
    }
    const nz = Math.max(6, Math.round(d / 0.065));
    for (let i = 0; i < nz; i++) {
      const t = (i - (nz - 1) / 2) * (d * 0.9 / nz);
      legs.push([w / 2 + 0.05, 0.03, t, 0, PI / 2, 0], [-w / 2 - 0.05, 0.03, t, 0, PI / 2, 0]);
    }
    add(g, arrayGeo(G.box(0.025, 0.02, 0.12), legs), M.solder);
  } else if (kind === 'dip' || kind === 'tsop') {
    const pitch = kind === 'dip' ? 0.254 : 0.065;
    const n = Math.max(2, Math.floor(w / pitch));
    const legs = [];
    for (let i = 0; i < n; i++) {
      const t = (i - (n - 1) / 2) * pitch;
      legs.push([t, kind === 'dip' ? 0.02 : 0.02, d / 2 + 0.04], [t, 0.02, -d / 2 - 0.04]);
    }
    add(g, arrayGeo(G.box(kind === 'dip' ? 0.05 : 0.025, 0.03, 0.1), legs), M.solder);
  }
  return g;
}

// Elektrolitik kondansatörler
export function caps(parent, list, { r = 0.4, h = 1.1, sleeve = '#1f3a8a', solid = false } = {}) {
  const g = group(parent);
  const sleeveM = solid ? M.aluminum : mat(sleeve, 0.35, 0.1);
  add(g, arrayGeo(G.cyl(r, r, h, 18), list.map(([x, z, hh]) => [x, T + (hh || h) / 2, z, 0, 0, 0, 1, (hh || h) / h, 1])), sleeveM);
  if (!solid) {
    add(g, arrayGeo(G.cyl(r * 0.92, r * 0.92, 0.02, 18), list.map(([x, z, hh]) => [x, T + (hh || h) + 0.005, z])), M.capTop);
    add(g, arrayGeo(G.box(r * 0.12, 0.02, r * 1.6), list.map(([x, z, hh]) => [x, T + (hh || h) + 0.012, z])), mat('#777', 0.5, 0.6));
    add(g, arrayGeo(G.box(r * 0.3, h * 0.96, 0.02), list.map(([x, z, hh]) => [x - r * 0.55, T + (hh || h) / 2, z + r * 0.76, 0, -0.6, 0, 1, (hh || h) / h, 1])), mat('#d9d9d9', 0.4));
  } else {
    add(g, arrayGeo(G.cyl(r * 1.005, r * 1.005, h * 0.28, 18), list.map(([x, z]) => [x, T + h * 0.75, z])), mat(sleeve, 0.35));
  }
  return g;
}

// Bobinler (ferrit şok)
function chokes(parent, list, s = 0.9, h = 0.55) {
  const g = group(parent);
  add(g, arrayGeo(G.rbox(s, h, s, 0.06), list.map(([x, z]) => [x, T + h / 2, z])), M.ferrite);
  add(g, arrayGeo(G.box(s * 0.45, 0.01, s * 0.3), list.map(([x, z]) => [x, T + h + 0.005, z])), mat('#aaa', 0.5));
  return g;
}
// Toroid bobin (eski kartlar)
function toroids(parent, list) {
  const g = group(parent);
  add(g, arrayGeo(G.torus(0.55, 0.22, 10, 20), list.map(([x, z]) => [x, T + 0.65, z, 0, 0, 0])), mat('#3e4a3a', 0.6));
  add(g, arrayGeo(G.torus(0.55, 0.235, 6, 20), list.map(([x, z]) => [x, T + 0.65, z])), M.copper, null);
  return g;
}

// ---------------------------------------------------------------- Pin başlıkları (header)
function pinHeader(parent, { x, z, cols, rows = 1, rot = 0, color = '#111', shroud = false, keyed = true, pitch = 0.254 }) {
  const g = group(parent, [x, T, z], [0, rot, 0]);
  const L = cols * pitch + (shroud ? 0.5 : 0), W = rows * pitch + (shroud ? 0.4 : 0);
  if (shroud) {
    const s = rrectShape(L, W, 0.03);
    s.holes = [rrectPath(L - 0.2, W - 0.2, 0.02)];
    const m = add(g, extrude(s, 0.88), mat(color, 0.5), [0, 0.0, 0], [-PI / 2, 0, 0]);
    add(g, G.box(L - 0.1, 0.12, W - 0.1), mat(color, 0.5), [0, 0.06, 0]);
    if (keyed) add(g, G.box(0.45, 0.6, 0.12), mat('#050505', 0.8), [0, 0.5, W / 2 - 0.02]);
  } else {
    add(g, G.box(L, 0.25, W), mat(color, 0.5), [0, 0.125, 0]);
  }
  const pins = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pins.push([(i - (cols - 1) / 2) * pitch, 0.45, (j - (rows - 1) / 2) * pitch]);
  add(g, arrayGeo(G.box(0.064, 0.62, 0.064), pins), M.gold);
  return g;
}

// ATX güç konnektörü (Mini-Fit Jr. 4.2 mm)
function molexHeader(parent, { x, z, cols, rows = 2, rot = 0, color = '#f0eee6' }) {
  const p = 0.42;
  const g = group(parent, [x, T, z], [0, rot, 0]);
  const L = cols * p + 0.12, W = rows * p + 0.12;
  const s = rrectShape(L, W, 0.04);
  const holes = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) holes.push(rrectPath(0.33, 0.33, (i + j) % 2 ? 0.03 : 0.12, (i - (cols - 1) / 2) * p, (j - (rows - 1) / 2) * p));
  s.holes = holes;
  add(g, extrude(s, 1.0), mat(color, 0.5), [0, 1.3, 0], [PI / 2, 0, 0]);
  add(g, G.box(L, 0.3, W), mat(color, 0.5), [0, 0.15, 0]);
  add(g, G.box(L * 0.95, 0.02, W * 0.95), mat('#111', 0.8), [0, 0.5, 0]);
  // kilit tırnağı
  add(g, G.box(0.5, 0.45, 0.18), mat(color, 0.5), [0, 1.0, W / 2 + 0.08]);
  return g;
}

// SATA portu
function sataPort(parent, { x, z, rot = 0, color = '#c1272d', stacked = false, angle = false }) {
  const g = group(parent, [x, T, z], [0, rot, 0]);
  const n = stacked ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const y = i * 0.75;
    if (angle) {
      // yan bakan (dik açılı)
      add(g, G.box(1.1, 0.6, 0.85), mat(color, 0.45), [0, 0.3 + y, 0]);
      add(g, G.box(0.85, 0.22, 0.6), mat('#050505', 0.8), [0, 0.32 + y, -0.13]);
      add(g, G.box(0.18, 0.15, 0.6), mat(color, 0.45), [0.37, 0.24 + y, -0.13]);
    } else {
      add(g, G.box(1.1, 0.85, 0.6), mat(color, 0.45), [0, 0.42, 0]);
      add(g, G.box(0.85, 0.02, 0.22), mat('#050505', 0.8), [0, 0.86, 0.02]);
    }
  }
  return g;
}

// ---------------------------------------------------------------- CPU soketleri
function holeGridTex(key, { n = 37, bg = '#efe9d6', dot = '#2a2a2a', empty = 0.25, stagger = true, gold = false }) {
  return makeTex('hg|' + key, 512, 512, (g, w) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, w);
    const p = w / (n + 1);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const u = (i + 0.5) / n - 0.5, v = (j + 0.5) / n - 0.5;
      if (Math.abs(u) < empty && Math.abs(v) < empty) continue;
      if (stagger && (i + j) % 2) continue;
      g.fillStyle = dot;
      if (gold) { g.fillRect(p * (i + 1) - p * 0.3, p * (j + 1) - p * 0.3, p * 0.6, p * 0.6); }
      else { g.beginPath(); g.arc(p * (i + 1), p * (j + 1), p * 0.3, 0, 7); g.fill(); }
    }
  });
}

function socket(parent, cfg) {
  const f = feature(parent, 'cpuSocket');
  const { x, z } = cfg;
  const g = group(f, [x, T, z]);
  if (cfg.type === 's7') {
    add(g, G.box(5.4, 0.55, 5.6), M.creamPlastic, [0, 0.275, 0]);
    add(g, G.plane(5.0, 5.0), texMat(holeGridTex('s7', { n: 37, empty: 0.13 }), { rough: 0.6 }), [-0.1, 0.552, 0], [-PI / 2, 0, 0], { cast: false });
    add(g, G.box(0.5, 0.45, 5.6), M.creamPlastic, [2.75, 0.4, 0]);
    // kol (ZIF)
    add(g, G.cyl(0.07, 0.07, 5.8, 8), M.nickel, [3.05, 0.35, 0], [PI / 2, 0, 0]);
    add(g, G.cyl(0.07, 0.07, 1.4, 8), M.nickel, [3.05, 0.95, -2.9]);
    add(g, G.box(0.2, 0.3, 0.6), M.creamPlastic, [3.05, 1.6, -2.9]);
  } else if (cfg.type === 's478') {
    // tutucu çerçeve (soğutucu klipsleri için)
    const s = rrectShape(8.4, 7.4, 0.3); s.holes = [rrectPath(6.4, 6.8, 0.2)];
    add(g, extrude(s, 1.4), M.matteBlack, [0, 1.4, 0], [PI / 2, 0, 0]);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, G.box(0.9, 0.5, 0.5), M.matteBlack, [sx * 3.7, 1.55, sz * 3.2]);
    add(g, G.box(3.9, 0.45, 4.3), M.creamPlastic, [-0.2, 0.225, 0]);
    add(g, G.plane(3.5, 3.5), texMat(holeGridTex('s478', { n: 26, empty: 0.2, stagger: false }), { rough: 0.6 }), [-0.25, 0.452, 0.1], [-PI / 2, 0, 0], { cast: false });
    add(g, G.cyl(0.06, 0.06, 4.2, 8), M.nickel, [1.95, 0.3, 0], [PI / 2, 0, 0]);
    add(g, G.cyl(0.06, 0.06, 1.0, 8), M.nickel, [1.95, 0.75, -2.1]);
  } else if (cfg.type === 'lga1150') {
    add(g, G.box(4.6, 0.35, 4.6), M.matteBlack, [0, 0.175, 0]);
    add(g, G.plane(3.8, 3.8), texMat(holeGridTex('lga', { n: 40, bg: '#1d1d1d', dot: '#c9a24f', empty: 0.12, stagger: false, gold: true }), { rough: 0.4, metal: 0.6 }), [0, 0.352, 0], [-PI / 2, 0, 0], { cast: false });
    // yük plakası (kapalı, işlemcinin kenarlarına basar)
    const s = rrectShape(5.2, 5.3, 0.25); s.holes = [rrectPath(3.3, 3.3, 0.3, 0, 0)];
    add(g, extrude(s, 0.05), M.nickel, [0, 0.75, 0], [-PI / 2, 0, 0]);
    add(g, G.box(5.5, 0.35, 0.4), M.nickel, [0, 0.4, 2.8]);
    add(g, G.box(5.5, 0.35, 0.4), M.nickel, [0, 0.4, -2.8]);
    add(g, G.cyl(0.06, 0.06, 5.6, 8), M.nickel, [3.0, 0.45, 0], [PI / 2, 0, 0]);
    add(g, G.box(0.12, 0.12, 1.0), M.nickel, [3.0, 0.45, 3.2]);
  } else if (cfg.type === 'am5') {
    // AM5 tutucu braketler + yük plakası
    for (const sz of [-1, 1]) add(g, G.rbox(7.2, 1.0, 1.0, 0.15), M.matteBlack, [0, 0.5, sz * 4.4]);
    add(g, G.box(5.0, 0.35, 5.0), M.matteBlack, [0, 0.175, 0]);
    add(g, G.plane(4.0, 4.0), texMat(holeGridTex('am5', { n: 42, bg: '#1d1d1d', dot: '#c9a24f', empty: 0.1, stagger: false, gold: true }), { rough: 0.4, metal: 0.6 }), [0, 0.352, 0], [-PI / 2, 0, 0], { cast: false });
    const s = rrectShape(5.6, 5.6, 0.3); s.holes = [rrectPath(3.7, 4.2, 0.3)];
    add(g, extrude(s, 0.06), M.nickel, [0, 0.78, 0], [-PI / 2, 0, 0]);
    add(g, G.box(5.8, 0.3, 0.45), M.nickel, [0, 0.42, 2.95]);
    add(g, G.box(5.8, 0.3, 0.45), M.nickel, [0, 0.42, -2.95]);
    add(g, G.cyl(0.065, 0.065, 6.2, 8), M.nickel, [3.2, 0.45, 0], [PI / 2, 0, 0]);
    add(g, G.box(0.14, 0.14, 1.1), M.nickel, [3.2, 0.45, 3.5]);
  }
  return f;
}

// ---------------------------------------------------------------- RAM yuvası
export function ramSlot(parent, { x, z, type, color = '#222', latch = '#e6e6e6' }) {
  const g = group(parent, [x, T, z]);
  if (type === 'simm72') {
    // beyaz/krem SIMM yuvası + metal tutucular
    add(g, G.box(11.6, 0.95, 0.85), M.creamPlastic, [0, 0.475, 0]);
    add(g, G.box(10.4, 0.05, 0.16), mat('#0d0d0d', 0.8), [0, 0.952, 0]);
    for (const sx of [-1, 1]) {
      add(g, G.box(0.08, 1.4, 0.5), M.nickel, [sx * 5.65, 1.1, 0.15]);
      add(g, G.cyl(0.12, 0.12, 0.6, 10), M.creamPlastic, [sx * 5.3, 1.3, 0.0], [PI / 2, 0, 0]);
    }
  } else {
    const L = 13.9;
    add(g, G.box(L, 0.85, 0.72), mat(color, 0.45), [0, 0.425, 0]);
    add(g, G.box(12.9, 0.04, 0.14), mat('#0a0a0a', 0.8), [0, 0.852, 0]);
    // mandallar
    for (const sx of [-1, 1]) {
      add(g, G.box(0.55, 1.9, 0.72), mat(latch, 0.45), [sx * (L / 2 + 0.1), 0.95, 0], [0, 0, sx * 0.05]);
    }
    const key = { ddr: -1.05, sdram: -2.0, ddr3: -1.6, ddr4: -0.3, ddr5: -0.5 }[type] ?? 0;
    add(g, G.box(0.18, 0.2, 0.18), mat(color, 0.45), [key, 0.8, 0]);
  }
  return g;
}

// ---------------------------------------------------------------- Genişleme yuvaları
export function expSlot(parent, { x, z0, type, color }) {
  const g = group(parent, [x, T, z0]);
  const box = (L, W, H, c, z) => add(g, G.box(W, H, L), mat(c, 0.45), [0, H / 2, z + L / 2]);
  const groove = (L, z) => add(g, G.box(0.14, 0.03, L), mat('#060606', 0.8), [0, 0.0, z + L / 2]);
  if (type === 'isa') {
    box(8.4, 0.8, 1.0, '#151515', 0); groove(8.2, 0.1); g.children.at(-1).position.y = 1.0;
    box(5.0, 0.8, 1.0, '#151515', 8.75); groove(4.8, 8.85); g.children.at(-1).position.y = 1.0;
  } else if (type === 'pci') {
    box(5.6, 0.72, 0.95, color || '#f2f1ea', 0); groove(5.4, 0.1); g.children.at(-1).position.y = 0.95;
    box(2.75, 0.72, 0.95, color || '#f2f1ea', 5.85); groove(2.6, 5.9); g.children.at(-1).position.y = 0.95;
  } else if (type === 'agp') {
    box(7.3, 0.72, 0.95, '#6b3d1e', 0); groove(7.1, 0.1); g.children.at(-1).position.y = 0.95;
    add(g, G.box(0.72, 1.3, 0.6), mat('#6b3d1e', 0.45), [0, 0.65, 7.6]);
  } else if (type === 'pcie16' || type === 'pcie16armor') {
    box(1.15, 0.75, 1.1, color || '#1a1a1a', 0); groove(1.05, 0.05); g.children.at(-1).position.y = 1.1;
    box(7.15, 0.75, 1.1, color || '#1a1a1a', 1.3); groove(7.0, 1.37); g.children.at(-1).position.y = 1.1;
    add(g, G.box(0.75, 1.3, 0.55), mat(color || '#1a1a1a', 0.45), [0, 0.75, 8.75]);
    if (type === 'pcie16armor') {
      add(g, G.box(0.86, 0.95, 8.3), M.nickel, [0, 0.55, 4.2]);
      add(g, G.box(0.88, 0.04, 8.3), M.nickel, [0, 1.12, 4.2]);
    }
  } else if (type === 'pcie1') {
    box(0.75, 0.75, 1.1, color || '#1a1a1a', 0); box(1.8, 0.75, 1.1, color || '#1a1a1a', 0.85);
  }
  return g;
}

// ---------------------------------------------------------------- Soğutucu (yonga seti / VRM)
export function finSink(parent, { x, z, w, d, h, fins = 8, axis = 'x', color = M.aluminum, base = 0.25, y = T, rot = 0 }) {
  const g = group(parent, [x, y, z], [0, rot, 0]);
  add(g, G.box(w, base, d), color, [0, base / 2, 0]);
  const list = [];
  for (let i = 0; i < fins; i++) {
    const t = (i - (fins - 1) / 2) / fins;
    list.push(axis === 'x' ? [t * w, base + (h - base) / 2, 0] : [0, base + (h - base) / 2, t * d]);
  }
  const fg = axis === 'x' ? G.box(Math.min(0.12, w / fins * 0.45), h - base, d) : G.box(w, h - base, Math.min(0.12, d / fins * 0.45));
  add(g, arrayGeo(fg, list), color);
  return g;
}

// Blok soğutucu (modern VRM / yonga seti kapakları)
function armorSink(parent, { x, z, w, d, h, color, grooves = 6, axis = 'x', y = T }) {
  const g = group(parent, [x, y, z]);
  add(g, G.rbox(w, h, d, 0.15), color, [0, h / 2, 0]);
  const list = [];
  for (let i = 1; i < grooves; i++) {
    const t = i / grooves - 0.5;
    list.push(axis === 'x' ? [t * w, h + 0.002, 0] : [0, h + 0.002, t * d]);
  }
  add(g, arrayGeo(axis === 'x' ? G.box(0.08, 0.02, d * 0.9) : G.box(w * 0.9, 0.02, 0.08), list), M.matteBlack);
  return g;
}

// ---------------------------------------------------------------- Ana fonksiyon
export function buildBoard(cfg) {
  const W = cfg.W ?? 30.5, D = cfg.D ?? 24.4;
  const board = new THREE.Group();
  board.name = 'anakart';
  board.userData.anchors = {};
  board.userData.dims = { W, D };

  // --- PCB dokusu
  const labels = [
    { t: cfg.model, x: cfg.modelPos?.[0] ?? 3, y: cfg.modelPos?.[1] ?? 21.6, s: 0.55, b: true },
    ...(cfg.labels || []),
  ];
  const holes = (cfg.holes || [[1.0, 0.8], [1.0, 15.6], [1.0, 23.5], [12.6, 0.8], [13.6, 15.6], [13.6, 23.5], [29.6, 4.6], [29.6, 15.6], [29.6, 23.5]]);
  const tex = pcbTex('board|' + cfg.model, {
    w: W, h: D, ppc: cfg.ppc || 44, base: cfg.pcb.base, trace: cfg.pcb.trace, silk: cfg.pcb.silk || '#e9ecdf', seed: cfg.seed || 3,
    density: cfg.pcb.density ?? 1, labels, holes: holes.map(([x, z]) => ({ x, y: z, r: 0.17 })),
  });
  add(board, G.box(W, T, D), M.fr4Edge, [W / 2, T / 2, D / 2]);
  add(board, G.plane(W, D), texMat(tex, { rough: cfg.pcb.rough ?? 0.42, metal: 0.05 }), [W / 2, T + 0.003, D / 2], [-PI / 2, 0, 0], { cast: false });
  add(board, G.plane(W, D), mat(cfg.pcb.back || cfg.pcb.base, 0.6), [W / 2, -0.002, D / 2], [PI / 2, 0, 0], { cast: false });
  // vidalar
  add(board, arrayGeo(G.cyl(0.32, 0.32, 0.12, 14), holes.map(([x, z]) => [x, T + 0.06, z])), M.nickel);
  add(board, arrayGeo(G.box(0.4, 0.03, 0.08), holes.map(([x, z]) => [x, T + 0.125, z, 0, 0.7, 0])), mat('#333', 0.6));
  anchor(board, 'center', [W / 2, T, D / 2]);

  // --- CPU soketi
  const s = cfg.socket;
  socket(board, s);
  anchor(board, 'socket', [s.x, T, s.z]);

  // --- RAM yuvaları
  const rf = feature(board, 'ramSlots');
  cfg.ram.slots.forEach((sl, i) => {
    ramSlot(rf, { x: cfg.ram.x, z: sl.z, type: cfg.ram.type, color: sl.color, latch: cfg.ram.latch });
    anchor(board, 'ram' + i, [cfg.ram.x, T + (cfg.ram.type === 'simm72' ? 0.55 : 0.4), sl.z]);
  });

  // --- Genişleme yuvaları
  const ef = feature(board, 'expSlots');
  cfg.slots.forEach((sl, i) => {
    expSlot(ef, { x: sl.x, z0: sl.z0 ?? 4.6, type: sl.type, color: sl.color });
    anchor(board, 'slot' + i, [sl.x, T + 0.6, sl.z0 ?? 4.6]);
  });
  board.userData.slots = cfg.slots;

  // --- Depolama bağlantıları
  const sf = feature(board, 'storage');
  (cfg.ide || []).forEach((d, i) => {
    pinHeader(sf, { x: d.x, z: d.z, cols: 20, rows: 2, rot: d.rot ?? 0, color: d.color || '#1a1a1a', shroud: true });
    anchor(board, 'ide' + i, [d.x, T + 0.9, d.z], d.rot ?? 0);
  });
  if (cfg.floppy) {
    const d = cfg.floppy;
    pinHeader(sf, { x: d.x, z: d.z, cols: 17, rows: 2, rot: d.rot ?? 0, color: d.color || '#1a1a1a', shroud: true });
    anchor(board, 'fdd', [d.x, T + 0.9, d.z], d.rot ?? 0);
  }
  (cfg.sata || []).forEach((d, i) => {
    sataPort(sf, d);
    const a = anchor(board, 'sata' + i, [d.x, T + (d.angle ? 0.3 : 0.85), d.z + (d.angle ? 0.45 : 0)], 0);
    if (d.angle) a.userData.dir = new THREE.Vector3(0, 0, 1);
  });
  (cfg.m2 || []).forEach((d, i) => {
    const g = group(sf, [d.x, T, d.z]);
    add(g, G.box(2.2, 0.42, 0.55), M.blackPlastic, [0, 0.21, 0]);
    add(g, G.box(1.9, 0.08, 0.06), M.gold, [0, 0.25, -0.28]);
    add(g, G.cyl(0.25, 0.25, 0.3, 6), M.gold, [0, 0.15, d.len]);
    anchor(board, 'm2_' + i, [d.x, T + 0.25, d.z]);
  });

  // --- Güç konnektörleri
  const pf = feature(board, 'power');
  if (cfg.atx) {
    molexHeader(pf, { x: cfg.atx.x, z: cfg.atx.z, cols: cfg.atx.pins / 2, rows: 2, rot: cfg.atx.rot ?? 0, color: cfg.atx.color || '#f0eee6' });
    anchor(board, 'atx', [cfg.atx.x, T + 1.3, cfg.atx.z], cfg.atx.rot ?? 0);
  }
  (cfg.cpuPower || []).forEach((c, i) => {
    molexHeader(pf, { x: c.x, z: c.z, cols: c.pins / 2, rows: 2, rot: c.rot ?? 0, color: c.color || '#f0eee6' });
    anchor(board, 'cpupwr' + i, [c.x, T + 1.3, c.z], c.rot ?? 0);
  });
  if (cfg.atPower) {
    // AT tipi P8/P9 (bilgi amaçlı)
    pinHeader(pf, { x: cfg.atPower.x, z: cfg.atPower.z, cols: 12, rows: 1, color: '#f0eee6', pitch: 0.396 });
  }

  // --- Yonga seti
  const cf = feature(board, 'chipset');
  for (const c of cfg.chips || []) {
    if (c.sink === 'fin') {
      chip(cf, { ...c, lines: c.lines });
      finSink(cf, { x: c.x, z: c.z, w: c.sw || c.w + 0.6, d: c.sd || c.d + 0.6, h: c.sh || 1.4, fins: c.fins || 9, axis: c.axis || 'x', color: c.sinkColor || M.aluminum, y: T + 0.14 });
    } else if (c.sink === 'armor') {
      armorSink(cf, { x: c.x, z: c.z, w: c.sw, d: c.sd, h: c.sh || 0.8, color: c.sinkColor || M.gunmetal, axis: c.axis });
    } else {
      chip(cf, c);
    }
  }

  // --- VRM
  const vf = feature(board, 'vrm');
  if (cfg.vrm) {
    const v = cfg.vrm;
    if (v.chokes) chokes(vf, v.chokes, v.chokeSize || 0.9, v.chokeH || 0.55);
    if (v.toroids) toroids(vf, v.toroids);
    for (const hs of v.sinks || []) {
      if (hs.kind === 'armor') armorSink(vf, hs); else finSink(vf, hs);
    }
    if (v.mosfets) add(group(vf), arrayGeo(G.box(0.5, 0.12, 0.6), v.mosfets.map(([x, z]) => [x, T + 0.06, z])), M.epoxy);
  }

  // --- Kondansatörler
  const kf = feature(board, 'caps');
  for (const c of cfg.caps || []) caps(kf, c.list, c);

  // --- Diğer: pil, BIOS, başlıklar
  const of = feature(board, 'misc');
  if (cfg.battery) {
    const b = cfg.battery;
    add(of, G.cyl(1.1, 1.1, 0.2, 28), M.blackPlastic, [b.x, T + 0.1, b.z]);
    add(of, G.cyl(1.0, 1.0, 0.32, 28), M.nickel, [b.x, T + 0.3, b.z]);
    add(of, G.box(0.4, 0.5, 0.25), M.nickel, [b.x + 1.05, T + 0.3, b.z]);
    anchor(board, 'battery', [b.x, T + 0.5, b.z]);
  }
  if (cfg.bios) {
    const b = cfg.bios;
    if (b.kind === 'dip') {
      add(of, G.box(4.3, 0.35, 1.6), mat('#1a1a1a', 0.5), [b.x, T + 0.175, b.z]);
      chip(of, { x: b.x, z: b.z, w: 4.1, d: 1.45, h: 0.35, lines: ['BIOS'], kind: 'dip', y: T + 0.35 });
      add(of, G.plane(2.2, 1.2), texMat(makeTex('biosholo', 128, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); ['#9ef', '#fcf', '#ff9', '#9f9', '#9ef'].forEach((c, i) => gr.addColorStop(i / 4, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#333'; g.font = 'bold 20px sans-serif'; g.fillText('BIOS v1.03', 8, 38); }), { rough: 0.2, metal: 0.4 }), [b.x, T + 0.82, b.z], [-PI / 2, 0, 0], { cast: false });
    } else if (b.kind === 'plcc') {
      add(of, G.box(1.5, 0.3, 1.3), mat('#202020', 0.5), [b.x, T + 0.15, b.z]);
      chip(of, { x: b.x, z: b.z, w: 1.25, d: 1.05, h: 0.3, lines: ['BIOS', 'FWH'], kind: 'none', y: T + 0.2 });
    } else {
      chip(of, { x: b.x, z: b.z, w: 0.55, d: 0.5, h: 0.12, lines: ['25Q'], kind: 'dip' });
    }
  }
  for (const h of cfg.headers || []) pinHeader(of, h);
  for (const c of cfg.miscChips || []) chip(of, c);
  for (const c of cfg.extra || []) c(of, board);

  // --- Arka I/O
  if (cfg.io) {
    const io = buildIO(cfg.io);
    board.add(io);
    board.userData.ioShieldPos = io.userData.shieldPos;
    anchor(board, 'io', [cfg.io.x0 + 15.875 / 2, 2.2, cfg.io.z ?? -0.75]);
  }
  return board;
}

// Arka I/O kümesi (portlar + kalkan + isteğe bağlı kapak), anakart çerçevesinde
export function buildIO(cfgIO) {
  const io = new THREE.Group();
  io.userData.feature = 'io';
  io.userData.mergeRoot = true;
  const ioz = cfgIO.z ?? -0.75;
  const holesList = [];
  const x0 = cfgIO.x0;
  for (const col of cfgIO.cols) {
    let y = T + (col.y0 ?? 0.15);
    for (const it of col.items) {
      const p = makePort(it);
      const f = p.userData.foot;
      p.position.set(col.x, y + f.h / 2, ioz);
      io.add(p);
      holesList.push({ x: col.x - x0, y: y + f.h / 2 + 0.25, w: f.w + 0.08, h: f.h + 0.08 });
      y += f.h + (it.gap ?? 0.05);
    }
  }
  if (cfgIO.cover) {
    const c = cfgIO.cover;
    add(io, G.rbox(c.w, c.h, c.d, 0.3), c.mat || M.gunmetal, [c.x, T + c.h / 2, c.z]);
    if (c.stripe) add(io, G.box(c.w * 0.6, 0.06, c.d * 0.9), c.stripe, [c.x, T + c.h + 0.01, c.z]);
  }
  const sh = ioShield(15.875, 4.445, holesList, { color: cfgIO.shieldColor });
  sh.position.set(x0, -0.25, ioz - 0.06);
  io.add(sh);
  io.userData.shieldPos = [x0, -0.25, ioz];
  return io;
}

// Bir anakart için ortak SMD/yonga dağıtımı
export { chokes, toroids, pinHeader, molexHeader, sataPort, armorSink };
