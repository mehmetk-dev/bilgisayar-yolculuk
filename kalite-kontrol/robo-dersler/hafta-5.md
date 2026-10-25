# Hafta 5 — Döngü, ses, algılama ve kalem

> Robo ile Kodlama · 5. hafta · 4 ders × 40 dk · Bölümler 17–20

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 17 | ♾️ Sürekli Tekrarla | Sonsuz döngü | 9 | 1 anlatım, 6 scratch, 2 test |
| 2. ders | Bölüm 18 | 🎵 Sesler ve Müzik | Ses ve nota | 8 | 1 anlatım, 6 scratch, 1 test |
| 3. ders | Bölüm 19 | 📡 Algılama: Dokunuyor mu? | Algılama + koşul | 8 | 1 anlatım, 5 scratch, 2 test |
| 4. ders | Bölüm 20 | ✏️ Kalemle Çizim | Geometri + döngü | 8 | 1 anlatım, 6 scratch, 1 test |

---

## 1. ders · Bölüm 17 — ♾️ Sürekli Tekrarla

- **Kavram:** Sonsuz döngü
- **Kısa açıklama:** Hiç durmayan döngüyle canlı sahneler yap: yüzen balıklar, seken toplar, dönen çarklar.
- **Öğrendiklerimiz:**
  - “sürekli tekrarla” içindekiler ⏹ basılana kadar durmadan tekrar eder.
  - Bir kuklanın aynı anda çalışan birden fazla betiği olabilir.
  - “kenara geldiyse sek” bloğu kuklayı sahnede tutar.
- **Öğretmen notu:** Öğrencilerden hayatta “hiç durmadan tekrar eden” şeyler bulmaları istenir (kalp atışı, gece-gündüz, saat, mevsimler). Bunlar “bitene kadar tekrar eden” şeylerle (ödev, yemek) karşılaştırılır. Ders sonunda oyunlarda neyin sürekli tekrarlandığı konuşulur.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Hiç durmayan döngü | “sürekli tekrarla” bloğu tanıtılır; döngünün ⏹ basılana kadar sürdüğü anlatılır. |
| 2 | 🐱 Scratch | Hiç durmayan balık | Balık sürekli yüzer, kenara gelince seker. |
| 3 | 🐱 Scratch | Zıp zıp top | Top 45 yönüne döner ve hem tavana hem yere çarpıp seker. |
| 4 | ❓ Test | Ne zaman durur? | “sürekli tekrarla” ne zaman durur? Doğru: ⏹ düğmesine basınca. |
| 5 | 🐱 Scratch | İki betik birden: uçan kuş | Kuş iki ayrı 🏁 betiğiyle hem kanat çırpar hem uçar. |
| 6 | 🐱 Scratch | Rüzgâr gülü | Yıldız sürekli döner ve rengini değiştirir; en az iki tam tur (720°). |
| 7 | 🐱 Scratch | Sihirli değnek | Yıldız sürekli fare imlecine gider; kediye değdirilecek. |
| 8 | ❓ Test | Oyunlarda sonsuz döngü | Hangisi sürekli tekrarla içinde olmalı? Doğru: düşmanın sürekli hareket etmesi. |
| 9 | 🐱 Scratch | ⭐ Akvaryum | Serbest görev: en az iki kukla 🏁 betiğiyle sürekli hareket eder. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Hiç durmayan döngü
Robo ile “10 kez tekrarla” öğrenilmişti. Yeni döngü “sürekli tekrarla”dır. İçindeki bloklar ⏹ düğmesine basılana kadar durmadan tekrar eder. Vantilatör örneği verilir. Çoğu oyun bu döngüyü kullanır.

#### Adım 2 · 🐱 Scratch — Hiç durmayan balık
- Görev: Balık akvaryumda sürekli yüzsün. 🏁 → sürekli tekrarla içine [adım git] ve [kenara geldiyse sek] konur.
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, tekrarla, adım git, kenara geldiyse sek, sonraki kostüm, saniye bekle
- Hedefler: 1) “sürekli tekrarla” kullan 2) Balık sağ kenara gitsin (x > 150) 3) Sonra geri dönüp sol kenara gitsin (x < -150)
- İpucu: 🏁 tıklandığında → sürekli tekrarla [8 adım git, kenara geldiyse sek]
- Örnek çözüm: Balık → [🏁 tıklandığında] → [sürekli tekrarla: 8 adım git, kenara geldiyse sek]

#### Adım 3 · 🐱 Scratch — Zıp zıp top
- Görev: Topu çapraz bir yöne çevir ve sürekli sekerek sahnede dolaşsın. Hem tavana hem yere çarpmalı.
- Sahne: dekor `beyaz`; kuklalar: Top (0, 0), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, yönüne dön, adım git, kenara geldiyse sek, ↻ derece dön
- Hedefler: 1) Top tavana çarpsın (y > 140) 2) Top yere çarpsın (y < -140) 3) “kenara geldiyse sek” kullan
- İpucu: Metinde verilen ilk ipucu: topu “45 yönüne dön” bloğuyla çapraz çevir.
- Örnek çözüm: Top → [🏁 tıklandığında] → [45 yönüne dön] → [sürekli tekrarla: 10 adım git, kenara geldiyse sek]

#### Adım 4 · ❓ Test — Ne zaman durur?
- Soru: “sürekli tekrarla” döngüsü ne zaman durur?
- Şıklar: 1) 10 turdan sonra 2) ⏹ durdur düğmesine basınca 3) Kukla kenara gelince
- Doğru cevap: 2
- Açıklama: Kendi kendine hiç durmaz. ⏹ düğmesi ya da “tümünü durdur” bloğu onu durdurur.

#### Adım 5 · 🐱 Scratch — İki betik birden: uçan kuş
- Görev: Kuş hem kanat çırpsın hem uçsun. İki ayrı betik yapılır; ikisi de 🏁 ile başlar.
- Sahne: dekor `cayir`; kuklalar: Kuş (-100, 60)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, sonraki kostüm, saniye bekle, adım git, kenara geldiyse sek
- Hedefler: 1) Kuşun iki 🏁 betiği olsun 2) Kanat çırpsın (kostüm değişsin; en az 6 kare) 3) Uçsun (yer değiştirsin)
- Örnek çözüm:
  - Betik 1: [🏁 tıklandığında] → [sürekli tekrarla: sonraki kostüm, 0.15 saniye bekle]
  - Betik 2: [🏁 tıklandığında] → [sürekli tekrarla: 5 adım git, kenara geldiyse sek]
- Not metinde: “İki betik aynı anda çalışır!”

#### Adım 6 · 🐱 Scratch — Rüzgâr gülü
- Görev: Yıldız durmadan dönsün ve rengini değiştirsin. En az iki tam tur dönmeli.
- Sahne: dekor `gece`; kuklalar: Yıldız (0, 0), boyut 200, tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, ↻ derece dön, ↺ derece dön, renk etkisini değiştir, saniye bekle
- Hedefler: 1) “sürekli tekrarla” kullan 2) İki tam tur dönsün (720°) 3) Renk değiştirsin
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [sürekli tekrarla: ↻ 10 derece dön, renk etkisini 5 değiştir]

#### Adım 7 · 🐱 Scratch — Sihirli değnek
- Görev: Yıldız fareyi takip etsin. Sürekli tekrarla içine [fare imlecine git] konur. Fare sahnede gezdirilip yıldız kediye değdirilir.
- Sahne: dekor `gece`; kuklalar: Kedi (140, -90), Yıldız (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, fare imlecine git, renk etkisini değiştir, ↻ derece dön
- Hedefler: 1) “fare imlecine git” kullan 2) “sürekli tekrarla” kullan 3) Yıldız kediye değsin ✨
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [sürekli tekrarla: fare imlecine git, renk etkisini 5 değiştir]

#### Adım 8 · ❓ Test — Oyunlarda sonsuz döngü
- Soru: Bir oyunda hangisi sürekli tekrarla içinde olmalıdır?
- Şıklar: 1) Oyunun başında bir kez “Hoş geldin” demek 2) Oyun bitince “Kazandın” demek 3) Düşmanın sürekli hareket etmesi
- Doğru cevap: 3
- Açıklama: Düşman oyun boyunca hareket eder, bu yüzden sürekli tekrarla içinde olmalı. Diğerleri bir kez olur.

#### Adım 9 · 🐱 Scratch — ⭐ Akvaryum (serbest görev)
- Görev: Kendi akvaryumunu yap. ➕ ile kukla eklenir (balık, arı, kuş…). En az iki kukla sürekli hareket etsin. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `deniz`; başlangıç kuklası: Balık (-100, 40)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, adım git, kenara geldiyse sek, ↻ derece dön, sonraki kostüm, saniye bekle, renk etkisini değiştir, yönüne dön, süzül, rastgele konuma git
- Hedefler: 1) En az iki kuklada 🏁 betiği 2) “sürekli tekrarla” kullan
- Ek: Serbest görev (`free`); kukla kütüphanesi açık (`library`). Test için Arı (60, -40) kuklası da tanımlı.
- Örnek çözüm:
  - Balık: [🏁 tıklandığında] → [sürekli tekrarla: 5 adım git, kenara geldiyse sek]
  - Arı: [🏁 tıklandığında] → [sürekli tekrarla: ↻ 5 derece dön, 4 adım git]

---

## 2. ders · Bölüm 18 — 🎵 Sesler ve Müzik

- **Kavram:** Ses ve nota
- **Kısa açıklama:** Davul çal, Do-Re-Mi söyle, “Küçük Yıldız” şarkısını programla ve klavyeni piyanoya çevir!
- **Öğrendiklerimiz:**
  - Ses blokları kuklaya ses çıkarttırır.
  - Nota bloğu bir notayı belli bir süre (vuruş) çalar.
  - Şarkı da bir algoritmadır: notalar doğru sırayla çalınmalı.
- **Öğretmen notu:** Sınıfla “alkış, alkış, dizlere vur” ritmi 4 kez tekrarlanır (döngü). Sonra notalar öğrencilerin boyuna göre dizilir (Do en kısa, İnce Do en uzun); her öğrenci kendi notasını söyler ve “Küçük Yıldız” insan piyanosuyla çalınır.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Müzik zamanı! 🎶 | Ses blokları ve nota bloğu tanıtılır; vuruşun notanın süresi olduğu anlatılır. |
| 2 | 🐱 Scratch | Davulcu | Davul 4 kez çalar; her vuruşta kostüm değişir. |
| 3 | 🐱 Scratch | Do Re Mi | Kedi sekiz notalık gamı (Do → İnce Do) sırayla çalar. |
| 4 | ❓ Test | Vuruş ne demek? | Vuruş 0.5’ten 1’e çıkarılırsa ne olur? Doğru: nota daha uzun çalar. |
| 5 | 🐱 Scratch | Küçük Yıldız şarkısı ⭐ | Şarkının iki satırı notalarla çalınır. |
| 6 | 🐱 Scratch | Klavye piyano | a, s, d tuşları Do, Re, Mi çalar. |
| 7 | 🐱 Scratch | Dans eden Robo | Robo iki betikle hem notaları sürekli çalar hem dans eder. |
| 8 | 🐱 Scratch | ⭐ Kendi şarkın | Serbest görev: en az 8 notalık kendi melodi, bir döngüyle tekrarlanır. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Müzik zamanı! 🎶
Pembe ses blokları kuklalara ses çıkarttırır (miyav, hav, davul, zil…). Nota bloğu ile şarkı çalınabilir. Notalar: Do, Re, Mi, Fa, Sol, La, Si, İnce Do. Vuruş notanın ne kadar uzun çalacağıdır: 1 vuruş, 0.5 vuruştan iki kat uzundur. Hoparlör yoksa çalınan her ses ve nota kuklanın üstünde 🔊 ♪ işaretiyle görünür.

#### Adım 2 · 🐱 Scratch — Davulcu
- Görev: 🏁 tıklanınca davul 4 kez çalsın. “davul sesini bitene kadar çal” bloğu bir döngüye konur. Her vuruşta kostüm değişirse daha eğlenceli olur.
- Sahne: dekor `sahne`; kuklalar: Davul (0, -60), boyut 150
- Bloklar: 🏁 tıklandığında, tekrarla, davul sesini başlat/bitene kadar çal, sonraki kostüm, saniye bekle
- Hedefler: 1) “tekrarla” kullan 2) Davul en az 4 kez çalsın
- Örnek çözüm: Davul → [🏁 tıklandığında] → [4 kez tekrarla: davul sesini bitene kadar çal, sonraki kostüm, 0.1 saniye bekle]

#### Adım 3 · 🐱 Scratch — Do Re Mi
- Görev: Kedi gamı çalsın: Do, Re, Mi, Fa, Sol, La, Si, İnce Do. Sekiz nota bloğu eklenir ve her birinde nota seçilir.
- Sahne: dekor `sahne`; kuklalar: Kedi (0, -60)
- Bloklar: 🏁 tıklandığında, nota çal, sus, saniye boyunca söyle, sonraki kostüm
- Hedefler: Do’dan İnce Do’ya sırayla çal 🎹
- İpucu: Nota listesinden seç: Do (60), Re (62), Mi (64), Fa (65), Sol (67), La (69), Si (71), İnce Do (72).
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [Do, Re, Mi, Fa, Sol, La, Si, İnce Do; her biri 0.5 vuruş]

#### Adım 4 · ❓ Test — Vuruş ne demek?
- Soru: Nota bloğundaki vuruş sayısını 0.5’ten 1’e çıkarırsak ne olur?
- Şıklar: 1) Nota daha uzun çalar 2) Nota daha ince çıkar 3) Nota iki kez çalar
- Doğru cevap: 1
- Açıklama: Vuruş notanın süresidir. 1 vuruş, 0.5 vuruştan iki kat uzun çalar.

#### Adım 5 · 🐱 Scratch — Küçük Yıldız şarkısı ⭐
- Görev: Şarkının iki satırı çalınacak.
  - Birinci satır: Do Do Sol Sol La La Sol (son Sol uzun: 1 vuruş)
  - İkinci satır: Fa Fa Mi Mi Re Re Do (son Do uzun: 1 vuruş)
- Sahne: dekor `gece`; kuklalar: Yıldız (0, 40), boyut 150
- Bloklar: 🏁 tıklandığında, nota çal, sus, tekrarla, saniye boyunca söyle, boyutu değiştir
- Hedefler: 1) Birinci satır: Do Do Sol Sol La La Sol 2) İkinci satır: Fa Fa Mi Mi Re Re Do
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [Do(0.5) Do(0.5) Sol(0.5) Sol(0.5) La(0.5) La(0.5) Sol(1) Fa(0.5) Fa(0.5) Mi(0.5) Mi(0.5) Re(0.5) Re(0.5) Do(1)]

#### Adım 6 · 🐱 Scratch — Klavye piyano
- Görev: Klavye piyanoya çevrilir: a tuşuna basılınca Do, s için Re, d için Mi. Sonra sahneye tıklanıp a, s, d tuşlarıyla çalınır.
- Sahne: dekor `sahne`; kuklalar: Robo (0, -60), boyut 130
- Bloklar: tuşa basılınca, nota çal, sonraki kostüm, ses
- Hedefler: 1) a, s ve d tuşları için üç betik 2) Do, Re ve Mi çalınsın
- Not: Bu adımda 🏁 bloğu kullanılmaz (`noFlag`).
- Örnek çözüm:
  - [a tuşuna basılınca] → [Do notasını 0.5 vuruş çal, sonraki kostüm]
  - [s tuşuna basılınca] → [Re notasını 0.5 vuruş çal, sonraki kostüm]
  - [d tuşuna basılınca] → [Mi notasını 0.5 vuruş çal, sonraki kostüm]

#### Adım 7 · 🐱 Scratch — Dans eden Robo
- Görev: Robo hem şarkı çalsın hem dans etsin. İki betik: biri notaları sürekli çalsın, diğeri sürekli kostüm değiştirsin.
- Sahne: dekor `sahne`; kuklalar: Robo (0, -60), boyut 130
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, tekrarla, nota çal, sonraki kostüm, saniye bekle, ↻ derece dön, ↺ derece dön
- Hedefler: 1) İki 🏁 betiği 2) En az 8 nota çalsın 3) Dans etsin (kostüm değişsin; en az 4 kare)
- Örnek çözüm:
  - Betik 1: [🏁 tıklandığında] → [sürekli tekrarla: Do, Mi, Sol, Mi (0.5’er vuruş)]
  - Betik 2: [🏁 tıklandığında] → [sürekli tekrarla: sonraki kostüm, 0.25 saniye bekle]

#### Adım 8 · 🐱 Scratch — ⭐ Kendi şarkın (serbest görev)
- Görev: Kendi melodini besteleyip çal. En az 8 nota kullan, bir döngü ile tekrar ettir. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`; kuklalar: Kedi (-80, -60), Davul (120, -60)
- Bloklar: 🏁 tıklandığında, bu kukla tıklanınca, tuşa basılınca, tekrarla, sürekli tekrarla, nota çal, sus, ses, sesi bitene kadar çal, sonraki kostüm, saniye bekle, saniye boyunca söyle
- Hedefler: 1) En az 8 nota çalınsın 2) Bir döngü kullan (tekrarla ya da sürekli tekrarla)
- Ek: Serbest görev (`free`).
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [2 kez tekrarla: Do, Re, Mi, Do]

---

## 3. ders · Bölüm 19 — 📡 Algılama: Dokunuyor mu?

- **Kavram:** Algılama + koşul
- **Kısa açıklama:** Kuklalar birbirine, duvara ya da kenara dokunduğunu anlasın. Eğer bloğuyla oyun kuralları kur!
- **Öğrendiklerimiz:**
  - Algılama blokları “evet/hayır” sorusu sorar: dokunuyor mu? tuşa basılı mı?
  - “eğer … ise” içindeki bloklar sadece cevap evet ise çalışır.
  - Koşulun sürekli kontrol edilmesi için “eğer” bloğu “sürekli tekrarla” içine konur.
- **Öğretmen notu:** Müzik çalarken öğrenciler dans eder. “Eğer müzik durursa donun!” kuralı sürekli kontrol edilir: sürekli tekrarla [eğer müzik durdu ise: don]. Sonra “eğer elin kırmızı bir şeye dokunuyorsa zıpla” gibi algılama kuralları eklenir.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklaların gözleri 👀 | Algılama blokları ve “eğer … ise” koşulu; koşulun sürekli kontrol için döngüye konması anlatılır. |
| 2 | 🐱 Scratch | Ay, kenar! | Kedi kenara değince “Ay!” der ve 180 derece döner. |
| 3 | 🐱 Scratch | Elmayı ye 🍎 | Elma kediye değince “pop” sesi çıkarır ve gizlenir. |
| 4 | ❓ Test | Neden sürekli? | Koşul neden döngü içinde? Doğru: her an kontrol edilsin diye. |
| 5 | 🐱 Scratch | Labirent 🧀 | Fare duvara değince başa döner; peynire ulaşmalı. |
| 6 | 🐱 Scratch | Yıldız avcısı | Yıldız kediye değince pop sesi çalar ve rastgele konuma gider; 3 yıldız yakalanmalı. |
| 7 | 🐱 Scratch | Tuşa basılı mı? | Roket yukarı/aşağı ok tuşuna basılıysa hareket eder; yıldıza uçmalı. |
| 8 | ❓ Test | Doğru koşul | Lava koşulu hangi betikle doğru kurulur? Doğru: sürekli tekrarla içinde eğer. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklaların gözleri 👀
Robo’nun sensörleri vardı; Scratch kuklalarının da var. Algılama bloklarıyla kukla şunları sorabilir: “Kenara dokunuyor muyum?”, “Elmaya dokunuyor muyum?”, “Ok tuşuna basılı mı?”. Cevaba göre “eğer … ise” bloğu karar verir. Bu koşulu sürekli kontrol etmek için “eğer”, “sürekli tekrarla” içine konur.

#### Adım 2 · 🐱 Scratch — Ay, kenar!
- Görev: Kedi sürekli yürüsün. Eğer kenara dokunuyorsa “Ay!” desin ve arkasını dönsün (180 derece).
- Sahne: dekor `cayir`; kuklalar: Kedi (0, -60)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, adım git, ↻ derece dön, 0.5 saniye boyunca söyle
- Koşul: “kenara dokunuyor mu?” (hazır gelir; başka kukla da seçilebilir)
- Hedefler: 1) “eğer … ise” kullan 2) Kenara değince “Ay!” desin 3) Arkasını dönüp geri yürüsün
- İpucu: 🏁 → sürekli tekrarla [10 adım git, eğer kenara dokunuyor mu? ise (“Ay!” de 0.5 saniye, ↻ 180 derece dön)]
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [sürekli tekrarla: 10 adım git; eğer kenara dokunuyor mu? ise → (“Ay!” de 0.5 saniye, ↻ 180 derece dön)]

#### Adım 3 · 🐱 Scratch — Elmayı ye 🍎
- Görev: Kedinin ok tuşlarıyla yürüme kodu hazırdır. Öğrenci elmanın kodunu yazar: elma sürekli kontrol etsin; eğer kediye dokunuyorsa “pop” sesi çalsın ve gizlensin. Sonra kedi elmaya götürülür.
- Sahne: dekor `cayir`; kuklalar: Elma (100, -60) (🏁 → göster), Kedi (-150, -60) (kilitli; sağ/sol/yukarı/aşağı ok ile hareket, hazır kod)
- Düzenlenecek kukla: Elma
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, gizle, göster, pop sesini başlat, saniye boyunca söyle
- Koşul: “Kedi’ye dokunuyor mu?” (varsayılan)
- Hedefler: 1) Elmada “eğer … dokunuyor mu?” kullan 2) Kedi elmayı yesin (elma kaybolsun)
- Örnek çözüm: Elma → [🏁 tıklandığında] → [göster] → [sürekli tekrarla: eğer Kedi’ye dokunuyor mu? ise → (pop sesini başlat, gizle)]

#### Adım 4 · ❓ Test — Neden sürekli?
- Soru: “eğer kediye dokunuyorsa” bloğunu neden sürekli tekrarla içine koyduk?
- Şıklar: 1) Koşul sadece bir kez kontrol edilsin diye 2) Elma daha hızlı olsun diye 3) Koşul her an kontrol edilsin, kedi ne zaman gelirse anlasın diye
- Doğru cevap: 3
- Açıklama: Döngü olmasaydı elma sadece 🏁 anında bakardı; o anda kedi uzakta olduğu için hiçbir şey olmazdı.

#### Adım 5 · 🐱 Scratch — Labirent 🧀
- Görev: Fare ok tuşlarıyla hareket eder (hazır kod). Öğrenci şunu yazar: eğer fare duvara dokunuyorsa başlangıca (x: -200, y: -140) dönsün. Sonra fare labirentten geçirilip peynire ulaştırılır.
- Sahne: dekor `labirent1`; kuklalar: Peynir (205, -140), Fare (-200, -140) (ok tuşu hazır kod)
- Düzenlenecek kukla: Fare
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, x: y: konumuna git, 0.5 saniye boyunca söyle, pop sesi, tuşa basılınca, x’i değiştir, y’yi değiştir
- Koşul: “duvara dokunuyor mu?” (varsayılan)
- Hedefler: 1) Duvara değince başa dönsün 2) Peynire ulaş 🧀
- Örnek çözüm: Fare → [ok tuşu hazır kodu] + [🏁 tıklandığında] → [x: -200 y: -140 konumuna git] → [sürekli tekrarla: eğer duvara dokunuyor mu? ise → (x: -200 y: -140 konumuna git)]

#### Adım 6 · 🐱 Scratch — Yıldız avcısı
- Görev: Kedi fareyi (imleci) takip ediyor (hazır kod). Öğrenci yıldızın kodunu yazar: eğer kediye dokunuyorsa pop sesi çıksın ve rastgele konuma gitsin. En az 3 yıldız yakalanmalı.
- Sahne: dekor `gece`; kuklalar: Yıldız (120, 80) (düzenlenecek), Kedi (-100, -60), boyut 70 (kilitli; fareyi takip eder)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, rastgele konuma git, pop sesini başlat, boyutu değiştir
- Koşul: “Kedi’ye dokunuyor mu?” (varsayılan)
- Hedefler: 1) “rastgele konuma git” kullan 2) 3 yıldız yakala ⭐
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [sürekli tekrarla: eğer Kedi’ye dokunuyor mu? ise → (pop sesini başlat, rastgele konuma git)]

#### Adım 7 · 🐱 Scratch — Tuşa basılı mı?
- Görev: Tuş olayları yerine koşul kullanılır; roket daha akıcı hareket eder. Roket için: sürekli tekrarla [eğer yukarı ok tuşuna basılı mı? ise y’yi 5 değiştir; eğer aşağı ok tuşuna basılı mı? ise y’yi -5 değiştir]. Roket yıldıza uçurulur.
- Sahne: dekor `uzay`; kuklalar: Yıldız (-140, 140), Roket (-140, -120), yön 0, tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, y’yi değiştir, x’i değiştir, yönüne dön
- Koşul: “yukarı ok tuşuna basılı mı?” (varsayılan)
- Hedefler: 1) “tuşuna basılı mı?” koşulunu kullan 2) Roket yıldıza ulaşsın 🚀
- Örnek çözüm: Roket → [🏁 tıklandığında] → [sürekli tekrarla: eğer yukarı ok tuşuna basılı mı? ise → (y’yi 5 değiştir); eğer aşağı ok tuşuna basılı mı? ise → (y’yi -5 değiştir)]

#### Adım 8 · ❓ Test — Doğru koşul
- Soru: Bir oyunda “karakter lava değerse oyun bitsin” istiyoruz. Hangisi doğru?
- Şıklar: 1) 🏁 tıklandığında → sürekli tekrarla [eğer lavaya dokunuyor mu? ise → tümünü durdur] 2) 🏁 tıklandığında → eğer lavaya dokunuyor mu? ise → tümünü durdur 3) 🏁 tıklandığında → tümünü durdur
- Doğru cevap: 1
- Açıklama: Koşul oyun boyunca her an kontrol edilmeli, bu yüzden sürekli tekrarla içinde olmalı.

---

## 4. ders · Bölüm 20 — ✏️ Kalemle Çizim

- **Kavram:** Geometri + döngü
- **Kısa açıklama:** Kukla yürüdükçe iz bıraksın! Kare, üçgen, yıldız ve döngülerle çiçekler çiz.
- **Öğrendiklerimiz:**
  - Kalem bastırılınca kukla yürüdüğü yerde çizgi bırakır.
  - Kare ve üçgen gibi şekillerde toplam 360 derece (bir tur) döner: kare 4 × 90, üçgen 3 × 120. Yıldızda iki tur döner: 5 × 144 = 720.
  - İç içe döngülerle karmaşık desenler kolayca çizilir.
- **Öğretmen notu:** Bir öğrenci elinde tebeşirle “kalem” olur. Sınıf ona “10 adım ileri, sağa 90 derece dön” komutlarıyla tahtada (ya da yerde) kare çizdirir. Sonra üçgen için açı tahmin edilir. 360 ÷ kenar sayısı kuralı birlikte keşfedilir.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklam bir kalem! ✏️ | Kalem blokları (bastır, kaldır, tümünü sil) tanıtılır; şekiller algoritma olarak anlatılır. |
| 2 | 🐱 Scratch | İlk çizgi | Sahne silinir, kalem bastırılır, 150 adım gidilir; bir çizgi çizilir. |
| 3 | 🐱 Scratch | Kare | 4 kez [100 adım git, ↻ 90 derece dön] ile 100’lük kare çizilir. |
| 4 | ❓ Test | Üçgenin açısı | Üçgenin her köşesinde kaç derece dönülür? Doğru: 120. |
| 5 | 🐱 Scratch | Üçgen | 3 kez [120 adım git, ↺ 120 derece dön] ile üçgen çizilir. |
| 6 | 🐱 Scratch | Renkli yıldız ⭐ | 5 kez [150 adım git, ↻ 144 derece dön] ile renkli, kalın çizgili yıldız çizilir. |
| 7 | 🐱 Scratch | Döngüyle çiçek 🌸 | İç içe döngüyle 12 kare çizilir; çiçek oluşur. |
| 8 | 🐱 Scratch | ⭐ Sanat galerisi | Serbest görev: en az 20 çizgi ve iki farklı renk. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklam bir kalem! ✏️
Yeşil kalem blokları kuklayı bir kaleme çevirir: kalemi bastır (yürüdükçe çizer), kalemi kaldır (yürür ama çizmez), tümünü sil (sahneyi temizler). Şekil çizmek için yürü ve dön: kare, üçgen, yıldız.

#### Adım 2 · 🐱 Scratch — İlk çizgi
- Görev: Önce tümünü sil, sonra kalemi bastır, sonra 150 adım git. Bir çizgi çizildi mi?
- Sahne: dekor `beyaz`; kuklalar: Kalem (-80, 0), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, x: y: konumuna git, yönüne dön
- Hedefler: 1) “kalemi bastır” kullan 2) En az 140 adımlık bir çizgi çiz
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → x: -80 y: 0 konumuna git → 90 yönüne dön → kalemi bastır → 150 adım git]

#### Adım 3 · 🐱 Scratch — Kare
- Görev: Kare için 4 kez [100 adım git, ↻ 90 derece dön]. 🏁 her basıldığında kalem aynı yerden başlar. İsteğe bağlı olarak x: 0 y: 0 konumuna gidilerek başka yerden başlanabilir.
- Sahne: dekor `beyaz`; kuklalar: Kalem (-50, 50), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini değiştir, kalem kalınlığını değiştir, saniye bekle
- Hedefler: 1) “tekrarla” kullan 2) Kenarı 100 olan bir kare çiz ⬜
- İpucu: 🏁 → tümünü sil → kalemi bastır → 4 kez tekrarla [100 adım git, ↻ 90 derece dön]
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → x: -50 y: 50 konumuna git → 90 yönüne dön → kalemi bastır → 4 kez tekrarla: (100 adım git, ↻ 90 derece dön, 0.2 saniye bekle)]

#### Adım 4 · ❓ Test — Üçgenin açısı
- Soru: Kalem, kare ya da üçgen gibi bir şekil çizerken toplam 360 derece (bir tam tur) döner. Üçgenin 3 köşesi var. Her köşede kaç derece dönmeli?
- Şıklar: 1) 60 2) 90 3) 120
- Doğru cevap: 3
- Açıklama: 360 ÷ 3 = 120. Kare için 360 ÷ 4 = 90 idi.

#### Adım 5 · 🐱 Scratch — Üçgen
- Görev: Kenarı 120 adım olan bir üçgen çiz. Kaç kez tekrar, kaç derece dönüş?
- Sahne: dekor `beyaz`; kuklalar: Kalem (-60, -50), tüm yönlerde döner
- Bloklar: (Kare adımıyla aynı blok seti)
- Hedefler: 1) “tekrarla” kullan 2) Kapalı bir üçgen çiz 🔺
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → x: -60 y: -50 konumuna git → 90 yönüne dön → kalemi bastır → 3 kez tekrarla: (120 adım git, ↺ 120 derece dön, 0.2 saniye bekle)]

#### Adım 6 · 🐱 Scratch — Renkli yıldız ⭐
- Görev: Beş köşeli yıldız için 5 kez [150 adım git, ↻ 144 derece dön]. Kalem rengi ve kalınlığı da değiştirilir.
- Açıklama (metinde): Yıldızı çizerken kalem iki tam tur döner: 2 × 360 = 720 derece. 720 ÷ 5 köşe = 144.
- Sahne: dekor `gece`; kuklalar: Kalem (-75, 20), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini değiştir, kalem kalınlığını değiştir, saniye bekle
- Hedefler: 1) Kalem rengini değiştir 2) Kalem kalınlığını değiştir 3) Beş köşeli yıldız çiz (kapalı, 5 köşe, en az 700° dönüş)
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → x: -75 y: 20 konumuna git → 90 yönüne dön → kalem rengini sarı (#ffbf00) yap → kalem kalınlığını 5 yap → kalemi bastır → 5 kez tekrarla: (150 adım git, ↻ 144 derece dön, 0.15 saniye bekle)]

#### Adım 7 · 🐱 Scratch — Döngüyle çiçek 🌸
- Görev: Bir kareyi döndüre döndüre 12 kez çizilir. İç içe döngü: 12 kez tekrarla [4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön].
- Sahne: dekor `beyaz`; kuklalar: Kalem (0, 0), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, adım git, ↻ derece dön, tekrarla (iç içe), x: y: konumuna git, yönüne dön, kalem rengini değiştir, kalem kalınlığını değiştir
- Hedefler: 1) İç içe iki “tekrarla” kullan 2) 12 kare çiz (48 çizgi)
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → x: 0 y: 0 konumuna git → 90 yönüne dön → kalem rengini pembe (#ff6fb5) yap → kalemi bastır → 12 kez tekrarla: (4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön)]

#### Adım 8 · 🐱 Scratch — ⭐ Sanat galerisi (serbest görev)
- Görev: Kendi sanat eserini çiz. Farklı renkler, kalınlıklar ve döngüler kullanılır. Kalem kaldırılıp başka bir yere gidilerek yeni bir şekil de çizilebilir. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `beyaz`; kuklalar: Kalem (0, 0), tüm yönlerde döner
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini değiştir, kalem kalınlığını değiştir, damga, saniye bekle, rastgele konuma git
- Hedefler: 1) En az 20 çizgi çiz 2) İki farklı renk kullan
- Ek: Serbest görev (`free`).
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil → kalemi bastır → 10 kez tekrarla: (kalem rengini kırmızı (#ff4d4d) yap, 80 adım git, ↻ 108 derece dön, kalem rengini mavi (#4c97ff) yap, 40 adım git, ↻ 36 derece dön)]

---

## Hafta özeti
- Bu haftada kullanılan yeni blok ve komutlar: sürekli tekrarla, kenara geldiyse sek, sonraki kostüm, yönüne dön (yön değiştirme), bu kukla tıklanınca, tuşuna basılınca (olay), 45/90 yönüne dön, ses (sesini başlat / bitene kadar çal), nota çal, sus, eğer … ise, dokunuyor mu?, tuşuna basılı mı?, fare imlecine git, rastgele konuma git, kalemi bastır / kaldır, tümünü sil, kalem rengini / kalınlığını değiştir, damga.
- Toplam adım: 33 (4 anlatım, 23 scratch, 6 test).
- Toplam ders: 4 (Bölüm 17–20).
