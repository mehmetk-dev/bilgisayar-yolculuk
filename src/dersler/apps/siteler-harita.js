// 13. hafta sitesi (uydurma): Haritalar. Yer arama, yakınlaştırma, uydu görünümü, konumum (izin ister),
// yürüyerek / toplu taşımayla / arabayla yol tarifi ve sarı insanı sokağa sürükleyerek Sokak Görünümü.
import { esc } from './util.js';

export const HARITA_HOST = 'www.haritalar.com.tr';

// Harita 1000 × 600 birimlik bir düzlemdir; 1 birim yaklaşık 2,6 metre
const M_PER = 2.6;
const B = (e, n, c, o = {}) => ({ e, n, c, ...o });
const APT = [B('🏢', 'Apartman', '#c9b79c'), B('🏢', 'Apartman', '#b0bec5'), B('🏬', 'İş hanı', '#d7ccc8'), B('🏠', 'Ev', '#ffccbc'), B('🌳', 'Park', '#a5d6a7'), B('🏢', 'Apartman', '#e0c3a3')];
const SHOP = [B('🥖', 'Fırın', '#ffe0b2'), B('🛒', 'Market', '#c8e6c9'), B('✏', 'Kırtasiye', '#bbdefb'), B('☕', 'Kahvehane', '#d7ccc8'), B('🏦', 'Banka', '#cfd8dc'), B('📮', 'PTT', '#fff59d')];
const pick = (arr, k) => arr[k % arr.length];

export const PLACES = {
  ev: { name: 'Eviniz', emoji: '🏠', x: 200, y: 387, addr: 'Çiçek Mah. Lale Sokak No: 5', keys: ['ev', 'lale', 'konum'], street: 'lale', slot: 1, side: 'r' },
  hastane: { name: 'Çınar Devlet Hastanesi', emoji: '🏥', x: 770, y: 160, addr: 'Hastane Caddesi No: 1', info: 'Acil servis 7/24 · Poliklinik 08:00–17:00', tel: '0 (212) 555 01 01', keys: ['hastane', 'devlet', 'acil'], via: 700, bus: { line: '12', from: 'Lale Sokak durağı', to: 'Hastane durağı', stops: 5, ride: 11 }, street: 'hastane', slot: 4, side: 'l' },
  eczane: { name: 'Şifa Eczanesi (nöbetçi)', emoji: '💊', x: 430, y: 309, addr: 'Pazar Caddesi No: 14', info: 'Bu gece nöbetçi · 08:30–08:30', tel: '0 (212) 555 02 02', keys: ['eczane', 'şifa', 'nöbetçi', 'ilaç'], via: 430, street: 'pazar', slot: 3, side: 'l' },
  kultur: { name: 'Kültür Merkezi', emoji: '🎭', x: 515, y: 160, addr: 'Hastane Caddesi No: 9', info: 'Kurslar 09:00–21:00', tel: '0 (212) 555 03 03', keys: ['kültür', 'kurs', 'belediye'], via: 430, bus: { line: '12', from: 'Lale Sokak durağı', to: 'Kültür Merkezi durağı', stops: 3, ride: 7 }, street: 'hastane', slot: 1, side: 'l' },
  kizim: { name: 'Gül Apartmanı (kızınızın evi)', emoji: '🏘', x: 600, y: 470, addr: 'Menekşe Sokak No: 8', info: 'Kızınız Elif burada oturuyor', keys: ['gül', 'menekşe', 'kız', 'elif'], via: 430, street: 'menekse', slot: 2, side: 'l' },
};

// Sokaklar: a → b yönünde eşit aralıklı noktalar (slot); her noktada solda ve sağda bir bina
const STREETS = [
  { id: 'ataturk', name: 'Atatürk Caddesi', a: [60, 300], b: [940, 300], n: 11, kind: 'cad', set: SHOP },
  { id: 'hastane', name: 'Hastane Caddesi', a: [430, 160], b: [940, 160], n: 7, kind: 'cad', set: APT },
  { id: 'lale', name: 'Lale Sokak', a: [200, 300], b: [200, 560], n: 4, kind: 'sk', set: APT },
  { id: 'pazar', name: 'Pazar Caddesi', a: [430, 60], b: [430, 560], n: 7, kind: 'cad', set: SHOP },
  { id: 'cinar', name: 'Çınar Bulvarı', a: [700, 60], b: [700, 560], n: 7, kind: 'cad', set: APT },
  { id: 'menekse', name: 'Menekşe Sokak', a: [430, 470], b: [940, 470], n: 7, kind: 'sk', set: APT },
];
const PLACE_BLD = {
  hastane: B('🏥', 'ÇINAR DEVLET HASTANESİ', '#e3f2fd', { door: '🚑 ACİL · Ana giriş' }),
  eczane: B('💊', 'ŞİFA ECZANESİ · Nöbetçi', '#e8f5e9', { door: 'Gece zili ↓' }),
  kultur: B('🎭', 'KÜLTÜR MERKEZİ', '#fff3e0', { door: 'Kurs kayıt' }),
  kizim: B('🏘', 'GÜL APARTMANI · No: 8', '#fce4ec', { door: 'Zil paneli' }),
  ev: B('🏠', 'Lale Sk. No: 5 · Eviniz', '#ffccbc', { door: 'Kapı' }),
};
for (const s of STREETS) {
  s.slots = Array.from({ length: s.n }, (_, i) => ({ l: pick(s.set, i * 3 + s.n), r: pick(s.set, i * 5 + 2) }));
  s.pt = (i) => [s.a[0] + ((s.b[0] - s.a[0]) * i) / (s.n - 1), s.a[1] + ((s.b[1] - s.a[1]) * i) / (s.n - 1)];
  s.horiz = s.a[1] === s.b[1];
}
for (const [id, p] of Object.entries(PLACES)) {
  const s = STREETS.find((x) => x.id === p.street);
  s.slots[p.slot][p.side] = { ...PLACE_BLD[id], place: id };
}
STREETS.find((x) => x.id === 'hastane').slots[5].l = B('🅿', 'Hastane otoparkı', '#cfd8dc');

const findPlace = (q) => {
  const t = String(q || '').toLocaleLowerCase('tr');
  if (!t.trim()) return null;
  const words = t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return Object.entries(PLACES).find(([, p]) => p.name.toLocaleLowerCase('tr') === t.trim())?.[0]
    || Object.entries(PLACES).find(([, p]) => p.keys.some((k) => words.some((w) => w.startsWith(k))))?.[0] || null;
};

// Evden bir yere giden yol: Lale Sokak → Atatürk Caddesi → hedefin bulunduğu dik cadde → hedef
function routeTo(id) {
  const e = PLACES.ev, d = PLACES[id];
  const raw = [[e.x, e.y], [e.x, 300], [d.via, 300], [d.via, d.y], [d.x, d.y]];
  const pts = raw.filter((p, i) => !i || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
  const len = pts.slice(1).reduce((n, p, i) => n + Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]), 0);
  const m = Math.round((len * M_PER) / 10) * 10;
  return { pts, m, walk: Math.round(m / 75), car: Math.max(3, Math.round(m / 400) + 2), bus: d.bus ? 3 + d.bus.ride + 2 : null };
}
const km = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1).replace('.', ',')} km` : `${m} m`);
const MODES = [['walk', '🚶', 'Yürüyerek'], ['bus', '🚌', 'Toplu taşıma'], ['car', '🚗', 'Arabayla']];
const DIRS = ['Kuzey', 'Doğu', 'Güney', 'Batı'];
const ZOOMS = [1, 1.4, 2, 2.8];

function mapSvg(st) {
  const z = ZOOMS[st.zoom || 0], sat = st.layer === 'sat';
  const k = 1 / Math.sqrt(z); // yazılar ve işaretler yakınlaşınca fazla büyümesin
  const focus = st.dir?.ok ? PLACES[st.dir.to] : st.place ? PLACES[st.place] : null;
  const cx = focus ? focus.x : 500, cy = focus ? focus.y : 300;
  const w = 1000 / z, h = 600 / z;
  const vx = Math.max(0, Math.min(1000 - w, cx - w / 2)), vy = Math.max(0, Math.min(600 - h, cy - h / 2));
  // Bina adaları: sokakların arasındaki kutular
  const xs = [60, 200, 430, 700, 940], ys = [60, 160, 300, 470, 560];
  let blocks = '';
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const park = (i === 0 && j === 0) || (i === 3 && j === 3);
    const x = xs[i] + 14, y = ys[j] + 14, bw = xs[i + 1] - xs[i] - 28, bh = ys[j + 1] - ys[j] - 28;
    if (bw < 10 || bh < 10) continue;
    if (sat) {
      blocks += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${park ? '#4e6b3a' : '#7b7266'}"/>`;
      if (!park) for (let k = 0; k < 6; k++) blocks += `<rect x="${x + 6 + ((k * 37) % Math.max(10, bw - 40))}" y="${y + 6 + ((k * 23) % Math.max(10, bh - 30))}" width="30" height="22" fill="${['#9e8f7e', '#b5a48f', '#6d655b'][k % 3]}"/>`;
    } else blocks += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="${park ? '#cfe8c4' : '#ece8df'}"/>`;
  }
  const line = (s, sw, col) => `<line x1="${s.a[0]}" y1="${s.a[1]}" x2="${s.b[0]}" y2="${s.b[1]}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const streets = STREETS.map((s) => (sat ? line(s, s.kind === 'cad' ? 12 : 8, '#9a9a9a') : line(s, s.kind === 'cad' ? 20 : 14, '#d6cfc2') + line(s, s.kind === 'cad' ? 16 : 10, '#ffffff'))).join('');
  const label = (s) => {
    const [x, y] = s.pt(s.n > 4 ? 1.5 : 2.3);
    return `<text x="${x}" y="${y}" class="hr-sl" font-size="${13 * k}" ${s.horiz ? '' : `transform="rotate(90 ${x} ${y})"`} dy="${-14 * k}">${esc(s.name)}</text>`;
  };
  const hits = STREETS.map((s) => `<line class="hr-hit" data-street="${s.id}" x1="${s.a[0]}" y1="${s.a[1]}" x2="${s.b[0]}" y2="${s.b[1]}" stroke="transparent" stroke-width="34"/>`).join('');
  const blue = STREETS.map((s) => line(s, 6, '#1e88e5')).join('');
  let route = '';
  if (st.dir?.ok) {
    const r = routeTo(st.dir.to);
    const pts = r.pts.map((p) => p.join(',')).join(' ');
    const col = st.dir.mode === 'bus' ? '#2e7d32' : '#1a73e8';
    route = `<polyline points="${pts}" fill="none" stroke="#0005" stroke-width="12" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="8" stroke-linejoin="round" ${st.dir.mode === 'walk' ? 'stroke-dasharray="2 12" stroke-linecap="round"' : ''}/>`;
    if (st.dir.mode === 'bus') route += `<text x="${r.pts[1][0] + 8}" y="${r.pts[1][1] - 10}" class="hr-bus">🚏</text>`;
  }
  const marks = Object.entries(PLACES).filter(([id]) => id !== 'ev' || st.loc).map(([id, p]) => {
    if (id === 'ev') return `<g transform="translate(${p.x} ${p.y}) scale(${k})"><circle r="16" fill="#1a73e833"/><circle r="7" fill="#1a73e8" stroke="#fff" stroke-width="3"/></g>`;
    const on = st.place === id || st.dir?.to === id;
    return `<g class="hr-mk${on ? ' on' : ''}" data-act="place" data-v="${id}" transform="translate(${p.x} ${p.y}) scale(${k})"><circle cx="0" cy="-22" r="${on ? 19 : 15}" fill="${on ? '#d93025' : '#fff'}" stroke="${on ? '#a50e0e' : '#888'}" stroke-width="2"/><text x="0" y="-15" class="hr-me">${p.emoji}</text>${z >= 2 || on ? `<text x="0" y="16" class="hr-pl">${esc(p.name)}</text>` : ''}</g>`;
  }).join('');
  return `<svg class="hr-svg${st.pegArm ? ' arm' : ''}" viewBox="${vx} ${vy} ${w} ${h}" preserveAspectRatio="xMidYMid slice">
    <rect x="0" y="0" width="1000" height="600" fill="${sat ? '#5d6b4b' : '#f5f3ee'}"/>${blocks}${streets}<g class="hr-blue">${blue}</g>${route}${STREETS.map(label).join('')}${marks}${hits}</svg>`;
}

// Sokak Görünümü: önde yol, iki yanda binalar; sağa/sola dönünce binanın önü tam görünür
function svHtml(st) {
  const s = STREETS.find((x) => x.id === st.sv.street);
  const { i, h } = st.sv;
  const sl = s.slots[i];
  const abs = (s.horiz ? [1, 2, 3, 0] : [2, 3, 0, 1])[h];
  const bld = (b, cls) => `<div class="sv-b ${cls}" style="--bc:${b.c}"><span class="sv-be">${b.e}</span><b>${esc(b.n)}</b>${b.door ? `<i class="sv-door">${esc(b.door)}</i>` : '<i class="sv-door plain"></i>'}</div>`;
  let view;
  if (h === 1 || h === 3) {
    const b = h === 1 ? sl.r : sl.l;
    view = `<div class="sv-face">${bld(b, 'big')}<div class="sv-walk"></div></div>`;
  } else {
    const fwd = h === 0 ? 1 : -1, far = s.slots[i + fwd];
    const L = h === 0 ? sl.l : sl.r, R = h === 0 ? sl.r : sl.l;
    view = `<div class="sv-road"></div>${far ? `<div class="sv-far">${bld(h === 0 ? far.l : far.r, 'small')}${bld(h === 0 ? far.r : far.l, 'small')}</div>` : '<div class="sv-far end">Yolun sonu</div>'}
      <div class="sv-side l">${bld(L, 'side')}</div><div class="sv-side r">${bld(R, 'side')}</div>`;
  }
  const ahead = h === 0 ? i < s.n - 1 : h === 2 ? i > 0 : false;
  return `<div class="sv" data-h="${h}"><div class="sv-sky"></div>${view}
    <div class="sv-top"><button type="button" class="sv-exit" data-act="sv-exit">⬅ Haritaya dön</button><span class="sv-name">📍 ${esc(s.name)}</span><span class="sv-comp">🧭 Yön: <b>${DIRS[abs]}</b></span></div>
    <div class="sv-ctl"><button type="button" data-act="sv" data-v="l" title="Sola dön">↶</button><button type="button" data-act="sv" data-v="f" title="İlerle" ${ahead ? '' : 'disabled'}>⬆</button><button type="button" data-act="sv" data-v="r" title="Sağa dön">↷</button></div>
    <div class="sv-hint">${h === 1 || h === 3 ? 'Yola dönmek için ↶ ya da ↷' : 'İlerlemek için ⬆ · Binalara bakmak için ↶ ↷'}</div></div>`;
}

function side(st) {
  if (st.dirOpen) {
    const d = st.dir || {};
    let res = '';
    if (d.err) res = `<div class="hr-err">⚠ ${d.err}</div>`;
    else if (d.ok) {
      const r = routeTo(d.to), p = PLACES[d.to];
      if (d.mode === 'bus' && !p.bus) res = `<div class="hr-err">🚌 Bu kısa yol için otobüs yok. Yürüyerek <b>${r.walk} dk</b> (${km(r.m)}).</div>`;
      else {
        const min = r[d.mode];
        const steps = d.mode === 'bus'
          ? [`🚶 3 dk yürüyün: <b>${esc(p.bus.from)}</b>`, `🚌 <b>${p.bus.line} numaralı otobüs</b> · ${p.bus.stops} durak (${p.bus.ride} dk)`, `🛑 <b>${esc(p.bus.to)}</b>'nda inin`, `🚶 2 dk yürüyün: ${esc(p.name)}`]
          : [`Lale Sokak'tan çıkıp <b>Atatürk Caddesi</b>'ne sağa dönün`, ...(d.to !== 'eczane' ? [`<b>${d.to === 'hastane' ? 'Çınar Bulvarı' : 'Pazar Caddesi'}</b>'na sola dönün`] : ['Pazar Caddesi köşesinde durun']), ...(['hastane', 'kultur', 'kizim'].includes(d.to) ? [`<b>${d.to === 'kizim' ? 'Menekşe Sokak' : 'Hastane Caddesi'}</b>'na dönün`] : []), `🏁 ${esc(p.name)} ${p.side === 'l' ? 'solunuzda' : 'sağınızda'}`];
        res = `<div class="hr-res"><div class="hr-big">${MODES.find((x) => x[0] === d.mode)[1]} <b>${min} dk</b> <small>${km(r.m)}</small></div><ol>${steps.map((x) => `<li>${x}</li>`).join('')}</ol></div>`;
      }
    }
    return `<div class="hr-dir" data-form><div class="hr-dh"><b>Yol tarifi</b><button type="button" class="hr-x" data-act="dirclose" title="Kapat">✕</button></div>
      <div class="hr-modes">${MODES.map(([k, ic, n]) => `<button type="button" class="${(d.mode || 'walk') === k ? 'on' : ''}" data-act="mode" data-v="${k}" title="${n}">${ic}<small>${n}</small></button>`).join('')}</div>
      <label>🟢 Nereden<input name="from" value="${esc(d.from || '')}" placeholder="Başlangıç noktası (ör. Lale Sokak 5)" autocomplete="off"></label>
      <button type="button" class="hr-myloc" data-act="myloc">📍 Konumunuz</button>
      <label>📍 Nereye<input name="to" value="${esc(d.toText || '')}" placeholder="Hedef (ör. hastane)" autocomplete="off"></label>
      <button type="button" class="hr-go" data-act="route">Yol tarifi al</button>${res}</div>`;
  }
  if (st.place) {
    const p = PLACES[st.place];
    return `<div class="hr-card"><div class="hr-photo">${p.emoji}</div><h2>${esc(p.name)}</h2><p>📌 ${esc(p.addr)}</p>${p.info ? `<p>🕘 ${esc(p.info)}</p>` : ''}${p.tel ? `<p>📞 ${esc(p.tel)}</p>` : ''}
      <div class="hr-cbtn"><button type="button" class="hr-go" data-act="dirto" data-v="${st.place}">➜ Yol tarifi</button><button type="button" data-act="svplace" data-v="${st.place}">🧍 Sokak Görünümü</button></div></div>`;
  }
  if (st.miss) return `<div class="hr-card"><p>“${esc(st.miss)}” için sonuç bulunamadı.</p><p class="hr-tip">Yerin adını ya da sokağını yazın: ör. <b>hastane</b>, <b>eczane</b>, <b>Menekşe Sokak</b>.</p></div>`;
  return `<div class="hr-card"><p class="hr-tip">🔍 Yukarıdaki kutuya bir yer yazın (hastane, eczane…) ya da haritadaki simgelere tıklayın.</p><p class="hr-tip">🧍 Sağ alttaki <b>sarı insanı</b> bir sokağın üzerine sürükleyip bırakırsanız, o sokağı oradaymış gibi gezersiniz.</p></div>`;
}

const HARITA = {
  name: 'Haritalar', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.zoom ||= 0;
    const main = st.sv ? svHtml(st) : `${mapSvg(st)}
      <div class="hr-zoom"><button type="button" data-act="zoom" data-v="1" title="Yakınlaştır">＋</button><button type="button" data-act="zoom" data-v="-1" title="Uzaklaştır">－</button></div>
      <button type="button" class="hr-layer" data-act="layer">${st.layer === 'sat' ? '🗺 Harita' : '🛰 Uydu'}</button>
      <div class="hr-peg${st.pegArm ? ' on' : ''}" title="Sokak Görünümü: sarı insanı bir sokağın üzerine sürükleyin">🧍</div>
      ${st.pegArm ? '<div class="hr-armnote">Mavi çizgili bir sokağa bırakın ya da tıklayın · Vazgeçmek için Esc</div>' : ''}`;
    return { title: 'Haritalar', html: `<div class="wp hr"><header class="hr-head"><span class="hr-logo">🗺 Haritalar</span>
      <form class="hr-search" data-act="search"><input name="q" value="${esc(st.q || '')}" placeholder="Haritalarda arayın" autocomplete="off"><button>🔍</button></form>
      <button type="button" class="hr-dbtn" data-act="diropen" title="Yol tarifi">➜ Yol tarifi</button></header>
      <div class="hr-body"><aside class="hr-side">${side(st)}</aside><div class="hr-map">${main}</div></div></div>` };
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    const val = el?.dataset?.v;
    if (st.dirOpen && st.dir) { if ('from' in v) st.dir.from = v.from; if ('to' in v) st.dir.toText = v.to; }
    if (a === 'search') {
      st.q = v.q; const id = findPlace(v.q);
      st.place = id; st.miss = id ? null : v.q; st.dirOpen = false; st.sv = null;
      if (id && st.zoom < 1) st.zoom = 1;
      ctx.emit('map-search', { q: v.q, place: id });
    } else if (a === 'place') { st.place = val; st.miss = null; st.dirOpen = false; ctx.emit('map-place', { place: val }); }
    else if (a === 'zoom') { st.zoom = Math.max(0, Math.min(ZOOMS.length - 1, st.zoom + +val)); ctx.emit('map-zoom', { zoom: st.zoom, max: st.zoom === ZOOMS.length - 1 }); }
    else if (a === 'layer') { st.layer = st.layer === 'sat' ? 'map' : 'sat'; ctx.emit('map-layer', { layer: st.layer }); }
    else if (a === 'diropen' || a === 'dirto') {
      st.dirOpen = true;
      st.dir = { mode: 'walk', ...(st.dir || {}), ok: false, err: null };
      if (a === 'dirto') { st.dir.to = val; st.dir.toText = PLACES[val].name; }
      ctx.emit('map-diropen', { to: st.dir.to || null });
    } else if (a === 'dirclose') { st.dirOpen = false; st.dir = null; }
    else if (a === 'mode') { st.dir.mode = val; ctx.emit('map-mode', { mode: val }); }
    else if (a === 'myloc') {
      const done = (ok) => {
        if (ok) { st.dir.from = 'Konumunuz'; st.loc = true; } else st.dir.err = 'Konum izni verilmedi. Başlangıç noktasını elle yazın: ör. Lale Sokak 5';
        ctx.emit('map-myloc', { ok }); ctx.refresh();
      };
      const perm = ctx.perm('location');
      if (perm === 'allow') done(true);
      else if (perm === 'block') done(false);
      else ctx.askPerm(['location'], (r) => done(r === 'allow'));
      return;
    } else if (a === 'route') {
      const from = findPlace(st.dir.from), to = findPlace(st.dir.toText) || st.dir.to;
      st.dir.err = null; st.dir.ok = false;
      if (from !== 'ev') st.dir.err = st.dir.from ? `“${esc(st.dir.from)}” bulunamadı. Evinizden yola çıkmak için <b>Lale Sokak 5</b> yazın ya da 📍 Konumunuz'a basın.` : 'Önce “Nereden” kutusunu doldurun.';
      else if (!to || to === 'ev') st.dir.err = 'Nereye gideceğinizi yazın (ör. hastane).';
      else { st.dir.to = to; st.dir.toText = PLACES[to].name; st.dir.ok = true; st.loc = true; st.zoom = 0; }
      if (st.dir.ok) { const r = routeTo(to), p = PLACES[to]; ctx.emit('map-route', { to, mode: st.dir.mode, min: st.dir.mode === 'bus' ? (p.bus ? r.bus : null) : r[st.dir.mode], m: r.m, bus: p.bus?.line || null }); }
    } else if (a === 'svplace') {
      const p = PLACES[val];
      st.sv = { street: p.street, i: Math.max(0, p.slot - 1), h: 0 };
      ctx.emit('sv-open', { street: p.street, via: 'card' });
    } else if (a === 'sv-exit') { st.sv = null; ctx.emit('sv-exit'); }
    else if (a === 'sv') {
      const s = STREETS.find((x) => x.id === st.sv.street);
      if (val === 'l') st.sv.h = (st.sv.h + 3) % 4;
      if (val === 'r') st.sv.h = (st.sv.h + 1) % 4;
      if (val === 'f') st.sv.i = Math.max(0, Math.min(s.n - 1, st.sv.i + (st.sv.h === 0 ? 1 : st.sv.h === 2 ? -1 : 0)));
      const sl = s.slots[st.sv.i], face = st.sv.h === 1 ? sl.r : st.sv.h === 3 ? sl.l : null;
      ctx.emit('sv-move', { street: s.id, i: st.sv.i, h: st.sv.h, how: val, facing: face?.place || null });
    }
    ctx.refresh();
  },
  // Sarı insan: sürükleyip bir sokağa bırakınca (ya da tıklayıp sokağa tıklayınca) Sokak Görünümü açılır
  mount(el, ctx) {
    const st = ctx.state;
    const svg = el.querySelector('.hr-svg'), peg = el.querySelector('.hr-peg');
    if (!svg || !peg) return 0;
    const openAt = (target, x, y) => {
      if (!target?.closest?.('[data-street]')) return false;
      // Kavşakta en yakın sokak seçilir (üstte çizilen değil)
      const p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM().inverse());
      const off = (z) => (z.horiz ? Math.abs(p.y - z.a[1]) + (p.x < z.a[0] || p.x > z.b[0] ? 99 : 0) : Math.abs(p.x - z.a[0]) + (p.y < z.a[1] || p.y > z.b[1] ? 99 : 0));
      const s = STREETS.reduce((m, z) => (off(z) < off(m) ? z : m));
      let best = 0, bd = Infinity;
      for (let i = 0; i < s.n; i++) { const [px, py] = s.pt(i); const d = Math.hypot(px - p.x, py - p.y); if (d < bd) { bd = d; best = i; } }
      st.pegArm = false;
      st.sv = { street: s.id, i: best, h: best === s.n - 1 ? 2 : 0 };
      ctx.emit('sv-open', { street: s.id, i: best, via: 'peg' });
      ctx.refresh();
      return true;
    };
    peg.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const x0 = e.clientX, y0 = e.clientY;
      let ghost = null;
      const move = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) { ghost = peg.cloneNode(true); ghost.className = 'hr-ghost'; document.body.append(ghost); svg.classList.add('arm'); }
        if (ghost) Object.assign(ghost.style, { left: ev.clientX - 14 + 'px', top: ev.clientY - 30 + 'px' });
      };
      const up = (ev) => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (!ghost) { st.pegArm = !st.pegArm; ctx.emit('sv-arm', { on: st.pegArm }); ctx.refresh(); return; }
        ghost.remove();
        svg.classList.remove('arm');
        if (!openAt(document.elementFromPoint(ev.clientX, ev.clientY), ev.clientX, ev.clientY)) ctx.emit('sv-miss');
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
    if (st.pegArm) {
      svg.addEventListener('click', (e) => { if (!openAt(e.target, e.clientX, e.clientY)) { st.pegArm = false; ctx.emit('sv-miss'); ctx.refresh(); } }, { capture: true });
      el.querySelector('.hr').addEventListener('keydown', (e) => { if (e.key === 'Escape') { st.pegArm = false; ctx.refresh(); } });
    }
    return 0;
  },
};

export const HARITA_SITES = { [HARITA_HOST]: HARITA };
