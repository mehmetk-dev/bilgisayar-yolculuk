# Robo zorluk incelemesi — alt agent talimatı

Proje: `/home/mehmetkerem/Masaüstü/projeler/bilgisayar-yolculuk`. Kod DEĞİŞTİRME; yalnızca kendi rapor dosyanı yaz.

## Öğrenciler
Türkiye'de **3. ve 4. sınıf** (8–10 yaş). Haftada bir gün, 4 ders × 40 dk; paylaşılan bilgisayar, tablet ve hoparlör yok.
Sınıfın bir kısmı görevleri yapabiliyor, bir kısmı takılıyor. Öğretmenin kararı: **zor adımlar ⭐ bonus olacak**
(bölümü bitirmek için zorunlu olmayacak, bölümün sonuna taşınacak); herkes "temel yolu" 40 dakikada bitirebilmeli.

Bu yaştaki çocuklar okulda neyi bilir / bilmez:
- Okuma hızı çok farklı; 3. sınıfta yavaş okuyanlar var → uzun paragraflar okunmaz. Kısa cümle, az kelime, kalın anahtar kelime.
- Toplama, çıkarma, çarpım tablosu (3. sınıf), basit bölme bilir. **Negatif sayı bilmez** (7. sınıf). **Açıyı derece ile ölçmeyi bilmez** (5. sınıf; "dik açı" bilinebilir). **Koordinat düzlemi** (6. sınıf) ve **değişken/bilinmeyen** (6–7. sınıf) bilmez. Ondalık sayı (0.5) zayıf.
- Kendi sağı/solu ile karşıdakinin sağı/solu (zihinsel döndürme) zor.
- Soyut kelimeler (algoritma, koşul, değişken, klon, haber salma) somut benzetme olmadan anlaşılmaz.

## Kaynaklar
- Haftanın dökümü: `kalite-kontrol/robo-dersler/hafta-N.md` (her adımın ne olduğu burada).
- Gerekirse kaynak: `src/robot/lessons/hN.js`.

## Görev
Haftadaki her dersin her adımını bu öğrencilere göre değerlendir:
- **Zorluk:** 🟢 Kolay / 🟡 Orta / 🔴 Zor — ve kısaca **neden** (hangi bilgi/beceri eksik olabilir, metin mi uzun, görev mi karmaşık).
- 🟡/🔴 için **somut öneri**, şu etiketlerden biri ya da birkaçı:
  - `[BONUS]` adımı ⭐ bonus yap, bölümün sonuna taşı.
  - `[METİN]` yönerge metnini sadeleştir — **yeni metni aynen yaz** (en çok 2–3 kısa cümle, Türkçe, çocuk dili, öğrenciye "sen" diye hitap).
  - `[İPUCU]` ipucu ekle/iyileştir — yeni ipucunu aynen yaz.
  - `[İSKELE]` önüne daha kolay bir ara adım ekle — adımı tarif et (tür, görev, harita ya da bloklar).
  - `[SAYI]` sayıları yaşa uygun yap (ör. negatif koordinat yerine…, 144° yerine…) — nasıl olacağını yaz.
  - `[ÇIKAR]` gereksiz/çok zor, bonus bile olmamalı.
- Kurallar: Her derste **en az 5–6 zorunlu adım** kalsın ve dersin ana kavramını kapsasın. Bonus adımlar sonda olur. Ana kavramı öğreten ilk görevler bonus yapılmaz; gerekiyorsa sadeleştirilir.
- Abartma: kolay olanı kolay yaz; her adıma öneri şart değil.

## Rapor biçimi — dosya: `kalite-kontrol/robo-dersler/zorluk/hafta-N.md`

```markdown
# Hafta N — zorluk incelemesi (3–4. sınıf)

## Özet
- Haftanın genel zorluğu: …
- En çok takılınacak yerler: (3–5 madde)

## Bölüm X — <başlık>
| # | Adım | Zorluk | Neden | Öneri |
|---|---|---|---|---|
| 1 | … | 🟢 | … | — |
| 7 | … | 🔴 | … | [BONUS] |

### Öneri ayrıntıları
- **Adım 7 [METİN]:** Yeni metin: “…”
- **Adım 9 [İSKELE]:** …
- **Önerilen yeni sıra:** 1, 2, 3, 4, 5, 6, 8 · ⭐ 7, 9 (zorunlu: 7 adım, bonus: 2)

(her bölüm için tekrar)

## Öncelikli değişiklikler
1. … (en çok fayda sağlayacak 5 değişiklik, önem sırasıyla)
```

Bitirince yalnızca kısa bir mesajla dön: dosya yolu ve bir cümlelik özet. Raporu sohbete yapıştırma.
