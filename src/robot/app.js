// Robo ile Kodlama: macera haritası ve bölüm ekranı
import { LESSONS, WEEKS } from './lessons/index.js';
import { renderStory, renderOrder, renderQuiz } from './acts.js';
import { renderGrid } from './board.js';
import { roboSVG, play, confetti, prefs, load, save } from './robo.js';

const $ = (s) => document.querySelector(s);
const mapEl = $('#map');
const lesEl = $('#lesson');
const crumb = $('#crumb');
const KEY = 'robo-ilerleme-v2';
const progress = load(KEY, {});
const rec = (no) => {
  const r = (progress[no] ||= { steps: {}, done: false });
  r.score ||= {};
  return r;
};
const RENDER = { story: renderStory, order: renderOrder, quiz: renderQuiz, grid: renderGrid };
let cleanup = null;

function show(view) {
  document.body.dataset.view = view;
  mapEl.hidden = view !== 'map';
  lesEl.hidden = view === 'map';
}

function route() {
  cleanup?.();
  cleanup = null;
  const m = /^#b(\d+)(?:\/(\d+|son))?$/.exec(location.hash);
  const L = m && LESSONS.find((l) => l.no === +m[1]);
  if (!L) showMap();
  else if (m[2] === 'son') showFinish(L);
  else showStep(L, Math.min(+(m[2] || 0), L.steps.length - 1));
  window.scrollTo(0, 0);
  mapEl.scrollTop = lesEl.scrollTop = 0;
}

function showMap() {
  show('map');
  crumb.textContent = '';
  lesEl.innerHTML = '';
  const next = LESSONS.find((l) => !rec(l.no).done) || LESSONS[0];
  const started = LESSONS.some((l) => Object.keys(rec(l.no).steps).length);
  const node = (l) => {
    const r = rec(l.no);
    const n = Object.keys(r.steps).length;
    const st = Object.values(r.score).reduce((a, b) => a + b, 0);
    return `<li class="node${r.done ? ' done' : ''}" style="--c:${l.color}"><a href="#b${l.no}">
  <span class="nnum">${r.done ? '✓' : l.no}</span>
  <span class="ncard"><span class="nicon">${l.icon}</span><span class="ntxt"><b>${l.no}. ${l.title}</b><small>${l.desc}</small>
  <span class="nfoot"><span class="chip">Kavram: ${l.concept}</span><span class="nprog"><i style="width:${(n / l.steps.length) * 100}%"></i></span><span class="ncount">${n}/${l.steps.length}${st ? ` · ⭐${st}` : ''}</span></span></span></span>
</a></li>`;
  };
  const nodes = WEEKS.map((w, wi) => `<li class="whead"><span>${wi + 1}. Hafta</span>${w.title}<small>4 ders × 40 dk</small></li>${w.lessons.map(node).join('')}`).join('');
  mapEl.innerHTML = `<div class="mwrap">
<section class="hero">
  <div class="sbot wave">${roboSVG()}</div>
  <div class="htxt">
    <h1>Robo ile Kodlama Macerası</h1>
    <p>Robo bir robot ama kendi kendine düşünemiyor! Ona <b>adım adım komut</b> vererek pile ulaşmasına yardım et. Bilgisayarda kodlamaya (Scratch'e) başlamadan önce algoritmanın sırlarını öğren.</p>
    <a class="btn primary big" href="#b${next.no}">${started ? 'Kaldığın yerden devam et' : 'Maceraya başla'} ▶</a>
  </div>
</section>
<ol class="trail">${nodes}
</ol>
<section class="tnote">
  <h3>👩‍🏫 Öğretmen için</h3>
  <p>Bölümler 8–12 yaş için sırayla tasarlandı: <b>sıralama → yön → dönüş → hata ayıklama → döngü</b>. Her bölüm yaklaşık bir ders saati sürer. Önerilen akış: 5–10 dk bilgisayarsız sınıf oyunu (her bölümün sonunda öneri var), 25 dk ekranda görevler, 5 dk paylaşım.</p>
  <p>Adımlar arasında üstteki numaralı düğmelerle serbestçe geçebilirsiniz. İlerleme yalnızca bu tarayıcıda saklanır. <button type="button" class="link" id="resetAll">İlerlemeyi sıfırla</button></p>
</section></div>`;
  $('#resetAll').onclick = () => {
    if (!confirm('Tüm bölümlerdeki ilerleme silinsin mi?')) return;
    for (const k of Object.keys(progress)) delete progress[k];
    save(KEY, progress);
    showMap();
  };
}

function lessonHead(L, i) {
  const r = rec(L.no);
  const dots = L.steps.map((s, k) => `<a class="dot${k === i ? ' cur' : ''}${r.steps[k] ? ' ok' : ''}" href="#b${L.no}/${k}" title="${k + 1}. adım">${k + 1}</a>`).join('');
  return `<div class="lbar"><span class="ltag">${L.icon} ${L.no}. Bölüm</span><h2>${L.title}</h2><nav class="dots" aria-label="Adımlar">${dots}<a class="dot fin${i === 'son' ? ' cur' : ''}${r.done ? ' ok' : ''}" href="#b${L.no}/son" title="Bitiş">🏁</a></nav></div>`;
}

function showStep(L, i) {
  show('lesson');
  crumb.textContent = `${L.week}. Hafta · ${L.no}. Bölüm`;
  const r = rec(L.no);
  const s = L.steps[i];
  lesEl.innerHTML = `<div class="lwrap" style="--c:${L.color}">${lessonHead(L, i)}
  <div class="stage s-${s.type}"></div>
  <nav class="lnav"><a class="btn" href="${i > 0 ? `#b${L.no}/${i - 1}` : '#'}">◀ ${i > 0 ? 'Geri' : 'Harita'}</a><span class="nhint"></span><button type="button" class="primary big go" aria-disabled="true">${i + 1 < L.steps.length ? 'Devam ▶' : 'Bitir 🏁'}</button></nav></div>`;
  const go = lesEl.querySelector('.go');
  const hint = lesEl.querySelector('.nhint');
  let ok = false;
  const done = (score) => {
    if (score && score > (r.score[i] || 0)) { r.score[i] = score; save(KEY, progress); }
    if (ok) return;
    ok = true;
    if (!r.steps[i]) { r.steps[i] = true; save(KEY, progress); }
    go.setAttribute('aria-disabled', 'false');
    go.classList.add('ready');
    hint.textContent = '';
    lesEl.querySelector('.dot.cur')?.classList.add('ok');
  };
  go.onclick = () => {
    if (!ok) {
      play('wrong');
      hint.textContent = s.type === 'grid' ? 'Önce Robo\'yu pile ulaştır 🔋' : 'Önce bu görevi tamamla 🙂';
      go.classList.remove('shake'); void go.offsetWidth; go.classList.add('shake');
      return;
    }
    play('click');
    location.hash = i + 1 < L.steps.length ? `#b${L.no}/${i + 1}` : `#b${L.no}/son`;
  };
  if (r.steps[i]) done();
  cleanup = RENDER[s.type](lesEl.querySelector('.stage'), s, done, r.score[i]) || null;
}

function showFinish(L) {
  show('lesson');
  crumb.textContent = `${L.no}. Bölüm`;
  const r = rec(L.no);
  r.done = true;
  save(KEY, progress);
  const next = LESSONS.find((l) => l.no === L.no + 1);
  lesEl.innerHTML = `<div class="lwrap" style="--c:${L.color}">${lessonHead(L, 'son')}
  <div class="stage finish">
    <div class="sbot dance">${roboSVG()}</div>
    <div class="badge"><span>${L.icon}</span><b>${L.no}. Bölüm tamam!</b></div>
    <h3>Tebrikler, harika bir programcısın! 🎉</h3>
    <div class="learned"><h4>Bu bölümde öğrendiklerin</h4><ul>${L.learned.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="tnote"><h4>👩‍🏫 Sınıfta oynayın</h4><p>${L.teacher}</p></div>
    <div class="fbtns">${next ? `<a class="btn primary big" href="#b${next.no}">${next.icon} ${next.no}. Bölüm: ${next.title} ▶</a>` : '<span class="soon-txt">🏆 Bütün bölümleri bitirdin!</span>'}<a class="btn big" href="#">🗺 Haritaya dön</a></div>
  </div></div>`;
  play('win');
  confetti(110);
}

// Üst çubuk: ses ve hız
const soundBtn = $('#soundBtn');
const speedBtn = $('#speedBtn');
const paint = () => {
  soundBtn.textContent = prefs.sound ? '🔊 Ses açık' : '🔇 Ses kapalı';
  speedBtn.textContent = prefs.fast ? '🐇 Hızlı' : '🐢 Yavaş';
};
soundBtn.onclick = () => { prefs.sound = !prefs.sound; save('robo-ses', prefs.sound); paint(); play('click'); };
speedBtn.onclick = () => { prefs.fast = !prefs.fast; save('robo-hizli', prefs.fast); paint(); play('click'); };
paint();

addEventListener('hashchange', route);
route();
