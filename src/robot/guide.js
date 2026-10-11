// Öğretmen kılavuzu: haftalık plan, sınıf etkinlikleri ve cevap anahtarı (yazdırılabilir)
import { WEEKS, LESSONS } from './lessons/index.js';
import { codePic } from './board.js';
import { BLOCKS, CATS, KEYS, SOUNDS, NOTES, COLORS } from './sahne/blocks.js';
import { BACKDROPS } from './sahne/costumes.js';
import { esc } from './robo.js';

const TYPE = { story: ['📖', 'Anlatım'], order: ['🧩', 'Sıralama'], quiz: ['❓', 'Soru'], grid: ['🤖', 'Robo görevi'], scratch: ['🐱', 'Sahne görevi'] };
const OPS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const REP = { x: 'x konumu', y: 'y konumu', dir: 'yön', mx: 'fare x', my: 'fare y', answer: 'cevap', timer: 'zamanlayıcı' };

// Bir değeri okunur yazıya çevirir: (rastgele 1 ile 6 arası), <Kedi'ye dokunuyor mu?> …
function fmt(v) {
  if (v == null) return '…';
  if (typeof v !== 'object') return esc(v);
  if (v.k) {
    if (v.k === 'touch') return `&lt;${esc(v.o)}’a dokunuyor mu?&gt;`;
    if (v.k === 'key') return `&lt;${KEYS[v.key]} tuşuna basılı mı?&gt;`;
    if (v.k === 'mouse') return '&lt;fare tıklandı mı?&gt;';
    if (v.k === 'cmp') return `&lt;${fmt(v.a)} ${esc(v.op)} ${fmt(v.b)}&gt;`;
  }
  if (v.r === 'rand') return `(rastgele ${fmt(v.a)} ile ${fmt(v.b)} arası)`;
  if (v.r === 'op') return `(${fmt(v.a)} ${OPS[v.o]} ${fmt(v.b)})`;
  if (v.r === 'join') return `(birleştir ${fmt(v.a)} ${fmt(v.b)})`;
  if (v.r === 'var') return `(${esc(v.v)})`;
  return `(${REP[v.r] || v.r})`;
}

function argText(op, k, v) {
  const type = BLOCKS[op].args[k][0];
  if (typeof v === 'object' && v) return fmt(v);
  if (type === 'key') return KEYS[v];
  if (type === 'sound') return SOUNDS[v];
  if (type === 'note') return NOTES[v];
  if (type === 'color') return COLORS[v];
  if (type === 'backdrop') return BACKDROPS[v]?.name;
  if (type === 'costume') return `${v}. kostüm`;
  if (type === 'clonesrc' && v === 'kendim') return 'kendim';
  return `[${esc(v)}]`;
}

// Kısa yazımlı Scratch betiğini satır satır yazar
function scriptLines(spec, depth = 0, out = []) {
  for (const b of spec) {
    const [op, ...rest] = b;
    const def = BLOCKS[op];
    const keys = Object.keys(def.args || {});
    const text = def.text.replace(/\{(\w+)\}/g, (_, k) => argText(op, k, rest[keys.indexOf(k)] ?? def.args[k][1]));
    out.push(`<div class="gl" style="--d:${depth};--k:${CATS[def.cat].color}">${text}</div>`);
    const after = rest.slice(keys.length);
    if (def.kind === 'c' || def.kind === 'c2') {
      scriptLines(after[0] || [], depth + 1, out);
      if (def.kind === 'c2') { out.push(`<div class="gl" style="--d:${depth};--k:${CATS[def.cat].color}">değilse</div>`); scriptLines(after[1] || [], depth + 1, out); }
    }
  }
  return out;
}

function answer(s) {
  if (s.type === 'grid' && s.sol) return codePic(s.sol, s.fnSol || s.fnPreset, s.fnName);
  if (s.type === 'quiz') return `<p>✅ ${s.opts[s.a]}</p>`;
  if (s.type === 'order') return `<ol>${s.items.map(([i, t]) => `<li>${i} ${t}</li>`).join('')}</ol>`;
  if (s.type === 'scratch' && s.sol) {
    return Object.entries(s.sol).map(([name, scripts]) => `<div class="gsp"><b>${esc(name)}</b>${scripts.map((sc) => `<div class="gscript">${scriptLines(sc).join('')}</div>`).join('')}</div>`).join('')
      + (s.free ? '<p class="mut">Serbest görev: bu sadece bir örnek; hedef listesindeki şartları sağlayan her çözüm kabul edilir.</p>' : '');
  }
  return '';
}

export function renderGuide(el) {
  const weeks = WEEKS.map((w, wi) => {
    const lessons = w.lessons.map((L) => `<section class="glesson" style="--c:${L.color}">
  <h3>${L.icon} ${L.no}. ${L.title} <small>Kavram: ${L.concept} · ${L.steps.length} adım · ~40 dk</small></h3>
  <p>${L.desc}</p>
  <div class="gcols">
    <div><h4>Öğrenme kazanımları</h4><ul>${L.learned.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div><h4>Sınıf etkinliği (bilgisayarsız)</h4><p>${L.teacher}</p></div>
  </div>
  <h4>Adımlar ve cevap anahtarı</h4>
  <ol class="gsteps">${L.steps.map((s) => {
    const a = answer(s);
    return `<li><span class="gtype" title="${TYPE[s.type][1]}">${TYPE[s.type][0]}</span> ${s.title}${a ? `<details><summary>Cevap</summary><div class="gans">${a}</div></details>` : ''}</li>`;
  }).join('')}</ol>
</section>`).join('');
    return `<section class="gweek"><h2><span>${wi + 1}. Hafta</span> ${w.title}</h2>${lessons}</section>`;
  }).join('');

  el.innerHTML = `<div class="guide">
  <div class="ghead">
    <h1>📘 Öğretmen Kılavuzu</h1>
    <p>Robo ile Kodlama: 8–12 yaş · ${WEEKS.length} hafta · ${LESSONS.length} bölüm · haftada bir gün, 4 ders × 40 dakika.</p>
    <div class="gbtns"><a class="btn" href="#">🗺 Haritaya dön</a><button type="button" class="btn gopen">Bütün cevapları aç</button><button type="button" class="primary gprint">🖨 Yazdır</button></div>
  </div>
  <section class="gplan">
    <h2>Önerilen ders akışı (40 dk)</h2>
    <ol><li><b>5–10 dk</b> Bölümün sonundaki bilgisayarsız sınıf etkinliği ile kavramı tanıtın.</li><li><b>25 dk</b> Öğrenciler adımları kendi hızlarında yapsın. Hızlı bitirenler ⭐ bonus görevlere geçsin.</li><li><b>5 dk</b> Paylaşım: “Hangi görev zordu, nasıl çözdünüz?”</li></ol>
    <p><b>İpuçları:</b> Her öğrenci başta kendi adını seçmeli (sağ üstte 👤); ilerlemesi ve kodları o bilgisayarda ayrı saklanır. Numaralı adım düğmeleriyle istediğiniz adıma geçebilirsiniz. Gerçek Scratch'ten farklı olarak burada 🏁 sahneyi başa alır.</p>
    <table class="gtable"><thead><tr><th>Hafta</th><th>Konu</th><th>Bölümler</th></tr></thead><tbody>${WEEKS.map((w, wi) => `<tr><td>${wi + 1}</td><td>${w.title}</td><td>${w.lessons.map((l) => `${l.no}. ${l.title}`).join(' · ')}</td></tr>`).join('')}</tbody></table>
  </section>
  ${weeks}
</div>`;
  el.querySelector('.gprint').onclick = () => print();
  el.querySelector('.gopen').onclick = (e) => {
    const all = [...el.querySelectorAll('.gsteps details')];
    const open = !all.every((d) => d.open);
    all.forEach((d) => { d.open = open; });
    e.target.textContent = open ? 'Cevapları kapat' : 'Bütün cevapları aç';
  };
}
