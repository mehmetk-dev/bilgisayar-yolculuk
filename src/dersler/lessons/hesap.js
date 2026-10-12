// 11. hafta: hesap tablosu (Excel benzeri). MEB Bilgisayar İşletmeni programının “Excel temel seviye” ünitesine göre:
// hücre, satır, sütun; veri girişi; formüller ve işlevler (TOPLA, ORTALAMA); otomatik toplam; biçimlendirme; sıralama; grafik.
import { K, desktopReady, maxed, norm } from './common.js';

const X = (c) => c.d.find('sheet')?.api;
const cell = (c, a) => X(c)?.cell(a) || { raw: '', value: '', text: '' };
const sheetOpen = (c, data) => { if (!c.d.find('sheet')) maxed(c, 'sheet', data ? { data } : {}); };
const near = (v, n) => typeof v === 'number' && Math.abs(v - n) < 0.01;
const editEvents = ['xl-edit', 'xl-autosum', 'xl-format', 'xl-sort', 'xl-chart', 'xl-select'];
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
  desc: 'Satır, sütun, hücre adresi; hücreye yazı ve sayı yazmak; formül yazmak; ∑ Otomatik Toplam; TOPLA ve ORTALAMA; değer değişince sonucun kendiliğinden güncellenmesi.',
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
  desc: 'Fareyle hücre aralığı seçmek, kalın ve para birimi biçimi, durum çubuğundaki toplam, büyükten küçüğe sıralama, sütun grafiği, yazdırma.',
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
      done: 'Tablonuz yazıcıya gönderildi.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Hesap tablosunu biçimlendirip sıraladınız ve grafiğini çizdiniz:</p>' },
  ],
};
