// Sunu: PowerPoint benzeri program. Slayt düzenleri (başlık, başlık ve içerik, yalnızca başlık), tasarım temaları,
// resim ekleme, slayt geçişleri, slayt sırasını değiştirme ve silme, slayt gösterisi (F5); .pptx olarak kaydetme, yazdırma.
// Asıl Slayt (yazı tipi, başlık rengi, logo, alt bilgi bütün slaytlara birden), slayda tablo ve grafik (sütun / pasta).
import { esc, pictureURL, playTune, wait, isImage } from './util.js';

const THEMES = [
  ['beyaz', 'Office', '#ffffff', '#1f1f1f', '#c55a11'],
  ['mavi', 'Okyanus', 'linear-gradient(135deg,#0b3d91,#1e88e5)', '#ffffff', '#ffd54f'],
  ['yesil', 'Bahar', 'linear-gradient(135deg,#e8f5e9,#a5d6a7)', '#1b5e20', '#2e7d32'],
  ['gece', 'Gece', 'linear-gradient(135deg,#1a1a2e,#3a3a6e)', '#f5f5f5', '#ff8a65'],
];
const LAYOUTS = { title: 'Başlık slaytı', content: 'Başlık ve içerik', two: 'İki içerik', only: 'Yalnızca başlık', photo: 'Fotoğraf ve yazı', blank: 'Boş' };
const ANIMS = [['none', 'Yok'], ['fade', 'Belirme'], ['left', 'Soldan gel'], ['zoom', 'Büyüme']];
const ARTS = { liste: 'Liste (renkli kutular)', surec: 'Süreç (oklu adımlar)', agac: 'Soy ağacı / şema' };
const SIZES = [['S', 'Küçük'], ['M', 'Orta'], ['L', 'Büyük']];
const ART_COLORS = ['#2e7d32', '#1565c0', '#e46c0a', '#7030a0', '#c62828', '#00838f'];
const TRANS = [['none', 'Yok'], ['fade', 'Solma'], ['push', 'İtme'], ['zoom', 'Yakınlaştır']];
const FONTS = [['calibri', 'Calibri', 'Calibri, Carlito, "Noto Sans", sans-serif'], ['georgia', 'Georgia', 'Georgia, "DejaVu Serif", serif'], ['verdana', 'Verdana', 'Verdana, "DejaVu Sans", sans-serif'], ['comic', 'Comic Sans', '"Comic Sans MS", "Comic Neue", cursive']];
const MCOLORS = [['#1f3864', 'Lacivert'], ['#c00000', 'Koyu kırmızı'], ['#375623', 'Koyu yeşil'], ['#7030a0', 'Mor'], ['', 'Temanın rengi']];
const TABLES = [[2, 3], [3, 3], [3, 4], [4, 4]];
const CHARTS = [['bar', 'Sütun grafiği'], ['pie', 'Pasta grafiği']];
const CHART_DEMO = [['Kategori 1', 4], ['Kategori 2', 3], ['Kategori 3', 5], ['Kategori 4', 2]];
const PH = { title: 'Başlık eklemek için tıklayın', sub: 'Alt başlık eklemek için tıklayın', body: 'Metin eklemek için tıklayın', body2: 'Metin eklemek için tıklayın', cap: 'Tarih ve kısa bir not yazın' };
const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.innerText.trim(); };

export function slides({ desk, body, args, emit, setTitle }) {
  body.classList.add('pp');
  body.innerHTML = `
    <div class="pp-tabs"><button type="button" class="pp-file">Dosya</button><button type="button" data-tab="home" class="on">Giriş</button><button type="button" data-tab="insert">Ekle</button><button type="button" data-tab="design">Tasarım</button><button type="button" data-tab="trans">Geçişler</button><button type="button" data-tab="anim">Animasyonlar</button><button type="button" data-tab="show">Slayt Gösterisi</button><button type="button" data-tab="view">Görünüm</button><button type="button" data-tab="master" class="pp-mtab" hidden>Asıl Slayt</button></div>
    <div class="pp-rib" data-tab="home"><span class="pp-newwrap"><button type="button" class="pp-new">➕ Yeni Slayt ▾</button><span class="pp-lay" hidden>${Object.entries(LAYOUTS).map(([k, v]) => `<button type="button" data-layout="${k}">${v}</button>`).join('')}</span></span>
      <button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button>
      <button type="button" class="pp-dup" title="Seçili slaydın bir kopyasını hemen altına ekler">⧉ Slaytı Çoğalt</button><button type="button" class="pp-up" title="Slaytı yukarı taşı">▲ Yukarı</button><button type="button" class="pp-down" title="Slaytı aşağı taşı">▼ Aşağı</button><button type="button" class="pp-del" title="Slaytı sil">🗑 Sil</button></div>
    <div class="pp-rib" data-tab="insert" hidden><button type="button" class="pp-pic">🖼 Resim</button>
      <span class="pp-sizes">Resim boyutu: ${SIZES.map(([k, n]) => `<button type="button" data-size="${k}">${n}</button>`).join('')}</span>
      <button type="button" class="pp-album" title="Resimler klasöründeki fotoğraflardan slaytlar oluşturur">📸 Fotoğraf Albümü</button>
      <span class="pp-newwrap"><button type="button" class="pp-sa">🔷 SmartArt ▾</button><span class="pp-lay pp-salist" hidden>${Object.entries(ARTS).map(([k, v]) => `<button type="button" data-art="${k}">${v}</button>`).join('')}<button type="button" data-art="none">↩ Listeye geri dön</button></span></span>
      <span class="pp-newwrap"><button type="button" class="pp-tb">▦ Tablo ▾</button><span class="pp-lay pp-tblist" hidden>${TABLES.map(([c, r]) => `<button type="button" data-table="${c}x${r}">${c} sütun × ${r} satır</button>`).join('')}<button type="button" data-table="none">✖ Tabloyu kaldır</button></span></span>
      <span class="pp-newwrap"><button type="button" class="pp-ch">📊 Grafik ▾</button><span class="pp-lay pp-chlist" hidden>${CHARTS.map(([k, n]) => `<button type="button" data-chart="${k}">${n}</button>`).join('')}<button type="button" data-chart="edit">📝 Verileri düzenle</button><button type="button" data-chart="none">✖ Grafiği kaldır</button></span></span>
      <button type="button" class="pp-num" title="Her slaydın sağ alt köşesine numara yazar">＃ Slayt numarası</button><button type="button" class="pp-music" title="Sunuya fon müziği ekler">🎵 Ses</button><span class="pp-musicname"></span></div>
    <div class="pp-rib" data-tab="design" hidden>${THEMES.map(([id, n, bg, fg]) => `<button type="button" class="pp-theme" data-theme="${id}" title="${n}" style="background:${bg};color:${fg}">Aa<small>${n}</small></button>`).join('')}</div>
    <div class="pp-rib" data-tab="trans" hidden>${TRANS.map(([id, n]) => `<button type="button" data-trans="${id}">${n}</button>`).join('')}<span class="pp-tnote">Seçili slayda uygulanır</span><span class="pp-autos">Kendiliğinden ilerle: ${[[0, 'Yok (tıklayınca)'], [3, '3 sn'], [5, '5 sn']].map(([k, n]) => `<button type="button" data-auto="${k}">${n}</button>`).join('')}<button type="button" data-autoall title="Seçili slaydın süresini bütün slaytlara uygular">Tüm slaytlara uygula</button></span></div>
    <div class="pp-rib" data-tab="anim" hidden>${ANIMS.map(([id, n]) => `<button type="button" data-anim="${id}">${n}</button>`).join('')}<span class="pp-sep"></span><span class="pp-autos">Başlangıç: <button type="button" data-astart="click">Tıklayınca</button><button type="button" data-astart="auto">Kendiliğinden</button></span><button type="button" class="pp-aprev" title="Animasyonu bu slaytta oynat">▶ Önizleme</button><span class="pp-tnote">Maddelere ve resme uygulanır; geçişten farklıdır</span></div>
    <div class="pp-rib" data-tab="view" hidden><button type="button" data-view="normal">▭ Normal</button><button type="button" data-view="sorter">▦ Slayt Sıralayıcı</button><button type="button" data-view="master" title="Bütün slaytların ortak görünüşü: yazı tipi, renk, logo, alt bilgi">🎨 Asıl Slayt</button><span class="pp-tnote">Sıralayıcıda slaytları sürükleyerek yerlerini değiştirin; çift tıklayınca slayt açılır</span></div>
    <div class="pp-rib" data-tab="master" hidden><span class="pp-autos">Yazı tipi: ${FONTS.map(([k, n, f]) => `<button type="button" data-mfont="${k}" style="font-family:${esc(f)}">${n}</button>`).join('')}</span><span class="pp-sep"></span>
      <span class="pp-autos">Başlık rengi: ${MCOLORS.map(([k, n]) => `<button type="button" class="pp-mcol" data-mcolor="${k}" title="${n}">${k ? `<i style="background:${k}"></i>` : 'Tema'}</button>`).join('')}</span><span class="pp-sep"></span>
      <button type="button" class="pp-mlogo">🖼 Logo ekle</button><button type="button" class="pp-mnologo">✖ Logoyu kaldır</button><span class="pp-sep"></span>
      <label class="pp-autos">Alt bilgi: <input class="pp-mfoot" placeholder="Her slaydın altına yazılacak yazı" spellcheck="false"></label>
      <button type="button" class="pp-mclose">✖ Asıl Görünümü Kapat</button></div>
    <div class="pp-rib" data-tab="show" hidden><button type="button" class="pp-play">▶ Baştan başla <small>F5</small></button><button type="button" class="pp-play-cur">▶ Geçerli slayttan</button></div>
    <div class="pp-menu" hidden><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="pdf">📕 PDF olarak kaydet…</button><button type="button" data-file="video">🎬 Video olarak kaydet (.mp4)…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button></div>
    <div class="pp-main"><div class="pp-thumbs" tabindex="0"></div><div class="pp-stage"><div class="pp-slide"></div></div><div class="pp-sorter" hidden></div>
      <div class="pp-master" hidden><div class="pp-mside"><b>Asıl Slayt</b><div class="pp-mini pp-mbig"></div><p>Burada yaptığınız her değişiklik <b>bütün slaytlara</b> birden uygulanır. Slaytlardaki yazılar değişmez.</p></div><div class="pp-mall"></div></div>
      <div class="pp-cdata" hidden><div class="pp-cd-h">📊 Grafik verileri<button type="button" class="pp-cd-x" title="Kapat">✖</button></div>
        <table><thead><tr><th></th><th>Kategori</th><th>Değer</th></tr></thead><tbody></tbody></table>
        <div class="pp-cd-type">Grafik türü: ${CHARTS.map(([k, n]) => `<button type="button" data-ctype="${k}">${n.replace(' grafiği', '')}</button>`).join('')}</div>
        <small class="pp-cd-n">Yazdıkça slayttaki grafik değişir. Bir satırı kullanmamak için kategorisini silin.</small></div></div>
    <div class="pp-notes"><label>📝 Konuşmacı notları <small>(yalnızca siz görürsünüz; izleyiciye gösterilmez)</small></label><textarea class="pp-nt" placeholder="Bu slaytta söylemek istediklerinizi buraya yazın" spellcheck="false"></textarea></div>
    <div class="pp-status"><span class="pp-st"></span><span>Türkçe (Türkiye)</span></div>
    <div class="pp-show" hidden tabindex="0"></div>`;
  const $ = (s) => body.querySelector(s);
  let deck, cur = 0, fileName = null, folder = 'docs', dirty = false;
  const blank = (layout) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', notes: '' });
  let view = 'normal';

  // SmartArt: maddeleri renkli kutulara, oklu adımlara ya da soy ağacına dönüştürür
  function artHtml(kind, items, edit) {
    const box = (t, i) => `<div class="pp-ab" style="background:${ART_COLORS[i % ART_COLORS.length]}">${esc(t)}</div>`;
    const note = edit ? '<small class="pp-artnote">SmartArt: yazıyı değiştirmek için Ekle → SmartArt → Listeye geri dön</small>' : '';
    if (!items.length) return '<div class="pp-art"><div class="pp-artempty">SmartArt için önce madde yazın</div></div>';
    if (kind === 'surec') return `<div class="pp-art pp-art-surec">${items.map((t, i) => `${box(t, i)}${i < items.length - 1 ? '<span class="pp-arrow">➜</span>' : ''}`).join('')}${note}</div>`;
    if (kind === 'agac') return `<div class="pp-art pp-art-agac"><div class="pp-atop">${box(items[0], 0)}</div><div class="pp-alines"></div><div class="pp-akids">${items.slice(1).map((t, i) => `<div class="pp-akid">${box(t, i + 1)}</div>`).join('')}</div>${note}</div>`;
    return `<div class="pp-art pp-art-liste">${items.map(box).join('')}${note}</div>`;
  }
  const theme = () => THEMES.find((t) => t[0] === deck.theme) || THEMES[0];
  // Grafik: sütun (yükseklik en büyük değere göre) ya da pasta (dilimler toplamın payı)
  function chartHtml(ch) {
    const d = (ch.data || []).filter(([l, v]) => String(l).trim() && v > 0);
    if (!d.length) return '<div class="pp-chart"><div class="pp-artempty">Grafik verisi yok: Ekle → Grafik → Verileri düzenle</div></div>';
    const col = (i) => ART_COLORS[i % ART_COLORS.length];
    if (ch.type === 'pie') {
      const sum = d.reduce((n, [, v]) => n + v, 0);
      let a = 0;
      const stops = d.map(([, v], i) => { const b = a + (v / sum) * 360; const t = `${col(i)} ${a}deg ${b}deg`; a = b; return t; }).join(',');
      return `<div class="pp-chart pp-pie"><div class="pp-pie-c" style="background:conic-gradient(${stops})"></div><div class="pp-leg">${d.map(([l, v], i) => `<span><i style="background:${col(i)}"></i>${esc(l)} <b>%${Math.round((v / sum) * 100)}</b></span>`).join('')}</div></div>`;
    }
    const max = Math.max(...d.map(([, v]) => v));
    return `<div class="pp-chart pp-bars">${d.map(([l, v], i) => `<div class="pp-bar"><b>${String(v).replace('.', ',')}</b><i style="height:${(v / max) * 100}%;background:${col(i)}"></i><span>${esc(l)}</span></div>`).join('')}</div>`;
  }
  const tableHtml = (t, ce) => `<table class="pp-tbl">${t.map((row, r) => `<tr>${row.map((v, k) => `<td class="pp-tc" data-r="${r}" data-c="${k}" ${ce}>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`;
  function slideHtml(s, edit) {
    const [, , bg, fg, thAcc] = theme();
    const m = deck.master || {};
    const acc = m.color || thAcc;
    const font = FONTS.find((f) => f[0] === m.font && f[0] !== 'calibri');
    const ce = edit ? 'contenteditable="true"' : '';
    const box = (k, cls) => `<div class="pp-box ${cls}${s[k] ? '' : ' empty'}" data-k="${k}" ${ce} data-ph="${PH[k]}">${s[k] || ''}</div>`;
    const list = (k) => (edit ? `<ul class="pp-box pp-body${plain(s[k]) ? '' : ' empty'}" data-k="${k}" ${ce} data-ph="${PH[k]}">${s[k] || '<li><br></li>'}</ul>` : `<ul class="pp-body">${s[k]}</ul>`);
    const img = (cls = '') => (s.img ? `<img class="pp-img pp-s${s.imgSize || 'M'} ${cls}" src="${pictureURL(s.img)}" alt="">` : '');
    const items = () => [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean);
    let inner = s.layout === 'blank' ? '' : box('title', s.layout === 'title' ? 'pp-t-big' : 'pp-t');
    if (s.layout === 'title') inner += box('sub', 'pp-sub');
    const extra = (s.table ? tableHtml(s.table, ce) : '') + (s.chart ? chartHtml(s.chart) : '');
    if (s.layout === 'content') inner += `<div class="pp-row">${s.art ? artHtml(s.art, items(), edit) : extra && !plain(s.body) ? '' : list('body')}${extra}${img()}</div>`;
    else if (extra && s.layout !== 'two' && s.layout !== 'photo') inner += `<div class="pp-row">${extra}</div>${img('pp-img-c')}`;
    else if (s.layout === 'two') inner += `<div class="pp-row">${list('body')}${list('body2')}</div>${img('pp-img-c')}`;
    else if (s.layout === 'photo') inner += `<div class="pp-photobox">${s.img ? img('pp-photo') : '<div class="pp-nophoto">Fotoğraf eklemek için Ekle → Resim</div>'}</div>${box('sub', 'pp-sub pp-cap').replace(PH.sub, PH.cap)}`;
    else if (s.img) inner += img('pp-img-c');
    const num = deck.slideNum && s.layout !== 'title' && deck.slides.includes(s) ? `<span class="pp-num-b">${deck.slides.indexOf(s) + 1}</span>` : '';
    const logo = m.logo ? `<img class="pp-logo" src="${pictureURL(m.logo)}" alt="">` : '';
    const foot = m.footer ? `<span class="pp-foot">${esc(m.footer)}</span>` : '';
    return `<div class="pp-sl pp-l-${s.layout}${m.color ? ' pp-mc' : ''}" style="background:${bg};color:${fg};--acc:${acc}${font ? `;font-family:${esc(font[2])}` : ''}">${inner}${num}${logo}${foot}</div>`;
  }
  function render() {
    $('.pp-thumbs').innerHTML = deck.slides.map((s, i) => `<div class="pp-th${i === cur ? ' on' : ''}" data-i="${i}"><span>${i + 1}${s.trans !== 'none' ? ' ★' : ''}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    $('.pp-slide').innerHTML = slideHtml(deck.slides[cur], true);
    $('.pp-thumbs').hidden = view !== 'normal';
    $('.pp-stage').hidden = view !== 'normal';
    $('.pp-master').hidden = view !== 'master';
    $('.pp-mtab').hidden = view !== 'master';
    if (view === 'master') {
      const m = deck.master || {};
      const sample = { ...blank('content'), title: 'Asıl başlık stili', body: '<li>Birinci düzey madde</li><li>İkinci madde</li>' };
      $('.pp-mbig').innerHTML = slideHtml(sample, false);
      $('.pp-mall').innerHTML = deck.slides.map((s, i) => `<div class="pp-sth"><span>${i + 1}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
      body.querySelectorAll('[data-mfont]').forEach((b) => b.classList.toggle('on', b.dataset.mfont === (m.font || 'calibri')));
      body.querySelectorAll('[data-mcolor]').forEach((b) => b.classList.toggle('on', b.dataset.mcolor === (m.color || '')));
      if ($('.pp-mfoot') !== document.activeElement) $('.pp-mfoot').value = m.footer || '';
    }
    renderChartData();
    $('.pp-sorter').hidden = view !== 'sorter';
    if (view === 'sorter') $('.pp-sorter').innerHTML = deck.slides.map((s, i) => `<div class="pp-sth${i === cur ? ' on' : ''}" data-i="${i}" draggable="true"><span>${i + 1}${s.trans !== 'none' ? ' ★' : ''}${s.anim?.effect !== 'none' ? ' ✦' : ''}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    body.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === view));
    body.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('on', b.dataset.size === (deck.slides[cur].imgSize || 'M')));
    body.querySelectorAll('[data-anim]').forEach((b) => b.classList.toggle('on', b.dataset.anim === deck.slides[cur].anim?.effect));
    body.querySelectorAll('[data-astart]').forEach((b) => b.classList.toggle('on', b.dataset.astart === deck.slides[cur].anim?.start));
    body.querySelectorAll('[data-auto]').forEach((b) => b.classList.toggle('on', +b.dataset.auto === (deck.slides[cur].auto || 0)));
    $('.pp-musicname').textContent = deck.music ? `🔊 ${deck.music}` : '';
    $('.pp-st').textContent = `Slayt ${cur + 1} / ${deck.slides.length}`;
    if ($('.pp-nt').value !== (deck.slides[cur].notes || '')) $('.pp-nt').value = deck.slides[cur].notes || '';
    body.querySelectorAll('.pp-num').forEach((b) => b.classList.toggle('on', !!deck.slideNum));
    body.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('on', b.dataset.theme === deck.theme));
    body.querySelectorAll('[data-trans]').forEach((b) => b.classList.toggle('on', b.dataset.trans === deck.slides[cur].trans));
    setTitle(`${dirty ? '*' : ''}${fileName || 'Sunu1'} - Sunu`);
  }
  // Düzenleme alanındaki yazıyı slayda kaydeder (küçük resmi de günceller)
  function pull() {
    const s = deck.slides[cur];
    $('.pp-slide').querySelectorAll('[data-k]').forEach((el) => {
      const k = el.dataset.k;
      s[k] = plain(el.innerHTML) ? el.innerHTML : '';
      el.classList.toggle('empty', !plain(el.innerHTML));
    });
    $('.pp-slide').querySelectorAll('.pp-tc').forEach((td) => { if (s.table?.[+td.dataset.r]) s.table[+td.dataset.r][+td.dataset.c] = td.textContent.trim(); });
    const th = $(`.pp-th[data-i="${cur}"] .pp-mini`);
    if (th) th.innerHTML = slideHtml(s, false);
  }
  const changed = () => { dirty = true; setTitle(`*${fileName || 'Sunu1'} - Sunu`); };
  // Yalnızca slaydı yeniden çizer (grafik verisi yazılırken veri kutusundaki imleç yerinde kalsın diye)
  function refreshSlide() {
    pull();
    $('.pp-slide').innerHTML = slideHtml(deck.slides[cur], true);
    const th = $(`.pp-th[data-i="${cur}"] .pp-mini`);
    if (th) th.innerHTML = slideHtml(deck.slides[cur], false);
  }
  // Grafik veri kutusu: seçili slaytta grafik varsa ve açık bırakıldıysa görünür
  let chartOpen = false;
  function renderChartData() {
    const ch = deck.slides[cur]?.chart;
    const box = $('.pp-cdata');
    box.hidden = !(ch && chartOpen && view === 'normal');
    $('.pp-main').classList.toggle('cd-open', !box.hidden);
    if (box.hidden) return;
    const rows = [...ch.data];
    while (rows.length < 6) rows.push(['', '']);
    box.querySelector('tbody').innerHTML = rows.map(([l, v], i) => `<tr><th>${i + 1}</th><td><input data-cd="l" value="${esc(l)}" spellcheck="false"></td><td><input data-cd="v" value="${esc(String(v).replace('.', ','))}" inputmode="decimal"></td></tr>`).join('');
    box.querySelectorAll('[data-ctype]').forEach((b) => b.classList.toggle('on', b.dataset.ctype === ch.type));
  }
  function setTable(sl, c, r) {
    sl.table = Array.from({ length: r }, () => Array(c).fill(''));
  }
  function go(i) { pull(); cur = Math.max(0, Math.min(deck.slides.length - 1, i)); render(); emit('ppt-select', { index: cur }); }

  function load(data, name = null, fld = folder) {
    deck = data ? structuredClone(data) : { theme: 'beyaz', slides: [blank('title')] };
    deck.slides = deck.slides.map((x) => ({ ...blank(x.layout), ...x }));
    deck.master = { font: 'calibri', color: '', logo: null, footer: '', ...deck.master };
    view = 'normal'; chartOpen = false;
    cur = 0; fileName = name; folder = fld; dirty = false;
    render();
  }

  // ---- Slayt gösterisi ----
  let showAt = -1, timers = [], musicTimer = 0, revealed = 0, revealTotal = 0, jumpBuf = '';
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  // Animasyon: maddeler ve resim tek tek ekrana gelir
  const animTargets = (sh) => [...sh.querySelectorAll('.pp-sh-in .pp-body li, .pp-sh-in .pp-ab, .pp-sh-in .pp-img')];
  function revealNext(sh) {
    const t = animTargets(sh);
    if (revealed >= t.length) return false;
    t[revealed].classList.add('pp-anim-in');
    t[revealed].classList.remove('pp-anim-hide');
    revealed++;
    emit('ppt-anim-step', { n: revealed, total: t.length, index: showAt });
    return true;
  }
  function advance() { if (showAt >= deck.slides.length) return endShow(); const sh = $('.pp-show'); if (!revealNext(sh)) showSlide(showAt + 1); }
  function showSlide(i, dir = 1) {
    const sh = $('.pp-show');
    clearTimers();
    if (i >= deck.slides.length) {
      sh.innerHTML = '<div class="pp-end">Slayt gösterisinin sonu. Çıkmak için tıklayın ya da Esc.</div>';
      showAt = deck.slides.length;
      emit('ppt-show-end', { seen: true });
      return;
    }
    showAt = Math.max(0, i);
    const s = deck.slides[showAt];
    const eff = s.anim?.effect && s.anim.effect !== 'none' ? s.anim.effect : null;
    sh.innerHTML = `<div class="pp-sh-in pp-tr-${dir > 0 ? s.trans : 'none'}${eff ? ' pp-anim-' + eff : ''}">${slideHtml(s, false)}</div>`;
    revealed = 0;
    const tg = eff ? animTargets(sh) : [];
    revealTotal = tg.length;
    tg.forEach((el) => el.classList.add('pp-anim-hide'));
    // Kendiliğinden başlayan animasyon: her öğe 1 saniye arayla gelir
    if (eff && s.anim.start === 'auto') tg.forEach((_, k) => timers.push(setTimeout(() => { if ($('.pp-show').hidden || showAt !== i) return; revealNext(sh); }, 700 + k * 1000)));
    // Kendiliğinden ilerle: animasyon bittikten sonra belirlenen süre geçince sonraki slayda geçer
    if (s.auto > 0) timers.push(setTimeout(() => { if (!$('.pp-show').hidden && showAt === i) { emit('ppt-auto-advance', { index: i, secs: s.auto }); showSlide(i + 1); } }, (s.auto + (eff && s.anim.start === 'auto' ? revealTotal : 0)) * 1000));
    emit('ppt-show-slide', { index: showAt, total: deck.slides.length, anim: eff, auto: s.auto });
  }
  function startShow(from = 0) {
    pull();
    const sh = $('.pp-show');
    sh.hidden = false;
    sh.focus();
    const audible = deck.music ? playTune(desk, [392, 440, 494, 523, 494, 440], 0.3) > 0 : false;
    if (deck.music) { musicTimer = setInterval(() => playTune(desk, [392, 440, 494, 523, 494, 440], 0.3), 1900); }
    emit('ppt-show-start', { from, music: deck.music || null, audible });
    showSlide(from);
  }
  function endShow() {
    const sh = $('.pp-show');
    if (sh.hidden) return;
    sh.hidden = true;
    sh.dataset.screen = ''; sh.classList.remove('pp-scr-b', 'pp-scr-w'); jumpBuf = '';
    clearTimers();
    clearInterval(musicTimer);
    emit('ppt-show-exit', { at: showAt, finished: showAt >= deck.slides.length });
    showAt = -1;
    $('.pp-thumbs').focus();
  }
  $('.pp-show').addEventListener('click', advance);
  $('.pp-show').addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') return endShow();
    const sh = $('.pp-show');
    // B: kara ekran, W: beyaz ekran (aynı tuşa ya da başka bir tuşa basınca sunu geri gelir)
    const screen = sh.dataset.screen;
    if (screen) { sh.dataset.screen = ''; sh.classList.remove('pp-scr-b', 'pp-scr-w'); emit('ppt-show-key', { key: screen, on: false }); if (['b', 'w'].includes(e.key.toLowerCase())) return; }
    if (['b', 'w'].includes(e.key.toLowerCase()) && !screen) { const k = e.key.toLowerCase(); sh.dataset.screen = k; sh.classList.add(k === 'b' ? 'pp-scr-b' : 'pp-scr-w'); emit('ppt-show-key', { key: k, on: true }); return; }
    // Rakam + Enter: o numaralı slayda atlar
    if (/^\d$/.test(e.key)) { jumpBuf = (jumpBuf + e.key).slice(-3); return; }
    if (e.key === 'Enter' && jumpBuf) { const to = Math.max(1, Math.min(deck.slides.length, +jumpBuf)); jumpBuf = ''; showSlide(to - 1); emit('ppt-show-jump', { to }); return; }
    if (e.key === 'Home') { showSlide(0); return; }
    if (e.key === 'End') { showSlide(deck.slides.length - 1); return; }
    if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) return advance();
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
  // Yazdırma: önce düzen sorulur (tam sayfa / bir kâğıda 4 slayt), önizlemede kaç kâğıt çıkacağı görünür
  async function print() {
    pull();
    if (desk.dialogs.busy) return;
    const lay = await desk.dialogs.ask({ title: 'Yazdırma düzeni', icon: '🖨', text: `Sununuzda <b>${deck.slides.length} slayt</b> var. Her slayt ayrı kâğıda mı, yoksa kâğıt tasarrufu için <b>bir kâğıda 4 slayt</b> mı yazdırılsın?`, buttons: [['1', 'Her slayt ayrı kâğıda', true], ['4', 'Bir kâğıda 4 slayt'], ['cancel', 'İptal']] });
    if (!lay || lay === 'cancel') return;
    const per = +lay, pages = Math.ceil(deck.slides.length / per);
    emit('ppt-print-layout', { perPage: per, pages });
    const first = deck.slides.slice(0, per).map((s) => `<div class="pp-pvsl" style="container-type:inline-size">${slideHtml(s, false)}</div>`).join('');
    const pv = `<div class="dlg-pvbox big"><div class="pp-pvgrid pp-pv${per}">${first}</div></div><div class="dlg-pvnote ${per === 4 ? 'ok' : 'bad'}">${per === 4 ? `✔ ${deck.slides.length} slayt <b>${pages} kâğıda</b> sığıyor.` : `⚠ ${deck.slides.length} slayt <b>${pages} ayrı kâğıda</b> çıkacak. Kâğıt tasarrufu için “bir kâğıda 4 slayt” seçilebilir.`}</div>`;
    const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Sunu1', pvHtml: pv });
    if (r) { desk.toast('Yazdırılıyor', `${deck.slides.length} slayt, ${pages} kâğıt → ${esc(r.printer)}`, '🖨'); emit('ppt-print', { ...r, perPage: per, pages }); }
  }
  async function exportPdf() {
    pull();
    const base = (fileName || 'Sunu1').replace(/\.pptx$/i, '');
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.pdf', ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
    if (!r) return;
    const html = deck.slides.map((s) => `<div class="pdf-slide" style="container-type:inline-size;aspect-ratio:16/9;margin:0 0 .8em;box-shadow:0 1px 5px #0003">${slideHtml(s, false)}</div>`).join('');
    desk.fs.write(r.folder, r.name, { html, slides: deck.slides.length });
    desk.toast('PDF olarak kaydedildi', `${esc(r.name)}: bilgisayarı olmayanlar da açabilir.`, '📕');
    emit('ppt-pdf', { name: r.name, folder: r.folder, slides: deck.slides.length });
  }
  async function exportVideo() {
    pull();
    const base = (fileName || 'Sunu1').replace(/\.pptx$/i, '');
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.mp4', ext: '.mp4', typeLabel: 'MPEG-4 Video (*.mp4)' });
    if (!r) return;
    const timed = deck.slides.every((s) => s.auto > 0);
    const secs = deck.slides.reduce((n, s) => n + (s.auto || 5), 0);
    desk.toast('Video hazırlanıyor…', `${deck.slides.length} slayt, yaklaşık ${secs} saniye.`, '🎬', 2500);
    await wait(2200);
    const [, , bg] = theme();
    desk.fs.write(r.folder, r.name, { emoji: '🎬', bg: ['#263238', '#546e7a'], video: true, slides: deck.slides.length, secs });
    if (!timed) desk.toast('Süreler verilmemiş', 'Slaytlara süre vermediğiniz için her slayt 5 saniye gösterilecek. Geçişler sekmesinden “Kendiliğinden ilerle” seçebilirsiniz.', 'ℹ', 6000);
    else desk.toast('Video kaydedildi', esc(r.name), '🎬');
    emit('ppt-video', { name: r.name, folder: r.folder, slides: deck.slides.length, secs, timed });
  }

  // ---- Olaylar ----
  body.addEventListener('mousedown', (e) => {
    if (e.target.closest('.pp-rib button, .pp-tabs button')) e.preventDefault();
    if (!e.target.closest('.pp-menu, .pp-file')) $('.pp-menu').hidden = true;
    if (!e.target.closest('.pp-newwrap')) body.querySelectorAll('.pp-lay').forEach((x) => { x.hidden = true; });
  });
  body.addEventListener('click', async (e) => {
    const th = e.target.closest('.pp-th');
    if (th) { go(+th.dataset.i); $('.pp-thumbs').focus(); return; }
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) { showTab(t.dataset.tab); emit('ppt-tab', { tab: t.dataset.tab }); return; }
    if (t.classList.contains('pp-file')) { $('.pp-menu').hidden = !$('.pp-menu').hidden; return; }
    if (t.dataset.file) { $('.pp-menu').hidden = true; if (t.dataset.file === 'print') return print(); if (t.dataset.file === 'pdf') return exportPdf(); if (t.dataset.file === 'video') return exportVideo(); return save(t.dataset.file === 'saveas'); }
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
    if (t.classList.contains('pp-dup')) {
      pull();
      deck.slides.splice(cur + 1, 0, structuredClone(deck.slides[cur]));
      cur++;
      changed(); render();
      emit('ppt-dup', { index: cur, count: deck.slides.length });
      return;
    }
    if (t.dataset.size) { pull(); deck.slides[cur].imgSize = t.dataset.size; changed(); render(); emit('ppt-imgsize', { size: t.dataset.size, hasImg: !!deck.slides[cur].img }); return; }
    if (t.classList.contains('pp-num')) { pull(); deck.slideNum = !deck.slideNum; changed(); render(); emit('ppt-slidenum', { on: !!deck.slideNum }); return; }
    if (t.classList.contains('pp-sa')) { $('.pp-salist').hidden = !$('.pp-salist').hidden; return; }
    if (t.dataset.art) {
      $('.pp-salist').hidden = true;
      pull();
      const sl = deck.slides[cur];
      if (t.dataset.art === 'none') { sl.art = null; changed(); render(); emit('ppt-smartart', { kind: null, ok: true }); return; }
      const n = [...new DOMParser().parseFromString(`<ul>${sl.body}</ul>`, 'text/html').querySelectorAll('li')].filter((li) => li.textContent.trim()).length;
      if (sl.layout !== 'content' || n < 2) { desk.toast('SmartArt', 'Önce “Başlık ve içerik” düzenindeki bir slayda en az iki madde yazın; SmartArt o maddeleri şemaya çevirir.', '🔷', 6000); emit('ppt-smartart', { kind: t.dataset.art, ok: false }); return; }
      sl.art = t.dataset.art;
      changed(); render();
      emit('ppt-smartart', { kind: sl.art, ok: true, count: n });
      return;
    }
    if (t.classList.contains('pp-album')) {
      const pics = desk.fs.children('pictures').filter((n) => isImage(n.name));
      if (!pics.length) { desk.toast('Fotoğraf Albümü', 'Resimler klasörü boş.', '📸'); return; }
      const a = await desk.dialogs.ask({ title: 'Fotoğraf Albümü', icon: '📸', text: `<b>Resimler</b> klasöründe <b>${pics.length} fotoğraf</b> var. Her fotoğraf için bir slayt oluşturulsun mu?<br><small>Altına tarih ve kısa notunuzu siz yazarsınız.</small>`, buttons: [['yes', 'Albümü oluştur', true], ['no', 'İptal']] });
      if (a !== 'yes') return;
      pull();
      const add = pics.map((n) => ({ ...blank('photo'), title: n.name.replace(/\.[^.]+$/, ''), img: n.content }));
      deck.slides.splice(cur + 1, 0, ...add);
      cur++;
      changed(); render();
      emit('ppt-album', { count: add.length });
      return;
    }
    if (t.classList.contains('pp-music')) {
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'music', ext: '.mp3', typeLabel: 'Ses dosyaları (*.mp3)', accept: /\.(mp3|m4a|wav)$/i });
      if (!r) return;
      deck.music = r.name;
      changed(); render();
      emit('ppt-music', { name: r.name });
      return;
    }
    if (t.dataset.view) { pull(); view = t.dataset.view; render(); if (view === 'master') showTab('master'); emit('ppt-view', { view }); return; }
    if (t.classList.contains('pp-mclose')) { view = 'normal'; render(); showTab('home'); emit('ppt-view', { view, from: 'master' }); return; }
    if (t.dataset.mfont) { deck.master.font = t.dataset.mfont; changed(); render(); emit('ppt-master', { what: 'font', value: t.dataset.mfont }); return; }
    if (t.dataset.mcolor !== undefined) { deck.master.color = t.dataset.mcolor; changed(); render(); emit('ppt-master', { what: 'color', value: t.dataset.mcolor }); return; }
    if (t.classList.contains('pp-mnologo')) { deck.master.logo = null; changed(); render(); emit('ppt-master', { what: 'logo', value: null }); return; }
    if (t.classList.contains('pp-mlogo')) {
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.png', typeLabel: 'Resimler (*.png; *.jpg)', accept: /\.(png|jpe?g|bmp)$/i });
      if (!r) return;
      deck.master.logo = desk.fs.find(r.folder, r.name)?.content || { emoji: '🖼', bg: ['#ccc', '#999'] };
      changed(); render();
      emit('ppt-master', { what: 'logo', value: r.name });
      return;
    }
    if (t.classList.contains('pp-tb')) { $('.pp-tblist').hidden = !$('.pp-tblist').hidden; return; }
    if (t.classList.contains('pp-ch')) { $('.pp-chlist').hidden = !$('.pp-chlist').hidden; return; }
    if (t.dataset.table) {
      $('.pp-tblist').hidden = true;
      pull();
      const sl = deck.slides[cur];
      if (t.dataset.table === 'none') { sl.table = null; changed(); render(); emit('ppt-table', { removed: true, index: cur }); return; }
      if (['title', 'two', 'photo'].includes(sl.layout)) { desk.toast('Tablo', 'Tabloyu “Başlık ve içerik”, “Yalnızca başlık” ya da “Boş” düzenindeki bir slayda ekleyin.', '▦', 6000); emit('ppt-table', { ok: false }); return; }
      const [c, r] = t.dataset.table.split('x').map(Number);
      setTable(sl, c, r);
      changed(); render();
      emit('ppt-table', { cols: c, rows: r, index: cur, ok: true });
      setTimeout(() => $('.pp-slide .pp-tc')?.focus(), 0);
      return;
    }
    if (t.dataset.chart) {
      $('.pp-chlist').hidden = true;
      pull();
      const sl = deck.slides[cur];
      if (t.dataset.chart === 'none') { sl.chart = null; changed(); render(); emit('ppt-chart', { removed: true, index: cur }); return; }
      if (t.dataset.chart === 'edit') { if (!sl.chart) { desk.toast('Grafik', 'Bu slaytta grafik yok. Önce Ekle → Grafik ile bir grafik ekleyin.', '📊'); return; } chartOpen = true; render(); return; }
      if (['title', 'two', 'photo'].includes(sl.layout)) { desk.toast('Grafik', 'Grafiği “Başlık ve içerik”, “Yalnızca başlık” ya da “Boş” düzenindeki bir slayda ekleyin.', '📊', 6000); emit('ppt-chart', { ok: false }); return; }
      const change = !!sl.chart;
      sl.chart = { type: t.dataset.chart, data: sl.chart ? sl.chart.data : structuredClone(CHART_DEMO) };
      chartOpen = true;
      changed(); render();
      emit('ppt-chart', { kind: sl.chart.type, change, index: cur, ok: true });
      return;
    }
    if (t.classList.contains('pp-cd-x')) { chartOpen = false; render(); return; }
    if (t.dataset.ctype) { const ch = deck.slides[cur].chart; if (!ch) return; ch.type = t.dataset.ctype; changed(); refreshSlide(); renderChartData(); emit('ppt-chart', { kind: ch.type, change: true, index: cur, ok: true }); return; }
    if (t.dataset.anim) { pull(); deck.slides[cur].anim = { ...(deck.slides[cur].anim || { start: 'click' }), effect: t.dataset.anim }; changed(); render(); emit('ppt-anim', { effect: t.dataset.anim, start: deck.slides[cur].anim.start, index: cur }); return; }
    if (t.dataset.astart) { pull(); deck.slides[cur].anim = { ...(deck.slides[cur].anim || { effect: 'none' }), start: t.dataset.astart }; changed(); render(); emit('ppt-anim', { effect: deck.slides[cur].anim.effect, start: t.dataset.astart, index: cur }); return; }
    if ('autoall' in t.dataset) { pull(); const v = deck.slides[cur].auto || 0; deck.slides.forEach((x) => { x.auto = v; }); changed(); render(); emit('ppt-autotime', { secs: v, index: cur, all: true }); return; }
    if (t.dataset.auto) { pull(); deck.slides[cur].auto = +t.dataset.auto; changed(); render(); emit('ppt-autotime', { secs: +t.dataset.auto, index: cur }); return; }
    if (t.classList.contains('pp-aprev')) {
      const el = $('.pp-slide');
      const eff = deck.slides[cur].anim?.effect;
      if (!eff || eff === 'none') { desk.toast('Animasyon yok', 'Önce bir animasyon seçin.', '✦'); return; }
      el.querySelectorAll('.pp-body li, .pp-ab, .pp-img').forEach((x, k) => { x.classList.remove('pp-anim-run'); void x.offsetWidth; x.style.animationDelay = k * 0.5 + 's'; x.classList.add('pp-anim-' + eff, 'pp-anim-run'); });
      emit('ppt-anim-preview', { effect: eff });
      return;
    }
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
  // Slayt Sıralayıcı: tıklayınca seçer, çift tıklayınca açar, sürükleyip bırakınca yerini değiştirir
  let dragFrom = -1;
  $('.pp-sorter').addEventListener('click', (e) => { const x = e.target.closest('.pp-sth'); if (x) { pull(); cur = +x.dataset.i; render(); } });
  $('.pp-sorter').addEventListener('dblclick', (e) => { const x = e.target.closest('.pp-sth'); if (x) { cur = +x.dataset.i; view = 'normal'; render(); emit('ppt-view', { view: 'normal', open: cur }); } });
  $('.pp-sorter').addEventListener('dragstart', (e) => { const x = e.target.closest('.pp-sth'); if (!x) return; dragFrom = +x.dataset.i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragFrom)); });
  $('.pp-sorter').addEventListener('dragover', (e) => { if (dragFrom >= 0) e.preventDefault(); });
  $('.pp-sorter').addEventListener('drop', (e) => {
    const x = e.target.closest('.pp-sth');
    if (!x || dragFrom < 0) return;
    e.preventDefault();
    const to = +x.dataset.i;
    if (to !== dragFrom) {
      pull();
      const [m] = deck.slides.splice(dragFrom, 1);
      deck.slides.splice(to, 0, m);
      cur = to;
      changed(); render();
      emit('ppt-move', { index: cur, from: dragFrom, sorter: true });
    }
    dragFrom = -1;
  });
  function showTab(name) {
    body.querySelectorAll('.pp-tabs [data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
    body.querySelectorAll('.pp-rib').forEach((r) => { r.hidden = r.dataset.tab !== name; });
  }
  $('.pp-mfoot').addEventListener('input', (e) => { deck.master.footer = e.target.value.trim(); changed(); render(); emit('ppt-master', { what: 'footer', value: deck.master.footer }); });
  // Grafik verileri: yazdıkça grafik güncellenir
  $('.pp-cdata').addEventListener('input', () => {
    const ch = deck.slides[cur].chart;
    if (!ch) return;
    ch.data = [...$('.pp-cdata tbody').rows].map((tr) => [tr.querySelector('[data-cd="l"]').value.trim(), parseFloat(tr.querySelector('[data-cd="v"]').value.replace(/\./g, '').replace(',', '.')) || 0]).filter(([l, v]) => l || v);
    changed(); refreshSlide();
    emit('ppt-chartdata', { index: cur, data: ch.data });
  });
  $('.pp-slide').addEventListener('dblclick', (e) => { if (e.target.closest('.pp-chart')) { chartOpen = true; renderChartData(); } });
  // Tablo hücrelerinde Tab sonraki hücreye, Shift + Tab öncekine geçer; son hücrede Tab yeni satır ekler
  $('.pp-slide').addEventListener('keydown', (e) => {
    const td = e.target.closest('.pp-tc');
    if (!td || !['Tab', 'Enter'].includes(e.key)) return;
    e.preventDefault();
    const cells = [...$('.pp-slide').querySelectorAll('.pp-tc')];
    const cols = deck.slides[cur].table[0].length;
    let i = cells.indexOf(td) + (e.key === 'Enter' ? cols : e.shiftKey ? -1 : 1);
    if (i >= cells.length && e.key === 'Tab') {
      pull();
      deck.slides[cur].table.push(Array(cols).fill(''));
      changed(); refreshSlide();
      emit('ppt-table-row', { rows: deck.slides[cur].table.length, index: cur });
      i = cells.length;
    }
    const to = $('.pp-slide').querySelectorAll('.pp-tc')[Math.max(0, i)];
    if (!to) return;
    to.focus();
    const r = document.createRange(); r.selectNodeContents(to);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  });
  async function deleteSlide() {
    if (deck.slides.length === 1) { desk.toast('Sunu', 'Sunuda en az bir slayt olmalı.', 'ℹ'); return; }
    deck.slides.splice(cur, 1);
    cur = Math.min(cur, deck.slides.length - 1);
    changed(); render();
    emit('ppt-delete', { index: cur });
  }
  $('.pp-slide').addEventListener('input', () => { pull(); changed(); emit('ppt-input', { index: cur }); });
  $('.pp-nt').addEventListener('input', (e) => { deck.slides[cur].notes = e.target.value; changed(); emit('ppt-notes', { index: cur, text: e.target.value, length: e.target.value.trim().length }); });
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
        theme: deck.theme, showing: !$('.pp-show').hidden, fileName, slideNum: !!deck.slideNum, notes: deck.slides.map((x) => x.notes || ''),
        music: deck.music || null, view, master: { ...deck.master, logo: !!deck.master.logo },
        slides: deck.slides.map((s) => ({ layout: s.layout, title: plain(s.title), sub: plain(s.sub), items: [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean), img: !!s.img, trans: s.trans, art: s.art, anim: s.anim?.effect || 'none', animStart: s.anim?.start, auto: s.auto || 0, imgSize: s.imgSize, table: s.table ? s.table.map((r) => [...r]) : null, chart: s.chart ? structuredClone(s.chart) : null })),
      };
    },
    show: () => { if ($('.pp-show').hidden) startShow(0); },
    confirmClose: confirmDiscard,
    focus: () => {},
  };
}
