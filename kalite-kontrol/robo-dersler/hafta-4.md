# Hafta 4 — Scratch'e merhaba

> Robo ile Kodlama · 4. hafta · 4 ders × 40 dk · Bölümler 13–16

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 13 | 🐱 Scratch Dünyasına Merhaba | Sahne ve kukla | 9 | 2 anlatım, 2 test, 5 scratch |
| 2. ders | Bölüm 14 | 🧭 Hareket ve Koordinatlar | x ve y | 9 | 1 anlatım, 3 test, 5 scratch |
| 3. ders | Bölüm 15 | ⚡ Olaylar: Ne Zaman? | Olay | 9 | 1 anlatım, 2 test, 6 scratch |
| 4. ders | Bölüm 16 | 🎭 Görünüm: Kostüm ve Animasyon | Animasyon | 9 | 1 anlatım, 1 test, 7 scratch |

---

## 1. ders · Bölüm 13 — 🐱 Scratch Dünyasına Merhaba

- **Kavram:** Sahne ve kukla
- **Kısa açıklama:** Sahne, kukla ve renkli bloklar! İlk Scratch programını yaz, kediyi yürüt ve konuştur.
- **Öğrendiklerimiz:**
  - Karakterlere kukla, arkadaki resme dekor, hepsinin oynadığı yere sahne denir.
  - Bloklar renklerine göre gruplara ayrılır (mavi hareket, mor görünüm…).
  - Program 🏁 bayrağa basınca başlar ve bloklar yukarıdan aşağıya çalışır.
- **Öğretmen notu:** İnsan Scratch: Tahtaya büyük bir 🏁 çizin. Bir öğrenci “kukla” olsun. Diğerleri kâğıtlara blok yazsın (“10 adım git”, “Merhaba de”). Kâğıtları sıraya dizip bayrağa dokunun; kukla blokları sırayla uygulasın. Bu bölümden sonra isteyen öğrenciler scratch.mit.edu adresinde aynı blokları görebilir.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Scratch dünyasına hoş geldin! 🐱 | Scratch'in Robo'dan farkı anlatılır; sahne, kukla ve dekor kavramları tanıtılır. |
| 2 | 📖 Anlatım | Ekranı tanıyalım | Bloklar, kod alanı, sahne ve 🏁 / ⏹ düğmeleri tanıtılır; her programın bir olay bloğuyla başladığı söylenir. |
| 3 | ❓ Test | Hatırlayalım | Sahnede hareket eden karakterlerin adı sorulur. |
| 4 | 🐱 Scratch | İlk kodun: Kedi yıldıza koşsun! | Kedi yıldıza koşar; hedefler: 🏁 bloğunu kullanmak, kedinin yıldıza dokunması. |
| 5 | 🐱 Scratch | Konuşan kedi | Kedi “Merhaba!” der, yürür, “Ben Scratch kedisiyim!” der; hedefler: “Merhaba” demesi, en az 100 adım yürümesi, iki farklı şey söylemesi. |
| 6 | ❓ Test | Bloklar hangi sırayla çalışır? | Bir betiğin bloklarının çalışma sırası sorulur. |
| 7 | 🐱 Scratch | Dans eden kedi | Kedi sağa ve sola döner; hedefler: sağa dönmesi, sola dönmesi, “bekle” bloğunu kullanması. |
| 8 | 🐱 Scratch | Tam bir tur! | Kedi “tekrarla” bloğuyla tam bir tur (360°) döner. |
| 9 | 🐱 Scratch | ⭐ Kendi gösterini yap | Serbest görev: kedi yürür, döner, konuşur. Hedefler: 🏁 ile başlayan betik, “tekrarla” ve bir şey söyletmek. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Scratch dünyasına hoş geldin! 🐱
Şimdiye kadar Robo oklarla yönetildi. Şimdi Scratch gibi çalışan, kendi oyunlarını, animasyonlarını ve hikâyelerini yapılabilen bir dünyaya geçiliyor. Karakterlere kukla, arkadaki resme dekor, hepsinin oynadığı yere sahne denir.
- Görseller: 🐱 🎭 🎨 🎮

#### Adım 2 · 📖 Anlatım — Ekranı tanıyalım
- Solda renkli bloklar vardır; her renk bir gruptur: [Hareket] [Görünüm] [Olaylar] [Kontrol].
- Ortada kod alanı vardır; bir bloğa tıklanınca buraya eklenir.
- Sağda sahne vardır; 🏁 ile program başlar, ⏹ ile durur.
- Her program sarı bir olay bloğuyla başlar: [🏁 tıklandığında].
- Canlandırma: think

#### Adım 3 · ❓ Test — Hatırlayalım
- Soru: Scratch'te sahnede hareket eden karakterlere ne denir?
- Şıklar: 1) Kukla 2) Dekor 3) Blok
- Doğru cevap: Kukla (1. şık)
- Açıklama: Kukla! Kedi, robot, balık… Hepsi birer kukla. Arkadaki resim ise dekor.

#### Adım 4 · 🐱 Scratch — İlk kodun: Kedi yıldıza koşsun!
- Görev: [🏁 tıklandığında] bloğunu seç, altına [10 adım git] ekle, sayıyı değiştirerek kediyi yıldıza ulaştır, 🏁 düğmesine bas.
- Sahne: dekor `cayir`; kuklalar: Kedi (-160, -60), Yıldız (120, -60)
- Bloklar: 🏁 tıklandığında, adım git
- Hedefler:
  1) “🏁 tıklandığında” bloğunu kullan
  2) Kedi yıldıza dokunsun ⭐
- İpucu: 10 adım çok az. 100, 200, 250 gibi sayılar dene. 🏁 her basışta kedi baştan başlar.
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [250 adım git]
- Otomatik test: sol ve play tanımlı (sol: yukarıdaki çözüm).

#### Adım 5 · 🐱 Scratch — Konuşan kedi
- Görev: Kedi önce “Merhaba!” desin, sonra yürüsün, sonra kendini tanıtsın. [Merhaba! de 2 saniye] yazısı değiştirilebilir.
- Sahne: dekor `cayir`; kuklalar: Kedi (-120, -60)
- Bloklar: 🏁 tıklandığında, adım git, [… de … saniye], [… de]
- Hedefler:
  1) Kedi “Merhaba” desin
  2) Kedi en az 100 adım yürüsün
  3) Kedi iki farklı şey söylesin
- İpucu: 🏁 tıklandığında → Merhaba! de 2 saniye → 100 adım git → “Ben Scratch kedisiyim!” de 2 saniye
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [Merhaba! de 1 saniye] → [100 adım git] → [Ben Scratch kedisiyim! de 1 saniye]

#### Adım 6 · ❓ Test — Bloklar hangi sırayla çalışır?
- Soru: Bir betikteki bloklar hangi sırayla çalışır?
- Şıklar: 1) Aşağıdan yukarıya 2) Hepsi rastgele 3) Yukarıdan aşağıya, sırayla
- Doğru cevap: Yukarıdan aşağıya, sırayla (3. şık)
- Açıklama: Tıpkı Robo'nun programı gibi: en üstten başlar, sırayla aşağı iner.

#### Adım 7 · 🐱 Scratch — Dans eden kedi
- Görev: Kedi bir sağa, bir sola dönsün. [↻ 15 derece dön] sağa, [↺ 15 derece dön] sola döndürür. Arada [1 saniye bekle] kullanılır.
- Sahne: dekor `sahne`; kuklalar: Kedi (0, -60), döndürme: serbest (rot: all)
- Bloklar: 🏁 tıklandığında, ↻ derece dön, ↺ derece dön, saniye bekle
- Hedefler:
  1) Kedi sağa dönsün ↻
  2) Kedi sola dönsün ↺
  3) “bekle” bloğunu kullan
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [↻ 30 derece dön] → [0.5 saniye bekle] → [↺ 60 derece dön] → [0.5 saniye bekle] → [↻ 30 derece dön]

#### Adım 8 · 🐱 Scratch — Tam bir tur!
- Görev: [10 kez tekrarla] bloğuyla kedi tam bir tur (360°) dönsün.
- Sahne: dekor `sahne`; kuklalar: Kedi (0, -60), döndürme: serbest (rot: all)
- Bloklar: 🏁 tıklandığında, tekrarla, ↻ derece dön, ↺ derece dön, saniye bekle
- Hedefler:
  1) “tekrarla” bloğunu kullan
  2) Kedi tam bir tur dönsün (360°)
- İpucu: 10 kez × 36 derece = 360 derece. 🏁 tıklandığında → 10 kez tekrarla [↻ 36 derece dön, 0.1 saniye bekle]
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [10 kez tekrarla: [↻ 36 derece dön] → [0.1 saniye bekle]]

#### Adım 9 · 🐱 Scratch — ⭐ Kendi gösterini yap
- Görev: Sahne senin. Kedi yürüsün, dönsün, konuşsun; istediğin gibi bir gösteri hazırla. Hazır olunca ✔ Bitirdim düğmesine bas.
- Sahne: dekor `sahne`; kuklalar: Kedi (-100, -60), döndürme: serbest (rot: all)
- Bloklar: 🏁 tıklandığında, adım git, ↻ derece dön, ↺ derece dön, … de … saniye, saniye bekle, tekrarla
- Hedefler:
  1) 🏁 ile başlayan bir betik yaz
  2) “tekrarla” kullan
  3) Kedi bir şey söylesin
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [İzleyin! de 1 saniye] → [4 kez tekrarla: [50 adım git] → [90 derece dön]]
- Ek: free (serbest görev)

---

## 2. ders · Bölüm 14 — 🧭 Hareket ve Koordinatlar

- **Kavram:** x ve y
- **Kısa açıklama:** Sahne bir harita: x sağ-sol, y yukarı-aşağı. Kuklaları istediğin noktaya ışınla, süzdür ve yönlendir.
- **Öğrendiklerimiz:**
  - Sahnenin ortası x: 0, y: 0 noktasıdır.
  - x sağa doğru büyür, sola doğru küçülür; y yukarı doğru büyür, aşağı doğru küçülür.
  - Yön 0 yukarı, 90 sağ, 180 aşağı, -90 soldur.
- **Öğretmen notu:** Sınıf koordinat oyunu: Yere bantla iki çizgi yapıştırın (x ve y ekseni). Öğrencilere “x: 2, y: -1” gibi koordinatlar söyleyin, o noktaya gitsinler. Sonra öğrenciler birbirine koordinat sorsun. Satranç tahtasındaki “e4” gibi adlandırmalarla bağ kurabilirsiniz.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Sahne bir harita gibidir 🗺️ | x ve y konumları, sınır değerleri ve orta nokta (0, 0) anlatılır. |
| 2 | ❓ Test | Orta nokta | x: 0, y: 0 sahnenin neresi? |
| 3 | ❓ Test | Köşeyi bul | Sağ üst köşeye en yakın nokta hangisi? |
| 4 | 🐱 Scratch | Yıldıza ışınlan | Kedi, [x: 0 y: 0 konumuna git] ile yıldızın koordinatına ışınlanır; hedef: yıldıza dokunmak. |
| 5 | 🐱 Scratch | Dört köşedeki çiçekler | Arı dört çiçeğin hepsine süzülerek uğrar; hedefler: 4 çiçeğe uğramak. |
| 6 | ❓ Test | x değişirse | [x'i 10 değiştir] bloğunun kuklayı nasıl hareket ettirdiği sorulur. |
| 7 | 🐱 Scratch | Bayrağa tırman | Robo, x ve y değiştiren bloklar ile döngüyle bayrağa ulaşır. |
| 8 | 🐱 Scratch | Roketin yönü | Roket yukarı, sonra sağa uçarak yıldıza gider; [yönüne dön] bloğu kullanılır. |
| 9 | 🐱 Scratch | ⭐ Bonus: Bal toplayan arı | Arı üç çiçeği sırayla gezer ve her çiçekte “Bzz!” der. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Sahne bir harita gibidir 🗺️
Sahnedeki her noktanın bir adresi vardır: x ve y.
- x sağ-sol konumudur: sağa gittikçe büyür (240'a kadar), sola gittikçe küçülür (-240'a kadar).
- y yukarı-aşağı konumudur: yukarı gittikçe büyür (180), aşağı gittikçe küçülür (-180).
- Tam orta: x: 0, y: 0
- Görsel: [koordinat resmi]

#### Adım 2 · ❓ Test — Orta nokta
- Soru: x: 0, y: 0 sahnenin neresidir?
- Şıklar: 1) Sol üst köşe 2) Tam ortası 3) Sağ alt köşe
- Doğru cevap: Tam ortası (2. şık)
- Açıklama: Sahnenin tam ortası! Oradan sağa x büyür, yukarı y büyür.

#### Adım 3 · ❓ Test — Köşeyi bul
- Görsel: [koordinat resmi]
- Soru: Hangi nokta sağ üst köşeye en yakındır?
- Şıklar: 1) x: -200, y: 150 2) x: 200, y: -150 3) x: 200, y: 150
- Doğru cevap: x: 200, y: 150 (3. şık)
- Açıklama: Sağ için x artı (+), yukarı için y artı (+) olmalı.

#### Adım 4 · 🐱 Scratch — Yıldıza ışınlan
- Görev: [x: 0 y: 0 konumuna git] bloğu kuklayı bir anda o noktaya ışınlar. Yıldızın koordinatını bul ve kediyi oraya gönder.
- İpucu: Fareyi sahnede yıldızın üstüne getir; sahnenin üstünde farenin x ve y değerleri yazar.
- Sahne: arka plan `koordinat`; kuklalar: Kedi (0, 0), boyut: 70; Yıldız (150, 100)
- Bloklar: 🏁 tıklandığında, konumuna git, adım git
- Hedefler:
  1) “konumuna git” bloğunu kullan
  2) Kedi yıldıza dokunsun
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [x: 150 y: 100 konumuna git]

#### Adım 5 · 🐱 Scratch — Dört köşedeki çiçekler
- Görev: Arı dört çiçeği de ziyaret etmeli. [1 saniyede x: 0 y: 0 konumuna süzül] bloğu kuklayı yavaşça kaydırır. Her çiçeğin koordinatını bul.
- Sahne: arka plan `koordinat`; kuklalar: Çiçek1 (-170, 110), Çiçek2 (170, 110), Çiçek3 (170, -110), Çiçek4 (-170, -110), Arı (0, 0)
- Bloklar: 🏁 tıklandığında, saniyede süzül, konumuna git, saniye bekle
- Hedefler:
  1) 1. çiçeğe uğra 🌸
  2) 2. çiçeğe uğra 🌸
  3) 3. çiçeğe uğra 🌸
  4) 4. çiçeğe uğra 🌸
- İpucu: Çiçekler: sol üst (-170, 110), sağ üst (170, 110), sağ alt (170, -110), sol alt (-170, -110).
- Örnek çözüm: Arı → [🏁 tıklandığında] → [1 saniyede x: -170 y: 110 konumuna süzül] → [1 saniyede x: 170 y: 110 konumuna süzül] → [1 saniyede x: 170 y: -110 konumuna süzül] → [1 saniyede x: -170 y: -110 konumuna süzül]

#### Adım 6 · ❓ Test — x değişirse
- Soru: [x'i 10 değiştir] bloğu kuklayı nasıl hareket ettirir?
- Şıklar: 1) 10 adım yukarı kaydırır 2) 10 adım sağa kaydırır 3) Kuklayı 10 derece döndürür
- Doğru cevap: 10 adım sağa kaydırır (2. şık)
- Açıklama: x sağ-sol demek. +10 sağa, -10 sola kaydırır. Yukarı-aşağı için y kullanılır.

#### Adım 7 · 🐱 Scratch — Bayrağa tırman
- Görev: Robo bayrağa ulaşsın. [x'i 10 değiştir] ve [y'yi 10 değiştir] blokları ile döngü kullanılır; döngüyle kısaltma yapılmalı.
- Sahne: arka plan `koordinat`; kuklalar: Bayrak (150, 100), Robo (-150, -100)
- Bloklar: 🏁 tıklandığında, x'i değiştir, y'yi değiştir, tekrarla, saniye bekle
- Hedefler:
  1) “x'i değiştir” kullan
  2) “y'yi değiştir” kullan
  3) Robo bayrağa ulaşsın 🏁
- İpucu: Bayrak 300 adım sağda, 200 adım yukarıda. 10 kez [x'i 30 değiştir], sonra 10 kez [y'yi 20 değiştir].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [10 kez tekrarla: [x'i 30 değiştir] → [0.05 saniye bekle]] → [10 kez tekrarla: [y'yi 20 değiştir] → [0.05 saniye bekle]]

#### Adım 8 · 🐱 Scratch — Roketin yönü
- Görev: [90 yönüne dön] bloğu kuklanın baktığı yönü ayarlar: 0 yukarı, 90 sağ, 180 aşağı, -90 sol. Roketi önce yukarı, sonra sağa uçurarak yıldıza götür.
- Sahne: arka plan `uzay`; kuklalar: Yıldız (100, 80), Roket (-150, -120), döndürme: serbest (rot: all)
- Bloklar: 🏁 tıklandığında, yönüne dön, adım git, ↻/↺ derece dön, saniye bekle, süzül
- Hedefler:
  1) “yönüne dön” bloğunu kullan
  2) Roket yıldıza ulaşsın 🚀
- İpucu: 0 yönüne dön → 200 adım git → 90 yönüne dön → 250 adım git
- Örnek çözüm: Roket → [🏁 tıklandığında] → [0 yönüne dön] → [200 adım git] → [0.3 saniye bekle] → [90 yönüne dön] → [250 adım git]

#### Adım 9 · 🐱 Scratch — ⭐ Bonus: Bal toplayan arı
- Görev: Arı üç çiçeği sırayla gezsin ve her çiçekte “Bzz!” desin.
- Sahne: arka plan `cayir`; kuklalar: Çiçek1 (-150, -100), Çiçek2 (0, -60), Çiçek3 (150, -100), Arı (-180, 120)
- Bloklar: 🏁 tıklandığında, saniyede süzül, konumuna git, … de … saniye, saniye bekle
- Hedefler:
  1) 1. çiçek
  2) 2. çiçek
  3) 3. çiçek
  4) Arı “Bzz” desin
- Örnek çözüm: Arı → [🏁 tıklandığında] → [1 saniyede x: -150 y: -100 konumuna süzül] → [Bzz! de 0.5 saniye] → [1 saniyede x: 0 y: -60 konumuna süzül] → [Bzz! de 0.5 saniye] → [1 saniyede x: 150 y: -100 konumuna süzül] → [Bzz! de 0.5 saniye]
- Ek: bonus

---

## 3. ders · Bölüm 15 — ⚡ Olaylar: Ne Zaman?

- **Kavram:** Olay
- **Kısa açıklama:** Tuşa basınca, kuklaya tıklayınca… Programın ne zaman başlayacağını olay blokları belirler.
- **Öğrendiklerimiz:**
  - Olay blokları (sarı) programın NE ZAMAN başlayacağını söyler.
  - Bir kuklanın birden fazla betiği olabilir; her biri kendi olayıyla başlar.
  - Oyunlarda karakterler genelde tuşlarla yönetilir.
- **Öğretmen notu:** Olay–tepki oyunu: “Ben alkışlayınca ayağa kalkın, ıslık çalınca oturun, adınızı söyleyince el sallayın.” Her öğrenci aynı anda birçok “olay bloğunu” dinliyor! Sonra öğrenciler kendi olay–tepki kurallarını yazsın.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Program ne zaman başlar? | [🏁 tıklandığında], [sağ ok tuşuna basılınca], [bu kukla tıklanınca] olay blokları tanıtılır; kapı zili benzetmesi yapılır. |
| 2 | 🐱 Scratch | Klavye ile yürüt | Kedi, sağ ve sol ok tuşlarıyla yürür; hedefler: iki tuş betiği, kedinin yıldıza ve elmaya gitmesi. |
| 3 | 🐱 Scratch | Peynir avı | Fare dört ok tuşuyla hareket eder; hedefler: dört tuş için dört betik, farenin peynire ulaşması. |
| 4 | ❓ Test | Kaç betik olabilir? | Bir kuklanın birden fazla betiği olup olamayacağı sorulur. |
| 5 | 🐱 Scratch | Bana tıkla! | Kediye tıklanınca “Miyav!” der ve miyav sesi çıkar. |
| 6 | 🐱 Scratch | Hayvan orkestrası 🎶 | Üç kukla tıklanınca kendi sesini çalar ve kostümünü değiştirir. |
| 7 | 🐱 Scratch | Zıplayan Robo | 🏁 ile Robo “Hazırım!” der; Boşluk tuşuyla zıplar. |
| 8 | ❓ Test | Oyun karakteri | Karakteri klavyeyle yönetmek için hangi olay bloğu uygundur? |
| 9 | 🐱 Scratch | ⭐ Bonus: Uğur böceğini yakala | Uğur böceğine tıklanınca rastgele konuma kaçar ve “Yakala beni!” der; hedef: 3 kez yakalamak. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Program ne zaman başlar?
Şimdiye kadar hep [🏁 tıklandığında] kullanıldı. Diğer olaylar: [sağ ok tuşuna basılınca], [bu kukla tıklanınca]. Olay blokları kapı zili gibidir: zil çalınca kapıya gidilir; tuşa basılınca kukla hareket eder.
- Görseller: 🔔 ➡️ 🚪 ⌨️ 🖱️

#### Adım 2 · 🐱 Scratch — Klavye ile yürüt
- Görev: Sağ ok basılınca kedi sağa, sol ok basılınca sola gitsin. İki ayrı betik yapılır: [sağ ok tuşuna basılınca] + [x'i 10 değiştir], [sol ok tuşuna basılınca] + [x'i -10 değiştir]. Sonra kedi klavyedeki ok tuşlarıyla önce yıldıza, sonra elmaya götürülür.
- Sahne: arka plan `cayir`; kuklalar: Yıldız (200, -60), Elma (-200, -60), Kedi (0, -60)
- Bloklar: tuşuna basılınca, x'i değiştir, adım git, konumuna git (yönüne dön)
- Hedefler:
  1) Sağ ok ve sol ok için iki betik yaz
  2) Kedi yıldıza gitsin ⭐
  3) Kedi elmaya gitsin 🍎
- İpucu: Tuşa bastıkça kedi 10 adım gider. Tuşu basılı tutarsan sürekli gider.
- Örnek çözüm: Kedi → (betik 1) [sağ ok tuşuna basılınca] → [x'i 10 değiştir]; (betik 2) [sol ok tuşuna basılınca] → [x'i 10 değiştir]
- Ek: bayrak (🏁) gerekmez (noFlag)
- Otomatik test tuşları: sağ ok basılı 0–2.2 sn; sol ok basılı 2.4–6.4 sn

#### Adım 3 · 🐱 Scratch — Peynir avı
- Görev: Fare dört yöne de gidebilmeli. Dört ok tuşu için dört betik yazılır. Yukarı-aşağı için y değişir. Sonra fare peynire götürülür.
- Sahne: arka plan `cayir`; kuklalar: Peynir (180, 130), Fare (-180, -130)
- Bloklar: tuşuna basılınca, x'i değiştir, y'yi değiştir
- Hedefler:
  1) Dört ok tuşu için dört betik
  2) Fare peynire ulaşsın 🧀
- Örnek çözüm: Fare → [sağ ok tuşuna basılınca] → [x'i 10 değiştir]; [sol ok tuşuna basılınca] → [x'i -10 değiştir]; [yukarı ok tuşuna basılınca] → [y'yi 10 değiştir]; [aşağı ok tuşuna basılınca] → [y'yi -10 değiştir]
- Ek: bayrak (🏁) gerekmez (noFlag)
- Otomatik test tuşları: sağ ok basılı 0–3.5 sn; yukarı ok basılı 3.6–6.2 sn

#### Adım 4 · ❓ Test — Kaç betik olabilir?
- Soru: Bir kuklanın birden fazla betiği olabilir mi?
- Şıklar: 1) Evet, her biri kendi olay bloğuyla başlar 2) Hayır, sadece bir tane 3) Sadece iki tane olabilir
- Doğru cevap: Evet, her biri kendi olay bloğuyla başlar (1. şık)
- Açıklama: Evet! Peynir avında farenin 4 betiği vardı ve her biri farklı bir tuşla çalışıyordu.

#### Adım 5 · 🐱 Scratch — Bana tıkla!
- Görev: Kediye tıklanınca “Miyav!” desin ve miyav sesi çıkarsın. [bu kukla tıklanınca] kullanılır.
- Sınıfta hoparlör yoksa sorun değil: ses çalınca kuklanın üstünde 🔊 yazısı görünür.
- Sahne: arka plan `cayir`; kuklalar: Kedi (0, -40), boyut: 130
- Bloklar: bu kukla tıklanınca, sesini başlat, sesini bitene kadar çal, … de … saniye, 🏁 tıklandığında
- Hedefler:
  1) “bu kukla tıklanınca” kullan
  2) Kedi miyav sesi çıkarsın 🔊
  3) Kedi “Miyav” desin
- Örnek çözüm: Kedi → [bu kukla tıklanınca] → [Miyav sesini başlat] → [Miyav! de 1 saniye]
- Ek: bayrak (🏁) gerekmez (noFlag)
- Otomatik test tuşları: Kediye 0.5 sn'de tıklama

#### Adım 6 · 🐱 Scratch — Hayvan orkestrası 🎶
- Görev: Üç kukla, üç ses. Her kukla tıklanınca kendi sesini çalsın ve kostümünü değiştirsin. Kuklalar arasında geçiş için kod alanının üstündeki sekmeler kullanılır.
- Sahne: arka plan `sahne`; kuklalar: Kedi (-150, -40), Köpek (0, -40), Davul (150, -50), boyut: 120
- Bloklar: bu kukla tıklanınca, sesini başlat, sesini bitene kadar çal, sonraki kostüm, … de … saniye, saniye bekle
- Hedefler:
  1) Kedi tıklanınca miyav
  2) Köpek tıklanınca hav hav
  3) Davul tıklanınca davul sesi
  4) En az bir kukla kostüm değiştirsin
- Örnek çözüm:
  - Kedi → [bu kukla tıklanınca] → [Miyav sesini başlat] → [sonraki kostüm]
  - Köpek → [bu kukla tıklanınca] → [Hav hav sesini başlat] → [sonraki kostüm]
  - Davul → [bu kukla tıklanınca] → [Davul sesini bitene kadar çal] → [sonraki kostüm] → [0.2 saniye bekle] → [sonraki kostüm]
- Ek: bayrak (🏁) gerekmez (noFlag)
- Otomatik test tuşları: Kedi 0.3 sn, Köpek 0.8 sn, Davul 1.3 sn'de tıklama

#### Adım 7 · 🐱 Scratch — Zıplayan Robo
- Görev: İki betik birden. 🏁 tıklanınca Robo “Hazırım!” desin. Boşluk tuşuna basılınca zıplasın: [y'yi 60 değiştir], biraz bekle, [y'yi -60 değiştir].
- Sahne: arka plan `cayir`; kuklalar: Robo (0, -100)
- Bloklar: 🏁 tıklandığında, boşluk tuşuna basılınca, konumuna git, … de … saniye, y'yi değiştir, saniye bekle
- Hedefler:
  1) 🏁 ile Robo “Hazırım” desin
  2) Boşluk tuşu betiği yaz
  3) Robo zıplasın 🦘
- Örnek çözüm:
  - Robo → [🏁 tıklandığında] → [x: 0 y: -100 konumuna git] → [Hazırım! de 1 saniye]
  - Robo → [boşluk tuşuna basılınca] → [y'yi 60 değiştir] → [0.3 saniye bekle] → [y'yi -60 değiştir]
- Otomatik test tuşları: Boşluk tuşuna 1.5 sn'de basma

#### Adım 8 · ❓ Test — Oyun karakteri
- Soru: Bir oyunda karakteri klavyeyle yönetmek için hangi olay bloğu en uygundur?
- Şıklar: 1) 🏁 tıklandığında 2) bu kukla tıklanınca 3) … tuşuna basılınca
- Doğru cevap: … tuşuna basılınca (3. şık)
- Açıklama: Tuş olayları sayesinde oyuncu, karakterin ne zaman hareket edeceğine kendisi karar verir.

#### Adım 9 · 🐱 Scratch — ⭐ Bonus: Uğur böceğini yakala
- Görev: Uğur böceğine tıklanınca [rastgele konuma git] ile kaçsın ve “Yakala beni!” desin. Sonra onu 3 kez yakala.
- Sahne: arka plan `orman`; kuklalar: Uğur böceği (0, 0), boyut: 120
- Bloklar: bu kukla tıklanınca, rastgele konuma git, … de … saniye, söyle, sesini başlat
- Hedefler:
  1) “rastgele konuma git” kullan
  2) Uğur böceğini 3 kez yakala 🐞
- Örnek çözüm: Uğur böceği → [bu kukla tıklanınca] → [rastgele konuma git] → [Yakala beni! de 0.5 saniye]
- Ek: bayrak (🏁) gerekmez (noFlag)
- Otomatik test tuşları: Uğur böceğine 0.5, 1.2 ve 2 sn'de tıklama

---

## 4. ders · Bölüm 16 — 🎭 Görünüm: Kostüm ve Animasyon

- **Kavram:** Animasyon
- **Kısa açıklama:** Kostüm değiştir, büyü-küçül, renk değiştir, kaybol! Kuklalarına can ver.
- **Öğrendiklerimiz:**
  - Animasyon, resimleri (kostümleri) hızlıca değiştirerek yapılır.
  - Kuklalar konuşabilir, düşünebilir, büyüyüp küçülebilir, gizlenebilir.
  - Bekle bloğu, olayların sırasını ve zamanlamasını ayarlar.
- **Öğretmen notu:** Kâğıt animasyon (flipbook): Not kâğıtlarının köşesine her sayfada biraz farklı bir çöp adam çizin ve hızlıca çevirin. Scratch'teki “sonraki kostüm + bekle” döngüsü tam olarak budur. Bekleme süresini kısaltınca animasyon hızlanır!

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklaların kıyafet dolabı 👕 | Kostüm ve animasyon kavramı anlatılır; [sonraki kostüm] + [0.1 saniye bekle] ile hareket yaratılır. |
| 2 | 🐱 Scratch | Yürüyen kedi | Kedi tekrarlı döngüyle yürür ve kostüm değiştirir; hedefler: en az 5 kostüm değişimi, en az 100 adım. |
| 3 | 🐱 Scratch | Büyü, küçül | Yıldız en az %180'e büyür, sonra eski boyuna döner. |
| 4 | 🐱 Scratch | Renk değiştiren balık | Balık yüzerken renk etkisi değiştirir; hedef: renk değiştirmesi ve yüzmesi. |
| 5 | 🐱 Scratch | Sohbet | Kedi konuşur; köpek kedi sustuktan sonra cevap verir. |
| 6 | 🐱 Scratch | Sihirbaz hayalet 👻 | Hayalet konuşur, gizlenir, bekler ve başka bir yerde yeniden görünür. |
| 7 | ❓ Test | Animasyonun sırrı | Bir kuklayı yürüyormuş gibi göstermek için ne yapılır? |
| 8 | 🐱 Scratch | Gece oldu | Kedi konuşur, dekor geceye döner, kedi düşünür. |
| 9 | 🐱 Scratch | ⭐ Kendi animasyonun | Serbest görev: bir kukla seçilip kendi animasyonu yapılır. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklaların kıyafet dolabı 👕
Her kuklanın birkaç kostümü vardır. Kedinin iki kostümü vardır: bacakları farklı yerdedir. Kostümler hızlıca değiştirilirse kedi yürüyormuş gibi görünür; buna animasyon denir. Çizgi filmler de böyle yapılır. 🎬
- [sonraki kostüm] + [0.1 saniye bekle] = hareket!
- Görseller: 🖼️ ➡️ 🖼️ ➡️ 🎬

#### Adım 2 · 🐱 Scratch — Yürüyen kedi
- Görev: Kedi gerçekten yürüsün. Tekrarla bloğunun içinde: biraz ilerle, kostüm değiştir, biraz bekle.
- Sahne: arka plan `cayir`; kuklalar: Kedi (-180, -60)
- Bloklar: 🏁 tıklandığında, tekrarla, adım git, sonraki kostüm, saniye bekle, konumuna git
- Hedefler:
  1) “sonraki kostüm” kullan
  2) “tekrarla” kullan
  3) Kedi en az 5 kez kostüm değiştirsin
  4) Kedi en az 100 adım yürüsün
- İpucu: 🏁 → 12 kez tekrarla [10 adım git, sonraki kostüm, 0.1 saniye bekle]
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [12 kez tekrarla: [10 adım git] → [sonraki kostüm] → [0.1 saniye bekle]]

#### Adım 3 · 🐱 Scratch — Büyü, küçül
- Görev: Yıldız önce büyüsün (en az %180), sonra eski boyuna dönsün. [büyüklüğü 10 değiştir] bloğunda eksi sayı küçültür.
- Sahne: arka plan `gece`; kuklalar: Yıldız (0, 0)
- Bloklar: 🏁 tıklandığında, tekrarla, büyüklüğü %… yap, büyüklüğü … değiştir, saniye bekle
- Hedefler:
  1) Yıldız büyüsün (en az %180)
  2) Sonra küçülüp eski haline dönsün
- İpucu: 10 kez tekrarla [büyüklüğü 10 değiştir], sonra 10 kez tekrarla [büyüklüğü -10 değiştir]
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [büyüklüğü %100 yap] → [10 kez tekrarla: [büyüklüğü 10 değiştir] → [0.05 saniye bekle]] → [10 kez tekrarla: [büyüklüğü -10 değiştir] → [0.05 saniye bekle]]

#### Adım 4 · 🐱 Scratch — Renk değiştiren balık
- Görev: Sihirli balık yüzerken rengini değiştirsin. [renk etkisini 25 değiştir] kullanılır.
- Sahne: arka plan `deniz`; kuklalar: Balık (-150, 0)
- Bloklar: 🏁 tıklandığında, tekrarla, renk etkisini değiştir, görsel etkileri temizle, adım git, sonraki kostüm, saniye bekle
- Hedefler:
  1) “renk etkisi” kullan
  2) Balık rengini değiştirsin 🌈
  3) Balık yüzsün
- Örnek çözüm: Balık → [🏁 tıklandığında] → [görsel etkileri temizle] → [20 kez tekrarla: [10 adım git] → [renk etkisini 10 değiştir] → [sonraki kostüm] → [0.1 saniye bekle]]

#### Adım 5 · 🐱 Scratch — Sohbet
- Görev: Kedi ile köpek sohbet etsin. Önce kedi konuşsun, kedi sustuktan sonra köpek cevap versin. Köpeğin betiğinde [2 saniye bekle] kullanılır. Bekleme süresi, kedinin konuştuğu süre kadar olmalı.
- Sahne: arka plan `cayir`; kuklalar: Kedi (-120, -60), Köpek (120, -60), yön: -90
- Bloklar: 🏁 tıklandığında, … de … saniye, … diye düşün … saniye, saniye bekle
- Hedefler:
  1) Kedi bir şey söylesin
  2) Köpek bir şey söylesin
  3) Köpek, kedi sustuktan sonra konuşsun
- Örnek çözüm:
  - Kedi → [🏁 tıklandığında] → [Merhaba Köpek! de 2 saniye]
  - Köpek → [🏁 tıklandığında] → [2 saniye bekle] → [Merhaba Kedi! de 2 saniye]

#### Adım 6 · 🐱 Scratch — Sihirbaz hayalet 👻
- Görev: Hayalet önce “Şimdi kayboluyorum!” desin, [gizle] ile kaybolsun, biraz beklesin, başka bir yerde [göster] ile yeniden belirsin.
- Sahne: arka plan `gece`; kuklalar: Hayalet (0, -20)
- Bloklar: 🏁 tıklandığında, göster, gizle, … de … saniye, saniye bekle, rastgele konuma git, konumuna git
- Hedefler:
  1) Hayalet kaybolsun
  2) Sonra yeniden görünsün
  3) Hayalet konuşsun
- Örnek çözüm: Hayalet → [🏁 tıklandığında] → [göster] → [Şimdi kayboluyorum! de 1 saniye] → [gizle] → [1 saniye bekle] → [rastgele konuma git] → [göster]

#### Adım 7 · ❓ Test — Animasyonun sırrı
- Soru: Scratch'te bir kuklayı yürüyormuş gibi göstermek için ne yaparız?
- Şıklar: 1) Kuklayı büyütürüz 2) Kostümlerini hızlıca sırayla değiştiririz 3) Dekoru değiştiririz
- Doğru cevap: Kostümlerini hızlıca sırayla değiştiririz (2. şık)
- Açıklama: Kostüm değiştirme + kısa bekleme = animasyon!

#### Adım 8 · 🐱 Scratch — Gece oldu
- Görev: Kedi “Ne güzel bir gün!” desin, sonra [dekoru gece yap] ile gece olsun ve kedi “Uyku vakti…” diye düşünsün.
- Sahne: arka plan `cayir`; kuklalar: Kedi (0, -60)
- Bloklar: 🏁 tıklandığında, dekoru … yap, … de … saniye, … diye düşün … saniye, saniye bekle
- Hedefler:
  1) Dekor geceye dönsün 🌙
  2) Kedi düşünsün 💭
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [dekoru çayır yap] → [Ne güzel bir gün! de 1 saniye] → [dekoru gece yap] → [Uyku vakti… diye düşün 1 saniye]

#### Adım 9 · 🐱 Scratch — ⭐ Kendi animasyonun
- Görev: Bir kukla seç ve kendi animasyonunu yap. Kostüm değiştirsin, konuşsun, büyüsün ya da renk değiştirsin. Hazır olunca ✔ Bitirdim düğmesine bas.
- Sahne: arka plan `sahne`; kuklalar: Kuş (-100, 0)
- Bloklar: 🏁 tıklandığında, tekrarla, adım git, süzül, sonraki kostüm, saniye bekle, … de … saniye, büyüklüğü değiştir, renk etkisini değiştir, gizle, göster, dekoru yap (kukla kütüphanesi açık: library)
- Hedefler:
  1) “sonraki kostüm” kullan
  2) “tekrarla” kullan
  3) Bir şey söylet
- Örnek çözüm: Kuş → [🏁 tıklandığında] → [Uçuyorum! de 1 saniye] → [20 kez tekrarla: [10 adım git] → [sonraki kostüm] → [0.1 saniye bekle]]
- Ek: free (serbest görev), library

---

## Hafta özeti
- Bu haftada kullanılan bloklar: 🏁 tıklandığında, tuşuna basılınca, bu kukla tıklanınca, adım git, ↻/↺ derece dön, x: y: konumuna git, rastgele konuma git, saniyede süzül, yönüne dön, x'i / y'yi değiştir, … de … saniye, … diye düşün … saniye, … de, saniye bekle, tekrarla, sonraki kostüm, büyüklüğü yap / değiştir, renk etkisini değiştir, görsel etkileri temizle, göster, gizle, dekoru yap, sesini başlat, sesini bitene kadar çal.
- Toplam adım: 36 (5 anlatım, 8 test, 23 scratch)
  - 1. ders: 9 (2 anlatım, 2 test, 5 scratch)
  - 2. ders: 9 (1 anlatım, 3 test, 5 scratch)
  - 3. ders: 9 (1 anlatım, 2 test, 6 scratch)
  - 4. ders: 9 (1 anlatım, 1 test, 7 scratch)
