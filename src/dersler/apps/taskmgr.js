// Görev Yöneticisi: açık uygulamalar ve arka plan işlemleri (işlemci, bellek), yanıt vermeyen programı kapatma,
// performans grafikleri (işlemci, bellek, disk, Wi-Fi) ve başlangıç uygulamaları (açılışta kendiliğinden çalışanlar).
import { esc } from './util.js';

const TABS = [['proc', '☰', 'İşlemler'], ['perf', '📈', 'Performans'], ['startup', '🚀', 'Başlangıç uygulamaları']];

// Arka plan işlemleri: pencereleri yoktur ama bilgisayarda çalışırlar
const BACKGROUND = [
  { id: 'av', icon: '🛡', name: 'Windows Güvenlik (virüs koruması)', cpu: 1.2, mem: 96, sys: true },
  { id: 'spool', icon: '🖨', name: 'Yazdırma Biriktiricisi', cpu: 0.1, mem: 12, sys: true },
  { id: 'audio', icon: '🔊', name: 'Ses hizmeti', cpu: 0.3, mem: 18, sys: true },
  { id: 'explorer', icon: '📁', name: 'Windows Gezgini', cpu: 0.6, mem: 74, restart: true },
  { id: 'sync', icon: '☁', name: 'Bulut Eşitleme', cpu: 0.4, mem: 58, startup: 'sync' },
  { id: 'music', icon: '🎵', name: 'Müzik Çalar Yardımcısı', cpu: 0.2, mem: 31, startup: 'music' },
  { id: 'upd', icon: '🔄', name: 'Güncelleme Denetleyicisi', cpu: 0.1, mem: 9, startup: 'upd' },
  { id: 'toolbar', icon: '🔎', name: 'Süper Arama Yardımcısı', cpu: 34, mem: 410, startup: 'toolbar', when: (s) => s.toolbar },
];

// Başlangıç uygulamaları: bilgisayar açılırken kendiliğinden çalışırlar; çok olursa açılış yavaşlar
export const STARTUP = [
  { id: 'sync', icon: '☁', name: 'Bulut Eşitleme', pub: 'Bulut Yazılım', impact: 'Yüksek', sec: 4.1 },
  { id: 'music', icon: '🎵', name: 'Müzik Çalar Yardımcısı', pub: 'Örnek Müzik', impact: 'Orta', sec: 2.2 },
  { id: 'printer', icon: '🖨', name: 'Yazıcı Durum Simgesi', pub: 'R-200 Yazıcı', impact: 'Düşük', sec: 0.6 },
  { id: 'upd', icon: '🔄', name: 'Güncelleme Denetleyicisi', pub: 'Örnek Yazılım A.Ş.', impact: 'Düşük', sec: 0.4 },
  { id: 'toolbar', icon: '🔎', name: 'Süper Arama Yardımcısı', pub: 'Bilinmiyor', impact: 'Yüksek', sec: 6.5, when: (s) => s.toolbar },
];
const MEM_TOTAL = 8192; // MB
const APP_MEM = { browser: 380, word: 160, sheet: 150, slides: 170, paint: 90, mail: 120, photos: 110, explorer: 60, settings: 55 };

const jitter = (v, k = 0.35) => Math.max(0, v * (1 + (Math.random() * 2 - 1) * k));
const fmt = (n, d = 1) => n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

export function taskmgr({ desk, body, args, emit, dialogs }) {
  body.classList.add('tm');
  const s = desk.settings;
  s.startupOff ||= [];
  let tab = args.tab || 'proc', sel = null, perfKind = 'cpu';
  const hist = { cpu: [], mem: [], disk: [], net: [] };
  const procCpu = {}; // her işlemin son işlemci değeri (titreşimli)

  body.innerHTML = `<nav class="tm-nav">${TABS.map(([id, ic, l]) => `<button type="button" data-tab="${id}" title="${l}">${ic} <span>${l}</span></button>`).join('')}</nav>
    <div class="tm-main"><div class="tm-head"><h2></h2><div class="tm-acts"></div></div><div class="tm-body"></div></div>`;
  const $ = (q) => body.querySelector(q);

  // ---- İşlemler ----
  function processes() {
    const apps = [];
    for (const w of desk.wins) {
      if (w.app === 'taskmgr') continue;
      let p = apps.find((a) => a.app === w.app);
      if (!p) apps.push(p = { id: 'app:' + w.app, app: w.app, icon: w.icon, name: w.title.split(' - ').at(-1) || w.title, wins: [], cpu: 0, mem: 0 });
      p.wins.push(w);
      if (w.hung) p.hung = true;
    }
    for (const p of apps) {
      p.name = p.wins.length > 1 ? `${p.wins[0].title.split(' - ').at(-1)} (${p.wins.length})` : p.wins[0].title;
      p.cpu = p.hung ? 0 : 0.4 * p.wins.length;
      p.mem = (APP_MEM[p.app] || 45) * p.wins.length + (p.hung ? 900 : 0);
    }
    // Görev Yöneticisinin kendisi
    apps.push({ id: 'app:taskmgr', app: 'taskmgr', icon: '📊', name: 'Görev Yöneticisi', wins: [], cpu: 1.1, mem: 34, self: true });
    const bg = BACKGROUND.filter((b) => (!b.when || b.when(s)) && (!b.startup || !s.startupOff.includes(b.startup)) && !desk.stopped?.has(b.id) && !(b.id === 'explorer' && desk.explorerRestarting));
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

  function renderProc() {
    const { apps, bg } = processes();
    const t = totals();
    const heat = (v, max) => `style="background:rgba(255,186,0,${Math.min(0.55, (v / max) * 0.9 + 0.06).toFixed(2)})"`;
    const row = (p) => {
      const c = cpuOf(p);
      return `<tr data-proc="${p.id}" class="${p.id === sel ? 'sel' : ''} ${p.hung ? 'hung' : ''}" tabindex="-1">
        <td><span class="tm-ic">${p.icon}</span>${esc(p.name)}</td><td class="tm-st">${p.hung ? '⏳ Yanıt vermiyor' : ''}</td>
        <td ${heat(c, 30)}>%${fmt(c)}</td><td ${heat(p.mem, 900)}>${fmt(p.mem, 1)} MB</td></tr>`;
    };
    $('.tm-body').innerHTML = `<table class="tm-t"><thead><tr><th>Ad</th><th>Durum</th><th>İşlemci<small>%${Math.round(t.cpu)}</small></th><th>Bellek<small>%${Math.round((t.mem / MEM_TOTAL) * 100)}</small></th></tr></thead>
      <tbody><tr class="tm-grp"><td colspan="4">Uygulamalar (${apps.length})</td></tr>${apps.map(row).join('')}
      <tr class="tm-grp"><td colspan="4">Arka plan işlemleri (${bg.length})</td></tr>${bg.map(row).join('')}</tbody></table>`;
    const p = [...apps, ...bg].find((x) => x.id === sel);
    if (!p) sel = null;
    $('.tm-acts').innerHTML = p?.restart ? '<button type="button" class="tm-btn" data-act="restart">⟳ Yeniden başlat</button>'
      : `<button type="button" class="tm-btn" data-act="end" ${!p || p.sys || p.self ? 'disabled' : ''}>⊘ Görevi sonlandır</button>`;
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
  const graph = (data, color) => {
    const pts = data.map((v, i) => `${(i + 60 - data.length) * (100 / 59)},${100 - Math.min(100, v)}`).join(' ');
    return `<svg class="tm-graph" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><pattern id="tmg" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0V10H0" fill="none" stroke="${color}33" stroke-width="0.4"/></pattern></defs>
      <rect width="100" height="100" fill="url(#tmg)"/>${data.length > 1 ? `<polygon points="${(60 - data.length) * (100 / 59)},100 ${pts} 100,100" fill="${color}22"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="0.9" vector-effect="non-scaling-stroke"/>` : ''}</svg>`;
  };
  function renderPerf() {
    const t = totals();
    const last = (k) => hist[k].at(-1) ?? 0;
    const memUsed = t.mem / 1024;
    const kinds = {
      cpu: ['İşlemci (CPU)', '#1f7ad1', `%${Math.round(last('cpu'))} · 3,20 GHz`, `<dl><dt>Kullanım</dt><dd>%${Math.round(last('cpu'))}</dd><dt>Temel hız</dt><dd>3,20 GHz</dd><dt>Çekirdek</dt><dd>6</dd><dt>Mantıksal işlemci</dt><dd>12</dd><dt>İşlem sayısı</dt><dd>${t.all.length + 87}</dd><dt>Açık kalma süresi</dt><dd>0:01:${String(new Date().getSeconds()).padStart(2, '0')}</dd></dl>`, 'Intel Core i5-12400'],
      mem: ['Bellek (RAM)', '#8b3fc4', `${fmt(memUsed)}/8,0 GB (%${Math.round(last('mem'))})`, `<dl><dt>Kullanımda</dt><dd>${fmt(memUsed)} GB</dd><dt>Kullanılabilir</dt><dd>${fmt(8 - memUsed)} GB</dd><dt>Hız</dt><dd>3200 MT/sn</dd><dt>Yuva</dt><dd>2 / 2</dd></dl>`, '8,0 GB DDR4'],
      disk: ['Disk 0 (C:)', '#2e8b3a', `SSD · %${Math.round(last('disk'))}`, `<dl><dt>Etkin süre</dt><dd>%${Math.round(last('disk'))}</dd><dt>Kapasite</dt><dd>512 GB</dd><dt>Tür</dt><dd>SSD (NVMe)</dd></dl>`, 'NVMe SSD 512 GB'],
      net: ['Wi-Fi', '#c25a0a', s.wifi && s.network ? `Al: ${Math.round(last('net') * 12)} Kbps` : 'Bağlantı kesildi', `<dl><dt>Ağ</dt><dd>${esc(s.wifi && s.network ? s.network : '—')}</dd><dt>Alma</dt><dd>${Math.round(last('net') * 12)} Kbps</dd><dt>Gönderme</dt><dd>${Math.round(last('net') * 3)} Kbps</dd></dl>`, 'Kablosuz Ağ Bağdaştırıcısı'],
    };
    const [title, color, , details, model] = kinds[perfKind];
    $('.tm-body').innerHTML = `<div class="tm-perf"><div class="tm-plist">${Object.entries(kinds).map(([k, [n, c, sub]]) => `<button type="button" data-perf="${k}" class="${k === perfKind ? 'on' : ''}">${graph(hist[k].slice(-30), c)}<span><b>${n}</b><small>${sub}</small></span></button>`).join('')}</div>
      <div class="tm-pmain"><div class="tm-ptitle"><b>${title}</b><span>${model}</span></div>${graph(hist[perfKind], color)}<small class="tm-pcap">60 saniye · %100</small>${details}</div></div>`;
    $('.tm-acts').innerHTML = '';
  }

  // ---- Başlangıç uygulamaları ----
  function renderStartup() {
    const list = STARTUP.filter((x) => !x.when || x.when(s));
    const boot = 8 + list.filter((x) => !s.startupOff.includes(x.id)).reduce((a, x) => a + x.sec, 0);
    $('.tm-body').innerHTML = `<p class="tm-boot">Son açılış süresi: <b>${fmt(boot)} saniye</b> <small>(etkin başlangıç uygulamaları çoğaldıkça bilgisayar geç açılır)</small></p>
      <table class="tm-t"><thead><tr><th>Ad</th><th>Yayımcı</th><th>Durum</th><th>Başlangıç etkisi</th></tr></thead><tbody>
      ${list.map((x) => { const off = s.startupOff.includes(x.id); return `<tr data-start="${x.id}" class="${x.id === sel ? 'sel' : ''}"><td><span class="tm-ic">${x.icon}</span>${x.name}</td><td>${x.pub}</td><td>${off ? 'Devre dışı' : 'Etkin'}</td><td class="tm-imp ${x.impact === 'Yüksek' ? 'hi' : ''}">${off ? 'Yok' : x.impact}</td></tr>`; }).join('')}</tbody></table>`;
    const x = list.find((i) => i.id === sel);
    const off = x && s.startupOff.includes(x.id);
    $('.tm-acts').innerHTML = `<button type="button" class="tm-btn" data-act="toggleStart" ${x ? '' : 'disabled'}>${off ? '✔ Etkinleştir' : '⊘ Devre dışı bırak'}</button>`;
  }

  function render() {
    body.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    $('.tm-head h2').textContent = TABS.find((t) => t[0] === tab)[2];
    if (tab === 'proc') renderProc();
    else if (tab === 'perf') renderPerf();
    else renderStartup();
  }

  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    const tr = e.target.closest('tr[data-proc], tr[data-start]');
    if (tr) { sel = tr.dataset.proc || tr.dataset.start; render(); emit('task-select', { id: sel }); return; }
    if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; sel = null; render(); emit('task-tab', { tab }); return; }
    if (b.dataset.perf) { perfKind = b.dataset.perf; render(); emit('task-perf', { kind: perfKind }); return; }
    if (b.dataset.act === 'end') return endTask();
    if (b.dataset.act === 'restart') return restartExplorer();
    if (b.dataset.act === 'toggleStart') {
      const off = s.startupOff.includes(sel);
      s.startupOff = off ? s.startupOff.filter((x) => x !== sel) : [...s.startupOff, sel];
      emit('startup-toggle', { id: sel, on: off });
      render();
    }
  });
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
  body.addEventListener('keydown', (e) => { if (e.key === 'Delete' && tab === 'proc' && sel) { e.preventDefault(); endTask(); } });

  for (let i = 0; i < 20; i++) sample();
  const timer = setInterval(() => {
    if (!body.isConnected) { clearInterval(timer); return; }
    sample();
    if (tab !== 'startup') render();
  }, 1000);
  render();

  return {
    onArgs: (a) => { if (a.tab) { tab = a.tab; render(); } },
    destroy: () => clearInterval(timer),
    get tab() { return tab; },
    get selected() { return sel; },
  };
}
