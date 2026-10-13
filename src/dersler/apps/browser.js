// İnternet tarayıcısı: sekmeler, adres çubuğu (adres mi, arama mı?), geri/ileri, indirmeler, reklamlar,
// ⋯ menüsü, geçmiş, uzantılar (eklentiler), sayfada bul, InPrivate (gizli) pencere, tarayıcı ayarları.
import { SITES, SEARCH_HOST, resolve, PHOTOS, photoContent } from './sites.js';
import { esc, pictureURL } from './util.js';
import { EXTS, INTERNAL, internalPage, applyExtensions } from './uzantilar.js';

let tabSeq = 1;

export function browser({ desk, body, args, emit, setTitle }) {
  body.classList.add('br');
  const priv = !!args.private; // InPrivate: geçmiş tutulmaz
  if (priv) body.classList.add('br-private');
  body.innerHTML = `
    <div class="br-tabs"><div class="br-tablist"></div><button type="button" class="br-newtab" title="Yeni sekme">＋</button></div>
    <div class="br-bar">
      <button type="button" class="br-back" title="Geri">←</button><button type="button" class="br-fwd" title="İleri">→</button><button type="button" class="br-reload" title="Yenile">⟳</button><button type="button" class="br-home" title="Ana sayfa">⌂</button>
      <div class="br-addr"><span class="br-lock"></span><input class="br-url" spellcheck="false" autocomplete="off" aria-label="Adres çubuğu" placeholder="Arama yapın ya da adres yazın"><button type="button" class="br-zoomlbl" hidden title="Yakınlaştırmayı sıfırla (Ctrl + 0)"></button><button type="button" class="br-star" title="Bu sayfayı sık kullanılanlara ekle (Ctrl + D)">☆</button></div>
      <span class="br-pins"></span><button type="button" class="br-ext" title="Uzantılar">🧩</button>
      <button type="button" class="br-cap" title="Web yakalama: sayfanın resmini al (Ctrl + Shift + S)">✂</button><button type="button" class="br-dl" title="İndirmeler (Ctrl + J)">⬇</button>
      ${priv ? '<span class="br-privtag" title="Bu pencerede gezdiğiniz sayfalar geçmişe kaydedilmez">🕶 InPrivate</span>' : ''}<button type="button" class="br-more" title="Ayarlar ve diğer (Alt + F)">⋯</button>
    </div>
    <div class="br-find" hidden><input placeholder="Sayfada bul" spellcheck="false"><span class="br-fcount"></span><button type="button" data-find="-1" title="Önceki (Shift + Enter)">↑</button><button type="button" data-find="1" title="Sonraki (Enter)">↓</button><button type="button" data-find="x" title="Kapat (Esc)">✕</button></div>
    <div class="br-menu" hidden></div>
    <div class="br-extpop" hidden></div>
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
  const downloads = (desk.webDownloads ||= []);
  const history = (desk.webHistory ||= []);
  const notes = (desk.webNotes ||= {});
  const flow = {}; // iç sayfaların geçici durumu (geçmiş araması, temizleme kutusu)
  const ES = () => desk.settings.extensions;

  const fmtUrl = (loc) => (loc.host === INTERNAL ? `${INTERNAL}:/${loc.path}` : loc.host + (loc.path === '/' ? '' : loc.path) + (loc.q ? '?q=' + loc.q : ''));
  const internal = (text) => { const m = /^tarayici:\/\/([\w/-]*)/i.exec(text.trim()); return m && { host: INTERNAL, path: '/' + m[1].toLowerCase(), q: '' }; };

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
    if (!priv && loc.host !== INTERNAL) {
      const d = desk.now();
      history.unshift({ id: Date.now() + Math.random(), url: fmtUrl(loc), title: t.title, time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
      if (history.length > 80) history.pop();
    }
    emit('web-nav', { host: loc.host, path: loc.path, q: loc.q, via, url: fmtUrl(loc), error: loc.host !== INTERNAL && !SITES[loc.host], private: priv });
    if (loc.search) emit('web-search', { q: loc.q });
  }

  function go(text, via = 'address') {
    const loc = internal(text) || resolve(text);
    if (!loc) return;
    navigate(loc, via);
  }

  function show() {
    const t = cur;
    const loc = t.hist[t.idx];
    let title = 'Yeni sekme', html;
    const site = loc && SITES[loc.host];
    if (loc?.host === INTERNAL) {
      const r = internalPage(loc.path, { desk, history, downloads, flow });
      title = r.title;
      html = r.html;
    } else if (!loc && priv) {
      html = `<div class="wp nt priv"><div class="se-logo">🕶 InPrivate</div><p><b>Bu pencereyi kapattığınızda</b> gezdiğiniz sayfalar, çerezler ve formlara yazdıklarınız bu bilgisayardan silinir.</p>
        <ul><li>İndirdiğiniz dosyalar ve sık kullanılanlara eklediğiniz sayfalar <b>kalır</b>.</li><li>Gizli pencere sizi internette <b>görünmez yapmaz</b>: işyeriniz, okulunuz ya da internet sağlayıcınız yine görebilir.</li><li>Başkasının bilgisayarında (kütüphane, internet kafe) e-postanıza girerken işe yarar.</li></ul>
        <form class="se-form big" data-search><input name="q" placeholder="Arama yapın ya da adres yazın" autocomplete="off"><button>🔍 Ara</button></form></div>`;
    } else if (!loc) {
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
    $('.br-lock').innerHTML = !loc ? '🔍' : loc.host === INTERNAL ? '🧭' : !site ? 'ⓘ' : secure ? '🔒' : '<b class="br-insecure">⚠ Güvenli değil</b>';
    t.blocked = applyExtensions(pageEl, desk.settings, notes, loc ? fmtUrl(loc) : '');
    if (t.blocked) emit('ext-block', { count: t.blocked });
    $('.br-back').disabled = t.idx <= 0;
    $('.br-fwd').disabled = t.idx >= t.hist.length - 1;
    $('.br-toolbar').hidden = !desk.settings.toolbar;
    $('.br-pop').hidden = true;
    $('.br-extpop').hidden = true;
    $('.br-menu').hidden = true;
    if (site?.popup) { if (ES().reklam?.on) { t.blocked++; emit('ext-block', { count: t.blocked, popup: true }); } else setTimeout(() => popup(), 600); }
    renderExt();
    if (!$('.br-find').hidden) find($('.br-find input').value, 0);
    renderTabs();
    renderBm();
    applyZoom();
    setTitle(`${title} - İnternet${priv ? ' [InPrivate]' : ''}`);
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

  async function download(name, photo) {
    const content = photo ? photoContent(photo) : /resim/i.test(name) ? { setup: 'viewer' } : /surucu/i.test(name) ? { setup: 'driver' } : '';
    let folder = 'downloads';
    if (desk.settings.askDownload) {
      // Ayarlarda "her indirmeden önce sor" açıksa Farklı Kaydet penceresi çıkar
      const ext = name.slice(name.lastIndexOf('.'));
      const r = await desk.dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder, name, ext, typeLabel: `Dosya (*${ext})` });
      if (!r) return;
      folder = r.folder; name = r.name;
    }
    const node = desk.fs.write(folder, name, content);
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
    if (!e.target.closest('.br-menu, .br-more')) $('.br-menu').hidden = true;
    if (!e.target.closest('.br-extpop, .br-ext, .br-pins')) $('.br-extpop').hidden = true;
    if (extClick(e)) return;
    const a = e.target.closest('[data-href]');
    if (a) {
      e.preventDefault();
      if (a.dataset.ad) emit('web-ad', { url: a.dataset.href });
      if (internal(a.dataset.href)) { navigate(internal(a.dataset.href), 'link'); return; }
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
  // Kötü niyetli uzantı ana sayfayı da değiştirmiştir
  $('.br-home').onclick = () => navigate(ES().indirim?.on ? { host: 'www.super-hizlandirici.xyz', path: '/', q: '' } : { host: SEARCH_HOST, path: '/', q: '' }, 'home');
  $('.br-newtab').onclick = () => { newTab(null); emit('web-tab-new', { count: tabs.length }); };
  $('.br-dl').onclick = () => { const p = $('.br-dlpanel'); if (p.hidden) renderDl(true); else p.hidden = true; };
  $('.br-more').onclick = () => toggleMenu();
  $('.br-ext').onclick = () => extMenu();
  pageEl.addEventListener('scroll', () => {
    const loc = cur.hist[cur.idx];
    const atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 30;
    if (atBottom !== cur.atBottom || !atBottom) emit('web-scroll', { atBottom, host: loc?.host, path: loc?.path, top: pageEl.scrollTop });
    cur.atBottom = atBottom;
  });

  // ---- Sık kullanılanlar (yer imleri) ----
  const bms = (desk.bookmarks ||= []);
  let bmBar = true;
  function renderBm() {
    const u = cur?.hist[cur.idx] ? fmtUrl(cur.hist[cur.idx]) : '';
    const on = bms.some((b) => b.url === u);
    $('.br-star').textContent = on ? '★' : '☆';
    $('.br-star').classList.toggle('on', on);
    $('.br-bm').hidden = !bms.length || !bmBar;
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
    else if (e.code === 'KeyH') { e.preventDefault(); openInternal('gecmis', 'key'); }
    else if (e.code === 'KeyJ') { e.preventDefault(); openInternal('indirilenler', 'key'); }
    else if (e.code === 'KeyF') { e.preventDefault(); openFind(); }
    else if (e.code === 'KeyP') { e.preventDefault(); printPage(); }
    else if (e.code === 'KeyT') { e.preventDefault(); newTab(null); emit('web-tab-new', { count: tabs.length, via: 'key' }); }
    else if (e.code === 'Delete' && e.shiftKey) { e.preventDefault(); flow.clear = true; openInternal('gecmis', 'key'); }
  });
  body.addEventListener('keydown', (e) => { if (e.altKey && e.code === 'KeyF') { e.preventDefault(); toggleMenu(); } });

  // ---- ⋯ Ayarlar ve diğer ----
  const MENU = [
    ['newtab', '＋ Yeni sekme', 'Ctrl+T'], ['private', '🕶 Yeni InPrivate penceresi', 'Ctrl+Shift+N'], '-',
    ['zoom'], '-',
    ['bm', '⭐ Sık kullanılanlar çubuğunu göster/gizle', 'Ctrl+Shift+B'], ['gecmis', '🕘 Geçmiş', 'Ctrl+H'], ['indirilenler', '⬇ İndirilenler', 'Ctrl+J'], ['uzantilar', '🧩 Uzantılar', ''], '-',
    ['print', '🖨 Yazdır', 'Ctrl+P'], ['find', '🔎 Sayfada bul', 'Ctrl+F'], ['capture', '✂ Web yakalama', 'Ctrl+Shift+S'], '-',
    ['ayarlar', '⚙ Ayarlar', ''], ['close', '✕ Tarayıcıyı kapat', ''],
  ];
  function toggleMenu() {
    const m = $('.br-menu');
    if (!m.hidden) { m.hidden = true; return; }
    m.innerHTML = MENU.map((it) => it === '-' ? '<hr>' : it[0] === 'zoom'
      ? `<div class="br-mzoom"><span>🔍 Yakınlaştır</span><button type="button" data-menu="zout" title="Uzaklaştır (Ctrl + -)">−</button><b>%${zoom}</b><button type="button" data-menu="zin" title="Yakınlaştır (Ctrl + +)">＋</button></div>`
      : `<button type="button" data-menu="${it[0]}"><span>${it[1]}</span><kbd>${it[2]}</kbd></button>`).join('');
    m.hidden = false;
    emit('web-menu');
  }
  $('.br-menu').addEventListener('click', (e) => {
    const k = e.target.closest('[data-menu]')?.dataset.menu;
    if (!k) return;
    if (k === 'zin' || k === 'zout') { setZoom(zoom + (k === 'zin' ? 10 : -10)); $('.br-mzoom b').textContent = `%${zoom}`; return; }
    $('.br-menu').hidden = true;
    emit('web-menu-cmd', { cmd: k });
    if (k === 'newtab') { newTab(null); emit('web-tab-new', { count: tabs.length }); }
    else if (k === 'private') { desk.open('browser', { private: true }); emit('web-private'); }
    else if (k === 'bm') { bmBar = !bmBar; renderBm(); }
    else if (k === 'print') printPage();
    else if (k === 'find') openFind();
    else if (k === 'capture') capture();
    else if (k === 'close') desk.close(desk.wins.find((w) => w.api === api));
    else openInternal(k, 'menu');
  });
  function openInternal(p, via) {
    const loc = { host: INTERNAL, path: '/' + p, q: '' };
    const l = cur.hist[cur.idx];
    if (l?.host === INTERNAL || !l) navigate(loc, via); else { newTab(loc); }
    emit('web-internal', { page: p, via });
  }
  async function printPage() {
    const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: cur.title });
    if (r) { desk.toast('Yazdırılıyor', `“${esc(cur.title)}” → ${esc(r.printer)}`, '🖨'); emit('web-print', { ...r, doc: cur.title }); }
  }

  // ---- Uzantılar ----
  function renderExt() {
    const es = ES();
    const pins = Object.keys(es).filter((k) => EXTS[k] && es[k].pin);
    $('.br-pins').innerHTML = pins.map((k) => `<button type="button" data-ext-pop="${k}" class="${es[k].on ? '' : 'off'}" title="${esc(EXTS[k].name)}">${EXTS[k].icon}${k === 'reklam' && es[k].on && cur?.blocked ? `<i>${cur.blocked}</i>` : ''}</button>`).join('');
  }
  function extMenu() {
    const p = $('.br-extpop'), es = ES();
    if (!p.hidden && p.dataset.kind === 'menu') { p.hidden = true; return; }
    const mine = Object.keys(es).filter((k) => EXTS[k]);
    p.dataset.kind = 'menu';
    p.innerHTML = `<b>Uzantılar</b>${mine.length ? mine.map((k) => `<div class="br-xrow ${es[k].on ? '' : 'off'}"><span>${EXTS[k].icon}</span><button type="button" class="br-xname" data-ext-pop="${k}">${esc(EXTS[k].name)}${es[k].on ? '' : ' <small>(kapalı)</small>'}</button><button type="button" data-ext-pin="${k}" class="${es[k].pin ? 'on' : ''}" title="${es[k].pin ? 'Araç çubuğundan kaldır' : 'Araç çubuğuna sabitle'}">📌</button></div>`).join('') : '<p>Hiç uzantı yok.</p>'}
      <hr><button type="button" data-href="${INTERNAL}://magaza">🛍 Uzantı mağazasını aç</button><button type="button" data-href="${INTERNAL}://uzantilar">⚙ Uzantıları yönet</button>`;
    p.hidden = false;
    emit('ext-menu');
  }
  function extPop(k) {
    const p = $('.br-extpop'), e = EXTS[k], x = ES()[k];
    p.dataset.kind = k;
    let h = `<b>${e.icon} ${esc(e.name)}</b>`;
    if (!x.on) h += '<p>Bu uzantı kapalı.</p><button type="button" data-ext-toggle="' + k + '">Aç</button>';
    else if (k === 'reklam') h += `<p>Bu sayfada <b>${cur.blocked || 0}</b> reklam engellendi.</p><button type="button" data-ext-toggle="reklam">Bu uzantıyı duraklat</button>`;
    else if (k === 'karanlik') h += '<p>Sayfalar koyu renkte gösteriliyor.</p><button type="button" data-ext-toggle="karanlik">Kapat</button>';
    else if (k === 'sesli') h += '<p>Sayfada bir bölümü seçip “Seçili yazıyı oku”ya basın; seçmezseniz bütün sayfa okunur.</p><button type="button" data-ext-act="read">▶ Oku</button><button type="button" data-ext-act="stop">■ Durdur</button>';
    else if (k === 'not') h += `<p>Bu sayfa için notunuz:</p><textarea class="br-ntext" rows="3">${esc(notes[api.url] || '')}</textarea><button type="button" data-ext-act="note">💾 Notu kaydet</button>`;
    else if (k === 'indirim') h += '<p class="br-spamtxt">🔥 BUGÜN 3 FIRSAT KAÇIRDINIZ! Premium sürüme geçin, para kazanın!!!</p><button type="button" data-spam="1">PREMIUM AL</button>';
    p.innerHTML = h;
    p.hidden = false;
    emit('ext-pop', { id: k });
  }
  function setExt(k, v) {
    const es = { ...ES() };
    if (v === null) delete es[k]; else es[k] = { ...es[k], ...v };
    desk.settings.extensions = es;
    desk.wins.filter((w) => w.app === 'browser').forEach((w) => w.api.refresh?.());
  }
  async function getExt(k) {
    const e = EXTS[k];
    const ans = await desk.dialogs.ask({ title: 'Uzantı ekle', icon: e.icon, text: `<b>“${esc(e.name)}”</b> eklensin mi?<br>Bu uzantı şunları yapabilir:<ul class="bi-perms ${e.perms.length > 2 ? 'many' : ''}">${e.perms.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`, buttons: [['add', 'Uzantı ekle', true], ['no', 'İptal']] });
    emit('ext-ask', { id: k, ok: ans === 'add', bad: !!e.bad });
    if (ans !== 'add') return;
    setExt(k, { on: true, pin: false });
    desk.toast(`${e.name} eklendi`, 'Araç çubuğundaki 🧩 düğmesinden açıp 📌 ile sabitleyebilirsiniz.', e.icon, 5000);
    emit('ext-install', { id: k, name: e.name, bad: !!e.bad });
  }
  async function delExt(k) {
    const e = EXTS[k];
    const ans = await desk.dialogs.ask({ title: 'Uzantıyı kaldır', icon: e.icon, text: `<b>“${esc(e.name)}”</b> tarayıcıdan kaldırılsın mı?`, buttons: [['del', 'Kaldır', true], ['no', 'İptal']] });
    if (ans !== 'del') return;
    setExt(k, null);
    emit('ext-remove', { id: k, name: e.name, bad: !!e.bad });
  }
  function speak() {
    const sel = getSelection().toString().trim();
    const text = (sel || pageEl.innerText).slice(0, 600);
    if (!('speechSynthesis' in window) || desk.settings.muted || !desk.settings.volume) {
      desk.toast('Sesli Okuma', desk.settings.muted || !desk.settings.volume ? 'Bilgisayarın sesi kapalı. Önce sesi açın.' : 'Bu bilgisayarda konuşma sesi yok.', '🔇', 4000);
    } else {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'tr-TR'; u.volume = desk.settings.volume / 100;
      speechSynthesis.speak(u);
    }
    emit('ext-read', { selected: !!sel, chars: text.length });
  }
  function extClick(e) {
    const t = (sel) => e.target.closest(sel);
    let b;
    if ((b = t('[data-ext-pop]'))) { extPop(b.dataset.extPop); return true; }
    if ((b = t('[data-ext-pin]'))) { const k = b.dataset.extPin; setExt(k, { pin: !ES()[k].pin }); emit('ext-pin', { id: k, pin: ES()[k].pin }); $('.br-extpop').hidden = true; extMenu(); return true; }
    if ((b = t('[data-ext-toggle]'))) { const k = b.dataset.extToggle; setExt(k, { on: !ES()[k].on }); emit('ext-toggle', { id: k, on: ES()[k].on }); $('.br-extpop').hidden = true; return true; }
    if ((b = t('[data-ext-get]'))) { getExt(b.dataset.extGet); return true; }
    if ((b = t('[data-ext-del]'))) { delExt(b.dataset.extDel); return true; }
    if ((b = t('[data-ext-act]'))) {
      const a = b.dataset.extAct;
      if (a === 'read') speak();
      if (a === 'stop') window.speechSynthesis?.cancel();
      if (a === 'note') { const v = $('.br-ntext').value.trim(); if (v) notes[api.url] = v; else delete notes[api.url]; $('.br-extpop').hidden = true; show(); emit('ext-note', { url: api.url, text: v }); }
      return true;
    }
    if (t('[data-spam]')) { emit('web-ad', { url: 'uzanti' }); desk.toast('Bu, uzantının reklamıydı', 'Kötü niyetli uzantılar her sayfaya reklam koyar. 🧩 → Uzantıları yönet → Kaldır.', '⚠', 7000); return true; }
    if ((b = t('[data-hist-del]'))) { const i = history.findIndex((h) => String(h.id) === b.dataset.histDel); if (i >= 0) history.splice(i, 1); show(); emit('web-history-del'); return true; }
    if ((b = t('[data-bi]'))) {
      const a = b.dataset.bi;
      if (a === 'clearOpen') { flow.clear = true; show(); emit('web-clear-open'); }
      if (a === 'clearCancel') { flow.clear = false; show(); }
      if (a === 'clearNow') {
        const what = Object.fromEntries([...pageEl.querySelectorAll('[data-clear]')].map((x) => [x.dataset.clear, x.checked]));
        if (what.history) history.length = 0;
        flow.clear = false;
        show();
        desk.toast('Temizlendi', [what.history && 'Tarama geçmişi', what.cookies && 'çerezler', what.cache && 'önbellek'].filter(Boolean).join(', ') + ' silindi.', '🧹', 4000);
        emit('web-clear', what);
      }
      if (a === 'reset') resetBrowser();
      return true;
    }
    return false;
  }
  async function resetBrowser() {
    const ans = await desk.dialogs.ask({ title: 'Ayarları sıfırla', icon: '↺', text: 'Tarayıcı ayarları ilk hâline dönecek ve <b>bütün uzantılar kapatılacak</b>. Sık kullanılanlar, geçmiş ve şifreler silinmez.', buttons: [['ok', 'Sıfırla', true], ['no', 'İptal']] });
    if (ans !== 'ok') return;
    const es = {};
    for (const [k, v] of Object.entries(ES())) es[k] = { ...v, on: false };
    Object.assign(desk.settings, { extensions: es, startPage: 'home', searchEngine: 'bulalim', askDownload: false });
    desk.wins.filter((w) => w.app === 'browser').forEach((w) => w.api.refresh?.());
    emit('web-reset');
  }
  body.addEventListener('change', (e) => {
    const x = e.target;
    if (x.dataset.extOn) { setExt(x.dataset.extOn, { on: x.checked }); emit('ext-toggle', { id: x.dataset.extOn, on: x.checked }); return; }
    if (x.dataset.bset) { desk.settings[x.dataset.bset] = x.type === 'checkbox' ? x.checked : x.value; emit('web-setting', { key: x.dataset.bset, value: desk.settings[x.dataset.bset] }); }
  });
  body.addEventListener('input', (e) => {
    if (e.target.matches('[data-hist-q]')) {
      flow.histQ = e.target.value;
      const pos = e.target.selectionStart;
      show();
      const inp = pageEl.querySelector('[data-hist-q]');
      inp.focus(); inp.setSelectionRange(pos, pos);
    }
  });

  // ---- Sayfada bul (Ctrl + F) ----
  let hits = [], hitIdx = 0;
  function openFind() {
    const f = $('.br-find');
    f.hidden = false;
    const inp = f.querySelector('input');
    inp.focus(); inp.select();
    emit('web-find-open');
  }
  function clearMarks() {
    pageEl.querySelectorAll('mark.br-hit').forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
    pageEl.normalize();
  }
  function find(q, dir) {
    if (dir === 0 || !hits.length) {
      clearMarks();
      hits = [];
      hitIdx = 0;
      const needle = q.trim().toLocaleLowerCase('tr');
      if (needle) {
        const w = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (w.nextNode()) if (w.currentNode.parentElement.closest('script, style') === null) nodes.push(w.currentNode);
        for (const n of nodes) {
          const low = n.textContent.toLocaleLowerCase('tr');
          let i = low.indexOf(needle), node = n, off = 0;
          while (i >= 0) {
            const r = node.splitText(i - off);
            node = r.splitText(needle.length);
            const m = document.createElement('mark');
            m.className = 'br-hit';
            r.replaceWith(m);
            m.append(r);
            hits.push(m);
            off = i + needle.length;
            i = low.indexOf(needle, off);
          }
        }
      }
    } else hitIdx = (hitIdx + dir + hits.length) % hits.length;
    hits.forEach((m, i) => m.classList.toggle('cur', i === hitIdx));
    hits[hitIdx]?.scrollIntoView({ block: 'center' });
    $('.br-fcount').textContent = q.trim() ? (hits.length ? `${hitIdx + 1}/${hits.length}` : 'Sonuç yok') : '';
    if (dir === 0) emit('web-find', { q: q.trim(), count: hits.length });
  }
  $('.br-find input').addEventListener('input', (e) => find(e.target.value, 0));
  $('.br-find input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); find(e.target.value, e.shiftKey ? -1 : 1); }
    if (e.key === 'Escape') { e.stopPropagation(); closeFind(); }
  });
  function closeFind() { $('.br-find').hidden = true; clearMarks(); hits = []; pageEl.focus({ preventScroll: true }); }
  $('.br-find').addEventListener('click', (e) => {
    const d = e.target.closest('[data-find]')?.dataset.find;
    if (d === 'x') closeFind(); else if (d) find($('.br-find input').value, +d);
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
    refresh: () => { if (cur) show(); },
    destroy: () => window.speechSynthesis?.cancel(),
    get private() { return priv; },
    get blocked() { return cur?.blocked || 0; },
    onArgs: (a) => { if (a.url) newTab(internal(a.url) || resolve(a.url)); },
    go,
    get url() { const l = cur?.hist[cur.idx]; return l ? fmtUrl(l) : ''; },
    get tabs() { return tabs.length; },
  };
  newTab(args.url ? internal(args.url) || resolve(args.url) : priv || desk.settings.startPage === 'newtab' ? null : { host: SEARCH_HOST, path: '/', q: '' }, false);
  return api;
}
