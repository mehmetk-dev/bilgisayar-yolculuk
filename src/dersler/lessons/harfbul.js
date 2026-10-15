// 2. hafta: tuşların yerini hiç bilmeyenler için harf bulma alıştırması.
// Ekranda büyük bir harf çıkar; öğrenci klavyede bulup basar. Takılınca ekrandaki klavyede tuş yanar.
// Yanlış basılan ya da geç bulunan tuşlar sıranın sonuna yeniden eklenir.
import { keyLabel } from '../keyboard.js';
import { info } from './kalip.js';

const ROWS = {
  temel: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ust: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
  alt: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'],
  rakam: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
};
const HELP_AFTER = 6000; // bu kadar sürede bulunamazsa tuş ekrandaki klavyede yanar
const SLOW = 4; // saniye: bundan uzun sürerse tuş bir kez daha sorulur
const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const label = (code) => keyLabel(code);

// Alıştırma sahnesi: codes içindeki tuşlar karışık sırayla (her biri `times` kez) sorulur
function drill(codes, times = 1) {
  return (el, c) => {
    el.className = 'sc sc-drill';
    const queue = shuffle(Array.from({ length: times }, () => codes).flat());
    const total = queue.length;
    let cur = null, t0 = 0, helpTimer = 0, wrong = 0, doneN = 0;
    el.innerHTML = `<div class="dr-card"><div class="dr-key"></div><div class="dr-msg">Klavyede bu harfi bulup basın</div></div>
      <div class="dr-bar"><i></i></div><div class="dr-count"></div>`;
    const $ = (s) => el.querySelector(s);
    const help = () => { c.kb.want([cur]); $('.dr-msg').innerHTML = 'İpucu: aşağıdaki klavyede <b>sarı</b> yanan tuş.'; };
    function nextKey() {
      clearTimeout(helpTimer);
      c.kb.want([]);
      if (!queue.length) {
        cur = null;
        $('.dr-key').textContent = '🎉';
        $('.dr-msg').textContent = 'Hepsini buldunuz!';
        c.emit('drill-done');
        return;
      }
      cur = queue.shift();
      wrong = 0;
      t0 = performance.now();
      const k = $('.dr-key');
      k.textContent = label(cur);
      k.classList.remove('ok', 'bad');
      $('.dr-msg').textContent = 'Klavyede bu harfi bulup basın';
      $('.dr-bar i').style.width = (doneN / total * 100) + '%';
      $('.dr-count').textContent = `${doneN} / ${total}`;
      helpTimer = setTimeout(help, HELP_AFTER);
    }
    const onKey = (e) => {
      if (!el.isConnected) { removeEventListener('keydown', onKey, true); return; }
      if (!cur || e.repeat || e.ctrlKey || e.altKey || e.metaKey || /^(Shift|Caps|Tab|Escape|F\d)/.test(e.code)) return;
      e.preventDefault();
      const k = $('.dr-key');
      if (e.code === cur) {
        const sn = (performance.now() - t0) / 1000;
        const L = (c.L.times ||= {});
        L[cur] = Math.max(L[cur] || 0, sn);
        // Zorlanılan tuş bir kez daha, birkaç tuş sonra sorulur
        if ((wrong || sn > SLOW) && !queue.slice(0, 3).includes(cur)) { queue.splice(Math.min(3, queue.length), 0, cur); }
        else doneN++;
        k.classList.add('ok');
        $('.dr-msg').textContent = sn < 2 ? 'Çok hızlı! 👏' : 'Doğru!';
        cur = null;
        setTimeout(nextKey, 450);
      } else {
        wrong++;
        (c.L.wrong ||= {})[cur] = (c.L.wrong[cur] || 0) + 1;
        k.classList.remove('bad'); void k.offsetWidth; k.classList.add('bad');
        $('.dr-msg').innerHTML = `Bu <b>${label(e.code)}</b> tuşuydu. Tekrar deneyin.`;
        if (wrong >= 2) help();
      }
    };
    addEventListener('keydown', onKey, true);
    c.s.off = () => { removeEventListener('keydown', onKey, true); clearTimeout(helpTimer); c.kb.want([]); };
    nextKey();
  };
}

const adim = (title, html, codes, times) => ({
  title, html, scene: drill(codes, times),
  on: (ev) => ev.type === 'drill-done',
  leave: (c) => c.s.off?.(),
  done: 'Bu sıradaki tuşları buldunuz.',
});

export const harfbul = {
  id: 'harfbul', icon: '🔤', title: 'Harf bulma alıştırması', minutes: 20, stage: 'scene', keyboard: true,
  desc: 'Ekranda çıkan harfi klavyede bulun; zorlandığınız harfler tekrar sorulur.',
  summary: [
    ['Temel sıra', 'A S D F G H J K L Ş İ: parmakların beklediği sıra'],
    ['Üst sıra', 'Q W E R T Y U I O P Ğ Ü'],
    ['Alt sıra', 'Z X C V B N M Ö Ç'],
    ['Rakamlar', 'Harflerin üstündeki sıra: 1 2 3 … 0'],
    ['İpucu', 'F ve J tuşlarındaki küçük çıkıntılar işaret parmaklarının yeridir'],
  ],
  steps: [
    {
      title: 'Harfleri bulalım',
      html: `<p>Klavyedeki harfler alfabe sırasıyla dizili değildir; yerlerini ezberlemek biraz zaman alır. Bu alıştırma bunun içindir.</p>
        <ul class="big-list"><li>Sağda büyük bir harf çıkacak. Klavyenizde o harfi bulup <b>bir kez</b> basın.</li>
        <li>Bulamazsanız birkaç saniye sonra aşağıdaki klavyede <b>sarı</b> yanar.</li>
        <li>Acele etmeyin; zorlandığınız harfler bir kez daha sorulur.</li></ul>`,
      scene: info('<div class="sc-big">A ➜ ⌨</div><p>Harf bulma</p>'),
    },
    adim('Temel sıra', '<p>Önce ortadaki sıra: parmakların beklediği yer. Sağda çıkan harfi klavyede bulun.</p>', ROWS.temel, 2),
    adim('Üst sıra', '<p>Şimdi bir üst sıra: Q ile başlayan sıra.</p>', ROWS.ust, 2),
    adim('Alt sıra', '<p>En alttaki harf sırası: Z ile başlayan sıra.</p>', ROWS.alt, 2),
    adim('Rakamlar', '<p>Harflerin üstündeki rakam sırası.</p>', ROWS.rakam, 1),
    adim('Karışık', '<p>Son tur: bütün harfler karışık. Bakalım ne kadar hızlısınız!</p>', [...ROWS.temel, ...ROWS.ust, ...ROWS.alt], 1),
    {
      final: true, title: 'Tebrikler! 🎉',
      html: (c) => {
        // Zorluk puanı: en uzun bulma süresi + her yanlış basış için 3 saniye
        const t = c.L.times || {}, w = c.L.wrong || {};
        const slow = Object.keys(t).map((k) => [k, t[k] + 3 * (w[k] || 0)]).filter(([, s]) => s > 2).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return `<p>Klavyedeki harflerin hepsini buldunuz.</p>${slow.length ? `<p>En çok zorlandığınız harfler: ${slow.map(([k]) => `<kbd>${label(k)}</kbd>`).join(' ')}. Bir dahaki sefere bunlara dikkat edin.</p>` : '<p>Hiçbir harfte takılmadınız! 🌟</p>'}
          <p>Bu alıştırmayı her ders başında birkaç dakika tekrar etmek çok faydalıdır.</p>`;
      },
      scene: info('<div class="sc-big">⌨🏆</div>'),
    },
  ],
};
