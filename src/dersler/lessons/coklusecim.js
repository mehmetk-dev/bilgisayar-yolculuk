// 6. hafta ek dersi: birden çok dosyayı birlikte seçmek. Ctrl + tık (cımbızla tek tek), Shift + tık (baştan sona),
// fareyle çerçeve, Ctrl + A ve onay kutuları. Tatil fotoğraflarından beğenilenleri USB'ye kopyalamak, bulanıkları silmek.
import { K, desktopReady, maxed, PIC } from './common.js';
import { rehberSoru } from './kalip.js';
import { RECYCLE, USB } from '../vfs.js';

const FOTO = [
  ['01 otogar', '🚌', '#b3e5fc', '#90a4ae'], ['02 yolda', '🛣', '#c5e1a5', '#90a4ae'], ['03 mola', '☕', '#d7ccc8', '#ffe0b2'], ['04 otel', '🏨', '#b3e5fc', '#cfd8dc'],
  ['05 deniz kenarı', '🌊', '#4fc3f7', '#01579b'], ['06 kale', '🏰', '#ffe0b2', '#a1887f'], ['07 balık lokantası', '🐟', '#b2ebf2', '#ffccbc'], ['08 torunlarla', '👪', '#f8bbd0', '#fff59d'],
  ['09 gün batımı', '🌅', '#ffb74d', '#7e57c2'], ['10 çarşı', '🛍', '#ffe082', '#f48fb1'], ['11 bulanık 1', '🌫', '#cfd8dc', '#eceff1'], ['12 bulanık 2', '🌫', '#cfd8dc', '#eceff1'],
  ['13 bulanık 3', '🌫', '#cfd8dc', '#eceff1'], ['14 bulanık 4', '🌫', '#cfd8dc', '#eceff1'], ['15 dönüş', '🚌', '#b3e5fc', '#ffcc80'], ['16 ev', '🏠', '#c8e6c9', '#ffe0b2'],
];
const KLASOR = 'Tatil fotoğrafları';
const folder = (c) => c.d.fs.find('pictures', KLASOR);
const node = (c, n) => folder(c) && c.d.fs.find(folder(c).id, n + '.jpg');
const ex = (c) => c.d.find('explorer');
const picked = (c) => (ex(c)?.api.selection || []).map((id) => c.d.fs.get(id)?.name.replace(/\.jpg$/, '')).filter(Boolean);
const same = (a, b) => a.length === b.length && b.every((x) => a.includes(x));
const openFolder = (c) => {
  const w = maxed(c, 'explorer', { folder: folder(c).id });
  if (w.api.folder !== folder(c).id) w.api.go(folder(c).id);
};

const SECILEN = ['05 deniz kenarı', '08 torunlarla', '09 gün batımı'];
const BULANIK = ['11 bulanık 1', '12 bulanık 2', '13 bulanık 3', '14 bulanık 4'];
const onUsb = (c) => SECILEN.every((n) => c.d.fs.find(USB, n + '.jpg'));
const silindi = (c) => BULANIK.every((n) => { const x = Object.values(c.d.fs.nodes).find((m) => m.name === n + '.jpg'); return !x || x.parent === RECYCLE; });

export const cokluSecim = {
  id: 'coklu-secim', icon: '🖱', title: 'Birden çok dosya seçmek: Ctrl ve Shift', minutes: 20, stage: 'desktop',
  desc: 'Fotoğrafları tek tek (Ctrl), baştan sona (Shift) ve çerçeveyle seçip birlikte kopyalamak ya da silmek.',
  summary: [
    [K('Ctrl') + ' + tık', 'Cımbız gibi: aradan istediklerinizi tek tek seçer; seçili olana tıklarsanız bırakır'],
    [K('Shift') + ' + tık', 'İlk tıkladığınızdan ikinciye kadar aradaki hepsini seçer'],
    ['Boş yerden sürükleyin', 'Çerçevenin içine giren her şey seçilir'],
    [K('Ctrl', 'A'), 'Klasördeki her şeyi seçer'],
    ['☐ Onay kutuları', 'Her dosyanın köşesinde kutucuk çıkar; Ctrl\'ye basmadan tek tek işaretlersiniz'],
    ['Boş bir yere tık', 'Bütün seçimi kaldırır'],
  ],
  setup: (c) => {
    const f = c.d.fs.find('pictures', KLASOR) || c.d.fs.create('pictures', { type: 'folder', name: KLASOR });
    for (const [n, e, a, b] of FOTO) if (!c.d.fs.find(f.id, n + '.jpg')) c.d.fs.create(f.id, { type: 'file', name: n + '.jpg', content: PIC(e, a, b) });
  },
  steps: [
    {
      title: 'Hepsini değil, beğendiklerimi',
      html: `<p>Tatilden 16 fotoğraf geldi. Hepsini değil, yalnızca <b>beğendiğiniz üçünü</b> USB belleğe atmak istiyorsunuz. Birer birer sürüklemek uzun sürer, bazen de seçim bozulur.</p>
        <p>Bu derste birden çok dosyayı <b>birlikte seçmenin</b> yollarını öğreneceğiz. Normal tıklamada yeni tıkladığınız seçilir, <b>öncekini bırakır</b>. İki tuş bunu değiştirir: ${K('Ctrl')} ve ${K('Shift')}.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); openFolder(c); },
    },
    {
      title: 'Ctrl + tık: cımbızla seçmek',
      html: `<p>Şu üç fotoğrafı seçin:</p><p><b>05 deniz kenarı</b>, <b>08 torunlarla</b>, <b>09 gün batımı</b>.</p>
        <p>İlkine normal tıklayın. Sonra ${K('Ctrl')} tuşunu <b>basılı tutarak</b> öbür ikisine tıklayın. Üçü de mavi kalır.</p>`,
      keys: ['ControlLeft'],
      hint: 'Ctrl\'yi bırakıp tıklarsanız seçim sıfırlanır. Yanlış birini seçtiyseniz Ctrl basılıyken ona bir kez daha tıklayın; seçimden çıkar.',
      setup: (c) => openFolder(c),
      check: (c) => same(picked(c), SECILEN),
      on: (ev, c) => {
        if (ev.type !== 'ex-select') return false;
        const p = picked(c);
        if (same(p, SECILEN)) return true;
        const fazla = p.filter((n) => !SECILEN.includes(n));
        if (fazla.length) c.note(`“${fazla[0]}” istenmeyen bir fotoğraf. Ctrl basılıyken ona bir kez daha tıklarsanız seçimden çıkar.`);
        else if (ev.how === 'set' && p.length === 1 && SECILEN.includes(p[0])) c.note('Bir tane seçildi. Şimdi Ctrl tuşunu basılı tutup öbürlerine tıklayın.');
        return false;
      },
      done: 'Üç fotoğraf birlikte seçili. Alttaki satırda “3 öğe seçili” yazıyor.',
    },
    {
      title: 'Üçünü birden USB\'ye',
      html: `<p>USB bellek takıldı. Seçim bozulmadan ${K('Ctrl', 'C')}'ye basın (ya da üstteki <b>⧉ Kopyala</b>). Sonra soldan <b>💾 USB Bellek (E:)</b>'ye geçip ${K('Ctrl', 'V')}'ye basın (ya da <b>📋 Yapıştır</b>).</p>`,
      combo: ['Ctrl', 'KeyC'],
      hint: 'Seçim bozulduysa önceki adımdaki gibi Ctrl ile üçünü yeniden seçin. Yapıştırmadan önce soldaki listeden USB Bellek\'e tıklamayı unutmayın.',
      setup: (c) => { if (!c.d.fs.usb) c.d.plugUsb(); },
      check: (c) => onUsb(c),
      on: (ev, c) => {
        if (ev.type === 'file-clip' && ev.count === 1) c.note('Yalnızca 1 fotoğraf kopyalandı; seçim bozulmuş olabilir. Üçünü Ctrl ile yeniden seçip tekrar kopyalayın.');
        return (ev.type === 'file-paste' || ev.type === 'fs') && onUsb(c);
      },
      done: 'Üç fotoğraf tek seferde USB belleğe kopyalandı. Asılları Resimler\'de duruyor.',
    },
    {
      title: 'Shift + tık: baştan sona',
      html: `<p><b>Resimler › ${KLASOR}</b> klasörüne dönün. <b>11</b>'den <b>14</b>'e kadar dört fotoğraf bulanık çıkmış.</p>
        <p><b>11 bulanık 1</b>'e normal tıklayın. Sonra ${K('Shift')} tuşunu basılı tutup <b>14 bulanık 4</b>'e tıklayın. Aradaki hepsi birden seçilir.</p>`,
      keys: ['ShiftLeft'],
      hint: 'Soldan Resimler\'e, sonra Tatil fotoğrafları klasörüne çift tıklayın. Önce 11\'e tıklayın, Shift\'i basılı tutup 14\'e tıklayın.',
      check: (c) => same(picked(c), BULANIK),
      on: (ev, c) => {
        if (ev.type !== 'ex-select') return false;
        if (same(picked(c), BULANIK)) return true;
        if (ev.how === 'range') c.note('Aralık seçildi ama başı ya da sonu farklı. Önce 11\'e normal tıklayın, sonra Shift ile 14\'e.');
        return false;
      },
      done: 'Dört bulanık fotoğraf seçili. 100 dosya olsaydı yine iki tıkla seçerdiniz.',
    },
    {
      title: 'Bulanıkları silin',
      html: `<p>Seçim duruyorken ${K('Delete')} tuşuna basın (ya da üstteki <b>🗑 Sil</b>). Dördü birden Geri Dönüşüm Kutusu'na gider.</p>`,
      keys: ['Delete'],
      hint: 'Seçim bozulduysa 11\'e tıklayıp Shift ile 14\'e tıklayın, sonra Delete.',
      check: (c) => silindi(c),
      on: (ev, c) => (ev.type === 'delete' || ev.type === 'fs') && silindi(c),
      done: 'Bulanıklar gitti. Yanlışlıkla silerseniz Geri Dönüşüm Kutusu\'ndan geri getirebilirsiniz.',
    },
    {
      title: 'Fareyle çerçeve çizin',
      html: `<p>Üçüncü yol: dosyaların <b>yanındaki boş bir yerden</b> farenin sol tuşuna basılı tutup çapraz sürükleyin. Mavi bir <b>çerçeve</b> çıkar; içine giren dosyalar seçilir.</p>
        <p>Çerçeveyle <b>en az üç</b> fotoğraf seçin.</p>`,
      mouse: '🖱 Boş yerden basılı tutup sürükleyin',
      hint: 'Bir dosyanın üstünden başlarsanız o dosyayı taşırsınız. Son dosyaların sağındaki ya da altındaki boşluktan başlayın.',
      on: (ev, c) => {
        if (ev.type === 'ex-select' && ev.how === 'band' && ev.count < 3) c.note(`Çerçeve ${ev.count} dosya seçti. Biraz daha büyük çizin.`);
        return ev.type === 'ex-select' && ev.how === 'band' && ev.count >= 3;
      },
      done: (c) => `Çerçeveyle ${picked(c).length} dosya seçtiniz. Boş bir yere bir kez tıklarsanız seçim kalkar.`,
    },
    {
      title: 'Ctrl + A: hepsi',
      html: `<p>Klasördeki <b>her şeyi</b> seçmek için bir dosyaya ya da boş bir yere tıklayıp ${K('Ctrl', 'A')}'ya basın (ya da üstteki <b>☑ Tümünü seç</b>).</p>`,
      combo: ['Ctrl', 'KeyA'],
      on: (ev) => ev.type === 'ex-select' && ev.how === 'all',
      done: 'Hepsi seçildi. Not Defteri\'nde ve Word\'de de Ctrl + A bütün yazıyı seçer.',
    },
    {
      title: 'Tuşsuz yol: onay kutuları',
      html: '<p>Ctrl\'yi basılı tutmak zor geliyorsa kutucuklar var. Sağ üstteki <b>☐ Onay kutuları</b> düğmesine tıklayın. Her dosyanın köşesinde bir kutu çıkar.</p>',
      check: (c) => !!c.d.settings.exBoxes,
      on: (ev) => ev.type === 'ex-checkboxes' && ev.on,
      done: 'Kutucuklar çıktı.',
    },
    {
      title: 'Kutucuklarla seçin',
      html: '<p>Önce boş bir yere tıklayıp seçimi kaldırın. Sonra <b>01 otogar</b> ve <b>16 ev</b> fotoğraflarının köşesindeki <b>kutucuklara</b> tıklayın. Başka tuşa gerek yok.</p>',
      mouse: '🖱 Köşedeki kutucuğa tıklayın',
      hint: 'Kutucuk fotoğrafın sol üst köşesinde. Fazladan seçilen olursa onun kutusuna tekrar tıklayın; işaret kalkar.',
      check: (c) => same(picked(c), ['01 otogar', '16 ev']),
      on: (ev, c) => ev.type === 'ex-select' && same(picked(c), ['01 otogar', '16 ev']),
      done: 'İki fotoğraf seçili. Telefonlarda ve dokunmatik ekranlarda da çoğu zaman bu kutucuklar kullanılır.',
    },
    rehberSoru({
      title: 'Hangisiyle?',
      html: '<p>50 fotoğraftan yalnızca <b>3., 17. ve 42.</b> fotoğrafları seçeceksiniz. Hangi tuşla tıklarsınız?</p>',
      opts: ['Shift + tık', 'Ctrl + tık', 'Ctrl + A'], ok: 1,
      wrong: 'Bu tuş aradakilerin hepsini de seçerdi. Aradan tek tek seçmek için hangisi?',
      why: 'Doğru: Ctrl + tık, aradan istediklerinizi cımbızla seçer.',
    }),
    rehberSoru({
      title: 'Ya bu?',
      html: '<p>Bu kez <b>1.\'den 20.\'ye kadar</b> hepsini seçeceksiniz. En kısa yol hangisi?</p>',
      opts: ['1.\'ye tıklayıp Shift ile 20.\'ye tıklamak', 'Ctrl ile 20 kez tıklamak', 'Teker teker sürüklemek'], ok: 0,
      wrong: 'Olur ama çok uzun sürer. Arada kalanların hepsini birden seçen tuş hangisiydi?',
      why: 'Doğru: Shift + tık, ilk ve son arasındaki hepsini seçer.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Birden çok dosyayı birlikte seçebiliyorsunuz:</p>' },
  ],
};
