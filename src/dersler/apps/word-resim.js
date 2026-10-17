// Kelime işlemcide resimler: seçme (tutamaçlar), köşeden orantılı / kenardan bozarak boyutlandırma, Metni Kaydır
// (Metinle aynı hizada, Kare, Sıkı, Metnin arkasında, Metnin önünde), sürükleyerek yerleştirme ve kırpma.
// Resim sayfada <span class="wd-pic" data-wrap data-crop data-a data-s><img></span> olarak durur; ölçüler yüzde ile tutulur.
import { esc } from './util.js';

export const WRAPS = [
  ['inline', 'Metinle aynı hizada', '▤'], ['kare', 'Kare', '◧'], ['siki', 'Sıkı', '◨'], ['arkada', 'Metnin arkasında', '▨'], ['onde', 'Metnin önünde', '▣'],
];
export const wrapName = (k) => WRAPS.find((w) => w[0] === k)?.[1] || k;

export const picHtml = (src, name) => `<span class="wd-pic" contenteditable="false" data-wrap="inline" data-crop="0,0,0,0" data-a="1.5" data-s="1" style="width:60%"><img src="${src}" alt="${esc(name)}" draggable="false"></span>`;

const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const crop = (p) => (p.dataset.crop || '0,0,0,0').split(',').map(Number); // üst, sağ, alt, sol (0–1)

// Kırpma ve oran bilgisinden çerçevenin ve içindeki resmin ölçüleri
export function layoutPic(p) {
  const img = p.querySelector('img');
  if (!img) return;
  const [t, r, b, l] = crop(p);
  const a = num(p.dataset.a, 1.5), s = num(p.dataset.s, 1);
  const fw = 1 - l - r, fh = 1 - t - b;
  p.style.aspectRatio = String((a * fw) / fh * s);
  Object.assign(img.style, { width: `${100 / fw}%`, height: `${100 / fh}%`, left: `${(-l / fw) * 100}%`, top: `${(-t / fh) * 100}%` });
  const w = p.dataset.wrap || 'inline';
  p.classList.toggle('float', w === 'kare' || w === 'siki');
  p.style.float = w === 'kare' || w === 'siki' ? (p.dataset.side === 'left' ? 'left' : 'right') : '';
  const abs = w === 'arkada' || w === 'onde';
  p.style.position = abs ? 'absolute' : '';
  p.style.left = abs ? num(p.dataset.x) + 'px' : '';
  p.style.top = abs ? num(p.dataset.y) + 'px' : '';
  p.style.zIndex = w === 'arkada' ? '-1' : w === 'onde' ? '3' : '';
}

export function pictureTools({ page, body, emit, changed }) {
  let sel = null, mode = null; // mode: 'crop'
  const box = document.createElement('div');
  box.className = 'wd-sel';
  box.contentEditable = 'false';
  box.hidden = true;
  box.innerHTML = `${['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((h) => `<i data-h="${h}"></i>`).join('')}
    <button type="button" class="wd-lo" title="Düzen Seçenekleri: resim yazının neresinde dursun?">⊞</button>
    <div class="wd-lopop" hidden><b>Metni kaydır</b>${WRAPS.map(([k, l, ic]) => `<button type="button" data-wrap="${k}"><span>${ic}</span>${l}</button>`).join('')}</div>`;
  page.after(box);
  const tab = body.querySelector('.wd-tabpic');

  const pr = () => page.getBoundingClientRect();
  function place() {
    if (!sel || !page.contains(sel)) { box.hidden = true; return; }
    const r = sel.getBoundingClientRect(), o = box.offsetParent?.getBoundingClientRect() || pr();
    Object.assign(box.style, { left: r.left - o.left + (box.offsetParent?.scrollLeft || 0) + 'px', top: r.top - o.top + (box.offsetParent?.scrollTop || 0) + 'px', width: r.width + 'px', height: r.height + 'px' });
    box.hidden = false;
    box.classList.toggle('crop', mode === 'crop');
  }
  function select(p) {
    if (mode === 'crop' && p !== sel) endCrop();
    sel = p;
    page.querySelectorAll('.wd-pic.on').forEach((x) => x.classList.toggle('on', x === p));
    p?.classList.add('on');
    box.querySelector('.wd-lopop').hidden = true;
    place();
    if (tab) {
      tab.hidden = !p;
      if (!p && tab.classList.contains('on')) body.querySelector('.wd-tabs [data-tab="home"]').click();
      syncRib();
    }
    if (p) emit('doc-img-select', { wrap: p.dataset.wrap });
  }
  function syncRib() { body.querySelectorAll('.wd-rib[data-tab="pic"] [data-pwrap]').forEach((b) => b.classList.toggle('on', b.dataset.pwrap === sel?.dataset.wrap)); body.querySelector('.wd-pcrop')?.classList.toggle('on', mode === 'crop'); }

  function setWrap(k, via) {
    if (!sel) return;
    const p = sel;
    if ((k === 'arkada' || k === 'onde') && p.dataset.wrap !== 'arkada' && p.dataset.wrap !== 'onde') {
      const r = p.getBoundingClientRect(), o = pr();
      p.dataset.x = Math.round(r.left - o.left); p.dataset.y = Math.round(r.top - o.top);
      page.prepend(p); // sayfanın başına alınır; konumu x, y ile verilir
    }
    if ((k === 'kare' || k === 'siki') && !p.dataset.side) p.dataset.side = 'right';
    if (k === 'inline' && (p.dataset.wrap === 'arkada' || p.dataset.wrap === 'onde')) {
      // Yeniden satırın içine: bulunduğu yerdeki paragrafın başına konur
      const blk = blockAt(p.getBoundingClientRect().left + 5, p.getBoundingClientRect().top + 5);
      (blk || page.querySelector('p') || page).prepend(p);
    }
    p.dataset.wrap = k;
    layoutPic(p);
    box.querySelector('.wd-lopop').hidden = true;
    changed();
    place();
    syncRib();
    emit('doc-img-wrap', { wrap: k, via });
  }

  // Sayfada (x, y) noktasındaki paragraf (resmin kendisi hariç)
  function blockAt(x, y) {
    const hide = sel?.style.visibility;
    if (sel) sel.style.visibility = 'hidden';
    box.style.visibility = 'hidden';
    let el = document.elementFromPoint(x, y);
    if (sel) sel.style.visibility = hide || '';
    box.style.visibility = '';
    for (; el && el !== page; el = el.parentElement) if (el.parentElement === page && /^(P|H1|H2|H3|DIV|BLOCKQUOTE|UL|OL)$/.test(el.tagName)) return el;
    return null;
  }

  // ---- Sürükleme: resmi taşımak ----
  function drag(e, p) {
    const sx = e.clientX, sy = e.clientY, w = p.dataset.wrap;
    const ox = num(p.dataset.x), oy = num(p.dataset.y);
    let moved = false, ghost = null;
    const mv = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      if (w === 'arkada' || w === 'onde') { p.dataset.x = Math.round(ox + dx); p.dataset.y = Math.max(0, Math.round(oy + dy)); layoutPic(p); place(); return; }
      if (!ghost) { ghost = p.cloneNode(true); ghost.className = 'wd-pic wd-ghost'; ghost.style.width = p.getBoundingClientRect().width + 'px'; document.body.append(ghost); }
      Object.assign(ghost.style, { left: ev.clientX - 20 + 'px', top: ev.clientY - 20 + 'px' });
    };
    const up = (ev) => {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      ghost?.remove();
      if (!moved) return;
      if (w === 'inline') {
        // Satırın içindeki resim yazı gibi taşınır: bırakılan yerdeki iki harfin arasına girer
        p.style.visibility = 'hidden';
        const r = document.caretRangeFromPoint?.(ev.clientX, ev.clientY);
        p.style.visibility = '';
        if (r && page.contains(r.startContainer) && !p.contains(r.startContainer)) r.insertNode(p);
      } else if (w === 'kare' || w === 'siki') {
        const blk = blockAt(ev.clientX, ev.clientY);
        if (blk) blk.prepend(p);
        const o = pr();
        p.dataset.side = ev.clientX < o.left + o.width / 2 ? 'left' : 'right';
      }
      layoutPic(p);
      changed();
      requestAnimationFrame(place);
      const blk = [...page.children].indexOf(p.closest('.wd-page > *'));
      emit('doc-img-move', { wrap: w, side: p.dataset.side, block: blk, x: num(p.dataset.x), y: num(p.dataset.y) });
    };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  // ---- Tutamaçlar: boyutlandırma ve kırpma ----
  function handle(e, h) {
    e.preventDefault();
    e.stopPropagation();
    const p = sel, pw = page.clientWidth - parseFloat(getComputedStyle(page).paddingLeft) - parseFloat(getComputedStyle(page).paddingRight);
    const r0 = p.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
    const w0 = r0.width, h0 = r0.height, s0 = num(p.dataset.s, 1), c0 = crop(p);
    const corner = h.length === 2;
    const mv = (ev) => {
      const dx = (ev.clientX - sx) * (h.includes('w') ? -1 : 1), dy = (ev.clientY - sy) * (h.includes('n') ? -1 : 1);
      if (mode === 'crop') {
        // Kırpma: kenar içeri çekildikçe o yandan kesilir (görünen kısım küçülür)
        const [t, r, b, l] = c0, fw = 1 - l - r, fh = 1 - t - b;
        const fx = (dx / w0) * fw, fy = (dy / h0) * fh;
        const c = [t, r, b, l];
        if (h.includes('n')) c[0] = Math.min(0.8, Math.max(0, t - fy));
        if (h.includes('s')) c[2] = Math.min(0.8, Math.max(0, b - fy));
        if (h.includes('w')) c[3] = Math.min(0.8, Math.max(0, l - fx));
        if (h.includes('e')) c[1] = Math.min(0.8, Math.max(0, r - fx));
        if (c[0] + c[2] > 0.85 || c[1] + c[3] > 0.85) return;
        p.dataset.crop = c.map((x) => x.toFixed(3)).join(',');
        const nfw = 1 - c[1] - c[3];
        p.style.width = Math.max(5, ((w0 * nfw) / fw / pw) * 100).toFixed(1) + '%';
        layoutPic(p);
        place();
        return;
      }
      let w = w0, s = s0;
      if (corner) w = Math.max(30, w0 + dx); // köşe: en-boy oranı korunur
      else if (h === 'e' || h === 'w') { w = Math.max(30, w0 + dx); s = s0 * (w / w0); } // yan: yükseklik aynı kalır, resim basıklaşır
      else s = s0 * (h0 / Math.max(20, h0 + dy)); // üst/alt: genişlik aynı, resim uzar
      p.style.width = Math.min(100, (w / pw) * 100).toFixed(1) + '%';
      p.dataset.s = s.toFixed(3);
      layoutPic(p);
      place();
    };
    const up = () => {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      changed();
      if (mode === 'crop') return;
      emit('doc-img-resize', { corner, width: parseFloat(p.style.width), distorted: Math.abs(num(p.dataset.s, 1) - 1) > 0.04 });
    };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  function startCrop() { if (!sel) return; mode = 'crop'; place(); syncRib(); emit('doc-img-cropmode', { on: true }); }
  function endCrop() {
    if (mode !== 'crop') return;
    mode = null;
    place();
    syncRib();
    const [t, r, b, l] = sel ? crop(sel) : [0, 0, 0, 0];
    emit('doc-img-crop', { t, r, b, l, any: t + r + b + l > 0.03 });
  }
  function reset() {
    if (!sel) return;
    sel.dataset.crop = '0,0,0,0'; sel.dataset.s = '1'; sel.style.width = '60%';
    layoutPic(sel); changed(); place();
    emit('doc-img-reset');
  }

  // ---- Olaylar ----
  page.addEventListener('pointerdown', (e) => {
    const p = e.target.closest('.wd-pic');
    if (!p || !page.contains(p)) { if (sel) { if (mode === 'crop') endCrop(); select(null); } return; }
    e.preventDefault();
    if (p !== sel) select(p);
    if (mode !== 'crop' && e.button === 0) drag(e, p);
  });
  box.addEventListener('pointerdown', (e) => {
    const h = e.target.closest('[data-h]')?.dataset.h;
    if (h) { handle(e, h); return; }
    if (e.target === box && sel && mode !== 'crop') { e.preventDefault(); drag(e, sel); }
  });
  box.addEventListener('click', (e) => {
    if (e.target.closest('.wd-lo')) { const pp = box.querySelector('.wd-lopop'); pp.hidden = !pp.hidden; if (!pp.hidden) emit('doc-img-layouts'); return; }
    const k = e.target.closest('[data-wrap]')?.dataset.wrap;
    if (k) setWrap(k, 'layout');
  });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('.wd-rib[data-tab="pic"] button');
    if (!b) return;
    if (b.dataset.pwrap) setWrap(b.dataset.pwrap, 'ribbon');
    else if (b.classList.contains('wd-pcrop')) { if (mode === 'crop') endCrop(); else startCrop(); }
    else if (b.classList.contains('wd-preset')) reset();
  });
  page.addEventListener('keydown', (e) => {
    if (!sel) return;
    if (mode === 'crop' && (e.key === 'Enter' || e.key === 'Escape')) { e.preventDefault(); endCrop(); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); const p = sel; select(null); p.remove(); changed(); emit('doc-img-delete'); }
  }, true);
  page.addEventListener('input', () => requestAnimationFrame(place));
  new ResizeObserver(() => place()).observe(page);

  return {
    select, place, setWrap,
    refresh() { page.querySelectorAll('.wd-pic').forEach((p) => { p.classList.remove('on'); layoutPic(p); }); select(null); },
    // Yeni eklenen resmin gerçek en-boy oranını öğren
    adopt(p) {
      const img = p.querySelector('img');
      const fix = () => { if (img.naturalWidth) { p.dataset.a = (img.naturalWidth / img.naturalHeight).toFixed(4); layoutPic(p); place(); } };
      layoutPic(p);
      if (img.complete) fix(); else img.addEventListener('load', fix, { once: true });
      select(p);
    },
    get selected() { return sel; },
    info: () => [...page.querySelectorAll('.wd-pic')].map((p) => ({ wrap: p.dataset.wrap, side: p.dataset.side || '', width: parseFloat(p.style.width), crop: crop(p), distorted: Math.abs(num(p.dataset.s, 1) - 1) > 0.04, block: [...page.children].indexOf(p.closest('.wd-page > *')) })),
  };
}
