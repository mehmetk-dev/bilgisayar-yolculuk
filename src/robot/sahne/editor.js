// Scratch benzeri blok editörü: palet, kukla sekmeleri, betikler, girdiler ve sürükle-bırak
import { BLOCKS, CATS, KEYS, SOUNDS, NOTES, COLORS, REPORTERS, COND_KINDS, isHat, slotsOf, mk } from './blocks.js';
import { COSTUMES, BACKDROPS } from './costumes.js';
import { thumb } from './stage.js';
import { play, toast, esc } from '../robo.js';

let uid = 5e6;
export const bid = () => ++uid;

const OPS = { '<': '<', '=': '=', '>': '>' };
// Türkçe yönelme hâli: Kedi’ye, Raket’e, Top’a, Köpek’e, Fare’ye, kenara, duvara (rakamlar okunuşuna göre)
const RAKAM = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const INCE = ['kalp', 'saat', 'harf', 'hal', 'gol', 'rol', 'alkol']; // son ünlüsü kalın ama ince ek alan sözcükler
export function yonelme(ad) {
  if (ad === 'fare imleci') return 'fare imlecine';
  if (/böceği$/.test(ad)) return ad.slice(0, -1) + 'ine'; // Uğur böceği → Uğur böceğine
  const oku = ad.replace(/\d/g, (d) => ' ' + RAKAM[d]).toLocaleLowerCase('tr');
  const unluler = [...oku].filter((c) => 'aeıioöuü'.includes(c));
  const ince = 'eiöü'.includes(unluler[unluler.length - 1] || 'a') || INCE.includes(oku.split(' ').pop());
  const unluBitis = 'aeıioöuü'.includes(oku[oku.length - 1]);
  const ozel = /^\p{Lu}/u.test(ad) || /\d$/.test(ad); // özel isimde kesme işareti
  return ad + (ozel ? '’' : '') + (unluBitis ? 'y' : '') + (ince ? 'e' : 'a');
}
const color = (op) => (CATS[BLOCKS[op].cat] || { color: '#59c059' }).color;

export function createEditor(host, cfg) {
  const allowed = cfg.blocks;
  const cats = [...new Set(allowed.map((op) => BLOCKS[op].cat))];
  let cur = cfg.start && cfg.sprites().some((s) => s.name === cfg.start) ? cfg.start : cfg.sprites()[0].name;
  let caret = null; // { list, i }
  const progs = cfg.progs;

  host.innerHTML = `<div class="sed">
  <div class="spal"><div class="scats">${cats.map((c) => `<button type="button" class="scat" data-c="${c}" style="--k:${CATS[c].color}"><i></i>${CATS[c].name}</button>`).join('')}</div><div class="sblocks"></div></div>
  <div class="sscripts"><div class="stabs"></div><div class="stools"><button type="button" class="undo" disabled title="Son değişikliği geri al">↶ Geri al</button><select class="copyto" title="İmlecin olduğu betiği başka kuklaya kopyala"></select></div><div class="scode" tabindex="-1"></div><p class="ptip">👆 Bir bloğa tıklayınca kırmızı çizginin olduğu yere eklenir. ✋ Blokları sürükleyerek taşıyabilirsin.</p></div>
</div>`;
  const pal = host.querySelector('.sblocks');
  const tabs = host.querySelector('.stabs');
  const code = host.querySelector('.scode');
  const undoBtn = host.querySelector('.undo');
  const copySel = host.querySelector('.copyto');

  // --- geri alma: her değişiklikten önce programın kopyası saklanır ---
  const hist = [];
  function snap() {
    const s = JSON.stringify(progs);
    if (hist[hist.length - 1] === s) return;
    hist.push(s);
    if (hist.length > 50) hist.shift();
    undoBtn.disabled = false;
  }
  function undo() {
    const s = hist.pop();
    if (!s) return;
    const data = JSON.parse(s);
    for (const k of Object.keys(data)) {
      if (!progs[k]) { progs[k] = data[k]; continue; }
      progs[k].length = 0;
      progs[k].push(...data[k]);
    }
    const ss = scripts();
    caret = ss.length ? { list: ss[ss.length - 1], i: ss[ss.length - 1].length } : null;
    undoBtn.disabled = !hist.length;
    play('del');
    changed();
    draw();
  }
  undoBtn.onclick = undo;

  // --- betiği başka kuklaya kopyalama ---
  const holds = (list, target) => list === target || list.some((b) => slotsOf(b).some((s) => holds(b[s], target)));
  function fillCopy() {
    const others = sprites().filter((s) => s.name !== cur && !s.locked);
    copySel.hidden = !others.length || locked();
    copySel.innerHTML = '<option value="">⧉ Betiği kopyala…</option>' + others.map((s) => `<option value="${esc(s.name)}">→ ${esc(s.name)}</option>`).join('');
  }
  copySel.onchange = () => {
    const to = copySel.value;
    copySel.value = '';
    if (!to) return;
    const src = caretValid() && scripts().find((s) => holds(s, caret.list));
    if (!src) { toast('warn', 'Önce kopyalamak istediğin betikteki bir bloğa tıkla.'); return; }
    snap();
    const fresh = (list) => list.map((b) => { const c = { ...b, id: bid(), args: JSON.parse(JSON.stringify(b.args)) }; slotsOf(b).forEach((k) => { c[k] = fresh(b[k]); }); return c; });
    (progs[to] ||= []).push(fresh(src));
    play('add');
    changed();
    toast('ok', `Betik <b>${esc(to)}</b> kuklasına kopyalandı. Görmek için üstten ${esc(to)} sekmesine tıkla.`, 3500);
  };

  const sprites = () => cfg.sprites();
  const spDef = () => sprites().find((s) => s.name === cur) || sprites()[0];
  const scripts = () => (progs[cur] ||= []);
  const locked = () => !!spDef().locked;

  // --- girdilerin çizimi ---
  const opt = (v, label, sel) => `<option value="${esc(v)}"${String(sel) === String(v) ? ' selected' : ''}>${esc(label)}</option>`;
  // Her girdinin data-path değeri, bloğun args nesnesindeki yeridir: "n", "n.a", "c.b.a" gibi
  const sel = (path, options, val, cls = '') => `<select class="in ${cls}" data-path="${path}">${options.map(([v, l]) => opt(v, l, val)).join('')}</select>`;
  const OPN = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  function repMenu(path, depth) {
    if (!cfg.reporters?.length || depth > 2) return '';
    const o = [['', '▾']];
    for (const k of cfg.reporters) {
      if (depth > 1 && ['rand', 'op', 'join'].includes(k)) continue; // en içteki kutuda yeni iç içe blok açılmaz
      if (k === 'var') for (const v of cfg.vars || []) o.push(['var:' + v, v]);
      else o.push([k, REPORTERS[k].label]);
    }
    return sel(path, o, '', 'rep');
  }

  function numSlot(path, v, kind, depth = 0) {
    if (v && typeof v === 'object') {
      const R = REPORTERS[v.r];
      const k = (CATS[R.cat] || { color: '#59c059' }).color;
      let inner = esc(R.label);
      if (v.r === 'rand') inner = `rastgele ${numSlot(path + '.a', v.a, 'num', depth + 1)} ile ${numSlot(path + '.b', v.b, 'num', depth + 1)} arası`;
      if (v.r === 'join') inner = `birleştir ${numSlot(path + '.a', v.a, 'txt', depth + 1)} ${numSlot(path + '.b', v.b, 'txt', depth + 1)}`;
      if (v.r === 'op') inner = `${numSlot(path + '.a', v.a, 'num', depth + 1)} ${sel(path + '.o', Object.entries(OPN), v.o, 'opsel')} ${numSlot(path + '.b', v.b, 'num', depth + 1)}`;
      if (v.r === 'var') inner = (cfg.vars || []).length > 1 ? sel(path + '.v', cfg.vars.map((x) => [x, x]), v.v) : esc(v.v);
      return `<span class="rp" style="--k:${k}">${inner}<button type="button" class="rpx" data-path="${path}" title="Sayıya çevir">×</button></span>`;
    }
    return `<input class="in ${kind}" data-path="${path}" value="${esc(v)}" size="${Math.max(kind === 'txt' ? 4 : 2, String(v).length)}" inputmode="${kind === 'num' ? 'decimal' : 'text'}">${repMenu(path, depth)}`;
  }

  function touchTargets() {
    const t = [['kenar', yonelme('kenar')], ...sprites().filter((s) => s.name !== cur).map((s) => [s.name, yonelme(s.name)])];
    if ((cfg.backdrops || []).some((b) => BACKDROPS[b].walls)) t.push(['duvar', yonelme('duvar')]);
    t.push(['fare', yonelme('fare imleci')]);
    return t;
  }

  const cmpLeft = () => [...(cfg.vars || []).map((v) => ['var:' + v, v]), ['x', 'x konumu'], ['y', 'y konumu'], ...['answer', 'timer', 'mx', 'my'].filter((k) => cfg.reporters?.includes(k)).map((k) => [k, REPORTERS[k].label])];

  function condSlot(path, c) {
    const kinds = cfg.conds || Object.keys(COND_KINDS);
    const ksel = sel(path, [...(c ? [] : [['', 'koşul seç ▾']]), ...kinds.map((k) => [k, k === 'cmp' ? 'karşılaştır' : k === 'touch' ? 'dokunma' : k === 'key' ? 'tuş' : 'fare']) ], c ? c.k : '', 'kind');
    if (!c) return `<span class="cnd empty">${ksel}</span>`;
    let body = '';
    if (c.k === 'touch') body = `${sel(path + '.o', touchTargets(), c.o)} dokunuyor mu?`;
    if (c.k === 'key') body = `${sel(path + '.key', Object.entries(KEYS), c.key)} tuşuna basılı mı?`;
    if (c.k === 'mouse') body = 'fare tıklandı mı?';
    if (c.k === 'cmp') {
      const lv = c.a.r === 'var' ? 'var:' + c.a.v : c.a.r;
      body = `${sel(path + '.a', cmpLeft(), lv, 'cmpa')} ${sel(path + '.op', Object.entries(OPS), c.op)} ${numSlot(path + '.b', c.b, 'num', 0)}`;
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
      case 'key': return sel(k, Object.entries(KEYS), v);
      case 'msg': return sel(k, (cfg.msgs || ['mesaj1']).map((m) => [m, m]), v);
      case 'costume': { const sp = spDef(); return sel(k, COSTUMES[sp.costume].frames.map((_, i) => [i + 1, `${COSTUMES[sp.costume].name} ${i + 1}`]), v); }
      case 'backdrop': return sel(k, (cfg.backdrops || Object.keys(BACKDROPS)).map((x) => [x, BACKDROPS[x].name]), v);
      case 'sound': return sel(k, Object.entries(SOUNDS), v);
      case 'note': return sel(k, Object.entries(NOTES).map(([n, l]) => [n, `${l} (${n})`]), v);
      case 'color': return `<span class="sw" style="background:${v}"></span>${sel(k, Object.entries(COLORS), v)}`;
      case 'var': return sel(k, (cfg.vars || []).map((x) => [x, x]), v);
      case 'target': return sel(k, [['fare', 'fare imleci'], ...sprites().filter((s) => s.name !== cur).map((s) => [s.name, s.name])], v);
      case 'clonesrc': return sel(k, [['kendim', 'kendim'], ...sprites().filter((s) => s.name !== cur).map((s) => [s.name, s.name])], v);
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
    fillCopy();
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
    snap();
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
    snap();
    if (isTop(f.list) && f.i === 0 && isHat(f.b)) {
      // Olay bloğu silinince bütün betik silinir
      scripts().splice(scripts().indexOf(f.list), 1);
      caret = null;
      if (f.list.length > 1) toast('warn', 'Betiğin tamamı silindi. Yanlışlıkla mı oldu? <b>↶ Geri al</b> düğmesine bas.', 4000);
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
      snap();
      const b = find(+rpx.closest('.sb').dataset.id).b;
      const keys = rpx.dataset.path.split('.');
      const last = keys.pop();
      keys.reduce((o, k) => o[k], b.args)[last] = 0;
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
  const newRep = (v) => (v === 'rand' ? { r: 'rand', a: 1, b: 10 } : v === 'op' ? { r: 'op', o: '+', a: 1, b: 1 } : v === 'join' ? { r: 'join', a: 'Merhaba ', b: 'dünya' } : v.startsWith('var:') ? { r: 'var', v: v.slice(4) } : { r: v });
  function newCond(kind) {
    if (kind === 'touch') return { k: 'touch', o: touchTargets()[0][0] };
    if (kind === 'key') return { k: 'key', key: 'space' };
    if (kind === 'mouse') return { k: 'mouse' };
    if (kind === 'cmp') return { k: 'cmp', a: (cfg.vars || []).length ? { r: 'var', v: cfg.vars[0] } : { r: 'x' }, op: '>', b: 0 };
    return null;
  }

  function onInput(e) {
    const t = e.target;
    const path = t.dataset.path;
    if (!path) return;
    const b = find(+t.closest('.sb').dataset.id)?.b;
    if (!b) return;
    const keys = path.split('.');
    const last = keys.pop();
    const parent = keys.reduce((o, k) => o[k], b.args);
    const type = BLOCKS[b.op].args[keys[0] ?? last][0];
    const asNum = (v) => (v.trim() !== '' && Number.isFinite(+v.replace(',', '.')) ? +v.replace(',', '.') : v);
    let redraw = false;
    if (t.classList.contains('kind')) { parent[last] = newCond(t.value); redraw = true; }
    else if (t.classList.contains('rep')) { if (!t.value) return; parent[last] = newRep(t.value); redraw = true; }
    else if (t.classList.contains('cmpa')) parent[last] = newRep(t.value);
    else if (t.tagName === 'INPUT') parent[last] = (type === 'text' && !keys.length) || t.classList.contains('txt') ? t.value : asNum(t.value);
    else if ((type === 'costume' || type === 'note') && !keys.length) parent[last] = +t.value;
    else parent[last] = t.value;
    if (type === 'color') t.previousElementSibling.style.background = t.value;
    if (t.tagName === 'INPUT') t.size = Math.max(t.classList.contains('txt') ? 4 : 2, t.value.length);
    changed();
    if (redraw) draw();
  }
  code.addEventListener('input', (e) => { if (e.target.tagName === 'INPUT') onInput(e); });
  // Kutuya tıklayınca içindeki değer seçilsin: yeni sayı yazınca eskisi silinir
  code.addEventListener('focusin', (e) => {
    if (e.target.dataset.path) snap();
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
    snap();
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
