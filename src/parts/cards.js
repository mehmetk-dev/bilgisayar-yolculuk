// Genişleme kartları. Kart çerçevesi: x braketten (0) öne (L), y PCB alt kenarından (0, kenar konnektörü altta) yukarı,
// bileşen yüzü +z. Anakart çerçevesine yerleştirmek için rotation.y = -PI/2.
import * as THREE from 'three';
import { G, add, group, extrude, polyShape, rrectShape, rrectPath, arrayGeo } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { pcbTex, chipTex, stickerTex, holeAlpha, makeTex } from '../textures.js';
import { makePort } from './ports.js';
import { chip, caps, finSink } from './board.js';
import { caseFan } from './fan.js';

const PI = Math.PI;
// Port çerçevesi -> braket çerçevesi (port X -> kart Y, port Y -> kart Z, port -Z -> kart -X)
const Q_PORT = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)));

// Kenar konnektörü segmentleri (x başlangıç, uzunluk) — slot z0 ile hizalanır
export const EDGE = {
  isa: [[0, 8.2], [8.75, 4.9]],
  pci: [[0, 5.5], [5.85, 2.65]],
  agp: [[0, 7.1]],
  pcie16: [[0, 1.1], [1.3, 7.05]],
};

function cardPCB(g, { L, H, color, segs, fx, key, labels = [], cutTop = null, density = 1 }) {
  const FD = 0.75;
  const pts = [[0.2, 0]];
  for (const [s, l] of segs) { pts.push([fx + s, 0], [fx + s, -FD], [fx + s + l, -FD], [fx + s + l, 0]); }
  pts.push([L, 0], [L, H - 0.6], [L - 0.6, H], [0.2, H]);
  const shape = polyShape(pts);
  const gold = segs.map(([s, l]) => ({ x: fx + s + 0.05, y: H + 0.08, w: l - 0.1, h: FD - 0.12, n: Math.round(l / 0.127 / 1.0) }));
  const tex = pcbTex('card|' + key, { w: L, h: H + FD, ppc: 40, base: color, trace: shade(color, 1.35), labels, gold, seed: key.length * 17, density });
  tex.repeat.set(1 / L, 1 / (H + FD));
  tex.offset.set(0, FD / (H + FD));
  const back = pcbTex('cardb|' + key, { w: L, h: H + FD, ppc: 24, base: shade(color, 0.85), trace: shade(color, 1.2), gold, seed: key.length * 29, density: density * 1.3 });
  back.repeat.set(1 / L, 1 / (H + FD));
  back.offset.set(0, FD / (H + FD));
  add(g, extrude(shape, 0.157, 0, 4), texMat(back, { rough: 0.45, metal: 0.05 }), [0, 0, -0.157]);
  add(g, new THREE.ShapeGeometry(shape), texMat(tex, { rough: 0.42, metal: 0.05 }), [0, 0, 0.002], null, { cast: false });
}

// Kart yüzeyine (+z) dik kondansatörler
function cardCaps(g, list, opts) {
  const cg = caps(g, list.map(([x, y]) => [x, -y]), opts);
  cg.rotation.x = PI / 2;
  cg.position.z = -0.16;
  return cg;
}

function shade(hex, k) {
  const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString();
}

// Braket: ports [{t, y, row}] ; rows: 1..3 slot genişliği
function bracket(g, { rows = 1, ports = [], vents = false, H = 12.0, black = false }) {
  const W = rows * 2.032 - 0.25;
  const bm = black ? M.blackSteel : M.steel;
  const portObjs = [];
  const holes = [];
  for (const p of ports) {
    const obj = makePort(p);
    const f = obj.userData.foot;
    const z = 0.95 + (p.row || 0) * 2.032 + (p.dz || 0);
    obj.quaternion.copy(Q_PORT);
    obj.position.set(-0.1, p.y, z);
    g.add(obj);
    portObjs.push(obj);
    holes.push(rrectPath(f.w * 0.92, f.h * 0.92, 0.05, p.y, z));
  }
  if (vents) {
    const feet = ports.map((p, i) => ({ y: p.y, z: 0.95 + (p.row || 0) * 2.032, w: portObjs[i].userData.foot.w / 2 + 0.35, h: portObjs[i].userData.foot.h / 2 + 0.35 }));
    for (let r = 0; r < rows; r++) for (let y = 0.4; y < 10.6; y += 0.5) {
      const z = 0.95 + r * 2.032;
      if (feet.some((f) => Math.abs(f.y - y) < f.w + 0.15 && Math.abs(f.z - z) < f.h + 0.7)) continue;
      holes.push(rrectPath(0.24, 1.3, 0.1, y, z));
    }
  }
  const s = rrectShape(H, W, 0.05, H / 2 - 0.9, W / 2 - 0.1);
  s.holes = holes;
  const plate = add(g, extrude(s, 0.08, 0, 4), bm, [0, 0, 0]);
  plate.quaternion.copy(Q_PORT);
  plate.position.set(-0.08, 0, 0);
  // üst kıvrım (vida tırnağı) ve alt dil
  add(g, G.box(1.0, 0.08, W), bm, [-0.55, H - 0.9, W / 2 - 0.1]);
  add(g, arrayGeo(G.cyl(0.25, 0.25, 0.18, 12), [...Array(rows)].map((_, i) => [-0.55, H - 0.8, 0.9 + i * 2.032])), M.nickel);
  add(g, G.box(0.08, 1.2, 0.5), bm, [-0.08, -1.4, 0.6]);
  return portObjs;
}

// ---------------------------------------------------------------- Ekran kartları
export function buildGPU(kind, { fx = 5.5, rgb = null } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  let info;
  if (kind === 'pci90') {
    const L = 17.5, H = 9.5;
    cardPCB(g, { L, H, color: '#1e5a33', segs: EDGE.pci, fx, key: 'pci90', labels: [{ t: 'VERTEKS GrafiX 64V  PCI  4MB', x: 4, y: 0.8, s: 0.45 }] });
    chip(g, { x: 8.0, z: 0, y: 4.6, w: 2.6, d: 2.6, lines: ['VERTEKS', 'V64-DX', '9634'], rot: 0 }).rotation.x = PI / 2;
    for (const [x, y] of [[4.0, 6.8], [4.0, 3.2], [12.0, 6.8], [12.0, 3.2]]) {
      const c = chip(g, { x, z: 0, y, w: 2.0, d: 0.8, lines: ['VRAM', '256Kx16'], kind: 'tsop' }); c.rotation.x = PI / 2;
    }
    const b = chip(g, { x: 14.6, z: 0, y: 6.0, w: 1.6, d: 0.9, lines: ['VGA BIOS'], kind: 'dip' }); b.rotation.x = PI / 2;
    const r = chip(g, { x: 6.0, z: 0, y: 1.6, w: 1.2, d: 1.2, lines: ['RAMDAC'], kind: 'qfp' }); r.rotation.x = PI / 2;
    add(g, G.box(0.8, 0.4, 0.4), M.nickel, [10.5, 2.0, 0.2]);
    bracket(g, { rows: 1, ports: [{ t: 'vga', y: 7.5 }], H: 12.0 });
    info = { L, H, thick: 1.6 };
  } else if (kind === 'agp00') {
    const L = 19.0, H = 10.3;
    cardPCB(g, { L, H, color: '#1b3f86', segs: EDGE.agp, fx, key: 'agp00', labels: [{ t: 'ORBİT R96 AGP 8X 128MB DDR', x: 7.5, y: 0.7, s: 0.42 }] });
    for (const [x, y] of [[5.0, 7.6], [5.0, 2.8], [14.4, 7.6], [14.4, 2.8]]) {
      const c = chip(g, { x, z: 0, y, w: 1.0, d: 2.2, lines: ['DDR', '8Mx16'], kind: 'tsop' }); c.rotation.x = PI / 2;
    }
    // GPU yongası + soğutucu + fan
    const hs = group(g, [9.7, 5.2, 0]);
    hs.rotation.x = PI / 2;
    add(hs, G.box(2.6, 0.2, 2.6), mat('#2b6e3b', 0.4), [0, 0.1, 0]);
    finSink(hs, { x: 0, z: 0, w: 6.2, d: 6.2, h: 1.1, fins: 14, axis: 'x', color: M.aluminum, y: 0.2 });
    const fan = caseFan(5.0, { depth: 0.9, blades: 9, frameless: true });
    fan.rotation.x = PI / 2; fan.position.set(0, 1.2, 0);
    hs.add(fan);
    add(hs, G.cyl(2.6, 2.6, 0.05, 32), M.smokeAcrylic, [0, 1.7, 0]);
    cardCaps(g, [[3.0, 5.0], [16.5, 5.0], [16.5, 7.5]], { r: 0.32, h: 0.9 });
    add(g, G.box(1.4, 0.8, 0.5), M.whitePlastic, [17.6, 9.3, 0.25]);
    bracket(g, { rows: 1, ports: [{ t: 'vga', y: 9.1 }, { t: 'svideo', y: 6.3 }, { t: 'dviI', y: 3.0 }], H: 12.0 });
    info = { L, H, thick: 2.0 };
  } else if (kind === 'pcie10') {
    const L = 24.1, H = 11.1;
    cardPCB(g, { L, H, color: '#16191c', segs: EDGE.pcie16, fx, key: 'pcie10', labels: [] });
    // soğutucu kanatçıkları
    const fins = [];
    for (let i = 0; i < 70; i++) fins.push([2.0 + i * 0.3, H / 2 - 0.1, 1.4]);
    add(g, arrayGeo(G.box(0.05, H - 1.6, 2.0), fins), M.aluminum);
    // ısı boruları
    for (const y of [3.0, 5.0, 7.0]) add(g, G.cyl(0.3, 0.3, 19, 10), M.copper, [12.0, y, 0.55], [0, 0, PI / 2]);
    // plastik davlumbaz
    const sh = rrectShape(L - 0.4, H - 0.2, 0.6, L / 2 + 0.2, H / 2);
    sh.holes = [new THREE.Path().absarc(7.4, H / 2, 4.4, 0, PI * 2, true), new THREE.Path().absarc(17.0, H / 2, 4.4, 0, PI * 2, true)];
    add(g, extrude(sh, 0.3, 0.05, 6), M.blackPlastic, [0, 0, 2.95]);
    add(g, G.box(L - 0.4, 0.3, 3.0), M.blackPlastic, [L / 2 + 0.2, H - 0.25, 1.75]);
    add(g, G.box(L - 0.4, 0.3, 3.0), M.blackPlastic, [L / 2 + 0.2, 0.25, 1.75]);
    add(g, G.box(L - 6, 0.04, 0.2), mat('#c42020', 0.4), [L / 2 + 2, H - 0.08, 2.8]);
    for (const fxp of [7.4, 17.0]) {
      const fan = caseFan(8.6, { depth: 1.2, blades: 11, frameless: true });
      fan.rotation.y = PI; fan.position.set(fxp, H / 2, 2.4);
      g.add(fan);
    }
    // 6+8 pin PCIe güç
    for (const [x, n] of [[19.8, 6], [21.6, 8]]) add(g, G.box(n * 0.21 + 0.2, 0.9, 0.95), M.matteBlack, [x, H + 0.45, 0.6]);
    add(g, G.box(L - 3, 0.05, 0.02), M.blackSteel, [L / 2, H / 2, -0.25]);
    bracket(g, { rows: 2, ports: [{ t: 'dviI', y: 7.9, row: 0 }, { t: 'dviD', y: 7.9, row: 1 }, { t: 'hdmi', y: 3.6, row: 0 }, { t: 'dp', y: 1.6, row: 0 }], H: 12.0, vents: true });
    info = { L, H, thick: 3.8, power: [20.7, H + 0.9, 0.6] };
  } else if (kind === 'pcie25') {
    const L = 30.4, H = 12.6;
    cardPCB(g, { L, H: H - 1.2, color: '#121416', segs: EDGE.pcie16, fx, key: 'pcie25', labels: [] });
    // arka plaka
    add(g, G.box(L - 0.4, H - 0.6, 0.12), M.anodizedBlack, [L / 2 + 0.2, H / 2 - 0.5, -0.45]);
    add(g, arrayGeo(G.box(2.4, 0.15, 0.03), [...Array(9)].map((_, i) => [4 + i * 2.9, 2.0 + (i % 3) * 0.6, 0])), M.aluminumDark, [0, 0, -0.52]);
    // büyük kanatçık bloğu
    const fins = [];
    for (let i = 0; i < 110; i++) fins.push([1.2 + i * 0.26, H / 2 - 0.3, 2.3]);
    add(g, arrayGeo(G.box(0.04, H - 1.4, 3.8), fins), M.aluminum);
    for (const y of [2.5, 4.2, 6.0, 7.8, 9.5]) add(g, G.cyl(0.32, 0.32, 27, 10), M.nickel, [15.2, y, 0.55], [0, 0, PI / 2]);
    // davlumbaz
    const sh = rrectShape(L - 0.2, H - 0.2, 0.8, L / 2 + 0.1, H / 2 - 0.4);
    sh.holes = [6.0, 15.4, 24.8].map((x) => new THREE.Path().absarc(x, H / 2 - 0.4, 4.55, 0, PI * 2, true));
    add(g, extrude(sh, 0.35, 0.08, 6), M.gunmetal, [0, 0, 4.85]);
    add(g, G.box(L - 0.4, 0.35, 4.3), M.gunmetal, [L / 2 + 0.2, H - 0.62, 2.95]);
    add(g, G.box(L - 0.4, 0.35, 4.3), M.gunmetal, [L / 2 + 0.2, -0.05, 2.95]);
    for (const x of [6.0, 15.4, 24.8]) {
      const fan = caseFan(9.2, { depth: 1.5, blades: 11, frameless: true });
      fan.rotation.y = PI; fan.position.set(x, H / 2 - 0.4, 4.25);
      g.add(fan);
    }
    // üst kenar ışık şeridi ve yazı
    const lt = add(g, G.box(12, 0.05, 0.6), rgb ? led(rgb, 1.0) : M.aluminumDark, [L / 2 + 3, H - 0.43, 4.2], null, { keep: !!rgb, cast: false });
    if (rgb) lt.userData.rgb = true;
    const nameTex = makeTex('gpuname', 512, 64, (c, w, h) => { c.fillStyle = '#2a2d31'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8dadd'; c.font = 'bold 40px "DejaVu Sans", Arial'; c.textBaseline = 'middle'; c.fillText('ORBİT  RX-7  12G', 12, h / 2); });
    add(g, G.plane(8, 1.0), texMat(nameTex, { rough: 0.5 }), [9, H - 0.44, 2.95], [-PI / 2, 0, 0], { cast: false });
    // 12V-2x6 (16-pin) güç
    add(g, G.box(1.95, 0.9, 0.85), M.matteBlack, [19.5, H - 0.5, 1.4]);
    bracket(g, { rows: 3, ports: [{ t: 'dp', y: 9.6, row: 0 }, { t: 'dp', y: 7.0, row: 0 }, { t: 'dp', y: 4.4, row: 0 }, { t: 'hdmi', y: 1.8, row: 0 }], H: 12.0, vents: true, black: true });
    info = { L, H, thick: 6.0, power: [19.5, H - 0.05, 1.4] };
  }
  g.userData.info = info;
  return g;
}

// ---------------------------------------------------------------- Ses kartı (ISA, 1990'lar)
export function buildSoundCard({ fx = 5.0 } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const L = 22.5, H = 10.0;
  cardPCB(g, { L, H, color: '#1e5a33', segs: EDGE.isa, fx, key: 'snd', labels: [{ t: 'KAPLAN SES-16  ISA', x: 6, y: 0.8, s: 0.5 }, { t: 'CD_IN', x: 16, y: 1.8, s: 0.3 }] });
  const r = (c) => { c.rotation.x = PI / 2; return c; };
  r(chip(g, { x: 9.0, z: 0, y: 5.5, w: 2.4, d: 2.4, lines: ['KPL-DSP', '16 bit', '9518'] }));
  r(chip(g, { x: 13.5, z: 0, y: 6.0, w: 3.6, d: 1.4, lines: ['FM SENTEZ', 'OPL-3'], kind: 'dip' }));
  r(chip(g, { x: 4.6, z: 0, y: 4.6, w: 1.6, d: 1.6, lines: ['CODEC'] }));
  r(chip(g, { x: 17.0, z: 0, y: 4.0, w: 2.2, d: 0.9, lines: ['AMP'], kind: 'dip' }));
  cardCaps(g, [[3.0, 2.0], [3.8, 2.0], [6.4, 7.5], [19.0, 6.5]], { r: 0.35, h: 1.0 });
  // CD ses başlığı ve atlama telleri
  add(g, G.box(1.0, 0.6, 0.6), M.whitePlastic, [16.5, 8.6, 0.3]);
  add(g, G.box(2.4, 0.5, 0.25), M.blackPlastic, [20.0, 8.6, 0.15]);
  bracket(g, { rows: 1, ports: [{ t: 'audio', colors: ['#7fb1dc'], id: 'lineIn', y: 9.3 }, { t: 'audio', colors: ['#e98fb3'], id: 'micIn', y: 8.1 }, { t: 'audio', colors: ['#9cc93a'], id: 'spkOut', y: 6.9 }, { t: 'game', y: 3.1 }], H: 12.0 });
  // ses ayar tekerleği
  add(g, G.cyl(0.65, 0.65, 0.35, 24), M.blackPlastic, [0.3, 5.3, 0.9], [0, 0, PI / 2]);
  g.userData.info = { L, H, thick: 1.5 };
  return g;
}

// ---------------------------------------------------------------- Modem (ISA, 1990'lar)
export function buildModem({ fx = 5.0 } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const L = 15.5, H = 9.0;
  cardPCB(g, { L, H, color: '#1e5a33', segs: [EDGE.isa[0]], fx, key: 'modem', labels: [{ t: 'KAPLAN FAX/MODEM 33.6', x: 5, y: 0.8, s: 0.45 }] });
  const r = (c) => { c.rotation.x = PI / 2; return c; };
  r(chip(g, { x: 8.0, z: 0, y: 5.0, w: 2.4, d: 2.4, lines: ['DATAPUMP', 'V.34'] }));
  r(chip(g, { x: 12.0, z: 0, y: 5.5, w: 1.6, d: 1.6, lines: ['UART', '16550'] }));
  // telefon hattı trafosu ve röle
  add(g, G.box(1.6, 1.4, 1.4), mat('#e3dccb', 0.5), [3.8, 6.2, 0.7]);
  add(g, G.box(1.2, 0.9, 1.0), M.blackPlastic, [3.6, 3.4, 0.5]);
  add(g, G.box(1.0, 0.8, 0.8), mat('#1d3f86', 0.4), [5.6, 3.4, 0.4]);
  bracket(g, { rows: 1, ports: [{ t: 'rj11', id: 'rj11line', y: 8.0 }, { t: 'rj11', id: 'rj11phone', y: 6.4 }], H: 12.0 });
  g.userData.info = { L, H, thick: 1.5 };
  return g;
}

// Boş slot kapağı (kasa arkası)
export function slotCover({ vented = true, black = false } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  bracket(g, { rows: 1, ports: [], vents: vented, black });
  return g;
}
