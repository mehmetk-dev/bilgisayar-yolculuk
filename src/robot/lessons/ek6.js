// Ek bölümler (6): Bilgi Yarışması (soru-cevap + skor + koşul) ve Canlı Akvaryum (klonlar + animasyon)
import { sp, blk, V, R, J, touch, cmp, has, visibleCount } from './sh.js';

const ANS = { r: 'answer' };
const TIMER = { r: 'timer' };
const Y = { r: 'y' };
const OP = (a, o, b) => ({ r: 'op', o, a, b });

// Bir betikteki bütün karşılaştırma koşullarını (iç içe olanlar dahil) toplar
const conds = (a, name) => {
  const out = [];
  const walk = (x) => { if (x && typeof x === 'object') { if (x.k === 'cmp') out.push(x); Object.values(x).forEach(walk); } };
  walk(a.w.sprite(name)?.scripts || []);
  return out;
};
// Betikte belirli bir değer bloğu (ör. { r: 'var', v: 'hız' }) kullanılmış mı?
const hasRep = (a, name, f) => {
  let ok = false;
  const walk = (x) => { if (x && typeof x === 'object') { if (f(x)) ok = true; Object.values(x).forEach(walk); } };
  walk(a.w.sprite(name)?.scripts || []);
  return ok;
};

// --- Oyun 9: Bilgi Yarışması ---
const QZ_BLOCKS = ['flag', 'ask', 'sayFor', 'say', 'if', 'ife', 'repeat', 'setv', 'chv', 'wait', 'sound', 'next', 'resetTimer'];
const QZ_SETUP = (vars = {}) => ({ backdrop: 'sahne', vars, sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] });
const SORU = (o) => J(V('a'), J(o === '*' ? ' × ' : ` ${o} `, V('b')));
const DOGRU = (o) => OP(V('a'), o, V('b'));
const NAME = [['ask', 'Adın ne?'], ['sayFor', J('Merhaba ', ANS), 2]];
const SAYI = (lo, hi) => [['setv', 'a', R(lo, hi)], ['setv', 'b', R(lo, hi)]];
const KARAR = (o, bonus = []) => ['ife', cmp(ANS, '=', DOGRU(o)),
  [['chv', 'skor', 1], ['sound', 'kazandin'], ['sayFor', 'Doğru! 🎉', 1], ...bonus],
  [['sound', 'boing'], ['sayFor', J('Yanlış! Doğru cevap: ', DOGRU(o)), 2]]];
const SONUC = ['ife', cmp(V('skor'), '>', 3), [['sound', 'alkis'], ['sayFor', 'Süper! 🏆', 2]], [['sayFor', 'Bir daha dene 💪', 2]]];
const BONUS = [['if', cmp(TIMER, '<', 5), [['chv', 'skor', 1], ['sayFor', 'Hızlısın! +1 bonus ⚡', 1]]]];
const PUAN = ['sayFor', J('Puanın: ', V('skor')), 2];
const TUR = (o, lo, hi, bonus = false) => ['repeat', 5, [...SAYI(lo, hi), ...(bonus ? [['resetTimer']] : []), ['ask', SORU(o)], KARAR(o, bonus ? BONUS : [])]];
const ROBO = (...body) => ({ Robo: [[['flag'], ...body]] });
const KAPITAL = [['ask', 'Türkiye\'nin başkenti neresi?'], ['ife', cmp(ANS, '=', 'Ankara'), [['chv', 'skor', 1], ['sayFor', 'Doğru! 🎉', 1]], [['sayFor', 'Başkent Ankara 😊', 1]]]];

// Test cevapları: 1. soru ad; sonra beş soruda üçüncüsü (sıra 3) bilerek yanlış
const verCevap = (f = (w) => w.vars.a + w.vars.b) => (w) => {
  const t = (w.asking?.text || '').toLocaleLowerCase('tr');
  if (t.includes('adın')) return 'Ali';
  if (t.includes('başkent')) return 'ankara';
  return w.log.answers.length === 3 ? '0' : String(f(w));
};
const ANSWERS = verCevap();
const ANSWERS_MUL = verCevap((w) => w.vars.a * w.vars.b);

// Her cevaptan sonra skor doğru mu değişti? (doğruysa +1 ve “doğru” demeli; yanlışsa aynı kalmalı ve doğru cevabı söylemeli)
const judge = (a, f = (q) => q.a + q.b) => {
  const w = a.w;
  const t = (a.mem.judge ||= { ok: 0, wrongOk: 0, bad: 0, q: null, mul: false });
  if (t.q && !t.q.done && w.log.answers.length > t.q.n && (w.asking || !w.running())) {
    const q = t.q;
    q.done = true;
    const exp = f(q);
    const said = w.log.said.slice(q.said).map((s) => s.text.toLocaleLowerCase('tr'));
    const right = Math.abs(parseFloat(String(w.log.answers[q.n]).replace(',', '.')) - exp) < 1e-9;
    const delta = w.vars.skor - q.s;
    if (right) { if (delta === 1 && said.some((s) => s.includes('doğru'))) t.ok++; else if (delta !== 1) t.bad++; }
    else if (delta !== 0) t.bad++;
    else if (said.some((s) => !s.startsWith('puan') && s.includes(String(exp)))) t.wrongOk++;
  }
  if (w.asking && t.q?.ask !== w.asking && /\d+\s*[+×*-]\s*\d+/.test(w.asking.text)) {
    t.q = { ask: w.asking, a: w.vars.a, b: w.vars.b, s: w.vars.skor, said: w.log.said.length, n: w.log.answers.length };
    if (w.asking.text.includes('×')) t.mul = true;
  }
  return t;
};

export const b43 = {
  icon: '🧠', color: '#0ea5e9', title: 'Oyun 9: Bilgi Yarışması', concept: 'Soru-cevap + skor + koşul',
  desc: 'Robo yarışma sunucusu oldu! Sana adını sorar, rastgele toplama soruları sorar, doğru cevaba puan verir ve sonunda puanına göre yorum yapar.',
  learned: ['“Sor ve bekle” bloğu bir soru sorar; yazdığın cevap “cevap” bloğunda durur.', '“Eğer … değilse” ile iki yoldan birini seçeriz: cevap doğruysa puan ver, değilse doğru cevabı söyle.', 'Rastgele sayılarla her oyun farklı olur; zamanlayıcı ile hızlı cevaba bonus verebiliriz.'],
  teacher: '<b>Sınıf yarışması:</b> Bir öğrenci sunucu olsun. Kâğıttan iki kutu yapın: “a” ve “b”. Sunucu her tur iki kutudan rastgele sayı kartı çeksin ve “a + b kaç eder?” diye sorsun. Cevap doğruysa tahtadaki skora bir çizgi çekilir; yanlışsa sunucu doğru cevabı söyler. Beş turdan sonra sorun: “Skor 3’ten büyük mü?” Büyükse “Süper!”, değilse “Bir daha dene” denir. Sonra sorun: “Bilgisayar bu işi bizden neden daha hızlı yapar?”',
  steps: [
    { type: 'story', anim: 'wave', title: 'Yarışma başlıyor! 🧠',
      text: `<p>Bugün Robo bir <b>bilgi yarışması sunucusu</b> olacak. Neler yapacağız?</p><ol class="tips"><li>Robo sana <b>adını sorar</b> ve seni selamlar.</li><li>Her turda <b>rastgele iki sayı</b> seçer ve toplama sorusu sorar.</li><li>Cevabın <b>doğruysa</b> skor artar, yanlışsa doğru cevabı söyler.</li><li>Beş soru bitince <b>puanına göre</b> yorum yapar.</li></ol><p>Önemli bloklar: ${blk('sensing', 'Adın ne? diye sor ve bekle')} ${blk('sensing', 'cevap')} ${blk('operators', 'birleştir')} ${blk('control', 'eğer … ise')}</p>`,
      pics: ['🧠', '❓', '✅', '🎲', '🏆'] },
    { type: 'scratch', title: '1. adım: Tanışalım',
      text: `<p>Robo kendini tanıtsın! 🏁 → ${blk('sensing', 'Adın ne? diye sor ve bekle')} → <b>“Merhaba …”</b> de 2 saniye. Söylenecek yazıda ▾ düğmesinden <b>birleştir</b>'i seç: ilk kutuya “Merhaba ”, ikinci kutuya ▾ ile <b>cevap</b> koy.</p><p class="mut">Soru sorulunca sahnenin altında bir yazı kutusu açılır. Adını yaz, ✔'e bas.</p>`,
      setup: QZ_SETUP(), blocks: QZ_BLOCKS, reporters: ['answer', 'join'], edit: 'Robo',
      goals: [{ t: '“sor ve bekle” kullan', use: 'ask' }, { t: 'Robo adını söyleyerek selamlasın', f: (a) => a.w.log.answers.length > 0 && a.w.log.said.some((s) => s.text.toLocaleLowerCase('tr').includes(a.w.log.answers[0].toLocaleLowerCase('tr')) && s.text.length > a.w.log.answers[0].length) }],
      hint: '🏁 → “Adın ne?” diye sor ve bekle → (birleştir “Merhaba ” (cevap)) de 2 saniye.',
      answers: ['Ali'], sol: ROBO(...NAME) },
    { type: 'quiz', title: 'Birleştir ne yapar?',
      q: 'Birinci kutuya “Merhaba ”, ikinci kutuya “cevap” koydun. Oyuncu “Ayşe” yazdı. Robo ne söyler?',
      opts: ['Ayşe Merhaba', 'Merhaba Ayşe', 'Merhaba'], a: 1,
      ok: 'Birleştir bloğu iki parçayı yan yana yapıştırır: önce birinci kutu, sonra ikinci kutu.' },
    { type: 'scratch', title: '2. adım: Rastgele soru 🎲',
      text: `<p>Robo her seferinde farklı bir soru sorsun. <b>a</b> değişkenini (rastgele 1 ile 10) yap, <b>b</b> değişkenini de (rastgele 1 ile 10) yap. Sonra soru sor. Soru “7 + 3” gibi görünsün; yazısı üç parçalı: <b>a</b>, “ + ”, <b>b</b>.</p><p class="mut">İpucu: ${blk('operators', 'birleştir')} bloğunun ikinci kutusuna yeniden <b>birleştir</b> koyabilirsin: birleştir (a) (birleştir “ + ” (b)). Sayılar sahnenin sol üstünde görünür.</p>`,
      setup: QZ_SETUP({ a: 0, b: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], edit: 'Robo', keep: true,
      goals: [{ t: '“rastgele” kullan', f: (a) => hasRep(a, 'Robo', (x) => x.r === 'rand') }, { t: 'Soru “a + b” gibi sorulsun, örneğin “7 + 3” (a ve b yerine sayılar)', f: (a) => { if (a.w.asking && a.w.vars.a > 0) a.mem.q = a.w.asking.text; return a.mem.q === `${a.w.vars.a} + ${a.w.vars.b}`; } }],
      hint: '🏁 → Adın ne? → Merhaba … → a = (rastgele 1 ile 10) → b = (rastgele 1 ile 10) → (birleştir (a) (birleştir “ + ” (b))) diye sor ve bekle.',
      answers: ANSWERS, testTime: 10,
      sol: ROBO(...NAME, ...SAYI(1, 10), ['ask', SORU('+')]) },
    { type: 'scratch', title: '3. adım: Doğru mu? ✅',
      text: `<p>Şimdi cevabı kontrol et! ${blk('control', 'eğer … ise … değilse')} kullan: <b>eğer cevap = (a + b)</b> ise <b>skoru 1 değiştir</b>, “Doğru! 🎉” de. Değilse <b>“Yanlış! Doğru cevap: …”</b> de: birleştir ile yazının sonuna (a + b) ekle. 🏁'ta skoru 0 yap.</p><p class="mut">İki yolu da dene: 🏁'a basıp bir kez doğru, bir kez yanlış cevap yaz. Doğru cevabı söylemesi için hesabı Robo yapsın!</p>`,
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(ANS, '=', DOGRU('+')), edit: 'Robo', keep: true, testTime: 14,
      goals: [{ t: '“eğer … değilse” kullan', use: 'ife' }, { t: 'Cevabı (a + b) ile karşılaştır', f: (a) => conds(a, 'Robo').some((c) => c.a?.r === 'answer' && c.b?.r === 'op') }, { t: 'Cevaba göre doğru tepki versin: doğruysa “Doğru!” ve skor artsın; yanlışsa skor artmasın, doğru cevabı söylesin', f: (a) => { const t = judge(a); return t.ok + t.wrongOk >= 1 && t.bad === 0; } }],
      hint: 'a ve b\'yi ayarla, sor. Sonra: eğer (cevap) = (a + b) ise [skoru 1 değiştir, Doğru! de] değilse [(birleştir “Yanlış! Doğru cevap: ” (a + b)) de 2 saniye].',
      answers: ANSWERS,
      sol: ROBO(['setv', 'skor', 0], ...NAME, ...SAYI(1, 10), ['ask', SORU('+')], KARAR('+')) },
    { type: 'quiz', title: 'Yanlış cevap',
      q: 'Oyuncu soruya <b>yanlış</b> cevap verdi. Skor ne olmalı?',
      opts: ['Skor 1 artmalı', 'Skor sıfırlanmalı', 'Skor aynı kalmalı'], a: 2,
      ok: 'Yanlış cevapta “eğer” bloğunun içi çalışmaz, “değilse” yolu çalışır. Skora dokunmadığımız için olduğu gibi kalır.' },
    { type: 'scratch', title: '4. adım: Beş soru, beş şans 🔁',
      text: `<p>Tek soru az! Soru bölümünü ${blk('control', '5 kez tekrarla')} içine koy: a, b, soru ve “Doğru mu?” kontrolü. Adını sorma ve skoru 0 yapma işi döngünün <b>dışında</b> kalsın.</p><p class="mut">Bir soruyu bilerek yanlış cevapla; skorun artmadığını sahnenin üstünde gör!</p>`,
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(ANS, '=', DOGRU('+')), edit: 'Robo', keep: true, testTime: 30,
      goals: [{ t: '“5 kez tekrarla” kullan', f: (a) => hasRep(a, 'Robo', (x) => x.op === 'repeat' && +x.args.n === 5) }, { t: 'Beş soru sorulsun', f: (a) => a.w.log.answers.length >= 6 }, { t: 'Doğru cevapta skor artsın', f: (a) => judge(a).ok >= 1 }, { t: 'Yanlış cevapta skor artmasın, doğru cevap söylensin', f: (a) => { const t = judge(a); return t.wrongOk >= 1 && t.bad === 0; } }],
      hint: '🏁 → skor = 0 → Adın ne? → Merhaba … → 5 kez tekrarla [a = rastgele, b = rastgele, soru sor, eğer … değilse …].',
      answers: ANSWERS,
      sol: ROBO(['setv', 'skor', 0], ...NAME, TUR('+', 1, 10)) },
    { type: 'scratch', title: '5. adım: Puanına göre yorum 🏆',
      text: `<p>Yarışma bitince önce <b>“Puanın: …”</b> de (birleştir + skor). Sonra puanına göre yorum yapsın: <b>eğer skor &gt; 3</b> ise “Süper! 🏆” de, <b>değilse</b> “Bir daha dene 💪” de.</p>`,
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(V('skor'), '>', 3), edit: 'Robo', keep: true, testTime: 40,
      goals: [{ t: 'Skor 3\'ten büyük mü diye baksın', f: (a) => conds(a, 'Robo').some((c) => c.a?.r === 'var' && c.a.v === 'skor' && c.op === '>') }, { t: 'Sonunda “Puanın: …” desin', f: (a) => a.said('puanın', 'Robo') }, { t: 'Puana göre “Süper!” ya da “Bir daha dene” desin', f: (a) => a.said('süper', 'Robo') || a.said('bir daha dene', 'Robo') }],
      hint: 'Döngüden sonra: (birleştir “Puanın: ” (skor)) de 2 saniye → eğer (skor) > 3 ise [Süper! de] değilse [Bir daha dene de].',
      answers: ANSWERS,
      sol: ROBO(['setv', 'skor', 0], ...NAME, TUR('+', 1, 10), PUAN, SONUC) },
    { type: 'quiz', title: 'Süper mi, değil mi?',
      q: 'Skor <b>3</b> olursa “eğer skor &gt; 3 ise Süper! değilse Bir daha dene” ne söyler?',
      opts: ['Bir daha dene', 'Süper!', 'Hiçbir şey'], a: 0,
      ok: '3, 3\'ten büyük değildir; koşul doğru olmaz ve “değilse” yolu çalışır. Süper! için skorun en az 4 olması gerek.' },
    { type: 'scratch', title: '6. adım: Çarpma turu ✖️',
      text: `<p>Zorlaşalım! Soruları <b>çarpma</b> yap. Sayılar 2 ile 9 arasında olsun. Soru yazısında “ + ” yerine “ × ” yaz. Hem soruda hem kontrolde ${blk('operators', '( ) × ( )')} kullan: işlem bloğundaki işareti ▾ ile × yap.</p><p class="mut">Kimse 9 × 8'i hatırlamıyorsa kâğıda yazabilir!</p>`,
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(ANS, '=', DOGRU('*')), edit: 'Robo', keep: true, testTime: 40,
      goals: [{ t: '× işlemini kullan', f: (a) => hasRep(a, 'Robo', (x) => x.r === 'op' && x.o === '*') }, { t: 'Sorular “a × b” gibi sorulsun', f: (a) => judge(a, (q) => q.a * q.b).mul }, { t: 'Doğru cevapta skor artsın, yanlışta artmasın', f: (a) => { const t = judge(a, (q) => q.a * q.b); return t.ok >= 1 && t.wrongOk >= 1 && t.bad === 0; } }],
      hint: 'a ve b\'yi (rastgele 2 ile 9) yap. Soru: (birleştir (a) (birleştir “ × ” (b))). Kontrol: eğer (cevap) = (a × b) ise …',
      answers: ANSWERS_MUL,
      sol: ROBO(['setv', 'skor', 0], ...NAME, TUR('*', 2, 9), PUAN, SONUC) },
    { type: 'scratch', title: '7. adım: Hızlı cevap bonusu ⏱️',
      text: `<p>Hızlı olana bonus! Her sorudan <b>hemen önce</b> ${blk('sensing', 'zamanlayıcıyı sıfırla')}. Cevap doğruysa: <b>eğer zamanlayıcı &lt; 5</b> ise “Hızlısın! +1 bonus ⚡” de ve skoru bir tane daha artır.</p><p class="mut">Zamanlayıcı sıfırlanınca saymaya baştan başlar. 5 saniyeden kısa sürede cevap verirsen bonus kazanırsın.</p>`,
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS, reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(TIMER, '<', 5), edit: 'Robo', keep: true, testTime: 40,
      goals: [{ t: '“zamanlayıcıyı sıfırla” kullan', use: 'resetTimer' }, { t: 'Zamanlayıcıyı bir koşulda kontrol et', f: (a) => conds(a, 'Robo').some((c) => c.a?.r === 'timer') }, { t: 'Hızlı cevapta “Hızlısın!” desin ⚡', f: (a) => a.said('hızlısın', 'Robo') }],
      hint: '5 kez tekrarla [a, b, zamanlayıcıyı sıfırla, soru sor, eğer cevap doğruysa [skor +1, Doğru de, eğer (zamanlayıcı) < 5 ise [skor +1, Hızlısın! de]] değilse …].',
      answers: ANSWERS_MUL,
      sol: ROBO(['setv', 'skor', 0], ...NAME, TUR('*', 2, 9, true), PUAN, SONUC) },
    { type: 'scratch', title: '⭐ Kendi sorunu ekle',
      text: '<p>Yarışmayı sen tamamla! Kendi sorunu ekle: <b>“Türkiye\'nin başkenti neresi?”</b> gibi bir soru sor, cevabı <b>eğer cevap = Ankara</b> ile kontrol et. Metinlerde büyük-küçük harf fark etmez: “ankara” da doğru sayılır! İstersen soru turunu ya da yorumları değiştir. Hazır olunca ✔ Bitirdim.</p>',
      setup: QZ_SETUP({ a: 0, b: 0, skor: 0 }), blocks: QZ_BLOCKS.concat(['backdrop', 'goto', 'glide', 'thinkFor', 'size', 'chsize']), reporters: ['answer', 'join', 'var', 'rand', 'op', 'timer'], conds: ['cmp'], condDefault: cmp(ANS, '=', 'Ankara'), library: true, free: true, keep: true, testTime: 40,
      goals: [{ t: 'Yarışmada bir değişiklik yap (yeni soru, yeni yorum ya da başka bir şey)', f: (a) => a.changed() }, { t: 'Kendi sorunu ekle (en az 3 “sor ve bekle”)', f: (a) => a.count('ask') >= 3 }, { t: 'Skor tut', use: 'chv' }],
      answers: ANSWERS_MUL,
      sol: ROBO(['setv', 'skor', 0], ...NAME, TUR('*', 2, 9, true), ...KAPITAL, PUAN, SONUC) },
  ],
};

// --- Canlı Akvaryum ---
const AQ_BLOCKS = ['flag', 'key', 'recv', 'bcast', 'cloneStart', 'clone', 'delClone', 'forever', 'repeat', 'until', 'if', 'wait', 'goto', 'gotoRand', 'gotoMouse', 'move', 'chy', 'point', 'pointTo', 'bounce', 'show', 'hide', 'next', 'sound', 'backdrop', 'setv'];
const BALIK = sp('Balık', 'balik', 0, 0, { size: 60 });
const BALON = sp('Baloncuk', 'top', 0, -170, { size: 25, visible: false });
const YEM = sp('Yem', 'yildiz', 0, 150, { size: 30, visible: false });
const GOZCU = sp('Robo', 'robo', 200, -125, { size: 55 });
const AQ_SETUP = (extra = [], vars = {}) => ({ backdrop: 'deniz', vars, sprites: [BALIK, ...extra] });
const MOUSE = { k: 'mouse' };

const SURU = [['flag'], ['hide'], ['repeat', 6, [['clone', 'kendim']]]];
const YUZ = (speed = 3) => ['repeat', 6, [['move', speed], ['bounce']]];
const KLON = (loop) => [['cloneStart'], ['gotoRand'], ['point', R(-180, 180)], ['show'], ['forever', loop]];
const KLON1 = KLON([['move', 3], ['bounce']]);
const KLON2 = KLON([YUZ(), ['next']]);
const DOGUM = (...recv) => ({ Balık: [SURU, KLON2, ...recv] });
const KOVALA = [['recv', 'yem'], ['repeat', 80, [['pointTo', 'Yem'], ['move', 5]]]];
const BALON_SCRIPT = [[['flag'], ['hide'], ['forever', [['clone', 'kendim'], ['wait', 0.8]]]], [['cloneStart'], ['goto', R(-210, 210), -170], ['show'], ['until', cmp(Y, '>', 170), [['chy', 4]]], ['delClone']]];
const yemScript = (...mid) => [['flag'], ['hide'], ['forever', [['if', MOUSE, [['gotoMouse'], ['show'], ...mid]]]]];
const YEM1 = [yemScript(['until', touch('kenar'), [['chy', -2]]], ['hide'])];
const YEM2 = [yemScript(['bcast', 'yem'], ['until', touch('kenar'), [['chy', -2]]], ['hide'])];
const YEM3 = [yemScript(['bcast', 'yem'], ['until', touch('Balık'), [['chy', -2]]], ['sound', 'pop'], ['hide'])];
const GECE = { Robo: [[['key', 'space'], ['bcast', 'gece']], [['recv', 'gece'], ['backdrop', 'gece'], ['setv', 'hız', 1]], [['key', 'a'], ['bcast', 'gündüz']], [['recv', 'gündüz'], ['backdrop', 'deniz'], ['setv', 'hız', 3]]] };
const KLON3 = KLON([['repeat', 6, [['move', V('hız')], ['bounce']]], ['next']]);

// Hedef denetimleri
const swam = (a, name = 'Balık') => {
  const p = (a.mem.p ||= {});
  let n = 0;
  for (const s of a.w.sprites) if (s.name === name && s.isClone && s.visible) { const q = (p[s.uid] ||= [s.x, s.y]); if (Math.hypot(s.x - q[0], s.y - q[1]) > 40) n++; }
  return n >= 3;
};
const gone = (a, name) => {
  const seen = (a.mem.seen ||= {});
  const live = new Set();
  for (const s of a.w.sprites) if (s.name === name && s.isClone) { live.add(s.uid); seen[s.uid] = name; }
  return Object.entries(seen).filter(([u, n]) => n === name && !live.has(+u)).length;
};
const finned = (a) => a.w.sprites.some((s) => s.name === 'Balık' && s.isClone && s.frames >= 4);
const yemFell = (a) => {
  const y = a.sp('Yem');
  if (y.visible) { a.mem.y0 ??= y.y; a.mem.ymin = Math.min(a.mem.ymin ?? y.y, y.y); }
  return a.mem.y0 !== undefined && a.mem.y0 - a.mem.ymin >= 60;
};
const reached = (a) => { const y = a.sp('Yem'); return y.visible && a.w.sprites.some((s) => s.name === 'Balık' && s.isClone && Math.hypot(s.x - y.x, s.y - y.y) <= 45); };
const BASE = ['Balık', 'Baloncuk', 'Yem', 'Robo'];
const newMove = (a) => {
  const p = (a.mem.np ||= {});
  return a.w.sprites.some((s) => { if (s.isClone || BASE.includes(s.name)) return false; const q = (p[s.name] ||= [s.x, s.y]); return Math.hypot(s.x - q[0], s.y - q[1]) > 40; });
};
// Yem düşürmek için fareyi tıklar ve bırakır
const tikla = (t, x, y, sure = 0.4) => [['fn', t, (w) => { w.mouse.x = x; w.mouse.y = y; w.mouse.down = true; }], ['fn', t + sure, (w) => { w.mouse.down = false; }]];

export const b44 = {
  icon: '🐠', color: '#06b6d4', title: 'Canlı Akvaryum', concept: 'Klonlar + animasyon',
  desc: 'Kendi akvaryumunu yap: balık klonları yüzsün, yüzgeçleri çırpsın, baloncuklar yükselsin, yem düşünce balıklar koşsun, gece olunca herkes yavaşlasın!',
  learned: ['Klonlar sayesinde tek bir balık kuklasından bir balık sürüsü yaparız.', 'Kostümleri art arda değiştirmek (sonraki kostüm) hareket görüntüsü yaratır: yüzgeç çırpar.', '“Haber sal” ile bir olay bütün kuklalara duyurulur: yem düştü, gece oldu!', 'İşi biten klonlar “bu klonu sil” ile silinmezse ekran dolar ve oyun yavaşlar.'],
  teacher: '<b>Canlı akvaryum oyunu:</b> Sınıfın ortasını “akvaryum” yapın. Birkaç öğrenci balık olsun ve yavaşça yüzsün (yürüsün); duvara gelince dönsün (kenara geldiyse sek!). Bir öğrenci “baloncuk” olup yerden tavana doğru parmak uçlarında yükselsin ve tavana varınca otursun (klonu sil). Öğretmen “Yem!” desin (haber sal): bütün balıklar öğretmenin elindeki kâğıt parçasına doğru yürüsün. “Gece oldu!” deyince herkes iki kat yavaş yüzsün. Sonra sorun: “Herkes haberi nasıl duydu? Her balığa ayrı ayrı mı söyledim?”',
  steps: [
    { type: 'story', anim: 'dance', title: 'Akvaryum açılıyor! 🐠',
      text: '<p>Bugün ekranda canlı bir akvaryum yapıyoruz. Tek balıktan <b>klonlarla</b> bir sürü balık çıkaracağız!</p><ol class="tips"><li><b>Balıklar</b> rastgele yerde doğar ve sürekli yüzer.</li><li>Yüzgeçleri <b>kostüm değiştirerek</b> çırpar.</li><li><b>Baloncuklar</b> aşağıdan yukarı süzülür.</li><li>Tıklayınca <b>yem</b> düşer, balıklar yeme koşar.</li><li>Bir tuşa basınca <b>gece</b> olur, balıklar yavaşlar. 🌙</li></ol><p class="mut">Bilgisayar yavaşlamasın diye ekranda en fazla 15 kadar klon olacak.</p>',
      pics: ['🐠', '🐟', '🫧', '🍤', '🌙'] },
    { type: 'scratch', title: '1. adım: Balık sürüsü',
      text: `<p>Balık: 🏁 → <b>gizle</b> → 6 kez tekrarla [${blk('control', 'kendim klonunu oluştur')}].<br>${blk('control', 'klon olarak başladığımda', 1)} → <b>rastgele konuma git</b> → (rastgele -180 ile 180) yönüne dön → göster → sürekli tekrarla [3 adım git, ${blk('motion', 'kenara geldiyse sek')}].</p>`,
      setup: AQ_SETUP(), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], edit: 'Balık',
      goals: [{ t: '“klon olarak başladığımda” kullan', f: (a) => a.hats('cloneStart') > 0 }, { t: '6 balık aynı anda ekranda olsun', f: (a) => visibleCount(a, 'Balık') >= 6 }, { t: 'Balıklar yüzsün ve kenara gelince seksin', f: (a) => a.uses('bounce') && swam(a) }],
      hint: 'Balık betik 1: 🏁 → gizle → 6 kez tekrarla [kendim klonunu oluştur]. Betik 2: klon olarak başladığımda → rastgele konuma git → (rastgele -180 ile 180) yönüne dön → göster → sürekli tekrarla [3 adım git, kenara geldiyse sek].',
      sol: { Balık: [SURU, KLON1] } },
    { type: 'quiz', title: 'Hangi blok?',
      q: 'Akvaryumdaki <b>her balığın</b> kendi başına yüzmesini hangi blok başlatır?',
      opts: ['klon olarak başladığımda', 'bu klonu sil', 'dekoru gece yap'], a: 0,
      ok: 'Her klon doğduğunda “klon olarak başladığımda” betiğini kendi başına çalıştırır. Bu yüzden her balık ayrı bir yere, ayrı bir yöne gider.' },
    { type: 'scratch', title: '2. adım: Yüzgeç çırpsın 🐟',
      text: `<p>Balıklar kaskatı yüzmesin! Klonun döngüsünü şöyle yap: sürekli tekrarla [<b>6 kez tekrarla</b> [3 adım git, kenara geldiyse sek], ${blk('looks', 'sonraki kostüm')}]. Her 6 adımda bir yüzgeç çırpar.</p><p class="mut">Balığın iki kostümü var; sonraki kostüm onları sırayla gösterir.</p>`,
      setup: AQ_SETUP(), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], edit: 'Balık', keep: true, testTime: 12,
      goals: [{ t: '“sonraki kostüm” kullan', use: 'next' }, { t: 'Balıklar yüzgeç çırpsın (kostüm değiştirsin)', f: finned }, { t: 'Balıklar hâlâ yüzsün', f: (a) => visibleCount(a, 'Balık') >= 6 && swam(a) }],
      hint: 'Klon betiğinin “sürekli tekrarla” bloğunun içi: 6 kez tekrarla [3 adım git, kenara geldiyse sek] + sonraki kostüm.',
      sol: { Balık: [SURU, KLON2] } },
    { type: 'scratch', title: '3. adım: Baloncuklar 🫧',
      text: `<p>Baloncuk (küçük top): 🏁 → gizle → sürekli tekrarla [kendim klonunu oluştur, 0.8 saniye bekle].<br>Klon olarak başladığımda → x: (rastgele -210 ile 210) y: -170'e git → göster → <b>y &gt; 170 olana kadar tekrarla</b> [y'yi 4 değiştir] → <b>bu klonu sil</b>.</p><p class="mut">Önce Baloncuk'u seç (kukla listesinden). Tepeye varan baloncuk silinmezse klonlar birikir!</p>`,
      setup: AQ_SETUP([BALON]), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], conds: ['cmp', 'touch'], condDefault: cmp(Y, '>', 170), edit: 'Baloncuk', keep: true, testTime: 12,
      goals: [{ t: 'Aynı anda en az 3 baloncuk yükselsin', f: (a) => visibleCount(a, 'Baloncuk') >= 3 }, { t: 'Tepeye varan baloncuk silinsin (bu klonu sil)', f: (a) => a.uses('delClone') && gone(a, 'Baloncuk') >= 1 }, { t: 'Balıklar yüzmeye devam etsin', f: (a) => visibleCount(a, 'Balık') >= 6 }],
      hint: 'Baloncuk betik 1: 🏁 → gizle → sürekli tekrarla [kendim klonunu oluştur, 0.8 saniye bekle]. Betik 2: klon olarak başladığımda → x: (rastgele -210 ile 210) y: -170\'e git → göster → (y konumu) > 170 olana kadar tekrarla [y\'yi 4 değiştir] → bu klonu sil.',
      sol: { Balık: [SURU, KLON2], Baloncuk: BALON_SCRIPT } },
    { type: 'quiz', title: 'Klonları sil!',
      q: 'Baloncuk klonları tepeye ulaşınca <b>“bu klonu sil”</b> kullanılmazsa ne olur?',
      opts: ['Baloncuklar kendiliğinden geri iner', 'Hiçbir şey olmaz', 'Klonlar birikir, sahne kalabalıklaşır ve yavaşlar'], a: 2,
      ok: 'Silinmeyen klonlar sahnede kalır ve sayıları sürekli artar. Bilgisayar çok çalışmak zorunda kalır. İşi biten klonu mutlaka sil!' },
    { type: 'scratch', title: '4. adım: Yem düşsün 🍤',
      text: `<p>Yem (sarı yıldız) kuklasına: 🏁 → gizle → sürekli tekrarla [<b>eğer ${blk('sensing', 'fare tıklandı mı?')} ise</b> → ${blk('motion', 'fare imlecine git')} → göster → <b>kenara dokunana kadar tekrarla</b> [y'yi -2 değiştir] → gizle].</p><p class="mut">Sahnede istediğin yere tıkla; yem oradan başlayıp yavaşça dibe batsın.</p>`,
      setup: AQ_SETUP([BALON, YEM]), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], conds: ['mouse', 'touch', 'cmp'], condDefault: touch('kenar'), edit: 'Yem', keep: true, testTime: 8,
      goals: [{ t: '“fare tıklandı mı?” koşulunu kullan', f: (a) => has(a, 'Yem', '"k":"mouse"') }, { t: 'Yem tıkladığın yerden başlasın', f: (a) => a.uses('gotoMouse') && a.mem.y0 !== undefined }, { t: 'Yem aşağı batsın', f: yemFell }],
      hint: 'Yem: 🏁 → gizle → sürekli tekrarla [eğer (fare tıklandı mı?) ise [fare imlecine git, göster, (kenara dokunuyor mu?) olana kadar tekrarla [y\'yi -2 değiştir], gizle]].',
      sol: { Balık: [SURU, KLON2], Baloncuk: BALON_SCRIPT, Yem: YEM1 }, play: tikla(1, 50, 100) },
    { type: 'scratch', title: '5. adım: Balıklar yeme koşsun 🐠',
      text: `<p>Haber salma zamanı! Yem düşünce <b>yem haberini sal</b> (yemde, “göster”den sonra). Balıklar bu haberi alınca yeme dönsün: Balık'ta ${blk('events', 'yem haberini aldığımda', 1)} → <b>80 kez tekrarla</b> [${blk('motion', 'Yem doğru dön')}, 5 adım git].</p><p class="mut">Balığın iki betiği aynı anda çalışır: biri yüzer, biri yeme koşar!</p>`,
      setup: AQ_SETUP([BALON, YEM]), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], conds: ['mouse', 'touch', 'cmp'], condDefault: touch('kenar'), msgs: ['yem'], edit: 'Yem', keep: true, testTime: 8,
      goals: [{ t: 'Yem düşünce “yem” haberini sal', f: (a) => a.bcast('yem') }, { t: 'Balıklar yeme doğru dönsün (Yem doğru dön)', f: (a) => has(a, 'Balık', '"op":"pointTo"') }, { t: 'Bir balık yeme ulaşsın 😋', f: reached }],
      hint: 'Yem: … göster → yem haberini sal → … Balık: yem haberini aldığımda → 80 kez tekrarla [Yem doğru dön, 5 adım git].',
      sol: { Balık: [SURU, KLON2, KOVALA], Baloncuk: BALON_SCRIPT, Yem: YEM2 }, play: tikla(1, 60, 110) },
    { type: 'scratch', title: '6. adım: Yem yenince kaybolsun 😋',
      text: `<p>Yem dibe kadar batmasın, balık yiyince kaybolsun! Yemin döngüsünü değiştir: <b>kenara</b> yerine <b>Balık'a dokunana kadar tekrarla</b> [y'yi -2 değiştir]. Sonra <b>pop sesi</b> çal ve gizle.</p>`,
      setup: AQ_SETUP([BALON, YEM]), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], conds: ['mouse', 'touch', 'cmp'], condDefault: touch('Balık'), msgs: ['yem'], edit: 'Yem', keep: true, testTime: 10,
      goals: [{ t: 'Yem “Balık dokunuyor mu?” diye baksın', f: (a) => has(a, 'Yem', '"o":"Balık"') }, { t: 'Balık yemi yiyince pop sesi çıksın', f: (a) => a.sounds('pop', 'Yem') >= 1 }, { t: 'Yenen yem kaybolsun', f: (a) => a.sounds('pop', 'Yem') >= 1 && !a.sp('Yem').visible }],
      hint: 'Yem: … yem haberini sal → (Balık dokunuyor mu?) olana kadar tekrarla [y\'yi -2 değiştir] → pop sesini başlat → gizle.',
      sol: { Balık: [SURU, KLON2, KOVALA], Baloncuk: BALON_SCRIPT, Yem: YEM3 }, play: tikla(1, 60, 110) },
    { type: 'scratch', title: '7. adım: Gece oldu 🌙',
      text: `<p>Robo akvaryumun bekçisi. <b>Boşluk</b> tuşuna basılınca <b>gece haberini sal</b>, <b>a</b> tuşuna basılınca <b>gündüz haberini sal</b>. Robo gece haberini alınca ${blk('looks', 'dekoru gece yap')} ve <b>hız</b> değişkenini 1 yapsın; gündüz haberini alınca dekoru deniz yapsın ve hızı 3 yapsın.</p><p>Balıklar da <b>hız</b>'a göre yüzsün: klondaki “3 adım git” bloğunun sayısını ▾ ile <b>hız</b> değişkeniyle değiştir.</p>`,
      setup: AQ_SETUP([BALON, YEM, GOZCU], { hız: 3 }), blocks: AQ_BLOCKS, reporters: ['rand', 'var'], conds: ['mouse', 'touch', 'cmp'], condDefault: touch('Balık'), msgs: ['yem', 'gece', 'gündüz'], backdrops: ['deniz', 'gece'], edit: 'Robo', keep: true, testTime: 8,
      goals: [{ t: 'Boşluk tuşuyla “gece” haberi salınsın', f: (a) => a.bcast('gece') }, { t: 'Gece olunca dekor değişsin', f: (a) => a.backdrops.includes('gece') }, { t: 'Balıklar hız değişkenine göre yüzsün, gece yavaşlasın', f: (a) => hasRep(a, 'Balık', (x) => x.r === 'var' && x.v === 'hız') && a.vars.hız === 1 }, { t: '“a” tuşuyla gündüz olsun, hız geri gelsin', f: (a) => a.bcast('gündüz') && a.backdrops.includes('deniz') && a.vars.hız === 3 }],
      hint: 'Robo: boşluk tuşuna basılınca → gece haberini sal. gece haberini aldığımda → dekoru gece yap, hız = 1. a tuşuna basılınca → gündüz haberini sal. gündüz haberini aldığımda → dekoru deniz yap, hız = 3. Balık klonunda: hız adım git.',
      sol: { Balık: [SURU, KLON3, KOVALA], Baloncuk: BALON_SCRIPT, Yem: YEM3, ...GECE }, play: [['tap', 'space', 1.5], ['tap', 'a', 4]] },
    { type: 'quiz', title: 'Haber kimlere ulaşır?',
      q: 'Robo “gece” haberini saldı. Haberi <b>kimler</b> alır?',
      opts: ['Yalnızca haberi salan Robo', '“gece haberini aldığımda” betiği olan bütün kuklalar', 'Hiçbir kukla'], a: 1,
      ok: 'Haber bütün sahneye duyurulur. “Aldığımda” betiği olan her kukla harekete geçer; olmayanlar bir şey yapmaz.' },
    { type: 'scratch', title: '⭐ Kendi deniz canlın',
      text: '<p>Akvaryumu sen tamamla! ➕ ile sahneye <b>kendi deniz canlını</b> ekle (Arı, Kuş ya da Uğur böceği bile olabilir: sen onu denizin tuhaf bir yaratığı yap!). Onu yüzdür, kostümünü çırptır, rengini ya da büyüklüğünü değiştir. İstersen yeme ya da geceye tepki versin. Klon sayısına dikkat: en fazla 15 civarı olsun. Hazır olunca ✔ Bitirdim.</p>',
      setup: AQ_SETUP([BALON, YEM, GOZCU], { hız: 3 }), blocks: AQ_BLOCKS.concat(['size', 'chsize', 'color', 'clearfx', 'glide', 'turnR', 'turnL', 'sayFor', 'say', 'costume']), reporters: ['rand', 'var'], conds: ['mouse', 'touch', 'cmp'], condDefault: touch('Balık'), msgs: ['yem', 'gece', 'gündüz'], library: true, free: true, keep: true, testTime: 10,
      goals: [{ t: 'Akvaryumda bir değişiklik yap (yeni canlı, yeni blok ya da başka bir şey)', f: (a) => a.changed() }, { t: 'Yeni bir canlı ekle ve yüzdür', f: newMove }, { t: 'Balık sürüsü yüzmeye devam etsin', f: (a) => visibleCount(a, 'Balık') >= 6 }],
      testSetup: AQ_SETUP([BALON, YEM, GOZCU, sp('Kuş', 'kus', -120, 90)], { hız: 3 }),
      sol: { Balık: [SURU, KLON3, KOVALA], Baloncuk: BALON_SCRIPT, Yem: YEM3, ...GECE, Kuş: [[['flag'], ['forever', [['move', 2], ['bounce'], ['next'], ['wait', 0.2]]]]] }, play: tikla(1, 60, 110) },
  ],
};
