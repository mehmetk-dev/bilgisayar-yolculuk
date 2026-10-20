// Kelime İşlemci: Word benzeri, sayfa görünümlü yazı programı. Biçimlendirme (kalın, italik, altı çizili, üstü çizili,
// alt/üst simge, yazı tipi, boyut, renk, vurgu), biçim boyacısı, stiller (başlıklar), hizalama, girinti, satır aralığı,
// madde işaretleri, sekme durakları (öncülü), paragraf kenarlığı ve gölgelendirme, bul ve değiştir; tablo, resim, tarih, simge,
// bağlantı, sayfa sonu; kenar boşlukları, yönlendirme, sütunlar (bütün belge ya da yalnızca seçili paragraflar);
// dipnot (Başvurular → Dipnot Ekle, Alt + Ctrl + F), içindekiler tablosu (Başlık 1–3'ten, Tabloyu Güncelleştir, Ctrl + tık);
// yazım denetimi ve sözcük sayısı; yakınlaştırma; .docx olarak kaydetme, açma, yazdırma ve PDF.
// İçerik bellekteki dosyada { html } olarak durur.
import { esc, pictureURL, isImage } from './util.js';
import { picHtml, pictureTools, WRAPS } from './word-resim.js';

const FONTS = [['Calibri', 'Calibri, Carlito, "Noto Sans", sans-serif'], ['Times New Roman', '"Times New Roman", Tinos, "Noto Serif", serif'], ['Arial', 'Arial, Arimo, "Liberation Sans", sans-serif'], ['Comic Sans MS', '"Comic Sans MS", "Comic Neue", cursive'], ['Courier New', '"Courier New", Cousine, monospace']];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48];
const COLORS = [['Siyah', '#000000'], ['Kırmızı', '#c00000'], ['Mavi', '#1f4e9c'], ['Yeşil', '#2e7d32'], ['Turuncu', '#e46c0a'], ['Mor', '#7030a0']];
const ALIGN = { justifyLeft: 'Sola hizala', justifyCenter: 'Ortala', justifyRight: 'Sağa hizala', justifyFull: 'İki yana yasla' };
const HILITE = [['Sarı', '#fff176'], ['Yeşil', '#b9f6ca'], ['Turkuaz', '#a7ecf4'], ['Pembe', '#ffc1e3'], ['Vurgu yok', 'transparent']];
const STYLES = [['p', 'Normal'], ['h1', 'Başlık 1'], ['h2', 'Başlık 2'], ['h3', 'Başlık 3'], ['title', 'Konu Başlığı'], ['blockquote', 'Alıntı']];
// Büyük/küçük harf değiştir (Türkçe harf kurallarıyla: i ↔ İ, ı ↔ I)
const trUp = (t) => t.toLocaleUpperCase('tr');
const trLow = (t) => t.toLocaleLowerCase('tr');
const CASES = {
  sentence: ['Cümle düzeni.', (t) => trLow(t).replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + trUp(b))],
  lower: ['küçük harf', trLow],
  upper: ['BÜYÜK HARF', trUp],
  title: ['Her Sözcüğün İlk Harfi Büyük', (t) => trLow(t).replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + trUp(b))],
};
const SPACING = ['1,0', '1,15', '1,5', '2,0'];
// Paragraf kenarlığı (Giriş → Kenarlıklar) ve gölgelendirme (Giriş → Gölgelendirme)
const PBORDERS = [['box', '▢ Dış Kenarlıklar'], ['top', '▔ Üst Kenarlık'], ['bottom', '▁ Alt Kenarlık'], ['none', '✕ Kenarlık Yok']];
const SHADES = [['Açık mavi', '#dbe5f1'], ['Açık gri', '#e7e6e6'], ['Açık sarı', '#fff2cc'], ['Açık yeşil', '#e2efd9'], ['Renk Yok', 'transparent']];
// Sekme öncüsü: sekmenin bıraktığı boşluğu dolduran çizgi (1 Yok, 2 ……, 3 ----, 4 ____)
const LEADERS = [['', '1 Yok'], ['dot', '2 ..........'], ['dash', '3 ----------'], ['line', '4 _______']];
const SYMBOLS = ['₺', '€', '$', '©', '®', '™', '°', '±', '×', '÷', '½', '¼', '²', '³', '✓', '✗', '★', '☎', '✉', '→', '•', '…', '«', '»'];
const MARGINS = { normal: ['Normal', '2,5 cm', '2.5em 3em'], dar: ['Dar', '1,27 cm', '1.3em 1.5em'], genis: ['Geniş', '5 cm (yanlar)', '2.5em 5.5em'] };
// Yazım denetimi: yetişkinlerin en sık karıştırdığı yazımlar (yanlış → doğru)
const SPELL = {
  herkez: 'herkes', yanlız: 'yalnız', yanlızca: 'yalnızca', yalnış: 'yanlış', yalnışlık: 'yanlışlık', malesef: 'maalesef', birşey: 'bir şey',
  hiçbirşey: 'hiçbir şey', herşey: 'her şey', şuan: 'şu an', yada: 'ya da', orjinal: 'orijinal', laboratuar: 'laboratuvar', makina: 'makine',
  şöför: 'şoför', antreman: 'antrenman', eşortman: 'eşofman', deyil: 'değil', egzos: 'egzoz', traş: 'tıraş', kontür: 'kontör', meyva: 'meyve',
  bilgisayer: 'bilgisayar', tesekkürler: 'teşekkürler', sağolun: 'sağ olun', hoşçakal: 'hoşça kal', hoşgeldiniz: 'hoş geldiniz',
  birkere: 'bir kere', pekçok: 'pek çok', mütevazi: 'mütevazı', yalnızmı: 'yalnız mı', geliyormusun: 'geliyor musun',
};
const today = () => new Date().toLocaleDateString('tr-TR');
// Hazır şablonlar (Dosya → Yeni). [Köşeli parantez] içindekiler kendi bilgilerinizle değiştirilir.
export const TEMPLATES = {
  cv: ['👤 Özgeçmiş (CV)', `<h1 class="wd-title">[Adınız Soyadınız]</h1><p>Telefon: [Telefon] · E-posta: [E-posta] · Şehir: [Şehir]</p>
<h2>Hakkımda</h2><p>[Kendinizi iki üç cümleyle anlatın: deneyiminiz, nasıl biri olduğunuz, ne iş aradığınız.]</p>
<h2>İş Deneyimi</h2><p><b>[Göreviniz]</b> · [İş yeri] · [Başlangıç – bitiş yılı]</p><ul><li>[Yaptığınız işler]</li></ul>
<h2>Eğitim</h2><p>[Okulunuz] · [Mezuniyet yılı]</p>
<h2>Kurslar ve Sertifikalar</h2><ul><li>Bilgisayar İşletmenliği Kursu · Halk Eğitim Merkezi · 2026</li></ul>
<h2>Beceriler</h2><ul><li>Kelime işlemci, hesap tablosu, e-posta, internet</li><li>[Diğer becerileriniz]</li></ul>
<h2>Referanslar</h2><p>İstenirse verilecektir.</p>`],
  dilekce: ['✉ Dilekçe', `<p style="text-align:center"><b>[KURUMUN ADI] MÜDÜRLÜĞÜNE</b></p><p style="text-align:center">[İlçe / İl]</p><p><br></p>
<p style="text-align:justify">[Dilekçenin konusu: ne istediğinizi ve nedenini kısa ve açık cümlelerle yazın.]</p><p style="text-align:justify">Gereğinin yapılmasını saygılarımla arz ederim.</p><p><br></p>
<p style="text-align:right">[Tarih]</p><p style="text-align:right">[Adınız Soyadınız]</p><p style="text-align:right">İmza</p><p><br></p><p><b>Adres:</b> [Adresiniz]</p><p><b>Telefon:</b> [Telefonunuz]</p>`],
  davet: ['🎉 Davetiye', `<p style="text-align:center"><span style="font-size:28pt;color:#7030a0">🎉 Davetlisiniz! 🎉</span></p><p style="text-align:center"><span style="font-size:16pt">[Ne kutlanıyor? ör. Torunumun doğum günü]</span></p><p><br></p>
<p style="text-align:center">📅 <b>[Tarih]</b> · 🕒 <b>[Saat]</b></p><p style="text-align:center">📍 [Adres]</p><p><br></p><p style="text-align:center"><i>Sizi aramızda görmekten mutluluk duyarız.</i></p><p style="text-align:center">[Adınız]</p>`],
};

export function word({ desk, body, args, emit, setTitle }) {
  body.classList.add('wd');
  body.innerHTML = `
    <div class="wd-tabs"><button type="button" class="wd-file">Dosya</button><button type="button" data-tab="home" class="on">Giriş</button><button type="button" data-tab="insert">Ekle</button><button type="button" data-tab="layout">Düzen</button><button type="button" data-tab="refs">Başvurular</button><button type="button" data-tab="mail">Postalar</button><button type="button" data-tab="review">Gözden Geçir</button><button type="button" data-tab="view">Görünüm</button><button type="button" data-tab="table" class="wd-tabtbl" hidden>Tablo Düzeni</button><button type="button" data-tab="pic" class="wd-tabpic" hidden>Resim Biçimi</button></div>
    <div class="wd-rib" data-tab="home">
      <div class="wd-grp"><button type="button" data-cmd="undo" title="Geri al (Ctrl + Z)">↶</button><button type="button" data-cmd="redo" title="Yinele (Ctrl + Y)">↷</button></div>
      <div class="wd-grp"><button type="button" class="wd-clip" data-clip="cut" title="Kes (Ctrl + X)">✂</button><button type="button" class="wd-clip" data-clip="copy" title="Kopyala (Ctrl + C)">⧉</button><button type="button" class="wd-clip" data-clip="paste" title="Yapıştır (Ctrl + V)">📋</button><button type="button" class="wd-painter" title="Biçim Boyacısı: seçili yazının biçimini kopyalar, sonra başka bir yazıyı seçin">🖌</button></div>
      <div class="wd-grp"><select class="wd-font" title="Yazı tipi">${FONTS.map(([n]) => `<option>${n}</option>`).join('')}</select>
        <select class="wd-size" title="Yazı tipi boyutu">${SIZES.map((s) => `<option${s === 11 ? ' selected' : ''}>${s}</option>`).join('')}</select>
        <span class="wd-mmwrap"><button type="button" class="wd-casebtn" title="Büyük/küçük harf değiştir">Aa▾</button><span class="wd-mpop wd-cases" hidden>${Object.entries(CASES).map(([k, [l]]) => `<button type="button" data-case="${k}">${l}</button>`).join('')}</span></span></div>
      <div class="wd-grp"><button type="button" data-cmd="bold" title="Kalın (Ctrl + B)"><b>K</b></button><button type="button" data-cmd="italic" title="İtalik (Ctrl + I)"><i>T</i></button><button type="button" data-cmd="underline" title="Altı çizili (Ctrl + U)"><u>A</u></button><button type="button" data-cmd="strikeThrough" title="Üstü çizili"><s>abc</s></button><button type="button" data-cmd="subscript" title="Alt simge (H₂O)">x₂</button><button type="button" data-cmd="superscript" title="Üst simge (m²)">x²</button>
        <span class="wd-colorwrap"><button type="button" class="wd-hilite" title="Metin vurgu rengi (fosforlu kalem)"><span>🖍</span><i style="background:#fff176"></i></button><span class="wd-pal wd-hpal" hidden>${HILITE.map(([n, c]) => `<button type="button" data-hilite="${c}" title="${n}" style="background:${c}">${c === 'transparent' ? '∅' : ''}</button>`).join('')}</span></span>
        <span class="wd-colorwrap"><button type="button" class="wd-color" title="Yazı tipi rengi"><span>A</span><i style="background:#c00000"></i></button><span class="wd-pal" hidden>${COLORS.map(([n, c]) => `<button type="button" data-color="${c}" title="${n}" style="background:${c}"></button>`).join('')}</span></span>
        <button type="button" data-cmd="removeFormat" title="Tüm biçimlendirmeyi temizle">A⌫</button></div>
      <div class="wd-grp">${Object.entries(ALIGN).map(([c, t], i) => `<button type="button" data-cmd="${c}" title="${t} (Ctrl + ${'LERJ'[i]})" class="wd-al wd-${c}"><span></span><span></span><span></span></button>`).join('')}</div>
      <div class="wd-grp"><button type="button" data-cmd="insertUnorderedList" title="Madde işaretleri">• ≡</button><button type="button" data-cmd="insertOrderedList" title="Numaralandırma">1. ≡</button><button type="button" data-cmd="outdent" title="Girintiyi azalt">⇤</button><button type="button" data-cmd="indent" title="Girintiyi artır">⇥</button>
        <select class="wd-lh" title="Satır ve paragraf aralığı">${SPACING.map((v) => `<option${v === '1,15' ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="wd-grp"><span class="wd-colorwrap"><button type="button" class="wd-tabsbtn" title="Sekmeler: Tab tuşunun gideceği yer (sekme durağı), hizası ve öncüsü (noktalı çizgi). Gerçek Word'de: Paragraf bölümünün sağ altındaki küçük ok → Sekmeler…">↹ Sekmeler…</button><span class="wd-tpop wd-tabpop" hidden><b>Sekmeler</b>
          <label>Sekme durağı konumu <span><input type="number" class="wd-tabpos" min="1" max="16" step="0.5" value="15"> cm</span></label>
          <label>Hizalama <select class="wd-tabal"><option value="left">Sol</option><option value="center">Orta</option><option value="right">Sağ</option></select></label>
          <label>Öncü (doldurma) <select class="wd-tablead">${LEADERS.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></label>
          <span class="wd-tabrow"><button type="button" class="wd-tabok">Tamam</button><button type="button" class="wd-tabclr" title="Seçili paragraflardaki sekme duraklarını kaldırır">Tümünü Temizle</button></span></span></span>
        <span class="wd-colorwrap"><button type="button" class="wd-bordbtn" title="Kenarlıklar: seçili paragrafın çevresine, üstüne ya da altına çizgi">▢ Kenarlık ▾</button><span class="wd-pal wd-bpal" hidden>${PBORDERS.map(([k, l]) => `<button type="button" data-pborder="${k}">${l}</button>`).join('')}</span></span>
        <span class="wd-colorwrap"><button type="button" class="wd-shadebtn" title="Gölgelendirme: paragrafın arkasını boyar"><span>🪣</span><i style="background:#dbe5f1"></i></button><span class="wd-pal wd-gpal" hidden>${SHADES.map(([n, c]) => `<button type="button" data-shade="${c}" title="${n}" style="background:${c}">${c === 'transparent' ? '∅' : ''}</button>`).join('')}</span></span></div>
      <div class="wd-grp wd-styles">${STYLES.map(([k, n]) => `<button type="button" data-style="${k}" class="wd-st-${k}" title="Stil: ${n}">${n}</button>`).join('')}</div>
      <div class="wd-grp"><button type="button" class="wd-findbtn" title="Bul (Ctrl + F)">🔎 Bul</button><button type="button" class="wd-replbtn" title="Değiştir (Ctrl + H)">⇄ Değiştir</button></div>
    </div>
    <div class="wd-rib" data-tab="insert" hidden>
      <div class="wd-grp"><button type="button" class="wd-table">▦ Tablo</button><span class="wd-tpop" hidden><label>Satır <input type="number" class="wd-tr" min="1" max="10" value="3"></label><label>Sütun <input type="number" class="wd-tc" min="1" max="6" value="3"></label><button type="button" class="wd-tok">Ekle</button></span></div>
      <div class="wd-grp"><button type="button" class="wd-pic">🖼 Resim</button><button type="button" class="wd-date">📅 Tarih</button></div>
      <div class="wd-grp"><span class="wd-colorwrap"><button type="button" class="wd-sym" title="Simge: klavyede olmayan işaretler">Ω Simge</button><span class="wd-pal wd-spal" hidden>${SYMBOLS.map((c) => `<button type="button" data-sym="${c}">${c}</button>`).join('')}</span></span>
        <span class="wd-colorwrap"><button type="button" class="wd-link" title="Bağlantı (Ctrl + K)">🔗 Bağlantı</button><span class="wd-tpop wd-lpop" hidden><label>Adres <input class="wd-lurl" placeholder="www.ornek.com.tr"></label><button type="button" class="wd-lok">Ekle</button></span></span>
        <button type="button" class="wd-pb" title="Sayfa sonu (Ctrl + Enter): yazının kalanı yeni sayfadan başlar">⤓ Sayfa sonu</button>
        <span class="wd-colorwrap"><button type="button" class="wd-shbtn" title="Şekil: içine yazı yazılabilen kutu ve oklar">◇ Şekil</button><span class="wd-pal wd-shpal" hidden><button type="button" data-shape="kutu">▭ Kutu</button><button type="button" data-shape="yuvarlak">▢ Yuvarlak kutu</button><button type="button" data-shape="ok">➜ Ok</button></span></span></div>
      <div class="wd-grp"><button type="button" class="wd-hdrbtn" title="Her sayfanın en üstünde tekrarlanan yazı">▔ Üst bilgi</button><button type="button" class="wd-ftrbtn" title="Her sayfanın en altında tekrarlanan yazı">▁ Alt bilgi</button><button type="button" class="wd-pnbtn" title="Alt bilgiye sayfa numarası ekler">#️ Sayfa numarası</button></div>
    </div>
    <div class="wd-rib" data-tab="layout" hidden>
      <div class="wd-grp">Kenar boşlukları: ${Object.entries(MARGINS).map(([k, [n, cm]]) => `<button type="button" data-margin="${k}" title="${cm}">${n}</button>`).join('')}</div>
      <div class="wd-grp">Yönlendirme: <button type="button" data-orient="dikey" title="Dikey (uzun kenar yukarıda)">▯ Dikey</button><button type="button" data-orient="yatay" title="Yatay (geniş kenar yukarıda)">▭ Yatay</button></div>
      <div class="wd-grp">Sütunlar: <button type="button" data-cols="1">▮ Bir</button><button type="button" data-cols="2">▮▮ İki</button></div>
      <div class="wd-grp">Sayfa kenarlığı: <button type="button" data-border="yok">Yok</button><button type="button" data-border="kutu" title="Sayfanın çevresine çerçeve">▣ Kutu</button><button type="button" data-border="cift" title="Çift çizgili çerçeve">▨ Çift çizgi</button></div>
      <div class="wd-grp">Filigran (arka plana silik yazı): <button type="button" data-wm="ÖRNEKTİR">ÖRNEKTİR</button><button type="button" data-wm="ACİL">ACİL</button><button type="button" data-wm="TASLAK">TASLAK</button><button type="button" data-wm="">Yok</button></div>
    </div>
    <div class="wd-rib" data-tab="refs" hidden>
      <div class="wd-grp"><button type="button" class="wd-tocbtn" title="İçindekiler Tablosu: Başlık 1, Başlık 2, Başlık 3 stilli satırlardan sayfa numaralarıyla bir liste yapar">📑 İçindekiler Tablosu</button><button type="button" class="wd-tocupd" title="Tabloyu Güncelleştir: başlık eklendiyse ya da sayfalar kaydıysa içindekiler tablosunu yeniler">⟳ Tabloyu Güncelleştir</button></div>
      <div class="wd-grp"><button type="button" class="wd-fnbtn" title="Dipnot ekle (Alt + Ctrl + F): imlecin olduğu yere küçük bir sayı koyar; açıklamasını sayfanın altına yazarsınız">ab¹ Dipnot Ekle</button></div>
      <div class="wd-grp"><small class="wd-vnote">Dipnot: bir sözcüğe eklenen açıklama ya da kaynak. Sayfanın en altında küçük yazıyla, numarasıyla görünür; numaralar kendiliğinden sıralanır.</small></div>
    </div>
    <div class="wd-rib" data-tab="mail" hidden>
      <div class="wd-grp"><button type="button" data-mm="list" title="Mektubun gideceği kişilerin listesi (hesap tablosu dosyası)">👥 Alıcıları seç…</button><span class="wd-mmcount"></span></div>
      <div class="wd-grp wd-mmwrap"><button type="button" class="wd-fieldbtn" disabled title="Listedeki bir sütunu (Ad, Adres…) mektuba yer tutucu olarak ekler">⊕ Birleştirme alanı ekle ▾</button><span class="wd-mpop wd-fields" hidden></span></div>
      <div class="wd-grp"><button type="button" data-mm="preview" disabled title="Alanların yerine listedeki gerçek bilgileri gösterir">👁 Sonuçları önizle</button><button type="button" data-mm="prev" disabled title="Önceki kişi">◀</button><b class="wd-mmrec"></b><button type="button" data-mm="next" disabled title="Sonraki kişi">▶</button></div>
      <div class="wd-grp wd-mmwrap"><button type="button" class="wd-finbtn" disabled title="Her kişi için ayrı mektup">✔ Bitir ve birleştir ▾</button><span class="wd-mpop wd-fin" hidden><button type="button" data-mm="edit">📄 Tek tek belgeleri düzenle</button><button type="button" data-mm="print">🖨 Belgeleri yazdır…</button></span></div>
    </div>
    <div class="wd-rib" data-tab="review" hidden>
      <div class="wd-grp"><button type="button" class="wd-spell" title="Yazım denetimi (F7)">ABC✓ Yazım denetimi</button><button type="button" class="wd-count" title="Sözcük sayısı">123 Sözcük sayısı</button></div>
    </div>
    <div class="wd-rib" data-tab="view" hidden>
      <div class="wd-grp"><label class="wd-chk"><input type="checkbox" class="wd-rulerchk"> Cetvel</label><small class="wd-vnote">Yakınlaştırma: sağ alttaki çubuk ya da Ctrl + fare tekerleği</small></div>
    </div>
    <div class="wd-rib" data-tab="table" hidden>
      <div class="wd-grp">Satır: <button type="button" data-tb="rowAbove">↑ Üste ekle</button><button type="button" data-tb="rowBelow">↓ Alta ekle</button><button type="button" data-tb="rowDel">✕ Satırı sil</button></div>
      <div class="wd-grp">Sütun: <button type="button" data-tb="colLeft">← Sola ekle</button><button type="button" data-tb="colRight">→ Sağa ekle</button><button type="button" data-tb="colDel">✕ Sütunu sil</button></div>
      <div class="wd-grp"><button type="button" data-tb="merge" title="Önce birleştirmek istediğiniz yan yana hücreleri fareyle sürükleyerek seçin">⊞ Hücreleri birleştir</button></div>
      <div class="wd-grp">Hücre içi: <button type="button" data-tb="vTop">⬆ Üst</button><button type="button" data-tb="vMid">↕ Orta</button><button type="button" data-tb="vBot">⬇ Alt</button></div>
      <div class="wd-grp">Çizgiler: <button type="button" data-tb="bThin">İnce</button><button type="button" data-tb="bThick">Kalın</button><button type="button" data-tb="tblDel">🗑 Tabloyu sil</button></div>
    </div>
    <div class="wd-rib" data-tab="pic" hidden>
      <div class="wd-grp">Metni kaydır: ${WRAPS.map(([k, l, ic]) => `<button type="button" data-pwrap="${k}">${ic} ${l}</button>`).join('')}</div>
      <div class="wd-grp"><button type="button" class="wd-pcrop" title="Resmin kenarlarındaki siyah çizgileri içeri çekerek istemediğiniz yerleri kesin">✂ Kırp</button><button type="button" class="wd-preset" title="Kırpmayı ve boyutu geri alır">↺ Resmi sıfırla</button></div>
    </div>
    <div class="wd-find" hidden><b class="wd-fh">Bul ve Değiştir</b><label>Aranan <input class="wd-fq"></label><label class="wd-rrow">Yeni <input class="wd-rq"></label>
      <span class="wd-fn"></span><button type="button" data-f="next">Sonrakini bul</button><button type="button" data-f="repl" class="wd-rrow">Değiştir</button><button type="button" data-f="all" class="wd-rrow">Tümünü değiştir</button><button type="button" data-f="close" title="Kapat">✕</button></div>
    <div class="wd-spane" hidden></div>
    <div class="wd-menu" hidden><button type="button" data-file="new">📄 Yeni…</button><button type="button" data-file="open">📂 Aç…</button><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="pdf">📕 PDF olarak kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button><button type="button" data-file="close">✕ Kapat</button></div>
    <div class="wd-scroll"><div class="wd-ruler" hidden><span></span></div><div class="wd-hf wd-hdr" contenteditable="true" spellcheck="false" data-ph="Üst bilgi" hidden></div><div class="wd-page" contenteditable="true" spellcheck="false"><p><br></p></div><div class="wd-fns" hidden><ol></ol></div><div class="wd-hf wd-ftr" hidden><span class="wd-ftxt" contenteditable="true" spellcheck="false" data-ph="Alt bilgi"></span><span class="wd-pn" hidden></span></div></div>
    <div class="wd-status"><span class="wd-words"></span><span class="wd-lang">Türkçe (Türkiye)</span><span class="wd-zoom"><button type="button" data-zoom="-10" title="Uzaklaştır">−</button><input type="range" class="wd-zr" min="50" max="200" step="10" value="100" aria-label="Yakınlaştırma"><button type="button" data-zoom="10" title="Yakınlaştır">+</button><b>%100</b></span></div>`;
  const $ = (s) => body.querySelector(s);
  const page = $('.wd-page');
  let fileName = null, folder = 'docs', dirty = false, range = null;
  const DEF_LAYOUT = { margin: 'normal', orient: 'dikey', cols: 1, border: 'yok', wm: '' };
  const layout = { ...DEF_LAYOUT };

  const title = () => setTitle(`${dirty ? '*' : ''}${fileName || 'Belge1'} - Kelime İşlemci`);
  const countWords = () => { const t = page.innerText.trim(); return t ? t.split(/\s+/).length : 0; };
  // Sayfa sayısı: yazının yüksekliği A4 kâğıdın boyuna göre (yatayda eni boyundan büyüktür) + sayfa sonları
  const pageCount = () => {
    const last = page.lastElementChild;
    const h = last ? last.offsetTop + last.offsetHeight : 0;
    return Math.max(page.querySelectorAll('hr.wd-pb').length + 1, Math.ceil(h / (page.offsetWidth * (page.classList.contains('yatay') ? 0.707 : 1.414) || 1)));
  };
  const hdr = $('.wd-hdr'), ftr = $('.wd-ftr'), ftxt = $('.wd-ftxt'), pn = $('.wd-pn');
  // Dipnotlar: metinde <sup class="wd-fnref" data-fn="f1">1</sup>, sayfanın altında aynı data-fn'li madde.
  // Numaralar metindeki sıraya göre verilir; metinden silinen dipnotun açıklaması da kalkar.
  const fns = $('.wd-fns'), fnList = fns.querySelector('ol');
  let fnSeq = 1;
  function renumberFn() {
    const refs = [...page.querySelectorAll('sup.wd-fnref')];
    const lis = new Map([...fnList.children].map((li) => [li.dataset.fn, li]));
    refs.forEach((r, i) => { r.textContent = i + 1; });
    const keep = refs.map((r) => lis.get(r.dataset.fn)).filter(Boolean);
    if (keep.length !== fnList.children.length || keep.some((li, i) => fnList.children[i] !== li)) fnList.replaceChildren(...keep);
    fns.hidden = !keep.length;
  }
  function setFn(list = []) {
    fnList.innerHTML = list.map((f) => `<li data-fn="${esc(f.id)}"><span class="wd-fnt" contenteditable="true" spellcheck="false">${f.html || ''}</span></li>`).join('');
    fnSeq = list.reduce((m, f) => Math.max(m, +String(f.id).slice(1) || 0), 0) + 1;
    renumberFn();
  }
  const fnInfo = () => [...fnList.children].map((li, i) => ({ n: i + 1, text: li.innerText.trim() }));
  const words = () => {
    const pc = pageCount();
    $('.wd-words').textContent = `Sayfa 1 / ${pc} · ${countWords()} sözcük`;
    pn.textContent = `Sayfa 1 / ${pc}`;
  };
  // Üst bilgi, alt bilgi ve sayfa numarası (dosyada { header, footer, pageNum } olarak durur)
  function setHF({ header = '', footer = '', pageNum = false } = {}) {
    hdr.innerHTML = header; ftxt.innerHTML = footer; pn.hidden = !pageNum;
    hdr.hidden = !header; ftr.hidden = !footer && !pageNum;
  }
  function showHF(which) {
    if (which === 'pn') { pn.hidden = !pn.hidden; ftr.hidden = !ftxt.textContent.trim() && pn.hidden; words(); changed(); emit('doc-pagenum', { on: !pn.hidden }); return; }
    const el = which === 'h' ? hdr : ftr;
    el.hidden = false;
    (which === 'h' ? hdr : ftxt).focus();
    emit(which === 'h' ? 'doc-header-open' : 'doc-footer-open');
  }

  const pics = pictureTools({ page, body, emit, changed: () => changed() });
  function load(html, name = null, fld = folder, layout = {}, hf = {}) {
    page.innerHTML = html || '<p><br></p>';
    pics.refresh();
    setLayout(layout, true);
    setHF(hf);
    setFn(hf.footnotes);
    fileName = name; folder = fld; dirty = false;
    title(); words();
    setTimeout(() => layoutTabs(), 0);
  }
  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content?.html, n.name, n.parent, n.content?.layout, n.content);
  else if (args.merged) { load(args.merged.html, null, folder, args.merged.layout, args.merged); dirty = true; setTitle('*Mektuplar1 - Kelime İşlemci'); } // adres mektup birleştirmenin sonucu
  else load();

  // Seçim, araç çubuğuna tıklanınca kaybolmasın: son seçim saklanır ve komuttan önce geri yüklenir
  const onSel = () => {
    if (!page.isConnected) { document.removeEventListener('selectionchange', onSel); return; }
    const s = getSelection();
    if (s.rangeCount && page.contains(s.anchorNode)) { range = s.getRangeAt(0).cloneRange(); syncTools(); syncTableTab(); }
  };
  document.addEventListener('selectionchange', onSel);
  // Tablo Düzeni sekmesi yalnızca imleç bir tablonun içindeyken görünür
  const cellOf = (node) => { const el = node && (node.nodeType === 1 ? node : node.parentElement); const td = el?.closest('td'); return td && page.contains(td) ? td : null; };
  function syncTableTab() {
    const inTable = !!cellOf(range?.startContainer);
    const tab = $('.wd-tabtbl');
    if (tab.hidden === !inTable) return;
    tab.hidden = !inTable;
    if (!inTable && tab.classList.contains('on')) $('.wd-tabs [data-tab="home"]').click();
  }
  function tableOp(op) {
    const td = cellOf(range?.startContainer);
    if (!td) return;
    const tr = td.parentElement, table = td.closest('table');
    const idx = td.cellIndex;
    let keep = null; // işlemden sonra imlecin gideceği hücre (tablo duruyorsa Tablo Düzeni sekmesi açık kalır)
    const newRow = () => { const r = document.createElement('tr'); const n = [...table.rows[0].cells].reduce((a, c) => a + c.colSpan, 0); r.innerHTML = '<td><br></td>'.repeat(n); return r; };
    switch (op) {
      case 'rowAbove': tr.before(newRow()); break;
      case 'rowBelow': tr.after(newRow()); break;
      case 'rowDel': { const nr = tr.nextElementSibling || tr.previousElementSibling; if (table.rows.length === 1) table.remove(); else { keep = nr.cells[Math.min(idx, nr.cells.length - 1)]; tr.remove(); } break; }
      case 'colLeft': for (const r of table.rows) r.cells[Math.min(idx, r.cells.length - 1)]?.insertAdjacentHTML('beforebegin', '<td><br></td>'); break;
      case 'colRight': for (const r of table.rows) r.cells[Math.min(idx, r.cells.length - 1)]?.insertAdjacentHTML('afterend', '<td><br></td>'); break;
      case 'colDel': for (const r of table.rows) r.cells[Math.min(idx, r.cells.length - 1)]?.remove(); if (![...table.rows].some((r) => r.cells.length)) table.remove(); else keep = tr.cells[Math.min(idx, tr.cells.length - 1)]; break;
      case 'tblDel': table.remove(); break;
      case 'bThick': table.classList.add('thick'); break;
      case 'bThin': table.classList.remove('thick'); break;
      case 'vTop': case 'vMid': case 'vBot': {
        const v = { vTop: 'top', vMid: 'middle', vBot: 'bottom' }[op];
        const cells = [...table.querySelectorAll('td')].filter((c) => range.intersectsNode(c));
        (cells.length ? cells : [td]).forEach((c) => { c.style.verticalAlign = v; });
        break;
      }
      case 'merge': {
        const a = cellOf(range.startContainer), b = cellOf(range.endContainer);
        const cells = [...table.querySelectorAll('td')].filter((c) => range.intersectsNode(c) && c.parentElement === a.parentElement);
        if (!b || a === b || cells.length < 2) { desk.toast('Hücreleri önce seçin', 'Birleştirmek istediğiniz yan yana hücreleri fareyle sürükleyerek seçin, sonra “Hücreleri birleştir”e tıklayın.', '▦', 5000); emit('doc-table', { op: 'merge', ok: false }); return; }
        if (cells.some((c) => c.parentElement !== a.parentElement)) { desk.toast('Aynı satır', 'Yalnızca aynı satırdaki hücreler birleştirilebilir.', '▦'); return; }
        const first = cells[0];
        first.colSpan = cells.reduce((n, c) => n + c.colSpan, 0);
        first.innerHTML = cells.map((c) => c.innerHTML.replace(/^<br>$/, '')).filter(Boolean).join(' ') || '<br>';
        cells.slice(1).forEach((c) => c.remove());
        keep = first;
        break;
      }
    }
    // Hücre silindiyse ya da birleştiyse kayıtlı seçim artık geçersizdir
    if (['rowDel', 'colDel', 'tblDel', 'merge'].includes(op)) {
      range = null;
      if (keep?.isConnected) { const r = document.createRange(); r.selectNodeContents(keep); r.collapse(true); range = r; restore(); }
    }
    syncTableTab();
    changed();
    emit('doc-table', { op, ok: true, rows: page.querySelector('table')?.rows.length || 0, cols: page.querySelector('table')?.rows[0]?.cells.length || 0 });
  }
  function restore() {
    page.focus({ preventScroll: true });
    if (range) { const s = getSelection(); s.removeAllRanges(); s.addRange(range); }
  }

  function syncTools() {
    for (const c of ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'insertUnorderedList', 'insertOrderedList', ...Object.keys(ALIGN)]) {
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
      const blk = blockOf(el);
      const st = blk?.classList.contains('wd-title') ? 'title' : blk?.tagName.toLowerCase();
      body.querySelectorAll('[data-style]').forEach((b) => b.classList.toggle('on', b.dataset.style === st));
    }
  }

  function changed() { dirty = true; renumberFn(); title(); words(); layoutTabs(); }
  function addFootnote() {
    const id = 'f' + fnSeq++;
    insertHtml(`<sup class="wd-fnref" contenteditable="false" data-fn="${id}" title="Dipnot">*</sup>`, 'footnote');
    const li = document.createElement('li');
    li.dataset.fn = id;
    li.innerHTML = '<span class="wd-fnt" contenteditable="true" spellcheck="false"></span>';
    fnList.append(li);
    renumberFn();
    if (!page.querySelector(`sup[data-fn="${id}"]`)) { li.remove(); renumberFn(); return; }
    li.querySelector('.wd-fnt').focus();
    emit('doc-footnote', { count: fnList.children.length, n: [...fnList.children].indexOf(li) + 1 });
  }

  function exec(cmd, value = null) {
    restore();
    // Girinti: paragraf (liste değilse) 1,25 cm içeri alınır / geri çekilir; tarayıcının kendi girintisi alıntıya çevirirdi
    if ((cmd === 'indent' || cmd === 'outdent') && selectedBlocks().length && !selectedBlocks().some((b) => b.tagName === 'LI')) {
      selectedBlocks().forEach((b) => { const m = Math.max(0, (parseFloat(b.style.marginLeft) || 0) + (cmd === 'indent' ? 1.25 : -1.25)); b.style.marginLeft = m ? m + 'cm' : ''; });
      changed();
      emit('doc-format', { cmd, value });
      return;
    }
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
      desk.fs.write(folder, fileName, content());
      dirty = false; title();
      emit('doc-save', { name: fileName, folder, quick: true });
      desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
      return true;
    }
    const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Belge1.docx', ext: '.docx', typeLabel: 'Word Belgesi (*.docx)' });
    page.focus();
    if (!r) return false;
    desk.fs.write(r.folder, r.name, content());
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
    if (c === 'new') {
      if (!(await confirmDiscard())) return;
      const a = await desk.dialogs.ask({ title: 'Yeni belge', icon: '📄', text: '<b>Boş bir belge mi, hazır bir şablon mu?</b><br>Şablonda başlıklar ve düzen hazırdır; [köşeli parantez] içindekileri kendi bilgilerinizle değiştirirsiniz.', buttons: [['blank', '📄 Boş belge', true], ...Object.entries(TEMPLATES).map(([k, [l]]) => [k, l]), ['cancel', 'İptal']] });
      if (!a || a === 'cancel') return;
      load(a === 'blank' ? '' : TEMPLATES[a][1]);
      emit('doc-new', { template: a === 'blank' ? null : a });
      return;
    }
    if (c === 'close') return desk.close(desk.wins.find((w) => w.el.contains(body)));
    if (c === 'open') {
      if (!(await confirmDiscard())) return;
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder, ext: '.docx', typeLabel: 'Word Belgeleri (*.docx)' });
      if (!r) return;
      const c = desk.fs.find(r.folder, r.name)?.content;
      load(c?.html, r.name, r.folder, c?.layout, c);
      emit('doc-open', { name: r.name });
      return;
    }
    if (c === 'print') {
      const pages = pageCount();
      emit('doc-print-open', { pages });
      const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Belge1', preview: { html: cleanHtml() + (fnList.children.length ? `<hr style="width:30%;margin:1.5em 0 0.3em"><ol style="font-size:8pt;padding-left:1.4em;margin:0">${[...fnList.children].map((li) => `<li>${li.querySelector('.wd-fnt').innerHTML}</li>`).join('')}</ol>` : ''), pages, orient: layout.orient, border: layout.border, wm: layout.wm, padding: MARGINS[layout.margin][2] } });
      if (r) { desk.toast('Yazdırılıyor', `“${esc(fileName || 'Belge1')}” → ${esc(r.printer)}`, '🖨'); emit('doc-print', { ...r, doc: fileName, pages }); }
      return;
    }
    if (c === 'pdf') {
      const base = (fileName || 'Belge1').replace(/\.docx$/i, '');
      const r = await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: base + '.pdf', ext: '.pdf', typeLabel: 'PDF (*.pdf)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, content());
      desk.toast('PDF olarak kaydedildi', esc(r.name), '📕');
      emit('doc-pdf', { name: r.name, folder: r.folder });
    }
  }

  // ---- Ekle ----
  // Paragrafın sonuna satır içi öğe (alan, şekil, bağlantı) eklenirken tarayıcı onu paragrafın DIŞINA, sayfaya çıplak bırakabilir:
  // sonradan sayfaya eklenmiş çıplak öğeleri imlecin bulunduğu (hemen öncesindeki) paragrafın içine alır
  function adoptStray(before) {
    const inline = (n) => n.nodeType === 3 || !/^(P|H[1-6]|DIV|UL|OL|LI|TABLE|HR|BLOCKQUOTE)$/.test(n.tagName);
    const stray = [...page.childNodes].filter((n) => !before.has(n) && inline(n));
    if (!stray.length) return;
    let host = stray[0].previousSibling;
    while (host && host.nodeType === 3 && !host.textContent.trim()) host = host.previousSibling;
    if (!host || host.nodeType !== 1 || !/^(P|H[1-6])$/.test(host.tagName)) { host = document.createElement('p'); stray[0].before(host); }
    host.append(...stray);
    const r = document.createRange();
    r.setStartAfter(host.lastChild);
    r.collapse(true);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }
  function insertHtml(html, what) {
    restore();
    const before = new Set(page.childNodes);
    document.execCommand('insertHTML', false, html);
    adoptStray(before);
    changed();
    emit('doc-insert', { what });
  }
  async function insertPicture() {
    const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.jpg', typeLabel: 'Resimler (*.jpg; *.png)', accept: /\.(png|jpe?g|bmp)$/i });
    if (!r || !isImage(r.name)) return;
    const before = new Set(page.querySelectorAll('.wd-pic'));
    insertHtml(picHtml(pictureURL(desk.fs.find(r.folder, r.name)?.content), r.name), 'picture');
    const p = [...page.querySelectorAll('.wd-pic')].find((x) => !before.has(x));
    if (p) pics.adopt(p);
  }

  // Kaydedilen içerik: yazım denetimi ve bul işaretleri dosyaya girmez
  function cleanHtml() {
    const c = page.cloneNode(true);
    c.querySelectorAll('.wd-sp, mark.wd-hit').forEach((s) => s.replaceWith(...s.childNodes));
    c.querySelectorAll('.wd-pic.on').forEach((x) => x.classList.remove('on'));
    c.querySelectorAll('.wd-field').forEach((x) => { x.textContent = `«${x.dataset.field}»`; x.classList.remove('pv'); }); // önizleme kaydedilmez
    return c.innerHTML;
  }
  const content = () => ({ html: cleanHtml(), layout: { ...layout }, header: hdr.hidden ? '' : hdr.innerHTML, footer: ftr.hidden ? '' : ftxt.innerHTML, pageNum: !pn.hidden, footnotes: [...fnList.children].map((li) => ({ id: li.dataset.fn, html: li.querySelector('.wd-fnt').innerHTML })) });

  // ---- Paragraf: stiller ve satır aralığı ----
  const BLOCKS = /^(P|H1|H2|H3|DIV|LI|BLOCKQUOTE)$/;
  function blockOf(node) {
    for (let x = node && (node.nodeType === 1 ? node : node.parentElement); x && x !== page; x = x.parentElement) if (BLOCKS.test(x.tagName) && (x.parentElement === page || x.parentElement?.classList.contains('wd-cols')) || x.tagName === 'LI') return x;
    return null;
  }
  function selectedBlocks() {
    const r = range;
    if (!r) return [];
    const all = [...page.querySelectorAll('p, h1, h2, h3, li, blockquote, div')].filter((b) => (b.parentElement === page || b.parentElement?.classList.contains('wd-cols') || b.tagName === 'LI') && !b.matches('.wd-cols, .wd-toc') && r.intersectsNode(b));
    return all.length ? all : [blockOf(r.startContainer)].filter(Boolean);
  }
  function setStyle(k) {
    restore();
    document.execCommand('formatBlock', false, `<${k === 'title' ? 'h1' : k}>`);
    onSel();
    selectedBlocks().forEach((b) => b.classList.toggle('wd-title', k === 'title'));
    changed();
    emit('doc-style', { style: k });
    emit('doc-format', { cmd: 'style', value: k });
    syncTools();
  }
  function changeCase(k) {
    restore();
    const t = getSelection().toString();
    if (!t) { desk.toast('Önce seçin', 'Harflerini değiştirmek istediğiniz yazıyı seçin.', 'Aa', 3000); return; }
    document.execCommand('insertText', false, CASES[k][1](t));
    changed();
    emit('doc-case', { mode: k });
  }
  function setSpacing(v) {
    const lh = parseFloat(v.replace(',', '.'));
    selectedBlocks().forEach((b) => { b.style.lineHeight = String(lh * 1.15); });
    changed();
    emit('doc-format', { cmd: 'lineHeight', value: lh });
    restore();
  }

  // ---- Paragraf: kenarlık, gölgelendirme ve sekme durakları ----
  function paraBorder(kind) {
    const blks = selectedBlocks();
    blks.forEach((b) => {
      b.style.border = ''; b.style.padding = '';
      delete b.dataset.pborder;
      const line = '1px solid #000';
      if (kind === 'box') { b.style.border = line; b.style.padding = '0.15em 0.4em'; }
      if (kind === 'top') { b.style.borderTop = line; b.style.paddingTop = '0.2em'; }
      if (kind === 'bottom') { b.style.borderBottom = line; b.style.paddingBottom = '0.2em'; }
      if (kind !== 'none') b.dataset.pborder = kind;
    });
    restore();
    changed();
    emit('doc-para', { kind: 'border', value: kind, count: blks.length });
    emit('doc-format', { cmd: 'border', value: kind });
  }
  function paraShade(color) {
    const blks = selectedBlocks();
    blks.forEach((b) => { b.style.backgroundColor = color === 'transparent' ? '' : color; });
    restore();
    changed();
    emit('doc-para', { kind: 'shade', value: color, count: blks.length });
    emit('doc-format', { cmd: 'shade', value: color });
  }
  // Sekme durağı paragrafta data-tabs="15|left|dot" (cm | hizalama | öncü) olarak durur; paragrafta bir durak olur.
  // Tab'a basınca <span class="wd-tab"> konur; genişliği durağa göre hesaplanır.
  function setTabStop(clear) {
    const blks = selectedBlocks();
    const pos = Math.min(16, Math.max(0.5, parseFloat(String($('.wd-tabpos').value).replace(',', '.')) || 15));
    const align = $('.wd-tabal').value, leader = $('.wd-tablead').value;
    blks.forEach((b) => { if (clear) delete b.dataset.tabs; else b.dataset.tabs = `${pos}|${align}|${leader}`; });
    $('.wd-tabpop').hidden = true;
    restore();
    changed();
    emit('doc-tabstop', { pos, align, leader, count: blks.length, clear: !!clear });
    emit('doc-format', { cmd: 'tabstop' });
  }
  function insertTab() {
    const s = getSelection();
    if (!s.rangeCount) return;
    const r = s.getRangeAt(0);
    r.deleteContents();
    const t = document.createElement('span');
    t.className = 'wd-tab';
    t.contentEditable = 'false';
    r.insertNode(t);
    r.setStartAfter(t);
    r.collapse(true);
    s.removeAllRanges();
    s.addRange(r);
    changed();
    const blk = blockOf(t);
    emit('doc-tab', { count: blk?.querySelectorAll('.wd-tab').length || 0, text: blk?.innerText.trim().slice(0, 40) || '' });
  }
  // Sekmelerin genişliği: kâğıdın sol kenar boşluğundan durağa kadar (sağ ve orta durakta sonraki yazının eni düşülür).
  // Durağı olmayan paragrafta her 1,25 cm'de bir varsayılan durak vardır.
  function layoutTabs() {
    const tabs = page.querySelectorAll('.wd-tab');
    if (!tabs.length || !page.isConnected) return;
    const pr = page.getBoundingClientRect(), k = pr.width / (page.offsetWidth || pr.width || 1) || 1; // yakınlaştırma oranı
    const cs = getComputedStyle(page), cm = (page.offsetWidth / 21) * k; // A4 kâğıdın eni 21 cm
    const left0 = pr.left + (parseFloat(cs.paddingLeft) || 0) * k, right0 = pr.right - (parseFloat(cs.paddingRight) || 0) * k;
    for (const t of tabs) {
      const blk = blockOf(t);
      const [pos, al = 'left', lead = ''] = (blk?.dataset.tabs || '').split('|');
      t.className = 'wd-tab' + (pos && lead ? ' wd-tl-' + lead : '');
      t.style.width = '0px';
      const x = t.getBoundingClientRect().left;
      const target = pos ? Math.min(right0, left0 + parseFloat(pos) * cm) : left0 + (Math.floor((x - left0) / (1.25 * cm)) + 1) * 1.25 * cm;
      let follow = 0;
      if (pos && al !== 'left' && blk) {
        const r = document.createRange();
        r.setStartAfter(t);
        const nx = [...blk.querySelectorAll('.wd-tab')].find((o) => t.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (nx) r.setEndBefore(nx); else r.setEnd(blk, blk.childNodes.length);
        follow = r.getBoundingClientRect().width * (al === 'center' ? 0.5 : 1);
      }
      t.style.width = Math.max(4, (target - x - follow) / k) + 'px';
    }
  }
  new ResizeObserver(() => layoutTabs()).observe(page);

  // ---- Sütunlar ----
  // Yazı seçiliyse yalnızca seçili paragraflar sütunlara bölünür (Word araya “bölüm sonu” koyar); seçim yoksa bütün belge
  function setCols(n) {
    const sel = range && !range.collapsed && page.contains(range.commonAncestorContainer) ? [...page.children].filter((b) => range.intersectsNode(b) && !b.classList.contains('wd-toc')) : [];
    if (!sel.length) return setLayout({ cols: n });
    const inner = sel.flatMap((b) => (b.classList.contains('wd-cols') ? [...b.children] : [b]));
    sel.filter((b) => b.classList.contains('wd-cols')).forEach((d) => d.replaceWith(...d.children));
    let d = null;
    if (n > 1) {
      d = document.createElement('div');
      d.className = 'wd-cols';
      d.style.columnCount = n;
      inner[0].before(d);
      d.append(...inner);
    }
    const r = document.createRange();
    r.setStartBefore(inner[0]); r.setEndAfter(inner[inner.length - 1]);
    range = r;
    restore();
    changed();
    emit('doc-cols', { cols: n, part: true, count: inner.length });
    emit('doc-format', { cmd: 'columns', value: n });
  }

  // ---- İçindekiler tablosu ----
  // Başlık 1–3 stilli satırlardan yapılır (Konu Başlığı girmez). Word'deki gibi kendiliğinden yenilenmez: “Tabloyu Güncelleştir”.
  const headings = () => [...page.querySelectorAll('h1, h2, h3')].filter((h) => !h.classList.contains('wd-title') && !h.closest('.wd-toc') && h.innerText.trim());
  // Bir öğenin kaçıncı sayfada olduğu: önündeki sayfa sonları + son sayfa sonundan bu yana taşan yükseklik
  function pageOf(el) {
    const pr = page.getBoundingClientRect(), H = pr.width * (page.classList.contains('yatay') ? 0.707 : 1.414);
    let n = 1, from = pr.top;
    for (const pb of page.querySelectorAll('hr.wd-pb')) {
      if (!(pb.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) break;
      n++; from = pb.getBoundingClientRect().bottom;
    }
    return n + Math.max(0, Math.floor((el.getBoundingClientRect().top - from) / (H || 1)));
  }
  const tocHtml = () => {
    const hs = headings();
    return '<p class="wd-toch">İçindekiler</p>' + (hs.length
      ? hs.map((h) => `<p class="wd-tocl wd-toc${h.tagName[1]}" title="Başlığa gitmek için Ctrl + tık"><span>${esc(h.innerText.trim())}</span><i></i><b>${pageOf(h)}</b></p>`).join('')
      : '<p class="wd-tocl">İçindekiler girdisi bulunamadı. Başlıklara Giriş → Stiller → Başlık 1 verin.</p>');
  };
  const tocInfo = () => [...(page.querySelector('.wd-toc')?.querySelectorAll('.wd-tocl') || [])].filter((p) => p.querySelector('b')).map((p) => ({ text: p.querySelector('span').innerText.trim(), page: +p.querySelector('b').textContent }));
  function fillToc(d) { d.innerHTML = tocHtml(); d.innerHTML = tocHtml(); } // ikinci kez: tablonun kendi boyu sayfaları kaydırmış olabilir
  function insertToc() {
    const old = page.querySelector('.wd-toc');
    if (old) return updateToc();
    let top = range && (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement);
    while (top && top.parentElement !== page) top = top.parentElement;
    const d = document.createElement('div');
    d.className = 'wd-toc';
    d.contentEditable = 'false';
    if (top && page.contains(top)) top.before(d); else page.prepend(d);
    if (!d.nextElementSibling) d.after(Object.assign(document.createElement('p'), { innerHTML: '<br>' }));
    fillToc(d);
    changed();
    emit('doc-toc', { op: 'insert', entries: tocInfo() });
  }
  function updateToc() {
    const d = page.querySelector('.wd-toc');
    if (!d) { desk.toast('İçindekiler tablosu yok', 'Önce Başvurular → <b>İçindekiler Tablosu</b> ile bir tablo ekleyin.', '📑', 4000); return; }
    fillToc(d);
    changed();
    desk.toast('Tabloyu Güncelleştir', `İçindekiler tablosu yenilendi: ${tocInfo().length} başlık.`, '📑', 2500);
    emit('doc-toc', { op: 'update', entries: tocInfo() });
  }
  // İçindekiler satırına Ctrl + tık: o başlığa gider
  page.addEventListener('click', (e) => {
    const tl = e.target.closest('.wd-tocl');
    if (!tl || !tl.querySelector('span')) return;
    if (!(e.ctrlKey || e.metaKey)) { desk.toast('İçindekiler', 'Başlığa gitmek için ' + 'Ctrl tuşuna basılı tutup tıklayın.', '📑', 3000); return; }
    const txt = tl.querySelector('span').innerText.trim();
    const h = headings().find((x) => x.innerText.trim() === txt);
    if (h) {
      h.scrollIntoView({ block: 'center' });
      const r = document.createRange();
      r.selectNodeContents(h); r.collapse(true);
      range = r;
      restore();
    } else desk.toast('Başlık bulunamadı', `“${esc(txt)}” başlığı belgede yok. Başlığın adı değiştiyse Tabloyu Güncelleştir'e basın.`, '📑', 4500);
    emit('doc-toc-go', { text: txt, found: !!h });
  });

  // ---- Kes, kopyala, yapıştır ve biçim boyacısı ----
  let clip = '';
  page.addEventListener('copy', () => { clip = getSelection().toString(); });
  page.addEventListener('cut', () => { clip = getSelection().toString(); });
  function clipCmd(k) {
    restore();
    if (k === 'paste') {
      // Tarayıcı panoya doğrudan erişime izin vermeyebilir: önce gerçek panoyu dener, olmazsa bu programda kopyalananı yapıştırır
      const put = (txt) => { restore(); document.execCommand('insertText', false, txt); changed(); emit('doc-clip', { op: 'paste' }); };
      if (navigator.clipboard?.readText) navigator.clipboard.readText().then((x) => put(x || clip), () => put(clip));
      else put(clip);
      return;
    }
    if (getSelection().isCollapsed) { desk.toast('Önce seçin', 'Kesmek ya da kopyalamak için önce yazıyı seçin (sürükleyerek ya da çift tıklayarak).', '✋', 3500); return; }
    clip = getSelection().toString();
    document.execCommand(k);
    if (k === 'cut') changed();
    emit('doc-clip', { op: k });
  }
  let painter = null;
  function pickPainter() {
    restore();
    const s = getSelection();
    const el = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
    if (!el || !page.contains(el)) return;
    const cs = getComputedStyle(el);
    const deco = (k) => { for (let x = el; x && x !== page; x = x.parentElement) if (getComputedStyle(x).textDecorationLine.includes(k)) return true; return false; };
    painter = { bold: +cs.fontWeight >= 600, italic: cs.fontStyle === 'italic', underline: deco('underline'), size: Math.round(parseFloat(cs.fontSize) * 0.75), color: cs.color, font: FONTS.find(([nm]) => cs.fontFamily.includes(nm))?.[0], family: cs.fontFamily };
    page.classList.add('painting');
    $('.wd-painter').classList.add('on');
    emit('doc-painter', { stage: 'pick' });
  }
  // Çift tıklanan boyacı kilitlenir: Esc'ye ya da yeniden 🖌'ya basılana kadar birçok yere sürülür
  function stopPainter() { painter = null; page.classList.remove('painting'); $('.wd-painter').classList.remove('on', 'lock'); }
  function applyPainter() {
    const p = painter;
    if (!p.sticky) stopPainter();
    onSel();
    for (const k of ['bold', 'italic', 'underline']) if (document.queryCommandState(k) !== p[k]) document.execCommand(k);
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, p.color);
    if (p.font) document.execCommand('fontName', false, p.family || p.font); // yazı tipi yedekleriyle birlikte (bilgisayarda yoksa benzeri)
    onSel(); // önceki komutlar seçimi yeniledi; boyut güncel seçime uygulanmalı
    exec('fontSize', p.size);
    emit('doc-painter', { stage: 'apply', sticky: !!p.sticky });
  }
  page.addEventListener('mouseup', () => { if (painter && !getSelection().isCollapsed) setTimeout(applyPainter, 0); });
  body.addEventListener('dblclick', (e) => {
    if (!e.target.closest('.wd-painter')) return;
    if (!painter) pickPainter();
    if (!painter) return;
    painter.sticky = true;
    $('.wd-painter').classList.add('on', 'lock');
    emit('doc-painter', { stage: 'pick', sticky: true });
  });

  // ---- Bul ve değiştir ----
  const findBox = $('.wd-find'), fq = $('.wd-fq'), rq = $('.wd-rq');
  let fpos = null; // son bulunan yerin sonu
  // Bul kutusu ve yazım denetimi paneli şeridin altında, sayfanın üst köşesinde dursun (şerit düğmelerini ve paletleri örtmesin)
  function placeFloats() {
    const sc = $('.wd-scroll');
    for (const el of [findBox, $('.wd-spane')]) {
      if (el.hidden || !el.offsetParent) continue;
      el.style.top = (sc.getBoundingClientRect().top - el.offsetParent.getBoundingClientRect().top + 6) + 'px';
    }
  }
  function openFind(repl) {
    findBox.hidden = false;
    placeFloats();
    findBox.classList.toggle('repl', !!repl);
    const sel = getSelection().toString();
    if (sel && sel.length < 40 && page.contains(getSelection().anchorNode)) fq.value = sel;
    (repl && fq.value ? rq : fq).focus();
    fq.select();
    emit('doc-find-open', { replace: !!repl });
  }
  function textNodes() {
    const w = document.createTreeWalker(page, NodeFilter.SHOW_TEXT), out = [];
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  }
  function findNext(fromStart) {
    const q = fq.value.toLocaleLowerCase('tr');
    if (!q) return false;
    const nodes = textNodes();
    let started = fromStart || !fpos;
    for (let pass = 0; pass < 2; pass++) {
      for (const n of nodes) {
        let from = 0;
        if (!started) { if (n !== fpos.node) continue; started = true; from = fpos.end; }
        const i = n.textContent.toLocaleLowerCase('tr').indexOf(q, from);
        if (i >= 0) {
          const r = document.createRange();
          r.setStart(n, i); r.setEnd(n, i + q.length);
          const s = getSelection(); s.removeAllRanges(); s.addRange(r);
          range = r.cloneRange();
          fpos = { node: n, end: i + q.length };
          n.parentElement.scrollIntoView({ block: 'nearest' });
          $('.wd-fn').textContent = '';
          return true;
        }
      }
      started = true; fpos = null; // sona gelince baştan ara
    }
    $('.wd-fn').textContent = 'Bulunamadı';
    return false;
  }
  // Cümle başındaki büyük harf korunur: “Bahçe” → “Bostan”
  const caseLike = (found, rep) => (found[0] !== found[0].toLocaleLowerCase('tr') ? rep.charAt(0).toLocaleUpperCase('tr') + rep.slice(1) : rep);
  function replaceOne() {
    const s = getSelection();
    if (s.toString().toLocaleLowerCase('tr') === fq.value.toLocaleLowerCase('tr') && fq.value) {
      document.execCommand('insertText', false, caseLike(s.toString(), rq.value));
      fpos = { node: s.anchorNode, end: s.anchorOffset };
      changed();
      emit('doc-replace', { from: fq.value, to: rq.value, count: 1 });
    }
    findNext();
  }
  function replaceAll() {
    const q = fq.value.toLocaleLowerCase('tr');
    if (!q) return;
    let count = 0;
    for (const n of textNodes()) {
      const low = n.textContent.toLocaleLowerCase('tr');
      if (!low.includes(q)) continue;
      let out = '', i = 0, j;
      while ((j = low.indexOf(q, i)) >= 0) { out += n.textContent.slice(i, j) + caseLike(n.textContent.slice(j, j + q.length), rq.value); i = j + q.length; count++; }
      n.textContent = out + n.textContent.slice(i);
    }
    fpos = null;
    $('.wd-fn').textContent = `${count} değişiklik`;
    if (count) changed();
    desk.toast('Tümünü değiştir', `${count} değişiklik yapıldı.`, '⇄', 3000);
    emit('doc-replace', { from: fq.value, to: rq.value, count, all: true });
    emit('doc-format', { cmd: 'replace' });
  }
  fq.addEventListener('input', () => { fpos = null; $('.wd-fn').textContent = ''; });
  findBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (e.target === rq) replaceOne(); else if (findNext()) emit('doc-find', { q: fq.value }); }
    if (e.key === 'Escape') { e.preventDefault(); findBox.hidden = true; page.focus(); }
  });
  findBox.addEventListener('click', (e) => {
    const f = e.target.closest('[data-f]')?.dataset.f;
    if (f === 'next') { if (findNext()) emit('doc-find', { q: fq.value }); }
    else if (f === 'repl') replaceOne();
    else if (f === 'all') replaceAll();
    else if (f === 'close') { findBox.hidden = true; page.focus(); }
  });

  // ---- Yazım denetimi ----
  const spane = $('.wd-spane');
  function markSpelling() {
    page.querySelectorAll('.wd-sp').forEach((s) => s.replaceWith(...s.childNodes));
    page.normalize();
    const re = new RegExp(`(^|[^\\p{L}])(${Object.keys(SPELL).join('|')})(?=$|[^\\p{L}])`, 'giu');
    for (const n of textNodes()) {
      const txt = n.textContent;
      const parts = [];
      let last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(txt))) {
        const st = m.index + m[1].length;
        parts.push(txt.slice(last, st), [txt.substr(st, m[2].length)]);
        last = st + m[2].length;
      }
      if (!parts.length) continue;
      parts.push(txt.slice(last));
      n.replaceWith(...parts.map((x) => {
        if (typeof x === 'string') return document.createTextNode(x);
        const sp = document.createElement('span');
        sp.className = 'wd-sp';
        sp.textContent = x[0];
        return sp;
      }));
    }
    return [...page.querySelectorAll('.wd-sp')];
  }
  const suggest = (w) => { const low = w.toLocaleLowerCase('tr'); const s = SPELL[low] || ''; return w[0] !== w[0].toLocaleLowerCase('tr') ? s.charAt(0).toLocaleUpperCase('tr') + s.slice(1) : s; };
  function fixWord(sp) {
    const fixed = suggest(sp.textContent);
    sp.replaceWith(document.createTextNode(fixed));
    page.normalize();
    changed();
    emit('doc-spell-fix', { word: fixed });
    emit('doc-format', { cmd: 'spell' });
  }
  function spellCheck() {
    const errs = markSpelling();
    emit('doc-spell', { count: errs.length });
    if (!errs.length) { spane.hidden = true; desk.toast('Yazım denetimi', 'Yazım denetimi tamamlandı. Hata bulunamadı. ✔', 'ABC', 3000); return; }
    spane.innerHTML = `<div class="wd-sph"><b>Yazım denetimi</b><button type="button" data-sp="close" title="Kapat">✕</button></div><p>${errs.length} yazım hatası bulundu:</p>
      ${errs.map((sp, i) => `<div class="wd-spr"><s>${esc(sp.textContent)}</s> → <b>${esc(suggest(sp.textContent))}</b><button type="button" data-sp="${i}">Değiştir</button></div>`).join('')}
      <button type="button" data-sp="all" class="wd-spall">Tümünü değiştir</button><button type="button" data-sp="ignore">Yoksay</button>`;
    spane.hidden = false;
    placeFloats();
    errs[0].scrollIntoView({ block: 'nearest' });
  }
  spane.addEventListener('click', (e) => {
    const k = e.target.closest('[data-sp]')?.dataset.sp;
    if (k === undefined) return;
    const errs = [...page.querySelectorAll('.wd-sp')];
    if (k === 'close' || k === 'ignore') { spane.hidden = true; if (k === 'ignore') { errs.forEach((s) => s.replaceWith(...s.childNodes)); page.normalize(); } return; }
    if (k === 'all') errs.forEach(fixWord); else if (errs[+k]) fixWord(errs[+k]);
    if (page.querySelector('.wd-sp')) spellCheck(); else { spane.hidden = true; desk.toast('Yazım denetimi', 'Bütün hatalar düzeltildi. ✔', 'ABC', 2500); }
  });
  // Kırmızı dalgalı çizgili kelimeye sağ tık: öneri menüsü (Word'deki gibi)
  page.addEventListener('contextmenu', (e) => {
    const sp = e.target.closest('.wd-sp');
    if (!sp) return;
    e.preventDefault();
    desk.menu(e.clientX, e.clientY, [{ cmd: 'fix', label: `<b>${esc(suggest(sp.textContent))}</b>`, bold: true }, '-', { cmd: 'ignore', label: 'Yoksay' }],
      (c) => { if (c === 'fix') fixWord(sp); else { sp.replaceWith(...sp.childNodes); page.normalize(); } }, 'spell', { word: sp.textContent });
  });

  // ---- Sözcük sayısı ----
  function wordCount() {
    const t = page.innerText;
    const paras = [...page.children].filter((b) => b.innerText?.trim()).length;
    desk.dialogs.ask({ title: 'Sözcük Sayısı', icon: '123', text: `<table class="wd-wc"><tr><td>Sayfa</td><td>${pageCount()}</td></tr><tr><td>Sözcük</td><td>${countWords()}</td></tr><tr><td>Karakter (boşluksuz)</td><td>${t.replace(/\s/g, '').length}</td></tr><tr><td>Karakter (boşluklarla)</td><td>${t.replace(/\n/g, '').length}</td></tr><tr><td>Paragraf</td><td>${paras}</td></tr></table>`, buttons: [['ok', 'Kapat', true]] });
    emit('doc-count', { words: countWords() });
  }

  // ---- Düzen: kenar boşlukları, yönlendirme, sütunlar ----
  // quiet: belge açılırken (dosyadaki düzen yüklenir, değişiklik sayılmaz)
  function setLayout(l, quiet) {
    if (quiet) Object.assign(layout, DEF_LAYOUT, l || {}); else Object.assign(layout, l);
    page.style.padding = MARGINS[layout.margin][2];
    page.classList.toggle('yatay', layout.orient === 'yatay');
    $('.wd-scroll').classList.toggle('yatay', layout.orient === 'yatay');
    page.style.columnCount = layout.cols > 1 ? layout.cols : '';
    page.classList.toggle('bordered', layout.border === 'kutu');
    page.classList.toggle('bordered2', layout.border === 'cift');
    page.dataset.wm = layout.wm || '';
    body.querySelectorAll('[data-border]').forEach((b) => b.classList.toggle('on', b.dataset.border === layout.border));
    body.querySelectorAll('[data-wm]').forEach((b) => b.classList.toggle('on', b.dataset.wm === (layout.wm || '')));
    body.querySelectorAll('[data-margin]').forEach((b) => b.classList.toggle('on', b.dataset.margin === layout.margin));
    body.querySelectorAll('[data-orient]').forEach((b) => b.classList.toggle('on', b.dataset.orient === layout.orient));
    body.querySelectorAll('[data-cols]').forEach((b) => b.classList.toggle('on', +b.dataset.cols === layout.cols));
    if (!quiet) { changed(); emit('doc-layout', { ...layout }); }
  }

  // ---- Yakınlaştırma ----
  let zoom = 100;
  function setZoom(z) {
    zoom = Math.max(50, Math.min(200, z));
    page.style.zoom = zoom / 100;
    $('.wd-ruler').style.zoom = zoom / 100;
    $('.wd-zr').value = zoom;
    $('.wd-zoom b').textContent = `%${zoom}`;
    layoutTabs();
    emit('doc-zoom', { zoom });
  }
  $('.wd-zr').addEventListener('input', (e) => setZoom(+e.target.value));
  $('.wd-rulerchk').addEventListener('change', (e) => { $('.wd-ruler').hidden = !e.target.checked; emit('doc-ruler', { on: e.target.checked }); });
  $('.wd-scroll').addEventListener('wheel', (e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); setZoom(zoom + (e.deltaY < 0 ? 10 : -10)); }, { passive: false });

  // ---- Postalar: adres mektup birleştirme ----
  // Alıcı listesi: hesap tablosunun 1. satırı sütun adları, altındaki her dolu satır bir kişi
  let mm = null; // { name, cols, rows, preview, idx }
  async function pickList() {
    const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder: 'docs', ext: '.xlsx', typeLabel: 'Hesap tablosu (*.xlsx)', accept: /\.xlsx$/i });
    if (!r) return;
    const cells = desk.fs.find(r.folder, r.name)?.content?.cells || {};
    const cols = [];
    for (const c of 'ABCDEFGH') { if (!cells[c + '1']) break; cols.push([c, String(cells[c + '1']).trim()]); }
    const rows = [];
    for (let i = 2; i < 60; i++) { if (!cols.some(([c]) => cells[c + i])) break; rows.push(Object.fromEntries(cols.map(([c, nm]) => [nm, String(cells[c + i] ?? '')]))); }
    if (!cols.length || !rows.length) { desk.toast('Liste boş', 'Hesap tablosunun 1. satırında sütun adları (Ad, Adres…), altında kişiler olmalı.', '⚠', 6000); return; }
    mm = { name: r.name, cols: cols.map((x) => x[1]), rows, preview: false, idx: 0 };
    renderMM();
    emit('merge-list', { name: r.name, count: rows.length, columns: mm.cols });
  }
  function renderMM() {
    const on = !!mm;
    $('.wd-mmcount').textContent = on ? `${mm.name} · ${mm.rows.length} kişi` : '';
    $('.wd-fieldbtn').disabled = !on;
    $('.wd-finbtn').disabled = !on;
    body.querySelectorAll('[data-mm="preview"], [data-mm="prev"], [data-mm="next"]').forEach((b) => { b.disabled = !on; });
    $('[data-mm="preview"]').classList.toggle('on', !!mm?.preview);
    $('.wd-mmrec').textContent = mm?.preview ? `${mm.idx + 1} / ${mm.rows.length}` : '';
    $('.wd-fields').innerHTML = on ? mm.cols.map((c) => `<button type="button" data-field="${esc(c)}">«${esc(c)}»</button>`).join('') : '';
    const rec = mm?.preview && mm.rows[mm.idx];
    page.querySelectorAll('.wd-field').forEach((x) => { x.textContent = rec ? rec[x.dataset.field] ?? '' : `«${x.dataset.field}»`; x.classList.toggle('pv', !!rec); });
  }
  const mergeHtml = (rec) => {
    const c = page.cloneNode(true);
    c.querySelectorAll('.wd-field').forEach((x) => x.replaceWith(document.createTextNode(rec[x.dataset.field] ?? '')));
    c.querySelectorAll('.wd-sp, mark.wd-hit').forEach((x) => x.replaceWith(...x.childNodes));
    return c.innerHTML;
  };
  async function finishMerge(mode) {
    if (!mm) { desk.toast('Önce alıcılar', 'Postalar → <b>Alıcıları seç</b> ile kişi listesini seçin.', '⚠', 5000); return; }
    if (!page.querySelector('.wd-field')) { desk.toast('Alan yok', 'Önce mektuba en az bir birleştirme alanı (ör. «Ad») ekleyin.', '⚠', 5000); return; }
    const count = mm.rows.length;
    if (mode === 'edit') {
      const w = desk.open('word', { merged: { html: mm.rows.map(mergeHtml).join('<hr class="wd-pb"><p><br></p>'), layout: { ...layout }, header: hdr.hidden ? '' : hdr.innerHTML } });
      emit('merge-finish', { mode, count, win: w?.id });
    } else {
      const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: `${count} mektup (${mm.name})` });
      if (!r) return;
      desk.toast('Yazdırılıyor', `${count} ayrı mektup → ${esc(r.printer)}`, '🖨');
      emit('merge-finish', { mode, count, printer: r.printer });
    }
  }
  function mergeClick(t) {
    if (t.classList.contains('wd-fieldbtn') || t.classList.contains('wd-finbtn') || t.classList.contains('wd-casebtn')) { const p = t.nextElementSibling; const open = p.hidden; body.querySelectorAll('.wd-mpop').forEach((x) => { x.hidden = true; }); p.hidden = !open; return true; }
    if (t.dataset.field) { $('.wd-fields').hidden = true; insertHtml(`<span class="wd-field" contenteditable="false" data-field="${esc(t.dataset.field)}">«${esc(t.dataset.field)}»</span>&nbsp;`, 'field'); renderMM(); emit('merge-field', { field: t.dataset.field }); return true; }
    const k = t.dataset.mm;
    if (!k) return false;
    if (k === 'list') { pickList(); return true; }
    if (!mm) return true;
    if (k === 'preview') { mm.preview = !mm.preview; renderMM(); emit('merge-preview', { on: mm.preview, index: mm.idx }); }
    if (k === 'prev' || k === 'next') { mm.preview = true; mm.idx = (mm.idx + (k === 'next' ? 1 : -1) + mm.rows.length) % mm.rows.length; renderMM(); emit('merge-preview', { on: true, index: mm.idx }); }
    if (k === 'edit' || k === 'print') { $('.wd-fin').hidden = true; finishMerge(k); }
    return true;
  }

  // ---- Olaylar ----
  body.addEventListener('mousedown', (e) => {
    // Araç çubuğundaki düğmeler sayfadaki seçimi bozmasın (açılır listeler ve kutular hariç)
    if (e.target.closest('.wd-rib button, .wd-tabs button')) e.preventDefault();
    if (!e.target.closest('.wd-menu, .wd-file')) $('.wd-menu').hidden = true;
    if (!e.target.closest('.wd-colorwrap')) body.querySelectorAll('.wd-pal, .wd-lpop').forEach((x) => { x.hidden = true; });
    if (!e.target.closest('.wd-tpop, .wd-table')) $('.wd-tpop').hidden = true;
    if (!e.target.closest('.wd-mmwrap')) body.querySelectorAll('.wd-mpop').forEach((x) => { x.hidden = true; });
    if (!e.target.closest('.wd-tabpop, .wd-tabsbtn')) $('.wd-tabpop').hidden = true;
  });
  body.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) {
      body.querySelectorAll('.wd-tabs [data-tab]').forEach((b) => b.classList.toggle('on', b === t));
      body.querySelectorAll('.wd-rib').forEach((r) => { r.hidden = r.dataset.tab !== t.dataset.tab; });
      placeFloats();
      emit('doc-tab', { tab: t.dataset.tab });
      return;
    }
    if (t.classList.contains('wd-file')) { $('.wd-menu').hidden = !$('.wd-menu').hidden; return; }
    if (t.dataset.file) return fileCmd(t.dataset.file);
    if (t.dataset.cmd) return exec(t.dataset.cmd);
    if (t.dataset.case) { t.closest('.wd-mpop').hidden = true; return changeCase(t.dataset.case); }
    if (mergeClick(t)) return;
    if (t.dataset.clip) return clipCmd(t.dataset.clip);
    if (t.classList.contains('wd-painter')) { if (painter) { const was = painter.sticky; stopPainter(); if (was) emit('doc-painter', { stage: 'stop' }); } else pickPainter(); return; }
    if (t.dataset.style) return setStyle(t.dataset.style);
    if (t.classList.contains('wd-findbtn')) return openFind(false);
    if (t.classList.contains('wd-replbtn')) return openFind(true);
    if (t.dataset.tb) return tableOp(t.dataset.tb);
    if (t.dataset.margin) return setLayout({ margin: t.dataset.margin });
    if (t.dataset.orient) return setLayout({ orient: t.dataset.orient });
    if (t.dataset.cols) return setCols(+t.dataset.cols);
    if (t.dataset.border) return setLayout({ border: t.dataset.border });
    if (t.dataset.wm !== undefined) return setLayout({ wm: t.dataset.wm });
    if (t.classList.contains('wd-spell')) return spellCheck();
    if (t.classList.contains('wd-count')) return wordCount();
    if (t.dataset.zoom) return setZoom(zoom + +t.dataset.zoom);
    const pal = (sel) => { const p = $(sel); const was = p.hidden; body.querySelectorAll('.wd-pal, .wd-lpop').forEach((x) => { x.hidden = true; }); p.hidden = !was; };
    if (t.classList.contains('wd-hilite')) return pal('.wd-hpal');
    if (t.dataset.hilite) { $('.wd-hpal').hidden = true; if (t.dataset.hilite !== 'transparent') $('.wd-hilite i').style.background = t.dataset.hilite; return exec('hiliteColor', t.dataset.hilite); }
    if (t.classList.contains('wd-sym')) return pal('.wd-spal');
    if (t.dataset.sym) { $('.wd-spal').hidden = true; return insertHtml(esc(t.dataset.sym), 'symbol'); }
    if (t.classList.contains('wd-link')) { if (t.closest('.wd-rib').hidden) $('.wd-tabs [data-tab="insert"]').click(); pal('.wd-lpop'); // Ctrl + K başka sekmedeyken de çalışsın
      setTimeout(() => $('.wd-lurl').focus(), 0); return; }
    if (t.classList.contains('wd-lok')) {
      const u = $('.wd-lurl').value.trim();
      $('.wd-lpop').hidden = true;
      if (!u) return;
      const sel = range && !range.collapsed ? range.toString() : u;
      $('.wd-lurl').value = '';
      insertHtml(`<a href="https://${esc(u.replace(/^https?:\/\//, ''))}" title="Ctrl + tık: bağlantıyı aç">${esc(sel)}</a>&nbsp;`, 'link');
      emit('doc-link', { url: u.replace(/^https?:\/\//, ''), text: sel });
      return;
    }
    if (t.classList.contains('wd-fnbtn')) return addFootnote();
    if (t.classList.contains('wd-tocbtn')) return insertToc();
    if (t.classList.contains('wd-tocupd')) return updateToc();
    if (t.classList.contains('wd-tabsbtn')) { body.querySelectorAll('.wd-pal, .wd-lpop').forEach((x) => { x.hidden = true; }); $('.wd-tabpop').hidden = !$('.wd-tabpop').hidden; return; }
    if (t.classList.contains('wd-tabok')) return setTabStop(false);
    if (t.classList.contains('wd-tabclr')) return setTabStop(true);
    if (t.classList.contains('wd-bordbtn')) return pal('.wd-bpal');
    if (t.dataset.pborder) { $('.wd-bpal').hidden = true; return paraBorder(t.dataset.pborder); }
    if (t.classList.contains('wd-shadebtn')) return pal('.wd-gpal');
    if (t.dataset.shade) { $('.wd-gpal').hidden = true; if (t.dataset.shade !== 'transparent') $('.wd-shadebtn i').style.background = t.dataset.shade; return paraShade(t.dataset.shade); }
    if (t.classList.contains('wd-pb')) return insertHtml('<hr class="wd-pb"><p><br></p>', 'pagebreak');
    if (t.classList.contains('wd-hdrbtn')) return showHF('h');
    if (t.classList.contains('wd-ftrbtn')) return showHF('f');
    if (t.classList.contains('wd-pnbtn')) return showHF('pn');
    if (t.classList.contains('wd-color')) return pal('.wd-pal:not(.wd-hpal):not(.wd-spal)');
    if (t.dataset.color) { body.querySelectorAll('.wd-pal').forEach((x) => { x.hidden = true; }); $('.wd-color i').style.background = t.dataset.color; return exec('foreColor', t.dataset.color); }
    if (t.classList.contains('wd-table')) { $('.wd-tpop').hidden = !$('.wd-tpop').hidden; return; }
    if (t.classList.contains('wd-tok')) {
      const r = Math.min(10, Math.max(1, +$('.wd-tr').value || 3)), c = Math.min(6, Math.max(1, +$('.wd-tc').value || 3));
      $('.wd-tpop').hidden = true;
      return insertHtml(`<table class="wd-t">${`<tr>${'<td><br></td>'.repeat(c)}</tr>`.repeat(r)}</table><p><br></p>`, 'table');
    }
    if (t.classList.contains('wd-shbtn')) return pal('.wd-shpal');
    if (t.dataset.shape) {
      $('.wd-shpal').hidden = true;
      // İmleç bir şeklin içindeyse (içine yazı yazılmışsa) yeni şekil onun İÇİNE değil, dışına, sonrasına eklenir
      const cur = range && (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement)?.closest('.wd-shape');
      if (cur && page.contains(cur)) { range = document.createRange(); range.setStartAfter(cur); range.collapse(true); }
      return insertHtml(`<span class="wd-shape wd-sh-${t.dataset.shape}" contenteditable="true">Yazınız</span>&nbsp;`, 'shape'); }
    if (t.classList.contains('wd-pic')) return insertPicture();
    if (t.classList.contains('wd-date')) return insertHtml(esc(today()), 'date');
  });
  $('.wd-font').addEventListener('change', (e) => exec('fontName', e.target.value));
  $('.wd-size').addEventListener('change', (e) => exec('fontSize', +e.target.value));
  $('.wd-lh').addEventListener('change', (e) => setSpacing(e.target.value));
  $('.wd-lurl').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('.wd-lok').click(); } });
  // Üç tık: yalnızca tıklanan paragraf seçilir (tarayıcı kendi başına sonraki boş paragrafı da seçerdi; Ctrl + E ikisini de ortalardı)
  page.addEventListener('mousedown', (e) => {
    if (e.detail !== 3 || e.button !== 0 || e.target.closest('.wd-shape, td')) return;
    const blk = blockOf(e.target);
    if (!blk || !/^(P|H[1-6]|LI|BLOCKQUOTE|DIV)$/.test(blk.tagName)) return;
    e.preventDefault();
    const r = document.createRange();
    r.selectNodeContents(blk);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  });
  // Bağlantıya Ctrl + tık: tarayıcıda açılır
  page.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { desk.open('browser', { url: a.getAttribute('href').replace(/^https?:\/\//, '') }); emit('doc-link-open'); }
  });

  page.addEventListener('input', () => { changed(); emit('doc-input', { text: page.innerText }); });
  fns.addEventListener('input', (e) => {
    const li = e.target.closest('li');
    changed();
    if (li) emit('doc-fn-text', { n: [...fnList.children].indexOf(li) + 1, text: li.innerText.trim() });
  });
  fns.addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || ''); });
  for (const [el, k] of [[hdr, 'header'], [ftxt, 'footer']]) {
    el.addEventListener('input', () => { changed(); emit('doc-hf', { which: k, text: el.innerText.trim() }); });
    el.addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') || ''); });
  }
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
      } else if (s.rangeCount && blockOf(s.anchorNode)?.dataset.tabs) {
        insertTab(); // sekme durağı olan paragrafta Tab, durağa kadar boşluk (ya da öncü çizgisi) bırakır
      } else {
        // Paragrafın en başında Tab: ilk satır girintisi (paragraf başı); başka yerde boşluk
        const blk = s.rangeCount && blockOf(s.anchorNode);
        const r0 = s.rangeCount && s.getRangeAt(0);
        let atStart = false;
        if (blk && r0?.collapsed && blk.tagName !== 'LI') { const pre = document.createRange(); pre.selectNodeContents(blk); pre.setEnd(r0.startContainer, r0.startOffset); atStart = !pre.toString().trim(); }
        if (atStart && !e.shiftKey) { blk.style.textIndent = '1.25cm'; changed(); emit('doc-indent', { kind: 'first', text: blk.innerText.trim().slice(0, 40) }); }
        else if (atStart && e.shiftKey) { blk.style.textIndent = ''; changed(); emit('doc-indent', { kind: 'first-off' }); }
        else document.execCommand('insertText', false, '    ');
      }
      return;
    }
    if (e.key === 'Escape' && painter) { e.preventDefault(); const was = painter.sticky; stopPainter(); if (was) emit('doc-painter', { stage: 'stop' }); return; }
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyF') { e.preventDefault(); addFootnote(); return; }
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const map = { KeyB: 'bold', KeyI: 'italic', KeyU: 'underline', KeyL: 'justifyLeft', KeyE: 'justifyCenter', KeyR: 'justifyRight', KeyJ: 'justifyFull' };
    if (map[e.code]) { e.preventDefault(); exec(map[e.code]); emit('doc-shortcut', { cmd: map[e.code] }); return; }
    if (e.code === 'KeyS') { e.preventDefault(); save(e.shiftKey); }
    if (e.code === 'KeyP') { e.preventDefault(); fileCmd('print'); }
    if (e.code === 'KeyO') { e.preventDefault(); fileCmd('open'); }
    if (e.code === 'KeyF') { e.preventDefault(); openFind(false); }
    if (e.code === 'KeyH') { e.preventDefault(); openFind(true); }
    if (e.code === 'KeyK') { e.preventDefault(); $('.wd-link').click(); }
    if (e.key === 'Enter') { e.preventDefault(); insertHtml('<hr class="wd-pb"><p><br></p>', 'pagebreak'); }
  });
  body.addEventListener('keydown', (e) => { if (e.key === 'F7') { e.preventDefault(); spellCheck(); } });
  document.execCommand('defaultParagraphSeparator', false, 'p');
  title();

  return {
    page,
    // Derslerin kontrolü için: her paragrafın yazısı, hizası, kalınlığı, boyutu ve rengi
    info() {
      // Tarayıcı bazen listeyi paragrafın içine koyar (<p><ul>…</ul></p>); öyle bir paragraf yerine içindeki liste sayılır
      const isList = (x) => x.tagName === 'UL' || x.tagName === 'OL';
      const tops = [...page.children].flatMap((b) => (b.classList.contains('wd-cols') ? [...b.children] : [b])).flatMap((b) => (!isList(b) && [...b.children].some(isList) ? [...b.children].filter(isList) : [b]));
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
          cols: b.parentElement?.classList.contains('wd-cols') ? +b.parentElement.style.columnCount : 0,
          border: b.dataset?.pborder || '', shade: b.style?.backgroundColor || '', tabStop: b.dataset?.tabs || '', tabs: b.querySelectorAll('.wd-tab').length,
        };
      });
      return {
        pages: pageCount(), shapes: page.querySelectorAll('.wd-shape').length,
        table: (() => { const t = page.querySelector('table'); return t && { rows: t.rows.length, cols: Math.max(...[...t.rows].map((r) => r.cells.length)), merged: [...t.querySelectorAll('td')].some((c) => c.colSpan > 1), thick: t.classList.contains('thick'), valign: [...t.querySelectorAll('td')].some((c) => c.style.verticalAlign === 'middle') }; })(),
        blocks, text: page.innerText, tables: page.querySelectorAll('table').length, images: page.querySelectorAll('img').length, pics: pics.info(), fileName, dirty,
        fields: [...page.querySelectorAll('.wd-field')].map((x) => x.dataset.field), merge: mm && { list: mm.name, count: mm.rows.length, preview: mm.preview },
        ruler: !$('.wd-ruler').hidden, links: page.querySelectorAll('a[href]').length, pageBreaks: page.querySelectorAll('hr.wd-pb').length, spellErrors: page.querySelectorAll('.wd-sp').length,
        styles: tops.map((b) => (b.classList?.contains('wd-title') ? 'title' : b.tagName.toLowerCase())), layout: { ...layout }, zoom,
        header: hdr.hidden ? '' : hdr.innerText.trim(), footer: ftr.hidden ? '' : ftxt.innerText.trim(), pageNum: !pn.hidden, footnotes: fnInfo(),
        toc: page.querySelector('.wd-toc') ? tocInfo() : null, headings: headings().map((h) => ({ text: h.innerText.trim(), page: pageOf(h) })),
        linkList: [...page.querySelectorAll('a[href]')].map((a) => ({ url: a.getAttribute('href').replace(/^https?:\/\//, ''), text: a.innerText.trim() })),
      };
    },
    confirmClose: confirmDiscard,
    focus: () => { if (!desk.dialogs.busy) page.focus({ preventScroll: true }); },
  };
}
