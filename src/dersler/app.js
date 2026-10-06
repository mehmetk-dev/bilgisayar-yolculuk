// Dersler sayfası: ders listesi, adım adım yönlendirme, ilerlemenin ve adım sürelerinin kaydı.
// Üç tür sahne vardır: 'notepad' (tek Not Defteri + klavye), 'desktop' (benzetim Windows), 'scene' (etkinlik).
import { LESSONS, WEEKS } from './lessons/index.js';
import { Keyboard, keyLabel } from './keyboard.js';
import { Notepad } from './notepad.js';
import { Dialogs, esc } from './dialog.js';
import { Desktop } from './desktop.js';

const $ = (s) => document.querySelector(s);
const K = (...names) => names.map((n) => `<kbd>${n}</kbd>`).join(' + ');
const HINT_DELAY = 40000;

// ---- Kalıcı ayarlar ve ilerleme (yalnızca bu tarayıcıda) ----
const STORE_KEY = 'bilgisayar-dersleri.v2';
let store = { fs: 20, sound: true, lessons: {} };
try { store = { ...store, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; } catch { /* gizli pencere vb. */ }
const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* yoksay */ } };
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
  if (l) openLesson(l);
  else showHome();
}

function showHome() {
  if (lesson) saveProgress();
  lesson = null;
  np.active = false;
  document.body.dataset.view = 'home';
  $('#crumb').textContent = '';
  clearTimeout(hintTimer);
  const card = (l) => {
    if (l.link) {
      return `<article class="lcard link"><div class="licon">${l.icon}</div><div class="lmain"><h3>${l.title}</h3><p>${l.desc}</p>
        <div class="lfoot"><span class="sp"></span><a class="btn primary" href="${l.link}">Aç ▶</a></div></div></article>`;
    }
    const p = store.lessons[l.id];
    const total = l.steps.length;
    let status = `<span class="tag">⏱ ~${l.minutes} dk · ${total} adım</span>`;
    let btn = `<a class="btn primary" href="#ders/${l.id}">Başla ▶</a>`;
    if (p?.done) {
      status = '<span class="tag ok">✔ Tamamlandı</span>';
      btn = `<a class="btn" href="#ders/${l.id}" data-restart="${l.id}">↻ Tekrar yap</a>`;
    } else if (p?.step > 0) {
      status = `<span class="tag">Adım ${p.step + 1} / ${total}</span>`;
      btn = `<button type="button" class="link" data-restart="${l.id}">Baştan</button><a class="btn primary" href="#ders/${l.id}">Devam ▶</a>`;
    }
    return `<article class="lcard${p?.done ? ' done' : ''}"><div class="licon">${l.icon}</div><div class="lmain">
      <h3>${l.title}</h3><p>${l.desc}</p>
      <div class="lfoot">${status}<span class="sp"></span>${btn}</div></div></article>`;
  };
  $('#cards').innerHTML = WEEKS.map((w) => `<section class="week"><h2><span>${w.no ? `${w.no}. hafta` : 'Ek'}</span>${w.title}</h2>
    <div class="wcards">${w.lessons.map(card).join('')}</div></section>`).join('');
}

$('#cards').addEventListener('click', (e) => {
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
  const stage = l.stage || 'notepad';
  document.body.dataset.view = 'lesson';
  document.body.dataset.stage = stage;
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
  if (!base || base.lesson !== lesson) base = { lesson, L: {}, np, kb, get d() { return desk; } };
  return base;
}

// ---- Adımlar ----
function showStep(i, resumed = false) {
  clearTimeout(hintTimer);
  if (step && ctx) { try { step.leave?.(ctx); } catch (err) { console.error(err); } }
  idx = i;
  step = lesson.steps[i];
  done = false;
  stepStart = performance.now();
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
  $('#hint').innerHTML = step.hint ? '💡 ' + step.hint : '';
  $('#hint').hidden = true;
  $('#hintBtn').hidden = !step.hint;
  msg('', '');
  kb.want([...(step.combo || []), ...(step.keys || [])]);

  const info = !step.on && !step.manual;
  $('#next').hidden = !info || !!step.final;
  $('#next').textContent = i === 0 ? 'Başlayalım ▶' : 'Devam ▶';
  $('#manual').hidden = !step.manual;
  $('#manual').textContent = step.manual || '';
  $('#prev').disabled = i === 0;
  $('#skip').hidden = info;
  document.body.classList.toggle('waiting', !info);
  if (info) done = true;

  if (lesson.stage === 'scene') {
    const sc = $('#scene');
    sc.innerHTML = '';
    sc.className = '';
    try { (step.scene || lesson.scene)?.(sc, ctx); } catch (err) { console.error(err); }
  }
  try { step.setup?.(ctx); } catch (err) { console.error(err); }
  if (step.final) finish();
  if (step.hint) hintTimer = setTimeout(() => { if (!done) $('#hint').hidden = false; }, HINT_DELAY);
  $('#guide').scrollTop = 0;
  saveProgress();
  if (!info && lesson.stage === 'notepad') np.focus();
  if (lesson.stage === 'desktop' && desk) setTimeout(() => desk.refocus(), 80);
  // Koşul zaten sağlanmışsa (ör. pencere zaten açık) adım hemen tamamlansın
  if (step.check) setTimeout(() => { if (!done && step === lesson?.steps[idx] && step.check(ctx)) complete(); }, 60);
}

function complete() {
  done = true;
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
    report = `<h3 class="rep-h">⏱ Parkur süresi: ${fmtTime(total)}</h3><table class="sum rep">${timed.sort((a, b) => a.i - b.i).map((s) => `<tr class="${s.t === slow[0].t ? 'slow' : ''}"><th>${esc(lesson.steps[s.i].title)}</th><td>${fmtTime(s.t)}${s.w ? ` · ${s.w} uyarı` : ''}</td></tr>`).join('')}</table>
      <p class="mut">Kırmızı satır, en uzun süren görevdir. Öğrencinin takıldığı yeri gösterir.</p>`;
  } else if (slow.length >= 3) {
    report = `<details class="rep-d"><summary>⏱ En uzun süren adımlar (eğitmen için)</summary><table class="sum rep">${slow.slice(0, 3).map((s) => `<tr><th>${esc(lesson.steps[s.i].title)}</th><td>${fmtTime(s.t)}${s.w ? ` · ${s.w} uyarı` : ''}</td></tr>`).join('')}</table></details>`;
  }
  const keyish = (k) => /^(Ctrl|Shift|Alt|AltGr|Enter|Tab|Delete|Esc|F\d|⊞|⌫|Caps)/.test(k);
  const sum = lesson.summary ? `<table class="sum">${lesson.summary.map(([k, v]) => `<tr><th>${keyish(k) ? k.split(' + ').map((x) => `<kbd>${x}</kbd>`).join(' + ') : k}</th><td>${v}</td></tr>`).join('')}</table>` : '';
  const nx = nextLesson();
  return `${sum}${report}
    <div class="fbtns">
      ${nx ? `<a class="btn primary" href="#ders/${nx.id}">Sonraki ders: ${esc(nx.title)} ▶</a>` : ''}
      ${lesson.summary ? '<button type="button" class="btn" data-act="print">🖨 Özet kartını yazdır</button>' : ''}
      ${lesson.stage === 'notepad' ? '<button type="button" class="btn" data-act="download">⬇ Yazımı bilgisayara indir</button>' : ''}
      <button type="button" class="btn" data-act="restart">↻ Dersi baştan yap</button>
      <a class="btn" href="#">🏠 Ders listesi</a>
    </div>
    ${lesson.stage === 'scene' ? '' : '<p class="mut">Yandaki alanda dilediğiniz kadar serbestçe alıştırma yapabilirsiniz.</p>'}`;
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
  $('#printCard').innerHTML = `<h1>${lesson.icon} ${lesson.title}</h1><p>Özet kartı: bilgisayarın yanında dursun.</p>
    <table>${lesson.summary.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>
    <p class="pfoot">Ctrl ile başlayan kısayollarda: önce Ctrl'yi basılı tutun, sonra harfe bir kez basın, sonra ikisini bırakın.</p>`;
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
  $('#soundBtn').textContent = store.sound ? '🔔 Ses açık' : '🔕 Ses kapalı';
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
  if (lesson?.stage === 'desktop' && (e.ctrlKey || e.metaKey) && ['KeyS', 'KeyO', 'KeyP', 'KeyF'].includes(e.code)) e.preventDefault();
});

addEventListener('hashchange', route);
addEventListener('pagehide', saveProgress);
applyFont();
route();

// Testler ve eğitmen için: konsoldan erişim
window.DERS = { get desk() { return desk; }, np, get lesson() { return lesson; }, get idx() { return idx; }, get done() { return done; }, showStep: (i) => showStep(i) };
