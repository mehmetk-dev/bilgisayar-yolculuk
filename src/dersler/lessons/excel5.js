// 11. hafta ek dersi: yazı işlevleri ve sayfa koruma. Dağınık yazılmış komşu listesini YAZIM.DÜZENİ, BÜYÜKHARF,
// KÜÇÜKHARF ve BİRLEŞTİR (ya da &) ile düzeltmek; YUVARLA ile kuruşu yuvarlamak; yalnızca “Ödendi mi?” sütunu
// değişebilsin diye hücre kilidini açıp sayfayı parolayla korumak.
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || {};
const has = (c, a, re) => re.test(String(cell(c, a).raw).toLocaleUpperCase('tr'));
const DOSYA = 'komşu listesi.xlsx';
const KISI = [['ayşe', 'yılmaz', 'AYSE58@ORNEK.COM'], ['MEHMET', 'demir', 'Mehmet.Demir@Ornek.com'], ['fatma nur', 'KAYA', 'FATMA.KAYA@ornek.COM'], ['hasan', 'şahin', 'hasan.sahin@ORNEK.com']];
function tablo() {
  const cells = { A1: 'Ad', B1: 'Soyad', C1: 'E-posta', D1: 'Ad (düzgün)', E1: 'Soyad (büyük)', F1: 'Ad Soyad', G1: 'E-posta (küçük)', H1: 'Ödendi mi?' };
  KISI.forEach(([a, s, e], i) => { cells['A' + (i + 2)] = a; cells['B' + (i + 2)] = s; cells['C' + (i + 2)] = e; });
  Object.assign(cells, { A8: 'Kalorifer gideri', B8: '12500', A9: 'Daire sayısı', B9: '7', A10: 'Daire başına' });
  const fmt = {};
  'ABCDEFGH'.split('').forEach((k) => { fmt[k + '1'] = { b: true }; });
  fmt.A8 = { b: true }; fmt.A9 = { b: true }; fmt.A10 = { b: true };
  return { cells, fmt, colW: { 0: 11, 2: 17, 3: 10, 4: 10, 5: 14, 6: 17, 7: 9 } };
}

export const excelYazi = {
  id: 'excel-yazi-koruma', icon: '🔤', title: 'Yazı işlevleri, YUVARLA ve sayfayı koruma', minutes: 35, stage: 'desktop',
  desc: 'Dağınık yazılmış adları YAZIM.DÜZENİ, BÜYÜKHARF, KÜÇÜKHARF ve BİRLEŞTİR ile düzeltmek; YUVARLA; hücre kilidini açıp sayfayı korumak.',
  summary: [
    ['=YAZIM.DÜZENİ(A2)', 'Her sözcüğün ilk harfi büyük: “fatma nur” → “Fatma Nur”'],
    ['=BÜYÜKHARF(B2)', 'Hepsi büyük: “yılmaz” → “YILMAZ” (Türkçe i/İ doğru çevrilir)'],
    ['=KÜÇÜKHARF(C2)', 'Hepsi küçük: e-posta adresleri için'],
    ['=BİRLEŞTİR(D2;" ";E2)', 'Hücreleri yan yana ekler; araya boşluk için " " yazılır'],
    ['=D2&" "&E2', 'BİRLEŞTİR ile aynı iş: & işareti (Shift + 6)'],
    ['=YUVARLA(B8/B9;2)', 'Sonucu 2 basamağa (kuruşa) yuvarlar; 0 yazılırsa tam liraya'],
    ['🔓 Hücre Kilidini Aç', 'Koruma açıkken de yazılabilecek hücreler'],
    ['🔒 Sayfayı Koru', 'Öteki hücreler değiştirilemez; parola verirseniz bir yere yazın'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', tablo()); },
  steps: [
    {
      title: 'Dağınık bir liste',
      html: `<p>Apartman yöneticisi olarak komşuların listesini tutuyorsunuz. Ama adlar kimi zaman <b>BÜYÜK</b>, kimi zaman <b>küçük</b> harfle yazılmış; e-postalar karmakarışık.</p>
        <p>Her hücreyi elle düzeltmek yerine <b>yazı işlevleri</b> kullanacağız; sonra kuruşlu bir hesabı <b>YUVARLA</b>yacak ve listeyi yanlışlıkla bozulmasın diye <b>koruyacağız</b>.</p>
        <p class="mut">Türkçe Excel'de işlevin içindeki parçalar <b>noktalı virgül (;)</b> ile ayrılır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'YAZIM.DÜZENİ',
      html: `<p><b>D2</b> hücresine tıklayın ve şunu yazıp ${K('Enter')}: <b>=YAZIM.DÜZENİ(A2)</b></p>`,
      target: '=YAZIM.DÜZENİ(A2)',
      hint: 'Formül = ile başlar. YAZIM ile DÜZENİ arasında nokta var. Küçük harfle yazsanız da olur.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'D2' && has(c, 'D2', /YAZIM\.D[ÜU]ZEN[İI]\(A2\)/) && cell(c, 'D2').text === 'Ayşe',
      done: '“ayşe” → <b>Ayşe</b>. İlk harf büyüdü, kalanı küçüldü.',
    },
    {
      title: 'BÜYÜKHARF',
      html: `<p><b>E2</b> hücresine <b>=BÜYÜKHARF(B2)</b> yazıp ${K('Enter')}. Soyadlar resmî yazılarda çoğu zaman büyük harfle yazılır.</p>`,
      target: '=BÜYÜKHARF(B2)',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'E2' && cell(c, 'E2').text === 'YILMAZ',
      done: '“yılmaz” → <b>YILMAZ</b>. Türkçe harfler (ı → I, i → İ) doğru çevrildi.',
    },
    {
      title: 'BİRLEŞTİR',
      html: `<p><b>F2</b> hücresine adı ve soyadı yan yana getirelim: <b>=BİRLEŞTİR(D2;" ";E2)</b> yazıp ${K('Enter')}.</p>
        <p class="mut">Ortadaki <b>" "</b> iki tırnak arasında bir boşluktur: ad ile soyad bitişik olmasın diye. Tırnak (") klavyenin sol üstünde, 1'in solundaki tuştur.</p>`,
      target: '=BİRLEŞTİR(D2;" ";E2)',
      hint: 'D2 ile E2 arasına noktalı virgül, boşluk için iki tırnağın arasına bir boşluk koyun.',
      on: (ev, c) => {
        if (ev.type !== 'xl-edit' || ev.addr !== 'F2') return false;
        if (cell(c, 'F2').text === 'AyşeYILMAZ') { c.note('Ad ve soyad bitişik çıktı. Araya " " (tırnak içinde boşluk) ekleyin.'); return false; }
        return cell(c, 'F2').text === 'Ayşe YILMAZ';
      },
      done: '<b>Ayşe YILMAZ</b>. BİRLEŞTİR, istediğiniz kadar parçayı sırayla yan yana ekler.',
    },
    {
      title: 'KÜÇÜKHARF',
      html: `<p><b>G2</b> hücresine <b>=KÜÇÜKHARF(C2)</b> yazıp ${K('Enter')}. E-posta adresleri küçük harfle yazılır.</p>`,
      target: '=KÜÇÜKHARF(C2)',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'G2' && cell(c, 'G2').text === 'ayse58@ornek.com',
      done: 'Adres <b>ayse58@ornek.com</b> oldu. Dikkat: Türkçe kurala göre büyük <b>I</b> küçülünce <b>ı</b> olur; adreste I harfi varsa sonucu kontrol edin.',
    },
    {
      title: 'Aşağı doldurun',
      html: `<p><b>D2</b>'den <b>G2</b>'ye kadar dört hücreyi fareyle seçin; seçimin sağ alt köşesindeki küçük kareyi (doldurma tutamacı) <b>5. satıra</b> kadar aşağı çekin.</p>`,
      hint: `Ya da D2:G5 alanını seçip ${K('Ctrl', 'D')} (aşağı doldur).`,
      on: (ev, c) => ['D5', 'E5', 'F5', 'G5'].every((a) => cell(c, a).raw) && cell(c, 'F5').text === 'Hasan ŞAHİN',
      check: (c) => cell(c, 'F5').text === 'Hasan ŞAHİN',
      done: 'Dört kişinin adı, soyadı ve adresi düzeldi. “fatma nur” bile <b>Fatma Nur</b> oldu.',
    },
    {
      title: '& ile birleştirmek',
      html: `<p>Aynı işi <b>&</b> işaretiyle de yapabilirsiniz (${K('Shift', '6')}). <b>F3</b> hücresine tıklayıp <b>=D3&" "&E3</b> yazın, ${K('Enter')}.</p>`,
      target: '=D3&" "&E3',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'F3' && /&/.test(cell(c, 'F3').raw) && cell(c, 'F3').text === 'Mehmet DEMİR',
      done: 'Sonuç aynı: <b>Mehmet DEMİR</b>. Kısa birleştirmelerde & daha pratiktir.',
    },
    {
      title: 'Kuruşlu bölme',
      html: `<p>Kalorifer gideri 12.500 ₺, 7 daireye bölünecek. <b>B10</b> hücresine <b>=B8/B9</b> yazıp ${K('Enter')}. Sonuca bakın.</p>`,
      target: '=B8/B9',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B10' && Math.abs(cell(c, 'B10').value - 12500 / 7) < 0.01,
      done: '1785,714286… Kuruşun da küçüğü çıktı; makbuza böyle yazılmaz.',
    },
    {
      title: 'YUVARLA',
      html: `<p><b>B10</b>'a yeniden tıklayıp üstüne <b>=YUVARLA(B8/B9;2)</b> yazın, ${K('Enter')}. Sondaki <b>2</b>, virgülden sonra kaç basamak kalacağıdır.</p>`,
      target: '=YUVARLA(B8/B9;2)',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B10' && has(c, 'B10', /YUVARLA/) && cell(c, 'B10').value === 1785.71,
      done: '<b>1785,71</b>. <b>;0</b> yazsaydınız tam liraya (1786) yuvarlanırdı. Hücreyi ₺ biçimine çevirmek yalnızca görünüşü değiştirir; YUVARLA ise sayının kendisini yuvarlar.',
    },
    {
      title: 'Hücre kilidini açın',
      html: `<p>Listeyi komşulara gösterirken kimse adları bozmasın; yalnızca <b>Ödendi mi?</b> sütunu doldurulabilsin istiyoruz.</p>
        <p><b>H2</b>'den <b>H5</b>'e kadar seçin ve üstteki <b>🔓 Hücre Kilidini Aç</b>'a basın.</p>`,
      on: (ev, c) => ev.type === 'xl-unlock' && ev.open && ['H2', 'H3', 'H4', 'H5'].every((a) => X(c).unlocked(a)),
      done: 'Bu dört hücre, sayfa korunsa da değiştirilebilecek.',
    },
    {
      title: 'Sayfayı koruyun',
      html: '<p><b>🔒 Sayfayı Koru</b>\'ya basın. Parola kutusuna <b>Kermes2026</b> yazıp <b>Koru</b>.</p>',
      hint: 'Gerçek hayatta parolayı unutmamak için bir yere yazın; unutursanız korumayı kaldıramazsınız.',
      on: (ev) => ev.type === 'xl-protect' && ev.on,
      done: 'Sayfa korunuyor. Açık yeşil hücreler dışında hiçbir şey değiştirilemez.',
    },
    {
      title: 'Deneyin',
      html: '<p><b>A2</b> hücresine tıklayıp bir harf yazmayı deneyin. Ne oluyor? Çıkan uyarıyı <b>Tamam</b> ile kapatın.</p>',
      on: (ev) => ev.type === 'xl-locked',
      done: 'Korunan hücre değiştirilemedi. Yanlışlıkla silmelere karşı iyi bir önlem.',
    },
    {
      title: 'İzin verilen hücre',
      html: `<p><b>H2</b> hücresine <b>Evet</b> yazıp ${K('Enter')}.</p>`,
      on: (ev) => ev.type === 'xl-edit' && ev.addr === 'H2' && /evet/i.test(ev.raw),
      done: 'Kilidini açtığınız hücreye yazılabildi.',
    },
    {
      title: 'Korumayı kaldırın',
      html: '<p>Listeyi yeniden düzenlemek için <b>🔓 Sayfa Korumasını Kaldır</b>\'a basın, parolayı (<b>Kermes2026</b>) yazıp <b>Korumayı kaldır</b>.</p>',
      on: (ev, c) => {
        if (ev.type === 'xl-protect-err') c.note('Parola yanlış. Korurken yazdığınız parolayı yazın: Kermes2026');
        return ev.type === 'xl-protect' && !ev.on;
      },
      done: 'Koruma kalktı; artık bütün hücreler yeniden düzenlenebilir.',
    },
    rehberSoru({
      title: 'Sayfa koruması ne işe yarar?',
      html: '<p>Sayfa koruması için hangisi doğrudur?</p>',
      opts: ['Hücrelerin yanlışlıkla değiştirilmesini önler; dosyayı açan herkes yine de içini görebilir', 'Dosyayı şifreler, kimse açıp okuyamaz', 'Virüslere karşı korur'], ok: 0,
      wrong: 'Sayfa koruması yalnızca değiştirmeyi engeller; dosyayı gizlemez.',
      why: 'Doğru. Gizli bilgi (T.C. numaraları, banka bilgileri) içeren bir listeyi paylaşmayın; koruma yalnızca yanlışlıkla bozulmayı önler.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Yazı işlevleri ve koruma:</p>' },
  ],
};
