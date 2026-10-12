// Hesap Tablosu: Excel benzeri çalışma sayfası. Hücre seçme ve yazma; formüller (+ − * / ^ & ve karşılaştırma,
// TOPLA, ORTALAMA, MAK, MİN, SAY, EĞER, EĞERSAY, ETOPLA, YUVARLA); göreli ve $ ile sabit başvuru; kopyala-yapıştır ve
// doldurma tutamacı; otomatik toplam; kalın, para ve yüzde biçimi; koşullu biçimlendirme; sıralama; filtre; sütun grafiği.
// Türkçe Excel gibi: ondalık ayırıcı virgül, işlev bağımsız değişkenleri noktalı virgülle ayrılır.
import { esc } from './util.js';

const COLS = 'ABCDEFGH';
const ROWS = 20;
export const addr = (r, c) => COLS[c] + (r + 1);
export function parseAddr(a) {
  const m = /^\$?([A-H])\$?(\d{1,2})$/.exec(String(a).toUpperCase());
  if (!m || +m[2] < 1 || +m[2] > ROWS) return null;
  return { r: +m[2] - 1, c: COLS.indexOf(m[1]) };
}

// "1.250,50", "12,5", "750", "300 TL", "%18" → sayı; değilse null
export function parseNumber(s) {
  let t = String(s).trim().replace(/\s*(₺|TL)$/i, '');
  let pct = false;
  if (/^%|%$/.test(t)) { pct = true; t = t.replace('%', '').trim(); }
  if (!t) return null;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d+(,\d+)?$/.test(t)) t = t.replace(',', '.');
  else if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = parseFloat(t);
  return isFinite(n) ? (pct ? n / 100 : n) : null;
}

// Formülü (dr, dc) kadar kaydırılmış bir hücreye kopyalarken başvuruları kaydırır; $ olan kısım sabit kalır
export function shiftFormula(f, dr, dc) {
  if (!f.startsWith('=')) return f;
  return f.split(/("[^"]*")/).map((part, i) => (i % 2 ? part : part.replace(/(?<![A-Za-zÇĞİÖŞÜçğıöşü$])(\$?)([A-Ha-h])(\$?)(\d{1,2})(?![\d(A-Za-zÇĞİÖŞÜçğıöşü])/g, (all, d1, col, d2, row) => {
    const c = d1 ? COLS.indexOf(col.toUpperCase()) : COLS.indexOf(col.toUpperCase()) + dc;
    const r = d2 ? +row : +row + dr;
    if (c < 0 || c >= COLS.length || r < 1 || r > ROWS) return '#BAŞV!';
    return `${d1}${COLS[c]}${d2}${r}`;
  }))).join('');
}

class FErr extends Error {}
const isRange = (x) => x && x.range;
// Toplama/ortalama gibi işlevler: aralıktaki sayılar alınır (yazı ve boşluk atlanır), tek değerler sayıya çevrilir
const numsOf = (args, num) => args.flatMap((a) => (isRange(a) ? a.vals.filter((v) => typeof v === 'number') : [num(a)]));
const low = (s) => String(s).toLocaleLowerCase('tr');
// EĞERSAY/ETOPLA ölçütü: ">=50", "<>Kira", "Geçti", 10
function criterion(cr) {
  const m = /^(<=|>=|<>|<|>|=)?(.*)$/.exec(String(cr));
  const op = m[1] || '=', rhs = m[2], n = parseNumber(rhs);
  return (v) => {
    if (v === '' || v == null) return op === '<>' ? rhs !== '' : rhs === '';
    if (n !== null && typeof v === 'number') return { '=': v === n, '<>': v !== n, '<': v < n, '>': v > n, '<=': v <= n, '>=': v >= n }[op];
    const a = low(v), b = low(rhs);
    return { '=': a === b, '<>': a !== b, '<': a < b, '>': a > b, '<=': a <= b, '>=': a >= b }[op];
  };
}
const FUNCS = {
  TOPLA: (a, num) => numsOf(a, num).reduce((x, y) => x + y, 0),
  ORTALAMA: (a, num) => { const v = numsOf(a, num); if (!v.length) throw new FErr('#BÖL/0!'); return v.reduce((x, y) => x + y, 0) / v.length; },
  MAK: (a, num) => { const v = numsOf(a, num); return v.length ? Math.max(...v) : 0; },
  'MİN': (a, num) => { const v = numsOf(a, num); return v.length ? Math.min(...v) : 0; },
  SAY: (a) => a.flatMap((x) => (isRange(x) ? x.vals : [x])).filter((v) => typeof v === 'number').length,
  'EĞER': (a) => { if (a.length < 2) throw new FErr('#DEĞER!'); const c = a[0]; return (typeof c === 'string' ? c !== '' : !!c) ? a[1] : (a.length > 2 ? a[2] : false); },
  YUVARLA: (a, num) => { const k = 10 ** Math.round(num(a[1] ?? 0)); return Math.round(num(a[0]) * k) / k; },
  'EĞERSAY': (a) => { if (!isRange(a[0])) throw new FErr('#DEĞER!'); const t = criterion(a[1] ?? ''); return a[0].vals.filter(t).length; },
  ETOPLA: (a, num) => {
    if (!isRange(a[0])) throw new FErr('#DEĞER!');
    const t = criterion(a[1] ?? ''), sum = isRange(a[2]) ? a[2].vals : a[0].vals;
    return a[0].vals.reduce((s, v, i) => (t(v) && typeof sum[i] === 'number' ? s + sum[i] : s), 0);
  },
};
const ALIAS = { SUM: 'TOPLA', AVERAGE: 'ORTALAMA', MAX: 'MAK', MIN: 'MİN', COUNT: 'SAY', IF: 'EĞER', EGER: 'EĞER', ROUND: 'YUVARLA', COUNTIF: 'EĞERSAY', EGERSAY: 'EĞERSAY', SUMIF: 'ETOPLA' };

// Formül değerlendirici: get(addr) hücrenin değerini verir (sayı, yazı ya da hata fırlatır)
function evaluate(src, get) {
  const re = /\s*(?:(\d+(?:,\d+)?)|"([^"]*)"|(\$?[A-Za-zÇĞİÖŞÜçğıöşü]+\$?\d*)|(<=|>=|<>|.))/y;
  const toks = [];
  let m;
  re.lastIndex = 0;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) toks.push({ t: 'num', v: parseFloat(m[1].replace(',', '.')) });
    else if (m[2] !== undefined) toks.push({ t: 'str', v: m[2] });
    else if (m[3]) toks.push({ t: 'id', v: m[3].toLocaleUpperCase('tr') });
    else if (m[4].trim()) toks.push({ t: 'op', v: m[4] });
  }
  if (src.split('"').length % 2 === 0) throw new FErr('#DEĞER!'); // kapanmamış tırnak
  let i = 0;
  const peek = () => toks[i], eat = (v) => { if (toks[i]?.t === 'op' && toks[i].v === v) { i++; return true; } return false; };
  const num = (x) => {
    if (typeof x === 'number') return x;
    if (typeof x === 'boolean') return x ? 1 : 0;
    if (x === '' || x == null) return 0;
    if (isRange(x)) throw new FErr('#DEĞER!');
    const n = parseNumber(x);
    if (n === null) throw new FErr('#DEĞER!');
    return n;
  };
  function range(a, b) {
    const p = parseAddr(a), q = parseAddr(b);
    if (!p || !q) throw new FErr('#BAŞV!');
    const vals = [];
    for (let r = Math.min(p.r, q.r); r <= Math.max(p.r, q.r); r++) for (let c = Math.min(p.c, q.c); c <= Math.max(p.c, q.c); c++) vals.push(get(addr(r, c)));
    return { range: true, vals };
  }
  function primary() {
    const t = toks[i++];
    if (!t) throw new FErr('#DEĞER!');
    if (t.t === 'num' || t.t === 'str') return t.v;
    if (t.t === 'op' && t.v === '(') { const v = compare(); if (!eat(')')) throw new FErr('#DEĞER!'); return v; }
    if (t.t === 'id') {
      if (peek()?.v === '(') {
        i++;
        const name = ALIAS[t.v.replace(/İ/g, 'I')] || ALIAS[t.v] || t.v;
        const fn = FUNCS[name];
        if (!fn) throw new FErr('#AD?');
        const args = [];
        if (!eat(')')) {
          do {
            if (toks[i]?.t === 'id' && toks[i + 1]?.v === ':') { const a = toks[i].v; i += 2; const b = toks[i++]?.v; args.push(range(a, b)); }
            else args.push(compare());
          } while (eat(';') || eat(','));
          if (!eat(')')) throw new FErr('#DEĞER!');
        }
        return fn(args, num);
      }
      if (t.v === 'DOĞRU' || t.v === 'TRUE') return true;
      if (t.v === 'YANLIŞ' || t.v === 'FALSE') return false;
      if (!parseAddr(t.v)) throw new FErr('#AD?');
      return get(t.v.replace(/\$/g, ''));
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
      else if (eat('&')) { const w = term(); v = String(v === true ? 'DOĞRU' : v === false ? 'YANLIŞ' : v) + String(w); }
      else return v;
    }
  }
  function compare() {
    let v = expr();
    for (const op of ['<=', '>=', '<>', '<', '>', '=']) {
      if (eat(op)) {
        const w = expr();
        const both = typeof v === 'number' && typeof w === 'number';
        const a = both ? v : low(v), b = both ? w : low(w);
        return { '=': a === b, '<>': a !== b, '<': a < b, '>': a > b, '<=': a <= b, '>=': a >= b }[op];
      }
    }
    return v;
  }
  const v = compare();
  if (i < toks.length) throw new FErr('#DEĞER!');
  if (isRange(v)) throw new FErr('#DEĞER!');
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
      <span class="xl-sep"></span><button type="button" data-act="cond" title="Koşullu biçimlendirme: belli değerleri renklendir">🎨 Koşullu Biçim</button><button type="button" data-act="filter" title="Filtre: yalnızca istenen satırları göster">🔽 Filtre</button>
    </div>
    <div class="xl-pop" hidden></div>
    <div class="xl-menu" hidden><button type="button" data-file="new">📄 Yeni</button><button type="button" data-file="open">📂 Aç…</button><button type="button" data-file="save">💾 Kaydet <small>Ctrl + S</small></button><button type="button" data-file="saveas">💾 Farklı kaydet…</button><button type="button" data-file="print">🖨 Yazdır… <small>Ctrl + P</small></button></div>
    <div class="xl-bar"><input class="xl-name" readonly aria-label="Ad kutusu"><span class="xl-fx">fx</span><input class="xl-formula" spellcheck="false" autocomplete="off" aria-label="Formül çubuğu"></div>
    <div class="xl-wrap" tabindex="0"><table class="xl-grid"><thead><tr><th class="xl-corner"></th>${[...COLS].map((c) => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${Array.from({ length: ROWS }, (_, r) => `<tr><th>${r + 1}</th>${[...COLS].map((_, c) => `<td data-a="${addr(r, c)}"></td>`).join('')}</tr>`).join('')}</tbody></table>
      <div class="xl-chart" hidden></div><div class="xl-fh" title="Doldurma tutamacı: aşağı ya da sağa sürükleyin"></div></div>
    <div class="xl-status"><span class="xl-stat"></span><span>Sayfa1</span></div>`;
  const $ = (s) => body.querySelector(s);
  const wrap = $('.xl-wrap'), fbar = $('.xl-formula');
  let cells = {}, fmt = {}, fileName = null, folder = 'docs', dirty = false;
  let act = { r: 0, c: 0 }, anchor = { r: 0, c: 0 }; // seçim: anchor'dan act'e dikdörtgen
  let editing = null; // { input, enterMode }
  let chart = null; // { range }
  let rules = []; // koşullu biçim: { r1, c1, r2, c2, crit: '>50', color }
  let filt = null; // filtre: { hr: başlık satırı, r2, c2, allow: { sütun: Set(gösterilecek yazılar) } }
  let clip = null; // kopyalanan hücreler: { r1, c1, r2, c2, data, cut }
  let fill = null; // doldurma tutamacıyla sürükleme

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
    try { const v = value(a); return { v, text: typeof v === 'number' ? fmtNum(v, fmt[a]?.f) : typeof v === 'boolean' ? (v ? 'DOĞRU' : 'YANLIŞ') : String(v) }; }
    catch (e) { return { v: null, err: true, text: e instanceof FErr ? e.message : '#DEĞER!' }; }
  }

  // Toplam satırı: içinde birden çok satırı kapsayan bir aralık (ör. =TOPLA(B2:B5)) olan satır. Sıralama ve filtre buna dokunmaz.
  const totalRow = (r) => [...COLS].some((_, c) => [...(cells[addr(r, c)] || '').matchAll(/\$?[A-H]\$?(\d{1,2}):\$?[A-H]\$?(\d{1,2})/gi)].some((m) => m[1] !== m[2]) && (cells[addr(r, c)] || '').startsWith('='));
  const COND = { kirmizi: 'Kırmızı', yesil: 'Yeşil', sari: 'Sarı' };
  function condColor(a, r, c, v) {
    let col = null;
    for (const R of rules) if (r >= R.r1 && r <= R.r2 && c >= R.c1 && c <= R.c2 && v !== '' && v != null && criterion(R.crit)(v)) col = R.color;
    return col;
  }
  const rowsEl = () => body.querySelectorAll('tbody tr');
  function hiddenRow(r) {
    if (!filt || r <= filt.hr || r > filt.r2) return false;
    return Object.entries(filt.allow).some(([c, set]) => !set.has(show(addr(r, +c)).text));
  }
  function renderFilter() {
    body.querySelectorAll('.xl-fb').forEach((b) => b.remove());
    rowsEl().forEach((tr, r) => { tr.hidden = hiddenRow(r); });
    if (!filt) { $('.xl-stat').dataset.filter = ''; return; }
    for (let c = 0; c <= filt.c2; c++) {
      const b = document.createElement('span');
      b.className = 'xl-fb' + (filt.allow[c] ? ' on' : '');
      b.dataset.col = c;
      b.textContent = filt.allow[c] ? '⏷' : '▾';
      b.title = 'Filtre: hangi satırlar görünsün?';
      td(addr(filt.hr, c)).append(b);
    }
    let shown = 0;
    for (let r = filt.hr + 1; r <= filt.r2; r++) if (!hiddenRow(r)) shown++;
    $('.xl-stat').dataset.filter = Object.keys(filt.allow).length ? `${filt.r2 - filt.hr} kayıttan ${shown} tanesi gösteriliyor` : '';
  }

  function render() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS.length; c++) {
      const a = addr(r, c), el = td(a), s = show(a);
      el.textContent = s.text;
      el.classList.toggle('num', typeof s.v === 'number' || !!s.err);
      el.classList.toggle('err', !!s.err);
      el.classList.toggle('b', !!fmt[a]?.b);
      const col = condColor(a, r, c, s.v);
      el.dataset.cond = col || '';
    }
    renderFilter();
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
    $('.xl-stat').textContent = (nums.length > 1 ? `Ortalama: ${fmtNum(nums.reduce((a, b) => a + b, 0) / nums.length)}   Sayı: ${nums.length}   Toplam: ${fmtNum(nums.reduce((a, b) => a + b, 0))}` : 'Hazır') + ($('.xl-stat').dataset.filter ? '   ·   ' + $('.xl-stat').dataset.filter : '');
    body.querySelectorAll('td.clip').forEach((x) => x.classList.remove('clip'));
    if (clip) for (let r = clip.r1; r <= clip.r2; r++) for (let c = clip.c1; c <= clip.c2; c++) td(addr(r, c)).classList.add('clip');
    // Doldurma tutamacı: seçimin sağ alt köşesindeki küçük kare
    const br = td(addr(s.r2, s.c2)), fh = $('.xl-fh');
    fh.hidden = !!editing || br.closest('tr').hidden;
    fh.style.left = (br.offsetLeft + br.offsetWidth - 4) + 'px';
    fh.style.top = (br.offsetTop + br.offsetHeight - 4) + 'px';
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
    if (/%/.test(raw) && !raw.startsWith('=') && parseNumber(raw) !== null) (fmt[a] ||= {}).f = 'pct';
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
  // ---- Kopyala, kes, yapıştır; Ctrl + D ve doldurma tutamacı ----
  function copy(cut = false) {
    const t = sel();
    const data = [];
    for (let r = t.r1; r <= t.r2; r++) { const row = []; for (let c = t.c1; c <= t.c2; c++) row.push([cells[addr(r, c)], fmt[addr(r, c)]]); data.push(row); }
    clip = { ...t, data, cut };
    paintSel();
    emit('xl-copy', { range: selAddr(), cut });
  }
  function put(r, c, src, sr, sc, move) {
    const a = addr(r, c), [raw, f] = src;
    const v = raw && !move ? shiftFormula(raw, r - sr, c - sc) : raw;
    if (v) cells[a] = v; else delete cells[a];
    if (f) fmt[a] = structuredClone(f); else delete fmt[a];
  }
  function paste() {
    if (!clip) { desk.toast('Pano boş', 'Önce hücreleri seçip Ctrl + C ile kopyalayın.', '📋'); return; }
    const t = sel(), h = clip.r2 - clip.r1 + 1, w = clip.c2 - clip.c1 + 1;
    // Tek hücre kopyalanıp birden fazla hücre seçildiyse hepsine yapıştırılır (formül her satıra uyarlanır)
    const tr2 = h === 1 && w === 1 ? t.r2 : t.r1 + h - 1, tc2 = h === 1 && w === 1 ? t.c2 : t.c1 + w - 1;
    if (tr2 >= ROWS || tc2 >= COLS.length) { desk.toast('Yapıştırılamadı', 'Yapıştırılacak alan sayfanın dışına taşıyor.', '⚠'); return; }
    const moved = clip.cut;
    if (moved) for (let r = clip.r1; r <= clip.r2; r++) for (let c = clip.c1; c <= clip.c2; c++) { delete cells[addr(r, c)]; delete fmt[addr(r, c)]; }
    for (let r = t.r1; r <= tr2; r++) for (let c = t.c1; c <= tc2; c++) {
      const i = (r - t.r1) % h, j = (c - t.c1) % w;
      put(r, c, clip.data[i][j], clip.r1 + i, clip.c1 + j, moved);
    }
    anchor = { r: t.r1, c: t.c1 }; act = { r: tr2, c: tc2 };
    const from = clip.r1 === clip.r2 && clip.c1 === clip.c2 ? addr(clip.r1, clip.c1) : `${addr(clip.r1, clip.c1)}:${addr(clip.r2, clip.c2)}`;
    if (moved) clip = null;
    dirty = true;
    render();
    emit('xl-paste', { from, to: selAddr(), cut: moved });
  }
  // Seçimi (s) hedefe (to) kadar doldurur: formüller kaydırılır, iki ya da daha çok sayı varsa seri devam eder (1, 2 → 3, 4…)
  function fillTo(s, to, dir) {
    const series = (vals) => {
      const n = vals.map((x) => (x && !x.startsWith('=') ? parseNumber(x) : null));
      if (n.length < 2 || n.some((x) => x === null)) return null;
      const d = n[1] - n[0];
      return n.every((x, k) => k === 0 || Math.abs(x - n[k - 1] - d) < 1e-9) ? { last: n.at(-1), d } : null;
    };
    if (dir === 'down') {
      for (let c = s.c1; c <= s.c2; c++) {
        const src = []; for (let r = s.r1; r <= s.r2; r++) src.push([cells[addr(r, c)], fmt[addr(r, c)], r]);
        const ser = series(src.map((x) => x[0]));
        for (let r = s.r2 + 1; r <= to; r++) {
          const k = (r - s.r2 - 1) % src.length;
          if (ser) { cells[addr(r, c)] = fmtSeries(ser.last + ser.d * (r - s.r2)); if (src[k][1]) fmt[addr(r, c)] = structuredClone(src[k][1]); }
          else put(r, c, src[k], src[k][2], c, false);
        }
      }
      anchor = { r: s.r1, c: s.c1 }; act = { r: to, c: s.c2 };
    } else {
      for (let r = s.r1; r <= s.r2; r++) {
        const src = []; for (let c = s.c1; c <= s.c2; c++) src.push([cells[addr(r, c)], fmt[addr(r, c)], c]);
        const ser = series(src.map((x) => x[0]));
        for (let c = s.c2 + 1; c <= to; c++) {
          const k = (c - s.c2 - 1) % src.length;
          if (ser) cells[addr(r, c)] = fmtSeries(ser.last + ser.d * (c - s.c2));
          else put(r, c, src[k], r, src[k][2], false);
        }
      }
      anchor = { r: s.r1, c: s.c1 }; act = { r: s.r2, c: to };
    }
    dirty = true;
    render();
    emit('xl-fill', { from: s.r1 === s.r2 && s.c1 === s.c2 ? addr(s.r1, s.c1) : `${addr(s.r1, s.c1)}:${addr(s.r2, s.c2)}`, to: selAddr(), dir });
  }
  const fmtSeries = (n) => String(Math.round(n * 1e9) / 1e9).replace('.', ',');
  function fillDown() {
    const t = sel();
    if (t.r1 === t.r2) { desk.toast('Aşağı doldur', 'Önce kopyalanacak hücreyi ve altındaki boş hücreleri birlikte seçin.', 'ℹ'); return; }
    fillTo({ ...t, r2: t.r1 }, t.r2, 'down');
  }

  // ---- Koşullu biçim ve filtre pencereleri ----
  const pop = $('.xl-pop');
  // Açılır kutu, verilen öğenin hemen altında açılır
  function openPop(html, under) {
    pop.innerHTML = html;
    pop.hidden = false;
    const b = body.getBoundingClientRect(), r = under.getBoundingClientRect();
    pop.style.left = Math.max(4, Math.min(r.left - b.left, body.clientWidth - pop.offsetWidth - 8)) + 'px';
    pop.style.top = Math.min(r.bottom - b.top + 3, body.clientHeight - pop.offsetHeight - 6) + 'px';
  }
  function condDialog() {
    const t = sel();
    if (t.r1 === t.r2 && t.c1 === t.c2) { desk.toast('Koşullu Biçim', 'Önce renklendirilecek hücreleri fareyle sürükleyerek seçin.', '🎨'); return; }
    const b = $('[data-act="cond"]');
    openPop(`<b>🎨 Koşullu Biçim</b><p>Seçili hücrelerden (${selAddr()}) değeri</p>
      <div class="xl-row"><select class="xl-cop"><option value=">">büyük olanları</option><option value="<">küçük olanları</option><option value=">=">en az şu kadar olanları</option><option value="=">eşit olanları</option></select>
      <input class="xl-cval" placeholder="50 ya da Kaldı" size="9"></div>
      <div class="xl-row">renk: <select class="xl-ccol">${Object.entries(COND).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></div>
      <div class="xl-row"><button type="button" class="xl-cok primary">Uygula</button><button type="button" class="xl-cclr">Kuralları temizle</button><button type="button" class="xl-px">İptal</button></div>`, b);
    pop.querySelector('.xl-cval').focus();
  }
  function filterToggle() {
    if (filt) { filt = null; render(); emit('xl-filter-off'); return; }
    // Etkin hücrenin bulunduğu tablonun başlık satırı: yukarı doğru boş olmayan son satır
    const used = (r) => [...COLS].some((_, c) => cells[addr(r, c)]);
    if (!used(act.r)) { desk.toast('Filtre', 'Önce tablonun içinde bir hücreye tıklayın.', '🔽'); return; }
    let hr = act.r; while (hr > 0 && used(hr - 1)) hr--;
    let r2 = hr; while (r2 + 1 < ROWS && used(r2 + 1) && !totalRow(r2 + 1)) r2++;
    let c2 = COLS.length - 1; while (c2 > 0 && !cells[addr(hr, c2)]) c2--;
    filt = { hr, r2, c2, allow: {} };
    render();
    emit('xl-filter-on', { header: hr + 1 });
  }
  function filterDialog(c) {
    const vals = [...new Set(Array.from({ length: filt.r2 - filt.hr }, (_, k) => show(addr(filt.hr + 1 + k, c)).text))].sort((x, y) => x.localeCompare(y, 'tr'));
    const allow = filt.allow[c];
    const cell = td(addr(filt.hr, c));
    openPop(`<b>🔽 ${esc(show(addr(filt.hr, c)).text)}</b><label class="xl-fall"><input type="checkbox" class="xl-fa" ${allow ? '' : 'checked'}> (Tümünü seç)</label>
      <div class="xl-flist">${vals.map((v) => `<label><input type="checkbox" value="${esc(v)}" ${!allow || allow.has(v) ? 'checked' : ''}> ${esc(v || '(Boş)')}</label>`).join('')}</div>
      <div class="xl-row"><button type="button" class="xl-fok primary" data-col="${c}">Tamam</button><button type="button" class="xl-px">İptal</button></div>`, cell);
  }

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
    // Etkin sütuna göre, başlık satırının altındaki veri satırlarını sıralar. Toplam satırında durur.
    const s = sel();
    const lastCol = (r) => { let c = COLS.length - 1; while (c >= 0 && !cells[addr(r, c)]) c--; return c; };
    let r1 = s.r1 === s.r2 ? 1 : s.r1, r2 = s.r1 === s.r2 ? r1 : s.r2;
    if (s.r1 === s.r2) {
      const row = (r) => [...COLS].some((_, c) => cells[addr(r, c)]);
      while (r2 + 1 < ROWS && row(r2 + 1) && !totalRow(r2 + 1)) r2++;
    }
    const c2 = s.c1 === s.c2 ? Math.max(...Array.from({ length: r2 - r1 + 1 }, (_, k) => lastCol(r1 + k))) : s.c2;
    const c1 = s.c1 === s.c2 ? 0 : s.c1;
    // Sıralama anahtarı hesaplanmış değerdir (formül sütununa göre de sıralanabilir)
    const rows = Array.from({ length: r2 - r1 + 1 }, (_, k) => ({
      src: r1 + k,
      key: show(addr(r1 + k, act.c)).v,
      data: Array.from({ length: c2 - c1 + 1 }, (__, j) => [cells[addr(r1 + k, c1 + j)], fmt[addr(r1 + k, c1 + j)]]),
    }));
    const kv = (x) => (x === '' || x == null ? '' : x);
    rows.sort((a, b) => { const x = kv(a.key), y = kv(b.key); const o = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'tr'); return desc ? -o : o; });
    // Satırla birlikte taşınan formüller yeni satırına göre kaydırılır (=ORTALAMA(B2:C2) → B5:C5 gibi)
    rows.forEach((row, k) => row.data.forEach(([raw, f], j) => { const a = addr(r1 + k, c1 + j); if (raw) cells[a] = shiftFormula(raw, r1 + k - row.src, 0); else delete cells[a]; if (f) fmt[a] = f; else delete fmt[a]; }));
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
    cells = { ...(data?.cells || {}) }; fmt = structuredClone(data?.fmt || {}); rules = structuredClone(data?.rules || []); filt = null; clip = null;
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
    desk.fs.write(r.folder, r.name, { cells: { ...cells }, fmt: structuredClone(fmt), rules: structuredClone(rules) });
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
    if (e.target.closest('.xl-fb')) { e.preventDefault(); filterDialog(+e.target.closest('.xl-fb').dataset.col); return; }
    if (e.target.closest('.xl-fh')) { e.preventDefault(); if (editing) commit(0, 0); fill = { s: sel(), dir: null, to: null }; return; }
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
    if (fill) {
      const cell = e.target.closest('td[data-a]');
      if (!cell) return;
      const p = parseAddr(cell.dataset.a), s0 = fill.s;
      fill.dir = p.r > s0.r2 ? 'down' : p.c > s0.c2 ? 'right' : null;
      fill.to = fill.dir === 'down' ? p.r : fill.dir === 'right' ? p.c : null;
      body.querySelectorAll('td.fillsel').forEach((x) => x.classList.remove('fillsel'));
      if (fill.dir === 'down') for (let r = s0.r2 + 1; r <= fill.to; r++) for (let c = s0.c1; c <= s0.c2; c++) td(addr(r, c)).classList.add('fillsel');
      if (fill.dir === 'right') for (let r = s0.r1; r <= s0.r2; r++) for (let c = s0.c2 + 1; c <= fill.to; c++) td(addr(r, c)).classList.add('fillsel');
      return;
    }
    if (!dragging || !(e.buttons & 1)) { dragging = false; return; }
    const cell = e.target.closest('td[data-a]');
    if (cell) { const p = parseAddr(cell.dataset.a); act = p; paintSel(); }
  });
  addEventListener('mouseup', function up() {
    if (!body.isConnected) { removeEventListener('mouseup', up); return; }
    if (fill) {
      const f = fill;
      fill = null;
      body.querySelectorAll('td.fillsel').forEach((x) => x.classList.remove('fillsel'));
      if (f.dir) fillTo(f.s, f.to, f.dir);
      return;
    }
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
      if (e.code === 'KeyC') { e.preventDefault(); copy(false); }
      if (e.code === 'KeyX') { e.preventDefault(); copy(true); }
      if (e.code === 'KeyV') { e.preventDefault(); paste(); }
      if (e.code === 'KeyD') { e.preventDefault(); fillDown(); }
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
    if (k === 'Escape') { if (clip) { clip = null; paintSel(); } pop.hidden = true; return; }
    if (k.length === 1 && !e.altKey) { e.preventDefault(); startEdit(k); }
  });
  // Formül çubuğu: tıklayıp oradan da yazılabilir
  fbar.addEventListener('focus', () => { if (!editing) { startEdit(null, false); fbar.focus(); } });
  fbar.addEventListener('input', () => { if (editing) editing.input.value = fbar.value; });
  fbar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (editing) editing.input.value = fbar.value; commit(1, 0); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  body.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.xl-menu, .xl-file')) $('.xl-menu').hidden = true;
    if (!e.target.closest('.xl-pop, [data-act="cond"], .xl-fb')) pop.hidden = true;
    if (e.target.closest('.xl-rib button')) e.preventDefault();
  });
  pop.addEventListener('change', (e) => {
    if (e.target.classList.contains('xl-fa')) pop.querySelectorAll('.xl-flist input').forEach((b) => { b.checked = e.target.checked; });
    else if (e.target.closest('.xl-flist')) pop.querySelector('.xl-fa').checked = [...pop.querySelectorAll('.xl-flist input')].every((b) => b.checked);
  });
  pop.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); pop.querySelector('.xl-cok, .xl-fok')?.click(); } e.stopPropagation(); });
  body.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.classList.contains('xl-file')) { $('.xl-menu').hidden = !$('.xl-menu').hidden; return; }
    if (t.dataset.file) return fileCmd(t.dataset.file);
    if (t.classList.contains('xl-px')) { pop.hidden = true; return; }
    if (t.classList.contains('xl-cok')) {
      const op = pop.querySelector('.xl-cop').value, val = pop.querySelector('.xl-cval').value.trim();
      if (!val) { pop.querySelector('.xl-cval').focus(); return; }
      const R = { ...sel(), crit: op + val, color: pop.querySelector('.xl-ccol').value };
      rules.push(R);
      pop.hidden = true; dirty = true; render();
      emit('xl-cond', { range: selAddr(), crit: R.crit, color: R.color });
      return;
    }
    if (t.classList.contains('xl-cclr')) { rules = []; pop.hidden = true; dirty = true; render(); emit('xl-cond-clear'); return; }
    if (t.classList.contains('xl-fok')) {
      const c = +t.dataset.col, boxes = [...pop.querySelectorAll('.xl-flist input')];
      if (boxes.every((b) => b.checked)) delete filt.allow[c];
      else filt.allow[c] = new Set(boxes.filter((b) => b.checked).map((b) => b.value));
      pop.hidden = true; render();
      emit('xl-filter', { col: COLS[c], values: filt.allow[c] ? [...filt.allow[c]] : null, shown: [...Array(filt.r2 - filt.hr)].filter((_, k) => !hiddenRow(filt.hr + 1 + k)).length });
      wrap.focus({ preventScroll: true });
      return;
    }
    if (t.classList.contains('xl-ch-x')) { chart = null; $('.xl-chart').hidden = true; emit('xl-chart-remove'); return; }
    const a = t.dataset.act;
    if (!a) return;
    if (editing) commit(0, 0);
    if (a === 'cond') return condDialog();
    if (a === 'filter') { filterToggle(); wrap.focus({ preventScroll: true }); return; }
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
    cell: (a) => { const s = show(a), p = parseAddr(a); return { raw: cells[a] || '', value: s.v, text: s.text, bold: !!fmt[a]?.b, f: fmt[a]?.f || null, color: condColor(a, p.r, p.c, s.v), hidden: hiddenRow(p.r) }; },
    get filter() { return filt && { header: filt.hr + 1, cols: Object.keys(filt.allow).map((c) => COLS[c]) }; },
    get rules() { return rules.length; },
    get chart() { return chart; },
    confirmClose: confirmDiscard,
    focus: () => { if (!desk.dialogs.busy && !editing) wrap.focus({ preventScroll: true }); },
  };
}
