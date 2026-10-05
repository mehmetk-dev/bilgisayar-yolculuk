// Bellek modülleri. Yerel çerçeve: x modül boyu (ortalanmış), y alt kenardan (0) yukarı, z kalınlık.
// Ölçüler JEDEC modül ölçülerine yakındır: SIMM 72-pin 107,95 mm; DIMM'ler 133,35 mm.
import * as THREE from 'three';
import { G, add, group, extrude, polyShape, circlePath, arrayGeo } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { pcbTex, chipTex, stickerTex } from '../textures.js';

const PI = Math.PI;

export const RAM_SPECS = {
  simm72: { L: 10.795, H: 2.54, notch: 0, pins: 72, name: '72-pin SIMM (EDO)', chips: 8, chip: [1.7, 0.75], sides: 1, chipKind: 'soj' },
  sdram: { L: 13.335, H: 3.175, notch: -2.0, pins: 168, name: '168-pin SDRAM DIMM', chips: 8, chip: [0.9, 2.2], sides: 1, chipKind: 'tsop' },
  ddr: { L: 13.335, H: 3.175, notch: -1.05, pins: 184, name: '184-pin DDR DIMM', chips: 8, chip: [1.0, 2.2], sides: 2, chipKind: 'tsop' },
  ddr3: { L: 13.335, H: 3.0, notch: -1.6, pins: 240, name: '240-pin DDR3 DIMM', chips: 8, chip: [1.0, 1.2], sides: 2, chipKind: 'bga' },
  ddr5: { L: 13.335, H: 3.13, notch: -0.5, pins: 288, name: '288-pin DDR5 DIMM', chips: 8, chip: [1.0, 1.1], sides: 2, chipKind: 'bga' },
};

function outline(type, s) {
  const { L, H, notch } = s;
  const hl = L / 2;
  const nw = 0.2, nd = 0.42;
  if (type === 'simm72') {
    // köşe kesiği + orta çentik
    return polyShape([
      [-hl + 0.32, 0], [-0.1, 0], [-0.1, 0.3], [0.1, 0.3], [0.1, 0], [hl, 0], [hl, H], [-hl, H], [-hl, 0.32],
    ]);
  }
  const sn = 0.9; // yan tutucu çentikleri
  const pts = [
    [-hl, 0], [notch - nw / 2, 0], [notch - nw / 2, nd], [notch + nw / 2, nd], [notch + nw / 2, 0], [hl, 0],
    [hl, sn - 0.2], [hl - 0.25, sn - 0.1], [hl - 0.25, sn + 0.25], [hl, sn + 0.35], [hl, H],
    [-hl, H], [-hl, sn + 0.35], [-hl + 0.25, sn + 0.25], [-hl + 0.25, sn - 0.1], [-hl, sn - 0.2],
  ];
  return polyShape(pts);
}

export function buildRAM(type, { heatspreader = false, rgb = null, pcb = '#1f5a32', label = 'NOVATRON', capacity = '' } = {}) {
  const s = RAM_SPECS[type];
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const thick = 0.127;
  const tex = pcbTex('ram|' + type + pcb, {
    w: s.L, h: s.H, ppc: 64, base: pcb, trace: '#2f7a46', seed: s.pins, density: 0.9,
    fingers: { y: s.H - 0.33, h: 0.32, n: s.pins / (type === 'simm72' ? 1 : 2), from: 0.3, to: s.L - 0.3, gaps: [s.L / 2 + s.notch] },
    labels: [{ t: capacity, x: 0.3, y: 0.25, s: 0.18, c: '#e8eadc' }],
  });
  tex.repeat.set(1 / s.L, 1 / s.H);
  tex.offset.set(0.5, 0);
  const shape = outline(type, s);
  if (type === 'simm72') shape.holes = [circlePath(0.16, -s.L / 2 + 0.6, 1.0), circlePath(0.16, s.L / 2 - 0.6, 1.0)];
  const geo = extrude(shape, thick, 0, 6);
  add(g, geo, texMat(tex, { rough: 0.4, metal: 0.1 }), [0, 0, -thick / 2]);

  // yongalar
  const n = s.chips;
  const span = s.L - 1.6;
  const pos = [];
  for (let i = 0; i < n; i++) {
    let x = -span / 2 + (i + 0.5) * span / n;
    if (type !== 'simm72' && Math.abs(x - s.notch) < 0.8) x += 0.6 * Math.sign(x - s.notch || 1);
    pos.push(x);
  }
  const [cw, ch] = s.chip;
  const cy = s.H * 0.55;
  const ctex = chipTex(type === 'simm72' ? ['KM416', '-60'] : type === 'ddr' ? ['NV', 'DDR400', '32Mx8'] : type === 'ddr3' ? ['NV3', '4Gb', '1600'] : ['NV5', '16Gb', '6000'], { w: 128, h: Math.round(128 * ch / cw) });
  const ctexM = texMat(ctex, { rough: 0.55 });
  const sides = heatspreader ? 1 : s.sides;
  for (let side = 0; side < sides; side++) {
    const sz = side ? -1 : 1;
    const ys = type === 'ddr5' ? cy + 0.1 : cy;
    add(g, arrayGeo(G.box(cw, ch, 0.1), pos.map((x) => [x, ys, sz * (thick / 2 + 0.05)])), M.epoxy);
    for (const x of pos) add(g, G.plane(cw * 0.96, ch * 0.96), ctexM, [x, ys, sz * (thick / 2 + 0.101)], [0, side ? PI : 0, 0], { cast: false });
    if (s.chipKind === 'tsop' || s.chipKind === 'soj') {
      const legs = [];
      const vertical = ch > cw;
      for (const x of pos) {
        const m = vertical ? Math.floor(ch / 0.065) : Math.floor(cw / 0.127);
        for (let k = 0; k < m; k++) {
          const t = (k - (m - 1) / 2) * (vertical ? 0.065 : 0.127);
          if (vertical) legs.push([x - cw / 2 - 0.04, ys + t, sz * (thick / 2 + 0.02)], [x + cw / 2 + 0.04, ys + t, sz * (thick / 2 + 0.02)]);
          else legs.push([x + t, ys - ch / 2 - 0.04, sz * (thick / 2 + 0.02)], [x + t, ys + ch / 2 + 0.04, sz * (thick / 2 + 0.02)]);
        }
      }
      add(g, arrayGeo(G.box(vertical ? 0.08 : 0.04, vertical ? 0.03 : 0.08, 0.04), legs), M.solder);
    }
  }
  // SPD EEPROM ve küçük parçalar
  if (type !== 'simm72') {
    add(g, G.box(0.3, 0.3, 0.08), M.epoxy, [s.L / 2 - 1.6, 0.85, -thick / 2 - 0.04]);
    add(g, arrayGeo(G.box(0.1, 0.05, 0.05), [...Array(16)].map((_, i) => [-s.L / 2 + 0.8 + i * 0.75, 0.6, thick / 2 + 0.025])), M.ceramic);
  }
  if (type === 'ddr5') {
    // PMIC: DDR5'te güç yönetimi modül üzerinde
    add(g, G.box(0.5, 0.5, 0.08), M.epoxy, [0.0, 0.95, thick / 2 + 0.04]);
  }
  if (heatspreader) {
    const hsH = s.H + (rgb ? 1.0 : 0.6);
    for (const sz of [-1, 1]) {
      add(g, G.rbox(s.L - 0.2, hsH - 0.45, 0.14, 0.05), M.anodizedBlack, [0, 0.45 + (hsH - 0.45) / 2, sz * (thick / 2 + 0.18)]);
      add(g, G.box(s.L - 1.2, 0.6, 0.02), M.aluminumDark, [0, hsH * 0.55, sz * (thick / 2 + 0.26)]);
      const st = stickerTex('ramlbl' + label, { w: 512, h: 96, bg: '#1d1e21', fg: '#ddd', title: label, sub: 'DDR5-6000', accent: '#2b2d31', barcode: false });
      add(g, G.plane(5.5, 1.0), texMat(st, { rough: 0.5 }), [-2.5, hsH * 0.55, sz * (thick / 2 + 0.272)], [0, sz < 0 ? PI : 0, 0], { cast: false });
    }
    add(g, G.box(s.L - 0.2, 0.25, 0.6), M.anodizedBlack, [0, hsH - 0.125, 0]);
    if (rgb) {
      const lm = led(rgb, 1.0);
      const bar = add(g, G.box(s.L - 0.5, 0.45, 0.42), physMatDiffuser(), [0, hsH + 0.22, 0], null, { keep: true });
      const glow = add(g, G.box(s.L - 0.6, 0.3, 0.3), lm, [0, hsH + 0.2, 0], null, { keep: true, cast: false });
      glow.userData.rgb = true;
    }
  }
  g.userData.spec = s;
  return g;
}

let diff;
function physMatDiffuser() {
  if (!diff) { diff = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, transparent: true, opacity: 0.35 }); diff.userData.shared = true; }
  return diff;
}
