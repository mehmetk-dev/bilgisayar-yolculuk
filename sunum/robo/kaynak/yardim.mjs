// Slayt yazma yardımcıları: her işlev HTML metni döndürür. Motor (motor.js) bu işaretlemeyi canlandırır.
export const attr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const CH = { F: ['⬆', 'c-F'], B: ['⬇', 'c-B'], L: ['↰', 'c-L'], R: ['↱', 'c-R'], P: ['✋', 'c-P'], f: ['🧩', 'c-f'] };
// Satır içi küçük blok dizisi: chips('FFR')
export const chips = (p) => `<span class="chips">${[...p].map((c) => `<span class="chip ${CH[c][1]}">${CH[c][0]}</span>`).join('')}</span>`;
// Tek blok, yazılı: chip('F', 'İleri git')
export const chip = (c, t) => `<span class="chip w ${CH[c][1]}">${CH[c][0]} ${t}</span>`;

export const robo = (anim = 'float', w = 240) => `<div class="${anim}" style="width:${w}px" data-robo></div>`;
export const btns = () => '<div class="btns"><button class="btn go" data-act="play">▶ Oynat</button><button class="btn" data-act="reset">↺ Baştan</button><button class="btn sl on" data-act="slow">🐢 Yavaş</button></div>';

// Izgara resmi (oynatıcısız): grid(['S..G'], {dir, size, lr})
export const grid = (map, o = {}) => `<div class="gridbox" data-grid="${attr(map.join('|'))}" data-dir="${o.dir || 'E'}" data-size="${o.size || 100}"${o.lr ? ' data-lr="1"' : ''}></div>`;
// Kod kutusu
export const code = (prog, o = {}) => `<div class="code${o.flow ? ' flow' : ''}${o.sm ? ' sm' : ''}${o.fnbody ? ' fnbody' : ''}" data-code="${attr(prog)}"${o.fname ? ` data-fname="${attr(o.fname)}"` : ''}${o.named != null ? ` data-named="${o.named ? 1 : 0}"` : ''}${o.w ? ` style="width:${o.w}px"` : ''}></div>`;

// Canlı oynatıcı: harita + program + düğmeler. Düz programlar soldan sağa numaralı kutularla gösterilir;
// geniş-alçak haritalarda harita üstte, program altta durur (stack).
export function player(o) {
  const m0 = o.maps ? o.maps[0] : o.map;
  const linear = !/[\d(){}]/.test(o.prog) && o.fn == null;
  const stack = o.stack ?? (m0.length <= 2 && m0[0].length >= 3);
  const cols = Math.max(...m0.map((r) => r.length)), rows = m0.length;
  if (!o.size) o = { ...o, size: stack ? Math.min(170, Math.floor(1380 / cols), Math.floor(300 / rows)) : Math.min(160, Math.floor(620 / cols), Math.floor(540 / rows)) };
  const gb = o.maps
    ? `<div class="gridbox" data-maps="${attr(JSON.stringify(o.maps))}" data-dir="${o.dir || 'E'}" data-size="${o.size}"${o.lr ? ' data-lr="1"' : ''}></div>`
    : grid(o.map, o);
  const fn = o.fn != null
    ? `<div class="codettl fn">🧩 ${o.fname} fonksiyonu</div>${code(o.fn, { fnbody: true, fname: o.fname, sm: o.sm })}<div class="codettl">📜 Programım</div>`
    : '';
  const cd = code(o.prog, { fname: o.fname, sm: o.sm, w: linear ? null : (o.codeW || 520), flow: linear });
  const lim = o.limit ? ` data-limit="${o.limit}"` : '';
  if (stack) return `<div class="player stack"${lim}><div>${gb}</div><div class="lower"><div class="col">${fn}${cd}</div>${btns()}</div>${o.under || ''}${o.side || ''}</div>`;
  return `<div class="player row" style="align-items:flex-start;gap:${o.gap || 50}px"${lim}>
<div style="flex:0 0 auto${o.pad ? ';padding-left:' + o.pad + 'px' : ''}">${gb}</div>
<div class="col" style="min-width:540px"><div class="codewrap">${fn}${cd}</div>${btns()}${o.under || ''}${o.side || ''}</div></div>`;
}

// Soru
export function quiz({ q, opts, a, why, pic, v, side }) {
  const L = 'ABCD';
  const ob = `<div class="opts${v ? ' v' : ''}" data-a="${a}">${opts.map((t, j) => `<button class="opt"><span class="k">${L[j]}</span><span>${t}</span></button>`).join('')}</div><div class="why">✅ ${why}</div>`;
  if (!pic) return `<div class="q">${q}</div>${ob}`;
  return `<div class="row" style="gap:56px;align-items:center"><div style="flex:0 0 auto">${pic}</div><div class="col"><div class="q">${q}</div>${ob}</div></div>${side || ''}`;
}

export const botsay = (html, anim = 'wave', w = 250) => `<div class="botsay"><div class="bot-l">${robo(anim, w)}</div><div class="say col">${html}</div></div>`;
export const order = (items) => `<div class="order" data-items="${attr(JSON.stringify(items))}"><div class="pool"></div><div class="done"></div></div><div class="btns" style="margin-top:14px"><button class="btn w" data-act="show">👀 Doğru sırayı göster</button></div>`;
export const turnToy = () => `<div class="turn"><div class="tz"><span class="cmp" style="top:10px">⬆</span><span class="cmp" style="bottom:10px">⬇</span><span class="cmp" style="left:16px">⬅</span><span class="cmp" style="right:16px">➡</span><div class="gridbox"></div></div><div class="ttx"></div><div class="btns" style="margin:0"><button class="btn t" data-act="L">↰ Sola dön</button><button class="btn t" data-act="R">↱ Sağa dön</button><button class="btn w" data-act="0">↺</button></div></div>`;
export const learned = (items) => `<ul class="learn${items.length > 5 ? ' tight' : ''}">${items.map((t, j) => `<li class="f" data-n="${j + 1}">${t}</li>`).join('')}</ul>`;
export const tasks = (list) => `<div class="tasks">${list.map((t) => `<div class="${t.startsWith('⭐') ? 'bonus' : ''}">${t}</div>`).join('')}</div>`;

// Ders bağlamı: renk ve "nerede" etiketi her slayta kendiliğinden eklenir
export function lesson({ week, idx, no, color, icon, title, desc }) {
  const where = `${week}. hafta · ${idx}. ders`;
  const s = ({ cls = '', tag, title: t, body, note, menu }) =>
    `<section class="s ${cls}" data-color="${color}" data-where="${attr(where)}"${menu ? ` data-menu="${attr(menu)}"` : ''} data-note="${attr(note || '')}">${tag ? `<span class="tag ${cls ? '' : 'lc'}">${tag}</span>` : ''}${t ? `<h2>${t}</h2>` : ''}${body || ''}</section>`;
  return {
    s,
    cover: (note) => `<section class="s lcover center" data-color="${color}" data-where="${attr(where)}" data-menu="${attr(`${idx}. ders: ${title}`)}" data-sub="${attr(`${no}. bölüm`)}" data-note="${attr(note || '')}">
<div class="sky"></div><div class="row center" style="flex-direction:column;gap:6px"><div class="icon">${icon}</div><span class="num">${idx}. DERS · Robo'da ${no}. bölüm</span><h1>${title}</h1><p>${desc}</p></div></section>`,
    hard: (o) => s({ ...o, cls: 'hard', tag: '⚠️ DİKKAT: ZOR YER' }),
    game: (o) => s({ ...o, cls: 'game', tag: '🎲 SINIF OYUNU · bilgisayarsız' }),
    pc: (list, note) => s({ cls: 'pc', tag: `💻 ŞİMDİ BİLGİSAYARDA · ${no}. bölüm`, title: `Robo'da “${title}”`, note: note || 'Öğrenciler ikişer oturur: biri <b>sürücü</b> (fareyi kullanır), diğeri <b>yol gösterici</b>. Her görevde yer değiştirsinler. ⭐ görevler isteğe bağlıdır.',
      body: `<p>Bu görevleri yapacağız:</p>${tasks(list)}<p class="soft" style="margin-top:24px;font-size:30px">⭐ olanlar bonus: zorlanırsan atlayabilirsin.</p>` }),
  };
}
export function weekCover({ week, title, color, lessons, note }) {
  return `<section class="s cover center" data-color="${color}" data-menu="${attr(`${week}. hafta kapağı`)}" data-sub="${attr(title)}" data-note="${attr(note || '')}"><div class="sky"></div>
<div class="row center" style="flex-direction:column;gap:14px">${robo('dance', 200)}<span class="num" style="font-size:32px;font-weight:900;background:#ffffff30;border-radius:99px;padding:8px 26px">${week}. HAFTA</span><h1>${title}</h1>
<div class="lessons">${lessons.map(([ic, t], j) => `<div><small>${j + 1}. ders</small>${ic} ${t}</div>`).join('')}</div></div></section>`;
}
export function weekEnd({ week, color, items, next }) {
  return `<section class="s" data-color="${color}" data-where="${week}. hafta" data-menu="Bu hafta öğrendiklerimiz" data-note="Her maddeyi okuyup sınıfa tekrarlatın. Kim örnek verebilir?"><span class="tag lc">🎓 BU HAFTA ÖĞRENDİKLERİMİZ</span><h2>Aklında kalsın!</h2>${learned(items)}</section>
<section class="s cover center" data-color="${color}" data-end="1" data-note="Sonraki hafta: ${attr(next)}"><div class="sky"></div><div class="row center" style="flex-direction:column;gap:20px">${robo('dance', 230)}<h1>Aferin! 🎉</h1><p>${week}. haftayı bitirdik. Gelecek hafta: <b>${next}</b></p></div></section>`;
}
