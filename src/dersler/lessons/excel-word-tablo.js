import { K, maxed, norm, put } from './common.js';
import { isTouch } from '../dokunmatik.js';

const FILE = 'Malzeme listesi.docx';
const SAMPLE = { cells: { A1: 'Malzeme', B1: 'Adet', C1: 'Tutar (TL)', A2: 'Defter', B2: '3', C2: '=B2*25' } };
const VALUES = [['Malzeme', 'Adet', 'Tutar (TL)'], ['Defter', '3', '75']];
const EDITED = 'Çizgili defter';
const isFile = (name) => name.toLocaleLowerCase('tr') === FILE.toLocaleLowerCase('tr');

const wordTable = (c) => c.d.find('word')?.api.page.querySelector('table.wd-t');
function hasTable(c, edited = false, shaded = false) {
  const table = wordTable(c);
  return table?.rows.length === 2 && VALUES.every((row, r) => {
    const cells = table.rows[r].cells;
    return cells.length === 3 && row.every((value, i) => {
      const cell = cells[i];
      const expected = edited && r === 1 && i === 0 ? EDITED : value;
      return (r === 1 && i > 0 ? cell.innerText.trim() === expected : norm(cell.innerText) === norm(expected)) &&
        (!shaded || r !== 0 || !!cell.style.backgroundColor);
    });
  });
}

// Ders yeniden açıldığında sanal masaüstü sıfırlanır. Yalnızca önceki adımların örneğini hazırla.
function example(edited, shaded) {
  const rows = VALUES.map((row, r) => `<tr>${row.map((value, i) => {
    const fill = shaded && r === 0 ? ' style="background-color:#dbe5f1"' : '';
    return `<td${fill}>${edited && r === 1 && i === 0 ? EDITED : value}</td>`;
  }).join('')}</tr>`).join('');
  return `<table class="wd-t">${rows}</table><p><br></p>`;
}
const resumeWord = (edited, shaded) => (c) => {
  if (c.resumed) maxed(c, 'word', { html: example(edited, shaded) });
};

export const excelWordTablo = {
  id: 'excel-word-tablo', icon: '▦', title: 'Excel’den Word’e tablo aktarın', minutes: 15, stage: 'desktop',
  desc: 'Excel’deki küçük bir hesap tablosunu Word’de düzenleyin, gölgelendirin ve kaydedin.',
  summary: [
    ['Ctrl + C', 'Excel’de seçtiğiniz hücreleri kopyalar.'],
    ['Ctrl + V', 'Kopyalanan hücreleri Word’e düzenlenebilir tablo olarak yapıştırır.'],
    ['Tablo Tasarımı → Gölgelendirme', 'Seçilen hücrelere arka plan rengi verir.'],
    ['Ctrl + S / Ctrl + O', 'Belgeyi kaydeder / kaydedilmiş belgeyi açar.'],
  ],
  steps: [
    {
      title: 'Malzeme listesini belgeye alın',
      html: '<p>Bir alışveriş listesini Excel’de hesaplayıp Word belgenize ekleyebilirsiniz. İki satırlık bir malzeme listesini kopyalayacak, Word’de düzenleyip kaydedeceksiniz.</p>',
    },
    {
      title: 'Excel aralığını seçip kopyalayın',
      html: `<p><b>A1</b> hücresinden <b>C2</b> hücresine kadar sürükleyin. Altı hücre seçiliyken ${K('Ctrl', 'C')} ile kopyalayın.</p>`,
      combo: ['Ctrl', 'KeyC'],
      hint: 'Dokunmatik ekranda A1 seçili değilse ona dokunun. Tuş şeridinde Shift’e, ardından C2 hücresine dokunun.',
      setup: (c) => maxed(c, 'sheet', { data: SAMPLE }),
      on: (ev) => ev.type === 'xl-copy' && !ev.cut && ev.range === 'A1:C2',
    },
    {
      title: 'Word’e tablo olarak yapıştırın',
      html: (c) => `<p>${c.resumed ? 'Örnek hücreler panoda hazır. ' : isTouch() ? '' : '<b>Başlat → Kelime İşlemci</b>’yi açın. '}Boş belgeye tıklayıp ${K('Ctrl', 'V')} ile yapıştırın. İsterseniz <b>Giriş → Yapıştır</b> düğmesini kullanın.</p>`,
      combo: ['Ctrl', 'KeyV'],
      setup: (c) => {
        if (c.resumed) c.d.sheetClip = VALUES;
        if (c.resumed || isTouch()) maxed(c, 'word');
      },
      hint: 'Pano boşsa görev çubuğundan Hesap Tablosu’na dönüp A1:C2 aralığını yeniden kopyalayın.',
      check: (c) => hasTable(c) || hasTable(c, true),
      on: (ev, c) => ev.type === 'doc-clip' && ev.op === 'paste' && ev.source === 'sheet' && hasTable(c),
      done: 'Tabloda iki satır ve üç sütun var. Excel’deki formülün sonucu olan <b>75</b> de aktarıldı.',
    },
    {
      title: 'Bir hücreyi düzenleyin',
      html: '<p>Word tablosunda <b>Defter</b> sözcüğüne çift tıklayıp seçin. Yerine <b>Çizgili defter</b> yazın.</p>',
      hint: 'Dokunmatik ekranda Defter sözcüğüne dokunun. Tuş şeridinde Home’a, ardından Shift ve End’e dokunup sözcüğü seçin.',
      setup: resumeWord(false, false),
      check: (c) => hasTable(c, true),
      on: (ev, c) => ev.type === 'doc-input' && hasTable(c, true),
    },
    {
      title: 'Başlık satırını gölgelendirin',
      html: '<p>Üst satırda <b>Malzeme</b> hücresinden <b>Tutar (TL)</b> hücresine kadar sürükleyin. <b>Tablo Tasarımı → Gölgelendirme</b>’yi açın ve bir arka plan rengi seçin.</p>',
      hint: 'Dokunmatik ekranda üst satırdaki üç hücreye sırayla dokunup her birine aynı gölgelendirme rengini verin.',
      setup: resumeWord(true, false),
      check: (c) => hasTable(c, true, true),
      on: (ev, c) => ev.type === 'doc-table' && ev.op === 'shade' && hasTable(c, true, true),
    },
    {
      title: 'Belgeyi kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Belgeler</b> klasörüne <b>Malzeme listesi</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      setup: resumeWord(true, true),
      on: (ev, c) => {
        if (ev.type !== 'doc-save') return false;
        if (ev.folder === 'docs' && isFile(ev.name) && hasTable(c, true, true)) return true;
        c.note('Başlık satırını renklendirdiğiniz belgeyi <b>Dosya → Farklı kaydet</b> ile Belgeler klasörüne <b>Malzeme listesi</b> adıyla kaydedin.');
        return false;
      },
    },
    {
      title: 'Kaydettiğiniz tabloyu yeniden açın',
      html: (c) => `<p>${c.resumed ? 'Örnek belge Belgeler klasöründe hazır. ' : ''}${K('Ctrl', 'O')} ile <b>Belgeler</b> klasöründen <b>${FILE}</b> dosyasını açın. <b>Çizgili defter</b> yazısının, <b>75</b> değerinin ve başlık renginin durduğuna bakın.</p>`,
      combo: ['Ctrl', 'KeyO'],
      setup: (c) => { if (c.resumed) { put(c, 'docs', FILE, 'file', { html: example(true, true) }); maxed(c, 'word'); } },
      on: (ev, c) => ev.type === 'doc-open' && isFile(ev.name) && hasTable(c, true, true),
    },
    { final: true, title: 'Tablo hazır', html: '<p>Excel listesini Word’de düzenlediniz ve kaydettiğiniz belgeyi yeniden açıp kontrol ettiniz.</p>' },
  ],
};
