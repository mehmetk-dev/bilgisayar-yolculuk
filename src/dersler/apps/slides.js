// Sunu: PowerPoint benzeri program. Slayt düzenleri (başlık, başlık ve içerik, yalnızca başlık), tasarım temaları,
// resim ekleme, slayt geçişleri, slayt sırasını değiştirme ve silme, slayt gösterisi (F5); .pptx olarak kaydetme, yazdırma.
import { esc, pictureURL } from './util.js';

const THEMES = [
  ['beyaz', 'Office', '#ffffff', '#1f1f1f', '#c55a11'],
  ['mavi', 'Okyanus', 'linear-gradient(135deg,#0b3d91,#1e88e5)', '#ffffff', '#ffd54f'],
  ['yesil', 'Bahar', 'linear-gradient(135deg,#e8f5e9,#a5d6a7)', '#1b5e20', '#2e7d32'],
  ['gece', 'Gece', 'linear-gradient(135deg,#1a1a2e,#3a3a6e)', '#f5f5f5', '#ff8a65'],
];
const LAYOUTS = { title: 'Başlık slaytı', content: 'Başlık ve içerik', only: 'Yalnızca başlık' };
const TRANS = [['none', 'Yok'], ['fade', 'Solma'], ['push', 'İtme'], ['zoom', 'Yakınlaştır']];
const PH = { title: 'Başlık eklemek için tıklayın', sub: 'Alt başlık eklemek için tıklayın', body: 'Metin eklemek için tıklayın' };
const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.innerText.trim(); };

export function slides({ desk, body, args, emit, setTitle }) {
  body.classList.add('pp');
  body.innerHTML = `
    <div class="pp-tabs"><button type="button" class="pp-file">Dosya</button><button type="button" data-tab="home" class="on">Giriş</button><button type="button" data-tab="insert">Ekle</button><button type="button" data-tab="design">Tasarım</button><button type="button" data-tab="trans">Geçişler</button><button type="button" data-tab="show">Slayt Gösterisi</button></div>
    <div class="pp-rib" data-tab="home"><span class="pp-newwrap"><button type="button" class="pp-new">➕ Yeni Slayt ▾</button><span class="pp-lay" hidden>${Object.entries(LAYOUTS).map(([k, v]) => `<button type="button" data-layout="${k}">${v}</button>`).join('')}</span></span>
      <button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button>
      <button type="button" class="pp-up" title="Slaytı yukarı taşı">▲ Yukarı</button><button type="button" class="pp-down" title="Slaytı aşağı taşı">▼ Aşağı</button><button type="button" class="pp-del" title="Slaytı sil">🗑 Sil</button></div>
    <div class="pp-rib" data-tab="insert" hidden><button type="button" class="pp-pic">🖼 Resim</button></div>
    <div class="pp-rib" data-tab="design" hidden>${THEMES.map(([id, n, bg, fg]) => `<button type="button" class="pp-theme" data-theme="${id}" title="${n}" style="background:${bg};color:${fg}">Aa<small>${n}</small></button>`).join('')}</div>
    <div class="pp-rib" data-tab="trans" hidden>${TRANS.map(([id, n]) => `<button type="button" data-trans="${id}">${n}</button>`).join('')}<span class="pp-tnote">Seçili slayda uygulanır</span></div>
    <div class="pp-rib" data-tab="show" hidden><button type="button" class="pp-play">▶ Baştan başla <small>F5</small></button><button type="button" class="pp-play-cur">▶ Geçerli slayttan</button></div>
    <div class="pp-menu" hidden><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button></div>
    <div class="pp-main"><div class="pp-thumbs" tabindex="0"></div><div class="pp-stage"><div class="pp-slide"></div></div></div>
    <div class="pp-status"><span class="pp-st"></span><span>Türkçe (Türkiye)</span></div>
    <div class="pp-show" hidden tabindex="0"></div>`;
  const $ = (s) => body.querySelector(s);
  let deck, cur = 0, fileName = null, folder = 'docs', dirty = false;
  const blank = (layout) => ({ layout, title: '', sub: '', body: '', img: null, trans: 'none' });

  const theme = () => THEMES.find((t) => t[0] === deck.theme) || THEMES[0];
  function slideHtml(s, edit) {
    const [, , bg, fg, acc] = theme();
    const ce = edit ? 'contenteditable="true"' : '';
    const box = (k, cls) => `<div class="pp-box ${cls}${s[k] ? '' : ' empty'}" data-k="${k}" ${ce} data-ph="${PH[k]}">${s[k] || ''}</div>`;
    let inner = box('title', s.layout === 'title' ? 'pp-t-big' : 'pp-t');
    if (s.layout === 'title') inner += box('sub', 'pp-sub');
    if (s.layout === 'content') inner += `<div class="pp-row">${edit ? `<ul class="pp-box pp-body${plain(s.body) ? '' : ' empty'}" data-k="body" ${ce} data-ph="${PH.body}">${s.body || '<li><br></li>'}</ul>` : `<ul class="pp-body">${s.body}</ul>`}${s.img ? `<img class="pp-img" src="${pictureURL(s.img)}" alt="">` : ''}</div>`;
    else if (s.img) inner += `<img class="pp-img pp-img-c" src="${pictureURL(s.img)}" alt="">`;
    return `<div class="pp-sl pp-l-${s.layout}" style="background:${bg};color:${fg};--acc:${acc}">${inner}</div>`;
  }
  function render() {
    $('.pp-thumbs').innerHTML = deck.slides.map((s, i) => `<div class="pp-th${i === cur ? ' on' : ''}" data-i="${i}"><span>${i + 1}${s.trans !== 'none' ? ' ★' : ''}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    $('.pp-slide').innerHTML = slideHtml(deck.slides[cur], true);
    $('.pp-st').textContent = `Slayt ${cur + 1} / ${deck.slides.length}`;
    body.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('on', b.dataset.theme === deck.theme));
    body.querySelectorAll('[data-trans]').forEach((b) => b.classList.toggle('on', b.dataset.trans === deck.slides[cur].trans));
    setTitle(`${dirty ? '*' : ''}${fileName || 'Sunu1'} - Sunu`);
  }
  // Düzenleme alanındaki yazıyı slayda kaydeder (küçük resmi de günceller)
  function pull() {
    const s = deck.slides[cur];
    $('.pp-slide').querySelectorAll('[data-k]').forEach((el) => {
      const k = el.dataset.k;
      s[k] = k === 'body' ? (plain(el.innerHTML) ? el.innerHTML : '') : (plain(el.innerHTML) ? el.innerHTML : '');
      el.classList.toggle('empty', !plain(el.innerHTML));
    });
    const th = $(`.pp-th[data-i="${cur}"] .pp-mini`);
    if (th) th.innerHTML = slideHtml(s, false);
  }
  const changed = () => { dirty = true; setTitle(`*${fileName || 'Sunu1'} - Sunu`); };
  function go(i) { pull(); cur = Math.max(0, Math.min(deck.slides.length - 1, i)); render(); emit('ppt-select', { index: cur }); }

  function load(data, name = null, fld = folder) {
    deck = data ? structuredClone(data) : { theme: 'beyaz', slides: [blank('title')] };
    cur = 0; fileName = name; folder = fld; dirty = false;
    render();
  }

  // ---- Slayt gösterisi ----
  let showAt = -1;
  function showSlide(i, dir = 1) {
    const sh = $('.pp-show');
    if (i >= deck.slides.length) {
      sh.innerHTML = '<div class="pp-end">Slayt gösterisinin sonu. Çıkmak için tıklayın ya da Esc.</div>';
      showAt = deck.slides.length;
      emit('ppt-show-end', { seen: true });
      return;
    }
    showAt = Math.max(0, i);
    const s = deck.slides[showAt];
    sh.innerHTML = `<div class="pp-sh-in pp-tr-${dir > 0 ? s.trans : 'none'}">${slideHtml(s, false)}</div>`;
    emit('ppt-show-slide', { index: showAt, total: deck.slides.length });
  }
  function startShow(from = 0) {
    pull();
    const sh = $('.pp-show');
    sh.hidden = false;
    sh.focus();
    emit('ppt-show-start', { from });
    showSlide(from);
  }
  function endShow() {
    const sh = $('.pp-show');
    if (sh.hidden) return;
    sh.hidden = true;
    emit('ppt-show-exit', { at: showAt, finished: showAt >= deck.slides.length });
    showAt = -1;
    $('.pp-thumbs').focus();
  }
  $('.pp-show').addEventListener('click', () => (showAt >= deck.slides.length ? endShow() : showSlide(showAt + 1)));
  $('.pp-show').addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') return endShow();
    if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) return showAt >= deck.slides.length ? endShow() : showSlide(showAt + 1);
    if (['ArrowLeft', 'ArrowUp', 'Backspace', 'PageUp'].includes(e.key) && showAt > 0) showSlide(showAt - 1, -1);
  });

  // ---- Dosya ----
  const fsApi = desk.fs.dialogApi();
  async function save(asNew) {
    pull();
    if (desk.dialogs.busy) return false;
    const r = fileName && !asNew ? { folder, name: fileName } : await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Sunu1.pptx', ext: '.pptx', typeLabel: 'PowerPoint Sunusu (*.pptx)' });
    if (!r) return false;
    const quick = !!fileName && !asNew;
    desk.fs.write(r.folder, r.name, structuredClone(deck));
    fileName = r.name; folder = r.folder; dirty = false;
    render();
    if (quick) desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
    emit('ppt-save', { name: r.name, folder: r.folder, quick });
    return true;
  }
  async function confirmDiscard() {
    pull();
    if (!dirty) return true;
    const a = await desk.dialogs.ask({ title: 'Sunu', icon: '❓', text: `<b>${esc(fileName || 'Sunu1')}</b> sunusundaki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['no', 'Kaydetme'], ['cancel', 'İptal']] });
    if (a === 'save') return save();
    return a === 'no';
  }
  async function print() {
    pull();
    const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Sunu1' });
    if (r) { desk.toast('Yazdırılıyor', `${deck.slides.length} slayt → ${esc(r.printer)}`, '🖨'); emit('ppt-print', r); }
  }

  // ---- Olaylar ----
  body.addEventListener('mousedown', (e) => {
    if (e.target.closest('.pp-rib button, .pp-tabs button')) e.preventDefault();
    if (!e.target.closest('.pp-menu, .pp-file')) $('.pp-menu').hidden = true;
    if (!e.target.closest('.pp-newwrap')) $('.pp-lay').hidden = true;
  });
  body.addEventListener('click', async (e) => {
    const th = e.target.closest('.pp-th');
    if (th) { go(+th.dataset.i); $('.pp-thumbs').focus(); return; }
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) {
      body.querySelectorAll('.pp-tabs [data-tab]').forEach((b) => b.classList.toggle('on', b === t));
      body.querySelectorAll('.pp-rib').forEach((r) => { r.hidden = r.dataset.tab !== t.dataset.tab; });
      emit('ppt-tab', { tab: t.dataset.tab });
      return;
    }
    if (t.classList.contains('pp-file')) { $('.pp-menu').hidden = !$('.pp-menu').hidden; return; }
    if (t.dataset.file) { $('.pp-menu').hidden = true; if (t.dataset.file === 'print') return print(); return save(t.dataset.file === 'saveas'); }
    if (t.classList.contains('pp-new')) { $('.pp-lay').hidden = !$('.pp-lay').hidden; return; }
    if (t.dataset.layout) {
      $('.pp-lay').hidden = true;
      pull();
      deck.slides.splice(cur + 1, 0, blank(t.dataset.layout));
      cur++;
      changed(); render();
      emit('ppt-new-slide', { layout: t.dataset.layout, index: cur });
      setTimeout(() => $('.pp-slide [data-k="title"]')?.focus(), 0);
      return;
    }
    if (t.dataset.cmd) { document.execCommand(t.dataset.cmd); pull(); changed(); emit('ppt-format', { cmd: t.dataset.cmd }); return; }
    if (t.classList.contains('pp-up') || t.classList.contains('pp-down')) {
      const to = cur + (t.classList.contains('pp-up') ? -1 : 1);
      if (to < 0 || to >= deck.slides.length) return;
      pull();
      [deck.slides[cur], deck.slides[to]] = [deck.slides[to], deck.slides[cur]];
      cur = to; changed(); render();
      emit('ppt-move', { index: cur });
      return;
    }
    if (t.classList.contains('pp-del')) return deleteSlide();
    if (t.dataset.theme) { pull(); deck.theme = t.dataset.theme; changed(); render(); emit('ppt-theme', { theme: deck.theme }); return; }
    if (t.dataset.trans) { pull(); deck.slides[cur].trans = t.dataset.trans; changed(); render(); emit('ppt-trans', { index: cur, trans: t.dataset.trans }); return; }
    if (t.classList.contains('pp-pic')) {
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.jpg', typeLabel: 'Resimler (*.jpg; *.png)', accept: /\.(png|jpe?g|bmp)$/i });
      if (!r) return;
      pull();
      deck.slides[cur].img = desk.fs.find(r.folder, r.name)?.content || { emoji: '🖼', bg: ['#ccc', '#999'] };
      changed(); render();
      emit('ppt-insert', { what: 'picture', name: r.name, index: cur });
      return;
    }
    if (t.classList.contains('pp-play')) return startShow(0);
    if (t.classList.contains('pp-play-cur')) return startShow(cur);
  });
  async function deleteSlide() {
    if (deck.slides.length === 1) { desk.toast('Sunu', 'Sunuda en az bir slayt olmalı.', 'ℹ'); return; }
    deck.slides.splice(cur, 1);
    cur = Math.min(cur, deck.slides.length - 1);
    changed(); render();
    emit('ppt-delete', { index: cur });
  }
  $('.pp-slide').addEventListener('input', () => { pull(); changed(); emit('ppt-input', { index: cur }); });
  $('.pp-slide').addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || ''); });
  // Boş kutudaki yer tutucu yazıya tıklanınca Chrome imleci önceki kutuda bırakabilir: imleç kutunun içine konur
  $('.pp-slide').addEventListener('focusin', (e) => {
    const b = e.target.closest('.pp-box');
    if (!b) return;
    if (b.dataset.k === 'body' && !plain(b.innerHTML)) b.innerHTML = '<li><br></li>';
    const s = getSelection();
    if (!s.rangeCount || !b.contains(s.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(b.dataset.k === 'body' ? b.lastElementChild || b : b);
      r.collapse(false);
      s.removeAllRanges();
      s.addRange(r);
    }
  });
  $('.pp-thumbs').addEventListener('keydown', (e) => {
    if (e.key === 'Delete') { e.preventDefault(); deleteSlide(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
  });
  body.addEventListener('keydown', (e) => {
    if (!$('.pp-show').hidden) return;
    if (e.key === 'F5') { e.preventDefault(); startShow(e.shiftKey ? cur : 0); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.code === 'KeyS') { e.preventDefault(); save(e.shiftKey); }
    if (e.code === 'KeyP') { e.preventDefault(); print(); }
    if (e.code === 'KeyB' || e.code === 'KeyI') { setTimeout(() => { pull(); changed(); }, 0); }
  });

  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content, n.name, n.parent); else load(args.data);

  return {
    info() {
      pull();
      return {
        theme: deck.theme, showing: !$('.pp-show').hidden, fileName,
        slides: deck.slides.map((s) => ({ layout: s.layout, title: plain(s.title), sub: plain(s.sub), items: [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean), img: !!s.img, trans: s.trans })),
      };
    },
    show: () => { if ($('.pp-show').hidden) startShow(0); },
    confirmClose: confirmDiscard,
    focus: () => {},
  };
}
