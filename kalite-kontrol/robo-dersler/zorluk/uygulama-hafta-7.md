# Hafta 7 — zorluk önerileri uygulaması (src/robot/lessons/h7.js)

## Bölüm 25 (Labirent)
- Yeni kolay adım: "1. adım: Fareyi sağa yürüt" (sadece sağ ok). Eski hareket adımı "2. adım: Diğer üç yönü ekle" oldu (keep: true), metni ve eksi sayı ipucu yenilendi.
- Duvarlar (3.) yeni metin + ipucu; Peynir (4.) ipucu eklendi.
- Süre ve Hayalet adımları "⭐ Bonus" oldu, bölüm sonuna taşındı. Hayalet süzülmesi 1.5 sn yerine 1 sn (sol, metin tutarlı).
- Son hikâye adımında bonusa yönlendiren küçük metin düzeltmesi. Zorunlu: 6 adım, bonus: 2.

## Bölüm 26 (Elma Yakala)
- Sepet adımına yeni metin + ipucu.
- Eski "Düşen elma" ikiye bölündü: "2. adım: Elma düşsün" (yeni, rastgelesiz, x:0 y:170 ve y<-170 ile tepeye dönme) + "3. adım: Rastgele yerden ve skor" (ipuçlu). Rastgele aralık -200..200 yerine -150..150 (tüm sol/başlangıç tutarlı).
- Üç can: yeni metin + ipucu.
- Hızlanan elmalar ve Kazanma ekranı "⭐ Bonus", sona taşındı. Giriş hikâyesinde hız maddesi "⭐ Bonus" olarak işaretlendi. Zorunlu: 6, bonus: 2.

## Bölüm 27 (Uzay Kaçışı)
- Roket: yeni metin + ipucu. Çarpışma ve Puan adımlarına ipucu.
- Göktaşı ikiye bölüldü: "2. adım: Göktaşı gelsin" (sabit y:0) + "3. adım: Rastgele yükseklik". "5 derece dön" bloğu kaldırıldı (turnR paletten de çıktı), koşul x < -200, rastgele aralığı -100..100.
- `wraps` ölçütü yeni eşiklere uydu (x < -150 görüp sonra x > 200).
- İkinci göktaşı "⭐ Bonus", sona taşındı; teacher notu güncellendi. Zorunlu: 7, bonus: 1.

## Bölüm 28 (Kendi Projen)
- Adım 1 metni sadeleşti. Yeni adım "Hazır başlangıç: Kedi fareyi takip etsin" (setup: Kedi + Elma, cayir; Kedi'ye 🏁 → sürekli [fare imlecine git]).
- Bitirme projesi: yeni metin (hazır başlangıç ve ⭐ can bonusu), ipucu. Adım 6'dan "hesap açmadan da deneyebilirsin" çıkarıldı (kısaltma). Zorunlu: 8.

## Uygulanamayanlar
- "Rastgele/eksi sayı blokları hazır verilsin" önerisi: motor/ön yerleştirme gerektirir, yalnızca metin ve ipucu ile yönlendirildi.
- Bölüm 28'de Bitirme projesi setup'ına Elma konmadı (boş sayfa serbestliği korunsun diye); hazır Kedi+Elma ayrı ara adımda verildi, ipucu ➕ ile Elma eklemeyi söylüyor.
- Bölüm 28 hedef listesindeki "ya da" ifadesi (ses ya da değişken) ve ⭐ "can ekle" bonusu ayrı adım olmadı, yalnızca metinde geçiyor.
- Bölüm 28 Adım 6 [METİN] tam yeniden yazılmadı (yalnızca kısaltma).
- Adım sayısı değiştiği için 25–28. bölümlerde daha önce kaydedilen adım ilerlemesi/taslak indeksleri kayabilir.

## Test
`node tools/robo-test.mjs h7` → Izgara: 0/0, Sahne: 20/20, Palet uyarısı: 0, Başarısız: 0
`robo-tara --only=25/26/27/28` → yatay taşma/boş sayfa: 0, konsol/sayfa hatası: 0
