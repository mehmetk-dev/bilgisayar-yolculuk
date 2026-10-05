// Kasalar. Dünya çerçevesi: kasa tabanı y=0, ön yüz +z, arka yüz -z, sol (açılan) yan -x.
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, rrectPath, circlePath, polyShape, arrayGeo } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { holeAlpha, textTex, makeTex } from '../textures.js';
import { makePort } from './ports.js';
import { caseFan, fanGrille } from './fan.js';

const PI = Math.PI;
const T = 0.08;

function mr(parent, name) {
  const g = group(parent, [0, 0, 0], null, name);
  g.userData.mergeRoot = true;
  return g;
}

// Delikli (alpha) plaka: XY düzleminde
function perforated(parent, w, h, pos, rot, material, key, { pitch = 16, r = 5, hex = true, repeat = 4, slots = false, square = false } = {}) {
  const a = holeAlpha(key, { pitch, r, hex, slots, square });
  const m = material.clone();
  const ta = a.clone(); ta.needsUpdate = true; ta.repeat.set(w / repeat, h / repeat); ta.userData.shared = true;
  m.alphaMap = ta; m.transparent = true; m.depthWrite = false; m.side = THREE.DoubleSide; m.userData.shared = true;
  const pm = add(parent, G.plane(w, h), m, pos, rot, { cast: false });
  pm.renderOrder = 2;
  return pm;
}

// YZ düzleminde (x sabit) plaka; holes: [{z,y,w(z),h(y)}] veya {z,y,r}
function sidePlate(parent, { x, z0, z1, y0, y1, holes = [], material, t = T, outward = -1 }) {
  const w = z1 - z0, h = y1 - y0;
  const s = rrectShape(w, h, 0.25, (z0 + z1) / 2, (y0 + y1) / 2);
  s.holes = holes.map((hl) => (hl.r ? circlePath(hl.r, hl.z, hl.y) : rrectPath(hl.w, hl.h, hl.rad ?? 0.1, hl.z, hl.y)));
  const geo = extrude(s, t, 0, 12);
  // şekil x -> dünya z, şekil y -> dünya y, ekstrüzyon -> dünya x
  const m = add(parent, geo, material, [x, 0, 0]);
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0)));
  if (outward > 0) m.position.x = x + t;
  return m;
}
// XY düzleminde (z sabit) plaka
function rearPlate(parent, { z, x0, x1, y0, y1, holes = [], material, t = T }) {
  const s = rrectShape(x1 - x0, y1 - y0, 0.2, (x0 + x1) / 2, (y0 + y1) / 2);
  s.holes = holes.map((hl) => (hl.r ? circlePath(hl.r, hl.x, hl.y) : rrectPath(hl.w, hl.h, hl.rad ?? 0.08, hl.x, hl.y)));
  return add(parent, extrude(s, t, 0, 12), material, [0, 0, z]);
}

function labelPlane(parent, text, w, h, pos, rot, { fg = '#333', bg = 'rgba(0,0,0,0)', size = 0.6, bold = true } = {}) {
  return add(parent, G.plane(w, h), new THREE.MeshBasicMaterial({ map: textTex('cl' + text + fg, text, { fg, bg, w: Math.round(64 * w / h), h: 64, size, bold }), transparent: true, depthWrite: false }), pos, rot, { cast: false, receive: false });
}

// Kasa ayağı
function feet(parent, list, material = M.rubber, r = 1.2, h = 1.0) {
  add(parent, arrayGeo(G.cyl(r, r * 1.1, h, 20), list.map(([x, z]) => [x, -h / 2, z])), material);
}

// Ön USB/ses portlarını (port çerçevesi -Z) ön yüze (+Z) çevirerek yerleştir
function frontPort(parent, spec, pos, up = false) {
  const p = makePort(spec);
  p.position.set(...pos);
  p.rotation.y = PI;
  if (up) p.rotation.set(-PI / 2, 0, 0);
  p.userData.front = true;
  parent.add(p);
  return p;
}

// ================================================================ 2000'ler: ATX orta kule
export function case2000({ color = 'beige', rearHoles = [], slotOpenings = [], ioRect, psuRect, fan }) {
  const W = 20, H = 43, D = 45;
  const root = new THREE.Group();
  const beige = color === 'beige';
  const ext = beige ? mat('#c9bd9c', 0.55, 0.1) : mat('#1c1d20', 0.45, 0.4);
  const bezelM = beige ? mat('#d2c7a8', 0.55) : mat('#a9adb3', 0.32, 0.65);
  const bezelM2 = beige ? mat('#c3b795', 0.6) : mat('#1d1e21', 0.45);
  const inner = M.galvanized;

  const ch = mr(root, 'kasa');
  // sağ yan (sabit)
  add(ch, G.box(T, H, D), ext, [W / 2 - T / 2, H / 2, 0]);
  add(ch, G.box(T * 0.5, H - 0.4, D - 0.4), inner, [W / 2 - T - 0.01, H / 2, 0]);
  // üst / alt
  add(ch, G.box(W, T, D), ext, [0, H - T / 2, 0]);
  add(ch, G.box(W, T, D), inner, [0, T / 2, 0]);
  // ön şasi
  const fh = [];
  for (let k = 0; k < 4; k++) fh.push({ x: 0, y: 40.6 - k * 4.3, w: 14.8, h: 4.2 });
  fh.push({ x: 0, y: 24.2, w: 10.3, h: 2.6 }, { x: 0, y: 21.4, w: 10.3, h: 2.6 });
  rearPlate(ch, { z: D / 2 - T, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [...fh, { x: 0, y: 6, r: 4 }], material: inner });
  // arka panel
  rearPlate(ch, { z: -D / 2, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [...rearHoles, ...slotOpenings, { x: fan.x, y: fan.y, r: fan.size * 0.46 }], material: ext });
  perforated(ch, fan.size * 0.93, fan.size * 0.93, [fan.x, fan.y, -D / 2 + 0.04], null, ext, 'rearfan00', { pitch: 18, r: 7, hex: true, repeat: 2 });
  // genişleme yuvası çerçevesi (iç kıvrım)
  add(ch, G.box(11.5, 17, 0.6), inner, [2.5, 9.3, -D / 2 + 0.38]).visible = false;
  // havalandırma delikleri (arka, slot yanında)
  perforated(ch, 2.0, 14, [-7.6, 10, -D / 2 - 0.01], null, ext, 'rearvent', { pitch: 14, r: 4, hex: false, repeat: 2 });
  // sürücü kafesleri
  const cage = mr(root, 'kafes');
  for (const sx of [-1, 1]) {
    // yakın (sol) duvarlarda büyük kesikler: sürücüler içeriden görünsün
    const big = sx < 0;
    sidePlate(cage, { x: sx * 7.45 + (sx > 0 ? 0 : -T), z0: 4.0, z1: D / 2 - T, y0: 25.6, y1: H - T, material: inner,
      holes: big ? [{ z: 11.5, y: 34.2, w: 11, h: 13.5, rad: 0.6 }] : [...Array(4)].map((_, i) => ({ z: 8 + i * 3.5, y: 27.5 + (i % 2) * 9, w: 1.6, h: 0.5 })) });
    sidePlate(cage, { x: sx * 5.2 + (sx > 0 ? 0 : -T), z0: 7.0, z1: D / 2 - T, y0: 7.0, y1: 25.6, material: inner,
      holes: big ? [{ z: 13.5, y: 16.3, w: 9, h: 14.5, rad: 0.6 }] : [...Array(3)].map((_, i) => ({ z: 10 + i * 4, y: 10 + i * 4, w: 1.2, h: 0.5 })) });
  }
  // sürücü kızakları (vida delikli şeritler)
  add(cage, arrayGeo(G.box(0.1, 0.6, 15), [[-7.5, 30.2, 13.5], [-7.5, 38.4, 13.5], [-5.25, 9.2, 15], [-5.25, 23.2, 15]]), inner);
  add(cage, G.box(14.9, T, D / 2 - 4 - T), inner, [0, 25.6, (4 + D / 2 - T) / 2]);
  // anakart tepsisi dikmeleri
  ch.userData.feetY = 1.0;
  feet(ch, [[-7.5, -18], [7.5, -18], [-7.5, 18], [7.5, 18]], M.rubber, 1.3, 1.0);
  // arka vida başları
  add(ch, arrayGeo(G.cyl(0.3, 0.3, 0.25, 6), [[-W / 2 + 0.6, 3, 0], [-W / 2 + 0.6, 40, 0], [W / 2 - 0.6, 3, 0], [W / 2 - 0.6, 40, 0]].map(([x, y]) => [x, y, -D / 2 - 0.12, PI / 2, 0, 0])), M.nickel);

  // ---- sol yan kapak (açılır) + işlemci hava kanalı (2004 dönemi kasalarda yaygın)
  const side = mr(root, 'yanPanel');
  const vent = { z: -13, y: 25, r: 4.2 };
  sidePlate(side, { x: -W / 2, z0: -D / 2, z1: D / 2, y0: 0, y1: H, holes: [vent], material: ext });
  add(side, G.box(T * 0.5, H - 0.4, D - 0.4), inner, [-W / 2 + T + 0.01, H / 2, 0]).visible = false;
  perforated(side, vent.r * 2, vent.r * 2, [-W / 2 - 0.04, vent.y, vent.z], [0, -PI / 2, 0], ext, 'sidevent', { pitch: 14, r: 5, hex: true, repeat: 2 });
  const duct = new THREE.CylinderGeometry(4.0, 4.4, 4.5, 40, 1, true);
  add(side, duct, M.smokeAcrylic, [-W / 2 + 2.3, vent.y, vent.z], [0, 0, PI / 2]);
  add(side, G.torus(4.3, 0.2, 8, 40), M.blackPlastic, [-W / 2 + 0.2, vent.y, vent.z], [0, PI / 2, 0]);
  // tırtıllı vidalar
  add(side, arrayGeo(G.cyl(0.45, 0.45, 0.6, 16), [[-W / 2 + 1.0, 6, -D / 2 - 0.3, PI / 2, 0, 0], [-W / 2 + 1.0, 37, -D / 2 - 0.3, PI / 2, 0, 0]]), M.nickel);
  side.userData.open = { dir: new THREE.Vector3(-1, 0, 0), dist: 12, lift: 0, slide: -5, aside: [-4, 0, -62] };

  // ---- ön panel (plastik)
  const bz = mr(root, 'onPanel');
  const bzD = 2.4, z0 = D / 2;
  const s = rrectShape(W + 0.6, H + 0.2, 0.8, 0, H / 2);
  s.holes = fh.map((h) => rrectPath(h.w, h.h, 0.08, h.x, h.y));
  add(bz, extrude(s, bzD, 0.15, 8), bezelM, [0, 0, z0]);
  // boş yuva kapakları
  const blank = (y, w, h) => {
    add(bz, G.box(w, h, 0.3), mat('#151515', 0.9), [0, y, z0 + bzD - 0.6]);
    add(bz, G.rbox(w - 0.35, h - 0.3, 0.45, 0.1), bezelM2, [0, y, z0 + bzD - 0.3]);
    add(bz, arrayGeo(G.box(w - 2.0, 0.07, 0.03), [[0, -h * 0.18, 0], [0, h * 0.18, 0]]), beige ? mat('#a89d80', 0.7) : mat('#2c2e31', 0.4), [0, y, z0 + bzD - 0.06]);
  };
  bz.userData.blankBays = { b525: [36.3, 32.0, 27.7], b35: [21.4] };
  for (const y of bz.userData.blankBays.b525) blank(y, 14.8, 4.2);
  for (const y of bz.userData.blankBays.b35) blank(y, 10.3, 2.6);
  // güç ve reset düğmeleri, LED'ler
  add(bz, G.cyl(1.35, 1.35, 0.4, 40), bezelM2, [0, 16.5, z0 + bzD + 0.15], [PI / 2, 0, 0]);
  add(bz, G.cyl(1.0, 1.0, 0.25, 40), beige ? mat('#c9bfa3', 0.4) : M.silverPlastic, [0, 16.5, z0 + bzD + 0.38], [PI / 2, 0, 0]);
  add(bz, G.torus(0.35, 0.06, 6, 24, PI * 1.6), mat('#555', 0.5), [0, 16.5, z0 + bzD + 0.52], [0, 0, PI * 0.7]);
  add(bz, G.box(0.08, 0.4, 0.02), mat('#555', 0.5), [0, 16.75, z0 + bzD + 0.52]);
  add(bz, G.cyl(0.35, 0.35, 0.3, 20), bezelM2, [2.2, 14.3, z0 + bzD + 0.1], [PI / 2, 0, 0]);
  const pled = add(bz, G.cyl(0.15, 0.15, 0.1, 12), led('#33ff55', 2.0), [-2.0, 14.3, z0 + bzD + 0.04], [PI / 2, 0, 0], { keep: true, cast: false });
  pled.userData.led = 'power';
  const hled = add(bz, G.cyl(0.15, 0.15, 0.1, 12), led('#ffae1a', 0.4), [-1.2, 14.3, z0 + bzD + 0.04], [PI / 2, 0, 0], { keep: true, cast: false });
  hled.userData.led = 'hdd';
  labelPlane(bz, 'NOVATRON', 5, 0.8, [0, 19.3, z0 + bzD + 0.01], null, { fg: beige ? '#6a604a' : '#3a3c40' });
  // ön I/O (kapak altında): 2 USB + kulaklık + mikrofon
  add(bz, G.rbox(8.5, 2.6, 0.2, 0.2), bezelM2, [0, 9.0, z0 + bzD - 0.05]);
  const fp = [];
  fp.push(frontPort(bz, { t: 'usb2', n: 1 }, [-2.6, 9.0, z0 + bzD + 0.02]));
  fp.push(frontPort(bz, { t: 'usb2', n: 1 }, [-0.8, 9.0, z0 + bzD + 0.02]));
  fp.push(frontPort(bz, { t: 'audio', colors: ['#9cc93a'], id: 'frontHp', housing: beige ? '#cfc5a8' : '#1d1e21' }, [1.3, 9.0, z0 + bzD + 0.02]));
  fp.push(frontPort(bz, { t: 'audio', colors: ['#e98fb3'], id: 'frontMic', housing: beige ? '#cfc5a8' : '#1d1e21' }, [2.7, 9.0, z0 + bzD + 0.02]));
  // alt hava girişi
  add(bz, arrayGeo(G.box(12, 0.25, 0.1), [...Array(6)].map((_, i) => [0, 2 + i * 0.8, 0])), mat('#0d0d0d', 0.8), [0, 0, z0 + bzD + 0.1]);
  root.userData.dims = { W, H, D: D + bzD };
  root.userData.bays = { b525: [40.6, 36.3, 32.0, 27.7], b35ext: [24.2, 21.4], hddY: 12.6 };
  return root;
}

// ================================================================ 2025: cam yan panelli kule
export function case2025({ rearHoles = [], slotOpenings = [], fan, rgb = '#4fd1ff' }) {
  const W = 23, H = 48, D = 45;
  const root = new THREE.Group();
  const ext = mat('#16171a', 0.45, 0.45);
  const inner = mat('#1c1d20', 0.5, 0.4);
  const ch = mr(root, 'kasa');
  // sağ yan + anakart tepsisi
  add(ch, G.box(T, H, D), ext, [W / 2 - T / 2, H / 2, 0]);
  const trayX = W / 2 - 2.4;
  sidePlate(ch, { x: trayX, z0: -D / 2 + 0.2, z1: 8.5, y0: 11.0, y1: H - 0.6, material: inner, outward: 1, holes: [{ z: 5.5, y: 16, w: 1.6, h: 5, rad: 0.7 }, { z: 5.5, y: 30, w: 1.6, h: 8, rad: 0.7 }, { z: -14, y: 45.8, w: 5, h: 1.2, rad: 0.5 }, { z: -12, y: 22, w: 7.5, h: 10, rad: 0.6 }] });
  // kablo deliği lastikleri
  for (const [z, y, h] of [[5.5, 16, 5], [5.5, 30, 8]]) add(ch, G.rbox(0.3, h + 0.3, 1.9, 0.12), M.rubber, [trayX - 0.12, y, z]);
  // üst (fan ızgaralı) / alt
  add(ch, G.box(W, T, D), ext, [0, T / 2, 0]);
  rearPlate(root, { z: 0, x0: 0, x1: 0.01, y0: 0, y1: 0.01, material: ext }).visible = false;
  const top = group(ch, [0, H - T, 0], [PI / 2, 0, 0]);
  const ts = rrectShape(W, D, 0.3);
  ts.holes = [rrectPath(14, 34, 0.5, 0, 0)];
  add(top, extrude(ts, T), ext, [0, 0, -T]);
  perforated(top, 14, 34, [0, 0, -T / 2], null, mat('#1a1b1e', 0.6, 0.2), 'topmesh', { pitch: 10, r: 3.6, hex: true, repeat: 2.5 });
  // PSU bölmesi (shroud)
  const sh = mr(root, 'shroud');
  add(sh, G.box(W - 2.6 - T, T * 1.5, D - 7.5), inner, [-1.2, 11.0, -3.6]);
  const shFront = sidePlate(sh, { x: 0, z0: -D / 2 + 0.2, z1: 15.8, y0: 0.2, y1: 11.0, material: inner, holes: [{ z: -14, y: 6, w: 10, h: 0.5 }, { z: -14, y: 7.2, w: 10, h: 0.5 }, { z: -14, y: 8.4, w: 10, h: 0.5 }] });
  shFront.position.x = -W / 2 + 1.0 + T;
  add(sh, G.box(W - 2.6, 11, T), inner, [-1.2, 5.6, 15.8]);
  labelPlane(sh, 'NOVATRON', 8, 1.2, [-W / 2 + 0.95, 6.5, 4], [0, -PI / 2, 0], { fg: '#4a4d52' });
  add(sh, G.box(0.6, 11, 0.6), inner, [-W / 2 + 1.3, 5.6, 15.5]);
  // ön şasi + üç fan yuvası
  const fz = D / 2 - 2.2;
  rearPlate(ch, { z: fz - 1.6, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [0, 1, 2].map((i) => ({ x: -0.8, y: 9 + i * 12.6, r: 5.7 })), material: inner });
  // arka panel
  rearPlate(ch, { z: -D / 2, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [...rearHoles, ...slotOpenings, { x: fan.x, y: fan.y, w: fan.size - 0.4, h: fan.size - 0.4, rad: 0.6 }], material: ext });
  perforated(ch, fan.size - 0.4, fan.size - 0.4, [fan.x, fan.y, -D / 2 + 0.04], null, ext, 'rearhex25', { pitch: 12, r: 5, hex: true, repeat: 3 });
  // slot kolu kapağı ve havalandırma
  add(ch, G.box(13, 1.2, 1.0), M.matteBlack, [0.7, 26.2, -D / 2 - 0.5]);
  // ayaklar (uzun raylar)
  add(ch, G.rbox(3, 1.2, D - 2, 0.4), M.matteBlack, [-W / 2 + 2.5, -0.6, 0]);
  add(ch, G.rbox(3, 1.2, D - 2, 0.4), M.matteBlack, [W / 2 - 2.5, -0.6, 0]);
  // ön fanlar (ARGB)
  const fans = mr(root, 'onFanlar');
  for (let i = 0; i < 3; i++) {
    const f = caseFan(12, { depth: 2.5, blades: 9, rgb, blade: rgb ? M.fanBladeClear : M.fanBlade });
    f.rotation.y = PI;
    f.position.set(-0.8, 9 + i * 12.6, fz - 0.2);
    fans.add(f);
  }
  // üst-ön I/O
  const io = mr(root, 'ustIO');
  const ioY = H + 0.05;
  add(io, G.rbox(12, 0.12, 3.2, 0.05), mat('#121315', 0.4), [0, ioY, 18.5]);
  const up = (spec, x) => {
    const p = makePort(spec);
    p.rotation.set(PI / 2, 0, 0);
    p.position.set(x, ioY + 0.1, 18.5);
    p.userData.front = true;
    io.add(p);
  };
  up({ t: 'usbc', id: 'frontUsbc' }, -1.0);
  up({ t: 'usb3', n: 1, id: 'frontUsb3' }, 1.0);
  up({ t: 'usb3', n: 1, id: 'frontUsb3' }, 3.0);
  up({ t: 'audio', colors: ['#202020'], id: 'frontCombo' }, 4.8);
  add(io, G.cyl(0.85, 0.85, 0.25, 32), M.aluminumDark, [-3.6, ioY + 0.12, 18.5]);
  const pled = add(io, G.torus(0.85, 0.05, 6, 32), led('#ffffff', 1.6), [-3.6, ioY + 0.25, 18.5], [PI / 2, 0, 0], { keep: true, cast: false });
  pled.userData.led = 'power';
  add(io, G.cyl(0.3, 0.3, 0.2, 16), M.matteBlack, [-5.3, ioY + 0.1, 18.5]);

  // ön panel: örgü + çerçeve
  const bz = mr(root, 'onPanel');
  const fr = rrectShape(W + 0.4, H + 0.4, 0.6, 0, H / 2);
  fr.holes = [rrectPath(W - 3, H - 4, 0.4, 0, H / 2)];
  add(bz, extrude(fr, 1.4, 0.1, 6), mat('#121315', 0.4, 0.3), [0, 0, D / 2]);
  perforated(bz, W - 3, H - 4, [0, H / 2, D / 2 + 0.9], null, mat('#2a2c31', 0.5, 0.5), 'frontmesh25', { pitch: 12, r: 4.6, hex: true, repeat: 3 });
  add(bz, G.box(0.3, H - 6, 0.2), rgb ? led(rgb, 1.0) : mat('#2a2c30', 0.4), [-(W - 3) / 2 - 0.4, H / 2, D / 2 + 1.42], null, { keep: !!rgb, cast: false }).userData.rgb = !!rgb;
  labelPlane(bz, 'NOVATRON', 6, 0.9, [0, 1.3, D / 2 + 1.45], null, { fg: '#8a8d92' });

  // ---- cam yan panel
  const side = mr(root, 'yanPanel');
  const gs = rrectShape(D - 0.6, H - 0.6, 0.4, 0, H / 2);
  const glass = add(side, extrude(gs, 0.4), M.glass, [-W / 2 - 0.4, 0, 0], null, { cast: false });
  glass.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0)));
  glass.position.x = -W / 2 + 0.4;
  glass.renderOrder = 5;
  // siyah serigrafi kenar
  const edge = rrectShape(D - 0.6, H - 0.6, 0.4, 0, H / 2);
  edge.holes = [rrectPath(D - 3, H - 3, 0.3, 0, H / 2)];
  const em = add(side, extrude(edge, 0.02), mat('#0c0c0d', 0.3), [0, 0, 0]);
  em.quaternion.copy(glass.quaternion);
  em.position.x = -W / 2 - 0.0;
  add(side, arrayGeo(G.cyl(0.55, 0.55, 0.5, 20), [[-W / 2 - 0.25, 3, -D / 2 + 3, 0, 0, PI / 2], [-W / 2 - 0.25, H - 3, -D / 2 + 3, 0, 0, PI / 2], [-W / 2 - 0.25, 3, D / 2 - 3, 0, 0, PI / 2], [-W / 2 - 0.25, H - 3, D / 2 - 3, 0, 0, PI / 2]]), M.aluminumDark);
  side.userData.open = { dir: new THREE.Vector3(-1, 0, 0), dist: 10, lift: 1, slide: 0, aside: [-4, 0, -64] };
  root.userData.dims = { W, H, D: D + 1.5 };
  root.userData.trayX = trayX;
  return root;
}

export { perforated, sidePlate, rearPlate, labelPlane, feet, frontPort, mr };

// 7 parçalı LED gösterge dokusu ("200" MHz göstergesi)
function segTex(text) {
  return makeTex('seg' + text, 256, 128, (g, w, h) => {
    g.fillStyle = '#1a0606'; g.fillRect(0, 0, w, h);
    g.font = 'bold 104px "DejaVu Sans Mono", monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(255,40,30,0.12)'; g.fillText('888', w / 2, h / 2 + 4);
    g.fillStyle = '#ff3a2a'; g.shadowColor = '#ff2a1a'; g.shadowBlur = 12; g.fillText(text, w / 2, h / 2 + 4);
  });
}

// ================================================================ 1990'lar: bej yatay masaüstü kasa
export function case1990({ rearHoles = [], slotOpenings = [] }) {
  const W = 42, H = 15.5, D = 43;
  const root = new THREE.Group();
  const ext = mat('#cbbf9f', 0.55, 0.1);
  const bez = mat('#d3c8aa', 0.6);
  const bez2 = mat('#c2b694', 0.6);
  const inner = M.galvanized;
  const ch = mr(root, 'kasa');
  // taban (tepsi) ve arka panel
  add(ch, G.box(W - 0.3, T, D), inner, [0, T / 2, 0]);
  add(ch, G.box(T, 3.0, D - 0.4), inner, [-W / 2 + 0.25, 1.5, 0]);
  add(ch, G.box(T, 3.0, D - 0.4), inner, [W / 2 - 0.25, 1.5, 0]);
  rearPlate(ch, { z: -D / 2, x0: -W / 2 + 0.15, x1: W / 2 - 0.15, y0: 0, y1: H - 0.15, holes: [...rearHoles, ...slotOpenings], material: ext });
  perforated(ch, 8, 5, [-0.5, 10.0, -D / 2 - 0.01], null, ext, 'rear90', { pitch: 14, r: 4, hex: false, repeat: 2.2 });
  // ön şasi
  const fh = [{ x: 12.0, y: 11.6, w: 14.8, h: 4.2 }, { x: 12.0, y: 7.3, w: 14.8, h: 4.2 }, { x: -1.5, y: 11.75, w: 10.3, h: 2.6 }, { x: -1.5, y: 8.85, w: 10.3, h: 2.6 }];
  rearPlate(ch, { z: D / 2 - T, x0: -W / 2 + 0.15, x1: W / 2 - 0.15, y0: 0, y1: H - 0.15, holes: fh, material: inner });
  // sürücü kafesleri
  const cage = mr(ch, 'kafes');
  for (const x of [12.0 - 7.45, 12.0 + 7.45]) sidePlate(cage, { x: x + (x < 12 ? 0 : T), z0: 3.0, z1: D / 2 - T, y0: 5.0, y1: H - 0.6, material: inner, holes: x < 12 ? [{ z: 12, y: 9.5, w: 12, h: 6, rad: 0.5 }] : [] });
  for (const x of [-1.5 - 5.2, -1.5 + 5.2]) sidePlate(cage, { x: x + (x < -1.5 ? 0 : T), z0: 6.0, z1: D / 2 - T, y0: 7.2, y1: H - 0.6, material: inner, holes: x < -1.5 ? [{ z: 13.5, y: 10.5, w: 10, h: 4, rad: 0.5 }] : [] });
  add(cage, G.box(14.9, T, D / 2 - 3), inner, [12.0, 5.0, (3 + D / 2) / 2]);
  add(cage, G.box(10.5, T, D / 2 - 6), inner, [-1.5, 7.2, (6 + D / 2) / 2]);
  add(cage, G.box(W - 2, 0.6, 1.2), inner, [0, H - 0.6, D / 2 - 1.5]);
  feet(ch, [[-18, -18], [18, -18], [-18, 18], [18, 18]], M.rubber, 1.1, 0.9);

  // ---- U biçimli kapak (üst + iki yan)
  const cov = mr(root, 'yanPanel');
  add(cov, G.rbox(W, T, D, 0.04), ext, [0, H - T / 2, 0]);
  add(cov, G.box(T, H - 0.2, D), ext, [-W / 2 + T / 2, (H - 0.2) / 2, 0]);
  add(cov, G.box(T, H - 0.2, D), ext, [W / 2 - T / 2, (H - 0.2) / 2, 0]);
  perforated(cov, 10, 3, [-W / 2 - 0.02, 8, -6], [0, -PI / 2, 0], ext, 'side90', { pitch: 12, r: 3, slots: true, hex: false, repeat: 3 });
  perforated(cov, 10, 3, [W / 2 + 0.02, 8, -6], [0, PI / 2, 0], ext, 'side90b', { pitch: 12, r: 3, slots: true, hex: false, repeat: 3 });
  add(cov, arrayGeo(G.cyl(0.35, 0.35, 0.3, 6), [[-W / 2 + 1.2, 2, 0], [W / 2 - 1.2, 2, 0], [-W / 2 + 1.2, H - 2, 0], [W / 2 - 1.2, H - 2, 0], [0, H - 2, 0]].map(([x, y]) => [x, y, -D / 2 - 0.15, PI / 2, 0, 0])), M.nickel);
  cov.userData.open = { dir: new THREE.Vector3(0, 1, 0), dist: 14, slide: -9, aside: [52, -14, 0] };

  // ---- ön panel
  const bz = mr(root, 'onPanel');
  const z0 = D / 2, bzD = 2.0;
  const s = rrectShape(W + 0.4, H + 0.2, 0.6, 0, H / 2);
  s.holes = fh.map((h) => rrectPath(h.w, h.h, 0.08, h.x, h.y));
  add(bz, extrude(s, bzD, 0.12, 6), bez, [0, -0.1, z0]);
  const blank = (x, y, w, h) => {
    add(bz, G.box(w, h, 0.3), mat('#151515', 0.9), [x, y, z0 + bzD - 0.6]);
    add(bz, G.rbox(w - 0.3, h - 0.3, 0.45, 0.1), bez2, [x, y, z0 + bzD - 0.28]);
  };
  blank(12.0, 7.3, 14.8, 4.2);
  blank(-1.5, 8.85, 10.3, 2.6);
  // sol bölüm: logo, LED'ler, MHz göstergesi, düğmeler, anahtar kilidi
  const fz = z0 + bzD + 0.12;
  add(bz, G.rbox(13.2, 12.8, 0.25, 0.3), bez2, [-14.4, 7.6, z0 + bzD - 0.02]);
  labelPlane(bz, 'NOVATRON 586', 9, 1.0, [-14.4, 12.8, fz + 0.02], null, { fg: '#5b513b' });
  add(bz, G.box(4.4, 1.9, 0.12), mat('#120404', 0.3), [-17.3, 10.4, fz]);
  add(bz, G.plane(4.0, 1.6), new THREE.MeshBasicMaterial({ map: segTex('200') }), [-17.3, 10.4, fz + 0.07], null, { cast: false });
  const leds = [['#33ff55', 'GÜÇ', 'power'], ['#ffc21a', 'TURBO', 'turbo'], ['#ff3322', 'HDD', 'hdd']];
  leds.forEach(([c, n, k], i) => {
    const l = add(bz, G.box(0.5, 0.25, 0.1), led(c, k === 'hdd' ? 0.4 : 1.8), [-13.0 + i * 1.6, 10.9, fz], null, { keep: true, cast: false });
    l.userData.led = k;
    labelPlane(bz, n, 1.6, 0.4, [-13.0 + i * 1.6, 10.3, fz + 0.01], null, { fg: '#4d4535', size: 0.7 });
  });
  // turbo ve reset düğmeleri
  add(bz, G.rbox(1.6, 0.9, 0.5, 0.1), bez, [-17.6, 7.6, fz + 0.1]);
  labelPlane(bz, 'TURBO', 1.8, 0.45, [-17.6, 6.85, fz + 0.01], null, { fg: '#4d4535', size: 0.7 });
  add(bz, G.rbox(1.1, 0.8, 0.4, 0.1), bez, [-15.3, 7.6, fz + 0.05]);
  labelPlane(bz, 'RESET', 1.6, 0.45, [-15.3, 6.85, fz + 0.01], null, { fg: '#4d4535', size: 0.7 });
  // anahtar kilidi
  add(bz, G.cyl(0.75, 0.75, 0.3, 32), M.chrome, [-12.4, 7.5, fz + 0.1], [PI / 2, 0, 0]);
  add(bz, G.box(0.12, 0.7, 0.05), mat('#111', 0.6), [-12.4, 7.5, fz + 0.27]);
  labelPlane(bz, 'KİLİT', 1.6, 0.45, [-12.4, 6.4, fz + 0.01], null, { fg: '#4d4535', size: 0.7 });
  // güç düğmesi (büyük)
  add(bz, G.rbox(3.0, 2.0, 0.9, 0.2), mat('#b9ad8d', 0.55), [-15.5, 3.2, fz + 0.3]);
  labelPlane(bz, 'POWER', 2.4, 0.5, [-15.5, 1.65, fz + 0.01], null, { fg: '#4d4535', size: 0.7 });
  // havalandırma yarıkları
  add(bz, arrayGeo(G.box(8, 0.18, 0.08), [...Array(5)].map((_, i) => [6.5, 1.0 + i * 0.55, 0])), mat('#2a261d', 0.8), [0, 0, fz]);
  root.userData.dims = { W, H, D: D + bzD };
  return root;
}

// ================================================================ 2010'lar: siyah orta kule
export function case2010({ rearHoles = [], slotOpenings = [], fan, grommets = true }) {
  const W = 21, H = 46, D = 47;
  const root = new THREE.Group();
  const ext = mat('#17181b', 0.5, 0.35);
  const inner = mat('#1f2023', 0.5, 0.35);
  const ch = mr(root, 'kasa');
  add(ch, G.box(T, H, D), ext, [W / 2 - T / 2, H / 2, 0]);
  const trayX = W / 2 - 1.6;
  sidePlate(ch, { x: trayX, z0: -D / 2 + 0.2, z1: 5.5, y0: 1.5, y1: H - 0.6, material: inner, outward: 1, holes: [{ z: 3.6, y: 18, w: 1.6, h: 5, rad: 0.7 }, { z: 3.6, y: 32, w: 1.6, h: 6, rad: 0.7 }, { z: -17, y: 44.2, w: 5, h: 1.2, rad: 0.5 }, { z: -13, y: 26, w: 7, h: 9, rad: 0.6 }, { z: -10, y: 11.8, w: 8, h: 1.3, rad: 0.5 }] });
  for (const [z, y, h] of [[3.6, 18, 5], [3.6, 32, 6]]) add(ch, G.rbox(0.3, h + 0.3, 1.9, 0.12), M.rubber, [trayX - 0.12, y, z]);
  add(ch, G.box(W, T, D), ext, [0, T / 2, 0]);
  perforated(ch, 14, 14, [-1.0, 0.1, -15.4], [-PI / 2, 0, 0], ext, 'bot10', { pitch: 12, r: 4, hex: true, repeat: 3 });
  // üst panel (iki fan yeri)
  const top = group(ch, [0, H - T, 0], [PI / 2, 0, 0]);
  const ts = rrectShape(W, D, 0.3);
  ts.holes = [rrectPath(12, 26, 0.5, 0, 4)];
  add(top, extrude(ts, T), ext, [0, 0, -T]);
  perforated(top, 12, 26, [0, 4, -T / 2], null, ext, 'top10', { pitch: 10, r: 3.5, hex: true, repeat: 2.5 });
  // ön şasi + kafesler
  rearPlate(ch, { z: D / 2 - T, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [{ x: 0, y: 41.5, w: 14.8, h: 4.2 }, { x: 0, y: 14, r: 5.6 }, { x: 0, y: 27, r: 5.6 }], material: inner });
  const cage = mr(ch, 'kafes');
  for (const sx of [-1, 1]) {
    sidePlate(cage, { x: sx * 7.45 + (sx > 0 ? 0 : -T), z0: 5.0, z1: D / 2 - T, y0: 38.8, y1: H - T, material: inner, holes: sx < 0 ? [{ z: 14, y: 41.6, w: 12, h: 3.6, rad: 0.5 }] : [] });
    sidePlate(cage, { x: sx * 5.4 + (sx > 0 ? 0 : -T), z0: 8.0, z1: D / 2 - 2.6, y0: 11.0, y1: 31.5, material: inner, holes: sx < 0 ? [{ z: 15, y: 16, w: 11, h: 5, rad: 0.6 }, { z: 15, y: 22.5, w: 11, h: 5, rad: 0.6 }, { z: 15, y: 28.5, w: 11, h: 4, rad: 0.6 }] : [] });
  }
  add(cage, G.box(10.8, T, D / 2 - 10.6), inner, [0, 31.5, (8 + D / 2 - 2.6) / 2]);
  add(cage, G.box(10.8, T, D / 2 - 10.6), inner, [0, 11.0, (8 + D / 2 - 2.6) / 2]);
  // takımsız disk kızakları (siyah plastik)
  for (const y of [13.6, 19.8, 26.0]) {
    add(cage, G.box(10.6, 0.25, 14.4), M.blackPlastic, [0, y - 0.3, 16.0]);
    add(cage, G.box(0.25, 1.2, 14.4), M.blackPlastic, [-5.2, y + 0.3, 16.0]);
    add(cage, G.box(0.25, 1.2, 14.4), M.blackPlastic, [5.2, y + 0.3, 16.0]);
    add(cage, G.rbox(10.2, 1.0, 0.5, 0.15), mat('#2a62c9', 0.4), [0, y + 0.2, 23.0]);
  }
  // arka panel + su soğutma lastikleri
  rearPlate(ch, { z: -D / 2, x0: -W / 2, x1: W / 2, y0: 0, y1: H, holes: [...rearHoles, ...slotOpenings, { x: fan.x, y: fan.y, w: fan.size - 0.4, h: fan.size - 0.4, rad: 0.6 }, ...(grommets ? [{ x: -7.6, y: 42.2, r: 0.9 }, { x: -7.6, y: 39.4, r: 0.9 }] : [])], material: ext });
  perforated(ch, fan.size - 0.4, fan.size - 0.4, [fan.x, fan.y, -D / 2 + 0.04], null, ext, 'rearhex10', { pitch: 12, r: 5, hex: true, repeat: 3 });
  if (grommets) for (const y of [42.2, 39.4]) add(ch, G.torus(0.85, 0.22, 8, 20), M.rubber, [-7.6, y, -D / 2 + 0.04]);
  feet(ch, [[-8, -20], [8, -20], [-8, 20], [8, 20]], M.rubber, 1.5, 1.2);
  // ön fanlar
  const fans = mr(root, 'onFanlar');
  for (const y of [14, 27]) { const f = caseFan(12, { depth: 2.5, blades: 7 }); f.rotation.y = PI; f.position.set(0, y, D / 2 + 1.35); fans.add(f); }
  // ön panel: örgü + 5,25" yuva + üstte I/O
  const bz = mr(root, 'onPanel');
  const z0 = D / 2;
  const fr = rrectShape(W + 0.6, H + 0.4, 0.8, 0, H / 2);
  fr.holes = [rrectPath(14.8, 4.2, 0.08, 0, 41.5), rrectPath(W - 3.2, 33, 0.5, 0, 20.5)];
  add(bz, extrude(fr, 3.0, 0.15, 8), mat('#141518', 0.45), [0, -0.2, z0]);
  perforated(bz, W - 3.2, 33, [0, 20.5, z0 + 2.75], null, mat('#26282c', 0.5, 0.4), 'mesh10', { pitch: 12, r: 4.6, hex: true, repeat: 3 });
  add(bz, G.box(W - 3, 0.08, 0.3), mat('#5a5f66', 0.3, 0.8), [0, 37.4, z0 + 3.05]);
  labelPlane(bz, 'NOVATRON', 5.4, 0.8, [0, 2.4, z0 + 3.17], null, { fg: '#9aa0a8' });
  // üst ön I/O (eğimli yüz)
  const io = group(bz, [0, H + 0.15, z0 - 2.0], [-0.35, 0, 0]);
  io.userData.mergeRoot = false;
  add(io, G.rbox(13, 0.3, 3.4, 0.1), mat('#101113', 0.4), [0, 0, 0]);
  const up = (spec, x) => { const p = makePort(spec); p.rotation.set(PI / 2, 0, 0); p.position.set(x, 0.2, 0.2); p.userData.front = true; io.add(p); };
  up({ t: 'usb3', n: 1, id: 'frontUsb3' }, -1.2);
  up({ t: 'usb3', n: 1, id: 'frontUsb3' }, 0.6);
  up({ t: 'audio', colors: ['#9cc93a'], id: 'frontHp' }, 2.4);
  up({ t: 'audio', colors: ['#e98fb3'], id: 'frontMic' }, 3.7);
  add(io, G.cyl(0.9, 0.9, 0.3, 32), M.aluminumDark, [-4.4, 0.2, 0.2]);
  const pled = add(io, G.torus(0.9, 0.06, 6, 32), led('#3a8bff', 1.6), [-4.4, 0.36, 0.2], [PI / 2, 0, 0], { keep: true, cast: false });
  pled.userData.led = 'power';
  add(io, G.cyl(0.35, 0.35, 0.25, 16), M.matteBlack, [5.3, 0.2, 0.2]);
  // ---- sol yan kapak
  const side = mr(root, 'yanPanel');
  sidePlate(side, { x: -W / 2, z0: -D / 2, z1: D / 2, y0: 0, y1: H, material: ext, holes: [{ z: 4, y: 20, w: 14, h: 14, rad: 0.8 }] });
  perforated(side, 14, 14, [-W / 2 - 0.04, 20, 4], [0, -PI / 2, 0], ext, 'side10', { pitch: 12, r: 4.6, hex: true, repeat: 3 });
  add(side, arrayGeo(G.cyl(0.45, 0.45, 0.6, 16), [[-W / 2 + 1.0, 6, -D / 2 - 0.3, PI / 2, 0, 0], [-W / 2 + 1.0, 40, -D / 2 - 0.3, PI / 2, 0, 0]]), M.nickel);
  side.userData.open = { dir: new THREE.Vector3(-1, 0, 0), dist: 12, slide: -5, aside: [-4, 0, -64] };
  root.userData.dims = { W, H, D: D + 3.0 };
  root.userData.trayX = trayX;
  return root;
}
