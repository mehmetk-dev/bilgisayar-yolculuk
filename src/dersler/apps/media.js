// Fotoğraflar / Resim Gösterici, PDF okuyucu ve müzik çalar
import { esc, pictureURL, isImage, playTune } from './util.js';

function imageViewer(appName) {
  return ({ desk, body, args, emit, setTitle }) => {
    body.classList.add('pv');
    let node = args.node ? desk.fs.get(args.node) : null;
    let zoom = 1;
    const list = () => (node ? desk.fs.children(node.parent).filter((n) => isImage(n.name)) : []);
    function render() {
      if (!node) {
        const pics = desk.fs.children('pictures').filter((n) => isImage(n.name));
        setTitle(appName);
        body.innerHTML = `<div class="pv-gal"><h3>Resimler</h3><div class="pv-grid">${pics.map((n) => `<button type="button" data-id="${n.id}"><img src="${pictureURL(n.content)}" alt=""><span>${esc(n.name)}</span></button>`).join('') || '<p>Resimler klasörü boş.</p>'}</div></div>`;
        return;
      }
      setTitle(`${node.name} - ${appName}`);
      const l = list();
      body.innerHTML = `<div class="pv-bar"><button type="button" data-a="prev" ${l.length > 1 ? '' : 'disabled'}>◀</button><button type="button" data-a="out">－</button><span>%${Math.round(zoom * 100)}</span><button type="button" data-a="in">＋</button><button type="button" data-a="next" ${l.length > 1 ? '' : 'disabled'}>▶</button><button type="button" data-a="print" title="Fotoğrafı kâğıda yazdır">🖨 Yazdır</button><button type="button" data-a="wall">🖼 Arka plan yap</button><button type="button" data-a="all">Tüm resimler</button></div>
        <div class="pv-img"><img src="${pictureURL(node.content)}" alt="${esc(node.name)}" style="transform:scale(${zoom})">${node.content?.video ? '<span class="pv-play">▶ Video (850 MB)</span>' : ''}</div>`;
    }
    body.addEventListener('click', (e) => {
      const p = e.target.closest('[data-id]');
      if (p) { node = desk.fs.get(p.dataset.id); zoom = 1; render(); emit('photo-open', { name: node.name }); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (!a) return;
      if (a === 'print') {
        desk.dialogs.print({ printers: desk.settings.printers, doc: node.name }).then((r) => { if (r) { desk.toast('Yazdırılıyor', `“${esc(node.name)}” → ${esc(r.printer)}`, '🖨'); emit('photo-print', { ...r, name: node.name }); } });
        return;
      }
      const l = list(), i = l.findIndex((n) => n.id === node.id);
      if (a === 'next' || a === 'prev') { node = l[(i + (a === 'next' ? 1 : -1) + l.length) % l.length]; zoom = 1; emit('photo-open', { name: node.name }); }
      if (a === 'in') zoom = Math.min(3, zoom + 0.25);
      if (a === 'out') zoom = Math.max(0.25, zoom - 0.25);
      if (a === 'wall') { desk.settings.customWall = pictureURL(node.content); desk.setSetting('wallpaper', 'custom'); emit('wallpaper', { name: node.name, custom: true }); desk.toast('Arka plan değişti', `${esc(node.name)} masaüstü arka planı yapıldı.`, '🖼'); }
      if (a === 'all') node = null;
      if (a === 'in' || a === 'out') emit('photo-zoom', { zoom });
      render();
    });
    render();
    return { onArgs: (a) => { if (a.node) { node = desk.fs.get(a.node); render(); } } };
  };
}

export const photos = imageViewer('Fotoğraflar');
export const viewer = imageViewer('Resim Gösterici');

export function pdf({ desk, body, args, setTitle, emit }) {
  const n = desk.fs.get(args.node);
  const name = n?.name || 'Belge';
  setTitle(`${name} - PDF Okuyucu`);
  body.classList.add('pdf');
  const title = esc(name.replace(/\.pdf$/i, ''));
  const c = n?.content || {};
  // Çok sayfalı belge: content.pages; tek sayfalı: content.html; hiçbiri yoksa örnek belge
  const pages = Array.isArray(c.pages) && c.pages.length ? c.pages : [c.html || `<p>Bu bir örnek PDF belgesidir. PDF dosyaları çoğunlukla fatura, broşür ve resmî yazılar için kullanılır; içindeki yazı değiştirilemez, sadece okunur ve yazdırılır.</p><div class="pdf-lines">${'<i></i>'.repeat(12)}</div>`];
  let at = 0, zoom = 100, rot = c.rot || 0, q = '', cur = 0;
  let tool = null; // 'text' | 'hl' | 'sign': sayfaya tıklayarak yazı, vurgu ya da imza eklenir
  const annots = structuredClone(c.annots || []); // { p: sayfa sırası, t: 'text'|'hl'|'sign', x, y, w?, h?, text? }
  body.innerHTML = `<div class="pdf-bar"><button type="button" class="pdf-pg" data-d="-1" title="Önceki sayfa">◀</button><span class="pdf-pn"></span><button type="button" class="pdf-pg" data-d="1" title="Sonraki sayfa">▶</button>
      <span class="pdf-sep"></span><button type="button" class="pdf-findbtn" title="Belgede kelime ara (Ctrl + F)">🔍 Ara</button><button type="button" class="pdf-rot" title="Sayfayı saat yönünde döndür">⟳ Döndür</button>
      <span class="pdf-sep"></span><button type="button" class="pdf-dl" title="Belgenin bir kopyasını bilgisayara kaydet (İndirilenler)">⬇ İndir</button><button type="button" class="pdf-print" title="Kâğıda yazdır (Ctrl + P)">🖨 Yazdır</button>
      <span class="pdf-sep"></span><button type="button" class="pdf-zoom" data-z="-10">−</button><b class="pdf-zl">%100</b><button type="button" class="pdf-zoom" data-z="10">+</button></div>
    <div class="pdf-bar pdf-edit"><b>✎ Düzenle:</b><button type="button" class="pdf-tool" data-tool="text" title="Sayfaya tıklayıp yazı yazın (formdaki boşlukları doldurmak için)">T Yazı ekle</button><button type="button" class="pdf-tool" data-tool="hl" title="Fareyi basılı tutup bir yeri sürükleyerek vurgulayın">🖍 Vurgula</button><button type="button" class="pdf-tool" data-tool="sign" title="İmza koymak istediğiniz yere tıklayın">✍ İmza</button>
      <span class="pdf-sep"></span><button type="button" class="pdf-undo" title="Son eklenen işareti geri al">↶ Geri al</button><button type="button" class="pdf-save" title="Düzenlenmiş belgeyi yeni bir dosya olarak kaydet">💾 Kaydet</button><span class="pdf-hint"></span></div>
    <div class="pdf-find" hidden><input class="pdf-q" placeholder="Aranacak kelime" autocomplete="off"><span class="pdf-fc"></span><button type="button" class="pdf-fn" data-d="-1">▲</button><button type="button" class="pdf-fn" data-d="1">▼</button><button type="button" class="pdf-fx" title="Kapat">✕</button></div>
    <div class="pdf-view"><div class="pdf-page"><h2>📕 ${title}</h2><div class="pdf-doc"></div></div></div>`;
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
    body.querySelectorAll('.pdf-tool').forEach((b) => b.classList.toggle('on', b.dataset.tool === tool));
    $('.pdf-view').classList.toggle('editing', !!tool);
    $('.pdf-hint').textContent = rot % 360 ? 'Önce sayfayı düzeltin (⟳ Döndür).' : tool === 'text' ? 'Yazmak istediğiniz yere tıklayın.' : tool === 'hl' ? 'Vurgulanacak yerin üstünde fareyi sürükleyin.' : tool === 'sign' ? 'İmza yerine tıklayın.' : '';
    $('.pdf-pn').textContent = `Sayfa ${at + 1} / ${pages.length}`;
    body.querySelectorAll('.pdf-pg').forEach((b) => { b.disabled = (b.dataset.d < 0 && at === 0) || (b.dataset.d > 0 && at === pages.length - 1); });
    const total = cts.reduce((a, b) => a + b, 0);
    $('.pdf-fc').textContent = q ? (total ? `${Math.min(cur + 1, total)} / ${total}` : 'Bulunamadı') : '';
    $('.pdf-page').style.zoom = zoom / 100;
    $('.pdf-view').style.setProperty('--rot', rot + 'deg');
    $('.pdf-page').classList.toggle('turned', rot % 180 !== 0);
    $('.pdf-page').style.transform = `rotate(${rot}deg)`;
    $('.pdf-zl').textContent = `%${zoom}`;
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
    if (r) { desk.toast('Yazdırılıyor', `“${esc(name)}” → ${esc(r.printer)}<br>${r.pagesPrinted} sayfa, ${r.sheets} yaprak${r.color ? '' : ', siyah-beyaz'}`, '🖨'); emit('pdf-print', { ...r, name, annots: annots.length }); }
  };
  const openFind = () => { $('.pdf-find').hidden = false; $('.pdf-q').focus(); $('.pdf-q').select(); emit('pdf-find-open'); };
  body.addEventListener('click', (e) => {
    if (e.target.closest('.pdf-print')) return print();
    const pg = e.target.closest('.pdf-pg');
    if (pg) return goto(at + +pg.dataset.d);
    if (e.target.closest('.pdf-findbtn')) return openFind();
    if (e.target.closest('.pdf-fx')) { $('.pdf-find').hidden = true; q = ''; render(); return; }
    const fn = e.target.closest('.pdf-fn');
    if (fn) return find(+fn.dataset.d);
    if (e.target.closest('.pdf-rot')) { rot = (rot + 90) % 360; render(); emit('pdf-rotate', { deg: rot, fixed: rot === 0 && (c.rot || 0) !== 0, name }); return; }
    if (e.target.closest('.pdf-dl')) {
      const nn = desk.fs.uniqueName('downloads', name);
      const node = desk.fs.create('downloads', { type: 'file', name: nn, content: structuredClone(c) });
      desk.toast('İndirildi', `${esc(nn)} → İndirilenler klasörü`, '⬇');
      emit('pdf-download', { name: nn, id: node.id });
      return;
    }
    const z = e.target.closest('[data-z]');
    if (z) { zoom = Math.max(50, Math.min(200, zoom + +z.dataset.z)); render(); }
  });
  $('.pdf-q').addEventListener('input', (e) => { q = e.target.value; cur = 0; if (q) find(0); else render(); });
  $('.pdf-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); find(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') { $('.pdf-find').hidden = true; q = ''; render(); } });
  // Düzenleme araçları: tıklanan yer, sayfanın (yakınlaştırmadan bağımsız) koordinatlarına çevrilir
  const at2 = (e) => { const r = $('.pdf-doc').getBoundingClientRect(), k = zoom / 100; return { x: Math.round((e.clientX - r.left) / k), y: Math.round((e.clientY - r.top) / k) }; };
  const add = (a, extra = {}) => { annots.push({ p: at, ...a }); render(); emit('pdf-annot', { kind: a.t, text: a.text || '', count: annots.length, page: at + 1, ...extra }); };
  body.querySelector('.pdf-edit').addEventListener('click', async (e) => {
    const tl = e.target.closest('.pdf-tool');
    if (tl) { tool = tool === tl.dataset.tool ? null : tl.dataset.tool; render(); emit('pdf-tool', { tool }); return; }
    if (e.target.closest('.pdf-undo')) { const i = annots.map((a) => a.p).lastIndexOf(at); if (i >= 0) { annots.splice(i, 1); render(); emit('pdf-undo', { count: annots.length }); } return; }
    if (e.target.closest('.pdf-save')) {
      const base = name.replace(/\.pdf$/i, '');
      const r = await desk.dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder: 'docs', name: `${base} (doldurulmuş).pdf`, ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, { ...structuredClone(c), pages, annots: structuredClone(annots) });
      desk.toast('Kaydedildi', `${esc(r.name)}`, '💾');
      emit('pdf-save', { name: r.name, folder: r.folder, annots: annots.length });
    }
  });
  $('.pdf-view').addEventListener('pointerdown', (e) => {
    if (!tool || !e.target.closest('.pdf-doc') || e.target.closest('.pdf-ti') || e.button !== 0) return;
    if (rot % 360) { desk.toast('PDF Okuyucu', 'Önce sayfayı ⟳ Döndür ile düzeltin; sonra yazabilirsiniz.', '⟳'); return; }
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

export function music({ desk, body, args, emit, setTitle }) {
  const n = args.node ? desk.fs.get(args.node) : null;
  setTitle(`${n?.name || 'Müzik'} - Müzik Çalar`);
  body.classList.add('mu');
  body.innerHTML = `<div class="mu-art">🎵</div><div class="mu-name">${esc(n?.name || 'türkü.mp3')}</div><button type="button" class="mu-play">▶ Çal</button><div class="mu-vol"></div>`;
  const vol = () => { const s = desk.settings; body.querySelector('.mu-vol').textContent = s.muted ? '🔇 Ses kapalı' : `🔊 Ses düzeyi: ${s.volume}`; };
  vol();
  body.querySelector('.mu-play').onclick = () => {
    const d = playTune(desk, [392, 392, 440, 392, 523, 494, 392, 392, 440, 392, 587, 523], 0.32);
    const bt = desk.settings.btDevices?.find((n) => /Kulaklık|Hoparlör/.test(n));
    emit('music-play', { audible: d > 0, volume: desk.settings.volume, muted: desk.settings.muted, output: bt || 'Bilgisayar hoparlörü' });
    if (bt && d > 0) desk.toast('Ses nereden geliyor?', `Müzik <b>${bt}</b> cihazından çalıyor.`, '🎧');
    if (!d) desk.toast('Ses duyulmuyor', 'Ses kapalı ya da sıfırda. Görev çubuğundaki 🔊 simgesinden açabilirsiniz.', '🔇');
  };
  return { onSettings: vol };
}
