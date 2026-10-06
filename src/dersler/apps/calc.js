// Hesap Makinesi (Standart). Windows'taki gibi her işlem tuşunda ara sonuç hesaplanır.
const KEYS = [['C', 'clear'], ['⌫', 'back'], ['%', 'pct'], ['÷', 'op'], ['7'], ['8'], ['9'], ['×', 'op'], ['4'], ['5'], ['6'], ['−', 'op'], ['1'], ['2'], ['3'], ['+', 'op'], ['±', 'neg'], ['0'], [',', 'dot'], ['=', 'eq']];
const fmt = (n) => {
  if (!isFinite(n)) return 'Sıfıra bölünemez';
  const s = String(Math.round(n * 1e10) / 1e10);
  return s.replace('.', ',');
};
const num = (s) => parseFloat(s.replace(',', '.')) || 0;

export function calc({ body, emit }) {
  body.classList.add('calc');
  body.tabIndex = 0;
  body.innerHTML = `<div class="ca-menu">☰ Standart</div><div class="ca-disp"><div class="ca-expr"></div><div class="ca-val">0</div></div>
    <div class="ca-keys">${KEYS.map(([l, k]) => `<button type="button" data-k="${k || 'digit'}" data-l="${l}" class="${k === 'eq' ? 'eq' : k ? 'fn' : ''}">${l}</button>`).join('')}</div>`;
  let cur = '0', acc = null, op = null, fresh = true, expr = '';
  const show = () => {
    body.querySelector('.ca-val').textContent = cur;
    body.querySelector('.ca-expr').textContent = expr;
  };
  const apply = (a, o, b) => ({ '+': a + b, '−': a - b, '×': a * b, '÷': b === 0 ? Infinity : a / b })[o];

  const press = (k, l) => {
    if (k === 'digit') {
      if (fresh || cur === '0') cur = l; else if (cur.length < 16) cur += l;
      fresh = false;
      if (op === null && expr.endsWith('=')) expr = '';
    } else if (k === 'dot') {
      if (fresh) { cur = '0,'; fresh = false; } else if (!cur.includes(',')) cur += ',';
    } else if (k === 'back') {
      if (!fresh) cur = cur.length > 1 ? cur.slice(0, -1) : '0';
    } else if (k === 'clear') {
      cur = '0'; acc = null; op = null; fresh = true; expr = '';
      emit('calc-clear');
    } else if (k === 'neg') {
      cur = cur.startsWith('-') ? cur.slice(1) : cur === '0' ? cur : '-' + cur;
    } else if (k === 'pct') {
      cur = fmt(acc !== null ? acc * num(cur) / 100 : num(cur) / 100);
    } else if (k === 'op') {
      if (op && !fresh) { acc = apply(acc, op, num(cur)); cur = fmt(acc); }
      else if (acc === null || !op) acc = num(cur);
      op = l; fresh = true;
      expr = `${fmt(acc)} ${op}`;
    } else if (k === 'eq') {
      if (op) {
        const b = num(cur);
        const r = apply(acc, op, b);
        expr = `${fmt(acc)} ${op} ${fmt(b)} =`;
        cur = fmt(r);
        emit('calc-result', { a: acc, op, b, value: r, expr: `${fmt(acc)} ${op} ${fmt(b)}` });
        acc = null; op = null; fresh = true;
      }
    }
    show();
    emit('calc', { display: cur, key: l });
  };

  body.querySelector('.ca-keys').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) press(b.dataset.k, b.dataset.l);
  });
  body.addEventListener('keydown', (e) => {
    const map = { '+': ['op', '+'], '-': ['op', '−'], '*': ['op', '×'], '/': ['op', '÷'], Enter: ['eq', '='], '=': ['eq', '='], Backspace: ['back', '⌫'], Escape: ['clear', 'C'], Delete: ['clear', 'C'], ',': ['dot', ','], '.': ['dot', ','], '%': ['pct', '%'] };
    if (/^[0-9]$/.test(e.key)) press('digit', e.key);
    else if (map[e.key]) press(...map[e.key]);
    else return;
    e.preventDefault();
    const b = [...body.querySelectorAll('.ca-keys button')].find((x) => x.dataset.l === (/^[0-9]$/.test(e.key) ? e.key : map[e.key][1]));
    if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 120); }
  });
  return {
    focus: () => body.focus({ preventScroll: true }),
  };
}
