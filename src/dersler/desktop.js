// Benzetim Windows masaüstü: açılış/kapanış, oturum açma, simgeler, sürükle-bırak, pencereler,
// görev çubuğu, Başlat menüsü, sağ tık menüleri, bildirimler, izin (UAC) penceresi, ekran alıntısı.
// Olan her şey emit() ile derse bildirilir; dersin adımları bu olaylara bakarak ilerler.
import { VFS, RECYCLE, USB, PHONE } from './vfs.js';
import { Dialogs, esc, fileIcon } from './dialog.js';
import { APPS, START_APPS } from './apps/index.js';
import { pictureURL, playTune } from './apps/util.js';
import { osInstall } from './apps/osinstall.js';
import { online } from './apps/modem.js';

export const WALLPAPERS = {
  mavi: ['Mavi', 'radial-gradient(ellipse at 30% 120%, #9fd3ff 0%, #3d8fe0 35%, #0b3c8c 75%, #061d4a 100%)', ['#3d8fe0', '#061d4a']],
  gunbatimi: ['Gün batımı', 'linear-gradient(170deg, #ffb26b 0%, #ff7b89 45%, #8a5082 80%, #3f2b56 100%)', ['#ff7b89', '#3f2b56']],
  orman: ['Orman', 'linear-gradient(160deg, #a8e063 0%, #56ab2f 45%, #1e5631 100%)', ['#56ab2f', '#1e5631']],
  gece: ['Gece', 'radial-gradient(circle at 20% 30%, #fff8 0 1px, transparent 2px) 0 0/90px 90px, radial-gradient(circle at 70% 60%, #fff6 0 1px, transparent 2px) 0 0/130px 130px, linear-gradient(180deg, #0f1c3d, #1f2f5c 60%, #2d1f4d)', ['#1f2f5c', '#2d1f4d']],
  lavanta: ['Lavanta', 'linear-gradient(135deg, #e0c3fc 0%, #b28dff 50%, #6a4bbf 100%)', ['#b28dff', '#6a4bbf']],
  deniz: ['Deniz', 'linear-gradient(180deg, #a1ffce 0%, #2bc0e4 45%, #1d6fa3 100%)', ['#2bc0e4', '#1d6fa3']],
  // Mağaza'dan indirilen temaların resimleri (indirilmeden Ayarlar'da görünmez)
  kapadokya: ['Kapadokya', svgWall(`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd7a8"/><stop offset=".6" stop-color="#ffb37a"/><stop offset="1" stop-color="#e98d5a"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/>
    <g fill="#e2533b"><circle cx="40" cy="22" r="7"/><circle cx="104" cy="14" r="5"/><circle cx="128" cy="34" r="4"/><circle cx="70" cy="40" r="3"/></g><g fill="#ffe08a"><path d="M40 15v14M37 16q3 6 0 12M43 16q-3 6 0 12" stroke="#ffe08a" stroke-width="1" fill="none"/><rect x="38" y="31" width="4" height="3"/><rect x="102.5" y="20" width="3" height="2"/><rect x="127" y="39" width="2.4" height="1.6"/><rect x="69" y="44" width="2" height="1.4"/></g>
    <g fill="#c98b5e"><path d="M0 90V70q10-6 18 0 4-14 10 0 8-10 16 2 6-16 12 0 10-8 20 2 4-12 10 0 12-6 22 4 6-14 12-2 10-6 18 4 6-8 22-2V90z"/></g><g fill="#a86a43"><path d="M22 90l6-26 6 26zM54 90l5-22 5 22zM96 90l6-28 6 28zM132 90l5-20 5 20z"/><circle cx="28" cy="64" r="2.4"/><circle cx="59" cy="68" r="2"/><circle cx="102" cy="62" r="2.6"/><circle cx="137" cy="70" r="2"/></g>`), ['#ffb37a', '#a86a43'], true],
  lale: ['Lale Bahçesi', svgWall(`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset=".55" stop-color="#e9f7ff"/><stop offset=".56" stop-color="#7cc36b"/><stop offset="1" stop-color="#3f8f3a"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/>
    ${Array.from({ length: 22 }, (_, i) => { const x = 6 + i * 7 + (i % 3), y = 58 + (i % 4) * 7, c = ['#e53950', '#ffcf3f', '#e05bb1', '#ff7a2f'][i % 4]; return `<path d="M${x} ${y + 12}V${y + 3}" stroke="#2f7a2e" stroke-width="1"/><path d="M${x - 2.4} ${y}q0 4 2.4 4 2.4 0 2.4-4l-1.2 1.4-1.2-1.8-1.2 1.8z" fill="${c}"/>`; }).join('')}`), ['#e53950', '#3f8f3a'], true],
  bogaz: ['Boğaz', svgWall(`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26315e"/><stop offset=".45" stop-color="#d9686a"/><stop offset=".58" stop-color="#f7b267"/><stop offset=".6" stop-color="#2a3f6e"/><stop offset="1" stop-color="#16234a"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/>
    <circle cx="118" cy="50" r="6" fill="#ffd79a"/><g fill="#1b2240"><path d="M0 54h38v-6h4v-3a4 4 0 0 1 8 0v3h4v-8h1v8h3v6h20v-4a5 5 0 0 1 10 0v4h6V40h1v14h2v6H0z"/></g>
    <path d="M60 50Q95 30 130 50M60 50v-14M130 50v-14M60 36Q95 52 130 36" stroke="#e8e8f0" stroke-width=".7" fill="none"/><path d="M50 50h90" stroke="#e8e8f0" stroke-width="1"/><g stroke="#ffd79a55" stroke-width=".5"><path d="M106 64h24M110 70h16M113 76h10"/></g>`), ['#d9686a', '#16234a'], true],
  kis: ['Karlı Dağlar', svgWall(`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8de"/><stop offset="1" stop-color="#e9f2fa"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/>
    <path d="M0 70L30 34l14 16 22-30 26 34 18-18 50 34v20H0z" fill="#5b7fa6"/><path d="M30 34l-6 7 6-2 4 3 5-1zM66 20l-8 11 5-2 4 4 5-3 6 2zM110 36l-5 5 5-1 3 2 4-1z" fill="#fff"/><path d="M0 78q40-10 80 0t80-4v16H0z" fill="#fff"/>
    <g fill="#fff">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 37) % 160}" cy="${(i * 23) % 70}" r="${0.4 + (i % 3) * 0.3}"/>`).join('')}</g>`), ['#5b7fa6', '#e9f2fa'], true],
  uzay: ['Uzay', 'radial-gradient(circle at 75% 30%, #f6c177 0 4%, #c27c2c 6%, transparent 6.4%), radial-gradient(circle at 10% 20%, #fff9 0 1px, transparent 2px) 0 0/70px 70px, radial-gradient(circle at 60% 80%, #fff6 0 1px, transparent 2px) 0 0/110px 110px, radial-gradient(ellipse at 30% 80%, #5b2a86 0%, transparent 60%), linear-gradient(180deg, #05051a, #12123a)', ['#12123a', '#05051a'], true],
  yayla: ['Karadeniz Yaylası', 'radial-gradient(ellipse at 30% 100%, #2e7d32 0 30%, transparent 30.5%), radial-gradient(ellipse at 80% 105%, #1b5e20 0 35%, transparent 35.5%), linear-gradient(180deg, #cfe8ef 0%, #a9d3c9 45%, #6fae7a 70%, #3f7f46 100%)', ['#a9d3c9', '#3f7f46'], true],
};

function svgWall(inner) {
  // Tek tırnak: bu değer HTML'de style="…" içine de yazılıyor
  return `center/cover no-repeat url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${inner}</svg>`).replace(/'/g, '%27')}')`;
}

// Temalar: arka plan + vurgu rengi + açık/koyu mod birlikte. store: Mağaza'dan indirilir.
export const THEMES = {
  windows: { name: 'Windows (açık)', wall: 'mavi', accent: '#0a5dc2', dark: false },
  koyu: { name: 'Windows (koyu)', wall: 'gece', accent: '#4c9be8', dark: true },
  gunbatimi: { name: 'Gün batımı', wall: 'gunbatimi', accent: '#c4314b', dark: false },
  orman: { name: 'Orman', wall: 'orman', accent: '#2e7d32', dark: false },
  lavanta: { name: 'Lavanta', wall: 'lavanta', accent: '#7a3fc4', dark: false },
  deniz: { name: 'Deniz', wall: 'deniz', accent: '#0e7490', dark: false },
  kapadokya: { name: 'Kapadokya', wall: 'kapadokya', accent: '#c25a0a', dark: false, store: true, size: '14 MB', desc: 'Peribacaları ve gün doğumunda sıcak hava balonları.' },
  lale: { name: 'Lale Bahçesi', wall: 'lale', accent: '#c2185b', dark: false, store: true, size: '9 MB', desc: 'İlkbaharda rengârenk lale bahçesi.' },
  bogaz: { name: 'Boğaz', wall: 'bogaz', accent: '#3a7bd5', dark: true, store: true, size: '12 MB', desc: 'Gün batımında köprü ve kıyı. Koyu modla gelir.' },
  kis: { name: 'Karlı Dağlar', wall: 'kis', accent: '#3a6ea5', dark: false, store: true, size: '11 MB', desc: 'Kar yağarken sessiz dağlar.' },
  uzay: { name: 'Uzay', wall: 'uzay', accent: '#8b5cf6', dark: true, store: true, size: '30 MB', desc: 'Yıldızlar ve bir gezegen. Koyu modla gelir.' },
  yayla: { name: 'Karadeniz Yaylası', wall: 'yayla', accent: '#15803d', dark: false, store: true, size: '16 MB', desc: 'Sisli yayla ve yemyeşil çimenler.' },
};
export const ACCENTS = [['Mavi', '#0a5dc2'], ['Lacivert', '#1f3d8a'], ['Turkuaz', '#00838f'], ['Yeşil', '#2e7d32'], ['Turuncu', '#c25a0a'], ['Kırmızı', '#c4314b'], ['Pembe', '#c2185b'], ['Mor', '#7a3fc4'], ['Gri', '#5f6b7a']];

const CELL_W = 6.2, CELL_H = 5.7; // em
const PINNED = ['explorer', 'browser'];

import { KB, mapKey } from './keymap.js';
// Dokunmatik ekranda (dokunmatik.js body'ye 'touch' koyar) yazı kutuları kendiliğinden seçilmez
const touchOnly = () => document.body.classList.contains('touch');

const DEFAULT_SETTINGS = () => ({
  wallpaper: 'mavi', customWall: null, volume: 50, muted: false, brightness: 100, wifi: true, network: 'EvAğı',
  knownNetworks: ['EvAğı'], autoTime: true, timeOffset: 0, tz: 'İstanbul (UTC+3)', textScale: 100, dark: false,
  user: 'Öğrenci', password: '1234', printers: ['PDF olarak kaydet'], installed: [], unknownDevice: true,
  theme: 'windows', accent: '#0a5dc2', accentBars: false, accentTitle: false, transparency: true, themes: [], startupOff: [], ext: {}, popupBlock: false,
  swapButtons: false, dblSpeed: 5, cursorSize: 'normal', cursorColor: 'white', magnifier: false, magZoom: 200,
  bluetooth: true, btDevices: [], airplane: false, pin: '',
  kbLayout: 'trq', kbList: ['trq', 'eng'], time24: true, powerPlan: 'dengeli', screenOff: 10, sleepAfter: 30, blockThird: false,
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
            <button type="button" class="tb-tv" title="Görev Görünümü: açık pencereler ve sanal masaüstleri (⊞ + Tab)"><i></i><i></i></button>
            <div class="tb-apps"></div>
          </div>
          <div class="tb-tray">
            <button type="button" class="tb-usb" hidden title="USB Bellek: güvenle kaldır">💾</button>
            <button type="button" class="tb-lang" title="Giriş dili ve klavye düzeni"></button>
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
      // Kaydedilen dosyalar Dosya Gezgini'nin “Son kullanılan dosyalar” listesine girer
      if (op === 'write' && node?.type === 'file' && node.parent !== 'downloads') this.touchRecent(node.id);
      this.renderIcons();
      this.emit('fs', { op, node, id: node?.id, name: node?.name, parent: node?.parent });
      this.wins.forEach((w) => w.api?.onFs?.(op, node));
      root.querySelector('.tb-usb').hidden = !this.fs.usb;
    });
    this.bindIcons();
    this.bindTaskbar();
    this.bindKeys();
    // Büyüteç açıkken görüntü fare işaretçisini izler
    root.addEventListener('pointermove', (e) => {
      if (!this.root.classList.contains('dk-magnified')) return;
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left - root.clientLeft - this.screen.offsetLeft, y = e.clientY - r.top - root.clientTop - this.screen.offsetTop;
      this.screen.style.transformOrigin = `${x}px ${y}px`;
    });
    this.tick();
    setInterval(() => this.tick(), 10000);
    setInterval(() => this.checkAlarms(), 1000);
    this.vdesks = ['Masaüstü 1']; // sanal masaüstleri
    this.vd = 0;
    // Ekran klavyesi: son yazı yazılan yer (odak klavye penceresine geçmez)
    root.addEventListener('focusin', (e) => {
      const t = e.target;
      if (t.closest('.win[data-app="osk"]')) return;
      if (t.matches('textarea, input:not([type]), input[type="text"], input[type="search"], input[type="password"], [contenteditable="true"]')) this.lastInput = t;
    });
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
    this.screen.querySelectorAll('.dk-uac, .dk-snip, .dk-switch, .dk-secure, .dk-phone, .dk-modem').forEach((x) => x.remove());
    this.modem?.remove?.(); this.modem = null; this.hotspot = false;
    this.phoneEl = null;
    this.snipping = false;
    this.dialogs.closeAll();
    this.closeAssist(); this.hideLayouts(); this.snapPreview(null);
    for (const w of [...this.wins]) this.destroy(w);
    this.fs.reset();
    this.mail = null; // e-posta kutusu ilk açılışta baştan kurulur
    this.bookmarks = []; // tarayıcının sık kullanılanları
    this.webNotes = {}; // tarayıcıdaki Yapışkan Not uzantısının notları
    this.vdesks = ['Masaüstü 1']; this.vd = 0;
    this.lastInput = null;
    this.dictation(false, true); this.dictIdx = 0; this.root.querySelector('.tb-mic')?.remove();
    this.screen.querySelector('.dk-tv')?.remove();
    this.history = []; // tarayıcı geçmişi
    this.recent = []; // Dosya Gezgini → Giriş: son kullanılan dosyalar
    this.dlList = []; // tarayıcının İndirilenler listesi (Ctrl + J)
    this.webState = {}; // sitelerin durumu (giriş yapılmış mı, sepet, görüşme); önceki dersten kalmasın
    this.sitePerms = {}; // sitelere verilen kamera, mikrofon, bildirim izinleri
    this.textClip = null;
    this.cookies = []; // sitelerin bıraktığı çerezler (üçüncü taraf takip çerezleri dahil)
    this.stopped = null; // Görev Yöneticisinden sonlandırılan arka plan işlemleri
    this.sec = null; // Windows Güvenliği: disk doluluğu, güvenlik duvarı, tarama bilgisi
    this.stickies = []; // Yapışkan Notlar
    this.alarms = []; // Saat uygulamasındaki alarmlar: { id, time: 'SS:DD', label, on }
    this.timers = []; // zamanlayıcılar: { end, label }
    this.calEvents = []; // Takvim'deki randevular (hatırlatıcılı)
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
            <div class="pw-pass"><input type="password" placeholder="${this.settings.pin ? 'PIN ya da şifre' : 'Şifre'}" autocomplete="off" aria-label="Şifre"><button type="button" class="pw-eye" title="Şifreyi göster">👁</button><button type="button" class="pw-go" title="Giriş">➜</button></div>
            <div class="pw-err"></div><div class="pw-hint">Alıştırma şifresi: <b>${esc(this.settings.password)}</b>${this.settings.pin ? ` · PIN: <b>${esc(this.settings.pin)}</b>` : ''}</div></div></div>`;
        const inp = o.querySelector('input');
        const go = () => {
          const ok = inp.value === this.settings.password || (!!this.settings.pin && inp.value === this.settings.pin);
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
    const noNet = s.netSim && s.wifi && s.network && !online(this); // Wi-Fi'ye bağlı ama internet yok
    this.root.querySelector('.tb-wifi').textContent = s.airplane ? '✈' : s.wifi && s.network ? (noNet ? '🌐' : '📶') : '🚫';
    this.root.querySelector('.tb-net').title = noNet ? `${s.network}: İnternet erişimi yok` : 'Ağ ve ses';
    this.root.querySelector('.tb-net').classList.toggle('nonet', !!noNet);
    this.root.querySelector('.tb-vol').textContent = s.muted || !s.volume ? '🔇' : s.volume < 40 ? '🔈' : '🔊';
    this.root.classList.toggle('dk-dark', !!s.dark);
    this.root.style.setProperty('--dk-acc', s.accent || '#0a5dc2');
    this.root.classList.toggle('tb-left', !!s.taskbarLeft);
    this.root.classList.toggle('dk-accbars', !!s.accentBars); // vurgu rengi Başlat menüsünde ve görev çubuğunda
    this.root.classList.toggle('dk-acctitle', !!s.accentTitle); // vurgu rengi etkin pencerenin başlık çubuğunda
    this.root.classList.toggle('dk-notrans', s.transparency === false); // saydamlık efektleri kapalı
    const lang = this.root.querySelector('.tb-lang');
    if (lang) { lang.textContent = KB[s.kbLayout]?.[0] || 'TUR'; lang.title = `Giriş dili: ${KB[s.kbLayout]?.[1] || ''}. Değiştirmek için tıklayın ya da Alt + Shift`; }
    this.applyCursor();
    this.applyMagnifier();
    this.tick();
  }

  // Ekranı kilitle (Win + L, Başlat → hesap → Kilitle, Ayarlar → Hesaplar): programlar açık kalır
  lockScreen(via = 'key') {
    if (this.power !== 'desktop') return;
    this.emit('screen-lock', { via });
    this.setPower('lock');
    // Kilit açılınca (login → welcome → desktop) pencereler yerinde kalır; setPower('lock') pencereleri yok etmez
  }

  // Uçak modu: Wi-Fi ve Bluetooth birlikte kapanır; kapatılınca Wi-Fi geri gelir
  setAirplane(on) {
    const s = this.settings;
    s.airplane = on;
    if (on) { s.wifi = false; s.network = null; s.bluetooth = false; s.btDevices = []; }
    else { s.wifi = true; s.network = s.knownNetworks[0] || null; }
    this.applySettings();
    this.emit('airplane', { on });
    this.wins.forEach((w) => w.api?.onSettings?.());
  }

  // Fare işaretçisi: boyut ve renk (Ayarlar → Erişilebilirlik)
  applyCursor() {
    const s = this.settings;
    const custom = s.cursorSize !== 'normal' || s.cursorColor !== 'white';
    this.root.classList.toggle('dk-cur', custom);
    if (!custom) return;
    const px = { normal: 24, big: 40, huge: 64 }[s.cursorSize];
    const fill = { white: '#fff', black: '#000', yellow: '#ffd600', green: '#2e7d32' }[s.cursorColor];
    const edge = s.cursorColor === 'black' ? '#fff' : '#000';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"><path d="M3 2v18l5-4.5 3.5 7.5 3-1.4-3.5-7.3H19z" fill="${fill}" stroke="${edge}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
    this.root.style.setProperty('--dk-cursor', `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 2, auto`);
  }

  // Büyüteç: ekranı fare işaretçisinin çevresinde yakınlaştırır
  applyMagnifier() {
    const s = this.settings;
    const on = !!s.magnifier && this.power === 'desktop';
    this.screen.style.transform = on ? `scale(${s.magZoom / 100})` : '';
    if (!on) this.screen.style.transformOrigin = '';
    this.root.classList.toggle('dk-magnified', on);
    let bar = this.root.querySelector('.dk-magbar');
    if (!on) { bar?.remove(); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'dk-magbar';
      bar.innerHTML = '<span>🔍 Büyüteç</span><button type="button" data-m="-" title="Uzaklaştır">−</button><b></b><button type="button" data-m="+" title="Yakınlaştır">＋</button><button type="button" data-m="x" title="Büyüteci kapat">✕</button>';
      bar.onclick = (e) => {
        const m = e.target.closest('[data-m]')?.dataset.m;
        if (!m) return;
        if (m === 'x') this.setSetting('magnifier', false);
        else this.setSetting('magZoom', Math.max(150, Math.min(400, this.settings.magZoom + (m === '+' ? 50 : -50))));
        this.emit('magnifier', { on: this.settings.magnifier, zoom: this.settings.magZoom });
      };
      this.root.append(bar);
    }
    bar.querySelector('b').textContent = '%' + s.magZoom;
  }

  // ⊞ + artı / eksi / Esc ve Başlat'tan Büyüteç: açar, bir kademe büyütür ya da küçültür (step 1 / -1), kapatır (step 0)
  magnify(step) {
    const s = this.settings;
    if (step === 0) { if (!s.magnifier) return; this.setSetting('magnifier', false); }
    else if (!s.magnifier) { if (step < 0) return; this.setSetting('magnifier', true); }
    else this.setSetting('magZoom', Math.max(150, Math.min(400, s.magZoom + step * 50)));
    this.emit('magnifier', { on: this.settings.magnifier, zoom: this.settings.magZoom });
  }

  // ------------------------------------------------------------------ Sesle yazma (⊞ + H)
  // Benzetim: gerçek mikrofon ve ses tanıma yok. Şeritteki “Konuş” düğmesi, söylenmiş gibi hazır bir cümleyi harf harf yazar.
  // Olaylar: 'dictation' { on, field }, 'dictation-text' { text, value }, 'dictation-nofield'
  dictation(on = !this.screen.querySelector('.dk-dict'), quiet) {
    let bar = this.screen.querySelector('.dk-dict');
    if (!on) {
      clearInterval(this.dictTimer); this.dictTimer = null;
      if (!bar) return;
      bar.remove();
      if (!quiet) this.emit('dictation', { on: false });
      return;
    }
    if (bar) return;
    const live = () => (this.lastInput?.isConnected && this.lastInput.offsetParent ? this.lastInput : null);
    bar = document.createElement('div');
    bar.className = 'dk-dict';
    bar.style.cssText = 'position:absolute;left:50%;top:0.6em;transform:translateX(-50%);z-index:8500;background:#202124f2;color:#fff;border-radius:1.6em;padding:0.45em 0.9em;display:flex;align-items:center;gap:0.7em;font-size:0.95em;box-shadow:0 4px 14px #0007;max-width:96%;flex-wrap:wrap;justify-content:center';
    const bs = 'border:0;border-radius:1.4em;padding:0.4em 0.9em;font:inherit;cursor:pointer;color:#fff;background:#ffffff2e';
    bar.innerHTML = `<button type="button" class="dd-mic" title="Mikrofon: durdurmak için tıklayın (⊞ + H)" style="border:0;border-radius:50%;width:2.4em;height:2.4em;font-size:1em;cursor:pointer;background:#d13438;color:#fff">🎤</button>
      <div style="min-width:12em"><b class="dd-st">Dinliyor…</b><div class="dd-cap" style="font-size:0.85em;opacity:0.85;min-height:1.2em"></div></div>
      <button type="button" class="dd-say" style="${bs}">🗣 Konuş (benzetim)</button>
      <div style="flex-basis:100%;text-align:center;font-size:0.78em;opacity:0.75">Bu bir benzetimdir: gerçek bilgisayarda mikrofona konuşursunuz.</div>`;
    // Düğmelere basınca yazı alanı odağı kaybetmesin
    bar.addEventListener('mousedown', (e) => e.preventDefault());
    const st = bar.querySelector('.dd-st'), cap = bar.querySelector('.dd-cap'), say = bar.querySelector('.dd-say');
    const status = () => { st.textContent = live() ? 'Dinliyor…' : 'Önce bir yazı alanına tıklayın'; };
    status();
    this.screen.append(bar);
    bar.querySelector('.dd-mic').onclick = () => this.dictation(false);
    // (said: söylediğiniz, written: ekrana gelen; yanlış anlama örneği için ikincisinde “elmas”)
    const LINES = [
      ['yarın saat onda doktora gideceğim nokta', 'Yarın saat onda doktora gideceğim.'],
      ['sonra pazardan elma alacağım nokta', 'Sonra pazardan elmas alacağım.'],
      ['teşekkürler virgül görüşürüz nokta', 'Teşekkürler, görüşürüz.'],
    ];
    say.onclick = () => {
      if (this.dictTimer) return;
      const t = live();
      status();
      if (!t) { this.emit('dictation-nofield'); return; }
      if (t.matches('input[type="password"]')) { cap.textContent = 'Şifre alanına konuşarak yazılmaz.'; return; }
      const [said, written] = LINES[(this.dictIdx ||= 0) % LINES.length];
      this.dictIdx++;
      cap.textContent = `Dediniz: “${said}”`;
      t.focus({ preventScroll: true });
      const before = t.value ?? t.textContent ?? '';
      const pos = t.selectionStart ?? before.length;
      const text = pos > 0 && !/\s/.test(before[pos - 1]) ? ' ' + written : written;
      let i = 0;
      say.disabled = true; say.style.opacity = '0.5';
      this.dictTimer = setInterval(() => {
        if (!t.isConnected) { this.dictation(false); return; }
        if (document.activeElement !== t) t.focus({ preventScroll: true });
        document.execCommand('insertText', false, text[i++]);
        if (i >= text.length) {
          clearInterval(this.dictTimer); this.dictTimer = null;
          say.disabled = false; say.style.opacity = '';
          this.emit('dictation-text', { text, value: t.value ?? t.textContent ?? '' });
        }
      }, 45);
    };
    this.emit('dictation', { on: true, field: !!live() });
  }

  // Sesle yazma dersi için görev çubuğunda 🎤 düğmesi (tarayıcı ⊞ + H tuşunu alamazsa buradan açılır)
  dictationButton(show) {
    const tray = this.root.querySelector('.tb-tray');
    let b = tray.querySelector('.tb-mic');
    if (!show) { b?.remove(); return; }
    if (b) return;
    b = document.createElement('button');
    b.type = 'button'; b.className = 'tb-mic'; b.textContent = '🎤';
    b.title = 'Sesle yazma (⊞ + H)';
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.onclick = () => this.dictation();
    tray.prepend(b);
  }

  applyTheme(key) {
    const th = THEMES[key];
    if (!th) return;
    Object.assign(this.settings, { theme: key, wallpaper: th.wall, customWall: null, accent: th.accent, dark: th.dark });
    this.applySettings();
    this.emit('theme', { key, name: th.name });
    this.wins.forEach((w) => w.api?.onSettings?.());
  }

  setSetting(key, value) {
    // Temanın bir parçası tek başına değişince tema “Özel” olur (Windows'taki gibi)
    if (['wallpaper', 'accent', 'dark'].includes(key)) this.settings.theme = 'custom';
    this.settings[key] = value;
    this.applySettings();
    this.emit('setting', { key, value });
    this.wins.forEach((w) => w.api?.onSettings?.());
  }

  now() {
    const d = new Date(Date.now() + (this.settings?.timeOffset || 0));
    return d;
  }

  // Alarm ve zamanlayıcı: Saat uygulaması kapalıyken de çalar
  checkAlarms() {
    if (this.power !== 'desktop') return;
    const d = this.now();
    const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    for (const a of [...(this.alarms || [])]) {
      if (!a.on || a.time !== hm || a.last === `${d.getDate()}${hm}`) continue;
      a.last = `${d.getDate()}${hm}`;
      this.ring(a.label || 'Alarm', a.time, '⏰', a);
      if (a.once) this.alarms = this.alarms.filter((x) => x !== a); // ertelenen alarm bir kez çalar
      this.emit('alarm-ring', { time: a.time, label: a.label });
    }
    // Takvim randevusu: hatırlatma saati gelince bir kez bildirim çıkar (randevu saati geçmişse çıkmaz)
    const nowMs = d.getTime();
    for (const e of this.calEvents || []) {
      if (!e.time || e.remind == null || e.fired) continue;
      const [y, mo, da] = e.date.split('-').map(Number), [h, mi] = e.time.split(':').map(Number);
      const start = new Date(y, mo - 1, da, h, mi).getTime();
      if (nowMs < start - e.remind * 60000) continue;
      e.fired = true;
      if (nowMs > start + 60000) continue;
      this.ring(e.title, e.remind ? `${e.time} · ${e.remind} dakika sonra` : `${e.time} · şimdi`, '📅');
      this.emit('cal-remind', { title: e.title, time: e.time });
    }
    const now = Date.now();
    for (const t of [...(this.timers || [])]) {
      if (t.end > now) continue;
      this.timers.splice(this.timers.indexOf(t), 1);
      this.ring(t.label, 'Süre doldu', '⏳');
      this.emit('timer-ring', { label: t.label });
    }
    this.wins.forEach((w) => w.api?.onAlarm?.());
  }

  // alarm verilirse bildirimde "Ertele (5 dk)" düğmesi çıkar: aynı alarm 5 dakika sonra bir kez daha çalar
  ring(title, text, icon, alarm) {
    const t = this.toast(title, `${text}${alarm ? '<div class="to-btns"><button type="button" data-snooze="1">💤 Ertele (5 dk)</button></div>' : ''}`, icon, alarm ? 45000 : 12000);
    playTune(this, [880, 660, 880, 660, 880], 0.22);
    if (alarm) {
      t.addEventListener('click', (e) => {
        if (!e.target.closest('[data-snooze]')) return;
        const d = new Date(this.now().getTime() + 5 * 60e3);
        this.alarms.push({ id: 'a' + Date.now(), time: `${pad(d.getHours())}:${pad(d.getMinutes())}`, label: `${alarm.label || 'Alarm'} (ertelendi)`, on: true, once: true });
        t.remove();
        this.emit('alarm-snooze', { label: alarm.label });
      });
    }
    return t;
  }

  tick() {
    if (!this.root.querySelector('.tb-time')) return;
    const d = this.now();
    this.root.querySelector('.tb-time').textContent = this.settings.time24 === false ? `${pad(d.getHours() % 12 || 12)}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'ÖÖ' : 'ÖS'}` : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    const ids = (c?.ids || [c?.id]).filter((x) => x && this.fs.get(x));
    if (!ids.length) return;
    const names = ids.map((x) => this.fs.get(x).name);
    for (const id of ids) { if (c.op === 'cut') this.fs.move(id, target); else this.fs.copy(id, target); }
    if (c.op === 'cut') this.fileClip = null;
    this.emit('file-paste', { op: c.op, name: names[0], names, count: ids.length, to: target, toName: this.fs.label(target) });
  }

  // Masaüstündeki bir öğeyi aç (çift tık)
  openItem(id) {
    if (id === 'sys:pc') return this.open('explorer', { folder: 'pc' });
    if (id === 'sys:recycle') return this.open('explorer', { folder: RECYCLE });
    return this.openNode(this.fs.get(id));
  }

  // Son açılan / kaydedilen dosyalar (en yenisi başta)
  touchRecent(id) { this.recent = [id, ...(this.recent || []).filter((x) => x !== id)].slice(0, 20); }

  openNode(n) {
    if (!n) return null;
    if (n.type === 'file') this.touchRecent(n.id);
    if (n.type === 'link' && n.target) {
      // Dosya ya da klasör kısayolu: asıl öğeyi açar. Asıl öğe silinmişse kısayol çalışmaz.
      const t = this.fs.get(n.target);
      if (!t || this.fs.inRecycle(t.id)) { this.toast('Kısayol sorunu', `“${esc(n.name)}” kısayolunun gösterdiği öğe silinmiş. Kısayol yalnızca bir yol gösterici; asıl dosya gidince açılmaz.`, '⚠', 7000); this.emit('shortcut-broken', { name: n.name }); return null; }
      this.emit('shortcut-open', { name: n.name, target: t.name });
      return this.openNode(t);
    }
    if (n.type === 'link') return this.open(n.app, n.args);
    if (n.type === 'folder') return this.open('explorer', { folder: n.id });
    const name = n.name.toLowerCase();
    if (name.endsWith('.txt')) return this.open('notepad', { node: n.id });
    if (name.endsWith('.docx')) return this.open('word', { node: n.id });
    if (name.endsWith('.xlsx')) return this.open('sheet', { node: n.id });
    if (name.endsWith('.pptx')) return this.open('slides', { node: n.id });
    if (/\.(jpe?g|png|bmp)$/.test(name)) return this.open(this.settings.installed.includes('viewer') ? 'viewer' : 'photos', { node: n.id });
    if (name.endsWith('.mp4')) return this.open('photos', { node: n.id });
    if (name.endsWith('.zip')) return this.extractZip(n, true);
    if (name.endsWith('.exe')) return this.runSetup(n);
    if (name.endsWith('.pdf')) {
      // Aynı PDF zaten açıksa yenisini açmayız, açık olanı öne getiririz (ders olayı yine gelsin diye app-open bildirilir)
      const ex = this.wins.find((w) => w.app === 'pdf' && w.args?.node === n.id);
      if (ex) { if (ex.min) this.restore(ex); else this.focus(ex); this.emit('app-open', { app: 'pdf', win: ex.id, args: { node: n.id }, again: true }); return ex; }
      return this.open('pdf', { node: n.id });
    }
    if (/\.html?$/.test(name)) return this.open('browser', { file: n.id });
    if (/\.(mp3|m4a|wav)$/.test(name)) return this.open('music', { node: n.id });
    this.toast('Açılamadı', 'Bu dosyayı açacak bir program yok.', '⚠');
    return null;
  }

  // Sıkıştırılmış klasörü ayıklama: içindekiler aynı yerde, zip'in adını taşıyan yeni bir klasöre çıkar
  async extractZip(n, opened) {
    const list = n.content?.zip || [];
    const into = n.name.replace(/\.zip$/i, '');
    const a = await this.dialogs.ask({ title: 'Sıkıştırılmış (zip) Klasörleri Ayıkla', icon: '🗜', text: `${opened ? `<b>${esc(n.name)}</b> sıkıştırılmış bir klasördür. İçindekileri rahatça kullanmak için önce ayıklayın.<br><br>` : ''}İçindekiler (${list.length}): ${list.map((x) => esc(x.name)).join(', ')}<br><br>Dosyalar şu klasöre çıkarılacak:<br><b>${esc(this.fs.path(n.parent).map((x) => x.name).join(' › '))} › ${esc(into)}</b>`, buttons: [['yes', 'Ayıkla', true], ['no', 'İptal']] });
    this.emit('zip-ask', { name: n.name, answer: a });
    if (a !== 'yes') return null;
    const f = this.fs.extract(n.id, n.parent, this.fs.uniqueName(n.parent, into));
    this.emit('zip-extract', { name: n.name, folder: f.id, count: list.length });
    return this.open('explorer', { folder: f.id });
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
    // Birden çok seçili dosya birlikte sürüklendi
    if (p.ids?.length > 1) {
      const ids = p.ids.filter((x) => this.fs.get(x) && x !== folder);
      if (folder === node.parent) { this.emit('drop', { id, name, to: folder, same: true }); return; }
      if (folder === RECYCLE) { ids.forEach((x) => this.deleteNode(x)); this.emit('drop', { id, name, ids, count: ids.length, to: RECYCLE, toName: 'Geri Dönüşüm Kutusu', op: 'delete' }); return; }
      const op = this.crossDrive(node.parent, folder) ? 'copy' : 'move';
      for (const x of ids) { const err = op === 'copy' ? (this.fs.copy(x, folder), '') : this.fs.move(x, folder); if (err) { this.toast('Taşınamadı', err, '⚠'); return; } }
      if (op === 'copy') this.toast('Kopyalandı', `${ids.length} öğe → ${this.fs.label(folder)}`, '📋');
      this.emit('drop', { id, name, ids, count: ids.length, names: ids.map((x) => this.fs.get(x)?.name), to: folder, toName: this.fs.label(folder), op });
      return;
    }
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
      if (!e.target.closest('.dk-ctx, .dk-start, .tb-start, .tb-search, .dk-winx, .dk-quick, .tb-net, .tb-clock')) this.closeMenus();
      if (!e.target.closest('.dk-assist')) this.closeAssist();
      if (!e.target.closest('.dk-layouts, .wb-max')) this.hideLayouts();
    });
    $('.tb-start').onclick = () => this.toggleStart();
    $('.tb-start').oncontextmenu = (e) => { e.preventDefault(); this.winxMenu(); };
    $('.tb-search').onclick = () => this.toggleStart(true, true);
    $('.tb-tv').onclick = () => this.taskView();
    $('.tb-showdesk').onclick = () => {
      const vis = this.wins.filter((w) => !w.min && w.vd === this.vd);
      if (vis.length) { this.hiddenByShow = vis; vis.forEach((w) => this.minimize(w, true)); }
      else (this.hiddenByShow || []).forEach((w) => this.wins.includes(w) && this.restore(w, true));
      this.emit('show-desktop', { hidden: vis.length });
    };
    $('.tb-net').onclick = () => this.toggleQuick();
    $('.tb-usb').onclick = () => {
      this.menu($('.tb-usb').getBoundingClientRect().left, $('.tb-usb').getBoundingClientRect().top - 60,
        [{ cmd: 'eject', label: '⏏ USB Belleği çıkar' }], () => this.ejectUsb(), 'usb');
    };
    $('.tb-clock').onclick = () => this.toggleCalendar();
    $('.tb-clock').oncontextmenu = (e) => {
      e.preventDefault();
      this.menu(e.clientX - 60, e.clientY - 56, [{ cmd: 'time', label: '🕒 Tarih ve saati ayarla' }], () => this.open('settings', { page: 'time' }), 'clock');
    };
    $('.tb-lang').onclick = () => {
      const r = $('.tb-lang').getBoundingClientRect();
      this.menu(r.left - 150, r.top - (this.settings.kbList.length * 40 + 12), this.settings.kbList.map((id) => ({ cmd: id, label: `${this.settings.kbLayout === id ? '✔' : '\u2003'} <b>${KB[id][0]}</b> ${KB[id][1]}` })), (id) => this.setKbLayout(id, 'menu'), 'lang');
    };
    // Görev çubuğuna sağ tık: boş yerde Görev Yöneticisi, uygulama düğmesinde pencereyi kapat
    $('.dk-taskbar').addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (e.target.closest('.tb-start, .tb-clock')) return; // başlat ve saatin kendi menüsü var
      const b = e.target.closest('.tb-apps [data-app]');
      if (b) {
        const app = b.dataset.app, list = this.wins.filter((w) => w.app === app);
        this.menu(e.clientX, e.clientY - (list.length ? 110 : 75), [{ cmd: 'open', label: `${APPS[app].icon} ${APPS[app].name}` }, '-',
          ...(list.length ? [{ cmd: 'close', label: list.length > 1 ? 'Tüm pencereleri kapat' : 'Pencereyi kapat' }] : []), { cmd: 'taskmgr', label: '📊 Görev Yöneticisi' }],
        (c) => (c === 'open' ? this.open(app) : c === 'taskmgr' ? this.open('taskmgr') : list.forEach((w) => this.close(w))), 'taskbar-app', { app });
        return;
      }
      this.menu(e.clientX, e.clientY - 75, [{ cmd: 'taskmgr', label: '📊 Görev Yöneticisi' }, { cmd: 'settings', label: '⚙ Görev çubuğu ayarları' }],
        (c) => (c === 'taskmgr' ? this.open('taskmgr') : this.open('settings', { page: 'personal' })), 'taskbar');
    });
    $('.tb-apps').addEventListener('click', (e) => {
      const b = e.target.closest('[data-app]');
      if (!b) return;
      const app = b.dataset.app;
      const list = this.wins.filter((w) => w.app === app && w.vd === this.vd);
      this.emit('taskbar-click', { app });
      if (!list.length) { this.open(app); return; }
      const w = list.find((x) => x === this.active) || list.at(-1);
      if (w.min) this.restore(w);
      else if (w === this.active) this.minimize(w);
      else this.focus(w);
    });
  }

  renderTaskbar() {
    const here = this.wins.filter((w) => w.vd === this.vd); // görev çubuğu yalnızca bu masaüstündeki pencereleri gösterir
    const apps = [...PINNED, ...here.map((w) => w.app).filter((a, i, arr) => !PINNED.includes(a) && arr.indexOf(a) === i)];
    this.root.querySelector('.tb-apps').innerHTML = apps.map((a) => {
      const ws = here.filter((w) => w.app === a);
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
        if (n === t) return 5; // tam ad ("hesap tablosu") anahtar sözcükten önce gelir
        if (n.startsWith(t)) return 4;
        if (n.split(' ').some((w) => w.startsWith(t))) return 3;
        if (n.includes(t)) return 2;
        const kw = APPS[a].keywords || [];
        return kw.includes(t) ? 1.5 : kw.some((k) => k.includes(t)) ? 1 : 0; // "excel" gibi tam anahtar sözcük, kısmi eşleşmeden önce
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
    // Dokunmatikte odak menünün kendisindedir: Esc yine kapatsın, yazılan harf aramaya gitsin
    el.onkeydown = (e) => {
      if (e.target !== el) return;
      if (e.key === 'Escape') this.closeMenus();
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) input.focus({ preventScroll: true });
    };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-app]');
      if (b) { this.closeMenus(); this.emit('start-open', { app: b.dataset.app, via: 'click' }); this.open(b.dataset.app); return; }
      if (e.target.closest('.st-power')) this.powerMenu(e.target.closest('.st-power'));
      const um = e.target.closest('.st-user');
      if (um) {
        const r = um.getBoundingClientRect();
        this.menu(r.left, r.top - 60, [{ cmd: 'settings', label: '⚙ Hesap ayarlarını değiştir' }, { cmd: 'lock', label: '🔒 Kilitle' }],
          (cmd) => { this.startEl.hidden = true; if (cmd === 'lock') this.lockScreen('start'); else this.open('settings', { page: 'accounts' }); }, 'startuser');
      }
    });
    // Windows'ta olduğu gibi Başlat açıkken doğrudan yazmaya başlamak arama yapar.
    // Dokunmatik ekranda ise kutu kendiliğinden seçilmez: yoksa her açılışta telefon klavyesi ekranı kaplar.
    if (touchOnly()) el.tabIndex = -1;
    const focusEl = touchOnly() && !focusSearch ? el : input;
    setTimeout(() => focusEl.focus({ preventScroll: true }), focusSearch ? 0 : 30);
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
      { cmd: 'apps', label: 'Yüklü uygulamalar' }, { cmd: 'devmgr', label: 'Aygıt Yöneticisi' }, { cmd: 'taskmgr', label: 'Görev Yöneticisi' }, { cmd: 'settings', label: 'Ayarlar' },
      { cmd: 'explorer', label: 'Dosya Gezgini' }, { cmd: 'search', label: 'Ara' }, '-',
      { cmd: 'power', label: 'Kapat veya oturumu kapat', sub: [{ cmd: 'sleep', label: 'Uyku' }, { cmd: 'shutdown', label: 'Kapat' }, { cmd: 'restart', label: 'Yeniden başlat' }] },
      { cmd: 'desktop', label: 'Masaüstü' },
    ];
    const b = this.root.querySelector('.tb-start').getBoundingClientRect();
    this.menu(b.left, b.top - 345, items, (cmd) => {
      if (cmd === 'apps') this.open('settings', { page: 'apps' });
      else if (cmd === 'devmgr') this.open('devmgr');
      else if (cmd === 'taskmgr') this.open('taskmgr');
      else if (cmd === 'settings') this.open('settings');
      else if (cmd === 'explorer') this.open('explorer');
      else if (cmd === 'search') this.toggleStart(true, true);
      else if (cmd === 'desktop') this.root.querySelector('.tb-showdesk').click();
      else this.powerAction(cmd);
    }, 'winx');
  }

  // Sağ alttaki saate tıklayınca açılan takvim
  toggleCalendar() {
    const q = this.root.querySelector('.dk-quick');
    if (!q.hidden && q.classList.contains('qk-cal')) { q.hidden = true; return; }
    this.closeMenus();
    const d = this.now(), y = d.getFullYear(), m = d.getMonth();
    const lead = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const cells = Array.from({ length: lead }, () => '<i></i>').concat(Array.from({ length: days }, (_, i) => `<span class="${i + 1 === d.getDate() ? 'today' : ''}">${i + 1}</span>`)).join('');
    q.classList.add('qk-cal');
    q.innerHTML = `<div class="ck-time">${this.root.querySelector('.tb-time').textContent}<small>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
      <div class="ck-head">${d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</div>
      <div class="ck-grid">${['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((n) => `<b>${n}</b>`).join('')}${cells}</div>
      <button type="button" class="qk-all">🕒 Tarih ve saat ayarları</button>`;
    q.hidden = false;
    this.emit('calendar', { open: true });
    q.querySelector('.qk-all').onclick = () => { q.hidden = true; this.open('settings', { page: 'time' }); };
  }

  // Giriş dili ve klavye düzeni (TUR Q, TUR F, ENG): görev çubuğundan, Alt + Shift ile ya da Ayarlar'dan
  setKbLayout(id, via = 'menu') {
    if (!this.settings.kbList.includes(id)) return;
    this.settings.kbLayout = id;
    this.applySettings();
    this.wins.forEach((w) => w.api?.onSettings?.());
    const t = this.toast(`${KB[id][0]}`, KB[id][1], '⌨', 1800);
    t.classList.add('dk-osd');
    this.emit('kb-layout', { layout: id, lang: KB[id][0], via });
  }

  cycleKb(via) {
    const l = this.settings.kbList, i = l.indexOf(this.settings.kbLayout);
    this.setKbLayout(l[(i + 1) % l.length], via);
  }

  // F ya da İngilizce düzende gerçek klavyedeki tuşun harfi değişir: yazı alanlarına doğru harf yazılır
  remapKey(e) {
    const el = e.target;
    if (!el?.matches?.('textarea, input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]), [contenteditable=""], [contenteditable="true"]')) return;
    const ch = mapKey(this.settings.kbLayout, e);
    if (ch == null) return;
    e.preventDefault();
    document.execCommand('insertText', false, ch);
  }

  toggleQuick() {
    const q = this.root.querySelector('.dk-quick');
    if (!q.hidden) { q.hidden = true; return; }
    this.closeMenus();
    q.classList.remove('qk-cal');
    const s = this.settings;
    q.innerHTML = `<div class="qk-row"><button type="button" class="qk-wifi ${s.wifi ? 'on' : ''}">📶<span>${s.wifi ? (s.network ? s.network + (s.netSim && !online(this) ? ' · İnternet yok' : '') : 'Bağlı değil') : 'Wi-Fi kapalı'}</span></button>
        <button type="button" class="qk-bt ${s.bluetooth ? 'on' : ''}">🔵<span>${s.bluetooth ? 'Bluetooth açık' : 'Bluetooth kapalı'}</span></button>
        <button type="button" class="qk-air ${s.airplane ? 'on' : ''}">✈<span>Uçak modu</span></button></div>
      <label class="qk-sl">☀ <input type="range" class="qk-bri" min="20" max="100" value="${s.brightness}"></label>
      <label class="qk-sl"><button type="button" class="qk-mute" title="Sesi kapat/aç">${s.muted ? '🔇' : '🔊'}</button><input type="range" class="qk-vol" min="0" max="100" value="${s.volume}"><b class="qk-vv">${s.volume}</b></label>
      <button type="button" class="qk-all">⚙ Tüm ayarlar</button>`;
    q.hidden = false;
    this.emit('quick', { open: true });
    q.querySelector('.qk-wifi').onclick = () => { this.setSetting('wifi', !s.wifi); if (!s.wifi) this.settings.network = null; else this.settings.network = this.settings.knownNetworks[0] || null; this.applySettings(); q.hidden = true; this.toggleQuick(); };
    q.querySelector('.qk-bt').onclick = () => { this.setSetting('bluetooth', !s.bluetooth); if (!s.bluetooth) this.settings.btDevices = []; this.emit('toggle', { key: 'bluetooth', on: s.bluetooth }); q.hidden = true; this.toggleQuick(); };
    q.querySelector('.qk-air').onclick = () => { this.setAirplane(!s.airplane); q.hidden = true; this.toggleQuick(); };
    q.querySelector('.qk-bri').oninput = (e) => this.setSetting('brightness', +e.target.value);
    q.querySelector('.qk-vol').oninput = (e) => { this.setSetting('volume', +e.target.value); q.querySelector('.qk-vv').textContent = e.target.value; if (s.muted) this.setSetting('muted', false); };
    q.querySelector('.qk-mute').onclick = (e) => { this.setSetting('muted', !s.muted); e.target.textContent = s.muted ? '🔇' : '🔊'; };
    q.querySelector('.qk-all').onclick = () => { q.hidden = true; this.open('settings'); };
  }

  // ------------------------------------------------------------------ Pencereler
  open(app, args = {}) {
    const def = APPS[app];
    if (!def) return null;
    if (def.launch) { def.launch(this, args); this.emit('app-open', { app, args }); return null; } // pencere açmayan araçlar (Büyüteç)
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
      id: 'w' + this.seq++, app, title: def.name, icon: def.icon, vd: this.vd,
      x: Math.round((W - w) / 2 + (n % 5) * 24 - 40), y: Math.max(6, Math.round((H - h) / 2 + (n % 5) * 22 - 30)), w, h, min: false, max: !!def.max || W < 600, args, // dar ekranda (telefon) pencereler tam ekran açılır
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
    if (def.noFocus) { win.el.style.zIndex = ++this.z + 1000; this.renderTaskbar(); } else this.focus(win, true);
    this.emit('app-open', { app, win: win.id, args });
    return win;
  }

  bindWin(win) {
    const el = win.el;
    // Ekran klavyesi gibi pencereler tıklanınca odağı almaz: yazı, yazılan yerde kalır
    if (APPS[win.app].noFocus) el.addEventListener('pointerdown', (e) => { if (!e.target.closest('input, select')) e.preventDefault(); });
    else el.addEventListener('pointerdown', () => { if (this.active !== win) this.focus(win); }, true);
    el.querySelector('.wb-min').onclick = () => this.minimize(win);
    el.querySelector('.wb-max').onclick = () => { this.hideLayouts(); if (win.max) this.restoreSize(win); else this.maximize(win); };
    el.querySelector('.wb-max').addEventListener('pointerenter', () => { clearTimeout(this.layoutTimer); this.layoutTimer = setTimeout(() => this.showLayouts(win), 550); });
    el.querySelector('.wb-max').addEventListener('pointerleave', () => { clearTimeout(this.layoutTimer); this.layoutTimer = setTimeout(() => this.hideLayouts(), 400); });
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
      let ox = win.x, oy = win.y, moved = false, zone = null;
      const scr = this.winsEl.getBoundingClientRect();
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved) {
          if (Math.hypot(dx, dy) < 4) return;
          moved = true;
          el.classList.add('moving');
          this.closeAssist();
          if (win.max || win.snap) {
            // Kaplanmış ya da kenara yaslanmış pencereyi sürükleyince eski boyutuna döner (Windows'taki gibi)
            const was = win.snap;
            win.max = false; win.snap = null;
            ox = ev.clientX - scr.left - win.w / 2 - dx;
            oy = -dy;
            this.emit(was ? 'win-unsnap' : 'win-restore', { app: win.app, win: win.id, via: 'drag', side: was });
          }
        }
        win.x = Math.max(-win.w + 80, Math.min(scr.width - 80, ox + dx));
        win.y = Math.max(0, Math.min(scr.height - 30, oy + dy));
        this.layout(win);
        // Fare ekranın sol/sağ kenarına ya da en üstüne değince pencerenin yerleşeceği yer gölge olarak görünür
        const px = ev.clientX - scr.left, py = ev.clientY - scr.top;
        zone = px <= 6 ? 'left' : px >= scr.width - 6 ? 'right' : py <= 3 ? 'max' : null;
        this.snapPreview(zone);
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        el.classList.remove('moving');
        this.snapPreview(null);
        if (moved && zone) { if (zone === 'max') this.maximize(win); else this.snapWin(win, zone, 'drag'); return; }
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
    win.el.classList.toggle('snap', !!win.snap && !win.max);
    if (win.max) { s.left = s.top = '0'; s.width = s.height = '100%'; }
    else if (win.snap) { s.left = win.snap === 'left' ? '0' : '50%'; s.top = '0'; s.width = '50%'; s.height = '100%'; }
    else { s.left = win.x + 'px'; s.top = win.y + 'px'; s.width = win.w + 'px'; s.height = win.h + 'px'; }
    win.api?.onResize?.();
  }

  focus(win, quiet) {
    if (!win || win.min) return;
    if (win.vd !== this.vd) this.switchDesk(win.vd, true);
    this.active = win;
    win.el.style.zIndex = ++this.z;
    for (const w of this.wins) if (APPS[w.app].top && w !== win) w.el.style.zIndex = ++this.z + 1000; // her zaman üstte
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
      const next = [...this.wins].filter((w) => !w.min && w.vd === this.vd && !APPS[w.app].noFocus).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
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
    win.snap = null;
    this.closeAssist();
    this.layout(win);
    this.emit('win-max', { app: win.app, win: win.id });
  }

  restoreSize(win) {
    win.max = false;
    this.layout(win);
    this.emit('win-unmax', { app: win.app, win: win.id });
  }

  // ------------------------------------------------------------------ Pencereleri yan yana koymak (ekranı ikiye bölmek)
  // side: 'left' | 'right'. via: 'drag' (kenara çarptırma), 'key' (⊞ + ← / →), 'layout' (☐ düğmesinin üzerinde bekleme), 'assist'
  snapWin(win, side, via) {
    this.hideLayouts();
    if (win.min) this.restore(win, true);
    win.max = false;
    win.snap = side;
    this.layout(win);
    this.focus(win, true);
    this.emit('win-snap', { app: win.app, win: win.id, side, via });
    if (via !== 'assist') this.snapAssist(win, side); else this.closeAssist();
  }

  unsnap(win, via) {
    const side = win.snap;
    win.snap = null;
    this.layout(win);
    this.emit('win-unsnap', { app: win.app, win: win.id, via, side });
  }

  snapPreview(zone) {
    let p = this.winsEl.querySelector('.dk-snapprev');
    if (!zone) { p?.remove(); return; }
    if (!p) { p = document.createElement('div'); p.className = 'dk-snapprev'; this.winsEl.append(p); }
    p.dataset.zone = zone;
  }

  // Yaslama yardımcısı: bir pencere yarıya yerleşince öbür yarıda diğer açık pencereler listelenir; tıklanan oraya yerleşir
  snapAssist(win, side) {
    this.closeAssist();
    const others = this.wins.filter((w) => w !== win && w.vd === this.vd && !APPS[w.app].noFocus && !(w.snap && w.snap !== side && !w.min));
    if (!others.length) return;
    const a = document.createElement('div');
    a.className = 'dk-assist';
    a.dataset.side = side === 'left' ? 'right' : 'left';
    a.innerHTML = `<p>Bu yarıya hangi pencere gelsin?</p><div>${others.map((w) => `<button type="button" data-w="${w.id}"><span>${w.icon}</span><b>${esc(w.title)}</b></button>`).join('')}</div><small>Boş bir yere tıklarsanız bu liste kapanır.</small>`;
    a.addEventListener('click', (e) => {
      const b = e.target.closest('[data-w]');
      const o = b && this.wins.find((w) => w.id === b.dataset.w);
      this.closeAssist();
      if (o) this.snapWin(o, a.dataset.side, 'assist');
    });
    this.winsEl.append(a);
    this.assistEl = a;
    this.emit('snap-assist', { app: win.app, side: a.dataset.side, count: others.length });
  }

  closeAssist() { this.assistEl?.remove(); this.assistEl = null; }

  // Windows 11: ☐ (Ekranı kapla) düğmesinin üzerinde beklenince yerleşim seçenekleri çıkar
  showLayouts(win) {
    this.hideLayouts();
    if (!this.wins.includes(win) || win.min) return;
    const b = win.el.querySelector('.wb-max').getBoundingClientRect(), r = this.winsEl.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'dk-layouts';
    f.innerHTML = '<button type="button" data-side="left" title="Ekranın sol yarısı"><span class="on"></span><span></span></button><button type="button" data-side="right" title="Ekranın sağ yarısı"><span></span><span class="on"></span></button><small>Sol yarı</small><small>Sağ yarı</small>';
    f.style.left = Math.max(4, Math.min(r.width - 200, b.left - r.left - 80)) + 'px';
    f.style.top = (b.bottom - r.top + 4) + 'px';
    f.addEventListener('pointerenter', () => clearTimeout(this.layoutTimer));
    f.addEventListener('pointerleave', () => { this.layoutTimer = setTimeout(() => this.hideLayouts(), 400); });
    f.addEventListener('click', (e) => { const s = e.target.closest('[data-side]')?.dataset.side; if (s) this.snapWin(win, s, 'layout'); });
    this.winsEl.append(f);
    this.layoutsEl = f;
    this.emit('snap-layouts', { app: win.app });
  }

  hideLayouts() { clearTimeout(this.layoutTimer); this.layoutsEl?.remove(); this.layoutsEl = null; }

  async close(win) {
    if (win.hung) {
      // Yanıt vermeyen program kapatılmak istenince Windows sorar
      const a = await this.dialogs.ask({ title: win.title, icon: '⏳', text: `<b>${esc(APPS[win.app].name)} yanıt vermiyor</b><br>Programı kapatırsanız kaydedilmemiş bilgiler kaybolabilir.`, buttons: [['close', 'Programı kapat'], ['wait', 'Programın yanıt vermesini bekle', true]] });
      this.emit('hung-answer', { app: win.app, answer: a });
      if (a === 'close') { this.destroy(win); this.emit('win-close', { app: win.app, win: win.id, hung: true }); }
      return;
    }
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
      const next = [...this.wins].filter((w) => !w.min && w.vd === this.vd && !APPS[w.app].noFocus).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
      if (next) this.focus(next, true);
    }
    this.renderTaskbar();
  }

  // Ders adımı değişince (Devam düğmesine basılınca) klavye odağını bilgisayara geri ver
  refocus() {
    if (this.dialogs.busy || this.snipping) return;
    if (this.power === 'login') { this.overEl.querySelector('input')?.focus({ preventScroll: true }); return; }
    if (this.power !== 'desktop') { this.overEl.focus({ preventScroll: true }); return; }
    if (!this.startEl.hidden) { (touchOnly() ? this.startEl : this.startEl.querySelector('.st-search'))?.focus({ preventScroll: true }); return; }
    if (this.active && !this.active.min) this.active.api?.focus?.();
    else this.iconsEl.focus({ preventScroll: true });
  }

  // Programı “yanıt vermiyor” durumuna sokar (ya da düzeltir): pencere beyazlaşır, tıklamalara cevap vermez
  hang(win, on = true) {
    if (!win) return;
    win.hung = on;
    win.el.classList.toggle('hung', on);
    const t = win.el.querySelector('.win-title');
    t.textContent = on ? `${win.title} (Yanıt vermiyor)` : win.title;
    let fog = win.el.querySelector('.win-fog');
    if (on && !fog) {
      fog = document.createElement('div');
      fog.className = 'win-fog';
      fog.innerHTML = '<span class="spin"></span>';
      fog.addEventListener('pointerdown', (e) => { e.stopPropagation(); fog.classList.add('more'); this.emit('hung-click', { app: win.app }); });
      win.el.querySelector('.win-body').append(fog);
    } else if (!on) fog?.remove();
    this.emit('hang', { app: win.app, win: win.id, on });
  }

  // Ctrl + Alt + Delete ekranı
  secureScreen() {
    const o = document.createElement('div');
    o.className = 'dk-secure';
    o.innerHTML = `<div>${[['lock', 'Kilitle'], ['user', 'Kullanıcı değiştir'], ['signout', 'Oturumu kapat'], ['taskmgr', 'Görev Yöneticisi']].map(([k, l]) => `<button type="button" data-k="${k}">${l}</button>`).join('')}</div><button type="button" data-k="cancel" class="sec-cancel">İptal</button>`;
    this.screen.append(o);
    this.emit('secure-screen', { open: true });
    o.querySelector('button').focus();
    const done = (k) => {
      o.remove();
      this.emit('secure-screen', { open: false, choice: k });
      if (k === 'taskmgr') this.ensure('taskmgr');
      else if (k === 'lock' || k === 'user') this.setPower('lock');
      else if (k === 'signout') { this.closeAll(); this.setPower('login'); }
      this.refocus();
    };
    o.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) done(b.dataset.k); });
    o.addEventListener('keydown', (e) => { if (e.key === 'Escape') done('cancel'); });
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
    // Print Screen: bütün ekranın resmi panoya. Tarayıcılar bu tuşta yalnızca keyup gönderir.
    addEventListener('keyup', (e) => {
      if (e.key !== 'PrintScreen' || !this.root.isConnected || !this.root.offsetParent || this.power !== 'desktop') return;
      this.printScreen();
    });
    this.screen.addEventListener('keydown', (e) => {
      if (this.power === 'lock') { e.preventDefault(); this.setPower('login'); return; }
      if (this.power === 'sleep' && Date.now() - this.sleepAt > 900) { this.emit('wake'); this.setPower('lock'); return; }
      if (e.metaKey && e.code === 'KeyL') { e.preventDefault(); this.lockScreen('key'); return; }
      // Alt + Shift: Windows'taki gibi tuşlar bırakılınca dil değişir; arada başka tuşa (ör. Tab) basıldıysa değişmez
      if (e.key === 'Shift' || e.key === 'Alt') { if ((e.altKey && e.shiftKey)) this.kbArm = true; } else this.kbArm = false;
      if (e.metaKey && e.code === 'Space') { e.preventDefault(); if (!e.repeat) this.cycleKb('key'); return; }
      if (this.settings.kbLayout !== 'trq' && this.power === 'desktop') this.remapKey(e);
      if (e.altKey && e.key === 'Tab') { e.preventDefault(); this.altTab(); return; }
      if (e.altKey && e.key === 'F4' && this.active) { e.preventDefault(); this.close(this.active); return; }
      // ⊞ + Tab: Görev Görünümü; ⊞ + Ctrl + D / ← / →: sanal masaüstü; ⊞ + + / − / Esc: Büyüteç
      if (e.metaKey && e.key === 'Tab') { e.preventDefault(); this.taskView(); return; }
      // ⊞ + H: sesle yazma (dikte). Benzetimde mikrofon yok; şeritteki düğme hazır cümleleri yazar
      if (e.metaKey && !e.ctrlKey && e.code === 'KeyH' && this.power === 'desktop') { e.preventDefault(); if (!e.repeat) this.dictation(); return; }
      if (e.metaKey && e.ctrlKey && e.code === 'KeyD') { e.preventDefault(); this.newDesk(); return; }
      if (e.metaKey && e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); this.switchDesk(this.vd + (e.key === 'ArrowLeft' ? -1 : 1)); return; }
      // ⊞ + ← / →: etkin pencereyi ekranın yarısına yaslar; ⊞ + ↑ ekranı kaplar, ⊞ + ↓ eski boyutuna getirir / küçültür
      if (e.metaKey && !e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.active) {
        e.preventDefault();
        const side = e.key === 'ArrowLeft' ? 'left' : 'right', w = this.active;
        if (w.snap && w.snap !== side && !w.max) this.unsnap(w, 'key'); else this.snapWin(w, side, 'key');
        return;
      }
      if (e.metaKey && e.key === 'ArrowUp' && this.active) { e.preventDefault(); this.maximize(this.active); return; }
      if (e.metaKey && e.key === 'ArrowDown' && this.active) {
        e.preventDefault();
        const w = this.active;
        if (w.max) this.restoreSize(w); else if (w.snap) this.unsnap(w, 'key'); else this.minimize(w);
        return;
      }
      if (e.key === 'Escape' && this.assistEl) { e.preventDefault(); this.closeAssist(); return; }
      if (e.metaKey && (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd')) { e.preventDefault(); this.magnify(1); return; }
      if (e.metaKey && (e.key === '-' || e.code === 'NumpadSubtract')) { e.preventDefault(); this.magnify(-1); return; }
      if (e.metaKey && e.key === 'Escape') { e.preventDefault(); this.magnify(0); return; }
      if (e.key === 'Escape' && this.screen.querySelector('.dk-tv')) { e.preventDefault(); this.closeTaskView(); return; }
      // Ctrl + Shift + Esc: Görev Yöneticisi. Ctrl + Alt + Delete: güvenlik ekranı. (Windows bu tuşları kendisi yakalayabilir.)
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') { e.preventDefault(); this.emit('taskmgr-key'); this.ensure('taskmgr'); return; }
      if (e.ctrlKey && e.altKey && e.key === 'Delete') { e.preventDefault(); this.secureScreen(); return; }
      if (e.target === this.iconsEl && this.selected) {
        const it = this.item(this.selected);
        if (e.key === 'Delete' && !it.sys) { e.preventDefault(); this.deleteNode(this.selected); }
        if (e.key === 'F2' && !it.sys) { e.preventDefault(); this.startRename(this.selected); }
        if (e.key === 'Enter') { e.preventDefault(); this.emit('icon-open', { id: this.selected, name: it.name, via: 'enter' }); this.openItem(this.selected); }
        if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyC' || e.code === 'KeyX') && !it.sys) { this.fileClip = { op: e.code === 'KeyC' ? 'copy' : 'cut', id: this.selected }; this.emit('file-clip', { op: this.fileClip.op, id: this.selected, name: it.name }); }
      }
      if (e.target === this.iconsEl && (e.ctrlKey || e.metaKey) && e.code === 'KeyV') this.pasteFile('desktop');
    });
    this.screen.addEventListener('keyup', (e) => {
      if (e.key === 'Alt' && this.switcher) this.altTabEnd();
      if ((e.key === 'Shift' || e.key === 'Alt') && this.kbArm) { this.kbArm = false; this.cycleKb('key'); }
    });
    // Gerçek Alt+Tab, işletim sistemi tarafından yakalanır: sayfa odağı kaybedip geri alınca anlarız
    addEventListener('blur', () => { this.blurAt = Date.now(); });
    addEventListener('focus', () => { if (this.blurAt && Date.now() - this.blurAt > 150 && this.root.offsetParent) this.emit('alttab', { real: true }); this.blurAt = 0; });
  }

  altTab() {
    const list = [...this.wins].filter((w) => w.vd === this.vd).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex);
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

  // ------------------------------------------------------------------ Sanal masaüstleri ve Görev Görünümü
  newDesk(quiet) {
    if (this.vdesks.length >= 4) { this.toast('Sanal masaüstü', 'Bu alıştırmada en çok 4 masaüstü açılabilir.', '🖥', 3000); return; }
    this.vdesks.push(`Masaüstü ${this.vdesks.length + 1}`);
    this.switchDesk(this.vdesks.length - 1, true);
    if (!quiet) this.emit('vd-new', { count: this.vdesks.length });
    if (this.screen.querySelector('.dk-tv')) this.taskView(true);
  }

  switchDesk(i, quiet) {
    if (i < 0 || i >= this.vdesks.length || (i === this.vd && !quiet)) return;
    this.vd = i;
    for (const w of this.wins) w.el.classList.toggle('vd-off', w.vd !== i && !APPS[w.app].top);
    if (this.active && this.active.vd !== i) this.active = null;
    if (!this.active) {
      const next = this.wins.filter((w) => w.vd === i && !w.min && !APPS[w.app].noFocus).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
      if (next) { this.active = next; this.wins.forEach((w) => w.el.classList.toggle('active', w === next)); }
    }
    this.renderTaskbar();
    if (!quiet) {
      const f = document.createElement('div');
      f.className = 'dk-vdflash';
      f.textContent = this.vdesks[i];
      this.screen.append(f);
      setTimeout(() => f.remove(), 900);
      this.emit('vd-switch', { index: i, name: this.vdesks[i] });
    }
  }

  removeDesk(i) {
    if (this.vdesks.length < 2) return;
    const to = i === 0 ? 1 : i - 1;
    for (const w of this.wins) if (w.vd === i) w.vd = to;
    for (const w of this.wins) if (w.vd > i) w.vd--;
    this.vdesks.splice(i, 1);
    this.vdesks = this.vdesks.map((n, k) => (/^Masaüstü \d+$/.test(n) ? `Masaüstü ${k + 1}` : n));
    const cur = this.vd === i ? (to > i ? to - 1 : to) : this.vd > i ? this.vd - 1 : this.vd;
    this.vd = -1;
    this.switchDesk(cur, true);
    this.emit('vd-close', { count: this.vdesks.length });
  }

  moveToDesk(win, i) {
    win.vd = i;
    if (this.active === win && i !== this.vd) this.active = null;
    this.switchDesk(this.vd, true);
    this.emit('vd-move', { app: win.app, win: win.id, to: i, name: this.vdesks[i] });
  }

  taskView(refresh) {
    let tv = this.screen.querySelector('.dk-tv');
    if (tv && !refresh) { this.closeTaskView(); return; }
    this.closeMenus();
    if (!tv) { tv = document.createElement('div'); tv.className = 'dk-tv'; this.screen.append(tv); }
    const here = this.wins.filter((w) => w.vd === this.vd && !APPS[w.app].top);
    tv.innerHTML = `<div class="tv-wins">${here.length ? here.map((w) => `<button type="button" class="tv-win" data-tvwin="${w.id}"><span class="tv-ttl">${w.icon} ${esc(w.title)}</span><span class="tv-big">${w.icon}</span><i data-tvclose="${w.id}" title="Kapat">✕</i></button>`).join('') : '<p class="tv-empty">Bu masaüstünde açık pencere yok.</p>'}</div>
      <p class="tv-tip">Bir pencereyi başka masaüstüne taşımak için üzerine <b>sağ tıklayın</b>.</p>
      <div class="tv-desks">${this.vdesks.map((n, i) => `<button type="button" class="tv-desk ${i === this.vd ? 'on' : ''}" data-tvdesk="${i}"><span class="tv-thumb" style="background:${this.wallCss()}">${this.wins.filter((w) => w.vd === i).slice(0, 4).map((w) => `<i>${w.icon}</i>`).join('')}</span><span>${esc(n)}</span>${this.vdesks.length > 1 ? `<i data-tvdel="${i}" title="Masaüstünü kapat">✕</i>` : ''}</button>`).join('')}
        <button type="button" class="tv-desk tv-new" data-tvnew="1"><span class="tv-thumb">＋</span><span>Yeni masaüstü</span></button></div>`;
    if (!refresh) {
      this.emit('taskview', { open: true });
      tv.addEventListener('click', (e) => {
        const g = (s) => e.target.closest(s);
        let b;
        if ((b = g('[data-tvclose]'))) { const w = this.wins.find((x) => x.id === b.dataset.tvclose); if (w) this.close(w); setTimeout(() => this.taskView(true), 50); return; }
        if ((b = g('[data-tvdel]'))) { this.removeDesk(+b.dataset.tvdel); this.taskView(true); return; }
        if (g('[data-tvnew]')) { this.newDesk(); return; }
        if ((b = g('[data-tvdesk]'))) { this.switchDesk(+b.dataset.tvdesk); this.closeTaskView(); return; }
        if ((b = g('[data-tvwin]'))) { const w = this.wins.find((x) => x.id === b.dataset.tvwin); this.closeTaskView(); if (w) { if (w.min) this.restore(w); else this.focus(w); } return; }
        this.closeTaskView();
      });
      tv.addEventListener('contextmenu', (e) => {
        const b = e.target.closest('[data-tvwin]');
        e.preventDefault();
        if (!b) return;
        const w = this.wins.find((x) => x.id === b.dataset.tvwin);
        const sub = this.vdesks.map((n, i) => ({ cmd: 'vd' + i, label: n, disabled: i === this.vd })).concat([{ cmd: 'vdnew', label: '＋ Yeni masaüstü' }]);
        this.menu(e.clientX, e.clientY, [{ cmd: 'move', label: 'Şuraya taşı', sub }, { cmd: 'close', label: 'Kapat' }], (c) => {
          if (c === 'close') { this.close(w); setTimeout(() => this.taskView(true), 50); return; }
          if (c === 'vdnew') { const cur = this.vd; this.newDesk(true); this.moveToDesk(w, this.vdesks.length - 1); this.switchDesk(cur, true); }
          else this.moveToDesk(w, +c.slice(2));
          this.taskView(true);
        }, 'taskview-win', { app: w.app });
      });
    }
  }
  closeTaskView() {
    const tv = this.screen.querySelector('.dk-tv');
    if (!tv) return;
    tv.remove();
    this.emit('taskview', { open: false });
  }

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

  // Telefonu kabloyla bağlamak: telefon önce “yalnızca şarj” modundadır; telefondan “Dosya aktarımı” seçilince
  // bilgisayarda “Telefonum” sürücüsü görünür. Telefonun ekranı masaüstünün sağ alt köşesinde çizilir.
  plugPhone() {
    if (this.phoneEl) return;
    const el = this.phoneEl = document.createElement('div');
    el.className = 'dk-phone';
    this.screen.append(el);
    let mode = 'charge', open = false;
    const draw = () => {
      el.innerHTML = `<div class="ph-cable"></div><div class="ph-body"><div class="ph-notch"></div><div class="ph-screen">
        <div class="ph-time">${pad(this.now().getHours())}:${pad(this.now().getMinutes())} 🔋⚡</div>
        ${open ? `<div class="ph-sheet"><b>USB tercihleri</b><small>USB ile bağlanan cihaz: bu bilgisayar</small>
          ${[['charge', 'Yalnızca şarj'], ['files', 'Dosya aktarımı'], ['ptp', 'Fotoğraf aktarımı (PTP)']].map(([k, l]) => `<label class="ph-opt"><input type="radio" name="phm" value="${k}" ${mode === k ? 'checked' : ''}> ${l}</label>`).join('')}
          <button type="button" class="ph-done">Tamam</button></div>`
        : `<div class="ph-note" role="button" tabindex="0"><b>⚡ Bu cihaz USB ile şarj ediliyor</b><small>${mode === 'charge' ? 'Diğer seçenekler için dokunun.' : 'Dosya aktarımı açık. Değiştirmek için dokunun.'}</small></div>`}
        </div></div><button type="button" class="ph-unplug" title="Kabloyu çıkar">🔌 Kabloyu çıkar</button>`;
    };
    draw();
    el.addEventListener('click', (e) => {
      if (e.target.closest('.ph-note')) { open = true; draw(); this.emit('phone-sheet'); return; }
      if (e.target.closest('.ph-done')) { open = false; draw(); return; }
      if (e.target.closest('.ph-unplug')) { this.unplugPhone(); return; }
      const r = e.target.closest('input[name="phm"]');
      if (!r) return;
      mode = r.value;
      this.emit('phone-mode', { mode });
      if (mode === 'charge') { if (this.fs.phone) { this.leavePhone(); this.fs.plugPhone(false); } return; }
      if (!this.fs.phone) {
        this.fs.plugPhone(true);
        const t = this.toast('Telefonum', 'Bu cihazla ne yapmak istediğinizi seçin.<div class="to-acts"><button type="button" data-ph="import">🖼 Fotoğrafları içeri aktar</button><button type="button" data-ph="open">📂 Dosyaları görmek için cihazı aç</button></div>', '📱', 20000);
        t.addEventListener('click', (ev) => {
          const k = ev.target.closest('[data-ph]')?.dataset.ph;
          if (!k) return;
          t.remove();
          this.emit('phone-choice', { choice: k });
          if (k === 'open') this.open('explorer', { folder: PHONE });
          else this.importPhotos();
        });
      }
    });
    this.emit('phone', { on: true });
  }

  leavePhone() { for (const w of this.wins.filter((x) => x.app === 'explorer')) w.api?.leavePhone?.(); }

  unplugPhone() {
    if (!this.phoneEl) return;
    this.phoneEl.remove();
    this.phoneEl = null;
    if (this.fs.phone) { this.fs.plugPhone(false); this.leavePhone(); }
    this.emit('phone', { on: false });
  }

  // Telefondaki bütün fotoğrafları Resimler içinde tarihli bir klasöre kopyalar
  async importPhotos() {
    const photos = Object.values(this.fs.nodes).filter((n) => n.type === 'file' && this.fs.isInside(n.id, PHONE) && /\.jpe?g$/i.test(n.name));
    const t = this.toast('İçeri aktarılıyor', `<div class="prg"><i></i></div><small>${photos.length} fotoğraf kopyalanıyor…</small>`, '🖼', 60000);
    const bar = t.querySelector('.prg i');
    for (let i = 0; i <= 20; i++) { bar.style.width = i * 5 + '%'; await new Promise((r) => setTimeout(r, 70)); }
    t.remove();
    const folder = this.fs.create('pictures', { type: 'folder', name: `Telefondan ${this.now().toLocaleDateString('tr-TR')}` });
    for (const p of photos) this.fs.copy(p.id, folder.id);
    const d = this.toast('İçeri aktarma tamamlandı', `${photos.length} fotoğraf <b>Resimler › ${esc(folder.name)}</b> klasörüne kopyalandı. Telefondakiler yerinde duruyor.`, '✅', 8000);
    d.style.cursor = 'pointer';
    d.addEventListener('click', () => this.open('explorer', { folder: folder.id }));
    this.emit('phone-import', { count: photos.length, folder: folder.id });
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
  printScreen() {
    const s = this.screen.getBoundingClientRect();
    this.imageClip = this.renderScreen({ x: 0, y: 0, w: s.width, h: s.height });
    this.toast('Ekran görüntüsü panoya kopyalandı', `<img class="to-img" src="${this.imageClip.toDataURL()}" alt="">Paint'i açıp <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, '📸', 8000);
    this.emit('printscreen');
  }

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
  if (n.type === 'link') return n.icon || APPS[n.app]?.icon || '📄';
  return fileIcon(n.name);
}

function startLogo() {
  return '<span class="logo4"><i></i><i></i><i></i><i></i></span>';
}
