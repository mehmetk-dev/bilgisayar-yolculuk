// İşlemci paketleri ve soğutucular. Yerel çerçeve = anakart çerçevesi (Y: karttan dışarı), orijin soket merkezi PCB üstü.
import * as THREE from 'three';
import { G, add, group, extrude, rrectShape, rrectPath, polyShape, arrayGeo, makeCurve, tubeGeo } from '../geom.js';
import { M, mat, texMat, led } from '../materials.js';
import { makeTex, chipTex } from '../textures.js';
import { caseFan, finBlock } from './fan.js';

const PI = Math.PI;

function ihsTex(key, lines, { bg = '#c9ccd0', fg = '#4a4d52' } = {}) {
  return makeTex('ihs|' + key, 512, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, bg); gr.addColorStop(0.5, '#e2e4e7'); gr.addColorStop(1, bg);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach((l, i) => { g.font = `${i ? '' : 'bold '}${i ? 34 : 50}px "DejaVu Sans", Arial`; g.fillText(l, w / 2, h * 0.32 + i * 58); });
  });
}

// CPU paketi; yükseklik bilgisi userData.top
export function buildCPU(kind) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  let top = 0;
  if (kind === 's7') {
    const y0 = 0.6;
    add(g, G.box(4.95, 0.28, 4.95), M.ceramic, [-0.1, y0 + 0.14, 0]);
    add(g, G.box(3.0, 0.06, 3.0), M.nickel, [-0.1, y0 + 0.31, 0]);
    add(g, G.plane(4.6, 1.0), texMat(chipTex(['KRONOS-P 200', 'MMX  2.8V  66MHz'], { w: 512, h: 112, bg: '#ddd9ce', fg: '#2b2b2b', dot: false })), [-0.1, y0 + 0.282, 2.0], [-PI / 2, 0, 0], { cast: false });
    // köşe çentiği (pin 1)
    add(g, G.box(0.5, 0.05, 0.05), M.gold, [-2.3, y0 + 0.29, -2.3], [0, PI / 4, 0]);
    top = y0 + 0.34;
  } else if (kind === 's478') {
    const y0 = 0.47;
    add(g, G.box(3.5, 0.12, 3.5), mat('#2c5a3c', 0.45), [-0.25, y0 + 0.06, 0.1]);
    add(g, G.rbox(3.1, 0.28, 3.1, 0.12), M.nickel, [-0.25, y0 + 0.26, 0.1]);
    add(g, G.plane(2.9, 2.9), texMat(ihsTex('p4', ['KRONOS 4', '2.80 GHz/512/800', 'SL7X? MALAY'])), [-0.25, y0 + 0.402, 0.1], [-PI / 2, 0, 0], { cast: false });
    top = y0 + 0.4;
  } else if (kind === 'lga1150') {
    const y0 = 0.37;
    add(g, G.box(3.75, 0.1, 3.75), mat('#2a5a3a', 0.45), [0, y0 + 0.05, 0]);
    add(g, arrayGeo(G.box(0.25, 0.05, 0.12), [[-1.2, 0, 1.6], [-0.7, 0, 1.6], [1.0, 0, 1.6], [1.2, 0, -1.6], [-1.2, 0, -1.6]]), M.gold, [0, y0 + 0.12, 0]);
    add(g, G.rbox(3.2, 0.3, 3.3, 0.1), M.nickel, [0, y0 + 0.25, 0]);
    add(g, G.plane(3.0, 3.1), texMat(ihsTex('q4', ['KRONOS Q4-4670', '3.40 GHz', 'LGA1150 · 22 nm'])), [0, y0 + 0.401, 0], [-PI / 2, 0, 0], { cast: false });
    top = y0 + 0.4;
  } else if (kind === 'am5') {
    const y0 = 0.37;
    add(g, G.box(4.0, 0.12, 4.0), mat('#2a5a3a', 0.45), [0, y0 + 0.06, 0]);
    // "ahtapot" ısı dağıtıcı: gövde + 8 bacak
    add(g, G.rbox(3.3, 0.36, 3.0, 0.08), M.nickel, [0, y0 + 0.3, 0]);
    const legs = [];
    for (const sx of [-1, 1]) for (const k of [-1, 1]) {
      legs.push([sx * 1.75, 0, k * 1.0], [k * 1.0, 0, sx * 1.6]);
    }
    add(g, arrayGeo(G.box(0.45, 0.2, 0.45), legs), M.nickel, [0, y0 + 0.22, 0]);
    // bacaklar arası kapasitörler (gerçekte IHS kesiklerinde görünür)
    add(g, arrayGeo(G.box(0.12, 0.05, 0.08), [...Array(12)].map((_, i) => [-1.6 + (i % 6) * 0.65, 0, i < 6 ? 1.85 : -1.85])), mat('#c8b080', 0.4), [0, y0 + 0.14, 0]);
    add(g, G.plane(3.1, 2.8), texMat(ihsTex('r8', ['KRONOS R8-9700', '8 ÇEKİRDEK · AM5', 'TSMC-sınıfı 4 nm*'])), [0, y0 + 0.481, 0], [-PI / 2, 0, 0], { cast: false });
    top = y0 + 0.48;
  }
  g.userData.top = top;
  return g;
}

// ---------------------------------------------------------------- Soğutucular
// base: soğutucunun CPU'ya oturduğu yükseklik
export function buildCooler(kind, base, { rgb = null } = {}) {
  const g = new THREE.Group();
  g.userData.mergeRoot = true;
  if (kind === 'pinfin') {
    // 1990'lar: alüminyum iğne kanatlı soğutucu + 50 mm fan
    const b = group(g, [-0.1, base, 0]);
    add(b, G.box(5.0, 0.35, 5.0), M.aluminum, [0, 0.175, 0]);
    const pins = [];
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) pins.push([(i - 4) * 0.55, 0.35 + 0.6, (j - 4) * 0.55]);
    add(b, arrayGeo(G.box(0.3, 1.2, 0.3), pins), M.aluminum);
    // tel klips
    add(b, G.box(0.12, 0.12, 6.4), M.steel, [0, 1.65, 0]);
    add(b, G.box(0.12, 1.6, 0.12), M.steel, [0, 0.85, 3.2]);
    add(b, G.box(0.12, 1.6, 0.12), M.steel, [0, 0.85, -3.2]);
    const fan = caseFan(5.0, { depth: 1.0, blades: 7 });
    fan.rotation.x = PI / 2;
    fan.position.set(0, 2.1, 0);
    b.add(fan);
    g.userData.height = base + 2.6;
  } else if (kind === 'box478') {
    // 2000'ler: kutu soğutucu (alüminyum + bakır çekirdek), plastik davlumbaz, 70 mm fan
    const b = group(g, [-0.25, base, 0.1]);
    add(b, G.cyl(1.4, 1.4, 0.3, 32), M.copper, [0, 0.15, 0]);
    add(b, G.box(7.0, 0.5, 7.0), M.aluminum, [0, 0.4, 0]);
    // radyal kanatçıklar
    const fins = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * PI * 2;
      fins.push([Math.cos(a) * 2.2, 2.0, Math.sin(a) * 2.2, 0, -a, 0]);
    }
    add(b, arrayGeo(G.box(2.6, 3.0, 0.08), fins), M.aluminum);
    add(b, G.cyl(1.1, 1.1, 3.0, 24), M.copper, [0, 2.0, 0]);
    // davlumbaz
    const s = rrectShape(7.6, 7.6, 0.6); s.holes = [rrectPath(6.8, 6.8, 3.2)];
    add(b, extrude(s, 1.1), M.matteBlack, [0, 4.6, 0], [PI / 2, 0, 0]);
    const fan = caseFan(7.0, { depth: 1.5, blades: 7 });
    fan.rotation.x = PI / 2; fan.position.set(0, 4.3, 0);
    b.add(fan);
    // klips kolları
    for (const sx of [-1, 1]) {
      add(b, G.box(0.5, 1.0, 7.2), M.matteBlack, [sx * 3.95, 1.0, 0]);
      add(b, G.box(0.35, 0.35, 2.2), M.whitePlastic, [sx * 4.3, 1.6, -1.8], [0.5, 0, 0]);
    }
    g.userData.height = base + 5.2;
  } else if (kind === 'stockRound') {
    // 2010'lar: yuvarlak alüminyum kanatçıklı, bakır çekirdekli kutu soğutucu, itmeli pimler
    const b = group(g, [0, base, 0]);
    add(b, G.cyl(1.5, 1.5, 0.4, 32), M.copper, [0, 0.2, 0]);
    add(b, G.cyl(1.3, 1.3, 3.0, 32), M.copper, [0, 1.8, 0]);
    const fins = [];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * PI * 2;
      fins.push([Math.cos(a) * 2.9, 1.8, Math.sin(a) * 2.9, 0, -a + 0.35, 0]);
    }
    add(b, arrayGeo(G.box(3.3, 3.2, 0.07), fins), M.aluminum);
    const fan = caseFan(9.0, { depth: 1.3, blades: 9, frameless: true });
    fan.rotation.x = PI / 2; fan.position.set(0, 3.8, 0);
    b.add(fan);
    add(b, G.torus(4.4, 0.12, 6, 48), M.blackPlastic, [0, 4.4, 0], [PI / 2, 0, 0]);
    const s = new THREE.Shape(); s.absarc(0, 0, 4.7, 0, PI * 2); s.holes = [new THREE.Path().absarc(0, 0, 4.3, 0, PI * 2, true)];
    add(b, extrude(s, 1.2), M.blackPlastic, [0, 4.5, 0], [PI / 2, 0, 0]);
    // 4 itmeli pim ayağı
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      add(b, G.box(0.7, 4.2, 0.7), M.blackPlastic, [sx * 3.75, 2.2, sz * 3.75]);
      add(b, G.cyl(0.42, 0.42, 0.5, 12), M.whitePlastic, [sx * 3.75, 4.5, sz * 3.75]);
    }
    for (let i = 0; i < 4; i++) {
      const a = PI / 4 + i * PI / 2;
      add(b, G.box(1.5, 0.3, 0.6), M.blackPlastic, [Math.cos(a) * 4.5, 4.4, Math.sin(a) * 4.5], [0, -a, 0]);
    }
    g.userData.height = base + 5.1;
  } else if (kind === 'tower') {
    // 2025: ısı borulu kule soğutucu + 120 mm fan
    const b = group(g, [0, base, 0]);
    add(b, G.box(4.0, 0.35, 4.2), M.nickel, [0, 0.175, 0]);
    add(b, G.box(4.4, 0.7, 3.4), M.nickel, [0, 0.7, 0]);
    // bağlantı köprüsü
    add(b, G.box(9.0, 0.25, 1.0), M.nickel, [0, 1.1, 0]);
    // ısı boruları (U şekli)
    const pipeXs = [-2.1, -0.7, 0.7, 2.1];
    for (const px of pipeXs) {
      const c = makeCurve([[px, 15.6, -1.7], [px, 4.0, -1.7], [px, 1.2, -1.2], [px, 0.55, 0], [px, 1.2, 1.2], [px, 4.0, 1.7], [px, 15.6, 1.7]]);
      add(b, tubeGeo(c, 0.3, 64, 10), M.nickel);
      add(b, G.cyl(0.3, 0.3, 0.15, 12), M.nickel, [px, 15.7, -1.7]);
      add(b, G.cyl(0.3, 0.3, 0.15, 12), M.nickel, [px, 15.7, 1.7]);
    }
    // kanatçık yığını (yatay plakalar)
    const fins = [];
    for (let i = 0; i < 46; i++) fins.push([0, 4.0 + i * 0.25, 0]);
    add(b, arrayGeo(G.box(12.4, 0.04, 5.0), fins), M.aluminum);
    // üst kapak
    add(b, G.rbox(12.6, 0.4, 5.2, 0.15), M.anodizedBlack, [0, 15.75, 0]);
    add(b, G.box(6.0, 0.02, 1.0), M.aluminumDark, [0, 15.96, 0]);
    // fan (öne monte, arkaya üfler)
    const fan = caseFan(12.0, { depth: 2.5, blades: 9, rgb, blade: rgb ? M.fanBladeClear : M.fanBlade, frame: M.blackPlastic });
    fan.rotation.y = PI;
    fan.position.set(0, 9.7, 3.85);
    b.add(fan);
    // tel klipsler
    for (const y of [4.0, 15.4]) add(b, G.box(12.4, 0.08, 0.08), M.steel, [0, y, 2.65]);
    g.userData.height = base + 16.0;
  } else if (kind === 'lowProfile') {
    // 2025 ofis: alçak profilli kutu soğutucu
    const b = group(g, [0, base, 0]);
    add(b, G.cyl(1.6, 1.6, 0.4, 32), M.aluminumDark, [0, 0.2, 0]);
    const fins = [];
    for (let i = 0; i < 44; i++) { const a = (i / 44) * PI * 2; fins.push([Math.cos(a) * 2.6, 1.3, Math.sin(a) * 2.6, 0, -a + 0.3, 0]); }
    add(b, arrayGeo(G.box(2.8, 2.2, 0.07), fins), M.aluminumDark);
    add(b, G.cyl(1.2, 1.2, 2.2, 24), M.aluminumDark, [0, 1.3, 0]);
    const fan = caseFan(8.5, { depth: 1.2, blades: 9, frameless: true });
    fan.rotation.x = PI / 2; fan.position.set(0, 2.9, 0);
    b.add(fan);
    const s = new THREE.Shape(); s.absarc(0, 0, 4.6, 0, PI * 2); s.holes = [new THREE.Path().absarc(0, 0, 4.2, 0, PI * 2, true)];
    add(b, extrude(s, 1.4), M.blackPlastic, [0, 3.6, 0], [PI / 2, 0, 0]);
    for (const sx of [-1, 1]) add(b, G.box(1.2, 0.4, 9.0), M.blackPlastic, [sx * 4.0, 1.6, 0]);
    g.userData.height = base + 3.8;
  }
  return g;
}
