// 11. hafta ek dersleri: hücre incelikleri (Birleştir ve Ortala, Metni Kaydır, #####), otomatik doldurma ve bölmeleri dondurma,
// çalışma sayfaları (bir ayı diğerine kopyalamak), Excel'de yazdırma, tablo parkuru
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || { raw: '', value: '', text: '' };
const sheetOpen = (c, data) => maxed(c, 'sheet', data ? { data } : {});
const near = (v, n) => typeof v === 'number' && Math.abs(v - n) < 0.01;
const editEvents = ['xl-edit', 'xl-autosum', 'xl-format', 'xl-sort', 'xl-select', 'xl-paste', 'xl-fill', 'xl-merge', 'xl-wrap', 'xl-colw', 'xl-freeze', 'xl-page', 'xl-sheet'];
const when = (test) => (ev, c) => editEvents.includes(ev.type) && !!test(c);

// Başlangıç tabloları
const gider = () => ({
  cells: { A1: 'AYLIK HARCAMA ÇİZELGESİ', A3: 'Gider kalemi', B3: 'Tutar', C3: 'Açıklama', A4: 'Kira', B4: '18500', C4: 'Her ayın beşinde ev sahibine elden ödenir', A5: 'Elektrik', B5: '1245,5', C5: 'İki ayda bir', A6: 'Su', B6: '387,25', A7: 'Market', B7: '7850' },
  fmt: { A1: { b: true }, A3: { b: true }, B3: { b: true }, C3: { b: true }, B4: { f: 'tl' }, B5: { f: 'tl' }, B6: { f: 'tl' }, B7: { f: 'tl' } },
  colW: { 1: 5, 2: 9 },
});
const gunluk = () => {
  const cells = { A1: 'Gün', B1: 'Harcama (₺)', C1: 'Ne aldım?' };
  const items = ['Ekmek', 'Süt', 'Domates', 'Peynir', 'Çay', 'Şeker', 'Yumurta', 'Zeytin', 'Makarna', 'Pirinç'];
  for (let i = 0; i < 30; i++) { cells['A' + (i + 2)] = String(i + 1); cells['B' + (i + 2)] = String(20 + ((i * 37) % 90)); cells['C' + (i + 2)] = items[i % items.length]; }
  return { cells, fmt: { A1: { b: true }, B1: { b: true }, C1: { b: true } } };
};
const butce = () => ({
  cells: { A1: 'Gider', B1: 'Tutar', A2: 'Kira', B2: '18500', A3: 'Elektrik', B3: '1250', A4: 'Su', B4: '380', A5: 'Market', B5: '7800', A6: 'Toplam', B6: '=TOPLA(B2:B5)' },
  fmt: { A1: { b: true }, B1: { b: true }, A6: { b: true }, B6: { b: true, f: 'tl' }, B2: { f: 'tl' }, B3: { f: 'tl' }, B4: { f: 'tl' }, B5: { f: 'tl' } },
});
const GENIS = () => ({
  cells: { A1: 'Ay', B1: 'Kira', C1: 'Elektrik', D1: 'Su', E1: 'Doğalgaz', F1: 'Market', G1: 'Toplam', A2: 'Ocak', B2: '18500', C2: '1250', D2: '380', E2: '2100', F2: '7800', G2: '=TOPLA(B2:F2)', A3: 'Şubat', B3: '18500', C3: '1190', D3: '395', E3: '2400', F3: '7350', G3: '=TOPLA(B3:F3)', A4: 'Mart', B4: '18500', C4: '1120', D4: '370', E4: '1800', F4: '8100', G4: '=TOPLA(B4:F4)' },
  fmt: { A1: { b: true }, B1: { b: true }, C1: { b: true }, D1: { b: true }, E1: { b: true }, F1: { b: true }, G1: { b: true } },
  colW: { 0: 11, 1: 11, 2: 11, 3: 11, 4: 11, 5: 11, 6: 11 },
});

export const hucreInce = {
  id: 'hucre-ince', icon: '📐', title: 'Hücre incelikleri: Birleştir ve Ortala, Metni Kaydır, #####', minutes: 30, stage: 'desktop',
  desc: 'Birleştir ve Ortala, Metni Kaydır, ##### işaretini düzeltmek.',
  summary: [
    ['Birleştir ve Ortala', 'Yan yana hücreleri seçin; başlığı tek hücre yapar ve ortalar'],
    ['Metni Kaydır', 'Uzun yazıyı hücre içinde alt satıra indirir; satır yükselir'],
    ['#####', 'Hata değil: sütun dar. Sütun başlığındaki çizgiye çift tıklayın'],
    ['Sütun çizgisini sürükleyin', 'Sütunu elle genişletir'],
    ['Çift tıkla sığdır', 'Sütun, en uzun yazıya göre genişler'],
  ],
  steps: [
    {
      title: 'Sıkışık tablo',
      html: `<p>Hesap tablosunda ilk 5 dakikada herkesin takıldığı üç şey var: <b>başlığın tek hücreye sığmaması</b>, <b>uzun yazının taşması</b> ve <b>#####</b> işareti. Hepsi çözülür.</p>
        <p>Önünüzde bir harcama çizelgesi var; <b>Tutar</b> sütununda garip işaretler görünüyor.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, gider()); },
    },
    {
      title: '##### nedir?',
      html: `<p><b>Tutar</b> sütununa bakın: sayıların yerinde <b>#####</b> yazıyor. Bilgisayar bozulmadı, sayılar da silinmedi.</p>
        <p><b>#####</b>, “sayı bu sütuna sığmıyor” demektir. Bir hücreye tıklayın; üstteki formül çubuğunda gerçek sayıyı göreceksiniz.</p>`,
      hint: 'Tutar sütunundaki herhangi bir hücreye tıklayın (B4 gibi).',
      setup: (c) => { if (!X(c)) sheetOpen(c, gider()); },
      on: (ev, c) => ev.type === 'xl-select' && /^B[4-7]$/.test(ev.addr) && X(c).hashes > 0,
      done: 'Formül çubuğunda sayı sağlam. Yalnızca sütun dar kaldı.',
    },
    {
      title: 'Sütunu genişletin',
      html: `<p>Sütun harflerinin (A, B, C) arasındaki dikey çizgiye fareyi götürün; imleç çift yönlü oka döner. <b>B</b> ile <b>C</b> arasındaki çizgiye <b>çift tıklayın</b>: sütun içeriğe göre kendiliğinden genişler.</p>`,
      hint: 'Başlık satırında B harfinin sağ kenarına tıklayın. Çift tıklamak sürüklemekten kolaydır.',
      on: (ev, c) => ev.type === 'xl-colw' && ev.col === 'B' && X(c).hashes === 0,
      done: 'Rakamlar göründü. Sütun çizgisine çift tıklamak, en çok işe yarayan kısayoldur.',
    },
    {
      title: 'Başlığı birleştirip ortalayın',
      html: `<p>Üstteki <b>AYLIK HARCAMA ÇİZELGESİ</b> yazısı yalnızca A1'de duruyor. Onu tablonun genişliğine yaymak için:</p>
        <ol class="steps"><li>A1'den <b>D1</b>'e kadar fareyle sürükleyerek seçin (4 hücre).</li><li>Şeritteki <b>⊞ Birleştir ve Ortala</b>'ya tıklayın.</li></ol>`,
      hint: 'A1\'e basılı tutup fareyi D1\'e kadar sürükleyin, bırakın. Sonra düğmeye basın.',
      on: (ev) => ev.type === 'xl-merge' && ev.on && ev.cols >= 3,
      done: 'Başlık dört hücrenin ortasına yerleşti. Birleştirmeyi geri almak için hücreyi seçip düğmeye yeniden basın.',
    },
    {
      title: 'Uzun yazıyı kaydırın',
      html: `<p><b>Açıklama</b> sütunundaki “Her ayın beşinde ev sahibine elden ödenir” yazısı hücreye sığmıyor, kesiliyor. <b>C4</b> hücresine tıklayın, sonra <b>↲ Metni Kaydır</b>'a basın.</p>`,
      hint: 'C4, Kira satırındaki Açıklama hücresi.',
      on: (ev) => ev.type === 'xl-wrap' && ev.on,
      done: 'Yazı hücre içinde alt satıra indi, satır yükseldi. Sütunu genişletmek yerine bu yolu seçebilirsiniz.',
    },
    {
      title: 'Sütunu elle genişletin',
      html: '<p>Şimdi <b>C</b> ile <b>D</b> arasındaki çizgiyi <b>sağa sürükleyerek</b> Açıklama sütununu genişletin. Yazının kaç satıra düştüğünü gözlemleyin.</p>',
      hint: 'Fareyi C harfinin sağ kenarına götürüp basılı tutarak sağa çekin.',
      on: (ev, c) => ev.type === 'xl-colw' && ev.col === 'C' && !ev.auto,
      done: 'Sürükleyerek genişlik ayarı da olur; çift tıklama ise tam uyar.',
    },
    rehberSoru({
      title: 'Bu işaret ne?',
      html: '<p>Hücrede <b>#####</b> görüyorsunuz. Sayı silindi mi?</p>',
      opts: ['Evet, sayı kayboldu', 'Hayır; sütun dar. Sütun başlığındaki çizgiye çift tıklarım', 'Bilgisayar virüslü'], ok: 1,
      wrong: 'Bu pek öyle değil. Hücreye tıklayıp formül çubuğuna bakın: sayı orada duruyor.',
      why: 'Doğru. ##### yalnızca “sütun dar” demektir. Sütun çizgisine çift tıklayınca genişler ve sayı görünür.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tablonun görünümünü düzeltebiliyorsunuz:</p>' },
  ],
};

export const doldurDondur = {
  id: 'doldur-dondur', icon: '📅', title: 'Otomatik doldurma ve üst satırı dondurma', minutes: 30, stage: 'desktop',
  desc: 'Doldurma tutamacıyla listeleri doldurmak, Üst Satırı Dondur.',
  summary: [
    ['Doldurma tutamacı', 'Seçili hücrenin sağ alt köşesindeki küçük kare; sürükleyin'],
    ['Ocak → Şubat → Mart', 'Ay ve gün adları kendiliğinden devam eder'],
    ['1, 2 → 3, 4, 5…', 'İki sayı seçip çekerseniz aynı artışla devam eder'],
    ['❄ Üst Satırı Dondur', 'Aşağı inerken en üstteki başlık satırı yerinde kalır'],
  ],
  steps: [
    {
      title: 'Tek tek yazmayın',
      html: `<p>12 ayı, 31 günü ya da 1'den 100'e kadar sayıları <b>tek tek yazmak</b> yerine bilgisayara devam ettirin. Hücrenin sağ alt köşesindeki küçük kareyi (<b>doldurma tutamacı</b>) çekmek yeter.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, { cells: { A1: 'Ay', B1: 'Sıra' }, fmt: { A1: { b: true }, B1: { b: true } } }); },
    },
    {
      title: 'Ay adlarını doldurun',
      html: `<p><b>A2</b> hücresine <b>Ocak</b> yazın, Enter'a basın. Sonra <b>A2</b>'ye tıklayın; sağ alt köşesinde küçük bir kare belirir. Onu <b>A13</b>'e kadar aşağı sürükleyin.</p>`,
      hint: 'Kare, hücre çerçevesinin sağ alt köşesinde. Fareyi basılı tutup A13\'e kadar inin, bırakın.',
      on: when((c) => norm(cell(c, 'A2').raw) === 'ocak' && norm(cell(c, 'A13').raw) === 'aralık'),
      done: 'On iki ay, tek hareketle yazıldı: Ocak, Şubat… Aralık.',
    },
    {
      title: 'Sayıları doldurun',
      html: `<p><b>B2</b>'ye <b>1</b>, <b>B3</b>'e <b>2</b> yazın. İkisini birlikte seçin (B2'den B3'e sürükleyin). Seçimin sağ alt köşesindeki kareyi <b>B13</b>'e kadar çekin.</p>`,
      hint: 'İki sayı yazarsanız bilgisayar aradaki farkı (1) anlar ve devam eder. Tek sayıyı çekerseniz hep aynı sayı olur.',
      on: when((c) => near(cell(c, 'B2').value, 1) && near(cell(c, 'B3').value, 2) && near(cell(c, 'B13').value, 12)),
      done: '1\'den 12\'ye sayılar doldu. 5, 10 yazıp çekseniz 15, 20… devam ederdi.',
    },
    {
      title: 'Uzun liste',
      html: `<p>Şimdi başka bir tabloya geçelim: bir aylık <b>günlük market harcamaları</b>, 30 satır. Aşağı inince ne olacak? Fare tekerleğiyle tabloyu <b>aşağı kaydırın</b> ve üstteki başlıklara (Gün, Harcama, Ne aldım?) bakın.</p>`,
      setup: (c) => { c.d.closeAll(); sheetOpen(c, gunluk()); },
      manual: 'Kaydırdım ✔',
      done: 'Aşağı inince başlıklar kayboldu; hangi sütunun ne olduğunu hatırlamak zorlaşır. Çözüm: üst satırı dondurmak.',
    },
    {
      title: 'Üst satırı dondurun',
      html: '<p>Şeritteki <b>❄ Üst Satırı Dondur</b> düğmesine tıklayın. Sonra tabloyu yeniden aşağı kaydırın: başlık satırı yerinde kalır.</p>',
      mouse: '🖱 ❄ Üst Satırı Dondur',
      on: (ev) => ev.type === 'xl-freeze' && ev.on,
      done: 'Başlık satırı artık sarı ve sabit. Aşağıdaki 30 satır akıp gider, başlık yerinde kalır.',
    },
    {
      title: 'Kaydırıp doğrulayın',
      html: '<p>Fare tekerleğiyle aşağı inin, başlıkların yerinde durduğunu görün.</p>',
      manual: 'Gördüm ✔',
    },
    {
      title: 'Dondurmayı kaldırın',
      html: '<p>Dondurma bazen işi karıştırır. Aynı düğmeye (<b>❄ Üst Satırı Dondur</b>) yeniden tıklayarak kaldırın.</p>',
      on: (ev) => ev.type === 'xl-freeze' && !ev.on,
      done: 'Düğme bir kapı gibi: tıklayınca açılır, bir daha tıklayınca kapanır.',
    },
    rehberSoru({
      title: 'Hangi kısayol?',
      html: '<p>Ocak ve Şubat yazdınız; Aralık\'a kadar devam ettirmek istiyorsunuz. En hızlı yol?</p>',
      opts: ['Kalan 10 ayı tek tek yazmak', 'İkisini seçip doldurma tutamacını aşağı çekmek', 'Başlık satırını dondurmak'], ok: 1,
      wrong: 'Tek tek yazmak yavaş. Hücrenin köşesindeki küçük karenin bir işi var.',
      why: 'Doğru. Doldurma tutamacı (sağ alt köşedeki kare) ay, gün ve sayı listelerini devam ettirir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Hızlı doldurma ve sabit başlık:</p>' },
  ],
};

export const calismaSayfalari = {
  id: 'calisma-sayfalari', icon: '📑', title: 'Çalışma sayfaları: Ocak sayfasını Şubat\'a kopyalamak', minutes: 30, stage: 'desktop',
  desc: 'Yeni sayfa açmak, adını değiştirmek, sayfayı çoğaltmak.',
  summary: [
    ['＋ (alt sekme çubuğunda)', 'Yeni çalışma sayfası ekler'],
    ['Sekmeye çift tık', 'Sayfanın adını değiştirir'],
    ['Sekmeye sağ tık', 'Yeniden adlandır, Sekme rengi, Taşı veya Kopyala, Sil'],
    ['Taşı veya Kopyala → Kopya oluştur', 'Aynı tabloyu yeni sayfaya çoğaltır; asıl sayfa bozulmaz'],
    ['Her ay bir sayfa', 'Ocak, Şubat, Mart… tek dosyada, ayrı ayrı sekmelerde'],
  ],
  steps: [
    {
      title: 'Her ay için bir sayfa',
      html: `<p>Her ay yeni bir hesap tablosu dosyası açmak yerine <b>tek dosyada ay ay sayfa</b> tutabilirsiniz: Ocak, Şubat, Mart… Ekranın altındaki <b>sekmeler</b> bu işe yarar.</p>
        <p>Önünüzde Ocak ayının bütçesi var. Şubat'ı sıfırdan yazmayacağız; Ocak'ı <b>kopyalayıp</b> rakamları güncelleyeceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, butce()); },
    },
    {
      title: 'Sayfaya ad verin',
      html: `<p>Alttaki sekmede <b>Sayfa1</b> yazıyor. Üzerine <b>çift tıklayın</b>, adı <b>Ocak</b> yapıp Enter'a basın.</p>`,
      hint: 'Sekme tablonun hemen altında, soldaki küçük kutu. Çift tık: iki hızlı tık.',
      on: (ev) => ev.type === 'xl-sheet' && ev.op === 'rename' && norm(ev.name) === 'ocak',
      done: 'Sekme artık “Ocak”. Anlamlı ad, bir yıl sonra bile aradığınızı bulmanızı sağlar.',
    },
    {
      title: 'Sekmeyi renklendirin',
      html: '<p>“Ocak” sekmesine <b>sağ tıklayın</b>, <b>🎨 Sekme rengi: Mavi</b>\'yi seçin. Kış aylarını maviyle işaretleyelim.</p>',
      hint: 'Sağ tık menüsünde Yeniden adlandır, Taşı veya Kopyala, renkler ve Sil var.',
      on: (ev) => ev.type === 'xl-sheet' && ev.op === 'color' && !!ev.color,
      done: 'Sekmenin altında renkli çizgi göründü. Renkler, sayfaları ayırmayı kolaylaştırır.',
    },
    {
      title: 'Ocak\'u kopyalayın',
      html: `<p>“Ocak” sekmesine yine <b>sağ tıklayın</b> ve <b>📑 Taşı veya Kopyala…</b>'yı seçin. Açılan pencerede <b>Kopya oluştur</b>'a tıklayın.</p>`,
      on: (ev) => ev.type === 'xl-sheet' && ev.op === 'copy',
      done: 'Ocak\'un birebir kopyası oluştu: “Ocak (2)”. İkisinin de içi aynı.',
    },
    {
      title: 'Kopyayı Şubat yapın',
      html: '<p>Yeni sekmeye (<b>Ocak (2)</b>) çift tıklayıp adını <b>Şubat</b> yapın.</p>',
      on: (ev) => ev.type === 'xl-sheet' && ev.op === 'rename' && norm(ev.name) === 'şubat',
    },
    {
      title: 'Şubat\'ın rakamlarını girin',
      html: `<p>Şubat sayfasındayken <b>Market</b> giderini (B5) <b>7.350</b> olarak değiştirin: B5'e tıklayıp <b>7350</b> yazın, Enter.</p>`,
      hint: 'B5, “Market” satırındaki tutar. Toplam kendiliğinden güncellenir.',
      on: when((c) => X(c).sheets[X(c).sheetIndex]?.name === 'Şubat' && near(cell(c, 'B5').value, 7350)),
      done: 'Toplam kendiliğinden yeniden hesaplandı. Formüller kopyayla birlikte geldi.',
    },
    {
      title: 'Ocak bozulmadı mı?',
      html: '<p><b>Ocak</b> sekmesine tıklayıp Market giderine (B5) bakın: hâlâ 7.800 mü?</p>',
      on: (ev, c) => ev.type === 'xl-sheet' && ev.op === 'switch' && norm(ev.name) === 'ocak' && X(c).sheetCell(X(c).sheetIndex, 'B5') === '7800',
      done: 'Ocak aynen duruyor. Kopyayı değiştirmek asıl sayfayı bozmaz; işte kopyanın faydası.',
    },
    {
      title: 'Yeni boş sayfa',
      html: '<p>Alt sekme çubuğundaki <b>＋</b> düğmesine tıklayarak yeni bir sayfa ekleyin. İsterseniz adını <b>Mart</b> yapın.</p>',
      on: (ev) => ev.type === 'xl-sheet' && ev.op === 'add',
      done: 'Boş sayfa eklendi. Sayfa sayısında sınır yok denecek kadar çoktur.',
    },
    rehberSoru({
      title: 'En doğru yol',
      html: '<p>Şubat tablonuzu, Ocak\'tan farkı yalnızca birkaç rakam olduğu hâlde sıfırdan mı yazarsınız?</p>',
      opts: ['Evet, sıfırdan', 'Hayır; Ocak sayfasını Taşı veya Kopyala ile kopyalayıp rakamları güncellerim', 'Ocak\'u silip yerine Şubat yazarım'], ok: 1,
      wrong: 'Bu çok zahmetli ve Ocak\'u kaybedersiniz. Sekmeye sağ tıklayınca daha kısa bir yol var.',
      why: 'Doğru. Kopyalamak zaman kazandırır, formülleri korur ve eski ayı bozmaz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Her ay bir sayfa:</p>' },
  ],
};

export const excelYazdir = {
  id: 'excel-yazdir', icon: '🖨', title: 'Excel\'de yazdırma: tablom neden iki sayfaya bölündü?', minutes: 30, stage: 'desktop',
  desc: 'Tabloyu tek kâğıda sığdırmak ve çizgileriyle yazdırmak.',
  summary: [
    ['Ctrl + P', 'Yazdırma önizlemesi: kaç sayfa olacağını gösterir'],
    ['Tüm sütunları bir sayfaya sığdır', 'Tabloyu küçültüp tek kâğıda alır'],
    ['Yatay', 'Geniş tablolar için kâğıdı yan çevirir'],
    ['Kılavuz çizgilerini yazdır', 'Excel kâğıda çizgileri varsayılan olarak çıkarmaz; açın'],
    ['Önce önizleme', 'Yazdırmadan önce hep önizlemeye bakın'],
  ],
  steps: [
    {
      title: 'Taşan sütunlar',
      html: `<p>Geniş bir tabloyu yazdırınca <b>son sütunlar ikinci kâğıda</b> geçer, ya da tablo çizgileri hiç çıkmaz. Bu, hesap tablosunda <b>en çok yaşanan yazdırma sorunudur</b>. Çözümü basit.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, GENIS()); },
    },
    {
      title: 'Önizlemeye bakın',
      html: `<p>${K('Ctrl', 'P')}'ye basın. Önizlemede kâğıdı ve altındaki <b>sayfa sayısını</b> okuyun. Sonra <b>İptal</b>'e tıklayın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      setup: (c) => { if (!X(c)) sheetOpen(c, GENIS()); },
      on: (ev) => ev.type === 'xl-print-open',
      done: 'Tablo birden çok sayfaya bölünüyor: son sütun (Toplam) ikinci kâğıda taşıyor.',
    },
    {
      title: 'Tek sayfaya sığdırın',
      html: '<p>Şeritteki <b>⤢ Tüm sütunları bir sayfaya sığdır</b>\'a tıklayın. Tablo küçülüp tek kâğıda girer.</p>',
      mouse: '🖱 Tüm sütunları bir sayfaya sığdır',
      on: (ev) => ev.type === 'xl-page' && ev.fit,
      done: 'Düğme yeşil renkte (açık). Yazı biraz küçülecek ama bütün sütunlar tek kâğıtta olacak.',
    },
    {
      title: 'Yatay kâğıt',
      html: '<p>Bir de başka çözüm var: kâğıdı <b>yan çevirmek</b>. Şeritte <b>▭ Yatay</b>\'a tıklayın.</p>',
      on: (ev) => ev.type === 'xl-page' && ev.orient === 'yatay',
      done: 'Yatay kâğıt geniş tablolar içindir: daha çok sütun sığar, yazı küçülmez.',
    },
    {
      title: 'Tablo çizgileri',
      html: `<p>Önizlemeye (${K('Ctrl', 'P')}) bakın: ekranda gördüğünüz <b>tablo çizgileri</b> kâğıtta yok! Excel çizgileri kendiliğinden yazdırmaz. <b>▦ Kılavuz çizgilerini yazdır</b>'a tıklayın.</p>`,
      on: (ev) => ev.type === 'xl-page' && ev.grid,
      done: 'Artık çizgiler kâğıtta çıkacak. Önizlemede ızgara göründü.',
    },
    {
      title: 'Yazdırın',
      html: `<p>${K('Ctrl', 'P')}'ye basın. Önizlemede <b>tek sayfa</b> ve <b>çizgiler</b> görünüyor mu? Evetse <b>🖨 Yazdır</b>'a tıklayın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev, c) => {
        if (ev.type !== 'xl-print') return false;
        if (ev.pages > 1) c.warn(`Tablo hâlâ ${ev.pages} sayfa. “Tüm sütunları bir sayfaya sığdır” ya da Yatay düğmesini açın.`);
        else if (!ev.grid) c.warn('Sayfa tek ama çizgiler yok. “Kılavuz çizgilerini yazdır”ı açıp yeniden yazdırın.');
        return ev.pages === 1 && ev.grid;
      },
      done: 'Tablo tek sayfada, çizgileriyle yazıcıya gitti.',
    },
    rehberSoru({
      title: 'Hangisi çözüm?',
      html: '<p>Yazdırdığınız hesap tablosunun son sütunu ikinci kâğıda geçmiş. Ne yaparsınız?</p>',
      opts: ['Sütunları tek tek silerim', 'Yatay kâğıt ya da “Tüm sütunları bir sayfaya sığdır”ı kullanırım', 'Yazıcıyı değiştiririm'], ok: 1,
      wrong: 'Bu çok büyük bir adım. Yazdırma ayarlarında basit bir çözüm var.',
      why: 'Doğru. Yatay kâğıt ya da “bir sayfaya sığdır” sorunu çözer; her zaman önce önizlemeye bakın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tablolarınızı düzgün yazdırabiliyorsunuz:</p>' },
  ],
};

export const tabloParkur = {
  id: 'tablo-parkur', icon: '🏁', title: 'Tablo parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: pazar harcamasını yazıp toplatmak, sıralamak. Süreler tutulur.',
  steps: [
    {
      title: 'Tablo parkuru',
      html: '<p>11. haftada öğrendiklerinizi bir pazar alışverişinde kullanın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p><div class="box">Eğitmen notu: son ekranda her görevin süresi görünür.</div>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Hesap tablosunu açın', html: '<p><b>Hesap Tablosu</b>\'nu açın.</p>', hint: 'Başlat → Hesap Tablosu.', check: (c) => !!X(c), on: (ev) => ev.type === 'app-open' && ev.app === 'sheet' },
    {
      title: '2. Pazar listesini yazın',
      html: '<p>A1\'den A5\'e ürün adlarını, B1\'den B5\'e fiyatlarını yazın:<br><b>Domates 45 · Peynir 120,50 · Zeytin 85 · Ekmek 15 · Süt 38,75</b></p>',
      hint: 'Adı yazıp Tab\'a basarsanız yan hücreye geçersiniz. Virgülü kuruş için kullanın: 120,50.',
      setup: (c) => { if (!X(c)) sheetOpen(c); },
      on: when((c) => norm(cell(c, 'A1').raw) === 'domates' && near(cell(c, 'B1').value, 45) && near(cell(c, 'B2').value, 120.5) && near(cell(c, 'B3').value, 85) && near(cell(c, 'B4').value, 15) && near(cell(c, 'B5').value, 38.75)),
    },
    { title: '3. Toplamı bulun', html: '<p><b>B6</b> hücresine pazarın <b>toplamını</b> hesaplatın.</p>', hint: 'B6\'ya tıklayıp ∑ Otomatik Toplam ya da =TOPLA(B1:B5) yazın.', on: when((c) => near(cell(c, 'B6').value, 304.25)) },
    { title: '4. Toplamı kalın yapın', html: '<p>Toplam hücresini (B6) <b>kalın</b> yapın.</p>', hint: 'B6\'yı seçip K düğmesi ya da Ctrl + B.', on: when((c) => cell(c, 'B6').bold) },
    { title: '5. Para biçimi', html: '<p>B1\'den B6\'ya kadar fiyatları <b>₺ (para birimi)</b> biçiminde gösterin.</p>', hint: 'B1:B6\'yı fareyle sürükleyerek seçin, ₺ düğmesine tıklayın.', on: when((c) => ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'].every((a) => cell(c, a).f === 'tl')) },
    { title: '6. En pahalıdan sıralayın', html: '<p>A1:B5 aralığını fiyata göre <b>büyükten küçüğe</b> sıralayın. Toplam satırı yerinde kalmalı.</p>', hint: 'A1:B5\'i seçip B sütunundayken ↓ Z→A. İlk satır Peynir olmalı.', on: when((c) => norm(cell(c, 'A1').raw) === 'peynir' && near(cell(c, 'B6').value, 304.25)) },
    { title: '7. Kaydedin', html: '<p>Dosyayı <b>pazar</b> adıyla <b>Belgeler</b> klasörüne kaydedin.</p>', hint: 'Ctrl + S, adı pazar yazın.', on: (ev) => ev.type === 'xl-save' && /pazar/i.test(ev.name) },
    { final: true, title: 'Parkur bitti! 🎉', html: '<p>Pazar listesini yazıp topladınız, biçimlendirdiniz ve sıraladınız.</p>' },
  ],
};
