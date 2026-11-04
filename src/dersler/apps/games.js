// Fare alıştırma oyunları: Hedef (tık / çift tık / sağ tık), Mayın Tarlası, Kart Dizme (sürükle-bırak).
// Görünüm Microsoft Minesweeper / Solitaire Collection havasında (renkli taşlar, yeşil çuha); tüm simgeler SVG.
import { ic } from './w11ikon.js';

const SVGF = (body) => `<svg class="wi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
const FACE = {
  smile: SVGF('<circle cx="12" cy="12" r="10" fill="#ffd84a" stroke="#c99a00" stroke-width="1"/><circle cx="8.5" cy="10" r="1.4" fill="#333"/><circle cx="15.5" cy="10" r="1.4" fill="#333"/><path d="M7.5 14.5a5 5 0 0 0 9 0" fill="none" stroke="#333" stroke-width="1.6" stroke-linecap="round"/>'),
  cool: SVGF('<circle cx="12" cy="12" r="10" fill="#ffd84a" stroke="#c99a00" stroke-width="1"/><path d="M4.5 9h15v2.2a2.3 2.3 0 0 1-2.300 2.300h-1.500a2.300 2.300 0 0 1-2.200-1.700h-1a2.300 2.300 0 0 1-2.200 1.700H6.800A2.300 2.300 0 0 1 4.500 11.200z" fill="#222"/><path d="M8 16a5 5 0 0 0 8 0" fill="none" stroke="#333" stroke-width="1.6" stroke-linecap="round"/>'),
  dead: SVGF('<circle cx="12" cy="12" r="10" fill="#ffd84a" stroke="#c99a00" stroke-width="1"/><path d="M6.800 8.300l3 3M9.800 8.300l-3 3M14.200 8.300l3 3M17.200 8.300l-3 3" stroke="#333" stroke-width="1.5" stroke-linecap="round"/><path d="M8 17a5 5 0 0 1 8 0" fill="none" stroke="#333" stroke-width="1.6" stroke-linecap="round"/>'),
};
const FLAG = SVGF('<path d="M7 21V3.500" stroke="#5a3a22" stroke-width="2" stroke-linecap="round"/><path d="M7.500 4h11l-3 4.500 3 4.500h-11z" fill="#e53935"/>');
const BOMB = SVGF('<circle cx="11" cy="14" r="7" fill="#2b2f36"/><circle cx="8.500" cy="11.500" r="1.800" fill="#8a93a0"/><path d="M15.500 8.500l2.500-2.500" stroke="#5a3a22" stroke-width="1.800" stroke-linecap="round"/><path d="M19 3.500v2M17.500 4.800l2.500-.8M19.800 6.200l-1.800.2" stroke="#ff9800" stroke-width="1.400" stroke-linecap="round"/>');
const BALLOON = SVGF('<path d="M12 2.500c-4 0-6.800 3-6.800 6.800 0 4 3 7 6.800 8.700 3.800-1.700 6.800-4.700 6.800-8.700C18.800 5.500 16 2.500 12 2.500z" fill="#e53935"/><path d="M8.500 5.500c1-.8 2.200-1 3-.8" stroke="#fff" stroke-opacity=".6" stroke-width="1.400" fill="none" stroke-linecap="round"/><path d="M10.800 18l1.200 1.700 1.200-1.700z" fill="#b71c1c"/><path d="M12 19.700c-1.500 1.300 1.500 2 0 3" stroke="#777" stroke-width="1" fill="none"/>');
const HEART = '<svg class="w11kd-s" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S3 15 3 8.800A4.800 4.800 0 0 1 12 6.500 4.800 4.800 0 0 1 21 8.800C21 15 12 21 12 21z" fill="currentColor"/></svg>';

const MODES = {
  click: ['Tek tık', 'Yeşil daireye farenin sol tuşuyla bir kez tıklayın.'],
  dbl: ['Çift tık', 'Balona sol tuşla hızlıca iki kez tıklayın: “tık-tık”.'],
  right: ['Sağ tık', 'Turuncu daireye farenin sağ tuşuyla tıklayın.'],
  mixed: ['Karışık', 'Yeşil → sol tık, turuncu → sağ tık.'],
};

export function hedef({ body, args, emit, setTitle }) {
  body.classList.add('w11a', 'w11hg');
  let mode = args.mode || 'click';
  const total = args.total || 10;
  let n = 0, miss = 0, t0 = 0, cur = null, done = false;

  function start(m = mode) {
    mode = m;
    n = 0; miss = 0; done = false; t0 = performance.now();
    setTitle(`Hedef Oyunu: ${MODES[mode][0]}`);
    body.innerHTML = `<div class="w11hg-bar"><div class="w11hg-modes">${Object.entries(MODES).map(([k, [l]]) => `<button type="button" data-mode="${k}" class="${k === mode ? 'on' : ''}">${l}</button>`).join('')}</div><span class="w11hg-score"></span></div>
      <div class="w11hg-tip">${MODES[mode][1]}</div><div class="w11hg-field"></div>`;
    place();
    emit('game-start', { game: 'hedef', mode });
  }

  function place() {
    const f = body.querySelector('.w11hg-field');
    const W = f.clientWidth || 500, H = f.clientHeight || 300;
    const size = Math.round(96 - (n / total) * 50);
    const kind = mode === 'mixed' ? (Math.random() < 0.5 ? 'left' : 'right') : mode === 'right' ? 'right' : mode === 'dbl' ? 'dbl' : 'left';
    cur = { kind, clicks: 0 };
    f.innerHTML = `<button type="button" class="w11hg-t ${kind}" style="width:${size}px;height:${size}px;left:${Math.round(Math.random() * Math.max(10, W - size - 10))}px;top:${Math.round(Math.random() * Math.max(10, H - size - 10))}px">${kind === 'dbl' ? BALLOON : ''}</button>`;
    body.querySelector('.w11hg-score').textContent = `Vurulan: ${n} / ${total}  ·  Iska: ${miss}`;
  }

  function hit() {
    cur.hit = true;
    n++;
    const t = body.querySelector('.w11hg-t');
    t.classList.add('pop');
    emit('game-hit', { game: 'hedef', mode, n, total });
    if (n >= total) {
      done = true;
      const sec = Math.round((performance.now() - t0) / 1000);
      setTimeout(() => {
        body.querySelector('.w11hg-field').innerHTML = `<div class="w11hg-done">${ic('check')}<b>Tebrikler!</b><b>${total}</b> hedefi <b>${sec}</b> saniyede vurdunuz. Iska: ${miss}<button type="button" class="w11hg-again w11-btn acc">${ic('refresh')}Tekrar oyna</button></div>`;
        body.querySelector('.w11hg-score').textContent = '';
      }, 250);
      emit('game-done', { game: 'hedef', mode, time: sec, misses: miss });
      return;
    }
    setTimeout(place, 220);
  }

  const wrong = (msg) => {
    miss++;
    const tip = body.querySelector('.w11hg-tip');
    tip.textContent = msg;
    tip.classList.remove('shake'); void tip.offsetWidth; tip.classList.add('shake');
    body.querySelector('.w11hg-score').textContent = `Vurulan: ${n} / ${total}  ·  Iska: ${miss}`;
    emit('game-miss', { game: 'hedef', mode, msg });
  };

  body.addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]');
    if (m) { start(m.dataset.mode); return; }
    if (e.target.closest('.w11hg-again')) { start(); return; }
    if (done || cur.hit) return;
    const t = e.target.closest('.w11hg-t');
    if (!t) { if (e.target.closest('.w11hg-field')) wrong('Iskaladınız. Fare okunun ucunu dairenin tam içine getirip tıklayın.'); return; }
    if (cur.kind === 'left') return hit();
    if (cur.kind === 'right') return wrong('Bu turuncu: farenin SAĞ tuşuyla tıklayın.');
    // Çift tık: tek tıklamaları sayıyoruz; dblclick gelmezse uyarı veriyoruz
    cur.clicks++;
    clearTimeout(cur.timer);
    cur.timer = setTimeout(() => { if (cur.clicks === 1) wrong('Bir tık oldu. İki tıklamayı daha hızlı ve fareyi oynatmadan yapın: tık-tık!'); cur.clicks = 0; }, 520);
  });
  body.addEventListener('dblclick', (e) => {
    if (done || cur.hit || !e.target.closest('.w11hg-t') || cur.kind !== 'dbl') return;
    clearTimeout(cur.timer);
    cur.clicks = 0;
    hit();
  });
  body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (done || cur.hit) return;
    const t = e.target.closest('.w11hg-t');
    if (!t) return;
    if (cur.kind === 'right') hit();
    else wrong(cur.kind === 'dbl' ? 'Balonlar SOL tuşla çift tıklanır.' : 'Bu yeşil: farenin SOL tuşuyla tıklayın.');
  });
  start();
  return { onResize: () => {}, setMode: start };
}

// ---------------------------------------------------------------- Mayın Tarlası
export function mayin({ body, emit }) {
  body.classList.add('w11a', 'w11mt');
  const N = 7, M = 6;
  let grid, over, first, flags, opened, t0 = 0, timer = 0;
  const secs = () => (t0 ? Math.min(999, Math.floor((Date.now() - t0) / 1000)) : 0);
  const stopTimer = () => { clearInterval(timer); timer = 0; };

  function reset() {
    grid = Array.from({ length: N * N }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    over = false; first = true; flags = 0; opened = 0; t0 = 0; stopTimer();
    render();
  }
  function plant(safe) {
    let k = 0;
    while (k < M) {
      const i = Math.floor(Math.random() * N * N);
      if (i === safe || grid[i].mine || near(safe).includes(i)) continue;
      grid[i].mine = true; k++;
    }
    grid.forEach((c, i) => { c.n = near(i).filter((j) => grid[j].mine).length; });
  }
  function near(i) {
    const x = i % N, y = Math.floor(i / N), out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < N && ny < N) out.push(ny * N + nx);
    }
    return out;
  }
  function open(i) {
    const c = grid[i];
    if (c.open || c.flag) return;
    c.open = true; opened++;
    if (!c.mine && !c.n) near(i).forEach(open);
  }
  function render(msg = '') {
    body.innerHTML = `<div class="w11mt-bar"><span class="w11mt-cnt">${FLAG}${M - flags}</span><button type="button" class="w11mt-face" title="Yeni oyun" aria-label="Yeni oyun">${over === 'win' ? FACE.cool : over ? FACE.dead : FACE.smile}</button><span class="w11mt-cnt w11mt-tm">${ic('clock')}<b class="w11mt-sec">${secs()}</b></span></div><div class="w11mt-msg">${msg}</div>
      <div class="w11mt-tip">Sol tık: kareyi aç · Sağ tık: bayrak koy (mayın olduğunu düşündüğünüz yere)</div>
      <div class="w11mt-grid" style="grid-template-columns:repeat(${N},1fr)">${grid.map((c, i) => `<button type="button" data-i="${i}" class="${c.open ? 'o' : ''} ${c.open && c.mine ? 'boom' : ''} n${c.n}">${c.flag ? FLAG : c.open ? (c.mine ? BOMB : c.n || '') : ''}</button>`).join('')}</div>`;
  }
  body.addEventListener('click', (e) => {
    if (e.target.closest('.w11mt-face')) { reset(); emit('mine-new'); return; }
    const b = e.target.closest('[data-i]');
    if (!b || over) return;
    const i = +b.dataset.i;
    if (grid[i].flag) return;
    if (first) { plant(i); first = false; t0 = Date.now(); timer = setInterval(() => { const e = body.querySelector('.w11mt-sec'); if (e) e.textContent = secs(); }, 500); }
    if (grid[i].mine) {
      over = 'lose'; stopTimer();
      grid.forEach((c) => { if (c.mine) c.open = true; });
      render('Mayına bastınız! Yüzü tıklayıp yeniden deneyin.');
      emit('mine-lose');
      return;
    }
    open(i);
    if (opened === N * N - M) { over = 'win'; stopTimer(); render('Kazandınız!'); emit('mine-win'); return; }
    render();
    emit('mine-reveal', { opened });
  });
  body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const b = e.target.closest('[data-i]');
    if (!b || over) return;
    const c = grid[+b.dataset.i];
    if (c.open) return;
    c.flag = !c.flag;
    flags += c.flag ? 1 : -1;
    render();
    emit('mine-flag', { flags, on: c.flag });
  });
  reset();
  return { destroy: stopTimer };
}

// ---------------------------------------------------------------- Kart Dizme (sürükle-bırak)
export function kartlar({ body, emit }) {
  body.classList.add('w11a', 'w11kd');
  const CARDS = ['A', '2', '3', '4', '5'];
  let placed;

  function reset() {
    placed = [];
    const order = [...CARDS].sort(() => Math.random() - 0.5);
    if (order.join() === CARDS.join()) order.reverse();
    body.innerHTML = `<div class="w11kd-tip">Kartları fareyle tutup (sol tuşu basılı tutarak) aşağıdaki yerlerine sürükleyin: <b>A, 2, 3, 4, 5</b> sırasıyla.</div>
      <div class="w11kd-deck">${order.map((c) => `<div class="w11kd-card" data-c="${c}"><b>${c}</b>${HEART}<em>${c}</em></div>`).join('')}</div>
      <div class="w11kd-slots">${CARDS.map((c) => `<div class="w11kd-slot" data-slot="${c}"><small>${c}</small></div>`).join('')}</div>
      <div class="w11kd-msg"></div>`;
  }

  body.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.w11kd-card');
    if (!card || card.classList.contains('done') || e.button !== 0) return;
    e.preventDefault();
    const r = card.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    const ghost = card.cloneNode(true);
    ghost.classList.add('w11kd-ghost');
    document.body.append(ghost);
    card.classList.add('lift');
    const mv = (ev) => { ghost.style.left = ev.clientX - ox + 'px'; ghost.style.top = ev.clientY - oy + 'px'; };
    mv(e);
    const up = (ev) => {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      ghost.remove();
      card.classList.remove('lift');
      const slot = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.w11kd-slot');
      const msg = body.querySelector('.w11kd-msg');
      if (!slot) { emit('card-drop', { ok: false, none: true }); return; }
      if (slot.dataset.slot !== card.dataset.c || slot.querySelector('.w11kd-card')) {
        msg.textContent = `“${card.dataset.c}” kartının yeri orası değil. ${card.dataset.c} yazan yere bırakın.`;
        slot.classList.add('no'); setTimeout(() => slot.classList.remove('no'), 500);
        emit('card-drop', { ok: false });
        return;
      }
      card.classList.add('done');
      slot.append(card);
      placed.push(card.dataset.c);
      msg.innerHTML = `${ic('check')}Güzel!`;
      emit('card-drop', { ok: true, n: placed.length });
      if (placed.length === CARDS.length) {
        msg.innerHTML = `${ic('check')}Bütün kartları dizdiniz! <button type="button" class="w11kd-again w11-btn acc">${ic('refresh')}Tekrar</button>`;
        emit('cards-done');
      }
    };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  });
  body.addEventListener('click', (e) => { if (e.target.closest('.w11kd-again')) reset(); });
  reset();
  return {};
}
