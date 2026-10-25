# Hafta 2 — Hata ayıklama ve döngüler

> Robo ile Kodlama · 2. hafta · 4 ders × 40 dk · Bölümler 5–8

Kaynak: `src/robot/lessons/h2.js` (b5, b6, b7, b8).

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 5 | 🐞 Bug Avı: Hata Ayıklama | Hata ayıklama | 10 | 2 anlatım, 1 test, 7 ızgara |
| 2. ders | Bölüm 6 | 🔁 Tekrar Tekrar: Döngüler | Döngü (tekrar) | 13 | 2 anlatım, 3 test, 8 ızgara |
| 3. ders | Bölüm 7 | 🧶 Desenler ve İç İçe Döngüler | Desen bulma | 12 | 3 anlatım, 3 test, 6 ızgara |
| 4. ders | Bölüm 8 | 🏰 Labirent Görevi | Hepsini birleştir | 8 | 1 anlatım, 1 test, 6 ızgara |

Haftanın toplamı: 43 adım (8 anlatım, 8 test, 27 ızgara). Scratch adımı yok.

---

## 1. ders · Bölüm 5 — 🐞 Bug Avı: Hata Ayıklama

- **Kavram:** Hata ayıklama
- **Kısa açıklama:** Programlarda hata var! Robo'yu izle, hatalı komutu bul ve düzelt.
- **Öğrendiklerimiz:**
  - Programdaki hataya “bug” (böcek) denir.
  - Hatayı bulup düzeltmeye “hata ayıklama” (debug) denir.
  - Programı çalıştırıp izlemek hatayı bulmanın en iyi yoludur.
  - Bazen komutlar doğrudur ama sırası yanlıştır.
- **Öğretmen notu:** Bozuk tarif oyunu: Tahtaya kasıtlı hatalı bir algoritma yazın (ör. “Çorabı giy, ayakkabıyı giy, ayakkabıyı bağla, çorabı çıkar”). Öğrenciler hatayı bulsun ve düzeltilmiş halini söylesin. Hata yapmanın programcılığın doğal bir parçası olduğunu vurgulayın. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Programda böcek var! 🐞 | Programdaki hataya “bug” (böcek) denildiği anlatılır; güve hikâyesi. |
| 2 | 📖 Anlatım | Bug avcısı ipuçları 🔍 | Çalıştır, izle, hatalı bloğu ✖ ile sil, doğrusunu tam yere ekle ipuçları verilir. |
| 3 | 🤖 Izgara | Eksik adım | Pile 5 kare var, programda 3 İleri git var; eksik adımları bul. |
| 4 | 🤖 Izgara | Yanlış dönüş | Köşedeki yanlış sola dönüşü ↱ Sağa dön ile değiştir. |
| 5 | ❓ Test | Hangi blok hatalı? | Hatalı blok hangisi: 3. blok (Sola dön) doğru. |
| 6 | 🤖 Izgara | Neden suya düştü? | Üst sırada 4 kare gitmesi gerekirken 3 kare gidiliyor; eksik İleri git eklenir. |
| 7 | 🤖 Izgara | Fazladan bir blok | Programda fazladan bir komut var; Robo yolun dışına çıkıyor. |
| 8 | 🤖 Izgara | Sıra karışmış! | Komutlar doğru ama sıra yanlış; blokları sürükleyerek sırayı düzelt. |
| 9 | 🤖 Izgara | İki bug birden | Program iki hatalı; biri düzeltilince ikincisi ortaya çıkar. |
| 10 | 🤖 Izgara | ⭐ Bonus: Büyük bug avı | Uzun program, iki hata; yoldan çıkan yeri bul. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Programda böcek var! 🐞
Program istenen gibi çalışmayabilir; bu hataya “bug” (böcek) denir. Hikâyeye göre çok eskiden bilgisayara giren bir güve bilgisayarı bozmuş ve hatalara bu yüzden “bug” denmiş.

#### Adım 2 · 📖 Anlatım — Bug avcısı ipuçları 🔍
Sıralı ipuçları:
1. ▶ Çalıştır'a bas ve Robo'yu dikkatle izle; hangi blok çalışırken parlıyor?
2. Robo nerede yanlış yere gitti?
3. O bloğun ✖ düğmesine basıp sil. Kırmızı çizgi silinen yerde kalır.
4. Doğru komuta tıkla, tam o yere eklenir.

Ek not: Bir bloğa tıklanırsa kırmızı çizgi onun altına geçer; bloklar sürüklenerek yerleri değiştirilebilir.

#### Adım 3 · 🤖 Izgara — Eksik adım
- Görev: Robo pile ulaşamıyor! Önce ▶ Çalıştır'a basıp izle. Programda bir şey eksik.
- Harita (yön: E, sağa bakıyor):
  ```
  S....G
  ```
- Araçlar: İleri git (F)
- Hazır program (preset): `FFF`
- Örnek çözüm: `FFFFF`
- İpucu: Pile kadar 5 kare var ama programda sadece 3 İleri git var.
- Ek: —

#### Adım 4 · 🤖 Izgara — Yanlış dönüş
- Görev: Bu programda bir komut yanlış. Robo köşede yanlış yöne dönüyor! Yanlış bloğu ✖ ile sil, yerine doğrusunu koy.
- Harita (yön: E, sağa bakıyor):
  ```
  S..
  ##.
  ##G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Hazır program (preset): `FFLFF`
- Örnek çözüm: `FFRFF`
- İpucu: ↰ Sola dön bloğunu sil ve aynı yere ↱ Sağa dön ekle.
- Ek: —

#### Adım 5 · ❓ Test — Hangi blok hatalı?
- Soru: Bu programda hangi blok hatalı? (tahta ve kod resmi: `FFLFF`, harita `S.. / ##. / ##G`)
- Şıklar:
  - 1. blok (İleri git)
  - ✔ 3. blok (Sola dön)
  - 5. blok (İleri git)
- Açıklama: Köşede Robo'nun aşağı inmesi için sağa dönmesi gerek.

#### Adım 6 · 🤖 Izgara — Neden suya düştü?
- Görev: Robo suya düşüyor! 💦 Hangi adım eksik? Robo'nun nerede döndüğüne dikkat et.
- Harita (yön: N, yukarı bakıyor):
  ```
  ..*..
  .~~~.
  S~~~G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Hazır program (preset): `FFRFFFRFF`
- Örnek çözüm: `FFRFFFFRFF`
- İpucu: Üst sırada 4 kare gitmesi lazım ama 3 kare gidip dönüyor. İkinci ↱ Sağa dön bloğunun önüne bir İleri git ekle.
- Ek: —

#### Adım 7 · 🤖 Izgara — Fazladan bir blok
- Görev: Bu sefer programda fazladan bir komut var. Robo yolun dışına çıkıyor. Hangisini silmeliyiz?
- Harita (yön: E, sağa bakıyor):
  ```
  #...G
  #.###
  S*...
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Hazır program (preset): `FLFFFRFFF`
- Örnek çözüm: `FLFFRFFF`
- İpucu: Robo yukarı çıkarken 2 kare gitmeli, programda 3 tane var.
- Ek: —

#### Adım 8 · 🤖 Izgara — Sıra karışmış!
- Görev: Bu programdaki komutların hepsi doğru ama sırası yanlış! Robo anahtarı almadan kapıya gidiyor. Blokları sürükleyerek sırayı düzelt.
- Harita (yön: E, sağa bakıyor):
  ```
  k.S.DG
  ```
- Araçlar: İleri git (F), Geri git (B)
- Hazır program (preset): `FFFFFBB`
- Örnek çözüm: `BBFFFFF`
- İpucu: İki Geri git bloğunu sürükleyip programın en başına bırak.
- Ek: —

#### Adım 9 · 🤖 Izgara — İki bug birden
- Görev: Dikkat! Bu programda iki hata var. Birini düzeltince tekrar çalıştır; Robo sana ikincisini gösterecek.
- Harita (yön: E, sağa bakıyor):
  ```
  S.~~
  #.*#
  ##.G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Hazır program (preset): `FRFLFLFLFF`
- Örnek çözüm: `FRFLFRFLF`
- İpucu: Yıldızdan sonra Robo aşağı inmeli (sağa dön). Bir de en sonda fazladan bir İleri git var.
- Ek: —

#### Adım 10 · 🤖 Izgara — ⭐ Bonus: Büyük bug avı
- Görev: Uzun bir program, iki hata. Robo'yu dikkatle izle; nerede yoldan çıktığını bul.
- Harita (yön: E, sağa bakıyor):
  ```
  S.#*..
  #.#.#.
  #...#G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Hazır program (preset): `FRFFLFFRFFRFFRF`
- Örnek çözüm: `FRFFLFFLFFRFFRFF`
- İpucu: Alttaki yoldan sonra Robo yukarı (sola) dönmeli. Programın sonunda da bir İleri git eksik.
- Ek: Bonus (isteğe bağlı).

---

## 2. ders · Bölüm 6 — 🔁 Tekrar Tekrar: Döngüler

- **Kavram:** Döngü (tekrar)
- **Kısa açıklama:** Aynı komutları tekrar tekrar yazmak yerine “Tekrarla” bloğu ile kısa programlar yaz.
- **Öğrendiklerimiz:**
  - Döngü, bazı komutları belli sayıda tekrar ettirir.
  - Döngüler programı kısaltır ve okumayı kolaylaştırır.
  - Tekrar eden bir deseni bulmak, döngü kurmanın ilk adımıdır.
- **Öğretmen notu:** Dans döngüsü: Sınıfla bir dans hareketi kurun: “alkışla, zıpla, dön”. Tahtaya “3 kez tekrarla: alkışla, zıpla, dön” yazın ve hep birlikte yapın. Sonra öğrenciler kendi dans döngülerini yazsın. Scratch'teki “tekrarla” bloğu tam olarak budur. Bonus (⭐) görevler isteğe bağlıdır; süre yetmezse atlanabilir. 👀 İzle adımı: Tahtaya yansıtıp birlikte izleyin; her tur başladığında boncukları sesli sayın (“birinci tur, ikinci tur…”). “Adım adım” görevlerinde parmak 👇 sıradaki düğmeyi gösterir; öğrenci takılırsa önce tarifteki sarı satırı okutun. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Ufff, çok yoruldum! 😮‍💨 | “İleri git” tekrarı yerine 🔁 6 kez tekrarla: ⬆ İleri git denir; buna döngü denir. |
| 2 | 📖 Anlatım | Döngü tur tur çalışır | Döngünün içindeki bloklar bir tur yapar; 4(F) ile uzun hali aynı işi yapar. |
| 3 | 🤖 Izgara (👀 izle) | 👀 İzle: Döngü nasıl çalışır? | Hazır program `4(F)` izlenir; boncuklar turları gösterir. |
| 4 | ❓ Test | Kaç kare gider? | 3 kez tekrarla: ⬆ İleri git programı kaç kare ilerletir? Doğru: 3 kare. |
| 5 | 🤖 Izgara (adım adım) | Adım adım: İlk döngün | En fazla 2 blokla pile ulaşılır; 8 kare için döngü kurulur. |
| 6 | ❓ Test | Robo ne çizer? | 4 kez tekrarla: ⬆ İleri git, ↱ Sağa dön programı nasıl bir yol çizer? Doğru: bir kare. |
| 7 | 🤖 Izgara (adım adım) | Merdiven döngüsü | En fazla 5 blokla merdivendeki tekrar eden desen döngüye konur (3 basamak). |
| 8 | 🤖 Izgara (adım adım) | Döngüden sonra | Döngü dışına çıkan R ve sonraki döngüyle 4 kare + dönüş + 2 kare. |
| 9 | 🤖 Izgara | Yıldızlı zikzak | En fazla 5 blokla aşağı doğru zikzak deseni bulunur. |
| 10 | ❓ Test | Hangisi daha iyi? | Döngülü (2 blok) ve düz (6 blok) program karşılaştırılır; doğru: döngülü olan. |
| 11 | 🤖 Izgara | Büyük merdiven | Beş basamaklı merdiven; en fazla 5 blok, döngü sayısı doğru seçilir. |
| 12 | 🤖 Izgara | Bahçeyi dolaş | Köşedeki yıldızları topla ve pile git; en fazla 5 blok. |
| 13 | 🤖 Izgara | ⭐ Bonus: Merdiven ve koridor | Önce merdiven, sonra koridor; en fazla 7 blok, iki ayrı döngü. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Ufff, çok yoruldum! 😮‍💨
“İleri git” komutunu çok kez yazmak yorucudur. Bunun yerine 🔁 6 kez tekrarla: ⬆ İleri git denebilir. Buna DÖNGÜ denir.

#### Adım 2 · 📖 Anlatım — Döngü tur tur çalışır
Döngünün içindeki bloklar bir tur yapar; döngüde yazan sayı kadar tur atılır. Soldaki kısa program (`4(F)`) ile uzun hali aynı işi yapar. Robo her turun sonunda döngünün başına döner.

#### Adım 3 · 🤖 Izgara — 👀 İzle: Döngü nasıl çalışır?
- Görev: Program hazır, sadece izle. Boncuklar Robo'nun kaçıncı turda olduğunu gösterir: dolu boncuk = bitmiş tur, sarı boncuk = şimdiki tur.
- Harita (yön: E, sağa bakıyor):
  ```
  S...G
  ```
- Araçlar: İleri git (F), Tekrarla (loop)
- Hazır program (watch): `4(F)`
- Örnek çözüm: `4(F)`
- İpucu: —
- Ek: `watch` (hazır programı izleme).

#### Adım 4 · ❓ Test — Kaç kare gider?
- Soru: 🔁 3 kez tekrarla: ⬆ İleri git programı Robo'yu kaç kare ilerletir?
- Şıklar:
  - 1 kare
  - ✔ 3 kare
  - 4 kare
- Açıklama: İçindeki İleri git komutu 3 kez çalışır, Robo 3 kare gider.

#### Adım 5 · 🤖 Izgara — Adım adım: İlk döngün
- Görev: Pil çok uzakta! Ama en fazla 2 blok kullanabilirsin. Aşağıdaki adımları sırayla yap; 👇 parmak nereye basacağını gösterir.
- Harita (yön: E, sağa bakıyor):
  ```
  S.......G
  ```
- Araçlar: İleri git (F), Tekrarla (loop)
- Örnek çözüm: `8(F)`
- İpucu: —
- Ek: `tut` (adım adım yönlendirme), `max: 2`, `loopN: 2`.
  Yönlendirme metinleri (`tut`, sırayla):
  1. Tekrarla düğmesine bas. Programına boş bir döngü eklenir.
  2. İleri git düğmesine bas. Blok döngünün içine girer.
  3. Robo kaç kare gitmeli? Haritadaki kareleri say: 8. Döngüdeki sayıyı 8 yap.
  4. ▶ Çalıştır'a bas ve boncuklarla turları say!

#### Adım 6 · ❓ Test — Robo ne çizer?
- Soru: 🔁 4 kez tekrarla: ⬆ İleri git, ↱ Sağa dön programında Robo nasıl bir yol çizer?
- Şıklar:
  - Düz bir çizgi
  - Zikzak
  - ✔ Bir kare ⬜ çizip başladığı yere döner
- Açıklama: Her turda bir kenar çizip sağa döner. 4 kenar = bir kare!

#### Adım 7 · 🤖 Izgara — Merdiven döngüsü
- Görev: Merdivenin her basamağı aynı! Tekrar eden deseni bul, döngünün içine koy. En fazla 5 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  ###G
  ##.*
  #.*#
  S.##
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(FLFR)`
- İpucu: —
- Ek: `tut` (adım adım), `max: 5`, `loopN: 2`.
  Yönlendirme metinleri (`tut`, sırayla):
  1. Tekrarla düğmesine bas.
  2. Bir basamak 4 bloktur: İleri git, Sola dön, İleri git, Sağa dön. Bunlara sırayla bas; hepsi döngünün içine girer.
  3. Merdivende kaç basamak var? Say: 3. Döngünün sayısını 3 yap.
  4. ▶ Çalıştır'a bas. Her basamak bir tur!

#### Adım 8 · 🤖 Izgara — Döngüden sonra
- Görev: Bazen bir blok döngünün dışında olmalı, yani sadece 1 kez çalışmalı. Adımları sırayla yap.
- Harita (yön: E, sağa bakıyor):
  ```
  S....#
  ####.#
  ####G#
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `4(F)R2(F)`
- İpucu: —
- Ek: `tut` (adım adım), `max: 6`.
  Yönlendirme metinleri (`tut`, sırayla):
  1. Tekrarla'ya, sonra İleri git'e bas.
  2. Dönmeden önce kaç kare düz gidiyor? 4. Sayıyı 4 yap.
  3. Şimdi döngüden çıkalım: döngünün altındaki “döngü sonu ⤶” yazısına tıkla. Kırmızı çizgi döngünün altına iner.
  4. Sağa dön'e bas. Döngünün dışında olduğu için sadece 1 kez çalışır.
  5. Kalan 2 kare için yeni bir döngü: Tekrarla, içine İleri git, sayısı 2.
  6. ▶ Çalıştır'a bas.

#### Adım 9 · 🤖 Izgara — Yıldızlı zikzak
- Görev: Aşağı doğru zikzak bir yol. Deseni bul! En fazla 5 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S.##
  #*.#
  ##*.
  ###G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(FRFL)`
- İpucu: Bir parça: İleri git, Sağa dön, İleri git, Sola dön.
- Ek: `narrate` (çalışırken turları anlat), `pathHint` (yolu renklerle göster), `max: 5`.

#### Adım 10 · ❓ Test — Hangisi daha iyi?
- Soru: Bu iki program Robo'yu aynı yere götürür. Hangisi daha iyi? (kod resmi: `FFFFFF` ve `6(F)`)
- Şıklar:
  - ✔ Sağdaki, çünkü daha kısa ve okuması kolay
  - Soldaki, çünkü daha uzun
  - İkisi de çalışmaz
- Açıklama: Döngülü program 2 blok, diğeri 6 blok. Kısa programı okumak ve düzeltmek daha kolaydır.

#### Adım 11 · 🤖 Izgara — Büyük merdiven
- Görev: Beş basamaklı dev merdiven! Döngünün sayısını doğru seç. En fazla 5 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  #####G
  ####..
  ###..#
  ##..##
  #..###
  S.####
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `5(FLFR)`
- İpucu: Bir basamak yine 4 blok: İleri git, Sola dön, İleri git, Sağa dön. Kaç basamak var, say!
- Ek: `narrate`, `pathHint`, `max: 5`, `loopN: 2`.

#### Adım 12 · 🤖 Izgara — Bahçeyi dolaş
- Görev: Bahçenin köşelerindeki yıldızları topla ve pile git. Döngüden sonra bir blok daha gerekebilir. En fazla 5 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S.*
  G#.
  *.*
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(FFR)F`
- İpucu: Her kenarda: 2 kez İleri git, Sağa dön. Bunu 3 kez tekrarla, sonra döngü sonuna tıklayıp bir İleri git daha ekle.
- Ek: `narrate`, `pathHint`, `max: 5`.

#### Adım 13 · 🤖 Izgara — ⭐ Bonus: Merdiven ve koridor
- Görev: Önce merdiven, sonra koridor! İki ayrı döngü kullanabilirsin. En fazla 7 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  ###.*.G
  ##..###
  #..####
  S.#####
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(FLFR)3(F)`
- İpucu: Birinci döngü: 3 kez (İleri, Sola dön, İleri, Sağa dön). İkinci döngü: 3 kez İleri git.
- Ek: Bonus (isteğe bağlı); `narrate`, `pathHint`, `max: 7`.

---

## 3. ders · Bölüm 7 — 🧶 Desenler ve İç İçe Döngüler

- **Kavram:** Desen bulma
- **Kısa açıklama:** Tekrar eden desenleri bul, döngünün içine döngü koy ve yıldızları tek tek topla.
- **Öğrendiklerimiz:**
  - Desen, belli bir düzenle tekrar eden şeydir.
  - Bir döngünün içine başka bir döngü koyabiliriz (iç içe döngü).
  - “Yıldızı al” komutu ile Robo yıldızları kendisi toplar.
- **Öğretmen notu:** Ritim deseni: Sınıfla bir ritim yapın: “alkış, alkış, masaya vur”. Bunu 4 kez tekrarlayın. Sonra sorun: “Bu ritmin içinde başka bir tekrar var mı?” (alkış 2 kez). Bu, iç içe döngüdür: 4 kez tekrarla [2 kez alkışla, masaya vur]. Tahtaya iki sıra boncuk çizin: üst sıra dış döngü (4 boncuk), alt sıra iç döngü (2 boncuk). Her masaya vuruşta üst sıradan bir boncuk boyayın, alt sırayı silip baştan başlayın; “👀 İzle” adımındaki boncuklar da böyle çalışır. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler. Kendi haritanı çiz: Kareli kâğıda bir harita çizip arkadaşına çözdürebilirler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Desen dedektifi 🔍 | Tekrar eden düzenin “desen” olduğu anlatılır. |
| 2 | ❓ Test | Sırada ne var? | 🍎 🍌 🍌 🍎 🍌 🍌 🍎 🍌 … dizisinde sıradaki öğe; doğru: 🍌. |
| 3 | ❓ Test | Tekrar eden parça | FFR tekrarı; doğru tekrar eden parça: FFR. |
| 4 | 📖 Anlatım | Döngünün içinde döngü! | İç içe döngü tanıtılır: 3 kez [2 kez alkışla, zıpla]. |
| 5 | 🤖 Izgara (👀 izle) | 👀 İzle: İç içe döngü | Hazır iç içe program izlenir; iki sıra boncuk. |
| 6 | ❓ Test | Kaç kez ileri? | 2(3(F)R) programında toplam İleri git sayısı; doğru: 6. |
| 7 | 🤖 Izgara (adım adım) | Adım adım: İç içe döngü | Göl kenarında dolaşma; her kenar 2 kez ileri, sağa dön; en fazla 4 blok. |
| 8 | 🤖 Izgara | Büyük kare | Gölün etrafında büyük kare; iç içe döngü; en fazla 6 blok. |
| 9 | 📖 Anlatım | Yeni komut: Yıldızı al ✋ | ✋ Yıldızı al komutu tanıtılır; yıldız yoksa el boş kalır. |
| 10 | 🤖 Izgara | Her iki adımda bir | Yıldızlar iki karede bir; en fazla 6 blok. |
| 11 | 🤖 Izgara | Köşe yıldızları | Köşe yıldızlarını tek tek al ve pile git; en fazla 6 blok. |
| 12 | 🤖 Izgara | ⭐ Bonus: Kenar ortaları | Yıldızlar kenar ortalarında; en fazla 9 blok. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Desen dedektifi 🔍
Kaldırım taşları, kazak çizgileri, şarkı nakaratı gibi şeylerde tekrar eden bir düzen vardır; buna desen denir. Deseni bulursan döngü kurmak kolaylaşır.

#### Adım 2 · ❓ Test — Sırada ne var?
- Soru: 🍎 🍌 🍌 🍎 🍌 🍌 🍎 🍌 … Sıradaki ne?
- Şıklar:
  - 🍎
  - ✔ 🍌
  - 🍇
- Açıklama: Desen: 1 elma, 2 muz. Son elmadan sonra bir muz geldi, şimdi bir muz daha!

#### Adım 3 · ❓ Test — Tekrar eden parça
- Soru: FFR · FFR · FFR (kod resmi) — Bu programda tekrar eden parça hangisi?
- Şıklar:
  - FF
  - RF
  - ✔ FFR
- Açıklama: İleri, ileri, sağa dön: 3 kez tekrar ediyor. Yani 🔁 3 kez tekrarla [⬆ ⬆ ↱].

#### Adım 4 · 📖 Anlatım — Döngünün içinde döngü!
Bir döngünün içine başka bir döngü konabilir: iç içe döngü. Örnek: 3 kez tekrarla [2 kez 👏 alkışla, sonra 🦘 zıpla]. Yapılan: 👏👏🦘 · 👏👏🦘 · 👏👏🦘. Dış döngü her tur attığında iç döngü baştan sona çalışır.

#### Adım 5 · 🤖 Izgara — 👀 İzle: İç içe döngü
- Görev: Program hazır, izle. Üstteki sıra dış döngünün, alttaki sıra iç döngünün turlarını gösterir. İç döngünün boncukları her dış turda baştan başlar.
- Harita (yön: E, sağa bakıyor):
  ```
  S...
  ###.
  ###.
  ###G
  ```
- Araçlar: İleri git (F), Sağa dön (R), Tekrarla (loop)
- Hazır program (watch): `2(3(F)R)`
- Örnek çözüm: `2(3(F)R)`
- İpucu: —
- Ek: `watch` (hazır programı izleme).

#### Adım 6 · ❓ Test — Kaç kez ileri?
- Soru: (kod resmi: `2(3(F)R)`) Bu programda Robo toplam kaç kez İleri git yapar?
- Şıklar:
  - 3
  - 5
  - ✔ 6
- Açıklama: İçteki döngü 3 kez ileri gider. Dıştaki döngü bunu 2 kez yapar: 2 × 3 = 6.

#### Adım 7 · 🤖 Izgara — Adım adım: İç içe döngü
- Görev: Robo gölün kenarından dolaşacak. Her kenar aynı: 2 kez ileri, sağa dön. En fazla 4 blok! Adımları sırayla yap.
- Harita (yön: E, sağa bakıyor):
  ```
  S..
  ~~.
  G..
  ```
- Araçlar: İleri git (F), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(2(F)R)`
- İpucu: —
- Ek: `tut` (adım adım), `max: 4`, `loopN: 4`.
  Yönlendirme metinleri (`tut`, sırayla):
  1. Tekrarla'ya bas. Bu dış döngü olacak.
  2. Bir kez daha Tekrarla'ya bas. Yeni döngü dıştakinin içine girer: bu da iç döngü.
  3. İleri git'e bas. İç döngünün içine girer.
  4. Bir kenar kaç kare? 2. İç döngünün sayısını 2 yap.
  5. Köşede dönmek için iç döngüden çık: iç döngünün altındaki “döngü sonu ⤶” yazısına tıkla.
  6. Sağa dön'e bas. Dış döngünün içinde, iç döngünün altında durur.
  7. Robo kaç kenar yürüyecek? 3. Dış döngünün sayısını 3 yap.
  8. ▶ Çalıştır'a bas, iki sıra boncuğu izle!

#### Adım 8 · 🤖 Izgara — Büyük kare
- Görev: Gölün etrafında büyük bir kare! Her kenar aynı: 4 kez ileri, sağa dön. İç içe döngü kullan. En fazla 6 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S...*
  G~~~.
  .~~~.
  .~~~.
  *...*
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(4(F)R)3(F)`
- İpucu: Dış döngü 3 kez: [içte 4 kez İleri git, sonra Sağa dön]. Sonra döngü sonunda 3 kez İleri git (bunu da döngüyle yapmalısın, yoksa blok yetmez).
- Ek: `narrate`, `pathHint`, `max: 6`, `loopN: 4`.

#### Adım 9 · 📖 Anlatım — Yeni komut: Yıldızı al ✋
Bu görevlerde yıldızlar kendiliğinden toplanmaz. Yıldızın tam üstündeyken ✋ Yıldızı al denmelidir. Yıldız olmayan bir yerde “al” dersen eli boş kalır.

#### Adım 10 · 🤖 Izgara — Her iki adımda bir
- Görev: Yıldızlar iki karede bir. Deseni bul: 2 kez ileri, yıldızı al. En fazla 6 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S.*.*.*G
  ```
- Araçlar: İleri git (F), Yıldızı al (P), Tekrarla (loop)
- Örnek çözüm: `3(2(F)P)F`
- İpucu: 3 kez tekrarla [2 kez İleri git, Yıldızı al]. Döngüden sonra bir İleri git.
- Ek: `pick` (yıldız toplama görevi), `narrate`, `pathHint`, `max: 6`, `loopN: 3`.

#### Adım 11 · 🤖 Izgara — Köşe yıldızları
- Görev: Bahçenin köşelerindeki yıldızları tek tek al ve pile git. En fazla 6 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S.*
  G#.
  *.*
  ```
- Araçlar: İleri git (F), Sağa dön (R), Yıldızı al (P), Tekrarla (loop)
- Örnek çözüm: `3(2(F)PR)F`
- İpucu: Her kenarda: 2 kez İleri git, Yıldızı al, Sağa dön. 3 kez tekrarla, sonra bir İleri git.
- Ek: `pick`, `narrate`, `pathHint`, `max: 6`.

#### Adım 12 · 🤖 Izgara — ⭐ Bonus: Kenar ortaları
- Görev: Yıldızlar bu sefer kenarların ortasında. Bir kenarın deseni ne? En fazla 9 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S.*..
  .~~~.
  G~~~*
  .~~~.
  ..*..
  ```
- Araçlar: İleri git (F), Sağa dön (R), Yıldızı al (P), Tekrarla (loop)
- Örnek çözüm: `3(2(F)P2(F)R)2(F)`
- İpucu: Bir kenar: 2 ileri, al, 2 ileri, sağa dön. Bunu 3 kez yap, sonra 2 kez ileri.
- Ek: Bonus (isteğe bağlı); `pick`, `narrate`, `pathHint`, `max: 9`, `loopN: 2`.

---

## 4. ders · Bölüm 8 — 🏰 Labirent Görevi

- **Kavram:** Hepsini birleştir
- **Kısa açıklama:** Seviye sonu! Döngüleri, anahtarları ve yıldızları kullanarak zorlu labirentleri geç.
- **Öğrendiklerimiz:**
  - Öğrendiğimiz her şeyi (sıra, yön, döngü, hata ayıklama) birlikte kullanabiliriz.
  - Büyük bir problemi küçük parçalara bölmek işi kolaylaştırır.
  - Kısa program her zaman en iyi programdır, ama önce çalışan bir program yazmak önemlidir.
- **Öğretmen notu:** Labirent yarışması: Öğrenciler ikili gruplar halinde kareli kâğıda kendi labirentlerini çizsin (en az bir kapı ve anahtar). Gruplar labirentleri değiştirsin ve birbirlerinin labirenti için ok işaretleriyle program yazsın. En kısa çalışan programı yazan grup kazanır. Bonus (⭐) görevler isteğe bağlıdır; süre yetmezse atlanabilir. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Seviye sonu! 🏰 | Sıralama, ileri-geri, dönüşler, anahtarlar, döngüler hatırlatılır; plan yap, programı yaz, bug avla. |
| 2 | 🤖 Izgara | Isınma turu | Suyun yanından geçilir; ileri, sağa/sola dön ve döngü kullanılır. |
| 3 | 🤖 Izgara | Kale kapısı | Anahtar alınır, kapı açılır, pile ulaşılır; geri git de kullanılır. |
| 4 | ❓ Test | Hangi program daha kısa? | Döngülü (5 blok) ve düz (7 blok) program karşılaştırılır; doğru: döngülü olan. |
| 5 | 🤖 Izgara | Yıldız tarlası | İki sıra yıldız alınır, pile gidilir; en fazla 12 blok. |
| 6 | 🤖 Izgara | Spiral | Sarmal yol; iç içe döngü ile; en fazla 10 blok. |
| 7 | 🤖 Izgara | Çifte kapı | İki kapı, bir anahtar; anahtar alınca kapılar açılır. |
| 8 | 🤖 Izgara | ⭐ Bonus: Usta işi | Son labirent; en az blokla ⭐⭐⭐ hedefi. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Seviye sonu! 🏰
Tebrikler! Sıralama, ileri-geri, dönüşler, anahtarlar, döngüler kullanılacak. Her labirentte önce plan yap, sonra programı yaz, çalışmazsa bug avla.

#### Adım 2 · 🤖 Izgara — Isınma turu
- Görev: Suyun yanından dikkatlice geç.
- Harita (yön: E, sağa bakıyor):
  ```
  S.~..
  #.~.#
  #...G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `FRFFL3(F)`
- İpucu: —
- Ek: —

#### Adım 3 · 🤖 Izgara — Kale kapısı
- Görev: Kalenin anahtarı en uçta! Anahtarı al, kapıyı aç, pile ulaş.
- Harita (yön: E, sağa bakıyor):
  ```
  S..#k
  ##.#.
  G#...
  .#D##
  ...##
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `2(F)R2(F)L2(F)L2(F)2(B)L2(F)L2(F)R2(F)R2(F)`
- İpucu: Yolu parçalara böl: önce anahtara git. Sonra geri gel ve kapıya doğru in. Kapıdan sonra sola, sonra yukarı.
- Ek: —

#### Adım 4 · ❓ Test — Hangi program daha kısa?
- Soru: İki program da Robo'yu pile götürüyor. Hangisi daha kısa? (harita: `S.... / ####. / ####G`)
- Şıklar:
  - ✔ 🔁 4 × ⬆ · R · 🔁 2 × ⬆ (döngülü)
  - FFFFRFF (düz)
- Açıklama: Döngülü program 5 blok, diğeri 7 blok. Yolun uzun olduğu yerlerde döngü hep kazandırır.

#### Adım 5 · 🤖 Izgara — Yıldız tarlası
- Görev: İki sıra yıldız var. Her yıldızı al, sonra pile git. En fazla 12 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S*.*.
  G*.*.
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Yıldızı al (P), Tekrarla (loop)
- Örnek çözüm: `2(FPF)RFR2(FPF)`
- İpucu: Üst sıra: 2 kez [İleri, Al, İleri]. Sağa dön, İleri, Sağa dön. Alt sıra: yine 2 kez [İleri, Al, İleri].
- Ek: `pick` (yıldız toplama görevi), `max: 12`.

#### Adım 6 · 🤖 Izgara — Spiral
- Görev: Robo bir sarmalın içine giriyor! Her köşede aynı yöne dönüyor. İç içe döngü işe yarayabilir! En fazla 10 blok.
- Harita (yön: E, sağa bakıyor):
  ```
  S....
  ####.
  ..G#.
  .###.
  .....
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `3(4(F)R)2(F)R2(F)`
- İpucu: Kenar uzunlukları: 4, 4, 4, 2, 2. İlk üç kenar aynı: 3 kez [4 ileri, sağa dön]. Sonra 2 ileri, sağa dön, 2 ileri.
- Ek: `max: 10`.

#### Adım 7 · 🤖 Izgara — Çifte kapı
- Görev: İki kapı, bir anahtar! Anahtarı alınca bütün kapılar açılır.
- Harita (yön: E, sağa bakıyor):
  ```
  G.D..
  ###.#
  k.S.#
  ###D#
  ###.*
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R), Tekrarla (loop)
- Örnek çözüm: `2(B)3(F)R2(F)LFBL4(F)L3(F)`
- İpucu: Önce anahtar (2 geri). Sonra sağa git, aşağı in ve yıldızı al. Geri dön, yukarı çık ve en üstten sola git.
- Ek: —

#### Adım 8 · 🤖 Izgara — ⭐ Bonus: Usta işi
- Görev: Son labirent! En az blokla çözmeye çalış. ⭐⭐⭐ alabilecek misin?
- Harita (yön: E, sağa bakıyor):
  ```
  S.*.*.*
  ######.
  *.*.*.*
  .######
  G......
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R), Yıldızı al (P), Tekrarla (loop)
- Örnek çözüm: `3(2(F)P)R2(F)R3(P2(F))PL2(F)`
- İpucu: Üst sıra: 3 kez [2 ileri, al]. Aşağı in. Orta sıra: 3 kez [al, 2 ileri], sonra al. En sonda aşağı in.
- Ek: Bonus (isteğe bağlı); `pick`.

---

## Hafta özeti

- Bu haftada kullanılan yeni bloklar/komutlar: Tekrarla (🔁 döngü) ve iç içe döngü; Yıldızı al (✋ P) komutu (ilk kez 7. bölümde); Geri git (B) ve Yıldızı al (P) 8. bölümde de kullanılıyor; döngü dışına çıkmak için “döngü sonu ⤶” tıklaması. Yeni kavramlar: hata (bug) ve hata ayıklama, desen, iç içe döngü.
- Toplam adım: 43 (8 anlatım, 8 test, 27 ızgara; scratch yok). Bonus (⭐) ızgara görevleri: 4 (5. bölüm 1, 6. bölüm 1, 7. bölüm 1, 8. bölüm 1 — toplam 4).
- Yönlendirmeli (`tut`) ızgara adımları: 6. bölüm 3 adım (4 + 4 + 6 = 14 yönlendirme metni), 7. bölüm 1 adım (8 yönlendirme metni) — toplam 4 adım, 22 yönlendirme metni. Bunlar `tut` dizisinde kaynak sırasıyla yukarıda listelendi.
- İzle (`watch`) adımları: 6. bölüm 1, 7. bölüm 1.
- Anlatım/çalışma seçenekleri (`narrate`, `pathHint`): 6. ve 7. bölümlerdeki döngü ızgaralarında (LOOPY).
