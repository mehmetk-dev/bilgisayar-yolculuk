// Aygıt Yöneticisi: sürücüsü olmayan aygıtı bulup sürücüsünü güncelleştirme
import { progress } from './util.js';

const CATS = [
  ['💻', 'Bilgisayar', ['x64 tabanlı bilgisayar']],
  ['🖴', 'Disk sürücüleri', ['NVMe SSD 512 GB']],
  ['🖥', 'Ekran bağdaştırıcıları', ['Tümleşik Grafik']],
  ['🖱', 'Fareler ve diğer işaret aygıtları', ['HID uyumlu fare']],
  ['⌨', 'Klavyeler', ['Standart PS/2 Klavye']],
  ['📡', 'Ağ bağdaştırıcıları', ['Kablosuz Ağ Bağdaştırıcısı']],
  ['🔊', 'Ses, video ve oyun denetleyicileri', []],
];

export function devmgr({ desk, body, emit, dialogs }) {
  body.classList.add('dm');
  const open = new Set(['Diğer aygıtlar']);
  function render() {
    const s = desk.settings;
    const cats = CATS.map(([i, n, items]) => [i, n, n.startsWith('Ses') && !s.unknownDevice ? ['Yüksek Tanımlı Ses Aygıtı'] : items]);
    if (s.unknownDevice) cats.push(['⚠', 'Diğer aygıtlar', ['⚠ Bilinmeyen aygıt']]);
    body.innerHTML = `<div class="dm-bar">Dosya &nbsp; Eylem &nbsp; Görünüm &nbsp; Yardım</div><div class="dm-tree"><div class="dm-root">🖥 MASAÜSTÜ-PC</div>
      ${cats.map(([i, n, items]) => `<div class="dm-cat"><button type="button" class="dm-head" data-cat="${n}">${open.has(n) ? '⌄' : '›'} ${i} ${n}</button>
        ${open.has(n) ? items.map((it) => `<div class="dm-item ${it.startsWith('⚠') ? 'warn' : ''}" data-item="${it}" tabindex="0">${it.startsWith('⚠') ? '' : '▫ '}${it}</div>`).join('') : ''}</div>`).join('')}</div>`;
  }
  async function update() {
    const a = await dialogs.ask({ title: 'Sürücüleri Güncelleştir - Bilinmeyen aygıt', icon: '🔎', text: '<b>Sürücüleri nasıl aramak istiyorsunuz?</b>', buttons: [['auto', '🔎 Sürücüleri otomatik olarak ara', true], ['browse', '📁 Sürücüler için bilgisayarıma göz at'], ['cancel', 'İptal']] });
    emit('driver-choice', { choice: a });
    if (a === 'browse') { desk.toast('Sürücü bulunamadı', 'Bilgisayarda bu aygıt için sürücü yok. “Otomatik olarak ara” seçeneğini deneyin.', '📁'); return; }
    if (a !== 'auto') return;
    const w = document.createElement('div');
    w.className = 'dm-prog';
    body.append(w);
    await progress(w, 2600, 'Sürücüler aranıyor ve yükleniyor…');
    w.remove();
    desk.settings.unknownDevice = false;
    open.add('Ses, video ve oyun denetleyicileri');
    render();
    await dialogs.ask({ title: 'Sürücüleri Güncelleştir', icon: '✅', text: 'Windows, sürücülerinizi başarıyla güncelleştirdi.<br><b>Yüksek Tanımlı Ses Aygıtı</b> artık çalışıyor.', buttons: [['ok', 'Kapat', true]] });
    emit('driver-update', { via: 'devmgr' });
  }
  body.addEventListener('click', (e) => {
    const h = e.target.closest('[data-cat]');
    if (h) { const n = h.dataset.cat; if (open.has(n)) open.delete(n); else open.add(n); render(); emit('dm-expand', { cat: n }); }
    const it = e.target.closest('[data-item]');
    if (it) { body.querySelectorAll('.dm-item').forEach((x) => x.classList.toggle('sel', x === it)); emit('dm-select', { item: it.dataset.item }); }
  });
  body.addEventListener('contextmenu', (e) => {
    const it = e.target.closest('[data-item]');
    if (!it) return;
    e.preventDefault();
    body.querySelectorAll('.dm-item').forEach((x) => x.classList.toggle('sel', x === it));
    const unknown = it.dataset.item.includes('Bilinmeyen');
    desk.menu(e.clientX, e.clientY, [{ cmd: 'update', label: 'Sürücüyü güncelleştir', bold: true }, { cmd: 'disable', label: 'Cihazı devre dışı bırak', disabled: true }, '-', { cmd: 'props', label: 'Özellikler' }], (c) => {
      if (c === 'update') { if (unknown) update(); else desk.toast('Sürücü güncel', 'Bu aygıt için en iyi sürücü zaten yüklü.', '✅'); }
      if (c === 'props') dialogs.ask({ title: `${it.dataset.item} Özellikleri`, icon: unknown ? '⚠' : '✅', text: unknown ? 'Bu aygıtın sürücüleri yüklü değil. <b>(Kod 28)</b><br>Bu aygıtın sürücüsünü bulmak için “Sürücüyü güncelleştir”i kullanın.' : 'Bu aygıt düzgün çalışıyor.', buttons: [['ok', 'Tamam', true]] });
    }, 'device', { item: it.dataset.item });
  });
  body.addEventListener('dblclick', (e) => {
    const it = e.target.closest('[data-item]');
    if (it?.dataset.item.includes('Bilinmeyen')) dialogs.ask({ title: 'Bilinmeyen aygıt Özellikleri', icon: '⚠', text: 'Bu aygıtın sürücüleri yüklü değil. <b>(Kod 28)</b>', buttons: [['ok', 'Tamam', true]] });
  });
  render();
  return { render };
}
