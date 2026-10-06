// Ayarlar: ses ve parlaklık, yazıcılar, Wi-Fi, arka plan, yüklü uygulamalar, saat, yazı boyutu, güncelleştirmeler
import { esc, pictureURL, progress, wait, playTune } from './util.js';
import { WALLPAPERS } from '../desktop.js';
import { APPS } from './index.js';

const PAGES = [
  ['system', '🖥', 'Sistem', 'Ekran, ses'],
  ['devices', '🖨', 'Bluetooth ve cihazlar', 'Yazıcılar, fare'],
  ['network', '📶', 'Ağ ve İnternet', 'Wi-Fi'],
  ['personal', '🎨', 'Kişiselleştirme', 'Arka plan, renkler'],
  ['apps', '🧩', 'Uygulamalar', 'Yüklü uygulamalar'],
  ['time', '🕒', 'Saat ve dil', 'Tarih, saat dilimi'],
  ['access', '♿', 'Erişilebilirlik', 'Metin boyutu'],
  ['update', '🔄', 'Windows Update', 'Güncelleştirmeler'],
];
export const NETWORKS = [
  { name: 'EvAğı', lock: true, pass: 'evagi2024', bars: 4 },
  { name: 'Komşu_5G', lock: true, pass: 'xq81!kk2', bars: 2 },
  { name: 'Kafe_Ücretsiz', lock: false, bars: 3 },
];
const NEW_PRINTER = 'Renkli Yazıcı R-200 (Ağ)';
const ZONES = [['İstanbul (UTC+3)', 3], ['Londra (UTC+0)', 0], ['Berlin (UTC+1)', 1], ['Bakü (UTC+4)', 4], ['New York (UTC-5)', -5]];
const BUILTIN = ['notepad', 'calc', 'paint', 'browser', 'photos', 'snip', 'mayin'];

export function settings({ desk, body, args, emit, dialogs }) {
  body.classList.add('st');
  const s = desk.settings;
  let page = args.page || 'system';
  body.innerHTML = `<nav class="st-nav"><div class="st-me">👤 <b>${esc(s.user)}</b><small>Yerel hesap</small></div>${PAGES.map(([id, ic, l]) => `<button type="button" data-page="${id}">${ic} ${l}</button>`).join('')}</nav><div class="st-page"></div>`;
  const pg = body.querySelector('.st-page');
  const flow = {}; // sayfa içi akışların durumu (yazıcı arama vb.)

  const toggle = (key, on, label) => `<label class="st-tog"><span>${label}</span><input type="checkbox" data-key="${key}" ${on ? 'checked' : ''}><i></i><b>${on ? 'Açık' : 'Kapalı'}</b></label>`;

  function render() {
    body.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('on', b.dataset.page === page));
    const P = PAGES.find((p) => p[0] === page);
    let h = `<h2>${P[1]} ${P[2]}</h2>`;
    if (page === 'system') {
      h += `<section><h3>Ekran</h3><label class="st-row">☀ Parlaklık <input type="range" data-range="brightness" min="20" max="100" value="${s.brightness}"><b>${s.brightness}</b></label></section>
        <section><h3>Ses</h3><label class="st-row">${s.muted ? '🔇' : '🔊'} Ses düzeyi <input type="range" data-range="volume" min="0" max="100" value="${s.volume}"><b>${s.volume}</b></label>
        ${toggle('muted', s.muted, 'Sesi kapat (sessiz)')}
        <button type="button" class="st-btn" data-act="soundTest">🎵 Sesi dene</button></section>`;
    } else if (page === 'devices') {
      h += `<section><h3>Yazıcılar ve tarayıcılar</h3>
        <div class="st-list">${s.printers.map((p) => `<div class="st-item"><span>🖨</span><b>${esc(p)}</b>${p === NEW_PRINTER ? '<button type="button" class="st-btn" data-act="testPrint">Test sayfası yazdır</button>' : ''}</div>`).join('')}</div>
        <div class="st-flow">${flow.printer || `<button type="button" class="st-btn primary" data-act="addPrinter">＋ Cihaz ekle</button>`}</div></section>
        <section><h3>Fare</h3><p class="st-note">Fare ayarları: birincil düğme <b>Sol</b>, imleç hızı orta.</p></section>`;
    } else if (page === 'network') {
      h += `<section>${toggle('wifi', s.wifi, 'Wi-Fi')}`;
      if (s.wifi) {
        h += `<div class="st-list">${NETWORKS.map((n) => {
          const con = s.network === n.name;
          const open = flow.net === n.name;
          return `<div class="st-item net ${con ? 'con' : ''}" data-net="${esc(n.name)}"><span>${'📶'}</span><div><b>${esc(n.name)}</b><small>${con ? 'Bağlı, güvenli' : n.lock ? '🔒 Güvenli' : '⚠ Açık ağ (güvenli değil)'}</small></div>
            ${con ? '<button type="button" class="st-btn" data-act="disconnect">Bağlantıyı kes</button>' : open ? '' : '<button type="button" class="st-btn" data-act="pick">Bağlan</button>'}
            ${open && !con ? `<div class="st-pass">${n.lock ? `<label>Ağ güvenlik anahtarını (şifreyi) girin:<input type="password" class="st-pw" autocomplete="off"></label><button type="button" class="st-btn primary" data-act="connect">İleri</button>` : `<p class="st-warn">⚠ Bu ağa bağlanan herkes, gönderdiğiniz bilgileri görebilir. Bankacılık işlemi yapmayın.</p><button type="button" class="st-btn primary" data-act="connect">Yine de bağlan</button>`}<button type="button" class="st-btn" data-act="cancelNet">İptal</button><div class="st-err">${flow.netErr || ''}</div></div>` : ''}</div>`;
        }).join('')}</div>`;
      }
      h += '</section>';
    } else if (page === 'personal') {
      h += `<section><h3>Arka plan</h3><div class="st-preview" style="background:${desk.wallCss()}"></div>
        <p>Bir resim seçin:</p><div class="st-walls">${Object.entries(WALLPAPERS).map(([k, [n, css]]) => `<button type="button" data-wall="${k}" title="${n}" class="${s.wallpaper === k ? 'on' : ''}" style="background:${css}"><span>${n}</span></button>`).join('')}</div>
        <button type="button" class="st-btn" data-act="browseWall">🖼 Fotoğraflara göz atın…</button></section>
        <section><h3>Renkler</h3>${toggle('dark', s.dark, 'Koyu mod')}</section>`;
    } else if (page === 'apps') {
      const list = [...BUILTIN, ...s.installed];
      h += `<section><h3>Yüklü uygulamalar</h3><div class="st-list">${list.map((a) => `<div class="st-item"><span>${APPS[a].icon}</span><b>${APPS[a].name}</b><small>${s.installed.includes(a) ? 'Örnek Yazılım A.Ş. · 48 MB' : 'Windows ile gelir'}</small>
          ${s.installed.includes(a) ? `<button type="button" class="st-btn" data-act="uninstall" data-app="${a}">Kaldır</button>` : ''}</div>`).join('')}</div>
        ${flow.uninstall || ''}</section>`;
    } else if (page === 'time') {
      const d = desk.now();
      h += `<section><div class="st-clock">${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}<small>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
        ${toggle('autoTime', s.autoTime, 'Saati otomatik olarak ayarla')}
        <div class="st-row">Tarih ve saati el ile ayarla <button type="button" class="st-btn" data-act="manualTime" ${s.autoTime ? 'disabled' : ''}>Değiştir</button></div>
        ${flow.time || ''}
        <label class="st-row">Saat dilimi <select data-act="tz">${ZONES.map(([z]) => `<option ${z === s.tz ? 'selected' : ''}>${z}</option>`).join('')}</select></label></section>`;
    } else if (page === 'access') {
      h += `<section><h3>Metin boyutu</h3><div class="st-sample" style="font-size:${(flow.scale || s.textScale) / 100}em">Aa — Örnek yazı boyutu</div>
        <label class="st-row">Metin boyutu <input type="range" data-range="scaleDraft" min="100" max="150" step="10" value="${flow.scale || s.textScale}"><b>%${flow.scale || s.textScale}</b></label>
        <button type="button" class="st-btn primary" data-act="applyScale">Uygula</button></section>`;
    } else if (page === 'update') {
      h += `<section><div class="st-upd">${flow.update || '✅ <b>Güncel durumdasınız</b><small>Son denetim: bugün</small>'}</div>
        ${flow.updateBtns ?? '<button type="button" class="st-btn primary" data-act="checkUpdate">Güncelleştirmeleri denetle</button>'}</section>`;
    }
    pg.innerHTML = h;
  }

  const go = (p) => { page = p; render(); emit('settings-page', { page }); };

  body.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.page) return go(b.dataset.page);
    if (b.dataset.wall) { s.customWall = null; desk.setSetting('wallpaper', b.dataset.wall); render(); emit('wallpaper', { name: WALLPAPERS[b.dataset.wall][0], key: b.dataset.wall }); return; }
    const act = b.dataset.act;
    const netEl = b.closest('[data-net]');
    switch (act) {
      case 'soundTest': {
        const t = playTune(desk, [523, 659, 784]);
        emit('sound-test', { audible: t > 0, volume: s.volume, muted: s.muted });
        if (!t) desk.toast('Ses kapalı', 'Ses kapalı ya da çok kısık olduğu için duyulmadı.', '🔇');
        return;
      }
      case 'addPrinter':
        flow.printer = '<div class="st-searching"><span class="spin"></span> Yazıcılar aranıyor…</div>';
        render();
        emit('printer-search');
        await wait(2200);
        flow.printer = `<div class="st-list"><div class="st-item"><span>🖨</span><div><b>${NEW_PRINTER}</b><small>Ağda bulundu</small></div><button type="button" class="st-btn primary" data-act="addThis">Cihaz ekle</button></div></div>`;
        render();
        emit('printer-found', { name: NEW_PRINTER });
        return;
      case 'addThis': {
        flow.printer = '<div class="st-prog"></div>';
        render();
        emit('printer-adding');
        await progress(pg.querySelector('.st-prog'), 2600, 'Sürücü yükleniyor… (yazıcının bilgisayarla konuşmasını sağlayan küçük program)');
        flow.printer = null;
        if (!s.printers.includes(NEW_PRINTER)) s.printers.push(NEW_PRINTER);
        render();
        desk.toast('Yazıcı hazır', `${NEW_PRINTER} kullanıma hazır.`, '🖨');
        emit('printer-add', { name: NEW_PRINTER });
        return;
      }
      case 'testPrint':
        desk.toast('Yazdırılıyor', 'Test sayfası yazıcıya gönderildi.', '🖨');
        emit('print', { printer: NEW_PRINTER, doc: 'Test sayfası', copies: 1 });
        return;
      case 'pick': flow.net = netEl.dataset.net; flow.netErr = ''; render(); pg.querySelector('.st-pw')?.focus(); emit('wifi-pick', { name: flow.net }); return;
      case 'cancelNet': flow.net = null; render(); return;
      case 'connect': {
        const n = NETWORKS.find((x) => x.name === flow.net);
        const pw = pg.querySelector('.st-pw')?.value ?? '';
        if (n.lock && pw !== n.pass) {
          flow.netErr = pw ? 'Şifre yanlış. Modemin altındaki etiketi kontrol edin.' : 'Lütfen şifreyi yazın.';
          render();
          pg.querySelector('.st-pw')?.focus();
          emit('wifi-connect', { name: n.name, ok: false });
          return;
        }
        s.network = n.name;
        if (!s.knownNetworks.includes(n.name)) s.knownNetworks.push(n.name);
        flow.net = null;
        desk.applySettings();
        render();
        emit('wifi-connect', { name: n.name, ok: true, open: !n.lock });
        return;
      }
      case 'disconnect': { const name = s.network; s.network = null; desk.applySettings(); render(); emit('wifi-disconnect', { name }); return; }
      case 'browseWall': {
        const api = desk.fs.dialogApi();
        const r = await dialogs.file({ mode: 'open', fs: api, folder: 'pictures', ext: '.jpg', accept: /\.(png|jpe?g)$/i, typeLabel: 'Resimler (*.jpg; *.png)' });
        if (!r) return;
        const n = desk.fs.find(r.folder, r.name);
        if (!n) return;
        s.customWall = pictureURL(n.content);
        desk.setSetting('wallpaper', 'custom');
        render();
        emit('wallpaper', { name: n.name, custom: true });
        return;
      }
      case 'uninstall': {
        const a = b.dataset.app;
        const ans = await dialogs.ask({ title: 'Kaldır', icon: APPS[a].icon, text: `<b>${APPS[a].name}</b> ve ilgili bilgileri kaldırılacak.`, buttons: [['yes', 'Kaldır', true], ['no', 'İptal']] });
        if (ans !== 'yes') return;
        flow.uninstall = '<div class="st-prog"></div>';
        render();
        await progress(pg.querySelector('.st-prog'), 1800, 'Kaldırılıyor…');
        flow.uninstall = null;
        s.installed = s.installed.filter((x) => x !== a);
        for (const n of desk.fs.children('desktop')) if (n.type === 'link' && n.app === a) desk.fs.purge(n.id);
        for (const w of desk.wins.filter((x) => x.app === a)) desk.destroy(w);
        render();
        emit('uninstall', { app: a, name: APPS[a].name });
        return;
      }
      case 'manualTime': {
        const d = desk.now();
        const p2 = (n) => String(n).padStart(2, '0');
        flow.time = `<div class="st-time"><input type="date" class="st-d" value="${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}"><input type="time" class="st-t" value="${p2(d.getHours())}:${p2(d.getMinutes())}"><button type="button" class="st-btn primary" data-act="setTime">Değiştir</button></div>`;
        render();
        return;
      }
      case 'setTime': {
        const dv = pg.querySelector('.st-d').value, tv = pg.querySelector('.st-t').value;
        const t = new Date(`${dv}T${tv}:00`);
        if (isNaN(t)) return;
        s.timeOffset = t - Date.now();
        flow.time = null;
        desk.applySettings();
        render();
        emit('time-set', { hours: t.getHours(), minutes: t.getMinutes() });
        return;
      }
      case 'applyScale':
        desk.setSetting('textScale', flow.scale || s.textScale);
        render();
        emit('text-scale', { value: s.textScale });
        return;
      case 'checkUpdate':
        flow.update = '<span class="spin"></span> Güncelleştirmeler denetleniyor…';
        flow.updateBtns = '';
        render();
        emit('update-check');
        await wait(2000);
        if (s.unknownDevice) {
          flow.update = '⬇ <b>Güncelleştirmeler var</b><small>İsteğe bağlı güncelleştirme: <b>Ses kartı sürücüsü</b> (Yüksek Tanımlı Ses Aygıtı)</small>';
          flow.updateBtns = '<button type="button" class="st-btn primary" data-act="installDriver">İndir ve yükle</button>';
        } else {
          flow.update = null; flow.updateBtns = null;
        }
        render();
        return;
      case 'installDriver':
        flow.update = '<div class="st-prog"></div>';
        flow.updateBtns = '';
        render();
        await progress(pg.querySelector('.st-prog'), 2400, 'Ses kartı sürücüsü indiriliyor ve yükleniyor…');
        s.unknownDevice = false;
        flow.update = '✅ <b>Güncel durumdasınız</b><small>Ses kartı sürücüsü yüklendi.</small>';
        flow.updateBtns = null;
        render();
        desk.wins.filter((w) => w.app === 'devmgr').forEach((w) => w.api.render?.());
        emit('driver-update', { via: 'update' });
        return;
    }
  });

  body.addEventListener('input', (e) => {
    const r = e.target.dataset.range;
    if (r === 'scaleDraft') { flow.scale = +e.target.value; e.target.nextElementSibling.textContent = '%' + flow.scale; pg.querySelector('.st-sample').style.fontSize = flow.scale / 100 + 'em'; return; }
    if (r) { desk.setSetting(r, +e.target.value); e.target.nextElementSibling.textContent = e.target.value; if (r === 'volume' && s.muted) { desk.setSetting('muted', false); render(); } }
  });
  body.addEventListener('change', (e) => {
    const k = e.target.dataset.key;
    if (k) {
      desk.setSetting(k, e.target.checked);
      if (k === 'wifi') { s.network = e.target.checked ? null : null; flow.net = null; desk.applySettings(); }
      if (k === 'autoTime' && e.target.checked) { s.timeOffset = 0; flow.time = null; desk.applySettings(); }
      render();
      emit('toggle', { key: k, on: e.target.checked });
    }
    if (e.target.dataset.act === 'tz') {
      const old = ZONES.find(([z]) => z === s.tz)[1], nu = ZONES.find(([z]) => z === e.target.value)[1];
      s.tz = e.target.value;
      s.timeOffset += (nu - old) * 3600e3;
      desk.applySettings();
      render();
      emit('tz', { tz: s.tz });
    }
  });

  render();
  return {
    onArgs: (a) => { if (a.page) go(a.page); },
    onSettings: () => { if (!pg.contains(document.activeElement) || document.activeElement.type !== 'range') render(); },
    go,
  };
}
