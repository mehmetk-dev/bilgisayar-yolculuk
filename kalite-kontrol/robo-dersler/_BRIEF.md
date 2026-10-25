# Robo ders dökümü — alt agent talimatı

Proje: `/home/mehmetkerem/Masaüstü/projeler/bilgisayar-yolculuk`
Robo kaynakları: `src/robot/lessons/` (hafta dosyaları h1.js … h8.js, ek bölümler ek1.js … ek6.js; sıra `lessons/index.js` içindeki `WEEKS`).

Görevin: Sana verilen haftanın kaynak dosyasını BAŞTAN SONA oku ve o haftadaki her dersin
her adımını Markdown rapora dök. Hiçbir ders ya da adım atlanmayacak. Kod DEĞİŞTİRME; yalnızca
kendi rapor dosyanı yaz. Uydurma bilgi yazma: yalnızca kaynakta olanı yaz. HTML etiketlerini temizle,
`${blk('motion','10 adım git')}` gibi yardımcıları düz metne çevir (ör. `[10 adım git]`).

## Yardımcı bilgiler
- Bölüm numarası (`no`): dosyalardaki `bN` adı = N. bölüm (b13 → Bölüm 13). Hafta içi sıra: index.js'teki sıraya göre 1–4.
- Adım türleri: `story` (anlatım), `order` (sıralama kartları), `quiz` (çoktan seçmeli; `a` = doğru şıkkın 0'dan başlayan sırası), `grid` (Robo ızgara görevi), `scratch` (Scratch benzeri sahne görevi).
- Izgara komut kodları (`tools`, `sol`): F=İleri git, B=Geri git, L=Sola dön, R=Sağa dön, P=Yıldızı al, fn=Fonksiyon, loop=Tekrarla, if=Eğer…ise, ife=Eğer…değilse, until=…olana kadar tekrarla. `sol` içindeki parantez/sayı yapısını olduğu gibi göster.
- Izgara haritası (`map`): `.` zemin, `S` başlangıç, `G` pil, `*` yıldız, `#` ağaç, `~` su, `k` anahtar, `D` kapı, boşluk = yol yok. `dir`: N yukarı, E sağ, S aşağı, W sol. Haritayı kod bloğu içinde aynen göster.
- Izgara ek seçenekleri varsa belirt: `watch` (hazır programı izleme), `tut` (adım adım yönlendirme), `narrate`, `pathHint`, `max` (en fazla blok), `preset`.
- Scratch blok adları için gerekirse `src/robot/sahne/blocks.js` dosyasına bak (ör. `move` = "{n} adım git", `flag` = "🏁 tıklandığında").
- Scratch adımında: sahne/dekor ve kuklalar (`setup`), kullanılabilir bloklar (`blocks`), hedefler (`goals[].t`), ipucu (`hint`), örnek çözüm (`sol`) — çözümü okunur blok sırasına çevir.

## Dosya biçimi (aynen uygula)

```markdown
# Hafta X — <hafta başlığı>

> Robo ile Kodlama · X. hafta · 4 ders × 40 dk · Bölümler A–D

## Haftaya genel bakış

| Ders | Bölüm | Başlık | Kavram | Adım sayısı | Adım türleri |
|---|---|---|---|---|---|
| 1. ders | Bölüm A | … | … | 12 | 3 anlatım, 3 sıralama, 2 test, 4 ızgara |

---

## 1. ders · Bölüm A — <ikon> <başlık>

- **Kavram:** …
- **Kısa açıklama:** (desc)
- **Öğrendiklerimiz:** (learned maddeleri, liste halinde)
- **Öğretmen notu:** (teacher, düz metin)

### Adımlar

| # | Tür | Başlık | Ne yapılıyor? |
|---|---|---|---|
| 1 | 📖 Anlatım | Merhaba, ben Robo! | Robo kendini tanıtır, algoritma kavramı açıklanır. |
| 2 | 🔢 Sıralama | … | Diş fırçalama adımları sıraya dizilir (5 kart). |
| 3 | ❓ Test | … | Soru: … · Doğru cevap: … |
| 4 | 🤖 Izgara | … | Robo pile gider; araçlar: İleri git; çözüm: FFFF (4 blok). |
| 5 | 🐱 Scratch | … | Kedi yıldıza koşar; hedefler: …; bloklar: … |

### Adım ayrıntıları

#### Adım 1 · 📖 Anlatım — <başlık>
Metnin kısa özeti (1–3 cümle).

#### Adım 4 · 🤖 Izgara — <başlık>
- Görev: …
- Harita (yön: E/sağa bakıyor):
  ```
  S...G
  ```
- Araçlar: İleri git
- Örnek çözüm: `FFFF`
- İpucu: …
- Ek: (watch/tut/max vb. varsa)

#### Adım 5 · 🐱 Scratch — <başlık>
- Görev: …
- Sahne: dekor `cayir`; kuklalar: Kedi (-160,-60), Yıldız (120,-60)
- Bloklar: 🏁 tıklandığında, adım git
- Hedefler: 1) … 2) …
- İpucu: …
- Örnek çözüm: Kedi → [🏁 tıklandığında] → [250 adım git]

(sıralama adımında kartların doğru sırası; testte soru, şıklar, doğru cevap ve açıklama)

---
(sonraki ders…)

## Hafta özeti
- Bu haftada kullanılan yeni bloklar/komutlar: …
- Toplam adım: … (… anlatım, … test, … ızgara/scratch)
```

Bitirince yalnızca kısa bir mesajla dön: dosya yolu, ders sayısı, toplam adım sayısı. Raporu sohbete yapıştırma.
