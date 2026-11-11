// 6. hafta ek dersleri: dosya türleri, fotoğraflar, klasör içinde klasör, Geri Dönüşüm Kutusu, dosya senaryoları
import { K, desktopReady, put, PIC } from './common.js';
import { info, rehberSoru, sec } from './kalip.js';
import { RECYCLE } from '../vfs.js';

const explorerAt = (folder) => (c) => { const w = c.d.ensure('explorer'); if (folder && w.api.folder !== folder) w.api.go(folder); };

const typeFolder = 'Dosya türleri alıştırması';
const noteName = 'liste.txt';
const renamedNote = 'alışveriş.txt';
const photoName = 'tatil.jpg';
const pdfName = 'fatura.pdf';
const archiveName = 'fotoğraflar.zip';

const typeFiles = (c) => {
  const folder = put(c, 'docs', typeFolder, 'folder').id;
  if (!c.d.fs.find(folder, renamedNote)) put(c, folder, noteName, 'file', 'Ekmek, süt ve yumurta');
  put(c, folder, pdfName, 'file', { pages: ['<h3>Örnek fatura</h3><p>Bu belge dosya türleri alıştırması için hazırlanmıştır.</p>'] });
  const photo = put(c, folder, photoName, 'file', PIC('🏖', '#bfdbfe', '#fef3c7'));
  put(c, folder, 'fatura.pdf.exe');
  if (!c.d.fs.find(folder, archiveName)) c.d.fs.compress([photo.id], folder, archiveName);
  return folder;
};

const openTypeFiles = (c) => {
  desktopReady(c);
  explorerAt(typeFiles(c))(c);
};

export const dosyaTurleri = {
  id: 'dosya-turleri', icon: '🏷', title: 'Dosya türleri ve uzantılar', minutes: 25, stage: 'desktop',
  desktop: { settings: { exExtensions: false } },
  desc: 'Örnek dosyalarla uzantıları gösterin, dosya türünü bulun, farklı uygulamayla açın ve ZIP paketi ayıklayın.',
  summary: [
    ['.txt / .docx', 'Düz metin / Word belgesi'],
    ['.pdf', 'Sayfa düzenini koruyan belge'],
    ['.jpg / .png', 'Fotoğraf ve resim'],
    ['.mp3 / .mp4', 'Ses / video'],
    ['.zip', 'İçinde dosya ve klasör bulunan sıkıştırılmış paket'],
    ['.exe', 'Çalıştırılabilir uygulama; tanımadığınız kaynaktan geldiyse açmayın'],
    ['Uzantıları göstermek', 'Dosya Gezgini → Görüntüle → Göster → Dosya adı uzantıları'],
  ],
  steps: [
    {
      title: 'Dosya adını okuyun',
      html: `<p>Dosyanın türünü anlamak için <b>adına</b>, <b>simgesine</b> ve <b>Tür</b> sütununa bakabilirsiniz. Örneğin <b>tatil.jpg</b> dosyasının adı <b>tatil</b>, uzantısı <b>.jpg</b>.</p>
        <table class="tbl"><tr><th>.txt · .docx · .pdf</th><td>Metin ve belge</td></tr><tr><th>.jpg · .png</th><td>Fotoğraf ve resim</td></tr><tr><th>.mp3 · .mp4</th><td>Ses ve video</td></tr><tr><th>.zip</th><td>Sıkıştırılmış paket</td></tr><tr><th>.exe</th><td>Çalıştırılabilir uygulama</td></tr></table>
        <p>Yandaki <b>Dosya türleri alıştırması</b> klasöründe uzantılar şimdilik gizli. Örneğin <b>tatil.jpg</b> yalnızca <b>tatil</b> diye görünüyor.</p>`,
      setup: openTypeFiles,
    },
    {
      title: 'Uzantıları görünür yapın',
      html: `<p>Dosya Gezgini'nde <b>Görüntüle → Göster → Dosya adı uzantıları</b> seçeneğini işaretleyin. Dosya adlarına yeniden bakın.</p>
        <p class="mut">Düğme görünmüyorsa <b>⋯</b> menüsünden <b>Görüntüle</b>’yi açın. Windows 10’da seçenek <b>Görünüm</b> sekmesindedir.</p>`,
      setup: openTypeFiles,
      check: (c) => c.d.settings.exExtensions === true,
      on: (ev) => ev.type === 'setting' && ev.key === 'exExtensions' && ev.value === true,
      done: 'Artık <b>tatil.jpg</b> ve <b>fatura.pdf</b> adlarını uzantılarıyla görüyorsunuz.',
    },
    rehberSoru({
      title: 'Ad ile türü karşılaştırın',
      html: '<p>Dosya Gezgini’nde <b>tatil.jpg</b> satırını bulun. <b>Tür</b> sütununa bakın. Bu dosya ne içerir?</p>',
      opts: ['Bir fotoğraf', 'Bir yazı belgesi', 'Bir ses kaydı'], ok: 0,
      setup: openTypeFiles, why: '<b>.jpg</b> fotoğraflar için sık kullanılan bir resim biçimidir.',
    }),
    {
      title: 'Dosyanın özelliklerine bakın',
      html: '<p><b>fatura.pdf</b> dosyasına sağ tıklayın ve <b>Özellikler</b>’i seçin. Pencerede dosyanın <b>türü</b>, <b>boyutu</b> ve <b>konumu</b> görünür.</p>',
      setup: openTypeFiles,
      on: (ev) => ev.type === 'ex-properties' && ev.name === pdfName,
      done: 'Burada <b>PDF Belgesi</b> yazıyor. Bilgileri inceledikten sonra <b>Tamam</b>’a basın.',
    },
    rehberSoru({
      title: 'Şüpheli eki ayırt edin',
      html: '<p>Bir kargo e-postasında <b>fatura.pdf.exe</b> eki var. Klasördeki <b>fatura.pdf</b> ile karşılaştırın. Eki açar mısınız?</p>',
      opts: ['Açarım, adında PDF var', 'Açmam, sonu .exe ve bir uygulama çalıştırabilir', 'Bir arkadaşıma gönderirim'], ok: 1,
      setup: openTypeFiles, why: 'Dosya türü için <b>en sondaki</b> uzantıya bakın. Bu ek PDF gibi adlandırılmış bir uygulama. Beklemediğiniz ekleri açmadan önce göndereni doğrulayın.',
    }),
    {
      title: 'PDF belgesini açın',
      html: '<p><b>fatura.pdf</b> dosyasına çift tıklayın. Açılan pencerenin üstündeki uygulama adına bakın.</p>',
      setup: openTypeFiles,
      on: (ev) => ev.type === 'ex-open' && ev.name === pdfName,
      done: 'Dosya PDF okuyucuda açıldı. Bir PDF belgesi tarayıcıda da görüntülenebilir.',
    },
    {
      title: 'Fotoğrafı Paint ile açın',
      html: '<p>Fotoğrafa çift tıklarsanız varsayılan uygulamada açılır. Başka bir uygulama seçmek için <b>tatil.jpg</b> dosyasına sağ tıklayın ve <b>Birlikte aç → Paint</b> yolunu izleyin.</p>',
      setup: openTypeFiles,
      on: (ev) => ev.type === 'ex-openwith' && ev.name === photoName && ev.app === 'paint',
      done: 'Aynı fotoğrafı bu kez Paint açtı. Dosyanın türü ve uzantısı aynı kaldı.',
    },
    {
      title: 'Korumalı Görünüm',
      html: `<p>İnternetten ya da e-postadan gelen bir Word veya Excel belgesi <b>Korumalı Görünüm</b>’de, üstte sarı bir şeritle açılabilir. Belge başlangıçta salt okunurdur.</p>
        <p>Dosyayı bekliyorsanız, kaynağını doğruladıysanız ve belgeyi değiştirmeniz gerekiyorsa <b>Düzenlemeyi Etkinleştir</b>’i kullanın. Beklenmedik belgelerde <b>İçeriği Etkinleştir</b> veya <b>Makroları Etkinleştir</b> uyarısına basmayın.</p>`,
    },
    rehberSoru({
      title: 'Dosya boyutunu okuyun',
      html: '<p>Dosya Gezgini’ndeki <b>Boyut</b> sütunu dosyanın ne kadar yer kapladığını gösterir. Genellikle hangisi daha büyük olur?</p>',
      opts: ['Kısa bir alışveriş listesi', 'Bir fotoğraf', 'Uzun bir düğün videosu'], ok: 2,
      setup: openTypeFiles, why: 'Kısa metinler birkaç KB, fotoğraflar birkaç MB, uzun videolar ise GB düzeyinde olabilir.',
    }),
    {
      title: 'ZIP paketini açın',
      html: '<p><b>fotoğraflar.zip</b> dosyasına sağ tıklayın ve <b>Tümünü ayıkla</b>’yı seçin. Açılan pencerede <b>Ayıkla</b>’ya basın.</p>',
      setup: openTypeFiles,
      on: (ev) => ev.type === 'zip-extract' && ev.name === archiveName,
      done: 'Bir klasör oluştu ve paketteki fotoğraf içine çıkarıldı. ZIP dosyası da yerinde duruyor.',
    },
    {
      title: 'Adı değiştirin, türü koruyun',
      html: `<p><b>liste.txt</b> dosyasına bir kez tıklayın. ${K('F2')} ile seçili olan <b>liste</b> kısmını <b>alışveriş</b> yapıp ${K('Enter')} tuşuna basın. <b>.txt</b> uzantısını olduğu gibi bırakın.</p>`,
      setup: openTypeFiles,
      combo: ['F2'],
      check: (c) => !!c.d.fs.find(typeFiles(c), renamedNote),
      on: (ev) => ev.type === 'rename' && ev.old === noteName && ev.name === renamedNote,
      done: 'Dosyanın adı <b>alışveriş.txt</b> oldu. Uzantı aynı kaldığı için dosya hâlâ düz metin.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosya türünü uzantısından ve özelliklerinden tanıyabiliyor, uygun uygulamayla açabiliyor ve ZIP paketinden dosya çıkarabiliyorsunuz.</p>' },
  ],
};

export const fotograflar = {
  id: 'fotograflar', icon: '🖼', title: 'Fotoğraflarla çalışmak', minutes: 25, stage: 'desktop',
  desc: 'Fotoğraf açmak, yakınlaştırmak, yazdırmak, Albüm klasörü oluşturup fotoğraf kopyalamak.',
  setup: (c) => {
    put(c, 'pictures', 'torunum.jpg', 'file', PIC('👶', '#ffe0b2', '#f8bbd0'));
    put(c, 'pictures', 'bahçe.jpg', 'file', PIC('🌷', '#c8e6c9', '#fff59d'));
  },
  summary: [
    ['🖼 Resimler', 'Fotoğrafların durduğu klasör'],
    ['Çift tık', 'Fotoğrafı Fotoğraflar uygulamasında açar'],
    ['‹ ›', 'Önceki / sonraki fotoğraf (resmin iki yanındaki oklar, alttaki küçük resimler ya da klavyedeki sol-sağ ok tuşları)'],
    ['Büyüteç (+ / −)', 'Yakınlaştır / uzaklaştır'],
    ['Sağ tık → Arka plan olarak ayarla', 'Masaüstü resmi yapar'],
    ['⋯ → Yazdır', 'Kâğıt (A4 ya da 10 × 15), fotoğraf boyutu (tam sayfa, 10 × 15, cüzdan) ve kâğıt türü seçilir; önizlemeye bakın'],
    ['Ctrl + C → Ctrl + V', 'Fotoğrafı albüme kopyalar'],
  ],
  steps: [
    {
      title: 'Fotoğraflar nerede?',
      html: '<p>Telefondan aktardığınız ya da indirdiğiniz fotoğraflar genellikle <b>🖼 Resimler</b> klasöründe durur. Bu derste fotoğraflara bakıp onları düzenleyeceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Resimler klasörü',
      html: '<p>📁 Dosya Gezgini\'ni açın ve soldan <b>🖼 Resimler</b>\'e gidin.</p>',
      check: (c) => c.d.find('explorer')?.api.folder === 'pictures',
      on: (ev) => ev.type === 'nav' && ev.folder === 'pictures',
    },
    {
      title: 'Bir fotoğraf açın',
      html: '<p><b>torunum</b> fotoğrafına çift tıklayın.</p>',
      setup: explorerAt('pictures'),
      on: (ev) => (ev.type === 'app-open' && ev.app === 'photos') || ev.type === 'photo-open',
      done: 'Fotoğraf, Fotoğraflar uygulamasında açıldı.',
    },
    {
      title: 'Sonraki fotoğraf',
      html: '<p>Fotoğrafın sağ kenarındaki <b>›</b> okuna (fareyi fotoğrafın üstüne getirince çıkar) ya da alttaki küçük resimlere tıklayarak sonraki fotoğraflara geçin. Hepsine bakın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'photo-open') return false;
        c.s.n = (c.s.n || 0) + 1;
        c.note(`Bakılan fotoğraf: ${c.s.n}`);
        return c.s.n >= 3;
      },
    },
    {
      title: 'Yakınlaştırın',
      html: '<p>Üstteki araç çubuğunda <b>büyüteç (+)</b> düğmesiyle fotoğrafı büyütün, sonra <b>büyüteç (−)</b> ile eski haline getirin.</p>',
      on: (ev, c) => {
        if (ev.type !== 'photo-zoom') return false;
        if (ev.zoom > 1) c.s.big = true;
        return !!c.s.big && ev.zoom <= 1;
      },
      done: 'Küçük ayrıntıları görmek için yakınlaştırmak işe yarar.',
    },
    {
      title: 'Arka plan yapın',
      html: '<p>Beğendiğiniz fotoğrafı <b>masaüstü arka planı</b> yapın: Fotoğraflar penceresinin sağ üstündeki <b>⋯</b> → <b>Farklı ayarla</b> → <b>Arka plan</b> ya da Dosya Gezgini\'nde fotoğrafa sağ tık → <b>Masaüstü arka planı olarak ayarla</b>.</p>',
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Masaüstünüzde artık kendi fotoğrafınız var.',
    },
    {
      title: 'Fotoğrafı yazdırın',
      html: `<p><b>torunum</b> fotoğrafını kâğıda basalım. Fotoğraflar penceresinin sağ üstündeki <b>⋯</b> düğmesine, sonra <b>Yazdır</b>'a tıklayın ve şunları seçin:</p>
        <ul><li><b>Kâğıt:</b> A4 (normal kâğıt boyu)</li><li><b>Fotoğraf boyutu:</b> 10 × 15 cm, 2 tane</li><li><b>Kâğıt türü:</b> Parlak fotoğraf kâğıdı</li></ul>
        <p>Yazdır penceresinin üstündeki önizlemede kâğıda nasıl çıkacağını görün, sonra <b>🖨 Yazdır</b>.</p>`,
      setup: (c) => { const n = c.d.fs.find('pictures', 'torunum.jpg'); if (n && !c.d.find('photos')) c.d.openNode(n); },
      hint: 'Yazdır penceresinde açılır kutulara tıklayıp seçin. Önizleme her seçimde değişir.',
      on: (ev, c) => {
        if (ev.type !== 'photo-print') return false;
        if (ev.size === '10x15' && ev.kind === 'parlak') return true;
        c.note(ev.size !== '10x15' ? 'Fotoğraf boyutunu “10 × 15 cm, 2 tane” seçip yeniden yazdırın.' : 'Kâğıt türünü “Parlak fotoğraf kâğıdı” seçip yeniden yazdırın.');
        return false;
      },
      done: 'Bir A4 kâğıda iki fotoğraf çıktı; makasla kesersiniz. Fotoğrafçı kâğıdı varsa (10 × 15) Kâğıt kutusundan onu seçin.',
    },
    {
      title: 'Albüm klasörü',
      html: '<p>Fotoğraflar penceresini kapatın. Dosya Gezgini\'nde Resimler\'in içinde <b>Albüm</b> adında yeni bir klasör oluşturun.</p>',
      setup: explorerAt('pictures'),
      check: (c) => !!c.d.fs.find('pictures', 'Albüm'),
      on: (ev, c) => ev.type === 'rename' && !!c.d.fs.find('pictures', 'Albüm'),
    },
    {
      title: 'Albüme kopyalayın',
      html: `<p><b>torunum</b> ve <b>bahçe</b> fotoğraflarını Albüm klasörüne <b>kopyalayın</b>: fotoğrafı seçip ${K('Ctrl', 'C')}, Albüm'ü açıp ${K('Ctrl', 'V')}. Asılları Resimler'de kalsın.</p>`,
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type !== 'fs') return false;
        const a = c.d.fs.find('pictures', 'Albüm');
        if (!a) return false;
        const inA = ['torunum.jpg', 'bahçe.jpg'].filter((f) => c.d.fs.find(a.id, f));
        const kept = ['torunum.jpg', 'bahçe.jpg'].filter((f) => c.d.fs.find('pictures', f));
        if (inA.length && kept.length < 2) c.warn('Fotoğraf taşındı, kopyalanmadı. Albüm\'deki fotoğrafı Resimler\'e geri sürükleyin ve Kopyala / Yapıştır ile yeniden deneyin.');
        else if (inA.length === 1) c.note('Biri tamam, şimdi öbürü.');
        return inA.length === 2 && kept.length === 2;
      },
      done: 'Fotoğrafların bir kopyası albümde, asılları yerinde.',
    },
    {
      title: 'Fotoğrafa ad verin',
      html: `<p>Resimler'deki <b>kedimiz</b> fotoğrafının adını <b>Pamuk</b> yapın.</p>`,
      hint: 'Fotoğrafa bir kez tıklayın, F2, yeni adı yazıp Enter. Sondaki .jpg\'ye dokunmayın.',
      setup: explorerAt('pictures'),
      on: (ev) => ev.type === 'rename' && /pamuk/i.test(ev.name),
      done: 'Fotoğraflara anlamlı adlar vermek, sonra bulmayı kolaylaştırır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Fotoğraflarınızı düzenleyebilirsiniz:</p>' },
  ],
};

const ev_ = (c) => c.d.fs.find('docs', 'Ev');

export const klasorAgaci = {
  id: 'klasor-agaci', icon: '🌳', title: 'Klasör içinde klasör', minutes: 25, stage: 'desktop',
  desc: 'İç içe klasör oluşturmak, taşımak, adres çubuğunu okumak, aramak.',
  summary: [
    ['İç içe klasör', 'Dolap → çekmece → dosya gibi'],
    ['Adres çubuğu', 'Belgeler › Ev › Faturalar: neredeyim?'],
    ['Adres çubuğunda bir ada tıklamak', 'O klasöre hemen döner'],
    ['← Geri', 'Bir önceki klasör'],
    ['Ara', 'İçteki bütün klasörlere de bakar'],
  ],
  steps: [
    {
      title: 'Dolap, çekmece, dosya',
      html: '<p>Evde belgeleri nasıl saklarız? <b>Dolabın</b> içinde <b>çekmeceler</b>, çekmecelerin içinde <b>dosyalar</b>. Bilgisayarda da klasörlerin içine klasör koyabiliriz:</p><p><b>Belgeler › Ev › Faturalar 2026 › elektrik.pdf</b></p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); explorerAt('docs')(c); },
    },
    {
      title: 'Ev klasörü',
      html: '<p>Belgeler\'in içinde <b>Ev</b> adında bir klasör oluşturun.</p>',
      setup: explorerAt('docs'),
      check: (c) => !!ev_(c),
      on: (ev, c) => ev.type === 'rename' && !!ev_(c),
    },
    {
      title: 'İçine girin',
      html: '<p><b>Ev</b> klasörüne çift tıklayıp içine girin. Adres çubuğuna bakın.</p>',
      setup: explorerAt(),
      on: (ev, c) => ev.type === 'nav' && !!ev_(c) && ev.folder === ev_(c).id,
      done: 'Adres çubuğunda <b>Bu Bilgisayar › Belgeler › Ev</b> yazıyor: Ev klasörü, Belgeler\'in içinde. Klasör şimdilik boş.',
    },
    {
      title: 'İçeride iki klasör',
      html: '<p>Ev\'in içinde iki klasör daha oluşturun: <b>Sağlık</b> ve <b>Tapu ve sözleşmeler</b>.</p>',
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type !== 'rename' && ev.type !== 'fs') return false;
        const e = ev_(c);
        const kids = e ? c.d.fs.children(e.id).filter((n) => n.type === 'folder').map((n) => n.name) : [];
        const ok = [/sa[gğ]l[iı]k/i, /tapu/i].filter((r) => kids.some((k) => r.test(k))).length;
        if (ok === 1 && ev.type === 'rename') c.note('Biri tamam, şimdi öbürü.');
        return ok === 2;
      },
    },
    {
      title: 'Adres çubuğuyla dönün',
      html: '<p>Adres çubuğunda <b>Belgeler</b> yazısına tıklayarak Belgeler\'e dönün.</p>',
      hint: 'Sol üstteki ← Geri de olur, ama adres çubuğu birkaç klasör birden geri gitmeyi sağlar.',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
    },
    {
      title: 'Klasörü klasöre taşıyın',
      html: '<p>Belgeler\'deki <b>Faturalar</b> klasörünü tutup <b>Ev</b> klasörünün üzerine bırakın. Klasörler de dosyalar gibi taşınır; içindekilerle birlikte.</p>',
      setup: explorerAt('docs'),
      check: (c) => c.d.fs.find(ev_(c)?.id, 'Faturalar'),
      on: (ev, c) => ev.type === 'fs' && !!c.d.fs.find(ev_(c)?.id, 'Faturalar'),
      done: 'Faturalar artık Ev\'in içinde; içindeki faturalar da onunla gitti.',
    },
    {
      title: 'Derine inin',
      html: '<p>Ev\'e, sonra içindeki Faturalar\'a çift tıklayarak inin. Adres çubuğunda ne yazıyor?</p>',
      setup: explorerAt(),
      on: (ev, c) => ev.type === 'nav' && !!ev_(c) && ev.folder === c.d.fs.find(ev_(c).id, 'Faturalar')?.id,
      done: 'Adres çubuğu: Bu Bilgisayar › Belgeler › Ev › Faturalar. Belgeler\'den iki kat aşağıdasınız.',
    },
    {
      title: 'Geri gelin',
      html: '<p>Sol üstteki <b>←</b> ile iki kez geri giderek Belgeler\'e dönün.</p>',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
    },
    {
      title: 'Derindeki dosyayı arayın',
      html: '<p>Belgeler\'deyken Ara kutusuna <b>su faturası</b> yazın. Dosya iki klasör derinde olsa da bulunur mu?</p>',
      setup: explorerAt('docs'),
      on: (ev) => ev.type === 'ex-search' && ev.results.some((n) => /su fatura/i.test(n)),
      done: 'Arama, içteki bütün klasörlere de bakar. Dosyanın yerini unutursanız en üst klasörde arayın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Klasörlerinizi dolap gibi düzenleyebilirsiniz:</p>' },
  ],
};

export const copKutusu = {
  id: 'cop-kutusu', icon: '🗑', title: 'Geri Dönüşüm Kutusu', minutes: 20, stage: 'desktop',
  desc: 'Dosyayı silmenin üç yolu, Geri Dönüşüm Kutusu ve geri yükleme.',
  setup: (c) => {
    put(c, 'desktop', 'eski liste.txt', 'file', 'Ekmek');
    put(c, 'desktop', 'deneme.txt', 'file', 'deneme');
    put(c, 'desktop', 'taslak.txt', 'file', 'taslak');
  },
  summary: [
    ['Sürükle → 🗑', 'Silmenin fareyle yolu'],
    ['Delete', 'Seçili dosyayı siler'],
    ['Sağ tık → Sil', 'Menüyle silmek'],
    ['Seçili öğeleri geri yükle', 'Dosyayı eski yerine koyar'],
    ['Kutuyu boşalt', 'İçindekiler tamamen silinir: geri gelmez'],
  ],
  steps: [
    {
      title: 'Silinen dosya nereye gider?',
      html: '<p>Bilgisayarda silinen dosya hemen yok olmaz; önce <b>Geri Dönüşüm Kutusu</b>\'na gider. Tıpkı evdeki çöp kutusu gibi: çöpü dökmeden önce yanlışlıkla atılanı geri alabilirsiniz.</p><p>Masaüstünde üç gereksiz dosya var. Üçünü üç farklı yoldan sileceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. yol: sürükleyin',
      html: '<p><b>eski liste</b> dosyasını tutup masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'nun üzerine bırakın.</p>',
      on: (ev) => ev.type === 'drop' && ev.to === RECYCLE,
    },
    {
      title: '2. yol: Delete',
      html: `<p><b>deneme</b> dosyasına bir kez tıklayın ve ${K('Delete')} tuşuna basın.</p>`,
      combo: ['Delete'],
      on: (ev) => ev.type === 'delete' && /deneme/.test(ev.name),
    },
    {
      title: '3. yol: sağ tık',
      html: '<p><b>taslak</b> dosyasına sağ tıklayın ve menüden <b>Sil</b>\'i seçin.</p>',
      mouse: '🖱 Sağ tık → Sil',
      on: (ev) => ev.type === 'delete' && /taslak/.test(ev.name),
    },
    {
      title: 'Kutuyu açın',
      html: '<p>Masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'na çift tıklayın. Sildiğiniz üç dosya içinde mi?</p>',
      on: (ev) => (ev.type === 'nav' && ev.folder === RECYCLE) || (ev.type === 'app-open' && ev.app === 'explorer' && ev.args?.folder === RECYCLE) || (ev.type === 'icon-open' && /Geri Dönüşüm/.test(ev.name)),
      done: 'Üçü de burada bekliyor.',
    },
    {
      title: 'Geri yükleyin',
      html: '<p>Fikrinizi değiştirdiniz: <b>deneme</b> dosyasını seçip üstteki <b>Seçili öğeleri geri yükle</b>\'ye tıklayın.</p>',
      setup: explorerAt(RECYCLE),
      on: (ev) => ev.type === 'restore' && /deneme/.test(ev.name),
      done: (c) => `Dosya eski yerine döndü: <b>${c.d.fs.find('desktop', 'deneme.txt') ? 'Masaüstü' : 'eski klasörü'}</b>. Masaüstüne bakın.`,
    },
    {
      title: 'Kutuyu boşaltın',
      html: '<p>Kalan iki dosyaya artık gerek yok. Geri Dönüşüm Kutusu\'nu <b>boşaltın</b>: üstteki <b>🗑 Geri Dönüşüm Kutusunu boşalt</b> düğmesi ya da masaüstündeki kutuya sağ tık → boşalt. Çıkan soruya <b>Evet</b>.</p>',
      setup: explorerAt(RECYCLE),
      on: (ev) => ev.type === 'recycle-empty',
      done: 'Kutu boşaldı. Bu dosyalar artık geri getirilemez.',
    },
    {
      title: 'Bir uyarı',
      html: '<ul class="big-list"><li><b>USB bellekten</b> silinen dosyalar kutuya gitmez, doğrudan silinir.</li><li>Kutuyu boşaltmadan önce içine bir göz atın.</li><li>Gerçekten önemli dosyaların yedeğini (USB bellek ya da bulut) alın.</li></ul>',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Silmeyi ve geri getirmeyi öğrendiniz:</p>' },
  ],
};

export const dosyaSenaryo = {
  id: 'dosya-senaryo', icon: '🤔', title: 'Ne yapardınız? Dosya durumları', minutes: 20, stage: 'scene',
  desc: 'Günlük hayattan dosya durumları: USB\'den fotoğraf almak, silinen belge, dolu disk.',
  summary: [
    ['USB\'den almak', 'Kopyalayın; aslı USB\'de kalsın'],
    ['Dağınık masaüstü', 'Klasör açıp içine taşıyın'],
    ['Yedek', 'Önemli dosyaların bir kopyası USB\'de ya da bulutta'],
    ['“Biçimlendirmeniz gerekiyor”', 'Basmayın: her şey silinir'],
    ['Dosya adında olmaz', '\\ / : * ? " < > |'],
    ['Disk dolu', 'İndirilenler\'i ve kutuyu temizleyin, videoları taşıyın'],
  ],
  steps: [
    { title: 'Durumlar', html: '<p>Dosyalarla ilgili günlük hayatta karşılaşacağınız durumlar. Her birinde ne yapardınız?</p>', scene: info('<div class="sc-big">📁🤔</div>') },
    sec({ title: 'Torunun USB\'si', text: '<div class="qz-pic">👧 💾 ➜ 💻</div>', q: 'Torununuz USB bellekte fotoğraflar getirdi; bilgisayarınıza almak istiyorsunuz.', opts: ['USB\'deki fotoğrafları Resimler\'e kopyalarım (sürükleyerek)', 'USB\'yi bilgisayara takılı bırakırım, oradan bakarım', 'Fotoğrafların resmini telefonla çekerim'], ok: 0, why: 'Farklı sürücüden sürüklemek kopyalar; fotoğraflar sizde kalır, torununuzun USB\'si de boşalmaz.' }),
    sec({ title: 'Dağınık masaüstü', text: '<div class="qz-pic">📄📄📄📄📄📄</div>', q: 'Masaüstü dosyalarla doldu, aradığınızı bulamıyorsunuz.', opts: ['Hepsini silerim', '“Faturalar”, “Fotoğraflar” gibi klasörler açıp dosyaları içlerine taşırım', 'Simgeleri küçültürüm'], ok: 1, why: 'Klasörler düzen sağlar. Masaüstünde yalnızca sık kullandıklarınızı bırakın.' }),
    sec({ title: 'Kutu da boşaldı', text: '<div class="qz-pic">📄 ➜ 🗑 ➜ ∅</div>', q: 'Önemli bir belgeyi sildiniz ve Geri Dönüşüm Kutusu\'nu da boşalttınız.', opts: ['Kutuyu tekrar açarsam geri gelir', 'Kendim kurtaramam; yedeğim varsa oradan alırım', 'Bilgisayarı yeniden başlatırsam geri gelir'], ok: 1, why: 'Bu yüzden önemli dosyaların yedeğini almak gerekir. Hemen bilgisayarı az kullanıp bir uzmana danışmak bazen işe yarar.' }),
    sec({ title: 'Kopya dosya', text: '<div class="qz-pic">📄 mektup · 📄 mektup - Kopya</div>', q: 'Klasörde “mektup” ve “mektup - Kopya” diye iki dosya var. Ne olmuş?', opts: ['Virüs bulaşmış', 'Aynı klasörde kopyala-yapıştır yapılmış; gereksizse kopyayı silerim', 'Dosya ikiye bölünmüş'], ok: 1, why: 'Aynı yere yapıştırınca Windows ada “- Kopya” ekler; iki dosya birbirinden bağımsızdır.' }),
    sec({ title: 'Aynı adlı dosya', text: '<div class="qz-pic">📄 Ekim ➜ 📁 Faturalar (içinde “Ekim” var)</div>', q: 'Faturalar klasöründe “Ekim” adlı bir dosya var. Aynı adlı başka bir dosyayı yapıştırınca Windows sordu. Hangisi güvenli?', opts: ['Eski dosyayı yenisiyle değiştiren seçeneği', 'İki dosyayı da saklayan seçeneği', 'Soruyu okumadan hemen Evet\'e basarım'], ok: 1, why: 'İki dosyayı da saklayan seçenek hiçbir şeyi kaybettirmez: yenisinin adına (2) eklenir. Değiştirirseniz eski dosya silinir. Menü adları sürüme göre biraz değişebilir. Emin değilseniz ikisini de saklayın.' }),
    sec({ title: 'Biçimlendirme uyarısı', text: '<div class="qz-pic">💾 ⚠ “Kullanmadan önce biçimlendirmeniz gerekiyor”</div>', q: 'USB belleği takınca bu uyarı çıktı. Ne yaparsınız?', opts: ['Biçimlendir\'e basarım', 'Basmam: biçimlendirmek içindekileri siler; İptal deyip başka bilgisayarda denerim, gerekirse danışırım', 'USB\'yi kırarım'], ok: 1, why: 'Biçimlendirmek diski sıfırlar. İçindeki dosyalar önemliyse önce kurtarmak gerekir.' }),
    sec({ title: 'Dosya adı', text: '<div class="qz-pic">📄 ?</div>', q: 'Hangi dosya adı kabul <b>edilmez</b>?', opts: ['market listesi', 'Ekim-2026 faturası', 'Neden geldin?'], ok: 2, why: 'Dosya adlarında \\ / : * ? " < > | işaretleri kullanılamaz. Tire, boşluk ve Türkçe harfler olur.' }),
    sec({ title: 'Disk dolu', text: '<div class="qz-pic">🗄 ▓▓▓▓▓▓▓▓▓▓ %98</div>', q: 'Bilgisayar “disk alanı az” diyor. İlk ne yaparsınız?', opts: ['İndirilenler\'deki gereksiz dosyaları silip Geri Dönüşüm Kutusu\'nu boşaltırım; büyük videoları USB\'ye taşırım', 'Windows klasörünü silerim', 'Programları rastgele kaldırırım'], ok: 0, why: 'İndirilenler zamanla dolar. Windows\'un kendi klasörlerine dokunmayın.' }),
    sec({ title: 'Dosyayı göndermek', text: '<div class="qz-pic">📎 ❓</div>', q: 'Bir belgeyi e-postaya ekleyeceksiniz ama nereye kaydettiğinizi hatırlamıyorsunuz.', opts: ['Belgeyi yeniden yazarım', 'Dosya Gezgini\'nde adından bir kelimeyle ararım; e-postada “Ekle” deyince de aynı pencere çıkar', 'E-postayı göndermem'], ok: 1, why: 'Dosya ekleme penceresi de bir Dosya Gezgini\'dir: klasörler ve arama kutusu oradadır.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosya durumlarında ne yapacağınızı biliyorsunuz:</p>', scene: info('<div class="sc-big">📁✔</div>') },
  ],
};
