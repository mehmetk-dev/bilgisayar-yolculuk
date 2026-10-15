// İşletim sistemi benzetimlerinin görünüşü: her sistemin açılış, giriş ve kapanış ekranı, masaüstü,
// görev çubuğu, Başlat menüsü ve Ayarlar'ı. Ortak motor ve programlar isletim-sim.js'dedir.
import * as I from './isletim-simge.js';
import { app, clk, month, esc, GUN } from './isletim-sim.js';

// ---------------------------------------------------------------- yardımcılar
const USER = 'Ayşe';
const place = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
const di = (label, icon, open, arg) => `<button type="button" class="di" data-open="${open}"${arg ? ` data-arg="${esc(arg)}"` : ''}><i>${icon}</i><span>${label}</span></button>`;
const yok = (title, icon, msg) => ({ title, icon, go: (api) => api.toast(msg || `<b>${title}</b> bu benzetimde açılmıyor. Diğer programları deneyin.`) });
const item = (label, icon, open, arg, cls = '') => `<button type="button" class="${cls}" data-open="${open}"${arg ? ` data-arg="${esc(arg)}"` : ''}>${icon ? `<i>${icon}</i>` : ''}<span>${label}</span></button>`;
const act = (label, a, icon = '', cls = '', msg = '') => `<button type="button" class="${cls}" data-act="${a}"${msg ? ` data-msg="${esc(msg)}"` : ''}>${icon ? `<i>${icon}</i>` : ''}<span>${label}</span></button>`;
const tray = (...ic) => ic.map((x) => `<i class="tr-i">${I.ln[x]}</i>`).join('');
const sp = (t) => `<span class="ospin ${t}">${'<b></b>'.repeat(5)}</span>`;
// Simge düğmeli görev çubuğu (Windows): sabitlenmiş programlar + açık olan diğerleri
function iconTasks(api, pinned) {
  const { os } = api;
  const open = [...new Set(api.st.wins.filter((w) => !w.A.modern).map((w) => w.app))];
  return [...pinned, ...open.filter((a) => !pinned.includes(a))].map((a) => {
    const A = os.apps[a], run = api.running(a).filter((w) => !w.A.modern).length;
    return `<button type="button" class="ob${run ? ' run' : ''}${api.isActive(a) ? ' act' : ''}" data-task="${a}" title="${esc(A.title)}"><i>${A.icon}</i></button>`;
  }).join('');
}
// Arama sonuçları listesi (Başlat araması, Etkinlikler, Pardus menüsü)
const results = (api, t, cls = 'os-res') => {
  const r = api.search(t);
  if (!r.length) return `<p class="${cls}-none">“${esc(t)}” için sonuç bulunamadı.</p>`;
  return `<div class="${cls}">${r.map(([k, A], i) => `<button type="button" class="${i === 0 ? 'best' : ''}" data-open="${k}"><i>${A.icon}</i><span>${esc(A.title)}${i === 0 ? '<small>Uygulama</small>' : ''}</span></button>`).join('')}</div>`;
};
const bindSearch = (api, input, out, render) => input?.addEventListener('input', () => render(input.value));
const winFs = (pcName, folder, side) => ({ root: 'pc', pcName, homeName: USER, trashName: 'Geri Dönüşüm Kutusu', folder, host: 'AYSE-PC', user: 'ayse', side });
const sideIc = (style) => (n) => I.folder(style, { Masaüstü: 'desk', Belgeler: 'doc', İndirilenler: 'down', Müzik: 'music', Resimler: 'pic', Videolar: 'video' }[n]);
const USERS = ['Masaüstü', 'Belgeler', 'İndirilenler', 'Müzik', 'Resimler', 'Videolar'];
const ctxWin = (pers, extra = '') => `${act('Görünüm', 'ctxok', '', 'sub')}${act('Sıralama ölçütü', 'ctxok', '', 'sub')}${act('Yenile', 'ctxok')}<hr>${act('Yapıştır', 'ctxok', '', 'dis')}${act('Kısayolu yapıştır', 'ctxok', '', 'dis')}<hr>${act('Yeni', 'ctxok', '', 'sub')}<hr>${extra}${item(pers, '', 'settings')}`;

// Sistem bilgisi tablosu (Ayarlar → Hakkında)
const specs = (rows) => `<dl class="st-dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
const installDate = '12.03.2021';

// Küçük hava durumu ve takvim pencereleri (W10 / W11)
const havaHtml = () => `<div class="wxh"><div class="wxh-now"><b>18°</b><span><strong>Ankara</strong>Parçalı bulutlu · En yüksek 21° · En düşük 12°</span></div><div class="wxh-days">${['Bugün', 'Cum', 'Cmt', 'Paz', 'Pzt'].map((d, i) => `<div><small>${d}</small>${I.weather()}<b>${[21, 19, 17, 20, 22][i]}°</b><small>${[12, 11, 9, 10, 13][i]}°</small></div>`).join('')}</div></div>`;
const simple = (html, cls = '') => () => ({ html: `<div class="${cls}">${typeof html === 'function' ? html() : html}</div>` });

// ==================================================================== WINDOWS 7
const W7_WALL = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs>
  <radialGradient id="w7w" cx="50%" cy="42%" r="78%"><stop offset="0" stop-color="#4fb6f0"/><stop offset=".35" stop-color="#1b7ccc"/><stop offset=".75" stop-color="#0b4a96"/><stop offset="1" stop-color="#062d63"/></radialGradient>
  <radialGradient id="w7gl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".4" stop-color="#bfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#bfe8ff" stop-opacity="0"/></radialGradient>
  <linearGradient id="w7s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fe0ff" stop-opacity="0"/><stop offset=".5" stop-color="#d8f3ff" stop-opacity=".55"/><stop offset="1" stop-color="#9fe0ff" stop-opacity="0"/></linearGradient></defs>
  <rect width="960" height="600" fill="url(#w7w)"/>
  <path d="M-40 430C180 300 360 470 560 360S900 250 1000 300" fill="none" stroke="url(#w7s)" stroke-width="46" opacity=".55"/>
  <path d="M-40 470C200 360 380 520 600 400S880 330 1000 360" fill="none" stroke="url(#w7s)" stroke-width="14" opacity=".7"/>
  <path d="M-40 150C200 260 380 120 560 220S860 300 1000 230" fill="none" stroke="url(#w7s)" stroke-width="30" opacity=".35"/>
  <path d="M120 600C260 470 420 520 520 430S760 330 900 380" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>
  <circle cx="480" cy="268" r="190" fill="url(#w7gl)"/>
  ${place(I.w7flag(), 380, 170, 200, 200)}</svg>`;
const W7_BG = 'w7-bg';
const w7 = {
  id: 'w7', name: 'Windows 7', fam: 'win',
  ver: { ed: 'Windows 7 Home Premium', year: 2009, sp: 'Service Pack 1' },
  work: { l: 0, t: 0, r: 0, b: 40 },
  fs: winFs('Bilgisayar', 'w7', () => [['Sık Kullanılanlar', null], ['Masaüstü', 'Masaüstü', sideIc('w7')('Masaüstü'), 1], ['İndirilenler', 'İndirilenler', sideIc('w7')('İndirilenler'), 1], ['Son Yerler', 'x:Son Yerler', I.folder('w7'), 1], ['Kitaplıklar', null], ...['Belgeler', 'Müzik', 'Resimler', 'Videolar'].map((n) => [n, n, sideIc('w7')(n), 1]), ['-'], ['Bilgisayar', 'pc', I.computer('w7')], ['Yerel Disk (C:)', 'C', I.drive(true), 1], ['-'], ['Ağ', 'x:Ağ', I.ln.net]]),
  apps: {
    files: app('files', 'Windows Gezgini', I.explorer7(), { v: 'w7', w: 660, h: 410 }),
    notepad: app('notepad', 'Not Defteri', I.notepad('w7'), { v: 'w7', w: 560, h: 360 }),
    browser: app('browser', 'Internet Explorer', I.ie(), { v: 'ie', w: 720, h: 450 }),
    calc: app('calc', 'Hesap Makinesi', I.calc('w7'), { v: 'w7', w: 232, h: 330 }),
    settings: app('cpanel', 'Denetim Masası', I.cpanel(), { w: 680, h: 430, keys: 'ayarlar sistem' }),
    viewer: app('viewer', 'Windows Fotoğraf Görüntüleyicisi', I.photos(), { v: 'w7', w: 600, h: 420, hide: true }),
    wmp: yok('Windows Media Player', I.wmp()),
    paint: yok('Paint', I.paint()),
  },
  boot: () => `<div class="w7-boot" data-act="skipboot"><div class="w7-boot-logo">${I.w7flag()}</div><p>Windows başlatılıyor</p><small>© Microsoft Corporation</small></div>`,
  login: () => `<div class="${W7_BG} w7-login"><div class="w7-lg"><div class="w7-frame">${I.avatar('flower')}</div><b>${USER}</b><div class="w7-pw"><input type="password" placeholder="Parola" aria-label="Parola"><button type="button" data-act="login" title="Oturum aç">${I.ln.fwd}</button></div><small>Parola gerekmez: okla devam edin.</small></div>
    <button type="button" class="w7-ease" data-act="toast" data-msg="Erişim Kolaylığı: ekran okuyucu, büyüteç, ekran klavyesi.">${I.ln.access}</button><button type="button" class="w7-red" data-act="off" title="Kapat">${I.ln.power}</button>
    <div class="w7-brand">${I.w7flag()}<span>Windows<sup>7</sup> <em>Home Premium</em></span></div></div>`,
  welcome: () => `<div class="${W7_BG} w7-wait"><i class="w7-ring"></i><span>Hoş geldiniz</span></div>`,
  bye: (api, r) => `<div class="${W7_BG} w7-wait"><i class="w7-ring"></i><span>${r ? 'Yeniden başlatılıyor…' : 'Kapatılıyor…'}</span></div>`,
  desk: () => `${W7_WALL}<div class="di-col">${di('Geri Dönüşüm Kutusu', I.bin(false, 'w7'), 'files', 'Çöp')}${di('Bilgisayar', I.computer('w7'), 'files', 'pc')}${di('Internet Explorer', I.ie(), 'browser')}</div>`,
  bar: () => `<div class="os-bar w7-bar"><button type="button" class="w7-orb" data-act="start" title="Başlat">${I.w7flag()}</button><div class="os-tasks"></div>
    <div class="tray"><span class="tr-lang">TR</span><button type="button" data-act="toast" data-msg="Gizli simgeler: arka planda çalışan programlar.">${I.ln.chevUp}</button>${tray('flag', 'net', 'vol')}<button type="button" class="tr-clock" data-pop="cal">${clk('hm')}${clk('dmy')}</button><button type="button" class="tr-show" data-act="showdesk" title="Masaüstünü göster"></button></div></div>
    <div class="os-pop w7-cal" data-name="cal"><div class="cal-big">${clk('hm')}<small>${clk('long2')}</small></div>${month()}<a data-act="toast" data-msg="Tarih ve saat Denetim Masası'ndan değiştirilir.">Tarih ve saat ayarlarını değiştir…</a></div>`,
  menu: (api) => `<div class="os-pop w7-start" data-name="start"><div class="w7s-l">
      <div class="w7s-list">${item('Başlarken', I.w7flag(), 'x')}${item('Not Defteri', I.notepad('w7'), 'notepad')}${item('Hesap Makinesi', I.calc('w7'), 'calc')}${item('Internet Explorer', I.ie(), 'browser')}${item('Paint', I.paint(), 'paint')}${item('Windows Media Player', I.wmp(), 'wmp')}${item('Windows Gezgini', I.explorer7(), 'files', 'Belgeler')}</div>
      <div class="w7s-all">${item('Internet Explorer', I.ie(), 'browser')}${item('Windows Media Player', I.wmp(), 'wmp')}<p class="w7s-fold">${I.folder('w7')} Donatılar</p>${item('Hesap Makinesi', I.calc('w7'), 'calc', '', 'in')}${item('Not Defteri', I.notepad('w7'), 'notepad', '', 'in')}${item('Paint', I.paint(), 'paint', '', 'in')}${item('Windows Gezgini', I.explorer7(), 'files', 'Belgeler', 'in')}<p class="w7s-fold">${I.folder('w7')} Oyunlar</p><p class="w7s-fold">${I.folder('w7')} Bakım</p></div>
      <div class="w7s-res"></div>
      <hr><button type="button" class="w7s-allbtn" data-act="w7all"><b>▶</b> <span>Tüm Programlar</span></button>
      <label class="w7s-q"><input class="os-auto" placeholder="Programları ve dosyaları ara"><i>${I.ln.search}</i></label></div>
    <div class="w7s-r"><div class="w7s-pic">${I.avatar('flower')}</div>${item(USER, '', 'files', 'Belgeler')}${item('Belgeler', '', 'files', 'Belgeler')}${item('Resimler', '', 'files', 'Resimler')}${item('Müzik', '', 'files', 'Müzik')}<hr>${act('Oyunlar', 'toast', '', '', 'Oyunlar bu benzetimde yok.')}${item('Bilgisayar', '', 'files', 'pc')}<hr>${item('Denetim Masası', '', 'settings')}${act('Aygıtlar ve Yazıcılar', 'toast')}${act('Varsayılan Programlar', 'toast')}${act('Yardım ve Destek', 'toast')}
      <div class="w7s-pw"><button type="button" data-act="off">Kapat</button><button type="button" data-pop="w7pw" title="Diğer seçenekler">▸</button>
      <div class="os-pop w7s-pwm" data-name="w7pw">${act('Kullanıcı Değiştir', 'logout')}${act('Oturumu Kapat', 'logout')}${act('Kilitle', 'lock')}<hr>${act('Yeniden Başlat', 'restart')}${act('Uyku', 'sleep')}</div></div></div></div>`,
  extra: () => '',
  tasks: (api) => iconTasks(api, ['browser', 'files', 'wmp']),
  ctx: () => ctxWin('Kişiselleştir', `${act('Ekran çözünürlüğü', 'ctxok')}${act('Araçlar', 'ctxok')}`),
  init(api) {
    const m = api.q('.w7-start'), inp = m.querySelector('.w7s-q input'), res = m.querySelector('.w7s-res');
    bindSearch(api, inp, res, (t) => { m.classList.toggle('srch', !!t.trim()); res.innerHTML = t.trim() ? `<h6>Programlar</h6>${results(api, t)}` : ''; });
  },
  onPop(name, el) { if (name === 'start') { el.classList.remove('all', 'srch'); const i = el.querySelector('.w7s-q input'); i.value = ''; } },
  act(name, el, api) { if (name === 'w7all') { const m = api.q('.w7-start'); const on = m.classList.toggle('all'); el.querySelector('span').textContent = on ? 'Geri' : 'Tüm Programlar'; el.querySelector('b').textContent = on ? '◀' : '▶'; } },
};
w7.apps.x = { title: 'Başlarken', icon: I.w7flag(), hide: true, go: (api) => api.toast('<b>Başlarken:</b> Windows 7\'yi tanıtan sayfalar. Bu benzetimde açılmıyor.') };

// ==================================================================== WINDOWS 8.1
const W8_ACC = '#2d1a52';
const W8_WALL = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="w8w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a6c8f"/><stop offset=".55" stop-color="#0b3d6b"/><stop offset="1" stop-color="#081f3f"/></linearGradient><linearGradient id="w8r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6ff0ff" stop-opacity="0"/><stop offset=".5" stop-color="#9ff5ff" stop-opacity=".5"/><stop offset="1" stop-color="#6ff0ff" stop-opacity="0"/></linearGradient></defs>
  <rect width="960" height="600" fill="url(#w8w)"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-60 ${360 + i * 22}C220 ${220 + i * 30} 520 ${520 - i * 18} 1020 ${260 + i * 26}" fill="none" stroke="url(#w8r)" stroke-width="${6 - i * 0.7}" opacity="${0.9 - i * 0.12}"/>`).join('')}</svg>`;
const W8_LOCK = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="w8l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b26b"/><stop offset=".45" stop-color="#d9727a"/><stop offset="1" stop-color="#3a2b5c"/></linearGradient></defs><rect width="960" height="600" fill="url(#w8l)"/><circle cx="700" cy="250" r="60" fill="#ffe2a8" opacity=".85"/><path d="M0 420L140 330 260 400 420 290 560 380 700 300 860 390 960 340V600H0z" fill="#2a2147"/><path d="M0 480L180 420 340 470 520 410 700 470 960 420V600H0z" fill="#1a1530"/></svg>`;
const t8 = (size, bg, label, icon, open, extra = '', arg = '') => `<button type="button" class="t8 t8-${size}" style="background:${bg}" data-open="${open}"${arg ? ` data-arg="${arg}"` : ''}>${icon ? `<i>${icon}</i>` : ''}${extra}<span>${label}</span></button>`;
const m8 = (title, color, icon, html, more = {}) => ({ title, icon, modern: true, build: () => ({ html: `<div class="m8" style="--mc:${color}"><h1>${title}</h1>${typeof html === 'function' ? html() : html}</div>` }), ...more });
const w8 = {
  id: 'w8', name: 'Windows 8.1', fam: 'win',
  ver: { ed: 'Windows 8.1', year: 2013 },
  work: { l: 0, t: 0, r: 0, b: 40 },
  fs: winFs('Bu bilgisayar', 'w10', () => [['Sık Kullanılanlar', null], ['Masaüstü', 'Masaüstü', sideIc('w10')('Masaüstü'), 1], ['İndirilenler', 'İndirilenler', sideIc('w10')('İndirilenler'), 1], ['-'], ['Bu bilgisayar', 'pc', I.computer('w10')], ...USERS.map((n) => [n, n, sideIc('w10')(n), 1]), ['Yerel Disk (C:)', 'C', I.drive(true), 1], ['-'], ['Ağ', 'x:Ağ', I.ln.net]]),
  apps: {
    desktop: { title: 'Masaüstü', icon: I.w8logo('#fff'), go: (api) => w8show(api, false) },
    files: app('files', 'Dosya Gezgini', I.explorer10(), { v: 'w8', w: 660, h: 410 }),
    notepad: app('notepad', 'Not Defteri', I.notepad('w7'), { v: 'w8', w: 560, h: 360 }),
    browser: app('browser', 'Internet Explorer', I.ie(), { v: 'ie', w: 720, h: 450 }),
    calc: app('calc', 'Hesap Makinesi', I.calc('w7'), { v: 'w7', w: 232, h: 330 }),
    settings: app('cpanel', 'Denetim Masası', I.cpanel(), { w: 680, h: 430 }),
    viewer: app('viewer', 'Windows Fotoğraf Görüntüleyicisi', I.photos(), { v: 'w7', w: 600, h: 420, hide: true }),
    pcayar: { title: 'Bilgisayar ayarları', icon: I.gear('#fff'), modern: true, keys: 'ayarlar', build: pcSettings8 },
    hava: m8('Hava Durumu', '#1d8fd6', I.weather(), havaHtml),
    haber: m8('Haberler', '#a20025', I.ln.doc, () => `<div class="m8-news">${['Hafta sonu hava ısınıyor', 'Yeni kütüphane hizmete açıldı', 'Emekliler için bilgisayar kursu', 'Elma hasadı başladı'].map((h, i) => `<div style="--h:${i * 60}"><b>${h}</b></div>`).join('')}</div>`),
    magaza: m8('Mağaza', '#00a300', I.store('w8'), () => `<div class="m8-store">${['VLC', 'Satranç', 'Sudoku', 'Hava', 'Haritalar', 'Skype'].map((t, i) => `<div><i style="background:hsl(${i * 55} 60% 45%)">${t[0]}</i><b>${t}</b><small>Ücretsiz</small></div>`).join('')}</div>`),
    takvim: m8('Takvim', '#6b2fa5', I.calendar('#6b2fa5'), () => month()),
    posta: m8('Posta', '#0072c6', I.mail('#0072c6'), '<p class="m8-p">Posta uygulamasını kullanmak için bir e-posta hesabı ekleyin.</p>'),
    foto: m8('Fotoğraflar', '#00a0b1', I.photos(), () => `<div class="m8-ph">${'<i></i>'.repeat(8)}</div>`),
    muzik: m8('Müzik', '#e05a00', I.music(), '<p class="m8-p">Koleksiyonunuz boş. Müzik dosyalarınız “Müzik” klasörüne eklenince burada görünür.</p>'),
    video: m8('Video', '#a3002c', I.film(), '<p class="m8-p">Videolar klasörünüzde 1 video var.</p>'),
    kisiler: m8('Kişiler', '#d24726', I.people(), `<div class="m8-ppl">${['Ahmet Yılmaz', 'Fatma Kaya', 'Mehmet Demir', 'Zeynep Çelik'].map((n) => `<p><i>${n[0]}</i>${n}</p>`).join('')}</div>`),
  },
  boot: () => `<div class="w8-boot" data-act="skipboot"><i class="w8-blogo">${I.w8logo('#1f8fe0')}</i>${sp('dots')}</div>`,
  lock: () => `<div class="w8-lock" data-act="unlock">${W8_LOCK}<div class="w8-time">${clk('hm', 'bigt')}${clk('long2')}</div><p class="lk-hint">Kilit ekranı: kaldırmak için tıklayın</p></div>`,
  login: () => `<div class="w8-login" style="--acc:${W8_ACC}"><div class="w8-lg"><i class="w8-av">${I.avatar('round')}</i><div><b>${USER}</b><div class="w8-pw"><input type="password" placeholder="Parola" aria-label="Parola"><button type="button" data-act="login" title="Oturum aç">${I.ln.fwd}</button></div><small>Parola gerekmez: okla devam edin.</small></div></div><div class="lg-ic">${act('', 'toast', I.ln.access, '', 'Erişim Kolaylığı')}${act('', 'off', I.ln.power)}</div></div>`,
  welcome: () => `<div class="w8-wait" style="--acc:${W8_ACC}">${sp('dots')}<span>Hoş geldiniz</span></div>`,
  bye: (api, r) => `<div class="w8-wait" style="--acc:${W8_ACC}">${sp('dots')}<span>${r ? 'Yeniden başlatılıyor' : 'Kapatılıyor'}</span></div>`,
  desk: () => `${W8_WALL}<div class="di-col">${di('Geri Dönüşüm Kutusu', I.bin(false, 'w10'), 'files', 'Çöp')}${di('Bu bilgisayar', I.computer('w10'), 'files', 'pc')}</div>`,
  bar: () => `<div class="os-bar w8-bar"><button type="button" class="w8-sb" data-act="start" title="Başlat">${I.w8logo('#fff')}</button><div class="os-tasks"></div>
    <div class="tray"><button type="button" data-act="toast" data-msg="Gizli simgeler">${I.ln.chevUp}</button>${tray('flag', 'net', 'vol')}<span class="tr-lang">TUR</span><button type="button" class="tr-clock" data-pop="cal">${clk('hm')}${clk('dmy')}</button><button type="button" class="tr-show" data-act="showdesk" title="Masaüstü"></button></div></div>
    <div class="os-pop w7-cal w8-cal" data-name="cal"><div class="cal-big">${clk('hm')}<small>${clk('long2')}</small></div>${month()}</div>`,
  extra: () => `<div class="w8-start on" style="--acc:${W8_ACC}"><div class="w8s-pg">
      <div class="w8s-head"><h1>Başlat</h1><div class="w8s-me"><span>${USER}</span><i>${I.avatar('round')}</i><button type="button" data-pop="w8pw2" title="Güç">${I.ln.power}</button><button type="button" data-act="w8apps" title="Ara">${I.ln.search}</button></div>
        <div class="os-pop w8-pwm" data-name="w8pw2">${act('Uyku', 'sleep')}${act('Kapat', 'off')}${act('Yeniden başlat', 'restart')}</div></div>
      <div class="w8s-tiles"><div class="w8s-grp">
        ${t8('m', '#0072c6', 'Posta', I.mail('#0000', '#fff'), 'posta')}${t8('m', '#6b2fa5', 'Takvim', '', 'takvim', `<em class="t8-cal"><b>${new Date().getDate()}</b>${GUN[new Date().getDay()]}</em>`)}
        ${t8('w', 'transparent', 'Masaüstü', '', 'desktop', `<em class="t8-desk">${W8_WALL}</em>`)}
        ${t8('m', '#2672ec', 'Internet Explorer', I.ie(), 'browser')}${t8('m', '#00a0b1', 'Fotoğraflar', I.photos(), 'foto')}
        ${t8('w', '#1d8fd6', 'Hava Durumu', '', 'hava', '<em class="t8-wx"><b>18°</b>Ankara<br>Parçalı bulutlu</em>')}</div>
      <div class="w8s-grp">${t8('w', '#a20025', 'Haberler', '', 'haber', '<em class="t8-news">Emekliler için ücretsiz bilgisayar kursu başlıyor</em>')}
        ${t8('m', '#00a300', 'Mağaza', I.store('w8'), 'magaza')}${t8('m', '#e05a00', 'Müzik', I.music(), 'muzik')}${t8('m', '#d24726', 'Kişiler', I.people(), 'kisiler')}${t8('m', '#a3002c', 'Video', I.film(), 'video')}
        ${t8('m', '#4b2c8a', 'Bilgisayar ayarları', I.gear('#fff'), 'pcayar')}${t8('m', '#3a3a3a', 'Denetim Masası', I.cpanel(), 'settings')}</div></div>
      <button type="button" class="w8s-down" data-act="w8apps" title="Tüm uygulamalar">${I.ln.chevDown}</button></div>
    <div class="w8s-apps"><div class="w8s-head"><h1>Uygulamalar <small>ad sırasına göre</small></h1><label class="w8s-q"><input placeholder="Ara" class="w8-q"><i>${I.ln.search}</i></label></div><div class="w8s-list"></div><button type="button" class="w8s-down up" data-act="w8tiles" title="Başlat ekranına dön">${I.ln.chevUp}</button></div></div>
    <div class="w8-hot hot-tr" data-hot></div><div class="w8-hot hot-br" data-hot></div>
    <div class="w8-charms"><div class="w8-cb">${act('Ara', 'w8apps', I.ln.search)}${act('Paylaş', 'toast', I.ln.share, '', 'Paylaşılacak bir şey yok.')}${act('Başlat', 'start', I.w8logo('#fff'), 'w8c-start')}${act('Aygıtlar', 'toast', I.ln.devices, '', 'Bağlı aygıt yok.')}${act('Ayarlar', 'w8set', I.ln.gear)}</div></div>
    <div class="w8-chclock">${clk('hm', 'bigt')}<span>${clk('long2')}</span></div>
    <div class="os-pop w8-set" data-name="w8set"><h2>Ayarlar</h2><small>Masaüstü</small>${item('Denetim Masası', '', 'settings')}${item('Kişiselleştirme', '', 'settings')}${item('Bilgisayar bilgileri', '', 'settings', 'system')}${act('Yardım', 'toast')}
      <div class="w8-qk">${[['net', 'Ağ'], ['vol', 'Ses'], ['bright', 'Parlaklık'], ['bell', 'Bildirimler']].map(([i, t]) => act(t, 'toast', I.ln[i], '', `${t} ayarı`)).join('')}<button type="button" data-pop="w8pw"><i>${I.ln.power}</i><span>Güç</span></button>${act('Klavye', 'toast', I.ln.kbd, '', 'TUR: Türkçe Q klavye')}</div>
      ${item('Bilgisayar ayarlarını değiştir', '', 'pcayar', '', 'w8-pcs')}<div class="os-pop w8-pwm up" data-name="w8pw">${act('Uyku', 'sleep')}${act('Kapat', 'off')}${act('Yeniden başlat', 'restart')}</div></div>`,
  tasks: (api) => iconTasks(api, ['browser', 'files']),
  ctx: () => ctxWin('Kişiselleştir', act('Ekran çözünürlüğü', 'ctxok')),
  init(api) {
    const s = api.q('.w8-start'), list = s.querySelector('.w8s-list'), qi = s.querySelector('.w8-q');
    const all = () => Object.entries(api.os.apps).filter(([, A]) => !A.hide).sort((a, b) => a[1].title.localeCompare(b[1].title, 'tr'));
    const render = (t = '') => { list.innerHTML = t.trim() ? results(api, t, 'w8-res') : all().map(([k, A]) => `<button type="button" data-open="${k}"><i style="background:${A.modern ? 'var(--acc2,#5b2fa0)' : '#0000'}">${A.icon}</i><span>${A.title}</span></button>`).join(''); };
    render();
    bindSearch(api, qi, list, render);
    const ch = api.q('.w8-charms'), clock = api.q('.w8-chclock');
    const show = (on) => { if (api.st.phase !== 'desk') on = false; ch.classList.toggle('on', on); clock.classList.toggle('on', on); };
    api.qa('[data-hot]').forEach((h) => h.addEventListener('pointerenter', () => { show(true); api.emit('os-charms'); }));
    ch.addEventListener('pointerleave', () => show(false));
    ch.addEventListener('click', () => show(false));
  },
  enter(api) { w8show(api, true); api.st.w8desk = false; },
  startBtn(api) { const on = !api.q('.w8-start').classList.contains('on'); w8show(api, on); if (on) api.emit('os-start', { fromDesk: !!api.st.w8desk }); },
  onOpen(api, w, key) { if (key !== 'desktop') w8show(api, false, !!w?.A.modern); },
  modernGone(api) { if (!api.st.wins.some((w) => w.A.modern && !w.min)) w8show(api, true); },
  act(name, el, api) {
    if (name === 'w8apps') { w8show(api, true); api.q('.w8-start').classList.add('apps'); api.later(() => api.q('.w8-q')?.focus({ preventScroll: true }), 300); }
    else if (name === 'w8tiles') api.q('.w8-start').classList.remove('apps');
    else if (name === 'w8set') api.pop('w8set', true);
  },
};
function w8show(api, on, keepModern) {
  const s = api.q('.w8-start');
  s.classList.toggle('on', on);
  if (!on) { s.classList.remove('apps'); if (!keepModern) { api.st.w8desk = true; api.st.wins.filter((w) => w.A.modern && !w.min).forEach((w) => { w.min = true; w.el.hidden = true; }); } }
}
// Windows 8.1 “Bilgisayar ayarları” (tam ekran)
function pcSettings8(api) {
  const left = ['Bilgisayar ve aygıtlar', 'Hesaplar', 'OneDrive', 'Arama ve uygulamalar', 'Gizlilik', 'Ağ', 'Saat ve dil', 'Erişim Kolaylığı', 'Güncelleştirme ve kurtarma'];
  const sub = ['Kilit ekranı', 'Ekran', 'Bluetooth', 'Aygıtlar', 'Fare ve dokunmatik yüzey', 'Yazma', 'Köşeler ve kenarlar', 'Güç ve uyku', 'Otomatik Kullan', 'Bilgisayar bilgileri'];
  return {
    html: `<div class="m8 m8-pcs" style="--mc:#4b2c8a"><div class="pcs-l"><h1>Bilgisayar ayarları</h1><div class="pcs-list">${left.map((t, i) => `<button type="button" data-pcs="${i}">${t}</button>`).join('')}</div></div><div class="pcs-r"><p class="m8-p">Soldan bir bölüm seçin. Sürüm bilgisi: <b>Bilgisayar ve aygıtlar → Bilgisayar bilgileri</b>.</p></div></div>`,
    init(b) {
      const r = b.querySelector('.pcs-r'), l = b.querySelector('.pcs-list');
      b.addEventListener('click', (e) => {
        const x = e.target.closest('[data-pcs]');
        if (x) {
          if (x.dataset.pcs !== '0') { api.toast('Bu bölüm bu benzetimde boş. <b>Bilgisayar ve aygıtlar</b>\'ı deneyin.'); return; }
          l.innerHTML = `<button type="button" data-pcb>${I.ln.back} Bilgisayar ve aygıtlar</button>${sub.map((t, i) => `<button type="button" data-sub="${i}">${t}</button>`).join('')}`;
          r.innerHTML = '<p class="m8-p">Soldan <b>Bilgisayar bilgileri</b>\'ni seçin.</p>';
          return;
        }
        if (e.target.closest('[data-pcb]')) { l.innerHTML = left.map((t, i) => `<button type="button" data-pcs="${i}">${t}</button>`).join(''); return; }
        const s = e.target.closest('[data-sub]');
        if (!s) return;
        l.querySelectorAll('[data-sub]').forEach((y) => y.classList.toggle('on', y === s));
        if (s.dataset.sub !== '9') { r.innerHTML = '<p class="m8-p">Bu bölüm bu benzetimde boş.</p>'; return; }
        r.innerHTML = `<h2>Bilgisayar</h2>${specs([['Bilgisayar adı', 'AYSE-PC'], ['İşlemci', 'Intel Core i3 2,40 GHz'], ['Yüklü RAM', '4,00 GB'], ['Sistem türü', '64 bit işletim sistemi']])}<h2>Windows</h2>${specs([['Sürüm', '<b>Windows 8.1</b>'], ['Etkinleştirme', 'Windows etkin']])}`;
        api.emit('os-about');
      });
    },
  };
}

// ==================================================================== WINDOWS 10
const W10_WALL = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs>
  <radialGradient id="w10b" cx="62%" cy="48%" r="75%"><stop offset="0" stop-color="#0a4fb0"/><stop offset=".45" stop-color="#05275f"/><stop offset="1" stop-color="#010b1f"/></radialGradient>
  <linearGradient id="w10p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fd0ff"/><stop offset=".5" stop-color="#2a8dff"/><stop offset="1" stop-color="#0a58d8"/></linearGradient>
  <linearGradient id="w10r" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#5bb8ff" stop-opacity=".55"/><stop offset="1" stop-color="#5bb8ff" stop-opacity="0"/></linearGradient>
  <filter id="w10g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <rect width="960" height="600" fill="url(#w10b)"/>
  <path d="M590 168L0 40V140L590 300z" fill="url(#w10r)" opacity=".55"/><path d="M590 312L0 250V360L590 446z" fill="url(#w10r)" opacity=".5"/><path d="M590 455L0 470V600H120L590 470z" fill="url(#w10r)" opacity=".35"/>
  <g filter="url(#w10g)" opacity=".9"><path d="M590 165L840 95V515L590 465z" fill="#1f7cff"/></g>
  <path d="M590 165L705 133V302L590 305zM715 130L840 95V300L715 302zM590 315L705 312V485L590 465zM715 312L840 310V515L715 488z" fill="url(#w10p)"/></svg>`;
const W10_BLUR = `<div class="blurwall">${W10_WALL}</div>`;
const tile10 = (cls, label, icon, open, extra = '', arg = '') => `<button type="button" class="t10 ${cls}" data-open="${open}"${arg ? ` data-arg="${arg}"` : ''}>${icon ? `<i>${icon}</i>` : ''}${extra}<span>${label}</span></button>`;
const w10 = {
  id: 'w10', name: 'Windows 10', fam: 'win',
  ver: { ed: 'Windows 10 Home', year: 2015, v: '22H2', build: '19045.6456' },
  work: { l: 0, t: 0, r: 0, b: 40 },
  fs: winFs('Bu bilgisayar', 'w10', () => [['Hızlı erişim', 'x:Hızlı erişim', I.ln.star], ...['Masaüstü', 'İndirilenler', 'Belgeler', 'Resimler'].map((n) => [n, n, sideIc('w10')(n), 1]), ['OneDrive', '!OneDrive\'a giriş yapılmamış.', I.weather()], ['Bu bilgisayar', 'pc', I.computer('w10')], ['Ağ', 'x:Ağ', I.ln.net]]),
  apps: {
    files: app('files', 'Dosya Gezgini', I.explorer10(), { v: 'w10', w: 660, h: 410 }),
    notepad: app('notepad', 'Not Defteri', I.notepad('w10'), { v: 'w10', w: 560, h: 360 }),
    browser: app('browser', 'Microsoft Edge', I.edge(), { v: 'edge', w: 740, h: 460, keys: 'internet tarayıcı' }),
    calc: app('calc', 'Hesap Makinesi', I.calc('w10'), { v: 'w10', w: 300, h: 450 }),
    settings: { title: 'Ayarlar', icon: I.gear('#fff', '#0063b1'), w: 760, h: 470, build: settings10 },
    store: app('store', 'Microsoft Store', I.store('w10'), { v: 'w10', w: 720, h: 450 }),
    viewer: app('viewer', 'Fotoğraflar', I.photos(), { v: 'w10', w: 620, h: 420 }),
    hava: { title: 'Hava Durumu', icon: I.weather(), w: 560, h: 330, build: simple(havaHtml, 'wxh-win') },
    takvim: { title: 'Takvim', icon: I.calendar('#0063b1'), w: 420, h: 360, build: simple(() => month(), 'tk-win') },
    posta: yok('Posta', I.mail()),
    paint: yok('Paint', I.paint()),
    saat: yok('Alarmlar ve Saat', I.clockApp()),
  },
  boot: () => `<div class="w8-boot" data-act="skipboot"><i class="w8-blogo">${I.w8logo('#1f8fe0')}</i>${sp('dots')}</div>`,
  lock: () => `<div class="w10-lock" data-act="unlock">${W10_WALL}<div class="w10-time">${clk('hm', 'bigt')}${clk('long')}</div><p class="lk-hint">Kilit ekranı: kaldırmak için tıklayın</p></div>`,
  login: () => `<div class="w10-login">${W10_BLUR}<div class="w10-lg"><i class="w10-av">${I.avatar('round')}</i><b>${USER}</b><div class="w10-pw"><input type="password" placeholder="Parola" aria-label="Parola"><button type="button" data-act="login" title="Oturum aç">${I.ln.fwd}</button></div><small>Parola gerekmez: okla devam edin.</small><a>Oturum açma seçenekleri</a></div><div class="lg-ic">${act('', 'toast', I.ln.net, '', 'Ağa bağlı')}${act('', 'toast', I.ln.access, '', 'Erişim Kolaylığı')}${act('', 'off', I.ln.power)}</div></div>`,
  welcome: () => `<div class="w10-login">${W10_BLUR}<div class="w10-wait">${sp('dots')}<span>Hoş geldiniz</span></div></div>`,
  bye: (api, r) => `<div class="w10-bye">${sp('dots')}<span>${r ? 'Yeniden başlatılıyor' : 'Kapatılıyor'}</span></div>`,
  desk: () => `${W10_WALL}<div class="di-col">${di('Geri Dönüşüm Kutusu', I.bin(false, 'w10'), 'files', 'Çöp')}${di('Bu bilgisayar', I.computer('w10'), 'files', 'pc')}${di('Microsoft Edge', I.edge(), 'browser')}</div>`,
  bar: () => `<div class="os-bar w10-bar"><button type="button" class="w10-sb" data-act="start" title="Başlat">${I.w8logo('#fff')}</button>
    <label class="w10-q os-keep"><i>${I.ln.search}</i><input placeholder="Aramak için buraya yazın" aria-label="Ara"></label>
    <button type="button" class="ob" data-act="toast" data-msg="<b>Görev Görünümü:</b> açık pencereleri ve sanal masaüstlerini gösterir." title="Görev Görünümü">${I.ln.taskview}</button><div class="os-tasks"></div>
    <div class="tray"><button type="button" data-act="toast" data-msg="Gizli simgeler">${I.ln.chevUp}</button>${tray('net', 'vol')}<span class="tr-lang">TUR</span><button type="button" class="tr-clock" data-pop="cal">${clk('hm')}${clk('dmy')}</button><button type="button" class="tr-ac" data-pop="ac" title="Bildirimler">${I.ln.note}</button><button type="button" class="tr-show" data-act="showdesk" title="Masaüstünü göster"></button></div></div>
    <div class="os-pop w10-srch" data-name="srch"><div class="w10-sr"></div></div>
    <div class="os-pop w10-cal" data-name="cal"><div class="cal-big">${clk('hm')}<small>${clk('long2')}</small></div>${month()}</div>
    <div class="os-pop w10-ac" data-name="ac"><h4>Bildirimler</h4><p class="mut">Yeni bildirim yok</p><div class="ac-grid">${[['Tablet modu', 'devices'], ['Ağ', 'net'], ['Tüm ayarlar', 'gear', 'settings'], ['Uçak modu', 'plane'], ['Konum', 'flag'], ['Odak yardımı', 'moon'], ['Gece ışığı', 'bright'], ['Bluetooth', 'bt']].map(([t, i, o]) => o ? item(t, I.ln[i], o) : act(t, 'toggle', I.ln[i], i === 'net' || i === 'bt' ? '' : 'off')).join('')}</div></div>`,
  menu: () => `<div class="os-pop w10-start" data-name="start"><div class="w10s-rail"><button type="button" data-act="toast" data-msg="Menü başlıklarını gösterir." title="Genişlet">${I.ln.menu}</button><span class="rsp"></span>${item('', I.ln.user, 'settings', '', 'rl')}${item('', I.ln.doc, 'files', 'Belgeler', 'rl')}${item('', I.ln.pic, 'files', 'Resimler', 'rl')}${item('', I.ln.gear, 'settings', '', 'rl')}<button type="button" class="rl" data-pop="w10pw" title="Güç">${I.ln.power}</button>
      <div class="os-pop w10-pwr" data-name="w10pw">${act('Uyku', 'sleep', I.ln.moon)}${act('Kapat', 'off', I.ln.power)}${act('Yeniden başlat', 'restart', I.ln.restart)}</div></div>
    <div class="w10s-list"><h6>En çok kullanılanlar</h6>${item('Not Defteri', I.notepad('w10'), 'notepad')}${item('Dosya Gezgini', I.explorer10(), 'files', 'pc')}${item('Hesap Makinesi', I.calc('w10'), 'calc')}
      <h6>A</h6>${item('Alarmlar ve Saat', I.clockApp(), 'saat')}${item('Ayarlar', I.gear('#fff', '#0063b1'), 'settings')}<h6>F</h6>${item('Fotoğraflar', I.photos(), 'viewer', 'Bayram 2025.jpg')}<h6>H</h6>${item('Hava Durumu', I.weather(), 'hava')}${item('Hesap Makinesi', I.calc('w10'), 'calc')}
      <h6>M</h6>${item('Microsoft Edge', I.edge(), 'browser')}${item('Microsoft Store', I.store('w10'), 'store')}<h6>N</h6>${item('Not Defteri', I.notepad('w10'), 'notepad')}<h6>P</h6>${item('Paint', I.paint(), 'paint')}${item('Posta', I.mail(), 'posta')}<h6>T</h6>${item('Takvim', I.calendar('#0063b1'), 'takvim')}</div>
    <div class="w10s-tiles"><h6>Üretkenlik</h6><div class="t10g">${tile10('w', 'Posta', I.mail('#0000'), 'posta', '<em>Tüm e-postalarınız tek yerde</em>')}${tile10('', 'Takvim', '', 'takvim', `<em class="t10-cal"><small>${GUN[new Date().getDay()]}</small><b>${new Date().getDate()}</b></em>`)}${tile10('', 'Microsoft Edge', I.edge(), 'browser')}${tile10('', 'Fotoğraflar', I.photos(), 'viewer', '', 'Bayram 2025.jpg')}${tile10('', 'Ayarlar', I.gear('#fff'), 'settings')}</div>
      <h6>Keşfet</h6><div class="t10g">${tile10('w', 'Microsoft Store', I.store('w10'), 'store')}${tile10('w t10-wx', 'Hava Durumu', '', 'hava', '<em><b>18°</b> Ankara<br>Parçalı bulutlu</em>')}${tile10('', 'Hesap Makinesi', I.calc('w10'), 'calc')}${tile10('', 'Dosya Gezgini', I.explorer10(), 'files', '', 'pc')}</div></div></div>`,
  tasks: (api) => iconTasks(api, ['browser', 'files', 'store']),
  ctx: () => ctxWin('Kişiselleştir', act('Görüntü ayarları', 'ctxok')),
  init(api) {
    const inp = api.q('.w10-q input'), out = api.q('.w10-sr');
    const render = (t) => { out.innerHTML = t.trim() ? `<h6>En iyi eşleşme</h6>${results(api, t)}` : `<h6>Hızlı aramalar</h6><div class="os-res">${item('Hava Durumu', I.weather(), 'hava')}${item('Not Defteri', I.notepad('w10'), 'notepad')}${item('Ayarlar', I.gear('#fff', '#0063b1'), 'settings')}</div>`; };
    render('');
    inp.addEventListener('focus', () => api.pop('srch', true));
    bindSearch(api, inp, out, render);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') out.querySelector('[data-open]')?.click(); });
  },
  onPop(name) { if (name !== 'srch') { const i = document.activeElement; if (i?.closest?.('.w10-q')) i.blur(); } },
};
function settings10(api, A, arg) {
  const cats = [['Sistem', 'Ekran, ses, bildirimler, güç', 'devices'], ['Cihazlar', 'Bluetooth, yazıcılar, fare', 'kbd'], ['Telefon', 'Android cihazınızı bağlayın', 'devices'], ['Ağ ve İnternet', 'Wi-Fi, uçak modu, VPN', 'net'], ['Kişiselleştirme', 'Arka plan, kilit ekranı, renkler', 'pic'], ['Uygulamalar', 'Kaldır, varsayılanlar', 'apps'], ['Hesaplar', 'Hesaplarınız, e-posta, eşitleme', 'user'], ['Saat ve dil', 'Konuşma, bölge, tarih', 'restart'], ['Oyun', 'Xbox Game Bar, yakalamalar', 'eye'], ['Erişim Kolaylığı', 'Ekran okuyucu, büyüteç', 'access'], ['Gizlilik', 'Konum, kamera, mikrofon', 'lock'], ['Güncelleştirme ve Güvenlik', 'Windows Update, kurtarma', 'refresh']];
  const nav = ['Ekran', 'Ses', 'Bildirimler ve eylemler', 'Odak yardımı', 'Güç ve uyku', 'Depolama', 'Tablet', 'Çoklu görev', 'Pano', 'Uzak Masaüstü', 'Hakkında'];
  const home = () => `<div class="s10-home"><h1>Windows Ayarları</h1><label class="s10-q"><input placeholder="Bir ayar bulun"><i>${I.ln.search}</i></label><div class="s10-grid">${cats.map(([t, s, i], n) => `<button type="button" data-s10="${n}"><i>${I.ln[i]}</i><span><b>${t}</b><small>${s}</small></span></button>`).join('')}</div></div>`;
  const page = (k) => `<div class="s10-pg"><nav><button type="button" data-s10="home">${I.ln.home} Giriş</button><label class="s10-q sm"><input placeholder="Bir ayar bulun"><i>${I.ln.search}</i></label><h5>Sistem</h5>${nav.map((t) => `<button type="button" data-s10p="${t}" class="${t === k ? 'on' : ''}">${t}</button>`).join('')}</nav><main>${k === 'Hakkında' ? `<h2>Hakkında</h2><p class="okt">Bilgisayarınız izleniyor ve korunuyor.</p><h3>Cihaz belirtimleri</h3>${specs([['Cihaz adı', 'AYSE-PC'], ['İşlemci', 'Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz'], ['Yüklü RAM', '8,00 GB'], ['Sistem türü', '64 bit işletim sistemi, x64 tabanlı işlemci']])}<h3>Windows belirtimleri</h3>${specs([['Sürüm', `<b>${api.os.ver.ed}</b>`], ['Sürüm', api.os.ver.v], ['Yükleme tarihi', installDate], ['İS derlemesi', api.os.ver.build]])}` : k === 'Ekran' ? `<h2>Ekran</h2><h3>Parlaklık ve renk</h3><input type="range" value="70"><h3>Ölçek ve düzen</h3><p>Metin, uygulama ve diğer öğelerin boyutu: <b>%125 (Önerilen)</b></p><p>Ekran çözünürlüğü: <b>1920 × 1080 (Önerilen)</b></p>` : `<h2>${k}</h2><p class="mut">Bu bölüm bu benzetimde boş. Soldan <b>Hakkında</b>'yı deneyin.</p>`}</main></div>`;
  return {
    html: '<div class="s10"></div>',
    init(b, w) {
      const go = (k) => { b.firstElementChild.innerHTML = k === 'home' ? home() : page(k); w.setTitle('Ayarlar'); if (k === 'Hakkında') api.emit('os-about'); };
      go(arg === 'system' ? 'Hakkında' : 'home');
      w.arg = (a) => go(a === 'system' ? 'Hakkında' : 'home');
      b.addEventListener('click', (e) => {
        const c = e.target.closest('[data-s10]');
        if (c) { const k = c.dataset.s10; if (k === 'home') go('home'); else if (k === '0') go('Ekran'); else api.toast('Bu bölüm bu benzetimde boş. <b>Sistem</b>\'i deneyin.'); return; }
        const p = e.target.closest('[data-s10p]');
        if (p) go(p.dataset.s10p);
      });
    },
  };
}

// ==================================================================== WINDOWS 11
const W11_WALL = (dark) => `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs>
  <linearGradient id="w11b${dark ? 'd' : ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? '#0b1a33' : '#dbe8f7'}"/><stop offset="1" stop-color="${dark ? '#13305c' : '#a9c8ec'}"/></linearGradient>
  <linearGradient id="w11p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c7e4ff"/><stop offset=".45" stop-color="#3b8ef0"/><stop offset="1" stop-color="#0a3fb3"/></linearGradient>
  <linearGradient id="w11q" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset=".6" stop-color="#1f6fe0"/><stop offset="1" stop-color="#062f8f"/></linearGradient></defs>
  <rect width="960" height="600" fill="url(#w11b${dark ? 'd' : ''})"/>
  <g transform="translate(480 330)">${[-75, -45, -15, 15, 45, 75].map((r, i) => `<path d="M0 40C-70 -20-60-170 0-230C60-170 70-20 0 40z" fill="url(#${i % 2 ? 'w11q' : 'w11p'})" opacity=".92" transform="rotate(${r}) scale(${1 - Math.abs(r) / 400})"/>`).join('')}
  <path d="M0 40C-90 0-110-120-60-190C-20-110 20-110 60-190 110-120 90 0 0 40z" fill="url(#w11p)" opacity=".75"/></g></svg>`;
const W11_BLUR = `<div class="blurwall">${W11_WALL(false)}</div>`;
const pin11 = [['browser', 'Edge'], ['posta', 'Outlook'], ['store', 'Microsoft Store'], ['viewer', 'Fotoğraflar', 'Bayram 2025.jpg'], ['settings', 'Ayarlar'], ['calc', 'Hesap Makinesi'], ['saat', 'Saat'], ['notepad', 'Not Defteri'], ['paint', 'Paint'], ['files', 'Dosya Gezgini', 'pc'], ['takvim', 'Takvim'], ['hava', 'Hava Durumu'], ['kamera', 'Kamera'], ['film', 'Film ve TV'], ['solitaire', 'Solitaire']];
const w11 = {
  id: 'w11', name: 'Windows 11', fam: 'win',
  ver: { ed: 'Windows 11 Home', year: 2021, v: '24H2', build: '26100.6899' },
  work: { l: 0, t: 0, r: 0, b: 48 },
  fs: winFs('Bu bilgisayar', 'w11', () => [['Ana Sayfa', 'x:Ana Sayfa', I.ln.home], ['Galeri', 'x:Galeri', I.ln.pic], ['-'], ...USERS.map((n) => [n, n, sideIc('w11')(n)]), ['-'], ['Bu bilgisayar', 'pc', I.computer('w11')], ['Ağ', 'x:Ağ', I.ln.net]]),
  apps: {
    files: app('files', 'Dosya Gezgini', I.explorer11(), { v: 'w11', w: 680, h: 420 }),
    notepad: app('notepad', 'Not Defteri', I.notepad('w11'), { v: 'w11', w: 580, h: 370 }),
    browser: app('browser', 'Microsoft Edge', I.edge(), { v: 'edge', w: 740, h: 460, keys: 'internet tarayıcı' }),
    calc: app('calc', 'Hesap Makinesi', I.calc('w11'), { v: 'w11', w: 300, h: 450 }),
    settings: { title: 'Ayarlar', icon: I.gear11(), w: 780, h: 480, build: settings11 },
    store: app('store', 'Microsoft Store', I.store('w11'), { v: 'w11', w: 720, h: 450 }),
    viewer: app('viewer', 'Fotoğraflar', I.photos(), { v: 'w11', w: 620, h: 420 }),
    hava: { title: 'Hava Durumu', icon: I.weather(), w: 560, h: 330, build: simple(havaHtml, 'wxh-win') },
    takvim: { title: 'Takvim', icon: I.calendar('#0067c0'), w: 420, h: 360, build: simple(() => month(), 'tk-win') },
    posta: yok('Outlook', I.mail()),
    saat: yok('Saat', I.clockApp()),
    paint: yok('Paint', I.paint()),
    kamera: yok('Kamera', I.camera(), 'Bu bilgisayarda kamera bulunamadı.'),
    film: yok('Film ve TV', I.film()),
    solitaire: yok('Solitaire', I.solitaire()),
  },
  boot: () => `<div class="w8-boot" data-act="skipboot"><i class="w8-blogo">${I.w11logo()}</i>${sp('dots')}</div>`,
  lock: () => `<div class="w11-lock" data-act="unlock">${W11_WALL(false)}<div class="w11-time">${clk('long2')}${clk('hm', 'bigt')}</div><p class="lk-hint">Kilit ekranı: kaldırmak için tıklayın</p></div>`,
  login: () => `<div class="w11-login">${W11_BLUR}<div class="w10-lg"><i class="w10-av">${I.avatar('round')}</i><b>${USER}</b><div class="w10-pw w11-pw"><input type="password" placeholder="PIN" aria-label="PIN"><button type="button" data-act="login" title="Oturum aç">${I.ln.fwd}</button></div><small>PIN gerekmez: okla devam edin.</small><a>Oturum açma seçenekleri</a></div><div class="lg-ic">${act('', 'toast', I.ln.wifi, '', 'Wi-Fi bağlı')}${act('', 'toast', I.ln.access, '', 'Erişilebilirlik')}${act('', 'off', I.ln.power)}</div></div>`,
  welcome: () => `<div class="w11-login">${W11_BLUR}<div class="w10-wait">${sp('dots')}<span>Hoş geldiniz</span></div></div>`,
  bye: (api, r) => `<div class="w11-login">${W11_BLUR}<div class="w10-wait">${sp('dots')}<span>${r ? 'Yeniden başlatılıyor' : 'Kapatılıyor'}</span></div></div>`,
  desk: () => `${W11_WALL(false)}<div class="di-col">${di('Geri Dönüşüm Kutusu', I.bin(false, 'w10'), 'files', 'Çöp')}${di('Bu bilgisayar', I.computer('w11'), 'files', 'pc')}${di('Microsoft Edge', I.edge(), 'browser')}</div>`,
  bar: () => `<div class="os-bar w11-bar"><button type="button" class="w11-wid" data-pop="wid">${I.weather()}<span><b>18°C</b><small>Parçalı bulutlu</small></span></button>
    <div class="w11-mid"><button type="button" class="ob w11-sb" data-act="start" title="Başlat">${I.w11logo()}</button><button type="button" class="w11-q" data-act="w11q"><i>${I.ln.search}</i><span>Ara</span></button><button type="button" class="ob" data-act="toast" data-msg="<b>Görev görünümü:</b> açık pencereler ve masaüstleri." title="Görev görünümü">${I.ln.taskview}</button><div class="os-tasks"></div></div>
    <div class="tray"><button type="button" data-act="toast" data-msg="Gizli simgeler">${I.ln.chevUp}</button><span class="tr-lang">TUR</span><button type="button" class="w11-qs" data-pop="qs" title="Hızlı ayarlar">${tray('wifi', 'vol', 'bat')}</button><button type="button" class="tr-clock" data-pop="cal">${clk('hm')}${clk('dmy')}</button><button type="button" class="w11-bell" data-pop="cal" title="Bildirimler">${I.ln.bell}</button></div></div>
    <div class="os-pop w11-qsp" data-name="qs"><div class="qs-grid">${[['Wi-Fi', 'wifi', 1], ['Bluetooth', 'bt', 1], ['Uçak modu', 'plane'], ['Pil tasarrufu', 'leaf'], ['Odak', 'moon'], ['Erişilebilirlik', 'access']].map(([t, i, on]) => act(t, 'toggle', I.ln[i], on ? '' : 'off')).join('')}</div><label class="qs-sl"><i>${I.ln.bright}</i><input type="range" value="70"></label><label class="qs-sl"><i>${I.ln.vol}</i><input type="range" value="40"></label><div class="qs-bot"><span>${I.ln.bat} %80</span>${item('', I.ln.gear, 'settings')}</div></div>
    <div class="os-pop w11-calp" data-name="cal"><div class="w11-ntf"><b>Bildirimler</b><p class="mut">Yeni bildirim yok</p></div><div class="w11-calc"><b>${clk('long2')}</b>${month()}</div></div>
    <div class="os-pop w11-widp" data-name="wid"><h4>${clk('hm')}</h4><div class="wg-card">${havaHtml()}</div><div class="wg-card wg-news"><b>Haberler</b><p>Emekliler için ücretsiz bilgisayar kursu başlıyor</p><p>Hafta sonu hava ısınıyor</p></div></div>`,
  menu: () => `<div class="os-pop w11-start" data-name="start"><label class="w11s-q"><i>${I.ln.search}</i><input class="os-auto" placeholder="Uygulamaları, ayarları ve belgeleri arayın"></label>
    <div class="w11s-main"><div class="w11s-h"><b>Sabitlenmiş</b><button type="button" data-act="w11all">Tüm uygulamalar ${I.ln.chevRight}</button></div><div class="w11s-pin">${pin11.map(([k, t, a]) => `<button type="button" data-open="${k}"${a ? ` data-arg="${a}"` : ''}><i>@@${k}</i><span>${t}</span></button>`).join('')}</div>
      <div class="w11s-h"><b>Önerilen</b><button type="button" data-act="toast" data-msg="Daha fazla öneri yok.">Diğer ${I.ln.chevRight}</button></div><div class="w11s-rec">${[['Alışveriş listesi.txt', 'txt', '2 saat önce'], ['Bayram 2025.jpg', 'jpg', 'Dün 18:20'], ['Dilekçe.docx', 'docx', '12 Ekim'], ['Fatura_Ekim.pdf', 'pdf', '10 Ekim']].map(([n, e, t]) => `<button type="button" data-act="w11rec" data-f="${n}"><i>${I.file(e)}</i><span>${n}<small>${t}</small></span></button>`).join('')}</div></div>
    <div class="w11s-all"><div class="w11s-h"><b>Tüm uygulamalar</b><button type="button" data-act="w11all">${I.ln.chevLeft} Geri</button></div><div class="w11s-list"></div></div>
    <div class="w11s-res"></div>
    <div class="w11s-foot"><span class="w11s-me"><i>${I.avatar('round')}</i>${USER}</span><button type="button" data-pop="w11pw" title="Güç">${I.ln.power}</button><div class="os-pop w11-pwr" data-name="w11pw">${act('Kilitle', 'lock', I.ln.lock)}${act('Uyku', 'sleep', I.ln.moon)}${act('Kapat', 'off', I.ln.power)}${act('Yeniden başlat', 'restart', I.ln.restart)}</div></div></div>`,
  tasks: (api) => iconTasks(api, ['files', 'browser', 'store']),
  ctx: () => `${act('Görünüm', 'ctxok', I.ln.view, 'sub')}${act('Sıralama ölçütü', 'ctxok', I.ln.sort, 'sub')}${act('Yenile', 'ctxok', I.ln.refresh)}<hr>${act('Yeni', 'ctxok', I.ln.plus, 'sub')}<hr>${item('Görüntü ayarları', I.ln.view, 'settings')}${item('Kişiselleştir', I.ln.pic, 'settings')}<hr>${act('Daha fazla seçenek göster', 'ctxok', I.ln.dots)}`,
  init(api) {
    const m = api.q('.w11-start');
    m.querySelectorAll('.w11s-pin i').forEach((i) => { const k = i.textContent.slice(2); i.innerHTML = api.os.apps[k]?.icon || ''; });
    const all = Object.entries(api.os.apps).filter(([, A]) => !A.hide).sort((a, b) => a[1].title.localeCompare(b[1].title, 'tr'));
    let last = '';
    m.querySelector('.w11s-list').innerHTML = all.map(([k, A]) => { const L = A.title[0].toLocaleUpperCase('tr'); const h = L !== last ? `<h6>${L}</h6>` : ''; last = L; return `${h}<button type="button" data-open="${k}"${k === 'viewer' ? ' data-arg="Bayram 2025.jpg"' : ''}><i>${A.icon}</i><span>${A.title}</span></button>`; }).join('');
    const inp = m.querySelector('.w11s-q input'), res = m.querySelector('.w11s-res');
    bindSearch(api, inp, res, (t) => { m.classList.toggle('srch', !!t.trim()); res.innerHTML = t.trim() ? `<h6>En iyi eşleşme</h6>${results(api, t)}` : ''; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') res.querySelector('[data-open]')?.click(); });
  },
  onPop(name, el) { if (name === 'start') { el.classList.remove('all', 'srch'); el.querySelector('.w11s-q input').value = ''; } },
  act(name, el, api) {
    if (name === 'w11all') api.q('.w11-start').classList.toggle('all');
    else if (name === 'w11q') { api.pop('start', true); api.q('.w11s-q input').focus({ preventScroll: true }); }
    else if (name === 'w11rec') { const f = el.dataset.f; if (f.endsWith('.txt')) api.open('notepad', { name: f, text: 'Alışveriş listesi\n\n- 2 ekmek\n- 1 kg domates\n- Süt\n- Peynir\n- Çay' }); else if (f.endsWith('.jpg')) api.open('viewer', f); else { api.closePops(); api.toast(`“${f}” bu benzetimde açılmaz.`); } }
  },
};
function settings11(api, A, arg) {
  const nav = [['Giriş', 'home'], ['Sistem', 'devices'], ['Bluetooth ve cihazlar', 'bt'], ['Ağ ve internet', 'wifi'], ['Kişiselleştirme', 'pic'], ['Uygulamalar', 'apps'], ['Hesaplar', 'user'], ['Zaman ve dil', 'restart'], ['Oyun', 'eye'], ['Erişilebilirlik', 'access'], ['Gizlilik ve güvenlik', 'lock'], ['Windows Update', 'refresh']];
  const rows = [['Ekran', 'Monitörler, parlaklık, gece ışığı', 'view'], ['Ses', 'Ses düzeyleri, çıkış, giriş', 'vol'], ['Bildirimler', 'Uygulama ve sistem uyarıları', 'bell'], ['Güç ve pil', 'Uyku, pil kullanımı', 'bat'], ['Depolama', 'Depolama alanı, sürücüler', 'doc'], ['Çoklu görev', 'Pencereleri yasla, masaüstleri', 'taskview'], ['Pano', 'Kes ve kopyala geçmişi', 'paste'], ['Hakkında', 'Cihaz belirtimleri, bilgisayarı yeniden adlandırma, Windows belirtimleri', 'info']];
  const sys = () => `<h1>Sistem</h1><div class="s11-dev"><i>${I.computer('w11')}</i><span><b>AYSE-PC</b><small>Masaüstü bilgisayar</small><a>Yeniden adlandır</a></span><em>${I.ln.refresh} Windows Update<small>Son denetim: 1 saat önce</small></em></div><div class="s11-rows">${rows.map(([t, s, i]) => `<button type="button" data-s11r="${t}"><i>${I.ln[i]}</i><span><b>${t}</b><small>${s}</small></span>${I.ln.chevRight}</button>`).join('')}</div>`;
  const about = () => `<h1><span class="s11-bc">Sistem</span> ${I.ln.chevRight} Hakkında</h1><div class="s11-dev"><i>${I.computer('w11')}</i><span><b>AYSE-PC</b><small>Masaüstü bilgisayar</small></span></div><div class="s11-card"><h3>${I.ln.info} Cihaz belirtimleri</h3>${specs([['Cihaz adı', 'AYSE-PC'], ['İşlemci', '12th Gen Intel(R) Core(TM) i5-1235U 1.30 GHz'], ['Yüklü RAM', '16,0 GB'], ['Sistem türü', '64 bit işletim sistemi, x64 tabanlı işlemci']])}</div><div class="s11-card"><h3>${I.w11logo()} Windows belirtimleri</h3>${specs([['Sürüm', `<b>${api.os.ver.ed}</b>`], ['Sürüm', api.os.ver.v], ['Yükleme tarihi', installDate], ['İS derlemesi', api.os.ver.build]])}</div>`;
  const home = () => `<h1>Giriş</h1><div class="s11-dev"><i>${I.computer('w11')}</i><span><b>AYSE-PC</b><small>Masaüstü bilgisayar</small></span></div><p class="mut">Önerilen ayarlar burada görünür. Sürüm bilgisi için soldan <b>Sistem</b>'i, sonra <b>Hakkında</b>'yı seçin.</p>`;
  return {
    html: `<div class="s11"><nav><div class="s11-me"><i>${I.avatar('round')}</i><span><b>${USER}</b><small>Yerel Hesap</small></span></div><label class="s11-q"><input placeholder="Ayar bulun"><i>${I.ln.search}</i></label>${nav.map(([t, i], n) => `<button type="button" data-s11="${n}"><i>${I.ln[i]}</i>${t}</button>`).join('')}</nav><main></main></div>`,
    init(b, w) {
      const main = b.querySelector('main');
      const go = (k) => {
        main.innerHTML = k === 'about' ? about() : k === 'sys' ? sys() : home();
        b.querySelectorAll('[data-s11]').forEach((x) => x.classList.toggle('on', x.dataset.s11 === (k === 'home' ? '0' : '1')));
        if (k === 'about') api.emit('os-about');
      };
      go(arg === 'system' ? 'about' : 'sys');
      w.arg = (a) => go(a === 'system' ? 'about' : 'sys');
      b.addEventListener('click', (e) => {
        const n = e.target.closest('[data-s11]');
        if (n) { const k = n.dataset.s11; if (k === '0') go('home'); else if (k === '1') go('sys'); else api.toast('Bu bölüm bu benzetimde boş. <b>Sistem</b>\'i deneyin.'); return; }
        if (e.target.closest('.s11-bc')) { go('sys'); return; }
        const r = e.target.closest('[data-s11r]');
        if (r) { if (r.dataset.s11r === 'Hakkında') go('about'); else api.toast(`<b>${r.dataset.s11r}</b> bu benzetimde boş. <b>Hakkında</b>'yı deneyin.`); }
      });
    },
  };
}

// ==================================================================== UBUNTU (Linux)
const UBU_WALL = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ubw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e95420"/><stop offset=".45" stop-color="#a1235a"/><stop offset="1" stop-color="#2c001e"/></linearGradient><radialGradient id="ubj" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffb38f" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a4d" stop-opacity="0"/></radialGradient></defs>
  <rect width="960" height="600" fill="url(#ubw)"/><path d="M0 600L420 0H560L140 600z" fill="#fff" opacity=".04"/><path d="M300 600L720 0H780L360 600z" fill="#fff" opacity=".05"/>
  <g transform="translate(560 250)" opacity=".85"><ellipse rx="120" ry="90" fill="url(#ubj)"/><path d="M-90 0C-90-70 90-70 90 0C60-10-60-10-90 0z" fill="#ffd2bd" opacity=".35"/>${[-70, -40, -10, 20, 50, 75].map((x, i) => `<path d="M${x} 0C${x - 10} 60 ${x + 20} 110 ${x} ${170 + i * 8}" fill="none" stroke="#ffd2bd" stroke-opacity=".35" stroke-width="3"/>`).join('')}</g>
</svg>`;
const ubuDock = ['browser', 'posta', 'files', 'muzik', 'writer', 'store', 'yardim'];
const ubu = {
  id: 'lnx', name: 'Ubuntu (Linux)', fam: 'lnx',
  work: { l: 58, t: 28, r: 0, b: 0 },
  fs: { root: 'home', pcName: 'Bilgisayar', homeName: 'Ev', trashName: 'Çöp', folder: 'yaru', user: 'ayse', host: 'ayse-pc', hostLower: 'ayse-pc', osRelease: 'PRETTY_NAME="Ubuntu 22.04.5 LTS"<br>NAME="Ubuntu"<br>VERSION_ID="22.04"<br>VERSION="22.04.5 LTS (Jammy Jellyfish)"<br>ID=ubuntu<br>ID_LIKE=debian', side: () => [['Son Kullanılanlar', 'x:Son Kullanılanlar', I.ln.restart], ['Yıldızlı', 'x:Yıldızlı', I.ln.star], ['Ev', 'home', I.ln.home], ...['Belgeler', 'İndirilenler', 'Müzik', 'Resimler', 'Videolar'].map((n) => [n, n, I.ln[{ Belgeler: 'doc', İndirilenler: 'chevDown', Müzik: 'vol', Resimler: 'pic', Videolar: 'eye' }[n]]]), ['Çöp', 'Çöp', I.ln.trash], ['-'], ['Diğer Konumlar', 'root', I.ln.plus]] },
  apps: {
    browser: app('browser', 'Firefox', I.firefox(), { v: 'ff', w: 740, h: 470, keys: 'internet tarayıcı web' }),
    files: app('files', 'Dosyalar', I.files(), { v: 'gnome', w: 660, h: 420, keys: 'nautilus klasör' }),
    notepad: app('notepad', 'Metin Düzenleyici', I.texteditor(), { v: 'gnome', w: 560, h: 380, keys: 'not defteri gedit' }),
    terminal: app('terminal', 'Uçbirim', I.terminal(), { v: 'lnx', w: 600, h: 360, keys: 'terminal komut' }),
    calc: app('calc', 'Hesap Makinesi', I.calc('lnx'), { v: 'gnome', w: 300, h: 430 }),
    writer: app('writer', 'LibreOffice Writer', I.writer(), { w: 700, h: 450, keys: 'word kelime işlemci' }),
    store: app('store', 'Ubuntu Yazılım', I.appcenter(), { v: 'gnome', w: 720, h: 450, keys: 'mağaza uygulama' }),
    settings: { title: 'Ayarlar', icon: I.gear('#fff', '#5e5e5e'), w: 760, h: 470, build: settingsUbu },
    viewer: app('viewer', 'Görüntü Görüntüleyici', I.photos(), { v: 'gnome', w: 620, h: 420, hide: true }),
    posta: yok('Thunderbird Posta', I.thunderbird()),
    muzik: yok('Rhythmbox', I.music()),
    yardim: yok('Yardım', I.help(), '<b>Yardım:</b> Ubuntu kullanım kılavuzu. Bu benzetimde açılmıyor.'),
  },
  boot: () => `<div class="ubu-boot" data-act="skipboot">${sp('ring')}<div class="ubu-word">${I.ubuntu('')}<b>ubuntu</b></div></div>`,
  login: () => `<div class="ubu-login"><div class="ubu-gtop"><span></span>${clk('gnome')}<span>${tray('net', 'vol', 'power')}</span></div><div class="ubu-lg"><i class="ubu-av">${I.avatar('round')}</i><b>${USER}</b><div class="ubu-pw"><input type="password" placeholder="Parola" aria-label="Parola"><button type="button" data-act="login" title="Oturum aç">${I.ln.fwd}</button></div><small>Parola gerekmez: Enter'a ya da oka basın.</small></div><div class="ubu-brand">${I.ubuntu('')}<b>ubuntu</b></div></div>`,
  bye: (api, r) => `<div class="ubu-boot">${sp('ring')}<div class="ubu-word">${I.ubuntu('')}<b>ubuntu</b></div><p>${r ? 'Yeniden başlatılıyor' : 'Kapatılıyor'}</p></div>`,
  desk: () => `${UBU_WALL}<div class="di-col ubu-icons">${di('Ev', I.folder('yaru', 'home'), 'files', 'home')}${di('Çöp', I.bin(false, 'w10'), 'files', 'Çöp')}</div>`,
  bar: () => `<div class="os-bar ubu-top"><button type="button" class="ubu-act" data-act="ov">Etkinlikler</button><button type="button" class="ubu-clock" data-pop="cal">${clk('gnome')}</button><button type="button" class="ubu-sys" data-pop="sys">${tray('net', 'vol', 'power')}${I.ln.chevDown}</button></div>
    <div class="ubu-dock"><div class="os-tasks"></div><button type="button" class="ubu-grid" data-act="apps" title="Uygulamaları Göster">${I.ln.grid9}</button></div>
    <div class="os-pop ubu-calp" data-name="cal"><div class="ubu-ntf">${I.ln.bell}<b>Bildirim Yok</b></div><div><small>${clk('long2')}</small>${month()}</div></div>
    <div class="os-pop ubu-sysp" data-name="sys"><label class="qs-sl"><i>${I.ln.vol}</i><input type="range" value="50"></label><hr>${act('Kablolu Bağlantı: Bağlı', 'toast', I.ln.net, 'sub', 'Ethernet bağlı')}${act('Bluetooth Kapalı', 'toast', I.ln.bt, 'sub')}${act('Güç Modu: Dengeli', 'toast', I.ln.bat, 'sub')}<hr>${item('Ayarlar', I.ln.gear, 'settings')}${act('Kilitle', 'lock', I.ln.lock)}<hr>
      <button type="button" class="sub" data-pop="ubupw"><i>${I.ln.power}</i><span>Kapat / Oturumu Kapat</span></button><div class="os-pop ubu-pwm" data-name="ubupw">${act('Askıya Al', 'sleep')}${act('Yeniden Başlat…', 'ubudlg', '', '', 'restart')}${act('Kapat…', 'ubudlg', '', '', 'off')}<hr>${act('Oturumu Kapat', 'logout')}</div></div>
    <div class="os-pop ubu-dlg" data-name="ubudlg"><div><h3></h3><p></p><div class="ubu-dlb">${act('İptal', 'ctxok')}<button type="button" class="ubu-dgo" data-act="off"><span>Kapat</span></button></div></div></div>`,
  extra: () => `<div class="ubu-ov"><label class="ubu-ovq"><i>${I.ln.search}</i><input placeholder="Aramak için yazın" aria-label="Ara"></label><div class="ubu-ws"></div><div class="ubu-grid-apps"></div><div class="ubu-ovres"></div></div>`,
  tasks(api) {
    const open = [...new Set(api.st.wins.map((w) => w.app))];
    return [...ubuDock, ...open.filter((a) => !ubuDock.includes(a))].map((a) => {
      const A = api.os.apps[a], n = api.running(a).length;
      return `<button type="button" class="udk${n ? ' run' : ''}${api.isActive(a) ? ' act' : ''}" data-task="${a}" title="${esc(A.title)}"><i>${A.icon}</i>${n ? `<em>${'<b></b>'.repeat(Math.min(n, 3))}</em>` : ''}</button>`;
    }).join('') + `<hr><button type="button" class="udk" data-open="files" data-arg="Çöp" title="Çöp"><i>${I.bin(false, 'w10')}</i></button>`;
  },
  ctx: () => `${act('Yeni Klasör', 'ctxok')}<hr>${act('Yapıştır', 'ctxok', '', 'dis')}<hr>${act('Masaüstünü Dosyalar\'da Göster', 'ctxok')}${item('Uçbirimde Aç', '', 'terminal')}<hr>${item('Arka Planı Değiştir…', '', 'settings')}${item('Masaüstü Simgesi Ayarları', '', 'settings')}${item('Görüntü Ayarları', '', 'settings')}`,
  init(api) {
    const ov = api.q('.ubu-ov'), inp = ov.querySelector('input'), res = ov.querySelector('.ubu-ovres');
    const grid = ov.querySelector('.ubu-grid-apps');
    grid.innerHTML = Object.entries(api.os.apps).filter(([, A]) => !A.hide).sort((a, b) => a[1].title.localeCompare(b[1].title, 'tr')).map(([k, A]) => `<button type="button" data-open="${k}"><i>${A.icon}</i><span>${A.title}</span></button>`).join('');
    bindSearch(api, inp, res, (t) => { ov.classList.toggle('srch', !!t.trim()); res.innerHTML = t.trim() ? results(api, t, 'ubu-r') : ''; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') res.querySelector('[data-open]')?.click(); if (e.key === 'Escape') ubuOv(api, null); });
    ov.addEventListener('click', (e) => {
      const wcard = e.target.closest('[data-wid]');
      if (wcard) { const w = api.winById(wcard.dataset.wid); ubuOv(api, null); if (w) api.restore(w); return; }
      if (!e.target.closest('button, input, label')) ubuOv(api, null);
    });
  },
  onOpen(api) { ubuOv(api, null); },
  taskShown(api) { ubuOv(api, null); },
  act(name, el, api) {
    if (name === 'ov') ubuOv(api, api.st.ov ? null : 'ov');
    else if (name === 'apps') ubuOv(api, api.st.ov === 'apps' ? null : 'apps');
    else if (name === 'ubudlg') {
      const k = el.dataset.msg, d = api.q('.ubu-dlg');
      d.querySelector('h3').textContent = k === 'off' ? 'Kapat' : 'Yeniden Başlat';
      d.querySelector('p').textContent = `Sistem 60 saniye içinde otomatik olarak ${k === 'off' ? 'kapanacak' : 'yeniden başlayacak'}.`;
      const go = d.querySelector('.ubu-dgo'); go.dataset.act = k; go.querySelector('span').textContent = k === 'off' ? 'Kapat' : 'Yeniden Başlat';
      api.pop('ubudlg', true);
    }
  },
};
function ubuOv(api, mode) {
  const ov = api.q('.ubu-ov');
  if (!ov) return;
  api.st.ov = mode;
  ov.className = `ubu-ov${mode ? ' on ' + mode : ''}`;
  api.q('.ubu-act')?.classList.toggle('on', !!mode);
  api.q('.ubu-grid')?.classList.toggle('on', mode === 'apps');
  if (!mode) return;
  const inp = ov.querySelector('input'); inp.value = ''; ov.querySelector('.ubu-ovres').innerHTML = '';
  const ws = ov.querySelector('.ubu-ws');
  const sx = 0.62;
  ws.innerHTML = `<div class="ubu-wsd">${api.st.wins.filter((w) => !w.min).map((w) => { const r = w.el.getBoundingClientRect(), s = api.scr.getBoundingClientRect(), k = api.k; return `<button type="button" class="ubu-wc" data-wid="${w.id}" style="left:${((r.left - s.left) / k - 58) * sx}px;top:${((r.top - s.top) / k - 28) * sx}px;width:${r.width / k * sx}px;height:${r.height / k * sx}px;z-index:${w.el.style.zIndex}"><i>${w.icon}</i><span>${esc(w.title)}</span></button>`; }).join('') || '<p>Açık pencere yok. Soldaki çubuktan bir uygulama açın.</p>'}</div>`;
  setTimeout(() => inp.focus({ preventScroll: true }), 50);
  api.emit('os-overview', { mode });
  api.emit('os-start');
}
function settingsUbu(api, A, arg) {
  const nav = [['Ağ', 'net'], ['Bluetooth', 'bt'], ['Arka Plan', 'pic'], ['Görünüm', 'view'], ['Bildirimler', 'bell'], ['Arama', 'search'], ['Uygulamalar', 'apps'], ['Gizlilik', 'lock'], ['Ses', 'vol'], ['Güç', 'bat'], ['Ekranlar', 'devices'], ['Fare ve Dokunmatik Yüzey', 'eye'], ['Klavye', 'kbd'], ['Yazıcılar', 'doc'], ['Bölge ve Dil', 'flag'], ['Erişilebilirlik', 'access'], ['Kullanıcılar', 'user'], ['Tarih ve Saat', 'restart'], ['Hakkında', 'info']];
  const page = (k) => k === 'Hakkında'
    ? `<div class="us-about"><i>${I.ubuntu()}</i><b class="us-ub">ubuntu</b><div class="us-box">${specs([['Cihaz Adı', 'ayse-pc'], ['Bellek', '8,0 GiB'], ['İşlemci', 'Intel® Core™ i5-7200U CPU @ 2.50GHz × 4'], ['Grafik', 'Mesa Intel® HD Graphics 620'], ['Disk Kapasitesi', '500,1 GB']])}</div><div class="us-box">${specs([['İşletim Sistemi Adı', '<b>Ubuntu 22.04.5 LTS</b>'], ['İşletim Sistemi Türü', '64 bit'], ['GNOME Sürümü', '42.9'], ['Pencere Sistemi', 'Wayland']])}</div></div>`
    : k === 'Arka Plan' ? `<div class="us-bg"><div class="us-prev">${UBU_WALL}</div><div class="us-th">${['#e95420,#77216f', '#2c001e,#5e2750', '#0b6fb8,#1a2a6c', '#2f9a4a,#0b3d2c', '#f2b200,#e95420', '#444,#111'].map((g) => `<i style="background:linear-gradient(135deg,${g})"></i>`).join('')}</div></div>`
      : `<p class="mut">Bu bölüm bu benzetimde boş. Aşağıdaki <b>Hakkında</b>'yı deneyin.</p>`;
  return {
    head: { left: `<span class="hb-btns us-hl" data-nodrag><button type="button" data-mi="Ara" title="Ara">${I.ln.search}</button><b>Ayarlar</b><button type="button" data-mi="Menü" title="Menü">${I.ln.menu}</button></span>`, title: '<span class="us-t">Arka Plan</span>' },
    html: `<div class="usu"><nav>${nav.map(([t, i]) => `<button type="button" data-su="${t}"><i>${I.ln[i]}</i>${t}</button>`).join('')}</nav><main></main></div>`,
    init(b, w) {
      const go = (k) => { b.querySelector('main').innerHTML = page(k); w.el.querySelector('.us-t').textContent = k; b.querySelectorAll('[data-su]').forEach((x) => x.classList.toggle('on', x.dataset.su === k)); if (k === 'Hakkında') { api.emit('os-about'); b.querySelector('nav').scrollTop = 9999; } };
      go(arg === 'system' ? 'Hakkında' : 'Arka Plan');
      w.arg = (a) => go(a === 'system' ? 'Hakkında' : 'Arka Plan');
      b.addEventListener('click', (e) => { const x = e.target.closest('[data-su]'); if (x) go(x.dataset.su); });
    },
  };
}

// ==================================================================== PARDUS (XFCE)
const PRD_WALL = `<svg class="wall" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="pdw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d2b4e"/><stop offset=".6" stop-color="#0a1c36"/><stop offset="1" stop-color="#050d1c"/></linearGradient><linearGradient id="pdl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2fb5d6" stop-opacity="0"/><stop offset=".5" stop-color="#46c7e8" stop-opacity=".7"/><stop offset="1" stop-color="#f7a823" stop-opacity=".2"/></linearGradient></defs>
  <rect width="960" height="600" fill="url(#pdw)"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M-40 ${300 + i * 16}C200 ${180 + i * 24} 520 ${470 - i * 10} 1000 ${250 + i * 20}" fill="none" stroke="url(#pdl)" stroke-width="${2.6 - i * 0.22}" opacity="${0.85 - i * 0.08}"/>`).join('')}
  <g opacity=".95">${place(I.pardus(), 432, 150, 96, 96)}</g><text x="480" y="282" text-anchor="middle" fill="#e8f1fb" font-size="30" font-weight="300" font-family="Ubuntu, Noto Sans, sans-serif" letter-spacing="2">Pardus</text></svg>`;
const CATS = {
  Favoriler: ['browser', 'files', 'writer', 'terminal', 'settings', 'store'],
  'Tüm Uygulamalar': null,
  Aksesuarlar: ['calc', 'notepad', 'files', 'ekran'],
  İnternet: ['browser', 'posta'],
  Ofis: ['writer', 'calcsheet'],
  'Ses ve Video': ['muzik'],
  Sistem: ['terminal', 'store', 'about'],
  Ayarlar: ['settings'],
};
const prd = {
  id: 'prd', name: 'Pardus', fam: 'lnx',
  work: { l: 0, t: 0, r: 0, b: 38 },
  fs: { root: 'home', pcName: 'Bilgisayar', homeName: 'ayse', trashName: 'Çöp', folder: 'papirus', user: 'ayse', host: 'pardus', hostLower: 'pardus', osRelease: 'PRETTY_NAME="Pardus 23"<br>NAME="Pardus"<br>VERSION_ID="23"<br>ID=pardus<br>ID_LIKE=debian<br>HOME_URL="https://www.pardus.org.tr/"', motd: 'Pardus\'a hoş geldiniz!', side: () => [['Aygıtlar', null], ['Dosya Sistemi', 'root', I.drive(false)], ['Yerler', null], ['ayse', 'home', I.folder('papirus', 'home')], ['Masaüstü', 'Masaüstü', I.folder('papirus', 'desk')], ['Çöp', 'Çöp', I.bin(false, 'w10')], ...['Belgeler', 'İndirilenler', 'Müzik', 'Resimler', 'Videolar'].map((n) => [n, n, sideIc('papirus')(n)]), ['Ağ', null], ['Ağa Göz At', 'x:Ağ', I.ln.net]] },
  apps: {
    browser: app('browser', 'Firefox ESR', I.firefox(), { v: 'ff', w: 740, h: 460, keys: 'internet tarayıcı web' }),
    files: app('files', 'Dosya Yöneticisi', I.folder('papirus', 'home'), { v: 'thunar', w: 660, h: 410, keys: 'thunar klasör' }),
    notepad: app('notepad', 'Metin Düzenleyici', I.texteditor(), { v: 'prd', w: 560, h: 370, keys: 'not defteri mousepad' }),
    terminal: app('terminal', 'Uçbirim', I.terminal(), { v: 'prd', w: 600, h: 360, keys: 'terminal komut' }),
    calc: app('calc', 'Hesap Makinesi', I.calc('lnx'), { v: 'prd', w: 300, h: 430 }),
    writer: app('writer', 'LibreOffice Writer', I.writer(), { w: 700, h: 450, keys: 'word kelime işlemci' }),
    store: app('store', 'Pardus Yazılım Merkezi', I.software(), { v: 'prd', w: 720, h: 450, keys: 'mağaza uygulama' }),
    settings: { title: 'Ayarlar Yöneticisi', icon: I.gear('#fff', '#3f78c0'), w: 700, h: 450, build: settingsPrd },
    about: { title: 'Pardus Hakkında', icon: I.pardus(), go: (api) => api.open('settings', 'system') },
    viewer: app('viewer', 'Ristretto Resim Görüntüleyici', I.photos(), { v: 'prd', w: 620, h: 420, hide: true }),
    posta: yok('Thunderbird Posta', I.thunderbird()),
    muzik: yok('Müzik Çalar', I.music()),
    calcsheet: yok('LibreOffice Calc', I.file('xlsx')),
    ekran: yok('Ekran Görüntüsü', I.camera()),
  },
  boot: () => `<div class="prd-boot" data-act="skipboot"><i>${I.pardus()}</i><b>Pardus</b>${sp('bar')}</div>`,
  login: () => `<div class="prd-login">${PRD_WALL}<div class="prd-gtop"><b>Pardus</b>${clk('xfce')}<span>${tray('net', 'vol', 'power')}</span></div><div class="prd-lg"><i class="prd-av">${I.avatar('round')}</i><div class="prd-f"><label>Kullanıcı adı<select><option>ayse</option></select></label><label>Parola<input type="password" aria-label="Parola"></label><small>Parola gerekmez: Oturum Aç'a basın.</small><button type="button" data-act="login">Oturum Aç</button></div></div></div>`,
  bye: (api, r) => `<div class="prd-boot"><i>${I.pardus()}</i><b>Pardus</b><p>${r ? 'Yeniden başlatılıyor…' : 'Kapatılıyor…'}</p></div>`,
  desk: () => `${PRD_WALL}<div class="di-col">${di('ayse', I.folder('papirus', 'home'), 'files', 'home')}${di('Dosya Sistemi', I.drive(false), 'files', 'root')}${di('Çöp', I.bin(false, 'w10'), 'files', 'Çöp')}</div>`,
  bar: () => `<div class="os-bar prd-bar"><button type="button" class="prd-mb" data-act="start" title="Uygulamalar Menüsü">${I.pardus()}</button><i class="prd-sep"></i>${['browser', 'files', 'terminal'].map((k) => `<button type="button" class="prd-l" data-open="${k}" title="@@${k}">@@${k}</button>`).join('')}<i class="prd-sep"></i>
    <div class="os-tasks"></div><div class="prd-ws">${[1, 2, 3, 4].map((n) => `<button type="button" class="${n === 1 ? 'on' : ''}" data-act="toast" data-msg="Çalışma alanı ${n}: ayrı bir masaüstü.">${n}</button>`).join('')}</div>
    <div class="tray"><span class="tr-lang">tr</span>${tray('net', 'vol', 'bat')}<button type="button" class="tr-clock" data-pop="cal">${clk('xfce')}</button><button type="button" class="prd-pw" data-pop="prdlo" title="Oturumu kapat">${I.ln.power}</button></div></div>
    <div class="os-pop prd-calp" data-name="cal">${month()}</div>
    <div class="os-pop prd-lo" data-name="prdlo"><div><h3>${I.avatar('round')} ayse için oturumu kapat</h3><div class="prd-lob">${act('Oturumu Kapat', 'logout', I.ln.logout)}${act('Yeniden Başlat', 'restart', I.ln.restart)}${act('Kapat', 'off', I.ln.power)}${act('Askıya Al', 'sleep', I.ln.moon)}</div><label><input type="checkbox"> Gelecekteki oturumlar için kaydet</label><div class="prd-loc">${act('İptal', 'ctxok')}</div></div></div>`,
  menu: () => `<div class="os-pop prd-menu" data-name="start"><div class="prd-mh"><i>${I.avatar('round')}</i><b>ayse</b><span>${item('', I.ln.gear, 'settings')}${act('', 'lock', I.ln.lock)}<button type="button" data-pop="prdlo" title="Oturumu kapat">${I.ln.logout}</button></span></div>
    <label class="prd-q"><i>${I.ln.search}</i><input class="os-auto" placeholder="Ara…"></label><div class="prd-mb2"><div class="prd-apps"></div><div class="prd-cats">${Object.keys(CATS).map((c, i) => `<button type="button" data-cat="${c}" class="${i === 0 ? 'on' : ''}">${c}</button>`).join('')}</div></div></div>`,
  tasks(api) {
    return api.st.wins.map((w) => `<button type="button" class="prd-t${w.id === api.st.active && !w.min ? ' act' : ''}${w.min ? ' min' : ''}" data-task="${w.app}" data-win="${w.id}"><i>${w.icon}</i><span>${esc(w.title)}</span></button>`).join('');
  },
  ctx: () => `${item('Uçbirim Aç', '', 'terminal')}${act('Klasör Oluştur…', 'ctxok')}${act('Belge Oluştur', 'ctxok', '', 'sub')}<hr>${act('Uygulamalar', 'ctxok', '', 'sub')}<hr>${act('Masaüstünü Düzenle', 'ctxok')}${item('Masaüstü Ayarları…', '', 'settings')}${item('Özellikler…', '', 'settings', 'system')}`,
  init(api) {
    api.qa('.prd-l').forEach((b) => { const A = api.os.apps[b.dataset.open]; b.title = A.title; b.innerHTML = A.icon; });
    const m = api.q('.prd-menu'), list = m.querySelector('.prd-apps'), inp = m.querySelector('.prd-q input');
    const show = (cat) => {
      const keys = CATS[cat] || Object.keys(api.os.apps).filter((k) => !api.os.apps[k].hide).sort((a, b) => api.os.apps[a].title.localeCompare(api.os.apps[b].title, 'tr'));
      list.innerHTML = keys.map((k) => { const A = api.os.apps[k]; return `<button type="button" data-open="${k}"><i>${A.icon}</i><span>${A.title}</span></button>`; }).join('');
      m.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('on', x.dataset.cat === cat));
    };
    show('Favoriler');
    m.addEventListener('pointerover', (e) => { const c = e.target.closest('[data-cat]'); if (c && !inp.value) show(c.dataset.cat); });
    m.addEventListener('click', (e) => { const c = e.target.closest('[data-cat]'); if (c) { inp.value = ''; show(c.dataset.cat); } });
    bindSearch(api, inp, list, (t) => { if (t.trim()) list.innerHTML = results(api, t, 'prd-r'); else show('Favoriler'); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') list.querySelector('[data-open]')?.click(); });
  },
  onPop(name, el) { if (name === 'start') { const i = el.querySelector('.prd-q input'); i.value = ''; i.dispatchEvent(new Event('input')); } },
};
function settingsPrd(api, A, arg) {
  const groups = [['Kişisel', [['Görünüm', 'pic'], ['Masaüstü', 'view'], ['Pencere Yöneticisi', 'apps'], ['Panel', 'menu'], ['Ekran Koruyucu', 'moon']]], ['Donanım', [['Ekran', 'devices'], ['Fare ve Dokunmatik Yüzey', 'eye'], ['Klavye', 'kbd'], ['Güç Yöneticisi', 'bat'], ['Ses', 'vol'], ['Yazıcılar', 'doc'], ['Bluetooth', 'bt']]], ['Sistem', [['Kullanıcılar ve Gruplar', 'user'], ['Tarih ve Saat', 'restart'], ['Oturum ve Başlangıç', 'power'], ['Ağ Bağlantıları', 'net'], ['Pardus Hakkında', 'info']]]];
  const home = () => `<div class="sp-home"><label class="sp-q"><i>${I.ln.search}</i><input placeholder="Ara"></label>${groups.map(([g, it]) => `<h4>${g}</h4><div class="sp-grid">${it.map(([t, i]) => `<button type="button" data-sp="${t}"><i>${I.ln[i]}</i><span>${t}</span></button>`).join('')}</div>`).join('')}</div>`;
  const about = () => `<div class="sp-about"><button type="button" data-sp="home" class="sp-back">${I.ln.back} Tüm Ayarlar</button><i>${I.pardus()}</i><h2>Pardus 23</h2><p>TÜBİTAK ULAKBİM tarafından geliştirilen, Debian tabanlı, özgür ve ücretsiz işletim sistemi.</p>${specs([['Sürüm', '<b>Pardus 23</b> (Xfce)'], ['Temel', 'Debian GNU/Linux 12'], ['Masaüstü', 'Xfce 4.18'], ['Çekirdek', 'Linux 6.1'], ['İşlemci', 'Intel Core i3 × 4'], ['Bellek', '4,0 GiB'], ['Web', 'www.pardus.org.tr']])}</div>`;
  return {
    html: '<div class="psm"></div>',
    init(b, w) {
      const go = (k) => { b.firstElementChild.innerHTML = k === 'about' ? about() : home(); w.setTitle(k === 'about' ? 'Pardus Hakkında' : 'Ayarlar Yöneticisi'); if (k === 'about') api.emit('os-about'); };
      go(arg === 'system' ? 'about' : 'home');
      w.arg = (a) => go(a === 'system' ? 'about' : 'home');
      b.addEventListener('click', (e) => { const x = e.target.closest('[data-sp]'); if (!x) return; const k = x.dataset.sp; if (k === 'home') go('home'); else if (k === 'Pardus Hakkında') go('about'); else api.toast(`<b>${k}</b> bu benzetimde açılmıyor. <b>Pardus Hakkında</b>'yı deneyin.`); });
    },
  };
}

export const OSES = { w7, w8, w10, w11, lnx: ubu, prd };
