// Ek bölümler (3): Top Sektir (pinpon) ve Yarış Pisti (iki oyunculu oyun)
import { sp, blk, V, R, J, touch, cmp, has } from './sh.js';

const Y = { r: 'y' };
const X = { r: 'x' };

// --- Top sektir ---
const PONG_SETUP = (extra = []) => ({ backdrop: 'cayir', vars: { skor: 0, hız: 5 }, sprites: [sp('Top', 'top', 0, 0), sp('Raket', 'sepet', 0, -150), ...extra] });
const PONG_BLOCKS = ['flag', 'forever', 'if', 'move', 'bounce', 'point', 'goto', 'setx', 'chx', 'chy', 'sound', 'sayFor', 'say', 'stop', 'setv', 'chv', 'wait'];
const PONG_REP = ['mx', 'rand', 'var'];
const HIT = [['point', R(-40, 40)], ['chy', 10], ['sound', 'pop']];
const topScript = (speed, hit = HIT, extra = [], init = []) => [[['flag'], ...init, ['goto', 0, 0], ['point', 160], ['forever', [['move', speed], ['bounce'], ['if', touch('Raket'), hit], ...extra]]]];
const BALL1 = [[['flag'], ['goto', 0, 0], ['point', 160], ['forever', [['move', 6], ['bounce']]]]];
const RAKET = [[['flag'], ['goto', 0, -150], ['forever', [['setx', { r: 'mx' }]]]]];
const MISS = ['if', cmp(Y, '<', -140), [['sound', 'boing'], ['say', 'Oyun bitti!'], ['stop']]];
// Test: raket topun altında durur; belli bir andan sonra topun karşı tarafına kaçar
const chase = (until, away = true) => Array.from({ length: 300 }, (_, i) => ['fn', 0.3 + i * 0.1, (w) => {
  const b = w.sprite('Top');
  w.mouse.x = (away && w.t > until) ? (b.x > 0 ? -200 : 200) : b.x;
}]);

export const b37 = {
  icon: '🏓', color: '#16a34a', title: 'Oyun 6: Top Sektir', concept: 'Sekme + çarpışma',
  desc: 'Pinpon tarzı klasik oyun: topu raketle sektir, skor topla, kaçırırsan oyun biter. Top her sekişte hızlansın!',
  learned: ['“Kenara geldiyse sek” bloğu bir kuklanın duvardan geri dönmesini sağlar.', 'Çarpışmada yönü değiştirmek (rastgele bir yöne “dön”) oyunu her seferinde farklı yapar.', 'Hız bir değişken olursa oyun zamanla zorlaşır.'],
  teacher: '<b>Sınıf pinpon:</b> Öğrenciler ikişerli karşılıklı otursun, bir buruşuk kâğıt topu masadan masaya atsın. “Top duvara çarpınca geri döner, rakete çarpınca yönü değişir” kuralını canlandırın. Sonra sorun: “Top hızlanırsa oyun kolaylaşır mı, zorlaşır mı?” Zorluk ayarı üzerine konuşun (Elma Yakala bölümündeki gibi).',
  steps: [
    { type: 'story', anim: 'wave', title: 'Pinpon zamanı! 🏓',
      text: '<p>Efsane oyunlardan birini yapıyoruz: top ekranda sekiyor, sen raketle onu kaçırmadan geri yolluyorsun!</p><ol class="tips"><li><b>Top</b> hep hareket eder, duvarlardan sekmesini sağlayacağız.</li><li><b>Raket</b> fareyi takip eder.</li><li>Raketten sekince <b>skor</b> artar.</li><li>Topu <b>kaçırırsan</b> oyun biter.</li><li>Top her sekişte <b>hızlanır</b>!</li></ol>',
      pics: ['⚽', '🧱', '🧺', '⭐', '⚡'] },
    { type: 'scratch', title: '1. adım: Top sekiyor',
      text: `<p>Top: 🏁 → x: 0 y: 0'a git → <b>160 yönüne dön</b> → sürekli tekrarla [6 adım git, ${blk('motion', 'kenara geldiyse sek')}]. Top duvarlardan sekip ekranda kalmalı!</p>`,
      setup: PONG_SETUP(), blocks: PONG_BLOCKS, reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: touch('Raket'), edit: 'Top',
      goals: [{ t: '“kenara geldiyse sek” kullan', use: 'bounce' }, { t: 'Top en az 3 kez duvardan sekip yön değiştirsin', f: (a) => { const d = a.sp('Top').dir; if (a.mem.d !== undefined && Math.abs(d - a.mem.d) > 20) a.mem.n = (a.mem.n || 0) + 1; a.mem.d = d; return a.mem.n >= 3; } }],
      hint: '🏁 → x: 0 y: 0 konumuna git → 160 yönüne dön → sürekli tekrarla [6 adım git, kenara geldiyse sek].',
      sol: { Top: BALL1 } },
    { type: 'quiz', title: 'Hangi blok?',
      q: 'Top ekranın kenarına çarpınca <b>geri dönsün</b> istiyoruz. Hangi blok işe yarar?',
      opts: ['kenara geldiyse sek', 'sonraki kostüm', 'x\'i 10 değiştir'], a: 0,
      ok: 'Bu blok kuklayı kenardan döndürür; yönü de buna göre değiştirir. Scratch\'te pek çok oyun bu bloğu kullanır.' },
    { type: 'scratch', title: '2. adım: Raket fareyi takip etsin',
      text: `<p>Raket: 🏁 → x: 0 y: -150'ye git → sürekli tekrarla [${blk('motion', 'x\'i (fare x) yap')}]. Sayı kutusundaki ▾ düğmesinden <b>fare x</b>'i seç. Fareni sağa sola götür!</p>`,
      setup: PONG_SETUP(), blocks: PONG_BLOCKS, reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: touch('Raket'), edit: 'Raket', keep: true,
      goals: [{ t: '“fare x” kullan', f: (a) => has(a, 'Raket', '"r":"mx"') }, { t: 'Raket sağa ve sola gitsin', f: (a) => { const x = a.sp('Raket').x; if (x > 80) a.mem.r = 1; if (x < -80) a.mem.l = 1; return a.mem.r && a.mem.l; } }],
      sol: { Top: BALL1, Raket: RAKET },
      play: [['mouse', 150, 0, 1], ['mouse', -150, 0, 2]] },
    { type: 'scratch', title: '3. adım: Raketten sek!',
      text: '<p>Topun döngüsüne bir kural ekle: <b>eğer Raket\'e dokunuyorsa</b> → <b>(rastgele -40 ile 40) yönüne dön</b> (yukarı doğru!) → y\'yi 10 değiştir → pop sesi. Topu raketle sektir!</p><p class="mut">0 yönü yukarıdır. Rastgele bir yön, topun her seferinde farklı bir yöne gitmesini sağlar.</p>',
      setup: PONG_SETUP(), blocks: PONG_BLOCKS, reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: touch('Raket'), edit: 'Top', keep: true, testTime: 20,
      goals: [{ t: 'Rakete değince yön değişsin', f: (a) => has(a, 'Top', '"o":"Raket"') }, { t: 'Topu en az 3 kez sektir 🏓', f: (a) => a.sounds('pop') >= 3 }],
      hint: 'sürekli tekrarla [6 adım git, kenara geldiyse sek, eğer Raket\'e dokunuyorsa [(rastgele -40 ile 40) yönüne dön, y\'yi 10 değiştir, pop sesi]].',
      sol: { Top: topScript(6), Raket: RAKET }, play: chase(1e9, false) },
    { type: 'scratch', title: '4. adım: Skor ve “Oyun bitti”',
      text: `<p>Her sekişte <b>skoru 1 değiştir</b> (🏁'ta skoru 0 yap). Raketi kaçırınca top aşağı iner: <b>eğer y &lt; -140 ise</b> → boing sesi → “Oyun bitti!” de → tümünü durdur.</p>`,
      setup: PONG_SETUP(), blocks: PONG_BLOCKS, reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: cmp(Y, '<', -140), edit: 'Top', keep: true, testTime: 40,
      goals: [{ t: 'Her sekişte skor artsın', f: (a) => a.vars.skor >= 3 }, { t: 'Top kaçınca “Oyun bitti!” desin', f: (a) => a.said('oyun bitti', 'Top') }],
      hint: 'Rakete dokununca ayrıca “skoru 1 değiştir”. Döngüye bir kural daha: eğer (y konumu) < -140 ise [boing sesi, Oyun bitti! de, tümünü durdur].',
      sol: { Top: topScript(6, [...HIT, ['chv', 'skor', 1]], [MISS], [['setv', 'skor', 0]]), Raket: RAKET }, play: chase(12) },
    { type: 'scratch', title: '5. adım: Hızlanan top ⚡',
      text: '<p>Oyun zorlaşsın! 🏁\'ta <b>hız</b> değişkenini 5 yap. Topun <b>(hız) adım git</b> yapmasını sağla; her sekişte <b>hızı 0.5 değiştir</b>.</p>',
      setup: PONG_SETUP(), blocks: PONG_BLOCKS, reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: cmp(Y, '<', -140), edit: 'Top', keep: true, testTime: 30,
      goals: [{ t: 'Adım sayısı için hız değişkenini kullan', f: (a) => has(a, 'Top', '"op":"move","args":{"n":{"r":"var","v":"hız"}}') }, { t: 'Top hızlansın', f: (a) => a.vars.hız >= 6.5 }],
      hint: 'move bloğunun sayı kutusundan ▾ ile “değişken” → hız seç. Rakete dokununca: hız değişkenini 0.5 değiştir.',
      sol: { Top: topScript(V('hız'), [...HIT, ['chv', 'skor', 1], ['chv', 'hız', 0.5]], [MISS], [['setv', 'skor', 0], ['setv', 'hız', 5]]), Raket: RAKET }, play: chase(1e9, false) },
    { type: 'scratch', title: '⭐ Kendi pinpon oyunun',
      text: '<p>Oyunu geliştir! İkinci bir top ekle, raketi küçült ya da arka planı değiştir. Zor bir fikir: <b>can</b> ekle; kaçırınca oyun hemen bitmesin, 3 canın olsun! Hazır olunca ✔ Bitirdim.</p>',
      setup: PONG_SETUP(), blocks: PONG_BLOCKS.concat(['size', 'chsize', 'backdrop', 'show', 'hide']), reporters: PONG_REP, conds: ['touch', 'cmp'], condDefault: cmp(Y, '<', -140), library: true, free: true, keep: true,
      goals: [{ t: 'Skor tut', use: 'chv' }, { t: 'Top sekebilsin', use: 'bounce' }],
      sol: { Top: topScript(V('hız'), [...HIT, ['chv', 'skor', 1], ['chv', 'hız', 0.5]], [MISS], [['setv', 'skor', 0], ['setv', 'hız', 5]]), Raket: RAKET }, play: chase(1e9, false) },
  ],
};

// --- Yarış pisti ---
const RACE_SETUP = (extra = [], vars = {}) => ({ backdrop: 'cayir', vars, sprites: [sp('Bayrak', 'bayrak', 205, 0, { size: 200 }), ...extra, sp('Kedi', 'kedi', -200, 50), sp('Köpek', 'kopek', -200, -50)] });
const RACE_BLOCKS = ['flag', 'key', 'forever', 'if', 'chx', 'goto', 'sound', 'sayFor', 'say', 'stop', 'setv', 'chv', 'wait', 'next'];
const FINISH = (name) => ['if', cmp(X, '>', 150), [['sound', 'kazandin'], ['say', `${name} kazandı!`], ['stop']]];
const kedi = (go, extra = []) => [[['flag'], ['goto', -200, 50], ['forever', [FINISH('Kedi'), ...extra]]], [['key', 'd'], ...go]];
const kopek = (go, extra = []) => [[['flag'], ['goto', -200, -50], ['forever', [FINISH('Köpek'), ...extra]]], [['key', 'right'], ...go]];
const D8 = [['chx', 8]];
const GATE = [['if', cmp(V('başla'), '=', 1), [['chx', 8]]]];
const COUNT = [[['flag'], ['setv', 'başla', 0], ['sayFor', '3', 1], ['sayFor', '2', 1], ['sayFor', '1', 1], ['sayFor', 'Başla!', 1], ['setv', 'başla', 1]]];

export const b38 = {
  icon: '🏁', color: '#f59e0b', title: 'Oyun 7: Yarış Pisti', concept: 'İki oyunculu oyun',
  desc: 'Kedi ve Köpek yarışıyor! İki oyuncu iki tuşa hızlı basar, ilk bitirene kazandı ilan edilir. Geri sayımla başlasın!',
  learned: ['Bir oyunu iki kişi aynı klavyede oynayabilir: her oyuncunun kendi tuşu vardır.', 'Bir koşulu (ör. x > 150) sürekli kontrol ederek “yarış bitti mi?” diye bakarız.', 'Bir değişken “şalter” gibi çalışabilir: başla = 0 iken yarışçılar koşamaz, 1 olunca koşar.'],
  teacher: '<b>Gerçek yarış:</b> Sınıfta iki öğrenci yan yana dursun; öğretmen “3, 2, 1, başla!” desin. Başla demeden hareket eden “erken başlamış” sayılır (şalter = başla değişkeni!). Sonra “Kim kazandı? Bunu bilgisayar nasıl anlar?” diye sorun: sürekli kontrol edilen koşul (bitiş çizgisine varış). Bilgisayar başında ikişerli oynatıp kazananı not edin.',
  steps: [
    { type: 'story', anim: 'dance', title: 'Hazır, set, başla! 🏁',
      text: '<p>İki kişilik bir yarış oyunu yapıyoruz! Kedi ile Köpek yarışacak:</p><ol class="tips"><li><b>Kedi</b> için <b>d</b> tuşu: her basışta ilerler.</li><li><b>Köpek</b> için <b>sağ ok</b>: her basışta ilerler.</li><li>İlk bitiş çizgisine varan <b>kazanır</b>.</li><li>Yarış <b>3-2-1</b> geri sayımıyla başlar!</li></ol><p class="mut">İki arkadaş aynı klavyede oynasın: biri d tuşuna, biri sağ ok tuşuna hızlı hızlı bassın.</p>',
      pics: ['🐱', '🐶', '🏁', '⏱️', '🏆'] },
    { type: 'scratch', title: '1. adım: Kedi koşsun',
      text: `<p>Kedi: ${blk('events', 'd tuşuna basılınca', 1)} → <b>x'i 8 değiştir</b>. Ayrıca 🏁 → x: -200 y: 50'ye git, böylece her seferinde başlangıçta olur.</p><p class="mut">Sahneye tıkla ve d tuşuna hızlı hızlı bas!</p>`,
      setup: RACE_SETUP(), blocks: RACE_BLOCKS, reporters: ['var'], conds: ['cmp', 'key'], condDefault: cmp(X, '>', 150), edit: 'Kedi',
      goals: [{ t: '“d tuşuna basılınca” betiği yaz', f: (a) => a.hats('key', 'Kedi') >= 1 }, { t: 'Kedi sağa doğru koşsun', f: (a) => a.sp('Kedi').x > 100 }],
      hint: 'Betik 1: 🏁 → x: -200 y: 50 konumuna git. Betik 2: d tuşuna basılınca → x\'i 8 değiştir.',
      sol: { Kedi: [[['flag'], ['goto', -200, 50]], [['key', 'd'], ...D8]] }, play: [['hold', 'd', 0.5, 7]] },
    { type: 'scratch', title: '2. adım: Köpek de koşsun',
      text: `<p>Şimdi Köpek: ${blk('events', 'sağ ok tuşuna basılınca', 1)} → x'i 8 değiştir. 🏁 → x: -200 y: -50'ye git. İki arkadaş yarışsın!</p>`,
      setup: RACE_SETUP(), blocks: RACE_BLOCKS, reporters: ['var'], conds: ['cmp', 'key'], condDefault: cmp(X, '>', 150), edit: 'Köpek', keep: true,
      goals: [{ t: 'Köpek için “sağ ok” betiği yaz', f: (a) => a.hats('key', 'Köpek') >= 1 }, { t: 'İki kukla da sağa doğru koşsun', f: (a) => a.sp('Kedi').x > 100 && a.sp('Köpek').x > 100 }],
      sol: { Kedi: [[['flag'], ['goto', -200, 50]], [['key', 'd'], ...D8]], Köpek: [[['flag'], ['goto', -200, -50]], [['key', 'right'], ...D8]] },
      play: [['hold', 'd', 0.5, 7], ['hold', 'right', 0.5, 7]] },
    { type: 'quiz', title: 'Adil mi?',
      q: 'Kedi her basışta <b>8 adım</b>, Köpek her basışta <b>5 adım</b> ilerlerse yarış adil olur mu?',
      opts: ['Hayır, Kedi hep avantajlı olur', 'Evet, adil olur', 'Fark etmez, kazanan hep Köpek olur'], a: 0,
      ok: 'İki oyuncu için adımlar aynı olmalı ki yarış adil olsun. Bu yüzden ikisine de 8 yazdık.' },
    { type: 'scratch', title: '3. adım: Kim kazandı? 🏆',
      text: `<p>İkisinin de 🏁 betiğine bir bitiş kuralı ekle: 🏁 → konuma git → sürekli tekrarla [<b>eğer x &gt; 150 ise</b> → “kazandın” sesi → <b>“Kedi kazandı!”</b> de → tümünü durdur]. Köpek için de <b>“Köpek kazandı!”</b> yaz.</p>`,
      setup: RACE_SETUP(), blocks: RACE_BLOCKS, reporters: ['var'], conds: ['cmp', 'key'], condDefault: cmp(X, '>', 150), edit: 'Kedi', keep: true, testTime: 15,
      goals: [{ t: 'İki yarışçı için bitiş kuralı (x konumu)', f: (a) => has(a, 'Kedi', '"r":"x"') && has(a, 'Köpek', '"r":"x"') }, { t: 'İlk bitiren “kazandı” desin', f: (a) => a.said('kazandı') }],
      hint: 'Kedi: 🏁 → x: -200 y: 50\'ye git → sürekli tekrarla [eğer (x konumu) > 150 ise [kazandın sesi, Kedi kazandı! de, tümünü durdur]]. Köpek için aynısı.',
      sol: { Kedi: kedi(D8), Köpek: kopek(D8) }, play: [['hold', 'd', 0.5, 7], ['hold', 'right', 0.5, 4]] },
    { type: 'scratch', title: '4. adım: 3-2-1 başla! ⏱️',
      text: `<p>Robo sunucu olsun: 🏁 → <b>başla değişkenini 0 yap</b> → “3”, “2”, “1”, “Başla!” de (her biri 1 saniye) → <b>başla değişkenini 1 yap</b>.</p><p>Yarışçılar yalnızca <b>eğer başla = 1 ise</b> ilerlesin: tuş betiğindeki <b>x'i 8 değiştir</b> bloğunu bir “eğer” içine koy.</p>`,
      setup: RACE_SETUP([sp('Robo', 'robo', 0, 110, { size: 70 })], { başla: 0 }), blocks: RACE_BLOCKS, reporters: ['var'], conds: ['cmp', 'key'], condDefault: cmp(V('başla'), '=', 1), edit: 'Robo', keep: true, testTime: 18,
      goals: [{ t: 'Robo 3, 2, 1 ve Başla desin', f: (a) => ['3', '2', '1', 'başla'].every((t) => a.said(t, 'Robo')) }, { t: 'Yarışçılar “başla” değişkenine bakıp koşsun', f: (a) => has(a, 'Kedi', '"v":"başla"') && has(a, 'Köpek', '"v":"başla"') }, { t: 'Yarış bitince kazanan söylensin', f: (a) => a.said('kazandı') }],
      hint: 'Robo: 🏁 → başla = 0 → (3) de 1 saniye … → (Başla!) de 1 saniye → başla = 1. Kedi ve Köpek: d (ya da sağ ok) tuşuna basılınca → eğer (başla) = 1 ise [x\'i 8 değiştir].',
      sol: { Robo: COUNT, Kedi: kedi(GATE), Köpek: kopek(GATE) }, play: [['hold', 'd', 0.5, 14], ['hold', 'right', 0.5, 9]] },
    { type: 'scratch', title: '⭐ Kendi yarışın',
      text: '<p>Yarışı değiştir! Yeni bir yarışçı ekle (✚ ile balık, kuş, arı…) ve ona bir tuş ver. Ya da yarışçılara rastgele hız ver: <b>x\'i (rastgele 4 ile 12) değiştir</b>. Şansın payı olsun! Hazır olunca ✔ Bitirdim.</p>',
      setup: RACE_SETUP([sp('Robo', 'robo', 0, 110, { size: 70 })], { başla: 0 }), blocks: RACE_BLOCKS.concat(['gotoRand', 'turnR', 'size']), reporters: ['var', 'rand'], conds: ['cmp', 'key'], condDefault: cmp(X, '>', 150), library: true, free: true, keep: true,
      goals: [{ t: 'En az iki oyuncu için tuş betiği', f: (a) => a.hats('key') >= 2 }, { t: 'Bir bitiş kuralı olsun', use: 'stop' }],
      sol: { Robo: COUNT, Kedi: kedi(GATE), Köpek: kopek(GATE) }, play: [['hold', 'd', 0.5, 14], ['hold', 'right', 0.5, 9]] },
  ],
};
