# Hafta 4 — zorluk önerileri uygulama (src/robot/lessons/h4.js)

## B13 (zorunlu 8, bonus 2)
- Adım 2 metni kısaltıldı (mavi/mor örnek, 3 cümle). Adım 5 ipucu yeni metinle.
- Dans eden kedi: metne 90 (dik açı) / 45 notu; örnek çözüm 45/90 ile (hedefler aynı).
- YENİ "Dik açı turu" (4 x 90 = 360, zorunlu). 10 x 36 turu "⭐ Bonus: Daha ince tur" oldu; tam-tur denetimi ortak `fullTurn` işlevine alındı.
- "⭐ Kendi gösterini yap" zaten sonda. teacher'a bonus notu.

## B14 (zorunlu 8, bonus 4)
- Adım 1: yeni kısa metin, 240/180 sınırları çıkarıldı, eksi kuralı ("ters yöne: x'te sola, y'de aşağı") + asansör benzetmesi.
- Adım 3 şıkları oklu ve sözlü; sorunun içine "sağ = x artı, yukarı = y artı" ipucu. Adım 4 ipucu yeni metin. Adım 6 (x değişirse) metni: "-10 = sola".
- YENİ 5a "Arı iki çiçeğe uğrasın" (±100, 100; sadece x işaret değiştirir).
- YENİ 8a "Roket sağa uçsun" (sadece 90). Roketin yönü: yıldız (100,100), yukarı + sağ; blok paletinden turnR/turnL/glide çıkarıldı.
- Sona taşınan bonuslar: ⭐ Dört köşedeki çiçekler (koordinatlar ±100,±100'e çekildi), ⭐ Bayrağa tırman, ⭐ Bal toplayan arı (çiçek 0,-50; arı -200,150).

## B15 (zorunlu 9, bonus 1)
- Adım 2 ipucu (sağ/sol, -10 = sola). YENİ "Peynire doğru" (sağ + yukarı, 2 betik); Peynir avı (4 tuş) metnine x/y ve −10 açıklaması.
- Orkestra ve Zıplayan Robo'ya `hint` eklendi.

## B16 (zorunlu 7 + bonus 2)
- Yürüyen kedi ipucu eklendi. Büyü-küçül: yeni metin, "yüzde" yok, eşik %180 → %150. Hayalet ipucu.
- Sohbet "⭐ Bonus: Sohbet" olarak sona taşındı, metni yeni biçimde.

## Uygulanamayanlar (motor/karar)
- Sahne arka planına 50'lik ızgara, sayı etiketleri, x/y eksen renkleri, negatif yarıya gri/turuncu zemin (B14 A).
- Canlı büyük/renkli "x: y:" göstergesi, eksi için kırmızı (B14 C).
- Yakınlık toleransı (B14 B): hedefler zaten "dokundu" denetimli, değişiklik gerekmedi.
- Yön için pusula görseli ve bloktaki açılır liste (0/90/180/-90) (B14 F, K).
- B15 orkestrada üçüncü kuklayı bonus yapmak (adım içi ayrım motor işi); B15 dört-tuşlu Peynir avı zorunlu kaldı.
- B16 5a (Kedi/Köpek ayrı ön adım) eklenmedi; Sohbet bonusa alındığı için gerekmedi.
- B14 bayrağa tırman 300/200 hesabı değiştirilmedi (bonus oldu). B13 adım 7'de "↻ 15" blok varsayılanı motorda.
- ÇIKAR önerisi yoktu.

## Test
`node tools/robo-test.mjs h4` → Izgara: 0/0, Sahne: 27/27, Palet uyarısı: 0, Başarısız: 0
`robo-tara --only=13..16` → her biri yatay taşma/boş sayfa 0, konsol hatası 0
