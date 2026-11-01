// 6. hafta: Değişkenler, rastgelelik ve hikâye (21–24. bölümler)
import { lesson, weekCover, weekEnd, quiz, botsay, robo, order, ders, scratch, blocks, step } from './yardim.mjs';

const D = await ders(6);
const W = 6;
const L1 = lesson({ week: W, idx: 1, no: 21, color: '#ff8c1a', icon: '🗃️', title: 'Değişkenler: Skor Tutma', desc: 'Skor, can, sayaç… Bir sayıyı akılda tutan kutular: değişkenler!' });
const L2 = lesson({ week: W, idx: 2, no: 22, color: '#59c059', icon: '🎲', title: 'Rastgele Sayılar', desc: 'Zar at, rastgele uçan böcekleri yakala! Her oyunu farklı yapan sihir.' });
const L3 = lesson({ week: W, idx: 3, no: 23, color: '#e6a100', icon: '📣', title: 'Haber Salma', desc: 'Kuklalar birbirine haber göndersin: sohbet, sahne değişimi, yarış!' });
const L4 = lesson({ week: W, idx: 4, no: 24, color: '#c2185b', icon: '📖', title: 'Proje: Animasyonlu Hikâye', desc: 'Kendi animasyonlu hikâyeni adım adım yap: sahne, karakterler, konuşmalar, müzik.' });
const sol = (L, t) => step(L, t).sol;
const box = (name, val, c = '#ff8c1a') => `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:8px"><div style="background:${c};color:#fff;font-size:30px;font-weight:900;padding:4px 22px;border-radius:12px 12px 0 0">${name}</div><div style="width:200px;height:150px;border:8px solid ${c};border-top:none;border-radius:0 0 24px 24px;background:#fff;display:grid;place-items:center;font-size:90px;font-weight:900;color:${c}">${val}</div></div>`;

const slides = [
  weekCover({ week: W, title: 'Değişkenler, Rastgelelik ve Hikâye', color: '#ff8c1a', lessons: [['🗃️', 'Değişken'], ['🎲', 'Rastgele'], ['📣', 'Haber salma'], ['📖', 'Hikâye projesi']],
    note: 'Değişkenlerin değeri sahnenin sol üstünde turuncu göstergede görünür. Tıklamalı örneklerde sahnedeki kuklaya tıklayın.' }),

  /* ---------------- 21. BÖLÜM ---------------- */
  L1.cover('Sorun: “Bir oyunda kaç puan topladığını oyun nasıl hatırlıyor?”'),
  L1.s({ tag: 'YENİ KELİME', title: 'Akılda tutan kutu 🗃️',
    body: `<div class="row"><div class="col"><p><b style="color:#ff8c1a">Değişken</b>: üzerinde <b>adı</b> yazan, içinde bir <b>sayı</b> saklayan kutu.</p><p class="f">Kutunun adı: <b>skor</b></p><p class="f">İçindeki sayı değişebilir: 0, 1, 2, 3… Bu yüzden adı <b>değişken</b>!</p></div><div style="flex:0 0 auto" class="f">${box('skor', '3')}</div></div>`,
    note: 'Değişkenin değeri oyun boyunca değişir: elma toplayınca artar, can kaybedince azalır.' }),
  L1.game({ title: '🔵 Skor kutusu',
    body: `<div class="row"><div class="col"><p class="f">Masaya üstünde <b>SKOR</b> yazan bir kutu koyun.</p><p class="f">Her doğru cevapta içine <b>bir fasulye ya da boncuk</b> atın → “skoru <b>1 değiştir</b>”</p><p class="f">Oyun başında kutuyu <b>boşaltın</b> → “skoru <b>0 yap</b>”</p><p class="f">Kutunun üstüne güncel sayıyı yazın: “Şu an kaç?”</p></div><div style="flex:0 0 auto">${box('SKOR', '🔵')}</div></div>` }),
  L1.hard({ title: '“yap” ile “değiştir” farklı!',
    body: `<div class="row" style="align-items:flex-start"><div class="col"><p>Kutuda <b>3</b> var.</p><div class="vs" style="margin-top:20px"><div class="f">${blocks([[['setv', 'skor', 1]]])}<p style="margin-top:14px">Kutuyu boşalt, içine 1 koy → <b>1</b></p></div><div class="f">${blocks([[['chv', 'skor', 1]]])}<p style="margin-top:14px">Üstüne 1 tane daha at → <b>4</b></p></div></div></div></div>`,
    note: '“yap” değeri belirler (başa alır), “değiştir” üstüne ekler. −1 değiştir kutudan bir tane almaktır. Çocuklar ikisini sık karıştırır.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Tıklama sayacı', body: scratch(D.b21, 'Tıklama sayacı'), note: 'Sahnedeki kediye 5 kez tıklayın, sol üstteki sayaca bakın.' }),
  L1.s({ tag: 'İZLE 👀', title: 'Elma topla 🍎', body: scratch(D.b21, 'Elma topla', { show: 'Elma' }), note: 'Kedi fareyi (imleci) takip ediyor. Fareyi sahnede gezdirip kediyi elmaya götürün. Skor sol üstte.' }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: 'Oyun her başladığında skor <b>0\'dan</b> başlasın. 🏁 altına hangi blok?', v: true, pic: '', opts: ['skor değişkenini 0 yap', 'skor değişkenini 1 değiştir', 'skor değişkenini -1 değiştir'], a: 0, why: '<b>0 yap</b>: kutuyu boşaltır. Oyun başında mutlaka!' }) }),
  L1.s({ tag: 'SORU 🤔', body: quiz({ q: '<b>Değişken</b> için hangisi doğru?', v: true, opts: ['Adı olan ve içinde bir değer saklayan kutu', 'Kuklanın kostümü', 'Bir ses türü'], a: 0, why: 'Değişken, adı olan bir <b>kutudur</b>.' }) }),
  L1.s({ tag: 'İZLE 👀', title: 'Kazandım! 🏆', body: scratch(D.b21, 'Kazandım', { show: 'Kedi', sm: true }), note: 'Kedinin ikinci betiği: “skor = 5 olana kadar bekle”, sonra “Kazandım!”. Değişken + koşul birlikte.' }),
  L1.pc(['👆 Tıklama sayacı', '🍎 Elma topla', '❓ Değişken nedir?', '🏆 Kazandım!', '⭐ Geri sayım', '⭐ Üç can', '⭐ Kendi puan oyunun']),

  /* ---------------- 22. BÖLÜM ---------------- */
  L2.cover('Sorun: “Zar atınca ne geleceğini biliyor musunuz?” Bilemeyiz: buna rastgele denir.'),
  L2.s({ tag: 'YENİ', title: 'Şans oyunu 🎲',
    body: `<div class="row"><div class="col"><p>Zar atınca ne çıkacağını bilemezsin. Buna <b style="color:#3f9a3f">rastgele</b> denir.</p><p class="f">Yeşil yuvarlak blok her seferinde <b>1 ile 6 arasından</b> bir sayı seçer.</p><p class="f">Sayı kutusunun yanındaki <b>▾</b> düğmesinden “rastgele” seçilir.</p></div><div style="flex:0 0 560px">${blocks([[['costumeN', { r: 'rand', a: 1, b: 6 }]], [['goto', { r: 'rand', a: -200, b: 200 }, 0]]])}</div></div>`,
    note: 'Yuvarlak bloklar (değer blokları) sayı yazılan beyaz kutuların içine konabilir.' }),
  L2.game({ title: '🎲 Zar istatistiği',
    body: `<div class="row"><div class="col"><p class="f">Herkes gerçek bir zarı <b>12 kez</b> atsın.</p><p class="f">Çıkan sayıları tabloya yazsın: 1 ✋ 2 ✋ 3 …</p><p class="f">Sınıfın sonuçlarını birleştirin: her sayı <b>yaklaşık eşit</b> mi?</p><p class="f">Sonra bilgisayardaki zarla karşılaştırın!</p></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L2.s({ tag: 'İZLE 👀', title: 'Zar at', body: scratch(D.b22, 'Zar at'), note: 'Zara birkaç kez tıklayın: her seferinde farklı bir yüz gelir.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Çılgın uğur böceği 🐞', body: scratch(D.b22, 'Çılgın uğur', { sm: true }) }),
  L2.s({ tag: 'SORU 🤔', body: quiz({ q: '“rastgele 1 ile 10 arası” her çalıştığında <b>aynı sayıyı</b> mı verir?', v: true, opts: ['Evet, hep 5 verir', 'Hayır, 1 ile 10 arasında herhangi biri olabilir', 'Hep 10 verir'], a: 1, why: 'Her seferinde <b>farklı</b> olabilir. Oyunları heyecanlı yapan bu!' }) }),
  L2.s({ tag: 'İZLE 👀', title: 'Rastgele sanat 🎨', body: scratch(D.b22, 'Rastgele sanat', { sm: true }), note: 'Her 🏁\'de farklı bir resim çıkar. Birkaç kez basın.' }),
  L2.s({ tag: 'İZLE 👀', title: 'Böcek avı', body: scratch(D.b22, 'Böcek avı', { sm: true }), note: 'Böcek her saniye başka yere gider. Bir öğrenci tahtada yakalamaya çalışsın: tıklayınca skor artar.' }),
  L2.pc(['🎲 Zar at', '🐞 Çılgın uğur böceği', '❓ Hep aynı mı?', '🎨 Rastgele sanat', '🐞 Böcek avı', '⭐ Yıldız yağmuru', '⭐ Şans makinesi']),

  /* ---------------- 23. BÖLÜM ---------------- */
  L3.cover('Sorun: “Okul zili çalınca kim ne yapar?” Herkes kendi işini bilir!'),
  L3.s({ tag: 'HABER 📣', title: 'Kuklalar arası mesaj',
    body: `<div class="row"><div class="col"><p>Okul zili gibi: <b>zil çalınca</b> herkes ne yapacağını bilir. 🔔</p><p class="f"><b>haber sal</b> → herkese duyurur</p><p class="f"><b>haberini aldığımda</b> → o haber gelince çalışır</p><p class="f">Böylece kuklalar <b>sırayla</b> ve <b>birlikte</b> çalışır.</p></div><div style="flex:0 0 520px">${blocks([[['bcast', 'sıra sende']], [['recv', 'sıra sende'], ['sayFor', 'Merhaba!', 1]]])}</div></div>` }),
  L3.game({ title: '🔔 Okul zili',
    body: `<div class="row"><div class="col"><p class="f">Bir haber seçin: 🔔</p><p class="f">Her gruba farklı görev: 1. grup <b>ayağa kalkar</b>, 2. grup <b>el çırpar</b>, 3. grup <b>“Günaydın!”</b> der.</p><p class="f">Zili çalan kişi kimin ne yapacağını <b>tek tek söylemez</b>!</p><p class="f">Herkes haberi duyunca <b>kendi işini</b> yapar.</p></div><div style="flex:0 0 260px">${robo('wave', 240)}</div></div>` }),
  L3.s({ tag: 'İZLE 👀', title: 'Sıra sende', body: scratch(D.b23, 'Sıra sende'), note: 'Kedi konuşup haber salar; köpek haberi alınca cevap verir. Sekmelerle iki kuklanın kodunu gösterin.' }),
  L3.hard({ title: 'Haberin adı aynı olmalı!', body: scratch(D.b23, 'Sıra sende', { show: 'Köpek', variants: [['🐞 Adlar farklı', { Kedi: sol(D.b23, 'Sıra sende').Kedi, Köpek: [[['recv', 'sıra bende'], ['sayFor', 'Merhaba Kedi!', 1.5]]] }], ['✅ Adlar aynı', sol(D.b23, 'Sıra sende')]] }),
    note: 'Kedi “sıra sende” haberini salıyor ama köpek “sıra bende” bekliyor: köpek hiç konuşmaz! Haber adları birebir aynı olmalı.' }),
  L3.s({ tag: 'İZLE 👀', title: 'Uzaya yolculuk 🚀', body: scratch(D.b23, 'Uzaya yolculuk', { sm: true }) }),
  L3.s({ tag: 'SORU 🤔', body: quiz({ q: '“haber sal” ile “haber sal <b>ve bekle</b>” arasındaki fark nedir?', v: true, opts: ['Hiçbir fark yok', '“ve bekle” haberi iki kez gönderir', '“ve bekle”, haberi alanların işi bitene kadar bekler'], a: 2, why: '“ve bekle”, haberi alanlar işini <b>bitirene kadar</b> bekler, sonra devam eder.' }) }),
  L3.s({ tag: 'İZLE 👀', title: 'Büyük yarış 🏁', body: scratch(D.b23, 'Büyük yarış', { sm: true }), note: 'Robo hakem “3, 2, 1, Başla!” der ve haber salar; kedi ve köpek aynı anda koşar.' }),
  L3.pc(['💬 Sıra sende', '🚀 Uzaya yolculuk', '❓ Sal ve bekle', '🏁 Büyük yarış', '🎼 Orkestra şefi', '⭐ Üç perdelik sohbet']),

  /* ---------------- 24. BÖLÜM ---------------- */
  L4.cover('Bugün kendi hikâyemizi yapıyoruz! Önce kâğıtta plan, sonra bilgisayar.'),
  L4.s({ tag: 'HİKÂYE 📖', title: 'Bir hikâyenin üç parçası',
    body: `<div class="vs"><div class="f" style="border:6px solid #2a86c4"><h3>1️⃣ Başlangıç</h3><p>Karakterler <b>kim</b>, <b>nerede</b>?</p><p style="font-size:70px;text-align:center;margin:0">🐱🌳</p></div><div class="f" style="border:6px solid #e9a100"><h3>2️⃣ Gelişme</h3><p>Bir <b>sorun</b> ya da <b>macera</b> başlar.</p><p style="font-size:70px;text-align:center;margin:0">😮🌲</p></div><div class="f" style="border:6px solid var(--ok)"><h3>3️⃣ Sonuç</h3><p>Sorun <b>çözülür</b>, hikâye biter.</p><p style="font-size:70px;text-align:center;margin:0">🎉🏠</p></div></div>`,
    note: 'Bildikleri bir masalı (Kırmızı Başlıklı Kız gibi) üç parçaya ayırın.' }),
  L4.s({ tag: 'SIRALA 🧩', title: 'Proje adımları', body: order([['💡', 'Fikir bul'], ['✏️', 'Plan çiz'], ['🎭', 'Kukla seç'], ['🧩', 'Kod yaz'], ['🐞', 'Dene, hatayı düzelt'], ['🎤', 'Göster']]),
    note: 'Büyük bir proje küçük adımlara bölünür. Kod yazmadan önce plan!' }),
  L4.game({ title: '🖼️ Hikâye tahtası',
    body: `<div class="row"><div class="col"><ol><li class="f">Bir kâğıdı <b>3 kareye</b> böl.</li><li class="f">Her kareye hikâyenin bir parçasını <b>çiz</b>: başlangıç, gelişme, sonuç.</li><li class="f">Her karenin altına yaz: <b>Kim ne diyor?</b></li><li class="f">Sonra bilgisayarda bu planı yap!</li></ol></div><div style="flex:0 0 260px">${robo('think', 240)}</div></div>` }),
  L4.s({ tag: 'ÖRNEK 👀', title: 'Örnek hikâye: ormanda kaybolan kedi', body: scratch(D.b24, '3. adım', { sm: true }),
    note: 'Sekmelerle kuklaların kodlarını gösterin: haber salma ile sahneler sırayla oynuyor. Bu bir örnek; çocuklar kendi hikâyelerini yapacak.' }),
  L4.s({ tag: 'SUNUM 🎤', title: 'Sunum zamanı!',
    body: botsay('<p>Hikâyeni arkadaşına göster. <b>Üç şey</b> söyle:</p><p class="f">1️⃣ Hikâyem ne anlatıyor?</p><p class="f">2️⃣ En çok neyle uğraştım?</p><p class="f">3️⃣ Hangi hatayı düzelttim? 🐞</p><p class="f">Arkadaşına bir <b>güzel yorum</b> ve bir <b>öneri</b> söyle. 💬</p>', 'dance'),
    note: 'Sınıf önünde sunum yalnızca gönüllülerle. Tahtada projeksiyonla gösterebilirsiniz.' }),
  L4.pc(['🧩 Proje adımları', '🌳 1. adım: Sahneyi kur', '💬 2. adım: Konuşmalar', '🎵 3. adım: Müzik ve son', '🎤 Sunum zamanı', '⭐ Hareket ve sahne değişimi']),

  weekEnd({ week: W, color: '#ff8c1a', next: 'Oyun projeleri 🎮',
    items: ['<b>Değişken</b>: adı olan ve içinde bir değer saklayan kutu.', '“<b>yap</b>” değeri belirler, “<b>değiştir</b>” üstüne ekler.', '<b>Rastgele</b> blok her seferinde farklı bir sayı verebilir.', '<b>Haber sal</b>: bütün kuklalara mesaj; <b>haberini aldığımda</b>: o mesaj gelince çalışır.', 'Haber adları <b>birebir aynı</b> olmalı.', 'Büyük bir proje <b>küçük adımlara</b> bölünür: plan, kod, dene, göster.'] }),
];

export default { title: 'Değişkenler, Rastgelelik ve Hikâye', slides };
