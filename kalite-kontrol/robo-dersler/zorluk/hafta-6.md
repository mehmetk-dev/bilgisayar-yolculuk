# Hafta 6 — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: **Yüksek.** Dört kavramın üçü (değişken, haber salma, proje planı) 3–4. sınıf için soyut. Hafta boyunca **negatif sayı** (`-1 değiştir`, `-200 ile 200`, `y < -160`) ve **koordinat** (x: y:) görülüyor; ikisi de bu yaşta bilinmiyor.
- En çok takılınacak yerler:
  1. Bölüm 21 adım 3, 5, 6, 7: döngü + eğer + değişken aynı anda; `-1 değiştir` ve `olana kadar bekle (skor = 5)`.
  2. Bölüm 22 adım 3 ve 5: `rastgele -200 ile 200`, `y < -160` (negatif sayılar).
  3. Bölüm 23 adım 3 ve 5: 2–3 kukla, 3–4 ayrı betik, 4–5 hedef; haber sal/al ilişkisini kurmak.
  4. Bölüm 24 adım 3–6: boş sayfa (30 blok, serbest mod); 40 dakikada 4 kodlama adımı + sıralama + sunum sığmaz.
  5. Hiçbir adımda ipucu yok; takılan öğrenciye yardım yalnızca öğretmenden geliyor.

## Bölüm 21 — 🗃️ Değişkenler: Skor Tutma
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Akılda tutan kutu (anlatım) | 🟡 | "Değişken" soyut; metin kısa ama kutu benzetmesi yeterince somut değil. | [METİN] |
| 2 | Tıklama sayacı | 🟢 | Tek blok: tıklayınca değiştir. Hedef net. | [İPUCU] |
| 3 | Elma topla | 🔴 | 🏁 + sürekli tekrarla + eğer + dokunuyor mu + 3 blok; değişken ilk kez döngüde. | [İSKELE] [İPUCU] |
| 4 | Test: Değişken nedir? | 🟢 | Tanım bire bir anlatımda var. | — |
| 5 | Kazandım! | 🔴 | `olana kadar bekle`, karşılaştırma bloğu (`=`), ikinci betik. | [BONUS] |
| 6 | Geri sayım | 🔴 | Değişken değer bloğunu ▾ ile seçmek, `n kez tekrarla`, `-1 değiştir` (negatif sayı), 5 blok. | [BONUS] |
| 7 | Üç can | 🔴 | Ok tuşları, iki ayrı `eğer`, `-1`, 4 hedef/çok blok. | [BONUS] |
| 8 | ⭐ Kendi puan oyunun | 🟡 | Serbest, ama boş sayfa; zaten bonus. | — |

### Öneri ayrıntıları
- **Adım 1 [METİN]:** Yeni metin: “**Değişken** üstünde adı yazan bir **kutudur**. Kutunun içinde bir sayı durur. **0 yap** kutuyu boşaltır, **1 değiştir** içine 1 tane daha atar.”
- **Adım 2 [İPUCU]:** “Kediye tıklanınca **sayaç değişkenini 1 değiştir** bloğunu koy. Sahnenin sol üstüne bak: sayı büyüyor mu?”
- **Yeni adım (adım 2'den sonra) [İSKELE] "Balon patlat":** Scratch. Sahnede 1 Balon kuklası (ör. Robo ya da Yıldız yerine balon varsa o). Hazır olarak 🏁 → `skor 0 yap` verilsin. Öğrenci yalnızca **bu kukla tıklanınca → skor 1 değiştir → pop sesi → rastgele konuma git** yazsın. Hedef: 5 kez patlat, skor 5 olsun. (Elma'nın "dokunuyor mu + döngü" kısmını çıkarıp değişkeni tek başına çalıştırır.)
- **Adım 3 [İPUCU]:** “Önce **skoru 0 yap**. Sonra **sürekli tekrarla** koy; içine **eğer Kedi dokunuyorsa** ekle. Eğer'in içine **skoru 1 değiştir** koy.” Ayrıca [İSKELE]: Elma'nın 🏁 + `skoru 0 yap` + `sürekli tekrarla` kısmı hazır gelsin; öğrenci yalnızca `eğer … ise [skor 1 değiştir, pop, rastgele konuma git]` kısmını yazsın.
- **Adım 5 [BONUS]:** `olana kadar bekle (skor = 5)` kodlama için ağır. Bonus olursa ek olarak [METİN]: “Kediye yeni bir betik ekle: **skor = 5 olana kadar bekle**, sonra **Kazandım! de**.”
- **Adım 6 [BONUS]:** `-1 değiştir` negatif sayıdır. Bonus yapılmazsa [SAYI]/[METİN] gerekir: “**-1 değiştir** demek kutudan **1 tane almak** demektir.” Bonus tarafında bu cümle adımın başına yazılmalı.
- **Adım 7 [BONUS]:** Yalnızca `can -1` ve iki `eğer` var; ok tuşu kodu hazır, ama yine zor. Bonus olarak kalsın. Metni kısalt: “Hayalete dokununca **canı -1 değiştir** ve başa dön. **Can 0** olunca **Oyun bitti!** de.”
- **Önerilen yeni sıra:** 1, 2, (yeni) Balon patlat, 4, 3, ⭐ 5, 6, 7, 8 (zorunlu: 5 adım + 1 yeni = 5 kodlama/anlatım/test adımı: 1, 2, Balon patlat, 3, 4; bonus: 4 adım). Not: zorunlu sayısı 5; en az 6 olması için Kazandım! (5) sadeleştirilmiş hâliyle (öğrencide yalnızca `eğer skor = 5 → Kazandım! de`, `olana kadar bekle` hazır) zorunlu kalabilir: **1, 2, Balon patlat, 3, 4, 5(sadeleşmiş) · ⭐ 6, 7, 8** (zorunlu: 6, bonus: 3).

## Bölüm 22 — 🎲 Rastgele Sayılar
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Şans oyunu (anlatım) | 🟡 | Uzun, ▾ ile "rastgele" seçme tarifi karışık. | [METİN] |
| 2 | Zar at | 🟡 | `8 kez tekrarla` içinde `rastgele 1–6` kostüm numarası; iç içe blok. | [İPUCU] |
| 3 | Çılgın uğur böceği | 🔴 | `rastgele -200 ile 200` negatif sayı; iki rastgele bloğu `süzül` içinde. Metin 1 sn, çözüm 0.7 sn. | [SAYI] |
| 4 | Test: Hep aynı mı? | 🟢 | Sezgisel; zar benzetmesi var. | — |
| 5 | Yıldız yağmuru | 🔴 | `olana kadar tekrarla`, `y < -160` (negatif, koşul), iç içe iki döngü. | [BONUS] |
| 6 | Rastgele sanat | 🟡 | Blok sayısı fazla; metin 30 kez, çözüm 15 kez. | [METİN] |
| 7 | Böcek avı | 🟡 | Skor + tıklama + sürekli tekrarla; Bölüm 21'in tekrarı olduğu için tanıdık. Çözümde `rastgele 0.5–1.5` ondalık. | [SAYI] |
| 8 | ⭐ Şans makinesi | 🟡 | Serbest, zaten bonus. | — |

### Öneri ayrıntıları
- **Adım 1 [METİN]:** Yeni metin: “Zar atınca ne çıkacağını bilmezsin. Buna **rastgele** denir. **rastgele 1 ile 6 arası** bloğu her seferinde 1–6 arasından bir sayı seçer.”
- **Adım 2 [İPUCU]:** “**Bu kukla tıklanınca** koy. İçine **8 kez tekrarla** ekle. İçine **… kostümüne geç** koy ve numara yerine **rastgele 1 ile 6** bloğunu sürükle.”
- **Adım 3 [SAYI]:** Negatif sayıları kaldır. `x: rastgele … y: rastgele …` yerine tek blok: **“rastgele konuma git”** (adım 6'da zaten var) ya da **“1 saniyede rastgele konuma süzül”**. Yeni görev metni [METİN]: “Uğur böceği sürekli tekrarlasın: **rastgele konuma git**, sonra **1 saniye bekle**. Sahnenin en az 3 yerine uçsun.” Rastgele sayı bloğu zar adımında (2) zaten öğreniliyor. Eğer iki rastgele sayıyı göstermek isteniyorsa pozitif aralık kullan: x: rastgele 0 ile 200.
- **Adım 5 [BONUS]:** Negatif koşul ve döngü içinde döngü. Bonus olarak kalsın; yine de [SAYI]: `y < -160` yerine "yere değene kadar" gibi çocuk dilinde ya da `y < 0` değil; öğretmen "ekranın altına kadar" desin.
- **Adım 6 [METİN]:** Yeni metin: “Kalemi **bastır**. **15 kez tekrarla**: **rastgele konuma git**. Her 🏁'de farklı bir resim çıkar.” (Metin ve çözümdeki sayı 15 olsun; renk değiştirme isteğe bağlı.)
- **Adım 7 [SAYI]:** Metin "her saniye" diyor, çözüm 0.5–1.5; metni çözümle uyumlu hale getir: “Böcek **rastgele konuma git** ve **1 saniye bekle**”; ondalık gerektirmesin.
- **Önerilen yeni sıra:** 1, 2, 3 (sadeleşmiş), 4, 6, 7 · ⭐ 5, 8 (zorunlu: 6 adım, bonus: 2)

## Bölüm 23 — 📣 Haber Salma
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Kuklalar arası mesaj (anlatım) | 🟡 | "Haber sal" soyut; "bekle ile süre hesaplamadan" cümlesi karışık. | [METİN] |
| 2 | Sıra sende | 🟡 | İki kukla, iki betik; hangi kuklaya hangi blok? Köpek betiği başka kuklada. | [İPUCU] |
| 3 | Uzaya yolculuk | 🔴 | 5 hedef, 4 betik, 2 kukla, dekor değiştirme, gizle/göster, 30 kez tekrarla. | [İSKELE] |
| 4 | Test: Sal ve bekle | 🔴 | "Alanların işi bitene kadar" ince bir fark; soyut. | [METİN] |
| 5 | Büyük yarış | 🔴 | 3 kukla, 5 betik, koordinatlar (x: 180), `süzül`; sayılar fazla. | [İSKELE] |
| 6 | Orkestra şefi | 🟢 | Üç kısa betik, ses çalma; sonuç duyulmasa da görülebilir mi? | [İPUCU] |
| 7 | ⭐ Üç perdelik sohbet | 🟡 | Üç kukla zinciri; serbest ama yönerge net. | — |

### Öneri ayrıntıları
- **Adım 1 [METİN]:** Yeni metin: “Zil çalınca herkes ne yapacağını bilir. **haber sal** bloğu da kuklalara zil çalar. **haberini aldığımda** bloğu, zil çalınca çalışır.”
- **Adım 2 [İPUCU]:** “Kedi'ye: konuşmadan sonra **“sıra sende” haberini sal** ekle. Köpek'e: **“sıra sende” haberini aldığımda** koy, altına **de** bloğu ekle.”
- **Adım 3 [İSKELE]:** Betiklerin yarısı hazır gelsin: Kedi'nin tüm kodu ve Roket'in 🏁 betiği hazır; öğrenci yalnızca **Roket → “uzay” haberini aldığımda → göster → 30 kez tekrarla [y'yi 8 değiştir]** yazsın. Hedefler 5'ten 2'ye insin: Roket haberi alsın, Roket uçsun. (Dekor değişimi ve kedi gizleme hazır ya da bonus.)
- **Adım 4 [METİN]:** Soru: “**haber sal ve bekle** ne yapar?” Şıklar: (1) “Haberi gönderir, sonra hemen devam eder” (2) “Haberi gönderir, **herkes bitirene kadar bekler**, sonra devam eder” (3) “Haberi göndermez”. Açıklama: “Arkadaşının sözünü bitirmesini beklemek gibi.” (Test, adım 5'ten sonra değil, **6'dan sonra** gelsin; haber sal'ı pratikte görmeden zor.)
- **Adım 5 [İSKELE]:** Robo'nun 3-2-1-Başla betiği ve Kedi'nin 🏁 konum betiği hazır olsun. Öğrenci yalnızca Kedi ve Köpek için **“başla” haberini aldığımda → süzül** yazsın (2 betik). Bayrağın x konumunu görsel olarak bayrağa sürükleyerek bulma imkânı yoksa sayı bloğuna **180** hazır yazılı gelsin. Hedefler 4'ten 2'ye.
- **Önerilen yeni sıra:** 1, 2, 6, 4, 3 (sadeleşmiş), 5 (sadeleşmiş) · ⭐ 7 (zorunlu: 6 adım, bonus: 1)

## Bölüm 24 — 📖 Proje: Animasyonlu Hikâye
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | Bir hikâyenin üç parçası (anlatım) | 🟢 | Hikâye bilgisi okuldan tanıdık. | — |
| 2 | Proje adımları (sıralama) | 🟡 | 6 kart, uzun cümleler; okuma hızı farkı. | [METİN] |
| 3 | 1. adım: Sahneyi kur | 🔴 | Boş sayfa, 30 blok, serbest mod, "x: y: konumuna git" için koordinat. İpucu yok. | [İSKELE] [İPUCU] |
| 4 | 2. adım: Konuşmalar | 🔴 | Haber sal + haberini aldığımda yeni öğrenildi; hikâyeye uygulamak zor. | [İSKELE] |
| 5 | 3. adım: Hareket ve dekor | 🟡 | Tanıdık bloklar (süzül, dekoru yap); ama ek iş. | [BONUS] |
| 6 | 4. adım: Müzik ve son | 🟡 | Ses bloğu kolay; ama "baştan sona çalışsın" hedefi (3 konuşma, 2 kukla) çok. | [METİN] |
| 7 | Sunum zamanı | 🟡 | 3 soru + yorum/öneri; kısa sürede sınıf sunumu sığmaz, utangaç çocuklar. | [METİN] |

### Öneri ayrıntıları
- **Adım 2 [METİN]:** Kartlar kısalsın: “💡 Fikir bul”, “✏️ Plan çiz”, “🎭 Kukla seç”, “🧩 Kod yaz”, “🐞 Dene”, “🎤 Göster”.
- **Adım 3 [İSKELE]:** Öğrenciye **hazır bir hikâye iskeleti** ver (Kedi ve Robo, `orman` dekoru, konumları hazır); öğrenci yalnızca kendi dekorunu seçip karakterlerine isim/kostüm değiştirsin. Hedef: "en az iki kukla" kalsın. [İPUCU]: “Kuklayı sahnede istediğin yere sürükle. 🏁'e basınca oraya gelsin.”
- **Adım 4 [İSKELE]:** İlk konuşma çifti hazır: Kedi “Merhaba!” de → “sahne1” haberini sal; Robo “sahne1” haberini aldığımda → boş de bloğu. Öğrenci kendi cümlesini yazsın. Hedef: **bir** haber, **iki** konuşma.
- **Adım 5 [BONUS]:** Hareket ve dekor değişimi ana kavram değil (Bölüm 23'te vardı). Bonus olsun; öğretmen "hızlı bitirenler için" desin.
- **Adım 6 [METİN]:** Yeni metin: “Hikâyenin sonuna bir **ses** ekle. 🏁'e basıp hikâyeni baştan sona izle.” Hedefler: ses kullan; en az **2 konuşma** (3 değil).
- **Adım 7 [METİN]:** Yeni metin: “Hikâyeni arkadaşına göster. Üç şey söyle: **Hikâyem ne anlatıyor? En çok neyle uğraştım? Hangi hatayı düzelttim?**” (Yorum/öneri çiftler hâlinde yapılsın, sınıf önünde sunum yalnızca gönüllülerle.)
- **Önerilen yeni sıra:** 1, 2, 3 (iskeleli), 4 (iskeleli), 6 (sadeleşmiş), 7 · ⭐ 5 (zorunlu: 6 adım, bonus: 1)

## Öncelikli değişiklikler
1. **Negatif sayıları kaldır:** `-1 değiştir` (Bölüm 21, adım 6, 7), `rastgele -200 ile 200` (Bölüm 22, adım 3, 5). "Rastgele konuma git" ve "-1 = 1 tane al" açıklamasıyla çöz.
2. **Bölüm 21:** zorunlu zinciri sadeleştir. "Balon patlat" iskele adımı ekle; Elma'yı kısmen hazır ver; geri sayım (6) ve üç can (7) ⭐ bonus yap.
3. **Bölüm 23 adım 3 ve 5:** Hazır betikli iskele (öğrenci yalnızca "haberini aldığımda" betiğini yazar); hedef sayısını 5/4'ten 2'ye indir. Test (4) uygulamadan sonra gelsin, metni yeniden yaz.
4. **Bölüm 24:** Proje boş sayfa olmasın. Adım 3 ve 4'e hazır hikâye iskeleti ver, adım 5 bonus olsun; sunum 3 soruya indir.
5. **İpuçlarını yaz:** Tüm Scratch adımlarında kaynakta ipucu yok. En azından Bölüm 21 adım 2–3, Bölüm 22 adım 2, Bölüm 23 adım 2'ye yukarıdaki ipucu metinlerini ekle; ayrıca metin–çözüm tutarsızlıklarını (22/3 "1 sn"/0.7, 22/6 "30"/15, 22/7 "her saniye"/0.5–1.5) düzelt.
