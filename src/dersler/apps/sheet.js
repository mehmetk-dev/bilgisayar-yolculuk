// Hesap Tablosu: Excel benzeri çalışma sayfası. Hücre seçme ve yazma, formüller (+ − * / ^, TOPLA, ORTALAMA, MAK, MİN,
// SAY), otomatik toplam, kalın ve para biçimi, sıralama, sütun grafiği; .xlsx olarak kaydetme, açma, yazdırma.
// Türkçe Excel gibi: ondalık ayırıcı virgül, işlev bağımsız değişkenleri noktalı virgülle ayrılır.
import { esc } from './util.js';

const COLS = 'ABCDEFGH';
const ROWS = 20;
export const addr = (r, c) => COLS[c] + (r + 1);
export function parseAddr(a) {
  const m = /^([A-H])(\d{1,2})$/.exec(String(a).toUpperCase());
  if (!m || +m[2] < 1 || +m[2] > ROWS) return null;
  return { r: +m[2] - 1, c: COLS.indexOf(m[1]) };
}

// "1.250,50", "12,5", "750", "300 TL" → sayı; değilse null
export function parseNumber(s) {
  let t = String(s).trim().replace(/\s*(₺|TL)$/i, '');
  if (!t) return null;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d+(,\d+)?$/.test(t)) t = t.replace(',', '.');
  else if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = parseFloat(t);
  return isFinite(n) ? n : null;
}

class FErr extends Error {}
const FUNCS = {
  TOPLA: (v) => v.reduce((a, b) => a + b, 0),
  ORTALAMA: (v) => { if (!v.length) throw new FErr('#BÖL/0!'); return v.reduce((a, b) => a + b, 0) / v.length; },
  MAK: (v) => (v.length ? Math.max(...v) : 0),
  'MİN': (v) => (v.length ? Math.min(...v) : 0),
  SAY: (v) => v.length,
};
const ALIAS = { SUM: 'TOPLA', AVERAGE: 'ORTALAMA', MAX: 'MAK', MIN: 'MİN', COUNT: 'SAY', MIN_TR: 'MİN' };

// Formül değerlendirici: get(addr) hücrenin değerini verir (sayı, yazı ya da hata fırlatır)
function evaluate(src, get) {
  const re = /\s*(?:(\d+(?:,\d+)?)|([A-Za-zÇĞİÖŞÜçğıöşü]+\d*)|(.))/y;
  const toks = [];
  let m;
  re.lastIndex = 0;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) toks.push({ t: 'num', v: parseFloat(m[1].replace(',', '.')) });
    else if (m[2]) toks.push({ t: 'id', v: m[2].toLocaleUpperCase('tr') });
    else if (m[3].trim()) toks.push({ t: 'op', v: m[3] });
  }
  let i = 0;
  const peek = () => toks[i], eat = (v) => { if (toks[i]?.v === v) { i++; return true; } return false; };
  const num = (x) => {
    if (typeof x === 'number') return x;
    if (x === '' || x == null) return 0;
    const n = parseNumber(x);
    if (n === null) throw new FErr('#DEĞER!');
    return n;
  };
  function range(a, b) {
    const p = parseAddr(a), q = parseAddr(b);
    if (!p || !q) throw new FErr('#BAŞV!');
    const out = [];
    for (let r = Math.min(p.r, q.r); r <= Math.max(p.r, q.r); r++) for (let c = Math.min(p.c, q.c); c <= Math.max(p.c, q.c); c++) out.push(get(addr(r, c)));
    return out;
  }
  function primary() {
    const t = toks[i++];
    if (!t) throw new FErr('#DEĞER!');
    if (t.t === 'num') return t.v;
    if (t.t === 'op' && t.v === '(') { const v = expr(); if (!eat(')')) throw new FErr('#DEĞER!'); return v; }
    if (t.t === 'id') {
      if (peek()?.v === '(') {
        i++;
        const name = ALIAS[t.v] || t.v;
        const fn = FUNCS[name];
        if (!fn) throw new FErr('#AD?');
        const vals = [];
        if (!eat(')')) {
          do {
            if (toks[i]?.t === 'id' && toks[i + 1]?.v === ':') { const a = toks[i].v; i += 2; const b = toks[i++]?.v; vals.push(...range(a, b).filter((x) => typeof x === 'number')); }
            else { const v = expr(); vals.push(typeof v === 'number' ? v : num(v)); }
          } while (eat(';') || eat(','));
          if (!eat(')')) throw new FErr('#DEĞER!');
        }
        return fn(vals);
      }
      if (!parseAddr(t.v)) throw new FErr('#AD?');
      return get(t.v);
    }
    throw new FErr('#DEĞER!');
  }
  function unary() {
    if (eat('-')) return -num(unary());
    if (eat('+')) return num(unary());
    let v = primary();
    if (eat('%')) v = num(v) / 100;
    return v;
  }
  function power() { let v = unary(); while (eat('^')) v = num(v) ** num(unary()); return v; }
  function term() {
    let v = power();
    for (;;) {
      if (eat('*')) v = num(v) * num(power());
      else if (eat('/')) { const d = num(power()); if (d === 0) throw new FErr('#BÖL/0!'); v = num(v) / d; }
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat('+')) v = num(v) + num(term());
      else if (eat('-')) v = num(v) - num(term());
      else if (eat('&')) v = String(v) + String(term());
      else return v;
    }
  }
  const v = expr();
  if (i < toks.length) throw new FErr('#DEĞER!');
  return v;
}

const fmtNum = (n, f) => {
  if (f === 'tl') return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
  if (f === 'pct') return (n * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + '%';
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 6, useGrouping: Math.abs(n) >= 10000 });
};

export function sheet({ desk, body, args, emit, setTitle }) {
  body.classList.add('xl');
  body.innerHTML = `
    <div class="xl-tabs"><button type="button" class="xl-file">Dosya</button><span>Giriş</span></div>
    <div class="xl-rib">
      <button type="button" data-act="bold" title="Kalın (Ctrl + B)"><b>K</b></button>
      <button type="button" data-act="tl" title="Para birimi biçimi">₺</button><button type="button" data-act="pct" title="Yüzde biçimi">%</button><button type="button" data-act="plain" title="Genel biçim (biçimi kaldır)">123</button>
      <span class="xl-sep"></span><button type="button" data-act="sum" title="Otomatik Toplam">∑ Otomatik Toplam</button>
      <span class="xl-sep"></span><button type="button" data-act="asc" title="Küçükten büyüğe sırala">↑ A→Z</button><button type="button" data-act="desc" title="Büyükten küçüğe sırala">↓ Z→A</button>
      <span class="xl-sep"></span><button type="button" data-act="chart" title="Seçili alandan sütun grafiği">📊 Grafik</button>
    </div>
    <div class="xl-menu" hidden><button type="button" data-file="new">📄 Yeni</button><button type="button" data-file="open">📂 Aç…</button><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button></div>
    <div class="xl-bar"><input class="xl-name" readonly aria-label="Ad kutusu"><span class="xl-fx">fx</span><input class="xl-formula" spellcheck="false" autocomplete="off" aria-label="Formül çubuğu"></div>
    <div class="xl-wrap" tabindex="0"><table class="xl-grid"><thead><tr><th class="xl-corner"></th>${[...COLS].map((c) => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${Array.from({ length: ROWS }, (_, r) => `<tr><th>${r + 1}</th>${[...COLS].map((_, c) => `<td data-a="${addr(r, c)}"></td>`).join('')}</tr>`).join('')}</tbody></table>
      <div class="xl-chart" hidden></div></div>
    <div class="xl-status"><span class="xl-stat"></span><span>Sayfa1</span></div>`;
  const $ = (s) => body.querySelector(s);
  const wrap = $('.xl-wrap'), fbar = $('.xl-formula');
  let cells = {}, fmt = {}, fileName = null, folder = 'docs', dirty = false;
  let act = { r: 0, c: 0 }, anchor = { r: 0, c: 0 }; // seçim: anchor'dan act'e dikdörtgen
  let editing = null; // { input, enterMode }
  let chart = null; // { range }

  const sel = () => ({ r1: Math.min(anchor.r, act.r), c1: Math.min(anchor.c, act.c), r2: Math.max(anchor.r, act.r), c2: Math.max(anchor.c, act.c) });
  const selAddr = () => { const s = sel(); return s.r1 === s.r2 && s.c1 === s.c2 ? addr(s.r1, s.c1) : `${addr(s.r1, s.c1)}:${addr(s.r2, s.c2)}`; };
  const td = (a) => body.querySelector(`td[data-a="${a}"]`);

  // Hücre değeri: formüllerde döngüye karşı korumalı
  function value(a, seen = new Set()) {
    const raw = cells[a];
    if (raw == null || raw === '') return '';
    if (!raw.startsWith('=')) { const n = parseNumber(raw); return n === null ? raw : n; }
    if (seen.has(a)) throw new FErr('#BAŞV!');
    seen.add(a);
    try { return evaluate(raw.slice(1), (b) => value(b, seen)); } finally { seen.delete(a); }
  }
  function show(a) {
    try { const v = value(a); return { v, text: typeof v === 'number' ? fmtNum(v, fmt[a]?.f) : String(v) }; }
    catch (e) { return { v: null, err: true, text: e instanceof FErr ? e.message : '#DEĞER!' }; }
  }

  function render() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS.length; c++) {
      const a = addr(r, c), el = td(a), s = show(a);
      el.textContent = s.text;
      el.classList.toggle('num', typeof s.v === 'number' || !!s.err);
      el.classList.toggle('err', !!s.err);
      el.classList.toggle('b', !!fmt[a]?.b);
    }
    paintSel();
    setTitle(`${dirty ? '*' : ''}${fileName || 'Kitap1'} - Hesap Tablosu`);
  }
  function paintSel() {
    const s = sel();
    body.querySelectorAll('td.sel, td.act, th.hl').forEach((x) => x.classList.remove('sel', 'act', 'hl'));
    for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) td(addr(r, c)).classList.add('sel');
    td(addr(act.r, act.c)).classList.add('act');
    body.querySelectorAll('thead th')[act.c + 1].classList.add('hl');
    body.querySelectorAll('tbody th')[act.r].classList.add('hl');
    $('.xl-name').value = addr(act.r, act.c);
    if (!editing) fbar.value = cells[addr(act.r, act.c)] || '';
    // Seçili sayılar için durum çubuğunda toplam ve ortalama (Excel'deki gibi)
    const nums = [];
    for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) { const v = show(addr(r, c)).v; if (typeof v === 'number') nums.push(v); }
    $('.xl-stat').textContent = nums.length > 1 ? `Ortalama: ${fmtNum(nums.reduce((a, b) => a + b, 0) / nums.length)}   Sayı: ${nums.length}   Toplam: ${fmtNum(nums.reduce((a, b) => a + b, 0))}` : 'Hazır';
    td(addr(act.r, act.c)).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function select(r, c, extend = false) {
    act = { r: Math.max(0, Math.min(ROWS - 1, r)), c: Math.max(0, Math.min(COLS.length - 1, c)) };
    if (!extend) anchor = { ...act };
    paintSel();
    emit('xl-select', { addr: addr(act.r, act.c), range: selAddr() });
  }

  function setCell(a, raw) {
    raw = raw.trim();
    if (raw) cells[a] = raw; else delete cells[a];
    dirty = true;
    render();
    const s = show(a);
    emit('xl-edit', { addr: a, raw, value: s.v, text: s.text, error: s.err ? s.text : null });
    if (chart) drawChart();
  }

  // ---- Düzenleme ----
  function startEdit(initial = null, enterMode = true) {
    if (editing) return;
    const a = addr(act.r, act.c), el = td(a);
    const inp = document.createElement('input');
    inp.className = 'xl-in';
    inp.spellcheck = false;
    inp.value = initial ?? (cells[a] || '');
    el.textContent = '';
    el.append(inp);
    editing = { input: inp, enterMode, a };
    inp.focus();
    inp.setSelectionRange(inp.value.length, inp.value.length);
    inp.addEventListener('input', () => { fbar.value = inp.value; });
  }
  function commit(dr = 0, dc = 0) {
    if (!editing) return;
    const { input, a } = editing;
    editing = null;
    input.remove();
    setCell(a, input.value);
    select(act.r + dr, act.c + dc);
    wrap.focus({ preventScroll: true });
  }
  function cancel() { if (!editing) return; editing.input.remove(); editing = null; render(); wrap.focus({ preventScroll: true }); }

  // ---- Komutlar ----
  function eachSel(fn) { const s = sel(); for (let r = s.r1; r <= s.r2; r++) for (let c = s.c1; c <= s.c2; c++) fn(addr(r, c), r, c); }
  function format(kind) {
    if (kind === 'bold') { let all = true; eachSel((a) => { if (!fmt[a]?.b) all = false; }); eachSel((a) => { (fmt[a] ||= {}).b = !all; }); }
    else eachSel((a) => { (fmt[a] ||= {}).f = kind === 'plain' ? undefined : kind; });
    dirty = true;
    render();
    emit('xl-format', { kind, range: selAddr() });
  }
  function autosum() {
    // Etkin hücrenin üstündeki (yoksa solundaki) sayıları toplar: Excel'deki ∑ düğmesi gibi
    const isNum = (r, c) => r >= 0 && c >= 0 && typeof show(addr(r, c)).v === 'number' && !(cells[addr(r, c)] || '').startsWith('=');
    let f = null;
    let r = act.r - 1;
    while (isNum(r, act.c)) r--;
    if (r < act.r - 1) f = `=TOPLA(${addr(r + 1, act.c)}:${addr(act.r - 1, act.c)})`;
    else {
      let c = act.c - 1;
      while (isNum(act.r, c)) c--;
      if (c < act.c - 1) f = `=TOPLA(${addr(act.r, c + 1)}:${addr(act.r, act.c - 1)})`;
    }
    if (!f) { desk.toast('Otomatik Toplam', 'Toplanacak sayı bulunamadı. Sayıların hemen altındaki boş hücreye tıklayın.', '∑'); return; }
    const a = addr(act.r, act.c);
    setCell(a, f);
    emit('xl-autosum', { addr: a, formula: f });
  }
  function sort(desc) {
    // Etkin sütuna göre, başlık satırının altındaki veri satırlarını sıralar. Formül içeren satırda (ör. Toplam) durur.
    const s = sel();
    const lastCol = (r) => { let c = COLS.length - 1; while (c >= 0 && !cells[addr(r, c)]) c--; return c; };
    let r1 = s.r1 === s.r2 ? 1 : s.r1, r2 = s.r1 === s.r2 ? r1 : s.r2;
    if (s.r1 === s.r2) {
      const row = (r) => [...COLS].some((_, c) => cells[addr(r, c)]);
      const formulaRow = (r) => [...COLS].some((_, c) => (cells[addr(r, c)] || '').startsWith('='));
      while (r2 + 1 < ROWS && row(r2 + 1) && !formulaRow(r2 + 1)) r2++;
    }
    const c2 = s.c1 === s.c2 ? Math.max(...Array.from({ length: r2 - r1 + 1 }, (_, k) => lastCol(r1 + k))) : s.c2;
    const c1 = s.c1 === s.c2 ? 0 : s.c1;
    const rows = Array.from({ length: r2 - r1 + 1 }, (_, k) => Array.from({ length: c2 - c1 + 1 }, (__, j) => [cells[addr(r1 + k, c1 + j)], fmt[addr(r1 + k, c1 + j)]]));
    const key = act.c - c1;
    const val = (row) => { const v = row[key]?.[0]; const n = parseNumber(v ?? ''); return n ?? (v || ''); };
    rows.sort((a, b) => { const x = val(a), y = val(b); const o = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'tr'); return desc ? -o : o; });
    rows.forEach((row, k) => row.forEach(([raw, f], j) => { const a = addr(r1 + k, c1 + j); if (raw) cells[a] = raw; else delete cells[a]; if (f) fmt[a] = f; else delete fmt[a]; }));
    dirty = true;
    render();
    emit('xl-sort', { desc, col: COLS[act.c], from: addr(r1, c1), to: addr(r2, c2) });
  }
  function drawChart() {
    const s = chart;
    const labels = [], vals = [];
    for (let r = s.r1; r <= s.r2; r++) {
      const nums = []; let lab = '';
      for (let c = s.c1; c <= s.c2; c++) { const v = show(addr(r, c)).v; if (typeof v === 'number') nums.push(v); else if (v && !lab) lab = String(v); }
      if (nums.length) { labels.push(lab || String(r + 1)); vals.push(nums[0]); }
    }
    const el = $('.xl-chart');
    if (!vals.length) { el.hidden = true; return false; }
    const max = Math.max(...vals, 0) || 1, W = 360, H = 200, bw = W / vals.length;
    el.hidden = false;
    el.innerHTML = `<div class="xl-ch-h"><b>Grafik</b><button type="button" class="xl-ch-x" title="Grafiği kaldır">✕</button></div>
      <svg viewBox="0 0 ${W} ${H + 40}" role="img" aria-label="Sütun grafiği">${vals.map((v, k) => {
        const h = Math.max(0, v / max * H), x = k * bw + bw * 0.15, w = bw * 0.7;
        return `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" rx="3" fill="#2e7d32"><title>${esc(labels[k])}: ${fmtNum(v)}</title></rect>
          <text x="${x + w / 2}" y="${H - h - 4}" text-anchor="middle" font-size="11">${fmtNum(v)}</text>
          <text x="${x + w / 2}" y="${H + 16}" text-anchor="middle" font-size="12">${esc(labels[k].slice(0, 12))}</text>`;
      }).join('')}<line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#888"/></svg>`;
    return true;
  }

  // ---- Dosya ----
  const fsApi = desk.fs.dialogApi();
  function load(data, name = null, fld = folder) {
    cells = { ...(data?.cells || {}) }; fmt = structuredClone(data?.fmt || {});
    fileName = name; folder = fld; dirty = false; chart = null;
    $('.xl-chart').hidden = true;
    anchor = act = { r: 0, c: 0 };
    render();
  }
  async function save(asNew) {
    if (desk.dialogs.busy) return false;
    let r = fileName && !asNew ? { folder, name: fileName } : await desk.dialogs.file({ mode: 'save', fs: fsApi, folder, name: fileName || 'Kitap1.xlsx', ext: '.xlsx', typeLabel: 'Excel Çalışma Kitabı (*.xlsx)' });
    wrap.focus({ preventScroll: true });
    if (!r) return false;
    desk.fs.write(r.folder, r.name, { cells: { ...cells }, fmt: structuredClone(fmt) });
    const quick = !!fileName && !asNew;
    fileName = r.name; folder = r.folder; dirty = false;
    render();
    if (quick) desk.toast('Kaydedildi', esc(fileName), '💾', 2500);
    emit('xl-save', { name: r.name, folder: r.folder, quick });
    return true;
  }
  async function confirmDiscard() {
    if (!dirty || !Object.keys(cells).length) return true;
    const a = await desk.dialogs.ask({ title: 'Hesap Tablosu', icon: '❓', text: `<b>${esc(fileName || 'Kitap1')}</b> dosyasındaki değişiklikleri kaydetmek istiyor musunuz?`, buttons: [['save', 'Kaydet', true], ['no', 'Kaydetme'], ['cancel', 'İptal']] });
    if (a === 'save') return save();
    return a === 'no';
  }
  async function fileCmd(c) {
    $('.xl-menu').hidden = true;
    if (c === 'save') return save();
    if (c === 'saveas') return save(true);
    if (c === 'new') { if (await confirmDiscard()) load(); return; }
    if (c === 'open') {
      if (!(await confirmDiscard())) return;
      const r = await desk.dialogs.file({ mode: 'open', fs: fsApi, folder, ext: '.xlsx', typeLabel: 'Excel dosyaları (*.xlsx)' });
      if (r) { load(desk.fs.find(r.folder, r.name)?.content, r.name, r.folder); emit('xl-open', { name: r.name }); }
      return;
    }
    if (c === 'print') {
      const r = await desk.dialogs.print({ printers: desk.settings.printers, doc: fileName || 'Kitap1' });
      if (r) { desk.toast('Yazdırılıyor', `“${esc(fileName || 'Kitap1')}” → ${esc(r.printer)}`, '🖨'); emit('xl-print', r); }
    }
  }

  // ---- Olaylar ----
  let dragging = false;
  wrap.addEventListener('mousedown', (e) => {
    const cell = e.target.closest('td[data-a]');
    if (!cell || e.target.classList.contains('xl-in')) return;
    e.preventDefault();
    if (editing) commit();
    const p = parseAddr(cell.dataset.a);
    select(p.r, p.c, e.shiftKey);
    dragging = true;
    wrap.focus({ preventScroll: true });
  });
  wrap.addEventListener('mouseover', (e) => {
    if (!dragging || !(e.buttons & 1)) { dragging = false; return; }
    const cell = e.target.closest('td[data-a]');
    if (cell) { const p = parseAddr(cell.dataset.a); act = p; paintSel(); }
  });
  addEventListener('mouseup', function up() {
    if (!body.isConnected) { removeEventListener('mouseup', up); return; }
    if (dragging) { dragging = false; emit('xl-select', { addr: addr(act.r, act.c), range: selAddr() }); }
  });
  wrap.addEventListener('dblclick', (e) => { if (e.target.closest('td[data-a]')) startEdit(null, false); });
  wrap.addEventListener('keydown', (e) => {
    const k = e.key;
    if (editing) {
      if (k === 'Enter') { e.preventDefault(); commit(e.shiftKey ? -1 : 1, 0); }
      else if (k === 'Tab') { e.preventDefault(); commit(0, e.shiftKey ? -1 : 1); }
      else if (k === 'Escape') { e.preventDefault(); cancel(); }
      else if (editing.enterMode && /^Arrow/.test(k)) { e.preventDefault(); commit(...{ ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k]); }
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.code === 'KeyB') { e.preventDefault(); format('bold'); }
      if (e.code === 'KeyS') { e.preventDefault(); save(e.shiftKey); }
      if (e.code === 'KeyP') { e.preventDefault(); fileCmd('print'); }
      if (e.code === 'KeyO') { e.preventDefault(); fileCmd('open'); }
      return;
    }
    const mv = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Enter: [1, 0], Tab: [0, 1] }[k];
    if (mv) { e.preventDefault(); const sh = e.shiftKey && k.startsWith('Arrow'); select(act.r + mv[0] * (k === 'Tab' && e.shiftKey ? -1 : 1), act.c + mv[1] * (k === 'Tab' && e.shiftKey ? -1 : 1), sh); return; }
    if (k === 'Delete' || k === 'Backspace') {
      e.preventDefault();
      if (k === 'Backspace') { startEdit(''); return; }
      eachSel((a) => { delete cells[a]; });
      dirty = true; render();
      emit('xl-edit', { addr: addr(act.r, act.c), raw: '', value: '', text: '', cleared: selAddr() });
      return;
    }
    if (k === 'F2') { e.preventDefault(); startEdit(null, false); return; }
    if (k.length === 1 && !e.altKey) { e.preventDefault(); startEdit(k); }
  });
  // Formül çubuğu: tıklayıp oradan da yazılabilir
  fbar.addEventListener('focus', () => { if (!editing) { startEdit(null, false); fbar.focus(); } });
  fbar.addEventListener('input', () => { if (editing) editing.input.value = fbar.value; });
  fbar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (editing) editing.input.value = fbar.value; commit(1, 0); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  body.addEventListener('mousedown', (e) => { if (!e.target.closest('.xl-menu, .xl-file')) $('.xl-menu').hidden = true; if (e.target.closest('.xl-rib button')) e.preventDefault(); });
  body.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.classList.contains('xl-file')) { $('.xl-menu').hidden = !$('.xl-menu').hidden; return; }
    if (t.dataset.file) return fileCmd(t.dataset.file);
    if (t.classList.contains('xl-ch-x')) { chart = null; $('.xl-chart').hidden = true; emit('xl-chart-remove'); return; }
    const a = t.dataset.act;
    if (!a) return;
    if (editing) commit(0, 0);
    if (a === 'sum') autosum();
    else if (a === 'asc' || a === 'desc') sort(a === 'desc');
    else if (a === 'chart') {
      const s = sel();
      if (s.r1 === s.r2 && s.c1 === s.c2) { desk.toast('Grafik', 'Önce grafiği çizilecek hücreleri fareyle sürükleyerek seçin (adlar ve sayılar).', '📊'); return; }
      chart = s;
      if (drawChart()) emit('xl-chart', { range: selAddr() });
      else { chart = null; desk.toast('Grafik', 'Seçili alanda sayı yok.', '📊'); }
    } else format(a);
    wrap.focus({ preventScroll: true });
  });

  const n = args.node && desk.fs.get(args.node);
  if (n) load(n.content, n.name, n.parent); else load(args.data);
  if (args.data && !n) dirty = false;

  return {
    // Derslerin kontrolü için
    cell: (a) => { const s = show(a); return { raw: cells[a] || '', value: s.v, text: s.text, bold: !!fmt[a]?.b, f: fmt[a]?.f || null }; },
    get chart() { return chart; },
    confirmClose: confirmDiscard,
    focus: () => { if (!desk.dialogs.busy && !editing) wrap.focus({ preventScroll: true }); },
  };
}
