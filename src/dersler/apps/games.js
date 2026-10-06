// Fare alıştırma oyunları: Hedef (tık / çift tık / sağ tık), Mayın Tarlası, Kart Dizme (sürükle-bırak)

const MODES = {
  click: ['Tek tık', 'Yeşil daireye farenin sol tuşuyla bir kez tıklayın.'],
  dbl: ['Çift tık', 'Balona sol tuşla hızlıca iki kez tıklayın: “tık-tık”.'],
  right: ['Sağ tık', 'Turuncu daireye farenin sağ tuşuyla tıklayın.'],
  mixed: ['Karışık', 'Yeşil → sol tık, turuncu → sağ tık.'],
};

export function hedef({ body, args, emit, setTitle }) {
  body.classList.add('hg');
  let mode = args.mode || 'click';
  const total = args.total || 10;
  let n = 0, miss = 0, t0 = 0, cur = null, done = false;

  function start(m = mode) {
    mode = m;
    n = 0; miss = 0; done = false; t0 = performance.now();
    setTitle(`Hedef Oyunu: ${MODES[mode][0]}`);
    body.innerHTML = `<div class="hg-bar"><div class="hg-modes">${Object.entries(MODES).map(([k, [l]]) => `<button type="button" data-mode="${k}" class="${k === mode ? 'on' : ''}">${l}</button>`).join('')}</div><span class="hg-score"></span></div>
      <div class="hg-tip">${MODES[mode][1]}</div><div class="hg-field"></div>`;
    place();
    emit('game-start', { game: 'hedef', mode });
  }

  function place() {
    const f = body.querySelector('.hg-field');
    const W = f.clientWidth || 500, H = f.clientHeight || 300;
    const size = Math.round(96 - (n / total) * 50);
    const kind = mode === 'mixed' ? (Math.random() < 0.5 ? 'left' : 'right') : mode === 'right' ? 'right' : mode === 'dbl' ? 'dbl' : 'left';
    cur = { kind, clicks: 0 };
    f.innerHTML = `<button type="button" class="hg-t ${kind}" style="width:${size}px;height:${size}px;left:${Math.round(Math.random() * Math.max(10, W - size - 10))}px;top:${Math.round(Math.random() * Math.max(10, H - size - 10))}px">${kind === 'dbl' ? '🎈' : ''}</button>`;
    body.querySelector('.hg-score').textContent = `Vurulan: ${n} / ${total}  ·  Iska: ${miss}`;
  }

  function hit() {
    cur.hit = true;
    n++;
    const t = body.querySelector('.hg-t');
    t.classList.add('pop');
    emit('game-hit', { game: 'hedef', mode, n, total });
    if (n >= total) {
      done = true;
      const sec = Math.round((performance.now() - t0) / 1000);
      setTimeout(() => {
        body.querySelector('.hg-field').innerHTML = `<div class="hg-done">🎉 Tebrikler!<br><b>${total}</b> hedefi <b>${sec}</b> saniyede vurdunuz. Iska: ${miss}<br><button type="button" class="hg-again">↻ Tekrar oyna</button></div>`;
        body.querySelector('.hg-score').textContent = '';
      }, 250);
      emit('game-done', { game: 'hedef', mode, time: sec, misses: miss });
      return;
    }
    setTimeout(place, 220);
  }

  const wrong = (msg) => {
    miss++;
    const tip = body.querySelector('.hg-tip');
    tip.textContent = msg;
    tip.classList.remove('shake'); void tip.offsetWidth; tip.classList.add('shake');
    body.querySelector('.hg-score').textContent = `Vurulan: ${n} / ${total}  ·  Iska: ${miss}`;
    emit('game-miss', { game: 'hedef', mode, msg });
  };

  body.addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]');
    if (m) { start(m.dataset.mode); return; }
    if (e.target.closest('.hg-again')) { start(); return; }
    if (done || cur.hit) return;
    const t = e.target.closest('.hg-t');
    if (!t) { if (e.target.closest('.hg-field')) wrong('Iskaladınız. Fare okunun ucunu dairenin tam içine getirip tıklayın.'); return; }
    if (cur.kind === 'left') return hit();
    if (cur.kind === 'right') return wrong('Bu turuncu: farenin SAĞ tuşuyla tıklayın.');
    // Çift tık: tek tıklamaları sayıyoruz; dblclick gelmezse uyarı veriyoruz
    cur.clicks++;
    clearTimeout(cur.timer);
    cur.timer = setTimeout(() => { if (cur.clicks === 1) wrong('Bir tık oldu. İki tıklamayı daha hızlı ve fareyi oynatmadan yapın: tık-tık!'); cur.clicks = 0; }, 520);
  });
  body.addEventListener('dblclick', (e) => {
    if (done || cur.hit || !e.target.closest('.hg-t') || cur.kind !== 'dbl') return;
    clearTimeout(cur.timer);
    cur.clicks = 0;
    hit();
  });
  body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (done || cur.hit) return;
    const t = e.target.closest('.hg-t');
    if (!t) return;
    if (cur.kind === 'right') hit();
    else wrong(cur.kind === 'dbl' ? 'Balonlar SOL tuşla çift tıklanır.' : 'Bu yeşil: farenin SOL tuşuyla tıklayın.');
  });
  start();
  return { onResize: () => {}, setMode: start };
}

// ---------------------------------------------------------------- Mayın Tarlası
export function mayin({ body, emit }) {
  body.classList.add('mt');
  const N = 7, M = 6;
  let grid, over, first, flags, opened;

  function reset() {
    grid = Array.from({ length: N * N }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    over = false; first = true; flags = 0; opened = 0;
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
    body.innerHTML = `<div class="mt-bar"><span>🚩 ${M - flags}</span><button type="button" class="mt-face" title="Yeni oyun">${over === 'win' ? '😎' : over ? '😵' : '🙂'}</button><span>${msg}</span></div>
      <div class="mt-tip">Sol tık: kareyi aç · Sağ tık: bayrak koy (mayın olduğunu düşündüğünüz yere)</div>
      <div class="mt-grid" style="grid-template-columns:repeat(${N},1fr)">${grid.map((c, i) => `<button type="button" data-i="${i}" class="${c.open ? 'o' : ''} ${c.open && c.mine ? 'boom' : ''} n${c.n}">${c.flag ? '🚩' : c.open ? (c.mine ? '💣' : c.n || '') : ''}</button>`).join('')}</div>`;
  }
  body.addEventListener('click', (e) => {
    if (e.target.closest('.mt-face')) { reset(); emit('mine-new'); return; }
    const b = e.target.closest('[data-i]');
    if (!b || over) return;
    const i = +b.dataset.i;
    if (grid[i].flag) return;
    if (first) { plant(i); first = false; }
    if (grid[i].mine) {
      over = 'lose';
      grid.forEach((c) => { if (c.mine) c.open = true; });
      render('Mayına bastınız! Yüzü tıklayıp yeniden deneyin.');
      emit('mine-lose');
      return;
    }
    open(i);
    if (opened === N * N - M) { over = 'win'; render('Kazandınız! 🎉'); emit('mine-win'); return; }
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
  return {};
}

// ---------------------------------------------------------------- Kart Dizme (sürükle-bırak)
export function kartlar({ body, emit }) {
  body.classList.add('kd');
  const CARDS = ['A', '2', '3', '4', '5'];
  let placed;

  function reset() {
    placed = [];
    const order = [...CARDS].sort(() => Math.random() - 0.5);
    if (order.join() === CARDS.join()) order.reverse();
    body.innerHTML = `<div class="kd-tip">Kartları fareyle tutup (sol tuşu basılı tutarak) aşağıdaki yerlerine sürükleyin: <b>A, 2, 3, 4, 5</b> sırasıyla.</div>
      <div class="kd-deck">${order.map((c) => `<div class="kd-card" data-c="${c}"><b>${c}</b><span>♥</span></div>`).join('')}</div>
      <div class="kd-slots">${CARDS.map((c) => `<div class="kd-slot" data-slot="${c}"><small>${c}</small></div>`).join('')}</div>
      <div class="kd-msg"></div>`;
  }

  body.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.kd-card');
    if (!card || card.classList.contains('done') || e.button !== 0) return;
    e.preventDefault();
    const r = card.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    const ghost = card.cloneNode(true);
    ghost.classList.add('kd-ghost');
    document.body.append(ghost);
    card.classList.add('lift');
    const mv = (ev) => { ghost.style.left = ev.clientX - ox + 'px'; ghost.style.top = ev.clientY - oy + 'px'; };
    mv(e);
    const up = (ev) => {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      ghost.remove();
      card.classList.remove('lift');
      const slot = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.kd-slot');
      const msg = body.querySelector('.kd-msg');
      if (!slot) { emit('card-drop', { ok: false, none: true }); return; }
      if (slot.dataset.slot !== card.dataset.c || slot.querySelector('.kd-card')) {
        msg.textContent = `“${card.dataset.c}” kartının yeri orası değil. ${card.dataset.c} yazan yere bırakın.`;
        slot.classList.add('no'); setTimeout(() => slot.classList.remove('no'), 500);
        emit('card-drop', { ok: false });
        return;
      }
      card.classList.add('done');
      slot.append(card);
      placed.push(card.dataset.c);
      msg.textContent = 'Güzel! ✔';
      emit('card-drop', { ok: true, n: placed.length });
      if (placed.length === CARDS.length) {
        msg.innerHTML = '🎉 Bütün kartları dizdiniz! <button type="button" class="kd-again">↻ Tekrar</button>';
        emit('cards-done');
      }
    };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  });
  body.addEventListener('click', (e) => { if (e.target.closest('.kd-again')) reset(); });
  reset();
  return {};
}
