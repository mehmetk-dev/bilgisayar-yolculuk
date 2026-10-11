// Robo'nun ızgara dünyası: harita okuma, program ayrıştırma ve çalıştırma (ekrandan bağımsız)
export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];
export const DIR = { N: 0, E: 1, S: 2, W: 3 };

// Harita karakterleri: . zemin, S başlangıç, G pil (hedef), * yıldız, # ağaç, ~ su, boşluk = yol yok
export function parseMap(rows) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const cell = [];
  const stars = [];
  let start = null;
  let goal = null;
  for (let y = 0; y < h; y++) {
    cell.push([]);
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] ?? ' ';
      if (ch === 'S') start = { x, y };
      if (ch === 'G') goal = { x, y };
      if (ch === '*') stars.push({ x, y });
      cell[y].push(ch === '#' ? 'tree' : ch === '~' ? 'water' : ch === ' ' ? 'void' : 'floor');
    }
  }
  return { w, h, cell, start, goal, stars };
}

let uid = 0;
export const newId = () => ++uid;

// 'FF3(FR)L' → [{c:'F'}, {c:'F'}, {c:'loop', n:3, body:[F, R]}, {c:'L'}]
export function parseProg(s) {
  let i = 0;
  const list = () => {
    const out = [];
    while (i < s.length && s[i] !== ')') {
      const ch = s[i];
      if (/\d/.test(ch)) {
        i += 2; // sayı ve '('
        const body = list();
        i++; // ')'
        out.push({ id: newId(), c: 'loop', n: +ch, body });
      } else {
        out.push({ id: newId(), c: ch });
        i++;
      }
    }
    return out;
  };
  return list();
}

export const countBlocks = (prog) => prog.reduce((n, b) => n + 1 + (b.body ? countBlocks(b.body) : 0), 0);

// Döngüleri açıp tek tek yapılacak komut listesine çevirir
export function flatten(prog) {
  const out = [];
  for (const b of prog) {
    if (b.c === 'loop') {
      for (let k = 0; k < b.n; k++) for (const a of flatten(b.body)) out.push({ ...a, loop: b.id, iter: k + 1, n: b.n });
    } else out.push({ c: b.c, id: b.id });
  }
  return out;
}

// Programı baştan sona çalıştırır; ekranda oynatılacak olayları ve sonucu döndürür
export function simulate(m, dir, prog) {
  let { x, y } = m.start;
  let d = dir;
  let rot = dir * 90;
  const got = new Set();
  const ev = [];
  const atGoal = () => x === m.goal.x && y === m.goal.y;
  const acts = flatten(prog);
  if (!acts.length) return { ev, result: 'empty' };
  for (let ai = 0; ai < acts.length; ai++) {
    const a = acts[ai];
    const base = { id: a.id, loop: a.loop, iter: a.iter, n: a.n };
    if (a.c === 'L' || a.c === 'R') {
      const s = a.c === 'R' ? 1 : -1;
      d = (d + s + 4) % 4;
      rot += s * 90;
      ev.push({ ...base, t: 'turn', x, y, d, rot });
      continue;
    }
    const s = a.c === 'B' ? -1 : 1;
    const nx = x + DX[d] * s;
    const ny = y + DY[d] * s;
    const c = m.cell[ny]?.[nx] ?? 'void';
    if (c === 'tree' || c === 'void') {
      ev.push({ ...base, t: 'bump', x, y, d, rot, bx: DX[d] * s, by: DY[d] * s });
      return { ev, result: c === 'tree' ? 'tree' : 'edge' };
    }
    x = nx;
    y = ny;
    if (c === 'water') {
      ev.push({ ...base, t: 'fall', x, y, d, rot });
      return { ev, result: 'water' };
    }
    const k = x + ',' + y;
    const star = m.stars.some((p) => p.x === x && p.y === y) && !got.has(k);
    if (star) got.add(k);
    ev.push({ ...base, t: 'move', x, y, d, rot, star: star ? k : null });
    if (atGoal() && got.size === m.stars.length) {
      // Pilden sonra hâlâ yürüme komutu varsa Robo durdurulur: program fazla uzun
      const extra = acts.slice(ai + 1).filter((r) => r.c === 'F' || r.c === 'B');
      if (extra.length) {
        ev.push({ t: 'stop', x, y, d, rot });
        return { ev, result: 'extra', extra: extra.length, extraId: extra[0].id };
      }
      ev.push({ t: 'win', x, y, d, rot });
      return { ev, result: 'win' };
    }
  }
  return { ev, result: atGoal() ? 'nostars' : 'nogoal' };
}
