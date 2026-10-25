# Hafta 4 — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: Orta–zor. Bölüm 13 ve 16 çoğunlukla kolay (bloğu sürükle, sayıyı yaz). Bölüm 14 en zor ders: negatif koordinat, koordinat düzlemi ve yön derecesi hepsi bir arada. Bölüm 15 orta; kavram (olay) somut ve eğlenceli, ama çok betikli adımlar uzun.
- En çok takılınacak yerler:
  1. B14 adım 1, 5, 9: negatif sayılar (x: -170, y: -110, x: -150). Çocuk "eksi" işaretini bilmiyor; yanlış işaretle yazınca arı/kedi yanlış köşeye gidiyor.
  2. B14 adım 7: "300 sağda, 200 yukarıda → 10 kez 30 değiştir" bir bölme + iki eksenli planlama. Çok zor.
  3. B14 adım 8: "0 yukarı, 90 sağ, 180 aşağı, -90 sol" yön derecesi (hem açı hem negatif).
  4. B13 adım 7–8: "15 / 30 / 60 derece" ve "10 kez × 36 = 360". Açıyı derece ile ölçmeyi bilmiyorlar; 36 sayısını kendi başına bulamazlar.
  5. B15 adım 2 ve 3: iki–dört ayrı betik, tuşları basılı tutma ve "-10" (negatif) birlikte. B15 adım 9: rastgele konum + sayaç (3 kez yakala) mantığı karışık.

## Bölüm 13 — Scratch Dünyasına Merhaba
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Hoş geldin (anlatım) | 🟢 | Kısa, emojili; kukla/dekor/sahne yeni kelime ama somut. | — |
| 2 | Ekranı tanıyalım | 🟡 | 5 madde, 4 renk grubu bir arada; okuma yükü var. | [METİN] |
| 3 | Test: Kukla | 🟢 | Tek kelime, 3 şık. | — |
| 4 | Kedi yıldıza koşsun | 🟢 | Tek blok + sayı. Ama kedi x:-160 → negatif görünüyor; çocuk görmüyor, sorun değil. | — |
| 5 | Konuşan kedi | 🟡 | 4 blok sıra; "de" bloğunun iki türü karışabilir. | [İPUCU] |
| 6 | Test: Sıra | 🟢 | Robo'dan tanıdık. | — |
| 7 | Dans eden kedi | 🔴 | "15 derece" ve ↻/↺ yönü; derece bilinmiyor, sağ/sol dönüş karışıyor; örnekte 30/60 var. | [SAYI] [METİN] |
| 8 | Tam bir tur (360) | 🔴 | 360° ve 10×36 bölmesi; çocuk 36'yı bulamaz. İpucu çözümü veriyor ama sebep anlaşılmaz. | [SAYI] [İSKELE] |
| 9 | ⭐ Kendi gösterini yap | 🟡 | Serbest; "tekrarla" ve dönmeyi birlikte ister. Zaten ⭐ olarak işaretli. | [BONUS] |

### Öneri ayrıntıları
- **Adım 2 [METİN]:** Yeni metin: “Solda **bloklar** var. Bloğu tut, **kod alanına** sürükle. Sağda **sahne** var: 🏁 başlatır, ⏹ durdurur. Her program sarı **[🏁 tıklandığında]** bloğuyla başlar.” (Renk grupları ayrı satır olmasın; sadece [Hareket] mavi, [Görünüm] mor örnek verilsin.)
- **Adım 5 [İPUCU]:** Yeni ipucu: “Sırayla dört blok: 1) 🏁 2) **Merhaba! de** 3) **100 adım git** 4) **Ben Scratch kedisiyim! de**. Konuşma bloğunun içindeki yazıyı tıklayıp değiştir.”
- **Adım 7 [SAYI] [METİN]:** 15, 30, 60 yerine sadece **90** ve **45** kullan, ya da hiç sayı verme: bloğun içinde hazır 15 durur; çocuk "daha çok dön" için 90 yazsın. Yeni metin: “Kedi **sağa** dönsün (↻), sonra **sola** dönsün (↺). Her dönüşün arasına **bekle** koy. Dönmesi az geliyorsa sayıyı **90** yap: 90 = köşe kadar dön (dik açı).” Hedefler değişmez (sağa, sola, bekle); sayının değeri denetlenmesin. Pano üstüne ya da sahne köşesine küçük pusula: kedinin üzerinde yön oku (zaten rot: all) yeterli.
- **Adım 8 [SAYI] [İSKELE]:** Önce yeni bir kolay ara adım ekle (8a): “**Dik açı turu**: ↻ **90 derece** dön bloğunu **4 kez** tekrarla; kedi tam tur dönsün.” Hedef: “tekrarla” kullan + son yön ilk yönle aynı (4×90). Sebebi tek cümle: “90 + 90 + 90 + 90 = tam tur (360).” Çocuk 4×90'ı toplama ile bilir. 10×36 versiyonu **⭐ bonus** olsun, hazır değer olarak ipucundaki gibi kalsın.
- **Adım 9:** ⭐ kalsın ama sona taşı (zaten son).
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 7 (90/45 ile), 8a (yeni: 4×90) · ⭐ 8 (10×36), 9 (zorunlu: 8 adım, bonus: 2)

## Bölüm 14 — Hareket ve Koordinatlar
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Sahne bir harita | 🔴 | x/y, 240, -240, 180, -180: negatif sayı + koordinat düzlemi tek ekranda. Çok sayı, çok kavram. | [METİN] [İSKELE] [SAYI] |
| 2 | Test: Orta nokta | 🟢 | "Tam ortası" kolay. | — |
| 3 | Test: Köşeyi bul | 🔴 | Üç şıkta işaret farkı (-200/200, 150/-150); negatifi bilmeyen tahmin eder. | [SAYI] [İPUCU] |
| 4 | Yıldıza ışınlan | 🟡 | Pozitif (150, 100); fareyle koordinat okuma var (ipucu). İki sayı. | [İPUCU] |
| 5 | Dört köşedeki çiçekler | 🔴 | Dört nokta, ikisi negatif x, ikisi negatif y; her birini işaretle yazmak şart. Çok uzun betik. | [İSKELE] [SAYI] [BONUS] |
| 6 | Test: x değişirse | 🟡 | "x'i 10 değiştir" soyut; "sağ-sol" bağı ile çözülür. | [METİN] |
| 7 | Bayrağa tırman | 🔴 | 300 sağ/200 yukarı → 10×30 + 10×20: bölme, iki eksen, iki döngü. | [BONUS] |
| 8 | Roketin yönü | 🔴 | Yön derecesi (0, 90, 180, -90) ve negatif; "yönüne dön" ile "adım git" birlikte. | [SAYI] [İSKELE] |
| 9 | ⭐ Bal toplayan arı | 🔴 | Negatif sayılar + 3 süzülme + 3 "Bzz". | [BONUS] (zaten) |

### Öneri ayrıntıları (koordinat ve yön için somut çözümler)

**A. Sahnede ızgara + cetvel (en önemli).** `koordinat` arka planına çiz (kod değil, görsel): her **50 birimde** silik çizgi, çizgilerin ucuna sayı yaz (-200 -150 -100 -50 0 50 100 150 200; y için -150 … 150). x ekseni **mavi**, y ekseni **kırmızı** olsun; "x = yatay (sağ-sol)", "y = dikey" yazısı eksenin ucunda dursun. Negatif yarıya **soluk gri/turuncu** zemin ver: "bu tarafta sayıların önünde **−** var". Kuklaların koordinatını **50'nin katlarına** yuvarla (aşağıda).

**B. Hazır değer + yakınlık toleransı.** Hedefler "tam nokta" aramasın: kuklanın (x,y) merkezi hedefin ±25 biriminin içinde olsun (ya da "dokundu" yeter; zaten dokunma hedefi var). Çocuk -170 yerine -150 yazsa da çiçeğe değer. Bu hem yuvarlamayı hem negatif sayıdaki küçük hataları affeder.

**C. Fareyle koordinat okuma ana yol olsun.** Sahnenin üstünde canlı "x: … y: …" göstergesi çok güçlü; adım 4 ipucundaki bu bilgiyi adım 1'e de koy ve **büyük/renkli** yap. Çocuğun sayıyı kendi hesaplaması yerine okuyup yazması yeterli. Eksi işareti yazılıyorsa göstergede **kırmızı** olsun.

**D. Eksi kuralı tek cümle.** “Sayının önünde **−** varsa **ters yöne** gider: x'te **sola**, y'de **aşağı**.” Bunu adım 1'de ve adım 6'da tekrarla. Yaş için "sıfırın altı" (asansör: zemin kat 0, bodrum -1, -2) benzetmesi iyi: 3–4. sınıf asansör düğmesini bilir.

**E. Sayısız `[SAYI]` değişikliği.** Çiçek/bayrak/yıldız koordinatlarını 50'nin katı yap ve ilk görevlerde mümkünse **pozitif** tut:
- Adım 4 zaten pozitif (150, 100); 100 yap.
- Adım 5 yerine ara adım ekle (5a): “Arı iki çiçeğe uğrasın”: Çiçek1 (100, 100), Çiçek2 (100, -50)? Yine negatif y. Alternatif: **Çiçek1 (100, 100), Çiçek2 (-100, 100)**: sadece x işaret değiştirir (sol-sağ); y hep +. Böylece "eksi = sola" tek başına öğrenilir. Sonra 5b: dört çiçek (aynı ± 100, ± 100) ⭐ bonus.
- Adım 7 (bayrak): Robo (-150,-100), Bayrak (150,100). Çocukların negatif sayıyla uğraşması gerekmiyor (x'i değiştir pozitif). Ama 300/200 hesabı zor; ya sadece "x'i 10 değiştir, y'yi 10 değiştir"i 10 kez tekrarla (ikisi aynı döngüde) diye değiştir: Robo (-100,-100) → Bayrak (100,100) → köşegen, tek döngü: 20 kez [x'i 10 değiştir, y'yi 10 değiştir]. Hesap: 200÷10 = 20; yine bölme ama tek sayı. Ya da tamamen **bonus**.
- Adım 9 bonus: kalsın.

**F. Yön derecesi için pusula/oklu görsel.** Adım 8 için sahnede kuklanın yanında dört yönlü pusula göster: ⬆ **0**, ➡ **90**, ⬇ **180**, ⬅ **-90** (veya 270 yazılabilir; Scratch 270 da kabul eder → "sol = 270" negatiften kaçınmak için). Ayrıca hazır sayı: bloktaki ▾ açılır listesinde (Scratch'teki gibi) dört seçenek (0, 90, 180, -90) olsun; çocuk **yazmasın, seçsin**. Hedef: sayıyı yazmak yerine listeden seçmek.

**G. Adım 1 [METİN] (yeni metin):** “Sahne bir harita. Her yerin iki sayısı var: **x** = sağa-sola, **y** = yukarı-aşağı. Tam ortası **0, 0**. Sağa ve yukarı **+**, sola ve aşağı **−** (eksi). Fareyi sahnede gezdir, sayıları ekranın üstünde oku!” Üstteki 240/180 sınırlarını metinden kaldır (görselde dursun).

**H. Adım 3 [SAYI] [İPUCU]:** Şıkları bir ilerle: “Sağ üst köşe için x ve y **artı** olmalı” cümlesi soruda dursun; şıkları “x: 200, y: 150 / x: -200, y: 150 / x: 200, y: -150” yerine **ok işaretli** yap: “sağda+yukarıda”, “solda+yukarıda”, “sağda+aşağıda” şıkları, yanında koordinatlar. İpucu: “Sağ = x **artı**, yukarı = y **artı**.”

**I. Adım 4 [İPUCU]:** “Fareyi **yıldızın üstüne** getir, sahnenin üstündeki **x** ve **y** sayılarını blokta aynen yaz.”

**J. Adım 6 [METİN]:** Yeni metin: “[x'i 10 değiştir]: kukla **x yönünde**, yani **sağa** 10 adım gider. −10 yazarsan **sola** gider.” Şıklar aynı kalsın.

**K. Adım 8 [SAYI] [İSKELE]:** İlk iki adımı ayır: önce “yönüne dön” bloğunu **ok tuşu gibi** tanıtan 8a (Roket sadece sağa uçsun: **90 yönüne dön → adım git**, hedef yıldız aynı yatay hizada; sayı 90 tek). Sonra 8b (bu adım): yukarı (**0**) sonra sağ (**90**); sol (-90) kullanılmasın. Yıldız (100, 80) yerine (100, 100), Roket (-150, -100) ok.

- **Önerilen yeni sıra:** 1 (yeni metin + ızgara), 2, 3 (ok şıklı), 4, 5a (yeni: iki çiçek, sadece ±x), 6, 8a (yeni: sadece sağa, 90), 8 (yukarı + sağ, listeden seç) · ⭐ 5 (dört çiçek), 7 (bayrağa tırman), 9 (arı) (zorunlu: 8 adım, bonus: 3)
  - Not: 5a ve 8a yeni eklenen ara adımlardır; zorunlu adım sayısı bunlarla 8 olur.

## Bölüm 15 — Olaylar: Ne Zaman?
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Program ne zaman başlar | 🟢 | Kapı zili benzetmesi güzel. | — |
| 2 | Klavye ile yürüt | 🟡 | İki betik, "x'i -10 değiştir" negatif; yıldız (200,-60), elma (-200,-60). | [SAYI] [İPUCU] |
| 3 | Peynir avı | 🟡 | Dört betik; y'yi değiştir; uzun ama tekrar yapı aynı. | [İSKELE] |
| 4 | Test: Kaç betik | 🟢 | Peynir avına bağlı, cevap kolay. | — |
| 5 | Bana tıkla | 🟢 | Tek olay + iki blok. | — |
| 6 | Hayvan orkestrası | 🟡 | Üç kukla, sekme değiştirme; yönerge uzun, iş tekrar. | [İPUCU] |
| 7 | Zıplayan Robo | 🟡 | İki betik, +60/−60 yukarı-aşağı. | [İPUCU] |
| 8 | Test: Oyun karakteri | 🟢 | — | — |
| 9 | ⭐ Uğur böceği | 🟡 | Rastgele konum + "3 kez yakala" sayacı mantığı karışık. Zaten ⭐. | — |

### Öneri ayrıntıları
- **Adım 2 [SAYI] [İPUCU]:** Sol tuşta "-10" görecek ama yazma zorunluluğu bildiği için sınıfta sorun çıkarır. İpucu: “Sağ tuş: **x'i 10 değiştir**. Sol tuş: **x'i -10 değiştir** (eksi 10 = **sola**). Önce bir yıldıza, sonra elmaya git.” Eksi sayıyı bu derste bir kez "sola" ile eşle; B14 D kuralıyla tutarlı olsun.
- **Adım 3 [İSKELE]:** Önce dört tuş yerine **iki tuş** (sağ + yukarı), peynir sağ üstte; sonra dört tuş. Ya da adımı ikiye böl: 3a sağ-sol (adım 2'nin tekrarı), 3b yukarı-aşağı eklemek. Metin: “Fareyi peynire götür. **Sağ/sol** için **x**, **yukarı/aşağı** için **y** değiştir. Aşağı için sayı **−10**.”
- **Adım 6 [İPUCU]:** “Önce **Kedi** kuklasını seç, betiği yaz. Sonra alttaki **Köpek**'e tıkla, aynı şeyi yap. Sonra **Davul**.” (Üç kukla ardışık = üç tekrar; sınıf zamanı 40 dk için ikisi zorunlu, üçüncüsü bonus olabilir.)
- **Adım 7 [İPUCU]:** “Boşluk tuşu: **y'yi 60 değiştir** (yukarı), **bekle**, **y'yi -60 değiştir** (aşağı).”
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 7, 8 · ⭐ 9 (zorunlu: 8 adım, bonus: 1). Adım 3'ü iki kademeli yaparsan zorunlu sayı 9 olur.

## Bölüm 16 — Görünüm: Kostüm ve Animasyon
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Kuklaların kıyafet dolabı | 🟢 | Çizgi film benzetmesi, kısa. | — |
| 2 | Yürüyen kedi | 🟡 | Tekrarla içinde 3 blok; "12 kez × 10 adım" bölme yok ama sayı seçimi. | [İPUCU] |
| 3 | Büyü, küçül | 🟡 | "−10 küçültür"; yüzde (180%) ondalık/oran, negatif sayı. | [METİN] [SAYI] |
| 4 | Renk değiştiren balık | 🟢 | Blok sürükle; sihirli etki eğlenceli. | — |
| 5 | Sohbet | 🔴 | Zamanlama: "kedinin konuşma süresi kadar bekle"; iki betik aynı anda başlar, aynı sürede. Soyut. | [METİN] [İSKELE] |
| 6 | Sihirbaz hayalet | 🟡 | 6 blok sıra, gizle/göster; bekle. | [İPUCU] |
| 7 | Test: Animasyonun sırrı | 🟢 | — | — |
| 8 | Gece oldu | 🟢 | Dekor bloğu, birkaç blok. | — |
| 9 | ⭐ Kendi animasyonun | 🟢 | Serbest, kütüphane açık. | — |

### Öneri ayrıntıları
- **Adım 2 [İPUCU]:** Tekrarla içinde 3 blok: “**10 adım git**, **sonraki kostüm**, **0.1 saniye bekle**. Tekrar sayısı **12** olsun; ya da daha çok.” Zaten ipucu var; ekle: “Kedi çok yavaş geliyorsa adım sayısını artır.”
- **Adım 3 [METİN] [SAYI]:** Yeni metin: “Yıldız önce **büyüsün**, sonra **küçülsün**. [büyüklüğü **10** değiştir]: büyür. [büyüklüğü **−10** değiştir]: küçülür.” Negatifi bir kez "küçültür" ile eşle. %180 hedefi yerine "yıldız gözle görülür büyüsün (en az %150)" diye eşiği düşür; yüzde kelimesini metinden çıkar, sadece sayı.
- **Adım 5 [METİN] [İSKELE]:** Yeni metin: “Kedi **2 saniye** konuşuyor. Köpek de önce **2 saniye bekle**, sonra konuşsun. Böylece kedi **susunca** köpek başlar.” Ön adım (5a): Kedi tek başına 2 sn konuşsun, Köpek tek başına 2 sn bekleyip sonra konuşsun; ikisini birleştirmek 5. adımda olsun. Alternatif: bu adım ⭐ olabilir (ana kavram "animasyon", sohbet değil); öncelik düşük.
- **Adım 6 [İPUCU]:** “Sırayla: **göster**, **Şimdi kayboluyorum! de**, **gizle**, **1 saniye bekle**, **göster**.” (Rastgele konum olmadan da çalışır.)
- **Önerilen yeni sıra:** 1, 2, 3, 4, 6, 7, 8, 9 (⭐ olmadan 9'u sona alma) · ⭐ 5 (sohbet) (zorunlu: 7 adım + serbest 9, bonus: 1). Adım 9 zaten ⭐ ama ana kavramı pekiştirir; zorunlu bırakıp sona koy ve "serbest" kalsın.

## Öncelikli değişiklikler
1. **B14: sahne ızgarası + canlı x/y göstergesi + eksi kuralı ("−" = ters yön: sola / aşağı).** Arka plana 50'lik çizgiler ve sayı etiketleri ekle; negatif tarafı farklı renk yap; fareyle okunan x ve y sayılarını büyük yaz. Hedefleri ±25 tolerans ile denetle; tüm koordinatları 50'nin katı yap.
2. **B14: koordinat adımlarını kademele.** İlk görevler sadece pozitif ya da sadece x'te negatif (5a: iki çiçek ±100,100); dört çiçek (5), bayrağa tırman (7) ve arı (9) ⭐ bonus. Zorunlu 8 adım kalır.
3. **B13/B14: derece yerine hazır değer.** B13 adım 7'de 15/30/60 yerine 90 ve 45 (dik açı); adım 8'e önce 4×90 kolay turu ekle, 10×36 ⭐ bonus. B14 adım 8'de "yönüne dön" için açılır listeden 0/90/180/-90 seçtir; pusula görseli koy.
4. **B14 adım 1 ve 3 metinleri.** Adım 1'i 3 kısa cümleye indir (yeni metin yukarıda), sınır sayılarını (240/180) çıkar; adım 3 şıklarını oklu ve "sağ-yukarı" sözlü yap.
5. **B16 adım 5 (Sohbet) ⭐ bonusa taşı ya da önüne 5a ekle; B15 adım 3'ü iki kademeye böl.** Zamanlama ve dört betik, ana kavramı (animasyon / olay) öğretmeyen yük getiriyor.
