// 2010'lar temsilî sistemi (~2014): LGA 1150 dört çekirdekli işlemci, DDR3, PCIe 3.0 x16 ekran kartı,
// 2,5" SATA SSD + 3,5" HDD, SATA DVD-RW, altta 500 W güç kaynağı, siyah orta kule.
import * as THREE from 'three';
import { Assembly, boardSpace, placeCard, cardFx, placeRAM, towerRearHoles, cable } from '../assemble.js';
import { buildBoard, PCB_T } from '../parts/board.js';
import { buildCPU, buildCooler } from '../parts/cpu.js';
import { buildRAM } from '../parts/ram.js';
import { buildGPU, slotCover } from '../parts/cards.js';
import { buildHDD, buildSSD25, buildOptical } from '../parts/drives.js';
import { buildPSU } from '../parts/psu.js';
import { caseFan } from '../parts/fan.js';
import { case2010 } from '../parts/cases.js';
import { M, mat, PC99 } from '../materials.js';

export const SLOT_X = [12.6, 10.568, 8.536, 6.504, 4.472, 2.44, 0.408];

export const IO_2010 = {
  x0: 13.8,
  cols: [
    { x: 28.9, items: [{ t: 'usb2', n: 2 }, { t: 'ps2combo' }] },
    { x: 25.9, items: [{ t: 'dviD', id: 'dviMb' }, { t: 'vga' }] },
    { x: 22.6, items: [{ t: 'hdmi', id: 'hdmiMb' }, { t: 'dp', id: 'dpMb' }] },
    { x: 20.6, items: [{ t: 'usb3', n: 2 }, { t: 'esata' }] },
    { x: 18.7, items: [{ t: 'usb3', n: 2 }, { t: 'rj45' }] },
    { x: 16.6, items: [{ t: 'audio', colors: [PC99.lineIn, PC99.lineOut, PC99.mic] }] },
    { x: 15.2, items: [{ t: 'audio', colors: [PC99.center, PC99.rear, PC99.side], id: 'audio' }] },
  ],
};

export function board2010() {
  const blue = mat('#2a5db0', 0.32, 0.75);
  return buildBoard({
    model: 'VERTEKS Z87-PRO', modelPos: [0.8, 21.9], seed: 2014,
    pcb: { base: '#1c1d1f', trace: '#2a2c30', silk: '#d8dbe0', density: 0.9, rough: 0.55, back: '#151617' },
    labels: [
      { t: 'LGA1150', x: 17.6, y: 5.9, s: 0.28 }, { t: 'DDR3_A1  A2  B1  B2', x: 15.4, y: 21.6, s: 0.24 }, { t: 'PCIEX16_1', x: 12.9, y: 13.9, s: 0.24 },
      { t: 'SATA6G_1-6', x: 2.6, y: 22.4, s: 0.24 }, { t: 'EATX12V', x: 28.0, y: 7.0, s: 0.24 }, { t: 'EATXPWR', x: 19.4, y: 22.4, s: 0.24 }, { t: 'USB3_12', x: 14.8, y: 22.6, s: 0.22 },
    ],
    socket: { type: 'lga1150', x: 21.5, z: 9.0 },
    ram: { type: 'ddr3', x: 22.5, latch: '#e6e6e6', slots: [{ z: 17.0, color: '#2a5db0' }, { z: 18.0, color: '#1a1a1a' }, { z: 19.2, color: '#2a5db0' }, { z: 20.2, color: '#1a1a1a' }] },
    slots: [
      { type: 'pcie16', x: SLOT_X[0], color: '#2a5db0' }, { type: 'pcie1', x: SLOT_X[1] }, { type: 'pcie16', x: SLOT_X[2], color: '#8a8d92' },
      { type: 'pcie1', x: SLOT_X[3] }, { type: 'pci', x: SLOT_X[4] }, { type: 'pcie16', x: SLOT_X[5] }, { type: 'pci', x: SLOT_X[6] },
    ],
    sata: [3.4, 4.7, 6.0].map((x) => ({ x, z: 23.8, color: '#5c6067', angle: true, stacked: true, rot: Math.PI })),
    atx: { pins: 24, x: 21.0, z: 23.6 },
    cpuPower: [{ pins: 8, x: 29.6, z: 5.0, rot: Math.PI / 2 }],
    chips: [
      { x: 6.5, z: 16.5, w: 2.2, d: 2.2, h: 0.15, kind: 'none', lines: ['PCH Z87'], sink: 'fin', sw: 4.4, sd: 4.4, sh: 1.0, fins: 9, sinkColor: blue },
      { x: 11.4, z: 2.4, w: 0.9, d: 0.9, lines: ['SES', 'KODEK'] },
      { x: 2.6, z: 12.0, w: 1.0, d: 1.0, lines: ['GbE'] },
      { x: 11.6, z: 20.6, w: 1.4, d: 1.4, lines: ['SÜPER I/O'] },
      { x: 16.0, z: 14.8, w: 0.9, d: 0.9, lines: ['USB 3.0'] },
    ],
    vrm: {
      chokes: [7.0, 8.4, 9.8, 11.2, 12.6, 14.0].map((z) => [27.5, z]).concat([17.6, 19.0, 20.4, 21.8, 23.2].map((x) => [x, 5.1])),
      chokeSize: 0.8,
      sinks: [
        { x: 27.5, z: 10.5, w: 2.4, d: 9.0, h: 2.2, fins: 10, axis: 'z', color: blue, y: PCB_T + 0.6 },
        { x: 20.6, z: 3.6, w: 7.6, d: 1.8, h: 2.0, fins: 12, axis: 'x', color: blue, y: PCB_T + 0.3 },
      ],
    },
    caps: [
      { list: [17.4, 18.4, 19.4, 20.4, 21.4, 22.4, 23.4, 24.4, 25.4].map((x) => [x, 14.2]), solid: true, sleeve: '#2a5db0', r: 0.33, h: 0.8 },
      { list: [[9.6, 1.4], [10.4, 1.4]], sleeve: '#c9a227', r: 0.3, h: 0.7 },
    ],
    battery: { x: 10.2, z: 17.0 },
    bios: { kind: 'soic', x: 3.0, z: 19.0 },
    headers: [
      { x: 1.0, z: 20.0, cols: 5, rows: 2, rot: Math.PI / 2, color: '#151515' },
      { x: 16.0, z: 23.7, cols: 10, rows: 2, color: '#2a62c9', shroud: true },
      { x: 26.0, z: 16.0, cols: 4, rows: 1, color: '#f0eee6' },
    ],
    io: IO_2010,
  });
}

export function buildEra2010(opts = {}) {
  const asm = new Assembly('2010');
  const R = asm.root;
  const BS = [8.3, 11.5, -22.52];
  const { io, openings } = towerRearHoles(BS, 13.8, SLOT_X);
  const PSU_POS = [-1.0, 1.2, -23.42 + 8.0];
  const FAN = { x: -2.9, y: 36.5, size: 12 };
  const kase = case2010({ rearHoles: [io, { x: PSU_POS[0], y: 5.5, w: 15.0, h: 8.6 }], slotOpenings: openings, fan: FAN });
  R.add(kase);
  const pick = (n) => kase.children.find((c) => c.name === n);
  const chassis = pick('kasa');
  asm.part('kasa', 'kasa', chassis, { layer: 9 });
  asm.part('yanPanel', 'yanPanel', pick('yanPanel'), { layer: 0, explode: [-30, 0, 0] });
  asm.part('onPanel', 'onPanel', pick('onPanel'), { layer: 0, explode: [0, 0, 18] });
  asm.part('onFanlar', 'kasaFani', pick('onFanlar'), { layer: 3, explode: [0, 0, 10] });

  const bs = boardSpace(R, 'tower', BS);
  const board = board2010();
  bs.add(board);
  asm.part('anakart', 'anakart', board, { layer: 8 });
  const A = board.userData.anchors;

  const cpu = buildCPU('lga1150');
  cpu.position.copy(A.socket.position).setY(0);
  bs.add(cpu);
  asm.part('islemci', 'islemci', cpu, { layer: 5, explode: [0, 9, 0] });
  const cool = buildCooler('stockRound', cpu.userData.top);
  cool.position.copy(cpu.position);
  bs.add(cool);
  asm.part('sogutucu', 'sogutucu', cool, { layer: 3, explode: [0, 15, 0] });

  [0, 2].forEach((si, k) => {
    const m = buildRAM('ddr3', { capacity: '4GB DDR3-1600' });
    placeRAM(m, A['ram' + si].position.x, A['ram' + si].position.z, 'ddr3');
    bs.add(m);
    asm.part('ram' + (k + 1), 'ram', m, { layer: 4, explode: [0, 11 + k * 2, 0], tour: k === 0 });
  });

  const gpu = buildGPU('pcie10', { fx: cardFx({ z0: 4.6 }) });
  placeCard(gpu, { x: SLOT_X[0] });
  bs.add(gpu);
  asm.part('ekranKarti', 'ekranKarti', gpu, { layer: 2, explode: [0, 22, 3] });
  const covers = new THREE.Group();
  for (let i = 2; i < 7; i++) { const c = slotCover({ vented: true, black: true }); placeCard(c, { x: SLOT_X[i] }); covers.add(c); }
  bs.add(covers);
  R.updateMatrixWorld(true);
  chassis.attach(covers);

  const dvd = buildOptical({ kind: 'dvdsata', bezel: '#18191b', iface: 'sata' });
  dvd.position.set(0, 41.5 - 4.13 / 2, 26.5 - 9.0);
  asm.part('optik', 'optik', dvd, { layer: 1, explode: [-6, 0, 26] });
  const hdd = buildHDD({ iface: 'sata', capacity: '1 TB', model: 'NT-1000D', rpm: '7200' });
  hdd.position.set(0, 19.7, 22.3 - 7.35);
  asm.part('hdd', 'hdd', hdd, { layer: 1, explode: [-10, 0, 28] });
  const ssd = buildSSD25({ capacity: '250 GB' });
  ssd.position.set(0, 13.55, 22.3 - 5.0);
  asm.part('ssd', 'ssd', ssd, { layer: 1, explode: [-12, -2, 24] });

  const psu = buildPSU('atx10', { watts: 500 });
  psu.position.set(...PSU_POS);
  asm.part('psu', 'psu', psu, { layer: 6, explode: [-24, 0, 0] });

  const rf = new THREE.Group();
  const fan = caseFan(12, { depth: 2.5, blades: 7 });
  fan.rotation.y = Math.PI;
  rf.add(fan);
  rf.position.set(FAN.x, FAN.y, -23.42 + 1.35);
  asm.part('fanArka', 'kasaFani', rf, { layer: 3, explode: [0, 0, -14] });

  R.updateMatrixWorld(true);
  const P = psu.userData.anchors;
  const Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
  cable(asm, { from: P.atx, to: A.atx, style: 'atx24', kind: 'power', parts: ['psu', 'anakart'], label: '24-pin ATX güç', via: [[-4.8, 6.5, -1.0], [4.0, 11.0, 2.2], [9.6, 14.0, 3.0], [9.8, 26.0, 4.0], [8.8, 31.0, 3.6]], axisTo: Y });
  cable(asm, { from: P.cpu, to: A.cpupwr0, style: 'eps8', kind: 'power', parts: ['psu', 'anakart', 'islemci'], label: '8-pin EPS (işlemci gücü)', via: [[-4.0, 6.5, -3.0], [4.5, 10.8, 0.0], [9.8, 14.0, 1.5], [9.8, 43.0, -12.0], [8.6, 44.3, -16.5], [5.6, 43.4, -17.5]], axisTo: Z });
  const gp = asm.gpu = gpu;
  const gpw = gpu.localToWorld(new THREE.Vector3(...gpu.userData.info.power));
  cable(asm, { from: P.pcie, to: { p: gpw, d: new THREE.Vector3(-1, 0, 0) }, style: 'pcie8', kind: 'power', parts: ['psu', 'ekranKarti'], label: 'PCIe 6+2 pin (ekran kartı gücü)', via: [[-6.5, 8.0, -4.0], [-8.4, 14.0, -2.6], [-8.4, 20.5, -2.6]], axisTo: Z });
  cable(asm, { from: P.sata, to: ssd.userData.anchors.power, style: 'sataPwr', kind: 'power', parts: ['psu', 'ssd'], label: 'SATA güç (SSD)', via: [[-3.0, 7.0, 2.0], [-2.2, 12.6, 8.0]], axisTo: X });
  cable(asm, { from: P.sata, to: hdd.userData.anchors.power, style: 'sataPwr', kind: 'power', parts: ['psu', 'hdd'], label: 'SATA güç (sabit disk)', via: [[-3.4, 7.0, 1.0], [-1.6, 17.0, 5.0]], axisTo: X });
  cable(asm, { from: P.sata, to: dvd.userData.anchors.power, style: 'sataPwr', kind: 'power', parts: ['psu', 'optik'], label: 'SATA güç (DVD)', via: [[-3.8, 7.0, 0.5], [-3.6, 25.0, 4.5], [-1.6, 37.5, 6.6]], axisTo: X });
  cable(asm, { from: A.sata0, to: ssd.userData.anchors.data, style: 'sataData', kind: 'data', parts: ['anakart', 'ssd'], label: 'SATA veri (SSD)', via: [[6.4, 14.2, 5.0], [0.0, 13.6, 9.8]], startPlug: true, axisFrom: Y, axisTo: X, up: [1, 0, 0] });
  cable(asm, { from: A.sata1, to: hdd.userData.anchors.data, style: 'sataData', kind: 'data', parts: ['anakart', 'hdd'], label: 'SATA veri (sabit disk)', via: [[6.0, 16.5, 4.6], [-0.6, 20.0, 6.0]], startPlug: true, axisFrom: Y, axisTo: X, up: [1, 0, 0] });
  cable(asm, { from: A.sata2, to: dvd.userData.anchors.data, style: 'sataData', kind: 'data', parts: ['anakart', 'optik'], label: 'SATA veri (DVD)', via: [[6.0, 19.0, 4.0], [3.5, 33.0, 6.0], [-0.6, 39.6, 7.6]], startPlug: true, axisFrom: Y, axisTo: X, up: [1, 0, 0] });
  const topIO = { p: new THREE.Vector3(-0.3, 45.9, 21.5), d: new THREE.Vector3(0, -1, 0) };
  cable(asm, { from: topIO, to: { p: bs.localToWorld(new THREE.Vector3(16.0, PCB_T + 1.0, 23.7)), d: new THREE.Vector3(-1, 0, 0) }, style: 'usbHdr', kind: 'data', parts: ['kasa', 'anakart'], label: 'Ön USB 3.0 dahili kablosu', via: [[-0.3, 44.0, 18.0], [9.6, 42.5, 8.0], [9.8, 30.0, 4.2], [8.6, 28.0, 2.6]], axisTo: Y });

  asm.regions = [
    { label: 'Anakart arka paneli', obj: board, local: new THREE.Vector3(30.2, 2.2, -0.8) },
    { label: 'Ekran kartı çıkışları', obj: gpu, local: new THREE.Vector3(-0.2, 11.6, 1.0) },
    { label: 'Güç girişi', obj: psu, local: new THREE.Vector3(-4.6, 7.0, -8.0) },
  ];
  asm.finalize();
  asm.boardSpace = bs;
  asm.board = board;
  asm.cameras = {
    front: { pos: [-48, 44, 114], target: [0, 21, 0] },
    rear: { pos: [-44, 40, -106], target: [0, 21, -8] },
    inside: { pos: [-104, 36, 14], target: [0, 22, -2] },
    io: { pos: [-4, 33, -54], target: [6, 33, -23.5] },
  };
  asm.center = new THREE.Vector3(0, 22, 0);
  return asm;
}
