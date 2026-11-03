# 12. hafta Sunu (PowerPoint) denetimi

Tarih: 2026-11-02. İncelenen: `sunu.js`, `sunu2.js` … `sunu6.js`, `odevler.js` (odev12), `testler.js` (test12), `apps/slides.js`. Kod değiştirilmedi.

## Özet (5 satır)

1. MEB konularının neredeyse hepsi var; animasyon, prova, köprü ve üst/alt bilgi dersleri iyi ve gerçek adlarla yazılmış.
2. En büyük sorun: benzetime özgü düğmeler gerçek PowerPoint'teymiş gibi anlatılıyor. PDF, video, geçiş süresi, animasyon başlangıcı, slayt taşıma, SmartArt, Asıl Slayt ve Ses bu durumda. Word derslerindeki "Gerçek Word'de: …" notu PowerPoint derslerinde yok.
3. YÜKSEK bulgu 9 tane. En önemlileri sınavda doğrudan istenen işlerde: tüm slaytlara geçiş/süre, PDF kaydetme ve animasyon.
4. MEB eksikleri: arka plan biçimlendirme, metin biçimi (renk, yazı tipi, hizalama), geçiş seçenekleri ve "Tümüne Uygula", PowerPoint Gösterisi (.ppsx), resim kırpma, yazım denetimi.
5. Anlatım genel olarak sade ve "siz" dilinde. Takılma yerleri: üç kez tıklama, bir adımda çok iş isteyen yerler ve `animasyon` dersindeki iki ayrı "Başlangıç" düzeni.

---

## 1) Doğruluk hataları

### Y1. PDF ve video kaydetme: gerçek yol verilmiyor (YÜKSEK)
- Yer: `sunu2.js:303` (ani-albumu PDF), `sunu2.js:309` (Video), `sunu2.js:249-250` (özet), `sunu4.js:234` (parkur ipucu); benzetim `slides.js:93`.
- Sorun: Windows'taki PowerPoint'te "PDF olarak kaydet" ve "Video olarak kaydet (.mp4)" adlı menü öğeleri yok. Word derslerinde (`kelime.js:216`, `programlar2.js:262`, `belgegonder.js:65`) "Gerçek Word'de: Dosya → Farklı Kaydet → Kayıt türü: PDF" notu var. PowerPoint derslerinde bu not hiç yok. `odev12` Görev 5 (`odevler.js:154`) de yolu söylemiyor.
- Düzeltme: Üç yere de not ekleyin: "Gerçek PowerPoint'te: **Dosya → Dışarı Aktar → PDF/XPS Belgesi Oluştur** (ya da Farklı Kaydet → Kayıt türü: PDF). Video için: **Dosya → Dışarı Aktar → Video Oluştur**." Düğme adları için bkz. 6. bölüm.

### Y2. Geçiş süresi: "Kendiliğinden ilerle" ve "Tüm slaytlara uygula" gerçekte yok (YÜKSEK, önceki raporda da vardı, hâlâ açık)
- Yer: `sunu2.js:218-219`, `sunu2.js:173`, `sunu2.js:297`, `testler.js:704` (test sorusunun şıkkı), benzetim `slides.js:74`.
- Sorun: Gerçek PowerPoint'te Geçişler → Zamanlama öbeğinde iki onay kutusu var: **"Fare Tıklatıldığında"** ve **"Sonra:"**. "Sonra:" kutusuna süre yazılır (00:03,00). Hemen yanında da **"Tümüne Uygula"** düğmesi durur. `sunu-baglanti` dersi Üst Bilgi penceresinde zaten doğru adı ("Tümüne Uygula") kullanıyor. Aynı kursta iki farklı ad geçiyor. Bu iş MEB sınavında sık istenir.
- Düzeltme: Benzetim etiketlerini "Sonraki Slayt: ☐ Fare Tıklatıldığında ☐ Sonra: [00:03]" ve "Tümüne Uygula" yapın. Ders metinleri, özet ve test şıkkı da buna göre güncellensin.

### Y3. `animasyon` dersi: slayt seçip efekt vermek ve "Tıklayınca / Kendiliğinden" başlangıcı (YÜKSEK)
- Yer: `sunu2.js:186-188` (slayda tıkla → Soldan gel), `sunu2.js:199`, `sunu2.js:212`, `sunu2.js:171-172` (özet); benzetim `slides.js:80` (`pp-aold`).
- Sorun: Gerçek PowerPoint'te slayttaki bir nesne seçilmeden Animasyonlar galerisi gridir, efekt verilemez. Bu ders ise "slayda tıklayın → Soldan gel" diyor. Gerçekte "Kendiliğinden" adlı bir başlangıç da yok; seçenekler **Tıklatıldığında / Öncekiyle / Öncekinden Sonra**. "1'er saniye arayla gelir" de gerçek bir davranış değil. Bir sonraki ders (`animasyon-bolmesi`) doğru yöntemi öğretiyor. Öğrenci aynı sekmede iki ayrı düzen görüyor (`slides.js:360-361`).
- Düzeltme: `animasyon` dersinde önce madde kutusuna tıklatın ("Seçili: Maddeler" yazısını gösterin). "Kendiliğinden" yerine "Öncekinden Sonra" kullanın. Benzetimde `pp-aold` düzeni kaldırılabilir; nesne seçilmeden efekt seçilince "Önce nesneye tıklayın" uyarısı zaten var (`slides.js:414`).

### Y4. Slayt taşıma, çoğaltma ve silme düğmeleri gerçek Giriş sekmesinde yok (YÜKSEK)
- Yer: `sunu.js:87` (▲ Yukarı), `sunu.js:90` (🗑 Sil), `sunu.js:21` (özet), `sunu2.js:57-58` (ipucu: "Slaytı Çoğalt … ▲ Yukarı düğmesinin solunda"); benzetim `slides.js:60`.
- Sorun: Gerçek PowerPoint'in Giriş sekmesinde ▲ Yukarı, ▼ Aşağı, Slaytı Çoğalt ve Sil düğmeleri yok. Slayt sırası soldaki küçük resimleri sürükleyerek değişir. Çoğaltmak için küçük resme sağ tıklayıp **Slaytı Çoğalt** seçilir (ya da Ctrl + D, ya da Yeni Slayt ▾ → Seçili Slaytları Çoğalt). Silmek için Delete tuşuna basılır ya da sağ tık → **Slaytı Sil** seçilir.
- Düzeltme: `sunu` adım 9'u "soldaki listede slaydı tutup yukarı sürükleyin" diye değiştirin; ▲ ikinci yol olarak kalabilir. Ama metne "gerçek PowerPoint'te bu düğme yoktur" yazılmalı. Benzetimde küçük resimlere sağ tık menüsü (Slaytı Çoğalt, Slaytı Sil, Slaytı Gizle) ve küçük resim sürükleme eklenmeli (bkz. 4. bölüm).

### Y5. SmartArt: "Ekle → SmartArt" ve "Listeye geri dön" yanlış model (YÜKSEK)
- Yer: `sunu2.js:117`, `sunu2.js:123`, `sunu2.js:142-145`, özet `sunu2.js:108`, `sunu2.js:112`; benzetim `slides.js:64`, `slides.js:134`.
- Sorun: Gerçek PowerPoint'te **Ekle → SmartArt** var olan maddeleri dönüştürmez. "SmartArt Grafiği Seç" penceresini açar ve boş bir şema ekler. Var olan maddeleri dönüştüren yol **Giriş → SmartArt'a Dönüştür**'dür. Ayrıca şemaya kişi eklemek için listeye dönmek gerekmez. Şemanın solundaki **Metin Bölmesi**'ne yazılır ya da **SmartArt Tasarımı → Şekil Ekle** kullanılır. "Şemayı değiştirmek için önce listeye dönmek gerekir" cümlesi (`sunu2.js:145`) gerçekte yanlıştır. Kategori adları da gerçekte farklıdır: "Soy ağacı" Hiyerarşi kategorisindedir.
- Düzeltme: Adım 2'yi "Giriş → SmartArt'a Dönüştür" yapın. Adım 5'te "Metin Bölmesi'ne yeni satır yazın" deyin. Benzetimdeki "Listeye geri dön" düğmesinin adı "Metne Dönüştür" olabilir. Kategori adları için bkz. 6. bölüm.

### Y6. Asıl Slayt: benzetimdeki şerit gerçek PowerPoint'e benzemiyor; ödevde alt bilgi çıkmaz (YÜKSEK)
- Yer: `sunu4.js:58`, `sunu4.js:64-66`, `sunu4.js:71`, `sunu4.js:78`; `odevler.js:155` (odev12 Görev 6); benzetim `slides.js:87-91`.
- Sorun: Gerçek **Asıl Slayt** sekmesinde "Logo ekle", "Başlık rengi" ya da "Alt bilgi" kutusu yok. Gerçekte şöyle yapılır: soldaki en üstteki büyük slayt (asıl slayt) seçilir. Logo için Ekle → Resimler kullanılır. Başlık rengi için başlık kutusu seçilip Giriş → Yazı Tipi Rengi kullanılır. Yazı tipi için Asıl Slayt → Yazı Tipleri seçilir. Önemli tuzak: asıl slayttaki alt bilgi kutusuna yazılan yazı slaytlarda **görünmez**. Görünmesi için **Ekle → Üst Bilgi ve Alt Bilgi → Alt bilgi** işaretlenip Tümüne Uygula denmelidir. Ödevde öğrenciye "alt bilgiye adınızı yazın, bütün slaytlarda göründüğüne bakın" deniyor. Gerçek bilgisayarda yazı büyük olasılıkla çıkmaz.
- Düzeltme: Derse "Gerçek PowerPoint'te: en üstteki büyük slayda tıklayın; logo için Ekle → Resimler…" bilgi kutusu ekleyin. Ödev Görev 6'yı "köşeye küçük bir resim koyun" diye sadeleştirin, ya da "alt bilgi görünmüyorsa Ekle → Üst Bilgi ve Alt Bilgi → Alt bilgi'yi işaretleyin" diye ekleyin.

### Y7. Ses: "Gösteri başlayınca müzik çalar" gerçekte böyle değil (YÜKSEK)
- Yer: `sunu2.js:291-293`, özet `sunu2.js:248`; benzetim `slides.js:584-585`.
- Sorun: Gerçek PowerPoint'te eklenen ses yalnızca eklendiği slaytta çalar. Çoğu zaman tıklama sırasıyla başlar ve slayt değişince durur. Albüm boyunca çalması için ses simgesi seçilir, **Kayıttan Yürütme** sekmesinde **Arka Planda Yürüt** seçilir. Öğrenci evde müziğin ilk fotoğraftan sonra kesildiğini görür. Ekleme yolu da "Ekle → Ses → Bilgisayarımdaki Ses…" biçimindedir.
- Düzeltme: Adım 6'ya "Gerçek PowerPoint'te: ses simgesine tıklayın, Kayıttan Yürütme → Arka Planda Yürüt" notu ekleyin. Ad için bkz. 6. bölüm.

### Y8. "Ekle → Slayt numarası" tek tıkla numara koymaz (YÜKSEK)
- Yer: `sunu3.js:106` (sunu-ani adım 2), özet `sunu3.js:85`; benzetim `slides.js:67`.
- Sorun: Gerçek PowerPoint'te Ekle → **Slayt Numarası** tıklanınca **Üst Bilgi ve Alt Bilgi** penceresi açılır. Numara ancak "Slayt numarası" işaretlenip Uygula/Tümüne Uygula denince gelir. "İlk slayda gelmez" cümlesi de ancak "Başlık slaytında gösterme" işaretlenirse doğrudur. `sunu-baglanti` adım 10 bu işi doğru öğretiyor; iki ders birbiriyle çelişiyor.
- Düzeltme: Benzetimde ＃ düğmesi Üst Bilgi ve Alt Bilgi penceresini açsın (`slides.js:922`'deki pencere hazır). Ders metni de "pencerede Slayt numarası'nı işaretleyip Tümüne Uygula" desin. İpucundaki konum da yanlış: düğme Grafik'in yanında, "Fotoğraf Albümü ve SmartArt'ın yanında" değil (`sunu3.js:107`).

### Y9. "Ekle → Resim boyutu → Büyük" gerçekte yok (YÜKSEK, zararı küçük)
- Yer: `sunu2.js:284`, özet `sunu2.js:247`; benzetim `slides.js:62`.
- Sorun: Gerçekte resim köşesinden sürüklenerek büyütülür ya da **Resim Biçimi → Boyut** kutuları kullanılır. Ekle sekmesinde boyut düğmesi yok. Ödev (`odevler.js:151`) doğru yolu söylüyor, ders söylemiyor.
- Düzeltme: Adıma "Gerçek PowerPoint'te: fotoğrafa tıklayıp köşedeki yuvarlaktan sürükleyin" notu ekleyin.

### O1. Video "sunuyla birlikte taşınmalı" cümlesi bugünkü PowerPoint için yanlış (ORTA)
- Yer: `sunu5.js:260`.
- Sorun: PowerPoint 2010'dan beri Ekle → Video → Bu Cihaz ile eklenen video sunu dosyasının **içine gömülür**. Ayrıca taşımak gerekmez; yalnızca "Dosyaya bağla" seçilirse gerekir. Cümle öğrenciye gereksiz iş yaptırır.
- Düzeltme: "Video sunu dosyasının içine girer; dosya büyür. E-postayla gönderirken boyutuna dikkat edin."

### O2. Yazdırma düzeni adları gerçek PowerPoint'ten farklı (ORTA)
- Yer: `sunu2.js:319` ("Bir kâğıda 4 slayt"), `sunu5.js:167`, `testler.js` (Kâğıt tasarrufu sorusu); benzetim `slides.js:788`.
- Sorun: Gerçekte yazdırma ekranında "Tam Sayfa Slaytlar" düğmesi açılır. Altında Yazdırma Düzeni (Tam Sayfa Slaytlar, Not Sayfaları, Anahat) ve **Dinleyici Notları** (1, 2, 3, 4 yatay/dikey, 6, 9 slayt) vardır. Yani "bir kâğıda 4 slayt" de bir dinleyici notu düzenidir. Benzetim "Dinleyici notları (3 slayt)" ile "Bir kâğıda 4 slayt"ı ayrı türlermiş gibi gösteriyor. `odev12` Görev 9 (`odevler.js:158`) doğru adları kullanıyor.
- Düzeltme: Benzetimdeki düğmelerin adları "Tam Sayfa Slaytlar / Dinleyici Notları: 3 Slayt / 4 Slayt / 6 Slayt / Not Sayfaları" olsun. Ders metinleri de buna uyulsun.

### O3. Geçiş ve animasyon efekt adları (ORTA, önceki raporun 15. maddesi, hâlâ açık)
- Yer: `slides.js:16`, `slides.js:18`, `slides.js:29`; `sunu.js:79`, `sunu2.js:186`, `sunu6.js:66`, `sunu6.js:137`, `odevler.js:152` ("Solma (Fade)").
- Sorun: "Solma", "Soldan gel", "Belirme", "Büyüme", "Yakınlaştır", "Döndür" adları gerçek Türkçe PowerPoint'teki adlarla büyük olasılıkla aynı değil. Gerçekte büyük olasılıkla Soldurma, Uçarak Gelme (yön: Soldan, Efekt Seçenekleri'nden), Görünme ve Döndürme. Kesin adlar için bkz. 6. bölüm. "Soldan gel" gerçekte tek bir efekt değil; Uçarak Gelme seçilip Efekt Seçenekleri'nden "Soldan" seçilir.
- Düzeltme: Adları gerçek bir PowerPoint'ten bakarak düzeltin. "Soldan gel" için derse bir cümle ekleyin: "Gerçekte: Uçarak Gelme, sonra Efekt Seçenekleri → Soldan."

### D1. Tema adları uydurma (DÜŞÜK)
- Yer: `sunu.js:50` ("örneğin Bahar"), `sunu4.js:210`; `slides.js:9-14`.
- Sorun: Gerçek PowerPoint'te "Bahar", "Okyanus" ya da "Gece" adlı tema yok. Öğrenci bu adları arar.
- Düzeltme: "Örneğin Bahar" yerine "beğendiğiniz herhangi bir tema" yazın; ya da "gerçek PowerPoint'te tema adları farklıdır" notu ekleyin.

### D2. `animasyon-bolmesi`: "bu slaytta 7 animasyon var" sayısı tutmuyor olabilir (DÜŞÜK)
- Yer: `sunu6.js:164`.
- Sorun: Başlık, Büyüme, Darbe, Kaybolma ve Soldan gel 5 animasyon eder; üç madde de paragraf paragraf oynar (`slides.js:319`). Toplam 8 olur. Bölmede ise 6 satır görünür. Öğrenci sayınca şaşırır.
- Düzeltme: Sayıyı kontrol edip "8" yazın ya da cümleyi "3 kez tıklayacaksınız" diye değiştirin.

### D3. Küçük adlar (DÜŞÜK)
- `sunu.js:65` ve `slides.js:59`: gerçekte "Yazı Tipi Boyutu" kutusu var.
- `slides.js:15` "Fotoğraf ve yazı" düzeni: gerçekte "Resim Yazısı ile Resim".
- `sunu5.js:232` ve `slides.js:72` "🗑 Şekli sil": gerçekte Şekil Biçimi sekmesinde böyle bir düğme yok; Delete tuşu kullanılır. İpucuna "(gerçekte: şekle tıklayıp Delete)" ekleyin.
- `sunu4.js:98` "Tabloyu kaldır" Ekle listesinde: gerçekte tablo seçilip Delete tuşuna basılır ya da Düzen → Sil → Tabloyu Sil.

---

## 2) MEB eksikleri

| Konu | Durum | Önem | Öneri |
|---|---|---|---|
| Arka plan biçimlendirme (Tasarım → Arka Planı Biçimlendir: düz renk, resim dolgusu, Tümüne Uygula), Varyantlar | Yok | ORTA | `sunu` dersine ya da parkura 1 adım ekleyin |
| Metin biçimi: yazı tipi, renk, hizalama, madde işareti/numaralandırma, satır aralığı | Benzetimde yalnızca K, T ve boyut var | ORTA | Giriş şeridine renk ve hizalama ekleyin; parkurda "başlığı ortala, renk ver" isteyin |
| Geçiş Efekt Seçenekleri, Süre, **Tümüne Uygula** | Yok; parkur her slayda tek tek tıklatıyor (`sunu4.js:215`) | ORTA | Sınavda "bütün slaytlara geçiş" sık istenir; Tümüne Uygula öğretilsin |
| Kaydetme biçimleri: **PowerPoint Gösterisi (.ppsx)**, 97-2003 (.ppt) | Yok | ORTA | ani-albumu ya da sunu-prova'ya 1 adım: çift tıklayınca doğrudan gösteri açılan dosya |
| Resim kırpma, Resim Biçimi (stil, kenarlık) | Yok | ORTA | Ödevdeki "boyut ayarla"nın yanına derste 1 adım |
| Slaytı Gizle ve silme uygulaması | Yalnızca bilgi kutusu (`sunu2.js:91`); benzetimde sağ tık menüsü yok | ORTA | Benzetime küçük resim sağ tık menüsü; uygulamalı adım |
| Yazım denetimi (Gözden Geçir → Yazım Denetimi, F7) | Gözden Geçir sekmesi benzetimde yok | DÜŞÜK | Word'de öğretildiyse PowerPoint'te bir cümle yeter |
| Slayt Gösterisini Ayarla (Esc'ye kadar sürekli döngü), Özel Gösteri | Yok | DÜŞÜK | Albüm ya da "fuar sunusu" için bir cümle |
| Sunucu Görünümü (Alt + F5) | Yalnızca soru içinde adı geçiyor (`sunu3.js:157`) | DÜŞÜK | sunu-ani'ye bilgi kutusu: "Tek ekranda denemek için Alt + F5" |
| Anahat görünümü, slayt boyutu (16:9 / 4:3), hizalama ve gruplama | Yok | DÜŞÜK | İsteğe bağlı |

Sınavda sık istenen işler şunlar: 4-5 slaytlık sunu, tema, resim, geçiş, animasyon ve gösteriyi başlatma. Öğrenci bunların hepsini benzetimde yapabiliyor; `sunu-parkur` bunları topluca sınıyor. Ama bu işlerin üçünde (Y1, Y2, Y3) benzetimde öğrenilen yol gerçek PowerPoint'te yok. Kursiyer sınavda düğmeyi arayıp bulamayabilir. Kapsam tamam; asıl risk gerçek düğme adları.

---

## 3) Anlaşılırlık

### O4. Üç kez hızlı tıklama ileri yaştakiler için zor (ORTA)
- Yer: `sunu5.js:264`, `sunu5.js:272`, `sunu2.js:65`.
- Sorun: Yaşlı kullanıcı üç kez hızlı tıklamayı çoğu zaman beceremez; yarısı seçilir.
- Düzeltme: Bunu ikinci yol yapın: "Yazının başına tıklayın, farenin sol tuşunu basılı tutup sonuna kadar sürükleyin. Olmazsa üç kez hızlıca tıklayın."

### O5. Bir adımda çok iş (ORTA)
- `sunu5.js:290-293` (Üst Bilgi ve Alt Bilgi): 5 iş tek adımda. Liste var, eksik kalanı da söylüyor; yine de ikiye bölünebilir: önce tarih ve numara, sonra alt bilgi ve başlık slaydı.
- `sunu6.js:146-147` (efekt, başlangıç ve gecikme) ile `sunu6.js:137` (efekt ve başlangıç): adımlar ikiye bölünebilir.
- `sunu.js:57-58` ve `sunu.js:72`: düzen seç, başlık yaz, üç madde yaz. Bu ilk derste ağır gelir.

### O6. `animasyon` ile `animasyon-bolmesi` aynı şeyi iki ayrı adla öğretiyor (ORTA)
- Yer: `sunu2.js:199`, `sunu2.js:212` ("Tıklayınca / Kendiliğinden") ile `sunu6.js:115` ("Tıklatıldığında / Öncekiyle / Öncekinden Sonra").
- Sorun: Öğrenci ilk derste öğrendiği adı ikinci derste bulamaz. Şerit duruma göre değişiyor (`slides.js:360`). Y3 düzeltilince bu sorun da kalkar.

### D4. Açıklanmadan geçen terimler (DÜŞÜK)
- "Sunucu görünümü" (`sunu3.js:155`, `sunu3.js:157`) hiç gösterilmeden soruda geçiyor. Bir cümleyle açıklanmalı.
- "Köprü" ilk geçtiği yerde (`sunu5.js:264`) "bağlantı" diye açıklanıyor ama "Köprü Ekle" penceresinin adı bundan önce geliyor. Sırası değişebilir.
- "Punto" açıklanmış, iyi. "Tema", "geçiş" ve "animasyon" iyi açıklanmış.

### D5. Ders süreleri (DÜŞÜK)
- `asil-slayt` 30 dakikada 16 adım (Asıl Slayt + tablo + grafik), `sunu-baglanti` 40 dakikada 15 adım. Hiç bilmeyen yaşlı kursiyer için kısa kalabilir. `asil-slayt` ikiye bölünebilir: Asıl Slayt ayrı, tablo ve grafik ayrı. Bu bir tahmin; sınıftaki gözleme göre karar verin.

### D6. Kaydetmede OneDrive tuzağı (DÜŞÜK, önceki rapordan hâlâ açık)
- `sunu.js:103`: Word dersine "Bu bilgisayar ya da OneDrive'a bakın" notu eklenmiş (`kelime.js:125`). PowerPoint'in ilk kayıt adımında bu not yok. Aynı cümle eklenmeli.

### Önceki raporlardan kapananlar
- sunu-ani'deki "3 slayt / 4 slayt" farkı, smartart'taki "Halam", slayt-duzen'deki sağ liste denetimi, boş "Aferin" mesajları ve program adının "PowerPoint" olarak söylenmesi düzeltilmiş.
- Önceki rapordaki 13. madde (sil, gizle, metin kutusu, düzen) yarım kaldı: yalnızca bilgi kutusu olarak eklenmiş, uygulaması yok.

---

## 4) Benzetimin gerçek PowerPoint'ten farkları

| Benzetimde | Gerçek PowerPoint'te | Önem |
|---|---|---|
| Küçük resimlere sağ tıklayınca bir şey olmuyor (`slides.js:1336` yalnızca klavye); ders ise "sağ tık → Slaytı Sil / Gizle" diyor (`sunu2.js:91`) | Sağ tık menüsü: Yeni Slayt, Slaytı Çoğalt, Slaytı Sil, Slaytı Gizle, Düzen | ORTA |
| Normal görünümde küçük resimler sürüklenemiyor (yalnızca Sıralayıcı'da) | Soldaki listede de sürüklenerek sıra değişir | ORTA |
| Ekle → SmartArt var olan maddeleri dönüştürüyor | Boş şema ekler; dönüştürmek için Giriş → SmartArt'a Dönüştür | YÜKSEK (Y5) |
| Eylem düğmesi seçilince hemen konuyor | Seçtikten sonra slayta çizmek (tıklayıp sürüklemek) gerekir, Eylem Ayarları sonra açılır; belirli slayt için "Köprü: Slayt…" ikinci pencere açar | DÜŞÜK; derse bir cümle |
| Fotoğraf Albümü Resimler klasöründeki hepsini alıp aynı sunuya ekliyor | Pencerede "Dosya/Disk…" ile fotoğraflar seçilir, **Oluştur** denir, **yeni bir sunu** açılır | ORTA; derse bir cümle |
| Grafik verisi tek seri; tür veri kutusunun altından değişiyor | Excel penceresi açılır, örnekte 3 seri (Seri 1-3) var, fazlası silinmeli; tür Grafik Tasarımı → Grafik Türünü Değiştir ile değişir | ORTA |
| Not Sayfası'nda "◀ Önceki / Sonraki ▶" düğmeleri | Sayfalar kaydırılarak gezilir | DÜŞÜK |
| Asıl Slayt şeridinde Logo, Başlık rengi, Alt bilgi kutusu | Bu düğmeler yok; ayrıntı Y6'da | YÜKSEK (Y6) |
| Animasyonlar'da nesne seçmeden efekt verilebiliyor | Galeri gridir | YÜKSEK (Y3) |
| Yazdırma: önce düzen penceresi, sonra yazıcı | Tek Yazdır ekranı (Backstage): solda ayarlar, sağda önizleme | DÜŞÜK |
| Ses tüm gösteri boyunca çalıyor | Varsayılan olarak yalnızca o slaytta; Arka Planda Yürüt gerekir | YÜKSEK (Y7) |
| Köprü Ekle'de adres seçili yazıdan kendiliğinden doluyor (`sunu5.js:264`) | Bkz. 6. bölüm | - |

Doğru olanlar (kontrol edildi): F5, Shift + F5, Esc, B/W, rakam + Enter, Home/End, gösteride Ctrl + P (kalem), Ctrl + A (ok), E (silme), sağ tık → İşaretçi Seçenekleri → Kalem / Vurgulayıcı / Slayttaki Tüm Mürekkebi Sil, Zamanlamaları Prova Et ve Slayt Sıralayıcı'da süreler. Ctrl + K, "Köprü Ekle", "Var Olan Dosya veya Web Sayfası" ve "Bu Belgeye Yerleştir" doğru. Üst Bilgi ve Alt Bilgi penceresi (Tarih ve saat, Otomatik olarak güncelleştir, Slayt numarası, Alt bilgi, Başlık slaytında gösterme, Tümüne Uygula) doğru. Animasyon Ekle, Animasyon Bölmesi, Önceye/Sonraya Taşı, Süre/Gecikme (çeyrek saniye adımı) ve Not Sayfası / Okuma Görünümü da doğru. Tabloda Tab tuşu ve son hücrede yeni satır açılması doğru. Şekil Biçimi → Şekil Dolgusu doğru. Kaydetmeden kapatırken çıkan Kaydet / Kaydetme / İptal sorusu doğru.

---

## 5) Eklenebilecekler (öncelik sırasıyla)

1. **"Gerçek PowerPoint'te" notları (her derste 1-2 cümle, adım değil)**. Y1-Y9'un çoğunu kod değiştirmeden kapatır. Word derslerindeki biçim kullanılabilir: "Bu bilgisayardaki programda X yazıyor; gerçek PowerPoint'te yol şöyle: …". Kısa sürede en çok fayda sağlayacak iş bu.
2. **Tüm slaytlara geçiş ve süre: Tümüne Uygula (adım)**. Konumu `sunu` adım 8'in sonu ya da parkur 6. görev. Benzetimde Geçişler'e "Tümüne Uygula" düğmesi eklenmeli (geçişi ve süreyi birlikte uygular). Sınavda en sık istenen işlerden biri.
3. **Slayt arka planı ve yazı rengi (adım ya da kısa ders, 20 dakika)**. İçerik: Tasarım → Arka Planı Biçimlendir (düz renk, resimle doldurma), başlığı ortalama, yazı rengi. Davetiye ve duyuru sunusu yapan kursiyerin en çok sorduğu iş.
4. **Resmi kırpma ve fotoğraf düzeni (adım)**. Konumu `ani-albumu` ya da `sunu`. İçerik: köşeden büyütme, Resim Biçimi → Kırp, resmi arkaya gönderme. Kursiyerin gerçek işi aile fotoğraflarıyla çalışmak.
5. **PowerPoint Gösterisi (.ppsx) olarak kaydetme (adım)**. Konumu `ani-albumu`, PDF ile video arasında. Çift tıklayınca doğrudan gösteri olarak açılan dosya; torunlara ve derneğe göndermek için kullanışlı. Benzetimde Farklı Kaydet'e kayıt türü listesi gerekir.
6. **Küçük resim sağ tık menüsü ve slayt silme/gizleme uygulaması (adım)**. Konumu `slayt-duzen` adım 9. Şu an yalnızca bilgi kutusu var; öğrenci bunu uygulamalı yapmalı.

---

## 6) Emin olunmayanlar

Aşağıdakiler gerçek Türkçe PowerPoint'ten gözle doğrulanmalı. Burada uydurulmadı, yalnızca olası adlar yazıldı.

- **EMİN DEĞİLİM**: Fade geçişinin adı "Soldurma" mı? Appear ve Fade animasyonları "Görünme" ve "Soldurma" mı? Fly In "Uçarak Gelme" mi? Spin "Döndürme" mi? Disappear "Kaybolma" mı? Pulse "Darbe" mi? (O3)
- **EMİN DEĞİLİM**: Mürekkep penceresinin düğmeleri "Sakla / At" mı, "Koru / At" mı? (`sunu5.js:130`, `sunu5.js:137`, `slides.js:610`; görev tanımında da bilinen belirsizlik olarak geçiyor.)
- **EMİN DEĞİLİM**: PDF ve video düğmelerinin tam adları: "PDF/XPS Belgesi Oluştur" ve "Video Oluştur" (Dışarı Aktar altında). Word derslerinde "PDF/XPS Oluştur" yazıyor; iki ders aynı adı kullanmalı.
- **EMİN DEĞİLİM**: Ses ekleme menüsü "Bilgisayarımdaki Ses…" mi, "Bu Bilgisayardaki Ses" mi? Arka plan seçeneği "Arka Planda Yürüt" mü?
- **EMİN DEĞİLİM**: SmartArt kategori adları ("İşlem" mi, "Süreç" mi; "Hiyerarşi") ve "SmartArt'a Dönüştür", "Metne Dönüştür" düğme adları.
- **EMİN DEĞİLİM**: Eylem düğmesinin Türkçe adı ("Giriş" mi, "Ana Sayfa" mı); Slayt Gösterisi sekmesindeki "Baştan Başla" ve "Geçerli Slayttan" düğmelerinin tam yazımı.
- **EMİN DEĞİLİM**: Ctrl + K penceresinde, seçili yazı web adresine benziyorsa "Adres" kutusunun kendiliğinden dolup dolmadığı (`sunu5.js:264`). Dolmuyorsa adım "adres kutusuna e-yaygin.meb.gov.tr yazın" olmalı (ipucunda zaten var).
- **EMİN DEĞİLİM**: Normal görünümde Ctrl + ↑ / Ctrl + ↓ ile slaydın yukarı/aşağı taşınıp taşınmadığı. Doğruysa ▲ / ▼ düğmelerinin yerine kısayol olarak öğretilebilir.
- **Büyük olasılıkla doğru, yine de denenmeli**: Asıl slayttaki alt bilgi yazısının, Üst Bilgi ve Alt Bilgi'de "Alt bilgi" işaretlenmeden slaytlarda görünmemesi (Y6).
