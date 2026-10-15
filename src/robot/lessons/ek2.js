// Ek bölümler (2): Müzik Kutusu ve Balon Patlat (Scratch benzeri sahne görevleri)
import { sp, blk, played, V, R, J, cmp, visibleCount } from './sh.js';

const note = (n, b = 0.5) => ['note', n, b];
const Y = { r: 'y' };
const TIMER = { r: 'timer' };

// --- Müzik kutusu ---
const ODE = [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62];
const PIANO = [['a', 60], ['s', 62], ['d', 64], ['w', 65], ['space', 67]];
const clickAt = (names) => names.map((n, i) => ['click', n, 0.5 + i * 0.5]);

export const b35 = {
  icon: '🎶', color: '#a855f7', title: 'Müzik Kutusu', concept: 'Müzik projesi',
  desc: 'Davul seti, klavye piyanosu, “Neşe Şarkısı” ve dans eden bir orkestra: kendi müzik kutunu yap!',
  learned: ['Tıklama ve tuş olayları kuklaları çalgıya çevirir.', 'Bir şarkı, doğru sırada çalınan notalardır; tekrar eden kısımlar döngüyle kısalır.', '“Haber sal” ile bir kukla çalarken diğerleri onunla aynı anda dans edebilir.'],
  teacher: '<b>İnsan orkestrası:</b> Sınıfı üç gruba ayırın: “davulcular” (masaya vurur), “piyanistler” (Do-Re-Mi söyler), “dansçılar” (dans eder). Öğretmen “vuruş!” dediğinde (haber sal!) bütün gruplar aynı anda harekete geçsin. Sonra sorun: “Dansçılar davulcuyu nasıl duydu?” (haber alma).',
  steps: [
    { type: 'story', anim: 'dance', title: 'Müzik kutusu zamanı! 🎶',
      text: '<p>Bu bölümde kendi çalgılarını yapacaksın:</p><ol class="tips"><li>🥁 <b>Davul seti:</b> kuklalara tıklayınca ses çıksın.</li><li>🎹 <b>Piyano:</b> klavyenin tuşları nota çalsın.</li><li>⭐ <b>Şarkı:</b> notaları doğru sırayla çal.</li><li>💃 <b>Orkestra:</b> davul çalarken kedi dans etsin.</li></ol><p class="mut">Hoparlör yoksa sorun değil: çalan ses ve notalar kuklanın yanında yazılı görünür.</p>',
      pics: ['🥁', '🎹', '⭐', '💃'] },
    { type: 'scratch', title: 'Davul seti 🥁',
      text: `<p>Her kukla bir çalgı olsun. <b>Davul</b>a tıklayınca davul, <b>Zil</b>e tıklayınca zil, <b>Köpek</b>e tıklayınca “hav” sesi çalsın. Her kukla için ${blk('events', 'bu kukla tıklanınca', 1)} + ${blk('sound', 'ses başlat')} kullan.</p><p class="mut">Sonra sahneye tıklayıp çalgılarını dene!</p>`,
      setup: { backdrop: 'sahne', sprites: [sp('Davul', 'davul', -130, -40, { size: 130 }), sp('Zil', 'zil', 0, -40, { size: 130 }), sp('Köpek', 'kopek', 130, -40)] },
      blocks: ['click', 'sound', 'soundW', 'next', 'size', 'chsize', 'wait'], noFlag: true,
      goals: [{ t: 'Üç kukla için üç tıklama betiği', f: (a) => a.hats('click') >= 3 }, { t: 'Davul, zil ve hav sesleri çalınsın 🥁', f: (a) => a.sounds('davul') > 0 && a.sounds('zil') > 0 && a.sounds('hav') > 0 }],
      hint: 'Önce Davul\'u seç (kukla listesinden): “bu kukla tıklanınca” + “davul sesini başlat”. Sonra aynısını Zil ve Köpek için yap.',
      sol: { Davul: [[['click'], ['sound', 'davul'], ['next']]], Zil: [[['click'], ['sound', 'zil']]], Köpek: [[['click'], ['sound', 'hav'], ['next']]] },
      play: clickAt(['Davul', 'Zil', 'Köpek']) },
    { type: 'scratch', title: 'Klavye piyanosu 🎹',
      text: `<p>Robo piyano olsun! Beş tuş için beş betik yaz: <b>a</b> → Do, <b>s</b> → Re, <b>d</b> → Mi, <b>w</b> → Fa, <b>boşluk</b> → Sol. Her tuşta kostüm de değişsin (${blk('looks', 'sonraki kostüm')}).</p><p class="mut">Sonra sahneye tıkla ve tuşlara bas!</p>`,
      setup: { backdrop: 'sahne', sprites: [sp('Robo', 'robo', 0, -60, { size: 130 })] },
      blocks: ['key', 'note', 'next', 'sound', 'sayFor'], noFlag: true,
      goals: [{ t: 'Beş tuş için beş betik', f: (a) => a.hats('key', 'Robo') >= 5 }, { t: 'Do, Re, Mi, Fa ve Sol çalınsın 🎹', f: (a) => [60, 62, 64, 65, 67].every((n) => a.notes.includes(n)) }],
      hint: 'Her betik: “… tuşuna basılınca” + “♪ … notasını çal” + “sonraki kostüm”. Önce bir tanesini yap, sonra aynısını başka tuşlar için çoğalt.',
      sol: { Robo: PIANO.map(([k, n]) => [['key', k], note(n), ['next']]) },
      play: PIANO.map(([k], i) => ['tap', k, 0.5 + i * 0.6]) },
    { type: 'quiz', title: 'Tekrarı bul',
      q: 'Bir şarkıda <b>Do Re Mi Do</b> notaları art arda iki kez çalınıyor. Bloklarla en kısa nasıl yazarsın?',
      opts: ['8 tane nota bloğu', '2 kez tekrarla: [Do, Re, Mi, Do]', 'Notaları daha hızlı çal'], a: 1,
      ok: 'Tekrar eden parçayı döngüye koymak bloğu kısaltır. Robo\'nun programlarında da böyleydi!' },
    { type: 'scratch', title: 'Neşe şarkısı ⭐',
      text: `<p>Meşhur “Neşe Şarkısı”nı çal! Notalar:<br><b>Mi Mi Fa Sol · Sol Fa Mi Re · Do Do Re Mi · Mi Re Re</b><br>Son notayı (Re) uzun çal: 1 vuruş. Diğerleri 0.5 vuruş.</p>`,
      setup: { backdrop: 'gece', sprites: [sp('Yıldız', 'yildiz', 0, 40, { size: 150 })] },
      blocks: ['flag', 'note', 'rest', 'repeat', 'sayFor', 'chsize', 'next'],
      goals: [{ t: 'Şarkıyı sırayla çal: Mi Mi Fa Sol… Re Re', f: (a) => played(a.notes, ODE) }],
      hint: 'Notalar: Mi (64), Fa (65), Sol (67), Re (62), Do (60). On beş nota bloğu gerekiyor; 🏁 ile başlat.',
      sol: { Yıldız: [[['flag'], ...ODE.map((n, i) => note(n, i === 14 ? 1 : 0.5))]] } },
    { type: 'scratch', title: 'Ritim ve dans 💃',
      text: `<p>Davul her vuruşta <b>“vuruş” haberi</b> salsın (${blk('events', 'vuruş haberini sal')}) ve davul sesi çıkarsın. Kedi bu haberi alınca dans etsin: ${blk('events', 'vuruş haberini aldığımda', 1)} → sonraki kostüm, ↻ 10 derece dön.</p>`,
      setup: { backdrop: 'sahne', sprites: [sp('Davul', 'davul', -100, -60, { size: 130 }), sp('Kedi', 'kedi', 100, -60, { rot: 'all' })] },
      blocks: ['flag', 'recv', 'forever', 'repeat', 'bcast', 'sound', 'soundW', 'next', 'turnR', 'turnL', 'wait', 'chsize'], msgs: ['vuruş'],
      goals: [{ t: '“vuruş” haberi salınsın', f: (a) => a.bcast('vuruş') }, { t: 'Davul en az 4 kez çalsın 🥁', f: (a) => a.sounds('davul') >= 4 }, { t: 'Kedi haberi alıp dans etsin', f: (a) => a.sp('Kedi').frames >= 4 }],
      hint: 'Davul: 🏁 → sürekli tekrarla [vuruş haberini sal, davul sesi, 0.5 saniye bekle]. Kedi: vuruş haberini aldığımda → sonraki kostüm, ↻ 10 derece.',
      sol: { Davul: [[['flag'], ['forever', [['bcast', 'vuruş'], ['sound', 'davul'], ['wait', 0.5]]]]], Kedi: [[['recv', 'vuruş'], ['next'], ['turnR', 10]]] } },
    { type: 'scratch', title: '⭐ Kendi müzik kutum',
      text: '<p>Kendi müzik kutunu yap! ➕ ile çalgı ekle, kendi melodini yaz. En az <b>8 nota ya da ses</b> çalsın ve bir <b>döngü</b> ya da <b>haber</b> kullan. Arkadaşına dinlet! Hazır olunca ✔ Bitirdim.</p>',
      setup: { backdrop: 'sahne', sprites: [sp('Kedi', 'kedi', -100, -60), sp('Davul', 'davul', 100, -60)] },
      blocks: ['flag', 'click', 'key', 'recv', 'bcast', 'repeat', 'forever', 'note', 'rest', 'sound', 'soundW', 'next', 'wait', 'sayFor', 'turnR', 'turnL', 'chsize', 'color'], msgs: ['vuruş', 'şarkı'], library: true, free: true,
      goals: [{ t: 'En az 8 nota ya da ses çalsın', f: (a) => a.notes.length + a.w.log.sounds.length >= 8 }, { t: 'Bir döngü ya da haber kullan', f: (a) => a.uses('repeat') || a.uses('forever') || a.w.log.bcasts.length > 0 }],
      sol: { Kedi: [[['flag'], ['repeat', 2, [note(60), note(62), note(64), note(60)]]]] } },
  ],
};

// --- Balon patlat ---
const BAL_BLOCKS = ['flag', 'click', 'cloneStart', 'clone', 'delClone', 'forever', 'repeat', 'if', 'ife', 'goto', 'gotoRand', 'chy', 'chx', 'sound', 'show', 'hide', 'color', 'size', 'sayFor', 'say', 'stop', 'setv', 'chv', 'wait'];
const BOTTOM = ['goto', R(-210, 210), -170];
const BAL_SETUP = (extra = []) => ({ backdrop: 'cayir', vars: { skor: 0 }, sprites: [sp('Balon', 'top', 0, -170, { size: 130 }), ...extra] });
const RISE = [[['flag'], BOTTOM, ['forever', [['chy', 3], ['if', cmp(Y, '>', 170), [BOTTOM]]]]]];
const POP = [['click'], ['sound', 'pop'], ['chv', 'skor', 1], BOTTOM];
const SKOR0 = ['setv', 'skor', 0];
const FLOCK = [
  [['flag'], ['hide'], SKOR0, ['repeat', 6, [['clone', 'kendim'], ['wait', 0.4]]]],
  [['cloneStart'], ['goto', R(-210, 210), -170], ['color', R(10, 150)], ['show'], ['forever', [['chy', 3], ['if', cmp(Y, '>', 170), [BOTTOM]]]]],
  [['click'], ['sound', 'pop'], ['chv', 'skor', 1], BOTTOM],
];
const RAF = [[['flag'], ['forever', [['if', cmp(TIMER, '>', 20), [['sound', 'kazandin'], ['say', J('Süre bitti! Puanın: ', V('skor'))], ['stop']]]]]]];
const baloncuk = (n) => Array.from({ length: n }, (_, i) => ['click', 'Balon', 1 + i * 0.8]);

export const b36 = {
  icon: '🎈', color: '#ef4444', title: 'Oyun 5: Balon Patlat', concept: 'Tıklama + zaman',
  desc: 'Balonlar yükseliyor! Tıklayıp patlat, 20 saniyede en çok puanı topla. Klon, skor ve zamanlayıcı birlikte!',
  learned: ['Tıklama olayı oyuncunun fareyle oyuna katılmasını sağlar.', 'Klonlarla aynı anda çok sayıda balon oluşturabiliriz; her klon kendi tıklamasını işler.', '“Zamanlayıcı” bloğu 🏁’dan beri geçen saniyeyi verir; oyunlara süre sınırı koymak için kullanılır.'],
  teacher: '<b>Süre tutma oyunu:</b> Sınıfta zamanlayıcıyı bir öğrenci tutsun; “başla!” deyince diğerleri 20 saniye boyunca kâğıttaki balon resimlerinin üstüne kalemle nokta koysun. Süre bitince noktaları sayıp “skor” tahtaya yazılsın. Sonra “Süre sınırı oyunu nasıl daha heyecanlı yapıyor?” diye tartışın.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Balon festivali! 🎈',
      text: '<p>Yeni oyunumuzda aşağıdan yukarı balonlar yükseliyor. Fareyle tıklayıp patlatacaksın!</p><ol class="tips"><li>Balon <b>yukarı doğru</b> çıkar; tepeye varınca aşağıdan yeniden başlar.</li><li><b>Tıklayınca</b> patlar: pop sesi, skor +1.</li><li>Balonlardan <b>çok sayıda</b> olacak (klonlar).</li><li><b>20 saniye</b> sonra oyun biter ve puanını söyler.</li></ol>',
      pics: ['🎈', '👆', '💥', '⏱️', '🏆'] },
    { type: 'scratch', title: '1. adım: Yükselen balon',
      text: `<p>Balon: 🏁 → x: (rastgele -210 ile 210) y: -170'e git → sürekli tekrarla [y'yi 3 değiştir; <b>eğer y &gt; 170 ise</b> aşağıya, yeni rastgele x'e dön].</p>`,
      setup: BAL_SETUP(), blocks: BAL_BLOCKS, reporters: ['rand', 'var', 'timer'], conds: ['cmp', 'touch'], condDefault: cmp(Y, '>', 170), edit: 'Balon',
      goals: [{ t: 'Balon yukarı çıksın', f: (a) => a.sp('Balon').y > 60 }, { t: 'Tepeye varınca aşağıdan yeniden başlasın', f: (a) => { const y = a.sp('Balon').y; if (y > 150) a.mem.up = 1; return !!a.mem.up && y < -100; } }],
      hint: 'sürekli tekrarla [y\'yi 3 değiştir, eğer (y konumu) > 170 ise x: (rastgele) y: -170 konumuna git].',
      sol: { Balon: RISE } },
    { type: 'scratch', title: '2. adım: Patlat! 💥',
      text: `<p>Balona yeni bir betik: ${blk('events', 'bu kukla tıklanınca', 1)} → pop sesi → <b>skoru 1 değiştir</b> → aşağıdan yeniden başla. 🏁 betiğinin başına <b>skoru 0 yap</b> eklemeyi unutma! Balona 3 kez tıkla.</p>`,
      setup: BAL_SETUP(), blocks: BAL_BLOCKS, reporters: ['rand', 'var', 'timer'], conds: ['cmp', 'touch'], condDefault: cmp(Y, '>', 170), edit: 'Balon', keep: true,
      goals: [{ t: 'Tıklama betiği yaz', f: (a) => a.hats('click', 'Balon') > 0 }, { t: '🏁 ile skoru 0 yap', use: 'setv' }, { t: '3 balon patlat', f: (a) => a.vars.skor >= 3 }],
      sol: { Balon: [[['flag'], SKOR0, BOTTOM, ['forever', [['chy', 3], ['if', cmp(Y, '>', 170), [BOTTOM]]]]], POP] },
      play: baloncuk(3) },
    { type: 'quiz', title: 'Hangi olay?',
      q: 'Oyuncu <b>fareyle balona tıklayınca</b> bir şey olsun istiyoruz. Betiği hangi bloğla başlatırız?',
      opts: ['🏁 tıklandığında', 'bu kukla tıklanınca', 'boşluk tuşuna basılınca'], a: 1,
      ok: '“bu kukla tıklanınca” yalnızca o kuklaya tıklanınca çalışır. 🏁 ise oyunu başlatır.' },
    { type: 'scratch', title: '3. adım: Balon sürüsü 🎈🎈🎈',
      text: '<p>Tek balon az! Balona klonlama ekle: 🏁 → <b>gizle</b> → skoru 0 yap → <b>6 kez tekrarla</b> [kendim klonunu oluştur, 0.4 saniye bekle].<br>Klon olarak başladığımda → rastgele x\'e git (y: -170) → rengini değiştir → göster → sürekli tekrarla [yükselsin, tepeden dönsün]. Patlatma betiği her klonda çalışır.</p>',
      setup: BAL_SETUP(), blocks: BAL_BLOCKS, reporters: ['rand', 'var', 'timer'], conds: ['cmp', 'touch'], condDefault: cmp(Y, '>', 170), edit: 'Balon', keep: true,
      goals: [{ t: 'En az 6 klon oluştur', f: (a) => a.w.log.clones >= 6 }, { t: 'Aynı anda en az 4 balon görünsün', f: (a) => visibleCount(a, 'Balon') >= 4 }, { t: 'Balonlara tıklayınca skor artsın', f: (a) => a.vars.skor >= 3 }],
      hint: 'Klon olarak başladığımda betiği 2. adımdaki yükselme kodunun aynısı; sadece başına “göster” ve “renk etkisi” ekle. Sürükleyip kopyalayabilirsin.',
      sol: { Balon: FLOCK }, play: baloncuk(3), testTime: 14 },
    { type: 'scratch', title: '4. adım: 20 saniye! ⏱️',
      text: `<p>Robo oyun sunucusu olsun. Robo: 🏁 → sürekli tekrarla [<b>eğer zamanlayıcı &gt; 20 ise</b> → “kazandın” sesi → <b>“Süre bitti! Puanın: (skor)”</b> de → tümünü durdur].</p><p class="mut">Sayı kutusundaki ▾ düğmesinden <b>birleştir</b> ve <b>skor</b>'u seç. Zamanlayıcı 🏁'a basınca sıfırdan başlar.</p>`,
      setup: BAL_SETUP([sp('Robo', 'robo', -190, 120, { size: 70 })]), blocks: BAL_BLOCKS, reporters: ['rand', 'var', 'timer', 'join'], conds: ['cmp', 'touch'], condDefault: cmp(TIMER, '>', 20), edit: 'Robo', keep: true, testTime: 30,
      goals: [{ t: 'Zamanlayıcıyı koşulda kullan', f: (a) => JSON.stringify(a.w.sprite('Robo')?.scripts || []).includes('"r":"timer"') }, { t: 'Süre dolunca “Süre bitti” desin', f: (a) => a.said('süre bitti', 'Robo') }, { t: 'Puanını da söylesin', f: (a) => a.said('puanın', 'Robo') }],
      hint: '🏁 → sürekli tekrarla [eğer (zamanlayıcı) > 20 ise [kazandın sesi, (birleştir “Süre bitti! Puanın: ” (skor)) de, tümünü durdur]].',
      sol: { Balon: FLOCK, Robo: RAF }, play: baloncuk(8) },
    { type: 'scratch', title: '⭐ Kendi balon oyunun',
      text: '<p>Oyunu kendine göre değiştir! Balonları hızlandır, sayıyı artır, başka bir kukla ekle (kalp, yıldız, elma…). Zor bir fikir: 🍎 yerine <b>bomba</b> gibi bir kukla ekle; ona tıklarsan skor azalsın! Hazır olunca ✔ Bitirdim.</p>',
      setup: BAL_SETUP([sp('Robo', 'robo', -190, 120, { size: 70 })]), blocks: BAL_BLOCKS.concat(['goto']), reporters: ['rand', 'var', 'timer', 'join'], conds: ['cmp', 'touch'], condDefault: cmp(TIMER, '>', 20), library: true, free: true, keep: true,
      goals: [{ t: 'Skor tut', use: 'chv' }, { t: 'Tıklama betiği yaz', f: (a) => a.hats('click') > 0 }],
      sol: { Balon: FLOCK, Robo: RAF }, play: baloncuk(3) },
  ],
};
