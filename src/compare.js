// Karşılaştırma sahnesi: aynı parçanın iki dönemdeki örneği yan yana, cetvel üzerinde gerçek ölçekte.
import * as THREE from 'three';
import { G, add, group, mergeStatic, disposeTree } from './geom.js';
import { M, mat, texMat } from './materials.js';
import { makeTex } from './textures.js';
import { buildHDD, buildSSD25, buildM2, buildFloppy, buildOptical } from './parts/drives.js';
import { buildRAM } from './parts/ram.js';
import { buildGPU } from './parts/cards.js';
import { buildCPU } from './parts/cpu.js';
import { buildPSU } from './parts/psu.js';
import { buildIO } from './parts/board.js';

const PI = Math.PI;
let IOS = {};
export function registerIO(era, cfg) { IOS[era] = cfg; }

// Her model "masa üstünde, kameraya bakan" duruşta döner; uzunluk ölçüsü (cm) ile
export function buildModel(key) {
  const g = new THREE.Group();
  let m, len = 0, rot = [0, 0, 0], lift = 0;
  switch (key) {
    case 'hdd-ide': m = buildHDD({ iface: 'ide', capacity: '2,1 GB', model: 'NT-2100A', rpm: '5400' }); rot = [0, 0.5, 0]; len = 14.7; break;
    case 'hdd-sata': m = buildHDD({ iface: 'sata', capacity: '160 GB' }); rot = [0, 0.5, 0]; len = 14.7; break;
    case 'ssd25': m = buildSSD25({}); rot = [0, 0.5, 0]; len = 10.0; break;
    case 'm2': m = buildM2({ heatsink: false }); rot = [0, 0.5, 0]; len = 8.0; break;
    case 'ram-simm72': m = buildRAM('simm72', { capacity: '16MB EDO' }); len = 10.8; break;
    case 'ram-ddr': m = buildRAM('ddr', { capacity: '512MB' }); len = 13.3; break;
    case 'ram-ddr3': m = buildRAM('ddr3', { capacity: '4GB' }); len = 13.3; break;
    case 'ram-ddr5': m = buildRAM('ddr5', { heatspreader: true, rgb: null, capacity: '16GB' }); len = 13.3; break;
    case 'gpu-pci90': m = buildGPU('pci90', { fx: 5.4 }); rot = [0, 0, 0]; len = 17.5; lift = 0.8; break;
    case 'gpu-agp00': m = buildGPU('agp00', { fx: 5.4 }); len = 19.0; lift = 0.8; break;
    case 'gpu-pcie10': m = buildGPU('pcie10', { fx: 5.4 }); len = 24.1; lift = 0.8; break;
    case 'gpu-pcie25': m = buildGPU('pcie25', { fx: 5.4 }); len = 30.4; lift = 0.8; break;
    case 'floppy': {
      m = buildFloppy({}); rot = [0, 0.5, 0]; len = 14.0;
      const d = m.getObjectByName('disk'); if (d) d.position.z += 8.5;
      break;
    }
    case 'optical-dvd': m = buildOptical({ kind: 'dvd', iface: 'ide' }); rot = [0, 0.5, 0]; len = 18; { const t = m.getObjectByName('tray'); t.position.z = 12; } break;
    case 'optical-sata': m = buildOptical({ kind: 'dvdsata', iface: 'sata', bezel: '#18191b' }); rot = [0, 0.5, 0]; len = 18; { const t = m.getObjectByName('tray'); t.position.z = 12; } break;
    case 'usbstick': m = usbStick(); len = 4.2; break;
    case 'cpu-s7': m = buildCPU('s7'); len = 4.95; break;
    case 'cpu-s478': m = buildCPU('s478'); len = 3.5; break;
    case 'cpu-lga1150': m = buildCPU('lga1150'); len = 3.75; break;
    case 'cpu-am5': m = buildCPU('am5'); len = 4.0; break;
    case 'psu-at90': m = buildPSU('at90', { watts: 200 }); rot = [0, PI - 0.5, 0]; len = 14; break;
    case 'psu-atx00': m = buildPSU('atx00', { watts: 350 }); rot = [0, PI - 0.5, 0]; len = 14; break;
    case 'psu-atx10': m = buildPSU('atx10', { watts: 500 }); rot = [0, PI - 0.5, 0]; len = 16; break;
    case 'psu-atx25': m = buildPSU('atx25', { watts: 850, modular: true }); rot = [0, PI - 0.5, 0]; len = 16; break;
    default:
      if (key.startsWith('io-')) {
        const cfg = IOS[key.slice(3)];
        m = new THREE.Group();
        const io = buildIO(cfg);
        // I/O kümesini kameraya (+z) bakacak şekilde çevir
        io.position.set(-cfg.x0 - 15.875 / 2, 0, 0);
        const holder = new THREE.Group();
        holder.add(io);
        holder.rotation.y = PI;
        m.add(holder);
        len = 15.9;
      }
  }
  if (key.startsWith('gpu-')) {
    // kartı fanları kameraya bakacak şekilde dik koy
    const h = new THREE.Group();
    m.position.set(-len / 2, 0.8, 0);
    h.add(m);
    m = h;
  } else if (key.startsWith('ram-')) {
    m.position.y = 0;
  } else if (key.startsWith('cpu-')) {
    const h = new THREE.Group();
    m.position.y = -0.3;
    m.scale.setScalar(1);
    h.add(m);
    h.rotation.x = 0.9;
    m = h;
  }
  m.rotation.set(...rot.map((v, i) => (m.rotation.toArray()[i] || 0) + v));
  g.add(m);
  mergeStatic(g);
  const box = new THREE.Box3().setFromObject(g);
  g.position.y -= box.min.y;
  g.userData.len = len;
  g.userData.box = box;
  return g;
}

function usbStick() {
  const g = new THREE.Group();
  add(g, G.rbox(3.0, 0.9, 1.6, 0.35), mat('#2a62c9', 0.35), [0.6, 0.45, 0]);
  add(g, G.box(1.25, 0.45, 1.2), M.nickel, [-1.5, 0.45, 0]);
  add(g, G.box(1.0, 0.18, 1.0), M.blackPlastic, [-1.5, 0.52, 0]);
  add(g, G.torus(0.25, 0.08, 6, 16), M.nickel, [2.0, 0.45, 0], [PI / 2, 0, 0]);
  return g;
}

// Cetvel (cm)
export function ruler(lengthCm) {
  const L = Math.ceil(lengthCm / 5) * 5 + 5;
  const tex = makeTex('ruler' + L, Math.round(L * 40), 96, (g, w, h) => {
    g.fillStyle = '#f2e7c4'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#222'; g.font = 'bold 26px "DejaVu Sans", Arial'; g.textAlign = 'center';
    for (let i = 0; i <= L * 10; i++) {
      const x = (i / (L * 10)) * w;
      const tall = i % 10 === 0 ? 40 : i % 5 === 0 ? 26 : 14;
      g.fillRect(x - 1, 0, 2, tall);
      if (i % 10 === 0 && i > 0 && i < L * 10) g.fillText(String(i / 10), x, 72);
    }
    g.font = 'bold 22px "DejaVu Sans", Arial'; g.textAlign = 'left'; g.fillText('cm', 6, 88);
  });
  const grp = new THREE.Group();
  add(grp, G.box(L, 0.15, 2.4), mat('#e8dcb5', 0.6), [0, -0.075, 0]);
  add(grp, G.plane(L, 2.4), texMat(tex, { rough: 0.6 }), [0, 0.002, 0], [-PI / 2, 0, 0], { cast: false });
  grp.userData.L = L;
  return grp;
}

export function disposeModel(m) { disposeTree(m); }
