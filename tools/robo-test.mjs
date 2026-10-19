// Robo ile Kodlama: bütün görevlerin örnek çözümünü (sol) başsız sınar. Tarayıcı gerekmez.
// Kullanım: node tools/robo-test.mjs [h1 h4 ek2 … | all] [--seeds=N] [--mutate] [--only=NO] [-v]
//   all (varsayılan): src/robot/lessons/ içindeki sh.js ve index.js dışındaki bütün dosyalar
//   (index.js'e henüz eklenmemiş ek4, ek5… dosyaları da; dosyadaki `export const bN` nesneleri alınır)
//   --seeds=N  sahne görevleri N farklı rastgele tohumla sınanır (varsayılan 3)
//   --mutate   sol'ün son bloğu atılınca hâlâ geçen görevleri listeler (bilgi amaçlı, hata sayılmaz)
//   --only=NO  yalnız o bölüm (13 ya da b13)
//   -v         geçen görevleri de tek tek yazar
// Izgara: sol bütün haritalarda kazanır mı, max/tools/conds sınırına uyar mı, preset kendiliğinden kazanıyor mu.
// Sahne: sol hedefleri testTime (yoksa 20 sn) içinde sağlıyor mu; sol palette (blocks/reporters/conds) olmayan blok
//   kullanıyor mu (PALET); boş programla hedefler sağlanıyor mu (BOŞ, uyarı). Quiz: a geçerli şık mı + dağılım.
// Çıktı sonunda özet satırı; başarısız varsa çıkış kodu 1. Geçici paket node_modules/.cache/robo-test/ altına yazılır.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src/robot');
const CACHE = path.join(ROOT, 'node_modules/.cache/robo-test');
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const SEEDS = +opt('seeds', 3);
const MUTATE = args.includes('--mutate');
const VERBOSE = args.includes('-v');
const ONLY = opt('only', '').replace(/^b/, '');
const DEFAULT_TIME = 20;

// --- dosya seçimi ---
const all = fs.readdirSync(path.join(SRC, 'lessons')).filter((f) => f.endsWith('.js') && !['sh.js', 'index.js'].includes(f)).map((f) => f.slice(0, -3));
const wanted = args.filter((a) => !a.startsWith('-'));
const files = !wanted.length || wanted.includes('all') ? all : wanted;
for (const f of files) if (!all.includes(f)) { console.error(`Böyle bir ders dosyası yok: ${f} (var olanlar: ${all.join(' ')})`); process.exit(2); }
files.sort((a, b) => all.indexOf(a) - all.indexOf(b));

// --- paket: robo.js ve sound.js (DOM/ses) boş taslaklarla değiştirilir; adlar gerçek dosyadan okunur ---
const STUB_VALUES = { prefs: '{ fast: false, sound: false }', profile: "{ name: '' }", profiles: '() => []', esc: '(s) => String(s)', pload: '(k, d) => d', load: '(k, d) => d', roboSVG: "() => ''", miniBot: "() => ''", robotHTML: "() => ''", sleep: '() => Promise.resolve()' };
const stubs = {
  name: 'robo-taslak',
  setup(b) {
    b.onResolve({ filter: /(^|\/)(robo|sound)\.js$/ }, (a) => ({ path: path.resolve(a.resolveDir, a.path), namespace: 'taslak' }));
    b.onLoad({ filter: /.*/, namespace: 'taslak' }, (a) => {
      const names = [...fs.readFileSync(a.path, 'utf8').matchAll(/^export (?:const|let|function|async function) (\w+)/gm)].map((m) => m[1]);
      return { contents: 'const f = () => {};\n' + names.map((n) => `export const ${n} = ${STUB_VALUES[n] ?? 'f'};`).join('\n'), loader: 'js' };
    });
  },
};
fs.mkdirSync(CACHE, { recursive: true });
const entry = `${files.map((f, i) => `import * as m${i} from './lessons/${f}.js';`).join('\n')}
export const mods = { ${files.map((f, i) => `'${f}': m${i}`).join(', ')} };
export { simulate, parseMap, parseProg, countBlocks } from './sim.js';
export { createWorld } from './sahne/runtime.js';
export { makeApi } from './sahne/task.js';
export { mk, BLOCKS } from './sahne/blocks.js';`;
const outfile = path.join(CACHE, 'bundle.mjs');
try {
  await build({ stdin: { contents: entry, resolveDir: SRC, sourcefile: 'robo-test-giris.js' }, bundle: true, format: 'esm', platform: 'node', outfile, plugins: [stubs], logLevel: 'error', charset: 'utf8' });
} catch (e) { console.error('Paket derlenemedi (bir ders dosyası bozuk olabilir):', e.message); process.exit(1); }
globalThis.document = new Proxy({}, { get: () => () => ({}) });
const B = await import(pathToFileURL(outfile).href + '?' + Date.now());
const { simulate, parseMap, parseProg, countBlocks, createWorld, makeApi, mk, mods, BLOCKS } = B;

const clone = (x) => JSON.parse(JSON.stringify(x));
let uid = 0;
const bid = () => 'b' + ++uid;
const mkProgs = (scripts) => (scripts || []).map((sc) => sc.map((b) => mk(b, bid)));

// --- ızgara ---
const DEFAULT_CONDS = ['open', 'blocked', 'star', 'goal'];
const TOOL_OF = { F: 'F', B: 'B', L: 'L', R: 'R', P: 'P', fn: 'fn', loop: 'loop', if: 'if', ife: 'ife', until: 'until' };
function toolsUsed(prog, set = new Set(), conds = new Set()) {
  for (const b of prog) {
    set.add(TOOL_OF[b.c] || b.c);
    if (b.cond) conds.add(b.cond);
    for (const s of ['body', 'body2']) if (b[s]) toolsUsed(b[s], set, conds);
  }
  return { set, conds };
}
function testGrid(st) {
  const bad = [];
  const rows = st.maps || [st.map];
  const M = rows.map(parseMap);
  const dirs = rows.map((_, k) => ({ N: 0, E: 1, S: 2, W: 3 })[(st.dirs && st.dirs[k]) || st.dir || 'E']);
  if (typeof st.sol !== 'string') return { bad: ['sol yok'], info: true };
  const prog = parseProg(st.sol);
  const fn = parseProg(st.fnSol || st.fnPreset || '');
  M.forEach((m, k) => {
    const r = simulate(m, dirs[k], prog, { fn, pick: st.pick }).result;
    if (r !== 'win') bad.push(`sol ${rows.length > 1 ? `${k + 1}. haritada ` : ''}kazanmıyor (${r})`);
  });
  const n = countBlocks(prog) + countBlocks(fn);
  if (st.max && n > st.max) bad.push(`sol ${n} blok, max ${st.max}`);
  const u = toolsUsed(prog); toolsUsed(fn, u.set, u.conds);
  for (const t of u.set) if (!(st.tools || []).includes(t)) bad.push(`sol tools'ta olmayan "${t}" kullanıyor`);
  for (const c of u.conds) if (!(st.conds || DEFAULT_CONDS).includes(c)) bad.push(`sol conds'ta olmayan "${c}" koşulunu kullanıyor`);
  if (fn.length && !(st.tools || []).includes('fn')) bad.push('fnSol var ama tools\'ta fn yok');
  if (st.preset || st.fnPreset) {
    const pp = parseProg(st.preset || '');
    const pf = parseProg(st.fnPreset || '');
    if (pp.length && M.every((m, k) => simulate(m, dirs[k], pp, { fn: pf, pick: st.pick }).result === 'win')) bad.push('preset kendiliğinden kazanıyor');
    if (st.max && countBlocks(pp) + countBlocks(pf) > st.max) bad.push('preset max\'ı aşıyor');
  }
  return { bad };
}

// --- sahne ---
const lcg = (seed) => { let a = seed * 7919 + 1; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; };
const snapOf = (progs, setup) => JSON.stringify([progs, setup.sprites.map((s) => s.name), setup.backdrop], (k, v) => (k === 'id' ? undefined : v));

// Oyuncu olaylarını (st.play) zaman çizelgesine açar. Tuş basılı tutma ~10 olay/sn: t0 + k·0.1 anlarında keyDown, sonunda keyUp.
function timeline(play) {
  const tl = [];
  for (const e of play || []) {
    if (e[0] === 'hold') {
      const n = Math.max(1, Math.round((e[3] - e[2]) * 10));
      for (let k = 0; k < n; k++) tl.push([e[2] + k * 0.1, (w) => w.keyDown(e[1])]);
      tl.push([e[3], (w) => w.keyUp(e[1])]);
    } else if (e[0] === 'tap' || e[0] === 'key') tl.push([e[2], (w) => { w.keyDown(e[1]); w.keyUp(e[1]); }]);
    else if (e[0] === 'click') tl.push([e[2], (w) => w.clickSprite(e[1])]);
    else if (e[0] === 'mouse') tl.push([e[3], (w) => { w.mouse.x = e[1]; w.mouse.y = e[2]; }]);
    else if (e[0] === 'fn') tl.push([e[1], (w) => e[2](w)]);
    else throw new Error('bilinmeyen play olayı: ' + e[0]);
  }
  return tl.sort((a, b) => a[0] - b[0]);
}

function runScratch(st, progs, setup, base, seed, T, forceChanged = false) {
  const w = createWorld(setup, progs, { random: lcg(seed) });
  // Serbest görevde sol çoğu kez açılış koduyla aynıdır; “değişiklik yap” hedefi öğrenciden beklenir, bu yüzden sol'de sağlanmış sayılır
  const changed = () => forceChanged || snapOf(progs, setup) !== base;
  const latch = st.goals.map(() => false);
  const tl = timeline(st.play);
  let ei = 0, askAt = null, ai = 0;
  w.flag();
  for (let f = 0; f < T * 30; f++) {
    const t = f / 30;
    while (ei < tl.length && tl[ei][0] <= t + 1e-9) tl[ei++][1](w);
    if (w.asking) {
      askAt ??= t;
      if (t - askAt >= 0.5) { const A = typeof st.answers === 'function' ? st.answers(w) : (st.answers || ['a'])[ai++ % (st.answers || ['a']).length]; w.answerQ(A); askAt = null; }
    }
    w.step(1 / 30);
    const api = makeApi(w, progs, changed);
    st.goals.forEach((g, k) => { if (!latch[k]) { try { latch[k] = g.use ? [].concat(g.use).every((o) => api.uses(o)) : !!g.f(api); } catch { /* sağlanmadı say */ } } });
    if (latch.every(Boolean)) return { ok: true, t, latch };
  }
  return { ok: false, latch };
}

// sol'de palette olmayan bloklar
function paletteIssues(st, sol) {
  const out = new Set();
  const blocks = st.blocks || [];
  const reps = st.reporters || [];
  const condKinds = st.conds || ['touch', 'key', 'mouse', 'cmp'];
  const val = (v, inCmpLeft) => {
    if (!v || typeof v !== 'object') return;
    if (v.r) {
      if (!(inCmpLeft && ['x', 'y', 'var'].includes(v.r)) && !reps.includes(v.r)) out.add(`reporter:${v.r}`);
      for (const k of ['a', 'b']) val(v[k]);
    } else if (v.k) {
      if (!condKinds.includes(v.k)) out.add(`koşul:${v.k}`);
      if (v.k === 'cmp') { val(v.a, true); val(v.b); }
    }
  };
  const walk = (list) => list.forEach((b) => {
    if (!blocks.includes(b.op)) out.add(`blok:${b.op}`);
    Object.values(b.args || {}).forEach((v) => val(v));
    for (const s of ['body', 'body2']) if (b[s]) walk(b[s]);
  });
  Object.values(sol).forEach((ss) => mkProgs(ss).forEach(walk));
  return [...out];
}

function testScratch(st, ctx) {
  const bad = [];
  const warn = [];
  const T = st.testTime || DEFAULT_TIME;
  const setup = clone(st.testSetup || st.setup);
  const unlocked = (setup.sprites || []).filter((s) => !s.locked).map((s) => s.name);
  // başlangıç: hazır kurulum, keep ise önceki adımın etkin kodu
  const initProgs = {};
  for (const s of setup.sprites) initProgs[s.name] = mkProgs(s.scripts);
  const baseProgs = clone(initProgs);
  if (st.keep && ctx.prev) for (const n of unlocked) if (ctx.prev[n]) baseProgs[n] = clone(ctx.prev[n]);
  const base = snapOf(baseProgs, setup);
  if (!st.sol) return { bad: [], info: 'sol yok', eff: baseProgs };
  const solProgs = clone(baseProgs);
  for (const [n, sc] of Object.entries(st.sol)) if (setup.sprites.some((s) => s.name === n) && !setup.sprites.find((s) => s.name === n).locked) solProgs[n] = mkProgs(sc);
  const eff = clone(solProgs);
  const fails = [];
  let tmax = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const r = runScratch(st, clone(solProgs), clone(setup), base, s, T, !!st.free);
    if (r.ok) tmax = Math.max(tmax, r.t);
    else fails.push({ s, missing: st.goals.filter((g, k) => !r.latch[k]).map((g) => g.t) });
  }
  if (fails.length) bad.push(`hedef sağlanmadı (${fails.length}/${SEEDS} tohum, ${T} sn): ${[...new Set(fails.flatMap((f) => f.missing))].join('; ')}`);
  const pal = paletteIssues(st, st.sol);
  if (pal.length) warn.push(`PALET: ${pal.join(', ')}`);
  // boş program
  const empty = {};
  for (const s of setup.sprites) empty[s.name] = mkProgs(s.scripts);
  const re = runScratch(st, empty, clone(setup), snapOf(empty, setup), 1, T);
  if (re.ok) warn.push('BOŞ: hedefler boş programla da sağlanıyor');
  let mut = null;
  if (MUTATE && !st.free && !bad.length) {
    const m = clone(solProgs);
    const names = Object.keys(st.sol).filter((n) => unlocked.includes(n));
    const k = names.at(-1);
    const last = m[k]?.at(-1);
    if (last) { if (last.length > 1) last.pop(); else m[k].pop(); }
    if (names.length && Array.from({ length: SEEDS }, (_, i) => runScratch(st, clone(m), clone(setup), base, i + 1, T)).every((r) => r.ok)) mut = 'AYIRT-EDEMEDİ: son blok atılınca da geçiyor';
  }
  return { bad, warn, mut, tmax, eff };
}

// --- ana döngü ---
const total = { gridOk: 0, grid: 0, scOk: 0, sc: 0, pal: 0, bos: 0, fail: 0, mut: 0, skip: 0 };
const lines = (arr, pre) => arr.forEach((l) => console.log(pre + l));
for (const f of files) {
  const lessons = Object.entries(mods[f]).filter(([, v]) => v && Array.isArray(v.steps)).filter(([k]) => !ONLY || k === 'b' + ONLY);
  const c = { grid: 0, gridOk: 0, sc: 0, scOk: 0, quiz: 0 };
  const dist = {};
  for (const [name, L] of lessons) {
    let prev = null; // keep için önceki sahne adımının etkin kodu
    for (const [i, st] of L.steps.entries()) {
      const tag = `${f} ${name}/${i} "${st.title || st.type}"`;
      try {
        if (st.type === 'grid') {
          const r = testGrid(st);
          if (r.info) { total.skip++; console.log(`UYARI ${tag}: ${r.bad.join('; ')}`); continue; }
          c.grid++; total.grid++;
          if (r.bad.length) { total.fail++; console.log(`BAŞARISIZ ${tag}`); lines(r.bad, '    '); } else { c.gridOk++; total.gridOk++; if (VERBOSE) console.log(`ok ${tag}`); }
        } else if (st.type === 'scratch') {
          const r = testScratch(st, { prev });
          prev = r.eff || prev;
          if (r.info) { total.skip++; console.log(`UYARI ${tag}: ${r.info}`); continue; }
          c.sc++; total.sc++;
          if (r.bad.length) { total.fail++; console.log(`BAŞARISIZ ${tag}`); lines(r.bad, '    '); } else { c.scOk++; total.scOk++; if (VERBOSE) console.log(`ok ${tag} (${r.tmax.toFixed(1)} sn)`); }
          if (r.warn.length) { if (r.warn.some((w) => w.startsWith('PALET'))) total.pal++; if (r.warn.some((w) => w.startsWith('BOŞ'))) total.bos++; console.log(`UYARI ${tag}${st.free ? ' [serbest]' : ''}`); lines(r.warn, '    '); }
          if (r.mut) { total.mut++; console.log(`BİLGİ ${tag}: ${r.mut}`); }
        } else if (st.type === 'quiz') {
          c.quiz++;
          const okA = Number.isInteger(st.a) && Array.isArray(st.opts) && st.a >= 0 && st.a < st.opts.length;
          if (!okA) { total.fail++; console.log(`BAŞARISIZ ${tag}: quiz "a" geçerli bir şık indeksi değil (a=${st.a}, şık sayısı ${st.opts?.length})`); } else dist[st.a] = (dist[st.a] || 0) + 1;
        }
      } catch (e) {
        total.fail++;
        console.log(`BAŞARISIZ ${tag}: hata ${e.stack?.split('\n').slice(0, 3).join(' | ') || e}`);
      }
    }
  }
  console.log(`${f.padEnd(4)} Izgara ${c.gridOk}/${c.grid}, Sahne ${c.scOk}/${c.sc}, Quiz ${c.quiz} (doğru şık dağılımı: ${Object.entries(dist).map(([k, v]) => `${'ABCDEF'[k] || k}=${v}`).join(' ') || '-'})`);
}
if (MUTATE) console.log(`Ayırt edilemeyen (mutate): ${total.mut}`);
console.log(`Boş programla geçen: ${total.bos}, sol'süz atlanan: ${total.skip}`);
console.log(`Izgara: ${total.gridOk}/${total.grid}, Sahne: ${total.scOk}/${total.sc}, Palet uyarısı: ${total.pal}, Başarısız: ${total.fail}`);
process.exit(total.fail ? 1 : 0);
