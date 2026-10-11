// Hikâye, sıralama ve soru adımları
import { roboSVG, play, confetti } from './robo.js';

export function renderStory(el, s, done) {
  const pics = s.pics ? `<div class="pics">${s.pics.map((p, i) => `<span style="--i:${i}">${p}</span>`).join('')}</div>` : '';
  el.innerHTML = `<div class="story ${s.anim || 'wave'}"><div class="sbot">${roboSVG()}</div><div class="bubble"><h3>${s.title}</h3>${s.text}${pics}</div></div>`;
  done();
}

function shuffle(a) {
  const b = a.slice();
  do {
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
  } while (b.every((x, i) => x.i === i));
  return b;
}

// Karışık kartları doğru sıraya dizme
export function renderOrder(el, s, done) {
  const items = s.items.map(([ic, tx], i) => ({ i, ic, tx }));
  el.innerHTML = `<div class="act order">
  <div class="ahead"><div class="sbot think">${roboSVG()}</div><div><h3>${s.title}</h3>${s.text}</div></div>
  <ol class="slots">${items.map((_, i) => `<li><span class="num">${i + 1}</span><span class="sc">?</span></li>`).join('')}</ol>
  <div class="pool">${shuffle(items).map((it) => `<button type="button" class="card" data-i="${it.i}"><span class="ic">${it.ic}</span>${it.tx}</button>`).join('')}</div>
  <div class="amsg" hidden></div>
</div>`;
  const slots = el.querySelectorAll('.slots li');
  const msg = el.querySelector('.amsg');
  let next = 0;
  el.querySelector('.pool').addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (!c) return;
    if (+c.dataset.i === next) {
      const it = items[next];
      slots[next].querySelector('.sc').innerHTML = `<span class="ic">${it.ic}</span>${it.tx}`;
      slots[next].classList.add('fill');
      c.remove();
      next++;
      msg.hidden = true;
      if (next === items.length) {
        play('win');
        confetti(40);
        el.querySelector('.sbot').className = 'sbot dance';
        msg.hidden = false;
        msg.className = 'amsg ok pop';
        msg.innerHTML = s.ok || 'Harika! Adımları doğru sıraya koydun. İşte bu bir <b>algoritma</b>! 🎉';
        done();
      } else play('ok');
    } else {
      play('wrong');
      c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
      msg.hidden = false;
      msg.className = 'amsg bad';
      msg.innerHTML = `Hmm, bu adım biraz daha sonra gelmeli. <b>${next + 1}.</b> adımda ne yapmalıyız? 🤔`;
    }
  });
}

// Çoktan seçmeli soru
export function renderQuiz(el, s, done) {
  el.innerHTML = `<div class="act quiz">
  <h3>${s.title}</h3>
  ${s.pic ? `<div class="qpic">${s.pic}</div>` : ''}
  <p class="qq">${s.q}</p>
  <div class="opts">${s.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
  <div class="amsg" hidden></div>
</div>`;
  const msg = el.querySelector('.amsg');
  el.querySelector('.opts').addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || b.disabled) return;
    msg.hidden = false;
    if (+b.dataset.i === s.a) {
      b.classList.add('right');
      el.querySelectorAll('.opt').forEach((o) => { o.disabled = true; });
      play('ok');
      confetti(25);
      msg.className = 'amsg ok pop';
      msg.innerHTML = `<b>Doğru!</b> ${s.ok || ''}`;
      done();
    } else {
      b.classList.add('wrongopt');
      b.disabled = true;
      play('wrong');
      msg.className = 'amsg bad';
      msg.innerHTML = s.no || 'Bir daha düşün. Robo\'nun yerinde olsan ne yapardın? 🤔';
    }
  });
}
