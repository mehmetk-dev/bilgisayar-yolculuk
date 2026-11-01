# Sunumlar

## `robo/` — Robo ile Kodlama (çocuklar, 3–4. sınıf)
- **`index.html`** → buradan aç, haftayı seç.
- `hafta-1.html` … `hafta-8.html` → her hafta 4 ders, tahtada anlatım (internetsiz).
- `ekstra/ic-ice-donguler.html` → yalnız iç içe döngü konusu (2. haftanın 3. dersinde de var).
- `kaynak/` → sunumların kaynak kodu. Yeniden üretmek: `node sunum/robo/kaynak/derle.mjs && node sunum/robo/kaynak/dizin.mjs`, denetim: `node sunum/robo/kaynak/tara.mjs 1`.

Sunumda tuşlar: → / Boşluk ileri · ← geri · **F** tam ekran · **M** ders menüsü · **N** öğretmen notu · **P** oynat · 1-2-3 soru şıkkı.

## `yetiskin-kursu/` — Bilgisayar İşletmenliği (yetişkinler, 15 hafta)
- **`PDF/`** → tahtada kullanılan PDF'ler (hafta 1–15, ek güvenlik, donanım, donanım notları, tüm haftalar tek dosya).
- `kaynak/` → PDF'lerin kaynağı: `uret.py` HTML'leri, `pdf.mjs` PDF'leri üretir, `img/` ve `img2/` resimler.
  Yeniden üretmek: `python3 sunum/yetiskin-kursu/kaynak/uret.py && node sunum/yetiskin-kursu/kaynak/pdf.mjs`
- `eski-taslaklar/` → beğenilmeyen eski tahta denemeleri (kullanılmıyor).
