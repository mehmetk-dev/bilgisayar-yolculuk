// 6. hafta ek dersi: resim dosyası türleri (PNG, JPG, GIF) ve web sayfası dosyası (HTML). Paint'ten iki türde kaydetmek,
// Not Defteri'nde bir HTML sayfası yazıp tarayıcıda açmak, sayfa kaynağını görmek.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const npText = (c) => c.d.find('notepad')?.api.np?.value || '';
const pageFile = (c) => ['docs', 'desktop', 'downloads'].map((f) => c.d.fs.find(f, 'sayfam.html')).find(Boolean);

export const resimWeb = {
  id: 'resim-web-dosyalari', icon: '🖼', title: 'Resim ve web dosyaları: PNG, JPG, HTML', minutes: 40, stage: 'desktop',
  desc: 'PNG ve JPG farkı; web sayfasının aslında bir yazı dosyası olduğunu görmek.',
  summary: [
    ['JPG (JPEG)', 'Fotoğraflar için: küçük boyutlu, çok renkli; her kaydedişte hafif kalite kaybı'],
    ['PNG', 'Çizim, logo, ekran alıntısı ve yazılı görseller için: net kenarlı, kayıpsız; saydam alan destekler'],
    ['GIF', 'Kısa hareketli resimler; renk sayısı azdır'],
    ['BMP', 'Eski ve çok yer kaplayan biçim; artık kullanmayın'],
    ['Kayıt türü', 'Kaydet penceresinde “Kayıt türü” uzantıyı belirler: PNG, JPEG, Tüm Dosyalar'],
    ['HTML (.html)', 'Web sayfasını anlatan yazı dosyası; tarayıcı bu yazıyı okuyup sayfayı çizer'],
    ['Ctrl + U', 'Sayfa kaynağını gösterir: sayfanın yazıldığı metin'],
  ],
  steps: [
    {
      title: 'Aynı resim, farklı türler',
      html: `<p>Resimler farklı <b>dosya türlerinde</b> saklanabilir: <b>.png</b>, <b>.jpg</b>, <b>.gif</b>… Hepsi resimdir ama özellikleri farklıdır:</p>
        <ul class="big-list"><li><b>JPG</b>: fotoğraf için, küçük boyutlu</li><li><b>PNG</b>: çizim, yazılı görsel ve ekran görüntüsü için, net</li><li><b>GIF</b>: kısa hareketli resim</li></ul>
        <p>Önce Paint'te bir resmi iki türde kaydedeceğiz. Sonra web sayfalarının da <b>.html</b> adlı bir dosya olduğunu kendiniz göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Paint\'i açın ve çizin',
      html: '<p>⊞ Başlat → <b>🎨 Paint</b>. Beyaz alana <b>fareyi basılı tutarak</b> birkaç çizgi çizin: bir ev, bir çiçek, ne isterseniz.</p>',
      setup: (c) => maxed(c, 'paint'),
      on: (ev) => ev.type === 'paint-draw',
      done: 'Resim hazır. Şimdi kaydedelim.',
    },
    {
      title: 'PNG olarak kaydedin',
      html: `<p>${K('Ctrl')} + ${K('S')} (ya da 💾) ile kaydedin. Pencerede ad olarak <b>çiçek</b> yazın ve <b>Kayıt türü</b>'nün <b>PNG</b> olduğundan emin olup <b>Kaydet</b>'e basın.</p>`,
      hint: 'Kaydet penceresinde Kayıt türü kutusu en altta. PNG seçili gelir; adı yazıp Kaydet.',
      on: (ev) => ev.type === 'save' && ev.format === 'png',
      done: '<b>çiçek.png</b> kaydedildi. PNG, çizim ve yazı içeren görseller için en uygunudur: kenarlar net kalır.',
    },
    {
      title: 'JPG olarak kaydedin',
      html: `<p>Aynı resmi bir de <b>JPG</b> olarak saklayalım: ${K('Ctrl')} + ${K('Shift')} + ${K('S')} (<b>Farklı kaydet</b>). <b>Kayıt türü</b> kutusundan <b>JPEG</b>'i seçin (ad <b>çiçek.jpg</b> olur) ve <b>Kaydet</b>'e basın.</p>`,
      hint: 'Kayıt türü listesinden JPEG (*.jpg) seçince dosya adının sonu otomatik .jpg olur.',
      on: (ev) => ev.type === 'save' && ev.format === 'jpg',
      done: '<b>çiçek.jpg</b> da kaydedildi. Aynı resmin iki farklı dosyası oldu.',
    },
    {
      title: 'İkisini karşılaştırın',
      html: '<p>⊞ Başlat → <b>📁 Dosya Gezgini</b> → <b>Resimler</b> klasörüne bakın. <b>çiçek.png</b> ve <b>çiçek.jpg</b> dosyalarının <b>türü</b> ve <b>boyutuna</b> bakın. Hangisi daha küçük?</p><p class="mut">Boyutlar farklı çıkar. Resmi yakınlaştırıp bakarsanız PNG’de çizgi kenarlarının <b>net</b>, JPG’de çevrelerinde hafif <b>bulanıklık</b> olduğunu görürsünüz. <b>Fotoğraflarda</b> ise JPG, PNG’den çok daha küçüktür; bu yüzden telefonla çekilen fotoğraflar hep JPG’dir.</p>',
      manual: 'Baktım ✔',
      setup: (c) => c.d.ensure('explorer', { folder: 'pictures' }),
      done: 'Dosya türü, ne tür resim sakladığınıza göre seçilir. Boyut farkı, fotoğraf sayısı arttıkça disk dolmasına ve e-postaya ek göndermeye de yansır.',
    },
    rehberSoru({
      title: 'Hangi tür?',
      html: '<p>Torununuza e-postayla <b>20 tatil fotoğrafı</b> göndereceksiniz. E-postaya sığması için hangi türü seçersiniz?</p>',
      opts: ['JPG: fotoğraflar için küçük kalır', 'PNG: kayıpsız olduğu için', 'BMP'], ok: 0,
      wrong: 'Fotoğraf çok renkli ve ayrıntılıdır. Küçük boyut için hangi tür tasarlandı?',
      why: 'Doğru: JPG. Fotoğraflarda ince renk farkları göze fark ettirmeden sıkıştırılır; boyut PNG’nin onda biri olabilir. Telefon fotoğrafları zaten JPG’dir.',
    }),
    rehberSoru({
      title: 'Ekran alıntısı',
      html: '<p>Bir <b>ekran alıntısı</b> kaydedeceksiniz: pencere, düğmeler ve küçük yazılar var. Hangi tür yazıların net kalmasını sağlar?</p>',
      opts: ['PNG: kenarlar ve yazılar net kalır', 'JPG: her zaman daha iyidir', 'Fark etmez'], ok: 0,
      wrong: 'JPG ince çizgilerin ve yazıların çevresini bulanıklaştırabilir.',
      why: 'Doğru: PNG. Yazı, çizgi ve düz renk alanlarında JPG bulanık “gürültü” bırakır; PNG ise netliği korur. Ekran alıntısı kaydedilirken de varsayılan PNG’dir.',
    }),
    {
      title: 'Web sayfası da bir dosya',
      html: `<p>İnternette gördüğünüz her sayfa aslında <b>.html</b> uzantılı bir <b>yazı dosyasıdır</b>. İçinde “şurası başlık, şurası paragraf” gibi işaretler vardır; tarayıcı bunu okuyup sayfayı <b>çizer</b>.</p>
        <p>Şimdi kendi sayfanızı yazacağız. ⊞ Başlat → <b>📝 Not Defteri</b>'ni açın.</p>`,
      setup: (c) => c.d.closeAll(),
      check: (c) => !!c.d.find('notepad'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'notepad',
    },
    {
      title: 'Sayfayı yazın',
      html: `<p>Not Defteri'ne şu iki satırı <b>aynen</b> yazın:</p><div class="target">&lt;h1&gt;Merhaba&lt;/h1&gt;</div><div class="target">&lt;p&gt;Bu benim ilk web sayfam.&lt;/p&gt;</div>
        <p class="mut"><b>&lt;</b> ve <b>&gt;</b> işaretleri: Türkçe klavyede <b>Z</b> tuşunun solundaki tuştur (<b>&gt;</b> için Shift ile birlikte). <b>/</b> işareti ${K('Shift')} + <b>7</b>.</p>`,
      hint: '<h1> başlık, <p> paragraf demektir; kapatırken önüne / konur: </h1>, </p>. Sınır işaretlerini yanlış yazarsanız sayfa bozuk görünür.',
      setup: (c) => maxed(c, 'notepad'),
      on: (ev, c) => { const t = npText(c); return ev.type === 'input' && /<h1>\s*Merhaba\s*<\/h1>/i.test(t) && /<p>[^<]*<\/p>/i.test(t); },
      done: 'Bu bir “web sayfası kodu”: <b>HTML</b>. Henüz yalnızca yazıdan ibaret.',
    },
    {
      title: 'sayfam.html olarak kaydedin',
      html: `<p>${K('Ctrl')} + ${K('S')} ile kaydedin. <b>Kayıt türü</b>'nü <b>Tüm Dosyalar</b> yapın (yoksa Not Defteri adın sonuna .txt ekler!). Dosya adı: <b>sayfam.html</b>. <b>Belgeler</b> klasöründe olsun.</p>`,
      hint: 'Kayıt türü kutusundan “Tüm Dosyalar (*.*)” seçip adı sayfam.html yazın.',
      on: (ev, c) => {
        if (ev.type !== 'save') return false;
        if (/\.html\.txt$/i.test(ev.name)) { c.warn(`Dosya “${ev.name}” adıyla kaydedildi: sonuna .txt eklendi, bu bir web sayfası olmaz. Farklı kaydet (Ctrl + Shift + S) ile Kayıt türünü “Tüm Dosyalar” yapıp yeniden kaydedin.`); return false; }
        if (!/^sayfam\.html$/i.test(ev.name)) { c.note(`Dosya adı “${ev.name}”. Adı sayfam.html yapın.`); return false; }
        return true;
      },
      done: '<b>sayfam.html</b> kaydedildi. Dosyanın simgesi şimdi bir globe (🌐) olmalı: bilgisayar bunu web sayfası olarak tanıdı.',
    },
    {
      title: 'Tarayıcıda açın',
      html: '<p><b>Dosya Gezgini</b> ile <b>Belgeler</b> klasöründeki <b>sayfam.html</b> dosyasına <b>çift tıklayın</b>. İnternet tarayıcısı açılır ve sayfanızı çizer.</p>',
      mouse: '🖱 sayfam.html: çift tık',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'dosya',
      done: 'İşte sizin web sayfanız! Adres çubuğuna bakın: <b>dosya://…</b> yazıyor, internette değil, bilgisayarınızda. Yazdığınız yazı büyük başlık ve paragraf oldu.',
    },
    {
      title: 'Sayfanın kaynağı',
      html: `<p>Sayfa açıkken ${K('Ctrl')} + ${K('U')} tuşlarına basın (ya da tarayıcının ⋯ menüsünden <b>Sayfa kaynağını görüntüle</b>). Yeni sekmede sayfanın <b>yazı hâli</b> görünür.</p>`,
      combo: ['Ctrl', 'KeyU'],
      on: (ev) => ev.type === 'web-source',
      done: 'Gördüğünüz, az önce Not Defteri\'nde yazdığınız metin. Her web sayfasının arkasında böyle bir yazı vardır; tarayıcı onu güzel sayfaya çevirir.',
    },
    {
      title: 'Değiştirin, yenileyin',
      html: `<p>Not Defteri'ne dönün, ilk satırı <b>&lt;h1&gt;Merhaba Dünya&lt;/h1&gt;</b> yapın ve ${K('Ctrl')} + ${K('S')} ile kaydedin. Sonra tarayıcıda sayfa sekmesine geçip <b>⟳ Yenile</b>'ye basın.</p>`,
      hint: 'Önce Not Defteri\'nde “Merhaba” kelimesinden sonra “ Dünya” ekleyin, kaydedin. Sonra tarayıcıya geçip ⟳.',
      on: (ev, c) => ev.type === 'web-reload' && /D[üu]nya/i.test(String(pageFile(c)?.content || '')),
      done: 'Başlık değişti. Web sitesi yapan kişiler böyle çalışır: dosyayı değiştirir, tarayıcıda yenileyip sonucu görür.',
    },
    rehberSoru({
      title: 'HTML nedir?',
      html: '<p>Komşunuz soruyor: “İnternet sitesi nasıl yapılıyor?” Ona en doğru cevap hangisi?</p>',
      opts: ['Sitelerin hepsi büyülü programlardır', 'Sayfa, HTML denen bir yazıyla anlatılır; tarayıcı bu yazıyı okuyup sayfayı çizer', 'Siteler resim dosyalarıdır'], ok: 1,
      wrong: 'Az önce kendi sayfanızı yaptınız. Nasıl yazıldı?',
      why: 'Doğru. HTML, sayfanın yapısını anlatan bir yazıdır (başlık, paragraf, resim, bağlantı). Tarayıcı bu yazıyı okuyup sayfayı çizer. Bilgisayarınızdaki .html dosyasını da internetsiz açabilirsiniz.',
    }),
    rehberSoru({
      title: 'Hangi uzantı?',
      html: '<p>Not Defteri\'nde yazdığınız sayfayı <b>sayfam.txt</b> adıyla kaydederseniz tarayıcıda açılınca ne olur?</p>',
      opts: ['Sayfa gibi görünür', 'Düz yazı olarak görünür: dosyanın ne olduğunu bilgisayar uzantısından anlar (.html olmalı)', 'Dosya silinir'], ok: 1,
      wrong: 'Bilgisayar dosyanın türünü neye bakarak anlar?',
      why: 'Doğru: uzantıya. .html olanı “web sayfası”, .txt olanı “düz yazı” sayar. Aynı içerik farklı uzantıyla farklı davranır; bu yüzden uzantıyı gelişigüzel değiştirmeyin.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Resim ve web dosyalarını tanıyorsunuz:</p>' },
  ],
};
