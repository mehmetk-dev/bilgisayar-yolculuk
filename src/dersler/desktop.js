// Benzetim Windows masaüstü: açılış/kapanış, oturum açma, simgeler, sürükle-bırak, pencereler,
// görev çubuğu, Başlat menüsü, sağ tık menüleri, bildirimler, izin (UAC) penceresi, ekran alıntısı.
// Olan her şey emit() ile derse bildirilir; dersin adımları bu olaylara bakarak ilerler.
import { VFS, RECYCLE, USB } from './vfs.js';
import { Dialogs, esc, fileIcon } from './dialog.js';
import { APPS, START_APPS } from './apps/index.js';
import { pictureURL } from './apps/util.js';
import { osInstall } from './apps/osinstall.js';

export const WALLPAPERS = {
  mavi: ['Mavi', 'radial-gradient(ellipse at 30% 120%, #9fd3ff 0%, #3d8fe0 35%, #0b3c8c 75%, #061d4a 100%)', ['#3d8fe0', '#061d4a']],
  gunbatimi: ['Gün batımı', 'linear-gradient(170deg, #ffb26b 0%, #ff7b89 45%, #8a5082 80%, #3f2b56 100%)', ['#ff7b89', '#3f2b56']],
  orman: ['Orman', 'linear-gradient(160deg, #a8e063 0%, #56ab2f 45%, #1e5631 100%)', ['#56ab2f', '#1e5631']],
  gece: ['Gece', 'radial-gradient(circle at 20% 30%, #fff8 0 1px, transparent 2px) 0 0/90px 90px, radial-gradient(circle at 70% 60%, #fff6 0 1px, transparent 2px) 0 0/130px 130px, linear-gradient(180deg, #0f1c3d, #1f2f5c 60%, #2d1f4d)', ['#1f2f5c', '#2d1f4d']],
  lavanta: ['Lavanta', 'linear-gradient(135deg, #e0c3fc 0%, #b28dff 50%, #6a4bbf 100%)', ['#b28dff', '#6a4bbf']],
  deniz: ['Deniz', 'linear-gradient(180deg, #a1ffce 0%, #2bc0e4 45%, #1d6fa3 100%)', ['#2bc0e4', '#1d6fa3']],
};

const CELL_W = 6.2, CELL_H = 5.7; // em
const PINNED = ['explorer', 'browser'];

const DEFAULT_SETTINGS = () => ({
  wallpaper: 'mavi', customWall: null, volume: 50, muted: false, brightness: 100, wifi: true, network: 'EvAğı',
  knownNetworks: ['EvAğı'], autoTime: true, timeOffset: 0, tz: 'İstanbul (UTC+3)', textScale: 100, dark: false,
  user: 'Öğrenci', password: '1234', printers: ['PDF olarak kaydet'], installed: [], unknownDevice: true,
});

const pad = (n) => String(n).padStart(2, '0');

export class Desktop {
  constructor(root, onEvent) {
    this.root = root;
    this.emitRaw = onEvent;
    this.fs = new VFS();
    this.wins = [];
    this.z = 10;
    this.seq = 1;
    this.iconPos = {};
    this.selected = null;
    this.fileClip = null; // { op: 'copy'|'cut', id }
    this.imageClip = null; // ekran alıntısından gelen canvas
    this.settings = DEFAULT_SETTINGS();
    root.classList.add('dk');
    root.innerHTML = `
      <div class="dk-screen" tabindex="-1">
        <div class="dk-wall"></div>
        <div class="dk-icons" tabindex="0" data-drop="desktop"></div>
        <div class="dk-wins"></div>
        <div class="dk-start" hidden></div>
        <div class="dk-winx dk-menu" hidden></div>
        <div class="dk-quick" hidden></div>
        <div class="dk-toasts"></div>
        <div class="dk-taskbar">
          <div class="tb-center">
            <button type="button" class="tb-start" title="Başlat">${startLogo()}</button>
            <button type="button" class="tb-search"><span>🔍</span> Ara</button>
            <div class="tb-apps"></div>
          </div>
          <div class="tb-tray">
            <button type="button" class="tb-usb" hidden title="USB Bellek: güvenle kaldır">💾</button>
            <button type="button" class="tb-net" title="Ağ ve ses"><span class="tb-wifi"></span><span class="tb-vol"></span></button>
            <button type="button" class="tb-clock"><span class="tb-time"></span><span class="tb-date"></span></button>
            <button type="button" class="tb-showdesk" title="Masaüstünü göster"></button>
          </div>
        </div>
        <div class="dk-dim"></div>
        <div class="dk-over" tabindex="-1" hidden></div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    this.screen = $('.dk-screen');
    this.iconsEl = $('.dk-icons');
    this.winsEl = $('.dk-wins');
    this.startEl = $('.dk-start');
    this.overEl = $('.dk-over');
    this.dialogs = new Dialogs(this.screen, (ev) => this.emit(ev.type, ev));
    this.fs.onChange((op, node) => {
      this.renderIcons();
      this.emit('fs', { op, node, id: node?.id, name: node?.name, parent: node?.parent });
      this.wins.forEach((w) => w.api?.onFs?.(op, node));
      root.querySelector('.tb-usb').hidden = !this.fs.usb;
    });
    this.bindIcons();
    this.bindTaskbar();
    this.bindKeys();
    this.tick();
    setInterval(() => this.tick(), 10000);
    this.applySettings();
    this.renderIcons();
    this.renderTaskbar();
    this.setPower('desktop', true);
  }

  emit(type, data = {}) { this.emitRaw({ ...data, type }); }

  // Ders başında temiz bir bilgisayar
  reset({ power = 'desktop', settings = {} } = {}) {
    this.closeMenus();
    this.root.querySelector('.dk-toasts').innerHTML = '';
    this.screen.querySelectorAll('.dk-uac, .dk-snip, .dk-switch').forEach((x) => x.remove());
    this.snipping = false;
    this.dialogs.closeAll();
    for (const w of [...this.wins]) this.destroy(w);
    this.fs.reset();
    this.iconPos = {};
    this.selected = null;
    this.fileClip = null;
    this.imageClip = null;
    this.settings = { ...DEFAULT_SETTINGS(), ...settings };
    this.applySettings();
    this.renderIcons();
    this.renderTaskbar();
    this.setPower(power, true);
  }

  // ------------------------------------------------------------------ Güç durumları
  setPower(state, quiet) {
    clearTimeout(this.powerTimer);
    this.power = state;
    const o = this.overEl;
    o.onclick = o.onpointermove = o.onchange = o.onkeydown = null;
    o.className = 'dk-over pw-' + state;
    o.hidden = state === 'desktop';
    this.closeMenus();
    const later = (ms, next) => { this.powerTimer = setTimeout(() => this.setPower(next), ms); };
    const now = this.now();
    switch (state) {
      case 'off':
        for (const w of [...this.wins]) this.destroy(w);
        o.innerHTML = `<div class="pw-room">
            <div class="pw-monitor"><div class="pw-glass"></div><div class="pw-stand"></div><button type="button" class="pw-mbtn" title="Ekranın düğmesi"></button></div>
            <div class="pw-tower"><div class="pw-grill"></div><button type="button" class="pw-btn" title="Bilgisayarın güç düğmesi">⏻</button><span class="pw-led"></span></div>
          </div><p class="pw-say">Bilgisayar kapalı.</p>`;
        o.querySelector('.pw-btn').onclick = () => { this.emit('power-button'); this.setPower('boot'); };
        o.querySelector('.pw-mbtn').onclick = () => {
          o.querySelector('.pw-say').innerHTML = 'Bu, <b>ekranın</b> düğmesi: yalnızca ekranı açıp kapatır. Bilgisayarı açmak için <b>kasadaki ⏻ düğmesine</b> basın.';
          this.emit('monitor-button');
        };
        break;
      case 'boot':
        o.innerHTML = `<div class="pw-logo">${startLogo()}</div><div class="pw-spin"><i></i><i></i><i></i><i></i><i></i></div>`;
        later(2600, 'lock');
        break;
      case 'lock':
        o.innerHTML = `<div class="pw-lock" style="background:${this.wallCss()}"><div class="pw-big">${pad(now.getHours())}:${pad(now.getMinutes())}</div>
          <div class="pw-day">${now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div class="pw-tip">Kilidi açmak için ekrana tıklayın ya da bir tuşa basın</div></div>`;
        o.onclick = () => this.power === 'lock' && this.setPower('login');
        break;
      case 'login': {
        o.innerHTML = `<div class="pw-login" style="background:${this.wallCss()}"><div class="pw-card">
            <div class="pw-avatar">👤</div><div class="pw-user">${esc(this.settings.user)}</div>
            <div class="pw-pass"><input type="password" placeholder="Şifre" autocomplete="off" aria-label="Şifre"><button type="button" class="pw-eye" title="Şifreyi göster">👁</button><button type="button" class="pw-go" title="Giriş">➜</button></div>
            <div class="pw-err"></div><div class="pw-hint">Alıştırma şifresi: <b>${esc(this.settings.password)}</b></div></div></div>`;
        const inp = o.querySelector('input');
        const go = () => {
          const ok = inp.value === this.settings.password;
          this.emit('login', { ok });
          if (ok) { this.setPower('welcome'); return; }
          o.querySelector('.pw-err').textContent = 'Şifre yanlış. Lütfen tekrar deneyin.';
          inp.value = '';
          inp.focus();
        };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        o.querySelector('.pw-go').onclick = go;
        o.querySelector('.pw-eye').onclick = () => { inp.type = inp.type === 'password' ? 'text' : 'password'; inp.focus(); };
        setTimeout(() => inp.focus(), 50);
        break;
      }
      case 'welcome':
        o.innerHTML = `<div class="pw-login" style="background:${this.wallCss()}"><div class="pw-card"><div class="pw-avatar">👤</div><div class="pw-user">Hoş geldiniz</div><div class="pw-spin small"><i></i><i></i><i></i><i></i><i></i></div></div></div>`;
        later(1400, 'desktop');
        break;
      case 'sleep':
        o.innerHTML = '<div class="pw-sleep">Uyku modunda. Uyandırmak için fareyi oynatın ya da bir tuşa basın.</div>';
        this.sleepAt = Date.now();
        o.onpointermove = o.onclick = () => {
          if (this.power !== 'sleep' || Date.now() - this.sleepAt < 900) return;
          o.onpointermove = o.onclick = null;
          this.emit('wake');
          this.setPower('lock');
        };
        break;
      case 'shutdown': case 'restart':
        o.innerHTML = `<div class="pw-bye"><div class="pw-spin"><i></i><i></i><i></i><i></i><i></i></div><div>${state === 'shutdown' ? 'Kapatılıyor' : 'Yeniden başlatılıyor'}</div></div>`;
        for (const w of [...this.wins]) this.destroy(w);
        later(2200, state === 'shutdown' ? 'off' : 'boot');
        break;
      case 'desktop':
        o.innerHTML = '';
        break;
    }
    if (state !== 'login') setTimeout(() => { if (this.power === state && state !== 'desktop') o.focus({ preventScroll: true }); }, 30);
    if (!quiet) this.emit('power', { state });
  }

  // ------------------------------------------------------------------ Ayarlar
  wallCss() {
    if (this.settings.wallpaper === 'custom' && this.settings.customWall) return `center/cover no-repeat url("${this.settings.customWall}")`;
    return (WALLPAPERS[this.settings.wallpaper] || WALLPAPERS.mavi)[1];
  }

  applySettings() {
    const s = this.settings;
    this.root.querySelector('.dk-wall').style.background = this.wallCss();
    this.root.style.setProperty('--dk-scale', s.textScale / 100);
    this.root.querySelector('.dk-dim').style.opacity = (100 - s.brightness) / 140;
    this.root.querySelector('.tb-wifi').textContent = s.wifi && s.network ? '📶' : '🚫';
    this.root.querySelector('.tb-vol').textContent = s.muted || !s.volume ? '🔇' : s.volume < 40 ? '🔈' : '🔊';
    this.root.classList.toggle('dk-dark', !!s.dark);
    this.tick();
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.applySettings();
    this.emit('setting', { key, value });
    this.wins.forEach((w) => w.api?.onSettings?.());
  }

  now() {
    const d = new Date(Date.now() + (this.settings?.timeOffset || 0));
    return d;
  }

  tick() {
    if (!this.root.querySelector('.tb-time')) return;
    const d = this.now();
    this.root.querySelector('.tb-time').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    this.root.querySelector('.tb-date').textContent = d.toLocaleDateString('tr-TR');
  }

  // ------------------------------------------------------------------ Masaüstü simgeleri
  desktopItems() {
    return [
      { id: 'sys:pc', name: 'Bu Bilgisayar', icon: '💻', sys: true },
      { id: 'sys:recycle', name: 'Geri Dönüşüm Kutusu', icon: this.fs.children(RECYCLE).length ? '🗑️' : '🗑', sys: true, drop: RECYCLE },
      ...this.fs.children('desktop').map((n) => ({ id: n.id, name: n.type === 'file' ? n.name : n.name, icon: nodeIcon(n), node: n, link: n.type === 'link', drop: n.type === 'folder' ? n.id : null })),
    ];
  }

  renderIcons() {
    const items = this.desktopItems();
    const rows = Math.max(3, Math.floor((this.iconsEl.clientHeight || 400) / (CELL_H * this.emPx())));
    const used = new Set();
    for (const it of items) if (this.iconPos[it.id]) used.add(this.iconPos[it.id].c + ',' + this.iconPos[it.id].r);
    for (const it of items) {
      if (this.iconPos[it.id]) continue;
      for (let i = 0; ; i++) {
        const c = Math.floor(i / rows), r = i % rows;
        if (!used.has(c + ',' + r)) { this.iconPos[it.id] = { c, r }; used.add(c + ',' + r); break; }
      }
    }
    for (const k of Object.keys(this.iconPos)) if (!items.some((it) => it.id === k)) delete this.iconPos[k];
    const renaming = this.renaming;
    this.iconsEl.innerHTML = items.map((it) => {
      const p = this.iconPos[it.id];
      return `<div class="dk-icon${this.selected === it.id ? ' sel' : ''}" data-id="${it.id}" ${it.drop ? `data-drop="folder:${it.drop}"` : ''} style="left:${p.c * CELL_W + 0.4}em;top:${p.r * CELL_H + 0.4}em">
        <span class="di-img">${it.icon}${it.link ? '<i class="di-arrow">↗</i>' : ''}</span>
        ${renaming === it.id ? `<textarea class="di-rename" rows="2" spellcheck="false">${esc(it.name)}</textarea>` : `<span class="di-name">${esc(it.name)}</span>`}</div>`;
    }).join('');
    if (renaming) {
      const t = this.iconsEl.querySelector('.di-rename');
      if (t) this.bindRename(t, renaming);
    }
  }

  emPx() { return parseFloat(getComputedStyle(this.iconsEl).fontSize) || 15; }
  iconEl(id) { return this.iconsEl.querySelector(`[data-id="${id}"]`); }
  item(id) { return this.desktopItems().find((it) => it.id === id); }

  select(id) {
    this.selected = id;
    this.iconsEl.querySelectorAll('.dk-icon').forEach((el) => el.classList.toggle('sel', el.dataset.id === id));
    if (id) this.emit('icon-select', { id, name: this.item(id)?.name });
  }

  bindIcons() {
    const el = this.iconsEl;
    el.addEventListener('pointerdown', (e) => {
      this.closeMenus();
      const ic = e.target.closest('.dk-icon');
      if (e.target.closest('.di-rename')) return;
      if (!ic) { if (e.button === 0) this.select(null); this.emit('desktop-click', { button: e.button }); return; }
      this.select(ic.dataset.id);
      if (e.button === 0) this.dragStart(e, { kind: 'node', id: ic.dataset.id, el: ic, from: 'desktop' });
    });
    el.addEventListener('dblclick', (e) => {
      const ic = e.target.closest('.dk-icon');
      if (!ic || e.target.closest('.di-rename')) return;
      this.emit('icon-open', { id: ic.dataset.id, name: this.item(ic.dataset.id)?.name });
      this.openItem(ic.dataset.id);
    });
    el.addEventListener('click', (e) => {
      const ic = e.target.closest('.dk-icon');
      if (ic && !this.dragged) this.emit('icon-click', { id: ic.dataset.id, name: this.item(ic.dataset.id)?.name });
    });
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const ic = e.target.closest('.dk-icon');
      if (ic) { this.select(ic.dataset.id); this.iconMenu(e, ic.dataset.id); return; }
      this.select(null);
      this.desktopMenu(e);
    });
    el.addEventListener('wheel', () => this.emit('wheel', { where: 'desktop' }), { passive: true });
  }

  iconMenu(e, id) {
    const it = this.item(id);
    const items = [{ cmd: 'open', label: 'Aç', bold: true }];
    if (id === 'sys:recycle') items.push({ cmd: 'empty', label: 'Geri Dönüşüm Kutusunu boşalt', disabled: !this.fs.children(RECYCLE).length });
    if (!it.sys) {
      items.push('-', { cmd: 'cut', label: 'Kes', key: 'Ctrl+X' }, { cmd: 'copy', label: 'Kopyala', key: 'Ctrl+C' }, '-',
        { cmd: 'rename', label: 'Yeniden adlandır', key: 'F2' }, { cmd: 'delete', label: 'Sil', key: 'Del' });
      if (it.node?.type === 'file' && /\.(jpe?g|png)$/i.test(it.node.name)) items.push('-', { cmd: 'wallpaper', label: 'Masaüstü arka planı olarak ayarla' });
    }
    items.push('-', { cmd: 'props', label: 'Özellikler' });
    this.menu(e.clientX, e.clientY, items, (cmd) => this.iconCmd(cmd, id), 'icon', { id, name: it.name });
  }

  iconCmd(cmd, id) {
    const it = this.item(id);
    switch (cmd) {
      case 'open': this.emit('icon-open', { id, name: it.name, via: 'menu' }); return this.openItem(id);
      case 'empty': return this.emptyRecycle();
      case 'cut': case 'copy': this.fileClip = { op: cmd, id }; this.emit('file-clip', { op: cmd, id, name: it.name }); return;
      case 'rename': return this.startRename(id);
      case 'delete': return this.deleteNode(id);
      case 'wallpaper': this.settings.customWall = pictureURL(it.node.content); this.setSetting('wallpaper', 'custom'); this.emit('wallpaper', { name: it.name, custom: true }); return;
      case 'props': return this.dialogs.ask({ title: `${it.name} Özellikleri`, icon: it.icon, text: `<b>${esc(it.name)}</b><br>Tür: ${it.sys ? 'Sistem' : it.link ? 'Kısayol' : it.node?.type === 'folder' ? 'Dosya klasörü' : 'Dosya'}<br>Konum: Masaüstü`, buttons: [['ok', 'Tamam', true]] });
    }
  }

  desktopMenu(e) {
    const items = [
      { cmd: 'view', label: 'Görünüm', sub: [{ cmd: 'big', label: 'Büyük simgeler' }, { cmd: 'mid', label: 'Orta boy simgeler' }] },
      { cmd: 'refresh', label: 'Yenile' },
      '-',
      { cmd: 'paste', label: 'Yapıştır', key: 'Ctrl+V', disabled: !this.fileClip },
      { cmd: 'new', label: 'Yeni', sub: [{ cmd: 'newFolder', label: '📁 Klasör' }, { cmd: 'newText', label: '📝 Metin Belgesi' }] },
      '-',
      { cmd: 'personalize', label: 'Kişiselleştir' },
    ];
    const rect = this.iconsEl.getBoundingClientRect();
    const at = this.cellAt(e.clientX - rect.left, e.clientY - rect.top);
    this.menu(e.clientX, e.clientY, items, (cmd) => {
      if (cmd === 'big') this.iconsEl.classList.add('big');
      if (cmd === 'mid') this.iconsEl.classList.remove('big');
      if (cmd === 'refresh') this.renderIcons();
      if (cmd === 'paste') this.pasteFile('desktop');
      if (cmd === 'newFolder' || cmd === 'newText') {
        const n = this.fs.create('desktop', cmd === 'newFolder' ? { type: 'folder', name: 'Yeni klasör' } : { type: 'file', name: 'Yeni Metin Belgesi.txt', content: '' });
        this.placeIcon(n.id, at);
        this.select(n.id);
        this.startRename(n.id);
      }
      if (cmd === 'personalize') this.open('settings', { page: 'personal' });
    }, 'desktop');
  }

  cellAt(x, y) {
    const em = this.emPx();
    return { c: Math.max(0, Math.round((x / em - CELL_W / 2) / CELL_W)), r: Math.max(0, Math.round((y / em - CELL_H / 2) / CELL_H)) };
  }

  placeIcon(id, { c, r }) {
    const rows = Math.max(3, Math.floor(this.iconsEl.clientHeight / (CELL_H * this.emPx())));
    const cols = Math.max(3, Math.floor(this.iconsEl.clientWidth / (CELL_W * this.emPx())));
    r = Math.min(r, rows - 1); c = Math.min(c, cols - 1);
    const taken = (cc, rr) => Object.entries(this.iconPos).some(([k, p]) => k !== id && p.c === cc && p.r === rr);
    // Doluysa en yakın boş hücreyi bul
    let best = { c, r }, bd = Infinity;
    for (let cc = 0; cc < cols; cc++) for (let rr = 0; rr < rows; rr++) {
      if (taken(cc, rr)) continue;
      const d = (cc - c) ** 2 + (rr - r) ** 2;
      if (d < bd) { bd = d; best = { c: cc, r: rr }; }
    }
    this.iconPos[id] = best;
    this.renderIcons();
  }

  startRename(id) {
    const it = this.item(id);
    if (!it || it.sys) return;
    this.renaming = id;
    this.renderIcons();
    this.emit('rename-start', { id, name: it.name });
  }

  bindRename(t, id) {
    const node = this.fs.get(id);
    t.focus();
    const dot = node.type === 'file' ? node.name.lastIndexOf('.') : -1;
    t.setSelectionRange(0, dot > 0 ? dot : node.name.length);
    let finished = false;
    const finish = (save) => {
      if (finished) return;
      finished = true;
      this.renaming = null;
      const v = t.value.replace(/\n/g, '').trim();
      const old = node.name;
      if (save && v && v !== old) {
        const err = this.fs.rename(id, v);
        if (err) { this.toast('Ad değiştirilemedi', err, '⚠'); this.renderIcons(); }
        else this.emit('rename', { id, name: v, old });
      } else this.renderIcons();
    };
    t.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') finish(false);
    });
    t.addEventListener('blur', () => finish(true));
    t.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  deleteNode(id) {
    const n = this.fs.get(id);
    if (!n) return;
    const name = n.name;
    const err = this.fs.remove(id);
    if (err) return this.toast('Silinemedi', err, '⚠');
    if (this.selected === id) this.selected = null;
    this.emit('delete', { id, name });
  }

  emptyRecycle() {
    const n = this.fs.children(RECYCLE).length;
    if (!n) return;
    this.dialogs.ask({ title: 'Öğeleri sil', icon: '🗑', text: `Bu ${n} öğeyi <b>kalıcı olarak</b> silmek istediğinizden emin misiniz?`, buttons: [['yes', 'Evet', true], ['no', 'Hayır']] })
      .then((a) => { if (a === 'yes') { this.fs.emptyRecycle(); this.emit('recycle-empty'); } });
  }

  pasteFile(target) {
    const c = this.fileClip;
    if (!c || !this.fs.get(c.id)) return;
    const name = this.fs.get(c.id).name;
    if (c.op === 'cut') { this.fs.move(c.id, target); this.fileClip = null; } else this.fs.copy(c.id, target);
    this.emit('file-paste', { op: c.op, name, to: target, toName: this.fs.label(target) });
  }

  // Masaüstündeki bir öğeyi aç (çift tık)
  openItem(id) {
    if (id === 'sys:pc') return this.open('explorer', { folder: 'pc' });
    if (id === 'sys:recycle') return this.open('explorer', { folder: RECYCLE });
    return this.openNode(this.fs.get(id));
  }

  openNode(n) {
    if (!n) return null;
    if (n.type === 'link') return this.open(n.app, n.args);
    if (n.type === 'folder') return this.open('explorer', { folder: n.id });
    const name = n.name.toLowerCase();
    if (name.endsWith('.txt')) return this.open('notepad', { node: n.id });
    if (/\.(jpe?g|png|bmp)$/.test(name)) return this.open(this.settings.installed.includes('viewer') ? 'viewer' : 'photos', { node: n.id });
    if (name.endsWith('.exe')) return this.runSetup(n);
    if (name.endsWith('.pdf')) return this.open('pdf', { node: n.id });
    if (name.endsWith('.mp3')) return this.open('music', { node: n.id });
    this.toast('Açılamadı', 'Bu dosyayı açacak bir program yok.', '⚠');
    return null;
  }

  async runSetup(n) {
    this.emit('exe-open', { name: n.name });
    const yes = await this.uac(n.name.replace(/\.exe$/i, ''));
    if (yes) this.open('setup', { node: n.id });
  }

  // ------------------------------------------------------------------ Sürükle-bırak
  // payload: { kind: 'node', id, el, from }
  dragStart(e, payload) {
    const sx = e.clientX, sy = e.clientY;
    let ghost = null, over = null;
    this.dragged = false;
    const scr = this.screen.getBoundingClientRect();
    const move = (ev) => {
      if (!ghost) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
        ghost = payload.el.cloneNode(true);
        ghost.classList.add('dk-ghost');
        ghost.removeAttribute('data-drop');
        this.screen.append(ghost);
        payload.el.classList.add('dragging');
        this.dragged = true;
        this.emit('drag-start', { id: payload.id, from: payload.from });
      }
      ghost.style.left = (ev.clientX - scr.left - 30) + 'px';
      ghost.style.top = (ev.clientY - scr.top - 24) + 'px';
      const t = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-drop]');
      const tgt = t && t !== payload.el ? t : null;
      if (tgt !== over) { over?.classList.remove('drop-over'); over = tgt; over?.classList.add('drop-over'); }
    };
    const up = (ev) => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (!ghost) return;
      ghost.remove();
      payload.el.classList.remove('dragging');
      over?.classList.remove('drop-over');
      setTimeout(() => { this.dragged = false; }, 0);
      this.drop(payload, over?.dataset.drop, ev);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  drop(p, target, ev) {
    const id = p.id;
    const node = this.fs.get(id);
    const name = node?.name ?? this.item(id)?.name;
    if (!target) { this.emit('drop', { id, name, to: null }); return; }
    if (target === 'desktop') {
      const r = this.iconsEl.getBoundingClientRect();
      if (node && node.parent !== 'desktop') {
        const op = this.crossDrive(node.parent, 'desktop') ? 'copy' : 'move';
        const n = op === 'copy' ? this.fs.copy(id, 'desktop') : (this.fs.move(id, 'desktop'), node);
        this.placeIcon(n.id, this.cellAt(ev.clientX - r.left, ev.clientY - r.top));
        this.emit('drop', { id, name, to: 'desktop', toName: 'Masaüstü', op });
        return;
      }
      this.placeIcon(id, this.cellAt(ev.clientX - r.left, ev.clientY - r.top));
      this.emit('icon-move', { id, name });
      this.emit('drop', { id, name, to: 'desktop-move' });
      return;
    }
    const folder = target.replace(/^folder:/, '');
    if (!node) { this.emit('drop', { id, name, to: folder, refused: true }); return; }
    if (folder === node.parent) { this.emit('drop', { id, name, to: folder, same: true }); return; }
    if (folder === RECYCLE) { this.deleteNode(id); this.emit('drop', { id, name, to: RECYCLE, toName: 'Geri Dönüşüm Kutusu', op: 'delete' }); return; }
    const op = this.crossDrive(node.parent, folder) ? 'copy' : 'move';
    const err = op === 'copy' ? (this.fs.copy(id, folder), '') : this.fs.move(id, folder);
    if (err) { this.toast('Taşınamadı', err, '⚠'); return; }
    if (op === 'copy') this.toast('Kopyalandı', `“${name}” → ${this.fs.label(folder)}`, '📋');
    this.emit('drop', { id, name, to: folder, toName: this.fs.label(folder), op });
  }

  // Windows'ta farklı sürücüler arasında sürüklemek kopyalar (ör. bilgisayardan USB belleğe)
  crossDrive(a, b) { return this.fs.isInside(a, USB) !== this.fs.isInside(b, USB); }

  // ------------------------------------------------------------------ Menüler
  // items: { cmd, label, key?, disabled?, bold?, sub? } ya da '-'
  menu(x, y, items, pick, kind, info = {}) {
    this.closeMenus();
    const scr = this.screen.getBoundingClientRect();
    const build = (list) => `<div class="dk-menu">${list.map((it) => it === '-' ? '<hr>'
      : `<button type="button" data-cmd="${it.cmd}" ${it.disabled ? 'disabled' : ''} class="${it.bold ? 'b' : ''}${it.sub ? ' has-sub' : ''}"><span>${it.label}</span>${it.key ? `<kbd>${it.key}</kbd>` : ''}${it.sub ? '<i>›</i>' : ''}</button>${it.sub ? build(it.sub).replace('dk-menu', 'dk-menu dk-sub') : ''}`).join('')}</div>`;
    const wrap = document.createElement('div');
    wrap.className = 'dk-ctx';
    wrap.innerHTML = build(items);
    this.screen.append(wrap);
    const m = wrap.firstElementChild;
    let left = x - scr.left, top = y - scr.top;
    left = Math.min(left, scr.width - m.offsetWidth - 4);
    top = Math.min(top, scr.height - m.offsetHeight - 4);
    wrap.style.left = left + 'px';
    wrap.style.top = top + 'px';
    const openSub = (b) => {
      m.querySelectorAll('.dk-sub').forEach((s) => s.classList.remove('open'));
      const sub = b?.nextElementSibling;
      if (!sub?.classList.contains('dk-sub')) return;
      sub.classList.add('open');
      sub.style.top = b.offsetTop + 'px';
      const flip = left + m.offsetWidth + sub.offsetWidth > scr.width;
      sub.style.left = flip ? -sub.offsetWidth + 'px' : m.offsetWidth - 4 + 'px';
      this.emit('submenu', { cmd: b.dataset.cmd });
    };
    wrap.addEventListener('pointerover', (e) => { const b = e.target.closest('.has-sub'); if (b) openSub(b); else if (e.target.closest('.dk-menu:not(.dk-sub) > button')) openSub(null); });
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cmd]');
      if (!b || b.disabled) return;
      if (b.classList.contains('has-sub')) { openSub(b); return; }
      this.closeMenus();
      this.emit('menu-cmd', { cmd: b.dataset.cmd, kind, ...info });
      pick(b.dataset.cmd);
    });
    wrap.addEventListener('contextmenu', (e) => e.preventDefault());
    this.emit('context', { kind, ...info });
  }

  closeMenus() {
    this.screen?.querySelectorAll('.dk-ctx').forEach((m) => m.remove());
    if (this.startEl && !this.startEl.hidden) { this.startEl.hidden = true; this.emit('start', { open: false }); }
    this.root.querySelector('.dk-winx')?.setAttribute('hidden', '');
    this.root.querySelector('.dk-quick')?.setAttribute('hidden', '');
  }

  // ------------------------------------------------------------------ Görev çubuğu ve Başlat
  bindTaskbar() {
    const $ = (s) => this.root.querySelector(s);
    this.screen.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.dk-ctx, .dk-start, .tb-start, .tb-search, .dk-winx, .dk-quick, .tb-net')) this.closeMenus();
    });
    $('.tb-start').onclick = () => this.toggleStart();
    $('.tb-start').oncontextmenu = (e) => { e.preventDefault(); this.winxMenu(); };
    $('.tb-search').onclick = () => this.toggleStart(true, true);
    $('.tb-showdesk').onclick = () => {
      const vis = this.wins.filter((w) => !w.min);
      if (vis.length) { this.hiddenByShow = vis; vis.forEach((w) => this.minimize(w, true)); }
      else (this.hiddenByShow || []).forEach((w) => this.wins.includes(w) && this.restore(w, true));
      this.emit('show-desktop', { hidden: vis.length });
    };
    $('.tb-net').onclick = () => this.toggleQuick();
    $('.tb-usb').onclick = () => {
      this.menu($('.tb-usb').getBoundingClientRect().left, $('.tb-usb').getBoundingClientRect().top - 60,
        [{ cmd: 'eject', label: '⏏ USB Belleği çıkar' }], () => this.ejectUsb(), 'usb');
    };
    $('.tb-clock').onclick = () => this.open('settings', { page: 'time' });
    $('.tb-apps').addEventListener('click', (e) => {
      const b = e.target.closest('[data-app]');
      if (!b) return;
      const app = b.dataset.app;
      const list = this.wins.filter((w) => w.app === app);
      this.emit('taskbar-click', { app });
      if (!list.length) { this.open(app); return; }
      const w = list.find((x) => x === this.active) || list.at(-1);
      if (w.min) this.restore(w);
      else if (w === this.active) this.minimize(w);
      else this.focus(w);
    });
  }

  renderTaskbar() {
    const apps = [...PINNED, ...this.wins.map((w) => w.app).filter((a, i, arr) => !PINNED.includes(a) && arr.indexOf(a) === i)];
    this.root.querySelector('.tb-apps').innerHTML = apps.map((a) => {
      const ws = this.wins.filter((w) => w.app === a);
      const cls = [ws.length ? 'run' : '', ws.some((w) => w === this.active && !w.min) ? 'act' : ''].join(' ');
      return `<button type="button" data-app="${a}" class="${cls}" title="${esc(ws[0]?.title || APPS[a].name)}">${APPS[a].icon}</button>`;
    }).join('');
  }

  toggleStart(open = this.startEl.hidden, focusSearch = false) {
    if (!open) { this.closeMenus(); return; }
    this.closeMenus();
    const el = this.startEl;
    const list = START_APPS.filter((a) => !APPS[a].installable || this.settings.installed.includes(a));
    el.innerHTML = `<input class="st-search" placeholder="Uygulama ara (ör. hesap)" aria-label="Ara">
      <div class="st-head">Sabitlenmiş</div>
      <div class="st-grid">${list.map((a) => `<button type="button" data-app="${a}"><span>${APPS[a].icon}</span>${APPS[a].name}</button>`).join('')}</div>
      <div class="st-results" hidden></div>
      <div class="st-foot"><span class="st-user">👤 ${esc(this.settings.user)}</span><button type="button" class="st-power" title="Güç">⏻</button></div>`;
    el.hidden = false;
    this.emit('start', { open: true });
    const input = el.querySelector('.st-search');
    const results = el.querySelector('.st-results');
    const all = Object.keys(APPS).filter((a) => !APPS[a].hidden && (!APPS[a].installable || this.settings.installed.includes(a)));
    // Program adıyla başlayanlar önce, sonra adında geçenler, en son anahtar kelimeyle eşleşenler
    const match = (q) => {
      const t = q.toLocaleLowerCase('tr').trim();
      const score = (a) => {
        const n = APPS[a].name.toLocaleLowerCase('tr');
        if (n.startsWith(t)) return 4;
        if (n.split(' ').some((w) => w.startsWith(t))) return 3;
        if (n.includes(t)) return 2;
        return (APPS[a].keywords || []).some((k) => k.includes(t)) ? 1 : 0;
      };
      return all.map((a) => [a, score(a)]).filter(([, s]) => s).sort((x, y) => y[1] - x[1]).map(([a]) => a);
    };
    input.addEventListener('input', () => {
      const q = input.value;
      this.emit('start-search', { text: q });
      el.querySelector('.st-grid').hidden = el.querySelector('.st-head').hidden = !!q.trim();
      results.hidden = !q.trim();
      const m = match(q);
      results.innerHTML = m.length ? `<div class="st-head">En iyi eşleşme</div>${m.map((a, i) => `<button type="button" data-app="${a}" class="${i ? '' : 'best'}"><span>${APPS[a].icon}</span>${APPS[a].name}${i ? '' : '<small>Uygulama · Açmak için Enter</small>'}</button>`).join('')}`
        : '<div class="st-none">Sonuç bulunamadı.</div>';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const a = match(input.value)[0]; if (input.value.trim() && a) { this.closeMenus(); this.emit('start-open', { app: a, via: 'search' }); this.open(a); } }
      if (e.key === 'Escape') this.closeMenus();
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-app]');
      if (b) { this.closeMenus(); this.emit('start-open', { app: b.dataset.app, via: 'click' }); this.open(b.dataset.app); return; }
      if (e.target.closest('.st-power')) this.powerMenu(e.target.closest('.st-power'));
    });
    // Windows'ta olduğu gibi Başlat açıkken doğrudan yazmaya başlamak arama yapar
    setTimeout(() => input.focus({ preventScroll: true }), focusSearch ? 0 : 30);
  }

  powerMenu(btn) {
    const r = btn.getBoundingClientRect();
    const keep = this.startEl;
    this.emit('power-menu');
    const items = [{ cmd: 'sleep', label: '🌙 Uyku' }, { cmd: 'shutdown', label: '⏻ Kapat' }, { cmd: 'restart', label: '🔄 Yeniden başlat' }];
    // Başlat menüsünü kapatmadan güç menüsünü açıyoruz
    const wasHidden = keep.hidden;
    this.screen.querySelectorAll('.dk-ctx').forEach((m) => m.remove());
    const wrap = document.createElement('div');
    wrap.className = 'dk-ctx';
    wrap.innerHTML = `<div class="dk-menu">${items.map((it) => `<button type="button" data-cmd="${it.cmd}"><span>${it.label}</span></button>`).join('')}</div>`;
    this.screen.append(wrap);
    const scr = this.screen.getBoundingClientRect();
    wrap.style.left = Math.min(r.left - scr.left - 80, scr.width - 200) + 'px';
    wrap.style.top = (r.top - scr.top - wrap.offsetHeight - 6) + 'px';
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cmd]');
      if (!b) return;
      this.closeMenus();
      this.emit('menu-cmd', { cmd: b.dataset.cmd, kind: 'power' });
      this.powerAction(b.dataset.cmd);
    });
    keep.hidden = wasHidden;
  }

  async powerAction(cmd) {
    if (cmd !== 'sleep') {
      // Kaydedilmemiş Not Defteri varsa sor
      for (const w of this.wins.filter((x) => x.api?.confirmClose)) {
        this.focus(w);
        if (!(await w.api.confirmClose())) { this.emit('power-cancel'); return; }
      }
    }
    this.setPower(cmd);
  }

  winxMenu() {
    const items = [
      { cmd: 'apps', label: 'Yüklü uygulamalar' }, { cmd: 'devmgr', label: 'Aygıt Yöneticisi' }, { cmd: 'settings', label: 'Ayarlar' },
      { cmd: 'explorer', label: 'Dosya Gezgini' }, { cmd: 'search', label: 'Ara' }, '-',
      { cmd: 'power', label: 'Kapat veya oturumu kapat', sub: [{ cmd: 'sleep', label: 'Uyku' }, { cmd: 'shutdown', label: 'Kapat' }, { cmd: 'restart', label: 'Yeniden başlat' }] },
      { cmd: 'desktop', label: 'Masaüstü' },
    ];
    const b = this.root.querySelector('.tb-start').getBoundingClientRect();
    this.menu(b.left, b.top - 320, items, (cmd) => {
      if (cmd === 'apps') this.open('settings', { page: 'apps' });
      else if (cmd === 'devmgr') this.open('devmgr');
      else if (cmd === 'settings') this.open('settings');
      else if (cmd === 'explorer') this.open('explorer');
      else if (cmd === 'search') this.toggleStart(true, true);
      else if (cmd === 'desktop') this.root.querySelector('.tb-showdesk').click();
      else this.powerAction(cmd);
    }, 'winx');
  }

  toggleQuick() {
    const q = this.root.querySelector('.dk-quick');
    if (!q.hidden) { q.hidden = true; return; }
    this.closeMenus();
    const s = this.settings;
    q.innerHTML = `<div class="qk-row"><button type="button" class="qk-wifi ${s.wifi ? 'on' : ''}">📶<span>${s.wifi ? (s.network || 'Bağlı değil') : 'Wi-Fi kapalı'}</span></button>
        <button type="button" class="qk-bt">🔵<span>Bluetooth</span></button></div>
      <label class="qk-sl">☀ <input type="range" class="qk-bri" min="20" max="100" value="${s.brightness}"></label>
      <label class="qk-sl"><button type="button" class="qk-mute" title="Sesi kapat/aç">${s.muted ? '🔇' : '🔊'}</button><input type="range" class="qk-vol" min="0" max="100" value="${s.volume}"><b class="qk-vv">${s.volume}</b></label>
      <button type="button" class="qk-all">⚙ Tüm ayarlar</button>`;
    q.hidden = false;
    this.emit('quick', { open: true });
    q.querySelector('.qk-wifi').onclick = () => { this.setSetting('wifi', !s.wifi); if (!s.wifi) this.settings.network = null; else this.settings.network = this.settings.knownNetworks[0] || null; this.applySettings(); q.hidden = true; this.toggleQuick(); };
    q.querySelector('.qk-bri').oninput = (e) => this.setSetting('brightness', +e.target.value);
    q.querySelector('.qk-vol').oninput = (e) => { this.setSetting('volume', +e.target.value); q.querySelector('.qk-vv').textContent = e.target.value; if (s.muted) this.setSetting('muted', false); };
    q.querySelector('.qk-mute').onclick = (e) => { this.setSetting('muted', !s.muted); e.target.textContent = s.muted ? '🔇' : '🔊'; };
    q.querySelector('.qk-all').onclick = () => { q.hidden = true; this.open('settings'); };
  }

  // ------------------------------------------------------------------ Pencereler
  open(app, args = {}) {
    const def = APPS[app];
    if (!def) return null;
    if (def.single) {
      const ex = this.wins.find((w) => w.app === app);
      if (ex) { if (ex.min) this.restore(ex); else this.focus(ex); ex.api?.onArgs?.(args); return ex; }
    }
    const scr = this.winsEl.getBoundingClientRect();
    const W = scr.width || 800, H = scr.height || 500;
    const w = Math.min(W - 20, Math.round(W * (def.w || 0.6)));
    const h = Math.min(H - 20, Math.round(H * (def.h || 0.65)));
    const n = this.wins.length;
    const win = {
      id: 'w' + this.seq++, app, title: def.name, icon: def.icon,
      x: Math.round((W - w) / 2 + (n % 5) * 24 - 40), y: Math.max(6, Math.round((H - h) / 2 + (n % 5) * 22 - 30)), w, h, min: false, max: !!def.max,
    };
    win.x = Math.max(4, Math.min(win.x, W - w - 4));
    const el = document.createElement('div');
    el.className = 'win';
    el.dataset.app = app;
    el.innerHTML = `<div class="win-bar"><span class="win-ico">${def.icon}</span><span class="win-title"></span>
        <button type="button" class="wb-min" title="Simge durumuna küçült">—</button><button type="button" class="wb-max" title="Ekranı kapla">☐</button><button type="button" class="wb-close" title="Kapat">✕</button></div>
      <div class="win-body"></div><div class="win-grip" title="Boyutlandır"></div>`;
    win.el = el;
    this.winsEl.append(el);
    this.wins.push(win);
    this.bindWin(win);
    const body = el.querySelector('.win-body');
    win.api = def.create({
      desk: this, win, body, args, fs: this.fs, dialogs: this.dialogs,
      emit: (type, data = {}) => this.emit(type, { app, win: win.id, ...data }),
      setTitle: (t) => { win.title = t; el.querySelector('.win-title').textContent = t; this.renderTaskbar(); },
      close: () => this.destroy(win),
    }) || {};
    if (!el.querySelector('.win-title').textContent) el.querySelector('.win-title').textContent = win.title;
    this.layout(win);
    this.focus(win, true);
    this.emit('app-open', { app, win: win.id, args });
    return win;
  }

  bindWin(win) {
    const el = win.el;
    el.addEventListener('pointerdown', () => { if (this.active !== win) this.focus(win); }, true);
    el.querySelector('.wb-min').onclick = () => this.minimize(win);
    el.querySelector('.wb-max').onclick = () => (win.max ? this.restoreSize(win) : this.maximize(win));
    el.querySelector('.wb-close').onclick = () => this.close(win);
    const bar = el.querySelector('.win-bar');
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) (win.max ? this.restoreSize(win) : this.maximize(win)); });
    bar.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.menu(e.clientX, e.clientY, [{ cmd: 'restore', label: 'Geri yükle', disabled: !win.max }, { cmd: 'min', label: 'Simge durumuna küçült' }, { cmd: 'max', label: 'Ekranı kapla', disabled: win.max }, '-', { cmd: 'close', label: 'Kapat', key: 'Alt+F4', bold: true }],
        (c) => ({ restore: () => this.restoreSize(win), min: () => this.minimize(win), max: () => this.maximize(win), close: () => this.close(win) })[c](), 'titlebar', { app: win.app });
    });
    bar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button')) return;
      const sx = e.clientX, sy = e.clientY, startX = win.x, startY = win.y;
      let ox = win.x, oy = win.y, moved = false;
      const scr = this.winsEl.getBoundingClientRect();
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved) {
          if (Math.hypot(dx, dy) < 4) return;
          moved = true;
          el.classList.add('moving');
          if (win.max) {
            // Kaplanmış pencereyi sürükleyince eski boyutuna döner (Windows'taki gibi)
            win.max = false;
            ox = ev.clientX - scr.left - win.w / 2 - dx;
            oy = -dy;
            this.emit('win-restore', { app: win.app, win: win.id, via: 'drag' });
          }
        }
        win.x = Math.max(-win.w + 80, Math.min(scr.width - 80, ox + dx));
        win.y = Math.max(0, Math.min(scr.height - 30, oy + dy));
        this.layout(win);
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        el.classList.remove('moving');
        if (moved) this.emit('win-move', { app: win.app, win: win.id, dx: win.x - startX, dy: win.y - startY, x: win.x, y: win.y });
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
    el.querySelector('.win-grip').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY, ow = win.w, oh = win.h;
      const move = (ev) => {
        win.w = Math.max(260, ow + ev.clientX - sx);
        win.h = Math.max(180, oh + ev.clientY - sy);
        this.layout(win);
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        this.emit('win-resize', { app: win.app, win: win.id, w: win.w, h: win.h, dw: win.w - ow, dh: win.h - oh });
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  }

  layout(win) {
    const s = win.el.style;
    win.el.classList.toggle('max', win.max);
    win.el.querySelector('.wb-max').textContent = win.max ? '❐' : '☐';
    win.el.querySelector('.wb-max').title = win.max ? 'Önceki boyutuna getir' : 'Ekranı kapla';
    if (win.max) { s.left = s.top = '0'; s.width = s.height = '100%'; }
    else { s.left = win.x + 'px'; s.top = win.y + 'px'; s.width = win.w + 'px'; s.height = win.h + 'px'; }
    win.api?.onResize?.();
  }

  focus(win, quiet) {
    if (!win || win.min) return;
    this.active = win;
    win.el.style.zIndex = ++this.z;
    this.wins.forEach((w) => w.el.classList.toggle('active', w === win));
    this.renderTaskbar();
    win.api?.focus?.();
    if (!quiet) this.emit('win-focus', { app: win.app, win: win.id });
  }

  minimize(win, quiet) {
    win.min = true;
    win.el.classList.add('min');
    if (this.active === win) {
      this.active = null;
      const next = [...this.wins].filter((w) => !w.min).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
      if (next) this.focus(next, true);
    }
    this.renderTaskbar();
    if (!quiet) this.emit('win-min', { app: win.app, win: win.id });
  }

  restore(win, quiet) {
    win.min = false;
    win.el.classList.remove('min');
    this.focus(win, true);
    if (!quiet) this.emit('win-restore', { app: win.app, win: win.id, via: 'taskbar' });
  }

  maximize(win) {
    win.max = true;
    this.layout(win);
    this.emit('win-max', { app: win.app, win: win.id });
  }

  restoreSize(win) {
    win.max = false;
    this.layout(win);
    this.emit('win-unmax', { app: win.app, win: win.id });
  }

  async close(win) {
    if (win.api?.confirmClose && !(await win.api.confirmClose())) { this.emit('win-close-cancel', { app: win.app }); return; }
    this.destroy(win);
    this.emit('win-close', { app: win.app, win: win.id });
  }

  destroy(win) {
    win.api?.destroy?.();
    win.el.remove();
    this.wins = this.wins.filter((w) => w !== win);
    if (this.active === win) {
      this.active = null;
      const next = [...this.wins].filter((w) => !w.min).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
      if (next) this.focus(next, true);
    }
    this.renderTaskbar();
  }

  // Ders adımı değişince (Devam düğmesine basılınca) klavye odağını bilgisayara geri ver
  refocus() {
    if (this.dialogs.busy || this.snipping) return;
    if (this.power === 'login') { this.overEl.querySelector('input')?.focus({ preventScroll: true }); return; }
    if (this.power !== 'desktop') { this.overEl.focus({ preventScroll: true }); return; }
    if (!this.startEl.hidden) { this.startEl.querySelector('.st-search')?.focus({ preventScroll: true }); return; }
    if (this.active && !this.active.min) this.active.api?.focus?.();
    else this.iconsEl.focus({ preventScroll: true });
  }

  find(app) { return this.wins.filter((w) => w.app === app).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0] || null; }
  ensure(app, args) {
    const w = this.find(app);
    if (w) { if (w.min) this.restore(w, true); this.focus(w, true); return w; }
    return this.open(app, args);
  }
  closeAll() { for (const w of [...this.wins]) this.destroy(w); }

  // ------------------------------------------------------------------ Klavye
  bindKeys() {
    this.screen.addEventListener('keydown', (e) => {
      if (this.power === 'lock') { e.preventDefault(); this.setPower('login'); return; }
      if (this.power === 'sleep' && Date.now() - this.sleepAt > 900) { this.emit('wake'); this.setPower('lock'); return; }
      if (e.altKey && e.key === 'Tab') { e.preventDefault(); this.altTab(); return; }
      if (e.altKey && e.key === 'F4' && this.active) { e.preventDefault(); this.close(this.active); return; }
      if (e.target === this.iconsEl && this.selected) {
        const it = this.item(this.selected);
        if (e.key === 'Delete' && !it.sys) { e.preventDefault(); this.deleteNode(this.selected); }
        if (e.key === 'F2' && !it.sys) { e.preventDefault(); this.startRename(this.selected); }
        if (e.key === 'Enter') { e.preventDefault(); this.emit('icon-open', { id: this.selected, name: it.name, via: 'enter' }); this.openItem(this.selected); }
        if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyC' || e.code === 'KeyX') && !it.sys) { this.fileClip = { op: e.code === 'KeyC' ? 'copy' : 'cut', id: this.selected }; this.emit('file-clip', { op: this.fileClip.op, id: this.selected, name: it.name }); }
      }
      if (e.target === this.iconsEl && (e.ctrlKey || e.metaKey) && e.code === 'KeyV') this.pasteFile('desktop');
    });
    this.screen.addEventListener('keyup', (e) => { if (e.key === 'Alt' && this.switcher) this.altTabEnd(); });
    // Gerçek Alt+Tab, işletim sistemi tarafından yakalanır: sayfa odağı kaybedip geri alınca anlarız
    addEventListener('blur', () => { this.blurAt = Date.now(); });
    addEventListener('focus', () => { if (this.blurAt && Date.now() - this.blurAt > 150 && this.root.offsetParent) this.emit('alttab', { real: true }); this.blurAt = 0; });
  }

  altTab() {
    const list = [...this.wins].sort((a, b) => b.el.style.zIndex - a.el.style.zIndex);
    if (!list.length) return;
    if (!this.switcher) {
      this.switcher = document.createElement('div');
      this.switcher.className = 'dk-switch';
      this.screen.append(this.switcher);
      this.swIdx = 0;
    }
    this.swIdx = (this.swIdx + 1) % list.length;
    this.swList = list;
    this.switcher.innerHTML = list.map((w, i) => `<div class="${i === this.swIdx ? 'on' : ''}"><span>${w.icon}</span>${esc(w.title)}</div>`).join('');
  }

  altTabEnd() {
    const w = this.swList?.[this.swIdx];
    this.switcher.remove();
    this.switcher = null;
    if (w) { if (w.min) this.restore(w, true); this.focus(w, true); this.emit('alttab', { app: w.app }); }
  }

  osInstall() { osInstall(this); }

  // ------------------------------------------------------------------ Bildirim, izin, USB, ekran alıntısı
  toast(title, text, icon = 'ℹ', ms = 5000) {
    const t = document.createElement('div');
    t.className = 'dk-toast';
    t.innerHTML = `<span class="to-ico">${icon}</span><div><b>${esc(title)}</b><div>${text}</div></div><button type="button" class="to-x" title="Kapat">✕</button>`;
    this.root.querySelector('.dk-toasts').append(t);
    const rm = () => t.remove();
    t.querySelector('.to-x').onclick = rm;
    setTimeout(rm, ms);
    return t;
  }

  uac(appName) {
    return new Promise((resolve) => {
      const o = document.createElement('div');
      o.className = 'dk-uac';
      o.innerHTML = `<div class="uac-box"><div class="uac-head">Kullanıcı Hesabı Denetimi</div>
        <h3>Bu uygulamanın cihazınızda değişiklik yapmasına izin vermek istiyor musunuz?</h3>
        <div class="uac-app"><span>🛡</span><b>${esc(appName)}</b></div>
        <p>Doğrulanmış yayımcı: Örnek Yazılım A.Ş.<br>Dosya kaynağı: Bu bilgisayardaki sabit sürücü</p>
        <div class="uac-btns"><button type="button" data-v="1" class="primary">Evet</button><button type="button" data-v="0">Hayır</button></div></div>`;
      this.screen.append(o);
      this.emit('uac', { open: true, app: appName });
      o.addEventListener('click', (e) => {
        const b = e.target.closest('[data-v]');
        if (!b) return;
        o.remove();
        const yes = b.dataset.v === '1';
        this.emit('uac', { open: false, answer: yes ? 'yes' : 'no', app: appName });
        resolve(yes);
      });
      setTimeout(() => o.querySelector('[data-v="1"]').focus(), 30);
    });
  }

  plugUsb() {
    if (this.fs.usb) return;
    this.fs.plugUsb(true);
    const t = this.toast('USB Bellek (E:)', 'Yeni bir sürücü takıldı. <u>Dosyaları görmek için tıklayın.</u>', '💾', 8000);
    t.style.cursor = 'pointer';
    t.addEventListener('click', (e) => { if (!e.target.closest('.to-x')) { t.remove(); this.open('explorer', { folder: USB }); } });
    this.emit('usb', { on: true });
  }

  ejectUsb() {
    if (!this.fs.usb) return;
    for (const w of this.wins.filter((x) => x.app === 'explorer')) w.api?.leaveUsb?.();
    this.fs.plugUsb(false);
    this.toast('Donanımı güvenle kaldırın', 'USB Bellek artık bilgisayardan çıkarılabilir.', '✅', 6000);
    this.emit('usb', { on: false, safe: true });
  }

  snip() {
    if (this.snipping) return;
    this.snipping = true;
    this.closeMenus();
    const o = document.createElement('div');
    o.className = 'dk-snip';
    o.innerHTML = '<div class="sn-bar">✂ Fareyle almak istediğiniz alanın üzerinde sürükleyin · Vazgeçmek için Esc</div><div class="sn-rect" hidden></div>';
    this.screen.append(o);
    this.emit('snip-start');
    const rect = o.querySelector('.sn-rect');
    const scr = this.screen.getBoundingClientRect();
    let sx, sy;
    const end = () => {
      this.snipping = false;
      o.remove();
      document.removeEventListener('keydown', key, true);
      setTimeout(() => this.wins.forEach((w) => w.api?.onSnip?.()), 0);
    };
    const key = (e) => { if (e.key === 'Escape') { end(); this.emit('snip-cancel'); } };
    document.addEventListener('keydown', key, true);
    o.addEventListener('pointerdown', (e) => {
      sx = e.clientX - scr.left; sy = e.clientY - scr.top;
      rect.hidden = false;
      const move = (ev) => {
        const x = ev.clientX - scr.left, y = ev.clientY - scr.top;
        Object.assign(rect.style, { left: Math.min(x, sx) + 'px', top: Math.min(y, sy) + 'px', width: Math.abs(x - sx) + 'px', height: Math.abs(y - sy) + 'px' });
      };
      const up = (ev) => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        const x = ev.clientX - scr.left, y = ev.clientY - scr.top;
        const r = { x: Math.min(x, sx), y: Math.min(y, sy), w: Math.abs(x - sx), h: Math.abs(y - sy) };
        end();
        if (r.w < 20 || r.h < 20) { this.toast('Ekran Alıntısı', 'Alan çok küçüktü. Tekrar deneyin ve biraz daha büyük sürükleyin.', '✂'); this.emit('snip-cancel', { small: true }); return; }
        this.imageClip = this.renderScreen(r);
        const t = this.toast('Ekran alıntısı panoya kopyalandı', `<img class="to-img" src="${this.imageClip.toDataURL()}" alt="">Paint'i açıp <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, '✂', 9000);
        t.classList.add('wide');
        this.emit('snip', { w: Math.round(r.w), h: Math.round(r.h) });
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  }

  // Ekranın bir bölümünün resmini çizer. Tarayıcı ekran görüntüsü alamadığı için masaüstündeki
  // öğeleri (arka plan renkleri, yazılar, resimler, Paint tuvali) kendimiz bir tuvale çizeriz.
  renderScreen(r) {
    const scr = this.screen.getBoundingClientRect();
    const c = document.createElement('canvas');
    c.width = Math.round(r.w); c.height = Math.round(r.h);
    const g = c.getContext('2d');
    g.translate(-r.x - scr.left, -r.y - scr.top);
    // Arka plan
    const wp = WALLPAPERS[this.settings.wallpaper];
    const custom = this.settings.wallpaper === 'custom' && this.settings.customWall;
    const grad = g.createLinearGradient(0, scr.top, 0, scr.bottom);
    grad.addColorStop(0, wp ? wp[2][0] : '#3d8fe0');
    grad.addColorStop(1, wp ? wp[2][1] : '#061d4a');
    g.fillStyle = grad;
    g.fillRect(scr.left, scr.top, scr.width, scr.height);
    if (custom) { const im = new Image(); im.src = custom; if (im.complete) g.drawImage(im, scr.left, scr.top, scr.width, scr.height); }
    const parts = [this.iconsEl, ...[...this.wins].filter((w) => !w.min).sort((a, b) => a.el.style.zIndex - b.el.style.zIndex).map((w) => w.el), this.root.querySelector('.dk-taskbar')];
    for (const el of parts) paintNode(g, el);
    return c;
  }
}

// Basit bir DOM çizici: arka plan rengi, kenarlık, yazı, resim ve tuvalleri çizer; taşan içerikleri kırpar
function paintNode(g, el) {
  if (el.nodeType !== 1) return;
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
  const b = el.getBoundingClientRect();
  if (!b.width || !b.height) return;
  const bg = cs.backgroundColor;
  if (bg && !/rgba\(.*,\s*0\)$/.test(bg) && bg !== 'transparent') {
    g.fillStyle = bg;
    const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, b.height / 2, b.width / 2);
    if (rad) { g.beginPath(); g.roundRect(b.left, b.top, b.width, b.height, rad); g.fill(); } else g.fillRect(b.left, b.top, b.width, b.height);
  }
  const bw = parseFloat(cs.borderTopWidth);
  if (bw && cs.borderTopStyle !== 'none' && !/rgba\(.*,\s*0\)$/.test(cs.borderTopColor)) {
    g.strokeStyle = cs.borderTopColor; g.lineWidth = bw;
    g.strokeRect(b.left + bw / 2, b.top + bw / 2, b.width - bw, b.height - bw);
  }
  if (el.tagName === 'CANVAS') { try { g.drawImage(el, b.left, b.top, b.width, b.height); } catch { /* boş */ } return; }
  if (el.tagName === 'IMG' && el.complete) { try { g.drawImage(el, b.left, b.top, b.width, b.height); } catch { /* boş */ } return; }
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    g.save(); g.beginPath(); g.rect(b.left, b.top, b.width, b.height); g.clip();
    g.font = cs.font; g.fillStyle = cs.color; g.textBaseline = 'top';
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    (el.value || '').split('\n').forEach((l, i) => g.fillText(l, b.left + parseFloat(cs.paddingLeft), b.top + parseFloat(cs.paddingTop) - el.scrollTop + i * lh));
    g.restore();
    return;
  }
  const clip = cs.overflow !== 'visible';
  if (clip) { g.save(); g.beginPath(); g.rect(b.left, b.top, b.width, b.height); g.clip(); }
  for (const ch of el.childNodes) {
    if (ch.nodeType === 3 && ch.textContent.trim()) paintText(g, ch, cs);
    else if (ch.nodeType === 1) paintNode(g, ch);
  }
  if (clip) g.restore();
}

function paintText(g, node, cs) {
  g.font = cs.font;
  g.fillStyle = cs.color;
  g.textBaseline = 'middle';
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects();
  if (rects.length <= 1) {
    const rr = rects[0];
    if (rr) g.fillText(node.textContent.trim(), rr.left, rr.top + rr.height / 2);
    return;
  }
  // Birden çok satıra kaydıysa kelime kelime çiz
  const text = node.textContent;
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text))) {
    range.setStart(node, m.index);
    range.setEnd(node, m.index + m[0].length);
    const wr = range.getBoundingClientRect();
    if (wr.width) g.fillText(m[0], wr.left, wr.top + wr.height / 2);
  }
}

export function nodeIcon(n) {
  if (n.type === 'folder') return '📁';
  if (n.type === 'link') return APPS[n.app]?.icon || '📄';
  return fileIcon(n.name);
}

function startLogo() {
  return '<span class="logo4"><i></i><i></i><i></i><i></i></span>';
}
