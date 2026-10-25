# Ek Bölümler (2/2) — Bölüm 39–44

> Robo ile Kodlama · Ek bölümler · programın dışında

## Genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| Ek ders 7 | Bölüm 39 | 🎓 Usta Robo | Hepsini birleştir | 11 | 2 anlatım, 3 test, 6 ızgara |
| Ek ders 8 | Bölüm 40 | 🎨 Dijital Sanat | Kalem + döngü + değişken | 12 | 2 anlatım, 3 test, 7 scratch |
| Ek ders 9 | Bölüm 41 | 🐝 Oyun 8: Kovalamaca | Takip eden düşman | 11 | 1 anlatım, 3 test, 7 scratch |
| Ek ders 10 | Bölüm 42 | ⏱️ Kronometre ve Geri Sayım | Zaman + değişken + operatör | 12 | 1 anlatım, 3 test, 8 scratch |
| Ek ders 11 | Bölüm 43 | 🧠 Oyun 9: Bilgi Yarışması | Soru-cevap + skor + koşul | 12 | 1 anlatım, 3 test, 8 scratch |
| Ek ders 12 | Bölüm 44 | 🐠 Canlı Akvaryum | Klonlar + animasyon | 12 | 1 anlatım, 3 test, 8 scratch |

---

## Ek ders 7 · Bölüm 39 — 🎓 Usta Robo

- **Kavram:** Hepsini birleştir
- **Kısa açıklama:** Döngü, fonksiyon ve koşul bir arada! Robo'nun en kurnaz bulmacalarını çöz ve en kısa programı bul.
- **Öğrendiklerimiz:**
  - Büyük bir problemi küçük parçalara ayırırız: önce bir basamak, sonra tekrarı.
  - Döngü aynı parçayı arka arkaya, fonksiyon ise farklı yerlerde tekrar eder.
  - Koşul sayesinde tek bir program birden çok haritada çalışabilir.
- **Öğretmen notu:** Beden programı (bilgisayarsız): Yere bant ya da tebeşirle 5×5 bir ızgara çizin. Bir öğrenci "Robo" olsun. Tahtaya "3 kez tekrarla: [2 ileri, sağa dön]" yazın. Sınıf önce "bu program Robo'yu nereye götürür?" diye tahmin etsin, sonra Robo programı adım adım yürüsün. Tahminle gerçeği karşılaştırın: yanlış tahmin eden kendi hatasını bulsun (hata ayıklama). Sonra "aynı işi daha az blokla yapabilir miyiz?" diye sorun. Paylaşılan bilgisayar: Bir öğrenci "sürücü", diğeri "yol gösterici" olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Usta Robo'ya hoş geldin! 🎓 | Döngü, fonksiyon ve koşulun birlikte kullanılacağı, üç ipucunun (tahmin et, hatayı bul, kısa yaz) anlatıldığı tanıtım. |
| 2 | 🤖 Izgara | Çift basamak | Üç basamaklı merdiven; iç içe döngüyle en fazla 6 blokta çıkılır. |
| 3 | ❓ Test | Önce tahmin et! 🔮 | 2 kez [3 ileri, sağa dön] programının sonunda Robo'nun yerini tahmin etme. |
| 4 | ❓ Test | Fonksiyon ne yapar? | "Kenar" fonksiyonunun 3 kez çağrılmasından sonra Robo'nun konumu. |
| 5 | 🤖 Izgara | İki merdiven, bir parça 🧩 | Aynı merdiven iki kez çıkılır; "Basamak" fonksiyonu kullanılır; en fazla 10 blok. |
| 6 | ❓ Test | Pile ulaşır mı? | "Eğer önüm açık ise ilerle, değilse sağa dön" programının pile ulaşıp ulaşmadığı. |
| 7 | 🤖 Izgara | Hatayı bul 🐞 | Hazır programdaki bir yanlış bloğu (sağa dön → sola dön) bulup onarma; üç haritada test. |
| 8 | 🤖 Izgara | Yolu kendi bulsun | Üç labirentte tek program: pile kadar ilerle, yol seçimi yap, yıldızları al; en fazla 8 blok. |
| 9 | 🤖 Izgara | ⭐ Geri dön, anahtarı al | Geri dönüp anahtarı alma, kapıdan geçip pile gitme; en fazla 7 blok. |
| 10 | 🤖 Izgara | ⭐ Usta bulmacası | Anahtar, yıldız ve kapı içeren yılan yol; "Koridor" fonksiyonu ile en fazla 13 blok. |
| 11 | 📖 Anlatım | Usta Robo sensin! 🏅 | Planla, dene, düzelt becerilerinin özeti ve sonraki bölüme (Dijital Sanat) geçiş. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Usta Robo'ya hoş geldin! 🎓
Robo'nun komutları olan döngü 🔁, fonksiyon 🧩 ve koşul ❓ bu bölümde birlikte kullanılacak. Üç ipucu verilir: programı çalıştırmadan tahmin et, bozuk programı onar, en kısa programı bul (⭐⭐⭐ için en az blok).

#### Adım 2 · 🤖 Izgara — Çift basamak
- Görev: Bu merdivenin her basamağı aynı: 2 ileri, sola dön, 1 ileri, sağa dön. Üç basamak var. İç içe döngü kullanılabilir. En fazla 6 blok.
- Harita (yön: E/sağa bakıyor):
  ```
  ######G
  ####..*
  ##*..##
  S..####
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(2(F)LFR)`
- İpucu: Önce tek basamağı yaz: 2 kez İleri git, Sola dön, İleri git, Sağa dön. Sonra hepsini 3 kez tekrarla bloğuna koy.
- Ek: en fazla 6 blok (`max: 6`), döngü tekrar sayısı 3.

#### Adım 3 · ❓ Test — Önce tahmin et! 🔮
- Pano: 5×5 ızgara; S (başlangıç) sol alt köşede, Robo yukarı bakıyor. Kod: `2(3(F)R)`
- Soru: Robo yukarı bakıyor. Programı çalıştırmadan söyle: 2 kez [3 ileri, sağa dön] bitince Robo nerede olur?
- Şıklar: Başladığı karede / 3 kare yukarıda ve 3 kare sağda / 6 kare yukarıda
- Doğru cevap: 3 kare yukarıda ve 3 kare sağda
- Açıklama: İlk turda 3 kare yukarı çıkıp sağa dönüyor. İkinci turda 3 kare sağa gidip tekrar dönüyor. Yani 3 yukarı, 3 sağ.

#### Adım 4 · ❓ Test — Fonksiyon ne yapar?
- Kod: Kenar fonksiyonu = `FFR`; program: 3 kez Kenar.
- Soru: Kenar fonksiyonu: 2 ileri, sağa dön. Robo doğuya (sağa) bakıyor ve program 3 kez Kenar çağırıyor. Robo nerede olur?
- Şıklar: Başladığı karede, doğuya bakarak / Başladığı yerden 6 kare ileride / Başladığı yerden 2 kare aşağıda, yukarı bakarak
- Doğru cevap: Başladığı yerden 2 kare aşağıda, yukarı bakarak
- Açıklama: Robo bir kare çiziyor ama sadece üç kenarını yürüdü: 2 sağa, 2 aşağı, 2 sola. Başladığı yerin 2 kare aşağısında ve yukarı bakıyor.

#### Adım 5 · 🤖 Izgara — İki merdiven, bir parça 🧩
- Görev: Bu yolda aynı merdiven iki kez çıkılıyor, arada 2 kare düz yol var. Basamağı Basamak fonksiyonuna koy (ileri, sola dön, ileri, sağa dön). En fazla 10 blok; fonksiyondaki bloklar da sayılır.
- Harita (yön: E/sağa bakıyor):
  ```
  ########G
  #######.*
  ######..#
  ###....##
  ##*.#####
  #..######
  S.#######
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop), Fonksiyon (fn; adı Basamak)
- Örnek çözüm: `3(f)2(F)3(f)`; Basamak = `FLFR`
- İpucu: Basamak = İleri git, Sola dön, İleri git, Sağa dön. Programım: 3 kez Basamak, 2 kez İleri git, yine 3 kez Basamak.
- Ek: en fazla 10 blok (`max: 10`), döngü tekrar sayısı 3.

#### Adım 6 · ❓ Test — Pile ulaşır mı?
- Pano: `S..` / `##.` / `##G`; kod: `5(e{open}(F)(R))`
- Soru: Program: 5 kez [eğer önüm açık ise İleri git, değilse Sağa dön]. Robo pile ulaşır mı?
- Şıklar: Evet, pile ulaşır / Hayır, ağaca çarpar / Hayır, suya düşer
- Doğru cevap: Evet, pile ulaşır
- Açıklama: Robo önü açıkken ilerliyor, yol sonlanınca sağa dönüyor. Haritada yol tam bu şekilde kıvrılıyor.

#### Adım 7 · 🤖 Izgara — Hatayı bul 🐞
- Görev: Bu program üç haritada da yukarı (sola) kıvrılan yolları geçmek için yazılmış. Ama Robo pile ulaşamıyor! Bir blok yanlış. Programı çalıştır, haritaları tek tek dene ve onar.
- Haritalar (üçü de yön: E/sağa bakıyor):
  ```
  Harita 1        Harita 2     Harita 3
  ##G             #G           ###G
  ##.             #.           ###.
  ##.             #.           S...
  S..             #.
                  S.
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop), Eğer (if); koşullar: engel, açık, yıldız
- Hazır program (preset): `5(i{blocked}(R)F)`
- Örnek çözüm: `5(i{blocked}(L)F)`
- İpucu: Yol hep yukarı (sola) kıvrılıyor ama programda engel görünce sağa dönülüyor. Sağa dön bloğunu silip Sola dön koy.
- Ek: döngü tekrar sayısı 5, hazır program (`preset`) verilmiş.

#### Adım 8 · 🤖 Izgara — Yolu kendi bulsun
- Görev: Üç labirentte yollar farklı yerlerde sağa ya da sola kıvrılıyor ve yıldızlar yolda. Tek bir program yaz: pile ulaşana kadar önü açıksa ilerle; değilse solu açıksa sola, değilse sağa dön; yıldızın üstündeysen al. En fazla 8 blok.
- Haritalar (üçü de yön: E/sağa bakıyor):
  ```
  Harita 1     Harita 2     Harita 3
  S.*.#        ###G         S.*#
  ###.#        ###*         ##.G
  ###*G        S*..
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Yıldızı al (P), Kadar tekrarla (until), Eğer (if), Eğer…değilse (ife); koşullar: pil, açık, sol açık, yıldız, engel
- Örnek çözüm: `u{goal}(e{open}(F)(e{left}(L)(R))i{star}(P))`
- İpucu: Pile ulaşana kadar tekrarla [eğer önüm açık ise İleri git, değilse (eğer solum açık ise Sola dön, değilse Sağa dön); sonra eğer yıldızın üstündeysem Yıldızı al].
- Ek: en fazla 8 blok (`max: 8`), seçim modu (`pick`) açık, `ifCond: open`.

#### Adım 9 · 🤖 Izgara — ⭐ Geri dön, anahtarı al
- Görev: Robo bu sefer yanlış tarafa bakıyor! Önce arkasındaki 🔑 anahtarı almalı, sonra dönüp kapıdan geçerek pile gitmeli. En fazla 7 blok. Sağa dön bloğu yok: dönmek için iki kez Sola dön.
- Harita (yön: E/sağa bakıyor):
  ```
  k..S...D.G
  ```
- Araçlar: İleri git (F), Sola dön (L), Tekrarla (loop)
- Örnek çözüm: `2(2(L)3(F))6(F)`
- İpucu: İki kez Sola dön = geri dönmek. Anahtar 3 kare arkada: dön, 3 ileri git. Sonra tekrar dön ve 3 ileri git: aynı parça iki kez. Robo başladığı kareye gelince, pile 6 kare kalır.
- Ek: en fazla 7 blok (`max: 7`), döngü tekrar sayısı 2.

#### Adım 10 · 🤖 Izgara — ⭐ Usta bulmacası
- Görev: Final! Yılan gibi kıvrılan bir yol: önce 🔑 anahtar, sonra ⭐ yıldız, en sonda kapıdan geçip 🔋 pil. Uzun koridor üç kez geçiliyor; Koridor fonksiyonuna 5 kare ileriyi koy. En fazla 13 blok; fonksiyondaki bloklar da sayılır.
- Harita (yön: E/sağa bakıyor):
  ```
  S....k
  #####.
  *.....
  .#####
  ..D..G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop), Fonksiyon (fn; adı Koridor)
- Örnek çözüm: `fR2(F)RfL2(F)Lf`; Koridor = `5(F)`
- İpucu: Koridor = 5 kez İleri git. Programım: Koridor, sağa dön, 2 ileri, sağa dön, Koridor, sola dön, 2 ileri, sola dön, Koridor.
- Ek: en fazla 13 blok (`max: 13`), döngü tekrar sayısı 5.

#### Adım 11 · 📖 Anlatım — Usta Robo sensin! 🏅
Tahmin etmek, hata bulmak ve programları kısaltmak bir programcının üç büyük becerisidir: planla, dene, düzelt. Sıradaki bölümde bu bilgiler kalemle sanat yapmada kullanılacak.

---

## Ek ders 8 · Bölüm 40 — 🎨 Dijital Sanat

- **Kavram:** Kalem + döngü + değişken
- **Kısa açıklama:** Düzgün çokgenler, çiçek rozetleri, büyüyen sarmallar ve renkli desenler: kodla resim yap, sonunda kendi tablonu çiz!
- **Öğrendiklerimiz:**
  - Düzgün bir çokgende dönüş açısı 360 ÷ kenar sayısıdır: altıgen için 360 ÷ 6 = 60.
  - İç içe döngüyle bir şekli döndüre döndüre rozet ve çiçek çizebiliriz.
  - Değişken, her turda değişen bir sayıdır: kenar uzunluğunu büyütünce sarmal olur.
- **Öğretmen notu:** Yerde çokgen (bilgisayarsız): Yere bantla büyük bir çizgi çekin. Bir öğrenci "kalem" olsun, 5 adım yürüsün ve 60 derece sağa dönsün; bunu 6 kez tekrarlasın. Sınıf neye benzediğini tahmin etsin (altıgen!). Sonra 5 kenarlı şekil için açıyı sorun: 360 ÷ 5 = 72. Tahtaya "kenar sayısı × dönüş açısı = 360" yazın. Son olarak her turda adımı 1 artırarak yürüyüp sarmalı deneyin. Paylaşılan bilgisayar: Bir öğrenci "sürücü", diğeri "yol gösterici" olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kodla resim yapalım! 🎨 | Çokgen, rozet, sarmal ve kendi tablo görevlerinin tanıtımı. |
| 2 | ❓ Test | Altıgenin açısı | 360 derecenin 6 köşeye bölünmesiyle köşe açısını bulma. |
| 3 | 🐱 Scratch | Altıgen ⬡ | Altı eşit kenarlı kapalı altıgen çizme. |
| 4 | 🐱 Scratch | Çokgen makinesi ⚙️ | Köşe değişkeniyle tekrar sayısını ve dönüş açısını bağlama; beşgen, sonra sekizgen. |
| 5 | ❓ Test | Köşe arttıkça | Köşe sayısı arttıkça dönüş açısının küçüldüğünü anlama. |
| 6 | 🐱 Scratch | Beşgen rozeti 🌸 | İç içe iki döngüyle 10 beşgenli çiçek çizme. |
| 7 | ❓ Test | Sarmalın kenarı | Kenar değişkeninin her turda 5 artmasıyla 4. çizginin uzunluğu. |
| 8 | 🐱 Scratch | Büyüyen sarmal 🌀 | Kenar değişkeni her turda büyüyen 24 çizgili sarmal. |
| 9 | 🐱 Scratch | İki renkli çiçek 🌼 | Kırmızı ve mavi yapraklı, 30 derece dönen kare çiçeği. |
| 10 | 🐱 Scratch | Damga güneşi ☀️ | Damga bloğuyla 12 ışınlı güneş. |
| 11 | 🐱 Scratch | ⭐ Kendi tablom | En az 3 renk, 60 çizgi, iç içe döngü, büyüyen kenar değişkeni. |
| 12 | 📖 Anlatım | Sen bir dijital sanatçısın! 🖼️ | Açı hesabı, iç içe döngü ve değişkenin özetinin yapıldığı kapanış. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kodla resim yapalım! 🎨
20. bölümde kalemle kare ve yıldız çizilmişti. Bu kez sanatçı olunacak: düzgün çokgenler (açıyı kendin hesaplayacaksın), rozet (şekli döndüre döndüre çiçek), sarmal (kenar değişkeni her turda büyür), kendi tablo. Hatırlatma: "kalemi bastır" ile çizilir, "tümünü sil" ile sahne temizlenir.

#### Adım 2 · ❓ Test — Altıgenin açısı
- Soru: Kalem bir tam tur, yani 360 derece döner. Altıgenin 6 köşesi var. Her köşede kaç derece dönmeli?
- Şıklar: 30 / 90 / 60
- Doğru cevap: 60
- Açıklama: 360 ÷ 6 = 60. Üçgende 360 ÷ 3 = 120, karede 360 ÷ 4 = 90 idi. Aynı kural.

#### Adım 3 · 🐱 Scratch — Altıgen ⬡
- Görev: 6 kez tekrarla: [70 adım git, ↻ 60 derece dön]. Altı eşit kenarlı, kapalı bir altıgen çıkmalı.
- Sahne: dekor `beyaz`; kuklalar: Kalem (-35, 60)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap
- Hedefler: 1) "tekrarla" kullan; 2) Altı eşit kenarlı, kapalı bir altıgen çiz ⬡
- İpucu: 🏁 → tümünü sil → kalemi bastır → 6 kez tekrarla [70 adım git, ↻ 60 derece dön].
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: -35 y: 60 konumuna git] → [90 yönüne dön] → [kalemi bastır] → [6 kez tekrarla: [70 adım git], [↻ 60 derece dön]]

#### Adım 4 · 🐱 Scratch — Çokgen makinesi ⚙️
- Görev: Bu kez köşe adlı bir değişken var; şimdilik 5. Hem tekrar sayısı hem dönüş açısı köşe'ye bağlı olsun: köşe kez tekrarla [80 adım git, ↻ (360 ÷ köşe) derece dön]. Köşe 8 yapılınca sekizgen çıkmalı.
- Sahne: dekor `beyaz`, değişken köşe = 5; kuklalar: Kalem (-40, 60)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap, değişkeni yap, değişken, işlem (+ − × ÷)
- Hedefler: 1) Tekrar sayısında köşe değişkenini kullan; 2) Dönüşte 360 ÷ köşe işlemini kullan; 3) Düzgün bir beşgen çiz ⬠
- İpucu: 🏁 → … → köşe kez tekrarla [80 adım git, ↻ (360 ÷ köşe) derece dön]. Dönüş kutusuna önce işlemi seç, sonra 360 yaz ve ikinci kutuya köşe değişkenini koy.
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: -40 y: 60 konumuna git] → [90 yönüne dön] → [kalemi bastır] → [köşe kez tekrarla: [80 adım git], [↻ (360 ÷ köşe) derece dön]]

#### Adım 5 · ❓ Test — Köşe arttıkça
- Soru: Çokgenin köşe sayısı artıyor (3, 4, 5, 6…). Her köşedeki dönüş açısı ne olur?
- Şıklar: Küçülür, çünkü 360 daha çok parçaya bölünür / Büyür / Hep aynı kalır
- Doğru cevap: Küçülür, çünkü 360 daha çok parçaya bölünür
- Açıklama: Üçgen 120, kare 90, beşgen 72, altıgen 60… Köşe çoğaldıkça şekil daireye benzer.

#### Adım 6 · 🐱 Scratch — Beşgen rozeti 🌸
- Görev: 10 kez tekrarla [5 kez tekrarla [60 adım git, ↻ 72 derece dön], ↻ 36 derece dön]. İçteki döngü bir beşgen çizer; dıştaki döngü onu 36 derece çevirir (10 × 36 = 360).
- Sahne: dekor `beyaz`; kuklalar: Kalem (0, 0)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap
- Hedefler: 1) İç içe iki "tekrarla" kullan; 2) 10 beşgen çiz (50 çizgi, her köşede 72 derece); 3) Rozet yuvarlak olsun: genişlik ve yükseklik birbirine yakın
- İpucu: 🏁 → … → 10 kez tekrarla [5 kez tekrarla [60 adım git, ↻ 72 derece dön], ↻ 36 derece dön].
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [kalem rengini pembe yap] → [kalemi bastır] → [10 kez tekrarla: [5 kez tekrarla: [60 adım git], [↻ 72 derece dön]], [↻ 36 derece dön]]

#### Adım 7 · ❓ Test — Sarmalın kenarı
- Soru: Bir sarmal çiziyoruz: kenar değişkeni 5 ile başlıyor, her turda 5 artıyor. Çizilen çizgiler sırayla 5, 10, 15… uzunlukta. 4. çizgi kaç adım uzunlukta?
- Şıklar: 15 / 20 / 25
- Doğru cevap: 20
- Açıklama: 5, 10, 15, 20: dördüncü çizgi 20 adım. Değişken her turda 5 büyüdüğü için çizgiler uzuyor ve sarmal açılıyor.

#### Adım 8 · 🐱 Scratch — Büyüyen sarmal 🌀
- Görev: Kenar değişkenini 5 yap. Sonra 24 kez tekrarla: [kenar adım git, ↻ 90 derece dön, kenar değişkenini 5 değiştir].
- Sahne: dekor `beyaz`, değişken kenar = 5; kuklalar: Kalem (0, 0)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap, değişkeni yap, değişkeni değiştir, değişken
- Hedefler: 1) "kenar" değişkenini değiştir; 2) Adım sayısında "kenar" değişkenini kullan; 3) 24 çizgi çiz ve her çizgi bir öncekinden uzun olsun; 4) Çizgiler birbirine dik olsun (90 derece)
- İpucu: 🏁 → … → kenar değişkenini 5 yap → kalemi bastır → 24 kez tekrarla [(kenar) adım git, ↻ 90 derece dön, kenar değişkenini 5 değiştir].
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [kenar değişkenini 5 yap] → [kalem rengini mavi yap] → [kalemi bastır] → [24 kez tekrarla: [kenar adım git], [↻ 90 derece dön], [kenar değişkenini 5 değiştir]]

#### Adım 9 · 🐱 Scratch — İki renkli çiçek 🌼
- Görev: Yapraklar sırayla kırmızı ve mavi olsun. 6 kez tekrarla: [kalem rengini kırmızı yap, kare çiz, ↻ 30 derece dön, kalem rengini mavi yap, kare çiz, ↻ 30 derece dön]. Kare = 4 kez [60 adım git, ↻ 90 derece dön].
- Sahne: dekor `beyaz`; kuklalar: Kalem (0, 0)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap
- Hedefler: 1) Kalem rengini kırmızı ve mavi yap; 2) 12 kare çiz (48 çizgi), yarısı kırmızı yarısı mavi; 3) Kareler 30 derece dönerek çiçek olsun
- İpucu: 6 kez tekrarla [kırmızı yap, 4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön, mavi yap, 4 kez tekrarla [60 adım git, ↻ 90 derece dön], ↻ 30 derece dön].
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [kalemi bastır] → [6 kez tekrarla: [kalem rengini kırmızı yap], [4 kez tekrarla: [60 adım git], [↻ 90 derece dön]], [↻ 30 derece dön], [kalem rengini mavi yap], [4 kez tekrarla: [60 adım git], [↻ 90 derece dön]], [↻ 30 derece dön]]

#### Adım 10 · 🐱 Scratch — Damga güneşi ☀️
- Görev: Damga kuklanın bir kopyasını sahneye basar. Yıldızı merkezden 90 adım uzağa götürüp damgala, merkeze dön, biraz çevril ve tekrar et. Kalem de basılı olsun: yıldızların arasında güneş ışınları çıkar. Kalemi bastır, sonra 12 kez tekrarla: [x: 0 y: 0 konumuna git, ↻ 30 derece dön, 90 adım git, damga].
- Sahne: dekor `gece`; kuklalar: Yıldız (0, 0), büyüklük %60
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap, damga
- Hedefler: 1) "damga" ve "tekrarla" kullan; 2) 12 ışın çiz: merkezden 90 adım uzunlukta, 30 derece arayla
- İpucu: 🏁 → tümünü sil → x: 0 y: 0 konumuna git → 90 yönüne dön → kalemi bastır → 12 kez tekrarla [x: 0 y: 0 konumuna git, ↻ 30 derece dön, 90 adım git, damga].
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [kalem rengini sarı yap] → [kalemi bastır] → [12 kez tekrarla: [x: 0 y: 0 konumuna git], [↻ 30 derece dön], [90 adım git], [damga]]

#### Adım 11 · 🐱 Scratch — ⭐ Kendi tablom
- Görev: Önceki desenlerden istediğini birleştir. Tabloda en az 3 renk, en az 60 çizgi, iç içe döngü ve her turda büyüyen kenar değişkeni (kenar değişkenini 3 değiştir) olsun. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `beyaz`, değişken kenar = 10; kuklalar: Kalem (0, 0)
- Bloklar: 🏁 tıklandığında, tümünü sil, kalemi bastır, kalemi kaldır, adım git, ↻ derece dön, sol ↺ derece dön, tekrarla, x: y: konumuna git, yönüne dön, kalem rengini yap, kalem kalınlığını yap, değişkeni yap, değişkeni değiştir, damga, bekle, değişken, işlem
- Hedefler: 1) En az 3 renk kullan; 2) En az 60 çizgi çiz; 3) İç içe iki "tekrarla" kullan; 4) "kenar" değişkenini her turda değiştir
- İpucu (örnek): 12 kez tekrarla [kırmızı yap, 4 kez tekrarla [(kenar) adım git, ↻ 90 derece dön], ↻ 15 derece dön, mavi yap, 4 kez tekrarla [(kenar) adım git, ↻ 90 derece dön], sarı yap, ↻ 15 derece dön, kenar değişkenini 3 değiştir].
- Örnek çözüm: Kalem → [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [kenar değişkenini 10 yap] → [kalemi bastır] → [12 kez tekrarla: [kalem rengini kırmızı yap], [4 kez tekrarla: [kenar adım git], [↻ 90 derece dön]], [kalem rengini mavi yap], [↻ 15 derece dön], [4 kez tekrarla: [kenar adım git], [↻ 90 derece dön]], [kalem rengini sarı yap], [↻ 15 derece dön], [4 kez tekrarla: [kenar adım git], [↻ 90 derece dön]], [↻ 15 derece dön], [kenar değişkenini 3 değiştir]]

#### Adım 12 · 📖 Anlatım — Sen bir dijital sanatçısın! 🖼️
Çokgenin açısı 360 ÷ köşe sayısı ile hesaplandı, döngüler iç içe konuldu, değişkenle büyüyen sarmallar çizildi. Tablo arkadaşa gösterilir; bir sayının değiştirilmesi bambaşka bir resim yapar.

---

## Ek ders 9 · Bölüm 41 — 🐝 Oyun 8: Kovalamaca

- **Kavram:** Takip eden düşman
- **Kısa açıklama:** Kızgın bir arı Kedi'nin peşinde! Yıldızları topla, yakalanma, ne kadar dayanabildiğine bak. Arı zamanla hızlanır!
- **Öğrendiklerimiz:**
  - Bir düşman "kuklaya doğru dön" ve "adım git" blokları ile oyuncuyu kovalayabilir.
  - Oyunun zorluğu bir değişkene bağlanırsa (arının hızı) oyun zamanla zorlaşır.
  - Zamanlayıcı, oyunun ne kadar sürdüğünü ölçer; "ne kadar dayandın?" sorusunu cevaplar.
- **Öğretmen notu:** Sınıfta kovalamaca: Üç gönüllü çıksın: biri Kedi, biri Arı, biri zamanlayıcı (saniye sayar). Kâğıttan 3 yıldızı sınıfa yerleştirin. Kedi istediği yöne yürüyebilsin; Arı ise sadece kediye doğru dönüp küçük adımlarla yürüsün ("Kedi doğru dön", "1 adım git"). Arı kediye dokunursa tur biter, zamanlayıcı süreyi söyler. Sonra sorun: "Arı kediden yavaş olmasaydı oyun nasıl olurdu?" ve "Arı her 3 saniyede biraz hızlansa ne olurdu?" Zorluk ayarını konuşun (hız değişkeni!). Paylaşılan bilgisayar: Bir öğrenci "sürücü", diğeri "yol gösterici" olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Arı peşinde! 🐝 | Kedi, yıldız, arı ve zamanlayıcının rollerinin tanıtımı. |
| 2 | 🐱 Scratch | 1. adım: Kedi ok tuşlarıyla gitsin | Kedi dört yöne ok tuşlarıyla hareket eder. |
| 3 | 🐱 Scratch | 2. adım: Yıldız topla ⭐ | Yıldız rastgele yere gider, Kedi dokununca skor artar. |
| 4 | ❓ Test | Hangi blok? | Düşmanın Kedi'ye dönmesini sağlayan bloğu seçme. |
| 5 | 🐱 Scratch | 3. adım: Arı kovalasın 🐝 | Arı Kedi'ye dönüp 1.5 adım ilerler. |
| 6 | 🐱 Scratch | 4. adım: Yakalandın! 😵 | Arı kediye dokununca "Yakalandın!" der ve oyun durur. |
| 7 | ❓ Test | Adil mi? | Arının Kedi'den hızlı olmasının oyunu nasıl etkilediği. |
| 8 | 🐱 Scratch | 5. adım: Arı hızlansın ⚡ | Arının adım sayısı "hız" değişkenine bağlanır; her 3 saniyede 0.2 artar. |
| 9 | 🐱 Scratch | 6. adım: Ne kadar dayandın? ⏱️ | Yakalanma mesajına zamanlayıcı değeri eklenir. |
| 10 | ❓ Test | Zamanlayıcı | Zamanlayıcının ne zaman sıfırlandığı. |
| 11 | 🐱 Scratch | ⭐ Kendi kovalamacan | İkinci bir düşman eklenir, oyun değiştirilir; skor 3'e ulaşmalı. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Arı peşinde! 🐝
Kedi ok tuşlarıyla yönetilir. Yıldızlar rastgele çıkar, topladıkça skor artar. Arı hep Kedi'ye doğru döner ve peşinden gelir; yakalarsa oyun biter. Arı zamanla hızlanır ve zamanlayıcı ne kadar dayanıldığını söyler.

#### Adım 2 · 🐱 Scratch — 1. adım: Kedi ok tuşlarıyla gitsin
- Görev: Kedi: 🏁 → x: 0 y: 0 konumuna git → sürekli tekrarla [eğer sağ ok basılı mı? ise x'i 5 değiştir; eğer sol ok … ise x'i -5 değiştir; eğer yukarı ok … ise y'yi 5 değiştir; eğer aşağı ok … ise y'yi -5 değiştir]. Dört tane "eğer" bloğu gerekecek.
- Sahne: dekor `cayir`; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: tuşuna basılınca, 🏁 tıklandığında, sürekli tekrarla, eğer … ise, tuşa basılı mı?, x'i değiştir, y'yi değiştir, x: y: konumuna git, adım git, durdur (tümünü), değişken
- Hedefler: 1) Dört yön için dört "eğer"; 2) Kedi sağa ve yukarı gitsin
- İpucu: sürekli tekrarla [eğer (sağ ok) basılı mı? ise [x'i 5 değiştir], eğer (sol ok) … [x'i -5 değiştir], eğer (yukarı ok) … [y'yi 5 değiştir], eğer (aşağı ok) … [y'yi -5 değiştir]].
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [x: 0 y: 0 konumuna git] → [sürekli tekrarla: [eğer (sağ ok basılı mı?) ise [x'i 5 değiştir]], [eğer (sol ok basılı mı?) ise [x'i -5 değiştir]], [eğer (yukarı ok basılı mı?) ise [y'yi 5 değiştir]], [eğer (aşağı ok basılı mı?) ise [y'yi -5 değiştir]]]

#### Adım 3 · 🐱 Scratch — 2. adım: Yıldız topla ⭐
- Görev: Yıldız: 🏁 → skoru 0 yap → x: (rastgele -200 ile 200) y: (rastgele -140 ile 140) konumuna git → sürekli tekrarla [eğer Kedi'ye dokunuyorsa → skoru 1 değiştir → pop sesi → yeni rastgele konuma git]. Kedi yıldıza götürülür.
- Sahne: dekor `cayir`; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: tuşuna basılınca, 🏁 tıklandığında, sürekli tekrarla, eğer … ise, dokunuyor mu?, tuşa basılı mı?, x: y: konumuna git, rastgele konuma git, ses çal, değişkeni yap, değişkeni değiştir, rastgele, değişken
- Hedefler: 1) Yıldız rastgele konuma gitsin; 2) En az 3 yıldız topla (skor 3)
- İpucu: Yıldız: 🏁 → skoru 0 yap → rastgele konuma git → sürekli tekrarla [eğer Kedi'ye dokunuyorsa [skoru 1 değiştir, pop sesi, rastgele konuma git]].
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [skoru 0 yap] → [rastgele konuma git] → [sürekli tekrarla: [eğer Kedi'ye dokunuyorsa: [skoru 1 değiştir], [pop sesi çal], [rastgele konuma git]]]

#### Adım 4 · ❓ Test — Hangi blok?
- Soru: Arının Kedi'ye doğru dönmesini istiyoruz. Hangi bloğu kullanırız?
- Şıklar: sonraki kostüm / Kedi doğru dön / x'i 10 değiştir
- Doğru cevap: Kedi doğru dön
- Açıklama: Bu blok kuklayı seçtiğin hedefe çevirir. Kedi hareket edince Arı da yönünü yeniler; bu yüzden hep peşinden gelir.

#### Adım 5 · 🐱 Scratch — 3. adım: Arı kovalasın 🐝
- Görev: Arı: 🏁 → x: 180 y: 110 konumuna git → sürekli tekrarla [Kedi doğru dön, 1.5 adım git]. Kedi 5 adım gider, Arı 1.5 adım: Arı yavaş.
- Sahne: dekor `cayir`; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, Kedi doğru dön, adım git, x: y: konumuna git, dokunuyor mu?, rastgele, değişken
- Hedefler: 1) "Kedi doğru dön" bloğunu kullan; 2) Arı Kedi'ye ulaşsın
- İpucu: Arı: 🏁 → x: 180 y: 110 konumuna git → sürekli tekrarla [Kedi doğru dön, 1.5 adım git].
- Örnek çözüm: Arı → [🏁 tıklandığında] → [x: 180 y: 110 konumuna git] → [sürekli tekrarla: [Kedi doğru dön], [1.5 adım git]]

#### Adım 6 · 🐱 Scratch — 4. adım: Yakalandın! 😵
- Görev: Arının döngüsüne kural eklenir: eğer Kedi'ye dokunuyorsa → boing sesi → "Yakalandın!" de → tümünü durdur. Oyun oynanır: yıldızlar toplanır, ama Arı'ya yakalanılmaz.
- Sahne: dekor `cayir`; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer … ise, dokunuyor mu?, Kedi doğru dön, adım git, ses çal, de, tümünü durdur
- Hedefler: 1) Arıya "Kedi'ye dokunuyorsa" kuralı ekle; 2) Yakalanınca "Yakalandın!" desin
- İpucu: Arının döngüsüne ekle: eğer Kedi'ye dokunuyorsa [boing sesi, Yakalandın! de, tümünü durdur].
- Örnek çözüm: Arı → [🏁 tıklandığında] → [x: 180 y: 110 konumuna git] → [sürekli tekrarla: [Kedi doğru dön], [1.5 adım git], [eğer Kedi'ye dokunuyorsa: [boing sesi çal], [Yakalandın! de], [tümünü durdur]]]

#### Adım 7 · ❓ Test — Adil mi?
- Soru: Arı da Kedi gibi her turda 5 adım gitseydi ne olurdu?
- Şıklar: Oyun daha kolay olurdu / Hiçbir şey değişmezdi / Kedi kaçamaz, oyun çok zor olurdu
- Doğru cevap: Kedi kaçamaz, oyun çok zor olurdu
- Açıklama: Düşman oyuncudan hızlıysa kaçmak imkânsızlaşır. Oyun yapanlar düşmanı başta yavaş yapar, sonra yavaş yavaş hızlandırır.

#### Adım 8 · 🐱 Scratch — 5. adım: Arı hızlansın ⚡
- Görev: Arıya hız değişkenini kullan: 🏁 → hızı 1.5 yap, (hız) adım git. İkinci betik: 🏁 → sürekli tekrarla [3 saniye bekle, hızı 0.2 değiştir]. Arı sonunda Kedi kadar hızlanır.
- Sahne: dekor `cayir`; değişkenler skor = 0, hız = 1.5; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, bekle, eğer … ise, dokunuyor mu?, Kedi doğru dön, adım git, değişkeni yap, değişkeni değiştir, değişken, tümünü durdur, ses çal, de
- Hedefler: 1) Arının adım sayısı için hız değişkenini kullan; 2) Arı zamanla hızlansın
- İpucu: move bloğunun sayı kutusundan ▾ ile "değişken" → hız seç. İkinci betik: 🏁 → sürekli tekrarla [3 saniye bekle, hız değişkenini 0.2 değiştir].
- Örnek çözüm: Arı → [🏁 tıklandığında] → [hız değişkenini 1.5 yap] → [x: 180 y: 110 konumuna git] → [sürekli tekrarla: [Kedi doğru dön], [(hız) adım git], [eğer Kedi'ye dokunuyorsa: [boing sesi çal], [Yakalandın! de], [tümünü durdur]]]; ikinci betik: 🏁 → [sürekli tekrarla: [3 saniye bekle], [hız değişkenini 0.2 değiştir]]

#### Adım 9 · 🐱 Scratch — 6. adım: Ne kadar dayandın? ⏱️
- Görev: Arı yakalayınca dayanılan süre söylensin. "Yakalandın!" yazan yer değiştirilir: (birleştir "Yakalandın! Dayandığın süre: " (zamanlayıcı)) de. Zamanlayıcı 🏁'a basıldığından beri geçen saniyeyi verir.
- Sahne: dekor `cayir`; değişkenler skor = 0, hız = 1.5; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, bekle, eğer … ise, dokunuyor mu?, Kedi doğru dön, adım git, de, birleştir, zamanlayıcı, değişken
- Hedefler: 1) Zamanlayıcıyı "de" bloğunda kullan; 2) Yakalanınca "Dayandığın süre" söylensin
- İpucu: Arının yakalama kuralındaki "de" bloğunun kutusundan ▾ ile birleştir'i seç: ilk kutuya "Yakalandın! Dayandığın süre: " yaz, ikinci kutuya ▾ ile zamanlayıcıyı koy.
- Örnek çözüm: Arı → [🏁 tıklandığında] → [hız değişkenini 1.5 yap] → [sürekli tekrarla: [Kedi doğru dön], [(hız) adım git], [eğer Kedi'ye dokunuyorsa: [boing sesi çal], [(birleştir "Yakalandın! Dayandığın süre: " (zamanlayıcı)) de], [tümünü durdur]]]; ikinci betik: 🏁 → [sürekli tekrarla: [3 saniye bekle], [hız değişkenini 0.2 değiştir]]

#### Adım 10 · ❓ Test — Zamanlayıcı
- Soru: Zamanlayıcı ne zaman sıfırlanır?
- Şıklar: 🏁 tıklandığında (oyun başlarken) / Arı Kedi'yi yakalayınca / Yıldız toplayınca
- Doğru cevap: 🏁 tıklandığında (oyun başlarken)
- Açıklama: 🏁'a her bastığında zamanlayıcı sıfırdan başlar. Bu yüzden her oyun kendi süresini ölçer.

#### Adım 11 · 🐱 Scratch — ⭐ Kendi kovalamacan
- Görev: Oyunu kendine göre değiştir: ➕ ile ikinci bir düşman ekle (kuş, hayalet…) ve ona da "Kedi doğru dön" + adım git yaz. Ya da arının hızını, yıldızların sayısını değiştir. Skor 3'e ulaşmalı. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `cayir`; değişkenler skor = 0, hız = 1.5; kuklalar: Yıldız (120, 60), Arı (180, 110), Kedi (0, 0); ➕ ile kuş (-170, -100) eklenebilir
- Bloklar: önceki adımların tüm blokları ile birlikte rastgele konuma git, yönüne dön, büyüklük, büyüklüğü değiştir, sonraki kostüm, göster, gizle, koşul (karşılaştır)
- Hedefler: 1) Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla); 2) Yeni bir kukla ekle ve ona betik yaz; 3) Oyna ve skorun 3'e ulaşsın
- Örnek çözüm: Kedi (ok tuşları betiği), Yıldız (topla betiği), Arı (kovala, yakalan, hızlan, dayanılan süre betikleri), Kuş: 🏁 → x: -170 y: -100 konumuna git → [sürekli tekrarla: [Kedi doğru dön], [1 adım git]]

---

## Ek ders 10 · Bölüm 42 — ⏱️ Kronometre ve Geri Sayım

- **Kavram:** Zaman + değişken + operatör
- **Kısa açıklama:** Roket fırlatma geri sayımı, kronometre, çalar saat ve "kim daha hızlı tıklar?" tepki oyunu. Zamanı kodla ölç!
- **Öğrendiklerimiz:**
  - Bir değişken "sayaç" olarak kullanılabilir: süre 10'dan 0'a her saniye 1 azalır.
  - "Birleştir" bloğu yazı ile sayıyı yan yana koyar (Kalan: 5).
  - Zamanlayıcı geçen saniyeyi ölçer; "… olana kadar bekle" ile belli bir süreyi bekleyebiliriz.
- **Öğretmen notu:** El çırparak geri sayım: Sınıf ayağa kalksın. Öğretmen "10" desin, herkes bir kez el çırpsın; sonra "9" … sıra ile 0'a kadar sayılsın (her sayıda "süre = süre − 1" cümlesini yüksek sesle söyleyin). Sonra "Kalan: 5" cümlesini birleştirme örneği olarak tahtaya yazın ("Kalan: " + 5). Son olarak tepki oyunu: öğretmen bir kâğıdı rastgele bir anda kaldırsın, öğrenciler hemen el kaldırsın; en hızlı kalkanı birlikte seçin. Bilgisayarda zamanlayıcı bunu nasıl ölçer, konuşun.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | 10, 9, 8 … Fırlat! 🚀 | Geri sayım, birleştirme, kronometre, çalar saat ve tepki oyunu bölümlerinin tanıtımı. |
| 2 | 🐱 Scratch | 1. adım: Geri sayım | Robo, süre değişkeninden 10'a kadar geri sayar. |
| 3 | ❓ Test | Süre kaç olur? | Süre 5 iken iki kez azaltılınca değer. |
| 4 | 🐱 Scratch | 2. adım: Roket fırlasın 🚀 | Sayım bitince "Fırlat!" der, roket yukarı uçar. |
| 5 | 🐱 Scratch | 3. adım: "Kalan: 5" yazsın | Sayılar cümle içinde söylenir ("Kalan: 10", "Kalan: 9"…). |
| 6 | ❓ Test | Birleştir | "Kalan: " + süre (7) ifadesinin sonucu. |
| 7 | 🐱 Scratch | 4. adım: Kronometre ⏱️ | Zamanlayıcı sürekli gösterilir; boşluk tuşu zamanlayıcıyı sıfırlar. |
| 8 | 🐱 Scratch | 5. adım: Süre dolunca zil çal 🔔 | "… olana kadar bekle" ile süre 5'i geçince "Süre doldu!" ve zil. |
| 9 | ❓ Test | Ne zaman biter? | "… olana kadar bekle" bloğunun ne zaman tamamlandığı. |
| 10 | 🐱 Scratch | 6. adım: Tepki oyunu 1: Kedi belirsin | Kedi gizlenir, rastgele 2–5 saniye sonra belirir, zamanlayıcı sıfırlanır. |
| 11 | 🐱 Scratch | 7. adım: Tepki oyunu 2: Tıkla! | Kedi'ye tıklanınca "Tepki süren: …" yazılır. |
| 12 | 🐱 Scratch | ⭐ Kendi zaman oyunun | Yeni bir kukla ekle (fare, hayalet…) ve tepki oyununu geliştir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — 10, 9, 8 … Fırlat! 🚀
Geri sayım (süre değişkeni 10'dan 0'a), "Kalan: 5" yazıları için birleştir bloğu, boşluk tuşuyla sıfırlanan kronometre, süre dolunca çalan zil ve kuklayı ne kadar çabuk tıkladığını ölçen tepki oyunu anlatılır. Hoparlör yoksa çalan sesler yazılı görünür.

#### Adım 2 · 🐱 Scratch — 1. adım: Geri sayım
- Görev: Robo geri sayımı yapsın: 🏁 → süre değişkenini 10 yap → 10 kez tekrarla [(süre) de, 1 saniye bekle, süre değişkenini -1 değiştir]. Denemeler için 10 yerine 5 yazılabilir, bitirirken 10 yapılır.
- Sahne: dekor `uzay`, değişken süre = 10; kuklalar: Roket (0, -120), Robo (-180, 110) büyüklük %70
- Bloklar: 🏁 tıklandığında, tekrarla, de, bekle, değişkeni yap, değişkeni değiştir, sürekli tekrarla, eğer … ise, zamanlayıcı, değişken, birleştir, rastgele
- Hedefler: 1) Süre değişkenini 10 yap ve her turda azalt; 2) Robo 10'dan 1'e kadar saysın, süre 0 olsun
- İpucu: 🏁 → süreyi 10 yap → 10 kez tekrarla [(süre) de, 1 saniye bekle, süre değişkenini -1 değiştir].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [süre değişkenini 10 yap] → [10 kez tekrarla: [(süre) de], [1 saniye bekle], [süre değişkenini -1 değiştir]]

#### Adım 3 · ❓ Test — Süre kaç olur?
- Soru: süre 5 iken "süre değişkenini -1 değiştir" bloğu 2 kez çalışırsa süre kaç olur?
- Şıklar: 5 / 4 / 3
- Doğru cevap: 3
- Açıklama: Her çalışmada süre 1 azalır: 5 → 4 → 3. Geri sayım işte böyle işler.

#### Adım 4 · 🐱 Scratch — 2. adım: Roket fırlasın 🚀
- Görev: Sayım bitince Robo "Fırlat!" desin ve "fırlat" haberini salsın. Roket: fırlat haberini aldığımda → 60 kez tekrarla [y'yi 5 değiştir, sonraki kostüm] (alev yanıp sönsün).
- Sahne: dekor `uzay`, değişken süre = 10; kuklalar: Roket (0, -120), Robo (-180, 110) büyüklük %70
- Bloklar: 🏁 tıklandığında, tekrarla, de, bekle, değişkeni yap, değişkeni değiştir, fırlat haberini aldığımda, haber sal, y'yi değiştir, sonraki kostüm, ses çal, sürekli tekrarla, eğer … ise, zamanlayıcı
- Hedefler: 1) Robo "fırlat" haberini salsın; 2) Roket yukarı uçsun
- İpucu: Robo: sayımdan sonra "Fırlat!" de + fırlat haberini sal. Roket: fırlat haberini aldığımda → 60 kez tekrarla [y'yi 5 değiştir, sonraki kostüm].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [süre 10 yap] → [10 kez tekrarla: [(süre) de], [1 saniye bekle], [süre -1 değiştir]] → [Fırlat! de] → [fırlat haberini sal]; Roket → [fırlat haberini aldığımda] → [kazandın sesi çal] → [60 kez tekrarla: [y'yi 5 değiştir], [sonraki kostüm]]

#### Adım 5 · 🐱 Scratch — 3. adım: "Kalan: 5" yazsın
- Görev: Robo yalnızca sayı söylüyor. "de" bloğunun içine birleştir "Kalan: " (süre) konur. Böylece "Kalan: 10", "Kalan: 9" … diye konuşur.
- Sahne: dekor `uzay`, değişken süre = 10; kuklalar: Roket (0, -120), Robo (-180, 110) büyüklük %70
- Bloklar: 🏁 tıklandığında, tekrarla, de, bekle, değişkeni yap, değişkeni değiştir, birleştir, değişken, fırlat haberini aldığımda, haber sal, y'yi değiştir, sonraki kostüm, zamanlayıcı
- Hedefler: 1) "birleştir" bloğunu kullan; 2) Robo "Kalan: 5" desin; 3) Sayım bitince roket uçsun
- İpucu: "de" kutusundan ▾ ile birleştir'i seç. İlk kutuya "Kalan: " (iki nokta ve boşlukla) yaz, ikinci kutuya ▾ ile süre değişkenini koy.
- Örnek çözüm: Robo → [🏁 tıklandığında] → [süre 10 yap] → [10 kez tekrarla: [(birleştir "Kalan: " (süre)) de], [1 saniye bekle], [süre -1 değiştir]] → [Fırlat! de] → [fırlat haberini sal]

#### Adım 6 · ❓ Test — Birleştir
- Soru: "birleştir Kalan: süre" bloğunda süre 7 ise Robo ne der?
- Şıklar: Kalan: 7 / Kalan: süre / 7 Kalan:
- Doğru cevap: Kalan: 7
- Açıklama: Birleştir, değişkenin içindeki değeri yazıya yapıştırır: "Kalan: " + 7 = "Kalan: 7".

#### Adım 7 · 🐱 Scratch — 4. adım: Kronometre ⏱️
- Görev: Robo: 🏁 → sürekli tekrarla [(zamanlayıcı) de]. İkinci betik: boşluk tuşuna basılınca → zamanlayıcıyı sıfırla → pop sesi. Sahneye tıklayıp boşluk tuşuna basarak süre sıfırlanır.
- Sahne: dekor `uzay`; kuklalar: Robo (0, 20) büyüklük %150
- Bloklar: 🏁 tıklandığında, boşluk tuşuna basılınca, sürekli tekrarla, de, zamanlayıcıyı sıfırla, ses çal, eğer … ise, zamanlayıcı, karşılaştır
- Hedefler: 1) Zamanlayıcıyı "de" bloğunda göster; 2) "zamanlayıcıyı sıfırla" kullan; 3) Boşluk tuşu süreyi sıfırlasın
- İpucu: Betik 1: 🏁 → sürekli tekrarla [(zamanlayıcı) de]. Betik 2: boşluk tuşuna basılınca → zamanlayıcıyı sıfırla.
- Örnek çözüm: Robo → [🏁 tıklandığında] → [sürekli tekrarla: [(zamanlayıcı) de]]; [boşluk tuşuna basılınca] → [zamanlayıcıyı sıfırla] → [pop sesi çal]

#### Adım 8 · 🐱 Scratch — 5. adım: Süre dolunca zil çal 🔔
- Görev: Zil: 🏁 → (zamanlayıcı) > 5 olana kadar bekle → "Süre doldu!" de → zil sesi çal. Kronometre 5'i geçince zil çalar.
- Sahne: dekor `uzay`; kuklalar: Robo (0, 20) büyüklük %150, Zil (170, -60) büyüklük %130
- Bloklar: 🏁 tıklandığında, olana kadar bekle, de, ses çal, sürekli tekrarla, boşluk tuşuna basılınca, zamanlayıcıyı sıfırla, zamanlayıcı, karşılaştır
- Hedefler: 1) "… olana kadar bekle" bloğunu kullan; 2) Zamanlayıcı 5'i geçince "Süre doldu!" desin; 3) Zil sesi çalsın
- İpucu: Zil: 🏁 → (zamanlayıcı) > 5 olana kadar bekle → Süre doldu! de → zil sesini başlat. Koşuldaki sayıyı 5 yap.
- Örnek çözüm: Robo → [🏁 tıklandığında] → [sürekli tekrarla: [(zamanlayıcı) de]]; [boşluk tuşuna basılınca] → [zamanlayıcıyı sıfırla] → [pop sesi çal]; Zil → [🏁 tıklandığında] → [(zamanlayıcı) > 5 olana kadar bekle] → [Süre doldu! de] → [zil sesini çal]
- Not: Zil kuklasının kendi betiği ile Robo'nun kronometre betiği birlikte çalışır.

#### Adım 9 · ❓ Test — Ne zaman biter?
- Soru: "zamanlayıcı > 5 olana kadar bekle" bloğu ne zaman biter?
- Şıklar: Hemen, beklemeden / Zamanlayıcı 5'i geçince / Zamanlayıcı 0 olunca
- Doğru cevap: Zamanlayıcı 5'i geçince
- Açıklama: Koşul doğru olana kadar program bu blokta bekler. Doğru olunca bir sonraki bloğa geçer.

#### Adım 10 · 🐱 Scratch — 6. adım: Tepki oyunu 1: Kedi belirsin
- Görev: Kedi önce saklansın, rastgele bir süre sonra çıksın. Kedi: 🏁 → gizle → (rastgele 2 ile 5) saniye bekle → göster → zamanlayıcıyı sıfırla.
- Sahne: dekor `cayir`; kuklalar: Kedi (0, -10) büyüklük %150
- Bloklar: 🏁 tıklandığında, gizle, göster, bekle, rastgele, zamanlayıcıyı sıfırla, zamanlayıcı, de, karşılaştır
- Hedefler: 1) Bekleme süresi rastgele olsun; 2) Kedi önce saklansın, sonra belirsin; 3) Belirince zamanlayıcıyı sıfırla
- İpucu: 🏁 → gizle → (rastgele 2 ile 5) saniye bekle → göster → zamanlayıcıyı sıfırla. "bekle" kutusundan ▾ ile rastgele'yi seç.
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [gizle] → [(rastgele 2 ile 5) saniye bekle] → [göster] → [zamanlayıcıyı sıfırla]

#### Adım 11 · 🐱 Scratch — 7. adım: Tepki oyunu 2: Tıkla!
- Görev: Kedi çıkınca ona hemen tıkla. Kedi'ye ikinci betik: bu kukla tıklanınca → (birleştir "Tepki süren: " (zamanlayıcı)) de. Küçük sayı = hızlı tepki.
- Sahne: dekor `cayir`; kuklalar: Kedi (0, -10) büyüklük %150
- Bloklar: önceki adımın blokları ile birlikte bu kukla tıklanınca, birleştir, zamanlayıcı, de
- Hedefler: 1) Tıklama betiğinde zamanlayıcıyı kullan; 2) Tıklayınca "Tepki süren" söylensin
- İpucu: Kedi: bu kukla tıklanınca → (birleştir "Tepki süren: " (zamanlayıcı)) de. Önce 🏁'a bas, Kedi çıkınca tıkla!
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [gizle] → [(rastgele 2 ile 5) saniye bekle] → [göster] → [zamanlayıcıyı sıfırla]; [bu kukla tıklanınca] → [(birleştir "Tepki süren: " (zamanlayıcı)) de]

#### Adım 12 · 🐱 Scratch — ⭐ Kendi zaman oyunun
- Görev: Tepki oyununu geliştir: ➕ ile ikinci bir kukla (fare, hayalet…) ekle ve ona gizlen-belir-tıkla betiği yaz. Ya da bekleme süresini değiştir, kedi çıkınca ses çıksın. 🏁 ile oyna, kedini tıkla ve tepki süreni gör. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `cayir`; kuklalar: Kedi (0, -10) büyüklük %150; ➕ ile Fare (150, 100) eklenebilir
- Bloklar: önceki adımların blokları ile birlikte kuklaya git, x: y: konumuna git, büyüklük, büyüklüğü değiştir
- Hedefler: 1) Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla); 2) Yeni bir kukla ekle ve ona betik yaz; 3) Oyna: kuklaya tıkla ve tepki süreni gör
- Örnek çözüm: Fare → [🏁 tıklandığında] → [gizle] → [(rastgele 3 ile 6) saniye bekle] → [göster] → [zamanlayıcıyı sıfırla]; [bu kukla tıklanınca] → [(birleştir "Fare: " (zamanlayıcı)) de]

---

## Ek ders 11 · Bölüm 43 — 🧠 Oyun 9: Bilgi Yarışması

- **Kavram:** Soru-cevap + skor + koşul
- **Kısa açıklama:** Robo yarışma sunucusu oldu! Sana adını sorar, rastgele toplama soruları sorar, doğru cevaba puan verir ve sonunda puanına göre yorum yapar.
- **Öğrendiklerimiz:**
  - "Sor ve bekle" bloğu bir soru sorar; yazdığın cevap "cevap" bloğunda durur.
  - "Eğer … değilse" ile iki yoldan birini seçeriz: cevap doğruysa puan ver, değilse doğru cevabı söyle.
  - Rastgele sayılarla her oyun farklı olur; zamanlayıcı ile hızlı cevaba bonus verebiliriz.
- **Öğretmen notu:** Sınıf yarışması: Bir öğrenci sunucu olsun. Kâğıttan iki kutu yapın: "a" ve "b". Sunucu her tur iki kutudan rastgele sayı kartı çeksin ve "a + b kaç eder?" diye sorsun. Cevap doğruysa tahtadaki skora bir çizgi çekilir; yanlışsa sunucu doğru cevabı söyler. Beş turdan sonra sorun: "Skor 3'ten büyük mü?" Büyükse "Süper!", değilse "Bir daha dene" denir. Sonra sorun: "Bilgisayar bu işi bizden neden daha hızlı yapar?"

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Yarışma başlıyor! 🧠 | Ad sorma, rastgele toplama, doğru/yanlış kontrolü, 5 soru ve yorumun tanıtımı. |
| 2 | 🐱 Scratch | 1. adım: Tanışalım | Robo adı sorar ve "Merhaba …" diyerek selamlar. |
| 3 | ❓ Test | Birleştir ne yapar? | Birleştir bloğunun yazıları yan yana koyması. |
| 4 | 🐱 Scratch | 2. adım: Rastgele soru 🎲 | a ve b rastgele 1–10; "a + b" biçiminde soru sorulur. |
| 5 | 🐱 Scratch | 3. adım: Doğru mu? ✅ | Cevap a + b ile karşılaştırılır; doğruysa skor artar, yanlışsa doğru cevap söylenir. |
| 6 | ❓ Test | Yanlış cevap | Yanlış cevapta skorun durumu. |
| 7 | 🐱 Scratch | 4. adım: Beş soru, beş şans 🔁 | Soru bölümü 5 kez tekrarlanır. |
| 8 | 🐱 Scratch | 5. adım: Puanına göre yorum 🏆 | Puan yazılır; skor 3'ten büyükse "Süper!", değilse "Bir daha dene". |
| 9 | ❓ Test | Süper mi, değil mi? | Skor 3 iken hangi yorumun çıkacağı. |
| 10 | 🐱 Scratch | 6. adım: Çarpma turu ✖️ | Sorular 2–9 arası çarpma olur. |
| 11 | 🐱 Scratch | 7. adım: Hızlı cevap bonusu ⏱️ | Her sorudan önce zamanlayıcı sıfırlanır; 5 saniyeden kısa sürede doğru cevaba +1 bonus. |
| 12 | 🐱 Scratch | ⭐ Kendi sorunu ekle | "Türkiye'nin başkenti neresi?" sorusu eklenir; cevap "Ankara" ile kontrol edilir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Yarışma başlıyor! 🧠
Robo bir bilgi yarışması sunucusu olur. Adını sorar ve selamlar; her turda rastgele iki sayı seçip toplama sorusu sorar; cevap doğruysa skor artar, yanlışsa doğru cevabı söyler; beş soru bitince puanına göre yorum yapar. Önemli bloklar: "Adın ne? diye sor ve bekle", "cevap", "birleştir", "eğer … ise".

#### Adım 2 · 🐱 Scratch — 1. adım: Tanışalım
- Görev: 🏁 → "Adın ne?" diye sor ve bekle → (birleştir "Merhaba " (cevap)) de 2 saniye. Birleştirin ilk kutusuna "Merhaba ", ikinci kutusuna cevap konur.
- Sahne: dekor `sahne`; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: 🏁 tıklandığında, sor ve bekle, de, birleştir, cevap
- Hedefler: 1) "sor ve bekle" kullan; 2) Robo adını söyleyerek selamlasın
- İpucu: 🏁 → "Adın ne?" diye sor ve bekle → (birleştir "Merhaba " (cevap)) de 2 saniye.
- Örnek çözüm: Robo → [🏁 tıklandığında] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de, 2 saniye]

#### Adım 3 · ❓ Test — Birleştir ne yapar?
- Soru: Birinci kutuya "Merhaba ", ikinci kutuya "cevap" koydun. Oyuncu "Ayşe" yazdı. Robo ne söyler?
- Şıklar: Ayşe Merhaba / Merhaba Ayşe / Merhaba
- Doğru cevap: Merhaba Ayşe
- Açıklama: Birleştir bloğu iki parçayı yan yana yapıştırır: önce birinci kutu, sonra ikinci kutu.

#### Adım 4 · 🐱 Scratch — 2. adım: Rastgele soru 🎲
- Görev: a değişkenini (rastgele 1 ile 10) yap, b değişkenini de (rastgele 1 ile 10) yap, sonra soru sor. Soru "7 + 3" gibi görünsün: a, " + ", b. Birleştir içinde birleştir kullanılabilir: (birleştir (a) (birleştir " + " (b))).
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: 🏁 tıklandığında, sor ve bekle, de, birleştir, cevap, değişkeni yap, rastgele, değişken, işlem, zamanlayıcı
- Hedefler: 1) "rastgele" kullan; 2) Soru "a + b" gibi sorulsun (örneğin "7 + 3")
- İpucu: 🏁 → Adın ne? → Merhaba … → a = (rastgele 1 ile 10) → b = (rastgele 1 ile 10) → (birleştir (a) (birleştir " + " (b))) diye sor ve bekle.
- Örnek çözüm: Robo → [🏁 tıklandığında] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [a'yı (rastgele 1 ile 10) yap] → [b'yi (rastgele 1 ile 10) yap] → [(birleştir (a) (birleştir " + " (b))) diye sor ve bekle]

#### Adım 5 · 🐱 Scratch — 3. adım: Doğru mu? ✅
- Görev: Cevabı kontrol et: eğer cevap = (a + b) ise skoru 1 değiştir, "Doğru! 🎉" de. Değilse "Yanlış! Doğru cevap: …" de (birleştir ile a + b eklenir). 🏁'ta skor 0 yapılır.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: 🏁 tıklandığında, sor ve bekle, de, eğer … değilse, cevap, birleştir, değişkeni yap, değişkeni değiştir, işlem, rastgele, değişken
- Hedefler: 1) "eğer … değilse" kullan; 2) Cevabı (a + b) ile karşılaştır; 3) Cevaba göre doğru tepki versin: doğruysa "Doğru!" ve skor artsın; yanlışsa skor artmasın, doğru cevabı söylesin
- İpucu: a ve b'yi ayarla, sor. Sonra: eğer (cevap) = (a + b) ise [skoru 1 değiştir, Doğru! de] değilse [(birleştir "Yanlış! Doğru cevap: " (a + b)) de 2 saniye].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [a'yı (rastgele 1 ile 10) yap] → [b'yi (rastgele 1 ile 10) yap] → [(birleştir (a) (birleştir " + " (b))) diye sor ve bekle] → [eğer (cevap) = (a + b) ise: [skoru 1 değiştir], [Doğru! de], değilse: [sesi boing çal], [(birleştir "Yanlış! Doğru cevap: " (a + b)) de, 2 saniye]]

#### Adım 6 · ❓ Test — Yanlış cevap
- Soru: Oyuncu soruya yanlış cevap verdi. Skor ne olmalı?
- Şıklar: Skor 1 artmalı / Skor sıfırlanmalı / Skor aynı kalmalı
- Doğru cevap: Skor aynı kalmalı
- Açıklama: Yanlış cevapta "eğer" bloğunun içi çalışmaz, "değilse" yolu çalışır. Skora dokunulmadığı için olduğu gibi kalır.

#### Adım 7 · 🐱 Scratch — 4. adım: Beş soru, beş şans 🔁
- Görev: Soru bölümü 5 kez tekrarla içine konur: a, b, soru ve "Doğru mu?" kontrolü. Adını sorma ve skoru 0 yapma işi döngünün dışında kalır. Bir soru bilerek yanlış cevaplanır; skorun artmadığı izlenir.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: 🏁 tıklandığında, sor ve bekle, de, eğer … değilse, cevap, birleştir, değişkeni yap, değişkeni değiştir, rastgele, işlem, zamanlayıcı, değişken, karşılaştır
- Hedefler: 1) "5 kez tekrarla" kullan; 2) Beş soru sorulsun; 3) Doğru cevapta skor artsın; 4) Yanlış cevapta skor artmasın, doğru cevap söylensin
- İpucu: 🏁 → skor = 0 → Adın ne? → Merhaba … → 5 kez tekrarla [a = rastgele, b = rastgele, soru sor, eğer … değilse …].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [5 kez tekrarla: [a'yı (rastgele 1 ile 10) yap], [b'yi (rastgele 1 ile 10) yap], [(birleştir (a) (birleştir " + " (b))) diye sor ve bekle], [eğer (cevap) = (a + b) ise: [skoru 1 değiştir], [Doğru! de], değilse: [sesi boing çal], [(birleştir "Yanlış! Doğru cevap: " (a + b)) de]]]

#### Adım 8 · 🐱 Scratch — 5. adım: Puanına göre yorum 🏆
- Görev: Yarışma bitince "Puanın: …" de (birleştir + skor). Puana göre yorum: eğer skor > 3 ise "Süper! 🏆" de, değilse "Bir daha dene 💪" de.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: 🏁 tıklandığında, sor ve bekle, de, eğer … değilse, cevap, birleştir, skor, karşılaştır, ses çal, tekrarla, değişken
- Hedefler: 1) Skor 3'ten büyük mü diye baksın; 2) Sonunda "Puanın: …" desin; 3) Puana göre "Süper!" ya da "Bir daha dene" desin
- İpucu: Döngüden sonra: (birleştir "Puanın: " (skor)) de 2 saniye → eğer (skor) > 3 ise [Süper! de] değilse [Bir daha dene de].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [5 kez tekrarla: (soru turu, yukarıdaki gibi)] → [(birleştir "Puanın: " (skor)) de, 2 saniye] → [eğer (skor) > 3 ise: [sesi alkış çal], [Süper! 🏆 de], değilse: [Bir daha dene 💪 de]]

#### Adım 9 · ❓ Test — Süper mi, değil mi?
- Soru: Skor 3 olursa "eğer skor > 3 ise Süper! değilse Bir daha dene" ne söyler?
- Şıklar: Bir daha dene / Süper! / Hiçbir şey
- Doğru cevap: Bir daha dene
- Açıklama: 3, 3'ten büyük değildir; koşul doğru olmaz ve "değilse" yolu çalışır. Süper! için skorun en az 4 olması gerekir.

#### Adım 10 · 🐱 Scratch — 6. adım: Çarpma turu ✖️
- Görev: Sorular çarpma olsun. Sayılar 2 ile 9 arasında. Soru yazısında " + " yerine " × " yazılır; hem soruda hem kontrolde (a × b) kullanılır: işlem bloğunun işareti ▾ ile × yapılır.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: önceki adımdakiler ile birlikte işlem (×)
- Hedefler: 1) × işlemini kullan; 2) Sorular "a × b" gibi sorulsun; 3) Doğru cevapta skor artsın, yanlışta artmasın
- İpucu: a ve b'yi (rastgele 2 ile 9) yap. Soru: (birleştir (a) (birleştir " × " (b))). Kontrol: eğer (cevap) = (a × b) ise …
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [5 kez tekrarla: [a'yı (rastgele 2 ile 9) yap], [b'yi (rastgele 2 ile 9) yap], [(birleştir (a) (birleştir " × " (b))) diye sor ve bekle], [eğer (cevap) = (a × b) ise: [skoru 1 değiştir], [Doğru! de], değilse: [boing sesi çal], [(birleştir "Yanlış! Doğru cevap: " (a × b)) de]]] → [(birleştir "Puanın: " (skor)) de] → [eğer skor > 3 ise Süper! değilse Bir daha dene]

#### Adım 11 · 🐱 Scratch — 7. adım: Hızlı cevap bonusu ⏱️
- Görev: Her sorudan hemen önce zamanlayıcı sıfırlanır. Cevap doğruysa: eğer zamanlayıcı < 5 ise "Hızlısın! +1 bonus ⚡" de ve skor bir tane daha artar. 5 saniyeden kısa sürede doğru cevaplayan bonus kazanır.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120
- Bloklar: önceki adımdakiler ile birlikte zamanlayıcıyı sıfırla, zamanlayıcı, karşılaştır (<)
- Hedefler: 1) "zamanlayıcıyı sıfırla" kullan; 2) Zamanlayıcıyı bir koşulda kontrol et; 3) Hızlı cevapta "Hızlısın!" desin
- İpucu: 5 kez tekrarla [a, b, zamanlayıcıyı sıfırla, soru sor, eğer cevap doğruysa [skor +1, Doğru de, eğer (zamanlayıcı) < 5 ise [skor +1, Hızlısın! de]] değilse …].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → [“Adın ne?” diye sor ve bekle] → [(birleştir "Merhaba " (cevap)) de] → [5 kez tekrarla: [a'yı (rastgele 2 ile 9) yap], [b'yi (rastgele 2 ile 9) yap], [zamanlayıcıyı sıfırla], [(birleştir (a) (birleştir " × " (b))) diye sor ve bekle], [eğer (cevap) = (a × b) ise: [skoru 1 değiştir], [Doğru! de], [eğer (zamanlayıcı) < 5 ise: [skoru 1 değiştir], [Hızlısın! ⚡ de]]; değilse: [boing sesi çal], [(birleştir "Yanlış! Doğru cevap: " (a × b)) de]]] → [(birleştir "Puanın: " (skor)) de] → [eğer skor > 3 ise Süper! değilse Bir daha dene]

#### Adım 12 · 🐱 Scratch — ⭐ Kendi sorunu ekle
- Görev: Kendi sorunu ekle: "Türkiye'nin başkenti neresi?" gibi bir soru sor, cevabı eğer cevap = Ankara ile kontrol et. Büyük-küçük harf fark etmez: "ankara" da doğru sayılır. Soru turu ya da yorumlar da değiştirilebilir. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`, değişkenler a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60) büyüklük %120; ek bloklar: dekoru değiştir, konuma git, kayarak git, düşün, büyüklük
- Bloklar: önceki adımdakiler ile birlikte dekor, x: y: konumuna git, süzül, düşün, büyüklük
- Hedefler: 1) Yarışmada bir değişiklik yap; 2) En az 3 "sor ve bekle" kullan; 3) Skor tut
- Örnek çözüm: Robo → [🏁 tıklandığında] → [skor 0 yap] → (ad, 5 soruluk tur ve çarpma turu, bonus turu) → [“Türkiye'nin başkenti neresi?” diye sor ve bekle] → [eğer (cevap) = "Ankara" ise: [skoru 1 değiştir], [Doğru! 🎉 de]; değilse: [Başkent Ankara 😊 de]] → [(birleştir "Puanın: " (skor)) de] → [eğer skor > 3 ise Süper! değilse Bir daha dene]

---

## Ek ders 12 · Bölüm 44 — 🐠 Canlı Akvaryum

- **Kavram:** Klonlar + animasyon
- **Kısa açıklama:** Kendi akvaryumunu yap: balık klonları yüzsün, yüzgeçleri çırpsın, baloncuklar yükselsin, yem düşünce balıklar koşsun, gece olunca herkes yavaşlasın!
- **Öğrendiklerimiz:**
  - Klonlar sayesinde tek bir balık kuklasından bir balık sürüsü yaparız.
  - Kostümleri art arda değiştirmek (sonraki kostüm) hareket görüntüsü yaratır: yüzgeç çırpar.
  - "Haber sal" ile bir olay bütün kuklalara duyurulur: yem düştü, gece oldu!
  - İşi biten klonlar "bu klonu sil" ile silinmezse ekran dolar ve oyun yavaşlar.
- **Öğretmen notu:** Canlı akvaryum oyunu: Sınıfın ortasını "akvaryum" yapın. Birkaç öğrenci balık olsun ve yavaşça yüzsün (yürüsün); duvara gelince dönsün (kenara geldiyse sek). Bir öğrenci "baloncuk" olup yerden tavana doğru parmak uçlarında yükselsin ve tavana varınca otursun (klonu sil). Öğretmen "Yem!" desin (haber sal): bütün balıklar öğretmenin elindeki kâğıt parçasına doğru yürüsün. "Gece oldu!" deyince herkes iki kat yavaş yüzsün. Sonra sorun: "Herkes haberi nasıl duydu? Her balığa ayrı ayrı mı söyledim?"

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Akvaryum açılıyor! 🐠 | Klonlarla balık sürüsü, yüzgeç, baloncuk, yem, gece kavramlarının tanıtımı. |
| 2 | 🐱 Scratch | 1. adım: Balık sürüsü | Balık 6 klon üretir; her klon rastgele yerde doğar ve yüzer. |
| 3 | ❓ Test | Hangi blok? | Her balığın kendi başına yüzmesini başlatan bloğu seçme. |
| 4 | 🐱 Scratch | 2. adım: Yüzgeç çırpsın 🐟 | Kostüm değişimiyle yüzgeç çırpma; 6 adımda bir sonraki kostüm. |
| 5 | 🐱 Scratch | 3. adım: Baloncuklar 🫧 | Baloncuk klonları aşağıdan yukarı yükselir ve tepede silinir. |
| 6 | ❓ Test | Klonları sil! | "bu klonu sil" kullanılmazsa olacak sonuç. |
| 7 | 🐱 Scratch | 4. adım: Yem düşsün 🍤 | Fare tıklanınca yem o noktadan aşağı batar. |
| 8 | 🐱 Scratch | 5. adım: Balıklar yeme koşsun 🐠 | Yem haberi salınır; balıklar yeme doğru döner ve koşar. |
| 9 | 🐱 Scratch | 6. adım: Yem yenince kaybolsun 😋 | Balık yeme dokununca pop sesi çıkar ve yem kaybolur. |
| 10 | 🐱 Scratch | 7. adım: Gece oldu 🌙 | Boşluk tuşu gece haberi, a tuşu gündüz haberi; hız değişkeni değişir. |
| 11 | ❓ Test | Haber kimlere ulaşır? | "Haber" bütün sahneye ulaşır; ilgili betiği olan kuklalar tepki verir. |
| 12 | 🐱 Scratch | ⭐ Kendi deniz canlın | Yeni bir deniz canlısı ekle, yüzdür, kostümünü çırptır. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Akvaryum açılıyor! 🐠
Balıklar rastgele yerde doğar ve sürekli yüzer; yüzgeçleri kostüm değiştirerek çırpar; baloncuklar aşağıdan yukarı süzülür; tıklayınca yem düşer ve balıklar yeme koşar; bir tuşla gece olur ve balıklar yavaşlar. Ekranda en fazla 15 kadar klon olacaktır.

#### Adım 2 · 🐱 Scratch — 1. adım: Balık sürüsü
- Görev: Balık: 🏁 → gizle → 6 kez tekrarla [kendim klonunu oluştur]. Klon olarak başladığımda → rastgele konuma git → (rastgele -180 ile 180) yönüne dön → göster → sürekli tekrarla [3 adım git, kenara geldiyse sek].
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0) büyüklük %60
- Bloklar: 🏁 tıklandığında, gizle, 6 kez tekrarla, kendim klonunu oluştur, klon olarak başladığımda, rastgele konuma git, yönüne dön, göster, sürekli tekrarla, adım git, kenara geldiyse sek, rastgele
- Hedefler: 1) "klon olarak başladığımda" kullan; 2) 6 balık aynı anda ekranda olsun; 3) Balıklar yüzsün ve kenara gelince seksin
- İpucu: Balık betik 1: 🏁 → gizle → 6 kez tekrarla [kendim klonunu oluştur]. Betik 2: klon olarak başladığımda → rastgele konuma git → (rastgele -180 ile 180) yönüne dön → göster → sürekli tekrarla [3 adım git, kenara geldiyse sek].
- Örnek çözüm: Balık → [🏁 tıklandığında] → [gizle] → [6 kez tekrarla: [kendim klonunu oluştur]]; [klon olarak başladığımda] → [rastgele konuma git] → [(rastgele -180 ile 180) yönüne dön] → [göster] → [sürekli tekrarla: [3 adım git], [kenara geldiyse sek]]

#### Adım 3 · ❓ Test — Hangi blok?
- Soru: Akvaryumdaki her balığın kendi başına yüzmesini hangi blok başlatır?
- Şıklar: klon olarak başladığımda / bu klonu sil / dekoru gece yap
- Doğru cevap: klon olarak başladığımda
- Açıklama: Her klon doğduğunda "klon olarak başladığımda" betiğini kendi başına çalıştırır. Bu yüzden her balık ayrı bir yere, ayrı bir yöne gider.

#### Adım 4 · 🐱 Scratch — 2. adım: Yüzgeç çırpsın 🐟
- Görev: Klonun döngüsü: sürekli tekrarla [6 kez tekrarla [3 adım git, kenara geldiyse sek], sonraki kostüm]. Her 6 adımda bir yüzgeç çırpar. Balığın iki kostümü vardır.
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0) büyüklük %60
- Bloklar: klon olarak başladığımda, sürekli tekrarla, 6 kez tekrarla, adım git, kenara geldiyse sek, sonraki kostüm, göster, rastgele konuma git, yönüne dön
- Hedefler: 1) "sonraki kostüm" kullan; 2) Balıklar yüzgeç çırpsın (kostüm değiştirsin); 3) Balıklar hâlâ yüzsün
- İpucu: Klon betiğinin "sürekli tekrarla" bloğunun içi: 6 kez tekrarla [3 adım git, kenara geldiyse sek] + sonraki kostüm.
- Örnek çözüm: Balık → [🏁 tıklandığında] → [gizle] → [6 kez tekrarla: [kendim klonunu oluştur]]; [klon olarak başladığımda] → [rastgele konuma git] → [(rastgele -180 ile 180) yönüne dön] → [göster] → [sürekli tekrarla: [6 kez tekrarla: [3 adım git], [kenara geldiyse sek]], [sonraki kostüm]]

#### Adım 5 · 🐱 Scratch — 3. adım: Baloncuklar 🫧
- Görev: Baloncuk (küçük top): 🏁 → gizle → sürekli tekrarla [kendim klonunu oluştur, 0.8 saniye bekle]. Klon olarak başladığımda → x: (rastgele -210 ile 210) y: -170'e git → göster → (y > 170) olana kadar tekrarla [y'yi 4 değiştir] → bu klonu sil.
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0) büyüklük %60, Baloncuk (0, -170) büyüklük %25 (gizli)
- Bloklar: 🏁 tıklandığında, gizle, sürekli tekrarla, kendim klonunu oluştur, bekle, klon olarak başladığımda, x: y: konumuna git, göster, olana kadar tekrarla, y'yi değiştir, bu klonu sil, rastgele, karşılaştır
- Hedefler: 1) Aynı anda en az 3 baloncuk yükselsin; 2) Tepeye varan baloncuk silinsin (bu klonu sil); 3) Balıklar yüzmeye devam etsin
- İpucu: Baloncuk betik 1: 🏁 → gizle → sürekli tekrarla [kendim klonunu oluştur, 0.8 saniye bekle]. Betik 2: klon olarak başladığımda → x: (rastgele -210 ile 210) y: -170'e git → göster → (y konumu) > 170 olana kadar tekrarla [y'yi 4 değiştir] → bu klonu sil.
- Örnek çözüm: Baloncuk → [🏁 tıklandığında] → [gizle] → [sürekli tekrarla: [kendim klonunu oluştur], [0.8 saniye bekle]]; [klon olarak başladığımda] → [x: (rastgele -210 ile 210) y: -170 konumuna git] → [göster] → [(y > 170) olana kadar tekrarla: [y'yi 4 değiştir]] → [bu klonu sil]

#### Adım 6 · ❓ Test — Klonları sil!
- Soru: Baloncuk klonları tepeye ulaşınca "bu klonu sil" kullanılmazsa ne olur?
- Şıklar: Baloncuklar kendiliğinden geri iner / Hiçbir şey olmaz / Klonlar birikir, sahne kalabalıklaşır ve yavaşlar
- Doğru cevap: Klonlar birikir, sahne kalabalıklaşır ve yavaşlar
- Açıklama: Silinmeyen klonlar sahnede kalır ve sayıları sürekli artar. Bilgisayar çok çalışmak zorunda kalır. İşi biten klonu mutlaka sil.

#### Adım 7 · 🐱 Scratch — 4. adım: Yem düşsün 🍤
- Görev: Yem (sarı yıldız): 🏁 → gizle → sürekli tekrarla [eğer fare tıklandı mı? ise → fare imlecine git → göster → (kenara dokunuyor mu?) olana kadar tekrarla [y'yi -2 değiştir] → gizle]. Tıklanan yerden başlayıp yavaşça dibe batar.
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0), Baloncuk (0, -170), Yem (0, 150) büyüklük %30 (gizli)
- Bloklar: 🏁 tıklandığında, gizle, sürekli tekrarla, eğer … ise, fare tıklandı mı?, fare imlecine git, göster, olana kadar tekrarla, dokunuyor mu?, y'yi değiştir, gizle
- Hedefler: 1) "fare tıklandı mı?" koşulunu kullan; 2) Yem tıkladığın yerden başlasın; 3) Yem aşağı batsın
- İpucu: Yem: 🏁 → gizle → sürekli tekrarla [eğer (fare tıklandı mı?) ise [fare imlecine git, göster, (kenara dokunuyor mu?) olana kadar tekrarla [y'yi -2 değiştir], gizle]].
- Örnek çözüm: Yem → [🏁 tıklandığında] → [gizle] → [sürekli tekrarla: [eğer fare tıklandı mı? ise: [fare imlecine git], [göster], [(kenara dokunuyor mu?) olana kadar tekrarla: [y'yi -2 değiştir]], [gizle]]]

#### Adım 8 · 🐱 Scratch — 5. adım: Balıklar yeme koşsun 🐠
- Görev: Yem düşünce "yem" haberi salınır (yem kuklasında, göster'den sonra). Balık: yem haberini aldığımda → 80 kez tekrarla [Yem doğru dön, 5 adım git]. Balığın iki betiği aynı anda çalışır: biri yüzer, biri yeme koşar.
- Sahne: dekor `deniz`; kuklalar: Balık, Baloncuk, Yem (gizli)
- Bloklar: önceki adımdakiler ile birlikte yem haberini sal, yem haberini aldığımda, Yem doğru dön, adım git, 80 kez tekrarla
- Hedefler: 1) Yem düşünce "yem" haberini sal; 2) Balıklar yeme doğru dönsün (Yem doğru dön); 3) Bir balık yeme ulaşsın
- İpucu: Yem: … göster → yem haberini sal → … Balık: yem haberini aldığımda → 80 kez tekrarla [Yem doğru dön, 5 adım git].
- Örnek çözüm: Yem → [eğer fare tıklandı mı? ise: [fare imlecine git], [göster], [yem haberini sal], [(kenara dokunuyor mu?) olana kadar tekrarla: [y'yi -2 değiştir]], [gizle]]; Balık → [yem haberini aldığımda] → [80 kez tekrarla: [Yem doğru dön], [5 adım git]]

#### Adım 9 · 🐱 Scratch — 6. adım: Yem yenince kaybolsun 😋
- Görev: Yem dibe kadar batmasın, balık yiyince kaybolsun. Yemin döngüsünde kenara yerine Balık'a dokunana kadar tekrarla [y'yi -2 değiştir]; sonra pop sesi çal ve gizle.
- Sahne: dekor `deniz`; kuklalar: Balık, Baloncuk, Yem (gizli)
- Bloklar: önceki adımdakiler ile birlikte dokunuyor mu? (Balık), ses çal, gizle
- Hedefler: 1) Yem "Balık dokunuyor mu?" diye baksın; 2) Balık yemi yiyince pop sesi çıksın; 3) Yenen yem kaybolsun
- İpucu: Yem: … yem haberini sal → (Balık dokunuyor mu?) olana kadar tekrarla [y'yi -2 değiştir] → pop sesini başlat → gizle.
- Örnek çözüm: Yem → [eğer fare tıklandı mı? ise: [fare imlecine git], [göster], [yem haberini sal], [(Balık'a dokunuyor mu?) olana kadar tekrarla: [y'yi -2 değiştir]], [pop sesi çal], [gizle]]

#### Adım 10 · 🐱 Scratch — 7. adım: Gece oldu 🌙
- Görev: Robo akvaryumun bekçisi. Boşluk tuşuna basılınca gece haberi salınır; a tuşuna basılınca gündüz haberi salınır. Robo gece haberini alınca dekoru gece yapar ve hız değişkenini 1 yapar; gündüz haberini alınca dekoru deniz yapar ve hızı 3 yapar. Balıklar hıza göre yüzer: "3 adım git" bloğunun sayısı hız değişkeniyle değiştirilir.
- Sahne: dekor `deniz`, değişken hız = 3; kuklalar: Balık, Baloncuk, Yem, Robo (200, -125) büyüklük %55
- Bloklar: boşluk tuşuna basılınca, a tuşuna basılınca, gece/gündüz haberini sal, haberini aldığımda, dekoru gece/deniz yap, değişkeni yap, adım git, değişken, sürekli tekrarla, 6 kez tekrarla, sonraki kostüm
- Hedefler: 1) Boşluk tuşuyla "gece" haberi salınsın; 2) Gece olunca dekor değişsin; 3) Balıklar hız değişkenine göre yüzsün, gece yavaşlasın; 4) "a" tuşuyla gündüz olsun, hız geri gelsin
- İpucu: Robo: boşluk tuşuna basılınca → gece haberini sal. gece haberini aldığımda → dekoru gece yap, hız = 1. a tuşuna basılınca → gündüz haberini sal. gündüz haberini aldığımda → dekoru deniz yap, hız = 3. Balık klonunda: hız adım git.
- Örnek çözüm: Robo → [boşluk tuşuna basılınca] → [gece haberini sal]; [gece haberini aldığımda] → [dekoru gece yap] → [hız değişkenini 1 yap]; [a tuşuna basılınca] → [gündüz haberini sal]; [gündüz haberini aldığımda] → [dekoru deniz yap] → [hız değişkenini 3 yap]. Balık klonu → [klon olarak başladığımda] → [rastgele konuma git] → [yönüne dön] → [göster] → [sürekli tekrarla: [6 kez tekrarla: [(hız) adım git], [kenara geldiyse sek]], [sonraki kostüm]]

#### Adım 11 · ❓ Test — Haber kimlere ulaşır?
- Soru: Robo "gece" haberini saldı. Haberi kimler alır?
- Şıklar: Yalnızca haberi salan Robo / "gece haberini aldığımda" betiği olan bütün kuklalar / Hiçbir kukla
- Doğru cevap: "gece haberini aldığımda" betiği olan bütün kuklalar
- Açıklama: Haber bütün sahneye duyurulur. "Aldığımda" betiği olan her kukla harekete geçer; olmayanlar bir şey yapmaz.

#### Adım 12 · 🐱 Scratch — ⭐ Kendi deniz canlın
- Görev: ➕ ile sahneye kendi deniz canlını ekle (Arı, Kuş ya da Uğur böceği olabilir; denizin tuhaf bir yaratığı yap). Onu yüzdür, kostümünü çırptır, rengini ya da büyüklüğünü değiştir. İstersen yeme ya da geceye tepki versin. Klon sayısı en fazla 15 civarı olsun. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `deniz`, değişken hız = 3; kuklalar: Balık, Baloncuk, Yem, Robo; ➕ ile yeni canlı (ör. Kuş (-120, 90)) eklenebilir
- Bloklar: önceki adımdakiler ile birlikte büyüklük, büyüklüğü değiştir, renk etkisini değiştir, görsel etkileri temizle, süzül, dön (sağ/sol), söyle, diye söyle, kostüme geç
- Hedefler: 1) Akvaryumda bir değişiklik yap (yeni canlı, yeni blok ya da başka bir şey); 2) Yeni bir canlı ekle ve yüzdür; 3) Balık sürüsü yüzmeye devam etsin
- Örnek çözüm: Kuş → [🏁 tıklandığında] → [sürekli tekrarla: [2 adım git], [kenara geldiyse sek], [sonraki kostüm], [0.2 saniye bekle]]

---

## Özet (Ek bölümler 39–44)

- Bu bölümlerde kullanılan başlıca bloklar: ızgarada ileri/sola/sağa dön, tekrarla, fonksiyon, eğer / eğer…değilse, Yıldızı al; Scratch'te hareket, kalem (kalemi bastır, damga, kalem rengi), değişken (değiştir, yap), işlem ve rastgele, birleştir, sor ve bekle, zamanlayıcı, klon ve haber blokları, dokunuyor mu, tuş ve fare koşulları.
- Toplam adım: 70 (8 anlatım, 18 test, 6 ızgara, 38 scratch).
