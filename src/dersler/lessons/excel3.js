// 11. hafta ek dersleri (Excel ayrıntılı): DÜŞEYARA ile fiyat listesinden değer getirmek; açılır liste (veri doğrulama), EĞERSAY ve koşullu biçimle aidat takibi.
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || { raw: '', value: '', text: '' };
const sheetOpen = (c, data) => maxed(c, 'sheet', data ? { data } : {});
const near = (v, n) => typeof v === 'number' && Math.abs(v - n) < 0.01;
const evs = ['xl-edit', 'xl-fill', 'xl-paste', 'xl-select', 'xl-valid', 'xl-pick', 'xl-cond', 'xl-format'];
const when = (test) => (ev, c) => evs.includes(ev.type) && !!test(c);

const FIYAT = () => ({
  cells: { A1: 'Ürün', B1: 'Adet', C1: 'Birim fiyat', D1: 'Tutar', A2: 'Domates', B2: '3', A3: 'Peynir', B3: '1', A4: 'Ekmek', B4: '2', A5: 'Süt', B5: '2',
    D2: '=B2*C2', D3: '=B3*C3', D4: '=B4*C4', D5: '=B5*C5', A7: 'TOPLAM', D7: '=TOPLA(D2:D5)',
    F1: 'Ürün', G1: 'Fiyat', F2: 'Domates', G2: '45', F3: 'Peynir', G3: '120,5', F4: 'Zeytin', G4: '85', F5: 'Ekmek', G5: '15', F6: 'Süt', G6: '38,75', F7: 'Yumurta', G7: '6' },
  fmt: { A1: { b: true }, B1: { b: true }, C1: { b: true }, D1: { b: true }, F1: { b: true }, G1: { b: true }, A7: { b: true }, D7: { b: true, f: 'tl' }, G2: { f: 'tl' }, G3: { f: 'tl' }, G4: { f: 'tl' }, G5: { f: 'tl' }, G6: { f: 'tl' }, G7: { f: 'tl' },
    C2: { f: 'tl' }, C3: { f: 'tl' }, C4: { f: 'tl' }, C5: { f: 'tl' }, D2: { f: 'tl' }, D3: { f: 'tl' }, D4: { f: 'tl' }, D5: { f: 'tl' } },
  colW: { 0: 10, 2: 11, 3: 10, 5: 10, 6: 10 },
});

const isVlookup = (raw) => /^=\s*(DÜŞEYARA|DUSEYARA|VLOOKUP)\s*\(/i.test(raw || '');

export const duseyara = {
  id: 'duseyara', icon: '🔎', title: 'DÜŞEYARA: fiyat listesinden ürünü bulmak', minutes: 35, stage: 'desktop',
  desc: 'DÜŞEYARA ile fiyat listesinden ürünün fiyatını otomatik getirmek.',
  summary: [
    ['DÜŞEYARA', 'Bir listede ürünü bulup yanındaki fiyatı getirir (Excel\'in “rehberden numara bulma”sı)'],
    ['=DÜŞEYARA(A2;$F$2:$G$7;2;YANLIŞ)', 'A2\'deki ürünü F:G tablosunun ilk sütununda ara; 2. sütundaki fiyatı getir; tam eşleşme'],
    ['İlk sütun', 'Aranan değer, tablonun en soldaki sütununda bulunmalıdır'],
    ['Sütun numarası', 'Getirilecek değerin tablonun kaçıncı sütunda olduğu (fiyat 2. sütun)'],
    ['YANLIŞ', 'Tam eşleşme ister; aramanın “yaklaşık” değil “aynen” olduğunu söyler'],
    ['$ işaretleri', 'Tablo adresi aşağı kopyalanınca kaymasın diye sabitlenir'],
    ['#YOK', 'Aranan ürün listede yok (yazım hatası ya da eksik ürün)'],
  ],
  steps: [
    {
      title: 'Fiyatı tek tek yazmayın',
      html: `<p>Alışveriş listenizde ürün adı ve adet var; fiyatları <b>fiyat listesinden</b> tek tek bakıp yazmak yorucu ve hataya açık. Excel bunu <b>kendiliğinden</b> yapabilir: <b>DÜŞEYARA</b>.</p>
        <p>Rehberde bir kişinin adını bulup yanındaki numarasına bakmak gibi: ürünün adını bulur, yanındaki fiyatı getirir. Fiyat değişirse hepsi kendiliğinden güncellenir.</p>
        <p>Solda alışveriş listesi (A–D), sağda fiyat listesi (F–G) var.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, FIYAT()); },
    },
    {
      title: 'Formülün parçaları',
      html: `<p>Yazacağımız formül:</p><div class="target" style="font-size:1.05em;overflow-wrap:break-word">=DÜŞEYARA(A2;<wbr>$F$2:$G$7;<wbr>2;<wbr>YANLIŞ)</div>
        <ol class="steps"><li><b>A2</b>: aranan (ürünün adı)</li><li><b>$F$2:$G$7</b>: aranacak tablo (fiyat listesi)</li><li><b>2</b>: tablonun <b>2. sütunundaki</b> değer getirilsin (Fiyat)</li><li><b>YANLIŞ</b>: tam eşleşme (yaklaşık değil)</li></ol>
        <p class="mut">Parçaları noktalı virgülle ayırın. $ işaretlerini ve tablo adresini yazmakla uğraşmayın: fareyle seçerek de yazabilirsiniz.</p>`,
      manual: 'Anladım ✔',
    },
    {
      title: 'İlk formülü yazın',
      html: '<p><b>C2</b> hücresine tıklayın ve yukarıdaki formülü <b>aynen</b> yazıp Enter\'a basın. Domates\'in fiyatı (45 ₺) gelmeli.</p>',
      hint: 'Formül = ile başlar. Noktalı virgül: Shift + virgül tuşu. Tırnak koymayın; YANLIŞ yazı değil, bir sözcüktür. 45\'i elle yazmayın: formülü yazın.',
      on: (ev, c) => {
        if (!evs.includes(ev.type) || !near(cell(c, 'C2').value, 45)) return false;
        if (!isVlookup(cell(c, 'C2').raw)) { c.warn('45 yazmışsınız ama bu bir formül değil. C2\'ye =DÜŞEYARA(A2;$F$2:$G$7;2;YANLIŞ) formülünü yazın.'); return false; }
        return true;
      },
      done: 'Domates için 45 ₺ geldi! Formül, “Domates”i fiyat listesinde bulup yanındaki fiyatı aldı.',
    },
    {
      title: 'Aşağı kopyalayın',
      html: '<p>C2\'yi seçip sağ alt köşesindeki <b>doldurma tutamacını</b> <b>C5</b>\'e kadar aşağı çekin. Diğer ürünlerin fiyatları da gelmeli.</p>',
      hint: 'C2 hücresini seçin; köşedeki küçük kareyi C5\'e kadar sürükleyin. Aşağıda #YOK çıkarsa formüldeki $ işaretlerini unutmuşsunuzdur: C2\'ye formülü $F$2:$G$7 diye, $ işaretleriyle yazıp yeniden kopyalayın.',
      on: when((c) => isVlookup(cell(c, 'C3').raw) && near(cell(c, 'C3').value, 120.5) && near(cell(c, 'C4').value, 15) && near(cell(c, 'C5').value, 38.75)),
      done: 'Dört ürünün fiyatı geldi. Bu mümkün oldu çünkü tablo adresi <b>$ ile sabitlenmişti</b>: aşağı kopyalanırken kaymadı, yalnızca A2 → A3, A4… oldu.',
    },
    rehberSoru({
      title: 'Toplam kaç lira?',
      html: '<p>D7 hücresindeki <b>TOPLAM</b>\'a bakın. Alışverişin toplamı kaç ₺?</p>',
      opts: ['363,00 ₺', '298,25 ₺', '420,00 ₺'], ok: 0,
      wrong: 'D2:D5\'in toplamı. Elle de hesaplayabilirsiniz: 3×45 + 120,50 + 2×15 + 2×38,75.',
      why: 'Doğru: 363 ₺ (135 + 120,50 + 30 + 77,50). Tutar sütunu zaten “adet × fiyat” hesaplıyordu; siz yalnızca fiyatı DÜŞEYARA ile getirdiniz.',
    }),
    {
      title: 'Fiyat zamlandı',
      html: '<p>Domates 50 ₺ oldu. <b>G2</b> hücresini (fiyat listesindeki Domates) <b>50</b> yapın. Toplamın kendiliğinden nasıl değiştiğine bakın.</p>',
      hint: 'Fiyat listesi sağ taraftaki F–G sütunlarında. G2\'ye tıklayıp 50 yazın.',
      on: when((c) => near(cell(c, 'G2').value, 50) && near(cell(c, 'C2').value, 50) && near(cell(c, 'D7').value, 378)),
      done: 'C2 de 50 oldu, toplam 378 ₺. Fiyatı <b>tek yerden</b> değiştirdiniz, bütün alışveriş listeleri güncellendi: DÜŞEYARA\'nın asıl gücü bu.',
    },
    {
      title: 'Yazım hatası: #YOK',
      html: '<p><b>A3</b> hücresindeki “Peynir”i <b>Peynr</b> (bir harf eksik) yapın. C3\'te ne çıktı?</p>',
      on: when((c) => /Peynr/i.test(cell(c, 'A3').raw) && cell(c, 'C3').text === '#YOK'),
      done: '<b>#YOK</b>: “aradığınız ürün listede yok” demek. Bilgisayar “Peynr”i tanımadı. Sorun formülde değil, yazımdadır.',
    },
    {
      title: 'Hatayı düzeltin',
      html: '<p>A3\'ü yeniden <b>Peynir</b> yapın. Fiyat geri gelmeli.</p>',
      on: when((c) => norm(cell(c, 'A3').raw) === 'peynir' && near(cell(c, 'C3').value, 120.5)),
      done: 'Fiyat geri geldi. #YOK görürseniz önce aradığınız kelimenin yazımına ve listede olup olmadığına bakın.',
    },
    rehberSoru({
      title: 'YANLIŞ ne işe yarar?',
      html: '<p>Formülün sonundaki <b>YANLIŞ</b> neyi söyler?</p>',
      opts: ['Formül yanlış, düzeltin', 'Tam eşleşme ara: “Domates” için aynen Domates olan satırı bul', 'Fiyatı sıfır yap'], ok: 1,
      wrong: 'Bu bir hata mesajı değil; formüle verilen bir talimat.',
      why: 'Doğru. YANLIŞ (ya da 0) “tam eşleşme” demektir. Aramayı unutursanız ya da DOĞRU yazarsanız Excel yaklaşık eşleşme arar ve ürün adlarında yanlış sonuç verebilir; fiyat ve ürün listelerinde hep YANLIŞ kullanın.',
    }),
    rehberSoru({
      title: 'Sütun numarası',
      html: '<p>Fiyat listesi üç sütunluysa (Ürün, Kategori, Fiyat) ve fiyatı getirmek istiyorsanız formüldeki sütun numarası ne olmalı?</p>',
      opts: ['1', '2', '3'], ok: 2,
      wrong: 'Sütunlar soldan sayılır; Ürün 1. sütun.',
      why: 'Doğru: 3. Aranan değer her zaman tablonun 1. sütunundadır; getirilecek değer tablonun soldan kaçıncı sütunuysa o sayı yazılır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>DÜŞEYARA ile fiyat listesinden değer getirdiniz:</p>' },
  ],
};

// ---------- Açılır liste ve aidat takibi
const AIDAT = () => ({
  cells: { A1: 'Daire', B1: 'Ad Soyad', C1: 'Ekim ayı durumu', E1: 'Ödeyen sayısı', A2: '1', B2: 'Fatma Yıldız', A3: '2', B3: 'Ahmet Demir', A4: '3', B4: 'Ayşe Kaya', A5: '4', B5: 'Mehmet Aksoy', A6: '5', B6: 'Zeynep Çelik', A7: '6', B7: 'Hasan Kara', A8: '7', B8: 'Emine Aydın', A9: '8', B9: 'Ali Şahin' },
  fmt: { A1: { b: true }, B1: { b: true }, C1: { b: true }, E1: { b: true } },
  colW: { 1: 13, 2: 15, 4: 13 },
});
const valids = (c) => X(c)?.valids || [];

export const aidatTakip = {
  id: 'aidat-takip', icon: '✅', title: 'Açılır liste ve aidat takibi', minutes: 35, stage: 'desktop',
  desc: 'Açılır liste, EĞERSAY ile saymak, koşullu biçimle renklendirmek.',
  summary: [
    ['✔ Açılır Liste', 'Hücrelere yalnızca belirlediğiniz seçenekler girilebilir; hücrenin yanında ▾ çıkar'],
    ['Seçenekleri yazmak', 'Virgülle ayırın: Ödendi, Ödenmedi, Kısmen'],
    ['Neden?', 'Elle yazınca “odendi”, “Ödendi ” gibi küçük farklar sayımı bozar; listeden seçince herkes aynı yazar'],
    ['=EĞERSAY(C2:C9;"Ödendi")', 'Kaç kişinin ödediğini sayar'],
    ['Koşullu Biçim', '“Ödenmedi”leri kırmızı yapar: bir bakışta görülür'],
    ['Geçersiz giriş', 'Listede olmayan bir şey yazılırsa Excel uyarır ve kabul etmez'],
  ],
  steps: [
    {
      title: 'Aynı yazı, farklı yazılış',
      html: `<p>Apartman aidatını takip ediyorsunuz. Her daire için “Ödendi” ya da “Ödenmedi” yazacaksınız. Ama zamanla <b>“odendi”</b>, <b>“Ödendi ”</b> (sonunda boşluk), <b>“ödendı”</b> gibi küçük farklarla yazılır; sayarken bilgisayar bunları <b>ayrı</b> sayar.</p>
        <p>Çözüm: hücreye yazı yazmak yerine <b>açılır listeden seçmek</b>. Herkes aynı sözcüğü kullanmak zorunda kalır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); sheetOpen(c, AIDAT()); },
    },
    {
      title: 'Hücreleri seçin',
      html: '<p><b>C2</b>\'den <b>C9</b>\'a kadar sütunu fareyle <b>sürükleyerek</b> seçin (Ekim ayı durumu sütunu).</p>',
      hint: 'C2\'ye basılı tutup C9\'a kadar aşağı sürükleyin, bırakın.',
      on: (ev, c) => ev.type === 'xl-select' && ev.range === 'C2:C9',
      done: 'Sekiz hücre seçili. Şimdi bunlara “yalnızca şu seçenekler” kuralı koyacağız.',
    },
    {
      title: 'Açılır liste kuralı',
      html: '<p>Şeritteki <b>✔ Açılır Liste</b> düğmesine tıklayın. Kutuya <b>Ödendi, Ödenmedi, Kısmen</b> yazın (virgülle ayırarak) ve <b>Uygula</b>\'ya basın.</p>',
      hint: 'Düğme Koşullu Biçim\'in yanında. Üç seçeneği virgülle ayırın.',
      on: (ev, c) => ev.type === 'xl-valid' && ev.list.length >= 3 && ev.range === 'C2:C9',
      done: 'Kural kondu. Artık C2:C9 aralığındaki bir hücreye tıkladığınızda yanında küçük bir <b>▾</b> belirir.',
    },
    {
      title: 'Listeden seçin',
      html: '<p>C2\'ye tıklayın, yanındaki <b>▾</b>\'ya basıp <b>Ödendi</b>\'yi seçin. Sonra C3, C4 ve C5 için de listeden seçin. Bu dört hücrenin <b>en az biri Ödenmedi</b> olsun (sonra boyayacağız); öbürlerini istediğiniz gibi seçin.</p>',
      hint: 'Hücre seçiliyken sağ kenarında küçük bir ok görünür. Oka tıklayınca seçenekler çıkar.',
      on: (ev, c) => {
        if (ev.type !== 'xl-pick') return false;
        const vs = ['C2', 'C3', 'C4', 'C5'].map((a) => cell(c, a).raw);
        return vs.every(Boolean) && vs.some((v) => norm(v) === 'ödenmedi');
      },
      done: 'Dört daire dolu. Hiçbirini yazmadınız: yazım hatası ihtimali sıfır.',
    },
    {
      title: 'Listede olmayanı yazın',
      html: '<p>Bir deneme: <b>C6</b>\'ya tıklayıp klavyeyle <b>bilmiyorum</b> yazın ve Enter\'a basın.</p>',
      on: (ev) => ev.type === 'xl-valid-reject',
      done: 'Excel yazıyı <b>kabul etmedi</b> ve uyardı: “Girdiğiniz değer geçersiz”. Listede olmayan hiçbir şey girilemez; kayıtlarınız temiz kalır.',
    },
    {
      title: 'Kalan daireleri doldurun',
      html: '<p>C6\'dan C9\'a kadar da listeden seçin (hepsini istediğiniz gibi). En az <b>iki</b> tanesi <b>Ödendi</b> olsun.</p>',
      on: (ev, c) => {
        if (ev.type !== 'xl-pick') return false;
        const vs = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'].map((a) => cell(c, a).raw);
        return vs.every(Boolean) && vs.filter((v) => norm(v) === 'ödendi').length >= 2;
      },
      done: 'Sekiz dairenin hepsi dolu.',
    },
    {
      title: 'Kaç kişi ödedi?',
      html: '<p><b>E2</b> hücresine <b>=EĞERSAY(C2:C9;"Ödendi")</b> yazın. Ödeyen sayısı çıkar.</p>',
      hint: 'EĞERSAY, belirtilen aralıkta tırnak içindeki yazıyı kaç hücrede bulduğunu sayar.',
      on: when((c) => { const v = cell(c, 'E2').value; const n = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'].filter((a) => norm(cell(c, a).raw) === 'ödendi').length; return /EĞERSAY|EGERSAY|COUNTIF/i.test(cell(c, 'E2').raw) && v === n; }),
      done: 'Doğru sayı çıktı. Listeden seçildiği için bütün “Ödendi”ler aynı yazıldı ve eksiksiz sayıldı. Elle yazsaydınız birkaçı kaçabilirdi.',
    },
    {
      title: '“Ödenmedi”leri boyayın',
      html: '<p>C2:C9\'u yeniden seçin. <b>🎨 Koşullu Biçim</b> → <b>eşit olanları</b> → <b>Ödenmedi</b> yazıp rengi <b>Kırmızı</b> yapın → <b>Uygula</b>.</p>',
      hint: 'Önce C2:C9\'u fareyle seçin. Kutuya Ödenmedi yazın, renk listesinden kırmızıyı seçin.',
      on: (ev) => ev.type === 'xl-cond' && /ödenmedi/i.test(ev.crit),
      done: 'Ödenmeyenler kırmızı oldu: toplantıda kimi arayacağınızı bir bakışta görürsünüz.',
    },
    rehberSoru({
      title: 'Neden açılır liste?',
      html: '<p>Aidat listesinde elle yazmak yerine açılır liste kullanmanın en büyük yararı nedir?</p>',
      opts: ['Daha güzel görünür', 'Herkes aynı yazıyı kullanır; yazım farkları yüzünden sayım ve süzme bozulmaz', 'Dosya küçülür'], ok: 1,
      wrong: 'Esas yarar görünüşte değil, doğruluktadır.',
      why: 'Doğru. Açılır liste “kayıt temizliği” sağlar: aynı şey her yerde aynı yazılır. EĞERSAY, filtre ve sıralama ancak böyle güvenilir çalışır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Açılır liste ile aidat takibi:</p>' },
  ],
};
