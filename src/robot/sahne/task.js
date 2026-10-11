// Scratch görevi: talimat + hedef listesi, blok editörü ve sahne bir arada
import { createWorld, programUses } from './runtime.js';
import { createStage, thumb } from './stage.js';
import { createEditor, bid } from './editor.js';
import { mk } from './blocks.js';
import { COSTUMES, BACKDROPS } from './costumes.js';
import { playSound, playNote } from './sound.js';
import { play, confetti, toast, hideToast, load, save, esc } from '../robo.js';

const clone = (x) => JSON.parse(JSON.stringify(x));
const draftKey = (ctx, i) => `robo-taslak-${ctx.L.no}-${i}`;

// Kısa yazımlı kurulumdan (step.setup) programları üretir
function presetProgs(setup) {
  const p = {};
  for (const s of setup.sprites) p[s.name] = (s.scripts || []).map((sc) => sc.map((b) => mk(b, bid)));
  return p;
}

// Görev hedeflerinin denetlediği şeyler (lessons içindeki f(api) fonksiyonları kullanır)
export function makeApi(w, progs) {
  return {
    w,
    t: w.t,
    sp: (n) => w.sprite(n),
    said: (txt, n) => w.log.said.some((s) => (!n || s.sp === n) && (!txt || s.text.toLocaleLowerCase('tr').includes(txt.toLocaleLowerCase('tr')))),
    sounds: (snd, n) => w.log.sounds.filter((s) => (!snd || s.snd === snd) && (!n || s.sp === n)).length,
    notes: w.log.notes,
    bcast: (m) => w.log.bcasts.includes(m),
    backdrops: w.log.backdrops,
    keys: w.log.keys,
    clicks: (n) => w.log.clicks.filter((c) => !n || c === n).length,
    lines: w.penLines.filter((l) => !l.dot),
    vars: w.vars,
    uses: (op) => programUses(progs, op),
    flagged: () => w.log.flags > 0,
    touching: (a, b) => w.touching(w.sprite(a), b),
    mem: w.mem,
    count: (op) => { let c = 0; const walk = (l) => l.forEach((b) => { if (b.op === op) c++; ['body', 'body2'].forEach((k) => b[k] && walk(b[k])); }); Object.values(progs).forEach((ss) => ss.forEach(walk)); return c; },
    hats: (op, n) => Object.entries(progs).filter(([k]) => !n || k === n).reduce((c, [, ss]) => c + ss.filter((s) => s[0]?.op === op && s.length > 1).length, 0),
  };
}

export function renderScratch(el, step, done, prev, ctx) {
  // Başlangıç: bu adımın taslağı > (keep ise) önceki adımın taslağı > hazır kurulum
  const saved = load(draftKey(ctx, ctx.i), null);
  let from = saved;
  if (!from && step.keep) {
    for (let j = ctx.i - 1; j >= 0 && !from; j--) if (ctx.L.steps[j].type === 'scratch') from = load(draftKey(ctx, j), null);
  }
  let setup = clone(step.setup);
  if (from?.setup && step.library) setup = from.setup;
  const progs = presetProgs(setup);
  if (from) for (const s of setup.sprites) if (!s.locked && from.progs[s.name]) progs[s.name] = from.progs[s.name];
  for (const s of setup.sprites) progs[s.name] ||= [];
  // Kayıttan gelen blok kimlikleri yeni kimliklerle çakışmasın
  const fix = (list) => list.forEach((b) => { b.id = bid(); ['body', 'body2'].forEach((k) => b[k] && fix(b[k])); });
  Object.values(progs).forEach((ss) => ss.forEach(fix));

  const goals = step.goals || [];
  let latch = [];
  let w = null;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let won = false;
  let flagged = false;

  el.innerHTML = `<div class="sact">
  <div class="sinfo">
    <div class="stext"><h3>${step.title}</h3>${step.text}</div>
    ${goals.length ? `<ul class="goals">${goals.map((g) => `<li><span class="gbox"></span>${g.t}</li>`).join('')}</ul>` : ''}
    <div class="sbtns">${step.hint ? '<button type="button" class="hintbtn">💡 İpucu</button>' : ''}<button type="button" class="restart">↩ Kodu baştan başlat</button>${step.free ? '<button type="button" class="primary finish">✔ Bitirdim</button>' : ''}</div>
    <div class="hint" hidden></div>
  </div>
  <div class="swork">
    <div class="sedhost"></div>
    <div class="sside">
      <div class="sctrl"><button type="button" class="flag" title="Başlat">🏁</button><button type="button" class="stopb" title="Durdur">⏹</button><button type="button" class="resetb" title="Sahneyi başa al">↺</button><span class="mxy"></span></div>
      <div class="stghost"></div>
      <div class="spinfo"></div>
      ${step.library ? `<div class="slib"><label>➕ Kukla ekle <select class="addsp"><option value="">seç…</option>${Object.entries(COSTUMES).map(([k, c]) => `<option value="${k}">${c.name}</option>`).join('')}</select></label><label>🖼 Dekor <select class="setbd">${Object.entries(BACKDROPS).map(([k, b]) => `<option value="${k}"${k === setup.backdrop ? ' selected' : ''}>${b.name}</option>`).join('')}</select></label><button type="button" class="delsp">🗑 Seçili kuklayı sil</button></div>` : ''}
    </div>
  </div>
</div>`;

  const q = (s) => el.querySelector(s);
  const goalEls = [...el.querySelectorAll('.goals li')];
  const mxy = q('.mxy');
  const spinfo = q('.spinfo');

  const persist = () => save(draftKey(ctx, ctx.i), { setup: step.library ? setup : null, progs });
  const allVars = () => Object.keys(setup.vars || {});

  const stage = createStage(q('.stghost'), { showVars: step.showVars, onMouse: (m) => { mxy.textContent = `fare  x: ${m.x}  y: ${m.y}`; } });
  let editor = makeEditor();

  function makeEditor() {
    return createEditor(q('.sedhost'), {
      blocks: step.blocks,
      progs,
      start: step.edit || Object.keys(step.sol || {})[0] || setup.sprites[setup.sprites.length - 1].name,
      sprites: () => setup.sprites,
      vars: allVars(),
      msgs: step.msgs,
      backdrops: step.backdrops || (step.library ? Object.keys(BACKDROPS) : [setup.backdrop]),
      reporters: step.reporters,
      conds: step.conds,
      condDefault: step.condDefault,
      onChange: () => { persist(); },
    });
  }

  function reset() {
    w?.stopAll();
    w = createWorld(setup, progs);
    w.onSound = playSound;
    w.onNote = playNote;
    stage.attach(w);
    latch = goals.map(() => false);
    paintGoals();
  }

  function paintGoals() {
    goalEls.forEach((li, k) => li.classList.toggle('ok', !!latch[k]));
  }

  function check() {
    if (!goals.length || !w) return;
    const api = makeApi(w, progs);
    let changed = false;
    goals.forEach((g, k) => {
      let ok;
      try { ok = g.use ? [].concat(g.use).every((op) => api.uses(op)) : !!g.f(api); } catch { ok = false; }
      if (g.use) { if (latch[k] !== ok) { latch[k] = ok; changed = true; } }
      else if (ok && !latch[k]) { latch[k] = true; changed = true; play('ok'); }
    });
    if (changed) paintGoals();
    if (!won && !step.free && latch.every(Boolean) && (flagged || step.noFlag)) win();
  }

  function win() {
    won = true;
    play('win');
    confetti();
    toast('ok', `<b>${step.win || 'Harika! Görevi tamamladın! 🎉'}</b><br><small>İstersen denemeye devam et, sonra <b>Devam ▶</b> düğmesine bas.</small>`, 6000);
    done();
  }

  function loop(now) {
    // Scratch gibi saniyede 30 kare: ekran hızı ne olursa olsun kuklalar aynı hızda gider
    acc += last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (w) {
      let n = 0;
      while (acc >= 1 / 30 && n < 3) { w.step(1 / 30); acc -= 1 / 30; n++; }
      if (n === 3) acc = 0;
      stage.render();
      editor.glow(w.threads);
      check();
      const sp = w.sprite(editor.sprite);
      if (sp) spinfo.innerHTML = `${thumb(sp.costume, sp.frame)} <b>${esc(sp.name)}</b> <span>x: ${Math.round(sp.x)}</span> <span>y: ${Math.round(sp.y)}</span> <span>yön: ${Math.round(sp.dir)}</span>`;
    }
    raf = requestAnimationFrame(loop);
  }

  q('.flag').onclick = () => {
    hideToast();
    if (!step.noReset) reset();
    flagged = true;
    w.flag();
    play('click');
  };
  q('.stopb').onclick = () => { w.stopAll(); play('click'); };
  q('.resetb').onclick = () => { reset(); play('click'); };
  q('.restart').onclick = () => {
    if (!confirm('Bu adımdaki kodun silinip baştan başlansın mı?')) return;
    localStorage.removeItem(draftKey(ctx, ctx.i));
    setup = clone(step.setup);
    const p = presetProgs(setup);
    for (const k of Object.keys(progs)) delete progs[k];
    Object.assign(progs, p);
    for (const s of setup.sprites) progs[s.name] ||= [];
    editor.destroy();
    editor = makeEditor();
    reset();
  };
  q('.hintbtn')?.addEventListener('click', () => {
    const h = q('.hint');
    h.hidden = !h.hidden;
    h.innerHTML = `💡 ${step.hint}`;
  });
  q('.finish')?.addEventListener('click', () => {
    const miss = goals.filter((g, k) => !latch[k]);
    if (!flagged && !step.noFlag) { play('wrong'); toast('warn', 'Önce 🏁 ile programını çalıştır ve dene!'); return; }
    if (miss.length) { play('wrong'); toast('warn', `Az kaldı! Şunlar eksik:<br>${miss.map((g) => '• ' + g.t).join('<br>')}`); return; }
    win();
  });
  if (step.library) {
    q('.addsp').onchange = (e) => {
      const c = e.target.value;
      e.target.value = '';
      if (!c) return;
      let name = COSTUMES[c].name;
      for (let n = 2; setup.sprites.some((s) => s.name === name); n++) name = `${COSTUMES[c].name}${n}`;
      setup.sprites.push({ name, costume: c, x: Math.round(Math.random() * 200 - 100), y: Math.round(Math.random() * 120 - 60) });
      progs[name] = [];
      persist();
      editor.select(name);
      reset();
      play('add');
    };
    q('.setbd').onchange = (e) => { setup.backdrop = e.target.value; persist(); reset(); };
    q('.delsp').onclick = () => {
      const name = editor.sprite;
      if (setup.sprites.length < 2) { toast('warn', 'Sahnede en az bir kukla kalmalı.'); return; }
      if (!confirm(`“${name}” kuklası ve kodu silinsin mi?`)) return;
      setup.sprites = setup.sprites.filter((s) => s.name !== name);
      delete progs[name];
      persist();
      editor.select(setup.sprites[0].name);
      reset();
    };
  }

  reset();
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    w?.stopAll();
    stage.destroy();
    editor.destroy();
    hideToast();
  };
}
