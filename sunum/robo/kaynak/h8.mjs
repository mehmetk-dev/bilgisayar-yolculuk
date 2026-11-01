// 8. hafta: Scratch ustalığı: soru, matematik, klonlar (29–32. bölümler)
import { lesson, weekCover, weekEnd, quiz, botsay, robo, ders, scratch, blocks, step } from './yardim.mjs';

const D = await ders(8);
const W = 8;
const L1 = lesson({ week: W, idx: 1, no: 29, color: '#5cb1d6', icon: '💬', title: 'Sor ve Cevapla', desc: 'Kuklalar soru sorsun, sen yaz! Cevaba göre konuşan karakterler ve bilgi yarışmaları.' });
const L2 = lesson({ week: W, idx: 2, no: 30, color: '#59c059', icon: '➗', title: 'Matematik İşlemleri', desc: 'Toplama, çıkarma, çarpma, bölme bloklarıyla hesap makinesi ve matematik oyunları.' });
const L3 = lesson({ week: W, idx: 3, no: 31, color: '#e67e22', icon: '👯', title: 'Klonlar', desc: 'Bir kuklanın kopyalarını yap: kar yağdır, balık sürüsü oluştur!' });
const L4 = lesson({ week: W, idx: 4, no: 32, color: '#7c3aed', icon: '👾', title: 'Oyun 4: Uzay Savaşçısı', desc: 'Klonlarla tam bir atari oyunu: lazer at, göktaşlarını vur, puan topla!' });
const sol = (L, t) => step(L, t).sol;
// Betikteki bir bloğu (op) her yerden çıkar: hatalı örnekler için
const without = (progs, op) => JSON.parse(JSON.stringify(progs, (k, v) => (Array.isArray(v) ? v.filter((x) => !(Array.isArray(x) && x[0] === op)) : v)));

const slides = [
  weekCover({ week: W, title: 'Scratch Ustalığı', color: '#5cb1d6', lessons: [['💬', 'Sor ve cevapla'], ['➗', 'Matematik'], ['👯', 'Klonlar'], ['👾', 'Uzay savaşçısı']],
    note: 'Son hafta! Soru soran sahnelerde sahnenin altında bir yazı kutusu açılır: tahtaya yazıp ✔\'e basın. Yazı kutusundayken klavye kısayolları çalışmaz.' }),

  /* ---------------- 29. BÖLÜM ---------------- */
  L1.cover('Şimdiye kadar hep kuklalar konuştu. Bugün sıra sizde: kuklalar soracak, siz cevaplayacaksınız!'),
  L1.s({ tag: 'YENİ BLOK', title: 'Kuklalar soru soruyor! 💬',
    body: `<div class="row"><div class="col"><p><b>sor ve bekle</b> bloğu sahnenin altında bir <b>yazı kutusu</b> açar.</p><p class="f">Cevabını yazıp <b>✔</b>\'e basınca program devam eder.</p><p class="f">Yazdığın şey <b style="color:#5cb1d6">cevap</b> bloğunda saklanır.</p></div><div style="flex:0 0 560px">${blocks([[['ask', 'Adın ne?']], [['sayFor', { r: 'answer' }, 2]]])}</div></div>` }),
  L1.game({ title: '🎤 Canlı bilgi yarışması',
    body: `<div class="row"><div class="col"><p class="f">Bir öğrenci <b>sunucu kukla</b> olur, soruları sorar.</p><p class="f">Cevaba göre: “<b>Doğru! +1 puan</b>” ya da “<b>Yanlış</b>”</p><p class="f">Tahtada <b>skor</b> tutulur. 🗃️</p><p class="f">Sonra aynısını Scratch\'te yapacağız!</p></div><div style="flex:0 0 260px">${robo('wave', 240)}</div></div>` }),
  L1.s({ tag: 'İZLE 👀', title: 'Tanışalım', body: scratch(D.b29, 'Tanışalım'), note: '🏁\'a basın; kedi adınızı sorar. Yazı kutusuna bir ad yazıp ✔\'e basın. “birleştir” bloğu iki yazıyı yan yana koyar.' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Oyuncu soruya “kırmızı” yazdı. Bu yazı <b>nerede</b> saklanır?', opts: ['👕 Kostümde', '🌄 Dekorda', '💬 “cevap” bloğunda'], a: 2, why: 'Yazılan cevap <b>cevap</b> bloğunda saklanır.' }) }),
  L1.s({ tag: 'İZLE 👀', title: 'Bilgi yarışması', body: scratch(D.b29, 'Bilgi yarışması', { sm: true }), note: 'Önce “Ankara” yazın, sonra başka bir şey yazıp tekrar deneyin. Eğer-değilse bloğu iki yoldan birini seçer.' }),
  L1.hard({ title: 'Bilgisayar cevabı harf harf karşılaştırır',
    body: `<div class="row"><div class="col"><p>Cevap <b>Ankara</b> ise doğru.</p><p class="f">✅ <b>Ankara</b> → Doğru! (büyük-küçük harf fark etmez: <b>ankara</b> da olur)</p><p class="f">❌ <b>Ankra</b> → Yanlış! Bir harf eksik.</p><p class="f">❌ <b>Ankara\'dır</b> → Yanlış! Fazladan ek var.</p><p class="f">💡 Soruda nasıl yazılacağını söyle: “Sadece şehrin adını yaz.”</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Çocuklar “Ankara’dır” ya da boşluklu yazınca şaşırıyor. Bilgisayar anlamı değil yazıyı karşılaştırır.' }),
  L1.pc(['👋 Tanışalım', '❓ Cevap nerede?', '🏆 Bilgi yarışması', '🏆 Üç soruluk yarışma', '⭐ Şifreli kapı', '⭐ Kendi yarışman']),

  /* ---------------- 30. BÖLÜM ---------------- */
  L2.cover('Sorun: “Bilgisayar 1 saniyede kaç işlem yapabilir?” (Milyarlarca!)'),
  L2.s({ tag: 'İŞLEM ➗', title: 'Bilgisayar bir hesap ustası 🧮',
    body: `<div class="row"><div class="col"><p><b style="color:#3f9a3f">Yeşil işlem blokları</b> hesap yapar:</p><p class="f">➕ toplama · ➖ çıkarma · ✖️ çarpma · ➗ bölme</p><p class="f">İçine <b>değişken</b>, <b>cevap</b> ya da <b>rastgele</b> konabilir!</p></div><div style="flex:0 0 520px">${blocks([[['sayFor', { r: 'op', o: '+', a: 3, b: 4 }, 2]], [['sayFor', { r: 'op', o: '*', a: { r: 'var', v: 'sayı' }, b: 7 }, 2]]])}</div></div>` }),
  L2.game({ title: '🧮 İnsan hesap makinesi',
    body: `<div class="row"><div class="col"><p class="f">İki öğrenci <b>a</b> ve <b>b</b> kutusu olur, ellerinde sayı kartı var.</p><p class="f">Üçüncü öğrenci <b>işlem bloğu</b>: kartlara bakıp sonucu söyler.</p><p class="f">Kartları <b>rastgele</b> çekin, tekrar oynayın!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L2.s({ tag: 'İZLE 👀', title: 'Sayıları söyle', body: scratch(D.b30, 'Sayıları söyle') }),
  L2.s({ tag: 'İZLE 👀', title: 'Toplama makinesi', body: scratch(D.b30, 'Toplama makinesi', { sm: true }), note: 'Robo iki sayı sorar; iki kez yazı kutusuna sayı yazın. Sonra toplamı söyler. a ve b sol üstte görünür.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'a = 4, b = 3 ise <b>(a × b) − 2</b> kaç eder? Önce çarp, sonra çıkar.', opts: ['5', '10', '14'], a: 1, why: '4 × 3 = 12, 12 − 2 = <b>10</b>.' }) }),
  L2.s({ tag: 'İZLE 👀', title: '7\'ler tablosu', body: scratch(D.b30, '7\'ler tablosu', { sm: true }), note: 'sayı değişkeni 1\'den 10\'a kadar artar; kedi her seferinde sayı × 7\'yi söyler.' }),
  L2.s({ tag: 'İZLE 👀', title: '⭐ Büyüyen spiral 🌀', body: scratch(D.b30, '⭐ Bonus: Büyüyen spiral', { sm: true }), note: 'Her kenar bir öncekinden 5 adım uzun: değişken + kalem.' }),
  L2.pc(['🔢 Sayıları söyle', '➕ Toplama makinesi', '❓ Hesapla', '🎲 Tek soru', '7️⃣ 7\'ler tablosu', '⭐ Matematik oyunu', '⭐ Büyüyen spiral', '⭐ Sihirli çokgen']),

  /* ---------------- 31. BÖLÜM ---------------- */
  L3.cover('Sorun: “Bir oyunda yüzlerce kar tanesi nasıl yağıyor? Hepsini tek tek mi çiziyorlar?”'),
  L3.s({ tag: 'YENİ KELİME', title: 'Kuklanın fotokopisi 👯',
    body: `<div class="row"><div class="col"><p><b style="color:#e67e22">Klon</b>: kuklanın oyun sırasında yapılan <b>kopyası</b>.</p><p class="f">📄 <b>klonunu oluştur</b> → bir kopya yapar</p><p class="f">▶ <b>klon olarak başladığımda</b> → her klon bunu çalıştırır</p><p class="f">🗑️ <b>bu klonu sil</b> → işi biten klon kaybolur</p></div><div style="flex:0 0 500px">${blocks([[['clone', 'kendim']], [['cloneStart'], ['gotoRand']], [['delClone']]])}</div></div>` }),
  L3.game({ title: '📄 Fotokopi oyunu',
    body: `<div class="row"><div class="col"><p class="f">Bir öğrenci <b>asıl kukla</b>, elinde görev kartı: “tahtaya git, el salla, yerine dön”.</p><p class="f">“<b>Klon oluştur!</b>” deyince başka bir öğrenci aynı kartı alıp görevi yapar.</p><p class="f">Görev bitince oturur: <b>klonu sil</b>!</p><p class="f">Aynı anda <b>birçok klon</b> çalışabilir.</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L3.s({ tag: 'İZLE 👀', title: 'Tıkla, çoğalsın! ❤️', body: scratch(D.b31, 'Tıkla, çoğalsın', { sm: true }), note: 'Sahnedeki kalbe birkaç kez tıklayın: her tıklamada bir klon çıkar.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir kuklanın <b>klonu</b> için hangisi doğru?', v: true, opts: ['Oyun sırasında yapılan kopyası, kendi başına hareket edebilir', 'Tamamen farklı bir kuklanın adı', 'Kuklanın sesi'], a: 0, why: 'Klon kuklanın <b>kopyasıdır</b> ve kendi betiğini çalıştırır.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Balık sürüsü 🐟', body: scratch(D.b31, 'Balık sürüsü', { sm: true }), note: 'Asıl balık gizlenir ve 6 klon yapar. Her klon kendi yönünde yüzer.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Kar yağışı ❄️', body: scratch(D.b31, 'Kar yağışı', { sm: true }) }),
  L3.hard({ title: 'İşi biten klonu sil!',
    body: scratch(D.b31, 'Kar yağışı', { sm: true, variants: [['🐞 Silmiyor', without(sol(D.b31, 'Kar yağışı'), 'delClone')], ['✅ Siliyor', sol(D.b31, 'Kar yağışı')]] }),
    note: 'Silinmeyen klonlar yere yığılır; zamanla yüzlerce klon birikir ve bilgisayar yavaşlar. İşi biten klon mutlaka silinmeli.' }),
  L3.pc(['❤️ Tıkla, çoğalsın', '❓ Klon nedir?', '🐟 Balık sürüsü', '❄️ Kar yağışı', '⭐ Havai fişek']),

  /* ---------------- 32. BÖLÜM ---------------- */
  L4.cover('Son büyük oyun! Klonlarla bir atari oyunu yapıyoruz.'),
  L4.s({ tag: 'SON OYUN 👾', title: 'Uzayda göktaşı yağmuru!',
    body: botsay('<p>⬅ ➡ Roketinle sağa sola git, <b>boşluk</b> ile lazer at!</p><p class="f">🔴 Lazerler ve ☄️ göktaşları <b>klon</b> olacak.</p><p class="f">💥 Lazer göktaşına değerse <b>puan</b>!</p><p class="f">😱 Göktaşı rokete değerse <b>oyun biter</b>.</p>', 'dance') }),
  L4.s({ tag: '2. ADIM', title: 'Lazer at!', body: scratch(D.b32, '2. adım', { sm: true }), note: 'Bir kukla başka bir kuklanın klonunu oluşturabilir: roket boşluk tuşuyla <b>Lazer</b> klonu yapar. ← → ve boşluk düğmelerini kullanın.' }),
  L4.s({ tag: '4. ADIM', title: 'Vur! 💥', body: scratch(D.b32, '4. adım', { sm: true, show: 'Göktaşı' }), note: 'Göktaşı klonları yukarıdan düşer; lazere değen göktaşı silinir ve skor artar. Bir öğrenci tahtada oynasın!' }),
  L4.game({ title: '🕹️ Oyun salonu',
    body: `<div class="row"><div class="col"><p class="f">Bilgisayarlar açık kalsın: sınıf bir <b>oyun salonu</b>!</p><p class="f">Dolaşın, birbirinizin oyununu oynayın.</p><p class="f">En yüksek skoru <b>tahtaya</b> yazın! 🏆</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L4.s({ tag: 'TEBRİKLER 🎓', title: 'Tebrikler, programcı!',
    body: botsay('<p>Robo\'ya ilk adımını attırdığın günden bugüne çok yol aldın:</p><p class="f">📋 algoritma · 🔁 döngü · 🧩 fonksiyon · ❓ koşul · 🗃️ değişken · 📣 haber · 👯 klon</p><p class="f">… ve <b>kendi oyunların</b>! 🎮</p><p class="f">Bölümü bitirince <b>sertifikanı</b> alabilirsin! 🏅</p>', 'dance'),
    note: 'Sertifika 32. bölümün sonunda: öğrenci adını yazıp yazdırabilir. İsteyenler ek bölümlere (33–44) devam edebilir.' }),
  L4.pc(['🚀 1. adım: Roket', '🔴 2. adım: Lazer', '☄️ 3. adım: Göktaşı', '💥 4. adım: Vur!', '🕹️ Atari oyunu', '⭐ Dikkat, çarpışma!']),

  weekEnd({ week: W, color: '#5cb1d6', next: 'Gerçek Scratch: scratch.mit.edu 🐱',
    items: ['<b>sor ve bekle</b> bir yazı kutusu açar; yazılan şey <b>cevap</b>\'ta saklanır.', 'Cevabı <b>eğer</b> ile karşılaştırıp doğru-yanlış kontrol ederiz.', 'Yeşil <b>işlem blokları</b> (+ − × ÷) hesap yapar.', '<b>Klon</b>, kuklanın oyun sırasında yapılan kopyasıdır.', 'İşi biten klon <b>silinmelidir</b>.', 'Büyük bir oyun <b>küçük adımlarla</b>, her adım denenerek yapılır.'] }),
];

export default { title: 'Scratch Ustalığı', slides };
