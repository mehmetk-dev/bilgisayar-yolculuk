// Kukla kostümleri ve dekorlar (hepsi SVG, internetsiz çalışır)
// Kostümler Scratch'teki gibi SAĞA bakacak şekilde çizilir; w,h sahnedeki boyutudur (%100 büyüklükte)
import { roboSVG } from '../robo.js';

const svg = (vb, body) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

// --- kedi ---
const catBody = (legs, tail) => svg('0 0 110 90', `
<path d="${tail}" fill="none" stroke="#d9771f" stroke-width="9" stroke-linecap="round"/>
${legs.map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="20" rx="5" fill="#f4a340" stroke="#c96f1c" stroke-width="2.5"/>`).join('')}
<ellipse cx="48" cy="56" rx="31" ry="20" fill="#f4a340" stroke="#c96f1c" stroke-width="3"/>
<ellipse cx="50" cy="63" rx="18" ry="10" fill="#ffe2bd"/>
<path d="M63 22 L66 3 L77 18 Z M85 18 L95 4 L97 25 Z" fill="#f4a340" stroke="#c96f1c" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M66 18 L67 8 L74 17 Z M88 17 L94 9 L95 21 Z" fill="#ff9fb4"/>
<circle cx="80" cy="37" r="22" fill="#f4a340" stroke="#c96f1c" stroke-width="3"/>
<ellipse cx="74" cy="33" rx="3.6" ry="5.2" fill="#2b2340"/><ellipse cx="88" cy="33" rx="3.6" ry="5.2" fill="#2b2340"/>
<circle cx="75" cy="31.5" r="1.3" fill="#fff"/><circle cx="89" cy="31.5" r="1.3" fill="#fff"/>
<path d="M93 41 l5 0 l-2.5 3.5 z" fill="#ff6f91"/>
<path d="M90 47 q4 4 8 0" fill="none" stroke="#7a3d12" stroke-width="2" stroke-linecap="round"/>
<path d="M100 44 l9 -2 M100 47 l9 2" stroke="#7a3d12" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="70" cy="43" r="3" fill="#ff9fb4" opacity="0.7"/>`);

// --- köpek ---
const dogBody = (legs) => svg('0 0 110 90', `
<path d="M18 50 Q6 40 10 28" fill="none" stroke="#a0662f" stroke-width="8" stroke-linecap="round"/>
${legs.map(([x, y]) => `<rect x="${x}" y="${y}" width="11" height="20" rx="5" fill="#c98a4b" stroke="#8a5525" stroke-width="2.5"/>`).join('')}
<ellipse cx="46" cy="56" rx="31" ry="19" fill="#c98a4b" stroke="#8a5525" stroke-width="3"/>
<ellipse cx="40" cy="50" rx="10" ry="7" fill="#fff3e3" opacity="0.8"/>
<circle cx="80" cy="36" r="21" fill="#c98a4b" stroke="#8a5525" stroke-width="3"/>
<ellipse cx="96" cy="44" rx="12" ry="9" fill="#f2d3ae" stroke="#8a5525" stroke-width="2.5"/>
<ellipse cx="104" cy="40" rx="4.5" ry="3.5" fill="#2b2340"/>
<path d="M66 18 Q56 26 60 48 Q68 46 70 26 Z" fill="#7a4a1f"/>
<circle cx="84" cy="30" r="3.8" fill="#2b2340"/><circle cx="85" cy="28.8" r="1.2" fill="#fff"/>
<path d="M95 51 q4 5 9 1" fill="none" stroke="#5b2f10" stroke-width="2" stroke-linecap="round"/>
<path d="M100 52 q2 7 -3 7 q-4 0 -2 -6" fill="#ff7a8a"/>`);

const roboArms = (r) => roboSVG().replace('<g class="arm arm-l">', `<g class="arm arm-l" transform="rotate(${r} 26 66)">`).replace('<g class="arm arm-r">', `<g class="arm arm-r" transform="rotate(${-r} 74 66)">`).replace('class="robo"', 'class="robo" xmlns="http://www.w3.org/2000/svg"');

const fish = (t) => svg('0 0 100 64', `
<path d="M22 32 L2 ${14 + t} L6 32 L2 ${50 - t} Z" fill="#ff8a3d" stroke="#c75b14" stroke-width="2.5" stroke-linejoin="round"/>
<ellipse cx="54" cy="32" rx="38" ry="24" fill="#ffb547" stroke="#c75b14" stroke-width="3"/>
<path d="M44 10 Q56 0 66 9" fill="#ff8a3d" stroke="#c75b14" stroke-width="2.5"/>
<path d="M40 14 Q34 32 40 50 M52 10 Q46 32 52 54" fill="none" stroke="#ff8a3d" stroke-width="5" opacity="0.7"/>
<circle cx="76" cy="26" r="7.5" fill="#fff" stroke="#c75b14" stroke-width="2"/><circle cx="78" cy="26" r="3.6" fill="#2b2340"/>
<path d="M84 40 q4 3 8 -1" fill="none" stroke="#7a3300" stroke-width="2" stroke-linecap="round"/>`);

const bee = (w) => svg('0 0 90 70', `
<ellipse cx="38" cy="${20 - w}" rx="14" ry="${18 - w}" fill="#e6f6ff" stroke="#8fc4e8" stroke-width="2" opacity="0.9" transform="rotate(-20 38 30)"/>
<ellipse cx="54" cy="${20 - w}" rx="12" ry="${16 - w}" fill="#e6f6ff" stroke="#8fc4e8" stroke-width="2" opacity="0.9" transform="rotate(15 54 30)"/>
<path d="M8 44 L18 41 L18 47 Z" fill="#2b2340"/>
<ellipse cx="44" cy="44" rx="28" ry="20" fill="#ffd23f" stroke="#2b2340" stroke-width="3"/>
<path d="M32 26 Q28 44 32 62 M46 24 Q42 44 46 64" fill="none" stroke="#2b2340" stroke-width="7"/>
<circle cx="70" cy="40" r="13" fill="#ffd23f" stroke="#2b2340" stroke-width="3"/>
<circle cx="74" cy="37" r="3.5" fill="#2b2340"/><circle cx="75" cy="36" r="1.1" fill="#fff"/>
<path d="M72 45 q4 3 8 -1" fill="none" stroke="#2b2340" stroke-width="2" stroke-linecap="round"/>
<path d="M68 28 Q70 16 76 14 M74 30 Q80 20 86 20" fill="none" stroke="#2b2340" stroke-width="2"/>`);

const bird = (up) => svg('0 0 90 70', `
<path d="M10 38 L2 30 L4 44 Z" fill="#2f6fd6"/>
<ellipse cx="40" cy="40" rx="28" ry="20" fill="#4c97ff" stroke="#1f5fbf" stroke-width="3"/>
<ellipse cx="44" cy="46" rx="16" ry="10" fill="#cfe4ff"/>
${up ? '<path d="M30 34 Q36 4 54 10 Q46 26 44 36 Z" fill="#2f6fd6" stroke="#1f5fbf" stroke-width="2.5" stroke-linejoin="round"/>'
    : '<path d="M30 40 Q38 66 54 62 Q46 50 46 40 Z" fill="#2f6fd6" stroke="#1f5fbf" stroke-width="2.5" stroke-linejoin="round"/>'}
<circle cx="64" cy="30" r="13" fill="#4c97ff" stroke="#1f5fbf" stroke-width="3"/>
<path d="M75 28 L88 32 L75 36 Z" fill="#ffab19" stroke="#c77800" stroke-width="2" stroke-linejoin="round"/>
<circle cx="67" cy="27" r="3.5" fill="#2b2340"/><circle cx="68" cy="26" r="1.1" fill="#fff"/>`);

const rocket = (fire) => svg('0 0 110 50', `
${fire ? '<path d="M18 25 L0 14 L8 25 L0 36 Z" fill="#ff8a3d"/><path d="M18 25 L6 19 L11 25 L6 31 Z" fill="#ffd23f"/>' : ''}
<path d="M24 12 L14 2 L14 18 Z M24 38 L14 48 L14 32 Z" fill="#e0457b" stroke="#9c1f4d" stroke-width="2" stroke-linejoin="round"/>
<path d="M18 13 H74 Q100 16 108 25 Q100 34 74 37 H18 Z" fill="#f4f6fb" stroke="#5a6676" stroke-width="3" stroke-linejoin="round"/>
<path d="M90 18 Q100 20 108 25 Q100 30 90 32 Z" fill="#e0457b"/>
<circle cx="62" cy="25" r="7" fill="#7fd3ff" stroke="#2f6fd6" stroke-width="2.5"/>
<rect x="26" y="20" width="18" height="10" rx="3" fill="#e0457b"/>`);

const dice = (n) => {
  const P = { 1: [[25, 25]], 2: [[14, 14], [36, 36]], 3: [[14, 14], [25, 25], [36, 36]], 4: [[14, 14], [36, 14], [14, 36], [36, 36]], 5: [[14, 14], [36, 14], [25, 25], [14, 36], [36, 36]], 6: [[14, 13], [36, 13], [14, 25], [36, 25], [14, 37], [36, 37]] };
  return svg('0 0 50 50', `<rect x="2" y="2" width="46" height="46" rx="10" fill="#fff" stroke="#2b2340" stroke-width="3"/>${P[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${n === 1 ? '#e0457b' : '#2b2340'}"/>`).join('')}`);
};

export const COSTUMES = {
  kedi: { name: 'Kedi', w: 95, h: 78, frames: [catBody([[26, 66], [58, 66]], 'M20 52 Q4 40 10 18'), catBody([[20, 64], [64, 64]], 'M20 52 Q2 46 4 24')] },
  kopek: { name: 'Köpek', w: 95, h: 78, frames: [dogBody([[24, 66], [58, 66]]), dogBody([[18, 64], [64, 64]])] },
  robo: { name: 'Robo', w: 66, h: 70, frames: [roboArms(0), roboArms(-60)] },
  balik: { name: 'Balık', w: 80, h: 52, frames: [fish(0), fish(8)] },
  ari: { name: 'Arı', w: 64, h: 50, frames: [bee(0), bee(6)] },
  kus: { name: 'Kuş', w: 68, h: 53, frames: [bird(true), bird(false)] },
  roket: { name: 'Roket', w: 88, h: 40, frames: [rocket(false), rocket(true)] },
  elma: { name: 'Elma', w: 40, h: 44, frames: [svg('0 0 40 44', '<path d="M20 12 Q30 4 37 14 Q42 28 30 40 Q25 44 20 41 Q15 44 10 40 Q-2 28 3 14 Q10 4 20 12 Z" fill="#ff4d4d" stroke="#b81f1f" stroke-width="2.5"/><path d="M20 12 Q19 6 22 1" stroke="#7a4a1f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M22 7 Q30 0 34 6 Q28 10 22 7 Z" fill="#2fbf71"/><ellipse cx="11" cy="18" rx="3" ry="5" fill="#fff" opacity="0.5"/>')] },
  top: { name: 'Top', w: 44, h: 44, frames: [svg('0 0 44 44', '<circle cx="22" cy="22" r="20" fill="#fff" stroke="#2b2340" stroke-width="2.5"/><path d="M22 2 A20 20 0 0 1 42 22 L22 22 Z" fill="#ff4d4d"/><path d="M22 42 A20 20 0 0 1 2 22 L22 22 Z" fill="#2f8cff"/><path d="M2 22 A20 20 0 0 1 22 2 L22 22 Z" fill="#ffd23f"/><circle cx="22" cy="22" r="20" fill="none" stroke="#2b2340" stroke-width="2.5"/><circle cx="22" cy="22" r="4" fill="#fff" stroke="#2b2340" stroke-width="2"/>')] },
  yildiz: { name: 'Yıldız', w: 46, h: 46, frames: [svg('0 0 46 46', '<path d="M23 2 L29 16 L44 17 L32 27 L36 43 L23 34 L10 43 L14 27 L2 17 L17 16 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="2.5" stroke-linejoin="round"/><circle cx="19" cy="22" r="2" fill="#2b2340"/><circle cx="27" cy="22" r="2" fill="#2b2340"/><path d="M19 28 q4 3 8 0" fill="none" stroke="#2b2340" stroke-width="1.8" stroke-linecap="round"/>')] },
  cicek: { name: 'Çiçek', w: 46, h: 60, frames: [svg('0 0 46 60', '<path d="M23 30 V58" stroke="#2fbf71" stroke-width="4"/><path d="M23 48 Q10 40 8 46 Q14 52 23 50 Z" fill="#2fbf71"/>' + [0, 72, 144, 216, 288].map((a) => `<ellipse cx="23" cy="12" rx="8" ry="11" fill="#ff7ab6" stroke="#d1457f" stroke-width="2" transform="rotate(${a} 23 23)"/>`).join('') + '<circle cx="23" cy="23" r="8" fill="#ffd23f" stroke="#c99a00" stroke-width="2"/>')] },
  kalem: { name: 'Kalem', w: 130, h: 24, frames: [svg('0 0 130 24', '<path d="M65 12 L78 4 H120 Q128 4 128 12 Q128 20 120 20 H78 Z" fill="#ffd23f" stroke="#b07a00" stroke-width="2"/><path d="M65 12 L78 4 V20 Z" fill="#f2d3ae" stroke="#b07a00" stroke-width="2" stroke-linejoin="round"/><path d="M65 12 L70 9 V15 Z" fill="#2b2340"/><rect x="112" y="4" width="8" height="16" fill="#ff7ab6"/>')] },
  sepet: { name: 'Sepet', w: 90, h: 50, frames: [svg('0 0 90 50', '<path d="M18 14 Q45 -14 72 14" fill="none" stroke="#8a5525" stroke-width="4"/><path d="M4 16 H86 L76 48 H14 Z" fill="#d9a066" stroke="#8a5525" stroke-width="3" stroke-linejoin="round"/><path d="M10 26 H80 M13 36 H77 M30 16 L28 48 M45 16 V48 M60 16 L62 48" stroke="#8a5525" stroke-width="2" opacity="0.6"/>')] },
  fare: { name: 'Fare', w: 46, h: 30, frames: [svg('0 0 60 40', '<path d="M8 26 Q0 34 -2 22" fill="none" stroke="#ff9fb4" stroke-width="3" stroke-linecap="round"/><ellipse cx="28" cy="25" rx="20" ry="12" fill="#b9b9c9" stroke="#6b6380" stroke-width="2.5"/><circle cx="40" cy="12" r="7" fill="#b9b9c9" stroke="#6b6380" stroke-width="2.5"/><circle cx="40" cy="12" r="3.5" fill="#ff9fb4"/><path d="M42 18 Q50 20 58 26 Q50 30 42 30 Z" fill="#b9b9c9" stroke="#6b6380" stroke-width="2.5"/><circle cx="50" cy="23" r="2.2" fill="#2b2340"/><circle cx="58" cy="26" r="2.4" fill="#ff6f91"/>')] },
  peynir: { name: 'Peynir', w: 48, h: 36, frames: [svg('0 0 48 36', '<path d="M2 32 L46 32 L46 12 L10 4 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="2.5" stroke-linejoin="round"/><path d="M2 32 L10 4 L46 12" fill="none" stroke="#c99a00" stroke-width="2.5"/><circle cx="20" cy="22" r="4" fill="#e8b800"/><circle cx="34" cy="20" r="3" fill="#e8b800"/><circle cx="38" cy="27" r="2.5" fill="#e8b800"/>')] },
  hayalet: { name: 'Hayalet', w: 60, h: 68, frames: [svg('0 0 60 68', '<path d="M6 30 Q6 4 30 4 Q54 4 54 30 V62 L46 56 L38 64 L30 56 L22 64 L14 56 L6 62 Z" fill="#fff" stroke="#9aa6c4" stroke-width="3" stroke-linejoin="round"/><ellipse cx="22" cy="28" rx="4.5" ry="6.5" fill="#2b2340"/><ellipse cx="38" cy="28" rx="4.5" ry="6.5" fill="#2b2340"/><ellipse cx="30" cy="42" rx="5" ry="6" fill="#2b2340"/>')] },
  asteroit: { name: 'Göktaşı', w: 56, h: 50, frames: [svg('0 0 56 50', '<path d="M10 14 L26 4 L46 8 L54 26 L44 44 L22 48 L4 34 Z" fill="#8a8299" stroke="#4d4660" stroke-width="3" stroke-linejoin="round"/><circle cx="22" cy="20" r="6" fill="#6b6380"/><circle cx="38" cy="32" r="5" fill="#6b6380"/><circle cx="18" cy="36" r="3" fill="#6b6380"/>')] },
  kalp: { name: 'Kalp', w: 40, h: 36, frames: [svg('0 0 40 36', '<path d="M20 34 Q2 22 2 11 Q2 2 11 2 Q17 2 20 8 Q23 2 29 2 Q38 2 38 11 Q38 22 20 34 Z" fill="#ff4d6d" stroke="#b8173a" stroke-width="2.5"/><ellipse cx="11" cy="10" rx="3" ry="4" fill="#fff" opacity="0.6"/>')] },
  bayrak: { name: 'Bayrak', w: 44, h: 60, frames: [svg('0 0 44 60', '<rect x="6" y="4" width="4" height="54" rx="2" fill="#6b6380"/><path d="M10 6 H40 V30 H10 Z" fill="#fff" stroke="#2b2340" stroke-width="2"/><path d="M10 6 H18 V14 H10 Z M26 6 H34 V14 H26 Z M18 14 H26 V22 H18 Z M34 14 H40 V22 H34 Z M10 22 H18 V30 H10 Z M26 22 H34 V30 H26 Z" fill="#2b2340"/>')] },
  boc: { name: 'Uğur böceği', w: 46, h: 40, frames: [svg('0 0 46 40', '<circle cx="38" cy="20" r="8" fill="#2b2340"/><ellipse cx="21" cy="20" rx="19" ry="17" fill="#ff3d3d" stroke="#2b2340" stroke-width="2.5"/><path d="M21 3 V37" stroke="#2b2340" stroke-width="2.5"/><circle cx="12" cy="12" r="3.5" fill="#2b2340"/><circle cx="30" cy="12" r="3.5" fill="#2b2340"/><circle cx="12" cy="27" r="3.5" fill="#2b2340"/><circle cx="30" cy="27" r="3.5" fill="#2b2340"/><circle cx="41" cy="17" r="1.6" fill="#fff"/><circle cx="41" cy="23" r="1.6" fill="#fff"/>')] },
  davul: { name: 'Davul', w: 70, h: 56, frames: [svg('0 0 70 56', '<ellipse cx="35" cy="16" rx="30" ry="10" fill="#fff3e3" stroke="#8a5525" stroke-width="3"/><path d="M5 16 V42 Q35 58 65 42 V16 Q35 32 5 16 Z" fill="#e0457b" stroke="#8a5525" stroke-width="3"/><path d="M8 22 L20 46 L32 24 L44 48 L56 24 L62 40" fill="none" stroke="#ffd23f" stroke-width="3"/>'), svg('0 0 70 56', '<ellipse cx="35" cy="18" rx="30" ry="10" fill="#ffe14d" stroke="#8a5525" stroke-width="3"/><path d="M5 18 V44 Q35 60 65 44 V18 Q35 34 5 18 Z" fill="#ff6f9a" stroke="#8a5525" stroke-width="3"/><path d="M8 24 L20 48 L32 26 L44 50 L56 26 L62 42" fill="none" stroke="#ffd23f" stroke-width="3"/><path d="M2 4 L10 10 M68 4 L60 10 M35 0 V6" stroke="#ff8a3d" stroke-width="3" stroke-linecap="round"/>')] },
  zil: { name: 'Zil', w: 54, h: 56, frames: [svg('0 0 54 56', '<path d="M27 4 Q44 4 46 26 Q47 40 52 44 H2 Q7 40 8 26 Q10 4 27 4 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="3" stroke-linejoin="round"/><circle cx="27" cy="49" r="5" fill="#c99a00"/><path d="M17 14 Q14 22 15 32" stroke="#fff" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>')] },
  zar: { name: 'Zar', w: 50, h: 50, frames: [1, 2, 3, 4, 5, 6].map(dice) },
};

// --- dekorlar (480×360) ---
function rnd(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}
const stars = (n, seed, h = 360) => { const r = rnd(seed); return Array.from({ length: n }, () => `<circle cx="${(r() * 480).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(r() * 1.6 + 0.4).toFixed(1)}" fill="#fff" opacity="${(r() * 0.6 + 0.4).toFixed(2)}"/>`).join(''); };
const bd = (body) => `<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${body}</svg>`;

// Labirent duvarları: sahne koordinatında [x1, y1, x2, y2] (sol-alt, sağ-üst)
const MAZE1 = [[-240, 170, 240, 180], [-240, -180, 240, -170], [-240, -180, -230, 180], [230, -180, 240, 180],
  [-160, -80, -150, 170], [-80, -170, -70, 90], [0, -80, 10, 170], [80, -170, 90, 90], [160, -80, 170, 170]];
const MAZE2 = [[-240, 170, 240, 180], [-240, -180, 240, -170], [-240, -180, -230, 180], [230, -180, 240, 180],
  [-170, 90, 120, 100], [-240, 20, -60, 30], [20, -60, 240, 30], [-130, -100, -120, 30], [-170, -100, 60, -90], [110, 30, 120, 100]];
const wallSVG = (walls, fill, stroke) => walls.map(([x1, y1, x2, y2]) => `<rect x="${x1 + 240}" y="${180 - y2}" width="${x2 - x1}" height="${y2 - y1}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`).join('');

export const BACKDROPS = {
  beyaz: { name: 'Beyaz', svg: bd('<rect width="480" height="360" fill="#fff"/>') },
  koordinat: { name: 'Koordinat', svg: bd(`<rect width="480" height="360" fill="#fff"/>${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="360" stroke="#e4e9f0"/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 45 + 22.5}" x2="480" y2="${i * 45 + 22.5}" stroke="#e4e9f0"/>`).join('')}<line x1="0" y1="180" x2="480" y2="180" stroke="#8a93a3" stroke-width="2"/><line x1="240" y1="0" x2="240" y2="360" stroke="#8a93a3" stroke-width="2"/><g font-family="sans-serif" font-size="13" font-weight="700" fill="#5a6676"><text x="462" y="174">x</text><text x="248" y="16">y</text><text x="244" y="196">0</text><text x="440" y="196">240</text><text x="4" y="196">-240</text><text x="246" y="34">180</text><text x="246" y="352">-180</text></g>`) },
  cayir: { name: 'Çayır', svg: bd(`<defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#d9f1ff"/></linearGradient></defs><rect width="480" height="360" fill="url(#g1)"/><circle cx="410" cy="60" r="34" fill="#ffe14d"/><g fill="#fff" opacity="0.9"><ellipse cx="90" cy="60" rx="40" ry="16"/><ellipse cx="120" cy="50" rx="28" ry="18"/><ellipse cx="270" cy="90" rx="34" ry="12"/></g><path d="M0 250 Q120 190 240 240 Q360 290 480 220 V360 H0 Z" fill="#7ccf5e"/><path d="M0 290 Q160 250 300 290 Q400 315 480 290 V360 H0 Z" fill="#5db544"/>`) },
  uzay: { name: 'Uzay', svg: bd(`<defs><radialGradient id="g2" cx="0.3" cy="0.3" r="1"><stop offset="0" stop-color="#2c2a6b"/><stop offset="1" stop-color="#0b0b26"/></radialGradient></defs><rect width="480" height="360" fill="url(#g2)"/>${stars(90, 7)}<circle cx="390" cy="280" r="50" fill="#ff8a3d"/><ellipse cx="390" cy="280" rx="80" ry="16" fill="none" stroke="#ffd23f" stroke-width="5" transform="rotate(-15 390 280)"/><circle cx="80" cy="70" r="18" fill="#d9d9e6"/><circle cx="74" cy="66" r="4" fill="#b9b9c9"/>`) },
  deniz: { name: 'Deniz', svg: bd(`<defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3bb4f2"/><stop offset="1" stop-color="#0b4f8a"/></linearGradient></defs><rect width="480" height="360" fill="url(#g3)"/><path d="M60 0 L140 360 H90 L30 0 Z M300 0 L360 360 H330 L280 0 Z" fill="#fff" opacity="0.07"/><path d="M0 330 Q120 310 240 330 Q360 345 480 325 V360 H0 Z" fill="#f2d49b"/><path d="M60 335 Q50 300 64 270 Q74 240 62 210 M80 338 Q90 300 78 260 M420 330 Q410 290 424 250 Q436 220 422 190" fill="none" stroke="#2fbf71" stroke-width="8" stroke-linecap="round"/><g fill="none" stroke="#bfe9ff" stroke-width="2" opacity="0.7"><circle cx="200" cy="80" r="6"/><circle cx="214" cy="60" r="4"/><circle cx="360" cy="120" r="5"/></g>`) },
  sahne: { name: 'Tiyatro', svg: bd(`<rect width="480" height="360" fill="#2b2340"/><ellipse cx="240" cy="310" rx="200" ry="40" fill="#ffe8a3" opacity="0.25"/><rect y="290" width="480" height="70" fill="#a0662f"/><path d="M0 290 H480" stroke="#7a4a1f" stroke-width="4"/><path d="M0 0 H90 Q70 150 100 290 H0 Z M480 0 H390 Q410 150 380 290 H480 Z" fill="#c8102e"/><path d="M0 0 H480 V30 Q240 50 0 30 Z" fill="#a50d26"/>`) },
  gece: { name: 'Gece', svg: bd(`<rect width="480" height="360" fill="#1b2350"/>${stars(50, 3, 220)}<circle cx="400" cy="70" r="30" fill="#fff6c9"/><circle cx="388" cy="62" r="30" fill="#1b2350"/><path d="M0 360 V250 H40 V210 H90 V260 H130 V190 H190 V270 H230 V230 H290 V180 H340 V260 H380 V220 H430 V250 H480 V360 Z" fill="#0d1230"/><g fill="#ffd23f" opacity="0.8"><rect x="145" y="210" width="8" height="10"/><rect x="165" y="230" width="8" height="10"/><rect x="300" y="200" width="8" height="10"/><rect x="315" y="225" width="8" height="10"/><rect x="55" y="225" width="8" height="10"/></g>`) },
  orman: { name: 'Orman', svg: bd(`<rect width="480" height="360" fill="#c9f0d4"/><path d="M0 270 H480 V360 H0 Z" fill="#6cbf4f"/>${[30, 120, 210, 330, 430].map((x, i) => `<rect x="${x - 8}" y="${180 + (i % 2) * 20}" width="16" height="${90 - (i % 2) * 20}" fill="#8a5525"/><circle cx="${x}" cy="${160 + (i % 2) * 20}" r="${44 - (i % 2) * 8}" fill="#2f9e57"/><circle cx="${x - 20}" cy="${185 + (i % 2) * 20}" r="26" fill="#3cb46a"/><circle cx="${x + 22}" cy="${182 + (i % 2) * 20}" r="24" fill="#3cb46a"/>`).join('')}`) },
  labirent1: { name: 'Labirent 1', walls: MAZE1, svg: bd(`<rect width="480" height="360" fill="#eaf7e4"/>${wallSVG(MAZE1, '#2f9e57', '#1d6b39')}`) },
  labirent2: { name: 'Labirent 2', walls: MAZE2, svg: bd(`<rect width="480" height="360" fill="#eef1ff"/>${wallSVG(MAZE2, '#5b6ee1', '#2d3aa0')}`) },
};
