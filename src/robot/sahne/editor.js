// Scratch benzeri blok editörü: palet, kukla sekmeleri, betikler, girdiler ve sürükle-bırak
import { BLOCKS, CATS, KEYS, SOUNDS, NOTES, COLORS, REPORTERS, COND_KINDS, isHat, slotsOf, mk } from './blocks.js';
import { COSTUMES, BACKDROPS } from './costumes.js';
import { thumb } from './stage.js';
import { play, toast, esc } from '../robo.js';

let uid = 5e6;
export const bid = () => ++uid;

const OPS = { '<': '<', '=': '=', '>': '>' };
const color = (op) => (CATS[BLOCKS[op].cat] || { color: '#59c059' }).color;

export function createEditor(host, cfg) {
  const allowed = cfg.blocks;
  const cats = [...new Set(allowed.map((op) => BLOCKS[op].cat))];
  let cur = cfg.start && cfg.sprites().some((s) => s.name === cfg.start) ? cfg.start : cfg.sprites()[0].name;
  let caret = null; // { list, i }
  const progs = cfg.progs;

  host.innerHTML = `<div class="sed">
  <div class="spal"><div class="scats">${cats.map((c) => `<button type="button" class="scat" data-c="${c}" style="--k:${CATS[c].color}"><i></i>${CATS[c].name}</button>`).join('')}</div><div class="sblocks"></div></div>
  <div class="sscripts"><div class="stabs"></div><div class="scode" tabindex="-1"></div><p class="ptip">👆 Bir bloğa tıklayınca kırmızı çizginin olduğu yere eklenir. ✋ Blokları sürükleyerek taşıyabilirsin.</p></div>
</div>`;
  const pal = host.querySelector('.sblocks');
  const tabs = host.querySelector('.stabs');
  const code = host.querySelector('.scode');

  const sprites = () => cfg.sprites();
  const spDef = () => sprites().find((s) => s.name === cur) || sprites()[0];
  const scripts = () => (progs[cur] ||= []);
  const locked = () => !!spDef().locked;

  // --- girdilerin çizimi ---
  const opt = (v, label, sel) => `<option value="${esc(v)}"${String(sel) === String(v) ? ' selected' : ''}>${esc(label)}</option>`;
  const sel = (arg, part, options, val, cls = '') => `<select class="in ${cls}" data-arg="${arg}"${part ? ` data-part="${part}"` : ''}>${options.map(([v, l]) => opt(v, l, val)).join('')}</select>`;

  function repMenu(arg) {
    if (!cfg.reporters?.length) return '';
    const o = [['', '▾']];
    for (const r of cfg.reporters) {
      if (r === 'var') for (const v of cfg.vars || []) o.push(['var:' + v, v]);
      else o.push([r, REPORTERS[r].label]);
    }
    return sel(arg, 'rep', o, '', 'rep');
  }

  function numSlot(arg, v, kind) {
    if (v && typeof v === 'object') {
      const R = REPORTERS[v.r];
      const k = (CATS[R.cat] || { color: '#59c059' }).color;
      let inner = esc(R.label);
      if (v.r === 'rand') inner = `rastgele <input class="in num" data-arg="${arg}" data-part="a" value="${esc(v.a)}" size="3"> ile <input class="in num" data-arg="${arg}" data-part="b" value="${esc(v.b)}" size="3"> arası`;
      if (v.r === 'var') inner = esc(v.v);
      return `<span class="rp" style="--k:${k}">${inner}<button type="button" class="rpx" data-arg="${arg}" title="Sayıya çevir">×</button></span>`;
    }
    return `<input class="in ${kind}" data-arg="${arg}" value="${esc(v)}" size="${Math.max(kind === 'txt' ? 4 : 2, String(v).length)}" inputmode="${kind === 'num' ? 'decimal' : 'text'}">${repMenu(arg)}`;
  }

  function touchTargets() {
    const t = [['kenar', 'kenar'], ...sprites().filter((s) => s.name !== cur).map((s) => [s.name, s.name])];
    if ((cfg.backdrops || []).some((b) => BACKDROPS[b].walls)) t.push(['duvar', 'duvar']);
    t.push(['fare', 'fare imleci']);
    return t;
  }

  function condSlot(arg, c) {
    const kinds = cfg.conds || Object.keys(COND_KINDS);
    const ksel = sel(arg, 'kind', [...(c ? [] : [['', 'koşul seç ▾']]), ...kinds.map((k) => [k, k === 'cmp' ? 'karşılaştır' : k === 'touch' ? 'dokunma' : k === 'key' ? 'tuş' : 'fare']) ], c ? c.k : '', 'kind');
    if (!c) return `<span class="cnd empty">${ksel}</span>`;
    let body = '';
    if (c.k === 'touch') body = `${sel(arg, 'o', touchTargets(), c.o)} ’a dokunuyor mu?`;
    if (c.k === 'key') body = `${sel(arg, 'key', Object.entries(KEYS), c.key)} tuşuna basılı mı?`;
    if (c.k === 'mouse') body = 'fare tıklandı mı?';
    if (c.k === 'cmp') {
      const left = [...(cfg.vars || []).map((v) => ['var:' + v, v]), ['x', 'x konumu'], ['y', 'y konumu']];
      const lv = c.a.r === 'var' ? 'var:' + c.a.v : c.a.r;
      body = `${sel(arg, 'a', left, lv)} ${sel(arg, 'op', Object.entries(OPS), c.op)} <input class="in num" data-arg="${arg}" data-part="b" value="${esc(c.b)}" size="3">`;
    }
    return `<span class="cnd">${cfg.conds?.length === 1 ? '' : ksel}${body}</span>`;
  }

  function argHTML(b, k) {
    const [type] = BLOCKS[b.op].args[k];
    const v = b.args[k];
    switch (type) {
      case 'num': return numSlot(k, v, 'num');
      case 'text': return numSlot(k, v, 'txt');
      case 'cond': return condSlot(k, v);
      case 'key': return sel(k, '', Object.entries(KEYS), v);
      case 'msg': return sel(k, '', (cfg.msgs || ['mesaj1']).map((m) => [m, m]), v);
      case 'costume': { const sp = spDef(); return sel(k, '', COSTUMES[sp.costume].frames.map((_, i) => [i + 1, `${COSTUMES[sp.costume].name} ${i + 1}`]), v); }
      case 'backdrop': return sel(k, '', (cfg.backdrops || Object.keys(BACKDROPS)).map((x) => [x, BACKDROPS[x].name]), v);
      case 'sound': return sel(k, '', Object.entries(SOUNDS), v);
      case 'note': return sel(k, '', Object.entries(NOTES).map(([n, l]) => [n, `${l} (${n})`]), v);
      case 'color': return `<span class="sw" style="background:${v}"></span>${sel(k, '', Object.entries(COLORS), v)}`;
      case 'var': return sel(k, '', (cfg.vars || []).map((x) => [x, x]), v);
      default: return '';
    }
  }

  const label = (b) => BLOCKS[b.op].text.replace(/\{(\w+)\}/g, (_, k) => argHTML(b, k));

  function blockHTML(b, ro) {
    const def = BLOCKS[b.op];
    const k = color(b.op);
    const del = ro ? '' : '<button type="button" class="del" title="Sil" aria-label="Bloğu sil">✖</button>';
    const head = `<div class="sbh">${label(b)}${del}</div>`;
    const cls = `sb${def.kind === 'hat' ? ' hat' : ''}${def.cap ? ' cap' : ''}${slotsOf(b).length ? ' c' : ''}${def.cat === 'events' || def.cat === 'control' ? ' dk' : ''}`;
    if (!slotsOf(b).length) return `<div class="${cls}" data-id="${b.id}" style="--k:${k}">${head}</div>`;
    const body = (s) => `<div class="sbody" data-in="${b.id}:${s}">${listHTML(b[s], ro)}</div>`;
    return `<div class="${cls}" data-id="${b.id}" style="--k:${k}">${head}${body('body')}${def.kind === 'c2' ? `<div class="smid" data-in="${b.id}:body2">değilse</div>${body('body2')}` : ''}<div class="sfoot" data-after="${b.id}">${def.cap ? '' : ''}</div></div>`;
  }

  function listHTML(list, ro) {
    let h = '';
    for (let i = 0; i <= list.length; i++) {
      if (!ro && caret && caret.list === list && caret.i === i) h += '<span class="caret"></span>';
      if (i < list.length) h += blockHTML(list[i], ro);
    }
    return h;
  }

  // --- palet ---
  function drawPalette() {
    const groups = cats.map((c) => {
      const ops = allowed.filter((op) => BLOCKS[op].cat === c);
      return `<div class="pgroup" data-c="${c}"><h5 style="--k:${CATS[c].color}">${CATS[c].name}</h5>${ops.map((op) => {
        const b = mk([op], bid);
        if (BLOCKS[op].args?.c) b.args.c = null;
        if (BLOCKS[op].args?.v) b.args.v = (cfg.vars || [])[0];
        if (BLOCKS[op].args?.msg) b.args.msg = (cfg.msgs || ['mesaj1'])[0];
        if (BLOCKS[op].args?.b && BLOCKS[op].args.b[0] === 'backdrop') b.args.b = (cfg.backdrops || ['cayir'])[0];
        return `<div class="pitem" data-op="${op}">${blockHTML(b, true)}</div>`;
      }).join('')}</div>`;
    });
    pal.innerHTML = groups.join('');
    pal.querySelectorAll('input, select, button').forEach((x) => { x.tabIndex = -1; x.disabled = true; });
  }

  function drawTabs() {
    tabs.innerHTML = sprites().map((s) => `<button type="button" class="stab${s.name === cur ? ' cur' : ''}" data-name="${esc(s.name)}">${thumb(s.costume)}<span>${esc(s.name)}${s.locked ? ' 🔒' : ''}</span></button>`).join('') + (cfg.extraTabs || '');
  }

  function draw(newId) {
    drawTabs();
    const ss = scripts();
    const ro = locked();
    code.classList.toggle('ro', ro);
    code.innerHTML = (ss.length ? ss.map((s, i) => `<div class="script${s[0] && isHat(s[0]) ? '' : ' loose'}" data-s="${i}">${!s[0] || !isHat(s[0]) ? '<div class="loosewarn">⚠ Bu bloklar çalışmaz: başına sarı bir olay bloğu ekle.</div>' : ''}${listHTML(s, ro)}</div>`).join('')
      : `<div class="sempty">${ro ? 'Bu kuklanın kodu kilitli.' : 'Henüz kod yok. Soldan sarı bir <b>olay bloğu</b> (ör. 🏁 tıklandığında) ile başla! 👈'}</div>`)
      + (ro ? '<div class="lockmsg">🔒 Bu kuklanın kodu hazır, değiştirmene gerek yok.</div>' : '');
    if (newId) code.querySelector(`[data-id="${newId}"]`)?.classList.add('new');
    const c = code.querySelector('.caret');
    if (c) {
      const pr = code.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      if (cr.bottom > pr.bottom) code.scrollTop += cr.bottom - pr.bottom + 20;
      else if (cr.top < pr.top) code.scrollTop -= pr.top - cr.top + 20;
    }
  }

  // --- program ağacında arama ---
  function find(id, lists = scripts()) {
    for (const L of lists) {
      for (let i = 0; i < L.length; i++) {
        const b = L[i];
        if (b.id === id) return { list: L, i, b };
        for (const s of slotsOf(b)) { const r = find(id, [b[s]]); if (r) return r; }
      }
    }
    return null;
  }
  const slotList = (ref) => { const [id, s] = ref.split(':'); return find(+id).b[s]; };
  const isTop = (list) => scripts().includes(list);
  const changed = () => cfg.onChange?.();

  function add(op) {
    if (locked()) { toast('warn', 'Bu kuklanın kodu kilitli. Üstteki sekmelerden başka bir kukla seç.'); return; }
    const b = mk([op], bid);
    const def = BLOCKS[op];
    if (def.args?.c) b.args.c = cfg.condDefault ? JSON.parse(JSON.stringify(cfg.condDefault)) : null;
    if (def.args?.v) b.args.v = (cfg.vars || [])[0];
    if (def.args?.msg) b.args.msg = (cfg.msgs || ['mesaj1'])[0];
    if (def.args?.b && def.args.b[0] === 'backdrop') b.args.b = (cfg.backdrops || ['cayir'])[0];
    if (def.kind === 'hat') {
      if (caret && isTop(caret.list) && caret.i === 0 && !(caret.list[0] && isHat(caret.list[0]))) caret.list.unshift(b);
      else { const s = [b]; scripts().push(s); caret = { list: s, i: 1 }; }
      play('add');
      changed();
      draw(b.id);
      return;
    }
    if (!caretValid()) {
      const last = scripts()[scripts().length - 1];
      if (!last) {
        play('wrong');
        toast('warn', 'Önce sarı bir <b>olay bloğu</b> ekle (ör. <b>🏁 tıklandığında</b>). Diğer bloklar onun altına eklenir.');
        return;
      }
      caret = { list: last, i: last.length };
    }
    if (isTop(caret.list) && caret.i === 0 && caret.list[0] && isHat(caret.list[0])) caret.i = 1;
    caret.list.splice(caret.i, 0, b);
    caret = slotsOf(b).length ? { list: b.body, i: 0 } : { list: caret.list, i: caret.i + 1 };
    play('add');
    changed();
    draw(b.id);
  }

  // İmleç hâlâ bu kuklanın programında mı?
  function caretValid() {
    if (!caret) return false;
    const inside = (lists) => lists.some((L) => L === caret.list || L.some((b) => slotsOf(b).some((s) => inside([b[s]]))));
    return inside(scripts());
  }

  function remove(id) {
    const f = find(id);
    if (!f) return;
    if (isTop(f.list) && f.i === 0 && isHat(f.b)) {
      // Olay bloğu silinince bütün betik silinir
      scripts().splice(scripts().indexOf(f.list), 1);
      caret = null;
    } else {
      f.list.splice(f.i, 1);
      if (isTop(f.list) && !f.list.length) scripts().splice(scripts().indexOf(f.list), 1);
      caret = f.list.length || !isTop(f.list) ? { list: f.list, i: f.i } : null;
    }
    play('del');
    changed();
    draw();
  }

  // --- olaylar ---
  pal.addEventListener('click', (e) => {
    const it = e.target.closest('.pitem');
    if (it) add(it.dataset.op);
  });
  host.querySelector('.scats').addEventListener('click', (e) => {
    const c = e.target.closest('.scat');
    if (!c) return;
    const g = pal.querySelector(`.pgroup[data-c="${c.dataset.c}"]`);
    pal.scrollTop = g.offsetTop - pal.offsetTop;
  });
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('.stab');
    if (!t) return;
    cur = t.dataset.name;
    caret = null;
    const s = scripts();
    if (s.length) caret = { list: s[s.length - 1], i: s[s.length - 1].length };
    play('click');
    draw();
    cfg.onSprite?.(cur);
  });

  code.addEventListener('click', (e) => {
    if (locked() || dragged) { dragged = false; return; }
    const t = e.target;
    if (t.closest('input, select')) return;
    const del = t.closest('.del');
    if (del) return remove(+del.closest('.sb').dataset.id);
    const rpx = t.closest('.rpx');
    if (rpx) {
      const b = find(+rpx.closest('.sb').dataset.id).b;
      b.args[rpx.dataset.arg] = 0;
      changed();
      return draw();
    }
    const foot = t.closest('.sfoot');
    const slot = t.closest('.sbody, .smid');
    const sb = t.closest('.sb');
    if (foot) { const f = find(+foot.dataset.after); caret = { list: f.list, i: f.i + 1 }; }
    else if (slot && (!sb || !slot.contains(sb) || t === slot)) { const l = slotList(slot.dataset.in); caret = { list: l, i: l.length }; }
    else if (sb) {
      const f = find(+sb.dataset.id);
      if (slotsOf(f.b).length && t.closest('.sbh')) caret = { list: f.b.body, i: f.b.body.length };
      else caret = { list: f.list, i: f.i + 1 };
    } else {
      const s = scripts();
      caret = s.length ? { list: s[s.length - 1], i: s[s.length - 1].length } : null;
    }
    play('click');
    draw();
  });

  // Girdi değişiklikleri
  function onInput(e) {
    const t = e.target;
    if (!t.dataset.arg) return;
    const b = find(+t.closest('.sb').dataset.id)?.b;
    if (!b) return;
    const k = t.dataset.arg;
    const part = t.dataset.part;
    const type = BLOCKS[b.op].args[k][0];
    const asNum = (v) => (v.trim() !== '' && Number.isFinite(+v.replace(',', '.')) ? +v.replace(',', '.') : v);
    let redraw = false;
    if (type === 'cond') {
      if (part === 'kind') {
        const kind = t.value;
        b.args[k] = kind === 'touch' ? { k: 'touch', o: touchTargets()[0][0] } : kind === 'key' ? { k: 'key', key: 'space' } : kind === 'mouse' ? { k: 'mouse' }
          : kind === 'cmp' ? { k: 'cmp', a: (cfg.vars || []).length ? { r: 'var', v: cfg.vars[0] } : { r: 'x' }, op: '>', b: 0 } : null;
        redraw = true;
      } else if (part === 'a') b.args[k].a = t.value.startsWith('var:') ? { r: 'var', v: t.value.slice(4) } : { r: t.value };
      else if (part === 'b') b.args[k].b = asNum(t.value);
      else b.args[k][part] = t.value;
    } else if (part === 'rep') {
      const v = t.value;
      if (!v) return;
      b.args[k] = v === 'rand' ? { r: 'rand', a: 1, b: 10 } : v.startsWith('var:') ? { r: 'var', v: v.slice(4) } : { r: v };
      redraw = true;
    } else if (part === 'a' || part === 'b') b.args[k][part] = asNum(t.value);
    else if (type === 'num') b.args[k] = asNum(t.value);
    else if (type === 'costume') b.args[k] = +t.value;
    else if (type === 'note') b.args[k] = +t.value;
    else b.args[k] = t.value;
    if (type === 'color') t.previousElementSibling.style.background = t.value;
    if (t.tagName === 'INPUT') t.size = Math.max(t.classList.contains('txt') ? 4 : 2, t.value.length);
    changed();
    if (redraw) draw();
  }
  code.addEventListener('input', onInput);
  // Kutuya tıklayınca içindeki değer seçilsin: yeni sayı yazınca eskisi silinir
  code.addEventListener('focusin', (e) => {
    if (e.target.tagName !== 'INPUT') return;
    e.target.select();
    e.target.dataset.fresh = '1';
  });
  code.addEventListener('mouseup', (e) => {
    if (e.target.dataset?.fresh) { e.preventDefault(); e.target.select(); delete e.target.dataset.fresh; }
  });
  code.addEventListener('change', (e) => { if (e.target.tagName === 'SELECT') onInput(e); });

  // --- sürükle bırak ---
  let drag = null;
  let dragged = false;
  code.addEventListener('pointerdown', (e) => {
    if (locked() || e.button > 0 || e.target.closest('input, select, button')) return;
    const sb = e.target.closest('.sb');
    if (!sb || sb.classList.contains('hat')) return;
    drag = { el: sb, id: +sb.dataset.id, x0: e.clientX, y0: e.clientY, on: false };
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
      host.classList.add('dnd');
    }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX - drag.ox}px, ${e.clientY - drag.oy}px) rotate(2deg)`;
    const under = document.elementFromPoint(e.clientX, e.clientY);
    drag.to = null;
    let cont = under?.closest('.sbody');
    if (cont && drag.el.contains(cont)) cont = null;
    if (!cont) cont = under?.closest('.script');
    if (!cont || !code.contains(cont)) { drag.mark.remove(); return; }
    const list = cont.classList.contains('script') ? scripts()[+cont.dataset.s] : slotList(cont.dataset.in);
    const kids = [...cont.children].filter((k) => k.classList.contains('sb') && k !== drag.el);
    let i = kids.findIndex((k) => { const r = k.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    if (i < 0) i = kids.length;
    if (cont.classList.contains('script') && list[0] && isHat(list[0]) && i === 0) i = 1;
    cont.insertBefore(drag.mark, kids[i] || null);
    drag.to = { list, i };
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.on) return;
    dragged = true;
    setTimeout(() => { dragged = false; }, 0);
    d.ghost.remove();
    d.mark.remove();
    host.classList.remove('dnd');
    d.el.classList.remove('dragging');
    if (!d.to) return;
    const f = find(d.id);
    let i = d.to.i;
    f.list.splice(f.i, 1);
    if (isTop(f.list) && !f.list.length) scripts().splice(scripts().indexOf(f.list), 1);
    d.to.list.splice(Math.min(i, d.to.list.length), 0, f.b);
    caret = { list: d.to.list, i: d.to.list.indexOf(f.b) + 1 };
    play('add');
    changed();
    draw(f.b.id);
  };
  addEventListener('pointermove', onMove, { passive: false });
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onUp);

  // Çalışan blokları parlat
  function glow(threads) {
    code.querySelectorAll('.sb.run').forEach((b) => b.classList.remove('run'));
    for (const t of threads) {
      if (t.sp.name !== cur || t.done) continue;
      code.querySelector(`.sb[data-id="${t.cur}"]`)?.classList.add('run');
      code.querySelector(`.sb[data-id="${t.script[0].id}"]`)?.classList.add('run');
    }
  }

  drawPalette();
  const s0 = scripts();
  if (s0.length) caret = { list: s0[s0.length - 1], i: s0[s0.length - 1].length };
  draw();

  return {
    draw,
    glow,
    get sprite() { return cur; },
    select(name) { cur = name; caret = null; draw(); },
    destroy() {
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      document.querySelector('.ghost')?.remove();
    },
  };
}
