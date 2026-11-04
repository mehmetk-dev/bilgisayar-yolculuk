// Windows donatıları (Windows 11 görünümü): Yapışkan Notlar, Ses Kaydedici, Saat (odaklanma, zamanlayıcı, alarm, kronometre, dünya saati)
import { esc, playTune } from './util.js';
import { ico } from '../w11ikon.js';

const pad = (n) => String(n).padStart(2, '0');
// [anahtar, kâğıt rengi, üst şerit rengi, ad]
const COLORS = [['sari', '#fff7d1', '#fbe987', 'Sarı'], ['yesil', '#e4f5db', '#b6e3a0', 'Yeşil'], ['pembe', '#fbe6f0', '#f3b3d3', 'Pembe'], ['mor', '#ece6f8', '#cbbbea', 'Mor'], ['mavi', '#e0eefb', '#a8d2f4', 'Mavi'], ['gri', '#eeeeee', '#c8c8c8', 'Gri']];
const hms = (s) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(Math.floor(s) % 60)}`;

// ---- Yapışkan Notlar: sarı kâğıtlar. Üstte + (yeni not) ve ⋯ (renk, sil), altta biçim çubuğu ----
// Olaylar: 'sticky-new', 'sticky-text', 'sticky-color', 'sticky-delete'
export function notlar({ desk, body, emit, dialogs }) {
  body.classList.add('wnt');
  const list = () => desk.stickies;
  const col = (k) => COLORS.find((c) => c[0] === k) || COLORS[0];
  const noteHtml = (n) => n.html ?? esc(n.text).replace(/\n/g, '<br>');
  const FMT = [['bold', 'bold', 'Kalın (Ctrl+B)'], ['italic', 'italic', 'İtalik (Ctrl+I)'], ['underline', 'underline', 'Altı çizili (Ctrl+U)'], ['strikeThrough', 'strike', 'Üstü çizili'], ['insertUnorderedList', 'list', 'Madde işaretleri']];
  const render = (focusId) => {
    body.innerHTML = `<div class="wnt-top"><button type="button" class="wnt-new" title="Yeni not">${ico('plus')}<span>Yeni not</span></button><span class="wnt-count">${list().length} not</span></div>
      <div class="wnt-grid">${list().map((n) => `<div class="wnt-note" data-id="${n.id}" style="--nb:${col(n.color)[1]};--nh:${col(n.color)[2]}">
        <div class="wnt-head"><button type="button" data-act="add" title="Yeni not">${ico('plus')}</button><span class="wnt-grow"></span><button type="button" data-act="menu" title="Menü" aria-label="Menü">${ico('dots')}</button></div>
        <div class="wnt-menu" hidden><div class="wnt-cols">${COLORS.map(([k, bg, , l]) => `<button type="button" class="wnt-c${k === n.color ? ' on' : ''}" data-color="${k}" style="background:${bg}" title="${l}" aria-label="${l}"></button>`).join('')}</div><button type="button" class="wnt-del" data-act="del">${ico('trash')}<span>Notu sil</span></button></div>
        <div class="wnt-text" contenteditable="true" spellcheck="false" data-ph="Not alın…" role="textbox" aria-label="Not">${noteHtml(n)}</div>
        <div class="wnt-fmt">${FMT.map(([c, i, t]) => `<button type="button" data-fmt="${c}" title="${t}" aria-label="${t}">${ico(i)}</button>`).join('')}</div></div>`).join('') || '<p class="wnt-empty">Henüz notunuz yok. “Yeni not”a tıklayın.</p>'}</div>`;
    if (focusId) body.querySelector(`[data-id="${focusId}"] .wnt-text`)?.focus();
  };
  const noteOf = (el) => { const note = el.closest('.wnt-note'); return note && list().find((x) => x.id === note.dataset.id); };
  const addNote = () => {
    const n = { id: 'n' + Date.now(), text: '', html: '', color: 'sari' };
    list().push(n);
    emit('sticky-new', { count: list().length });
    render(n.id);
  };
  const closeMenus = () => body.querySelectorAll('.wnt-menu').forEach((m) => { m.hidden = true; });
  const fmtState = () => body.querySelectorAll('[data-fmt]').forEach((b) => b.classList.toggle('on', document.activeElement?.classList.contains('wnt-text') && document.queryCommandState(b.dataset.fmt)));
  body.addEventListener('mousedown', (e) => { if (e.target.closest('[data-fmt]')) e.preventDefault(); }); // yazıdaki seçim kaybolmasın
  body.addEventListener('click', async (e) => {
    if (e.target.closest('.wnt-new') || e.target.closest('[data-act="add"]')) { addNote(); return; }
    const n = noteOf(e.target);
    if (!n) { closeMenus(); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'menu') { const m = e.target.closest('.wnt-note').querySelector('.wnt-menu'); const was = m.hidden; closeMenus(); m.hidden = !was; return; }
    const c = e.target.closest('[data-color]');
    if (c) { n.color = c.dataset.color; emit('sticky-color', { color: n.color }); render(); return; }
    if (act === 'del') {
      if (n.text.trim() && dialogs) {
        const a = await dialogs.ask({ title: 'Notu sil', text: 'Bu notu silmek istediğinizden emin misiniz? Silinen not geri getirilemez.', buttons: [['del', 'Sil', true], ['cancel', 'İptal']] });
        if (a !== 'del') return;
      }
      desk.stickies = list().filter((x) => x !== n);
      emit('sticky-delete', { count: list().length });
      render();
      return;
    }
    const f = e.target.closest('[data-fmt]');
    if (f) {
      const t = e.target.closest('.wnt-note').querySelector('.wnt-text');
      t.focus();
      document.execCommand(f.dataset.fmt);
      n.html = t.innerHTML;
      fmtState();
      return;
    }
    if (e.target.closest('.wnt-text')) closeMenus();
  });
  body.addEventListener('input', (e) => {
    const n = e.target.closest('.wnt-text') && noteOf(e.target);
    if (!n) return;
    n.html = e.target.innerHTML;
    n.text = e.target.innerText.replace(/\n$/, '');
    emit('sticky-text', { text: n.text, count: list().length });
  });
  body.addEventListener('paste', (e) => {
    if (!e.target.closest('.wnt-text')) return;
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData?.getData('text/plain') ?? '');
  });
  body.addEventListener('keyup', fmtState);
  body.addEventListener('focusin', fmtState);
  render();
  return {};
}

// ---- Ses Kaydedici: ortada büyük kırmızı kayıt düğmesi, altta kayıt listesi ----
// Olaylar: 'rec-start', 'rec-stop' { name, secs }, 'rec-play' { audible }
export function kayit({ desk, body, emit, dialogs }) {
  body.classList.add('wvr');
  let t0 = 0, acc = 0, paused = false, flags = 0, sel = null, play = null;
  let timer = 0, ptimer = 0;
  const recs = () => desk.fs.children('music').filter((n) => n.content?.audio && /\.m4a$/.test(n.name));
  const show = (n) => n.name.replace(/\.m4a$/, '');
  const elapsed = () => acc + (t0 && !paused ? (Date.now() - t0) / 1000 : 0);
  const when = (n) => { const d = new Date(n.mtime || Date.now()); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  // Kayıt adından üretilen sabit dalga şekli
  const bars = (seed, n = 28) => { let h = 7; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 9973; return Array.from({ length: n }, () => { h = (h * 73 + 41) % 9973; return 18 + (h % 70); }); };
  const recording = () => !!t0;

  const render = () => {
    const rec = recs().find((n) => n.id === sel);
    let main;
    if (recording()) {
      main = `<div class="wvr-time">${hms(elapsed())}</div>
        <div class="wvr-wave live${paused ? ' hold' : ''}">${bars('canli', 36).map((h, i) => `<i style="height:${h}%;animation-delay:${(i % 9) * 0.09}s"></i>`).join('')}</div>
        <div class="wvr-ctl"><button type="button" class="wvr-pause" title="${paused ? 'Sürdür' : 'Duraklat'}" aria-label="${paused ? 'Sürdür' : 'Duraklat'}">${ico(paused ? 'play' : 'pause')}</button>
          <button type="button" class="wvr-btn on" title="Kaydı durdur" aria-label="Kaydı durdur">${ico('stop')}</button>
          <button type="button" class="wvr-flag" title="İşaret ekle" aria-label="İşaret ekle">${ico('flag')}</button></div>
        <div class="wvr-hint">${paused ? 'Duraklatıldı.' : 'Kaydediliyor…'} Durdurmak için kırmızı kare düğmeye tıklayın.${flags ? ` <b>${flags}</b> işaret.` : ''}</div>`;
    } else if (rec) {
      const secs = rec.content?.secs || 0;
      main = `<div class="wvr-name">${esc(show(rec))}</div><div class="wvr-date">${when(rec)}</div>
        <div class="wvr-wave" data-id="${rec.id}">${bars(rec.name).map((h, i) => `<i style="height:${h}%"></i>`).join('')}<b class="wvr-prog"></b></div>
        <div class="wvr-pt"><span class="wvr-pos">00:00:00</span><span>${hms(secs)}</span></div>
        <div class="wvr-ctl"><button type="button" class="wvr-rename" title="Yeniden adlandır" aria-label="Yeniden adlandır">${ico('edit')}</button>
          <button type="button" class="wvr-big wvr-play" title="Dinle" aria-label="Dinle">${ico(play ? 'pause' : 'play')}</button>
          <button type="button" class="wvr-trash" title="Sil" aria-label="Sil">${ico('trash')}</button></div>`;
    } else {
      main = `<button type="button" class="wvr-btn" title="Kaydı başlat" aria-label="Kaydı başlat">${ico('mic')}</button>
        <div class="wvr-hint">Kayda başlamak için kırmızı düğmeye tıklayın.</div>`;
    }
    body.innerHTML = `<div class="wvr-main">${main}</div>
      <div class="wvr-list"><div class="wvr-lh"><h3>Kayıtlar</h3>${!recording() && (rec || recs().length) ? `<button type="button" class="wvr-new" title="Yeni kayıt" aria-label="Yeni kayıt">${ico('mic')}</button>` : ''}</div>
        ${recs().map((n) => `<div class="wvr-item${n.id === sel ? ' on' : ''}" data-id="${n.id}"><span class="wvr-ii">${ico('mic')}</span><span class="wvr-in"><b>${esc(show(n))}</b><small>${when(n)}</small></span><small>${hms(n.content?.secs || 0)}</small><button type="button" class="wvr-lp" title="Dinle" aria-label="Dinle">${ico('play')}</button></div>`).join('') || '<p class="wvr-none">Henüz kayıt yok.</p>'}</div>`;
  };

  const start = () => {
    t0 = Date.now(); acc = 0; paused = false; flags = 0; sel = null;
    emit('rec-start');
    timer = setInterval(() => { const el = body.querySelector('.wvr-time'); if (el) el.textContent = hms(elapsed()); }, 250);
    render();
  };
  const stop = () => {
    clearInterval(timer);
    const secs = Math.max(1, Math.round(elapsed()));
    t0 = 0; acc = 0; paused = false;
    let i = recs().length + 1;
    while (desk.fs.find('music', `Kayıt (${i}).m4a`)) i++;
    const name = `Kayıt (${i}).m4a`;
    const node = desk.fs.create('music', { type: 'file', name, content: { audio: true, secs } });
    sel = node.id;
    emit('rec-stop', { name, secs });
    render();
  };
  const playRec = (id) => {
    const n = recs().find((x) => x.id === id);
    if (!n) return;
    if (sel !== id) { sel = id; play = null; render(); }
    const d = playTune(desk, [523, 659, 784, 659, 523], 0.22);
    emit('rec-play', { audible: d > 0 });
    if (!d) { desk.toast('Ses duyulmuyor', 'Ses kapalı ya da sıfırda. Görev çubuğundaki hoparlör simgesinden açabilirsiniz.', ico('x')); return; }
    clearInterval(ptimer);
    const t1 = Date.now(), total = Math.max(1, n.content?.secs || 1);
    play = { id };
    const tick = () => {
      const p = Math.min(1, (Date.now() - t1) / (d * 1000));
      const pr = body.querySelector('.wvr-prog'), ps = body.querySelector('.wvr-pos');
      if (pr) pr.style.width = p * 100 + '%';
      if (ps) ps.textContent = hms(p * total);
      if (p >= 1) { clearInterval(ptimer); play = null; const b = body.querySelector('.wvr-play'); if (b) b.innerHTML = ico('play'); }
    };
    ptimer = setInterval(tick, 80);
    const b = body.querySelector('.wvr-play'); if (b) b.innerHTML = ico('pause');
  };

  body.addEventListener('click', async (e) => {
    const rb = e.target.closest('.wvr-btn, .wvr-new');
    if (rb) { if (recording()) stop(); else start(); return; }
    if (e.target.closest('.wvr-pause')) {
      if (paused) { t0 = Date.now(); paused = false; } else { acc = elapsed(); paused = true; }
      render();
      return;
    }
    if (e.target.closest('.wvr-flag')) { flags++; render(); return; }
    const item = e.target.closest('.wvr-item');
    if (e.target.closest('.wvr-lp') && item) { playRec(item.dataset.id); return; }
    if (e.target.closest('.wvr-play')) { if (play) { clearInterval(ptimer); play = null; render(); } else playRec(sel); return; }
    if (item && !recording()) { clearInterval(ptimer); play = null; sel = item.dataset.id; render(); return; }
    const rec = recs().find((n) => n.id === sel);
    if (rec && e.target.closest('.wvr-rename')) {
      const r = await dialogs.form({ title: 'Yeniden adlandır', fields: [{ name: 'name', label: 'Kayıt adı:', value: show(rec) }], ok: 'Tamam', check: (v) => (v.name.trim() ? desk.fs.checkName(v.name) : 'Ad boş olamaz.') });
      if (!r) return;
      const err = desk.fs.rename(rec.id, r.name.trim() + '.m4a');
      if (err) desk.toast('Ad değiştirilemedi', err, ico('x')); else emit('rec-rename', { name: r.name.trim() });
      render();
      return;
    }
    if (rec && e.target.closest('.wvr-trash')) {
      const a = await dialogs.ask({ title: 'Kaydı sil', text: `“${esc(show(rec))}” kaydını silmek istiyor musunuz?`, buttons: [['del', 'Sil', true], ['cancel', 'İptal']] });
      if (a !== 'del') return;
      desk.fs.remove(rec.id);
      sel = null; play = null;
      emit('rec-delete');
      render();
    }
  });
  render();
  return { onFs: () => { if (!t0) render(); }, destroy: () => { clearInterval(timer); clearInterval(ptimer); } };
}

// ---- Saat: Odaklanma oturumları, Zamanlayıcı, Alarm, Kronometre, Dünya saati ----
// Olaylar: 'alarm-add' { time, label }, 'alarm-toggle', 'alarm-delete', 'timer-start' { secs }, 'timer-delete', 'focus-start', 'stopwatch-start'
const CITIES = [['İstanbul', 'Europe/Istanbul'], ['Londra', 'Europe/London'], ['Berlin', 'Europe/Berlin'], ['Moskova', 'Europe/Moscow'], ['Dubai', 'Asia/Dubai'], ['Tokyo', 'Asia/Tokyo'], ['New York', 'America/New_York']];
const NAV = [['focus', 'Odaklanma oturumları', 'focus'], ['timer', 'Zamanlayıcı', 'hourglass'], ['alarm', 'Alarm', 'bell'], ['sw', 'Kronometre', 'stopwatch'], ['world', 'Dünya saati', 'globe']];

export function saat({ desk, body, emit }) {
  body.classList.add('wck');
  let tab = 'focus', adding = false, fmin = 30;
  const sw = { run: false, t0: 0, acc: 0, laps: [] };
  let sig = '';
  const swMs = () => sw.acc + (sw.run ? Date.now() - sw.t0 : 0);
  const fmtSw = (ms) => { const s = ms / 1000; return `${pad(Math.floor(s / 60))}:${pad(Math.floor(s) % 60)},${pad(Math.floor((ms % 1000) / 10))}`; };
  const left = (end) => Math.max(0, Math.ceil((end - Date.now()) / 1000));
  const focusT = () => desk.timers.find((t) => t.focus);
  const sigOf = () => `${desk.alarms.length}/${desk.timers.length}/${desk.alarms.map((a) => a.id + a.time + a.on).join()}`;

  const wall = (tz) => {
    const d = desk.now();
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(d).map((p) => [p.type, p.value]));
    return { h: +parts.hour % 24, m: +parts.minute, day: Date.UTC(+parts.year, +parts.month - 1, +parts.day) };
  };

  const pages = {
    focus() {
      const t = focusT();
      const total = t ? (t.end - t.start) / 1000 : fmin * 60;
      const rest = t ? left(t.end) : fmin * 60;
      const p = t ? 1 - rest / total : 0;
      const R = 52, C = 2 * Math.PI * R;
      return `<h2>Odaklanma oturumları</h2>
        <div class="wck-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" class="wck-ring-bg"/><circle cx="60" cy="60" r="${R}" class="wck-ring-fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - p)).toFixed(1)}" transform="rotate(-90 60 60)"/></svg><div class="wck-ringt wck-big" data-focus="1">${hms(rest)}</div></div>
        ${t ? '<div class="wck-row"><button type="button" class="wck-fend">Oturumu bitir</button></div><p class="wck-mut">Odaklanın: süre dolunca bilgisayar sizi uyarır.</p>'
          : `<div class="wck-row wck-step"><button type="button" class="wck-fm" data-d="-5" title="5 dakika azalt">${ico('minus')}</button><b>${fmin} dakika</b><button type="button" class="wck-fm" data-d="5" title="5 dakika artır">${ico('plus')}</button></div>
            <div class="wck-row"><button type="button" class="wck-fstart wck-pri">Odaklanma oturumunu başlat</button></div>`}`;
    },
    timer() {
      const run = desk.timers.filter((t) => !t.focus);
      return `<h2>Zamanlayıcı</h2>
        ${run.map((t, i) => `<div class="wck-card"><div><div class="wck-big" data-end="${t.end}">${hms(left(t.end))}</div><small>${esc(t.label)}</small></div><button type="button" class="wck-tdel" data-i="${i}" title="Zamanlayıcıyı sil" aria-label="Zamanlayıcıyı sil">${ico('x')}</button></div>`).join('')}
        <div class="wck-presets">${[[10, '10 saniye'], [60, '1 dakika'], [300, '5 dakika'], [900, '15 dakika']].map(([s, l]) => `<button type="button" class="wck-pre" data-secs="${s}"><b>${hms(s)}</b><span>${l}</span><i>${ico('play')}</i></button>`).join('')}</div>
        ${run.length ? '' : '<p class="wck-mut">Bir süre seçin; dolunca ses çalar ve ekranın köşesinde uyarı çıkar.</p>'}`;
    },
    alarm() {
      const now = desk.now();
      const soon = new Date(now.getTime() + 60000); // bir dakika sonrası (14:59 → 15:00)
      const hm = `${pad(soon.getHours())}:${pad(soon.getMinutes())}`;
      const sorted = [...desk.alarms].sort((a, b) => a.time.localeCompare(b.time));
      return `<div class="wck-h"><h2>Alarm</h2><button type="button" class="wck-add" title="Yeni alarm ekle" aria-label="Yeni alarm ekle">${ico('plus')}</button></div>
        ${adding ? `<div class="wck-form"><label>Saat<input type="time" class="wck-time" value="${hm}"></label><label>Alarm adı<input type="text" class="wck-label" placeholder="Alarm adı (ör. İlaç saati)" maxlength="30"></label>
          <div class="wck-row"><button type="button" class="wck-addbtn wck-pri">Ekle</button><button type="button" class="wck-cancel">Vazgeç</button></div></div>` : ''}
        <div class="wck-list">${sorted.map((a) => `<div class="wck-item${a.on ? '' : ' off'}" data-id="${a.id}"><div class="wck-it"><b>${a.time}</b><span>${esc(a.label || 'Alarm')}</span><small>${a.once ? 'Yalnızca bir kez' : 'Her gün'}</small></div>
          <button type="button" class="wck-tg${a.on ? ' on' : ''}" role="switch" aria-checked="${a.on}" title="${a.on ? 'Alarmı kapat' : 'Alarmı aç'}"><i></i></button><button type="button" class="wck-del" title="Sil" aria-label="Alarmı sil">${ico('trash')}</button></div>`).join('') || (adding ? '' : '<p class="wck-mut">Henüz alarm yok. Sağ üstteki + düğmesiyle ekleyin.</p>')}</div>`;
    },
    sw() {
      return `<h2>Kronometre</h2><div class="wck-swt wck-big">${fmtSw(swMs())}</div>
        <div class="wck-row"><button type="button" class="wck-round wck-pri wck-swgo" title="${sw.run ? 'Duraklat' : 'Başlat'}" aria-label="${sw.run ? 'Duraklat' : 'Başlat'}">${ico(sw.run ? 'pause' : 'play')}</button>
          <button type="button" class="wck-round wck-swlap" title="Tur" aria-label="Tur" ${sw.run ? '' : 'disabled'}>${ico('flag')}</button><button type="button" class="wck-round wck-swreset" title="Sıfırla" aria-label="Sıfırla" ${swMs() ? '' : 'disabled'}>${ico('reset')}</button></div>
        <div class="wck-laps">${[...sw.laps].reverse().map((l, i) => `<div><span>Tur ${sw.laps.length - i}</span><b>${fmtSw(l.lap)}</b><small>${fmtSw(l.total)}</small></div>`).join('')}</div>`;
    },
    world() {
      const home = wall('Europe/Istanbul');
      return `<h2>Dünya saati</h2><div class="wck-list">${CITIES.map(([n, tz]) => {
        const w = wall(tz);
        const dd = Math.round((w.day - home.day) / 864e5);
        const off = Math.round(((w.h * 60 + w.m) - (home.h * 60 + home.m) + dd * 1440) / 60);
        return `<div class="wck-item"><div class="wck-it"><span class="wck-city">${n}</span><small>${n === 'İstanbul' ? 'Yerel saatiniz' : `${dd === 0 ? 'Bugün' : dd > 0 ? 'Yarın' : 'Dün'}, ${off > 0 ? '+' : off < 0 ? '−' : ''}${Math.abs(off)} sa`}</small></div><b class="wck-wt" data-tz="${tz}">${pad(w.h)}:${pad(w.m)}</b></div>`;
      }).join('')}</div>`;
    },
  };

  const render = () => {
    sig = sigOf();
    body.innerHTML = `<nav class="wck-nav">${NAV.map(([k, l, i]) => `<button type="button" data-tab="${k}" class="${k === tab ? 'on' : ''}">${ico(i)}<span>${l}</span></button>`).join('')}</nav><div class="wck-page">${pages[tab]()}</div>`;
  };

  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]');
    if (t) { tab = t.dataset.tab; adding = false; render(); return; }
    if (e.target.closest('.wck-fm')) { fmin = Math.max(5, Math.min(180, fmin + +e.target.closest('.wck-fm').dataset.d)); render(); return; }
    if (e.target.closest('.wck-fstart')) { const now = Date.now(); desk.timers.push({ start: now, end: now + fmin * 60000, label: 'Odaklanma oturumu', focus: true }); emit('focus-start', { minutes: fmin }); render(); return; }
    if (e.target.closest('.wck-fend')) { desk.timers = desk.timers.filter((x) => !x.focus); render(); return; }
    if (e.target.closest('.wck-add')) { adding = !adding; render(); return; }
    if (e.target.closest('.wck-cancel')) { adding = false; render(); return; }
    if (e.target.closest('.wck-addbtn')) {
      const time = body.querySelector('.wck-time').value;
      if (!time) return;
      const label = body.querySelector('.wck-label').value.trim();
      desk.alarms.push({ id: 'a' + Date.now(), time, label, on: true });
      adding = false;
      emit('alarm-add', { time, label });
      render();
      return;
    }
    const item = e.target.closest('.wck-item');
    const a = item && desk.alarms.find((x) => x.id === item.dataset.id);
    if (a && e.target.closest('.wck-tg')) { a.on = !a.on; emit('alarm-toggle', { on: a.on }); render(); return; }
    if (a && e.target.closest('.wck-del')) { desk.alarms = desk.alarms.filter((x) => x !== a); emit('alarm-delete'); render(); return; }
    const td = e.target.closest('.wck-tdel');
    if (td) { const run = desk.timers.filter((x) => !x.focus); desk.timers.splice(desk.timers.indexOf(run[+td.dataset.i]), 1); emit('timer-delete'); render(); return; }
    const p = e.target.closest('[data-secs]');
    if (p) {
      const secs = +p.dataset.secs;
      desk.timers.push({ end: Date.now() + secs * 1000, label: `${secs >= 60 ? secs / 60 + ' dakika' : secs + ' saniye'} zamanlayıcı` });
      emit('timer-start', { secs });
      render();
      return;
    }
    if (e.target.closest('.wck-swgo')) {
      if (sw.run) { sw.acc += Date.now() - sw.t0; sw.run = false; } else { sw.t0 = Date.now(); sw.run = true; emit('stopwatch-start'); }
      render();
    } else if (e.target.closest('.wck-swlap') && sw.run) {
      const total = swMs();
      sw.laps.push({ total, lap: total - (sw.laps.at(-1)?.total || 0) });
      render();
    } else if (e.target.closest('.wck-swreset')) { sw.run = false; sw.acc = 0; sw.laps = []; render(); }
  });
  const iv = setInterval(() => {
    if (tab === 'timer') body.querySelectorAll('[data-end]').forEach((el) => { el.textContent = hms(left(+el.dataset.end)); });
    else if (tab === 'focus') { const t = focusT(); const el = body.querySelector('[data-focus]'); if (el && t) { el.textContent = hms(left(t.end)); body.querySelector('.wck-ring-fg')?.setAttribute('stroke-dashoffset', (2 * Math.PI * 52 * left(t.end) / ((t.end - t.start) / 1000)).toFixed(1)); } }
    else if (tab === 'sw' && sw.run) { const el = body.querySelector('.wck-swt'); if (el) el.textContent = fmtSw(swMs()); }
    else if (tab === 'world') body.querySelectorAll('[data-tz]').forEach((el) => { const w = wall(el.dataset.tz); el.textContent = `${pad(w.h)}:${pad(w.m)}`; });
  }, 250);
  render();
  return { onAlarm: () => { if (sig !== sigOf() && !adding) render(); }, destroy: () => clearInterval(iv) };
}
