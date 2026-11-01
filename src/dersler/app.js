// Dersler sayfası: ders listesi, adım adım yönlendirme, ilerlemenin ve adım sürelerinin kaydı.
// Üç tür sahne vardır: 'notepad' (tek Not Defteri + klavye), 'desktop' (benzetim Windows), 'scene' (etkinlik).
import { emojiIcon } from './svgicons.js';
import { LESSONS, WEEKS } from './lessons/index.js';
import { Keyboard, keyLabel } from './keyboard.js';
import { setupTouch } from './dokunmatik.js';
import { Notepad } from './notepad.js';
import { Dialogs, esc } from './dialog.js';
import { Desktop } from './desktop.js';
import { startIcons } from '../icons.js';

const $ = (s) => document.querySelector(s);
const K = (...names) => names.map((n) => `<kbd>${n}</kbd>`).join(' + ');
const HINT_DELAY = 40000;

// ---- Öğrenci profilleri: aynı bilgisayarı kullananların ilerlemesi ayrı saklanır ----
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* yoksay */ } };
const PROF_KEY = 'bilgisayar-dersleri.ogrenci', LIST_KEY = 'bilgisayar-dersleri.ogrenciler', ASKED_KEY = 'bilgisayar-dersleri.secildi';
// Ortak anahtar: dersler ve Robo aynı "şu anki öğrenci" adını kullanır (yoksa null, misafirse '')
const SHARED_KEY = 'ogrenci-ortak', SESSION_KEY = 'ogrenci-ortak-oturum', ROBO_LIST_KEY = 'robo-profiller';
const who = lsGet(SHARED_KEY, null) ?? lsGet(PROF_KEY, '');
const profiles = () => lsGet(LIST_KEY, []);
// Misafir eski anahtarı kullanır; profiller öncesinden kalan ilerleme kaybolmaz
const storeKey = (name) => 'bilgisayar-dersleri.v2' + (name ? '@' + name : '');

// ---- Kalıcı ayarlar ve ilerleme (yalnızca bu tarayıcıda) ----
const STORE_KEY = storeKey(who);
let store = { fs: 20, sound: true, lessons: {} };
try { store = { ...store, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; } catch { /* gizli pencere vb. */ }
const persist = () => { store.seen = Date.now(); try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* yoksay */ } };
let saveTimer = 0;
const saveSoon = () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveProgress, 400); };

// ---- Ses: adım tamamlanınca kısa, yumuşak bir "ding" ----
let actx = null;
function chime() {
  if (!store.sound) return;
  try {
    actx ||= new AudioContext();
    const t = actx.currentTime;
    [660, 880].forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.5);
      o.connect(g).connect(actx.destination);
      o.start(t + i * 0.12);
      o.stop(t + i * 0.12 + 0.55);
    });
  } catch { /* ses yoksa sorun değil */ }
}

// ---- Sahneler ----
const kb = new Keyboard($('#kb'));
const touch = setupTouch({ bar: $('#tbar'), keyLabel, work: $('#work') });
// Telefonda anlatım kutusu küçültülebilir: yalnızca başlık, tuş ve düğmeler kalır, alıştırma bilgisayarı büyür
function setMini(on) {
  document.body.classList.toggle('gmini', on);
  $('#gmini').textContent = on ? '▾ Anlatımı göster' : '▴ Anlatımı küçült';
  $('#gmini').setAttribute('aria-expanded', !on);
}
$('#gmini').onclick = () => setMini(!document.body.classList.contains('gmini'));
const npDialogs = new Dialogs($('#work'), (ev) => onEvent(ev));
const np = new Notepad($('#np'), onEvent, { dialogs: npDialogs, global: true });
np.active = false;
let desk = null; // ilk masaüstü dersi açılınca kurulur
const getDesk = () => (desk ||= new Desktop($('#desk'), onEvent));

let lesson = null; // açık ders
let idx = 0;       // adım sırası
let step = null;
let done = false;
let ctx = null;
let hintTimer = 0;
let stepStart = 0;
let stepWarns = 0;

// ---- Görünüm: ana sayfa / ders ----
function route() {
  const m = location.hash.match(/^#ders\/(.+)$/);
  const l = m && LESSONS.find((x) => x.id === m[1]);
  const h = location.hash.match(/^#hafta\/(\d+)$/);
  if (l) openLesson(l);
  else if (location.hash === '#ozet') showOzet();
  else showHome(h && +h[1] < WEEKS.length ? +h[1] : null);
}

// ---- Eğitmen özeti: bu bilgisayardaki bütün öğrencilerin ilerlemesi ----
function ozetTable() {
  const rows = [...profiles().map((n) => [n, n === who ? store : lsGet(storeKey(n), {})])];
  const guest = who ? lsGet(storeKey(''), {}) : store;
  if (Object.keys(guest.lessons || {}).length || guest.logs) rows.push(['Misafir', guest]);
  const weeks = WEEKS.filter((w) => w.no);
  const cell = (w, st) => {
    const ls = w.lessons.filter((l) => !l.link);
    const n = ls.filter((l) => st.lessons?.[l.id]?.done).length;
    const t = ls.find((l) => l.test);
    const sc = t && st.lessons?.[t.id]?.done ? testScore(t, st) : null;
    const cls = n === ls.length ? 'full' : n ? 'part' : '';
    return `<td class="${cls}">${n ? `${n} / ${ls.length}` : '–'}${sc ? `<small>Test ${sc.right}/${sc.total}</small>` : ''}</td>`;
  };
  const hizCell = (st) => {
    const L = st.logs?.hiz;
    if (!L?.length) return '<td>–</td>';
    const f = L.at(-1).wpm - L[0].wpm;
    return `<td>${L.at(-1).wpm} kelime/dk${L.length > 1 ? `<small>ilk: ${L[0].wpm} (${f >= 0 ? '+' : ''}${f})</small>` : ''}</td>`;
  };
  const seen = (st) => (st.seen ? new Date(st.seen).toLocaleDateString('tr-TR') : '–');
  if (!rows.length) return '';
  return `<table class="oz-t"><thead><tr><th>Öğrenci</th>${weeks.map((w) => `<th title="${esc(w.title)}">${w.no}. hafta</th>`).join('')}<th>Yazma hızı</th><th>Son çalışma</th></tr></thead>
    <tbody>${rows.map(([n, st]) => `<tr><td><b>${esc(n)}</b></td>${weeks.map((w) => cell(w, st)).join('')}${hizCell(st)}<td>${seen(st)}</td></tr>`).join('')}</tbody></table>`;
}

function showOzet() {
  if (lesson) saveProgress();
  lesson = null;
  np.active = false;
  document.body.dataset.view = 'ozet';
  $('#crumb').textContent = 'Eğitmen özeti';
  clearTimeout(hintTimer);
  const t = ozetTable();
  $('#ozet').innerHTML = `<div class="oz"><h1>📊 Eğitmen özeti</h1>
    <p class="mut">Bu bilgisayarda kayıtlı öğrencilerin her haftada bitirdiği ders sayısı ve test puanı (ilk denemede doğru bilinen sorular). Yeşil: hafta tamam, sarı: yarım. Kayıtlar yalnızca bu bilgisayarın tarayıcısındadır; her bilgisayarın özeti ayrıdır.</p>
    ${t ? `<div class="oz-wrap">${t}</div><div class="oz-btns"><button type="button" class="btn" id="ozPrint">Yazdır</button><a class="btn" href="#">Ders listesi</a></div>` : '<p>Henüz kayıtlı öğrenci yok. Öğrenciler üstteki 👤 düğmesinden adlarını ekleyince burada görünür.</p><a class="btn" href="#">Ders listesi</a>'}</div>`;
  const pr = $('#ozPrint');
  if (pr) pr.onclick = () => {
    $('#printCard').innerHTML = `<h1>📊 Eğitmen özeti</h1><p>${new Date().toLocaleDateString('tr-TR')}</p>${t}`;
    print();
  };
}

function showHome(w = null) {
  homeWeek = w;
  if (lesson) saveProgress();
  lesson = null;
  np.active = false;
  document.body.dataset.view = 'home';
  $('#crumb').textContent = '';
  clearTimeout(hintTimer);
  renderHome();
}

// ---- Ana sayfa: 4 ayrı tasarım; sağ üstteki "Tasarım" düğmesi sırayla değiştirir ----
// Ana görünümde haftalar; bir haftaya tıklanınca (#hafta/N) yalnızca o haftanın dersleri görünür.
const DESIGNS = [['karo', 'Karolar'], ['masa', 'Masaüstü'], ['harita', 'Yolculuk haritası'], ['koyu', 'Koyu modern']];
let design = Math.max(0, DESIGNS.findIndex(([k]) => k === lsGet('bd-tasarim', 'karo')));
let homeWeek = null;
const WEEK_ICONS = ['🖱️', '⌨️', '📝', '🖥️', '🪟', '📁', '🎨', '🌐', '📧', '📄', '📊', '📽️', '📱', '🏛', '🔒'];
const WEEK_HUES = [210, 265, 330, 25, 200, 45, 300, 175, 230, 220, 140, 15, 190, 0, 160];
const weekIcon = (w) => emojiIcon(w.no ? WEEK_ICONS[w.no - 1] || '📘' : '🎓');
const weekHue = (w) => (w.no ? WEEK_HUES[(w.no - 1) % WEEK_HUES.length] : 50);
const realLessons = (w) => w.lessons.filter((l) => !l.link);
const isDone = (l) => !!store.lessons[l.id]?.done;
const weekOf = (l) => WEEKS.findIndex((w) => w.lessons.includes(l));
const weekName = (w) => (w.no ? `${w.no}. hafta` : 'Ek dersler');

function siradaki() {
  const all = LESSONS.filter((l) => !l.link);
  const going = all.find((l) => !isDone(l) && store.lessons[l.id]?.step > 0);
  if (going) return { l: going, going: true };
  return { l: all.find((l) => !isDone(l)), going: false };
}

// Haftaların özeti: tasarımların hepsi bunu kullanır
function weekInfo() {
  return WEEKS.map((w, i) => {
    const ls = realLessons(w);
    const n = ls.filter(isDone).length;
    return { w, i, n, total: ls.length, full: ls.length > 0 && n === ls.length, pct: ls.length ? (n / ls.length) * 100 : 0, hue: weekHue(w), icon: weekIcon(w), name: weekName(w), title: w.title, href: `#hafta/${i}` };
  });
}

// "Kaldığınız yer" bilgisi
function devamInfo() {
  const nx = siradaki();
  const all = LESSONS.filter((l) => !l.link);
  const nDone = all.filter(isDone).length;
  if (!nx.l) return { bitti: true, nDone, total: all.length };
  const w = WEEKS[weekOf(nx.l)];
  const p = store.lessons[nx.l.id];
  return {
    nDone, total: all.length, href: `#ders/${nx.l.id}`, icon: emojiIcon(nx.l.icon), title: nx.l.title, hue: weekHue(w), wi: weekOf(nx.l),
    label: nx.going ? 'Kaldığınız yer' : nDone ? 'Sıradaki ders' : 'İlk dersiniz',
    sub: `${weekName(w)} · ${nx.going ? `Adım ${p.step + 1} / ${nx.l.steps.length}` : `yaklaşık ${nx.l.minutes} dakika`}`,
    go: nx.going ? 'Devam et' : 'Başla',
  };
}

// Bir haftanın içindeki ders (bütün tasarımlarda aynı yapı, görünüşü CSS belirler)
function lessonItem(l, no) {
  const desc = esc(l.desc);
  const head = `<span class="li-no">${no}</span><span class="li-ic">${emojiIcon(l.icon)}</span><div class="li-tx"><h3>${l.title}</h3><p title="${desc}">${l.desc}</p></div>`;
  if (l.link) return `<article class="li link">${head}<div class="li-alt"><span class="tag">3B gezinti</span><a class="btn" href="${l.link}">Aç</a></div></article>`;
  const p = store.lessons[l.id];
  const total = l.steps.length;
  const sc = l.test && testScore(l);
  let status = `<span class="tag">~${l.minutes} dk</span>`;
  let btn = `<a class="btn primary" href="#ders/${l.id}">Başla</a>`;
  const last = store.logs?.[l.id]?.at(-1);
  if (last?.wpm != null) {
    status = `<span class="tag ok">⌨ ${last.wpm} kelime/dk</span>`;
    btn = `<a class="btn" href="#ders/${l.id}" data-restart="${l.id}">↻ Yeniden ölç</a>`;
  } else if (p?.done) {
    status = `<span class="tag ok">✔ ${sc ? `Puan: ${sc.right} / ${sc.total}` : 'Bitti'}</span>`;
    btn = `<a class="btn" href="#ders/${l.id}" data-restart="${l.id}">↻ Tekrar</a>`;
  } else if (p?.step > 0) {
    status = `<span class="tag yarim">Adım ${p.step + 1} / ${total}</span>`;
    btn = `<a class="btn primary" href="#ders/${l.id}">Devam</a>`;
  }
  return `<article class="li${p?.done ? ' done' : ''}">${head}<div class="li-alt">${status}${btn}</div></article>`;
}

function weekPage(i) {
  const w = WEEKS[i];
  const info = weekInfo()[i];
  const prev = WEEKS[i - 1], next = WEEKS[i + 1];
  return `<div class="wk" style="--h:${info.hue}">
    <div class="wk-bar"><span class="wk-ad">${info.icon} ${info.name}: ${w.title}</span><a class="geri" href="#">‹ Bütün haftalar</a></div>
    <div class="wk-body"><div class="wk-bas"><span class="wk-ic">${info.icon}</span><div><small>${info.name}</small><h2>${w.title}</h2><span class="wk-say">${info.total} dersten <b>${info.n}</b> tanesi bitti</span></div></div>
    <div class="wk-ler">${w.lessons.map((l, k) => lessonItem(l, k + 1)).join('')}</div>
    <div class="wnav">${prev ? `<a class="btn" href="#hafta/${i - 1}">‹ ${weekName(prev)}</a>` : ''}<span class="sp"></span>${next ? `<a class="btn primary" href="#hafta/${i + 1}">Sonraki: ${weekName(next)} ›</a>` : ''}</div></div>
  </div>`;
}

const hello = () => (who ? `Hoş geldiniz, ${esc(who)}!` : 'Hoş geldiniz!');
const safeNote = 'Burası bir <b>alıştırma bilgisayarı</b>. Rahat olun: hiçbir şey bozulmaz.';

// 1) Karolar: koyu mor zemin, dolgun renkli kareler
function homeKaro(W, D) {
  const dv = D.bitti ? `<div class="kr kr-dv"><span class="kr-ic">🎉</span><b>Bütün dersleri bitirdiniz!</b></div>`
    : `<a class="kr kr-dv" href="${D.href}"><small>${D.label}</small><span class="kr-ic">${D.icon}</span><b>${D.title}</b><span class="kr-sub">${D.sub}</span><span class="kr-go">${D.go} ›</span></a>`;
  return `<div class="karo"><h1>${hello()}</h1><p class="kr-not">${safeNote}</p>
    <div class="kr-grid">${dv}${W.map((x) => `<a class="kr${x.full ? ' full' : ''}" href="${x.href}" style="--h:${x.hue}" title="${esc(x.title)}">
      <span class="kr-ic">${x.icon}</span><small>${x.name}${x.full ? ' ✔' : ''}</small><b>${x.title}</b><span class="kr-say">${x.n} / ${x.total}</span><span class="kr-bar"><i style="width:${x.pct}%"></i></span></a>`).join('')}</div></div>`;
}

// 2) Masaüstü: haftalar klasör simgesi, altta görev çubuğu, sağ üstte yapışkan not
function homeMasa(W, D) {
  const now = new Date();
  const saat = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `<div class="masa"><div class="mz-icons">${W.map((x) => `<a class="mz-ic${x.full ? ' full' : ''}" href="${x.href}" title="${esc(x.title)}">
      <span class="mz-folder"><span class="mz-badge">${x.icon}</span>${x.full ? '<span class="mz-ok">✔</span>' : ''}</span><span class="mz-ad">${x.w.no ? `${x.w.no}. ` : ''}${x.title}</span></a>`).join('')}</div>
    <div class="mz-note"><b>${hello()}</b><p>Bir klasörü açın; içinde o haftanın dersleri var.</p><p>${safeNote}</p></div>
    <div class="mz-task"><span class="mz-start">⊞ Dersler</span>${D.bitti ? '<span class="mz-pin">🎉 Bütün dersler bitti</span>' : `<a class="mz-pin" href="${D.href}"><span class="mz-pin-ic">${D.icon}</span><span><small>${D.label}</small>${D.title}</span><b>${D.go} ›</b></a>`}
      <span class="sp"></span><span class="mz-tray">${D.nDone} / ${D.total} ders · ${saat}</span></div></div>`;
}

// 3) Yolculuk haritası: kıvrılan yol üstünde duraklar
function homeHarita(W, D) {
  const per = matchMedia('(max-width: 700px)').matches ? 2 : 4;
  const rowH = 210, colW = 1000 / per;
  const pts = W.map((x, k) => {
    const r = Math.floor(k / per), c = k % per;
    return { x: colW / 2 + colW * (r % 2 ? per - 1 - c : c), y: 120 + rowH * r, r };
  });
  let d = `M ${pts[0].x - colW / 2} ${pts[0].y} L ${pts[0].x} ${pts[0].y}`;
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1], b = pts[k];
    if (a.r === b.r) d += ` L ${b.x} ${b.y}`;
    else { const s = a.r % 2 ? -1 : 1; d += ` C ${a.x + s * 140} ${a.y}, ${b.x + s * 140} ${b.y}, ${b.x} ${b.y}`; }
  }
  const last = pts.at(-1);
  const H = last.y + 120;
  const cur = D.bitti ? -1 : D.wi;
  return `<div class="harita"><div class="yh-ust"><div><h1>${hello()}</h1><p>${safeNote} Yol 1. haftadan başlar; bir durağa tıklayın.</p></div>
    ${D.bitti ? '<div class="yh-dv"><b>🏁 Yolculuk bitti, tebrikler!</b></div>' : `<a class="yh-dv" href="${D.href}"><span class="yh-dv-ic">${D.icon}</span><span><small>${D.label}</small><b>${D.title}</b></span><span class="yh-go">${D.go} ›</span></a>`}</div>
    <div class="yh-map" style="height:${H}px"><svg viewBox="0 0 1000 ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="yh-yol" d="${d}"/><path class="yh-cizgi" d="${d}"/></svg>
    ${W.map((x, k) => `<a class="yh-d${x.full ? ' full' : ''}${k === cur ? ' cur' : ''}" href="${x.href}" style="left:${pts[k].x / 10}%;top:${pts[k].y}px;--h:${x.hue}" title="${esc(x.title)}">
      ${k === cur ? '<span class="yh-flag">Buradasınız</span>' : ''}<span class="yh-top">${x.full ? '✔' : x.icon}</span><span class="yh-lb"><small>${x.name}</small>${x.title}</span><span class="yh-say">${x.n} / ${x.total}</span></a>`).join('')}
    <span class="yh-bit" style="left:${last.x / 10}%;top:${last.y + 70}px">🏁</span></div></div>`;
}

// 4) Koyu modern: gece zemini, büyük "Devam et" ve yana kayan hafta afişleri
function homeKoyu(W, D) {
  return `<div class="koyu"><div class="ky-hero"><div><p class="ky-not">${safeNote}</p><h1>${hello()}</h1>
    ${D.bitti ? '<p class="ky-big">Bütün dersleri bitirdiniz 🎉</p>' : `<p class="ky-lb">${D.label}</p><p class="ky-big">${D.title}</p><p class="ky-sub">${D.sub}</p><a class="ky-go" href="${D.href}">${D.go} ›</a>`}</div>
    <div class="ky-ring" style="--p:${(D.nDone / D.total) * 100}"><b>${D.nDone}</b><span>/ ${D.total} ders</span></div></div>
    <h2 class="ky-h2">Haftalar <span>yana kaydırın ›</span></h2>
    <div class="ky-row">${W.map((x) => `<a class="ky-p${x.full ? ' full' : ''}" href="${x.href}" style="--h:${x.hue}" title="${esc(x.title)}">
      <span class="ky-ic">${x.icon}</span><small>${x.name}${x.full ? ' · ✔' : ''}</small><b>${x.title}</b><span class="ky-bar"><i style="width:${x.pct}%"></i></span><span class="ky-say">${x.n} / ${x.total} ders</span></a>`).join('')}</div></div>`;
}

const HOMES = { karo: homeKaro, masa: homeMasa, harita: homeHarita, koyu: homeKoyu };

function renderHome() {
  const [key, name] = DESIGNS[design];
  const home = $('#home');
  home.dataset.t = key;
  home.dataset.hafta = homeWeek != null ? '1' : '';
  if (homeWeek != null) home.innerHTML = key === 'masa' ? homeMasa(weekInfo(), devamInfo()) + weekPage(homeWeek) : weekPage(homeWeek);
  else home.innerHTML = HOMES[key](weekInfo(), devamInfo());
  $('#tasarim').innerHTML = `🎨 Tasarım ${design + 1} / ${DESIGNS.length}: <b>${name}</b> ›`;
  if (homeWeek != null) home.scrollTop = 0;
}

$('#tasarim').addEventListener('click', () => {
  design = (design + 1) % DESIGNS.length;
  lsSet('bd-tasarim', DESIGNS[design][0]);
  renderHome();
});

$('#home').addEventListener('click', (e) => {
  const r = e.target.closest('[data-restart]');
  if (!r) return;
  e.preventDefault();
  const id = r.dataset.restart;
  delete store.lessons[id];
  persist();
  if (lesson?.id === id) lesson = null;
  if (location.hash === '#ders/' + id) route(); else location.hash = '#ders/' + id;
});

function openLesson(l) {
  if (lesson === l) return;
  lesson = l;
  late = [];
  const stage = l.stage || 'notepad';
  document.body.dataset.view = 'lesson';
  document.body.dataset.stage = stage;
  setMini(false);
  // Telefonda bir kez: dersler bilgisayar için yapıldı
  if (matchMedia('(max-width: 640px)').matches && !sessionStorage.getItem('telNot')) {
    $('#telNot').hidden = false;
    $('#telNot button').onclick = () => { $('#telNot').hidden = true; sessionStorage.setItem('telNot', '1'); };
  }
  document.body.classList.toggle('with-kb', stage === 'notepad' || !!l.keyboard);
  $('#crumb').textContent = l.title;
  $('#dots').innerHTML = l.steps.map((s, i) => `<button type="button" data-i="${i}" title="${esc(s.title)}"></button>`).join('');
  const p = store.lessons[l.id] || {};
  np.active = stage === 'notepad';
  if (stage === 'notepad') {
    np.setState(p.np);
    $('#pano .ptext').textContent = np.clip;
    $('#pano').classList.toggle('empty', !np.clip);
  }
  if (stage === 'desktop') {
    // Masaüstü görünür olduktan sonra kurulmalı ki boyutlar doğru ölçülsün
    requestAnimationFrame(() => {
      if (lesson !== l) return;
      getDesk().reset(l.desktop || {});
      l.setup?.(ctxBase());
      startAt(p);
    });
  } else {
    l.setup?.(ctxBase());
    startAt(p);
  }
}

function startAt(p) {
  showStep(Math.min(p.step || 0, lesson.steps.length - 1), (p.step || 0) > 0);
}

// Adımların kullandığı ortak bağlam: ders boyunca aynı kalır (L: derse özel veriler)
let base = null;
function ctxBase() {
  if (!base || base.lesson !== lesson) {
    const id = lesson.id;
    // log: ders tekrarlansa da silinmeyen ölçüm geçmişi (ör. yazma hızı), öğrencinin profilinde saklanır
    base = { lesson, L: {}, np, kb, get d() { return desk; },
      get logs() { return store.logs?.[id] || []; },
      log: (entry) => { ((store.logs ||= {})[id] ||= []).push({ at: Date.now(), ...entry }); persist(); } };
  }
  return base;
}

// ---- Adımlar ----
// Öğrenci "Devam"a basmadan sonraki adımın işini yapmış olabilir (ör. tarayıcının izin sorusunu hemen cevaplamak).
// Bitmiş adımda, tamamlanmadan kısa süre sonra gelen olaylar saklanır ve yeni adım açılınca ona da gösterilir;
// böyle sonraki adım "yaptığım iş sayılmadı" diye takılıp kalmaz.
let doneAt = 0;
let late = [];
const LATE_MIN = 250, LATE_MAX = 120000;

function showStep(i, resumed = false) {
  clearTimeout(hintTimer);
  if (step && ctx) { try { step.leave?.(ctx); } catch (err) { console.error(err); } }
  const now = performance.now();
  const carry = lesson.stage === 'desktop' && !resumed && i === idx + 1 ? late.filter((e) => now - e.t < LATE_MAX) : [];
  late = [];
  idx = i;
  step = lesson.steps[i];
  done = false;
  stepStart = now;
  stepWarns = 0;
  ctx = Object.assign(Object.create(ctxBase()), {
    s: {},
    resumed,
    warn: (h) => { stepWarns++; msg('warn', h); },
    note: (h) => msg('note', h),
    complete: () => { if (!done) complete(); },
    emit: (type, data = {}) => onEvent({ type, ...data }),
  });
  const total = lesson.steps.length;
  $('#stepNo').textContent = `Adım ${i + 1} / ${total}`;
  $('#bar i').style.width = ((i + 1) / total * 100) + '%';
  const p = (store.lessons[lesson.id] ||= {});
  p.max = Math.max(p.max || 0, i);
  $('#dots').querySelectorAll('button').forEach((bt, j) => {
    bt.classList.toggle('cur', j === i);
    bt.classList.toggle('seen', j <= p.max);
  });

  $('#stepTitle').textContent = step.title;
  let body = typeof step.html === 'function' ? step.html(ctx) : step.html || '';
  if (step.target) body += `<div class="target">${esc(step.target)}</div>`;
  if (step.final) body += finalHtml();
  $('#stepBody').innerHTML = body;
  const parts = [];
  if (step.mouse) parts.push(`<span class="mouse">${step.mouse}</span>`);
  if (step.combo) parts.push(`<span class="keys">${step.combo.map((c) => `<kbd class="cap" data-code="${c}">${keyLabel(c)}</kbd>`).join('<b>+</b>')}</span>`);
  $('#combo').innerHTML = parts.join('');
  $('#combo').hidden = !parts.length;
  $('#hint').innerHTML = step.hint ? '<b>İpucu:</b> ' + step.hint : '';
  $('#hint').hidden = true;
  $('#hintBtn').hidden = !step.hint;
  msg('', '');
  kb.want([...(step.combo || []), ...(step.keys || [])]);
  touch.want(step.combo || [], step.keys || []);
  $('#combo .keys')?.addEventListener('click', () => touch.press(step.combo));

  const info = !step.on && !step.manual;
  $('#next').hidden = !info || !!step.final;
  $('#next').textContent = i === 0 ? 'Başlayalım' : 'Devam';
  $('#manual').hidden = !step.manual;
  $('#manual').textContent = step.manual || '';
  $('#prev').disabled = i === 0;
  $('#skip').hidden = info;
  document.body.classList.toggle('waiting', !info);
  if (info) { done = true; doneAt = now; }

  if (lesson.stage === 'scene') {
    const sc = $('#scene');
    sc.innerHTML = '';
    sc.className = '';
    try { (step.scene || lesson.scene)?.(sc, ctx); } catch (err) { console.error(err); }
  }
  try { step.setup?.(ctx); } catch (err) { console.error(err); }
  for (const e of carry) {
    if (done || !step.on) break;
    let ok = false;
    try { ok = step.on(e.ev, ctx); } catch (err) { console.error(err); }
    if (ok) complete();
  }
  if (step.final) finish();
  if (step.hint) hintTimer = setTimeout(() => { if (!done) $('#hint').hidden = false; }, HINT_DELAY);
  $('#guide').scrollTop = 0;
  saveProgress();
  if (!info && lesson.stage === 'notepad') np.focus();
  if (lesson.stage === 'desktop' && desk) setTimeout(() => desk.refocus(), 80);
  // Koşul zaten sağlanmışsa (ör. pencere zaten açık) adım hemen tamamlansın
  // Bu arada başka adıma geçildiyse (ör. hızlı çift tıklama) eski adımın koşuluna bakılmaz
  const s = step;
  if (s.check) setTimeout(() => { if (!done && s === step && s === lesson?.steps[idx] && s.check(ctx)) complete(); }, 60);
}

function complete() {
  done = true;
  doneAt = performance.now();
  clearTimeout(hintTimer);
  const p = store.lessons[lesson.id];
  (p.stats ||= {})[idx] = { t: Math.round((performance.now() - stepStart) / 1000), w: stepWarns };
  const d = typeof step.done === 'function' ? step.done(ctx) : step.done;
  msg('ok', '<b>✔ Aferin!</b> ' + (d || ''));
  $('#next').hidden = false;
  $('#skip').hidden = true;
  $('#manual').hidden = true;
  document.body.classList.remove('waiting');
  kb.want([]);
  touch.want();
  chime();
  saveSoon();
  reveal($('#next'));
}

// Küçük ekranlarda mesaj ve Devam düğmesi rehber panelinin altında kalmasın
const reveal = (el) => requestAnimationFrame(() => el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));

function msg(kind, html) {
  const m = $('#msg');
  m.className = kind;
  m.innerHTML = html;
  m.hidden = !html;
  if (html && kind !== 'ok') { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); reveal(m); }
}

const fmtTime = (t) => (t >= 60 ? `${Math.floor(t / 60)} dk ${t % 60} sn` : `${t} sn`);

function finalHtml() {
  const stats = store.lessons[lesson.id]?.stats || {};
  const timed = Object.entries(stats).map(([i, s]) => ({ i: +i, ...s })).filter((s) => lesson.steps[s.i]?.on || lesson.steps[s.i]?.manual);
  const slow = [...timed].sort((a, b) => b.t - a.t);
  let report = '';
  if (lesson.parkur && timed.length) {
    const total = timed.reduce((a, s) => a + s.t, 0);
    report = `<h3 class="rep-h">Parkur süresi: ${fmtTime(total)}</h3><table class="sum rep">${timed.sort((a, b) => a.i - b.i).map((s) => `<tr class="${s.t === slow[0].t ? 'slow' : ''}"><th>${esc(lesson.steps[s.i].title)}</th><td>${fmtTime(s.t)}${s.w ? ` · ${s.w} uyarı` : ''}</td></tr>`).join('')}</table>
      <p class="mut">Kırmızı satır, en çok zaman aldığınız görevdir. Takıldığınız yeri gösterir.</p>`;
  } else if (lesson.test) {
    const sc = testScore(lesson);
    report = `<div class="score"><b>${sc.right} / ${sc.total}</b><span>soruyu ilk denemede doğru bildiniz</span></div>
      ${lesson.sertifika ? (sc.right / sc.total >= 0.7 ? '<div class="cert-ok">🎓 Kursu başarıyla tamamladınız! Belgenizi yazdırabilirsiniz.</div><p><button type="button" class="btn primary" data-act="cert">🎓 Kurs bitirme belgesini yazdır</button></p>' : '<p class="mut">Belge için soruların en az %70\'ini ilk denemede bilmek gerekir. Aşağıdaki konulara bakıp sınavı yeniden çözebilirsiniz.</p>') : ''}
      ${sc.missed.length ? `<details class="rep-d" open><summary>Tekrar bakılacak konular</summary><ul>${sc.missed.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ul></details>` : '<p>Hepsini ilk denemede bildiniz! 🌟</p>'}`;
  } else if (slow.length >= 3) {
    report = `<details class="rep-d"><summary>En çok zaman aldığınız adımlar</summary><table class="sum rep">${slow.slice(0, 3).map((s) => `<tr><th>${esc(lesson.steps[s.i].title)}</th><td>${fmtTime(s.t)}${s.w ? ` · ${s.w} uyarı` : ''}</td></tr>`).join('')}</table></details>`;
  }
  // Yalnızca salt tuş birleşimleri (Ctrl + C, Alt + Shift, Shift + End / Home) tuş kutusuna çevrilir; "Ctrl + C → Resimler → Ctrl + V" gibi cümleler düz kalır
  const KEYTOK = /^(Ctrl|Shift|Alt|AltGr|Enter|Tab|Delete|Esc|Space|Boşluk|Backspace|Insert|Home|End|Caps Lock|⌫ Backspace|⌫ Geri|⌫|⊞|F\d{1,2}|[A-Z0-9*−-]|[←→↑↓])$/;
  const keyParts = (k) => { const p = k.split(/( \+ | \/ )/); return p.every((x, i) => i % 2 || KEYTOK.test(x)) ? p : null; };
  const sumRow = ([k, v]) => { const p = keyParts(k); return `<tr><th${p ? '' : ' class="txt"'}>${p ? p.map((x, i) => (i % 2 ? x : `<kbd>${x}</kbd>`)).join('') : k}</th><td>${v}</td></tr>`; };
  const sum = lesson.summary ? `<table class="sum">${lesson.summary.map(sumRow).join('')}</table>` : '';
  const nx = nextLesson();
  return `${sum}${report}
    <div class="fbtns">
      ${nx ? `<a class="btn primary" href="#ders/${nx.id}">Sonraki ders: ${esc(nx.title)}</a>` : ''}
      ${lesson.summary ? '<button type="button" class="btn" data-act="print">Özet kartını yazdır</button>' : ''}
      ${lesson.stage === 'notepad' ? '<button type="button" class="btn" data-act="download">⬇ Yazımı bilgisayara indir</button>' : ''}
      <button type="button" class="btn" data-act="restart">Dersi baştan yap</button>
      <a class="btn" href="#hafta/${weekOf(lesson)}">Ders listesi</a>
    </div>
    ${lesson.stage === 'scene' ? '' : '<p class="mut">Yandaki alanda dilediğiniz kadar serbestçe alıştırma yapabilirsiniz.</p>'}`;
}

// Testlerde puan: ilk denemede (uyarı almadan) doğru bilinen sorular. Atlanan soru yanlış sayılır.
function testScore(l, st = store) {
  const stats = st.lessons?.[l.id]?.stats || {};
  const qs = l.steps.filter((s) => s.quiz);
  const right = qs.filter((s) => { const st = stats[l.steps.indexOf(s)]; return st && !st.w; });
  return { total: qs.length, right: right.length, missed: qs.filter((s) => !right.includes(s)) };
}

function nextLesson() {
  const list = LESSONS.filter((l) => !l.link);
  return list[list.indexOf(lesson) + 1];
}

function finish() {
  store.lessons[lesson.id].done = true;
  chime();
  persist();
}

$('#stepBody').addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'print') printCard();
  if (act === 'cert') printCert();
  if (act === 'download') download();
  if (act === 'restart') restart();
});

function restart() {
  const l = lesson;
  store.lessons[l.id] = {};
  persist();
  if (l.stage === 'notepad') {
    np.setState({});
    $('#pano .ptext').textContent = '';
    $('#pano').classList.add('empty');
  }
  lesson = null;
  step = null;
  openLesson(l);
}

function printCard() {
  $('#printCard').innerHTML = `<h1>${emojiIcon(lesson.icon)} ${lesson.title}</h1><p>Özet kartı: bilgisayarın yanında dursun.</p>
    <table>${lesson.summary.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>
    <p class="pfoot">Ctrl ile başlayan kısayollarda: önce Ctrl'yi basılı tutun, sonra harfe bir kez basın, sonra ikisini bırakın.</p>`;
  print();
}

// Kurs bitirme sınavında %70 ve üstü: adı, tarihi ve puanı yazan basit bir belge
function printCert() {
  const sc = testScore(lesson);
  const d = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#printCard').innerHTML = `<div class="cert"><div class="cert-ic">🎓</div><h1>Kurs Bitirme Belgesi</h1><p class="cert-name">${esc(who || 'Kursiyer')}</p>
    <p>15 haftalık <b>Temel Bilgisayar Kullanımı</b> kursunu tamamlamış ve kurs bitirme sınavında <b>${sc.right} / ${sc.total}</b> soruyu ilk denemede doğru cevaplamıştır.</p>
    <p class="cert-date">${d}</p><div class="cert-sign"><span>Eğitmen</span><span>İmza</span></div></div>`;
  print();
}

function download() {
  const text = np.value.replace(/\r?\n/g, '\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' }));
  a.download = np.fileName || 'yazım.txt';
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

// ---- Sahnelerden gelen olaylar ----
function onEvent(ev) {
  if (!lesson || !step) return;
  if (lesson.stage === 'notepad') {
    updatePano(ev);
    if (['input', 'save', 'copy', 'cut', 'open', 'new'].includes(ev.type)) saveSoon();
  }
  if (!done && step.on) {
    let ok = false;
    try { ok = step.on(ev, ctx); } catch (err) { console.error(err); }
    if (ok) { complete(); return; }
  } else if (done && lesson.stage === 'desktop' && performance.now() - doneAt > LATE_MIN) {
    if (late.length >= 40) late.shift();
    late.push({ ev, t: performance.now() });
  }
  general(ev);
}

// Her adımda geçerli olan, panik önleyici uyarılar
function general(ev) {
  if (ev.type === 'input' && lesson.stage === 'notepad') {
    const lost = ev.prev.length - ev.value.length;
    if (lost > 5 && ev.value.length < ev.prev.length / 2 && !['deleteByCut', 'historyUndo'].includes(ev.inputType)) {
      msg('warn', `😮 Yazınızın büyük bölümü silindi. Endişelenmeyin: ${K('Ctrl', 'Z')} ile geri getirebilirsiniz.`);
      return;
    }
    // Ctrl'yi basılı tutmayı unutup yalnızca harfe basmak çok yapılan bir hata
    const letter = step.combo?.includes('Ctrl') && step.combo.find((c) => c.startsWith('Key'))?.slice(3).toLocaleLowerCase('tr');
    if (!done && letter && ev.inputType === 'insertText' && ev.data?.toLocaleLowerCase('tr') === letter) {
      stepWarns++;
      msg('warn', `Galiba ${K('Ctrl')} tuşunu basılı tutmayı unuttunuz ve “${esc(ev.data)}” harfi yazıldı. ${K('Ctrl', 'Z')} ile geri alıp yeniden deneyin: önce Ctrl'yi basılı tutun, sonra harfe basın.`);
      return;
    }
  }
  if (ev.type === 'undo' && !done && $('#msg').classList.contains('warn')) msg('note', 'Geri alındı. Şimdi yeniden deneyebilirsiniz.');
  if (ev.type === 'nothing') {
    const t = {
      copy: `Önce bir yazı seçmelisiniz: çift tıklayın ya da ${K('Ctrl', 'A')} ile hepsini seçin.`,
      cut: 'Önce kesilecek yazıyı seçmelisiniz: kelimenin üzerine çift tıklayın.',
      paste: 'Pano boş: önce bir şey kopyalayın.',
      undo: 'Geri alınacak bir şey yok.',
      redo: `Geri getirilecek bir şey yok. ${K('Ctrl', 'Y')}, ancak ${K('Ctrl', 'Z')} ile bir şeyi geri aldıktan sonra işe yarar.`,
    }[ev.what];
    if (t) msg('warn', t);
  }
  if (ev.type === 'save' && ev.quick && !done) msg('note', `Kaydedildi (${esc(ev.name)}).`);
}

function updatePano(ev) {
  const pano = $('#pano');
  let label = '';
  if (ev.type === 'copy' && ev.text) label = 'Kopyalandı';
  if (ev.type === 'cut' && ev.text) label = 'Kesildi';
  if (ev.type === 'input' && ev.inputType === 'insertFromPaste') label = 'Yapıştırıldı';
  if (!label) return;
  if (ev.type !== 'input') pano.querySelector('.ptext').textContent = ev.text;
  pano.classList.remove('empty');
  pano.querySelector('.pflash').textContent = label;
  pano.classList.remove('flash');
  void pano.offsetWidth;
  pano.classList.add('flash');
}

function saveProgress() {
  if (!lesson) return;
  const p = (store.lessons[lesson.id] ||= {});
  p.step = idx;
  if (lesson.stage === 'notepad') p.np = np.getState();
  persist();
}

// ---- Düğmeler ----
$('#next').onclick = () => { if (idx < lesson.steps.length - 1) showStep(idx + 1); };
$('#prev').onclick = () => { if (idx > 0) showStep(idx - 1); };
$('#skip').onclick = () => showStep(Math.min(idx + 1, lesson.steps.length - 1));
$('#manual').onclick = () => { if (!done) complete(); };
$('#hintBtn').onclick = () => { $('#hint').hidden = !$('#hint').hidden; };
$('#dots').addEventListener('click', (e) => {
  const b = e.target.closest('[data-i]');
  if (b) showStep(+b.dataset.i);
});

function applyFont() {
  document.documentElement.style.setProperty('--fs', store.fs + 'px');
  $('#soundBtn').textContent = store.sound ? 'Ses açık' : 'Ses kapalı';
}
$('#fontUp').onclick = () => { store.fs = Math.min(30, store.fs + 2); applyFont(); persist(); desk?.renderIcons(); };
$('#fontDown').onclick = () => { store.fs = Math.max(14, store.fs - 2); applyFont(); persist(); desk?.renderIcons(); };
$('#soundBtn').onclick = () => { store.sound = !store.sound; applyFont(); persist(); };

// Not Defteri dersinde odak pencerede değilken basılan kısayollar sayfanın kendisini etkilemesin
document.addEventListener('keydown', (e) => {
  if (!lesson || lesson.stage !== 'notepad' || !(e.ctrlKey || e.metaKey) || npDialogs.busy) return;
  if (document.activeElement === np.ta || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  if (!['KeyA', 'KeyC', 'KeyV', 'KeyX', 'KeyZ', 'KeyY'].includes(e.code)) return;
  e.preventDefault();
  np.focus();
  if (e.code === 'KeyA') { np.ta.select(); np.checkSel(); return; }
  msg('warn', 'Önce Not Defteri penceresinin içine (beyaz alana) tıklayın, sonra tekrar deneyin.');
});
// Masaüstü derslerinde Ctrl+S/O/P gibi kısayollar tarayıcının kendi pencerelerini açmasın
document.addEventListener('keydown', (e) => {
  if (lesson?.stage === 'desktop' && (e.ctrlKey || e.metaKey) && ['KeyS', 'KeyO', 'KeyP', 'KeyF', 'KeyD', 'KeyH', 'KeyJ', 'KeyK'].includes(e.code)) e.preventDefault();
  if (lesson?.stage === 'desktop' && e.key === 'F7') e.preventDefault(); // tarayıcının “imleçle gezinme” sorusu çıkmasın
  // F5 sayfayı yenilemesin; sunu açıksa slayt gösterisini başlatsın (odak sunudaysa sunu bunu zaten yapmıştır)
  if (lesson?.stage === 'desktop' && e.key === 'F5' && !e.ctrlKey) { if (!e.defaultPrevented) desk?.find('slides')?.api.show?.(); e.preventDefault(); }
});

// ---- Klavye uyarıları: yanlış klavye dili ve açık kalan Caps Lock ----
// Türkçe Q'da bu fiziksel tuşlar Türkçe harf yazar; İngilizce düzende işaret yazarlar
const TR_KEYS = { Semicolon: 'ş', Quote: 'i', BracketLeft: 'ğ', BracketRight: 'ü', Comma: 'ö', Period: 'ç' };
const LAYOUT_MSG = {
  eng: `⌨ <b>Klavye dili İngilizce olmuş:</b> Türkçe harfler (ş, ğ, ü, ö, ç, ı) yazılmıyor. Ekranın sağ altındaki <b>ENG</b> yazısına tıklayıp <b>TUR</b> seçin. Kısayolu: ${K('⊞ Windows', 'Boşluk')}.`,
  f: '⌨ <b>Bilgisayarda Türkçe F klavye seçili:</b> Q tuşu “f” yazıyor. Dersler Türkçe Q klavyeye göre hazırlandı. Sağ alttaki dil yazısına (TUR) tıklayıp <b>Türkçe Q</b>\'yu seçin.',
};
let layout = '';
function setLayout(kind) {
  layout = kind;
  const el = $('#layoutAlert');
  if (kind) el.innerHTML = LAYOUT_MSG[kind];
  el.hidden = !kind;
}
const setCaps = (on) => { $('#capsAlert').hidden = !on; };
addEventListener('keydown', (e) => {
  if (!lesson) return;
  if (e.getModifierState) setCaps(e.getModifierState('CapsLock'));
  if (e.ctrlKey || e.altKey || e.metaKey || e.key.length !== 1) return;
  const k = e.key.toLocaleLowerCase('tr');
  // Q tuşu İngilizce düzende de q yazar; yalnızca F klavye uyarısını kaldırır
  if (e.code === 'KeyQ') { if (k === 'f') setLayout('f'); else if (layout === 'f') setLayout(''); }
  else if (TR_KEYS[e.code]) setLayout(k === TR_KEYS[e.code] ? '' : /\p{L}/u.test(k) ? 'f' : 'eng');
}, true);
// Caps Lock tuşu bırakıldığında ve fareyle tıklayınca da durum güncellensin (sayfa açılmadan önce açık kalmış olabilir)
addEventListener('keyup', (e) => { if (lesson && e.code === 'CapsLock' && e.getModifierState) setCaps(e.getModifierState('CapsLock')); }, true);
addEventListener('mousedown', (e) => { if (lesson && e.getModifierState) setCaps(e.getModifierState('CapsLock')); }, true);

// ---- Sekme yanlışlıkla kapanmasın (Ctrl + W, Alt + F4): tarayıcı önce sorar ----
let leaving = false;
addEventListener('beforeunload', (e) => {
  if (!lesson || leaving) return;
  saveProgress();
  e.preventDefault();
  e.returnValue = '';
});

// ---- Öğrenci seçimi ----
const pick = $('#pick');
$('#who').textContent = who ? who : 'Öğrenci seç';
$('#who').onclick = () => openPicker();

function choose(name, dest) {
  saveProgress();
  lsSet(PROF_KEY, name);
  lsSet(SHARED_KEY, name);
  const sorted = (l) => [...l, name].sort((a, b) => a.localeCompare(b, 'tr'));
  if (name && !profiles().includes(name)) lsSet(LIST_KEY, sorted(profiles()));
  // Robo'nun listesine de eklenir; orada seçme penceresi açılmaz
  const rl = lsGet(ROBO_LIST_KEY, []);
  if (name && !rl.includes(name)) lsSet(ROBO_LIST_KEY, sorted(rl));
  try { sessionStorage.setItem(ASKED_KEY, '1'); sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* yoksay */ }
  leaving = true;
  if (dest) { location.href = dest; return; }
  // Açılışta sorulduysa (ör. 3B dersten gelen test bağlantısı) istenen ders açık kalsın
  if (!pickFirst) location.hash = '';
  location.reload();
}

let pickFirst = false;
function openPicker(first = false) {
  pickFirst = first;
  pick.hidden = false;
  pick.innerHTML = `<div class="pickbox" role="dialog" aria-label="Öğrenci seçimi">
  <h2>${first ? 'Merhaba! Adını yaz ya da listeden seç' : 'Bu bilgisayarı kim kullanıyor?'}</h2>
  <div class="plist">${profiles().map((n) => `<span class="pone"><button type="button" class="pname${n === who ? ' cur' : ''}" data-n="${esc(n)}">${esc(n)}</button><button type="button" class="pdel" data-n="${esc(n)}" title="${esc(n)} kaydını sil">🗑</button></span>`).join('') || '<p class="mut">Henüz kayıtlı kimse yok. Adınızı yazıp ekleyin.</p>'}</div>
  <form class="padd"><input type="text" maxlength="30" placeholder="Adınız soyadınız" aria-label="Adınız"><button type="submit" class="primary">${first ? '💻 Başla' : '➕ Ekle ve başla'}</button></form>
  ${first ? '<h3 class="pwhere">Nereye gireceksin?</h3><div class="pdest"><button type="button" class="pgo" data-d="">💻<b>Bilgisayar Dersleri</b><small>Yetişkinler için</small></button><button type="button" class="pgo" data-d="robot.html">🤖<b>Robo ile Kodlama</b><small>8–12 yaş</small></button></div>' : ''}
  <div class="pfoot"><button type="button" class="link pguest">Misafir olarak devam et</button>${first ? '' : '<button type="button" class="link pclose">Kapat</button>'}</div>
  <p class="mut">Her öğrencinin ilerlemesi ve test puanları bu bilgisayarda ayrı saklanır. Listede adınız varsa üzerine tıklayın.</p>
</div>`;
  const inp = pick.querySelector('input');
  const nameOf = () => inp.value.trim().replace(/\s+/g, ' ').replace(/[<>":]/g, '');
  if (first && who) inp.value = who;
  pick.onclick = (e) => {
    const t = e.target;
    if ((t === pick && !first) || t.classList.contains('pclose')) { pick.hidden = true; return; }
    const go = t.closest('.pgo');
    if (go) {
      const n = nameOf();
      if (!n) { inp.focus(); return; }
      choose(n, go.dataset.d);
      return;
    }
    if (t.classList.contains('pname')) {
      if (first) { inp.value = t.dataset.n; pick.querySelectorAll('.pname').forEach((b) => b.classList.toggle('cur', b === t)); } else choose(t.dataset.n);
    }
    if (t.classList.contains('pguest')) choose('');
    if (t.classList.contains('pdel') && confirm(`“${t.dataset.n}” adlı öğrencinin bütün ilerlemesi ve puanları silinsin mi?`)) {
      lsSet(LIST_KEY, profiles().filter((n) => n !== t.dataset.n));
      try { localStorage.removeItem(storeKey(t.dataset.n)); } catch { /* yoksay */ }
      if (t.dataset.n === who) choose(''); else openPicker(first);
    }
  };
  pick.querySelector('.padd').onsubmit = (e) => {
    e.preventDefault();
    const n = nameOf();
    if (n) choose(n);
  };
  pick.querySelector('input').focus();
}

addEventListener('hashchange', route);
addEventListener('pagehide', saveProgress);
applyFont();
route();
// Bu oturumda henüz kimse seçilmediyse sorulur
let asked = false;
try { asked = !!sessionStorage.getItem(ASKED_KEY); } catch { asked = true; }
if (!asked) openPicker(true);

// Testler ve eğitmen için: konsoldan erişim
window.DERS = { get desk() { return desk; }, np, get lesson() { return lesson; }, get idx() { return idx; }, get done() { return done; }, showStep: (i) => showStep(i) };

startIcons();
