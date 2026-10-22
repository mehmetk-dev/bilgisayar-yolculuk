// 6. hafta ek dersi: resim dosyası türleri (PNG, JPG, GIF) ve web sayfası dosyası (HTML). Paint'ten iki türde kaydetmek,
// hazır bir HTML sayfasını tarayıcıda açmak, kaynağını görmek, Not Defteri'nde bir kelimesini değiştirmek.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const PAGE = '<h1>Merhaba</h1>\n<p>Bu benim ilk web sayfam.</p>';
const pageFile = (c) => ['docs', 'desktop', 'downloads'].map((f) => c.d.fs.find(f, 'sayfam.html')).find(Boolean);

export const resimWeb = {
  id: 'resim-web-dosyalari', icon: '🖼', title: 'Resim ve web dosyaları: PNG, JPG, HTML', minutes: 40, stage: 'desktop',
  desc: 'PNG ve JPG farkı; web sayfasının aslında bir yazı dosyası olduğunu görmek ve içindeki bir kelimeyi değiştirmek.',
  summary: [
    ['JPG (JPEG)', 'Fotoğraflar için: küçük boyutlu, çok renkli; her kaydedişte hafif kalite kaybı'],
    ['PNG', 'Çizim, logo, ekran alıntısı ve yazılı görseller için: net kenarlı, kayıpsız; saydam alan destekler'],
    ['GIF', 'Kısa hareketli resimler; renk sayısı azdır'],
    ['BMP', 'Eski ve çok yer kaplayan biçim; artık kullanmayın'],
    ['Kayıt türü', 'Kaydet penceresinde “Kayıt türü” uzantıyı belirler: PNG, JPEG'],
    ['HTML (.html)', 'Web sayfasını anlatan yazı dosyası; tarayıcı bu yazıyı okuyup sayfayı çizer (tarif ve yemek gibi)'],
    ['< > işaretleri', 'Tarayıcıya talimat: h1 büyük başlık demek. Ekranda görünmez'],
    ['Ctrl + U', 'Sayfa kaynağını gösterir: sayfanın yazıldığı metin'],
  ],
  steps: [
    {
      title: 'Aynı resim, farklı türler',
      html: `<p>Resimler farklı <b>dosya türlerinde</b> saklanabilir: <b>.png</b>, <b>.jpg</b>, <b>.gif</b>… Hepsi resimdir ama özellikleri farklıdır:</p>
        <ul class="big-list"><li><b>JPG</b>: fotoğraf için, küçük boyutlu</li><li><b>PNG</b>: çizim, yazılı görsel ve ekran görüntüsü için, net</li><li><b>GIF</b>: kısa hareketli resim</li></ul>
        <p>Önce Paint'te bir resmi iki türde kaydedeceğiz. Sonra web sayfalarının da <b>.html</b> uzantılı bir dosya olduğunu göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Paint\'i açın ve çizin',
      html: '<p>⊞ Başlat → <b>🎨 Paint</b>. Kalemle basit bir <b>çiçek</b> çizin: önce <b>yeşil</b> renkle aşağı doğru bir sap, sonra <b>kırmızı</b> ya da <b>mor</b> renkle sapın tepesine yuvarlak yapraklar.</p>',
      hint: 'Rengi üstteki renk kutularından seçin, sonra beyaz alanda sol tuşu basılı tutarak çizin.',
      setup: (c) => maxed(c, 'paint'),
      on: (ev, c) => {
        if (ev.type !== 'paint-draw') return false;
        (c.s.renk ||= new Set()).add(ev.colorName);
        if (c.s.renk.size < 2) c.note('Sap tamam gibi. Şimdi başka bir renkle yaprakları çizin.');
        return c.s.renk.size >= 2;
      },
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
      html: '<p>⊞ Başlat → <b>📁 Dosya Gezgini</b> → <b>Resimler</b> klasörüne bakın. Liste ayrıntılı açılır; açılmazsa üstteki <b>☰ Ayrıntılar</b> düğmesine tıklayın. <b>çiçek.png</b> ve <b>çiçek.jpg</b> dosyalarının <b>türü</b> ve <b>boyutuna</b> bakın. Hangisi daha küçük?</p><p class="mut">Boyutlar farklı çıkar. Resmi yakınlaştırıp bakarsanız PNG’de çizgi kenarlarının <b>net</b>, JPG’de çevrelerinde hafif <b>bulanıklık</b> olduğunu görürsünüz. <b>Fotoğraflarda</b> ise JPG, PNG’den çok daha küçüktür; bu yüzden telefonla çekilen fotoğraflar çoğunlukla JPG’dir (bazı iPhone’larda HEIC).</p>',
      manual: 'Baktım ✔',
      setup: (c) => { const e = c.d.find('explorer'); if (e) c.d.close(e); c.d.open('explorer', { folder: 'pictures', view: 'details' }); },
      done: 'Dosya türü, ne tür resim sakladığınıza göre seçilir. Boyut farkı, fotoğraf sayısı arttıkça disk dolmasına ve e-postaya ek göndermeye de yansır.',
    },
    rehberSoru({
      title: 'Hangi tür?',
      html: '<p>Torununuza e-postayla <b>20 tatil fotoğrafı</b> göndereceksiniz. E-postaya sığması için hangi türü seçersiniz?</p>',
      opts: ['JPG: fotoğraflar için küçük kalır', 'PNG: kayıpsız olduğu için', 'BMP'], ok: 0,
      wrong: 'Fotoğraf çok renkli ve ayrıntılıdır. Küçük boyut için hangi tür tasarlandı?',
      why: 'Doğru: JPG. Fotoğraflarda ince renk farkları göze fark ettirmeden sıkıştırılır; boyut PNG’nin onda biri olabilir. Telefon fotoğrafları çoğunlukla zaten JPG’dir.',
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
      html: `<p>İnternette gördüğünüz her sayfa aslında bir <b>yazıdır</b>. Bu yazı, tarayıcıya sayfayı nasıl göstereceğini anlatır. Böyle dosyaların adı <b>.html</b> ile biter.</p>
        <p>Yemek tarifine benzer: <b>tarif</b> kâğıttaki yazıdır, <b>aşçı</b> tarifi okuyup <b>yemeği</b> yapar. Burada da tarif <b>.html dosyası</b>, aşçı <b>tarayıcı</b>, yemek de ekranda gördüğünüz <b>sayfa</b>.</p>
        <div class="box"><p><b>Dosyada yazan:</b> <code>&lt;h1&gt;Merhaba&lt;/h1&gt;</code></p><p><b>Tarayıcının gösterdiği:</b> <span style="font-size:1.6em;font-weight:700">Merhaba</span></p></div>
        <p class="mut">Köşeli işaretler (&lt; &gt;) tarayıcıya verilen talimatlardır: <b>h1</b> “büyük başlık yap” demektir. Tarayıcı bu işaretleri ekranda göstermez. Bunları ezberlemeniz gerekmiyor; bu derste sadece web sayfasının da bir dosya olduğunu göreceğiz.</p>`,
      setup: (c) => { c.d.closeAll(); c.d.fs.write('docs', 'sayfam.html', PAGE); },
    },
    {
      title: 'Sayfayı açın',
      html: '<p><b>Belgeler</b> klasörüne sizin için hazır bir sayfa koyduk: <b>sayfam.html</b>. Simgesi 🌐: bilgisayar onu web sayfası olarak tanıyor.</p><p>Dosyaya <b>çift tıklayın</b>. Tarayıcı açılır ve sayfayı gösterir.</p>',
      mouse: '🖱 sayfam.html: çift tık',
      setup: (c) => { if (!pageFile(c)) c.d.fs.write('docs', 'sayfam.html', PAGE); const e = c.d.find('explorer'); if (e) c.d.close(e); c.d.open('explorer', { folder: 'docs' }); },
      on: (ev) => ev.type === 'web-nav' && ev.host === 'dosya',
      done: 'Sayfa açıldı. Adres çubuğuna bakın: <b>dosya://…</b> yazıyor. Bu sayfa internette değil, sizin bilgisayarınızda.',
    },
    {
      title: 'Sayfanın arkasındaki yazı',
      html: `<p>Sayfa açıkken ${K('Ctrl')} + ${K('U')} tuşlarına basın (ya da tarayıcının ⋯ menüsünden <b>Sayfa kaynağını görüntüle</b>). Yeni sekmede sayfanın <b>yazı hâli</b> görünür.</p>`,
      hint: 'Tuşlar çalışmazsa önce sayfaya bir kez tıklayın.',
      combo: ['Ctrl', 'KeyU'],
      on: (ev) => ev.type === 'web-source',
      done: 'Tarif bu: iki satırlık bir yazı. Tarayıcı bunu okuyup büyük başlığı ve paragrafı çizdi. Her web sayfasının arkasında böyle bir yazı vardır.',
    },
    {
      title: 'Not Defteri ile açın',
      html: `<p>Bu yazıyı değiştirebiliriz. ⊞ Başlat → <b>📝 Not Defteri</b>'ni açın. ${K('Ctrl', 'O')} (Aç) ile <b>Belgeler</b>'deki <b>sayfam.html</b>'yi seçip <b>Aç</b>'a basın.</p>`,
      hint: 'Not Defteri\'nde Dosya → Aç da olur. Açılan pencerede solda Belgeler seçili olsun.',
      on: (ev) => ev.type === 'open' && /^sayfam\.html$/i.test(ev.name),
      done: 'Sayfanın yazısı Not Defteri\'nde. Tarayıcıda gördüğünüzün aynısı, sadece işaretleriyle birlikte.',
    },
    {
      title: 'Bir kelime ekleyin',
      html: `<p>İlk satırda <b>Merhaba</b> kelimesinin hemen arkasına tıklayın ve bir boşluk bırakıp <b>adınızı</b> yazın. Satır şöyle olsun:</p><div class="target">&lt;h1&gt;Merhaba Ayşe&lt;/h1&gt;</div>
        <p>Köşeli işaretlere dokunmayın. Sonra ${K('Ctrl', 'S')} ile kaydedin.</p>`,
      hint: 'Fareyle “Merhaba” kelimesinin a harfinin hemen sağına tıklayın. İmleç < işaretinden önce durmalı. Bozduysanız Ctrl + Z.',
      on: (ev, c) => {
        if (ev.type !== 'save') return false;
        const t = String(pageFile(c)?.content || '');
        if (!/<h1>[^<]*<\/h1>/i.test(t)) { c.warn('Köşeli işaretlerden biri bozulmuş. Ctrl + Z ile geri alın, sadece Merhaba\'nın arkasına adınızı ekleyip yeniden kaydedin.'); return false; }
        if (!/<h1>\s*Merhaba\s+\S/i.test(t)) { c.note('Kaydedildi ama başlık hâlâ yalnızca “Merhaba”. Arkasına bir boşluk ve adınızı ekleyip yeniden kaydedin.'); return false; }
        return true;
      },
      done: 'Dosya değişti. Şimdi tarayıcı da yeni hâlini göstersin.',
    },
    {
      title: 'Tarayıcıda yenileyin',
      html: '<p>Alttaki görev çubuğundan <b>tarayıcıya</b> geçin. Sayfanın açık olduğu sekmeye tıklayıp <b>⟳ Yenile</b>\'ye basın.</p>',
      hint: 'Kaynak sekmesi değil, “Merhaba” başlığının göründüğü sekme. Yenile düğmesi adres çubuğunun solunda.',
      on: (ev, c) => {
        if (ev.type !== 'web-reload') return false;
        if (/^view-source:/.test(c.d.find('browser')?.api.url || '')) { c.note('Bu, kaynak sekmesi: yeni yazıyı gösteriyor. Şimdi soldaki <b>sayfam.html</b> sekmesine tıklayıp orada yenileyin.'); return false; }
        return /<h1>\s*Merhaba\s+\S/i.test(String(pageFile(c)?.content || ''));
      },
      done: 'Başlıkta artık adınız var! Web sitesi yapanlar da böyle çalışır: yazıyı değiştirir, tarayıcıda yenileyip sonucu görür.',
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
