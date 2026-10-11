// Sahne dünyası ve blok yorumlayıcısı (ekrandan bağımsız; testlerde de çalışır)
// Scratch'teki gibi: her betik ayrı bir "iş parçacığı"dır, döngüler her turda bir kare bekler
import { BLOCKS, slotsOf } from './blocks.js';
import { COSTUMES, BACKDROPS } from './costumes.js';

export const W = 240;
export const H = 180;
export const BEAT = 0.5; // saniye (tempo 120)
const SOUND_LEN = { pop: 0.2, miyav: 0.6, hav: 0.5, davul: 0.3, zil: 0.8, boing: 0.5, alkis: 0.7, kazandin: 1 };

const normDir = (d) => { let r = ((d + 180) % 360 + 360) % 360 - 180; if (r === -180) r = 180; return r; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createWorld(setup, progs, opt = {}) {
  const w = {
    t: 0,
    random: opt.random || Math.random,
    backdrop: setup.backdrop || 'beyaz',
    vars: { ...(setup.vars || {}) },
    sprites: [],
    threads: [],
    keys: new Set(),
    mouse: { x: 0, y: 0, down: false },
    penLines: [],
    penOps: [],
    log: { touch: new Set(), said: [], sounds: [], notes: [], bcasts: [], backdrops: [], keys: [], clicks: [], flags: 0 },
    onSound: null,
    mem: {},
    onNote: null,
  };

  for (const d of setup.sprites) {
    const c = COSTUMES[d.costume];
    w.sprites.push({
      name: d.name, costume: d.costume, frame: (d.frame || 1) - 1,
      x: d.x ?? 0, y: d.y ?? 0, dir: d.dir ?? 90, size: d.size ?? 100, visible: d.visible !== false,
      rot: d.rot || 'lr', effect: 0, say: null, turned: 0, frames: 0, pen: { down: false, color: '#4c97ff', size: 3 },
      w: c.w, h: c.h, scripts: progs[d.name] || [],
    });
  }
  const sprite = (name) => w.sprites.find((s) => s.name === name);
  w.sprite = sprite;

  // --- kukla işlemleri ---
  const dims = (sp) => [sp.w * sp.size / 100, sp.h * sp.size / 100];
  const bbox = (sp, k = 1) => { const [bw, bh] = dims(sp); return { l: sp.x - bw / 2 * k, r: sp.x + bw / 2 * k, b: sp.y - bh / 2 * k, t: sp.y + bh / 2 * k }; };
  const overlap = (a, b) => a.l < b.r && a.r > b.l && a.b < b.t && a.t > b.b;

  function setPos(sp, x, y) {
    x = clamp(x, -W, W);
    y = clamp(y, -H, H);
    if (sp.pen.down && (x !== sp.x || y !== sp.y)) {
      const line = { x1: sp.x, y1: sp.y, x2: x, y2: y, color: sp.pen.color, size: sp.pen.size };
      w.penLines.push(line);
      w.penOps.push(line);
    }
    sp.x = x;
    sp.y = y;
  }
  w.setPos = setPos;

  // Kod içinde sorulan her “dokunuyor mu?” cevabı evet ise kaydedilir (görev denetimi için)
  function touching(sp, o) {
    const r = touching0(sp, o);
    if (r) w.log.touch.add(sp.name + '>' + o);
    return r;
  }
  function touching0(sp, o) {
    if (!sp.visible) return false;
    if (o === 'kenar') { const b = bbox(sp); return b.l <= -W || b.r >= W || b.b <= -H || b.t >= H; }
    if (o === 'duvar') { const b = bbox(sp, 0.8); return (BACKDROPS[w.backdrop].walls || []).some(([x1, y1, x2, y2]) => overlap(b, { l: x1, b: y1, r: x2, t: y2 })); }
    if (o === 'fare') { const b = bbox(sp); return w.mouse.x >= b.l && w.mouse.x <= b.r && w.mouse.y >= b.b && w.mouse.y <= b.t; }
    const other = sprite(o);
    return !!other && other !== sp && other.visible && overlap(bbox(sp, 0.75), bbox(other, 0.75));
  }
  w.touching = touching;

  function bounce(sp) {
    const b = bbox(sp);
    if (b.r > W) { sp.dir = normDir(-sp.dir); sp.x -= b.r - W; }
    else if (b.l < -W) { sp.dir = normDir(-sp.dir); sp.x += -W - b.l; }
    if (b.t > H) { sp.dir = normDir(180 - sp.dir); sp.y -= b.t - H; }
    else if (b.b < -H) { sp.dir = normDir(180 - sp.dir); sp.y += -H - b.b; }
  }

  // --- değerler ve koşullar ---
  function num(sp, v) {
    if (typeof v === 'number') return v;
    if (v == null) return 0;
    if (typeof v === 'string') { const n = parseFloat(v.replace(',', '.')); return Number.isFinite(n) ? n : 0; }
    switch (v.r) {
      case 'rand': {
        const a = num(sp, v.a);
        const b = num(sp, v.b);
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return Number.isInteger(lo) && Number.isInteger(hi) ? lo + Math.floor(w.random() * (hi - lo + 1)) : lo + w.random() * (hi - lo);
      }
      case 'x': return Math.round(sp.x);
      case 'y': return Math.round(sp.y);
      case 'dir': return sp.dir;
      case 'mx': return Math.round(w.mouse.x);
      case 'my': return Math.round(w.mouse.y);
      case 'var': return num(sp, w.vars[v.v]);
      default: return 0;
    }
  }
  const text = (sp, v) => (v && typeof v === 'object' ? String(num(sp, v)) : String(v ?? ''));
  w.num = num;

  function cond(sp, c) {
    if (!c) return false;
    switch (c.k) {
      case 'touch': return touching(sp, c.o);
      case 'key': return w.keys.has(c.key);
      case 'mouse': return w.mouse.down;
      case 'cmp': {
        const a = num(sp, c.a);
        const b = num(sp, c.b);
        return c.op === '<' ? a < b : c.op === '>' ? a > b : a === b;
      }
      default: return false;
    }
  }

  // --- yorumlayıcı ---
  function* waitFor(s) {
    const t0 = w.t;
    while (w.t < t0 + s) yield;
  }

  function* runList(sp, list, th) {
    for (const b of list) {
      if (th.dead) return;
      th.cur = b.id;
      yield* runBlock(sp, b, th);
    }
  }

  function* loopBody(sp, b, th) {
    yield* runList(sp, b.body, th);
    th.cur = b.id;
    yield;
  }

  function* runBlock(sp, b, th) {
    const a = b.args;
    const N = (k) => num(sp, a[k]);
    switch (b.op) {
      case 'move': { const r = sp.dir * Math.PI / 180; const n = N('n'); setPos(sp, sp.x + n * Math.sin(r), sp.y + n * Math.cos(r)); break; }
      case 'turnR': sp.dir = normDir(sp.dir + N('n')); sp.turned += Math.abs(N('n')); break;
      case 'turnL': sp.dir = normDir(sp.dir - N('n')); sp.turned += Math.abs(N('n')); break;
      case 'goto': setPos(sp, N('x'), N('y')); break;
      case 'gotoRand': setPos(sp, Math.round(w.random() * 440 - 220), Math.round(w.random() * 320 - 160)); break;
      case 'gotoMouse': setPos(sp, w.mouse.x, w.mouse.y); break;
      case 'glide': {
        const s = Math.max(0, N('s'));
        const x0 = sp.x;
        const y0 = sp.y;
        const x1 = N('x');
        const y1 = N('y');
        const t0 = w.t;
        while (w.t < t0 + s) {
          const k = (w.t - t0) / s;
          setPos(sp, x0 + (x1 - x0) * k, y0 + (y1 - y0) * k);
          yield;
        }
        setPos(sp, x1, y1);
        break;
      }
      case 'point': sp.dir = normDir(N('d')); break;
      case 'chx': setPos(sp, sp.x + N('n'), sp.y); break;
      case 'setx': setPos(sp, N('n'), sp.y); break;
      case 'chy': setPos(sp, sp.x, sp.y + N('n')); break;
      case 'sety': setPos(sp, sp.x, N('n')); break;
      case 'bounce': bounce(sp); break;

      case 'say': case 'sayFor': case 'thinkFor': {
        const say = { text: text(sp, a.t), think: b.op === 'thinkFor' };
        sp.say = say.text ? say : null;
        w.log.said.push({ sp: sp.name, text: say.text, t: w.t });
        if (b.op !== 'say') {
          yield* waitFor(N('s'));
          if (sp.say === say) sp.say = null;
        }
        break;
      }
      case 'costume': sp.frame = clamp((+a.c || 1) - 1, 0, COSTUMES[sp.costume].frames.length - 1); break;
      case 'costumeN': { const n = COSTUMES[sp.costume].frames.length; sp.frame = (((Math.round(N('n')) - 1) % n) + n) % n; break; }
      case 'next': sp.frame = (sp.frame + 1) % COSTUMES[sp.costume].frames.length; sp.frames++; break;
      case 'backdrop': w.backdrop = a.b; w.log.backdrops.push(a.b); break;
      case 'size': sp.size = clamp(N('n'), 5, 400); break;
      case 'chsize': sp.size = clamp(sp.size + N('n'), 5, 400); break;
      case 'color': sp.effect = (sp.effect + N('n')) % 200; break;
      case 'clearfx': sp.effect = 0; break;
      case 'show': sp.visible = true; break;
      case 'hide': sp.visible = false; sp.say = null; break;

      case 'sound': case 'soundW':
        w.log.sounds.push({ sp: sp.name, snd: a.snd, t: w.t });
        w.onSound?.(a.snd);
        if (b.op === 'soundW') yield* waitFor(SOUND_LEN[a.snd] || 0.4);
        break;
      case 'note': {
        const beats = Math.max(0, N('b'));
        w.log.notes.push(+a.note);
        w.onNote?.(+a.note, beats * BEAT);
        yield* waitFor(beats * BEAT);
        break;
      }
      case 'rest': yield* waitFor(Math.max(0, N('b')) * BEAT); break;

      case 'wait': yield* waitFor(Math.max(0, N('s'))); break;
      case 'repeat': { const n = Math.round(N('n')); for (let i = 0; i < n && !th.dead; i++) yield* loopBody(sp, b, th); break; }
      case 'forever': while (!th.dead) yield* loopBody(sp, b, th); break;
      case 'if': if (cond(sp, a.c)) yield* runList(sp, b.body, th); break;
      case 'ife': yield* runList(sp, cond(sp, a.c) ? b.body : b.body2, th); break;
      case 'waitUntil': while (!cond(sp, a.c)) yield; break;
      case 'until': while (!th.dead && !cond(sp, a.c)) yield* loopBody(sp, b, th); break;
      case 'stop': w.stopAll(); th.dead = true; break;

      case 'clear': w.penLines = []; w.penOps.push({ clear: true }); break;
      case 'down':
        sp.pen.down = true;
        { const dot = { x1: sp.x, y1: sp.y, x2: sp.x + 0.01, y2: sp.y, color: sp.pen.color, size: sp.pen.size, dot: true }; w.penLines.push(dot); w.penOps.push(dot); }
        break;
      case 'up': sp.pen.down = false; break;
      case 'pcolor': sp.pen.color = a.col; break;
      case 'psize': sp.pen.size = clamp(N('n'), 1, 60); break;
      case 'stamp': w.penOps.push({ stamp: { costume: sp.costume, frame: sp.frame, x: sp.x, y: sp.y, dir: sp.dir, size: sp.size, rot: sp.rot, effect: sp.effect, w: sp.w, h: sp.h } }); break;

      case 'setv': w.vars[a.v] = N('n'); break;
      case 'chv': w.vars[a.v] = num(sp, w.vars[a.v]) + N('n'); break;

      case 'bcast': broadcast(a.msg); break;
      case 'bcastw': {
        const started = broadcast(a.msg);
        while (started.some((t) => !t.done)) yield;
        break;
      }
      default: break;
    }
  }

  // --- iş parçacıkları ---
  function start(sp, script) {
    for (const t of w.threads) if (t.script === script) { t.dead = true; t.done = true; }
    const th = { sp, script, done: false, dead: false, cur: script[0].id };
    th.gen = runList(sp, script.slice(1), th);
    w.threads.push(th);
    return th;
  }
  const hats = (op, test = () => true) => {
    const out = [];
    for (const sp of w.sprites) for (const s of sp.scripts) if (s[0] && s[0].op === op && test(s[0])) out.push(start(sp, s));
    return out;
  };
  function broadcast(msg) {
    w.log.bcasts.push(msg);
    return hats('recv', (h) => h.args.msg === msg);
  }

  w.flag = () => { w.log.flags++; return hats('flag'); };
  w.keyDown = (k) => {
    if (!w.keys.has(k)) w.log.keys.push(k);
    w.keys.add(k);
    hats('key', (h) => h.args.key === k);
  };
  w.keyUp = (k) => w.keys.delete(k);
  w.clickSprite = (name) => {
    const sp = sprite(name);
    if (!sp) return;
    w.log.clicks.push(name);
    for (const s of sp.scripts) if (s[0] && s[0].op === 'click') start(sp, s);
  };
  w.stopAll = () => {
    for (const t of w.threads) { t.dead = true; t.done = true; }
    w.threads = [];
  };
  w.running = () => w.threads.some((t) => !t.done);

  w.step = (dt) => {
    w.t += dt;
    for (const th of w.threads.slice()) {
      if (th.done) continue;
      const r = th.gen.next();
      if (r.done) th.done = true;
    }
    w.threads = w.threads.filter((t) => !t.done);
  };

  return w;
}

// Programda bir bloğun kullanılıp kullanılmadığı (görev şartları için)
export function programUses(progs, op) {
  const any = (list) => list.some((b) => b.op === op || slotsOf(b).some((s) => any(b[s])));
  return Object.values(progs).some((scripts) => scripts.some((s) => s[0] && BLOCKS[s[0].op].kind === 'hat' && any(s)));
}
