// 3. hafta: Fonksiyonlar ve koşullar (9–12. bölümler)
import { lesson, weekCover, weekEnd, player, quiz, botsay, grid, code, chips, chip, robo } from './yardim.mjs';

const W = 3;
const L1 = lesson({ week: W, idx: 1, no: 9, color: '#ff6680', icon: '🧩', title: 'Kendi Bloğunu Yap', desc: 'Sık yaptığın hareketlere bir ad ver ve tek blokla çağır: fonksiyon!' });
const L2 = lesson({ week: W, idx: 2, no: 10, color: '#f08c00', icon: '❓', title: 'Eğer… ise', desc: 'Robo artık etrafını görebiliyor! “Eğer” bloğu ile duruma göre karar ver.' });
const L3 = lesson({ week: W, idx: 3, no: 11, color: '#ea580c', icon: '🔀', title: 'Eğer… Değilse', desc: 'Koşul doğruysa bir şey, yanlışsa başka bir şey yap. Yol ayrımlarında karar ver!' });
const L4 = lesson({ week: W, idx: 4, no: 12, color: '#c2410c', icon: '♾️', title: '…Olana Kadar Tekrarla', desc: 'Kaç kez tekrar edeceğini bilmiyorsan, bir şey olana kadar tekrarla!' });
const cond = (t) => `<span class="cond" style="font-size:.85em">${t}</span>`;

const slides = [
  weekCover({ week: W, title: 'Fonksiyonlar ve Koşullar', color: '#ff6680', lessons: [['🧩', 'Fonksiyon'], ['❓', 'Eğer'], ['🔀', 'Eğer-değilse'], ['♾️', 'Olana kadar']],
    note: 'Robo\'nun son haftası. Koşul bloklarında oynatırken Robo\'nun sorduğu soru balonla görünür: <b>“Önüm açık mı? EVET ✔ / HAYIR ✘”</b>. Harita sekmeleri aynı programın farklı haritalarda çalıştığını gösterir.' }),

  /* ---------------- 9. BÖLÜM: FONKSİYON ---------------- */
  L1.cover('Hatırlatma: “Döngü neydi?” Bugün programları kısaltmanın başka bir yolunu öğreniyoruz.'),
  L1.s({ tag: 'DÜŞÜN 🤔', title: 'Hep aynı hareketler…',
    body: botsay(`<p>Merdiven çıkarken hep aynı şeyi yapıyorum:</p><p>${chips('FLFR')} <span class="soft">ileri, sola dön, ileri, sağa dön</span></p><p class="f">Bunu her seferinde yazmak zorunda mıyız? <b>Hayır!</b></p><p class="f">Bu dört komuta bir ad verelim: <b style="color:var(--fn)">🧩 Basamak</b>. Buna <b style="color:var(--fn)">FONKSİYON</b> denir.</p>`, 'think'),
    note: 'Fonksiyon = bir grup komuta verdiğimiz ad. Scratch\'te pembe “Blok Tanımla” blokları.' }),
  L1.game({ title: '👋 Komut sözlüğü',
    body: `<div class="row"><div class="col"><p>Sınıfça yeni bir hareket uyduralım: <b>“selam”</b></p><div class="card" style="border:5px dashed var(--fn)"><p><b style="color:var(--fn)">🧩 selam</b> =</p><p>&nbsp;&nbsp;👋 el salla</p><p>&nbsp;&nbsp;🙇 eğil</p><p>&nbsp;&nbsp;⬆ zıpla</p></div><p class="f" style="margin-top:18px">Öğretmen <b>“selam!”</b> deyince herkes üçünü birden yapar.</p><p class="f">Peki <b>“3 kez selam!”</b>?</p></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>`,
    note: 'Bir ad = birçok hareket. Sonra “3 kez selam” ile döngü + fonksiyon birlikte.' }),
  L1.s({ tag: 'FONKSİYON', title: 'Fonksiyon nasıl yazılır?',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><p class="f">1️⃣ <b style="color:var(--fn)">Pembe kutuya</b> komutları yaz.</p><p class="f">2️⃣ <b>Programım</b> kutusuna 🧩 bloğunu koy.</p><p class="f">3️⃣ Robo 🧩\'a gelince pembe kutudakileri yapar.</p></div>
<div style="flex:0 0 480px" class="codewrap f"><div class="codettl fn">🧩 Basamak fonksiyonu</div>${code('FLFR', { fnbody: true, fname: 'Basamak' })}<div class="codettl">📜 Programım</div>${code('fff', { fname: 'Basamak' })}</div></div>`,
    note: 'İki kutu var: pembe kutu “tarif”, program kutusu “ne zaman yapılacağı”. 3 kez Basamak = 12 komut!' }),
  L1.s({ tag: 'İZLE 👀', title: 'Basamak fonksiyonu',
    body: player({ map: ['###G', '##.*', '#.*#', 'S.##'], fn: 'FLFR', fname: 'Basamak', prog: 'fff', lr: true }),
    note: 'Oynatırken önce programdaki 🧩 yanar, sonra pembe kutudaki komutlar tek tek yanar. “Robo pembe kutuya gidip geri geliyor.”' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo bu programda toplam <b>kaç kez sağa döner</b>?', pic: `<div class="codewrap" style="width:400px"><div class="codettl fn">🧩 Basamak</div>${code('FLFR', { fnbody: true, sm: true })}<div class="codettl">📜 Programım</div>${code('fff', { fname: 'Basamak', sm: true })}</div>`,
    opts: ['1', '2', '3'], a: 2, why: 'Fonksiyonda 1 sağa dön var, fonksiyon 3 kez çağrılıyor: <b>3</b>.' }) }),
  L1.hard({ title: 'Bozuk fonksiyon 🐞',
    body: player({ map: ['###G', '##.*', '#.*#', 'S.##'], fname: 'Basamak', progs: [['🐞 Hatalı', 'fff', 'FRFL'], ['✅ Düzeltilmiş', 'fff', 'FLFR']], lr: true, sm: true }),
    note: '<b>Bir yerde düzelt, her yer düzelsin!</b> Program aynı, sadece fonksiyondaki dönüşler ters. Fonksiyonu bir kez düzeltince <b>bütün basamaklar</b> birden düzelir.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Hazır fonksiyon: Kenar',
    body: player({ map: ['S.*', 'G#.', '*.*'], fn: 'FFR', fname: 'Kenar', prog: 'fffF', lr: true }) }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Fonksiyon kullanmanın en büyük faydası nedir?', v: true,
    opts: ['Robo daha hızlı koşar', 'Bir kez yazarız, çok kez kullanırız', 'Pil daha çok dolar'], a: 1, why: '<b>Bir kez yaz, istediğin kadar çağır!</b> Hatayı da tek yerde düzeltirsin.' }) }),
  L1.pc(['🧩 Basamak fonksiyonu', '🧩 Hazır fonksiyon', '❓ Kaç kez döner?', '🐞 Bozuk fonksiyon', '✋ Topla fonksiyonu', '❓ Neden fonksiyon?', '⭐ Fonksiyon + döngü', '⭐ Dev merdiven']),

  /* ---------------- 10. BÖLÜM: EĞER ---------------- */
  L2.cover('Sorun: “Bugün okula gelirken hangi kararları verdiniz?” (Yağmur var mı, mont giyeyim mi…)'),
  L2.s({ tag: 'YENİ', title: 'Robo\'nun gözleri var! 👀',
    body: botsay('<p>Artık <b>sensörlerim</b> var. Görebiliyorum:</p><p>⭐ Yıldızın üstünde miyim? · 🌳 Önümde engel var mı? · 🔋 Pile ulaştım mı?</p><p class="f">Sen de her gün karar verirsin: <b>Eğer</b> yağmur yağıyorsa şemsiye alırsın ☔. Yağmıyorsa almazsın.</p>', 'think') }),
  L2.game({ title: '❓ Eğer oyunu',
    body: `<div class="row"><div class="col"><p>Sadece <b>sana uyuyorsa</b> yap!</p><p class="f">👓 <b>Eğer</b> gözlüğün varsa <b>ayağa kalk</b>.</p><p class="f">🅰️ <b>Eğer</b> adında A harfi varsa <b>el çırp</b>.</p><p class="f">👟 <b>Eğer</b> beyaz ayakkabın varsa <b>zıpla</b>.</p><p class="f">Şimdi sen bir “eğer” cümlesi kur!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Koşul = cevabı “evet” ya da “hayır” olan soru. Koşul doğru değilse hiçbir şey yapılmaz.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: '🚦 <b>Eğer</b> trafik ışığı kırmızıysa ne yaparız?', opts: ['🏃 Koşarak geçeriz', '🦘 Zıplarız', '✋ Dururuz'], a: 2, why: 'Koşul doğru (ışık kırmızı) → <b>dururuz</b>.' }) }),
  L2.s({ tag: 'YENİ BLOK', title: '❓ Eğer … ise',
    body: `<div class="row"><div class="col"><p><b>Koşul</b>: cevabı <b>evet</b> ya da <b>hayır</b> olan soru.</p><p class="f">✔ Evet ise: içindeki bloklar <b>çalışır</b>.</p><p class="f">✘ Hayır ise: içindekiler <b>atlanır</b>.</p></div><div style="flex:0 0 560px" class="f">${code('i{star}(P)')}</div></div>`,
    note: 'Bloğu sesli okutun: “Eğer yıldızın üstündeysem, yıldızı al.”' }),
  L2.s({ tag: 'İZLE 👀', title: 'Yıldız varsa al: 3 harita, tek program!',
    body: player({ maps: [['S*...*G'], ['S.*.*.G'], ['S..**.G']], prog: '6(Fi{star}(P))', stack: true }),
    note: 'Bir haritayı oynatın, sonra sekmeyle diğerine geçin. Robo her karede sorar: “Yıldızın üstünde miyim?” Balondaki EVET/HAYIR\'a dikkat çekin.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo bu programla <b>kaç yıldız</b> alır?', pic: `<div style="display:flex;flex-direction:column;gap:20px">${grid(['S.*.*'], { size: 100 })}${code('4(Fi{star}(P))', { w: 500, sm: true })}</div>`,
    opts: ['1', '2', '3'], a: 1, why: 'Robo her karede bakar; yıldızlı <b>2</b> kare var.' }) }),
  L2.s({ tag: 'İZLE 👀', title: 'Engel varsa dön',
    body: player({ maps: [['S..#', '##.#', '##.#', '##G#'], ['S...#', '###.#', '###G#'], ['S.#', '#.#', '#.#', '#.#', '#G#']], prog: '5(i{blocked}(R)F)', lr: true }),
    note: 'Yol bir yerde sağa dönüyor ama nerede döndüğü haritadan haritaya değişiyor. Robo her adımdan önce sorar: “Önümde engel var mı?”' }),
  L2.pc(['❓ Günlük hayatta eğer', '⭐ Yıldız varsa al', '❓ Kaç yıldız alır?', '🌳 Engel varsa dön', '⭐ Halka bahçe', '⭐ Köşe nerede?']),

  /* ---------------- 11. BÖLÜM: EĞER DEĞİLSE ---------------- */
  L3.cover('Hatırlatma: “Eğer bloğunda koşul yanlışsa ne oluyordu?” (Hiçbir şey, atlanıyordu.) Bugün “değilse” geliyor.'),
  L3.s({ tag: 'İKİ YOL', title: 'Eğer … değilse …',
    body: `<div class="row"><div class="col"><p>☔ <b>Eğer</b> yağmur yağıyorsa şemsiye al,</p><p>😎 <b>değilse</b> güneş gözlüğü tak.</p><p class="f">Koşul doğruysa <b>üstteki</b>, yanlışsa <b>alttaki</b> bölüm çalışır.</p><p class="f">Her seferinde <b>sadece biri</b> çalışır. İkisi birden <b>asla</b>!</p></div><div style="flex:0 0 560px" class="f">${code('e{open}(F)(R)')}</div></div>` }),
  L3.game({ title: '🚪 Evet–hayır kapısı',
    body: `<div class="row"><div class="col"><p>Sınıfta iki hayali kapı var: <b>sağ</b> ve <b>sol</b>.</p><p class="f">“<b>Eğer</b> bugün spor ayakkabı giydiysen <b>sağ</b> kapıdan geç, <b>değilse</b> <b>sol</b> kapıdan geç.”</p><p class="f">Herkes bir kapıdan geçer. Kimse <b>iki kapıdan birden</b> geçemez!</p></div><div style="flex:0 0 260px">${robo('wave', 240)}</div></div>` }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo\'nun önünde ağaç var. Önü açık mı? <b>Hayır.</b> Robo ne yapar?', pic: `<div style="display:flex;flex-direction:column;gap:20px">${grid(['S#'], { size: 120 })}${code('e{open}(F)(R)', { w: 480, sm: true })}</div>`, v: true,
    opts: ['↱ Sağa döner', '⬆ İleri gider', 'Hem ileri gider hem sağa döner'], a: 0, why: 'Koşul yanlış → <b>değilse</b> bölümü çalışır: sağa döner.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Açıksa git, değilse dön',
    body: player({ maps: [['S..#', '##.#', '##.#', '##G#'], ['S...#', '###.#', '###G#'], ['S.#', '#.#', '#.#', '#G#']], prog: '6(e{open}(F)(R))', lr: true }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Al ya da ilerle',
    body: player({ maps: [['S.*..*G'], ['S*..*.G']], prog: '8(e{star}(P)(F))', stack: true }) }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Robo <b>6 adım</b> ilerledi ve <b>2 yıldız</b> aldı. Döngü kaç tur attı?', opts: ['6', '8', '2'], a: 1, why: 'Her turda <b>ya</b> ilerler <b>ya</b> yıldız alır: 6 + 2 = <b>8</b> tur.' }) }),
  L3.hard({ title: 'Robo\'nun solu nerede?',
    body: player({ maps: [['##G', 'S..', '###'], ['###', 'S..', '##G']], prog: '2(F)e{left}(L)(R)F', lr: true,
      under: '<p class="f" style="margin-top:10px">Kendini Robo\'nun yerine koy. Mavi <b>sol</b> etiketine bak: solun açık mı?</p>' }),
    note: 'Sol ve sağ sensörü Robo\'nun baktığı yöne göredir. Etiketler bunu gösteriyor. İki haritayı da oynatın.' }),
  L3.pc(['❓ Hangisi çalışır?', '🌳 Açıksa git, değilse dön', '⭐ Al ya da ilerle', '❓ Kaç tur?', '🧭 Kendi solunu bul', '🔀 Sağ mı, sol mu?', '⭐ Kıvrımlı yollar', '⭐ Yıldızlı çatal']),

  /* ---------------- 12. BÖLÜM: OLANA KADAR ---------------- */
  L4.cover('Robo\'nun son macerası! Bugünden sonra Scratch\'e geçiyoruz.'),
  L4.s({ tag: 'DÜŞÜN 🤔', title: 'Kaç kez bilmiyorsam?',
    body: botsay(`<p>Bardağa su koyarken “7 saniye dök” demezsin.</p><p><b>Bardak dolana kadar</b> dökersin. 🥛</p><p class="f">Robo için de öyle:</p><div class="f">${code('u{goal}(F)', { w: 560 })}</div><p class="f" style="margin-top:10px">Robo her turdan önce sorar: <b>“Pile ulaştım mı?”</b></p>`, 'think') }),
  L4.game({ title: '🥛 Bardak doldurma',
    body: `<div class="row"><div class="col"><p class="f">Bir öğrenci boş bardağa sürahiden su doldursun.</p><p class="f">“Kaç saniye dökeceksin?” Bilemez!</p><p class="f">Doğru algoritma: <b>“Bardak dolana kadar dök.”</b></p><p class="f">Peki bardak <b>hiç dolmazsa</b>? 😮</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Su yerine kâğıt parçası ya da boncukla da olur. Son soru sonsuz döngüye giriş.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Her boy koridor',
    body: player({ maps: [['S..G'], ['S.....G'], ['S.G']], prog: 'u{goal}(F)', stack: true, under: '<p class="f" style="margin-top:6px">Üç koridorun boyu farklı. <b>Tek program</b> hepsinde çalışıyor!</p>' }),
    note: '“10 kez tekrarla” olsaydı kısa koridorda Robo duvara çarpardı. Sekmelerle üçünü de gösterin.' }),
  L4.hard({ title: 'Sonsuz döngü! 🔄',
    body: player({ map: ['S..G'], prog: 'u{goal}(R)', stack: true, limit: 40, under: '<p class="f" style="margin-top:6px">Robo sadece dönüyor, hiç ilerlemiyor. Pile <b>hiç</b> ulaşamaz! Koşul hiç doğru olmazsa döngü <b>bitmez</b>.</p>' }),
    note: 'Bu programa <b>sonsuz döngü</b> denir. Oynatıcı bir süre sonra durdurur. Bilgisayarda sonsuz döngüde ⏹ Durdur\'a basılır.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Toplayarak git',
    body: player({ maps: [['S*.*G'], ['S..*.*.G']], prog: 'u{goal}(Fi{star}(P))', stack: true }) }),
  L4.s({ tag: 'İZLE 👀', title: 'Köşeli yollar ve sarmal',
    body: player({ maps: [['S..#', '##.#', '##.#', '##G#'], ['S....', '####.', '..G#.', '.###.', '.....']], prog: 'u{goal}(i{blocked}(R)F)', lr: true }),
    note: 'Aynı program sarmalda da çalışıyor! Engel varsa sağa dön, ileri git: ta ki pile ulaşana kadar.' }),
  L4.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir oyunda karakter <b>duvara değene kadar</b> yürüsün istiyoruz. Hangi blok uygun?', v: true,
    opts: ['🔁 duvara değene kadar tekrarla', '🔁 10 kez tekrarla', 'Döngüye gerek yok'], a: 0, why: 'Kaç adım olduğunu bilmiyoruz: <b>olana kadar tekrarla</b>.' }) }),
  L4.s({ tag: 'TEBRİKLER 🏆', title: 'Robo\'nun bütün sırlarını öğrendin!',
    body: botsay('<p>📋 Sıralama · 🔁 Döngü · 🧩 Fonksiyon · ❓ Koşul</p><p>Bunlar <b>gerçek programcıların</b> her gün kullandığı fikirler!</p><p class="f">Gelecek hafta <b>Scratch</b> dünyasına geçiyoruz: kuklalar, sesler, renkler ve kendi oyunların! 🐱🎮</p>', 'dance') }),
  L4.pc(['➡ Her boy koridor', '❓ Sonsuz döngü!', '⭐ Toplayarak git', '↱ Köşeli yollar', '🌀 Sarmal', '❓ Hangi döngü?', '⭐ Labirent ustası']),

  weekEnd({ week: W, color: '#ff6680', next: 'Scratch\'e merhaba 🐱',
    items: ['<b>Fonksiyon</b>, bir grup komuta verdiğimiz addır: bir kez yaz, çok kez çağır.', '<b>Koşul</b>, cevabı evet ya da hayır olan bir sorudur.', '<b>Eğer … ise</b>: koşul doğruysa içindekiler çalışır.', '<b>Eğer … değilse</b>: iki yoldan <b>sadece biri</b> çalışır.', '<b>Olana kadar tekrarla</b>: kaç tur gerektiğini bilmediğimizde kullanılır.', 'Koşul hiç doğru olmazsa döngü bitmez: <b>sonsuz döngü</b>.'] }),
];

export default { title: 'Fonksiyonlar ve Koşullar', slides };
