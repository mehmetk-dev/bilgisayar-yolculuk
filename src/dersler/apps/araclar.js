// Windows araçları: Saat (alarm, zamanlayıcı), Ekran Klavyesi, Büyüteç.
// Alarmlar ve zamanlayıcı pencere kapalıyken de çalışır: masaüstü her saniye desk.clock'a bakar (Desktop.clockTick).
import { esc } from './util.js';

const pad = (n) => String(n).padStart(2, '0');
const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };

// ------------------------------------------------------------------ Saat: alarm ve zamanlayıcı
export function saat({ desk, body, args, emit }) {
  body.classList.add('tk');
  const C = desk.clock;
  let tab = args.tab || 'alarm';
  body.innerHTML = `<nav class="tk-nav">${[['alarm', '⏰', 'Alarm'], ['timer', '⏱', 'Zamanlayıcı']].map(([k, i, l]) => `<button type="button" data-tab="${k}"><span>${i}</span>${l}</button>`).join('')}</nav><div class="tk-page"></div>`;
  const pg = body.querySelector('.tk-page');

  function render() {
    body.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    if (tab === 'alarm') renderAlarm();
    else renderTimer();
  }

  function renderAlarm() {
    pg.innerHTML = `<div class="tk-alarms"><p class="tk-note">Alarm, bilgisayar açıkken ve ses açıkken çalar. Program kapalı olsa da çalışır.</p>
      ${C.alarms.length ? C.alarms.map((a) => `<div class="tk-alarm ${a.on ? '' : 'off'}"><b>${a.time}</b><span>${esc(a.label || 'Alarm')}<small>${a.once ? 'Bir kez' : 'Her gün'}</small></span><label class="bi-tog"><input type="checkbox" data-alon="${a.id}" ${a.on ? 'checked' : ''}><i></i></label><button type="button" data-aldel="${a.id}" title="Sil">✕</button></div>`).join('') : '<p class="tk-none">Henüz alarm yok.</p>'}
      <div class="tk-form tk-aform"><b>＋ Yeni alarm</b><div class="tk-row"><input type="time" class="tk-atime" value="07:30"><input class="tk-alabel" placeholder="Adı (ör. İlaç saati)"></div><button type="button" class="primary" data-act="addAl">Kaydet</button></div></div>`;
  }

  function renderTimer() {
    const t = C.timer;
    const left = t?.end ? t.end - Date.now() : t?.left ?? 0;
    const run = !!t?.end;
    pg.innerHTML = `<div class="tk-timer"><div class="tk-big ${t?.done ? 'done' : ''}">${t ? mmss(left) : '00:00'}</div>
      ${t ? `<p class="tk-tl">${esc(t.label || '')}${t.done ? ' · Süre doldu!' : run ? ' · çalışıyor' : ' · duraklatıldı'}</p>` : ''}
      <div class="tk-row">${run ? '<button type="button" data-act="pause">⏸ Duraklat</button>' : t && !t.done && left > 0 ? '<button type="button" class="primary" data-act="resume">▶ Devam</button>' : ''}${t ? '<button type="button" data-act="reset">↺ Sıfırla</button>' : ''}</div>
      <div class="tk-form"><b>Yeni zamanlayıcı</b><div class="tk-presets">${[[0, 10, '10 sn'], [1, 0, '1 dk'], [3, 0, '3 dk'], [5, 0, '5 dk'], [10, 0, '10 dk']].map(([m, s, l]) => `<button type="button" data-preset="${m}:${s}">${l}</button>`).join('')}</div>
        <div class="tk-row"><label>Dakika <input type="number" class="tk-m" min="0" max="99" value="${C.lastM ?? 5}"></label><label>Saniye <input type="number" class="tk-s" min="0" max="59" value="${C.lastS ?? 0}"></label></div>
        <input class="tk-tlabel" placeholder="Adı (ör. Çay demlensin)" value="${esc(C.lastLabel || '')}"><button type="button" class="primary" data-act="start">▶ Başlat</button></div></div>`;
  }

  function startTimer(m, s) {
    const label = pg.querySelector('.tk-tlabel')?.value.trim() || 'Zamanlayıcı';
    const ms = (m * 60 + s) * 1000;
    if (ms <= 0) return;
    Object.assign(C, { lastM: m, lastS: s, lastLabel: label === 'Zamanlayıcı' ? '' : label });
    C.timer = { end: Date.now() + ms, total: ms, label };
    render();
    emit('timer-start', { seconds: m * 60 + s, label });
  }

  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.tab) { tab = d.tab; render(); emit('saat-tab', { tab }); return; }
    if (d.aldel) { C.alarms = C.alarms.filter((x) => x.id !== d.aldel); render(); emit('alarm-del'); return; }
    if (d.preset) { const [m, s] = d.preset.split(':').map(Number); startTimer(m, s); return; }
    if (d.act === 'addAl') {
      const time = pg.querySelector('.tk-atime').value;
      if (!time) return;
      const a = { id: 'a' + Date.now(), time, label: pg.querySelector('.tk-alabel').value.trim(), on: true };
      C.alarms.push(a);
      render();
      desk.toast('Alarm kuruldu', `${a.time} · ${esc(a.label || 'Alarm')}`, '⏰', 3000);
      emit('alarm-add', { time: a.time, label: a.label });
      return;
    }
    if (d.act === 'start') startTimer(+pg.querySelector('.tk-m').value || 0, +pg.querySelector('.tk-s').value || 0);
    if (d.act === 'pause' && C.timer?.end) { C.timer = { ...C.timer, left: C.timer.end - Date.now(), end: null }; render(); emit('timer-pause'); }
    if (d.act === 'resume' && C.timer) { C.timer = { ...C.timer, end: Date.now() + C.timer.left }; render(); emit('timer-resume'); }
    if (d.act === 'reset') { C.timer = null; render(); emit('timer-reset'); }
  });
  body.addEventListener('change', (e) => {
    const id = e.target.dataset.alon;
    if (!id) return;
    const a = C.alarms.find((x) => x.id === id);
    a.on = e.target.checked;
    render();
    emit('alarm-toggle', { time: a.time, on: a.on });
  });

  render();
  return {
    tick: () => { if (tab === 'timer' && !pg.contains(document.activeElement)) render(); },
    onArgs: (a) => { if (a.tab) { tab = a.tab; render(); } },
  };
}

// ------------------------------------------------------------------ Ekran Klavyesi (Türkçe Q)
const ROWS = [
  ['"', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '-', ['Backspace', '⌫ Geri', 2]],
  [['Tab', 'Sekme', 1.5], 'q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü', ['Enter', 'Enter ↵', 1.5]],
  [['Caps', 'Caps Lock', 1.9], 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i', ',', ['Enter', '↵', 1.1]],
  [['Shift', '⇧ Shift', 1.5], '<', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', '.', ['Shift', '⇧ Shift', 2.5]],
  [['Ctrl', 'Ctrl', 1.4], ['Alt', 'Alt', 1.2], [' ', 'Boşluk', 7.4], ['AltGr', 'Alt Gr', 1.4], ['Left', '←', 1], ['Right', '→', 1], ['Close', '✕', 1.2]],
];
const SHIFT = { '"': 'é', 1: '!', 2: "'", 3: '^', 4: '+', 5: '%', 6: '&', 7: '/', 8: '(', 9: ')', 0: '=', '*': '?', '-': '_', ',': ';', '.': ':', '<': '>' };
const ALTGR = { q: '@', e: '€', 2: '£', 3: '#', 4: '$', 5: '½', 7: '{', 8: '[', 9: ']', 0: '}', '*': '\\', '-': '|', '<': '|', ü: '~' };
const up = (c) => c.toLocaleUpperCase('tr');

export function osk({ desk, win, body, emit }) {
  body.classList.add('osk');
  const st = { shift: false, caps: false, altgr: false };
  // Ekranın altına yerleşir
  const scr = desk.winsEl.getBoundingClientRect();
  win.y = Math.max(4, scr.height - win.h - 6);

  function label(k) {
    if (st.altgr && ALTGR[k]) return ALTGR[k];
    if (/^\p{L}$/u.test(k)) return st.shift !== st.caps ? up(k) : k;
    return st.shift && SHIFT[k] ? SHIFT[k] : k;
  }
  function render() {
    body.innerHTML = ROWS.map((r) => `<div class="osk-row">${r.map((k) => {
      if (Array.isArray(k)) {
        const [code, l, w] = k;
        const on = (code === 'Shift' && st.shift) || (code === 'Caps' && st.caps) || (code === 'AltGr' && st.altgr);
        return `<button type="button" data-k="${code}" class="osk-sp ${on ? 'on' : ''}" style="flex:${w}">${l}</button>`;
      }
      return `<button type="button" data-k="${esc(k)}">${esc(label(k))}</button>`;
    }).join('')}</div>`).join('');
  }

  function target() {
    const t = desk.lastInput;
    if (!t || !t.isConnected) return null;
    if (document.activeElement !== t) t.focus({ preventScroll: true });
    return t;
  }
  function press(k) {
    if (k === 'Shift') { st.shift = !st.shift; render(); return; }
    if (k === 'Caps') { st.caps = !st.caps; render(); return; }
    if (k === 'AltGr') { st.altgr = !st.altgr; render(); return; }
    if (k === 'Close') { desk.close(win); return; }
    if (k === 'Ctrl' || k === 'Alt') return;
    const t = target();
    if (!t) { desk.toast('Ekran Klavyesi', 'Önce yazı yazacağınız yere (Not Defteri, arama kutusu…) bir kez tıklayın.', '⌨', 4000); return; }
    const field = t.matches('input, textarea');
    if (k === 'Backspace') document.execCommand('delete');
    else if (k === 'Enter') {
      if (t.matches('input')) t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      else if (field) document.execCommand('insertText', false, '\n');
      else document.execCommand('insertParagraph');
    } else if (k === 'Tab') document.execCommand('insertText', false, '\t');
    else if (k === 'Left' || k === 'Right') {
      const d = k === 'Left' ? -1 : 1;
      if (field) { const p = Math.max(0, (d < 0 ? t.selectionStart : t.selectionEnd) + d); t.setSelectionRange(p, p); } else getSelection().modify('move', d < 0 ? 'backward' : 'forward', 'character');
    } else {
      document.execCommand('insertText', false, label(k));
      if (st.shift || st.altgr) { st.shift = false; st.altgr = false; render(); }
    }
    emit('osk-key', { key: k });
  }
  body.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  render();
  return { press };
}

// ------------------------------------------------------------------ Büyüteç: pencere açmaz, ekranı büyütür
export const magnifier = (desk) => desk.setMag(desk.mag === 1 ? 2 : desk.mag);
