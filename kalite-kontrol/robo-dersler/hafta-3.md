# Hafta 3 — Fonksiyonlar ve koşullar

> Robo ile Kodlama · 3. hafta · 4 ders × 40 dk · Bölümler 9–12

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 9 | 🧩 Kendi Bloğunu Yap | Fonksiyon | 10 | 2 anlatım, 2 test, 6 ızgara |
| 2. ders | Bölüm 10 | ❓ Eğer… ise | Koşul | 8 | 2 anlatım, 2 test, 4 ızgara |
| 3. ders | Bölüm 11 | 🔀 Eğer… Değilse | İki yol | 8 | 1 anlatım, 2 test, 5 ızgara |
| 4. ders | Bölüm 12 | ♾️ …Olana Kadar Tekrarla | Koşullu döngü | 9 | 2 anlatım, 2 test, 5 ızgara |

Toplam: 35 adım (7 anlatım, 8 test, 20 ızgara). Scratch adımı yok.

---

## 1. ders · Bölüm 9 — 🧩 Kendi Bloğunu Yap

- **Kavram:** Fonksiyon
- **Kısa açıklama:** Sık yaptığın hareketlere bir ad ver ve tek blokla çağır: fonksiyon!
- **Öğrendiklerimiz:**
  - Fonksiyon, bir grup komuta verdiğimiz addır.
  - Fonksiyonu bir kez yazar, istediğimiz kadar çağırırız.
  - Fonksiyondaki bir hatayı düzeltince, onu kullanan her yer düzelir.
- **Öğretmen notu:** Komut sözlüğü: Sınıfla “selam” adlı bir hareket uydurun: el salla + eğil + zıpla. Artık öğretmen sadece “selam!” dediğinde herkes üç hareketi birden yapar. Sonra “3 kez selam” deyin. Scratch'te bunun adı “Blok Tanımla”dır (pembe bloklar). Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Hep aynı hareketler… | Merdiven çıkarken tekrarlanan dört komut (ileri, sola dön, ileri, sağa dön) “Basamak” adlı fonksiyona alınır. |
| 2 | 📖 Anlatım | Fonksiyon nasıl yazılır? | Pembe “fonksiyonum” kutusuna adımlar yazılır, Programım'a fonksiyon bloğu eklenir, çalışınca fonksiyon adımları yapılır. |
| 3 | ❓ Test | Kaç kez döner? | Soru: Robo bu programda toplam kaç kez sağa döner? · Doğru cevap: 3 |
| 4 | 🤖 Izgara | Basamak fonksiyonu | Robo merdivenin tepesindeki pile gider; araçlar: İleri git, Sola dön, Sağa dön, Fonksiyon; çözüm: 3 × Basamak (fonksiyon: ileri, sola dön, ileri, sağa dön). |
| 5 | 🤖 Izgara | Hazır fonksiyon | Hazır “Kenar” fonksiyonu ile Robo pile gider; araçlar: İleri git, Sağa dön, Fonksiyon; çözüm: 3 × Kenar, sonra İleri git. |
| 6 | 🤖 Izgara | Bozuk fonksiyon | Program doğru, ama Basamak fonksiyonundaki dönüşler ters; fonksiyon düzeltilir; çözüm: 3 × Basamak. |
| 7 | 🤖 Izgara | Fonksiyon + döngü | Kenar fonksiyonu döngüyle yazılır, program Kenar'ı 3 kez çağırır, sonra ileri gider; araçlar: İleri git, Sağa dön, Tekrarla, Fonksiyon. |
| 8 | 🤖 Izgara | Topla fonksiyonu | Topla fonksiyonu yazılır (ileri git, yıldızı al, ileri git); program iki sıradaki yıldızları toplar; araçlar: İleri git, Sağa dön, Yıldızı al, Fonksiyon. |
| 9 | ❓ Test | Neden fonksiyon? | Soru: Fonksiyon kullanmanın en büyük faydası nedir? · Doğru cevap: Aynı adımları tekrar tekrar yazmayız; program kısalır ve düzeltmesi kolaylaşır |
| 10 | 🤖 Izgara | ⭐ Bonus: Dev merdiven | Beş basamaklı merdiven; Basamak fonksiyonu ve döngü ile en kısa program; araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Fonksiyon; çözüm: 5 × tekrarla (fonksiyon: ileri, sola dön, ileri, sağa dön). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Hep aynı hareketler…
Merdiven çıkarken hep aynı dört hareket (ileri, sola dön, ileri, sağa dön) yapılır. Bu dört komuta “Basamak” adı verilir ve tek blokla çağrılır. Buna FONKSİYON denir. Görselde: ⬆ ↰ ⬆ ↱ = 🧩

#### Adım 2 · 📖 Anlatım — Fonksiyon nasıl yazılır?
1. Sağdaki pembe “fonksiyonum” kutusuna tıklanır ve fonksiyonun adımları oraya yazılır.
2. Sonra “Programım” kutusuna tıklanıp fonksiyon bloğu (🧩) eklenir.
3. Program çalışırken fonksiyon bloğuna gelince Robo pembe kutudaki adımları yapar.

#### Adım 3 · ❓ Test — Kaç kez döner?
- Görsel: [kod: fff · FR · Köşe]
- Soru: Robo bu programda toplam kaç kez sağa döner?
- Şıklar: 1 · 2 · 3
- Doğru cevap: 3
- Açıklama: “Köşe” fonksiyonunda bir sağa dönüş var ve fonksiyon 3 kez çağrılıyor.

#### Adım 4 · 🤖 Izgara — Basamak fonksiyonu
- Görev: Pembe kutuya Basamak fonksiyonunu yaz: ileri, sola dön, ileri, sağa dön. Sonra programa 3 kez Basamak ekle. En fazla 7 blok (programdaki ve fonksiyondaki bloklar birlikte sayılır).
- Harita (yön: E/sağa bakıyor):
  ```
  ###G
  ##.*
  #.*#
  S.##
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Fonksiyon
- Fonksiyon adı: Basamak
- Maksimum blok: 7
- Örnek çözüm (program): `fff`
- Örnek çözüm (fonksiyon Basamak): `FLFR`
- İpucu: Pembe kutu: ⬆ ↰ ⬆ ↱. Programım: 🧩 🧩 🧩

#### Adım 5 · 🤖 Izgara — Hazır fonksiyon
- Görev: “Kenar” fonksiyonu hazır: 2 kez ileri, sağa dön. Sadece program yazılacak. Kenar fonksiyonu hazır olarak verilir (hazır içerik: ileri, ileri, sağa dön).
- Harita (yön: E/sağa bakıyor):
  ```
  S.*
  G#.
  *.*
  ```
- Araçlar: İleri git, Sağa dön, Fonksiyon
- Fonksiyon adı: Kenar (hazır)
- Örnek çözüm (program): `fffF`
- İpucu: 3 kez Kenar, sonra bir İleri git.

#### Adım 6 · 🤖 Izgara — Bozuk fonksiyon
- Görev: Program doğru, ama Basamak fonksiyonunda bir bug var. Fonksiyonu düzelt; bütün basamaklar birden düzelecek.
- Harita (yön: E/sağa bakıyor):
  ```
  ###G
  ##.*
  #.*#
  S.##
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Fonksiyon
- Fonksiyon adı: Basamak
- Başlangıç programı (hazır): `fff`
- Hazır fonksiyon (hatalı): `FRFL`
- Örnek çözüm (program): `fff`
- Örnek çözüm (fonksiyon Basamak): `FLFR`
- İpucu: Fonksiyonda dönüşler ters: önce sola, sonra sağa dönmeli.

#### Adım 7 · 🤖 Izgara — Fonksiyon + döngü
- Görev: Kenar fonksiyonunu kendin yaz: 4 kez ileri, sağa dön (fonksiyonun içinde döngü olabilir). Sonra programda Kenar'ı döngüyle çağır. En fazla 7 blok (fonksiyondaki bloklar da sayılır).
- Harita (yön: E/sağa bakıyor):
  ```
  S...*
  G~~~.
  .~~~.
  .~~~.
  *...*
  ```
- Araçlar: İleri git, Sağa dön, Tekrarla, Fonksiyon
- Fonksiyon adı: Kenar
- Maksimum blok: 7
- Döngü sayısı: 4
- Örnek çözüm (program): `3(f)3(F)`
- Örnek çözüm (fonksiyon Kenar): `4(F)R`
- İpucu: Kenar = 🔁 4 × ⬆, ↱. Programım = 🔁 3 × Kenar, sonra 🔁 3 × ⬆.

#### Adım 8 · 🤖 Izgara — Topla fonksiyonu
- Görev: Topla fonksiyonu yaz: ileri git, yıldızı al, ileri git. Sonra iki sıradaki bütün yıldızları topla.
- Harita (yön: E/sağa bakıyor):
  ```
  S*.*.
  G*.*.
  ```
- Araçlar: İleri git, Sağa dön, Yıldızı al, Fonksiyon
- Fonksiyon adı: Topla
- Ek: Yıldızlar toplanmalı (pick)
- Örnek çözüm (program): `ffRFRff`
- Örnek çözüm (fonksiyon Topla): `FPF`
- İpucu: Topla = ⬆ ✋ ⬆. Programım: Topla, Topla, ↱, ⬆, ↱, Topla, Topla.

#### Adım 9 · ❓ Test — Neden fonksiyon?
- Soru: Fonksiyon kullanmanın en büyük faydası nedir?
- Şıklar: Robo daha hızlı koşar · Aynı adımları tekrar tekrar yazmayız; program kısalır ve düzeltmesi kolaylaşır · Pil daha çok dolar
- Doğru cevap: Aynı adımları tekrar tekrar yazmayız; program kısalır ve düzeltmesi kolaylaşır (2. şık)
- Açıklama: Bir kez yaz, istediğin kadar kullan! Hata varsa tek bir yerde düzeltirsin.

#### Adım 10 · 🤖 Izgara — ⭐ Bonus: Dev merdiven
- Görev: Beş basamak! Basamak fonksiyonu ve bir döngü ile en kısa programı yaz. En fazla 6 blok (fonksiyondaki bloklar da sayılır).
- Harita (yön: E/sağa bakıyor):
  ```
  #####G
  ####..
  ###..#
  ##..##
  #..###
  S.####
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Fonksiyon
- Fonksiyon adı: Basamak
- Maksimum blok: 6
- Döngü sayısı: 5
- Örnek çözüm (program): `5(f)`
- Örnek çözüm (fonksiyon Basamak): `FLFR`

---

## 2. ders · Bölüm 10 — ❓ Eğer… ise

- **Kavram:** Koşul
- **Kısa açıklama:** Robo artık etrafını görebiliyor! “Eğer” bloğu ile duruma göre karar ver.
- **Öğrendiklerimiz:**
  - Koşul, cevabı “evet” ya da “hayır” olan bir sorudur.
  - “Eğer … ise” bloğunun içindekiler sadece koşul doğruysa çalışır.
  - Koşullar sayesinde aynı program farklı haritalarda çalışabilir.
- **Öğretmen notu:** Eğer oyunu: “Eğer gözlüğün varsa ayağa kalk.” “Eğer adında A harfi varsa el çırp.” Öğrenciler sadece koşul kendilerine uyuyorsa hareket eder. Sonra öğrenciler kendi “eğer” cümlelerini kursun. Bu Scratch'teki turuncu “eğer” bloğudur. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Robo'nun gözleri var! 👀 | Robo'nun sensörleri olduğu ve “eğer” kavramı (yağmur yağıyorsa şemsiye) anlatılır. |
| 2 | ❓ Test | Günlük hayatta eğer | Soru: Eğer trafik ışığı kırmızıysa ne yaparız? · Doğru cevap: Dururuz |
| 3 | 📖 Anlatım | Haritayı bilmiyorsak? | Yıldızların yeri haritadan haritaya değiştiği için “eğer yıldızın üstündeyim ise: Yıldızı al” kuralı tanıtılır; haritalar arası geçiş ve ▶ Çalıştır anlatılır. |
| 4 | 🤖 Izgara | Yıldız varsa al | Her karede eğer yıldız varsa al; 3 haritada da çalışmalı; araçlar: İleri git, Yıldızı al, Tekrarla, Eğer…ise; çözüm: 6 × (İleri git, eğer yıldız varsa al). |
| 5 | ❓ Test | Kaç yıldız alır? | Soru: Robo bu programla kaç yıldız alır? · Doğru cevap: 1 |
| 6 | 🤖 Izgara | Engel varsa dön | Yol haritadan haritaya değişen yerde sağa dönülür; eğer önünde engel varsa sağa dön, sonra ileri git; araçlar: İleri git, Sağa dön, Tekrarla, Eğer…ise; çözüm: 5 × (eğer engel varsa sağa dön; ileri git). |
| 7 | 🤖 Izgara | Halka bahçe | İç içe döngü ve “eğer” ile yıldızlar toplanır; araçlar: İleri git, Sağa dön, Yıldızı al, Tekrarla, Eğer…ise; çözüm: 3 × [2 × (ileri git, eğer yıldız varsa al), sağa dön], sonra ileri git. |
| 8 | 🤖 Izgara | ⭐ Bonus: Köşe nerede? | Yol farklı yerlerde aşağı kıvrılıyor; hep sağa dönülür, yıldızlar da alınır; araçlar: İleri git, Sağa dön, Yıldızı al, Tekrarla, Eğer…ise; çözüm: 6 × (eğer engel varsa sağa dön; ileri git; eğer yıldız varsa al). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Robo'nun gözleri var! 👀
Robo'nun sensörleri var: önünde engel var mı, yıldızın üstünde miyim, pile ulaştım mı görebiliyor. İnsanların da günlük hayatta karar verdiği anlatılır: “Eğer yağmur yağıyorsa şemsiye alırsın, yağmıyorsa almazsın.”
Görsel: 🌧️ ➡️ ☔ · ☀️ ➡️ 🚫☔

#### Adım 2 · ❓ Test — Günlük hayatta eğer
- Soru: Eğer trafik ışığı kırmızıysa ne yaparız?
- Şıklar: Koşarak geçeriz · Zıplarız · Dururuz
- Doğru cevap: Dururuz (3. şık)
- Açıklama: Koşul: “ışık kırmızı mı?” Cevap evet ise dururuz.

#### Adım 3 · 📖 Anlatım — Haritayı bilmiyorsak?
Her görevde birkaç harita var ve program hepsinde çalışmalı. Yıldızlar haritadan haritaya değiştiği için program şöyle yazılır: “eğer yıldızın üstündeyim ise: Yıldızı al”. Haritaların üstündeki sekmelere tıklanarak hepsine bakılabilir; ▶ Çalıştır hepsini sırayla dener.

#### Adım 4 · 🤖 Izgara — Yıldız varsa al
- Görev: Her karede eğer yıldız varsa al. Aynı program 3 haritada da çalışmalı. En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S*.*..G
  ```
  ```
  S..**.G
  ```
  ```
  S.*..*G
  ```
- Araçlar: İleri git, Yıldızı al, Tekrarla, Eğer…ise
- Koşullar: yıldızın üstündeyim, önüm açık, önümde engel var
- Ek: Yıldızlar toplanmalı (pick)
- Maksimum blok: 4
- Döngü sayısı: 6
- Örnek çözüm: `6(Fi{star}(P))`
- İpucu: 6 kez tekrarla [İleri git, eğer yıldızın üstündeyim ise: Yıldızı al].

#### Adım 5 · ❓ Test — Kaç yıldız alır?
- Görsel: [harita: S*.*] [kod: 3(Fi{star}(P))]
- Soru: Robo bu programla kaç yıldız alır?
- Şıklar: 1 · 2 · 3
- Doğru cevap: 2
- Açıklama: Her adımdan sonra bakıyor: 1. ve 3. karede yıldız var, 2. karede yok. (Not: doğru cevap 2. şıktır; kaynak “1 · 2 · 3” şıklarını ve doğru cevabı 2 olarak tanımlar.)

#### Adım 6 · 🤖 Izgara — Engel varsa dön
- Görev: Yol bir yerde sağa dönüyor ama nerede döndüğü haritadan haritaya değişiyor. Eğer önünde engel varsa sağa dön, sonra ileri git. En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S..
  ##.
  ##.
  ##G
  ```
  ```
  S.
  #.
  #.
  #.
  #G
  ```
  ```
  S....
  ####G
  ```
- Araçlar: İleri git, Sağa dön, Tekrarla, Eğer…ise
- Koşullar: önümde engel var, önüm açık, yıldızın üstündeyim
- Maksimum blok: 4
- Döngü sayısı: 5
- Örnek çözüm: `5(i{blocked}(R)F)`
- İpucu: 5 kez tekrarla [eğer önümde engel var ise: Sağa dön; İleri git].

#### Adım 7 · 🤖 Izgara — Halka bahçe
- Görev: Yıldızlar her haritada farklı köşelerde. İç içe döngü ve “eğer” kullan. En fazla 8 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S.*
  G#.
  *..
  ```
  ```
  S..
  G#*
  ..*
  ```
  ```
  S*.
  G#.
  .*.
  ```
- Araçlar: İleri git, Sağa dön, Yıldızı al, Tekrarla, Eğer…ise
- Koşullar: yıldızın üstündeyim, önüm açık, önümde engel var
- Ek: Yıldızlar toplanmalı (pick)
- Maksimum blok: 8
- Döngü sayısı: 3
- Örnek çözüm: `3(2(Fi{star}(P))R)F`
- İpucu: 3 kez [2 kez (İleri git, eğer yıldız varsa al), Sağa dön], sonra İleri git.

#### Adım 8 · 🤖 Izgara — ⭐ Bonus: Köşe nerede?
- Görev: Her haritada yol farklı yerde aşağı kıvrılıyor ama hep sağa dönülüyor. Yıldızları da unutma! En fazla 6 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S.*..
  ####*
  ####G
  ```
  ```
  S*.
  ##.
  ##*
  ##.
  ##G
  ```
  ```
  S...*
  ####.
  ####G
  ```
- Araçlar: İleri git, Sağa dön, Yıldızı al, Tekrarla, Eğer…ise
- Koşullar: yıldızın üstündeyim, önümde engel var, önüm açık
- Ek: Yıldızlar toplanmalı (pick)
- Maksimum blok: 6
- Döngü sayısı: 6
- Örnek çözüm: `6(i{blocked}(R)Fi{star}(P))`
- İpucu: Her turda: eğer engel varsa sağa dön; ileri git; eğer yıldız varsa al.

---

## 3. ders · Bölüm 11 — 🔀 Eğer… Değilse

- **Kavram:** İki yol
- **Kısa açıklama:** Koşul doğruysa bir şey, yanlışsa başka bir şey yap. Çatallı yollarda doğru kararı ver!
- **Öğrendiklerimiz:**
  - “Eğer … değilse” bloğunda iki bölüm vardır: biri “evet”, biri “hayır” için.
  - Programda her zaman iki yoldan biri çalışır, ikisi birden asla.
  - Sol ve sağ sensörleriyle Robo yol ayrımlarında karar verebilir.
- **Öğretmen notu:** Evet–hayır kapısı: Sınıfın ortasına hayali bir kapı koyun. Öğretmen bir koşul söyler (“Eğer bugün spor ayakkabı giydiysen sağ kapıdan, değilse sol kapıdan geç”). Herkes koşula göre bir kapıdan geçer. Kimse iki kapıdan birden geçemez! Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | İki yol ayrımı | “Eğer … ise … değilse …” bloğunun iki bölmesi olduğu anlatılır: koşul doğruysa üstteki, yanlışsa alttaki çalışır. |
| 2 | ❓ Test | Hangisi çalışır? | Önünde ağaç varken `e{open}(F)(R)` çalışınca ne olur? · Doğru cevap: Sağa döner |
| 3 | 🤖 Izgara | Açıksa git, değilse dön | Önü açıksa ileri git, değilse sağa dön; 3 haritada da çalışmalı; araçlar: İleri git, Sağa dön, Tekrarla, Eğer…değilse; çözüm: 6 × (eğer önüm açık ise İleri git, değilse Sağa dön). |
| 4 | 🤖 Izgara | Al ya da ilerle | Yıldızın üstündeyse al, değilse ilerle; 2 yıldız var; araçlar: İleri git, Yıldızı al, Tekrarla, Eğer…değilse; çözüm: 8 × (eğer yıldızın üstündeyim ise Yıldızı al, değilse İleri git). |
| 5 | ❓ Test | Kaç tur? | Neden tam 8 tur gerekti? · Doğru cevap: 6 kez ileri + 2 kez yıldız alma = 8 |
| 6 | 🤖 Izgara | Sağ mı, sol mu? | Yol ayrımında eğer solun açıksa sola, değilse sağa dön; araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Eğer…değilse; çözüm: 2 × İleri git, eğer solum açık ise Sola dön, değilse Sağa dön, sonra İleri git. |
| 7 | 🤖 Izgara | Kıvrımlı yollar | Önün açıksa ilerle; değilse sol açıksa sola, değilse sağa dön (iç içe “eğer”); araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Eğer…değilse; çözüm: 9 × (eğer önüm açık ise İleri git, değilse (eğer solum açık ise Sola dön, değilse Sağa dön)). |
| 8 | 🤖 Izgara | ⭐ Bonus: Yıldızlı çatal | İki haritada yol farklı yöne gidiyor; açıksa ilerle, değilse uygun yöne dön; yıldız varsa al; çözüm: 6 × (eğer önüm açık ise İleri git, değilse (eğer solum açık ise Sola dön, değilse Sağa dön), eğer yıldız varsa al). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — İki yol ayrımı
Eğer yağmur yağıyorsa şemsiye alınır, değilse güneş gözlüğü takılır. “Eğer … ise … değilse …” bloğunun iki bölmesi vardır. Koşul doğruysa üstteki, yanlışsa alttaki bölme çalışır. Robo her seferinde sadece birini yapar.
Görsel: ❓ · ↗️ ☔ · ↘️ 😎

#### Adım 2 · ❓ Test — Hangisi çalışır?
- Görsel: [kod: e{open}(F)(R)]
- Soru: Robo'nun önünde bir ağaç var. Bu blok çalışınca ne olur?
- Şıklar: Sağa döner · İleri gider · Hem ileri gider hem sağa döner
- Doğru cevap: Sağa döner (1. şık)
- Açıklama: Önü açık değil, yani koşul yanlış. Bu yüzden “değilse” bölmesindeki Sağa dön çalışır.

#### Adım 3 · 🤖 Izgara — Açıksa git, değilse dön
- Görev: Önü açıksa ileri git, değilse sağa dön. Aynı program 3 haritada da çalışmalı. En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S..
  ##.
  ##G
  ```
  ```
  S.
  #.
  #G
  ```
  ```
  S...
  ###G
  ```
- Araçlar: İleri git, Sağa dön, Tekrarla, Eğer…değilse
- Koşullar: önüm açık, önümde engel var
- Maksimum blok: 4
- Döngü sayısı: 6
- Örnek çözüm: `6(e{open}(F)(R))`
- İpucu: 6 kez tekrarla [eğer önüm açık ise İleri git, değilse Sağa dön].

#### Adım 4 · 🤖 Izgara — Al ya da ilerle
- Görev: Yıldızın üstündeysen al, değilsen ilerle. Bütün haritalarda 2 yıldız var. En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S*..*.G
  ```
  ```
  S..*.*G
  ```
  ```
  S.**..G
  ```
- Araçlar: İleri git, Yıldızı al, Tekrarla, Eğer…değilse
- Koşullar: yıldızın üstündeyim, önüm açık
- Ek: Yıldızlar toplanmalı (pick)
- Maksimum blok: 4
- Döngü sayısı: 8
- Örnek çözüm: `8(e{star}(P)(F))`
- İpucu: 8 kez tekrarla [eğer yıldızın üstündeyim ise Yıldızı al, değilse İleri git].

#### Adım 5 · ❓ Test — Kaç tur?
- Soru: Bir önceki görevde neden tam 8 tur gerekti?
- Şıklar: Çünkü 8 şanslı sayıdır · Çünkü 6 kez ileri + 2 kez yıldız alma = 8 · Çünkü harita 8 kare
- Doğru cevap: Çünkü 6 kez ileri + 2 kez yıldız alma = 8 (2. şık)
- Açıklama: Her turda ya bir adım ya bir yıldız. 6 adım + 2 yıldız = 8 tur.

#### Adım 6 · 🤖 Izgara — Sağ mı, sol mu?
- Görev: Yol ayrımına gelince eğer solun açıksa sola, değilse sağa dön. En fazla 6 blok.
- Haritalar (yön: N/yukarı bakıyor):
  ```
  G.#
  #.#
  #S#
  ```
  ```
  #.G
  #.#
  #S#
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Eğer…değilse
- Koşullar: solum açık, sağım açık, önüm açık, önümde engel var
- Maksimum blok: 6
- Eğer koşulu: solum açık
- Örnek çözüm: `2(F)e{left}(L)(R)F`
- İpucu: 2 kez İleri git. Eğer solum açık ise Sola dön, değilse Sağa dön. Sonra İleri git.

#### Adım 7 · 🤖 Izgara — Kıvrımlı yollar
- Görev: Yol bazen sola, bazen sağa kıvrılıyor. Önün açıksa ilerle; değilse sol açıksa sola, değilse sağa dön. (Bir “eğer”in içine başka bir “eğer” konabilir.)
- Haritalar (her harita kendi yönüyle):
  - Harita 1 (yön: E/sağa bakıyor):
    ```
    S..
    ##.
    G..
    ```
  - Harita 2 (yön: W/sola bakıyor):
    ```
    ..G
    .##
    ..S
    ```
  - Harita 3 (yön: E/sağa bakıyor):
    ```
    S.#
    #..
    ##G
    ```
- Araçlar: İleri git, Sola dön, Sağa dön, Tekrarla, Eğer…değilse
- Koşullar: önüm açık, solum açık, sağım açık, önümde engel var
- Döngü sayısı: 9
- Örnek çözüm: `9(e{open}(F)(e{left}(L)(R)))`
- İpucu: 9 kez tekrarla [eğer önüm açık ise İleri git, değilse (eğer solum açık ise Sola dön, değilse Sağa dön)].

#### Adım 8 · 🤖 Izgara — ⭐ Bonus: Yıldızlı çatal
- Görev: İki haritada da yol farklı yöne gidiyor, yıldızlar farklı yerlerde. Hepsini topla!
- Haritalar (yön: N/yukarı bakıyor):
  ```
  G*.#
  ##.#
  ##S#
  ```
  ```
  #.*G
  #.##
  #S##
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Yıldızı al, Tekrarla, Eğer…ise, Eğer…değilse
- Koşullar: önüm açık, solum açık, sağım açık, yıldızın üstündeyim, önümde engel var
- Ek: Yıldızlar toplanmalı (pick)
- Döngü sayısı: 6
- Örnek çözüm: `6(e{open}(F)(e{left}(L)(R))i{star}(P))`
- İpucu: Her turda: açıksa ilerle, değilse uygun yöne dön; sonra yıldız varsa al.

---

## 4. ders · Bölüm 12 — ♾️ …Olana Kadar Tekrarla

- **Kavram:** Koşullu döngü
- **Kısa açıklama:** Kaç kez tekrar edeceğini bilmiyorsan, bir şey olana kadar tekrarla! Robo'nun son macerası.
- **Öğrendiklerimiz:**
  - “… olana kadar tekrarla” bloğu koşul doğru olana kadar döner.
  - Kaç tur gerektiğini bilmediğimizde çok işe yarar.
  - Koşul hiç doğru olmazsa döngü bitmez: buna sonsuz döngü denir.
- **Öğretmen notu:** Bardak doldurma: Bir öğrenci boş bir bardağa sürahiden su doldursun. “Kaç saniye dökeceksin?” diye sorun; bilemez. Doğru algoritma: “Bardak dolana kadar dök.” Sonra “bardak hiç dolmazsa ne olur?” diye sorup sonsuz döngüyü konuşun. Paylaşılan bilgisayar: Bir öğrenci “sürücü” (fareyi kullanır), diğeri “yol gösterici” olsun; her görevde yer değiştirsinler. Kendi haritanı çiz: Kareli kâğıda bir harita çizip arkadaşına çözdürebilirler.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kaç kez bilmiyorsam? | Bardak dolana kadar dökülür benzetmesiyle “pile ulaştım olana kadar tekrarla: İleri git” kavramı anlatılır. |
| 2 | 🤖 Izgara | Her boy koridor | Üç haritada farklı uzunlukta koridor; tek program hepsinde çalışmalı; araçlar: İleri git, Tekrarla, Olana kadar tekrarla; çözüm: pile ulaşana kadar (ileri git). |
| 3 | ❓ Test | Sonsuz döngü! | Robo `u{goal}(L)` programını çalıştırırsa ne olur? · Doğru cevap: Hiç ilerlemez, sonsuza kadar döner |
| 4 | 🤖 Izgara | Toplayarak git | Pile ulaşana kadar ileri git, yıldız varsa al; araçlar: İleri git, Yıldızı al, Olana kadar tekrarla, Eğer…ise; çözüm: pile ulaşana kadar (ileri git, eğer yıldız varsa al). |
| 5 | 🤖 Izgara | Köşeli yollar | Pile ulaşana kadar engel varsa sağa dön, ileri git; araçlar: İleri git, Sağa dön, Olana kadar tekrarla, Eğer…ise; çözüm: pile ulaşana kadar (eğer engel varsa sağa dön; ileri git). |
| 6 | 🤖 Izgara | Sarmal | Sarmal, bu sefer en fazla 4 blokla çözülecek; araçlar: İleri git, Sağa dön, Olana kadar tekrarla, Eğer…ise; çözüm: pile ulaşana kadar (eğer engel varsa sağa dön; ileri git). |
| 7 | ❓ Test | Hangi döngü? | Duvara değene kadar yürüyen karakter için hangi blok uygun? · Doğru cevap: 🔁 duvara değene kadar tekrarla |
| 8 | 🤖 Izgara | ⭐ Bonus: Labirent ustası (sağ el kuralı) | Sağ el kuralıyla labirentten çıkış; araçlar: İleri git, Sola dön, Sağa dön, Olana kadar tekrarla, Eğer…değilse; çözüm: pile ulaşana kadar (eğer sağım açık ise (Sağa dön, İleri git), değilse (eğer önüm açık ise İleri git, değilse Sola dön)). |
| 9 | 📖 Anlatım | Robo'nun bütün sırlarını öğrendin! 🏆 | Sıralama, döngü, fonksiyon ve koşulların gerçek programcıların da kullandığı fikirler olduğu söylenir; gelecek hafta Scratch dünyasına geçileceği duyurulur. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kaç kez bilmiyorsam?
Bardağa su koyarken “7 saniye dök” denmez, bardak dolana kadar dökülür. Robo için de: “pile ulaştım olana kadar tekrarla: İleri git”. Robo her turdan önce “Pile ulaştım mı?” diye sorar; cevap evet olunca durur.
Görsel: 🥛 ⏳ ✅

#### Adım 2 · 🤖 Izgara — Her boy koridor
- Görev: Üç haritada koridorların boyu farklı. Tek bir program hepsinde çalışsın. En fazla 2 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S..G
  ```
  ```
  S......G
  ```
  ```
  S.G
  ```
- Araçlar: İleri git, Tekrarla, Olana kadar tekrarla
- Koşullar: pile ulaştım, önüm açık, önümde engel var
- Maksimum blok: 2
- Örnek çözüm: `u{goal}(F)`
- İpucu: “pile ulaştım olana kadar tekrarla” bloğunun içine İleri git koy. Neden 🔁 sayılı döngü işe yaramıyor?

#### Adım 3 · ❓ Test — Sonsuz döngü!
- Görsel: [harita: S..G] [kod: u{goal}(L)]
- Soru: Robo bu programı çalıştırırsa ne olur?
- Şıklar: Pile ulaşır · Suya düşer · Hiç ilerlemez, sonsuza kadar döner
- Doğru cevap: Hiç ilerlemez, sonsuza kadar döner (3. şık)
- Açıklama: Robo sadece dönüyor, hiç ilerlemiyor. Pile hiç ulaşamayacağı için döngü bitmez: bu bir sonsuz döngü!

#### Adım 4 · 🤖 Izgara — Toplayarak git
- Görev: Pile ulaşana kadar: ileri git, yıldız varsa al. Haritaların boyu ve yıldızlar farklı! En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S.*..*G
  ```
  ```
  S*G
  ```
  ```
  S..*....G
  ```
- Araçlar: İleri git, Yıldızı al, Olana kadar tekrarla, Eğer…ise
- Koşullar: pile ulaştım, yıldızın üstündeyim, önüm açık, önümde engel var
- Ek: Yıldızlar toplanmalı (pick)
- Maksimum blok: 4
- Örnek çözüm: `u{goal}(Fi{star}(P))`

#### Adım 5 · 🤖 Izgara — Köşeli yollar
- Görev: Pile ulaşana kadar: engel varsa sağa dön, ileri git. Her haritada yol farklı! En fazla 4 blok.
- Haritalar (yön: E/sağa bakıyor):
  ```
  S..
  ##.
  ##G
  ```
  ```
  S...
  ###.
  G...
  ```
  ```
  S.
  #.
  #.
  #G
  ```
- Araçlar: İleri git, Sağa dön, Olana kadar tekrarla, Eğer…ise
- Koşullar: pile ulaştım, önümde engel var, önüm açık
- Maksimum blok: 4
- Eğer koşulu: önümde engel var
- Örnek çözüm: `u{goal}(i{blocked}(R)F)`

#### Adım 6 · 🤖 Izgara — Sarmal
- Görev: Sarmalı geçen hafta 9 blokla çözmüştük. Şimdi en fazla 4 blok ile dene!
- Harita (yön: E/sağa bakıyor):
  ```
  S....
  ####.
  ..G#.
  .###.
  .....
  ```
- Araçlar: İleri git, Sağa dön, Olana kadar tekrarla, Eğer…ise
- Koşullar: pile ulaştım, önümde engel var, önüm açık
- Maksimum blok: 4
- Eğer koşulu: önümde engel var
- Örnek çözüm: `u{goal}(i{blocked}(R)F)`

#### Adım 7 · ❓ Test — Hangi döngü?
- Soru: Bir oyunda karakter duvara değene kadar yürüsün istiyoruz. Hangi blok uygun?
- Şıklar: 🔁 duvara değene kadar tekrarla · 🔁 10 kez tekrarla · Döngüye gerek yok
- Doğru cevap: 🔁 duvara değene kadar tekrarla (1. şık)
- Açıklama: Kaç adım süreceğini bilmiyoruz, o yüzden “… olana kadar tekrarla”. Scratch'te bu bloğun aynısı var!

#### Adım 8 · 🤖 Izgara — ⭐ Bonus: Labirent ustası (sağ el kuralı)
- Görev: Labirentten çıkmanın kuralı: sağ elini duvardan hiç ayırma! Sağın açıksa sağa dön ve ilerle; değilse önün açıksa ilerle; o da değilse sola dön. (Sağ el kuralı.)
- Haritalar (yön: E/sağa bakıyor):
  ```
  S.#...
  #...#.
  #.#.#.
  ..#..G
  ```
  ```
  S..#G
  .#...
  .#.#.
  ...#.
  ```
- Araçlar: İleri git, Sola dön, Sağa dön, Olana kadar tekrarla, Eğer…değilse
- Koşullar: pile ulaştım, sağım açık, önüm açık, solum açık, önümde engel var
- Maksimum blok: sınır yok (kaynakta `max` tanımlı değil)
- Eğer koşulu: sağım açık
- Örnek çözüm: `u{goal}(e{right}(RF)(e{open}(F)(L)))`
- İpucu: pile ulaşana kadar [eğer sağım açık ise (Sağa dön, İleri git) değilse (eğer önüm açık ise İleri git değilse Sola dön)].

#### Adım 9 · 📖 Anlatım — Robo'nun bütün sırlarını öğrendin! 🏆
Sıralama, döngü, fonksiyon, koşul… Bunlar gerçek programcıların her gün kullandığı fikirler. Gelecek hafta Scratch dünyasına geçilecek: kuklalar, sesler, renkler ve kendi oyunlar. Aynı bloklarla orada da karşılaşılacak.
Görsel: 🤖 ➡️ 🐱 🎮 🎨

---

## Hafta özeti
- Bu haftada kullanılan yeni bloklar/komutlar: Fonksiyon (🧩 Blok Tanımla / fonksiyonum), Eğer…ise (❓), Eğer…değilse (🔀, iki bölmeli), Olana kadar tekrarla (🔁 …olana kadar tekrarla). Koşul adları: yıldızın üstündeyim, önüm açık, önümde engel var, solum açık, sağım açık, pile ulaştım.
- Toplam adım: 35 (7 anlatım, 8 test, 20 ızgara/scratch; scratch adımı yok)
