// Fanlar: kasa fanı, GPU fanı, PSU fanı ızgarası. Fan ekseni +Z (hava +Z yönüne üflenir).
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, circlePath, bladeGeo, arrayGeo } from '../geom.js';
import { M, mat, led, physMat } from '../materials.js';

const PI = Math.PI;

// size: kenar (cm), depth: kalınlık
export function caseFan(size = 12, { depth = 2.5, blades = 7, frame = M.blackPlastic, blade = M.fanBlade, rgb = null, hubLabel = '#202020', frameless = false } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  const R = size * 0.47;
  if (!frameless) {
    const s = rrectShape(size, size, size * 0.06);
    s.holes = [circlePath(R + 0.05)];
    // ön ve arka flanş + köşe dikmeleri
    add(g, extrude(s, 0.35), frame, [0, 0, -depth / 2]);
    add(g, extrude(s, 0.35), frame, [0, 0, depth / 2 - 0.35]);
    const tube = new THREE.CylinderGeometry(R + 0.15, R + 0.15, depth - 0.7, 48, 1, true);
    add(g, tube, frame, [0, 0, 0], [PI / 2, 0, 0]);
    const corner = size / 2 - size * 0.08;
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      add(g, G.box(size * 0.12, size * 0.12, depth - 0.7), frame, [sx * corner, sy * corner, 0]);
      add(g, G.cyl(0.22, 0.22, depth + 0.01, 12), mat('#050505', 0.9), [sx * (size / 2 - size * 0.07), sy * (size / 2 - size * 0.07), 0], [PI / 2, 0, 0]);
    }
  }
  // arka motor tutucu + kollar
  const hubR = size * 0.16;
  add(g, G.cyl(hubR * 1.05, hubR * 1.05, 0.25, 32), frame, [0, 0, depth / 2 - 0.2], [PI / 2, 0, 0]);
  for (let i = 0; i < 4; i++) {
    const a = PI / 4 + i * PI / 2;
    const L = R - hubR;
    add(g, G.box(L, 0.25, 0.2), frame, [Math.cos(a) * (hubR + L / 2), Math.sin(a) * (hubR + L / 2), depth / 2 - 0.15], [0, 0, a]);
  }
  // dönen kısım
  const rotor = group(g, [0, 0, -0.1]);
  rotor.userData.keep = true;
  rotor.userData.spin = { axis: 'z', speed: rgb ? 9 : 11 };
  rotor.name = 'rotor';
  add(rotor, G.cyl(hubR, hubR, depth * 0.62, 32), blade === M.fanBladeClear ? mat('#e6e6e6', 0.4) : M.blackPlastic, [0, 0, 0], [PI / 2, 0, 0], { keep: true });
  add(rotor, G.circle(hubR * 0.8, 32), mat(hubLabel, 0.5), [0, 0, -depth * 0.31 - 0.01], [0, PI, 0], { keep: true });
  const bg = bladeGeo(hubR * 0.95, R - 0.12, 1.1, (2 * PI / blades) * 0.78, depth * 0.55, 6, 6);
  const list = [];
  for (let i = 0; i < blades; i++) list.push([0, 0, 0, 0, 0, i * 2 * PI / blades]);
  add(rotor, arrayGeo(bg, list), blade, [0, 0, 0], null, { keep: true });
  if (rgb) {
    // ARGB halka (ön yüz) + göbek ışığı
    const ringM = led(rgb, 1.1);
    ringM.userData.rgb = true;
    const ring = add(g, G.torus(R + 0.1, 0.14, 8, 64), ringM, [0, 0, -depth / 2 + 0.05], null, { keep: true, cast: false });
    ring.userData.rgb = true;
    const hub = add(rotor, G.circle(hubR * 0.85, 32), ringM, [0, 0, depth * 0.31 + 0.02], null, { keep: true, cast: false });
  }
  return g;
}

// Tel fan ızgarası (PSU / arka fan)
export function fanGrille(size, { rings = 5, material = M.steel, wire = 0.06 } = {}) {
  const g = new THREE.Group();
  const R = size * 0.46;
  for (let i = 1; i <= rings; i++) add(g, G.torus(R * i / rings, wire, 6, 48), material, [0, 0, 0]);
  for (let i = 0; i < 4; i++) add(g, G.box(R * 2, wire * 1.6, wire * 1.6), material, [0, 0, 0], [0, 0, PI / 4 + i * PI / 2]);
  add(g, G.cyl(R * 0.18, R * 0.18, 0.05, 24), material, [0, 0, 0], [PI / 2, 0, 0]);
  return g;
}

// Kanatçık bloğu (alüminyum), kanatçıklar X yönünde sıralı
export function finBlock(parent, { w, h, d, n, t = 0.04, material = M.aluminum, pos = [0, 0, 0] }) {
  const list = [];
  for (let i = 0; i < n; i++) list.push([(i - (n - 1) / 2) * (w / n), 0, 0]);
  return add(parent, arrayGeo(G.box(t, h, d), list), material, pos);
}
