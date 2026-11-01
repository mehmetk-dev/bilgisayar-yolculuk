// 5. hafta: Döngü, ses, algılama ve kalem (17–20. bölümler)
import { lesson, weekCover, weekEnd, quiz, botsay, robo, ders, scratch, blocks, step } from './yardim.mjs';

const D = await ders(5);
const W = 5;
const L1 = lesson({ week: W, idx: 1, no: 17, color: '#ffab19', icon: '♾️', title: 'Sürekli Tekrarla', desc: 'Hiç durmayan döngüyle canlı sahneler: yüzen balıklar, seken toplar, dönen çarklar.' });
const L2 = lesson({ week: W, idx: 2, no: 18, color: '#cf63cf', icon: '🎵', title: 'Sesler ve Müzik', desc: 'Davul çal, Do-Re-Mi söyle, “Küçük Yıldız” şarkısını programla!' });
const L3 = lesson({ week: W, idx: 3, no: 19, color: '#5cb1d6', icon: '📡', title: 'Algılama: Dokunuyor mu?', desc: 'Kuklalar birbirine ya da kenara dokunduğunu anlasın. Oyun kuralları kur!' });
const L4 = lesson({ week: W, idx: 4, no: 20, color: '#0fbd8c', icon: '✏️', title: 'Kalemle Çizim', desc: 'Kukla yürüdükçe iz bıraksın! Kare, üçgen, yıldız ve çiçek çiz.' });
const sol = (L, t) => step(L, t).sol;

const slides = [
  weekCover({ week: W, title: 'Döngü, Ses, Algılama ve Kalem', color: '#ffab19', lessons: [['♾️', 'Sürekli tekrarla'], ['🎵', 'Müzik'], ['📡', 'Algılama'], ['✏️', 'Kalem']],
    note: 'Sınıfta hoparlör yoksa sorun değil: çalınan her ses ve nota sahnede yazıyla (🔊 / ♪) görünür.' }),

  /* ---------------- 17. BÖLÜM ---------------- */
  L1.cover('Hatırlatma: Robo ile “10 kez tekrarla”yı öğrenmiştik. Bugün hiç durmayan döngü!'),
  L1.s({ tag: 'YENİ BLOK', title: 'Hiç durmayan döngü 🌀',
    body: `<div class="row"><div class="col"><p><b>sürekli tekrarla</b> içindekiler hiç durmadan tekrar eder…</p><p class="f">… ta ki sen <b>⏹ durdur</b>a basana kadar!</p><p class="f">Bir <b>vantilatör</b> gibi: düğmeyi kapatana kadar döner. 🌀</p><p class="f">Çoğu oyun bu döngüyü kullanır.</p></div><div style="flex:0 0 440px">${blocks([[['forever', [['move', 10], ['bounce']]]]])}</div></div>`,
    note: 'Sürekli tekrarla bloğunun altına başka blok takılamaz (altı düz). Çünkü hiç bitmez!' }),
  L1.game({ title: '🔍 Sonsuz döngü avı',
    body: `<div class="row"><div class="col"><p>Hayatta <b>hiç durmadan</b> tekrar eden şeyler bul:</p><p class="f">❤️ kalp atışı · 🌞🌙 gece-gündüz · 🕐 saat · 🍂 mevsimler</p><p class="f">Peki <b>bitene kadar</b> tekrar edenler? 📚 ödev, 🍽️ yemek</p><p class="f">Oyunlarda ne sürekli tekrar eder? 🎮</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L1.s({ tag: 'İZLE 👀', title: 'Hiç durmayan balık', body: scratch(D.b17, 'Hiç durmayan balık'), note: '“kenara geldiyse sek” bloğu kuklayı sahnede tutar: kenara gelince geri döner. ⏹ ile durdurun.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Zıp zıp top', body: scratch(D.b17, 'Zıp zıp top'), note: '45 = çapraz yön. Top hem tavana hem yere çarpıp seker.' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: '“sürekli tekrarla” döngüsü <b>ne zaman</b> durur?', v: true, opts: ['10 turdan sonra', '⏹ durdur düğmesine basınca', 'Kukla kenara gelince'], a: 1, why: 'Sürekli tekrarla <b>kendi kendine bitmez</b>; ⏹ ile durur.' }) }),
  L1.hard({ title: 'İki betik aynı anda çalışır!', body: scratch(D.b17, 'İki betik birden'),
    note: 'Kuşun iki 🏁 betiği var: biri kanat çırpar, biri uçar. 🏁\'a basınca <b>ikisi birden</b> başlar. Çocuklar bunları tek betikte birleştirmeye çalışınca kuş takılır.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Rüzgâr gülü', body: scratch(D.b17, 'Rüzgâr gülü') }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir oyunda hangisi <b>sürekli tekrarla</b> içinde olmalı?', v: true, opts: ['Başta bir kez “Hoş geldin” demek', 'Oyun bitince “Kazandın” demek', 'Düşmanın sürekli hareket etmesi'], a: 2, why: 'Düşman oyun boyunca <b>hiç durmadan</b> hareket eder.' }) }),
  L1.pc(['🐟 Hiç durmayan balık', '⚽ Zıp zıp top', '❓ Ne zaman durur?', '🐦 İki betik: uçan kuş', '🌀 Rüzgâr gülü', '✨ Sihirli değnek', '❓ Oyunlarda sonsuz döngü', '⭐ Akvaryum']),

  /* ---------------- 18. BÖLÜM ---------------- */
  L2.cover('Sorun: “En sevdiğiniz şarkı hangisi?” Bugün bilgisayara şarkı çaldıracağız.'),
  L2.s({ tag: 'SES 🎶', title: 'Müzik zamanı!',
    body: `<div class="row"><div class="col"><p><b style="color:#cf63cf">Pembe Ses blokları</b> kuklaya ses çıkarttırır: miyav, hav, davul, zil…</p><p class="f">Nota bloğu müzik çalar: <b>Do, Re, Mi, Fa, Sol, La, Si, İnce Do</b></p><p class="f"><b>Vuruş</b> = notanın uzunluğu. 1 vuruş, yarım vuruştan <b>daha uzundur</b>.</p></div><div style="flex:0 0 520px">${blocks([[['soundW', 'davul']], [['note', 60, 0.5]], [['note', 67, 1]]])}</div></div>`,
    note: 'Hoparlör yoksa çalınan nota kuklanın üstünde ♪ Do gibi yazıyla görünür.' }),
  L2.game({ title: '🥁 Beden perküsyonu',
    body: `<div class="row"><div class="col"><p class="f">👏 alkış, 👏 alkış, 🦵 dizlere vur → <b>4 kez</b> tekrarla! (Döngü!)</p><p class="f">🎹 İnsan piyanosu: 8 öğrenci boy sırasına dizilir.</p><p class="f">Do en kısa, İnce Do en uzun. Herkes kendi notasını söyler.</p><p class="f">Hep birlikte “Küçük Yıldız”ı çalın! ⭐</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L2.s({ tag: 'İZLE 👀', title: 'Davulcu 🥁', body: scratch(D.b18, 'Davulcu') }),
  L2.s({ tag: 'İZLE 👀', title: 'Do Re Mi', body: scratch(D.b18, 'Do Re Mi', { sm: true }), note: 'Sekiz nota sırayla: Do, Re, Mi, Fa, Sol, La, Si, İnce Do. Sınıf da birlikte söylesin.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Nota bloğundaki <b>vuruş</b> sayısını 0.5\'ten 1\'e çıkarırsak ne olur?', pic: blocks([[['note', 60, 0.5]]]), v: true, opts: ['Nota daha uzun çalar', 'Nota daha ince çıkar', 'Nota iki kez çalar'], a: 0, why: 'Vuruş notanın <b>uzunluğudur</b>.' }) }),
  L2.hard({ title: 'Şarkı da bir algoritma!', body: scratch(D.b18, 'Küçük Yıldız', { sm: true, variants: [['🐞 Sıra karışık', { Yıldız: [[['flag'], ['note', 67, 0.5], ['note', 60, 0.5], ['note', 69, 0.5], ['note', 60, 0.5], ['note', 67, 0.5], ['note', 69, 0.5], ['note', 67, 1]]] }], ['✅ Doğru sıra', sol(D.b18, 'Küçük Yıldız')]] }),
    note: 'Notalar aynı ama sırası karışınca şarkı tanınmaz. Tıpkı algoritmada olduğu gibi: <b>sıra önemli!</b> Doğru sıra: Do Do Sol Sol La La Sol.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Klavye piyano 🎹', body: scratch(D.b18, 'Klavye piyano'), note: 'a, s, d düğmeleri Do, Re, Mi çalar. Bir öğrenci tahtaya gelip çalsın.' }),
  L2.pc(['🥁 Davulcu', '🎶 Do Re Mi', '❓ Vuruş ne demek?', '⭐ Küçük Yıldız', '🎹 Klavye piyano', '🤖 Dans eden Robo', '⭐ Tam şarkı', '⭐ Kendi şarkın']),

  /* ---------------- 19. BÖLÜM ---------------- */
  L3.cover('Hatırlatma: Robo\'nun sensörleri vardı: “Önüm açık mı?” Scratch kuklalarının da var!'),
  L3.s({ tag: 'ALGILAMA 👀', title: 'Kuklaların gözleri',
    body: `<div class="row"><div class="col"><p><b style="color:#5cb1d6">Açık mavi Algılama</b> soruları:</p><p class="f">“Kenara dokunuyor muyum?”</p><p class="f">“Elmaya dokunuyor muyum?”</p><p class="f">Cevap <b>evet</b> ise <b>eğer … ise</b> bloğu bir iş yapar.</p></div><div style="flex:0 0 560px">${blocks([[['if', { k: 'touch', o: 'kenar' }, [['sayFor', 'Ay!', 1]]]]])}</div></div>` }),
  L3.game({ title: '🧊 Dondurma oyunu',
    body: `<div class="row"><div class="col"><p class="f">Müzik çalarken herkes <b>dans eder</b> 💃</p><p class="f">Kural: <b>Eğer</b> müzik durursa <b>donun!</b> 🧊</p><p class="f">Bu kural <b>sürekli</b> kontrol ediliyor:</p><div class="card f" style="font-size:34px;font-weight:800">🔁 sürekli tekrarla:<br>&nbsp;&nbsp;❓ eğer müzik durdu ise: don</div></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L3.s({ tag: 'İZLE 👀', title: 'Ay, kenar!', body: scratch(D.b19, 'Ay, kenar') }),
  L3.s({ tag: 'İZLE 👀', title: 'Elmayı ye 🍎', body: scratch(D.b19, 'Elmayı ye', { show: 'Elma' }), note: 'Kedinin ok tuşu kodu hazır (Kedi sekmesi). Elmanın kodu: sürekli kontrol eder, kedi dokunursa kaybolur. Ok düğmeleriyle kediyi elmaya götürün.' }),
  L3.hard({ title: 'Neden “sürekli”?', body: scratch(D.b19, 'Elmayı ye', { show: 'Elma', variants: [['🐞 Döngü yok', { Elma: [[['flag'], ['show'], ['if', { k: 'touch', o: 'Kedi' }, [['sound', 'pop'], ['hide']]]]] }], ['✅ Sürekli tekrarla', sol(D.b19, 'Elmayı ye')]] }),
    note: 'Döngü olmadan elma sadece <b>bir kez</b>, 🏁 anında bakar. O an kedi uzakta olduğu için hiçbir şey olmaz. Sürekli tekrarla ile her an kontrol eder.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: '“Karakter lava değerse oyun bitsin” istiyoruz. Hangisi doğru?', v: true, opts: ['🏁 → sürekli tekrarla [eğer lavaya dokunuyorsa durdur]', '🏁 → eğer lavaya dokunuyorsa durdur (döngü yok)', '🏁 → durdur'], a: 0, why: 'Koşulun <b>her an</b> kontrol edilmesi için sürekli tekrarla gerekir.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Labirent 🧀', body: scratch(D.b19, 'Labirent', { sm: true }), note: 'Fare duvara dokunursa başlangıca döner. Ok düğmeleriyle fareyi peynire götürmeyi deneyin.' }),
  L3.pc(['😵 Ay, kenar!', '🍎 Elmayı ye', '❓ Neden sürekli?', '🧀 Labirent', '⭐ Yıldız avcısı', '❓ Doğru koşul', '⭐ Tuşa basılı mı?']),

  /* ---------------- 20. BÖLÜM ---------------- */
  L4.cover('Robo ile kare çizmiştik, hatırlıyor musunuz? (4 kez: ileri, sağa dön) Bugün kalemle gerçekten çiziyoruz!'),
  L4.s({ tag: 'KALEM ✏️', title: 'Kuklam bir kalem!',
    body: `<div class="row"><div class="col"><p><b style="color:#0fbd8c">Yeşil Kalem</b> blokları:</p><p class="f">✏️ <b>kalemi bastır</b> → yürüdükçe çizer</p><p class="f">🖐️ <b>kalemi kaldır</b> → yürür ama çizmez</p><p class="f">🧽 <b>tümünü sil</b> → sahneyi temizler</p></div><div style="flex:0 0 420px">${blocks([[['clear']], [['down']], [['up']]])}</div></div>` }),
  L4.game({ title: '🐢 Kaplumbağa oyunu',
    body: `<div class="row"><div class="col"><p class="f">Bir öğrenci elinde tebeşirle <b>kalem</b> olur.</p><p class="f">Sınıf komut verir: “<b>3 adım ileri, sağa dön</b>”</p><p class="f">4 kez yapınca ne çizildi? <b>Kare!</b> ⬜</p><p class="f">Üçgen için ne kadar dönmeli? 🤔</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L4.s({ tag: 'İZLE 👀', title: 'Yarım kare: L', body: scratch(D.b20, 'Yarım kare') }),
  L4.s({ tag: 'İZLE 👀', title: 'Kare ⬜', body: scratch(D.b20, 'Kare'), note: '4 kez: 100 adım git, 90 derece dön. 90 derece = köşe kadar (dik açı).' }),
  L4.hard({ title: 'Tam tur = 360 derece',
    body: `<div class="row"><div class="col"><p>Kalem bir şekli çizip başa dönünce <b>tam bir tur</b> döner: <b>360</b>.</p><p class="f">⬜ Kare: 4 köşe → 90 + 90 + 90 + 90 = <b>360</b></p><p class="f">🔺 Üçgen: 3 köşe → ? + ? + ? = 360</p><p class="f">💡 Hangisini <b>3 kez</b> toplarsan 360 olur?</p></div><div style="flex:0 0 360px;font-size:150px;text-align:center">🔄</div></div>`,
    note: 'Bölme bilmeleri gerekmez: 60+60+60, 90+90+90, 120+120+120 seçeneklerini tahtada toplayın. Cevap bir sonraki soruda.' }),
  L4.s({ tag: 'SORU 🤔', body: quiz({ q: 'Üçgenin her köşesinde kaç derece dönmeli?', opts: ['60', '90', '120'], a: 2, why: '120 + 120 + 120 = <b>360</b>: tam tur!' }) }),
  L4.s({ tag: 'İZLE 👀', title: 'Üçgen 🔺', body: scratch(D.b20, 'Üçgen') }),
  L4.s({ tag: 'İZLE 👀', title: '⭐ Döngüyle çiçek 🌸', body: scratch(D.b20, '⭐ Bonus: Döngüyle çiçek', { sm: true }),
    note: 'İç içe döngü: büyük döngü kareyi 12 kez çevirir, küçük döngü bir kare çizer. Robo\'daki yıldız tarlası gibi!' }),
  L4.pc(['📏 İlk çizgi', '📐 Yarım kare', '⬜ Kare', '❓ Üçgenin açısı', '🔺 Üçgen', '⭐ Sanat galerisi', '⭐ Renkli yıldız', '⭐ Döngüyle çiçek']),

  weekEnd({ week: W, color: '#ffab19', next: 'Değişkenler, rastgelelik ve hikâye 🗃️🎲',
    items: ['<b>Sürekli tekrarla</b> ⏹ basılana kadar durmadan tekrar eder.', 'Bir kuklanın <b>aynı anda</b> çalışan birden fazla betiği olabilir.', 'Nota bloğu bir notayı belli bir <b>vuruş</b> çalar; şarkı da bir algoritmadır.', 'Algılama blokları <b>evet/hayır</b> sorusu sorar: dokunuyor mu?', 'Koşulun her an kontrol edilmesi için <b>eğer</b>, sürekli tekrarla içine konur.', '<b>Kalemi bastır</b>: kukla yürüdükçe çizer. Tam tur = 360 derece.'] }),
];

export default { title: 'Döngü, Ses, Algılama ve Kalem', slides };
