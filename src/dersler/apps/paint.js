// Paint: kalem, fırça, silgi, doldurma, metin, şekiller, renkler, geri al, kaydet/aç ve
// ekran alıntısını Ctrl+V ile yapıştırma.
import { esc, pictureURL } from './util.js';

const TOOLS = [['pencil', '✏', 'Kalem'], ['brush', '🖌', 'Fırça'], ['eraser', '🧽', 'Silgi'], ['fill', '🪣', 'Doldur'], ['text', 'A', 'Metin'], ['line', '╱', 'Çizgi'], ['rect', '▭', 'Dikdörtgen'], ['ellipse', '◯', 'Elips']];
export const COLORS = [['#000000', 'Siyah'], ['#7f7f7f', 'Gri'], ['#ffffff', 'Beyaz'], ['#e53935', 'Kırmızı'], ['#fb8c00', 'Turuncu'], ['#fdd835', 'Sarı'], ['#43a047', 'Yeşil'], ['#00acc1', 'Turkuaz'], ['#1e88e5', 'Mavi'], ['#3949ab', 'Lacivert'], ['#8e24aa', 'Mor'], ['#d81b60', 'Pembe'], ['#6d4c41', 'Kahverengi']];
const SIZES = [[2, 'İnce'], [6, 'Orta'], [14, 'Kalın']];
const W = 640, H = 400;

export function paint({ desk, body, args, emit, setTitle, dialogs }) {
  body.classList.add('pt');
  body.tabIndex = 0;
  body.innerHTML = `
    <div class="pt-rib">
      <div class="pt-grp"><button type="button" data-f="save" title="Kaydet (Ctrl+S)">💾</button><button type="button" data-f="open" title="Aç (Ctrl+O)">📂</button><button type="button" data-f="undo" title="Geri al (Ctrl+Z)">↶</button><button type="button" data-f="redo" title="Yinele (Ctrl+Y)">↷</button><button type="button" data-f="paste" title="Yapıştır (Ctrl+V)">📋</button><small>Dosya</small></div>
      <div class="pt-grp pt-tools">${TOOLS.map(([id, ic, l]) => `<button type="button" data-tool="${id}" title="${l}">${ic}<span>${l}</span></button>`).join('')}<small>Araçlar ve şekiller</small></div>
      <div class="pt-grp">${SIZES.map(([s, l]) => `<button type="button" data-size="${s}" title="${l}"><i style="height:${Math.max(2, s / 2)}px"></i>${l}</button>`).join('')}<small>Kalınlık</small></div>
      <div class="pt-grp"><span class="pt-cur" title="Seçili renk"></span><div class="pt-pal">${COLORS.map(([c, n]) => `<button type="button" data-color="${c}" title="${n}" style="background:${c}"></button>`).join('')}</div><small>Renkler</small></div>
    </div>
    <div class="pt-area"><div class="pt-wrap"><canvas class="pt-cv" width="${W}" height="${H}"></canvas><canvas class="pt-ov" width="${W}" height="${H}"></canvas></div></div>
    <div class="pt-status"><span class="pt-pos"></span><span class="pt-dim"></span></div>`;
  const $ = (s) => body.querySelector(s);
  const cv = $('.pt-cv'), ov = $('.pt-ov');
  const g = cv.getContext('2d', { willReadFrequently: true }), go = ov.getContext('2d');
  let tool = 'pencil', color = '#000000', size = 6, fileName = null, folder = 'pictures', dirty = false;
  const undo = [], redo = [];
  const fsApi = desk.fs.dialogApi();

  const clear = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); };
  clear();

  const title = () => setTitle(`${dirty ? '*' : ''}${fileName ? fileName.replace(/\.[^.]+$/, '') : 'Adsız'} - Paint`);
  const ui = () => {
    body.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === tool));
    body.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('on', +b.dataset.size === size));
    body.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('on', b.dataset.color === color));
    $('.pt-cur').style.background = color;
    $('.pt-dim').textContent = `${cv.width} × ${cv.height} piksel`;
    ov.style.cursor = tool === 'text' ? 'text' : tool === 'fill' ? 'cell' : 'crosshair';
  };
  const snap = () => { undo.push(g.getImageData(0, 0, cv.width, cv.height)); if (undo.length > 30) undo.shift(); redo.length = 0; };
  const restoreImg = (img) => {
    if (img.width !== cv.width || img.height !== cv.height) resize(img.width, img.height, false);
    g.putImageData(img, 0, 0);
  };
  const changed = () => { dirty = true; title(); };
  function resize(w, h, keep = true) {
    const old = keep ? g.getImageData(0, 0, cv.width, cv.height) : null;
    cv.width = ov.width = w; cv.height = ov.height = h;
    clear();
    if (old) g.putImageData(old, 0, 0);
    ui();
  }

  const pos = (e) => {
    const r = ov.getBoundingClientRect();
    return { x: Math.round((e.clientX - r.left) * cv.width / r.width), y: Math.round((e.clientY - r.top) * cv.height / r.height) };
  };

  function stroke(a, b, w, c) {
    g.strokeStyle = c; g.lineWidth = w; g.lineCap = g.lineJoin = 'round';
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  }

  function shape(ctx, kind, a, b) {
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round';
    ctx.beginPath();
    if (kind === 'line') { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
    if (kind === 'rect') ctx.rect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    if (kind === 'ellipse') ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function flood(x, y, hex) {
    const img = g.getImageData(0, 0, cv.width, cv.height), d = img.data, w = cv.width, h = cv.height;
    const i0 = (y * w + x) * 4;
    const t = [d[i0], d[i0 + 1], d[i0 + 2]];
    const f = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    if (Math.abs(t[0] - f[0]) + Math.abs(t[1] - f[1]) + Math.abs(t[2] - f[2]) < 10) return 0;
    const near = (i) => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) < 90;
    const st = [[x, y]];
    let n = 0;
    while (st.length) {
      const [px, py] = st.pop();
      let lx = px;
      while (lx >= 0 && near((py * w + lx) * 4)) lx--;
      lx++;
      let up = false, dn = false;
      for (let cx = lx; cx < w && near((py * w + cx) * 4); cx++) {
        const i = (py * w + cx) * 4;
        d[i] = f[0]; d[i + 1] = f[1]; d[i + 2] = f[2]; d[i + 3] = 255; n++;
        if (py > 0) { const u = near(((py - 1) * w + cx) * 4); if (u && !up) st.push([cx, py - 1]); up = u; }
        if (py < h - 1) { const v = near(((py + 1) * w + cx) * 4); if (v && !dn) st.push([cx, py + 1]); dn = v; }
      }
    }
    g.putImageData(img, 0, 0);
    return n;
  }

  function textAt(p) {
    const wrap = $('.pt-wrap');
    const inp = document.createElement('input');
    inp.className = 'pt-text';
    const r = ov.getBoundingClientRect();
    const k = r.width / cv.width;
    const px = Math.max(16, size * 3);
    Object.assign(inp.style, { left: p.x * k + 'px', top: p.y * k + 'px', color, fontSize: px * k + 'px' });
    inp.placeholder = 'Yazın, bitince Enter';
    wrap.append(inp);
    setTimeout(() => inp.focus(), 0);
    let done = false;
    const commit = () => {
      if (done) return;
      done = true;
      const t = inp.value.trim();
      inp.remove();
      if (!t) return;
      snap();
      g.fillStyle = color; g.font = `${px}px "Segoe UI", sans-serif`; g.textBaseline = 'top';
      g.fillText(t, p.x, p.y);
      changed();
      emit('paint-text', { text: t, color });
      body.focus({ preventScroll: true });
    };
    inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') commit(); if (e.key === 'Escape') { done = true; inp.remove(); } });
    inp.addEventListener('blur', commit);
  }

  ov.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const a = pos(e);
    if (tool === 'fill') { snap(); const n = flood(a.x, a.y, color); if (n) { changed(); emit('paint-fill', { color, colorName: colorName(color), pixels: n }); } else undo.pop(); return; }
    if (tool === 'text') { e.preventDefault(); textAt(a); return; }
    ov.setPointerCapture(e.pointerId);
    snap();
    let last = a, len = 0;
    const freehand = ['pencil', 'brush', 'eraser'].includes(tool);
    const w = tool === 'pencil' ? Math.max(1, size / 2) : tool === 'eraser' ? size * 2.5 : size * 1.6;
    const c = tool === 'eraser' ? '#ffffff' : color;
    if (freehand) stroke(a, a, w, c);
    const move = (ev) => {
      const b = pos(ev);
      if (freehand) { stroke(last, b, w, c); len += Math.hypot(b.x - last.x, b.y - last.y); last = b; }
      else { go.clearRect(0, 0, ov.width, ov.height); shape(go, tool, a, b); last = b; }
      $('.pt-pos').textContent = `${b.x}, ${b.y} px`;
    };
    const up = () => {
      ov.removeEventListener('pointermove', move);
      ov.removeEventListener('pointerup', up);
      if (freehand) {
        if (len < 3 && tool !== 'eraser') { /* tek nokta da olur */ }
        changed();
        emit('paint-draw', { tool, color, colorName: colorName(color), len: Math.round(len), size });
      } else {
        go.clearRect(0, 0, ov.width, ov.height);
        const bw = Math.abs(last.x - a.x), bh = Math.abs(last.y - a.y);
        if (bw + bh < 6) { undo.pop(); return; }
        shape(g, tool, a, last);
        changed();
        emit('paint-shape', { shape: tool, w: bw, h: bh, color, colorName: colorName(color) });
      }
    };
    ov.addEventListener('pointermove', move);
    ov.addEventListener('pointerup', up);
  });
  ov.addEventListener('pointermove', (e) => { const p = pos(e); $('.pt-pos').textContent = `${p.x}, ${p.y} px`; });

  function doUndo() {
    if (!undo.length) return;
    redo.push(g.getImageData(0, 0, cv.width, cv.height));
    restoreImg(undo.pop());
    changed();
    emit('paint-undo');
  }
  function doRedo() {
    if (!redo.length) return;
    undo.push(g.getImageData(0, 0, cv.width, cv.height));
    restoreImg(redo.pop());
    changed();
    emit('paint-redo');
  }

  function pasteImage() {
    const img = desk.imageClip;
    if (!img) { desk.toast('Pano boş', 'Yapıştırılacak bir resim yok. Önce Ekran Alıntısı ile bir resim alın.', '📋'); emit('nothing', { what: 'paste' }); return; }
    snap();
    if (img.width > cv.width || img.height > cv.height) resize(Math.max(cv.width, img.width), Math.max(cv.height, img.height));
    g.drawImage(img, 0, 0);
    changed();
    emit('paint-paste', { w: img.width, h: img.height });
  }

  async function save(asNew) {
    if (dialogs.busy) return false;
    if (!fileName || asNew) {
      const r = await dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || '', ext: '.png', typeLabel: 'PNG (*.png)' });
      body.focus({ preventScroll: true });
      if (!r) return false;
      fileName = r.name; folder = r.folder;
    }
    desk.fs.write(folder, fileName, cv.toDataURL('image/png'));
    dirty = false;
    title();
    emit('save', { name: fileName, folder, label: desk.fs.label(folder) });
    return true;
  }

  async function openPic() {
    if (dialogs.busy || !(await confirmClose())) return;
    const r = await dialogs.file({ mode: 'open', fs: fsApi, folder: 'pictures', ext: '.png', accept: /\.(png|jpe?g)$/i, typeLabel: 'Resimler (*.png; *.jpg)' });
    body.focus({ preventScroll: true });
    if (!r) return;
    load(desk.fs.dialogApi().read(r.folder, r.name), r.name, r.folder);
    emit('open', { name: r.name, folder: r.folder });
  }

  function load(content, name, fold) {
    const im = new Image();
    im.onload = () => {
      resize(Math.min(1200, im.width), Math.min(900, im.height), false);
      g.drawImage(im, 0, 0);
      undo.length = redo.length = 0;
    };
    im.src = pictureURL(content);
    fileName = name; folder = fold; dirty = false;
    title();
  }

  async function confirmClose() {
    if (!dirty) return true;
    const a = await dialogs.ask({ title: 'Paint', text: `<b>${esc(fileName || 'Adsız')}</b> resmindeki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['discard', 'Kaydetme'], ['cancel', 'İptal']] });
    emit('ask', { answer: a || 'cancel' });
    if (a === 'save') return save(false);
    return a === 'discard';
  }

  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tool]'), c = e.target.closest('[data-color]'), s = e.target.closest('[data-size]'), f = e.target.closest('[data-f]');
    if (t) { tool = t.dataset.tool; ui(); emit('paint-tool', { tool, name: t.title }); }
    if (c) { color = c.dataset.color; ui(); emit('paint-color', { color, colorName: colorName(color) }); }
    if (s) { size = +s.dataset.size; ui(); emit('paint-size', { size, name: s.title }); }
    if (f) ({ save: () => save(false), open: openPic, undo: doUndo, redo: doRedo, paste: pasteImage })[f.dataset.f]();
  });
  body.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.target.closest('input')) return;
    const k = { KeyZ: doUndo, KeyY: doRedo, KeyV: pasteImage, KeyO: openPic, KeyS: () => save(e.shiftKey) }[e.code];
    if (k) { e.preventDefault(); k(); }
  });
  // Klavye kısayolları için odak Paint'te kalsın; ama metin aracıyla açılan yazı kutusunun odağını çalmasın
  body.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input') || (tool === 'text' && e.target === ov)) return;
    setTimeout(() => body.focus({ preventScroll: true }), 0);
  });

  if (args.node) { const n = desk.fs.get(args.node); if (n) load(n.content, n.name, n.parent); }
  ui();
  title();
  return {
    confirmClose,
    focus: () => { if (!body.querySelector('.pt-text')) body.focus({ preventScroll: true }); },
    get dirty() { return dirty; },
    get tool() { return tool; },
    get color() { return color; },
  };
}

export const colorName = (c) => COLORS.find(([x]) => x === c)?.[1] || c;
