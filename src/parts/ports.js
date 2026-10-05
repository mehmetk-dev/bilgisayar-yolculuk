// Arka/ön panel portları. Port çerçevesi: ağız -Z yönüne bakar, ön yüz z=0, gövde +Z'ye uzanır.
// Genişlik X, yükseklik Y. Ölçüler cm, gerçek konnektör ölçülerine yakın.
import * as THREE from 'three';
import { G, add, group, extrude, dShape, dPath, rrectShape, rrectPath, circlePath, polyShape, polyPath, arrayGeo } from '../geom.js';
import { M, mat, led, PC99 } from '../materials.js';
import { textTex } from '../textures.js';

const PI = Math.PI;
const holeMat = () => mat('#050505', 0.9);

function base(id, foot) {
  const g = new THREE.Group();
  g.userData.portId = id;
  g.userData.mergeRoot = true;
  g.userData.foot = foot; // I/O kalkanı için ayak izi {w,h}
  return g;
}

// Ön yüzü ve derinliği olan çerçeve (dış şekil - iç delik)
function shell(parent, outer, inner, depth, material, z = 0) {
  const s = outer;
  s.holes = [inner];
  const geo = extrude(s, depth, 0, 8);
  const m = add(parent, geo, material, [0, 0, z - depth + depth]);
  m.position.z = z;
  return m;
}

// ---------------------------------------------------------------- PS/2 (6 pinli mini-DIN)
export function ps2(color, id = 'ps2') {
  const g = base(id, { w: 1.45, h: 1.35 });
  const face = rrectShape(1.35, 1.3, 0.08);
  face.holes = [circlePath(0.52)];
  add(g, extrude(face, 0.06), M.steel, [0, 0, -0.06]);
  add(g, G.box(1.33, 1.28, 1.25), M.galvanized, [0, 0, 0.72]);
  // renkli yalıtkan
  const ins = add(g, G.cyl(0.5, 0.5, 0.6, 32), mat(color, 0.3), [0, 0, 0.35], [PI / 2, 0, 0]);
  // iç oyuk
  add(g, G.cyl(0.47, 0.47, 0.02, 28), mat(color, 0.3), [0, 0, 0.03], [PI / 2, 0, 0]);
  // pinler + kılavuz
  const pins = [[-0.17, 0.12], [0.17, 0.12], [-0.25, -0.08], [0.25, -0.08], [-0.1, -0.24], [0.1, -0.24]];
  add(g, arrayGeo(G.cyl(0.035, 0.035, 0.2, 6), pins.map(([x, y]) => [x, y, -0.02, PI / 2, 0, 0])), holeMat());
  add(g, G.box(0.16, 0.12, 0.1), holeMat(), [0, -0.02, 0.0]);
  return g;
}

// İki renkli birleşik PS/2 (2010'lar)
export function ps2combo(id = 'ps2combo') {
  const g = ps2(PC99.kb, id);
  // üst yarı yeşil (fare), alt yarı mor (klavye)
  add(g, new THREE.CircleGeometry(0.47, 24, 0, PI), mat(PC99.mouse, 0.3), [0, 0, 0.015], [0, PI, 0]);
  add(g, new THREE.CylinderGeometry(0.505, 0.505, 0.58, 32, 1, true, -PI / 2, PI), mat(PC99.mouse, 0.3), [0, 0, 0.34], [PI / 2, 0, 0]);
  return g;
}

// ---------------------------------------------------------------- D-sub
const DSUB = {
  de9: { top: 1.67, bot: 1.4, h: 0.83, fw: 3.1, fh: 1.25, sx: 1.25, rows: [5, 4], pitch: 0.277, rowGap: 0.284 },
  de15: { top: 1.67, bot: 1.4, h: 0.83, fw: 3.1, fh: 1.25, sx: 1.25, rows: [5, 5, 5], pitch: 0.229, rowGap: 0.2 },
  db25: { top: 3.85, bot: 3.55, h: 0.83, fw: 5.3, fh: 1.25, sx: 2.35, rows: [13, 12], pitch: 0.277, rowGap: 0.284 },
  da15: { top: 2.53, bot: 2.25, h: 0.83, fw: 3.9, fh: 1.25, sx: 1.67, rows: [8, 7], pitch: 0.277, rowGap: 0.284 },
};
export function dsub(kind, color, male, id) {
  const d = DSUB[kind];
  const g = base(id || kind, { w: d.fw + 0.1, h: d.fh + 0.1 });
  // flanş
  const fl = rrectShape(d.fw, d.fh, 0.1);
  fl.holes = [dPath(d.top + 0.02, d.bot + 0.02, d.h + 0.02, 0.1), circlePath(0.16, -d.sx, 0), circlePath(0.16, d.sx, 0)];
  add(g, extrude(fl, 0.05), M.nickel, [0, 0, 0]);
  // D kabuğu (dışarı taşar)
  const outer = dShape(d.top, d.bot, d.h, 0.1);
  outer.holes = [dPath(d.top - 0.08, d.bot - 0.08, d.h - 0.08, 0.08)];
  add(g, extrude(outer, 0.62), M.nickel, [0, 0, -0.62]);
  // yalıtkan
  const insDepth = male ? 0.12 : 0.55;
  add(g, extrude(dShape(d.top - 0.1, d.bot - 0.1, d.h - 0.1, 0.07), insDepth + 0.5), mat(color, 0.45), [0, 0, -insDepth + (male ? 0 : 0.02)]);
  // pin/delikler
  const pts = [];
  d.rows.forEach((n, r) => {
    const y = ((d.rows.length - 1) / 2 - r) * d.rowGap;
    for (let i = 0; i < n; i++) pts.push([(i - (n - 1) / 2) * d.pitch, y]);
  });
  if (male) {
    add(g, arrayGeo(G.cyl(0.05, 0.05, 0.42, 6), pts.map(([x, y]) => [x, y, -0.3, PI / 2, 0, 0])), M.gold);
  } else {
    add(g, arrayGeo(G.cyl(0.055, 0.055, 0.04, 6), pts.map(([x, y]) => [x, y, -insDepth + 0.0, PI / 2, 0, 0])), holeMat());
  }
  // altıgen vida dikmeleri
  for (const sx of [-d.sx, d.sx]) {
    add(g, G.cyl(0.24, 0.24, 0.5, 6), M.nickel, [sx, 0, -0.25], [PI / 2, 0, 0]);
    add(g, G.cyl(0.1, 0.1, 0.02, 12), holeMat(), [sx, 0, -0.505], [PI / 2, 0, 0]);
  }
  // arka gövde
  add(g, G.box(d.fw * 0.85, d.fh * 0.85, 1.0), mat(color, 0.5), [0, 0, 0.55]);
  return g;
}

// ---------------------------------------------------------------- USB-A
export function usbA(color = PC99.usb2, n = 2, id) {
  const sp = 0.78;
  const H = n * sp + 0.12;
  const g = base(id || 'usbA', { w: 1.5, h: H + 0.05 });
  for (let i = 0; i < n; i++) {
    const y = (i - (n - 1) / 2) * sp;
    const o = rrectShape(1.42, sp - 0.04, 0.03, 0, 0);
    o.holes = [rrectPath(1.22, 0.48, 0.03)];
    add(g, extrude(o, 1.0), M.nickel, [0, y, -0.02]);
    add(g, G.box(1.22, 0.48, 0.02), holeMat(), [0, y, 0.95]);
    // dil (tongue): yuvanın üst tarafında renkli plastik
    add(g, G.box(1.1, 0.24, 0.9), mat(color, 0.3), [0, y + 0.08, 0.5]);
    // kontaklar
    add(g, arrayGeo(G.box(0.1, 0.01, 0.4), [-0.36, -0.12, 0.12, 0.36].map((x) => [x, 0, 0])), M.gold, [0, y - 0.006, 0.35]);
    // yay tırnakları
    add(g, arrayGeo(G.box(0.1, 0.02, 0.2), [-0.35, 0.35].map((x) => [x, 0, 0])), M.nickel, [0, y - 0.23, 0.15]);
  }
  add(g, G.box(1.44, H, 0.4), M.galvanized, [0, 0, 1.2]);
  return g;
}

// ---------------------------------------------------------------- USB-C
export function usbC(id = 'usbC') {
  const g = base(id, { w: 1.1, h: 0.5 });
  const o = rrectShape(0.92, 0.34, 0.165);
  o.holes = [rrectPath(0.83, 0.25, 0.12)];
  add(g, extrude(o, 0.7), M.nickel, [0, 0, -0.05]);
  add(g, G.box(0.83, 0.25, 0.02), holeMat(), [0, 0, 0.6]);
  add(g, G.box(0.66, 0.07, 0.5), mat('#1a1a1a', 0.4), [0, 0, 0.32]);
  add(g, G.box(0.62, 0.075, 0.38), M.gold, [0, 0, 0.36], null, { scale: [1, 1, 1] });
  return g;
}

// ---------------------------------------------------------------- RJ45 (Ethernet)
export function rj45(id = 'rj45', { shield = true, leds = true } = {}) {
  const g = base(id, { w: 1.65, h: 1.45 });
  add(g, G.box(1.6, 1.38, 0.5), shield ? M.galvanized : M.blackPlastic, [0, 0, 1.75]);
  const face = rrectShape(1.6, 1.38, 0.04);
  const hole = polyPath([[-0.585, -0.42], [-0.585, 0.42], [0.585, 0.42], [0.585, -0.42], [0.2, -0.42], [0.2, -0.55], [-0.2, -0.55], [-0.2, -0.42]]);
  face.holes = [hole];
  add(g, extrude(face, 1.5), shield ? M.nickel : M.blackPlastic, [0, 0, -0.02]);
  add(g, G.box(1.17, 0.95, 0.05), mat('#141414', 0.7), [0, -0.05, 1.45]);
  add(g, arrayGeo(G.box(0.05, 0.02, 0.5), [...Array(8)].map((_, i) => [(i - 3.5) * 0.102, 0, 0, 0.5, 0, 0])), M.gold, [0, 0.33, 0.35]);
  if (leds) {
    add(g, G.box(0.22, 0.14, 0.04), led('#33ff55', 1.2), [-0.55, 0.55, -0.02]);
    add(g, G.box(0.22, 0.14, 0.04), led('#ffa31a', 1.2), [0.55, 0.55, -0.02]);
  }
  return g;
}

// RJ11 (telefon / modem)
export function rj11(id = 'rj11') {
  const g = base(id, { w: 1.3, h: 1.15 });
  add(g, G.box(1.25, 1.1, 0.4), M.matteBlack, [0, 0, 1.4]);
  const face = rrectShape(1.25, 1.1, 0.04);
  face.holes = [polyPath([[-0.48, -0.32], [-0.48, 0.34], [0.48, 0.34], [0.48, -0.32], [0.16, -0.32], [0.16, -0.44], [-0.16, -0.44], [-0.16, -0.32]])];
  add(g, extrude(face, 1.2), M.blackPlastic, [0, 0, -0.02]);
  add(g, G.box(0.96, 0.7, 0.05), mat('#0b0b0b', 0.8), [0, 0, 1.15]);
  add(g, arrayGeo(G.box(0.05, 0.02, 0.4), [...Array(4)].map((_, i) => [(i - 1.5) * 0.1, 0, 0, 0.5, 0, 0])), M.gold, [0, 0.24, 0.35]);
  return g;
}

// ---------------------------------------------------------------- 3.5 mm ses jakları (yığın)
export function audio(colors, id = 'audio', { housing = '#151515', pitch = 1.02 } = {}) {
  const n = colors.length;
  const g = base(id, { w: 1.2, h: n * pitch + 0.1 });
  add(g, G.box(1.12, n * pitch, 1.4), mat(housing, 0.5), [0, 0, 0.7]);
  colors.forEach((c, i) => {
    const y = ((n - 1) / 2 - i) * pitch;
    add(g, G.cyl(0.36, 0.38, 0.22, 28), mat(c, 0.35), [0, y, -0.1], [PI / 2, 0, 0]);
    add(g, G.torus(0.26, 0.05, 8, 24), mat(c, 0.4), [0, y, -0.21]);
    add(g, G.cyl(0.18, 0.18, 0.04, 20), holeMat(), [0, y, -0.2], [PI / 2, 0, 0]);
  });
  return g;
}

// ---------------------------------------------------------------- HDMI
function hdmiShape(w = 1.4, h = 0.455, c = 0.13) {
  return [[-w / 2, h / 2], [w / 2, h / 2], [w / 2, -h / 2 + c], [w / 2 - c * 1.6, -h / 2], [-w / 2 + c * 1.6, -h / 2], [-w / 2, -h / 2 + c]];
}
export function hdmi(id = 'hdmi') {
  const g = base(id, { w: 1.65, h: 0.75 });
  const o = polyShape(hdmiShape(1.55, 0.6, 0.17));
  o.holes = [polyPath(hdmiShape(1.4, 0.455, 0.13))];
  add(g, extrude(o, 1.1), M.nickel, [0, 0, -0.08]);
  add(g, G.box(1.4, 0.4, 0.02), holeMat(), [0, 0.02, 0.95]);
  add(g, G.box(1.08, 0.14, 0.8), mat('#151515', 0.4), [0, 0.04, 0.5]);
  add(g, G.box(1.02, 0.145, 0.6), M.gold, [0, 0.04, 0.6]);
  return g;
}

// ---------------------------------------------------------------- DisplayPort (tek köşesi pahlı)
function dpPts(w, h, c) {
  return [[-w / 2, h / 2], [w / 2, h / 2], [w / 2, -h / 2 + c], [w / 2 - c, -h / 2], [-w / 2, -h / 2]];
}
export function displayPort(id = 'dp') {
  const g = base(id, { w: 1.8, h: 0.75 });
  const o = polyShape(dpPts(1.75, 0.66, 0.24));
  o.holes = [polyPath(dpPts(1.61, 0.48, 0.2))];
  add(g, extrude(o, 1.1), M.nickel, [0, 0, -0.06]);
  add(g, G.box(1.6, 0.47, 0.02), holeMat(), [0, 0, 0.95]);
  add(g, G.box(1.2, 0.14, 0.8), mat('#151515', 0.4), [-0.05, 0.03, 0.5]);
  add(g, G.box(1.14, 0.145, 0.55), M.gold, [-0.05, 0.03, 0.6]);
  return g;
}

// ---------------------------------------------------------------- DVI
export function dvi(kind = 'I', id) {
  const g = base(id || (kind === 'I' ? 'dviI' : 'dviD'), { w: 4.0, h: 1.3 });
  const fl = rrectShape(3.95, 1.25, 0.1);
  fl.holes = [polyPath([[-1.85, 0.42], [1.85, 0.42], [1.85, -0.25], [1.67, -0.42], [-1.67, -0.42], [-1.85, -0.25]]), circlePath(0.16, -1.63, 0), circlePath(0.16, 1.63, 0)];
  add(g, extrude(fl, 0.05), M.nickel);
  const o = polyShape([[-1.85, 0.42], [1.85, 0.42], [1.85, -0.25], [1.67, -0.42], [-1.67, -0.42], [-1.85, -0.25]]);
  o.holes = [polyPath([[-1.78, 0.35], [1.78, 0.35], [1.78, -0.22], [1.62, -0.35], [-1.62, -0.35], [-1.78, -0.22]])];
  add(g, extrude(o, 0.4), M.nickel, [0, 0, -0.4]);
  add(g, G.box(3.5, 0.66, 1.0), mat(PC99.dvi, 0.4), [0, 0, 0.3]);
  // 3x8 delik + yassı toprak + (DVI-I) 4 analog
  const pts = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) pts.push([-1.25 + i * 0.19, 0.19 - r * 0.19, -0.205, PI / 2, 0, 0]);
  add(g, arrayGeo(G.box(0.08, 0.05, 0.02), pts.map(([x, y, z]) => [x, y, z])), holeMat());
  add(g, G.box(0.55, 0.06, 0.02), holeMat(), [1.05, 0, -0.205]);
  if (kind === 'I') add(g, arrayGeo(G.box(0.08, 0.08, 0.02), [[0.85, 0.15, 0], [1.25, 0.15, 0], [0.85, -0.15, 0], [1.25, -0.15, 0]]), holeMat(), [0, 0, -0.205]);
  for (const sx of [-1.63, 1.63]) {
    add(g, G.cyl(0.24, 0.24, 0.45, 6), M.nickel, [sx, 0, -0.22], [PI / 2, 0, 0]);
    add(g, G.cyl(0.1, 0.1, 0.02, 12), holeMat(), [sx, 0, -0.45], [PI / 2, 0, 0]);
  }
  return g;
}

// ---------------------------------------------------------------- S-Video (mini-DIN)
export function svideo(id = 'svideo') {
  const g = base(id, { w: 1.2, h: 1.2 });
  add(g, G.box(1.1, 1.1, 1.2), M.matteBlack, [0, 0, 0.6]);
  add(g, G.cyl(0.47, 0.47, 0.25, 28), M.galvanized, [0, 0, -0.1], [PI / 2, 0, 0]);
  add(g, G.cyl(0.4, 0.4, 0.26, 28), mat('#222', 0.6), [0, 0, -0.105], [PI / 2, 0, 0]);
  add(g, arrayGeo(G.cyl(0.04, 0.04, 0.02, 6), [[-0.16, 0.08], [0.16, 0.08], [-0.2, -0.12], [0.2, -0.12], [0, -0.2], [-0.07, 0.2], [0.07, 0.2]].map(([x, y]) => [x, y, -0.24, PI / 2, 0, 0])), holeMat());
  return g;
}

// ---------------------------------------------------------------- Optik S/PDIF
export function spdif(id = 'spdif') {
  const g = base(id, { w: 1.0, h: 1.0 });
  add(g, G.box(0.95, 0.95, 1.3), M.blackPlastic, [0, 0, 0.65]);
  add(g, G.box(0.55, 0.55, 0.05), mat('#2a2a2a', 0.3), [0, 0, -0.02]);
  add(g, G.box(0.3, 0.3, 0.02), led('#ff3a2a', 0.6), [0, 0, -0.03]);
  return g;
}

// ---------------------------------------------------------------- Wi-Fi anten soketi (RP-SMA)
export function sma(id = 'wifi') {
  const g = base(id, { w: 0.9, h: 0.9 });
  add(g, G.cyl(0.32, 0.32, 0.12, 6), M.gold, [0, 0, -0.06], [PI / 2, 0, 0]);
  add(g, G.cyl(0.3, 0.3, 0.75, 20), M.gold, [0, 0, -0.45], [PI / 2, 0, 0]);
  // diş çizgileri
  for (let i = 0; i < 6; i++) add(g, G.torus(0.3, 0.025, 4, 20), M.gold, [0, 0, -0.18 - i * 0.11]);
  add(g, G.cyl(0.14, 0.14, 0.02, 12), holeMat(), [0, 0, -0.83], [PI / 2, 0, 0]);
  add(g, G.cyl(0.035, 0.035, 0.2, 6), M.gold, [0, 0, -0.75], [PI / 2, 0, 0]);
  return g;
}

// ---------------------------------------------------------------- eSATA
export function esata(id = 'esata') {
  const g = base(id, { w: 1.45, h: 0.7 });
  const o = rrectShape(1.45, 0.62, 0.05);
  o.holes = [polyPath([[-0.6, 0.22], [0.6, 0.22], [0.6, -0.12], [0.5, -0.22], [-0.5, -0.22], [-0.6, -0.12]])];
  add(g, extrude(o, 1.1), M.nickel, [0, 0, -0.06]);
  add(g, G.box(1.2, 0.44, 0.02), holeMat(), [0, 0, 0.95]);
  add(g, G.box(1.0, 0.12, 0.7), mat('#b8262a', 0.4), [0, 0.04, 0.5]);
  return g;
}

// ---------------------------------------------------------------- Küçük düğme (BIOS geri yükleme / CMOS sıfırlama)
export function button(id = 'btnFlash', color = '#d8d8d8') {
  const g = base(id, { w: 0.9, h: 0.9 });
  add(g, G.box(0.8, 0.8, 1.0), M.blackPlastic, [0, 0, 0.5]);
  add(g, G.cyl(0.25, 0.25, 0.18, 20), mat(color, 0.35), [0, 0, -0.06], [PI / 2, 0, 0]);
  return g;
}

// ---------------------------------------------------------------- Güç kaynağı bağlantıları
export function iecInlet(id = 'iecC14', female = false) {
  const g = base(id, { w: 3.0, h: 2.3 });
  const outerPts = [[-1.4, -1.1], [1.4, -1.1], [1.4, 0.75], [1.05, 1.1], [-1.05, 1.1], [-1.4, 0.75]];
  const innerPts = [[-1.2, -0.9], [1.2, -0.9], [1.2, 0.55], [0.85, 0.9], [-0.85, 0.9], [-1.2, 0.55]];
  const o = polyShape(outerPts);
  o.holes = [polyPath(innerPts)];
  add(g, extrude(o, 0.25), M.blackPlastic, [0, 0, -0.2]);
  add(g, G.box(2.4, 1.8, 0.3), M.matteBlack, [0, 0, 0.65]);
  if (!female) {
    add(g, arrayGeo(G.box(0.15, 0.45, 0.8), [[-0.7, -0.05, 0], [0.7, -0.05, 0]]), M.nickel, [0, 0, 0.1]);
    add(g, G.box(0.45, 0.15, 0.8), M.nickel, [0, 0.45, 0.1]);
  } else {
    add(g, G.box(2.1, 1.4, 0.5), mat('#1c1c1c', 0.7), [0, 0, 0.3]);
    add(g, arrayGeo(G.box(0.12, 0.42, 0.03), [[-0.7, -0.05, 0], [0.7, -0.05, 0]]), holeMat(), [0, 0, 0.04]);
    add(g, G.box(0.42, 0.12, 0.03), holeMat(), [0, 0.42, 0.04]);
  }
  return g;
}
export function rocker(id = 'psuSwitch') {
  const g = base(id, { w: 1.6, h: 1.2 });
  add(g, G.rbox(1.5, 1.05, 0.5, 0.06), M.blackPlastic, [0, 0, 0.1]);
  add(g, G.rbox(1.15, 0.8, 0.3, 0.05), M.matteBlack, [0, 0, -0.18], [0, 0.18, 0]);
  add(g, G.plane(0.2, 0.06), mat('#eee', 0.5), [-0.25, 0, -0.335], [0, PI + 0.18, 0]);
  add(g, G.torus(0.09, 0.02, 6, 16), mat('#eee', 0.5), [0.25, 0, -0.31], [0, 0.18, 0]);
  return g;
}
export function voltSel(id = 'voltSel') {
  const g = base(id, { w: 1.6, h: 0.8 });
  add(g, G.box(1.5, 0.7, 0.4), M.blackPlastic, [0, 0, 0.15]);
  add(g, G.box(0.6, 0.35, 0.35), M.redPlastic, [-0.3, 0, -0.08]);
  add(g, G.plane(0.55, 0.22), new THREE.MeshBasicMaterial({ map: textTex('vs', '230V', { fg: '#fff', w: 128, h: 48, size: 0.7 }), transparent: true }), [-0.3, 0, -0.26], [0, PI, 0]);
  return g;
}

// ---------------------------------------------------------------- Port fabrikası
export function makePort(spec) {
  const t = spec.t;
  let g;
  switch (t) {
    case 'ps2kb': g = ps2(PC99.kb, 'ps2kb'); break;
    case 'ps2mouse': g = ps2(PC99.mouse, 'ps2mouse'); break;
    case 'ps2combo': g = ps2combo(); break;
    case 'serial': g = dsub('de9', PC99.serial, true, 'serial'); break;
    case 'parallel': g = dsub('db25', PC99.parallel, false, 'parallel'); break;
    case 'vga': g = dsub('de15', PC99.vga, false, 'vga'); break;
    case 'game': g = dsub('da15', PC99.game, false, 'game'); break;
    case 'usb2': g = usbA(spec.color || PC99.usb2, spec.n || 2, 'usb2'); break;
    case 'usb1': g = usbA(spec.color || '#1a1a1a', spec.n || 2, 'usb1'); break;
    case 'usb3': g = usbA(PC99.usb3, spec.n || 2, 'usb3'); break;
    case 'usb10': g = usbA(spec.color || PC99.usb10, spec.n || 2, 'usb10'); break;
    case 'usbc': g = usbC('usbc'); break;
    case 'rj45': g = rj45('rj45'); break;
    case 'rj45_25': g = rj45('rj45_25'); break;
    case 'rj11': g = rj11(spec.id || 'rj11'); break;
    case 'audio': g = audio(spec.colors, spec.id || 'audio', spec); break;
    case 'hdmi': g = hdmi(spec.id || 'hdmi'); break;
    case 'dp': g = displayPort(spec.id || 'dp'); break;
    case 'dviI': g = dvi('I', spec.id); break;
    case 'dviD': g = dvi('D', spec.id); break;
    case 'svideo': g = svideo(); break;
    case 'spdif': g = spdif(); break;
    case 'wifi': g = sma(); break;
    case 'esata': g = esata(); break;
    case 'btnFlash': g = button('btnFlash', '#d8d8d8'); break;
    case 'btnCmos': g = button('btnCmos', '#c03030'); break;
    case 'iecC14': g = iecInlet('iecC14'); break;
    case 'iecC13': g = iecInlet('iecC13', true); break;
    case 'psuSwitch': g = rocker(); break;
    case 'voltSel': g = voltSel(); break;
    default: throw new Error('port? ' + t);
  }
  if (spec.id) g.userData.portId = spec.id;
  return g;
}

// I/O kalkanı: deliklere göre kesilmiş çelik plaka (board çerçevesinde XY düzlemi, z=0)
export function ioShield(w, h, holes, { color = 'steel', labels = null } = {}) {
  const s = rrectShape(w, h, 0.05, w / 2, h / 2);
  s.holes = holes.map((hl) => rrectPath(hl.w, hl.h, 0.05, hl.x, hl.y));
  const geo = extrude(s, 0.05, 0, 4);
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  add(g, geo, color === 'black' ? M.blackSteel : M.steel, [0, 0, -0.05]);
  // kenar flanşı
  add(g, G.box(w + 0.3, 0.05, 0.3), color === 'black' ? M.blackSteel : M.steel, [w / 2, -0.02, 0.1]);
  add(g, G.box(w + 0.3, 0.05, 0.3), color === 'black' ? M.blackSteel : M.steel, [w / 2, h + 0.02, 0.1]);
  return g;
}
