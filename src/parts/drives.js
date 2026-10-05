// Sürücüler. Yerel çerçeve: x genişlik (ortalı), y yükseklik (0 = alt), z derinlik: ön yüz +z, konnektörler -z.
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, rrectPath, circlePath, polyShape, arrayGeo } from '../geom.js';
import { M, mat, texMat, led, physMat } from '../materials.js';
import { pcbTex, chipTex, stickerTex, discTex, floppyLabelTex, textTex, makeTex, brushedTex } from '../textures.js';
import { chip } from './board.js';

const PI = Math.PI;

function anchorAt(g, name, pos, dir = [0, 0, -1]) {
  const o = new THREE.Object3D();
  o.position.set(...pos);
  o.userData.dir = new THREE.Vector3(...dir);
  o.name = name;
  g.add(o);
  g.userData.anchors = g.userData.anchors || {};
  g.userData.anchors[name] = o;
  return o;
}

// Arka konnektörler
function ideHeader(g, x, y, z, pins = 40) {
  const cols = pins / 2;
  const L = cols * 0.254 + 0.3;
  add(g, G.box(L, 0.75, 0.6), M.blackPlastic, [x, y, z + 0.3]);
  const list = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < 2; j++) list.push([x + (i - (cols - 1) / 2) * 0.254, y + (j - 0.5) * 0.254, z - 0.25]);
  add(g, arrayGeo(G.box(0.064, 0.064, 0.6), list), M.gold);
  return L;
}
function molexPower(g, x, y, z) {
  const s = polyShape([[-1.1, -0.38], [1.1, -0.38], [1.1, 0.2], [0.85, 0.38], [-0.85, 0.38], [-1.1, 0.2]]);
  add(g, extrude(s, 0.9), mat('#f2efe4', 0.5), [x, y, z - 0.4]);
  add(g, arrayGeo(G.cyl(0.08, 0.08, 0.7, 8), [-0.75, -0.25, 0.25, 0.75].map((d) => [x + d, y, z - 0.2, PI / 2, 0, 0])), M.nickel);
}
function bergPower(g, x, y, z) {
  add(g, G.box(1.0, 0.35, 0.5), mat('#f2efe4', 0.5), [x, y, z]);
  add(g, arrayGeo(G.box(0.05, 0.05, 0.5), [-0.375, -0.125, 0.125, 0.375].map((d) => [x + d, y, z - 0.15])), M.gold);
}
function sataConn(g, x, y, z, pins) {
  const w = pins === 7 ? 1.05 : 2.4;
  add(g, G.box(w + 0.2, 0.55, 0.6), M.blackPlastic, [x, y, z + 0.25]);
  add(g, G.box(w, 0.12, 0.5), M.blackPlastic, [x, y + 0.05, z - 0.2]);
  add(g, G.box(w - 0.1, 0.02, 0.45), M.gold, [x, y - 0.02, z - 0.2]);
  // L şekli
  add(g, G.box(0.15, 0.4, 0.5), M.blackPlastic, [x + w / 2 - 0.05, y - 0.08, z - 0.2]);
}

// ---------------------------------------------------------------- HDD 3,5"
export function buildHDD({ iface = 'sata', capacity = '160 GB', label = 'NOVATRON', rpm = '7200', model = 'NT-160S' } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const W = 10.16, H = 2.61, L = 14.7;
  // döküm alüminyum gövde
  const base = group(g); base.userData.mergeRoot = true;
  const bs = rrectShape(W, L, 0.35);
  bs.holes = [rrectPath(W - 0.7, L - 0.9, 0.3, 0, 0.1)];
  add(base, extrude(bs, 1.95), mat('#7c8186', 0.45, 0.7), [0, 0.5, 0], [-PI / 2, 0, 0]);
  add(base, G.box(W - 0.1, 0.25, L - 0.1), mat('#7c8186', 0.45, 0.7), [0, 0.62, 0]);
  // yan vida delikleri
  add(base, arrayGeo(G.cyl(0.18, 0.18, 0.02, 12), [[-W / 2 - 0.005, 1.4, 4.5, 0, 0, PI / 2], [-W / 2 - 0.005, 1.4, -1.5, 0, 0, PI / 2], [-W / 2 - 0.005, 1.4, -5.5, 0, 0, PI / 2], [W / 2 + 0.005, 1.4, 4.5, 0, 0, PI / 2], [W / 2 + 0.005, 1.4, -1.5, 0, 0, PI / 2], [W / 2 + 0.005, 1.4, -5.5, 0, 0, PI / 2]]), mat('#111', 0.8));
  // alt devre kartı
  const pcb = pcbTex('hddpcb', { w: 9.4, h: 12.5, ppc: 40, base: '#1f5a32', density: 1.2 });
  add(base, G.box(9.4, 0.16, 12.5), texMat(pcb, { rough: 0.45 }), [0, 0.38, -0.8]);
  add(base, G.box(9.8, 0.3, L - 0.2), mat('#7c8186', 0.45, 0.7), [0, 0.15, 0]);
  // arka konnektörler
  if (iface === 'ide') {
    ideHeader(base, -1.6, 0.85, -L / 2, 40);
    add(base, arrayGeo(G.box(0.064, 0.064, 0.4), [...Array(8)].map((_, i) => [1.4 + (i % 4) * 0.254, 0.73 + Math.floor(i / 4) * 0.254, -L / 2 - 0.1])), M.gold);
    add(base, G.box(0.5, 0.25, 0.3), M.blackPlastic, [1.6, 0.86, -L / 2 - 0.2]);
    molexPower(base, 3.6, 0.85, -L / 2);
    anchorAt(g, 'data', [-1.6, 0.85, -L / 2 - 0.5]);
    anchorAt(g, 'power', [3.6, 0.85, -L / 2 - 0.5]);
  } else {
    sataConn(base, -2.6, 0.75, -L / 2, 7);
    sataConn(base, 0.2, 0.75, -L / 2, 15);
    anchorAt(g, 'data', [-2.6, 0.75, -L / 2 - 0.5]);
    anchorAt(g, 'power', [0.2, 0.75, -L / 2 - 0.5]);
  }

  // iç düzen
  const inside = group(g, [0, 0, 0], null, 'inside');
  inside.userData.keep = true;
  const spZ = 2.0;
  const platters = group(inside, [0, 0, spZ], null, 'platters');
  platters.userData.spin = { axis: 'y', speed: 18 };
  for (let i = 0; i < 2; i++) {
    add(platters, G.cyl(4.75, 4.75, 0.08, 72), M.platter, [0, 1.15 + i * 0.5, 0], null, { keep: true });
    add(platters, G.ring(1.3, 4.7, 64), mat('#c9d6e4', 0.03, 1.0), [0, 1.19 + i * 0.5 + 0.001, 0], [-PI / 2, 0, 0], { keep: true });
  }
  add(platters, G.cyl(1.25, 1.25, 1.3, 32), M.nickel, [0, 1.4, 0], null, { keep: true });
  add(platters, G.cyl(1.0, 1.0, 0.1, 32), M.chrome, [0, 2.1, 0], null, { keep: true });
  add(platters, arrayGeo(G.cyl(0.12, 0.12, 0.1, 8), [...Array(6)].map((_, i) => [Math.cos(i * PI / 3) * 0.7, 2.15, Math.sin(i * PI / 3) * 0.7])), mat('#222', 0.6), [0, 0, 0], null, { keep: true });
  // okuma/yazma kafası kolu
  const pivot = group(inside, [3.3, 0, -4.4], null, 'actuator');
  pivot.userData.swing = { min: -0.05, max: 0.42, speed: 1.6 };
  add(pivot, G.cyl(0.7, 0.7, 1.4, 24), M.aluminum, [0, 1.35, 0], null, { keep: true });
  for (let i = 0; i < 3; i++) {
    const arm = polyShape([[0, -0.5], [0, 0.5], [5.4, 0.12], [5.6, -0.12]]);
    const m = add(pivot, extrude(arm, 0.08), mat('#5d636b', 0.35, 0.9), [0, 1.05 + i * 0.5, 0], [PI / 2, 0, 0], { keep: true });
    m.rotation.z = 2.42;
  }
  // kafa (slider)
  const headPos = new THREE.Vector3(Math.cos(2.42) * 5.5, 0, Math.sin(2.42) * 5.5);
  for (let i = 0; i < 2; i++) add(pivot, G.box(0.3, 0.12, 0.35), mat('#c8a24a', 0.3, 0.8), [headPos.x, 1.24 + i * 0.5, headPos.z], null, { keep: true });
  // bobin kolu ve mıknatıs
  add(pivot, extrude(polyShape([[0, -0.6], [-2.0, -1.2], [-2.0, 1.2], [0, 0.6]]), 0.3), M.copper, [0, 1.25, 0], [PI / 2, 0, 2.42], { keep: true });
  add(inside, G.box(3.6, 0.35, 2.4), M.magnet, [3.0, 1.75, -5.9], null, { keep: true });
  add(inside, G.box(3.6, 0.25, 2.4), M.magnet, [3.0, 0.82, -5.9], null, { keep: true });
  // park rampası
  add(inside, G.box(0.6, 1.2, 1.0), M.blackPlastic, [4.3, 1.4, -0.5], null, { keep: true });

  // üst kapak + etiket
  const cover = group(g, [0, 0, 0], null, 'cover');
  cover.userData.mergeRoot = true;
  cover.userData.isCover = true;
  const cv = add(cover, G.box(W - 0.1, 0.1, L - 0.1), mat('#b9bdc1', 0.32, 0.9), [0, H - 0.05, 0]);
  cv.material = cv.material.clone(); cv.material.roughnessMap = brushedTex('hdd', { circular: true }); cv.material.userData.shared = true;
  add(cover, G.cyl(1.3, 1.3, 0.12, 32), mat('#a9adb1', 0.3, 0.9), [0, H, spZ]);
  const lbl = stickerTex('hdd' + capacity, { w: 512, h: 512, title: label, sub: capacity, accent: '#1d3f7a', lines: [`MODEL ${model}`, `${rpm} RPM  ${iface.toUpperCase()}`, '+5V 0.7A  +12V 0.6A', 'GARANTİ ETİKETİ', 'SÖKMEYİN'], warn: true });
  add(cover, G.plane(8.4, 7.5), texMat(lbl, { rough: 0.55 }), [0, H + 0.003, -3.0], [-PI / 2, 0, 0], { cast: false });
  add(cover, arrayGeo(G.cyl(0.18, 0.18, 0.06, 6), [[-4.5, 0, 6.8], [4.5, 0, 6.8], [-4.5, 0, -6.8], [4.5, 0, -6.8], [0, 0, spZ], [3.3, 0, -4.4]]), M.nickel, [0, H + 0.02, 0]);
  g.userData.dims = { W, H, L };
  return g;
}

// ---------------------------------------------------------------- SSD 2,5"
export function buildSSD25({ label = 'NOVATRON', capacity = '250 GB' } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const W = 6.985, H = 0.7, L = 10.0;
  add(g, G.rbox(W, 0.3, L, 0.1), M.aluminumDark, [0, 0.15, 0]);
  // iç kart
  const inside = group(g, [0, 0, 0], null, 'inside');
  inside.userData.mergeRoot = true;
  const pcb = pcbTex('ssdpcb', { w: 6.4, h: 7.0, ppc: 48, base: '#141e2a', trace: '#284058' });
  add(inside, G.box(6.4, 0.1, 7.0), texMat(pcb, { rough: 0.45 }), [0, 0.35, -1.2]);
  chip(inside, { x: -1.5, z: -3.0, y: 0.4, w: 1.4, d: 1.4, lines: ['DENETLEYİCİ', 'NV-S3'] });
  chip(inside, { x: 1.6, z: -3.0, y: 0.4, w: 1.2, d: 0.9, lines: ['DRAM', 'ÖNBELLEK'], kind: 'none' });
  chip(inside, { x: -1.5, z: 0.6, y: 0.4, w: 1.4, d: 1.8, lines: ['NAND', '128GB'], kind: 'tsop' });
  chip(inside, { x: 1.6, z: 0.6, y: 0.4, w: 1.4, d: 1.8, lines: ['NAND', '128GB'], kind: 'tsop' });
  sataConn(g, -1.9, 0.35, -L / 2 + 0.1, 7);
  sataConn(g, 1.0, 0.35, -L / 2 + 0.1, 15);
  anchorAt(g, 'data', [-1.9, 0.35, -L / 2 - 0.4]);
  anchorAt(g, 'power', [1.0, 0.35, -L / 2 - 0.4]);
  const cover = group(g, [0, 0, 0], null, 'cover');
  cover.userData.mergeRoot = true;
  cover.userData.isCover = true;
  add(cover, G.rbox(W, 0.4, L - 0.6, 0.1), M.anodizedBlack, [0, 0.5, 0.3]);
  const lbl = stickerTex('ssd' + capacity, { w: 512, h: 640, bg: '#202226', fg: '#e6e6e6', title: label + ' SSD', sub: capacity, accent: '#c43a2a', lines: ['SATA 6 Gb/s', 'Okuma: ~550 MB/s', 'Yazma: ~520 MB/s', 'Hareketli parça YOK'] });
  add(cover, G.plane(6.2, 7.8), texMat(lbl, { rough: 0.5 }), [0, 0.703, 0.4], [-PI / 2, 0, 0], { cast: false });
  g.userData.dims = { W, H, L };
  return g;
}

// ---------------------------------------------------------------- M.2 2280 NVMe (anakart çerçevesinde düz: z boyu)
export function buildM2({ capacity = '2 TB', heatsink = true } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const pcb = pcbTex('m2', { w: 2.2, h: 8.0, ppc: 80, base: '#111416', trace: '#253038', density: 0.6, fingers: { y: 0, h: 0.35, n: 67, from: 0.1, to: 2.1, gaps: [2.2 - 0.45] } });
  add(g, G.box(2.2, 0.08, 8.0), texMat(pcb, { rough: 0.45 }), [0, 0.04, 4.0]);
  const chips = group(g, [0, 0, 0], null, 'inside');
  chips.userData.mergeRoot = true;
  chip(chips, { x: 0, z: 1.4, y: 0.08, w: 1.4, d: 1.4, lines: ['NV-E26', 'PCIe 4.0'] });
  chip(chips, { x: 0, z: 3.1, y: 0.08, w: 1.2, d: 0.9, lines: ['DRAM'], kind: 'none' });
  chip(chips, { x: 0, z: 4.9, y: 0.08, w: 1.4, d: 1.6, lines: ['3D NAND', '1 TB'], kind: 'none' });
  chip(chips, { x: 0, z: 6.7, y: 0.08, w: 1.4, d: 1.6, lines: ['3D NAND', '1 TB'], kind: 'none' });
  // yarım daire vida çentiği + vida
  add(g, G.cyl(0.28, 0.28, 0.12, 12), M.nickel, [0, 0.1, 8.0]);
  if (heatsink) {
    const cover = group(g, [0, 0, 0], null, 'cover');
    cover.userData.mergeRoot = true;
    cover.userData.isCover = true;
    add(cover, G.rbox(2.6, 0.55, 8.6, 0.12), M.gunmetal, [0, 0.6, 4.0]);
    add(cover, arrayGeo(G.box(2.4, 0.05, 0.08), [...Array(12)].map((_, i) => [0, 0.9, 0.6 + i * 0.62])), M.matteBlack);
    add(cover, G.box(2.3, 0.12, 8.1), mat('#7a8c99', 0.8), [0, 0.28, 4.0]);
  } else {
    const lbl = stickerTex('m2lbl', { w: 128, h: 448, title: 'NVMe', sub: '', accent: '#202020', lines: [capacity], barcode: false });
    add(g, G.plane(1.9, 6.5), texMat(lbl), [0, 0.25, 4.6], [-PI / 2, 0, 0], { cast: false });
  }
  g.userData.dims = { W: 2.2, H: 0.3, L: 8.0 };
  return g;
}

// ---------------------------------------------------------------- 3,5" Disket sürücüsü
export function buildFloppy({ bezel = '#d8cfb4', black = false } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const W = 10.16, H = 2.54, L = 14.0;
  const bm = mat(bezel, 0.55);
  add(g, G.box(W - 0.1, H - 0.1, L - 0.6), M.galvanized, [0, H / 2, -0.3]);
  // ön çerçeve
  const s = rrectShape(W, H, 0.12);
  s.holes = [rrectPath(9.3, 0.45, 0.08, -0.1, 0.35)];
  add(g, extrude(s, 0.6), bm, [0, H / 2, L / 2 - 0.6]);
  add(g, G.box(9.3, 0.45, 0.05), mat('#1b1b1b', 0.6), [-0.1, H / 2 + 0.35, L / 2 - 0.25]);
  add(g, G.box(9.2, 0.42, 0.06), bm, [-0.1, H / 2 + 0.35, L / 2 - 0.12], [-0.25, 0, 0]);
  add(g, G.rbox(1.2, 0.5, 0.25, 0.08), bm, [3.5, H / 2 - 0.65, L / 2 + 0.05]);
  add(g, G.box(0.35, 0.18, 0.08), led('#2fe05a', 0.0), [-3.6, H / 2 - 0.65, L / 2 + 0.02]);
  add(g, G.plane(2.0, 0.35), new THREE.MeshBasicMaterial({ map: textTex('fdd', '1.44 MB', { fg: black ? '#bbb' : '#555', w: 256, h: 48 }), transparent: true }), [-1.0, H / 2 - 0.65, L / 2 + 0.003], null, { cast: false });
  // arka konnektörler (34-pin + küçük güç)
  ideHeader(g, -1.5, 0.9, -L / 2 + 0.2, 34);
  bergPower(g, 3.4, 0.9, -L / 2 + 0.1);
  anchorAt(g, 'data', [-1.5, 0.9, -L / 2 - 0.3]);
  anchorAt(g, 'power', [3.4, 0.9, -L / 2 - 0.3]);
  // disket (çıkarılabilir)
  const disk = group(g, [-0.1, H / 2 + 0.35, L / 2 - 9.1], null, 'disk');
  disk.userData.keep = true;
  add(disk, G.rbox(9.0, 0.33, 9.4, 0.08), mat('#1e2a44', 0.5), [0, 0, 0], null, { keep: true });
  add(disk, G.box(1.9, 0.345, 3.0), M.aluminum, [-1.5, 0, 3.2], null, { keep: true });
  add(disk, G.plane(6.5, 4.8), texMat(floppyLabelTex()), [0.6, 0.168, -1.4], [-PI / 2, 0, 0], { keep: true, cast: false });
  disk.userData.ejectZ = 7.5;
  g.userData.dims = { W, H, L };
  return g;
}

// ---------------------------------------------------------------- 5,25" Optik sürücü
export function buildOptical({ kind = 'dvd', bezel = '#d8cfb4', iface = 'ide', legacy = false } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const W = 14.6, H = 4.13, L = 18.0;
  const bm = mat(bezel, 0.5);
  const dark = new THREE.Color(bezel).getHSL({}).l < 0.3;
  // gövde
  const body = group(g); body.userData.mergeRoot = true;
  add(body, G.box(W, 0.08, L - 1.2), M.galvanized, [0, 0.04, -0.6]);
  add(body, G.box(0.08, H - 0.1, L - 1.2), M.galvanized, [-W / 2 + 0.04, H / 2, -0.6]);
  add(body, G.box(0.08, H - 0.1, L - 1.2), M.galvanized, [W / 2 - 0.04, H / 2, -0.6]);
  add(body, G.box(W, H - 0.1, 0.08), M.galvanized, [0, H / 2, -L / 2 + 0.04]);
  add(body, G.box(W - 1, 0.5, L - 2), mat('#1a3d26', 0.5), [0, 0.35, -1.0]);
  // ön panel
  const fs = rrectShape(W + 0.2, H + 0.1, 0.1);
  fs.holes = [rrectPath(12.8, 1.15, 0.05, 0, 0.6)];
  add(g, extrude(fs, 0.9), bm, [0, H / 2, L / 2 - 1.2]);
  add(g, G.rbox(1.4, 0.45, 0.3, 0.08), bm, [5.6, H / 2 - 1.2, L / 2 - 0.15]);
  add(g, G.box(0.35, 0.15, 0.05), led(kind === 'cd' ? '#2fe05a' : '#ffae1a', 0.0), [3.9, H / 2 - 1.2, L / 2 - 0.29]);
  const logo = { cd: 'CD-ROM 24X', dvd: 'DVD±RW 16X', dvdsata: 'DVD-RW 24X  SATA' }[kind] || 'DVD';
  add(g, G.plane(4.0, 0.5), new THREE.MeshBasicMaterial({ map: textTex('odd' + kind, logo, { fg: dark ? '#cfcfcf' : '#555', w: 384, h: 48 }), transparent: true }), [-3.6, H / 2 - 1.2, L / 2 - 0.297], null, { cast: false });
  add(g, G.cyl(0.08, 0.08, 0.1, 10), mat('#111', 0.8), [-5.8, H / 2 - 1.2, L / 2 - 0.29], [PI / 2, 0, 0]);
  if (legacy) {
    // 90'lar: kulaklık girişi + ses tekerleği
    add(g, G.cyl(0.25, 0.25, 0.1, 16), M.nickel, [-6.6, H / 2 - 1.2, L / 2 - 0.27], [PI / 2, 0, 0]);
    add(g, G.cyl(0.11, 0.11, 0.12, 12), mat('#050505', 0.8), [-6.6, H / 2 - 1.2, L / 2 - 0.26], [PI / 2, 0, 0]);
    add(g, G.cyl(0.4, 0.4, 0.35, 20), mat('#333', 0.6), [-5.0, H / 2 - 1.2, L / 2 - 0.3], [0, 0, PI / 2]);
  }
  // tepsi (açılabilir)
  const tray = group(g, [0, 0, 0], null, 'tray');
  tray.userData.keep = true;
  tray.userData.openZ = 12.5;
  add(tray, G.box(12.75, 1.12, 0.35), bm, [0, H / 2 + 0.6, L / 2 - 0.5], null, { keep: true });
  const trayPlate = rrectShape(12.6, 13.6, 0.2);
  trayPlate.holes = [circlePath(6.15, 0, 0), rrectPath(1.4, 6.0, 0.3, 0, -4.5)];
  add(tray, extrude(trayPlate, 0.25), M.blackPlastic, [0, 2.65, L / 2 - 7.5], [-PI / 2, 0, 0], { keep: true });
  add(tray, G.cyl(6.1, 6.1, 0.05, 64), M.matteBlack, [0, 2.45, L / 2 - 7.5], null, { keep: true });
  const disc = group(tray, [0, 2.6, L / 2 - 7.5], null, 'disc');
  disc.userData.discSpin = true;
  const dm = kind === 'cd' ? M.cdData : M.dvdData;
  add(disc, G.ring(0.75, 6.0, 72), dm, [0, 0.0, 0], [PI / 2, 0, 0], { keep: true });
  add(disc, G.cyl(6.0, 6.0, 0.1, 72, true), mat('#cfd4d8', 0.3, 0.6), [0, 0.05, 0], null, { keep: true });
  add(disc, G.circle(6.0, 72), texMat(discTex(kind, { title: kind === 'cd' ? 'SÜRÜCÜLER' : 'YEDEK 2004', sub: kind === 'cd' ? 'Kurulum CD · 650 MB' : 'DVD-R · 4,7 GB', ring: kind === 'cd' ? '#3a6ea5' : '#a53a3a' })), [0, 0.101, 0], [-PI / 2, 0, 0], { keep: true });
  add(disc, G.cyl(0.75, 0.75, 0.11, 32, true), mat('#999', 0.4), [0, 0.05, 0], null, { keep: true });
  // iç mekanizma (lazer kızağı)
  const inside = group(g, [0, 0, 0], null, 'inside');
  inside.userData.keep = true;
  add(inside, G.cyl(1.0, 1.0, 0.4, 32), M.nickel, [0, 2.2, L / 2 - 7.5], null, { keep: true });
  add(inside, arrayGeo(G.cyl(0.1, 0.1, 9.0, 8), [[-2.2, 0, 0, PI / 2, 0, 0], [2.2, 0, 0, PI / 2, 0, 0]]), M.chrome, [0, 1.6, L / 2 - 11.5], null, { keep: true });
  const sled = group(inside, [0, 1.6, L / 2 - 10.0], null, 'sled');
  sled.userData.sled = { min: -2.5, max: 2.0, base: L / 2 - 10.0 };
  add(sled, G.box(4.6, 0.6, 1.8), mat('#333', 0.5, 0.3), [0, 0, 0], null, { keep: true });
  add(sled, G.cyl(0.25, 0.25, 0.15, 16), mat('#4a6ab8', 0.05, 0.3), [0, 0.35, 0], null, { keep: true });
  const beam = add(sled, G.cyl(0.06, 0.06, 0.95, 8), M.laser, [0, 0.82, 0], null, { keep: true, cast: false });
  beam.name = 'laser';
  beam.visible = false;
  // üst kapak
  const cover = group(g, [0, 0, 0], null, 'cover');
  cover.userData.mergeRoot = true;
  cover.userData.isCover = true;
  add(cover, G.box(W, 0.08, L - 1.2), M.galvanized, [0, H - 0.04, -0.6]);
  const lbl = stickerTex('odd' + kind, { w: 512, h: 256, title: logo, sub: '', accent: '#555', lines: ['CLASS 1 LASER PRODUCT', 'LAZER IŞINI: GÖZE TUTMAYIN', iface === 'ide' ? 'MASTER/SLAVE/CS' : 'SATA'], warn: true, barcode: true });
  add(cover, G.plane(8, 4), texMat(lbl), [0, H + 0.003, -3], [-PI / 2, 0, 0], { cast: false });
  // arka konnektörler
  if (iface === 'ide') {
    ideHeader(body, -1.8, 1.5, -L / 2, 40);
    add(body, G.box(0.9, 0.4, 0.3), M.blackPlastic, [2.6, 1.5, -L / 2 - 0.15]);
    add(body, G.box(1.1, 0.4, 0.4), M.whitePlastic, [-5.6, 1.5, -L / 2 - 0.15]);
    molexPower(body, 4.8, 1.5, -L / 2);
    anchorAt(g, 'data', [-1.8, 1.5, -L / 2 - 0.5]);
    anchorAt(g, 'power', [4.8, 1.5, -L / 2 - 0.5]);
  } else {
    sataConn(body, -2.0, 1.2, -L / 2, 7);
    sataConn(body, 1.2, 1.2, -L / 2, 15);
    anchorAt(g, 'data', [-2.0, 1.2, -L / 2 - 0.5]);
    anchorAt(g, 'power', [1.2, 1.2, -L / 2 - 0.5]);
  }
  g.userData.dims = { W, H, L };
  return g;
}
