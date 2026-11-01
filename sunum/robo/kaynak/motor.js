// Robo tahta sunumları: ortak motor (gezinme, ızgara oynatıcı, kod blokları, sorular, sıralama, dönüş oyuncağı)
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const deck = $('#deck');
const again = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ---------- Robo ve yıldız çizimi ---------- */
const ROBO = `<svg class="robo" viewBox="0 0 100 106" aria-hidden="true">
<g class="ant"><line x1="50" y1="7" x2="50" y2="20"/><circle class="bulb" cx="50" cy="7" r="5.5"/></g>
<g class="arm arm-l"><rect x="9" y="62" width="17" height="8" rx="4"/><circle cx="10" cy="66" r="5.5"/></g>
<g class="arm arm-r"><rect x="74" y="62" width="17" height="8" rx="4"/><circle cx="90" cy="66" r="5.5"/></g>
<rect class="wheel" x="27" y="88" width="17" height="13" rx="5"/><rect class="wheel" x="56" y="88" width="17" height="13" rx="5"/>
<rect class="body" x="25" y="57" width="50" height="34" rx="11"/><circle class="heart" cx="50" cy="74" r="6.5"/>
<rect class="head" x="16" y="18" width="68" height="45" rx="17"/><rect class="face" x="24" y="25" width="52" height="31" rx="12"/>
<g class="eye"><circle cx="39" cy="38" r="7.5"/><circle class="pup" cx="39" cy="38" r="3.8"/></g>
<g class="eye"><circle cx="61" cy="38" r="7.5"/><circle class="pup" cx="61" cy="38" r="3.8"/></g>
<path class="mouth" d="M42 47 Q50 54 58 47"/><circle class="cheek" cx="29" cy="49" r="3.5"/><circle class="cheek" cx="71" cy="49" r="3.5"/></svg>`;
const STAR = `<svg class="st" viewBox="0 0 24 24"><path d="M12 1.8l3.1 6.6 7.1.9-5.2 5 1.3 7.1L12 18l-6.3 3.4 1.3-7.1-5.2-5 7.1-.9z" fill="#ffd23f" stroke="#e09a00" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
$$('[data-robo]').forEach((el) => (el.innerHTML = ROBO));

/* ---------- Program dili ----------
   F ileri, B geri, L sola, R sağa, P yıldızı al, f fonksiyon çağır, A alkış, M masaya vur
   3(...) döngü, i{c}(...) eğer, e{c}(...)(...) eğer-değilse, u{c}(...) olana kadar tekrarla */
const CMDS = {
  F: ['⬆', 'İleri git'], B: ['⬇', 'Geri git'], R: ['↱', 'Sağa dön'], L: ['↰', 'Sola dön'],
  P: ['✋', 'Yıldızı al'], A: ['👏', 'Alkış'], M: ['🥁', 'Masaya vur'],
};
const CONDS = { star: 'yıldızın üstündeyim', blocked: 'önümde engel var', open: 'önüm açık', left: 'solum açık', right: 'sağım açık', goal: 'pile ulaştım' };
const CONDQ = { star: 'Yıldızın üstünde miyim?', blocked: 'Önümde engel var mı?', open: 'Önüm açık mı?', left: 'Solum açık mı?', right: 'Sağım açık mı?', goal: 'Pile ulaştım mı?' };
let uid = 0;
function parse(str) {
  let i = 0;
  const cond = () => { const j = str.indexOf('}', i); const c = str.slice(i + 1, j); i = j + 1; return c; };
  const group = () => { i++; const b = seq(); i++; return b; };
  const seq = () => {
    const out = [];
    while (i < str.length && str[i] !== ')') {
      const ch = str[i];
      if (/\d/.test(ch)) { let n = ''; while (/\d/.test(str[i])) n += str[i++]; out.push({ t: 'loop', n: +n, body: group(), id: 'n' + uid++ }); }
      else if (ch === 'i') { i++; const c = cond(); out.push({ t: 'if', c, body: group(), id: 'n' + uid++ }); }
      else if (ch === 'e') { i++; const c = cond(); const a = group(); const b = group(); out.push({ t: 'ife', c, body: a, alt: b, id: 'n' + uid++ }); }
      else if (ch === 'u') { i++; const c = cond(); out.push({ t: 'until', c, body: group(), id: 'n' + uid++ }); }
      else if (ch === ' ') i++;
      else { out.push({ t: 'cmd', op: ch, id: 'n' + uid++ }); i++; }
    }
    return out;
  };
  return seq();
}
const hasNested = (nodes, d = 0) => nodes.some((n) => (n.t === 'loop' || n.t === 'until') ? (d >= 1 || hasNested(n.body, d + 1)) : n.body ? hasNested(n.body, d) || (n.alt && hasNested(n.alt, d)) : false);
const NAMES = ['Büyük döngü', 'Küçük döngü'];
function renderCode(nodes, opt, depth = 0) {
  return nodes.map((n) => {
    if (n.t === 'cmd') {
      if (n.op === 'f') return `<div class="cmd c-f" data-id="${n.id}"><span class="ic">🧩</span>${opt.fname}</div>`;
      return `<div class="cmd c-${n.op}" data-id="${n.id}"><span class="ic">${CMDS[n.op][0]}</span>${CMDS[n.op][1]}</div>`;
    }
    if (n.t === 'loop') {
      const d = Math.min(depth, 1);
      return `<div class="blk d${d}" data-id="${n.id}"><div class="lh"><span>🔁 ${n.n} kez tekrarla</span>${opt.named ? `<span class="nm">${NAMES[d]}</span>` : ''}${n.n <= 9 ? `<span class="beads">${'<i class="bd"></i>'.repeat(n.n)}</span>` : ''}</div>${renderCode(n.body, opt, depth + 1)}</div>`;
    }
    if (n.t === 'until') return `<div class="blk d${Math.min(depth, 1)}" data-id="${n.id}"><div class="lh"><span>🔁 <span class="cond">${CONDS[n.c]}</span> olana kadar tekrarla</span><span class="tur" hidden></span></div>${renderCode(n.body, opt, depth + 1)}</div>`;
    const head = `<div class="lh"><span>❓ eğer <span class="cond">${CONDS[n.c]}</span> ise</span></div>`;
    if (n.t === 'if') return `<div class="blk if" data-id="${n.id}">${head}${renderCode(n.body, opt, depth)}</div>`;
    return `<div class="blk if" data-id="${n.id}">${head}${renderCode(n.body, opt, depth)}<div class="else">değilse</div>${renderCode(n.alt, opt, depth)}</div>`;
  }).join('');
}
function* exec(nodes, ctx, fn) {
  for (const n of nodes) {
    if (n.t === 'cmd') {
      if (n.op === 'f') { yield { t: 'call', id: n.id }; yield* exec(fn, ctx, fn); }
      else yield { t: 'cmd', op: n.op, id: n.id };
    } else if (n.t === 'loop') {
      for (let k = 1; k <= n.n; k++) {
        ctx.cnt[n.id] = k; desc(n.body).forEach((id) => delete ctx.cnt[id]);
        yield { t: 'loop', id: n.id, k };
        yield* exec(n.body, ctx, fn);
      }
    } else if (n.t === 'until') {
      for (let k = 1; ; k++) {
        const v = ctx.test(n.c);
        yield { t: 'cond', id: n.id, c: n.c, v, until: true };
        if (v) break;
        ctx.cnt[n.id] = k; desc(n.body).forEach((id) => delete ctx.cnt[id]);
        yield { t: 'loop', id: n.id, k, until: true };
        yield* exec(n.body, ctx, fn);
      }
    } else {
      const v = ctx.test(n.c);
      yield { t: 'cond', id: n.id, c: n.c, v };
      if (v) yield* exec(n.body, ctx, fn); else if (n.alt) yield* exec(n.alt, ctx, fn);
    }
  }
}
function desc(list, out = []) { for (const c of list) { if (c.t === 'loop' || c.t === 'until') out.push(c.id); if (c.body) desc(c.body, out); if (c.alt) desc(c.alt, out); } return out; }

/* Kod kutularını çiz */
$$('[data-code]').forEach((el) => {
  const t = parse(el.dataset.code);
  el._tree = t;
  el.innerHTML = renderCode(t, { fname: el.dataset.fname || 'Fonksiyon', named: el.dataset.named ? el.dataset.named === '1' : hasNested(t) });
});

/* ---------- Izgara ---------- */
// . çimen, S başlangıç, G pil, * yıldız, # ağaç, ~ su, k anahtar, D kapı, boşluk yol yok
const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1], DIRS = { E: 0, S: 1, W: 2, N: 3 };
function makeGrid(box) {
  const maps = box.dataset.maps ? JSON.parse(box.dataset.maps) : [box.dataset.grid.split('|')];
  const st = { box, maps, mi: 0, d0: DIRS[box.dataset.dir || 'E'] };
  box.style.setProperty('--c', (box.dataset.size || 100) + 'px');
  if (box.dataset.lr) box.classList.add('lr');
  if (maps.length > 1) {
    const tabs = document.createElement('div');
    tabs.className = 'maptabs';
    tabs.innerHTML = maps.map((_, j) => `<button>${j + 1}. harita</button>`).join('');
    box.before(tabs);
    st.tabs = $$('button', tabs);
    st.tabs.forEach((b, j) => (b.onclick = () => { st.mi = j; st.onswitch && st.onswitch(); build(); }));
  }
  function build() {
    const rows = maps[st.mi];
    st.rows = rows; st.w = Math.max(...rows.map((r) => r.length)); st.h = rows.length;
    st.tabs && st.tabs.forEach((b, j) => b.classList.toggle('on', j === st.mi));
    const g = document.createElement('div');
    g.className = 'grid';
    g.style.gridTemplateColumns = `repeat(${st.w}, var(--c))`;
    st.cells = [];
    for (let y = 0; y < st.h; y++) for (let x = 0; x < st.w; x++) {
      const ch = rows[y][x] ?? ' ';
      const c = document.createElement('div');
      c.className = 'cell' + ((x + y) % 2 ? ' alt' : '') + (ch === '~' ? ' W' : ch === ' ' ? ' X' : ch === 'S' ? ' S' : '');
      if (ch === '*') c.innerHTML = STAR;
      else if (ch === 'G') c.innerHTML = '<span>🔋</span>';
      else if (ch === '#') c.innerHTML = '<span>🌳</span>';
      else if (ch === 'k') c.innerHTML = '<span class="key">🔑</span>';
      else if (ch === 'D') c.innerHTML = '<span class="door">🚪</span>';
      if (ch === 'S') st.start = [x, y];
      g.appendChild(c); st.cells.push(c);
    }
    const bot = document.createElement('div');
    bot.className = 'bot';
    bot.innerHTML = `<div class="rot"><div class="arrow"></div><div class="robo-in">${ROBO}</div><span class="lbl l">sol</span><span class="lbl r">sağ</span></div>`;
    g.appendChild(bot);
    st.g = g; st.bot = bot;
    box.innerHTML = ''; box.appendChild(g);
    reset();
  }
  function reset() {
    st.x = st.start[0]; st.y = st.start[1]; st.d = st.d0; st.turn = st.d0; st.key = false; st.dead = false; st.stars = 0;
    st.total = st.rows.join('').split('*').length - 1;
    $$('.got', st.g).forEach((s) => s.classList.remove('got'));
    $$('.door', st.g).forEach((s) => s.classList.remove('open'));
    st.bot.classList.remove('sink', 'crash');
    $$('.gmsg', box).forEach((m) => m.remove());
    place(true);
  }
  function place(instant) {
    const b = st.bot, rot = $('.rot', b), ri = $('.robo-in', b);
    if (instant) [b, rot, ri, ...$$('.lbl', b)].forEach((e) => (e.style.transition = 'none'));
    b.style.transform = `translate(calc(${st.x} * var(--c)), calc(${st.y} * var(--c)))`;
    rot.style.transform = `rotate(${st.turn * 90}deg)`;
    ri.style.transform = `rotate(${-st.turn * 90}deg)`;
    $$('.lbl', b).forEach((l) => (l.style.transform = `translateX(-50%) rotate(${-st.turn * 90}deg)`));
    if (instant) { b.offsetHeight; [b, rot, ri, ...$$('.lbl', b)].forEach((e) => (e.style.transition = '')); }
  }
  const at = (x, y) => (x < 0 || y < 0 || x >= st.w || y >= st.h ? null : st.rows[y][x] ?? ' ');
  const cell = (x, y) => st.cells[y * st.w + x];
  const walk = (x, y) => { const ch = at(x, y); return !(ch == null || ch === '#' || ch === ' ' || ch === '~' || (ch === 'D' && !st.key)); };
  st.test = (c) => {
    const d = st.d;
    if (c === 'star') { const s = $('.st', cell(st.x, st.y)); return !!s && !s.classList.contains('got'); }
    if (c === 'goal') return at(st.x, st.y) === 'G';
    if (c === 'open') return walk(st.x + DX[d], st.y + DY[d]);
    if (c === 'blocked') return !walk(st.x + DX[d], st.y + DY[d]);
    if (c === 'left') { const e = (d + 3) % 4; return walk(st.x + DX[e], st.y + DY[e]); }
    if (c === 'right') { const e = (d + 1) % 4; return walk(st.x + DX[e], st.y + DY[e]); }
    return false;
  };
  st.msg = (text, kind) => {
    $$('.gmsg', box).forEach((m) => m.remove());
    const m = document.createElement('div'); m.className = 'gmsg ' + (kind || ''); m.textContent = text; box.appendChild(m);
  };
  const pick = () => {
    const s = $('.st', cell(st.x, st.y));
    if (s && !s.classList.contains('got')) { s.classList.add('got'); st.stars++; again(st.bot, 'bump'); return true; }
    return false;
  };
  st.do = (op, autoStar) => {
    if (op === 'R') { st.d = (st.d + 1) % 4; st.turn++; place(); return; }
    if (op === 'L') { st.d = (st.d + 3) % 4; st.turn--; place(); return; }
    if (op === 'P') { if (!pick()) st.msg('Burada yıldız yok! 🤔'); return; }
    const s = op === 'F' ? 1 : -1, nx = st.x + DX[st.d] * s, ny = st.y + DY[st.d] * s, ch = at(nx, ny);
    if (ch == null || ch === '#' || ch === ' ') { st.dead = true; again(st.bot, 'crash'); st.msg(ch === '#' ? 'Ağaca çarptım! 💥' : 'Orada yol yok! 💥', 'bad'); return; }
    if (ch === 'D' && !st.key) { st.dead = true; again(st.bot, 'crash'); st.msg('Kapı kilitli! 🔒', 'bad'); return; }
    st.x = nx; st.y = ny; place();
    if (ch === '~') { st.dead = true; setTimeout(() => st.bot.classList.add('sink'), 350); st.msg('Suya düştüm! 💦', 'bad'); return; }
    if (ch === 'k' && !st.key) { st.key = true; const k = $('.key', cell(nx, ny)); k && k.classList.add('got'); $$('.door', st.g).forEach((d) => d.classList.add('open')); again(st.bot, 'bump'); }
    if (autoStar) pick();
  };
  st.reset = reset;
  build();
  return st;
}

/* ---------- Oynatıcı ---------- */
function makePlayer(pl) {
  const codeEl = $('.code[data-code]', pl), fnEl = $('.code.fnbody', pl), box = $('.gridbox', pl), beatEl = $('.beat', pl);
  const grid = box ? makeGrid(box) : null;
  let tree = codeEl._tree;
  const fn = fnEl ? fnEl._tree : [];
  const allText = $$('[data-prog]', pl).map((b) => b.dataset.prog).join('') + codeEl.dataset.code + (fnEl ? fnEl.dataset.code : '');
  const autoStar = !allText.includes('P');
  const ptabs = $$('.progtabs button', pl);
  ptabs.forEach((b) => (b.onclick = () => {
    ptabs.forEach((x) => x.classList.toggle('on', x === b));
    codeEl.dataset.code = b.dataset.prog;
    codeEl.classList.toggle('flow', !/[\d(){}f]/.test(b.dataset.prog));
    if (codeEl.classList.contains('flow')) codeEl.style.width = '';
    tree = codeEl._tree = parse(b.dataset.prog);
    codeEl.innerHTML = renderCode(tree, { fname: codeEl.dataset.fname || 'Fonksiyon', named: hasNested(tree) });
    reset();
  }));
  const limit = +(pl.dataset.limit || 400);
  const btnPlay = $('[data-act="play"]', pl), btnSlow = $('[data-act="slow"]', pl);
  let gen = null, timer = null, slow = true, steps = 0, ctx = null;
  const codes = [codeEl, fnEl].filter(Boolean);
  const clearHl = () => codes.forEach((c) => { $$('.on', c).forEach((e) => e.classList.remove('on')); $$('.bub', c).forEach((e) => e.remove()); });
  const showBeads = () => codes.forEach((c) => $$('.blk', c).forEach((lp) => {
    const k = (ctx && ctx.cnt[lp.dataset.id]) || 0;
    $$(':scope > .lh .bd', lp).forEach((b, j) => b.classList.toggle('done', j < k));
    const tr = $(':scope > .lh .tur', lp); if (tr) { tr.hidden = !k; tr.textContent = `${k}. tur`; }
  }));
  const node = (id) => codes.map((c) => $(`[data-id="${id}"]`, c)).find(Boolean);
  const bub = (lh, text, cls) => { const b = document.createElement('span'); b.className = 'bub ' + (cls || ''); b.textContent = text; lh.appendChild(b); };
  const hooks = beatEl ? beatHooks(pl, beatEl) : null;
  function reset() {
    clearTimeout(timer); timer = null; gen = null; ctx = null; steps = 0;
    clearHl(); showBeads(); grid && grid.reset(); hooks && hooks.reset();
    btnPlay.textContent = '▶ Oynat';
  }
  function stop() { clearTimeout(timer); timer = null; if (gen) btnPlay.textContent = '▶ Devam'; }
  function finish() {
    timer = null; gen = null; clearHl(); btnPlay.textContent = '▶ Oynat';
    if (hooks) { hooks.done(); return; }
    if (grid.dead) return;
    if (grid.test('goal')) {
      grid.msg(grid.total ? `Pile ulaştım! ⭐ ${grid.stars}/${grid.total}` : 'Pile ulaştım! 🎉', 'ok');
      if (!grid.total || grid.stars === grid.total) confetti(40);
    } else grid.msg('Pile ulaşamadım 🤔', 'bad');
  }
  function tick() {
    if (++steps > limit) { clearHl(); grid && grid.msg('Sonsuz döngü! Hiç bitmiyor 🔄', 'bad'); timer = null; gen = null; btnPlay.textContent = '▶ Oynat'; return; }
    const r = gen.next();
    if (r.done) return finish();
    const s = r.value;
    clearHl(); showBeads();
    const el = node(s.id);
    let wait = slow ? 950 : 460;
    if (s.t === 'loop') {
      const lh = $(':scope > .lh', el); lh.classList.add('on');
      if (s.k > 1) { bub(lh, `🔁 Başa dön: ${s.k}. tur`); wait = slow ? 1200 : 650; } else wait = slow ? 600 : 280;
      hooks && hooks.loop(s, el);
    } else if (s.t === 'cond') {
      const lh = $(':scope > .lh', el); lh.classList.add('on');
      bub(lh, `${CONDQ[s.c]} ${s.v ? 'EVET ✔' : 'HAYIR ✘'}`, s.v ? 'yes' : 'no');
      wait = slow ? 1300 : 650;
    } else if (s.t === 'call') { el.classList.add('on'); wait = slow ? 800 : 400; }
    else {
      el.classList.add('on');
      if (hooks) hooks.cmd(s);
      else { grid.do(s.op, autoStar); if (grid.dead) { el.classList.add('bad'); timer = null; gen = null; btnPlay.textContent = '▶ Oynat'; return; } }
    }
    timer = setTimeout(tick, wait);
  }
  btnPlay.onclick = () => {
    if (timer) { stop(); return; }
    if (!gen) { reset(); ctx = { cnt: {}, test: (c) => grid.test(c) }; gen = exec(tree, ctx, fn); }
    btnPlay.textContent = '⏸ Dur';
    tick();
  };
  $('[data-act="reset"]', pl).onclick = reset;
  btnSlow.onclick = () => { slow = !slow; btnSlow.classList.toggle('on', slow); btnSlow.textContent = slow ? '🐢 Yavaş' : '🐇 Hızlı'; };
  if (grid) grid.onswitch = () => { clearTimeout(timer); timer = null; gen = null; clearHl(); ctx = null; showBeads(); btnPlay.textContent = '▶ Oynat'; };
  return { reset, stop };
}
/* Ritim sahnesi (👏 / 🥁) */
function beatHooks(pl, beat) {
  const bx = $('.bx', beat), tx = $('.tx', beat), tally = $('.tally', pl);
  let grp = null;
  return {
    reset() { bx.textContent = '🙂'; tx.textContent = 'Hazır mısın?'; tally.innerHTML = ''; grp = null; },
    loop(s, el) { if (!el.parentElement.closest('.blk')) { grp = document.createElement('div'); grp.className = 'grp'; tally.appendChild(grp); tx.textContent = `${s.k}. tur`; bx.textContent = '🔁'; } },
    cmd(s) {
      bx.textContent = CMDS[s.op][0]; tx.textContent = s.op === 'A' ? 'Alkış!' : 'Masaya vur!';
      again(bx, 'hit');
      const e = document.createElement('span'); e.textContent = CMDS[s.op][0]; (grp || tally).appendChild(e);
    },
    done() { bx.textContent = '🎉'; tx.textContent = 'Bitti! Bravo!'; },
  };
}
const players = $$('.player').map(makePlayer);
$$('.gridbox').forEach((b) => { if (!b.closest('.player') && !b.closest('.turn')) makeGrid(b); });

/* ---------- Dönüş oyuncağı ---------- */
const DIRTXT = ['➡️ sağa', '⬇️ aşağı', '⬅️ sola', '⬆️ yukarı'];
$$('.turn').forEach((t) => {
  const box = $('.gridbox', t);
  box.dataset.grid = 'S'; box.dataset.size = 250; box.dataset.lr = '1';
  const g = makeGrid(box);
  $('.grid', box).style.border = 'none'; $('.grid', box).style.background = 'transparent'; $('.cell', box).style.background = 'transparent';
  $('.cell', box).classList.remove('S');
  const tx = $('.ttx', t);
  const show = () => (tx.innerHTML = `Robo ekranda <b>${DIRTXT[g.d]}</b> bakıyor`);
  $('[data-act="L"]', t).onclick = () => { g.do('L'); show(); };
  $('[data-act="R"]', t).onclick = () => { g.do('R'); show(); };
  $('[data-act="0"]', t).onclick = () => { g.reset(); show(); };
  t._reset = () => { g.reset(); show(); };
  show();
});

/* ---------- İki elle sayma (büyük/küçük döngü) ---------- */
let handTimer = null;
function handsStart(h) {
  const hb = $('.hb', h), hk = $('.hk', h), nb = +(h.dataset.big || 3), nk = +(h.dataset.small || 3);
  let b = 1, k = 0;
  hb.textContent = 1; hk.textContent = 1;
  const t = () => {
    k++;
    if (k > nk) { k = 1; b = b % nb + 1; hb.textContent = b; again(hb, 'flash'); }
    hk.textContent = k; again(hk, 'flash');
    handTimer = setTimeout(t, k === nk ? 1500 : 1000);
  };
  handTimer = setTimeout(t, 400);
}

/* ---------- Sorular ---------- */
$$('.opts').forEach((box) => {
  const a = +box.dataset.a, opts = $$('.opt', box), why = box.parentElement.querySelector('.why');
  const choose = (j) => {
    if (!opts[j]) return;
    if (j === a) { opts[j].classList.add('ok'); why && why.classList.add('vis'); confetti(30); }
    else again(opts[j], 'no');
  };
  opts.forEach((o, j) => (o.onclick = () => choose(j)));
  box._choose = choose;
  box._reset = () => { opts.forEach((o) => o.classList.remove('ok', 'no')); why && why.classList.remove('vis'); };
});

/* ---------- Sıralama ---------- */
$$('.order').forEach((o) => {
  const items = JSON.parse(o.dataset.items);
  const pool = $('.pool', o), done = $('.done', o);
  const perm = items.map((_, j) => j).sort((x, y) => ((x * 7 + 3) % items.length) - ((y * 7 + 3) % items.length));
  const reset = () => {
    done.innerHTML = '';
    pool.innerHTML = perm.map((j) => `<button class="ocard" data-j="${j}"><span class="e">${items[j][0]}</span>${items[j][1]}</button>`).join('');
    $$('.ocard', pool).forEach((c) => (c.onclick = () => {
      if (+c.dataset.j === done.children.length) { done.appendChild(c); c.onclick = null; if (done.children.length === items.length) confetti(40); }
      else again(c, 'no');
    }));
  };
  o._reset = reset;
  const sh = $('[data-act="show"]', o.parentElement);
  sh && (sh.onclick = () => { let j = done.children.length; const t = setInterval(() => { const c = $(`.ocard[data-j="${j}"]`, pool); if (!c) { clearInterval(t); return; } c.click(); j++; }, 450); });
  reset();
});

/* ---------- Konfeti ve gökyüzü ---------- */
function confetti(n) {
  const cols = ['#7c4dff', '#ff8a00', '#ffd23f', '#1fa35b', '#2a9df4', '#ff5d8f'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div'); c.className = 'cf';
    c.style.left = Math.random() * 1600 + 'px';
    c.style.background = cols[i % cols.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.4 + 's';
    deck.appendChild(c); setTimeout(() => c.remove(), 4000);
  }
}
$$('.sky').forEach((s) => (s.innerHTML = Array.from({ length: 26 }, (_, i) => `<span style="left:${(i * 61) % 100}%;top:${(i * 37) % 92}%;font-size:${18 + (i % 4) * 10}px;animation-delay:${(i % 7) * 0.35}s">★</span>`).join('')));

/* ---------- Gezinme ---------- */
const secs = $$('.s');
let cur = 0;
const dots = $('#dots'), note = $('#note'), menu = $('#menu');
secs.forEach((s, j) => {
  const d = document.createElement('i');
  if (s.classList.contains('lcover') && j) d.className = 'sep';
  d.title = s.dataset.where || '';
  d.onclick = () => go(j); dots.appendChild(d);
  if (s.dataset.where && !s.classList.contains('cover') && !s.classList.contains('lcover')) {
    const w = document.createElement('div'); w.className = 'where'; w.innerHTML = `<i></i>${s.dataset.where}`; s.appendChild(w);
  }
});
// Ders menüsü
$('.grp', menu).innerHTML = secs.map((s, j) => (s.classList.contains('lcover') || s.classList.contains('cover') || s.dataset.menu)
  ? `<button data-j="${j}">${s.dataset.menu || s.dataset.where || 'Kapak'}<small>${s.dataset.sub || ''}</small></button>` : '').join('');
$$('button', menu).forEach((b) => (b.onclick = () => { menu.classList.remove('vis'); go(+b.dataset.j); }));
function go(j, back) {
  if (j < 0 || j >= secs.length) return;
  players.forEach((p) => p.stop());
  secs[cur].classList.remove('on');
  cur = j;
  const s = secs[cur];
  s.classList.add('on');
  deck.style.setProperty('--lc', s.dataset.color || '#7c4dff');
  $$('.f', s).forEach((f) => f.classList.toggle('vis', !!back));
  $$('.opts', s).forEach((o) => o._reset());
  $$('.order', s).forEach((o) => o._reset());
  $$('.turn', s).forEach((t) => t._reset());
  clearTimeout(handTimer); $$('.hands', s).forEach(handsStart);
  if (s.dataset.end) setTimeout(() => confetti(70), 300);
  deck.classList.toggle('dark', s.classList.contains('cover') || s.classList.contains('lcover'));
  $$('i', dots).forEach((d, k) => d.classList.toggle('on', k === cur));
  note.innerHTML = s.dataset.note || '<i>Bu slayt için not yok.</i>';
  history.replaceState(null, '', '#' + (cur + 1));
}
function next() { const f = $$('.f:not(.vis)', secs[cur])[0]; if (f) f.classList.add('vis'); else go(cur + 1); }
function prev() { const v = $$('.f.vis', secs[cur]); if (v.length) v[v.length - 1].classList.remove('vis'); else go(cur - 1, true); }
$('#next').onclick = next; $('#prev').onclick = prev;
$('#notebtn').onclick = () => note.classList.toggle('vis');
$('#menubtn').onclick = () => menu.classList.toggle('vis');
const fs = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}));
$('#fs').onclick = fs;
document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key;
  if (k === 'Escape') { menu.classList.remove('vis'); return; }
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
  else if (k === 'Home') go(0); else if (k === 'End') go(secs.length - 1);
  else if (k === 'f' || k === 'F') fs();
  else if (k === 'n' || k === 'N') note.classList.toggle('vis');
  else if (k === 'm' || k === 'M') menu.classList.toggle('vis');
  else if (k === 'p' || k === 'P') { const b = $('[data-act="play"]', secs[cur]); b && b.click(); }
  else if (/^[1-4]$/.test(k)) { const o = $('.opts', secs[cur]); o && o._choose(+k - 1); }
  else if (/^[a-dA-D]$/.test(k)) { const o = $('.opts', secs[cur]); o && o._choose(k.toLowerCase().charCodeAt(0) - 97); }
});
document.addEventListener('mouseup', () => document.activeElement && document.activeElement.blur && document.activeElement.blur());
function fit() { const s = Math.min(innerWidth / 1600, innerHeight / 900); deck.style.transform = `translate(-50%, -50%) scale(${s})`; }
addEventListener('resize', fit); fit();
go(Math.max(0, Math.min(secs.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1)));
})();
