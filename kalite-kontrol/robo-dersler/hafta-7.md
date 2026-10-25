# Hafta 7 — Oyun projeleri ve kendi projen

> Robo ile Kodlama · 7. hafta · 4 ders × 40 dk · Bölümler 25–28

Kaynak: `src/robot/lessons/h7.js` (b25, b26, b27, b28). Blok adları: `src/robot/sahne/blocks.js`.
Not: Scratch adımlarında kaynakta ayrı bir "ipucu" alanı yoktur; yönlendirmeler adım metninde yer alır.

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 25 | 🧀 Oyun 1: Labirent | Oyun tasarımı | 7 | 2 anlatım, 5 scratch |
| 2. ders | Bölüm 26 | 🍎 Oyun 2: Elma Yakala | Değişken + rastgele | 7 | 2 anlatım, 5 scratch |
| 3. ders | Bölüm 27 | 🚀 Oyun 3: Uzay Kaçışı | Oyun döngüsü | 7 | 2 anlatım, 5 scratch |
| 4. ders | Bölüm 28 | 🏆 Kendi Projen | Kendi projen | 7 | 3 anlatım, 3 test, 1 scratch |

---

## 1. ders · Bölüm 25 — 🧀 Oyun 1: Labirent

- **Kavram:** Oyun tasarımı
- **Kısa açıklama:** Adım adım kendi labirent oyununu yap: akıcı hareket, duvarlar, hedef, süre ve bir hayalet!
- **Öğrendiklerimiz:**
  - Bir oyunun oyuncusu, hedefi, engelleri ve kuralları vardır.
  - Oyunu küçük parçalar halinde yapıp her parçayı denemek kolaylık sağlar.
  - Oyun kuralları genelde “sürekli tekrarla + eğer” ile yazılır.
- **Öğretmen notu:** Oyun test ekibi: Öğrenciler oyunlarını bitirince yanlarındakiyle yer değiştirip birbirlerinin oyununu oynasın. Oyun test edenler bir şey “güzel”, bir şey “zor”, bir şey “şöyle olsa daha iyi” yazsın. Gerçek oyun şirketlerinde de test ekipleri vardır!

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Bir oyun nasıl yapılır? 🎮 | Bir oyunun dört parçası (oyuncu, hedef, engeller, kurallar) tanıtılır. |
| 2 | 🐱 Scratch | 1. adım: Akıcı hareket | Fare ok tuşlarıyla hareket eder; dört “eğer” bloğu yazılır. |
| 3 | 🐱 Scratch | 2. adım: Duvarlar | Duvara değince “boing” çalar ve fare başa döner. |
| 4 | 🐱 Scratch | 3. adım: Peynir = kazandın! | Peynire değince kazanma sesi çalar, “Kazandım!” der ve durur. |
| 5 | 🐱 Scratch | 4. adım: Süre tut | Peynir kuklasına süre sayan bir betik eklenir. |
| 6 | 🐱 Scratch | 5. adım: Hayalet düşman 👻 | Hayalet koridorda yukarı aşağı gider; fareye hayalet kuralı eklenir. |
| 7 | 📖 Anlatım | Oyunun hazır! 🏆 | Oyun bir arkadaşa oynatılır ve geliştirme soruları sorulur. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Bir oyun nasıl yapılır? 🎮
Bir oyunun dört parçası anlatılır: oyuncu (fare 🐭), hedef (peynir 🧀), engeller (duvarlar, hayalet 👻) ve kurallar (duvara değersen başa dönersin, peynire ulaşırsan kazanırsın). Ders, oyunun adım adım yapılacağını söyler. Resimler: 🐭 🧀 🧱 👻 🏆.

#### Adım 2 · 🐱 Scratch — 1. adım: Akıcı hareket
- Görev: Fare ok tuşlarıyla akıcı hareket etsin: 🏁 tıklandığında → başlangıca git → sürekli tekrarla [eğer sağ ok basılı mı? ise x'i 4 değiştir; sol ok için x'i -4; yukarı ok için y'yi 4; aşağı ok için y'yi -4]. Koşuldaki tuşu değiştirmeyi unutma uyarısı var.
- Sahne: dekor `labirent2`; değişken süre = 0; kuklalar: Peynir (-195, 130), Fare (-200, -135).
- Düzenlenen kukla: Fare
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, x'i değiştir, y'yi değiştir, konuma git, Boing sesini başlat, “… de … saniye”, tümünü durdur, değişkeni yap, değişkeni değiştir, saniye bekle, süzül. Koşullar: tuşuna basılı mı?, dokunuyor mu?
- Hedefler: 1) Dört yön için dört “eğer” (yukarı ve sol dahil). 2) Fare sağa gitsin.
- Örnek çözüm:
  - Fare: 🏁 tıklandığında → x: -200 y: -135 konumuna git → sürekli tekrarla [eğer sağ ok basılı mı? ise x'i 4 değiştir; eğer sol ok basılı mı? ise x'i -4 değiştir; eğer yukarı ok basılı mı? ise y'yi 4 değiştir; eğer aşağı ok basılı mı? ise y'yi -4 değiştir]

#### Adım 3 · 🐱 Scratch — 2. adım: Duvarlar
- Görev: Sürekli tekrarla döngüsünün içine kural ekle: eğer duvara dokunuyorsa “boing” sesi çalsın ve fare başa dönsün.
- Sahne: dekor `labirent2`; kuklalar: Peynir (-195, 130), Fare (-200, -135).
- Düzenlenen kukla: Fare (önceki adımdaki kod korunur)
- Bloklar: aynı blok seti (🏁, sürekli tekrarla, eğer…ise, x/y değiştir, konuma git, ses, “de … saniye”, durdur, değişken blokları, bekle, süzül). Koşullar: tuşuna basılı mı?, dokunuyor mu?
- Hedefler: 1) Duvar kuralı yaz. 2) Duvara değince başa dönsün.
- Örnek çözüm:
  - Fare: 🏁 tıklandığında → x: -200 y: -135 konumuna git → sürekli tekrarla [sağ/sol/yukarı/aşağı ok kuralları (adım 2 ile aynı); eğer duvara dokunuyor mu? ise [Boing sesini başlat, x: -200 y: -135 konumuna git]]

#### Adım 4 · 🐱 Scratch — 3. adım: Peynir = kazandın!
- Görev: Bir kural daha: eğer peynire dokunuyorsa kazanma sesi çalsın, “Kazandım!” desin ve tümünü durdursun. Sonra labirenti geçmeyi dene.
- Sahne: dekor `labirent2`; kuklalar: Peynir (-195, 130), Fare (-200, -135).
- Düzenlenen kukla: Fare (önceki kod korunur)
- Bloklar: önceki blok seti. Koşullar: tuşuna basılı mı?, dokunuyor mu?
- Hedefler: 1) Peynir kuralı yaz. 2) Peynire ulaşınca “Kazandım!” desin.
- Örnek çözüm:
  - Fare: 🏁 tıklandığında → x: -200 y: -135 konumuna git → sürekli tekrarla [dört yön kuralı; eğer duvara dokunuyor mu? ise [Boing sesini başlat, x: -200 y: -135 konumuna git]; eğer Peynir'e dokunuyor mu? ise [Kazandın sesini başlat, “Kazandım!” de 1 saniye, tümünü durdur]]

#### Adım 5 · 🐱 Scratch — 4. adım: Süre tut
- Görev: süre değişkeniyle oyunun kaç saniye sürdüğünü göster. Peynire yeni bir betik ekle: 🏁 tıklandığında → süreyi 0 yap → sürekli tekrarla [1 saniye bekle, süreyi 1 değiştir].
- Sahne: dekor `labirent2`; değişken süre = 0; kuklalar: Peynir (-195, 130), Fare (-200, -135).
- Düzenlenen kukla: Peynir
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, değişkeni yap, değişkeni değiştir, saniye bekle, konuma git, ses, “de … saniye”, durdur, x/y değiştir, süzül. Koşullar: tuşuna basılı mı?, dokunuyor mu?
- Hedefler: 1) Süreyi 🏁 ile sıfırla. 2) Süre her saniye artsın (süre en az 3 olmalı).
- Örnek çözüm:
  - Fare: 🏁 tıklandığında → x: -200 y: -135 konumuna git → sürekli tekrarla [dört yön kuralı; duvar kuralı; peynir kuralı (adım 4 ile aynı)]
  - Peynir: 🏁 tıklandığında → süre değişkenini 0 yap → sürekli tekrarla [1 saniye bekle; süre değişkenini 1 değiştir]

#### Adım 6 · 🐱 Scratch — 5. adım: Hayalet düşman 👻
- Görev: Ortadaki koridora hayalet eklenir; hayalet koridorda yukarı aşağı gidip gelir. Hayaletin kodu: 🏁 tıklandığında → x: 0 y: 20 konumuna git → sürekli tekrarla [1.5 saniyede x: 0 y: 60'a süzül, 1.5 saniyede x: 0 y: 20'ye süzül]. Fareye kural eklenir: eğer hayalete dokunuyorsa başa dön. Hayalet alttayken üstten, üstteyken alttan geçmeyi dene.
- Sahne: dekor `labirent2`; değişken süre = 0; kuklalar: Peynir (-195, 130), Fare (-200, -135), Hayalet (0, 20, boyut 60).
- Düzenlenen kukla: Hayalet (ardından Fare)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, konuma git, süzül, x/y değiştir, ses, “de … saniye”, durdur, değişken blokları, saniye bekle. Koşullar: tuşuna basılı mı?, dokunuyor mu?
- Hedefler: 1) Hayalet koridorda yukarı aşağı gidip gelsin. 2) Fareye hayalet kuralı ekle.
- Örnek çözüm:
  - Fare: 🏁 tıklandığında → x: -200 y: -135 konumuna git → sürekli tekrarla [dört yön kuralı; duvar kuralı; peynir kuralı; eğer Hayalet'e dokunuyor mu? ise [Boing sesini başlat, x: -200 y: -135 konumuna git]]
  - Peynir: 🏁 tıklandığında → süre değişkenini 0 yap → sürekli tekrarla [1 saniye bekle; süre değişkenini 1 değiştir]
  - Hayalet: 🏁 tıklandığında → x: 0 y: 20 konumuna git → sürekli tekrarla [1.5 saniyede x: 0 y: 60 konumuna süzül; 1.5 saniyede x: 0 y: 20 konumuna süzül]

#### Adım 7 · 📖 Anlatım — Oyunun hazır! 🏆
Tebrik edilir ve bir arkadaşa oynatıp izlemesi istenir. Sorular: Oyun kolay mı, zor mu? Hayaleti hızlandırmak için süzülme süresi kısaltılabilir mi? Bir hayalet daha eklemek ister misin? Önceki adımlara dönüp oyun değiştirilebilir. Hareket: dans (dance). Resim yok.

---

## 2. ders · Bölüm 26 — 🍎 Oyun 2: Elma Yakala

- **Kavram:** Değişken + rastgele
- **Kısa açıklama:** Gökten elmalar yağıyor! Sepetle yakala, skor topla, canlarını koru ve elmalar hızlandıkça hayatta kal.
- **Öğrendiklerimiz:**
  - Rastgele konumlar oyunu her seferinde farklı yapar.
  - Skor ve can gibi değişkenler oyunun durumunu tutar.
  - Değişkenlerle oyunun zorluğu (hız) zamanla artırılabilir.
- **Öğretmen notu:** Zorluk ayarı tartışması: Öğrencilere sorun: “Bir oyun çok kolay olursa ne olur? Çok zor olursa?” Sınıfça elmanın hızı için iyi bir başlangıç değeri ve artış miktarı seçin. Farklı değerleri deneyen grupları karşılaştırın.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Elma yağmuru 🍎 | Oyun kuralları anlatılır: sepet fareyi takip eder, elmalar rastgele düşer, yakalama skor, kaçırma can azaltır. |
| 2 | 🐱 Scratch | 1. adım: Sepet fareyi takip etsin | Sepet, fare x konumunu takip eder. |
| 3 | 🐱 Scratch | 2. adım: Düşen elma | Elma rastgele yerden düşer; sepete değerse skor artar, yere düşerse tepeye döner. |
| 4 | 🐱 Scratch | 3. adım: Üç can ❤️ | Kaçırılan elma canı azaltır; can 0 olunca “Oyun bitti!” denir. |
| 5 | 🐱 Scratch | 4. adım: Hızlanan elmalar ⚡ | Elmanın düşüş hızı “hız” değişkeniyle belirlenir ve yakalayışta artar. |
| 6 | 🐱 Scratch | 5. adım: Kazanma ekranı 🏆 | Skor 5 olunca elma gizlenir, “kazandın” haberi salınır, kedi “Tebrikler!” der. |
| 7 | 📖 Anlatım | Oyunu geliştir 🛠️ | Başlangıç hızı, kazanma skoru ve elma yerine yıldız/kalp önerileri verilir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Elma yağmuru 🍎
Gökten elmalar düşer; sepet fareyle sağa sola taşınır. Liste: sepet fareyi takip eder; elma rastgele bir yerden düşer; yakalarsan skor artar, kaçırırsan can azalır; elmalar gittikçe hızlanır. Resimler: 🍎 ⬇️ 🧺 ⭐ ❤️. Hareket: dalga (wave).

#### Adım 2 · 🐱 Scratch — 1. adım: Sepet fareyi takip etsin
- Görev: Sepet sadece sağa sola gitsin: sürekli tekrarla [x'i (fare x) yap]. Sayı kutusunun yanındaki ▾ düğmesinden “fare x” seçilir.
- Sahne: dekor `cayir`; değişkenler skor = 0, can = 3, hız = -4; kuklalar: Elma (0, 170), Sepet (0, -150).
- Düzenlenen kukla: Sepet
- Bloklar: 🏁 tıklandığında, mesaj alınca, mesaj gönder, mesaj gönder ve bekle, sürekli tekrarla, eğer…ise, “… olana kadar bekle”, konuma git, x'i yap, y'yi değiştir, x'i değiştir, ses, “de … saniye”, göster, gizle, durdur, değişkeni yap, değişkeni değiştir, saniye bekle, dekoru değiştir. Değer blokları: fare x, rastgele, değişken. Koşullar: dokunuyor mu?, karşılaştır.
- Hedefler: 1) “fare x” kullan. 2) Sepet sağa sola gitsin.
- Örnek çözüm:
  - Sepet: 🏁 tıklandığında → x: 0 y: -150 konumuna git → sürekli tekrarla [x'i (fare x) yap]

#### Adım 3 · 🐱 Scratch — 2. adım: Düşen elma
- Görev: Elmanın kodu: 🏁 tıklandığında → skoru 0 yap → x: (rastgele -200 ile 200) y: 170 konumuna git → sürekli tekrarla [y'yi -4 değiştir; eğer sepete dokunuyorsa: skoru 1 değiştir, pop sesi, tepeye dön; eğer y < -170 ise: tepeye dön].
- Sahne: aynı (dekor `cayir`; Elma (0, 170), Sepet (0, -150)).
- Düzenlenen kukla: Elma (sepet kodu korunur)
- Bloklar: önceki adımdaki blok seti. Değer blokları: fare x, rastgele, değişken. Koşullar: dokunuyor mu?, karşılaştır.
- Hedefler: 1) “rastgele” kullan. 2) 3 elma yakala (skor en az 3).
- Örnek çözüm:
  - Sepet: 🏁 tıklandığında → x: 0 y: -150 konumuna git → sürekli tekrarla [x'i (fare x) yap]
  - Elma: 🏁 tıklandığında → skor değişkenini 0 yap; can 3 ve hız -4 yap; x: (rastgele -200..200) y: 170 konumuna git → sürekli tekrarla [y'yi -4 değiştir; eğer Sepet'e dokunuyor mu? ise [skor'u 1 değiştir; Pop sesini başlat; x: (rastgele) y: 170 konumuna git]; eğer y < -170 ise [x: (rastgele) y: 170 konumuna git]]

  Not: Kaynak çözüm kodunda, betik başlangıcındaki değişken sıfırlamaları (skor, can, hız) tüm elma çözümlerinde bulunur.

#### Adım 4 · 🐱 Scratch — 3. adım: Üç can ❤️
- Görev: Elma yere düşerse (y < -170) canı -1 değiştir. Eğer can = 0 ise “Oyun bitti!” de ve tümünü durdur. 🏁 ile canı 3 yapmayı unutma.
- Sahne: dekor `cayir`; Elma (0, 170), Sepet (0, -150).
- Düzenlenen kukla: Elma (sepet kodu korunur)
- Bloklar: önceki blok seti. Koşullar: dokunuyor mu?, karşılaştır. Değer blokları: fare x, rastgele, değişken.
- Hedefler: 1) Kaçırınca can azalsın. 2) Can bitince “Oyun bitti” desin.
- Örnek çözüm:
  - Sepet: 🏁 tıklandığında → x: 0 y: -150 konumuna git → sürekli tekrarla [x'i (fare x) yap]
  - Elma: 🏁 tıklandığında → skor 0, can 3, hız -4 yap → x: (rastgele) y: 170 konumuna git → sürekli tekrarla [y'yi -4 değiştir; eğer Sepet'e dokunuyor mu? ise [skor'u 1 değiştir; Pop sesini başlat; x: (rastgele) y: 170 konumuna git]; eğer y < -170 ise [can'ı -1 değiştir; x: (rastgele) y: 170 konumuna git]; eğer can = 0 ise [“Oyun bitti!” de 1 saniye; tümünü durdur]]

#### Adım 5 · 🐱 Scratch — 4. adım: Hızlanan elmalar ⚡
- Görev: Oyun zorlaşsın. hız değişkeni kullanılır: 🏁 ile hız -4 yapılır; düşerken y'yi (hız) değiştirilir; her yakalayışta hızı -1 değiştirilir (daha hızlı düşer).
- Sahne: dekor `cayir`; Elma (0, 170), Sepet (0, -150).
- Düzenlenen kukla: Elma (sepet kodu korunur)
- Bloklar: önceki blok seti. Koşullar: dokunuyor mu?, karşılaştır. Değer blokları: fare x, rastgele, değişken.
- Hedefler: 1) Düşerken hız değişkenini kullan. 2) Elma hızlansın (hız en az -6 olmalı).
- Örnek çözüm:
  - Sepet: 🏁 tıklandığında → x: 0 y: -150 konumuna git → sürekli tekrarla [x'i (fare x) yap]
  - Elma: 🏁 tıklandığında → skor 0, can 3, hız -4 yap → x: (rastgele) y: 170 konumuna git → sürekli tekrarla [y'yi (hız) değiştir; eğer Sepet'e dokunuyor mu? ise [skor'u 1 değiştir; Pop sesini başlat; hız'ı -1 değiştir; x: (rastgele) y: 170 konumuna git]; eğer y < -170 ise [can'ı -1 değiştir; x: (rastgele) y: 170 konumuna git]; eğer can = 0 ise [“Oyun bitti!” de 1 saniye; tümünü durdur]]

#### Adım 6 · 🐱 Scratch — 5. adım: Kazanma ekranı 🏆
- Görev: Skor 5 olunca oyun kazanılsın. Elmaya kural: eğer skor = 5 ise gizlen, “kazandın” haberini sal ve bekle, tümünü durdur. Kedinin kodu: 🏁 tıklandığında → gizle; “kazandın” haberini alınca → göster, ses (Kazandın), “Tebrikler!” de 2 saniye.
- Sahne: dekor `cayir`; değişkenler skor = 0, can = 3, hız = -4; kuklalar: Elma (0, 170), Sepet (0, -150), Kedi (0, 20, görünmez).
- Düzenlenen kukla: Elma (ardından Kedi)
- Bloklar: önceki blok seti + haber alınca / haber gönder. Mesaj: kazandın. Koşullar: dokunuyor mu?, karşılaştır.
- Hedefler: 1) “kazandın” haberini sal. 2) Kedi görünüp “Tebrikler!” desin.
- Örnek çözüm:
  - Sepet: 🏁 tıklandığında → x: 0 y: -150 konumuna git → sürekli tekrarla [x'i (fare x) yap]
  - Elma: 🏁 tıklandığında → skor 0, can 3, hız -4 yap → x: (rastgele) y: 170 konumuna git → sürekli tekrarla [y'yi (hız) değiştir; eğer Sepet'e dokunuyor mu? ise [skor'u 1 değiştir; Pop sesini başlat; hız'ı -1 değiştir; x: (rastgele) y: 170 konumuna git]; eğer y < -170 ise [can'ı -1 değiştir; x: (rastgele) y: 170 konumuna git]; eğer skor = 5 ise [gizle; “kazandın” haberini sal ve bekle; tümünü durdur]]
  - Kedi: 🏁 tıklandığında → gizle; “kazandın” haberini alınca → göster, Kazandın sesini başlat, “Tebrikler!” de 2 saniye

#### Adım 7 · 📖 Anlatım — Oyunu geliştir 🛠️
Oyun çalışıyor. Öneriler: başlangıç hızını değiştir (kolaylaşıyor mu, zorlaşıyor mu?); kazanmak için gereken skoru 10 yap; elma yerine yıldız ya da kalp yakala. Hareket: dans (dance).

---

## 3. ders · Bölüm 27 — 🚀 Oyun 3: Uzay Kaçışı

- **Kavram:** Oyun döngüsü
- **Kısa açıklama:** Roketini göktaşlarından kaçır! Ne kadar uzun dayanırsan o kadar puan.
- **Öğrendiklerimiz:**
  - Bir kukla ekranın bir ucundan çıkınca diğer ucundan yeniden girebilir.
  - Süreye bağlı puan, “hayatta kalma” oyunlarının temelidir.
  - Aynı kodu başka bir kuklaya da yazarak oyunu zorlaştırabiliriz.
- **Öğretmen notu:** Kodu yeniden kullanma: 5. adımda ikinci göktaşı için öğrencilerin ilk göktaşının kodunu “kopyalaması” gerekir. Gerçek Scratch'te bir betiği başka kuklanın üstüne sürükleyerek kopyalayabileceklerini gösterin. Programcıların sık yaptığı “kodu yeniden kullanma” fikrini konuşun.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Uzayda tehlike! ☄️ | Roket yukarı-aşağı ok tuşlarıyla kaçar; göktaşı sağdan çıkar; dayanılan her saniye 1 puan. |
| 2 | 🐱 Scratch | 1. adım: Roket kontrolü | Roket yukarı-aşağı ok tuşlarıyla hareket eder. |
| 3 | 🐱 Scratch | 2. adım: Göktaşı | Göktaşı sola doğru uçar, sınırı geçince rastgele yükseklikten yeniden çıkar. |
| 4 | 🐱 Scratch | 3. adım: Çarpışma 💥 | Roket göktaşına değerse “boing”, “Oyun bitti!” ve durma. |
| 5 | 🐱 Scratch | 4. adım: Puan | Roketin betiğine saniye bazlı puan eklenir. |
| 6 | 🐱 Scratch | 5. adım: İkinci göktaşı ☄️☄️ | Göktaşı2 eklenir (hız -5); roketin çarpışma kuralına Göktaşı2 eklenir. |
| 7 | 📖 Anlatım | Üç oyun yaptın! 🎮🎮🎮 | Üç oyunda kullanılan ortak fikirler özetlenir; sonraki derste kendi proje yapılacağı duyurulur. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Uzayda tehlike! ☄️
Roket uzayda yol alır; karşıdan göktaşları gelir. Yukarı-aşağı ok tuşlarıyla kaçılır. Göktaşı sağdan sola uçar; sol kenara gelince yeniden sağdan, rastgele bir yükseklikten çıkar. Çarpılırsa oyun biter. Dayanılan her saniye 1 puan. Resimler: 🚀 ☄️ ⬆️ ⬇️ ⏱️. Hareket: dalga (wave).

#### Adım 2 · 🐱 Scratch — 1. adım: Roket kontrolü
- Görev: Roket: 🏁 tıklandığında → x: -180 y: 0 konumuna git → sürekli tekrarla [eğer yukarı ok basılı ise y'yi 6 değiştir; eğer aşağı ok basılı ise y'yi -6 değiştir].
- Sahne: dekor `uzay`; değişken skor = 0; kuklalar: Göktaşı (240, 0), Roket (-180, 0).
- Düzenlenen kukla: Roket
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, konuma git, yönüne dön, x/y değiştir, ses, “de … saniye”, durdur, değişkeni yap/değiştir, saniye bekle, sonraki kostüm. Değer blokları: rastgele, değişken. Koşullar: tuşuna basılı mı?, dokunuyor mu?, karşılaştır.
- Hedefler: 1) Yukarı ve aşağı için iki “eğer”. 2) Roket yukarı çıksın (y > 60). 3) Roket aşağı insin (y < -60).
- Örnek çözüm:
  - Roket: 🏁 tıklandığında → x: -180 y: 0 konumuna git; 90 yönüne dön → sürekli tekrarla [eğer yukarı ok basılı mı? ise y'yi 6 değiştir; eğer aşağı ok basılı mı? ise y'yi -6 değiştir]

#### Adım 3 · 🐱 Scratch — 2. adım: Göktaşı
- Görev: Göktaşı: 🏁 tıklandığında → x: 240 y: (rastgele -150 ile 150) konumuna git → sürekli tekrarla [x'i -8 değiştir; 5 derece dön; eğer x < -230 ise sağa, rastgele yüksekliğe git].
- Sahne: dekor `uzay`; değişken skor = 0; kuklalar: Göktaşı (240, 0), Roket (-180, 0).
- Düzenlenen kukla: Göktaşı (roket kodu korunur)
- Bloklar: önceki blok seti. Değer blokları: rastgele, değişken. Koşullar: tuşuna basılı mı?, dokunuyor mu?, karşılaştır.
- Hedefler: 1) “rastgele” kullan. 2) Göktaşı iki kez ekranı geçsin.
- Örnek çözüm:
  - Roket: 🏁 tıklandığında → x: -180 y: 0 konumuna git; 90 yönüne dön → sürekli tekrarla [y'yi (yukarı/aşağı ok kuralları) değiştir]
  - Göktaşı: 🏁 tıklandığında → x: 240 y: (rastgele -150..150) konumuna git → sürekli tekrarla [x'i -8 değiştir; ↻ 5 derece dön; eğer x < -230 ise [x: 240 y: (rastgele -150..150) konumuna git]]

#### Adım 4 · 🐱 Scratch — 3. adım: Çarpışma 💥
- Görev: Rokete kural: eğer göktaşına dokunuyorsa “boing” sesi, “Oyun bitti!” de ve tümünü durdur.
- Sahne: dekor `uzay`; değişken skor = 0; kuklalar: Göktaşı (240, 0), Roket (-180, 0).
- Düzenlenen kukla: Roket (göktaşı kodu korunur)
- Bloklar: önceki blok seti. Değer blokları: rastgele, değişken. Koşullar: tuşuna basılı mı?, dokunuyor mu?, karşılaştır.
- Hedefler: 1) Çarpışma kuralı yaz. 2) Çarpınca “Oyun bitti!” desin.
- Örnek çözüm:
  - Roket: 🏁 tıklandığında → x: -180 y: 0 konumuna git; 90 yönüne dön → sürekli tekrarla [yukarı/aşağı ok kuralları; eğer Göktaşı'na dokunuyor mu? ise [Boing sesini başlat, “Oyun bitti!” de 1 saniye, tümünü durdur]]
  - Göktaşı: (adım 3 ile aynı)

#### Adım 5 · 🐱 Scratch — 4. adım: Puan
- Görev: Dayanılan her saniye puan. Rokete yeni betik: 🏁 tıklandığında → skoru 0 yap → sürekli tekrarla [1 saniye bekle, skoru 1 değiştir].
- Sahne: dekor `uzay`; değişken skor = 0; kuklalar: Göktaşı (240, 0), Roket (-180, 0).
- Düzenlenen kukla: Roket
- Bloklar: önceki blok seti. Değer blokları: rastgele, değişken. Koşullar: tuşuna basılı mı?, dokunuyor mu?, karşılaştır.
- Hedefler: 1) Skoru 🏁 ile sıfırla. 2) Skor her saniye artsın (skor en az 3 olmalı).
- Örnek çözüm:
  - Roket: (adım 4'teki roket betiği) + 🏁 tıklandığında → skor 0 → sürekli tekrarla [1 saniye bekle; skor'u 1 değiştir]
  - Göktaşı: (adım 3 ile aynı)

#### Adım 6 · 🐱 Scratch — 5. adım: İkinci göktaşı ☄️☄️
- Görev: Göktaşı2 geldi. Birinci göktaşının kodu Göktaşı2 için de yazılır (hız -5). Rokete Göktaşı2 çarpışma kuralı eklenir.
- Sahne: dekor `uzay`; değişken skor = 0; kuklalar: Göktaşı (240, 0), Roket (-180, 0), Göktaşı2 (240, 100, boyut 70).
- Düzenlenen kukla: Göktaşı2
- Bloklar: önceki blok seti. Değer blokları: rastgele, değişken. Koşullar: tuşuna basılı mı?, dokunuyor mu?, karşılaştır.
- Hedefler: 1) Göktaşı2 iki kez ekranı geçsin. 2) Rokete Göktaşı2 kuralı ekle.
- Örnek çözüm:
  - Roket: 🏁 tıklandığında → x: -180 y: 0 konumuna git; 90 yönüne dön → sürekli tekrarla [yukarı/aşağı ok kuralları; eğer Göktaşı'na dokunuyor mu? ise [Boing sesini başlat, “Oyun bitti!” de, tümünü durdur]; eğer Göktaşı2'ye dokunuyor mu? ise [“Oyun bitti!” de 1 saniye, tümünü durdur]] + 🏁 tıklandığında → skor 0 → sürekli tekrarla [1 saniye bekle; skor'u 1 değiştir]
  - Göktaşı: 🏁 tıklandığında → x: 240 y: (rastgele -150..150) konumuna git → sürekli tekrarla [x'i -8 değiştir; 5 derece dön; eğer x < -230 ise [x: 240 y: (rastgele) konumuna git]]
  - Göktaşı2: 🏁 tıklandığında → x: 240 y: (rastgele -150..150) konumuna git → sürekli tekrarla [x'i -5 değiştir; 5 derece dön; eğer x < -230 ise [x: 240 y: (rastgele) konumuna git]]

  Not: Kaynak çözümde Göktaşı2 hızı -5 olarak verilmiştir (Göktaşı -8).

#### Adım 7 · 📖 Anlatım — Üç oyun yaptın! 🎮🎮🎮
Labirent, elma yakalama ve uzay kaçışı özetlenir. Üç oyunda ortak fikirler: olaylar, sürekli tekrarla, eğer, değişkenler, rastgelelik. Gelecek derste kendi proje yapılacağı söylenir. Hareket: dans (dance).

---

## 4. ders · Bölüm 28 — 🏆 Kendi Projen

- **Kavram:** Kendi projen
- **Kısa açıklama:** Öğrendiğin her şeyi kullanarak kendi oyununu, hikâyeni ya da sanat eserini yap. Sonra gerçek Scratch'e geç!
- **Öğrendiklerimiz:**
  - Bir fikri plana, planı koda dönüştürebilirsin.
  - Olay, döngü, koşul, değişken ve haber salma her projede işe yarar.
  - Aynı blokları scratch.mit.edu adresinde gerçek Scratch'te de kullanabilirsin.
- **Öğretmen notu:** Proje fuarı: Ders sonunda sınıfı bir “bilim fuarına” çevirin: her öğrenci projesini açık bırakır, diğerleri gezip dener ve yapışkan nota bir övgü yazar. İsteyen öğrenciler aile izniyle scratch.mit.edu üzerinde hesap açıp projelerini yeniden yapabilir.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Sıra sende! 💡 | Proje türleri (oyun, hikâye, sanat, müzik) sayılır; önce kâğıda kısa plan yazılması istenir. |
| 2 | ❓ Test | Hatırla: döngü | Bir kuklanın durmadan hareket etmesi için hangi blok? |
| 3 | ❓ Test | Hatırla: koşul | “Karakter yıldıza değerse puan kazansın” için hangi blok? |
| 4 | ❓ Test | Hatırla: değişken | Oyundaki puanı saklamak için ne kullanılır? |
| 5 | 🐱 Scratch | Bitirme projen | Serbest proje; ➕ ile kukla, 🖼 ile dekor eklenir; liste tamamlanınca “✔ Bitirdim” basılır. |
| 6 | 📖 Anlatım | Gerçek Scratch'e geçiş 🐱 | scratch.mit.edu, hesap, Scratch uygulaması; 🏁 farkı anlatılır. |
| 7 | 📖 Anlatım | Tebrikler, programcı! 🎓 | Yolculuk özetlenir; son hafta “Scratch ustalığı” duyurulur. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Sıra sende! 💡
Proje seçenekleri: 🎮 Oyun (yakala, kaç, labirent); 📖 Hikâye (konuşan karakterler, sahne değişimi); 🎨 Sanat (kalemle desenler); 🎵 Müzik (kendi şarkı ve dans eden kuklalar). Önce kâğıda kısa plan yazılır: Kuklalar kim? Ne olacak? Nasıl biter? Resimler: 🎮 📖 🎨 🎵.

#### Adım 2 · ❓ Test — Hatırla: döngü
- Soru: Bir kukla oyun boyunca hiç durmadan hareket etsin istiyorsak hangi bloğu kullanırız?
- Şıklar: A) 10 kez tekrarla · B) bekle · **C) sürekli tekrarla (doğru)**
- Doğru cevap: sürekli tekrarla
- Açıklama: Sürekli tekrarla, ⏹ basılana kadar devam eder.

#### Adım 3 · ❓ Test — Hatırla: koşul
- Soru: “Karakter yıldıza değerse puan kazansın.” Bunun için hangi blok gerekir?
- Şıklar: **A) eğer yıldıza dokunuyor mu? ise (doğru)** · B) rastgele konuma git · C) kalemi bastır
- Doğru cevap: eğer yıldıza dokunuyor mu? ise
- Açıklama: Algılama + eğer: kuralların temel taşı!

#### Adım 4 · ❓ Test — Hatırla: değişken
- Soru: Oyundaki puanı saklamak için ne kullanırız?
- Şıklar: A) Kostüm · **B) Değişken (doğru)** · C) Dekor
- Doğru cevap: Değişken
- Açıklama: Değişken: üzerinde adı yazan bir kutu. Skor, can, süre…

#### Adım 5 · 🐱 Scratch — Bitirme projen
- Görev: Hayalindeki projeyi yap. ➕ ile kukla ekle, 🖼 ile dekor seç. Liste: projede olması gerekenler; hepsi ✅ olunca “✔ Bitirdim” düğmesine basılır.
- Sahne: dekor `cayir`; değişkenler skor = 0, can = 3; kuklalar: Kedi (-120, -60). Test sahnesinde ek olarak Elma (100, 100) bulunur.
- Bloklar: çok sayıda blok serbesttir (olaylar, hareket, görünüm, ses, kalem, kontrol, algılama, değişkenler). Değer blokları: rastgele, x, y, fare x, fare y, değişken. Mesajlar: başla, kazandın, mesaj1.
- Hedefler (liste): 1) En az iki kukla. 2) Bir döngü (tekrarla / sürekli / kadar tekrarla). 3) Bir koşul (eğer…ise / eğer…değilse / olana kadar). 4) Bir değişken ya da ses.
- Örnek çözüm:
  - Kedi: 🏁 tıklandığında → skor 0 → sürekli tekrarla [fare imlecine git; eğer Elma'ya dokunuyor mu? ise [skor'u 1 değiştir]]
  - Elma: 🏁 tıklandığında → sürekli tekrarla [rastgele konuma git; 1 saniye bekle]

#### Adım 6 · 📖 Anlatım — Gerçek Scratch'e geçiş 🐱
- Tarayıcıda scratch.mit.edu adresine gidilip “Oluştur”a tıklanır (hesap açmadan denenebilir).
- Projeleri kaydetmek için ailen ya da öğretmeninle hesap açılır.
- İnternetsiz çalışmak için “Scratch Uygulaması” indirilebilir.
- Fark: Gerçek Scratch'te 🏁'e basınca kuklalar kendiliğinden başa dönmez; her betiğin başına “x: y: konumuna git” gibi başlangıç blokları konmalıdır.
- Hareket: dalga (wave).

#### Adım 7 · 📖 Anlatım — Tebrikler, programcı! 🎓
Algoritma, döngü, fonksiyon, koşul, değişken, haber salma ve kendi oyunların hatırlatılır. Son bir hafta “Scratch ustalığı” (soru soran kuklalar, matematik oyunları, klonlarla uzay savaşı) olacağı duyurulur. Resimler: 🤖 🐱 🎮 🏆 🎓. Hareket: dans (dance).

---

## Hafta özeti
- Bu haftada kullanılan bloklar (sol çözümlerinde ve hedeflerinde geçen): 🏁 tıklandığında, tuşuna basılınca / basılı mı?, sürekli tekrarla, tekrarla, eğer…ise, eğer…değilse, olana kadar bekle, olana kadar tekrarla, bu kukla tıklanınca, haber aldığımda, haber sal, haber sal ve bekle, konuma git, rastgele konuma git, fare imlecine git, süzül, yönüne dön, x'i / y'yi değiştir, x'i / y'yi yap, ↻ derece dön, sonraki kostüm, göster, gizle, sayFor (“de … saniye”), ses çal, tümünü durdur, saniye bekle, değişkeni yap / değiştir; değer blokları: rastgele, fare x, x / y konumu, değişken; karşılaştırma ve dokunuyor mu? koşulları.
- Yeni blok sayısı: Bu hafta içinde önceki haftalara göre hangi blokların “yeni” olduğu bu rapor kapsamında (h1–h6 karşılaştırılmadan) belirlenmedi.
- Toplam adım: 28 (9 anlatım, 3 test, 16 scratch). Ders başına 7 adım.
