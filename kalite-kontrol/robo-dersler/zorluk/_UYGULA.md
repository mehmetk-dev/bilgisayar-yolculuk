# Zorluk önerilerini uygulama — alt agent talimatı

Proje: `/home/mehmetkerem/Masaüstü/projeler/bilgisayar-yolculuk`. Öğrenciler 3–4. sınıf (8–10 yaş). Öğretmenin kararı:
**zor adımlar ⭐ bonus olur** (bölümü bitirmek için zorunlu değil); herkes temel yolu 40 dakikada bitirebilmeli.

## Ne yapacaksın
Sana verilen haftanın zorluk raporunu (`kalite-kontrol/robo-dersler/zorluk/hafta-N.md`) oku ve önerileri
**yalnızca o haftanın ders dosyasına** (`src/robot/lessons/hN.js`) uygula. Başka dosyaya DOKUNMA
(board.js, app.js, sahne/*, css, başka haftalar yasak). Sana "dokunma" denen bölümlere de dokunma.

### Altyapı (hazır, kullan)
- **Bonus adım:** başlığı `⭐` ile başlayan ya da `bonus: true` olan adım bonus sayılır. Bonus adımlar atlanabilir
  ("Atla ▶"), bölüm zorunlu adımlar bitince biter. Başlığı `⭐ Bonus: …` biçiminde yaz. **Bonus adımları bölümün
  sonuna taşı** (zorunlu adımlar önde, bonuslar en sonda).
- Izgara adımı seçenekleri: `max`, `preset`, `tut` (adım adım tarif), `watch`, `narrate`, `pathHint`, `hint`, `loopN`.
  Preset blok sayısı `max`'tan büyükse bu bir "kısaltma görevi" olur (çalıştırmadan önce sınır denetlenir).
- Sahne (scratch) adımı: `hint` alanı eklenebilir (iki başarısız denemeden sonra görünür). Yeni metin/ipucu yazarken
  mevcut yardımcıları kullan (`blk(...)`, `sp(...)` vb. dosyanın başındaki importlar).

### Uygula
- `[BONUS]` → başlığa `⭐ Bonus: ` ekle (zaten ⭐ varsa dokunma), adımı bölüm sonuna taşı.
- `[METİN]`, `[İPUCU]` → raporda yazılı yeni metni koy (gerekirse dosyadaki HTML biçimine uydur: `<p>`, `<b>`, `blk()`).
- `[SAYI]` → yalnızca **çözümü/hedefleri bozmadan** yapılabiliyorsa uygula: sayıyı değiştirince `sol`, `goals`,
  `setup` konumları, `answers`, `play` vb. hepsini tutarlı güncelle. Emin değilsen uygulama, listeye yaz.
- `[İSKELE]` → yeni kolay ara adım ekle, **ama yalnızca mevcut adım türleri ve seçeneklerle yapılabiliyorsa**
  (yeni ızgara adımında `sol` zorunlu; yeni sahne adımında `sol` ve gerekiyorsa `play`/`answers`/`testTime`
  mevcut benzer adımlardan örnek alınarak). Motor değişikliği gerektiren (sahneye ızgara çizmek, yeni blok,
  canlı x/y göstergesi gibi) önerileri UYGULAMA, listeye yaz.
- `[ÇIKAR]` → uygulama, listeye yaz (öğretmen karar verecek).
- Her derste **en az 5 zorunlu adım** kalsın. Öğrenci adı/ilerleme bozulmasın diye bölüm (`bN`) eklemek/silmek yasak;
  yalnızca bölüm içindeki adımları düzenle.
- `teacher` metnine gerekirse kısa not ekleyebilirsin (ör. bonus adımların isteğe bağlı olduğu).

### Doğrula (zorunlu)
1. `node tools/robo-test.mjs hN` → `Başarısız: 0` olmalı. Hata varsa düzelt, tekrar çalıştır.
2. `node tools/robo-tara.mjs --only=NO` her değiştirdiğin bölüm için → sorun 0 olmalı.

### Rapor
`kalite-kontrol/robo-dersler/zorluk/uygulama-hafta-N.md` dosyasına kısa bir liste yaz:
- Bölüm bölüm yapılan değişiklikler (bonus yapılanlar, yeni adımlar, değişen metinler, değişen sayılar)
- **Uygulanamayanlar** (motor değişikliği isteyen, emin olunmayan, ÇIKAR önerileri) ve nedeni
- Test çıktısının son satırı

Bitirince kısa bir mesajla dön: dosya yolu, bir cümlelik özet, test sonucu.
