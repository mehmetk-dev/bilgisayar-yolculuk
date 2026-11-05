// Hesap Makinesi: Windows 11'deki gibi Standart ve Bilimsel kipler, geçmiş ve bellek.
// Standart kipte her işlem tuşunda ara sonuç hesaplanır (2 + 3 × 4 = 20); Bilimsel kipte işlem sırası geçerlidir (= 14).
// Derslerin dinlediği olaylar: 'calc' {display, key}, 'calc-result' {a, op, b, value, expr}, 'calc-clear'.
const svg = (d, w = 16) => `<svg viewBox="0 0 16 16" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC = {
  menu: svg('<path d="M2 4h12M2 8h12M2 12h12"/>'),
  hist: svg('<path d="M2.6 8a5.4 5.4 0 1 0 1.7-3.9"/><path d="M2.4 2v3.1h3.1"/><path d="M8 5.2V8l2.1 1.4"/>'),
  back: svg('<path d="M5.6 3.5h7.9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5.6L1.5 8z"/><path d="M8.2 6l3.6 4M11.8 6l-3.6 4"/>'),
  trash: svg('<path d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9.5h6.8L12 4M6.6 6.5v5M9.4 6.5v5"/>'),
  chev: svg('<path d="M4 6l4 4 4-4"/>', 9),
  gear: svg('<circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>'),
};

// [etiket, tür, bağımsız değişken, sınıf]
const D = (n) => [n, 'digit', n, 'ca-n'];
const OP = (o) => [o, 'op', o, 'ca-f'];
const STD = [
  ['%', 'pct', '', 'ca-f'], ['CE', 'ce', '', 'ca-f'], ['C', 'c', '', 'ca-f'], [IC.back, 'back', '', 'ca-f'],
  ['<sup>1</sup>⁄<sub>x</sub>', 'un', 'inv', 'ca-f'], ['x<sup>2</sup>', 'un', 'sqr', 'ca-f'], ['<sup>2</sup>√x', 'un', 'sqrt', 'ca-f'], OP('÷'),
  D('7'), D('8'), D('9'), OP('×'),
  D('4'), D('5'), D('6'), OP('−'),
  D('1'), D('2'), D('3'), OP('+'),
  ['+/−', 'neg', '', 'ca-n'], D('0'), [',', 'dot', '', 'ca-n'], ['=', 'eq', '', 'ca-eq'],
];
const SCI = [
  ['', 'deg', '', 'ca-f ca-deg'], ['π', 'const', 'pi', 'ca-f'], ['e', 'const', 'e', 'ca-f'], ['C', 'c', '', 'ca-f'], [IC.back, 'back', '', 'ca-f'],
  ['sin', 'un', 'sin', 'ca-f'], ['cos', 'un', 'cos', 'ca-f'], ['tan', 'un', 'tan', 'ca-f'], ['x<sup>2</sup>', 'un', 'sqr', 'ca-f'], ['<sup>2</sup>√x', 'un', 'sqrt', 'ca-f'],
  ['<sup>1</sup>⁄<sub>x</sub>', 'un', 'inv', 'ca-f'], ['|x|', 'un', 'abs', 'ca-f'], ['(', 'lp', '', 'ca-f'], [')', 'rp', '', 'ca-f'], OP('÷'),
  ['x<sup>y</sup>', 'op', '^', 'ca-f'], D('7'), D('8'), D('9'), OP('×'),
  ['log', 'un', 'log', 'ca-f'], D('4'), D('5'), D('6'), OP('−'),
  ['ln', 'un', 'ln', 'ca-f'], D('1'), D('2'), D('3'), OP('+'),
  ['n!', 'un', 'fact', 'ca-f'], ['+/−', 'neg', '', 'ca-n'], D('0'), [',', 'dot', '', 'ca-n'], ['=', 'eq', '', 'ca-eq'],
];
const MEM = [['MC', 'mc'], ['MR', 'mr'], ['M+', 'mp'], ['M−', 'mm'], ['MS', 'ms'], [`M${IC.chev}`, 'mv']];
const MODES = [
  ['std', 'Standart'], ['sci', 'Bilimsel'], ['graf', 'Grafik', 1], ['prog', 'Programcı', 1], ['tarih', 'Tarih Hesaplama', 1],
];
const CONVS = ['Para Birimi', 'Hacim', 'Uzunluk', 'Ağırlık ve Kütle', 'Sıcaklık', 'Enerji', 'Alan', 'Hız', 'Zaman', 'Güç', 'Veri', 'Basınç', 'Açı'];

const PREC = { '+': 1, '−': 1, '×': 2, '÷': 2, '^': 3 };
const KEY_OF = { back: '⌫', neg: '±', pct: '%', c: 'C', ce: 'CE', dot: ',', eq: '=' };
const err = (calc, expr) => ({ calc, expr });
const fact = (x) => {
  if (x < 0 || x !== Math.floor(x)) throw err('Geçersiz giriş');
  if (x > 170) throw err('Taşma');
  let r = 1;
  for (let i = 2; i <= x; i++) r *= i;
  return r;
};
const FN = {
  inv: ['1/', (x) => { if (x === 0) throw err('Sıfıra bölünemez'); return 1 / x; }],
  sqr: ['sqr', (x) => x * x],
  sqrt: ['√', (x) => { if (x < 0) throw err('Geçersiz giriş'); return Math.sqrt(x); }],
  abs: ['abs', Math.abs],
  log: ['log', (x) => { if (x <= 0) throw err('Geçersiz giriş'); return Math.log10(x); }],
  ln: ['ln', (x) => { if (x <= 0) throw err('Geçersiz giriş'); return Math.log(x); }],
  fact: ['fact', fact],
  neg: ['negate', (x) => -x],
};

// 1234.5 yazılışı → "1.234,5"
const grp = (s) => {
  if (/e/.test(s)) return s.replace('.', ',');
  const neg = s[0] === '-';
  const [i, f] = s.replace('-', '').split('.');
  return `${neg ? '-' : ''}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${f !== undefined ? ',' + f : ''}`;
};
// Sayıdan yazıya (en çok 15 anlamlı basamak; 0,1 + 0,2 = 0,3 çıksın diye)
const toStr = (n) => {
  if (!isFinite(n)) throw err('Taşma');
  if (n === 0) return '0';
  const r = Number(n.toPrecision(15)), a = Math.abs(r);
  if (a >= 1e16 || a < 1e-6) return r.toExponential(14).replace(/\.?0+e/, 'e');
  return String(r);
};

export function calc({ body, emit }) {
  body.classList.add('calc');
  body.tabIndex = 0;
  body.innerHTML = `<div class="ca-wrap"><div class="ca-main">
      <div class="ca-top"><button type="button" class="ca-ib ca-burger" title="Gezinti menüsünü aç" aria-label="Gezinti menüsünü aç">${IC.menu}</button><b class="ca-mode">Standart</b><button type="button" class="ca-ib ca-hbtn" title="Geçmiş" aria-label="Geçmiş">${IC.hist}</button></div>
      <div class="ca-disp"><div class="ca-expr"></div><div class="ca-val">0</div></div>
      <div class="ca-mem">${MEM.map(([l, k]) => `<button type="button" data-k="${k}">${l}</button>`).join('')}</div>
      <div class="ca-keys"></div>
    </div>
    <div class="ca-side"><div class="ca-tabs"><button type="button" data-tab="h" class="on">Geçmiş</button><button type="button" data-tab="m">Bellek</button></div>
      <div class="ca-list"></div><div class="ca-foot"><button type="button" class="ca-ib ca-trash" title="Geçmişi sil" aria-label="Geçmişi sil">${IC.trash}</button></div></div>
    <div class="ca-nav" hidden><div class="ca-navp"><button type="button" class="ca-ib ca-burger2" title="Gezinti menüsünü kapat" aria-label="Gezinti menüsünü kapat">${IC.menu}</button>
      <b class="ca-nh">Hesap Makinesi</b>
      ${MODES.map(([k, l, off]) => `<button type="button" class="ca-ni${off ? ' off' : ''}" data-mode="${k}">${l}</button>`).join('')}
      <b class="ca-nh">Dönüştürücü</b>
      ${CONVS.map((l) => `<button type="button" class="ca-ni off" data-mode="conv">${l}</button>`).join('')}
      <button type="button" class="ca-ni off ca-nset" data-mode="ayar">${IC.gear}<span>Ayarlar</span></button></div></div>
    <div class="ca-note" hidden></div></div>`;
  const $ = (q) => body.querySelector(q);
  const wrap = $('.ca-wrap'), keysEl = $('.ca-keys'), valEl = $('.ca-val'), exprEl = $('.ca-expr'), listEl = $('.ca-list'), noteEl = $('.ca-note'), navEl = $('.ca-nav');

  let mode = 'std', rad = false, tab = 'h', panel = false;
  let mem = [];
  const hist = [];
  let s;
  const fresh = () => ({ cur: '0', fresh: true, vals: [], ops: [], tk: [], opnd: null, last: null, eq: null, done: false, err: '', shown: '' });
  s = fresh();

  const val = () => parseFloat(s.cur);
  const ftxt = (c = s.cur) => grp(c).replace(/,$/, '');
  const newExpr = () => { const c = s.cur; s = fresh(); s.cur = c; };
  const prec = (o) => (mode === 'sci' ? PREC[o] : 1);
  const apply = (a, o, b) => {
    switch (o) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': if (b === 0) throw err(a === 0 ? 'Tanımsız sonuç' : 'Sıfıra bölünemez'); return a / b;
      default: { const r = Math.pow(a, b); if (isNaN(r)) throw err('Geçersiz giriş'); return r; }
    }
  };
  let lastRed = null;
  const reduceTop = () => {
    const o = s.ops.pop(), b = s.vals.pop(), a = s.vals.pop();
    lastRed = { a, op: o, b };
    s.vals.push(apply(a, o, b));
  };
  const exprText = () => (s.done ? s.shown : (s.tk.join('') + (s.opnd && s.last === 'num' ? s.opnd : '')).trim());
  const addHist = (expr, raw) => { hist.unshift({ expr, raw }); if (hist.length > 60) hist.pop(); };

  // ---- düğme işlemleri ----
  const digit = (d) => {
    if (s.err) s = fresh();
    if (s.done) newExpr();
    if (s.last === 'close') return;
    if (s.fresh) { s.cur = d; s.fresh = false; }
    else if (s.cur.replace(/[-.]/g, '').length < 16) s.cur = s.cur === '0' ? d : s.cur === '-0' ? '-' + d : s.cur + d;
    s.opnd = null; s.last = 'num';
  };
  const dot = () => {
    if (s.err) s = fresh();
    if (s.done) newExpr();
    if (s.last === 'close') return;
    if (s.fresh) { s.cur = '0.'; s.fresh = false; }
    else if (!/[.e]/.test(s.cur)) s.cur += '.';
    s.opnd = null; s.last = 'num';
  };
  const back = () => {
    if (s.err) { s = fresh(); return; }
    if (s.done) { s.shown = ''; return; }
    if (s.fresh || /e/.test(s.cur)) return;
    s.cur = s.cur.length > 1 && !(s.cur.length === 2 && s.cur[0] === '-') ? s.cur.slice(0, -1) : '0';
  };
  const ce = () => {
    if (s.err || s.done) { s = fresh(); return; }
    s.cur = '0'; s.fresh = true; s.opnd = null;
    const t = s.ops.at(-1);
    s.last = t === '(' ? 'open' : t ? 'op' : null;
  };
  const clearAll = () => { s = fresh(); emit('calc-clear'); };
  const binary = (o) => {
    if (s.err) return;
    if (s.done) { const c = s.cur; s = fresh(); s.cur = c; }
    if (s.last === 'op') { s.ops[s.ops.length - 1] = o; s.tk[s.tk.length - 1] = ` ${o} `; return; }
    if (s.last !== 'close') { s.vals.push(val()); s.tk.push(s.opnd ?? ftxt()); }
    let reduced = false;
    while (s.ops.length && s.ops.at(-1) !== '(' && (prec(s.ops.at(-1)) > prec(o) || (prec(s.ops.at(-1)) === prec(o) && o !== '^'))) { reduceTop(); reduced = true; }
    if (reduced) s.cur = toStr(s.vals.at(-1));
    s.ops.push(o); s.tk.push(` ${o} `);
    s.last = 'op'; s.fresh = true; s.opnd = null;
  };
  const lparen = () => {
    if (s.err) return;
    if (s.done) s = fresh();
    if (s.last === 'num' || s.last === 'close') return;
    s.ops.push('('); s.tk.push('(');
    s.last = 'open'; s.cur = '0'; s.fresh = true; s.opnd = null;
  };
  const rparen = () => {
    if (s.err || !s.ops.includes('(')) return;
    if (s.last !== 'close') { s.vals.push(val()); s.tk.push((s.opnd ?? ftxt()) + ')'); }
    else s.tk[s.tk.length - 1] += ')';
    while (s.ops.at(-1) !== '(') reduceTop();
    s.ops.pop();
    s.cur = toStr(s.vals.at(-1));
    s.last = 'close'; s.fresh = true; s.opnd = null;
  };
  const equals = () => {
    if (s.err) return;
    if (s.done && s.eq) { // üst üste "=": son işlemi yinelet
      const a = val(), { op, b } = s.eq;
      const expr = `${ftxt()} ${op} ${ftxt(toStr(b))} =`;
      try {
        const r = apply(a, op, b);
        s.shown = expr; s.cur = toStr(r);
        addHist(expr, s.cur);
        emit('calc-result', { a, op, b, value: r, expr: expr.slice(0, -2) });
      } catch (e) { throw err(e.calc, expr); }
      return;
    }
    if (!s.ops.length) { // bekleyen işlem yok: "5 ="
      if (s.last === 'close') return;
      s.shown = `${s.opnd ?? ftxt()} =`; s.done = true; s.fresh = true;
      return;
    }
    if (s.last !== 'close') { s.vals.push(val()); s.tk.push(s.opnd ?? ftxt()); }
    const opens = s.ops.filter((o) => o === '(').length;
    for (let i = 0; i < opens; i++) s.tk[s.tk.length - 1] += ')';
    const text = s.tk.join('');
    lastRed = null;
    try {
      while (s.ops.length) { if (s.ops.at(-1) === '(') s.ops.pop(); else reduceTop(); }
    } catch (e) { throw err(e.calc, text + ' ='); }
    const r = s.vals[0];
    const cur = toStr(r), expr = text + ' =';
    const red = lastRed;
    s = fresh(); s.cur = cur; s.done = true; s.shown = expr;
    if (red) s.eq = { op: red.op, b: red.b };
    addHist(expr, cur);
    emit('calc-result', { a: red ? red.a : r, op: red ? red.op : '', b: red ? red.b : r, value: r, expr: text });
  };
  const unary = (name, fn, label) => {
    if (s.err) return;
    if (s.done) newExpr();
    if (s.last === 'close') return;
    const r = fn(val());
    s.opnd = `${label}(${s.opnd ?? ftxt()})`;
    s.cur = toStr(Math.abs(r) < 1e-14 && /^(sin|cos|tan)$/.test(name) ? 0 : r);
    s.fresh = true; s.last = 'num';
  };
  const trig = (f) => (x) => {
    const r = f(rad ? x : x * Math.PI / 180);
    if (Math.abs(r) > 1e15) throw err('Geçersiz giriş');
    return r;
  };
  const pct = () => {
    if (s.err) return;
    if (s.done) newExpr();
    const o = s.ops.at(-1);
    let r = 0;
    if (o && o !== '(' && s.vals.length) r = '+−'.includes(o) ? s.vals.at(-1) * val() / 100 : val() / 100;
    s.cur = toStr(r); s.opnd = ftxt(); s.fresh = true; s.last = 'num';
  };
  const constant = (v) => {
    if (s.err) return;
    if (s.done) newExpr();
    if (s.last === 'close') return;
    s.cur = toStr(v); s.opnd = null; s.fresh = true; s.last = 'num';
  };
  const memory = (k) => {
    if (s.err) return;
    const x = val();
    if (k === 'mc') mem = [];
    else if (k === 'mr') { if (mem.length) constant(mem[0]); }
    else if (k === 'ms') { mem.unshift(x); s.fresh = true; }
    else if (k === 'mp') { if (mem.length) mem[0] += x; else mem.unshift(x); s.fresh = true; }
    else if (k === 'mm') { if (mem.length) mem[0] -= x; else mem.unshift(-x); s.fresh = true; }
  };

  const run = (k, a) => {
    if (k === 'digit') digit(a);
    else if (k === 'dot') dot();
    else if (k === 'back') back();
    else if (k === 'ce') ce();
    else if (k === 'c') clearAll();
    else if (k === 'op') binary(a);
    else if (k === 'eq') equals();
    else if (k === 'lp') lparen();
    else if (k === 'rp') rparen();
    else if (k === 'pct') pct();
    else if (k === 'neg') {
      if (!s.fresh && !s.done && !s.err) { if (val() !== 0) s.cur = s.cur[0] === '-' ? s.cur.slice(1) : '-' + s.cur; } // yazarken işareti hemen değiştirir
      else unary('neg', FN.neg[1], FN.neg[0]);
    }
    else if (k === 'const') constant(a === 'pi' ? Math.PI : Math.E);
    else if (k === 'deg') rad = !rad;
    else if (k === 'un') {
      if (a === 'sin' || a === 'cos' || a === 'tan') unary(a, trig(Math[a]), a);
      else unary(a, FN[a][1], FN[a][0]);
    } else memory(k);
  };

  // ---- görünüm ----
  const NOERR = new Set(['digit', 'dot', 'back', 'ce', 'c', 'deg']);
  const shownVal = () => s.err || grp(s.cur);
  const renderSide = () => {
    wrap.classList.toggle('ca-pan', panel);
    body.querySelectorAll('.ca-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    const tr = $('.ca-trash');
    tr.title = tr.ariaLabel = tab === 'h' ? 'Geçmişi sil' : 'Belleği temizle';
    if (tab === 'h') {
      listEl.innerHTML = hist.length
        ? hist.map((h, i) => `<button type="button" class="ca-hi" data-i="${i}"><span>${h.expr}</span><b>${grp(h.raw)}</b></button>`).join('')
        : '<p class="ca-empty">Geçmiş henüz boş.</p>';
    } else {
      listEl.innerHTML = mem.length
        ? mem.map((m, i) => `<div class="ca-mi" data-i="${i}"><button type="button" class="ca-mv" data-m="mr">${grp(toStr(m))}</button><span><button type="button" data-m="mc">MC</button><button type="button" data-m="mp">M+</button><button type="button" data-m="mm">M−</button></span></div>`).join('')
        : '<p class="ca-empty">Bellekte kayıtlı bir şey yok.</p>';
    }
    tr.disabled = tab === 'h' ? !hist.length : !mem.length;
  };
  const show = () => {
    const v = shownVal();
    valEl.textContent = v;
    exprEl.textContent = exprText();
    valEl.style.fontSize = '';
    const w = valEl.clientWidth, sw = valEl.scrollWidth;
    if (w && sw > w) valEl.style.fontSize = `${Math.max(1.1, 2.6 * (w / sw) * 0.96).toFixed(2)}em`;
    keysEl.querySelectorAll('button').forEach((b) => { b.disabled = !!s.err && !NOERR.has(b.dataset.k); });
    body.querySelectorAll('.ca-mem button').forEach((b) => {
      const k = b.dataset.k;
      b.disabled = (!!s.err && k !== 'mv' && k !== 'mc') || ((k === 'mc' || k === 'mr' || k === 'mv') && !mem.length);
    });
    const dg = keysEl.querySelector('.ca-deg');
    if (dg) dg.textContent = rad ? 'RAD' : 'DEG';
    renderSide();
    return v;
  };
  const act = (k, a) => {
    try { run(k, a); } catch (e) {
      if (!e || !e.calc) throw e;
      const shown = e.expr ?? exprText();
      s = fresh(); s.err = e.calc; s.shown = shown; s.done = true;
      emit('calc-error', { message: e.calc });
    }
    const v = show();
    emit('calc', { display: v, key: k === 'digit' || k === 'op' || k === 'un' || k === 'const' ? a : KEY_OF[k] || a || k });
  };

  const buildKeys = () => {
    const keys = mode === 'sci' ? SCI : STD;
    keysEl.className = `ca-keys ${mode}`;
    keysEl.innerHTML = keys.map(([l, k, a, c]) => `<button type="button" class="${c}" data-k="${k}" data-a="${a}">${l}</button>`).join('');
    $('.ca-mode').textContent = mode === 'sci' ? 'Bilimsel' : 'Standart';
  };
  const setMode = (m) => {
    if (m === mode) return;
    mode = m; s = fresh(); buildKeys(); show(); emit('calc-mode', { mode: m });
  };
  const note = (t) => {
    noteEl.textContent = t; noteEl.hidden = false;
    clearTimeout(note.t); note.t = setTimeout(() => { noteEl.hidden = true; }, 2600);
  };
  const toggleNav = (open) => { navEl.hidden = !open; if (open) navEl.querySelectorAll('.ca-ni[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode)); };

  // ---- olaylar ----
  body.addEventListener('mousedown', (e) => { if (e.target.closest('button')) { e.preventDefault(); body.focus({ preventScroll: true }); } });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) { if (e.target.classList.contains('ca-nav')) toggleNav(false); return; }
    if (b.closest('.ca-keys')) act(b.dataset.k, b.dataset.a);
    else if (b.closest('.ca-mem')) { if (b.dataset.k === 'mv') { if (panel && tab === 'm') panel = false; else { tab = 'm'; panel = true; } renderSide(); } else act(b.dataset.k); }
    else if (b.classList.contains('ca-burger') || b.classList.contains('ca-burger2')) toggleNav(navEl.hidden);
    else if (b.classList.contains('ca-hbtn')) { if (panel && tab === 'h') panel = false; else { tab = 'h'; panel = true; } renderSide(); }
    else if (b.dataset.tab) { tab = b.dataset.tab; renderSide(); }
    else if (b.classList.contains('ca-trash')) { if (tab === 'h') hist.length = 0; else mem = []; show(); }
    else if (b.classList.contains('ca-hi')) {
      const h = hist[+b.dataset.i];
      s = fresh(); s.cur = h.raw; s.done = true; s.shown = h.expr; panel = false;
      show(); emit('calc', { display: grp(h.raw), key: 'geçmiş' });
    } else if (b.dataset.m) {
      const i = +b.closest('.ca-mi').dataset.i, k = b.dataset.m;
      if (k === 'mc') mem.splice(i, 1);
      else if (k === 'mp') mem[i] += val();
      else if (k === 'mm') mem[i] -= val();
      else { try { constant(mem[i]); } catch (e) { if (!e.calc) throw e; } panel = false; }
      show();
    } else if (b.dataset.mode) {
      if (b.classList.contains('off')) { note('Bu kip bu alıştırmada kapalı. Standart ve Bilimsel kullanılabilir.'); return; }
      setMode(b.dataset.mode); toggleNav(false);
    }
  });
  const flash = (k, a) => {
    const b = [...keysEl.querySelectorAll('button')].find((x) => x.dataset.k === k && x.dataset.a === (a ?? ''));
    if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 120); }
  };
  body.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key;
    if (key === 'Escape') {
      if (!navEl.hidden) toggleNav(false); else if (panel) { panel = false; renderSide(); } else { act('c'); flash('c'); }
      e.preventDefault(); return;
    }
    if ((key === 'Enter' || key === ' ') && e.target.closest('button')) return; // odaktaki düğme kendi tıklamasını yapsın
    const sci = mode === 'sci';
    const OPS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    let r = null;
    if (/^[0-9]$/.test(key)) r = ['digit', key];
    else if (OPS[key]) r = ['op', OPS[key]];
    else if (key === 'Enter' || key === '=') r = ['eq', ''];
    else if (key === 'Backspace') r = ['back', ''];
    else if (key === 'Delete') r = ['ce', ''];
    else if (key === ',' || key === '.') r = ['dot', ''];
    else if (key === 'F9') r = ['neg', ''];
    else if (key === '@') r = ['un', 'sqrt'];
    else if (key === 'q' || key === 'Q') r = ['un', 'sqr'];
    else if (key === 'r' || key === 'R') r = ['un', 'inv'];
    else if (key === '%' && !sci) r = ['pct', ''];
    else if (sci) {
      const m = { '(': ['lp', ''], ')': ['rp', ''], '^': ['op', '^'], '!': ['un', 'fact'], p: ['const', 'pi'], P: ['const', 'pi'], s: ['un', 'sin'], o: ['un', 'cos'], t: ['un', 'tan'], l: ['un', 'log'], n: ['un', 'ln'] };
      r = m[key] || null;
    }
    if (!r) return;
    e.preventDefault();
    act(...r);
    flash(...r);
  });
  // Pencere boyu değişince büyük sayının yazı boyu yeniden ayarlanır
  new ResizeObserver(() => show()).observe(body);

  buildKeys();
  show();
  return {
    focus: () => body.focus({ preventScroll: true }),
  };
}
