// 11. hafta ek dersi: Excel hataları (#DEĞER!, #AD?, #SAYI/0!) ne demek ve nasıl düzeltilir;
// uzun bir harcama listesini Özet Tablo ile formül yazmadan özetlemek.
import { desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || {};
const hatali = (c, a) => /^#/.test(String(cell(c, a).text));

const KAYIT = [
  ['01.10', 'Market', '650'], ['03.10', 'Fatura', '845,2'], ['05.10', 'İlaç', '240'], ['08.10', 'Market', '420'],
  ['10.10', 'Fatura', '1245,5'], ['12.10', 'Ulaşım', '150'], ['15.10', 'Market', '780'], ['18.10', 'İlaç', 'iki yüz'],
  ['20.10', 'Market', '600'], ['22.10', 'Ulaşım', '150'], ['25.10', 'Fatura', '320'], ['28.10', 'İlaç', '200'],
];
function tablo() {
  const cells = { A1: 'Tarih', B1: 'Kategori', C1: 'Tutar' };
  KAYIT.forEach(([d, k, t], i) => { cells['A' + (i + 2)] = d + '.2026'; cells['B' + (i + 2)] = k; cells['C' + (i + 2)] = t; });
  Object.assign(cells, {
    E2: 'Toplam (+ ile)', F2: '=C2+C3+C4+C5+C6+C7+C8+C9+C10+C11+C12+C13',
    E3: 'Toplam (işlevle)', F3: '=TOPLAM(C2:C13)',
    E4: 'Gün sayısı', E5: 'Günlük ortalama', F5: '=F2/F4',
  });
  const fmt = { A1: { b: true }, B1: { b: true }, C1: { b: true } };
  for (let r = 2; r <= 13; r++) fmt['C' + r] = { f: 'tl' };
  fmt.F2 = { f: 'tl' }; fmt.F3 = { f: 'tl' }; fmt.F5 = { f: 'tl' };
  return { cells, fmt, colW: { 0: 9, 4: 13, 5: 11 } };
}

export const excelHata = {
  id: 'excel-hata', icon: '⚠', title: 'Excel hataları (#DEĞER!, #AD?, #SAYI/0!) ve Özet Tablo', minutes: 35, stage: 'desktop',
  desc: 'Hücrede çıkan hata kodlarını anlamak ve düzeltmek; uzun listeyi formülsüz özetlemek.',
  summary: [
    ['#DEĞER!', 'Sayı yerine yazı var (ör. “iki yüz”): rakamla yazın'],
    ['#AD?', 'İşlevin adı yanlış yazılmış (TOPLAM değil TOPLA)'],
    ['#SAYI/0!', 'Sıfıra ya da boş hücreye bölünüyor: bölen hücreyi doldurun'],
    ['#####', 'Hata değil: sütun dar; sütun çizgisine çift tıklayın'],
    ['Ekle → 🧮 Özet Tablo', 'Satırlar: neye göre gruplanacak; Değerler: neyin toplamı'],
    ['Özet Tablo sayfası', 'Ana liste değişirse özet tabloyu yeniden oluşturun'],
  ],
  setup: (c) => { put(c, 'docs', 'ekim harcamaları.xlsx', 'file', tablo()); },
  steps: [
    {
      title: 'Hücrede garip yazılar',
      html: `<p>Ekim ayının harcamalarını Excel'e yazdınız; sağ tarafta toplamı ve günlük ortalamayı hesaplatmak istediniz. Ama hücrelerde <b>#DEĞER!</b>, <b>#AD?</b> gibi garip yazılar çıktı.</p>
        <p>Korkmayın: bunlar Excel'in “bir şey ters gitti” deme şekli. Her kodun anlamı bellidir; öğrenince düzeltmek bir dakika sürer.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { node: c.d.fs.find('docs', 'ekim harcamaları.xlsx').id }); },
    },
    {
      title: '#DEĞER!: hücreye tıklayın',
      html: '<p><b>F2</b> hücresine (Toplam + ile) tıklayın. Formül çubuğunun altında hatanın ne demek olduğu yazar; okuyun.</p>',
      on: (ev) => ev.type === 'xl-select' && ev.addr === 'F2',
      done: '“Sayı olması gereken yerde yazı”: formül toplanacak hücrelerden birinde rakam yerine yazı buldu.',
    },
    {
      title: 'Yazıyla yazılan sayıyı bulun',
      html: '<p>Tutar sütununda (C) bir tutar <b>yazıyla</b> yazılmış. Bulun, hücreye tıklayıp <b>200</b> yazın ve Enter\'a basın.</p>',
      hint: 'C9 hücresinde “iki yüz” yazıyor. Tıklayıp doğrudan 200 yazmanız yeter; eskisi silinir.',
      check: (c) => !hatali(c, 'F2'),
      on: (ev, c) => ev.type === 'xl-edit' && !hatali(c, 'F2'),
      done: 'F2 düzeldi: toplam hesaplandı. Excel “iki yüz”ü okuyamaz; sayıları her zaman rakamla yazın.',
    },
    {
      title: '#AD?: işlevin adı',
      html: '<p><b>F3</b>\'e tıklayın. Formül çubuğunda <b>=TOPLAM(C2:C13)</b> yazıyor. Excel\'de bu işlevin adı <b>TOPLA</b>\'dır. Formülü düzeltin: <b>=TOPLA(C2:C13)</b></p>',
      hint: 'F3\'e tıklayın, yukarıdaki formül çubuğunda “TOPLAM”daki son M harfini silin, Enter. Ya da hücreye doğrudan =TOPLA(C2:C13) yazın.',
      check: (c) => !hatali(c, 'F3') && /TOPLA\(/i.test(cell(c, 'F3').raw),
      on: (ev, c) => ev.type === 'xl-edit' && !hatali(c, 'F3') && /TOPLA\(/i.test(cell(c, 'F3').raw),
      done: 'Doğru adı yazınca hesapladı. #AD? çoğunlukla bir harf hatasıdır.',
    },
    {
      title: '#SAYI/0!: sıfıra bölme',
      html: '<p><b>F5</b> (Günlük ortalama) şimdi <b>#SAYI/0!</b> gösteriyor: toplam, <b>F4</b>\'teki gün sayısına bölünüyor ama F4 boş. Boş hücre sıfır sayılır; sıfıra bölünemez.</p><p><b>F4</b>\'e <b>31</b> yazıp Enter\'a basın.</p>',
      check: (c) => !hatali(c, 'F5') && typeof cell(c, 'F5').value === 'number',
      on: (ev, c) => ev.type === 'xl-edit' && !hatali(c, 'F5') && typeof cell(c, 'F5').value === 'number',
      done: 'Günlük ortalama hesaplandı. Ekimde günde yaklaşık 187 ₺ harcanmış.',
    },
    rehberSoru({
      title: 'Hangisi ne demek?',
      html: '<p>Bir hücrede <b>#AD?</b> görüyorsunuz. En olası sebep hangisi?</p>',
      opts: ['Sıfıra bölme', 'İşlevin adı yanlış yazılmış', 'Sütun çok dar'], ok: 1,
      wrong: 'Sıfıra bölme #SAYI/0!, dar sütun ##### olarak görünür.',
      why: 'Doğru: #AD?, Excel\'in işlev adını tanımadığını gösterir (TOPLAM, ORTLAMA gibi).',
    }),
    {
      title: 'Özet Tablo: formülsüz özet',
      html: `<p>Şimdi asıl soru: <b>hangi kategoriye ne kadar</b> harcadınız? Formül yazmadan iki tıkla bulalım.</p>
        <ol class="steps"><li>Soldaki tablonun içinde herhangi bir hücreye tıklayın (ör. <b>B3</b>).</li><li>Üstteki <b>🧮 Özet Tablo</b> düğmesine basın.</li>
        <li>Satırlar: <b>Kategori</b>, Değerler: <b>Toplam · Tutar</b> seçin ve <b>Oluştur</b>.</li></ol>`,
      hint: 'Özet Tablo düğmesi, Filtre düğmesinin yanında. Önce A–C sütunlarındaki tablonun içine tıklamayı unutmayın.',
      on: (ev, c) => {
        if (ev.type !== 'xl-pivot') return false;
        if (!/kategori/i.test(ev.rowField) || !/tutar/i.test(ev.valueField) || ev.fn !== 'sum') { c.note(`Özet tablo “${ev.rowField}”e göre oluştu. Satırlar: Kategori, Değerler: Toplam · Tutar seçerek yeniden deneyin.`); return false; }
        return true;
      },
      done: 'Yeni bir sayfa açıldı: her kategori bir satırda, yanında toplamı, en altta genel toplam. 12 satırlık liste 4 satıra indi.',
    },
    rehberSoru({
      title: 'Para nereye gitmiş?',
      html: '<p>Özet tabloya bakın. Ekim ayında <b>en çok</b> hangi kategoriye harcanmış?</p>',
      opts: ['Fatura', 'Market', 'İlaç', 'Ulaşım'], ok: 1,
      wrong: 'Sağ sütundaki toplamları karşılaştırın; en büyüğü hangisi?',
      why: 'Doğru: Market (2.450 ₺), faturaların biraz önünde. Yüzlerce satırlık listede de aynı iki tık yeter.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Excel hatalarını okuyup düzeltebiliyor, uzun listeleri özetleyebiliyorsunuz:</p>' },
  ],
};
