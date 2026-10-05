// 2025 temsilî sistemi: AM5 (LGA 1718), DDR5, PCIe 5.0 x16 ekran kartı, M.2 NVMe, optik sürücü yok.
// variant: 'oyun' | 'ofis'
import * as THREE from 'three';
import { Assembly, boardSpace, placeCard, cardFx, placeRAM, towerRearHoles, cable } from '../assemble.js';
import { buildBoard, sataPort } from '../parts/board.js';
import { buildCPU, buildCooler } from '../parts/cpu.js';
import { buildRAM } from '../parts/ram.js';
import { buildGPU, slotCover } from '../parts/cards.js';
import { buildM2 } from '../parts/drives.js';
import { buildPSU } from '../parts/psu.js';
import { caseFan } from '../parts/fan.js';
import { case2025 } from '../parts/cases.js';
import { M, mat, PC99 } from '../materials.js';
import { add, G } from '../geom.js';

export const SLOT_X = [12.6, 10.568, 8.536, 6.504, 4.472, 2.44, 0.408];

export const IO_2025 = {
  x0: 13.8, shieldColor: 'black',
  cover: { x: 21.8, z: 2.05, w: 15.6, d: 4.7, h: 4.4, mat: M.gunmetal, stripe: mat('#9aa0a8', 0.3, 0.9) },
  cols: [
    { x: 28.6, items: [{ t: 'btnFlash' }, { t: 'btnCmos' }] },
    { x: 27.1, items: [{ t: 'wifi' }, { t: 'wifi' }] },
    { x: 25.5, items: [{ t: 'usb2', n: 2 }] },
    { x: 23.8, items: [{ t: 'usb3', n: 2 }] },
    { x: 22.1, items: [{ t: 'hdmi', id: 'hdmiMb' }, { t: 'dp', id: 'dpMb' }] },
    { x: 20.3, items: [{ t: 'usb10', n: 2 }] },
    { x: 18.5, items: [{ t: 'usbc' }, { t: 'usbc' }, { t: 'rj45_25' }] },
    { x: 16.6, items: [{ t: 'usb3', n: 2 }] },
    { x: 15.0, items: [{ t: 'spdif' }, { t: 'audio', colors: [PC99.lineOut, PC99.mic] }] },
  ],
};

export function board2025() {
  return buildBoard({
    model: 'VERTEKS X870-G OYUN', modelPos: [0.8, 22.2], seed: 2025, ppc: 44,
    pcb: { base: '#15181a', trace: '#1f2427', silk: '#c9ccd0', density: 0.8, rough: 0.6, back: '#101213' },
    labels: [
      { t: 'AM5', x: 17.8, y: 4.9, s: 0.3 }, { t: 'DIMM_A1  A2  B1  B2', x: 15.6, y: 22.2, s: 0.26 }, { t: 'PCIEX16_1 (Gen5)', x: 12.9, y: 13.9, s: 0.26 },
      { t: 'M.2_1 (Gen5)', x: 14.6, y: 15.0, s: 0.24 }, { t: 'SATA6G_1-4', x: 3.6, y: 22.6, s: 0.24 }, { t: 'EATX12V', x: 28.0, y: 9.5, s: 0.24 },
      { t: 'ATX 24P', x: 19.2, y: 22.4, s: 0.26 }, { t: 'U32G2_C', x: 11.0, y: 22.6, s: 0.22 }, { t: 'ARGB', x: 26.4, y: 17.2, s: 0.22 },
    ],
    socket: { type: 'am5', x: 21.5, z: 9.5 },
    ram: { type: 'ddr5', x: 22.5, latch: '#2a2c30', slots: [{ z: 17.6, color: '#2a2c30' }, { z: 18.6, color: '#3d4046' }, { z: 19.9, color: '#2a2c30' }, { z: 20.9, color: '#3d4046' }] },
    slots: [{ type: 'pcie16armor', x: SLOT_X[0] }, { type: 'pcie1', x: SLOT_X[2] }, { type: 'pcie16', x: SLOT_X[4], color: '#3d4046' }],
    m2: [{ x: 15.8, z: 5.8, len: 8.0 }],
    sata: [4.0, 5.3, 6.6, 7.9].map((x) => ({ x, z: 23.8, color: '#202225', angle: true, rot: Math.PI })),
    atx: { pins: 24, x: 21.0, z: 23.6, color: '#1c1d20' },
    cpuPower: [{ pins: 8, x: 29.6, z: 5.6, rot: Math.PI / 2, color: '#1c1d20' }, { pins: 8, x: 29.6, z: 7.8, rot: Math.PI / 2, color: '#1c1d20' }],
    chips: [
      { x: 6.2, z: 16.4, w: 2.0, d: 2.0, kind: 'none', lines: ['PCH'], sink: 'armor', sw: 6.4, sd: 6.0, sh: 0.9, sinkColor: M.gunmetal, axis: 'z' },
      { x: 11.4, z: 2.2, w: 0.9, d: 0.9, lines: ['SES', 'KODEK'] },
      { x: 2.5, z: 12.0, w: 1.2, d: 1.2, lines: ['2.5GbE'] },
      { x: 3.2, z: 4.5, w: 1.6, d: 1.0, lines: ['Wi-Fi 7'], kind: 'none' },
    ],
    vrm: {
      chokes: [7.0, 8.2, 9.4, 10.6, 11.8, 13.0, 14.2, 15.4].map((z) => [27.4, z]),
      sinks: [{ kind: 'armor', x: 27.3, z: 11.6, w: 3.0, d: 9.6, h: 2.8, color: M.gunmetal, grooves: 9, axis: 'z' }],
    },
    caps: [
      { list: [17.4, 18.4, 19.4, 20.4, 21.4, 22.4, 23.4, 24.4, 25.4].map((x) => [x, 15.6]), solid: true, sleeve: '#3a2a5a', r: 0.35, h: 0.8 },
      { list: [[9.5, 1.4], [10.3, 1.4], [9.5, 2.3]], sleeve: '#c9a227', r: 0.32, h: 0.75 },
    ],
    battery: { x: 10.0, z: 16.8 },
    bios: { kind: 'soic', x: 3.0, z: 19.0 },
    headers: [
      { x: 0.9, z: 20.0, cols: 5, rows: 2, rot: Math.PI / 2, color: '#151515' },
      { x: 16.0, z: 23.7, cols: 10, rows: 2, color: '#2a62c9', shroud: true },
      { x: 12.0, z: 23.8, cols: 5, rows: 2, color: '#151515', shroud: true },
      { x: 26.2, z: 17.8, cols: 4, rows: 1, color: '#f0eee6' },
      { x: 28.8, z: 17.8, cols: 4, rows: 1, color: '#f0eee6' },
    ],
    io: IO_2025,
  });
}

export function buildEra2025(opts = {}) {
  const office = opts.variant === 'ofis';
  const rgb = !office && opts.rgb !== false ? (opts.rgbColor || '#3fc8ff') : null;
  const asm = new Assembly('2025');
  const R = asm.root;
  const BS = [8.5, 12.5, -21.52];
  const { io, openings } = towerRearHoles(BS, 13.8, SLOT_X);
  const PSU_POS = [-1.2, 1.0, -22.42 + (office ? 7.0 : 8.0)];
  const FAN = { x: -2.6, y: 36.5, size: 12 };

  const kase = case2025({ rearHoles: [io, { x: PSU_POS[0], y: 5.3, w: 15.0, h: 8.6 }], slotOpenings: openings, fan: FAN, rgb });
  R.add(kase);
  const pick = (n) => kase.children.find((c) => c.name === n);
  const chassis = pick('kasa');
  chassis.add(pick('ustIO'));
  asm.part('kasa', 'kasa', chassis, { layer: 9 });
  asm.part('yanPanel', 'camPanel', pick('yanPanel'), { layer: 0, explode: [-28, 2, 0] });
  asm.part('onPanel', 'onPanel', pick('onPanel'), { layer: 0, explode: [0, 0, 18] });
  asm.part('onFanlar', 'kasaFani', pick('onFanlar'), { layer: 3, explode: [0, 0, 9] });
  asm.part('psuBolmesi', 'psuBolmesi', pick('shroud'), { layer: 3, explode: [-30, -1, 0] });

  const bs = boardSpace(R, 'tower', BS);
  const board = board2025();
  bs.add(board);
  asm.part('anakart', 'anakart', board, { layer: 8 });
  const A = board.userData.anchors;

  const cpu = buildCPU('am5');
  cpu.position.copy(A.socket.position).setY(0);
  bs.add(cpu);
  asm.part('islemci', 'islemci', cpu, { layer: 5, explode: [0, 10, 0] });
  const cool = buildCooler(office ? 'lowProfile' : 'tower', cpu.userData.top, { rgb });
  cool.position.copy(cpu.position);
  bs.add(cool);
  asm.part('sogutucu', 'sogutucu', cool, { layer: 3, explode: [0, office ? 14 : 21, 0] });

  [1, 3].forEach((si, k) => {
    const m = buildRAM('ddr5', { heatspreader: !office, rgb, capacity: office ? '16GB DDR5-5600' : '16GB DDR5-6000', pcb: '#1f5a32' });
    placeRAM(m, A['ram' + si].position.x, A['ram' + si].position.z, 'ddr5');
    bs.add(m);
    asm.part('ram' + (k + 1), 'ram', m, { layer: 4, explode: [0, 12 + k * 2, 0], tour: k === 0 });
  });

  const m2 = buildM2({ capacity: office ? '1 TB' : '2 TB', heatsink: true });
  m2.position.copy(A.m2_0.position).setY(A.m2_0.position.y - 0.1);
  bs.add(m2);
  asm.part('m2', 'm2', m2, { layer: 4, explode: [0, 8, 0] });

  const covers = new THREE.Group();
  let firstCover = 3;
  if (!office) {
    const gpu = buildGPU('pcie25', { fx: cardFx({ z0: 4.6 }), rgb });
    placeCard(gpu, { x: SLOT_X[0] });
    bs.add(gpu);
    asm.part('ekranKarti', 'ekranKarti', gpu, { layer: 2, explode: [0, 24, 4] });
    asm.gpu = gpu;
  } else firstCover = 0;
  for (let i = firstCover; i < 7; i++) { const c = slotCover({ vented: true, black: true }); placeCard(c, { x: SLOT_X[i] }); covers.add(c); }
  bs.add(covers);
  R.updateMatrixWorld(true);
  chassis.attach(covers);

  const psu = buildPSU('atx25', { watts: office ? 450 : 850, modular: !office, office });
  psu.position.set(...PSU_POS);
  asm.part('psu', 'psu', psu, { layer: 6, explode: [-24, 0, 0] });

  const rf = new THREE.Group();
  const fan = caseFan(12, { depth: 2.5, blades: 9, rgb, blade: rgb ? M.fanBladeClear : M.fanBlade });
  fan.rotation.y = Math.PI;
  rf.add(fan);
  rf.position.set(FAN.x, FAN.y, -22.42 + 1.35);
  asm.part('fanArka', 'kasaFani', rf, { layer: 3, explode: [0, 0, -14] });

  R.updateMatrixWorld(true);
  const P = psu.userData.anchors;
  const up = new THREE.Vector3(0, 1, 0);
  cable(asm, { from: P.atx, to: A.atx, style: office ? 'atx24' : 'sleeve24', kind: 'power', parts: ['psu', 'anakart'], label: '24-pin ATX güç', via: [[P.atx === P.out ? -4.5 : -6.8, 7.5, 3.0], [6.5, 8.0, 8.0], [10.2, 14, 8.0], [10.4, 27.5, 6.6], [8.2, 31.5, 5.5]], axisTo: up, startPlug: !office });
  cable(asm, { from: P.cpu, to: A.cpupwr0, style: office ? 'eps8' : 'sleeve8', kind: 'power', parts: ['psu', 'anakart', 'islemci'], label: '8-pin EPS (işlemci gücü)', via: [[-5.5, 6.0, 2.0], [6.5, 7.0, 7.5], [10.3, 14, 4.0], [10.3, 44.0, -9.5], [8.4, 46.0, -14.0], [5.0, 45.6, -15.9]], axisTo: new THREE.Vector3(0, 0, 1), startPlug: !office });
  if (!office) {
    // 12V-2x6 ekran kartı güç kablosu
    const gi = asm.gpu.userData.info.power;
    const gp = new THREE.Vector3(...gi);
    asm.gpu.localToWorld(gp);
    cable(asm, { from: P.pcie, to: { p: gp, d: new THREE.Vector3(-1, 0, 0) }, style: 'sleeve16', kind: 'power', parts: ['psu', 'ekranKarti'], label: '12V-2x6 (16-pin) ekran kartı gücü', via: [[2.0, 7.0, -1.0], [-6.0, 8.5, 2.0], [-8.6, 13.0, 1.0], [-8.6, 20.0, -1.5]], axisTo: new THREE.Vector3(0, 0, 1), startPlug: true, lead: [2.5, 2.5] });
    add(chassis, G.rbox(2.6, 0.3, 2.2, 0.12), M.rubber, [-8.6, 11.15, 1.0]);
  }
  // ön panel USB-C ve USB 3 dahili kabloları (veri)
  const top = new THREE.Vector3(-1.0, 46.2, 18.5);
  cable(asm, { from: { p: top, d: new THREE.Vector3(0, -1, 0) }, to: A.hdr2 || { p: bs.localToWorld(new THREE.Vector3(12.0, 1.3, 23.8)), d: new THREE.Vector3(-1, 0, 0) }, style: 'usbHdr', kind: 'data', parts: ['kasa', 'anakart'], label: 'Ön USB-C dahili kablosu', via: [[-1.0, 44.0, 16.0], [9.9, 43.0, 10.0], [10.2, 30.0, 6.5], [9.2, 25.0, 5.4]], axisTo: up });
  cable(asm, { from: { p: new THREE.Vector3(2.0, 46.2, 18.5), d: new THREE.Vector3(0, -1, 0) }, to: { p: bs.localToWorld(new THREE.Vector3(16.0, 1.3, 23.7)), d: new THREE.Vector3(-1, 0, 0) }, style: 'usbHdr', kind: 'data', parts: ['kasa', 'anakart'], label: 'Ön USB 3 dahili kablosu', via: [[2.0, 44.0, 15.5], [10.0, 42.0, 9.5], [10.3, 32.0, 7.0], [9.0, 29.0, 4.8]], axisTo: up });

  asm.dataNote = 'M.2 SSD kablo kullanmaz: veri ve güç doğrudan anakarttaki yuvadan gelir. Ekran kartı da verisini PCIe yuvasından alır.';
  asm.dataNoCable = ['m2', 'ekranKarti'];
  asm.regions = [
    { label: 'Anakart arka paneli (tümleşik grafik çıkışları dahil)', obj: board, local: new THREE.Vector3(30.2, 2.2, -0.8) },
    ...(asm.gpu ? [{ label: 'Ekran kartı çıkışları — monitör buraya!', obj: asm.gpu, local: new THREE.Vector3(-0.2, 11.6, 1.0) }] : []),
    { label: 'Güç girişi', obj: psu, local: new THREE.Vector3(-4.6, 7.0, -8.0) },
  ];
  asm.finalize();
  asm.boardSpace = bs;
  asm.board = board;
  asm.cameras = {
    front: { pos: [-52, 46, 110], target: [0, 22, 0] },
    rear: { pos: [-46, 42, -104], target: [0, 22, -8] },
    inside: { pos: [-106, 38, 14], target: [0, 23, -2] },
    io: { pos: [-4, 33, -50], target: [6, 33, -22] },
  };
  asm.center = new THREE.Vector3(0, 24, 0);
  return asm;
}
