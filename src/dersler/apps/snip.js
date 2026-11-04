// Ekran Alıntısı Aracı (Windows 11): "+ Yeni" ile ekranın bir bölümünü alır (dikdörtgen, pencere, tam ekran ya da serbest biçim),
// istenirse beş saniye gecikmeyle; alıntıyı kalem, vurgulayıcı ve silgiyle işaretler, panoya kopyalar ya da kaydeder.
// Olaylar: 'snip-new', 'snip-start', 'snip' { w, h, mode }, 'snip-cancel' { small }, 'snip-copy', 'save' { name, folder, label }
import { ico } from '../w11ikon.js';

const MODES = [['rect', 'Dikdörtgen', 'rect', 'Alınacak alanı fareyle sürükleyerek çerçeveleyin'], ['free', 'Serbest biçim', 'free', 'Fareyle istediğiniz şekli çizin; bırakınca alınır'], ['window', 'Pencere', 'window', 'Almak istediğiniz pencerenin üzerine gelip tıklayın'], ['full', 'Tam ekran', 'screen', 'Tüm ekran alınıyor']];
const DELAYS = [[0, 'Gecikme yok'], [3, '3 saniye'], [5, '5 saniye'], [10, '10 saniye']];
const COLORS = [['#d13438', 'Kırmızı'], ['#0067c0', 'Mavi'], ['#111111', 'Siyah'], ['#107c10', 'Yeşil'], ['#f7b500', 'Sarı']];

// ---- Alma: Ekran Alıntısı penceresi açık olsun olmasın çalışır (Yeni düğmesi ve ⊞ + Shift + S aynı katmanı kullanır) ----

export function captureScreen(desk, emit, startMode) {
  startMode ||= 'rect';
  const finish = (canvas, mode, small) => {
    if (canvas) {
      desk.imageClip = canvas;
      const t = desk.toast('Ekran alıntısı panoya kopyalandı', `<img class="to-img" src="${canvas.toDataURL()}" alt="">Paint'i açıp <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, ico('copy'), 9000);
      t.classList.add('wide');
      emit('snip', { w: canvas.width, h: canvas.height, mode });
    } else {
      if (small) { desk.toast('Ekran Alıntısı Aracı', 'Alan çok küçüktü. Tekrar deneyin ve biraz daha büyük sürükleyin.', ico('rect')); }
      emit('snip-cancel', small ? { small: true } : {});
    }
    // Tüm Ekran Alıntısı pencereleri (bu pencere dahil) alıntıyı alır ve gerekirse açılır
    setTimeout(() => desk.wins.forEach((w) => w.api?.onSnip?.()), 0);
  };

  const fullShot = () => {
    const s = desk.screen.getBoundingClientRect();
    return desk.renderScreen({ x: 0, y: 0, w: s.width, h: s.height });
  };
  if (desk.snipping) return;
  desk.snipping = true;
  desk.closeMenus?.();
  let mode = startMode;
  const scr = desk.screen.getBoundingClientRect();
  const ov = document.createElement('div');
  ov.className = 'dk-snip wsn-ov';
  ov.innerHTML = `<div class="wsn-pill">${MODES.map(([k, l, i]) => `<button type="button" data-m="${k}" title="${l}">${ico(i)}</button>`).join('')}<i></i><button type="button" data-m="x" title="Kapat (Esc)">${ico('x')}</button></div>
    <div class="wsn-hint"></div><div class="wsn-rect" hidden></div>
    <svg class="wsn-freesvg" hidden><path d="" fill="#ffffff26" stroke="#fff" stroke-width="2" stroke-dasharray="6 4"/></svg>`;
  desk.screen.append(ov);
  emit('snip-start');
  const rect = ov.querySelector('.wsn-rect'), svg = ov.querySelector('.wsn-freesvg'), path = svg.querySelector('path'), hint = ov.querySelector('.wsn-hint');
  const setRect = (x, y, w, h) => { Object.assign(rect.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); rect.hidden = false; ov.classList.add('hole'); };
  const clearSel = () => { rect.hidden = true; svg.hidden = true; ov.classList.remove('hole'); };
  const setMode = (m) => {
    mode = m;
    if (m !== 'full') desk.snipMode = m; // son seçilen kip hatırlanır (⊞ + Shift + S aynı kipte başlar)
    clearSel();
    ov.querySelectorAll('[data-m]').forEach((b) => b.classList.toggle('on', b.dataset.m === m));
    hint.textContent = MODES.find((x) => x[0] === m)[3];
    ov.classList.toggle('wsn-win', m === 'window');
  };
  const end = () => { desk.snipping = false; ov.remove(); document.removeEventListener('keydown', key, true); };
  const key = (e) => { if (e.key === 'Escape') { end(); finish(null); } };
  document.addEventListener('keydown', key, true);
  setMode(mode);
  // Tam ekran: seçilir seçilmez alınır
  const goFull = () => { end(); finish(fullShot(), 'full'); };

  ov.querySelector('.wsn-pill').addEventListener('pointerdown', (e) => e.stopPropagation());
  ov.querySelector('.wsn-pill').addEventListener('click', (e) => {
    const m = e.target.closest('[data-m]')?.dataset.m;
    if (!m) return;
    if (m === 'x') { end(); finish(null); } else if (m === 'full') { setMode('full'); setTimeout(goFull, 120); } else setMode(m);
  });
  let sx = 0, sy = 0, down = false, pts = [], hoverWin = null;
  const rel = (e) => [e.clientX - scr.left, e.clientY - scr.top];
  // Pencere kipi: fare hangi pencerenin üzerindeyse onu çerçeveler
  const winAt = (e) => {
    ov.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.win');
    ov.style.pointerEvents = '';
    if (!el || el.classList.contains('min')) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left - scr.left), y: Math.max(0, r.top - scr.top), w: Math.min(r.width, scr.width), h: Math.min(r.height, scr.height) };
  };
  ov.addEventListener('pointermove', (e) => {
    if (mode === 'window' && !down) { hoverWin = winAt(e); if (hoverWin) setRect(hoverWin.x, hoverWin.y, hoverWin.w, hoverWin.h); else clearSel(); return; }
    if (!down) return;
    const [x, y] = rel(e);
    if (mode === 'rect') setRect(Math.min(x, sx), Math.min(y, sy), Math.abs(x - sx), Math.abs(y - sy));
    else if (mode === 'free') { pts.push([x, y]); path.setAttribute('d', 'M' + pts.map((p) => p.join(' ')).join('L') + 'Z'); }
  });
  ov.addEventListener('pointerdown', (e) => {
    if (mode === 'full') return;
    down = true;
    [sx, sy] = rel(e);
    pts = [[sx, sy]];
    ov.setPointerCapture(e.pointerId);
    if (mode === 'free') { svg.hidden = false; path.setAttribute('d', ''); }
  });
  ov.addEventListener('pointerup', (e) => {
    if (!down && mode !== 'window') return;
    const [x, y] = rel(e);
    if (mode === 'window') {
      const w = winAt(e);
      if (!w) return;
      end();
      finish(desk.renderScreen(w), 'window');
      return;
    }
    down = false;
    if (mode === 'rect') {
      const r = { x: Math.min(x, sx), y: Math.min(y, sy), w: Math.abs(x - sx), h: Math.abs(y - sy) };
      end();
      if (r.w < 20 || r.h < 20) return finish(null, 'rect', true);
      finish(desk.renderScreen(r), 'rect');
    } else if (mode === 'free') {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const r = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
      end();
      if (r.w < 20 || r.h < 20) return finish(null, 'free', true);
      const shot = desk.renderScreen(r);
      const out = document.createElement('canvas');
      out.width = shot.width; out.height = shot.height;
      const g = out.getContext('2d');
      g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(p[0] - r.x, p[1] - r.y) : g.moveTo(p[0] - r.x, p[1] - r.y)));
      g.closePath();
      g.clip();
      g.drawImage(shot, 0, 0);
      finish(out, 'free');
    }
  });
  if (mode === 'full') setTimeout(goFull, 120);
}

export function snip({ desk, win, body, emit, dialogs, setTitle }) {
  body.classList.add('wsn');
  setTitle?.('Ekran Alıntısı Aracı');
  const st = { mode: 'rect', delay: 0, tool: null, color: '#d13438', src: null, undo: [], redo: [] };
  let cv = null, orig = null, fly = null;

  body.innerHTML = `<div class="wsn-top"><button type="button" class="wsn-new" title="Yeni alıntı">${ico('plus')}<span>Yeni</span></button>
      <button type="button" class="wsn-dd" data-fly="mode" title="Alıntı biçimi"><i class="wsn-ddi"></i><span class="wsn-ddt"></span>${ico('chevD', 'wsn-chev')}</button>
      <button type="button" class="wsn-dd" data-fly="delay" title="Gecikme">${ico('timer')}<span class="wsn-ddd"></span>${ico('chevD', 'wsn-chev')}</button></div>
    <div class="wsn-tools" hidden>
      <button type="button" data-tool="pen" title="Kalem">${ico('pen')}</button><button type="button" data-tool="hl" title="Vurgulayıcı">${ico('highlighter')}</button><button type="button" data-tool="eraser" title="Silgi">${ico('eraser')}</button>
      <span class="wsn-cols" hidden>${COLORS.map(([c, n]) => `<button type="button" data-col="${c}" title="${n}" style="--c:${c}"></button>`).join('')}</span>
      <i class="wsn-sep"></i><button type="button" data-act="undo" title="Geri al">${ico('undo')}</button><button type="button" data-act="redo" title="Yinele">${ico('redo')}</button>
      <span class="wsn-grow"></span><button type="button" data-act="copy" title="Kopyala">${ico('copy')}</button><button type="button" data-act="save" title="Kaydet">${ico('save')}</button></div>
    <div class="wsn-stage"></div>`;
  const $ = (q) => body.querySelector(q);
  const stage = $('.wsn-stage');

  const render = () => {
    const [, mlabel, micon] = MODES.find((m) => m[0] === st.mode);
    $('.wsn-ddi').innerHTML = ico(micon);
    $('.wsn-ddt').textContent = mlabel;
    $('.wsn-ddd').textContent = st.delay ? st.delay + ' sn' : '';
    $('.wsn-tools').hidden = !cv;
    body.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === st.tool));
    $('.wsn-cols').hidden = !(st.tool === 'pen' || st.tool === 'hl');
    body.querySelectorAll('[data-col]').forEach((b) => b.classList.toggle('on', b.dataset.col === st.color));
    body.querySelector('[data-act="undo"]').disabled = !st.undo.length;
    body.querySelector('[data-act="redo"]').disabled = !st.redo.length;
    if (!cv) stage.innerHTML = `<div class="wsn-empty"><div class="wsn-big">${ico('rect')}</div><p><b>Yeni</b> düğmesine tıklayın, sonra ekranda almak istediğiniz yeri seçin.</p><small>Klavyeyle: ${ico('winlogo')} Windows tuşu + Shift + S</small></div>`;
  };

  // ---- Alıntıyı düzenleyiciye al ----
  const copyCanvas = (c) => { const n = document.createElement('canvas'); n.width = c.width; n.height = c.height; n.getContext('2d').drawImage(c, 0, 0); return n; };
  const load = (src) => {
    st.src = src;
    orig = copyCanvas(src);
    cv = copyCanvas(src);
    st.undo = []; st.redo = []; st.tool = null;
    cv.className = 'wsn-cv';
    stage.innerHTML = '';
    stage.append(cv);
    render();
  };
  const sync = () => { if (desk.imageClip && desk.imageClip !== st.src) load(desk.imageClip); else render(); };

  // ---- Çizim araçları ----
  let drawing = null;
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  const stroke = (g, pts, s) => {
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (s.tool === 'eraser') { g.strokeStyle = g.createPattern(orig, 'no-repeat'); g.lineWidth = 16; g.globalAlpha = 1; }
    else if (s.tool === 'hl') { g.strokeStyle = s.color; g.lineWidth = 16; g.globalAlpha = 0.4; g.lineCap = 'butt'; }
    else { g.strokeStyle = s.color; g.lineWidth = 3; g.globalAlpha = 1; }
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) g.lineTo(p[0], p[1]);
    if (pts.length === 1) g.lineTo(pts[0][0] + 0.01, pts[0][1]);
    g.stroke();
    g.globalAlpha = 1;
  };
  stage.addEventListener('pointerdown', (e) => {
    if (!cv || e.target !== cv || !st.tool) return;
    cv.setPointerCapture(e.pointerId);
    st.undo.push(copyCanvas(cv)); if (st.undo.length > 20) st.undo.shift();
    st.redo = [];
    drawing = { pts: [pos(e)], snap: copyCanvas(cv) };
    stroke(cv.getContext('2d'), drawing.pts, st);
    e.preventDefault();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    drawing.pts.push(pos(e));
    const g = cv.getContext('2d');
    if (st.tool === 'eraser') stroke(g, drawing.pts.slice(-2), st);
    else { g.clearRect(0, 0, cv.width, cv.height); g.drawImage(drawing.snap, 0, 0); stroke(g, drawing.pts, st); }
  });
  const endDraw = () => { if (!drawing) return; drawing = null; render(); emit('snip-draw', { tool: st.tool }); };
  stage.addEventListener('pointerup', endDraw);
  stage.addEventListener('pointercancel', endDraw);

  const startNew = () => {
    if (desk.snipping) return;
    emit('snip-new');
    desk.minimize(win, true);
    const go = () => captureScreen(desk, emit, st.mode);
    if (st.delay) { desk.toast('Ekran Alıntısı Aracı', `${st.delay} saniye sonra alıntı başlayacak. Almak istediğiniz ekranı hazırlayın.`, ico('timer'), st.delay * 1000); setTimeout(go, 350 + st.delay * 1000); } else setTimeout(go, 350);
  };

  const closeFly = () => { fly?.remove(); fly = null; };
  const openFly = (btn) => {
    const kind = btn.dataset.fly;
    const reopen = fly && fly.dataset.kind === kind;
    closeFly();
    if (reopen) return;
    const items = kind === 'mode' ? MODES.map(([k, l, i]) => [k, l, i]) : DELAYS.map(([k, l]) => [String(k), l, null]);
    const cur = kind === 'mode' ? st.mode : String(st.delay);
    fly = document.createElement('div');
    fly.className = 'wsn-fly';
    fly.dataset.kind = kind;
    fly.innerHTML = items.map(([k, l, i]) => `<button type="button" data-pick="${k}" class="${k === cur ? 'on' : ''}"><i class="wsn-fchk">${k === cur ? ico('check') : ''}</i>${i ? ico(i) : ''}<span>${l}</span></button>`).join('');
    fly.style.left = btn.offsetLeft + 'px';
    fly.style.top = btn.offsetTop + btn.offsetHeight + 2 + 'px';
    $('.wsn-top').append(fly);
  };
  const onDoc = (e) => { if (fly && !e.target.closest('.wsn-fly, [data-fly]')) closeFly(); };
  document.addEventListener('mousedown', onDoc);

  body.addEventListener('click', async (e) => {
    if (e.target.closest('.wsn-new')) { closeFly(); return startNew(); }
    const dd = e.target.closest('[data-fly]');
    if (dd) return openFly(dd);
    const pick = e.target.closest('[data-pick]');
    if (pick) {
      if (fly.dataset.kind === 'mode') st.mode = pick.dataset.pick; else st.delay = +pick.dataset.pick;
      closeFly(); render();
      return;
    }
    const tool = e.target.closest('[data-tool]');
    if (tool) { st.tool = st.tool === tool.dataset.tool ? null : tool.dataset.tool; cv?.classList.toggle('draw', !!st.tool); if (st.tool === 'hl' && st.color === '#111111') st.color = '#f7b500'; render(); return; }
    const col = e.target.closest('[data-col]');
    if (col) { st.color = col.dataset.col; render(); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act || !cv) return;
    if (act === 'undo' && st.undo.length) { st.redo.push(copyCanvas(cv)); const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); g.drawImage(st.undo.pop(), 0, 0); render(); }
    else if (act === 'redo' && st.redo.length) { st.undo.push(copyCanvas(cv)); const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); g.drawImage(st.redo.pop(), 0, 0); render(); }
    else if (act === 'copy') {
      desk.imageClip = st.src = copyCanvas(cv);
      desk.toast('Ekran alıntısı panoya kopyalandı', `<img class="to-img" src="${desk.imageClip.toDataURL()}" alt="">Paint'i açıp <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, ico('copy'), 6000).classList.add('wide');
      emit('snip-copy');
    } else if (act === 'save') {
      const r = await dialogs.file({ mode: 'save', fs: desk.fs.dialogApi(), folder: 'pictures', name: 'Ekran alıntısı.png', ext: '.png', typeLabel: 'PNG (*.png)' });
      if (!r) return;
      desk.fs.write(r.folder, r.name, cv.toDataURL());
      emit('save', { name: r.name, folder: r.folder, label: desk.fs.label(r.folder) });
    }
  });

  // Masaüstü ya da başka bir yol alıntı aldığında (Windows + Shift + S dahil): yeni alıntıyı göster
  const onSnip = () => { sync(); if (win.min) desk.restore(win, true); };
  sync();
  return { onSnip, onFs: () => {}, destroy: () => { document.removeEventListener('mousedown', onDoc); closeFly(); } };
}
