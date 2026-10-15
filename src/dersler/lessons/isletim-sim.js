// İşletim sistemi dersinin benzetim bilgisayarı: içine girilip kullanılabilen Windows 7, 8.1, 10, 11,
// Ubuntu ve Pardus masaüstleri. Açılış ve giriş ekranı, Başlat menüsü, sürüklenen pencereler, görev çubuğu
// ve küçük programlar (dosya gezgini, not defteri, tarayıcı, hesap makinesi, ayarlar, uçbirim) vardır.
//
// Her sistemin görünüşü ve menüleri isletim-os.js'dedir. Bu dosya ortak motoru ve programları içerir.
// Ekran 960×600 mantıksal pikselde çizilir, sahneye sığacak kadar büyütülüp küçültülür.
//
// Derse giden olaylar (c.emit): os-ready (masaüstüne girildi), os-start (Başlat açıldı; W8'de { fromDesk }),
// os-open { app }, os-about (sürüm bilgisi görüldü), os-yaz { len }, os-power { action }, os-overview.
import * as I from './isletim-simge.js';

export const SW = 960, SH = 600;
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const pad = (n) => String(n).padStart(2, '0');
export const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const GUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const kisa = (s) => s.slice(0, 3);
const trLow = (s) => s.toLocaleLowerCase('tr');

// Saat yazıları: [data-clock="…"] öğeleri her 10 saniyede bir güncellenir
export const CLOCK = {
  hm: (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  dmy: (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`,
  long: (d) => `${d.getDate()} ${AY[d.getMonth()]} ${GUN[d.getDay()]}`,
  long2: (d) => `${GUN[d.getDay()]}, ${d.getDate()} ${AY[d.getMonth()]}`,
  gnome: (d) => `${d.getDate()} ${kisa(AY[d.getMonth()])} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
  xfce: (d) => `${kisa(GUN[d.getDay()])} ${d.getDate()} ${kisa(AY[d.getMonth()])}, ${pad(d.getHours())}:${pad(d.getMinutes())}`,
  my: (d) => `${AY[d.getMonth()]} ${d.getFullYear()}`,
};
export const clk = (kind, cls = '') => `<span class="${cls}" data-clock="${kind}">${CLOCK[kind](new Date())}</span>`;

// Ay takvimi (saat açılır penceresi, Takvim uygulaması)
export function month(d = new Date(), start = 1) {
  const y = d.getFullYear(), m = d.getMonth(), first = (new Date(y, m, 1).getDay() - start + 7) % 7, days = new Date(y, m + 1, 0).getDate();
  const names = start === 1 ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'] : ['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
  let cells = '<i></i>'.repeat(first);
  for (let i = 1; i <= days; i++) cells += `<i class="${i === d.getDate() ? 'on' : ''}">${i}</i>`;
  return `<div class="os-month"><b>${AY[m]} ${y}</b><div>${names.map((n) => `<em>${n}</em>`).join('')}${cells}</div></div>`;
}

// Çubuk menü (Dosya, Düzen…): tıklayınca altında liste açılır. “Çıkış” pencereyi kapatır, diğerleri bilgi verir.
export const mbar = (items) => `<div class="os-mbar">${items.map(([t, sub]) => `<div class="mb-i"><button type="button" data-mb>${t}</button><div class="mb-l">${(sub || ['…']).map((s) => s === '-' ? '<hr>' : `<button type="button" data-mi="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`).join('')}</div>`;

// ---------------------------------------------------------------- örnek dosyalar
const DOSYA = {
  Masaüstü: [],
  Belgeler: [['Alışveriş listesi.txt', 'txt'], ['Dilekçe.docx', 'docx'], ['Aile bütçesi.xlsx', 'xlsx']],
  İndirilenler: [['Fatura_Ekim.pdf', 'pdf'], ['program_kurulum.exe', 'exe', 'win']],
  Müzik: [['Uzun İnce Bir Yoldayım.mp3', 'mp3']],
  Resimler: [['Bayram 2025.jpg', 'jpg'], ['Torunlar.jpg', 'jpg'], ['Bahçe.png', 'png']],
  Videolar: [['Düğün.mp4', 'mp4']],
  Çöp: [['eski not.txt', 'txt']],
};
const METIN = {
  'Alışveriş listesi.txt': 'Alışveriş listesi\n\n- 2 ekmek\n- 1 kg domates\n- Süt\n- Peynir\n- Çay',
  'eski not.txt': 'Pazartesi doktora git.',
};
const KLASOR = ['Masaüstü', 'Belgeler', 'İndirilenler', 'Müzik', 'Resimler', 'Videolar'];
const GL = { Masaüstü: 'desk', Belgeler: 'doc', İndirilenler: 'down', Müzik: 'music', Resimler: 'pic', Videolar: 'video' };

// ================================================================ motor
export function kur(box, os, c, opt = {}) {
  box.innerHTML = `<div class="os-scr os-${os.id} fam-${os.fam}" tabindex="-1"></div>`;
  const scr = box.firstElementChild;
  const st = { phase: '', wins: [], z: 10, seq: 0, active: 0, timers: new Set(), k: 1 };
  const emit = (type, data = {}) => { try { c?.emit?.(type, { os: os.id, ...data }); } catch (err) { console.error(err); } };
  const q = (s) => scr.querySelector(s), qa = (s) => scr.querySelectorAll(s);

  // ---- ölçekleme: 960×600 ekran sahneye ortalanarak sığdırılır
  const fit = () => {
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    st.k = Math.min(r.width / SW, r.height / SH);
    scr.style.transform = `translate(${(r.width - SW * st.k) / 2}px, ${(r.height - SH * st.k) / 2}px) scale(${st.k})`;
  };
  const ro = new ResizeObserver(fit);
  ro.observe(box);
  fit();

  const later = (fn, ms) => { const t = setTimeout(() => { st.timers.delete(t); if (box.isConnected) fn(); }, ms); st.timers.add(t); return t; };
  const tick = setInterval(() => {
    if (!box.isConnected) { stop(); return; }
    const d = new Date();
    qa('[data-clock]').forEach((el) => { el.textContent = CLOCK[el.dataset.clock](d); });
  }, 10000);
  function stop() { clearInterval(tick); ro.disconnect(); st.timers.forEach(clearTimeout); st.timers.clear(); }

  // ---- iskelet
  const api = {
    os, scr, st, q, qa, emit, later, open, close, focus, restore, toast, pop, closePops, phase, renderTasks, area, search, minimizeAll,
    get k() { return st.k; },
  };
  function build() {
    st.wins = []; st.active = 0;
    scr.innerHTML = `<div class="os-desk">${os.desk(api)}</div><div class="os-wins"></div>${os.bar(api)}${os.menu ? os.menu(api) : ''}${os.extra ? os.extra(api) : ''}
      <div class="os-ctx os-pop" data-name="ctx"></div><div class="os-toast"></div><div class="os-over"></div>`;
    renderTasks();
    try { os.init?.(api); } catch (err) { console.error(err); }
  }

  // ---- açılış, giriş, kapanış
  const over = (html, cls = '') => { const o = q('.os-over'); o.className = `os-over ${cls}`; o.innerHTML = html; o.hidden = !html; };
  function phase(p) {
    st.phase = p;
    closePops();
    if (p === 'boot') { build(); over(os.boot(api), 'ov-boot'); later(() => phase(os.lock ? 'lock' : 'login'), 2400); }
    else if (p === 'lock') over(os.lock(api), 'ov-lock');
    else if (p === 'login') { over(os.login(api), 'ov-login'); later(() => q('.os-over input')?.focus({ preventScroll: true }), 120); }
    else if (p === 'welcome') { over(os.welcome(api), 'ov-wait'); later(() => phase('desk'), 1100); }
    else if (p === 'desk') { over(''); os.enter?.(api); emit('os-ready'); }
    else if (p === 'bye' || p === 'byeR') { over(os.bye(api, p === 'byeR'), 'ov-wait'); later(() => (p === 'byeR' ? phase('boot') : phase('off')), 1900); }
    else if (p === 'off') over(`<button type="button" class="os-poweron" data-act="boot"><i>${I.ln.power}</i><span>Bilgisayar kapalı. Açmak için güç düğmesine basın.</span></button>`, 'ov-off');
    else if (p === 'sleep') over('<button type="button" class="os-poweron os-wake" data-act="wake"><span>Uyku modunda. Uyandırmak için tıklayın.</span></button>', 'ov-off');
  }
  function login() {
    if (st.phase !== 'login') return;
    phase(os.welcome ? 'welcome' : 'desk');
  }
  function power(kind) {
    closePops();
    emit('os-power', { action: kind });
    if (kind === 'off') phase('bye');
    else if (kind === 'restart') phase('byeR');
    else if (kind === 'sleep') phase('sleep');
    else if (kind === 'logout' || kind === 'lock') { if (kind === 'logout') { st.wins.forEach((w) => w.el.remove()); st.wins = []; renderTasks(); } phase(os.lock && kind === 'lock' ? 'lock' : 'login'); }
  }

  // ---- açılır paneller (Başlat menüsü, saat, ses…)
  function pop(name, on) {
    const el = q(`.os-pop[data-name="${name}"]`);
    if (!el) return false;
    const open = on ?? !el.classList.contains('on');
    qa('.os-pop.on').forEach((p) => { if (p !== el && !p.contains(el)) p.classList.remove('on'); });
    el.classList.toggle('on', open);
    qa(`[data-pop="${name}"]`).forEach((b) => b.classList.toggle('on', open));
    if (open) { os.onPop?.(name, el, api); if (name === 'start') emit('os-start'); }
    if (open) el.querySelector('input.os-auto')?.focus({ preventScroll: true });
    return open;
  }
  function closePops(except) {
    qa('.os-pop.on').forEach((p) => { if (!except || !p.contains(except)) p.classList.remove('on'); });
    qa('[data-pop].on').forEach((b) => { if (!except || !b.closest('.os-pop')?.contains(except)) b.classList.remove('on'); });
    qa('.mb-i.on').forEach((m) => m.classList.remove('on'));
  }
  function toast(t) {
    const el = q('.os-toast');
    if (!el) return;
    el.innerHTML = t;
    el.classList.add('on');
    clearTimeout(st.toastT);
    st.toastT = later(() => el.classList.remove('on'), 2600);
  }
  // Programlarda arama (Başlat araması, Etkinlikler, Pardus menüsü)
  function search(text) {
    const t = trLow(text.trim());
    if (!t) return [];
    return Object.entries(os.apps).filter(([, A]) => !A.hide && (trLow(A.title).includes(t) || (A.keys || '').includes(t))).slice(0, 7);
  }

  // ---- pencereler
  function area() { const w = os.work; return { l: w.l, t: w.t, r: SW - w.r, b: SH - w.b }; }
  function open(app, arg) {
    if (st.phase !== 'desk') return null;
    const A = os.apps[app];
    closePops();
    if (!A) { toast('Bu program bu benzetimde yok. Başka bir programı deneyin.'); return null; }
    if (A.go) { A.go(api, arg); os.onOpen?.(api, null, app); emit('os-open', { app }); return null; }
    let w = !A.multi && st.wins.find((x) => x.app === app);
    if (w) { if (arg !== undefined) w.arg?.(arg); restore(w); os.onOpen?.(api, w, app); emit('os-open', { app }); return w; }
    const B = A.build || APPS[A.kind || app];
    if (!B) { toast('Bu program bu benzetimde açılmıyor.'); return null; }
    const a = area(), n = st.seq % 6;
    w = { id: ++st.seq, app, A, title: A.title, icon: A.icon, w: A.w || 620, h: A.h || 390, max: !!A.max, min: false };
    w.x = Math.max(a.l + 4, Math.min(a.l + 60 + n * 28, a.r - w.w - 4));
    w.y = Math.max(a.t + 4, Math.min(a.t + 26 + n * 24, a.b - w.h - 4));
    const el = document.createElement('div');
    el.className = `ow ow-${A.kind || app}${A.modern ? ' ow-modern' : ''}${A.dialog ? ' ow-dialog' : ''}`;
    w.el = el;
    const b = B(api, A, arg, w) || {};
    el.innerHTML = (A.modern ? modernTop(w) : titlebar(w, b.head || {})) + `<div class="ow-body">${b.html || ''}</div>`;
    q('.os-wins').append(el);
    st.wins.push(w);
    w.setTitle = (t) => { w.title = t; const tt = el.querySelector('.ow-t'); if (tt && b.head?.title === undefined) tt.textContent = t; renderTasks(); };
    try { b.init?.(el.querySelector('.ow-body'), w); } catch (err) { console.error(err); }
    if (!A.modern) bindDrag(w);
    layout(w);
    focus(w);
    os.onOpen?.(api, w, app);
    emit('os-open', { app });
    return w;
  }
  const wbtn = (k, t) => `<button type="button" data-wb="${k}" title="${t}">${I.ln[k]}</button>`;
  const titlebar = (w, h) => `<div class="ow-tb">${h.left ?? `<span class="ow-ic">${w.icon}</span>`}<span class="ow-t">${h.title ?? esc(w.title)}</span>${h.right || ''}
    <div class="ow-bt">${w.A.dialog ? '' : wbtn('min', 'Simge durumuna küçült') + wbtn('max', 'Ekranı kapla')}${wbtn('close', 'Kapat')}</div></div>`;
  const modernTop = (w) => `<div class="ow-mhot"></div><div class="ow-mtop"><span class="ow-ic">${w.icon}</span><span class="ow-t">${esc(w.title)}</span><div class="ow-bt">${wbtn('min', 'Simge durumuna küçült')}${wbtn('close', 'Kapat')}</div></div><p class="ow-mhint">Kapatmak için fareyi ekranın en üstüne götürün, sağ üstteki ✕'e basın.</p>`;
  function layout(w) {
    const s = w.el.style;
    if (w.A.modern) { s.inset = '0'; }
    else if (w.max) { const a = area(); Object.assign(s, { left: a.l + 'px', top: a.t + 'px', width: a.r - a.l + 'px', height: a.b - a.t + 'px' }); }
    else Object.assign(s, { left: w.x + 'px', top: w.y + 'px', width: w.w + 'px', height: w.h + 'px' });
    w.el.classList.toggle('max', w.max);
    w.el.hidden = w.min;
  }
  function focus(w) {
    if (!w) { st.active = 0; qa('.ow.act').forEach((e) => e.classList.remove('act')); renderTasks(); return; }
    w.el.style.zIndex = (w.A.modern ? 4500 : 0) + ++st.z; // W8 tam ekran uygulamaları görev çubuğunun da üstündedir
    st.active = w.id;
    qa('.ow').forEach((e) => e.classList.toggle('act', e === w.el));
    renderTasks();
  }
  function topWin() { return st.wins.filter((w) => !w.min).sort((a, b) => (+b.el.style.zIndex) - (+a.el.style.zIndex))[0]; }
  function restore(w) { w.min = false; layout(w); focus(w); }
  function minimize(w) { w.min = true; layout(w); focus(topWin()); if (w.A.modern) os.modernGone?.(api); }
  function close(w) {
    w.el.remove();
    st.wins = st.wins.filter((x) => x !== w);
    w.onClose?.();
    focus(topWin());
    if (w.A.modern) os.modernGone?.(api);
  }
  function minimizeAll() { const vis = st.wins.filter((w) => !w.min && !w.A.modern); if (vis.length) vis.forEach((w) => { w.min = true; layout(w); }); else st.wins.forEach((w) => { if (!w.A.modern) { w.min = false; layout(w); } }); focus(topWin()); }
  function toggleMax(w) {
    if (w.A.dialog || w.A.modern) return;
    w.max = !w.max;
    layout(w);
  }
  function bindDrag(w) {
    const tb = w.el.querySelector('.ow-tb');
    w.el.addEventListener('pointerdown', () => { if (st.active !== w.id) focus(w); });
    tb.addEventListener('dblclick', (e) => { if (!e.target.closest('button, input, .bz-tab')) toggleMax(w); });
    tb.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, input, .bz-tab, [data-nodrag]')) return;
      const k = st.k, sx = e.clientX, sy = e.clientY;
      let ox = w.x, oy = w.y, moved = false;
      const mv = (ev) => {
        const dx = (ev.clientX - sx) / k, dy = (ev.clientY - sy) / k;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        if (!moved && w.max) { // ekranı kaplayan pencere sürüklenince eski boyuna döner, imlecin altında kalır
          const rx = (sx - scr.getBoundingClientRect().left) / k;
          w.max = false; ox = Math.max(0, rx - w.w / 2); oy = area().t;
        }
        moved = true;
        const a = area();
        w.x = Math.round(Math.max(a.l - w.w + 80, Math.min(a.r - 80, ox + dx)));
        w.y = Math.round(Math.max(a.t, Math.min(a.b - 30, oy + dy)));
        layout(w);
      };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointermove', mv);
      addEventListener('pointerup', up);
    });
  }
  function renderTasks() {
    const html = os.tasks?.(api);
    if (html != null) qa('.os-tasks').forEach((el) => { el.innerHTML = html; });
  }
  api.running = (app) => st.wins.filter((w) => w.app === app);
  api.isActive = (app) => st.wins.some((w) => w.app === app && w.id === st.active && !w.min);
  api.winById = (id) => st.wins.find((w) => w.id === +id);
  function task(app, id) {
    const ws = id ? [api.winById(id)].filter(Boolean) : api.running(app);
    if (!ws.length) { open(app); return; }
    const w = ws.sort((a, b) => (+b.el.style.zIndex) - (+a.el.style.zIndex))[0];
    if (w.id === st.active && !w.min) minimize(w); else { restore(w); os.taskShown?.(api, w); }
  }

  // ---- fare olayları
  scr.addEventListener('pointerdown', (e) => {
    const t = e.target;
    if (!t.closest('.os-pop, [data-pop], [data-act="start"], .mb-i, .os-keep')) closePops();
    if (t.closest('.os-desk') && !t.closest('.di')) qa('.di.sel').forEach((d) => d.classList.remove('sel'));
    if (t.closest('.os-desk')) focus(null);
  });
  scr.addEventListener('click', (e) => {
    const t = e.target;
    const mb = t.closest('[data-mb]');
    if (mb) { const it = mb.parentElement; const was = it.classList.contains('on'); qa('.mb-i.on').forEach((m) => m.classList.remove('on')); it.classList.toggle('on', !was); return; }
    const mi = t.closest('[data-mi]');
    if (mi) {
      mi.closest('.mb-i')?.classList.remove('on');
      const w = st.wins.find((x) => x.el.contains(mi));
      const k = mi.dataset.mi;
      if (w && /^(Çıkış|Kapat|Pencereyi Kapat)$/.test(k)) close(w);
      else if (w?.menu?.(k) !== true) toast(`“${esc(k)}” komutu bu benzetimde çalışmaz.`);
      return;
    }
    const wb = t.closest('[data-wb]');
    if (wb) { const w = st.wins.find((x) => x.el.contains(wb)); if (!w) return; const k = wb.dataset.wb; if (k === 'close') close(w); else if (k === 'min') minimize(w); else toggleMax(w); return; }
    const tk = t.closest('[data-task]');
    if (tk) { closePops(); task(tk.dataset.task, tk.dataset.win); return; }
    const a = t.closest('[data-act]');
    if (a) { onAct(a.dataset.act, a, e); return; }
    const o = t.closest('[data-open]');
    if (o && !o.classList.contains('di')) { open(o.dataset.open, o.dataset.arg); return; }
    const p = t.closest('[data-pop]');
    if (p) { pop(p.dataset.pop); return; }
    const di = t.closest('.di');
    if (di) { qa('.di.sel').forEach((d) => d.classList.remove('sel')); di.classList.add('sel'); }
  });
  scr.addEventListener('dblclick', (e) => { const di = e.target.closest('.di[data-open]'); if (di) open(di.dataset.open, di.dataset.arg); });
  scr.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.closest('.os-over') && e.target.matches('input')) { e.preventDefault(); login(); }
    if (e.key === 'Escape') closePops();
  });
  scr.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (st.phase !== 'desk' || !os.ctx || !e.target.closest('.os-desk')) return;
    const r = scr.getBoundingClientRect(), m = q('.os-ctx');
    m.innerHTML = os.ctx(api);
    const x = (e.clientX - r.left) / st.k, y = (e.clientY - r.top) / st.k;
    pop('ctx', true);
    m.style.left = Math.min(x, SW - m.offsetWidth - 4) + 'px';
    m.style.top = Math.min(y, SH - m.offsetHeight - 4) + 'px';
  });
  function onAct(name, el, e) {
    if (name === 'login') login();
    else if (name === 'unlock') phase('login');
    else if (name === 'boot') phase('boot');
    else if (name === 'wake') phase(os.lock ? 'lock' : 'login');
    else if (['off', 'restart', 'sleep', 'logout', 'lock'].includes(name)) power(name);
    else if (name === 'start') { if (os.startBtn) os.startBtn(api, el); else pop('start'); }
    else if (name === 'showdesk') minimizeAll();
    else if (name === 'skipboot') { if (st.phase === 'boot') { st.timers.forEach(clearTimeout); st.timers.clear(); phase(os.lock ? 'lock' : 'login'); } }
    else if (name === 'toast') { closePops(); toast(el.dataset.msg || 'Bu bölüm bu benzetimde açılmıyor.'); }
    else if (name === 'ctxok') closePops();
    else if (name === 'toggle') el.classList.toggle('off');
    else os.act?.(name, el, api, e);
  }

  // Başlangıç: istenirse açılış atlanır
  build();
  if (opt.skip === 'desk') { phase('desk'); } else if (opt.skip === 'login') phase(os.lock ? 'lock' : 'login'); else phase('boot');
  return stop;
}

// ================================================================ ortak programlar
const APPS = {};
const ICO = { txt: 1, docx: 1, xlsx: 1, pdf: 1, exe: 1, mp3: 1, mp4: 1, jpg: 1, png: 1 };

// ---- Dosya gezgini (Windows: Bilgisayar / Bu bilgisayar; Ubuntu: Dosyalar; Pardus: Thunar)
APPS.files = (api, A, arg) => {
  const { os } = api, v = A.v, fs = os.fs;
  const win = os.fam === 'win';
  let cur = arg || fs.root, back = [], fwd = [];
  const fIcon = (name) => I.folder(fs.folder, GL[name]);
  const label = (k) => k === 'pc' ? fs.pcName : k === 'home' ? fs.homeName : k === 'C' ? 'Yerel Disk (C:)' : k === 'root' ? 'Dosya Sistemi' : k === 'Çöp' ? fs.trashName : k.startsWith('x:') ? k.slice(2) : k;
  const crumbs = (k) => {
    if (k === 'pc' || k === 'home' || k.startsWith('x:') || k === 'root' || k === 'Çöp') return [label(k)];
    if (k === 'C' || k === 'Windows') return [fs.pcName, 'Yerel Disk (C:)', ...(k === 'Windows' ? ['Windows'] : [])];
    return v === 'w7' ? ['Kitaplıklar', k] : win ? [fs.pcName, k] : [fs.homeName, k];
  };
  const item = (name, icon, act, sub = '') => `<button type="button" class="fx-it" data-fx="${esc(act)}" title="${esc(name)}"><i>${icon}</i><span>${esc(name)}${sub ? `<small>${sub}</small>` : ''}</span></button>`;
  const driveIt = (name, used, total, icon) => `<button type="button" class="fx-it fx-drv" data-fx="${name.includes('C:') ? 'C' : 'dvd'}"><i>${icon}</i><span>${name}${total ? `<u><b style="width:${used / total * 100}%"></b></u><small>${total - used} GB boş / ${total} GB</small>` : ''}</span></button>`;
  const group = (t, body) => `<div class="fx-grp"><h4>${t}</h4><div class="fx-grid">${body}</div></div>`;
  function files(k) {
    const list = (DOSYA[k] || []).filter((f) => !f[2] || (f[2] === 'win') === win);
    if (!list.length) return `<p class="fx-empty">${k === 'Çöp' ? 'Çöp boş.' : 'Bu klasör boş.'}</p>`;
    return `<div class="fx-grid">${list.map(([n, ext]) => item(n, I.file(win ? ext : ext === 'docx' ? 'odt' : ext), 'f:' + n)).join('')}</div>`;
  }
  function view(k) {
    if (k === 'pc') {
      const drv = driveIt('Yerel Disk (C:)', 153, 465, I.drive(true)) + driveIt('DVD RW Sürücüsü (D:)', 0, 0, I.dvd());
      if (v === 'w7') return group('Sabit Disk Sürücüleri (1)', driveIt('Yerel Disk (C:)', 153, 465, I.drive(true))) + group('Çıkarılabilir Depolama Aygıtları (1)', driveIt('DVD RW Sürücüsü (D:)', 0, 0, I.dvd()));
      return group(`Klasörler (${KLASOR.length})`, KLASOR.map((n) => item(n, fIcon(n), n)).join('')) + group('Aygıtlar ve sürücüler (2)', drv);
    }
    if (k === 'home') return `<div class="fx-grid">${[...KLASOR, ...(v === 'gnome' ? ['Şablonlar', 'Genel'] : [])].map((n) => item(n, fIcon(n), DOSYA[n] ? n : 'x:' + n)).join('')}</div>`;
    if (k === 'C') return `<div class="fx-grid">${['Kullanıcılar', 'Program Files', 'Program Files (x86)', 'Windows'].map((n) => item(n, I.folder(fs.folder), n === 'Windows' ? 'Windows' : 'x:' + n)).join('')}</div>`;
    if (k === 'Windows') return '<p class="fx-empty"><b>Windows klasörü</b> işletim sisteminin kendi dosyalarıdır. Buradaki dosyaları silmeyin, taşımayın: bilgisayar açılmayabilir.</p>';
    if (k === 'root') return `<div class="fx-grid">${['bin', 'boot', 'etc', 'home', 'media', 'opt', 'root', 'tmp', 'usr', 'var'].map((n) => item(n, I.folder(fs.folder), n === 'home' ? 'home' : 'x:/' + n)).join('')}</div><p class="fx-note">Linux'ta “C:” sürücüsü yoktur; her şey <b>/</b> (kök) klasöründen başlar. Sizin dosyalarınız <b>/home/${fs.user}</b> içindedir.</p>`;
    if (k.startsWith('x:')) return `<p class="fx-empty">${k.startsWith('x:/') ? 'Bu, sistemin kendi klasörüdür. Buradaki dosyalara dokunmayın.' : 'Burada gösterilecek bir şey yok.'}</p>`;
    return files(k);
  }
  const count = (k) => k === 'pc' ? (v === 'w7' ? 2 : 8) : k === 'home' ? KLASOR.length : (DOSYA[k] || []).filter((f) => !f[2] || (f[2] === 'win') === win).length;
  const side = () => fs.side(v).map((s) => s[0] === '-' ? '<hr>' : s[1] == null ? `<h5>${s[0]}</h5>` : `<button type="button" data-nav="${esc(s[1])}" class="${s[1] === cur ? 'on' : ''}${s[3] ? ' sub' : ''}"><i>${s[2]}</i>${esc(s[0])}</button>`).join('');
  const addr = () => {
    const cr = crumbs(cur);
    if (v === 'thunar') return `<div class="fx-path">${esc(cur === 'root' ? '/' : cur === 'home' ? `/home/${fs.user}/` : cur.startsWith('x:/') ? cur.slice(2) + '/' : cur === 'Çöp' ? 'trash:///' : `/home/${fs.user}/${cur}/`)}</div>`;
    if (v === 'gnome') return `<div class="fx-path">${cr.map((x, i) => `<span>${i === 0 && cur !== 'root' && !cur.startsWith('x:') && cur !== 'Çöp' ? I.ln.home : ''}${esc(x)}</span>`).join('<em>/</em>')}</div>`;
    return `<div class="fx-path"><i>${cur === 'pc' || cur === 'C' ? I.computer(v === 'w11' ? 'w11' : 'w7') : I.folder(fs.folder, GL[cur])}</i>${cr.map((x) => `<span>${v === 'w7' ? '▸ ' : '› '}${esc(x)}</span>`).join('')}</div>`;
  };
  const nav = (k, push = true) => {
    if (k === cur) return;
    if (push) { back.push(cur); fwd = []; }
    cur = k;
    render();
  };
  let body, w;
  function render() {
    if (!body) return;
    body.querySelector('.fx-side').innerHTML = side();
    body.querySelector('.fx-main').innerHTML = view(cur);
    w.el.querySelectorAll('.fx-addr').forEach((el) => { el.innerHTML = addr(); });
    const n = count(cur);
    const sb = body.querySelector('.fx-status');
    if (sb) sb.textContent = v === 'thunar' ? `${n} öğe, boş alan: 182,4 GB` : v === 'w7' ? (cur === 'pc' ? `${fs.host}   Çalışma grubu: WORKGROUP   İşlemci: Intel Core i3   Bellek: 4,00 GB` : `${n} öğe`) : `${n} öğe`;
    w.setTitle?.(label(cur));
    w.el.querySelector('[data-fxb="back"]')?.toggleAttribute('disabled', !back.length);
    w.el.querySelector('[data-fxb="fwd"]')?.toggleAttribute('disabled', !fwd.length);
  }
  const navBtns = `<button type="button" data-fxb="back" title="Geri">${I.ln.back}</button><button type="button" data-fxb="fwd" title="İleri">${I.ln.fwd}</button>`;
  const searchBox = (ph) => `<label class="fx-search"><input placeholder="${ph}"><i>${I.ln.search}</i></label>`;
  let tools = '', head;
  if (v === 'w7') tools = `<div class="fx-row">${navBtns}<div class="fx-addr"></div>${searchBox('Ara')}</div><div class="fx-cmd"><button type="button" data-mi="Düzenle">Düzenle ▾</button><button type="button" data-fxb="props">Sistem özellikleri</button><button type="button" data-mi="Program kaldır">Program kaldır veya değiştir</button><button type="button" data-fxb="cp">Denetim Masasını aç</button></div>`;
  else if (v === 'w8' || v === 'w10') tools = `<div class="fx-ribbon"><b>Dosya</b><span>${cur === 'pc' ? 'Bilgisayar' : 'Giriş'}</span><span>Paylaş</span><span>Görünüm</span></div><div class="fx-row">${navBtns}<button type="button" data-fxb="up" title="Yukarı">${I.ln.up}</button><div class="fx-addr"></div>${searchBox('Ara')}</div>`;
  else if (v === 'w11') tools = `<div class="fx-row">${navBtns}<button type="button" data-fxb="up" title="Yukarı">${I.ln.up}</button><button type="button" data-fxb="ref" title="Yenile">${I.ln.refresh}</button><div class="fx-addr"></div>${searchBox('Ara')}</div><div class="fx-cmd"><button type="button" class="fx-new" data-mi="Yeni">${I.ln.plus} Yeni ▾</button><i class="sep"></i><button type="button" data-mi="Kes" title="Kes">${I.ln.cut}</button><button type="button" data-mi="Kopyala" title="Kopyala">${I.ln.copy}</button><button type="button" data-mi="Yapıştır" title="Yapıştır">${I.ln.paste}</button><button type="button" data-mi="Yeniden adlandır" title="Yeniden adlandır">${I.ln.rename}</button><button type="button" data-mi="Sil" title="Sil">${I.ln.trash}</button><i class="sep"></i><button type="button" data-mi="Sırala">${I.ln.sort} Sırala ▾</button><button type="button" data-mi="Görüntüle">${I.ln.view} Görüntüle ▾</button></div>`;
  else if (v === 'thunar') tools = mbar([['Dosya', ['Yeni Pencere', 'Yeni Klasör', '-', 'Kapat']], ['Düzenle', ['Kes', 'Kopyala', 'Yapıştır', '-', 'Tümünü Seç']], ['Görünüm', ['Simge Görünümü', 'Ayrıntılı Liste']], ['Git', ['Ev', 'Masaüstü', 'Çöp']], ['Yer İmleri', ['Yer İmi Ekle']], ['Yardım', ['İçindekiler', 'Hakkında']]]) + `<div class="fx-row">${navBtns}<button type="button" data-fxb="up" title="Üst klasör">${I.ln.up}</button><button type="button" data-fxb="home" title="Ev">${I.ln.home}</button><div class="fx-addr"></div></div>`;
  else if (v === 'gnome') head = { left: `<span class="hb-btns" data-nodrag>${navBtns}</span>`, title: '<span class="fx-addr"></span>', right: `<span class="hb-btns" data-nodrag><button type="button" data-mi="Ara" title="Ara">${I.ln.search}</button><button type="button" data-mi="Görünüm" title="Görünüm">${I.ln.view}</button><button type="button" data-mi="Menü" title="Menü">${I.ln.menu}</button></span>` };
  return {
    head,
    html: `<div class="fx fx-${v}">${tools}<div class="fx-wrap"><nav class="fx-side"></nav><main class="fx-main"></main></div>${v === 'gnome' ? '' : '<div class="fx-status"></div>'}</div>`,
    init(b, ww) {
      body = b; w = ww;
      w.arg = (k) => nav(k);
      render();
      const onClick = (e) => {
        const n = e.target.closest('[data-nav]');
        if (n) { const k = n.dataset.nav; if (k.startsWith('!')) { api.toast(k.slice(1)); return; } nav(k); return; }
        const fb = e.target.closest('[data-fxb]');
        if (fb) {
          const k = fb.dataset.fxb;
          if (k === 'back' && back.length) { fwd.push(cur); cur = back.pop(); render(); }
          else if (k === 'fwd' && fwd.length) { back.push(cur); cur = fwd.pop(); render(); }
          else if (k === 'up') nav(cur === 'Windows' ? 'C' : cur === 'C' ? 'pc' : win ? 'pc' : cur === 'home' ? 'x:/home' : 'home');
          else if (k === 'home') nav('home');
          else if (k === 'cp') api.open('settings');
          else if (k === 'props') api.open('settings', 'system');
          return;
        }
        const it = e.target.closest('.fx-it');
        b.querySelectorAll('.fx-it.sel').forEach((x) => x.classList.remove('sel'));
        if (it) it.classList.add('sel');
      };
      w.el.addEventListener('click', onClick);
      b.addEventListener('dblclick', (e) => {
        const it = e.target.closest('.fx-it');
        if (!it) return;
        const k = it.dataset.fx;
        if (k === 'dvd') { api.toast('Sürücüde disk yok. Bir CD ya da DVD takın.'); return; }
        if (!k.startsWith('f:')) { nav(k); return; }
        const name = k.slice(2), ext = name.split('.').pop();
        if (ext === 'txt') api.open('notepad', { name, text: METIN[name] || '' });
        else if (ext === 'jpg' || ext === 'png') api.open('viewer', name);
        else api.toast(`“${esc(name)}” bu benzetimde açılmaz. Gerçek bilgisayarda ilgili program açar.`);
      });
    },
  };
};

// ---- Not Defteri / Metin Düzenleyici
APPS.notepad = (api, A, arg) => {
  const v = A.v, name = arg?.name;
  const title = () => v === 'gnome' ? (name || 'Adsız Belge 1') : v === 'prd' ? `${name || 'Adsız 1'} - Mousepad` : `${name || 'Adsız'} - Not Defteri`;
  const menus = v === 'prd'
    ? [['Dosya', ['Yeni', 'Aç…', 'Kaydet', 'Farklı Kaydet…', '-', 'Yazdır…', '-', 'Kapat']], ['Düzenle', ['Geri Al', 'Yinele', '-', 'Kes', 'Kopyala', 'Yapıştır', '-', 'Tümünü Seç']], ['Arama', ['Bul…', 'Bul ve Değiştir…']], ['Görünüm', ['Yazı Tipi…']], ['Belge', ['Satır Kaydır']], ['Yardım', ['Hakkında']]]
    : v === 'w11' ? [['Dosya', ['Yeni sekme', 'Yeni pencere', 'Aç…', 'Kaydet', 'Farklı kaydet', '-', 'Yazdır…', '-', 'Çıkış']], ['Düzenle', ['Geri al', '-', 'Kes', 'Kopyala', 'Yapıştır', 'Sil', '-', 'Bul', 'Değiştir', 'Tümünü seç', 'Saat/Tarih']], ['Görüntüle', ['Yakınlaştır', 'Durum çubuğu', 'Sözcük kaydırma']]]
    : [['Dosya', ['Yeni', 'Aç…', 'Kaydet', 'Farklı Kaydet…', '-', 'Sayfa Yapısı…', 'Yazdır…', '-', 'Çıkış']], ['Düzen', ['Geri Al', '-', 'Kes', 'Kopyala', 'Yapıştır', 'Sil', '-', 'Bul…', 'Değiştir…', '-', 'Tümünü Seç', 'Saat/Tarih']], ['Biçim', ['Sözcük Kaydır', 'Yazı Tipi…']], ['Görünüm', ['Durum Çubuğu']], ['Yardım', ['Yardımı Görüntüle', '-', 'Not Defteri Hakkında']]];
  const head = v === 'gnome' ? { left: `<span class="hb-btns" data-nodrag><button type="button" class="hb-txt" data-mi="Aç">Aç ${I.ln.chevDown}</button><button type="button" data-mi="Yeni belge" title="Yeni belge">${I.ln.plus}</button></span>`, right: `<span class="hb-btns" data-nodrag><button type="button" class="hb-txt" data-mi="Kaydet">Kaydet</button><button type="button" data-mi="Menü" title="Menü">${I.ln.menu}</button></span>` }
    : v === 'w11' ? { title: `<span class="nd-tab">${esc(name || 'Adsız')}<em>${I.ln.close}</em></span><span class="nd-plus">${I.ln.plus}</span>` } : undefined;
  return {
    head,
    html: `<div class="nd nd-${v}">${v === 'gnome' ? '' : mbar(menus)}<textarea spellcheck="false" placeholder="${v === 'gnome' ? 'Yazmaya başlayın…' : ''}">${esc(arg?.text || '')}</textarea>${v === 'w10' || v === 'w11' ? `<div class="nd-status"><span class="nd-pos">Satır 1, Sütun 1</span><span>100%</span><span>Windows (CRLF)</span><span>UTF-8</span></div>` : ''}</div>`,
    init(b, w) {
      w.setTitle(title());
      const ta = b.querySelector('textarea');
      setTimeout(() => ta.focus({ preventScroll: true }), 30);
      const pos = () => { const p = b.querySelector('.nd-pos'); if (!p) return; const before = ta.value.slice(0, ta.selectionStart).split('\n'); p.textContent = `Satır ${before.length}, Sütun ${before.at(-1).length + 1}`; };
      ta.addEventListener('input', () => { pos(); api.emit('os-yaz', { len: ta.value.trim().length, text: ta.value }); });
      ta.addEventListener('keyup', pos);
      ta.addEventListener('click', pos);
      w.arg = (a) => { if (a?.text != null) { ta.value = a.text; w.setTitle(title()); } };
      w.menu = (k) => {
        if (/^Tümünü Seç$/i.test(k)) { ta.focus(); ta.select(); return true; }
        if (/^Saat\/Tarih$/i.test(k)) { const d = new Date(); ta.setRangeText(`${CLOCK.hm(d)} ${CLOCK.dmy(d)}`, ta.selectionStart, ta.selectionEnd, 'end'); ta.focus(); return true; }
        if (/^(Yeni|Yeni sekme)$/.test(k)) { ta.value = ''; ta.focus(); return true; }
        return false;
      };
    },
  };
};

// ---- Tarayıcı: Internet Explorer (W7, W8), Edge (W10, W11), Firefox (Linux)
APPS.browser = (api, A) => {
  const v = A.v;
  const fav = '<i class="bz-fav">B</i>';
  const tabs = `<div class="bz-tabs" data-nodrag><div class="bz-tab on">${fav}<span class="bz-tt">Bulalım</span><em>${I.ln.close}</em></div><button type="button" class="bz-new" data-mi="Yeni sekme" title="Yeni sekme">${I.ln.plus}</button></div>`;
  const head = v === 'ie' ? { title: '' } : { left: v === 'edge' ? `<span class="ow-ic bz-prof">${I.ln.user}</span>${tabs}` : tabs, title: '' };
  const url = '<input class="bz-url" value="www.bulalim.com.tr" spellcheck="false">';
  const bar = v === 'ie'
    ? `<div class="bz-bar"><button type="button" class="bz-b bz-round" data-br="back" title="Geri">${I.ln.back}</button><button type="button" class="bz-b bz-round sm" data-br="fwd" title="İleri">${I.ln.fwd}</button><div class="bz-addr">${url}<button type="button" data-br="go" title="Git">${I.ln.search}</button><button type="button" data-br="home" title="Yenile">${I.ln.refresh}</button></div><div class="bz-tab on">${fav}<span class="bz-tt">Bulalım</span><em>${I.ln.close}</em></div><span class="bz-sp"></span><button type="button" class="bz-b" data-br="home" title="Giriş sayfası">${I.ln.home}</button><button type="button" class="bz-b" data-mi="Sık Kullanılanlar" title="Sık Kullanılanlar">${I.ln.star}</button><button type="button" class="bz-b" data-mi="Araçlar" title="Araçlar">${I.ln.gear}</button></div>`
    : `<div class="bz-bar"><button type="button" class="bz-b" data-br="back" title="Geri">${I.ln.back}</button><button type="button" class="bz-b" data-br="fwd" title="İleri">${I.ln.fwd}</button><button type="button" class="bz-b" data-br="home" title="Yenile">${I.ln.refresh}</button>${v === 'edge' ? `<button type="button" class="bz-b" data-br="home" title="Giriş">${I.ln.home}</button>` : ''}<div class="bz-addr"><i class="bz-lock">${I.ln.lock}</i>${url}${v === 'edge' ? `<i>${I.ln.star}</i>` : ''}</div>${v === 'ff' ? '' : `<button type="button" class="bz-b" data-mi="Sık kullanılanlar" title="Sık kullanılanlar">${I.ln.star}</button>`}<button type="button" class="bz-b" data-mi="Menü" title="Menü">${v === 'ff' ? I.ln.menu : I.ln.dots}</button></div>`;
  const logo = (sm) => `<div class="bl-logo${sm ? ' sm' : ''}"><b style="color:#2d6bd6">B</b><b style="color:#e2452f">u</b><b style="color:#f2b200">l</b><b style="color:#2d6bd6">a</b><b style="color:#2f9a4a">l</b><b style="color:#e2452f">ı</b><b style="color:#2d6bd6">m</b></div>`;
  const home = () => `<div class="bl-home">${logo()}<form class="bl-form"><input name="q" placeholder="Bulalım'da arayın" autocomplete="off"><button>Bulalım'da Ara</button></form><p class="bl-links"><a data-q="hava durumu">Hava durumu</a> · <a data-q="haberler">Haberler</a> · <a data-q="namaz vakitleri">Namaz vakitleri</a> · <a data-q="döviz kurları">Döviz kurları</a></p></div>`;
  const results = (qq) => `<div class="bl-res"><form class="bl-form sm">${logo(true)}<input name="q" value="${esc(qq)}" autocomplete="off"><button>Ara</button></form><p class="bl-n">Yaklaşık 1.240.000 sonuç bulundu</p>${[
    [`${qq} nedir? Anlamı ve kullanımı`, 'sozluk.example.com', `“${qq}” ile ilgili kısa ve anlaşılır bilgiler, örnekler.`],
    [`${qq} - Özgür Ansiklopedi`, 'ansiklopedi.example.org', `${qq} hakkında ayrıntılı makale: tarihçe, özellikler ve kaynaklar.`],
    [`${qq} ile ilgili son haberler`, 'haber.example.com', 'Güncel gelişmeleri ve haberleri buradan takip edebilirsiniz.'],
    [`${qq} nasıl yapılır? Adım adım`, 'nasil.example.net', 'Resimli ve kolay anlatım. Yeni başlayanlar için.'],
  ].map(([t, u, s]) => `<div class="bl-r"><small>${u}</small><a data-site="${esc(u)}">${esc(t)}</a><p>${esc(s)}</p></div>`).join('')}</div>`;
  const site = (u) => `<div class="bl-site"><h3>${esc(u)}</h3><p>Bu benzetimde internete bağlanılmaz. Gerçek tarayıcıyı 8. haftanın internet derslerinde kullanacaksınız.</p><button type="button" data-br="back">‹ Geri dön</button></div>`;
  return {
    head,
    html: `<div class="bz bz-${v}">${bar}<div class="bz-page"></div><div class="bz-st"></div></div>`,
    init(b, w) {
      let hist = [], i = -1;
      const page = b.querySelector('.bz-page'), urlEl = b.querySelector('.bz-url');
      const show = (p) => {
        page.innerHTML = p.k === 'home' ? home() : p.k === 'res' ? results(p.q) : site(p.u);
        urlEl.value = p.k === 'home' ? 'www.bulalim.com.tr' : p.k === 'res' ? `www.bulalim.com.tr/ara?q=${encodeURIComponent(p.q)}` : p.u;
        const t = p.k === 'home' ? 'Bulalım' : p.k === 'res' ? `${p.q} - Bulalım'da Ara` : p.u;
        w.el.querySelectorAll('.bz-tt').forEach((x) => { x.textContent = t; });
        w.setTitle(v === 'ie' ? `${t} - Internet Explorer` : v === 'edge' ? `${t} - Microsoft Edge` : `${t} — Mozilla Firefox`);
        if (p.k === 'home') setTimeout(() => page.querySelector('input')?.focus({ preventScroll: true }), 30);
      };
      const go = (p) => { hist = hist.slice(0, i + 1); hist.push(p); i++; show(p); };
      go({ k: 'home' });
      b.addEventListener('submit', (e) => { e.preventDefault(); const qq = e.target.q.value.trim(); if (qq) go({ k: 'res', q: qq }); });
      urlEl.addEventListener('keydown', (e) => { if (e.key !== 'Enter') return; const t = urlEl.value.trim(); if (!t) return; if (/bulalim/.test(t) && !/\?/.test(t)) go({ k: 'home' }); else if (/\.[a-z]{2,}/i.test(t) && !/\s/.test(t)) go({ k: 'site', u: t }); else go({ k: 'res', q: t }); });
      w.el.addEventListener('click', (e) => {
        const a = e.target.closest('[data-q]'); if (a) { go({ k: 'res', q: a.dataset.q }); return; }
        const s = e.target.closest('[data-site]'); if (s) { go({ k: 'site', u: s.dataset.site }); return; }
        const br = e.target.closest('[data-br]'); if (!br) return;
        const k = br.dataset.br;
        if (k === 'back' && i > 0) show(hist[--i]);
        else if (k === 'fwd' && i < hist.length - 1) show(hist[++i]);
        else if (k === 'home') go({ k: 'home' });
        else if (k === 'go') urlEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });
      w.el.querySelectorAll('.bz-tab em').forEach((x) => x.addEventListener('click', () => api.close(w)));
    },
  };
};

// ---- Hesap Makinesi
APPS.calc = (api, A) => {
  const v = A.v;
  const keys = v === 'w7'
    ? [['MC', 'MR', 'MS', 'M+', 'M-'], ['⌫', 'CE', 'C', '±', '√'], ['7', '8', '9', '÷', '%'], ['4', '5', '6', '×', '1/x'], ['1', '2', '3', '−', '='], ['0', ',', '+']]
    : [['%', 'CE', 'C', '⌫'], ['1/x', 'x²', '√', '÷'], ['7', '8', '9', '×'], ['4', '5', '6', '−'], ['1', '2', '3', '+'], ['±', '0', ',', '=']];
  const top = v === 'w7' ? mbar([['Görünüm', ['Standart', 'Bilimsel', 'Programcı', 'İstatistik']], ['Düzen', ['Kopyala', 'Yapıştır']], ['Yardım', ['Yardımı Görüntüle', 'Hesap Makinesi Hakkında']]])
    : v === 'w10' || v === 'w11' ? `<div class="kh-head"><button type="button" data-mi="Gezinti">${I.ln.menu}</button><b>Standart</b></div>` : '';
  return {
    html: `<div class="kh kh-${v}">${top}<div class="kh-disp"><small class="kh-exp"></small><b class="kh-val">0</b></div><div class="kh-keys">${keys.map((r) => r.map((k) => `<button type="button" data-k="${k}" class="${/\d|,/.test(k) && k.length === 1 ? 'num' : k === '=' ? 'eq' : ''}${v === 'w7' && k === '=' ? ' tall' : ''}${v === 'w7' && k === '0' ? ' wide' : ''}">${k}</button>`).join('')).join('')}</div></div>`,
    init(b) {
      let cur = '0', acc = null, op = null, fresh = true, mem = 0;
      const valEl = b.querySelector('.kh-val'), expEl = b.querySelector('.kh-exp');
      const num = () => parseFloat(cur.replace(',', '.')) || 0;
      const fmt = (n) => { if (!isFinite(n)) return 'Sıfıra bölünemez'; const s = String(+n.toPrecision(12)); return s.replace('.', ','); };
      const calc = (a, o, bb) => o === '+' ? a + bb : o === '−' ? a - bb : o === '×' ? a * bb : o === '÷' ? a / bb : bb;
      const show = () => { valEl.textContent = cur; expEl.textContent = op ? `${fmt(acc)} ${op}` : ''; };
      b.querySelector('.kh-keys').addEventListener('click', (e) => {
        const k = e.target.closest('[data-k]')?.dataset.k;
        if (!k) return;
        if (/^\d$/.test(k)) { cur = fresh || cur === '0' ? k : (cur.length < 16 ? cur + k : cur); fresh = false; }
        else if (k === ',') { if (fresh) { cur = '0,'; fresh = false; } else if (!cur.includes(',')) cur += ','; }
        else if (['+', '−', '×', '÷'].includes(k)) { if (op && !fresh) acc = calc(acc, op, num()); else if (!op) acc = num(); op = k; fresh = true; cur = fmt(acc); }
        else if (k === '=') { if (op) { cur = fmt(calc(acc, op, num())); op = null; acc = null; fresh = true; } }
        else if (k === 'C') { cur = '0'; acc = null; op = null; fresh = true; }
        else if (k === 'CE') { cur = '0'; fresh = true; }
        else if (k === '⌫') { if (!fresh) cur = cur.length > 1 ? cur.slice(0, -1) : '0'; }
        else if (k === '±') cur = fmt(-num());
        else if (k === '√') { cur = fmt(Math.sqrt(num())); fresh = true; }
        else if (k === 'x²') { cur = fmt(num() ** 2); fresh = true; }
        else if (k === '1/x') { cur = fmt(1 / num()); fresh = true; }
        else if (k === '%') { cur = fmt(acc != null ? acc * num() / 100 : num() / 100); fresh = true; }
        else if (k === 'MC') mem = 0; else if (k === 'MR') { cur = fmt(mem); fresh = true; } else if (k === 'MS') mem = num(); else if (k === 'M+') mem += num(); else if (k === 'M-') mem -= num();
        show();
      });
    },
  };
};

// ---- Uçbirim (Linux)
APPS.terminal = (api, A) => {
  const fs = api.os.fs, u = fs.user, h = fs.hostLower, prompt = `<b class="t-p">${u}@${h}</b>:<b class="t-d">~</b>$ `;
  const out = {
    yardım: 'Deneyebileceğiniz komutlar: ls, pwd, whoami, date, uname -a, cat /etc/os-release, echo, clear',
    help: '__yardım',
    ls: 'Belgeler  İndirilenler  Masaüstü  Müzik  Resimler  Videolar',
    pwd: `/home/${u}`, whoami: u,
    'uname -a': `Linux ${h} 6.1.0-${A.v === 'prd' ? '18' : '107'}-amd64 #1 SMP x86_64 GNU/Linux`,
    'cat /etc/os-release': fs.osRelease,
    'lsb_release -a': fs.osRelease,
  };
  return {
    html: `<div class="term term-${A.v}"><div class="t-out">${fs.motd ? `<div>${fs.motd}</div>` : ''}<div class="t-hint">Bir komut yazıp Enter'a basın. Örneğin: <b>ls</b>, <b>date</b>, <b>yardım</b></div></div><label class="t-line"><span>${prompt}</span><input spellcheck="false" autocomplete="off"></label></div>`,
    init(b) {
      const inp = b.querySelector('input'), o = b.querySelector('.t-out');
      setTimeout(() => inp.focus({ preventScroll: true }), 30);
      b.addEventListener('click', () => inp.focus({ preventScroll: true }));
      inp.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const cmd = inp.value.trim(); inp.value = '';
        let r;
        if (cmd === 'clear') { o.innerHTML = ''; return; }
        if (!cmd) r = '';
        else if (cmd === 'date') { const d = new Date(); r = `${kisa(GUN[d.getDay()])} ${d.getDate()} ${kisa(AY[d.getMonth()])} ${d.getFullYear()} ${d.toLocaleTimeString('tr-TR')} +03`; }
        else if (cmd.startsWith('echo ')) r = esc(cmd.slice(5));
        else if (cmd.startsWith('sudo')) r = `[sudo] ${u} için parola: <br>Bu benzetimde yönetici komutları çalıştırılamaz. Gerçek sistemde “sudo” ile program kurulur; dikkatli kullanın.`;
        else if (out[cmd] != null) r = out[cmd] === '__yardım' ? out.yardım : out[cmd];
        else r = `${esc(cmd.split(' ')[0])}: komut bulunamadı`;
        o.insertAdjacentHTML('beforeend', `<div>${prompt}${esc(cmd)}</div>${r ? `<div>${r}</div>` : ''}`);
        b.scrollTop = b.scrollHeight;
      });
    },
  };
};

// ---- Fotoğraf görüntüleyici
APPS.viewer = (api, A, arg) => ({
  html: `<div class="vw vw-${A.v}"><div class="vw-pic"><svg viewBox="0 0 400 260"><defs><linearGradient id="vwsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9e6"/><stop offset="1" stop-color="#cfe9fb"/></linearGradient></defs><rect width="400" height="260" fill="url(#vwsky)"/><circle cx="320" cy="60" r="26" fill="#ffd34d"/><path d="M0 190l80-70 60 50 70-80 90 90 100-60v140H0z" fill="#4c9a3b"/><path d="M0 220q100-40 200 0t200 0v40H0z" fill="#3a7d2c"/>${arg && /Torun|Bayram/.test(arg) ? '<g fill="#7a4a2a"><circle cx="170" cy="168" r="10"/><circle cx="215" cy="172" r="9"/></g><g fill="#d9534f"><rect x="160" y="178" width="20" height="30" rx="6"/></g><g fill="#2f6fd0"><rect x="206" y="181" width="18" height="27" rx="6"/></g>' : ''}</svg></div><div class="vw-bar"><span>${esc(arg || '')}</span><button type="button" data-mi="Önceki">${I.ln.chevLeft}</button><button type="button" data-mi="Sonraki">${I.ln.chevRight}</button><button type="button" data-mi="Döndür">${I.ln.refresh}</button><button type="button" data-mi="Sil">${I.ln.trash}</button></div></div>`,
  init(b, w) { w.setTitle(A.v === 'w7' ? `${arg} - Windows Fotoğraf Görüntüleyicisi` : A.v === 'prd' ? `${arg} - Ristretto` : A.v === 'gnome' ? arg : `Fotoğraflar - ${arg}`); },
});

// ---- Yazılım merkezi (Microsoft Store, Ubuntu Yazılım, Pardus Yazılım Merkezi)
APPS.store = (api, A) => {
  const list = [['VLC Medya Oynatıcı', 'Video ve müzik oynatır', '#f08a00'], ['GIMP', 'Resim düzenleme', '#7a6650'], ['Audacity', 'Ses kaydı ve düzenleme', '#2b62c8'], ['Satranç', 'Bilgisayara karşı satranç', '#3b3b3b'], ['Sudoku', 'Sayı bulmacası', '#2f9a4a'], ['Stellarium', 'Gökyüzü ve yıldız haritası', '#253a7a']];
  return {
    html: `<div class="sw sw-${A.v}"><div class="sw-top"><label class="sw-q"><i>${I.ln.search}</i><input placeholder="Uygulama arayın"></label></div><h3>${A.v === 'w10' || A.v === 'w11' ? 'Önerilen uygulamalar' : A.v === 'prd' ? 'Öne Çıkanlar' : 'Editörün Seçtikleri'}</h3><div class="sw-grid">${list.map(([t, d, cc]) => `<div class="sw-card"><i style="background:${cc}">${esc(t[0])}</i><b>${esc(t)}</b><small>${esc(d)}</small><button type="button" data-ins>${A.v === 'w10' || A.v === 'w11' ? 'Al' : 'Yükle'}</button></div>`).join('')}</div><p class="sw-note">Programları her zaman sistemin kendi yazılım merkezinden ya da programın resmî sitesinden kurun.</p></div>`,
    init(b) {
      b.addEventListener('click', (e) => {
        const bt = e.target.closest('[data-ins]');
        if (!bt || bt.disabled) return;
        bt.disabled = true; bt.textContent = 'Yükleniyor…';
        api.later(() => { bt.textContent = 'Yüklendi'; bt.classList.add('ok'); }, 1500);
      });
    },
  };
};

// ---- LibreOffice Writer (Linux)
APPS.writer = () => ({
  html: `<div class="wr">${mbar([['Dosya', ['Yeni', 'Aç…', 'Kaydet', 'Farklı Kaydet…', '-', 'PDF olarak dışa aktar…', 'Yazdır…', '-', 'Çıkış']], ['Düzen', ['Geri Al', 'Kes', 'Kopyala', 'Yapıştır', 'Tümünü Seç']], ['Görünüm'], ['Ekle', ['Resim…', 'Tablo…']], ['Biçim'], ['Biçemler'], ['Tablo'], ['Araçlar'], ['Yardım']])}
    <div class="wr-tb"><span class="wr-f">Liberation Serif</span><span class="wr-s">12</span><b>K</b><i>İ</i><u>A</u><span class="wr-al">${I.ln.menu}</span></div><div class="wr-doc"><div class="wr-page" contenteditable="true" spellcheck="false"></div></div><div class="wr-st">Sayfa 1 / 1 · 0 sözcük · Türkçe (Türkiye)</div></div>`,
  init(b) { const p = b.querySelector('.wr-page'); setTimeout(() => p.focus({ preventScroll: true }), 30); p.addEventListener('input', () => { const n = p.innerText.trim().split(/\s+/).filter(Boolean).length; b.querySelector('.wr-st').textContent = `Sayfa 1 / 1 · ${n} sözcük · Türkçe (Türkiye)`; }); },
});

// ---- Windows 7 / 8.1 Denetim Masası
APPS.cpanel = (api, A, arg) => {
  const os = api.os;
  const cats = [['Sistem ve Güvenlik', 'Bilgisayarınızın durumunu gözden geçirin · Yedekle', 'sys', '#3c7fd6'], ['Ağ ve Internet', 'Ağ durumunu ve görevlerini görüntüle', 'x', '#2f9a4a'], ['Donanım ve Ses', 'Aygıtları ve yazıcıları görüntüle · Aygıt ekle', 'x', '#7a7a7a'], ['Programlar', 'Program kaldır', 'x', '#c8932a'], ['Kullanıcı Hesapları', 'Hesap türünü değiştir', 'x', '#2f86de'], ['Görünüm ve Kişiselleştirme', 'Temayı değiştir · Masaüstü arka planını değiştir', 'x', '#9b4f96'], ['Saat, Dil ve Bölge', 'Klavyeleri veya diğer giriş yöntemlerini değiştir', 'x', '#3a8b9b'], ['Erişim Kolaylığı', 'Görsel ekranı iyileştir', 'x', '#2a6fc0']];
  const home = () => `<div class="kp-home"><h2>Bilgisayarınızın ayarlarını yapın</h2><div class="kp-cats">${cats.map(([t, s, k, cc]) => `<button type="button" class="kp-cat" data-cp="${k}"><i style="background:${cc}">${I.ln[k === 'sys' ? 'info' : 'gear']}</i><span><b>${t}</b><small>${s}</small></span></button>`).join('')}</div></div>`;
  const sys = () => `<div class="kp-sys"><h2>Bilgisayarınızla ilgili temel bilgileri görüntüleyin</h2><h4>Windows sürümü</h4><div class="kp-ver"><div><p>${os.ver.ed}</p><p>Telif Hakkı © ${os.ver.year} Microsoft Corporation. Tüm hakları saklıdır.</p>${os.ver.sp ? `<p>${os.ver.sp}</p>` : ''}</div><i>${os.id === 'w7' ? I.w7flag(true) : I.w8logo('#1f8fe0')}</i></div><h4>Sistem</h4><dl><dt>İşlemci:</dt><dd>Intel(R) Core(TM) i3 CPU 2,40 GHz</dd><dt>Yüklü bellek (RAM):</dt><dd>4,00 GB</dd><dt>Sistem türü:</dt><dd>64 bit İşletim Sistemi</dd><dt>Bilgisayar adı:</dt><dd>${os.fs.host}</dd></dl></div>`;
  return {
    html: `<div class="kp"><div class="fx-row kp-row"><button type="button" data-cp="home" title="Geri">${I.ln.back}</button><div class="kp-addr"></div><label class="fx-search"><input placeholder="Denetim Masasında Ara"><i>${I.ln.search}</i></label></div><div class="kp-body"></div></div>`,
    init(b, w) {
      const go = (k) => {
        b.querySelector('.kp-body').innerHTML = k === 'sys' ? sys() : home();
        b.querySelector('.kp-addr').innerHTML = `<i>${I.cpanel()}</i><span>▸ Denetim Masası</span>${k === 'sys' ? '<span>▸ Sistem ve Güvenlik</span><span>▸ Sistem</span>' : ''}`;
        w.setTitle(k === 'sys' ? 'Sistem' : 'Denetim Masası');
        if (k === 'sys') api.emit('os-about');
      };
      go(arg === 'system' ? 'sys' : 'home');
      w.arg = (a) => go(a === 'system' ? 'sys' : 'home');
      b.addEventListener('click', (e) => { const t = e.target.closest('[data-cp]'); if (!t) return; if (t.dataset.cp === 'x') api.toast('Bu bölüm bu benzetimde açılmıyor. <b>Sistem ve Güvenlik</b>\'i deneyin.'); else go(t.dataset.cp); });
    },
  };
};

// Ortak program tanımları (her sistem başlık ve simgeyi kendisi verir)
export const app = (kind, title, icon, more = {}) => ({ kind, title, icon, ...more });
