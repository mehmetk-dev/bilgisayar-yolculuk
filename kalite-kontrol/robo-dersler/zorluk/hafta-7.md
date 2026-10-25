# Hafta 7 — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: **Orta-zor.** Ders başına 5 Scratch adımı var ve her adım bir öncekinin üstüne kod ekliyor. Bir adımda takılan çocuk sonrakilerde de takılır. Üç oyunda da çocuğun koordinat (x, y), eksi sayı ve derece bilmesi bekleniyor. Üstelik bu haftanın Scratch adımlarında hiç ipucu yok.
- En çok takılınacak yerler:
  1. Eksi sayılar: x'i **-4** değiştir, y'yi **-4** değiştir, rastgele **-200 ile 200**, can **-1**, hız **-4**, x < **-230**. Negatif sayı 7. sınıfta öğreniliyor.
  2. Koordinat sayıları (x: -200 y: -135, y: 170, x: 240): koordinat düzlemi 6. sınıfta öğreniliyor.
  3. Bölüm 26, adım 3: tek adımda 4 yeni şey var (rastgele, skor, iki "eğer", tepeye dönme). Bölümün ana kavramı burada, ama yük çok fazla.
  4. Bölüm 27, adım 3: "5 derece dön" derece bilgisi ister ve göktaşı için gereksiz. Ayrıca x < -230 koşulu eksi sayı ve kenar mantığı ister.
  5. Bölüm 26, adım 5–6 (hız değişkeni, haber salma, ikinci kukla) ve Bölüm 25, adım 5–6 (süre, hayalet süzülmesi). Çok zor ve ana kavram için şart değil; bonus olmalı.
  6. Bölüm 28, adım 5: boş sayfadan serbest proje. Fikri olmayan çocuk 40 dakikayı boşa harcar; başlangıç şablonu gerekir.

---

## Bölüm 25 — 🧀 Oyun 1: Labirent
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Bir oyun nasıl yapılır? | 🟢 | Dört parça emojili ve kısa. | — |
| 2 | Akıcı hareket (4 yön) | 🔴 | Tek adımda sürekli tekrarla + dört "eğer" + dört tuş seçimi. İçinde **-4** ve **-4** (eksi sayı) var. Dört "eğer"i yazarken tuşu değiştirmeyi unutmak çok olur. | [İSKELE] [METİN] [İPUCU] |
| 3 | Duvarlar | 🟡 | Yeni "dokunuyor mu?" koşulu. Koordinat (x: -200 y: -135) var. Ama yapı bir önceki "eğer" ile aynı. | [METİN] [İPUCU] |
| 4 | Peynir = kazandın | 🟡 | Aynı yapı, bir "eğer" daha. İçinde 3 blok var. | [İPUCU] |
| 5 | Süre tut | 🟡 | İkinci kukla, ilk kez değişken. Ana kavram (oyun tasarımı) için şart değil. | [BONUS] |
| 6 | Hayalet düşman | 🔴 | Süzül bloğunda 4 sayı, koordinat (y: 20, y: 60), ondalık (1.5). Ayrıca üç kukla arasında gidip gelmek gerekiyor. | [BONUS] [SAYI] |
| 7 | Oyunun hazır! | 🟢 | Kısa tebrik ve sorular. | — |

### Öneri ayrıntıları
- **Adım 2 [İSKELE]:** Önüne yeni bir ara adım ekle: "Fareyi sağa yürüt". Görev: 🏁 tıklandığında → sürekli tekrarla [eğer sağ ok basılı mı? ise x'i 4 değiştir]. Hedef: fare sağa gitsin. Haritada 4 tuşun hepsi gerekmesin. Ardından mevcut adım 2 "Diğer üç yönü ekle" olur.
- **Adım 2 [METİN]:** Yeni metin: “Fare ok tuşlarıyla yürüsün! Önce **sağ ok** için bir **eğer** yaz: sağ ok basılıysa **x'i 4 değiştir**. Sonra aynısını diğer üç ok için de yap. Her tuşu değiştirmeyi unutma!”
- **Adım 2 [İPUCU]:** “İpucu: **x** sağa-sola gider, **y** yukarı-aşağı gider. **Eksi (−) işareti** ters yöne gitmek demek: sola gitmek için x'e **-4** yaz, aşağı gitmek için y'ye **-4** yaz. Bir eğer'i yazdın mı, onu kopyala ve sadece tuşu ile sayıyı değiştir!”
- **Adım 3 [METİN]:** Yeni metin: “Fare duvara değerse **başa dönsün**! Döngünün içine bir **eğer** koy: **duvara dokunuyor mu?** ise **boing** sesi çal ve fareyi **başlangıç yerine** götür.”
- **Adım 3 [İPUCU]:** “İpucu: Başlangıç yeri için üstteki **🏁 tıklandığında** altındaki **konuma git** bloğunu kopyalayabilirsin. Sayıları yeniden yazmana gerek yok!”
- **Adım 4 [İPUCU]:** “İpucu: Bu **eğer**, duvar **eğer**'iyle aynı şekilde yapılır. Sadece **dokunuyor mu?** kutusundan **Peynir**'i seç. İçine üç şey koy: **kazandın sesi**, **“Kazandım!” de**, **tümünü durdur**.”
- **Adım 6 [SAYI]:** Hayalet süzülmesini tamsayı yap ve tek bloka indir: "1 saniyede x: 0 y: 60'a süzül, 1 saniyede x: 0 y: 20'ye süzül". 1.5 yerine 1 yaz. Bonus adımı koordinatları adımda hazır yazılmış haliyle ver.
- **Adım 5 ve 6 [BONUS]:** Süre ve hayalet "ek özellik" olsun. Çocuk adım 4'te oyunu zaten kazanıp kaybedebilir.
- **Önerilen yeni sıra:** 1, 2a (yeni: sadece sağ ok), 2, 3, 4, 7 · ⭐ 5, 6 (zorunlu: 6 adım, bonus: 2)

---

## Bölüm 26 — 🍎 Oyun 2: Elma Yakala
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Elma yağmuru | 🟢 | Kısa liste ve emoji. | — |
| 2 | Sepet fareyi takip etsin | 🟡 | "fare x" değer bloğunu bulmak için ▾ menüsü gerekiyor. Ama kod tek satır. | [İPUCU] [METİN] |
| 3 | Düşen elma (rastgele + skor) | 🔴 | Tek adımda: skor değişkeni, rastgele (-200 ile 200: eksi sayı), y'yi -4 değiştir, iki "eğer" (sepete dokunma, yere düşme), y < -170 karşılaştırması. Bölümün ana kavramı (değişken + rastgele) tam burada. | [İSKELE] [SAYI] [METİN] [İPUCU] |
| 4 | Üç can | 🔴 | can değişkeni, "can = 0" karşılaştırması, "-1 değiştir" (eksi sayı), "Oyun bitti!" demek. İki yeni "eğer". | [METİN] [İPUCU] |
| 5 | Hızlanan elmalar | 🔴 | Değişkeni, başka bir bloğun içine koyma (y'yi (hız) değiştir). Hız -4 ve -1: eksi sayı. "Hız artıyor ama sayı küçülüyor" çocuk için ters. | [BONUS] |
| 6 | Kazanma ekranı | 🔴 | Haber salma ve haber alma (soyut), üçüncü kukla (Kedi), gizle/göster. 4–5 yeni kavram. | [BONUS] |
| 7 | Oyunu geliştir | 🟢 | Üç öneri. | — |

### Öneri ayrıntıları
- **Adım 2 [METİN]:** Yeni metin: “Sepet fareyi takip etsin! **sürekli tekrarla** içine **x'i yap** bloğunu koy. Kutuya sayı yazma; yanındaki **▾** düğmesinden **fare x** seç.”
- **Adım 2 [İPUCU]:** “İpucu: **fare x** = farenin sağa-sola nerede olduğu. Sepet sadece sağa-sola gitsin diye **x** bloğunu kullanıyoruz, **y** bloğunu değil.”
- **Adım 3 [İSKELE]:** Adımı ikiye böl. Yeni "2a: Elma düşsün": Elma kuklası. Görev: 🏁 tıklandığında → konuma git (x: 0 y: 170) → sürekli tekrarla [y'yi -4 değiştir; eğer y < -170 ise konuma git (x: 0 y: 170)]. Hedef: elma sürekli düşüp tepeye dönsün. Eksi sayıları ve karşılaştırmayı öğretmen yönlendirmeli. Sonra "2b: Rastgele yerden ve yakalayınca skor": x'i rastgele yap, sepete dokunursa skor +1 olsun.
- **Adım 3 [SAYI]:** Rastgele aralığını **-150 ile 150** yap (ekranın dar kısmında kalsın) ve bloğu hazır ver: "rastgele **-150** ile **150** arası". Çocuk sadece bloğu sürükleyip x kutusuna koysun, sayıları yazmasın. (Eksi sayı yazmaktan kaçınmak için.)
- **Adım 3 [METİN] (2b için):** Yeni metin: “Elma **rastgele** bir yerden düşsün! **x** için **rastgele** bloğunu koy. Elma sepete değerse **skor'u 1 değiştir**. Her yakalayışta skor bir artar!”
- **Adım 3 [İPUCU] (2b için):** “İpucu: **rastgele** bloğu bir **zar** gibidir; her seferinde başka sayı seçer. Onu **konuma git** bloğundaki **x** kutusuna sürükle. **y** kutusu hep **170** kalsın, çünkü elma gökyüzünden düşer!”
- **Adım 4 [METİN]:** Yeni metin: “Elma yere düşerse **can'ı -1 değiştir**. **-1** demek bir can eksilir. **can = 0** olunca **“Oyun bitti!”** de ve **tümünü durdur**.”
- **Adım 4 [İPUCU]:** “İpucu: Yere düşme **eğer**'inin içine **can** için **-1 değiştir** bloğunu ekle. Sonra yeni bir **eğer can = 0 ise** yaz. Başta **can** 3 olmalı, 🏁'ten sonra **can'ı 3 yap**.”
- **Adım 5 ve 6 [BONUS]:** Hızlanma ve kazanma ekranı "oyunu zorlaştırma" bonusu olsun. Bölüm 26'nın ana kavramı (değişken + rastgele) adım 3–4'te zaten öğretiliyor.
- **Önerilen yeni sıra:** 1, 2, 3a (yeni), 3b, 4, 7 · ⭐ 5, 6 (zorunlu: 6 adım, bonus: 2)

---

## Bölüm 27 — 🚀 Oyun 3: Uzay Kaçışı
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Uzayda tehlike! | 🟢 | Kısa ve emojili. | — |
| 2 | Roket kontrolü | 🟡 | Bölüm 25'teki hareketin kolay hali (sadece 2 yön). Eksi sayı: y'yi **-6**. "Yönüne dön" bloğu derece ister (90). | [METİN] [İPUCU] |
| 3 | Göktaşı | 🔴 | x'i -8 değiştir, **5 derece dön** (derece bilinmiyor), x < -230 (eksi sayı karşılaştırma), rastgele -150..150, koordinat 240. Tek adımda çok şey. | [İSKELE] [SAYI] [METİN] [İPUCU] |
| 4 | Çarpışma | 🟢 | Bölüm 25'teki peynir "eğer"inin aynısı. İki blok var. | [İPUCU] |
| 5 | Puan | 🟡 | İkinci betik, "1 saniye bekle" + "skoru 1 değiştir". Değişken bir önceki bölümden biliniyor. | [İPUCU] |
| 6 | İkinci göktaşı | 🟡 | Kopyalama + hız değiştirme + roketin kuralına ikinci "eğer". Ama yeni kavram yok. | [BONUS] |
| 7 | Üç oyun yaptın! | 🟢 | Kısa özet. | — |

### Öneri ayrıntıları
- **Adım 2 [METİN]:** Yeni metin: “Roket yukarı ve aşağı gitsin! **sürekli tekrarla** içine iki **eğer** koy: **yukarı ok** basılıysa **y'yi 6 değiştir**, **aşağı ok** basılıysa **y'yi -6 değiştir**.”
- **Adım 2 [İPUCU]:** “İpucu: **y** yukarı-aşağı gider. Yukarı için **6**, aşağı için **-6** yaz. **-6**'daki **eksi (−)** aşağı demek. Bölüm 25'teki ok tuşu kodunu hatırla!”
- **Adım 3 [İSKELE]:** Adımı ikiye böl. Yeni "2a: Göktaşı gelsin": Göktaşı kuklası. Görev: 🏁 tıklandığında → konuma git (x: 240 y: 0) → sürekli tekrarla [x'i -8 değiştir; eğer x < -230 ise konuma git (x: 240 y: 0)]. Hedef: göktaşı soldan çıkıp sağa dönsün. Sonra "2b: Rastgele yükseklik": y'yi rastgele yapar.
- **Adım 3 [SAYI]:** "5 derece dön" bloğunu **tamamen çıkar** (dönmek oyunu etkilemiyor, derece de bilinmiyor). Koşulu "x < -230" yerine **x < -200** yap, yine eksi sayı ama daha kolay okunur. Rastgele aralığını **-100 ile 100** yap (hepsi hazır blok olarak verilsin).
- **Adım 3 [METİN] (2a için):** Yeni metin: “Göktaşı sağdan sola uçsun! **x'i -8 değiştir** ile sola gider. Sol kenara varınca (**x < -200**) tekrar **sağ tarafa** gitsin.”
- **Adım 3 [İPUCU] (2a için):** “İpucu: **x** sağa-sola gider. **-8** sola gitmek demek. Göktaşı sol kenarı geçince tepeye dönmesi için **eğer x < -200** yaz ve içine **konuma git (x: 240 ...)** koy.”
- **Adım 3 [METİN] (2b için):** Yeni metin: “Göktaşı her seferinde **başka bir yükseklikten** gelsin! **konuma git**'teki **y** kutusuna **rastgele** bloğunu koy.”
- **Adım 4 [İPUCU]:** “İpucu: Bu, Bölüm 25'teki **peynir kuralı** gibi. Rokete **eğer Göktaşı'na dokunuyor mu? ise** koy. İçine **boing sesi**, **“Oyun bitti!” de**, **tümünü durdur** ekle.”
- **Adım 5 [İPUCU]:** “İpucu: Rokete **yeni bir betik** ekle: 🏁 tıklandığında → **skoru 0 yap** → **sürekli tekrarla**: **1 saniye bekle**, **skoru 1 değiştir**. Her saniye 1 puan!”
- **Adım 6 [BONUS]:** İkinci göktaşı ekstra olsun. Ana kavram ("kukla kenardan çıkınca diğer uçtan girer" ve "süreye bağlı puan") adım 3 ve 5'te zaten öğretiliyor.
- **Önerilen yeni sıra:** 1, 2, 3a (yeni), 3b, 4, 5, 7 · ⭐ 6 (zorunlu: 7 adım, bonus: 1)

---

## Bölüm 28 — 🏆 Kendi Projen
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Sıra sende! | 🟡 | Dört seçenek ve kâğıda plan. Plan yazmak yavaş okuyan çocuk için uzun. Seçenek çok olunca karar vermek zor. | [METİN] |
| 2 | Hatırla: döngü | 🟢 | Üç şık, kısa. | — |
| 3 | Hatırla: koşul | 🟢 | "Dokunuyor mu" önceki derslerde defalarca geçti. | — |
| 4 | Hatırla: değişken | 🟢 | Üç şık, bilinen kavram. | — |
| 5 | Bitirme projen | 🔴 | Boş sayfadan serbest proje: fikri olmayan çocuk takılır. Dört hedef var ve hepsi ayrı kavram. | [İSKELE] [METİN] [İPUCU] |
| 6 | Gerçek Scratch'e geçiş | 🟡 | Uzun yönerge, internet adresleri ve "🏁 farkı" soyut. | [METİN] |
| 7 | Tebrikler, programcı! | 🟢 | Uzun kavram listesi ama sadece okuma. | — |

### Öneri ayrıntıları
- **Adım 1 [METİN]:** Yeni metin: “Şimdi **kendi projeni** yap! Bir tane seç: 🎮 **oyun**, 📖 **hikâye**, 🎨 **sanat** ya da 🎵 **müzik**. Kâğıda üç şey yaz: **Kukla kim? Ne olacak? Nasıl bitecek?**”
- **Adım 5 [İSKELE]:** Önüne bir ara adım ekle: "5a: Hazır başlangıç". Tür: Scratch. Görev: Sahne hazır gelsin (Kedi + Elma, dekor `cayir`, skor değişkeni). Çocuk sadece Kedi'ye "fare imlecine git" döngüsü eklesin (🏁 tıklandığında → sürekli tekrarla [fare imlecine git]). Hedef: kedi fareyi takip etsin. Kendi fikri olmayan buradan devam eder, fikri olan boş projeye geçer.
- **Adım 5 [METİN]:** Yeni metin: “Kendi projeni yap! ➕ ile **kukla** ekle, 🖼 ile **dekor** seç. Listedeki işlerin hepsi ✅ olunca **✔ Bitirdim**'e bas. Fikrin yoksa hazır **kedi ve elma** ile başla!”
- **Adım 5 [İPUCU]:** “İpucu: Elma ve kedi hazır! Kediye **eğer Elma'ya dokunuyor mu? ise** koy, içine **skor'u 1 değiştir** ekle. Elma'ya da **sürekli tekrarla** içinde **rastgele konuma git** ve **1 saniye bekle** ekle. Bitirince **ses** ya da **can** eklemeyi dene!”
- **Adım 5 (liste) [SAYI]:** Hedef listesini şu şekilde yaz (daha kolay ve ölçülebilir): "En az 2 kukla · 1 döngü (sürekli tekrarla) · 1 eğer · 1 ses ya da değişken". Zaten kodda böyle, sadece metinde "ya da" olmasın ve ⭐ bonus olarak "can ekle" geçsin.
- **Adım 6 [METİN]:** Yeni metin: “Gerçek Scratch'te de bu bloklar var! Tarayıcıda **scratch.mit.edu** adresine gir, **Oluştur**'a tıkla. Önemli fark: gerçek Scratch'te 🏁'e basınca kukla başa **dönmez**. Her betiğin başına **konuma git** koy.”
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5a (yeni), 5, 6, 7 · ⭐ (proje içinde ek özellik: can, ses, ikinci kukla) (zorunlu: 8 adım, bonus: ek özellik)

---

## Öncelikli değişiklikler
1. **Eksi sayıları kaldır ya da açıkla (tüm hafta).** Her yeni sayıda "**eksi (−) = ters yöne**" ipucunu ver. Mümkünse bloklarda hazır ver: x -4 → x'i (−4) değiştir, y -6, can -1. Rastgele ve karşılaştırma sayılarını (-150..150, x < -200) hazır bloklarla ver. Çocuk "eksi" yazmak zorunda kalmasın.
2. **Bölüm 26 adım 3'ü ikiye böl** ("Elma düşsün" + "Rastgele yerden, skor"). Ana kavram (değişken + rastgele) burada; adım 5 (hız) ve 6 (kazanma ekranı) ⭐ bonus olsun.
3. **Bölüm 25 adım 2'ye ön adım ekle** ("Sadece sağa yürüt"); adım 5 (süre) ve 6 (hayalet) ⭐ bonus olsun.
4. **Bölüm 27 adım 3'ü ikiye böl** ve "5 derece dön" bloğunu çıkar; rastgele aralığı ve x < -200 koşulunu hazır ver. Adım 6 (ikinci göktaşı) ⭐ bonus olsun.
5. **Bölüm 28 adım 5'e hazır başlangıç ekle** (Kedi + Elma ile "fare imlecine git"). Serbest proje boş sayfa olmasın; ipuçları ve ⭐ bonus ek özellik (can, ses) olsun.
