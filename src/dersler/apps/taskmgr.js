// Görev Yöneticisi: açık programlar ve arka plan işlemleri (CPU, bellek, disk, ağ), görevi sonlandırma,
// yanıt vermeyen programı kapatma, Windows Gezgini'ni yeniden başlatma, performans grafikleri,
// başlangıç uygulamaları (açılışı yavaşlatanlar) ve "Yeni görev çalıştır".
import { esc } from './util.js';
import { APPS } from './index.js';

// Programların yaklaşık yükü: işlemci (%) ve bellek (MB)
const LOAD = {
  browser: [4, 420], word: [1.5, 160], sheet: [1.5, 150], slides: [2, 190], paint: [1, 90], mail: [1, 120], photos: [1, 110],
  music: [1.5, 70], hedef: [3, 60], mayin: [0.5, 30], kartlar: [0.5, 40], settings: [0.5, 55], taskmgr: [1, 35],
};
// Arka plan işlemleri. crit: Windows'un parçası, sonlandırılamaz. restart: yeniden başlatılabilir.
const BG = [
  { id: 'gezgin', name: 'Windows Gezgini', icon: '📁', cpu: 0.6, mem: 64, restart: true, desc: 'Masaüstü, görev çubuğu ve Başlat menüsü' },
  { id: 'defender', name: 'Virüs ve tehdit koruması', icon: '🛡', cpu: 1.1, mem: 145, crit: true, desc: 'Windows Güvenlik' },
  { id: 'search', name: 'Windows Arama', icon: '🔍', cpu: 0.3, mem: 48, crit: true, desc: 'Başlat menüsündeki arama' },
  { id: 'audio', name: 'Windows Ses Hizmeti', icon: '🔊', cpu: 0.2, mem: 14, crit: true, desc: 'Hoparlör ve mikrofon' },
  { id: 'spooler', name: 'Yazdırma Biriktiricisi', icon: '🖨', cpu: 0, mem: 9, crit: true, desc: 'Yazıcıya giden belgeler' },
  { id: 'cloud', name: 'Bulut Yedekleme', icon: '☁', cpu: 0.8, mem: 88, startup: 'cloud', desc: 'Örnek Bulut A.Ş.' },
  { id: 'chat', name: 'Sohbet Uygulaması', icon: '💬', cpu: 1.4, mem: 230, startup: 'chat', desc: 'Örnek İletişim A.Ş.' },
  { id: 'music', name: 'Müzik Çalar Yardımcısı', icon: '🎵', cpu: 0.2, mem: 26, startup: 'music', desc: 'Örnek Medya A.Ş.' },
  { id: 'printer', name: 'Yazıcı Durum Simgesi', icon: '🖨', cpu: 0.1, mem: 18, startup: 'printer', desc: 'Örnek Yazıcı A.Ş.' },
];
// Başlangıç uygulamaları: açılışa etkisi (saniye) ve yayımcı
const STARTUP = [
  { id: 'defender', name: 'Windows Güvenlik bildirim simgesi', icon: '🛡', pub: 'Microsoft Corporation', impact: 'Düşük', sec: 1, keep: true },
  { id: 'cloud', name: 'Bulut Yedekleme', icon: '☁', pub: 'Örnek Bulut A.Ş.', impact: 'Orta', sec: 6 },
  { id: 'chat', name: 'Sohbet Uygulaması', icon: '💬', pub: 'Örnek İletişim A.Ş.', impact: 'Yüksek', sec: 14 },
  { id: 'music', name: 'Müzik Çalar Yardımcısı', icon: '🎵', pub: 'Örnek Medya A.Ş.', impact: 'Orta', sec: 5 },
  { id: 'printer', name: 'Yazıcı Durum Simgesi', icon: '🖨', pub: 'Örnek Yazıcı A.Ş.', impact: 'Düşük', sec: 2 },
];
// "Yeni görev çalıştır" penceresine yazılabilen adlar
const RUN = {
  notepad: 'notepad', calc: 'calc', mspaint: 'paint', paint: 'paint', explorer: 'explorer', winword: 'word', word: 'word', excel: 'sheet',
  powerpnt: 'slides', msedge: 'browser', chrome: 'browser', taskmgr: 'taskmgr', control: 'settings', 'ms-settings:': 'settings', devmgmt: 'devmgr', 'devmgmt.msc': 'devmgr',
};
const TABS = [['proc', '☰', 'İşlemler'], ['perf', '📈', 'Performans'], ['start', '🚀', 'Başlangıç uygulamaları']];
const N = 60; // grafikteki nokta sayısı (60 saniye)

const jitter = (v, k = 0.35) => Math.max(0, v * (1 + (Math.random() * 2 - 1) * k));
const fmtMem = (mb) => (mb >= 1024 ? (mb / 1024).toFixed(1).replace('.', ',') + ' GB' : Math.round(mb) + ' MB');
const pct = (v) => v.toFixed(1).replace('.', ',') + '%';

export function taskmgr({ desk, body, args, emit, dialogs }) {
  body.classList.add('tm');
  const s = desk.settings;
  desk.tmKilled ||= new Set(); // sonlandırılan arka plan işlemleri (yeniden başlatınca geri gelir)
  let tab = args.tab || 'proc', sel = null, sortKey = null, perfSel = 'cpu';
  const hist = { cpu: [], mem: [], disk: [], net: [] };
  let rows = [], totals = { cpu: 0, mem: 0, disk: 0, net: 0 };
  const started = Date.now();

  body.innerHTML = `<nav class="tm-nav">${TABS.map(([id, ic, l]) => `<button type="button" data-tab="${id}" title="${l}"><span>${ic}</span>${l}</button>`).join('')}</nav>
    <div class="tm-main"><div class="tm-head"><h2></h2><div class="tm-tools"><button type="button" data-act="run">▶ Yeni görev çalıştır</button><button type="button" data-act="end" class="tm-end" disabled>⊘ Görevi sonlandır</button></div></div><div class="tm-page"></div></div>`;
  const $ = (q) => body.querySelector(q);
  const pg = $('.tm-page');

  // ---- Ölçümler ----
  function sample() {
    const apps = desk.wins.map((w) => {
      const [c, m] = LOAD[w.app] || [0.8, 60];
      return { key: w.id, kind: 'app', win: w, name: APPS[w.app]?.name || w.title, title: w.title, icon: w.icon, status: w.hung ? 'Yanıt vermiyor' : w.min ? '' : '',
        cpu: w.hung ? jitter(24, 0.15) : jitter(c), mem: m * (w.hung ? 1.6 : 1) * (1 + Math.random() * 0.02), disk: Math.random() < 0.2 ? Math.random() * 0.6 : 0, net: w.app === 'browser' || w.app === 'mail' ? Math.random() * 0.4 : 0 };
    });
    const bg = BG.filter((p) => !desk.tmKilled.has(p.id) && (!p.startup || s.startup[p.startup] !== false)).map((p) => ({
      key: p.id, kind: 'bg', p, name: p.name, icon: p.icon, status: '', cpu: jitter(p.cpu), mem: p.mem * (1 + Math.random() * 0.02),
      disk: p.id === 'cloud' || p.id === 'defender' ? Math.random() * 0.8 : 0, net: p.id === 'cloud' || p.id === 'chat' ? Math.random() * 0.6 : 0,
    }));
    rows = [...apps, ...bg];
    const sys = jitter(2.5, 0.5);
    totals = {
      cpu: Math.min(100, sys + rows.reduce((a, r) => a + r.cpu, 0)),
      mem: 2150 + rows.reduce((a, r) => a + r.mem, 0),
      disk: Math.min(100, rows.reduce((a, r) => a + r.disk, 0) * 6 + Math.random() * 2),
      net: rows.reduce((a, r) => a + r.net, 0) * 300,
    };
    const push = (k, v) => { hist[k].push(v); if (hist[k].length > N) hist[k].shift(); };
    push('cpu', totals.cpu); push('mem', (totals.mem / 8192) * 100); push('disk', totals.disk); push('net', Math.min(100, totals.net / 20));
    if (sel && !rows.some((r) => r.key === sel)) sel = null;
  }

  // ---- Çizim ----
  const heat = (v, max) => { const a = Math.min(1, v / max); return a < 0.05 ? '' : `background:rgba(255,196,0,${(0.15 + a * 0.55).toFixed(2)})`; };
  function graph(k, big) {
    const h = hist[k], W = 300, H = 100;
    const pts = h.map((v, i) => `${((N - h.length + i) / (N - 1)) * W},${H - (v / 100) * H}`).join(' ');
    const col = { cpu: '#1a73c8', mem: '#8e44ad', disk: '#2e8b57', net: '#c2410c' }[k];
    return `<svg class="tm-g ${big ? 'big' : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${big ? Array.from({ length: 9 }, (_, i) => `<line x1="${(i + 1) * 30}" y1="0" x2="${(i + 1) * 30}" y2="${H}"/><line x1="0" y1="${(i + 1) * 10}" x2="${W}" y2="${(i + 1) * 10}"/>`).join('') : ''}
      ${h.length > 1 ? `<polygon points="0,${H} ${pts} ${W},${H}" fill="${col}22"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="${big ? 1.5 : 2}" vector-effect="non-scaling-stroke"/>` : ''}</svg>`;
  }
  const PERF = {
    cpu: () => ['İşlemci (CPU)', 'Örnek Core i5-1235U', pct(totals.cpu), [['Kullanım', pct(totals.cpu)], ['Hız', (1.6 + totals.cpu / 60).toFixed(2).replace('.', ',') + ' GHz'], ['İşlemler', 96 + rows.length], ['Çekirdekler', 10], ['Açık kalma süresi', upTime()]],
      'İşlemci, bilgisayarın “beynidir”. Grafik sürekli %100\'e yakınsa bilgisayar yavaşlar; Görev Yöneticisi\'nde işlemciyi en çok kullanan programa bakın.'],
    mem: () => ['Bellek (RAM)', '8,0 GB', `${fmtMem(totals.mem)} / 8,0 GB`, [['Kullanımda', fmtMem(totals.mem)], ['Kullanılabilir', fmtMem(8192 - totals.mem)], ['Hız', '3200 MHz'], ['Kullanılan yuvalar', '2 / 2']],
      'Bellek, açık programların o anda çalıştığı geçici alandır. Çok sekme ve program açıkken dolar; gereksizleri kapatmak rahatlatır.'],
    disk: () => ['Disk 0 (C:)', 'SSD · 256 GB', pct(totals.disk), [['Etkin süre', pct(totals.disk)], ['Okuma hızı', Math.round(totals.disk * 9) + ' KB/sn'], ['Kapasite', '256 GB'], ['Tür', 'SSD']],
      'Disk, dosyaların kalıcı olarak saklandığı yerdir. Etkin süre uzun süre %100 kalıyorsa bilgisayar takılır; bu genelde güncelleştirme ya da yedekleme sırasında olur.'],
    net: () => [s.wifi && s.network ? 'Wi-Fi' : 'Wi-Fi (bağlı değil)', s.network || '—', s.wifi && s.network ? `Al: ${Math.round(totals.net)} Kbps` : 'Bağlı değil', [['Gönder', Math.round(totals.net * 0.3) + ' Kbps'], ['Al', Math.round(totals.net) + ' Kbps'], ['Ağ adı (SSID)', s.network || '—'], ['Bağlantı türü', '802.11ac']],
      'Ağ grafiği, internetten veri alıp gönderme hızını gösterir. Video izlerken ya da dosya indirirken yükselir.'],
  };
  function upTime() { const sec = Math.floor((Date.now() - started) / 1000) + 3 * 3600 + 25 * 60; return `0:${String(Math.floor(sec / 3600)).padStart(2, '0')}:${String(Math.floor(sec / 60) % 60).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; }

  function render() {
    body.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    $('.tm-head h2').textContent = TABS.find((t) => t[0] === tab)[2];
    const r = sel && rows.find((x) => x.key === sel);
    const end = $('.tm-end');
    end.hidden = tab === 'perf';
    if (tab === 'start') {
      const it = STARTUP.find((x) => x.id === sel);
      end.disabled = !it;
      end.textContent = it && s.startup[it.id] === false ? '✔ Etkinleştir' : '⊘ Devre dışı bırak';
    } else {
      end.disabled = !r || (r.kind === 'bg' && r.p.crit);
      end.textContent = r?.p?.restart ? '⟳ Yeniden başlat' : '⊘ Görevi sonlandır';
    }
    if (tab === 'proc') renderProc();
    else if (tab === 'perf') renderPerf();
    else renderStart();
  }

  function renderProc() {
    const sorted = (list) => (sortKey ? [...list].sort((a, b) => b[sortKey] - a[sortKey]) : list);
    const apps = sorted(rows.filter((x) => x.kind === 'app')), bg = sorted(rows.filter((x) => x.kind === 'bg'));
    const th = (k, l, v) => `<th data-sort="${k}" class="${sortKey === k ? 'on' : ''}" title="Bu sütuna göre sırala"><b>${v}</b><small>${l}${sortKey === k ? ' ▾' : ''}</small></th>`;
    const row = (x) => `<tr data-row="${x.key}" class="${x.key === sel ? 'sel' : ''} ${x.status ? 'hung' : ''}"><td class="tm-name"><span>${x.icon}</span>${esc(x.kind === 'app' && x.title !== x.name ? `${x.name} — ${x.title}` : x.name)}</td>
      <td class="tm-st">${x.status ? '⏳ ' + x.status : ''}</td><td style="${heat(x.cpu, 30)}">${pct(x.cpu)}</td><td style="${heat(x.mem, 600)}">${fmtMem(x.mem)}</td><td style="${heat(x.disk, 1)}">${x.disk.toFixed(1).replace('.', ',')} MB/sn</td><td style="${heat(x.net, 1)}">${x.net.toFixed(1).replace('.', ',')} Mbps</td></tr>`;
    pg.innerHTML = `<table class="tm-t"><thead><tr><th class="tm-name">Ad</th><th class="tm-st">Durum</th>${th('cpu', 'CPU', pct(totals.cpu))}${th('mem', 'Bellek', Math.round((totals.mem / 8192) * 100) + '%')}${th('disk', 'Disk', Math.round(totals.disk) + '%')}${th('net', 'Ağ', '%' + Math.round(Math.min(100, totals.net / 20)))}</tr></thead>
      <tbody><tr class="tm-grp"><td colspan="6">Uygulamalar (${apps.length})</td></tr>${apps.map(row).join('') || '<tr><td colspan="6" class="tm-none">Açık program yok.</td></tr>'}
      <tr class="tm-grp"><td colspan="6">Arka plan işlemleri (${bg.length})</td></tr>${bg.map(row).join('')}</tbody></table>`;
  }

  function renderPerf() {
    const [t, sub, val, det, why] = PERF[perfSel]();
    pg.innerHTML = `<div class="tm-perf"><div class="tm-plist">${Object.keys(PERF).map((k) => { const [n, , v] = PERF[k](); return `<button type="button" data-perf="${k}" class="${k === perfSel ? 'on' : ''}">${graph(k)}<span><b>${n}</b><small>${v}</small></span></button>`; }).join('')}</div>
      <div class="tm-pbig"><div class="tm-ptitle"><h3>${t}</h3><span>${esc(sub)}</span></div><small class="tm-pnote">${perfSel === 'mem' ? 'Bellek kullanımı' : perfSel === 'net' ? 'Aktarım hızı' : '% Kullanım'} · son 60 saniye</small>${graph(perfSel, true)}
        <dl class="tm-det">${det.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="tm-why">💡 ${why}</p></div></div>`;
  }

  function renderStart() {
    const sec = 12 + STARTUP.reduce((a, x) => a + (s.startup[x.id] !== false ? x.sec : 0), 0);
    pg.innerHTML = `<p class="tm-boot">⏱ Tahmini açılış süresi: <b>${sec} saniye</b> <small>Bilgisayar açılırken kendiliğinden başlayan programlar. Gereksizleri <b>devre dışı bırakmak</b> açılışı hızlandırır; program silinmez, yalnızca kendiliğinden açılmaz.</small></p>
      <table class="tm-t tm-st-t"><thead><tr><th class="tm-name">Ad</th><th>Yayımcı</th><th>Durum</th><th>Başlangıç etkisi</th></tr></thead><tbody>
      ${STARTUP.map((x) => { const on = s.startup[x.id] !== false; return `<tr data-start="${x.id}" class="${x.id === sel ? 'sel' : ''}"><td class="tm-name"><span>${x.icon}</span>${x.name}</td><td>${x.pub}</td><td class="${on ? '' : 'tm-off'}">${on ? 'Etkin' : 'Devre dışı'}</td><td class="tm-imp tm-imp-${x.impact === 'Yüksek' ? 'h' : x.impact === 'Orta' ? 'm' : 'l'}">${on ? x.impact : 'Yok'}</td></tr>`; }).join('')}</tbody></table>`;
  }

  // ---- İşlemler ----
  async function endTask() {
    if (tab === 'start') return toggleStartup(sel);
    const r = rows.find((x) => x.key === sel);
    if (!r) return;
    if (r.kind === 'app') {
      desk.destroy(r.win);
      emit('end-task', { target: r.win.app, hung: !!r.win.hung, via: 'taskmgr' });
      sel = null;
    } else if (r.p.restart) {
      restartExplorer();
    } else if (r.p.crit) {
      return;
    } else {
      desk.tmKilled.add(r.p.id);
      emit('end-task', { target: r.p.id, bg: true, via: 'taskmgr' });
      sel = null;
    }
    sample(); render();
  }

  function restartExplorer() {
    // Görev çubuğu ve masaüstü simgeleri bir an kaybolup geri gelir (donmuş görev çubuğunu düzeltmenin bilinen yolu)
    const parts = desk.root.querySelectorAll('.dk-taskbar, .dk-icons');
    parts.forEach((x) => { x.style.visibility = 'hidden'; });
    desk.closeMenus();
    emit('explorer-restart', { start: true });
    setTimeout(() => {
      parts.forEach((x) => { x.style.visibility = ''; });
      desk.renderTaskbar(); desk.renderIcons();
      emit('explorer-restart', { start: false });
    }, 1400);
  }

  function toggleStartup(id) {
    const it = STARTUP.find((x) => x.id === id);
    if (!it) return;
    const on = s.startup[id] === false;
    if (!on && it.keep) desk.toast('Önerilmez', 'Güvenlik programını açılışta kapatmak bilgisayarı korumasız bırakabilir. Bunu açık bırakın.', '🛡', 6000);
    s.startup = { ...s.startup, [id]: on };
    emit('startup-toggle', { id, name: it.name, on, impact: it.impact });
    render();
  }

  async function runTask() {
    const v = await dialogs.form({
      title: 'Yeni görev oluştur', icon: '▶', ok: 'Tamam',
      text: 'Açmak istediğiniz programın adını yazın; Windows sizin için açsın.<br><small>Örnek: <b>notepad</b>, <b>calc</b>, <b>mspaint</b>, <b>explorer</b></small>',
      fields: [{ name: 'cmd', label: 'Aç:' }],
      check: (x) => { const k = x.cmd.trim().toLowerCase().replace(/\.exe$/, ''); return !k ? 'Bir ad yazın.' : RUN[k] ? '' : `Windows “${x.cmd.trim()}” öğesini bulamıyor. Adın doğru yazıldığından emin olun.`; },
    });
    if (!v) return;
    const app = RUN[v.cmd.trim().toLowerCase().replace(/\.exe$/, '')];
    if (app === 'explorer' && desk.root.querySelector('.dk-taskbar').style.visibility === 'hidden') { restartExplorer(); return; }
    desk.open(app);
    emit('run-task', { cmd: v.cmd.trim(), target: app });
  }

  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]');
    if (t) { tab = t.dataset.tab; sel = null; render(); emit('taskmgr-tab', { tab }); return; }
    const so = e.target.closest('[data-sort]');
    if (so) { sortKey = sortKey === so.dataset.sort ? null : so.dataset.sort; render(); emit('taskmgr-sort', { key: sortKey }); return; }
    const p = e.target.closest('[data-perf]');
    if (p) { perfSel = p.dataset.perf; render(); emit('taskmgr-perf', { part: perfSel }); return; }
    const row = e.target.closest('[data-row], [data-start]');
    if (row) { sel = row.dataset.row || row.dataset.start; render(); emit('taskmgr-select', { key: sel, name: rows.find((x) => x.key === sel)?.name }); return; }
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'end') endTask();
    if (a === 'run') runTask();
  });
  body.addEventListener('dblclick', (e) => {
    const row = e.target.closest('[data-row]');
    const r = row && rows.find((x) => x.key === row.dataset.row);
    if (r?.kind === 'app') { if (r.win.min) desk.restore(r.win); else desk.focus(r.win); }
  });
  body.addEventListener('contextmenu', (e) => {
    const row = e.target.closest('[data-row], [data-start]');
    if (!row) return;
    e.preventDefault();
    sel = row.dataset.row || row.dataset.start;
    render();
    if (row.dataset.start) {
      const off = s.startup[sel] === false;
      desk.menu(e.clientX, e.clientY, [{ cmd: 'toggle', label: off ? 'Etkinleştir' : 'Devre dışı bırak', bold: true }], () => toggleStartup(sel), 'taskmgr-start');
      return;
    }
    const r = rows.find((x) => x.key === sel);
    const items = r.kind === 'app'
      ? [{ cmd: 'switch', label: 'Geçiş yap' }, { cmd: 'end', label: 'Görevi sonlandır', bold: true }]
      : r.p.restart ? [{ cmd: 'end', label: 'Yeniden başlat', bold: true }] : [{ cmd: 'end', label: 'Görevi sonlandır', disabled: !!r.p.crit }];
    desk.menu(e.clientX, e.clientY, items, (c) => {
      if (c === 'end') endTask();
      if (c === 'switch') { if (r.win.min) desk.restore(r.win); else desk.focus(r.win); }
    }, 'taskmgr-row', { name: r.name });
  });
  body.addEventListener('keydown', (e) => { if (e.key === 'Delete' && sel) { e.preventDefault(); endTask(); } });
  body.tabIndex = -1;

  sample();
  for (let i = 0; i < 8; i++) sample(); // grafik boş başlamasın
  render();
  const timer = setInterval(() => {
    if (!body.isConnected) { clearInterval(timer); return; }
    sample();
    // Açılır menü varken tabloyu yenilemek seçimi bozmasın
    if (!desk.screen.querySelector('.dk-ctx') && !dialogs.busy) render();
  }, 1000);

  return {
    destroy: () => clearInterval(timer),
    focus: () => body.focus({ preventScroll: true }),
    onArgs: (a) => { if (a.tab) { tab = a.tab; sel = null; render(); } },
    get rows() { return rows; },
    get totals() { return totals; },
  };
}
