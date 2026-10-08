// Ek derslerde sık kullanılan adım kalıpları: bilgi sahnesi, sürükleyerek ayırma, çoktan seçmeli soru
import { sorter, quiz } from './scenes.js';
import { lines, closeEnough } from './common.js';

const IDS = ['a', 'b', 'c', 'd'];
const plain = (s) => s.replace(/<[^>]+>/g, '');

// 'scene' derslerinde sağdaki bilgi kartı
export const info = (html) => (el) => { el.className = 'sc sc-info'; el.innerHTML = html; };

// Sürükleyerek ayırma adımı ('scene' dersleri)
export function ayir({ title, html, bins, items, done }) {
  return {
    title, done,
    html: html || '<p>Kartları tutup doğru kutuya sürükleyin. Yanlış kutuya bırakırsanız kart geri döner ve nedeni yazar.</p>',
    mouse: '🖱 Kartı kutuya sürükleyin',
    scene: sorter({ bins, items }),
    on: (ev) => ev.type === 'sort-done',
  };
}

// Çoktan seçmeli soru ('scene' dersleri). Seçenekler karışık sırada gelir.
// { title, html, kind, from, subject, text, q, opts, ok: doğru seçeneğin sırası, why, done }
export function sec({ title, html, kind = 'plain', from, subject, text = '', q, opts, ok, why, done }) {
  return {
    title,
    html: html || '<p>Yandaki soruyu okuyun ve doğru cevaba tıklayın.</p>',
    scene: quiz({
      kind, from, subject, text, question: q, explain: why, shuffle: true,
      options: opts.map((o, i) => [IDS[i], o]), correct: IDS[ok],
      column: opts.some((o) => plain(o).length > 24),
    }),
    on: (ev, c) => {
      if (ev.type === 'quiz' && !ev.ok) c.warn('Bu sefer olmadı. Açıklamayı okuyun ve başka bir seçeneği deneyin.');
      return ev.type === 'quiz' && ev.ok;
    },
    done: done || 'Doğru!',
  };
}

// Rehber panelinde soru (masaüstü ve Not Defteri dersleri): öğrenci yandaki pencereye bakıp cevabı seçer
export function rehberSoru({ title, html, opts, ok, why, wrong, hint, setup }) {
  return {
    title, hint,
    html: `${html}<div class="rs-opts">${opts.map((o, i) => `<button type="button" class="btn" data-i="${i}">${o}</button>`).join('')}</div>`,
    setup: (c) => {
      setup?.(c);
      document.querySelector('#stepBody .rs-opts').onclick = (e) => {
        const b = e.target.closest('[data-i]');
        if (!b || b.disabled) return;
        if (+b.dataset.i === ok) { b.classList.add('right'); c.complete(); } else { b.classList.add('wrong'); b.disabled = true; c.warn(wrong || 'Bu değil. Yandaki pencereye tekrar bakın.'); }
      };
    },
    on: () => false,
    done: why,
  };
}

// Not Defteri'nde hedef yazıyı yazdıran adım. must: yazılması zorunlu parçalar (büyük-küçük harf ve işaretler dahil)
export function yaz({ title, html, target, must, keys, hint, done }) {
  const squash = (s) => s.replace(/[ \t]+/g, ' ').trim();
  const ok = must ? (l) => must.every((m) => l.includes(m)) : (l) => squash(l).includes(target);
  return {
    title, target, keys, hint, done,
    html: html || '<p>Yeni bir satıra yazın:</p>',
    on: (ev, c) => {
      if (ev.type !== 'input') return false;
      const ls = lines(c.np.value);
      if (ls.some(ok)) return true;
      if (ev.inputType === 'insertLineBreak' && ls.some((l) => l && closeEnough(l, target))) c.warn('Neredeyse oldu! Yazdığınızı hedefle harf harf karşılaştırın; büyük harfleri, Türkçe harfleri ve işaretleri kontrol edin.');
      return false;
    },
  };
}
