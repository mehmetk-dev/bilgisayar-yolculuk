// İnternet tarayıcısı: sekmeler, adres çubuğu (adres mi, arama mı?), geri/ileri, indirmeler, reklamlar.
import { SITES, SEARCH_HOST, resolve } from './sites.js';
import { esc } from './util.js';

let tabSeq = 1;

export function browser({ desk, body, args, emit, setTitle }) {
  body.classList.add('br');
  body.innerHTML = `
    <div class="br-tabs"><div class="br-tablist"></div><button type="button" class="br-newtab" title="Yeni sekme">＋</button></div>
    <div class="br-bar">
      <button type="button" class="br-back" title="Geri">←</button><button type="button" class="br-fwd" title="İleri">→</button><button type="button" class="br-reload" title="Yenile">⟳</button><button type="button" class="br-home" title="Ana sayfa">⌂</button>
      <div class="br-addr"><span class="br-lock"></span><input class="br-url" spellcheck="false" autocomplete="off" aria-label="Adres çubuğu" placeholder="Arama yapın ya da adres yazın"></div>
      <button type="button" class="br-dl" title="İndirmeler">⬇</button>
    </div>
    <div class="br-toolbar" hidden>🔎 Hızlı Arama Araç Çubuğu <input placeholder="Süper Arama" disabled> <span>📢 Reklam: Bugün %90 indirim!</span><span>📢 Kazandınız!</span></div>
    <div class="br-page"></div>
    <div class="br-dlpanel" hidden></div>
    <div class="br-pop" hidden></div>`;
  const $ = (s) => body.querySelector(s);
  const pageEl = $('.br-page'), url = $('.br-url');
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

  function download(name) {
    const content = /resim/i.test(name) ? { setup: 'viewer' } : /surucu/i.test(name) ? { setup: 'driver' } : '';
    const node = desk.fs.write('downloads', name, content);
    downloads.unshift({ name, id: node.id });
    renderDl(true);
    emit('download', { name, id: node.id });
  }

  function renderDl(open) {
    const p = $('.br-dlpanel');
    p.innerHTML = `<div class="dl-head">İndirilenler <button type="button" class="dl-x">✕</button></div>${downloads.length ? downloads.map((d) => `<div class="dl-item"><span>💿</span><div><b>${esc(d.name)}</b><small>Tamamlandı</small><div><button type="button" data-open="${d.id}">Dosyayı aç</button><button type="button" data-folder="1">Klasörde göster</button></div></div></div>`).join('') : '<p>Henüz indirme yok.</p>'}`;
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
    if (dl) { download(dl.dataset.download); return; }
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
