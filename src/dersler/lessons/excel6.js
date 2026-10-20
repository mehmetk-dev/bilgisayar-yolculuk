// 11. hafta ek dersi: tarihler ve sayma işlevleri (MEB Elektronik Tablolama). Kurs kayıt listesinde tarih yazmak,
// tarihin aslında bir sayı olduğunu görmek, BUGÜN, ETARİHLİ ile yaş, “tarih + 30” ile son ödeme günü;
// BAĞ_DEĞ_DOLU_SAY, BAĞ_DEĞ_SAY ve BOŞLUKSAY ile kaç kişi kayıtlı, kaç kişi sınava girdi, kimin telefonu eksik.
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || {};
const has = (c, a, re) => re.test(String(cell(c, a).raw).toLocaleUpperCase('tr').replace(/\s/g, ''));
const DOSYA = 'kurs kayıtları.xlsx';
// Ad, doğum tarihi, kayıt tarihi, sınav notu, telefon. Zeynep'in doğum tarihini öğrenci yazar.
const KISI = [
  ['Ayşe Yılmaz', '12.04.1958', '02.09.2026', '85', '0532 111 22 33'],
  ['Mehmet Demir', '30.11.1955', '02.09.2026', '70', ''],
  ['Fatma Kaya', '18.06.1962', '09.09.2026', 'girmedi', '0505 444 55 66'],
  ['Hasan Şahin', '03.01.1950', '09.09.2026', '92', '0542 777 88 99'],
  ['Emine Çelik', '21.08.1967', '16.09.2026', '64', ''],
  ['Zeynep Aydın', '', '23.09.2026', '', '0533 222 33 44'],
];
function tablo() {
  const cells = { A1: 'Ad Soyad', B1: 'Doğum tarihi', C1: 'Yaş', D1: 'Kayıt tarihi', E1: 'Son ödeme', F1: 'Sınav notu', G1: 'Telefon', H1: 'Bugün' };
  KISI.forEach(([ad, dog, kay, not, tel], i) => {
    const r = i + 2;
    Object.assign(cells, { ['A' + r]: ad, ['D' + r]: kay });
    if (dog) cells['B' + r] = dog;
    if (not) cells['F' + r] = not;
    if (tel) cells['G' + r] = tel;
  });
  Object.assign(cells, { A9: 'Kayıtlı kişi', A10: 'Sınava giren', A11: 'Telefonu eksik', A12: 'En eski doğum yılı' });
  const fmt = {};
  'ABCDEFGH'.split('').forEach((k) => { fmt[k + '1'] = { b: true }; });
  ['A9', 'A10', 'A11', 'A12'].forEach((a) => { fmt[a] = { b: true }; });
  return { cells, fmt, colW: { 0: 11, 1: 8, 2: 4, 3: 8, 4: 8, 5: 7, 6: 10, 7: 8 } };
}
// Bugüne göre tam yaş (ETARİHLİ(...;"Y") ile aynı hesap)
function yas(gaa) {
  const [g, a, y] = gaa.split('.').map(Number), t = new Date();
  return t.getFullYear() - y - (t.getMonth() + 1 < a || (t.getMonth() + 1 === a && t.getDate() < g) ? 1 : 0);
}
const DOGUM = [...KISI.slice(0, 5).map((k) => k[1]), '05.09.1961'];
const doldu = (c) => DOGUM.every((d, i) => cell(c, 'C' + (i + 2)).value === yas(d));
const bugun = () => { const t = new Date(); return `${String(t.getDate()).padStart(2, '0')}.${String(t.getMonth() + 1).padStart(2, '0')}.${t.getFullYear()}`; };

export const excelTarih = {
  id: 'excel-tarih-sayma', icon: '📅', title: 'Tarihler, yaş hesabı ve sayma işlevleri', minutes: 35, stage: 'desktop',
  desc: 'Tarih yazmak, BUGÜN ve ETARİHLİ ile yaş hesaplamak, tarihe gün eklemek; BAĞ_DEĞ_SAY, BAĞ_DEĞ_DOLU_SAY ve BOŞLUKSAY ile saymak.',
  summary: [
    ['12.04.1958', 'Tarih gün.ay.yıl biçiminde, noktayla yazılır; Excel onu tanır ve sağa yaslar'],
    ['📅 / 123', 'Tarih aslında bir sayıdır (1 Ocak 1900\'den bu yana geçen gün); 123 o sayıyı gösterir'],
    ['=BUGÜN()', 'Bugünün tarihi; dosya her açıldığında kendiliğinden yenilenir'],
    ['=ETARİHLİ(B2;$H$2;"Y")', 'İki tarih arasındaki tam yıl: yaş, kıdem. "M" tam ay, "D" gün verir'],
    ['=D2+30', 'Tarihe gün eklenir: 30 gün sonrası (son ödeme, randevu)'],
    ['=BAĞ_DEĞ_DOLU_SAY(A2:A7)', 'Boş olmayan hücreleri sayar (yazı da sayılır)'],
    ['=BAĞ_DEĞ_SAY(F2:F7)', 'Yalnızca sayı olan hücreleri sayar'],
    ['=BOŞLUKSAY(G2:G7)', 'Boş hücreleri sayar: eksik bilgiyi bulmak için'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', tablo()); },
  steps: [
    {
      title: 'Kurs kayıt listesi',
      html: `<p>Bir halk eğitim kursunun kayıt listesini tutuyorsunuz: doğum tarihleri, kayıt tarihleri, sınav notları, telefonlar.</p>
        <p>Bu derste Excel'e <b>tarih</b> yazmayı, <b>yaş</b> hesaplatmayı ve listede <b>kaç kişi</b> olduğunu, kaçının sınava girdiğini, kimin telefonunun eksik olduğunu formülle <b>saymayı</b> öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'Tarih yazmak',
      html: `<p>Zeynep Aydın'ın doğum tarihi eksik. <b>B7</b> hücresine <b>05.09.1961</b> yazıp ${K('Enter')}.</p>
        <p class="mut">Gün, ay ve yıl arasına <b>nokta</b> koyun. Ay ve gün tek basamaklıysa başına 0 koymak şart değil: 5.9.1961 de olur.</p>`,
      target: '05.09.1961',
      hint: 'Nokta, klavyede Ç harfinin sağındaki tuştur. Arada boşluk bırakmayın.',
      on: (ev, c) => {
        if (ev.type !== 'xl-edit' || ev.addr !== 'B7') return false;
        if (typeof cell(c, 'B7').value !== 'number') { c.note('Excel bunu tarih olarak tanımadı (sola yaslandı). Gün.ay.yıl biçiminde yazın: 05.09.1961'); return false; }
        return cell(c, 'B7').text === '05.09.1961';
      },
      done: 'Tarih <b>sağa yaslandı</b>: Excel onu tanıdı. Sola yaslansaydı düz yazı sanılırdı ve hesaba katılmazdı.',
    },
    {
      title: 'Tarih aslında bir sayıdır',
      html: '<p><b>B2</b> hücresine tıklayın ve üst şeritteki <b>123</b> (Genel biçim) düğmesine basın.</p>',
      on: (ev, c) => ev.type === 'xl-format' && ev.kind === 'plain' && cell(c, 'B2').f === 'gen',
      done: '12.04.1958 yerine <b>21287</b> göründü. Excel tarihleri <b>1 Ocak 1900\'den bu yana geçen gün</b> olarak saklar. Bu yüzden tarihlerle toplama, çıkarma yapılabilir.',
    },
    {
      title: 'Tarih biçimine geri',
      html: '<p><b>B2</b> seçiliyken şeritteki <b>📅</b> (Tarih biçimi) düğmesine basın.</p>',
      hint: 'Gerçek Excel\'de: Giriş sekmesi → Sayı bölümündeki açılır liste → Kısa Tarih.',
      on: (ev, c) => ev.type === 'xl-format' && ev.kind === 'date' && cell(c, 'B2').text === '12.04.1958',
      done: 'Yeniden <b>12.04.1958</b>. Bir tarih bir gün garip bir sayıya dönüşürse biçimi bozulmuştur; 📅 ile düzeltilir.',
    },
    {
      title: 'BUGÜN',
      html: `<p><b>H2</b> hücresine <b>=BUGÜN()</b> yazıp ${K('Enter')}.</p>
        <p class="mut">Parantezin içi boş kalır ama parantezler yazılmalıdır.</p>`,
      target: '=BUGÜN()',
      hint: 'Ü harfi klavyede Ğ\'nin sağındadır (P, Ğ, Ü). Küçük harfle =bugün() yazsanız da olur.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'H2' && has(c, 'H2', /^=BUGÜN\(\)$/) && cell(c, 'H2').text === bugun(),
      done: () => `Bugün: <b>${bugun()}</b>. Dosyayı yarın açtığınızda kendiliğinden yarının tarihi olur.`,
    },
    {
      title: 'Yaş hesabı: ETARİHLİ',
      html: `<p><b>C2</b> hücresine <b>=ETARİHLİ(B2;$H$2;"Y")</b> yazıp ${K('Enter')}.</p>
        <p>Doğum tarihi (B2) ile bugün (H2) arasında kaç <b>tam yıl</b> var? <b>"Y"</b> yıl demektir.</p>
        <p class="mut">$H$2'deki <b>$</b> işaretleri, formülü aşağı çekince H2'nin kaymamasını sağlar (sabit başvuru).</p>`,
      target: '=ETARİHLİ(B2;$H$2;"Y")',
      hint: 'İşlev adı E ile başlar: ETARİHLİ. Gerçek Excel bu işlevi yazarken önermez; harf harf doğru yazın. $ işareti AltGr + 4.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'C2' && has(c, 'C2', /ETAR[İI]HL[İI]\(B2;\$H\$2;"Y"\)/) && cell(c, 'C2').value === yas('12.04.1958'),
      done: () => `Ayşe Hanım <b>${yas('12.04.1958')}</b> yaşında. Doğum günü bu yıl henüz gelmediyse ETARİHLİ bunu da hesaba katar.`,
    },
    {
      title: 'Aşağı doldurun',
      html: '<p><b>C2</b>\'yi seçin ve sağ alt köşedeki küçük kareyi <b>C7</b>\'ye kadar aşağı çekin.</p>',
      hint: `Ya da C2:C7'yi seçip ${K('Ctrl', 'D')}.`,
      on: (ev, c) => doldu(c),
      check: doldu,
      done: 'Herkesin yaşı hesaplandı. Formül her satırda kendi doğum tarihini (B3, B4…) ama hep aynı bugünü ($H$2) kullandı.',
    },
    {
      title: 'Tarihe gün eklemek',
      html: `<p>Kurs ücreti kayıttan <b>30 gün</b> sonra ödenecek. <b>E2</b> hücresine <b>=D2+30</b> yazıp ${K('Enter')}.</p>`,
      target: '=D2+30',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'E2' && has(c, 'E2', /^=D2\+30$/) && cell(c, 'E2').text === '02.10.2026',
      done: '02.09.2026 + 30 gün = <b>02.10.2026</b>. Ay sonunu, şubatın 28 gününü Excel kendisi hesaplar. Randevu ve vade hesabında çok işe yarar.',
    },
    {
      title: 'Kayıtlı kişi: BAĞ_DEĞ_DOLU_SAY',
      html: `<p>Şimdi sayalım. <b>B9</b> hücresine <b>=BAĞ_DEĞ_DOLU_SAY(A2:A7)</b> yazıp ${K('Enter')}.</p>
        <p class="mut">Sözcüklerin arasındaki <b>_</b> alt çizgidir: ${K('Shift', '-')}. Eksi (-) tuşu üst sırada, 0'ın iki sağındadır.</p>`,
      target: '=BAĞ_DEĞ_DOLU_SAY(A2:A7)',
      hint: 'BAĞ, DEĞ, DOLU ve SAY sözcüklerini alt çizgiyle birleştirin. Ğ harfi klavyede P\'nin hemen sağındadır.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B9' && has(c, 'B9', /BAĞ_DEĞ_DOLU_SAY\(A2:A7\)/) && cell(c, 'B9').value === 6,
      done: '<b>6</b> kişi. BAĞ_DEĞ_DOLU_SAY, içinde <b>herhangi bir şey</b> yazan hücreleri sayar: ad, sayı, tarih fark etmez.',
    },
    {
      title: 'Sınava giren: BAĞ_DEĞ_SAY',
      html: `<p><b>B10</b> hücresine <b>=BAĞ_DEĞ_SAY(F2:F7)</b> yazıp ${K('Enter')}. F sütununa bakın: kimi boş, kimi “girmedi”.</p>`,
      target: '=BAĞ_DEĞ_SAY(F2:F7)',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B10' && has(c, 'B10', /BAĞ_DEĞ_SAY\(F2:F7\)/) && cell(c, 'B10').value === 4,
      done: '<b>4</b> kişi. BAĞ_DEĞ_SAY yalnızca <b>sayı</b> olan hücreleri sayar; “girmedi” yazısı ve boş hücre sayılmadı.',
    },
    rehberSoru({
      title: 'Hangisi kaç sayar?',
      html: '<p><b>=BAĞ_DEĞ_DOLU_SAY(F2:F7)</b> yazsaydık sonuç kaç olurdu? (F2:F7: 85, 70, girmedi, 92, 64, boş)</p>',
      opts: ['4', '5', '6'], ok: 1,
      wrong: 'DOLU_SAY yazıyı da sayar, yalnızca boş hücreyi saymaz.',
      why: 'Doğru: 5. Dört not ve “girmedi” yazısı dolu; yalnızca Zeynep Hanım\'ın hücresi boş. Sayı saymak için BAĞ_DEĞ_SAY, dolu hücre saymak için BAĞ_DEĞ_DOLU_SAY.',
    }),
    {
      title: 'Eksik bilgi: BOŞLUKSAY',
      html: `<p>Kimin telefonu eksik? <b>B11</b> hücresine <b>=BOŞLUKSAY(G2:G7)</b> yazıp ${K('Enter')}.</p>`,
      target: '=BOŞLUKSAY(G2:G7)',
      hint: 'BOŞLUK ile SAY bitişik yazılır, arada alt çizgi yok.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B11' && has(c, 'B11', /BOŞLUKSAY\(G2:G7\)/) && cell(c, 'B11').value === 2,
      done: '<b>2</b> kişinin telefonu eksik (Mehmet Bey ve Emine Hanım). Uzun listelerde eksikleri bulmanın hızlı yolu.',
    },
    {
      title: 'İşlev içinde işlev',
      html: `<p>En yaşlı kursiyer hangi yıl doğmuş? En eski tarih en <b>küçük</b> sayıdır. <b>B12</b> hücresine <b>=YIL(MİN(B2:B7))</b> yazıp ${K('Enter')}.</p>`,
      target: '=YIL(MİN(B2:B7))',
      hint: 'İki parantez açtınız, iki parantez kapatın: ...B7))',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'B12' && has(c, 'B12', /YIL\(MİN\(B2:B7\)\)/) && cell(c, 'B12').value === 1950,
      done: '<b>1950</b> (Hasan Bey). MİN en eski tarihi buldu, YIL da o tarihin yılını aldı. Benzer şekilde AY() ayı, GÜN() günü verir.',
    },
    rehberSoru({
      title: 'Neden ETARİHLİ?',
      html: '<p>Yaşı <b>=YIL(BUGÜN())-YIL(B2)</b> ile de hesaplayabilir miydik?</p>',
      opts: ['Evet, sonuç her zaman aynıdır', 'Yaklaşık: doğum günü bu yıl henüz gelmemişse 1 fazla çıkar', 'Hayır, tarihlerle çıkarma yapılamaz'], ok: 1,
      wrong: 'Bir kişi aralıkta doğduysa ve bugün ekimse, yıl farkı onu bir yaş büyük gösterir.',
      why: 'Doğru. Yıl farkı yalnızca yılları çıkarır; ETARİHLİ ise doğum gününün geçip geçmediğine de bakar. Resmî yaş ve kıdem hesabında ETARİHLİ kullanın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarihler ve sayma işlevleri:</p>' },
  ],
};
