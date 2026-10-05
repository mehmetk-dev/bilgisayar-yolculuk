// Canvas ile üretilen dokular: baskı devre izleri, yonga yazıları, etiketler, ızgaralar.
// Tüm markalar uydurmadır; gerçek logo kullanılmaz.
import * as THREE from 'three';

const cache = new Map();
export let maxAniso = 4;
export function setAniso(a) { maxAniso = a; }

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeTex(key, w, h, draw, { srgb = true, wrap = false } = {}) {
  if (key && cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  if (wrap) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.userData.shared = true;
  if (key) cache.set(key, t);
  return t;
}

export function clearTexCache() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}

const FONT = '"DejaVu Sans", "Segoe UI", Arial, sans-serif';
const MONO = '"DejaVu Sans Mono", Consolas, monospace';

function txt(g, s, x, y, size, color, { align = 'left', bold = false, mono = false, rot = 0, base = 'middle' } = {}) {
  g.save();
  g.translate(x, y);
  if (rot) g.rotate(rot);
  g.font = `${bold ? 'bold ' : ''}${size}px ${mono ? MONO : FONT}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = base;
  g.fillText(s, 0, 0);
  g.restore();
}

// ---------------------------------------------------------------- PCB
// w,h: cm. labels: {x,y,t,s,rot,c}. pads: {x,y,w,h} (bakır/altın pedler). holes: {x,y,r}
export function pcbTex(key, { w, h, ppc = 48, base = '#1f5a32', trace = '#2f7a46', silk = '#e8eadc', seed = 7, density = 1, labels = [], pads = [], holes = [], gold = [], keepout = [], fingers = null }) {
  return makeTex(key, Math.round(w * ppc), Math.round(h * ppc), (g, W, H) => {
    const r = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    // hafif doku
    for (let i = 0; i < W * H / 900; i++) {
      g.fillStyle = `rgba(255,255,255,${r() * 0.025})`;
      g.fillRect(r() * W, r() * H, 2, 2);
    }
    const inKeep = (x, y) => keepout.some(k => x > k.x * ppc && x < (k.x + k.w) * ppc && y > k.y * ppc && y < (k.y + k.h) * ppc);
    g.lineCap = 'round'; g.lineJoin = 'round';
    // paralel veri yolları
    const buses = Math.round(14 * density * (W * H) / (1400 * 1100));
    for (let b = 0; b < buses; b++) {
      let x = r() * W, y = r() * H;
      const n = 4 + Math.floor(r() * 10);
      const horiz = r() < 0.5;
      const len1 = (0.15 + r() * 0.35) * (horiz ? W : H);
      const len2 = (0.05 + r() * 0.2) * (horiz ? H : W) * (r() < 0.5 ? -1 : 1);
      g.strokeStyle = trace; g.lineWidth = Math.max(1, ppc * 0.025);
      for (let i = 0; i < n; i++) {
        const o = i * ppc * 0.07;
        g.beginPath();
        if (horiz) {
          g.moveTo(x, y + o); g.lineTo(x + len1, y + o);
          g.lineTo(x + len1 + Math.abs(len2) * 0.4, y + o + len2 * 0.4);
          g.lineTo(x + len1 + Math.abs(len2) * 0.4, y + o + len2);
        } else {
          g.moveTo(x + o, y); g.lineTo(x + o, y + len1);
          g.lineTo(x + o + len2 * 0.4, y + len1 + Math.abs(len2) * 0.4);
          g.lineTo(x + o + len2, y + len1 + Math.abs(len2) * 0.4);
        }
        g.stroke();
      }
    }
    // tekil izler
    const singles = Math.round(420 * density * (W * H) / (1400 * 1100));
    for (let i = 0; i < singles; i++) {
      let x = r() * W, y = r() * H;
      if (inKeep(x, y)) continue;
      g.strokeStyle = trace; g.lineWidth = Math.max(1, ppc * (0.02 + r() * 0.03));
      g.beginPath(); g.moveTo(x, y);
      const segs = 1 + Math.floor(r() * 3);
      for (let s = 0; s < segs; s++) {
        const d = (0.2 + r() * 2) * ppc;
        const dir = Math.floor(r() * 8);
        const ang = dir * Math.PI / 4;
        x += Math.cos(ang) * d; y += Math.sin(ang) * d;
        g.lineTo(x, y);
      }
      g.stroke();
      // via
      g.fillStyle = '#c9b27a';
      g.beginPath(); g.arc(x, y, ppc * 0.035, 0, 7); g.fill();
      g.fillStyle = '#222'; g.beginPath(); g.arc(x, y, ppc * 0.015, 0, 7); g.fill();
    }
    // SMD küçük parçalar (direnç/kondansatör)
    const smd = Math.round(260 * density * (W * H) / (1400 * 1100));
    for (let i = 0; i < smd; i++) {
      const x = r() * W, y = r() * H;
      if (inKeep(x, y)) continue;
      const v = r() < 0.5;
      const a = ppc * 0.16, b = ppc * 0.08;
      const cw = v ? b : a, ch = v ? a : b;
      g.fillStyle = '#d6d6d0';
      g.fillRect(x - cw / 2, y - ch / 2, cw, ch);
      g.fillStyle = r() < 0.5 ? '#2a2a2a' : '#a07850';
      g.fillRect(x - cw / 2 + (v ? 0 : cw * 0.22), y - ch / 2 + (v ? ch * 0.22 : 0), v ? cw : cw * 0.56, v ? ch * 0.56 : ch);
    }
    for (const p of pads) {
      g.fillStyle = p.c || '#c8a85a';
      g.fillRect(p.x * ppc, p.y * ppc, p.w * ppc, p.h * ppc);
    }
    for (const p of gold) {
      // altın kontak sırası: {x,y,w,h,n}
      const pw = (p.w / p.n);
      for (let i = 0; i < p.n; i++) {
        g.fillStyle = '#d9b45a';
        g.fillRect((p.x + i * pw + pw * 0.12) * ppc, p.y * ppc, pw * 0.76 * ppc, p.h * ppc);
      }
    }
    for (const hl of holes) {
      g.fillStyle = '#c8b070';
      g.beginPath(); g.arc(hl.x * ppc, hl.y * ppc, (hl.r * 1.8) * ppc, 0, 7); g.fill();
      g.fillStyle = '#d8d8d8';
      g.beginPath(); g.arc(hl.x * ppc, hl.y * ppc, (hl.r * 1.3) * ppc, 0, 7); g.fill();
      g.fillStyle = '#111';
      g.beginPath(); g.arc(hl.x * ppc, hl.y * ppc, hl.r * ppc, 0, 7); g.fill();
    }
    if (fingers) {
      // kenar konnektörü altın parmaklar
      const { y, h: fh, n, from = 0, to = w, gaps = [] } = fingers;
      const pitch = (to - from) / n;
      for (let i = 0; i < n; i++) {
        const cx = from + (i + 0.5) * pitch;
        if (gaps.some(gp => Math.abs(cx - gp) < pitch * 1.6)) continue;
        g.fillStyle = '#e0bd62';
        g.fillRect((cx - pitch * 0.36) * ppc, y * ppc, pitch * 0.72 * ppc, fh * ppc);
      }
    }
    for (const l of labels) {
      txt(g, l.t, l.x * ppc, l.y * ppc, (l.s || 0.3) * ppc, l.c || silk, { bold: l.b, rot: l.rot || 0, align: l.a || 'left', mono: l.m });
    }
    // silkscreen dikdörtgenleri
  });
}

// ---------------------------------------------------------------- Yonga üstü
export function chipTex(lines, { bg = '#191919', fg = '#bdbdbd', w = 256, h = 256, dot = true, logo = null } = {}) {
  const key = 'chip|' + lines.join('/') + bg + fg + w + h + logo;
  return makeTex(key, w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    const r = rng(lines.join('').length * 31 + 5);
    for (let i = 0; i < w * h / 40; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.03})`; g.fillRect(r() * w, r() * h, 1, 1); }
    const n = lines.length;
    const s = Math.min(h / (n + 1.6), w / 9);
    lines.forEach((l, i) => txt(g, l, w / 2, h / 2 + (i - (n - 1) / 2) * s * 1.15, s * (i === 0 ? 1 : 0.8), fg, { align: 'center', bold: i === 0 }));
    if (dot) { g.fillStyle = 'rgba(0,0,0,0.5)'; g.beginPath(); g.arc(w * 0.1, h * 0.12, Math.min(w, h) * 0.04, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.12)'; g.stroke(); }
  });
}

// ---------------------------------------------------------------- Etiket
export function stickerTex(key, { w = 512, h = 384, bg = '#f2f2ee', fg = '#1a1a1a', title, sub, lines = [], accent = '#1d5fa8', barcode = true, warn = false, table = null }) {
  return makeTex(key, w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = accent; g.fillRect(0, 0, w, h * 0.2);
    txt(g, title, w * 0.05, h * 0.1, h * 0.11, '#fff', { bold: true });
    if (sub) txt(g, sub, w * 0.95, h * 0.1, h * 0.065, '#fff', { align: 'right' });
    let y = h * 0.28;
    for (const l of lines) { txt(g, l, w * 0.05, y, h * 0.06, fg, { mono: true }); y += h * 0.085; }
    if (table) {
      const cols = table[0].length, rows = table.length;
      const tx = w * 0.05, tw = w * 0.9, th = h * 0.36, ty = h * 0.58 - (lines.length ? 0 : h * 0.3);
      g.strokeStyle = fg; g.lineWidth = 1.5;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cw = tw / cols, ch = th / rows;
        g.strokeRect(tx + c * cw, ty + r * ch, cw, ch);
        txt(g, table[r][c], tx + c * cw + cw / 2, ty + r * ch + ch / 2, ch * 0.42, fg, { align: 'center', bold: r === 0 });
      }
    }
    if (barcode) {
      const r = rng(title.length * 13 + w);
      let x = w * 0.6; const by = h * 0.25, bh = h * 0.16;
      while (x < w * 0.95) { const bw = 1 + Math.floor(r() * 4); g.fillStyle = fg; g.fillRect(x, by, bw, bh); x += bw + 1 + Math.floor(r() * 3); }
    }
    if (warn) {
      g.fillStyle = '#f5c400';
      g.beginPath(); g.moveTo(w * 0.86, h * 0.96); g.lineTo(w * 0.93, h * 0.82); g.lineTo(w * 1.0, h * 0.96); g.closePath(); g.fill();
      txt(g, '!', w * 0.93, h * 0.905, h * 0.1, '#000', { align: 'center', bold: true });
    }
  });
}

// ---------------------------------------------------------------- Yazı plakası (ön panel, I/O etiketleri)
export function textTex(key, t, { w = 256, h = 64, bg = 'rgba(0,0,0,0)', fg = '#333', size = 0.6, bold = true, align = 'center' } = {}) {
  return makeTex('tt|' + key + t + fg + bg + w + h, w, h, (g) => {
    if (bg !== 'rgba(0,0,0,0)') { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    txt(g, t, align === 'center' ? w / 2 : 4, h / 2, h * size, fg, { align, bold });
  });
}

// ---------------------------------------------------------------- Delik deseni (alpha): beyaz = dolu, siyah = delik
export function holeAlpha(key, { w = 512, h = 512, pitch = 16, r = 5, hex = true, square = false, margin = 0, slots = false }) {
  return makeTex('ha|' + key, w, h, (g) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#000';
    let row = 0;
    for (let y = margin + pitch / 2; y < h - margin; y += hex ? pitch * 0.866 : pitch, row++) {
      for (let x = margin + pitch / 2 + (hex && row % 2 ? pitch / 2 : 0); x < w - margin; x += pitch) {
        g.beginPath();
        if (slots) g.rect(x - r * 0.4, y - r * 1.6, r * 0.8, r * 3.2);
        else if (square) g.rect(x - r, y - r, r * 2, r * 2);
        else if (hex) { for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } }
        else g.arc(x, y, r, 0, 7);
        g.fill();
      }
    }
  }, { srgb: false, wrap: true });
}

// ---------------------------------------------------------------- Fırçalanmış metal pürüzlülük
export function brushedTex(key = 'brushed', { w = 256, h = 256, base = 150, amp = 40, circular = false } = {}) {
  return makeTex('br|' + key, w, h, (g) => {
    const r = rng(99);
    g.fillStyle = `rgb(${base},${base},${base})`; g.fillRect(0, 0, w, h);
    if (circular) {
      for (let i = 0; i < 500; i++) {
        const v = base + (r() - 0.5) * amp * 2; g.strokeStyle = `rgba(${v},${v},${v},0.6)`;
        g.beginPath(); g.arc(w / 2, h / 2, r() * w * 0.7, 0, 7); g.stroke();
      }
    } else {
      for (let y = 0; y < h; y++) { const v = base + (r() - 0.5) * amp * 2; g.fillStyle = `rgba(${v},${v},${v},0.7)`; g.fillRect(0, y, w, 1); }
    }
  }, { srgb: false, wrap: true });
}

// ---------------------------------------------------------------- Yassı kablo (IDE / disket)
export function ribbonTex(key, { wires = 40, base = '#a9a9a6', stripe = '#c0201c', ridge = true }) {
  return makeTex('rb|' + key, 256, 16, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const pw = w / wires;
    if (ridge) for (let i = 0; i < wires; i++) {
      const gr = g.createLinearGradient(i * pw, 0, (i + 1) * pw, 0);
      gr.addColorStop(0, 'rgba(0,0,0,0.25)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.18)'); gr.addColorStop(1, 'rgba(0,0,0,0.25)');
      g.fillStyle = gr; g.fillRect(i * pw, 0, pw, h);
    }
    g.fillStyle = stripe; g.fillRect(0, 0, pw * 1.2, h);
  }, { wrap: true });
}

// Örgülü kablo kılıfı
export function sleeveTex(key, { a = '#151515', b = '#3a3a3a' }) {
  return makeTex('sl|' + key, 64, 64, (g, w, h) => {
    g.fillStyle = a; g.fillRect(0, 0, w, h);
    g.strokeStyle = b; g.lineWidth = 3;
    for (let i = -w; i < w * 2; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); }
  }, { wrap: true });
}

// Disk etiketi (CD / DVD üst yüzü)
export function discTex(key, { bg = '#e9eef2', title = 'SÜRÜCÜLER', sub = 'Kurulum CD', ring = '#3a6ea5' }) {
  return makeTex('disc|' + key, 512, 512, (g, w, h) => {
    g.fillStyle = bg; g.beginPath(); g.arc(256, 256, 256, 0, 7); g.fill();
    const gr = g.createRadialGradient(256, 256, 60, 256, 256, 256);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, ring + '55');
    g.fillStyle = gr; g.beginPath(); g.arc(256, 256, 256, 0, 7); g.fill();
    g.strokeStyle = ring; g.lineWidth = 10; g.beginPath(); g.arc(256, 256, 236, 0, 7); g.stroke();
    txt(g, title, 256, 120, 44, '#1d2b3a', { align: 'center', bold: true });
    txt(g, sub, 256, 390, 30, '#1d2b3a', { align: 'center' });
    g.fillStyle = '#c9ccd0'; g.beginPath(); g.arc(256, 256, 75, 0, 7); g.fill();
  });
}

// Disket etiketi
export function floppyLabelTex() {
  return makeTex('floppylabel', 256, 192, (g, w, h) => {
    g.fillStyle = '#f7f4ea'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#d13a2f'; g.fillRect(0, 0, w, 26);
    txt(g, '1.44 MB   HD', 10, 13, 18, '#fff', { bold: true });
    g.strokeStyle = '#9db6d6'; g.lineWidth = 2;
    for (let y = 52; y < h; y += 28) { g.beginPath(); g.moveTo(8, y); g.lineTo(w - 8, y); g.stroke(); }
    txt(g, 'ÖDEV - 5/B', 14, 66, 26, '#1f3fae', { bold: true });
    txt(g, 'yedek', 14, 122, 22, '#1f3fae');
  });
}
