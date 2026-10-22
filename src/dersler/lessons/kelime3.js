// 10. hafta ek dersleri: Word'de resim (boyut, Metni Kaydır: Kare / Sıkı, taşıma, kırpma) ve
// Biçim Boyacısı, satır aralığı, girintiler (MEB Word modülü).
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const W = (c) => c.d.find('word')?.api;
const pics = (c) => W(c)?.info().pics || [];
const pic = (c) => pics(c)[0];

const BAHCE = `<h1>Bahçemizdeki çiçekler</h1>
<p>Bu bahar apartmanın arka bahçesine hep birlikte çiçek diktik. Komşularımız fide getirdi, çocuklar sulamayı üstlendi. Toprak kazmak yorucu oldu ama akşam çayında herkes yaptığı işi gururla anlattı.</p>
<p>En çok sevilen ayçiçekleri oldu. Güneşe doğru dönüp duran bu büyük çiçekler, sabah balkondan bakınca insanın içini açıyor. Arılar da bahçeyi çok sevdi; artık her sabah vızıltılarıyla uyanıyoruz.</p>
<p>Sonbaharda lale soğanı dikmeyi planlıyoruz. Katkıda bulunmak isteyen komşularımız yönetime haber verebilir. Bahçe hepimizin; birlikte güzelleşiyor.</p>
<p>Apartman Yönetimi</p>`;

export const wordResim = {
  id: 'word-resim', icon: '🖼', title: 'Word\'de resim neden kaçıyor? Metni Kaydır: Kare ve Sıkı', minutes: 25, stage: 'desktop',
  desc: 'Resmi köşesinden küçültmek, Düzen Seçenekleri ile yazının yanına yerleştirmek, sürüklemek ve kırpmak.',
  summary: [
    ['Köşedeki yuvarlak', 'Resmi orantılı büyütür / küçültür (basıklaşmaz)'],
    ['Kenardaki tutamaç', 'Yalnızca eni ya da boyu değişir: resim basıklaşır, uzar'],
    ['⊞ Düzen Seçenekleri', 'Resmin hemen yanında; Metni kaydır seçenekleri'],
    ['Metinle aynı hizada', 'Resim bir harf gibi satırın içinde durur; sürükleyince satırlar bozulur'],
    ['Kare / Sıkı', 'Yazı resmin çevresinden akar; resmi istediğiniz yere sürüklersiniz'],
    ['Resim Biçimi → ✂ Kırp', 'Siyah çizgileri içeri çekin, sonra Enter: istemediğiniz yerler kesilir'],
  ],
  setup: (c) => { put(c, 'docs', 'bahçe duyurusu.docx', 'file', { html: BAHCE }); },
  steps: [
    {
      title: 'Resim yerinde durmuyor!',
      html: `<p>Word'e fotoğraf eklediğiniz anda dert başlar: fotoğraf kocaman çıkar, fareyle sürüklemek isteyince yerinden oynamaz ya da bütün satırları darmadağın eder. Sınıfta en çok sorulan sorulardan biri budur.</p>
        <p>Sebebi basit: Word yeni resmi <b>bir harf gibi</b> satırın içine koyar. Resme “yazının yanında dur” dediğimizde sorun çözülür.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', 'bahçe duyurusu.docx').id }); },
    },
    {
      title: 'Resmi ekleyin',
      html: '<p>İkinci paragrafın (<b>En çok sevilen ayçiçekleri…</b>) en başına tıklayın. Sonra <b>Ekle</b> sekmesinde <b>🖼 Resim</b>\'e tıklayıp <b>Resimler</b> klasöründen <b>çiçekler.jpg</b>\'yi açın.</p>',
      hint: 'Önce imleci paragrafın başına koyun (“En” kelimesinin soluna tıklayın). Resim imlecin olduğu yere girer.',
      check: (c) => pics(c).length > 0,
      on: (ev, c) => ev.type === 'doc-insert' && ev.what === 'picture' && pics(c).length > 0,
      done: 'Resim girdi ama kocaman ve satırın içine oturdu: yazı resmin altından devam ediyor.',
    },
    {
      title: 'Sürüklemeyi deneyin',
      html: '<p>Şimdi sorunu kendiniz görün: resmi fareyle tutup <b>sayfanın sağına</b>, yazının yanına sürükleyip bırakın.</p>',
      mouse: '🖱 Resmi tutup sağa sürükleyin',
      on: (ev) => ev.type === 'doc-img-move' && ev.wrap === 'inline',
      done: 'Gördünüz mü? Resim yazının yanına geçmedi; iki kelimenin arasına girdi ve satırları itti. Çünkü hâlâ “Metinle aynı hizada”. Şimdi bunu düzelteceğiz.',
    },
    {
      title: 'Köşeden küçültün',
      html: `<p>Önce boyutunu düzeltelim. Resme bir kez tıklayın; kenarlarında <b>tutamaçlar</b> belirir. <b>Köşedeki yuvarlaklardan</b> birini tutup içeri doğru sürükleyin; resim sayfanın <b>yarısından küçük</b> olsun.</p>`,
      mouse: '🖱 Köşedeki yuvarlak → içeri',
      hint: 'Kenarın ortasındaki küçük kareden tutarsanız resim basıklaşır. Köşedeki yuvarlağı kullanın.',
      check: (c) => pic(c) && pic(c).width < 45 && !pic(c).distorted,
      on: (ev, c) => {
        if (ev.type !== 'doc-img-resize') return false;
        if (ev.distorted) { c.warn('Resim basıklaştı ya da uzadı: kenardaki tutamaçtan tuttunuz. Üstteki Resim Biçimi → ↺ Resmi sıfırla ile düzeltin, sonra köşeden küçültün.'); return false; }
        if (ev.width >= 45) { c.note('Biraz daha küçültün; sayfanın yarısından az olsun.'); return false; }
        return true;
      },
      done: 'Resim orantılı küçüldü; basıklaşmadı.',
    },
    {
      title: 'Düzen Seçenekleri: Kare',
      html: '<p>Resim seçiliyken sağ üst köşesinin yanında küçük bir <b>⊞ Düzen Seçenekleri</b> düğmesi var. Ona tıklayın ve <b>Kare</b>\'yi seçin.</p>',
      mouse: '🖱 ⊞ → Kare',
      hint: 'Düğmeyi göremiyorsanız önce resme bir kez tıklayın. Ya da üstteki Resim Biçimi sekmesinde “Metni kaydır: Kare”.',
      check: (c) => pic(c)?.wrap === 'kare',
      on: (ev) => ev.type === 'doc-img-wrap' && ev.wrap === 'kare',
      done: 'Yazı artık resmin çevresinden akıyor; resim bir kutu gibi yazının yanında duruyor.',
    },
    {
      title: 'Şimdi istediğiniz yere taşıyın',
      html: '<p>Resmi tutup <b>üçüncü paragrafın</b> (<b>Sonbaharda lale…</b>) <b>sol</b> tarafına sürükleyin. Yazı kendiliğinden kenara çekilir.</p>',
      mouse: '🖱 Resmi tutup sola, alttaki paragrafa',
      hint: 'Fareyi bırakırken üçüncü paragrafın sol yarısının üzerinde olun.',
      check: (c) => pic(c)?.side === 'left' && pic(c)?.block === 3,
      on: (ev, c) => {
        if (ev.type !== 'doc-img-move') return false;
        if (pic(c)?.block !== 3) c.note('Resim başka bir paragrafa gitti. Üçüncü paragrafın (Sonbaharda lale…) üzerine bırakın.');
        else if (ev.side !== 'left') c.note('Doğru paragraf ama resim sağda kaldı. Sayfanın sol yarısına bırakın.');
        return pic(c)?.side === 'left' && pic(c)?.block === 3;
      },
      done: 'İşte bu! Resim istediğiniz yerde, yazı yanından düzgünce akıyor.',
    },
    {
      title: 'Sıkı: yazı daha yakın',
      html: '<p>Üstte yeni bir sekme belirdi: <b>Resim Biçimi</b>. Ona tıklayın ve <b>Metni kaydır: Sıkı</b>\'yı seçin. Yazı resme biraz daha yaklaşır.</p>',
      hint: 'Resim Biçimi sekmesi yalnızca resim seçiliyken görünür. Önce resme bir kez tıklayın.',
      check: (c) => pic(c)?.wrap === 'siki',
      on: (ev) => ev.type === 'doc-img-wrap' && ev.wrap === 'siki',
      done: 'Kare ile Sıkı benzer; Sıkı\'da yazı resmin kenarına daha çok yaklaşır (yuvarlak resimlerde resmin şeklini takip eder).',
    },
    {
      title: 'Fazlalığı kırpın',
      html: `<p>Fotoğrafın altında gereksiz boşluk var diyelim. <b>Resim Biçimi</b> sekmesinde <b>✂ Kırp</b>\'a tıklayın. Resmin kenarlarında <b>kalın siyah çizgiler</b> çıkar.</p>
        <p><b>Alttaki</b> siyah çizgiyi tutup yukarı çekin, sonra ${K('Enter')}\'a basın (ya da yeniden ✂ Kırp).</p>`,
      mouse: '🖱 ✂ Kırp → alttaki siyah çizgi yukarı → Enter',
      hint: 'Siyah çizgi resmin alt kenarının ortasında. Çekerken resmin kesilecek kısmı kaybolur.',
      on: (ev, c) => {
        if (ev.type === 'doc-img-cropmode') c.note('Kırpma açık. Siyah çizgilerden birini içeri çekin, sonra Enter.');
        return ev.type === 'doc-img-crop' && ev.any;
      },
      done: 'Resim kırpıldı. Kırpma geri alınabilir: ↺ Resmi sıfırla ile resmin tamamı geri gelir.',
    },
    {
      title: 'Kaydedin',
      html: `<p>Belgeyi ${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'Kaydedildi.',
    },
    rehberSoru({
      title: 'Hangi tutamaç?',
      html: '<p>Torununuzun fotoğrafını Word\'de küçültmek istiyorsunuz ama yüzü basıklaşmasın. Nereden tutarsınız?</p>',
      opts: ['Sağ kenarın ortasındaki tutamaçtan', 'Köşedeki yuvarlak tutamaçtan', 'Resmin ortasından'], ok: 1,
      wrong: 'Kenardan tutarsanız yalnızca eni değişir, yüz basıklaşır. Ortadan tutarsanız resim taşınır.',
      why: 'Doğru: köşeden tutunca en ve boy birlikte değişir, oran korunur.',
    }),
    rehberSoru({
      title: 'Neden kaçıyordu?',
      html: '<p>Resim sürüklenince satırları neden bozuyordu?</p>',
      opts: ['Resim bozuk olduğu için', 'Word yeni resmi “Metinle aynı hizada” (bir harf gibi) koyduğu için', 'Bilgisayar yavaş olduğu için'], ok: 1,
      wrong: 'Resimde ya da bilgisayarda sorun yoktu; Word\'ün resmi nasıl yerleştirdiğiyle ilgiliydi.',
      why: 'Doğru. Düzen Seçenekleri\'nden Kare ya da Sıkı seçince resim serbestçe taşınır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Word\'de resimler artık sizin dediğiniz yerde duruyor:</p>' },
  ],
};

const TUTANAK = `<h1>Apartman Toplantı Tutanağı</h1>
<p><span style="color:#1f4e79;font-size:14pt"><b>1. Gündem</b></span></p>
<p style="line-height:1">Çatı tamiri, bahçe düzenlemesi ve asansör bakımı konuşuldu. Toplantıya 14 daireden 11'i katıldı. Yönetici geçen yılın hesaplarını okudu.</p>
<p>2. Kararlar</p>
<p style="line-height:1">Çatı tamiri için üç ustadan teklif alınacak. En uygun teklif Kasım ayında yönetime sunulacak. Asansör bakımı her ay düzenli yapılacak.</p>
<p>3. Aidatlar</p>
<p style="line-height:1">Aidatlar Ocak ayından itibaren 750 TL olacak. Ödemeler ayın 10'una kadar yönetim hesabına yapılacak.</p>
<p>4. Diğer konular</p>
<p style="line-height:1">Bahçeye iki bank konulacak. Çocuk parkının kum havuzu yenilenecek.</p>
<p style="line-height:1">Not: Bir sonraki toplantı 15 Aralık Salı saat 19.00'da yapılacak.</p>`;

const bloklar = (c) => W(c)?.info().blocks || [];
// Başlık, ilk başlıkla aynı biçimde mi (kalın, büyük, aynı renk)?
const ayni = (c, i) => { const b = bloklar(c), ilk = b[1], x = b[i]; return !!(ilk && x && x.bold && x.size >= 13 && x.colors.length === 1 && x.colors[0] === ilk.colors[0]); };
const govde = (c) => [...(W(c)?.page.children || [])].filter((p) => p.tagName === 'P' && p.innerText.trim().length > 40);

export const bicimBoyacisi = {
  id: 'bicim-boyacisi', icon: '🖌', title: 'Biçim Boyacısı, satır aralığı ve girintiler', minutes: 25, stage: 'desktop',
  desc: 'Bir başlığın biçimini tek tıkla ötekilere kopyalamak, sıkışık yazıyı 1,5 satır aralığıyla açmak, paragraf başı ve girinti.',
  summary: [
    ['🖌 bir kez tıklayın', 'Seçili yazının biçimini alır; bir sonraki seçtiğiniz yere sürer'],
    ['🖌 çift tıklayın', 'Boyacı kilitlenir: birçok yere sürersiniz; bitince Esc'],
    ['Satır aralığı 1,15 / 1,5', 'Sıkışık yazıyı ferahlatır; resmî yazılarda 1,5 çok kullanılır'],
    [K('Tab') + ' paragrafın başında', 'Paragraf başı (ilk satır girintisi)'],
    ['⇥ / ⇤', 'Bütün paragrafı içeri alır / geri çeker'],
    [K('Ctrl', 'A'), 'Bütün belgeyi seçer'],
  ],
  setup: (c) => { put(c, 'docs', 'toplantı tutanağı.docx', 'file', { html: TUTANAK }); },
  steps: [
    {
      title: 'Bir başlık güzel, ötekiler sade',
      html: `<p>Apartman toplantısının tutanağını yazdınız. <b>“1. Gündem”</b> başlığını uğraşıp güzelleştirdiniz: kalın, büyük, lacivert. Ama öbür başlıklar sade kaldı, yazılar da sıkış tıkış.</p>
        <p>Her başlık için yazı tipini, boyutu, rengi tek tek seçmek yerine <b>Biçim Boyacısı</b> (🖌 fırça) kullanılır: bir yerin biçimini alır, başka yere sürer.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', 'toplantı tutanağı.docx').id }); },
    },
    {
      title: 'Boyacıyla bir başlık',
      html: `<ol class="steps"><li><b>1. Gündem</b> yazısının içine bir kez tıklayın.</li><li><b>Giriş</b> sekmesinde, Yapıştır'ın yanındaki <b>🖌 Biçim Boyacısı</b>\'na <b>bir kez</b> tıklayın. Fare işaretçisi fırçaya döner.</li>
        <li><b>2. Kararlar</b> yazısını fareyle sürükleyerek boyayın (seçin). Bıraktığınız anda biçim kopyalanır.</li></ol>`,
      mouse: '🖱 1. Gündem → 🖌 → 2. Kararlar\'ı boyayın',
      hint: 'Fırçaya tıkladıktan sonra başka bir yere tıklamadan, doğrudan “2. Kararlar” yazısının üzerinde basılı tutup sürükleyin.',
      check: (c) => ayni(c, 3),
      on: (ev, c) => {
        if (ev.type === 'doc-painter' && ev.stage === 'apply' && !ayni(c, 3)) c.note('Biçim başka bir yere sürüldü. Ctrl + Z ile geri alıp yeniden deneyin: önce 1. Gündem, sonra 🖌, sonra 2. Kararlar.');
        return ev.type === 'doc-painter' && ayni(c, 3);
      },
      done: '“2. Kararlar” da kalın, büyük ve lacivert oldu. Fırça bir kez kullanılınca kendiliğinden bırakıldı.',
    },
    {
      title: 'Çift tık: birçok yere',
      html: `<p>Daha iki başlık var. Bu sefer <b>🖌 fırçaya çift tıklayın</b>: kilitlenir ve siz bırakana kadar elinizde kalır.</p>
        <p><b>3. Aidatlar</b> ve <b>4. Diğer konular</b> yazılarını sırayla boyayın. Bitince ${K('Esc')}'ye basın.</p>`,
      mouse: '🖱 Biçimli başlığa tıklayın → 🖌 çift tık → iki başlığı boyayın → Esc',
      hint: 'İmleç biçimli bir başlığın (1. ya da 2.) içindeyken fırçaya çift tıklayın; fırçanın çevresinde turuncu çerçeve çıkar.',
      check: (c) => ayni(c, 5) && ayni(c, 7),
      on: (ev, c) => {
        if (ev.type === 'doc-painter' && ev.stage === 'apply' && !ev.sticky && !(ayni(c, 5) && ayni(c, 7))) c.note('Fırça bir kez kullanılıp bırakıldı. Kalanlar için fırçaya ÇİFT tıklayın.');
        return ev.type === 'doc-painter' && ayni(c, 5) && ayni(c, 7);
      },
      done: 'Dört başlık da aynı oldu. Fırça kilitliyse Esc ile bırakın.',
    },
    {
      title: 'Sıkışık yazıyı açın: satır aralığı',
      html: `<p>Paragraflar sıkış tıkış. ${K('Ctrl', 'A')} ile bütün belgeyi seçin, sonra <b>Giriş</b> sekmesinde girinti düğmelerinin (⇤ ⇥) yanındaki <b>satır aralığı</b> kutusundan <b>1,5</b>'i seçin.</p>`,
      combo: ['Ctrl', 'KeyA'],
      hint: 'Fırça hâlâ elinizdeyse önce Esc. Satır aralığı kutusunda 1,15 yazar; açıp 1,5\'i seçin.',
      check: (c) => govde(c).length > 0 && govde(c).every((p) => parseFloat(p.style.lineHeight) >= 1.7),
      on: (ev, c) => ev.type === 'doc-format' && ev.cmd === 'lineHeight' && govde(c).every((p) => parseFloat(p.style.lineHeight) >= 1.7),
      done: 'Yazı ferahladı; okumak çok daha kolay. Dilekçe ve resmî yazılarda 1,5 satır aralığı sık istenir.',
    },
    {
      title: 'Paragraf başı: Tab',
      html: `<p>Paragrafların ilk satırı biraz içeriden başlasın. <b>Çatı tamiri, bahçe düzenlemesi…</b> paragrafının <b>en başına</b> (ilk harfin soluna) tıklayın ve ${K('Tab')}'a basın.</p>`,
      keys: ['Tab'],
      hint: 'İmleç tam “Çatı” kelimesinin solunda olmalı. Home tuşu imleci satırın başına götürür.',
      on: (ev) => ev.type === 'doc-indent' && ev.kind === 'first',
      done: 'İlk satır içeriden başladı. Boşluk tuşuna basıp durmak yerine Tab kullanın; satırlar hizalı kalır.',
    },
    {
      title: 'Bütün paragrafı içeri alın: ⇥',
      html: '<p>En alttaki <b>Not:</b> paragrafı öne çıksın. İçine bir kez tıklayın ve <b>Giriş</b> sekmesindeki <b>⇥ Girintiyi artır</b> düğmesine basın.</p>',
      hint: '⇥ düğmesi madde işaretlerinin yanında. Geri çekmek için yanındaki ⇤.',
      on: (ev) => ev.type === 'doc-format' && ev.cmd === 'indent',
      done: 'Not paragrafı bütünüyle içeri alındı. Tab yalnızca ilk satırı, ⇥ bütün paragrafı içeri alır.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'Tutanak kaydedildi; düzenli ve okunaklı.',
    },
    rehberSoru({
      title: 'Boyacıyı kilitlemek',
      html: '<p>Bir başlığın biçimini <b>on başlığa</b> birden sürmek istiyorsunuz. Ne yaparsınız?</p>',
      opts: ['🖌\'ya bir kez tıklarım, her başlıkta yeniden tıklarım', '🖌\'ya çift tıklarım; bitince Esc', 'Her başlığı tek tek biçimlendiririm'], ok: 1,
      wrong: 'Olur ama uzun sürer. Fırçayı elinizde tutmanın yolu vardı.',
      why: 'Doğru: çift tık fırçayı kilitler, Esc bırakır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Belgeleriniz artık derli toplu:</p>' },
  ],
};
