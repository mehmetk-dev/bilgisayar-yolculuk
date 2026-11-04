// Fotoğraflar (Windows 11): solda menü (Tüm fotoğraflar, Favoriler, klasörler), üstte arama, tarihe göre ızgara; görüntüleyicide üst araç çubuğu
// (yakınlaştır, döndür, favori, düzenle, sil, ⋯ menüsünde Yazdır / Farklı ayarla › Arka plan), yanlarda ok düğmeleri ve altta film şeridi.
// PDF okuyucu (Edge PDF görünümüne benzer araç çubuğu) ve Müzik Çalar (Media Player) de bu dosyadadır.
import { esc, pictureURL, isImage, playTune } from './util.js';
import { SYS_ICONS, APP_ICONS } from './appicons.js';
import { ic } from '../w11ikon.js';

const monthOf = (t) => new Date(t || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

function imageViewer(appName, full) {
  return ({ desk, body, args, emit, setTitle }) => {
    body.classList.add('w11a', 'w11ph');
    let node = args.node ? desk.fs.get(args.node) : null;
    let zoom = 1, rot = 0, nav = 'all', query = '', menu = null; // menu: null | 'more' | 'set'
    const favs = (desk.photoFavs ||= new Set());
    const list = () => (node ? desk.fs.children(node.parent).filter((n) => isImage(n.name)) : []);
    const imgs = (id) => desk.fs.children(id).filter((n) => isImage(n.name));
    const folders = () => [['pictures', 'Resimler'], ['downloads', 'İndirilenler'], ...desk.fs.children('pictures').filter((n) => n.type === 'folder').map((n) => [n.id, n.name])];
    const pool = () => {
      if (nav === 'fav') return [...favs].map((id) => desk.fs.get(id)).filter((n) => n && isImage(n.name) && !desk.fs.inRecycle(n.id));
      if (nav === 'all') return folders().flatMap(([id]) => imgs(id));
      return imgs(nav);
    };
    const tile = (n) => `<button type="button" class="w11ph-tile" data-id="${n.id}" title="${esc(n.name)}"><img src="${pictureURL(n.content)}" alt="${esc(n.name)}">${n.content?.video ? `<i class="w11ph-vid">${ic('play')}</i>` : ''}${favs.has(n.id) ? `<i class="w11ph-fav">${ic('heart')}</i>` : ''}<span>${esc(n.name)}</span></button>`;
    function gridHtml() {
      const q = query.toLocaleLowerCase('tr');
      const all = pool().filter((n) => !q || n.name.toLocaleLowerCase('tr').includes(q)).sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
      if (!all.length) return `<p class="w11ph-empty">${q ? 'Aramanızla eşleşen fotoğraf yok.' : nav === 'fav' ? 'Henüz favori fotoğrafınız yok. Bir fotoğrafı açıp kalp simgesine tıklayın.' : 'Bu klasörde fotoğraf yok.'}</p>`;
      const groups = [];
      for (const n of all) { const m = monthOf(n.mtime); let g = groups.find((x) => x[0] === m); if (!g) groups.push(g = [m, []]); g[1].push(n); }
      return groups.map(([m, ns]) => `<h3>${m}</h3><div class="w11ph-grid">${ns.map(tile).join('')}</div>`).join('');
    }
    function render() {
      if (!node || !desk.fs.get(node.id)) {
        node = null;
        setTitle(appName);
        const title = nav === 'all' ? 'Tüm fotoğraflar' : nav === 'fav' ? 'Favoriler' : folders().find((f) => f[0] === nav)?.[1] || 'Fotoğraflar';
        const item = (id, ico, label) => `<button type="button" data-nav="${id}" class="${nav === id ? 'on' : ''}">${ic(ico)}<span>${label}</span></button>`;
        body.innerHTML = `<div class="w11ph-top"><label class="w11ph-search">${ic('search')}<input type="search" class="w11ph-q" placeholder="Fotoğraflarda ara" value="${esc(query)}" autocomplete="off" spellcheck="false" aria-label="Fotoğraflarda ara"></label></div>
          <div class="w11ph-wrap">${full ? `<nav class="w11ph-nav">${item('all', 'images', 'Tüm fotoğraflar')}${item('fav', 'heart', 'Favoriler')}<h4>Klasörler</h4>${folders().map(([id, n]) => item(id, 'folder', esc(n))).join('')}</nav>` : ''}
          <div class="w11ph-main"><h2>${title}</h2><div class="w11ph-gal">${gridHtml()}</div></div></div>`;
        return;
      }
      setTitle(`${node.name} - ${appName}`);
      const l = list();
      const many = l.length > 1;
      const fav = favs.has(node.id);
      const mi = (a, ico, label, extra = '') => `<button type="button" data-a="${a}" role="menuitem">${ic(ico)}<span>${label}</span>${extra}</button>`;
      body.innerHTML = `<div class="w11ph-vtop"><button type="button" class="w11ph-ib" data-a="all" title="Tüm fotoğraflara dön">${ic('back')}</button><span class="w11ph-fname">${esc(node.name)}</span>
          <span class="w11ph-tools"><button type="button" class="w11ph-ib" data-a="out" title="Uzaklaştır">${ic('zoomout')}</button><span class="w11ph-zl">%${Math.round(zoom * 100)}</span><button type="button" class="w11ph-ib" data-a="in" title="Yakınlaştır">${ic('zoomin')}</button><i class="w11ph-sep"></i>
          <button type="button" class="w11ph-ib" data-a="rot" title="Döndür (Ctrl + R)">${ic('rotate')}</button><button type="button" class="w11ph-ib ${fav ? 'on' : ''}" data-a="fav" title="${fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}">${ic('heart')}</button>
          <button type="button" class="w11ph-ib" data-a="edit" title="Paint ile düzenle">${ic('pencil')}</button><button type="button" class="w11ph-ib" data-a="del" title="Sil">${ic('trash')}</button>
          <span class="w11ph-menuwrap"><button type="button" class="w11ph-ib ${menu ? 'on' : ''}" data-a="more" title="Daha fazla" aria-haspopup="menu" aria-expanded="${!!menu}">${ic('more')}</button>
          ${menu ? `<div class="w11ph-menu" role="menu">${mi('print', 'print', 'Yazdır', '<kbd>Ctrl+P</kbd>')}${mi('folder', 'folder', 'Dosya konumunu aç')}<button type="button" data-a="setmenu" role="menuitem" class="${menu === 'set' ? 'on' : ''}">${ic('monitor')}<span>Farklı ayarla</span>${ic('chevright')}</button>
            ${menu === 'set' ? `<div class="w11ph-menu w11ph-sub" role="menu">${mi('wall', 'image', 'Arka plan')}</div>` : ''}</div>` : ''}</span></span></div>
        <div class="w11ph-stage"><button type="button" class="w11ph-arrow l" data-a="prev" title="Önceki fotoğraf" aria-label="Önceki fotoğraf" ${many ? '' : 'disabled'}>${ic('chevleft')}</button>
          <div class="w11ph-img"><img src="${pictureURL(node.content)}" alt="${esc(node.name)}" style="transform:rotate(${rot}deg) scale(${zoom})">${node.content?.video ? `<span class="w11ph-play">${ic('play')}Video (850 MB)</span>` : ''}</div>
          <button type="button" class="w11ph-arrow r" data-a="next" title="Sonraki fotoğraf" aria-label="Sonraki fotoğraf" ${many ? '' : 'disabled'}>${ic('chevright')}</button></div>
        <div class="w11ph-strip">${l.map((n) => `<button type="button" data-id="${n.id}" class="${n.id === node.id ? 'on' : ''}" title="${esc(n.name)}"><img src="${pictureURL(n.content)}" alt=""></button>`).join('')}</div>`;
      body.querySelector('.w11ph-strip .on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
      if (!body.contains(document.activeElement) || document.activeElement === document.body) body.focus({ preventScroll: true });
    }
    const open = (n) => { node = n; zoom = 1; rot = 0; menu = null; render(); emit('photo-open', { name: node.name }); };
    function print() {
      menu = null; render();
      emit('photo-print-open', { name: node.name });
      desk.dialogs.print({ printers: desk.settings.printers, doc: node.name, photo: pictureURL(node.content) }).then((r) => { if (r) { desk.toast('Yazdırılıyor', `“${esc(node.name)}” → ${esc(r.printer)}<br>${r.paper === 'k10' ? '10 × 15 fotoğraf kâğıdı' : `A4, ${r.perPage} fotoğraf`} · ${r.copies} kopya`, SYS_ICONS.printer); emit('photo-print', { ...r, name: node.name }); } });
    }
    body.addEventListener('click', (e) => {
      const nv = e.target.closest('[data-nav]');
      if (nv) { nav = nv.dataset.nav; render(); return; }
      const p = e.target.closest('[data-id]');
      if (p) { open(desk.fs.get(p.dataset.id)); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (!a) { if (menu) { menu = null; render(); } return; }
      if (a === 'print') return print();
      if (a === 'more') { menu = menu ? null : 'more'; render(); return; }
      if (a === 'setmenu') { menu = menu === 'set' ? 'more' : 'set'; render(); return; }
      if (a === 'folder') { menu = null; desk.open('explorer', { folder: node.parent }); render(); return; }
      if (a === 'edit') { desk.open('paint', { node: node.id }); emit('photo-edit', { name: node.name }); return; }
      if (a === 'fav') { if (favs.has(node.id)) favs.delete(node.id); else favs.add(node.id); emit('photo-fav', { name: node.name, on: favs.has(node.id) }); render(); return; }
      if (a === 'del') {
        const del = node;
        desk.dialogs.ask({ title: 'Bu fotoğraf silinsin mi?', icon: SYS_ICONS.recycle, text: `<b>${esc(del.name)}</b> Geri Dönüşüm Kutusu'na taşınacak.`, buttons: [['yes', 'Sil', true], ['no', 'Vazgeç']] }).then((r) => {
          if (r !== 'yes') return;
          const l = list(), i = l.findIndex((n) => n.id === del.id);
          desk.deleteNode(del.id);
          const rest = l.filter((n) => n.id !== del.id);
          node = rest.length ? rest[Math.min(i, rest.length - 1)] : null;
          zoom = 1; rot = 0;
          render();
        });
        return;
      }
      const l = list(), i = l.findIndex((n) => n.id === node.id);
      if (a === 'next' || a === 'prev') { open(l[(i + (a === 'next' ? 1 : -1) + l.length) % l.length]); return; }
      if (a === 'in') zoom = Math.min(3, zoom + 0.25);
      if (a === 'out') zoom = Math.max(0.25, zoom - 0.25);
      if (a === 'rot') rot = (rot + 90) % 360;
      if (a === 'wall') { desk.settings.customWall = pictureURL(node.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: node.name, custom: true }); desk.toast('Arka plan değişti', `${esc(node.name)} masaüstü arka planı yapıldı.`, APP_ICONS.photos); menu = null; }
      if (a === 'all') { node = null; menu = null; }
      if (a === 'in' || a === 'out') emit('photo-zoom', { zoom });
      if (a === 'rot') emit('photo-rotate', { deg: rot });
      render();
    });
    body.addEventListener('input', (e) => {
      if (!e.target.classList.contains('w11ph-q')) return;
      query = e.target.value.trim();
      body.querySelector('.w11ph-gal').innerHTML = gridHtml();
    });
    body.tabIndex = -1;
    body.addEventListener('keydown', (e) => {
      if (!node || e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); body.querySelector(`[data-a="${e.key === 'ArrowRight' ? 'next' : 'prev'}"]`)?.click(); }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyP') { e.preventDefault(); print(); }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyR') { e.preventDefault(); body.querySelector('[data-a="rot"]')?.click(); }
      if (e.key === 'Escape' && menu) { menu = null; render(); }
    });
    render();
    return {
      onArgs: (a) => { if (a.node) { node = desk.fs.get(a.node); render(); } },
      focus: () => { if (desk.dialogs.busy) return; const x = document.activeElement; if (x && body.contains(x) && x.matches('input, textarea, select')) return; body.focus({ preventScroll: true }); },
    };
  };
}

export const photos = imageViewer('Fotoğraflar', true);
export const viewer = imageViewer('Resim Gösterici', false);

export function pdf({ desk, body, args, setTitle, emit }) {
  const n = desk.fs.get(args.node);
  const name = n?.name || 'Belge';
  setTitle(`${name} - PDF Okuyucu`);
  body.classList.add('w11a', 'w11pdf');
  const title = esc(name.replace(/\.pdf$/i, ''));
  const c = n?.content || {};
  // Çok sayfalı belge: content.pages; tek sayfalı: content.html; hiçbiri yoksa örnek belge
  const pages = Array.isArray(c.pages) && c.pages.length ? c.pages : [c.html || `<p>Bu bir örnek PDF belgesidir. PDF dosyaları çoğunlukla fatura, broşür ve resmî yazılar için kullanılır; içindeki yazı değiştirilemez, sadece okunur ve yazdırılır.</p><div class="pdf-lines">${'<i></i>'.repeat(12)}</div>`];
  let at = 0, zoom = 100, rot = c.rot || 0, q = '', cur = 0;
  let tool = null; // 'text' | 'hl' | 'sign': sayfaya tıklayarak yazı, vurgu ya da imza eklenir
  const annots = structuredClone(c.annots || []); // { p: sayfa sırası, t: 'text'|'hl'|'sign', x, y, w?, h?, text? }
  const b = (cls, ico, label, title, extra = '') => `<button type="button" class="${cls}" ${extra} title="${title}">${ic(ico)}${label ? `<span>${label}</span>` : ''}</button>`;
  body.innerHTML = `<div class="w11pdf-bar"><span class="w11pdf-grp">${b('w11pdf-pg', 'chevleft', '', 'Önceki sayfa', 'data-d="-1"')}<span class="w11pdf-pn"></span>${b('w11pdf-pg', 'chevright', '', 'Sonraki sayfa', 'data-d="1"')}</span>
      <i class="w11pdf-sep"></i><span class="w11pdf-grp">${b('w11pdf-zoom', 'minus', '', 'Uzaklaştır', 'data-z="-10"')}<b class="w11pdf-zl">%100</b>${b('w11pdf-zoom', 'plus', '', 'Yakınlaştır', 'data-z="10"')}</span>
      <i class="w11pdf-sep"></i>${b('w11pdf-rot', 'rotate', 'Döndür', 'Sayfayı saat yönünde döndür')}${b('w11pdf-findbtn', 'search', 'Ara', 'Belgede kelime ara (Ctrl + F)')}
      <span class="w11pdf-fill"></span>${b('w11pdf-dl', 'download', 'İndir', 'Belgenin bir kopyasını bilgisayara kaydet (İndirilenler)')}${b('w11pdf-print', 'print', 'Yazdır', 'Kâğıda yazdır (Ctrl + P)')}</div>
    <div class="w11pdf-bar w11pdf-edit"><b class="w11pdf-lbl">${ic('pencil')}Düzenle</b>${b('w11pdf-tool', 'text', 'Yazı ekle', 'Sayfaya tıklayıp yazı yazın (formdaki boşlukları doldurmak için)', 'data-tool="text"')}${b('w11pdf-tool', 'highlight', 'Vurgula', 'Fareyi basılı tutup bir yeri sürükleyerek vurgulayın', 'data-tool="hl"')}${b('w11pdf-tool', 'sign', 'İmza', 'İmza koymak istediğiniz yere tıklayın', 'data-tool="sign"')}
      <i class="w11pdf-sep"></i>${b('w11pdf-undo', 'undo', 'Geri al', 'Son eklenen işareti geri al')}${b('w11pdf-save', 'save', 'Kaydet', 'Düzenlenmiş belgeyi yeni bir dosya olarak kaydet')}<span class="w11pdf-hint"></span></div>
    <div class="w11pdf-find" hidden>${ic('search')}<input class="w11pdf-q" placeholder="Aranacak kelime" autocomplete="off"><span class="w11pdf-fc"></span><button type="button" class="w11pdf-fn" data-d="-1" title="Önceki">${ic('chevup')}</button><button type="button" class="w11pdf-fn" data-d="1" title="Sonraki">${ic('chevdown')}</button><button type="button" class="w11pdf-fx" title="Kapat">${ic('close')}</button></div>
    <div class="pdf-view"><div class="pdf-page"><h2>${ic('pagefile')}${title}</h2><div class="pdf-doc"></div></div></div>`;
  const $ = (x) => body.querySelector(x);
  const low = (t) => String(t).toLocaleLowerCase('tr');
  // Kelimenin her geçtiği yeri <mark> ile boyar; hangi sırada olduğunu bildirir (from: bu sayfadan önceki eşleşme sayısı)
  function mark(html, from) {
    if (!q) return { html, n: 0 };
    const d = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild;
    let k = 0;
    const walk = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    for (const t of nodes) {
      const txt = t.textContent, l = low(txt);
      let i = l.indexOf(low(q)), last = 0;
      if (i < 0) continue;
      const frag = document.createDocumentFragment();
      while (i >= 0) {
        frag.append(txt.slice(last, i));
        const m = document.createElement('mark');
        m.textContent = txt.slice(i, i + q.length);
        if (from + k === cur) m.className = 'cur';
        frag.append(m);
        k++; last = i + q.length; i = l.indexOf(low(q), last);
      }
      frag.append(txt.slice(last));
      t.replaceWith(frag);
    }
    return { html: d.innerHTML, n: k };
  }
  const counts = () => pages.map((h) => mark(h, -1000).n);
  function render() {
    const cts = counts();
    const before = cts.slice(0, at).reduce((a, b) => a + b, 0);
    $('.pdf-doc').innerHTML = mark(pages[at], before).html + `<div class="pdf-ov">${annots.filter((a) => a.p === at).map((a, i) => a.t === 'hl' ? `<span class="pdf-an h" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></span>` : `<span class="pdf-an ${a.t === 'sign' ? 's' : 't'}" style="left:${a.x}px;top:${a.y}px">${esc(a.text)}</span>`).join('')}</div>`;
    body.querySelectorAll('.w11pdf-tool').forEach((b) => b.classList.toggle('on', b.dataset.tool === tool));
    $('.pdf-view').classList.toggle('editing', !!tool);
    $('.w11pdf-hint').textContent = rot % 360 ? 'Önce sayfayı düzeltin (Döndür).' : tool === 'text' ? 'Yazmak istediğiniz yere tıklayın.' : tool === 'hl' ? 'Vurgulanacak yerin üstünde fareyi sürükleyin.' : tool === 'sign' ? 'İmza yerine tıklayın.' : '';
    $('.w11pdf-pn').textContent = `${at + 1} / ${pages.length}`;
    body.querySelectorAll('.w11pdf-pg').forEach((b) => { b.disabled = (b.dataset.d < 0 && at === 0) || (b.dataset.d > 0 && at === pages.length - 1); });
    const total = cts.reduce((a, b) => a + b, 0);
    $('.w11pdf-fc').textContent = q ? (total ? `${Math.min(cur + 1, total)} / ${total}` : 'Bulunamadı') : '';
    $('.pdf-page').style.zoom = zoom / 100;
    $('.pdf-view').style.setProperty('--rot', rot + 'deg');
    $('.pdf-page').classList.toggle('turned', rot % 180 !== 0);
    $('.pdf-page').style.transform = `rotate(${rot}deg)`;
    $('.w11pdf-zl').textContent = `%${zoom}`;
    $('.pdf-doc mark.cur')?.scrollIntoView({ block: 'nearest' });
    return total;
  }
  const goto = (p) => { at = Math.max(0, Math.min(pages.length - 1, p)); render(); emit('pdf-page', { n: at + 1, total: pages.length, name }); };
  function find(dir = 0) {
    const total = counts().reduce((a, b) => a + b, 0);
    cur = total ? (cur + dir + total) % total : 0;
    // geçerli eşleşmenin bulunduğu sayfaya git
    let acc = 0;
    for (let p = 0; p < pages.length; p++) { const k = mark(pages[p], -1000).n; if (cur < acc + k) { at = p; break; } acc += k; }
    render();
    emit('pdf-find', { q, found: total, page: at + 1, name });
  }
  const print = async () => {
    emit('pdf-print-open', { pages: pages.length, name });
    const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: name, pages: pages.length, current: at + 1 });
    if (r) { desk.toast('Yazdırılıyor', `“${esc(name)}” → ${esc(r.printer)}<br>${r.pagesPrinted} sayfa, ${r.sheets} yaprak${r.color ? '' : ', siyah-beyaz'}`, SYS_ICONS.printer); emit('pdf-print', { ...r, name, annots: annots.length }); }
  };
  const openFind = () => { $('.w11pdf-find').hidden = false; $('.w11pdf-q').focus(); $('.w11pdf-q').select(); emit('pdf-find-open'); };
  body.addEventListener('click', (e) => {
    if (e.target.closest('.w11pdf-print')) return print();
    const pg = e.target.closest('.w11pdf-pg');
    if (pg) return goto(at + +pg.dataset.d);
    if (e.target.closest('.w11pdf-findbtn')) return openFind();
    if (e.target.closest('.w11pdf-fx')) { $('.w11pdf-find').hidden = true; q = ''; render(); return; }
    const fn = e.target.closest('.w11pdf-fn');
    if (fn) return find(+fn.dataset.d);
    if (e.target.closest('.w11pdf-rot')) { rot = (rot + 90) % 360; render(); emit('pdf-rotate', { deg: rot, fixed: rot === 0 && (c.rot || 0) !== 0, name }); return; }
    if (e.target.closest('.w11pdf-dl')) {
      const nn = desk.fs.uniqueName('downloads', name);
      const node = desk.fs.create('downloads', { type: 'file', name: nn, content: structuredClone(c) });
      desk.toast('İndirildi', `${esc(nn)} → İndirilenler klasörü`, ic('download'));
      emit('pdf-download', { name: nn, id: node.id });
      return;
    }
    const z = e.target.closest('[data-z]');
    if (z) { zoom = Math.max(50, Math.min(200, zoom + +z.dataset.z)); render(); }
  });
  $('.w11pdf-q').addEventListener('input', (e) => { q = e.target.value; cur = 0; if (q) find(0); else render(); });
  $('.w11pdf-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); find(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') { $('.w11pdf-find').hidden = true; q = ''; render(); } });
  // Düzenleme araçları: tıklanan yer, sayfanın (yakınlaştırmadan bağımsız) koordinatlarına çevrilir
  const at2 = (e) => { const r = $('.pdf-doc').getBoundingClientRect(), k = zoom / 100; return { x: Math.round((e.clientX - r.left) / k), y: Math.round((e.clientY - r.top) / k) }; };
  const add = (a, extra = {}) => { annots.push({ p: at, ...a }); render(); emit('pdf-annot', { kind: a.t, text: a.text || '', count: annots.length, page: at + 1, ...extra }); };
  body.querySelector('.w11pdf-edit').addEventListener('click', async (e) => {
    const tl = e.target.closest('.w11pdf-tool');
    if (tl) { tool = tool === tl.dataset.tool ? null : tl.dataset.tool; render(); emit('pdf-tool', { tool }); return; }
    if (e.target.closest('.w11pdf-undo')) { const i = annots.map((a) => a.p).lastIndexOf(at); if (i >= 0) { annots.splice(i, 1); render(); emit('pdf-undo', { count: annots.length }); } return; }
    if (e.target.closest('.w11pdf-save')) {
      const base = name.replace(/\.pdf$/i, '');
      const r = await desk.dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder: 'docs', name: `${base} (doldurulmuş).pdf`, ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, { ...structuredClone(c), pages, annots: structuredClone(annots) });
      desk.toast('Kaydedildi', `${esc(r.name)}`, ic('save'));
      emit('pdf-save', { name: r.name, folder: r.folder, annots: annots.length });
    }
  });
  $('.pdf-view').addEventListener('pointerdown', (e) => {
    if (!tool || !e.target.closest('.pdf-doc') || e.target.closest('.pdf-ti') || e.button !== 0) return;
    if (rot % 360) { desk.toast('PDF Okuyucu', 'Önce sayfayı Döndür ile düzeltin; sonra yazabilirsiniz.', ic('rotate')); return; }
    e.preventDefault();
    const { x, y } = at2(e);
    if (tool === 'sign') { add({ t: 'sign', x, y: y - 10, text: 'Ahmet Yılmaz' }); return; }
    if (tool === 'text') {
      const inp = document.createElement('input');
      inp.className = 'pdf-ti';
      inp.style.cssText = `left:${x}px;top:${y - 10}px`;
      inp.autocomplete = 'off';
      $('.pdf-ov').append(inp);
      setTimeout(() => inp.focus(), 0);
      let done = false;
      const commit = () => { if (done) return; done = true; const t = inp.value.trim(); inp.remove(); if (t) add({ t: 'text', x, y: y - 10, text: t }); };
      inp.addEventListener('keydown', (ev) => { ev.stopPropagation(); if (ev.key === 'Enter') commit(); if (ev.key === 'Escape') { done = true; inp.remove(); } });
      inp.addEventListener('blur', commit);
      return;
    }
    if (tool === 'hl') {
      const box = document.createElement('span');
      box.className = 'pdf-an h';
      box.style.cssText = `left:${x}px;top:${y}px;width:0;height:0`;
      $('.pdf-ov').append(box);
      const mv = (ev) => { const p = at2(ev); box.style.width = Math.max(0, p.x - x) + 'px'; box.style.height = Math.max(0, p.y - y) + 'px'; };
      const up = (ev) => {
        removeEventListener('pointermove', mv); removeEventListener('pointerup', up);
        const p = at2(ev), w = p.x - x, h = p.y - y;
        box.remove();
        if (w < 20 || h < 6) return;
        // Vurgunun kapladığı yazı: sayfadaki satırlardan kesişenlerin metni
        const R = { l: Math.min(e.clientX, ev.clientX), r: Math.max(e.clientX, ev.clientX), t: Math.min(e.clientY, ev.clientY), b: Math.max(e.clientY, ev.clientY) };
        const covers = [...$('.pdf-doc').querySelectorAll('p, li, td, th, h3')].filter((el) => { const q = el.getBoundingClientRect(); return q.right > R.l && q.left < R.r && q.bottom > R.t && q.top < R.b; }).map((el) => el.textContent).join(' ');
        add({ t: 'hl', x, y, w, h }, { covers });
      };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    }
  });
  body.tabIndex = -1;
  body.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.code === 'KeyP') { e.preventDefault(); print(); }
    if (e.code === 'KeyF') { e.preventDefault(); openFind(); }
  });
  render();
  return { focus: () => {
    if (desk.dialogs.busy) return;
    const a = document.activeElement;
    if (a && body.contains(a) && a.matches('input, textarea, select')) return; // arama kutusunda ya da yazı eklerken odak yerinde kalsın
    body.focus({ preventScroll: true }); // Ctrl + F, Ctrl + P ilk basışta çalışsın
  }, info: () => ({ page: at + 1, total: pages.length, rot, q, annots: annots.length }) };
}

// Müzik Çalar (Windows 11 Media Player): solda menü, ortada parça listesi, altta çalma çubuğu
const fmtT = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export function music({ desk, body, args, emit, setTitle }) {
  const n = args.node ? desk.fs.get(args.node) : null;
  setTitle(`${n?.name || 'Müzik'} - Müzik Çalar`);
  body.classList.add('w11a', 'w11mp');
  const files = desk.fs.children('music').filter((x) => /\.(mp3|m4a|wav)$/i.test(x.name));
  const tracks = [...(n && !files.some((x) => x.id === n.id) ? [n] : []), ...files].map((x) => ({ name: x.name, id: x.id }));
  if (!tracks.length) tracks.push({ name: 'türkü.mp3', id: 'x' });
  let cur = Math.max(0, tracks.findIndex((t) => t.id === n?.id)), playing = false, t0 = 0, dur = 0, timer = 0, page = 'songs';
  const LEN = 3.84; // çalınan kısa melodinin süresi (saniye)
  const nav = (id, ico, label) => `<button type="button" data-page="${id}" class="${page === id ? 'on' : ''}">${ic(ico)}<span>${label}</span></button>`;
  function draw() {
    const t = tracks[cur];
    const s = desk.settings;
    body.innerHTML = `<div class="w11mp-wrap"><nav class="w11mp-nav">${nav('home', 'home', 'Ana sayfa')}${nav('songs', 'music', 'Müzik kitaplığı')}${nav('list', 'playlist', 'Çalma listeleri')}</nav>
      <div class="w11mp-main"><h2>${page === 'home' ? 'Ana sayfa' : page === 'list' ? 'Çalma listeleri' : 'Şarkılar'}</h2>
        ${page === 'list' ? '<p class="w11mp-mut">Henüz çalma listesi yok.</p>' : `<div class="w11mp-act"><button type="button" class="w11mp-big mu-play" data-a="play" title="Çal">${ic(playing ? 'pause' : 'play')}<span>${playing ? 'Duraklat' : 'Çal'}</span></button></div>
        <div class="w11mp-list">${tracks.map((x, i) => `<button type="button" data-i="${i}" class="${i === cur ? 'on' : ''}"><span class="w11mp-n">${i === cur && playing ? ic('vol') : i + 1}</span><b>${esc(x.name)}</b><small>Örnek Müzik</small><small class="w11mp-d">${fmtT(LEN)}</small></button>`).join('')}</div>`}</div></div>
      <div class="w11mp-bar"><div class="w11mp-now"><span class="w11mp-art">${ic('music')}</span><span class="w11mp-tt"><b>${esc(t.name)}</b><small>Örnek Müzik</small></span></div>
        <div class="w11mp-mid"><div class="w11mp-ctl"><button type="button" class="w11mp-ib" data-a="shuf" title="Karıştır">${ic('shuffle')}</button><button type="button" class="w11mp-ib" data-a="prev" title="Önceki">${ic('prev')}</button><button type="button" class="w11mp-pp mu-play" data-a="play" title="${playing ? 'Duraklat' : 'Çal'}" aria-label="${playing ? 'Duraklat' : 'Çal'}">${ic(playing ? 'pause' : 'play')}</button><button type="button" class="w11mp-ib" data-a="next" title="Sonraki">${ic('next')}</button><button type="button" class="w11mp-ib" data-a="rep" title="Tekrarla">${ic('repeat')}</button></div>
          <div class="w11mp-seek"><small class="w11mp-el">0:00</small><i><u></u></i><small>${fmtT(LEN)}</small></div></div>
        <div class="w11mp-vol"><button type="button" class="w11mp-ib" data-a="mute" title="${s.muted ? 'Sesi aç' : 'Sesi kapat'}">${ic(s.muted || !s.volume ? 'volmute' : 'vol')}</button><input type="range" min="0" max="100" value="${s.muted ? 0 : s.volume}" aria-label="Ses düzeyi"><small class="w11mp-vv">${s.muted ? 'Ses kapalı' : s.volume}</small></div></div>`;
    tick();
  }
  function tick() {
    const u = body.querySelector('.w11mp-seek u'), el = body.querySelector('.w11mp-el');
    if (!u) return;
    const p = playing ? Math.min(1, (performance.now() - t0) / (dur * 1000 || 1)) : 0;
    u.style.width = p * 100 + '%';
    el.textContent = fmtT(p * LEN);
  }
  function stop() { playing = false; clearInterval(timer); }
  function play() {
    if (playing) { stop(); draw(); return; }
    const d = playTune(desk, [392, 392, 440, 392, 523, 494, 392, 392, 440, 392, 587, 523], 0.32);
    const bt = desk.settings.btDevices?.find((x) => /Kulaklık|Hoparlör/.test(x));
    emit('music-play', { audible: d > 0, volume: desk.settings.volume, muted: desk.settings.muted, output: bt || 'Bilgisayar hoparlörü' });
    if (bt && d > 0) desk.toast('Ses nereden geliyor?', `Müzik <b>${bt}</b> cihazından çalıyor.`, ic('vol'));
    if (!d) desk.toast('Ses duyulmuyor', 'Ses kapalı ya da sıfırda. Görev çubuğundaki hoparlör simgesinden açabilirsiniz.', ic('volmute'));
    playing = true; t0 = performance.now(); dur = d || LEN;
    draw();
    clearInterval(timer);
    timer = setInterval(() => { if (!body.isConnected) { clearInterval(timer); return; } if (performance.now() - t0 >= dur * 1000) { stop(); draw(); } else tick(); }, 250);
  }
  body.addEventListener('click', (e) => {
    const pg = e.target.closest('[data-page]');
    if (pg) { page = pg.dataset.page; draw(); return; }
    const it = e.target.closest('[data-i]');
    if (it) { cur = +it.dataset.i; stop(); draw(); setTitle(`${tracks[cur].name} - Müzik Çalar`); return; }
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a === 'play') play();
    if (a === 'next' || a === 'prev') { cur = (cur + (a === 'next' ? 1 : -1) + tracks.length) % tracks.length; stop(); draw(); setTitle(`${tracks[cur].name} - Müzik Çalar`); }
    if (a === 'mute') { desk.setSetting('muted', !desk.settings.muted); }
  });
  body.addEventListener('input', (e) => {
    if (e.target.type !== 'range') return;
    desk.setSetting('volume', +e.target.value);
    if (desk.settings.muted) desk.setSetting('muted', false);
    body.querySelector('.w11mp-vv').textContent = e.target.value;
  });
  draw();
  return { onSettings: () => { if (!body.querySelector('input[type=range]:active')) draw(); }, destroy: () => clearInterval(timer) };
}
