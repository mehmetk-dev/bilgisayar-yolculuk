// Aygıt Yöneticisi (Windows 11): menü çubuğu, simge araç çubuğu, aygıt ağacı; sürücüsü olmayan aygıtı bulup sürücüsünü güncelleştirme.
// Sağ tık: Sürücüyü güncelleştir, Cihazı devre dışı bırak, Cihazı kaldır, Donanım değişikliklerini tara, Özellikler.
import { esc, progress } from './util.js';
import { SYS_ICONS as SI } from './appicons.js';
import { NAV, MI, CP } from './w11-simge.js';

// Ağaçtaki küçük (16 px) simgeler
const D = (name, body) => `<svg class="wi wi-c" data-wi-c="dm-${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
const ICON = {
  pc: SI.pc,
  net: D('net', '<rect x="3" y="5" width="18" height="12" rx="2" fill="#5b6b7d"/><rect x="4.5" y="6.5" width="15" height="9" rx="1" fill="#8fd0ff"/><path d="M8 20h8M12 17v3" stroke="#5b6b7d" stroke-width="1.8" stroke-linecap="round"/><path d="M8 11a5 5 0 0 1 8 0M10 13.2a2.4 2.4 0 0 1 4 0" fill="none" stroke="#0f78d4" stroke-width="1.5" stroke-linecap="round"/>'),
  bt: NAV.devices,
  disk: D('disk', '<rect x="3" y="7" width="18" height="10" rx="2" fill="#9aa8b8"/><rect x="3" y="12" width="18" height="5" rx="2" fill="#6c7a8b"/><circle cx="17.5" cy="14.5" r="1" fill="#7be07b"/><path d="M6 14.5h5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'),
  display: CP.display,
  mouse: CP.mouse,
  kbd: CP.keyboard,
  sound: CP.sound,
  warn: SI.warn,
};
// [ad, simge, [aygıtlar]]
const CATS = [
  ['Ağ bağdaştırıcıları', 'net', ['Realtek PCIe GbE Ailesi Denetleyicisi', 'Kablosuz Ağ Bağdaştırıcısı']],
  ['Bilgisayar', 'pc', ['x64 tabanlı bilgisayar']],
  ['Bluetooth', 'bt', ['Bluetooth Radyosu']],
  ['Disk sürücüleri', 'disk', ['NVMe SSD 512 GB']],
  ['Ekran bağdaştırıcıları', 'display', ['Tümleşik Grafik']],
  ['Fareler ve diğer işaret aygıtları', 'mouse', ['HID uyumlu fare']],
  ['Klavyeler', 'kbd', ['Standart PS/2 Klavye']],
  ['Ses, video ve oyun denetleyicileri', 'sound', []],
];
const UNKNOWN = 'Bilinmeyen aygıt';

export function devmgr({ desk, body, emit, dialogs }) {
  body.classList.add('agy');
  const open = new Set(['Diğer aygıtlar']);
  let sel = null; // seçili aygıt adı
  const st = () => (desk.settings.dm ||= { gone: [], off: [] });

  const cats = () => {
    const s = desk.settings;
    const list = CATS.map(([n, ic, items]) => [n, ic, n.startsWith('Ses') && !s.unknownDevice ? ['Yüksek Tanımlı Ses Aygıtı'] : items]);
    if (s.unknownDevice) list.push(['Diğer aygıtlar', 'warn', [UNKNOWN]]);
    return list.map(([n, ic, items]) => [n, ic, items.filter((x) => !st().gone.includes(x))]).filter(([, , items]) => items.length)
      .sort((a, b) => a[0].localeCompare(b[0], 'tr'));
  };
  const catOf = (name) => cats().find(([, , items]) => items.includes(name));

  const render = () => {
    const bad = (x) => x === UNKNOWN;
    const dis = (x) => st().off.includes(x);
    const have = sel && cats().some(([, , items]) => items.includes(sel));
    if (!have) sel = null;
    body.innerHTML = `<div class="agy-menu" role="menubar">${['Dosya', 'Eylem', 'Görünüm', 'Yardım'].map((m) => `<button type="button" data-menu="${m}">${m}</button>`).join('')}</div>
      <div class="agy-tb"><button type="button" disabled title="Geri" aria-label="Geri">${MI.back}</button><button type="button" disabled title="İleri" aria-label="İleri">${MI.forward}</button><i></i>
        <button type="button" data-tb="props" title="Özellikler" aria-label="Özellikler" ${sel ? '' : 'disabled'}>${MI.list}</button>
        <button type="button" data-tb="update" title="Sürücüyü güncelleştir" aria-label="Sürücüyü güncelleştir" ${sel ? '' : 'disabled'}><span class="agy-upd">${MI.up}</span></button>
        <button type="button" data-tb="scan" title="Donanım değişikliklerini tara" aria-label="Donanım değişikliklerini tara">${MI.search}</button></div>
      <div class="agy-tree" role="tree"><div class="agy-root"><span class="agy-ch">${MI.chevdown}</span><span class="agy-i">${ICON.pc}</span><b>${esc(desk.settings.pcName || 'MASAÜSTÜ-PC')}</b></div>
      ${cats().map(([n, ic, items]) => `<div class="agy-cat"><button type="button" class="agy-head" data-cat="${n}" aria-expanded="${open.has(n)}"><span class="agy-ch${open.has(n) ? ' o' : ''}">${MI.chevright}</span><span class="agy-i">${ICON[ic]}</span>${n}</button>
        ${open.has(n) ? items.map((it) => `<div class="agy-it${bad(it) ? ' warn' : ''}${dis(it) ? ' off' : ''}${sel === it ? ' sel' : ''}" data-item="${esc(it)}" tabindex="0" role="treeitem"><span class="agy-i">${ICON[bad(it) ? 'warn' : ic]}${bad(it) ? '' : dis(it) ? `<em class="agy-dn">${MI.chevdown}</em>` : ''}</span>${esc(it)}</div>`).join('') : ''}</div>`).join('')}</div>`;
  };

  async function update(name = UNKNOWN) {
    const unknown = name === UNKNOWN;
    const a = await dialogs.ask({ title: `Sürücüleri Güncelleştir - ${name}`, icon: 'magnifier', text: `<b>Sürücüleri nasıl aramak istiyorsunuz?</b><br><br><small><b>Sürücüleri otomatik olarak ara:</b> Windows, bilgisayarınızda ve internette bu aygıt için en iyi sürücüyü arar.<br><b>Sürücüler için bilgisayarıma göz at:</b> Sürücüyü kendiniz bulup seçersiniz.</small>`, buttons: [['auto', 'Sürücüleri otomatik olarak ara', true], ['browse', 'Sürücüler için bilgisayarıma göz at'], ['cancel', 'İptal']] });
    emit('driver-choice', { choice: a });
    if (a === 'browse') { desk.toast('Sürücü bulunamadı', 'Bilgisayarda bu aygıt için sürücü yok. “Sürücüleri otomatik olarak ara” seçeneğini deneyin.', SI.folder); return; }
    if (a !== 'auto') return;
    const w = document.createElement('div');
    w.className = 'agy-prog';
    body.append(w);
    await progress(w, 2600, 'Sürücüler aranıyor ve yükleniyor…');
    w.remove();
    if (!unknown) { await dialogs.ask({ title: 'Sürücüleri Güncelleştir', icon: 'ok', text: 'Bu aygıt için en iyi sürücüler zaten yüklü.', buttons: [['ok', 'Kapat', true]] }); return; }
    desk.settings.unknownDevice = false;
    open.add('Ses, video ve oyun denetleyicileri');
    sel = 'Yüksek Tanımlı Ses Aygıtı';
    render();
    await dialogs.ask({ title: 'Sürücüleri Güncelleştir', icon: 'ok', text: 'Windows, sürücülerinizi başarıyla güncelleştirdi.<br><b>Yüksek Tanımlı Ses Aygıtı</b> artık çalışıyor.', buttons: [['ok', 'Kapat', true]] });
    emit('driver-update', { via: 'devmgr' });
  }

  async function props(name) {
    const unknown = name === UNKNOWN, off = st().off.includes(name);
    const c = catOf(name);
    const status = unknown ? 'Bu aygıtın sürücüleri yüklü değil. <b>(Kod 28)</b><br>Bu aygıtın sürücüsünü bulmak için “Sürücüyü Güncelleştir”i kullanın.' : off ? 'Bu aygıt devre dışı bırakıldı. <b>(Kod 22)</b>' : 'Bu aygıt düzgün çalışıyor.';
    const a = await dialogs.ask({ title: `${name} Özellikleri`, text: `<div class="agy-pr"><div class="agy-prh"><span>${ICON[unknown ? 'warn' : c?.[1] || 'pc']}</span><b>${esc(name)}</b></div>
      <dl><dt>Aygıt türü:</dt><dd>${esc(c?.[0] || '')}</dd><dt>Üretici:</dt><dd>${unknown ? 'Bilinmiyor' : '(Standart sistem aygıtları)'}</dd><dt>Konum:</dt><dd>PCI Veriyolu 0, Aygıt 31, İşlev 3</dd></dl>
      <fieldset><legend>Aygıt durumu</legend>${status}</fieldset></div>`, buttons: unknown ? [['upd', 'Sürücüyü Güncelleştir'], ['ok', 'Tamam', true]] : [['ok', 'Tamam', true]] });
    if (a === 'upd') update(name);
  }

  async function disable(name) {
    if (st().off.includes(name)) { st().off = st().off.filter((x) => x !== name); render(); emit('dm-enable', { item: name }); return; }
    const a = await dialogs.ask({ title: 'Aygıtı Devre Dışı Bırak', icon: 'warn', text: `<b>${esc(name)}</b> aygıtını devre dışı bırakmak çalışmasını durdurur. Gerçekten devre dışı bırakmak istiyor musunuz?`, buttons: [['yes', 'Evet'], ['no', 'Hayır', true]] });
    if (a !== 'yes') return;
    st().off.push(name);
    render();
    emit('dm-disable', { item: name });
  }

  async function uninstall(name) {
    const a = await dialogs.ask({ title: 'Aygıtı Kaldır', icon: 'warn', text: `<b>${esc(name)}</b> aygıtını sisteminizden kaldırmak üzeresiniz.<br><small>Bilgisayarı yeniden başlatınca ya da “Donanım değişikliklerini tara”yı kullanınca Windows aygıtı yeniden bulur.</small>`, buttons: [['yes', 'Kaldır'], ['no', 'İptal', true]] });
    if (a !== 'yes') return;
    st().gone.push(name);
    render();
    emit('dm-uninstall', { item: name });
  }

  async function scan() {
    const w = document.createElement('div');
    w.className = 'agy-prog';
    body.append(w);
    await progress(w, 1400, 'Donanım değişiklikleri taranıyor…');
    w.remove();
    const n = st().gone.length;
    st().gone = [];
    render();
    emit('dm-scan', { restored: n });
  }

  // Seçimi ağacı yeniden çizmeden değiştirir (çift tıklama bozulmasın)
  const select = (it) => {
    sel = it.dataset.item;
    body.querySelectorAll('.agy-it').forEach((x) => x.classList.toggle('sel', x === it));
    body.querySelectorAll('[data-tb=props],[data-tb=update]').forEach((b) => { b.disabled = false; });
  };
  const menus = {
    Dosya: [{ cmd: 'exit', label: 'Çıkış' }],
    Eylem: () => [{ cmd: 'update', label: 'Sürücüyü güncelleştir', disabled: !sel }, { cmd: 'props', label: 'Özellikler', disabled: !sel }, '-', { cmd: 'scan', label: 'Donanım değişikliklerini tara' }],
    Görünüm: [{ cmd: 'x', label: 'Aygıtlar (türe göre)', disabled: true }, { cmd: 'y', label: 'Gizli aygıtları göster', disabled: true }],
    Yardım: [{ cmd: 'about', label: 'Aygıt Yöneticisi hakkında' }],
  };
  const doCmd = (c) => {
    if (c === 'exit') { const w = desk.wins.find((x) => x.app === 'devmgr'); if (w) desk.close(w); }
    if (c === 'update') (sel === UNKNOWN ? update() : desk.toast('Sürücü güncel', 'Bu aygıt için en iyi sürücü zaten yüklü.', SI.ok));
    if (c === 'props' && sel) props(sel);
    if (c === 'scan') scan();
    if (c === 'about') dialogs.ask({ title: 'Aygıt Yöneticisi', icon: 'info', text: 'Aygıt Yöneticisi, bilgisayarınızın donanım parçalarını ve sürücülerini gösterir. Sarı ünlemli aygıtın sürücüsü eksiktir.', buttons: [['ok', 'Tamam', true]] });
  };

  body.addEventListener('click', (e) => {
    const m = e.target.closest('[data-menu]');
    if (m) { const r = m.getBoundingClientRect(); const it = menus[m.dataset.menu]; desk.menu(r.left, r.bottom, typeof it === 'function' ? it() : it, doCmd, 'dm-menu', { menu: m.dataset.menu }); return; }
    const tb = e.target.closest('[data-tb]');
    if (tb) { doCmd(tb.dataset.tb); return; }
    const h = e.target.closest('[data-cat]');
    if (h) { const n = h.dataset.cat; if (open.has(n)) open.delete(n); else open.add(n); render(); emit('dm-expand', { cat: n }); return; }
    const it = e.target.closest('[data-item]');
    if (it) { select(it); emit('dm-select', { item: sel }); }
  });
  body.addEventListener('keydown', (e) => {
    const it = e.target.closest('[data-item]');
    if (it && e.key === 'Enter') props(it.dataset.item);
    if (it && e.key === ' ') { e.preventDefault(); it.click(); }
  });
  body.addEventListener('contextmenu', (e) => {
    const it = e.target.closest('[data-item]');
    if (!it) { if (e.target.closest('.agy-tree')) { e.preventDefault(); desk.menu(e.clientX, e.clientY, [{ cmd: 'scan', label: 'Donanım değişikliklerini tara' }], doCmd, 'dm-menu', {}); } return; }
    e.preventDefault();
    const name = it.dataset.item;
    select(it);
    const off = st().off.includes(name);
    const unknown = name === UNKNOWN;
    desk.menu(e.clientX, e.clientY, [{ cmd: 'update', label: 'Sürücüyü güncelleştir', bold: true }, { cmd: 'disable', label: off ? 'Cihazı etkinleştir' : 'Cihazı devre dışı bırak' }, { cmd: 'uninstall', label: 'Cihazı kaldır' }, '-', { cmd: 'scan', label: 'Donanım değişikliklerini tara' }, '-', { cmd: 'props', label: 'Özellikler', bold: true }], (c) => {
      if (c === 'update') { if (unknown) update(); else desk.toast('Sürücü güncel', 'Bu aygıt için en iyi sürücü zaten yüklü.', SI.ok); }
      else if (c === 'disable') disable(name);
      else if (c === 'uninstall') uninstall(name);
      else if (c === 'scan') scan();
      else if (c === 'props') props(name);
    }, 'device', { item: name });
  });
  body.addEventListener('dblclick', (e) => {
    const it = e.target.closest('[data-item]');
    if (it) props(it.dataset.item);
  });
  render();
  return { render };
}
