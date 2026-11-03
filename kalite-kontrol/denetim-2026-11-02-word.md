# 10. hafta Kelime İşlemci (Word) denetimi: 2 Kasım 2026

**Özet**
- Genel durum iyi. 22 dersin çoğu doğru sırayla gidiyor, dili sade, "Gerçek Word'de…" notları çoğu yerde var. 15 ve 30 Ekim raporlarındaki Word bulgularının hemen hepsi kapatılmış.
- En büyük sorunlar dört yerde. (1) Yazdırma ekranından "İptal" ya da "✕" ile çıkma talimatı. (2) Satır aralığı düğmesinin "1,15 yazan kutu" diye anlatılması. (3) Tasarım sekmesinin hiç olmaması. (4) Değişiklikleri İzle'nin gerçek Word'de başka görünmesi. Kursiyer bu dört yerde gerçek Word'de şaşırır.
- MEB açısından eksikler şunlar: yazı tipi adını değiştirme, Paragraf penceresi (ilk satır girintisi, önce/sonra aralığı), özel kenar boşlukları, tablo biçimleme (tablo stilleri) ve Word'ün kendi yazdırma ayarları. MEB uygulama sınavında bu işler sık istenir.
- Bulgu sayısı: **YÜKSEK 4 · ORTA 20 · DÜŞÜK 11**. "Emin değilim" diye işaretlenenler 6. bölümde ayrıca toplandı.
- Kısayollar Microsoft'un Türkçe destek sayfasıyla karşılaştırıldı (Ctrl+B/I/U, Ctrl+E/L/R/J, Ctrl+K, Ctrl+H, Ctrl+Enter, Alt+Ctrl+F, Ctrl+Shift+E, F7). Hepsi doğru.

Kaynak: https://support.microsoft.com/tr-tr/Accessibility/word/keyboard-shortcuts-in-word

---

## 1) Doğruluk hataları (gerçek Word'de öğrenciyi yanıltan)

### Y1. YÜKSEK: Yazdırma önizlemesinden "İptal" ya da "✕" ile çıkmak
- Yer: `kelime2.js:168`, `kelime2.js:188`, `kelime2.js:194` (sayfa-duzeni). `kelime8.js:113` (kelime-ilan). Ayrıca `kelime2.js:33`, `:88`, `:96` (apartman-duyuru: "altında tek kâğıda sığıyor yazar").
- Sorun: Gerçek Word'de Ctrl + P ayrı bir pencere açmaz. Belgenin yerine **Yazdır** ekranı (Dosya menüsü) gelir ve orada **İptal düğmesi yoktur**. Kelime-ilan'daki "✕ ile kapatabilirsiniz" ise tehlikeli: sağ üstteki ✕ **Word'ün kendisini kapatır**. Önizlemenin altında "tek kâğıda sığıyor" diye bir yazı da yoktur. Gerçek Word'de altta yalnızca "◀ 1 / 2 ▶" sayfa sayacı görünür.
- Öneri: Bu adımlara şu satır eklensin: "Gerçek Word'de yazdırma ekranı belgenin yerine açılır. Belgeye dönmek için sol üstteki **← (geri ok)** düğmesine ya da **Esc**'ye basın. Sağ üstteki ✕'e basmayın, Word kapanır. Kaç sayfa olduğunu önizlemenin altındaki **1 / 2** yazısından okursunuz." kelime8.js:113'teki "ya da ✕ ile" sözü silinsin.

### Y2. YÜKSEK: Satır aralığı "üzerinde 1,15 yazan kutu" diye anlatılıyor
- Yer: `ileri2.js:532`, `ileri2.js:535` (kelime-harf). `kelime3.js:195`, `kelime3.js:197` (bicim-boyacisi). Benzetimde `word.js:81` (açılır kutu). Ayrıca `kelime6.js:58` ("satır aralığı kutusunun sağındaki").
- Sorun: Gerçek Word'de bu bir kutu değil, **simgeli bir düğmedir**: **Satır ve Paragraf Aralığı** (yukarı-aşağı oklu çizgiler). Üzerinde sayı yazmaz. Yeri de girinti düğmelerinin yanı değildir. Paragraf bölümünün **alt satırında, İki Yana Yasla düğmesinin hemen sağındadır**. Kursiyer "1,15 yazan kutu" arar ve bulamaz.
- Öneri (metin): "Giriş sekmesinde, dört hizalama düğmesinin hemen sağındaki **Satır ve Paragraf Aralığı** düğmesine (yukarı-aşağı oklu çizgiler) tıklayın. Açılan listeden **1,5**'i seçin." Benzetimde `wd-lh` açılır kutusu da simgeli bir düğme ve liste olarak yapılsın. Sırası da hizalama düğmelerinin arkasına alınsın.

### Y3. YÜKSEK: "Düzen sekmesi Ekle'nin hemen sağındadır" yanlış; benzetimde Tasarım sekmesi yok
- Yer: `kelime2.js:177` (sayfa-duzeni ipucu). Benzetimde `word.js:68` (sekme dizisi) ve `word.js:107-108` (Sayfa kenarlığı ve Filigran Düzen sekmesinde).
- Sorun: Word 2013 ve sonrasında sıra şöyledir: Dosya, Giriş, Ekle, (Çizim), **Tasarım**, **Düzen**, Başvurular… Yani Ekle ile Düzen arasında Tasarım vardır. Filigran ve Sayfa Kenarlıkları da Tasarım'dadır. Derslerde "Gerçek Word'de Tasarım sekmesindedir" notu var (`kelime2.js:81`, `:207`), ama öğrenci elle Düzen'de tıklıyor. 30 Ekim raporundaki 10. madde bu yüzden yarım kaldı.
- Öneri: Benzetime **Tasarım** sekmesi eklensin. Sayfa Arka Planı grubunda Filigran, Sayfa Rengi ve Sayfa Kenarlıkları olsun. İki ders adımı da "Tasarım → …" olarak düzeltilsin. Bunu yapmak kısa sürer ve üç yeri birden çözer. O zamana kadar kelime2.js:177 şöyle değişsin: "Düzen sekmesi üstte, Ekle ve Tasarım sekmelerinden sonra gelir."

### Y4. YÜKSEK (gerçek Word'de bir kez bakın): Değişiklikleri İzle gerçek Word'de "Basit İşaretleme" ile başlar
- Yer: `kelime7.js:42` (özet), `kelime7.js:56`, `kelime7.js:77` ("100 üstü çizildi, 150 altı çizili renkli eklendi"). `kelime7.js:62` ve `kelime7.js:146` (alttaki çubukta "Değişiklikleri İzle: Açık" yazar).
- Sorun: Word 2013'ten beri izlemenin varsayılan görünümü **Basit İşaretleme**dir. Bu görünümde üstü çizili ya da altı çizili yazı görünmez. Belge düzeltilmiş hâliyle durur, yalnızca satırın solunda kırmızı bir çizgi çıkar. Kursiyer "izleme çalışmıyor" sanar. Alttaki durum çubuğundaki "Değişiklikleri İzle: Açık" yazısı da varsayılan olarak kapalıdır, bu yüzden 6. bölümde ayrıca işaretli. Gerçek Word'de bunun yerine **Değişiklikleri İzle düğmesinin renkli kalmasına** bakılır.
- Öneri (adım 2'ye not): "Gerçek Word'de değişiklikler görünmüyorsa Gözden Geçir sekmesindeki **Basit İşaretleme** kutusunu **Tüm İşaretlemeler** yapın. O zaman silinen yazı üstü çizili, eklenen yazı renkli görünür." Adım 2 ve 10'daki "alttaki çubukta yazar" cümlesi şöyle değişsin: "Düğme renkli (basılı) kalır."

---

## 2) MEB eksikleri (Kelime İşlemci modülü)

MEB eşleştirmesindeki (MEB-ESLESTIRME.md:41) başlıkların hepsine en az bir adımda değiniliyor. Ama uygulama sınavında ölçülerle istenen işlerin bir kısmını öğrenci sitede hiç yapmıyor:

| MEB sınavında istenen | Sitede durum |
|---|---|
| Yazı tipi, boyut, hizalama | Boyut ve hizalama var. **Yazı tipi adı değiştirme hiç yok** |
| Satır aralığı | Var (1,5) |
| İlk satır girintisi, paragraf önce/sonra aralığı | **Yok.** Paragraf başı Tab ile öğretiliyor |
| Kenar boşluğu (ör. üst 2,5, sol 3 cm) | Yalnızca hazır Normal/Dar/Geniş. **Özel kenar boşluğu yok** |
| Tablo ekleme ve biçimleme | Ekleme, satır/sütun, birleştirme var. **Tablo stili, hücre gölgelendirme, sütun genişliği yok** |
| Sayfa numarası | Var. Galeri ve konum seçimi yok (bkz. O5) |
| PDF olarak kaydetme | Var. Benzetimde yol farklı, notla anlatılıyor |
| Yazdırma ayarları | **Kopya sayısı, sayfa aralığı, Word yazdırma ekranı yok** |

### M1. ORTA: Yazı tipi adını değiştirmek hiç uygulanmıyor; italik ve altı çizili yalnızca özette
- Yer: Benzetimde yazı tipi kutusu var (`word.js:72`, Times New Roman ve Arial dahil). Ama hiçbir ders adımı onu kullanmıyor. İtalik ve altı çizili yalnızca `kelime.js:21` özetinde geçiyor.
- Öneri: `dilekce` adım 6'dan sonra yeni bir adım: "Bütün belgeyi seçin (Ctrl + A). Giriş sekmesinde yazı tipi adının yazdığı kutuya (Calibri ya da Aptos yazar) tıklayın, **Times New Roman**'ı seçin. Resmî yazılarda bu yazı tipi çok istenir." İtalik ve altı çizili için `apartman-duyuru`'ya kısa bir adım eklensin.

### M2. ORTA: Paragraf penceresi yok (ilk satır girintisi, önce/sonra aralığı)
- Yer: `kelime3.js` bicim-boyacisi adım 5 ("Paragraf başı: Tab").
- Sorun: MEB sınavında sık istenen "ilk satır girintisi 1,25 cm" ve "paragraftan sonra 6 nk" işleri Paragraf penceresinden yapılır. Tab ile girinti gerçek Word'de de çalışır, ama ölçü vermez. Benzetimde bu pencere yok. Sekmeler… penceresinin gerçek yolu (Paragraf bölümünün köşesindeki ok) zaten anlatılıyor.
- Öneri: Benzetime küçük bir **Paragraf** penceresi eklensin: Girinti Sol/Sağ, Özel: İlk satır (cm), Aralık Önce/Sonra (nk), Satır aralığı. bicim-boyacisi adım 5 şöyle değişsin: "Paragrafa tıklayın → Giriş → Paragraf bölümünün sağ altındaki küçük ok → Özel: **İlk satır**, Ölçü: **1,25 cm** → Tamam." Tab yolu ipucuna alınsın.

### M3. ORTA: Özel kenar boşlukları ve kâğıt boyutu yok
- Yer: `word.js:39` ve `word.js:104` (yalnızca Normal/Dar/Geniş). Ders adımları: `kelime2.js:176`, `kelime.js:305`.
- Öneri: Düzen → Kenar Boşlukları listesinin sonuna **Özel Kenar Boşlukları…** eklensin (Üst, Alt, Sol, Sağ cm), ayrıca **Boyut: A4 / A5**. sayfa-duzeni'ye bir adım: "Üst 2,5 cm, sol 3 cm yapın." Gerçek Word'deki adı: Düzen → Kenar Boşlukları → Özel Kenar Boşlukları… (Sayfa Yapısı penceresi).

### M4. ORTA: Tablo biçimleme yüzeysel
- Yer: `tablo-ince` (kelime2.js:241 ve sonrası). Yalnızca "Çizgiler → Kalın" var.
- Sorun: Gerçek Word'de tablonun görünüşü **Tablo Tasarımı** sekmesinden değiştirilir: Tablo Stilleri, Gölgelendirme, Kenarlıklar, Kalem Kalınlığı. Sütun genişliği için çizgiyi sürüklemek ya da **Otomatik Sığdır** kullanılır. Başlık satırını renklendirmek MEB'de ve günlük işte sık istenir.
- Öneri: tablo-ince'ye iki adım eklensin: "Başlık satırını seçin → Tablo Tasarımı → Gölgelendirme → açık gri" ve "Tablo Tasarımı → Tablo Stilleri'nden birini seçin". Benzetime Tablo Tasarımı sekmesi ya da en azından hücre gölgelendirmesi eklensin.

### M5. ORTA: Word'ün yazdırma ayarları öğretilmiyor
- Yer: `dilekce` adım 13, `apartman-duyuru` adım 8–9, `sayfa-duzeni` adım 2 ve 4. Benzetim genel bir yazdır penceresi açıyor (`word.js:409`).
- Sorun: Gerçek Word'ün Yazdır ekranında **Kopya** sayısı, **Tüm Sayfaları Yazdır / Özel Yazdırma (sayfalar: 1-2)**, **Tek Taraflı Yazdır**, kâğıt boyutu ve **Sayfa başına 1 sayfa** vardır. PDF'te sayfa aralığı 13. haftada var, Word'de yok.
- Öneri: apartman-duyuru'ya bir adım: "Kopya kutusuna 3 yazın: üç kat için üç duyuru." sayfa-duzeni'ye de bir adım: "Yalnızca 2. sayfayı yazdırın: Sayfalar kutusuna 2 yazın." Y1'deki "← geri ok" bilgisi de buraya bağlanır.

### M6. ORTA: Ödev ve parkurda MEB sınavına benzeyen ölçülü görev yok
- Yer: `odevler.js:123-134` (odev10), `kelime2.js:391` (dilekce-parkur).
- Sorun: Görevler "ortalayın, kalın yapın" düzeyinde. MEB sınavı ölçü verir: "Times New Roman 12, satır aralığı 1,5, ilk satır girintisi 1,25 cm, kenar boşlukları…, sayfa numarası alt orta, PDF".
- Öneri: odev10'a bir görev eklensin: "Bir sayfalık yazıyı şu ölçülere getirin: Times New Roman 12, iki yana yasla, 1,5 satır aralığı, ilk satır girintisi 1,25 cm, kenar boşlukları 2,5 cm, alta ortada sayfa numarası. PDF olarak kaydedin." (5. bölüm 1. öneriye bakın.)

### M7. DÜŞÜK: Değinilmeyen öteki MEB alt konuları
- Bölüm sonu (sayfa numarasını 2. sayfadan başlatmak, "İlk sayfada farklı"), sonnot, Büyük Harf (Ekle → Büyük Harf, gazete başlangıcı), çok düzeyli liste ve madde işaretinin simgesini değiştirmek. Ayrıca Word'de SmartArt ve grafik, zarf/etiket, eş anlamlılar, Otomatik Düzelt, eski biçimde kaydetme (.doc, Word 97-2003) ve görünümler (Okuma Modu, Web Düzeni) eksik.
- Öneri: Hepsine ders gerekmez. Büyük Harf ve "ilk sayfada farklı sayfa numarası" adım olarak eklenebilir. Ötekiler özet tablolarında birer satır olabilir.

### M8. DÜŞÜK: test10 kapsamı
- Yer: `testler.js:644-666`.
- Sorun: Değişiklikleri İzle/Kabul Et, parola, adres mektup birleştirme, metin kutusu/WordArt, üst/alt bilgi ve PDF için soru yok. Bu konular derste var.
- Öneri: 3–4 soru eklensin, ör. "Başkasının belgede yaptığı düzeltmeyi onaylamak için: Gözden Geçir → Kabul Et."

---

## 3) Anlaşılırlık

### A1. ORTA: kelime-izle tek derste iki büyük konu, 16 adım
- Yer: `kelime7.js` (40 dk). İzleme ve açıklama 10 adım, parola 5 adım.
- Öneri: Parola kısmı ayrı bir 15 dakikalık ders olsun ("Belgeyi parolayla korumak"). İleri yaştaki kursiyer 16 adımda yorulur, sonundaki parola kısmı aceleye gelir.

### A2. DÜŞÜK: belge-duzen adım 4 bir adımda beş iş istiyor
- Yer: `kelime.js:277` (Ctrl + H, iki kutuyu doldurma, Tümünü değiştir, kutuyu kapatma).
- Öneri: İkiye bölünsün: "Bul ve Değiştir'i açın, iki kutuyu doldurun" ve "Tümünü değiştir'e basın, sonra ✕ ile kapatın."

### A3. DÜŞÜK: "Üç tık bütün satırı seçer" sözü
- Yer: `kelime.js:57`, `programlar2.js:228`.
- Sorun: Üç tık **paragrafı** seçer. Tek satırlık başlıkta fark yok, uzun paragrafta kursiyer "satır" bekler. Özet (`kelime.js:26`) zaten doğru: "Bütün paragrafı seçer".
- Öneri: "…üç kez tıklayın: bütün paragraf (başlıkta bütün satır) seçilir."

### A4. DÜŞÜK: Delete tuşunun yeri
- Yer: `kelime7.js:84` ("Backspace'in altındadır").
- Sorun: Masaüstü klavyelerde Delete, Enter'ın sağındaki altılı tuş grubundadır (Insert'in altında). Dizüstünde sağ üst köşededir. "Backspace'in altında" ifadesi çoğu klavyede yanlış.
- Öneri: "Delete (Del) tuşu: masaüstü klavyede Enter'ın sağındaki küçük tuş grubunda, dizüstünde sağ üst köşede."

### A5. DÜŞÜK: Kenarlık ve Gölgelendirme düğmelerinin sırası
- Yer: `kelime6.js:58`, `kelime6.js:66` ("Kenarlık düğmesi gölgelendirmenin solundadır").
- Sorun: Gerçek Word'de sıra tersidir: önce **Gölgelendirme** (boya kovası), sağında **Kenarlıklar**. Benzetim de ters sırada (`word.js:87-88`).
- Öneri: Benzetimdeki sıra çevrilsin, ipucu da "Kenarlık düğmesi boya kovasının hemen sağındadır" olsun.

### A6. DÜŞÜK: "Sekme durağı" ve "öncü" terimleri adımda açıklanmıyor
- Yer: `kelime6.js:103-106`.
- Öneri: Adıma bir cümle eklensin: "**Sekme durağı**: Tab'a basınca imlecin gideceği yer. **Öncü**: o boşluğu dolduran noktalar."

### A7. DÜŞÜK: Köprü ve Tablo pencerelerinde düğme adı "Ekle"
- Yer: `kelime4.js` köprü adımı ("Ekle'ye basın"), `kelime.js:183` ("Ekle deyin").
- Sorun: Gerçek Word'de Köprü Ekle ve Tablo Ekle pencerelerinin düğmesi **Tamam**'dır.
- Öneri: Benzetimdeki düğme ve metin "Tamam" olsun.

### A8. DÜŞÜK: Bul ve Değiştir kutu adı
- Yer: `kelime.js:277`, `word.js:143` ("Yeni").
- Sorun: Gerçek Word'de bu kutunun adı **Yeni değer**dir.
- Öneri: "Yeni" yerine "Yeni değer" yazılsın.

### A9. DÜŞÜK: Hücre içi hizalama adı
- Yer: `kelime2.js:250`, `kelime2.js:301`.
- Sorun: Gerçek Word'de bu iş için **Hizalama** grubunda dokuz küçük düğme vardır. "Hücre içi → Orta" diye bir başlık yoktur.
- Öneri: Adıma şu not eklensin: "Gerçek Word'de Düzen sekmesinin Hizalama grubundaki dokuz küçük düğmeden ortadakine basılır."

---

## 4) Benzetimin gerçek Word'den farkları

Hepsi **ORTA**. Öğrenci gerçek Word'de ilk karşılaştığında takılır. Her birine bir "Gerçek Word'de…" cümlesi yeter, benzetimi değiştirmek şart değil.

| # | Yer | Benzetimde | Gerçek Word'de | Önerilen not |
|---|---|---|---|---|
| O1 | `kelime2.js:344-345` simge-sekil, `word.js:95` | Ekle → Ω Simge → ₺, °, ½ hazır | Simge düğmesi yalnızca son kullanılan ~20 işareti gösterir; ₺, ° ve ½ çoğu zaman yoktur. **Diğer Simgeler…** penceresinden aranır. | "Listede yoksa **Diğer Simgeler…**'e basın. ₺ için kısayol: **AltGr + T**." |
| O2 | `kelime.js:106`, dilekce-parkur | Ekle → 📅 Tarih, tarihi hemen yazar | **Ekle → Tarih ve Saat**: biçim seçilen bir pencere açılır, sonra Tamam | "Gerçek Word'de düğmenin adı Tarih ve Saat'tir; açılan listeden bir biçim seçip Tamam deyin." |
| O3 | `kelime.js:208`, `kelime3.js:37` | Ekle → 🖼 Resim | Microsoft 365'te **Ekle → Resimler → Bu Cihaz…**; Word 2016'da **Ekle → Resimler** | "Gerçek Word'de: Ekle → Resimler → Bu Cihaz…" |
| O4 | `kelime.js:183`, `word.js:93` | Satır ve sütun sayısı kutusu, Ekle | Kare ızgara açılır; fareyle 3×3 karenin üzerine gelip tıklanır (önce sütun, sonra satır yazar). Ya da **Tablo Ekle…** penceresi: Sütun sayısı, Satır sayısı, Tamam | "Açılan küçük karelerde fareyle 3 sütun × 3 satır seçip tıklayın." |
| O5 | `kelime4.js:40-56`, `programlar2.js:254-256` | Üst bilgi, Alt bilgi ve Sayfa numarası düğmesine basınca hemen eklenir | Her biri bir galeri açar: Üst Bilgi → **Boş**; Sayfa Numarası → **Sayfanın Altı → Düz Numara 2**. Üst bilgiden çıkmak için **Üst Bilgi ve Alt Bilgiyi Kapat** (ya da sayfanın ortasına çift tık) | Bu üç adıma birer not ve "üst bilgiden nasıl çıkılır" cümlesi eklensin. Kursiyer en çok üst bilgiden çıkamayınca takılır. |
| O6 | `kelime2.js:363-376` | Ekle → ◇ Şekil → Ok; içinde "Yazınız" yazar | **Ekle → Şekiller**: şekil seçilir, sonra sayfada **fareyle sürüklenerek çizilir**. İçinde yazı yoktur; şekil seçiliyken doğrudan yazılır (ya da sağ tık → **Metin Ekle**) | "Gerçek Word'de şekli fareyle sürükleyerek çizersiniz. Yazmak için şekle bir kez tıklayıp yazmaya başlayın." |
| O7 | `kelime2.js:244-301`, `word.js:132-137` | Tek "Tablo Düzeni" sekmesi; "✕ Satırı sil" ayrı düğme; "Çizgiler: Kalın" | İki sekme vardır: **Tablo Tasarımı** ve **Düzen** (adlar için 6. bölüme bakın). Silmek için **Sil ▾ → Satırları Sil**. Kalın çizgi Tablo Tasarımı'ndan: **Kalem Kalınlığı** + **Kenarlıklar → Tüm Kenarlıklar** | tablo-ince adım 5 ve 7'ye notlar. |
| O8 | `ileri2.js:172` (mektup) | Alıcıları seç… → dosya açılır | **Alıcıları Seç ▾ → Var Olan Listeyi Kullan…** → dosya → **Tablo Seç** penceresi (Sayfa1$, "İlk satır sütun başlıklarını içerir" işaretli) → Tamam | "Gerçek Word'de: Alıcıları Seç → Var Olan Listeyi Kullan…, dosyayı açın, çıkan Tablo Seç penceresinde Tamam." |
| O9 | `kelime.js:288-290` | Gözden Geçir → "ABC✓ Yazım denetimi" düğmesi, açılan kutuda Değiştir | Word 2016'da düğmenin adı **Yazım ve Dilbilgisi**dir. Microsoft 365'te F7 sağda **Düzenleyici** bölmesini açar, öneriye tıklanarak düzeltilir | "Gerçek Word'de düğmenin adı Yazım ve Dilbilgisi'dir. F7'ye basınca sağda bir bölme açılır." |
| O10 | `programlar2.js:240` (ozgecmis) | Ctrl + F → kutu → "Sonrakini bul" | Ctrl + F solda **Gezinti** bölmesini açar. Bulunanlar sarı boyanır, ▲ ▼ oklarıyla gezilir; "Sonrakini bul" düğmesi yoktur | "Gerçek Word'de solda bir arama kutusu açılır. Bulunanlar sarı görünür; aşağı okla (▼) sıradakine geçin." |
| O11 | `kelime8.js:27`, `kelime8.js:96` | Metin Kutusu ▾ → "Sağa yaslı kutu" | Galeride böyle bir ad yoktur (Basit Metin Kutusu, kenar çubukları ve benzerleri vardır). Yazının yanında durması için kutu eklenir, sonra **Düzen Seçenekleri → Kare** seçilip sürüklenir. | "Gerçek Word'de Basit Metin Kutusu'nu ekleyip Düzen Seçenekleri'nden Kare'yi seçin, sonra kutuyu paragrafın sağına sürükleyin." |
| O12 | `kelime.js:75`, `kelime2.js:60`, `ileri2.js:532` | Yazı boyutu kutusunda 11, satır aralığı 1,15 | Word 2016–2021'de Calibri 11. Güncel Microsoft 365'te varsayılan yazı tipi **Aptos**, boyutu büyük olasılıkla 12 (6. bölüm) | "…boyut kutusuna (11 ya da 12 yazar) tıklayın." Sayıya bağlı talimat verilmesin. |
| O13 | `kelime7.js:92` (Yeni Açıklama) | Balona yazınca açıklama kaydolur | Microsoft 365'teki yeni açıklamalarda yazıdan sonra **Gönder (➤)** düğmesine ya da Ctrl + Enter'a basmak gerekir; basılmazsa açıklama taslak kalır (6. bölüm) | "Gerçek Word'de yazınca balonun altındaki ➤ Gönder'e basın." |

Benzetimde DÜŞÜK düzeyde başka farklar da var. Alt bilgideki sayfa numarası her sayfada "Sayfa 1 / N" gösteriyor (`word.js:193`). Ortak yazdır penceresi Word'ün Yazdır ekranına benzemiyor (Y1 ve M5'e bağlı).

---

## 5) Eklenebilecekler (öncelik sırasıyla)

1. **"MEB sınav provası" Word parkuru (yeni parkur, 30 dk).** Ölçüsü verilmiş bir yazı. Times New Roman 12, başlık 14 kalın ortalı, iki yana yasla, 1,5 satır aralığı, ilk satır girintisi 1,25 cm, özel kenar boşlukları. Ayrıca 3×4 tablo (başlık satırı gölgeli), alta ortada sayfa numarası ve PDF. Bunun için benzetime yazı tipi kutusunun kullanımı (zaten var), Paragraf penceresi ve Özel Kenar Boşlukları gerekir (M1–M3). Kursiyerin sınavda en çok yapacağı iş tam olarak budur.
2. **Word'ün gerçek Yazdır ekranı (adım, apartman-duyuru ve sayfa-duzeni'ye).** ← geri okla çıkma, Kopya sayısı, yalnızca 2. sayfayı yazdırma, tek taraflı yazdırma. Y1 ve M5'i birlikte kapatır. Günlük hayatta da en çok burada takılınır.
3. **Tasarım sekmesi (benzetim değişikliği).** Filigran, Sayfa Kenarlıkları ve Sayfa Rengi buraya taşınsın. Y3'ü ve iki "Gerçek Word'de…" notunu ortadan kaldırır.
4. **Tablo biçimleme (tablo-ince'ye 2–3 adım).** Tablo Tasarımı → Tablo Stilleri, başlık satırına gölgelendirme, sütun genişliğini çizgiyi sürükleyerek ayarlama. Aidat ve nöbet çizelgesi kursiyerin gerçekten yaptığı iştir.
5. **Gelen Word dosyasını açıp düzenlemek (adım ya da kısa ders).** E-postadan inen .docx, **Korumalı Görünüm → Düzenlemeyi Etkinleştir**, eski .doc dosyasında "Uyumluluk Modu", kendi kopyasını **Farklı Kaydet** ile saklamak. Korumalı Görünüm şu an yalnızca e-posta derslerinde bilgi olarak geçiyor.
6. **Dikte: sesle yazma (bilgi adımı, düşük öncelik).** Microsoft 365'te Giriş → **Dikte**. Klavyede yavaş olan ileri yaştaki kursiyer için çok işe yarar. Mikrofon ve Microsoft 365 gerekir; sınıfta uygulanamıyorsa yalnızca bilgi olarak verilsin.

---

## 6) Emin olunmayanlar (gerçek Türkçe Word'de bir kez gözle bakılmalı)

- **Tablo bağlam sekmelerinin adları**: Word 2016'da "Tablo Araçları: **Tasarım** / **Düzen**". Microsoft 365'te büyük olasılıkla "**Tablo Tasarımı** / **Düzen**". Benzetimdeki "Tablo Düzeni" adı gerçek sürümde olmayabilir. EMİN DEĞİLİM.
- **Postalar sekmesindeki son düğme**: Benzetimde "Bitir ve birleştir". Türkçe Word'de "**Son ve Birleştir**" olduğunu düşünüyorum. EMİN DEĞİLİM.
- **Durum çubuğunda "Değişiklikleri İzle: Açık"**: Varsayılan olarak kapalı olduğunu düşünüyorum (durum çubuğuna sağ tıklanıp açılır). Basit İşaretleme bilgisine (Y4) güvenim daha yüksek. EMİN DEĞİLİM.
- **Resim tutamaçları**: Word 2013 ve sonrasında kenar ortasındaki tutamaçların da yuvarlak olabileceğini düşünüyorum. `kelime3.js` word-resim adım 4'teki "kenarın ortasındaki küçük kare" sözü gerçek Word'de doğru olmayabilir. "Köşedeki tutamaç" demek yeterli ve güvenli. EMİN DEĞİLİM.
- **Kırpmayı Enter ile bitirmek** (`kelime3.js:98`): Gerçek Word'de kırpma, resmin dışına tıklayınca ya da Kırp'a yeniden basınca biter. Enter'ın da çalıştığından emin değilim. EMİN DEĞİLİM.
- **Microsoft 365'te varsayılan yazı tipi ve boyutu** (Aptos 12?) ve **Yeni Açıklama'da Gönder düğmesi** (O12, O13): Sürüme göre değişir. EMİN DEĞİLİM.
- **WordArt'ı Ctrl + E ile ortalamak** (`kelime8.js:61`): Gerçek Word'de WordArt yüzen bir kutudur. Ctrl + E kutunun içindeki yazıyı ortalar, kutuyu sayfada ortalamayabilir (bunun için Şekil Biçimi → Hizala → Ortala). EMİN DEĞİLİM.
- **₺ için AltGr + T**: Güncel Windows Türkçe Q klavyesinde çalışır. Eski klavye sürücülerinde çalışmayabilir.

---

### Önceki raporlardan durum
- 15 Ekim (`ders-inceleme-2026-10-15.md`): 10. hafta bulgularının hepsi kapatılmış görünüyor (Ctrl + A ipucu, Bul kutusu, ortalı satır ipuçları eklendi).
- 30 Ekim (`eksikler-hafta9-12.md`): Boş belge, OneDrive, Kaydet/Kaydetme/İptal, Otomatik Kurtarma, kırmızı çizgi, Yalnızca Metni Koru, PDF yolu, belge-gonder ve office-yoksa maddeleri **kapatılmış**. **Hâlâ yarım:** 10. madde (Tasarım sekmesi; yalnızca not eklendi, benzetimde hâlâ Düzen'de, bkz. Y3).
