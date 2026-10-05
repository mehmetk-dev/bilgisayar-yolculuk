// Fiziksel tabanlı (PBR) malzeme kütüphanesi
import * as THREE from 'three';
import { brushedTex } from './textures.js';

const lib = new Map();

function std(key, p) {
  if (lib.has(key)) return lib.get(key);
  const m = p.physical ? new THREE.MeshPhysicalMaterial(p.params) : new THREE.MeshStandardMaterial(p.params);
  m.name = key;
  m.userData.shared = true;
  lib.set(key, m);
  return m;
}

// Düz renk + pürüzlülük + metallik
export function mat(color, rough = 0.5, metal = 0, extra = {}) {
  const key = `m|${color}|${rough}|${metal}|${JSON.stringify(extra)}`;
  return std(key, { params: { color, roughness: rough, metalness: metal, ...extra } });
}

export function texMat(map, { rough = 0.6, metal = 0, transparent = false, color = 0xffffff, emissive, emissiveMap, alphaTest, side } = {}) {
  const key = `t|${map.uuid}|${rough}|${metal}|${transparent}|${color}|${alphaTest}|${side}`;
  return std(key, { params: { map, roughness: rough, metalness: metal, transparent, color, ...(emissive ? { emissive, emissiveMap: emissiveMap || map } : {}), ...(alphaTest ? { alphaTest } : {}), ...(side ? { side } : {}) } });
}

export function physMat(key, params) {
  return std('p|' + key, { physical: true, params });
}

export const M = {
  get beige() { return mat('#d8cfb4', 0.55); },
  get beigeDark() { return mat('#c4b99b', 0.6); },
  get beigeLight() { return mat('#e3dcc6', 0.5); },
  get blackPlastic() { return mat('#18191b', 0.45); },
  get matteBlack() { return mat('#121314', 0.7); },
  get darkGray() { return mat('#2c2e31', 0.55); },
  get gray() { return mat('#6d7075', 0.5); },
  get silverPlastic() { return mat('#b9bdc2', 0.3, 0.6); },
  get steel() { const m = mat('#b8bcc0', 0.38, 0.85); if (!m.roughnessMap) { m.roughnessMap = brushedTex('st', { base: 120, amp: 30 }); m.roughnessMap.repeat.set(4, 4); } return m; },
  get galvanized() { return mat('#a9adb0', 0.45, 0.8); },
  get blackSteel() { return mat('#1b1c1f', 0.42, 0.55); },
  get gunmetal() { return mat('#3b3e43', 0.35, 0.8); },
  get aluminum() { return mat('#c9ccd0', 0.28, 1.0); },
  get aluminumDark() { return mat('#7d8288', 0.3, 1.0); },
  get anodizedBlack() { return mat('#1d1e21', 0.35, 0.7); },
  get copper() { return mat('#c27a4c', 0.28, 1.0); },
  get nickel() { return mat('#d4d6d8', 0.18, 1.0); },
  get gold() { return mat('#e2bd61', 0.22, 1.0); },
  get solder() { return mat('#cdd1d4', 0.25, 1.0); },
  get chrome() { return mat('#f0f2f4', 0.06, 1.0); },
  get platter() { return mat('#e8eaec', 0.05, 1.0); },
  get epoxy() { return mat('#1a1a1a', 0.55); },
  get ceramic() { return mat('#ddd9ce', 0.5); },
  get rubber() { return mat('#1e1e1e', 0.9); },
  get whitePlastic() { return mat('#ecebe6', 0.45); },
  get creamPlastic() { return mat('#efe6cf', 0.45); },
  get brownPlastic() { return mat('#7a4a2a', 0.45); },
  get bluePlastic() { return mat('#2a5db0', 0.4); },
  get redPlastic() { return mat('#b3261e', 0.45); },
  get yellowPlastic() { return mat('#e1b20f', 0.45); },
  get pcbGreen() { return mat('#1f5a32', 0.45); },
  get pcbBlack() { return mat('#16191a', 0.5); },
  get fr4Edge() { return mat('#c8c09a', 0.6); },
  get capSleeveBlack() { return mat('#1d1d22', 0.35, 0.2); },
  get capTop() { return mat('#c5c9cc', 0.3, 0.9); },
  get ferrite() { return mat('#3a3a3a', 0.8); },
  get thermal() { return mat('#9a9ea3', 0.8); },
  get magnet() { return mat('#55595e', 0.35, 0.8); },
  get glass() {
    return std('glass', { physical: true, params: { color: '#1e2528', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.22, envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: 0.03, depthWrite: false, side: THREE.DoubleSide } });
  },
  get smokeAcrylic() { return std('smoke', { params: { color: '#222', roughness: 0.1, transparent: true, opacity: 0.55, side: THREE.DoubleSide } }); },
  get fanBlade() { return std('fanblade', { params: { color: '#141414', roughness: 0.55, side: THREE.DoubleSide } }); },
  get fanBladeClear() { return std('fanbladeclear', { physical: true, params: { color: '#e9eef5', roughness: 0.25, transparent: true, opacity: 0.55, side: THREE.DoubleSide, emissive: '#ffffff', emissiveIntensity: 0.0 } }); },
  get cdData() { return std('cddata', { physical: true, params: { color: '#d8dde2', metalness: 1, roughness: 0.12, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [250, 900] } }); },
  get dvdData() { return std('dvddata', { physical: true, params: { color: '#c6a46c', metalness: 1, roughness: 0.12, iridescence: 1, iridescenceIOR: 1.5, iridescenceThicknessRange: [200, 700] } }); },
  get laser() { return std('laser', { params: { color: '#ff2020', emissive: '#ff2020', emissiveIntensity: 3, transparent: true, opacity: 0.85 } }); },
  ledGreen: null, ledAmber: null, ledRed: null,
};

export function led(color, intensity = 2.5) {
  return mat(color, 0.3, 0, { emissive: color, emissiveIntensity: intensity });
}

// PC 99 renk kodları (Microsoft & Intel PC 99 System Design Guide)
export const PC99 = {
  kb: '#7a4ea3',       // PS/2 klavye – mor
  mouse: '#3f9c42',    // PS/2 fare – yeşil
  serial: '#178f8f',   // seri – turkuaz
  parallel: '#8c1f4b', // paralel – bordo
  vga: '#2d4fa8',      // VGA – mavi
  game: '#c9a227',     // oyun/MIDI – altın sarısı
  lineOut: '#9cc93a',  // hoparlör/kulaklık – açık yeşil
  lineIn: '#7fb1dc',   // hat girişi – açık mavi
  mic: '#e98fb3',      // mikrofon – pembe
  rear: '#2b2b2b',     // arka hoparlör – siyah
  center: '#f39a2a',   // merkez/bas – turuncu
  side: '#9a9a9a',     // yan hoparlör – gri
  usb2: '#1a1a1a',
  usb3: '#2a62c9',     // USB 3.x 5 Gbps – mavi (yaygın uygulama)
  usb10: '#c42a2a',    // 10 Gbps – kırmızı (üreticiye göre değişir)
  dvi: '#f2f2ee',
  hdmi: '#111',
};
