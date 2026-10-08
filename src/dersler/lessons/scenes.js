// 'scene' derslerinde sağ tarafta gösterilen etkinlikler: ayırma oyunu, mesaj kartları, şifre ölçer
import { esc } from '../dialog.js';

// Sürükleyerek ayırma: her öğe doğru kutuya bırakılmalı.
// opts: { bins: [{ id, label, icon }], items: [{ label, icon, bin, why }] }
export function sorter(opts) {
  return (el, c) => {
    el.className = 'sc sc-sort';
    const items = [...opts.items].sort(() => Math.random() - 0.5);
    let left = items.length;
    el.innerHTML = `<div class="so-pool">${items.map((it, i) => `<div class="so-item" data-i="${i}"><span>${it.icon}</span>${esc(it.label)}</div>`).join('')}</div>
      <div class="so-bins" style="--cols:${opts.bins.length === 3 ? 3 : 2}">${opts.bins.map((b) => `<div class="so-bin" data-bin="${b.id}"><h3>${b.icon} ${esc(b.label)}</h3><div class="so-in"></div></div>`).join('')}</div>`;
    el.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.so-item');
      if (!card || card.classList.contains('ok') || e.button !== 0) return;
      e.preventDefault();
      const it = items[+card.dataset.i];
      const r = card.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      const ghost = card.cloneNode(true);
      ghost.classList.add('so-ghost');
      ghost.style.width = r.width + 'px';
      document.body.append(ghost);
      card.classList.add('lift');
      let over = null;
      const mv = (ev) => {
        ghost.style.left = ev.clientX - ox + 'px';
        ghost.style.top = ev.clientY - oy + 'px';
        const b = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.so-bin');
        if (b !== over) { over?.classList.remove('over'); over = b; over?.classList.add('over'); }
      };
      mv(e);
      const up = (ev) => {
        document.removeEventListener('pointermove', mv);
        document.removeEventListener('pointerup', up);
        ghost.remove();
        card.classList.remove('lift');
        over?.classList.remove('over');
        const bin = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.so-bin');
        if (!bin) return;
        if (bin.dataset.bin === it.bin) {
          card.classList.add('ok');
          bin.querySelector('.so-in').append(card);
          left--;
          c.note(`✔ <b>${esc(it.label)}</b>: ${it.why}`);
          c.emit('sort', { ok: true, left });
          if (!left) c.emit('sort-done');
        } else {
          bin.classList.add('no');
          setTimeout(() => bin.classList.remove('no'), 500);
          c.warn(`<b>${esc(it.label)}</b> oraya ait değil. ${it.why}`);
          c.emit('sort', { ok: false, left });
        }
      };
      document.addEventListener('pointermove', mv);
      document.addEventListener('pointerup', up);
    });
  };
}

// Mesaj kartı + seçenekler. opts: { kind: 'sms'|'mail'|'call'|'web'|'plain', from, text, options: [[id, etiket]], correct, explain, column }
// column: true → uzun seçenekler alt alta dizilir; shuffle: true → seçenekler her açılışta karışık sırada
export function quiz(opts) {
  return (el, c) => {
    el.className = 'sc sc-quiz';
    const options = [...(opts.options || [['safe', '✅ Güvenli'], ['scam', '🚩 Dolandırıcılık']])];
    if (opts.shuffle) options.sort(() => Math.random() - 0.5);
    const frame = {
      sms: `<div class="ph"><div class="ph-top">💬 Mesajlar</div><div class="ph-from">${esc(opts.from)}</div><div class="ph-bubble">${opts.text}</div></div>`,
      mail: `<div class="ml"><div class="ml-head"><b>Kimden:</b> ${esc(opts.from)}<br><b>Konu:</b> ${esc(opts.subject || '')}</div><div class="ml-body">${opts.text}</div></div>`,
      call: `<div class="ph call"><div class="ph-top">📞 Gelen arama</div><div class="ph-from">${esc(opts.from)}</div><div class="ph-bubble talk">${opts.text}</div></div>`,
      web: `<div class="wb"><div class="wb-bar">${opts.from}</div><div class="wb-body">${opts.text}</div></div>`,
      plain: `<div class="pl">${opts.text}</div>`,
    }[opts.kind || 'plain'];
    el.innerHTML = `<div class="qz-card">${frame}</div><p class="qz-q">${opts.question || 'Sizce bu mesaj güvenli mi?'}</p>
      <div class="qz-opts${opts.column ? ' col' : ''}">${options.map(([id, l]) => `<button type="button" class="btn" data-a="${id}">${l}</button>`).join('')}</div>
      <div class="qz-exp" hidden></div>`;
    el.querySelector('.qz-opts').addEventListener('click', (e) => {
      const b = e.target.closest('[data-a]');
      if (!b) return;
      const ok = b.dataset.a === opts.correct;
      el.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('picked', x === b));
      b.classList.add(ok ? 'right' : 'wrong');
      const exp = el.querySelector('.qz-exp');
      exp.hidden = false;
      exp.className = 'qz-exp ' + (ok ? 'ok' : 'bad');
      exp.innerHTML = (ok ? '<b>Doğru!</b> ' : '<b>Tekrar düşünün.</b> ') + opts.explain;
      el.querySelectorAll('.clue').forEach((x) => x.classList.add('show'));
      c.emit('quiz', { ok, answer: b.dataset.a });
    });
  };
}

// Şifre gücü ölçer: puan 0-4
export function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-zçğıöşü]/.test(pw) && /[A-ZÇĞİÖŞÜ]/.test(pw)) s++;
  if (/\d/.test(pw)) s += 0.5;
  if (/[^\p{L}\p{N}]/u.test(pw)) s += 0.5;
  if (/^(123|1234|12345|123456|qwerty|şifre|sifre|password|parola)/i.test(pw) || /(19|20)\d\d/.test(pw)) s = Math.min(s, 1);
  return Math.min(4, Math.floor(s));
}

export function passwordMeter(el, c) {
  el.className = 'sc sc-pw';
  const labels = ['Çok zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok güçlü'];
  el.innerHTML = `<label class="pw-lab">Bir şifre deneyin <small>(gerçek şifrenizi yazmayın!)</small><input class="pw-in" type="text" autocomplete="off" spellcheck="false"></label>
    <div class="pw-meter"><i></i></div><div class="pw-word"></div>
    <ul class="pw-rules"><li data-r="len">En az 12 karakter</li><li data-r="case">Büyük ve küçük harf</li><li data-r="num">Rakam</li><li data-r="sym">İşaret (! ? * gibi)</li><li data-r="pers">Doğum yılı, 1234 gibi tahmin edilebilir şeyler yok</li></ul>`;
  const inp = el.querySelector('.pw-in');
  inp.addEventListener('input', () => {
    const v = inp.value;
    const s = v ? strength(v) : 0;
    el.querySelector('.pw-meter i').style.width = (v ? (s + 1) * 20 : 0) + '%';
    el.querySelector('.pw-meter i').dataset.s = s;
    el.querySelector('.pw-word').textContent = v ? labels[s] : '';
    const rules = { len: v.length >= 12, case: /[a-zçğıöşü]/.test(v) && /[A-ZÇĞİÖŞÜ]/.test(v), num: /\d/.test(v), sym: /[^\p{L}\p{N}]/u.test(v), pers: !!v && !/(123|qwerty|şifre|sifre)/i.test(v) && !/(19|20)\d\d/.test(v) };
    el.querySelectorAll('[data-r]').forEach((li) => li.classList.toggle('ok', rules[li.dataset.r]));
    c.emit('pw', { score: s });
  });
  setTimeout(() => inp.focus(), 50);
}
