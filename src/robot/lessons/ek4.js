// Ek bölümler (4): Usta Robo (ızgara) ve Dijital Sanat (kalem). Hızlı bitirenler ve tekrar için.
// Harita karakterleri için h1.js'nin başındaki açıklamaya bakın.
import { boardPic, codePic } from '../board.js';
import { sp, blk, V, shape, has } from './sh.js';

// --- Usta Robo ---
export const b39 = {
  icon: '🎓', color: '#0d9488', title: 'Usta Robo', concept: 'Hepsini birleştir',
  desc: 'Döngü, fonksiyon ve koşul bir arada! Robo\'nun en kurnaz bulmacalarını çöz ve en kısa programı bul.',
  learned: ['Büyük bir problemi küçük parçalara ayırırız: önce bir basamak, sonra tekrarı.', 'Döngü aynı parçayı arka arkaya, fonksiyon ise farklı yerlerde tekrar eder.', 'Koşul sayesinde tek bir program birden çok haritada çalışabilir.'],
  teacher: '<b>Beden programı (bilgisayarsız):</b> Yere bant ya da tebeşirle 5×5 bir ızgara çizin. Bir öğrenci “Robo” olsun. Tahtaya <b>3 kez tekrarla: [2 ileri, sağa dön]</b> yazın. Sınıf önce “bu program Robo\'yu nereye götürür?” diye tahmin etsin, sonra Robo programı adım adım yürüsün. Tahminle gerçeği karşılaştırın: yanlış tahmin eden kendi hatasını bulsun (hata ayıklama). Sonra “aynı işi daha az blokla yapabilir miyiz?” diye sorun. <b>Paylaşılan bilgisayar:</b> Bir öğrenci “sürücü”, diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Usta Robo\'ya hoş geldin! 🎓',
      text: '<p>Robo\'nun bütün komutlarını biliyorsun: <b>döngü</b> 🔁, <b>fonksiyon</b> 🧩 ve <b>koşul</b> ❓. Şimdi hepsini <b>birlikte</b> kullanma zamanı!</p><ol class="tips"><li><b>Tahmin et:</b> Programı çalıştırmadan önce Robo\'nun nereye gideceğini kafanda çalıştır.</li><li><b>Hatayı bul:</b> Bozuk bir programı onar.</li><li><b>Kısa yaz:</b> Her görevde en fazla kaç blok kullanabileceğin yazıyor. ⭐⭐⭐ için en kısasını bul!</li></ol>',
      pics: ['🔮', '🐞', '✂️', '🎓'] },
    { type: 'grid', title: 'Çift basamak',
      text: '<p>Bu merdivenin her basamağı aynı: <b>2 ileri, sola dön, 1 ileri, sağa dön</b>. Üç basamak var. İç içe döngü kullanabilirsin. En fazla <b>6 blok</b>.</p>',
      map: ['######G', '####..*', '##*..##', 'S..####'], dir: 'E', tools: ['F', 'L', 'R', 'loop'], max: 6, loopN: 3, sol: '3(2(F)LFR)',
      hint: 'Önce tek basamağı yaz: 2 kez İleri git, Sola dön, İleri git, Sağa dön. Sonra hepsini 3 kez tekrarla bloğuna koy.' },
    { type: 'quiz', title: 'Önce tahmin et! 🔮',
      pic: boardPic(['.....', '.....', '.....', 'S....', '.....'], 'N') + codePic('2(3(F)R)'),
      q: 'Robo yukarı bakıyor. Programı çalıştırmadan söyle: <b>2 kez [3 ileri, sağa dön]</b> bitince Robo nerede olur?',
      opts: ['Başladığı karede', '3 kare yukarıda ve 3 kare sağda', '6 kare yukarıda'], a: 1,
      ok: 'İlk turda 3 kare yukarı çıkıp sağa dönüyor. İkinci turda 3 kare sağa gidip tekrar dönüyor. Yani 3 yukarı, 3 sağ!' },
    { type: 'quiz', title: 'Fonksiyon ne yapar?',
      pic: codePic('3(f)', 'FFR', 'Kenar'),
      q: '<b>Kenar</b> fonksiyonu: 2 ileri, sağa dön. Robo doğuya (sağa) bakıyor ve program <b>3 kez Kenar</b> çağırıyor. Robo nerede olur?',
      opts: ['Başladığı karede, doğuya bakarak', 'Başladığı yerden 6 kare ileride', 'Başladığı yerden 2 kare aşağıda, yukarı bakarak'], a: 2,
      ok: 'Robo bir kare çiziyor ama sadece üç kenarını yürüdü: 2 sağa, 2 aşağı, 2 sola. Başladığı yerin 2 kare aşağısında ve yukarı bakıyor!' },
    { type: 'grid', title: 'İki merdiven, bir parça 🧩',
      text: '<p>Bu yolda aynı merdiven <b>iki kez</b> çıkılıyor, arada 2 kare düz yol var. Basamağı <b>Basamak</b> fonksiyonuna koy (ileri, sola dön, ileri, sağa dön). En fazla <b>10 blok</b>: fonksiyondaki bloklar da sayılır.</p>',
      map: ['########G', '#######.*', '######..#', '###....##', '##*.#####', '#..######', 'S.#######'], dir: 'E', tools: ['F', 'L', 'R', 'loop', 'fn'], fnName: 'Basamak', max: 10, loopN: 3, sol: '3(f)2(F)3(f)', fnSol: 'FLFR',
      hint: 'Basamak = İleri git, Sola dön, İleri git, Sağa dön. Programım: 3 kez Basamak, 2 kez İleri git, yine 3 kez Basamak.' },
    { type: 'quiz', title: 'Pile ulaşır mı?',
      pic: boardPic(['S..', '##.', '##G']) + codePic('5(e{open}(F)(R))'),
      q: 'Program: <b>5 kez [eğer önüm açık ise İleri git, değilse Sağa dön]</b>. Robo pile ulaşır mı?',
      opts: ['Evet, pile ulaşır', 'Hayır, ağaca çarpar', 'Hayır, suya düşer'], a: 0,
      ok: 'Robo önü açıkken ilerliyor, yol sonlanınca sağa dönüyor. Haritada yol tam bu şekilde kıvrılıyor!' },
    { type: 'grid', title: 'Hatayı bul 🐞',
      text: '<p>Bu program üç haritada da yukarı (sola) kıvrılan yolları geçmek için yazılmış. Ama Robo pile ulaşamıyor! Bir blok yanlış. Programı çalıştır, haritaları tek tek dene ve onar.</p>',
      maps: [['##G', '##.', '##.', 'S..'], ['#G', '#.', '#.', '#.', 'S.'], ['###G', '###.', 'S...']], dir: 'E', tools: ['F', 'L', 'R', 'loop', 'if'], conds: ['blocked', 'open', 'star'], loopN: 5, preset: '5(i{blocked}(R)F)', sol: '5(i{blocked}(L)F)',
      hint: 'Yol hep yukarı (sola) kıvrılıyor ama programda engel görünce sağa dönülüyor. Sağa dön bloğunu silip Sola dön koy.' },
    { type: 'grid', title: 'Yolu kendi bulsun',
      text: '<p>Üç labirentte yollar farklı yerlerde sağa ya da sola kıvrılıyor ve yıldızlar yolda. Tek bir program yaz: <b>pile ulaşana kadar</b> önü açıksa ilerle; değilse solu açıksa sola, değilse sağa dön; yıldızın üstündeysen al. En fazla <b>8 blok</b>.</p>',
      maps: [['S.*.#', '###.#', '###*G'], ['###G', '###*', 'S*..'], ['S.*#', '##.G']], dir: 'E', tools: ['F', 'L', 'R', 'P', 'until', 'if', 'ife'], conds: ['goal', 'open', 'left', 'star', 'blocked'], pick: true, max: 8, ifCond: 'open', sol: 'u{goal}(e{open}(F)(e{left}(L)(R))i{star}(P))',
      hint: 'Pile ulaşana kadar tekrarla [eğer önüm açık ise İleri git, değilse (eğer solum açık ise Sola dön, değilse Sağa dön); sonra eğer yıldızın üstündeysem Yıldızı al].' },
    { type: 'grid', title: '⭐ Geri dön, anahtarı al',
      text: '<p>Robo bu sefer yanlış tarafa bakıyor! Önce arkasındaki 🔑 anahtarı almalı, sonra dönüp kapıdan geçerek pile gitmeli. En fazla <b>7 blok</b>. Sağa dön bloğu yok: dönmek için iki kez Sola dön!</p>',
      map: ['k..S...D.G'], dir: 'E', tools: ['F', 'L', 'loop'], max: 7, loopN: 2, sol: '2(2(L)3(F))6(F)',
      hint: 'İki kez Sola dön = geri dönmek. Anahtar 3 kare arkada: dön, 3 ileri git. Sonra tekrar dön ve 3 ileri git: aynı parça iki kez! Robo başladığı kareye gelince, pile 6 kare kalır.' },
    { type: 'grid', title: '⭐ Usta bulmacası',
      text: '<p>Final! Yılan gibi kıvrılan bir yol: önce 🔑 anahtar, sonra ⭐ yıldız, en sonda kapıdan geçip 🔋 pil. Uzun koridor üç kez geçiliyor, <b>Koridor</b> fonksiyonuna 5 kare ileriyi koy. En fazla <b>13 blok</b>: fonksiyondaki bloklar da sayılır.</p>',
      map: ['S....k', '#####.', '*.....', '.#####', '..D..G'], dir: 'E', tools: ['F', 'L', 'R', 'loop', 'fn'], fnName: 'Koridor', max: 13, loopN: 5, sol: 'fR2(F)RfL2(F)Lf', fnSol: '5(F)',
      hint: 'Koridor = 5 kez İleri git. Programım: Koridor, sağa dön, 2 ileri, sağa dön, Koridor, sola dön, 2 ileri, sola dön, Koridor.' },
    { type: 'story', anim: 'dance', title: 'Usta Robo sensin! 🏅',
      text: '<p>Tahmin ettin, hata buldun, programları kısalttın. Bir programcının üç büyük becerisi bunlar: <b>planla, dene, düzelt.</b></p><p>Sıradaki bölümde bu bilgileri başka bir alanda kullanacaksın: <b>kalemle sanat yapmak</b>! 🎨</p>',
      pics: ['🔮', '🐞', '✂️', '🏅'] },
  ],
};

// --- Dijital Sanat ---
// Çizgilerin yön ve uzunlukları; düzgün çokgen ve sarmal denetimi için
const segs = (lines) => lines.map((l) => ({ len: Math.hypot(l.x2 - l.x1, l.y2 - l.y1), ang: Math.atan2(l.y2 - l.y1, l.x2 - l.x1) * 180 / Math.PI }));
// Art arda iki çizgi arasındaki dönüş açıları (derece, -180 ile 180 arası)
const turnsOf = (lines) => {
  const s = segs(lines);
  return s.slice(1).map((c, i) => { let d = c.ang - s[i].ang; while (d > 180) d -= 360; while (d <= -180) d += 360; return d; });
};
// n kenarlı düzgün çokgen: n çizgi, kapalı, kenarlar eşit, her köşede 360 ÷ n derece dönüş
const poly = (lines, n) => {
  if (lines.length !== n || !shape(lines).closed) return false;
  const s = segs(lines);
  if (s[0].len < 30 || s.some((x) => Math.abs(x.len - s[0].len) > s[0].len * 0.06)) return false;
  const t = turnsOf(lines);
  return t.every((d) => Math.abs(Math.abs(d) - 360 / n) < 2.5 && Math.sign(d) === Math.sign(t[0]));
};
// Belli açıda (± 2.5 derece) kaç dönüş var?
const turnsNear = (lines, deg) => turnsOf(lines).filter((d) => Math.abs(Math.abs(d) - deg) < 2.5).length;
const colorsOf = (lines) => new Set(lines.map((l) => l.color)).size;

const PEN = ['flag', 'clear', 'down', 'up', 'move', 'turnR', 'turnL', 'repeat', 'goto', 'point', 'pcolor', 'psize'];
const kalem = (x = 0, y = 0) => ({ backdrop: 'beyaz', sprites: [sp('Kalem', 'kalem', x, y, { rot: 'all' })] });
const START = (x, y) => [['flag'], ['clear'], ['goto', x, y], ['point', 90]];
const RED = '#ff4d4d';
const BLUE = '#4c97ff';
const YELLOW = '#ffbf00';

export const b40 = {
  icon: '🎨', color: '#e11d74', title: 'Dijital Sanat', concept: 'Kalem + döngü + değişken',
  desc: 'Düzgün çokgenler, çiçek rozetleri, büyüyen sarmallar ve renkli desenler: kodla resim yap, sonunda kendi tablonu çiz!',
  learned: ['Düzgün bir çokgende dönüş açısı 360 ÷ kenar sayısıdır: altıgen için 360 ÷ 6 = 60.', 'İç içe döngüyle bir şekli döndüre döndüre rozet ve çiçek çizebiliriz.', 'Değişken, her turda değişen bir sayıdır: kenar uzunluğunu büyütünce sarmal olur.'],
  teacher: '<b>Yerde çokgen (bilgisayarsız):</b> Yere bantla büyük bir çizgi çekin. Bir öğrenci “kalem” olsun, 5 adım yürüsün ve <b>60 derece</b> sağa dönsün; bunu 6 kez tekrarlasın. Sınıf neye benzediğini tahmin etsin (altıgen!). Sonra 5 kenarlı şekil için açıyı sorun: 360 ÷ 5 = 72. Tahtaya <b>“kenar sayısı × dönüş açısı = 360”</b> yazın. Son olarak her turda adımı 1 artırarak yürüyüp sarmalı deneyin. <b>Paylaşılan bilgisayar:</b> Bir öğrenci “sürücü”, diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Kodla resim yapalım! 🎨',
      text: `<p>20. bölümde kalemle kare ve yıldız çizmiştin. Bu kez <b>sanatçı</b> olacaksın:</p><ol class="tips"><li>⬡ <b>Düzgün çokgenler:</b> açıyı kendin hesaplayacaksın.</li><li>🌸 <b>Rozet:</b> bir şekli döndüre döndüre çiçek çizeceksin.</li><li>🌀 <b>Sarmal:</b> ${blk('vars', 'kenar değişkenini 5 değiştir')} ile çizgi her turda uzayacak.</li><li>🖼️ <b>Kendi tablon:</b> hepsini birleştir!</li></ol><p class="mut">Hatırlatma: ${blk('pen', 'kalemi bastır')} ile çizersin, ${blk('pen', 'tümünü sil')} ile sahneyi temizlersin.</p>`,
      pics: ['⬡', '🌸', '🌀', '🖼️'] },
    { type: 'quiz', title: 'Altıgenin açısı',
      q: 'Kalem bir tam tur, yani <b>360 derece</b> döner. Altıgenin 6 köşesi var. Her köşede kaç derece dönmeli?',
      opts: ['30', '90', '60'], a: 2,
      ok: '360 ÷ 6 = 60. Üçgende 360 ÷ 3 = 120, karede 360 ÷ 4 = 90 idi. Aynı kural!' },
    { type: 'scratch', title: 'Altıgen ⬡',
      text: `<p>6 kez tekrarla: [ ${blk('motion', '70 adım git')}, ${blk('motion', '↻ 60 derece dön')} ]. Altı eşit kenarlı, kapalı bir altıgen çıkmalı.</p>`,
      setup: kalem(-35, 60), blocks: PEN,
      goals: [{ t: '“tekrarla” kullan', use: 'repeat' }, { t: 'Altı eşit kenarlı, kapalı bir altıgen çiz ⬡', f: (a) => poly(a.lines, 6) }],
      hint: '🏁 → tümünü sil → kalemi bastır → 6 kez tekrarla [70 adım git, ↻ 60 derece dön].',
      sol: { Kalem: [[...START(-35, 60), ['down'], ['repeat', 6, [['move', 70], ['turnR', 60]]]]] } },
    { type: 'scratch', title: 'Çokgen makinesi ⚙️',
      text: `<p>Bu kez <b>köşe</b> adlı bir değişken var; şimdilik 5. Hem tekrar sayısı hem dönüş açısı <b>köşe</b>'ye bağlı olsun:<br>${blk('control', 'köşe kez tekrarla')}, ${blk('motion', '80 adım git')}, ${blk('motion', '↻ 360 ÷ köşe derece dön')}.</p><p class="mut">Sayı kutusundaki ▾ düğmesinden <b>değişken</b> ve <b>işlem (+ − × ÷)</b> seçeneklerini bul. Çalışınca <b>köşe</b> değişkenini 8 yap, sekizgen çiz!</p>`,
      setup: { backdrop: 'beyaz', vars: { köşe: 5 }, sprites: [sp('Kalem', 'kalem', -40, 60, { rot: 'all' })] },
      blocks: PEN.concat(['setv']), reporters: ['var', 'op'],
      goals: [{ t: 'Tekrar sayısında “köşe” değişkenini kullan', f: (a) => has(a, 'Kalem', '"b":{"r":"var","v":"köşe"}') || has(a, 'Kalem', '"n":{"r":"var","v":"köşe"}') }, { t: 'Dönüşte 360 ÷ köşe işlemini kullan', f: (a) => has(a, 'Kalem', '"o":"/"') }, { t: 'Düzgün bir beşgen çiz ⬠', f: (a) => poly(a.lines, 5) }],
      hint: '🏁 → … → köşe kez tekrarla [80 adım git, ↻ (360 ÷ köşe) derece dön]. Dönüş kutusuna önce işlemi seç, sonra 360 yaz ve ikinci kutuya köşe değişkenini koy.',
      sol: { Kalem: [[...START(-40, 60), ['down'], ['repeat', V('köşe'), [['move', 80], ['turnR', { r: 'op', o: '/', a: 360, b: V('köşe') }]]]]] } },
    { type: 'quiz', title: 'Köşe arttıkça',
      q: 'Çokgenin <b>köşe sayısı artıyor</b> (3, 4, 5, 6…). Her köşedeki dönüş açısı ne olur?',
      opts: ['Küçülür, çünkü 360 daha çok parçaya bölünür', 'Büyür', 'Hep aynı kalır'], a: 0,
      ok: 'Üçgen 120, kare 90, beşgen 72, altıgen 60… Köşe çoğaldıkça şekil daireye benzer! ⭕' },
    { type: 'scratch', title: 'Beşgen rozeti 🌸',
      text: `<p>Bir beşgeni döndüre döndüre çiçek yap! İç içe döngü:<br>10 kez tekrarla [ <b>5 kez tekrarla</b> [60 adım git, ↻ 72 derece dön], ↻ 36 derece dön ]</p><p class="mut">İçteki döngü bir beşgen çizer; dıştaki döngü onu 36 derece çevirir. 10 × 36 = 360: tam tur!</p>`,
      setup: kalem(0, 0), blocks: PEN,
      goals: [{ t: 'İç içe iki “tekrarla” kullan', f: (a) => a.count('repeat') >= 2 }, { t: '10 beşgen çiz (50 çizgi, her köşede 72 derece)', f: (a) => a.lines.length >= 50 && turnsNear(a.lines, 72) >= 40 }, { t: 'Rozet yuvarlak olsun: genişlik ve yükseklik birbirine yakın', f: (a) => { const s = shape(a.lines); return s.w > 100 && s.h > 100 && Math.abs(s.w - s.h) < 40; } }],
      hint: '🏁 → … → 10 kez tekrarla [5 kez tekrarla [60 adım git, ↻ 72 derece dön], ↻ 36 derece dön].',
      sol: { Kalem: [[...START(0, 0), ['pcolor', '#ff6fb5'], ['down'], ['repeat', 10, [['repeat', 5, [['move', 60], ['turnR', 72]]], ['turnR', 36]]]]] } },
    { type: 'quiz', title: 'Sarmalın kenarı',
      q: 'Bir sarmal çiziyoruz: <b>kenar</b> değişkeni 5 ile başlıyor, her turda <b>5 artıyor</b>. Çizilen çizgiler sırayla 5, 10, 15… uzunlukta. <b>4. çizgi</b> kaç adım uzunlukta?',
      opts: ['15', '20', '25'], a: 1,
      ok: '5, 10, 15, 20: dördüncü çizgi 20 adım. Değişken her turda 5 büyüdüğü için çizgiler uzuyor ve sarmal açılıyor.' },
    { type: 'scratch', title: 'Büyüyen sarmal 🌀',
      text: `<p>Kare çizmek yerine her turda <b>daha uzun</b> bir çizgi çizelim. Başta ${blk('vars', 'kenar değişkenini 5 yap')}. Sonra 24 kez tekrarla: [ ${blk('motion', 'kenar adım git')}, ${blk('motion', '↻ 90 derece dön')}, ${blk('vars', 'kenar değişkenini 5 değiştir')} ].</p>`,
      setup: { backdrop: 'beyaz', vars: { kenar: 5 }, sprites: [sp('Kalem', 'kalem', 0, 0, { rot: 'all' })] },
      blocks: PEN.concat(['setv', 'chv']), reporters: ['var'],
      goals: [{ t: '“kenar” değişkenini değiştir', use: 'chv' }, { t: 'Adım sayısında “kenar” değişkenini kullan', f: (a) => has(a, 'Kalem', '"r":"var","v":"kenar"') }, { t: '24 çizgi çiz ve her çizgi bir öncekinden uzun olsun', f: (a) => { const s = segs(a.lines); return s.length >= 24 && s.every((x, i) => i === 0 || x.len > s[i - 1].len + 1); } }, { t: 'Çizgiler birbirine dik olsun (90 derece)', f: (a) => turnsNear(a.lines, 90) >= 20 }],
      hint: '🏁 → … → kenar değişkenini 5 yap → kalemi bastır → 24 kez tekrarla [(kenar) adım git, ↻ 90 derece dön, kenar değişkenini 5 değiştir].',
      sol: { Kalem: [[...START(0, 0), ['setv', 'kenar', 5], ['pcolor', BLUE], ['down'], ['repeat', 24, [['move', V('kenar')], ['turnR', 90], ['chv', 'kenar', 5]]]]] } },
    { type: 'scratch', title: 'İki renkli çiçek 🌼',
      text: `<p>Çiçeğin yaprakları sırayla kırmızı ve mavi olsun. 6 kez tekrarla: [ ${blk('pen', 'kalem rengini kırmızı yap')}, kare çiz, ↻ 30 derece dön, ${blk('pen', 'kalem rengini mavi yap')}, kare çiz, ↻ 30 derece dön ]. Kare = 4 kez [60 adım git, ↻ 90 derece dön].</p>`,
      setup: kalem(0, 0), blocks: PEN,
      goals: [{ t: 'Kalem rengini kırmızı ve mavi yap', f: (a) => a.lines.some((l) => l.color === RED) && a.lines.some((l) => l.color === BLUE) }, { t: '12 kare çiz (48 çizgi), yarısı kırmızı yarısı mavi', f: (a) => { const r = a.lines.filter((l) => l.color === RED).length; const b = a.lines.filter((l) => l.color === BLUE).length; return r >= 24 && b >= 24; } }, { t: 'Kareler 30 derece dönerek çiçek olsun', f: (a) => turnsNear(a.lines, 90) >= 36 && turnsNear(a.lines, 120) >= 11 }],
      hint: '6 kez tekrarla [kırmızı yap, 4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön, mavi yap, 4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön].',
      sol: { Kalem: [[...START(0, 0), ['down'], ['repeat', 6, [['pcolor', RED], ['repeat', 4, [['move', 60], ['turnR', 90]]], ['turnR', 30], ['pcolor', BLUE], ['repeat', 4, [['move', 60], ['turnR', 90]]], ['turnR', 30]]]]] } },
    { type: 'scratch', title: 'Damga güneşi ☀️',
      text: `<p>${blk('pen', 'damga')} kuklanın bir kopyasını sahneye basar. Yıldızı merkezden 90 adım uzağa götürüp damgala, merkeze dön, biraz çevril ve tekrar et. Kalem de basılı olsun: yıldızların arasında güneş ışınları çıkar!</p><p>${blk('pen', 'kalemi bastır')}, sonra 12 kez tekrarla: [ ${blk('motion', 'x: 0 y: 0 konumuna git')}, ${blk('motion', '↻ 30 derece dön')}, ${blk('motion', '90 adım git')}, ${blk('pen', 'damga')} ]</p>`,
      setup: { backdrop: 'gece', sprites: [sp('Yıldız', 'yildiz', 0, 0, { size: 60, rot: 'all' })] },
      blocks: ['flag', 'clear', 'down', 'up', 'move', 'turnR', 'turnL', 'repeat', 'goto', 'point', 'pcolor', 'psize', 'stamp'],
      goals: [{ t: '“damga” ve “tekrarla” kullan', use: ['stamp', 'repeat'] }, { t: '12 ışın çiz: merkezden 90 adım uzunlukta, 30 derece arayla ☀️', f: (a) => { const bins = new Set(); for (const l of a.lines) { const near0 = (x, y) => Math.hypot(x, y) < 4; const o = near0(l.x1, l.y1) ? [l.x2, l.y2] : near0(l.x2, l.y2) ? [l.x1, l.y1] : null; if (o && Math.abs(Math.hypot(o[0], o[1]) - 90) < 4) bins.add(Math.round(Math.atan2(o[1], o[0]) * 6 / Math.PI)); } return bins.size >= 12; } }],
      hint: '🏁 → tümünü sil → x: 0 y: 0 konumuna git → 90 yönüne dön → kalemi bastır → 12 kez tekrarla [x: 0 y: 0 konumuna git, ↻ 30 derece dön, 90 adım git, damga].',
      sol: { Yıldız: [[['flag'], ['clear'], ['goto', 0, 0], ['point', 90], ['pcolor', YELLOW], ['down'], ['repeat', 12, [['goto', 0, 0], ['turnR', 30], ['move', 90], ['stamp']]]]] } },
    { type: 'scratch', title: '⭐ Kendi tablom',
      text: `<p>Sıra sende! Önceki desenlerden istediğini birleştir. Tablonda şunlar olsun: en az <b>3 renk</b>, en az <b>60 çizgi</b>, <b>iç içe döngü</b> ve her turda büyüyen <b>kenar</b> değişkeni (${blk('vars', 'kenar değişkenini 3 değiştir')}). Önerim: her turda kenarı biraz uzat, şekli biraz çevir. Hazır olunca ✔ Bitirdim.</p>`,
      setup: { backdrop: 'beyaz', vars: { kenar: 10 }, sprites: [sp('Kalem', 'kalem', 0, 0, { rot: 'all' })] },
      blocks: PEN.concat(['setv', 'chv', 'stamp', 'wait']), reporters: ['var', 'op'], free: true,
      goals: [{ t: 'En az 3 renk kullan', f: (a) => colorsOf(a.lines) >= 3 }, { t: 'En az 60 çizgi çiz', f: (a) => a.lines.length >= 60 }, { t: 'İç içe iki “tekrarla” kullan', f: (a) => a.count('repeat') >= 2 }, { t: '“kenar” değişkenini her turda değiştir', f: (a) => a.uses('chv') && has(a, 'Kalem', '"r":"var","v":"kenar"') }],
      hint: 'Örnek: 12 kez tekrarla [kırmızı yap, 4 kez tekrarla [(kenar) adım git, ↻ 90 derece dön], ↻ 15 derece dön, mavi yap, 4 kez tekrarla [(kenar) adım git, ↻ 90 derece dön], sarı yap, ↻ 15 derece dön, kenar değişkenini 3 değiştir].',
      sol: { Kalem: [[...START(0, 0), ['setv', 'kenar', 10], ['down'], ['repeat', 12, [['pcolor', RED], ['repeat', 4, [['move', V('kenar')], ['turnR', 90]]], ['pcolor', BLUE], ['turnR', 15], ['repeat', 4, [['move', V('kenar')], ['turnR', 90]]], ['pcolor', YELLOW], ['turnR', 15], ['repeat', 4, [['move', V('kenar')], ['turnR', 90]]], ['turnR', 15], ['chv', 'kenar', 3]]]]] } },
    { type: 'story', anim: 'dance', title: 'Sen bir dijital sanatçısın! 🖼️',
      text: '<p>Çokgenin açısını <b>360 ÷ köşe sayısı</b> ile hesapladın, döngüleri iç içe koydun, değişkenle büyüyen sarmallar çizdin. Gerçek sanatçı-programcılar da <b>üretken sanat</b> yaparken tam olarak bunu kullanır.</p><p>Tablonu arkadaşına göster, aynı deseni birlikte biraz değiştirin: bir sayıyı değiştirmek bambaşka bir resim yapar! 🌈</p>',
      pics: ['⬡', '🌸', '🌀', '🖼️'] },
  ],
};
