// Sunu: PowerPoint benzeri program. Slayt düzenleri (başlık, başlık ve içerik, yalnızca başlık), tasarım temaları,
// Arka Planı Biçimlendir (düz dolgu, resim), yazı tipi boyutu / rengi / hizalama, resim (Resim Biçimi: boyut, Kırp),
// slayt geçişleri (Sonra: süresi, Tümüne Uygula), küçük resimlerde sağ tık (Slaytı Çoğalt / Sil / Gizle) ve sürükleyerek sıra,
// slayt gösterisi (F5); .pptx / .ppsx olarak kaydetme, Dışarı Aktar (PDF, video), yazdırma.
// Asıl Slayt (Yazı Tipleri; başlık rengi Giriş'ten, logo Ekle → Resim'den, alt bilgi kutusu), slayda tablo ve grafik (sütun / pasta).
// Not Sayfası ve Okuma Görünümü, Zamanlamaları Prova Et, gösteride kalem / vurgulayıcı (Ctrl + P, E, sağ tık menüsü),
// dinleyici notları ve not sayfası yazdırma; şekiller, WordArt, video, köprü (Ctrl + K), eylem düğmeleri, Üst Bilgi ve Alt Bilgi.
// Nesne animasyonları: giriş, vurgu, çıkış; Animasyon Ekle, Animasyon Bölmesi (sıra, Oynat), Başlangıç / Süre / Gecikme.
import { esc, pictureURL, playTune, wait, isImage } from './util.js';

const THEMES = [
  ['beyaz', 'Office', '#ffffff', '#1f1f1f', '#c55a11'],
  ['mavi', 'Okyanus', 'linear-gradient(135deg,#0b3d91,#1e88e5)', '#ffffff', '#ffd54f'],
  ['yesil', 'Bahar', 'linear-gradient(135deg,#e8f5e9,#a5d6a7)', '#1b5e20', '#2e7d32'],
  ['gece', 'Gece', 'linear-gradient(135deg,#1a1a2e,#3a3a6e)', '#f5f5f5', '#ff8a65'],
];
const LAYOUTS = { title: 'Başlık slaytı', content: 'Başlık ve içerik', two: 'İki içerik', only: 'Yalnızca başlık', photo: 'Resim Yazısı ile Resim', blank: 'Boş' };
const ANIMS = [['none', 'Yok'], ['fade', 'Belirme'], ['left', 'Soldan gel'], ['zoom', 'Büyüme']];
// Nesne animasyonu efektleri: [kimlik, ad, tür] (in: giriş, em: vurgu, out: çıkış); girişler eski slayt animasyonuyla aynıdır
const FX = [['fade', 'Belirme', 'in'], ['left', 'Soldan gel', 'in'], ['zoom', 'Büyüme', 'in'], ['pulse', 'Darbe', 'em'], ['spin', 'Döndür', 'em'], ['grow', 'Büyüt/Küçült', 'em'], ['vanish', 'Kaybolma', 'out'], ['flyout', 'Uçarak Çıkma', 'out']];
const FX_KIND = { in: ['Giriş', '#2e7d32'], em: ['Vurgu', '#bf9000'], out: ['Çıkış', '#c00000'] };
const FX_DUR = { fade: 0.5, left: 0.5, zoom: 0.5, pulse: 0.5, spin: 1, grow: 1, vanish: 0.5, flyout: 0.5 };
const FX_KEY = { fade: 'ppIn', left: 'ppLeft', zoom: 'ppZoom', pulse: 'ppPulse', spin: 'ppSpin', grow: 'ppGrow', vanish: 'ppOut', flyout: 'ppFlyOut' };
const STARTS = [['click', 'Tıklatıldığında', '🖱'], ['with', 'Öncekiyle', ''], ['after', 'Öncekinden Sonra', '🕒']];
const fxOf = (id) => FX.find((f) => f[0] === id);
// Süre ve gecikme: 00,50 biçiminde (saniye)
const fmtS = (v) => (v || 0).toFixed(2).padStart(5, '0').replace('.', ',');
const ARTS = { liste: 'Liste (renkli kutular)', surec: 'Süreç (oklu adımlar)', agac: 'Soy ağacı / şema' };
// Giriş → Yazı Tipi Rengi (Standart Renkler) ve Tasarım → Arka Planı Biçimlendir → Düz dolgu renkleri
const TCOLORS = [['#000000', 'Siyah'], ['#ffffff', 'Beyaz'], ['#c00000', 'Koyu Kırmızı'], ['#ff0000', 'Kırmızı'], ['#ffc000', 'Turuncu'], ['#ffff00', 'Sarı'], ['#92d050', 'Açık Yeşil'], ['#00b050', 'Yeşil'], ['#00b0f0', 'Açık Mavi'], ['#0070c0', 'Mavi'], ['#002060', 'Koyu Mavi'], ['#7030a0', 'Mor'], ['', 'Otomatik']];
const BGCOLORS = [['#ffffff', 'Beyaz'], ['#fff2cc', 'Açık sarı'], ['#e2efda', 'Açık yeşil'], ['#ddebf7', 'Açık mavi'], ['#fce4d6', 'Açık turuncu'], ['#ededed', 'Açık gri'], ['#002060', 'Koyu Mavi'], ['#000000', 'Siyah']];
const ALIGNS = [['left', 'Sola Hizala', 'Metni Sola Hizala'], ['center', 'Ortala', 'Ortala'], ['right', 'Sağa Hizala', 'Metni Sağa Hizala']];
// Geçişler → Sonra: kutusu 00:03,00 biçiminde (dakika:saniye,salise)
const fmtA = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')},00`;
const ART_COLORS = ['#2e7d32', '#1565c0', '#e46c0a', '#7030a0', '#c62828', '#00838f'];
const TRANS = [['none', 'Yok'], ['fade', 'Solma'], ['push', 'İtme'], ['zoom', 'Yakınlaştır']];
const FONTS = [['calibri', 'Calibri', 'Calibri, Carlito, "Noto Sans", sans-serif'], ['georgia', 'Georgia', 'Georgia, "DejaVu Serif", serif'], ['verdana', 'Verdana', 'Verdana, "DejaVu Sans", sans-serif'], ['comic', 'Comic Sans', '"Comic Sans MS", "Comic Neue", cursive']];
const MCOLORS = [['#1f3864', 'Lacivert'], ['#c00000', 'Koyu kırmızı'], ['#375623', 'Koyu yeşil'], ['#7030a0', 'Mor'], ['', 'Temanın rengi']];
const TABLES = [[2, 3], [3, 3], [3, 4], [4, 4]];
const CHARTS = [['bar', 'Sütun grafiği'], ['pie', 'Pasta grafiği']];
const CHART_DEMO = [['Kategori 1', 4], ['Kategori 2', 3], ['Kategori 3', 5], ['Kategori 4', 2]];
// Şekiller ve eylem düğmeleri: [tür, simge, ad, tıklanınca gidilecek yer]
const SHAPES = [['rect', '▭', 'Dikdörtgen'], ['round', '▢', 'Yuvarlatılmış dikdörtgen'], ['oval', '⬭', 'Oval'], ['arrow', '➡', 'Sağ ok'], ['star', '★', 'Yıldız'], ['callout', '💬', 'Konuşma balonu']];
const ACTS = [['act-home', '⌂', 'Giriş', 'first'], ['act-prev', '◀', 'Geri veya Önceki', 'prev'], ['act-next', '▶', 'İleri veya Sonraki', 'next'], ['act-end', '⏭', 'Son', 'last']];
const WARTS = [['wa1', 'Turuncu, gölgeli'], ['wa2', 'Mavi dış çizgi'], ['wa3', 'Altın sarısı']];
const FILLS = [['#4472c4', 'Mavi'], ['#c00000', 'Kırmızı'], ['#ed7d31', 'Turuncu'], ['#70ad47', 'Yeşil'], ['#bf9000', 'Altın'], ['#7030a0', 'Mor']];
const LINKS = [['next', 'Sonraki slayt'], ['prev', 'Önceki slayt'], ['first', 'İlk slayt'], ['last', 'Son slayt']];
const WA_PH = 'Metninizi buraya yazın';
const SAVE_TYPES = [['.pptx', 'PowerPoint Sunusu (*.pptx)'], ['.ppsx', 'PowerPoint Gösterisi (*.ppsx)'], ['.pdf', 'PDF (*.pdf)']];
// Süre: 0:00:25 biçiminde
const fmtT = (sec) => `${Math.floor(sec / 3600)}:${String(Math.floor(sec / 60) % 60).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
const bugun = () => { const t = new Date(); return `${String(t.getDate()).padStart(2, '0')}.${String(t.getMonth() + 1).padStart(2, '0')}.${t.getFullYear()}`; };
// Mürekkep (kalem / vurgulayıcı çizgileri): 1000 × 562 birimlik slayt üzerinde nokta listeleri
const inkSvg = (strokes, live) => `<svg class="pp-ink${live ? ' pp-ink-live' : ''}" viewBox="0 0 1000 562" preserveAspectRatio="none">${(strokes || []).map((st) => `<polyline class="pp-ink-${st.t}" points="${st.p.map((q) => q.join(',')).join(' ')}"/>`).join('')}</svg>`;
const PH = { title: 'Başlık eklemek için tıklayın', sub: 'Alt başlık eklemek için tıklayın', body: 'Metin eklemek için tıklayın', body2: 'Metin eklemek için tıklayın', cap: 'Tarih ve kısa bir not yazın' };
// Yazı boyutu (punto): slayt 960 pt genişliğinde sayılır, 1cqw = 9,6 pt. Boyut verilmemiş kutular CSS'teki varsayılanla çizilir.
const FSIZES = [18, 20, 24, 28, 32, 36, 40, 44, 50, 54, 66];
const fsDef = (s, k) => (k === 'title' ? (s.layout === 'title' ? 66 : 50) : 32);
// Kutunun yazı boyutu, yazı rengi (fc) ve hizalaması (al)
const fsStyle = (s, k) => {
  const st = [s.fs?.[k] && `font-size:${(s.fs[k] / 9.6).toFixed(2)}cqw`, s.fc?.[k] && `color:${s.fc[k]}`, s.al?.[k] && `text-align:${s.al[k]}`].filter(Boolean);
  return st.length ? ` style="${st.join(';')}"` : '';
};
const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.innerText.trim(); };

export function slides({ desk, body, args, emit, setTitle }) {
  body.classList.add('pp');
  body.innerHTML = `
    <div class="pp-tabs"><button type="button" class="pp-file">Dosya</button><button type="button" data-tab="home" class="on">Giriş</button><button type="button" data-tab="insert">Ekle</button><button type="button" data-tab="design">Tasarım</button><button type="button" data-tab="trans">Geçişler</button><button type="button" data-tab="anim">Animasyonlar</button><button type="button" data-tab="show">Slayt Gösterisi</button><button type="button" data-tab="view">Görünüm</button><button type="button" data-tab="master" class="pp-mtab" hidden>Asıl Slayt</button><button type="button" data-tab="shape" class="pp-stab" hidden>Şekil Biçimi</button><button type="button" data-tab="pic" class="pp-stab pp-ptab" hidden>Resim Biçimi</button><button type="button" data-tab="audio" class="pp-stab pp-utab" hidden>Kayıttan Yürütme</button></div>
    <div class="pp-rib" data-tab="home"><span class="pp-newwrap"><button type="button" class="pp-new">➕ Yeni Slayt ▾</button><span class="pp-lay" hidden>${Object.entries(LAYOUTS).map(([k, v]) => `<button type="button" data-layout="${k}">${v}</button>`).join('')}<b class="pp-laysub"></b><button type="button" data-dupsel>⧉ Seçili Slaytları Çoğalt</button></span></span><span class="pp-sep"></span>
      <button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button><label class="pp-fsz" title="Yazı Tipi Boyutu (punto): önce yazı kutusuna tıklayın">Yazı Tipi Boyutu <select class="pp-fs">${FSIZES.map((n) => `<option>${n}</option>`).join('')}</select></label>
      <span class="pp-newwrap"><button type="button" class="pp-fcbtn" title="Yazı Tipi Rengi: önce yazı kutusuna tıklayın"><u>A</u> Yazı Tipi Rengi ▾</button><span class="pp-lay pp-fclist" hidden><b class="pp-laysub">Standart Renkler</b><span class="pp-fcgrid">${TCOLORS.map(([k, n]) => `<button type="button" class="pp-mcol" data-fcolor="${k}" title="${n}">${k ? `<i style="background:${k}"></i>` : 'Otomatik'}</button>`).join('')}</span></span></span><span class="pp-sep"></span>
      ${ALIGNS.map(([k, n, tip]) => `<button type="button" data-align="${k}" title="${tip}">${n}</button>`).join('')}<span class="pp-sep"></span>
      <span class="pp-newwrap"><button type="button" class="pp-sa" title="Seçili slaydın maddelerini şemaya çevirir">🔷 SmartArt'a Dönüştür ▾</button><span class="pp-lay pp-salist" hidden>${Object.entries(ARTS).map(([k, v]) => `<button type="button" data-art="${k}">${v}</button>`).join('')}<button type="button" data-art="none">↩ Metne Dönüştür</button></span></span></div>
    <div class="pp-rib" data-tab="insert" hidden><button type="button" class="pp-pic">🖼 Resim</button>
      <button type="button" class="pp-album" title="Resimler klasöründeki fotoğraflardan slaytlar oluşturur">📸 Fotoğraf Albümü</button>
      <span class="pp-newwrap"><button type="button" class="pp-sains" title="Boş bir şema ekler">🔷 SmartArt ▾</button><span class="pp-lay pp-sailist" hidden>${Object.entries(ARTS).map(([k, v]) => `<button type="button" data-artins="${k}">${v}</button>`).join('')}</span></span>
      <span class="pp-newwrap"><button type="button" class="pp-tb">▦ Tablo ▾</button><span class="pp-lay pp-tblist" hidden>${TABLES.map(([c, r]) => `<button type="button" data-table="${c}x${r}">${c} sütun × ${r} satır</button>`).join('')}<button type="button" data-table="none">✖ Tabloyu kaldır</button></span></span>
      <span class="pp-newwrap"><button type="button" class="pp-ch">📊 Grafik ▾</button><span class="pp-lay pp-chlist" hidden>${CHARTS.map(([k, n]) => `<button type="button" data-chart="${k}">${n}</button>`).join('')}<button type="button" data-chart="edit">📝 Verileri düzenle</button><button type="button" data-chart="none">✖ Grafiği kaldır</button></span></span>
      <button type="button" class="pp-num" title="Üst Bilgi ve Alt Bilgi penceresini açar">＃ Slayt Numarası</button><button type="button" class="pp-music" title="Bilgisayardaki bir ses dosyasını slayda koyar">🔊 Ses</button><span class="pp-musicname"></span>
      <span class="pp-newwrap"><button type="button" class="pp-shbtn">⬟ Şekiller ▾</button><span class="pp-lay pp-shlist" hidden>${SHAPES.map(([k, ic, n]) => `<button type="button" data-shape="${k}">${ic} ${n}</button>`).join('')}<b class="pp-laysub">Eylem Düğmeleri</b>${ACTS.map(([k, ic, n]) => `<button type="button" data-shape="${k}"><span class="pp-actic">${ic}</span> ${n}</button>`).join('')}</span></span>
      <span class="pp-newwrap"><button type="button" class="pp-wa">𝒜 WordArt ▾</button><span class="pp-lay pp-walist" hidden>${WARTS.map(([k, n]) => `<button type="button" data-wa="${k}"><span class="pp-wa-s pp-${k}">Aa</span> ${n}</button>`).join('')}</span></span>
      <button type="button" class="pp-vid" title="Bilgisayardaki bir videoyu slayda koyar">🎬 Video</button><button type="button" class="pp-link" title="Seçili yazıya ya da şekle bağlantı (köprü) verir (Ctrl + K)">🔗 Bağlantı</button><button type="button" class="pp-act" title="Seçili şekle tıklanınca ne olacağını belirler">⚡ Eylem</button><button type="button" class="pp-hf" title="Tarih, slayt numarası ve alt bilgi">▤ Üst Bilgi ve Alt Bilgi</button></div>
    <div class="pp-rib" data-tab="shape" hidden><span class="pp-autos">Şekil Dolgusu: ${FILLS.map(([k, n]) => `<button type="button" class="pp-mcol" data-fill="${k}" title="${n}"><i style="background:${k}"></i></button>`).join('')}</span><span class="pp-sep"></span>
      <button type="button" class="pp-link">🔗 Bağlantı</button><button type="button" class="pp-act">⚡ Eylem</button><button type="button" class="pp-shdel" title="Gerçek PowerPoint'te şekle tıklayıp Delete tuşuna basılır">🗑 Şekli sil</button><span class="pp-tnote">Şekli sürükleyerek yerini değiştirebilirsiniz</span></div>
    <div class="pp-rib" data-tab="pic" hidden><button type="button" class="pp-crop" title="Kenarlardaki siyah çizgileri içeri sürükleyin; bitince yeniden Kırp'a basın">✂ Kırp</button><span class="pp-sep"></span>
      <span class="pp-autos">Genişlik: <button type="button" class="pp-spin" data-imgw="-1" title="Küçült">−</button><output class="pp-aval pp-imgwv"></output><button type="button" class="pp-spin" data-imgw="1" title="Büyüt">+</button></span><span class="pp-tnote">Resmin köşesindeki yuvarlaktan tutup sürükleyerek de büyütüp küçültebilirsiniz</span></div>
    <div class="pp-rib" data-tab="audio" hidden><span class="pp-tnote">Ses Stilleri:</span><button type="button" class="pp-musnostyle" title="Ses yalnızca eklendiği slaytta çalar">Stil Yok</button><button type="button" class="pp-musbg" title="Ses bütün slaytlar boyunca çalar, simgesi gösteride gizlenir">🎵 Arka Planda Yürüt</button></div>
    <div class="pp-rib" data-tab="design" hidden>${THEMES.map(([id, n, bg, fg]) => `<button type="button" class="pp-theme" data-theme="${id}" title="${n}" style="background:${bg};color:${fg}">Aa<small>${n}</small></button>`).join('')}<span class="pp-sep"></span><button type="button" class="pp-bgbtn" title="Seçili slaydın arka planı: düz renk ya da resim">🎨 Arka Planı Biçimlendir</button></div>
    <div class="pp-rib" data-tab="trans" hidden>${TRANS.map(([id, n]) => `<button type="button" data-trans="${id}">${n}</button>`).join('')}<span class="pp-tnote">Seçili slayda uygulanır</span><span class="pp-sep"></span>
      <span class="pp-autos">Sonraki Slayt: <label class="pp-tlab"><input type="checkbox" class="pp-tclick"> Fare Tıklatıldığında</label><label class="pp-tlab"><input type="checkbox" class="pp-tafter"> Sonra:</label><button type="button" class="pp-spin" data-tafter="-1" title="Azalt">−</button><output class="pp-aval pp-tafterv">00:00,00</output><button type="button" class="pp-spin" data-tafter="1" title="Artır">+</button></span>
      <button type="button" class="pp-tall" title="Bu slaydın geçişini ve zamanlamasını bütün slaytlara uygular">⧉ Tümüne Uygula</button></div>
    <div class="pp-rib" data-tab="anim" hidden><button type="button" class="pp-aprev" title="Animasyonu bu slaytta oynat">▶ Önizleme</button><span class="pp-sep"></span>
      <span class="pp-fxg pp-fxg-in"><b>Giriş</b>${ANIMS.map(([id, n]) => `<button type="button" data-anim="${id}">${n}</button>`).join('')}</span>
      ${['em', 'out'].map((k) => `<span class="pp-fxg pp-fxg-${k}"><b>${FX_KIND[k][0]}</b>${FX.filter((f) => f[2] === k).map(([id, n]) => `<button type="button" data-fx="${id}">${n}</button>`).join('')}</span>`).join('')}<span class="pp-sep"></span>
      <span class="pp-newwrap"><button type="button" class="pp-aadd" title="Seçili nesneye ikinci bir animasyon ekler">✚ Animasyon Ekle ▾</button><span class="pp-lay pp-aaddlist" hidden>${['in', 'em', 'out'].map((k) => `<b class="pp-laysub">${FX_KIND[k][0]}</b>${FX.filter((f) => f[2] === k).map(([id, n]) => `<button type="button" data-addfx="${id}"><i class="pp-ap-star" style="color:${FX_KIND[k][1]}">★</i> ${n}</button>`).join('')}`).join('')}</span></span>
      <button type="button" class="pp-apbtn" title="Slayttaki bütün animasyonları sırasıyla listeler">☰ Animasyon Bölmesi</button><span class="pp-sep"></span>
      <span class="pp-atime"><span class="pp-autos">Başlangıç: ${STARTS.map(([k, n]) => `<button type="button" data-ast="${k}">${n}</button>`).join('')}</span>
        <span class="pp-autos">Süre: <button type="button" class="pp-spin" data-adur="-1" title="Kısalt">−</button><output class="pp-aval pp-adur">00,50</output><button type="button" class="pp-spin" data-adur="1" title="Uzat">+</button></span>
        <span class="pp-autos">Gecikme: <button type="button" class="pp-spin" data-adel="-1" title="Azalt">−</button><output class="pp-aval pp-adel">00,00</output><button type="button" class="pp-spin" data-adel="1" title="Artır">+</button></span>
        <span class="pp-autos" title="Animasyonu Yeniden Sırala"><button type="button" data-amove="-1">▲ Önceye Taşı</button><button type="button" data-amove="1">▼ Sonraya Taşı</button></span></span>
      <span class="pp-tnote pp-anote">Önce slayttaki bir nesneye tıklayın</span></div>
    <div class="pp-rib" data-tab="view" hidden><button type="button" data-view="normal">▭ Normal</button><button type="button" data-view="sorter">▦ Slayt Sıralayıcı</button><button type="button" data-view="notes" title="Slayt ve altında konuşmacı notu, kâğıt gibi">📄 Not Sayfası</button><button type="button" data-view="reading" title="Sunuyu pencerenin içinde, gösteri gibi okur">📖 Okuma Görünümü</button><button type="button" data-view="master" title="Bütün slaytların ortak görünüşü: yazı tipi, renk, logo, alt bilgi">🎨 Asıl Slayt</button><span class="pp-tnote">Sıralayıcıda slaytları sürükleyerek yerlerini değiştirin; çift tıklayınca slayt açılır</span></div>
    <div class="pp-rib" data-tab="master" hidden><span class="pp-newwrap"><button type="button" class="pp-mfonts">Aa Yazı Tipleri ▾</button><span class="pp-lay pp-mfontlist" hidden>${FONTS.map(([k, n, f]) => `<button type="button" data-mfont="${k}" style="font-family:${esc(f)}">${n}</button>`).join('')}</span></span><span class="pp-sep"></span>
      <span class="pp-tnote">Başlık rengi: asıl slayttaki başlığa tıklayın → Giriş → Yazı Tipi Rengi · Logo: Ekle → Resim · Alt bilgi: asıl slayttaki “Alt Bilgi” kutusuna yazın</span>
      <button type="button" class="pp-mclose">✖ Asıl Görünümü Kapat</button></div>
    <div class="pp-rib" data-tab="show" hidden><button type="button" class="pp-play">▶ Baştan başla <small>F5</small></button><button type="button" class="pp-play-cur">▶ Geçerli slayttan <small>Shift + F5</small></button><span class="pp-sep"></span><button type="button" class="pp-rehearse" title="Gösteriyi izlerken her slaytta ne kadar kaldığınızı ölçer">⏱ Zamanlamaları Prova Et</button></div>
    <div class="pp-menu" hidden><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı Kaydet…</button><button type="button" data-file="export">📤 Dışarı Aktar ▸</button><span class="pp-expl" hidden><button type="button" data-file="pdf">📕 PDF/XPS Belgesi Oluştur</button><button type="button" data-file="video">🎬 Video Oluştur</button></span><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button></div>
    <div class="pp-main"><div class="pp-thumbs" tabindex="0"></div><div class="pp-stage"><div class="pp-slide"></div></div><div class="pp-sorter" hidden tabindex="0"></div>
      <div class="pp-master" hidden><div class="pp-mside"><b>Asıl Slayt</b><div class="pp-mini pp-mbig"></div><p>Burada yaptığınız her değişiklik <b>bütün slaytlara</b> birden uygulanır. Slaytlardaki yazılar değişmez. Alt bilginin slaytlarda görünmesi için <b>Ekle → Üst Bilgi ve Alt Bilgi</b>'de <b>Alt bilgi</b> işaretlenmelidir.</p></div><div class="pp-mall"></div></div>
      <div class="pp-npage" hidden><div class="pp-np-nav"><button type="button" class="pp-np-prev">◀ Önceki</button><span class="pp-np-no"></span><button type="button" class="pp-np-next">Sonraki ▶</button></div>
        <div class="pp-np-paper"><div class="pp-mini pp-np-sl"></div><textarea class="pp-npt" placeholder="Metin eklemek için tıklayın" spellcheck="false"></textarea></div></div>
      <div class="pp-cdata" hidden><div class="pp-cd-h">📊 Grafik verileri<button type="button" class="pp-cd-x" title="Kapat">✖</button></div>
        <table><thead><tr><th></th><th>Kategori</th><th>Değer</th></tr></thead><tbody></tbody></table>
        <div class="pp-cd-type">Grafik türü: ${CHARTS.map(([k, n]) => `<button type="button" data-ctype="${k}">${n.replace(' grafiği', '')}</button>`).join('')}</div>
        <small class="pp-cd-n">Yazdıkça slayttaki grafik değişir. Bir satırı kullanmamak için kategorisini silin.</small></div>
      <div class="pp-apane" hidden><div class="pp-ap-h">Animasyon Bölmesi<button type="button" class="pp-ap-x" title="Kapat">✖</button></div>
        <div class="pp-ap-bar"><button type="button" class="pp-ap-play" title="Slaydın bütün animasyonlarını sırayla oynatır">▶ Oynat</button><span class="pp-ap-mv"><button type="button" data-amove="-1" title="Önceye Taşı">▲</button><button type="button" data-amove="1" title="Sonraya Taşı">▼</button></span></div>
        <div class="pp-ap-list"></div>
        <div class="pp-ap-foot"><button type="button" class="pp-ap-del" title="Seçili animasyonu kaldırır">🗑 Kaldır</button><small>🖱 Tıklatıldığında<br>🕒 Öncekinden Sonra</small></div></div>
      <div class="pp-bgpane" hidden><div class="pp-ap-h">Arka Planı Biçimlendir<button type="button" class="pp-bg-x" title="Kapat">✖</button></div>
        <div class="pp-bg-b"><b>Dolgu</b><label><input type="radio" name="ppbg" value="solid"> Düz dolgu</label>
          <div class="pp-bg-cols"><span>Renk:</span>${BGCOLORS.map(([k, n]) => `<button type="button" class="pp-mcol" data-bgcol="${k}" title="${n}"><i style="background:${k}"></i></button>`).join('')}</div>
          <label><input type="radio" name="ppbg" value="pic"> Resim veya doku dolgusu</label>
          <div class="pp-bg-cols"><span>Resim kaynağı:</span><button type="button" class="pp-bg-ins">Ekle…</button></div></div>
        <div class="pp-ap-foot"><button type="button" class="pp-bg-all" title="Bu arka planı bütün slaytlara uygular">Tümüne Uygula</button><button type="button" class="pp-bg-reset">Arka Planı Sıfırla</button></div></div></div>
    <div class="pp-notes"><label>📝 Konuşmacı notları <small>(yalnızca siz görürsünüz; izleyiciye gösterilmez)</small></label><textarea class="pp-nt" placeholder="Bu slaytta söylemek istediklerinizi buraya yazın" spellcheck="false"></textarea></div>
    <div class="pp-status"><span class="pp-st"></span><span>Türkçe (Türkiye)</span></div>
    <div class="pp-show" hidden tabindex="0"></div>
    <div class="pp-rhbar" hidden><b>⏱ Kayıt</b><span class="pp-rh-t"></span><button type="button" class="pp-rh-next">➡ Sonraki</button></div>
    <div class="pp-read" hidden tabindex="0"><div class="pp-rd-st"></div><div class="pp-rd-bar"><span class="pp-rd-no"></span><span class="pp-rd-nav"><button type="button" class="pp-rd-prev" title="Önceki">◀</button><button type="button" class="pp-rd-next" title="Sonraki">▶</button></span><button type="button" class="pp-rd-normal">▭ Normal</button></div></div>`;
  const $ = (s) => body.querySelector(s);
  let deck, cur = 0, fileName = null, folder = 'docs', dirty = false;
  // anim: eski slayt animasyonu (bütün maddeler ve resim); anims: nesne animasyonları [{ t, effect, start, dur, delay }]
  const blank = (layout) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, anims: [], auto: 0, imgSize: 'M', notes: '', shapes: [], ink: [], fc: {}, al: {}, bg: null, imgW: 0, crop: null, hidden: false, click: true });
  let view = 'normal';
  // Resim seçili mi (Resim Biçimi sekmesi), Kırp açık mı, Arka Planı Biçimlendir bölmesi açık mı, Asıl Slayt'ta başlık seçili mi
  let selImg = false, cropOn = false, bgOpen = false, masterSel = null;
  let lastK = null; // en son tıklanan yazı kutusu (Yazı boyutu bunu değiştirir)
  let selShape = -1; // seçili şeklin sırası (-1: yok)
  // Animasyon: seçili nesne ('title', 'sub', 'body', 'body2', 'img', 'shp:2' …), Animasyon Bölmesi'nde seçili satır, bölme açık mı
  let selObj = null, selAnim = -1, paneOpen = false;

  // Şekil, WordArt, eylem düğmesi ya da video: slayda göre yüzde konumlu kutu
  function shapeHtml(o, i, edit) {
    const pos = `left:${o.x}%;top:${o.y}%;width:${o.w}%;height:${o.h}%`;
    const link = o.link ? ` data-link="${esc(o.link)}"` : '';
    if (o.kind === 'video') return `<div class="pp-shp pp-video" data-si="${i}" style="${pos}"><img src="${pictureURL(o.pic)}" alt=""><span class="pp-vplay">▶</span><span class="pp-vname">🎬 ${esc(o.name)}</span><i class="pp-vbar"></i></div>`;
    const act = ACTS.find((a) => a[0] === o.kind);
    const tx = act ? `<span class="pp-shtx">${act[1]}</span>` : `<span class="pp-shtx" data-si="${i}" ${edit ? 'contenteditable="true"' : ''}>${esc(o.text || '')}</span>`;
    return `<div class="pp-shp pp-shp-${act ? 'act' : o.kind}${o.style ? ' pp-' + o.style : ''}"${link} data-si="${i}" style="${pos};--fill:${o.fill || FILLS[0][0]}">${tx}</div>`;
  }

  // SmartArt: maddeleri renkli kutulara, oklu adımlara ya da soy ağacına dönüştürür.
  // Düzenlerken şemanın solunda Metin Bölmesi durur: her satır bir kutudur (Enter yeni kutu açar).
  function artHtml(kind, items, edit, s) {
    const box = (t, i) => `<div class="pp-ab" style="background:${ART_COLORS[i % ART_COLORS.length]}">${esc(t)}</div>`;
    let art;
    if (!items.length) art = '<div class="pp-art"><div class="pp-artempty">Metin Bölmesi\'ne yazın</div></div>';
    else if (kind === 'surec') art = `<div class="pp-art pp-art-surec">${items.map((t, i) => `${box(t, i)}${i < items.length - 1 ? '<span class="pp-arrow">➜</span>' : ''}`).join('')}</div>`;
    else if (kind === 'agac') art = `<div class="pp-art pp-art-agac"><div class="pp-atop">${box(items[0], 0)}</div><div class="pp-alines"></div><div class="pp-akids">${items.slice(1).map((t, i) => `<div class="pp-akid">${box(t, i + 1)}</div>`).join('')}</div></div>`;
    else art = `<div class="pp-art pp-art-liste">${items.map(box).join('')}</div>`;
    if (!edit || !s) return art;
    return `<div class="pp-artwrap"><div class="pp-artpane"><b>Metin Bölmesi</b><ul class="pp-box pp-artul${plain(s.body) ? '' : ' empty'}" data-k="body" contenteditable="true" data-ph="[Metin]">${s.body || '<li><br></li>'}</ul></div>${art}</div>`;
  }
  // Metin Bölmesi'ne yazdıkça şema yenilenir (imleç bölmede kalır)
  function refreshArt() {
    const s = deck.slides[cur];
    const old = $('.pp-slide .pp-artwrap > .pp-art');
    if (!s.art || !old) return;
    const items = [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean);
    old.outerHTML = artHtml(s.art, items, false);
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
  function slideHtml(s, edit, noInk) {
    const [, , bg, fg, thAcc] = theme();
    const m = deck.master || {};
    const acc = m.color || thAcc;
    const font = FONTS.find((f) => f[0] === m.font && f[0] !== 'calibri');
    const ce = edit ? 'contenteditable="true"' : '';
    const box = (k, cls) => `<div class="pp-box ${cls}${s[k] ? '' : ' empty'}" data-k="${k}" ${ce} data-ph="${PH[k]}"${fsStyle(s, k)}>${s[k] || ''}</div>`;
    const list = (k) => (edit ? `<ul class="pp-box pp-body${plain(s[k]) ? '' : ' empty'}" data-k="${k}" ${ce} data-ph="${PH[k]}"${fsStyle(s, k)}>${s[k] || '<li><br></li>'}</ul>` : `<ul class="pp-body" data-k="${k}"${fsStyle(s, k)}>${s[k]}</ul>`);
    // Resim: genişlik (imgW, kabın yüzdesi) ve kırpma (crop: kenarlardan yüzde) verilmişse satır içi stil
    const c = s.crop;
    const imgSt = [s.imgW && `width:${s.imgW}%;max-width:none;max-height:none`, c && `clip-path:inset(${c.t}% ${c.r}% ${c.b}% ${c.l}%)`].filter(Boolean).join(';');
    const img = (cls = '') => (s.img ? `<img class="pp-img pp-s${s.imgSize || 'M'} ${cls}" src="${pictureURL(s.img)}" alt=""${imgSt ? ` style="${imgSt}"` : ''}>` : '');
    const items = () => [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean);
    let inner = s.layout === 'blank' ? '' : box('title', s.layout === 'title' ? 'pp-t-big' : 'pp-t');
    if (s.layout === 'title') inner += box('sub', 'pp-sub');
    const extra = (s.table ? tableHtml(s.table, ce) : '') + (s.chart ? chartHtml(s.chart) : '');
    if (s.layout === 'content') inner += `<div class="pp-row">${s.art ? artHtml(s.art, items(), edit, s) : extra && !plain(s.body) ? '' : list('body')}${extra}${img()}</div>`;
    else if (extra && s.layout !== 'two' && s.layout !== 'photo') inner += `<div class="pp-row">${extra}</div>${img('pp-img-c')}`;
    else if (s.layout === 'two') inner += `<div class="pp-row">${list('body')}${list('body2')}</div>${img('pp-img-c')}`;
    else if (s.layout === 'photo') inner += `<div class="pp-photobox">${s.img ? img('pp-photo') : '<div class="pp-nophoto">Fotoğraf eklemek için Ekle → Resim</div>'}</div>${box('sub', 'pp-sub pp-cap').replace(PH.sub, PH.cap)}`;
    else if (s.img) inner += img('pp-img-c');
    const logo = m.logo ? `<img class="pp-logo" src="${pictureURL(m.logo)}" alt="">` : '';
    // Üst Bilgi ve Alt Bilgi: “Başlık slaydında gösterme” seçiliyse başlık slaydında numara, alt bilgi ve tarih çıkmaz.
    // Asıl Slayt'taki alt bilgi yazısı ancak pencerede “Alt bilgi” işaretliyse (hf.foot) slaytlarda görünür.
    const hf = deck.hf || {};
    const hfOff = hf.hideTitle && s.layout === 'title';
    const num = deck.slideNum && !hfOff && deck.slides.includes(s) ? `<span class="pp-num-b">${deck.slides.indexOf(s) + 1}</span>` : '';
    const foot = m.footer && hf.foot && !hfOff ? `<span class="pp-foot">${esc(m.footer)}</span>` : '';
    const date = hf.date && !hfOff ? `<span class="pp-date">${esc(hf.fixed ? hf.dateText || '' : bugun())}</span>` : '';
    const shapes = (s.shapes || []).map((o, i) => shapeHtml(o, i, edit)).join('');
    const ink = !noInk && s.ink?.length ? inkSvg(s.ink) : '';
    // Ses simgesi: yalnızca düzenlerken, sesin eklendiği slaytta
    const aud = edit && deck.music && deck.slides[deck.musicAt || 0] === s ? `<span class="pp-audio" title="${esc(deck.music)}">🔊</span>` : '';
    // Arka Planı Biçimlendir: düz renk ya da resim, temanın arka planının yerine geçer
    const back = s.bg?.color || (s.bg?.pic ? `center / cover no-repeat url('${pictureURL(s.bg.pic)}')` : bg);
    return `<div class="pp-sl pp-l-${s.layout}${m.color ? ' pp-mc' : ''}" style="background:${back};color:${fg};--acc:${acc}${font ? `;font-family:${esc(font[2])}` : ''}">${inner}${shapes}${num}${logo}${foot}${date}${aud}${ink}</div>`;
  }
  function render() {
    // Gizli slaydın numarası üstü çizili görünür
    $('.pp-thumbs').innerHTML = deck.slides.map((s, i) => `<div class="pp-th${i === cur ? ' on' : ''}${s.hidden ? ' pp-hid' : ''}" data-i="${i}"><span>${s.hidden ? `<s>${i + 1}</s>` : i + 1}${s.trans !== 'none' ? ' ★' : ''}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    $('.pp-slide').innerHTML = slideHtml(deck.slides[cur], true);
    $('.pp-thumbs').hidden = view !== 'normal';
    $('.pp-stage').hidden = view !== 'normal';
    $('.pp-master').hidden = view !== 'master';
    $('.pp-npage').hidden = view !== 'notes';
    $('.pp-notes').hidden = view === 'notes';
    $('.pp-read').hidden = view !== 'reading';
    if (view === 'notes') {
      $('.pp-np-sl').innerHTML = slideHtml(deck.slides[cur], false);
      $('.pp-np-no').textContent = `Sayfa ${cur + 1} / ${deck.slides.length}`;
      if ($('.pp-npt').value !== (deck.slides[cur].notes || '')) $('.pp-npt').value = deck.slides[cur].notes || '';
    }
    if (selShape >= (deck.slides[cur].shapes || []).length) selShape = -1;
    markSel();
    $('.pp-mtab').hidden = view !== 'master';
    if (view === 'master') {
      const m = deck.master || {};
      const sample = { ...blank('content'), title: 'Asıl başlık stili', body: '<li>Birinci düzey madde</li><li>İkinci madde</li>' };
      $('.pp-mbig').innerHTML = slideHtml(sample, false);
      // Asıl slayt: başlığa tıklanınca seçilir (rengi Giriş → Yazı Tipi Rengi ile); altta yazılabilir Alt Bilgi kutusu
      const msl = $('.pp-mbig .pp-sl');
      msl.querySelector('.pp-foot')?.remove();
      msl.querySelector('[data-k="title"]')?.classList.toggle('pp-osel', masterSel === 'title');
      msl.insertAdjacentHTML('beforeend', `<div class="pp-mfootph${m.footer ? '' : ' empty'}" contenteditable="true" data-ph="Alt Bilgi" spellcheck="false">${esc(m.footer || '')}</div>`);
      $('.pp-mall').innerHTML = deck.slides.map((s, i) => `<div class="pp-sth"><span>${i + 1}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
      body.querySelectorAll('[data-mfont]').forEach((b) => b.classList.toggle('on', b.dataset.mfont === (m.font || 'calibri')));
    }
    renderChartData();
    $('.pp-sorter').hidden = view !== 'sorter';
    if (view === 'sorter') $('.pp-sorter').innerHTML = deck.slides.map((s, i) => `<div class="pp-sth${i === cur ? ' on' : ''}${s.hidden ? ' pp-hid' : ''}" data-i="${i}" draggable="true"><span>${s.hidden ? `<s>${i + 1}</s>` : i + 1}${s.trans !== 'none' ? ' ★' : ''}${s.anim?.effect !== 'none' || s.anims?.length ? ' ✦' : ''}${s.auto > 0 ? `<em class="pp-stime">${fmtT(s.auto).slice(2)}</em>` : ''}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    body.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === view));
    animUi();
    const s = deck.slides[cur];
    // Geçişler → Zamanlama: Fare Tıklatıldığında, Sonra: (süre)
    $('.pp-tclick').checked = s.click !== false;
    $('.pp-tafter').checked = s.auto > 0;
    $('.pp-tafterv').textContent = fmtA(s.auto || 0);
    $('.pp-musicname').textContent = deck.music ? `🔊 ${deck.music}` : '';
    $('.pp-st').textContent = `Slayt ${cur + 1} / ${deck.slides.length}`;
    if ($('.pp-nt').value !== (deck.slides[cur].notes || '')) $('.pp-nt').value = deck.slides[cur].notes || '';
    body.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('on', b.dataset.theme === deck.theme));
    body.querySelectorAll('[data-trans]').forEach((b) => b.classList.toggle('on', b.dataset.trans === s.trans));
    // Bağlamsal sekmeler: Resim Biçimi (resim seçiliyken), Kayıttan Yürütme (sesin olduğu slaytta)
    if (!s.img || view !== 'normal') { selImg = false; cropOn = false; }
    $('.pp-ptab').hidden = !selImg;
    $('.pp-utab').hidden = !(deck.music && view === 'normal' && (deck.musicAt || 0) === cur);
    $('.pp-imgwv').textContent = `${imgCm()} cm`;
    $('.pp-crop').classList.toggle('on', cropOn);
    $('.pp-musbg').classList.toggle('on', !!deck.musicBg);
    $('.pp-musnostyle').classList.toggle('on', !deck.musicBg);
    body.querySelectorAll('.pp-tabs [data-tab]').forEach((b) => { if (b.hidden && b.classList.contains('on')) showTab('home'); });
    // Arka Planı Biçimlendir bölmesi
    const bp = $('.pp-bgpane');
    bp.hidden = !(bgOpen && view === 'normal');
    $('.pp-main').classList.toggle('bg-open', !bp.hidden);
    bp.querySelector('[value="solid"]').checked = !!s.bg?.color;
    bp.querySelector('[value="pic"]').checked = !!s.bg?.pic;
    bp.querySelectorAll('[data-bgcol]').forEach((b) => b.classList.toggle('on', b.dataset.bgcol === s.bg?.color));
    body.querySelectorAll('.pp-bgbtn').forEach((b) => b.classList.toggle('on', !bp.hidden));
    drawImgSel();
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
    $('.pp-slide').querySelectorAll('.pp-shtx[data-si]').forEach((el) => { const o = s.shapes?.[+el.dataset.si]; if (o) o.text = el.textContent.trim(); });
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
    drawImgSel();
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
  function go(i) { pull(); cur = Math.max(0, Math.min(deck.slides.length - 1, i)); selShape = -1; selObj = null; selAnim = -1; selImg = false; cropOn = false; render(); emit('ppt-select', { index: cur }); }
  // Seçili şeklin çerçevesi ve bağlamsal “Şekil Biçimi” sekmesi
  function markSel() {
    $('.pp-slide').querySelectorAll('.pp-shp').forEach((el) => el.classList.toggle('sel', +el.dataset.si === selShape));
    const o = deck.slides[cur].shapes?.[selShape];
    $('.pp-stab').hidden = !o;
    if (!o && $('.pp-stab').classList.contains('on')) showTab('home');
    body.querySelectorAll('[data-fill]').forEach((b) => b.classList.toggle('on', !!o && b.dataset.fill === o.fill));
  }

  // ---- Resim Biçimi: köşeden büyütme, Genişlik, Kırp ----
  const imgEl = () => $('.pp-slide .pp-img');
  // Resmin genişliği, kabının yüzdesi olarak (verilmemişse ekrandaki hâlinden ölçülür)
  function curImgW() {
    const s = deck.slides[cur], el = imgEl();
    if (s.imgW) return s.imgW;
    const pw = el?.parentElement.getBoundingClientRect().width;
    return pw ? Math.round((el.getBoundingClientRect().width / pw) * 100) : 42;
  }
  // Genişlik santim olarak: slayt 33,87 cm genişliğinde (16:9) sayılır
  function imgCm() {
    const el = imgEl(), sl = $('.pp-slide .pp-sl');
    const w = el && sl ? (el.getBoundingClientRect().width / sl.getBoundingClientRect().width) * 33.87 : 0;
    return w.toFixed(1).replace('.', ',');
  }
  // Seçili resmin çerçevesi: köşelerde boyut tutamaçları; Kırp açıkken kenarlarda siyah kırpma çizgileri
  function drawImgSel() {
    $('.pp-slide .pp-imgsel')?.remove();
    const el = imgEl(), sl = $('.pp-slide .pp-sl');
    if (!selImg || !el || !sl || $('.pp-stage').hidden) return;
    const r0 = sl.getBoundingClientRect(), r = el.getBoundingClientRect();
    const c = deck.slides[cur].crop || { l: 0, t: 0, r: 0, b: 0 };
    const box = document.createElement('div');
    box.className = 'pp-imgsel' + (cropOn ? ' pp-cropping' : '');
    Object.assign(box.style, { left: r.left - r0.left + 'px', top: r.top - r0.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    box.innerHTML = cropOn
      ? `<i class="pp-croph" data-c="l" style="left:${c.l}%"></i><i class="pp-croph" data-c="r" style="right:${c.r}%"></i><i class="pp-croph" data-c="t" style="top:${c.t}%"></i><i class="pp-croph" data-c="b" style="bottom:${c.b}%"></i>`
      : ['nw', 'ne', 'sw', 'se'].map((k) => `<i class="pp-imgh pp-imgh-${k}" data-h="${k}"></i>`).join('');
    sl.append(box);
  }
  function setImgW(w, how) {
    const s = deck.slides[cur];
    const old = curImgW();
    s.imgW = Math.max(10, Math.min(100, Math.round(w)));
    changed(); render();
    emit('ppt-imgsize', { w: s.imgW, grow: s.imgW > old, hasImg: !!s.img, index: cur, how });
  }

  // ---- Nesne animasyonları (Animasyonlar sekmesi, Animasyon Bölmesi) ----
  // Nesnenin slayttaki öğeleri; maddeler paragraf paragraf (SmartArt'ta kutu kutu) döner
  function objEls(root, t) {
    if (t.startsWith('shp:')) return [...root.querySelectorAll(`.pp-shp[data-si="${t.slice(4)}"]`)];
    if (t === 'img') return [...root.querySelectorAll('.pp-img')];
    if (t === 'body' || t === 'body2') {
      const ul = root.querySelector(`.pp-body[data-k="${t}"]`);
      if (ul) return [...ul.children];
      return t === 'body' ? [...root.querySelectorAll('.pp-ab')] : [];
    }
    return [...root.querySelectorAll(`.pp-box[data-k="${t}"]`)];
  }
  // Nesnenin bütünü (çerçeve ve numara için)
  const objBox = (root, t) => (t === 'body' || t === 'body2' ? root.querySelector(`.pp-body[data-k="${t}"]`) || (t === 'body' ? root.querySelector('.pp-art') : null) : objEls(root, t)[0]);
  // Animasyon Bölmesi'ndeki ad: “Başlık: Kermes”, “Yıldız: 50 TL” …
  function objName(s, t) {
    const cut = (x) => (x.length > 24 ? x.slice(0, 23) + '…' : x);
    if (t.startsWith('shp:')) {
      const o = s.shapes?.[+t.slice(4)];
      if (!o) return 'Şekil';
      const nm = o.kind === 'video' ? 'Video' : o.kind === 'wordart' ? 'WordArt' : (SHAPES.find((x) => x[0] === o.kind) || ACTS.find((x) => x[0] === o.kind))?.[2] || 'Şekil';
      return o.text ? `${nm}: ${cut(o.text)}` : nm;
    }
    if (t === 'img') return 'Resim';
    if (t === 'body' || t === 'body2') return `Maddeler: ${cut((new DOMParser().parseFromString(`<ul>${s[t]}</ul>`, 'text/html').querySelector('li')?.textContent || '').trim())}`;
    return `${t === 'title' ? 'Başlık' : 'Alt başlık'}: ${cut(plain(s[t]))}`;
  }
  const anItems = (s, t) => [...new DOMParser().parseFromString(`<ul>${s[t]}</ul>`, 'text/html').querySelectorAll('li')].filter((li) => li.textContent.trim()).length;
  // Eski (bütün slayda verilen) animasyonu nesne animasyonlarına çevirir: ikisi aynı slaytta karışmasın
  function toList(s) {
    if (!s.anims) s.anims = [];
    const eff = s.anim?.effect;
    if (!eff || eff === 'none') return;
    const auto = s.anim.start === 'auto';
    const add = [s.art ? 'body' : plain(s.body) && 'body', plain(s.body2) && s.layout === 'two' && 'body2', s.img && 'img'].filter(Boolean);
    s.anims.unshift(...add.map((t, k) => ({ t, effect: eff, start: auto ? 'after' : 'click', dur: FX_DUR[eff], delay: auto ? (k ? 0.5 : 0.7) : 0 })));
    s.anim = { ...s.anim, effect: 'none' };
  }
  // Sıra: her “Tıklatıldığında” yeni bir tıklama adımı açar; “Öncekiyle” öncekiyle aynı anda, “Öncekinden Sonra” önceki
  // bitince başlar. İlk animasyon tıklama beklemiyorsa slayt açılır açılmaz kendiliğinden oynar (click: false olan adım).
  function animSeq(s, root) {
    const groups = [];
    let g = null, prevAt = 0, prevEnd = 0;
    (s.anims || []).forEach((a, ai) => {
      const els = objEls(root, a.t);
      const parts = a.t === 'body' || a.t === 'body2' ? els.map((el) => [el]) : [els];
      parts.forEach((part) => {
        if (!g || a.start === 'click') { g = { click: a.start === 'click', acts: [], len: 0 }; groups.push(g); prevAt = prevEnd = 0; }
        const at = (a.start === 'after' ? prevEnd : prevAt) + (a.delay || 0) * 1000, dur = (a.dur || FX_DUR[a.effect] || 0.5) * 1000;
        g.acts.push({ els: part, a, ai, at, dur, kind: fxOf(a.effect)?.[2] || 'in' });
        prevAt = at; prevEnd = at + dur;
        g.len = Math.max(g.len, prevEnd);
      });
    });
    // İlk animasyonu giriş olan öğeler başta görünmez
    const seen = new Set();
    groups.forEach((x) => x.acts.forEach((act) => act.els.forEach((el) => { if (!seen.has(el)) { seen.add(el); if (act.kind === 'in') el.classList.add('pp-anim-hide'); } })));
    return groups;
  }
  // Bir animasyonu oynatır (fin: hemen sonuna atlar). Çıkışta öğe, animasyon bitince gizlenir.
  function playAct(act, list, fin) {
    const key = FX_KEY[act.a.effect];
    act.els.forEach((el) => {
      el.classList.remove('pp-anim-hide');
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = key ? `${key} ${fin ? 1 : act.dur}ms ${act.kind === 'em' ? 'ease-in-out' : 'ease-out'} both` : '';
    });
    if (act.kind === 'out') list.push(setTimeout(() => act.els.forEach((el) => { el.classList.add('pp-anim-hide'); el.style.animation = ''; }), fin ? 1 : act.dur));
  }
  // Seçili nesneyi değiştirir (slayttaki nesneye tıklayınca ya da bölmede bir satıra tıklayınca)
  function pickObj(t, ai) {
    const an = deck.slides[cur].anims || [];
    selObj = t || null;
    selAnim = ai ?? (t ? an.findIndex((a) => a.t === t) : -1);
    animUi();
  }
  // Şerit, Animasyon Bölmesi ve slayttaki animasyon numaraları
  function animUi() {
    const s = deck.slides[cur];
    const an = s.anims || [];
    if (selAnim >= an.length || (selAnim >= 0 && selObj && an[selAnim].t !== selObj)) selAnim = -1;
    const a = an[selAnim];
    const ctx = !!(a || selObj);
    // Gerçek PowerPoint'teki gibi: nesne seçilmeden efekt galerisi gri (kullanılamaz)
    body.querySelectorAll('[data-anim]').forEach((b) => { b.classList.toggle('on', a ? b.dataset.anim === a.effect : ctx && b.dataset.anim === 'none'); b.disabled = !ctx; });
    body.querySelectorAll('[data-fx]').forEach((b) => { b.classList.toggle('on', !!a && b.dataset.fx === a.effect); b.disabled = !ctx; });
    body.querySelectorAll('.pp-aadd').forEach((b) => { b.disabled = !ctx; });
    $('.pp-atime').querySelectorAll('button').forEach((b) => { b.disabled = !a; });
    body.querySelectorAll('[data-ast]').forEach((b) => b.classList.toggle('on', !!a && b.dataset.ast === a.start));
    $('.pp-adur').textContent = fmtS(a ? a.dur : 0);
    $('.pp-adel').textContent = fmtS(a ? a.delay : 0);
    const who = selObj || a?.t;
    $('.pp-anote').innerHTML = who ? `Seçili: <b>${esc(objName(s, who))}</b>` : 'Önce slayttaki bir nesneye (başlık, maddeler, resim, şekil) tıklayın';
    // Animasyon Bölmesi
    const pane = $('.pp-apane');
    pane.hidden = !(paneOpen && view === 'normal' && $('.pp-cdata').hidden);
    $('.pp-main').classList.toggle('ap-open', !pane.hidden);
    body.querySelectorAll('.pp-apbtn').forEach((b) => b.classList.toggle('on', paneOpen));
    // Numara: kaçıncı tıklamada oynadığı (0: slayt açılınca kendiliğinden); maddeler her paragrafta bir tıklama sayılır
    let n = 0;
    const nums = an.map((x) => {
      const k = x.t === 'body' || x.t === 'body2' ? Math.max(1, anItems(s, x.t)) : 1;
      if (x.start !== 'click') return String(n);
      const from = n + 1;
      n += k;
      return k > 1 ? `${from}–${n}` : String(from);
    });
    if (!pane.hidden) {
      pane.querySelector('.pp-ap-list').innerHTML = an.length ? an.map((x, i) => {
        const f = fxOf(x.effect) || FX[0], st = STARTS.find((y) => y[0] === x.start) || STARTS[0];
        return `<div class="pp-ap-row${i === selAnim ? ' on' : ''}" data-ai="${i}" title="${esc(f[1])} · ${st[1]} · Süre ${fmtS(x.dur)} sn"><span class="pp-ap-no">${x.start === 'click' ? nums[i] : ''}</span><span class="pp-ap-st">${st[2]}</span><i class="pp-ap-star" style="color:${FX_KIND[f[2]][1]}">★</i><span class="pp-ap-nm">${esc(objName(s, x.t))}</span><span class="pp-ap-fx">${esc(f[1])}</span></div>`;
      }).join('') : '<div class="pp-ap-empty">Bu slaytta nesne animasyonu yok.<br>Slayttaki bir nesneye tıklayıp Animasyonlar sekmesinden bir efekt seçin.</div>';
      pane.querySelectorAll('[data-amove], .pp-ap-del').forEach((b) => { b.disabled = !a; });
    }
    // Slaytta: seçili nesnenin çerçevesi ve animasyon numaraları (gösteride görünmez)
    const sl = $('.pp-slide .pp-sl');
    if (!sl) return;
    sl.querySelectorAll('.pp-abadge').forEach((x) => x.remove());
    sl.querySelectorAll('.pp-osel').forEach((x) => x.classList.remove('pp-osel'));
    if (selObj && !selObj.startsWith('shp:')) objBox(sl, selObj)?.classList.add('pp-osel');
    if (!an.length || $('.pp-stage').hidden) return;
    const r0 = sl.getBoundingClientRect(), tags = new Map();
    an.forEach((x, i) => { if (!tags.has(x.t)) tags.set(x.t, []); tags.get(x.t).push([nums[i], i === selAnim]); });
    tags.forEach((list, t) => {
      const el = objBox(sl, t);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const b = document.createElement('span');
      b.className = 'pp-abadge';
      b.innerHTML = list.map(([v, on]) => `<i${on ? ' class="on"' : ''}>${v}</i>`).join('');
      b.style.left = Math.max(0, r.left - r0.left) + 'px';
      b.style.top = Math.max(0, r.top - r0.top) + 'px';
      sl.append(b);
    });
  }
  // Efekt seçmek: seçili animasyonun efekti değişir; “Animasyon Ekle” ile (ya da nesnede animasyon yoksa) yenisi eklenir
  function setFx(effect, add) {
    const s = deck.slides[cur];
    const t = selObj || s.anims?.[selAnim]?.t;
    if (!t) { desk.toast('Animasyon', 'Önce slayttaki nesneye (başlık, maddeler, şekil, resim) tıklayın, sonra efekti seçin.', '✦', 5000); emit('ppt-oanim', { op: 'none', index: cur }); return; }
    pull();
    const had = s.anims?.length || 0;
    toList(s);
    // Eski animasyon listeye çevrildiyse seçili satır kaymış olabilir: nesnenin ilk animasyonunu seç
    if (s.anims.length !== had) selAnim = s.anims.findIndex((x) => x.t === t);
    const a = s.anims[selAnim];
    if (effect === 'none') { if (a) removeAnim(); return; }
    let op;
    if (a && !add) { a.effect = effect; a.dur = FX_DUR[effect]; op = 'change'; }
    else { s.anims.push({ t, effect, start: 'click', dur: FX_DUR[effect], delay: 0 }); selAnim = s.anims.length - 1; op = 'add'; }
    selObj = t;
    changed(); animUi();
    const x = s.anims[selAnim];
    emit('ppt-oanim', { op, t, kind: fxOf(effect)[2], effect, start: x.start, at: selAnim, index: cur, count: s.anims.length, sameObj: s.anims.filter((y) => y.t === t).length });
  }
  function removeAnim() {
    const s = deck.slides[cur];
    const [a] = s.anims.splice(selAnim, 1);
    if (!a) return;
    selAnim = -1;
    changed(); animUi();
    emit('ppt-oanim', { op: 'remove', t: a.t, effect: a.effect, index: cur, count: s.anims.length });
  }
  // Bölmede seçili animasyonu bir üste (-1) ya da alta (+1) taşır
  function moveAnim(d) {
    const an = deck.slides[cur].anims || [];
    const to = selAnim + d;
    if (selAnim < 0 || to < 0 || to >= an.length) return;
    [an[selAnim], an[to]] = [an[to], an[selAnim]];
    selAnim = to; selObj = an[to].t;
    changed(); animUi();
    emit('ppt-oanim', { op: 'move', t: an[to].t, effect: an[to].effect, at: to, dir: d, index: cur, count: an.length });
  }
  // Başlangıç, süre (0,25–5 sn) ve gecikme (0–10 sn); süre ve gecikme 0,25 saniyelik adımlarla değişir
  function setTiming(what, v) {
    const a = deck.slides[cur].anims?.[selAnim];
    if (!a) return;
    if (what === 'start') a.start = v;
    else a[what] = Math.round(Math.max(what === 'dur' ? 0.25 : 0, Math.min(what === 'dur' ? 5 : 10, (a[what] || 0) + v * 0.25)) * 100) / 100;
    changed(); animUi();
    emit('ppt-oanim', { op: what, t: a.t, effect: a.effect, start: a.start, dur: a.dur, delay: a.delay, at: selAnim, index: cur });
  }
  // Düzenleme ekranında önizleme: tıklama beklemeden bütün animasyonlar sırayla oynar, sonra slayt eski hâline döner
  let pvTimers = [];
  function previewAnims() {
    pvTimers.forEach(clearTimeout); pvTimers = [];
    const root = $('.pp-slide');
    root.querySelectorAll('.pp-abadge').forEach((x) => { x.hidden = true; });
    const groups = animSeq(deck.slides[cur], root);
    let off = 300;
    groups.forEach((g) => { const at0 = off; g.acts.forEach((act) => pvTimers.push(setTimeout(() => playAct(act, pvTimers), at0 + act.at))); off += g.len + 400; });
    pvTimers.push(setTimeout(() => {
      groups.forEach((g) => g.acts.forEach((act) => act.els.forEach((el) => { el.classList.remove('pp-anim-hide'); el.style.animation = ''; })));
      root.querySelectorAll('.pp-abadge').forEach((x) => { x.hidden = false; });
    }, off + 300));
    return groups.length;
  }

  function load(data, name = null, fld = folder) {
    deck = data ? structuredClone(data) : { theme: 'beyaz', slides: [blank('title')] };
    deck.slides = deck.slides.map((x) => ({ ...blank(x.layout), ...x }));
    deck.master = { font: 'calibri', color: '', logo: null, footer: '', ...deck.master };
    // Eski dosyalar: alt bilgi yazılmışsa “Alt bilgi” işaretli sayılır
    deck.hf = { foot: !!deck.master.footer, ...deck.hf };
    view = 'normal'; chartOpen = false; selShape = -1; selObj = null; selAnim = -1;
    selImg = false; cropOn = false; bgOpen = false; masterSel = null;
    cur = 0; fileName = name; folder = fld; dirty = false;
    render();
  }

  // ---- Slayt gösterisi ----
  let showAt = -1, timers = [], musicTimer = 0, revealed = 0, revealTotal = 0, jumpBuf = '';
  // tool: null (ok işaretçi) | 'pen' (kalem) | 'hl' (vurgulayıcı); ink: gösteri boyunca her slaydın mürekkebi
  // rehearse: Zamanlamaları Prova Et sırasında her slaytta geçen süre (ms)
  let tool = null, ink = [], inkDirty = false, stroke = null, rehearse = null, rhTimer = 0;
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  // Prova: o ana kadar gösterilen slaydın süresini yazar
  function lap() {
    if (!rehearse) return;
    const now = performance.now();
    if (showAt >= 0 && showAt < deck.slides.length) { rehearse.times[showAt] += now - rehearse.at; rehearse.seen.add(showAt); }
    rehearse.at = now;
  }
  function rhTick() {
    if (!rehearse) return;
    const now = performance.now();
    const here = showAt >= 0 && showAt < deck.slides.length ? rehearse.times[showAt] + now - rehearse.at : 0;
    $('.pp-rh-t').textContent = `Bu slayt ${fmtT(Math.floor(here / 1000))} · Toplam ${fmtT(Math.floor((now - rehearse.start) / 1000))}`;
  }
  // Animasyon: maddeler ve resim tek tek ekrana gelir
  const animTargets = (sh) => [...sh.querySelectorAll('.pp-sh-in .pp-body li, .pp-sh-in .pp-ab, .pp-sh-in .pp-img')];
  function revealNext(sh) {
    const t = animTargets(sh);
    // Animasyonsuz slaytta revealTotal 0'dır: tıklama doğrudan sonraki slayda geçer (görünen maddeleri "açmaya" çalışmaz)
    if (revealed >= Math.min(t.length, revealTotal)) return false;
    t[revealed].classList.add('pp-anim-in');
    t[revealed].classList.remove('pp-anim-hide');
    revealed++;
    emit('ppt-anim-step', { n: revealed, total: t.length, index: showAt });
    return true;
  }
  // Nesne animasyonları gösteride: seq.groups sırayla; seq.run o an oynayan adım, seq.clicks bu slaytta harcanan tıklama
  let seq = null;
  function playGroup(gi, by) {
    const g = seq.groups[gi], my = seq, run = { g, tms: [] };
    seq.run = run;
    g.acts.forEach((act) => run.tms.push(setTimeout(() => { playAct(act, timers); emit('ppt-anim-play', { index: showAt, t: act.a.t, kind: act.kind, effect: act.a.effect, start: act.a.start, by }); }, act.at)));
    run.tms.push(setTimeout(() => endGroup(my, run), g.len + 30));
    timers.push(...run.tms);
  }
  function endGroup(my, run, fin) {
    if (seq !== my || my.run !== run) return;
    if (fin) { run.tms.forEach(clearTimeout); run.g.acts.forEach((act) => playAct(act, timers, true)); }
    my.run = null;
    if (my.next >= my.groups.length) emit('ppt-anim-done', { index: showAt, clicks: my.clicks, steps: my.groups.filter((x) => x.click).length });
  }
  // Tıklama: oynayan adım varsa sonuna atlar, yoksa sonraki tıklama adımını başlatır
  function stepAnims() {
    if (seq.run) { seq.clicks++; endGroup(seq, seq.run, true); return true; }
    if (seq.next >= seq.groups.length) return false;
    seq.clicks++;
    playGroup(seq.next++, 'click');
    emit('ppt-anim-step', { n: seq.next - (seq.groups[0].click ? 0 : 1), total: seq.groups.filter((x) => x.click).length, index: showAt, clicks: seq.clicks });
    return true;
  }
  // Gizli slaytlar (sağ tık → Slaytı Gizle) gösteride atlanır
  const nextShown = (i, d = 1) => { while (i >= 0 && i < deck.slides.length && deck.slides[i].hidden) i += d; return i; };
  function advance() { if (showAt >= deck.slides.length) return endShow(); const sh = $('.pp-show'); if (!(seq ? stepAnims() : revealNext(sh))) showSlide(nextShown(showAt + 1)); }
  // Ses: “Arka Planda Yürüt” seçiliyse bütün gösteri boyunca, değilse yalnızca eklendiği slaytta çalar
  function syncMusic() {
    const on = !!deck.music && showAt >= 0 && showAt < deck.slides.length && (deck.musicBg || showAt === (deck.musicAt || 0));
    if (on === !!musicTimer) return false;
    if (!on) { clearInterval(musicTimer); musicTimer = 0; emit('ppt-music-stop', { index: showAt }); return false; }
    const audible = playTune(desk, [392, 440, 494, 523, 494, 440], 0.3) > 0;
    musicTimer = setInterval(() => playTune(desk, [392, 440, 494, 523, 494, 440], 0.3), 1900);
    emit('ppt-music-play', { index: showAt, bg: !!deck.musicBg });
    return audible;
  }
  function showSlide(i, dir = 1) {
    const sh = $('.pp-show');
    clearTimers();
    lap();
    if (i >= deck.slides.length) {
      sh.innerHTML = '<div class="pp-end">Slayt gösterisinin sonu. Çıkmak için tıklayın ya da Esc.</div>';
      showAt = deck.slides.length; seq = null;
      syncMusic();
      emit('ppt-show-end', { seen: true });
      return;
    }
    showAt = Math.max(0, i);
    syncMusic();
    const s = deck.slides[showAt];
    seq = null;
    if (s.anims?.length) {
      // Nesne animasyonları: önce kendiliğinden oynayanlar, sonra her tıklamada bir adım
      sh.innerHTML = `<div class="pp-sh-in pp-tr-${dir > 0 ? s.trans : 'none'}">${slideHtml(s, false, true)}${inkSvg(ink[showAt], true)}</div>`;
      revealed = revealTotal = 0;
      seq = { groups: animSeq(s, sh.firstElementChild), next: 0, run: null, clicks: 0 };
      const g0 = seq.groups[0] && !seq.groups[0].click ? seq.groups[0] : null;
      if (g0) playGroup(seq.next++, 'auto');
      if (s.auto > 0 && !rehearse) timers.push(setTimeout(() => { if (!$('.pp-show').hidden && showAt === i) { emit('ppt-auto-advance', { index: i, secs: s.auto }); showSlide(nextShown(i + 1)); } }, s.auto * 1000 + (g0 ? g0.len : 0)));
      emit('ppt-show-slide', { index: showAt, total: deck.slides.length, anim: 'nesne', auto: s.auto, steps: seq.groups.filter((x) => x.click).length });
      return;
    }
    const eff = s.anim?.effect && s.anim.effect !== 'none' ? s.anim.effect : null;
    sh.innerHTML = `<div class="pp-sh-in pp-tr-${dir > 0 ? s.trans : 'none'}${eff ? ' pp-anim-' + eff : ''}">${slideHtml(s, false, true)}${inkSvg(ink[showAt], true)}</div>`;
    revealed = 0;
    const tg = eff ? animTargets(sh) : [];
    revealTotal = tg.length;
    tg.forEach((el) => el.classList.add('pp-anim-hide'));
    // Eski dosyalardaki kendiliğinden başlayan slayt animasyonu: her öğe 1 saniye arayla gelir
    if (eff && s.anim.start === 'auto') tg.forEach((_, k) => timers.push(setTimeout(() => { if ($('.pp-show').hidden || showAt !== i) return; revealNext(sh); }, 700 + k * 1000)));
    // Geçişler → Sonra: animasyon bittikten sonra belirlenen süre geçince sonraki slayda geçer
    if (s.auto > 0 && !rehearse) timers.push(setTimeout(() => { if (!$('.pp-show').hidden && showAt === i) { emit('ppt-auto-advance', { index: i, secs: s.auto }); showSlide(nextShown(i + 1)); } }, (s.auto + (eff && s.anim.start === 'auto' ? revealTotal : 0)) * 1000));
    emit('ppt-show-slide', { index: showAt, total: deck.slides.length, anim: eff, auto: s.auto });
  }
  function startShow(from = 0, opts = {}) {
    pull();
    const sh = $('.pp-show');
    sh.hidden = false;
    sh.focus();
    ink = deck.slides.map((s) => structuredClone(s.ink || []));
    inkDirty = false; setTool(null);
    rehearse = opts.rehearse ? { times: deck.slides.map(() => 0), seen: new Set(), at: performance.now(), start: performance.now() } : null;
    $('.pp-rhbar').hidden = !rehearse;
    if (rehearse) { rhTick(); rhTimer = setInterval(rhTick, 250); }
    clearInterval(musicTimer); musicTimer = 0;
    showAt = nextShown(from);
    const audible = syncMusic();
    emit('ppt-show-start', { from, music: deck.music || null, audible, rehearse: !!rehearse });
    showSlide(showAt);
  }
  function endShow() {
    const sh = $('.pp-show');
    if (sh.hidden) return;
    lap();
    const rh = rehearse;
    rehearse = null; clearInterval(rhTimer); $('.pp-rhbar').hidden = true;
    sh.hidden = true;
    sh.dataset.screen = ''; sh.classList.remove('pp-scr-b', 'pp-scr-w'); jumpBuf = '';
    setTool(null);
    clearTimers();
    clearInterval(musicTimer); musicTimer = 0;
    emit('ppt-show-exit', { at: showAt, finished: showAt >= deck.slides.length });
    showAt = -1; seq = null;
    $('.pp-thumbs').focus();
    afterShow(rh);
  }
  // Gösteriden sonra: çizimler saklansın mı, prova süreleri kaydedilsin mi?
  async function afterShow(rh) {
    if (inkDirty) {
      inkDirty = false;
      const count = ink.reduce((n, x) => n + x.length, 0);
      const a = count ? await desk.dialogs.ask({ title: 'Sunu', icon: '🖊', text: 'Mürekkep ek açıklamalarınızı saklamak istiyor musunuz?<br><small>Saklarsanız çizimler slaytlarda kalır; atarsanız silinir.</small>', buttons: [['keep', 'Sakla', true], ['drop', 'At']] }) : 'drop';
      const keep = a === 'keep';
      deck.slides.forEach((s, i) => { s.ink = keep ? ink[i] : s.ink; });
      if (keep) changed();
      render();
      emit('ppt-ink-keep', { keep, count });
    }
    if (rh) {
      const secs = rh.times.map((t) => Math.max(1, Math.round(t / 1000)));
      const total = [...rh.seen].reduce((n, i) => n + secs[i], 0);
      const a = await desk.dialogs.ask({ title: 'Sunu', icon: '⏱', text: `Slayt gösterisinin toplam süresi <b>${fmtT(total)}</b> idi. Yeni slayt zamanlamalarını saklamak istiyor musunuz?`, buttons: [['yes', 'Evet', true], ['no', 'Hayır']] });
      const saved = a === 'yes';
      if (saved) { rh.seen.forEach((i) => { deck.slides[i].auto = secs[i]; }); changed(); render(); }
      emit('ppt-rehearse', { saved, total, seen: rh.seen.size, all: rh.seen.size === deck.slides.length, times: deck.slides.map((s) => s.auto || 0) });
    }
  }
  // İşaretçi: ok, kalem, vurgulayıcı
  function setTool(t, how) {
    tool = t;
    const sh = $('.pp-show');
    sh.classList.toggle('pp-pen', t === 'pen');
    sh.classList.toggle('pp-hl', t === 'hl');
    if (how) emit('ppt-show-tool', { tool: t || 'arrow', how });
  }
  // E: bu slayttaki bütün çizimleri siler
  function clearInk(how) {
    if (showAt < 0 || showAt >= deck.slides.length) return;
    const had = ink[showAt].length;
    ink[showAt] = [];
    if (had) inkDirty = true;
    $('.pp-show').querySelectorAll('.pp-ink-live polyline').forEach((x) => x.remove());
    emit('ppt-ink-clear', { index: showAt, had, how });
  }
  // Gösteride köprü ve eylem düğmesi: slayda git ya da web adresini bildir
  function follow(href, from) {
    const n = deck.slides.length, at = showAt;
    const rel = { next: at + 1, prev: at - 1, first: 0, last: n - 1 }[href];
    const to = rel ?? (href.startsWith('slayt:') ? +href.slice(6) - 1 : null);
    if (to === null) {
      desk.toast('Bağlantı', `🌐 <b>${esc(href.replace(/^https?:\/\//, ''))}</b><br>Gerçek bilgisayarda bu adres internet tarayıcısında açılır.`, '🔗', 5000);
      emit('ppt-show-link', { kind: 'url', url: href, from, index: at });
      return;
    }
    const k = Math.max(0, Math.min(n - 1, to));
    showSlide(k, k < at ? -1 : 1);
    emit('ppt-show-link', { kind: 'slide', to: k + 1, link: href, from, index: at });
  }
  function closeMenu() { $('.pp-show .pp-shmenu')?.remove(); }
  function onShowClick(e) {
    const mi = e.target.closest('.pp-shmenu [data-sm]');
    if (mi) {
      const v = mi.dataset.sm;
      closeMenu();
      if (v === 'pen' || v === 'hl') setTool(v, 'menu');
      else if (v === 'arrow') setTool(null, 'menu');
      else if (v === 'clear') clearInk('menu');
      else if (v === 'next') advance();
      else if (v === 'prev' && nextShown(showAt - 1, -1) >= 0) showSlide(nextShown(showAt - 1, -1), -1);
      else if (v === 'end') endShow();
      $('.pp-show').focus();
      return;
    }
    if (e.target.closest('.pp-shmenu')) return;
    if ($('.pp-show .pp-shmenu')) { closeMenu(); return; }
    if (tool) return;
    const a = e.target.closest('a[href]');
    if (a) { e.preventDefault(); follow(a.getAttribute('href'), 'text'); return; }
    const sp = e.target.closest('.pp-shp[data-link]');
    if (sp) { follow(sp.dataset.link, 'shape'); return; }
    const v = e.target.closest('.pp-video');
    if (v) {
      const on = v.classList.toggle('pp-vplaying');
      emit('ppt-video-play', { name: deck.slides[showAt]?.shapes?.[+v.dataset.si]?.name, playing: on, index: showAt });
      return;
    }
    // “Fare Tıklatıldığında” işaretsizse ve süre verilmişse tıklama slaydı ilerletmez (bekleyen tıklama animasyonu yoksa)
    const cs = deck.slides[showAt];
    if (cs && cs.click === false && cs.auto > 0 && !(seq && (seq.run || seq.next < seq.groups.length))) return;
    advance();
  }
  $('.pp-show').addEventListener('click', onShowClick);
  // Sağ tık: İşaretçi Seçenekleri menüsü
  $('.pp-show').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    closeMenu();
    if (showAt < 0 || showAt >= deck.slides.length) return;
    const sh = $('.pp-show'), r = sh.getBoundingClientRect();
    const m = document.createElement('div');
    m.className = 'pp-shmenu';
    m.innerHTML = `<button type="button" data-sm="next">Sonraki</button><button type="button" data-sm="prev">Önceki</button><b>İşaretçi Seçenekleri</b>
      <button type="button" data-sm="arrow"${!tool ? ' class="on"' : ''}>↖ Ok</button><button type="button" data-sm="pen"${tool === 'pen' ? ' class="on"' : ''}>🖊 Kalem</button><button type="button" data-sm="hl"${tool === 'hl' ? ' class="on"' : ''}>🖍 Vurgulayıcı</button><button type="button" data-sm="clear">🧽 Slayttaki Tüm Mürekkebi Sil</button>
      <hr><button type="button" data-sm="end">Gösteriyi Sonlandır</button>`;
    sh.append(m);
    m.style.left = Math.min(e.clientX - r.left, r.width - m.offsetWidth - 4) + 'px';
    m.style.top = Math.min(e.clientY - r.top, r.height - m.offsetHeight - 4) + 'px';
    emit('ppt-show-menu', { index: showAt });
  });
  // Kalem / vurgulayıcıyla çizim
  $('.pp-show').addEventListener('pointerdown', (e) => {
    if (!tool || e.button !== 0 || e.target.closest('.pp-shmenu')) return;
    const svg = $('.pp-show .pp-ink-live');
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const pt = (ev) => [Math.round(((ev.clientX - r.left) / r.width) * 1000), Math.round(((ev.clientY - r.top) / r.height) * 562)];
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    el.setAttribute('class', 'pp-ink-' + tool);
    svg.append(el);
    stroke = { t: tool, p: [pt(e)], pt, el };
    el.setAttribute('points', stroke.p.map((q) => q.join(',')).join(' '));
    $('.pp-show').setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  $('.pp-show').addEventListener('pointermove', (e) => {
    if (!stroke) return;
    stroke.p.push(stroke.pt(e));
    stroke.el.setAttribute('points', stroke.p.map((q) => q.join(',')).join(' '));
  });
  const endStroke = () => {
    if (!stroke) return;
    const st = stroke;
    stroke = null;
    if (showAt < 0 || showAt >= deck.slides.length) return;
    if (st.p.length === 1) st.p.push([st.p[0][0] + 1, st.p[0][1]]);
    ink[showAt].push({ t: st.t, p: st.p });
    inkDirty = true;
    const xs = st.p.map((q) => q[0]), ys = st.p.map((q) => q[1]);
    emit('ppt-ink', { tool: st.t, index: showAt, count: ink[showAt].length, w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) });
  };
  $('.pp-show').addEventListener('pointerup', endStroke);
  $('.pp-show').addEventListener('pointercancel', endStroke);
  $('.pp-show').addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') return endShow();
    // Ctrl + P: kalem, Ctrl + A: ok işaretçi, E: çizimleri sil
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyP') { closeMenu(); setTool('pen', 'key'); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') { closeMenu(); setTool(null, 'key'); return; }
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.code === 'KeyE') { clearInk('key'); return; }
    closeMenu();
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
    if (['ArrowLeft', 'ArrowUp', 'Backspace', 'PageUp'].includes(e.key) && nextShown(showAt - 1, -1) >= 0) showSlide(nextShown(showAt - 1, -1), -1);
  });

  // ---- Dosya ----
  const fsApi = desk.fs.dialogApi();
  async function save(asNew) {
    pull();
    if (desk.dialogs.busy) return false;
    // Farklı Kaydet'te Kayıt türü: sunu (.pptx), PowerPoint Gösterisi (.ppsx: açılınca doğrudan gösteri başlar) ya da PDF
    const r = fileName && !asNew ? { folder, name: fileName } : await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Sunu1.pptx', ext: '.pptx', types: SAVE_TYPES });
    if (!r) return false;
    if (/\.pdf$/i.test(r.name)) { writePdf(r, 'saveas'); return true; }
    const quick = !!fileName && !asNew;
    desk.fs.write(r.folder, r.name, structuredClone(deck));
    fileName = r.name; folder = r.folder; dirty = false;
    render();
    if (quick) desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
    else if (/\.ppsx$/i.test(r.name)) desk.toast('PowerPoint Gösterisi olarak kaydedildi', `${esc(r.name)}: çift tıklanınca doğrudan slayt gösterisi olarak açılır.`, '📙', 5000);
    emit('ppt-save', { name: r.name, folder: r.folder, quick, show: /\.ppsx$/i.test(r.name) });
    return true;
  }
  async function confirmDiscard() {
    pull();
    if (!dirty) return true;
    const a = await desk.dialogs.ask({ title: 'Sunu', icon: '❓', text: `<b>${esc(fileName || 'Sunu1')}</b> sunusundaki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['no', 'Kaydetme'], ['cancel', 'İptal']] });
    if (a === 'save') return save();
    return a === 'no';
  }
  // Yazdırma: önce düzen sorulur (gerçek PowerPoint'te Ayarlar'daki “Tam Sayfa Slaytlar” düğmesinin listesi:
  // Yazdırma Düzeni ve Dinleyici Notları), önizlemede kaç kâğıt çıkacağı görünür
  async function print() {
    pull();
    if (desk.dialogs.busy) return;
    const n = deck.slides.length;
    const lay = await desk.dialogs.ask({ title: 'Yazdırma Düzeni', icon: '🖨', text: `Sununuzda <b>${n} slayt</b> var. Kâğıda nasıl yazdırılsın?<br><small>Gerçek PowerPoint'te bu liste, Yazdır ekranında <b>Tam Sayfa Slaytlar</b> düğmesine basınca açılır. <b>Dinleyici Notları:</b> bir kâğıda birkaç slayt; 3 slaytlıkta yanında not alma çizgileri. <b>Not Sayfaları:</b> her slaydın altında sizin konuşmacı notunuz.</small>`, buttons: [['1', 'Tam Sayfa Slaytlar', true], ['notes', 'Not Sayfaları'], ['3', 'Dinleyici Notları: 3 Slayt'], ['4', 'Dinleyici Notları: 4 Slayt'], ['6', 'Dinleyici Notları: 6 Slayt'], ['cancel', 'İptal']] });
    if (!lay || lay === 'cancel') return;
    const kind = lay === 'notes' ? 'notes' : lay === '3' ? 'handout' : 'slides';
    const per = kind === 'notes' ? 1 : +lay, pages = Math.ceil(n / per);
    emit('ppt-print-layout', { perPage: per, pages, kind });
    const pvSl = (s) => `<div class="pp-pvsl" style="container-type:inline-size">${slideHtml(s, false)}</div>`;
    let grid, note;
    if (kind === 'handout') {
      grid = `<div class="pp-pvgrid pp-pv3">${deck.slides.slice(0, 3).map((s) => `<div class="pp-pvh">${pvSl(s)}<div class="pp-pvlines"><i></i><i></i><i></i><i></i></div></div>`).join('')}</div>`;
      note = `<div class="dlg-pvnote ok">✔ Dinleyici Notları: her kâğıtta 3 slayt ve yanında not alma çizgileri. ${n} slayt <b>${pages} kâğıda</b> çıkar.</div>`;
    } else if (kind === 'notes') {
      grid = `<div class="pp-pvgrid pp-pvn">${pvSl(deck.slides[0])}<div class="pp-pvnote">${esc(deck.slides[0].notes || '(Bu slaytta not yok)')}</div></div>`;
      note = `<div class="dlg-pvnote ok">ℹ Not Sayfaları: her slayt kendi konuşmacı notuyla ayrı kâğıda; ${n} slayt <b>${pages} kâğıt</b>. Bu çıktı sizin içindir.</div>`;
    } else {
      grid = `<div class="pp-pvgrid pp-pv${per}">${deck.slides.slice(0, per).map(pvSl).join('')}</div>`;
      note = `<div class="dlg-pvnote ${per > 1 ? 'ok' : 'bad'}">${per > 1 ? `✔ ${n} slayt <b>${pages} kâğıda</b> sığıyor.` : `⚠ ${n} slayt <b>${pages} ayrı kâğıda</b> çıkacak. Kâğıt tasarrufu için “Dinleyici Notları: 4 Slayt” seçilebilir.`}</div>`;
    }
    const pv = `<div class="dlg-pvbox big">${grid}</div>${note}`;
    const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Sunu1', pvHtml: pv });
    if (r) { desk.toast('Yazdırılıyor', `${n} slayt, ${pages} kâğıt → ${esc(r.printer)}`, '🖨'); emit('ppt-print', { ...r, perPage: per, pages, kind }); }
  }

  // ---- Şekil, WordArt, video, köprü, eylem düğmesi, üst bilgi ve alt bilgi ----
  function addShape(o) {
    pull();
    const s = deck.slides[cur];
    s.shapes = [...(s.shapes || []), o];
    selShape = s.shapes.length - 1;
    changed(); render();
    return selShape;
  }
  // Yeni şeklin yazısına imleci koyar (WordArt'ta örnek yazıyı seçer: yazınca yerine geçer)
  function focusShape(i) {
    setTimeout(() => {
      const el = $(`.pp-slide .pp-shtx[data-si="${i}"]`);
      if (!el) return;
      el.focus();
      const r = document.createRange(); r.selectNodeContents(el);
      if (!el.textContent) r.collapse(false);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }, 0);
  }
  // Ortak pencere iskeleti: [Promise, pencere]
  const dlg = (title, inner, kind) => { const p = desk.dialogs.shell('dlg-form pp-dlg', title, inner, kind); return [p, desk.dialogs._last]; };
  const slideOpts = () => deck.slides.map((s, i) => [`slayt:${i + 1}`, `${i + 1}. ${plain(s.title) || 'Slayt ' + (i + 1)}`]);
  // Eylem Ayarları: şekle tıklanınca nereye gidilsin
  async function actionDlg(i, isNew) {
    const o = deck.slides[cur].shapes[i];
    const opts = [...LINKS, ...slideOpts()];
    const [p, back] = dlg('Eylem Ayarları', `<div class="pp-ea-tabs"><b>Fare Tıklaması</b><span>Fare Üzerine Gelme</span></div>
      <div class="dlg-pr pp-ea"><b>Fare tıklandığında yapılacak eylem</b>
        <label><input type="radio" name="ea" value="none" ${o.link ? '' : 'checked'}> Yok</label>
        <label><input type="radio" name="ea" value="link" ${o.link ? 'checked' : ''}> Köprü:</label>
        <select class="pp-ea-sel">${opts.map(([k, n]) => `<option value="${k}" ${k === o.link ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">Tamam</button><button type="button" class="dlg-cancel">İptal</button></div>`, 'action');
    back.querySelector('.pp-ea-sel').addEventListener('change', () => { back.querySelector('[value="link"]').checked = true; });
    back.querySelector('.dlg-ok').onclick = () => back.close(back.querySelector('[value="link"]').checked ? back.querySelector('.pp-ea-sel').value : '');
    back.querySelector('.dlg-cancel').onclick = () => back.close(null);
    const v = await p;
    if (v === null) { if (isNew) emit('ppt-action', { kind: o.kind, link: o.link || null, index: cur, isNew, ok: false }); return; }
    o.link = v || null;
    changed(); render();
    emit('ppt-action', { kind: o.kind, link: o.link, index: cur, isNew, ok: true });
  }
  // Köprü Ekle (Ctrl + K): seçili yazıya ya da seçili şekle web adresi veya bu sunudaki bir slayt
  async function insertLink() {
    if (desk.dialogs.busy) return;
    const sel = getSelection();
    let range = null, box = null, text = '';
    if (sel.rangeCount && !sel.isCollapsed) {
      const r = sel.getRangeAt(0);
      const node = r.commonAncestorContainer;
      box = (node.nodeType === 1 ? node : node.parentElement)?.closest('.pp-slide .pp-box');
      // Üç kez tıklayınca seçim sonraki maddenin başına taşar: yalnızca ilk madde alınır
      const li = (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement)?.closest('li');
      if (box && li && box.contains(li) && r.toString().trim() === li.textContent.trim()) r.selectNodeContents(li);
      if (box) { range = r.cloneRange(); text = r.toString().trim(); }
    }
    pull();
    const shp = !range && deck.slides[cur].shapes?.[selShape];
    if (!range && (!shp || shp.kind === 'video')) {
      desk.toast('Bağlantı', 'Önce bağlantı verilecek yazıyı seçin (fareyle üzerinden geçin ya da üç kez tıklayın) veya bir şekle tıklayın.', '🔗', 6000);
      emit('ppt-link', { ok: false });
      return;
    }
    const looksUrl = /^[\w-]+(\.[\w-]+)+(\/\S*)?$|^https?:\/\//i.test(text);
    const [p, back] = dlg('Köprü Ekle', `<div class="pp-lk"><div class="pp-lk-side"><b>Bağlantı:</b><button type="button" data-lk="web" class="on">🌐 Var Olan Dosya veya Web Sayfası</button><button type="button" data-lk="doc">📑 Bu Belgeye Yerleştir</button></div>
      <div class="pp-lk-main"><label class="dlg-row"><span>Görüntülenecek metin:</span><input class="dlg-name" value="${esc(range ? text : '<<Belgedeki seçim>>')}" disabled></label>
        <label class="dlg-row pp-lk-web"><span>Adres:</span><input class="dlg-name pp-lk-url" value="${esc(looksUrl ? text : '')}" placeholder="ör. www.ornek.gov.tr" autocomplete="off" spellcheck="false" autofocus></label>
        <div class="pp-lk-doc" hidden><span>Bu belgede bir yer seçin:</span><div class="pp-lk-list">${[...LINKS, ...slideOpts()].map(([k, n]) => `<button type="button" data-to="${k}">${esc(n)}</button>`).join('')}</div></div></div></div>
      <div class="dlg-err"></div><div class="dlg-btns"><button type="button" class="dlg-ok">Tamam</button><button type="button" class="dlg-cancel">İptal</button></div>`, 'link');
    let mode = 'web', to = null;
    const q = (x) => back.querySelector(x);
    back.addEventListener('click', (e) => {
      const m = e.target.closest('[data-lk]');
      if (m) { mode = m.dataset.lk; back.querySelectorAll('[data-lk]').forEach((b) => b.classList.toggle('on', b === m)); q('.pp-lk-web').hidden = mode !== 'web'; q('.pp-lk-doc').hidden = mode !== 'doc'; q('.dlg-err').textContent = ''; return; }
      const d = e.target.closest('[data-to]');
      if (d) { to = d.dataset.to; back.querySelectorAll('[data-to]').forEach((b) => b.classList.toggle('on', b === d)); }
    });
    const ok = () => {
      if (mode === 'web') {
        const u = q('.pp-lk-url').value.trim();
        if (!/\S+\.\S+/.test(u) || /\s/.test(u)) { q('.dlg-err').textContent = 'Adres kutusuna bir web adresi yazın (ör. www.ornek.gov.tr).'; return; }
        back.close(/^https?:\/\//i.test(u) ? u : 'https://' + u);
      } else {
        if (!to) { q('.dlg-err').textContent = 'Listeden gidilecek slaydı seçin.'; return; }
        back.close(to);
      }
    };
    q('.dlg-ok').onclick = ok;
    q('.dlg-cancel').onclick = () => back.close(null);
    back.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('.pp-lk-url')) { e.preventDefault(); ok(); } });
    const href = await p;
    if (!href) { emit('ppt-link', { ok: false, cancel: true }); return; }
    const kind = /^https?:/.test(href) ? 'url' : 'slide';
    if (range) {
      const el = $(`.pp-slide [data-k="${box.dataset.k}"]`);
      el.focus();
      const s2 = getSelection(); s2.removeAllRanges(); s2.addRange(range);
      document.execCommand('createLink', false, href);
      s2.collapseToEnd();
      pull(); changed();
      emit('ppt-link', { ok: true, on: 'text', kind, href, text, index: cur });
    } else {
      shp.link = href;
      changed(); render();
      emit('ppt-link', { ok: true, on: 'shape', kind, href, shape: shp.kind, index: cur });
    }
  }
  // Üst Bilgi ve Alt Bilgi penceresi: tarih, slayt numarası, alt bilgi; Tümüne Uygula
  async function hfDialog() {
    if (desk.dialogs.busy) return;
    pull();
    const hf = deck.hf || {};
    const [p, back] = dlg('Üst Bilgi ve Alt Bilgi', `<div class="pp-ea-tabs"><b>Slayt</b><span>Notlar ve Dinleyici Notları</span></div>
      <div class="dlg-pr pp-hfd"><b>Slayta ekle</b>
        <label><input type="checkbox" class="hf-date" ${hf.date ? 'checked' : ''}> Tarih ve saat</label>
        <div class="pp-hf-sub"><label><input type="radio" name="hfd" value="auto" ${hf.fixed ? '' : 'checked'}> Otomatik olarak güncelleştir <small>(${bugun()})</small></label>
          <label><input type="radio" name="hfd" value="fixed" ${hf.fixed ? 'checked' : ''}> Sabit: <input class="dlg-name hf-fixed" value="${esc(hf.dateText || bugun())}" spellcheck="false"></label></div>
        <label><input type="checkbox" class="hf-num" ${deck.slideNum ? 'checked' : ''}> Slayt numarası</label>
        <label><input type="checkbox" class="hf-foot" ${hf.foot ? 'checked' : ''}> Alt bilgi</label>
        <div class="pp-hf-sub"><input class="dlg-name hf-ftext" value="${esc(deck.master.footer || '')}" placeholder="Her slaydın altına yazılacak yazı" spellcheck="false"></div>
        <label><input type="checkbox" class="hf-title" ${hf.hideTitle ? 'checked' : ''}> Başlık slaydında gösterme</label></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">Tümüne Uygula</button><button type="button" class="dlg-cancel">İptal</button></div>`, 'hf');
    const q = (x) => back.querySelector(x);
    q('.hf-ftext').addEventListener('input', () => { q('.hf-foot').checked = !!q('.hf-ftext').value.trim(); });
    q('.hf-fixed').addEventListener('input', () => { q('[value="fixed"]').checked = true; });
    q('.dlg-ok').onclick = () => back.close({ date: q('.hf-date').checked, fixed: q('[value="fixed"]').checked, dateText: q('.hf-fixed').value.trim(), num: q('.hf-num').checked, foot: q('.hf-foot').checked, text: q('.hf-ftext').value.trim(), hideTitle: q('.hf-title').checked });
    q('.dlg-cancel').onclick = () => back.close(null);
    const v = await p;
    if (!v) return;
    // Alt bilgi yazısı Asıl Slayt'taki kutuyla aynıdır; işaret kaldırılınca yazı silinmez, yalnızca gizlenir
    deck.hf = { date: v.date, fixed: v.fixed, dateText: v.dateText, hideTitle: v.hideTitle, foot: v.foot && !!v.text };
    deck.slideNum = v.num;
    deck.master.footer = v.text;
    changed(); render();
    emit('ppt-hf', { date: v.date, fixed: v.fixed, dateText: v.dateText, num: v.num, hideTitle: v.hideTitle, foot: deck.hf.foot, footer: deck.hf.foot ? v.text : '', index: cur });
  }

  // ---- Okuma Görünümü: sunu pencerenin içinde, gösteri gibi ----
  let readAt = 0;
  function readShow(i, dir = 1) {
    const n = deck.slides.length;
    readAt = Math.max(0, Math.min(n, i));
    const st = $('.pp-rd-st');
    if (readAt >= n) st.innerHTML = '<div class="pp-end">Sununun sonu. Çıkmak için tıklayın ya da Esc.</div>';
    else { const s = deck.slides[readAt]; st.innerHTML = `<div class="pp-sh-in pp-tr-${dir > 0 ? s.trans : 'none'}">${slideHtml(s, false)}</div>`; }
    $('.pp-rd-no').textContent = readAt < n ? `Slayt ${readAt + 1} / ${n}` : `Son · ${n} slayt`;
    emit('ppt-read', { index: readAt, total: n, last: readAt === n - 1, end: readAt >= n });
  }
  function readExit() {
    if (view !== 'reading') return;
    view = 'normal';
    cur = Math.min(readAt, deck.slides.length - 1);
    render();
    $('.pp-thumbs').focus();
    emit('ppt-view', { view: 'normal', from: 'reading' });
  }
  const readNext = () => (readAt >= deck.slides.length ? readExit() : readShow(readAt + 1));
  $('.pp-read').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b?.classList.contains('pp-rd-prev')) { if (readAt > 0) readShow(readAt - 1, -1); }
    else if (b?.classList.contains('pp-rd-next')) readNext();
    else if (b?.classList.contains('pp-rd-normal')) readExit();
    else if (e.target.closest('.pp-rd-st')) { const a = e.target.closest('a[href]'); if (a) e.preventDefault(); readNext(); }
    if (view === 'reading') $('.pp-read').focus();
  });
  $('.pp-read').addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); readExit(); return; }
    if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) { e.preventDefault(); readNext(); return; }
    if (['ArrowLeft', 'ArrowUp', 'Backspace', 'PageUp'].includes(e.key)) { e.preventDefault(); if (readAt > 0) readShow(readAt - 1, -1); }
  });
  // Dosya → Dışarı Aktar → PDF/XPS Belgesi Oluştur (ya da Farklı Kaydet → Kayıt türü: PDF)
  async function exportPdf() {
    pull();
    const base = (fileName || 'Sunu1').replace(/\.pps?x$/i, '');
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.pdf', ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
    if (r) writePdf(r, 'export');
  }
  function writePdf(r, via) {
    const html = deck.slides.map((s) => `<div class="pdf-slide" style="container-type:inline-size;aspect-ratio:16/9;margin:0 0 .8em;box-shadow:0 1px 5px #0003">${slideHtml(s, false)}</div>`).join('');
    desk.fs.write(r.folder, r.name, { html, slides: deck.slides.length });
    desk.toast('PDF olarak kaydedildi', `${esc(r.name)}: bilgisayarı olmayanlar da açabilir.`, '📕');
    emit('ppt-pdf', { name: r.name, folder: r.folder, slides: deck.slides.length, via });
  }
  // Dosya → Dışarı Aktar → Video Oluştur
  async function exportVideo() {
    pull();
    const base = (fileName || 'Sunu1').replace(/\.pps?x$/i, '');
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.mp4', ext: '.mp4', typeLabel: 'MPEG-4 Video (*.mp4)' });
    if (!r) return;
    const timed = deck.slides.every((s) => s.auto > 0);
    const secs = deck.slides.reduce((n, s) => n + (s.auto || 5), 0);
    desk.toast('Video hazırlanıyor…', `${deck.slides.length} slayt, yaklaşık ${secs} saniye.`, '🎬', 2500);
    await wait(2200);
    const [, , bg] = theme();
    desk.fs.write(r.folder, r.name, { emoji: '🎬', bg: ['#263238', '#546e7a'], video: true, slides: deck.slides.length, secs });
    if (!timed) desk.toast('Süreler verilmemiş', 'Slaytlara süre vermediğiniz için her slayt 5 saniye gösterilecek. Geçişler sekmesinde “Sonra:” kutusuna süre verip Tümüne Uygula\'ya basabilirsiniz.', 'ℹ', 6000);
    else desk.toast('Video kaydedildi', esc(r.name), '🎬');
    emit('ppt-video', { name: r.name, folder: r.folder, slides: deck.slides.length, secs, timed });
  }

  // ---- Olaylar ----
  body.addEventListener('mousedown', (e) => {
    if (e.target.closest('.pp-rib button, .pp-tabs button, .pp-rhbar button, .pp-apane button, .pp-ap-row')) e.preventDefault();
    if (!e.target.closest('.pp-menu, .pp-file')) $('.pp-menu').hidden = true;
    if (!e.target.closest('.pp-newwrap')) body.querySelectorAll('.pp-lay').forEach((x) => { x.hidden = true; });
    if (!e.target.closest('.pp-thmenu')) closeThMenu();
  });
  body.addEventListener('click', async (e) => {
    // Slayttaki köprüler düzenlerken ve küçük resimlerde sayfayı değiştirmesin
    if (e.target.closest('a[href]') && !e.target.closest('.pp-show, .pp-read')) e.preventDefault();
    // Küçük resimlerin sağ tık menüsü
    const tm = e.target.closest('.pp-thmenu [data-thm]');
    if (tm) { const v = tm.dataset.thm; closeThMenu(); thCommand(v); return; }
    const th = e.target.closest('.pp-th');
    if (th) { if (thDragged) { thDragged = false; return; } go(+th.dataset.i); $('.pp-thumbs').focus(); return; }
    // Animasyon Bölmesi'nde bir satır: o animasyon ve nesnesi seçilir
    const ar = e.target.closest('.pp-ap-row');
    if (ar) { const a = deck.slides[cur].anims[+ar.dataset.ai]; pickObj(a.t, +ar.dataset.ai); emit('ppt-anim-pick', { t: a.t, at: +ar.dataset.ai, index: cur }); return; }
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) { showTab(t.dataset.tab); emit('ppt-tab', { tab: t.dataset.tab }); return; }
    if (t.classList.contains('pp-file')) { $('.pp-menu').hidden = !$('.pp-menu').hidden; return; }
    if (t.dataset.file === 'export') { $('.pp-expl').hidden = !$('.pp-expl').hidden; t.classList.toggle('on', !$('.pp-expl').hidden); emit('ppt-file', { item: 'export' }); return; }
    if (t.dataset.file) { $('.pp-menu').hidden = true; $('.pp-expl').hidden = true; body.querySelector('[data-file="export"]').classList.remove('on'); if (t.dataset.file === 'print') return print(); if (t.dataset.file === 'pdf') return exportPdf(); if (t.dataset.file === 'video') return exportVideo(); return save(t.dataset.file === 'saveas'); }
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
    if ('dupsel' in t.dataset) { $('.pp-lay').hidden = true; return dupSlide('newslide'); }
    // Giriş → Yazı Tipi Rengi ve hizalama: en son tıklanan yazı kutusuna (Asıl Slayt'ta seçili asıl başlığa) uygulanır
    if (t.classList.contains('pp-fcbtn')) { $('.pp-fclist').hidden = !$('.pp-fclist').hidden; return; }
    if (t.dataset.fcolor !== undefined) { $('.pp-fclist').hidden = true; return setBoxStyle('fc', t.dataset.fcolor); }
    if (t.dataset.align) return setBoxStyle('al', t.dataset.align);
    // Ekle → Slayt Numarası: gerçek PowerPoint'teki gibi Üst Bilgi ve Alt Bilgi penceresini açar
    if (t.classList.contains('pp-num')) { emit('ppt-slidenum-open', { index: cur }); return hfDialog(); }
    if (t.classList.contains('pp-sa')) { $('.pp-salist').hidden = !$('.pp-salist').hidden; return; }
    if (t.classList.contains('pp-sains')) { $('.pp-sailist').hidden = !$('.pp-sailist').hidden; return; }
    // Ekle → SmartArt: boş “Başlık ve içerik” slaydına [Metin] kutulu boş bir şema koyar; madde varsa Giriş'teki yolu söyler
    if (t.dataset.artins) {
      $('.pp-sailist').hidden = true;
      pull();
      const sl = deck.slides[cur];
      if (sl.layout === 'content' && plain(sl.body)) { desk.toast('SmartArt', 'Bu slaytta maddeler var. Var olan maddeleri şemaya çevirmek için: <b>Giriş → SmartArt\'a Dönüştür</b>.', '🔷', 6000); emit('ppt-smartart', { kind: t.dataset.artins, ok: false, insert: true }); return; }
      if (sl.layout !== 'content') { desk.toast('SmartArt', 'Şemayı “Başlık ve içerik” düzenindeki bir slayda ekleyin.', '🔷', 6000); emit('ppt-smartart', { kind: t.dataset.artins, ok: false, insert: true }); return; }
      sl.body = '<li>[Metin]</li><li>[Metin]</li><li>[Metin]</li>';
      sl.art = t.dataset.artins;
      changed(); render();
      emit('ppt-smartart', { kind: sl.art, ok: true, count: 3, insert: true });
      return;
    }
    if (t.dataset.art) {
      $('.pp-salist').hidden = true;
      pull();
      const sl = deck.slides[cur];
      if (t.dataset.art === 'none') { sl.art = null; changed(); render(); emit('ppt-smartart', { kind: null, ok: true }); return; }
      const n = [...new DOMParser().parseFromString(`<ul>${sl.body}</ul>`, 'text/html').querySelectorAll('li')].filter((li) => li.textContent.trim()).length;
      if (sl.layout !== 'content' || n < 2) { desk.toast('SmartArt', 'Önce “Başlık ve içerik” düzenindeki bir slayda en az iki madde yazın; SmartArt\'a Dönüştür o maddeleri şemaya çevirir.', '🔷', 6000); emit('ppt-smartart', { kind: t.dataset.art, ok: false }); return; }
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
      // Ses seçili slayda eklenir; Kayıttan Yürütme sekmesi açılır (Arka Planda Yürüt seçilmezse yalnızca bu slaytta çalar)
      deck.music = r.name; deck.musicAt = cur; deck.musicBg = false;
      changed(); render(); showTab('audio');
      emit('ppt-music', { name: r.name, index: cur });
      return;
    }
    if (t.dataset.view) {
      pull(); view = t.dataset.view; render();
      if (view === 'master') showTab('master');
      if (view === 'reading') { readShow(cur); $('.pp-read').focus(); }
      if (view === 'notes') $('.pp-npt').focus();
      if (view === 'sorter') $('.pp-sorter').focus(); // Ctrl + P gibi kısayollar sıralayıcıda da çalışsın
      emit('ppt-view', { view });
      return;
    }
    if (t.classList.contains('pp-np-prev') || t.classList.contains('pp-np-next')) { go(cur + (t.classList.contains('pp-np-prev') ? -1 : 1)); $('.pp-npt').focus(); return; }
    if (t.classList.contains('pp-rh-next')) { advance(); $('.pp-show').focus(); return; }
    if (t.classList.contains('pp-rehearse')) return startShow(0, { rehearse: true });
    if (t.classList.contains('pp-shbtn')) { $('.pp-shlist').hidden = !$('.pp-shlist').hidden; return; }
    if (t.classList.contains('pp-wa')) { $('.pp-walist').hidden = !$('.pp-walist').hidden; return; }
    if (t.dataset.shape) {
      $('.pp-shlist').hidden = true;
      const kind = t.dataset.shape, act = ACTS.find((a) => a[0] === kind);
      const k = (deck.slides[cur].shapes || []).filter((o) => (o.kind.startsWith('act') === !!act)).length % 4;
      const i = act ? addShape({ kind, link: act[3], x: 4 + k * 10, y: 76, w: 8, h: 14.2 }) : addShape({ kind, text: '', fill: FILLS[0][0], x: 62 - k * 4, y: 30 + k * 6, w: 28, h: kind === 'arrow' ? 18 : 28 });
      emit('ppt-shape', { kind, index: cur, count: deck.slides[cur].shapes.length });
      if (act) actionDlg(i, true); else focusShape(i);
      return;
    }
    if (t.dataset.wa) {
      $('.pp-walist').hidden = true;
      const i = addShape({ kind: 'wordart', style: t.dataset.wa, text: WA_PH, x: 8, y: 70, w: 84, h: 22 });
      emit('ppt-shape', { kind: 'wordart', style: t.dataset.wa, index: cur, count: deck.slides[cur].shapes.length });
      focusShape(i);
      return;
    }
    if (t.dataset.fill) {
      const o = deck.slides[cur].shapes?.[selShape];
      if (!o) return;
      pull(); o.fill = t.dataset.fill; changed(); render();
      emit('ppt-shape-fill', { fill: o.fill, kind: o.kind, index: cur });
      return;
    }
    if (t.classList.contains('pp-shdel')) {
      const s = deck.slides[cur];
      if (!s.shapes?.[selShape]) return;
      pull(); const [o] = s.shapes.splice(selShape, 1);
      // Silinen şeklin animasyonları da gider; sonraki şekillerin sıra numarası bir azalır
      s.anims = (s.anims || []).filter((a) => a.t !== 'shp:' + selShape).map((a) => (a.t.startsWith('shp:') && +a.t.slice(4) > selShape ? { ...a, t: 'shp:' + (+a.t.slice(4) - 1) } : a));
      selShape = -1; selObj = null; selAnim = -1; changed(); render();
      emit('ppt-shape-delete', { kind: o.kind, index: cur });
      return;
    }
    if (t.classList.contains('pp-link')) return insertLink();
    if (t.classList.contains('pp-act')) {
      const o = deck.slides[cur].shapes?.[selShape];
      if (!o || o.kind === 'video') { desk.toast('Eylem', 'Önce slayttaki bir şekle ya da eylem düğmesine tıklayın.', '⚡'); return; }
      return actionDlg(selShape, false);
    }
    if (t.classList.contains('pp-hf')) return hfDialog();
    if (t.classList.contains('pp-vid')) {
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.mp4', typeLabel: 'Video dosyaları (*.mp4)', accept: /\.(mp4|avi|mov|wmv)$/i });
      if (!r) return;
      const pic = desk.fs.find(r.folder, r.name)?.content || { emoji: '🎬', bg: ['#455a64', '#263238'] };
      addShape({ kind: 'video', name: r.name, pic, x: 25, y: 28, w: 50, h: 50 });
      emit('ppt-video-insert', { name: r.name, index: cur });
      return;
    }
    if (t.classList.contains('pp-mclose')) { view = 'normal'; render(); showTab('home'); emit('ppt-view', { view, from: 'master' }); return; }
    if (t.dataset.mfont) { $('.pp-mfontlist').hidden = true; deck.master.font = t.dataset.mfont; changed(); render(); emit('ppt-master', { what: 'font', value: t.dataset.mfont }); return; }
    if (t.classList.contains('pp-mfonts')) { $('.pp-mfontlist').hidden = !$('.pp-mfontlist').hidden; return; }
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
    // Efekt yalnızca seçili nesneye verilir (nesne seçili değilken galeri düğmeleri kullanılamaz)
    if (t.dataset.anim) return setFx(t.dataset.anim, false);
    if (t.dataset.fx) return setFx(t.dataset.fx, false);
    if (t.classList.contains('pp-aadd')) { $('.pp-aaddlist').hidden = !$('.pp-aaddlist').hidden; return; }
    if (t.dataset.addfx) { $('.pp-aaddlist').hidden = true; return setFx(t.dataset.addfx, true); }
    if (t.classList.contains('pp-apbtn') || t.classList.contains('pp-ap-x')) {
      paneOpen = t.classList.contains('pp-apbtn') ? !paneOpen : false;
      if (paneOpen) { chartOpen = false; bgOpen = false; render(); }
      renderChartData(); animUi();
      emit('ppt-anim-pane', { open: paneOpen });
      return;
    }
    if (t.dataset.ast) return setTiming('start', t.dataset.ast);
    if (t.dataset.adur) return setTiming('dur', +t.dataset.adur);
    if (t.dataset.adel) return setTiming('delay', +t.dataset.adel);
    if (t.dataset.amove) return moveAnim(+t.dataset.amove);
    if (t.classList.contains('pp-ap-del')) return removeAnim();
    if (t.classList.contains('pp-ap-play')) {
      if (!deck.slides[cur].anims?.length) { desk.toast('Animasyon yok', 'Bu slaytta oynatılacak nesne animasyonu yok.', '✦'); return; }
      pull(); previewAnims();
      emit('ppt-anim-preview', { effect: 'nesne', pane: true, count: deck.slides[cur].anims.length });
      return;
    }
    // Geçişler → Sonra: kutusu (+ / − bir saniye; süre verilince kutu kendiliğinden işaretlenir) ve Tümüne Uygula
    if (t.dataset.tafter) { pull(); const s = deck.slides[cur]; s.auto = Math.max(0, Math.min(600, (s.auto || 0) + +t.dataset.tafter)); changed(); render(); emit('ppt-autotime', { secs: s.auto, index: cur }); return; }
    if (t.classList.contains('pp-tall')) {
      pull();
      const s = deck.slides[cur];
      deck.slides.forEach((x) => { x.trans = s.trans; x.auto = s.auto || 0; x.click = s.click !== false; });
      changed(); render();
      emit('ppt-trans', { index: cur, trans: s.trans, all: true });
      emit('ppt-autotime', { secs: s.auto || 0, index: cur, all: true, trans: s.trans });
      return;
    }
    // Tasarım → Arka Planı Biçimlendir bölmesi
    if (t.classList.contains('pp-bgbtn') || t.classList.contains('pp-bg-x')) { bgOpen = t.classList.contains('pp-bgbtn') ? !bgOpen : false; if (bgOpen) { paneOpen = false; chartOpen = false; } render(); emit('ppt-bg-pane', { open: bgOpen }); return; }
    if (t.dataset.bgcol) { pull(); deck.slides[cur].bg = { color: t.dataset.bgcol }; changed(); render(); emit('ppt-bg', { kind: 'solid', color: t.dataset.bgcol, index: cur }); return; }
    if (t.classList.contains('pp-bg-ins')) {
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.jpg', typeLabel: 'Resimler (*.jpg; *.png)', accept: /\.(png|jpe?g|bmp)$/i });
      if (!r) return;
      pull(); deck.slides[cur].bg = { pic: desk.fs.find(r.folder, r.name)?.content || { emoji: '🖼', bg: ['#ccc', '#999'] } };
      changed(); render();
      emit('ppt-bg', { kind: 'pic', name: r.name, index: cur });
      return;
    }
    if (t.classList.contains('pp-bg-all')) { pull(); const b = deck.slides[cur].bg; deck.slides.forEach((x) => { x.bg = b ? structuredClone(b) : null; }); changed(); render(); emit('ppt-bg', { kind: b?.pic ? 'pic' : b ? 'solid' : null, color: b?.color, index: cur, all: true }); return; }
    if (t.classList.contains('pp-bg-reset')) { pull(); deck.slides[cur].bg = null; changed(); render(); emit('ppt-bg', { kind: null, index: cur }); return; }
    // Resim Biçimi: Kırp, Genişlik
    if (t.classList.contains('pp-crop')) { cropOn = !cropOn; render(); emit('ppt-crop-mode', { on: cropOn, index: cur }); return; }
    if (t.dataset.imgw) { pull(); return setImgW(curImgW() + +t.dataset.imgw * 5, 'spin'); }
    // Kayıttan Yürütme → Ses Stilleri
    if (t.classList.contains('pp-musbg') || t.classList.contains('pp-musnostyle')) { deck.musicBg = t.classList.contains('pp-musbg'); changed(); render(); emit('ppt-music-bg', { bg: deck.musicBg }); return; }
    if (t.classList.contains('pp-aprev')) {
      const el = $('.pp-slide');
      if (deck.slides[cur].anims?.length) { pull(); previewAnims(); emit('ppt-anim-preview', { effect: 'nesne', count: deck.slides[cur].anims.length }); return; }
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
      // Asıl Slayt görünümünde eklenen resim, bütün slaytlarda görünen logodur
      if (view === 'master') { deck.master.logo = desk.fs.find(r.folder, r.name)?.content || { emoji: '🖼', bg: ['#ccc', '#999'] }; changed(); render(); emit('ppt-master', { what: 'logo', value: r.name }); return; }
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
  $('.pp-sorter').addEventListener('click', (e) => { const x = e.target.closest('.pp-sth'); if (x) { pull(); cur = +x.dataset.i; render(); } $('.pp-sorter').focus(); });
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
  // Asıl Slayt: asıl başlığa tıklanınca seçilir; Alt Bilgi kutusuna yazılan yazı bütün slaytların alt bilgisidir
  $('.pp-mbig').addEventListener('click', (e) => {
    const tb = e.target.closest('[data-k="title"]');
    if (e.target.closest('.pp-mfootph')) return;
    masterSel = tb ? 'title' : null;
    $('.pp-mbig [data-k="title"]')?.classList.toggle('pp-osel', !!tb);
    emit('ppt-master-pick', { what: masterSel });
  });
  $('.pp-mbig').addEventListener('input', (e) => {
    const ph = e.target.closest('.pp-mfootph');
    if (!ph) return;
    deck.master.footer = ph.textContent.trim();
    ph.classList.toggle('empty', !deck.master.footer);
    changed();
    $('.pp-mall').innerHTML = deck.slides.map((s, i) => `<div class="pp-sth"><span>${i + 1}</span><div class="pp-mini">${slideHtml(s, false)}</div></div>`).join('');
    emit('ppt-master', { what: 'footer', value: deck.master.footer, shown: !!deck.hf?.foot });
  });
  // Yazı Tipi Rengi (fc) ve hizalama (al): en son tıklanan yazı kutusunun bütününe uygulanır
  function setBoxStyle(what, v) {
    if (view === 'master') {
      if (what !== 'fc' || masterSel !== 'title') { desk.toast('Asıl Slayt', 'Önce soldaki büyük asıl slaytta başlığa (“Asıl başlık stili”) tıklayın.', 'ℹ', 5000); return; }
      deck.master.color = v; changed(); render();
      emit('ppt-master', { what: 'color', value: v });
      return;
    }
    if (!lastK) { desk.toast(what === 'fc' ? 'Yazı Tipi Rengi' : 'Hizalama', 'Önce değiştireceğiniz yazı kutusuna tıklayın.', 'ℹ'); return; }
    pull();
    const s = deck.slides[cur];
    s[what] = { ...(s[what] || {}), [lastK]: v };
    if (!v) delete s[what][lastK];
    changed(); render();
    emit(what === 'fc' ? 'ppt-fcolor' : 'ppt-align', { index: cur, box: lastK, value: v });
  }
  // Slaytı Çoğalt: seçili slaydın kopyası hemen altına gelir
  function dupSlide(how) {
    pull();
    deck.slides.splice(cur + 1, 0, structuredClone(deck.slides[cur]));
    cur++;
    changed(); render();
    emit('ppt-dup', { index: cur, count: deck.slides.length, how });
  }
  // Küçük resimlerde sağ tık menüsü: Yeni Slayt, Slaytı Çoğalt, Slaytı Sil, Slaytı Gizle
  function closeThMenu() { body.querySelector('.pp-thmenu')?.remove(); }
  function thCommand(v) {
    if (v === 'new') { pull(); deck.slides.splice(cur + 1, 0, blank('content')); cur++; changed(); render(); emit('ppt-new-slide', { layout: 'content', index: cur, how: 'menu' }); return; }
    if (v === 'dup') return dupSlide('menu');
    if (v === 'del') return deleteSlide('menu');
    if (v === 'hide') { pull(); const s = deck.slides[cur]; s.hidden = !s.hidden; changed(); render(); emit('ppt-hide', { index: cur, hidden: s.hidden }); }
  }
  $('.pp-thumbs').addEventListener('contextmenu', (e) => {
    const th = e.target.closest('.pp-th');
    if (!th) return;
    e.preventDefault();
    closeThMenu();
    if (+th.dataset.i !== cur) go(+th.dataset.i);
    const r = body.getBoundingClientRect();
    const m = document.createElement('div');
    m.className = 'pp-thmenu';
    m.innerHTML = `<button type="button" data-thm="new">➕ Yeni Slayt</button><button type="button" data-thm="dup">⧉ Slaytı Çoğalt <small>Ctrl + D</small></button><button type="button" data-thm="del">🗑 Slaytı Sil</button><hr><button type="button" data-thm="hide"${deck.slides[cur].hidden ? ' class="on"' : ''}>🚫 Slaytı Gizle</button>`;
    body.append(m);
    m.style.left = Math.min(e.clientX - r.left, r.width - m.offsetWidth - 4) + 'px';
    m.style.top = Math.min(e.clientY - r.top, r.height - m.offsetHeight - 4) + 'px';
    emit('ppt-thmenu', { index: cur });
  });
  // Soldaki küçük resimler sürüklenerek yer değiştirir (bırakılan yerdeki slaydın yerine geçer)
  let thDrag = null, thDragged = false;
  $('.pp-thumbs').addEventListener('pointerdown', (e) => {
    const th = e.target.closest('.pp-th');
    if (!th || e.button !== 0) return;
    thDrag = { from: +th.dataset.i, x: e.clientX, y: e.clientY, moved: false };
  });
  $('.pp-thumbs').addEventListener('pointermove', (e) => {
    if (!thDrag) return;
    if (!thDrag.moved && Math.hypot(e.clientX - thDrag.x, e.clientY - thDrag.y) < 8) return;
    if (!thDrag.moved) { thDrag.moved = true; $('.pp-thumbs').setPointerCapture?.(e.pointerId); $(`.pp-th[data-i="${thDrag.from}"]`)?.classList.add('pp-thdrag'); }
    const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.pp-th');
    body.querySelectorAll('.pp-th.pp-drop').forEach((x) => x.classList.toggle('pp-drop', x === over));
    if (over && !over.classList.contains('pp-thdrag')) over.classList.add('pp-drop');
    e.preventDefault();
  });
  const thDrop = (e) => {
    const d = thDrag;
    thDrag = null;
    if (!d?.moved) return;
    thDragged = true;
    setTimeout(() => { thDragged = false; }, 300);
    const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.pp-th');
    body.querySelectorAll('.pp-th').forEach((x) => x.classList.remove('pp-drop', 'pp-thdrag'));
    if (!over || +over.dataset.i === d.from) return;
    pull();
    const to = +over.dataset.i;
    const [m] = deck.slides.splice(d.from, 1);
    deck.slides.splice(to, 0, m);
    if (deck.musicAt === d.from) deck.musicAt = to;
    cur = to;
    changed(); render();
    emit('ppt-move', { index: cur, from: d.from, thumbs: true });
  };
  $('.pp-thumbs').addEventListener('pointerup', thDrop);
  $('.pp-thumbs').addEventListener('pointercancel', () => { thDrag = null; body.querySelectorAll('.pp-th').forEach((x) => x.classList.remove('pp-drop', 'pp-thdrag')); });
  // Geçişler → Fare Tıklatıldığında / Sonra: onay kutuları
  body.addEventListener('change', (e) => {
    const c = e.target;
    if (c.classList.contains('pp-tclick')) { pull(); deck.slides[cur].click = c.checked; changed(); render(); emit('ppt-click-adv', { on: c.checked, index: cur }); }
    if (c.classList.contains('pp-tafter')) { pull(); const s = deck.slides[cur]; s.auto = c.checked ? Math.max(1, s.auto || 0) : 0; changed(); render(); emit('ppt-autotime', { secs: s.auto, index: cur }); }
  });
  // Resim Biçimi: köşe tutamacıyla boyut, Kırp açıkken kenar çizgileriyle kırpma
  let imgDrag = null;
  function imgHandleDown(e) {
    const h = e.target.closest('.pp-imgh, .pp-croph');
    const el = imgEl();
    if (!h || !el) return false;
    const r = el.getBoundingClientRect();
    imgDrag = { h: h.dataset.h, c: h.dataset.c, x: e.clientX, y: e.clientY, r, w0: curImgW(), crop: { l: 0, t: 0, r: 0, b: 0, ...deck.slides[cur].crop } };
    $('.pp-slide').setPointerCapture?.(e.pointerId);
    e.preventDefault();
    return true;
  }
  function imgHandleMove(e) {
    if (!imgDrag) return false;
    const d = imgDrag, el = imgEl(), box = $('.pp-slide .pp-imgsel');
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (d.h) {
      // Sağdaki köşeler sağa, soldakiler sola çekilince büyür
      const sign = d.h.endsWith('e') ? 1 : -1;
      d.w = Math.max(10, Math.min(100, d.w0 * (1 + (sign * dx) / d.r.width)));
      el.style.width = d.w + '%'; el.style.maxWidth = 'none'; el.style.maxHeight = 'none';
    } else {
      const c = { ...d.crop };
      const px = (v, size) => (v / size) * 100;
      if (d.c === 'l') c.l = Math.max(0, Math.min(90 - c.r, d.crop.l + px(dx, d.r.width)));
      if (d.c === 'r') c.r = Math.max(0, Math.min(90 - c.l, d.crop.r - px(dx, d.r.width)));
      if (d.c === 't') c.t = Math.max(0, Math.min(90 - c.b, d.crop.t + px(dy, d.r.height)));
      if (d.c === 'b') c.b = Math.max(0, Math.min(90 - c.t, d.crop.b - px(dy, d.r.height)));
      d.now = c;
      el.style.clipPath = `inset(${c.t}% ${c.r}% ${c.b}% ${c.l}%)`;
      const bar = box?.querySelector(`[data-c="${d.c}"]`);
      if (bar) bar.style[{ l: 'left', r: 'right', t: 'top', b: 'bottom' }[d.c]] = c[d.c] + '%';
    }
    e.preventDefault();
    return true;
  }
  function imgHandleUp() {
    const d = imgDrag;
    imgDrag = null;
    if (!d) return false;
    if (d.h && d.w) setImgW(d.w, 'drag');
    else if (d.now) {
      const c = Object.fromEntries(Object.entries(d.now).map(([k, v]) => [k, Math.round(v)]));
      deck.slides[cur].crop = c.l || c.t || c.r || c.b ? c : null;
      changed(); render();
      emit('ppt-crop', { ...c, index: cur });
    }
    return true;
  }
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
  async function deleteSlide(how) {
    if (deck.slides.length === 1) { desk.toast('Sunu', 'Sunuda en az bir slayt olmalı.', 'ℹ'); return; }
    pull();
    deck.slides.splice(cur, 1);
    if (deck.music && (deck.musicAt || 0) === cur) deck.music = null;
    else if ((deck.musicAt || 0) > cur) deck.musicAt--;
    cur = Math.min(cur, deck.slides.length - 1);
    changed(); render();
    emit('ppt-delete', { index: cur, how: how || 'key' });
  }
  $('.pp-fs').addEventListener('change', (e) => {
    if (!lastK) { desk.toast('Yazı Tipi Boyutu', 'Önce boyutunu değiştireceğiniz yazı kutusuna tıklayın.', 'ℹ'); return; }
    pull();
    const s = deck.slides[cur], n = +e.target.value;
    s.fs = { ...(s.fs || {}), [lastK]: n };
    changed(); render();
    emit('ppt-fontsize', { index: cur, box: lastK, size: n });
  });
  $('.pp-slide').addEventListener('input', (e) => { pull(); changed(); if (e.target.closest('.pp-artpane')) refreshArt(); emit('ppt-input', { index: cur }); });
  $('.pp-nt').addEventListener('input', (e) => { deck.slides[cur].notes = e.target.value; changed(); emit('ppt-notes', { index: cur, text: e.target.value, length: e.target.value.trim().length }); });
  $('.pp-slide').addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || ''); });
  // Boş kutudaki yer tutucu yazıya tıklanınca Chrome imleci önceki kutuda bırakabilir: imleç kutunun içine konur
  $('.pp-slide').addEventListener('focusin', (e) => {
    const b = e.target.closest('.pp-box');
    if (!b) return;
    lastK = b.dataset.k;
    $('.pp-fs').value = String(deck.slides[cur].fs?.[lastK] || fsDef(deck.slides[cur], lastK));
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
    if (e.key === 'Delete') { e.preventDefault(); deleteSlide('key'); }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') { e.preventDefault(); dupSlide('key'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
  });
  body.addEventListener('keydown', (e) => {
    if (!$('.pp-show').hidden) return;
    if (e.key === 'F5') { e.preventDefault(); startShow(e.shiftKey ? cur : 0); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.code === 'KeyS') { e.preventDefault(); save(e.shiftKey); }
    if (e.code === 'KeyP') { e.preventDefault(); print(); }
    if (e.code === 'KeyK') { e.preventDefault(); insertLink(); }
    if (e.code === 'KeyB' || e.code === 'KeyI') { setTimeout(() => { pull(); changed(); }, 0); }
  });
  // Not Sayfası: alttaki kutuya yazılan, slaydın konuşmacı notudur
  $('.pp-npt').addEventListener('input', (e) => {
    deck.slides[cur].notes = e.target.value;
    $('.pp-nt').value = e.target.value;
    changed();
    emit('ppt-notes', { index: cur, text: e.target.value, length: e.target.value.trim().length, view: 'notes' });
  });
  // Şekle tıklayınca seçilir; basılı tutup sürükleyince yeri değişir
  let drag = null;
  $('.pp-slide').addEventListener('pointerdown', (e) => {
    if (imgHandleDown(e)) return;
    // Resme tıklanınca Resim Biçimi sekmesi çıkar; başka yere tıklanınca resim seçimi ve Kırp kapanır
    const onImg = !!e.target.closest('.pp-img');
    if (onImg !== selImg) { selImg = onImg; if (!onImg) cropOn = false; $('.pp-ptab').hidden = !selImg; if (!selImg && $('.pp-ptab').classList.contains('on')) showTab('home'); drawImgSel(); if (onImg) emit('ppt-pic-pick', { index: cur }); }
    const sp = e.target.closest('.pp-shp');
    const i = sp ? +sp.dataset.si : -1;
    if (i !== selShape) { selShape = i; markSel(); }
    // Animasyon verilecek nesne: şekil, resim, yazı kutusu ya da SmartArt (boş yere tıklayınca seçim kalkar)
    const t = sp ? 'shp:' + i : e.target.closest('.pp-img') ? 'img' : e.target.closest('.pp-box')?.dataset.k || (e.target.closest('.pp-art') ? 'body' : null);
    if (t !== selObj) { pickObj(t); emit('ppt-anim-pick', { t, index: cur }); }
    if (sp && e.button === 0) drag = { i, el: sp, x: e.clientX, y: e.clientY, r: $('.pp-slide').getBoundingClientRect(), moved: false };
  });
  $('.pp-slide').addEventListener('pointermove', (e) => {
    if (imgHandleMove(e)) return;
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    const o = deck.slides[cur].shapes[drag.i];
    if (!drag.moved) { drag.moved = true; getSelection().removeAllRanges(); $('.pp-slide').setPointerCapture?.(e.pointerId); }
    drag.nx = Math.max(0, Math.min(100 - o.w, o.x + (dx / drag.r.width) * 100));
    drag.ny = Math.max(0, Math.min(100 - o.h, o.y + (dy / drag.r.height) * 100));
    drag.el.style.left = drag.nx + '%';
    drag.el.style.top = drag.ny + '%';
    e.preventDefault();
  });
  const dropShape = () => {
    if (imgHandleUp()) return;
    const d = drag;
    drag = null;
    if (!d?.moved) return;
    pull();
    const o = deck.slides[cur].shapes[d.i];
    o.x = Math.round(d.nx * 10) / 10; o.y = Math.round(d.ny * 10) / 10;
    changed(); render();
    emit('ppt-shape-move', { kind: o.kind, x: o.x, y: o.y, index: cur });
  };
  $('.pp-slide').addEventListener('pointerup', dropShape);
  $('.pp-slide').addEventListener('pointercancel', dropShape);

  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content, n.name, n.parent); else load(args.data);

  return {
    info() {
      pull();
      return {
        theme: deck.theme, showing: !$('.pp-show').hidden, fileName, slideNum: !!deck.slideNum, notes: deck.slides.map((x) => x.notes || ''),
        music: deck.music || null, musicAt: deck.musicAt || 0, musicBg: !!deck.musicBg, view, bgPane: bgOpen, picSel: selImg, crop: cropOn, animPane: paneOpen, animSel: { t: selObj, at: selAnim }, master: { ...deck.master, logo: !!deck.master.logo }, hf: { ...deck.hf },
        slides: deck.slides.map((s) => ({ layout: s.layout, title: plain(s.title), sub: plain(s.sub), items: [...new DOMParser().parseFromString(`<ul>${s.body}</ul>`, 'text/html').querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean), img: !!s.img, trans: s.trans, art: s.art, anim: s.anim?.effect || 'none', animStart: s.anim?.start,
          anims: (s.anims || []).map((a) => ({ t: a.t, name: objName(s, a.t), kind: fxOf(a.effect)?.[2], effect: a.effect, start: a.start, dur: a.dur, delay: a.delay })), auto: s.auto || 0, click: s.click !== false, hidden: !!s.hidden, fs: { ...(s.fs || {}) }, fc: { ...(s.fc || {}) }, al: { ...(s.al || {}) }, bg: s.bg ? (s.bg.color ? { color: s.bg.color } : { pic: true }) : null, imgW: s.imgW || 0, imgCrop: s.crop ? { ...s.crop } : null, imgSize: s.imgSize, table: s.table ? s.table.map((r) => [...r]) : null, chart: s.chart ? structuredClone(s.chart) : null,
          shapes: (s.shapes || []).map((o) => ({ kind: o.kind, text: o.text || '', fill: o.fill || null, style: o.style || null, link: o.link || null, name: o.name || null })),
          links: [...new DOMParser().parseFromString(`${s.title}${s.sub}<ul>${s.body}</ul><ul>${s.body2}</ul>`, 'text/html').querySelectorAll('a[href]')].map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') })),
          ink: (s.ink || []).length })),
      };
    },
    show: () => { if ($('.pp-show').hidden) startShow(0); },
    confirmClose: confirmDiscard,
    focus: () => {},
  };
}
