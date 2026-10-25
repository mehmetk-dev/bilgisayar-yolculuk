// 7. hafta: oyun projeleri (labirent, yakalama, uzay kaçışı) ve bitirme projesi
import { sp, blk, near } from './sh.js';

const V = (v) => ({ r: 'var', v });
const R = (a, b) => ({ r: 'rand', a, b });
const touch = (o) => ({ k: 'touch', o });
const key = (k) => ({ k: 'key', key: k });
const cmp = (a, op, b) => ({ k: 'cmp', a, op, b });
const has = (a, name, s) => JSON.stringify(a.w.sprite(name)?.scripts || []).includes(s);

// --- Labirent oyunu ---
const START = [-200, -135];
const MAZE_SETUP = (extra = []) => ({ backdrop: 'labirent2', vars: { süre: 0 }, sprites: [sp('Peynir', 'peynir', -195, 130), ...extra, sp('Fare', 'fare', ...START)] });
const MOVE4 = [['if', key('right'), [['chx', 4]]], ['if', key('left'), [['chx', -4]]], ['if', key('up'), [['chy', 4]]], ['if', key('down'), [['chy', -4]]]];
const WALL = ['if', touch('duvar'), [['sound', 'boing'], ['goto', ...START]]];
const WIN = ['if', touch('Peynir'), [['sound', 'kazandin'], ['sayFor', 'Kazandım!', 1], ['stop']]];
const GHOST = ['if', touch('Hayalet'), [['sound', 'boing'], ['goto', ...START]]];
const fare = (...ifs) => [[['flag'], ['goto', ...START], ['forever', [...MOVE4, ...ifs]]]];
const TIMER = [[['flag'], ['setv', 'süre', 0], ['forever', [['wait', 1], ['chv', 'süre', 1]]]]];
const MAZE_BLOCKS = ['flag', 'forever', 'if', 'chx', 'chy', 'goto', 'sound', 'sayFor', 'stop', 'setv', 'chv', 'wait', 'glide'];
const teleport = (name, x, y) => (w) => { const s = w.sprite(name); s.x = x; s.y = y; };

export const b25 = {
  icon: '🧀', color: '#5b6ee1', title: 'Oyun 1: Labirent', concept: 'Oyun tasarımı',
  desc: 'Adım adım kendi labirent oyununu yap: akıcı hareket, duvarlar, hedef, süre ve bir hayalet!',
  learned: ['Bir oyunun oyuncusu, hedefi, engelleri ve kuralları vardır.', 'Oyunu küçük parçalar halinde yapıp her parçayı denemek kolaylık sağlar.', 'Oyun kuralları genelde “sürekli tekrarla + eğer” ile yazılır.'],
  teacher: '<b>Oyun test ekibi:</b> Öğrenciler oyunlarını bitirince yanlarındakiyle yer değiştirip birbirlerinin oyununu oynasın. Oyun test edenler bir şey “güzel”, bir şey “zor”, bir şey “şöyle olsa daha iyi” yazsın. Gerçek oyun şirketlerinde de test ekipleri vardır!',
  steps: [
    { type: 'story', anim: 'think', title: 'Bir oyun nasıl yapılır? 🎮',
      text: '<p>Her oyunun dört parçası vardır:</p><ol class="tips"><li><b>Oyuncu:</b> Senin yönettiğin karakter (fare 🐭)</li><li><b>Hedef:</b> Ulaşmak istediğin şey (peynir 🧀)</li><li><b>Engeller:</b> Seni zorlayan şeyler (duvarlar, hayalet 👻)</li><li><b>Kurallar:</b> Duvara değersen başa dönersin, peynire ulaşırsan kazanırsın!</li></ol><p>Bu derste oyunu <b>adım adım</b> yapacağız; her adımda kodun bir sonrakine taşınır.</p>',
      pics: ['🐭', '🧀', '🧱', '👻', '🏆'] },
    { type: 'scratch', title: '1. adım: Fareyi sağa yürüt',
      text: `<p>Önce sadece <b>sağ ok</b> için bir kural yaz: 🏁 → başlangıca git → sürekli tekrarla [eğer <b>sağ ok basılı mı?</b> ise x'i 4 değiştir].</p>`,
      hint: '<b>x</b> sağa-sola gider. Sağa gitmek için x\'e <b>4</b> yaz. Önce <b>sürekli tekrarla</b> bloğunu koy, <b>eğer</b> bloğunu onun içine al!',
      setup: MAZE_SETUP(), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], condDefault: key('right'), edit: 'Fare',
      goals: [{ t: 'Sağ ok için bir “eğer”', f: (a) => a.count('if') >= 1 && has(a, 'Fare', '"key":"right"') }, { t: 'Fare sağa gitsin', f: (a) => a.sp('Fare').x > -120 }],
      sol: { Fare: [[['flag'], ['goto', ...START], ['forever', [MOVE4[0]]]]] },
      play: [['hold', 'right', 0.5, 1.5]] },
    { type: 'scratch', title: '2. adım: Diğer üç yönü ekle',
      text: `<p>Fare ok tuşlarıyla yürüsün! Sağ ok için yazdığın <b>eğer</b>'in aynısını diğer üç ok için de yap. Her tuşu değiştirmeyi unutma!</p>`,
      hint: '<b>x</b> sağa-sola, <b>y</b> yukarı-aşağı gider. <b>Eksi (−) işareti</b> ters yöne gitmek demek: sola gitmek için x\'e <b>-4</b>, aşağı gitmek için y\'ye <b>-4</b> yaz. Bir <b>eğer</b>\'i kopyala, sadece tuşu ile sayıyı değiştir!',
      setup: MAZE_SETUP(), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], condDefault: key('right'), edit: 'Fare', keep: true,
      goals: [{ t: 'Dört yön için dört “eğer”', f: (a) => a.count('if') >= 4 && has(a, 'Fare', '"key":"up"') && has(a, 'Fare', '"key":"left"') }, { t: 'Fare sağa gitsin', f: (a) => a.sp('Fare').x > -120 }],
      sol: { Fare: fare() },
      play: [['hold', 'right', 0.5, 1.5]] },
    { type: 'scratch', title: '3. adım: Duvarlar',
      text: '<p>Fare duvara değerse <b>başa dönsün</b>! Döngünün içine bir <b>eğer</b> koy: <b>duvara dokunuyor mu?</b> ise “boing” sesi çal ve fareyi <b>başlangıç yerine</b> götür.</p>',
      hint: 'Başlangıç yeri için üstteki <b>🏁 tıklandığında</b> altındaki <b>konuma git</b> bloğunu kopyalayabilirsin. Sayıları yeniden yazmana gerek yok!',
      setup: MAZE_SETUP(), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], condDefault: touch('duvar'), edit: 'Fare', keep: true,
      goals: [{ t: 'Duvar kuralı yaz', f: (a) => has(a, 'Fare', '"o":"duvar"') }, { t: 'Duvara değince başa dönsün', f: (a) => { if (a.touched('Fare', 'duvar')) a.mem.hit = 1; return a.mem.hit && near(a.sp('Fare'), ...START, 20); } }],
      sol: { Fare: fare(WALL) },
      play: [['hold', 'up', 0.5, 2]] },
    { type: 'scratch', title: '4. adım: Peynir = kazandın!',
      text: '<p>Bir kural daha: <b>eğer peynire dokunuyorsa</b> kazanma sesi çalsın, “Kazandım!” desin ve <b>tümünü durdur</b>. Sonra labirenti geçmeyi dene!</p>',
      hint: 'Bu <b>eğer</b>, duvar <b>eğer</b>\'iyle aynı şekilde yapılır. Sadece <b>dokunuyor mu?</b> kutusundan <b>Peynir</b>\'i seç. İçine üç şey koy: <b>kazandın sesi</b>, <b>“Kazandım!” de</b>, <b>tümünü durdur</b>.',
      setup: MAZE_SETUP(), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], condDefault: touch('Peynir'), edit: 'Fare', keep: true,
      goals: [{ t: 'Peynir kuralı yaz', f: (a) => has(a, 'Fare', '"o":"Peynir"') }, { t: 'Peynire ulaşınca “Kazandım!” desin', f: (a) => a.said('kazand', 'Fare') }],
      sol: { Fare: fare(WALL, WIN) },
      play: [['fn', 1, teleport('Fare', -150, 130)], ['hold', 'left', 1.1, 2]] },
    { type: 'story', anim: 'dance', title: 'Oyunun hazır! 🏆',
      text: '<p>Tebrikler, ilk oyununu yaptın! Şimdi bir arkadaşına oynat ve izle:</p><ol class="tips"><li>Oyunu kolay mı buldu, zor mu?</li><li>Hayaleti hızlandırmak ister misin? (⭐ Bonus adımlarında süre ve hayalet var; süzülme süresini kısaltabilirsin!)</li><li>Bir hayalet daha eklemek ister misin?</li></ol><p>Oyunu değiştirmek için önceki adımlara dönebilirsin.</p>' },
    { type: 'scratch', title: '⭐ Bonus: Süre tut',
      text: '<p><b>süre</b> değişkeniyle oyunun kaç saniye sürdüğünü göster. Peynire yeni bir betik ekle: 🏁 → süreyi 0 yap → sürekli tekrarla [1 saniye bekle, süreyi 1 değiştir].</p>',
      setup: MAZE_SETUP(), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], edit: 'Peynir', keep: true,
      goals: [{ t: 'Süreyi 🏁 ile sıfırla', use: 'setv' }, { t: 'Süre her saniye artsın', f: (a) => a.vars.süre >= 3 }],
      sol: { Fare: fare(WALL, WIN), Peynir: TIMER } },
    { type: 'scratch', title: '⭐ Bonus: Hayalet düşman 👻',
      text: '<p>Ortadaki koridora bir hayalet geldi! Koridorda yukarı aşağı gidip geliyor. Hayaletin kodu: 🏁 → x: 0 y: 20\'ye git → sürekli tekrarla [1 saniyede x: 0 y: 60\'a süzül, 1 saniyede x: 0 y: 20\'ye süzül]. Sonra fareye kural ekle: <b>eğer hayalete dokunuyorsa</b> başa dön. Hayalet alttayken üstten, üstteyken alttan geçmeyi dene!</p>',
      setup: MAZE_SETUP([sp('Hayalet', 'hayalet', 0, 20, { size: 60 })]), blocks: MAZE_BLOCKS, conds: ['key', 'touch'], condDefault: touch('Hayalet'), edit: 'Hayalet', keep: true,
      goals: [{ t: 'Hayalet koridorda yukarı aşağı gidip gelsin', f: (a) => { const y = a.sp('Hayalet').y; if (y < 25) a.mem.l = 1; if (y > 55) a.mem.r = 1; return a.mem.l && a.mem.r; } }, { t: 'Fareye hayalet kuralı ekle', f: (a) => has(a, 'Fare', '"o":"Hayalet"') }],
      sol: { Fare: fare(WALL, WIN, GHOST), Peynir: TIMER, Hayalet: [[['flag'], ['goto', 0, 20], ['forever', [['glide', 1, 0, 60], ['glide', 1, 0, 20]]]]] } },
  ],
};

// --- Yakalama oyunu ---
const CATCH_SETUP = (extra = []) => ({ backdrop: 'cayir', vars: { skor: 0, can: 3, hız: -4 }, sprites: [sp('Elma', 'elma', 0, 170), ...extra, sp('Sepet', 'sepet', 0, -150)] });
const SEPET = [[['flag'], ['goto', 0, -150], ['forever', [['setx', { r: 'mx' }]]]]];
const TOP = ['goto', R(-150, 150), 170];
const elma = (fall, catchExtra = [], missExtra = [], more = []) => [[['flag'], ['setv', 'skor', 0], ['setv', 'can', 3], ['setv', 'hız', -4], TOP, ['forever', [['chy', fall], ['if', touch('Sepet'), [['chv', 'skor', 1], ['sound', 'pop'], ...catchExtra, TOP]], ['if', cmp({ r: 'y' }, '<', -170), [...missExtra, TOP]], ...more]]]];
const CATCH_BLOCKS = ['flag', 'recv', 'bcast', 'bcastw', 'forever', 'if', 'waitUntil', 'goto', 'setx', 'chy', 'chx', 'sound', 'sayFor', 'show', 'hide', 'stop', 'setv', 'chv', 'wait', 'backdrop'];
const follow = (name) => Array.from({ length: 80 }, (_, i) => ['fn', 0.5 + i * 0.25, (w) => { w.mouse.x = w.sprite(name).x; }]);

export const b26 = {
  icon: '🍎', color: '#ff4d4d', title: 'Oyun 2: Elma Yakala', concept: 'Değişken + rastgele',
  desc: 'Gökten elmalar yağıyor! Sepetle yakala, skor topla, canlarını koru ve elmalar hızlandıkça hayatta kal.',
  learned: ['Rastgele konumlar oyunu her seferinde farklı yapar.', 'Skor ve can gibi değişkenler oyunun durumunu tutar.', 'Değişkenlerle oyunun zorluğu (hız) zamanla artırılabilir.'],
  teacher: '<b>Zorluk ayarı tartışması:</b> Öğrencilere sorun: “Bir oyun çok kolay olursa ne olur? Çok zor olursa?” Sınıfça elmanın hızı için iyi bir başlangıç değeri ve artış miktarı seçin. Farklı değerleri deneyen grupları karşılaştırın.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Elma yağmuru 🍎',
      text: '<p>Yeni oyunumuzda gökten elmalar düşüyor. Sepeti fareyle sağa sola götürüp elmaları yakalayacaksın!</p><ol class="tips"><li>Sepet fareyi takip eder.</li><li>Elma rastgele bir yerden düşer.</li><li>Yakalarsan skor artar, kaçırırsan can azalır.</li><li>⭐ Bonus: Elmalar gittikçe hızlanır!</li></ol>',
      pics: ['🍎', '⬇️', '🧺', '⭐', '❤️'] },
    { type: 'scratch', title: '1. adım: Sepet fareyi takip etsin',
      text: `<p>Sepet fareyi takip etsin! <b>sürekli tekrarla</b> içine ${blk('motion', 'x\'i (fare x) yap')} bloğunu koy. Kutuya sayı yazma; yanındaki <b>▾</b> düğmesinden <b>fare x</b> seç.</p>`,
      hint: '<b>fare x</b> = farenin sağa-sola nerede olduğu. Sepet sadece sağa-sola gitsin diye <b>x</b> bloğunu kullanıyoruz, <b>y</b> bloğunu değil.',
      setup: CATCH_SETUP(), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], edit: 'Sepet',
      goals: [{ t: '“fare x” kullan', f: (a) => has(a, 'Sepet', '"r":"mx"') }, { t: 'Sepet sağa sola gitsin', f: (a) => { const x = a.sp('Sepet').x; if (x > 80) a.mem.r = 1; if (x < -80) a.mem.l = 1; return a.mem.r && a.mem.l; } }],
      sol: { Sepet: SEPET },
      play: [['mouse', 150, 0, 1], ['mouse', -150, 0, 2]] },
    { type: 'scratch', title: '2. adım: Elma düşsün',
      text: '<p>Elma kuklasına şu kodu yaz: 🏁 → x: 0 y: 170\'e git → sürekli tekrarla [y\'yi -4 değiştir; <b>eğer y &lt; -170 ise</b> yine x: 0 y: 170\'e git]. Elma sürekli düşüp tepeye dönsün.</p>',
      hint: 'Eksi (−) işareti aşağı demek: <b>y\'yi -4 değiştir</b> elmayı aşağı indirir. Yere düşünce (<b>y &lt; -170</b>) elma tekrar tepeye (y: 170) gitsin. Eksi sayıları öğretmenin yardımıyla yaz!',
      setup: CATCH_SETUP(), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], condDefault: cmp({ r: 'y' }, '<', -170), edit: 'Elma',
      goals: [{ t: 'Elma aşağı düşsün', f: (a) => { if (a.sp('Elma').y < 100) a.mem.d = 1; return !!a.mem.d; } }, { t: 'Elma tepeye dönsün', f: (a) => a.mem.d && a.sp('Elma').y > 160 }],
      sol: { Sepet: SEPET, Elma: [[['flag'], ['goto', 0, 170], ['forever', [['chy', -4], ['if', cmp({ r: 'y' }, '<', -170), [['goto', 0, 170]]]]]]] } },
    { type: 'scratch', title: '3. adım: Rastgele yerden ve skor',
      text: '<p>Elma <b>rastgele</b> bir yerden düşsün! <b>x</b> için “rastgele -150 ile 150” bloğunu koy. Elma sepete değerse <b>skoru 1 değiştir</b>. Her yakalayışta skor bir artar! 🏁 ile skoru 0 yapmayı unutma.</p>',
      hint: '<b>rastgele</b> bloğu bir <b>zar</b> gibidir; her seferinde başka sayı seçer. Onu <b>konuma git</b> bloğundaki <b>x</b> kutusuna sürükle. <b>y</b> kutusu hep <b>170</b> kalsın, çünkü elma gökyüzünden düşer!',
      setup: CATCH_SETUP(), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], condDefault: touch('Sepet'), edit: 'Elma', keep: true,
      goals: [{ t: '“rastgele” kullan', f: (a) => has(a, 'Elma', '"r":"rand"') }, { t: '3 elma yakala', f: (a) => a.vars.skor >= 3 }],
      sol: { Sepet: SEPET, Elma: elma(-4) }, play: follow('Elma') },
    { type: 'scratch', title: '4. adım: Üç can ❤️',
      text: '<p>Elma yere düşerse <b>canı -1 değiştir</b>. <b>-1</b> demek bir can eksilir. <b>can = 0</b> olunca <b>“Oyun bitti!”</b> de ve <b>tümünü durdur</b>. 🏁 ile canı 3 yapmayı unutma.</p>',
      hint: 'Yere düşme <b>eğer</b>\'inin içine <b>can</b> için <b>-1 değiştir</b> bloğunu ekle. Sonra yeni bir <b>eğer can = 0 ise</b> yaz. Başta <b>can</b> 3 olmalı: 🏁\'ten sonra <b>canı 3 yap</b>.',
      setup: CATCH_SETUP(), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], condDefault: cmp(V('can'), '=', 0), edit: 'Elma', keep: true, testTime: 25,
      goals: [{ t: 'Kaçırınca can azalsın', f: (a) => a.vars.can < 3 }, { t: 'Can bitince “Oyun bitti” desin', f: (a) => a.said('oyun bitti') }],
      sol: { Sepet: SEPET, Elma: elma(-4, [], [['chv', 'can', -1]], [['if', cmp(V('can'), '=', 0), [['sayFor', 'Oyun bitti!', 1], ['stop']]]]) },
      play: [['mouse', 230, 0, 0.5]] },
    { type: 'story', anim: 'dance', title: 'Oyunu geliştir 🛠️',
      text: '<p>Oyunun çalışıyor! İstersen geri dönüp şunları dene:</p><ol class="tips"><li>Başlangıç hızını değiştir: oyun kolaylaşıyor mu, zorlaşıyor mu?</li><li>Kazanmak için gereken skoru 10 yap.</li><li>Elma yerine yıldız ya da kalp yakala!</li></ol>' },
    { type: 'scratch', title: '⭐ Bonus: Hızlanan elmalar ⚡',
      text: '<p>Oyun zorlaşsın! <b>hız</b> değişkenini kullan: 🏁 ile hızı -4 yap; düşerken <b>y\'yi (hız) değiştir</b>; her yakalayışta <b>hızı -1 değiştir</b> (daha hızlı düşer).</p>',
      setup: CATCH_SETUP(), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], condDefault: touch('Sepet'), edit: 'Elma', keep: true,
      goals: [{ t: 'Düşerken hız değişkenini kullan', f: (a) => has(a, 'Elma', '"op":"chy","args":{"n":{"r":"var","v":"hız"}}') }, { t: 'Elma hızlansın', f: (a) => a.vars.hız <= -6 }],
      sol: { Sepet: SEPET, Elma: elma(V('hız'), [['chv', 'hız', -1]], [['chv', 'can', -1]], [['if', cmp(V('can'), '=', 0), [['sayFor', 'Oyun bitti!', 1], ['stop']]]]) }, play: follow('Elma') },
    { type: 'scratch', title: '⭐ Bonus: Kazanma ekranı 🏆',
      text: '<p>Skor 5 olunca oyun kazanılsın! Elmaya kural ekle: <b>eğer skor = 5 ise</b> gizlen, <b>“kazandın” haberini sal ve bekle</b>, tümünü durdur.</p><p>Kedinin kodu: 🏁 → gizle. “kazandın” haberini aldığımda → göster, “Tebrikler!” de 2 saniye.</p>',
      setup: CATCH_SETUP([sp('Kedi', 'kedi', 0, 20, { visible: false })]), blocks: CATCH_BLOCKS, reporters: ['mx', 'rand', 'var'], conds: ['touch', 'cmp'], msgs: ['kazandın'], condDefault: cmp(V('skor'), '=', 5), edit: 'Elma', keep: true, testTime: 30,
      goals: [{ t: '“kazandın” haberini sal', f: (a) => a.bcast('kazandın') }, { t: 'Kedi görünüp “Tebrikler!” desin', f: (a) => a.sp('Kedi').visible && a.said('tebrik', 'Kedi') }],
      sol: { Sepet: SEPET, Elma: elma(V('hız'), [['chv', 'hız', -1]], [['chv', 'can', -1]], [['if', cmp(V('skor'), '=', 5), [['hide'], ['bcastw', 'kazandın'], ['stop']]]]), Kedi: [[['flag'], ['hide']], [['recv', 'kazandın'], ['show'], ['sound', 'kazandin'], ['sayFor', 'Tebrikler!', 2]]] },
      play: follow('Elma') },
  ],
};

// --- Uzay kaçışı ---
const SPACE_SETUP = (extra = []) => ({ backdrop: 'uzay', vars: { skor: 0 }, sprites: [sp('Göktaşı', 'asteroit', 240, 0, { rot: 'all' }), ...extra, sp('Roket', 'roket', -180, 0, { rot: 'all' })] });
const ROKET_MOVE = [['if', key('up'), [['chy', 6]]], ['if', key('down'), [['chy', -6]]]];
const roket = (...more) => [[['flag'], ['goto', -180, 0], ['point', 90], ['forever', [...ROKET_MOVE, ...more]]]];
const rock = (speed, y = R(-100, 100)) => [[['flag'], ['goto', 240, y], ['forever', [['chx', speed], ['if', cmp({ r: 'x' }, '<', -200), [['goto', 240, y]]]]]]];
const CRASH = ['if', touch('Göktaşı'), [['sound', 'boing'], ['sayFor', 'Oyun bitti!', 1], ['stop']]];
const SCORE = [[['flag'], ['setv', 'skor', 0], ['forever', [['wait', 1], ['chv', 'skor', 1]]]]];
const SPACE_BLOCKS = ['flag', 'forever', 'if', 'goto', 'point', 'chx', 'chy', 'sound', 'sayFor', 'stop', 'setv', 'chv', 'wait', 'next'];
const wraps = (name) => (a) => { const x = a.sp(name).x; if (x < -150 && !a.mem[name]) { a.mem[name] = 1; a.mem[name + 'n'] = (a.mem[name + 'n'] || 0) + 1; } if (x > 200) a.mem[name] = 0; return a.mem[name + 'n'] >= 2; };

export const b27 = {
  icon: '🚀', color: '#2c2a6b', title: 'Oyun 3: Uzay Kaçışı', concept: 'Oyun döngüsü',
  desc: 'Roketini göktaşlarından kaçır! Ne kadar uzun dayanırsan o kadar puan.',
  learned: ['Bir kukla ekranın bir ucundan çıkınca diğer ucundan yeniden girebilir.', 'Süreye bağlı puan, “hayatta kalma” oyunlarının temelidir.', 'Aynı kodu başka bir kuklaya da yazarak oyunu zorlaştırabiliriz.'],
  teacher: '<b>Kodu yeniden kullanma:</b> ⭐ Bonus adımda ikinci göktaşı için öğrencilerin ilk göktaşının kodunu “kopyalaması” gerekir. Gerçek Scratch\'te bir betiği başka kuklanın üstüne sürükleyerek kopyalayabileceklerini gösterin. Programcıların sık yaptığı “kodu yeniden kullanma” fikrini konuşun.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Uzayda tehlike! ☄️',
      text: '<p>Roketin uzayda yol alıyor ama karşıdan göktaşları geliyor! Yukarı-aşağı ok tuşlarıyla kaçacaksın.</p><p>Göktaşı sağdan sola uçar; sol kenara gelince yeniden sağdan, <b>rastgele bir yükseklikten</b> çıkar. Çarparsan oyun biter. Dayandığın her saniye 1 puan!</p>',
      pics: ['🚀', '☄️', '⬆️', '⬇️', '⏱️'] },
    { type: 'scratch', title: '1. adım: Roket kontrolü',
      text: '<p>Roket yukarı ve aşağı gitsin! <b>sürekli tekrarla</b> içine iki <b>eğer</b> koy: <b>yukarı ok</b> basılıysa <b>y\'yi 6 değiştir</b>, <b>aşağı ok</b> basılıysa <b>y\'yi -6 değiştir</b>. (Başta 🏁 → x: -180 y: 0\'a git.)</p>',
      hint: '<b>y</b> yukarı-aşağı gider. Yukarı için <b>6</b>, aşağı için <b>-6</b> yaz. <b>-6</b>\'daki <b>eksi (−)</b> aşağı demek. Labirent dersindeki ok tuşu kodunu hatırla!',
      setup: SPACE_SETUP(), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: key('up'), edit: 'Roket',
      goals: [{ t: 'Yukarı ve aşağı için iki “eğer”', f: (a) => has(a, 'Roket', '"key":"up"') && has(a, 'Roket', '"key":"down"') }, { t: 'Roket yukarı çıksın', f: (a) => a.sp('Roket').y > 60 }, { t: 'Roket aşağı insin', f: (a) => a.sp('Roket').y < -60 }],
      sol: { Roket: roket() },
      play: [['hold', 'up', 0.5, 1.5], ['hold', 'down', 1.6, 3.5]] },
    { type: 'scratch', title: '2. adım: Göktaşı gelsin',
      text: '<p>Göktaşı sağdan sola uçsun! 🏁 → x: 240 y: 0\'a git → sürekli tekrarla [x\'i -8 değiştir; <b>eğer x &lt; -200 ise</b> yine x: 240 y: 0\'a git].</p>',
      hint: '<b>x</b> sağa-sola gider. <b>-8</b> sola gitmek demek. Göktaşı sol kenarı geçince tepeye dönmesi için <b>eğer x &lt; -200</b> yaz ve içine <b>konuma git (x: 240 ...)</b> koy.',
      setup: SPACE_SETUP(), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: cmp({ r: 'x' }, '<', -200), edit: 'Göktaşı', keep: true,
      goals: [{ t: 'Göktaşı iki kez ekranı geçsin', f: wraps('Göktaşı') }],
      sol: { Roket: roket(), Göktaşı: rock(-8, 0) } },
    { type: 'scratch', title: '3. adım: Rastgele yükseklik',
      text: '<p>Göktaşı her seferinde <b>başka bir yükseklikten</b> gelsin! <b>konuma git</b>\'teki <b>y</b> kutusuna “rastgele -100 ile 100” bloğunu koy (iki yerde de).</p>',
      hint: '<b>rastgele</b> bloğu bir zar gibidir. Onu <b>konuma git</b> bloğundaki <b>y</b> kutusuna sürükle. Hem 🏁 altındaki hem <b>eğer</b> içindeki <b>konuma git</b> için yap.',
      setup: SPACE_SETUP(), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: cmp({ r: 'x' }, '<', -200), edit: 'Göktaşı', keep: true,
      goals: [{ t: '“rastgele” kullan', f: (a) => has(a, 'Göktaşı', '"r":"rand"') }, { t: 'Göktaşı iki kez ekranı geçsin', f: wraps('Göktaşı') }],
      sol: { Roket: roket(), Göktaşı: rock(-8) } },
    { type: 'scratch', title: '4. adım: Çarpışma 💥',
      text: '<p>Rokete kural ekle: <b>eğer göktaşına dokunuyorsa</b> “boing” sesi, “Oyun bitti!” de ve tümünü durdur.</p>',
      hint: 'Bu, labirent dersindeki <b>peynir kuralı</b> gibi. Rokete <b>eğer Göktaşı\'na dokunuyor mu? ise</b> koy. İçine <b>boing sesi</b>, <b>“Oyun bitti!” de</b>, <b>tümünü durdur</b> ekle.',
      setup: SPACE_SETUP(), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: touch('Göktaşı'), edit: 'Roket', keep: true,
      goals: [{ t: 'Çarpışma kuralı yaz', f: (a) => has(a, 'Roket', '"o":"Göktaşı"') }, { t: 'Çarpınca “Oyun bitti!” desin', f: (a) => a.said('oyun bitti', 'Roket') }],
      sol: { Roket: roket(CRASH), Göktaşı: rock(-8) },
      play: Array.from({ length: 30 }, (_, i) => ['fn', 1 + i * 0.2, (w) => { w.sprite('Roket').y = w.sprite('Göktaşı').y; }]) },
    { type: 'scratch', title: '5. adım: Puan',
      hint: 'Rokete <b>yeni bir betik</b> ekle: 🏁 tıklandığında → <b>skoru 0 yap</b> → <b>sürekli tekrarla</b>: <b>1 saniye bekle</b>, <b>skoru 1 değiştir</b>. Her saniye 1 puan!',
      text: '<p>Dayandığın her saniye puan kazan! Rokete yeni bir betik: 🏁 → skoru 0 yap → sürekli tekrarla [1 saniye bekle, skoru 1 değiştir].</p>',
      setup: SPACE_SETUP(), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], edit: 'Roket', keep: true,
      goals: [{ t: 'Skoru 🏁 ile sıfırla', use: 'setv' }, { t: 'Skor her saniye artsın', f: (a) => a.vars.skor >= 3 }],
      sol: { Roket: [...roket(CRASH), ...SCORE], Göktaşı: rock(-8) },
      // Test: roket göktaşından en uzak yüksekliğe kaçar (CRASH kuralı oyunu bitirmesin)
      play: Array.from({ length: 50 }, (_, i) => ['fn', i * 0.1, (w) => { const g = w.sprite('Göktaşı').y; w.sprite('Roket').y = g > 0 ? -120 : 120; }]) },
    { type: 'story', anim: 'dance', title: 'Üç oyun yaptın! 🎮🎮🎮',
      text: '<p>Labirent, elma yakalama ve uzay kaçışı… Artık bir oyun yapımcısısın!</p><p>Fark ettin mi? Üç oyunda da aynı fikirleri kullandık: <b>olaylar, sürekli tekrarla, eğer, değişkenler, rastgelelik</b>. Gelecek derste bu fikirlerle <b>kendi projeni</b> yapacaksın.</p>' },
    { type: 'scratch', title: '⭐ Bonus: İkinci göktaşı ☄️☄️',
      text: '<p>Oyun daha heyecanlı olsun: <b>Göktaşı2</b> geldi! Birinci göktaşının kodunu Göktaşı2 için de yaz (hızını -5 yap ki farklı olsun). Rokete de Göktaşı2 çarpışma kuralı ekle.</p>',
      setup: SPACE_SETUP([sp('Göktaşı2', 'asteroit', 240, 100, { rot: 'all', size: 70 })]), blocks: SPACE_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: cmp({ r: 'x' }, '<', -200), edit: 'Göktaşı2', keep: true,
      goals: [{ t: 'Göktaşı2 iki kez ekranı geçsin', f: wraps('Göktaşı2') }, { t: 'Rokete Göktaşı2 kuralı ekle', f: (a) => has(a, 'Roket', '"o":"Göktaşı2"') }],
      sol: { Roket: [...roket(CRASH, ['if', touch('Göktaşı2'), [['sayFor', 'Oyun bitti!', 1], ['stop']]]), ...SCORE], Göktaşı: rock(-8), Göktaşı2: rock(-5) },
      // Test: roket her an iki göktaşından da en uzak yüksekliğe kaçar
      play: Array.from({ length: 140 }, (_, i) => ['fn', i * 0.1, (w) => { const a = w.sprite('Göktaşı').y; const b = w.sprite('Göktaşı2').y; w.sprite('Roket').y = [-170, -85, 0, 85, 170].sort((p, q) => Math.min(Math.abs(q - a), Math.abs(q - b)) - Math.min(Math.abs(p - a), Math.abs(p - b)))[0]; }]) },
  ],
};

export const b28 = {
  icon: '🏆', color: '#d97706', title: 'Kendi Projen', concept: 'Kendi projen',
  desc: 'Öğrendiğin her şeyi kullanarak kendi oyununu, hikâyeni ya da sanat eserini yap. Sonra gerçek Scratch\'e geç!',
  learned: ['Bir fikri plana, planı koda dönüştürebilirsin.', 'Olay, döngü, koşul, değişken ve haber salma her projede işe yarar.', 'Aynı blokları scratch.mit.edu adresinde gerçek Scratch\'te de kullanabilirsin.'],
  teacher: '<b>Proje fuarı:</b> Ders sonunda sınıfı bir “bilim fuarına” çevirin: her öğrenci projesini açık bırakır, diğerleri gezip dener ve yapışkan nota bir övgü yazar. İsteyen öğrenciler aile izniyle scratch.mit.edu üzerinde hesap açıp projelerini yeniden yapabilir.',
  steps: [
    { type: 'story', anim: 'think', title: 'Sıra sende! 💡',
      text: '<p>Şimdi <b>kendi projeni</b> yap! Bir tane seç:</p><ol class="tips"><li>🎮 <b>Oyun:</b> Yakala, kaç, labirent…</li><li>📖 <b>Hikâye:</b> Konuşan karakterler, sahne değişimleri</li><li>🎨 <b>Sanat:</b> Kalemle desenler</li><li>🎵 <b>Müzik:</b> Kendi şarkın ve dans eden kuklalar</li></ol><p>Kâğıda üç şey yaz: <b>Kukla kim? Ne olacak? Nasıl bitecek?</b></p>',
      pics: ['🎮', '📖', '🎨', '🎵'] },
    { type: 'quiz', title: 'Hatırla: döngü',
      q: 'Bir kukla oyun boyunca hiç durmadan hareket etsin istiyorsak hangi bloğu kullanırız?',
      opts: ['10 kez tekrarla', 'bekle', 'sürekli tekrarla'], a: 2, ok: 'Sürekli tekrarla, ⏹ basılana kadar devam eder.' },
    { type: 'quiz', title: 'Hatırla: koşul',
      q: '“Karakter yıldıza değerse puan kazansın.” Bunun için hangi blok gerekir?',
      opts: ['eğer yıldıza dokunuyor mu? ise', 'rastgele konuma git', 'kalemi bastır'], a: 0, ok: 'Algılama + eğer: kuralların temel taşı!' },
    { type: 'quiz', title: 'Hatırla: değişken',
      q: 'Oyundaki puanı saklamak için ne kullanırız?',
      opts: ['Kostüm', 'Değişken', 'Dekor'], a: 1, ok: 'Değişken: üzerinde adı yazan bir kutu. Skor, can, süre…' },
    { type: 'scratch', title: 'Hazır başlangıç: Kedi fareyi takip etsin',
      text: '<p>Fikrin yoksa buradan başla! Sahne hazır: <b>Kedi</b> ve <b>Elma</b>. Kediye şu kodu yaz: 🏁 → sürekli tekrarla [fare imlecine git]. Kedi fareyi takip etsin. Fikrin varsa bu adımı hızlıca geçip bir sonraki adımda kendi projene başlayabilirsin.</p>',
      hint: '<b>🏁 tıklandığında</b> bloğunun altına <b>sürekli tekrarla</b>, onun içine <b>fare imlecine git</b> bloğunu koy.',
      setup: { backdrop: 'cayir', vars: { skor: 0 }, sprites: [sp('Kedi', 'kedi', -120, -60), sp('Elma', 'elma', 100, 100)] },
      blocks: ['flag', 'forever', 'gotoMouse', 'gotoRand', 'wait', 'if', 'chv', 'setv', 'sound'], conds: ['touch'], reporters: ['var'], edit: 'Kedi',
      goals: [{ t: 'Fare imlecine git bloğunu kullan', use: 'gotoMouse' }, { t: 'Kedi fareyi takip etsin', f: (a) => a.sp('Kedi').x > 60 }],
      sol: { Kedi: [[['flag'], ['forever', [['gotoMouse']]]]] },
      play: [['mouse', 120, 40, 1]] },
    { type: 'scratch', title: 'Bitirme projen',
      text: '<p>Kendi projeni yap! ➕ ile <b>kukla</b> ekle, 🖼 ile <b>dekor</b> seç. Listedeki işlerin hepsi ✅ olunca <b>✔ Bitirdim</b>\'e bas. Fikrin yoksa ➕ ile Elma ekleyip kedi ve elmayla devam et. ⭐ Bonus: projene bir <b>can</b> ekle!</p>',
      hint: 'Kediye <b>eğer Elma\'ya dokunuyor mu? ise</b> koy, içine <b>skoru 1 değiştir</b> ekle. Elma\'ya da <b>sürekli tekrarla</b> içinde <b>rastgele konuma git</b> ve <b>1 saniye bekle</b> ekle. Bitirince <b>ses</b> ya da <b>can</b> eklemeyi dene!',
      setup: { backdrop: 'cayir', vars: { skor: 0, can: 3 }, sprites: [sp('Kedi', 'kedi', -120, -60)] },
      testSetup: { backdrop: 'cayir', vars: { skor: 0, can: 3 }, sprites: [sp('Kedi', 'kedi', -120, -60), sp('Elma', 'elma', 100, 100)] },
      blocks: ['flag', 'click', 'key', 'recv', 'bcast', 'bcastw', 'move', 'turnR', 'turnL', 'goto', 'gotoRand', 'gotoMouse', 'glide', 'point', 'chx', 'setx', 'chy', 'sety', 'bounce', 'sayFor', 'say', 'thinkFor', 'next', 'costumeN', 'backdrop', 'size', 'chsize', 'color', 'clearfx', 'show', 'hide', 'sound', 'soundW', 'note', 'rest', 'wait', 'repeat', 'forever', 'if', 'ife', 'waitUntil', 'until', 'stop', 'clear', 'down', 'up', 'pcolor', 'psize', 'stamp', 'setv', 'chv'],
      reporters: ['rand', 'x', 'y', 'mx', 'my', 'var'], msgs: ['başla', 'kazandın', 'mesaj1'], library: true, free: true,
      goals: [{ t: 'En az iki kukla', f: (a) => a.w.sprites.length >= 2 }, { t: 'Bir döngü (tekrarla / sürekli)', f: (a) => a.uses('repeat') || a.uses('forever') || a.uses('until') }, { t: 'Bir koşul (eğer…)', f: (a) => a.uses('if') || a.uses('ife') || a.uses('until') || a.uses('waitUntil') }, { t: 'Bir değişken ya da ses', f: (a) => a.uses('chv') || a.uses('setv') || a.uses('sound') || a.uses('note') }],
      sol: { Kedi: [[['flag'], ['setv', 'skor', 0], ['forever', [['gotoMouse'], ['if', touch('Elma'), [['chv', 'skor', 1]]]]]]], Elma: [[['flag'], ['forever', [['gotoRand'], ['wait', 1]]]]] } },
    { type: 'story', anim: 'wave', title: 'Gerçek Scratch\'e geçiş 🐱',
      text: '<p>Burada öğrendiğin bloklar gerçek <b>Scratch</b>\'te birebir aynı! Scratch ücretsizdir:</p><ol class="tips"><li>Tarayıcıda <b>scratch.mit.edu</b> adresine git ve <b>“Oluştur”</b>a tıkla.</li><li>Projelerini kaydetmek için ailen ya da öğretmeninle birlikte hesap aç.</li><li>İnternetsiz çalışmak için “Scratch Uygulaması”nı indirebilirsin.</li></ol><p><b>Küçük bir fark:</b> Gerçek Scratch\'te 🏁\'e basınca kuklalar kendiliğinden başa dönmez. O yüzden her betiğin başına <b>“x: y: konumuna git”</b> gibi başlangıç blokları koymayı unutma!</p>' },
    { type: 'story', anim: 'dance', title: 'Tebrikler, programcı! 🎓',
      text: '<p>Robo\'ya ilk adımını attırdığın günden bugüne çok yol aldın: algoritma, döngü, fonksiyon, koşul, değişken, haber salma… ve kendi oyunların!</p><p>Son bir hafta daha var: <b>Scratch ustalığı</b>! Soru soran kuklalar, matematik oyunları ve klonlarla dolu bir uzay savaşı seni bekliyor. 🚀</p>',
      pics: ['🤖', '🐱', '🎮', '🏆', '🎓'] },
  ],
};
