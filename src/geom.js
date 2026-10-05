// Geometri yardımcıları. Birim: santimetre.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const cache = new Map();
function cached(key, fn) {
  let g = cache.get(key);
  if (!g) { g = fn(); g.userData.shared = true; cache.set(key, g); }
  return g;
}
const r4 = (v) => Math.round(v * 1e4) / 1e4;

export const G = {
  box: (w, h, d) => cached(`b${r4(w)},${r4(h)},${r4(d)}`, () => new THREE.BoxGeometry(w, h, d)),
  rbox: (w, h, d, r = 0.1, s = 2) => {
    const rr = Math.max(0.001, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
    return cached(`rb${r4(w)},${r4(h)},${r4(d)},${r4(rr)},${s}`, () => new RoundedBoxGeometry(w, h, d, s, rr));
  },
  cyl: (rt, rb, h, seg = 24, open = false) => cached(`c${r4(rt)},${r4(rb)},${r4(h)},${seg},${open}`, () => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open)),
  torus: (r, t, rs = 8, ts = 32, arc = Math.PI * 2) => cached(`t${r4(r)},${r4(t)},${rs},${ts},${r4(arc)}`, () => new THREE.TorusGeometry(r, t, rs, ts, arc)),
  sphere: (r, s = 16) => cached(`s${r4(r)},${s}`, () => new THREE.SphereGeometry(r, s, Math.max(6, s * 0.6))),
  plane: (w, h) => cached(`p${r4(w)},${r4(h)}`, () => new THREE.PlaneGeometry(w, h)),
  ring: (ri, ro, s = 48) => cached(`r${r4(ri)},${r4(ro)},${s}`, () => new THREE.RingGeometry(ri, ro, s)),
  circle: (r, s = 48) => cached(`ci${r4(r)},${s}`, () => new THREE.CircleGeometry(r, s)),
};

// Mesh ekle: add(parent, geo, mat, [x,y,z], [rx,ry,rz])
export function add(parent, geo, material, pos = [0, 0, 0], rot = null, opts = {}) {
  const m = new THREE.Mesh(geo, material);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  if (opts.scale) m.scale.set(...opts.scale);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.receive ?? true;
  if (opts.keep) m.userData.keep = true;
  if (opts.name) m.name = opts.name;
  parent.add(m);
  return m;
}

export function group(parent, pos = [0, 0, 0], rot = null, name = '') {
  const g = new THREE.Group();
  g.position.set(...pos);
  if (rot) g.rotation.set(...rot);
  g.name = name;
  if (parent) parent.add(g);
  return g;
}

// ---------------------------------------------------------------- Şekiller
export function rrectShape(w, h, r, cx = 0, cy = 0) {
  const s = new THREE.Shape();
  const x = cx - w / 2, y = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
export function rrectPath(w, h, r, cx = 0, cy = 0) {
  const p = new THREE.Path();
  const x = cx - w / 2, y = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
  return p;
}
export function circlePath(r, cx = 0, cy = 0, seg = 32) {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
}
// D-sub (trapez) şekli: üst geniş, alt dar
export function dShape(wTop, wBot, h, r = 0.08) {
  const s = new THREE.Shape();
  const t = wTop / 2, b = wBot / 2, hh = h / 2;
  s.moveTo(-b + r, -hh);
  s.lineTo(b - r, -hh); s.quadraticCurveTo(b, -hh, b + r * 0.3, -hh + r);
  s.lineTo(t - r * 0.3, hh - r); s.quadraticCurveTo(t, hh, t - r, hh);
  s.lineTo(-t + r, hh); s.quadraticCurveTo(-t, hh, -t + r * 0.3, hh - r);
  s.lineTo(-b - r * 0.3, -hh + r); s.quadraticCurveTo(-b, -hh, -b + r, -hh);
  return s;
}
export function dPath(wTop, wBot, h, r = 0.08) {
  const s = dShape(wTop, wBot, h, r);
  const p = new THREE.Path(); p.curves = s.curves; p.currentPoint = s.currentPoint;
  return p;
}
export function polyShape(pts) {
  const s = new THREE.Shape();
  pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
  s.closePath();
  return s;
}
export function polyPath(pts) {
  const s = new THREE.Path();
  pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
  s.closePath();
  return s;
}

// Şekli Z yönünde (0..depth) çıkar
export function extrude(shape, depth, bevel = 0, curveSegments = 10) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments,
  });
  return g;
}

// ---------------------------------------------------------------- Tekrarlı parçalar
// Birçok kopyayı tek geometride birleştir (ör. kanatçık, pin)
export function arrayGeo(geo, transforms) {
  const list = transforms.map(([x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1]) => {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
    g.applyMatrix4(m);
    return g;
  });
  return mergeGeometries(list, false);
}

export function grid(nx, ny, dx, dy, fn) {
  const out = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const r = fn ? fn(i, j) : true;
    if (r === false) continue;
    out.push([(i - (nx - 1) / 2) * dx, 0, (j - (ny - 1) / 2) * dy]);
  }
  return out;
}

// ---------------------------------------------------------------- Statik birleştirme (draw call azaltma)
// mergeRoot işaretli grupların altındaki (keep olmayan) meshleri malzemeye göre birleştirir.
export function mergeStatic(root) {
  root.updateMatrixWorld(true);
  const roots = [];
  root.traverse((o) => { if (o === root || o.userData.mergeRoot) roots.push(o); });
  if (!roots.includes(root)) roots.unshift(root);
  for (const mr of roots) {
    const inv = new THREE.Matrix4().copy(mr.matrixWorld).invert();
    const buckets = new Map();
    const victims = [];
    const visit = (o) => {
      for (const c of o.children) {
        if (c.userData.mergeRoot || c.userData.keep || c.isInstancedMesh || c.isSkinnedMesh || c.isLight || c.isLine) continue;
        if (c.isMesh && !Array.isArray(c.material) && c.visible) {
          const key = c.material.uuid + '|' + (c.castShadow ? 1 : 0);
          if (!buckets.has(key)) buckets.set(key, { mat: c.material, cast: c.castShadow, geos: [] });
          let g = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone();
          for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
          if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
          if (!g.attributes.normal) g.computeVertexNormals();
          g.clearGroups();
          g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, c.matrixWorld));
          buckets.get(key).geos.push(g);
          victims.push(c);
        }
        if (!c.isMesh || c.children.length) visit(c);
      }
    };
    visit(mr);
    let total = 0;
    for (const b of buckets.values()) total += b.geos.length;
    if (total < 2) continue;
    for (const v of victims) {
      // çocukları korumak için meshleri boş gruba dönüştür
      if (v.children.length) {
        const holder = new THREE.Group();
        holder.position.copy(v.position); holder.quaternion.copy(v.quaternion); holder.scale.copy(v.scale);
        holder.userData = v.userData;
        while (v.children.length) holder.add(v.children[0]);
        v.parent.add(holder);
      }
      v.parent.remove(v);
      if (!v.geometry.userData.shared) v.geometry.dispose();
    }
    for (const b of buckets.values()) {
      const merged = mergeGeometries(b.geos, false);
      b.geos.forEach((g) => g.dispose());
      if (!merged) continue;
      merged.computeBoundingSphere();
      const m = new THREE.Mesh(merged, b.mat);
      // küçük parçalar gölge çizmez (performans)
      m.castShadow = b.cast && merged.boundingSphere.radius > 1.2; m.receiveShadow = true;
      m.userData.merged = true;
      mr.add(m);
    }
  }
  return root;
}

// ---------------------------------------------------------------- Kablolar
// Paralel taşıma çerçeveleri (bükülmesiz)
export function transportFrames(curve, n, up0) {
  const T = [], N = [], B = [];
  for (let i = 0; i <= n; i++) T.push(curve.getTangentAt(i / n).normalize());
  let nrm = up0 ? up0.clone() : new THREE.Vector3(0, 1, 0);
  nrm.sub(T[0].clone().multiplyScalar(nrm.dot(T[0])));
  if (nrm.lengthSq() < 1e-6) nrm = new THREE.Vector3(1, 0, 0).sub(T[0].clone().multiplyScalar(T[0].x));
  nrm.normalize();
  for (let i = 0; i <= n; i++) {
    if (i > 0) {
      const ax = new THREE.Vector3().crossVectors(T[i - 1], T[i]);
      const l = ax.length();
      if (l > 1e-6) {
        ax.divideScalar(l);
        const ang = Math.acos(THREE.MathUtils.clamp(T[i - 1].dot(T[i]), -1, 1));
        nrm.applyAxisAngle(ax, ang);
      }
    }
    N.push(nrm.clone());
    B.push(new THREE.Vector3().crossVectors(T[i], nrm).normalize());
  }
  return { T, N, B };
}

export function makeCurve(points) {
  return new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))), false, 'centripetal', 0.5);
}

// Yassı şerit (IDE, SATA, disket kablosu)
export function ribbonGeo(curve, width, thick, n = 120, up0) {
  const { T, N, B } = transportFrames(curve, n, up0);
  const pos = [], uv = [], idx = [];
  const len = curve.getLength();
  for (let i = 0; i <= n; i++) {
    const p = curve.getPointAt(i / n);
    const s = B[i], u = N[i];
    const corners = [
      p.clone().addScaledVector(s, -width / 2).addScaledVector(u, thick / 2),
      p.clone().addScaledVector(s, width / 2).addScaledVector(u, thick / 2),
      p.clone().addScaledVector(s, width / 2).addScaledVector(u, -thick / 2),
      p.clone().addScaledVector(s, -width / 2).addScaledVector(u, -thick / 2),
    ];
    for (const c of corners) pos.push(c.x, c.y, c.z);
    const v = (i / n) * len / 4;
    uv.push(0, v, 1, v, 1, v, 0, v);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 4, b = (i + 1) * 4;
    const quad = (p, q) => { idx.push(a + p, b + p, b + q, a + p, b + q, a + q); };
    quad(0, 1); quad(1, 2); quad(2, 3); quad(3, 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Kablo demeti: tek eğri boyunca birden çok tel
export function bundleGeos(curve, wires, radius, n = 90, up0) {
  // wires: [{ox, oy}] ofsetler (cm)
  const { N, B } = transportFrames(curve, n, up0);
  return wires.map((w) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = curve.getPointAt(i / n);
      p.addScaledVector(N[i], w.ox).addScaledVector(B[i], w.oy);
      pts.push(p);
    }
    const c = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(c, n, w.r || radius, 6, false);
  });
}

export function tubeGeo(curve, radius, n = 80, radial = 8) {
  return new THREE.TubeGeometry(curve, n, radius, radial, false);
}

// ---------------------------------------------------------------- Fan kanadı
export function bladeGeo(hubR, tipR, sweep = 0.9, chord = 0.75, pitch = 0.7, nu = 6, nv = 6) {
  const pos = [], idx = [], uv = [];
  for (let i = 0; i <= nu; i++) {
    const u = i / nu;
    const r = hubR + (tipR - hubR) * u;
    for (let j = 0; j <= nv; j++) {
      const v = j / nv;
      const ch = chord * (0.75 + 0.25 * u);
      const a = sweep * u * 0.35 + (v - 0.5) * ch;
      const z = (v - 0.5) * pitch * (1 - 0.35 * u) + Math.sin(v * Math.PI) * 0.05;
      pos.push(Math.cos(a) * r, Math.sin(a) * r, z);
      uv.push(u, v);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * (nv + 1) + j, b = a + nv + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function disposeTree(root) {
  root.traverse((o) => {
    if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
    if (o.material) {
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of ms) if (!m.userData.shared) m.dispose();
    }
  });
}

export const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
