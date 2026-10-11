// 8. hafta: sor ve cevapla, matematik işlemleri, klonlar, uzay savaşçısı oyunu
import { sp, blk, shape } from './sh.js';

const V = (v) => ({ r: 'var', v });
const R = (a, b) => ({ r: 'rand', a, b });
const ANS = { r: 'answer' };
const OP = (a, o, b) => ({ r: 'op', o, a, b });
const J = (a, b) => ({ r: 'join', a, b });
const touch = (o) => ({ k: 'touch', o });
const key = (k) => ({ k: 'key', key: k });
const cmp = (a, op, b) => ({ k: 'cmp', a, op, b });
const has = (a, name, s) => JSON.stringify(a.w.sprite(name)?.scripts || []).includes(s);
const visibleCount = (a, name) => a.w.sprites.filter((s) => s.name === name && s.isClone && s.visible).length;

const ASK_BLOCKS = ['flag', 'click', 'ask', 'sayFor', 'say', 'thinkFor', 'if', 'ife', 'until', 'repeat', 'setv', 'chv', 'wait', 'sound', 'next', 'bcast', 'recv', 'stop'];

export const b29 = {
  icon: '💬', color: '#5cb1d6', title: 'Sor ve Cevapla', concept: 'Girdi (cevap)',
  desc: 'Kuklalar soru sorsun, sen yaz! Cevaba göre konuşan karakterler ve bilgi yarışmaları yap.',
  learned: ['“… diye sor ve bekle” bloğu sahnede bir yazı kutusu açar ve cevabı bekler.', 'Yazılan cevap “cevap” bloğunda saklanır.', 'Cevabı “eğer” ile karşılaştırarak doğru-yanlış kontrolü yapabiliriz.'],
  teacher: '<b>Canlı bilgi yarışması:</b> Bir öğrenci “sunucu kukla” olsun ve önceden yazılmış soruları sorsun. Cevaba göre “Doğru! +1 puan” ya da “Yanlış” desin; tahtada skor tutulsun. Sonra öğrenciler kendi yarışmalarını Scratch\'te kodlasın ve soruları birbirlerine sorsun.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Kuklalar soru soruyor! 💬',
      text: `<p>Şimdiye kadar hep kuklalar konuştu, sen dinledin. Şimdi sıra sende!</p><p>${blk('sensing', 'Adın ne? diye sor ve bekle')} bloğu sahnenin altında bir <b>yazı kutusu</b> açar. Sen cevabını yazıp ✔\'e basınca program devam eder.</p><p>Yazdığın şey ${blk('sensing', 'cevap')} bloğunda saklanır. Onu bir yazı ya da sayı kutusunun yanındaki <b>▾</b> düğmesinden seçebilirsin.</p>`,
      pics: ['❓', '⌨️', '💬', '✅'] },
    { type: 'scratch', title: 'Tanışalım',
      text: `<p>Kedi adını sorsun, sonra sana <b>“Merhaba …”</b> desin. Söylenecek yazıda ▾ düğmesinden <b>birleştir</b>'i seç: ilk kutuya “Merhaba ”, ikinci kutuya ▾ ile <b>cevap</b> koy.</p>`,
      setup: { backdrop: 'cayir', sprites: [sp('Kedi', 'kedi', 0, -60)] },
      blocks: ASK_BLOCKS, reporters: ['answer', 'join'],
      goals: [{ t: '“sor ve bekle” kullan', use: 'ask' }, { t: 'Kedi cevabını kullanarak konuşsun', f: (a) => a.w.log.answers.length > 0 && a.w.log.said.some((s) => s.t > 0 && s.text.toLocaleLowerCase('tr').includes(a.w.log.answers[0].toLocaleLowerCase('tr')) && s.text !== 'Adın ne?') }],
      hint: '🏁 → “Adın ne?” diye sor ve bekle → (birleştir “Merhaba ” (cevap)) de 2 saniye',
      answers: ['Ali'],
      sol: { Kedi: [[['flag'], ['ask', 'Adın ne?'], ['sayFor', J('Merhaba ', ANS), 2]]] } },
    { type: 'quiz', title: 'Cevap nerede?',
      q: 'Oyuncu soruya “kırmızı” yazdı. Bu yazı nerede saklanır?',
      opts: ['Kostümde', '“cevap” bloğunda', 'Dekorda'], a: 1,
      ok: 'Son yazılan cevap “cevap” bloğunda durur. Yeni bir soru sorulunca yenisiyle değişir.' },
    { type: 'scratch', title: 'Bilgi yarışması',
      text: `<p>Robo bir soru sorsun: <b>“Türkiye'nin başkenti neresi?”</b> Eğer cevap <b>Ankara</b> ise “Doğru! 🎉” desin ve skoru 1 artırsın; değilse “Yanlış, cevap Ankara” desin.</p><p class="mut">Koşulda “karşılaştır”ı seç, sol tarafa <b>cevap</b>, sağ tarafa <b>Ankara</b> yaz. Büyük-küçük harf fark etmez.</p>`,
      setup: { backdrop: 'sahne', vars: { skor: 0 }, sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] },
      blocks: ASK_BLOCKS, reporters: ['answer', 'join', 'var'], conds: ['cmp'], condDefault: cmp(ANS, '=', 'Ankara'),
      goals: [{ t: '“eğer … değilse” kullan', use: 'ife' }, { t: 'Doğru cevapta “Doğru” desin', f: (a) => a.said('doğru', 'Robo') }, { t: 'Doğru cevapta skor artsın', f: (a) => a.vars.skor >= 1 }],
      answers: ['ankara'],
      sol: { Robo: [[['flag'], ['setv', 'skor', 0], ['ask', 'Türkiye\'nin başkenti neresi?'], ['ife', cmp(ANS, '=', 'Ankara'), [['sound', 'kazandin'], ['sayFor', 'Doğru! 🎉', 2], ['chv', 'skor', 1]], [['sayFor', 'Yanlış, cevap Ankara', 2]]]]] } },
    { type: 'scratch', title: 'Üç soruluk yarışma 🏆',
      text: '<p>Üç soru sor, her doğru cevapta skoru artır. En sonda <b>“Puanın: …”</b> desin (birleştir + skor).</p><p class="mut">Sorular: Türkiye\'nin başkenti? (Ankara) · 3 + 4 kaç eder? (7) · Gökyüzü ne renk? (mavi)</p>',
      setup: { backdrop: 'sahne', vars: { skor: 0 }, sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] },
      blocks: ASK_BLOCKS, reporters: ['answer', 'join', 'var'], conds: ['cmp'], condDefault: cmp(ANS, '=', ''),
      goals: [{ t: 'En az üç soru sor', f: (a) => a.count('ask') >= 3 }, { t: 'En az 2 doğru cevapla', f: (a) => a.vars.skor >= 2 }, { t: 'Sonunda puanı söylesin', f: (a) => a.said('puan', 'Robo') }],
      answers: ['Ankara', '7', 'mavi'],
      sol: { Robo: [[['flag'], ['setv', 'skor', 0],
        ['ask', 'Türkiye\'nin başkenti?'], ['if', cmp(ANS, '=', 'Ankara'), [['chv', 'skor', 1]]],
        ['ask', '3 + 4 kaç eder?'], ['if', cmp(ANS, '=', 7), [['chv', 'skor', 1]]],
        ['ask', 'Gökyüzü ne renk?'], ['if', cmp(ANS, '=', 'mavi'), [['chv', 'skor', 1]]],
        ['sayFor', J('Puanın: ', V('skor')), 2]]] } },
    { type: 'scratch', title: 'Şifreli kapı 🔐',
      text: `<p>Robo bir kapı bekçisi. Doğru şifre yazılana kadar sormaya devam etsin: ${blk('control', '… olana kadar tekrarla')} [şifre nedir? diye sor]. Şifre <b>açıl susam</b>. Şifre doğru olunca “Kapı açıldı!” desin.</p>`,
      setup: { backdrop: 'gece', sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] },
      blocks: ASK_BLOCKS, reporters: ['answer', 'join'], conds: ['cmp'], condDefault: cmp(ANS, '=', 'açıl susam'),
      goals: [{ t: '“… olana kadar tekrarla” kullan', use: 'until' }, { t: 'Yanlış şifrede tekrar sorsun', f: (a) => a.w.log.answers.length >= 2 }, { t: 'Doğru şifrede “Kapı açıldı!” desin', f: (a) => a.said('açıldı', 'Robo') }],
      answers: ['1234', 'robo', 'Açıl susam'],
      sol: { Robo: [[['flag'], ['until', cmp(ANS, '=', 'açıl susam'), [['ask', 'Şifre nedir?']]], ['sound', 'zil'], ['sayFor', 'Kapı açıldı!', 2]]] } },
    { type: 'scratch', title: '⭐ Kendi yarışman',
      text: '<p>Kendi bilgi yarışmanı yap: en az 3 soru, skor ve sonunda puan. İstersen yanlış cevapta “boing” sesi çal! Arkadaşına oynat. Hazır olunca ✔ Bitirdim.</p>',
      setup: { backdrop: 'sahne', vars: { skor: 0 }, sprites: [sp('Kedi', 'kedi', -60, -60)] },
      blocks: ASK_BLOCKS.concat(['backdrop', 'glide', 'goto']), reporters: ['answer', 'join', 'var', 'rand'], conds: ['cmp'], library: true, free: true,
      goals: [{ t: 'En az üç soru', f: (a) => a.count('ask') >= 3 }, { t: 'Skor tut', use: 'chv' }],
      answers: ['a', 'b', 'c'],
      sol: { Kedi: [[['flag'], ['setv', 'skor', 0], ...['a', 'b', 'c'].flatMap((x) => [['ask', 'Soru?'], ['if', cmp(ANS, '=', x), [['chv', 'skor', 1]]]])]] } },
  ],
};

const MATH_BLOCKS = ['flag', 'ask', 'sayFor', 'say', 'setv', 'chv', 'repeat', 'if', 'ife', 'wait', 'clear', 'down', 'up', 'move', 'turnR', 'goto', 'point', 'pcolor', 'sound'];

export const b30 = {
  icon: '➗', color: '#59c059', title: 'Matematik İşlemleri', concept: 'Operatörler',
  desc: 'Toplama, çıkarma, çarpma, bölme bloklarıyla hesap makinesi, matematik oyunu ve büyüyen spiraller yap.',
  learned: ['Yeşil işlem blokları (+ − × ÷) iki sayıyla hesap yapar.', 'İşlem bloklarının içine değişken ve rastgele sayı konabilir.', 'Bilgisayar matematiği çok hızlı yapar; oyunlar ve çizimler bu hesaplarla çalışır.'],
  teacher: '<b>İnsan hesap makinesi:</b> İki öğrenci “a” ve “b” kutusu olsun (ellerinde sayı kartları). Üçüncü öğrenci “işlem bloğu”: kartlara bakıp sonucu söyler. Sonra kartlar rastgele çekilsin. Ders sonunda çokgen çizimiyle “360 ÷ kenar sayısı” kuralını hatırlatın.',
  steps: [
    { type: 'story', anim: 'think', title: 'Bilgisayar bir hesap ustası 🧮',
      text: `<p>Yeşil işlem blokları hesap yapar: ${blk('operators', '( ) + ( )')} ${blk('operators', '( ) − ( )')} ${blk('operators', '( ) × ( )')} ${blk('operators', '( ) ÷ ( )')}</p><p>Bir sayı kutusunun yanındaki <b>▾</b> düğmesinden <b>işlem</b>'i seç; açılan yeşil bloktaki işareti (+ − × ÷) değiştirebilirsin. İçine değişken ya da cevap da koyabilirsin!</p>`,
      pics: ['➕', '➖', '✖️', '➗', '🟰'] },
    { type: 'scratch', title: 'Toplama makinesi',
      text: '<p>Robo iki sayı sorsun, bunları <b>a</b> ve <b>b</b> değişkenlerine koysun, sonra toplamı söylesin.</p><p class="mut">a\'yı (cevap) yap · b\'yi (cevap) yap · (birleştir “Toplam: ” (a + b)) de</p>',
      setup: { backdrop: 'sahne', vars: { a: 0, b: 0 }, sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] },
      blocks: MATH_BLOCKS, reporters: ['op', 'answer', 'join', 'var'],
      goals: [{ t: 'İşlem bloğu kullan', f: (a) => has(a, 'Robo', '"r":"op"') }, { t: '5 ve 7 için “12” desin', f: (a) => a.w.log.said.some((s) => s.text.includes('12')) }],
      answers: ['5', '7'],
      sol: { Robo: [[['flag'], ['ask', 'Bir sayı söyle'], ['setv', 'a', ANS], ['ask', 'Bir sayı daha'], ['setv', 'b', ANS], ['sayFor', J('Toplam: ', OP(V('a'), '+', V('b'))), 2]]] } },
    { type: 'quiz', title: 'Hesapla',
      q: 'a = 4, b = 3 ise <b>(a × b) − 2</b> kaç eder?',
      opts: ['5', '10', '14'], a: 1, ok: '4 × 3 = 12, 12 − 2 = 10.' },
    { type: 'scratch', title: 'Matematik oyunu 🎲',
      text: '<p>Robo 3 soru sorsun. Her soruda: a\'yı (rastgele 1 ile 10) yap, b\'yi (rastgele 1 ile 10) yap, “a + b kaç?” diye sor. Sayılar sahnenin sol üstünde görünür. <b>Eğer cevap = (a + b)</b> ise “Doğru!” ve skoru artır, değilse “Yanlış”.</p>',
      setup: { backdrop: 'sahne', vars: { a: 0, b: 0, skor: 0 }, sprites: [sp('Robo', 'robo', 0, -60, { size: 120 })] },
      blocks: MATH_BLOCKS, reporters: ['op', 'rand', 'answer', 'join', 'var'], conds: ['cmp'], condDefault: cmp(ANS, '=', OP(V('a'), '+', V('b'))),
      goals: [{ t: '“rastgele” kullan', f: (a) => has(a, 'Robo', '"r":"rand"') }, { t: 'Cevabı (a + b) ile karşılaştır', f: (a) => has(a, 'Robo', '"k":"cmp"') && has(a, 'Robo', '"r":"op"') }, { t: 'En az 2 doğru', f: (a) => a.vars.skor >= 2 }],
      answers: (w) => String(w.vars.a + w.vars.b),
      sol: { Robo: [[['flag'], ['setv', 'skor', 0], ['repeat', 3, [['setv', 'a', R(1, 10)], ['setv', 'b', R(1, 10)], ['ask', 'a + b kaç?'], ['ife', cmp(ANS, '=', OP(V('a'), '+', V('b'))), [['sayFor', 'Doğru!', 1], ['chv', 'skor', 1]], [['sayFor', 'Yanlış', 1]]]]], ['sayFor', J('Skorun: ', V('skor')), 2]]] } },
    { type: 'scratch', title: '7\'ler tablosu',
      text: '<p>Kedi 7\'ler çarpım tablosunu söylesin: 7, 14, 21 … 70. <b>sayı</b> değişkenini 1\'den başlat, 10 kez tekrarla [(sayı × 7) de 0.5 saniye, sayıyı 1 değiştir].</p>',
      setup: { backdrop: 'cayir', vars: { sayı: 1 }, sprites: [sp('Kedi', 'kedi', 0, -60)] },
      blocks: MATH_BLOCKS, reporters: ['op', 'join', 'var'],
      goals: [{ t: 'Kedi “7” desin', f: (a) => a.w.log.said.some((s) => s.text === '7') }, { t: 'Kedi “70” desin', f: (a) => a.w.log.said.some((s) => s.text === '70') }],
      sol: { Kedi: [[['flag'], ['setv', 'sayı', 1], ['repeat', 10, [['sayFor', OP(V('sayı'), '*', 7), 0.4], ['chv', 'sayı', 1]]]]] } },
    { type: 'scratch', title: 'Büyüyen spiral 🌀',
      text: '<p>Her kenarı bir öncekinden biraz uzun bir spiral çiz: <b>uzunluk</b>\'u 5 yap; 40 kez tekrarla [(uzunluk) adım git, ↻ 90 derece dön, uzunluğu 5 değiştir].</p>',
      setup: { backdrop: 'beyaz', vars: { uzunluk: 5 }, sprites: [sp('Kalem', 'kalem', 0, 0, { rot: 'all' })] },
      blocks: MATH_BLOCKS, reporters: ['op', 'var'], showVars: ['uzunluk'],
      goals: [{ t: '“adım git” içinde değişken kullan', f: (a) => has(a, 'Kalem', '"op":"move","args":{"n":{"r":"var"') }, { t: 'En az 40 çizgi çiz', f: (a) => a.lines.length >= 40 }],
      sol: { Kalem: [[['flag'], ['clear'], ['goto', 0, 0], ['point', 90], ['setv', 'uzunluk', 5], ['down'], ['repeat', 40, [['move', V('uzunluk')], ['turnR', 90], ['chv', 'uzunluk', 5]]]]] } },
    { type: 'scratch', title: '⭐ Sihirli çokgen',
      text: '<p>Robo kaç kenarlı bir şekil çizeceğini sorsun. Sonra (cevap) kez tekrarla [80 adım git, ↻ (360 ÷ cevap) derece dön]. 3 yazınca üçgen, 6 yazınca altıgen çıkar!</p>',
      setup: { backdrop: 'beyaz', sprites: [sp('Kalem', 'kalem', -40, 80, { rot: 'all' })] },
      blocks: MATH_BLOCKS, reporters: ['op', 'answer', 'var'],
      goals: [{ t: '360 ÷ cevap hesabını kullan', f: (a) => has(a, 'Kalem', '"o":"/"') }, { t: 'Kenar sayısı kadar kapalı şekil çiz', f: (a) => { const s = shape(a.lines); return s.closed && s.n === 6; } }],
      answers: ['6'],
      sol: { Kalem: [[['flag'], ['clear'], ['goto', -40, 80], ['point', 90], ['ask', 'Kaç kenar?'], ['down'], ['repeat', ANS, [['move', 80], ['turnR', OP(360, '/', ANS)]]]]] } },
  ],
};

const CLONE_BLOCKS = ['flag', 'click', 'cloneStart', 'clone', 'delClone', 'forever', 'repeat', 'until', 'if', 'wait', 'goto', 'gotoRand', 'glide', 'move', 'chy', 'turnR', 'point', 'bounce', 'show', 'hide', 'size', 'chsize', 'color', 'next', 'sound'];

export const b31 = {
  icon: '👯', color: '#e67e22', title: 'Klonlar', concept: 'Klon',
  desc: 'Bir kuklanın kopyalarını yap: kar yağdır, balık sürüsü oluştur, havai fişek patlat!',
  learned: ['Klon, bir kuklanın oyun sırasında oluşturulan kopyasıdır.', 'Her klon “klon olarak başladığımda” betiğini kendi başına çalıştırır.', 'İşi biten klonlar “bu klonu sil” ile silinmelidir.'],
  teacher: '<b>Fotokopi oyunu:</b> Bir öğrenci “asıl kukla” olsun ve elinde bir görev kartı tutsun (“tahtaya git, el salla, yerine dön”). “Klon oluştur!” dediğinizde başka bir öğrenci aynı kartı alıp görevi yapsın. Görev bitince oturur (klonu sil). Aynı anda birçok klonun çalışabildiğini gösterin.',
  steps: [
    { type: 'story', anim: 'dance', title: 'Kuklanın fotokopisi 👯',
      text: `<p>Ekranda yüzlerce kar tanesi lazım. Yüz tane kukla mı yapacağız? Hayır! <b>Klon</b> kullanacağız.</p><p>${blk('control', 'kendim klonunu oluştur')} → kuklanın bir kopyasını yapar<br>${blk('control', 'klon olarak başladığımda', 1)} → her klon bu betiği çalıştırır<br>${blk('control', 'bu klonu sil')} → işi biten klon kaybolur</p><p class="mut">Asıl kuklayı genellikle <b>gizleriz</b>; sahnede sadece klonlar dolaşır.</p>`,
      pics: ['❄️', '❄️', '❄️', '❄️', '👯'] },
    { type: 'scratch', title: 'Kar yağışı ❄️',
      text: '<p>Yıldız (kar tanesi): 🏁 → gizle → sürekli tekrarla [kendim klonunu oluştur, 0.3 saniye bekle].<br>Klon olarak başladığımda → x: (rastgele -220 ile 220) y: 170\'e git → göster → <b>y &lt; -170 olana kadar</b> [y\'yi -4 değiştir] → bu klonu sil.</p>',
      setup: { backdrop: 'gece', sprites: [sp('Yıldız', 'yildiz', 0, 170, { size: 50 })] },
      blocks: CLONE_BLOCKS, reporters: ['rand'], conds: ['cmp', 'touch'], condDefault: cmp({ r: 'y' }, '<', -170),
      goals: [{ t: '“klon olarak başladığımda” kullan', f: (a) => a.hats('cloneStart') > 0 }, { t: 'Aynı anda en az 5 kar tanesi', f: (a) => visibleCount(a, 'Yıldız') >= 5 }, { t: 'Klonlar yere inince silinsin', use: 'delClone' }],
      sol: { Yıldız: [[['flag'], ['hide'], ['forever', [['clone', 'kendim'], ['wait', 0.3]]]], [['cloneStart'], ['goto', R(-220, 220), 170], ['show'], ['until', cmp({ r: 'y' }, '<', -170), [['chy', -4]]], ['delClone']]] } },
    { type: 'quiz', title: 'Klon nedir?',
      q: 'Bir kuklanın klonu için hangisi doğru?',
      opts: ['Tamamen farklı bir kuklanın adıdır', 'Kuklanın oyun sırasında yapılan kopyasıdır ve kendi başına hareket edebilir', 'Kuklanın sesidir'], a: 1,
      ok: 'Klonlar asıl kuklanın kostümünü ve kodunu alır ama her biri ayrı hareket eder.' },
    { type: 'scratch', title: 'Balık sürüsü 🐟',
      text: '<p>Balık: 🏁 → gizle → 6 kez tekrarla [kendim klonunu oluştur]. Klon olarak başladığımda → rastgele konuma git → (rastgele) yönüne dön → göster → sürekli tekrarla [4 adım git, kenara geldiyse sek].</p>',
      setup: { backdrop: 'deniz', sprites: [sp('Balık', 'balik', 0, 0, { size: 60 })] },
      blocks: CLONE_BLOCKS, reporters: ['rand'],
      goals: [{ t: 'En az 6 klon', f: (a) => a.w.log.clones >= 6 }, { t: '6 balık aynı anda yüzsün', f: (a) => visibleCount(a, 'Balık') >= 6 }],
      sol: { Balık: [[['flag'], ['hide'], ['repeat', 6, [['clone', 'kendim']]]], [['cloneStart'], ['gotoRand'], ['point', R(-180, 180)], ['show'], ['forever', [['move', 4], ['bounce']]]]] } },
    { type: 'scratch', title: 'Tıkla, çoğalsın! ❤️',
      text: '<p>Kalbe tıklanınca kendi klonunu oluştursun. Klon olarak başladığımda: rastgele konuma git, rengini değiştir. Kalbe birkaç kez tıkla!</p>',
      setup: { backdrop: 'sahne', sprites: [sp('Kalp', 'kalp', 0, 0, { size: 150 })] },
      blocks: CLONE_BLOCKS, reporters: ['rand'], noFlag: true,
      goals: [{ t: 'Tıklanınca klon oluştur', f: (a) => a.hats('click') > 0 && a.uses('clone') }, { t: 'En az 3 klon yap', f: (a) => a.w.log.clones >= 3 }],
      sol: { Kalp: [[['click'], ['clone', 'kendim'], ['sound', 'pop']], [['cloneStart'], ['gotoRand'], ['color', R(10, 150)], ['size', 80]]] },
      play: [0.3, 0.8, 1.3].map((t) => ['click', 'Kalp', t]) },
    { type: 'scratch', title: '⭐ Havai fişek 🎆',
      text: '<p>Yıldıza tıklanınca 12 klon oluştursun. Her klon rastgele bir yöne dönüp 15 adım boyunca uçsun, rengi değişsin, sonra silinsin. Patlama gibi!</p>',
      setup: { backdrop: 'gece', sprites: [sp('Yıldız', 'yildiz', 0, 0, { size: 60 })] },
      blocks: CLONE_BLOCKS, reporters: ['rand'], noFlag: true,
      goals: [{ t: 'En az 12 klon', f: (a) => a.w.log.clones >= 12 }, { t: 'Klonlar silinsin', use: 'delClone' }],
      sol: { Yıldız: [[['click'], ['repeat', 12, [['clone', 'kendim']]]], [['cloneStart'], ['point', R(-180, 180)], ['repeat', 15, [['move', 8], ['color', 10]]], ['delClone']]] },
      play: [['click', 'Yıldız', 0.5]] },
  ],
};

// --- Uzay savaşçısı (proje) ---
const WAR_SETUP = { backdrop: 'uzay', vars: { skor: 0 }, sprites: [sp('Göktaşı', 'asteroit', 0, 170, { rot: 'all', size: 80, visible: false }), sp('Lazer', 'lazer', 0, -100, { visible: false }), sp('Roket', 'roket', 0, -140, { dir: 0, rot: 'all' })] };
const WAR_BLOCKS = ['flag', 'key', 'cloneStart', 'clone', 'delClone', 'forever', 'until', 'if', 'wait', 'goto', 'gotoT', 'chx', 'chy', 'turnR', 'show', 'hide', 'sound', 'sayFor', 'stop', 'setv', 'chv', 'point'];
const ROCKET = [[['flag'], ['goto', 0, -140], ['point', 0], ['forever', [['if', key('left'), [['chx', -6]]], ['if', key('right'), [['chx', 6]]]]]]];
const FIRE = [['key', 'space'], ['clone', 'Lazer']];
const LASER = [[['flag'], ['hide']], [['cloneStart'], ['gotoT', 'Roket'], ['show'], ['until', touch('kenar'), [['chy', 12]]], ['delClone']]];
const rockClone = (hit) => [['cloneStart'], ['goto', R(-210, 210), 170], ['show'], ['until', cmp({ r: 'y' }, '<', -170), [['chy', -3], ['turnR', 3], ...hit]], ['delClone']];
const ROCK_SPAWN = [['flag'], ['hide'], ['setv', 'skor', 0], ['forever', [['clone', 'kendim'], ['wait', 1]]]];
const HIT = [['if', touch('Lazer'), [['chv', 'skor', 1], ['sound', 'pop'], ['delClone']]]];
const CRASH = [[['flag'], ['forever', [['if', touch('Göktaşı'), [['sound', 'boing'], ['sayFor', 'Oyun bitti!', 1], ['stop']]]]]]];
// Test: roketi bir göktaşı klonunun altına getirip ateş eder
const aim = Array.from({ length: 40 }, (_, i) => ['fn', 1 + i * 0.4, (w) => { const c = w.sprites.find((s) => s.name === 'Göktaşı' && s.isClone && s.y > 0); if (c) { w.sprite('Roket').x = c.x; w.keyDown('space'); w.keyUp('space'); } }]);

export const b32 = {
  icon: '👾', color: '#7c3aed', title: 'Oyun 4: Uzay Savaşçısı', concept: 'Klonlarla oyun',
  desc: 'Klonlarla tam bir atari oyunu: roketinle lazer at, yağan göktaşlarını vur, puan topla!',
  learned: ['Klonlar mermi, düşman, yağmur gibi çok sayıda nesne için kullanılır.', 'Bir kukla başka bir kuklanın klonunu oluşturabilir (roket → lazer).', 'Büyük bir oyun küçük adımlarla, her adım denenerek yapılır.'],
  teacher: '<b>Oyun fuarı:</b> Bu son oyunla birlikte öğrencilerin dört oyunu oldu. Sınıfça bir “oyun salonu” düzenleyin: bilgisayarlar açık kalsın, öğrenciler dolaşıp birbirinin oyununu oynasın ve en yüksek skoru tahtaya yazsın. Gerçek Scratch\'te bu oyunu paylaşmak isteyenlere yardım edin.',
  steps: [
    { type: 'story', anim: 'wave', title: 'Son büyük oyun! 👾',
      text: '<p>Uzayda göktaşı yağmuru var! Roketinle <b>sağa-sola</b> gidip <b>boşluk</b> tuşuyla lazer atacaksın.</p><ol class="tips"><li>Lazerler ve göktaşları <b>klon</b> olacak.</li><li>Lazer göktaşına değerse puan kazanırsın.</li><li>Göktaşı rokete değerse oyun biter.</li></ol>',
      pics: ['🚀', '🔫', '☄️', '💥', '🏆'] },
    { type: 'scratch', title: '1. adım: Roket hareketi',
      text: '<p>Roket: 🏁 → x: 0 y: -140\'a git → 0 yönüne dön → sürekli tekrarla [eğer sol ok basılı ise x\'i -6 değiştir; eğer sağ ok basılı ise x\'i 6 değiştir].</p>',
      setup: WAR_SETUP, blocks: WAR_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: key('left'), edit: 'Roket',
      goals: [{ t: 'Sol ve sağ için iki “eğer”', f: (a) => has(a, 'Roket', '"key":"left"') && has(a, 'Roket', '"key":"right"') }, { t: 'Roket sağa gitsin', f: (a) => a.sp('Roket').x > 60 }],
      sol: { Roket: ROCKET }, play: [['hold', 'right', 0.5, 1.5]] },
    { type: 'scratch', title: '2. adım: Lazer at',
      text: `<p>Rokete: <b>boşluk tuşuna basılınca</b> → <b>Lazer klonunu oluştur</b>.<br>Lazer\'e: 🏁 → gizle. Klon olarak başladığımda → ${blk('motion', 'Roket konumuna git')} → göster → <b>kenara dokunana kadar</b> [y\'yi 12 değiştir] → bu klonu sil.</p>`,
      setup: WAR_SETUP, blocks: WAR_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: touch('kenar'), edit: 'Lazer', keep: true,
      goals: [{ t: 'Boşluk tuşu ile Lazer klonu oluştur', f: (a) => has(a, 'Roket', '"o":"Lazer"') }, { t: 'Lazer yukarı uçsun', f: (a) => a.w.sprites.some((s) => s.name === 'Lazer' && s.isClone && s.y > 50) }],
      sol: { Roket: [...ROCKET, FIRE], Lazer: LASER }, play: [['tap', 'space', 0.5], ['tap', 'space', 1]] },
    { type: 'scratch', title: '3. adım: Göktaşı yağmuru',
      text: '<p>Göktaşı: 🏁 → gizle → skoru 0 yap → sürekli tekrarla [kendim klonunu oluştur, 1 saniye bekle].<br>Klon olarak başladığımda → x: (rastgele -210 ile 210) y: 170\'e git → göster → <b>y &lt; -170 olana kadar</b> [y\'yi -3 değiştir, ↻ 3 derece dön] → bu klonu sil.</p>',
      setup: WAR_SETUP, blocks: WAR_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: cmp({ r: 'y' }, '<', -170), edit: 'Göktaşı', keep: true,
      goals: [{ t: 'Göktaşı klonları oluşsun', f: (a) => a.w.log.clones >= 3 }, { t: 'Aynı anda en az 3 göktaşı', f: (a) => visibleCount(a, 'Göktaşı') >= 3 }],
      sol: { Roket: [...ROCKET, FIRE], Lazer: LASER, Göktaşı: [ROCK_SPAWN, rockClone([])] } },
    { type: 'scratch', title: '4. adım: Vur! 💥',
      text: '<p>Göktaşı klonunun döngüsüne bir kural ekle: <b>eğer Lazer\'e dokunuyorsa</b> → skoru 1 değiştir → pop sesi → bu klonu sil. Sonra oyna ve göktaşlarını vur!</p>',
      setup: WAR_SETUP, blocks: WAR_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: touch('Lazer'), edit: 'Göktaşı', keep: true,
      goals: [{ t: 'Lazer çarpışma kuralı yaz', f: (a) => has(a, 'Göktaşı', '"o":"Lazer"') }, { t: '3 göktaşı vur', f: (a) => a.vars.skor >= 3 }],
      sol: { Roket: [...ROCKET, FIRE], Lazer: LASER, Göktaşı: [ROCK_SPAWN, rockClone(HIT)] }, play: aim, testTime: 20 },
    { type: 'scratch', title: '5. adım: Dikkat, çarpışma!',
      text: '<p>Rokete yeni bir betik: 🏁 → sürekli tekrarla [<b>eğer Göktaşı\'na dokunuyorsa</b> → boing sesi → “Oyun bitti!” de → tümünü durdur]. Artık oyunun tamam!</p>',
      setup: WAR_SETUP, blocks: WAR_BLOCKS, reporters: ['rand', 'var'], conds: ['key', 'touch', 'cmp'], condDefault: touch('Göktaşı'), edit: 'Roket', keep: true, testTime: 30,
      goals: [{ t: 'Göktaşı çarpışma kuralı yaz', f: (a) => has(a, 'Roket', '"o":"Göktaşı"') }, { t: 'Çarpınca “Oyun bitti!” desin', f: (a) => a.said('oyun bitti', 'Roket') }],
      sol: { Roket: [...ROCKET, FIRE, ...CRASH], Lazer: LASER, Göktaşı: [ROCK_SPAWN, rockClone(HIT)] },
      play: Array.from({ length: 60 }, (_, i) => ['fn', 1 + i * 0.3, (w) => { const c = w.sprites.find((s) => s.name === 'Göktaşı' && s.isClone && s.y < 0); if (c) w.sprite('Roket').x = c.x; }]) },
    { type: 'story', anim: 'dance', title: 'Bir atari oyunu yaptın! 🕹️',
      text: '<p>Tebrikler! Klonlarla gerçek bir atari oyunu yaptın. İstersen geri dönüp geliştir:</p><ol class="tips"><li>Göktaşları zamanla hızlansın (hız değişkeni!).</li><li>3 can ekle.</li><li>Skor 20 olunca “Kazandın!” haberi salınsın.</li></ol><p>Ve… bütün eğitimi bitirdin! 🎓 Bitirince <b>sertifikanı</b> alabilirsin: adını yaz ve yazdır! 🏅</p>' },
  ],
};
