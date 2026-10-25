# Hafta 8 — Scratch ustalığı: soru, matematik, klonlar

> Robo ile Kodlama · 8. hafta · 4 ders × 40 dk · Bölümler 29–32

Kaynak: `src/robot/lessons/h8.js` (b29, b30, b31, b32). Blok adları: `src/robot/sahne/blocks.js`.
Bu raporda `[...]` köşeli parantezi Scratch bloğunu, `(...)` ise kutu/değer blokunu (cevap, birleştir, işlem, rastgele, değişken) gösterir.

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm 29 | 💬 Sor ve Cevapla | Girdi (cevap) | 7 | 1 anlatım, 1 test, 5 Scratch |
| 2. ders | Bölüm 30 | ➗ Matematik İşlemleri | Operatörler | 7 | 1 anlatım, 1 test, 5 Scratch |
| 3. ders | Bölüm 31 | 👯 Klonlar | Klon | 6 | 1 anlatım, 1 test, 4 Scratch |
| 4. ders | Bölüm 32 | 👾 Oyun 4: Uzay Savaşçısı | Klonlarla oyun | 7 | 2 anlatım, 5 Scratch |

---

## 1. ders · Bölüm 29 — 💬 Sor ve Cevapla

- **Kavram:** Girdi (cevap)
- **Kısa açıklama:** Kuklalar soru sorsun, sen yaz! Cevaba göre konuşan karakterler ve bilgi yarışmaları yap.
- **Öğrendiklerimiz:**
  - “… diye sor ve bekle” bloğu sahnede bir yazı kutusu açar ve cevabı bekler.
  - Yazılan cevap “cevap” bloğunda saklanır.
  - Cevabı “eğer” ile karşılaştırarak doğru-yanlış kontrolü yapabiliriz.
- **Öğretmen notu:** Canlı bilgi yarışması: Bir öğrenci “sunucu kukla” olsun ve önceden yazılmış soruları sorsun. Cevaba göre “Doğru! +1 puan” ya da “Yanlış” desin; tahtada skor tutulsun. Sonra öğrenciler kendi yarışmalarını Scratch'te kodlasın ve soruları birbirlerine sorsun.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklalar soru soruyor! 💬 | “Diye sor ve bekle” bloğu ve cevap kutusu anlatılır. |
| 2 | 🐱 Scratch | Tanışalım | Kedi adı sorar, “Merhaba …” der (cevap birleştirilir). |
| 3 | ❓ Test | Cevap nerede? | Yazılan cevabın saklandığı yer soruluyor. |
| 4 | 🐱 Scratch | Bilgi yarışması | Robo başkent sorar; doğruysa skor artar, değilse “Yanlış”. |
| 5 | 🐱 Scratch | Üç soruluk yarışma 🏆 | Üç soru sorulur, doğru cevaplar skoru artırır, sonunda puan söylenir. |
| 6 | 🐱 Scratch | Şifreli kapı 🔐 | Doğru şifre girilene kadar sorulur, sonra “Kapı açıldı!” denir. |
| 7 | 🐱 Scratch | ⭐ Kendi yarışman | Öğrenci kendi yarışmasını yapar (en az 3 soru, skor, puan). |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklalar soru soruyor! 💬
Şimdiye kadar kuklalar konuşuyordu; şimdi sıra öğrencide. “[Adın ne? diye sor ve bekle]” bloğu sahnenin altında bir yazı kutusu açar, öğrenci cevabını yazıp ✔'e basar. Yazılan cevap “(cevap)” bloğunda saklanır ve ▾ düğmesinden seçilebilir. Görseller: ❓ ⌨️ 💬 ✅.

#### Adım 2 · 🐱 Scratch — Tanışalım
- Görev: Kedi adını sorsun, sonra “Merhaba …” desin. Konuşma yazısında ▾ düğmesinden **birleştir** seçilir: ilk kutuya “Merhaba ”, ikinci kutuya ▾ ile **cevap** konur.
- Sahne: dekor `cayir`; kuklalar: Kedi (0, -60)
- Bloklar: [🏁 tıklandığında], [bu kukla tıklanınca], [“…” diye sor ve bekle], [… de], [… de N saniye], [… diye düşün N saniye], [eğer … ise], [eğer … ise … değilse], [… olana kadar tekrarla], [N kez tekrarla], [değişkenini … yap], [değişkenini … değiştir], [N saniye bekle], [… sesini başlat], [sonraki kostüm], [… haberini sal], [… haberini aldığımda], [tümünü durdur]; kutular: (cevap), (birleştir)
- Hedefler: 1) “sor ve bekle” kullan 2) Kedi cevabını kullanarak konuşsun
- İpucu: 🏁 → “Adın ne?” diye sor ve bekle → (birleştir “Merhaba ” (cevap)) de 2 saniye
- Örnek çözüm:
  1. Kedi → [🏁 tıklandığında]
  2. [“Adın ne?” diye sor ve bekle]
  3. [(birleştir “Merhaba ” (cevap)) de 2 saniye]

#### Adım 3 · ❓ Test — Cevap nerede?
- Soru: Oyuncu soruya “kırmızı” yazdı. Bu yazı nerede saklanır?
- Şıklar: A) Kostümde · B) Dekorda · C) “cevap” bloğunda
- Doğru cevap: C) “cevap” bloğunda
- Açıklama: Son yazılan cevap “cevap” bloğunda durur. Yeni bir soru sorulunca yenisiyle değişir.

#### Adım 4 · 🐱 Scratch — Bilgi yarışması
- Görev: Robo “Türkiye'nin başkenti neresi?” diye sorsun. Cevap **Ankara** ise “Doğru! 🎉” desin ve skoru 1 artırsın; değilse “Yanlış, cevap Ankara” desin. Koşulda “karşılaştır” seçilir: sol tarafa (cevap), sağ tarafa Ankara. Büyük-küçük harf fark etmez (metin notu).
- Sahne: dekor `sahne`; değişken: skor = 0; kuklalar: Robo (0, -60), boyut 120
- Bloklar: [🏁 tıklandığında], [“…” diye sor ve bekle], [… de N saniye], [eğer … ise … değilse], [değişkenini … yap], [değişkenini … değiştir], [… sesini başlat] vb. (ASK seti); kutular: (cevap), (birleştir), (değişken); koşul: karşılaştır
- Hedefler: 1) “eğer … değilse” kullan 2) Doğru cevapta “Doğru” desin 3) Doğru cevapta skor artsın
- İpucu: yok
- Örnek çözüm (Robo):
  1. [🏁 tıklandığında]
  2. [skor değişkenini 0 yap]
  3. [“Türkiye'nin başkenti neresi?” diye sor ve bekle]
  4. [eğer (cevap) = Ankara ise]: [… sesini başlat: Kazandın] → [“Doğru! 🎉” de 2 saniye] → [skor değişkenini 1 değiştir]
  5. [değilse]: [“Yanlış, cevap Ankara” de 2 saniye]

#### Adım 5 · 🐱 Scratch — Üç soruluk yarışma 🏆
- Görev: Üç soru sor, her doğru cevapta skoru artır. Sonunda “Puanın: …” desin (birleştir + skor).
- Sorular: Türkiye'nin başkenti? (Ankara) · 3 + 4 kaç eder? (7) · Gökyüzü ne renk? (mavi)
- Sahne: dekor `sahne`; değişken: skor = 0; kuklalar: Robo (0, -60), boyut 120
- Bloklar: ASK seti + [eğer … ise], (cevap), (birleştir), (değişken); koşul: karşılaştır
- Hedefler: 1) En az üç soru sor 2) En az 2 doğru cevapla 3) Sonunda puanı söylesin
- İpucu: yok
- Örnek çözüm (Robo):
  1. [🏁 tıklandığında]
  2. [skor değişkenini 0 yap]
  3. [“Türkiye'nin başkenti?” diye sor ve bekle] → [eğer (cevap) = Ankara ise: skor değişkenini 1 değiştir]
  4. [“3 + 4 kaç eder?” diye sor ve bekle] → [eğer (cevap) = 7 ise: skor değişkenini 1 değiştir]
  5. [“Gökyüzü ne renk?” diye sor ve bekle] → [eğer (cevap) = mavi ise: skor değişkenini 1 değiştir]
  6. [(birleştir “Puanın: ” (skor)) de 2 saniye]

#### Adım 6 · 🐱 Scratch — Şifreli kapı 🔐
- Görev: Robo kapı bekçisi. [… olana kadar tekrarla] içinde [şifre nedir? diye sor] yapılır. Şifre **açıl susam**. Doğru şifre girilince “Kapı açıldı!” desin.
- Sahne: dekor `gece`; kuklalar: Robo (0, -60), boyut 120
- Bloklar: ASK seti + [… olana kadar tekrarla], (cevap), (birleştir); koşul: karşılaştır
- Hedefler: 1) “… olana kadar tekrarla” kullan 2) Yanlış şifrede tekrar sorsun 3) Doğru şifrede “Kapı açıldı!” desin
- İpucu: yok
- Örnek çözüm (Robo):
  1. [🏁 tıklandığında]
  2. [(cevap) = “açıl susam” olana kadar tekrarla]: [“Şifre nedir?” diye sor ve bekle]
  3. [… sesini başlat: Zil]
  4. [“Kapı açıldı!” de 2 saniye]

#### Adım 7 · 🐱 Scratch — ⭐ Kendi yarışman
- Görev: Kendi bilgi yarışmanı yap: en az 3 soru, skor ve sonunda puan. İstersen yanlış cevapta “boing” sesi çal. Arkadaşına oynat. Hazır olunca ✔ Bitirdim.
- Sahne: dekor `sahne`; değişken: skor = 0; kuklalar: Kedi (-60, -60)
- Bloklar: ASK seti + [dekoru … yap], [… saniyede x … y … konumuna süzül], [x … y … konumuna git], (rastgele), (cevap), (birleştir), (değişken); koşul: karşılaştır. Serbest çalışma (kendi tasarım), hedef sayılı.
- Hedefler: 1) En az üç soru 2) Skor tut (“değiştir” bloğu kullan)
- İpucu: yok
- Örnek çözüm (Kedi, referans yapı):
  1. [🏁 tıklandığında] → [skor değişkenini 0 yap]
  2. Her cevap için: [“Soru?” diye sor ve bekle] → [eğer (cevap) = a / b / c ise: skor değişkenini 1 değiştir]

---

## 2. ders · Bölüm 30 — ➗ Matematik İşlemleri

- **Kavram:** Operatörler
- **Kısa açıklama:** Toplama, çıkarma, çarpma, bölme bloklarıyla hesap makinesi, matematik oyunu ve büyüyen spiraller yap.
- **Öğrendiklerimiz:**
  - Yeşil işlem blokları (+ − × ÷) iki sayıyla hesap yapar.
  - İşlem bloklarının içine değişken ve rastgele sayı konabilir.
  - Bilgisayar matematiği çok hızlı yapar; oyunlar ve çizimler bu hesaplarla çalışır.
- **Öğretmen notu:** İnsan hesap makinesi: İki öğrenci “a” ve “b” kutusu olsun (ellerinde sayı kartları). Üçüncü öğrenci “işlem bloğu”: kartlara bakıp sonucu söyler. Sonra kartlar rastgele çekilsin. Ders sonunda çokgen çizimiyle “360 ÷ kenar sayısı” kuralını hatırlatın.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Bilgisayar bir hesap ustası 🧮 | Yeşil işlem blokları (+ − × ÷) tanıtılır. |
| 2 | 🐱 Scratch | Toplama makinesi | Robo iki sayı sorar, toplamı söyler. |
| 3 | ❓ Test | Hesapla | (a × b) − 2 işleminin sonucu soruluyor. |
| 4 | 🐱 Scratch | Matematik oyunu 🎲 | Robo rastgele iki sayıyla 3 toplama sorusu sorar, skor tutar. |
| 5 | 🐱 Scratch | 7'ler tablosu | Kedi 7'ler çarpım tablosunu söyler. |
| 6 | 🐱 Scratch | Büyüyen spiral 🌀 | Kalem her kenarı biraz uzatarak spiral çizer. |
| 7 | 🐱 Scratch | ⭐ Sihirli çokgen | Kenar sayısı sorulur, 360 ÷ kenar kadar dönerek çokgen çizilir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Bilgisayar bir hesap ustası 🧮
Yeşil işlem blokları hesap yapar: ( ) + ( ), ( ) − ( ), ( ) × ( ), ( ) ÷ ( ). Bir sayı kutusunun yanındaki ▾ düğmesinden **işlem** seçilir; yeşil bloktaki işaret (+ − × ÷) değiştirilebilir. İçine değişken ya da cevap konabilir. Görseller: ➕ ➖ ✖️ ➗ 🟰.

#### Adım 2 · 🐱 Scratch — Toplama makinesi
- Görev: Robo iki sayı sorsun, bunları **a** ve **b** değişkenlerine koysun, sonra toplamı söylesin.
- Adımlar (metin): a'yı (cevap) yap · b'yi (cevap) yap · (birleştir “Toplam: ” (a + b)) de
- Sahne: dekor `sahne`; değişkenler: a = 0, b = 0; kuklalar: Robo (0, -60), boyut 120
- Bloklar: [🏁 tıklandığında], [“…” diye sor ve bekle], [… de N saniye], [… de], [değişkenini … yap], [değişkenini … değiştir], [N kez tekrarla], [eğer … ise], [eğer … ise … değilse], [N saniye bekle], [tümünü sil], [kalemi bastır], [kalemi kaldır], [N adım git], [↻ N derece dön], [x … y … konumuna git], [… yönüne dön], [kalem rengini … yap], [… sesini başlat]; kutular: (işlem), (cevap), (birleştir), (değişken)
- Hedefler: 1) İşlem bloğu kullan 2) 5 ve 7 için “12” desin
- İpucu: yok
- Örnek çözüm (Robo):
  1. [🏁 tıklandığında]
  2. [“Bir sayı söyle” diye sor ve bekle] → [a değişkenini (cevap) yap]
  3. [“Bir sayı daha” diye sor ve bekle] → [b değişkenini (cevap) yap]
  4. [(birleştir “Toplam: ” (a + b)) de 2 saniye]
- Not: Test girdisi olarak 5 ve 7 kullanılmış.

#### Adım 3 · ❓ Test — Hesapla
- Soru: a = 4, b = 3 ise (a × b) − 2 kaç eder?
- Şıklar: A) 5 · B) 10 · C) 14
- Doğru cevap: B) 10
- Açıklama: 4 × 3 = 12, 12 − 2 = 10.

#### Adım 4 · 🐱 Scratch — Matematik oyunu 🎲
- Görev: Robo 3 soru sorsun. Her soruda: a'yı (rastgele 1 ile 10) yap, b'yi (rastgele 1 ile 10) yap, “a + b kaç?” diye sor. Sayılar sahnenin sol üstünde görünür (metin notu). Eğer cevap = (a + b) ise “Doğru!” ve skoru artır; değilse “Yanlış”.
- Sahne: dekor `sahne`; değişkenler: a = 0, b = 0, skor = 0; kuklalar: Robo (0, -60), boyut 120
- Bloklar: ÖNCEKİ MATEMATİK seti + [eğer … ise … değilse], (rastgele), (işlem), (cevap), (birleştir), (değişken); koşul: karşılaştır
- Hedefler: 1) “rastgele” kullan 2) Cevabı (a + b) ile karşılaştır 3) En az 2 doğru
- İpucu: yok
- Örnek çözüm (Robo):
  1. [🏁 tıklandığında] → [skor değişkenini 0 yap]
  2. [3 kez tekrarla]:
     - [a değişkenini (rastgele 1–10) yap]
     - [b değişkenini (rastgele 1–10) yap]
     - [“a + b kaç?” diye sor ve bekle]
     - [eğer (cevap) = (a + b) ise]: [“Doğru!” de 1 saniye] → [skor değişkenini 1 değiştir]; [değilse]: [“Yanlış” de 1 saniye]
  3. [(birleştir “Skorun: ” (skor)) de 2 saniye]
- Not: Metin, sayıların sahnede görüneceğini söylüyor; bu adımın sahne ayarında gösterilecek değişken (showVars) tanımı yok.

#### Adım 5 · 🐱 Scratch — 7'ler tablosu
- Görev: Kedi 7'ler çarpım tablosunu söylesin: 7, 14, 21 … 70. **sayı** değişkenini 1'den başlat, 10 kez tekrarla [(sayı × 7) de 0.5 saniye, sayıyı 1 değiştir].
- Sahne: dekor `cayir`; değişken: sayı = 1; kuklalar: Kedi (0, -60)
- Bloklar: [🏁 tıklandığında], [… de N saniye], [N kez tekrarla], [değişkenini … yap], [değişkenini … değiştir], (işlem), (birleştir), (değişken)
- Hedefler: 1) Kedi “7” desin 2) Kedi “70” desin
- İpucu: yok
- Örnek çözüm (Kedi):
  1. [🏁 tıklandığında] → [sayı değişkenini 1 yap]
  2. [10 kez tekrarla]: [(sayı × 7) de 0.4 saniye] → [sayı değişkenini 1 değiştir]
- **Tutarsızlık:** Metin “0.5 saniye” diyor; örnek çözümde “0.4 saniye” yazıyor.

#### Adım 6 · 🐱 Scratch — Büyüyen spiral 🌀
- Görev: Her kenarı bir öncekinden biraz uzun bir spiral çiz: **uzunluk**'u 5 yap, **kalemi bastır**; 40 kez tekrarla [(uzunluk) adım git, ↻ 90 derece dön, uzunluğu 5 değiştir].
- Sahne: dekor `beyaz`; değişken: uzunluk = 5 (sahnede gösterilir); kuklalar: Kalem (0, 0), dönüş serbest
- Bloklar: [🏁 tıklandığında], [tümünü sil], [x … y … konumuna git], [… yönüne dön], [değişkenini … yap], [kalemi bastır], [N kez tekrarla], [N adım git], [↻ N derece dön], [değişkenini … değiştir], (işlem), (değişken)
- Hedefler: 1) “adım git” içinde değişken kullan 2) En az 40 çizgi çiz
- İpucu: yok
- Örnek çözüm (Kalem):
  1. [🏁 tıklandığında] → [tümünü sil] → [x: 0 y: 0 konumuna git] → [90 yönüne dön] → [uzunluk değişkenini 5 yap] → [kalemi bastır]
  2. [40 kez tekrarla]: [(uzunluk) adım git] → [↻ 90 derece dön] → [uzunluk değişkenini 5 değiştir]

#### Adım 7 · 🐱 Scratch — ⭐ Sihirli çokgen
- Görev: Kalem kaç kenarlı bir şekil çizeceğini sorsun. Sonra **kalemi bastır** ve (cevap) kez tekrarla [80 adım git, ↻ (360 ÷ cevap) derece dön]. 3 yazınca üçgen, 6 yazınca altıgen çıkar.
- Sahne: dekor `beyaz`; kuklalar: Kalem (-40, 80), dönüş serbest
- Bloklar: [🏁 tıklandığında], [tümünü sil], [x … y … konumuna git], [… yönüne dön], [“…” diye sor ve bekle], [kalemi bastır], [N kez tekrarla], [N adım git], [↻ N derece dön], (işlem), (cevap)
- Hedefler: 1) 360 ÷ cevap hesabını kullan 2) Kenar sayısı kadar kapalı şekil çiz (6 kenar)
- İpucu: yok
- Örnek çözüm (Kalem):
  1. [🏁 tıklandığında] → [tümünü sil] → [x: -40 y: 80 konumuna git] → [90 yönüne dön]
  2. [“Kaç kenar?” diye sor ve bekle] → [kalemi bastır]
  3. [(cevap) kez tekrarla]: [80 adım git] → [↻ (360 ÷ cevap) derece dön]
- Test girdisi: 6.

---

## 3. ders · Bölüm 31 — 👯 Klonlar

- **Kavram:** Klon
- **Kısa açıklama:** Bir kuklanın kopyalarını yap: kar yağdır, balık sürüsü oluştur, havai fişek patlat!
- **Öğrendiklerimiz:**
  - Klon, bir kuklanın oyun sırasında oluşturulan kopyasıdır.
  - Her klon “klon olarak başladığımda” betiğini kendi başına çalıştırır.
  - İşi biten klonlar “bu klonu sil” ile silinmelidir.
- **Öğretmen notu:** Fotokopi oyunu: Bir öğrenci “asıl kukla” olsun ve elinde bir görev kartı tutsun (“tahtaya git, el salla, yerine dön”). “Klon oluştur!” dediğinizde başka bir öğrenci aynı kartı alıp görevi yapsın. Görev bitince oturur (klonu sil). Aynı anda birçok klonun çalışabildiğini gösterin.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Kuklanın fotokopisi 👯 | Klon, “klon olarak başladığımda” ve “bu klonu sil” tanıtılır. |
| 2 | 🐱 Scratch | Kar yağışı ❄️ | Yıldız klonlar üretir; her kar tanesi yukarıdan düşüp silinir. |
| 3 | ❓ Test | Klon nedir? | Klonun tanımı soruluyor. |
| 4 | 🐱 Scratch | Balık sürüsü 🐟 | 6 balık klon olarak oluşup kenarlarda sekerek yüzer. |
| 5 | 🐱 Scratch | Tıkla, çoğalsın! ❤️ | Kalbe tıklanınca klon oluşur; klon rastgele yere gider ve rengi değişir. |
| 6 | 🐱 Scratch | ⭐ Havai fişek 🎆 | Yıldıza tıklanınca 12 klon patlar, her klon 15 kez hareket edip silinir. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Kuklanın fotokopisi 👯
Yüzlerce kar tanesi için yüz kukla yapmak yerine **klon** kullanılır. [kendim klonunu oluştur] kuklanın bir kopyasını yapar; [klon olarak başladığımda] her klonun çalıştıracağı betiktir; [bu klonu sil] işi biten klonu kaldırır. Asıl kukla genellikle gizlenir; sahnede yalnızca klonlar dolaşır. Görseller: ❄️ ❄️ ❄️ ❄️ 👯.

#### Adım 2 · 🐱 Scratch — Kar yağışı ❄️
- Görev: Yıldız (kar tanesi): 🏁 → [gizle] → sürekli tekrarla [kendim klonunu oluştur, 0.3 saniye bekle]. Klon olarak başladığımda → [x: (rastgele -220 ile 220) y: 170 konumuna git] → [göster] → [y < -170 olana kadar] [y'yi -4 değiştir] → [bu klonu sil].
- Sahne: dekor `gece`; kuklalar: Yıldız (0, 170), boyut 50
- Bloklar: [🏁 tıklandığında], [klon olarak başladığımda], [kendim klonunu oluştur], [bu klonu sil], [sürekli tekrarla], [… olana kadar tekrarla], [N saniye bekle], [x … y … konumuna git], [göster], [gizle], [y'yi … değiştir], (rastgele), [y < -170 karşılaştırması]
- Hedefler: 1) “klon olarak başladığımda” kullan 2) Aynı anda en az 5 kar tanesi 3) Klonlar yere inince silinsin
- İpucu: yok
- Örnek çözüm (Yıldız):
  - Ana betik: [🏁 tıklandığında] → [gizle] → [sürekli tekrarla]: [kendim klonunu oluştur] → [0.3 saniye bekle]
  - Klon betiği: [klon olarak başladığımda] → [x: (rastgele -220 ile 220) y: 170 konumuna git] → [göster] → [y < -170 olana kadar tekrarla]: [y'yi -4 değiştir] → [bu klonu sil]

#### Adım 3 · ❓ Test — Klon nedir?
- Soru: Bir kuklanın klonu için hangisi doğru?
- Şıklar: A) Kuklanın oyun sırasında yapılan kopyasıdır ve kendi başına hareket edebilir · B) Tamamen farklı bir kuklanın adıdır · C) Kuklanın sesidir
- Doğru cevap: A
- Açıklama: Klonlar asıl kuklanın kostümünü ve kodunu alır ama her biri ayrı hareket eder.

#### Adım 4 · 🐱 Scratch — Balık sürüsü 🐟
- Görev: Balık: 🏁 → [gizle] → [6 kez tekrarla] [kendim klonunu oluştur]. Klon olarak başladığımda → [rastgele konuma git] → [(rastgele) yönüne dön] → [göster] → sürekli tekrarla [4 adım git, kenara geldiyse sek].
- Sahne: dekor `deniz`; kuklalar: Balık (0, 0), boyut 60
- Bloklar: [🏁 tıklandığında], [klon olarak başladığımda], [kendim klonunu oluştur], [N kez tekrarla], [rastgele konuma git], [… yönüne dön], (rastgele), [göster], [gizle], [sürekli tekrarla], [N adım git], [kenara geldiyse sek]
- Hedefler: 1) En az 6 klon 2) 6 balık aynı anda yüzsün
- İpucu: yok
- Örnek çözüm (Balık):
  - Ana betik: [🏁 tıklandığında] → [gizle] → [6 kez tekrarla]: [kendim klonunu oluştur]
  - Klon betiği: [klon olarak başladığımda] → [rastgele konuma git] → [yön (rastgele -180 ile 180) yap] → [göster] → [sürekli tekrarla]: [4 adım git] → [kenara geldiyse sek]

#### Adım 5 · 🐱 Scratch — Tıkla, çoğalsın! ❤️
- Görev: Kalbe tıklanınca kendi klonunu oluştursun. Klon olarak başladığımda: rastgele konuma git, rengini değiştir. Kalbe birkaç kez tıkla.
- Sahne: dekor `sahne`; kuklalar: Kalp (0, 0), boyut 150
- Bloklar: [bu kukla tıklanınca], [klon olarak başladığımda], [kendim klonunu oluştur], [rastgele konuma git], [renk etkisini … değiştir], [büyüklüğü %… yap], (rastgele), [… sesini başlat]
- Başlatma: Yeşil bayrak yok; kalp tıklanarak başlatılır.
- Hedefler: 1) Tıklanınca klon oluştur 2) En az 3 klon yap
- İpucu: yok
- Örnek çözüm (Kalp):
  - [bu kukla tıklanınca] → [kendim klonunu oluştur] → [… sesini başlat: Pop]
  - [klon olarak başladığımda] → [rastgele konuma git] → [renk etkisini (rastgele 10–150) değiştir] → [büyüklüğü %80 yap]
- Not: Örnek çözümdeki “Pop” sesi metinde anılmıyor.

#### Adım 6 · 🐱 Scratch — ⭐ Havai fişek 🎆
- Görev: Yıldıza tıklanınca 12 klon oluştursun. Her klon rastgele bir yöne dönsün, 15 kez tekrarla [8 adım git, rengi değişsin], sonra silinsin.
- Sahne: dekor `gece`; kuklalar: Yıldız (0, 0), boyut 60
- Başlatma: Yeşil bayrak yok; yıldıza tıklanarak başlatılır.
- Bloklar: [bu kukla tıklanınca], [klon olarak başladığımda], [kendim klonunu oluştur], [N kez tekrarla], [… yönüne dön], (rastgele), [N adım git], [renk etkisini … değiştir], [bu klonu sil]
- Hedefler: 1) En az 12 klon 2) Klonlar silinsin
- İpucu: yok
- Örnek çözüm (Yıldız):
  - [bu kukla tıklanınca] → [12 kez tekrarla]: [kendim klonunu oluştur]
  - [klon olarak başladığımda] → [yön (rastgele -180 ile 180) yap] → [15 kez tekrarla]: [8 adım git] → [renk etkisini 10 değiştir] → [bu klonu sil]

---

## 4. ders · Bölüm 32 — 👾 Oyun 4: Uzay Savaşçısı

- **Kavram:** Klonlarla oyun
- **Kısa açıklama:** Klonlarla tam bir atari oyunu: roketinle lazer at, yağan göktaşlarını vur, puan topla!
- **Öğrendiklerimiz:**
  - Klonlar mermi, düşman, yağmur gibi çok sayıda nesne için kullanılır.
  - Bir kukla başka bir kuklanın klonunu oluşturabilir (roket → lazer).
  - Büyük bir oyun küçük adımlarla, her adım denenerek yapılır.
- **Öğretmen notu:** Oyun fuarı: Bu son oyunla birlikte öğrencilerin dört oyunu oldu. Sınıfça bir “oyun salonu” düzenleyin: bilgisayarlar açık kalsın, öğrenciler dolaşıp birbirinin oyununu oynasın ve en yüksek skoru tahtaya yazsın. Gerçek Scratch'te bu oyunu paylaşmak isteyenlere yardım edin.

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Son büyük oyun! 👾 | Oyunun kuralları: sağa-sola hareket, boşlukla lazer, göktaşına değerse puan, rokete değerse oyun biter. |
| 2 | 🐱 Scratch | 1. adım: Roket hareketi | Roket sağa-sola gider (ok tuşları). |
| 3 | 🐱 Scratch | 2. adım: Lazer at | Boşluk tuşuyla lazer klonu oluşur ve yukarı uçar. |
| 4 | 🐱 Scratch | 3. adım: Göktaşı yağmuru | Göktaşı klonları yukarıdan düşer. |
| 5 | 🐱 Scratch | 4. adım: Vur! 💥 | Lazer göktaşına değerse skor artar, göktaşı silinir. |
| 6 | 🐱 Scratch | 5. adım: Dikkat, çarpışma! | Göktaşı rokete değerse “Oyun bitti!” denir ve tüm betikler durur. |
| 7 | 📖 Anlatım | Bir atari oyunu yaptın! 🕹️ | Geliştirme önerileri; sertifika çağrısı. |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — Son büyük oyun! 👾
Uzayda göktaşı yağmuru var. Roketle sağa-sola gidip boşluk tuşuyla lazer atılır. (1) Lazerler ve göktaşları klon olacak. (2) Lazer göktaşına değerse puan kazanılır. (3) Göktaşı rokete değerse oyun biter. Görseller: 🚀 🔫 ☄️ 💥 🏆.

#### Adım 2 · 🐱 Scratch — 1. adım: Roket hareketi
- Görev: Roket: 🏁 → [x: 0 y: -140 konumuna git] → [0 yönüne dön] → sürekli tekrarla [eğer sol ok basılı ise: x'i -6 değiştir; eğer sağ ok basılı ise: x'i 6 değiştir].
- Sahne: dekor `uzay`; değişken: skor = 0; kuklalar: Göktaşı (0, 170) gizli, boyut 80, dönüş serbest; Lazer (0, -100) gizli; Roket (0, -140), yön 0, dönüş serbest
- Bloklar: [🏁 tıklandığında], [… tuşuna basılınca], [x … y … konumuna git], [… yönüne dön], [sürekli tekrarla], [eğer … ise], [x'i … değiştir], [… tuşuna basılı mı?]
- Hedefler: 1) Sol ve sağ için iki “eğer” 2) Roket sağa gitsin (x > 60)
- İpucu: yok
- Örnek çözüm (Roket):
  1. [🏁 tıklandığında] → [x: 0 y: -140 konumuna git] → [0 yönüne dön]
  2. [sürekli tekrarla]: [eğer sol ok tuşuna basılı ise: x'i -6 değiştir] → [eğer sağ ok tuşuna basılı ise: x'i 6 değiştir]

#### Adım 3 · 🐱 Scratch — 2. adım: Lazer at
- Görev: Rokete: [boşluk tuşuna basılınca] → [Lazer klonunu oluştur]. Lazer'e: 🏁 → [gizle]. Klon olarak başladığımda → [Roket konumuna git] → [göster] → [kenara dokunana kadar] [y'yi 12 değiştir] → [bu klonu sil].
- Sahne: Adım 2 ile aynı (dekor `uzay`; Göktaşı, Lazer, Roket)
- Bloklar: [🏁 tıklandığında], [boşluk tuşuna basılınca], [Lazer klonunu oluştur], [klon olarak başladığımda], [… konumuna git], [göster], [gizle], [kenara dokunana kadar tekrarla], [y'yi … değiştir], [bu klonu sil]; koşul: dokunuyor mu?
- Hedefler: 1) Boşluk tuşu ile Lazer klonu oluştur 2) Lazer yukarı uçsun
- İpucu: yok
- Örnek çözüm:
  - Roket: [sürekli tekrarla]-bloğu (Adım 2 ile aynı) + [boşluk tuşuna basılınca] → [Lazer klonunu oluştur]
  - Lazer: [🏁 tıklandığında] → [gizle]; [klon olarak başladığımda] → [Roket konumuna git] → [göster] → [kenara dokunana kadar tekrarla]: [y'yi 12 değiştir] → [bu klonu sil]

#### Adım 4 · 🐱 Scratch — 3. adım: Göktaşı yağmuru
- Görev: Göktaşı: 🏁 → [gizle] → skoru 0 yap → sürekli tekrarla [kendim klonunu oluştur, 1 saniye bekle]. Klon olarak başladığımda → [x: (rastgele -210 ile 210) y: 170 konumuna git] → [göster] → [y < -170 olana kadar] [y'yi -3 değiştir, ↻ 3 derece dön] → [bu klonu sil].
- Sahne: Adım 2 ile aynı
- Bloklar: [🏁 tıklandığında], [gizle], [skor değişkenini 0 yap], [sürekli tekrarla], [kendim klonunu oluştur], [N saniye bekle], [klon olarak başladığımda], [x … y … konumuna git], (rastgele), [göster], [… olana kadar tekrarla], [y'yi … değiştir], [↻ N derece dön], [bu klonu sil]
- Hedefler: 1) Göktaşı klonları oluşsun 2) Aynı anda en az 3 göktaşı
- İpucu: yok
- Örnek çözüm (Göktaşı):
  - Ana betik: [🏁 tıklandığında] → [gizle] → [skor değişkenini 0 yap] → [sürekli tekrarla]: [kendim klonunu oluştur] → [1 saniye bekle]
  - Klon betiği: [klon olarak başladığımda] → [x: (rastgele -210 ile 210) y: 170 konumuna git] → [göster] → [y < -170 olana kadar tekrarla]: [y'yi -3 değiştir] → [↻ 3 derece dön] → [bu klonu sil]

#### Adım 5 · 🐱 Scratch — 4. adım: Vur! 💥
- Görev: Göktaşı klonunun döngüsüne ekle: **eğer Lazer'e dokunuyorsa** → skoru 1 değiştir → pop sesi → bu klonu sil.
- Sahne: Adım 2 ile aynı
- Bloklar: Adım 4 seti + [eğer … ise], [dokunuyor mu? (Lazer)], [skor değişkenini … değiştir], [… sesini başlat]
- Hedefler: 1) Lazer çarpışma kuralı yaz 2) 3 göktaşı vur (skor ≥ 3)
- İpucu: yok
- Örnek çözüm (Göktaşı):
  - Ana betik: Adım 4 ile aynı
  - Klon betiği: [klon olarak başladığımda] → [x, y konumuna git] → [göster] → [y < -170 olana kadar tekrarla]: [y'yi -3 değiştir] → [↻ 3 derece dön] → [eğer Lazer'e dokunuyorsa: skor değişkenini 1 değiştir → Pop sesini başlat → bu klonu sil] → [bu klonu sil]

#### Adım 6 · 🐱 Scratch — 5. adım: Dikkat, çarpışma!
- Görev: Rokete yeni betik: 🏁 → sürekli tekrarla [eğer Göktaşı'na dokunuyorsa → boing sesi → “Oyun bitti!” de → tümünü durdur].
- Sahne: Adım 2 ile aynı
- Bloklar: [🏁 tıklandığında], [sürekli tekrarla], [eğer … ise], [dokunuyor mu? (Göktaşı)], [… sesini başlat: Boing], [“Oyun bitti!” de], [tümünü durdur]
- Hedefler: 1) Göktaşı çarpışma kuralı yaz 2) Çarpınca “Oyun bitti!” desin
- İpucu: yok
- Örnek çözüm (Roket): Adım 2–3 betikleri + [🏁 tıklandığında] → [sürekli tekrarla]: [eğer Göktaşı'na dokunuyorsa] → [boing sesi] → [“Oyun bitti!” de 1 saniye] → [tümünü durdur]
- Not: Sahne Adım 4–5'teki Göktaşı betiklerini de içerir (klon betiği dahil).

#### Adım 7 · 📖 Anlatım — Bir atari oyunu yaptın! 🕹️
Tebrikler: klonlarla gerçek bir atari oyunu yapıldı. Geliştirme önerileri: (1) göktaşları zamanla hızlansın (hız değişkeni), (2) 3 can ekle, (3) skor 20 olunca “Kazandın!” haberi salınsın. Eğitim bu adımla bitiyor; bitirince **sertifika** alınabilir: ad yazılır ve yazdırılır. Görseller: yok (dance animasyonu).

---

## Hafta özeti

- Bu haftanın anlatım metinlerinde tanıtılan / kullanılan yeni bloklar ve kutular: “… diye sor ve bekle”, (cevap), (birleştir), “eğer … değilse”, “… olana kadar tekrarla” (yazı ile koşul), (işlem + − × ÷), (rastgele), [kendim klonunu oluştur], [klon olarak başladığımda], [bu klonu sil], [kenara dokunana kadar tekrarla], [kenara geldiyse sek]. (Önceki haftalarla karşılaştırılmadı.)
- Toplam adım: 27 (5 anlatım, 3 test, 19 Scratch). Izgara adımı yok.
- Dersler: 1. ders Bölüm 29 (7 adım), 2. ders Bölüm 30 (7 adım), 3. ders Bölüm 31 (6 adım), 4. ders Bölüm 32 (7 adım).

## Kaynakta görülen tutarsızlıklar (kod değiştirilmedi)

1. Bölüm 30, Adım 5 (7'ler tablosu): metin 0.5 saniye, örnek çözüm 0.4 saniye.
2. Bölüm 30, Adım 4 (Matematik oyunu): metin sayıların sahnenin sol üstünde görüneceğini söylüyor; sahne ayarında gösterilen değişken tanımı yok.
3. Bölüm 31, Adım 5 (Tıkla çoğalsın): örnek çözümde “Pop” sesi var, metinde yok (küçük fark).
4. Bölüm 29, Adım 4 (Bilgi yarışması): örnek çözümde “Kazandın” sesi var, metinde yok (küçük fark).
