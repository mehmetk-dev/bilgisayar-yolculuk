// Ek ders: yazma hızı ölçümü. Sonuçlar öğrencinin profilinde saklanır (c.log), haftadan haftaya karşılaştırılır.
import { K } from './common.js';
import { esc } from '../dialog.js';

// Benzer uzunlukta metinler sırayla gelir; her ölçümde aynı metni ezberlemek olmasın
const METINLER = [
  'Sabah erkenden kalktım ve pencereyi açtım. Hava çok güzeldi. Kahvaltıdan sonra parka yürüdüm, kuşları dinledim. Öğleden sonra kızım ve torunlarım bize geldi.',
  'Pazar günü markete gittim. Domates, peynir, ekmek ve biraz meyve aldım. Kasada sıra uzundu ama beklerken komşumla sohbet ettim. Eve dönünce çay demledim.',
  'Bugün bilgisayar dersinde klavyeyi öğrendik. Önce parmaklarımızı temel sıraya koyduk. Sonra yavaşça kelimeler yazdık. Her gün biraz çalışırsam daha hızlı yazacağım.',
];

const words = (s) => s.trim().split(/\s+/).filter(Boolean);
const metin = (c) => METINLER[c.logs.length % METINLER.length];

// Doğru yazılan kelime sayısı: atlanan ya da fazladan yazılan bir kelime sonrakileri bozmasın diye en uzun ortak dizi
function matched(a, b) {
  const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
  return d[a.length][b.length];
}

function yorum(r) {
  if (r.acc < 90) return 'Hatalar biraz fazla. Acele etmeyin: önce doğru, sonra hızlı. Parmaklarınızı temel sırada tutmaya çalışın.';
  if (r.wpm < 10) return 'İyi bir başlangıç! Her gün birkaç dakika yazmak hızınızı artırır.';
  if (r.wpm < 20) return 'Güzel! Günlük işler için rahat bir hız.';
  if (r.wpm < 30) return 'Çok iyi! Klavyeyi rahat kullanıyorsunuz.';
  return 'Harika! Hızlı ve doğru yazıyorsunuz.';
}

const fmtSure = (t) => (t >= 60 ? `${Math.floor(t / 60)} dk ${t % 60} sn` : `${t} sn`);

export const hiz = {
  id: 'hiz', icon: '⏱', title: 'Yazma hızı ölçümü', minutes: 10, stage: 'notepad',
  desc: 'Kısa bir metni yazın; dakikada kaç kelime yazdığınız ve kaç hata yaptığınız ölçülür. Her hafta tekrar edip ilerlemenizi görün.',
  steps: [
    {
      title: 'Yazma hızınızı ölçelim',
      html: `<ul class="big-list"><li>Bir sonraki adımda kısa bir metin göreceksiniz. Not Defteri'ne <b>aynısını</b> yazın.</li>
        <li>Süre, <b>ilk tuşa bastığınızda</b> başlar. Acele etmeyin; hazır olunca başlayın.</li>
        <li>Bitince ${K('Enter')} tuşuna basın.</li>
        <li>Hata yaparsanız düzeltebilirsiniz; ama hızdan önce <b>doğru yazmak</b> önemlidir.</li></ul>
        <p class="mut">Sonuçlarınız saklanır. Bu ölçümü her hafta yaparak ilerlemenizi görebilirsiniz.</p>`,
    },
    {
      title: 'Yazın',
      html: (c) => `<p>Not Defteri'ne tıklayın ve bu metni yazın. Bitince ${K('Enter')}:</p><div class="target">${esc(metin(c))}</div>`,
      hint: 'Büyük harf için Shift, nokta için sağ alttaki <kbd>.</kbd> tuşu, virgül için İ\'nin sağındaki tuş.',
      setup: (c) => { c.np.setText(''); c.np.focus(); },
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        if (ev.inputType === 'insertFromPaste') {
          c.np.setText('');
          c.s.t = 0;
          c.warn('Yapıştırmak olmaz: ölçüm için metni klavyeden yazmalısınız. Baştan başlayın.');
          return false;
        }
        if (!c.s.t && c.np.value.trim()) c.s.t = performance.now();
        const hedef = words(metin(c)), yazilan = words(c.np.value);
        const bitti = ev.inputType === 'insertLineBreak' ? yazilan.length >= hedef.length * 0.7 : false;
        if (!bitti) return false;
        const sn = Math.max(1, Math.round((performance.now() - c.s.t) / 1000));
        const dogru = matched(hedef, yazilan);
        const r = { wpm: Math.round(dogru / (sn / 60)), acc: Math.round((dogru / hedef.length) * 100), err: Math.max(hedef.length, yazilan.length) - dogru, sn };
        c.log(r);
        c.L.r = r;
        return true;
      },
      done: (c) => `<br>Dakikada <b>${c.L.r.wpm} kelime</b> · ${c.L.r.err} hatalı kelime · süre ${fmtSure(c.L.r.sn)}.<br>${yorum(c.L.r)}`,
    },
    {
      final: true, title: 'Sonuçlarınız',
      html: (c) => {
        const L = c.logs;
        if (!L.length) return '<p>Henüz ölçüm yok.</p>';
        const ilk = L[0], son = L.at(-1), fark = son.wpm - ilk.wpm;
        const satir = (r) => `<tr><th>${new Date(r.at).toLocaleDateString('tr-TR')}</th><td>${r.wpm} kelime/dk · %${r.acc} doğru · ${fmtSure(r.sn)}</td></tr>`;
        return `<div class="score"><b>${son.wpm}</b><span>kelime / dakika</span></div>
          ${L.length > 1 ? `<p>İlk ölçümünüzden bu yana: <b>${fark >= 0 ? '+' : ''}${fark} kelime/dk</b>${fark > 0 ? ' 🎉' : ''}</p>` : '<p>Bu ilk ölçümünüz. Gelecek hafta tekrar yapıp karşılaştırın.</p>'}
          <table class="sum rep">${L.slice(-8).reverse().map(satir).join('')}</table>
          <p class="mut">Bilgisayara yeni başlayanlar için dakikada 10–20 kelime iyi bir hızdır.</p>`;
      },
    },
  ],
};
