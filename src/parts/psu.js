// Güç kaynağı (ATX). Yerel çerçeve: x genişlik 15 cm (ortalı), y 0..8.6, z: arka yüz (priz) -L/2, iç yüz +L/2.
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, rrectPath, circlePath, arrayGeo } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { stickerTex, holeAlpha, textTex } from '../textures.js';
import { makePort } from './ports.js';
import { caseFan, fanGrille } from './fan.js';

const PI = Math.PI;
const Q_REAR = new THREE.Quaternion(); // port çerçevesi zaten -Z'ye bakıyor

function anchorAt(g, name, pos, dir) {
  const o = new THREE.Object3D();
  o.position.set(...pos);
  o.userData.dir = new THREE.Vector3(...dir);
  o.name = name;
  g.add(o);
  g.userData.anchors = g.userData.anchors || {};
  g.userData.anchors[name] = o;
  return o;
}

function ventPanel(parent, w, h, pos, rot, material, key, pitch = 20) {
  const a = holeAlpha(key, { pitch, r: pitch * 0.36, hex: true });
  a.repeat.set(w / 4, h / 4);
  const m = material.clone();
  m.alphaMap = a; m.alphaTest = 0.5; m.side = THREE.DoubleSide; m.userData.shared = true;
  return add(parent, G.plane(w, h), m, pos, rot, { cast: true });
}

// kind: 'at90' | 'atx00' | 'atx10' | 'atx25'
export function buildPSU(kind, { watts = 350, label = 'NOVATRON', modular = false, office = false } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const W = 15.0, H = 8.6;
  const L = kind === 'atx25' ? (office ? 14.0 : 16.0) : kind === 'atx10' ? 16.0 : 14.0;
  const black = kind === 'atx10' || kind === 'atx25';
  const shell = black ? M.blackSteel : M.galvanized;
  const t = 0.08;
  // gövde (U kapak + taban)
  add(g, G.box(W, t, L), shell, [0, H - t / 2, 0]);
  add(g, G.box(W, t, L), shell, [0, t / 2, 0]);
  add(g, G.box(t, H, L), shell, [-W / 2 + t / 2, H / 2, 0]);
  add(g, G.box(t, H, L), shell, [W / 2 - t / 2, H / 2, 0]);
  // kenar kıvrımları
  add(g, arrayGeo(G.box(W, 0.12, 0.12), [[0, H - 0.06, L / 2 - 0.06], [0, H - 0.06, -L / 2 + 0.06], [0, 0.06, L / 2 - 0.06], [0, 0.06, -L / 2 + 0.06]]), shell);

  // --- arka yüz (kasanın dışına bakar): -z
  const rear = group(g, [0, 0, -L / 2]);
  const rs = rrectShape(W, H, 0.1, 0, H / 2);
  const fanS = black ? 0 : 8.0;
  const holes = [rrectPath(2.9, 2.2, 0.1, -4.6, H - 2.2)];
  if (fanS) holes.push(circlePath(3.7, 2.6, H / 2));
  else holes.push(rrectPath(7.5, 6.0, 0.3, 2.8, H / 2));
  if (kind === 'at90') holes.push(rrectPath(2.9, 2.2, 0.1, -4.6, 2.0));
  rs.holes = holes;
  add(rear, extrude(rs, t), shell, [0, 0, -t]);
  // iç izgara/petek
  if (fanS) {
    const gr = fanGrille(8.0, { rings: 5, material: M.steel, wire: 0.05 });
    gr.position.set(2.6, H / 2, -0.12);
    rear.add(gr);
    const fan = caseFan(8.0, { depth: 2.5, blades: 7 });
    fan.position.set(2.6, H / 2, 1.4);
    rear.add(fan);
  } else {
    ventPanel(rear, 7.5, 6.0, [2.8, H / 2, -0.02], null, M.blackSteel, 'psuhex', 18);
  }
  // priz, anahtar, voltaj seçici
  const inlet = makePort({ t: 'iecC14' });
  inlet.position.set(-4.6, H - 2.2, -0.05);
  rear.add(inlet);
  if (kind === 'at90') {
    const out = makePort({ t: 'iecC13' });
    out.position.set(-4.6, 2.0, -0.05);
    rear.add(out);
  }
  if (kind !== 'at90') {
    const sw = makePort({ t: 'psuSwitch' });
    sw.position.set(-4.6, H - 4.5, -0.05);
    rear.add(sw);
  }
  if (kind === 'at90' || kind === 'atx00') {
    const vs = makePort({ t: 'voltSel' });
    vs.position.set(-4.6, kind === 'at90' ? 4.2 : 1.4, -0.05);
    rear.add(vs);
  }
  // --- alt fan (2010'lar ve 2025: büyük fan, aşağı bakar)
  if (black) {
    const fs = kind === 'atx25' && !office ? 13.5 : 12.0;
    const fan = caseFan(fs, { depth: 2.5, blades: 9, frameless: true });
    fan.rotation.x = -PI / 2; // hava yukarı (kaynağın içine) çekilir
    fan.position.set(0, 1.5, 0);
    g.add(fan);
    const gr = fanGrille(fs, { rings: 6, material: M.blackSteel, wire: 0.06 });
    gr.rotation.x = PI / 2;
    gr.position.set(0, -0.06, 0);
    g.add(gr);
    // alt yüzde delik
    g.children.find((c) => c.position.y === t / 2 && c.geometry?.parameters?.height === t).visible = false;
    const bs = rrectShape(W, L, 0.1);
    bs.holes = [circlePath(fs * 0.47)];
    add(g, extrude(bs, t), shell, [0, 0, 0], [PI / 2, 0, 0]);
  }
  // --- iç yüz (+z): havalandırma + kablo çıkışı / modüler soketler
  const front = group(g, [0, 0, L / 2]);
  if (modular) {
    add(front, G.box(W - 0.4, H - 0.4, 0.1), M.blackSteel, [0, H / 2, -0.05]);
    const sockets = [
      [-5.6, 6.3, 5.4, 1.1, '24P'], [-5.6, 4.6, 2.0, 1.1, 'CPU'], [-3.2, 4.6, 2.0, 1.1, 'CPU'],
      [0.4, 6.3, 2.0, 1.1, 'PCIe'], [2.8, 6.3, 2.0, 1.1, 'PCIe'], [5.3, 6.3, 2.2, 1.1, '12V-2x6'],
      [0.4, 4.0, 1.7, 0.9, 'SATA'], [2.8, 4.0, 1.7, 0.9, 'SATA'], [5.3, 4.0, 1.7, 0.9, 'P'],
    ];
    for (const [x, y, w, h, n] of sockets) {
      add(front, G.box(w, h, 0.4), M.matteBlack, [x, y, 0.1]);
      add(front, G.box(w - 0.3, h - 0.3, 0.02), mat('#050505', 0.9), [x, y, 0.31]);
      add(front, G.plane(w, 0.4), new THREE.MeshBasicMaterial({ map: textTex('mod' + n, n, { fg: '#ddd', w: 256, h: 64, size: 0.7 }), transparent: true }), [x, y - h / 2 - 0.3, 0.02], null, { cast: false });
    }
    anchorAt(g, 'atx', [-5.6, 6.3, L / 2 + 0.4], [0, 0, 1]);
    anchorAt(g, 'cpu', [-5.6, 4.6, L / 2 + 0.4], [0, 0, 1]);
    anchorAt(g, 'pcie', [5.3, 6.3, L / 2 + 0.4], [0, 0, 1]);
    anchorAt(g, 'sata', [0.4, 4.0, L / 2 + 0.4], [0, 0, 1]);
    anchorAt(g, 'periph', [5.3, 4.0, L / 2 + 0.4], [0, 0, 1]);
  } else {
    ventPanel(front, W - 1, H - 1, [0, H / 2, 0.0], null, shell, 'psuhexf', 22);
    // kablo çıkış lastiği
    add(front, G.cyl(1.4, 1.4, 0.5, 20), M.rubber, [-3.8, H / 2 - 1.5, 0.1], [PI / 2, 0, 0]);
    anchorAt(g, 'out', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
    anchorAt(g, 'atx', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
    anchorAt(g, 'cpu', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
    anchorAt(g, 'sata', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
    anchorAt(g, 'pcie', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
    anchorAt(g, 'periph', [-3.8, H / 2 - 1.5, L / 2 + 0.3], [0, 0, 1]);
  }
  // --- etiket (yan yüz +x): çıkış tablosu
  const table = {
    at90: [['DC ÇIKIŞ', '+5V', '+12V', '-5V', '-12V', '+3.3V'], ['AKIM', '20A', '8A', '0.5A', '0.5A', '14A']],
    atx00: [['DC ÇIKIŞ', '+3.3V', '+5V', '+12V', '-12V', '+5Vsb'], ['AKIM', '28A', '30A', '22A', '0.8A', '2.5A']],
    atx10: [['DC ÇIKIŞ', '+3.3V', '+5V', '+12V', '-12V', '+5Vsb'], ['AKIM', '20A', '20A', '40A', '0.3A', '2.5A']],
    atx25: office ? [['DC ÇIKIŞ', '+3.3V', '+5V', '+12V', '-12V', '+5Vsb'], ['AKIM', '20A', '20A', '45A', '0.3A', '2.5A']] : [['DC ÇIKIŞ', '+3.3V', '+5V', '+12V', '-12V', '+5Vsb'], ['AKIM', '20A', '20A', '70.8A', '0.3A', '3A']],
  }[kind];
  const lbl = stickerTex('psu' + kind + watts, {
    w: 640, h: 400, title: `${label} ${watts} W`, sub: kind === 'atx25' ? 'ATX 3.1 · 80 PLUS GOLD' : kind === 'atx10' ? '80 PLUS BRONZE' : kind === 'atx00' ? 'ATX12V 2.0' : 'ATX 1.x',
    accent: black ? '#202020' : '#1d5fa8', lines: [kind === 'at90' || kind === 'atx00' ? 'AC GİRİŞ: 115V/230V ~ 6A/3A' : 'AC GİRİŞ: 100-240V ~ 50/60Hz', 'YÜKSEK GERİLİM – AÇMAYIN!'], table, warn: true, barcode: false,
  });
  add(g, G.plane(L * 0.8, H * 0.75), texMat(lbl, { rough: 0.55 }), [W / 2 + 0.002, H / 2, 0], [0, PI / 2, 0], { cast: false });
  g.userData.dims = { W, H, L };
  return g;
}
