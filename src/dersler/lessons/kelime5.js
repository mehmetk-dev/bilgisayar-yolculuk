// 10. hafta ek dersi: uzun belge (MEB Kelime İşlemci). Numaralandırma (araya madde ekleyince numaralar kayar),
// Başlık 1 stili, Başvurular → İçindekiler Tablosu, sayfa sonundan sonra Tabloyu Güncelleştir, yeni başlık ve
// Ctrl + tık ile başlığa gitmek. Kursiyer el kitabı üzerinde.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const DOSYA = 'kursiyer el kitabı.docx';
const HTML = `<h1 class="wd-title">Kursiyer El Kitabı</h1>
<p>Çınar Halk Eğitim Merkezi · Bilgisayar İşletmenliği Kursu</p>
<p><br></p>
<p>Kursa kayıt</p>
<p>Kayıt için şu belgeleri getirin:</p>
<p>Kimlik kartı fotokopisi</p>
<p>Diploma fotokopisi</p>
<p>İki adet vesikalık fotoğraf</p>
<p>Ders saatleri</p>
<p>Dersler pazartesi, çarşamba ve cuma günleri 14.00 ile 16.00 arasında yapılır. Her ders 40 dakikadır; derslerin arasında 10 dakika ara verilir.</p>
<p>Devam zorunluluğu</p>
<p>Kursa düzenli devam etmeniz gerekir. Devamsızlık sınırını kurs öğretmeninize sorun; gelemeyeceğiniz günleri önceden bildirin.</p>
<p>Sınav ve belge</p>
<p>Kurs sonunda bilgisayar başında uygulamalı bir sınav yapılır. Başarılı olanlara kurs bitirme belgesi verilir.</p>`;
const BASLIK = ['Kursa kayıt', 'Ders saatleri', 'Devam zorunluluğu', 'Sınav ve belge'];
const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], headings: [], toc: null };
const liste = (c) => info(c).blocks.find((b) => b.tag === 'OL');
const numarali = (c) => { const l = liste(c); return !!l && ['kimlik', 'diploma', 'vesikalık'].every((w) => l.items.some((x) => norm(x).includes(w))); };
const yeniMadde = (c) => { const it = liste(c)?.items || []; return it.length >= 4 && norm(it[1]).includes('diploma') && it[2].length >= 5 && norm(it[3]).includes('vesikalık'); };
const h1 = (c, t) => info(c).blocks.some((b) => b.tag === 'H1' && norm(b.text) === norm(t));
const toc = (c) => info(c).toc || [];
const sayfa = (c, t) => info(c).headings.find((h) => norm(h.text) === norm(t))?.page || 0;
const docEv = ['doc-style', 'doc-format', 'doc-input', 'doc-shortcut'];

export const kelimeIcindekiler = {
  id: 'kelime-icindekiler', icon: '📑', title: 'Uzun belge: numaralandırma, başlıklar ve içindekiler tablosu', minutes: 35, stage: 'desktop',
  desc: 'Numaralı liste yapmak ve araya madde eklemek; başlıklara Başlık 1 stili verip Başvurular → İçindekiler Tablosu eklemek, sayfalar kayınca tabloyu güncelleştirmek.',
  summary: [
    ['1. ≡ Numaralandırma', 'Satırları seçip basın: 1, 2, 3 diye sıralanır. Araya madde eklenince numaralar kendiliğinden kayar'],
    ['Giriş → Stiller → Başlık 1', 'Satırı başlık yapar. İçindekiler tablosu yalnızca başlık stilli satırları görür'],
    ['Başvurular → İçindekiler Tablosu', 'Başlıkları sayfa numaralarıyla listeler'],
    ['⟳ Tabloyu Güncelleştir', 'Başlık eklendiyse ya da sayfalar kaydıysa tabloyu yeniler; kendiliğinden yenilenmez'],
    [K('Ctrl', 'Enter'), 'Sayfa sonu: içindekiler tek başına ilk sayfada kalsın'],
    [K('Ctrl') + ' + tık', 'İçindekiler satırına tıklayınca o başlığa gider'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', { html: HTML }); },
  steps: [
    {
      title: 'Kursiyer el kitabı',
      html: `<p>Kurs için birkaç sayfalık bir <b>el kitabı</b> hazırlanmış. Yazılar tamam ama düzensiz: başlıklar sıradan satır gibi, belgeler alt alta yazılmış.</p>
        <p>Bu derste numaralı liste yapacak, başlıklara <b>Başlık 1</b> stili verecek ve belgenin başına Word'ün kendisinin hazırladığı bir <b>içindekiler tablosu</b> ekleyeceğiz. Ödevlerde, raporlarda ve MEB sınavında sık istenir.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'Numaralandırma',
      html: `<p><b>Kimlik kartı fotokopisi</b>, <b>Diploma fotokopisi</b> ve <b>İki adet vesikalık fotoğraf</b> satırlarını fareyle sürükleyerek <b>birlikte</b> seçin.</p>
        <p>Sonra <b>Giriş</b> sekmesinde <b>1. ≡ Numaralandırma</b> düğmesine basın.</p>`,
      mouse: '🖱 Üç satırı seçin → 1. ≡',
      hint: '“Kimlik” sözcüğünün soluna basılı tutun, “fotoğraf” sözcüğünün sonuna kadar sürükleyip bırakın. Madde işaretleri (• ≡) düğmesi bunun hemen solundadır.',
      check: numarali,
      on: (ev, c) => docEv.includes(ev.type) && numarali(c),
      done: 'Üç satır <b>1, 2, 3</b> diye numaralandı. Sırası önemli olan şeylerde (yapılacak adımlar, istenen belgeler) numara, sırası önemsiz olanlarda madde işareti (•) kullanılır.',
    },
    {
      title: 'Araya madde ekleyin',
      html: `<p>Bir belge unutulmuş. <b>Diploma fotokopisi</b> satırının <b>sonuna</b> tıklayın, ${K('Enter')}'a basın ve <b>Yerleşim yeri belgesi</b> yazın.</p>`,
      target: 'Yerleşim yeri belgesi',
      hint: 'Satırın sonuna tıklayın (ya da satıra tıklayıp End tuşuna basın), sonra Enter. Yeni satırın başında 3 çıkar.',
      check: yeniMadde,
      on: (ev, c) => docEv.includes(ev.type) && yeniMadde(c),
      done: 'Yeni madde <b>3</b> oldu, fotoğraflar kendiliğinden <b>4</b>\'e kaydı. Numaraları elle yazsaydınız hepsini tek tek düzeltmeniz gerekirdi.',
    },
    {
      title: 'Başlık 1',
      html: '<p><b>Kursa kayıt</b> satırına bir kez tıklayın. <b>Giriş</b> sekmesinin sağındaki <b>Stiller</b> bölümünde <b>Başlık 1</b>\'e basın.</p>',
      hint: 'Satırı seçmeniz gerekmez; imlecin o satırda olması yeter. Stil bütün satıra uygulanır.',
      check: (c) => h1(c, 'Kursa kayıt'),
      on: (ev, c) => ev.type === 'doc-style' && h1(c, 'Kursa kayıt'),
      done: 'Satır mavi ve büyük oldu. Ama asıl önemlisi görünüşü değil: Word artık bunun bir <b>başlık</b> olduğunu biliyor.',
    },
    {
      title: 'Öteki başlıklar',
      html: `<p>Aynı şeyi öteki üç başlığa yapın: <b>Ders saatleri</b>, <b>Devam zorunluluğu</b> ve <b>Sınav ve belge</b> satırlarına sırayla tıklayıp <b>Başlık 1</b>\'e basın.</p>`,
      hint: 'Her başlık için: satıra tıklayın → Başlık 1. Yanlış satıra verdiyseniz o satıra tıklayıp Normal\'e basın.',
      check: (c) => BASLIK.every((t) => h1(c, t)),
      on: (ev, c) => ev.type === 'doc-style' && BASLIK.every((t) => h1(c, t)),
      done: 'Dört başlık hazır. Kalın ve büyük yapmakla yetinseydik görünüş aynı olurdu, ama içindekiler tablosu onları <b>göremezdi</b>.',
    },
    {
      title: 'İçindekiler tablosu',
      html: `<p>Alt başlığın (<b>Çınar Halk Eğitim Merkezi…</b>) altındaki <b>boş satıra</b> tıklayın.</p>
        <p>Üstten <b>Başvurular</b> sekmesine geçin ve <b>📑 İçindekiler Tablosu</b>\'na basın.</p>`,
      mouse: '🖱 Boş satır → Başvurular → İçindekiler Tablosu',
      hint: 'Gerçek Word\'de İçindekiler Tablosu düğmesi bir liste açar; oradan “Otomatik Tablo 1”i seçersiniz.',
      check: (c) => toc(c).length >= 4,
      on: (ev, c) => {
        if (ev.type !== 'doc-toc') return false;
        const b = info(c).blocks, i = b.findIndex((x) => x.tag === 'DIV'), j = b.findIndex((x) => norm(x.text) === norm('Kursa kayıt'));
        if (i > j) c.note('Tablo başka bir yere eklendi. Böyle de olur; ama içindekiler genellikle belgenin başında durur.');
        return toc(c).length >= 4;
      },
      done: 'Dört başlık, yanlarında <b>sayfa numaralarıyla</b> listelendi. Bunları siz yazmadınız; Word başlık stillerinden çıkardı.',
    },
    {
      title: 'Başlıklar yeni sayfadan',
      html: `<p>İçindekiler ilk sayfada tek başına dursun. Tablonun <b>hemen altındaki boş satıra</b> tıklayın ve ${K('Ctrl', 'Enter')}'a basın (sayfa sonu).</p>`,
      combo: ['Ctrl', 'Enter'],
      hint: 'Boş satır, tablo ile “Kursa kayıt” başlığının arasındadır. Enter\'a defalarca basarak aşağı itmeyin; yazı değişince kayar.',
      check: (c) => sayfa(c, 'Kursa kayıt') >= 2,
      on: (ev, c) => ev.type === 'doc-insert' && ev.what === 'pagebreak' && sayfa(c, 'Kursa kayıt') >= 2,
      done: 'Başlıklar <b>2. sayfaya</b> geçti. Şimdi içindekiler tablosuna bakın: hâlâ <b>1</b> yazıyor! Tablo kendiliğinden yenilenmez.',
    },
    {
      title: 'Tabloyu Güncelleştir',
      html: '<p><b>Başvurular</b> sekmesinde <b>⟳ Tabloyu Güncelleştir</b>\'e basın.</p>',
      hint: 'Gerçek Word bir soru sorar: “Yalnızca sayfa numaralarını” ya da “Tüm tabloyu” güncelleştir. Başlık eklediyseniz “Tüm tabloyu” seçin.',
      check: (c) => toc(c).length >= 4 && toc(c).every((x) => x.page >= 2),
      on: (ev, c) => ev.type === 'doc-toc' && toc(c).length >= 4 && toc(c).every((x) => x.page >= 2),
      done: 'Sayfa numaraları düzeldi. Belgeyi yazdırmadan ya da PDF yapmadan önce tabloyu her zaman bir kez güncelleştirin.',
    },
    {
      title: 'Yeni bir başlık',
      html: `<p>Belgenin <b>en sonuna</b> gidin (${K('Ctrl', 'End')}), ${K('Enter')}'a basın ve <b>İletişim</b> yazın. Sonra bu satıra <b>Giriş → Başlık 1</b> verin.</p>`,
      target: 'İletişim',
      hint: 'Son paragraf “…kurs bitirme belgesi verilir.” cümlesiyle biter. Onun sonuna tıklayıp Enter da olur.',
      check: (c) => h1(c, 'İletişim'),
      on: (ev, c) => ev.type === 'doc-style' && h1(c, 'İletişim'),
      done: 'Yeni başlık hazır ama içindekiler tablosuna bakın: hâlâ <b>dört</b> satır var. Tablo yeni başlığı ancak güncelleştirince görür.',
    },
    {
      title: 'Bir kez daha güncelleştirin',
      html: '<p><b>Başvurular → ⟳ Tabloyu Güncelleştir</b>. Tabloda beşinci satır olarak <b>İletişim</b> çıkmalı.</p>',
      check: (c) => toc(c).some((x) => norm(x.text) === norm('İletişim')),
      on: (ev, c) => ev.type === 'doc-toc' && toc(c).some((x) => norm(x.text) === norm('İletişim')),
      done: 'Beş başlık oldu. Bir başlığın adını değiştirdiğinizde de aynısını yapın.',
    },
    {
      title: 'Başlığa atlayın',
      html: `<p>Belgenin başına dönün (${K('Ctrl', 'Home')}). ${K('Ctrl')} tuşunu <b>basılı tutup</b> içindekiler tablosundaki <b>Sınav ve belge</b> satırına tıklayın.</p>`,
      hint: 'Ctrl\'ye basmadan tıklarsanız yalnızca “Ctrl tuşuna basılı tutup tıklayın” uyarısı çıkar.',
      on: (ev) => ev.type === 'doc-toc-go' && ev.found && /sınav/i.test(ev.text),
      done: 'İmleç doğrudan o başlığa gitti. Yüz sayfalık bir belgede aradığınızı böyle bulursunuz. PDF\'e çevirince de bu satırlar tıklanabilir kalır.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'El kitabı kaydedildi: numaralı liste, başlıklar ve güncel bir içindekiler tablosu.',
    },
    rehberSoru({
      title: 'Neden görünmüyor?',
      html: '<p>Bir arkadaşınız yeni bir bölüm yazmış, başlığını <b>kalın ve 16 punto</b> yapmış, sonra <b>Tabloyu Güncelleştir</b>\'e basmış. Başlık yine içindekilerde yok. Neden?</p>',
      opts: ['Başlığa Başlık 1 stili verilmemiş', 'Başlık yeterince büyük değil', 'Belge kaydedilmemiş'], ok: 0,
      wrong: 'Büyüklük ya da kaydetmek önemli değil. İçindekiler tablosu satırın görünüşüne bakmaz.',
      why: 'Doğru. İçindekiler tablosu yalnızca Başlık 1, Başlık 2, Başlık 3 stilli satırları toplar. Kalın ve büyük ama “Normal” stilli bir satır ona sıradan yazıdır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Uzun belgeyi düzene soktunuz:</p>' },
  ],
};
