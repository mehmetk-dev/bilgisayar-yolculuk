// Ek bölümler (5): Kovalamaca (takip eden düşman) ve Kronometre ve Geri Sayım (zaman + değişken + operatör)
import { sp, blk, V, R, J, touch, key, cmp, has } from './sh.js';

const TIMER = { r: 'timer' };

// --- Oyun 8: Kovalamaca ---
// Değişkenler: skor (toplanan yıldız), hız (arının adım sayısı)
const KV_SETUP = (extra = [], vars = { skor: 0 }) => ({ backdrop: 'cayir', vars, sprites: [sp('Yıldız', 'yildiz', 120, 60, { size: 80 }), ...extra, sp('Arı', 'ari', 180, 110), sp('Kedi', 'kedi', 0, 0, { size: 70 })] });
const KV_BLOCKS = ['flag', 'forever', 'if', 'chx', 'chy', 'goto', 'move', 'pointTo', 'sound', 'say', 'sayFor', 'stop', 'setv', 'chv', 'wait'];
const POS = [R(-200, 200), R(-140, 140)];
const MOVE4 = [['if', key('right'), [['chx', 5]]], ['if', key('left'), [['chx', -5]]], ['if', key('up'), [['chy', 5]]], ['if', key('down'), [['chy', -5]]]];
const KEDI = [[['flag'], ['goto', 0, 0], ['forever', MOVE4]]];
const SKOR0 = ['setv', 'skor', 0];
const PICK = ['if', touch('Kedi'), [['chv', 'skor', 1], ['sound', 'pop'], ['goto', ...POS]]];
const YILDIZ = [[['flag'], SKOR0, ['goto', ...POS], ['forever', [PICK]]]];
const CAUGHT = (msg) => ['if', touch('Kedi'), [['sound', 'boing'], ['say', msg], ['stop']]];
const ARI0 = [180, 110];
// Arı: kediye doğru dön + adım git; init/extra ile zorluk ve yakalama eklenir
const ari = (speed, extra = [], init = [], more = []) => [[['flag'], ['goto', ...ARI0], ...init, ['forever', [['pointTo', 'Kedi'], ['move', speed], ...extra]]], ...more];
const RAMP = [['flag'], ['forever', [['wait', 3], ['chv', 'hız', 0.2]]]];
const YAKALANDI = 'Yakalandın!';
const SURE_MSG = J('Yakalandın! Dayandığın süre: ', TIMER);
const base = ['Yıldız', 'Arı', 'Kedi'];
const newSprite = (a, known) => a.w.sprites.some((s) => !s.isClone && !known.includes(s.name) && s.scripts.some((sc) => sc.length > 1));

// Test oyuncusu: 8 yönü bir saniye ileriye deneyip arıdan güvenli kalan ve yıldıza en çok yaklaşanı seçer; 10 olay/sn tuş basılı tutar
const KEYS4 = { right: [1, 0], left: [-1, 0], up: [0, 1], down: [0, -1] };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const steer = (w) => {
  const k = w.sprite('Kedi');
  const b = w.sprite('Arı');
  const s = w.sprite('Yıldız');
  if (!k || !b) return;
  const v = typeof w.vars.hız === 'number' ? w.vars.hız : 1.5;
  let best = null;
  for (const [ax, ay] of DIRS) {
    let x = k.x;
    let y = k.y;
    let bx = b.x;
    let by = b.y;
    let min = 1e9;
    let edge = 0;
    for (let i = 0; i < 45; i++) {
      x = Math.max(-240, Math.min(240, x + ax * 5));
      y = Math.max(-180, Math.min(180, y + ay * 5));
      const d = Math.hypot(x - bx, y - by) || 1;
      bx += (x - bx) / d * v;
      by += (y - by) / d * v;
      min = Math.min(min, Math.hypot(x - bx, y - by));
      edge += Math.max(0, 50 - Math.min(240 - Math.abs(x), 180 - Math.abs(y)));
    }
    const goal = s ? Math.hypot(x - s.x, y - s.y) : 0;
    const wall = Math.min(240 - Math.abs(x), 180 - Math.abs(y));
    const score = (min < 100 ? min - 1000 : 0) - goal * 0.15 + Math.min(min, 150) + Math.min(wall, 70) * 2 - edge * 0.3 - Math.hypot(x / 1.33, y) * 0.5;
    if (!best || score > best.score) best = { score, ax, ay };
  }
  for (const [name, [ax, ay]] of Object.entries(KEYS4)) (best.ax * ax + best.ay * ay > 0 ? w.keyDown(name) : w.keyUp(name));
};
const dodge = (to) => Array.from({ length: Math.round(to * 10) }, (_, i) => ['fn', 0.1 + i * 0.1, steer]);
const onStar = (w) => { const s = w.sprite('Yıldız'); const k = w.sprite('Kedi'); const b = w.sprite('Arı'); if (Math.hypot(s.x - b.x, s.y - b.y) > 110) { k.x = s.x; k.y = s.y; } };
const grab = (n, f = onStar) => Array.from({ length: n }, (_, i) => ['fn', 0.8 + i * 0.7, f]);
const onStar0 = (w) => { const s = w.sprite('Yıldız'); const k = w.sprite('Kedi'); k.x = s.x; k.y = s.y; };

export const b41 = {
  icon: '🐝', color: '#f59e0b', title: 'Oyun 8: Kovalamaca', concept: 'Takip eden düşman',
  desc: 'Kızgın bir arı Kedi\'nin peşinde! Yıldızları topla, yakalanma, ne kadar dayanabildiğine bak. Arı zamanla hızlanır!',
  learned: ['Bir düşman “kuklaya doğru dön” ve “adım git” blokları ile oyuncuyu kovalayabilir.', 'Oyunun zorluğu bir değişkene bağlanırsa (arının hızı) oyun zamanla zorlaşır.', 'Zamanlayıcı, oyunun ne kadar sürdüğünü ölçer; “ne kadar dayandın?” sorusunu cevaplar.'],
  teacher: '<b>Sınıfta kovalamaca:</b> Üç gönüllü çıksın: biri Kedi, biri Arı, biri zamanlayıcı (saniye sayar). Kâğıttan 3 yıldızı sınıfa yerleştirin. Kedi istediği yöne yürüyebilsin; Arı ise sadece kediye doğru dönüp küçük adımlarla yürüsün (“Kedi doğru dön”, “1 adım git”). Arı kediye dokunursa tur biter, zamanlayıcı süreyi söyler. Sonra sorun: “Arı kediden yavaş olmasaydı oyun nasıl olurdu?” ve “Arı her 3 saniyede biraz hızlansa ne olurdu?” Zorluk ayarını konuşun (hız değişkeni!).',
  steps: [
    { type: 'story', anim: 'wave', title: 'Arı peşinde! 🐝',
      text: '<p>Yeni oyunumuzda Kedi\'yi ok tuşlarıyla sen yöneteceksin. Ama dikkat, <b>kızgın bir Arı</b> sürekli onu kovalıyor!</p><ol class="tips"><li><b>Kedi</b> ok tuşlarıyla her yöne gider.</li><li><b>Yıldızlar</b> rastgele yerlerde çıkar; topladıkça <b>skor</b> artar.</li><li><b>Arı</b> hep Kedi\'ye doğru döner ve peşinden gelir.</li><li>Arı yakalarsa <b>oyun biter</b>.</li><li>Arı zamanla <b>hızlanır</b>; zamanlayıcı ne kadar dayandığını söyler.</li></ol>',
      pics: ['🐱', '⭐', '🐝', '⏱️', '🏆'] },
    { type: 'scratch', title: '1. adım: Kedi ok tuşlarıyla gitsin',
      text: `<p>Kedi: 🏁 → x: 0 y: 0'a git → sürekli tekrarla [<b>eğer sağ ok basılı mı? ise</b> x'i 5 değiştir, sol ok için -5, yukarı ok için y'yi 5, aşağı ok için y'yi -5 değiştir].</p><p class="mut">Dört tane “eğer” bloğu gerekecek. Her birinde tuşu değiştirmeyi unutma! Sahneye tıklayıp ok tuşlarına bas.</p>`,
      setup: KV_SETUP(), blocks: KV_BLOCKS, reporters: [], conds: ['key', 'touch'], condDefault: key('right'), edit: 'Kedi',
      goals: [{ t: 'Dört yön için dört “eğer”', f: (a) => a.count('if') >= 4 && has(a, 'Kedi', '"key":"up"') && has(a, 'Kedi', '"key":"left"') }, { t: 'Kedi sağa ve yukarı gitsin', f: (a) => { const k = a.sp('Kedi'); if (k.x > 60) a.mem.r = 1; if (k.y > 60) a.mem.u = 1; return a.mem.r && a.mem.u; } }],
      hint: 'sürekli tekrarla [eğer (sağ ok) basılı mı? ise [x\'i 5 değiştir], eğer (sol ok) … [x\'i -5 değiştir], eğer (yukarı ok) … [y\'yi 5 değiştir], eğer (aşağı ok) … [y\'yi -5 değiştir]].',
      sol: { Kedi: KEDI },
      play: [['hold', 'right', 0.3, 1.2], ['hold', 'up', 1.3, 2.2]], testTime: 6 },
    { type: 'scratch', title: '2. adım: Yıldız topla ⭐',
      text: `<p>Yıldız: 🏁 → skoru 0 yap → <b>x: (rastgele -200 ile 200) y: (rastgele -140 ile 140)</b> konumuna git → sürekli tekrarla [<b>eğer Kedi'ye dokunuyorsa</b> → skoru 1 değiştir → pop sesi → yeni rastgele konuma git].</p><p class="mut">Sayı kutusundaki ▾ düğmesinden <b>rastgele</b>'yi seç. Kedi'yi yıldıza götür!</p>`,
      setup: KV_SETUP(), blocks: KV_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch'], condDefault: touch('Kedi'), edit: 'Yıldız', keep: true,
      goals: [{ t: 'Yıldız rastgele konuma gitsin', f: (a) => has(a, 'Yıldız', '"r":"rand"') }, { t: 'En az 3 yıldız topla (skor 3)', f: (a) => a.vars.skor >= 3 }],
      hint: 'Yıldız: 🏁 → skoru 0 yap → rastgele konuma git → sürekli tekrarla [eğer Kedi\'ye dokunuyorsa [skoru 1 değiştir, pop sesi, rastgele konuma git]].',
      sol: { Kedi: KEDI, Yıldız: YILDIZ }, play: grab(4, onStar0), testTime: 8 },
    { type: 'quiz', title: 'Hangi blok?',
      q: 'Arının Kedi\'ye <b>doğru dönmesini</b> istiyoruz. Hangi bloğu kullanırız?',
      opts: ['sonraki kostüm', 'Kedi doğru dön', 'x\'i 10 değiştir'], a: 1,
      ok: 'Bu blok kuklayı seçtiğin hedefe çevirir. Kedi hareket edince Arı da yönünü yeniler; bu yüzden hep peşinden gelir.' },
    { type: 'scratch', title: '3. adım: Arı kovalasın 🐝',
      text: `<p>Arı: 🏁 → x: 180 y: 110'a git → sürekli tekrarla [${blk('motion', 'Kedi doğru dön')}, <b>1.5 adım git</b>].</p><p>Kedi 5 adım gidiyor, Arı 1.5 adım. Yani Arı Kedi'den <b>yavaş</b>; koşarsan yakalanmazsın!</p><p class="mut">“fare” yazan yerden ▾ ile <b>Kedi</b>'yi seç. Şimdilik kediyi durdurup Arı'nın gelmesini izle.</p>`,
      setup: KV_SETUP(), blocks: KV_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch'], condDefault: touch('Kedi'), edit: 'Arı', keep: true, testTime: 12,
      goals: [{ t: '“Kedi doğru dön” bloğunu kullan', use: 'pointTo' }, { t: 'Arı Kedi\'ye ulaşsın', f: (a) => a.touching('Arı', 'Kedi') }],
      hint: 'Arı: 🏁 → x: 180 y: 110 konumuna git → sürekli tekrarla [Kedi doğru dön, 1.5 adım git].',
      sol: { Kedi: KEDI, Yıldız: YILDIZ, Arı: ari(1.5) } },
    { type: 'scratch', title: '4. adım: Yakalandın! 😵',
      text: `<p>Arının döngüsüne bir kural daha ekle: <b>eğer Kedi'ye dokunuyorsa</b> → boing sesi → <b>“Yakalandın!”</b> de → tümünü durdur.</p><p class="mut">Şimdi oyunu oyna: yıldızları topla ama Arı'ya yakalanma!</p>`,
      setup: KV_SETUP(), blocks: KV_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch'], condDefault: touch('Kedi'), edit: 'Arı', keep: true, testTime: 14,
      goals: [{ t: 'Arıya “Kedi\'ye dokunuyorsa” kuralı ekle', f: (a) => has(a, 'Arı', '"o":"Kedi"') }, { t: 'Yakalanınca “Yakalandın!” desin', f: (a) => a.said('yakalandın', 'Arı') }],
      hint: 'Arının döngüsüne ekle: eğer Kedi\'ye dokunuyorsa [boing sesi, Yakalandın! de, tümünü durdur].',
      sol: { Kedi: KEDI, Yıldız: YILDIZ, Arı: ari(1.5, [CAUGHT(YAKALANDI)]) } },
    { type: 'quiz', title: 'Adil mi?',
      q: 'Arı da Kedi gibi her turda <b>5 adım</b> gitseydi ne olurdu?',
      opts: ['Oyun daha kolay olurdu', 'Hiçbir şey değişmezdi', 'Kedi kaçamaz, oyun çok zor olurdu'], a: 2,
      ok: 'Düşman oyuncudan hızlıysa kaçmak imkânsızlaşır. Oyun yapanlar düşmanı başta yavaş yapar, sonra yavaş yavaş hızlandırır.' },
    { type: 'scratch', title: '5. adım: Arı hızlansın ⚡',
      text: `<p>Oyun zamanla zorlaşsın! Arıya <b>hız</b> değişkenini kullan: 🏁 → hızı 1.5 yap, <b>(hız) adım git</b>. Yeni bir betik daha: 🏁 → sürekli tekrarla [<b>3 saniye bekle</b>, hızı 0.2 değiştir].</p><p class="mut">Sağ üstte hız sayısının büyüdüğünü izle. Arı sonunda Kedi kadar hızlanacak!</p>`,
      setup: KV_SETUP([], { skor: 0, hız: 1.5 }), blocks: KV_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch'], condDefault: touch('Kedi'), edit: 'Arı', keep: true, testTime: 14,
      goals: [{ t: 'Arının adım sayısı için hız değişkenini kullan', f: (a) => has(a, 'Arı', '"op":"move","args":{"n":{"r":"var","v":"hız"}}') }, { t: 'Arı zamanla hızlansın', f: (a) => a.vars.hız >= 1.9 }],
      hint: 'move bloğunun sayı kutusundan ▾ ile “değişken” → hız seç. İkinci betik: 🏁 → sürekli tekrarla [3 saniye bekle, hız değişkenini 0.2 değiştir].',
      sol: { Kedi: KEDI, Yıldız: YILDIZ, Arı: ari(V('hız'), [CAUGHT(YAKALANDI)], [['setv', 'hız', 1.5]], [[['flag'], ['forever', [['wait', 3], ['chv', 'hız', 0.2]]]]]) }, play: dodge(14) },
    { type: 'scratch', title: '6. adım: Ne kadar dayandın? ⏱️',
      text: `<p>Arı yakalayınca ne kadar dayandığını söylesin. “Yakalandın!” yazan yeri değiştir: <b>(birleştir “Yakalandın! Dayandığın süre: ” (zamanlayıcı)) de</b>.</p><p class="mut">${blk('sensing', 'zamanlayıcı')} 🏁'a bastığından beri geçen saniyeyi verir. Rekorunu arkadaşınla yarıştır!</p>`,
      setup: KV_SETUP([], { skor: 0, hız: 1.5 }), blocks: KV_BLOCKS, reporters: ['rand', 'var', 'timer', 'join'], conds: ['key', 'touch'], condDefault: touch('Kedi'), edit: 'Arı', keep: true, testTime: 14,
      goals: [{ t: 'Zamanlayıcıyı “de” bloğunda kullan', f: (a) => has(a, 'Arı', '"r":"timer"') }, { t: 'Yakalanınca “Dayandığın süre” söylensin', f: (a) => a.said('dayandığın süre', 'Arı') }],
      hint: 'Arının yakalama kuralındaki “de” bloğunun kutusundan ▾ ile birleştir’i seç: ilk kutuya Yakalandın! Dayandığın süre: yaz, ikinci kutuya ▾ ile zamanlayıcıyı koy.',
      sol: { Kedi: KEDI, Yıldız: YILDIZ, Arı: ari(V('hız'), [CAUGHT(SURE_MSG)], [['setv', 'hız', 1.5]], [[['flag'], ['forever', [['wait', 3], ['chv', 'hız', 0.2]]]]]) } },
    { type: 'quiz', title: 'Zamanlayıcı',
      q: 'Zamanlayıcı ne zaman <b>sıfırlanır</b>?',
      opts: ['🏁 tıklandığında (oyun başlarken)', 'Arı Kedi\'yi yakalayınca', 'Yıldız toplayınca'], a: 0,
      ok: '🏁\'a her bastığında zamanlayıcı sıfırdan başlar. Bu yüzden her oyun kendi süresini ölçer.' },
    { type: 'scratch', title: '⭐ Kendi kovalamacan',
      text: '<p>Oyunu kendine göre değiştir! ➕ ile ikinci bir düşman ekle (kuş, hayalet…) ve ona da “Kedi doğru dön” + adım git yaz. Ya da arının hızını, yıldızların sayısını değiştir. Hazır olunca 🏁 ile oyna, <b>skorun 3\'e</b> ulaşsın ve ✔ Bitirdim.</p>',
      setup: KV_SETUP([], { skor: 0, hız: 1.5 }), testSetup: { ...KV_SETUP([], { skor: 0, hız: 1.5 }), sprites: [...KV_SETUP().sprites, sp('Kuş', 'kus', -170, -100)] },
      blocks: KV_BLOCKS.concat(['gotoRand', 'turnR', 'size', 'chsize', 'next', 'show', 'hide']), reporters: ['rand', 'var', 'timer', 'join'], conds: ['key', 'touch', 'cmp'], condDefault: touch('Kedi'), library: true, free: true, keep: true, testTime: 25,
      goals: [{ t: 'Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla)', f: (a) => a.changed() }, { t: 'Yeni bir kukla ekle ve ona betik yaz', f: (a) => newSprite(a, base) }, { t: 'Oyna ve skorun 3\'e ulaşsın', f: (a) => a.vars.skor >= 3 }],
      sol: { Kedi: KEDI, Yıldız: YILDIZ, Arı: ari(V('hız'), [CAUGHT(SURE_MSG)], [['setv', 'hız', 1.5]], [[['flag'], ['forever', [['wait', 3], ['chv', 'hız', 0.2]]]]]), Kuş: [[['flag'], ['goto', -170, -100], ['forever', [['pointTo', 'Kedi'], ['move', 1]]]]] }, play: [...dodge(25), ...grab(24)] },
  ],
};

// --- Kronometre ve Geri Sayım ---
const ZM_BLOCKS = ['flag', 'key', 'click', 'recv', 'bcast', 'forever', 'repeat', 'if', 'waitUntil', 'wait', 'say', 'sayFor', 'chy', 'next', 'sound', 'hide', 'show', 'setv', 'chv', 'resetTimer'];
const ZM_REP = ['var', 'join', 'timer', 'rand'];
const CD = { backdrop: 'uzay', vars: { süre: 10 } };
const CD_SETUP = () => ({ ...CD, sprites: [sp('Roket', 'roket', 0, -120, { dir: 0, rot: 'all' }), sp('Robo', 'robo', -180, 110, { size: 70 })] });
const COUNT = (msg) => ['repeat', 10, [['say', msg], ['wait', 1], ['chv', 'süre', -1]]];
const SAYS = V('süre');
const KALAN = J('Kalan: ', V('süre'));
const SET10 = ['setv', 'süre', 10];
const LAUNCH = [['say', 'Fırlat!'], ['bcast', 'fırlat']];
const FLY = [[['recv', 'fırlat'], ['sound', 'kazandin'], ['repeat', 60, [['chy', 5], ['next']]]]];
const KRONO = [[['flag'], ['forever', [['say', TIMER]]]], [['key', 'space'], ['resetTimer'], ['sound', 'pop']]];
const ALARM = [[['flag'], ['waitUntil', cmp(TIMER, '>', 5)], ['say', 'Süre doldu!'], ['sound', 'zil']]];
const REAKSIYON = [['flag'], ['hide'], ['wait', R(2, 5)], ['show'], ['resetTimer']];
const TEPKI = [['click'], ['say', J('Tepki süren: ', TIMER)]];
const TP_SETUP = (extra = []) => ({ backdrop: 'cayir', vars: {}, sprites: [sp('Kedi', 'kedi', 0, -10, { size: 150 }), ...extra] });

export const b42 = {
  icon: '⏱️', color: '#0ea5e9', title: 'Kronometre ve Geri Sayım', concept: 'Zaman + değişken + operatör',
  desc: 'Roket fırlatma geri sayımı, kronometre, çalar saat ve “kim daha hızlı tıklar?” tepki oyunu. Zamanı kodla ölç!',
  learned: ['Bir değişken “sayaç” olarak kullanılabilir: süre 10’dan 0’a her saniye 1 azalır.', '“Birleştir” bloğu yazı ile sayıyı yan yana koyar (Kalan: 5).', 'Zamanlayıcı geçen saniyeyi ölçer; “… olana kadar bekle” ile belli bir süreyi bekleyebiliriz.'],
  teacher: '<b>El çırparak geri sayım:</b> Sınıf ayağa kalksın. Öğretmen “10” desin, herkes bir kez el çırpsın; sonra “9” … sıra ile 0\'a kadar sayılsın (her sayıda “süre = süre − 1” cümlesini yüksek sesle söyleyin). Sonra “Kalan: 5” cümlesini birleştirme örneği olarak tahtaya yazın (“Kalan: ” + 5). Son olarak tepki oyunu: öğretmen bir kâğıdı rastgele bir anda kaldırsın, öğrenciler hemen el kaldırsın; en hızlı kalkanı birlikte seçin. Bilgisayarda zamanlayıcı bunu nasıl ölçer, konuşun.',
  steps: [
    { type: 'story', anim: 'think', title: '10, 9, 8 … Fırlat! 🚀',
      text: '<p>Roketler fırlamadan önce geri sayım yapılır. Bu derste zamanla oynayacağız:</p><ol class="tips"><li><b>Geri sayım:</b> <b>süre</b> değişkeni 10\'dan 0\'a iner, sonra roket uçar.</li><li><b>Kalan: 5</b> gibi yazılar için “birleştir” bloğunu kullanacağız.</li><li><b>Kronometre:</b> boşluk tuşu zamanlayıcıyı sıfırlar.</li><li><b>Çalar saat:</b> süre dolunca zil çalar.</li><li><b>Tepki oyunu:</b> kuklayı ne kadar çabuk görüp tıklıyorsun?</li></ol><p class="mut">Hoparlör yoksa sorun değil, çalan sesler yazılı görünür.</p>',
      pics: ['🚀', '⏱️', '🔔', '👆', '🏆'] },
    { type: 'scratch', title: '1. adım: Geri sayım',
      text: `<p>Robo geri sayımı yapsın: 🏁 → <b>süre değişkenini 10 yap</b> → <b>10 kez tekrarla</b> [<b>(süre) de</b>, 1 saniye bekle, <b>süreyi -1 değiştir</b>].</p><p class="mut">“de” kutusunun ▾ düğmesinden süre değişkenini seç. Denemelerin kısa sürsün diye 10 yerine 5 yazabilirsin, ama bitirirken 10 yap.</p>`,
      setup: CD_SETUP(), blocks: ZM_BLOCKS, reporters: ZM_REP, msgs: ['fırlat'], conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Robo', testTime: 14,
      goals: [{ t: 'Süre değişkenini 10 yap ve her turda azalt', f: (a) => has(a, 'Robo', '"v":"süre","n":10') && has(a, 'Robo', '"v":"süre","n":-1') }, { t: 'Robo 10\'dan 1\'e kadar saysın, süre 0 olsun', f: (a) => a.vars.süre === 0 && a.said('10', 'Robo') && a.said('1', 'Robo') }],
      hint: '🏁 → süreyi 10 yap → 10 kez tekrarla [(süre) de, 1 saniye bekle, süre değişkenini -1 değiştir].',
      sol: { Robo: [[['flag'], SET10, COUNT(SAYS)]] } },
    { type: 'quiz', title: 'Süre kaç olur?',
      q: '<b>süre</b> 5 iken “süre değişkenini -1 değiştir” bloğu <b>2 kez</b> çalışırsa süre kaç olur?',
      opts: ['5', '4', '3'], a: 2,
      ok: 'Her çalışmada süre 1 azalır: 5 → 4 → 3. Geri sayım işte böyle işler.' },
    { type: 'scratch', title: '2. adım: Roket fırlasın 🚀',
      text: `<p>Sayım bitince Robo <b>“Fırlat!”</b> desin ve <b>fırlat haberini sal</b>. Roket: ${blk('events', 'fırlat haberini aldığımda', 1)} → <b>60 kez tekrarla</b> [y'yi 5 değiştir, sonraki kostüm] (alev yanıp sönsün!).</p>`,
      setup: CD_SETUP(), blocks: ZM_BLOCKS, reporters: ZM_REP, msgs: ['fırlat'], conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Roket', keep: true, testTime: 16,
      goals: [{ t: 'Robo “fırlat” haberini salsın', f: (a) => a.bcast('fırlat') }, { t: 'Roket yukarı uçsun 🚀', f: (a) => a.sp('Roket').y > 100 }],
      hint: 'Robo: sayımdan sonra “Fırlat!” de + fırlat haberini sal. Roket: fırlat haberini aldığımda → 60 kez tekrarla [y\'yi 5 değiştir, sonraki kostüm].',
      sol: { Robo: [[['flag'], SET10, COUNT(SAYS), ...LAUNCH]], Roket: FLY } },
    { type: 'scratch', title: '3. adım: “Kalan: 5” yazsın',
      text: `<p>Robo yalnızca sayı söylüyor. Şimdi cümle kursun! “de” bloğunun içine <b>birleştir “Kalan: ” (süre)</b> koy. Böylece <b>Kalan: 10</b>, <b>Kalan: 9</b> … diye konuşur.</p><p class="mut">${blk('operators', 'birleştir')} iki parçayı yan yana yazar: yazı + sayı.</p>`,
      setup: CD_SETUP(), blocks: ZM_BLOCKS, reporters: ZM_REP, msgs: ['fırlat'], conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Robo', keep: true, testTime: 16,
      goals: [{ t: '“birleştir” bloğunu kullan', f: (a) => has(a, 'Robo', '"r":"join"') }, { t: 'Robo “Kalan: 5” desin', f: (a) => a.said('kalan: 5', 'Robo') }, { t: 'Sayım bitince roket uçsun', f: (a) => a.sp('Roket').y > 100 }],
      hint: '“de” kutusundan ▾ ile birleştir’i seç. İlk kutuya Kalan: (iki nokta ve boşlukla) yaz, ikinci kutuya ▾ ile süre değişkenini koy.',
      sol: { Robo: [[['flag'], SET10, COUNT(KALAN), ...LAUNCH]], Roket: FLY } },
    { type: 'quiz', title: 'Birleştir',
      q: '“birleştir <b>Kalan: </b> <b>süre</b>” bloğunda süre <b>7</b> ise Robo ne der?',
      opts: ['Kalan: 7', 'Kalan: süre', '7 Kalan:'], a: 0,
      ok: 'Birleştir, değişkenin içindeki değeri yazıya yapıştırır: “Kalan: ” + 7 = “Kalan: 7”.' },
    { type: 'scratch', title: '4. adım: Kronometre ⏱️',
      text: `<p>Şimdi kronometre yapalım! Robo: 🏁 → sürekli tekrarla [<b>(zamanlayıcı) de</b>]. Bir de ikinci betik: ${blk('events', 'boşluk tuşuna basılınca', 1)} → ${blk('sensing', 'zamanlayıcıyı sıfırla')} → pop sesi.</p><p class="mut">Sahneye tıkla, boşluk tuşuna basıp süreyi sıfırla. Arkadaşına “şimdi dur!” diyerek 5. saniyeyi yakalatmayı dene.</p>`,
      setup: { backdrop: 'uzay', vars: {}, sprites: [sp('Robo', 'robo', 0, 20, { size: 150 })] }, blocks: ZM_BLOCKS, reporters: ZM_REP, conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Robo', testTime: 8,
      goals: [{ t: 'Zamanlayıcıyı “de” bloğunda göster', f: (a) => has(a, 'Robo', '"op":"say","args":{"t":{"r":"timer"}}') }, { t: '“zamanlayıcıyı sıfırla” kullan', use: 'resetTimer' }, { t: 'Boşluk tuşu süreyi sıfırlasın', f: (a) => { const t = a.w.t - a.w.timer0; if (t > 1.5) a.mem.big = 1; return !!a.mem.big && a.keys.includes('space') && t < 0.8; } }],
      hint: 'Betik 1: 🏁 → sürekli tekrarla [(zamanlayıcı) de]. Betik 2: boşluk tuşuna basılınca → zamanlayıcıyı sıfırla.',
      sol: { Robo: KRONO }, play: [['tap', 'space', 2.5]] },
    { type: 'scratch', title: '5. adım: Süre dolunca zil çal 🔔',
      text: `<p>Zil çalar saat olsun: Zil: 🏁 → <b>(zamanlayıcı) &gt; 5 olana kadar bekle</b> → “Süre doldu!” de → zil sesi çal.</p><p class="mut">${blk('control', '… olana kadar bekle')} koşul doğru olana dek hiçbir şey yapmaz, sonra devam eder. Kronometre 5'i geçince zil çalacak!</p>`,
      setup: { backdrop: 'uzay', vars: {}, sprites: [sp('Robo', 'robo', 0, 20, { size: 150 }), sp('Zil', 'zil', 170, -60, { size: 130 })] }, blocks: ZM_BLOCKS, reporters: ZM_REP, conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Zil', keep: true, testTime: 9,
      goals: [{ t: '“… olana kadar bekle” bloğunu kullan', use: 'waitUntil' }, { t: 'Zamanlayıcı 5\'i geçince “Süre doldu!” desin', f: (a) => a.said('süre doldu', 'Zil') && a.w.t - a.w.timer0 > 5 }, { t: 'Zil sesi çalsın 🔔', f: (a) => a.sounds('zil', 'Zil') > 0 }],
      hint: 'Zil: 🏁 → (zamanlayıcı) > 5 olana kadar bekle → Süre doldu! de → zil sesini başlat. Koşuldaki sayıyı 5 yap.',
      sol: { Robo: KRONO, Zil: ALARM } },
    { type: 'quiz', title: 'Ne zaman biter?',
      q: '“zamanlayıcı &gt; 5 olana kadar bekle” bloğu <b>ne zaman</b> biter?',
      opts: ['Hemen, beklemeden', 'Zamanlayıcı 5\'i geçince', 'Zamanlayıcı 0 olunca'], a: 1,
      ok: 'Koşul doğru olana kadar program bu blokta bekler. Doğru olunca bir sonraki bloğa geçer.' },
    { type: 'scratch', title: '6. adım: Tepki oyunu 1: Kedi belirsin',
      text: `<p>Ne kadar çabuk tepki veriyorsun? Kedi önce saklansın, rastgele bir süre sonra çıksın. Kedi: 🏁 → <b>gizle</b> → <b>(rastgele 2 ile 5) saniye bekle</b> → <b>göster</b> → <b>zamanlayıcıyı sıfırla</b>.</p><p class="mut">Her seferinde farklı bir anda çıkacak, hazır ol!</p>`,
      setup: TP_SETUP(), blocks: ZM_BLOCKS, reporters: ZM_REP, conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Kedi', testTime: 9,
      goals: [{ t: 'Bekleme süresi rastgele olsun', f: (a) => has(a, 'Kedi', '"r":"rand"') }, { t: 'Kedi önce saklansın, sonra belirsin', f: (a) => { if (!a.sp('Kedi').visible) a.mem.h = 1; return !!a.mem.h && a.sp('Kedi').visible; } }, { t: 'Belirince zamanlayıcıyı sıfırla', use: 'resetTimer' }],
      hint: '🏁 → gizle → (rastgele 2 ile 5) saniye bekle → göster → zamanlayıcıyı sıfırla. “bekle” kutusundan ▾ ile rastgele’yi seç.',
      sol: { Kedi: [REAKSIYON] } },
    { type: 'scratch', title: '7. adım: Tepki oyunu 2: Tıkla!',
      text: `<p>Kedi çıkınca ona hemen tıkla! Kedi'ye ikinci betik: ${blk('events', 'bu kukla tıklanınca', 1)} → <b>(birleştir “Tepki süren: ” (zamanlayıcı)) de</b>.</p><p class="mut">Tepki sürenin kaç saniye olduğunu göreceksin. Küçük sayı = hızlı tepki!</p>`,
      setup: TP_SETUP(), blocks: ZM_BLOCKS, reporters: ZM_REP, conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), edit: 'Kedi', keep: true, testTime: 9,
      goals: [{ t: 'Tıklama betiğinde zamanlayıcıyı kullan', f: (a) => has(a, 'Kedi', '"op":"say","args":{"t":{"r":"join","a":"Tepki süren: ","b":{"r":"timer"}}}') }, { t: 'Tıklayınca “Tepki süren” söylensin', f: (a) => a.said('tepki süren', 'Kedi') }],
      hint: 'Kedi: bu kukla tıklanınca → (birleştir “Tepki süren: ” (zamanlayıcı)) de. Önce 🏁\'a bas, Kedi çıkınca tıkla!',
      sol: { Kedi: [REAKSIYON, TEPKI] }, play: [['click', 'Kedi', 7]] },
    { type: 'scratch', title: '⭐ Kendi zaman oyunun',
      text: '<p>Tepki oyununu geliştir! ➕ ile ikinci bir kukla ekle (fare, hayalet…) ve ona da gizlen-belir-tıkla betiği yaz. Ya da bekleme süresini değiştir, kedi çıkınca ses çıksın… 🏁 ile oyna, kedini tıkla ve tepki süreni gör. Hazır olunca ✔ Bitirdim.</p>',
      setup: TP_SETUP(), testSetup: TP_SETUP([sp('Fare', 'fare', 150, 100, { size: 150 })]),
      blocks: ZM_BLOCKS.concat(['gotoRand', 'goto', 'size', 'chsize']), reporters: ZM_REP, conds: ['cmp'], condDefault: cmp(TIMER, '>', 5), library: true, free: true, keep: true, testTime: 10,
      goals: [{ t: 'Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla)', f: (a) => a.changed() }, { t: 'Yeni bir kukla ekle ve ona betik yaz', f: (a) => newSprite(a, ['Kedi']) }, { t: 'Oyna: kuklaya tıkla ve tepki süreni gör', f: (a) => a.said('tepki süren') }],
      sol: { Kedi: [REAKSIYON, TEPKI], Fare: [[['flag'], ['hide'], ['wait', R(3, 6)], ['show'], ['resetTimer']], [['click'], ['say', J('Fare: ', TIMER)]]] }, play: [['click', 'Kedi', 7]] },
  ],
};
