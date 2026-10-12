// 10. hafta: kelime işlemci (Word benzeri). MEB Bilgisayar İşletmeni programının “Microsoft Word” ünitesine göre:
// belge açma, metin girişi, biçimlendirme, hizalama, tarih ekleme, kaydetme, yazdırma; liste, tablo, resim, renk, PDF.
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
  desc: 'Kelime işlemciyi açmak, yazı yazmak, kalın, ortalama, yazı boyutu, iki yana yaslama, tarih ekleme, kaydetme ve yazdırma.',
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
      on: when((c) => { const b = info(c).blocks; return b.length >= 2 && norm(b[0].text).includes('muhtarlığına'); }),
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
      done: 'Dilekçeniz yazıcıya gönderildi.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk belgenizi hazırladınız:</p>' },
  ],
};

export const belgeEkle = {
  id: 'belge-ekle', icon: '▦', title: 'Kelime işlemci: liste, tablo, resim', minutes: 40, stage: 'desktop',
  desc: 'Ekle sekmesi: tablo ekleyip doldurmak (Tab ile hücreden hücreye), madde işaretli liste, yazı rengi, resim ekleme, PDF olarak kaydetme.',
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
