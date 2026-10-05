// 2000'ler temsilî sistemi (~2004): Socket 478 Pentium 4 sınıfı, DDR-400, AGP 8x, SATA HDD + IDE DVD yazıcı + disket.
import * as THREE from 'three';
import { Assembly, boardSpace, placeCard, cardFx, placeRAM, towerRearHoles, cable } from '../assemble.js';
import { buildBoard, PCB_T } from '../parts/board.js';
import { buildCPU, buildCooler } from '../parts/cpu.js';
import { buildRAM } from '../parts/ram.js';
import { buildGPU, slotCover } from '../parts/cards.js';
import { buildHDD, buildFloppy, buildOptical } from '../parts/drives.js';
import { buildPSU } from '../parts/psu.js';
import { caseFan } from '../parts/fan.js';
import { case2000 } from '../parts/cases.js';
import { M, PC99 } from '../materials.js';

export const SLOT_X = [12.6, 10.568, 8.536, 6.504, 4.472, 2.44, 0.408];

export const IO_2000 = {
  x0: 13.8,
  cols: [
    { x: 28.3, items: [{ t: 'ps2kb' }, { t: 'ps2mouse' }] },
    { x: 24.8, items: [{ t: 'serial' }, { t: 'parallel' }] },
    { x: 21.0, items: [{ t: 'usb2', n: 2 }] },
    { x: 18.8, items: [{ t: 'usb2', n: 2 }, { t: 'rj45' }] },
    { x: 16.6, items: [{ t: 'audio', colors: [PC99.lineIn, PC99.lineOut, PC99.mic] }] },
  ],
};

export function board2000() {
  const slots = [{ type: 'agp', x: SLOT_X[0] }, ...[1, 2, 3, 4, 5].map((i) => ({ type: 'pci', x: SLOT_X[i] }))];
  return buildBoard({
    model: 'VERTEKS P4X-865PE', modelPos: [0.8, 21.4], seed: 865,
    pcb: { base: '#1d5530', trace: '#2b7444', silk: '#e8ebdc' },
    labels: [
      { t: 'CPU1', x: 17.5, y: 3.6, s: 0.3 }, { t: 'DIMM1', x: 15.2, y: 17.1, s: 0.26 }, { t: 'DIMM4', x: 15.2, y: 21.6, s: 0.26 },
      { t: 'AGP1', x: 12.9, y: 13.0, s: 0.3 }, { t: 'PCI1', x: 10.8, y: 13.6, s: 0.26 }, { t: 'PCI5', x: 2.7, y: 13.6, s: 0.26 },
      { t: 'IDE1', x: 6.0, y: 22.3, s: 0.28 }, { t: 'IDE2', x: 12.0, y: 22.3, s: 0.28 }, { t: 'FDD1', x: 0.6, y: 22.5, s: 0.28 },
      { t: 'SATA1  SATA2', x: 3.0, y: 19.6, s: 0.24 }, { t: 'ATX_PWR', x: 19.0, y: 22.5, s: 0.28 }, { t: 'ATX12V', x: 28.2, y: 5.0, s: 0.26 },
      { t: 'BAT1', x: 9.0, y: 19.0, s: 0.26 }, { t: 'BIOS', x: 3.4, y: 16.2, s: 0.26 }, { t: 'CPU_FAN', x: 25.4, y: 15.3, s: 0.24 },
    ],
    socket: { type: 's478', x: 22.0, z: 8.0 },
    ram: { type: 'ddr', x: 22.4, latch: '#efefea', slots: [{ z: 17.5, color: '#3b4fa8' }, { z: 18.5, color: '#1a1a1a' }, { z: 19.7, color: '#3b4fa8' }, { z: 20.7, color: '#1a1a1a' }] },
    slots,
    ide: [{ x: 8.0, z: 23.2, color: '#1f3fa8' }, { x: 14.0, z: 23.2, color: '#1a1a1a' }],
    floppy: { x: 2.7, z: 23.4 },
    sata: [{ x: 3.6, z: 20.4, color: '#c1272d' }, { x: 5.0, z: 20.4, color: '#c1272d' }],
    atx: { pins: 20, x: 21.0, z: 23.6 },
    cpuPower: [{ pins: 4, x: 29.4, z: 4.0 }],
    chips: [
      { x: 14.8, z: 15.0, w: 3.0, d: 3.0, h: 0.2, kind: 'none', lines: ['KRN-865PE', 'MCH'], sink: 'fin', sw: 4.0, sd: 4.0, sh: 1.6, fins: 11, sinkColor: M.gold },
      { x: 7.0, z: 17.0, w: 2.2, d: 2.2, h: 0.15, kind: 'none', lines: ['KRN-SB5', 'G. Köprü'] },
      { x: 11.5, z: 20.4, w: 1.6, d: 1.6, lines: ['SÜPER I/O', 'W83627'] },
      { x: 19.4, z: 4.6, w: 1.0, d: 1.0, lines: ['LAN', '10/100'] },
      { x: 16.2, z: 5.0, w: 0.8, d: 0.8, lines: ['AC97'] },
    ],
    vrm: { toroids: [[27.4, 6.2], [27.4, 8.3], [27.4, 10.4], [29.0, 7.2], [29.0, 9.6]], mosfets: [[25.9, 5.8], [25.9, 7.2], [25.9, 8.6], [25.9, 10.0]] },
    caps: [
      { list: [18, 19, 20, 21, 22, 23, 24, 25].map((x) => [x, 13.4]), sleeve: '#1f3a8a', r: 0.4, h: 1.1 },
      { list: [[28.6, 12.6], [29.5, 12.6], [28.6, 13.6], [29.5, 13.6], [14.3, 4.0], [11.4, 17.5], [17.4, 20.4]], sleeve: '#151515', r: 0.4, h: 1.0 },
      { list: [[3.6, 3.0], [5.4, 3.0], [9.2, 3.0], [13.5, 6.0], [13.5, 7.0]], sleeve: '#8a2d1d', r: 0.3, h: 0.7 },
    ],
    battery: { x: 10.0, z: 17.5 },
    bios: { kind: 'plcc', x: 4.0, z: 15.2 },
    headers: [
      { x: 0.9, z: 17.0, cols: 5, rows: 2, rot: Math.PI / 2, color: '#151515' },
      { x: 0.9, z: 13.6, cols: 5, rows: 2, rot: Math.PI / 2, color: '#151515' },
      { x: 26.4, z: 14.5, cols: 3, rows: 1, color: '#f0eee6' },
    ],
    io: IO_2000,
  });
}

export function buildEra2000(opts = {}) {
  const color = opts.caseColor || 'beige';
  const asm = new Assembly('2000');
  const R = asm.root;
  const BS = [8.9, 3.5, -21.52];
  const { io, openings } = towerRearHoles(BS, 13.8, SLOT_X);
  const PSU_POS = [2.3, 34.3, -22.42 + 7.0];
  const FAN = { x: -1.0, y: 29.0, size: 8 };

  // --- kasa
  const kase = case2000({ color, rearHoles: [io, { x: PSU_POS[0], y: 38.6, w: 15.0, h: 8.6 }], slotOpenings: openings, fan: FAN });
  R.add(kase);
  const chassis = kase.children.find((c) => c.name === 'kasa');
  const cage = kase.children.find((c) => c.name === 'kafes');
  chassis.add(cage);
  asm.part('kasa', 'kasa', chassis, { layer: 9, tour: true, labelDy: 2 });
  asm.part('yanPanel', 'yanPanel', kase.children.find((c) => c.name === 'yanPanel'), { layer: 0, explode: [-30, 0, 0] });
  asm.part('onPanel', 'onPanel', kase.children.find((c) => c.name === 'onPanel'), { layer: 0, explode: [0, 0, 16] });

  // --- anakart
  const bs = boardSpace(R, 'tower', BS);
  const board = board2000();
  bs.add(board);
  asm.part('anakart', 'anakart', board, { layer: 8, explode: [0, 0, 0], tour: true });
  const A = board.userData.anchors;

  // --- işlemci + soğutucu
  const cpu = buildCPU('s478');
  cpu.position.copy(A.socket.position).setY(0);
  bs.add(cpu);
  asm.part('islemci', 'islemci', cpu, { layer: 5, explode: [0, 9, 0] });
  const cool = buildCooler('box478', cpu.userData.top);
  cool.position.copy(cpu.position);
  bs.add(cool);
  asm.part('sogutucu', 'sogutucu', cool, { layer: 3, explode: [0, 17, 0] });

  // --- RAM (2 x 512 MB, çift kanal: 1. ve 3. yuva)
  [0, 2].forEach((si, k) => {
    const m = buildRAM('ddr', { capacity: '512MB PC3200' });
    placeRAM(m, A['ram' + si].position.x, A['ram' + si].position.z, 'ddr');
    bs.add(m);
    asm.part('ram' + (k + 1), 'ram', m, { layer: 4, explode: [0, 11 + k * 2, 0], tour: k === 0 });
  });

  // --- AGP ekran kartı + slot kapakları
  const gpu = buildGPU('agp00', { fx: cardFx({ z0: 4.6 }) });
  placeCard(gpu, { x: SLOT_X[0] });
  bs.add(gpu);
  asm.part('ekranKarti', 'ekranKarti', gpu, { layer: 2, explode: [0, 20, 3] });
  const covers = new THREE.Group();
  for (let i = 1; i < 7; i++) { const c = slotCover({ vented: false }); placeCard(c, { x: SLOT_X[i] }); covers.add(c); }
  bs.add(covers);
  R.updateMatrixWorld(true);
  chassis.attach(covers);

  // --- sürücüler
  const dvd = buildOptical({ kind: 'dvd', bezel: color === 'beige' ? '#ddd4bb' : '#1d1e21', iface: 'ide' });
  dvd.position.set(0, 40.6 - 4.13 / 2, 24.9 - 9.0);
  asm.part('optik', 'optik', dvd, { layer: 1, explode: [-6, 0, 26] });
  const fdd = buildFloppy({ bezel: color === 'beige' ? '#ddd4bb' : '#1d1e21', black: color !== 'beige' });
  fdd.position.set(0, 24.2 - 1.27, 24.9 - 7.0);
  asm.part('disket', 'disket', fdd, { layer: 1, explode: [-6, 0, 22] });
  const hdd = buildHDD({ iface: 'sata', capacity: '160 GB', model: 'NT-160S', rpm: '7200' });
  hdd.position.set(0, 12.6, 21.9 - 7.35);
  asm.part('hdd', 'hdd', hdd, { layer: 1, explode: [-10, -1, 26] });

  // --- güç kaynağı
  const psu = buildPSU('atx00', { watts: 350 });
  psu.position.set(...PSU_POS);
  asm.part('psu', 'psu', psu, { layer: 6, explode: [-26, 4, 0] });

  // --- arka fan
  const rf = new THREE.Group();
  const fan = caseFan(8, { depth: 2.5, blades: 7 });
  fan.rotation.y = Math.PI;
  rf.add(fan);
  rf.position.set(FAN.x, FAN.y, -22.42 + 1.3);
  asm.part('fanArka', 'kasaFani', rf, { layer: 3, explode: [0, 0, -14] });

  R.updateMatrixWorld(true);

  // --- kablolar
  const P = psu.userData.anchors;
  const hddA = hdd.userData.anchors, dvdA = dvd.userData.anchors, fddA = fdd.userData.anchors;
  cable(asm, { from: P.atx, to: A.atx, style: 'atx20', kind: 'power', parts: ['psu', 'anakart'], label: '20-pin ATX güç', via: [[-0.5, 33.0, -2.0], [3.5, 27.5, 2.5]], axisTo: new THREE.Vector3(0, 1, 0) });
  cable(asm, { from: P.cpu, to: A.cpupwr0, style: 'p4', kind: 'power', parts: ['psu', 'anakart', 'islemci'], label: '4-pin ATX12V (işlemci gücü)', via: [[0.5, 33.6, -9.0], [5.0, 33.2, -15.0]], axisTo: new THREE.Vector3(0, 1, 0) });
  cable(asm, { from: P.periph, to: dvdA.power, style: 'molex', kind: 'power', parts: ['psu', 'optik'], label: 'Molex 4-pin güç', via: [[-1.5, 37.0, -3.5], [3.0, 39.2, 2.6]], axisTo: new THREE.Vector3(1, 0, 0) });
  cable(asm, { from: P.periph, to: fddA.power, style: 'berg', kind: 'power', parts: ['psu', 'disket'], label: 'Disket güç (mini 4-pin)', via: [[-2.5, 35.5, -4.0], [-0.5, 30.0, 4.0], [2.5, 25.0, 8.0]], axisTo: new THREE.Vector3(1, 0, 0) });
  cable(asm, { from: P.sata, to: hddA.power, style: 'sataPwr', kind: 'power', parts: ['psu', 'hdd'], label: 'SATA güç (15-pin)', via: [[-3.5, 34.5, -5.0], [-4.0, 24.0, 2.0], [-1.5, 16.0, 4.5]], axisTo: new THREE.Vector3(1, 0, 0) });
  cable(asm, { from: A.ide0, to: dvdA.data, style: 'ide', kind: 'data', parts: ['anakart', 'optik'], label: 'IDE (PATA) yassı kablo', via: [[4.0, 12.5, 4.0], [3.0, 24.0, 5.0], [-1.0, 35.2, 5.5]], startPlug: true, axisFrom: new THREE.Vector3(0, 1, 0), axisTo: new THREE.Vector3(1, 0, 0), up: [0, 0, 1], mid: 0.62 });
  cable(asm, { from: A.fdd, to: fddA.data, style: 'fdd', kind: 'data', parts: ['anakart', 'disket'], label: 'Disket yassı kablosu (34-pin)', via: [[4.5, 7.0, 4.5], [2.0, 15.0, 7.0], [-1.0, 20.8, 9.0]], startPlug: true, axisFrom: new THREE.Vector3(0, 1, 0), axisTo: new THREE.Vector3(1, 0, 0), up: [0, 0, 1] });
  cable(asm, { from: A.sata0, to: hddA.data, style: 'sataData', kind: 'data', parts: ['anakart', 'hdd'], label: 'SATA veri kablosu (7-pin)', via: [[4.0, 8.5, 2.5], [-1.5, 12.2, 5.0]], startPlug: true, axisFrom: new THREE.Vector3(0, 1, 0), axisTo: new THREE.Vector3(1, 0, 0), up: [0, 0, 1] });

  asm.regions = [
    { label: 'Anakart arka paneli', obj: board, local: new THREE.Vector3(30.2, 2.2, -0.8) },
    { label: 'Ekran kartı çıkışları', obj: gpu, local: new THREE.Vector3(-0.2, 11.6, 1.0) },
    { label: 'Güç girişi', obj: psu, local: new THREE.Vector3(-4.6, 8.0, -7.0) },
  ];
  asm.finalize();
  asm.boardSpace = bs;
  asm.board = board;
  asm.cameras = {
    front: { pos: [-46, 42, 104], target: [0, 19, 0] },
    rear: { pos: [-42, 38, -96], target: [0, 19, -8] },
    inside: { pos: [-100, 34, 14], target: [0, 20, -2] },
    io: { pos: [-6, 25, -48], target: [6, 25, -22] },
  };
  asm.center = new THREE.Vector3(0, 21, 0);
  return asm;
}
