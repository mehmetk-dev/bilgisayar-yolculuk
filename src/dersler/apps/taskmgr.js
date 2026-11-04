// Görev Yöneticisi (Windows 11): solda simge menüsü (İşlemler, Performans, Uygulama geçmişi, Başlangıç uygulamaları, Kullanıcılar, Ayrıntılar, Hizmetler, Ayarlar),
// üstte arama kutusu, sağ üstte "Yeni görev çalıştır" ve "Görevi sonlandır". İşlemler tablosunda CPU, Bellek, Disk, Ağ sütunları (sarı tonlu), yanıt vermeyen program,
// Performans sayfasında küçük grafikli kartlar ve büyük canlı grafik, Başlangıç uygulamaları (açılışta kendiliğinden çalışanlar).
import { esc } from './util.js';
import { APP_ICONS, SYS_ICONS } from './appicons.js';
import { ic } from './w11ikon.js';

const TABS = [['proc', 'tmproc', 'İşlemler'], ['perf', 'tmperf', 'Performans'], ['apphist', 'tmhist', 'Uygulama geçmişi'], ['startup', 'tmstart', 'Başlangıç uygulamaları'],
  ['users', 'users', 'Kullanıcılar'], ['details', 'tmdetails', 'Ayrıntılar'], ['services', 'tmserv', 'Hizmetler']];
const TITLES = Object.fromEntries([...TABS.map((t) => [t[0], t[2]]), ['settings', 'Ayarlar']]);

// Simgeler: uygulama kimliği ya da arka plan işlemi için küçük renkli SVG
const PIC = { av: APP_ICONS.guvenlik, spool: SYS_ICONS.printer, audio: ic('vol'), explorer: APP_ICONS.explorer, sync: APP_ICONS.bulut, music: APP_ICONS.music, upd: APP_ICONS.setup, toolbar: ic('search'), printer: SYS_ICONS.printer, taskmgr: APP_ICONS.taskmgr };
const picOf = (id) => PIC[id] || APP_ICONS[id] || SYS_ICONS.file;

// Arka plan işlemleri: pencereleri yoktur ama bilgisayarda çalışırlar
const BACKGROUND = [
  { id: 'av', name: 'Windows Güvenliği tarama hizmeti', cpu: 1.2, mem: 96, sys: true },
  { id: 'spool', name: 'Yazdırma Biriktiricisi', cpu: 0.1, mem: 12, sys: true },
  { id: 'audio', name: 'Windows Ses Hizmeti', cpu: 0.3, mem: 18, sys: true },
  { id: 'explorer', name: 'Windows Gezgini', cpu: 0.6, mem: 74, restart: true },
  { id: 'sync', name: 'Bulut Eşitleme', cpu: 0.4, mem: 58, startup: 'sync' },
  { id: 'music', name: 'Müzik Çalar Yardımcısı', cpu: 0.2, mem: 31, startup: 'music' },
  { id: 'upd', name: 'Güncelleme Denetleyicisi', cpu: 0.1, mem: 9, startup: 'upd' },
  { id: 'toolbar', name: 'Süper Arama Yardımcısı', cpu: 34, mem: 410, startup: 'toolbar', when: (s) => s.toolbar },
];

// Başlangıç uygulamaları: bilgisayar açılırken kendiliğinden çalışırlar; çok olursa açılış yavaşlar
export const STARTUP = [
  { id: 'sync', name: 'Bulut Eşitleme', pub: 'Bulut Yazılım', impact: 'Yüksek', sec: 4.1 },
  { id: 'music', name: 'Müzik Çalar Yardımcısı', pub: 'Örnek Müzik', impact: 'Orta', sec: 2.2 },
  { id: 'printer', name: 'Yazıcı Durum Simgesi', pub: 'R-200 Yazıcı', impact: 'Düşük', sec: 0.6 },
  { id: 'upd', name: 'Güncelleme Denetleyicisi', pub: 'Örnek Yazılım A.Ş.', impact: 'Düşük', sec: 0.4 },
  { id: 'toolbar', name: 'Süper Arama Yardımcısı', pub: 'Bilinmiyor', impact: 'Yüksek', sec: 6.5, when: (s) => s.toolbar },
];
// Hizmetler sayfasındaki örnek liste
const SERVICES = [
  ['Audiosrv', 'Windows Ses', 'Çalışıyor', 'LocalServiceNetworkRestricted'], ['Spooler', 'Yazdırma Biriktiricisi', 'Çalışıyor', ''], ['WinDefend', 'Microsoft Defender Virüsten Koruma Hizmeti', 'Çalışıyor', ''],
  ['wuauserv', 'Windows Update', 'Durduruldu', 'netsvcs'], ['Dhcp', 'DHCP İstemcisi', 'Çalışıyor', 'LocalServiceNetworkRestricted'], ['BITS', 'Arka Plan Akıllı Aktarım Hizmeti', 'Durduruldu', 'netsvcs'],
  ['Themes', 'Temalar', 'Çalışıyor', 'netsvcs'], ['WlanSvc', 'WLAN Otomatik Yapılandırma', 'Çalışıyor', ''], ['bthserv', 'Bluetooth Destek Hizmeti', 'Durduruldu', 'LocalService'],
  ['EventLog', 'Windows Olay Günlüğü', 'Çalışıyor', 'LocalServiceNetworkRestricted'], ['Fax', 'Faks', 'Durduruldu', 'NetworkService'], ['Schedule', 'Görev Zamanlayıcı', 'Çalışıyor', 'netsvcs'],
];
const MEM_TOTAL = 8192; // MB
// Yaklaşık disk (MB/sn) ve ağ (Mb/sn) kullanımı: uygulama ya da arka plan işlemi kimliğine göre
const IO = { browser: [0.25, 1.6], mail: [0.1, 0.6], av: [0.5, 0], explorer: [0.1, 0], sync: [0.9, 0.8], upd: [0.1, 0.2], toolbar: [0.4, 2.8] };
// "Yeni görev çalıştır" penceresine yazılabilen adlar → program kimliği
const RUN = {
  notepad: 'notepad', calc: 'calc', mspaint: 'paint', paint: 'paint', explorer: 'explorer', winword: 'word', word: 'word', excel: 'sheet',
  powerpnt: 'slides', msedge: 'browser', chrome: 'browser', taskmgr: 'taskmgr', control: 'settings', 'ms-settings:': 'settings', devmgmt: 'devmgr', 'devmgmt.msc': 'devmgr',
};
const APP_MEM = { browser: 380, word: 160, sheet: 150, slides: 170, paint: 90, mail: 120, photos: 110, explorer: 60, settings: 55 };
const APP_NAME = { notepad: 'Not Defteri', calc: 'Hesap Makinesi', explorer: 'Dosya Gezgini', paint: 'Paint', settings: 'Ayarlar', word: 'Kelime İşlemci', sheet: 'Hesap Tablosu', slides: 'Sunu', mail: 'E-posta', browser: 'Google Chrome', photos: 'Fotoğraflar', viewer: 'Resim Gösterici', pdf: 'PDF Okuyucu', music: 'Müzik Çalar', store: 'Microsoft Store', takvim: 'Takvim', hava: 'Hava Durumu' };

const jitter = (v, k = 0.35) => Math.max(0, v * (1 + (Math.random() * 2 - 1) * k));
const fmt = (n, d = 1) => n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
const pidOf = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9000; return 1200 + (h * 4 % 9000); };
let gid = 0;

export function taskmgr({ desk, body, args, emit, dialogs }) {
  body.classList.add('w11a', 'w11tm');
  const s = desk.settings;
  s.startupOff ||= [];
  let tab = args.tab || 'proc', sel = null, perfKind = 'cpu', sortKey = null, sortAsc = false, query = '', navOpen = true;
  const closed = new Set(); // daraltılmış gruplar
  const opts = { onTop: false, minimize: false, hideMin: true };
  const eco = (desk.ecoProcs ||= new Set()); // Verimlilik modundaki işlemler
  const hist = { cpu: [], mem: [], disk: [], net: [] };
  const procCpu = {}; // her işlemin son işlemci değeri (titreşimli)

  body.innerHTML = `<div class="w11tm-top"><button type="button" class="w11tm-burger" data-act="nav" title="Gezinti bölmesini daralt ya da genişlet" aria-label="Menü">${ic('menu')}</button>
      <label class="w11tm-search">${ic('search')}<input type="search" class="w11tm-q" placeholder="Bir işlem adı, yayımcı veya PID yazın" autocomplete="off" spellcheck="false" aria-label="İşlemlerde ara"></label></div>
    <div class="w11tm-wrap"><nav class="w11tm-nav">${TABS.map(([id, ico, l]) => `<button type="button" data-tab="${id}" title="${l}">${ic(ico)}<span>${l}</span></button>`).join('')}
      <i class="w11tm-gap"></i><button type="button" data-tab="settings" title="Ayarlar">${ic('gear')}<span>Ayarlar</span></button></nav>
    <div class="w11tm-main"><div class="w11tm-head"><h2></h2><div class="w11tm-acts"></div></div><div class="w11tm-body"></div></div></div>`;
  const $ = (q) => body.querySelector(q);

  // ---- İşlemler ----
  function processes() {
    const apps = [];
    for (const w of desk.wins) {
      if (w.app === 'taskmgr') continue;
      let p = apps.find((a) => a.app === w.app);
      if (!p) apps.push(p = { id: 'app:' + w.app, app: w.app, name: APP_NAME[w.app] || w.title.split(' - ').at(-1) || w.title, wins: [], cpu: 0, mem: 0 });
      p.wins.push(w);
      if (w.hung) p.hung = true;
    }
    for (const p of apps) {
      p.name = p.wins.length > 1 ? `${p.name} (${p.wins.length})` : p.name;
      p.cpu = p.hung ? 0 : 0.4 * p.wins.length;
      p.mem = (APP_MEM[p.app] || 45) * p.wins.length + (p.hung ? 900 : 0);
      p.eco = eco.has(p.id);
      if (p.eco) { p.cpu *= 0.2; p.mem *= 0.7; }
    }
    // Görev Yöneticisinin kendisi
    apps.push({ id: 'app:taskmgr', app: 'taskmgr', name: 'Görev Yöneticisi', wins: [], cpu: 1.1, mem: 34, self: true });
    const bg = BACKGROUND.filter((b) => (!b.when || b.when(s)) && (!b.startup || !s.startupOff.includes(b.startup)) && !desk.stopped?.has(b.id) && !(b.id === 'explorer' && desk.explorerRestarting))
      .map((b) => (eco.has(b.id) ? { ...b, eco: true, cpu: b.cpu * 0.2, mem: b.mem * 0.7 } : b));
    return { apps, bg };
  }
  const cpuOf = (p) => (procCpu[p.id] = jitter(p.cpu));
  const totals = () => {
    const { apps, bg } = processes();
    const all = [...apps, ...bg];
    const cpu = Math.min(100, all.reduce((a, p) => a + (procCpu[p.id] ?? p.cpu), 0) + 2);
    const mem = all.reduce((a, p) => a + p.mem, 0) + 2100;
    return { cpu, mem, all };
  };
  const match = (p) => !query || `${p.name} ${pidOf(p.id)}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));

  // Düğme alanı her saniye yeniden çizilirse basılı tutulan düğme kaybolur ve tıklama gider; yalnızca değişince yazılır
  function setActs(html) {
    const a = $('.w11tm-acts');
    if (a.dataset.sig === html) return;
    a.dataset.sig = html;
    a.innerHTML = html;
  }
  const btn = (act, ico, label, off = false, cls = '') => `<button type="button" class="w11tm-btn ${cls}" data-act="${act}" ${off ? 'disabled' : ''}>${ic(ico)}<span>${label}</span></button>`;
  function procActs(withEco) {
    const { apps, bg } = processes();
    const p = [...apps, ...bg].find((x) => x.id === sel);
    if (sel && !p) sel = null;
    return btn('run', 'tmrun', 'Yeni görev çalıştır') + (p?.restart ? btn('restart', 'refresh', 'Yeniden başlat') : btn('end', 'tmend', 'Görevi sonlandır', !p || p.sys || p.self))
      + (withEco ? btn('eco', 'tmeco', p?.eco ? 'Verimlilik modunu kapat' : 'Verimlilik modu', !p || p.sys || p.self || p.restart) : '');
  }

  // Her işlemin bu çizimdeki değerleri (sıralama da bunlara göre yapılır)
  function values(apps, bg) {
    const val = {};
    for (const p of [...apps, ...bg]) { const [d, n] = IO[p.app || p.id] || [0.05, 0]; val[p.id] = { cpu: cpuOf(p), mem: p.mem, disk: p.hung ? 0 : jitter(d, 0.5), net: p.hung ? 0 : jitter(n, 0.5) }; }
    return val;
  }
  const heat = (v, max) => `style="--h:${Math.min(0.55, (v / max) * 0.9 + 0.06).toFixed(2)}"`;
  const stText = (p) => (p.hung ? '<span class="w11tm-st">Yanıt vermiyor</span>' : p.eco ? `<span class="w11tm-eco">${ic('tmeco')}Verimlilik</span>` : '');

  function renderProc() {
    const { apps, bg } = processes();
    const t = totals();
    const val = values(apps, bg);
    const sum = (k) => Object.values(val).reduce((a, v) => a + v[k], 0);
    const order = (list) => (sortKey ? [...list].sort((a, b) => (val[b.id][sortKey] - val[a.id][sortKey]) * (sortAsc ? -1 : 1)) : list);
    const row = (p) => {
      const v = val[p.id];
      return `<tr data-proc="${p.id}" class="${p.id === sel ? 'sel' : ''} ${p.hung ? 'hung' : ''}" tabindex="-1">
        <td class="w11tm-name"><i class="w11tm-chev"></i><span class="w11tm-ic">${picOf(p.app || p.id)}</span>${esc(p.name)}</td><td class="w11tm-stc">${stText(p)}</td>
        <td ${heat(v.cpu, 30)}>%${fmt(v.cpu)}</td><td ${heat(p.mem, 900)}>${fmt(p.mem, 1)} MB</td><td ${heat(v.disk, 2)}>${fmt(v.disk)} MB/sn</td><td ${heat(v.net, 3)}>${fmt(v.net)} Mb/sn</td></tr>`;
    };
    const th = (k, label, pct, h) => `<th data-sort="${k}" class="w11tm-sort${sortKey === k ? ' on' : ''}" ${h} title="Bu sütuna göre sırala (yeniden tıklayınca ters çevrilir)"><span class="w11tm-arr">${sortKey === k ? ic(sortAsc ? 'chevup' : 'chevdown') : ''}</span><b>${pct}</b><small>${label}</small></th>`;
    const groups = [['Uygulamalar', 'apps', order(apps).filter(match)], ['Arka plan işlemleri', 'bg', order(bg.filter((b) => !b.sys)).filter(match)], ['Windows işlemleri', 'win', order(bg.filter((b) => b.sys)).filter(match)]];
    const grp = ([label, key, list]) => `<tr class="w11tm-grp" data-grp="${key}"><td colspan="6"><span class="w11tm-gc ${closed.has(key) ? '' : 'open'}">${ic('chevright')}</span>${label} (${list.length})</td></tr>${closed.has(key) ? '' : list.map(row).join('')}`;
    const keep = $('.w11tm-body').scrollTop;
    $('.w11tm-body').innerHTML = `<table class="w11tm-t"><thead><tr><th class="w11tm-l">Ad</th><th class="w11tm-l">Durum</th>${th('cpu', 'CPU', `%${Math.round(t.cpu)}`, heat(t.cpu, 100))}${th('mem', 'Bellek', `%${Math.round((t.mem / MEM_TOTAL) * 100)}`, heat(t.mem, MEM_TOTAL))}${th('disk', 'Disk', `%${Math.round(Math.min(100, sum('disk') * 6))}`, heat(sum('disk'), 4))}${th('net', 'Ağ', `%${Math.round(Math.min(100, sum('net') * 3))}`, heat(sum('net'), 6))}</tr></thead>
      <tbody>${groups.map(grp).join('')}</tbody></table>${query && !groups.some((g) => g[2].length) ? `<p class="w11tm-empty">“${esc(query)}” ile eşleşen bir işlem yok.</p>` : ''}`;
    $('.w11tm-body').scrollTop = keep;
    setActs(procActs(true));
  }

  // Ayrıntılar: PID, durum, kullanıcı, CPU, bellek
  function renderDetails() {
    const { apps, bg } = processes();
    const val = values(apps, bg);
    const all = [...apps, ...bg].filter(match).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    $('.w11tm-body').innerHTML = `<table class="w11tm-t w11tm-d"><thead><tr><th class="w11tm-l">Ad</th><th class="w11tm-l">PID</th><th class="w11tm-l">Durum</th><th class="w11tm-l">Kullanıcı adı</th><th>CPU</th><th>Bellek</th><th class="w11tm-l">Açıklama</th></tr></thead><tbody>
      ${all.map((p) => `<tr data-proc="${p.id}" class="${p.id === sel ? 'sel' : ''}"><td class="w11tm-name"><span class="w11tm-ic">${picOf(p.app || p.id)}</span>${esc(p.name)}</td><td class="w11tm-l">${pidOf(p.id)}</td><td class="w11tm-l">${p.hung ? 'Yanıt vermiyor' : 'Çalışıyor'}</td><td class="w11tm-l">${p.sys ? 'SYSTEM' : 'Ahmet'}</td><td>${Math.round(val[p.id].cpu)}</td><td>${fmt(p.mem * 1024, 0)} K</td><td class="w11tm-l">${esc(p.name)}</td></tr>`).join('')}</tbody></table>`;
    setActs(procActs(false));
  }

  // Kullanıcılar
  function renderUsers() {
    const t = totals();
    const { apps, bg } = processes();
    const val = values(apps, bg);
    const row = (p) => `<tr><td class="w11tm-name w11tm-sub"><span class="w11tm-ic">${picOf(p.app || p.id)}</span>${esc(p.name)}</td><td></td><td>%${fmt(val[p.id].cpu)}</td><td>${fmt(p.mem, 1)} MB</td><td>${fmt(val[p.id].disk)} MB/sn</td><td>${fmt(val[p.id].net)} Mb/sn</td></tr>`;
    $('.w11tm-body').innerHTML = `<table class="w11tm-t"><thead><tr><th class="w11tm-l">Kullanıcı</th><th class="w11tm-l">Durum</th><th><b>%${Math.round(t.cpu)}</b><small>CPU</small></th><th><b>%${Math.round((t.mem / MEM_TOTAL) * 100)}</b><small>Bellek</small></th><th><b>%1</b><small>Disk</small></th><th><b>%0</b><small>Ağ</small></th></tr></thead><tbody>
      <tr class="w11tm-grp"><td colspan="2"><span class="w11tm-gc open">${ic('chevright')}</span><span class="w11tm-ic">${SYS_ICONS.user}</span>Ahmet Yılmaz (${t.all.length})</td><td>%${Math.round(t.cpu)}</td><td>${fmt(t.mem, 1)} MB</td><td>%1</td><td>%0</td></tr>${t.all.slice(0, 8).map(row).join('')}</tbody></table>`;
    setActs('');
  }

  // Uygulama geçmişi: son 30 günde uygulamaların kullandığı kaynaklar (örnek veriler)
  function renderHist() {
    const names = ['Google Chrome', 'Microsoft Store', 'E-posta', 'Takvim', 'Hava Durumu', 'Fotoğraflar', 'Müzik Çalar', 'Kelime İşlemci'];
    const data = names.map((n, i) => ({ n, cpu: [41, 3, 22, 2, 5, 8, 12, 30][i] + 0.37 * (i + 1), net: [210, 12, 36, 1, 8, 0.2, 0.1, 0.6][i], met: [0, 0, 0, 0, 1.2, 0, 0, 0][i], tile: [0, 0, 0, 0.1, 0.4, 0, 0, 0][i] }));
    $('.w11tm-body').innerHTML = `<p class="w11tm-boot">Kaynak kullanım geçmişi, ${new Date().toLocaleDateString('tr-TR')} tarihinden bu yana, MASAÜSTÜ-PC için.</p><table class="w11tm-t"><thead><tr><th class="w11tm-l">Ad</th><th>CPU süresi</th><th>Ağ</th><th>Ölçülü ağ</th><th>Kutucuk güncelleştirmeleri</th></tr></thead><tbody>
      ${data.map((d) => `<tr><td class="w11tm-name"><span class="w11tm-ic">${picOf(Object.keys(APP_NAME).find((k) => APP_NAME[k] === d.n) || 'file')}</span>${d.n}</td><td>${Math.floor(d.cpu / 60)}:${String(Math.floor(d.cpu % 60) + 10).slice(-2)}:${String(Math.floor((d.cpu * 7) % 60) + 10).slice(-2)}</td><td>${fmt(d.net)} MB</td><td>${fmt(d.met)} MB</td><td>${fmt(d.tile)} MB</td></tr>`).join('')}</tbody></table>`;
    setActs('');
  }

  function renderServices() {
    $('.w11tm-body').innerHTML = `<table class="w11tm-t w11tm-d"><thead><tr><th class="w11tm-l">Ad</th><th class="w11tm-l">PID</th><th class="w11tm-l">Açıklama</th><th class="w11tm-l">Durum</th><th class="w11tm-l">Grup</th></tr></thead><tbody>
      ${SERVICES.map(([n, d, st, g], i) => `<tr><td class="w11tm-name"><span class="w11tm-ic">${ic('gear')}</span>${n}</td><td class="w11tm-l">${st === 'Çalışıyor' ? 1100 + i * 371 : ''}</td><td class="w11tm-l">${d}</td><td class="w11tm-l">${st}</td><td class="w11tm-l">${g}</td></tr>`).join('')}</tbody></table>`;
    setActs('');
  }

  function renderSettings() {
    const row = (k, l, d) => `<label class="w11tm-opt"><input type="checkbox" data-opt="${k}" ${opts[k] ? 'checked' : ''}><span><b>${l}</b><small>${d}</small></span></label>`;
    $('.w11tm-body').innerHTML = `<div class="w11tm-set"><h3>Varsayılan başlangıç sayfası</h3><p class="w11tm-mut">Görev Yöneticisi her açıldığında <b>İşlemler</b> sayfası görünür.</p>
      <h3>Pencere yönetimi</h3>${row('onTop', 'Her zaman üstte', 'Görev Yöneticisi diğer pencerelerin önünde kalır.')}${row('minimize', 'Kullanıldığında simge durumuna küçült', 'Bir işlem üzerinde işlem yapınca pencere küçülür.')}${row('hideMin', 'Simge durumuna küçültüldüğünde gizle', 'Görev çubuğunda yalnızca bildirim alanı simgesi kalır.')}
      <h3>Gerçek zamanlı güncelleştirme hızı</h3><p class="w11tm-mut">Normal: her saniyede bir.</p></div>`;
    setActs('');
  }

  // Yeni görev çalıştır: program adını yazarak açar (notepad, calc, mspaint, explorer…)
  async function runTask() {
    const v = await dialogs.form({
      title: 'Yeni görev oluştur', icon: ic('tmrun'), ok: 'Tamam',
      text: 'Açmak istediğiniz programın adını yazın; Windows sizin için açsın.<br><small>Örnek: <b>notepad</b>, <b>calc</b>, <b>mspaint</b>, <b>explorer</b></small>',
      fields: [{ name: 'cmd', label: 'Aç:' }],
      check: (x) => { const k = x.cmd.trim().toLowerCase().replace(/\.exe$/, ''); return !k ? 'Bir ad yazın.' : RUN[k] ? '' : `Windows “${x.cmd.trim()}” öğesini bulamıyor. Adın doğru yazıldığından emin olun.`; },
    });
    if (!v) return;
    const app = RUN[v.cmd.trim().toLowerCase().replace(/\.exe$/, '')];
    desk.open(app);
    emit('task-run', { cmd: v.cmd.trim(), app });
  }

  async function endTask() {
    const { apps, bg } = processes();
    const p = [...apps, ...bg].find((x) => x.id === sel);
    if (!p || p.sys || p.self) return;
    if (p.app) {
      // Görevi sonlandırmak programı hemen kapatır: kaydedilmemiş işler sorulmadan kaybolur
      for (const w of p.wins) desk.destroy(w);
      emit('task-end', { app: p.app, name: p.name, hung: !!p.hung });
    } else {
      (desk.stopped ||= new Set()).add(p.id); // yalnızca bu oturum için durur; bilgisayar yeniden açılınca yine çalışır
      emit('task-end', { proc: p.id, name: p.name });
    }
    sel = null;
    render();
  }

  async function restartExplorer() {
    desk.explorerRestarting = true;
    desk.root.querySelector('.dk-taskbar').style.visibility = 'hidden';
    desk.iconsEl.style.visibility = 'hidden';
    emit('explorer-restart', { stage: 'stop' });
    render();
    await new Promise((r) => setTimeout(r, 1300));
    desk.explorerRestarting = false;
    desk.root.querySelector('.dk-taskbar').style.visibility = '';
    desk.iconsEl.style.visibility = '';
    emit('explorer-restart', { stage: 'done' });
    render();
  }

  // ---- Performans ----
  function sample() {
    const t = totals();
    const push = (k, v) => { hist[k].push(v); if (hist[k].length > 60) hist[k].shift(); };
    push('cpu', t.cpu);
    push('mem', (t.mem / MEM_TOTAL) * 100);
    push('disk', Math.random() < 0.15 ? 20 + Math.random() * 50 : Math.random() * 4);
    const net = s.wifi && s.network ? Math.random() * (desk.wins.some((w) => w.app === 'browser') ? 60 : 8) : 0;
    push('net', net);
    return t;
  }
  const graph = (data, color, big) => {
    const id = 'w11g' + ++gid;
    const pts = data.map((v, i) => `${(i + 60 - data.length) * (100 / 59)},${100 - Math.min(100, v)}`).join(' ');
    return `<svg class="w11tm-graph" viewBox="0 0 100 100" preserveAspectRatio="none" style="--gc:${color}">${big ? `<defs><pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0V10H0" fill="none" stroke="${color}" stroke-opacity=".28" stroke-width="0.5" vector-effect="non-scaling-stroke"/></pattern></defs><rect width="100" height="100" fill="url(#${id})"/>` : ''}${data.length > 1 ? `<polygon points="${(60 - data.length) * (100 / 59)},100 ${pts} 100,100" fill="${color}" fill-opacity=".22"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${big ? 1.4 : 1.1}" vector-effect="non-scaling-stroke"/>` : ''}</svg>`;
  };
  function renderPerf() {
    const t = totals();
    const last = (k) => hist[k].at(-1) ?? 0;
    const memUsed = t.mem / 1024;
    const online = s.wifi && s.network;
    const stat = (v, l) => `<div class="w11tm-stat"><small>${l}</small><b>${v}</b></div>`;
    const info = (rows) => `<dl class="w11tm-info">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
    const up = `0:00:${String(new Date().getSeconds()).padStart(2, '0')}:${String(new Date().getMilliseconds() % 60).padStart(2, '0')}`;
    const kinds = {
      cpu: ['CPU', '#1f7ad1', `%${Math.round(last('cpu'))} ${fmt(3.2 + last('cpu') / 100, 2)} GHz`, 'Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz', '% kullanım', 'cpu',
        `<div class="w11tm-stats">${stat(`%${Math.round(last('cpu'))}`, 'Kullanım')}${stat(`${fmt(3.2 + last('cpu') / 100, 2)} GHz`, 'Hız')}${stat(t.all.length + 87, 'İşlemler')}${stat(t.all.length * 14 + 1130, 'İş parçacıkları')}${stat(t.all.length * 380 + 41200, 'Tutamaçlar')}${stat(up, 'Çalışma süresi')}</div>`
        + info([['Temel hız:', '3,20 GHz'], ['Yuvalar:', '1'], ['Çekirdekler:', '6'], ['Mantıksal işlemciler:', '12'], ['Sanallaştırma:', 'Etkin'], ['L1 önbellek:', '384 KB'], ['L2 önbellek:', '1,5 MB'], ['L3 önbellek:', '12,0 MB']])],
      mem: ['Bellek', '#8b3fc4', `${fmt(memUsed)}/8,0 GB (%${Math.round(last('mem'))})`, '8,0 GB DDR4', 'Bellek kullanımı', 'memory',
        `<div class="w11tm-stats">${stat(`${fmt(memUsed)} GB`, 'Kullanımda')}${stat(`${fmt(8 - memUsed)} GB`, 'Kullanılabilir')}${stat(`${fmt(memUsed * 1.2)}/9,6 GB`, 'Ayrılan')}${stat(`${fmt(memUsed * 0.18, 2)} GB`, 'Önbelleğe alınmış')}</div>`
        + info([['Hız:', '3200 MT/sn'], ['Kullanılan yuvalar:', '2 / 2'], ['Form faktörü:', 'DIMM'], ['Donanım için ayrılmış:', '186 MB']])],
      disk: ['Disk 0 (C:)', '#2e8b3a', `SSD (NVMe) %${Math.round(last('disk'))}`, 'NVMe SSD 512 GB', 'Etkin süre', 'disk',
        `<div class="w11tm-stats">${stat(`%${Math.round(last('disk'))}`, 'Etkin süre')}${stat(`${fmt(0.3 + last('disk') / 20)} ms`, 'Ortalama yanıt süresi')}${stat(`${fmt(last('disk') / 9)} MB/sn`, 'Okuma hızı')}${stat(`${fmt(last('disk') / 14)} MB/sn`, 'Yazma hızı')}</div>`
        + info([['Kapasite:', '512 GB'], ['Biçimlendirilmiş:', '476 GB'], ['Sistem diski:', 'Evet'], ['Sayfa dosyası:', 'Evet'], ['Tür:', 'SSD (NVMe)']])],
      net: ['Wi-Fi', '#c25a0a', online ? `Gön: ${Math.round(last('net') * 3)} Al: ${Math.round(last('net') * 12)} Kb/sn` : 'Bağlantı kesildi', 'Kablosuz Ağ Bağdaştırıcısı', 'Aktarım hızı', 'wifi',
        `<div class="w11tm-stats">${stat(`${Math.round(last('net') * 3)} Kb/sn`, 'Gönderme')}${stat(`${Math.round(last('net') * 12)} Kb/sn`, 'Alma')}</div>`
        + info([['Bağdaştırıcı adı:', 'Wi-Fi'], ['SSID:', esc(online ? s.network : '—')], ['Bağlantı türü:', '802.11ac'], ['Durum:', online ? 'Bağlı' : 'Bağlantı kesildi']])],
    };
    const [title, color, , model, cap, , details] = kinds[perfKind];
    // Kartlar yeniden çizilirken seçili kart değişmesin diye gövde her saniye yenilenir; basılıyken yenilenmez (aşağıya bakın)
    $('.w11tm-body').innerHTML = `<div class="w11tm-perf"><div class="w11tm-plist">${Object.entries(kinds).map(([k, [n, c, sub]]) => `<button type="button" data-perf="${k}" class="${k === perfKind ? 'on' : ''}">${graph(hist[k].slice(-30), c)}<span><b>${n}</b><small>${sub}</small></span></button>`).join('')}</div>
      <div class="w11tm-pmain"><div class="w11tm-ptitle"><b>${title}</b><span>${model}</span></div><div class="w11tm-pcap"><span>${cap}</span><span>%100</span></div>${graph(hist[perfKind], color, true)}<div class="w11tm-pcap"><span>60 saniye</span><span>0</span></div>${details}</div></div>`;
    setActs('');
  }

  // ---- Başlangıç uygulamaları ----
  function renderStartup() {
    const list = STARTUP.filter((x) => (!x.when || x.when(s)) && match(x));
    const boot = 8 + STARTUP.filter((x) => (!x.when || x.when(s)) && !s.startupOff.includes(x.id)).reduce((a, x) => a + x.sec, 0);
    $('.w11tm-body').innerHTML = `<p class="w11tm-boot">Son açılış süresi: <b>${fmt(boot)} saniye</b> <small>(etkin başlangıç uygulamaları çoğaldıkça bilgisayar geç açılır)</small></p>
      <table class="w11tm-t w11tm-d"><thead><tr><th class="w11tm-l">Ad</th><th class="w11tm-l">Yayımcı</th><th class="w11tm-l">Durum</th><th class="w11tm-l">Başlangıç etkisi</th></tr></thead><tbody>
      ${list.map((x) => { const off = s.startupOff.includes(x.id); return `<tr data-start="${x.id}" class="${x.id === sel ? 'sel' : ''}"><td class="w11tm-name"><span class="w11tm-ic">${picOf(x.id)}</span>${esc(x.name)}</td><td class="w11tm-l">${x.pub}</td><td class="w11tm-l">${off ? 'Devre dışı' : 'Etkin'}</td><td class="w11tm-l w11tm-imp ${x.impact === 'Yüksek' && !off ? 'hi' : ''}">${off ? 'Yok' : x.impact}</td></tr>`; }).join('')}</tbody></table>`;
    const x = STARTUP.find((i) => i.id === sel);
    const off = x && s.startupOff.includes(x.id);
    setActs(btn('toggleStart', off ? 'check' : 'tmend', off ? 'Etkinleştir' : 'Devre dışı bırak', !x));
  }

  function render() {
    body.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    $('.w11tm-head h2').textContent = TITLES[tab];
    $('.w11tm-search').style.visibility = ['proc', 'details', 'startup'].includes(tab) ? '' : 'hidden';
    if (tab === 'proc') renderProc();
    else if (tab === 'perf') renderPerf();
    else if (tab === 'startup') renderStartup();
    else if (tab === 'details') renderDetails();
    else if (tab === 'users') renderUsers();
    else if (tab === 'apphist') renderHist();
    else if (tab === 'services') renderServices();
    else renderSettings();
  }

  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    const so = e.target.closest('th[data-sort]');
    if (so) { if (sortKey === so.dataset.sort) sortAsc = !sortAsc; else { sortKey = so.dataset.sort; sortAsc = false; } render(); emit('task-sort', { key: sortKey, asc: sortAsc }); return; }
    const gr = e.target.closest('tr[data-grp]');
    if (gr) { const k = gr.dataset.grp; if (closed.has(k)) closed.delete(k); else closed.add(k); render(); return; }
    const tr = e.target.closest('tr[data-proc], tr[data-start]');
    if (tr) { sel = tr.dataset.proc || tr.dataset.start; render(); emit('task-select', { id: sel }); return; }
    if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; sel = null; render(); emit('task-tab', { tab }); return; }
    if (b.dataset.perf) { perfKind = b.dataset.perf; render(); emit('task-perf', { kind: perfKind }); return; }
    if (b.dataset.act === 'nav') { navOpen = !navOpen; $('.w11tm-nav').classList.toggle('col', !navOpen); return; }
    if (b.dataset.act === 'run') return runTask();
    if (b.dataset.act === 'end') return endTask();
    if (b.dataset.act === 'restart') return restartExplorer();
    if (b.dataset.act === 'eco') { if (eco.has(sel)) eco.delete(sel); else eco.add(sel); emit('task-eco', { id: sel, on: eco.has(sel) }); render(); return; }
    if (b.dataset.act === 'toggleStart') {
      const off = s.startupOff.includes(sel);
      s.startupOff = off ? s.startupOff.filter((x) => x !== sel) : [...s.startupOff, sel];
      emit('startup-toggle', { id: sel, on: off });
      render();
    }
  });
  body.addEventListener('change', (e) => { const o = e.target.dataset?.opt; if (o) opts[o] = e.target.checked; });
  $('.w11tm-q').addEventListener('input', (e) => { query = e.target.value.trim(); render(); });
  // Sağ tık: Windows'taki gibi “Görevi sonlandır” menüsü
  body.addEventListener('contextmenu', (e) => {
    const tr = e.target.closest('tr[data-proc]');
    if (!tr) return;
    e.preventDefault();
    sel = tr.dataset.proc;
    render();
    const p = [...processes().apps, ...processes().bg].find((x) => x.id === sel);
    desk.menu(e.clientX, e.clientY, [{ cmd: 'end', label: 'Görevi sonlandır', disabled: !p || p.sys || p.self, bold: true }, { cmd: 'info', label: 'Çevrimiçi ara' }],
      (c) => (c === 'end' ? endTask() : desk.open('browser', { url: p?.name || '' })), 'task', { id: sel });
  });
  body.addEventListener('keydown', (e) => { if (e.key === 'Delete' && ['proc', 'details'].includes(tab) && sel && e.target.tagName !== 'INPUT') { e.preventDefault(); endTask(); } });

  // Fareyle basılıyken yeniden çizmeyiz: basma ile bırakma arasında satır ya da başlık değişirse tıklama kaybolurdu
  let pressed = false;
  body.addEventListener('pointerdown', () => { pressed = true; });
  document.addEventListener('pointerup', () => setTimeout(() => { pressed = false; }, 0));
  for (let i = 0; i < 20; i++) sample();
  const timer = setInterval(() => {
    if (!body.isConnected) { clearInterval(timer); return; }
    sample();
    if (['proc', 'perf', 'details', 'users'].includes(tab) && !pressed) render();
  }, 1000);
  render();

  return {
    onArgs: (a) => { if (a.tab) { tab = a.tab; render(); } },
    destroy: () => clearInterval(timer),
    get tab() { return tab; },
    get selected() { return sel; },
  };
}
