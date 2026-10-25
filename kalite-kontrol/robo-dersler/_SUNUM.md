# Haftalık sunum ve tarama testi yazma — alt agent talimatı

Proje: `/home/mehmetkerem/Masaüstü/projeler/bilgisayar-yolculuk`. Robo ile Kodlama, öğrenciler **3–4. sınıf (8–10 yaş)**.
Öğretmen her haftanın başında/sonunda bu sunumu **tahtaya yansıtır**: "bu hafta bunları öğrendik" diye anlatır, sonra
**tarama testi** sorularını sınıfla **hep birlikte** cevaplar (öğrenciler parmakla A/B/C gösterir, öğretmen "Cevabı göster"e basar).

## Görev
`src/robot/sunum/hN.js` dosyasını yaz (şu an boş bir yer tutucu: `export const sN = { slides: [] };`). Başka dosyaya dokunma.
**Örnek ve biçim:** `src/robot/sunum/h1.js` (1. hafta, hazır) — aynı yapıyı, aynı sadelikte kullan. Renderer: `src/robot/sunum.js`.

Kaynaklar: haftanın güncel ders dosyası `src/robot/lessons/hN.js` (asıl kaynak; dersler yeni sadeleştirildi) ve döküm
`kalite-kontrol/robo-dersler/hafta-N.md` (eski olabilir, çelişirse ders dosyası doğrudur). ⭐ bonus adımların konusu
sunumda **anlatılmaz ve sorulmaz** (herkes görmedi); yalnızca zorunlu adımlardaki konular.

## Slaytlar (sırayla)
1. **Kavram slaytları** (4–6 tane) `{ k: 'kavram', title, text, pic }` — haftanın her ana kavramı için bir slayt.
   - `title`: emoji + kısa başlık. `text`: en çok 2–3 kısa cümle ya da 3 maddelik liste, `<p>`, `<b>`, `<ol>` ile. Çocuk dili.
   - `pic` (çoğunlukla olsun): görsel. Izgara haftaları için `boardPic(rows, dir, 70)`, `codePic('3(FFR)')`, `loopPic(...)`,
     `chips('FFR')`, `miniBot(d)` (`../board.js`, `../robo.js`). Scratch haftaları için `blk(cat, metin, hat)` ve
     `bdPic(dekor, 260)` (`../lessons/sh.js`). Scratch betiği resmi:
     `<div class="sl-script">${blk('events','🏁 tıklandığında',1)}${blk('control','sürekli tekrarla')}<div class="in">${blk('motion','10 adım git')}</div></div>`
     Blok kategorileri ve metinleri: `src/robot/sahne/blocks.js` (motion, looks, sound, events, control, sensing, pen, vars).
2. **Öğrendiklerimiz** `{ k: 'ogrendik', items: [...] }` — 5–6 madde, her biri tek kısa cümle (bölümlerin `learned` listelerinden süzerek).
3. **Tarama testi soruları** `{ k: 'soru', q, pic?, opts, a, why }` — **8–10 soru**.
   - 3 şık (en çok 4). `a`: doğru şıkkın 0'dan başlayan sırası. **Doğru şıkları A/B/C arasında dağıt.**
   - Sorular haftanın zorunlu konularını tarasın: tanım sorusu, resimden okuma ("Robo nerede durur?", "Bu betik ne yapar?"), hata bulma.
   - `why`: tek cümlelik açıklama. Kısa, tahtadan okunacak kadar.
   - Ders adımlarındaki sorularla birebir aynı olmasın (benzer olabilir).
   Kapak, "Tarama testi" ara slaytı ve kapanış **otomatik** eklenir; sen yazma.

## Kurallar
- Negatif sayı, derece, ondalık gibi bu yaşın bilmediği şeyleri soruya koyma (ders öyle anlatıyorsa sade tut).
- Yazılar büyük gösterilir: metinler kısa olsun ki slayta sığsın.
- Dosya başına `// N. hafta sunumu: …` açıklaması, importlar `h1.js` gibi göreli yolla.

## Doğrula (zorunlu)
`node tools/sunum-tara.mjs --week=N` → `sorun: 0` olmalı (slayt taşarsa metni kısalt ya da resmi küçült: boardPic'in 3. değeri, codePic yerine chips).
İstersen `--shots=/tmp/claude-1000/sunumN` ile ekran görüntülerine bakabilirsin (Read ile resmi aç).
Ayrıca `node tools/robo-test.mjs hN` çalıştırıp derlemenin bozulmadığını gör.

Bitirince kısa bir mesajla dön: dosya yolu, kavram/soru sayısı, test sonucu.
