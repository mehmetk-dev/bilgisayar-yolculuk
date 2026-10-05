// 1990'lar temsilî sistemi (~1997): Socket 7 Pentium sınıfı, 72-pin EDO SIMM, PCI VGA, ISA ses kartı + modem,
// IDE sabit disk, 1,44 MB disket, CD-ROM, bej yatay masaüstü kasa.
import * as THREE from 'three';
import { Assembly, boardSpace, placeCard, cardFx, placeRAM, desktopRearHoles, cable } from '../assemble.js';
import { buildBoard, PCB_T, pinHeader } from '../parts/board.js';
import { buildCPU, buildCooler } from '../parts/cpu.js';
import { buildRAM } from '../parts/ram.js';
import { buildGPU, buildSoundCard, buildModem, slotCover } from '../parts/cards.js';
import { buildHDD, buildFloppy, buildOptical } from '../parts/drives.js';
import { buildPSU } from '../parts/psu.js';
import { case1990 } from '../parts/cases.js';
import { M, mat, PC99 } from '../materials.js';
import { G, add, arrayGeo } from '../geom.js';

export const SLOT_X = [12.6, 10.568, 8.536, 6.504, 4.472, 2.44, 0.408];

export const IO_1990 = {
  x0: 13.8,
  cols: [
    { x: 28.3, items: [{ t: 'ps2kb' }, { t: 'ps2mouse' }] },
    { x: 26.4, items: [{ t: 'usb1', n: 2 }] },
    { x: 21.9, items: [{ t: 'serial' }, { t: 'parallel' }] },
    { x: 17.6, items: [{ t: 'serial' }] },
  ],
};

export function board1990() {
  return buildBoard({
    model: 'VERTEKS P5-TX97', modelPos: [0.6, 21.0], seed: 1997,
    pcb: { base: '#1e5a2f', trace: '#2d7a45', silk: '#eceee0', density: 1.1 },
    labels: [
      { t: 'SOCKET 7', x: 17.6, y: 6.6, s: 0.3 }, { t: 'SIMM1', x: 15.0, y: 15.9, s: 0.26 }, { t: 'SIMM4', x: 15.0, y: 19.1, s: 0.26 },
      { t: 'PCI1', x: 12.9, y: 13.5, s: 0.26 }, { t: 'ISA1', x: 4.8, y: 18.7, s: 0.26 }, { t: 'IDE1', x: 9.6, y: 22.5, s: 0.28 },
      { t: 'IDE2', x: 15.7, y: 22.5, s: 0.28 }, { t: 'FDC', x: 3.6, y: 22.5, s: 0.28 }, { t: 'ATX POWER', x: 22.6, y: 22.5, s: 0.26 },
      { t: 'JP1-JP6 CPU AYARI', x: 18.4, y: 13.2, s: 0.22 }, { t: 'L2 CACHE 512K', x: 14.2, y: 7.8, s: 0.22 },
    ],
    socket: { type: 's7', x: 20.5, z: 10.0 },
    ram: { type: 'simm72', x: 22.5, slots: [15.8, 16.8, 17.8, 18.8].map((z) => ({ z })) },
    slots: [...[0, 1, 2, 3].map((i) => ({ type: 'pci', x: SLOT_X[i] })), ...[4, 5, 6].map((i) => ({ type: 'isa', x: SLOT_X[i] }))],
    ide: [{ x: 11.5, z: 23.4 }, { x: 17.6, z: 23.4 }],
    floppy: { x: 5.5, z: 23.4 },
    atx: { pins: 20, x: 24.6, z: 23.6 },
    chips: [
      { x: 14.6, z: 15.0, w: 2.8, d: 2.8, lines: ['KRN-430TX', 'KUZEY K.', '9714'] },
      { x: 8.0, z: 19.6, w: 2.4, d: 2.4, lines: ['KRN-PIIX', 'GÜNEY K.'] },
      { x: 11.0, z: 19.6, w: 1.6, d: 1.6, lines: ['SÜPER I/O'] },
      { x: 17.0, z: 4.6, w: 2.4, d: 1.0, lines: ['KBC 8042'], kind: 'dip' },
      { x: 15.6, z: 9.0, w: 2.0, d: 0.9, lines: ['SRAM 32Kx32'], kind: 'tsop' },
      { x: 15.6, z: 10.5, w: 2.0, d: 0.9, lines: ['SRAM 32Kx32'], kind: 'tsop' },
      { x: 15.6, z: 12.0, w: 1.4, d: 0.75, lines: ['TAG'], kind: 'dip' },
      { x: 16.6, z: 6.4, w: 0.9, d: 0.6, lines: ['SAAT'], kind: 'dip' },
    ],
    vrm: { sinks: [{ x: 25.8, z: 5.2, w: 2.4, d: 1.4, h: 2.0, fins: 7, axis: 'x', color: M.aluminum }] },
    caps: [
      { list: [[24.5, 7.0], [27.3, 6.0], [27.3, 7.2], [27.3, 8.4], [24.6, 13.6], [12.6, 18.4], [3.0, 20.2], [6.4, 21.6], [27.8, 21.0]], sleeve: '#1d4a8a', r: 0.4, h: 1.1 },
      { list: [[18.0, 5.0], [19.0, 5.0], [20.0, 5.0], [9.6, 16.8], [13.0, 6.0]], sleeve: '#151515', r: 0.3, h: 0.8 },
    ],
    battery: { x: 13.8, z: 21.4 },
    bios: { kind: 'dip', x: 5.5, z: 20.9 },
    headers: [
      { x: 1.0, z: 19.5, cols: 8, rows: 2, rot: Math.PI / 2, color: '#151515' },
      { x: 19.5, z: 14.0, cols: 6, rows: 3, color: '#151515' },
      { x: 23.6, z: 13.8, cols: 3, rows: 1, color: '#f0eee6' },
    ],
    extra: [
      (of) => {
        // atlama teli (jumper) kapakları: işlemci frekansı ve voltajı böyle ayarlanırdı
        add(of, arrayGeo(G.box(0.48, 0.55, 0.24), [[18.99, 0, 13.75], [19.75, 0, 14.0], [20.25, 0, 14.25]].map(([x, y, z]) => [x, PCB_T + 0.55, z])), mat('#2346a6', 0.45));
      },
    ],
    io: IO_1990,
  });
}

export function buildEra1990(opts = {}) {
  const asm = new Assembly('1990');
  const R = asm.root;
  const BS = [-19.6, 0.7, -20.52];
  const { io, openings } = desktopRearHoles(BS, 13.8, SLOT_X);
  const PSU_POS = [13.4, 5.6, -21.42 + 7.0];
  const kase = case1990({ rearHoles: [io, { x: PSU_POS[0], y: PSU_POS[1] + 4.3, w: 15.0, h: 8.6 }], slotOpenings: openings });
  R.add(kase);
  const pick = (n) => kase.children.find((c) => c.name === n);
  const chassis = pick('kasa');
  asm.part('kasa', 'kasa', chassis, { layer: 9 });
  asm.part('yanPanel', 'yanPanel', pick('yanPanel'), { layer: 0, explode: [0, 22, 0] });
  asm.part('onPanel', 'onPanel', pick('onPanel'), { layer: 0, explode: [0, 0, 16] });

  const bs = boardSpace(R, 'desktop', BS);
  const board = board1990();
  bs.add(board);
  asm.part('anakart', 'anakart', board, { layer: 8 });
  const A = board.userData.anchors;

  const cpu = buildCPU('s7');
  cpu.position.copy(A.socket.position).setY(0);
  bs.add(cpu);
  asm.part('islemci', 'islemci', cpu, { layer: 5, explode: [0, 9, 0] });
  const cool = buildCooler('pinfin', cpu.userData.top);
  cool.position.copy(cpu.position);
  bs.add(cool);
  asm.part('sogutucu', 'sogutucu', cool, { layer: 3, explode: [0, 15, 0] });

  [0, 1].forEach((si, k) => {
    const m = buildRAM('simm72', { capacity: '16MB EDO 60ns' });
    placeRAM(m, A['ram' + si].position.x, A['ram' + si].position.z, 'simm72');
    bs.add(m);
    asm.part('ram' + (k + 1), 'ram', m, { layer: 4, explode: [0, 11 + k * 3, 0], tour: k === 0 });
  });

  const fx = cardFx({ z0: 4.6 });
  const gpu = buildGPU('pci90', { fx });
  placeCard(gpu, { x: SLOT_X[0] });
  bs.add(gpu);
  asm.part('ekranKarti', 'ekranKarti', gpu, { layer: 2, explode: [0, 20, 0] });
  const snd = buildSoundCard({ fx });
  placeCard(snd, { x: SLOT_X[4] });
  bs.add(snd);
  asm.part('sesKarti', 'sesKarti', snd, { layer: 2, explode: [0, 24, 0] });
  const mdm = buildModem({ fx });
  placeCard(mdm, { x: SLOT_X[5] });
  bs.add(mdm);
  asm.part('modem', 'modem', mdm, { layer: 2, explode: [0, 28, 0] });
  const covers = new THREE.Group();
  for (const i of [1, 2, 3, 6]) { const c = slotCover({ vented: false }); placeCard(c, { x: SLOT_X[i] }); covers.add(c); }
  bs.add(covers);
  R.updateMatrixWorld(true);
  chassis.attach(covers);

  const cd = buildOptical({ kind: 'cd', bezel: '#d3c8aa', iface: 'ide', legacy: true });
  cd.position.set(12.0, 11.6 - 4.13 / 2, 23.5 - 9.0);
  asm.part('optik', 'optik', cd, { layer: 1, explode: [0, 4, 24] });
  const fdd = buildFloppy({ bezel: '#d3c8aa' });
  fdd.position.set(-1.5, 11.75 - 1.27, 23.5 - 7.0);
  asm.part('disket', 'disket', fdd, { layer: 1, explode: [0, 6, 22] });
  const hdd = buildHDD({ iface: 'ide', capacity: '2,1 GB', model: 'NT-2100A', rpm: '5400' });
  hdd.position.set(-1.5, 7.55, 21.3 - 7.35);
  asm.part('hdd', 'hdd', hdd, { layer: 1, explode: [-4, 2, 26] });

  const psu = buildPSU('at90', { watts: 200 });
  psu.position.set(...PSU_POS);
  asm.part('psu', 'psu', psu, { layer: 6, explode: [20, 12, 0] });

  R.updateMatrixWorld(true);
  const P = psu.userData.anchors;
  const hA = hdd.userData.anchors, cA = cd.userData.anchors, fA = fdd.userData.anchors;
  const X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
  cable(asm, { from: P.atx, to: A.atx, style: 'atx20', kind: 'power', parts: ['psu', 'anakart'], label: '20-pin ATX güç', via: [[8.5, 7.6, -3.0], [5.5, 6.4, 1.2]], axisTo: X });
  cable(asm, { from: P.periph, to: cA.power, style: 'molex', kind: 'power', parts: ['psu', 'optik'], label: 'Molex 4-pin güç (CD-ROM)', via: [[11.0, 9.2, -3.5], [15.5, 11.2, 1.8]], axisTo: X });
  cable(asm, { from: P.periph, to: hA.power, style: 'molex', kind: 'power', parts: ['psu', 'hdd'], label: 'Molex 4-pin güç (sabit disk)', via: [[7.5, 8.0, -3.0], [3.8, 8.6, 2.6]], axisTo: X });
  cable(asm, { from: P.periph, to: fA.power, style: 'berg', kind: 'power', parts: ['psu', 'disket'], label: 'Disket güç (mini 4-pin)', via: [[7.0, 9.4, -3.0], [3.4, 11.6, 4.5]], axisTo: X });
  cable(asm, { from: A.ide0, to: hA.data, style: 'ide', kind: 'data', parts: ['anakart', 'hdd'], label: 'IDE yassı kablo (birincil kanal)', via: [[-7.2, 5.0, 4.6]], startPlug: true, axisFrom: X, axisTo: X, up: [0, 0, 1], mid: 0.55 });
  cable(asm, { from: A.ide1, to: cA.data, style: 'ide', kind: 'data', parts: ['anakart', 'optik'], label: 'IDE yassı kablo (ikincil kanal)', via: [[1.0, 6.2, 4.0], [8.0, 10.2, 3.6]], startPlug: true, axisFrom: X, axisTo: X, up: [0, 0, 1] });
  cable(asm, { from: A.fdd, to: fA.data, style: 'fdd', kind: 'data', parts: ['anakart', 'disket'], label: 'Disket yassı kablosu (34-pin)', via: [[-12.0, 5.0, 5.6], [-5.6, 10.6, 6.8]], startPlug: true, axisFrom: X, axisTo: X, up: [0, 0, 1] });
  // CD ses kablosu: CD-ROM'dan ses kartına analog ses
  const cdAudio = { p: cd.localToWorld(new THREE.Vector3(-5.6, 1.5, -9.4)), d: new THREE.Vector3(0, 0, -1) };
  const sndIn = { p: snd.localToWorld(new THREE.Vector3(16.5, 8.9, 0.6)), d: new THREE.Vector3(0, 1, 0) };
  cable(asm, { from: cdAudio, to: sndIn, style: 'fan3', kind: 'data', parts: ['optik', 'sesKarti'], label: 'CD ses kablosu (analog)', via: [[2.0, 13.4, 2.0], [-12.0, 13.2, -3.0]], axisTo: Z });

  asm.regions = [
    { label: 'Anakart arka paneli', obj: board, local: new THREE.Vector3(21.7, 4.6, -0.8) },
    { label: 'Ekran kartı (VGA)', obj: gpu, local: new THREE.Vector3(-0.2, 10.5, 1.0) },
    { label: 'Ses kartı', obj: snd, local: new THREE.Vector3(-0.2, 10.8, 1.0) },
    { label: 'Modem', obj: mdm, local: new THREE.Vector3(-0.2, 9.5, 1.0) },
    { label: 'Güç girişi ve monitör çıkışı', obj: psu, local: new THREE.Vector3(-4.6, 8.0, -7.0) },
  ];
  asm.finalize();
  asm.boardSpace = bs;
  asm.board = board;
  asm.cameras = {
    front: { pos: [-48, 38, 92], target: [0, 6, 0] },
    rear: { pos: [-40, 36, -88], target: [0, 6, -8] },
    inside: { pos: [-28, 72, 52], target: [0, 4, -2] },
    io: { pos: [-2, 12, -52], target: [0, 4, -21] },
  };
  asm.center = new THREE.Vector3(0, 7, 0);
  return asm;
}
