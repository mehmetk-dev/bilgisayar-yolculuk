// Kelime İşlemci: Word benzeri, sayfa görünümlü yazı programı.
// Giriş: biçimlendirme (kalın, italik, altı/üstü çizili, alt/üst simge, yazı tipi, boyut, renk, vurgu), büyük/küçük harf,
//   biçim boyacısı, biçimi temizle, hizalama, madde işaretleri, girinti, satır aralığı, stiller (başlıklar), bul/değiştir.
// Ekle: tablo, resim, tarih, sayfa sonu, bağlantı, simge, üst bilgi, alt bilgi, sayfa numarası.
// Düzen: kenar boşlukları, yönlendirme, sütunlar. Gözden Geçir: yazım denetimi, sözcük sayımı. Görünüm: yakınlaştırma, cetvel.
// .docx olarak kaydetme, açma, yazdırma ve PDF. İçerik bellekteki dosyada { html, header, footer, layout, pageNum } olarak durur.
import { esc, pictureURL, isImage } from './util.js';
import { SITES } from './sites.js';

const FONTS = [['Calibri', 'Calibri, Carlito, "Noto Sans", sans-serif'], ['Times New Roman', '"Times New Roman", Tinos, "Noto Serif", serif'], ['Arial', 'Arial, Arimo, "Liberation Sans", sans-serif'], ['Comic Sans MS', '"Comic Sans MS", "Comic Neue", cursive'], ['Courier New', '"Courier New", Cousine, monospace']];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48];
const COLORS = [['Siyah', '#000000'], ['Kırmızı', '#c00000'], ['Mavi', '#1f4e9c'], ['Yeşil', '#2e7d32'], ['Turuncu', '#e46c0a'], ['Mor', '#7030a0']];
const MARKERS = [['Sarı', '#ffff00'], ['Parlak yeşil', '#00ff00'], ['Turkuaz', '#00ffff'], ['Pembe', '#ff00ff'], ['Açık gri', '#d9d9d9']];
const ALIGN = { justifyLeft: 'Sola hizala', justifyCenter: 'Ortala', justifyRight: 'Sağa hizala', justifyFull: 'İki yana yasla' };
const STYLES = [['p', 'Normal'], ['h1', 'Başlık 1'], ['h2', 'Başlık 2'], ['h3', 'Başlık 3'], ['blockquote', 'Alıntı']];
const SPACING = ['1.0', '1.15', '1.5', '2.0'];
const SYMBOLS = '©®™€₺$£°±×÷½¼¾≈≠≤≥→←↑↓✓✗•§¶…«»“”‘’αβπΩ∞♥☺☎✉★'.split('');
const MARGINS = { normal: ['Normal', '2.5em 3em'], dar: ['Dar', '1.3em 1.4em'], genis: ['Geniş', '2.5em 5.5em'] };
// Sık yapılan yazım yanlışları (Gözden Geçir → Yazım ve Dil Bilgisi)
const TYPOS = {
  herkez: 'herkes', yanlız: 'yalnız', yanlızca: 'yalnızca', yalnış: 'yanlış', birşey: 'bir şey', herşey: 'her şey', hiçbirşey: 'hiçbir şey', bişey: 'bir şey',
  malesef: 'maalesef', orjinal: 'orijinal', şöyleki: 'şöyle ki', tabiki: 'tabii ki', yada: 'ya da', hergün: 'her gün', herzaman: 'her zaman', yinede: 'yine de',
  deyil: 'değil', klavuz: 'kılavuz', laboratuar: 'laboratuvar', makina: 'makine', meyva: 'meyve', şarz: 'şarj', süpriz: 'sürpriz', kiprik: 'kirpik',
  antreman: 'antrenman', espiri: 'espri', kurdale: 'kurdele', egzos: 'egzoz', traş: 'tıraş', poğça: 'poğaça', eşortman: 'eşofman', entellektüel: 'entelektüel',
};
const today = () => new Date().toLocaleDateString('tr-TR');
// Öneri, yanlış yazılan kelimenin baş harfi büyükse büyük harfle başlar (Malesef → Maalesef)
const keepCase = (orig, fix) => (orig[0] && orig[0] !== orig[0].toLocaleLowerCase('tr') ? fix[0].toLocaleUpperCase('tr') + fix.slice(1) : fix);
const trUp = (t) => t.toLocaleUpperCase('tr');
const trLow = (t) => t.toLocaleLowerCase('tr');
const CASES = {
  sentence: ['Cümle düzeni.', (t) => trLow(t).replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + trUp(b))],
  lower: ['küçük harf', trLow],
  upper: ['BÜYÜK HARF', trUp],
  title: ['Her Sözcüğün İlk Harfi Büyük', (t) => trLow(t).replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + trUp(b))],
};

export function word({ desk, body, args, emit, setTitle }) {
  body.classList.add('wd');
  const btn = (attrs, html, title) => `<button type="button" ${attrs} title="${title}">${html}</button>`;
  body.innerHTML = `
    <div class="wd-tabs"><button type="button" class="wd-file">Dosya</button>${[['home', 'Giriş'], ['insert', 'Ekle'], ['layout', 'Düzen'], ['review', 'Gözden Geçir'], ['view', 'Görünüm']].map(([k, l], i) => `<button type="button" data-tab="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('')}</div>
    <div class="wd-rib" data-tab="home">
      <div class="wd-grp"><button type="button" data-cmd="undo" title="Geri al (Ctrl + Z)">↶</button><button type="button" data-cmd="redo" title="Yinele (Ctrl + Y)">↷</button><button type="button" class="wd-painter" title="Biçim boyacısı: seçili yazının biçimini kopyalar; sonra başka bir yazıyı seçin, biçim ona da uygulanır">🖌</button></div>
      <div class="wd-grp"><select class="wd-font" title="Yazı tipi">${FONTS.map(([n]) => `<option>${n}</option>`).join('')}</select>
        <select class="wd-size" title="Yazı tipi boyutu">${SIZES.map((s) => `<option${s === 11 ? ' selected' : ''}>${s}</option>`).join('')}</select>
        <span class="wd-popwrap">${btn('class="wd-casebtn"', 'Aa▾', 'Büyük/küçük harf değiştir')}<span class="wd-pop wd-cases" hidden>${Object.entries(CASES).map(([k, [l]]) => `<button type="button" data-case="${k}">${l}</button>`).join('')}</span></span>
        ${btn('data-cmd="removeFormat"', 'A<small>⌫</small>', 'Tüm biçimlendirmeyi temizle')}</div>
      <div class="wd-grp"><button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button><button type="button" data-cmd="underline" title="Altı çizili (Ctrl + U)"><u>A</u></button>
        ${btn('data-cmd="strikeThrough"', '<s>abc</s>', 'Üstü çizili')}${btn('data-cmd="subscript"', 'x<sub>2</sub>', 'Alt simge (Ctrl + =)')}${btn('data-cmd="superscript"', 'x<sup>2</sup>', 'Üst simge (Ctrl + Shift + +)')}
        <span class="wd-popwrap">${btn('class="wd-mark"', '<span>🖍</span><i style="background:#ffff00"></i>', 'Metin vurgu rengi')}<span class="wd-pop wd-pal wd-mpal" hidden>${MARKERS.map(([n, c]) => `<button type="button" data-mark="${c}" title="${n}" style="background:${c}"></button>`).join('')}<button type="button" data-mark="transparent" title="Renk yok" class="wd-nocolor">✕</button></span></span>
        <span class="wd-popwrap wd-colorwrap"><button type="button" class="wd-color" title="Yazı tipi rengi"><span>A</span><i style="background:#c00000"></i></button><span class="wd-pop wd-pal wd-cpal" hidden>${COLORS.map(([n, c]) => `<button type="button" data-color="${c}" title="${n}" style="background:${c}"></button>`).join('')}</span></span></div>
      <div class="wd-grp">${Object.entries(ALIGN).map(([c, t], i) => `<button type="button" data-cmd="${c}" title="${t} (Ctrl + ${'LERJ'[i]})" class="wd-al wd-${c}"><span></span><span></span><span></span></button>`).join('')}</div>
      <div class="wd-grp"><button type="button" data-cmd="insertUnorderedList" title="Madde işaretleri">• ≡</button><button type="button" data-cmd="insertOrderedList" title="Numaralandırma">1. ≡</button>
        ${btn('data-indent="-1"', '⇤', 'Girintiyi azalt')}${btn('data-indent="1"', '⇥', 'Girintiyi artır')}
        <select class="wd-spacing" title="Satır aralığı (Ctrl + 1 / 5 / 2)"><option value="" hidden>↕ Aralık</option>${SPACING.map((v) => `<option value="${v}">↕ ${v.replace('.', ',')}</option>`).join('')}</select></div>
      <div class="wd-grp wd-styles">${STYLES.map(([t, l]) => `<button type="button" data-style="${t}" class="wd-st-${t}" title="Stil: ${l}">${l}</button>`).join('')}</div>
      <div class="wd-grp">${btn('data-side="find"', '🔎 Bul', 'Bul (Ctrl + F)')}${btn('data-side="replace"', '⇄ Değiştir', 'Değiştir (Ctrl + H)')}</div>
    </div>
    <div class="wd-rib" data-tab="insert" hidden>
      <div class="wd-grp">${btn('data-ins="pagebreak"', '↵ Sayfa sonu', 'Sayfa sonu (Ctrl + Enter): yazının kalanı yeni sayfadan başlar')}</div>
      <div class="wd-grp"><span class="wd-popwrap"><button type="button" class="wd-table">▦ Tablo</button><span class="wd-pop wd-tpop" hidden><label>Satır <input type="number" class="wd-tr" min="1" max="10" value="3"></label><label>Sütun <input type="number" class="wd-tc" min="1" max="6" value="3"></label><button type="button" class="wd-tok">Ekle</button></span></span></div>
      <div class="wd-grp"><button type="button" class="wd-pic">🖼 Resim</button></div>
      <div class="wd-grp">${btn('data-ins="link"', '🔗 Bağlantı', 'Bağlantı (Ctrl + K)')}</div>
      <div class="wd-grp">${btn('data-ins="header"', '▔ Üst bilgi', 'Her sayfanın en üstünde görünen yazı')}${btn('data-ins="footer"', '▁ Alt bilgi', 'Her sayfanın en altında görünen yazı')}${btn('data-ins="pagenum"', '# Sayfa numarası', 'Alt bilgiye sayfa numarası ekler')}</div>
      <div class="wd-grp"><button type="button" class="wd-date">📅 Tarih</button><span class="wd-popwrap">${btn('class="wd-symbtn"', 'Ω Simge', 'Klavyede olmayan işaretler')}<span class="wd-pop wd-syms" hidden>${SYMBOLS.map((c) => `<button type="button" data-sym="${c}">${c}</button>`).join('')}</span></span></div>
    </div>
    <div class="wd-rib" data-tab="layout" hidden>
      <div class="wd-grp"><span class="wd-lbl">Kenar boşlukları</span>${Object.entries(MARGINS).map(([k, [l]]) => `<button type="button" data-lay="margin" data-val="${k}">${l}</button>`).join('')}</div>
      <div class="wd-grp"><span class="wd-lbl">Yönlendirme</span><button type="button" data-lay="orient" data-val="v">▯ Dikey</button><button type="button" data-lay="orient" data-val="h">▭ Yatay</button></div>
      <div class="wd-grp"><span class="wd-lbl">Sütunlar</span>${[1, 2, 3].map((n) => `<button type="button" data-lay="cols" data-val="${n}">${'▮'.repeat(n)} ${n}</button>`).join('')}</div>
    </div>
    <div class="wd-rib" data-tab="review" hidden>
      <div class="wd-grp">${btn('data-side="spell"', '✓ Yazım ve Dil Bilgisi', 'Yazım ve Dil Bilgisi (F7)')}</div>
      <div class="wd-grp">${btn('data-act="count"', '123 Sözcük sayımı', 'Sözcük, karakter ve paragraf sayısı')}</div>
    </div>
    <div class="wd-rib" data-tab="view" hidden>
      <div class="wd-grp"><span class="wd-lbl">Yakınlaştır</span>${btn('data-zoom="-10"', '−', 'Uzaklaştır')}<b class="wd-zl">%100</b>${btn('data-zoom="10"', '＋', 'Yakınlaştır')}${btn('data-zoom="0"', '%100', 'Gerçek boyut')}</div>
      <div class="wd-grp"><label class="wd-chk"><input type="checkbox" class="wd-rulerchk"> Cetvel</label></div>
    </div>
    <div class="wd-menu" hidden><button type="button" data-file="new">📄 Yeni</button><button type="button" data-file="open">📂 Aç…</button><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="pdf">📕 PDF olarak kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button><button type="button" data-file="close">✕ Kapat</button></div>
    <div class="wd-work"><div class="wd-scroll"><div class="wd-ruler" hidden><span></span></div><div class="wd-sheet">
      <div class="wd-hdr" contenteditable="true" spellcheck="false" data-ph="Üst bilgi" hidden></div>
      <div class="wd-page" contenteditable="true" spellcheck="false"><p><br></p></div>
      <div class="wd-ftr" contenteditable="true" spellcheck="false" data-ph="Alt bilgi" hidden></div>
    </div></div><aside class="wd-side" hidden></aside></div>
    <div class="wd-status"><span class="wd-words"></span><span class="wd-lang">Türkçe (Türkiye)</span><span class="wd-zbar">${btn('data-zoom="-10"', '−', 'Uzaklaştır')}<input type="range" class="wd-zr" min="50" max="200" step="10" value="100" title="Yakınlaştırma"><b class="wd-zl">%100</b></span></div>`;
  const $ = (s) => body.querySelector(s);
  const page = $('.wd-page'), sheet = $('.wd-sheet'), hdr = $('.wd-hdr'), ftr = $('.wd-ftr'), side = $('.wd-side');
  let fileName = null, folder = 'docs', dirty = false, range = null;
  let layout = { margin: 'normal', orient: 'v', cols: 1 }, pageNum = false, zoom = 100, painter = null;
  let sideMode = null, hits = [], hitIdx = 0, typos = []; // sağ bölme: bul, değiştir, yazım denetimi

  const pages = () => page.querySelectorAll('.wd-pb').length + 1;
  const title = () => setTitle(`${dirty ? '*' : ''}${fileName || 'Belge1'} - Kelime İşlemci`);
  const words = () => { const t = page.innerText.trim(); $('.wd-words').textContent = `Sayfa 1 / ${pages()} · ${t ? t.split(/\s+/).length : 0} sözcük`; };

  function applyLayout() {
    page.style.padding = MARGINS[layout.margin][1];
    sheet.classList.toggle('land', layout.orient === 'h');
    page.style.columnCount = layout.cols > 1 ? layout.cols : '';
    body.querySelectorAll('[data-lay]').forEach((b) => b.classList.toggle('on', String(layout[b.dataset.lay]) === b.dataset.val));
    hdr.hidden = !hdr.innerHTML.trim() && document.activeElement !== hdr;
    ftr.hidden = !ftr.innerHTML.trim() && !pageNum && document.activeElement !== ftr;
    renderPageNum();
  }
  function renderPageNum() {
    ftr.querySelector('.wd-pn')?.remove();
    if (pageNum) { const s = document.createElement('div'); s.className = 'wd-pn'; s.contentEditable = 'false'; s.textContent = `Sayfa 1 / ${pages()}`; ftr.append(s); }
  }

  function load(c, name = null, fld = folder) {
    const doc = typeof c === 'object' && c ? c : { html: c };
    page.innerHTML = doc.html || '<p><br></p>';
    hdr.innerHTML = doc.header || '';
    ftr.innerHTML = doc.footer || '';
    layout = { margin: 'normal', orient: 'v', cols: 1, ...(doc.layout || {}) };
    pageNum = !!doc.pageNum;
    fileName = name; folder = fld; dirty = false;
    closeSide();
    applyLayout(); title(); words();
  }
  // Kaydedilecek içerik: arama/yazım işaretleri temizlenmiş hâli
  function content() {
    cleanMarks();
    const f = ftr.cloneNode(true);
    f.querySelector('.wd-pn')?.remove();
    return { html: page.innerHTML, header: hdr.innerHTML, footer: f.innerHTML, layout: { ...layout }, pageNum };
  }
  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content, n.name, n.parent); else load();

  // Seçim, araç çubuğuna tıklanınca kaybolmasın: son seçim saklanır ve komuttan önce geri yüklenir
  const onSel = () => {
    if (!page.isConnected) { document.removeEventListener('selectionchange', onSel); return; }
    const s = getSelection();
    if (s.rangeCount && page.contains(s.anchorNode)) { range = s.getRangeAt(0).cloneRange(); syncTools(); }
  };
  document.addEventListener('selectionchange', onSel);
  function restore() {
    page.focus({ preventScroll: true });
    if (range) { const s = getSelection(); s.removeAllRanges(); s.addRange(range); }
  }

  function syncTools() {
    for (const c of ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'insertUnorderedList', 'insertOrderedList', ...Object.keys(ALIGN)]) {
      body.querySelector(`[data-cmd="${c}"]`)?.classList.toggle('on', document.queryCommandState(c));
    }
    const s = getSelection();
    const el = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
    if (el && page.contains(el)) {
      const cs = getComputedStyle(el);
      const pt = Math.round(parseFloat(cs.fontSize) * 0.75);
      if (document.activeElement !== $('.wd-size')) $('.wd-size').value = SIZES.includes(pt) ? pt : 11;
      const f = FONTS.find(([nm]) => cs.fontFamily.includes(nm));
      if (f && document.activeElement !== $('.wd-font')) $('.wd-font').value = f[0];
      const blk = blockOf(el);
      const tag = blk?.tagName.toLowerCase();
      body.querySelectorAll('[data-style]').forEach((b) => b.classList.toggle('on', b.dataset.style === (tag === 'div' ? 'p' : tag)));
      const lh = blk?.style.lineHeight;
      if (document.activeElement !== $('.wd-spacing')) $('.wd-spacing').value = SPACING.includes(lh) ? lh : '';
    }
  }
  const blockOf = (el) => { while (el && el.parentElement !== page) el = el.parentElement; return el; };
  function selectedBlocks() {
    if (!range) return [];
    const list = [...page.children].filter((b) => range.intersectsNode(b));
    return list.length ? list : [blockOf(range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement)].filter(Boolean);
  }

  function changed() { dirty = true; title(); words(); }

  function exec(cmd, value = null) {
    restore();
    document.execCommand('styleWithCSS', false, cmd !== 'fontSize');
    document.execCommand(cmd, false, cmd === 'fontSize' ? '7' : value);
    if (cmd === 'fontSize') {
      // execCommand yalnızca 1–7 boyutlarını bilir: 7 ile işaretlenen yerlere gerçek punto boyutu verilir
      page.querySelectorAll('font[size="7"]').forEach((f) => {
        const sp = document.createElement('span');
        sp.style.fontSize = value + 'pt';
        sp.innerHTML = f.innerHTML;
        f.replaceWith(sp);
      });
    }
    onSel();
    changed();
    emit('doc-format', { cmd, value });
  }

  // ---- Paragraf: stil, satır aralığı, girinti ----
  function setStyle(tag) {
    restore();
    document.execCommand('formatBlock', false, tag);
    onSel(); changed();
    emit('doc-style', { style: tag, name: STYLES.find((x) => x[0] === tag)?.[1] });
  }
  function setSpacing(v) {
    restore();
    selectedBlocks().forEach((b) => { b.style.lineHeight = v; });
    onSel(); changed();
    emit('doc-spacing', { value: v });
  }
  function indent(dir) {
    restore();
    const inList = range && (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement)?.closest('li');
    if (inList) document.execCommand(dir > 0 ? 'indent' : 'outdent');
    else selectedBlocks().forEach((b) => { const m = Math.max(0, (parseFloat(b.style.marginLeft) || 0) + dir * 2); b.style.marginLeft = m ? m + 'em' : ''; });
    onSel(); changed();
    emit('doc-indent', { dir });
  }
  function changeCase(k) {
    restore();
    const s = getSelection();
    const t = s.toString();
    if (!t) { desk.toast('Önce seçin', 'Harflerini değiştirmek istediğiniz yazıyı seçin.', 'Aa', 3000); return; }
    document.execCommand('insertText', false, CASES[k][1](t));
    changed();
    emit('doc-case', { mode: k });
  }
  // Biçim boyacısı: imleçteki yazının biçimi kopyalanır, sonra seçilen yazıya uygulanır
  function startPainter() {
    restore();
    const el = range && (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement);
    if (!el || !page.contains(el)) return;
    const cs = getComputedStyle(el);
    painter = {
      bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), underline: document.queryCommandState('underline'), strikeThrough: document.queryCommandState('strikeThrough'),
      color: cs.color, font: (FONTS.find(([nm]) => cs.fontFamily.includes(nm)) || FONTS[0])[0], size: Math.round(parseFloat(cs.fontSize) * 0.75),
    };
    $('.wd-painter').classList.add('on');
    page.classList.add('wd-painting');
    emit('doc-painter', { step: 'copy' });
  }
  function applyPainter() {
    const p = painter;
    painter = null;
    $('.wd-painter').classList.remove('on');
    page.classList.remove('wd-painting');
    onSel();
    if (getSelection().isCollapsed) return;
    document.execCommand('styleWithCSS', false, true);
    for (const c of ['bold', 'italic', 'underline', 'strikeThrough']) if (document.queryCommandState(c) !== p[c]) document.execCommand(c);
    document.execCommand('foreColor', false, p.color);
    document.execCommand('fontName', false, p.font);
    exec('fontSize', p.size);
    emit('doc-painter', { step: 'apply' });
  }

  // ---- Dosya işlemleri ----
  const fsApi = desk.fs.dialogApi();
  async function save(asNew) {
    if (desk.dialogs.busy) return false;
    if (fileName && !asNew) {
      desk.fs.write(folder, fileName, content());
      dirty = false; title();
      emit('doc-save', { name: fileName, folder, quick: true });
      desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
      return true;
    }
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Belge1.docx', ext: '.docx', typeLabel: 'Word Belgesi (*.docx)' });
    page.focus();
    if (!r) return false;
    desk.fs.write(r.folder, r.name, content());
    fileName = r.name; folder = r.folder; dirty = false; title();
    emit('doc-save', { name: r.name, folder: r.folder, quick: false });
    return true;
  }
  async function confirmDiscard() {
    if (!dirty || !page.innerText.trim()) return true;
    const a = await desk.dialogs.ask({ title: 'Kelime İşlemci', icon: '❓', text: `<b>${esc(fileName || 'Belge1')}</b> belgesindeki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['no', 'Kaydetme'], ['cancel', 'İptal']] });
    if (a === 'save') return save();
    return a === 'no';
  }
  async function fileCmd(c) {
    $('.wd-menu').hidden = true;
    if (c === 'save') return save();
    if (c === 'saveas') return save(true);
    if (c === 'new') { if (await confirmDiscard()) { load(); emit('doc-new'); } return; }
    if (c === 'close') return desk.close(desk.wins.find((w) => w.el.contains(body)));
    if (c === 'open') {
      if (!(await confirmDiscard())) return;
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder, ext: '.docx', typeLabel: 'Word Belgeleri (*.docx)' });
      if (!r) return;
      load(desk.fs.find(r.folder, r.name)?.content, r.name, r.folder);
      emit('doc-open', { name: r.name });
      return;
    }
    if (c === 'print') {
      const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Belge1' });
      if (r) { desk.toast('Yazdırılıyor', `“${esc(fileName || 'Belge1')}” → ${esc(r.printer)}`, '🖨'); emit('doc-print', { ...r, doc: fileName }); }
      return;
    }
    if (c === 'pdf') {
      const base = (fileName || 'Belge1').replace(/\.docx$/i, '');
      const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.pdf', ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, content());
      desk.toast('PDF olarak kaydedildi', esc(r.name), '📕');
      emit('doc-pdf', { name: r.name, folder: r.folder });
    }
  }

  // ---- Ekle ----
  function insertHtml(html, what) {
    restore();
    document.execCommand('insertHTML', false, html);
    changed();
    emit('doc-insert', { what });
  }
  async function insertPicture() {
    const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.jpg', typeLabel: 'Resimler (*.jpg; *.png)', accept: /\.(png|jpe?g|bmp)$/i });
    if (!r || !isImage(r.name)) return;
    insertHtml(`<p><img src="${pictureURL(desk.fs.find(r.folder, r.name)?.content)}" alt="${esc(r.name)}" style="width:45%"></p><p><br></p>`, 'picture');
  }
  const pageBreak = () => { insertHtml('<div class="wd-pb" contenteditable="false"></div><p><br></p>', 'pagebreak'); applyLayout(); };
  async function insertLink() {
    restore();
    const sel = getSelection().toString();
    const saved = range?.cloneRange();
    const v = await desk.dialogs.form({
      title: 'Köprü ekle', icon: '🔗', ok: 'Tamam',
      text: 'Belgeye tıklanabilir bir internet adresi ekleyin. Okuyan kişi <b>Ctrl</b>’ye basılı tutup tıklayınca sayfa açılır.',
      fields: [{ name: 'text', label: 'Görüntülenecek metin:', value: sel }, { name: 'url', label: 'Adres:', value: 'www.' }],
      check: (x) => (!x.url.trim() || x.url.trim() === 'www.' ? 'Adresi yazın.' : /\s/.test(x.url.trim()) ? 'Adreste boşluk olmaz.' : ''),
    });
    if (!v) return;
    range = saved;
    const url = v.url.trim();
    insertHtml(`<a href="https://${esc(url.replace(/^https?:\/\//i, ''))}" title="Bağlantıyı açmak için Ctrl + tıklayın">${esc(v.text.trim() || url)}</a>&nbsp;`, 'link');
    emit('doc-link', { url, text: v.text.trim() || url });
  }
  function editHF(el, what) {
    el.hidden = false;
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    emit('doc-hf', { what });
  }

  // ---- Bul / Değiştir / Yazım denetimi (sağdaki bölme) ----
  function cleanMarks() {
    const m = page.querySelectorAll('mark.wd-hit, span.wd-typo');
    if (!m.length) return;
    m.forEach((x) => x.replaceWith(...x.childNodes));
    page.normalize();
  }
  function textNodes(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const out = [];
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  }
  // Metindeki eşleşmeleri işaretler: test(küçük harfli metin) → [{ i, len, data }]
  function markAll(cls, find) {
    const res = [];
    for (const n of textNodes(page)) {
      const list = find(trLow(n.textContent));
      let node = n, off = 0;
      for (const m of list) {
        const r = node.splitText(m.i - off);
        node = r.splitText(m.len);
        const el = document.createElement(cls === 'wd-hit' ? 'mark' : 'span');
        el.className = cls;
        if (m.data) el.dataset.fix = keepCase(r.textContent, m.data);
        r.replaceWith(el);
        el.append(r);
        res.push(el);
        off = m.i + m.len;
      }
    }
    return res;
  }
  function find(q) {
    cleanMarks();
    const needle = trLow(q.trim());
    hits = needle ? markAll('wd-hit', (t) => { const o = []; let i = t.indexOf(needle); while (i >= 0) { o.push({ i, len: needle.length }); i = t.indexOf(needle, i + needle.length); } return o; }) : [];
    hitIdx = 0;
    showHit();
    return hits.length;
  }
  function showHit() {
    hits.forEach((m, i) => m.classList.toggle('cur', i === hitIdx));
    hits[hitIdx]?.scrollIntoView({ block: 'center' });
    const c = side.querySelector('.wd-fcount');
    if (c) c.textContent = !side.querySelector('.wd-fq')?.value.trim() ? '' : hits.length ? `${hits.length} sonuç · ${hitIdx + 1}. gösteriliyor` : 'Sonuç bulunamadı';
  }
  function replaceOne(m, text) {
    m.replaceWith(document.createTextNode(text));
    page.normalize();
  }
  function openSide(mode) {
    sideMode = mode;
    side.hidden = false;
    body.querySelectorAll('[data-side]').forEach((b) => b.classList.toggle('on', b.dataset.side === mode));
    const sel = range && !range.collapsed ? range.toString().trim().slice(0, 40) : '';
    if (mode === 'spell') return spell();
    side.innerHTML = `<div class="wd-sh"><b>${mode === 'find' ? '🔎 Gezinti: Bul' : '⇄ Bul ve Değiştir'}</b><button type="button" data-side-x title="Kapat">✕</button></div>
      <label>Aranan:<input class="wd-fq" value="${esc(sel)}" placeholder="Belgede ara"></label>
      ${mode === 'replace' ? '<label>Yeni değer:<input class="wd-rq" placeholder="Yerine yazılacak"></label>' : ''}
      <div class="wd-fcount"></div>
      <div class="wd-sbtns"><button type="button" data-hit="-1">↑ Önceki</button><button type="button" data-hit="1">↓ Sonraki</button></div>
      ${mode === 'replace' ? '<div class="wd-sbtns"><button type="button" data-rep="one" class="primary">Değiştir</button><button type="button" data-rep="all">Tümünü değiştir</button></div><p class="wd-sres"></p>' : ''}
      <p class="wd-snote">${mode === 'find' ? 'Bulunan yerler sarıyla işaretlenir. Büyük/küçük harf fark etmez.' : 'Örnek: belgede her “Ahmet” yazan yere “Mehmet” yazmak için Tümünü değiştir.'}</p>`;
    const q = side.querySelector('.wd-fq');
    q.focus(); q.select();
    if (q.value) find(q.value);
    emit('doc-side', { mode });
  }
  function closeSide() {
    side.hidden = true;
    sideMode = null;
    cleanMarks();
    hits = []; typos = [];
    body.querySelectorAll('[data-side]').forEach((b) => b.classList.remove('on'));
  }
  function spell() {
    cleanMarks();
    typos = markAll('wd-typo', (t) => {
      const o = [];
      for (const m of t.matchAll(/[\p{L}']+/gu)) if (TYPOS[m[0]]) o.push({ i: m.index, len: m[0].length, data: TYPOS[m[0]] });
      return o;
    });
    renderSpell();
    emit('doc-spell', { count: typos.length, words: typos.map((t) => t.textContent) });
  }
  function renderSpell() {
    typos = typos.filter((t) => t.isConnected);
    const t = typos[0];
    side.innerHTML = `<div class="wd-sh"><b>✓ Yazım ve Dil Bilgisi</b><button type="button" data-side-x title="Kapat">✕</button></div>
      ${t ? `<p>Yazım hatası (${typos.length} kaldı):</p><div class="wd-typobox">${esc(t.textContent)}</div><p>Öneri:</p><div class="wd-sugg">${esc(t.dataset.fix)}</div>
        <div class="wd-sbtns"><button type="button" data-sp="fix" class="primary">Değiştir</button><button type="button" data-sp="all">Tümünü değiştir</button></div><div class="wd-sbtns"><button type="button" data-sp="skip">Yoksay</button></div>
        <p class="wd-snote">Belgede kırmızı dalgalı çizgiyle gösterilen kelimeler. Program her hatayı bulamaz; son okumayı yine siz yapın.</p>`
      : '<div class="wd-sdone">✅ Yazım denetimi tamamlandı.<br><small>Başka hata bulunamadı.</small></div>'}`;
    t?.scrollIntoView({ block: 'center' });
    typos.forEach((x, i) => x.classList.toggle('cur', i === 0));
  }

  async function wordCount() {
    cleanMarks();
    const t = page.innerText;
    const w = t.trim() ? t.trim().split(/\s+/).length : 0;
    const paras = [...page.querySelectorAll('p, h1, h2, h3, li, blockquote')].filter((p) => p.innerText.trim()).length;
    const stats = [['Sayfalar', pages()], ['Sözcükler', w], ['Karakterler (boşluksuz)', t.replace(/\s/g, '').length], ['Karakterler (boşluklu)', t.replace(/\n/g, '').length], ['Paragraflar', paras]];
    emit('doc-wordcount', { words: w });
    await desk.dialogs.ask({ title: 'Sözcük Sayımı', icon: '123', text: `<table class="wd-count">${stats.map(([a, b]) => `<tr><td>${a}</td><td><b>${b}</b></td></tr>`).join('')}</table>`, buttons: [['ok', 'Kapat', true]] });
  }

  function setZoom(z) {
    zoom = z === 0 ? 100 : Math.max(50, Math.min(200, z));
    sheet.style.zoom = zoom / 100;
    $('.wd-ruler').style.zoom = zoom / 100;
    body.querySelectorAll('.wd-zl').forEach((x) => { x.textContent = `%${zoom}`; });
    $('.wd-zr').value = zoom;
    emit('doc-zoom', { zoom });
  }

  // ---- Olaylar ----
  const closePops = (keep) => body.querySelectorAll('.wd-pop').forEach((p) => { if (p !== keep) p.hidden = true; });
  body.addEventListener('mousedown', (e) => {
    // Araç çubuğundaki düğmeler sayfadaki seçimi bozmasın (açılır listeler ve kutular hariç)
    if (e.target.closest('.wd-rib button, .wd-tabs button')) e.preventDefault();
    if (!e.target.closest('.wd-menu, .wd-file')) $('.wd-menu').hidden = true;
    if (!e.target.closest('.wd-popwrap')) closePops();
  });
  body.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) {
      body.querySelectorAll('.wd-tabs [data-tab]').forEach((b) => b.classList.toggle('on', b === t));
      body.querySelectorAll('.wd-rib').forEach((r) => { r.hidden = r.dataset.tab !== t.dataset.tab; });
      emit('doc-tab', { tab: t.dataset.tab });
      return;
    }
    const pop = t.closest('.wd-popwrap')?.querySelector('.wd-pop');
    if (pop && !t.closest('.wd-pop')) { closePops(pop); pop.hidden = !pop.hidden; return; }
    if (t.closest('.wd-pop') && !t.closest('.wd-tpop')) pop.hidden = true;
    if (t.classList.contains('wd-file')) { $('.wd-menu').hidden = !$('.wd-menu').hidden; return; }
    if (t.dataset.file) return fileCmd(t.dataset.file);
    if (t.dataset.cmd) return exec(t.dataset.cmd);
    if (t.dataset.color) { $('.wd-color i').style.background = t.dataset.color; return exec('foreColor', t.dataset.color); }
    if (t.dataset.mark) { if (t.dataset.mark !== 'transparent') $('.wd-mark i').style.background = t.dataset.mark; return exec('hiliteColor', t.dataset.mark); }
    if (t.dataset.case) return changeCase(t.dataset.case);
    if (t.dataset.style) return setStyle(t.dataset.style);
    if (t.dataset.indent) return indent(+t.dataset.indent);
    if (t.classList.contains('wd-painter')) { if (painter) { painter = null; t.classList.remove('on'); page.classList.remove('wd-painting'); } else startPainter(); return; }
    if (t.dataset.sym) return insertHtml(esc(t.dataset.sym), 'symbol');
    if (t.dataset.ins === 'pagebreak') return pageBreak();
    if (t.dataset.ins === 'link') return insertLink();
    if (t.dataset.ins === 'header') return editHF(hdr, 'header');
    if (t.dataset.ins === 'footer') return editHF(ftr, 'footer');
    if (t.dataset.ins === 'pagenum') { pageNum = !pageNum; applyLayout(); changed(); emit('doc-pagenum', { on: pageNum }); return; }
    if (t.dataset.lay) { layout[t.dataset.lay] = t.dataset.lay === 'cols' ? +t.dataset.val : t.dataset.val; applyLayout(); changed(); emit('doc-layout', { key: t.dataset.lay, value: layout[t.dataset.lay] }); return; }
    if (t.dataset.zoom) return setZoom(t.dataset.zoom === '0' ? 0 : zoom + +t.dataset.zoom);
    if (t.dataset.side) { if (sideMode === t.dataset.side) closeSide(); else openSide(t.dataset.side); return; }
    if (t.dataset.act === 'count') return wordCount();
    if (t.dataset.sideX !== undefined) { closeSide(); page.focus(); return; }
    if (t.dataset.hit) { if (!hits.length) find(side.querySelector('.wd-fq').value); else { hitIdx = (hitIdx + +t.dataset.hit + hits.length) % hits.length; showHit(); } return; }
    if (t.dataset.rep) {
      const q = side.querySelector('.wd-fq').value, w = side.querySelector('.wd-rq').value;
      if (!q.trim()) return;
      if (!hits.length) find(q);
      let count = 0;
      if (t.dataset.rep === 'all') { count = hits.length; hits.forEach((m) => replaceOne(m, w)); hits = []; }
      else if (hits[hitIdx]) { replaceOne(hits[hitIdx], w); count = 1; find(q); }
      side.querySelector('.wd-sres').textContent = count ? `${count} değişiklik yapıldı.` : 'Değiştirilecek bir şey bulunamadı.';
      if (count) changed();
      emit('doc-replace', { q: q.trim(), with: w, count, all: t.dataset.rep === 'all' });
      return;
    }
    if (t.dataset.sp) {
      const cur = typos[0];
      if (!cur) return;
      if (t.dataset.sp === 'all') {
        const word = trLow(cur.textContent);
        typos.filter((x) => trLow(x.textContent) === word).forEach((x) => replaceOne(x, x.dataset.fix));
        changed();
        emit('doc-spell-fix', { from: word, all: true });
      } else if (t.dataset.sp === 'fix') { const from = cur.textContent, to = cur.dataset.fix; replaceOne(cur, to); changed(); emit('doc-spell-fix', { from, to }); } else { cur.replaceWith(...cur.childNodes); page.normalize(); emit('doc-spell-skip'); }
      renderSpell();
      if (!typos.length) emit('doc-spell-done');
      return;
    }
    if (t.classList.contains('wd-tok')) {
      const r = Math.min(10, Math.max(1, +$('.wd-tr').value || 3)), c = Math.min(6, Math.max(1, +$('.wd-tc').value || 3));
      $('.wd-tpop').hidden = true;
      return insertHtml(`<table class="wd-t">${`<tr>${'<td><br></td>'.repeat(c)}</tr>`.repeat(r)}</table><p><br></p>`, 'table');
    }
    if (t.classList.contains('wd-pic')) return insertPicture();
    if (t.classList.contains('wd-date')) return insertHtml(esc(today()), 'date');
  });
  $('.wd-font').addEventListener('change', (e) => exec('fontName', e.target.value));
  $('.wd-size').addEventListener('change', (e) => exec('fontSize', +e.target.value));
  $('.wd-spacing').addEventListener('change', (e) => { if (e.target.value) setSpacing(e.target.value); });
  $('.wd-zr').addEventListener('input', (e) => setZoom(+e.target.value));
  $('.wd-rulerchk').addEventListener('change', (e) => { $('.wd-ruler').hidden = !e.target.checked; emit('doc-ruler', { on: e.target.checked }); });
  side.addEventListener('input', (e) => { if (e.target.matches('.wd-fq')) { const c = find(e.target.value); emit('doc-find', { q: e.target.value.trim(), count: c }); } });
  side.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSide(); page.focus(); }
    if (e.key === 'Enter' && e.target.matches('.wd-fq') && hits.length) { e.preventDefault(); hitIdx = (hitIdx + (e.shiftKey ? -1 : 1) + hits.length) % hits.length; showHit(); }
  });
  for (const el of [hdr, ftr]) {
    el.addEventListener('input', () => { changed(); emit('doc-hf-input', { what: el === hdr ? 'header' : 'footer', text: el.innerText.trim() }); });
    el.addEventListener('blur', () => setTimeout(applyLayout, 0));
  }

  page.addEventListener('input', () => { changed(); emit('doc-input', { text: page.innerText }); if (pageNum) renderPageNum(); });
  page.addEventListener('mouseup', () => { if (painter) setTimeout(applyPainter, 0); });
  page.addEventListener('click', (e) => {
    // Bağlantılar: Ctrl + tıklayınca tarayıcıda açılır (sitesi varsa)
    const a = e.target.closest('a[href]');
    if (!a || !(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const host = a.getAttribute('href').replace(/^https?:\/\//, '');
    desk.open('browser', { url: host });
    emit('doc-link-open', { url: host, known: !!SITES[host.split('/')[0]] || !!SITES['www.' + host.split('/')[0]] });
  });
  page.addEventListener('paste', (e) => {
    // Başka yerden gelen biçimler karışmasın: yalnızca düz yazı yapıştırılır
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || '');
  });
  body.addEventListener('keydown', (e) => {
    if (e.key === 'F7') { e.preventDefault(); openSide('spell'); return; }
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    if (e.code === 'KeyF') { e.preventDefault(); openSide('find'); }
    else if (e.code === 'KeyH') { e.preventDefault(); openSide('replace'); }
  });
  page.addEventListener('keydown', (e) => {
    // Tab: tabloda sonraki (Shift ile önceki) hücreye geçer; tablo dışında boşluk bırakır. Odak sayfadan kaçmaz.
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const s = getSelection();
      const td = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement)?.closest('td');
      if (td && page.contains(td)) {
        const cells = [...td.closest('table').querySelectorAll('td')];
        const nx = cells[cells.indexOf(td) + (e.shiftKey ? -1 : 1)];
        if (nx) { const r = document.createRange(); r.selectNodeContents(nx); r.collapse(false); s.removeAllRanges(); s.addRange(r); emit('doc-cell'); }
      } else document.execCommand('insertText', false, '    ');
      return;
    }
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const map = { KeyB: 'bold', KeyI: 'italic', KeyU: 'underline', KeyL: 'justifyLeft', KeyE: 'justifyCenter', KeyR: 'justifyRight', KeyJ: 'justifyFull' };
    if (map[e.code]) { e.preventDefault(); exec(map[e.code]); emit('doc-shortcut', { cmd: map[e.code] }); return; }
    if (e.code === 'Equal') { e.preventDefault(); exec(e.shiftKey ? 'superscript' : 'subscript'); return; }
    const sp = { Digit1: '1.0', Digit5: '1.5', Digit2: '2.0' }[e.code];
    if (sp) { e.preventDefault(); onSel(); setSpacing(sp); return; }
    if (e.key === 'Enter') { e.preventDefault(); onSel(); pageBreak(); return; }
    if (e.code === 'KeyK') { e.preventDefault(); onSel(); insertLink(); return; }
    if (e.code === 'KeyS') { e.preventDefault(); save(e.shiftKey); }
    if (e.code === 'KeyP') { e.preventDefault(); fileCmd('print'); }
    if (e.code === 'KeyO') { e.preventDefault(); fileCmd('open'); }
  });
  document.execCommand('defaultParagraphSeparator', false, 'p');
  title();

  return {
    page,
    // Derslerin kontrolü için: her paragrafın yazısı, hizası, kalınlığı, boyutu ve rengi
    info() {
      // Tarayıcı bazen listeyi paragrafın içine koyar (<p><ul>…</ul></p>); öyle bir paragraf yerine içindeki liste sayılır
      const isList = (x) => x.tagName === 'UL' || x.tagName === 'OL';
      const tops = [...page.children].filter((b) => !b.classList.contains('wd-pb')).flatMap((b) => (!isList(b) && [...b.children].some(isList) ? [...b.children].filter(isList) : [b]));
      const blocks = tops.map((b) => {
        const texts = [];
        const walk = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
        while (walk.nextNode()) if (walk.currentNode.textContent.trim()) texts.push(walk.currentNode.parentElement);
        const cs = (el) => getComputedStyle(el);
        const al = cs(b.tagName === 'UL' || b.tagName === 'OL' ? b.querySelector('li') || b : b).textAlign;
        return {
          tag: b.tagName, text: b.innerText.trim(),
          align: al === 'start' ? 'left' : al,
          bold: texts.length > 0 && texts.every((el) => +cs(el).fontWeight >= 600),
          italic: texts.length > 0 && texts.every((el) => cs(el).fontStyle === 'italic'),
          underline: texts.length > 0 && texts.every((el) => { for (let x = el; x && x !== page; x = x.parentElement) if (cs(x).textDecorationLine.includes('underline')) return true; return false; }),
          size: texts.length ? Math.max(...texts.map((el) => Math.round(parseFloat(cs(el).fontSize) * 0.75))) : 0,
          colors: [...new Set(texts.map((el) => cs(el).color))],
          highlight: texts.some((el) => { for (let x = el; x && x !== page; x = x.parentElement) if (x.style.backgroundColor && x.style.backgroundColor !== 'transparent') return true; return false; }),
          lineHeight: b.style.lineHeight || '',
          items: b.tagName === 'UL' || b.tagName === 'OL' ? [...b.querySelectorAll('li')].map((li) => li.innerText.trim()) : null,
        };
      });
      const f = ftr.cloneNode(true);
      f.querySelector('.wd-pn')?.remove();
      return {
        blocks, text: page.innerText, tables: page.querySelectorAll('table').length, images: page.querySelectorAll('img').length, fileName, dirty,
        header: hdr.innerText.trim(), footer: f.innerText.trim(), pageNum, layout: { ...layout }, pages: pages(),
        links: [...page.querySelectorAll('a[href]')].map((a) => ({ text: a.innerText, url: a.getAttribute('href') })),
      };
    },
    load: (c) => load(c),
    confirmClose: confirmDiscard,
    focus: () => { if (!desk.dialogs.busy) page.focus({ preventScroll: true }); },
  };
}
