// Izgara görevi: harita, komut düğmeleri, program alanı ve Robo'nun adım adım oynatılması
import { parseMap, parseProg, simulate, countBlocks, newId, DIR } from './sim.js';
import { robotHTML, play, confetti, sleep, prefs, toast, hideToast } from './robo.js';

export const CMDS = {
  F: { label: 'İleri git', icon: '⬆', cls: 'c-f' },
  B: { label: 'Geri git', icon: '⬇', cls: 'c-b' },
  L: { label: 'Sola dön', icon: '↰', cls: 'c-l' },
  R: { label: 'Sağa dön', icon: '↱', cls: 'c-r' },
  loop: { label: 'Tekrarla', icon: '🔁', cls: 'c-loop' },
};

const BATTERY = `<svg viewBox="0 0 40 48" aria-hidden="true"><rect x="14" y="2" width="12" height="6" rx="2" fill="#2d6a3e"/><rect x="5" y="7" width="30" height="39" rx="7" fill="#2fbf71" stroke="#1d7a47" stroke-width="3"/><path d="M23 13 L13 29 H20 L17 41 L28 24 H21 Z" fill="#ffe14d" stroke="#c99a00" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

const FAIL = {
  empty: 'Programın boş! Önce komutlara tıklayarak bir program yaz. 👈',
  tree: 'Aaa! Önümde ağaç var 🌳 Oradan geçemem.',
  edge: 'Dur! Orada yol yok, haritanın dışına çıkamam.',
  water: 'Şıpırtı! Suya düştüm 💦 Robotlar yüzemez!',
  nostars: 'Pile geldim ama bütün yıldızları toplamadım ⭐',
  nogoal: 'Komutlar bitti ama pile ulaşamadım 🔋',
};
const WIN = ['Harika! Robo pile ulaştı! 🎉', 'Süpersin! Algoritman çalıştı! 🌟', 'Bravo! Tam bir programcı gibi! 🤖', 'Mükemmel! Robo\'nun pili doldu! 🔋'];

export function renderGrid(el, step, done) {
  const m = parseMap(step.map);
  const dir0 = DIR[step.dir || 'E'];
  const max = step.max || 0;
  let prog = step.preset ? parseProg(step.preset) : [];
  let caret = { list: prog, i: prog.length };
  let tok = 0;
  let running = false;
  let fails = 0;

  const tiles = [];
  for (let y = 0; y < m.h; y++) {
    for (let x = 0; x < m.w; x++) {
      const c = m.cell[y][x];
      tiles.push(`<div class="tile t-${c}${(x + y) % 2 ? ' alt' : ''}"></div>`);
    }
  }
  const items = [
    `<div class="it start" style="--x:${m.start.x};--y:${m.start.y}"></div>`,
    `<div class="it goal" style="--x:${m.goal.x};--y:${m.goal.y}">${BATTERY}</div>`,
    ...m.stars.map((s) => `<div class="it star" data-k="${s.x},${s.y}" style="--x:${s.x};--y:${s.y}">⭐</div>`),
  ];

  el.innerHTML = `<div class="gridact">
  <div class="gleft">
    <div class="ginfo"><h3>${step.title}</h3>${step.text}</div>
    <div class="gboard"><div class="board" style="--w:${m.w};--h:${m.h}">${tiles.join('')}${items.join('')}<div class="path"></div>${robotHTML(dir0, m.start.x, m.start.y)}</div></div>
    <div class="hint" hidden></div>
  </div>
  <div class="gcode">
    <h4>Komutlar</h4>
    <div class="tools">${step.tools.map((c) => `<button type="button" class="tool ${CMDS[c].cls}" data-c="${c}"><span class="bi">${CMDS[c].icon}</span>${CMDS[c].label}</button>`).join('')}</div>
    <h4>Programım <span class="cnt"></span></h4>
    <div class="prog" tabindex="-1"></div>
    <p class="ptip">✋ Blokları <b>sürükleyerek</b> yerini değiştirebilir${step.tools.includes('loop') ? ', döngünün içine ya da dışına taşıyabilirsin' : ''}.</p>
    <div class="ctrl">
      <button type="button" class="primary run">▶ Çalıştır</button>
      <button type="button" class="reset">↺ Başa al</button>
      <button type="button" class="clear">${step.preset ? '↺ İlk program' : '🗑 Temizle'}</button>
    </div>
  </div>
</div>`;

  const q = (s) => el.querySelector(s);
  const board = q('.board');
  const rb = q('.rb');
  const arrow = q('.rarrow');
  const progEl = q('.prog');
  const cnt = q('.cnt');
  const hintEl = q('.hint');
  const runBtn = q('.run');
  const trail = q('.path');

  // Kare boyutu alana göre ayarlanır
  const fit = () => {
    const w = q('.gboard').clientWidth - 8;
    const t = Math.max(38, Math.min(84, Math.floor(w / m.w)));
    board.style.setProperty('--t', t + 'px');
  };
  const ro = new ResizeObserver(fit);
  ro.observe(q('.gboard'));
  fit();

  // Sonuçlar ekranın üstünde bildirim olarak çıkar; tahta ve sayfa yerinden oynamaz
  const say = (kind, html) => toast(kind, html);

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
    running = false;
    rb.classList.remove('bump', 'fall', 'happy', 'sad', 'walk', 'halt');
    place({ x: m.start.x, y: m.start.y, d: dir0, rot: dir0 * 90 }, true);
    el.querySelectorAll('.star').forEach((s) => s.classList.remove('got'));
    q('.goal').classList.remove('win');
    trail.innerHTML = '';
    highlight(null);
    el.querySelectorAll('.blk.extra').forEach((b) => b.classList.remove('extra'));
    setRunning(false);
  }

  function setRunning(on) {
    running = on;
    el.classList.toggle('running', on);
    runBtn.textContent = on ? '⏹ Durdur' : '▶ Çalıştır';
  }

  // --- program alanı ---
  function find(id, list = prog) {
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (b.id === id) return { list, i, b };
      if (b.body) { const r = find(id, b.body); if (r) return r; }
    }
    return null;
  }

  function blockHTML(b) {
    const k = CMDS[b.c];
    const del = '<button type="button" class="del" title="Sil" aria-label="Bloğu sil">✖</button>';
    if (b.c === 'loop') {
      const opts = [2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<option${n === b.n ? ' selected' : ''}>${n}</option>`).join('');
      return `<div class="blk loop c-loop" data-id="${b.id}"><div class="lhead"><span class="bi">${k.icon}</span><select aria-label="Kaç kez">${opts}</select> kez tekrarla <span class="iter"></span>${del}</div><div class="lbody" data-in="${b.id}">${listHTML(b.body)}</div><div class="lfoot" data-after="${b.id}">döngü sonu ⤶</div></div>`;
    }
    return `<div class="blk ${k.cls}" data-id="${b.id}"><span class="bi">${k.icon}</span><span class="bl">${k.label}</span>${del}</div>`;
  }

  function listHTML(list) {
    let h = '';
    for (let i = 0; i <= list.length; i++) {
      if (caret.list === list && caret.i === i) h += '<span class="caret" aria-hidden="true"></span>';
      if (i < list.length) h += blockHTML(list[i]);
    }
    if (!list.length) h += list === prog ? '<span class="pempty">Komutlara tıkla, buraya eklensin 👆</span>' : '<span class="pempty">içine komut ekle ya da bir bloğu buraya sürükle</span>';
    return h;
  }

  function draw(newId) {
    progEl.innerHTML = listHTML(prog);
    const n = countBlocks(prog);
    cnt.textContent = max ? `${n} / ${max} blok` : `${n} blok`;
    cnt.classList.toggle('full', !!max && n >= max);
    if (newId) progEl.querySelector(`[data-id="${newId}"]`)?.classList.add('new');
    // İmleç görünür kalsın ama yalnızca program kutusu kaysın, sayfa değil
    const c = progEl.querySelector('.caret');
    if (c) {
      const pr = progEl.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      if (cr.bottom > pr.bottom) progEl.scrollTop += cr.bottom - pr.bottom + 10;
      else if (cr.top < pr.top) progEl.scrollTop -= pr.top - cr.top + 10;
    }
  }

  function changed() {
    resetRobot();
    hideToast();
  }

  function add(c) {
    if (running) return;
    if (max && countBlocks(prog) >= max) {
      play('wrong');
      say('warn', `Bu görevde en fazla <b>${max} blok</b> kullanabilirsin. ${step.tools.includes('loop') ? '🔁 Tekrarla bloğu ile kısaltmayı dene!' : ''}`);
      cnt.classList.remove('shake'); void cnt.offsetWidth; cnt.classList.add('shake');
      return;
    }
    if (c === 'loop' && caret.list !== prog) {
      play('wrong');
      say('warn', 'Döngünün içine bir döngü daha koymayalım. Önce “döngü sonu” yazısına tıkla.');
      return;
    }
    const b = c === 'loop' ? { id: newId(), c, n: step.loopN || 3, body: [] } : { id: newId(), c };
    caret.list.splice(caret.i, 0, b);
    caret = c === 'loop' ? { list: b.body, i: 0 } : { list: caret.list, i: caret.i + 1 };
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

  progEl.addEventListener('click', (e) => {
    if (running) return;
    const t = e.target;
    const del = t.closest('.del');
    if (del) return remove(+del.closest('.blk').dataset.id);
    if (t.closest('select')) return;
    const foot = t.closest('.lfoot');
    const blk = t.closest('.blk:not(.loop)');
    const inLoop = t.closest('.lhead') ? t.closest('.loop').dataset.id : t.closest('.lbody')?.dataset.in;
    if (foot) { const f = find(+foot.dataset.after); caret = { list: f.list, i: f.i + 1 }; }
    else if (blk) { const f = find(+blk.dataset.id); caret = { list: f.list, i: f.i + 1 }; }
    else if (inLoop) { const f = find(+inLoop); caret = { list: f.b.body, i: f.b.body.length }; }
    else caret = { list: prog, i: prog.length };
    play('click');
    draw();
  });

  // --- sürükle bırak: blokların yerini değiştirme, döngünün içine/dışına taşıma (fare ve dokunmatik) ---
  let drag = null;
  let dragged = false;
  progEl.addEventListener('pointerdown', (e) => {
    if (running || e.button > 0 || e.target.closest('.del, select')) return;
    const blk = e.target.closest('.blk');
    if (blk) drag = { el: blk, f: find(+blk.dataset.id), x0: e.clientX, y0: e.clientY, on: false };
  });
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
      progEl.classList.add('dnd');
    }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX - drag.ox}px, ${e.clientY - drag.oy}px) rotate(2deg)`;
    // Bırakılacak yer: parmağın altındaki döngü gövdesi ya da programın kendisi
    const under = document.elementFromPoint(e.clientX, e.clientY);
    drag.to = null;
    if (!under || !progEl.contains(under)) { drag.mark.remove(); return; }
    const body = under.closest('.lbody');
    const cont = body && drag.f.b.c !== 'loop' && !drag.el.contains(body) ? body : progEl;
    const kids = [...cont.children].filter((k) => k.classList.contains('blk') && k !== drag.el);
    let i = kids.findIndex((k) => { const r = k.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    if (i < 0) i = kids.length;
    cont.insertBefore(drag.mark, kids[i] || cont.querySelector(':scope > .pempty'));
    drag.to = { list: cont === progEl ? prog : find(+cont.dataset.in).b.body, i };
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.on) return;
    dragged = true;
    d.ghost.remove();
    d.mark.remove();
    progEl.classList.remove('dnd');
    d.el.classList.remove('dragging');
    if (!d.to) return;
    const f = find(d.f.b.id);
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
  progEl.addEventListener('click', (e) => { if (dragged) { dragged = false; e.stopImmediatePropagation(); } }, true);

  progEl.addEventListener('change', (e) => {
    if (e.target.tagName !== 'SELECT') return;
    find(+e.target.closest('.loop').dataset.id).b.n = +e.target.value;
    changed();
  });

  q('.reset').onclick = () => { changed(); play('click'); };
  q('.clear').onclick = () => {
    prog = step.preset ? parseProg(step.preset) : [];
    caret = { list: prog, i: prog.length };
    play('del');
    changed();
    draw();
  };

  // --- çalıştırma ---
  function highlight(e) {
    el.querySelectorAll('.blk.now').forEach((b) => b.classList.remove('now'));
    el.querySelectorAll('.iter').forEach((s) => { s.textContent = ''; });
    if (!e) return;
    if (e.id) el.querySelector(`.blk[data-id="${e.id}"]`)?.classList.add('now');
    if (e.loop) {
      const l = el.querySelector(`.loop[data-id="${e.loop}"]`);
      if (l) l.querySelector('.iter').textContent = `(${e.iter}. tur)`;
    }
  }

  async function run() {
    if (running) { resetRobot(); return; }
    resetRobot();
    hideToast();
    const { ev, result, extra, extraId } = simulate(m, dir0, prog);
    const my = ++tok;
    setRunning(true);
    const ms = prefs.fast ? 280 : 560;
    board.style.setProperty('--dur', ms * 0.8 + 'ms');
    await sleep(150);
    for (const e of ev) {
      if (my !== tok) return;
      highlight(e);
      if (e.t === 'turn') { place(e); play('turn'); }
      else if (e.t === 'move') {
        const dot = document.createElement('i');
        dot.style.cssText = `--x:${rb.style.getPropertyValue('--x')};--y:${rb.style.getPropertyValue('--y')}`;
        trail.appendChild(dot);
        place(e);
        rb.classList.remove('walk'); void rb.offsetWidth; rb.classList.add('walk');
        play('step');
        if (e.star) setTimeout(() => { el.querySelector(`.star[data-k="${e.star}"]`)?.classList.add('got'); play('star'); }, ms * 0.6);
      } else if (e.t === 'bump') {
        rb.style.setProperty('--bx', e.bx);
        rb.style.setProperty('--by', e.by);
        rb.classList.add('bump');
        play('bump');
      } else if (e.t === 'fall') {
        place(e);
        setTimeout(() => { rb.classList.add('fall'); play('splash'); }, ms * 0.6);
        await sleep(ms * 0.6);
      }
      await sleep(e.t === 'win' || e.t === 'stop' ? 0 : ms);
    }
    if (my !== tok) return;
    highlight(null);
    setRunning(false);
    if (result === 'win') {
      rb.classList.add('happy');
      q('.goal').classList.add('win');
      play('win');
      confetti();
      const n = countBlocks(prog);
      say('ok', `<b>${step.win || WIN[Math.floor(Math.random() * WIN.length)]}</b><br>${n} blokla çözdün. Şimdi <b>Devam ▶</b> düğmesine basabilirsin.`);
      hintEl.hidden = true;
      done();
    } else if (result === 'extra') {
      // Robo pilde durduruldu: kalan yürüme komutları fazla
      rb.classList.add('halt');
      el.querySelector(`.blk[data-id="${extraId}"]`)?.classList.add('extra');
      play('wrong');
      say('warn', `<b>Dur! Pile ulaştım ama programında ${extra} fazla adım var.</b><br>Devam etseydim pili geçip giderdim! Kırmızı çerçeveli blok ve ondan sonrakiler fazla; onları ✖ ile sil ve tekrar dene.`);
    } else {
      fails++;
      rb.classList.add('sad');
      if (result === 'empty' || result === 'nogoal' || result === 'nostars') play('wrong');
      say('bad', `<b>${FAIL[result]}</b><br><small>Programını düzelt ve tekrar ▶ Çalıştır'a bas.</small>`);
      if (step.hint && fails >= 2) { hintEl.hidden = false; hintEl.innerHTML = `💡 <b>İpucu:</b> ${step.hint}`; }
    }
  }
  runBtn.onclick = run;

  draw();
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
