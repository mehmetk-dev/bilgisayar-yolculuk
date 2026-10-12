// Kelime İşlemci: Word benzeri, sayfa görünümlü yazı programı. Biçimlendirme (kalın, italik, altı çizili, yazı tipi,
// boyut, renk), hizalama, madde işaretleri, tablo, resim, tarih; .docx olarak kaydetme, açma, yazdırma ve PDF.
// İçerik bellekteki dosyada { html } olarak durur.
import { esc, pictureURL, isImage } from './util.js';

const FONTS = [['Calibri', 'Calibri, Carlito, "Noto Sans", sans-serif'], ['Times New Roman', '"Times New Roman", Tinos, "Noto Serif", serif'], ['Arial', 'Arial, Arimo, "Liberation Sans", sans-serif'], ['Comic Sans MS', '"Comic Sans MS", "Comic Neue", cursive'], ['Courier New', '"Courier New", Cousine, monospace']];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48];
const COLORS = [['Siyah', '#000000'], ['Kırmızı', '#c00000'], ['Mavi', '#1f4e9c'], ['Yeşil', '#2e7d32'], ['Turuncu', '#e46c0a'], ['Mor', '#7030a0']];
const ALIGN = { justifyLeft: 'Sola hizala', justifyCenter: 'Ortala', justifyRight: 'Sağa hizala', justifyFull: 'İki yana yasla' };
const today = () => new Date().toLocaleDateString('tr-TR');

export function word({ desk, body, args, emit, setTitle }) {
  body.classList.add('wd');
  body.innerHTML = `
    <div class="wd-tabs"><button type="button" class="wd-file">Dosya</button><button type="button" data-tab="home" class="on">Giriş</button><button type="button" data-tab="insert">Ekle</button></div>
    <div class="wd-rib" data-tab="home">
      <div class="wd-grp"><button type="button" data-cmd="undo" title="Geri al (Ctrl + Z)">↶</button><button type="button" data-cmd="redo" title="Yinele (Ctrl + Y)">↷</button></div>
      <div class="wd-grp"><select class="wd-font" title="Yazı tipi">${FONTS.map(([n]) => `<option>${n}</option>`).join('')}</select>
        <select class="wd-size" title="Yazı tipi boyutu">${SIZES.map((s) => `<option${s === 11 ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="wd-grp"><button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button><button type="button" data-cmd="underline" title="Altı çizili (Ctrl + U)"><u>A</u></button>
        <span class="wd-colorwrap"><button type="button" class="wd-color" title="Yazı tipi rengi"><span>A</span><i style="background:#c00000"></i></button><span class="wd-pal" hidden>${COLORS.map(([n, c]) => `<button type="button" data-color="${c}" title="${n}" style="background:${c}"></button>`).join('')}</span></span></div>
      <div class="wd-grp">${Object.entries(ALIGN).map(([c, t], i) => `<button type="button" data-cmd="${c}" title="${t} (Ctrl + ${'LERJ'[i]})" class="wd-al wd-${c}"><span></span><span></span><span></span></button>`).join('')}</div>
      <div class="wd-grp"><button type="button" data-cmd="insertUnorderedList" title="Madde işaretleri">• ≡</button><button type="button" data-cmd="insertOrderedList" title="Numaralandırma">1. ≡</button></div>
    </div>
    <div class="wd-rib" data-tab="insert" hidden>
      <div class="wd-grp"><button type="button" class="wd-table">▦ Tablo</button><span class="wd-tpop" hidden><label>Satır <input type="number" class="wd-tr" min="1" max="10" value="3"></label><label>Sütun <input type="number" class="wd-tc" min="1" max="6" value="3"></label><button type="button" class="wd-tok">Ekle</button></span></div>
      <div class="wd-grp"><button type="button" class="wd-pic">🖼 Resim</button><button type="button" class="wd-date">📅 Tarih</button></div>
    </div>
    <div class="wd-menu" hidden><button type="button" data-file="new">📄 Yeni</button><button type="button" data-file="open">📂 Aç…</button><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="pdf">📕 PDF olarak kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button><button type="button" data-file="close">✕ Kapat</button></div>
    <div class="wd-scroll"><div class="wd-page" contenteditable="true" spellcheck="false"><p><br></p></div></div>
    <div class="wd-status"><span class="wd-words"></span><span>Türkçe (Türkiye)</span></div>`;
  const $ = (s) => body.querySelector(s);
  const page = $('.wd-page');
  let fileName = null, folder = 'docs', dirty = false, range = null;

  const title = () => setTitle(`${dirty ? '*' : ''}${fileName || 'Belge1'} - Kelime İşlemci`);
  const words = () => { const t = page.innerText.trim(); $('.wd-words').textContent = `Sayfa 1 / 1 · ${t ? t.split(/\s+/).length : 0} sözcük`; };

  function load(html, name = null, fld = folder) {
    page.innerHTML = html || '<p><br></p>';
    fileName = name; folder = fld; dirty = false;
    title(); words();
  }
  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content?.html, n.name, n.parent); else load();

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
    for (const c of ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', ...Object.keys(ALIGN)]) {
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
    }
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

  // ---- Dosya işlemleri ----
  const fsApi = desk.fs.dialogApi();
  async function save(asNew) {
    if (desk.dialogs.busy) return false;
    if (fileName && !asNew) {
      desk.fs.write(folder, fileName, { html: page.innerHTML });
      dirty = false; title();
      emit('doc-save', { name: fileName, folder, quick: true });
      desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
      return true;
    }
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Belge1.docx', ext: '.docx', typeLabel: 'Word Belgesi (*.docx)' });
    page.focus();
    if (!r) return false;
    desk.fs.write(r.folder, r.name, { html: page.innerHTML });
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
      load(desk.fs.find(r.folder, r.name)?.content?.html, r.name, r.folder);
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
      desk.fs.write(r.folder, r.name, { html: page.innerHTML });
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

  // ---- Olaylar ----
  body.addEventListener('mousedown', (e) => {
    // Araç çubuğundaki düğmeler sayfadaki seçimi bozmasın (açılır listeler ve kutular hariç)
    if (e.target.closest('.wd-rib button, .wd-tabs button')) e.preventDefault();
    if (!e.target.closest('.wd-menu, .wd-file')) $('.wd-menu').hidden = true;
    if (!e.target.closest('.wd-colorwrap')) $('.wd-pal').hidden = true;
    if (!e.target.closest('.wd-tpop, .wd-table')) $('.wd-tpop').hidden = true;
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
    if (t.classList.contains('wd-file')) { $('.wd-menu').hidden = !$('.wd-menu').hidden; return; }
    if (t.dataset.file) return fileCmd(t.dataset.file);
    if (t.dataset.cmd) return exec(t.dataset.cmd);
    if (t.classList.contains('wd-color')) { $('.wd-pal').hidden = !$('.wd-pal').hidden; return; }
    if (t.dataset.color) { $('.wd-pal').hidden = true; $('.wd-color i').style.background = t.dataset.color; return exec('foreColor', t.dataset.color); }
    if (t.classList.contains('wd-table')) { $('.wd-tpop').hidden = !$('.wd-tpop').hidden; return; }
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

  page.addEventListener('input', () => { changed(); emit('doc-input', { text: page.innerText }); });
  page.addEventListener('paste', (e) => {
    // Başka yerden gelen biçimler karışmasın: yalnızca düz yazı yapıştırılır
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || '');
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
      } else document.execCommand('insertText', false, '    ');
      return;
    }
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const map = { KeyB: 'bold', KeyI: 'italic', KeyU: 'underline', KeyL: 'justifyLeft', KeyE: 'justifyCenter', KeyR: 'justifyRight', KeyJ: 'justifyFull' };
    if (map[e.code]) { e.preventDefault(); exec(map[e.code]); emit('doc-shortcut', { cmd: map[e.code] }); return; }
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
      const tops = [...page.children].flatMap((b) => (!isList(b) && [...b.children].some(isList) ? [...b.children].filter(isList) : [b]));
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
          items: b.tagName === 'UL' || b.tagName === 'OL' ? [...b.querySelectorAll('li')].map((li) => li.innerText.trim()) : null,
        };
      });
      return { blocks, text: page.innerText, tables: page.querySelectorAll('table').length, images: page.querySelectorAll('img').length, fileName, dirty };
    },
    confirmClose: confirmDiscard,
    focus: () => { if (!desk.dialogs.busy) page.focus({ preventScroll: true }); },
  };
}
