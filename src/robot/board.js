// Izgara görevi: harita, komut düğmeleri, program alanı ve Robo'nun adım adım oynatılması
import { parseMap, parseProg, serProg, simulate, countBlocks, newId, DIR, SLOTS, isBox } from './sim.js';
import { robotHTML, play, confetti, sleep, prefs, toast, hideToast } from './robo.js';

export const CMDS = {
  F: { label: 'İleri git', icon: '⬆', cls: 'c-f' },
  B: { label: 'Geri git', icon: '⬇', cls: 'c-b' },
  L: { label: 'Sola dön', icon: '↰', cls: 'c-l' },
  R: { label: 'Sağa dön', icon: '↱', cls: 'c-r' },
  P: { label: 'Yıldızı al', icon: '✋', cls: 'c-p' },
  fn: { label: 'Fonksiyon', icon: '🧩', cls: 'c-fn' },
  loop: { label: 'Tekrarla', icon: '🔁', cls: 'c-loop' },
  if: { label: 'Eğer … ise', icon: '❓', cls: 'c-if' },
  ife: { label: 'Eğer … değilse', icon: '❓', cls: 'c-if' },
  until: { label: '… olana kadar tekrarla', icon: '🔁', cls: 'c-until' },
};

export const CONDS = {
  open: 'önüm açık',
  blocked: 'önümde engel var',
  left: 'solum açık',
  right: 'sağım açık',
  star: 'yıldızın üstündeyim',
  nostar: 'burada yıldız yok',
  goal: 'pile ulaştım',
};

const BATTERY = `<svg viewBox="0 0 40 48" aria-hidden="true"><rect x="14" y="2" width="12" height="6" rx="2" fill="#2d6a3e"/><rect x="5" y="7" width="30" height="39" rx="7" fill="#2fbf71" stroke="#1d7a47" stroke-width="3"/><path d="M23 13 L13 29 H20 L17 41 L28 24 H21 Z" fill="#ffe14d" stroke="#c99a00" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

const FAIL = {
  empty: 'Programın boş! Önce komutlara tıklayarak bir program yaz. 👈',
  tree: 'Aaa! Önümde ağaç var 🌳 Oradan geçemem.',
  edge: 'Dur! Orada yol yok, haritanın dışına çıkamam.',
  water: 'Şıpırtı! Suya düştüm 💦 Robotlar yüzemez!',
  door: 'Kapı kilitli! 🚪 Önce anahtarı 🔑 almalıyım.',
  nopick: 'Burada alınacak yıldız yok! ✋ Yıldızın tam üstündeyken “Yıldızı al” demelisin.',
  nostars: 'Pile geldim ama bütün yıldızları toplamadım ⭐',
  nogoal: 'Komutlar bitti ama pile ulaşamadım 🔋',
  limit: 'Ufff, çok yoruldum! 😵 Program hiç bitmiyor gibi, bu yüzden Robo\'yu erkenden durdurdum. Döngü bir gün sona eriyor mu?',
};
const WIN = ['Harika! Robo pile ulaştı! 🎉', 'Süpersin! Algoritman çalıştı! 🌟', 'Bravo! Tam bir programcı gibi! 🤖', 'Mükemmel! Robo\'nun pili doldu! 🔋'];

// --- tahta çizimi (görevde ve sorulardaki küçük resimlerde ortak) ---
function boardInner(m, dir) {
  const tiles = [];
  for (let y = 0; y < m.h; y++) {
    for (let x = 0; x < m.w; x++) {
      const c = m.cell[y][x];
      tiles.push(`<div class="tile t-${c}${(x + y) % 2 ? ' alt' : ''}"${c === 'door' ? ` data-door` : ''}></div>`);
    }
  }
  return tiles.join('')
    + `<div class="it start" style="--x:${m.start.x};--y:${m.start.y}"></div>`
    + (m.goal ? `<div class="it goal" style="--x:${m.goal.x};--y:${m.goal.y}">${BATTERY}</div>` : '')
    + m.stars.map((s) => `<div class="it star" data-k="${s.x},${s.y}" style="--x:${s.x};--y:${s.y}">⭐</div>`).join('')
    + m.keys.map((s) => `<div class="it key" data-k="${s.x},${s.y}" style="--x:${s.x};--y:${s.y}">🔑</div>`).join('')
    + `<div class="path"></div>${robotHTML(dir, m.start.x, m.start.y)}`;
}

// Sorular için küçük, hareketsiz harita resmi
export function boardPic(rows, dir = 'E', t = 46) {
  const m = parseMap(rows);
  return `<div class="board pic" style="--w:${m.w};--h:${m.h};--t:${t}px">${boardInner(m, DIR[dir])}</div>`;
}

// --- blok çizimi ---
function condSelect(b, conds, ro) {
  if (ro) return `<span class="cv">${CONDS[b.cond]}</span>`;
  const list = conds.includes(b.cond) ? conds : [b.cond, ...conds];
  return `<select class="cond" aria-label="Koşul">${list.map((k) => `<option value="${k}"${k === b.cond ? ' selected' : ''}>${CONDS[k]}</option>`).join('')}</select>`;
}

function blockHTML(b, ctx) {
  const k = CMDS[b.c];
  const del = ctx.ro ? '' : '<button type="button" class="del" title="Sil" aria-label="Bloğu sil">✖</button>';
  if (!isBox(b)) {
    const label = b.c === 'fn' ? ctx.fnName : k.label;
    return `<div class="blk ${k.cls}" data-id="${b.id}"><span class="bi">${k.icon}</span><span class="bl">${label}</span>${del}</div>`;
  }
  let head;
  if (b.c === 'loop') {
    head = ctx.ro ? `<span class="cv">${b.n}</span> kez tekrarla`
      : `<select class="n" aria-label="Kaç kez">${[2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<option${n === b.n ? ' selected' : ''}>${n}</option>`).join('')}</select> kez tekrarla`;
  } else if (b.c === 'until') head = `${condSelect(b, ctx.conds, ctx.ro)} olana kadar tekrarla`;
  else head = `eğer ${condSelect(b, ctx.conds, ctx.ro)} ise`;
  const body = (s) => `<div class="lbody" data-in="${b.id}:${s}">${listHTML(b[s], ctx)}</div>`;
  const foot = b.c === 'loop' || b.c === 'until' ? 'döngü sonu ⤶' : 'eğer sonu ⤶';
  return `<div class="blk box ${k.cls}" data-id="${b.id}"><div class="lhead"><span class="bi">${k.icon}</span>${head}<span class="iter"></span><span class="chk"></span>${del}</div>${body('body')}${b.c === 'ife' ? `<div class="lmid" data-in="${b.id}:body2">değilse</div>${body('body2')}` : ''}<div class="lfoot" data-after="${b.id}">${foot}</div></div>`;
}

// Art arda aynı yöne dönüşlerin sonucu (çocuklar ikinci dönüşü unutuyor ya da fazladan dönüyor)
const TURN_NOTE = { 2: '↩ 2 kez döndü: Robo arkasına bakar', 3: '3 kez döndü: tek dönüşün tersine bakar', 4: '4 kez döndü: tam tur, yine aynı yöne bakar' };
const turnRun = (list, i) => { let k = 0; while (k <= i && list[i - k].c === list[i].c) k++; return k; };

function listHTML(list, ctx) {
  let h = '';
  for (let i = 0; i <= list.length; i++) {
    if (!ctx.ro && ctx.caret.list === list && ctx.caret.i === i) h += '<span class="caret" aria-hidden="true"></span>';
    if (i < list.length) {
      h += blockHTML(list[i], ctx);
      const c = list[i].c;
      if (!ctx.ro && (c === 'L' || c === 'R') && list[i + 1]?.c !== c && TURN_NOTE[turnRun(list, i)]) h += `<span class="pnote">${TURN_NOTE[turnRun(list, i)]}</span>`;
    }
  }
  if (!list.length && !ctx.ro) h += ctx.root === list ? `<span class="pempty">${ctx.emptyText}</span>` : '<span class="pempty">içine komut ekle ya da bir bloğu buraya sürükle</span>';
  return h;
}

// Sorular için hareketsiz program resmi
export function codePic(str, fnStr, fnName = 'Fonksiyon') {
  const ctx = { ro: true, conds: Object.keys(CONDS), fnName };
  const main = `<div class="prog ro">${listHTML(parseProg(str), ctx)}</div>`;
  if (!fnStr) return `<div class="codepic">${main}</div>`;
  return `<div class="codepic two">${main}<div><div class="fnhead">🧩 ${fnName} =</div><div class="prog ro fnprog">${listHTML(parseProg(fnStr), ctx)}</div></div></div>`;
}

// Döngünün “açılmış” hali: her tur bir satır; iç döngü çerçeveli bir grup olarak gösterilir
const unBody = (list) => list.map((b) => (b.c === 'loop' ? `<span class="ugrp">${Array(b.n).fill(unBody(b.body)).join(' ')}</span>` : chips(b.c))).join(' ');
export function unrollPic(str) {
  const [L] = parseProg(str);
  return `<div class="unroll">${Array.from({ length: L.n }, (_, k) => `<div class="urow"><span class="utur">${k + 1}. tur</span>${unBody(L.body)}</div>`).join('')}</div>`;
}
// Program ve yanında açılmış hali: “bilgisayar bunu böyle okur”
// Programın açılmış hali: üst düzeydeki her döngü turu ayrı satır (iç döngüler çerçeveli)
function liveRows(list) {
  const rows = [];
  let flat = [];
  const flush = () => { if (flat.length) rows.push(`<div class="urow">${flat.join(' ')}</div>`); flat = []; };
  for (const b of list) {
    if (b.c !== 'loop') { flat.push(chips(b.c)); continue; }
    flush();
    for (let k = 1; k <= b.n; k++) rows.push(`<div class="urow"><span class="utur">${k}. tur</span>${unBody(b.body)}</div>`);
  }
  flush();
  return rows.join('');
}
// Döngüler açılınca kaç komut çalışır
const countFlat = (list) => list.reduce((n, b) => n + (b.c === 'loop' ? b.n * countFlat(b.body) : 1), 0);
export const loopPic = (str) => `<div class="uwrap">${codePic(str)}<span class="uarr">➜</span>${unrollPic(str)}</div>`;

// Adım adım görevde bir adımın şartı: tam yazım, düzenli ifade ya da (yazım, imlecin derinliği) işlevi
const fits = (w, s, d) => (w == null ? false : typeof w === 'function' ? w(s, d) : w instanceof RegExp ? w.test(s) : w === s);
const HUES = ['#ff5d8f', '#2f8cff', '#ffb000', '#16b364', '#a259ff', '#ff7a1a', '#00b8d9', '#e0457b', '#7cb518'];

const within = (root, list) => root === list || root.some((b) => (SLOTS[b.c] || []).some((s) => within(b[s], list)));
// “Sağ-sol” işaretleri: dönüşlerin öğretildiği ilk haftada açık başlar; öğretmen kapatıp açabilir (sayfa açık kaldıkça hatırlanır)
let sidesPick = null;
const FACING = ['yukarı ⬆', 'sağa ➡', 'aşağı ⬇', 'sola ⬅'];

export function renderGrid(el, step, done, prev, where = {}) {
  const rows = step.maps || [step.map];
  const M = rows.map(parseMap);
  const dirs = rows.map((_, k) => DIR[(step.dirs && step.dirs[k]) || step.dir || 'E']);
  const max = step.max || 0;
  // watch: hazır programı yavaşça izleme; tut: ne yapılacağını adım adım gösteren tarif; narrate: çalışırken döngü turlarını anlatma
  const watch = !!step.watch;
  const T = step.tut || null;
  const narrOn = watch || !!T || !!step.narrate;
  // ⭐⭐⭐ hedefi: örnek çözümün blok sayısı
  const best = watch ? 0 : step.best ?? (step.sol ? countBlocks(parseProg(step.sol)) + countBlocks(parseProg(step.fnSol || step.fnPreset || '')) : 0);
  const hasFn = step.tools.includes('fn');
  const fnName = step.fnName || 'Fonksiyon';
  const conds = step.conds || ['open', 'blocked', 'star', 'goal'];
  const fresh = () => ({ prog: step.preset ? parseProg(step.preset) : [], fn: step.fnPreset ? parseProg(step.fnPreset) : [] });
  let { prog, fn } = fresh();
  let caret = { list: prog, i: prog.length };
  let mi = 0;
  let tok = 0;
  let running = false;
  let fails = 0;
  const total = () => countBlocks(prog) + countBlocks(fn);
  const stars = (n) => '⭐'.repeat(n) + '<span class="dim">⭐</span>'.repeat(3 - n);
  const turns = step.tools.includes('L') || step.tools.includes('R');
  let sides = turns && (sidesPick ?? step.sides ?? (where.L?.week === 1 && !where.L.extra));

  const tabs = M.length > 1 ? `<div class="mtabs">${M.map((_, k) => `<button type="button" class="mtab${k ? '' : ' cur'}" data-k="${k}">🗺 Harita ${k + 1}</button>`).join('')}</div>` : '';
  el.innerHTML = `<div class="gridact${narrOn ? ' talk' : ''}">
  <div class="gleft">
    <div class="ginfo"><h3>${step.title}${best ? ` <span class="bestline" title="En az ${best} blokla çözersen 3 yıldız">${prev ? stars(prev) : ''} <small>⭐⭐⭐ hedefi: ${best} blok</small></span>` : ''}</h3>${step.text}</div>
    ${T && step.tutHelp ? '<div class="tutask"><span>🤔 Önce <b>kendin dene</b>! Takılırsan yardım al.</span><button type="button" class="tuthelp">👣 Adım adım göster</button></div>' : ''}
    ${T ? `<div class="tut"${step.tutHelp ? ' hidden' : ''}><h4>👣 Adım adım yap</h4><ol>${T.map((x) => `<li>${x.t}</li>`).join('')}</ol><p class="toff" hidden>🤔 Program tarife uymadı. Son eklediğin bloğu <b>✖</b> ile sil ya da <b>🗑 Temizle</b>'ye basıp baştan başla.</p></div>` : ''}
    ${tabs}
    ${narrOn ? '<div class="narr" aria-live="polite"></div>' : ''}
    <div class="gboard${turns ? ' turny' : ''}"><div class="board"></div></div>
    <div class="hint" hidden></div>
  </div>
  <div class="gcode">
    <h4${watch ? ' hidden' : ''}>Komutlar</h4>
    <div class="tools"${watch ? ' hidden' : ''}>${step.tools.map((c) => `<button type="button" class="tool ${CMDS[c].cls}" data-c="${c}"><span class="bi">${CMDS[c].icon}</span>${c === 'fn' ? fnName : CMDS[c].label}</button>`).join('')}</div>
    <h4>Programım <span class="cnt"></span></h4>
    <div class="prog" data-root="main" tabindex="-1"></div>
    ${step.unroll ? '<div class="liveun" aria-live="polite"></div>' : ''}
    ${hasFn ? `<h4 class="fnhead">🧩 ${fnName} fonksiyonum</h4><div class="prog fnprog" data-root="fn" tabindex="-1"></div>` : ''}
    <p class="ptip"${watch || T ? ' hidden' : ''}>✋ Blokları <b>sürükleyerek</b> yerini değiştirebilir, içine ya da dışına taşıyabilirsin.</p>
    <div class="ctrl">
      <button type="button" class="primary run">${watch ? '▶ İzle' : '▶ Çalıştır'}</button>
      ${watch ? '' : `<button type="button" class="reset">↺ Başa al</button>
      <button type="button" class="clear">${step.preset || step.fnPreset ? '↺ İlk program' : '🗑 Temizle'}</button>`}
      ${step.pathHint && step.sol ? '<button type="button" class="vhint">💡 Yolu renklerle göster</button>' : ''}
      ${turns ? `<button type="button" class="sidesbtn" aria-pressed="${sides}" title="Robo'nun solunu ve sağını tahtada göster">🧭 Sağ-sol ${sides ? 'açık' : 'kapalı'}</button>` : ''}
    </div>
  </div>
</div>`;

  const q = (s) => el.querySelector(s);
  const board = q('.board');
  const progEl = q('.prog[data-root="main"]');
  const fnEl = q('.fnprog');
  const cnt = q('.cnt');
  const hintEl = q('.hint');
  const runBtn = q('.run');
  const narrEl = q('.narr');
  let hintOn = false;
  // tutHelp: tarif ve parmak önce gizli; çocuk önce kendi dener, takılınca düğmeyle açar
  let tutOn = !(T && step.tutHelp);
  q('.tuthelp') && (q('.tuthelp').onclick = () => { tutOn = true; q('.tut').hidden = false; q('.tutask').hidden = true; play('click'); updateTut(); });
  let rb;
  let arrow;
  let trail;

  function showMap(k) {
    mi = k;
    const m = M[k];
    board.style.setProperty('--w', m.w);
    board.style.setProperty('--h', m.h);
    board.innerHTML = boardInner(m, dirs[k]);
    board.classList.toggle('sides', sides);
    rb = q('.rb');
    arrow = q('.rarrow');
    trail = q('.path');
    if (hintOn) paintHint();
    el.querySelectorAll('.mtab').forEach((t) => t.classList.toggle('cur', +t.dataset.k === k));
    fit();
  }

  // Kare boyutu alana göre ayarlanır
  function fit() {
    const g = q('.gboard');
    const w = g.clientWidth - 2 * parseFloat(getComputedStyle(g).paddingLeft) - 4;
    const t = Math.max(34, Math.min(80, Math.floor(w / M[mi].w)));
    board.style.setProperty('--t', t + 'px');
  }
  const ro = new ResizeObserver(() => { fit(); pointAt(); });
  ro.observe(q('.gboard'));
  ro.observe(el);

  const say = (kind, html, ms) => toast(kind, html, ms);

  function place(e, instant) {
    if (instant) rb.classList.add('noanim');
    rb.style.setProperty('--x', e.x);
    rb.style.setProperty('--y', e.y);
    rb.className = rb.className.replace(/\bd\d\b/, 'd' + e.d);
    arrow.style.setProperty('--r', e.rot + 'deg');
    if (instant) { void rb.offsetWidth; rb.classList.remove('noanim'); }
  }

  function resetRobot() {
    tok++;
    showMap(mi);
    highlight(null);
    narrIdle();
    el.querySelectorAll('.blk.extra').forEach((b) => b.classList.remove('extra'));
    setRunning(false);
  }

  function setRunning(on) {
    running = on;
    el.classList.toggle('running', on);
    runBtn.textContent = on ? '⏹ Durdur' : watch ? '▶ Bir daha izle' : '▶ Çalıştır';
    if (watch && !on && !q('.rb.happy')) runBtn.textContent = '▶ İzle';
    pointAt();
  }

  // --- program alanı ---
  function find(id, lists = [prog, fn]) {
    for (const L of lists) {
      for (let i = 0; i < L.length; i++) {
        const b = L[i];
        if (b.id === id) return { list: L, i, b };
        for (const s of SLOTS[b.c] || []) { const r = find(id, [b[s]]); if (r) return r; }
      }
    }
    return null;
  }
  const slotList = (ref) => { const [id, s] = ref.split(':'); return find(+id).b[s]; };

  function draw(newId) {
    const ctx = { caret, conds, fnName, root: prog, ro: watch, emptyText: 'Komutlara tıkla, buraya eklensin 👆' };
    progEl.innerHTML = listHTML(prog, ctx);
    if (fnEl) fnEl.innerHTML = listHTML(fn, { ...ctx, root: fn, emptyText: `${fnName} fonksiyonunun adımlarını buraya yaz` });
    const n = total();
    cnt.textContent = max ? `${n} / ${max} blok` : `${n} blok`;
    cnt.classList.toggle('full', !!max && n >= max);
    if (newId) el.querySelector(`.blk[data-id="${newId}"]`)?.classList.add('new');
    // İmleç görünür kalsın ama yalnızca program kutusu kaysın, sayfa değil
    const c = el.querySelector('.caret');
    const box = c?.closest('.prog');
    if (c && box) {
      const pr = box.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      if (cr.bottom > pr.bottom) box.scrollTop += cr.bottom - pr.bottom + 10;
      else if (cr.top < pr.top) box.scrollTop -= pr.top - cr.top + 10;
    }
    if (step.unroll) {
      const u = q('.liveun');
      u.innerHTML = prog.some((b) => b.c === 'loop') ? `<b>Robo bunu uzun haliyle böyle yapar:</b><div class="unroll">${liveRows(prog)}</div><small>Toplam <b>${countFlat(prog)} komut</b> çalışır, sen <b>${n} blokla</b> yazdın.</small>` : '';
    }
    updateTut();
  }

  function changed() {
    el.querySelectorAll('.grp').forEach((b) => { b.classList.remove('grp'); b.style.removeProperty('--g'); });
    el.querySelectorAll('.glabel').forEach((b) => b.remove());
    resetRobot();
    hideToast();
    updateTut();
  }

  // --- adım adım tarif: sıradaki işi işaretler, basılacak yeri parmakla gösterir ---
  let tutAt = null;
  const listDepth = (list, L = prog, d = 0) => {
    if (L === list) return d;
    for (const b of L) for (const s of SLOTS[b.c] || []) { const r = listDepth(list, b[s], d + 1); if (r >= 0) return r; }
    return -1;
  };
  function tutStage() {
    const s = serProg(prog);
    const d = listDepth(caret.list);
    if (!s) return 0;
    for (let k = T.length - 1; k >= 0; k--) {
      if (fits(T[k].want, s, d)) return Math.min(k + 1, T.length - 1);
      if (fits(T[k].wip, s, d)) return k;
    }
    return -1;
  }
  function updateTut() {
    if (!T) return;
    const won = !!q('.rb.happy');
    const k = won ? T.length : tutStage();
    el.querySelectorAll('.tut li').forEach((li, j) => { li.className = j < k || won ? 'ok' : j === k ? 'cur' : ''; });
    q('.toff').hidden = k >= 0;
    let at = k < 0 ? '.clear' : T[k]?.at;
    if (typeof at === 'function') at = at(serProg(prog));
    tutAt = tutOn && at ? (CMDS[at] ? `.tool[data-c="${at}"]` : at) : null;
    pointAt();
  }
  function pointAt() {
    if (!T) return;
    el.querySelectorAll('.tgo').forEach((x) => x.classList.remove('tgo'));
    let f = q('.finger');
    const t = !running && tutAt && [...el.querySelectorAll(tutAt)].pop();
    if (!t || !t.offsetParent) { f?.remove(); return; }
    t.classList.add('tgo');
    if (!f) { f = document.createElement('div'); f.className = 'finger'; f.textContent = '👇'; q('.gridact').appendChild(f); }
    const g = q('.gridact').getBoundingClientRect();
    const r = t.getBoundingClientRect();
    f.style.left = r.left - g.left + Math.min(r.width / 2, 40) + 'px';
    f.style.top = r.top - g.top + 'px';
  }

  // --- anlatım: çalışırken hangi döngünün kaçıncı turunda olunduğu ---
  const loopIds = (loops) => Object.keys(loops || {}).filter((id) => find(+id)?.b.c === 'loop');
  const nested = () => { const deep = (L, d) => L.some((b) => (b.c === 'loop' && d > 0) || (SLOTS[b.c] || []).some((s) => deep(b[s], d + (b.c === 'loop')))); return deep(prog, 0); };
  function loopName(id) {
    if (!nested()) return 'Döngü';
    // Bu döngünün dışında kaç döngü var?
    const above = (L, d) => { for (const b of L) { if (b.id === +id) return d; for (const s of SLOTS[b.c] || []) { const r = above(b[s], d + (b.c === 'loop')); if (r >= 0) return r; } } return -1; };
    const n = above(prog, 0);
    return n === 0 ? 'Büyük döngü' : n === 1 ? 'Küçük döngü' : 'En küçük döngü';
  }
  function narrIdle() {
    if (!narrEl) return;
    narrEl.innerHTML = watch ? '<div class="nsay">▶ <b>İzle</b> düğmesine bas. Robo programı yavaş yavaş çalıştıracak; çalışan blok <b>sarı çerçeveyle</b> parlar.</div>' : '';
    narrEl.hidden = !watch;
  }
  function showNarr(e) {
    if (!narrEl) return;
    const rows = loopIds(e.loops).map((id) => {
      const k = e.loops[id];
      const n = find(+id).b.n;
      return `<div class="nlp"><b>🔁 ${loopName(id)}</b><span class="beads">${Array.from({ length: n }, (_, j) => `<i class="${j + 1 < k ? 'd' : j + 1 === k ? 'c' : ''}"></i>`).join('')}</span><span class="nk">${k}. tur / ${n}</span></div>`;
    }).join('');
    let say = e.html;
    if (!say) {
      const b = e.id && find(e.id)?.b;
      const c = b && CMDS[b.c];
      if (e.t === 'win') say = '🎉 Pile ulaştım!';
      else if (c) say = `Şimdi: <span class="chipb ${c.cls}">${c.icon} ${b.c === 'fn' ? fnName : c.label}</span>`;
    }
    narrEl.hidden = false;
    narrEl.innerHTML = `${rows ? `<div class="nloops">${rows}</div>` : ''}${say ? `<div class="nsay${e.html ? ' cap' : ''}">${say}</div>` : ''}`;
  }
  // Olayların arasına “döngü başlıyor / başa dönüyorum / döngü bitti” anlatımlarını ekler
  function withCaptions(ev) {
    const out = [];
    let prev = {};
    for (const e of ev) {
      const cur = e.loops || {};
      const ended = loopIds(prev).filter((id) => !(id in cur) || cur[id] < prev[id]).reverse();
      for (const [j, id] of ended.entries()) {
        const n = find(+id).b.n;
        const outer = loopIds(cur).some((x) => !ended.includes(x)) || j < ended.length - 1;
        out.push({ t: 'cap', loops: prev, html: `✅ <b>${loopName(id)} bitti:</b> ${n} turun hepsini yaptım. ${outer ? 'Büyük döngüye dönüyorum.' : 'Döngüden çıkıyorum, sıradaki bloğa geçiyorum.'}` });
        prev = Object.fromEntries(Object.entries(prev).filter(([x]) => x !== id));
      }
      for (const id of loopIds(cur)) {
        const n = find(+id).b.n;
        const part = Object.fromEntries(Object.entries(cur).slice(0, Object.keys(cur).indexOf(id) + 1));
        if (!(id in prev)) out.push({ t: 'cap', loops: part, html: `🔁 <b>${loopName(id)} başlıyor:</b> içindeki blokları <b>${n} kez</b> yapacağım.` });
        else if (cur[id] > prev[id]) out.push({ t: 'cap', loops: part, html: `↩ ${loopName(id)}nün sonuna geldim, <b>başa dönüyorum: ${cur[id]}. tur</b>` });
        prev = { ...prev, [id]: cur[id] };
      }
      out.push(e);
      prev = cur;
    }
    return out;
  }

  function add(c) {
    if (running) return;
    if (max && total() >= max) {
      play('wrong');
      say('warn', `Bu görevde en fazla <b>${max} blok</b> kullanabilirsin. ${step.tools.includes('loop') ? '🔁 Tekrarla bloğu ile kısaltmayı dene!' : ''}`);
      cnt.classList.remove('shake'); void cnt.offsetWidth; cnt.classList.add('shake');
      return;
    }
    if (c === 'fn' && within(fn, caret.list)) {
      play('wrong');
      say('warn', 'Fonksiyonun içinde kendisini çağırmayalım. Önce yukarıdaki <b>Programım</b> alanına tıkla.');
      return;
    }
    const b = { id: newId(), c };
    if (c === 'loop') Object.assign(b, { n: step.loopN || 3, body: [] });
    // wrap: programda birden çok hazır blok varken 🔁'ya basınca hepsi yeni döngünün içine sarılır
    // (imleç nerede olursa olsun; sarıldıktan sonra program tek blok olur, 🔁 yine normal çalışır)
    const wrapped = c === 'loop' && step.wrap && prog.length > 1;
    if (wrapped) { b.body = prog.splice(0); caret = { list: prog, i: 0 }; }
    if (c === 'if' || c === 'until' || c === 'ife') {
      b.cond = c === 'until' ? (conds.includes('goal') ? 'goal' : conds[0]) : (step.ifCond || conds[0]);
      b.body = [];
      if (c === 'ife') b.body2 = [];
    }
    caret.list.splice(caret.i, 0, b);
    caret = wrapped ? { list: prog, i: 1 } : isBox(b) ? { list: b.body, i: 0 } : { list: caret.list, i: caret.i + 1 };
    play('add');
    changed();
    draw(b.id);
  }

  function remove(id) {
    const f = find(id);
    f.list.splice(f.i, 1);
    // Silinen yere imleç konur: doğru bloğu hemen oraya ekleyebilsin
    caret = { list: f.list, i: f.i };
    play('del');
    changed();
    draw();
  }

  el.querySelector('.tools').addEventListener('click', (e) => {
    const b = e.target.closest('.tool');
    if (b) add(b.dataset.c);
  });
  // Dönüş düğmesinin üstüne gelince tahtada o taraf yanıp söner: “Sola dön dersen buraya bakacaksın”
  for (const c of ['L', 'R']) {
    const t = el.querySelector(`.tool[data-c="${c}"]`);
    if (!t) continue;
    t.addEventListener('pointerenter', () => { if (!running) board.classList.add('peek-' + c); });
    t.addEventListener('pointerleave', () => board.classList.remove('peek-' + c));
  }
  q('.sidesbtn') && (q('.sidesbtn').onclick = (e) => {
    sides = sidesPick = !sides;
    e.currentTarget.setAttribute('aria-pressed', sides);
    e.currentTarget.textContent = `🧭 Sağ-sol ${sides ? 'açık' : 'kapalı'}`;
    board.classList.toggle('sides', sides);
    play('click');
  });

  const roots = [progEl, fnEl].filter(Boolean);
  const rootList = (box) => (box.dataset.root === 'fn' ? fn : prog);

  for (const box of roots) {
    box.addEventListener('click', (e) => {
      if (running || watch) return;
      const t = e.target;
      const del = t.closest('.del');
      if (del) return remove(+del.closest('.blk').dataset.id);
      if (t.closest('select')) return;
      const foot = t.closest('.lfoot');
      const blk = t.closest('.blk:not(.box)');
      const head = t.closest('.lhead');
      const slot = t.closest('.lbody, .lmid');
      if (foot) { const f = find(+foot.dataset.after); caret = { list: f.list, i: f.i + 1 }; }
      else if (blk) { const f = find(+blk.dataset.id); caret = { list: f.list, i: f.i + 1 }; }
      else if (head) { const b = find(+head.parentNode.dataset.id).b; caret = { list: b.body, i: b.body.length }; }
      else if (slot) { const l = slotList(slot.dataset.in); caret = { list: l, i: l.length }; }
      else { const l = rootList(box); caret = { list: l, i: l.length }; }
      play('click');
      draw();
    });
    box.addEventListener('change', (e) => {
      const s = e.target;
      const b = find(+s.closest('.blk').dataset.id).b;
      if (s.classList.contains('n')) b.n = +s.value;
      else if (s.classList.contains('cond')) b.cond = s.value;
      changed();
    });
  }

  // --- sürükle bırak: blokların yerini değiştirme, içine/dışına taşıma (fare ve dokunmatik) ---
  let drag = null;
  let dragged = false;
  for (const box of roots) {
    box.addEventListener('pointerdown', (e) => {
      if (running || watch || e.button > 0 || e.target.closest('.del, select')) return;
      const blk = e.target.closest('.blk');
      if (blk) drag = { el: blk, id: +blk.dataset.id, x0: e.clientX, y0: e.clientY, on: false };
    });
  }
  const onMove = (e) => {
    if (!drag) return;
    if (!drag.on) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 8) return;
      const r = drag.el.getBoundingClientRect();
      drag.on = true;
      drag.ox = drag.x0 - r.left;
      drag.oy = drag.y0 - r.top;
      drag.ghost = drag.el.cloneNode(true);
      drag.ghost.classList.add('ghost');
      drag.ghost.style.width = r.width + 'px';
      document.body.appendChild(drag.ghost);
      drag.mark = document.createElement('span');
      drag.mark.className = 'drop';
      drag.el.classList.add('dragging');
      el.classList.add('dnd');
    }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX - drag.ox}px, ${e.clientY - drag.oy}px) rotate(2deg)`;
    // Bırakılacak yer: parmağın altındaki gövde ya da programın kendisi
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const rootBox = under?.closest('.prog[data-root]');
    drag.to = null;
    if (!rootBox || !el.contains(rootBox)) { drag.mark.remove(); return; }
    let body = under.closest('.lbody');
    if (body && drag.el.contains(body)) body = null;
    const cont = body || rootBox;
    const list = body ? slotList(body.dataset.in) : rootList(rootBox);
    if (find(drag.id).b.c === 'fn' && within(fn, list)) { drag.mark.remove(); return; }
    const kids = [...cont.children].filter((k) => k.classList.contains('blk') && k !== drag.el);
    let i = kids.findIndex((k) => { const r = k.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    if (i < 0) i = kids.length;
    cont.insertBefore(drag.mark, kids[i] || cont.querySelector(':scope > .pempty'));
    drag.to = { list, i };
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.on) return;
    dragged = true;
    d.ghost.remove();
    d.mark.remove();
    el.classList.remove('dnd');
    d.el.classList.remove('dragging');
    if (!d.to) return;
    const f = find(d.id);
    f.list.splice(f.i, 1);
    d.to.list.splice(d.to.i, 0, f.b);
    caret = { list: d.to.list, i: d.to.i + 1 };
    play('add');
    changed();
    draw(f.b.id);
  };
  addEventListener('pointermove', onMove, { passive: false });
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onUp);
  // Sürüklemenin sonundaki tıklama imleci oynatmasın
  for (const box of roots) box.addEventListener('click', (e) => { if (dragged) { dragged = false; e.stopImmediatePropagation(); } }, true);

  el.querySelector('.mtabs')?.addEventListener('click', (e) => {
    const t = e.target.closest('.mtab');
    if (!t || running) return;
    play('click');
    mi = +t.dataset.k;
    changed();
  });

  if (step.pathHint && step.sol) {
    q('.vhint').onclick = (e) => {
      hintOn = !hintOn;
      e.currentTarget.textContent = hintOn ? '🙈 Renkleri gizle' : '💡 Yolu renklerle göster';
      play('click');
      showMap(mi);
      placeAfterRun();
    };
  }
  // Renkli yol ipucu: örnek çözümde Robo'nun gittiği kareler, her tur ayrı renkte ve tur numarasıyla
  function paintHint() {
    const sol = parseProg(step.sol);
    const r = simulate(M[mi], dirs[mi], sol, { fn: parseProg(step.fnSol || step.fnPreset || ''), pick: step.pick });
    const top = sol.find((b) => b.c === 'loop');
    const seen = [];
    const dots = r.ev.filter((e) => e.t === 'move').map((e) => {
      const ks = Object.keys(e.loops || {});
      if (!ks.length) return `<i class="hd" style="--x:${e.x};--y:${e.y};--hc:#8a8a8a"></i>`;
      const tag = ks[0] + ':' + e.loops[ks[0]];
      if (!seen.includes(tag)) seen.push(tag);
      return `<i class="hd" style="--x:${e.x};--y:${e.y};--hc:${HUES[seen.indexOf(tag) % HUES.length]}">${e.loops[ks[0]]}</i>`;
    });
    board.insertAdjacentHTML('beforeend', `<div class="hpath">${dots.join('')}</div>`);
    hintEl.hidden = false;
    hintEl.innerHTML = `💡 <b>Aynı renkli kareler aynı turda gidiliyor</b>, üstlerindeki sayı turun numarası.${top ? `<div class="hbody"><span>${sol.filter((b) => b.c === 'loop').length > 1 ? 'İlk döngünün bir turunda' : 'Bir turda'} Robo şunları yapıyor:</span>${codePic(serProg(top.body))}</div>` : ''}${step.hint ? `<p>${step.hint}</p>` : ''}`;
  }
  function placeAfterRun() {
    if (!hintOn) { hintEl.hidden = !(step.hint && fails >= 2); if (!hintEl.hidden) hintEl.innerHTML = `💡 <b>İpucu:</b> ${step.hint}`; }
  }

  q('.reset') && (q('.reset').onclick = () => { changed(); play('click'); });
  q('.clear') && (q('.clear').onclick = () => {
    ({ prog, fn } = fresh());
    caret = { list: prog, i: prog.length };
    play('del');
    changed();
    draw();
  });

  // --- çalıştırma ---
  function highlight(e) {
    el.querySelectorAll('.blk.now').forEach((b) => b.classList.remove('now'));
    el.querySelectorAll('.iter, .chk').forEach((s) => { s.textContent = ''; s.className = s.classList[0]; });
    if (!e) return;
    if (e.id) el.querySelector(`.blk[data-id="${e.id}"]`)?.classList.add('now');
    for (const [id, k] of Object.entries(e.loops || {})) {
      const it = el.querySelector(`.blk[data-id="${id}"] > .lhead > .iter`);
      if (it) it.textContent = `(${k}. tur)`;
    }
    if (e.t === 'check') {
      const c = el.querySelector(`.blk[data-id="${e.id}"] > .lhead > .chk`);
      if (c) { c.textContent = e.ok ? '✔ evet' : '✖ hayır'; c.classList.add(e.ok ? 'yes' : 'no'); }
    }
  }

  async function playEvents(ev, my, ms) {
    for (const e of ev) {
      if (my !== tok) return false;
      if (narrOn) showNarr(e);
      if (e.t === 'cap') { highlight(e.loops ? { loops: e.loops } : null); await sleep(ms * (watch ? 2.2 : 1.1)); continue; }
      highlight(e);
      let wait = ms;
      if (e.t === 'turn') { place(e); play('turn'); }
      else if (e.t === 'check') { play('click'); wait = ms * 0.6; }
      else if (e.t === 'call') { play('add'); wait = ms * 0.45; }
      else if (e.t === 'move') {
        const dot = document.createElement('i');
        dot.style.cssText = `--x:${rb.style.getPropertyValue('--x')};--y:${rb.style.getPropertyValue('--y')}`;
        trail.appendChild(dot);
        place(e);
        rb.classList.remove('walk'); void rb.offsetWidth; rb.classList.add('walk');
        play('step');
        if (e.star) setTimeout(() => { el.querySelector(`.star[data-k="${e.star}"]`)?.classList.add('got'); play('star'); }, ms * 0.6);
        if (e.key) {
          setTimeout(() => {
            el.querySelector(`.key[data-k="${e.key}"]`)?.classList.add('got');
            el.querySelectorAll('[data-door]').forEach((d) => d.classList.add('open'));
            play('ok');
          }, ms * 0.6);
        }
      } else if (e.t === 'pick') {
        rb.classList.remove('picking'); void rb.offsetWidth; rb.classList.add('picking');
        el.querySelector(`.star[data-k="${e.star}"]`)?.classList.add('got');
        play('star');
      } else if (e.t === 'nopick') {
        rb.classList.add('sad');
      } else if (e.t === 'bump') {
        rb.style.setProperty('--bx', e.bx);
        rb.style.setProperty('--by', e.by);
        rb.classList.add('bump');
        play('bump');
      } else if (e.t === 'fall') {
        place(e);
        setTimeout(() => { rb.classList.add('fall'); play('splash'); }, ms * 0.6);
        wait = ms * 1.6;
      } else wait = 0;
      await sleep(wait);
    }
    return my === tok;
  }

  async function run() {
    if (running) { resetRobot(); return; }
    hideToast();
    if (max && total() > max) {
      play('wrong');
      say('warn', `Programında <b>${total()} blok</b> var ama bu görevde en fazla <b>${max} blok</b> olmalı. ${step.tools.includes('loop') ? '🔁 Döngü ile kısaltmayı dene!' : ''}`);
      cnt.classList.remove('shake'); void cnt.offsetWidth; cnt.classList.add('shake');
      return;
    }
    const my = ++tok;
    const ms = watch ? 900 : prefs.fast ? 260 : 540;
    for (let k = 0; k < M.length; k++) {
      mi = k;
      showMap(k);
      highlight(null);
      tok = my;
      setRunning(true);
      board.style.setProperty('--dur', ms * 0.8 + 'ms');
      const r = simulate(M[k], dirs[k], prog, { fn, pick: step.pick });
      await sleep(180);
      // Sonsuz döngüde yalnızca ilk birkaç olayı oynat, uyarıyı hemen göster
      if (r.result === 'limit') r.ev = r.ev.slice(0, 15);
      if (!(await playEvents(narrOn ? withCaptions(r.ev) : r.ev, my, ms))) return;
      highlight(null);
      const where = M.length > 1 ? `<b>${k + 1}. haritada:</b> ` : '';
      if (r.result === 'extra') {
        setRunning(false);
        rb.classList.add('halt');
        el.querySelector(`.blk[data-id="${r.extraId}"]`)?.classList.add('extra');
        play('wrong');
        say('warn', `${where}<b>Dur! Pile ulaştım ama programında ${r.extra} fazla adım var.</b><br>Devam etseydim pili geçip giderdim! Kırmızı çerçeveli blok ve ondan sonraki yürüme komutları fazla; onları ✖ ile sil.`);
        return;
      }
      if (r.result !== 'win') {
        setRunning(false);
        fails++;
        rb.classList.add('sad');
        if (!['tree', 'edge', 'water', 'door'].includes(r.result)) play('wrong');
        const multi = M.length > 1 && k > 0 ? '<br><small>Unutma: aynı program <b>bütün haritalarda</b> çalışmalı.</small>' : '<br><small>Programını düzelt ve tekrar ▶ Çalıştır\'a bas.</small>';
        // Yön karışıklığında işe yarar: Robo hata anında ekranda nereye bakıyordu?
        const last = r.ev[r.ev.length - 1];
        const face = turns && last && ['tree', 'edge', 'water', 'door'].includes(r.result) ? `<br>Robo o anda ekranda <b>${FACING[last.d]}</b> bakıyordu.` : '';
        say('bad', `${where}<b>${FAIL[r.result]}</b>${face}${multi}`);
        if (step.hint && fails >= 2 && !hintOn) { hintEl.hidden = false; hintEl.innerHTML = `💡 <b>İpucu:</b> ${step.hint}`; }
        if (fails >= 2) q('.vhint')?.classList.add('tgo');
        if (fails >= 2) q('.tuthelp')?.classList.add('need');
        return;
      }
      rb.classList.add('happy');
      q('.goal').classList.add('win');
      if (k < M.length - 1) {
        play('ok');
        say('ok', `<b>${k + 1}. harita tamam!</b> Şimdi aynı program ${k + 2}. haritada deneniyor…`, 1800);
        await sleep(1500);
        if (my !== tok) return;
      }
    }
    setRunning(false);
    play('win');
    confetti();
    const n = total();
    const s = best ? (n <= best ? 3 : n <= best + 2 ? 2 : 1) : 0;
    const rate = s ? `<div class="rate">${stars(s)}</div>${s < 3 ? `<small>${best} blokla çözebilir misin? Denemek zorunda değilsin.</small><br>` : ''}` : '';
    if (watch) say('ok', `<b>${step.win || 'Döngünün nasıl çalıştığını gördün! 👀'}</b><br>İstersen bir daha izle, ya da <b>Devam ▶</b> düğmesine bas.`, 7000);
    else say('ok', `<b>${step.win || WIN[Math.floor(Math.random() * WIN.length)]}</b>${rate}<br>${n} blokla çözdün. <b>Devam ▶</b> düğmesine basabilirsin.`, 7000);
    if (!hintOn) hintEl.hidden = true;
    if (step.groups) showGroups();
    updateTut();
    done(s);
  }
  runBtn.onclick = run;

  // Uzun programda tekrar eden parçaları renklendirir: “bak, aynı parça 3 kez var!”
  function showGroups() {
    const els = [...progEl.querySelectorAll(':scope > .blk')];
    const pat = step.groups;
    let k = 0;
    for (let i = 0; i + pat.length <= prog.length; ) {
      if (prog.slice(i, i + pat.length).map((b) => b.c).join('') !== pat) { i++; continue; }
      els.slice(i, i + pat.length).forEach((b) => { b.classList.add('grp'); b.style.setProperty('--g', HUES[k % HUES.length]); });
      els[i].insertAdjacentHTML('beforebegin', `<span class="glabel" style="--g:${HUES[k % HUES.length]}">${k + 1}. tekrar</span>`);
      k++;
      i += pat.length;
    }
    if (k > 1) say('ok', step.groupsWin || `<b>Aynı parça ${k} kez tekrar ediyor!</b> Renkli kutulara bak. Tekrar eden parçayı döngüye koyarsak program kısalır.`, 9000);
  }

  showMap(0);
  draw();
  narrIdle();
  progEl.addEventListener('scroll', pointAt);
  return () => {
    tok++;
    ro.disconnect();
    hideToast();
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', onUp);
    removeEventListener('pointercancel', onUp);
    document.querySelector('.ghost')?.remove();
  };
}

// Soru şıklarında küçük komut dizisi: chips('FFR') → ⬆ ⬆ ↱
export function chips(str) {
  return [...str].map((c) => `<span class="chipb ${CMDS[c].cls}">${CMDS[c].icon}</span>`).join(' ');
}
