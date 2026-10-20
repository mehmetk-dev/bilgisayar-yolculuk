// Robo'nun ızgara dünyası: harita okuma, program ayrıştırma ve çalıştırma (ekrandan bağımsız)
export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];
export const DIR = { N: 0, E: 1, S: 2, W: 3 };

// Harita karakterleri: . zemin, S başlangıç, G pil (hedef), * yıldız, # ağaç, ~ su,
// k anahtar, D kapı (anahtar alınınca açılır), boşluk = yol yok
export function parseMap(rows) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const cell = [];
  const stars = [];
  const keys = [];
  let start = null;
  let goal = null;
  for (let y = 0; y < h; y++) {
    cell.push([]);
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] ?? ' ';
      if (ch === 'S') start = { x, y };
      if (ch === 'G') goal = { x, y };
      if (ch === '*') stars.push({ x, y });
      if (ch === 'k') keys.push({ x, y });
      cell[y].push(ch === '#' ? 'tree' : ch === '~' ? 'water' : ch === 'D' ? 'door' : ch === ' ' ? 'void' : 'floor');
    }
  }
  return { w, h, cell, start, goal, stars, keys };
}

let uid = 0;
export const newId = () => ++uid;

// Kapsayıcı bloklar (içine komut konabilenler) ve gövde adları
export const SLOTS = { loop: ['body'], if: ['body'], ife: ['body', 'body2'], until: ['body'] };
export const isBox = (b) => !!SLOTS[b.c];

// Kısa yazımla program: F B L R P (al) f (fonksiyon çağır)
// 3(...) döngü, i{kosul}(...) eğer, e{kosul}(...)(...) eğer-değilse, u{kosul}(...) olana kadar tekrarla
export function parseProg(s) {
  let i = 0;
  const cond = () => { const j = s.indexOf('}', i); const c = s.slice(i + 1, j); i = j + 1; return c; };
  const group = () => { i++; const l = list(); i++; return l; };
  const list = () => {
    const out = [];
    while (i < s.length && s[i] !== ')') {
      const ch = s[i];
      if (/\d/.test(ch)) {
        i++;
        out.push({ id: newId(), c: 'loop', n: +ch, body: group() });
      } else if (ch === 'i' || ch === 'u') {
        i++;
        const k = cond();
        out.push({ id: newId(), c: ch === 'i' ? 'if' : 'until', cond: k, body: group() });
      } else if (ch === 'e') {
        i++;
        const k = cond();
        const body = group();
        out.push({ id: newId(), c: 'ife', cond: k, body, body2: group() });
      } else {
        out.push({ id: newId(), c: ch === 'f' ? 'fn' : ch });
        i++;
      }
    }
    return out;
  };
  return list();
}

// parseProg'un tersi (adım adım görevlerde programın tarife uyup uymadığına bakmak için): 3(FR)F
export const serProg = (list) => list.map((b) => (b.c === 'loop' ? `${b.n}(${serProg(b.body)})` : b.c === 'fn' ? 'f' : isBox(b) ? '?' : b.c)).join('');

export const countBlocks =(prog) => prog.reduce((n, b) => n + 1 + (SLOTS[b.c] || []).reduce((k, s) => k + countBlocks(b[s]), 0), 0);

export function usesBlock(prog, c) {
  return prog.some((b) => b.c === c || (SLOTS[b.c] || []).some((s) => usesBlock(b[s], c)));
}

const LIMIT = 400;

// Programı çalıştırır; ekranda oynatılacak olayları ve sonucu döndürür.
// opt.fn: fonksiyon gövdesi, opt.pick: yıldızlar "Al" komutuyla toplanır
export function simulate(m, dir, prog, opt = {}) {
  let { x, y } = m.start;
  let d = dir;
  let rot = dir * 90;
  const got = new Set();
  const keys = new Set();
  const ev = [];
  let steps = 0;
  let arrived = false;
  let extra = 0;
  let extraId = null;
  const key = (a, b) => a + ',' + b;
  const isStar = (a, b) => m.stars.some((p) => p.x === a && p.y === b);
  const cellAt = (a, b) => {
    const c = m.cell[b]?.[a] ?? 'void';
    return c === 'door' && keys.size ? 'floor' : c;
  };
  const free = (dd) => { const c = cellAt(x + DX[dd], y + DY[dd]); return c === 'floor'; };
  const COND = {
    open: () => free(d),
    blocked: () => !free(d),
    left: () => free((d + 3) % 4),
    right: () => free((d + 1) % 4),
    star: () => isStar(x, y) && !got.has(key(x, y)),
    nostar: () => !(isStar(x, y) && !got.has(key(x, y))),
    goal: () => x === m.goal.x && y === m.goal.y,
  };
  class Stop { constructor(r) { this.r = r; } }
  const snap = () => ({ x, y, d, rot });
  const tick = () => { if (++steps > LIMIT) throw new Stop('limit'); };
  const done = () => x === m.goal.x && y === m.goal.y && got.size === m.stars.length;

  function act(b, loops) {
    tick();
    const base = { id: b.id, loops };
    if (arrived) {
      // Pile ulaşıldıktan sonraki yürüme komutları sayılır ama uygulanmaz
      if (b.c === 'F' || b.c === 'B') { extra++; extraId ??= b.id; }
      return;
    }
    if (b.c === 'L' || b.c === 'R') {
      const s = b.c === 'R' ? 1 : -1;
      d = (d + s + 4) % 4;
      rot += s * 90;
      ev.push({ ...base, t: 'turn', ...snap() });
      return;
    }
    if (b.c === 'P') {
      if (!COND.star()) { ev.push({ ...base, t: 'nopick', ...snap() }); throw new Stop('nopick'); }
      got.add(key(x, y));
      ev.push({ ...base, t: 'pick', ...snap(), star: key(x, y) });
      if (done()) arrived = true;
      return;
    }
    const s = b.c === 'B' ? -1 : 1;
    const nx = x + DX[d] * s;
    const ny = y + DY[d] * s;
    const c = cellAt(nx, ny);
    if (c === 'tree' || c === 'void' || c === 'door') {
      ev.push({ ...base, t: 'bump', ...snap(), bx: DX[d] * s, by: DY[d] * s });
      throw new Stop(c === 'void' ? 'edge' : c);
    }
    x = nx;
    y = ny;
    if (c === 'water') { ev.push({ ...base, t: 'fall', ...snap() }); throw new Stop('water'); }
    const e = { ...base, t: 'move', ...snap() };
    if (!opt.pick && isStar(x, y) && !got.has(key(x, y))) { got.add(key(x, y)); e.star = key(x, y); }
    if (m.keys.some((p) => p.x === x && p.y === y) && !keys.has(key(x, y))) { keys.add(key(x, y)); e.key = key(x, y); }
    ev.push(e);
    if (done()) arrived = true;
  }

  function test(b, loops) {
    tick();
    const ok = (COND[b.cond] || (() => false))();
    if (!arrived) ev.push({ id: b.id, loops, t: 'check', ok, ...snap() });
    return ok;
  }

  function exec(list, loops, inFn) {
    for (const b of list) {
      if (b.c === 'loop') for (let k = 1; k <= b.n; k++) exec(b.body, { ...loops, [b.id]: k }, inFn);
      else if (b.c === 'if') { if (test(b, loops)) exec(b.body, loops, inFn); }
      else if (b.c === 'ife') exec(test(b, loops) ? b.body : b.body2, loops, inFn);
      else if (b.c === 'until') {
        let k = 0;
        while (!test(b, loops)) {
          k++;
          exec(b.body, { ...loops, [b.id]: k }, inFn);
          if (arrived) break;
        }
      } else if (b.c === 'fn') {
        tick();
        if (!arrived) ev.push({ id: b.id, loops, t: 'call', ...snap() });
        if (!inFn) exec(opt.fn || [], loops, true);
      } else act(b, loops);
    }
  }

  const empty = !prog.length;
  if (empty) return { ev, result: 'empty' };
  let result;
  try {
    exec(prog, {});
    result = arrived ? (extra ? 'extra' : 'win') : x === m.goal.x && y === m.goal.y ? 'nostars' : 'nogoal';
  } catch (e) {
    if (!(e instanceof Stop)) throw e;
    result = e.r;
  }
  if (result === 'win') ev.push({ t: 'win', ...snap() });
  if (result === 'extra') ev.push({ t: 'stop', ...snap() });
  return { ev, result, extra, extraId };
}
