// İnternet tarayıcısı: sekmeler, adres çubuğu (adres mi, arama mı?), geri/ileri, indirmeler, reklamlar.
import { SITES, SEARCH_HOST, resolve, PHOTOS, photoContent } from './sites.js';
import { esc, pictureURL } from './util.js';

let tabSeq = 1;

export function browser({ desk, body, args, emit, setTitle }) {
  body.classList.add('br');
  body.innerHTML = `
    <div class="br-tabs"><div class="br-tablist"></div><button type="button" class="br-newtab" title="Yeni sekme">＋</button></div>
    <div class="br-bar">
      <button type="button" class="br-back" title="Geri">←</button><button type="button" class="br-fwd" title="İleri">→</button><button type="button" class="br-reload" title="Yenile">⟳</button><button type="button" class="br-home" title="Ana sayfa">⌂</button>
      <div class="br-addr"><span class="br-lock"></span><input class="br-url" spellcheck="false" autocomplete="off" aria-label="Adres çubuğu" placeholder="Arama yapın ya da adres yazın"><button type="button" class="br-zoomlbl" hidden title="Yakınlaştırmayı sıfırla (Ctrl + 0)"></button><button type="button" class="br-star" title="Bu sayfayı sık kullanılanlara ekle (Ctrl + D)">☆</button></div>
      <button type="button" class="br-cap" title="Web yakalama: sayfanın resmini al (Ctrl + Shift + S)">✂</button><button type="button" class="br-dl" title="İndirmeler">⬇</button>
    </div>
    <div class="br-bm" hidden></div>
    <div class="br-toolbar" hidden>🔎 Hızlı Arama Araç Çubuğu <input placeholder="Süper Arama" disabled> <span>📢 Reklam: Bugün %90 indirim!</span><span>📢 Kazandınız!</span></div>
    <div class="br-page"></div>
    <div class="br-dlpanel" hidden></div>
    <div class="br-pop" hidden></div>
    <div class="br-ctx" hidden></div>`;
  const $ = (s) => body.querySelector(s);
  const pageEl = $('.br-page'), url = $('.br-url');
  pageEl.tabIndex = -1; // sayfaya tıklanınca odak tarayıcıya gelsin; kısayollar (Ctrl + D, Ctrl + +) çalışsın
  const tabs = [];
  let cur = null;
  const downloads = [];

  const fmtUrl = (loc) => loc.host + (loc.path === '/' ? '' : loc.path) + (loc.q ? '?q=' + loc.q : '');

  function newTab(loc, focus = true) {
    const t = { id: tabSeq++, hist: [], idx: -1, title: 'Yeni sekme' };
    tabs.push(t);
    cur = t;
    if (loc) navigate(loc, 'open');
    else { show(); if (focus) setTimeout(() => url.focus(), 0); }
    return t;
  }

  function navigate(loc, via) {
    const t = cur;
    t.hist = t.hist.slice(0, t.idx + 1);
    t.hist.push(loc);
    t.idx++;
    show();
    emit('web-nav', { host: loc.host, path: loc.path, q: loc.q, via, url: fmtUrl(loc), error: !SITES[loc.host] });
    if (loc.search) emit('web-search', { q: loc.q });
  }

  function go(text, via = 'address') {
    const loc = resolve(text);
    if (!loc) return;
    navigate(loc, via);
  }

  function show() {
    const t = cur;
    const loc = t.hist[t.idx];
    let title = 'Yeni sekme', html;
    const site = loc && SITES[loc.host];
    if (!loc) {
      html = `<div class="wp nt"><div class="se-logo">Bulalım</div><form class="se-form big" data-search><input name="q" placeholder="Arama yapın ya da adres yazın" autocomplete="off"><button>🔍 Ara</button></form>
        <div class="nt-tiles">${[['www.gunun-haberleri.com.tr', '📰', 'Haberler'], ['www.hava-durumu.com.tr', '🌤', 'Hava durumu'], ['www.lezzetli-tarifler.com.tr', '🥘', 'Tarifler']].map(([h, i, l]) => `<a data-href="${h}"><span>${i}</span>${l}</a>`).join('')}</div></div>`;
    } else if (!site) {
      title = loc.host;
      html = `<div class="wp err"><div class="err-ic">😕</div><h1>Bu siteye ulaşılamıyor</h1><p><b>${esc(loc.host)}</b> adresi bulunamadı.</p><ul><li>Adreste yazım hatası olabilir. Harfleri kontrol edin.</li><li>Adresi bilmiyorsanız, adres çubuğuna aradığınız şeyi kelimelerle yazın.</li></ul></div>`;
    } else {
      const r = site.render(loc.path, loc.q || '');
      title = r.title;
      html = r.html;
    }
    t.title = title;
    pageEl.innerHTML = html;
    pageEl.scrollTop = 0;
    if (document.activeElement !== url) url.value = loc ? fmtUrl(loc) : '';
    const secure = site?.secure;
    $('.br-lock').innerHTML = !loc ? '🔍' : !site ? 'ⓘ' : secure ? '🔒' : '<b class="br-insecure">⚠ Güvenli değil</b>';
    $('.br-back').disabled = t.idx <= 0;
    $('.br-fwd').disabled = t.idx >= t.hist.length - 1;
    $('.br-toolbar').hidden = !desk.settings.toolbar;
    $('.br-pop').hidden = true;
    if (site?.popup) setTimeout(() => popup(), 600);
    renderTabs();
    renderBm();
    applyZoom();
    setTitle(`${title} - İnternet`);
  }

  function renderTabs() {
    $('.br-tablist').innerHTML = tabs.map((t) => `<div class="br-tab ${t === cur ? 'on' : ''}" data-tab="${t.id}"><span>${esc(t.title.slice(0, 28))}</span><button type="button" class="br-tabx" data-close="${t.id}" title="Sekmeyi kapat">✕</button></div>`).join('');
  }

  function closeTab(id) {
    const i = tabs.findIndex((t) => t.id === id);
    if (i < 0) return;
    tabs.splice(i, 1);
    emit('web-tab-close', { left: tabs.length });
    if (!tabs.length) { desk.close(desk.wins.find((w) => w.api === api)); return; }
    if (cur.id === id) cur = tabs[Math.max(0, i - 1)];
    show();
  }

  function popup() {
    const p = $('.br-pop');
    p.innerHTML = `<div class="pop-box"><div class="pop-bar">⚠ Windows Güvenlik Uyarısı <button type="button" class="pop-fakex" title="Kapat">✕</button></div>
      <h2>Bilgisayarınızda 5 VİRÜS bulundu!</h2><p>Verileriniz silinmek üzere. HEMEN destek hattını arayın: <b>0850 000 00 00</b></p>
      <button type="button" class="pop-fakeok">Tamam, şimdi temizle</button><p class="scam-note">(Alıştırma: bu bir dolandırıcılık penceresidir. Gerçek Windows uyarıları tarayıcının içinde çıkmaz.)</p></div>`;
    p.hidden = false;
    emit('web-popup');
    p.querySelector('.pop-fakex').onclick = () => { emit('web-popup-click', { what: 'x' }); p.querySelector('h2').textContent = '⚠ Bu pencerenin ✕ işareti de sahte olabilir! En güvenlisi sekmeyi kapatmaktır.'; };
    p.querySelector('.pop-fakeok').onclick = () => emit('web-popup-click', { what: 'ok' });
  }

  function download(name, photo) {
    const content = photo ? photoContent(photo) : /resim/i.test(name) ? { setup: 'viewer' } : /surucu/i.test(name) ? { setup: 'driver' } : '';
    const node = desk.fs.write('downloads', name, content);
    downloads.unshift({ name, id: node.id });
    renderDl(true);
    emit('download', { name, id: node.id });
  }

  function renderDl(open) {
    const p = $('.br-dlpanel');
    p.innerHTML = `<div class="dl-head">İndirilenler <button type="button" class="dl-x">✕</button></div>${downloads.length ? downloads.map((d) => `<div class="dl-item"><span>${/\.(jpe?g|png)$/i.test(d.name) ? '🖼' : '💿'}</span><div><b>${esc(d.name)}</b><small>Tamamlandı</small><div><button type="button" data-open="${d.id}">Dosyayı aç</button><button type="button" data-folder="1">Klasörde göster</button></div></div></div>`).join('') : '<p>Henüz indirme yok.</p>'}`;
    if (open) p.hidden = false;
  }

  body.addEventListener('click', (e) => {
    const a = e.target.closest('[data-href]');
    if (a) {
      e.preventDefault();
      if (a.dataset.ad) emit('web-ad', { url: a.dataset.href });
      const h = a.dataset.href, slash = h.indexOf('/');
      navigate({ host: slash < 0 ? h : h.slice(0, slash), path: slash < 0 ? '/' : h.slice(slash), q: '' }, 'link');
      return;
    }
    const q = e.target.closest('[data-q]');
    if (q) { go(q.dataset.q, 'search'); return; }
    const ad = e.target.closest('button[data-ad]');
    if (ad) {
      emit('web-ad', { url: 'button' });
      desk.toast('Bu bir reklamdı!', 'Büyük, yanıp sönen “İNDİR” düğmeleri çoğu zaman reklamdır. Gerçek indirme bağlantısı genellikle programın adının yazdığı sade bağlantıdır.', '⚠', 8000);
      return;
    }
    const dl = e.target.closest('[data-download]');
    if (dl) { download(dl.dataset.download, dl.dataset.photo); return; }
    const tab = e.target.closest('[data-tab]');
    const x = e.target.closest('[data-close]');
    if (x) { closeTab(+x.dataset.close); return; }
    if (tab) { cur = tabs.find((t) => t.id === +tab.dataset.tab); show(); emit('web-tab-switch'); return; }
    const op = e.target.closest('[data-open]');
    if (op) { $('.br-dlpanel').hidden = true; const n = desk.fs.get(op.dataset.open); if (n) { emit('download-open', { name: n.name }); desk.openNode(n); } return; }
    if (e.target.closest('[data-folder]')) { $('.br-dlpanel').hidden = true; desk.open('explorer', { folder: 'downloads' }); emit('download-folder'); return; }
    if (e.target.closest('.dl-x')) { $('.br-dlpanel').hidden = true; }
  });
  body.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-search]');
    if (!f) return;
    e.preventDefault();
    const q = f.querySelector('input').value.trim();
    if (q) navigate({ host: SEARCH_HOST, path: '/ara', q, search: true }, 'search');
  });
  url.addEventListener('focus', () => setTimeout(() => url.select(), 0));
  url.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); const v = url.value; url.blur(); go(v, 'address'); }
    if (e.key === 'Escape') { url.blur(); show(); }
  });
  $('.br-back').onclick = () => { if (cur.idx > 0) { cur.idx--; show(); emit('web-back'); } };
  $('.br-fwd').onclick = () => { if (cur.idx < cur.hist.length - 1) { cur.idx++; show(); emit('web-fwd'); } };
  $('.br-reload').onclick = () => { show(); emit('web-reload'); };
  $('.br-home').onclick = () => navigate({ host: SEARCH_HOST, path: '/', q: '' }, 'home');
  $('.br-newtab').onclick = () => { newTab(null); emit('web-tab-new', { count: tabs.length }); };
  $('.br-dl').onclick = () => { const p = $('.br-dlpanel'); if (p.hidden) renderDl(true); else p.hidden = true; };
  pageEl.addEventListener('scroll', () => {
    const loc = cur.hist[cur.idx];
    const atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 30;
    if (atBottom !== cur.atBottom || !atBottom) emit('web-scroll', { atBottom, host: loc?.host, path: loc?.path, top: pageEl.scrollTop });
    cur.atBottom = atBottom;
  });

  // ---- Sık kullanılanlar (yer imleri) ----
  const bms = (desk.bookmarks ||= []);
  function renderBm() {
    const u = cur?.hist[cur.idx] ? fmtUrl(cur.hist[cur.idx]) : '';
    const on = bms.some((b) => b.url === u);
    $('.br-star').textContent = on ? '★' : '☆';
    $('.br-star').classList.toggle('on', on);
    $('.br-bm').hidden = !bms.length;
    $('.br-bm').innerHTML = bms.map((b, i) => `<button type="button" data-bm="${i}" title="${esc(b.url)}">⭐ ${esc(b.title.slice(0, 24))}</button>`).join('');
  }
  function bookmark() {
    const loc = cur.hist[cur.idx];
    if (!loc) return;
    const u = fmtUrl(loc), i = bms.findIndex((b) => b.url === u);
    if (i >= 0) { bms.splice(i, 1); emit('web-bookmark', { url: u, removed: true }); }
    else { bms.push({ url: u, title: cur.title }); emit('web-bookmark', { url: u, title: cur.title }); desk.toast('Sık kullanılanlara eklendi', esc(cur.title), '⭐', 3000); }
    renderBm();
  }
  $('.br-star').onclick = bookmark;
  $('.br-bm').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bm]');
    if (!b) return;
    go(bms[+b.dataset.bm].url, 'bookmark');
    emit('web-bookmark-open', { url: bms[+b.dataset.bm].url });
  });

  // ---- Yakınlaştırma (Ctrl + / Ctrl − / Ctrl 0, Ctrl + tekerlek) ----
  let zoom = 100;
  function applyZoom() {
    pageEl.style.zoom = zoom / 100;
    const l = $('.br-zoomlbl');
    l.hidden = zoom === 100;
    l.textContent = `🔍 %${zoom}`;
  }
  function setZoom(z) {
    zoom = Math.max(50, Math.min(200, z));
    applyZoom();
    emit('web-zoom', { zoom });
  }
  $('.br-zoomlbl').onclick = () => setZoom(100);
  pageEl.addEventListener('wheel', (e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); setZoom(zoom + (e.deltaY < 0 ? 10 : -10)); }, { passive: false });

  // ---- Web yakalama: tarayıcının kendi ekran görüntüsü aracı (yalnızca sayfayı alır) ----
  function capture() {
    const s = desk.screen.getBoundingClientRect(), r = pageEl.getBoundingClientRect();
    desk.imageClip = desk.renderScreen({ x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height });
    desk.toast('Web yakalama: sayfanın resmi panoya kopyalandı', `<img class="to-img" src="${desk.imageClip.toDataURL()}" alt="">Paint'te ya da e-postada <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, '✂', 8000);
    emit('web-capture');
  }
  $('.br-cap').onclick = capture;

  body.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') { e.preventDefault(); setZoom(zoom + 10); }
    else if (e.key === '-' || e.code === 'NumpadSubtract') { e.preventDefault(); setZoom(zoom - 10); }
    else if (e.key === '0' || e.code === 'Numpad0') { e.preventDefault(); setZoom(100); }
    else if (e.code === 'KeyD') { e.preventDefault(); bookmark(); }
    else if (e.code === 'KeyS' && e.shiftKey) { e.preventDefault(); capture(); }
  });

  // ---- Sayfada sağ tık: resmi kaydet/kopyala, seçili yazıyı kopyala ----
  const ctx = $('.br-ctx');
  const hideCtx = () => { ctx.hidden = true; };
  pageEl.addEventListener('contextmenu', (e) => {
    const img = e.target.closest('img[data-photo]');
    const text = getSelection().toString().trim();
    if (!img && !text) return;
    e.preventDefault();
    const items = img
      ? [['save', '💾 Resmi farklı kaydet…'], ['copyimg', '⧉ Resmi kopyala'], ['newtab', '↗ Resmi yeni sekmede aç']]
      : [['copy', '⧉ Kopyala <small>Ctrl+C</small>'], ['search', `🔍 Bulalım'da ara: “${esc(text.slice(0, 18))}”`]];
    ctx.innerHTML = items.map(([k, l]) => `<button type="button" data-ctx="${k}">${l}</button>`).join('');
    ctx.dataset.photo = img?.dataset.photo || '';
    ctx.dataset.text = text;
    const b = body.getBoundingClientRect();
    ctx.style.left = Math.min(e.clientX - b.left, b.width - 230) + 'px';
    ctx.style.top = Math.min(e.clientY - b.top, b.height - 120) + 'px';
    ctx.hidden = false;
    emit('web-context', { what: img ? 'image' : 'text' });
  });
  body.addEventListener('mousedown', (e) => { if (!e.target.closest('.br-ctx')) hideCtx(); });
  ctx.addEventListener('mousedown', (e) => e.preventDefault()); // seçili yazı kaybolmasın
  ctx.addEventListener('click', async (e) => {
    const k = e.target.closest('[data-ctx]')?.dataset.ctx;
    if (!k) return;
    hideCtx();
    const id = ctx.dataset.photo, p = PHOTOS[id];
    if (k === 'copy') { document.execCommand('copy'); return; }
    if (k === 'search') { newTab({ host: SEARCH_HOST, path: '/ara', q: ctx.dataset.text, search: true }); return; }
    if (k === 'newtab') { newTab(null); pageEl.innerHTML = `<div class="wp uf-one"><img src="${pictureURL(photoContent(id))}" alt=""></div>`; cur.title = p.name; renderTabs(); return; }
    if (k === 'copyimg') {
      const im = new Image();
      im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0); desk.imageClip = c; desk.toast('Resim kopyalandı', 'Paint\'te ya da e-postada Ctrl + V ile yapıştırabilirsiniz.', '⧉', 4000); emit('web-img-copy', { name: p.name }); };
      im.src = pictureURL(photoContent(id));
      return;
    }
    if (k === 'save') {
      const r = await desk.dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder: 'downloads', name: p.name, ext: '.jpg', typeLabel: 'JPEG resmi (*.jpg)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, photoContent(id));
      desk.toast('Resim kaydedildi', `${esc(r.name)} → ${esc(desk.fs.label(r.folder))}`, '💾', 4000);
      emit('web-img-save', { name: r.name, folder: r.folder });
    }
  });
  pageEl.addEventListener('copy', () => emit('web-copy', { text: getSelection().toString() }));

  const api = {
    onSettings: () => { $('.br-toolbar').hidden = !desk.settings.toolbar; },
    onArgs: (a) => { if (a.url) newTab(resolve(a.url)); },
    go,
    get url() { const l = cur?.hist[cur.idx]; return l ? fmtUrl(l) : ''; },
    get tabs() { return tabs.length; },
  };
  newTab(args.url ? resolve(args.url) : { host: SEARCH_HOST, path: '/', q: '' }, false);
  return api;
}
