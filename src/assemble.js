// Ortak montaj yardımcıları: parça kaydı, anakart yerleşimi, kablolar.
import * as THREE from 'three';
import { G, add, group, makeCurve, ribbonGeo, bundleGeos, tubeGeo, mergeStatic, V3 } from './geom.js';
import { M, mat } from './materials.js';
import { ribbonTex, sleeveTex } from './textures.js';
import { PCB_T } from './parts/board.js';

const PI = Math.PI;

export class Assembly {
  constructor(eraKey) {
    this.era = eraKey;
    this.root = new THREE.Group();
    this.root.name = 'era-' + eraKey;
    this.parts = [];
    this.cables = [];
    this.cableRoot = group(this.root, [0, 0, 0], null, 'kablolar');
  }

  // Parça kaydı. explode: üst-çerçevede kayma vektörü; layer: ayrılma sırası
  part(id, type, obj, { explode = [0, 0, 0], layer = 1, parent = this.root, labelDy = 1.5, tour = true, removeVec = null, name = null } = {}) {
    obj.userData.partId = id;
    obj.userData.partType = type;
    if (!obj.parent) parent.add(obj);
    const p = {
      id, type, obj, layer, tour, name,
      base: obj.position.clone(),
      explode: new THREE.Vector3(...explode),
      removeVec: removeVec ? new THREE.Vector3(...removeVec) : new THREE.Vector3(...explode).multiplyScalar(1.4),
      removed: 0, removedTarget: 0,
      labelDy,
    };
    this.parts.push(p);
    return p;
  }

  finalize() {
    for (const p of this.parts) {
      mergeStatic(p.obj);
      p.obj.traverse((o) => { if (o.isMesh) { o.userData.ownerPart = p.id; } });
    }
    this.root.updateMatrixWorld(true);
    for (const p of this.parts) {
      // etiket bağlantı noktası: yerel sınır kutusunun üst merkezi
      const box = new THREE.Box3();
      const inv = new THREE.Matrix4().copy(p.obj.matrixWorld).invert();
      p.obj.traverse((o) => {
        if (o.isMesh && o.geometry && o.visible && !o.userData.noBounds) {
          o.geometry.computeBoundingBox();
          const b = o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
          box.union(b);
        }
      });
      p.localBox = box;
      p.labelLocal = box.getCenter(new THREE.Vector3());
    }
    return this;
  }
}

// ---------------------------------------------------------------- Anakart yerleşimi
// 'tower': kart dikey, bileşenler -x'e bakar; 'desktop': kart yatay, bileşenler +y
export function boardSpace(parent, mode, pos) {
  const bs = new THREE.Group();
  bs.name = 'boardSpace';
  bs.position.set(...pos);
  if (mode === 'tower') {
    bs.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(0, 1, 0), V3(-1, 0, 0), V3(0, 0, 1)));
  }
  parent.add(bs);
  return bs;
}

// Kart -> anakart çerçevesi
export const CARD_Y0 = PCB_T + 1.1;
export const REAR_Z = -0.9;
export function placeCard(card, slot) {
  card.rotation.set(0, -PI / 2, 0);
  card.position.set(slot.x, CARD_Y0, REAR_Z + 0.08);
  return card;
}
export function cardFx(slot) { return (slot.z0 ?? 4.6) - (REAR_Z + 0.08); }

export function placeRAM(mod, x, z, type) {
  mod.position.set(x, PCB_T + (type === 'simm72' ? 0.5 : 0.42), z);
  return mod;
}

// Kasa arka paneli için delikler (dünya koordinatı), kule modu
export function towerRearHoles(bsPos, ioX0, slots) {
  const [bx, by] = bsPos;
  // I/O: anakart x -> dünya y, anakart Y -> dünya -x
  const io = { x: bx - (4.445 / 2 - 0.25), y: by + ioX0 + 15.875 / 2, w: 4.6, h: 16.0 };
  const openings = slots.map((x) => ({ x: bx - (CARD_Y0 + 5.0), y: by + x - 0.85, w: 10.6, h: 1.55 }));
  return { io, openings };
}

// ---------------------------------------------------------------- Kablolar
const WIRE = { y: '#e6c41a', r: '#c8221d', k: '#151515', o: '#e7781b', g: '#2a8a3a', b: '#2747a8', w: '#e8e8e8', p: '#7a3fa0', gr: '#8a8a8a' };

function worldAnchor(o) {
  o.updateWorldMatrix(true, false);
  const p = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
  const q = new THREE.Quaternion();
  o.getWorldQuaternion(q);
  const d = (o.userData.dir ? o.userData.dir.clone() : new THREE.Vector3(0, 1, 0)).applyQuaternion(q).normalize();
  return { p, d };
}

function plug(parent, p, dir, size, material, axisHint) {
  const [a, b, len] = size;
  const m = add(parent, G.rbox(a, b, len, 0.06), material, [0, 0, 0]);
  const z = dir.clone().normalize();
  let x = axisHint ? axisHint.clone() : new THREE.Vector3(0, 1, 0);
  x.sub(z.clone().multiplyScalar(x.dot(z)));
  if (x.lengthSq() < 1e-4) x = new THREE.Vector3(1, 0, 0).sub(z.clone().multiplyScalar(z.x));
  x.normalize();
  const y = new THREE.Vector3().crossVectors(z, x);
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  m.position.copy(p).addScaledVector(z, len / 2);
  return m;
}

const STYLES = {
  atx20: { kind: 'bundle', wires: 'o o k r k r k gr y y o k k k g k k r r w'.split(' ').map((c) => WIRE[c]), rows: 2, r: 0.085, plug: [4.4, 1.1, 1.6], plugColor: '#f0eee6' },
  atx24: { kind: 'bundle', wires: 'o o k r k r k gr y y o o o k k k g k k r r r w k'.split(' ').map((c) => WIRE[c]), rows: 2, r: 0.085, plug: [5.2, 1.1, 1.6], plugColor: '#f0eee6' },
  p4: { kind: 'bundle', wires: ['y', 'y', 'k', 'k'].map((c) => WIRE[c]), rows: 2, r: 0.09, plug: [0.95, 0.95, 1.6], plugColor: '#f0eee6' },
  eps8: { kind: 'bundle', wires: 'y y y y k k k k'.split(' ').map((c) => WIRE[c]), rows: 2, r: 0.09, plug: [1.8, 0.95, 1.6], plugColor: '#f0eee6' },
  molex: { kind: 'bundle', wires: ['y', 'k', 'k', 'r'].map((c) => WIRE[c]), rows: 1, r: 0.09, plug: [2.2, 0.8, 1.2], plugColor: '#f2efe4' },
  berg: { kind: 'bundle', wires: ['y', 'k', 'k', 'r'].map((c) => WIRE[c]), rows: 1, r: 0.06, plug: [1.1, 0.45, 0.9], plugColor: '#f2efe4' },
  sataPwr: { kind: 'bundle', wires: ['y', 'k', 'r', 'k', 'o'].map((c) => WIRE[c]), rows: 1, r: 0.07, plug: [2.4, 0.55, 1.0], plugColor: '#151515' },
  pcie8: { kind: 'bundle', wires: 'y y y k k k k k'.split(' ').map((c) => WIRE[c]), rows: 2, r: 0.09, plug: [1.8, 0.95, 1.6], plugColor: '#151515' },
  sleeve24: { kind: 'sleeve', n: 24, rows: 2, r: 0.16, plug: [5.3, 1.1, 1.8], plugColor: '#151515' },
  sleeve8: { kind: 'sleeve', n: 8, rows: 2, r: 0.16, plug: [1.9, 1.0, 1.8], plugColor: '#151515' },
  sleeve16: { kind: 'sleeve', n: 12, rows: 2, r: 0.14, plug: [2.0, 0.9, 1.7], plugColor: '#151515' },
  sataData: { kind: 'flat', width: 0.85, thick: 0.28, color: '#c1272d', plug: [1.2, 0.6, 1.2], plugColor: '#c1272d' },
  ide: { kind: 'ribbon', width: 5.1, thick: 0.1, wires: 80, plug: [5.6, 0.9, 1.0], plugColor: '#1a1a1a' },
  fdd: { kind: 'ribbon', width: 4.3, thick: 0.1, wires: 34, plug: [4.9, 0.9, 1.0], plugColor: '#1a1a1a' },
  fan3: { kind: 'bundle', wires: ['k', 'r', 'y'].map((c) => WIRE[c]), rows: 1, r: 0.05, plug: [0.8, 0.4, 0.6], plugColor: '#f0eee6' },
  usbHdr: { kind: 'sleeve', n: 1, rows: 1, r: 0.35, plug: [1.2, 0.7, 1.4], plugColor: '#151515' },
};

export function cable(asm, { from, to, via = [], style, kind, parts = [], label = '', lead = [2.5, 2.5], axisFrom, axisTo, mid = null, startPlug = false, up }) {
  const st = STYLES[style];
  const A = from.p ? from : worldAnchor(from);
  const B = to.p ? to : worldAnchor(to);
  const pts = [A.p.clone(), A.p.clone().addScaledVector(A.d, lead[0]), ...via.map((v) => V3(...v)), B.p.clone().addScaledVector(B.d, lead[1]), B.p.clone()];
  const curve = makeCurve(pts);
  const g = new THREE.Group();
  g.userData.cable = { kind, parts, label, style };
  g.userData.mergeRoot = true;
  const len = curve.getLength();
  const n = Math.max(40, Math.round(len * 3));
  const mats = [];
  const own = (m) => { const c = m.clone(); c.userData.cableMat = true; mats.push(c); return c; };
  const upv = up ? V3(...up) : (axisTo ? axisTo.clone() : undefined);
  if (st.kind === 'bundle' || st.kind === 'sleeve') {
    const count = st.kind === 'sleeve' ? st.n : st.wires.length;
    const rows = st.rows;
    const cols = Math.ceil(count / rows);
    const sp = st.r * 2.1;
    const offs = [];
    for (let i = 0; i < count; i++) {
      const c = Math.floor(i / rows), r = i % rows;
      offs.push({ ox: (r - (rows - 1) / 2) * sp, oy: (c - (cols - 1) / 2) * sp });
    }
    const geos = bundleGeos(curve, offs, st.r, n, upv);
    if (st.kind === 'sleeve') {
      const sm = own(new THREE.MeshStandardMaterial({ color: '#ffffff', map: sleeveTex('blk', {}), roughness: 0.6 }));
      sm.map.repeat.set(1, 40);
      geos.forEach((geo) => add(g, geo, sm, [0, 0, 0]));
    } else {
      const byColor = new Map();
      geos.forEach((geo, i) => {
        const c = st.wires[i];
        if (!byColor.has(c)) byColor.set(c, own(mat(c, 0.45)));
        add(g, geo, byColor.get(c), [0, 0, 0]);
      });
    }
  } else if (st.kind === 'ribbon') {
    const tex = ribbonTex(style, { wires: st.wires / 2 });
    const rm = own(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, side: THREE.DoubleSide }));
    add(g, ribbonGeo(curve, st.width, st.thick, n * 2, upv), rm, [0, 0, 0]);
  } else if (st.kind === 'flat') {
    add(g, ribbonGeo(curve, st.width, st.thick, n, upv), own(mat(st.color, 0.4)), [0, 0, 0]);
  }
  const pm = own(mat(st.plugColor, 0.5));
  plug(g, B.p, B.d, st.plug, pm, axisTo);
  if (startPlug) plug(g, A.p, A.d, st.plug, pm, axisFrom);
  if (mid) {
    // ara konnektör (ör. IDE kablosundaki ikinci cihaz soketi)
    const t = mid;
    const p = curve.getPointAt(t), tan = curve.getTangentAt(t);
    const m = add(g, G.box(st.plug[0], st.plug[1], 1.0), pm, [p.x, p.y, p.z]);
    m.lookAt(p.clone().add(tan));
  }
  g.userData.mats = mats;
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noBounds = true; } });
  asm.cableRoot.add(g);
  asm.cables.push({ obj: g, kind, parts, label, mats, curve, end: B.p.clone() });
  return g;
}

// Masaüstü (yatay) kasa için arka panel delikleri: kart yatay, bileşenler +y
export function desktopRearHoles(bsPos, ioX0, slots) {
  const [bx, by] = bsPos;
  const io = { x: bx + ioX0 + 15.875 / 2, y: by + 1.97, w: 16.0, h: 4.6 };
  const openings = slots.map((x) => ({ x: bx + x - 0.85, y: by + CARD_Y0 + 5.0, w: 1.55, h: 10.6 }));
  return { io, openings };
}
