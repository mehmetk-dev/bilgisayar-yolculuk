// Haftalık sunum ve tarama testi: tahtaya yansıtmak için büyük yazılı slaytlar (ok tuşları, sunum kumandası, tam ekran)
// Slayt türleri (sunum/hN.js): kavram {k:'kavram', title, text, pic?} · ogrendik {k:'ogrendik', items} · soru {k:'soru', q, pic?, opts, a, why}
// Kapak, "tarama testi" ara slaytı ve kapanış otomatik eklenir.
import { WEEKS } from './lessons/index.js';
import { SUNUM } from './sunum/index.js';
import { roboSVG, play, confetti } from './robo.js';

const ABC = ['A', 'B', 'C', 'D'];

function slides(wi) {
  const w = WEEKS[wi];
  const d = SUNUM[wi + 1];
  const qs = d.slides.filter((s) => s.k === 'soru');
  const before = d.slides.filter((s) => s.k !== 'soru');
  return [
    { k: 'kapak', w, wi },
    ...before,
    ...(qs.length ? [{ k: 'test', n: qs.length }] : []),
    ...qs.map((s, j) => ({ ...s, no: j + 1, of: qs.length })),
    { k: 'son', w, wi, next: WEEKS[wi + 1] && !WEEKS[wi + 1].extra ? WEEKS[wi + 1] : null },
  ];
}

function slideHTML(s) {
  if (s.k === 'kapak') {
    return `<div class="sl-kapak"><div class="sbot wave">${roboSVG()}</div><div>
  <p class="sl-tag">${s.wi + 1}. Hafta</p><h1>${s.w.title}</h1>
  <ol class="sl-les">${s.w.lessons.map((l) => `<li><span>${l.icon}</span> ${l.no}. ${l.title}</li>`).join('')}</ol></div></div>`;
  }
  if (s.k === 'ogrendik') {
    return `<h2>🎒 Bu hafta öğrendiklerimiz</h2><ul class="sl-ogr">${s.items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  }
  if (s.k === 'kavram') {
    return `<h2>${s.title}</h2><div class="sl-body${s.pic ? ' two' : ''}"><div class="sl-text">${s.text}</div>${s.pic ? `<div class="sl-pic">${s.pic}</div>` : ''}</div>`;
  }
  if (s.k === 'test') {
    return `<div class="sl-test"><div class="sbot dance">${roboSVG()}</div><div><h1>🧠 Tarama testi</h1><p><b>${s.n} soru</b> var. Hep birlikte düşünelim!</p><p class="mut">Önce herkes cevabını parmağıyla göstersin: A, B ya da C. Sonra “Cevabı göster”e basalım.</p></div></div>`;
  }
  if (s.k === 'soru') {
    return `<p class="sl-tag">Soru ${s.no} / ${s.of}</p><h2 class="sl-q">${s.q}</h2>
  <div class="sl-body${s.pic ? ' two' : ''}">${s.pic ? `<div class="sl-pic">${s.pic}</div>` : ''}
  <div class="sl-opts">${s.opts.map((o, i) => `<button type="button" class="sl-opt" data-i="${i}"><b>${ABC[i]}</b><span>${o}</span></button>`).join('')}</div></div>
  <div class="sl-foot"><button type="button" class="primary sl-show">👀 Cevabı göster</button><div class="sl-why" hidden><b>Doğru cevap: ${ABC[s.a]}.</b> ${s.why || ''}</div></div>`;
  }
  // son
  return `<div class="sl-kapak"><div class="sbot dance">${roboSVG()}</div><div><h1>Harika bir hafta! 🎉</h1>
  <p>${s.wi + 1}. haftayı bitirdik. Şimdi bilgisayarlara geçip görevleri yapabiliriz.</p>
  ${s.next ? `<p class="mut">Gelecek hafta: <b>${s.next.title}</b></p>` : ''}</div></div>`;
}

export function renderSunum(root, wi, k, go) {
  const list = slides(wi);
  const i = Math.max(0, Math.min(list.length - 1, k));
  const s = list[i];
  root.innerHTML = `<div class="sunum">
  <div class="sl-bar"><a class="btn" href="#">✖ Çık</a><span class="sl-title">📽️ ${wi + 1}. Hafta · ${WEEKS[wi].title}</span><span class="sp"></span>
    <button type="button" class="sl-full" title="Tam ekran (F)">⛶ Tam ekran</button></div>
  <section class="slide sl-${s.k}" aria-live="polite">${slideHTML(s)}</section>
  <nav class="sl-nav"><button type="button" class="sl-prev"${i ? '' : ' disabled'}>◀ Geri</button>
    <span class="sl-dots">${list.map((_, j) => `<i class="${j === i ? 'cur' : j < i ? 'ok' : ''}"></i>`).join('')}</span><span class="sl-n">${i + 1} / ${list.length}</span>
    <button type="button" class="primary sl-next"${i < list.length - 1 ? '' : ' disabled'}>İleri ▶</button></nav>
</div>`;
  const $ = (q) => root.querySelector(q);
  $('.sl-prev').onclick = () => go(i - 1);
  $('.sl-next').onclick = () => go(i + 1);
  $('.sl-full').onclick = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
  if (s.k === 'soru') {
    const show = () => {
      root.querySelectorAll('.sl-opt').forEach((b) => { b.classList.toggle('right', +b.dataset.i === s.a); b.classList.toggle('dim', +b.dataset.i !== s.a); });
      $('.sl-why').hidden = false;
      $('.sl-show').hidden = true;
      play('ok');
      confetti(30);
    };
    $('.sl-show').onclick = show;
    // Öğretmen sınıfın söylediği şıkka tıklayabilir: yanlışsa kırmızı olur, doğruysa cevap açılır
    root.querySelector('.sl-opts').onclick = (e) => {
      const b = e.target.closest('.sl-opt');
      if (!b) return;
      if (+b.dataset.i === s.a) show();
      else { b.classList.add('wrongopt'); play('wrong'); }
    };
  }
  if (s.k === 'son') confetti(90);
  // Klavye ve sunum kumandası: → ↓ PageDown boşluk ileri, ← ↑ PageUp geri, F tam ekran, Enter cevabı göster
  const onKey = (e) => {
    if (e.target.closest?.('input, textarea, select')) return;
    const key = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(key)) { e.preventDefault(); if (i < list.length - 1) go(i + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) { e.preventDefault(); if (i) go(i - 1); }
    else if (key === 'f' || key === 'F') $('.sl-full').click();
    else if (key === 'Enter' && s.k === 'soru' && !$('.sl-show').hidden) { e.preventDefault(); $('.sl-show').click(); }
    else if (key === 'Escape' && !document.fullscreenElement) location.hash = '';
  };
  addEventListener('keydown', onKey);
  return () => removeEventListener('keydown', onKey);
}

// Haritadaki ve kılavuzdaki bağlantılar için: bu haftanın sunumu var mı?
export const hasSunum = (wi) => !!SUNUM[wi + 1];
