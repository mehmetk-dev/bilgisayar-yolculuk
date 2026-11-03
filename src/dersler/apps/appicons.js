// Benzetim Windows 11'in simgeleri: elle çizilmiş, Fluent tarzı renkli SVG'ler (emoji yok).
// Emojiler eski Windows yazı tiplerinde hiç görünmez; bunlar her bilgisayarda aynı görünür ve çevrimdışı çalışır.
//
// Her simge, yazı boyutuna göre ölçeklenen satır içi <svg class="wi"> metnidir (1em x 1em); HTML'e olduğu gibi
// yazılır (innerHTML, şablon metni). textContent'e ya da title="" özniteliğine YAZILMAZ.
//   APP_ICONS[kimlik]  uygulama simgeleri (APPS[kimlik].icon bunlardır)
//   SYS_ICONS[ad]      masaüstü ve dosya simgeleri (pc, recycle, folder, file-txt, arrow ...)
//   MONO[ad]           tek renkli (currentColor) arayüz simgeleri: Wi-Fi, ses, pil, güç ...
//   iconFor(x)         eski emoji → SVG; bilinmeyen metni olduğu gibi verir (toast/dialog icon: parametresi için)
//   fileIconSvg(ad)    dosya adına göre simge
const SVG_NS = 'http://www.w3.org/2000/svg';

// ---- Ortak degrade ve kırpma tanımları (sayfaya bir kez, görünmez olarak eklenir) ----
const GR = {};
const lin = (id, a, b, v = [0, 0, 0, 1]) => { GR[id] = `<linearGradient id="wg-${id}" x1="${v[0]}" y1="${v[1]}" x2="${v[2]}" y2="${v[3]}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`; };
const rad = (id, a, b) => { GR[id] = `<radialGradient id="wg-${id}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`; };
lin('yel-b', '#e8a317', '#c98a0a'); lin('yel-f', '#ffdd6e', '#ffc42e'); lin('blue-s', '#4aa8ff', '#0b66d6');
lin('pg', '#ffffff', '#e4eaf2'); lin('gray', '#9aa6b4', '#5d6977'); lin('gearg', '#d3dae3', '#7d8996');
lin('nb', '#4cb2ff', '#0b63d1'); lin('npg', '#ffffff', '#d9e8fb');
lin('calc', '#6a747f', '#2c3239'); lin('calcd', '#d6e4f0', '#aec4d8'); lin('kb', '#e3e8ee', '#b9c3ce');
lin('kblue', '#4aa3ff', '#1a6fe0'); lin('kor', '#ffa24a', '#f26d0f');
lin('word', '#2f82e0', '#17509f'); lin('wordd', '#1c5cb8', '#0c3a85');
lin('xl', '#35c880', '#107c41'); lin('xld', '#1d8f58', '#0b5a2e');
lin('pp', '#ff946c', '#c43e1c'); lin('ppd', '#d9532b', '#9c2a0e');
lin('ol', '#2aa8ee', '#0561b5'); lin('old', '#1565c8', '#0a3b8f');
lin('sky', '#bfe3ff', '#78bdf5'); lin('sun', '#fff1a0', '#ffc933'); lin('mtn1', '#3fa6a0', '#1f6f79'); lin('mtn2', '#6a8be8', '#3b4fb5');
lin('hill', '#7ed56f', '#3a9b4a'); lin('pdf', '#f45b4f', '#c4271c');
lin('disc', '#fafbfd', '#a9b4c1'); lin('rainb', '#ff6a8a', '#7a5af8', [0, 0, 1, 1]); lin('note', '#ff9f43', '#e8456b', [0, 0, 1, 1]);
lin('bag', '#ffffff', '#c7d0dc'); lin('cloud1', '#0f6fd8', '#0a4ba3'); lin('cloud2', '#52b7ff', '#1b86ec');
lin('red', '#ff6b6b', '#d32f2f'); lin('cal', '#3b92ff', '#1665d8'); lin('yelnote', '#ffe974', '#f7bf1c'); lin('rec', '#5f86ff', '#3a32c4');
lin('clk', '#47a6ff', '#0a5fcc'); lin('shld', '#53c6ff', '#0a63d4'); lin('shld2', '#7fdcff', '#2e8cf0');
lin('bin', '#f4f8fc', '#b8cadd'); lin('mon', '#3c4650', '#1c2229'); lin('scr', '#7dcaff', '#0e63d4'); lin('glass', '#e8f6ff', '#8cc6f0');
lin('logo', '#4fc6ff', '#0a6fe0', [0, 0, 1, 1]); lin('hot', '#ff9a3d', '#e5311e'); lin('mine', '#5b6672', '#14181d'); lin('green', '#54d27f', '#1f9c53'); lin('purp', '#a78bfa', '#6d44e0');
lin('tmg', '#1e2630', '#10151b'); lin('sun2', '#ffd34d', '#ff9e1b'); lin('wcl', '#ffffff', '#cfdceb'); lin('bluebar', '#2d7be5', '#0f56bd');
GR.clip = '<clipPath id="wc-card"><rect x="5" y="7" width="38" height="34" rx="5"/></clipPath><clipPath id="wc-pg"><path d="M9 4h19l11 11v27a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></clipPath>';
const DEFS = Object.values(GR).join('');
const DEFS_HOLDER = `<svg xmlns="${SVG_NS}" width="0" height="0" focusable="false" aria-hidden="true"><defs>${DEFS}</defs></svg>`;

function installDefs() {
  if (typeof document === 'undefined' || document.getElementById('wi-defs')) return;
  const host = document.body || document.documentElement;
  const d = document.createElement('div');
  d.id = 'wi-defs';
  d.setAttribute('aria-hidden', 'true');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  d.innerHTML = DEFS_HOLDER;
  host.append(d);
}
if (typeof document !== 'undefined') {
  if (document.body) installDefs(); else document.addEventListener('DOMContentLoaded', installDefs);
}

// name: ekran görüntüsü çizicisi (desktop.js paintNode) simgeyi buradan tanır
const S = (name, body, vb = '0 0 48 48', cls = '') => `<svg class="wi${cls ? ' ' + cls : ''}" data-wi="${name}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
const u = (id) => `url(#wg-${id})`;
const f = (id, d, extra = '') => `<path d="${d}" fill="${u(id)}" ${extra}/>`;

// ---- Parçalar ----
const POLY = (cx, cy, r, ang, n = 3) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((ang + (360 / n) * i) * Math.PI / 180), cy + r * Math.sin((ang + (360 / n) * i) * Math.PI / 180)]);
const gearPath = (cx, cy, rO, rI, n) => {
  const step = 360 / n, b = step * 0.3, t = step * 0.17;
  const p = (r, a) => `${(cx + r * Math.cos(a * Math.PI / 180)).toFixed(2)} ${(cy + r * Math.sin(a * Math.PI / 180)).toFixed(2)}`;
  let d = `M${p(rI, -b)}`;
  for (let i = 0; i < n; i++) {
    const a = i * step;
    d += `L${p(rO, a - t)}L${p(rO, a + t)}L${p(rI, a + b)}A${rI} ${rI} 0 0 1 ${p(rI, a + step - b)}`;
  }
  return d + 'Z';
};
const folderBack = '<path d="M4 11a3 3 0 0 1 3-3h10.2a3 3 0 0 1 2.1.9l2.6 2.6H41a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#wg-yel-b)"/>';
const folderFront = '<path d="M4 18a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#wg-yel-f)"/><path d="M4 18a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v1H4z" fill="#fff" opacity=".35"/>';
const folder = (over = '') => folderBack + folderFront + over;
const pageBase = '<path d="M9 4h19l11 11v27a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="url(#wg-pg)" stroke="#aebbcc" stroke-width="1.2"/><path d="M28 4v9a2 2 0 0 0 2 2h9z" fill="#d3dce8" stroke="#aebbcc" stroke-width="1.2" stroke-linejoin="round"/>';
const page = (over = '') => pageBase + over;
const lines = (y = 22, n = 4, c = '#9fb0c4') => Array.from({ length: n }, (_, i) => `<path d="M14 ${y + i * 5}h${i === n - 1 ? 10 : 20}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`).join('');
const badge = (txt, id, x = 3, y = 24, w = 24) => `<rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="${u(id)}"/><text x="${x + w / 2}" y="${y + 10.4}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="9.5" fill="#fff">${txt}</text>`;

// Office tarzı: arkada sayfa, önde koyu kare + harf
const office = (pageGrad, tileGrad, letter, bars = '') => `<rect x="15" y="5" width="28" height="38" rx="3.5" fill="${u(pageGrad)}"/>${bars}<rect x="4" y="13" width="24" height="24" rx="3.5" fill="${u(tileGrad)}"/>${letter}`;
const wbars = '<g fill="#fff" opacity=".9"><rect x="30" y="11" width="9" height="2.6" rx="1.3"/><rect x="30" y="17" width="9" height="2.6" rx="1.3"/><rect x="30" y="23" width="9" height="2.6" rx="1.3"/><rect x="21" y="29" width="18" height="2.6" rx="1.3"/><rect x="21" y="35" width="18" height="2.6" rx="1.3"/></g>';

// ---- Uygulama simgeleri ----
const cloud = (x, y, s, id) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M11 30a7.5 7.5 0 0 1-.6-15A11 11 0 0 1 31 12.6 9 9 0 0 1 33 30z" fill="${u(id)}"/></g>`;
const chrome = (() => {
  const P = (a, r = 22) => `${(24 + r * Math.cos(a * Math.PI / 180)).toFixed(2)} ${(24 + r * Math.sin(a * Math.PI / 180)).toFixed(2)}`;
  const wedge = (a0, a1, c) => `<path d="M24 24L${P(a0)}A22 22 0 0 1 ${P(a1)}Z" fill="${c}"/>`;
  return wedge(210, 330, '#ea4335') + wedge(330, 450, '#fbbc04') + wedge(90, 210, '#34a853')
    + '<path d="M24 24L24 2A22 22 0 0 1 43 13z" fill="#000" opacity=".06"/><circle cx="24" cy="24" r="11.2" fill="#fff"/><circle cx="24" cy="24" r="8.6" fill="#4285f4"/><circle cx="24" cy="24" r="8.6" fill="none" stroke="#1a5fd0" stroke-width=".6" opacity=".4"/>';
})();
const recycleArrows = (c = '#2a7be4') => `<g fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 29l2.2-4m0 0l4-1.5m-4 1.5l.2-4.3"/><path d="M26 22.2l-1.8-3.4a2.6 2.6 0 0 0-4.6 0l-1.2 2"/><path d="M29.5 27h-4.2m0 0l1.7 3.2M25.3 27l2.3-3.6"/><path d="M22 31.5h-3.6a2.6 2.6 0 0 1-2.2-3.8l.6-1.1"/></g>`;
const binShape = '<path d="M11 14h26l-2.4 27a3 3 0 0 1-3 2.7H16.4a3 3 0 0 1-3-2.7z" fill="url(#wg-bin)" stroke="#8da4bd" stroke-width="1.4" stroke-linejoin="round"/><rect x="8.5" y="9.5" width="31" height="5" rx="2.5" fill="#eaf1f8" stroke="#8da4bd" stroke-width="1.4"/><path d="M18 18.5l.8 20M24 18.5v20M30 18.5l-.8 20" stroke="#fff" stroke-width="1.6" opacity=".6" stroke-linecap="round"/>';
const recycleMark = '<g fill="none" stroke="#2a7be4" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 2)"><path d="M20 30.5l-3-5.2 3.4-.4"/><path d="M17 25.3l3-5.2a2.4 2.4 0 0 1 4.2 0l1.3 2.2"/><path d="M26.3 36l5.9.1 1.6-3.1"/><path d="M32.2 36.1l3.1-5.2a2.4 2.4 0 0 0 0-2.4"/><path d="M19.8 28.2l-.3-2.6"/></g>';

const APP = {
  notepad: S('notepad', '<rect x="8" y="7" width="32" height="36" rx="4" fill="url(#wg-npg)" stroke="#9cc0ee" stroke-width="1"/><path d="M8 11a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v6H8z" fill="url(#wg-nb)"/><g fill="#0a4fa8"><rect x="14" y="3.5" width="3.4" height="9" rx="1.7"/><rect x="22.3" y="3.5" width="3.4" height="9" rx="1.7"/><rect x="30.6" y="3.5" width="3.4" height="9" rx="1.7"/></g><g fill="#cfe5ff"><rect x="14.7" y="4.5" width="2" height="5" rx="1"/><rect x="23" y="4.5" width="2" height="5" rx="1"/><rect x="31.3" y="4.5" width="2" height="5" rx="1"/></g><g stroke="#8aa9cc" stroke-width="2" stroke-linecap="round"><path d="M14 24h20M14 30h20M14 36h12"/></g>'),
  calc: S('calc', '<rect x="8" y="4" width="32" height="40" rx="5" fill="url(#wg-calc)"/><rect x="12" y="8" width="24" height="9.5" rx="2.2" fill="url(#wg-calcd)"/><path d="M33 11.2h-4.5M33 14.2h-2" stroke="#31506f" stroke-width="1.6" stroke-linecap="round"/><g fill="url(#wg-kb)"><rect x="12" y="21" width="7" height="5.6" rx="1.6"/><rect x="20.5" y="21" width="7" height="5.6" rx="1.6"/><rect x="12" y="28" width="7" height="5.6" rx="1.6"/><rect x="20.5" y="28" width="7" height="5.6" rx="1.6"/><rect x="12" y="35" width="7" height="5.6" rx="1.6"/><rect x="20.5" y="35" width="7" height="5.6" rx="1.6"/></g><rect x="29" y="21" width="7" height="5.6" rx="1.6" fill="url(#wg-kblue)"/><rect x="29" y="28" width="7" height="5.6" rx="1.6" fill="url(#wg-kblue)"/><rect x="29" y="35" width="7" height="5.6" rx="1.6" fill="url(#wg-kor)"/>'),
  explorer: S('explorer', folder('<path d="M4 31h40v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#wg-blue-s)"/><path d="M4 31h40" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>')),
  paint: S('paint', '<path d="M24 5C12.5 5 4 13 4 23.2c0 8.2 6.2 14.8 14 14.8 3.2 0 4.6-1.8 4.6-4 0-2.2 1.2-3.8 4.4-3.8H33c6.4 0 11-3.9 11-9.7C44 11.6 35.5 5 24 5z" fill="url(#wg-pg)" stroke="#aab6c6" stroke-width="1.3"/><circle cx="14.5" cy="30" r="3" fill="#d4dbe5" stroke="#aab6c6"/><circle cx="12.5" cy="19" r="3.4" fill="#ef4444"/><circle cx="21.5" cy="12.6" r="3.4" fill="#fbbf24"/><circle cx="31.5" cy="13" r="3.4" fill="#22c55e"/><circle cx="38" cy="21.5" r="3.4" fill="#2f7cf0"/><path d="M45 3.2c1.4 1.4 1.2 3-.4 4.6L30 22.5l-4-4L40.4 4c1.6-1.6 3.2-1.8 4.6-.8z" fill="#c78a4a"/><path d="M26 18.5l4 4-5.2 1.8c-1.4.5-2.6-.8-2-2.2z" fill="#4b5563"/><path d="M26 18.5l4 4-1.4 1.4-4-4z" fill="#9ca3af"/><path d="M22.7 22.6c-2.6 0-4.4 2-4.4 4.2 3 0 6-1.3 6.6-3.9z" fill="#2f7cf0"/>'),
  settings: S('settings', `<path d="${gearPath(24, 24, 20.5, 16, 8)}" fill="url(#wg-gearg)" stroke="#6f7c8a" stroke-width="1.2" stroke-linejoin="round"/><circle cx="24" cy="24" r="10.5" fill="#fff" opacity=".35"/><circle cx="24" cy="24" r="8" fill="#34414f"/><circle cx="24" cy="24" r="5.2" fill="#0f1720"/><path d="M12 14c3-4 7-6 11-6.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/>`),
  word: S('word', office('word', 'wordd', '<path d="M8.4 20l2.9 11.6 3.1-8.6 3.1 8.6 3-11.6" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>', wbars)),
  sheet: S('sheet', office('xl', 'xld', '<path d="M9.5 20l9 12M18.5 20l-9 12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>', '<g fill="#fff" opacity=".9"><rect x="30" y="11" width="9" height="4.4" rx="1"/><rect x="30" y="18" width="9" height="4.4" rx="1"/><rect x="30" y="25" width="9" height="4.4" rx="1"/><rect x="30" y="32" width="9" height="4.4" rx="1"/></g>')),
  slides: S('slides', office('pp', 'ppd', '<path d="M10.5 32V19.5h5.2a3.8 3.8 0 0 1 0 7.6h-5.2" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>', '<circle cx="33" cy="22" r="7.5" fill="#fff" opacity=".92"/><path d="M33 22V14.5a7.5 7.5 0 0 1 7.5 7.5z" fill="#ffb199"/><rect x="22" y="33" width="17" height="2.6" rx="1.3" fill="#fff" opacity=".9"/>')),
  mail: S('mail', '<rect x="15" y="6" width="28" height="34" rx="4" fill="url(#wg-ol)"/><path d="M15 12l14 11 14-11" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 36a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V14L29 25 15 14z" fill="#0a58b8" opacity=".35"/><rect x="4" y="14" width="24" height="24" rx="4" fill="url(#wg-old)"/><ellipse cx="16" cy="26" rx="5.6" ry="6.6" fill="none" stroke="#fff" stroke-width="3"/>'),
  browser: S('browser', chrome),
  photos: S('photos', '<g clip-path="url(#wc-card)"><rect x="5" y="7" width="38" height="34" fill="url(#wg-sky)"/><circle cx="14.5" cy="16.5" r="5" fill="url(#wg-sun)"/><path d="M5 38l13-15 9 10 6-6 10 11v3H5z" fill="url(#wg-mtn1)"/><path d="M20 41l11-12 12 12z" fill="url(#wg-mtn2)"/></g><rect x="5" y="7" width="38" height="34" rx="5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>'),
  viewer: S('viewer', '<rect x="4" y="8" width="40" height="32" rx="3.5" fill="#f5f7fa" stroke="#9aa8ba" stroke-width="1.6"/><g clip-path="url(#wc-card)"><g transform="translate(2.5 3.5) scale(.9)"><rect x="5" y="7" width="38" height="34" fill="url(#wg-sky)"/><circle cx="34" cy="16" r="4.4" fill="url(#wg-sun)"/><path d="M5 41V30l10-9 11 11 7-6 10 8v7z" fill="url(#wg-hill)"/></g></g>'),
  pdf: S('pdf', '<path d="M9 4h19l11 11v27a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="url(#wg-pg)" stroke="#aebbcc" stroke-width="1.2"/><path d="M28 4v9a2 2 0 0 0 2 2h9z" fill="#d3dce8" stroke="#aebbcc" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 22h32a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3z" fill="url(#wg-pdf)"/><text x="19" y="33.3" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="10.5" fill="#fff">PDF</text>'),
  music: S('music', '<circle cx="24" cy="24" r="21" fill="url(#wg-note)"/><circle cx="24" cy="24" r="21" fill="url(#wg-rainb)" opacity=".35"/><path d="M19 32.5V15.6l14-3.2V29" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="16" cy="33" rx="4.2" ry="3.4" fill="#fff"/><ellipse cx="30" cy="29.6" rx="4.2" ry="3.4" fill="#fff"/>'),
  setup: S('setup', '<circle cx="24" cy="24" r="21" fill="url(#wg-disc)" stroke="#8d99a8" stroke-width="1.2"/><circle cx="24" cy="24" r="13.5" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M24 24L44 18a21 21 0 0 0-14-14z" fill="#4aa8ff" opacity=".45"/><path d="M24 24L8 37a21 21 0 0 0 9 7z" fill="#ffb35c" opacity=".4"/><circle cx="24" cy="24" r="5.8" fill="#eef2f7" stroke="#8d99a8"/><circle cx="24" cy="24" r="2.4" fill="#5b6673"/><path d="M13 12a16 16 0 0 1 9-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>'),
  devmgr: S('devmgr', '<rect x="3" y="6" width="32" height="22" rx="3" fill="url(#wg-mon)"/><rect x="5.5" y="8.5" width="27" height="17" rx="1.5" fill="url(#wg-scr)"/><path d="M13 32h12l1.5 4h-15z" fill="#6c7886"/><rect x="9" y="35.5" width="20" height="3" rx="1.5" fill="#8a96a4"/><rect x="27" y="23" width="17" height="17" rx="2.5" fill="#2c7a4b"/><rect x="31" y="27" width="9" height="9" rx="1.5" fill="#1b4d2f" stroke="#7fe0a4" stroke-width="1"/><g stroke="#cfd6de" stroke-width="1.8" stroke-linecap="round"><path d="M30 23v-2.5M34 23v-2.5M38 23v-2.5M30 40v2.5M34 40v2.5M38 40v2.5M27 29h-2.5M27 33h-2.5M44 29h2.5M44 33h2.5"/></g>'),
  taskmgr: S('taskmgr', '<rect x="3" y="6" width="42" height="30" rx="3.5" fill="url(#wg-mon)"/><rect x="6" y="9" width="36" height="24" rx="1.8" fill="url(#wg-tmg)"/><g stroke="#2f4a4f" stroke-width=".8"><path d="M6 15h36M6 21h36M6 27h36M14 9v24M22 9v24M30 9v24M38 9v24"/></g><path d="M6 29l6-4 5 3 6-9 5 5 6-8 8 6V33H6z" fill="#2fd07a" opacity=".25"/><path d="M6 29l6-4 5 3 6-9 5 5 6-8 6 4" fill="none" stroke="#3be28a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M17 36l-2 6h18l-2-6z" fill="#5d6977"/><rect x="12" y="41" width="24" height="3" rx="1.5" fill="#8a96a4"/>'),
  store: S('store', '<path d="M15.5 16v-3.5a8.5 8.5 0 0 1 17 0V16" fill="none" stroke="#2b6fe8" stroke-width="3.2" stroke-linecap="round"/><path d="M6 16h36l-2 25a3.5 3.5 0 0 1-3.5 3.2h-25A3.5 3.5 0 0 1 8 41z" fill="url(#wg-bag)" stroke="#9aa9bb" stroke-width="1.2" stroke-linejoin="round"/><rect x="15" y="21" width="8.2" height="8.2" fill="#f25022"/><rect x="24.8" y="21" width="8.2" height="8.2" fill="#7fba00"/><rect x="15" y="30.8" width="8.2" height="8.2" fill="#00a4ef"/><rect x="24.8" y="30.8" width="8.2" height="8.2" fill="#ffb900"/>'),
  bulut: S('bulut', cloud(7, 4, 1.05, 'cloud1') + cloud(-1, 12, 1.05, 'cloud2') + '<path d="M9 24c3-2 7-2 10 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6" transform="translate(0 4)"/>'),
  takvim: S('takvim', '<rect x="5" y="7" width="38" height="36" rx="5" fill="#fff" stroke="#aebbcc" stroke-width="1.2"/><path d="M5 12a5 5 0 0 1 5-5h28a5 5 0 0 1 5 5v7H5z" fill="url(#wg-cal)"/><g fill="#0d4fb3"><rect x="13" y="3.5" width="3.4" height="8" rx="1.7"/><rect x="31.6" y="3.5" width="3.4" height="8" rx="1.7"/></g><g fill="#9fb0c4"><circle cx="13" cy="26" r="2"/><circle cx="21" cy="26" r="2"/><circle cx="29" cy="26" r="2"/><circle cx="37" cy="26" r="2"/><circle cx="13" cy="33" r="2"/><circle cx="21" cy="33" r="2"/><circle cx="37" cy="33" r="2"/><circle cx="13" cy="39" r="2"/><circle cx="21" cy="39" r="2"/></g><circle cx="29" cy="33" r="4.3" fill="#1b73e8"/><circle cx="29" cy="39.5" r="2" fill="#9fb0c4"/>'),
  hava: S('hava', '<circle cx="17" cy="17" r="9" fill="url(#wg-sun2)"/><g stroke="#ffb02e" stroke-width="2.4" stroke-linecap="round"><path d="M17 3v3M5 17H2M17 31v-3M3.8 7l2.2 2.2M30 7l-2.2 2.2M6 27l2.2-2.2"/></g><path d="M16 41a8 8 0 0 1-.4-16 11.5 11.5 0 0 1 22-3.2A8.8 8.8 0 0 1 38.5 41z" fill="url(#wg-wcl)" stroke="#9db8d4" stroke-width="1.2" stroke-linejoin="round"/>'),
  osk: S('osk', '<rect x="2.5" y="11" width="43" height="27" rx="4" fill="url(#wg-calc)"/><g fill="url(#wg-kb)"><rect x="6" y="15" width="5" height="5" rx="1.2"/><rect x="12.5" y="15" width="5" height="5" rx="1.2"/><rect x="19" y="15" width="5" height="5" rx="1.2"/><rect x="25.5" y="15" width="5" height="5" rx="1.2"/><rect x="32" y="15" width="5" height="5" rx="1.2"/><rect x="38.5" y="15" width="3.5" height="5" rx="1.2"/><rect x="6" y="21.5" width="5" height="5" rx="1.2"/><rect x="12.5" y="21.5" width="5" height="5" rx="1.2"/><rect x="19" y="21.5" width="5" height="5" rx="1.2"/><rect x="25.5" y="21.5" width="5" height="5" rx="1.2"/><rect x="32" y="21.5" width="10" height="5" rx="1.2"/><rect x="6" y="28" width="8" height="5" rx="1.2"/><rect x="15.5" y="28" width="17" height="5" rx="1.2"/><rect x="34" y="28" width="8" height="5" rx="1.2"/></g>'),
  magnifier: S('magnifier', '<path d="M30 30l12 12" stroke="#3b4652" stroke-width="5.5" stroke-linecap="round"/><circle cx="20" cy="20" r="14.5" fill="url(#wg-glass)" stroke="#5b6b7c" stroke-width="3.6"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/><path d="M11 18a9.5 9.5 0 0 1 8-7" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/><path d="M26 18h-12M20 12v12" stroke="#2f7cf0" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>'),
  snip: S('snip', '<rect x="4.5" y="6.5" width="30" height="24" rx="2.5" fill="#dcecff" stroke="#1d73e8" stroke-width="2.2" stroke-dasharray="5 3.4"/><g stroke-linecap="round"><path d="M14 16l22 22" stroke="#7e8a99" stroke-width="3"/><path d="M36 14L14 36" stroke="#a7b2c0" stroke-width="3"/></g><circle cx="12.5" cy="38" r="4.2" fill="#fff" stroke="#e5484d" stroke-width="2.6"/><circle cx="12.5" cy="14" r="0" fill="#fff"/><circle cx="37.5" cy="38" r="4.2" fill="#fff" stroke="#e5484d" stroke-width="2.6"/>'),
  notlar: S('notlar', '<g transform="rotate(-6 24 24)"><rect x="12" y="6" width="28" height="28" rx="3" fill="#fbd5ea"/></g><path d="M7 8a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v22l-9 12H10a3 3 0 0 1-3-3z" fill="url(#wg-yelnote)"/><path d="M30 42l9-12h-6a3 3 0 0 0-3 3z" fill="#e7a817"/><path d="M13 15h20M13 22h20M13 29h11" stroke="#8c6a0e" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'),
  kayit: S('kayit', '<circle cx="24" cy="24" r="21" fill="url(#wg-rec)"/><rect x="19" y="9.5" width="10" height="18" rx="5" fill="#fff"/><path d="M14.5 24a9.5 9.5 0 0 0 19 0M24 33.5V39M18 39h12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M21.5 14h5M21.5 18h5" stroke="#9db1ff" stroke-width="1.6" stroke-linecap="round"/>'),
  saat: S('saat', '<circle cx="24" cy="24" r="21" fill="url(#wg-clk)"/><circle cx="24" cy="24" r="16.2" fill="#fff"/><g stroke="#9db4d0" stroke-width="2" stroke-linecap="round"><path d="M24 11.5v2.2M24 34.3v2.2M11.5 24h2.2M34.3 24h2.2"/></g><path d="M24 24V15M24 24l6.2 4.2" stroke="#0a4fb0" stroke-width="2.8" stroke-linecap="round"/><path d="M24 24l-5.5-3" stroke="#e5484d" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="24" r="2" fill="#0a4fb0"/>'),
  guvenlik: S('guvenlik', '<path d="M24 3.5l17 6.3v12.4c0 10.3-7.2 17.6-17 21.3C14.2 39.8 7 32.5 7 22.2V9.8z" fill="url(#wg-shld)"/><path d="M24 3.5v40c9.8-3.7 17-11 17-21.3V9.8z" fill="url(#wg-shld2)" opacity=".45"/><path d="M15.5 24l6 6 11.5-12.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
  denetim: S('denetim', '<rect x="4" y="6" width="40" height="36" rx="4.5" fill="#fff" stroke="#9fb0c6" stroke-width="1.4"/><path d="M4 10.5A4.5 4.5 0 0 1 8.5 6h31a4.5 4.5 0 0 1 4.5 4.5V15H4z" fill="url(#wg-bluebar)"/><g stroke="#c9d3e0" stroke-width="3.4" stroke-linecap="round"><path d="M11 22h26M11 29h26M11 36h26"/></g><g stroke-width="3.4" stroke-linecap="round"><path d="M11 22h10" stroke="#2f7cf0"/><path d="M11 29h17" stroke="#f08a24"/><path d="M11 36h7" stroke="#2fb36a"/></g><circle cx="22" cy="22" r="3.4" fill="#fff" stroke="#2f7cf0" stroke-width="2"/><circle cx="29" cy="29" r="3.4" fill="#fff" stroke="#f08a24" stroke-width="2"/><circle cx="19" cy="36" r="3.4" fill="#fff" stroke="#2fb36a" stroke-width="2"/>'),
  hedef: S('hedef', '<circle cx="22" cy="26" r="19" fill="#e5383b"/><circle cx="22" cy="26" r="14" fill="#fff"/><circle cx="22" cy="26" r="9.5" fill="#e5383b"/><circle cx="22" cy="26" r="5" fill="#fff"/><circle cx="22" cy="26" r="2.2" fill="#e5383b"/><path d="M22 26L40 8" stroke="#3b4652" stroke-width="2.6" stroke-linecap="round"/><path d="M37 5l6.5-.5-.5 6.5-3-1.5zM41 11l-5-5" fill="#ffb02e" stroke="#ffb02e" stroke-width="1.4" stroke-linejoin="round"/>'),
  mayin: S('mayin', '<g stroke="#1b2128" stroke-width="3.6" stroke-linecap="round"><path d="M24 12v-2M24 40v-2M10 26h-2M40 26h-2M14 16l-1.6-1.6M35.6 37.6L34 36M34 16l1.6-1.6M12.4 37.6L14 36"/></g><circle cx="24" cy="26" r="12.5" fill="url(#wg-mine)"/><circle cx="19.5" cy="21.5" r="3.2" fill="#fff" opacity=".8"/><path d="M33 12l4-5" stroke="#8b6a3d" stroke-width="2.4" stroke-linecap="round"/><path d="M38 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#ffb02e"/><circle cx="24" cy="26" r="12.5" fill="none" stroke="#000" stroke-opacity=".25"/>'),
  kartlar: S('kartlar', '<g transform="rotate(-12 17 26)"><rect x="5" y="7" width="22" height="31" rx="3.2" fill="#fff" stroke="#9fb0c6" stroke-width="1.2"/><path d="M16 29c-6-4.5-7.5-8.6-4.8-11 2-1.6 4 0 4.8 1.8.8-1.8 2.8-3.4 4.8-1.8 2.7 2.4 1.2 6.5-4.8 11z" fill="#e5383b"/></g><g transform="rotate(10 31 26)"><rect x="20" y="9" width="22" height="31" rx="3.2" fill="#fff" stroke="#9fb0c6" stroke-width="1.2"/><path d="M31 15c-6.4 5.6-8.6 9-8.6 12 0 2.6 2 4 4.3 4 1.3 0 2.4-.6 3-1.6-.2 2-1 3.6-2 4.6h6.6c-1-1-1.8-2.6-2-4.6.6 1 1.7 1.6 3 1.6 2.3 0 4.3-1.4 4.3-4 0-3-2.2-6.4-8.6-12z" fill="#1d2430"/></g>'),
};

// ---- Sistem ve dosya simgeleri ----
const arrowOverlay = '<rect x="1.5" y="1.5" width="19" height="19" rx="4" fill="#fff" stroke="#9aa8ba" stroke-width="1.2"/><path d="M6.5 15.5l8-8M8.5 7.4h6.1v6.1" fill="none" stroke="#1a6fe0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
const person = '<circle cx="24" cy="25" r="4.2" fill="#fff"/><path d="M15.5 37a8.5 8.5 0 0 1 17 0z" fill="#fff"/>';
const SYS = {
  pc: S('pc', '<rect x="3" y="6" width="42" height="29" rx="3.5" fill="url(#wg-mon)"/><rect x="5.8" y="8.8" width="36.4" height="23.4" rx="1.6" fill="url(#wg-scr)"/><path d="M5.8 24c8-6 14 3 22-1s10-4 14.4-6v15.2H5.8z" fill="#fff" opacity=".22"/><path d="M5.8 28c9-4 14 2 22-1.5 5-2 9-2.5 14.4-1.5v7.2H5.8z" fill="#0a3f9c" opacity=".35"/><path d="M19 35h10l1.5 5h-13z" fill="#6c7886"/><rect x="12" y="39.5" width="24" height="3.4" rx="1.7" fill="#9aa6b4"/>'),
  'recycle': S('recycle', binShape + recycleMark),
  'recycle-full': S('recycle-full', '<path d="M14 14l-4-6 7 2 4-5 3 6 6-4 1 6 6-1-4 7z" fill="#fff" stroke="#9fb0c6" stroke-width="1.1" stroke-linejoin="round"/><path d="M19 10l8 4M12 11l9 3" stroke="#c9d3e0" stroke-width="1.2"/><path d="M26 7l3 4-5 .8z" fill="#ffe27a"/>' + binShape + recycleMark),
  folder: S('folder', folder()),
  'folder-user': S('folder-user', folder('<circle cx="24" cy="26" r="5" fill="#fff" stroke="#6f93c4" stroke-width="1.4"/><path d="M14 38.5a10 7.5 0 0 1 20 0z" fill="#fff" stroke="#6f93c4" stroke-width="1.4"/><circle cx="24" cy="26" r="5" fill="#8fb4e6" opacity=".5"/><path d="M14 38.5a10 7.5 0 0 1 20 0z" fill="#5a8fd8" opacity=".35"/>')),
  'folder-desktop': S('folder-desktop', folder('<rect x="12" y="21" width="24" height="15" rx="2" fill="url(#wg-scr)" stroke="#fff" stroke-width="1.4"/><path d="M12 31c6-4 9 2 15-1l9-3v6a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#0a3f9c" opacity=".35"/>')),
  'folder-docs': S('folder-docs', folderBack + '<rect x="12" y="7" width="24" height="24" rx="1.5" fill="#fff" stroke="#b6c3d4"/><path d="M16 11h16M16 15h16" stroke="#9fb0c4" stroke-width="1.6" stroke-linecap="round"/>' + folderFront),
  'folder-down': S('folder-down', folder('<circle cx="24" cy="28" r="8.6" fill="url(#wg-green)" stroke="#fff" stroke-width="1.4"/><path d="M24 23v9M19.6 28.4l4.4 4.4 4.4-4.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')),
  'folder-pics': S('folder-pics', folder('<rect x="11" y="21" width="26" height="16" rx="2" fill="url(#wg-sky)" stroke="#fff" stroke-width="1.4"/><circle cx="18" cy="26" r="2.4" fill="url(#wg-sun)"/><path d="M11 35l8-7 6 5 5-4 7 6v2a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2z" fill="url(#wg-mtn1)"/>')),
  'folder-music': S('folder-music', folder('<circle cx="24" cy="29" r="8.6" fill="url(#wg-note)" stroke="#fff" stroke-width="1.4"/><path d="M22 34v-8l5-1.2v6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="20.6" cy="34.2" r="1.8" fill="#fff"/><circle cx="25.6" cy="32.6" r="1.8" fill="#fff"/>')),
  'folder-video': S('folder-video', folder('<rect x="11" y="21" width="26" height="16" rx="2.4" fill="url(#wg-purp)" stroke="#fff" stroke-width="1.4"/><path d="M21 25v8l7-4z" fill="#fff"/>')),
  'folder-zip': S('folder-zip', folder('<rect x="20.5" y="15" width="7" height="25" fill="#f2f4f7" stroke="#b6c3d4" stroke-width=".8"/><path d="M20.5 18h7M20.5 22h7M20.5 26h7M20.5 30h7" stroke="#8795a8" stroke-width="1.4" stroke-dasharray="2 2"/><rect x="21.8" y="32" width="4.4" height="6" rx="1" fill="#8795a8"/>')),
  drive: S('drive', '<path d="M7 16h34l3 14v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-9z" fill="url(#wg-gray)"/><path d="M4 30h40" stroke="#4a5562" stroke-width="1.4"/><path d="M10 16l2-6h24l2 6" fill="#c9d1db" stroke="#8795a8" stroke-width="1"/><rect x="9" y="34" width="14" height="2.8" rx="1.4" fill="#2a323b"/><circle cx="37" cy="35.4" r="2" fill="#3be28a"/>'),
  usb: S('usb', '<rect x="12" y="4" width="24" height="12" rx="2" fill="#b8c2ce" stroke="#7d8996" stroke-width="1.2"/><rect x="17" y="7" width="3.6" height="5" rx=".8" fill="#4a5562"/><rect x="27.4" y="7" width="3.6" height="5" rx=".8" fill="#4a5562"/><rect x="9" y="16" width="30" height="28" rx="5" fill="url(#wg-blue-s)"/><circle cx="24" cy="30" r="5" fill="#fff" opacity=".9"/><circle cx="24" cy="30" r="2.2" fill="#0b66d6"/>'),
  phone: S('phone', '<rect x="12" y="3" width="24" height="42" rx="5" fill="url(#wg-mon)"/><rect x="14.5" y="8" width="19" height="31" rx="1.5" fill="url(#wg-scr)"/><circle cx="24" cy="5.6" r="1" fill="#6c7886"/><rect x="21" y="41" width="6" height="1.6" rx=".8" fill="#6c7886"/><path d="M14.5 32c5-4 9 2 19-2v9.5h-19z" fill="#0a3f9c" opacity=".35"/>'),
  'user': S('user', '<circle cx="24" cy="24" r="21" fill="url(#wg-shld2)"/><circle cx="24" cy="19" r="7" fill="#fff"/><path d="M9.5 39.5a15 12 0 0 1 29 0A21 21 0 0 1 24 45a21 21 0 0 1-14.5-5.5z" fill="#fff"/>'),
  arrow: S('arrow', arrowOverlay, '0 0 22 22', 'wi-arr'),
  // Dosya türleri
  'file': S('file', page()),
  'file-txt': S('file-txt', page(lines(22, 4))),
  'file-img': S('file-img', page('<g clip-path="url(#wc-pg)"><rect x="9" y="19" width="30" height="20" fill="url(#wg-sky)"/><circle cx="17" cy="25" r="2.8" fill="url(#wg-sun)"/><path d="M9 38l9-9 6 6 5-5 10 9v4H9z" fill="url(#wg-mtn1)"/></g>')),
  'file-doc': S('file-doc', page(lines(30, 3) + badge('W', 'word', 3, 18, 22))),
  'file-xls': S('file-xls', page(lines(30, 3) + badge('X', 'xl', 3, 18, 22))),
  'file-ppt': S('file-ppt', page(lines(30, 3) + badge('P', 'pp', 3, 18, 22))),
  'file-pdf': S('file-pdf', page('<path d="M3 24h32a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3z" fill="url(#wg-pdf)"/><text x="19" y="34" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="9.5" fill="#fff">PDF</text>')),
  'file-music': S('file-music', page('<circle cx="24" cy="29" r="9" fill="url(#wg-note)"/><path d="M22 34v-8.5l6-1.4v6.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="20.4" cy="34.4" r="1.9" fill="#fff"/><circle cx="26.4" cy="32.6" r="1.9" fill="#fff"/>')),
  'file-video': S('file-video', page('<rect x="13" y="21" width="22" height="16" rx="2.4" fill="url(#wg-purp)"/><path d="M21 25.4v7.2l6.4-3.6z" fill="#fff"/>')),
  'file-zip': S('file-zip', page('<rect x="20" y="4" width="8" height="40" fill="#f6dc79" opacity=".0"/><path d="M20 4h8v2h-4v4h4v4h-4v4h4v4h-4v4h4" fill="none" stroke="#8795a8" stroke-width="2.2"/><rect x="20" y="30" width="8" height="9" rx="1.8" fill="#f2b92e" stroke="#b9861a" stroke-width="1.2"/><rect x="22.4" y="33" width="3.2" height="3.4" rx=".8" fill="#fff6d6"/>')),
  'file-exe': S('file-exe', '<rect x="4" y="7" width="40" height="34" rx="4" fill="#fff" stroke="#9fb0c6" stroke-width="1.3"/><path d="M4 11a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v3H4z" fill="url(#wg-bluebar)"/><circle cx="9" cy="10.5" r="1.1" fill="#fff"/><circle cx="13" cy="10.5" r="1.1" fill="#fff"/><g fill="#2f7cf0"><rect x="14" y="20" width="9.4" height="8.4" rx=".8"/><rect x="24.6" y="20" width="9.4" height="8.4" rx=".8"/><rect x="14" y="29.6" width="9.4" height="8" rx=".8"/><rect x="24.6" y="29.6" width="9.4" height="8" rx=".8"/></g>'),
  'file-html': S('file-html', page('<circle cx="24" cy="30" r="9" fill="#e8f2ff" stroke="#2f7cf0" stroke-width="1.8"/><path d="M15 30h18M24 21c-4 4-4 14 0 18M24 21c4 4 4 14 0 18" fill="none" stroke="#2f7cf0" stroke-width="1.5"/>')),
  info: S('info', '<circle cx="24" cy="24" r="20" fill="url(#wg-shld)"/><circle cx="24" cy="14.5" r="2.6" fill="#fff"/><path d="M24 22v13" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'),
  warn: S('warn', '<path d="M24 4.5c1.2 0 2.2.6 2.8 1.6l17 30.6c1 1.8-.3 4-2.4 4H6.6c-2.1 0-3.4-2.2-2.4-4l17-30.6c.6-1 1.6-1.6 2.8-1.6z" fill="#ffc22b" stroke="#c98a0a" stroke-width="1.4" stroke-linejoin="round"/><path d="M24 17v11" stroke="#3a2a00" stroke-width="3.6" stroke-linecap="round"/><circle cx="24" cy="34" r="2.2" fill="#3a2a00"/>'),
  ok: S('ok', '<circle cx="24" cy="24" r="20" fill="url(#wg-green)"/><path d="M14 24.5l7 7L34.5 17" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  err: S('err', '<circle cx="24" cy="24" r="20" fill="url(#wg-red)"/><path d="M16.5 16.5l15 15M31.5 16.5l-15 15" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/>'),
  clipboard: S('clipboard', '<rect x="8" y="8" width="32" height="36" rx="4" fill="#d9a66b" stroke="#a9763d" stroke-width="1.2"/><rect x="14" y="3" width="20" height="9" rx="3" fill="#8a96a4" stroke="#5d6977" stroke-width="1.2"/><rect x="12" y="14" width="24" height="26" rx="2" fill="#fff"/><path d="M16 21h16M16 27h16M16 33h9" stroke="#9fb0c4" stroke-width="2" stroke-linecap="round"/>'),
  printer: S('printer', '<rect x="13" y="4" width="22" height="14" rx="1.5" fill="#fff" stroke="#9fb0c6" stroke-width="1.3"/><rect x="4" y="16" width="40" height="19" rx="4" fill="url(#wg-gray)"/><rect x="11" y="28" width="26" height="15" rx="1.5" fill="#fff" stroke="#9fb0c6" stroke-width="1.3"/><path d="M15 33h18M15 38h12" stroke="#9fb0c4" stroke-width="1.6" stroke-linecap="round"/><circle cx="38" cy="21.5" r="1.8" fill="#3be28a"/>'),
  hourglass: S('hourglass', '<path d="M12 5h24M12 43h24" stroke="#6b7684" stroke-width="3.4" stroke-linecap="round"/><path d="M14 5c0 10 6 13 10 19-4 6-10 9-10 19h20c0-10-6-13-10-19 4-6 10-9 10-19z" fill="#e8f4ff" stroke="#6b7684" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 8c.6 5 4 8 7 12 3-4 6.4-7 7-12z" fill="#f2b92e"/><path d="M24 26c2 3 6 6 7 14H17c1-8 5-11 7-14z" fill="#f2b92e"/>'),
  camera: S('camera', '<path d="M5 15a4 4 0 0 1 4-4h6l3-4h12l3 4h6a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="url(#wg-gray)"/><circle cx="24" cy="26" r="9.5" fill="#1b2128" stroke="#cfd6de" stroke-width="2"/><circle cx="24" cy="26" r="5.6" fill="url(#wg-scr)"/><circle cx="37" cy="17" r="1.8" fill="#ffb02e"/>'),
  power: S('power', '<circle cx="24" cy="24" r="20" fill="url(#wg-shld2)"/><path d="M24 11v13M15.5 16.5a12 12 0 1 0 17 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'),
  mic: S('mic', '<rect x="16" y="5" width="16" height="25" rx="8" fill="url(#wg-gray)"/><path d="M10 22a14 14 0 0 0 28 0M24 36v8M17 44h14" fill="none" stroke="#5d6977" stroke-width="3.4" stroke-linecap="round"/>'),
  plug: S('plug', '<path d="M17 4v10M31 4v10" stroke="#5d6977" stroke-width="4" stroke-linecap="round"/><path d="M10 14h28v8a14 14 0 0 1-28 0z" fill="url(#wg-gray)"/><path d="M24 36v9" stroke="#5d6977" stroke-width="4" stroke-linecap="round"/>'),
  globe: S('globe', '<circle cx="24" cy="24" r="20" fill="url(#wg-sky)" stroke="#2f7cf0" stroke-width="2"/><path d="M4 24h40M24 4c-9 9-9 31 0 40M24 4c9 9 9 31 0 40" fill="none" stroke="#2f7cf0" stroke-width="2"/>'),
};

// ---- Tek renkli (currentColor) arayüz simgeleri: 24x24, ince çizgili, Fluent tarzı ----
const M = (name, body, vb = '0 0 24 24') => `<svg class="wi wi-m" data-wi-m="${name}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
const MONO = {
  eye: M('eye', '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  chevup: M('chevup', '<path d="M6 15l6-6 6 6"/>'),
  chevdown: M('chevdown', '<path d="M6 9l6 6 6-6"/>'),
  chevright: M('chevright', '<path d="M9 6l6 6-6 6"/>'),
  chevleft: M('chevleft', '<path d="M15 6l-6 6 6 6"/>'),
  search: M('search', '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>'),
  taskview: M('taskview', '<rect x="4" y="6" width="12" height="9" rx="2"/><path d="M8 18.5h9a3 3 0 0 0 3-3V9.5"/>'),
  wifi: M('wifi', '<path d="M2.8 9.2a13 13 0 0 1 18.4 0"/><path d="M5.8 12.4a8.7 8.7 0 0 1 12.4 0"/><path d="M8.9 15.6a4.3 4.3 0 0 1 6.2 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>'),
  wifioff: M('wifioff', '<path d="M2.8 9.2a13 13 0 0 1 18.4 0" opacity=".45"/><path d="M5.8 12.4a8.7 8.7 0 0 1 12.4 0" opacity=".45"/><path d="M8.9 15.6a4.3 4.3 0 0 1 6.2 0" opacity=".45"/><circle cx="12" cy="19" r="1" fill="currentColor"/><path d="M4 4l16 16"/>'),
  nonet: M('nonet', '<path d="M2.8 9.2a13 13 0 0 1 18.4 0"/><path d="M5.8 12.4a8.7 8.7 0 0 1 12.4 0"/><path d="M8.9 15.6a4.3 4.3 0 0 1 6.2 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/><circle cx="18.5" cy="17.5" r="4.2" fill="#fff" stroke="#c42b1c"/><path d="M18.5 15.6v2.3M18.5 19.4v.1" stroke="#c42b1c"/>'),
  airplane: M('airplane', '<path d="M21 14.5l-7.5-4.2V5.2a1.5 1.5 0 0 0-3 0v5.1L3 14.5v1.7l7.5-2v4.2l-2 1.4v1.4l3.5-.8 3.5.8v-1.4l-2-1.4v-4.2l7.5 2z" fill="currentColor" stroke="none"/>'),
  vol0: M('vol0', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  vol1: M('vol1', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9.5a3.8 3.8 0 0 1 0 5"/>'),
  vol2: M('vol2', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6"/><path d="M18.3 6.4a8.3 8.3 0 0 1 0 11.2"/>'),
  battery: M('battery', '<rect x="2.5" y="8" width="16" height="8.5" rx="2"/><path d="M21 11v2.5"/><rect x="4.5" y="10" width="11" height="4.5" rx=".8" fill="currentColor" stroke="none"/>'),
  power: M('power', '<path d="M12 3.5v8"/><path d="M7 6.8a7.5 7.5 0 1 0 10 0"/>'),
  sleep: M('sleep', '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>'),
  restart: M('restart', '<path d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5"/><path d="M19 3.5v4h-4"/>'),
  lock: M('lock', '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  user: M('user', '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
  gear: M('gear', '<circle cx="12" cy="12" r="3"/><path d="M19.4 14.8a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>'),
  clock: M('clock', '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/>'),
  eject: M('eject', '<path d="M12 5l7 9H5z"/><path d="M5 18.5h14"/>'),
  taskmgr: M('taskmgr', '<rect x="3.5" y="4.5" width="17" height="13" rx="2"/><path d="M6 13.5l3-3 2.5 2 3-4 3 3.5"/><path d="M9 20.5h6"/>'),
  bluetooth: M('bluetooth', '<path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9"/>'),
  brightness: M('brightness', '<circle cx="12" cy="12" r="3.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>'),
  mic: M('mic', '<rect x="9" y="3.5" width="6" height="10.5" rx="3"/><path d="M5.8 11.5a6.2 6.2 0 0 0 12.4 0M12 17.7v3M9 20.7h6"/>'),
  speak: M('speak', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6"/>'),
  folder: M('folder', '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'),
  filetext: M('filetext', '<path d="M7 3.5h7.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14.5 3.5V8H19M9 12.5h6M9 16h6"/>'),
  info: M('info', '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>'),
  check: M('check', '<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  usb: M('usb', '<path d="M12 21V6M12 6l-2.2 2.6M12 6l2.2 2.6M12 15l-4-3v-2M12 13l4-3v-1.5"/><circle cx="7.6" cy="9" r="1.2"/><rect x="14.8" y="6.6" width="2.4" height="2.4"/><circle cx="12" cy="21" r="1.4" fill="currentColor"/>'),
  copy: M('copy', '<rect x="8" y="8" width="11.5" height="11.5" rx="2"/><path d="M16 8V6.5A2 2 0 0 0 14 4.5H6.5a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2H8"/>'),
  view: M('view', '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>'),
  sort: M('sort', '<path d="M7 4.5v15M7 19.5l-3-3M7 19.5l3-3M17 19.5v-15M17 4.5l-3 3M17 4.5l3 3"/>'),
  refresh: M('refresh', '<path d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5"/><path d="M19 3.5v4h-4"/>'),
  plus: M('plus', '<path d="M12 5v14M5 12h14"/>'),
  personalize: M('personalize', '<path d="M4 20l4-1 9.5-9.5-3-3L5 16z"/><path d="M13.5 6.5l1.2-1.2a1.8 1.8 0 0 1 2.5 0l.5.5a1.8 1.8 0 0 1 0 2.5L16.5 9.5"/>'),
  display: M('display', '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>'),
  kbd: M('kbd', '<rect x="3" y="6.5" width="18" height="11" rx="2"/><path d="M7 10.5h.1M10 10.5h.1M13 10.5h.1M16 10.5h.1M7.5 14h9"/>'),
  close: M('close', '<path d="M6 6l12 12M18 6L6 18"/>'),
  grid: M('grid', '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>'),
  moon: M('moon', '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>'),
  battchg: M('battchg', '<rect x="2.5" y="8" width="16" height="8.5" rx="2"/><path d="M21 11v2.5"/><path d="M11.2 9.5l-2 3h3l-1.4 2.6" stroke-width="1.3"/>'),
};

// Pencere düğmeleri (Windows 11: ince çizgi, 10 piksellik)
const WB = (body) => `<svg class="wi wi-wb" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
export const WIN_BTN = {
  min: WB('<path d="M0.5 5h9"/>'),
  max: WB('<rect x="0.5" y="0.5" width="9" height="9" rx="1.6"/>'),
  restore: WB('<path d="M2.6 2.6V1.9A1.4 1.4 0 0 1 4 .5h4.1A1.4 1.4 0 0 1 9.5 1.9V6a1.4 1.4 0 0 1-1.4 1.4h-.7"/><rect x="0.5" y="2.6" width="6.9" height="6.9" rx="1.4"/>'),
  close: WB('<path d="M0.8 0.8l8.4 8.4M9.2 0.8L0.8 9.2"/>'),
};

// Windows logosu (4 kare); Başlat düğmesi ve açılış ekranı için
export const WIN_LOGO = S('winlogo', '<path d="M4 4h19v19H4zM25 4h19v19H25zM4 25h19v19H4zM25 25h19v19H25z" fill="url(#wg-logo)"/>', '0 0 48 48', 'wi-logo');

// ---- Dışarıya verilenler ----
export const APP_ICONS = APP;
export const SYS_ICONS = SYS;
export { MONO };

// Eski emoji → SVG (toast, dialog, menü simgeleri). Bilinmeyen metin olduğu gibi döner.
const E2I = {
  'ℹ': SYS.info, '⚠': SYS.warn, '✅': SYS.ok, '✔': SYS.ok, '❌': SYS.err, '📋': SYS.clipboard, '🖨': SYS.printer, '✂': APP.snip, '📸': SYS.camera,
  '💾': SYS.usb, '📱': SYS.phone, '🖼': APP.photos, '⌨': APP.osk, '🖥': SYS.pc, '💻': SYS.pc, '⏳': SYS.hourglass, '🗑': SYS.recycle, '🗑️': SYS['recycle-full'],
  '🗜': SYS['folder-zip'], '⏰': APP.saat, '📅': APP.takvim, '🛡': APP.guvenlik, '🎤': SYS.mic, '🔌': SYS.plug, '🌐': APP.browser, '📁': SYS.folder,
  '📝': APP.notepad, '🧮': APP.calc, '🎨': APP.paint, '📊': APP.taskmgr, '⚙': APP.settings, '🔍': APP.magnifier, '📂': SYS.folder, '💿': APP.setup,
  '📘': APP.word, '📗': APP.sheet, '📙': APP.slides, '📕': APP.pdf, '🎵': APP.music, '☁': APP.bulut, '✉': APP.mail, '👤': SYS.user, '🔒': SYS.warn,
};
export function iconFor(x) {
  if (typeof x !== 'string') return x;
  if (/^[a-z][a-z-]*$/.test(x)) return SYS[x] ?? APP[x] ?? x; // ad ile: 'warn', 'ok', 'usb', 'snip' ...
  return E2I[x.replace(/️/g, '')] ?? E2I[x] ?? x;
}

// Dosya adına göre simge (dosya gezgini, masaüstü, açma/kaydetme pencereleri)
export function fileIconSvg(name) {
  if (/\.txt$/i.test(name)) return SYS['file-txt'];
  if (/\.(png|jpe?g|bmp|gif)$/i.test(name)) return SYS['file-img'];
  if (/\.docx?$/i.test(name)) return SYS['file-doc'];
  if (/\.xlsx?$/i.test(name)) return SYS['file-xls'];
  if (/\.pptx?$/i.test(name)) return SYS['file-ppt'];
  if (/\.pdf$/i.test(name)) return SYS['file-pdf'];
  if (/\.html?$/i.test(name)) return SYS['file-html'];
  if (/\.exe$/i.test(name)) return SYS['file-exe'];
  if (/\.(mp3|wav|m4a)$/i.test(name)) return SYS['file-music'];
  if (/\.zip$/i.test(name)) return SYS['file-zip'];
  if (/\.(mp4|avi|mov)$/i.test(name)) return SYS['file-video'];
  return SYS.file;
}

// Ekran görüntüsü çizicisi için: kimlik → <img> (simge SVG'si, degrade tanımlarıyla birlikte)
const IMG = new Map();
const svgDoc = (markup) => markup.replace('<svg ', `<svg xmlns="${SVG_NS}" width="96" height="96" `).replace('</svg>', `<defs>${DEFS}</defs></svg>`);
export function iconImage(name) {
  if (IMG.has(name)) return IMG.get(name);
  const all = { ...APP, ...SYS, winlogo: WIN_LOGO };
  const m = all[name];
  if (!m || typeof Image === 'undefined') return null;
  const im = new Image();
  im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgDoc(m));
  IMG.set(name, im);
  return im;
}
export function warmIcons() { for (const k of [...Object.keys(APP), ...Object.keys(SYS), 'winlogo']) iconImage(k); }
