// Dosya Gezgini (Windows 11 görünümü): başlık çubuğunda sekmeler; geri/ileri/yukarı, tıklanabilir adres (kırıntı) çubuğu ve arama;
// komut çubuğu (Yeni, Kes, Kopyala, Yapıştır, Yeniden adlandır, Paylaş, Sil, Sırala, Görüntüle, Filtre, ⋯); sol gezinti bölmesi;
// klasörlerde gezinme, yeni klasör, yeniden adlandırma, kes/kopyala/yapıştır, sürükle-bırak ile taşıma, silme, Geri Dönüşüm Kutusu,
// arama, USB bellek ve telefon; Ayrıntılar / simge / liste / döşeme görünümleri ve sıralama; sıkıştırılmış (.zip) klasör.
import { ROOTS, RECYCLE, USB, PHONE } from '../vfs.js';
import { esc, pictureURL, isImage } from './util.js';
import { nodeIcon } from '../desktop.js';
import { SYS_ICONS, APP_ICONS, iconFor } from './appicons.js';

export const fmtSize = (b) => (b >= 1e9 ? `${(b / 1e9).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} GB` : b >= 1e6 ? `${(b / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const fmtDate = (t) => (t ? new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const TYPES = [[/\.txt$/i, 'Metin Belgesi'], [/\.docx$/i, 'Word Belgesi'], [/\.xlsx$/i, 'Excel Çalışma Kitabı'], [/\.pptx$/i, 'PowerPoint Sunusu'], [/\.pdf$/i, 'PDF Belgesi'], [/\.jpe?g$/i, 'JPG dosyası'], [/\.png$/i, 'PNG dosyası'], [/\.mp3$/i, 'MP3 ses dosyası'], [/\.mp4$/i, 'MP4 video'], [/\.zip$/i, 'Sıkıştırılmış (zip) klasör'], [/\.exe$/i, 'Uygulama']];
export const typeName = (n) => (n.type === 'folder' ? 'Dosya klasörü' : n.type === 'link' ? 'Kısayol' : TYPES.find(([r]) => r.test(n.name))?.[1] || 'Dosya');

// Resim dosyalarının küçük önizlemesi (simge görünümünde)
const thumb = (n) => n.type === 'file' && isImage(n.name) && n.content && (typeof n.content === 'object' || String(n.content).startsWith('data:')) ? pictureURL(n.content) : '';

// ---- Simgeler: komut çubuğu ve menüler için 16×16 çizgi simgeler (emoji yok: bazı bilgisayarlarda görünmez)
const sv = (d, cls = '') => `<svg class="gx-s ${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  back: sv('<path d="M13 8H3.5M7.4 3.9 3.3 8l4.1 4.1"/>'),
  fwd: sv('<path d="M3 8h9.5M8.6 3.9 12.7 8l-4.1 4.1"/>'),
  up: sv('<path d="M8 13V3.5M3.9 7.4 8 3.3l4.1 4.1"/>'),
  refresh: sv('<path d="M13 8a5 5 0 1 1-1.7-3.8"/><path d="M13.2 2.6v2.7h-2.7"/>'),
  search: sv('<circle cx="6.8" cy="6.8" r="4.1"/><path d="m10 10 3.7 3.7"/>'),
  plus: sv('<path d="M8 3v10M3 8h10"/>'),
  cut: sv('<circle cx="4.4" cy="12" r="2"/><circle cx="11.6" cy="12" r="2"/><path d="M5.5 10.3 12.4 2.5M10.5 10.3 3.6 2.5"/>'),
  copy: sv('<rect x="5.6" y="5.6" width="8" height="8.4" rx="1.3"/><path d="M10.4 5.6V3.9a1.3 1.3 0 0 0-1.3-1.3H3.9a1.3 1.3 0 0 0-1.3 1.3v5.2a1.3 1.3 0 0 0 1.3 1.3h1.7"/>'),
  paste: sv('<rect x="3" y="3" width="10" height="11" rx="1.3"/><path d="M6 3V2h4v1M5.6 7h4.8M5.6 10h3.2"/>'),
  rename: sv('<rect x="1.8" y="4" width="12.4" height="8" rx="1.3"/><path d="M8 6v4M6.6 6h2.8M6.6 10h2.8"/>'),
  share: sv('<path d="M8 9.8V2.6M5.2 5.2 8 2.4l2.8 2.8"/><path d="M4.6 7.4h-.8a1.3 1.3 0 0 0-1.3 1.3v3.9a1.3 1.3 0 0 0 1.3 1.3h8.4a1.3 1.3 0 0 0 1.3-1.3V8.7a1.3 1.3 0 0 0-1.3-1.3h-.8"/>'),
  trash: sv('<path d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9.5h6.8L12 4M6.6 6.5v5M9.4 6.5v5"/>'),
  sort: sv('<path d="M4.5 13V3M2.2 5.3 4.5 3l2.3 2.3M11.5 3v10M9.2 10.7 11.5 13l2.3-2.3"/>'),
  view: sv('<rect x="2.5" y="2.5" width="4.6" height="4.6" rx=".9"/><rect x="8.9" y="2.5" width="4.6" height="4.6" rx=".9"/><rect x="2.5" y="8.9" width="4.6" height="4.6" rx=".9"/><rect x="8.9" y="8.9" width="4.6" height="4.6" rx=".9"/>'),
  filter: sv('<path d="M2.4 3.4h11.2L9.4 8.4v4.2l-2.8 1.2V8.4z"/>'),
  more: sv('<circle cx="3.2" cy="8" r="1.05" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.05" fill="currentColor" stroke="none"/><circle cx="12.8" cy="8" r="1.05" fill="currentColor" stroke="none"/>'),
  chevD: sv('<path d="m4 6.2 4 4 4-4"/>', 'gx-chev'),
  chevR: sv('<path d="m6.2 3.8 4.2 4.2-4.2 4.2"/>', 'gx-chev'),
  chevU: sv('<path d="m4 9.8 4-4 4 4"/>', 'gx-chev'),
  close: sv('<path d="m4 4 8 8M12 4 4 12"/>'),
  check: sv('<path d="m3.4 8.4 3.1 3.1 6.1-7"/>'),
  dot: sv('<circle cx="8" cy="8" r="2.3" fill="currentColor" stroke="none"/>'),
  details: sv('<path d="M2.5 4h11M2.5 8h11M2.5 12h11"/>'),
  list: sv('<path d="M2.5 4h4M2.5 8h4M2.5 12h4M9.5 4h4M9.5 8h4M9.5 12h4"/>'),
  tiles: sv('<rect x="2.3" y="3" width="4" height="4" rx=".8"/><path d="M8.3 4h5.2M8.3 6.3h3.3"/><rect x="2.3" y="9" width="4" height="4" rx=".8"/><path d="M8.3 10h5.2M8.3 12.3h3.3"/>'),
  eject: sv('<path d="M8 3 3 9.2h10zM3.5 12.4h9"/>'),
  zip: sv('<path d="M2.5 4.2c0-.6.4-1 1-1h3l1.3 1.4h4.7c.6 0 1 .4 1 1v6.2c0 .6-.4 1-1 1h-9c-.6 0-1-.4-1-1z"/><path d="M8.4 6.4v4.6M7.4 7.2h2M7.4 8.6h2"/>'),
  info: sv('<circle cx="8" cy="8" r="5.7"/><path d="M8 7.3v3.7M8 5v.1"/>'),
  open: sv('<path d="M2.4 4.4c0-.6.4-1 1-1h3L7.8 5h4.8c.6 0 1 .4 1 1v5.6c0 .6-.4 1-1 1H3.4c-.6 0-1-.4-1-1z"/>'),
  folderN: sv('<path d="M2.4 4.4c0-.6.4-1 1-1h3L7.8 5h4.8c.6 0 1 .4 1 1v5.6c0 .6-.4 1-1 1H3.4c-.6 0-1-.4-1-1z"/><path d="M8 7v3M6.5 8.5h3"/>'),
  newText: sv('<path d="M4 2.5h5.3L12.5 5.7v7.8H4z"/><path d="M9.2 2.6v3.2h3.2M6 8.4h4.5M6 10.7h4.5"/>'),
  pin: sv('<path d="M9.6 2.5 13.5 6.4l-1.6.6-2.2 2.2.2 2.5-.9.9-2.6-2.6-3.4 3.4M6.3 7.2l-.5-.5.8-.9 2.3.2 2.3-2.2.7-1.6"/>'),
  path: sv('<path d="M6.2 9.8 9.8 6.2M7 4.6l1-1a2.6 2.6 0 0 1 3.7 3.7l-1 1M9 11.4l-1 1A2.6 2.6 0 0 1 4.3 8.7l1-1"/>'),
  restore: sv('<path d="M3 8a5 5 0 1 0 1.7-3.8"/><path d="M2.8 2.6v2.7h2.7"/>'),
  shortcut: sv('<rect x="2.5" y="4" width="9" height="9" rx="1.2"/><path d="M9 2.5h4.5V7M13.5 2.5 8 8"/>'),
  wallpaper: sv('<rect x="2" y="3" width="12" height="9" rx="1.2"/><path d="m2.6 10.6 3.2-3 2.3 2.2 1.6-1.4 3.6 3M5.4 13.5h5.2"/>'),
  tab: sv('<rect x="2.3" y="3.3" width="11.4" height="9.4" rx="1.4"/>'),
  import: sv('<path d="M8 2.5v7M5.2 6.8 8 9.6l2.8-2.8M3 11.5v1.2c0 .5.4.8.8.8h8.4c.4 0 .8-.3.8-.8v-1.2"/>'),
};

// Gezinti bölmesi, adres çubuğu ve sekmelerde küçük renkli simgeler (klasör türüne göre)
const FOLDER = '<path d="M1.8 4.3c0-.7.5-1.2 1.2-1.2h3l1.5 1.6H13c.7 0 1.2.5 1.2 1.2v6c0 .7-.5 1.2-1.2 1.2H3c-.7 0-1.2-.5-1.2-1.2z" fill="#f5c84b" stroke="#d9a21b" stroke-width=".8"/>';
const NAVSYM = {
  home: '<path d="M2.2 8 8 2.8 13.8 8M3.8 7v6.2h3V9.6h2.4v3.6h3V7" stroke="#0f6cbd" stroke-width="1.3" fill="none"/>',
  gallery: '<rect x="2" y="2.8" width="12" height="10.4" rx="1.6" fill="#e8f2fd" stroke="#2b7fd6" stroke-width="1.2"/><path d="m2.6 11.4 3.4-3.6 2.4 2.4 2-1.8 3 3" fill="none" stroke="#2b7fd6" stroke-width="1.2"/><circle cx="10.8" cy="6" r="1.1" fill="#2b7fd6"/>',
  cloud: '<path d="M4.6 12.4A3 3 0 0 1 4 6.5a4 4 0 0 1 7.6-.7 3.3 3.3 0 0 1 .3 6.6z" fill="#cfe3fa" stroke="#1c6fd1" stroke-width="1.2"/>',
  desktop: `${FOLDER}<rect x="4.6" y="6.4" width="6.8" height="4.2" rx=".6" fill="#2d8cf0"/>`,
  downloads: `${FOLDER}<path d="M8 6.3v4.2M6.2 8.8 8 10.6l1.8-1.8" stroke="#1f9d55" stroke-width="1.3" fill="none"/>`,
  docs: `${FOLDER}<rect x="5.6" y="5.8" width="4.8" height="5.4" rx=".5" fill="#fff" stroke="#7a8aa3" stroke-width=".7"/><path d="M6.6 7.6h2.8M6.6 9.2h2.8" stroke="#4a78c8" stroke-width=".7"/>`,
  pictures: `${FOLDER}<rect x="4.8" y="6" width="6.4" height="4.8" rx=".6" fill="#dff0ff" stroke="#2b7fd6" stroke-width=".7"/><path d="m5.2 10.2 2-2 1.4 1.2 1-.9 1.2 1.7" fill="none" stroke="#2f9e5a" stroke-width=".8"/>`,
  music: `${FOLDER}<path d="M7 10.8V6.5l3.4-.8v4.2" fill="none" stroke="#e0502f" stroke-width="1"/><circle cx="6.3" cy="10.8" r="1" fill="#e0502f"/><circle cx="9.7" cy="9.9" r="1" fill="#e0502f"/>`,
  videos: `${FOLDER}<rect x="4.8" y="6" width="6.4" height="4.8" rx=".7" fill="#7b4bd1"/><path d="m7.2 7.2 2 1.2-2 1.2z" fill="#fff"/>`,
  folder: FOLDER,
  pc: '<rect x="2" y="2.8" width="12" height="8" rx="1.2" fill="#e8f2fd" stroke="#2b7fd6" stroke-width="1.2"/><path d="M5.5 13.4h5M8 10.8v2.6" stroke="#2b7fd6" stroke-width="1.2"/>',
  disk: '<rect x="1.8" y="5" width="12.4" height="6.4" rx="1.6" fill="#e6e9ee" stroke="#6b7686" stroke-width="1.1"/><circle cx="11.6" cy="8.2" r=".9" fill="#2da44e"/><path d="M4 8.2h4" stroke="#6b7686" stroke-width="1.1"/>',
  usb: '<rect x="4.2" y="2" width="7.6" height="8" rx="1" fill="#e6e9ee" stroke="#6b7686" stroke-width="1.1"/><path d="M6.4 3.8v1.6M9.6 3.8v1.6" stroke="#6b7686" stroke-width="1.1"/><rect x="5" y="10" width="6" height="4" rx=".8" fill="#2b7fd6"/>',
  phone: '<rect x="4.2" y="1.8" width="7.6" height="12.4" rx="1.6" fill="#e8f2fd" stroke="#2b7fd6" stroke-width="1.2"/><path d="M7 12.2h2" stroke="#2b7fd6" stroke-width="1.2"/>',
  net: '<circle cx="8" cy="8" r="5.8" fill="#e8f2fd" stroke="#2b7fd6" stroke-width="1.1"/><path d="M2.4 8h11.2M8 2.2c-2.2 2.4-2.2 9.2 0 11.6M8 2.2c2.2 2.4 2.2 9.2 0 11.6" fill="none" stroke="#2b7fd6" stroke-width="1"/>',
  recycle: '<path d="M3.6 4.6h8.8l-.8 8.4H4.4z" fill="#e8f2fd" stroke="#2b7fd6" stroke-width="1.1"/><path d="M2.6 4.6h10.8M6.2 4.6V3h3.6v1.6M6.6 7v4M9.4 7v4" fill="none" stroke="#2b7fd6" stroke-width="1.1"/>',
};
// Klasör, sürücü ve sistem simgeleri ortak kitaplıktan (appicons.js); Giriş, Galeri, Ağ gibi kitaplıkta olmayanlar burada çizilir
const SYSKEY = { desktop: 'folder-desktop', docs: 'folder-docs', downloads: 'folder-down', pictures: 'folder-pics', music: 'folder-music', videos: 'folder-video', folder: 'folder', pc: 'pc', disk: 'drive', usb: 'usb', phone: 'phone', recycle: 'recycle' };
const nav16 = (k) => (k === 'cloud' ? APP_ICONS.bulut : SYS_ICONS[SYSKEY[k]] || `<svg class="gx-s gx-nv" viewBox="0 0 16 16" aria-hidden="true">${NAVSYM[k] || NAVSYM.folder}</svg>`);
const ROOTKIND = { desktop: 'desktop', docs: 'docs', downloads: 'downloads', pictures: 'pictures', music: 'music', videos: 'videos', home: 'home', gallery: 'gallery', pc: 'pc', c: 'disk', net: 'net' };
const idKind = (id) => ROOTKIND[id] || (id === USB ? 'usb' : id === PHONE ? 'phone' : id === RECYCLE ? 'recycle' : 'folder');
// Giriş ve Bu Bilgisayar sayfalarındaki büyük simgeler
const big = (id) => `<span class="gx-big">${nav16(idKind(id))}</span>`;

// Görünümler (Görüntüle menüsü): kod → ad
const VIEWS = [['xl', 'Çok büyük simgeler'], ['lg', 'Büyük simgeler'], ['icons', 'Orta simgeler'], ['sm', 'Küçük simgeler'], ['list', 'Liste'], ['details', 'Ayrıntılar'], ['tiles', 'Döşemeler']];
const VIEWICON = { xl: I.view, lg: I.view, icons: I.view, sm: I.list, list: I.list, details: I.details, tiles: I.tiles };
const SORTS = [['name', 'Ad'], ['date', 'Değiştirme tarihi'], ['type', 'Tür'], ['size', 'Boyut']];
const FILTERS = [['folder', 'Klasörler', (n) => n.type === 'folder'], ['doc', 'Belgeler', (n) => /\.(txt|docx?|xlsx?|pptx?|pdf)$/i.test(n.name)], ['img', 'Resimler', (n) => isImage(n.name)], ['audio', 'Müzik', (n) => /\.(mp3|m4a|wav)$/i.test(n.name)], ['video', 'Videolar', (n) => /\.(mp4|mov|avi)$/i.test(n.name)], ['zip', 'Sıkıştırılmış klasörler', (n) => /\.zip$/i.test(n.name)]];
const SPECIAL_NAMES = { 'giriş': 'home', galeri: 'gallery', videolar: 'videos', 'ağ': 'net', 'bu bilgisayar': 'pc', 'yerel disk (c:)': 'c', 'c:': 'c' };

export function explorer({ desk, body, args, emit, setTitle, close: closeWin }) {
  const fs = desk.fs;
  body.classList.add('ex');
  body.tabIndex = 0;
  body.innerHTML = `
    <div class="ex-top">
      <button type="button" class="ex-back gx-nb" title="Geri (Alt + Sol ok)" aria-label="Geri">${I.back}</button><button type="button" class="ex-fwd gx-nb" title="İleri (Alt + Sağ ok)" aria-label="İleri">${I.fwd}</button><button type="button" class="ex-up gx-nb" title="Üst klasör (Alt + Yukarı ok)" aria-label="Üst klasör">${I.up}</button>
      <div class="gx-ab"><div class="ex-addr"></div><button type="button" class="gx-nb gx-rf" data-cmd="refresh" title="Yenile (F5)" aria-label="Yenile">${I.refresh}</button></div>
      <label class="gx-search"><input class="ex-search" placeholder="Ara" aria-label="Bu klasörde ara">${I.search}</label>
    </div>
    <div class="ex-cmd"></div>
    <div class="ex-main">
      <nav class="ex-nav"></nav>
      <div class="ex-view" data-drop=""><div class="ex-items"></div></div>
    </div>
    <div class="ex-status"></div>`;
  const $ = (s) => body.querySelector(s);
  let cur = args.folder || 'docs';
  let sel = null, anchor = null; // sel: son tıklanan öğe; anchor: Shift + tık aralığının başı
  const picked = new Set(); // seçili öğelerin hepsi (Ctrl + tık, Shift + tık, çerçeve)
  let boxes = !!desk.settings.exBoxes; // öğe onay kutuları
  let showExtensions = desk.settings.exExtensions !== false;
  const hiddenExtension = (n) => showExtensions || n.type !== 'file' || !TYPES.some(([pattern]) => pattern.test(n.name))
    ? '' : n.name.match(/(?<=.)\.[^.]+$/)?.[0] || '';
  const displayName = (n) => n.name.slice(0, n.name.length - hiddenExtension(n).length);
  const itemName = (n) => renaming === n.id
    ? `<input class="ei-rename" value="${esc(displayName(n))}" spellcheck="false">`
    : `<span class="ei-name">${esc(displayName(n))}</span>`;
  let renaming = null;
  let query = '';
  let userMode = args.view || null, sortBy = 'name', sortDesc = false; // görünüm: seçilmediyse klasöre göre (aşağıda); sıralama
  let filt = null; // Filtre: tür
  let editAddr = false; // adres çubuğu yazılabilir durumda mı
  let pcOpen = true; // gezinti bölmesinde Bu Bilgisayar açık mı
  const grpShut = {}; // Bu Bilgisayar sayfasında kapalı gruplar
  let back = [], fwd = [];
  const tabs = [{}];
  let ti = 0;
  let curDefs = [];

  // 'pc': Bu Bilgisayar, 'home': Giriş, 'c': Yerel Disk, 'gallery': Galeri, 'videos': Videolar, 'net': Ağ (sanal sayfalar)
  const isSpecial = (id) => ['pc', 'home', 'c', 'gallery', 'videos', 'net'].includes(id);
  const label = (id) => ({ pc: 'Bu Bilgisayar', home: 'Giriş', c: 'Yerel Disk (C:)', gallery: 'Galeri', videos: 'Videolar', net: 'Ağ' })[id] || fs.label(id);
  const recent = () => (desk.recent || []).map((id) => fs.get(id)).filter((n) => n && n.type === 'file' && !fs.inRecycle(n.id));
  const alive = (n) => !n.root && n.type === 'file' && !fs.inRecycle(n.id);
  const gallery = () => Object.values(fs.nodes).filter((n) => alive(n) && isImage(n.name) && fs.isInside(n.id, 'pictures'));
  const videos = () => Object.values(fs.nodes).filter((n) => alive(n) && /\.(mp4|mov|avi)$/i.test(n.name));
  const hasInUsb = () => cur === USB || (!isSpecial(cur) && fs.get(cur) && fs.isInside(cur, USB));
  const hasInPhone = () => !isSpecial(cur) && fs.get(cur) && fs.isInside(cur, PHONE);
  // Resimler klasörü ve Galeri büyük simgeli, Masaüstü orta boy, öbürleri Ayrıntılar açılır (gerçek Windows'ta olduğu gibi)
  const viewMode = () => userMode || (cur === 'gallery' ? 'lg' : cur === 'desktop' ? 'icons' : !isSpecial(cur) && fs.get(cur) && fs.isInside(cur, 'pictures') ? 'lg' : 'details');
  const pathNames = (id) => ['Bu Bilgisayar', ...fs.path(id).map((n) => n.name)];

  function go(id, push = true) {
    if (!isSpecial(id) && !fs.get(id)) id = 'pc';
    if (push && id !== cur) { back.push(cur); fwd.length = 0; }
    cur = id;
    sel = anchor = null;
    picked.clear();
    query = '';
    filt = null;
    editAddr = false;
    $('.ex-search').value = '';
    render();
    emit('nav', { folder: cur, name: label(cur) });
  }

  function items() {
    const f = (l) => (filt ? l.filter(FILTERS.find((x) => x[0] === filt)[2]) : l);
    if (query) {
      // Bu Bilgisayar'da ya da Giriş'te arama bütün klasörlere bakar
      const inside = (n) => isSpecial(cur) || (fs.isInside(n.id, cur) && n.id !== cur);
      return f(fs.search(query).filter(inside));
    }
    if (cur === 'home') return recent();
    if (cur === 'gallery') return f(sortList(gallery()));
    if (cur === 'videos') return f(sortList(videos()));
    if (cur === 'pc' || cur === 'c' || cur === 'net') return [];
    return f(sortList(fs.children(cur).filter((n) => n.type !== 'link' || cur === 'desktop')));
  }
  // Klasörler her zaman önce; sonra seçilen sütuna göre
  function sortList(list) {
    const key = { name: (n) => n.name.toLocaleLowerCase('tr'), date: (n) => n.mtime || 0, type: (n) => typeName(n), size: (n) => fs.sizeOf(n) }[sortBy];
    const folderFirst = sortBy !== 'date';
    return [...list].sort((a, b) => (folderFirst ? ((a.type === 'folder') - (b.type === 'folder')) * -1 : 0) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) * (sortDesc ? -1 : 1));
  }
  // Tarihe göre sıralanınca dosyalar gruplara ayrılır: Bugün, Dün, Bu hafta, Daha önce
  function dateGroup(t) {
    const d0 = desk.now(); d0.setHours(0, 0, 0, 0);
    const day = 86400e3, x = t || 0;
    return x >= +d0 ? 'Bugün' : x >= +d0 - day ? 'Dün' : x >= +d0 - 6 * day ? 'Bu hafta başlarında' : x >= +d0 - 30 * day ? 'Geçen hafta ve önceki haftalar' : 'Daha önce';
  }
  const grouped = () => sortBy === 'date' && !isSpecial(cur) && !query;
  const groupHead = (list, i, html) => {
    if (!grouped()) return '';
    const g = dateGroup(list[i].mtime);
    return i && dateGroup(list[i - 1].mtime) === g ? '' : html(g);
  };

  // Düğmeler yeniden çizilince klavye odağı gövdeden kaybolmasın (Ctrl+V, Delete çalışmaya devam etsin)
  function keepFocus(fn) {
    const had = body.contains(document.activeElement);
    fn();
    if (had && !renaming && !editAddr && !body.contains(document.activeElement)) body.focus({ preventScroll: true });
  }

  function render() { keepFocus(draw); }

  // Başlık çubuğundaki sekmeler (Windows 11'de sekmeler başlık çubuğunda durur)
  const win = body.closest('.win');
  const bar = win?.querySelector('.win-bar');
  let strip = null;
  if (bar) {
    strip = document.createElement('div');
    strip.className = 'gx-tabs';
    const mb = bar.querySelector('.wb-min');
    if (mb) bar.insertBefore(strip, mb); else bar.append(strip);
  }
  function drawTabs() {
    if (!strip) return;
    strip.innerHTML = tabs.map((t, i) => `<div class="gx-tab${i === ti ? ' on' : ''}" title="${esc(i === ti ? label(cur) : label(t.cur))}"><button type="button" class="gx-tabb" data-tab="${i}"><span class="gx-ni">${nav16(idKind(i === ti ? cur : t.cur))}</span><span class="gx-tl">${esc(i === ti ? label(cur) : label(t.cur))}</span></button><button type="button" class="gx-tabx" data-tabx="${i}" title="Sekmeyi kapat (Ctrl + W)" aria-label="Sekmeyi kapat">${I.close}</button></div>`).join('')
      + `<button type="button" class="gx-tabn" data-newtab="1" title="Yeni sekme (Ctrl + T)" aria-label="Yeni sekme">${I.plus}</button><span class="gx-tabfill"></span>`;
  }
  function saveTab() { tabs[ti] = { cur, back, fwd }; }
  function loadTab(i) {
    ti = i;
    ({ cur, back, fwd } = tabs[i]);
    sel = anchor = null; picked.clear(); query = ''; filt = null; editAddr = false; renaming = null;
    $('.ex-search').value = '';
    render();
    emit('nav', { folder: cur, name: label(cur) });
  }
  function newTab() { saveTab(); tabs.push({ cur: 'home', back: [], fwd: [] }); loadTab(tabs.length - 1); emit('ex-tab', { op: 'new', count: tabs.length }); }
  function closeTab(i) {
    if (tabs.length === 1) { closeWin?.(); return; }
    saveTab();
    tabs.splice(i, 1);
    const k = Math.min(i < ti ? ti - 1 : ti, tabs.length - 1);
    loadTab(k);
    emit('ex-tab', { op: 'close', count: tabs.length });
  }
  tabs[0] = { cur, back, fwd };

  const crumbs = (ids) => `<span class="gx-ai">${nav16(idKind(cur))}</span><i class="gx-cs">${I.chevR}</i>` + ids.map((id) => `<button type="button" class="gx-cb" data-go="${id}">${esc(label(id))}</button><button type="button" class="gx-cv" data-chev="${id}" title="${esc(label(id))} içindeki klasörler" aria-label="${esc(label(id))} içindeki klasörleri göster">${I.chevR}</button>`).join('');

  function draw() {
    setTitle(label(cur));
    drawTabs();
    if (!editAddr) {
      const ids = ['home', 'gallery', 'net', RECYCLE, 'pc'].includes(cur) ? [cur] : ['pc', ...(cur === 'c' || cur === 'videos' ? [cur] : fs.path(cur).map((n) => n.id))];
      $('.ex-addr').innerHTML = crumbs(ids);
      $('.ex-addr').scrollLeft = 1e5;
    }
    $('.ex-search').placeholder = `${label(cur)} içinde ara`;
    $('.ex-back').disabled = !back.length;
    $('.ex-fwd').disabled = !fwd.length;
    $('.ex-up').disabled = cur === 'pc' || cur === 'home';
    drawNav();
    const inRecycle = cur === RECYCLE;
    const view = $('.ex-view');
    if (isSpecial(cur) || query) delete view.dataset.drop; else view.dataset.drop = 'folder:' + cur;
    const list = items();
    const m = viewMode();
    const box = $('.ex-items');
    box.className = 'ex-items gx-v-' + (['home', 'pc', 'c', 'net'].includes(cur) && !query ? 'page' : m);
    if (cur === 'home' && !query) {
      const quick = ['desktop', 'downloads', 'docs', 'pictures', 'music', 'videos'];
      box.innerHTML = `<h3 class="ex-h">${I.chevD} Hızlı erişim</h3><div class="ex-quick">${quick.map((id) => `<button type="button" class="gx-tile" data-go="${id}" ${id === 'videos' ? '' : `data-drop="folder:${id}"`}>${big(id)}<span><b>${esc(label(id))}</b><small>${I.pin} Bu Bilgisayar</small></span></button>`).join('')}</div>
        <h3 class="ex-h">${I.chevD} Son kullanılanlar</h3>${list.length ? `<table class="ex-det ex-recent"><thead><tr><th>Ad</th><th>Değiştirme tarihi</th><th>Konum</th></tr></thead><tbody>
        ${list.map((n) => `<tr class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}"><td><span class="ei-ic">${nodeIcon(n)}</span>${itemName(n)}</td><td>${fmtDate(n.mtime)}</td><td class="ex-loc">${esc(fs.path(n.parent).map((x) => x.name).join(' › '))}</td></tr>`).join('')}</tbody></table>`
          : '<p class="ex-empty">Açtığınız ve kaydettiğiniz dosyalar burada görünür.</p>'}`;
    } else if (cur === 'pc' && !query) {
      const tile = (id) => `<button type="button" class="gx-tile" data-go="${id}" ${id === 'videos' ? '' : `data-drop="folder:${id}"`}>${big(id)}<span><b>${esc(label(id))}</b></span></button>`;
      const drive = (go, id, name, free, total) => `<button type="button" class="ex-drive" data-go="${go}">${big(id)}<div><b>${esc(name)}</b><div class="ex-bar${free / total < 0.1 ? ' full' : ''}"><i style="width:${Math.round((1 - free / total) * 100)}%"></i></div><small>${free} GB boş / ${total} GB</small></div></button>`;
      const drives = 1 + (fs.usb ? 1 : 0) + (fs.phone ? 1 : 0);
      box.innerHTML = `<button type="button" class="ex-h gx-gh" data-grp="folders">${grpShut.folders ? I.chevR : I.chevD} Klasörler (6)</button>
        ${grpShut.folders ? '' : `<div class="ex-quick">${['desktop', 'docs', 'downloads', 'music', 'pictures', 'videos'].map(tile).join('')}</div>`}
        <button type="button" class="ex-h gx-gh" data-grp="drives">${grpShut.drives ? I.chevR : I.chevD} Aygıtlar ve sürücüler (${drives})</button>
        ${grpShut.drives ? '' : `<div class="ex-drives">${drive('c', 'c', 'Yerel Disk (C:)', 120, 237)}
        ${fs.usb ? drive(USB, USB, 'USB Bellek (E:)', 28, 32) : ''}
        ${fs.phone ? drive(PHONE, PHONE, 'Telefonum', 37, 128) : ''}</div>`}`;
    } else if (cur === 'c' && !query) {
      box.innerHTML = `<div class="ex-quick">${['desktop', 'docs', 'downloads', 'music', 'pictures', 'videos'].map((id) => `<button type="button" class="gx-tile" data-go="${id}" ${id === 'videos' ? '' : `data-drop="folder:${id}"`}>${big(id)}<span><b>${esc(label(id))}</b></span></button>`).join('')}</div>`;
    } else if (cur === 'net' && !query) {
      box.innerHTML = '<p class="ex-empty">Bu ağda görüntülenecek bilgisayar ya da aygıt yok.<br>Benzetimde ağ paylaşımları kapalıdır.</p>';
    } else if (!list.length) {
      box.innerHTML = `<p class="ex-empty">${query ? 'Aramanızla eşleşen öğe yok.' : filt ? 'Bu filtreye uyan öğe yok.' : inRecycle ? 'Geri Dönüşüm Kutusu boş.' : cur === 'gallery' ? 'Resimler klasöründe fotoğraf yok.' : 'Bu klasör boş.'}</p>`;
    } else if (m === 'details') {
      const col = (k, l) => `<th data-sort="${k}" class="${sortBy === k ? 'on' : ''}">${l}${sortBy === k ? (sortDesc ? I.chevD : I.chevU) : ''}</th>`;
      box.innerHTML = `<table class="ex-det"><thead><tr>${col('name', 'Ad')}${col('date', 'Değiştirme tarihi')}${col('type', 'Tür')}${col('size', 'Boyut')}</tr></thead><tbody>
        ${list.map((n, i) => `${groupHead(list, i, (g) => `<tr class="ex-grp"><td colspan="4">${g}</td></tr>`)}<tr class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}" ${n.type === 'folder' && !inRecycle ? `data-drop="folder:${n.id}"` : ''}><td>${boxes ? '<span class="ei-chk" title="Seç"></span>' : ''}<span class="ei-ic">${nodeIcon(n)}</span>${itemName(n)}</td>
          <td>${fmtDate(n.mtime)}</td><td>${esc(typeName(n))}</td><td class="num">${n.type === 'folder' ? '' : fmtSize(fs.sizeOf(n))}</td></tr>`).join('')}</tbody></table>`;
    } else {
      const big3 = m === 'xl' || m === 'lg' || m === 'icons';
      box.innerHTML = list.map((n, i) => `${groupHead(list, i, (g) => `<div class="ex-grp">${g}</div>`)}<div class="ex-item${picked.has(n.id) ? ' sel' : ''}" data-id="${n.id}" ${n.type === 'folder' && !inRecycle ? `data-drop="folder:${n.id}"` : ''}>
          ${boxes ? '<span class="ei-chk" title="Seç"></span>' : ''}<span class="ei-img">${big3 && thumb(n) ? `<img class="ei-thumb" src="${thumb(n)}" alt="" draggable="false">` : nodeIcon(n)}</span>
          <span class="ei-txt">${itemName(n)}
          ${m === 'tiles' ? `<small class="ei-loc">${esc(typeName(n))}</small>${n.type === 'folder' ? '' : `<small class="ei-loc">${fmtSize(fs.sizeOf(n))}</small>`}` : ''}
          ${query ? `<small class="ei-loc">${esc(fs.label(n.parent))}</small>` : ''}
          ${inRecycle && n.deletedFrom ? `<small class="ei-loc">Eski yeri: ${esc(fs.label(n.deletedFrom))}</small>` : ''}</span></div>`).join('');
    }
    chrome();
    if (renaming) bindRename();
  }

  // Sol gezinti bölmesi
  function drawNav() {
    const row = (id, l, o = {}) => `<div class="gx-nrow${o.sub ? ' gx-sub' : ''}">${o.exp ? `<button type="button" class="gx-nx" data-nexp="1" title="${pcOpen ? 'Daralt' : 'Genişlet'}" aria-label="${pcOpen ? 'Daralt' : 'Genişlet'}">${pcOpen ? I.chevD : I.chevR}</button>` : '<i class="gx-nx"></i>'}<button type="button" data-go="${id}" ${o.drop ? `data-drop="folder:${id}"` : ''} class="gx-n${id === cur ? ' on' : ''}" title="${esc(l)}"><span class="gx-ni">${nav16(o.k || idKind(id))}</span><span class="gx-nl">${esc(l)}</span>${o.pin ? `<span class="gx-pin" title="Hızlı erişime sabitlendi">${I.pin}</span>` : ''}</button></div>`;
    const pinned = ['desktop', 'downloads', 'docs', 'pictures', 'music', 'videos'];
    $('.ex-nav').innerHTML = row('home', 'Giriş') + row('gallery', 'Galeri')
      + `<div class="gx-nrow"><i class="gx-nx"></i><button type="button" data-cmd="onedrive" class="gx-n"><span class="gx-ni">${nav16('cloud')}</span><span class="gx-nl">OneDrive</span></button></div>`
      + '<hr>' + pinned.map((id) => row(id, label(id), { pin: true, drop: id !== 'videos' })).join('') + '<hr>'
      + row('pc', 'Bu Bilgisayar', { exp: true })
      + (pcOpen ? row('c', 'Yerel Disk (C:)', { sub: true }) + (fs.usb ? row(USB, 'USB Bellek (E:)', { sub: true, drop: true }) : '') + (fs.phone ? row(PHONE, 'Telefonum', { sub: true, drop: true }) : '') : '')
      + row('net', 'Ağ') + '<hr>' + row(RECYCLE, 'Geri Dönüşüm Kutusu', { drop: true });
  }

  // ---- Komut çubuğu ve durum satırı (seçim değişince yalnızca bunlar yenilenir)
  function chrome() { keepFocus(drawChrome); }

  function cmdDefs() {
    const inRecycle = cur === RECYCLE;
    const s = sel && fs.get(sel);
    const many = picked.size > 1;
    const sp = isSpecial(cur);
    const d = [];
    const sortView = [{ k: 'sort', pop: 'sort', ic: I.sort, t: 'Sırala' }, { k: 'viewp', pop: 'view', ic: I.view, t: 'Görüntüle' }];
    if (inRecycle) {
      d.push({ k: 'empty', ic: I.trash, t: 'Geri Dönüşüm Kutusunu boşalt', dis: !fs.children(RECYCLE).length, txt: 1 }, { k: 'restore', ic: I.restore, t: 'Seçili öğeleri geri yükle', dis: !s, txt: 1 }, { sep: 1 }, ...sortView);
      return d;
    }
    d.push({ k: 'cut', ic: I.cut, t: 'Kes', tip: 'Kes (Ctrl + X)', dis: !s }, { k: 'copy', ic: I.copy, t: 'Kopyala', tip: 'Kopyala (Ctrl + C)', dis: !s },
      { k: 'paste', ic: I.paste, t: 'Yapıştır', tip: 'Yapıştır (Ctrl + V)', dis: !(desk.fileClip && !sp) },
      { k: 'rename', ic: I.rename, t: 'Yeniden adlandır', tip: 'Yeniden adlandır (F2)', dis: !(s && !many) }, { k: 'share', ic: I.share, t: 'Paylaş', tip: 'Paylaş', dis: !s },
      { k: 'delete', ic: I.trash, t: 'Sil', tip: 'Sil (Delete)', dis: !s }, { sep: 1 }, ...sortView, { k: 'filter', pop: 'filter', ic: I.filter, t: 'Filtre', on: !!filt });
    // Bağlama özgü düğmeler (Çıkar, içeri aktar, Tümünü ayıkla) başta durur: dar pencerede en son gizlenir
    const lead = [];
    if (hasInUsb()) lead.push({ k: 'eject', ic: I.eject, t: 'Çıkar', txt: 1 });
    if (hasInPhone()) lead.push({ k: 'import', ic: I.import, t: 'Fotoğrafları içeri aktar', txt: 1 });
    if (s && !many && /\.zip$/i.test(s.name)) lead.push({ k: 'extract', ic: I.zip, t: 'Tümünü ayıkla', txt: 1, hl: 1 });
    if (lead.length) return [...lead, { sep: 1 }, ...d];
    return d;
  }

  function drawChrome() {
    curDefs = cmdDefs();
    const isNew = cur !== RECYCLE;
    const btn = (c) => {
      if (c.sep) return '<span class="sep gx-sp"></span>';
      const a = c.pop ? `data-pop="${c.pop}"` : `data-cmd="${c.k}"`;
      return `<button type="button" class="gx-c${c.txt || c.pop ? ' gx-t' : ''}${c.on ? ' on' : ''}${c.hl ? ' ex-hl' : ''}" ${a} data-k="${c.k || ''}" ${c.dis ? 'disabled' : ''} title="${esc(c.tip || c.t)}" aria-label="${esc(c.t)}">${c.ic}${c.txt || c.pop ? `<span>${c.t}</span>` : ''}${c.pop ? I.chevD : ''}</button>`;
    };
    $('.ex-cmd').innerHTML = (isNew ? `<button type="button" class="gx-new" data-pop="new" ${isSpecial(cur) ? 'disabled' : ''} title="Yeni öğe oluştur" aria-label="Yeni"><span class="gx-plus">${I.plus}</span><span>Yeni</span>${I.chevD}</button><span class="sep gx-sp"></span>` : '')
      + curDefs.map(btn).join('')
      + `<button type="button" class="gx-more" data-pop="more" title="Diğer seçenekleri göster" aria-label="Diğer seçenekleri göster">${I.more}</button>`;
    fitCmd();
    const files = [...picked].map((id) => fs.get(id)).filter((n) => n && n.type === 'file');
    const total = items().length + (isSpecial(cur) && !query && cur !== 'home' ? (cur === 'pc' ? 6 + 1 + (fs.usb ? 1 : 0) + (fs.phone ? 1 : 0) : cur === 'c' ? 6 : 0) : 0);
    const mode = viewMode();
    $('.ex-status').innerHTML = `<span>${total} öğe</span>${picked.size ? `<span class="gx-sb">|</span><span>${picked.size} öğe seçildi${files.length ? ` &nbsp;${fmtSize(files.reduce((t, n) => t + fs.sizeOf(n), 0))}` : ''}</span>` : ''}
      <span class="ex-right"><button type="button" data-cmd="view:details" class="${mode === 'details' ? 'on' : ''}" title="Ayrıntılar" aria-label="Ayrıntılar">${I.details}</button><button type="button" data-cmd="view:lg" class="${mode === 'lg' ? 'on' : ''}" title="Büyük simgeler" aria-label="Büyük simgeler">${I.view}</button></span>`;
  }

  // Dar pencerede sağdaki komutlar gizlenir; ⋯ menüsünde görünür (gerçek Dosya Gezgini gibi)
  function fitCmd() {
    const bar = $('.ex-cmd');
    if (!bar) return;
    const cs = [...bar.querySelectorAll('.gx-c')], sp = [...bar.querySelectorAll('.gx-sp')];
    cs.forEach((c) => { c.hidden = false; });
    sp.forEach((c) => { c.hidden = false; });
    if (!bar.clientWidth) return;
    for (let i = cs.length - 1; i >= 0 && bar.scrollWidth > bar.clientWidth + 1; i--) cs[i].hidden = true;
    // Boşta kalan ayraçları da sakla (başta, art arda ya da sonda)
    let prev = null;
    for (const el of [...bar.children]) {
      if (el.hidden || el.classList.contains('gx-more')) continue;
      if (el.classList.contains('gx-sp')) { if (!prev || prev.classList.contains('gx-sp')) el.hidden = true; else prev = el; } else prev = el;
    }
    if (prev?.classList.contains('gx-sp')) prev.hidden = true;
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { fitCmd(); const ad = $('.ex-addr'); if (ad && !editAddr) ad.scrollLeft = 1e5; }).observe($('.ex-cmd'));

  function bindRename() {
    const inp = $('.ei-rename');
    if (!inp) return;
    const node = fs.get(renaming);
    const extension = hiddenExtension(node);
    inp.focus();
    const dot = node.type === 'file' ? node.name.lastIndexOf('.') : -1;
    inp.setSelectionRange(0, dot > 0 ? dot : node.name.length);
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      const id = renaming;
      renaming = null;
      const base = inp.value.trim();
      const v = base + extension;
      const old = node.name;
      if (save && base && v !== old) {
        const err = fs.rename(id, v);
        if (err) { desk.toast('Ad değiştirilemedi', esc(err), iconFor('warn')); render(); }
        else emit('rename', { id, name: v, old });
      } else render();
      body.focus({ preventScroll: true });
    };
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') finish(false);
    });
    inp.addEventListener('blur', () => finish(true));
    inp.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  // ---- Adres çubuğu: boş yerine tıklayınca yazılabilir olur
  const pathText = () => (cur === 'home' ? 'Giriş' : cur === RECYCLE ? 'Geri Dönüşüm Kutusu' : cur === 'pc' ? 'Bu Bilgisayar' : cur === 'gallery' || cur === 'net' ? label(cur) : cur === 'c' || cur === 'videos' ? `Bu Bilgisayar\\${label(cur)}` : pathNames(cur).join('\\'));
  function startAddr() {
    if (editAddr) return;
    editAddr = true;
    const a = $('.ex-addr');
    a.innerHTML = `<span class="gx-ai">${nav16(idKind(cur))}</span><input class="gx-addrin" value="${esc(pathText())}" spellcheck="false" aria-label="Adres">`;
    const inp = a.querySelector('input');
    inp.focus(); inp.select();
    let done = false;
    const end = (ok) => {
      if (done) return;
      done = true;
      editAddr = false;
      const v = inp.value;
      if (ok && v.trim() && v.trim() !== pathText()) { if (!goPath(v)) { render(); return; } } else render();
      body.focus({ preventScroll: true });
    };
    inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); end(true); } if (e.key === 'Escape') end(false); });
    inp.addEventListener('blur', () => end(false));
    emit('ex-address', { edit: true });
  }
  // Yazılan yolu çözer: "Bu Bilgisayar\Belgeler\Faturalar", "C:\Belgeler" gibi
  function goPath(text) {
    const parts = text.split(/[\\/›>]+/).map((x) => x.trim()).filter(Boolean);
    const low = (x) => x.toLocaleLowerCase('tr');
    while (parts.length > 1 && (low(parts[0]) === 'bu bilgisayar' || low(parts[0]) === 'c:' || low(parts[0]) === 'yerel disk (c:)')) parts.shift();
    let id = null;
    if (parts.length === 1 && SPECIAL_NAMES[low(parts[0])]) id = SPECIAL_NAMES[low(parts[0])];
    else {
      let node = null;
      for (const p of parts) {
        const pool = node ? fs.children(node.id) : [...ROOTS.map((r) => fs.get(r[0])), fs.get(RECYCLE), fs.get(USB), fs.get(PHONE)].filter(Boolean);
        node = pool.find((n) => low(n.name) === low(p) || (!node && /^e:?$/i.test(p) && n.id === USB));
        if (!node) break;
      }
      if (node) id = node.id;
    }
    if (!id) {
      desk.dialogs.ask({ title: 'Dosya Gezgini', icon: iconFor('info'), text: `Windows “${esc(text.trim())}” öğesini bulamıyor. Adı doğru yazdığınızdan emin olun ve yeniden deneyin.`, buttons: [['ok', 'Tamam', true]] });
      emit('ex-address', { path: text, found: false });
      return false;
    }
    emit('ex-address', { path: text, found: true });
    go(id);
    body.focus({ preventScroll: true });
    return true;
  }

  // how: 'set' (tek tık), 'toggle' (Ctrl + tık, onay kutusu), 'range' (Shift + tık), 'all' (Ctrl + A)
  const select = (id, how = 'set') => {
    if (!id) { picked.clear(); sel = anchor = null; }
    else if (how === 'toggle') {
      if (picked.has(id)) { picked.delete(id); sel = [...picked].at(-1) || null; } else { picked.add(id); sel = id; }
      anchor = id;
    } else if (how === 'range' && anchor) {
      const ids = items().map((n) => n.id), a = ids.indexOf(anchor), b = ids.indexOf(id);
      picked.clear();
      if (a < 0) picked.add(id); else ids.slice(Math.min(a, b), Math.max(a, b) + 1).forEach((x) => picked.add(x));
      sel = id;
    } else if (how === 'all') { picked.clear(); items().forEach((n) => picked.add(n.id)); sel = anchor = [...picked][0] || null; }
    else { picked.clear(); picked.add(id); sel = anchor = id; }
    paintSel();
    chrome();
    if (sel || how !== 'set') emit('ex-select', { id: sel, name: fs.get(sel)?.name, how, count: picked.size, names: [...picked].map((x) => fs.get(x)?.name) });
  };
  const paintSel = () => body.querySelectorAll('.ex-item').forEach((el) => el.classList.toggle('sel', picked.has(el.dataset.id)));
  const chosen = () => [...picked].filter((x) => fs.get(x));

  // Boş yerden basılı tutup sürükleyince çerçeve çizilir; içine giren öğeler seçilir (Ctrl basılıysa öncekilere eklenir)
  function band(e) {
    const v = $('.ex-view'), sx = e.clientX, sy = e.clientY, base = e.ctrlKey || e.metaKey ? new Set(picked) : new Set();
    let el = null;
    const move = (ev) => {
      if (!el) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
        el = document.createElement('div');
        el.className = 'ex-band';
        v.append(el);
      }
      const r = v.getBoundingClientRect();
      const x1 = Math.min(sx, ev.clientX), x2 = Math.max(sx, ev.clientX), y1 = Math.min(sy, ev.clientY), y2 = Math.max(sy, ev.clientY);
      Object.assign(el.style, { left: x1 - r.left + v.scrollLeft + 'px', top: y1 - r.top + v.scrollTop + 'px', width: x2 - x1 + 'px', height: y2 - y1 + 'px' });
      picked.clear();
      base.forEach((x) => picked.add(x));
      body.querySelectorAll('.ex-item').forEach((it) => {
        const b = it.getBoundingClientRect();
        if (b.right > x1 && b.left < x2 && b.bottom > y1 && b.top < y2) picked.add(it.dataset.id);
      });
      paintSel();
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (!el) return;
      el.remove();
      sel = anchor = [...picked].at(-1) || null;
      chrome();
      emit('ex-select', { id: sel, name: fs.get(sel)?.name, how: 'band', count: picked.size, names: [...picked].map((x) => fs.get(x)?.name) });
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  function open(id) {
    const n = fs.get(id);
    if (!n) return;
    emit('ex-open', { id, name: n.name, type: n.type });
    if (cur === RECYCLE) { desk.toast('Geri Dönüşüm Kutusu', 'Silinen bir dosyayı açmak için önce <b>Geri yükle</b>yin.', I.restore); return; }
    if (n.type === 'folder') go(id);
    else desk.openNode(n);
  }

  // ---- Menüler (desk.menu ile; Windows 11 görünümü için gx-ctx sınıfı eklenir)
  const mi = (ic, text, o = {}) => ({ label: `<span class="gx-mi">${ic || '<i class="gx-mb"></i>'}${text}</span>`, ...o });
  const ck = (on) => (on ? I.check : '');
  function pop(x, y, list, pick, kind, info) {
    desk.menu(x, y, list, pick, kind, info);
    const m = [...desk.screen.querySelectorAll('.dk-ctx')].pop();
    m?.classList.add('gx-ctx');
    return m;
  }
  let lastPop = null, popWas = null;
  body.addEventListener('pointerdown', (e) => { const b = e.target.closest('[data-pop]'); popWas = b && lastPop === b && desk.screen.querySelector('.dk-ctx') ? b : null; }, true);

  const popItems = (k, flat) => {
    const sp = isSpecial(cur) || cur === RECYCLE;
    if (k === 'new') return [{ cmd: 'newFolder', ...mi(I.folderN, 'Klasör'), key: 'Ctrl+Shift+N', disabled: sp }, { cmd: 'newText', ...mi(I.newText, 'Metin Belgesi'), disabled: sp }];
    if (k === 'sort') return [...SORTS.map(([c, l]) => ({ cmd: 'sort:' + c, ...mi(sortBy === c ? I.dot : '', l) })), '-', { cmd: 'dir:asc', ...mi(!sortDesc ? I.dot : '', 'Artan') }, { cmd: 'dir:desc', ...mi(sortDesc ? I.dot : '', 'Azalan') }];
    if (k === 'view') {
      const m = viewMode();
      const show = [{ cmd: 'boxes', ...mi(ck(boxes), 'Öğe onay kutuları') }, { cmd: 'extensions', ...mi(ck(showExtensions), 'Dosya adı uzantıları') }];
      return [...VIEWS.map(([c, l]) => ({ cmd: 'view:' + c, ...mi(m === c ? I.dot : '', l) })), '-',
        ...(flat ? show : [{ cmd: 'show', ...mi('', 'Göster'), sub: show }])];
    }
    if (k === 'filter') return [...FILTERS.map(([c, l]) => ({ cmd: 'filter:' + c, ...mi(filt === c ? I.dot : '', l) })), '-', { cmd: 'filter:', ...mi('', 'Filtreyi temizle'), disabled: !filt }];
    return [];
  };
  function moreItems() {
    const out = [];
    const sp = isSpecial(cur);
    const hid = [...body.querySelectorAll('.ex-cmd .gx-c[hidden]')].map((b) => curDefs.find((c) => c.k === b.dataset.k)).filter(Boolean);
    const sel1 = sel && fs.get(sel);
    out.push({ cmd: 'selectAll', ...mi('', 'Tümünü seç'), key: 'Ctrl+A', disabled: sp || cur === RECYCLE && !items().length }, { cmd: 'selectNone', ...mi('', 'Hiçbirini seçme'), disabled: !picked.size }, { cmd: 'invert', ...mi('', 'Seçimi ters çevir'), disabled: sp });
    if (hid.length) {
      out.push('-');
      for (const c of hid) out.push(c.pop ? { cmd: 'sub:' + c.pop, ...mi(c.ic, c.t), sub: popItems(c.pop, true) } : { cmd: c.k, ...mi(c.ic, c.t), disabled: c.dis });
    }
    if (!sp && cur !== RECYCLE) out.push('-', { cmd: 'compress', ...mi(I.zip, 'ZIP dosyasına sıkıştır'), disabled: !sel1 });
    out.push('-', { cmd: 'props', ...mi(I.info, 'Özellikler'), key: 'Alt+Enter', disabled: !sel1 && sp }, { cmd: 'options', ...mi('', 'Seçenekler') });
    return out;
  }
  const openWith = (n) => {
    const nm = n.name.toLowerCase();
    if (/\.(txt|html?)$/.test(nm)) return [['notepad', 'Not Defteri']];
    if (nm.endsWith('.docx')) return [['word', 'Word']];
    if (nm.endsWith('.xlsx')) return [['sheet', 'Excel']];
    if (nm.endsWith('.pptx')) return [['slides', 'PowerPoint']];
    if (/\.(jpe?g|png|bmp)$/.test(nm)) return [['photos', 'Fotoğraflar'], ['paint', 'Paint']];
    if (/\.mp4$/.test(nm)) return [['photos', 'Fotoğraflar']];
    if (/\.(mp3|m4a|wav)$/.test(nm)) return [['music', 'Medya Oynatıcı']];
    if (nm.endsWith('.pdf')) return [['pdf', 'PDF Okuyucu']];
    return [];
  };
  const rowIcons = (many, recycle) => {
    const r = [['cut', 'Kes', I.cut, false], ['copy', 'Kopyala', I.copy, false], ['rename', 'Yeniden adlandır', I.rename, many || recycle], ['share', 'Paylaş', I.share, false], ['delete', 'Sil', I.trash, false]];
    return { cmd: 'row', label: `<span class="gx-row">${r.map(([c, t, ic, dis]) => `<span class="gx-rb${dis ? ' dis' : ''}" ${dis ? '' : `data-cmd="${c}"`} title="${t}" role="button" aria-label="${t}">${ic}</span>`).join('')}</span>` };
  };
  function ctxItem(id, classic) {
    const n = fs.get(id);
    const many = picked.size > 1;
    const isZip = /\.zip$/i.test(n.name || '');
    const wp = /\.(png|jpe?g)$/i.test(n.name || '');
    const loc = cur === 'home' || query || cur === 'gallery' || cur === 'videos';
    if (cur === RECYCLE) return [{ cmd: 'restore', ...mi(I.restore, 'Geri yükle'), bold: true }, '-', { cmd: 'delete', ...mi(I.trash, 'Kalıcı olarak sil') }, { cmd: 'props', ...mi(I.info, 'Özellikler') }];
    const ow = n.type === 'file' ? openWith(n) : [];
    if (!classic) {
      return [rowIcons(many, false), '-', { cmd: 'open', ...mi(I.open, 'Aç'), bold: true, key: 'Enter' }, ...(loc ? [{ cmd: 'location', ...mi(I.folderN, 'Dosya konumunu aç') }] : []),
        ...(ow.length ? [{ cmd: 'ow', ...mi('', 'Birlikte aç'), sub: ow.map(([a, l]) => ({ cmd: 'ow:' + a, ...mi('', l) })) }] : []),
        ...(wp ? [{ cmd: 'wallpaper', ...mi(I.wallpaper, 'Masaüstü arka planı olarak ayarla') }] : []),
        isZip ? { cmd: 'extract', ...mi(I.zip, 'Tümünü ayıkla…'), bold: true } : { cmd: 'compress', ...mi(I.zip, 'ZIP dosyasına sıkıştır') },
        { cmd: 'copypath', ...mi(I.path, 'Yol olarak kopyala'), key: 'Ctrl+Shift+C' }, { cmd: 'props', ...mi(I.info, 'Özellikler'), key: 'Alt+Enter' }, '-',
        { cmd: 'classic', ...mi(I.more, 'Diğer seçenekleri göster'), key: 'Shift+F10' }];
    }
    return [{ cmd: 'open', label: 'Aç', bold: true }, ...(loc ? [{ cmd: 'location', label: 'Dosya konumunu aç' }] : []),
      ...(ow.length ? [{ cmd: 'ow', label: 'Birlikte aç', sub: ow.map(([a, l]) => ({ cmd: 'ow:' + a, label: l })) }] : []), '-',
      { cmd: 'cut', label: 'Kes', key: 'Ctrl+X' }, { cmd: 'copy', label: 'Kopyala', key: 'Ctrl+C' }, '-',
      { cmd: 'rename', label: 'Yeniden adlandır', key: 'F2', disabled: many }, { cmd: 'delete', label: 'Sil', key: 'Del' }, '-',
      { cmd: 'send', label: 'Gönder', sub: [{ cmd: 'shortcut', label: 'Masaüstü (kısayol oluştur)' }, { cmd: 'compress', label: 'Sıkıştırılmış (zip) klasör' }, { cmd: 'share', label: 'Paylaş…' }] },
      ...(isZip ? [{ cmd: 'extract', label: 'Tümünü ayıkla…', bold: true }] : []),
      ...(wp ? [{ cmd: 'wallpaper', label: 'Masaüstü arka planı olarak ayarla' }] : []),
      { cmd: 'props', label: 'Özellikler' }];
  }
  function showCtx(x, y, id, classic) {
    const m = pop(x, y, ctxItem(id, classic), (c) => (c === 'classic' ? showCtx(x, y, id, true) : cmd(c, id)), 'explorer-item', { id, name: fs.get(id)?.name });
    const row = m?.querySelector('.gx-row');
    if (row) { const b = row.closest('button'); b.classList.add('gx-rowbtn'); b.addEventListener('click', (ev) => { if (!ev.target.closest('.gx-rb[data-cmd]')) ev.stopPropagation(); }); }
  }
  function showBg(x, y) {
    const sp = isSpecial(cur) || cur === RECYCLE;
    const dis = sp;
    pop(x, y, [
      { cmd: 'v', ...mi(I.view, 'Görünüm'), sub: VIEWS.map(([c, l]) => ({ cmd: 'view:' + c, ...mi(viewMode() === c ? I.dot : '', l) })) },
      { cmd: 's', ...mi(I.sort, 'Sıralama ölçütü'), sub: popItems('sort') },
      { cmd: 'refresh', ...mi(I.refresh, 'Yenile') }, '-',
      { cmd: 'paste', ...mi(I.paste, 'Yapıştır'), key: 'Ctrl+V', disabled: !desk.fileClip || dis },
      { cmd: 'new', ...mi(I.plus, 'Yeni'), sub: popItems('new') }, '-',
      { cmd: 'props', ...mi(I.info, 'Özellikler') },
    ], (c) => cmd(c), 'explorer');
  }

  function cmd(c, id = sel) {
    const n = id && fs.get(id);
    if (c.startsWith('view:')) { userMode = c.slice(5); emit('ex-view', { mode: userMode }); return render(); }
    if (c.startsWith('sort:')) { sortBy = c.slice(5); sortDesc = sortBy === 'date' || sortBy === 'size'; emit('ex-sort', { by: sortBy, desc: sortDesc }); return render(); }
    if (c.startsWith('dir:')) { sortDesc = c === 'dir:desc'; emit('ex-sort', { by: sortBy, desc: sortDesc }); return render(); }
    if (c.startsWith('filter:')) { filt = c.slice(7) || null; sel = anchor = null; picked.clear(); emit('ex-filter', { kind: filt }); return render(); }
    if (c.startsWith('ow:')) { if (n) { emit('ex-openwith', { app: c.slice(3), name: n.name }); desk.touchRecent?.(n.id); desk.open(c.slice(3), { node: n.id }); } return; }
    if (c.startsWith('go:')) return go(c.slice(3));
    switch (c) {
      case 'newFolder': {
        if (isSpecial(cur) || cur === RECYCLE) return;
        const f = fs.create(cur, { type: 'folder', name: 'Yeni klasör' });
        emit('new-folder', { id: f.id, in: cur });
        sel = f.id; renaming = f.id;
        return render();
      }
      case 'newText': {
        if (isSpecial(cur) || cur === RECYCLE) return;
        const f = fs.create(cur, { type: 'file', name: 'Yeni Metin Belgesi.txt', content: '' });
        sel = f.id; renaming = f.id;
        return render();
      }
      case 'cut': case 'copy': {
        if (!n) return;
        const ids = picked.has(id) && picked.size > 1 ? chosen() : [id];
        desk.fileClip = { op: c, id: ids[0], ids };
        emit('file-clip', { op: c, id: ids[0], name: fs.get(ids[0]).name, count: ids.length, names: ids.map((x) => fs.get(x).name) });
        desk.toast(c === 'cut' ? 'Kesildi' : 'Kopyalandı', `${ids.length > 1 ? `<b>${ids.length} öğe</b>` : `“${esc(n.name)}”`} panoya alındı. Şimdi gideceği klasörü açıp <b>Yapıştır</b>'a basın.`, iconFor('clipboard'), 4000);
        return render();
      }
      case 'paste': if (!isSpecial(cur)) { desk.pasteFile(cur); select(null); render(); } return;
      case 'rename': if (n && cur !== RECYCLE) { renaming = id; render(); emit('rename-start', { id, name: n.name }); } return;
      case 'delete': if (n) { (picked.has(id) ? chosen() : [id]).forEach((x) => desk.deleteNode(x)); select(null); render(); } return;
      case 'restore': if (n) { for (const x of picked.has(id) ? chosen() : [id]) { const m = fs.get(x); fs.restore(x); emit('restore', { id: x, name: m.name, to: fs.label(fs.get(x).parent) }); } select(null); render(); } return;
      case 'selectAll': select(items()[0]?.id, 'all'); return;
      case 'selectNone': select(null); return;
      case 'invert': {
        const all = items().map((x) => x.id), keep = all.filter((x) => !picked.has(x));
        picked.clear(); keep.forEach((x) => picked.add(x));
        sel = anchor = keep.at(-1) || null;
        paintSel(); chrome();
        emit('ex-select', { id: sel, name: fs.get(sel)?.name, how: 'invert', count: picked.size, names: keep.map((x) => fs.get(x)?.name) });
        return;
      }
      case 'boxes': boxes = desk.settings.exBoxes = !boxes; emit('ex-checkboxes', { on: boxes }); return render();
      case 'extensions': return desk.setSetting('exExtensions', !showExtensions);
      case 'empty': desk.emptyRecycle(); return;
      case 'eject': desk.ejectUsb(); return;
      case 'import': desk.importPhotos(); return;
      case 'refresh': emit('ex-refresh', { folder: cur }); return render();
      case 'onedrive': desk.open('bulut'); return;
      case 'share': {
        if (!n) return;
        return desk.dialogs.ask({ title: 'Paylaş', icon: I.share, text: `${picked.size > 1 ? `<b>${picked.size} öğe</b>yi` : `<b>${esc(n.name)}</b> ${n.type === 'folder' ? 'klasörünü' : 'dosyasını'}`} nasıl paylaşmak istersiniz?<br><br>Gerçek bilgisayarda burada E-posta, Yakındaki Paylaşım ve Bluetooth gibi seçenekler görünür. Bu benzetimde e-posta ile paylaşabilirsiniz.`, buttons: [['mail', 'E-posta', true], ['no', 'Vazgeç']] })
          .then((a) => { emit('ex-share', { name: n.name, answer: a }); if (a === 'mail') desk.open('mail'); });
      }
      case 'copypath': if (n) { const p = `Bu Bilgisayar\\${[...fs.path(n.id)].map((x) => x.name).join('\\')}`; navigator.clipboard?.writeText?.(p).catch(() => {}); desk.toast('Yol kopyalandı', esc(p), iconFor('clipboard'), 3500); emit('ex-copypath', { name: n.name }); } return;
      case 'options': return desk.dialogs.ask({ title: 'Klasör Seçenekleri', icon: iconFor('info'), text: 'Gerçek bilgisayarda burada Dosya Gezgini\'nin davranışını ayarlarsınız: dosyaları tek tıkla açmak, gizli dosyaları göstermek, dosya uzantılarını göstermek gibi.', buttons: [['ok', 'Tamam', true]] });
      case 'compress': {
        if (!n || isSpecial(cur)) return;
        const ids = picked.has(id) ? chosen() : [id];
        const before = ids.reduce((t, x) => t + fs.sizeOf(fs.get(x)), 0);
        const z = fs.compress(ids, cur, fs.uniqueName(cur, n.name.replace(/\.[^.]+$/, '') + '.zip'));
        select(z.id);
        render();
        desk.toast('Sıkıştırıldı', `${ids.length > 1 ? `${ids.length} öğe` : `“${esc(n.name)}”`} → <b>${esc(z.name)}</b> (${fmtSize(before)} → ${fmtSize(fs.sizeOf(z))})`, SYS_ICONS['folder-zip'], 5000);
        emit('zip-make', { name: z.name, from: n.name, count: ids.length });
        return;
      }
      case 'extract': return desk.extractZip(n);
      case 'shortcut': {
        if (!n || n.type === 'link') return;
        const l = fs.create('desktop', { type: 'link', name: `${n.name} - Kısayol`, target: n.id, icon: nodeIcon(n) });
        desk.toast('Kısayol oluşturuldu', `Masaüstünde <b>${esc(l.name)}</b> var. Asıl ${n.type === 'folder' ? 'klasör' : 'dosya'} yerinde duruyor.`, iconFor('ok'), 4000);
        emit('shortcut', { name: l.name, target: n.name, folder: n.type === 'folder' });
        return;
      }
      case 'wallpaper': if (n) { desk.settings.customWall = pictureURL(n.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: n.name, custom: true }); } return;
      case 'open': return open(id);
      case 'location': if (n) { go(n.parent); select(id); emit('ex-location', { id, name: n.name, folder: n.parent, path: fs.path(n.parent).map((x) => x.name).join(' › ') }); } return;
      case 'props': {
        const t = n || (!isSpecial(cur) && fs.get(cur));
        if (!t) return;
        emit('ex-properties', { id: t.id, name: t.name });
        return desk.dialogs.ask({ title: `${t.name} Özellikleri`, icon: nodeIcon(t), text: `<b>${esc(t.name)}</b><br>Tür: ${esc(typeName(t))}<br>Konum: ${esc(fs.path(t.parent).map((x) => x.name).join(' › '))}<br>Boyut: ${fmtSize(fs.sizeOf(t))}<br>Değiştirme tarihi: ${fmtDate(t.mtime)}`, buttons: [['ok', 'Tamam', true]] });
      }
    }
  }

  // Açılır düğmeler (Yeni, Sırala, Görüntüle, Filtre, ⋯) ve kırıntıların ›'ı
  function popFor(btn) {
    const r = btn.getBoundingClientRect();
    const k = btn.dataset.pop;
    lastPop = btn;
    if (k === 'more') return pop(r.left, r.bottom + 2, moreItems(), (c) => { emit('ex-cmd', { cmd: c }); cmd(c); }, 'explorer-pop', { name: k });
    pop(r.left, r.bottom + 2, popItems(k), (c) => { emit('ex-cmd', { cmd: c }); cmd(c); }, 'explorer-pop', { name: k });
  }
  function chevFor(btn) {
    const r = btn.getBoundingClientRect();
    const id = btn.dataset.chev;
    let list;
    if (id === 'pc') list = [...['desktop', 'docs', 'downloads', 'music', 'pictures'].map((x) => [x, label(x)]), ['videos', 'Videolar'], ['c', 'Yerel Disk (C:)'], ...(fs.usb ? [[USB, label(USB)]] : []), ...(fs.phone ? [[PHONE, label(PHONE)]] : []), [RECYCLE, 'Geri Dönüşüm Kutusu']];
    else if (isSpecial(id) || id === RECYCLE) list = id === 'c' ? ['desktop', 'docs', 'downloads', 'music', 'pictures'].map((x) => [x, label(x)]) : [];
    else list = fs.children(id).filter((n) => n.type === 'folder').map((n) => [n.id, n.name]);
    lastPop = btn;
    pop(r.left, r.bottom + 2, list.length ? list.map(([x, l]) => ({ cmd: 'go:' + x, ...mi(nav16(idKind(x)), esc(l)) })) : [{ cmd: 'none', ...mi('', 'Alt klasör yok'), disabled: true }], (c) => cmd(c), 'explorer-chev', { id });
  }

  body.addEventListener('click', (e) => {
    const pp = e.target.closest('[data-pop]');
    if (pp && !pp.disabled) { if (popWas === pp) { popWas = null; lastPop = null; return; } popFor(pp); return; }
    const cv = e.target.closest('[data-chev]');
    if (cv) { if (popWas === cv) { popWas = null; lastPop = null; return; } chevFor(cv); return; }
    const tx = e.target.closest('[data-tabx]');
    if (tx) { closeTab(+tx.dataset.tabx); return; }
    const tb = e.target.closest('[data-tab]');
    if (tb) { if (+tb.dataset.tab !== ti) { saveTab(); loadTab(+tb.dataset.tab); } return; }
    if (e.target.closest('[data-newtab]')) { newTab(); return; }
    const g = e.target.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }
    if (e.target.closest('[data-nexp]')) { pcOpen = !pcOpen; drawNav(); return; }
    const gh = e.target.closest('[data-grp]');
    if (gh) { grpShut[gh.dataset.grp] = !grpShut[gh.dataset.grp]; render(); return; }
    const c = e.target.closest('[data-cmd]');
    if (c && !c.disabled) { emit('ex-cmd', { cmd: c.dataset.cmd }); cmd(c.dataset.cmd); return; }
    const ad = e.target.closest('.ex-addr');
    if (ad && !editAddr && !e.target.closest('button')) startAddr();
  });
  // Pencerenin başlık çubuğundaki sekmeler de aynı dinleyiciyi kullanır
  strip?.addEventListener('click', (e) => {
    const tx = e.target.closest('[data-tabx]');
    if (tx) { closeTab(+tx.dataset.tabx); return; }
    const tb = e.target.closest('[data-tab]');
    if (tb) { if (+tb.dataset.tab !== ti) { saveTab(); loadTab(+tb.dataset.tab); } return; }
    if (e.target.closest('[data-newtab]')) newTab();
  });
  $('.ex-back').onclick = () => { if (back.length) { fwd.push(cur); go(back.pop(), false); } };
  $('.ex-fwd').onclick = () => { if (fwd.length) { back.push(cur); go(fwd.pop(), false); } };
  $('.ex-up').onclick = () => {
    if (cur === 'pc' || cur === 'home') return;
    const p = fs.get(cur)?.parent;
    go(p || 'pc');
  };
  body.addEventListener('click', (e) => {
    const h = e.target.closest('[data-sort]');
    if (!h) return;
    if (sortBy === h.dataset.sort) sortDesc = !sortDesc; else { sortBy = h.dataset.sort; sortDesc = false; }
    render();
    emit('ex-sort', { by: sortBy, desc: sortDesc });
  });
  $('.ex-search').addEventListener('input', (e) => {
    query = e.target.value.trim();
    sel = anchor = null;
    picked.clear();
    render();
    emit('ex-search', { text: query, results: items().map((n) => n.name) });
  });

  const view = $('.ex-view');
  let single = null; // birden çok seçiliyken seçili bir öğeye tıklanıp sürüklenmezse yalnızca o seçili kalır
  view.addEventListener('pointerdown', (e) => {
    const it = e.target.closest('.ex-item');
    if (e.target.closest('.ei-rename')) return;
    if (!it) {
      if (e.button !== 0) return;
      if (!(e.ctrlKey || e.metaKey)) select(null);
      if (!isSpecial(cur)) { e.preventDefault(); body.focus({ preventScroll: true }); band(e); }
      return;
    }
    const id = it.dataset.id;
    single = null;
    if (e.button === 2) { if (!picked.has(id)) select(id); return; }
    if (e.target.closest('.ei-chk')) { e.preventDefault(); select(id, 'toggle'); return; }
    if (e.shiftKey) { e.preventDefault(); body.focus({ preventScroll: true }); select(id, 'range'); }
    else if (e.ctrlKey || e.metaKey) { select(id, 'toggle'); if (!picked.has(id)) return; }
    else if (!picked.has(id)) select(id);
    else if (picked.size > 1) { sel = id; single = id; }
    const el = body.querySelector(`.ex-item[data-id="${id}"]`);
    if (e.button === 0 && cur !== RECYCLE) desk.dragStart(e, { kind: 'node', id, ids: picked.size > 1 ? chosen() : null, el, from: 'explorer' });
  });
  view.addEventListener('pointerup', () => { if (single && !desk.dragged) select(single); single = null; });
  view.addEventListener('dblclick', (e) => {
    const it = e.target.closest('.ex-item');
    if (it && !e.target.closest('.ei-rename')) open(it.dataset.id);
  });
  view.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const it = e.target.closest('.ex-item');
    if (it) {
      if (!picked.has(it.dataset.id)) select(it.dataset.id);
      showCtx(e.clientX, e.clientY, it.dataset.id, e.shiftKey && cur !== RECYCLE); // Shift + sağ tık: eski (tam) menü
      return;
    }
    if (isSpecial(cur) || cur === RECYCLE) return;
    select(null);
    showBg(e.clientX, e.clientY);
  });

  body.addEventListener('keydown', (e) => {
    if (e.target.closest('input')) return;
    const ctrl = e.ctrlKey || e.metaKey;
    if (e.key === 'Delete' && sel) { e.preventDefault(); cmd('delete'); }
    else if (e.key === 'F2' && sel) { e.preventDefault(); cmd('rename'); }
    else if (e.key === 'F5') { e.preventDefault(); cmd('refresh'); }
    else if (e.key === 'Enter' && e.altKey && (sel || !isSpecial(cur))) { e.preventDefault(); cmd('props'); }
    else if (e.key === 'Enter' && sel) { e.preventDefault(); open(sel); }
    else if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); $('.ex-back').click(); }
    else if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); $('.ex-fwd').click(); }
    else if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); $('.ex-up').click(); }
    else if (e.key === 'Backspace') { e.preventDefault(); $('.ex-back').click(); }
    else if (ctrl && e.code === 'KeyC' && e.shiftKey && sel) { e.preventDefault(); cmd('copypath'); }
    else if (ctrl && e.code === 'KeyC' && sel) { e.preventDefault(); cmd('copy'); }
    else if (ctrl && e.code === 'KeyX' && sel) { e.preventDefault(); cmd('cut'); }
    else if (ctrl && e.code === 'KeyV') { e.preventDefault(); cmd('paste'); }
    else if (ctrl && e.shiftKey && e.code === 'KeyN') { e.preventDefault(); cmd('newFolder'); }
    else if (ctrl && e.code === 'KeyA') { e.preventDefault(); cmd('selectAll'); }
    else if ((ctrl && (e.code === 'KeyF' || e.code === 'KeyE')) || e.key === 'F3') { e.preventDefault(); $('.ex-search').focus(); }
    else if ((ctrl && e.code === 'KeyL') || (e.altKey && e.code === 'KeyD')) { e.preventDefault(); startAddr(); }
    else if (e.shiftKey && e.key === 'F10' && sel) { e.preventDefault(); const r = body.querySelector(`.ex-item[data-id="${sel}"]`)?.getBoundingClientRect(); if (r) showCtx(r.left + 20, r.bottom - 6, sel, true); }
  });

  render();
  if (args.select && fs.get(args.select)) select(args.select);
  return {
    onFs: () => { if (!isSpecial(cur) && !fs.get(cur)) cur = 'pc'; if (sel && !fs.get(sel)) sel = null; if (picked.size) { const here = new Set(items().map((n) => n.id)); [...picked].forEach((x) => { if (!here.has(x)) picked.delete(x); }); } if (!renaming && !editAddr) render(); },
    onSettings: () => {
      const next = desk.settings.exExtensions !== false;
      if (next === showExtensions) return;
      showExtensions = next;
      if (!renaming && !editAddr) render();
    },
    onArgs: (a) => { if (a.folder) go(a.folder); if (a.select && fs.get(a.select)) select(a.select); },
    leaveUsb: () => { if (hasInUsb()) go('pc'); },
    leavePhone: () => { if (!isSpecial(cur) && (cur === PHONE || !fs.get(cur) || fs.isInside(cur, PHONE))) go('pc'); },
    focus: () => { if (!renaming && !editAddr && document.activeElement?.closest('.ex') !== body) body.focus({ preventScroll: true }); },
    get folder() { return cur; },
    get selected() { return sel; },
    get selection() { return chosen(); },
    get query() { return query; },
    go,
  };
}
