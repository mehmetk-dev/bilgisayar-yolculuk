// İnternet tarayıcısı: sekmeler, adres çubuğu (adres mi, arama mı?), geri/ileri, indirmeler, reklamlar;
// ⋯ menüsü, geçmiş, gizli pencere, sayfada bul, yazdırma, uzantılar (uzantı mağazası, izinler, sahte uzantı);
// site bilgileri (kilide tıklayınca: adresin parçaları, sertifika, site izinleri), adres çubuğu önerileri, bildirim izni.
import { SITES, SEARCH_HOST, resolve, PHOTOS, photoContent, siteName } from './sites.js';
import { esc, pictureURL } from './util.js';

let tabSeq = 1;
const EXT_HOST = 'uzantilar.bulalim.com';

// Uzantılar: tarayıcıya eklenen küçük programlar. fake: doğrulanmamış, fazla izin isteyen, zararlı uzantı.
export const EXTS = {
  adblock: { icon: '🛡', name: 'Reklam Kalkanı', pub: 'Kalkan Yazılım', verified: true, users: '10.000.000+', stars: 4.7, desc: 'Sayfalardaki reklamları ve açılır pencereleri gizler.', perms: ['Ziyaret ettiğiniz sitelerdeki reklamları görme ve gizleme'] },
  dark: { icon: '🌙', name: 'Gece Okuma', pub: 'Okuma Araçları', verified: true, users: '2.000.000+', stars: 4.5, desc: 'Beyaz sayfaları koyu renkte gösterir; akşamları gözü yormaz.', perms: ['Sitelerin görünüşünü değiştirme'] },
  reader: { icon: '🔊', name: 'Sesli Okuyucu', pub: 'Erişilebilirlik Derneği', verified: true, users: '800.000+', stars: 4.6, desc: 'Seçtiğiniz yazıyı (seçim yoksa sayfayı) sesli okur. Simgesine tıklayın.', perms: ['Seçtiğiniz yazıyı okuma'] },
  fake: { icon: '⚡', name: 'Süper İndirici PRO', pub: 'free-dl-pro-2026', verified: false, users: '312', stars: 1.9, desc: 'İNDİRMELERİNİZİ 10 KAT HIZLANDIRIR!!! Tamamen BEDAVA!!!', perms: ['Ziyaret ettiğiniz BÜTÜN sitelerdeki verilerinizi okuma ve değiştirme', 'Kayıtlı şifrelerinizi görme', 'İndirmelerinizi yönetme', 'Ana sayfanızı ve arama motorunuzu değiştirme'] },
};
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

export function browser({ desk, body, args, emit, setTitle }) {
  body.classList.add('br');
  body.innerHTML = `
    <div class="br-tabs"><div class="br-tablist"></div><button type="button" class="br-newtab" title="Yeni sekme">＋</button></div>
    <div class="br-bar">
      <button type="button" class="br-back" title="Geri">←</button><button type="button" class="br-fwd" title="İleri">→</button><button type="button" class="br-reload" title="Yenile">⟳</button><button type="button" class="br-home" title="Ana sayfa">⌂</button>
      <div class="br-addr"><button type="button" class="br-lock" title="Site bilgilerini görüntüle"></button><input class="br-url" spellcheck="false" autocomplete="off" aria-label="Adres çubuğu" placeholder="Arama yapın ya da adres yazın"><button type="button" class="br-zoomlbl" hidden title="Yakınlaştırmayı sıfırla (Ctrl + 0)"></button><button type="button" class="br-star" title="Bu sayfayı sık kullanılanlara ekle (Ctrl + D)">☆</button></div>
      <button type="button" class="br-cap" title="Web yakalama: sayfanın resmini al (Ctrl + Shift + S)">✂</button><button type="button" class="br-dl" title="İndirmeler (Ctrl + J)">⬇</button>
      <span class="br-exts"></span><button type="button" class="br-ext" title="Uzantılar">🧩</button><button type="button" class="br-more" title="Ayarlar ve diğer">⋯</button>
    </div>
    <div class="br-bm" hidden></div>
    <div class="br-find" hidden><input class="br-fq" placeholder="Sayfada bul" aria-label="Sayfada bul"><span class="br-fn"></span><button type="button" data-find="-1" title="Önceki">⌃</button><button type="button" data-find="1" title="Sonraki">⌄</button><button type="button" data-find="0" title="Kapat (Esc)">✕</button></div>
    <div class="br-toolbar" hidden>🔎 Hızlı Arama Araç Çubuğu <input placeholder="Süper Arama" disabled> <span>📢 Reklam: Bugün %90 indirim!</span><span>📢 Kazandınız!</span></div>
    <div class="br-page"></div>
    <div class="br-dlpanel" hidden></div>
    <div class="br-pop" hidden></div>
    <div class="br-ctx" hidden></div>
    <div class="br-menu" hidden></div>
    <div class="br-sug" hidden></div>
    <div class="br-info" hidden></div>
    <div class="br-perm" hidden></div>`;
  const $ = (s) => body.querySelector(s);
  const pageEl = $('.br-page'), url = $('.br-url');
  pageEl.tabIndex = -1; // sayfaya tıklanınca odak tarayıcıya gelsin; kısayollar (Ctrl + D, Ctrl + +) çalışsın
  const tabs = [];
  let cur = null;
  const downloads = [];
  const priv = !!args.private; // gizli pencere: geçmiş tutulmaz
  const asked = {};
  if (priv) body.classList.add('br-private');
  const s = desk.settings;
  const extOn = (id) => s.ext[id] === true;
  const history = () => (desk.history ||= []);

  const fmtUrl = (loc) => (loc.host === 'tarayici' ? 'tarayici:/' + loc.path : loc.host === 'dosya' ? 'dosya://' + loc.path : loc.host === 'kaynak' ? 'view-source:dosya://' + loc.path : loc.host + (loc.path === '/' ? '' : loc.path) + (loc.q ? '?q=' + loc.q : ''));
  const internal = (loc) => loc && (loc.host === 'tarayici' || loc.host === EXT_HOST || loc.host === 'dosya' || loc.host === 'kaynak');
  // Bilgisayardaki bir .html dosyasını tarayıcıda açmak: dosya içeriği güvenli bir süzgeçten geçirilip çizilir
  const fileLoc = (node) => ({ host: 'dosya', path: `/C:/Kullanıcılar/${desk.settings.user}/${desk.fs.label(node.parent)}/${node.name}`, q: '', node: node.id });
  function safeHtml(src) {
    const d = new DOMParser().parseFromString(String(src || ''), 'text/html');
    d.querySelectorAll('script, style, iframe, object, embed, link, meta, form, input, button, textarea, select, base, noscript').forEach((e) => e.remove());
    d.querySelectorAll('*').forEach((e) => {
      for (const a of [...e.attributes]) { if (/^on/i.test(a.name) || a.name === 'style' || (a.name === 'href' || a.name === 'src') ) e.removeAttribute(a.name); }
      if (e.tagName === 'A') e.setAttribute('title', 'Bağlantı');
      if (e.tagName === 'IMG') e.remove();
    });
    return { html: d.body.innerHTML, title: d.title };
  }

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
    if (!priv && !internal(loc)) history().unshift({ url: fmtUrl(loc), title: t.title, time: desk.now() });
    emit('web-nav', { host: loc.host, path: loc.path, q: loc.q, via, url: fmtUrl(loc), error: !SITES[loc.host] && !internal(loc), private: priv });
    if (loc.search) emit('web-search', { q: loc.q });
  }

  function go(text, via = 'address') {
    const loc = resolve(text);
    if (!loc) return;
    navigate(loc, via);
  }

  const clockOff = () => Math.abs(desk.now() - Date.now()) > 864e5;
  function show() {
    const t = cur;
    const loc = t.hist[t.idx];
    let title = 'Yeni sekme', html;
    const site = loc && SITES[loc.host];
    if (internal(loc)) {
      ({ title, html } = internalPage(loc));
    } else if (!loc && priv) {
      html = `<div class="wp nt priv"><div class="priv-ic">🕶</div><h1>Gizli pencere</h1><p>Bu pencerede gezdiğiniz sayfalar <b>geçmişe kaydedilmez</b>; pencereyi kapatınca çerezler ve form bilgileri silinir.</p>
        <p><b>Ama görünmez olmazsınız:</b> girdiğiniz siteler, iş yeriniz ya da internet sağlayıcınız ne yaptığınızı yine görebilir. İndirdiğiniz dosyalar ve sık kullanılanlar da kalır.</p>
        <form class="se-form big" data-search><input name="q" placeholder="Arama yapın ya da adres yazın" autocomplete="off"><button>🔍 Ara</button></form></div>`;
    } else if (!loc) {
      html = `<div class="wp nt"><div class="se-logo">Bulalım</div><form class="se-form big" data-search><input name="q" placeholder="Arama yapın ya da adres yazın" autocomplete="off"><button>🔍 Ara</button></form>
        <div class="nt-tiles">${[['www.gunun-haberleri.com.tr', '📰', 'Haberler'], ['www.hava-durumu.com.tr', '🌤', 'Hava durumu'], ['www.lezzetli-tarifler.com.tr', '🥘', 'Tarifler']].map(([h, i, l]) => `<a data-href="${h}"><span>${i}</span>${l}</a>`).join('')}</div></div>`;
    } else if (!site) {
      title = loc.host;
      html = `<div class="wp err"><div class="err-ic">😕</div><h1>Bu siteye ulaşılamıyor</h1><p><b>${esc(loc.host)}</b> adresi bulunamadı.</p><ul><li>Adreste yazım hatası olabilir. Harfleri kontrol edin.</li><li>Adresi bilmiyorsanız, adres çubuğuna aradığınız şeyi kelimelerle yazın.</li></ul></div>`;
    } else if (site.secure && clockOff()) {
      // Bilgisayarın saati/tarihi çok yanlışsa güvenli (https) siteler açılmaz: sertifikanın geçerlilik tarihi kontrol edilir
      title = 'Bağlantınız gizli değil';
      html = `<div class="wp err"><div class="err-ic">🕒⚠</div><h1>Bağlantınız gizli değil</h1><p><b>${esc(loc.host)}</b> sitesinin güvenlik sertifikası doğrulanamadı.</p><p class="mut">NET::ERR_CERT_DATE_INVALID</p>
        <div class="ed-note">Sık görülen bir neden: <b>bilgisayarınızın tarih ve saati yanlış</b>. Bilgisayarınız şu an tarihi <b>${esc(desk.now().toLocaleDateString('tr-TR'))}</b> sanıyor. Sağ alttaki saate bakın.</div>
        <p><button type="button" class="ed-btn" data-clock="settings">🕒 Tarih ve saat ayarlarını aç</button> <button type="button" class="ed-btn ghost" data-clock="retry">⟳ Yeniden dene</button></p></div>`;
      setTimeout(() => emit('web-clock-error', { host: loc.host }), 0);
    } else {
      const r = site.render(loc.path, loc.q || '', webCtx(loc));
      title = r.title;
      html = r.html;
    }
    t.title = title;
    pageEl.innerHTML = html;
    pageEl.scrollTop = 0;
    closeFind();
    // Reklam Kalkanı açıksa reklamlar sayfaya hiç gelmez
    t.blocked = 0;
    if (extOn('adblock') && site) pageEl.querySelectorAll('.ad, [data-ad]').forEach((a) => { a.remove(); t.blocked++; });
    pageEl.classList.toggle('br-darkread', extOn('dark') && !internal(loc));
    clearInterval(t.timer);
    if (site?.mount) t.timer = site.mount(pageEl, webCtx(loc));
    if (document.activeElement !== url) url.value = loc ? fmtUrl(loc) : '';
    const secure = site?.secure;
    $('.br-lock').innerHTML = !loc ? '🔍' : internal(loc) ? (loc.host === EXT_HOST ? '🔒' : '🧭') : !site ? 'ⓘ' : secure ? '🔒' : '<b class="br-insecure">⚠ Güvenli değil</b>';
    $('.br-back').disabled = t.idx <= 0;
    $('.br-fwd').disabled = t.idx >= t.hist.length - 1;
    $('.br-toolbar').hidden = !desk.settings.toolbar;
    $('.br-pop').hidden = true;
    if (site?.popup) {
      if (extOn('adblock') || s.popupBlock) { $('.br-lock').innerHTML += ' <span class="br-popblk" title="Açılır pencere engellendi">🚫🗗</span>'; emit('web-popup-blocked', { by: extOn('adblock') ? 'adblock' : 'settings' }); }
      else setTimeout(() => popup(), 600);
    }
    renderExts();
    $('.br-info').hidden = true;
    if (!$('.br-perm').onclick) $('.br-perm').hidden = true;
    // Bildirim izni pencere başına bir kez sorulur (Engelle/İzin ver denince bir daha sorulmaz)
    if (site?.askNotify && !perms(loc.host).notify && !(asked[loc.host] > 1)) { asked[loc.host] = (asked[loc.host] || 0) + 1; if (asked[loc.host] === 1) setTimeout(() => askNotify(loc.host), 700); }
    renderTabs();
    renderBm();
    applyZoom();
    setTitle(`${title} - İnternet${priv ? ' (Gizli)' : ''}`);
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

  // Sitelerin işlem yapabilmesi için (form, sepet, giriş): sitenin kendi durumu, sayfa değiştirme, indirme
  function webCtx(loc) {
    const ctx = {
      desk, loc, priv,
      state: ((desk.webState ||= {})[siteName(loc.host)] ||= {}),
      emit: (type, data = {}) => emit(type, { host: loc.host, ...data }),
      go: (path, q = '') => navigate({ host: loc.host, path, q }, 'form'),
      visit: (host, path = '/', q = '') => navigate({ host, path, q }, 'form'),
      refresh: () => { const y = pageEl.scrollTop; show(); pageEl.scrollTop = y; },
      download: (name, content) => {
        const node = desk.fs.write('downloads', name, content);
        downloads.unshift({ name, id: node.id });
        renderDl(true);
        emit('download', { name, id: node.id });
        return node;
      },
      perm: (k) => perms(loc.host)[k] || '',
      askPerm: (list, then) => askPerms(loc.host, list, then),
    };
    return ctx;
  }
  // Sayfadaki formun değerleri: name → değer (onay kutusu: true/false, seçenek düğmesi: seçili olanın değeri)
  function formValues(root) {
    const v = {};
    root.querySelectorAll('input[name], select[name], textarea[name]').forEach((el) => {
      if (el.type === 'checkbox') v[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) v[el.name] = el.value; else v[el.name] ??= ''; }
      else v[el.name] = el.value.trim();
    });
    return v;
  }
  function siteAct(el) {
    const loc = cur.hist[cur.idx], site = loc && SITES[loc.host];
    if (!site?.act) return;
    const root = el.closest('form, [data-form]') || pageEl;
    site.act(el.dataset.act, formValues(root), webCtx(loc), el, root);
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

  // ---- Site bilgileri: kilide tıklayınca adresin parçaları, bağlantı, sertifika ve site izinleri ----
  const PERMS = [['location', '📍 Konum'], ['camera', '📷 Kamera'], ['mic', '🎤 Mikrofon'], ['notify', '🔔 Bildirimler']];
  const perms = (host) => ((desk.sitePerms ||= {})[siteName(host)] ||= {});
  // Adresi parçalarına ayırır: https:// · www. · alt alan · alan adı · /yol · ?q=arama
  function urlParts(loc, secure) {
    const host = loc.host, name = siteName(host);
    const sub = host.slice(0, host.length - name.length).replace(/^www\./, '').replace(/\.$/, '');
    const parts = [[secure ? 'https://' : 'http://', 'scheme', secure ? 'şifreli bağlantı (https)' : 'şifresiz bağlantı (http)']];
    if (host.startsWith('www.')) parts.push(['www.', 'www', 'dünya çapında ağ (çoğu adreste olur, önemsiz)']);
    if (sub) parts.push([sub + '.', 'sub', 'alt alan: sitenin sahibi bunu istediği gibi yazabilir!']);
    const dot = name.indexOf('.');
    parts.push([name.slice(0, dot), 'name', 'sitenin adı'], [name.slice(dot), 'tld', 'uzantı: ' + tldInfo(name.slice(dot))]);
    if (loc.path && loc.path !== '/') parts.push([loc.path, 'path', 'sitenin içindeki sayfa']);
    if (loc.q) parts.push(['?q=' + loc.q, 'query', 'aranan sözcük']);
    return parts;
  }
  const tldInfo = (x) => ({ '.gov.tr': 'Türkiye\'de devlet kurumu', '.edu.tr': 'üniversite', '.k12.tr': 'okul', '.bel.tr': 'belediye', '.com.tr': 'Türkiye\'de şirket', '.org.tr': 'Türkiye\'de dernek, vakıf', '.com': 'herkes alabilir', '.xyz': 'herkes ucuza alabilir' })[x] || 'alan adının sonu';
  function siteInfo() {
    const box = $('.br-info');
    if (!box.hidden) { box.hidden = true; return; }
    const loc = cur.hist[cur.idx];
    if (!loc || internal(loc)) return;
    const site = SITES[loc.host];
    if (!site) { box.innerHTML = `<div class="bi-head">ⓘ Site bulunamadı</div><p><b>${esc(loc.host)}</b> diye bir site yok. Adreste yazım hatası olabilir.</p>`; box.hidden = false; return; }
    const name = siteName(loc.host), p = perms(loc.host);
    box.innerHTML = `<div class="bi-head ${site.secure ? 'ok' : 'bad'}">${site.secure ? '🔒 Bağlantı güvenli' : '⚠ Bağlantı güvenli değil'}<button type="button" class="bi-x" title="Kapat">✕</button></div>
      <p class="bi-note">${site.secure ? 'Bu siteye gönderdiğiniz bilgiler yolda şifrelenir; başkaları okuyamaz. <b>Ama kilit, sitenin dürüst olduğunu göstermez!</b> Sahte siteler de kilit alabilir.' : 'Bu siteye girdiğiniz şifre ve kart bilgileri yolda başkaları tarafından görülebilir. <b>Bilgi girmeyin.</b>'}</p>
      <div class="bi-sec">Adresin parçaları</div><div class="bi-url">${urlParts(loc, site.secure).map(([x, k, why]) => `<span class="bu-${k}" title="${esc(why)}">${esc(x)}</span>`).join('')}</div>
      <ul class="bi-legend">${urlParts(loc, site.secure).filter(([, k]) => k !== 'www').map(([x, k, why]) => `<li><span class="bu-${k}">${esc(x)}</span> ${esc(why)}</li>`).join('')}</ul>
      <p class="bi-who">Bu site: <b>${esc(name)}</b></p>
      ${site.secure ? `<div class="bi-sec">Sertifika</div><p class="bi-cert">✔ Geçerli · Kime verildi: <b>${esc(name)}</b></p>` : ''}
      <div class="bi-sec">Bu sitenin izinleri</div>${PERMS.map(([k, l]) => `<label class="bi-perm"><span>${l}</span><select data-perm="${k}">${[['', 'Sor'], ['allow', 'İzin ver'], ['block', 'Engelle']].map(([v, n]) => `<option value="${v}" ${(p[k] || '') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`).join('')}`;
    box.hidden = false;
    emit('web-siteinfo', { host: loc.host, site: name, secure: !!site.secure });
  }
  function setPerm(host, k, v, via) {
    perms(host)[k] = v;
    emit('web-perm', { host, site: siteName(host), perm: k, value: v, via });
  }
  // Birden çok izni birlikte sorar (ör. görüntülü görüşme: kamera ve mikrofon). Cevap then(değer) ile döner.
  const PERM_LABEL = { camera: '📷 Kameranızı kullanmak', mic: '🎤 Mikrofonunuzu kullanmak', location: '📍 Konumunuzu bilmek', notify: '🔔 Bildirim göstermek' };
  function askPerms(host, list, then) {
    const box = $('.br-perm');
    box.innerHTML = `<p><b>${esc(siteName(host))}</b> şunu yapmak istiyor:</p>${list.map((k) => `<p class="bp-what">${PERM_LABEL[k]}</p>`).join('')}<div><button type="button" data-pp="allow">İzin ver</button><button type="button" data-pp="block">Engelle</button></div>`;
    box.hidden = false;
    emit('web-perm-ask', { host, perm: list.join(',') });
    box.onclick = (e) => {
      const v = e.target.closest('[data-pp]')?.dataset.pp;
      if (!v) return;
      box.hidden = true;
      box.onclick = null;
      for (const k of list) setPerm(host, k, v, 'prompt');
      then?.(v);
    };
  }
  function askNotify(host) {
    const loc = cur.hist[cur.idx];
    if (!loc || loc.host !== host) return;
    const box = $('.br-perm');
    box.innerHTML = `<p><b>${esc(siteName(host))}</b> şunu yapmak istiyor:</p><p class="bp-what">🔔 Bildirim göster</p><div><button type="button" data-np="allow">İzin ver</button><button type="button" data-np="block">Engelle</button></div><button type="button" class="bi-x" data-np="close" title="Kapat">✕</button>`;
    box.hidden = false;
    emit('web-perm-ask', { host, perm: 'notify' });
  }
  $('.br-lock').addEventListener('click', siteInfo);
  $('.br-info').addEventListener('click', (e) => { if (e.target.closest('.bi-x')) $('.br-info').hidden = true; });
  $('.br-info').addEventListener('change', (e) => { const k = e.target.dataset.perm; if (k) setPerm(cur.hist[cur.idx].host, k, e.target.value, 'siteinfo'); });
  $('.br-perm').addEventListener('click', (e) => {
    const v = e.target.closest('[data-np]')?.dataset.np;
    if (!v) return;
    $('.br-perm').hidden = true;
    if (v === 'close') { emit('web-perm', { host: cur.hist[cur.idx]?.host, perm: 'notify', value: '', via: 'close' }); return; }
    setPerm(cur.hist[cur.idx].host, 'notify', v, 'prompt');
    if (v === 'allow') desk.toast(`${siteName(cur.hist[cur.idx].host)}`, '🔔 ŞOK İNDİRİM!!! Sepetinizde ürün kaldı! (İzin verdiğiniz için site artık size istediği zaman bildirim gönderebilir.)', '🛒', 7000);
  });

  // ---- Adres çubuğu önerileri: yazarken geçmiş, sık kullanılanlar ve bilinen siteler ----
  const sug = $('.br-sug');
  let sugList = [], sugIdx = -1;
  function suggest() {
    const q = url.value.trim().toLocaleLowerCase('tr');
    if (!q) { sug.hidden = true; sugList = []; return; }
    const seen = new Set();
    const add = (icon, text, sub, kind) => { if (seen.has(text) || sugList.length >= 7) return; seen.add(text); sugList.push({ icon, text, sub, kind }); };
    sugList = [];
    const looks = /\.[a-zçğıöşü]{2,}/i.test(q) && !/\s/.test(q);
    if (!looks) add('🔍', url.value.trim(), 'Bulalım\'da ara', 'search');
    for (const b of desk.bookmarks || []) if (b.url.toLocaleLowerCase('tr').includes(q) || b.title.toLocaleLowerCase('tr').includes(q)) add('⭐', b.url, b.title, 'bookmark');
    if (!priv) for (const h of history()) if (h.url.toLocaleLowerCase('tr').includes(q) || h.title.toLocaleLowerCase('tr').includes(q)) add('🕘', h.url, h.title, 'history');
    for (const [host, st] of Object.entries(SITES)) if (!/\.xyz$|hesap-dogrulama|gov-giris/.test(host) && (host.includes(q) || st.name.toLocaleLowerCase('tr').includes(q))) add('🌐', host, st.name, 'site');
    if (looks) add('🔍', url.value.trim(), 'Bulalım\'da ara', 'search');
    sugIdx = -1;
    sug.innerHTML = sugList.map((x, i) => `<div class="bs-row" data-sug="${i}"><span>${x.icon}</span><b>${esc(x.text)}</b><small>${esc(x.sub)}</small></div>`).join('');
    sug.hidden = !sugList.length;
  }
  function pickSug(i) {
    const x = sugList[i];
    sug.hidden = true;
    if (!x) return;
    url.blur();
    if (x.kind === 'search') navigate({ host: SEARCH_HOST, path: '/ara', q: x.text, search: true }, 'suggest');
    else go(x.text, 'suggest');
  }
  url.addEventListener('input', suggest);
  url.addEventListener('blur', () => setTimeout(() => { sug.hidden = true; }, 150));
  sug.addEventListener('mousedown', (e) => { e.preventDefault(); const r = e.target.closest('[data-sug]'); if (r) pickSug(+r.dataset.sug); });
  url.addEventListener('keydown', (e) => {
    if (sug.hidden || !sugList.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sugIdx = (sugIdx + (e.key === 'ArrowDown' ? 1 : sugList.length - 1) + (sugIdx < 0 && e.key === 'ArrowUp' ? 1 : 0)) % sugList.length;
      sug.querySelectorAll('.bs-row').forEach((r, i) => r.classList.toggle('on', i === sugIdx));
      url.value = sugList[sugIdx].text;
    } else if (e.key === 'Enter' && sugIdx >= 0) { e.preventDefault(); e.stopImmediatePropagation(); pickSug(sugIdx); }
  });
  url.addEventListener('copy', () => emit('web-url-copy', { url: url.value.slice(url.selectionStart, url.selectionEnd) || url.value }));

  // ---- Tarayıcının kendi sayfaları: geçmiş, uzantılar, ayarlar ve uzantı mağazası ----
  // Tarayıcının sakladığı çerezler: girişler ve sepetler sitelerin durumundan, reklam çerezleri desk.cookies'ten gelir; her birinin silinmesi gerçek etkiyi yaratır
  function getCookies() {
    const out = [];
    for (const [site, st] of Object.entries(desk.webState || {})) {
      if (st.user) out.push({ site, name: 'oturum', party: 'first', purpose: 'Giriş yaptığınızı hatırlar: her sayfada yeniden şifre sormaz', del: () => { st.user = false; } });
      if (st.cart?.length) out.push({ site, name: 'sepet', party: 'first', purpose: 'Sepetinizdeki ürünleri hatırlar', del: () => { st.cart = []; } });
    }
    for (const c of desk.cookies || []) out.push({ ...c, del: () => { desk.cookies.splice(desk.cookies.indexOf(c), 1); } });
    return out;
  }
  function internalPage(loc) {
    if (loc.host === 'dosya' || loc.host === 'kaynak') {
      const n = loc.node && desk.fs.get(loc.node);
      const text = typeof n?.content === 'string' ? n.content : '';
      if (loc.host === 'kaynak') return { title: `view-source:${n?.name || ''}`, html: `<div class="wp src"><pre>${esc(text) || '(dosya boş)'}</pre></div>` };
      const r = safeHtml(text);
      return { title: r.title || n?.name || 'Dosya', html: `<div class="wp filepg"><div class="fp-bar">📁 Bu sayfa internette değil, bilgisayarınızdaki bir dosyadır: <b>${esc(n?.name || '')}</b></div><div class="fp-body">${r.html || '<p><i>(Dosya boş)</i></p>'}</div></div>` };
    }
    if (loc.host === EXT_HOST) {
      const id = loc.path.slice(1);
      const x = EXTS[id];
      const btn = (k) => (s.ext[k] !== undefined ? '<button type="button" class="xs-btn" disabled>✔ Eklendi</button>' : `<button type="button" class="xs-btn primary" data-addext="${k}">Tarayıcıya ekle</button>`);
      const head = '<header class="xs-head">🧩 Uzantı Mağazası <a data-href="uzantilar.bulalim.com">Ana sayfa</a></header>';
      if (x) {
        return { title: `${x.name} - Uzantı Mağazası`, html: `<div class="wp xs">${head}<div class="xs-detail"><span class="xs-ic">${x.icon}</span><div><h1>${x.name}</h1>
          <p class="xs-pub">${esc(x.pub)} ${x.verified ? '<b class="xs-ok" title="Yayımcının kimliği doğrulandı">✔ Doğrulanmış yayımcı</b>' : '<b class="xs-no">Doğrulanmamış</b>'}</p>
          <p><span class="xs-stars">${stars(x.stars)}</span> ${String(x.stars).replace('.', ',')} · ${x.users} kullanıcı</p>${btn(id)}</div></div>
          <section><h3>Açıklama</h3><p>${esc(x.desc)}</p></section><section><h3>İstediği izinler</h3><ul>${x.perms.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></section></div>` };
      }
      return { title: 'Uzantı Mağazası', html: `<div class="wp xs">${head}<h1>Tarayıcınıza yeni özellikler ekleyin</h1><p class="xs-tip">Uzantı eklemeden önce bakın: <b>yayımcı doğrulanmış mı?</b> <b>kaç kişi kullanıyor, puanı kaç?</b> <b>hangi izinleri istiyor?</b></p>
        <div class="xs-grid">${Object.entries(EXTS).map(([k, e]) => `<a class="xs-card" data-href="${EXT_HOST}/${k}"><span class="xs-ic">${e.icon}</span><b>${e.name}</b><small>${esc(e.pub)} ${e.verified ? '✔' : ''}</small><small class="xs-stars">${stars(e.stars)} · ${e.users}</small></a>`).join('')}</div></div>` };
    }
    const page = loc.path.slice(1);
    const nav = `<nav class="ti-nav">${[['gecmis', '🕘 Geçmiş'], ['uzantilar', '🧩 Uzantılar'], ['cerezler', '🍪 Çerezler'], ['ayarlar', '⚙ Ayarlar']].map(([k, l]) => `<a data-go="tarayici://${k}" class="${k === page ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
    if (page === 'gecmis') {
      const h = history();
      return { title: 'Geçmiş', html: `<div class="wp ti">${nav}<div class="ti-main"><h1>Geçmiş</h1>${priv ? '<p class="ti-note">🕶 Gizli pencerede gezdikleriniz buraya yazılmaz.</p>' : ''}
        <button type="button" class="xs-btn" data-clear="1">🧹 Göz atma verilerini temizle</button>
        ${h.length ? `<h3>Bugün</h3><div class="ti-hist">${h.map((x, i) => `<div class="ti-row"><span>${x.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span><a data-go="${esc(x.url)}">${esc(x.title)}</a><small>${esc(x.url.split('/')[0])}</small><button type="button" data-hdel="${i}" title="Geçmişten kaldır">✕</button></div>`).join('')}</div>` : '<p class="ti-note">Geçmiş boş.</p>'}</div></div>` };
    }
    if (page === 'uzantilar') {
      const mine = Object.keys(s.ext);
      return { title: 'Uzantılar', html: `<div class="wp ti">${nav}<div class="ti-main"><h1>Uzantılar</h1>
        ${mine.length ? mine.map((k) => `<div class="ti-ext ${EXTS[k].verified ? '' : 'bad'}"><span class="xs-ic">${EXTS[k].icon}</span><div><b>${EXTS[k].name}</b><small>${esc(EXTS[k].desc)}</small>${EXTS[k].verified ? '' : '<small class="xs-no">⚠ Doğrulanmamış yayımcı. Bu uzantıyı siz eklemediyseniz hemen kaldırın.</small>'}</div>
          <label class="ti-tog"><input type="checkbox" data-exttog="${k}" ${extOn(k) ? 'checked' : ''}><i></i></label><button type="button" class="xs-btn" data-extdel="${k}">Kaldır</button></div>`).join('') : '<p class="ti-note">Henüz uzantı eklenmedi.</p>'}
        <p><a class="xs-link" data-href="${EXT_HOST}">🧩 Uzantı Mağazası'nda yeni uzantılar bulun</a></p></div></div>` };
    }
    if (page === 'cerezler') {
      const list = getCookies();
      const third = list.filter((c) => c.party === 'third').length;
      return { title: 'Çerezler ve site verileri', html: `<div class="wp ti">${nav}<div class="ti-main"><h1>Çerezler ve site verileri</h1>
        <p class="ti-note">Çerez, sitelerin tarayıcınıza bıraktığı küçük bir <b>not</b>tur: giriş yaptığınızı, sepetinizi, tercihlerinizi hatırlamak için. Kendi sitenin bıraktığına <b>birinci taraf</b>, sayfaya gömülü başka bir şirketin (genellikle reklam) bıraktığına <b>üçüncü taraf</b> çerez denir.</p>
        <label class="ti-line"><input type="checkbox" data-blockthird="1" ${s.blockThird ? 'checked' : ''}> Üçüncü taraf çerezlerini engelle <small>(reklam şirketlerinin sizi siteden siteye izlemesini zorlaştırır)</small></label>
        <h3>Saklanan çerezler (${list.length})</h3>${list.length ? `<div class="ti-ck">${list.map((c, i) => `<div class="ti-row ck-${c.party}"><b>${esc(c.site)}</b><span class="ck-tag ${c.party}">${c.party === 'third' ? 'Üçüncü taraf' : 'Birinci taraf'}</span><span class="ck-nm">${esc(c.name)}</span><button type="button" data-ckdel="${i}" title="Bu çerezi sil">✕ Sil</button><small>${esc(c.purpose)}${c.interest ? ` <i>(kaydedilen: ${esc(c.interest)})</i>` : ''}</small></div>`).join('')}</div>
        <p><button type="button" class="xs-btn" data-ckall="1">🗑 Tümünü sil</button></p>` : '<p class="ti-note">Saklanan çerez yok.</p>'}
        ${third ? '<p class="ti-note">⚠ Listede <b>üçüncü taraf</b> çerezler var: bunlar sizi başka sitelerde de tanır.</p>' : ''}</div></div>` };
    }
    return { title: 'Ayarlar', html: `<div class="wp ti">${nav}<div class="ti-main"><h1>Ayarlar</h1>
      <section><h3>Gizlilik</h3><label class="ti-line"><input type="checkbox" data-popblock="1" ${s.popupBlock ? 'checked' : ''}> Açılır pencereleri engelle</label>
        <label class="ti-line"><input type="checkbox" data-blockthird="1" ${s.blockThird ? 'checked' : ''}> Üçüncü taraf çerezlerini engelle</label>
        <p><a data-go="tarayici://cerezler">🍪 Çerezler ve site verilerini gör</a></p>
        <button type="button" class="xs-btn" data-clear="1">🧹 Göz atma verilerini temizle</button></section>
      <section><h3>Sıfırla</h3><p class="ti-note">Tarayıcı kendiliğinden değiştiyse (istemediğiniz araç çubuğu, ana sayfa, uzantı) ayarları ilk hâline döndürün.</p>
        <button type="button" class="xs-btn" data-reset="1">↺ Ayarları varsayılanlarına sıfırla</button></section></div></div>` };
  }

  async function addExt(id) {
    const x = EXTS[id];
    const a = await desk.dialogs.ask({ title: 'Uzantı ekle', icon: x.icon, text: `<b>“${x.name}” eklensin mi?</b><br>Şunları yapabilir:<ul>${x.perms.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`, buttons: [['add', 'Uzantı ekle'], ['no', 'İptal', true]] });
    emit('ext-ask', { id, answer: a, fake: !x.verified });
    if (a !== 'add') return;
    s.ext[id] = true;
    if (!x.verified) {
      desk.setSetting('toolbar', true);
      desk.toast('Süper İndirici PRO eklendi', 'Tarayıcınıza bir reklam araç çubuğu geldi ve arka planda bir program çalışmaya başladı. 🧩 → Uzantıları yönet\'den kaldırın.', '😬', 9000);
    } else desk.toast('Uzantı eklendi', `${x.icon} ${x.name} araç çubuğunda. Simgesine tıklayarak kullanabilirsiniz.`, '🧩', 4000);
    emit('ext-add', { id, name: x.name, fake: !x.verified });
    show();
  }
  function setExt(id, on) {
    s.ext[id] = on;
    if (id === 'fake') desk.setSetting('toolbar', on);
    emit('ext-toggle', { id, on });
    refreshAll();
  }
  function delExt(id) {
    delete s.ext[id];
    if (id === 'fake') desk.setSetting('toolbar', false);
    if (id === 'reader') speechSynthesis?.cancel();
    emit('ext-remove', { id, name: EXTS[id].name, fake: !EXTS[id].verified });
    refreshAll();
  }
  // Uzantı değişince açık bütün tarayıcı pencereleri yenilenir
  const refreshAll = () => desk.wins.filter((w) => w.app === 'browser').forEach((w) => w.api.refresh?.());

  async function clearData() {
    const a = await desk.dialogs.ask({ title: 'Göz atma verilerini temizle', icon: '🧹', text: '<b>Şunlar silinecek:</b><ul><li>Göz atma geçmişi</li><li>Çerezler ve site verileri (sitelerdeki oturumlarınız kapanır)</li><li>Önbellekteki resimler ve dosyalar</li></ul>İndirdiğiniz dosyalar ve sık kullanılanlar silinmez.', buttons: [['yes', 'Şimdi temizle', true], ['no', 'İptal']] });
    if (a !== 'yes') return;
    history().length = 0;
    desk.cookies = [];
    desk.webState = {}; // giriş yapılmış oturumlar ve sepetler de çerezlerle birlikte silinir
    desk.toast('Temizlendi', 'Göz atma verileri silindi.', '🧹', 3000);
    emit('web-clear');
    show();
  }

  function renderExts() {
    $('.br-exts').innerHTML = Object.keys(s.ext).filter(extOn).map((k) => `<button type="button" data-extbtn="${k}" title="${EXTS[k].name}">${EXTS[k].icon}${k === 'adblock' && cur?.blocked ? `<sup>${cur.blocked}</sup>` : ''}</button>`).join('');
  }

  // ---- Açılır menüler: ⋯ ve 🧩 ----
  const menu = $('.br-menu');
  function openMenu(kind) {
    if (!menu.hidden && menu.dataset.kind === kind) { menu.hidden = true; return; }
    menu.dataset.kind = kind;
    if (kind === 'more') {
      const items = [['newtab', '＋ Yeni sekme', 'Ctrl+T'], ['private', '🕶 Yeni gizli pencere', 'Ctrl+Shift+N'], '-', ['history', '🕘 Geçmiş', 'Ctrl+H'], ['downloads', '⬇ İndirilenler', 'Ctrl+J'], ['bookmark', '☆ Sık kullanılanlara ekle', 'Ctrl+D'], ['extensions', '🧩 Uzantılar', ''], '-',
        ['zoom', `🔍 Yakınlaştır <span class="br-mz"><button type="button" data-z="-10">−</button> %${zoom} <button type="button" data-z="10">＋</button></span>`, ''], ['print', '🖨 Yazdır', 'Ctrl+P'], ['find', '🔎 Sayfada bul', 'Ctrl+F'], ['source', '</> Sayfa kaynağını görüntüle', 'Ctrl+U'], ['clear', '🧹 Göz atma verilerini temizle', 'Ctrl+Shift+Del'], '-', ['settings', '⚙ Ayarlar', '']];
      menu.innerHTML = items.map((it) => (it === '-' ? '<hr>' : `<div class="br-mi" data-m="${it[0]}" role="button" tabindex="0"><span>${it[1]}</span><kbd>${it[2]}</kbd></div>`)).join('');
    } else {
      const mine = Object.keys(s.ext);
      menu.innerHTML = `<div class="br-mh">Uzantılar</div>${mine.length ? mine.map((k) => `<label class="br-mx"><span>${EXTS[k].icon} ${EXTS[k].name}</span><input type="checkbox" data-exttog="${k}" ${extOn(k) ? 'checked' : ''}></label>`).join('') : '<p class="br-mnone">Eklenmiş uzantı yok.</p>'}
        <hr><div class="br-mi" data-m="extensions" role="button" tabindex="0"><span>⚙ Uzantıları yönet</span></div><div class="br-mi" data-m="extstore" role="button" tabindex="0"><span>🧩 Yeni uzantılar bul</span></div>`;
    }
    menu.hidden = false;
    emit('web-menu', { kind });
  }
  function menuCmd(m) {
    menu.hidden = true;
    emit('web-menu-cmd', { cmd: m });
    if (m === 'newtab') { newTab(null); emit('web-tab-new', { count: tabs.length }); }
    else if (m === 'private') { desk.open('browser', { private: true }); emit('web-private'); }
    else if (m === 'history') newTab({ host: 'tarayici', path: '/gecmis', q: '' });
    else if (m === 'downloads') renderDl(true);
    else if (m === 'bookmark') bookmark();
    else if (m === 'extensions') newTab({ host: 'tarayici', path: '/uzantilar', q: '' });
    else if (m === 'extstore') newTab({ host: EXT_HOST, path: '/', q: '' });
    else if (m === 'settings') newTab({ host: 'tarayici', path: '/ayarlar', q: '' });
    else if (m === 'print') print();
    else if (m === 'find') openFind();
    else if (m === 'clear') clearData();
    else if (m === 'source') viewSource();
  }
  // Sayfa kaynağı (Ctrl + U): sayfanın yazıldığı metin. Bilgisayardaki .html dosyaları için çalışır.
  function viewSource() {
    const loc = cur.hist[cur.idx];
    if (loc?.host === 'dosya') { newTab({ ...loc, host: 'kaynak' }); emit('web-source', { name: desk.fs.get(loc.node)?.name }); return; }
    desk.toast('Sayfa kaynağı', 'Bu alıştırmada yalnızca bilgisayarınızdaki .html dosyalarının kaynağı gösterilir.', '</>', 4500);
  }
  async function print() {
    const r = await desk.dialogs.print({ printers: s.printers, doc: cur.title });
    if (r) { desk.toast('Yazdırılıyor', `“${esc(cur.title)}” → ${esc(r.printer)}`, '🖨'); emit('web-print', { ...r, title: cur.title }); }
  }

  // ---- Sesli Okuyucu ----
  function readAloud() {
    const ss = window.speechSynthesis;
    if (!ss) { desk.toast('Sesli Okuyucu', 'Bu bilgisayarda konuşma desteği yok.', '🔊'); return; }
    if (ss.speaking) { ss.cancel(); emit('ext-read', { stop: true }); return; }
    if (s.muted || !s.volume) { desk.toast('Ses kapalı', 'Sesli Okuyucu\'yu duymak için sesi açın.', '🔇'); return; }
    const sel = getSelection().toString().trim();
    const text = (sel || pageEl.innerText).slice(0, 700);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    u.volume = s.volume / 100;
    u.rate = 0.95;
    ss.speak(u);
    emit('ext-read', { selection: !!sel, text: text.slice(0, 80) });
  }

  // ---- Sayfada bul (Ctrl + F) ----
  const findBar = $('.br-find'), fq = $('.br-fq');
  let hits = [], hitIdx = 0;
  function clearMarks() {
    pageEl.querySelectorAll('mark.br-hit').forEach((m) => { const p = m.parentNode; m.replaceWith(m.textContent); p.normalize(); });
    hits = [];
  }
  function runFind(q) {
    clearMarks();
    const needle = q.trim().toLocaleLowerCase('tr');
    if (needle) {
      const walk = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walk.nextNode()) nodes.push(walk.currentNode);
      for (const n of nodes) {
        const low = n.textContent.toLocaleLowerCase('tr');
        let i = low.indexOf(needle), node = n, offset = 0;
        while (i >= 0) {
          const after = node.splitText(i - offset);
          node = after.splitText(needle.length);
          const m = document.createElement('mark');
          m.className = 'br-hit';
          after.replaceWith(m);
          m.append(after);
          hits.push(m);
          offset = i + needle.length;
          i = low.indexOf(needle, offset);
        }
      }
    }
    hitIdx = 0;
    focusHit();
    emit('web-find', { q, count: hits.length });
  }
  function focusHit() {
    hits.forEach((h, i) => h.classList.toggle('on', i === hitIdx));
    $('.br-fn').textContent = fq.value.trim() ? `${hits.length ? hitIdx + 1 : 0}/${hits.length}` : '';
    $('.br-fn').classList.toggle('none', !!fq.value.trim() && !hits.length);
    hits[hitIdx]?.scrollIntoView({ block: 'center' });
  }
  function openFind() { findBar.hidden = false; fq.focus(); fq.select(); emit('web-find-open'); }
  function closeFind() { if (findBar.hidden) return; clearMarks(); findBar.hidden = true; }
  fq.addEventListener('input', () => runFind(fq.value));
  fq.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (hits.length) { hitIdx = (hitIdx + (e.shiftKey ? hits.length - 1 : 1)) % hits.length; focusHit(); } }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFind(); }
  });
  findBar.addEventListener('click', (e) => {
    const d = e.target.closest('[data-find]')?.dataset.find;
    if (d === undefined) return;
    if (d === '0') { closeFind(); return; }
    if (hits.length) { hitIdx = (hitIdx + +d + hits.length) % hits.length; focusHit(); }
  });

  body.addEventListener('change', (e) => {
    const k = e.target.dataset.exttog;
    if (k) { setExt(k, e.target.checked); return; }
    if (e.target.dataset.popblock) { s.popupBlock = e.target.checked; emit('web-popup-setting', { on: s.popupBlock }); }
    if (e.target.dataset.blockthird) {
      s.blockThird = e.target.checked;
      if (s.blockThird) desk.cookies = (desk.cookies || []).filter((c) => c.party !== 'third');
      emit('cookie-block-third', { on: s.blockThird });
      show();
    }
  });

  body.addEventListener('click', (e) => {
    if (!e.target.closest('.br-menu, .br-more, .br-ext')) menu.hidden = true;
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go, 'link'); return; }
    const mi = e.target.closest('[data-m]');
    if (mi && !e.target.closest('[data-z]')) { menuCmd(mi.dataset.m); return; }
    const z = e.target.closest('[data-z]');
    if (z) { setZoom(zoom + +z.dataset.z); menu.querySelector('.br-mz').innerHTML = `<button type="button" data-z="-10">−</button> %${zoom} <button type="button" data-z="10">＋</button>`; return; }
    if (e.target.closest('.br-more')) { openMenu('more'); return; }
    if (e.target.closest('.br-ext')) { openMenu('ext'); return; }
    const xb = e.target.closest('[data-extbtn]');
    if (xb) {
      const k = xb.dataset.extbtn;
      if (k === 'reader') readAloud();
      else if (k === 'adblock') desk.toast('Reklam Kalkanı', `Bu sayfada <b>${cur.blocked || 0}</b> reklam engellendi.`, '🛡', 3000);
      else if (k === 'dark') setExt('dark', false);
      else desk.toast('Süper İndirici PRO', 'REKLAMSIZ SÜRÜM İÇİN ŞİMDİ ÖDEYİN!!! (İşte zararlı uzantı böyle davranır.)', '⚡', 5000);
      emit('ext-click', { id: k });
      return;
    }
    if (e.target.closest('[data-addext]')) { addExt(e.target.closest('[data-addext]').dataset.addext); return; }
    if (e.target.closest('[data-extdel]')) { delExt(e.target.closest('[data-extdel]').dataset.extdel); return; }
    if (e.target.closest('[data-clear]')) { clearData(); return; }
    const cd = e.target.closest('[data-ckdel]');
    if (cd) { const c = getCookies()[+cd.dataset.ckdel]; if (c) { c.del(); emit('cookie-delete', { site: c.site, name: c.name, party: c.party }); show(); } return; }
    if (e.target.closest('[data-ckall]')) { const n = getCookies().length; desk.cookies = []; desk.webState = {}; emit('cookie-clear-all', { count: n }); show(); return; }
    const hd = e.target.closest('[data-hdel]');
    if (hd) { history().splice(+hd.dataset.hdel, 1); show(); emit('web-history-del'); return; }
    if (e.target.closest('[data-reset]')) {
      for (const k of Object.keys(s.ext)) if (!EXTS[k].verified) delete s.ext[k];
      s.popupBlock = false;
      desk.setSetting('toolbar', false);
      desk.toast('Tarayıcı sıfırlandı', 'İstenmeyen araç çubuğu ve doğrulanmamış uzantılar kaldırıldı.', '↺', 4000);
      emit('web-reset');
      refreshAll();
    }
  });
  menu.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.dataset.m) menuCmd(e.target.dataset.m); });

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
    const ck = e.target.closest('[data-clock]');
    if (ck) { if (ck.dataset.clock === 'settings') desk.open('settings', { page: 'time' }); else { show(); emit('web-reload'); } return; }
    const sa = e.target.closest('.br-page [data-act]');
    if (sa && sa.tagName !== 'FORM' && !sa.disabled) { e.preventDefault(); siteAct(sa); return; }
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
    if (e.target.dataset.act) { e.preventDefault(); siteAct(e.target); return; }
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
    else if (e.code === 'KeyF') { e.preventDefault(); openFind(); }
    else if (e.code === 'KeyU') { e.preventDefault(); menuCmd('source'); }
    else if (e.code === 'KeyH') { e.preventDefault(); menuCmd('history'); }
    else if (e.code === 'KeyJ') { e.preventDefault(); menuCmd('downloads'); }
    else if (e.code === 'KeyP') { e.preventDefault(); print(); }
    else if (e.code === 'KeyT') { e.preventDefault(); menuCmd('newtab'); }
    else if (e.code === 'KeyW') { e.preventDefault(); closeTab(cur.id); }
    else if (e.code === 'KeyN' && e.shiftKey) { e.preventDefault(); menuCmd('private'); }
    else if (e.code === 'Delete' && e.shiftKey) { e.preventDefault(); clearData(); }
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
    refresh: () => { const y = pageEl.scrollTop; show(); pageEl.scrollTop = y; },
    destroy: () => { if (s.ext.reader) window.speechSynthesis?.cancel(); },
    get private() { return priv; },
    get findCount() { return hits.length; },
    onArgs: (a) => { if (a.url) newTab(resolve(a.url)); if (a.file) { const n = desk.fs.get(a.file); if (n) newTab(fileLoc(n)); } },
    go,
    get url() { const l = cur?.hist[cur.idx]; return l ? fmtUrl(l) : ''; },
    get tabs() { return tabs.length; },
  };
  const fileNode = args.file && desk.fs.get(args.file);
  newTab(fileNode ? fileLoc(fileNode) : args.url ? resolve(args.url) : priv ? null : { host: SEARCH_HOST, path: '/', q: '' }, false);
  return api;
}
