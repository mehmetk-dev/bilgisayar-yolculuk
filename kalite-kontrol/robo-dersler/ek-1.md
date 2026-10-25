# Ek Bölümler (1/2) — Bölüm 33–38

> Robo ile Kodlama · Ek bölümler · programın dışında

## Genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| Ek ders 1 | Bölüm 33 | 🧩 Bulmaca Odası | Problem çözme | 9 | 2 anlatım, 1 test, 6 ızgara |
| Ek ders 2 | Bölüm 34 | 🤏 Süper Verimli Robo | Kısa program | 8 | 2 anlatım, 2 test, 4 ızgara |
| Ek ders 3 | Bölüm 35 | 🎶 Müzik Kutusu | Müzik projesi | 7 | 1 anlatım, 1 test, 5 scratch |
| Ek ders 4 | Bölüm 36 | 🎈 Oyun 5: Balon Patlat | Tıklama + zaman | 7 | 1 anlatım, 1 test, 5 scratch |
| Ek ders 5 | Bölüm 37 | 🏓 Oyun 6: Top Sektir | Sekme + çarpışma | 8 | 1 anlatım, 1 test, 6 scratch |
| Ek ders 6 | Bölüm 38 | 🏁 Oyun 7: Yarış Pisti | İki oyunculu oyun | 7 | 1 anlatım, 1 test, 5 scratch |

---

## Ek ders 1 · Bölüm 33 — 🧩 Bulmaca Odası

- **Kavram:** Problem çözme
- **Kısa açıklama:** Robo'nun en zor labirentleri! İpucu az, düşünmek çok: yolu önce kafanda çalıştır, sonra programla.
- **Öğrendiklerimiz:**
  - Zor bir problemi çözmeden önce yolu kafamızda ya da kâğıtta planlarız.
  - Önce anahtar, sonra kapı gibi bir sıra gerekiyorsa plan bunu yansıtmalıdır.
  - Çalışmayan programda hatayı bulmak için programı adım adım kafamızda çalıştırırız.
- **Öğretmen notu:** Kâğıt labirent: Öğrenciler ikişerli çalışsın; her biri kareli kâğıda 5×5 labirent çizsin (ağaç, su, anahtar, kapı, pil). Eşler labirenti değiştirip ok işaretleriyle (⬆ ↰ ↱) program yazsın. Önce "yolu planladın mı, yoksa deneyerek mi buldun?" diye sorun: planlamanın hata ayıklamayı nasıl azalttığını konuşun.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Bulmaca odasına hoş geldin! 🧩 | Bakma, planlama ve programlama sırası anlatılır. |
| 2 | 🤖 Izgara | Dolambaçlı yol | Robo ağaçların arasındaki kıvrımlı yoldan pile gider; araçlar: İleri, Sola dön, Sağa dön. |
| 3 | 🤖 Izgara | Göl kıyısı | Robo gölün çevresinden dolanır, yıldızı alıp pile gider. |
| 4 | ❓ Test | Önce ne yapmalı? | Pil kapının ardındayken plan sorulur. |
| 5 | 🤖 Izgara | Kapının ardındaki pil | Robo yıldızı alır, anahtarı alır, kapıdan geçip pile gider. |
| 6 | 🤖 Izgara | Hatayı bul 🐞 | Hazır bir program çalıştırılır; Robo pile ulaşamaz, eksik komut bulunup eklenir. |
| 7 | 🤖 Izgara | ⭐ Hazine odası | Yıldız, anahtar ve kapı sırasıyla alınır; en sonda pile gidilir. |
| 8 | 🤖 Izgara | ⭐ Büyük bulmaca | Tek çözümü olan uzun harita: anahtar, kapı, yıldız, pil sırasıyla. |
| 9 | 📖 Anlatım | Bulmaca ustası! 🏅 | Bak, planla, programla, dene özeti; sonraki bölüme geçiş. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Bulmaca odasına hoş geldin! 🧩
Bu bölümdeki labirentler daha uzun ve kurnaz. Üç öneri: önce bak (pil, anahtar, kapı, yıldızlar nerede?), sonra planla (yolu parmakla takip et), en son programla ve çalıştır. Her görevde ⭐⭐⭐ için en kısa yolu bulmaya çalışılır.

#### Adım 2 · 🤖 Izgara — Dolambaçlı yol
- Görev: Ağaçlar yolu kıvrım kıvrım yapmış. Pile giden tek bir yol var. Önce parmakla bul.
- Harita (yön: E/sağa bakıyor):
  ```
  S.#...G
  #.#.#.#
  #...#.#
  #####..
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Örnek çözüm: `FRFFLFFLFFRFFF`
- İpucu: Önce 1 kare ileri, sonra 2 kare aşağı in. Orada 2 kare sağa git, sonra 2 kare yukarı çık, en sonda pile kadar hep sağa git. Sağdaki aşağı kol çıkmaz sokak! Parmakla takip et.

#### Adım 3 · 🤖 Izgara — Göl kıyısı
- Görev: Göl pile giden yolu kesmiş. Gölün çevresinden dolaş, yoldaki yıldızı da al!
- Harita (yön: E/sağa bakıyor):
  ```
  S.~G
  #.~.
  ..*.
  .###
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Örnek çözüm: `FRFFLFFLFF`
- İpucu: Önce aşağı in, yıldızın üstünden geç, sonra yukarı çık.

#### Adım 4 · ❓ Test — Önce ne yapmalı?
- Soru: Pil 🔋 kapının ardında. Robo'nun planı hangisi olmalı?
- Resim: Tahta haritası (yön: N/yukarı bakıyor)
  ```
  *.#G
  ..#D
  S.k.
  ####
  ```
- Şıklar:
  - A) Önce kapıya git, sonra anahtarı al
  - B) Önce anahtarı 🔑 al, sonra kapıdan geç ← **doğru cevap**
  - C) Önce yıldızı ⭐ al, kapı kendiliğinden açılır
- Açıklama: Kapı yalnızca anahtar alındıktan sonra açılır. Plan bu sıraya göre yapılmalı.

#### Adım 5 · 🤖 Izgara — Kapının ardındaki pil
- Görev: Pil kilitli kapının arkasında! Yukarıdaki planı programa çevir. Yıldızı da unutma.
- Harita (yön: N/yukarı bakıyor):
  ```
  *.#G
  ..#D
  S.k.
  ####
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Örnek çözüm: `FFLLFFLFFFLFF`
- İpucu: Önce yukarı çık ve yıldızı al, sonra geri dön. Sağa gidip anahtarı al, bir kare daha ilerle, yukarı dönüp kapıdan geç.

#### Adım 6 · 🤖 Izgara — Hatayı bul 🐞
- Görev: Bu program "Dolambaçlı yol" için yazılmış ama Robo pile ulaşamıyor. Programı çalıştır, nerede kaldığına bak ve eksiği tamamla.
- Harita (yön: E/sağa bakıyor):
  ```
  S.#...G
  #.#.#.#
  #...#.#
  #####..
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Hazır program (preset): `FRFFLFFLFFRFF`
- Örnek çözüm: `FRFFLFFLFFRFFF`
- İpucu: Robo son kareden bir önce duruyor. Programın sonuna ne eklemeliydin?

#### Adım 7 · 🤖 Izgara — ⭐ Hazine odası
- Görev: Hazine sandığına ulaşmak için kapıyı açmak, yıldızı toplamak ve en sonda pile gitmek gerek. Uzun bir yol! Önce planla.
- Harita (yön: E/sağa bakıyor):
  ```
  S..#.G
  ##.#D#
  *..#..
  .#...#
  .k.#~.
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Örnek çözüm: `FFRFFRFFLFFLFFLFRFFLFFFRF`
- İpucu: Sıra şöyle: önce yıldız, sonra anahtar, en son kapıdan geçip pil. Her parçayı ayrı ayrı planla.

#### Adım 8 · 🤖 Izgara — ⭐ Büyük bulmaca
- Görev: Bu haritanın tek bir çözümü var ve oldukça uzun. Anahtarı, yıldızı ve kapıyı sırayla düşün.
- Harita (yön: E/sağa bakıyor):
  ```
  S.#.....#
  ..#.###.#
  .k#.#..*.
  .##.#.#..
  ...D...#G
  ```
- Araçlar: İleri git, Sola dön, Sağa dön
- Örnek çözüm: `FRFFRFLFFLFFFFFLFFRFFFRFF`
- İpucu: Sıra şöyle: önce anahtar, sonra kapı, sonra yıldız, en son pil. Parmakla her parçayı takip et.

#### Adım 9 · 📖 Anlatım — Bulmaca ustası! 🏅
Uzun labirentler planlanarak çözüldü. Programcılar da büyük problemlerde aynısını yapar: bak, planla, programla, dene. Bir sonraki bölümde Robo'ya daha az blokla aynı işi yaptırmayı öğrenilecek.

---

## Ek ders 2 · Bölüm 34 — 🤏 Süper Verimli Robo

- **Kavram:** Kısa program
- **Kısa açıklama:** Aynı işi daha az blokla yap! Döngü ve fonksiyonla uzun programları kısalt, ⭐⭐⭐ topla.
- **Öğrendiklerimiz:**
  - İyi programcılar aynı işi mümkün olduğunca kısa yazar.
  - Tekrar eden bir parça gördüğümüzde döngü kullanırız.
  - Döngünün içinde döngü olabilir (iç içe döngü); sık kullanılan parça fonksiyon yapılabilir.
- **Öğretmen notu:** Tembel robot yarışması: Tahtaya uzun bir komut dizisi yazın (ör. "ileri ×4, sağa, ileri ×4, sağa, ileri ×4, sağa, ileri ×4, sağa"). Gruplar en kısa söyleyişi bulsun ("4 kez: 4 ileri, sağa dön"). En kısa söyleyen kazansın. Sonra bunun neden işe yaradığını (daha az yazma = daha az hata) konuşun.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Programcılar tembeldir! 😄 | Az blokla çok iş yaptırmanın nedenleri anlatılır. |
| 2 | ❓ Test | Hangisi daha kısa? | İki programın aynı işi yaptığı, kısa olanın neden daha iyi olduğu sorulur. |
| 3 | 🤖 Izgara | Kısalt: uzun koridor | Robo 8 ileri adımını en fazla 2 blokla (tekrarla) yapar. |
| 4 | 🤖 Izgara | Kısalt: kare yol | Kare yol 11 blok yerine en fazla 4 blokla yazılır. |
| 5 | ❓ Test | İç içe döngü | Robo'nun iç içe döngüyle çizdiği yolun sonunda nerede olduğu sorulur. |
| 6 | 🤖 Izgara | Köşe yıldızları turu | Üç köşedeki yıldızlar alınır, pile en fazla 6 blokla gidilir. |
| 7 | 🤖 Izgara | Yılan tarla 🐍 | Yılan yolu "Şerit" fonksiyonuyla en fazla 13 blokta çözülür. |
| 8 | 📖 Anlatım | Süper verimli! ✂️ | Tekrar eden bloklar döngüye konur; Scratch'e geçiş. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Programcılar tembeldir! 😄
İyi programcılar az yazıp çok iş yaptırmak ister. Nedenleri: az blok az hata demektir; kısa program kolay okunur; değiştirmek kolaydır (8 yerine 12 adım gerekiyorsa sadece sayı değişir). Her görevde en fazla kaç blok kullanılabileceği yazılıdır.

#### Adım 2 · ❓ Test — Hangisi daha kısa?
- Soru: İki program da Robo'yu 8 kare ilerletir. Üstteki 8 blok, alttaki 2 blok. Alttaki neden daha iyi?
- Resim: `FFFFFFFF` (üstte), `8(F)` (altta) kod kartları
- Şıklar:
  - A) Çünkü daha hızlı yürür
  - B) Çünkü Robo'yu geri götürür
  - C) Çünkü aynı işi daha kısa yazar, sayıyı değiştirmek de kolaydır ← **doğru cevap**
- Açıklama: Aynı iş, çok daha az blok! Tekrar eden komutları döngüye koymak programı kısaltır.

#### Adım 3 · 🤖 Izgara — Kısalt: uzun koridor
- Görev: Bu program çalışıyor ama tam 8 blok! Tekrarla kullanarak en fazla 2 blokla yap.
- Kod kartı: `FFFFFFFF`
- Harita (yön: E/sağa bakıyor):
  ```
  S...*...G
  ~~~~~~~~~
  ```
- Araçlar: İleri git, Tekrarla
- En fazla blok (max): 2
- Örnek çözüm: `8(F)`
- İpucu: Tekrarla bloğunun içine İleri git koy; "kaç kez" kutusundan 8'i seç.

#### Adım 4 · 🤖 Izgara — Kısalt: kare yol
- Görev: Robo gölün etrafındaki kare yolda yürüyor. Bu program 11 blok! En fazla 4 blokla yazabilir misin?
- Kod kartı: `FFFRFFFRFFF`
- Harita (yön: E/sağa bakıyor):
  ```
  S...
  #~~.
  #~~.
  G...
  ```
- Araçlar: İleri git, Sağa dön, Tekrarla
- En fazla blok (max): 4
- Örnek çözüm: `3(3(F)R)`
- İpucu: 3 ileri, sağa dön: bu parça kaç kez tekrar ediyor? Tekrarın içine bir tekrar daha koyabilirsin!

#### Adım 5 · ❓ Test — İç içe döngü
- Soru: Robo yukarı bakıyor ve bu programı çalıştırıyor: 4 kez [2 kez İleri git, Sağa dön]. Program bitince Robo nerede olur?
- Resim: Tahta haritası (yön: N/yukarı bakıyor) ve kod kartı `4(2(F)R)`
  ```
  .....
  .....
  .....
  .S...
  .....
  ```
- Şıklar:
  - A) Başladığı yerde, yine yukarı bakarak ← **doğru cevap**
  - B) Başladığı yerden 8 kare yukarıda
  - C) Suya düşer
- Açıklama: Robo her turda 2 kare gidip sağa dönüyor: 4 turda küçük bir kare çiziyor ve başladığı yere dönüyor. Döngünün içinde döngü!

#### Adım 6 · 🤖 Izgara — Köşe yıldızları turu
- Görev: Üç köşedeki yıldızı topla, sonra pile ulaş. Kısa yoldan pile gidersen yıldızlar eksik kalır! En fazla 6 blok.
- Harita (yön: N/yukarı bakıyor):
  ```
  *...*
  .~~~.
  .~~~.
  .~~~.
  SG..*
  ```
- Araçlar: İleri git, Sağa dön, Tekrarla
- En fazla blok (max): 6
- Örnek çözüm: `3(4(F)R)3(F)`
- İpucu: Kenarda 4 ileri, sağa dön: bunu 3 kez yap. Sonra son kenarın 3 karesini ilerle.

#### Adım 7 · 🤖 Izgara — Yılan tarla 🐍
- Görev: Tarlayı yılan gibi gezeceksin: 4 ileri, sağa, 2 ileri, sağa, 4 ileri, sola, 2 ileri, sola, 4 ileri. Uzun bir program! Şerit fonksiyonuna 4 adımı koy ve 13 blok ya da daha azıyla çöz.
- Harita (yön: E/sağa bakıyor):
  ```
  S....
  ####.
  .....
  .####
  ....G
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Fonksiyon
- Fonksiyon adı: Şerit
- En fazla blok (max): 13
- Fonksiyon tanımı (Şerit): `4(F)`
- Örnek çözüm: `fR2(F)RfL2(F)Lf` (f = Şerit çağrısı)
- İpucu: Şerit = 4 kez İleri git. Programım: Şerit, sağa, 2 ileri, sağa, Şerit, sola, 2 ileri, sola, Şerit.

#### Adım 8 · 📖 Anlatım — Süper verimli! ✂️
Uzun programlar döngü ve fonksiyonla kısaltıldı. Aynı fikir Scratch'te de geçerli: tekrar eden bloklar varsa döngüye konur. Sıradaki bölümlerde Scratch ile müzik, oyun ve yarış yapılacak. 🎵🎮

---

## Ek ders 3 · Bölüm 35 — 🎶 Müzik Kutusu

- **Kavram:** Müzik projesi
- **Kısa açıklama:** Davul seti, klavye piyanosu, "Neşe Şarkısı" ve dans eden bir orkestra: kendi müzik kutunu yap!
- **Öğrendiklerimiz:**
  - Tıklama ve tuş olayları kuklaları çalgıya çevirir.
  - Bir şarkı, doğru sırada çalınan notalardır; tekrar eden kısımları döngüyle kısaltabilirsin (son görevde dene).
  - "Haber sal" ile bir kukla çalarken diğerleri onunla aynı anda dans edebilir.
- **Öğretmen notu:** İnsan orkestrası: Sınıfı üç gruba ayırın: "davulcular" (masaya vurur), "piyanistler" (Do-Re-Mi söyler), "dansçılar" (dans eder). Öğretmen "vuruş!" dediğinde (haber sal!) bütün gruplar aynı anda harekete geçsin. Sonra sorun: "Dansçılar davulcuyu nasıl duydu?" (haber alma).

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Müzik kutusu zamanı! 🎶 | Davul seti, piyano, şarkı ve orkestra bölümleri tanıtılır. |
| 2 | 🐱 Scratch | Davul seti 🥁 | Davul, Zil ve Köpek tıklanınca kendi sesini çalar. |
| 3 | 🐱 Scratch | Klavye piyanosu 🎹 | Beş tuş beş nota çalar (a, s, d, w, boşluk); her tuşta kostüm değişir. |
| 4 | ❓ Test | Tekrarı bul | Do Re Mi Do'nun iki kez çalınması için en kısa yazım sorulur. |
| 5 | 🐱 Scratch | Neşe şarkısı ⭐ | Yıldız "Neşe Şarkısı"nı doğru sırayla çalar. |
| 6 | 🐱 Scratch | Ritim ve dans 💃 | Davul her vuruşta haber salar ve ses çıkarır; kedi haberi alıp dans eder. |
| 7 | 🐱 Scratch | ⭐ Kendi müzik kutum | Serbest görev: en az 8 nota ya da ses ve bir döngü ya da haber kullanılır. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Müzik kutusu zamanı! 🎶
Kendi çalgılar yapılacak: 🥁 davul seti (kuklaya tıklayınca ses), 🎹 piyano (klavye tuşu nota çalar), ⭐ şarkı (notalar doğru sırayla), 💃 orkestra (davul çalarken kedi dans eder). Hoparlör yoksa çalan ses ve notalar kuklanın yanında yazılı görünür.

#### Adım 2 · 🐱 Scratch — Davul seti 🥁
- Görev: Her kukla bir çalgı olsun. Davul'a tıklayınca davul, Zil'e tıklayınca zil, Köpek'e tıklayınca "hav" sesi çalsın. Her kukla için "bu kukla tıklanınca" + "davul sesini başlat" kullanılır. Sonra sahneye tıklayıp çalgılar denenir.
- Sahne: Dekor `sahne`; kuklalar: Davul (-130, -40, büyüklük 130), Zil (0, -40, büyüklük 130), Köpek (130, -40)
- Bloklar: bu kukla tıklanınca, sesini başlat, sesini bitene kadar çal, sonraki kostüm, büyüklüğü %{n} yap, büyüklüğü {n} değiştir, {s} saniye bekle
- Hedefler:
  1) Davul, Zil ve Köpek için birer tıklama betiği
  2) Davul, zil ve hav sesleri çalınsın 🥁
- İpucu: Önce Davul'u seç (kukla listesinden): "bu kukla tıklanınca" + "davul sesini başlat". Sonra aynısını Zil ve Köpek için yap.
- Örnek çözüm:
  - Davul → [bu kukla tıklanınca] → [davul sesini başlat] → [sonraki kostüm]
  - Zil → [bu kukla tıklanınca] → [zil sesini başlat]
  - Köpek → [bu kukla tıklanınca] → [hav sesini başlat] → [sonraki kostüm]

#### Adım 3 · 🐱 Scratch — Klavye piyanosu 🎹
- Görev: Robo piyano olsun! Beş tuş için beş betik yaz: a → Do, s → Re, d → Mi, w → Fa, boşluk → Sol. Her tuşta kostüm de değişsin (sonraki kostüm). Sonra sahneye tıklayıp tuşlara basılır.
- Sahne: dekor `sahne`; kukla: Robo (0, -60, büyüklük 130)
- Bloklar: {tuş} tuşuna basılınca, ♪ {nota} notasını çal, sonraki kostüm, sesini başlat, "de" (süreli yazı)
- Hedefler:
  1) Her tuş kendi notasını çalsın: a Do, s Re, d Mi, w Fa, boşluk Sol
  2) Do, Re, Mi, Fa ve Sol çalınsın 🎹
- İpucu: Her betik: "… tuşuna basılınca" + "♪ … notasını çal" + "sonraki kostüm". Önce bir tanesini yap, sonra aynısını başka tuşlar için çoğalt.
- Örnek çözüm:
  - [a tuşuna basılınca] → [♪ Do notasını çal] → [sonraki kostüm]
  - [s tuşuna basılınca] → [♪ Re notasını çal] → [sonraki kostüm]
  - [d tuşuna basılınca] → [♪ Mi notasını çal] → [sonraki kostüm]
  - [w tuşuna basılınca] → [♪ Fa notasını çal] → [sonraki kostüm]
  - [boşluk tuşuna basılınca] → [♪ Sol notasını çal] → [sonraki kostüm]

#### Adım 4 · ❓ Test — Tekrarı bul
- Soru: Bir şarkıda Do Re Mi Do notaları art arda iki kez çalınıyor. Bloklarla en kısa nasıl yazarsın?
- Şıklar:
  - A) 8 tane nota bloğu
  - B) Notaları daha hızlı çal
  - C) 2 kez tekrarla: [Do, Re, Mi, Do] ← **doğru cevap**
- Açıklama: Tekrar eden parçayı döngüye koymak bloğu kısaltır. Robo'nun programlarında da böyleydi!

#### Adım 5 · 🐱 Scratch — Neşe şarkısı ⭐
- Görev: Meşhur "Neşe Şarkısı"nı çal! Notalar: Mi Mi Fa Sol · Sol Fa Mi Re · Do Do Re Mi · Mi Re Re. Son notayı (Re) uzun çal: 1 vuruş. Diğerleri 0.5 vuruş.
- Sahne: dekor `gece`; kukla: Yıldız (0, 40, büyüklük 150)
- Bloklar: 🏁 tıklandığında, ♪ notasını çal, ♪ vuruş sus, kez tekrarla, "de" (süreli yazı), büyüklüğü değiştir, sonraki kostüm
- Hedefler:
  1) Şarkıyı sırayla çal: Mi Mi Fa Sol… Re Re (fazladan nota olmasın)
  2) Son nota (Re) 1 vuruş olsun
- İpucu: Notalar: Mi (64), Fa (65), Sol (67), Re (62), Do (60). On beş nota bloğu gerekiyor; 🏁 ile başlat.
- Örnek çözüm: Yıldız → [🏁 tıklandığında] → [♪ Mi 0.5] → [♪ Mi 0.5] → [♪ Fa 0.5] → [♪ Sol 0.5] → [♪ Sol 0.5] → [♪ Fa 0.5] → [♪ Mi 0.5] → [♪ Re 0.5] → [♪ Do 0.5] → [♪ Do 0.5] → [♪ Re 0.5] → [♪ Mi 0.5] → [♪ Mi 0.5] → [♪ Re 0.5] → [♪ Re 1]

#### Adım 6 · 🐱 Scratch — Ritim ve dans 💃
- Görev: Davul her vuruşta "vuruş" haberi salsın (vuruş haberini sal) ve davul sesi çıkarsın. Kedi bu haberi alınca dans etsin: vuruş haberini aldığımda → sonraki kostüm, ↻ 10 derece dön.
- Sahne: dekor `sahne`; kuklalar: Davul (-100, -60, büyüklük 130), Kedi (100, -60, her yöne dönebilir)
- Bloklar: 🏁 tıklandığında, {haber} haberini aldığımda, sürekli tekrarla, {n} kez tekrarla, {haber} haberini sal, sesini başlat, sesini bitene kadar çal, sonraki kostüm, ↻ / ↺ derece dön, {s} saniye bekle, büyüklüğü değiştir
- Hedefler:
  1) "vuruş" haberi salınsın
  2) Davul en az 4 kez çalsın 🥁
  3) Kedi haberi alıp dans etsin
- İpucu: Davul: 🏁 → sürekli tekrarla [vuruş haberini sal, davul sesi, 0.5 saniye bekle]. Kedi: vuruş haberini aldığımda → sonraki kostüm, ↻ 10 derece.
- Örnek çözüm:
  - Davul → [🏁 tıklandığında] → sürekli tekrarla [vuruş haberini sal, davul sesini başlat, 0.5 saniye bekle]
  - Kedi → [vuruş haberini aldığımda] → [sonraki kostüm] → [↻ 10 derece dön]

#### Adım 7 · 🐱 Scratch — ⭐ Kendi müzik kutum
- Görev: Kendi müzik kutunu yap! ➕ ile çalgı ekle, kendi melodini yaz. En az 8 nota ya da ses çalsın ve bir döngü ya da haber kullan. Arkadaşına dinlet! Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`; kuklalar: Kedi (-100, -60), Davul (100, -60)
- Bloklar: Kütüphane açık (➕ ile ekleme), 🏁, bu kukla tıklanınca, tuş, haber, döngüler, nota, sesler, görünüm ve hareket blokları
- Haberler: vuruş, şarkı
- Serbest görev. Hedefler:
  1) En az 8 nota ya da ses çalsın
  2) Bir döngü ya da haber kullan
- Örnek çözüm (bir olası çözüm): Kedi → [🏁 tıklandığında] → [2 kez tekrarla: ♪ Do, ♪ Re, ♪ Mi, ♪ Do]

---

## Ek ders 4 · Bölüm 36 — 🎈 Oyun 5: Balon Patlat

- **Kavram:** Tıklama + zaman
- **Kısa açıklama:** Balonlar yükseliyor! Tıklayıp patlat, 20 saniyede en çok puanı topla. Klon, skor ve zamanlayıcı birlikte!
- **Öğrendiklerimiz:**
  - Tıklama olayı oyuncunun fareyle oyuna katılmasını sağlar.
  - Klonlarla aynı anda çok sayıda balon oluşturabiliriz; her klon kendi tıklamasını işler.
  - "Zamanlayıcı" bloğu 🏁'dan beri geçen saniyeyi verir; oyunlara süre sınırı koymak için kullanılır.
- **Öğretmen notu:** Süre tutma oyunu: Sınıfta zamanlayıcıyı bir öğrenci tutsun; "başla!" deyince diğerleri 20 saniye boyunca kâğıttaki balon resimlerinin üstüne kalemle nokta koysun. Süre bitince noktaları sayıp "skor" tahtaya yazılsın. Sonra "Süre sınırı oyunu nasıl daha heyecanlı yapıyor?" diye tartışın.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Balon festivali! 🎈 | Oyunun kuralları anlatılır: yükselen balonlar, tıklayınca patlama, 20 saniye. |
| 2 | 🐱 Scratch | 1. adım: Yükselen balon | Balon alttan yukarı çıkar, tepeye varınca aşağıdan yeniden başlar. |
| 3 | 🐱 Scratch | 2. adım: Patlat! 💥 | Balona tıklanınca pop sesi çalar, skor 1 artar; skor 🏁'ta sıfırlanır. |
| 4 | ❓ Test | Hangi olay? | Fare tıklamasında çalışacak olay bloğu sorulur. |
| 5 | 🐱 Scratch | 3. adım: Balon sürüsü 🎈🎈🎈 | Klonlarla altı balon oluşturulur, her klon yükselir ve tıklanabilir. |
| 6 | 🐱 Scratch | 4. adım: 20 saniye! ⏱️ | Robo sunucu olur; 20 saniye sonra "Süre bitti! Puanın: …" der ve oyunu durdurur. |
| 7 | 🐱 Scratch | ⭐ Kendi balon oyunun | Serbest görev: hızlandır, sayı değiştir, yeni kukla (kötü elma gibi) ekle. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Balon festivali! 🎈
Balonlar aşağıdan yukarı yükselir ve tepeye varınca aşağıdan yeniden başlar. Fareyle tıklanınca patlar: pop sesi, skor +1. Balonlar klonlarla çoğalır. 20 saniye sonra oyun biter ve puanı söylenir.

#### Adım 2 · 🐱 Scratch — 1. adım: Yükselen balon
- Görev: Balon: 🏁 → x: (rastgele -210 ile 210) y: -170'e git → sürekli tekrarla [y'yi 3 değiştir; eğer y > 170 ise aşağıya, yeni rastgele x'e dön].
- Sahne: dekor `cayir`; değişken: skor = 0; kukla: Balon (0, -170, büyüklük 130)
- Bloklar: 🏁 tıklandığında, x: y: konumuna git, sürekli tekrarla, y'yi değiştir, eğer ise, rastgele, değişken, zamanlayıcı; karşılaştırma ve dokunma koşulları
- Hedefler:
  1) Balon yukarı çıksın
  2) Tepeye varınca aşağıdan yeniden başlasın
- İpucu: sürekli tekrarla [y'yi 3 değiştir, eğer (y konumu) > 170 ise x: (rastgele) y: -170 konumuna git].
- Örnek çözüm: Balon → [🏁 tıklandığında] → [x: (rastgele -210..210) y: -170 konumuna git] → sürekli tekrarla [y'yi 3 değiştir, eğer y > 170 ise [x: (rastgele -210..210) y: -170 konumuna git]]

#### Adım 3 · 🐱 Scratch — 2. adım: Patlat! 💥
- Görev: Balona yeni bir betik: bu kukla tıklanınca → pop sesi → skoru 1 değiştir → aşağıdan yeniden başla. 🏁 betiğinin başına skoru 0 yap eklemeyi unutma! Balona 3 kez tıkla.
- Sahne: önceki adımla aynı (dekor `cayir`, skor = 0, Balon)
- Bloklar: bu kukla tıklanınca, sesini başlat, skoru değiştir, konuma git, skoru yap, sürekli tekrarla, eğer ise
- Hedefler:
  1) Tıklama betiği yaz
  2) 🏁 ile skoru 0 yap
  3) 3 balon patlat
- Örnek çözüm: Balon →
  - [🏁 tıklandığında] → [skoru 0 yap] → [x: (rastgele) y: -170 konumuna git] → sürekli tekrarla [y'yi 3 değiştir, eğer y > 170 ise [x: (rastgele) y: -170 konumuna git]]
  - [bu kukla tıklanınca] → [pop sesini başlat] → [skoru 1 değiştir] → [x: (rastgele) y: -170 konumuna git]

#### Adım 4 · ❓ Test — Hangi olay?
- Soru: Oyuncu fareyle balona tıklayınca bir şey olsun istiyoruz. Betiği hangi bloğla başlatırız?
- Şıklar:
  - A) bu kukla tıklanınca ← **doğru cevap**
  - B) 🏁 tıklandığında
  - C) boşluk tuşuna basılınca
- Açıklama: "bu kukla tıklanınca" yalnızca o kuklaya tıklanınca çalışır. 🏁 ise oyunu başlatır.

#### Adım 5 · 🐱 Scratch — 3. adım: Balon sürüsü 🎈🎈🎈
- Görev: Tek balon az! Balona klonlama ekle: 🏁 → gizle → skoru 0 yap → 6 kez tekrarla [kendim klonunu oluştur, 0.4 saniye bekle]. Klon olarak başladığımda → rastgele x'e git (y: -170) → rengini değiştir → göster → sürekli tekrarla [yükselsin, tepeden dönsün]. Patlatma betiği her klonda çalışır.
- Sahne: önceki adımla aynı
- Bloklar: 🏁 tıklandığında, gizle, göster, skoru yap, 6 kez tekrarla, klonunu oluştur, klon olarak başladığımda, renk etkisini değiştir, bu klonu sil (kullanılabilir), sürekli tekrarla, eğer ise, bu kukla tıklanınca
- Hedefler:
  1) En az 6 klon oluştur
  2) Aynı anda en az 4 balon görünsün
  3) Balonlara tıklayınca skor artsın
- İpucu: Klon olarak başladığımda betiği 2. adımdaki yükselme kodunun aynısı; sadece başına "göster" ve "renk etkisi" ekle. Sürükleyip kopyalayabilirsin.
- Örnek çözüm: Balon →
  - [🏁 tıklandığında] → [gizle] → [skoru 0 yap] → 6 kez tekrarla [Balon klonunu oluştur, 0.4 saniye bekle]
  - [klon olarak başladığımda] → [x: (rastgele) y: -170 konumuna git] → [renk etkisini (rastgele 10..150) değiştir] → [göster] → sürekli tekrarla [y'yi 3 değiştir, eğer y > 170 ise [x: (rastgele) y: -170 konumuna git]]
  - [bu kukla tıklanınca] → [pop sesini başlat] → [skoru 1 değiştir] → [x: (rastgele) y: -170 konumuna git]

#### Adım 6 · 🐱 Scratch — 4. adım: 20 saniye! ⏱️
- Görev: Robo oyun sunucusu olsun. Robo: 🏁 → sürekli tekrarla [eğer zamanlayıcı > 20 ise → "kazandın" sesi → "Süre bitti! Puanın: (skor)" de → tümünü durdur].
- Not: Sayı kutusundaki ▾ düğmesinden birleştir ve skor seçilir. Zamanlayıcı 🏁'a basınca sıfırdan başlar.
- Sahne: dekor `cayir`; değişken: skor = 0; kuklalar: Balon (0, -170, büyüklük 130), Robo (-190, 120, büyüklük 70)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, eğer ise, sesini başlat, de (yazı), birleştir, skor (değişken), zamanlayıcı, tümünü durdur; karşılaştırma koşulu
- Hedefler:
  1) Zamanlayıcıyı koşulda kullan
  2) Süre dolunca "Süre bitti" desin
  3) Puanını da söylesin
- İpucu: 🏁 → sürekli tekrarla [eğer (zamanlayıcı) > 20 ise [kazandın sesi, (birleştir "Süre bitti! Puanın: " (skor)) de, tümünü durdur]].
- Örnek çözüm: Robo → [🏁 tıklandığında] → sürekli tekrarla [eğer zamanlayıcı > 20 ise [kazandın sesini başlat, (birleştir "Süre bitti! Puanın: " skor) de, tümünü durdur]]. Balon, adım 5'teki klon kodunu kullanır.

#### Adım 7 · 🐱 Scratch — ⭐ Kendi balon oyunun
- Görev: Oyunu kendine göre değiştir! Balonları hızlandır, sayıyı artır, başka bir kukla ekle (kalp, yıldız, elma…). Zor bir fikir: elma gibi bir kötü kukla ekle; ona tıklarsan skor azalsın! Hazır olunca ✔ Bitirdim.
- Sahne: önceki adımla aynı (Balon ve Robo)
- Bloklar: önceki adımdaki bloklar + konuma git
- Serbest görev. Hedefler:
  1) Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla)
  2) Skor tut
  3) Tıklama betiği yaz
- Örnek çözüm (bir olası çözüm): Balon → adım 5'teki klon kodu; Robo → adım 6'daki sunucu kodu

---

## Ek ders 5 · Bölüm 37 — 🏓 Oyun 6: Top Sektir

- **Kavram:** Sekme + çarpışma
- **Kısa açıklama:** Pinpon tarzı klasik oyun: topu raketle sektir, skor topla, kaçırırsan oyun biter. Top her sekişte hızlansın!
- **Öğrendiklerimiz:**
  - "Kenara geldiyse sek" bloğu bir kuklanın duvardan geri dönmesini sağlar.
  - Çarpışmada yönü değiştirmek (rastgele bir yöne "dön") oyunu her seferinde farklı yapar.
  - Hız bir değişken olursa oyun zamanla zorlaşır.
- **Öğretmen notu:** Sınıf pinpon: Öğrenciler ikişerli karşılıklı otursun, bir buruşuk kâğıt topu masadan masaya atsın. "Top duvara çarpınca geri döner, rakete çarpınca yönü değişir" kuralını canlandırın. Sonra sorun: "Top hızlanırsa oyun kolaylaşır mı, zorlaşır mı?" Zorluk ayarı üzerine konuşun (Elma Yakala bölümündeki gibi).

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Pinpon zamanı! 🏓 | Oyunun kuralları anlatılır: top sekiyor, raket fareyi takip ediyor, kaçırılırsa oyun biter. |
| 2 | 🐱 Scratch | 1. adım: Top sekiyor | Top 6 adımda ilerler ve kenardan sekerek ekranda kalır. |
| 3 | ❓ Test | Hangi blok? | Topun kenardan geri dönmesi için hangi bloğun gerektiği sorulur. |
| 4 | 🐱 Scratch | 2. adım: Raket fareyi takip etsin | Raket, fare x konumuna göre sağa ve sola gider. |
| 5 | 🐱 Scratch | 3. adım: Raketten sek! | Top raketle temas edince rastgele bir yöne döner, yukarı sekip pop sesi çalar. |
| 6 | 🐱 Scratch | 4. adım: Skor ve "Oyun bitti" | Her sekişte skor artar; top aşağı inerse "Oyun bitti!" denir ve oyun durur. |
| 7 | 🐱 Scratch | 5. adım: Hızlanan top ⚡ | Top hız değişkeniyle ilerler; her sekişte hız artar. |
| 8 | 🐱 Scratch | ⭐ Kendi pinpon oyunun | Serbest görev: ikinci top, küçük raket, can değişkeni (3) ile oyun sonu. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Pinpon zamanı! 🏓
Top ekranda sekiyor, raketle kaçırmadan geri yollanır. Raket fareyi takip eder. Raketten sekince skor artar. Topu kaçırırsan oyun biter. Top her sekişte hızlanır.

#### Adım 2 · 🐱 Scratch — 1. adım: Top sekiyor
- Görev: Top: 🏁 → x: 0 y: 0'a git → 160 yönüne dön → sürekli tekrarla [6 adım git, kenara geldiyse sek]. Top duvarlardan sekip ekranda kalmalı!
- Sahne: dekor `cayir`; değişkenler: skor = 0, hız = 5; kuklalar: Top (0, 0), Raket (0, -150)
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, adım git, kenara geldiyse sek, yönüne dön, konuma git, eğer ise, sesini başlat, zıplama/sayı blokları, değişken blokları
- Hedefler:
  1) "kenara geldiyse sek" kullan
  2) Top en az 3 kez duvardan sekip yön değiştirsin
- İpucu: 🏁 → x: 0 y: 0 konumuna git → 160 yönüne dön → sürekli tekrarla [6 adım git, kenara geldiyse sek].
- Örnek çözüm: Top → [🏁 tıklandığında] → [x: 0 y: 0 konumuna git] → [160 yönüne dön] → sürekli tekrarla [6 adım git, kenara geldiyse sek]

#### Adım 3 · ❓ Test — Hangi blok?
- Soru: Top ekranın kenarına çarpınca geri dönsün istiyoruz. Hangi blok işe yarar?
- Şıklar:
  - A) sonraki kostüm
  - B) kenara geldiyse sek ← **doğru cevap**
  - C) x'i 10 değiştir
- Açıklama: Bu blok kuklayı kenardan döndürür; yönü de buna göre değiştirir. Scratch'te pek çok oyun bu bloğu kullanır.

#### Adım 4 · 🐱 Scratch — 2. adım: Raket fareyi takip etsin
- Görev: Raket: 🏁 → x: 0 y: -150'ye git → sürekli tekrarla [x'i (fare x) yap]. Sayı kutusundaki ▾ düğmesinden fare x'i seç. Fareni sağa sola götür!
- Sahne: önceki adımla aynı (Top, Raket)
- Bloklar: 🏁 tıklandığında, konuma git, sürekli tekrarla, x'i yap, fare x (algılama)
- Hedefler:
  1) "fare x" kullan
  2) Raket sağa ve sola gitsin
- Örnek çözüm: Raket → [🏁 tıklandığında] → [x: 0 y: -150 konumuna git] → sürekli tekrarla [x'i (fare x) yap]

#### Adım 5 · 🐱 Scratch — 3. adım: Raketten sek!
- Görev: Topun döngüsüne bir kural ekle: eğer Raket'e dokunuyorsa → (rastgele -40 ile 40) yönüne dön (yukarı doğru!) → y'yi 10 değiştir → pop sesi. Topu raketle sektir!
- Not: 0 yönü yukarıdır. Rastgele bir yön, topun her seferinde farklı bir yöne gitmesini sağlar.
- Sahne: önceki adımla aynı
- Bloklar: 🏁 tıklandığında, sürekli tekrarla, adım git, kenara geldiyse sek, eğer ise, dokunuyor mu? (Raket), yönüne dön, rastgele, y'yi değiştir, sesini başlat
- Hedefler:
  1) Rakete değince yön değişsin
  2) Topu en az 3 kez sektir 🏓
- İpucu: sürekli tekrarla [6 adım git, kenara geldiyse sek, eğer Raket'e dokunuyorsa [(rastgele -40 ile 40) yönüne dön, y'yi 10 değiştir, pop sesi]].
- Örnek çözüm: Top → [🏁 tıklandığında] → [x: 0 y: 0 konumuna git] → [160 yönüne dön] → sürekli tekrarla [6 adım git, kenara geldiyse sek, eğer Raket'e dokunuyorsa [(rastgele -40 ile 40) yönüne dön, y'yi 10 değiştir, pop sesini başlat]]

#### Adım 6 · 🐱 Scratch — 4. adım: Skor ve "Oyun bitti"
- Görev: Her sekişte skoru 1 değiştir (🏁'ta skoru 0 yap). Raketi kaçırınca top aşağı iner: eğer y < -140 ise → boing sesi → "Oyun bitti!" de → tümünü durdur.
- Sahne: önceki adımla aynı
- Bloklar: 🏁 tıklandığında, skoru yap, skoru değiştir, eğer ise, sesini başlat, de (yazı), tümünü durdur, karşılaştırma koşulu
- Hedefler:
  1) Her sekişte skor artsın
  2) Top kaçınca "Oyun bitti!" desin
- İpucu: Rakete dokununca ayrıca "skoru 1 değiştir". Döngüye bir kural daha: eğer (y konumu) < -140 ise [boing sesi, Oyun bitti! de, tümünü durdur].
- Örnek çözüm: Top → [🏁 tıklandığında] → [skoru 0 yap] → [x: 0 y: 0 konumuna git] → [160 yönüne dön] → sürekli tekrarla [6 adım git, kenara geldiyse sek, eğer Raket'e dokunuyorsa [(rastgele -40 ile 40) yönüne dön, y'yi 10 değiştir, pop sesini başlat, skoru 1 değiştir], eğer y < -140 ise [boing sesini başlat, "Oyun bitti!" de, tümünü durdur]]

#### Adım 7 · 🐱 Scratch — 5. adım: Hızlanan top ⚡
- Görev: Oyun zorlaşsın! 🏁'ta hız değişkenini 5 yap. Topun (hız) adım git yapmasını sağla; her sekişte hızı 0.5 değiştir.
- Sahne: önceki adımla aynı; değişkenler skor ve hız
- Bloklar: önceki adımdaki bloklar, adım git (değişken ile), değişkeni değiştir, değişkeni yap
- Hedefler:
  1) Adım sayısı için hız değişkenini kullan
  2) Top hızlansın
- İpucu: move bloğunun sayı kutusundan ▾ ile "değişken" → hız seç. Rakete dokununca: hız değişkenini 0.5 değiştir.
- Örnek çözüm: Top → [🏁 tıklandığında] → [skoru 0 yap] → [hızı 5 yap] → [x: 0 y: 0 konumuna git] → [160 yönüne dön] → sürekli tekrarla [(hız) adım git, kenara geldiyse sek, eğer Raket'e dokunuyorsa [(rastgele -40 ile 40) yönüne dön, y'yi 10 değiştir, pop sesini başlat, skoru 1 değiştir, hızı 0.5 değiştir], eğer y < -140 ise [boing sesini başlat, "Oyun bitti!" de, tümünü durdur]]

#### Adım 8 · 🐱 Scratch — ⭐ Kendi pinpon oyunun
- Görev: Oyunu geliştir! İkinci bir top ekle, raketi küçült ya da arka planı değiştir. Zor bir fikir: hazır gelen can değişkenini (3) kullan; kaçırınca canı 1 azalt (-1 değiştir), can bitince oyun bitsin! Hazır olunca ✔ Bitirdim.
- Sahne: dekor `cayir`; değişkenler: skor = 0, hız = 5, can = 3; kuklalar: Top, Raket
- Bloklar: önceki adımdaki bloklar + büyüklük, büyüklüğü değiştir, dekoru yap, göster, gizle
- Serbest görev. Hedefler:
  1) Oyunda bir değişiklik yap (sayı, blok ya da yeni kukla)
  2) Skor tut
  3) Top sekebilsin
- Örnek çözüm (bir olası çözüm): Adım 7'deki Top kodu, Raket kodu aynı

---

## Ek ders 6 · Bölüm 38 — 🏁 Oyun 7: Yarış Pisti

- **Kavram:** İki oyunculu oyun
- **Kısa açıklama:** Kedi ve Köpek yarışıyor! İki oyuncu iki tuşa hızlı basar, ilk bitirene kazandı ilan edilir. Geri sayımla başlasın!
- **Öğrendiklerimiz:**
  - Bir oyunu iki kişi aynı klavyede oynayabilir: her oyuncunun kendi tuşu vardır.
  - Bir koşulu (ör. x > 150) sürekli kontrol ederek "yarış bitti mi?" diye bakarız.
  - Bir değişken "şalter" gibi çalışabilir: başla = 0 iken yarışçılar koşamaz, 1 olunca koşar.
- **Öğretmen notu:** Gerçek yarış: Sınıfta iki öğrenci yan yana dursun; öğretmen "3, 2, 1, başla!" desin. Başla demeden hareket eden "erken başlamış" sayılır (şalter = başla değişkeni!). Sonra "Kim kazandı? Bunu bilgisayar nasıl anlar?" diye sorun: sürekli kontrol edilen koşul (bitiş çizgisine varış). Bilgisayar başında ikişerli oynatıp kazananı not edin.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Hazır, set, başla! 🏁 | Kedi (d tuşu) ve Köpek (sağ ok) yarışının kuralları anlatılır. |
| 2 | 🐱 Scratch | 1. adım: Kedi koşsun | Kedi d tuşuna her basışta 8 adım ilerler. |
| 3 | 🐱 Scratch | 2. adım: Köpek de koşsun | Köpek sağ ok tuşuna her basışta 8 adım ilerler. |
| 4 | ❓ Test | Adil mi? | Kedi 8, Köpek 5 adım ilerlerse yarışın adil olup olmadığı sorulur. |
| 5 | 🐱 Scratch | 3. adım: Kim kazandı? 🏆 | x > 150 olunca "kazandın" sesi çalar ve kazananı söyler. |
| 6 | 🐱 Scratch | 4. adım: 3-2-1 başla! ⏱️ | Robo geri sayım yapar; başla = 1 olunca yarışçılar koşar. |
| 7 | 🐱 Scratch | ⭐ Kendi yarışın | Serbest görev: yeni yarışçı, rastgele hız ya da başka bir değişiklik. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Hazır, set, başla! 🏁
Kedi ile Köpek yarışıyor. Kedi için d tuşu, Köpek için sağ ok: her basışta ilerler. İlk bitiş çizgisine varan kazanır. Yarış 3-2-1 geri sayımıyla başlar. İki arkadaş aynı klavyede oynayabilir.

#### Adım 2 · 🐱 Scratch — 1. adım: Kedi koşsun
- Görev: Kedi: d tuşuna basılınca → x'i 8 değiştir. Ayrıca 🏁 → x: -200 y: 50'ye git, böylece her seferinde başlangıçta olur. Sahneye tıkla ve d tuşuna hızlı hızlı bas!
- Sahne: dekor `cayir`; kuklalar: Bayrak (205, 0, büyüklük 200), Kedi (-200, 50), Köpek (-200, -50)
- Bloklar: 🏁 tıklandığında, d tuşuna basılınca, x: y: konumuna git, x'i değiştir, değişken
- Hedefler:
  1) "d tuşuna basılınca" betiği yaz
  2) Kedi sağa doğru koşsun
- İpucu: Betik 1: 🏁 → x: -200 y: 50 konumuna git. Betik 2: d tuşuna basılınca → x'i 8 değiştir.
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [x: -200 y: 50 konumuna git]; [d tuşuna basılınca] → [x'i 8 değiştir]

#### Adım 3 · 🐱 Scratch — 2. adım: Köpek de koşsun
- Görev: Şimdi Köpek: sağ ok tuşuna basılınca → x'i 8 değiştir. 🏁 → x: -200 y: -50'ye git. İki arkadaş yarışsın!
- Sahne: önceki adımla aynı (Bayrak, Kedi, Köpek)
- Bloklar: önceki adımdakiler + sağ ok tuşu
- Hedefler:
  1) Köpek için "sağ ok" betiği yaz
  2) İki kukla da sağa doğru koşsun
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [x: -200 y: 50 konumuna git]; [d tuşuna basılınca] → [x'i 8 değiştir]. Köpek → [🏁 tıklandığında] → [x: -200 y: -50 konumuna git]; [sağ ok tuşuna basılınca] → [x'i 8 değiştir]

#### Adım 4 · ❓ Test — Adil mi?
- Soru: Kedi her basışta 8 adım, Köpek her basışta 5 adım ilerlerse yarış adil olur mu?
- Şıklar:
  - A) Evet, adil olur
  - B) Fark etmez, kazanan hep Köpek olur
  - C) Hayır, Kedi hep avantajlı olur ← **doğru cevap**
- Açıklama: İki oyuncu için adımlar aynı olmalı ki yarış adil olsun. Bu yüzden ikisine de 8 yazdık.

#### Adım 5 · 🐱 Scratch — 3. adım: Kim kazandı? 🏆
- Görev: İkisinin de 🏁 betiğine bitiş kuralı ekle: 🏁 → konuma git → sürekli tekrarla [eğer x > 150 ise → "kazandın" sesi → "Kedi kazandı!" de → tümünü durdur]. Köpek için de "Köpek kazandı!" yaz.
- Sahne: önceki adımla aynı
- Bloklar: 🏁 tıklandığında, konuma git, sürekli tekrarla, eğer ise, sesini başlat, de (yazı), tümünü durdur, d/sağ ok tuşları, x'i değiştir
- Hedefler:
  1) İki yarışçı için bitiş kuralı (x konumu)
  2) İlk bitiren "kazandı" desin
- İpucu: Kedi: 🏁 → x: -200 y: 50'ye git → sürekli tekrarla [eğer (x konumu) > 150 ise [kazandın sesi, Kedi kazandı! de, tümünü durdur]]. Köpek için aynısı.
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [x: -200 y: 50 konumuna git] → sürekli tekrarla [eğer x > 150 ise [kazandın sesini başlat, "Kedi kazandı!" de, tümünü durdur]]; [d tuşuna basılınca] → [x'i 8 değiştir]. Köpek → aynı yapı, "Köpek kazandı!" ve sağ ok tuşu ile.

#### Adım 6 · 🐱 Scratch — 4. adım: 3-2-1 başla! ⏱️
- Görev: Robo sunucu olsun: 🏁 → başla değişkenini 0 yap → "3", "2", "1", "Başla!" de (her biri 1 saniye) → başla değişkenini 1 yap. Yarışçılar yalnızca eğer başla = 1 ise ilerlesin: tuş betiğindeki x'i 8 değiştir bloğunu bir "eğer" içine koy.
- Sahne: dekor `cayir`; değişken: başla = 0; kuklalar: Bayrak, Robo (0, 110, büyüklük 70), Kedi, Köpek
- Bloklar: 🏁 tıklandığında, başla değişkenini yap/değiştir, de (yazı) ve bekleme, eğer ise (karşılaştırma), x'i değiştir, sürekli tekrarla, tümünü durdur
- Hedefler:
  1) Robo 3, 2, 1 ve Başla desin
  2) Yarışçılar "başla" değişkenine bakıp koşsun
  3) Yarış bitince kazanan söylensin
- İpucu: Robo: 🏁 → başla = 0 → (3) de 1 saniye … → (Başla!) de 1 saniye → başla = 1. Kedi ve Köpek: d (ya da sağ ok) tuşuna basılınca → eğer (başla) = 1 ise [x'i 8 değiştir].
- Örnek çözüm: Robo → [🏁 tıklandığında] → [başla'yı 0 yap] → ["3" de, 1 saniye] → ["2" de, 1 saniye] → ["1" de, 1 saniye] → ["Başla!" de, 1 saniye] → [başla'yı 1 yap]. Kedi → [🏁 tıklandığında] → [x: -200 y: 50 konumuna git] → sürekli tekrarla [eğer x > 150 ise [kazandın sesi, "Kedi kazandı!" de, tümünü durdur]]; [d tuşuna basılınca] → [eğer başla = 1 ise [x'i 8 değiştir]]. Köpek → aynı yapı, sağ ok tuşu ile.

#### Adım 7 · 🐱 Scratch — ⭐ Kendi yarışın
- Görev: Yarışı değiştir! Yeni bir yarışçı ekle (➕ ile balık, kuş, arı…) ve ona bir tuş ver. Ya da yarışçılara rastgele hız ver: x'i (rastgele 4 ile 12) değiştir. Şansın payı olsun! Hazır olunca ✔ Bitirdim.
- Sahne: önceki adımla aynı (Robo, Kedi, Köpek, Bayrak; başla = 0)
- Bloklar: adım 4'teki bloklar + konuma rastgele git, ↻ derece dön, büyüklük; değişken ve rastgele
- Serbest görev. Hedefler:
  1) Yarışta bir değişiklik yap (yeni yarışçı, rastgele hız ya da başka bir şey)
  2) En az iki oyuncu için tuş betiği
  3) Bir bitiş kuralı olsun
- Örnek çözüm (bir olası çözüm): Robo, Kedi ve Köpek için adım 6'daki kodlar

---

## Özet

- Bu bölümde kullanılan yeni blok ve kavramlar: iç içe tekrarla, fonksiyon (Şerit), tuş olayları (tuşuna basılınca), nota ve ses blokları, haber salma ve haber alma, klon oluşturma ve klon olarak başlama, zamanlayıcı, birleştir, değişkenler (skor, hız, can, başla), kenara geldiyse sek, fare x, eğer ise ve koşullar.
- Toplam adım: 46 (8 anlatım, 7 test, 10 ızgara, 21 scratch)
- Ek ders sayısı: 6 (Bölüm 33–38)
