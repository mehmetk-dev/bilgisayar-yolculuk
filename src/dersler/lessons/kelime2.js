// 10. hafta ek dersleri: apartman duyurusu, sayfa düzeni ve yazdırma, tablo incelikleri, simgeler ve şekiller, dilekçe parkuru
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], text: '', tables: 0, images: 0, layout: {}, pages: 1, table: null };
const block = (c, word) => info(c).blocks.find((b) => norm(b.text).includes(norm(word)));
const wordOpen = (c) => maxed(c, 'word');
const formatEvents = ['doc-format', 'doc-input', 'doc-shortcut', 'doc-insert', 'doc-cell', 'doc-layout', 'doc-table'];
const when = (test) => (ev, c) => formatEvents.includes(ev.type) && !!test(c);
const today = () => new Date().toLocaleDateString('tr-TR');
const BLACK = 'rgb(0, 0, 0)';

// Belgeler klasörüne hazır bir belge koyup Kelime İşlemci'de açar
function openDoc(c, name, html, layout = {}) {
  let n = c.d.fs.find('docs', name);
  if (!n) n = c.d.fs.create('docs', { type: 'file', name, content: { html, layout } });
  const w = c.d.ensure('word', { node: n.id });
  if (!w.max) c.d.maximize(w);
  return w;
}

const P = (t) => `<p>${t}</p>`;

export const apartmanDuyuru = {
  id: 'apartman-duyuru', icon: '📢', title: 'Apartman duyurusu hazırlayalım', minutes: 40, stage: 'desktop',
  desc: 'Başlık, renk, çerçeve; tek kâğıda sığdırıp yazdırma önizlemesi.',
  summary: [
    ['Başlık', 'Ortalı, büyük (24–28 punto), kalın'],
    ['Önemli satır', 'Renk ya da kalın: gözün hemen gördüğü yer'],
    ['Düzen → Sayfa kenarlığı', 'Sayfanın çevresine çerçeve çizer'],
    ['Ctrl + P', 'Yazdırma önizlemesi: kâğıtta nasıl çıkacağını gösterir'],
    ['Tek kâğıt', 'Önizlemede “tek kâğıda sığıyor” yazmalı; taşıyorsa yazıyı küçültün'],
    ['Ctrl + S', 'Kaydet; adı anlaşılır olsun'],
  ],
  steps: [
    {
      title: 'Apartman duyurusu',
      html: `<p>Apartmanın girişine asılan duyuru her gün onlarca komşunuzun gözüne çarpar: toplantı, su kesintisi, asansör bakımı…</p>
        <p>İyi bir duyuru <b>uzaktan okunur</b>: büyük başlık, ortalı yazı, önemli satırın rengi ve çerçeve.</p>
        <p>Bugün <b>cumartesi günü bahçe toplantısı</b> için bir duyuru hazırlayacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Programı açın',
      html: '<p>⊞ Başlat → <b>📘 Kelime İşlemci</b>.</p>',
      check: (c) => !!c.d.find('word'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'word',
    },
    {
      title: 'Başlığı yazın',
      html: `<p>Sayfaya tıklayın, başlığı büyük harfle yazın: <b>DUYURU</b>. ${K('Enter')} ile alt satıra geçin.</p>`,
      setup: wordOpen,
      on: when((c) => { const b = info(c).blocks; return b.length >= 2 && norm(b[0].text) === 'duyuru'; }),
    },
    {
      title: 'Başlığı büyütüp ortalayın',
      html: `<p>“DUYURU”ya üç kez tıklayıp seçin. Sonra:</p>
        <ul class="big-list"><li><b>Ortala</b> (${K('Ctrl', 'E')})</li><li>Yazı boyutunu <b>28</b> yapın</li><li><b>Kalın</b> (${K('Ctrl', 'B')})</li></ul>`,
      hint: 'Boyut kutusu şeritte “11” yazan yer; açılır listeden 28\'i seçin.',
      on: when((c) => { const b = block(c, 'duyuru'); return b && b.align === 'center' && b.size >= 24 && b.bold; }),
      done: 'Büyük, kalın ve ortada: uzaktan okunur.',
    },
    {
      title: 'Metni yazın',
      html: `<p>Başlığın altındaki satırlara şunları yazın (her biri ayrı satır, ${K('Enter')} ile):</p>
        <div class="target">Sayın apartman sakinleri,</div><div class="target">Cumartesi günü saat 14.00'te bahçede toplantı yapılacaktır.</div><div class="target">Katılımınızı rica ederiz.</div>
        <p class="mut">Başlığı ortaladıktan sonra alt satır da ortalı kalmış olabilir. Alt satıra geçince <b>Sola Hizala</b>\'ya (${K('Ctrl', 'L')}) basın.</p>`,
      hint: 'Satırlar ortalı geliyorsa Ctrl + L ile sola hizalayın.',
      on: when((c) => block(c, 'sayın apartman') && block(c, 'cumartesi') && block(c, 'rica ederiz')),
    },
    {
      title: 'Önemli satırı renklendirin',
      html: `<p>En önemli satır <b>tarih ve saat</b>. “Cumartesi günü…” satırını üç tıkla seçin; şeritteki <b>A</b> (yazı rengi) düğmesine tıklayın; açılan renklerden <b>kırmızı</b> olanı seçin. İsterseniz kalın da yapın.</p>`,
      hint: 'Yazı rengi düğmesi “A” harfi ve altında renkli çizgi. Tıklayınca renk paleti açılır.',
      on: when((c) => { const b = block(c, 'cumartesi'); return b && b.colors.some((x) => x !== BLACK); }),
      done: 'Kırmızı satır dikkat çekiyor. Çok renk kullanmayın: bir ya da iki yeterli.',
    },
    {
      title: 'Çerçeve ekleyin',
      html: '<p><b>Düzen</b> sekmesine tıklayın, <b>Sayfa kenarlığı</b> yanındaki <b>▣ Kutu</b>\'ya tıklayın. Sayfanın çevresine çerçeve gelir.</p>',
      mouse: '🖱 Düzen → Sayfa kenarlığı → Kutu',
      on: (ev) => ev.type === 'doc-layout' && ev.border === 'kutu',
      done: 'Çerçeve duyuruyu sayfadan ayırıyor. Bir de “Çift çizgi” seçeneği var.',
    },
    {
      title: 'Yazdırma önizlemesi',
      html: `<p>${K('Ctrl', 'P')}'ye basın. Karşınıza <b>yazdırma önizlemesi</b> çıkar: kâğıtta nasıl görüneceğini küçük resimde görürsünüz. Altında <b>tek kâğıda sığıp sığmadığı</b> yazar.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'doc-print-open',
      done: 'Önizlemede duyuru çerçevesiyle birlikte görünüyor.',
    },
    {
      title: 'Yazdırın',
      html: '<p>Önizlemeyi inceleyin: belge tek kâğıda sığıyorsa <b>🖨 Yazdır</b>\'a tıklayın.</p>',
      hint: 'Önizlemenin altındaki yazıda “tek kâğıda sığıyor” görünmeli. Taşıyorsa metni kısaltın.',
      on: (ev, c) => {
        if (ev.type !== 'doc-print') return false;
        if (ev.pages > 1) c.warn(`Belge ${ev.pages} sayfa. Duyurunun tek kâğıda sığması gerekir; yazı boyutunu küçültüp yeniden yazdırın.`);
        return ev.pages === 1;
      },
      done: 'Yazdır\'a bastınız. Gerçek yazıcı seçiliyse duyuru kâğıda çıkar; “PDF olarak kaydet” seçiliyse dosya olarak kaydedilir.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Belgeler</b> klasörüne <b>apartman duyurusu</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev, c) => {
        if (ev.type !== 'doc-save') return false;
        if (!/duyuru/i.test(ev.name)) { c.note(`“${ev.name}” olarak kaydedildi. Adı <b>apartman duyurusu</b> yapın: Dosya → Farklı kaydet.`); return false; }
        return true;
      },
    },
    rehberSoru({
      title: 'Hangisi iyi duyuru?',
      html: '<p>Merdivene asılacak bir duyuruyu 3 metreden okunur yapmak için en önemli şey nedir?</p>',
      opts: ['Küçük yazı, çok bilgi', 'Büyük başlık, kısa cümleler, önemli satırda renk ya da kalın', 'Her satırı farklı renk ve yazı tipiyle yazmak'], ok: 1,
      wrong: 'Bu uzaktan okunmaz. Daha sade bir düzen düşünün.',
      why: 'Evet: büyük başlık, kısa cümleler ve tek bir vurgu. Çok renk, gözü yorar ve kafa karıştırır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Apartmana asacağınız duyuruyu hazırladınız:</p>' },
  ],
};

// Birkaç satırı ikinci kâğıda taşan belge: toplantı tutanağı
const TUTANAK = `<h1>APARTMAN YÖNETİM KURULU TOPLANTI TUTANAĞI</h1>
${[
  'Toplantı 11 Ekim pazar günü saat 14.00\'te bahçede yapılmıştır. 14 daire sahibi toplantıya katılmıştır.',
  'Gündemin birinci maddesi olan asansör bakımı görüşülmüş, aylık bakım ücretinin 450 TL olarak sürdürülmesi oy birliğiyle kabul edilmiştir.',
  'İkinci madde olan bahçe düzenlemesi için komşulardan ağaç dikim önerileri alınmıştır. Dut ve kiraz ağaçları önerilmiştir.',
  'Üçüncü madde olarak çöp toplama saatleri yeniden düzenlenmiş, çöplerin akşam 19.00\'dan sonra bahçe kapısının yanındaki kutulara bırakılması kararlaştırılmıştır.',
  'Dördüncü madde, apartman girişindeki aydınlatmanın hareket sensörlü lambalarla yenilenmesidir. Konu için üç firmadan teklif alınacaktır.',
  'Beşinci madde olan çatı yalıtımı için bahar aylarında keşif yapılması uygun görülmüştür.',
  'Altıncı madde olarak güvenlik kamerasının kapı girişine takılması oylanmış, çoğunlukla kabul edilmiştir.',
  'Yedinci madde ortak alanların temizliği için çalışan kişiye verilecek ücretin 4.500 TL olması yönünde karara varılmıştır.',
  'Sekizinci madde, aidatların her ayın beşinde yönetime teslim edilmesidir.',
  'Dokuzuncu madde: su sayacı okuma günü her ayın ilk haftası olarak belirlenmiştir.',
  'Onuncu madde olarak dilek ve temenniler alınmıştır.',
  'On birinci madde olarak bahçedeki oyun alanının yenilenmesi için çocuk sahibi aileler görüşlerini yazılı olarak yönetime iletecektir.',
  'On ikinci madde: kış aylarında kazan dairesinin çalışma saatleri sabah altı ile gece on arasında olarak yeniden düzenlenmiştir.',
  'On üçüncü madde, apartman girişine konulacak yeni zil panelinin renkli ve numaralı olmasıdır. Fiyat araştırması komşulardan biri tarafından yapılacaktır.',
  'On dördüncü madde olarak komşuların birbirini haberdar etmesi için apartman girişine bir duyuru panosu asılmasına karar verilmiştir.',
  'Başka söz alan olmadığından, bir sonraki toplantı Kasım ayının ilk pazar günü yapılmak üzere toplantıya son verilmiştir.',
  'Saygılarımızla,',
  'Yönetim Kurulu',
].map(P).join('')}`;

export const sayfaDuzeni = {
  id: 'sayfa-duzeni', icon: '📄', title: 'Sayfa düzeni ve yazdırma hataları', minutes: 35, stage: 'desktop',
  desc: 'Kâğıdı yatay/dikey yapmak, kenar boşlukları, filigran, yeni sayfa.',
  summary: [
    ['Düzen → Kenar boşlukları', 'Dar yaparsanız sayfaya daha çok yazı sığar'],
    ['Düzen → Yönlendirme', 'Dikey (mektup), Yatay (geniş tablo)'],
    ['Yazı taştı', 'Önizlemede “2 sayfa” yazıyorsa boşluğu daraltın ya da yazıyı küçültün'],
    ['Filigran', 'ÖRNEKTİR, ACİL gibi silik arka plan yazısı'],
    ['Ctrl + Enter', 'Yeni sayfa açar; Enter\'a defalarca basmayın'],
    ['Ctrl + P', 'Yazdırmadan önce hep önizlemeye bakın'],
  ],
  steps: [
    {
      title: 'Taşan son satırlar',
      html: `<p>Yazdırınca <b>son iki satır</b> ikinci kâğıda geçip kâğıt israfına yol açıyor mu? Ya da bir çizelge dikey kâğıda sığmıyor mu? Bunlar <b>sayfa düzeniyle</b> çözülür.</p>
        <p>Önce sorunu görelim: bir toplantı tutanağı açtık.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); openDoc(c, 'toplantı tutanağı.docx', TUTANAK); },
    },
    {
      title: 'Önizlemeye bakın',
      html: `<p>${K('Ctrl', 'P')}'ye basın ve önizlemeyi okuyun: kaç sayfa? Sonra <b>İptal</b>'e basarak kapatın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      setup: (c) => openDoc(c, 'toplantı tutanağı.docx', TUTANAK),
      on: (ev, c) => { if (ev.type === 'doc-print-open' && ev.pages === 1) c.note('Bu belge zaten tek sayfa. Belgeyi baştan açıp (ders başında) tekrar deneyin.'); return ev.type === 'doc-print-open'; },
      done: 'Belge birkaç satırla <b>ikinci sayfaya taşıyor</b>. Kâğıt israfı olmasın diye tek sayfaya sığdıralım.',
    },
    {
      title: 'Kenar boşluklarını daraltın',
      html: '<p><b>Düzen</b> sekmesinde <b>Kenar boşlukları</b> yanındaki <b>Dar</b>\'a tıklayın. Kenar boşluğu azalınca sayfaya daha çok satır sığar.</p>',
      hint: 'Düzen sekmesi, üstteki sekmelerde Ekle\'nin hemen sağındadır. Kenar boşlukları: Normal, Dar, Geniş.',
      on: (ev, c) => {
        if (ev.type !== 'doc-layout') return false;
        if (ev.margin !== 'dar') { c.note('Bu sefer “Dar”ı seçin.'); return false; }
        if (info(c).pages > 1) c.note(`Hâlâ ${info(c).pages} sayfa. Yazı boyutunu küçültmeyi de deneyin (Giriş → boyut 11 → 10).`);
        return true;
      },
      done: (c) => `Kenarlar daraldı. Belge şimdi ${info(c).pages} sayfa.`,
    },
    {
      title: 'Önizlemeyle doğrulayın',
      html: `<p>${K('Ctrl', 'P')} ile önizlemeyi yeniden açın. Şimdi <b>tek sayfa</b> yazmalı. Sonra <b>İptal</b>'e basarak kapatın.</p>
        <p class="mut">Hâlâ iki sayfa yazıyorsa <b>Ctrl + A</b> ile hepsini seçip yazı boyutunu <b>10</b> yapın ve yine bakın. Yazıyı çok küçültmeyin; 10 punto okunur olmalı.</p>`,
      combo: ['Ctrl', 'KeyP'],
      hint: 'Önizlemenin altında sayfa sayısı yazar. İki sayfa görünüyorsa önce Giriş → boyut 10 deneyin.',
      on: (ev, c) => {
        if (ev.type !== 'doc-print-open') return false;
        if (ev.pages > 1) { c.note(`Önizleme ${ev.pages} sayfa. İptal'e basın, yazı boyutunu 10 yapın ve yine ${K('Ctrl', 'P')} ile bakın.`); return false; }
        return true;
      },
      done: 'Tek sayfa oldu. Önemli: önce kenar boşluğu, sonra yazı boyutu.',
    },
    {
      title: 'Yatay kâğıt',
      html: '<p>Geniş bir çizelge ya da afiş için kâğıt <b>yatay</b> yapılır. <b>Düzen → Yönlendirme → ▭ Yatay</b>\'a tıklayın, sonra yine <b>Dikey</b>\'e dönün.</p>',
      on: (ev, c) => { if (ev.type === 'doc-layout' && ev.orient === 'yatay') c.s.y = true; return ev.type === 'doc-layout' && ev.orient === 'dikey' && c.s.y; },
      done: 'Yatay: geniş tablo ve fotoğraf; dikey: mektup ve dilekçe.',
    },
    {
      title: 'Filigran',
      html: '<p>Taslak bir belgenin her sayfasında silik bir yazı görünsün istiyorsunuz. <b>Düzen → Filigran → ÖRNEKTİR</b>\'e tıklayın.</p>',
      on: (ev) => ev.type === 'doc-layout' && ev.wm === 'ÖRNEKTİR',
      done: 'Sayfanın ortasında silik “ÖRNEKTİR” görünür; yazıyı etkilemez. Yazdırınca da çıkar. Kaldırmak için “Yok”.',
    },
    {
      title: 'Filigranı kaldırın',
      html: '<p>Şimdi <b>Filigran</b> satırındaki <b>Yok</b>\'a tıklayarak filigranı kaldırın. (Yanlışlıkla <b>Sayfa kenarlığı</b> satırındaki Yok\'a basmayın.)</p>',
      on: (ev) => ev.type === 'doc-layout' && ev.wm === '',
      done: 'Filigran kalktı. İstediğiniz zaman yeniden ekleyebilirsiniz.',
    },
    {
      title: 'Yeni sayfa: Ctrl + Enter',
      html: `<p>Sayfayı <b>aşağı kaydırın</b>. “Saygılarımızla,” satırının <b>başına</b> tıklayın ve ${K('Ctrl', 'Enter')}'a basın: imza kısmı yeni sayfadan başlar.</p>
        <p class="mut">Yeni sayfaya geçmek için Enter'a onlarca kez basmayın; yazı değişince o boşluklar bozulur.</p>`,
      combo: ['Ctrl', 'Enter'],
      hint: 'Satırın başına gelmek için tıkladıktan sonra Home tuşuna basın.',
      on: (ev) => ev.type === 'doc-insert' && ev.what === 'pagebreak',
      done: 'Sayfa sonu eklendi. Gri “Sayfa sonu” çizgisi görünür; yazdırmada görünmez.',
    },
    rehberSoru({
      title: 'Hangisi çözüm?',
      html: '<p>Belgenin son iki satırı ikinci sayfaya taşıyor. En doğru çözüm hangisidir?</p>',
      opts: ['Enter\'a basarak sayfayı boşlukla doldururum', 'Kenar boşluklarını daraltır ya da yazıyı bir punto küçültürüm', 'İkinci sayfayı silerim'], ok: 1,
      wrong: 'Bu pek çözüm sayılmaz. Düzen sekmesindeki ayarlara bakın.',
      why: 'Evet. Kenar boşluğunu daraltmak ya da yazıyı biraz küçültmek sayfa sayısını azaltır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sayfa düzeni artık sorun değil:</p>' },
  ],
};

const AIDAT = `<p><b>Daire aidat çizelgesi (Ekim)</b></p>
<table class="wd-t"><tr><td><b>Daire</b></td><td><b>Ad Soyad</b></td><td><b>Aidat (₺)</b></td></tr><tr><td>1</td><td>Fatma Yıldız</td><td>450</td></tr><tr><td>2</td><td>Ahmet Demir</td><td>450</td></tr><tr><td>3</td><td>Ayşe Kaya</td><td>450</td></tr></table><p><br></p>`;

export const tabloInce = {
  id: 'tablo-ince', icon: '📋', title: 'Tablo incelikleri: aidat ve nöbet çizelgesi', minutes: 35, stage: 'desktop',
  desc: 'Tabloya satır ve sütun eklemek, hücreleri birleştirmek, çizgileri kalınlaştırmak.',
  summary: [
    ['Tabloya tıklayın', 'Sekmelerin yanında “Tablo Düzeni” çıkar'],
    ['↓ Alta ekle / ↑ Üste ekle', 'Yeni satır'],
    ['→ Sağa ekle / ← Sola ekle', 'Yeni sütun'],
    ['✕ Satırı sil, ✕ Sütunu sil', 'İşe yaramayanı kaldırır'],
    ['Hücreleri birleştir', 'Yan yana hücreleri sürükleyerek seçin, sonra düğme'],
    ['Çizgiler → Kalın', 'Yazdırınca çizgiler belirgin olur'],
    ['Hücre içi → Orta', 'Yazıyı hücrenin ortasına alır'],
  ],
  steps: [
    {
      title: 'Aidat çizelgesi',
      html: `<p>Apartman aidatını ya da nöbet listesini <b>tabloda</b> tutmak çok işe yarar. Tablo bir kez kurulur, sonradan <b>satır ve sütun eklenip silinebilir</b>.</p>
        <p>Önünüzde 3 daireli bir aidat çizelgesi var. Birlikte düzenleyeceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); openDoc(c, 'aidat çizelgesi.docx', AIDAT); },
    },
    {
      title: 'Tablo Düzeni',
      html: '<p>Tablonun <b>içine</b> (örneğin “Fatma Yıldız” yazan hücreye) tıklayın. Üstte sekmelerin sağında <b>Tablo Düzeni</b> çıkar. Ona tıklayın.</p>',
      setup: (c) => openDoc(c, 'aidat çizelgesi.docx', AIDAT),
      hint: 'Tabloya tıklamadan sekme görünmez. Önce hücreye tıklayın.',
      on: (ev) => ev.type === 'doc-tab' && ev.tab === 'table',
      done: 'Satır, sütun, birleştirme ve çizgi düğmeleri burada.',
    },
    {
      title: 'Yeni komşu: satır ekleyin',
      html: '<p>Tablonun <b>son satırındaki</b> bir hücreye tıklayıp <b>↓ Alta ekle</b>\'ye basın. Yeni satıra <b>4</b>, <b>Zeynep Aksoy</b>, <b>450</b> yazın (Tab ile hücreler arasında gezin).</p>',
      hint: 'Tablo Düzeni sekmesi, hücreye tıklayınca görünür. Yazarken Tab bir sonraki hücreye geçirir.',
      on: when((c) => { const t = info(c).table; return t && t.rows >= 5 && norm(info(c).text).includes('zeynep aksoy'); }),
      done: 'Dördüncü komşu tabloya eklendi.',
    },
    {
      title: 'Sütun ekleyin',
      html: '<p>Aidatın ödenip ödenmediğini göstermek için bir sütun gerekiyor. <b>Aidat</b> sütunundaki bir hücreye tıklayın, <b>→ Sağa ekle</b>\'ye basın. İlk satıra (başlığa) <b>Ödendi</b> yazın.</p>',
      on: when((c) => { const t = info(c).table; return t && t.cols >= 4 && norm(info(c).text).includes('ödendi'); }),
      done: 'Dördüncü sütun hazır. Her satıra ✔ koyabilirsiniz.',
    },
    {
      title: 'Fazlalığı silin',
      html: '<p>Zeynep Aksoy taşındı. Onun satırında bir hücreye tıklayıp <b>✕ Satırı sil</b>\'e basın.</p>',
      on: when((c) => { const t = info(c).table; return t && t.rows === 4 && !norm(info(c).text).includes('zeynep aksoy'); }),
      done: 'Satır silindi; tablo yeniden 3 daire.',
    },
    {
      title: 'Üstte tek parça başlık',
      html: `<ol class="steps"><li>Başlık satırındaki bir hücreye tıklayın, <b>↑ Üste ekle</b>'ye basın. Tablonun en üstünde boş bir satır belirir.</li>
        <li>O boş satırdaki <b>tüm hücreleri</b> fareyle soldan sağa <b>sürükleyerek</b> seçin (mavi olur).</li><li><b>⊞ Hücreleri birleştir</b>'e basın.</li><li>Tek büyük hücreye <b>AİDAT ÇİZELGESİ</b> yazın. (Birleştirince Tablo Düzeni sekmesi kapanabilir; tabloya tekrar tıklamanız yeter.)</li></ol>`,
      hint: 'Sürükleyerek seçerken fare tuşunu bırakmadan üç hücrenin üzerinden geçin. Sonra birleştirin. Birleştirince Tablo Düzeni sekmesi kapanabilir: tabloya tekrar tıklayın.',
      on: when((c) => { const cell = W(c)?.page.querySelector('table')?.rows[0]?.cells[0]; return !!cell && cell.colSpan > 1 && norm(cell.textContent).includes('aidat çizelgesi'); }),
      done: 'Başlık artık tabloyu baştan sona kaplıyor. Çizelgelerde başlık böyle yapılır.',
    },
    {
      title: 'Çizgileri kalınlaştırın',
      html: '<p>Tablodayken <b>Çizgiler → Kalın</b>\'a tıklayın. Fotokopide çizgilerin kaybolmaması için kalın çizgi iyidir.</p>',
      on: when((c) => info(c).table?.thick),
    },
    {
      title: 'Hücre içini ortalayın',
      html: '<p>Tablodaki hücrelerin üzerinden sürükleyerek tabloyu seçin (ya da bir hücreye tıklayın) ve <b>Hücre içi → ↕ Orta</b>\'ya tıklayın. Yazı hücrenin dikey ortasında durur.</p>',
      on: when((c) => info(c).table?.valign),
      done: 'Hücre içi hizalama, yüksek satırlarda düzgün görünüm sağlar.',
    },
    rehberSoru({
      title: 'Hangi düğme?',
      html: '<p>Tablonun en üstüne tek parça bir başlık koymak istiyorsunuz. Yan yana üç hücreyi seçip hangi düğmeye basarsınız?</p>',
      opts: ['Hücreleri birleştir', 'Sütunu sil', 'Tabloyu sil'], ok: 0,
      wrong: 'Bu satırı ya da tabloyu kaldırır. Birleştirmenin düğmesi hangisi?',
      why: 'Evet: Hücreleri birleştir. Üç hücre tek hücre olur, başlık tabloyu baştan sona kaplar.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tabloları sonradan değiştirebiliyorsunuz:</p>' },
  ],
};

// Sayfadaki şekillerin yazıları (küçük harf, boşluksuz kenar)
const shapeTexts = (c) => [...(W(c)?.page.querySelectorAll('.wd-shape') || [])].map((x) => norm(x.textContent));

export const simgeSekil = {
  id: 'simge-sekil', icon: '🔣', title: 'Simgeler ve şekiller: ₺, °C, ½, ©', minutes: 25, stage: 'desktop',
  desc: '₺ °C ½ © gibi simgeleri eklemek, şekillerin içine yazı yazmak.',
  summary: [
    ['Ekle → Simge', 'Klavyede olmayan işaretleri verir: ₺ ° ½ © € ✓ ☎'],
    ['₺', 'Klavyede AltGr + T de olabilir; Simge menüsü her bilgisayarda çalışır'],
    ['°C', 'Derece simgesi ° + C harfi'],
    ['Ekle → Şekil', 'Kutu, yuvarlak kutu, ok; içine yazı yazılır'],
    ['Şekil kullanımı', 'Duyuruda “GİRİŞ →” gibi yönlendirme için'],
  ],
  steps: [
    {
      title: 'Klavyede olmayanlar',
      html: `<p>Fiyat yazarken <b>₺</b>, hava durumunda <b>°C</b>, tarifte <b>½</b>, belgede <b>©</b> gerekir; ama klavyede bunlar yok ya da bulması zor. Çözüm: <b>Ekle → Simge</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.ensure('word'); },
    },
    {
      title: 'Programı açın',
      html: '<p>Kelime İşlemci açık değilse ⊞ Başlat → 📘 Kelime İşlemci.</p>',
      check: (c) => !!c.d.find('word'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'word',
      setup: wordOpen,
    },
    {
      title: 'Türk lirası',
      html: '<p>Sayfaya <b>Ekmek 12</b> yazın, boşluk bırakın. <b>Ekle</b> sekmesi → <b>Ω Simge</b> → <b>₺</b>\'ye tıklayın.</p>',
      hint: 'Simge düğmesi Ekle sekmesinde, Tarih\'in yanındaki grupta. Palet açılır.',
      on: when((c) => /ekmek 12\s*₺/i.test(info(c).text)),
      done: 'Ekmek 12 ₺. Simgenin yeri imlecin olduğu yerdir.',
    },
    {
      title: 'Derece işareti',
      html: `<p>Alt satıra <b>Hava bugün 25</b> yazın, <b>Simge</b>'den <b>°</b>'yi ekleyin, sonra <b>C</b> yazın.</p>`,
      on: when((c) => /hava bugün 25\s*°\s*C/i.test(info(c).text)),
      done: '25°C: sıcaklık böyle yazılır.',
    },
    {
      title: 'Yarım ve telif',
      html: '<p>Alt satıra <b>Çay ½ litre</b> yazın (½ simgesini <b>Simge</b>\'den ekleyin) ve bir satır daha: <b>© Apartman Yönetimi</b> (© simgesini yine Simge\'den).</p>',
      on: when((c) => /çay\s*½/i.test(info(c).text) && /©\s*apartman/i.test(info(c).text)),
      done: 'Dört simge de klavye kullanmadan eklendi.',
    },
    {
      title: 'Şekil ekleyin',
      html: `<p>Önce ${K('Enter')} ile <b>yeni bir satıra</b> geçin (şekil yazının yanına yapışmasın). Sonra <b>Ekle → ◇ Şekil → ➜ Ok</b>'a tıklayın. Sayfaya yeşil bir ok kutusu gelir.</p>`,
      on: when((c) => info(c).shapes >= 1),
      done: 'Şeklin içine tıklayıp yazı yazabilirsiniz.',
    },
    {
      title: 'Şeklin içine yazın',
      html: '<p>Okun içindeki “Yazınız” sözcüğüne <b>çift tıklayarak</b> seçin ve yerine <b>GİRİŞ</b> yazın.</p>',
      hint: '“Yazınız” sözcüğüne çift tıklayıp seçin, sonra GİRİŞ yazın. Ctrl + A kullanmayın: bütün sayfayı seçer.',
      on: when((c) => shapeTexts(c).includes('giriş')),
      done: 'GİRİŞ → duyurularda yön göstermek için çok işe yarar.',
    },
    {
      title: 'Kutu şekli',
      html: '<p>Önce <b>şeklin dışına</b> çıkın: şeklin sağındaki boş yere tıklayıp Enter\'a basın, imleç alt satıra insin. Şeklin içindeyken eklerseniz kutu şeklin içine girer. Sonra <b>Ekle → Şekil → ▭ Kutu</b> ekleyin; “Yazınız” sözcüğüne çift tıklayıp seçin ve <b>ÖNEMLİ</b> yazın.</p>',
      on: when((c) => info(c).shapes >= 2 && shapeTexts(c).includes('önemli')),
    },
    rehberSoru({
      title: 'Hangisi doğru?',
      html: '<p>Klavyenizde olmayan bir işaret (örneğin <b>½</b>) eklemek için hangi yolu izlersiniz?</p>',
      opts: ['İnternetten kopyalarım', 'Ekle sekmesi → Simge', 'Yazılı bir işaret yoksa kullanamam'], ok: 1,
      wrong: 'Programın içinde hazır bir liste var. Ekle sekmesine bakın.',
      why: 'Evet: Ekle → Simge. Liste hazırdır; internete ya da başka kaynağa gerek yok.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Belgelerinize simge ve şekil ekleyebiliyorsunuz:</p>' },
  ],
};

export const dilekceParkur = {
  id: 'dilekce-parkur', icon: '🏁', title: 'Dilekçe parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: dilekçe yazıp biçimlendirmek, kaydetmek, PDF yapmak. Süreler tutulur.',
  steps: [
    {
      title: 'Dilekçe parkuru',
      html: '<p>10. haftada öğrendiklerinizi tek bir dilekçede birleştirin. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>',  // Eğitmen notu: son ekranda her görevin süresi görünür.
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Programı açın', html: '<p><b>Kelime İşlemci</b>\'yi açın.</p>', hint: 'Başlat → Kelime İşlemci.', check: (c) => !!c.d.find('word'), on: (ev) => ev.type === 'app-open' && ev.app === 'word' },
    { title: '2. Makamı yazın', html: '<p>İlk satıra makamı büyük harflerle yazın: <b>ÇINAR MAHALLESİ MUHTARLIĞINA</b> (kendi mahallenizin adını da yazabilirsiniz). Enter\'a basın.</p>', hint: 'Caps Lock ya da Shift ile büyük harf. İ, Ş ve Ğ harflerine dikkat. Resmî dilekçede makam “… MAHALLESİ MUHTARLIĞINA” diye yazılır.', setup: wordOpen, on: when((c) => { const b = info(c).blocks; return b.length >= 2 && norm(b[0].text).includes('mahallesi muhtarlığına'); }) },
    { title: '3. Başlığı biçimlendirin', html: '<p>Makam başlığını <b>ortalı, kalın ve 14 punto</b> yapın.</p>', hint: 'Başlığı üç tıkla seçin; Ctrl + E, Ctrl + B ve boyut kutusu. Altındaki satır da ortalandıysa, ona geçince Ctrl + L ile sola hizalayın.', on: when((c) => { const b = block(c, 'muhtarlığına'); return b && b.align === 'center' && b.bold && b.size >= 14; }) },
    { title: '4. Konuyu yazın', html: '<p>Alt satıra <b>Konu: Sokak lambası hakkında</b> yazın. Satır ortalı geliyorsa önce <b>Sola Hizala</b>\'ya (Ctrl + L) basın.</p>', on: when((c) => block(c, 'konu: sokak lambası')) },
    { title: '5. Metin', html: '<p>Bir paragraf yazın (en az iki cümle): sokağınızdaki lambanın yanmadığını ve değiştirilmesini rica edin. Paragrafı şu cümleyle bitirin: <b>Gereğini saygılarımla arz ederim.</b></p>', hint: 'Satır sonlarında Enter\'a basmayın. Her cümlenin sonuna nokta koyun.', on: when((c) => info(c).blocks.some((b) => b.text.length > 60 && norm(b.text).includes('lamba') && (b.text.match(/[.!?]/g) || []).length >= 2 && norm(b.text).includes('saygılarımla arz ederim'))) },
    { title: '6. İki yana yaslayın', html: '<p>Yazdığınız metin paragrafını <b>iki yana yaslayın</b>.</p>', hint: 'Paragrafa üç tıkla; Ctrl + J.', on: when((c) => info(c).blocks.some((b) => b.text.length > 60 && b.align === 'justify')) },
    { title: '7. Tarih ve ad', html: '<p>Altına <b>bugünün tarihini</b> (Ekle → Tarih) ve <b>adınızı soyadınızı</b> yazıp ikisini <b>sağa hizalayın</b>.</p>', hint: 'Ekle → Tarih. İkisini birlikte seçip Ctrl + R.', on: when((c) => { const b = info(c).blocks.filter((x) => x.text); const i = b.findIndex((x) => x.text.includes(today())); return i >= 0 && b[i].align === 'right' && b.slice(i + 1).some((x) => x.align === 'right' && /\p{L}{2,}/u.test(x.text)); }) },
    { title: '8. Kaydedin', html: '<p>Belgeyi <b>dilekçe</b> adıyla <b>Belgeler</b> klasörüne kaydedin.</p>', hint: 'Ctrl + S.', on: (ev) => ev.type === 'doc-save' && ev.name.toLocaleLowerCase('tr').includes('dilek') },
    { title: '9. PDF yapın', html: '<p>Aynı belgeyi <b>PDF olarak</b> kaydedin.</p>', hint: 'Dosya → PDF olarak kaydet.', on: (ev) => ev.type === 'doc-pdf' },
    { final: true, title: 'Parkur bitti! 🎉', html: '<p>Bir dilekçeyi baştan sona hazırladınız.</p>' },
  ],
};
