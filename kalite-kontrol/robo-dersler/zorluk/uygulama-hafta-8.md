# Hafta 8 — zorluk önerileri uygulandı (src/robot/lessons/h8.js)

## 29. Sor ve Cevapla
- Sıra: 1–5 zorunlu; ⭐ Bonus: Şifreli kapı (sona taşındı); ⭐ Kendi yarışman.
- Tanışalım ve Bilgi yarışması metinleri sadeleştirildi (büyük-küçük harf notu kaldırıldı); Tanışalım, Bilgi yarışması, Üç soruluk yarışma, Şifreli kapı için ipuçları eklendi.

## 30. Matematik İşlemleri
- Yeni adımlar: "Sayıları söyle" (3 + 4) ve "Tek soru 🎲" (rastgele a, b; a ve b sahnede görünür).
- Sıra: 1, Sayıları söyle, Toplama makinesi, Hesapla, Tek soru, 7'ler tablosu · ⭐ Bonus: Matematik oyunu (3 tur; showVars a/b/skor eklendi), ⭐ Bonus: Büyüyen spiral, ⭐ Sihirli çokgen.
- 7'ler tablosu: metin 0.5 sn -> 0.4 sn (örnek çözümle aynı), ipucu eklendi.
- Hesapla sorusuna "önce çarp, sonra çıkar" eklendi. Toplama makinesi, spiral, çokgen için ipucu.
- Sihirli çokgen: metne "3, 4 ya da 6 yaz" eklendi (hedef 6, çözüm aynı).
- teacher notuna bonus adımların isteğe bağlı olduğu eklendi.

## 31. Klonlar
- Sıra: Kuklanın fotokopisi, Tıkla çoğalsın, Klon nedir?, Balık sürüsü, Kar yağışı · ⭐ Havai fişek.
- Giriş metni raporun yeni metnine çevrildi.
- Kar yağışı: negatifsiz — rastgele konuma git, 180 yönüne dön, kenara dokunana kadar 3 adım git, sil (sol/hedefler güncellendi).
- Balık sürüsü: yön rastgele 1–360.
- İpuçları: Tıkla çoğalsın, Kar yağışı, Balık sürüsü.

## 32. Uzay Savaşçısı
- Sıra: 1–4, sertifika (Bir atari oyunu yaptın!), ⭐ Bonus: Dikkat, çarpışma! (sona taşındı). Sertifika bölümü zorunlu ve bonustan önce; bölüm sonundaki sertifika kutusu aynen duruyor.
- Roket metni ("Eksi sola gitmek demek") ve ipucu; Lazer, Göktaşı, Vur, Çarpışma için ipuçları.
- Göktaşı: negatifsiz — rastgele konuma git, 180 yönüne dön, kenara dokunana kadar 3 adım git; ↻ 3 derece dönme kaldırıldı. WAR_BLOCKS'a gotoRand ve move eklendi. Ortak rockClone tüm adımlar için güncellendi.
- teacher notuna sertifikanın bonus yapılmadan alınabileceği eklendi.

## Uygulanmayanlar
- 32/3 "yön 0, 12 adım git" alternatifi: rapor "mevcut hâli bırak" da diyor; y'yi 12 değiştir (pozitif) bırakıldı.
- Not: göktaşı artık rastgele konumda doğuyor (yukarıdan düşmüyor); rokete yakın doğarsa çarpışma erken olabilir. Raporun önerisi uygulandı, öğretmen oynayıp bakabilir.
- 31/6 Havai fişek ve 32 bonus adımlarında rastgele -180..180 kaldı (bonus).

## Test
h8: Izgara: 0/0, Sahne: 21/21, Palet uyarısı: 0, Başarısız: 0. robo-tara --only=29,30,31,32: sorun 0.
