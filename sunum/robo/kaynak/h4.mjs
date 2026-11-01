// 4. hafta: Scratch'e merhaba (13–16. bölümler)
import { lesson, weekCover, weekEnd, quiz, botsay, robo, ders, scratch, blocks, costumes } from './yardim.mjs';

const D = await ders(4);
const W = 4;
const L1 = lesson({ week: W, idx: 1, no: 13, color: '#4c97ff', icon: '🐱', title: 'Scratch Dünyasına Merhaba', desc: 'Sahne, kukla ve renkli bloklar! İlk Scratch programını yaz, kediyi yürüt ve konuştur.' });
const L2 = lesson({ week: W, idx: 2, no: 14, color: '#2f6fd6', icon: '🧭', title: 'Hareket ve Koordinatlar', desc: 'Sahne bir harita: x sağ-sol, y yukarı-aşağı. Kuklaları istediğin yere gönder.' });
const L3 = lesson({ week: W, idx: 3, no: 15, color: '#e0a100', icon: '⚡', title: 'Olaylar: Ne Zaman?', desc: 'Tuşa basınca, kuklaya tıklayınca… Program ne zaman başlar?' });
const L4 = lesson({ week: W, idx: 4, no: 16, color: '#9966ff', icon: '🎭', title: 'Görünüm: Kostüm ve Animasyon', desc: 'Kostüm değiştir, büyü-küçül, renk değiştir, kaybol! Kuklalarına can ver.' });
const sp = (name, costume, x = 0, y = 0, o = {}) => ({ name, costume, x, y, ...o });
const RUN = 'Önce kodu sesli okutun (“bayrağa basılınca… 250 adım git”), sonra <b>🏁</b> ile çalıştırın. Çalışan blok sarı parlar.';

const slides = [
  weekCover({ week: W, title: 'Scratch\'e Merhaba', color: '#4c97ff', lessons: [['🐱', 'Sahne ve kukla'], ['🧭', 'Koordinatlar'], ['⚡', 'Olaylar'], ['🎭', 'Animasyon']],
    note: 'Bu haftadan itibaren Scratch\'e benzeyen bloklarla çalışıyoruz. Sahnelerde <b>🏁</b> çalıştırır, <b>⏹</b> durdurur, <b>↺</b> başa alır. Tuşlu görevlerde ekrandaki ok düğmelerini basılı tutun.' }),

  /* ---------------- 13. BÖLÜM ---------------- */
  L1.cover('Robo\'yu oklarla yönettik. Şimdi kendi oyunlarımızı, animasyonlarımızı yapacağız!'),
  L1.s({ tag: 'YENİ DÜNYA 🐱', title: 'Scratch dünyasına hoş geldin!',
    body: botsay('<p>Şimdiye kadar beni oklarla yönettin. Şimdi <b>Scratch</b> gibi çalışan bir dünyaya geçiyoruz.</p><p>Kendi <b>oyunlarını</b>, <b>animasyonlarını</b> ve <b>hikâyelerini</b> yapabileceksin! 🎮</p>', 'dance'),
    note: 'Scratch dünyada milyonlarca çocuğun kullandığı bir programlama dili. Okulda ya da evde scratch.mit.edu adresinden de denenebilir.' }),
  L1.s({ tag: 'YENİ KELİMELER', title: 'Sahne, kukla, dekor',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><p class="f">🐱 <b>Kukla:</b> sahnede hareket eden karakter.</p><p class="f">🌄 <b>Dekor:</b> arkadaki resim.</p><p class="f">🖼️ <b>Sahne:</b> hepsinin oynadığı yer.</p></div><div style="flex:0 0 600px">${scratch(D.b13, 'İlk kodun', { nocode: true })}</div></div>`,
    note: 'Sahneyi gösterin: kedi ve yıldız <b>kukla</b>, arkadaki çayır <b>dekor</b>. 🏁 ile kedi yürür.' }),
  L1.s({ tag: 'BLOKLAR 🧱', title: 'Bloklar renklerine göre ayrılır',
    body: `<div class="row" style="align-items:flex-start;gap:60px"><div class="col"><p class="f"><b style="color:#d49b00">Sarı: Olaylar</b> · program <b>ne zaman</b> başlar</p><p class="f"><b style="color:#4c97ff">Mavi: Hareket</b> · git, dön</p><p class="f"><b style="color:#9966ff">Mor: Görünüm</b> · konuş, kostüm</p><p class="f"><b style="color:#cf63cf">Pembe: Ses</b> · ses çal</p><p class="f"><b style="color:#e08a00">Turuncu: Kontrol</b> · bekle, tekrarla</p></div>
<div class="col">${blocks([[['flag']], [['move', 10]], [['sayFor', 'Merhaba!', 2]], [['sound', 'miyav']], [['wait', 1]]])}</div></div>`,
    note: 'Renkleri ezberletmeye gerek yok; “Hareket mavi” gibi birkaçını sorun. Bilgisayarda bloklar soldaki renkli düğmelerin altında.' }),
  L1.game({ title: '🧍 İnsan Scratch',
    body: `<div class="row"><div class="col"><ol><li class="f">Tahtaya büyük bir 🏁 çizin.</li><li class="f">Bir öğrenci <b>kukla</b> olur.</li><li class="f">Diğerleri kâğıtlara blok yazar: “10 adım git”, “Merhaba de”.</li><li class="f">Kâğıtları sıraya dizin, <b>bayrağa dokunun</b>!</li><li class="f">Kukla blokları <b>yukarıdan aşağıya</b> sırayla yapar.</li></ol></div><div style="flex:0 0 260px">${robo('dance', 240)}</div></div>` }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Scratch\'te sahnede hareket eden karakterlere ne denir?', opts: ['🐱 Kukla', '🌄 Dekor', '🧱 Blok'], a: 0, why: 'Hareket eden karakterlere <b>kukla</b> denir.' }) }),
  L1.s({ tag: 'İZLE 👀', title: 'İlk kod: kedi yıldıza koşsun!', body: scratch(D.b13, 'İlk kodun'),
    note: RUN + ' “10 adım” çok az; 250 adımda kedi yıldıza ulaşır. Bilgisayarda çocuklar sayıyı kendileri bulacak.' }),
  L1.hard({ title: 'Her program sarı bir olay bloğuyla başlar!',
    body: scratch(D.b13, 'İlk kodun', { variants: [['🐞 Olay bloğu yok', { Kedi: [[['move', 250]]] }], ['✅ Olay bloğu var', { Kedi: [[['flag'], ['move', 250]]] }]] }),
    note: 'İlk sekmede 🏁\'a basın: hiçbir şey olmaz! Çünkü kedi <b>ne zaman</b> başlayacağını bilmiyor. Bu, çocukların en sık yaptığı hata.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Konuşan kedi', body: scratch(D.b13, 'Konuşan kedi'), note: 'Bloklar yukarıdan aşağıya sırayla çalışır: önce konuşur, sonra yürür, sonra yine konuşur.' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir betikteki bloklar hangi sırayla çalışır?', v: true, opts: ['⬆ Aşağıdan yukarıya', '🎲 Hepsi rastgele', '⬇ Yukarıdan aşağıya, sırayla'], a: 2, why: 'Tıpkı Robo\'da olduğu gibi: <b>yukarıdan aşağıya</b>.' }) }),
  L1.s({ tag: 'İZLE 👀', title: 'Dik açı turu: 4 × 90', body: scratch(D.b13, 'Dik açı turu'),
    note: '90 derece = bir köşe kadar dönmek. 4 kez 90 = tam tur. Derece kelimesini “köşe kadar dönmek” diye anlatın.' }),
  L1.pc(['🐱 İlk kodun', '💬 Konuşan kedi', '❓ Bloklar hangi sırayla?', '💃 Dans eden kedi', '🔄 Dik açı turu', '⭐ Daha ince tur', '⭐ Kendi gösterin']),

  /* ---------------- 14. BÖLÜM ---------------- */
  L2.cover('Sorun: “Bir arkadaşınıza sınıfta bir yeri nasıl tarif edersiniz?” (3. sıra, pencere tarafı…)'),
  L2.s({ tag: 'HARİTA 🗺️', title: 'Sahne bir harita gibidir',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><p>Her noktanın iki sayısı var:</p><p class="f">↔️ <b>x</b> = sağa-sola</p><p class="f">↕️ <b>y</b> = yukarı-aşağı</p><p class="f">🎯 Tam ortası: <b>x: 0, y: 0</b></p><p class="f">Sağa ve yukarı gidince sayı <b>büyür</b>.</p></div><div style="flex:0 0 600px">${scratch(D.b14, 'Yıldıza ışınlan', { nocode: true, setup: { backdrop: 'koordinat', sprites: [sp('Kedi', 'kedi', 0, 0)] }, progs: {} })}</div></div>`,
    note: 'Sahnenin altındaki x, y yazısı kedinin yerini gösterir. Kedi tam ortada: x: 0, y: 0.' }),
  L2.hard({ title: 'Eksi (−) sayılar: asansör gibi!',
    body: `<div class="row"><div class="col"><p>Asansörde: <b>zemin kat 0</b>, yukarısı 1, 2, 3…</p><p class="f">Aşağısı <b>bodrum</b>: <b>−1</b>, <b>−2</b> 🛗</p><p class="f">Sahnede de öyle: sayının önünde <b>−</b> varsa <b>ters yöne</b> gider.</p><p class="f">x\'te <b>−</b> → sola ⬅️ &nbsp; y\'de <b>−</b> → aşağı ⬇️</p></div>
<div style="flex:0 0 300px;font-size:44px;font-weight:900;text-align:center" class="card"><div>3 🔼</div><div>2</div><div>1</div><div style="background:#ffe066;border-radius:12px">0 🏠</div><div style="color:var(--no)">−1</div><div style="color:var(--no)">−2 🔽</div></div></div>`,
    note: '3–4. sınıf negatif sayıyı okulda henüz görmedi. “Eksi” demek yerine “bodrum katı” gibi düşünsünler: ortanın solu ve altı.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: '<b>x: 0, y: 0</b> sahnenin neresidir?', opts: ['↖ Sol üst köşe', '🎯 Tam ortası', '↘ Sağ alt köşe'], a: 1, why: '0, 0 sahnenin <b>tam ortasıdır</b>.' }) }),
  L2.game({ title: '📍 Koordinat oyunu',
    body: `<div class="row"><div class="col"><ol><li class="f">Yere bantla iki çizgi yapıştırın: <b>x</b> (sağ-sol) ve <b>y</b> (ileri-geri).</li><li class="f">Kesiştikleri yer <b>0, 0</b>.</li><li class="f">Öğretmen söyler: “<b>x: 2, y: 1</b>”</li><li class="f">Bir öğrenci o noktaya gider!</li></ol></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>`,
    note: 'Satranç tahtasındaki “e4” gibi adlandırmalarla bağ kurabilirsiniz. Önce yalnız artı sayılar kullanın.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Yıldıza ışınlan', body: scratch(D.b14, 'Yıldıza ışınlan'),
    note: '“konumuna git” kuklayı bir anda o noktaya ışınlar. Yıldızın yeri x: 150, y: 100.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Arı iki çiçeğe uğrasın', body: scratch(D.b14, 'Arı iki çiçeğe'),
    note: '“süzül” bloğu yavaşça kaydırır. Sol çiçeğin x sayısının önünde − var: sola gider.' }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: '<b>x\'i 10 değiştir</b> bloğu kuklayı nasıl hareket ettirir?', pic: blocks([[['chx', 10]]]), v: true, opts: ['10 adım yukarı kaydırır', '10 adım sağa kaydırır', '10 derece döndürür'], a: 1, why: 'x sağ-sol demek: kukla <b>sağa</b> gider.' }) }),
  L2.s({ tag: 'YÖN 🧭', title: 'Kuklanın yönü',
    body: `<div class="row"><div class="col"><p class="f">⬆️ <b>0</b> = yukarı</p><p class="f">➡️ <b>90</b> = sağa</p><p class="f">⬇️ <b>180</b> = aşağı</p><p class="f">⬅️ <b>−90</b> = sola</p></div><div style="flex:0 0 420px">${blocks([[['point', 90]], [['point', 0]]])}</div></div>`,
    note: 'Yön sayısı tıpkı ok tuşu gibi: hangi yöne bakacağını söyler. “90 = sağ” en çok kullanılanı.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Roketin yönü', body: scratch(D.b14, 'Roketin yönü'), note: 'Roket önce yukarı (0), sonra sağa (90) döner ve uçar.' }),
  L2.pc(['❓ Orta nokta', '❓ Köşeyi bul', '⭐ Yıldıza ışınlan', '🐝 Arı iki çiçeğe', '❓ x değişirse', '🚀 Roket sağa uçsun', '🚀 Roketin yönü', '⭐ Dört köşe', '⭐ Bayrağa tırman', '⭐ Bal toplayan arı']),

  /* ---------------- 15. BÖLÜM ---------------- */
  L3.cover('Sorun: “Kapı zili çalınca ne yaparsınız?” Bugün programın NE ZAMAN başlayacağını öğreniyoruz.'),
  L3.s({ tag: 'OLAYLAR ⚡', title: 'Program ne zaman başlar?',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><p>Olay blokları <b>kapı zili</b> gibidir 🔔</p><p class="f">Zil çalınca kapıya gidersin.</p><p class="f">Tuşa basılınca kukla hareket eder!</p><p class="f">Olay blokları <b style="color:#d49b00">sarıdır</b> ve betiğin <b>en üstünde</b> durur.</p></div><div class="col">${blocks([[['flag']], [['key', 'right']], [['click']]])}</div></div>` }),
  L3.game({ title: '👏 Olay–tepki oyunu',
    body: `<div class="row"><div class="col"><p class="f">👏 Ben <b>alkışlayınca</b> → ayağa kalkın.</p><p class="f">🎵 <b>Islık</b> çalınca → oturun.</p><p class="f">📛 <b>Adınızı</b> söyleyince → el sallayın.</p><p class="f">Herkes aynı anda <b>birçok olayı</b> dinliyor!</p></div><div style="flex:0 0 260px">${robo('wave', 240)}</div></div>` }),
  L3.s({ tag: 'İZLE 👀', title: 'Klavye ile yürüt', body: scratch(D.b15, 'Klavye ile yürüt'),
    note: 'İki ayrı betik var: biri sağ ok, biri sol ok için. Sahnenin altındaki ← → düğmelerini <b>basılı tutun</b>. (Bu slaytta klavyenin ok tuşları sahneye gider; slayt değiştirmek için › düğmesini kullanın.)' }),
  L3.s({ tag: 'İZLE 👀', title: 'Peynir avı: dört yön', body: scratch(D.b15, 'Peynir avı', { sm: true }),
    note: 'Sağ/sol için x, yukarı/aşağı için y değişir. Aşağı ve sol için sayının önünde − var.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir kuklanın <b>birden fazla betiği</b> olabilir mi?', v: true, opts: ['Evet, her biri kendi olay bloğuyla başlar', 'Hayır, sadece bir tane', 'Sadece iki tane olabilir'], a: 0, why: 'Her betik kendi <b>olay bloğuyla</b> başlar. İstediğin kadar olabilir.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Bana tıkla!', body: scratch(D.b15, 'Bana tıkla'), note: 'Sahnedeki kediye fareyle (ya da parmakla) tıklayın. Hoparlör yoksa ses 🔊 yazısıyla görünür.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Hayvan orkestrası 🎶', body: scratch(D.b15, 'Hayvan orkestrası', { sm: true }), note: 'Üç kukla, her birinin kendi betiği var. Üstteki sekmelerle kuklalar arasında geçin. Sahnede her birine tıklayın.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Zıplayan Robo', body: scratch(D.b15, 'Zıplayan Robo'), note: 'İki betik birden: 🏁 ile başlar, <b>boşluk</b> düğmesiyle zıplar.' }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir oyunda karakteri <b>klavyeyle</b> yönetmek için hangi olay bloğu uygundur?', v: true, opts: ['🏁 tıklandığında', 'bu kukla tıklanınca', '… tuşuna basılınca'], a: 2, why: 'Klavye için <b>tuşuna basılınca</b> bloğu.' }) }),
  L3.pc(['➡ Klavye ile yürüt', '🧀 Peynire doğru', '🧀 Peynir avı', '❓ Kaç betik?', '👆 Bana tıkla!', '🎶 Hayvan orkestrası', '🤖 Zıplayan Robo', '❓ Oyun karakteri', '⭐ Uğur böceği']),

  /* ---------------- 16. BÖLÜM ---------------- */
  L4.cover('Sorun: “Çizgi filmler nasıl hareket ediyor?” Bugün öğreneceğiz!'),
  L4.s({ tag: 'KOSTÜM 👕', title: 'Kuklaların kıyafet dolabı',
    body: `<div class="row"><div class="col"><p>Kedinin <b>iki kostümü</b> var: bacakları farklı yerde.</p>${costumes('kedi')}</div><div style="flex:0 0 auto;text-align:center"><div class="flipper f" data-c="kedi" data-ms="250"></div><p class="f" style="margin-top:14px">Hızlıca değiştirince… <b>yürüyor!</b> 🎬</p></div></div>`,
    note: 'Kostümleri hızlıca değiştirmeye <b>animasyon</b> denir. Çizgi filmler de böyle yapılır: saniyede çok sayıda resim.' }),
  L4.game({ title: '📒 Kâğıt animasyon',
    body: `<div class="row"><div class="col"><ol><li class="f">Not kâğıtlarının köşesine bir <b>çöp adam</b> çiz.</li><li class="f">Her sayfada onu <b>biraz farklı</b> çiz (kolu biraz yukarıda).</li><li class="f">Sayfaları <b>hızlıca</b> çevir!</li></ol><p class="f">Scratch\'te: <b>sonraki kostüm + bekle</b> = hareket</p></div><div style="flex:0 0 400px">${blocks([[['repeat', 10, [['next'], ['wait', 0.1]]]]])}</div></div>` }),
  L4.s({ tag: 'İZLE 👀', title: 'Yürüyen kedi', body: scratch(D.b16, 'Yürüyen kedi'), note: 'Tekrarla içinde: biraz ilerle, kostüm değiştir, biraz bekle.' }),
  L4.hard({ title: 'Bekle bloğunu unutma!',
    body: scratch(D.b16, 'Yürüyen kedi', { variants: [['🐞 Bekle yok', { Kedi: [[['flag'], ['repeat', 12, [['move', 10], ['next']]]]] }], ['✅ Bekle var', D.b16.steps.find((s) => s.title.startsWith('Yürüyen kedi')).sol]] }),
    note: 'Bekle olmadan kedi göz açıp kapayıncaya kadar gider; kostüm değişimini göremeyiz. Bekleme süresini kısaltınca animasyon hızlanır.' }),
  L4.s({ tag: 'İZLE 👀', title: 'Büyü, küçül', body: scratch(D.b16, 'Büyü, küçül') }),
  L4.s({ tag: 'İZLE 👀', title: 'Renk değiştiren balık', body: scratch(D.b16, 'Renk değiştiren balık') }),
  L4.s({ tag: 'İZLE 👀', title: 'Sihirbaz hayalet 👻', body: scratch(D.b16, 'Sihirbaz hayalet'), note: 'gizle → kaybolur, göster → yeniden belirir. Arada rastgele bir yere gider.' }),
  L4.s({ tag: 'SORU 🤔', body: quiz({ q: 'Bir kuklayı <b>yürüyormuş gibi</b> göstermek için ne yaparız?', v: true, opts: ['Kuklayı büyütürüz', 'Kostümlerini hızlıca sırayla değiştiririz', 'Dekoru değiştiririz'], a: 1, why: 'Animasyonun sırrı: kostümleri <b>hızlıca</b> değiştirmek.' }) }),
  L4.s({ tag: 'İZLE 👀', title: 'Gece oldu 🌙', body: scratch(D.b16, 'Gece oldu'), note: 'Dekor da değişebilir! Kedi önce konuşur, sonra dekor gece olur, kedi düşünür.' }),
  L4.pc(['🐱 Yürüyen kedi', '⭐ Büyü, küçül', '🐟 Renk değiştiren balık', '👻 Sihirbaz hayalet', '❓ Animasyonun sırrı', '🌙 Gece oldu', '⭐ Kendi animasyonun', '⭐ Sohbet']),

  weekEnd({ week: W, color: '#4c97ff', next: 'Döngü, ses, algılama ve kalem 🔁🎵',
    items: ['Karakterlere <b>kukla</b>, arkadaki resme <b>dekor</b>, hepsinin oynadığı yere <b>sahne</b> denir.', 'Bloklar renklerine göre ayrılır: <b>mavi hareket</b>, <b>mor görünüm</b>, <b>sarı olaylar</b>.', 'Her betik sarı bir <b>olay bloğuyla</b> başlar; bloklar yukarıdan aşağıya çalışır.', 'Sahne bir harita: <b>x</b> sağ-sol, <b>y</b> yukarı-aşağı, ortası <b>0, 0</b>.', 'Bir kuklanın <b>birden fazla betiği</b> olabilir.', '<b>Animasyon</b>: kostümleri hızlıca değiştirmek.'] }),
];

export default { title: 'Scratch\'e Merhaba', slides };
