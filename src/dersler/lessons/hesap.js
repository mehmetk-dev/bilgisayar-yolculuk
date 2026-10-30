// 11. hafta: hesap tablosu (Excel benzeri). MEB Bilgisayar İşletmeni programının “Excel temel seviye” ünitesine göre:
// hücre, satır, sütun; veri girişi; formüller ve işlevler (TOPLA, ORTALAMA); otomatik toplam; biçimlendirme; sıralama; grafik.
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || { raw: '', value: '', text: '' };
const sheetOpen = (c, data) => maxed(c, 'sheet', data ? { data } : {});
const near = (v, n) => typeof v === 'number' && Math.abs(v - n) < 0.01;
const editEvents = ['xl-edit', 'xl-autosum', 'xl-format', 'xl-sort', 'xl-chart', 'xl-select', 'xl-paste', 'xl-fill', 'xl-cond', 'xl-filter', 'xl-filter-on'];
const when = (test) => (ev, c) => editEvents.includes(ev.type) && !!test(c);

const BUTCE = [['Gider', 'Tutar'], ['Kira', '5000'], ['Elektrik', '750'], ['Su', '300'], ['Market', '4000']];
const butceData = () => {
  const cells = {};
  BUTCE.forEach(([a, b], i) => { cells['A' + (i + 1)] = a; cells['B' + (i + 1)] = b; });
  cells.A6 = 'Toplam'; cells.B6 = '=TOPLA(B2:B5)';
  return { cells };
};

export const hesap1 = {
  id: 'hesap1', icon: '📗', title: 'Hesap tablosu: hücreler ve formüller', minutes: 40, stage: 'desktop',
  desc: 'Satır, sütun, hücre; formül yazmak, TOPLA ve ORTALAMA.',
  summary: [
    ['Sütun', 'Yukarıdan aşağı: A, B, C…'],
    ['Satır', 'Soldan sağa: 1, 2, 3…'],
    ['Hücre adresi', 'Sütun harfi + satır numarası: B3'],
    ['Enter / Tab', 'Yazıyı onaylar; alttaki / sağdaki hücreye geçer'],
    ['=', 'Formül her zaman = ile başlar: =B2+B3'],
    ['=TOPLA(B2:B5)', 'B2\'den B5\'e kadar toplar (iki nokta: “den…e kadar”)'],
    ['=ORTALAMA(B2:B5)', 'Ortalamayı bulur'],
    ['∑ Otomatik Toplam', 'Üstteki sayıları toplayan formülü kendisi yazar'],
  ],
  steps: [
    {
      title: 'Hesap tablosu nedir?',
      html: `<p>Hesap tablosu (en bilineni Microsoft Excel), <b>satır ve sütunlardan</b> oluşan büyük bir hesap kâğıdıdır. Ev bütçesi, fatura takibi, not çizelgesi, stok listesi… hesap gereken her iş bununla yapılır.</p>
        <ul class="big-list"><li><b>Sütunlar</b> harfle adlandırılır: A, B, C…</li><li><b>Satırlar</b> numarayla: 1, 2, 3…</li><li>Her kutuya <b>hücre</b> denir. Adı, sütun harfi ve satır numarasıdır: <b>B3</b>.</li></ul>
        <p>Bu derste bir <b>ev bütçesi</b> hazırlayacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Programı açın',
      html: '<p>⊞ <b>Başlat</b>\'tan <b>📗 Hesap Tablosu</b>\'nu açın.</p>',
      mouse: '🖱 Başlat → Hesap Tablosu',
      check: (c) => !!c.d.find('sheet'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'sheet',
      done: 'Sol üstteki küçük kutu <b>Ad kutusu</b>dur: seçili hücrenin adresini gösterir. Şu an A1.',
    },
    {
      title: 'Hücre adresi',
      html: '<p><b>C4</b> hücresine tıklayın: C sütunu ile 4. satırın kesiştiği kutu.</p>',
      mouse: '🖱 C4',
      setup: (c) => sheetOpen(c),
      hint: 'Önce üstteki harflerden C\'yi bulun, sonra aşağı inip soldaki 4 numarayla aynı hizadaki kutuya tıklayın.',
      on: (ev, c) => {
        if (ev.type !== 'xl-select') return false;
        if (ev.addr !== 'C4') c.note(`Şu an <b>${ev.addr}</b> seçili (Ad kutusuna bakın). C sütunu, 4. satır olmalı.`);
        return ev.addr === 'C4';
      },
      done: 'Ad kutusunda <b>C4</b> yazıyor. Sütun ve satır başlıkları da yeşil oldu.',
    },
    {
      title: 'Başlıkları yazın',
      html: `<p><b>A1</b> hücresine tıklayın, <b>Gider</b> yazın ve ${K('Tab')}\'a basın (sağa geçer). <b>B1</b>\'e <b>Tutar</b> yazıp ${K('Enter')}.</p>`,
      combo: ['Tab'],
      hint: 'Hücreye tıklayıp doğrudan yazmaya başlayın; yazdığınız hem hücrede hem üstteki formül çubuğunda görünür.',
      on: when((c) => norm(cell(c, 'A1').raw) === 'gider' && norm(cell(c, 'B1').raw) === 'tutar'),
      done: 'Yazı (metin) hücrenin <b>soluna</b> yaslanır.',
    },
    {
      title: 'Giderleri yazın',
      html: `<p>A sütununa giderleri, B sütununa tutarlarını yazın. Her hücreden sonra ${K('Enter')} ile aşağı inin:</p>
        <table class="sum">${BUTCE.slice(1).map(([a, b], i) => `<tr><th>A${i + 2}: ${a}</th><td>B${i + 2}: ${b}</td></tr>`).join('')}</table>`,
      hint: 'Önce A2\'ye tıklayıp dört gideri alt alta yazın. Sonra B2\'ye tıklayıp tutarları yazın. Sayılara TL yazmayın; sadece rakam.',
      on: when((c) => BUTCE.slice(1).every(([a, b], i) => norm(cell(c, 'A' + (i + 2)).raw) === norm(a) && near(cell(c, 'B' + (i + 2)).value, +b))),
      done: 'Sayılar hücrenin <b>sağına</b> yaslanır. Böylece sayıyla yazıyı ayırt edebilirsiniz.',
    },
    {
      title: 'Otomatik toplam',
      html: `<ol class="steps"><li><b>A6</b>\'ya <b>Toplam</b> yazın.</li><li><b>B6</b> hücresine tıklayın (sayıların hemen altı).</li><li>Üstteki <b>∑ Otomatik Toplam</b> düğmesine tıklayın.</li></ol>`,
      mouse: '🖱 B6 → ∑',
      on: (ev, c) => {
        if (!editEvents.includes(ev.type)) return false;
        const b6 = cell(c, 'B6');
        if (ev.type === 'xl-edit' && ev.addr === 'B6' && near(b6.value, 10050) && !b6.raw.startsWith('=')) c.warn('Toplamı elle yazdınız. Doğru ama bir sayı değişince güncellenmez! B6\'ya tıklayıp ∑ düğmesini kullanın.');
        return near(b6.value, 10050) && b6.raw.startsWith('=') && norm(cell(c, 'A6').raw) === 'toplam';
      },
      done: 'B6\'ya tıklayınca üstteki formül çubuğunda <b>=TOPLA(B2:B5)</b> görünür: “B2\'den B5\'e kadar topla”.',
    },
    {
      title: 'Değer değişince',
      html: '<p>Elektrik faturası arttı! <b>B3</b>\'e tıklayın, <b>900</b> yazıp Enter\'a basın. Toplama ne oluyor?</p>',
      on: when((c) => near(cell(c, 'B3').value, 900) && near(cell(c, 'B6').value, 10200)),
      done: 'Toplam kendiliğinden <b>10.200</b> oldu. Hesap tablosunun gücü budur: formül bir kez yazılır, sayılar değişince sonuç güncellenir.',
    },
    {
      title: 'Yanlışlıkla sildim!',
      html: `<p>Korkmayın, bozulan her şey geri gelir. Deneyelim: <b>B2</b>\'ye (kira) tıklayıp ${K('Delete')} tuşuna basın. Kira silinir, toplam da değişir.</p><p>Şimdi ${K('Ctrl')} + ${K('Z')} tuşlarına basın: silinen sayı geri gelir.</p>`,
      hint: 'Ctrl + Z yerine şeridin en solundaki ↶ (Geri al) düğmesine de basabilirsiniz. Fazla geri aldıysanız Ctrl + Y (↷ Yinele) ileri alır.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && cell(c, 'B2').raw === '') c.s.cleared = true;
        if (ev.type !== 'xl-undo') return false;
        if (!c.s.cleared) { c.warn('Önce B2\'yi silin, sonra geri alın. Elektrik 750\'ye döndüyse Ctrl + Y ile yineleyin.'); return false; }
        return near(cell(c, 'B2').value, 5000) && near(cell(c, 'B3').value, 900);
      },
      done: 'Kira geri geldi, toplam yine <b>10.200</b>. <b>Ctrl + Z</b> Word\'de, Not Defteri\'nde, hemen her programda çalışır; birkaç kez basarsanız daha geriye gider.',
    },
    {
      title: 'Formülü kendiniz yazın',
      html: `<p><b>A7</b>\'ye <b>Ortalama</b> yazın. <b>B7</b>\'ye şu formülü yazıp ${K('Enter')}:</p><div class="target">=ORTALAMA(B2:B5)</div>`,
      hint: '= işareti Shift + 0. Parantez Shift + 8 ve Shift + 9. İki nokta (:) Shift + nokta.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && ev.addr === 'B7' && ev.error) c.warn(`Formülde bir hata var (${ev.error}). B7\'ye tıklayıp formül çubuğunda kontrol edin: =ORTALAMA(B2:B5)`);
        return when((x) => near(cell(x, 'B7').value, 2550) && cell(x, 'B7').raw.startsWith('='))(ev, c);
      },
      done: 'Ortalama gider 2.550 TL. Diğer işlevler: <b>MAK</b> (en büyük), <b>MİN</b> (en küçük), <b>SAY</b> (kaç sayı var).',
    },
    {
      title: 'Dört işlem',
      html: `<p>Kiranın bir yıllık tutarını bulalım. <b>C1</b>\'e <b>Yıllık</b> yazın. <b>C2</b>\'ye şunu yazın:</p><div class="target">=B2*12</div><p class="mut">Hesap tablosunda çarpı <b>*</b>, bölü <b>/</b> işaretiyle yazılır.</p>`,
      hint: '* işareti 0\'ın sağındaki tuştur.',
      on: when((c) => near(cell(c, 'C2').value, 60000) && cell(c, 'C2').raw.startsWith('=')),
      done: 'Yıllık kira 60.000 TL. Formüller hücre adresleriyle yazılır, böylece kira değişirse yıllık tutar da değişir.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Belgeler</b> klasörüne <b>ev bütçesi</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'xl-save',
      done: 'Excel dosyalarının uzantısı <b>.xlsx</b>\'tir; yeşil 📗 simgesiyle görünür.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk hesap tablonuzu hazırladınız:</p>' },
  ],
};

export const hesap2 = {
  id: 'hesap2', icon: '📊', title: 'Hesap tablosu: biçim, sıralama, grafik', minutes: 35, stage: 'desktop',
  desc: 'Hücre aralığı seçmek, biçimlendirme, sıralama, sütun grafiği.',
  summary: [
    ['Sürükleyerek seçmek', 'Birden fazla hücreyi seçer (aralık): B2:B6'],
    ['K (Ctrl + B)', 'Kalın'],
    ['₺', 'Para birimi biçimi: 5.000,00 ₺'],
    ['Durum çubuğu', 'Seçili sayıların toplamı ve ortalaması en altta görünür'],
    ['↓ Z→A', 'Etkin sütuna göre büyükten küçüğe sıralar'],
    ['📊 Grafik', 'Seçili adlar ve sayılardan sütun grafiği'],
    ['Ctrl + P', 'Yazdır'],
  ],
  steps: [
    {
      title: 'Hazır bir tablo',
      html: '<p>Geçen dersteki ev bütçesi açık. Bu derste onu <b>güzelleştirip</b> sıralayacak ve grafiğini çizeceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { data: butceData() }); },
    },
    {
      title: 'Başlıkları kalın yapın',
      html: `<p><b>A1</b>\'e tıklayın, fare tuşunu basılı tutup <b>B1</b>\'e kadar sürükleyin: iki hücre birlikte seçilir. Sonra <b>K</b> düğmesine ya da ${K('Ctrl', 'B')}\'ye basın.</p>`,
      mouse: '🖱 A1 → B1 sürükle → K',
      setup: (c) => sheetOpen(c, butceData()),
      on: when((c) => cell(c, 'A1').bold && cell(c, 'B1').bold),
      done: 'Seçili aralığın adı Ad kutusunda değil, formüllerde <b>A1:B1</b> diye yazılır.',
    },
    {
      title: 'Para birimi',
      html: '<p><b>B2</b>\'den <b>B6</b>\'ya kadar sürükleyerek seçin ve <b>₺</b> düğmesine tıklayın.</p>',
      mouse: '🖱 B2 → B6 sürükle → ₺',
      on: when((c) => ['B2', 'B3', 'B4', 'B5', 'B6'].every((a) => cell(c, a).f === 'tl')),
      done: 'Tutarlar artık <b>5.000,00 ₺</b> gibi görünüyor. Sayının kendisi değişmedi, sadece görünüşü.',
    },
    {
      title: 'Durum çubuğu',
      html: '<p>Hâlâ seçiliyken pencerenin <b>en altındaki</b> yeşil çubuğa bakın. Seçili sayıların toplamı ne kadar?</p><div class="rs-opts"></div>',
      setup: (c) => {
        const opts = ['10.050', '20.100', '4.000'];
        const box = document.querySelector('#stepBody .rs-opts');
        box.innerHTML = opts.map((o, i) => `<button type="button" class="btn" data-i="${i}">${o} ₺</button>`).join('');
        box.onclick = (e) => {
          const b = e.target.closest('[data-i]');
          if (!b || b.disabled) return;
          if (b.dataset.i === '1') { b.classList.add('right'); c.complete(); } else { b.classList.add('wrong'); b.disabled = true; c.warn('Bu değil. B2\'den B6\'ya kadar seçin ve en alttaki “Toplam”a bakın. Seçimde B6 (toplam satırı) da var!'); }
        };
      },
      on: () => false,
      done: 'Doğru: 20.100. Seçime toplam satırı da girdiği için iki kat çıktı. Durum çubuğu hızlı kontrol için çok kullanışlıdır; ama neyi seçtiğinize dikkat edin.',
    },
    {
      title: 'Sıralayın',
      html: '<p>En büyük gider en üstte olsun: <b>B3</b> gibi tutar sütunundaki bir hücreye tıklayın, sonra <b>↓ Z→A</b> (büyükten küçüğe) düğmesine basın.</p>',
      mouse: '🖱 Tutar sütunu → ↓ Z→A',
      hint: 'Sadece tek bir hücreye tıklayın; program başlık ve toplam satırı dışındaki bütün satırları birlikte sıralar.',
      on: (ev, c) => {
        if (ev.type !== 'xl-sort') return false;
        if (ev.col !== 'B' || !ev.desc) { c.note('Sıralandı ama tutara göre büyükten küçüğe değil. B sütununda bir hücreye tıklayıp ↓ Z→A\'ya basın.'); return false; }
        return norm(cell(c, 'A2').raw) === 'kira';
      },
      done: 'Kira en üstte. Gider adları da tutarlarıyla birlikte yer değiştirdi; satırlar bozulmadı.',
    },
    {
      title: 'Grafik',
      html: '<p><b>A1</b>\'den <b>B5</b>\'e kadar sürükleyerek seçin (adlar ve tutarlar, toplam hariç) ve <b>📊 Grafik</b>\'e tıklayın.</p>',
      mouse: '🖱 A1 → B5 sürükle → 📊',
      hint: 'Toplam satırını seçime katmayın; yoksa grafikte en büyük çubuk toplam olur.',
      on: (ev, c) => {
        if (ev.type !== 'xl-chart') return false;
        if (/6/.test(ev.range)) { c.warn('Seçime toplam satırı (6) da girdi. Grafiği ✕ ile kaldırıp A1\'den B5\'e kadar seçin.'); return false; }
        return true;
      },
      done: 'Bir bakışta en büyük giderin kira olduğu görülüyor. Grafikler sayıları anlamayı kolaylaştırır.',
    },
    {
      title: 'Yazdırın',
      html: `<p>${K('Ctrl', 'P')} ile tabloyu yazdırın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'xl-print',
      done: 'Yazdır\'a bastınız. Gerçek yazıcı seçiliyse tablo kâğıda çıkar; “PDF olarak kaydet” seçiliyse dosya olarak kaydedilir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Hesap tablosunu biçimlendirip sıraladınız ve grafiğini çizdiniz:</p>' },
  ],
};

// ---- 3. ders: not çizelgesi. Formülü kopyalamak (göreli başvuru), doldurma tutamacı, EĞER, koşullu biçim, EĞERSAY ----
const NOTLAR = [['Ayşe', 70, 85], ['Mehmet', 45, 50], ['Fatma', 90, 95], ['Ali', 30, 55], ['Zeynep', 60, 40], ['Can', 80, 70]];
const notData = () => {
  const cells = { A1: 'Ad', B1: '1. Sınav', C1: '2. Sınav', D1: 'Ortalama', E1: 'Durum' };
  NOTLAR.forEach(([a, b, c], i) => { cells['A' + (i + 2)] = a; cells['B' + (i + 2)] = String(b); cells['C' + (i + 2)] = String(c); });
  return { cells, fmt: { A1: { b: true }, B1: { b: true }, C1: { b: true }, D1: { b: true }, E1: { b: true } } };
};
const ort = (i) => (NOTLAR[i][1] + NOTLAR[i][2]) / 2;
const rows = [2, 3, 4, 5, 6, 7];

export const hesap3 = {
  id: 'hesap3', icon: '🎓', title: 'Hesap tablosu: EĞER ve formül kopyalama', minutes: 40, stage: 'desktop',
  desc: 'Not çizelgesi: formülü kopyalamak, EĞER ile “Geçti / Kaldı”, koşullu biçim.',
  summary: [
    ['Ctrl + C → aralığı seç → Ctrl + V', 'Formülü birçok hücreye kopyalar'],
    ['Doldurma tutamacı', 'Seçili hücrenin sağ altındaki küçük kare: aşağı sürükleyince kopyalar'],
    ['Göreli başvuru', 'Formül bir alt satıra kopyalanınca B2 → B3 olur'],
    ['=EĞER(D2>=50;"Geçti";"Kaldı")', 'Koşul doğruysa ilki, değilse ikincisi'],
    ['; (noktalı virgül)', 'İşlevin parçalarını ayırır: Shift + virgül'],
    ['🎨 Koşullu Biçim', 'Belli değerdeki hücreleri kendiliğinden renklendirir'],
    ['=EĞERSAY(E2:E7;"Geçti")', 'Koşula uyan hücreleri sayar'],
    ['=MAK(…) / =MİN(…)', 'En büyük / en küçük değer'],
  ],
  steps: [
    {
      title: 'Not çizelgesi',
      html: `<p>Altı öğrencinin iki sınav notu tabloda hazır. Ortalamalarını hesaplayıp kimin geçtiğini bulacağız.</p>
        <p>Bu derste hesap tablosunun en çok zaman kazandıran özelliğini öğreneceğiz: <b>bir formülü bir kez yazıp bütün satırlara kopyalamak</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { data: notData() }); },
    },
    {
      title: 'İlk ortalama',
      html: '<p><b>D2</b> hücresine Ayşe\'nin ortalamasını yazın:</p><div class="target">=ORTALAMA(B2:C2)</div>',
      setup: (c) => sheetOpen(c, notData()),
      hint: '“B2:C2” B2\'den C2\'ye kadar demektir: Ayşe\'nin iki notu.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && ev.addr === 'D2' && ev.error) c.warn(`Formülde hata var (${ev.error}). D2'ye tıklayıp formül çubuğunda kontrol edin.`);
        return when((x) => near(cell(x, 'D2').value, ort(0)) && cell(x, 'D2').raw.startsWith('='))(ev, c);
      },
      done: 'Ayşe\'nin ortalaması 77,5. Şimdi diğer beş öğrenci için aynı formülü tek tek yazmayacağız.',
    },
    {
      title: 'Formülü kopyalayın',
      html: `<ol class="steps"><li><b>D2</b>\'ye tıklayın, ${K('Ctrl', 'C')} (hücrenin etrafında kesik çizgi belirir).</li><li><b>D3</b>\'ten <b>D7</b>\'ye kadar sürükleyerek seçin.</li><li>${K('Ctrl', 'V')}.</li></ol>`,
      combo: ['Ctrl', 'KeyV'],
      hint: 'Seçim yaparken fare tuşunu D3\'te basıp D7\'de bırakın. Bütün ortalamalar bir anda gelir.',
      on: when((c) => rows.slice(1).every((r, i) => near(cell(c, 'D' + r).value, ort(i + 1)))),
      done: 'Altı ortalama bir anda hesaplandı!',
    },
    rehberSoru({
      title: 'Formül nasıl değişti?',
      html: '<p><b>D5</b> hücresine tıklayıp üstteki formül çubuğuna bakın. Ne yazıyor?</p>',
      opts: ['=ORTALAMA(B2:C2)', '=ORTALAMA(B5:C5)', '42,5'],
      ok: 1,
      wrong: 'D5\'e tıklayıp formül çubuğuna (fx yazan yerin yanı) bakın.',
      why: 'Formül kopyalanırken satır numaraları kendiliğinden kaydı: 2. satırdaki formül 5. satırda B5:C5 oldu. Buna <b>göreli başvuru</b> denir.',
    }),
    {
      title: 'EĞER: Geçti mi, kaldı mı?',
      html: '<p>Ortalaması <b>50 ve üstü</b> olan geçer. <b>E2</b>\'ye yazın:</p><div class="target">=EĞER(D2>=50;"Geçti";"Kaldı")</div>',
      hint: '; (noktalı virgül) Shift + virgül ile yazılır. Tırnak (") 1\'in solundaki tuştur. >= işareti: büyüktür (<) tuşunun Shift\'li hali, sonra =. Okunuşu: “D2, 50\'den büyük ya da eşitse Geçti, değilse Kaldı”.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && ev.addr === 'E2' && ev.error) c.warn(`Formülde hata var (${ev.error}). Tırnakları ve noktalı virgülleri kontrol edin.`);
        return when((x) => cell(x, 'E2').text === 'Geçti' && cell(x, 'E2').raw.startsWith('='))(ev, c);
      },
      done: 'EĞER bir soru sorar: koşul doğruysa ilk cevabı, yanlışsa ikinci cevabı yazar.',
    },
    {
      title: 'Doldurma tutamacı',
      html: '<p>Kopyalamanın daha hızlı yolu: <b>E2</b>\'ye tıklayın. Seçili hücrenin sağ alt köşesinde <b>küçük yeşil bir kare</b> var. Fareyle bu kareyi tutup <b>E7</b>\'ye kadar aşağı sürükleyin.</p>',
      mouse: '🖱 Sağ alttaki kareyi aşağı sürükleyin',
      hint: 'Fare tam kareye gelince işaretçi ince bir artıya dönüşür. Gerçek Excel\'de karenin üzerine çift tıklamak da tabloyu sonuna kadar doldurur.',
      on: when((c) => rows.every((r, i) => cell(c, 'E' + r).text === (ort(i) >= 50 ? 'Geçti' : 'Kaldı'))),
      done: 'Mehmet ve Ali kaldı. Doldurma tutamacı sayı serilerini de devam ettirir: 1, 2 yazıp aşağı çekerseniz 3, 4, 5… gelir.',
    },
    {
      title: 'Kalanları kırmızı yapın',
      html: '<ol class="steps"><li><b>E2</b>\'den <b>E7</b>\'ye kadar seçin.</li><li>Şeritteki <b>🎨 Koşullu Biçim</b>\'e tıklayın.</li><li><b>eşit olanları</b> seçin, kutuya <b>Kaldı</b> yazın, renk <b>Kırmızı</b>, <b>Uygula</b>.</li></ol>',
      mouse: '🖱 E2:E7 → 🎨',
      on: when((c) => cell(c, 'E3').color === 'kirmizi' && cell(c, 'E5').color === 'kirmizi' && !cell(c, 'E2').color),
      done: 'Kalanlar bir bakışta görünüyor. Bir not değişirse renk de kendiliğinden değişir.',
    },
    {
      title: 'Not değişince',
      html: '<p>Ali bütünleme sınavında 2. sınavdan <b>80</b> aldı. <b>C5</b>\'e <b>80</b> yazın ve ne olduğuna bakın.</p>',
      on: when((c) => cell(c, 'E5').text === 'Geçti'),
      done: 'Ali\'nin ortalaması 55 oldu, durumu “Geçti”ye döndü ve kırmızı renk kalktı. Formüller ve koşullu biçim birlikte çalışır.',
    },
    {
      title: 'Sınıf istatistiği',
      html: '<p><b>A9</b>\'a <b>En yüksek</b>, <b>D9</b>\'a <b>=MAK(D2:D7)</b> yazın.</p><p><b>A10</b>\'a <b>Geçen sayısı</b>, <b>D10</b>\'a şunu yazın:</p><div class="target">=EĞERSAY(E2:E7;"Geçti")</div>',
      hint: 'EĞERSAY, aralıktaki hücrelerden koşula uyanları sayar. Koşul ">=50" gibi bir sayı karşılaştırması da olabilir.',
      on: when((c) => near(cell(c, 'D9').value, 92.5) && near(cell(c, 'D10').value, 5)),
      done: 'En yüksek ortalama 92,5; 6 öğrenciden 5\'i geçti.',
    },
    {
      title: 'Başarıya göre sıralayın',
      html: '<p><b>D</b> sütununda (Ortalama) bir öğrencinin hücresine tıklayın, <b>↓ Z→A</b> ile büyükten küçüğe sıralayın.</p>',
      on: (ev, c) => ev.type === 'xl-sort' && ev.desc && ev.col === 'D' && norm(cell(c, 'A2').raw) === 'fatma' && near(cell(c, 'D2').value, 92.5),
      done: 'Fatma en üstte. Formüller satırlarıyla birlikte taşındı; ortalamalar ve durumlar yine doğru.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Formül kopyalamayı ve EĞER işlevini öğrendiniz:</p>' },
  ],
};

// ---- 4. ders: alışveriş ve faturalar. Yüzde, $ ile sabit başvuru, ETOPLA, filtre ----
const ALIS = [['Ekmek', 'Market', 10], ['Süt', 'Market', 35], ['Elektrik', 'Fatura', 750], ['Deterjan', 'Market', 120], ['Su', 'Fatura', 300], ['İnternet', 'Fatura', 400]];
const alisData = () => {
  const cells = { A1: 'KDV oranı', B1: '%20', A3: 'Ürün', B3: 'Kategori', C3: 'Fiyat', D3: 'KDV\'li fiyat' };
  ALIS.forEach(([a, b, c], i) => { cells['A' + (i + 4)] = a; cells['B' + (i + 4)] = b; cells['C' + (i + 4)] = String(c); });
  return { cells, fmt: { B1: { f: 'pct', b: true }, A3: { b: true }, B3: { b: true }, C3: { b: true }, D3: { b: true } } };
};
const kdv = (i, o = 0.2) => ALIS[i][2] * (1 + o);

export const hesap4 = {
  id: 'hesap4', icon: '🧾', title: 'Hesap tablosu: sabit başvuru, ETOPLA, filtre', minutes: 35, stage: 'desktop',
  desc: 'Fatura listesi: yüzde, sabit başvuru ($), ETOPLA ve filtre.',
  summary: [
    ['%20', 'Yüzde: hücreye %20 yazılır, hesapta 0,2 olarak kullanılır'],
    ['$B$1', 'Sabit başvuru: formül kopyalanınca B1 değişmez'],
    ['F4 (gerçek Excel\'de)', 'Formülde hücre adresine $ işaretlerini koyar'],
    ['=ETOPLA(B4:B9;"Market";D4:D9)', 'Kategorisi Market olanların tutarlarını toplar'],
    ['🔽 Filtre', 'Başlıklara ▾ ekler; seçilen değerlere göre satırları gizler'],
    ['🔽 Filtre (tekrar)', 'Filtreyi kaldırır, bütün satırlar görünür'],
  ],
  steps: [
    {
      title: 'Alışveriş ve faturalar',
      html: `<p>Bir aylık harcamalar tabloda. Fiyatlara <b>KDV</b> ekleyip kategoriye göre toplayacağız.</p>
        <p><b>B1</b>\'de KDV oranı var: <b>%20</b>. Hücreye <b>%20</b> yazınca hesap tablosu bunu 0,2 olarak kullanır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet', { data: alisData() }); },
    },
    {
      title: 'Sabit başvuru: $',
      html: `<p><b>D4</b>\'e ekmeğin KDV\'li fiyatını yazın:</p><div class="target">=C4*(1+$B$1)</div>
        <p>Neden <b>$</b>? Formülü aşağı kopyalayınca C4 → C5, C6 olsun isteriz; ama KDV oranı hep <b>B1</b>\'de kalmalı. <b>$</b> işareti adresi “sabitler”.</p>`,
      setup: (c) => sheetOpen(c, alisData()),
      hint: '$ işareti AltGr + 4 ile yazılır. Gerçek Excel\'de formülde B1 yazdıktan sonra F4\'e basmak da $B$1 yapar.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && ev.addr === 'D4' && ev.error) c.warn(`Formülde hata var (${ev.error}). Parantezleri ve $ işaretlerini kontrol edin.`);
        return when((x) => near(cell(x, 'D4').value, kdv(0)) && /\$B\$1/i.test(cell(x, 'D4').raw))(ev, c);
      },
      done: 'Ekmek KDV ile 12 TL.',
    },
    {
      title: 'Aşağı kopyalayın',
      html: '<p><b>D4</b>\'ün doldurma tutamacını (sağ alttaki küçük kare) <b>D9</b>\'a kadar aşağı sürükleyin. (Ctrl + C / Ctrl + V de olur.)</p>',
      mouse: '🖱 Doldurma tutamacı → D9',
      on: when((c) => ALIS.every((_, i) => near(cell(c, 'D' + (i + 4)).value, kdv(i)))),
      done: 'Bütün KDV\'li fiyatlar hesaplandı.',
    },
    rehberSoru({
      title: 'Hangisi sabit kaldı?',
      html: '<p><b>D9</b>\'a tıklayıp formül çubuğuna bakın. Ne yazıyor?</p>',
      opts: ['=C4*(1+$B$1)', '=C9*(1+$B$1)', '=C9*(1+B6)'], ok: 1,
      wrong: 'D9\'a tıklayıp üstteki formül çubuğuna bakın.',
      why: 'C4 → C9 oldu (göreli), ama $B$1 olduğu gibi kaldı (sabit). $ olmasaydı B1 → B6 olurdu ve boş bir hücreyle hesap yapılırdı.',
    }),
    {
      title: 'Oran değişirse',
      html: '<p>Bu ürünlerde KDV <b>%10</b> oldu diyelim. <b>B1</b>\'e <b>%10</b> yazın. KDV\'li fiyatlara ne oluyor?</p>',
      on: when((c) => near(cell(c, 'D4').value, kdv(0, 0.1)) && near(cell(c, 'D9').value, kdv(5, 0.1))),
      done: 'Tek bir hücreyi değiştirdiniz, altı fiyat birden güncellendi. Oranı ayrı bir hücreye yazmanın faydası budur.',
    },
    {
      title: 'Kategori toplamı: ETOPLA',
      html: '<p><b>A11</b>\'e <b>Market toplamı</b> yazın. <b>D11</b>\'e:</p><div class="target">=ETOPLA(B4:B9;"Market";D4:D9)</div><p class="mut">Okunuşu: B4:B9\'da “Market” yazan satırların D sütunundaki tutarlarını topla.</p>',
      hint: 'Üç parça noktalı virgülle ayrılır: nerede aranacak; ne aranacak (tırnak içinde); neyin toplanacağı.',
      on: (ev, c) => {
        if (ev.type === 'xl-edit' && ev.addr === 'D11' && ev.error) c.warn(`Formülde hata var (${ev.error}).`);
        return when((x) => near(cell(x, 'D11').value, (10 + 35 + 120) * 1.1))(ev, c);
      },
      done: 'Markete KDV dahil 181,50 TL harcanmış. Faturalar için "Fatura" yazmanız yeter.',
    },
    {
      title: 'Filtre',
      html: '<ol class="steps"><li>Tablonun içinde bir hücreye tıklayın (ör. <b>A4</b>).</li><li>Şeritteki <b>🔽 Filtre</b>\'ye tıklayın: başlıklarda ▾ belirir.</li><li><b>Kategori</b> başlığındaki <b>▾</b>\'ye tıklayın, <b>Market</b>\'in işaretini kaldırıp <b>Tamam</b>.</li></ol>',
      mouse: '🖱 Filtre → Kategori ▾',
      on: when((c) => cell(c, 'A4').hidden && !cell(c, 'A6').hidden && cell(c, 'A5').hidden),
      done: 'Yalnızca faturalar görünüyor. Satırlar silinmedi, sadece gizlendi; en altta kaç kaydın gösterildiği yazar.',
    },
    {
      title: 'Filtreyi kaldırın',
      html: '<p><b>🔽 Filtre</b> düğmesine bir kez daha tıklayın: bütün satırlar geri gelir.</p>',
      on: (ev, c) => ev.type === 'xl-filter-off' && !cell(c, 'A4').hidden,
      done: 'Filtre, uzun listelerde aradığınızı bulmanın en hızlı yoludur.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sabit başvuru, ETOPLA ve filtreyi öğrendiniz:</p>' },
  ],
};
