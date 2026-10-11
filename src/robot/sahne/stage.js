// Sahnenin ekrana çizilmesi: dekor, kuklalar, konuşma balonları, kalem, değişken göstergeleri
import { COSTUMES, BACKDROPS } from './costumes.js';
import { W, H } from './runtime.js';

const KEYMAP = { ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down', ' ': 'space', a: 'a', s: 's', d: 'd', w: 'w', A: 'a', S: 's', D: 'd', W: 'w' };

function transform(sp) {
  const s = sp.size / 100;
  if (sp.rot === 'all') return `scale(${s}) rotate(${sp.dir - 90}deg)`;
  if (sp.rot === 'lr' && sp.dir < 0) return `scale(${-s}, ${s})`;
  return `scale(${s})`;
}

export function createStage(host, opt = {}) {
  host.innerHTML = `<div class="stg"><div class="stg-world">
    <div class="stg-bd"></div>
    <canvas class="stg-pen" width="960" height="720"></canvas>
    <div class="stg-stamps"></div>
    <div class="stg-sprites"></div>
    <div class="stg-vars"></div>
  </div></div>`;
  const box = host.querySelector('.stg');
  const world = host.querySelector('.stg-world');
  const bdEl = host.querySelector('.stg-bd');
  const pen = host.querySelector('.stg-pen').getContext('2d');
  const stamps = host.querySelector('.stg-stamps');
  const layer = host.querySelector('.stg-sprites');
  const varsEl = host.querySelector('.stg-vars');
  let w = null;
  let els = new Map();
  let bdNow = null;
  let k = 1;

  const fit = () => {
    k = box.clientWidth / (W * 2);
    world.style.transform = `scale(${k})`;
    box.style.height = H * 2 * k + 'px';
  };
  const ro = new ResizeObserver(fit);
  ro.observe(box);

  function attach(world2) {
    w = world2;
    layer.innerHTML = '';
    stamps.innerHTML = '';
    pen.clearRect(0, 0, 960, 720);
    els = new Map();
    bdNow = null;
    for (const sp of w.sprites) {
      const d = document.createElement('div');
      d.className = 'spr';
      d.dataset.name = sp.name;
      d.innerHTML = '<div class="spr-img"></div>';
      const bub = document.createElement('div');
      bub.className = 'bub';
      layer.appendChild(d);
      layer.appendChild(bub);
      els.set(sp, { d, img: d.firstChild, bub, frame: -1, costume: null, say: undefined });
    }
    render();
  }

  function drawPen() {
    for (const op of w.penOps) {
      if (op.clear) { pen.clearRect(0, 0, 960, 720); stamps.innerHTML = ''; continue; }
      if (op.stamp) {
        const s = op.stamp;
        const d = document.createElement('div');
        d.className = 'spr stamp';
        d.innerHTML = `<div class="spr-img">${COSTUMES[s.costume].frames[s.frame]}</div>`;
        Object.assign(d.style, { width: s.w + 'px', height: s.h + 'px', left: W + s.x - s.w / 2 + 'px', top: H - s.y - s.h / 2 + 'px', transform: transform(s), filter: s.effect ? `hue-rotate(${s.effect * 1.8}deg)` : '' });
        stamps.appendChild(d);
        continue;
      }
      pen.strokeStyle = op.color;
      pen.lineWidth = op.size * 2;
      pen.lineCap = 'round';
      pen.beginPath();
      pen.moveTo((op.x1 + W) * 2, (H - op.y1) * 2);
      pen.lineTo((op.x2 + W) * 2, (H - op.y2) * 2);
      pen.stroke();
    }
    w.penOps.length = 0;
  }

  function render() {
    if (!w) return;
    if (bdNow !== w.backdrop) { bdNow = w.backdrop; bdEl.innerHTML = BACKDROPS[w.backdrop]?.svg || ''; }
    if (w.penOps.length) drawPen();
    const active = new Set(w.threads.filter((t) => !t.done).map((t) => t.sp));
    for (const [sp, e] of els) {
      const c = COSTUMES[sp.costume];
      if (e.frame !== sp.frame || e.costume !== sp.costume) { e.frame = sp.frame; e.costume = sp.costume; e.img.innerHTML = c.frames[sp.frame]; }
      const st = e.d.style;
      st.width = sp.w + 'px';
      st.height = sp.h + 'px';
      st.left = W + sp.x - sp.w / 2 + 'px';
      st.top = H - sp.y - sp.h / 2 + 'px';
      st.transform = transform(sp);
      st.filter = sp.effect ? `hue-rotate(${sp.effect * 1.8}deg) saturate(1.3)` : '';
      st.display = sp.visible ? '' : 'none';
      e.d.classList.toggle('busy', active.has(sp));
      // konuşma balonu
      const txt = sp.visible && sp.say ? sp.say.text : '';
      if (e.say !== txt + (sp.say?.think ? '1' : '')) {
        e.say = txt + (sp.say?.think ? '1' : '');
        e.bub.textContent = txt;
        e.bub.className = 'bub' + (txt ? ' on' : '') + (sp.say?.think ? ' think' : '');
      }
      if (txt) {
        const top = H - sp.y - sp.h * sp.size / 200;
        const left = W + sp.x + sp.w * sp.size / 400;
        e.bub.style.left = Math.min(left, W * 2 - 150) + 'px';
        e.bub.style.top = Math.max(top, 40) + 'px';
      }
    }
    const shown = opt.showVars ? Object.keys(w.vars).filter((v) => opt.showVars.includes(v)) : Object.keys(w.vars);
    const vh = shown.map((v) => `<div class="mon"><b>${v}</b><span>${typeof w.vars[v] === 'number' ? Math.round(w.vars[v] * 100) / 100 : w.vars[v]}</span></div>`).join('');
    if (varsEl.innerHTML !== vh) varsEl.innerHTML = vh;
  }

  // --- fare ve klavye ---
  const toStage = (e) => {
    const r = world.getBoundingClientRect();
    return { x: Math.round((e.clientX - r.left) / k - W), y: Math.round(H - (e.clientY - r.top) / k) };
  };
  world.addEventListener('pointermove', (e) => {
    if (!w) return;
    const p = toStage(e);
    w.mouse.x = Math.max(-W, Math.min(W, p.x));
    w.mouse.y = Math.max(-H, Math.min(H, p.y));
    opt.onMouse?.(w.mouse);
  });
  world.addEventListener('pointerdown', (e) => {
    if (!w) return;
    const p = toStage(e);
    w.mouse.x = p.x;
    w.mouse.y = p.y;
    w.mouse.down = true;
    // En üstteki (son çizilen) görünür kukla tıklanır
    const hit = [...layer.querySelectorAll('.spr')].reverse().find((d) => d.style.display !== 'none' && d.contains(e.target));
    if (hit) w.clickSprite(hit.dataset.name);
  });
  const up = () => { if (w) w.mouse.down = false; };
  addEventListener('pointerup', up);

  const typing = (e) => /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
  const kd = (e) => {
    if (!w || typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k2 = KEYMAP[e.key];
    if (!k2) return;
    if (k2 === 'space' || k2.length > 1) e.preventDefault();
    w.keyDown(k2);
  };
  const ku = (e) => { const k2 = KEYMAP[e.key]; if (k2 && w) w.keyUp(k2); };
  addEventListener('keydown', kd);
  addEventListener('keyup', ku);

  fit();
  return {
    attach,
    render,
    destroy() {
      ro.disconnect();
      removeEventListener('pointerup', up);
      removeEventListener('keydown', kd);
      removeEventListener('keyup', ku);
    },
  };
}

// Küçük kostüm resmi (kukla sekmeleri ve kütüphane için)
export const thumb = (costume, frame = 0) => `<span class="thumb">${COSTUMES[costume].frames[frame]}</span>`;
