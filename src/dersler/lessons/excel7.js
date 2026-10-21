// 11. hafta ek dersi: Alt Toplam (MEB Elektronik Tablolama, “alt toplam alma”). Derneğin ekim harcama listesini kategoriye göre
// sıralamak, Alt Toplam ile her kategorinin altına toplam satırı eklemek, 1/2/3 anahat düzeyleri, ALTTOPLAM ile TOPLA farkı, Tümünü Kaldır.
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || {};
const has = (c, a, re) => re.test(String(cell(c, a).raw).toLocaleUpperCase('tr').replace(/\s/g, ''));
const DOSYA = 'dernek harcamaları.xlsx';
// Tarih, kategori, açıklama, tutar. Kategoriler bilerek karışık sırada.
const HARCAMA = [
  ['02.10.2026', 'İkram', 'Çay ve şeker', 420],
  ['03.10.2026', 'Fatura', 'Elektrik', 1250],
  ['06.10.2026', 'Kırtasiye', 'Fotokopi kâğıdı', 380],
  ['08.10.2026', 'Temizlik', 'Deterjan', 265],
  ['10.10.2026', 'İkram', 'Kurabiye', 350],
  ['13.10.2026', 'Fatura', 'Su', 410],
  ['15.10.2026', 'Kırtasiye', 'Zarf ve pul', 190],
  ['17.10.2026', 'İkram', 'Kahve', 540],
  ['20.10.2026', 'Temizlik', 'Çöp poşeti', 120],
  ['22.10.2026', 'Fatura', 'İnternet', 650],
  ['24.10.2026', 'Kırtasiye', 'Toner', 900],
  ['27.10.2026', 'Temizlik', 'Paspas', 310],
];
function tablo() {
  const cells = { A1: 'Tarih', B1: 'Kategori', C1: 'Açıklama', D1: 'Tutar' };
  const fmt = { A1: { b: true }, B1: { b: true }, C1: { b: true }, D1: { b: true } };
  HARCAMA.forEach(([t, k, a, tl], i) => {
    const r = i + 2;
    Object.assign(cells, { ['A' + r]: t, ['B' + r]: k, ['C' + r]: a, ['D' + r]: String(tl) });
    fmt['D' + r] = { f: 'tl' };
  });
  return { cells, fmt, colW: { 0: 8, 1: 13, 2: 12, 3: 9, 5: 10 } };
}
// Kategoriye göre sıralı mı? (B2:B13)
const KAT = ['Fatura', 'Fatura', 'Fatura', 'İkram', 'İkram', 'İkram', 'Kırtasiye', 'Kırtasiye', 'Kırtasiye', 'Temizlik', 'Temizlik', 'Temizlik'];
const sirali = (c) => KAT.every((k, i) => cell(c, 'B' + (i + 2)).text === k);
// Alt toplamdan sonra: Fatura 2–4 (5), İkram 6–8 (9), Kırtasiye 10–12 (13), Temizlik 14–16 (17), Genel Toplam 18
const altToplamli = (c) => /^Fatura Toplam$/.test(cell(c, 'B5').text) && /^Genel Toplam$/.test(cell(c, 'B18').text) && has(c, 'D5', /^=ALTTOPLAM\(9;D2:D4\)$/);
const kaldirildi = (c) => !X(c)?.subtotal && cell(c, 'B14').raw === '' && cell(c, 'D13').value === 310 && ![2, 3, 4, 5].some((i) => /Toplam/.test(cell(c, 'B' + i).text));

export const altToplam = {
  id: 'excel-alt-toplam', icon: '🔢', title: 'Alt Toplam: her kategorinin altına toplam satırı', minutes: 35, stage: 'desktop',
  desc: 'Listeyi kategoriye göre sıralamak, Alt Toplam ile grupların altına toplam satırı eklemek, 1-2-3 düzeyleriyle özeti görmek, ALTTOPLAM ile TOPLA farkı, Tümünü Kaldır.',
  summary: [
    ['↑ A→Z', 'Alt Toplam\'dan önce liste gruplanacak sütuna (Kategori) göre sıralanır'],
    ['🔢 Alt Toplam', 'Excel\'de: Veri sekmesi → Anahat → Alt Toplam'],
    ['Her değişiklikte', 'Hangi sütun değişince yeni grup başlasın (Kategori)'],
    ['Kullanılacak işlev', 'Topla, Say, Ortalama, Maks, Min'],
    ['Alt toplam ekle', 'Hangi sütunun toplamı alınsın (Tutar)'],
    ['1 · 2 · 3', 'Sol üstteki düzeyler: yalnız genel toplam · alt toplamlar · bütün satırlar'],
    ['=ALTTOPLAM(9;D2:D4)', '9 = topla. Aralıktaki başka alt toplamları saymaz; TOPLA ise sayar ve iki kez toplar'],
    ['Tümünü Kaldır', 'Alt toplam satırlarını siler, liste eski hâline döner'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', tablo()); },
  steps: [
    {
      title: 'Derneğin ekim harcamaları',
      html: `<p>Bir derneğin saymanısınız. Ekim ayında yapılan <b>12 harcama</b> tarih sırasıyla yazılmış: fatura, ikram, kırtasiye, temizlik karışık.</p>
        <p>Yönetim kurulu soruyor: <b>Her kalemden ne kadar harcadık?</b> Bu derste listeyi bozmadan her kategorinin altına bir <b>toplam satırı</b> ekleyeceğiz. Excel'de bunun adı <b>Alt Toplam</b>.</p>
        <p class="mut">Özet Tablo'dan farkı: sonuç aynı sayfada, listenin içinde görünür; ayrıntı satırları da yerinde kalır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'Önce sıralayın',
      html: `<p>Alt Toplam, aynı kategorilerin <b>alt alta</b> durmasını bekler. Önce listeyi kategoriye göre sıralayalım.</p>
        <p><b>B2</b> hücresine (Kategori sütununa) tıklayın ve şeritteki <b>↑ A→Z</b> düğmesine basın.</p>`,
      hint: 'Gerçek Excel\'de: Veri sekmesi → A\'dan Z\'ye Sırala. Önce Kategori sütununda bir hücre seçili olmalı.',
      on: (ev, c) => {
        if (ev.type !== 'xl-sort') return false;
        if (ev.col !== 'B') { c.note(`Liste ${ev.col} sütununa göre sıralandı. B sütununda (Kategori) bir hücreye tıklayıp yeniden ↑ A→Z'ye basın.`); return false; }
        return sirali(c);
      },
      check: sirali,
      done: 'Şimdi önce 3 fatura, sonra 3 ikram, 3 kırtasiye, 3 temizlik harcaması alt alta. Bütün satır birlikte taşındı: tarih ve tutar kaymadı.',
    },
    rehberSoru({
      title: 'Neden önce sıralama?',
      html: '<p>Liste sıralanmadan Alt Toplam yapılsaydı ne olurdu?</p>',
      opts: ['Excel listeyi kendisi sıralardı', 'Kategori her değiştiğinde ayrı bir toplam çıkardı: aynı kategori için birkaç küçük toplam', 'Hiçbir fark olmazdı'], ok: 1,
      wrong: 'Alt Toplam yalnızca yukarıdan aşağı bakar: komşu satırın kategorisi farklıysa orada bir grup biter.',
      why: 'Doğru. Alt Toplam sıralamaz; “İkram, Fatura, İkram” gibi dağınık bir listede İkram için iki ayrı toplam çıkar. Bu yüzden önce sıralanır.',
    }),
    {
      title: 'Alt Toplam penceresi',
      html: `<p>Listenin içinde bir hücre seçiliyken şeritteki <b>🔢 Alt Toplam</b> düğmesine basın. Açılan pencerede:</p>
        <ol class="steps"><li><b>Her değişiklikte:</b> Kategori</li><li><b>Kullanılacak işlev:</b> Topla</li><li><b>Alt toplam ekle:</b> yalnızca <b>Tutar</b> işaretli</li><li><b>Tamam</b></li></ol>`,
      hint: 'Gerçek Excel\'de: Veri sekmesi → Anahat grubu → Alt Toplam. “Her değişiklikte” kutusunda ilk başta Tarih yazar; açıp Kategori\'yi seçin.',
      on: (ev, c) => {
        if (ev.type !== 'xl-subtotal' || ev.op !== 'add') return false;
        if (ev.col !== 'B' || ev.fn !== 9 || ev.cols.join() !== 'D') {
          c.note(`Alt toplamlar “${ev.by}” sütununa göre ${ev.fnName} ile eklendi. Pencereyi yeniden açın: Her değişiklikte: Kategori, işlev: Topla, yalnızca Tutar işaretli. “Geçerli alt toplamları değiştir” işaretli kalsın.`);
          return false;
        }
        return altToplamli(c);
      },
      check: altToplamli,
      done: 'Her kategorinin altına kalın bir <b>“… Toplam”</b> satırı, en sona da <b>Genel Toplam</b> eklendi. Excel bunun için 5 yeni satır açtı; alttaki satırlar aşağı kaydı.',
    },
    {
      title: 'Alt toplam formülü',
      html: '<p><b>D5</b> hücresine (Fatura Toplam\'ın tutarına) tıklayın ve üstteki formül çubuğuna bakın.</p>',
      on: (ev, c) => ev.type === 'xl-select' && ev.addr === 'D5' && has(c, 'D5', /^=ALTTOPLAM\(9;D2:D4\)$/),
      done: 'Formül: <b>=ALTTOPLAM(9;D2:D4)</b>. <b>9</b> “topla” demektir (1 ortalama, 3 say, 4 en büyük, 5 en küçük). D2:D4 de üç fatura satırıdır: 1.250 + 410 + 650 = <b>2.310 ₺</b>.',
    },
    {
      title: '2. düzey: yalnızca toplamlar',
      html: `<p>Tablonun üstünde, solda <b>Anahat düzeyi: 1 2 3</b> düğmeleri çıktı. <b>2</b>'ye basın.</p>
        <p class="mut">Gerçek Excel'de bu küçük düğmeler satır numaralarının solunda, en üstte durur.</p>`,
      on: (ev) => ev.type === 'xl-outline' && ev.level === 2,
      check: (c) => X(c)?.subtotal?.level === 2,
      done: 'Ayrıntı satırları gizlendi; yalnızca 4 kategorinin toplamı ve genel toplam görünüyor. Yönetim kuruluna gösterilecek sayfa tam da bu.',
    },
    rehberSoru({
      title: 'En çok nereye?',
      html: '<p>2. düzeydeki özete bakın. Ekim ayında en çok hangi kaleme harcanmış?</p>',
      opts: ['İkram', 'Fatura', 'Kırtasiye', 'Temizlik'], ok: 1,
      wrong: 'Alt toplam satırlarındaki tutarları karşılaştırın; en büyüğü hangisi?',
      why: 'Doğru: Fatura (2.310 ₺). Sonra Kırtasiye (1.470 ₺), İkram (1.310 ₺) ve Temizlik (695 ₺) geliyor.',
    }),
    {
      title: '3. düzey: bütün satırlar',
      html: '<p>Şimdi <b>3</b>\'e basın: gizlenen satırlar geri gelsin.</p>',
      hint: '1\'e basarsanız yalnızca Genel Toplam görünür. Hiçbir satır silinmez, yalnızca gizlenir.',
      on: (ev) => ev.type === 'xl-outline' && ev.level === 3,
      check: (c) => X(c)?.subtotal?.level === 3,
      done: 'Bütün harcamalar yeniden göründü. Düzeyler yalnızca <b>görünüşü</b> değiştirir; veriye dokunmaz.',
    },
    {
      title: 'Tutar değişince',
      html: `<p>Toner faturası yanlış girilmiş: 900 değil, <b>1050</b> lira. <b>D12</b> hücresine <b>1050</b> yazıp ${K('Enter')}.</p>
        <p>Sonra <b>Kırtasiye Toplam</b> (D13) ve <b>Genel Toplam</b> (D18) satırlarına bakın.</p>`,
      target: '1050',
      hint: 'D12, Toner satırının tutarıdır. Hücreye tıklayıp yazmaya başlamanız yeter; eski sayı silinir.',
      on: (ev, c) => {
        if (ev.type !== 'xl-edit' || ev.addr !== 'D12') return false;
        if (cell(c, 'D12').value !== 1050) { c.note('D12\'ye 1050 yazın (noktasız da olur).'); return false; }
        return cell(c, 'D13').value === 1620 && cell(c, 'D18').value === 5935;
      },
      done: 'Kırtasiye Toplam <b>1.470 ₺ → 1.620 ₺</b>, Genel Toplam <b>5.935 ₺</b> oldu. Alt toplamlar birer formül olduğu için kendiliğinden güncellendi.',
    },
    {
      title: 'TOPLA ile deneyin',
      html: `<p>Genel Toplam'ın formülü <b>=ALTTOPLAM(9;D2:D17)</b>. Aynı aralığı TOPLA ile toplasaydık ne olurdu? Görelim.</p>
        <p>Genel Toplam satırında, <b>F18</b> hücresine <b>=TOPLA(D2:D17)</b> yazıp ${K('Enter')}.</p>`,
      target: '=TOPLA(D2:D17)',
      hint: 'F18, D18\'in iki sağındaki hücredir. Aralıktaki iki nokta üst üste: Shift + nokta.',
      on: (ev, c) => ev.type === 'xl-edit' && ev.addr === 'F18' && has(c, 'F18', /^=TOPLA\(D2:D17\)$/) && cell(c, 'F18').value === 11870,
      done: 'TOPLA <b>11.870</b> buldu, ALTTOPLAM ise <b>5.935</b>. Tam iki katı!',
    },
    rehberSoru({
      title: 'Neden iki katı?',
      html: '<p>TOPLA(D2:D17) neden iki katını buldu?</p>',
      opts: ['Formülü yanlış yazdık', 'D2:D17 aralığında alt toplam satırları da var; TOPLA onları da topladı, her harcama iki kez sayıldı', 'Tutar sütununda gizli satırlar var'], ok: 1,
      wrong: 'D5, D9, D13 ve D17 hücreleri de bu aralığın içinde. Onlarda ne yazıyor?',
      why: 'Doğru. ALTTOPLAM, aralıktaki başka ALTTOPLAM hücrelerini <b>atlar</b>; TOPLA atlamaz. Alt toplamlı bir listede genel toplam için hep ALTTOPLAM kullanılır.',
    }),
    {
      title: 'Tümünü Kaldır',
      html: `<p>Rapor hazır; şimdi listeyi eski hâline döndürelim. Listede bir hücre seçiliyken <b>🔢 Alt Toplam</b>'a yeniden basın ve penceredeki <b>Tümünü Kaldır</b> düğmesine basın.</p>`,
      hint: 'Tümünü Kaldır, pencerenin en altında, Tamam\'ın solundadır. Alt toplam satırları silinir; harcamalar yerinde kalır.',
      on: (ev, c) => ev.type === 'xl-subtotal' && ev.op === 'remove' && kaldirildi(c),
      check: kaldirildi,
      done: 'Alt toplam satırları ve 1-2-3 düğmeleri kalktı; F18\'e yazdığımız deneme de Genel Toplam satırıyla birlikte silindi. Liste yeniden 12 satır, sıralı hâliyle duruyor.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Alt Toplam ile uzun bir listeyi gruplara ayırıp özetleyebiliyorsunuz:</p>' },
  ],
};
