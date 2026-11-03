// Paint: Windows 11'deki yeni Paint'e benzer görünüm (menü satırı, tek satır araç şeridi, durum çubuğu).
// Kalem, fırçalar, silgi, dolgu, metin, renk seçici, büyüteç, şekiller (Ana hat / Dolgu), Renk 1 / Renk 2,
// geri al, yakınlaştırma, kaydet/aç ve ekran alıntısını Ctrl+V ile yapıştırma. Seçim + Kırp, Yeniden boyutlandır
// (yüzde / piksel, en boy oranı): telefon fotoğrafı gibi büyük resimler ekrana sığacak kadar küçük çizilir,
// gerçek piksel boyutu (lw × lh) ayrıca tutulur. Bütün simgeler satır içi SVG (emoji yok). Sınıf öneki: pnt-
import { esc, pictureURL } from './util.js';
import { fmtSize } from './explorer.js';

// ---------- Simgeler ----------
const SV = (inner) => `<svg class="pnt-i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${inner}</svg>`;
const L = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const f1 = (n) => +n.toFixed(2);
const wheel = () => {
  const cols = ['#e53935', '#fb8c00', '#fdd835', '#7cb342', '#00acc1', '#1e88e5', '#8e24aa', '#d81b60'];
  const pt = (a) => `${f1(12 + 9.5 * Math.cos(a))} ${f1(12 + 9.5 * Math.sin(a))}`;
  return cols.map((c, i) => `<path d="M12 12L${pt((i * Math.PI) / 4 - Math.PI / 2)}A9.5 9.5 0 0 1 ${pt(((i + 1) * Math.PI) / 4 - Math.PI / 2)}z" fill="${c}"/>`).join('');
};
const I = {
  app: SV('<path d="M12 3C7 3 3 7.2 3 12s4 9 9 9c1.5 0 2.2-.9 2.2-2 0-.6-.3-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17c2.2 0 4-1.7 4-3.9C21 6.6 17 3 12 3z" fill="#fff" stroke="#8a8a8a" stroke-width="1.2"/><circle cx="7.6" cy="11.4" r="1.4" fill="#e53935"/><circle cx="10.4" cy="7.4" r="1.4" fill="#fdd835"/><circle cx="14.8" cy="7.4" r="1.4" fill="#43a047"/><circle cx="17.6" cy="10.6" r="1.4" fill="#1e88e5"/>'),
  save: SV(`<g ${L}><path d="M5 4h11.5L20 7.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 4v5h7V4M7.5 20v-6h9v6"/></g>`),
  undo: SV(`<g ${L}><path d="M8.5 5L4.5 9l4 4"/><path d="M4.5 9H14a5.5 5.5 0 0 1 0 11h-4"/></g>`),
  redo: SV(`<g ${L}><path d="M15.5 5l4 4-4 4"/><path d="M19.5 9H10a5.5 5.5 0 0 0 0 11h4"/></g>`),
  select: SV(`<g ${L}><rect x="3.5" y="4.5" width="13" height="11" rx="1" stroke-dasharray="2.2 2.2"/></g><path d="M12.5 11.5v9.5l2.3-2.1 1.7 3.3 1.8-.9-1.6-3.2h3.3z" fill="#1f6fd0" stroke="#fff" stroke-width=".8" stroke-linejoin="round"/>`),
  crop: SV(`<g ${L}><path d="M7 2.5V17h14.5"/><path d="M2.5 7H17v14.5"/></g>`),
  resize: SV(`<g ${L}><rect x="3.5" y="11.5" width="9" height="9" rx="1"/><path d="M10 14L20 4M14.5 4H20v5.5"/></g>`),
  rotate: SV(`<g ${L}><path d="M19.5 12a7.5 7.5 0 1 1-2.6-5.7"/><path d="M19 3.5v4h-4"/></g>`),
  pencil: SV('<path d="M4 20l1.1-4.4L16 4.7l3.3 3.3L8.4 18.9z" fill="#f6c244" stroke="#8a6d1f" stroke-width="1.2" stroke-linejoin="round"/><path d="M4 20l1.1-4.4 3.3 3.3z" fill="#f3dcc0" stroke="#8a6d1f" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 4.7l1.4-1.4a1.6 1.6 0 0 1 2.3 0l1 1a1.6 1.6 0 0 1 0 2.3L19.3 8z" fill="#e57373" stroke="#8a3a3a" stroke-width="1.2" stroke-linejoin="round"/>'),
  fill: SV('<path d="M4.5 12.5l7-7 7 7-6.5 6.5a1.5 1.5 0 0 1-2 0z" fill="#d6e6f8" stroke="#3a5f8a" stroke-width="1.3" stroke-linejoin="round"/><path d="M11.5 5.5l-2.2-2.2" fill="none" stroke="#3a5f8a" stroke-width="1.5" stroke-linecap="round"/><path d="M20 14.5c1.2 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .8-2.2 2-4z" fill="#1e88e5"/>'),
  text: SV(`<g ${L} stroke-width="2"><path d="M5.5 19.5L12 4l6.5 15.5M8 14h8"/></g>`),
  eraser: SV('<path d="M4.2 13.8L13 5a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8L12 20H7.5z" fill="#f8bbd0" stroke="#a8466b" stroke-width="1.3" stroke-linejoin="round"/><path d="M9.6 9.2l7.2 7.2" stroke="#a8466b" stroke-width="1.3"/><path d="M12 20h8.5" stroke="#a8466b" stroke-width="1.3" stroke-linecap="round"/>'),
  picker: SV(`<g ${L}><path d="M17.2 3.2a2 2 0 0 1 2.8 0l.8.8a2 2 0 0 1 0 2.8L18.5 9l-3.6-3.6z" fill="#cfd8dc"/><path d="M14.3 6.2L5.5 15v3.5H9l8.8-8.8"/></g>`),
  zoom: SV(`<g ${L}><circle cx="10.5" cy="10.5" r="6" fill="#e3f2fd"/><path d="M15 15l5.5 5.5"/><path d="M8 10.5h5M10.5 8v5"/></g>`),
  brush: SV('<path d="M12.8 13.2l7-7" stroke="#8d6e63" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M10.2 12.4c-2.7 0-4.4 1.7-4.4 3.9 0 1.3-.8 2.3-2.1 2.7 3.8 1.6 8.6-.1 8.6-4.2z" fill="#e0752f" stroke="#a24f16" stroke-width="1" stroke-linejoin="round"/>'),
  size: SV(`<g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M3.5 5.5h17" stroke-width="1"/><path d="M3.5 11h17" stroke-width="2.4"/><path d="M3.5 18h17" stroke-width="4.4"/></g>`),
  outline: SV(`<rect x="4.5" y="6.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/>`),
  fillI: SV(`<rect x="4.5" y="6.5" width="15" height="11" rx="2" fill="#9ec3f0" stroke="currentColor" stroke-width="1.2"/>`),
  wheel: SV(wheel()),
  chev: '<svg class="pnt-ch" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg class="pnt-ck-i" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cursor: SV(`<path d="M7 3.5v15l3.6-3.3 2.5 5 2.6-1.3-2.5-4.9H18z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`),
  selI: SV(`<rect x="4" y="5" width="16" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2.6 2.6"/>`),
  canvasI: SV(`<g ${L}><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M14 19.5l6.5-6.5M17.5 19.5h3v-3"/></g>`),
  minus: SV(`<path d="M5 12h14" ${L}/>`),
  plus: SV(`<path d="M12 5v14M5 12h14" ${L}/>`),
};

// ---------- Araçlar, fırçalar, boyutlar, renkler ----------
const TOOLS = [['pencil', 'Kalem'], ['fill', 'Dolgu'], ['text', 'Metin'], ['eraser', 'Silgi'], ['picker', 'Renk seçici'], ['magnifier', 'Büyüteç']];
const TOOL_ICON = { pencil: I.pencil, fill: I.fill, text: I.text, eraser: I.eraser, picker: I.picker, magnifier: I.zoom, brush: I.brush, select: I.select };
const BRUSHES = [['brush', 'Fırça'], ['cal1', 'Kaligrafi fırçası'], ['cal2', 'Kaligrafi kalemi'], ['air', 'Hava fırçası'], ['oil', 'Yağlı boya fırçası'], ['crayon', 'Boya kalemi'], ['marker', 'Keçeli kalem'], ['water', 'Sulu boya fırçası']];
const SIZES = [[2, 'İnce'], [6, 'Orta'], [14, 'Kalın'], [24, 'Çok kalın']];
export const COLORS = [
  ['#000000', 'Siyah'], ['#7f7f7f', 'Gri'], ['#880015', 'Koyu kırmızı'], ['#ed1c24', 'Kırmızı'], ['#ff7f27', 'Turuncu'], ['#fff200', 'Sarı'], ['#22b14c', 'Yeşil'], ['#00a2e8', 'Turkuaz'], ['#3f48cc', 'Mavi'], ['#a349a4', 'Mor'],
  ['#ffffff', 'Beyaz'], ['#c3c3c3', 'Açık gri'], ['#b97a57', 'Kahverengi'], ['#ffaec9', 'Pembe'], ['#ffc90e', 'Altın'], ['#efe4b0', 'Açık sarı'], ['#b5e61d', 'Açık yeşil'], ['#99d9ea', 'Açık turkuaz'], ['#7092be', 'Gri mavi'], ['#c8bfe7', 'Lavanta'],
];
const MORE = ['#000000', '#3c3c3c', '#7f7f7f', '#b0b0b0', '#dcdcdc', '#ffffff', '#5b3a29', '#8c5a3c',
  '#880015', '#c1272d', '#ed1c24', '#f15a24', '#ff7f27', '#fbb03b', '#ffc90e', '#fff200',
  '#d9e021', '#8cc63f', '#39b54a', '#22b14c', '#009245', '#006837', '#00a99d', '#00a2e8',
  '#29abe2', '#0071bc', '#3f48cc', '#2e3192', '#1b1464', '#662d91', '#a349a4', '#d4145a',
  '#ed1e79', '#ff6ec7', '#ffaec9', '#f7977a', '#fdc689', '#fff799', '#c4df9b', '#a2d39c',
  '#82ca9d', '#7accc8', '#99d9ea', '#7da7d9', '#8393ca', '#a187be', '#c8bfe7', '#f49ac2'];
export const colorName = (c) => COLORS.find(([x]) => x.toLowerCase() === String(c).toLowerCase())?.[1] || c;

// ---------- Şekiller ----------
// Köşe noktaları 0..1 kare içinde; hem tuvale hem şerit simgelerine aynı yoldan çizilir
const norm = (pts) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  return pts.map(([x, y]) => [(x - x0) / (x1 - x0), (y - y0) / (y1 - y0)]);
};
const ngon = (n) => norm(Array.from({ length: n }, (_, k) => { const a = -Math.PI / 2 + (2 * Math.PI * k) / n; return [Math.cos(a), Math.sin(a)]; }));
const star = (n, r) => norm(Array.from({ length: n * 2 }, (_, k) => { const a = -Math.PI / 2 + (Math.PI * k) / n, q = k % 2 ? r : 1; return [q * Math.cos(a), q * Math.sin(a)]; }));
const ARR_R = [[0, 0.32], [0.58, 0.32], [0.58, 0], [1, 0.5], [0.58, 1], [0.58, 0.68], [0, 0.68]];
const ARR_U = [[0.32, 1], [0.32, 0.42], [0, 0.42], [0.5, 0], [1, 0.42], [0.68, 0.42], [0.68, 1]];
const UNIT = {
  triangle: [[0.5, 0], [1, 1], [0, 1]], rtriangle: [[0, 0], [0, 1], [1, 1]], diamond: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  pentagon: ngon(5),
  arrowr: ARR_R, arrowl: ARR_R.map(([x, y]) => [1 - x, y]), arrowu: ARR_U, arrowd: ARR_U.map(([x, y]) => [x, 1 - y]),
  star4: star(4, 0.4), star5: star(5, 0.42), star6: star(6, 0.58),
  bolt: [[0.62, 0], [0.12, 0.56], [0.44, 0.56], [0.34, 1], [0.88, 0.4], [0.56, 0.4], [0.82, 0]],
};
// hexagon: düz kenarı yukarıda
UNIT.hexagon = norm(Array.from({ length: 6 }, (_, k) => { const a = (Math.PI * k) / 3; return [Math.cos(a), Math.sin(a)]; }));
const SHAPES = [['line', 'Çizgi'], ['curve', 'Eğri'], ['ellipse', 'Oval'], ['rect', 'Dikdörtgen'], ['rrect', 'Yuvarlak dikdörtgen'], ['polygon', 'Çokgen'], ['triangle', 'Üçgen'],
  ['rtriangle', 'Dik üçgen'], ['diamond', 'Baklava'], ['pentagon', 'Beşgen'], ['hexagon', 'Altıgen'], ['arrowr', 'Sağ ok'], ['arrowl', 'Sol ok'], ['arrowu', 'Yukarı ok'],
  ['arrowd', 'Aşağı ok'], ['star4', 'Dört köşeli yıldız'], ['star5', 'Beş köşeli yıldız'], ['star6', 'Altı köşeli yıldız'], ['heart', 'Kalp'], ['bolt', 'Yıldırım']];
const SHAPE_IDS = new Set(SHAPES.map((s) => s[0]));
const shapeD = (id, x, y, w, h) => {
  const m = (px, py) => `${f1(x + px * w)} ${f1(y + py * h)}`;
  if (UNIT[id]) return 'M' + UNIT[id].map(([px, py]) => m(px, py)).join('L') + 'z';
  if (id === 'rect') return `M${m(0, 0)}H${f1(x + w)}V${f1(y + h)}H${f1(x)}z`;
  if (id === 'rrect') {
    const r = f1(Math.min(w, h) * 0.22);
    return `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}V${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}H${f1(x + r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}V${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}z`;
  }
  if (id === 'ellipse') { const rx = f1(w / 2), ry = f1(h / 2); return `M${f1(x)} ${f1(y + h / 2)}A${rx} ${ry} 0 1 1 ${f1(x + w)} ${f1(y + h / 2)}A${rx} ${ry} 0 1 1 ${f1(x)} ${f1(y + h / 2)}z`; }
  if (id === 'heart') return `M${m(0.5, 1)}C${m(0.1, 0.68)} ${m(0, 0.45)} ${m(0, 0.28)}C${m(0, 0.1)} ${m(0.13, 0)} ${m(0.27, 0)}C${m(0.38, 0)} ${m(0.46, 0.06)} ${m(0.5, 0.16)}C${m(0.54, 0.06)} ${m(0.62, 0)} ${m(0.73, 0)}C${m(0.87, 0)} ${m(1, 0.1)} ${m(1, 0.28)}C${m(1, 0.45)} ${m(0.9, 0.68)} ${m(0.5, 1)}z`;
  return '';
};
const shapeIcon = (id) => {
  if (id === 'line') return SV(`<path d="M4.5 19.5L19.5 4.5" ${L}/>`);
  if (id === 'curve') return SV(`<path d="M4 18C7 3 14 21 20 6" ${L}/>`);
  if (id === 'polygon') return SV(`<path d="M4.5 17l3-10 8-3 4.5 9.5-6.500 7z" ${L}/>`);
  return SV(`<path d="${shapeD(id, 4, 4, 16, 16)}" ${L}/>`);
};

// Fırça örnek çizgisi (açılır listede)
const brushSample = (k) => {
  const d = 'M3 12Q9 3 15 12T27 12';
  const st = {
    brush: 'stroke-width="4" stroke-linecap="round"', cal1: 'stroke-width="5" stroke-linecap="butt" stroke-dasharray="1 1.4"', cal2: 'stroke-width="3" stroke-linecap="butt" stroke-dasharray="1 .8"',
    air: 'stroke-width="6" stroke-linecap="round" stroke-dasharray=".1 2.6"', oil: 'stroke-width="5" stroke-linecap="round" opacity=".75"', crayon: 'stroke-width="4" stroke-linecap="round" stroke-dasharray="2 1"',
    marker: 'stroke-width="5" stroke-linecap="square"', water: 'stroke-width="7" stroke-linecap="round" opacity=".35"',
  }[k];
  return `<svg class="pnt-bs" viewBox="0 0 30 16" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" ${st}/></svg>`;
};

const W = 640, H = 400;
const MAXW = 720, MAXH = 520; // büyük resimler ekranda bu boyuta sığdırılır
const ZOOMS = [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
const HINTS = {
  polygon: 'Çokgen: ilk kenarı sürükleyin, köşelere tıklayın, bitirmek için çift tıklayın.',
  curve: 'Eğri: çizgiyi sürükleyin, eğmek için bir kez daha sürükleyin.',
  text: 'Metin: tuvale tıklayın, yazın, Enter\'a basın.',
  select: 'Kesik çizgili bir alan çizin; sonra Kırp\'a basın.',
  picker: 'Resimdeki bir renge tıklayın.',
  magnifier: 'Tıklayınca yakınlaştırır, sağ tıklayınca uzaklaştırır.',
};
const MENUS = { file: 'Dosya', edit: 'Düzenle', view: 'Görünüm' };

export function paint({ desk, win, body, args, emit, setTitle, dialogs }) {
  body.classList.add('pt');
  body.tabIndex = 0;
  const bigBtn = (inner, attrs, title) => `<button type="button" class="pnt-b" ${attrs} title="${title}" aria-label="${title}">${inner}</button>`;
  const shapesGrid = () => `<div class="pnt-sg">${SHAPES.map(([id, n]) => `<button type="button" class="pnt-s" data-tool="${id}" title="${n}" aria-label="${n}">${shapeIcon(id)}</button>`).join('')}</div>`;
  body.innerHTML = `
    <div class="pnt-menubar">
      <span class="pnt-app" aria-hidden="true">${I.app}</span>
      ${Object.entries(MENUS).map(([id, n]) => `<button type="button" class="pnt-mb" data-m="${id}">${n}</button>`).join('')}
      <i class="pnt-vsep"></i>
      <button type="button" class="pnt-ib" data-f="save" title="Kaydet (Ctrl+S)" aria-label="Kaydet">${I.save}</button>
      <button type="button" class="pnt-ib" data-f="undo" title="Geri al (Ctrl+Z)" aria-label="Geri al">${I.undo}</button>
      <button type="button" class="pnt-ib" data-f="redo" title="Yinele (Ctrl+Y)" aria-label="Yinele">${I.redo}</button>
    </div>
    <div class="pnt-rib">
      <div class="pnt-g"><div class="pnt-gb pnt-col">
        ${bigBtn(I.select, 'data-tool="select"', 'Dikdörtgen seçim')}<button type="button" class="pnt-cv" data-m="sel" title="Seçim seçenekleri" aria-label="Seçim seçenekleri">${I.chev}</button>
      </div><small>Seçim</small></div>
      <div class="pnt-g pnt-g-img"><div class="pnt-gb pnt-col pnt-rows">
        <button type="button" class="pnt-r" data-f="crop" title="Kırp: yalnızca seçili alan kalır">${I.crop}<span>Kırp</span></button>
        <button type="button" class="pnt-r" data-f="resize" title="Yeniden boyutlandır">${I.resize}<span>Yeniden boyutlandır</span></button>
        <button type="button" class="pnt-r" data-m="rot" title="Döndür ve çevir">${I.rotate}<span>Döndür</span>${I.chev}</button>
      </div><small>Resim</small></div>
      <div class="pnt-g"><div class="pnt-gb pnt-tg">
        ${TOOLS.map(([id, n]) => `<button type="button" class="pnt-s pnt-t" data-tool="${id}" title="${n}" aria-label="${n}">${TOOL_ICON[id]}</button>`).join('')}
      </div><small>Araçlar</small></div>
      <div class="pnt-g"><div class="pnt-gb pnt-col">
        ${bigBtn(I.brush, 'data-tool="brush"', 'Fırça')}<button type="button" class="pnt-cv" data-m="brush" title="Fırçalar" aria-label="Fırçalar">${I.chev}</button>
      </div><small>Fırçalar</small></div>
      <div class="pnt-g pnt-g-shapes"><div class="pnt-gb">
        <div class="pnt-sgw">${shapesGrid()}</div>
        <div class="pnt-shbtn pnt-col">${bigBtn(shapeIcon('star5'), 'data-m="shapes"', 'Şekiller')}<button type="button" class="pnt-cv" data-m="shapes" title="Şekiller" aria-label="Şekiller">${I.chev}</button></div>
        <div class="pnt-col pnt-ol">
          <button type="button" class="pnt-r" data-m="outline" title="Şekil çizgisi (Ana hat)">${I.outline}<span>Ana hat</span>${I.chev}</button>
          <button type="button" class="pnt-r" data-m="fillm" title="Şeklin içini boya (Dolgu)">${I.fillI}<span>Dolgu</span>${I.chev}</button>
        </div>
      </div><small>Şekiller</small></div>
      <div class="pnt-g"><div class="pnt-gb pnt-col">
        ${bigBtn(I.size, 'data-m="size"', 'Boyut')}<button type="button" class="pnt-cv" data-m="size" title="Boyut" aria-label="Boyut">${I.chev}</button>
      </div><small>Boyut</small></div>
      <div class="pnt-g pnt-g-col"><div class="pnt-gb">
        <button type="button" class="pnt-slot" data-slot="1" title="Renk 1 (sol tuş)"><i class="pnt-c1"></i><span>Renk 1</span></button>
        <button type="button" class="pnt-slot" data-slot="2" title="Renk 2 (sağ tuş)"><i class="pnt-c2"></i><span>Renk 2</span></button>
        <div class="pnt-pal">${COLORS.map(([c, n]) => `<button type="button" class="pnt-sw" data-color="${c}" title="${n}" aria-label="${n}" style="background:${c}"></button>`).join('')}</div>
        <button type="button" class="pnt-b pnt-edc" data-m="more" title="Renkleri düzenle" aria-label="Renkleri düzenle">${I.wheel}</button>
      </div><small>Renkler</small></div>
    </div>
    <div class="pnt-area"><div class="pnt-wrap"><canvas class="pnt-cvs" width="${W}" height="${H}"></canvas><canvas class="pnt-ov" width="${W}" height="${H}"></canvas><div class="pnt-ghost" hidden></div>
      <i class="pnt-hd pnt-hd-e" data-hd="e"></i><i class="pnt-hd pnt-hd-s" data-hd="s"></i><i class="pnt-hd pnt-hd-se" data-hd="se"></i></div></div>
    <div class="pnt-status">
      <span class="pnt-st" title="İmleç konumu">${I.cursor}<b class="pnt-pos"></b></span>
      <span class="pnt-st pnt-selst" title="Seçim boyutu">${I.selI}<b class="pnt-sel"></b></span>
      <span class="pnt-st" title="Tuval boyutu">${I.canvasI}<b class="pnt-dim"></b></span>
      <span class="pnt-hint"></span>
      <span class="pnt-fsize"></span>
      <span class="pnt-zoom"><b class="pnt-zp">100%</b>
        <button type="button" class="pnt-ib pnt-zb" data-f="zoomout" title="Uzaklaştır (Ctrl+eksi)" aria-label="Uzaklaştır">${I.minus}</button>
        <input type="range" class="pnt-zr" min="0" max="${ZOOMS.length - 1}" step="1" value="4" aria-label="Yakınlaştırma">
        <button type="button" class="pnt-ib pnt-zb" data-f="zoomin" title="Yakınlaştır (Ctrl+artı)" aria-label="Yakınlaştır">${I.plus}</button></span>
    </div>`;
  const $ = (s) => body.querySelector(s);
  const cv = $('.pnt-cvs'), ov = $('.pnt-ov'), area = $('.pnt-area'), wrap = $('.pnt-wrap');
  const g = cv.getContext('2d', { willReadFrequently: true }), go = ov.getContext('2d');
  let tool = 'pencil', prevTool = 'pencil', color = '#000000', color2 = '#ffffff', slot = 1, size = 6, brushKind = 'brush';
  let outlineMode = 'solid', fillMode = 'none', zi = 4, sbar = true;
  let fileName = null, folder = 'pictures', dirty = false, pend = null;
  const undo = [], redo = [];
  // Gerçek piksel boyutu: virt açıkken resim ekranda küçültülmüş çizilir (ör. 4000 × 3000 fotoğraf)
  let virt = false, lw = W, lh = H, sel = null;
  const dims = () => (virt ? [lw, lh] : [cv.width, cv.height]);
  const fit = (w, h) => { const k = Math.min(1, MAXW / w, MAXH / h); return [Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k))]; };
  const fsApi = desk.fs.dialogApi();
  const realPt = (p) => { const [dw, dh] = dims(); return { x: Math.round((p.x * dw) / cv.width), y: Math.round((p.y * dh) / cv.height) }; };

  const clear = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); };
  clear();

  const title = () => setTitle(`${dirty ? '*' : ''}${fileName ? fileName.replace(/\.[^.]+$/, '') : 'Adsız'} - Paint`);
  function applyZoom() {
    const z = ZOOMS[zi];
    cv.style.width = ov.style.width = Math.round(cv.width * z) + 'px';
    cv.style.height = ov.style.height = Math.round(cv.height * z) + 'px';
    $('.pnt-zr').value = zi;
    $('.pnt-zp').textContent = Math.round(z * 100 * (cv.width / dims()[0])) + '%';
    $('.pnt-zoom [data-f="zoomout"]').disabled = zi === 0;
    $('.pnt-zoom [data-f="zoomin"]').disabled = zi === ZOOMS.length - 1;
  }
  function zoomTo(i, at) {
    const old = ZOOMS[zi];
    zi = Math.max(0, Math.min(ZOOMS.length - 1, i));
    applyZoom();
    if (at) { const d = ZOOMS[zi] - old; area.scrollLeft += at.x * d; area.scrollTop += at.y * d; }
  }
  const ui = () => {
    body.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === tool));
    body.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('on', b.dataset.color === (slot === 1 ? color : color2)));
    $('.pnt-c1').style.background = color; $('.pnt-c2').style.background = color2;
    body.querySelectorAll('[data-slot]').forEach((b) => b.classList.toggle('on', +b.dataset.slot === slot));
    const [dw, dh] = dims();
    $('.pnt-dim').textContent = `${dw} × ${dh}px`;
    $('.pnt-sel').textContent = sel ? `${Math.round((sel.w * dw) / cv.width)} × ${Math.round((sel.h * dh) / cv.height)}px` : '';
    $('.pnt-selst').classList.toggle('pnt-off', !sel);
    const node = fileName && desk.fs.find(folder, fileName);
    $('.pnt-fsize').textContent = node ? `Kayıtlı dosya: ${fmtSize(desk.fs.sizeOf(node))}` : '';
    $('.pnt-hint').textContent = HINTS[tool] || '';
    $('[data-f="undo"]').disabled = !undo.length;
    $('[data-f="redo"]').disabled = !redo.length;
    $('.pnt-status').hidden = !sbar;
    wrap.classList.toggle('pnt-novirt', virt);
    ov.style.cursor = tool === 'text' ? 'text' : tool === 'fill' ? 'cell' : tool === 'magnifier' ? 'zoom-in' : tool === 'picker' ? 'copy' : 'crosshair';
    applyZoom();
  };
  const grab = () => { const im = g.getImageData(0, 0, cv.width, cv.height); im.v = [virt, lw, lh]; return im; };
  const snap = () => { undo.push(grab()); if (undo.length > 30) undo.shift(); redo.length = 0; ui(); };
  const restoreImg = (img) => {
    if (img.width !== cv.width || img.height !== cv.height) resize(img.width, img.height, false);
    g.putImageData(img, 0, 0);
    if (img.v) [virt, lw, lh] = img.v;
    ui();
  };
  const dropSel = () => { sel = null; go.clearRect(0, 0, ov.width, ov.height); ui(); };
  const changed = () => { dirty = true; title(); ui(); };
  function resize(w, h, keep = true) {
    const old = keep ? g.getImageData(0, 0, cv.width, cv.height) : null;
    cv.width = ov.width = w; cv.height = ov.height = h;
    clear();
    if (old) g.putImageData(old, 0, 0);
    ui();
  }

  const pos = (e) => {
    const r = ov.getBoundingClientRect();
    return { x: Math.round((e.clientX - r.left) * cv.width / r.width), y: Math.round((e.clientY - r.top) * cv.height / r.height) };
  };
  const setPos = (p) => { const q = realPt(p); $('.pnt-pos').textContent = `${q.x}, ${q.y}px`; };

  // ---------- Çizim ----------
  function stroke(a, b, w, c, cap = 'round') {
    g.strokeStyle = c; g.lineWidth = w; g.lineCap = cap; g.lineJoin = cap === 'square' ? 'bevel' : 'round';
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  }
  // Fırça türleri: çizgi boyunca küçük "damga"lar
  function dab(kind, x, y, w, c) {
    g.fillStyle = c;
    if (kind === 'cal1' || kind === 'cal2') {
      g.beginPath(); g.ellipse(x, y, kind === 'cal1' ? w * 0.7 : w * 0.45, kind === 'cal1' ? w * 0.18 : w * 0.12, kind === 'cal1' ? -Math.PI / 4 : -Math.PI / 3, 0, Math.PI * 2); g.fill();
    } else if (kind === 'air' || kind === 'crayon') {
      const n = kind === 'air' ? Math.max(4, w) : Math.max(3, w * 0.7), r = kind === 'air' ? w * 1.1 : w * 0.7;
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r; g.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, kind === 'air' ? 1 : 2, kind === 'air' ? 1 : 2); }
    } else {
      g.globalAlpha = kind === 'oil' ? 0.5 : 0.12;
      g.beginPath(); g.arc(x, y, kind === 'oil' ? w * 0.6 : w * 0.95, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
    }
  }
  function brushSeg(a, b, w, c) {
    if (brushKind === 'brush') return stroke(a, b, w, c);
    if (brushKind === 'marker') return stroke(a, b, w * 1.2, c, 'square');
    const step = Math.max(1, w / 4), n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
    for (let i = 0; i <= n; i++) dab(brushKind, a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n, w, c);
  }
  function erase(a, b, w, c) { // silgi kare
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
    g.fillStyle = c;
    for (let i = 0; i <= n; i++) g.fillRect(a.x + ((b.x - a.x) * i) / n - w / 2, a.y + ((b.y - a.y) * i) / n - w / 2, w, w);
  }

  // Şekil çizer: line / curve / polygon özel, öbürleri sınır kutusuna göre
  function shapeOpts(c1, c2) {
    const strokeOn = outlineMode !== 'none' || fillMode === 'none';
    return { lw: size, sc: c1, fc: strokeOn ? c2 : c1, strokeOn, fillOn: fillMode === 'solid' };
  }
  function drawShape(ctx, kind, a, b, o, extra = {}) {
    ctx.lineWidth = o.lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = o.sc; ctx.fillStyle = o.fc;
    if (kind === 'line' || kind === 'curve') {
      ctx.beginPath(); ctx.moveTo(a.x, a.y);
      if (kind === 'curve' && extra.c) ctx.quadraticCurveTo(extra.c.x, extra.c.y, b.x, b.y); else ctx.lineTo(b.x, b.y);
      ctx.stroke();
      return;
    }
    if (kind === 'polygon') {
      const pts = extra.pts;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
      if (pts.length > 2) { ctx.closePath(); if (o.fillOn) ctx.fill(); }
      if (o.strokeOn) ctx.stroke();
      return;
    }
    const p = new Path2D(shapeD(kind, Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)));
    if (o.fillOn) ctx.fill(p);
    if (o.strokeOn) ctx.stroke(p);
  }
  // Şift basılıysa: kare / daire, çizgide 45 derece
  function constrain(a, b, kind, shift) {
    if (!shift) return b;
    const dx = b.x - a.x, dy = b.y - a.y;
    if (kind === 'line' || kind === 'curve') { const ang = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4), d = Math.hypot(dx, dy); return { x: Math.round(a.x + d * Math.cos(ang)), y: Math.round(a.y + d * Math.sin(ang)) }; }
    const m = Math.max(Math.abs(dx), Math.abs(dy));
    return { x: a.x + Math.sign(dx || 1) * m, y: a.y + Math.sign(dy || 1) * m };
  }
  const bbox = (pts) => { const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y); return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };

  // Çokgen ve eğri birden çok adımda çizilir: bekleyen şekil (pend)
  function previewPend(cursor) {
    go.clearRect(0, 0, ov.width, ov.height);
    if (!pend) return;
    if (pend.kind === 'curve') drawShape(go, 'curve', pend.a, pend.b, pend.o, { c: pend.c });
    else drawShape(go, 'polygon', null, null, pend.o, { pts: cursor ? [...pend.pts, cursor] : pend.pts });
  }
  function commitPend() {
    const p = pend; pend = null;
    go.clearRect(0, 0, ov.width, ov.height);
    if (!p) return;
    if (p.kind === 'polygon' && p.pts.length < 2) return;
    snap();
    if (p.kind === 'curve') drawShape(g, 'curve', p.a, p.b, p.o, { c: p.c }); else drawShape(g, 'polygon', null, null, p.o, { pts: p.pts });
    const bb = bbox(p.kind === 'curve' ? [p.a, p.b, ...(p.c ? [p.c] : [])] : p.pts);
    changed();
    emit('paint-shape', { shape: p.kind, w: bb.w, h: bb.h, color: p.c1, colorName: colorName(p.c1) });
  }
  const cancelPend = () => { pend = null; go.clearRect(0, 0, ov.width, ov.height); };

  function flood(x, y, hex) {
    const img = g.getImageData(0, 0, cv.width, cv.height), d = img.data, w = cv.width, h = cv.height;
    const i0 = (y * w + x) * 4;
    const t = [d[i0], d[i0 + 1], d[i0 + 2]];
    const f = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    if (Math.abs(t[0] - f[0]) + Math.abs(t[1] - f[1]) + Math.abs(t[2] - f[2]) < 10) return 0;
    const near = (i) => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) < 90;
    const st = [[x, y]];
    let n = 0;
    while (st.length) {
      const [px, py] = st.pop();
      let lx = px;
      while (lx >= 0 && near((py * w + lx) * 4)) lx--;
      lx++;
      let up = false, dn = false;
      for (let cx = lx; cx < w && near((py * w + cx) * 4); cx++) {
        const i = (py * w + cx) * 4;
        d[i] = f[0]; d[i + 1] = f[1]; d[i + 2] = f[2]; d[i + 3] = 255; n++;
        if (py > 0) { const u = near(((py - 1) * w + cx) * 4); if (u && !up) st.push([cx, py - 1]); up = u; }
        if (py < h - 1) { const v = near(((py + 1) * w + cx) * 4); if (v && !dn) st.push([cx, py + 1]); dn = v; }
      }
    }
    g.putImageData(img, 0, 0);
    return n;
  }

  function textAt(p, tc) {
    const inp = document.createElement('input');
    inp.className = 'pnt-text';
    const r = ov.getBoundingClientRect();
    const k = r.width / cv.width;
    const px = Math.max(16, size * 3);
    Object.assign(inp.style, { left: p.x * k + 'px', top: p.y * k + 'px', color: tc, fontSize: px * k + 'px' });
    inp.placeholder = 'Yazın, bitince Enter';
    wrap.append(inp);
    setTimeout(() => inp.focus(), 0);
    let done = false;
    const commit = () => {
      if (done) return;
      done = true;
      const t = inp.value.trim();
      inp.remove();
      if (!t) return;
      snap();
      g.fillStyle = tc; g.font = `${px}px UISymC, UISymM, UISymD, "Segoe UI", sans-serif`; g.textBaseline = 'top';
      g.fillText(t, p.x, p.y);
      changed();
      emit('paint-text', { text: t, color: tc });
      body.focus({ preventScroll: true });
    };
    inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') commit(); if (e.key === 'Escape') { done = true; inp.remove(); } });
    inp.addEventListener('blur', commit);
  }

  function pick(a, right) {
    const x = Math.max(0, Math.min(cv.width - 1, a.x)), y = Math.max(0, Math.min(cv.height - 1, a.y));
    const d = g.getImageData(x, y, 1, 1).data;
    const hex = '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
    if (right) color2 = hex; else color = hex;
    tool = prevTool; // renk seçilince önceki araca dönülür
    ui();
    emit('paint-color', { color: hex, colorName: colorName(hex), slot: right ? 2 : 1, picked: true });
  }

  let lastDown = { t: 0, x: 0, y: 0 };
  function pendDown(e, a) {
    const dbl = e.timeStamp - lastDown.t < 450 && Math.hypot(a.x - lastDown.x, a.y - lastDown.y) < 8;
    lastDown = { t: e.timeStamp, x: a.x, y: a.y };
    if (pend.kind === 'curve') {
      ov.setPointerCapture(e.pointerId);
      const move = (ev) => { pend.c = pos(ev); previewPend(); };
      const up = () => { ov.removeEventListener('pointermove', move); ov.removeEventListener('pointerup', up); commitPend(); };
      pend.c = a; ov.addEventListener('pointermove', move); ov.addEventListener('pointerup', up);
      return true;
    }
    const first = pend.pts[0];
    if (dbl || Math.hypot(a.x - first.x, a.y - first.y) < 8) { commitPend(); return true; }
    pend.pts.push(a); previewPend(a);
    return true;
  }

  ov.addEventListener('contextmenu', (e) => e.preventDefault());
  ov.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.button !== 2) return;
    closePop();
    const a = pos(e);
    const right = e.button === 2;
    const c1 = right ? color2 : color, c2 = right ? color : color2;
    if (pend && pendDown(e, a)) return;
    if (tool === 'magnifier') { zoomTo(zi + (right ? -1 : 1), a); return; }
    if (tool === 'picker') { pick(a, right); return; }
    if (tool === 'fill') { snap(); const n = flood(a.x, a.y, c1); if (n) { changed(); emit('paint-fill', { color: c1, colorName: colorName(c1), pixels: n }); } else { undo.pop(); ui(); } return; }
    if (tool === 'text') { e.preventDefault(); textAt(a, c1); return; }
    ov.setPointerCapture(e.pointerId);
    if (tool === 'select') { selectFrom(a); return; }
    const freehand = ['pencil', 'brush', 'eraser'].includes(tool);
    snap();
    let last = a, len = 0, shift = e.shiftKey;
    const w = tool === 'pencil' ? Math.max(1, size / 2) : tool === 'eraser' ? size * 2.5 : size * 1.6;
    const c = tool === 'eraser' ? c2 : c1;
    const seg = (p, q) => (tool === 'eraser' ? erase(p, q, w, c) : tool === 'brush' ? brushSeg(p, q, w, c) : stroke(p, q, w, c));
    const kind = tool, o = shapeOpts(c1, c2);
    if (freehand) seg(a, a);
    lastDown = { t: e.timeStamp, x: a.x, y: a.y };
    const move = (ev) => {
      const b = pos(ev);
      shift = ev.shiftKey;
      if (freehand) { seg(last, b); len += Math.hypot(b.x - last.x, b.y - last.y); last = b; }
      else if (kind === 'polygon') { last = b; go.clearRect(0, 0, ov.width, ov.height); drawShape(go, 'polygon', null, null, o, { pts: [a, constrain(a, b, 'line', shift)] }); }
      else { last = b; go.clearRect(0, 0, ov.width, ov.height); drawShape(go, kind, a, constrain(a, b, kind, shift), o); }
      setPos(b);
    };
    const up = () => {
      ov.removeEventListener('pointermove', move);
      ov.removeEventListener('pointerup', up);
      if (freehand) {
        changed();
        emit('paint-draw', { tool, color: c1, colorName: colorName(c1), len: Math.round(len), size, brush: tool === 'brush' ? brushKind : undefined });
        return;
      }
      go.clearRect(0, 0, ov.width, ov.height);
      const end = constrain(a, last, kind, shift);
      const bw = Math.abs(end.x - a.x), bh = Math.abs(end.y - a.y);
      if (bw + bh < 6) { undo.pop(); ui(); return; }
      if (kind === 'curve') { undo.pop(); pend = { kind, a, b: end, c: null, o, c1 }; previewPend(); ui(); return; }
      if (kind === 'polygon') { undo.pop(); pend = { kind, pts: [a, end], o, c1 }; previewPend(); ui(); return; }
      drawShape(g, kind, a, end, o);
      changed();
      emit('paint-shape', { shape: kind, w: bw, h: bh, color: c1, colorName: colorName(c1) });
    };
    ov.addEventListener('pointermove', move);
    ov.addEventListener('pointerup', up);
  });
  ov.addEventListener('pointermove', (e) => {
    const p = pos(e); setPos(p);
    if (pend && pend.kind === 'polygon' && !e.buttons) previewPend(p);
  });
  ov.addEventListener('pointerleave', () => { $('.pnt-pos').textContent = ''; });

  // Seçim: kesik çizgili dikdörtgen; Kırp bu alanı bırakır
  function drawSel() {
    go.clearRect(0, 0, ov.width, ov.height);
    if (!sel) return;
    go.setLineDash([6, 4]); go.lineWidth = 1.5; go.strokeStyle = '#0a5dc2';
    go.strokeRect(sel.x + 0.5, sel.y + 0.5, sel.w, sel.h);
    go.setLineDash([]);
  }
  function selectFrom(a) {
    dropSel();
    let b = a;
    const move = (ev) => {
      b = pos(ev); b.x = Math.max(0, Math.min(cv.width, b.x)); b.y = Math.max(0, Math.min(cv.height, b.y));
      sel = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
      drawSel(); setPos(b);
    };
    const up = () => {
      ov.removeEventListener('pointermove', move);
      ov.removeEventListener('pointerup', up);
      const x = Math.max(0, Math.min(a.x, b.x)), y = Math.max(0, Math.min(a.y, b.y));
      const w = Math.min(cv.width, Math.max(a.x, b.x)) - x, h = Math.min(cv.height, Math.max(a.y, b.y)) - y;
      if (w < 8 || h < 8) { dropSel(); return; }
      sel = { x, y, w, h };
      drawSel(); ui();
      const [dw, dh] = dims();
      emit('paint-select', { w: Math.round((w * dw) / cv.width), h: Math.round((h * dh) / cv.height) });
    };
    ov.addEventListener('pointermove', move);
    ov.addEventListener('pointerup', up);
  }
  function selectAll() {
    finishPend();
    tool = 'select'; sel = { x: 0, y: 0, w: cv.width, h: cv.height };
    drawSel(); ui();
    const [dw, dh] = dims();
    emit('paint-select', { w: dw, h: dh, all: true });
  }
  function selCanvas() {
    const t = document.createElement('canvas'); t.width = sel.w; t.height = sel.h;
    t.getContext('2d').putImageData(g.getImageData(sel.x, sel.y, sel.w, sel.h), 0, 0);
    return t;
  }
  function copySel(cut) {
    if (!sel) { desk.toast('Kopyala', 'Önce <b>Seçim</b> aracıyla resimde bir alan seçin.', I.selI, 5000); emit('nothing', { what: cut ? 'cut' : 'copy' }); return; }
    desk.imageClip = selCanvas();
    emit('paint-copy', { cut: !!cut });
    if (cut) deleteSel();
  }
  function deleteSel() {
    if (!sel) { emit('nothing', { what: 'delete' }); return; }
    snap();
    g.fillStyle = color2; g.fillRect(sel.x, sel.y, sel.w, sel.h);
    changed();
    emit('paint-delete-sel', {});
  }
  function crop() {
    if (!sel) { desk.toast('Kırp', 'Önce <b>Seçim</b> aracıyla resmin kalmasını istediğiniz yerine bir dikdörtgen çizin.', I.crop, 5000); emit('nothing', { what: 'crop' }); return; }
    snap();
    const [dw, dh] = dims();
    const nw = Math.max(1, Math.round((sel.w * dw) / cv.width)), nh = Math.max(1, Math.round((sel.h * dh) / cv.height));
    const part = g.getImageData(sel.x, sel.y, sel.w, sel.h);
    dropSel();
    resize(part.width, part.height, false);
    g.putImageData(part, 0, 0);
    virt = nw !== cv.width || nh !== cv.height; lw = nw; lh = nh;
    changed();
    emit('paint-crop', { w: nw, h: nh });
  }
  function rotate(how) {
    finishPend();
    snap(); dropSel();
    const src = document.createElement('canvas'); src.width = cv.width; src.height = cv.height; src.getContext('2d').drawImage(cv, 0, 0);
    const turn = how === 'r90' || how === 'l90';
    const nw = turn ? src.height : src.width, nh = turn ? src.width : src.height;
    resize(nw, nh, false);
    g.save();
    if (how === 'r90') { g.translate(nw, 0); g.rotate(Math.PI / 2); }
    if (how === 'l90') { g.translate(0, nh); g.rotate(-Math.PI / 2); }
    if (how === 'r180') { g.translate(nw, nh); g.rotate(Math.PI); }
    if (how === 'flipv') { g.translate(0, nh); g.scale(1, -1); }
    if (how === 'fliph') { g.translate(nw, 0); g.scale(-1, 1); }
    g.drawImage(src, 0, 0);
    g.restore();
    if (turn && virt) [lw, lh] = [lh, lw];
    changed();
    emit('paint-rotate', { how });
  }

  // Yeniden boyutlandır penceresi: Yüzde ya da Piksel; en boy oranı korunursa biri yazılınca öbürü kendiliğinden değişir
  async function resizeDlg() {
    if (dialogs.busy) return;
    finishPend();
    const [w0, h0] = dims();
    const inner = `<div class="dlg-pr pt-rs"><div class="pt-rs-by">Ölçüt: <label><input type="radio" name="pt-by" value="pct" checked> Yüzde</label><label><input type="radio" name="pt-by" value="px"> Piksel</label></div>
      <label class="dlg-row"><span>Yatay</span><input class="dlg-name" data-f="w" value="100" inputmode="numeric" autofocus></label>
      <label class="dlg-row"><span>Dikey</span><input class="dlg-name" data-f="h" value="100" inputmode="numeric"></label>
      <label class="pt-rs-keep"><input type="checkbox" data-f="keep" checked> En boy oranını koru</label>
      <div class="pt-rs-out"></div></div><div class="dlg-err"></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">Tamam</button><button type="button" class="dlg-cancel">İptal</button></div>`;
    const p = dialogs.shell('dlg-form', 'Yeniden boyutlandır', inner, 'resize');
    const back = dialogs._last;
    const q = (x) => back.querySelector(x);
    const by = () => back.querySelector('[name="pt-by"]:checked').value;
    const num = (x) => parseInt(q(`[data-f="${x}"]`).value.replace(/\D/g, ''), 10) || 0;
    const target = () => (by() === 'pct' ? [Math.round((w0 * num('w')) / 100), Math.round((h0 * num('h')) / 100)] : [num('w'), num('h')]);
    const out = () => { const [w, h] = target(); q('.pt-rs-out').textContent = `Şimdi: ${w0} × ${h0}px → Yeni: ${w} × ${h}px`; };
    back.addEventListener('input', (e) => {
      const f = e.target.dataset.f;
      if ((f === 'w' || f === 'h') && q('[data-f="keep"]').checked) {
        const o = f === 'w' ? 'h' : 'w';
        q(`[data-f="${o}"]`).value = by() === 'pct' ? num(f) : Math.round(f === 'w' ? (num('w') * h0) / w0 : (num('h') * w0) / h0);
      }
      out();
    });
    back.querySelectorAll('[name="pt-by"]').forEach((r) => r.addEventListener('change', () => {
      const pct = by() === 'pct';
      q('[data-f="w"]').value = pct ? 100 : w0; q('[data-f="h"]').value = pct ? 100 : h0;
      out();
    }));
    out();
    const ok = () => {
      const [w, h] = target();
      if (w < 1 || h < 1) { q('.dlg-err').textContent = 'Lütfen 0\'dan büyük bir sayı yazın.'; return; }
      if (w > 10000 || h > 10000) { q('.dlg-err').textContent = 'Bu kadar büyütülemez.'; return; }
      back.close({ w, h, by: by(), keep: q('[data-f="keep"]').checked });
    };
    q('.dlg-ok').onclick = ok;
    q('.dlg-cancel').onclick = () => back.close(null);
    back.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('[data-f]')) { e.preventDefault(); ok(); } });
    const r = await p;
    body.focus({ preventScroll: true });
    if (!r || (r.w === w0 && r.h === h0)) return;
    snap();
    dropSel();
    const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; tmp.getContext('2d').drawImage(cv, 0, 0);
    const [cw, ch] = fit(r.w, r.h);
    resize(cw, ch, false);
    g.drawImage(tmp, 0, 0, cw, ch);
    virt = cw !== r.w || ch !== r.h; lw = r.w; lh = r.h;
    changed();
    emit('paint-resize', { w: r.w, h: r.h, from: [w0, h0], by: r.by, keep: r.keep });
  }

  // Tuvalın köşesinden sürükleyerek boyutlandırma
  wrap.addEventListener('pointerdown', (e) => {
    const hd = e.target.closest('[data-hd]');
    if (!hd || virt || e.button !== 0) return;
    e.preventDefault();
    finishPend(); dropSel();
    hd.setPointerCapture(e.pointerId);
    const z = ZOOMS[zi], x0 = e.clientX, y0 = e.clientY, w0 = cv.width, h0 = cv.height, how = hd.dataset.hd;
    const ghost = $('.pnt-ghost');
    let nw = w0, nh = h0;
    ghost.hidden = false;
    const move = (ev) => {
      if (how.includes('e')) nw = Math.max(1, Math.min(5000, Math.round(w0 + (ev.clientX - x0) / z)));
      if (how.includes('s')) nh = Math.max(1, Math.min(5000, Math.round(h0 + (ev.clientY - y0) / z)));
      Object.assign(ghost.style, { width: nw * z + 'px', height: nh * z + 'px' });
      $('.pnt-dim').textContent = `${nw} × ${nh}px`;
    };
    move(e);
    const up = () => {
      hd.removeEventListener('pointermove', move); hd.removeEventListener('pointerup', up);
      ghost.hidden = true;
      if (nw !== w0 || nh !== h0) { snap(); resize(nw, nh, true); changed(); emit('paint-canvas', { w: nw, h: nh }); } else ui();
    };
    hd.addEventListener('pointermove', move); hd.addEventListener('pointerup', up);
  });

  function doUndo() {
    if (!undo.length) return;
    cancelPend(); dropSel();
    redo.push(grab());
    restoreImg(undo.pop());
    changed();
    emit('paint-undo');
  }
  function doRedo() {
    if (!redo.length) return;
    cancelPend(); dropSel();
    undo.push(grab());
    restoreImg(redo.pop());
    changed();
    emit('paint-redo');
  }
  function finishPend() { if (pend) commitPend(); }

  function pasteImage() {
    const img = desk.imageClip;
    if (!img) { desk.toast('Pano boş', 'Yapıştırılacak bir resim yok. Önce Ekran Alıntısı ile bir resim alın.', I.app, 5000); emit('nothing', { what: 'paste' }); return; }
    finishPend();
    snap();
    if (img.width > cv.width || img.height > cv.height) resize(Math.max(cv.width, img.width), Math.max(cv.height, img.height));
    g.drawImage(img, 0, 0);
    changed();
    emit('paint-paste', { w: img.width, h: img.height });
  }

  async function save(asNew) {
    if (dialogs.busy) return false;
    finishPend();
    if (!fileName || asNew) {
      const r = await dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || '', ext: '.png', typeLabel: 'PNG (*.png)', types: [['.png', 'PNG (*.png)'], ['.jpg', 'JPEG (*.jpg; *.jpeg)']] });
      body.focus({ preventScroll: true });
      if (!r) return false;
      fileName = r.name; folder = r.folder;
    }
    const jpeg = /\.jpe?g$/i.test(fileName);
    let data;
    if (jpeg) { // JPEG saydam alan bilmez: arka plan beyaz olur
      const t = document.createElement('canvas'); t.width = cv.width; t.height = cv.height;
      const tg = t.getContext('2d'); tg.fillStyle = '#fff'; tg.fillRect(0, 0, t.width, t.height); tg.drawImage(cv, 0, 0);
      data = t.toDataURL('image/jpeg', 0.8);
    } else data = cv.toDataURL('image/png');
    // Ekranda küçültülmüş büyük resim: gerçek boyutu da saklanır (dosya boyutu ona göre hesaplanır)
    const node = desk.fs.write(folder, fileName, virt ? { src: data, w: lw, h: lh } : data);
    dirty = false;
    title(); ui();
    const [dw, dh] = dims();
    emit('save', { name: fileName, folder, label: desk.fs.label(folder), format: jpeg ? 'jpg' : 'png', w: dw, h: dh, size: desk.fs.sizeOf(node) });
    return true;
  }

  async function openPic() {
    if (dialogs.busy || !(await confirmClose())) return;
    const r = await dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.png', accept: /\.(png|jpe?g)$/i, typeLabel: 'Resimler (*.png; *.jpg)' });
    body.focus({ preventScroll: true });
    if (!r) return;
    load(desk.fs.dialogApi().read(r.folder, r.name), r.name, r.folder);
    emit('open', { name: r.name, folder: r.folder });
  }

  async function newDoc() {
    if (dialogs.busy || !(await confirmClose())) return;
    cancelPend(); sel = null;
    virt = false; lw = W; lh = H;
    resize(W, H, false);
    undo.length = redo.length = 0;
    fileName = null; dirty = false; zi = 4;
    title(); ui();
    emit('paint-new');
  }

  function load(content, name, fold) {
    const im = new Image();
    const big = content && typeof content === 'object' && content.w && content.h;
    im.onload = () => {
      cancelPend(); dropSel();
      if (big) {
        const [cw, ch] = fit(content.w, content.h);
        resize(cw, ch, false);
        g.drawImage(im, 0, 0, cw, ch);
        virt = cw !== content.w || ch !== content.h; lw = content.w; lh = content.h;
      } else {
        virt = false;
        resize(Math.min(1200, im.width), Math.min(900, im.height), false);
        g.drawImage(im, 0, 0);
      }
      undo.length = redo.length = 0;
      ui();
    };
    im.src = pictureURL(content);
    fileName = name; folder = fold; dirty = false;
    title();
  }

  async function confirmClose() {
    if (!dirty) return true;
    const a = await dialogs.ask({ title: 'Paint', text: `<b>${esc(fileName || 'Adsız')}</b> resmindeki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['discard', 'Kaydetme'], ['cancel', 'İptal']] });
    emit('ask', { answer: a || 'cancel' });
    if (a === 'save') return save(false);
    return a === 'discard';
  }

  // ---------- Açılır listeler ----------
  let pop = null, popId = '', justClosed = '';
  const mi = (attrs, label, key = '', on = false) => `<button type="button" class="pnt-mi${on ? ' on' : ''}" ${attrs}><span class="pnt-ck">${on ? I.check : ''}</span><span class="pnt-ml">${label}</span><kbd>${key}</kbd></button>`;
  const MENU_HTML = {
    file: () => mi('data-f="new"', 'Yeni', 'Ctrl+N') + mi('data-f="open"', 'Aç', 'Ctrl+O') + mi('data-f="save"', 'Kaydet', 'Ctrl+S') + mi('data-f="saveas"', 'Farklı kaydet', 'Ctrl+Shift+S') + '<hr>' + mi('data-f="exit"', 'Çıkış', 'Alt+F4'),
    edit: () => mi('data-f="undo"', 'Geri al', 'Ctrl+Z') + mi('data-f="redo"', 'Yinele', 'Ctrl+Y') + '<hr>' + mi('data-f="cut"', 'Kes', 'Ctrl+X') + mi('data-f="copy"', 'Kopyala', 'Ctrl+C') + mi('data-f="paste"', 'Yapıştır', 'Ctrl+V') + '<hr>' + mi('data-f="selall"', 'Tümünü seç', 'Ctrl+A') + mi('data-f="seldel"', 'Seçimi sil', 'Del'),
    view: () => mi('data-f="zoomin"', 'Yakınlaştır', 'Ctrl+artı') + mi('data-f="zoomout"', 'Uzaklaştır', 'Ctrl+eksi') + mi('data-f="zoom100"', '%100', 'Ctrl+0') + '<hr>' + mi('data-f="sbar"', 'Durum çubuğu', '', sbar),
    sel: () => mi('data-tool="select"', 'Dikdörtgen seçim', '', tool === 'select') + mi('data-f="selall"', 'Tümünü seç', 'Ctrl+A') + mi('data-f="seldel"', 'Seçimi sil', 'Del'),
    rot: () => mi('data-rot="r90"', 'Sağa 90° döndür') + mi('data-rot="l90"', 'Sola 90° döndür') + mi('data-rot="r180"', '180° döndür') + '<hr>' + mi('data-rot="flipv"', 'Dikey çevir') + mi('data-rot="fliph"', 'Yatay çevir'),
    brush: () => BRUSHES.map(([k, n]) => `<button type="button" class="pnt-mi pnt-mb2${tool === 'brush' && brushKind === k ? ' on' : ''}" data-brush="${k}" title="${n}">${brushSample(k)}<span class="pnt-ml">${n}</span></button>`).join(''),
    size: () => SIZES.map(([s, n]) => `<button type="button" class="pnt-mi pnt-mb2${size === s ? ' on' : ''}" data-size="${s}" title="${n}"><svg class="pnt-bs" viewBox="0 0 30 16" aria-hidden="true"><path d="M3 8h24" stroke="currentColor" stroke-width="${Math.max(1.2, s / 2.4)}" stroke-linecap="round" fill="none"/></svg><span class="pnt-ml">${n}</span></button>`).join(''),
    outline: () => mi('data-ol="none"', 'Ana hat yok', '', outlineMode === 'none') + mi('data-ol="solid"', 'Düz renk', '', outlineMode === 'solid'),
    fillm: () => mi('data-fm="none"', 'Dolgu yok', '', fillMode === 'none') + mi('data-fm="solid"', 'Düz renk', '', fillMode === 'solid'),
    shapes: () => shapesGrid(),
    more: () => `<div class="pnt-more"><b>Renkleri düzenle</b><div class="pnt-mg">${MORE.map((c) => `<button type="button" class="pnt-sw" data-color="${c}" title="${c}" style="background:${c}"></button>`).join('')}</div>
      <label class="pnt-cust">Başka bir renk: <input type="color" class="pnt-ci" value="${slot === 1 ? color : color2}"></label></div>`,
  };
  function closePop() { if (pop) { pop.remove(); pop = null; popId = ''; } }
  function openPop(id, anchor) {
    closePop();
    finishPend();
    pop = document.createElement('div');
    pop.className = 'pnt-pop pnt-pop-' + id;
    pop.innerHTML = MENU_HTML[id]();
    body.append(pop);
    popId = id;
    const br = anchor.getBoundingClientRect(), pr = body.getBoundingClientRect();
    const left = Math.max(0, Math.min(br.left - pr.left, pr.width - pop.offsetWidth - 4));
    pop.style.left = left + 'px';
    pop.style.top = Math.min(br.bottom - pr.top + 1, Math.max(0, pr.height - pop.offsetHeight)) + 'px';
  }

  // ---------- Olaylar ----------
  const FUNCS = {
    save: () => save(false), saveas: () => save(true), open: openPic, new: newDoc, undo: doUndo, redo: doRedo, paste: pasteImage, crop, resize: resizeDlg,
    cut: () => copySel(true), copy: () => copySel(false), selall: selectAll, seldel: deleteSel,
    zoomin: () => zoomTo(zi + 1), zoomout: () => zoomTo(zi - 1), zoom100: () => zoomTo(4),
    sbar: () => { sbar = !sbar; ui(); }, exit: () => desk.close(win),
  };
  function setTool(t, name) {
    finishPend();
    if (t !== tool && (t === 'picker' || t === 'magnifier')) prevTool = tool;
    tool = t;
    if (tool !== 'select') dropSel();
    ui();
    emit('paint-tool', { tool, name });
  }
  function setColor(c, name) {
    if (slot === 1) color = c; else color2 = c;
    ui();
    emit('paint-color', { color: c, colorName: name || colorName(c), slot });
  }
  body.addEventListener('pointerdown', (e) => {
    if (pop && !e.target.closest('.pnt-pop')) { const m = e.target.closest('[data-m]'); justClosed = m ? m.dataset.m : ''; closePop(); }
  }, true);
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tool]'), c = e.target.closest('[data-color]'), s = e.target.closest('[data-size]'), f = e.target.closest('[data-f]');
    const m = e.target.closest('[data-m]'), br = e.target.closest('[data-brush]'), rt = e.target.closest('[data-rot]'), sl = e.target.closest('[data-slot]');
    const ol = e.target.closest('[data-ol]'), fm = e.target.closest('[data-fm]');
    if (m) {
      const again = justClosed === m.dataset.m;
      justClosed = '';
      if (!again) openPop(m.dataset.m, m);
      return;
    }
    justClosed = '';
    const inPop = !!e.target.closest('.pnt-pop');
    if (t) setTool(t.dataset.tool, t.title);
    if (br) { brushKind = br.dataset.brush; setTool('brush', br.title); }
    if (c) setColor(c.dataset.color, c.title === c.dataset.color ? undefined : c.title);
    if (s) { size = +s.dataset.size; ui(); emit('paint-size', { size, name: s.title }); }
    if (ol) { outlineMode = ol.dataset.ol; ui(); }
    if (fm) { fillMode = fm.dataset.fm; ui(); }
    if (sl) { slot = +sl.dataset.slot; ui(); }
    if (rt) rotate(rt.dataset.rot);
    if (f) FUNCS[f.dataset.f]?.();
    if (inPop && !c && !e.target.closest('.pnt-more')) closePop();
    else if (inPop && c && popId === 'more') closePop();
  });
  body.addEventListener('input', (e) => {
    if (e.target.classList.contains('pnt-zr')) zoomTo(+e.target.value);
    if (e.target.classList.contains('pnt-ci')) { if (slot === 1) color = e.target.value; else color2 = e.target.value; ui(); }
  });
  body.addEventListener('change', (e) => {
    if (e.target.classList.contains('pnt-ci')) emit('paint-color', { color: e.target.value, colorName: colorName(e.target.value), slot, custom: true });
  });
  area.addEventListener('wheel', (e) => { if (e.ctrlKey) { e.preventDefault(); zoomTo(zi + (e.deltaY < 0 ? 1 : -1)); } }, { passive: false });
  body.addEventListener('keydown', (e) => {
    if (e.target.closest('input[type="text"], input.pnt-text, .dlg')) return;
    if (e.key === 'Escape') { closePop(); if (pend) cancelPend(); return; }
    if (e.key === 'Enter' && pend) { e.preventDefault(); commitPend(); return; }
    if (e.key === 'Delete' && sel) { e.preventDefault(); deleteSel(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(zi + 1); return; }
    if (e.key === '-') { e.preventDefault(); zoomTo(zi - 1); return; }
    const k = { KeyZ: doUndo, KeyY: doRedo, KeyV: pasteImage, KeyO: openPic, KeyN: newDoc, KeyA: selectAll, KeyC: () => copySel(false), KeyX: () => copySel(true), Digit0: () => zoomTo(4), KeyS: () => save(e.shiftKey) }[e.code];
    if (k) { e.preventDefault(); k(); }
  });
  // Klavye kısayolları için odak Paint'te kalsın; ama metin aracıyla açılan yazı kutusunun odağını çalmasın
  body.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input') || (tool === 'text' && e.target === ov)) return;
    setTimeout(() => body.focus({ preventScroll: true }), 0);
  });

  if (args.node) { const n = desk.fs.get(args.node); if (n) load(n.content, n.name, n.parent); }
  ui();
  title();
  return {
    confirmClose,
    focus: () => { if (!body.querySelector('.pnt-text')) body.focus({ preventScroll: true }); },
    get dirty() { return dirty; },
    get tool() { return tool; },
    get color() { return color; },
    get size() { const [w, h] = dims(); return { w, h }; },
  };
}
