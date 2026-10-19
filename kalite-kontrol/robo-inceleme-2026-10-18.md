# Robo ile Kodlama: inceleme ve yeni bölümler (18–19 Ekim 2026)

## Özet
- 38 bölüm baştan sona incelendi: 77 ızgara görevi, 117 sahne görevi, tüm quizler ve metinler.
- Çözülemeyen görev çıkmadı. Ama 1 kritik, ~20 orta ve ~40 küçük sorun bulundu; hepsi düzeltildi.
- 6 yeni ek bölüm eklendi (39–44). Toplam 44 bölüm.
- Kalıcı test araçları eklendi: `tools/robo-test.mjs`, `tools/robo-tara.mjs`.
- Son durum: Izgara 83/83, Sahne 161/161, palet uyarısı 0. Tarayıcıda 44 bölüm, 433 sayfa: konsol hatası 0, taşma 0.

## Bulunan ve düzeltilen önemli sorunlar

### Kritik
- **30. bölüm "Toplama makinesi":** Metin "(birleştir “Toplam: ” (a + b)) de" diyordu ama editör en çok 2 düzey iç içe değere izin veriyordu. Çocuk yönergeyi izleyince tıkanıyordu. Sınır 3'e çıktı (en içte yalnızca değişken/cevap gibi değerler).

### Oynanamayan oyunlar
- **21. bölüm "Üç can":** Hayalet kediyle aynı satırdaydı, kedi yalnızca sağa sola gidebiliyordu; ne yapılırsa yapılsın 2 sn'de can bitiyordu. Kediye yukarı/aşağı ok eklendi.
- **25. bölüm Hayalet labirenti:** Hayalet koridorun tamamını süpürüyordu, kusursuz oyuncu bile geçemiyordu. Hayalet artık koridorun bir bölümünde yukarı aşağı gidiyor.

### Yanlış ya da gevşek denetimler
- 16. bölüm "Sohbet": doğru çözüm geçmiyor, sözü kesen çözüm geçiyordu. Düzeltildi.
- 23. bölüm "Uzaya yolculuk", "Büyük yarış": haber salma dersi olduğu halde haber kullanmadan geçilebiliyordu.
- 24. bölüm dekor ve hikâye hedefleri, 13. bölüm "Tam bir tur", tuş görevleri (aynı tuşa 4 betik yazmak da geçiyordu).
- 36–38. bölüm serbest görevler: önceki adımın kodu devralındığı için hiçbir şey yapmadan geçiliyordu. Artık bir değişiklik gerekiyor.
- 35. bölüm müzik görevleri: tuş-nota eşleşmesi ve son nota denetleniyor.

### Arayüz
- **Küçük ekranlar:** 1024x768'de kod alanı ekranın altında kalıyordu, 1280x720'de yarısı görünmüyordu. Artık sahne, bloklar, kod alanı ve 🏁 aynı ekranda.
- **Sonsuz döngü:** Robo hata mesajından önce 1–3 dakika dönüyordu. Artık ~8 sn.
- **"İlerlemeyi sıfırla":** Öğrencinin kodlarını silmiyordu (ortak bilgisayarda yeni sınıf eski kodları görüyordu). Artık siliyor.
- **Profil silme:** "Ali" silinince "Ali:Veli" kayıtları da gidebiliyordu. Düzeltildi.
- **Enter tuşu:** 🏁'e tıkladıktan sonra Enter oyunu baştan başlatıyordu. Düzeltildi.
- **Sertifika:** hiç bölüm bitmeden açılınca "0/32 tamamladı" yazıyordu. Artık "önce bölümleri bitir" diyor. Öğrenilenlere klon, haber salma, soru-cevap eklendi.
- **Koşul etiketi ekleri:** "Kedi ’a", "Raket ’a" yerine "Kedi’ye", "Raket’e", "Kalp’e".

### İçerik ve dil
- Yanlış sayılar ve ipuçları: 8. bölüm "6 blok" (doğrusu 5), 10. bölüm kapı, 33. bölüm yol tarifleri, 7. bölüm döngü zorunluluğu, spiral sınırı.
- 20. bölüm: "kapalı şekil 360° döner" yıldızla çelişiyordu; 144°'nin nedeni (iki tur = 720°) eklendi.
- Hoparlörsüz sınıf: seslerin sahnede 🔊 yazısıyla göründüğü ilk sesli görevde söyleniyor.
- Yazım: "Köpeke" → "Köpeğe"; editörde olmayan "seç" kelimesi; "Robo" yerine doğru kukla adı vb.
- **Quizler:** 30 sorunun 23'ünde doğru cevap ortadaki şıktı. Tüm dosyalarda dengelendi.
- Öğretmen notları:
  - 1–12. bölümlere "sürücü / yol gösterici, her görevde yer değiştirin" eklendi.
  - Kâğıt harita etkinliği ve bonus görevlerin isteğe bağlı olduğu yazıldı.
  - Ana öğretmen notu artık Scratch ve ek bölümleri de anlatıyor.

## Yeni bölümler (ek bölümler, programın dışında)
| No | Bölüm | İçerik |
|---|---|---|
| 39 | 🎓 Usta Robo | Izgara: döngü + fonksiyon + koşul; "çalıştırmadan önce tahmin et" soruları, hata ayıklama, 3 haritada aynı program |
| 40 | 🎨 Dijital Sanat | Altıgen, köşe değişkeniyle çokgen makinesi (360 ÷ köşe), rozet, büyüyen sarmal, iki renkli çiçek, damga |
| 41 | 🐝 Oyun 8: Kovalamaca | Arı “Kedi doğru dön” ile kovalar, yıldız toplama, hızlanan arı, "dayandığın süre" |
| 42 | ⏱️ Kronometre ve Geri Sayım | Roket geri sayımı, birleştir, zamanlayıcı, "olana kadar bekle", tepki oyunu |
| 43 | 🧠 Oyun 9: Bilgi Yarışması | Soru sor/cevap, rastgele toplama/çarpma soruları, skor, eğer…değilse, hızlı cevap bonusu |
| 44 | 🐠 Canlı Akvaryum | Balık ve baloncuk klonları, kostüm animasyonu, tıklayınca yem, haber salma ile gece |

Her bölümde hikâye, 3 quiz, 6–8 görev ve sonda serbest görev var. Öğretmen notunda bilgisayarsız bir sınıf etkinliği var. Kovalamaca test edildi: hiç kıpırdamayan oyuncu 3–4 sn'de yakalanıyor, dikkatli oyuncu dayanabiliyor.

## Testler
```
node tools/robo-test.mjs all --seeds=10   # tüm örnek çözümler (ızgara + sahne), palet, quiz
node tools/robo-tara.mjs --size=1280x720  # tarayıcıda tüm bölümleri açar, hata/taşma arar
```

## Açık kalanlar (ileride bakılabilir)
- `--mutate` denemesinde 26 sahne görevinde son blok silinse de hedef geçiyor. Hedefler gevşek olabilir ama hepsi hata değil.
- 40. bölümde damga sayısı denetlenemiyor (çalışma zamanı damgaları kaydetmiyor).
- Balon ve Top aynı kostümü kullanıyor; baloncuk/yem için ayrı kostüm eklenebilir.
- Izgarada "Sola dön" düğmesinin simgesi sağ dönüş oku gibi görünebilir; bakılmalı.
