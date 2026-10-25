# Hafta 2 — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: **Orta → zor.** 5. bölüm kolaydan ortaya, 6. bölüm ortada (iyi tırmanıyor), 7. bölüm zor (iç içe döngü), 8. bölüm zor (uzun, tek parça programlar).
- En çok takılınacak yerler:
  1. **7. bölüm adım 4–8 (iç içe döngü):** "dış/iç döngü", `2(3(F)R)` gösterimini okumak ve 2×3'ü "tur içinde tur" olarak görmek.
  2. **6. bölüm adım 8 ("döngü sonu ⤶"):** bloğun döngünün *içinde mi dışında mı* olduğu. İç içe döngünün asıl temeli burası; şimdi sadece tıklama tarifiyle geçiliyor, kavram öğretilmiyor.
  3. **8. bölüm adım 3, 5, 6, 7:** 15–20 komutluk, tek seferde yazılan programlar; "parçalara böl" deniyor ama parça parça kontrol yok. Geri git + kapı/anahtar + yıldız aynı anda.
  4. **5. bölüm adım 6 ve 9:** haritada "kaç kare gitti, hangisi eksik" saymak ve sağ/sol döndürme (Robo kuzeye bakarken).
  5. **Süre:** 6. bölümde 13 adım var; 40 dakikada, sürücü/yol gösterici değişimiyle zor yetişir. Zorunlu adımlar 11'e inmeli.
- Önemli bulgu: 7. bölümde adım 7, 10, 11 ve 12'nin blok sınırı **iç içe döngü olmadan da** yetiyor (ör. `3(FFR)` = 4 blok, `3(FFPR)F` = 6 blok). Yani çocuk iç içe döngüyü anlamasa da bu adımları geçebilir. Zorla iç içe gerektiren yalnızca 7. bölüm adım 8 ve 8. bölüm adım 6 (spiral). Bunu "iç içe döngü bonus" kararında kullanabilirsiniz.

---

## Bölüm 5 — 🐞 Bug Avı: Hata Ayıklama
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Programda böcek var! (anlatım) | 🟢 | Güve hikâyesi kısa, somut. | — |
| 2 | Bug avcısı ipuçları (anlatım) | 🟡 | 4 ipucu + ek not; yavaş okuyan için uzun. ✖ ile silme ve "tam yere ekle" arayüz bilgisi. | [METİN] |
| 3 | Eksik adım | 🟢 | 5 kare, 3 blok; saymak yeter. | — |
| 4 | Yanlış dönüş | 🟡 | Sağ/sol ayrımı. Robo sağa bakarken "aşağı" = sağa dön; zihinsel döndürme. | [İPUCU] |
| 5 | Hangi blok hatalı? (test) | 🟡 | Programı kafada izlemek gerek; ama 4. adımla aynı harita, öğrenilmiş. | — |
| 6 | Neden suya düştü? | 🟡/🔴 | Kuzeye bakarak başlıyor, 9 blok, 4 kare saymak ve dönüşleri izlemek. | [İPUCU] |
| 7 | Fazladan bir blok | 🟡 | "Fazla" bulmak "eksik" bulmaktan zor; 9 blok. | [İPUCU] |
| 8 | Sıra karışmış! | 🟡 | Kavram güzel (sıra), ama sürükle-bırak ve Geri git; anahtar-kapı sırasını düşünmek. | — |
| 9 | İki bug birden | 🔴 | 10 blok, iki hata birbirini saklıyor, üç dönüş yönü; Sağ/Sol karışır. | [BONUS] |
| 10 | ⭐ Büyük bug avı | 🔴 | 15 blok, iki hata; zaten bonus. | Bonus kalsın; [İPUCU] |

### Öneri ayrıntıları
- **Adım 2 [METİN]:** Yeni metin: “1. ▶ Çalıştır'a bas, Robo'yu izle. 2. Robo nerede yanlış yaptı? 3. O bloğun ✖ düğmesine bas, sil. 4. Doğru komuta bas, tam o yere gelir.”
- **Adım 4 [İPUCU]:** Yeni ipucu: “Robo sağa bakıyor, aşağı inecek. Aşağı inmek için ↱ Sağa dön gerekir. ↰ Sola dön bloğunu sil, yerine ↱ koy.”
- **Adım 6 [İPUCU]:** Yeni ipucu: “Önce ▶ bas. Robo hangi karede suya düştü? Üst sıradaki kareleri say: 4 kare gitmeli, ama 3 gidiyor. İkinci ↱ Sağa dön bloğunun önüne bir İleri git ekle.”
- **Adım 7 [İPUCU]:** Yeni ipucu: “Yukarı çıkarken sadece 2 kare var. Programda 3 İleri git var. Biri fazla. İlk ↰ Sola dön'den sonraki 3 İleri git'ten birini sil.” (ilk F, L'den önce; fazla olan L'den sonraki üç F'den biri.)
- **Adım 9 [BONUS]:** İki hata + 10 blok bu yaş için fazla; "ikinci hatayı ortaya çıkarma" fikri güzel ama bonus. Programın 5. bölümdeki "Eksik/Yanlış/Fazla/Sıra" türleri (4 çeşit hata) temel için yeter.
- **Adım 10:** Hint'te "yukarı (sola)" yazıyor; "sola" kelimesi dönüş ile yön karışıklığı yaratır. Yeni ipucu: “Alttaki yoldan sonra Robo yukarı çıkmalı: ↰ Sola dön. Programın sonunda bir İleri git de eksik.”
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 7, 8 · ⭐ 9, 10 (zorunlu: 8 adım — 2 anlatım, 1 test, 5 ızgara; bonus: 2)

---

## Bölüm 6 — 🔁 Tekrar Tekrar: Döngüler
Genel değerlendirme (iç içe döngünün temeli olarak): **Tek döngü öğretimi iyi kurulmuş** (yorucu yazma → döngü → tur tur çalışma → izle (boncuk) → tahmin testi → adım adım kurma → desen bulma). Ama iç içe döngüye taşınacak üç eksik var:
1. **"İçinde/dışında" kavramı öğretilmiyor.** Adım 7'de döngünün içine 4 blok girer ve adım 8'de "döngü sonu ⤶" tıklaması tarif edilir; çocuk bunu "tıklama numarası" diye ezberler. R'nin dışarıda olması ile içeride olması arasındaki farkı gösteren tek bir örnek yok.
2. **Çok bloklu döngünün çalışması izlenmiyor.** İzle adımı (3) yalnızca `4(F)` (tek blok). `3(FLFR)` hiç izlenmiyor; "bir tur = 4 komut" görülmüyor. İç içe döngü "bir tur içinde bir tur" olduğundan önce "bir tur = çok komut" oturmalı.
3. **Döngü bir kutu gibi gösterilmiyor** (bilmiyorum arayüzde nasıl, ama metinde yok). Kutu/çerçeve görseli (renkli çerçeve + girinti) iç içe için de gerekli.

| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Ufff, çok yoruldum! (anlatım) | 🟢 | Somut, kısa. | — |
| 2 | Döngü tur tur çalışır (anlatım) | 🟡 | "Tur", "döngünün başına dönmek" soyut; ama sonraki izle adımı destekliyor. | — |
| 3 | 👀 İzle: Döngü nasıl çalışır? | 🟢 | Boncuklarla görsel; sadece izle. | — |
| 4 | Kaç kare gider? (test) | 🟢 | 3×1; basit. | — |
| 5 | Adım adım: İlk döngün | 🟢/🟡 | Adım adım yönlendirme var. Tuzak: "S'yi de sayarım → 9". | [METİN] |
| 6 | Robo ne çizer? (test) | 🟡 | "Kare" hem harita karesi hem şekil. 4 turu kafada çizmek gerek. | [METİN] |
| 7 | Merdiven döngüsü | 🟡/🔴 | İlk çok bloklu döngü; "bir basamak = 4 blok" deseni var, ama tarifle veriliyor; sağ/sol dönüşleri. | [İSKELE] |
| 8 | Döngüden sonra | 🔴 | Blok dışarıda/içeride; "döngü sonu ⤶" tıklaması; 6 yönerge; iki ayrı döngü. | [İSKELE] [METİN] |
| 9 | Yıldızlı zikzak | 🟡/🔴 | Yönerge/tut yok; 4 blokluk deseni haritadan bulmak. İpucu var. | [İPUCU] |
| 10 | Hangisi daha iyi? (test) | 🟢 | 2 blok mu 6 blok mu; saymak yeter. | — |
| 11 | Büyük merdiven | 🟡 | 7'nin aynısı, 5 basamak; yardımsız ama bilinen kalıp. | — |
| 12 | Bahçeyi dolaş | 🔴 | 3 kenar + döngü sonrası ekstra F; "neden 3 tekrar, 4 değil?" ve sondaki F'yi bulmak. | [BONUS] |
| 13 | ⭐ Merdiven ve koridor | 🔴 | İki döngü, 7 blok; zaten bonus. | Bonus kalsın |

### Öneri ayrıntıları
- **Adım 5 [METİN]:** 3. tut maddesi yeni metin: “Robo S'den G'ye kaç adım atacak? S'yi sayma, kareleri say: 8. Döngüdeki sayıyı 8 yap.” (Aynı düzeltme: adım 7, 8 tut maddelerinde "say" geçen yerlere "S'yi sayma" ekleyin.)
- **Adım 6 [METİN]:** Soru: “🔁 4 kez tekrarla: ⬆ İleri git, ↱ Sağa dön. Robo ne çizer?” Şıklar: “Düz bir çizgi” / “Zikzak” / “✔ Küçük bir kutu ⬜ çizip başladığı yere döner”. Açıklama: “Her turda bir kenar yürüyüp sağa dönüyor. 4 kenar = kutu!” (Neden: "kare" kelimesi hem bu görevde "kaç kare gider" hem şekil anlamında; karışıyor.) Ek ipucu: “Parmağınla masada dene: ileri, sağa dön, ileri, sağa dön…”
- **Adım 7 ile 8 arasına [İSKELE] 1, yeni kısa adım (👀 İzle, çok bloklu):** Tür: izle (`watch`). Harita: adım 7'dekinin küçük hali (2 basamak). Hazır program `2(FLFR)`. Yazı: “Bir tur = 4 komut. 2 tur = 8 komut. Boncuk her turda bir dolar.” Süre en çok 2 dk. (İç içe döngünün "bir tur = çok komut" temeli.)
- **Adım 8 öncesi [İSKELE] 2, yeni kısa test "Hangi blok döngünün içinde?":** Kod resmi: `4(F)` ve altında `R`; soru: “Sağa dön kaç kez çalışır?” Şıklar: 1 kez ✔ / 4 kez / hiç. Açıklama: “R döngünün dışında, yani sadece 1 kez.” Sonra ikinci resim: `4(F R)` → “R kaç kez çalışır?” → 4 kez. İki resim yan yana, "içinde = tekrar eder, dışında = 1 kez". Bu test iç içe döngüde "hangi sayı neyi tekrar ediyor"un doğrudan temelidir.
- **Adım 8 [METİN]:** Yeni görev: “Robo önce düz gidecek, sonra dönecek, sonra yine düz gidecek. Bazı bloklar döngünün **dışında** olur: sadece 1 kez çalışır.” Yeni tut: 1. “Tekrarla'ya, sonra İleri git'e bas.” 2. “Dönmeden önce 4 kare var. Sayıyı 4 yap.” 3. “Altındaki **döngü sonu ⤶** yazısına tıkla. Artık döngünün dışındasın.” 4. “Sağa dön'e bas. Bu blok 1 kez çalışır.” 5. “Son 2 kare için yeni döngü: Tekrarla, İleri git, sayı 2.” 6. “▶ Çalıştır'a bas.”
- **Adım 9 [İPUCU]:** Yeni ipucu: “Haritada renkli yola bak. Her parça aynı: İleri git, Sağa dön, İleri git, Sola dön. Bunu 3 kez tekrarla.” (Şimdiki ipucu "bir parça…" iyi ama ✔ pathHint ile birlikte daha somut.)
- **Adım 12 [BONUS]:** 3 tur döngü + döngü dışı ekstra F, 5 blok sınırı; 8. adımın "dışarıda blok" kavramı üstüne zor bir uygulama. Aynı harita 7. bölüm adım 11'de (yıldızlarla) tekrar geliyor; öğrenci 7'de karşılaşır.
- **Süre:** 13 adımın 11'i zorunluya iner; yeni 2 kısa adım eklenirse 13 olur — 3 (izle) ve 4 (test) 1–2 dakikada geçilmeli, 10. test hızlı geçilebilir.
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 7, **[yeni izle çok bloklu]**, **[yeni test içinde/dışında]**, 8, 9, 10, 11 · ⭐ 12, 13 (zorunlu: 13 adım ama 2'si çok kısa — 2 anlatım, 3 test + 1 yeni test, 7 ızgara; bonus: 2). İstenirse yükü azaltmak için 10. test ya da 6. test çıkarılabilir.

---

## Bölüm 7 — 🧶 Desenler ve İç İçe Döngüler
Genel: İlk üç adım (desen) kolay. Kavram atlayışı adım 4–6'da (yalnızca anlatım + izle + test; öğrenci henüz hiç kurmadan "2×3" düşünmek zorunda). Adım 7 (8 yönerge) ilk kurulum, sonra 8 yardımsız. Yıldızı al (9–12) ise ayrı yeni komut; **iç içe olmadan çözülüyor**.

| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Desen dedektifi (anlatım) | 🟢 | Kaldırım taşı, kazak: somut. | — |
| 2 | Sırada ne var? (test) | 🟢 | 1 elma 2 muz; tanıdık. | — |
| 3 | Tekrar eden parça (test) | 🟢/🟡 | Kod harfleri FFR; "tekrar eden parça" fikri 6. bölümde var. | — |
| 4 | Döngünün içinde döngü! (anlatım) | 🔴 | "Dış/iç döngü" soyut; alkışla/zıpla örneği iyi ama yazıyla anlatılıyor; ana agentin yeniden tasarımına bağlı. | [METİN] (yeniden tasarım) |
| 5 | 👀 İzle: İç içe döngü | 🔴 | İki sıra boncuk + Robo'yu aynı anda izlemek; hangi sıra neyi sayıyor? | [İPUCU] |
| 6 | Kaç kez ileri? (test) | 🔴 | `2(3(F)R)` gösterimini okumak; 3+2=5 ya da 3 gibi yanlış cevaplar; 2×3 çarpımını "iç içe"ye bağlamak. | [İSKELE] |
| 7 | Adım adım: İç içe döngü | 🔴 | 8 yönerge; boş döngü içine döngü; "döngü sonu ⤶". (Yanlış da olsa düz `3(FFR)` blok sınırını geçiyor.) | Yeniden tasarım (3 aşama) |
| 8 | Büyük kare | 🔴 | Yardımsız; kenar 4 + sağa dön + döngü sonrası `3(F)`; blok sınırı iç içeyi zorluyor. | [BONUS] |
| 9 | Yeni komut: Yıldızı al (anlatım) | 🟡 | Yeni komut ✋; "yıldızın üstünde olmalı" kuralı. Kısa. | [METİN] |
| 10 | Her iki adımda bir | 🟡 | Yıldızı al + tek desen; `3(FFP)F` düz döngü de olur. | [İPUCU] |
| 11 | Köşe yıldızları | 🟡/🔴 | 3 kenar, yıldız, dönüş, döngü sonrası F; 6. bölüm 12 ile aynı harita; `3(FFPR)F` yetiyor. | [İPUCU] |
| 12 | ⭐ Kenar ortaları | 🔴 | 9 blok, kenarda iki yarım; zaten bonus. | Bonus kalsın |

### Öneri ayrıntıları
**Hangi adımlar bonus olmalı?** Adım 8 (Büyük kare) ve 12 (Kenar ortaları). Adım 8 tek adım olarak iç içeyi *zorunlu kılan* en zor görev (3 kenar iç içe + 3 kare ek). İç içe döngünün "zorunlu çekirdeği" ana agentin üç aşamalı tasarımıyla (4–7) sınırlı kalmalı: **uzun yaz → tekrar eden parçayı döngüye al → içteki tekrarı da döngüye al**, hepsi tek bir görev (ör. göl kenarı) üzerinde. Adım 8 buna *uygulama* olduğundan bonus.

- **Adım 4 [METİN]:** (yeniden tasarım yine de) Yeni metin: “Bir döngünün içine başka bir döngü koyabilirsin. **Büyük döngü** turlar atar. Her turda **küçük döngü** baştan çalışır. Örnek: 3 kez [2 kez alkışla, zıpla] = 👏👏🦘 👏👏🦘 👏👏🦘.”
- **Adım 5 [İPUCU]:** “Üst sıra: büyük döngü. Alt sıra: küçük döngü. Büyük döngü her tur attığında alt sıra baştan başlar.”
- **Adım 6 [İSKELE] (6'dan önce küçük "Aç ve say" adımı):** Test. Soru: “`2(3(F)R)` uzun yazılsa böyle olur: FFF R FFF R. İleri git kaç tane?” Şıklar: 2 / 3 / ✔ 6. Açıklama: “3 İleri git, 2 kez = 6.” Sonra gerçek 6. adım aynı sorunun yeni bir sayısıyla (ör. `3(2(F)R)`) gelir. Amaç: önce uzun hali, sonra döngülüsü.
- **Adım 7 [yeniden tasarım]:** Ana agentin üç aşamalı tasarımı doğru yön. Ek öneriler aşağıda.
- **Adım 8 [BONUS]:** Hint'e "bunu da döngüyle yapmalısın" ekleme; çocuk için en zor kısım. Bonusta kalsın; ya da kolaylaştır: 4 kenar *tam kare* (`4(4(F)R)`... zaten döner, G'de değil). Basit yol: bonus yap ve olduğu gibi bırak.
- **Adım 9 [METİN]:** “Yıldızlar kendiliğinden toplanmaz. Yıldızın üstündeyken ✋ Yıldızı al'a bas. Yıldız yoksa el boş kalır.”
- **Adım 10 [İPUCU]:** “Her yıldızdan önce 2 kare var. Bir parça: İleri git, İleri git, ✋ Yıldızı al. Bunu 3 kez tekrarla. Sonra bir İleri git.” (İç içe `2(F)` yok; düz yazılabilir.)
- **Adım 11 [İPUCU]:** “Her kenar aynı: 2 kare ileri, ✋ al, sağa dön. Bunu 3 kez tekrarla. Sonra döngünün dışında bir İleri git.” (`3(FFPR)F`, 6 blok.)
- **Ek somut fikirler (iç içe döngü için):**
  1. **Satır-sütun benzetmesi.** 3. sınıf çarpmayı "3 sıra, her sırada 4 koltuk" ile biliyor. Dış döngü = sıra sayısı, iç döngü = sıradaki koltuk sayısı. `2(3(F)R)` = 2 sıra × 3 koltuk = 6. Okul takvimi de olur: "2 gün, her gün 3 ders".
  2. **Renk/çerçeve:** Dış döngü mavi çerçeve, iç döngü turuncu çerçeve, içte girinti. Büyük sayaç: “Dış tur 2/3 · İç tur 1/2”. Çalışırken iç sayaç her dış turda sıfırlanırken yanıp sönsün.
  3. **"Aç" düğmesi:** İç içe programın altında “Uzun göster” satırı: `FFRFFRFFR`. Çocuk döngülü ile uzunu karşılaştırır. Özellikle 6. adım (kaç kez) bununla kendi kendine çözülür.
  4. **Önce sayıları ver (iskele):** İlk iç içe görevde program iskeleti hazır olsun: `?(?(F)R)`; öğrenci yalnızca iki sayıyı doldursun (hangi sayı dış, hangisi iç). Sonra ikinci görevde iskele yok.
  5. **Bug avı bağı (haftanın teması):** Hazır hatalı program: `3(2(FR))` ("Robo olduğu yerde dönüyor!"). Çocuk R'yi iç döngüden dışarı alır → `3(2(F)R)`. "İçeride mi, dışarıda mı" kavramı tam burada oturur.
  6. **Sınıfta fiziksel önce:** Öğretmen notundaki ritim (alkış, alkış, masaya vur ×4) bilgisayardan önce 2–3 dakikada *herkesle birlikte*, iki sıra parmak (üst el dış tur, alt el iç tur) sayarak yapılmalı.
  7. **Benzetme adları:** “büyük döngü” = patron, “küçük döngü” = çırak. "Patron her tur attığında çırak baştan çalışır."
  8. **Optimizasyon olarak sun:** Çocuk önce *düz* `FFRFFRFFR` ya da tek döngü `3(FFR)` yazar (zaten geçer), sonra "daha kısa olur mu?" diye iç içe yapar. Böylece iç içe, başarısızlık değil ödül olur.
- **Önerilen yeni sıra:** 1, 2, 3, **9, 10, 11** (Yıldızı al, tek döngüyle), sonra **4, 5, 6, 7** (iç içe: ana agentin yeni tasarımı) · ⭐ 8, 12 (zorunlu: 10 adım — 3 anlatım, 2–3 test, 4–5 ızgara; bonus: 2). Gerekçe: Yıldızı al'ı önce tek döngüyle pekiştirmek öğrenciye başarı verir; iç içe kavramı sona, sınıf dikkatli ve 15 dk ayrılmış haliyle gelir. Bu sıra istenmezse 4–7 aynı kalır, sadece 8 bonusa taşınır.

---

## Bölüm 8 — 🏰 Labirent Görevi
Genel: Hiçbir adımda `tut` yok, iç içe döngü yok denecek kadar az (yalnızca spiral). Programlar uzun (10–20 blok) ve çocuk "plan yap" cümlesini somut yapamıyor. Eksik: **parça parça test etme** (ara hedef).

| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Seviye sonu! (anlatım) | 🟢 | Kısa, hatırlatma. | — |
| 2 | Isınma turu | 🟡 | Su kenarı, 8 blok; önceki bölümlerin bilgisi. İpucu yok. | [İPUCU] |
| 3 | Kale kapısı | 🔴 | 5×5 labirent, Geri git, anahtar+kapı, ~15 komut. | [İSKELE] [İPUCU] |
| 4 | Hangi program daha kısa? (test) | 🟢 | 6.10'un tekrarı; blok saymak. | — |
| 5 | Yıldız tarlası | 🔴 | 12 blok, U dönüşü (R F R), 4 yıldız, döngü içinde P. | [İSKELE] |
| 6 | Spiral | 🔴 | İç içe zorunlu; kenarlar 4,4,4,2,2 farklı. | [BONUS] |
| 7 | Çifte kapı | 🔴 | İki kapı, tek anahtar, geri-ileri sıralaması, yıldız. | [BONUS] |
| 8 | ⭐ Usta işi | 🔴 | 20+ blok; zaten bonus. | Bonus kalsın |

### Öneri ayrıntıları
- **Adım 2 [İPUCU]:** Yeni ipucu: “Önce ileri, aşağı in, suyu geç, yukarı çık. Sonra 3 kare düz. Takılırsan ▶ bas ve nerede yanlış yaptığını bul!” (Bug avı bağı.)
- **Adım 3 [İSKELE] (3'ün önüne kısa görev):** Tek anahtar, tek kapı, ileri-geri yok: `S.k.D.G` gibi düz koridor; program `FF` ... anahtarı al, kapıdan geç. Sonra 3'e geçmeden önce ara hedefli tarif.
- **Adım 3 [İPUCU]:** Yeni ipucu: “Üç parça: 1) Anahtara git. 2) 2 kare geri gel. 3) Kapıdan geç, pile git. Her parçadan sonra ▶ bas, Robo nereye geldi bak.” Mümkünse ara hedef işareti (anahtar alınınca onay).
- **Adım 5 [İSKELE] (önüne kısa görev):** Tek sıra yıldız: `S*.*.G` düz, `3(FP)` türü; sadece tek döngü içinde P. Sonra iki sıra (5). İpucuna U dönüşü açıkça: “Sağa dön, İleri, Sağa dön: Robo aşağıya inip geri bakar.”
- **Adım 6 [BONUS]:** İç içe zorunlu, kenarlar farklı. 7. bölümdeki iç içe de zaten zor; burası bonus.
- **Adım 7 [BONUS]:** Bu yaşta fazla.
- **Zorunlu sayı:** Düzenlemeden sonra zorunlu: 1, 2, 3 (+ iskele), 4, 5 (+ iskele) = en az 6–7 adım. Böylece kavram ("hepsini birleştir") kapsanır.
- **Önerilen yeni sıra:** 1, 2, **[yeni iskele: kısa anahtar-kapı]**, 3, 4, **[yeni iskele: tek sıra yıldız]**, 5 · ⭐ 6, 7, 8 (zorunlu: 7 adım — 1 anlatım, 1 test, 5 ızgara; bonus: 3)

---

## Öncelikli değişiklikler
1. **7. bölüm: iç içe döngüyü 3 aşamalı, iskeleli yeniden kur** (uzun yaz → tek döngü → iç içe), iskelet `?(?(F)R)` ile sadece sayıları doldurtan ilk görev, "Uzun göster" düğmesi, renkli çerçeve ve büyük dış/iç sayaç, satır-sütun (çarpma) benzetmesi. Adım 8 (Büyük kare) ve 12'yi bonusa al.
2. **6. bölüme "içinde/dışında" iskelesi ekle:** adım 7'den sonra `2(FLFR)` ile çok bloklu 👀 İzle, adım 8'den önce "R kaç kez çalışır? (dışarıda / içeride)" testi; adım 8'in tut metinlerini kısalt ("S'yi sayma" dahil). Adım 12'yi bonusa al.
3. **5. bölümde adım 9'u bonusa taşı** ve 4, 6, 7 ipuçlarını sağ/sol ve "kaç kare" sayımına göre yaz (hazır metinler yukarıda).
4. **8. bölümde adım 6 ve 7'yi bonusa taşı;** adım 3 ve 5'in önüne kısa iskele görevleri (düz anahtar-kapı, tek sıra yıldız) ve "üç parça" ipucu ekle. Böylece zorunlu yol 5–6 yönlendirilebilir adım olur.
5. **6. bölüm adım 6 metnindeki "kare" belirsizliğini düzelt** ("küçük kutu ⬜"), ve 7. bölüm adım 10–11 ipuçlarını düz döngüyle (`3(FFP)F`, `3(FFPR)F`) yaz; iç içe öğrenmeyen çocuk da yıldız adımlarını geçsin. Süre baskısı için 6. bölümü 11–13 adımda tut.
