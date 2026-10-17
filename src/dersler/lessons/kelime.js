// 10. hafta: kelime işlemci (Word benzeri). MEB Bilgisayar İşletmeni programının “Microsoft Word” ünitesine göre:
// belge açma, metin girişi, biçimlendirme, hizalama, tarih ekleme, kaydetme, yazdırma; liste, tablo, resim, renk, PDF;
// stiller (başlıklar), bul ve değiştir, yazım denetimi, vurgu rengi, kenar boşlukları, sözcük sayısı.
import { K, desktopReady, maxed, norm } from './common.js';

const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], text: '', tables: 0, images: 0 };
const block = (c, word) => info(c).blocks.find((b) => norm(b.text).includes(norm(word)));
const wordOpen = (c) => maxed(c, 'word');
// Biçim adımları: belge her değiştiğinde koşula bakılır
const formatEvents = ['doc-format', 'doc-input', 'doc-shortcut', 'doc-insert', 'doc-cell'];
const when = (test) => (ev, c) => formatEvents.includes(ev.type) && !!test(c);

const today = () => new Date().toLocaleDateString('tr-TR');

export const dilekce = {
  id: 'dilekce', icon: '📘', title: 'Kelime işlemci: dilekçe yazalım', minutes: 40, stage: 'desktop',
  desc: 'Yazı yazmak, kalın, ortalama, yazı boyutu, kaydetme ve yazdırma.',
  summary: [
    ['Ctrl + B', 'Kalın (K düğmesi)'],
    ['Ctrl + I / Ctrl + U', 'İtalik / altı çizili'],
    ['Ctrl + E', 'Ortala'],
    ['Ctrl + J', 'İki yana yasla (dilekçe ve mektup paragrafları)'],
    ['Ctrl + R / Ctrl + L', 'Sağa / sola hizala'],
    ['Yazı boyutu', 'Giriş sekmesindeki sayı kutusu (11 → 14)'],
    ['Üç tık', 'Bütün paragrafı seçer'],
    ['Ctrl + S / Ctrl + P', 'Kaydet / yazdır'],
  ],
  steps: [
    {
      title: 'Kelime işlemci nedir?',
      html: `<p>Not Defteri yalnızca düz yazı yazar. <b>Kelime işlemci</b> (en bilineni Microsoft Word) ise yazıyı <b>biçimlendirir</b>: kalın, büyük, ortalı başlıklar; renkler, listeler, tablolar ve resimler.</p>
        <p>Dilekçe, mektup, özgeçmiş, ilan, davetiye… hepsi kelime işlemciyle hazırlanır.</p>
        <p>Bu derste mahalle muhtarlığına bir <b>dilekçe</b> yazacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Programı açın',
      html: '<p>⊞ <b>Başlat</b>\'a tıklayın ve <b>📘 Kelime İşlemci</b>\'yi açın. (Başlat\'ı açıp <b>kelime</b> yazmak da olur.)</p>',
      mouse: '🖱 Başlat → Kelime İşlemci',
      check: (c) => !!c.d.find('word'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'word',
      done: 'Beyaz alan bir <b>sayfadır</b>; yazdırınca kâğıtta da böyle görünür. Üstteki şeritte biçimlendirme düğmeleri var.',
    },
    {
      title: 'Başlığı yazın',
      html: `<p>Sayfaya tıklayın ve büyük harflerle başlığı yazın (${K('Caps Lock')} açın, sonra kapatmayı unutmayın). Sonra ${K('Enter')}.</p>`,
      target: 'ÇİÇEK MAHALLESİ MUHTARLIĞINA',
      setup: wordOpen,
      hint: 'Büyük İ, Ş\'nin yanındaki tuştur. Ğ için P\'nin sağındaki tuş.',
      // Belge iki boş paragrafla açılır: başlık hangisine yazılırsa yazılsın, altında yeni bir paragraf (Enter) olması yeter
      on: when((c) => { const b = info(c).blocks, i = b.findIndex((x) => norm(x.text).includes('muhtarlığına')); return i >= 0 && b.length > i + 1; }),
      done: 'Başlık yazıldı. Şimdi onu biçimlendireceğiz.',
    },
    {
      title: 'Kalın yapın',
      html: `<ol class="steps"><li>Başlığın üzerine <b>hızlıca üç kez</b> tıklayın: bütün satır seçilir (mavi olur).</li><li>Şeritteki <b>K</b> düğmesine tıklayın ya da ${K('Ctrl', 'B')}.</li></ol>`,
      combo: ['Ctrl', 'KeyB'],
      hint: 'Seçmek için fareyle satırın başından sonuna sürükleyebilirsiniz de. Seçili yazı mavi görünür.',
      check: (c) => block(c, 'muhtarlığına')?.bold,
      on: when((c) => block(c, 'muhtarlığına')?.bold),
      done: 'Kalın yazı, başlıkların ve önemli kelimelerin göze çarpmasını sağlar. Word\'de bu düğme <b>B</b> harfiyle de görünebilir.',
    },
    {
      title: 'Ortalayın',
      html: `<p>Başlık hâlâ seçiliyken <b>Ortala</b> düğmesine (ortadaki çizgiler) tıklayın ya da ${K('Ctrl', 'E')}.</p>`,
      combo: ['Ctrl', 'KeyE'],
      hint: 'Hizalama düğmeleri yan yana dört tanedir: sola, ortaya, sağa, iki yana. İkincisi ortalar.',
      check: (c) => block(c, 'muhtarlığına')?.align === 'center',
      on: when((c) => block(c, 'muhtarlığına')?.align === 'center'),
      done: 'Dilekçelerde makam adı (kime yazıldığı) ortada yazılır.',
    },
    {
      title: 'Yazıyı büyütün',
      html: '<p>Başlık seçiliyken şeritteki <b>11</b> yazan kutuya tıklayın ve <b>14</b>\'ü seçin.</p>',
      mouse: '🖱 Boyut kutusu → 14',
      hint: 'Seçim kaybolduysa başlığa yeniden üç kez tıklayın.',
      check: (c) => block(c, 'muhtarlığına')?.size >= 14,
      on: when((c) => block(c, 'muhtarlığına')?.size >= 14),
      done: 'Yazı boyutu “punto” ile ölçülür. Normal yazı 11–12 punto, başlıklar 14–16 punto olur.',
    },
    {
      title: 'Dilekçenin metni',
      html: `<p>Başlığın altındaki boş satıra tıklayın ve metni yazın. İki cümle aynı paragrafta, sonra ${K('Enter')} ile yeni satıra son cümle:</p>
        <div class="target">Mahallemizdeki parkın aydınlatma lambaları bir aydır yanmamaktadır. Akşamları park karanlık olduğu için kimse parkı kullanamamaktadır.</div><div class="target">Gereğinin yapılmasını saygılarımla arz ederim.</div>`,
      hint: 'Satır sonuna gelince Enter\'a basmayın: kelime işlemci yazıyı kendisi alt satıra geçirir. Enter yalnızca yeni paragraf için.',
      on: when((c) => block(c, 'aydınlatma') && block(c, 'arz ederim')),
      done: 'Kelime işlemcide satır sonunda Enter\'a basmak gerekmez; yazı kendiliğinden alt satıra akar.',
    },
    {
      title: 'İki yana yaslayın',
      html: `<p>“Mahallemizdeki parkın…” paragrafına üç kez tıklayıp seçin ve <b>İki yana yasla</b> düğmesine (dördüncü hizalama düğmesi) tıklayın ya da ${K('Ctrl', 'J')}.</p>`,
      combo: ['Ctrl', 'KeyJ'],
      check: (c) => block(c, 'aydınlatma')?.align === 'justify',
      on: when((c) => block(c, 'aydınlatma')?.align === 'justify'),
      done: 'Paragrafın iki kenarı da düz oldu. Resmî yazılarda paragraflar böyle yazılır.',
    },
    {
      title: 'Tarih ve ad',
      html: `<ol class="steps"><li>Son satırın sonuna tıklayın, ${K('Enter')} ile yeni satıra geçin.</li><li>Üstteki <b>Ekle</b> sekmesine, sonra <b>📅 Tarih</b>\'e tıklayın.</li><li>${K('Enter')}, sonra adınızı ve soyadınızı yazın.</li>
        <li>Tarih ve ad satırlarını fareyle sürükleyerek seçin, <b>Giriş</b> sekmesinden <b>Sağa hizala</b> (${K('Ctrl', 'R')}).</li></ol>`,
      hint: 'Dilekçede tarih ve imza sağ alta yazılır. İki satırı birlikte seçmek için tarihin başından adınızın sonuna kadar sürükleyin.',
      on: when((c) => {
        const b = info(c).blocks.filter((x) => x.text);
        const i = b.findIndex((x) => x.text.includes(today()));
        return i >= 0 && b[i].align === 'right' && b.slice(i + 1).some((x) => x.align === 'right' && /\p{L}{2,}/u.test(x.text));
      }),
      done: 'Dilekçeniz hazır! Sağ alta imza da atılır.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')}\'ye basın (ya da <b>Dosya → Kaydet</b>). Açılan pencerede <b>Belgeler</b> klasörüne <b>dilekçe</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev, c) => {
        if (ev.type !== 'doc-save') return false;
        if (!/dilek/i.test(ev.name)) { c.note(`“${ev.name}” adıyla kaydedildi. Ders için adı <b>dilekçe</b> olsun: Dosya → Farklı kaydet.`); return false; }
        return true;
      },
      done: 'Word belgelerinin uzantısı <b>.docx</b>\'tir. Dosya Gezgini\'nde mavi 📘 simgesiyle görünür.',
    },
    {
      title: 'Yazdırın',
      html: `<p>${K('Ctrl', 'P')}\'ye basın (ya da <b>Dosya → Yazdır</b>), yazıcıyı seçip <b>🖨 Yazdır</b>\'a tıklayın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'doc-print',
      done: 'Yazdır\'a bastınız. Gerçek yazıcı seçiliyse kâğıda çıkar; “PDF olarak kaydet” seçiliyse dosya olarak kaydedilir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk belgenizi hazırladınız:</p>' },
  ],
};

export const belgeEkle = {
  id: 'belge-ekle', icon: '▦', title: 'Kelime işlemci: liste, tablo, resim', minutes: 40, stage: 'desktop',
  desc: 'Tablo ekleyip doldurmak, madde işaretli liste, resim, PDF olarak kaydetme.',
  summary: [
    ['Ekle → Tablo', 'Satır ve sütun sayısını seçip tablo ekler'],
    ['Tab', 'Tabloda bir sonraki hücreye geçer (Shift + Tab: geri)'],
    ['• ≡ Madde işaretleri', 'Alt alta liste; Enter yeni madde, iki kez Enter listeyi bitirir'],
    ['1. ≡ Numaralandırma', 'Sıralı adımlar için numaralı liste'],
    ['A (renkli çizgi)', 'Yazı rengi'],
    ['Ekle → Resim', 'Bilgisayardaki bir fotoğrafı belgeye koyar'],
    ['Dosya → PDF olarak kaydet', 'Değiştirilemeyen, her yerde aynı görünen kopya (e-postayla göndermek için)'],
  ],
  steps: [
    {
      title: 'Ne hazırlayacağız?',
      html: `<p>Bu derste bir <b>ilaç çizelgesi</b> hazırlayacağız: başlık, ilaçların saatlerini gösteren bir tablo, doktora sorulacakların listesi ve bir resim.</p>
        <p>Bunun için şeritteki <b>Ekle</b> sekmesini kullanacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word'); },
    },
    {
      title: 'Başlık',
      html: `<p>Sayfaya <b>İLAÇ ÇİZELGEM</b> yazıp ${K('Enter')}\'a basın. Sonra başlığı seçip kalın (${K('Ctrl', 'B')}) ve ortalı (${K('Ctrl', 'E')}) yapın.</p>`,
      setup: wordOpen,
      hint: 'Başlığı seçmek için üzerine üç kez tıklayın.',
      check: (c) => { const b = block(c, 'çizelgem'); return b?.bold && b.align === 'center'; },
      on: when((c) => { const b = block(c, 'çizelgem'); return b?.bold && b.align === 'center'; }),
      done: 'Geçen dersteki biçimlendirmeyi hatırladınız.',
    },
    {
      title: 'Başlığa renk verin',
      html: '<p>Başlık seçiliyken şeritteki renkli çizgili <b>A</b> düğmesine tıklayın ve bir renk seçin (örneğin mavi).</p>',
      mouse: '🖱 A → renk',
      check: (c) => block(c, 'çizelgem')?.colors.some((x) => x !== 'rgb(0, 0, 0)'),
      on: when((c) => block(c, 'çizelgem')?.colors.some((x) => x !== 'rgb(0, 0, 0)')),
      done: 'Renk başlığı öne çıkarır. Ama metnin tamamını renkli yazmak okumayı zorlaştırır; az kullanın.',
    },
    {
      title: 'Tablo ekleyin',
      html: '<p>Başlığın altındaki boş satıra tıklayın. Üstte <b>Ekle</b> sekmesine, sonra <b>▦ Tablo</b>\'ya tıklayın. <b>3 satır, 3 sütun</b> bırakıp <b>Ekle</b> deyin.</p>',
      mouse: '🖱 Ekle → Tablo',
      check: (c) => info(c).tables > 0,
      on: when((c) => info(c).tables > 0),
      done: 'Tablo eklendi. Her kutuya <b>hücre</b> denir.',
    },
    {
      title: 'Tabloyu doldurun',
      html: `<p>İlk hücreye tıklayın ve tabloyu doldurun. Bir hücreden sonrakine geçmek için ${K('Tab')} tuşuna basın:</p>
        <table class="sum"><tr><th>İlaç</th><th>Sabah</th><th>Akşam</th></tr><tr><td>Tansiyon</td><td>1</td><td>-</td></tr><tr><td>Vitamin</td><td>-</td><td>1</td></tr></table>`,
      combo: ['Tab'],
      hint: 'Tab sağdaki hücreye, satır sonunda bir alt satırın başına geçer. Yanlış hücreye yazdıysanız Shift + Tab geri götürür.',
      on: when((c) => { const t = norm(info(c).text); return ['ilaç', 'sabah', 'akşam', 'tansiyon', 'vitamin'].every((w) => t.includes(w)); }),
      done: 'Tablolar, bilgiyi satır ve sütunlara düzenli koymanın en kolay yoludur.',
    },
    {
      title: 'Madde işaretli liste',
      html: `<ol class="steps"><li>Tablonun altındaki boş satıra tıklayın ve <b>Doktora sorulacaklar:</b> yazıp ${K('Enter')}.</li><li><b>Giriş</b> sekmesinde <b>• ≡</b> (madde işaretleri) düğmesine tıklayın.</li>
        <li>Her satıra bir soru yazıp ${K('Enter')}\'a basın: <b>Tansiyon ilacı aç karnına mı?</b> · <b>Vitamin ne kadar sürecek?</b></li></ol>`,
      hint: 'Listeyi bitirmek için boş maddede bir kez daha Enter\'a basın.',
      on: when((c) => info(c).blocks.some((b) => b.tag === 'UL' && b.items.filter(Boolean).length >= 2)),
      done: 'Madde işaretleri alt alta sıralanan şeyleri okumayı kolaylaştırır.',
    },
    {
      title: 'Resim ekleyin',
      html: '<p>Belgenin sonuna tıklayın. <b>Ekle → 🖼 Resim</b>\'e tıklayın, <b>Resimler</b> klasöründen <b>çiçekler.jpg</b>\'yi seçip <b>Aç</b>\'a basın.</p>',
      mouse: '🖱 Ekle → Resim',
      check: (c) => info(c).images > 0,
      on: when((c) => info(c).images > 0),
      done: 'Resim belgeye eklendi.',
    },
    {
      title: 'PDF olarak kaydedin',
      html: '<p><b>Dosya</b> menüsünden <b>📕 PDF olarak kaydet</b>\'i seçin ve <b>Belgeler</b>\'e <b>ilaç çizelgesi</b> adıyla kaydedin.</p>',
      mouse: '🖱 Dosya → PDF olarak kaydet',
      on: (ev) => ev.type === 'doc-pdf',
      done: 'PDF dosyası her bilgisayarda ve telefonda aynı görünür, kolayca değiştirilemez. E-postayla göndermek için en uygun biçimdir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kelime işlemcinin Ekle sekmesini öğrendiniz:</p>' },
  ],
};

// Hazır bülten: başlıksız, yazım hatalı; ders boyunca düzenlenir
const BULTEN = `<p>Mahalle Bülteni</p><p>Yeni parkımız</p><p>Herkez cumartesi sabahı parkın açılışına davetlidir. Açılışta çocuklar için oyunlar, büyükler için çay ikramı olacak.</p>
<p>Bahçe günü</p><p>Malesef geçen hafta yağmur yüzünden yapılamayan bahçe günü bu pazar yapılacak. Bahçe günü saat 10.00'da başlayacak; eldiven ve şapka getirmeyi unutmayın.</p>
<p>Duyurular</p><p>Muhtarlık şuan yeni adresinde, caminin karşısında hizmet veriyor.</p>`;
const HEADS = ['yeni parkımız', 'günü', 'duyurular'];
const docEvents = [...formatEvents, 'doc-style', 'doc-replace', 'doc-spell-fix', 'doc-layout'];
const whenDoc = (test) => (ev, c) => docEvents.includes(ev.type) && !!test(c);

export const belgeDuzen = {
  id: 'belge-duzen', icon: '📰', title: 'Kelime işlemci: başlıklar, bul-değiştir, yazım denetimi', minutes: 40, stage: 'desktop',
  desc: 'Bülteni düzenlemek: stiller, Bul ve Değiştir, yazım denetimi, kenar boşlukları.',
  summary: [
    ['Giriş → Stiller', 'Normal, Başlık 1, Başlık 2, Konu Başlığı: tek tıkla hazır başlık biçimi'],
    ['Ctrl + F', 'Bul: belgede bir kelimeyi bulur'],
    ['Ctrl + H', 'Değiştir: bir kelimeyi başka kelimeyle değiştirir (Tümünü değiştir)'],
    ['F7 / Gözden Geçir → Yazım denetimi', 'Kırmızı dalgalı çizgili kelimeleri düzeltir'],
    ['Sağ tık (kırmızı çizgili kelime)', 'Doğru yazılışını önerir'],
    ['🖍 Vurgu rengi', 'Fosforlu kalem gibi yazının arkasını boyar'],
    ['Düzen → Kenar boşlukları', 'Sayfanın kenarındaki boşluk (Dar: sayfaya daha çok yazı sığar)'],
    ['Gözden Geçir → Sözcük sayısı', 'Sayfa, sözcük ve karakter sayısı'],
  ],
  steps: [
    {
      title: 'Hazır bir belgeyi düzenleyelim',
      html: `<p>Bu derste yazmak yerine <b>düzenleyeceğiz</b>. Yandaki mahalle bülteni yazılmış ama düz yazı gibi: başlıklar belli değil, yazım hataları var.</p>
        <p>Kelime işlemcinin <b>stilleri</b>, <b>bul-değiştir</b> ve <b>yazım denetimi</b> araçlarıyla dakikalar içinde düzelteceğiz.</p>`,
      setup: (c) => {
        desktopReady(c);
        c.d.closeAll();
        const n = c.d.fs.write('docs', 'Bülten.docx', { html: BULTEN });
        maxed(c, 'word', { node: n.id });
      },
    },
    {
      title: 'Konu başlığı',
      html: '<p>İlk satıra (<b>Mahalle Bülteni</b>) tıklayın. <b>Giriş</b> sekmesindeki <b>Stiller</b> kutularından <b>Konu Başlığı</b>\'na tıklayın.</p>',
      mouse: '🖱 İlk satır → Konu Başlığı',
      hint: 'Stil bütün paragrafa uygulanır; satırı seçmeniz gerekmez, içine tıklamak yeter.',
      check: (c) => info(c).styles?.[0] === 'title',
      on: whenDoc((c) => info(c).styles?.[0] === 'title'),
      done: 'Tek tıkla büyük, ince, altı çizgili bir başlık oldu. Yazı tipini, boyutunu ve rengini tek tek ayarlamak gerekmedi.',
    },
    {
      title: 'Ara başlıklar',
      html: '<p>Aynı şekilde <b>Yeni parkımız</b>, <b>Bahçe günü</b> ve <b>Duyurular</b> satırlarının her birine tıklayıp <b>Başlık 1</b> stilini verin.</p>',
      mouse: '🖱 Satıra tık → Başlık 1 (üç kez)',
      on: whenDoc((c) => HEADS.every((h) => { const b = info(c).blocks.find((x) => norm(x.text).endsWith(h) && x.text.length < 25); return b?.tag === 'H1'; })),
      done: 'Belgenin iskeleti belli oldu: okuyan kişi başlıklara bakarak istediği bölümü hemen bulur. Uzun belgelerde içindekiler tablosu da bu başlıklardan yapılır.',
    },
    {
      title: 'Bul ve değiştir',
      html: `<p>Bahçe günü artık <b>fidan şenliği</b> olacak. Belgedeki bütün “bahçe günü” yazılarını tek tek düzeltmek yerine:</p>
        <ol class="steps"><li>${K('Ctrl', 'H')}\'ye basın (ya da Giriş → <b>⇄ Değiştir</b>).</li><li><b>Aranan</b>: bahçe günü &nbsp; <b>Yeni</b>: fidan şenliği</li><li><b>Tümünü değiştir</b>\'e tıklayın.</li><li>Sonra kutunun köşesindeki <b>✕</b>\'e basarak <b>Bul ve Değiştir</b> kutusunu kapatın.</li></ol>`,
      combo: ['Ctrl', 'KeyH'],
      on: (ev, c) => {
        if (ev.type !== 'doc-replace') return false;
        if (!ev.all) { c.note('Tek tek değiştirmek de olur; ama <b>Tümünü değiştir</b> hepsini birden yapar.'); return !/bahçe günü/i.test(info(c).text); }
        return /bahçe/i.test(ev.from) && ev.count >= 3;
      },
      done: 'Kelime işlemci hepsini bir anda değiştirdi; cümle başındaki büyük harf de korundu. Kaç değişiklik yapıldığını sağ alttaki bildirim söyledi. Bul ve Değiştir kutusunu ✕ ile kapatın; sonraki adımda yazının üstünü örtmesin.',
    },
    {
      title: 'Yazım denetimi',
      html: `<p>Üstteki <b>Gözden Geçir</b> sekmesine geçin ve <b>ABC✓ Yazım denetimi</b>\'ne tıklayın (ya da ${K('F7')}). Hatalı kelimelerin altı kırmızı dalgalı çizilir.</p>
        <p>Açılan kutuda her hatanın yanındaki <b>Değiştir</b>\'e ya da <b>Tümünü değiştir</b>\'e tıklayın.</p>`,
      mouse: '🖱 Gözden Geçir → Yazım denetimi → Değiştir',
      hint: 'Kırmızı çizgili kelimeye sağ tıklayınca da doğrusu önerilir.',
      on: whenDoc((c) => { const t = norm(info(c).text); return !/herkez|malesef|şuan/.test(t) && t.includes('herkes') && t.includes('maalesef'); }),
      done: 'Bu üç hata (herkez, malesef, şuan) en sık yapılan yazım yanlışlarındandır. Doğruları: <b>herkes</b>, <b>maalesef</b>, <b>şu an</b>.',
    },
    {
      title: 'Önemli yeri boyayın',
      html: `<ol class="steps"><li><b>Giriş</b> sekmesine dönün.</li><li><b>bu pazar</b> kelimelerini fareyle sürükleyerek seçin.</li><li>Şeritteki <b>🖍</b> (metin vurgu rengi) düğmesinden <b>sarı</b>\'yı seçin.</li></ol>`,
      mouse: '🖱 “bu pazar”ı seçin → 🖍 → Sarı',
      setup: (c) => { c.d.find('word')?.el.querySelector('.wd-find:not([hidden]) [data-f="close"]')?.click(); },
      on: whenDoc((c) => [...(W(c)?.page.querySelectorAll('[style*="background"]') || [])].some((s) => /pazar/i.test(s.textContent) && !/transparent|rgba\(0, 0, 0, 0\)/.test(s.style.backgroundColor))),
      done: 'Fosforlu kalem gibi: okuyanın gözü önce oraya gider. Az kullanın; her yer boyalıysa hiçbir yer önemli görünmez.',
    },
    {
      title: 'Kenar boşlukları',
      html: '<p><b>Düzen</b> sekmesine geçin ve <b>Kenar boşlukları: Dar</b>\'a tıklayın. Sayfanın kenarlarına bakın.</p>',
      mouse: '🖱 Düzen → Dar',
      on: (ev) => ev.type === 'doc-layout' && ev.margin === 'dar',
      done: 'Kenarlar daraldı, satırlar uzadı: sayfaya daha çok yazı sığar. İlan ve bültenlerde Dar, resmî yazılarda Normal kullanılır. Aynı yerden sayfayı <b>Yatay</b> da çevirebilirsiniz.',
    },
    {
      title: 'Sözcük sayısı',
      html: '<p><b>Gözden Geçir → 123 Sözcük sayısı</b>\'na tıklayın. Belgede kaç sözcük var?</p>',
      mouse: '🖱 Gözden Geçir → Sözcük sayısı',
      on: (ev) => ev.type === 'doc-count',
      done: 'Sözcük sayısı ödev, dilekçe ya da ilan yazarken “en fazla 200 kelime” gibi sınırlar için kullanılır. Sayfanın en altındaki mavi çubukta da yazar.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin. Belge zaten <b>Bülten.docx</b> adıyla kayıtlı olduğu için bu sefer soru sorulmaz.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'Kaydedildi. Başlığın başındaki * işareti kayboldu: “kaydedilmemiş değişiklik yok” demektir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Belgeyi düzenlemeyi öğrendiniz:</p>' },
  ],
};
