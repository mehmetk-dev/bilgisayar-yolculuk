# Hafta 6 — Değişkenler, rastgelelik ve hikâye

> Robo ile Kodlama · 6. hafta · 4 ders × 40 dk · Bölümler 21–24

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 21 | 🗃️ Değişkenler: Skor Tutma | Değişken | 8 | 1 anlatım, 1 test, 6 scratch |
| 2. ders | Bölüm 22 | 🎲 Rastgele Sayılar | Rastgelelik | 8 | 1 anlatım, 1 test, 6 scratch |
| 3. ders | Bölüm 23 | 📣 Haber Salma | Mesajlaşma | 7 | 1 anlatım, 1 test, 5 scratch |
| 4. ders | Bölüm 24 | 📖 Proje: Animasyonlu Hikâye | Proje | 7 | 2 anlatım, 1 sıralama, 4 scratch |

---

## 1. ders · Bölüm 21 — 🗃️ Değişkenler: Skor Tutma

- **Kavram:** Değişken
- **Kısa açıklama:** Skor, can, sayaç… Bir sayıyı akılda tutan kutular: değişkenler! Oyunlarına puan ekle.
- **Öğrendiklerimiz:**
  - Değişken, üzerinde adı yazan ve içinde bir değer saklayan kutudur.
  - “… yap” değişkenin değerini belirler, “… değiştir” üstüne ekler (ya da çıkarır).
  - Değişkenler koşullarla birlikte kullanılabilir: skor 5 olursa kazan!
- **Öğretmen notu:** Masaya üstünde “SKOR” yazan bir kutu koyun. Her doğru cevapta içine bir fasulye atın (“skoru 1 değiştir”). Oyun başında kutuyu boşaltın (“skoru 0 yap”). Kutunun üstüne her seferinde güncel sayıyı yazan bir kâğıt koyun: “şu an kaç?” sorusunun cevabı hep orada görünür. Sahnenin sol üstündeki değişken göstergesi de budur.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Akılda tutan kutu 🗃️ | Değişkenin ne olduğu ve “değişkeni 0 yap / 1 değiştir” blokları anlatılır. |
| 2 | 🐱 Scratch | Tıklama sayacı | Kediye her tıklanınca sayaç 1 artar; 5 tıklamada sayaç 5 olur. |
| 3 | 🐱 Scratch | Elma topla | Elma 🏁 ile skoru sıfırlar, kediye dokunursa skor artar; 5 elma toplanır. |
| 4 | ❓ Test | Değişken nedir? | Değişkenin tanımı soruluyor. |
| 5 | 🐱 Scratch | Kazandım! | Kediye, skor 5 olunca “Kazandım!” diyen bir betik eklenir. |
| 6 | 🐱 Scratch | Geri sayım 🚀 | Roket 10’dan 1’e geri sayar, “Kalkış!” deyip yukarı uçar. |
| 7 | 🐱 Scratch | Üç can | Kedi hayalete değince can azalır; can 0 olunca oyun biter. |
| 8 | 🐱 Scratch | ⭐ Kendi puan oyunun | Öğrenci kendi puan oyununu yapar (serbest mod). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Akılda tutan kutu 🗃️
Değişken, üzerinde adı yazan ve içinde sayı saklayan bir kutudur. “skor değişkenini 0 yap” kutuyu sıfırlar, “skor değişkenini 1 değiştir” üstüne 1 ekler. Değişkenin değeri sahnenin sol üstünde görünür.

#### Adım 2 · 🐱 Scratch — Tıklama sayacı
- Görev: Kediye her tıklandığında `sayaç` değişkeni 1 artsın. Kediye 5 kez tıklayıp sahnenin sol üstüne bakılır.
- Sahne: dekor `cayir`; değişken: `sayaç` = 0; kukla: Kedi (konum 0, -40; boyut 120).
- Bloklar: bu kukla tıklanınca, `sayaç` değişkenini 1 değiştir, miyav sesini başlat, “… de … saniye”, 🏁 tıklandığında, `sayaç` değişkenini 0 yap. Ek: 🏁 bloğu gerekmez (noFlag).
- Hedefler: 1) “değiştir” bloğunu kullan; 2) Sayaç 5 olsun.
- İpucu: (kaynakta yok)
- Örnek çözüm: bu kukla tıklanınca → sayaç değişkenini 1 değiştir → miyav sesini başlat

#### Adım 3 · 🐱 Scratch — Elma topla
- Görev: Elmanın kodunu yaz: 🏁 ile skoru 0 yap; sonra sürekli tekrarla [eğer Kedi’ye dokunuyorsa: skoru 1 değiştir, pop sesini başlat, rastgele konuma git]. 5 elma topla.
- Sahne: dekor `cayir`; değişken: `skor` = 0; kuklalar: Elma (120, 60), Kedi (-100, -60; boyut 70; kilitli — değiştirilemez). Kedi kodu: 🏁 tıklandığında → sürekli tekrarla [fare imlecine git].
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, `skor` değişkenini `n` yap, `skor` değişkenini `n` değiştir, pop sesini başlat (`sound`), rastgele konuma git; koşul: Kedi dokunuyor mu?. Düzenlenecek kukla: Elma.
- Hedefler: 1) 🏁 ile skoru 0 yap; 2) Yakalayınca skoru 1 artır; 3) 5 elma topla 🍎.
- İpucu: (kaynakta yok)
- Örnek çözüm: Elma → [🏁 tıklandığında → skor değişkenini 0 yap → sürekli tekrarla [eğer Kedi dokunuyor mu? ise [skor değişkenini 1 değiştir → pop sesini başlat → rastgele konuma git]]]

#### Adım 4 · ❓ Test — Değişken nedir?
- Soru: Değişken için hangisi doğru?
- Şıklar: (1) Adı olan ve içinde bir değer (sayı gibi) saklayan kutudur; (2) Kuklanın kostümüdür; (3) Bir ses türüdür.
- Doğru cevap: 1. şık — Adı olan ve içinde bir değer (sayı gibi) saklayan kutudur.
- Açıklama: Skor, can, süre, sayaç… Hepsi birer değişken.

#### Adım 5 · 🐱 Scratch — Kazandım!
- Görev: Kediye ikinci bir betik ekle: 🏁 → “… olana kadar bekle” (koşul: skor = 5) → “Kazandım!” de → tümünü durdur.
- Sahne: dekor `cayir`; değişken: `skor` = 0; kuklalar: Elma (120, 60; kilitli; 🏁 ile skoru 0 yap, göster, sürekli tekrarla [eğer Kedi’ye dokunuyorsa: skoru 1 değiştir, pop, rastgele konuma git]); Kedi (-100, -60; boyut 70; 🏁 ile fare imlecine git).
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, olana kadar bekle, `{t}` de `{s}` saniye, `{t}` de, sesi başlat, tümünü durdur, fare imlecine git; koşul: karşılaştır (`=`). Düzenlenecek kukla: Kedi.
- Hedefler: 1) Skoru kontrol eden bir koşul kullan; 2) Skor 5 olunca “Kazandım!” desin.
- İpucu: (kaynakta yok)
- Örnek çözüm: Kedi → [🏁 tıklandığında → (skor = 5) olana kadar bekle → kazandın sesini başlat → “Kazandım!” de (2 saniye) → tümünü durdur]; Kedi’nin 🏁 ile fareye gitme betiği de tanımlı.

#### Adım 6 · 🐱 Scratch — Geri sayım 🚀
- Görev: Roket kalkıştan önce geri saysın: 10, 9, 8 … 1. Söylenecek yazının yerine değişkeni koymak için yazı kutusunun yanındaki ▾ düğmesinden “sayı”yı seç. 🏁 → sayıyı 10 yap → 10 kez tekrarla [(sayı) de, 0.3 saniye bekle, sayıyı -1 değiştir] → “Kalkış!” de → yukarı uç.
- Sahne: dekor `uzay`; değişken: `sayı` = 10; kukla: Roket (0, -110; yön 0; her yöne dönebilir).
- Bloklar: 🏁 tıklandığında, değişkeni n yap, değişkeni n değiştir, n kez tekrarla, “… de”, “… de (n saniye)”, saniye bekle, y’yi değiştir, x:y konumuna git; değer bloğu: değişken.
- Hedefler: 1) Roket “10” desin; 2) Roket “1” desin; 3) “Kalkış!” desin ve uçsun.
- İpucu: (kaynakta yok)
- Örnek çözüm: Roket → [🏁 tıklandığında → x: 0 y: -110 konumuna git → sayı değişkenini 10 yap → 10 kez tekrarla [(sayı) de → 0.3 saniye bekle → sayı değişkenini -1 değiştir] → “Kalkış!” de (0.5 saniye) → 30 kez tekrarla [y’yi 10 değiştir]]

#### Adım 7 · 🐱 Scratch — Üç can
- Görev: Hayalet sağa sola gidip gelir (hazır). Kediyi ok tuşlarıyla yönet; hayaletin yolundan yukarı çıkarak kaç. Kediye oyun kuralı yaz: 🏁 → canı 3 yap → sürekli tekrarla [eğer hayalete dokunuyorsa: canı -1 değiştir, başa dön, 1 saniye bekle; eğer can = 0 ise: “Oyun bitti!” de, tümünü durdur].
- Sahne: dekor `gece`; değişken: `can` = 3; kuklalar: Hayalet (200, -60; kilitli; 🏁 → (200, -60) konumuna git, -90 yönüne dön, sürekli tekrarla [6 adım git, kenara geldiyse sek]); Kedi (-200, -60; ok tuşlarıyla hareket: sağ ok x+10, sol ok x-10, yukarı ok y+10, aşağı ok y-10).
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer…ise, değişkeni n yap/değiştir, x:y konumuna git, “de” süreli, saniye bekle, tümünü durdur, sesi başlat, tuşa basılınca, x’i/y’yi değiştir; koşullar: dokunuyor mu?, karşılaştır. Düzenlenecek kukla: Kedi.
- Hedefler: 1) Hayalete değince can azalsın; 2) Can bitince “Oyun bitti” desin.
- İpucu: (kaynakta yok)
- Örnek çözüm: Kedi → [sağ ok: x’i 10 değiştir; sol ok: x’i -10 değiştir; yukarı ok: y’yi 10 değiştir; aşağı ok: y’yi -10 değiştir] + [🏁 → can değişkenini 3 yap → x: -200 y: -60 konumuna git → sürekli tekrarla [eğer Hayalet dokunuyor mu? ise [can değişkenini -1 değiştir → boing sesini başlat → x: -200 y: -60 konumuna git → 1 saniye bekle], eğer can = 0 ise [“Oyun bitti!” de (1 saniye) → tümünü durdur]]]
- Süre: Bu ders için test süresi 25 saniye tanımlı (kaynakta `testTime`).

#### Adım 8 · 🐱 Scratch — ⭐ Kendi puan oyunun
- Görev: Kendi oyununu yap: neye tıklanınca ya da neye dokununca puan kazanılsın? Skoru 🏁 ile sıfırlamayı unutma. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `orman`; değişken: `skor` = 0; kukla: Uğur böceği (0, 0).
- Bloklar: tüm hareket, görünüm, ses, olay, kontrol, değişken blokları; ek olarak rastgele konuma git, fare imlecine git. Koşullar: dokunuyor mu?, tuşuna basılı mı?, karşılaştır. Değer blokları: değişken, rastgele. Serbest mod (kütüphane açık).
- Hedefler: 1) Skoru sıfırla (değişkeni n yap); 2) Skoru artır (değişkeni n değiştir).
- İpucu: (kaynakta yok)
- Örnek çözüm: Uğur böceği → [🏁 tıklandığında → skor değişkenini 0 yap] + [bu kukla tıklanınca → skor değişkenini 1 değiştir → rastgele konuma git]

---

## 2. ders · Bölüm 22 — 🎲 Rastgele Sayılar

- **Kavram:** Rastgelelik
- **Kısa açıklama:** Zar at, yıldız yağdır, rastgele uçan böcekleri yakala! Her oyunu farklı yapan sihir: rastgelelik.
- **Öğrendiklerimiz:**
  - “rastgele 1 ile 6 arası” her seferinde farklı bir sayı verebilir.
  - Rastgelelik oyunları her oynayışta farklı ve heyecanlı yapar.
  - Değer blokları (yuvarlak bloklar) sayı yazılan yerlere konabilir.
- **Öğretmen notu:** Her öğrenci gerçek bir zarı 12 kez atsın ve sonuçları tabloya yazsın. Sınıfın sonuçlarını birleştirin: her sayı yaklaşık eşit mi çıktı? Sonra bilgisayardaki zara 12 kez tıklayın, çıkan yüzleri aynı tabloya yazıp gerçek zarla karşılaştırın.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Şans oyunu 🎲 | Rastgele bloğunun ne yaptığı ve nasıl kullanılacağı anlatılır. |
| 2 | 🐱 Scratch | Zar at | Zara tıklanınca rastgele kostümler gösterilir; zar döner gibi görünür. |
| 3 | 🐱 Scratch | Çılgın uğur böceği | Uğur böceği rastgele koordinatlara süzülerek uçar. |
| 4 | ❓ Test | Hep aynı mı? | “rastgele 1 ile 10 arası” her seferinde aynı sayıyı verir mi? |
| 5 | 🐱 Scratch | Yıldız yağmuru 🌠 | Yıldız rastgele x’ten tepeden düşer; yere gelince yeniden başlar. |
| 6 | 🐱 Scratch | Rastgele sanat | Kalem rastgele noktalara gider ve iz bırakır. |
| 7 | 🐱 Scratch | Böcek avı | Böcek her saniye rastgele bir yere ışınlanır; 3 böcek yakalanır. |
| 8 | 🐱 Scratch | ⭐ Şans makinesi | Öğrenci kendi şans oyununu yapar (serbest mod). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Şans oyunu 🎲
Zar atınca ne geleceği bilinmez; buna rastgele denir. Yeşil “rastgele 1 ile 6 arası” bloğu her seferinde bu aralıktan bir sayı seçer. Bloğu kullanmak için sayı kutusunun yanındaki ▾ düğmesine basılıp “rastgele” seçilir, sonra iki sayı değiştirilir.

#### Adım 2 · 🐱 Scratch — Zar at
- Görev: Zara tıklanınca 8 kez tekrarla [(rastgele 1 ile 6 arası). kostüme geç, 0.05 saniye bekle]. Zar dönüyormuş gibi görünecek; birkaç kez tıklanır.
- Sahne: dekor `sahne`; kukla: Zar (0, -20; boyut 200).
- Bloklar: bu kukla tıklanınca, tekrarla, n. kostüme geç, sonraki kostüm, saniye bekle, sesi başlat, derece dön; değer bloğu: rastgele. Ek: 🏁 gerekmez.
- Hedefler: 1) “rastgele” kullan; 2) Zar en az 3 farklı yüz göstersin.
- İpucu: (kaynakta yok)
- Örnek çözüm: Zar → [bu kukla tıklanınca → pop sesini başlat → 8 kez tekrarla [(rastgele 1 ile 6 arası). kostüme geç → 0.05 saniye bekle]]

#### Adım 3 · 🐱 Scratch — Çılgın uğur böceği
- Görev: Uğur böceği sahnede rastgele uçsun: sürekli tekrarla [1 saniyede x: (rastgele -200 ile 200) y: (rastgele -150 ile 150) konumuna süzül].
- Sahne: dekor `orman`; kukla: Uğur böceği (0, 0).
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, konuma süzül, x:y konumuna git, saniye bekle, derece dön; değer bloğu: rastgele.
- Hedefler: 1) “rastgele” kullan; 2) Sahnenin en az 3 farklı köşesine uçsun.
- İpucu: (kaynakta yok)
- Örnek çözüm: Uğur böceği → [🏁 tıklandığında → sürekli tekrarla [0.7 saniyede x: (rastgele -200 ile 200) y: (rastgele -150 ile 150) konumuna süzül]]
- Not: Metinde “1 saniyede” yazıyor; örnek çözümde süzülme süresi 0.7 saniye.

#### Adım 4 · ❓ Test — Hep aynı mı?
- Soru: “rastgele 1 ile 10 arası” bloğu her çalıştığında aynı sayıyı mı verir?
- Şıklar: (1) Evet, hep 5 verir; (2) Hayır, 1 ile 10 arasında herhangi bir sayı olabilir; (3) Hep 10 verir.
- Doğru cevap: 2. şık — Hayır, 1 ile 10 arasında herhangi bir sayı olabilir.
- Açıklama: Her seferinde yeniden seçer. Bazen aynı sayı tekrar gelebilir, tıpkı zar gibi.

#### Adım 5 · 🐱 Scratch — Yıldız yağmuru 🌠
- Görev: Yıldız rastgele bir x konumundan, en tepeden (y: 170) düşsün; yere gelince yeniden tepeden başlasın: sürekli tekrarla [x: (rastgele -220 ile 220) y: 170 konumuna git, y < -160 olana kadar tekrarla [y’yi -6 değiştir]].
- Sahne: dekor `gece`; kukla: Yıldız (0, 170).
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, x:y konumuna git, olana kadar tekrarla, tekrarla, y’yi değiştir, derece dön; koşul: karşılaştır; değer bloğu: rastgele.
- Koşul varsayılanı: y konumu < -160.
- Hedefler: 1) “rastgele” kullan; 2) Yıldız 3 kez yere düşsün.
- İpucu: (kaynakta yok)
- Örnek çözüm: Yıldız → [🏁 tıklandığında → sürekli tekrarla [x: (rastgele -220 ile 220) y: 170 konumuna git → (y < -160) olana kadar tekrarla [y’yi -6 değiştir]]]

#### Adım 6 · 🐱 Scratch — Rastgele sanat
- Görev: Kalem rastgele noktalara gitsin ve iz bıraksın: kalemi bastır → 30 kez tekrarla [rastgele konuma git, kalem rengini değiştir…]. Her 🏁 basışında farklı bir resim çıkar.
- Sahne: dekor `beyaz`; kukla: Kalem (0, 0; her yöne dönebilir).
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, tekrarla, rastgele konuma git, x:y konumuna git, kalem rengini yap, kalem kalınlığını yap, saniye bekle; değer bloğu: rastgele.
- Hedefler: 1) “rastgele konuma git” kullan; 2) En az 20 çizgi çiz.
- İpucu: (kaynakta yok)
- Örnek çözüm: Kalem → [🏁 tıklandığında → tümünü sil → kalem kalınlığını (rastgele 2 ile 8 arası) yap → kalemi bastır → 15 kez tekrarla [kalem rengini kırmızı (#ff4d4d) yap → rastgele konuma git → kalem rengini mavi (#4c97ff) yap → rastgele konuma git → 0.05 saniye bekle]]
- Not: Metinde “30 kez” yazıyor; örnek çözümde 15 kez tekrarla.

#### Adım 7 · 🐱 Scratch — Böcek avı
- Görev: Böcek her saniye rastgele bir yere ışınlansın. Tıklayınca skor 1 artsın ve kaçsın. 3 böcek yakala!
- Sahne: dekor `orman`; değişken: `skor` = 0; kukla: Uğur böceği (0, 0).
- Bloklar: 🏁 tıklandığında, bu kukla tıklanınca, sürekli tekrarla, rastgele konuma git, saniye bekle, skor değişkenini n yap/değiştir, pop sesini başlat, x:y konumuna git; değer bloğu: rastgele.
- Hedefler: 1) 🏁 ile skoru sıfırla; 2) 3 böcek yakala 🐞.
- İpucu: (kaynakta yok)
- Örnek çözüm: Uğur böceği → [🏁 tıklandığında → skor değişkenini 0 yap → sürekli tekrarla [rastgele konuma git → (rastgele 0.5 ile 1.5 arası) saniye bekle]] + [bu kukla tıklanınca → skor değişkenini 1 değiştir → pop sesini başlat → rastgele konuma git]
- Not: Metinde “her saniye” yazıyor; örnek çözümde bekleme süresi rastgele 0.5 ile 1.5 saniye.

#### Adım 8 · 🐱 Scratch — ⭐ Şans makinesi
- Görev: Kendi şans oyununu yap: zar atan bir makine, rastgele ışınlanan Robo, şans yıldızı… “rastgele” kullanmayı unutma. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`; kuklalar: Zar (-80, 0), Robo (100, -40).
- Bloklar: tüm hareket, görünüm, ses, olay, kontrol, değişken blokları; ek olarak kostüm numarasına geç, rastgele konuma git. Koşullar: dokunuyor mu?, tuşuna basılı mı?, karşılaştır. Değer blokları: rastgele. Serbest mod (kütüphane açık).
- Hedefler: 1) “rastgele” kullan.
- İpucu: (kaynakta yok)
- Örnek çözüm: Zar → [bu kukla tıklanınca → (rastgele 1 ile 6 arası). kostüme geç]

---

## 3. ders · Bölüm 23 — 📣 Haber Salma

- **Kavram:** Mesajlaşma
- **Kısa açıklama:** Kuklalar birbirine haber göndersin: sohbet, sahne değişimi, yarış başlangıcı!
- **Öğrendiklerimiz:**
  - “haber sal” bloğu bütün kuklalara bir mesaj gönderir.
  - “… haberini aldığımda” bloğu o mesaj gelince çalışır.
  - Haber salma, kuklaların birlikte ve doğru sırayla çalışmasını sağlar.
- **Öğretmen notu:** Zil çaldığında (haber) herkes kendi işini yapar: öğrenciler sınıfa girer, öğretmen yoklama alır, nöbetçi kapıyı kapatır. Zili çalan kişi kimin ne yapacağını tek tek söylemez! Sınıfta bir “haber” seçin (ör. 🔔) ve her gruba farklı bir görev verin.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklalar arası mesaj 📣 | Haber salma ve haberini aldığımda blokları anlatılır. |
| 2 | 🐱 Scratch | Sıra sende | Kedi “sıra sende” haberini salar, köpek alınca cevap verir. |
| 3 | 🐱 Scratch | Uzaya yolculuk 🚀 | Kedi “uzay” haberini salar; dekor uzaya döner, roket uçar. |
| 4 | ❓ Test | Sal ve bekle | “haber sal” ile “haber sal ve bekle” arasındaki fark soruluyor. |
| 5 | 🐱 Scratch | Büyük yarış 🏁 | Robo geri sayım yapar, “başla” haberiyle Kedi ve Köpek bayrağa koşar. |
| 6 | 🐱 Scratch | Orkestra şefi | Robo tıklanınca “çal” haberi gider; davul ve zil kendi seslerini çalar. |
| 7 | 🐱 Scratch | ⭐ Üç perdelik sohbet | Üç kukla sırayla konuşur (serbest mod). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklalar arası mesaj 📣
Kuklalar birbirine haber gönderebilir; okul zili gibi, zil çalınca herkes ne yapacağını bilir. “haber sal” herkese duyurur; “haberini aldığımda” o haber gelince çalışır. “bekle” bloğuyla süre hesaplamadan konuşmalar ve olaylar sıraya konabilir.

#### Adım 2 · 🐱 Scratch — Sıra sende
- Görev: Kedi konuşunca köpeğe “sıra sende” haberini salsın. Köpek bu haberi alınca cevap versin.
- Sahne: dekor `cayir`; kuklalar: Kedi (-120, -60), Köpek (120, -60; yön -90).
- Bloklar: 🏁 tıklandığında, haberini aldığımda, haberini sal, haberini sal ve bekle, de (süreli), saniye bekle. Haber: “sıra sende”.
- Hedefler: 1) Kedi haber salsın; 2) Köpek haberi alınca konuşsun; 3) Köpek, kediden sonra konuşsun.
- İpucu: (kaynakta yok)
- Örnek çözüm: Kedi → [🏁 tıklandığında → “Merhaba Köpek!” de (1.5 saniye) → “sıra sende” haberini sal]; Köpek → [“sıra sende” haberini aldığımda → “Merhaba Kedi!” de (1.5 saniye)]

#### Adım 3 · 🐱 Scratch — Uzaya yolculuk 🚀
- Görev: Kedi “Hadi uzaya gidelim!” deyip “uzay” haberini salsın. Bu haberi alınca: kedi gizlensin, dekor uzay olsun, roket görünüp yukarı uçsun. (🏁 ile her şeyi başa al: dekor çayır, roket gizli.)
- Sahne: dekor `cayir`; kuklalar: Kedi (-100, -60), Roket (100, -100; yön 0; başlangıçta gizli).
- Bloklar: 🏁 tıklandığında, haberini aldığımda, haberini sal, de (süreli), dekoru yap, göster, gizle, x:y konumuna git, y’yi değiştir, 30 kez tekrarla, süzül, saniye bekle. Haber: “uzay”. Dekorlar: çayır, uzay.
- Hedefler: 1) Kedi “uzay” haberini salsın; 2) Roket haberi alınca çalışsın; 3) Dekor uzaya dönsün; 4) Kedi gizlensin; 5) Roket görünüp uçsun.
- İpucu: (kaynakta yok)
- Örnek çözüm:
  - Kedi → [🏁 tıklandığında → dekoru çayır yap → göster → “Hadi uzaya gidelim!” de (1.5 saniye) → “uzay” haberini sal]; [“uzay” haberini aldığımda → gizle → dekoru uzay yap]
  - Roket → [🏁 tıklandığında → gizle → x: 100 y: -100 konumuna git]; [“uzay” haberini aldığımda → göster → 30 kez tekrarla [y’yi 8 değiştir]]

#### Adım 4 · ❓ Test — Sal ve bekle
- Soru: “haber sal” ile “haber sal ve bekle” arasındaki fark nedir?
- Şıklar: (1) Hiçbir fark yok; (2) “ve bekle” haberi iki kez gönderir; (3) “ve bekle”, haberi alanların işi bitene kadar bekler, sonra devam eder.
- Doğru cevap: 3. şık — “ve bekle”, haberi alanların işi bitene kadar bekler, sonra devam eder.
- Açıklama: “sal ve bekle” sohbetlerde çok işe yarar: karşıdaki sözünü bitirene kadar beklersin.

#### Adım 5 · 🐱 Scratch — Büyük yarış 🏁
- Görev: Robo hakem “3, 2, 1, Başla!” desin ve “başla” haberini salsın. Kedi ve köpek bu haberi alınca bitiş bayrağına koşsun!
- Sahne: dekor `cayir`; kuklalar: Bayrak (200, -80; boyut 150), Robo (0, 110; boyut 80), Kedi (-200, -40; boyut 80), Köpek (-200, -120; boyut 80).
- Bloklar: 🏁 tıklandığında, haberini aldığımda, haberini sal, de (süreli), x:y konumuna git, süzül, adım git, tekrarla, sonraki kostüm, saniye bekle. Haber: “başla”. Düzenlenecek kukla: Robo.
- Hedefler: 1) Robo “başla” haberini salsın; 2) Kedi ve köpek haberi alınca koşsun; 3) Kedi bayrağa ulaşsın; 4) Köpek bayrağa ulaşsın.
- İpucu: (kaynakta yok)
- Örnek çözüm:
  - Robo → [🏁 tıklandığında → “3” de (0.5 saniye) → “2” de (0.5 saniye) → “1” de (0.5 saniye) → “Başla!” de (0.5 saniye) → “başla” haberini sal]
  - Kedi → [🏁 tıklandığında → x: -200 y: -40 konumuna git]; [“başla” haberini aldığımda → 2 saniyede x: 180 y: -40 konumuna süzül]
  - Köpek → [🏁 tıklandığında → x: -200 y: -120 konumuna git]; [“başla” haberini aldığımda → 2.5 saniyede x: 180 y: -120 konumuna süzül]

#### Adım 6 · 🐱 Scratch — Orkestra şefi
- Görev: Robo’ya tıklanınca “çal” haberini salsın. Davul ve zil bu haberi alınca kendi seslerini çalsın.
- Sahne: dekor `sahne`; kuklalar: Davul (-130, -60), Zil (130, -60), Robo (0, 60; boyut 90).
- Bloklar: bu kukla tıklanınca, haberini aldığımda, haberini sal, sesi başlat, sesi bitene kadar çal, sonraki kostüm, saniye bekle, de (süreli). Haber: “çal”. Ek: 🏁 gerekmez. Düzenlenecek kukla: Robo.
- Hedefler: 1) Robo tıklanınca haber salsın; 2) Davul çalsın 🥁; 3) Zil çalsın 🔔.
- İpucu: (kaynakta yok)
- Örnek çözüm:
  - Robo → [bu kukla tıklanınca → “çal” haberini sal]
  - Davul → [“çal” haberini aldığımda → davul sesini bitene kadar çal → sonraki kostüm]
  - Zil → [“çal” haberini aldığımda → zil sesini başlat]

#### Adım 7 · 🐱 Scratch — ⭐ Üç perdelik sohbet
- Görev: Üç kukla sırayla konuşsun! Her kukla sözünü bitirince bir sonrakine haber salsın (sahne1 → sahne2 → son). Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`; kuklalar: Kedi (-150, -60), Robo (0, -60), Köpek (150, -60; yön -90).
- Bloklar: 🏁 tıklandığında, haberini aldığımda, haberini sal, haberini sal ve bekle, de (süreli), düşün (süreli), saniye bekle, sonraki kostüm, sesi başlat, dekoru yap. Haberler: sahne1, sahne2, son. Serbest mod (kütüphane açık).
- Hedefler: 1) En az iki farklı haber kullan; 2) Üç kukla da konuşsun.
- İpucu: (kaynakta yok)
- Örnek çözüm:
  - Kedi → [🏁 tıklandığında → “Merhaba!” de (1 saniye) → “sahne1” haberini sal]
  - Robo → [“sahne1” haberini aldığımda → “Selam!” de (1 saniye) → “sahne2” haberini sal]
  - Köpek → [“sahne2” haberini aldığımda → “Hav!” de (1 saniye) → “son” haberini sal]

---

## 4. ders · Bölüm 24 — 📖 Proje: Animasyonlu Hikâye

- **Kavram:** Proje
- **Kısa açıklama:** Kendi animasyonlu hikâyeni adım adım yap: sahne, karakterler, konuşmalar, sahne değişimi ve müzik.
- **Öğrendiklerimiz:**
  - Büyük bir proje küçük adımlara bölünerek yapılır.
  - Hikâyenin başlangıcı, gelişmesi ve sonucu olur.
  - Haber salma, hikâyedeki olayları sıraya koyar.
- **Öğretmen notu:** Kodlamadan önce öğrenciler bir kâğıdı 3 kareye bölsün ve hikâyelerinin başlangıç, gelişme, sonuç sahnelerini çizsin. Her karenin altına “kim ne diyor?” yazsın. Ders sonunda gönüllüler hikâyelerini projeksiyonda sınıfa göstersin.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Bir hikâyenin üç parçası | Hikâyenin başlangıç, gelişme, sonuç parçaları anlatılır. |
| 2 | 🔢 Sıralama | Proje adımları | Bir projenin yapım adımları sıraya dizilir (6 kart). |
| 3 | 🐱 Scratch | 1. adım: Sahneyi kur | Dekor seçilir, en az iki kukla olur, kuklalar 🏁 ile yerine gider. |
| 4 | 🐱 Scratch | 2. adım: Konuşmalar | Karakterler konuşur; biri haber salar, diğeri cevap verir. |
| 5 | 🐱 Scratch | 3. adım: Hareket ve sahne değişimi | Bir kukla hareket eder, dekor değişir. |
| 6 | 🐱 Scratch | 4. adım: Müzik ve son | Bir ses ya da nota eklenir, hikâye baştan sona çalışır. |
| 7 | 📖 Anlatım | Sunum zamanı! 🎤 | Hikâye sınıfa sunulur; sorular ve yorum/öneri istenir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Bir hikâyenin üç parçası
Her hikâyenin üç parçası vardır:
1. **Başlangıç:** Karakterler kim, nerede?
2. **Gelişme:** Bir sorun ya da macera başlar.
3. **Sonuç:** Sorun çözülür, hikâye biter.

Bu derste kendi animasyonlu hikâye adım adım yapılacak; her adımda kod saklanır ve bir sonraki adıma taşınır.

#### Adım 2 · 🔢 Sıralama — Proje adımları
- Soru: Bir projeyi yaparken hangi sırayla çalışırız?
- Kartlar (verilen sıra): 💡 Bir fikir bul; ✏️ Kâğıda plan çiz; 🎭 Kuklaları ve dekoru seç; 🧩 Kodları yaz; 🐞 Dene ve hataları düzelt; 🎤 Arkadaşlarına sun.
- Geri bildirim: Gerçek programcılar da böyle çalışır: fikir, plan, kod, test, paylaşım!

#### Adım 3 · 🐱 Scratch — 1. adım: Sahneyi kur
- Görev: Hikâye nerede geçiyor? 🖼 Dekor listesinden bir dekor seç ve ➕ Kukla ekle ile en az bir karakter daha ekle. Her kukla 🏁 ile kendi yerine gitsin (x: y: konumuna git). Bitince ✔ Bitirdim.
- Sahne: dekor `cayir`; kukla: Kedi (-120, -60). Test sahnesinde ek olarak Robo (120, -60) ve dekor `orman` kullanılır.
- Bloklar (30 blok): 🏁 tıklandığında, bu kukla tıklanınca, tuşuna basılınca, haberini aldığımda, haberini sal, haberini sal ve bekle, adım git, derece dön (sağ/sol), süzül, yönüne dön, x’i/y’yi değiştir, sayı kadar bekle, dekoru yap, büyüklüğü yap/değiştir, renk etkisini değiştir, göster, gizle, sesi başlat, sesi bitene kadar çal, nota çal, saniye bekle, tekrarla, sürekli tekrarla, dile getir (süreli), düşün (süreli), sonraki kostüm, konumuna git. Haberler: sahne1, sahne2, son. Serbest mod ve kütüphane açık.
- Hedefler: 1) En az iki kukla olsun; 2) Kuklalar 🏁 ile yerine gitsin.
- İpucu: (kaynakta yok)
- Örnek çözüm: (aşağıdaki STORY_SOL — 2., 3. ve 4. adımlarda da aynı örnek çözüm tanımlı)
  - Kedi → [🏁 tıklandığında → dekoru orman yap → x: -120 y: -60 konumuna git → göster → “Ormanda kayboldum!” de (1 saniye) → “sahne1” haberini sal]; [“son” haberini aldığımda → 1 saniyede x: 0 y: -60 konumuna süzül → kazandın sesini başlat → “Teşekkürler!” de (1 saniye)]
  - Robo → [🏁 tıklandığında → x: 120 y: -60 konumuna git]; [“sahne1” haberini aldığımda → “Ben sana yardım ederim!” de (1 saniye) → dekoru çayır yap → “son” haberini sal]
  - Not: Bu çözüm Kedi ve Robo’yu test sahnesi ile birlikte gösteriyor.

#### Adım 4 · 🐱 Scratch — 2. adım: Konuşmalar
- Görev: Karakterler konuşsun! Biri konuşunca haber salsın, diğeri haberi alınca cevap versin. (Kod bir önceki adımdan gelir.) Bitince ✔ Bitirdim.
- Sahne: Adım 1 ile aynı (dekor `cayir`, kukla Kedi; test sahnesi: dekor `orman`, Kedi ve Robo).
- Bloklar: Adım 1 ile aynı 30 blok; haberler: sahne1, sahne2, son. Kod taşınır (keep).
- Hedefler: 1) İki kukla konuşsun; 2) Haber salma kullan; 3) “haberini aldığımda” kullan.
- İpucu: (kaynakta yok)
- Örnek çözüm: Adım 3 ile aynı.

#### Adım 5 · 🐱 Scratch — 3. adım: Hareket ve sahne değişimi
- Görev: Hikâyede bir şeyler olsun: karakterler yürüsün ya da süzülsün, sahne (dekor) değişsin. Bitince ✔ Bitirdim.
- Sahne: Adım 1 ile aynı; kod taşınır (keep).
- Bloklar: Adım 1 ile aynı 30 blok.
- Hedefler: 1) Dekor değişsin; 2) Bir kukla hareket etsin (süzül, git…).
- İpucu: (kaynakta yok)
- Örnek çözüm: Adım 3 ile aynı (dekor değişimi ve süzülme içerir).

#### Adım 6 · 🐱 Scratch — 4. adım: Müzik ve son
- Görev: Hikâyenin sonuna bir ses ya da müzik ekle ve mutlu (ya da sürprizli!) bir sonla bitir. Baştan sona 🏁 ile izle. Bitince ✔ Bitirdim.
- Sahne: Adım 1 ile aynı; kod taşınır (keep).
- Bloklar: Adım 1 ile aynı 30 blok.
- Hedefler: 1) Ses ya da nota kullan; 2) Hikâye baştan sona çalışsın (en az 3 konuşma, en az 2 kukla).
- İpucu: (kaynakta yok)
- Örnek çözüm: Adım 3 ile aynı (kazandın sesi içerir).

#### Adım 7 · 📖 Anlatım — Sunum zamanı! 🎤
- Öğrenciden istenenler: Hikâyeni arkadaşlarına göster. Sunarken şunları anlat: (1) Hikâyen ne anlatıyor? (2) En çok hangi kodla uğraştın? (3) Bir hata yaptın mı, nasıl düzelttin? 🐞
- Arkadaşlarının hikâyelerine bir güzel yorum ve bir öneri söylenir.

---

## Hafta özeti
- Bu haftada kullanılan yeni blok ve kavramlar: değişken blokları (değişkeni n yap / n değiştir), değişken değer bloğu, rastgele değer bloğu (rastgele 1 ile 6 arası vb.), rastgele konuma git, olana kadar bekle, olana kadar tekrarla, karşılaştırma koşulu (=, <), haber salma (haberini sal, haberini sal ve bekle, haberini aldığımda), dekor değiştirme, kukla gizle/göster, süzülme, kalem blokları (tümünü sil, kalemi bastır/kaldır, kalem rengi/kalınlığı), serbest mod (kütüphane).
- Toplam adım: 30 (5 anlatım, 3 test, 1 sıralama, 21 scratch)
  - Ders 1: 8 adım (1 anlatım, 1 test, 6 scratch)
  - Ders 2: 8 adım (1 anlatım, 1 test, 6 scratch)
  - Ders 3: 7 adım (1 anlatım, 1 test, 5 scratch)
  - Ders 4: 7 adım (2 anlatım, 1 sıralama, 4 scratch)
- Kaynakta “ipucu” alanı hiçbir adımda tanımlı değil.
