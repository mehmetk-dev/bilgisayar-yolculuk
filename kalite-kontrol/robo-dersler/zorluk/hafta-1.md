# Hafta 1 — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: Bölüm 1–2 çoğunlukla 🟢 (sıralama, saymak, ileri/geri). Bölüm 3 ve 4'te zorluk belirgin artıyor: dönüşler, Robo'nun gözünden sağ/sol, 8–10 komutluk programlar, anahtar/kapı sırası. Hafta genelinde 4 yıldız ya da haritalarda birkaç görev "fazla uzun" kalıyor (11–16 blok).
- En çok takılınacak yerler:
  1. Bölüm 3, adım 4 (aşağı bakan Robo'nun sağı) — zihinsel döndürme, 8–10 yaşın zayıf noktası. Kendi içinde zaten "Zor soru" diye adlandırılmış.
  2. Bölüm 3, adım 9 (U dönüşü) ve 7 (merdiven) — art arda iki sağa dönüş; ikinci dönüşte Robo aşağıya bakıyor, sağ/sol karışıyor.
  3. Bölüm 3, adım 11 (16 blok) ve adım 10 (⭐⭐⭐ "en kısa yol" + Geri git ile dönüşü birleştirme).
  4. Bölüm 4, adım 8–9 (anahtar için gidip dönme, Geri git + dönüş + kapı sırası) — program 10–15 blok ve "önce geri gel, sonra dön" mantığı.
  5. Bölüm 2, adım 6 ve 10 (11 ve 10 blok, "hangisini önce alayım" ve sayı sayma hataları).

## Bölüm 1 — Algoritma Nedir? (12 adım)
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Merhaba, ben Robo! | 🟢 | 2 kısa paragraf; "algoritma" kelimesi somut ("adım adım") | — |
| 2 | Sen de her gün algoritma kullanıyorsun | 🟢 | Günlük örnekler, kısa | — |
| 3 | Diş fırçalama (5 kart) | 🟢 | Herkesin bildiği iş | — |
| 4 | Fidan dikme (4 kart) | 🟢 | 4 kart, doğal sıra | — |
| 5 | Hangisi bir algoritma? | 🟡 | "Algoritma = sıralı adımlar" ayrımı soyut; yavaş okuyan için kek tarifi şıkkı uzun | [METİN] |
| 6 | Sandviç (5 kart) | 🟢 | Tanıdık iş | — |
| 7 | Şimdi bana komut ver! | 🟡 | Tek adımda üç tanım (komut, program, hedef) var; 3 paragraf | [METİN] |
| 8 | İlk programın (FFFF) | 🟢 | Tek komut, 4 kare say | — |
| 9 | Yukarı doğru (FFFF) | 🟢 | Sadece "ileri = baktığı yön" fikri; ipucu yok ama kolay | — |
| 10 | Robo nerede durur? | 🟢 | 3 ile 4'ü karşılaştırma; kısa | — |
| 11 | Uzun yol (FFFFFFF) | 🟡 | 7 blok, sayma hatası olabilir; ama ipucu var | — |
| 12 | ⭐ Aşağı in (6 blok) | 🟢 | Zaten bonus ve kolay | — (bonus kalsın) |

### Öneri ayrıntıları
- **Adım 5 [METİN]:** Yeni soru: “Hangisi bir algoritma? (Sırayla yapılan adımlar mı var?)” Şık 1 yeni metin: “🎂 Kek tarifi: önce un, sonra yumurta, sonra fırın”.
- **Adım 7 [METİN]:** Yeni metin: “**Komut**, robota verdiğin **tek bir emirdir**. Komutları arka arkaya dizersen **program** olur. **⬆ İleri git** beni baktığım yönde **1 kare** götürür. Hedefim pil 🔋!”
- **Önerilen yeni sıra:** 1–11 aynı (11 zorunlu adım) · ⭐ 12 (zorunlu: 11, bonus: 1). Değişiklik yok; ders zaten rahat. Adım 11 süre sıkışırsa bonus yapılabilir ama gerekmez.

## Bölüm 2 — İleri ve Geri (11 adım)
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Geri vites! | 🟢 | Araba benzetmesi, kısa | — |
| 2 | Düşün bakalım (test) | 🟡 | "Geri gider ama arkasını dönmez" yaygın yanılgı; şıklar kısa | [İPUCU] |
| 3 | Pil arkamda (BBB) | 🟢 | Tek komut, ipucu gerekmez | — |
| 4 | Önce yıldız, sonra pil (8 blok) | 🟡 | 2 ileri + 6 geri, sayma; ipucu zaten var | — |
| 5 | Nereye vardı? (FFBBB) | 🟡 | Toplama/çıkarma mantığı (+2 −3 = −1); negatif sayı kavramı gizli | [METİN] |
| 6 | İki yanda yıldız (11 blok) | 🔴 | 11 blok, iki yönde sayma, "önce hangisi" kararı | [BONUS] |
| 7 | Yukarı, sonra aşağı (7 blok) | 🟢 | Yukarı bakışta geri = aşağı; kısa program | — |
| 8 | Önce sola, sonra sağa (8 blok) | 🟡 | Adım 6'nın daha basit hali, ipucu var | — |
| 9 | Bir bilmece (3 ileri + 3 geri) | 🟢 | Birbirini götürür | — |
| 10 | Dikkat, iki yanda su! (10 blok) | 🔴 | Suya düşmeme baskısı + 10 blok + fazla ilerleme hatası | [BONUS] |
| 11 | ⭐ Yıldız yağmuru (10 blok) | 🔴 | Plan gerektirir | — (zaten bonus) |

### Öneri ayrıntıları
- **Adım 2 [İPUCU]:** “Park eden araba gibi düşün: geri gider ama **yüzü dönmez**.”
- **Adım 5 [METİN]:** Yeni soru: “Robo 2 kare ileri, sonra 3 kare geri gidiyor. Başladığı yere göre nerede?” (Tahta aynı kalsın; sayı doğrusu yerine kareler çizili.)
- **Adım 6 [BONUS]:** Çok uzun; adım 8 aynı fikri daha kısa veriyor. Bonus yapılırsa yerine adım 8 yeterli.
- **Adım 10 [BONUS]:** Su korkusu + sayma. Bonus yap ya da `~*..S..*G~` haritasını `~*.S.*G~` (5–6 blok) gibi kısaltılmış kullan.
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 7, 8, 9 · ⭐ 6, 10, 11 (zorunlu: 8 adım, bonus: 3). Not: 8 adım içinde 3 ızgara (3, 4, 7, 8 = 4 ızgara) kalıyor; ana kavram (Geri git) 3, 4, 7, 8'de pekişiyor. Bonusların sırası: 6, 10, 11 (artan zorluk).

## Bölüm 3 — Sağa ve Sola Dön (11 adım)
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Dönmeyi öğrendim | 🟡 | Çeyrek tur kavramı (derece değil), 3 paragraf, 2 yeni komut | [METİN] |
| 2 | Robo nereye bakar? (yukarı → sağa dön) | 🟢 | Yukarı bakarken sağ = sağ; kendi sağıyla çakışıyor | — |
| 3 | İki kez dönersek? (sağ → 2×sol) | 🟡 | İki adımlı zihinsel işlem, ara yönü (yukarı) bilmek gerek | [İSKELE] |
| 4 | Zor soru! (aşağı bakan, sağa dön) | 🔴 | Zihinsel döndürme: karşıdakinin sağı; öğrencilerin en çok yanıldığı yer | [İSKELE] [BONUS yerine kalmalı] |
| 5 | Köşeyi dön (FFRFF) | 🟢 | Tek dönüş, yön doğal (E→S), ipucu net | — |
| 6 | Yukarı tırman (FLFFRFFF) | 🟡 | İki farklı dönüş (L sonra R), "Robo'nun gözünden" | [İPUCU] |
| 7 | Merdiven (FRFLFRFLF) | 🟡 | 9 blok, dönüşler dönüşümlü R–L, suya düşme riski | [İPUCU] |
| 8 | Gölün etrafından (FFRFFFFRFF) | 🟡 | 10 blok, sayma (4 kare üst yol) + yıldız | [İPUCU] |
| 9 | U dönüşü (FFFRFFRFFF) | 🔴 | Art arda iki sağ dönüş; ikinci dönüşte Robo aşağı bakıyor (sağ → batı = ekranın solu) | [İSKELE] [İPUCU] |
| 10 | Akıllı kısayol (FFRFBB) | 🔴 | "Dönmek yerine geri git" optimizasyon fikri, ⭐⭐⭐ en kısa yol baskısı | [BONUS] |
| 11 | ⭐ Büyük yolculuk (16 blok) | 🔴 | 16 blok, 5 dönüş | — (zaten bonus) |

### Öneri ayrıntıları
- **Adım 1 [METİN]:** Yeni metin: “Yeni komutlar: **↰ Sola dön** ve **↱ Sağa dön**. Dönünce **ilerlemem**, sadece **yüzüm döner**. Kırmızı ok baktığım yeri gösterir 👀”
- **Adım 3 [İSKELE]:** Bir önce adım ekle: “Robo sağa bakıyor, **bir kez** sola dön → nereye bakar?” (2 şık bile yeter: Yukarı / Aşağı; tek dönüşte, resimli şıklarla). Sonra mevcut “iki kez” sorusu gelsin. Mevcut ipucu iyi.
- **Adım 4 [İSKELE]:** (Ana agent'ın tasarımıyla birleşir.) Test yerine ya da önüne “gösterip dönen Robo” animasyonu: soruda Robo'nun sağ eli kırmızı olsun, ekranda hangi yöne bakıyorsa “eli” orada görünsün. Şıklar yazı yerine ok resmi olsun (⬅ ➡ ⬆). Yeni ipucu: “Robo aşağı bakıyor. **Sen de aşağı bak** (başını masaya doğru eğ, kolunu uzat): sağ kolun hangi tarafa gidiyor?”
- **Adım 4 durumu:** Bu test ana kavramın parçası (karşıdan bakan Robo), bu yüzden bonus yapılmasın; ancak **ızgara görevlerinden önce** sorulmasın. Adım 4'ü adım 9'dan hemen önceye taşı (U dönüşü zaten aşağı bakmayı gerektiriyor); adım 5–8'de aşağı bakan Robo'ya sağ/sol verilmiyor (5: E→S bir kere R; 7: E→S bir R, sonra L ile geri E; 8: N→E→S R ile, aşağı bakınca sol/sağ gerekmiyor), yani adım 4'ün bilgisi 9'da ilk kez şart.
- **Adım 6 [İPUCU]:** Yeni ipucu: “Yıldızı alınca Robo sağa bakıyor. Yukarı çıkmak için **↰ Sola dön**. Yukarı bak: sol el yukarı mı gösteriyor?”
- **Adım 7 [İPUCU]:** Yeni ipucu: “Üç hareket tekrar ediyor: **ilerle, dön, ilerle, öbür yöne dön.** Önce kâğıtta parmağınla yürü.”
- **Adım 8 [İPUCU]:** Yeni ipucu: “Önce yukarı **2** kare. ↱ Sağa dön. Üst sırada **4** kare. ↱ Sağa dön. Aşağı **2** kare.” (Metindeki “FFRFFFFRFF” 10 blok ile aynı; döküm notundaki 8/10 sayı tutarsızlığı da düzeltilmeli: bloklar 10.)
- **Adım 9 [İSKELE]:** Önüne “Yarım U” kolay ara adım: yol U yerine L, aşağıdan sola (yani tek dönüş R ve sonra aşağı bakan Robo ikinci kez R yapınca batıya bakar) — örneğin
  ```
  S..
  ##.
  G..
  ```
  (E bakıyor; çözüm FFRFRFF: 7 blok). Bu, art arda iki R'yi daha kısa sürede deneyimletir. Mevcut ipucu iyi ama “ikinci ↱ Sağa dön: şimdi **aşağı bakıyorsun**, sağ elin **ekranın solunu** gösterir” cümlesini ekle.
- **Adım 10 [BONUS]:** “Dönmek yerine geri git” iyi fikir ama “en kısa yol” optimizasyonu ek yük; bonus ve “⭐⭐⭐” kaldırılıp “Dönmeden de çözebilirsin” denebilir.
- **Önerilen yeni sıra (zorunlu 8 adım):** **1, 2, 3, 5, 6, 7, 8, 4, 9** (adım 4 testi, U dönüşünden hemen önce) · ⭐ 10, 11 (zorunlu: 9 adım, bonus: 2). Eğer süre dar: 8'i bonus yap, zorunlu 8 adım (1,2,3,5,6,7,4,9).

### Dönüş öğretimi için ek fikirler (ana agent'ın tasarımına)
- **Arkanı dön = iki dönüş:** Ayrı bir yeni adım (ana agent planı) yeterli; ek fikir: kısa kural kartı “**↱ ↱ = arkanı dön** (ya da ↰ ↰ aynı)”, ve bir test: “Robo ileri bakıyor, ↱ ↱ → ne yaptı?” (resimli: Robo ters döndü).
- **Ara yön göstergesi:** Her dönüş sonrasında Robo ızgarada küçük bir hayalet ok bırakırsa (dönüş önizlemesi gibi) ikinci dönüşte nereye bakacağı görülür; böylece “aşağı bakan Robo'nun sağı” için hesap gerekmez.
- **Sınıf içi:** Öğrenci ayağa kalkar, **kâğıt oklar** (↰ ↱) ellerine yapıştırılır; aşağı bakarken (sınıfın arkasına dönünce) sağ elin ekranın solunu gösterdiğini canlı görmek en etkili yöntem. Öğretmen notuna “4. adımdan önce 1 dakikalık ‘arkanı dön’ oyunu” eklenebilir.
- **Hata mesajı:** Robo duvara çarptığında “Dönmeyi unuttun mu?” + kaç dönüş olduğunu gösteren yönlü iz; ya da programı **adım adım çalıştır** düğmesi (her komutta Robo'nun baktığı yön renkli okla görünür).
- **Renk kodu:** Blokta ↰ mavi (sol el), ↱ turuncu (sağ el); Robo'nun elleri aynı renkle boyanınca yön ayrımı için “mavi el hangi yanda?” sorusu yeterli olur (öğrenci “sağ/sol” yerine renkle düşünebilir).
- **Önizleme testi:** Çalıştırmadan önce küçük soru: “Bu programdan sonra Robo nereye bakacak?” (blok dizisi + 3 ok şıkkı) — özellikle art arda dönüş içeren dizilerde.

## Bölüm 4 — Önce Plan Yap (10 adım)
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Programcılar önce plan yapar | 🟢 | Harita benzetmesi; 3 soru kısa | — |
| 2 | Programı kafanda çalıştır (FFRF) | 🟡 | İki aşamalı izleme ve dönüş sonrası yön (aşağı); önceki dersten beceri | [İPUCU] |
| 3 | Hangi program doğru? | 🟡 | Üç programı karşılaştırma; her program 5 karakter, okuma ve izleme | [İPUCU] |
| 4 | Anahtar ve kapı | 🟡 | 3 paragraf, yeni 2 nesne | [METİN] |
| 5 | İlk anahtar (FFFF) | 🟢 | Tek komut | — |
| 6 | Anahtar arkamda (BBFFFFF) | 🟡 | Sıra fikri (önce anahtar); 7 blok; ipucu var | — |
| 7 | Ne olur? (FFF) | 🟢 | Tek koşul sorusu, yanıt açık | — |
| 8 | Gizli anahtar (10 blok) | 🔴 | Çıkmaz sokakta gidip geri gelme, B + R + L bir arada | [İSKELE] |
| 9 | Labirentte anahtar (15 blok) | 🔴 | 15 blok, çıkış yönünü bulma, "geri geri çıkıp dön" | [BONUS] veya [İSKELE] |
| 10 | ⭐ Hazine avı (11 blok) | 🔴 | Üç hedef + sıra planı | — (zaten bonus) |

### Öneri ayrıntıları
- **Adım 2 [İPUCU]:** “Parmağınla yürü: 2 kare sağa. Sağa dön: şimdi **aşağı** bakıyorsun. 1 kare aşağı.”
- **Adım 3 [İPUCU]:** “Her şıkkı parmağınla yürü. Köşede **sağa dönüş** nerede olmalı?”
- **Adım 4 [METİN]:** Yeni metin: “**🔑 Anahtar**ı alırsan **🚪 kapılar** açılır. Anahtarın **üstünden geçmen** yeter. Anahtarsız kapıya gidersen **çarparsın** 💥”
- **Adım 8 [İSKELE]:** Önüne kısa bir ara görev ekle: Robo E bakıyor, harita `S.G` üstte, altta tek karelik çıkmaz; kapı yok. Beklenen çözüm: ileri, sağa dön, ileri (anahtar), geri, sola dön, ileri. Amaç, “anahtarı al, geri gel, dön, devam et” kalıbını 10 bloktan önce göstermek. Mevcut adım 8 ipucu zaten iyi.
- **Adım 9 [BONUS]:** 15 blok, çok uzun; aynı kalıbı adım 8 öğretiyor. Bonus yap.
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 7, 8 · ⭐ 9, 10 (zorunlu: 8 adım, bonus: 2). Ana kavram (planlama + ön koşul) 2, 3, 5, 6, 7, 8'de yeterince pekişiyor.

## Öncelikli değişiklikler
1. **Bölüm 3, adım 4 ve 9'a görsel iskele** (renkli eller/Robo'nun gözünden gösterim, resimli şıklar, “yarım U” ara görevi): hafta boyunca en çok takılınacak yer; ana agent'ın tasarımıyla birleştirilmeli. Adım 4 testini adım 9'dan hemen önceye taşı.
2. **Bölüm 3 bonuslarını netleştir:** 10 ve 11 bonus; zorunlu çekirdek 1, 2, 3, 5, 6, 7, 8, 4, 9 olsun. Adım 3'ün önüne tek dönüşlü ara soru ekle.
3. **Bölüm 2'de uzun/baskılı görevleri bonusa al:** adım 6 ve 10 bonus; zorunlu: 1, 2, 3, 4, 5, 7, 8, 9.
4. **Bölüm 4'te adım 9'u bonusa al, adım 4'ü kısalt** ve adım 8'in önüne kısa “anahtar–geri–dön” kalıbı ara görevi ekle.
5. **Anlatım metinlerini kısalt (Bölüm 1 adım 7, Bölüm 3 adım 1, Bölüm 4 adım 4):** 3 paragraf yerine 2–3 kısa cümle; kalın anahtar kelimeler. Ayrıca Bölüm 3 dökümündeki blok sayısı tutarsızlıklarını (adım 8: 8/10, adım 9: 8/10) düzelt.
