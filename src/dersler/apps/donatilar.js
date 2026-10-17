// Windows donatıları: Yapışkan Notlar, Ses Kaydedici, Saat (alarm ve zamanlayıcı)
import { esc, playTune } from './util.js';

const COLORS = [['sari', '#fff59d', 'Sarı'], ['pembe', '#f8bbd0', 'Pembe'], ['mavi', '#b3e5fc', 'Mavi'], ['yesil', '#c8e6c9', 'Yeşil']];
const pad = (n) => String(n).padStart(2, '0');

// ---- Yapışkan Notlar: unutulmaması gereken işler için renkli kâğıtlar ----
export function notlar({ desk, body, emit }) {
  body.classList.add('sk');
  const list = () => desk.stickies;
  const render = (focusId) => {
    body.innerHTML = `<div class="sk-top"><button type="button" class="sk-new primary">＋ Yeni not</button><span>${list().length} not</span></div>
      <div class="sk-grid">${list().map((n) => `<div class="sk-note" data-id="${n.id}" style="background:${COLORS.find((c) => c[0] === n.color)[1]}">
        <div class="sk-bar"><span class="sk-cols">${COLORS.map(([k, bg, l]) => `<button type="button" class="sk-c${k === n.color ? ' on' : ''}" data-color="${k}" style="background:${bg}" title="${l}"></button>`).join('')}</span><button type="button" class="sk-del" title="Notu sil">🗑</button></div>
        <textarea class="sk-text" placeholder="Notunuzu yazın…" spellcheck="false">${esc(n.text)}</textarea></div>`).join('') || '<p class="sk-empty">Henüz notunuz yok. “＋ Yeni not”a tıklayın.</p>'}</div>`;
    if (focusId) body.querySelector(`[data-id="${focusId}"] textarea`)?.focus();
  };
  body.addEventListener('click', (e) => {
    if (e.target.closest('.sk-new')) {
      const n = { id: 'n' + Date.now(), text: '', color: 'sari' };
      list().push(n);
      emit('sticky-new', { count: list().length });
      render(n.id);
      return;
    }
    const note = e.target.closest('.sk-note');
    const n = note && list().find((x) => x.id === note.dataset.id);
    if (!n) return;
    const c = e.target.closest('[data-color]');
    if (c) { n.color = c.dataset.color; emit('sticky-color', { color: n.color }); render(); }
    if (e.target.closest('.sk-del')) { desk.stickies = list().filter((x) => x !== n); emit('sticky-delete', { count: list().length }); render(); }
  });
  body.addEventListener('input', (e) => {
    const note = e.target.closest('.sk-note');
    const n = note && list().find((x) => x.id === note.dataset.id);
    if (!n) return;
    n.text = e.target.value;
    emit('sticky-text', { text: n.text, count: list().length });
  });
  render();
  return {};
}

// ---- Ses Kaydedici ----
export function kayit({ desk, body, emit }) {
  body.classList.add('rc');
  let t0 = 0, timer = 0;
  const recs = () => desk.fs.children('music').filter((n) => /^Kayıt.*\.m4a$/.test(n.name));
  const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;
  const render = () => {
    const on = !!t0;
    body.innerHTML = `<div class="rc-main"><div class="rc-time">${on ? fmt((Date.now() - t0) / 1000) : '00:00'}</div>
      <button type="button" class="rc-btn${on ? ' on' : ''}" title="${on ? 'Kaydı durdur' : 'Kaydı başlat'}">${on ? '■' : '●'}</button>
      <div class="rc-hint">${on ? 'Kaydediliyor… Durdurmak için ■ düğmesine tıklayın.' : 'Kayda başlamak için kırmızı ● düğmesine tıklayın.'}</div></div>
      <div class="rc-list"><h3>Kayıtlarınız</h3>${recs().map((n) => `<div class="rc-item" data-id="${n.id}"><span>🎙</span><b>${esc(n.name)}</b><small>${fmt(n.content?.secs || 0)}</small><button type="button" class="rc-play">▶ Dinle</button></div>`).join('') || '<p class="mut">Henüz kayıt yok.</p>'}</div>`;
  };
  body.addEventListener('click', (e) => {
    if (e.target.closest('.rc-btn')) {
      if (!t0) {
        t0 = Date.now();
        emit('rec-start');
        timer = setInterval(() => { const el = body.querySelector('.rc-time'); if (el) el.textContent = fmt((Date.now() - t0) / 1000); }, 250);
        render();
      } else {
        clearInterval(timer);
        const secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
        t0 = 0;
        let i = recs().length + 1;
        while (desk.fs.find('music', `Kayıt (${i}).m4a`)) i++;
        const name = `Kayıt (${i}).m4a`;
        desk.fs.create('music', { type: 'file', name, content: { audio: true, secs } });
        emit('rec-stop', { name, secs });
        render();
      }
    }
    const p = e.target.closest('.rc-play');
    if (p) {
      const d = playTune(desk, [523, 659, 784, 659, 523], 0.22);
      emit('rec-play', { audible: d > 0 });
      if (!d) desk.toast('Ses duyulmuyor', 'Ses kapalı ya da sıfırda. Görev çubuğundaki 🔊 simgesinden açabilirsiniz.', '🔇');
    }
  });
  render();
  return { onFs: () => { if (!t0) render(); }, destroy: () => clearInterval(timer) };
}

// ---- Saat: alarm ve zamanlayıcı ----
export function saat({ desk, body, emit }) {
  body.classList.add('sa');
  let tab = 'alarm';
  const render = () => {
    const now = desk.now();
    const soon = new Date(now.getTime() + 60000); // bir dakika sonrası (14:59 → 15:00)
    const hm = `${pad(soon.getHours())}:${pad(soon.getMinutes())}`;
    body.innerHTML = `<div class="sa-tabs"><button type="button" data-tab="alarm" class="${tab === 'alarm' ? 'on' : ''}">⏰ Alarm</button><button type="button" data-tab="timer" class="${tab === 'timer' ? 'on' : ''}">⏳ Zamanlayıcı</button></div>
      <div class="sa-page">${tab === 'alarm' ? `
        <div class="sa-add"><input type="time" class="sa-time" value="${hm}"><input type="text" class="sa-label" placeholder="Alarm adı (ör. İlaç saati)" maxlength="30"><button type="button" class="sa-addbtn primary">＋ Ekle</button></div>
        <div class="sa-list">${desk.alarms.map((a) => `<div class="sa-item" data-id="${a.id}"><b>${a.time}</b><span>${esc(a.label || 'Alarm')}</span><button type="button" class="sa-tg${a.on ? ' on' : ''}">${a.on ? 'Açık' : 'Kapalı'}</button><button type="button" class="sa-del" title="Sil">🗑</button></div>`).join('') || '<p class="mut">Henüz alarm yok.</p>'}</div>` : `
        <div class="sa-presets">${[[10, '10 saniye'], [60, '1 dakika'], [300, '5 dakika'], [900, '15 dakika']].map(([s, l]) => `<button type="button" data-secs="${s}">${l}</button>`).join('')}</div>
        <div class="sa-count">${desk.timers.length ? '' : '<p class="mut">Bir süre seçin; dolunca ses çalar ve ekranın köşesinde uyarı çıkar.</p>'}${desk.timers.map((t) => `<div class="sa-big" data-end="${t.end}">${fmtLeft(t.end)}</div>`).join('')}</div>`}</div>`;
  };
  const fmtLeft = (end) => { const s = Math.max(0, Math.ceil((end - Date.now()) / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]');
    if (t) { tab = t.dataset.tab; render(); return; }
    if (e.target.closest('.sa-addbtn')) {
      const time = body.querySelector('.sa-time').value;
      if (!time) return;
      const label = body.querySelector('.sa-label').value.trim();
      desk.alarms.push({ id: 'a' + Date.now(), time, label, on: true });
      emit('alarm-add', { time, label });
      render();
      return;
    }
    const item = e.target.closest('.sa-item');
    const a = item && desk.alarms.find((x) => x.id === item.dataset.id);
    if (a && e.target.closest('.sa-tg')) { a.on = !a.on; emit('alarm-toggle', { on: a.on }); render(); }
    if (a && e.target.closest('.sa-del')) { desk.alarms = desk.alarms.filter((x) => x !== a); emit('alarm-delete'); render(); }
    const p = e.target.closest('[data-secs]');
    if (p) {
      const secs = +p.dataset.secs;
      desk.timers.push({ end: Date.now() + secs * 1000, label: `${secs >= 60 ? secs / 60 + ' dakika' : secs + ' saniye'} zamanlayıcı` });
      emit('timer-start', { secs });
      render();
    }
  });
  const iv = setInterval(() => { if (tab === 'timer') body.querySelectorAll('.sa-big').forEach((el) => { el.textContent = fmtLeft(+el.dataset.end); }); }, 500);
  render();
  return { onAlarm: () => { if (tab === 'timer' && body.querySelectorAll('.sa-big').length !== desk.timers.length) render(); }, destroy: () => clearInterval(iv) };
}
