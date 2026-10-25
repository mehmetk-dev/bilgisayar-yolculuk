# Hafta 1 — Algoritma ve yönler

> Robo ile Kodlama · 1. hafta · 4 ders × 40 dk · Bölümler 1–4

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 1 | 📋 Algoritma Nedir? | Sıralı adımlar | 12 | 3 anlatım, 3 sıralama, 2 test, 4 ızgara |
| 2. ders | Bölüm 2 | ↕️ İleri ve Geri | Yön ve hareket | 11 | 1 anlatım, 3 test, 7 ızgara |
| 3. ders | Bölüm 3 | 🔄 Sağa ve Sola Dön | Dönüşler | 11 | 1 anlatım, 3 test, 7 ızgara |
| 4. ders | Bölüm 4 | 🗝️ Önce Plan Yap | Planlama | 10 | 2 anlatım, 3 test, 5 ızgara |

---

## 1. ders · Bölüm 1 — 📋 Algoritma Nedir?

- **Kavram:** Sıralı adımlar
- **Kısa açıklama:** Robo ile tanış, günlük hayattaki algoritmaları sırala ve ilk komutunu ver.
- **Öğrendiklerimiz:**
  - Algoritma, bir işi yapmak için sırayla izlenen adımlardır.
  - Komut, robota verilen tek bir emirdir.
  - Adımların sırası önemlidir.
- **Öğretmen notu:** Robot oyunu (bilgisayarsız, 5 dk): Bir öğrenci “robot” olsun, gözlerini kapatsın. Sınıf ona yalnızca “bir adım ileri” komutu vererek onu kapıya götürsün. Sonra sorun: “Kaç komut gerekti? Bir adım fazla deseydik ne olurdu?” Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Merhaba, ben Robo! 👋 | Robo kendini tanıtır; bir işi yapmak için sırayla izlenen adımlara algoritma denildiği anlatılır. |
| 2 | 📖 Anlatım | Sen de her gün algoritma kullanıyorsun! | Diş fırçalama, kahvaltı hazırlama, ayakkabı bağlama gibi günlük işlerin sıralı adımlardan oluştuğu, sıranın karışmasının sonucu değiştirdiği anlatılır. |
| 3 | 🔢 Sıralama | Diş fırçalama algoritması | 5 kart doğru sıraya dizilir. |
| 4 | 🔢 Sıralama | Fidan dikme algoritması | 4 kart doğru sıraya dizilir. |
| 5 | ❓ Test | Hangisi bir algoritma? | Kek tarifinin algoritma olduğu, elma ve “güzel bir gün” cümlesinin olmadığı seçilir. |
| 6 | 🔢 Sıralama | Sandviç algoritması | 5 kart doğru sıraya dizilir. |
| 7 | 📖 Anlatım | Şimdi bana komut ver! | Komutun tanımı, komutların dizilince program olduğu, “İleri git” komutunun bir kare ilerlettiği ve hedefin pil olduğu anlatılır. |
| 8 | 🤖 Izgara | İlk programın | Robo pile gider; araçlar: İleri git; çözüm: FFFF (4 blok). |
| 9 | 🤖 Izgara | Yukarı doğru | Robo yukarı bakarken yıldızı alıp pile gider; araçlar: İleri git; çözüm: FFFF (4 blok). |
| 10 | ❓ Test | Robo nerede durur? | Üç adımlık programın Robo'yu pilden bir önceki kareye bıraktığı seçilir. |
| 11 | 🤖 Izgara | Uzun yol | Robo tüm yıldızları alıp pile gider; araçlar: İleri git; çözüm: FFFFFFF (7 blok). |
| 12 | 🤖 Izgara | ⭐ Bonus: Aşağı in | Robo aşağı bakarak yıldızları alıp pile gider; araçlar: İleri git; çözüm: FFFFFF (6 blok). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Merhaba, ben Robo! 👋
Robo kendini tanıtır. Robo'nun kendi kendine düşünemediği, bu yüzden her şeyi adım adım söylemek gerektiği anlatılır. Sırayla izlenen adımların adı “ALGORİTMA”dır.

#### Adım 2 · 📖 Anlatım — Sen de her gün algoritma kullanıyorsun!
Sabah diş fırçalamak, kahvaltı hazırlamak, ayakkabı bağlamak gibi işlerin sıralı adımlardan oluştuğu anlatılır. Sıra karışırsa (ör. ayakkabıyı çorabın üstüne giymek) sonuç değişir.

#### Adım 3 · 🔢 Sıralama — Diş fırçalama algoritması
- Görev: Kartları doğru sıraya koy; ilk ne yapılır?
- Kartlar (doğru sıra):
  1. 🪥 Diş fırçasını al
  2. 🧴 Fırçaya macun sür
  3. 😁 Dişlerini fırçala
  4. 💧 Ağzını çalkala
  5. 🧼 Fırçayı yıka, yerine koy

#### Adım 4 · 🔢 Sıralama — Fidan dikme algoritması
- Görev: Bir fidan dikmek için adımları sıraya koy.
- Kartlar (doğru sıra):
  1. ⛏️ Toprağı kaz, çukur aç
  2. 🌱 Fidanı çukura koy
  3. 🪣 Üstünü toprakla ört
  4. 💦 Fidanı sula
- Geri bildirim (doğru sıralanınca): “Süper! Fidanı sulamadan önce dikmen gerektiğini biliyordun. 🌳”

#### Adım 5 · ❓ Test — Hangisi bir algoritma?
- Soru: Aşağıdakilerden hangisi bir algoritmadır?
- Şıklar:
  1. ✔ 🎂 Kek tarifi: unu koy, yumurtayı kır, karıştır, fırına ver
  2. 🍎 Kırmızı, parlak bir elma
  3. 😊 Çok güzel bir gün
- Doğru cevap: 1. şık (kek tarifi)
- Açıklama: Kek tarifi sıralı adımlardan oluşur. Elma ve güzel bir gün ise adım değildir.

#### Adım 6 · 🔢 Sıralama — Sandviç algoritması
- Görev: Robo'ya sandviç yapmanın doğru sırasını öğret.
- Kartlar (doğru sıra):
  1. 🔪 Ekmeği ikiye kes
  2. 🧈 Ekmeğe tereyağı sür
  3. 🧀 Peyniri koy
  4. 🍞 Üstünü kapat
  5. 😋 Afiyetle ye
- Geri bildirim: “Afiyet olsun! Peyniri ekmeği kesmeden koymaya çalışsaydık ne olurdu? 😄”

#### Adım 7 · 📖 Anlatım — Şimdi bana komut ver!
Komutun, robota verilen tek bir emir olduğu; komutları arka arkaya dizince bir program olduğu anlatılır. “⬆ İleri git” komutunun Robo'yu baktığı yöne bir kare ilerlettiği ve hedefin pil olduğu söylenir.

#### Adım 8 · 🤖 Izgara — İlk programın
- Görev: Robo'yu pile götür. Her “⬆ İleri git” basışı programa bir adım ekler.
- Harita (yön: E / sağa bakıyor):
  ```
  S...G
  ```
- Araçlar: İleri git (F)
- Örnek çözüm: `FFFF` (4 blok)
- İpucu: Robo ile pil arasında 4 kare var. Yani 4 kez İleri git.

#### Adım 9 · 🤖 Izgara — Yukarı doğru
- Görev: Robo bu sefer yukarı bakıyor. “İleri” Robo'nun baktığı yöndür. Yoldaki yıldızı da topla.
- Harita (yön: N / yukarı bakıyor):
  ```
  G
  .
  *
  .
  S
  ```
- Araçlar: İleri git (F)
- Örnek çözüm: `FFFF` (4 blok)
- İpucu: Yok.

#### Adım 10 · ❓ Test — Robo nerede durur?
- Soru: Robo bu programı çalıştırırsa nerede durur?
- Gösterim: Tahta `S...G`, program `FFF`
- Şıklar:
  1. ✔ Pilden bir önceki karede
  2. Pilin üstünde 🔋
  3. Başladığı yerde
- Doğru cevap: 1. şık
- Açıklama: Pile 4 adım var ama programda 3 adım var. Robo bir kare eksik kalır.

#### Adım 11 · 🤖 Izgara — Uzun yol
- Görev: Bütün yıldızları topla ve pile ulaş. Kareleri tek tek saymayı unutma.
- Harita (yön: E / sağa bakıyor):
  ```
  S.*.*..G
  ```
- Araçlar: İleri git (F)
- Örnek çözüm: `FFFFFFF` (7 blok)
- İpucu: Robo ile pil arasında 7 adım var. Programındaki blok sayısı “Programım” başlığının yanında görünür.

#### Adım 12 · 🤖 Izgara — ⭐ Bonus: Aşağı in
- Görev: Robo aşağı bakıyor. Yıldızların hepsini topla ve pile ulaş. Saymadan önce yolu parmağınla takip et.
- Harita (yön: S / aşağı bakıyor):
  ```
  S
  *
  .
  *
  .
  *
  G
  ```
- Araçlar: İleri git (F)
- Örnek çözüm: `FFFFFF` (6 blok)
- İpucu: Yok.

---

## 2. ders · Bölüm 2 — ↕️ İleri ve Geri

- **Kavram:** Yön ve hareket
- **Kısa açıklama:** Robo hem ileri hem geri gidebilir. Yıldızlar iki yanda olunca hangisini kullanacaksın?
- **Öğrendiklerimiz:**
  - İleri git: Robo baktığı yöne bir kare gider.
  - Geri git: Robo yüzünü çevirmeden bir kare geri gider.
  - Bir problemi çözmenin birden fazla yolu olabilir.
- **Öğretmen notu:** İleri–geri oyunu: Öğrenciler sıraların yanında ayağa kalkar. Öğretmen “ileri”, “geri”, “ileri, ileri, geri” gibi komut dizileri söyler; herkes aynı anda uygular. Sonra bir öğrenci öğretmen olur. Dizinin sonunda herkes aynı yerde mi? Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Geri vites! 🚗 | “⬇ Geri git” komutu tanıtılır; Robo geri giderken yüzünün aynı yöne baktığı anlatılır. |
| 2 | ❓ Test | Düşün bakalım | Sağa bakan Robo'ya “Geri git” verilince ne olacağı seçilir. |
| 3 | 🤖 Izgara | Pil arkamda! | Robo pile geri gider; araçlar: İleri git, Geri git; çözüm: BBB (3 blok). |
| 4 | 🤖 Izgara | Önce yıldız, sonra pil | Robo önce yıldıza gider, sonra geri geri pile döner; araçlar: İleri git, Geri git; çözüm: FFBBBBBB (8 blok). |
| 5 | ❓ Test | Nereye vardı? | `FFBBB` programının Robo'yu başladığı yerin bir soluna götürdüğü seçilir. |
| 6 | 🤖 Izgara | İki yanda yıldız | Robo soldaki yıldızı alır, sonra sağa ilerleyip pile ulaşır; araçlar: İleri git, Geri git; çözüm: BBBFFFFFFFF (11 blok). |
| 7 | 🤖 Izgara | Yukarı, sonra aşağı | Robo yukarı bakarken yıldızı alır, sonra pile döner; araçlar: İleri git, Geri git; çözüm: FFBBBBB (7 blok). |
| 8 | 🤖 Izgara | Önce sola, sonra sağa | Robo önce soldaki yıldıza, sonra sağdaki pile gider; araçlar: İleri git, Geri git; çözüm: BBFFFFFF (8 blok). |
| 9 | ❓ Test | Bir bilmece | 3 ileri + 3 geri adımın Robo'yu başladığı yere döndürdüğü seçilir. |
| 10 | 🤖 Izgara | Dikkat, iki yanda su! | Robo soldaki yıldızı alır, suya girmeden pile ulaşır; araçlar: İleri git, Geri git; çözüm: BBBFFFFFFF (10 blok). |
| 11 | 🤖 Izgara | ⭐ Bonus: Yıldız yağmuru | Dört yıldız ve bir pil; önce sağdaki iki yıldız, sonra geri geri pile; araçlar: İleri git, Geri git; çözüm: FFFBBBBBBB (10 blok). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Geri vites! 🚗
“⬇ Geri git” komutu tanıtılır. Geri giderken Robo'nun yüzünün aynı yöne baktığı, sadece geri geri yürüdüğü anlatılır. Park eden arabanın geri vitesine benzetilir.

#### Adım 2 · ❓ Test — Düşün bakalım
- Soru: Robo sağa bakıyor ve “⬇ Geri git” komutunu alıyor. Ne olur?
- Şıklar:
  1. Bir kare sağa gider
  2. ✔ Bir kare sola gider, yüzü hâlâ sağa bakar
  3. Arkasını döner ve sola bakar
- Doğru cevap: 2. şık
- Açıklama: Geri gidince Robo baktığı yönün tersine bir kare kayar ama arkasını dönmez.

#### Adım 3 · 🤖 Izgara — Pil arkamda!
- Görev: Robo sağa bakıyor ama pil arkasında. “Geri git” komutunu kullan.
- Harita (yön: E / sağa bakıyor):
  ```
  G..S.
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `BBB` (3 blok)
- İpucu: Yok.

#### Adım 4 · 🤖 Izgara — Önce yıldız, sonra pil
- Görev: Yıldız önünde, pil arkanda. Önce yıldızı al, sonra geri geri pile git.
- Harita (yön: E / sağa bakıyor):
  ```
  G...S.*
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `FFBBBBBB` (8 blok)
- İpucu: Önce 2 kez İleri git ile yıldızı al. Sonra 6 kez Geri git.

#### Adım 5 · ❓ Test — Nereye vardı?
- Soru: Robo bu programın sonunda nerede olur?
- Gösterim: Tahta `..S..`, program `FFBBB`
- Şıklar:
  1. Başladığı yerde
  2. Başladığı yerin bir sağında
  3. ✔ Başladığı yerin bir solunda
- Doğru cevap: 3. şık
- Açıklama: 2 ileri, 3 geri: geri adımlar bir fazla. Robo başladığı yerin bir soluna gelir.

#### Adım 6 · 🤖 Izgara — İki yanda yıldız
- Görev: Yıldızlar iki yanda. Hangisini önce alırsan al, en sonda pile ulaşmalısın.
- Harita (yön: E / sağa bakıyor):
  ```
  *..S...*G
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `BBBFFFFFFFF` (11 blok)
- İpucu: Önce 3 kez Geri git ile soldaki yıldızı al. Sonra İleri git ile sağa doğru ilerle.

#### Adım 7 · 🤖 Izgara — Yukarı, sonra aşağı
- Görev: Robo yukarı bakıyor. Yıldız yukarıda, pil aşağıda. Dönmeden çözebilir misin?
- Harita (yön: N / yukarı bakıyor):
  ```
  *
  .
  S
  .
  .
  G
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `FFBBBBB` (7 blok)
- İpucu: Yok.

#### Adım 8 · 🤖 Izgara — Önce sola, sonra sağa
- Görev: Yıldızlar Robo'nun iki yanında. En kısa yoldan hepsini toplamaya çalış.
- Harita (yön: E / sağa bakıyor):
  ```
  *.S.*.G
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `BBFFFFFF` (8 blok)
- İpucu: Önce soldaki yıldız (2 kez geri), sonra sağa doğru hep ileri.

#### Adım 9 · ❓ Test — Bir bilmece
- Soru: Robo 3 kez İleri git, sonra 3 kez Geri git yapıyor. Nerede durur?
- Şıklar:
  1. ✔ Başladığı yerde
  2. 3 kare ileride
  3. 6 kare ileride
- Doğru cevap: 1. şık
- Açıklama: İleri ve geri adımlar birbirini götürür. Robo başladığı yere döner.

#### Adım 10 · 🤖 Izgara — Dikkat, iki yanda su!
- Görev: Haritanın iki ucunda su var. Soldaki yıldızdan sonra fazla geri gitme, yoksa Robo ıslanır. Pile ulaşınca da fazladan ilerleme.
- Harita (yön: E / sağa bakıyor):
  ```
  ~*..S..*G~
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `BBBFFFFFFF` (10 blok)
- İpucu: Soldaki yıldıza 3 kare var. Oradan pile 7 kare.

#### Adım 11 · 🤖 Izgara — ⭐ Bonus: Yıldız yağmuru
- Görev: Dört yıldız, bir pil. Programı yazmadan önce bir plan yap: önce hangi tarafa gideceksin?
- Harita (yön: E / sağa bakıyor):
  ```
  G*.*S*.*
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `FFFBBBBBBB` (10 blok)
- İpucu: Önce sağdaki iki yıldızı al (3 kez ileri), sonra geri geri bütün yolu yürü.

---

## 3. ders · Bölüm 3 — 🔄 Sağa ve Sola Dön

- **Kavram:** Dönüşler
- **Kısa açıklama:** Robo yerinde dönmeyi öğreniyor. Ağaçların ve gölün etrafından dolaşalım.
- **Öğrendiklerimiz:**
  - Dönüş komutu Robo'yu ilerletmez, sadece baktığı yönü değiştirir.
  - Sağ ve sol, Robo'nun baktığı yöne göre belirlenir.
  - Uzun yolları küçük parçalara bölerek planlayabiliriz.
- **Öğretmen notu:** Sınıf haritası: Yere tebeşir ya da bantla 4×4 kare çizin. Bir öğrenci robot olur; diğeri kâğıda ok işaretleri (⬆ ↰ ↱) çizerek program yazar, robot sırayla uygular. “Sağa dön” derken robotun sağı mı, bizim sağımız mı? Tartışın! Bonus (⭐) görevler isteğe bağlıdır; süre yetmezse atlanabilir. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler. Kendi haritanı çiz: Kareli kâğıda bir harita çizip arkadaşına çözdürebilirler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Dönmeyi öğrendim! | “↰ Sola dön” ve “↱ Sağa dön” komutları tanıtılır; dönerken Robo'nun ilerlemediği, sadece baktığı yönün değiştiği anlatılır. |
| 2 | ❓ Test | Robo nereye bakar? | Yukarı bakan Robo sağa dönünce nereye bakacağı seçilir. |
| 3 | ❓ Test | İki kez dönersek? | Sağa bakan Robo iki kez sola dönünce nereye bakacağı seçilir. |
| 4 | ❓ Test | Zor soru! 🤯 | Aşağı bakan Robo sağa dönünce ekranda nereye bakacağı seçilir. |
| 5 | 🤖 Izgara | Köşeyi dön | Robo köşede sağa döner; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FFRFF (5 blok). |
| 6 | 🤖 Izgara | Yukarı tırman | Robo yıldızı alır, sola dönüp yukarı çıkar, pile gider; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FLFFRFFF (8 blok). |
| 7 | 🤖 Izgara | Merdiven | Zikzak yolda suya düşmeden pile ulaşılır; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FRFLFRFLF (9 blok). |
| 8 | 🤖 Izgara | Gölün etrafından | Robo gölü dolaşıp yıldızı alarak pile gider; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FFRFFFFRFF (8 blok). |
| 9 | 🤖 Izgara | U dönüşü | U biçimli yolda iki kez dönerek pile gidilir; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FFFRFFRFFF (8 blok). |
| 10 | 🤖 Izgara | Akıllı kısayol | Yıldızdan sonra Geri git kullanılarak kısa program yazılır; araçlar: İleri git, Geri git, Sola dön, Sağa dön; çözüm: FFRFBB (6 blok). |
| 11 | 🤖 Izgara | ⭐ Bonus: Büyük yolculuk | Uzun, kıvrımlı yolda yıldızı alıp pile gidilir; araçlar: İleri git, Sola dön, Sağa dön; çözüm: FRFFLFFLFFRFFRFF (16 blok). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Dönmeyi öğrendim!
“↰ Sola dön” ve “↱ Sağa dön” komutları tanıtılır. Dönerken Robo'nun bir kare bile ilerlemediği, yerinde çeyrek tur döndüğü ve baktığı yönün değiştiği anlatılır. Önündeki kırmızı okun nereye baktığını gösterdiği söylenir.

#### Adım 2 · ❓ Test — Robo nereye bakar?
- Soru: Robo yukarı bakıyor. “↱ Sağa dön” dersek nereye bakar?
- Şıklar:
  1. ⬅️ Sola
  2. ✔ ➡️ Sağa
  3. ⬇️ Aşağı
- Doğru cevap: 2. şık
- Açıklama: Yukarı bakarken sağa dönen Robo, sağ tarafa bakar.

#### Adım 3 · ❓ Test — İki kez dönersek?
- Soru: Robo sağa bakıyor. Arka arkaya iki kez “↰ Sola dön” dersek nereye bakar?
- Şıklar:
  1. ⬆️ Yukarı
  2. ➡️ Yine sağa
  3. ✔ ⬅️ Sola (tam ters yöne)
- Doğru cevap: 3. şık
- Açıklama: İki çeyrek tur = yarım tur. Robo tam arkasına döner!
- İpucu (yanlış cevapta): Birinci dönüşte yukarı bakar. İkinci dönüşte?

#### Adım 4 · ❓ Test — Zor soru! 🤯
- Soru: Robo aşağı bakıyor. “↱ Sağa dön” dersek ekranda nereye bakar?
- Şıklar:
  1. ✔ ⬅️ Ekranın soluna
  2. ➡️ Ekranın sağına
  3. ⬆️ Yukarı
- Doğru cevap: 1. şık
- Açıklama: Kendini Robo'nun yerine koy: aşağı bakarken senin sağ elin ekranın soluna denk gelir!
- İpucu (yanlış cevapta): Ayağa kalk ve arkanı dön, sonra sağ kolunu kaldır. Kolun ekranın hangi tarafını gösteriyor?

#### Adım 5 · 🤖 Izgara — Köşeyi dön
- Görev: Yol köşede dönüyor. Köşeye gelince “↱ Sağa dön”, sonra yine ilerle.
- Harita (yön: E / sağa bakıyor):
  ```
  S..
  ##.
  ##G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FFRFF` (5 blok)
- İpucu: 2 kez İleri git, sonra Sağa dön, sonra 2 kez İleri git.

#### Adım 6 · 🤖 Izgara — Yukarı tırman
- Görev: Önce yıldızı al, sonra yukarı çık ve pile git. Hangi yöne döneceğini Robo'nun gözünden düşün.
- Harita (yön: E / sağa bakıyor):
  ```
  #...G
  #.###
  S*...
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FLFFRFFF` (8 blok)
- İpucu: Yıldızı alınca Robo sağa bakıyor. Yukarı çıkmak için onun soluna dönmesi gerek: ↰ Sola dön.

#### Adım 7 · 🤖 Izgara — Merdiven
- Görev: Zikzak bir yol. Düz gidersen suya düşersin.
- Harita (yön: E / sağa bakıyor):
  ```
  S.~~
  #.*#
  ##.G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FRFLFRFLF` (9 blok)
- İpucu: Yolu parçalara böl: bir kare ilerle, dön, bir kare ilerle, öbür yöne dön…

#### Adım 8 · 🤖 Izgara — Gölün etrafından
- Görev: Robo yüzme bilmez. Gölün etrafından dolaşıp pile ulaş. Yolda yıldızı da topla.
- Harita (yön: N / yukarı bakıyor):
  ```
  ..*..
  .~~~.
  S~~~G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FFRFFFFRFF` (10 blok)
- İpucu: Önce yukarı çık (2 kare), sağa dön, üst sıradan 4 kare git, sonra aşağı in.

Not: Örnek çözüm 10 karakterdir; ipucunun adımları ile örnek çözüm arasında karakter sayısı farkı kaynakta olduğu gibi bırakılmıştır.

#### Adım 9 · 🤖 Izgara — U dönüşü
- Görev: Yol bir U harfi gibi. Kaç kez döneceksin?
- Harita (yön: E / sağa bakıyor):
  ```
  S...
  ###.
  G...
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FFFRFFRFFF` (10 blok)
- İpucu: Sağa 3 kare, sağa dön, aşağı 2 kare, yine sağa dön, sola doğru 3 kare.

#### Adım 10 · 🤖 Izgara — Akıllı kısayol
- Görev: Bu sefer Geri git de var. Yıldızı aldıktan sonra arkanı dönmek yerine geri geri gidersen program kısalır. ⭐⭐⭐ için en kısa yolu bul.
- Harita (yön: N / yukarı bakıyor):
  ```
  G.*
  #.#
  #S#
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FFRFBB` (6 blok)
- İpucu: Yukarı 2 kare, sağa dön, 1 kare ileri (yıldız), sonra 2 kez Geri git.

#### Adım 11 · 🤖 Izgara — ⭐ Bonus: Büyük yolculuk
- Görev: Uzun ve kıvrımlı bir yol. Yolu parmağınla takip et, her köşede “Robo şimdi hangi yöne dönmeli?” diye düşün.
- Harita (yön: E / sağa bakıyor):
  ```
  S.#*..
  #.#.#.
  #...#G
  ```
- Araçlar: İleri git (F), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FRFFLFFLFFRFFRFF` (16 blok)
- İpucu: Önce aşağı in, alttan sağa git, yıldıza çık, sonra en sağdan aşağı in.

---

## 4. ders · Bölüm 4 — 🗝️ Önce Plan Yap

- **Kavram:** Planlama
- **Kısa açıklama:** Programcılar önce plan yapar. Anahtarı bul, kilitli kapıları aç, hazineye ulaş!
- **Öğrendiklerimiz:**
  - Programı yazmadan önce yolu planlamak hataları azaltır.
  - Bazı işlerin bir ön koşulu vardır: kapıdan geçmek için önce anahtar gerekir.
  - Programı “kafamızda çalıştırarak” sonucunu tahmin edebiliriz.
- **Öğretmen notu:** Kâğıt plan: Kareli kâğıda 5×5 bir harita çizin; bir anahtar, bir kapı ve bir pil koyun. Öğrenciler yolu önce kalemle çizsin, sonra ok işaretleriyle (⬆ ↰ ↱) programını yazsın. Programları değiştirip arkadaşının programını “kafasında çalıştırsın”. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Programcılar önce plan yapar 📝 | Uzun yolculukta haritaya bakmak gibi, programcıların da kod yazmadan önce plan yaptığı anlatılır: hedef, yoldaki engeller, sıra. |
| 2 | ❓ Test | Programı kafanda çalıştır | `FFRF` programının Robo'yu sağ kenarın ortasına götürdüğü seçilir. |
| 3 | ❓ Test | Hangi program doğru? | Robo'yu pile götüren programın seçilmesi (üç şık program olarak gösterilir). |
| 4 | 📖 Anlatım | Anahtar ve kapı 🔑🚪 | Kilitli kapılar ve anahtarın, anahtarın üstünden geçerek otomatik alındığı; anahtar olmadan kapıya çarpılacağı anlatılır. |
| 5 | 🤖 Izgara | İlk anahtar | Robo anahtarı alır, kapıdan geçer, pile ulaşır; araçlar: İleri git; çözüm: FFFF (4 blok). |
| 6 | 🤖 Izgara | Anahtar arkamda | Anahtar arkada, kapı önde; araçlar: İleri git, Geri git; çözüm: BBFFFFF (7 blok). |
| 7 | ❓ Test | Ne olur? | `FFF` programının anahtar olmadan kapıya çarpmaya yol açtığı seçilir. |
| 8 | 🤖 Izgara | Gizli anahtar | Anahtar çıkmaz sokakta; araçlar: İleri git, Geri git, Sola dön, Sağa dön; çözüm: FRFFBBLFFF (10 blok). |
| 9 | 🤖 Izgara | Labirentte anahtar | Anahtarı alıp kapıdan geçerek pile ulaşılır; araçlar: İleri git, Geri git, Sola dön, Sağa dön; çözüm: FRFFLFBLFFRFFFF (15 blok). |
| 10 | 🤖 Izgara | ⭐ Bonus: Hazine avı | Yıldız, anahtar, kapı ve pil; önce plan yapılır; araçlar: İleri git, Geri git, Sola dön, Sağa dön; çözüm: FFRFFRFFLFF (11 blok). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Programcılar önce plan yapar 📝
Uzun bir yolculuğa çıkmadan önce haritaya bakıldığı, programcıların da kod yazmadan önce plan yaptığı anlatılır. Bir planın üç sorusu verilir: 1) Hedef nerede? 2) Yolda neler var? 3) Hangi sırayla gideceğim?

#### Adım 2 · ❓ Test — Programı kafanda çalıştır
- Soru: Robo bu programın sonunda hangi karede olur?
- Gösterim: Tahta `S..` / `...` / `...` (Robo sol üstte), program `FFRF`
- Şıklar:
  1. Sağ üst köşede
  2. ✔ Sağ kenarın ortasında
  3. Sağ alt köşede
- Doğru cevap: 2. şık
- Açıklama: 2 kare sağa, sağa dön (artık aşağı bakıyor), 1 kare aşağı: sağ kenarın ortası!

#### Adım 3 · ❓ Test — Hangi program doğru?
- Soru: Robo sağa bakıyor. Hangi program onu pile götürür?
- Gösterim: Tahta `S..` / `##.` / `##G`
- Şıklar:
  1. `FRFFF`
  2. `FFLFF`
  3. ✔ `FFRFF`
- Doğru cevap: 3. şık
- Açıklama: İki kare sağa, köşede sağa dön, iki kare aşağı.

#### Adım 4 · 📖 Anlatım — Anahtar ve kapı 🔑🚪
Bazı yerlerde kilitli kapıların olduğu, kapıdan geçmek için önce anahtarın alınması gerektiği anlatılır. Anahtarın üstünden geçmenin yeterli olduğu ve anahtar alınınca bütün kapıların açıldığı söylenir. Anahtar almadan kapıya gidilirse çarpılacağı belirtilir.

#### Adım 5 · 🤖 Izgara — İlk anahtar
- Görev: Anahtarı al, kapıdan geç, pile ulaş.
- Harita (yön: E / sağa bakıyor):
  ```
  SkD.G
  ```
- Araçlar: İleri git (F)
- Örnek çözüm: `FFFF` (4 blok)
- İpucu: Yok.

#### Adım 6 · 🤖 Izgara — Anahtar arkamda
- Görev: Anahtar Robo'nun arkasında, kapı önünde. Önce hangisine gitmelisin?
- Harita (yön: E / sağa bakıyor):
  ```
  k.S.DG
  ```
- Araçlar: İleri git (F), Geri git (B)
- Örnek çözüm: `BBFFFFF` (7 blok)
- İpucu: Önce 2 kez Geri git ile anahtarı al. Sonra ileri giderek kapıdan geç.

#### Adım 7 · ❓ Test — Ne olur?
- Soru: Robo bu programı çalıştırırsa ne olur?
- Gösterim: Tahta `k.S.DG`, program `FFF`
- Şıklar:
  1. ✔ Kapıya çarpar, çünkü anahtarı yok
  2. Pile ulaşır
  3. Suya düşer
- Doğru cevap: 1. şık
- Açıklama: Anahtar arkada kaldı! Kapı kilitli olduğu için Robo çarpar.

#### Adım 8 · 🤖 Izgara — Gizli anahtar
- Görev: Anahtar aşağıdaki çıkmaz sokakta. Al, geri gel, kapıdan geç! İpucu: Geri git ile geri gelmek kolaydır.
- Harita (yön: E / sağa bakıyor):
  ```
  ~~~~~
  S.D.G
  ~.~~~
  ~k~~~
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FRFFBBLFFF` (10 blok)
- İpucu: İleri, sağa dön, 2 ileri (anahtar), 2 geri, sola dön, 3 ileri.

#### Adım 9 · 🤖 Izgara — Labirentte anahtar
- Görev: Önce bir plan yap. Anahtar nerede? Kapı nerede? Hangi sırayla gideceksin?
- Harita (yön: E / sağa bakıyor):
  ```
  S..D.G
  #.####
  #.k###
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FRFFLFBLFFRFFFF` (15 blok)
- İpucu: Aşağı in, anahtarı al, geri geri çıkıp yukarı dön, sonra sağa doğru kapıdan geçersin.

#### Adım 10 · 🤖 Izgara — ⭐ Bonus: Hazine avı
- Görev: Yıldız, anahtar, kapı ve pil! Kısa görünen yol kilitli olabilir. Önce planını yap.
- Harita (yön: N / yukarı bakıyor):
  ```
  *.k#.
  .#.#.
  S.D.G
  ```
- Araçlar: İleri git (F), Geri git (B), Sola dön (L), Sağa dön (R)
- Örnek çözüm: `FFRFFRFFLFF` (11 blok)
- İpucu: Yukarı çık (yıldız), sağa git (anahtar), aşağı in (kapı açık), sonra sağa.

---

## Hafta özeti
- Bu haftada kullanılan yeni bloklar/komutlar: İleri git (F, 1. ders); Geri git (B, 2. ders); Sola dön (L) ve Sağa dön (R) (3. ders). Dördüncü derste yeni komut yok.
- Toplam adım: 44 (7 anlatım, 3 sıralama, 11 test, 23 ızgara, 0 scratch)
