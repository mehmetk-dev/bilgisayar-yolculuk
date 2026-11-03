# 11. hafta Hesap Tablosu (Excel) denetimi: 2 Kasım 2026

**Özet (5 satır)**
1. Hesaplarda yanlış sonuç yok. Bütün formül örnekleri tek tek hesaplandı ve ders metinleriyle tuttu (10.050, 363 ₺, 181,50, 1785,71, 21287, 2.310, 11.870 vb.). Türkçe işlev adları ve `;` ayırıcısı da doğru. Tek istisna `SAY`: Türkçe Excel'de bu işlev yok.
2. Dersler ile gerçek Excel arasında 6 yanıltıcı nokta var (YÜKSEK). Örnekler: ∑ düğmesinden sonra Enter'a basmak gerekiyor, Bölmeleri Çöz adımı anlatılmıyor, açılır liste seçenekleri `;` ile ayrılıyor, tablo fareyle seçilince `$` gelmiyor. Bunlara benzetimin `45.50` yazısını sayı sayması da ekleniyor.
3. MEB'e göre en büyük eksik hücre biçimlendirme: kenarlık, dolgu rengi, yazı tipi, hizalama ve Hücreleri Biçimlendir hiç yok, benzetimde düğmeleri de yok. Yüzde biçimi, “mutlak başvuru” terimi, çizgi grafiği, sayfalar arası başvuru ve sayfa yapısı (üst bilgi, başlık satırını her sayfada yazdırma) da eksik.
4. Anlaşılırlık genelde iyi. Asıl sorun, dersin “gerçek Excel'de bu nerede?” sorusunu çoğu yerde cevaplamaması. Koşullu Biçimlendirme, Veri Doğrulama, Bölmeleri Dondur, Sayfa Düzeni, Özet Tablo alan listesi ve Gözden Geçir → Sayfayı Koru için menü yolu yok. Kursiyer sınavda benzetimdeki düğmeleri arar.
5. `test11` sınavın en sık sorduğu konuları hiç sormuyor: `$`, EĞER, EĞERSAY/ETOPLA, sıralama, filtre, grafik ve koşullu biçimlendirme.

Kaynak: `src/dersler/lessons/hesap.js`, `excel2.js` … `excel7.js`, `programlar2.js` (butce), `odevler.js` (odev11), `testler.js` (test11), `src/dersler/apps/sheet.js`. Formül motoru Node ile ayrıca denendi: kaynağın scratchpad'deki bir kopyası kullanıldı, kaynak değişmedi.

---

## 1) Doğruluk hataları

### D1. ∑ Otomatik Toplam'dan sonra Enter gerekir: YÜKSEK
- Yer: `hesap.js:86` (adım “Otomatik toplam”), `excel2.js:347` (tablo-parkur ipucu), `odevler.js:138` (odev11 Görev 2); benzetim `sheet.js:966-981`.
- Sorun: Gerçek Excel'de ∑'ye basınca `=TOPLA(B2:B5)` formülü hücrede yazılı ama onaylanmamış olarak bekler. Enter'a basılmadan sonuç çıkmaz. Kursiyer bu sırada başka bir hücreye tıklarsa formüldeki aralık o hücreyle değişir ve toplam bozulur. Benzetim ise formülü hemen onaylıyor, bu yüzden kursiyer bunu hiç görmüyor.
- Düzeltme: Adıma 4. madde eklensin: “Formül hücrede görünür; doğruysa **Enter**'a basın.” Benzetimde ∑ de formülü düzenleme modunda bıraksın, Enter ile onaylansın.

### D2. “Dondurmayı aynı düğmeyle kaldırın” gerçek Excel'de yanlış: YÜKSEK
- Yer: `excel2.js:176-178` (adım “Dondurmayı kaldırın” ve done: “Düğme bir kapı gibi”), ayrıca `excel2.js:164`.
- Sorun: Gerçek Excel'de yol şöyle: **Görünüm → Bölmeleri Dondur → Üst Satırı Dondur**. Kaldırmak için yine **Görünüm → Bölmeleri Dondur → Bölmeleri Çöz** seçilir. Üst Satırı Dondur'a ikinci kez basmak dondurmayı kaldırmaz.
- Düzeltme: İpucu eklensin: “Gerçek Excel'de: Görünüm sekmesi → Bölmeleri Dondur → Üst Satırı Dondur. Kaldırmak için aynı menüden **Bölmeleri Çöz**.” “Düğme bir kapı gibi” cümlesi silinsin.

### D3. Tablo fareyle seçilince `$` gelmez: YÜKSEK
- Yer: `excel3.js:47`: “$ işaretlerini ve tablo adresini yazmakla uğraşmayın: fareyle seçerek de yazabilirsiniz.”
- Sorun: Gerçek Excel'de formül yazarken tablo fareyle seçilirse `F2:G7` gelir, `$` gelmez. Formül aşağı çekilince tablo kayar ve `#YOK` çıkar. Benzetimde ise formül yazarken hücreye tıklamak formülü yarım bırakıp onaylıyor (`sheet.js:1272`), sonuç `#DEĞER!` oluyor. İpucu iki ortamda da kursiyeri hataya götürüyor.
- Düzeltme: Yeni metin: “Tabloyu fareyle seçerseniz `$` işaretleri gelmez. Seçtikten hemen sonra **F4**'e basın; `$F$2:$G$7` olur. (Bu alıştırma ekranında formülü klavyeyle yazın.)”

### D4. Açılır liste seçenekleri Türkçe Excel'de `;` ile ayrılır: YÜKSEK (büyük olasılıkla, bir kez gerçek Excel'de denenmeli)
- Yer: `excel3.js:125`, `excel3.js:147-148` (“virgülle ayırarak”); benzetim `sheet.js:693` (iki ayırıcıyı da kabul ediyor).
- Sorun: Veri Doğrulama → Liste → **Kaynak** kutusu Windows'un liste ayırıcısını kullanır. Türkçe bölge ayarında bu `;`. “Ödendi, Ödenmedi, Kısmen” yazılırsa listede tek seçenek çıkar: “Ödendi, Ödenmedi, Kısmen”.
- Düzeltme: Derste “Ödendi;Ödenmedi;Kısmen” yazdırılsın. İpucu eklensin: “Gerçek Excel'de: Veri → **Veri Doğrulama** → İzin verilen: **Liste** → Kaynak: Ödendi;Ödenmedi;Kısmen → Tamam.” Benzetim de yalnızca `;` kabul etsin ya da virgül yazılınca uyarsın.

### D5. Türkçe Excel'de `SAY` işlevi yok: YÜKSEK
- Yer: `hesap.js:126` (done: “**SAY** (kaç sayı var)”); benzetim `sheet.js:158` (`SAY` → `BAĞ_DEĞ_SAY` takma adı).
- Sorun: Türkçe Excel'de sayı sayan işlevin adı **BAĞ_DEĞ_SAY**. `=SAY(...)` gerçek Excel'de `#AD?` verir. Benzetim bu adı kabul ettiği için hata görünmüyor.
- Düzeltme: “**BAĞ_DEĞ_SAY** (kaç sayı var; Tarihler dersinde)” yazılsın. `SAY` takma adı benzetimden kaldırılsın.

### D6. odev11 Görev 7: Özet Tablo birleştirilmiş başlık satırına takılır: YÜKSEK
- Yer: `odevler.js:143`, Görev 5'ten (`odevler.js:141`) sonra.
- Sorun: Görev 5 tablonun hemen üstüne birleştirilmiş “HAFTALIK HARCAMA” satırı koyduruyor. Görev 7 “tabloya tıklayıp Ekle → Özet Tablo” diyor. Excel bitişik bütün alanı alır: başlık satırını ve toplam satırını da. Başlık satırında sütun adı olmadığı için büyük olasılıkla “Özet Tablo alan adı geçerli değil” uyarısı çıkar. Çıkmazsa toplam satırı “(boş)” kategorisi olarak toplamı ikiye katlar. Kategori sütununun nereye ekleneceği de yazmıyor.
- Düzeltme: Görev 7 metni şöyle olsun: “Kategoriyi **C** sütununa yazın (C2'ye **Kategori**). Başlık satırından son harcamaya kadar (A2:C9) fareyle seçin; toplam satırını seçmeyin. Sonra **Ekle → Özet Tablo → Tamam**. Sağdaki listeden **Kategori** ve **Tutar** kutularını işaretleyin.”

### D7. Taşı veya Kopyala'da “Kopya oluştur” bir onay kutusudur: ORTA
- Yer: `excel2.js:224`, `testler.js:680`.
- Sorun: Gerçek pencerede **Kopya oluştur** bir onay kutusudur. Kutu işaretlenir, sonra **Tamam**'a basılır. Benzetimde bu bir düğme. Kursiyer gerçek Excel'de kutuyu işaretlemeden Tamam derse sayfa kopyalanmaz, yalnızca taşınır.
- Düzeltme: Adımda “**Kopya oluştur** kutusunu işaretleyip **Tamam**'a basın” denilsin; benzetim penceresi de buna uydurulsun.

### D8. Özet Tablo “yeniden oluşturulmaz”, yenilenir: ORTA
- Yer: `excel4.js:38` (özet satırı: “Ana liste değişirse özet tabloyu yeniden oluşturun”).
- Sorun: Gerçek Excel'de özet tabloya sağ tıklayıp **Yenile** denir. Her seferinde yeniden kurmak gerekmez.
- Düzeltme: “Ana liste değişirse özet tabloya sağ tıklayıp **Yenile** deyin (bu alıştırmada yeniden oluşturun).”

### D9. Hata açıklamasının yeri gerçek Excel'de farklı: ORTA
- Yer: `excel4.js:50` (“Formül çubuğunun altında hatanın ne demek olduğu yazar”).
- Sorun: Gerçek Excel'de hata açıklaması formül çubuğunun altında yazmaz. Hücrenin yanında sarı, ünlemli küçük bir simge çıkar; açıklama onun üzerine gelince ya da tıklayınca görünür.
- Düzeltme: Cümleye ek: “Gerçek Excel'de hücrenin yanında sarı **⚠** simgesi çıkar; fareyi üzerine getirince açıklama yazar.”

### D10. “büyüktür (<)” işareti ters yazılmış: DÜŞÜK
- Yer: `hesap.js:292`.
- Sorun: `<` küçüktür işaretidir. Türkçe Q klavyede `<` tuşu sol Shift'in yanındadır, Shift ile basınca `>` çıkar.
- Düzeltme: “`>` işareti: Z'nin solundaki **<** tuşuna Shift ile basın; sonra `=`.”

### D11. “Ocak'u” yanlış ek almış: DÜŞÜK
- Yer: `excel2.js:223` (başlık), `226`, `257`.
- Düzeltme: “Ocak'ı kopyalayın”, “Ocak'ın birebir kopyası”, “Ocak'ı kaybedersiniz”.

### D12. Küçük ifade hataları: DÜŞÜK
- `excel3.js:99`: “Aramayı unutursanız” yerine “**YANLIŞ**'ı yazmayı unutursanız” olmalı.
- `excel3.js:53`: “YANLIŞ yazı değil, bir sözcüktür” anlaşılmıyor. Önerilen metin: “YANLIŞ, Excel'in kendi sözcüğüdür; tırnak içine alırsanız formül hata verir.”
- `excel3.js:64-66`: Bu fiyat listesinde `$` olmadan da her ürün bulunuyor (aralık aşağı kaydığında ürünler yine içinde kalıyor). Dolayısıyla “Bu mümkün oldu çünkü $ ile sabitlenmişti” cümlesi bu örnekte gösterilemiyor. İstenirse fiyat listesinde Domates en alta alınsın: `$` unutulunca son satırda `#YOK` çıkar ve ders gerçekten kanıtlanmış olur.
- `hesap.js:155` ve `211`: Ders “📊 Grafik” diyor, benzetimdeki düğmenin adı ise “📊 Sütun grafiği” (`sheet.js:314`). Ders metni “📊 Sütun grafiği” olarak düzeltilsin.
- `hesap.js:374`: “Ekmek KDV ile 12 TL (%20)”. Gerçekte ekmekte KDV %1'dir; dikkatli bir kursiyer itiraz eder. Ya “örnek oran” denilsin ya da ürün kırtasiye ve faturalarla değiştirilsin.

---

## 2) MEB eksikleri (Elektronik Tablolama: 35 saat, sitede ≈ 15 saat)

MEB modülünün alt başlık listesi depoda ayrıntılı yazılı değil (`MEB-ESLESTIRME.md:42` yalnızca özet). Aşağıdaki karşılaştırma modülün bilinen konularına ve uygulama sınavında sık çıkan işlere göre yapıldı.

| Konu | Durum | Önem |
|---|---|---|
| **Kenarlık, dolgu rengi, yazı tipi/boyut/renk, hizalama** | Hiç yok. Benzetimde düğmeleri de yok. Sınavda “tabloya kenarlık verin, başlığı renklendirin” neredeyse her zaman çıkar. | ORTA (eksikler arasında en önemlisi) |
| Hücreleri Biçimlendir (Ctrl + 1), ondalık artır/azalt, Biçim Boyacısı (Excel) | Yok | ORTA |
| **Yüzde** | Yalnızca KDV formülünde var (`hesap4`). **%** biçim düğmesi benzetimde var ama hiçbir derste kullanılmıyor. “Toplamın yüzde kaçı”, “%15 indirim”, “zam oranı” hesapları yok. | ORTA |
| **Mutlak başvuru ($)** | Bir adımda öğretiliyor (`hesap4`), `duseyara` ve `excel-tarih-sayma` derslerinde de kullanılıyor; iyi. Ama MEB ve Excel'in kullandığı “**mutlak başvuru**” terimi hiç geçmiyor, derste “sabit başvuru” deniyor. Karışık başvuru (B$1) yok, testte soru yok. | ORTA |
| **Koşullu biçimlendirme** | İki derste yalnızca benzetimin “eşit olanları” kuralı var (`hesap.js:309`, `excel3.js:188`). Gerçek yol (Giriş → Koşullu Biçimlendirme → Hücre Vurgulama Kuralları → Eşittir / Büyüktür) yazılmıyor. Sayısal koşul (ör. 50'den küçük notlar), veri çubukları ve kuralı temizlemek yok. Testte soru yok. | ORTA |
| EĞERSAY / ETOPLA | Öğretiliyor (`hesap3`, `aidat-takip`, `hesap4`), ama ETOPLA yalnızca bir kez geçiyor ve testte soru yok. | ORTA |
| EĞER | Tek bir basit örnek var. İç içe EĞER, VE/YADA ve EĞERHATA yok. EĞERHATA, DÜŞEYARA'daki `#YOK` hatasını gizlemek için çok kullanılır. | ORTA |
| Grafik | Sütun ve pasta var. Çizgi grafiği, grafik başlığı, veri etiketleri (yüzde), grafik türünü değiştirme ve gerçek yol (Ekle → Grafikler) yok. | ORTA |
| Sayfa düzeni ve yazdırma | Sığdırma, yatay kâğıt ve kılavuz çizgileri var. Kenar boşlukları, üst/alt bilgi, yazdırma alanı, “başlık satırlarını her sayfada yazdır” ve gerçek yol (Sayfa Düzeni sekmesi, Dosya → Yazdır) yok. | ORTA |
| Sayfalar arası başvuru (`=Ocak!B6`) | Yok. Benzetim de desteklemiyor (`sheet.js:13`). “Yıllık toplam” sayfası yapılamıyor. | ORTA |
| Sütun ekleme/silme, satır/sütun gizleme | Yalnızca satır ekleme ve silme var | DÜŞÜK |
| Çalışma kitabını parolayla açılışta koruma (Dosya → Bilgi → Çalışma Kitabını Koru → Parola ile Şifrele) | Yok. Sayfa koruması ise var. | DÜŞÜK |
| Bul ve Değiştir (Ctrl + F / Ctrl + H) Excel'de | Yok | DÜŞÜK |
| Çok düzeyli sıralama (Veri → Sırala penceresi) | Yok. Yalnızca hızlı A→Z ve Z→A düğmeleri var. | DÜŞÜK |
| `test11` kapsamı (`testler.js:669-690`) | 17 sorunun hiçbiri `$`, EĞER, EĞERSAY/ETOPLA, sıralama, filtre, grafik, koşullu biçimlendirme, Alt Toplam, Özet Tablo ya da açılır liste hakkında değil. | ORTA |

Öneri: Testteki 17 soruya 5 soru eklensin ya da “Sütunu genişletmek”, “Sayfa sekmeleri” gibi kolay sorular bunlarla değiştirilsin. Eklenecek sorular:
1. D9'daki formül kopyalanınca `$B$1` ne olur?
2. `=EĞER(D2>=50;"Geçti";"Kaldı")` ne yazar?
3. `=ETOPLA(B2:B9;"Market";C2:C9)` ne toplar?
4. Toplam satırı varken nasıl sıralanır?
5. Kalanları kırmızı yapmak için hangi komut kullanılır?

---

## 3) Anlaşılırlık

### A1. Gerçek Excel'deki yol yazılmıyor: ORTA
Ders benzetimin tek şeridindeki düğmeleri öğretiyor. Gerçek Excel'de bu komutlar başka başka sekmelerde. Yol bazı adımlarda yazılı, çoğunda yok. Her adıma bir “Gerçek Excel'de:” ipucu satırı ve dersin özet tablosuna bir satır eklenmesi öneriliyor:
- Koşullu biçim (`hesap.js:309`, `excel3.js:188`): Giriş → Koşullu Biçimlendirme → Hücre Vurgulama Kuralları → **Eşittir…**
- Açılır liste (`excel3.js:147`): Veri → **Veri Doğrulama** → Liste (bkz. D4)
- Filtre (`hesap.js:408`): Veri → **Filtre** (ya da Giriş → Sırala ve Filtre Uygula)
- Dondurma (`excel2.js:164`): Görünüm → Bölmeleri Dondur (bkz. D2)
- Yazdırma (`excel2.js:290-303`): Dosya → Yazdır → Ayarlar'da **Yatay Yönlendirme** ve **Tüm Sütunları Bir Sayfaya Sığdır**. Çizgiler için: Sayfa Düzeni → Kılavuz Çizgileri → **Yazdır** kutusu.
- Hücre kilidi ve koruma (`excel5.js:111`, `117`): hücreleri seçin → sağ tık → Hücreleri Biçimlendir → **Koruma** → **Kilitli** işaretini kaldırın. Sonra **Gözden Geçir → Sayfayı Koru**. Parola **iki kez** sorulur (onay penceresi); bunu derste söylemek gerekir, yoksa kursiyer şaşırır. Benzetimdeki “🔓 Hücre Kilidini Aç” düğmesi gerçek Excel'de yok.
- Özet Tablo (`excel4.js:87`): Ekle → Özet Tablo → Tamam. Sağdaki **Özet Tablo Alanları** listesinde Kategori ve Tutar kutuları işaretlenir; Excel sayı sütununu kendisi Değerler'e koyar. Benzetimin açılır kutularına hiç benzemiyor; bir cümleyle anlatılmalı.
- Grafik (`hesap.js:211`, `programlar2.js:312`): Ekle → Grafikler → Sütun / Pasta.
- Para biçimi (`hesap.js:174`): Giriş → Sayı bölümü (açılır listeden **Para Birimi**).

### A2. “Sabit başvuru” yerine “mutlak başvuru” da denmeli: ORTA
- Yer: `hesap.js:351`, `365-367`; `excel6.js:104`.
- Sorun: Sınav, Excel'in yardım sayfaları ve eğitmen “mutlak başvuru” der. Kursiyer iki terimin aynı şey olduğunu bilmez.
- Düzeltme: İlk geçtiği yerde “**Mutlak (sabit) başvuru**”, sonrakilerde “mutlak başvuru” denilsin. Özet tablosuna “Göreli başvuru: B2 → B3 kayar” satırının yanına “Mutlak: $B$1 hiç kaymaz” satırı eklensin.

### A3. Sıralama için sağdan sola sürüklemek zor: ORTA
- Yer: `hesap.js:197` (“B2'den A5'e doğru sürükleyin”), `excel2.js:350`, `odevler.js:140`.
- Sorun: Doğru bir yöntem, ama yaşlı kursiyerin elinde zor ve neden öyle yapıldığı da kafa karıştırıyor. Gerçek Excel'de daha güvenli yol **Veri → Sırala** penceresi: “Verilerimde üst bilgi var”, Sıralama ölçütü: Tutar, Büyükten Küçüğe.
- Düzeltme: Ya bir adım “Sırala penceresi” olsun, ya da en azından bir ipucu satırı eklensin. Alternatif olarak toplam satırının tablodan **bir boş satırla ayrılması** öğretilsin: o zaman tek hücreye tıklamak yeter.

### A4. Ondalıkta nokta: tarih tuzağı söylenmiyor: ORTA (önceki raporun 2. bulgusundan hâlâ açık)
- Yer: `hesap.js:82`.
- Sorun: Ders `45.50` için doğru uyarıyor. Ama asıl sık yaşanan hata `12.5` yazınca hücrenin **12 Mayıs** tarihine dönüşmesi ve bu derste anlatılmıyor.
- Düzeltme: Maddeye bir cümle eklensin: “12.5 yazarsanız Excel bunu **12 Mayıs** tarihi sanar.” Telefonda başa `'` koymak (`'0532…`) da kısa yol olarak eklenebilir.

### A5. “İşlev” sözcüğü yanına “fonksiyon” yazılmalı: DÜŞÜK
- Kursiyer eğitmenden, internetten ve YouTube'dan “fonksiyon” sözcüğünü duyar. `hesap1`'de işlev ilk kez geçtiğinde “işlev (fonksiyon)” yazılsın. `hesap.js:126`'daki done metni bunun için uygun yer.

### A6. Bölü ve artı tuşları anlatılmıyor: DÜŞÜK
- `hesap.js:130-131` çarpıyı anlatıyor ama `/` için tuş yok (Türkçe Q'da Shift + 7). `excel5.js:96` (`=B8/B9`) ve `excel6.js:120` (`=D2+30`; `+` Shift + 4) ipuçsuz. Birer kısa ipucu eklensin.

### A7. Ödev ve parkur ∑ adımında Enter'ı söylemiyor: DÜŞÜK
D1'e bağlı. `odevler.js:138` ve `excel2.js:347` ipuçlarına “sonra Enter” eklensin.

---

## 4) Benzetimin gerçek Excel'den farkları (`src/dersler/apps/sheet.js`)

| # | Fark | Yer | Etki | Öneri |
|---|---|---|---|---|
| B1 | `45.50`, `12.5` gibi noktalı yazılar **sayı** sayılıyor. Gerçek Excel'de `45.50` yazı olarak kalır, `12.5` tarih olur. Ders “sola yaslanır” dediği hâlde benzetimde sağa yaslanıp toplama giriyor. | `sheet.js:26` | YÜKSEK (ders kendi alıştırmasıyla çelişiyor) | Noktalı ondalık yazı olarak kalsın. Gün.ay biçimine uyan değer (12.5) tarihe dönsün. 3 haneli binlik gösterim (`1.500`) sayı olarak kalabilir. |
| B2 | Formülde virgül ayırıcı kabul ediliyor (`=EĞER(A1>10,"a","b")` çalışıyor). Türkçe Excel'de bu formül hata penceresi açar. | `sheet.js:168-169`, `221` | ORTA | Virgüllü formül kabul edilsin ama altında uyarı çıksın: “Türkçe Excel'de parçalar ; ile ayrılır”. |
| B3 | İngilizce ve uydurma adlar kabul ediliyor: `SUM`, `IF`, `VLOOKUP`, `SAY`… Türkçe Excel'de hepsi `#AD?` verir. | `sheet.js:158-161` | ORTA | Yalnızca Türkçe adlar ile Türkçe harfsiz yazılışları (`EGER`, `DUSEYARA`) kalsın. İngilizce adlarda `#AD?` çıksın ve not düşülsün: “İngilizce Excel'in adı; Türkçesi TOPLA.” |
| B4 | ∑ formülü hemen onaylıyor; gerçek Excel Enter bekler. | `sheet.js:966-981` | YÜKSEK (bkz. D1) | Formül düzenleme modunda açılsın; Enter ile onaylansın. |
| B5 | Formül yazarken hücreye tıklamak adresi formüle eklemiyor; yarım formülü onaylıyor. | `sheet.js:1269-1272` | YÜKSEK (bkz. D3) | En azından tıklamayla adres ekleme olsun. Olmayacaksa derslerdeki “fareyle seçebilirsiniz” cümleleri kaldırılsın. |
| B6 | `&` sayıyı noktayla birleştiriyor: `12,5&"x"` → “12.5x”. Gerçek Excel “12,5x” verir. `&` işleminin önceliği de `+`'dan farklı değil. Gerçekte `=A2&A1+1`, `A2&(A1+1)` diye hesaplanır; benzetim `#DEĞER!` veriyor. | `sheet.js:254` | DÜŞÜK | `&` için `txt()` kullanılsın; `&` ayrı ve daha düşük öncelikli bir düzey olsun. |
| B7 | `YUVARLA(-2,5;0)` = -2; gerçek Excel -3 verir. | `sheet.js:98` | DÜŞÜK | Sıfırdan uzağa yuvarlansın. |
| B8 | `EĞER("abc";…)` doğru sayılıyor; gerçek Excel `#DEĞER!` verir. | `sheet.js:97` | DÜŞÜK | Yazı olan koşulda `#DEĞER!` çıksın. |
| B9 | Genel biçimde 10.000 ve üstü sayılara binlik nokta konuyor. Gerçek Excel Genel biçimde **10200** gösterir. `hesap1` done metni de “10.200” diyor. | `sheet.js:280`, `hesap.js:100` | DÜŞÜK | Genel biçimde binlik ayırıcı olmasın. |
| B10 | Yüzde `20%` gösteriliyor. Türkçe Excel büyük olasılıkla **%20** gösterir (Türkçe yüzde biçimi). | `sheet.js:279` | DÜŞÜK (bkz. 6. bölüm) | Gerçek Excel'de doğrulanınca `%20` yapılsın. |
| B11 | `#####` Genel biçimli sayılarda da çıkıyor. Gerçek Excel Genel biçimde sayıyı yuvarlar ya da 1E+05 gibi bilimsel gösterir. `#####` asıl olarak para, tarih gibi biçimli sayılarda çıkar. | `sheet.js:457` | DÜŞÜK | Yalnızca biçimli (tl/pct/date) hücrelerde `#####` gösterilsin. Ders verisi zaten ₺ biçimli olduğu için `hucre-ince` etkilenmez. |
| B12 | Tek tarih aşağı çekilince kopyalanıyor; gerçek Excel günü birer artırır. | `sheet.js:622-637` | DÜŞÜK | Tek tarih hücresinde seri +1 gün olsun. |
| B13 | Birleştir ve Ortala, birden çok hücre doluysa uyarmadan siliyor. Gerçek Excel “yalnızca sol üstteki değer kalır” uyarısını verir. | `sheet.js:922` | DÜŞÜK | Uyarı penceresi eklensin. |
| B14 | Sayfalar arası başvuru (`=Ocak!B6`) yok; tablo yalnızca A–H sütunları ve 40 satır. | `sheet.js:9-16` | ORTA (MEB eksiğine engel) | `Sayfa!A1` desteği eklensin. |
| B15 | Formül otomatik tamamlama yok. Gerçek Excel `=TOP` yazınca liste açar, **Tab** ile seçilir. Ders yalnızca ETARİHLİ'nin önerilmediğini söylüyor. | `hesap1` | DÜŞÜK | Bir derste bilgi kutusu olarak anlatılsın: “Gerçek Excel adı yazarken öneri listesi açar; Tab ile seçin, parantezi kendisi açar.” |
| B16 | Tek hücreyle hızlı sıralama başlığı her zaman 1. satır sayıyor (`r1 = 1`). | `sheet.js:987` | DÜŞÜK | Şu anki derslerde sorun çıkmıyor; başlığı 3. satırda olan bir tabloda (hesap4 gibi) sıralama yapılırsa bozulur. |
| B17 | DÜŞEYARA'da sütun no 1'den küçükse benzetim `#BAŞV!` veriyor; gerçek Excel `#DEĞER!` verir. Kapanmamış parantezde benzetim `#DEĞER!` veriyor; gerçek Excel düzeltme önerisi gösterir. | `sheet.js:137`, `222` | DÜŞÜK | İsteğe bağlı. |

Önceki rapordan hâlâ açık olanlar:
- `eksikler-hafta9-12.md` 2. bulgunun benzetim kısmı (noktalı sayı yazıya dönmüyor), yukarıda B1.
- 3. yeni ders fikri: .xls/.csv dosyası, sayıya dönüştürme. Bu ders yok.

---

## 5) Eklenebilecekler (öncelik sırasıyla)

1. **Tabloyu güzelleştirmek: kenarlık, dolgu rengi, yazı tipi ve hizalama.** Yeni ders, 30 dk, `hucre-ince`'den sonra. Benzetime Kenarlık (Tüm Kenarlıklar / Kalın Dış Kenarlık), Dolgu Rengi, Yazı Rengi, yazı boyutu ve Ortala/Sola/Sağa düğmeleri eklenir. Adımlar: başlığı dolgu rengiyle boyamak, tabloya tüm kenarlık vermek, ondalık azaltmak, Ctrl + 1 penceresini bir kez görmek. MEB sınavının neredeyse her zaman istediği iş.
2. **Yüzde hesabı ve % biçimi (mutlak başvurunun ikinci uygulaması).** Yeni ders, 30 dk, `hesap4`'ten sonra. Örnek: her giderin bütçedeki payı `=B2/$B$7` ve % düğmesi; “%15 indirimli fiyat” `=B2*(1-$E$1)`; geçen aya göre artış oranı. Testte de 1–2 soru olsun.
3. **“Gerçek Excel'de nerede?” köprüsü.** `hesap1`'e bir adım eklenir: gerçek Excel şeridinin sekmeleri (Giriş, Ekle, Sayfa Düzeni, Formüller, Veri, Gözden Geçir, Görünüm) ve her sekmede ne olduğu, resimli. Ayrıca her derse “Gerçek Excel'de:” ipucu satırı (bkz. A1). Kısa iş, ödevde ve sınavda büyük fark yaratır.
4. **Bankadan ya da e-Devlet'ten gelen Excel/CSV dosyası.** Yeni ders, 30 dk; önceki raporda önerildi, hâlâ yok. İçerik: Korumalı Görünüm, yazı gibi duran sayılar, nokta ve virgül sorunu, tarih tanıma, filtreyle bir harcamayı bulma, .xlsx olarak kaydetme.
5. **Grafiği düzenlemek ve çizgi grafiği.** Ders ya da `butce`'ye 2–3 adım. Örnek: 12 aylık elektrik faturasından çizgi grafiği; grafik başlığı yazmak; pastaya yüzde etiketleri koymak; grafik türünü değiştirmek; grafiği taşıyıp büyütmek.
6. **Yıllık özet sayfası ve sayfa yapısı.** `calisma-sayfalari` ve `excel-yazdir` derslerine adım eklenir. “Yıl” sayfasında `=Ocak!B6+Şubat!B6` (benzetimde B14 gerekir). Yazdırmada üst bilgiye başlık ve tarih koymak; uzun listede başlık satırını her sayfada yazdırmak (Sayfa Düzeni → Başlıkları Yazdır).

---

## 6) Emin olunmayanlar (gerçek Türkçe Excel'de bir kez bakılmalı)

- **BÜYÜKHARF / KÜÇÜKHARF ve Türkçe i/İ.** Ders “Türkçe i/İ doğru çevrilir” diyor (`excel5.js:27`, `57`) ve `F5 = "Hasan ŞAHİN"` bekliyor (`excel5.js:83`). Türkçe forumlarda “BÜYÜKHARF i'yi I yapıyor, YERİNEKOY ile düzeltin” şikâyeti çok yaygın. Gerçek Excel “ŞAHIN” veriyorsa ders yanlış bilgi veriyor demektir. Bu durumda done metni şöyle olmalı: “Gerçek Excel bazen i harfini noktasız I yapar; sonucu kontrol edin.” EMİN DEĞİLİM. Microsoft 365 sürümünde denenmeli.
- **Kalın kısayolu.** Benzetim ve dersler `Ctrl + B` diyor (`hesap.js:166`, `sheet.js:310`). Türkçe Office'in bazı sürümlerinde ipucunda “Kalın (Ctrl+K)” yazdığı hatırlanıyor. EMİN DEĞİLİM. Bütün haftalarda ortak bir karar; gerçek Office'te bakılmalı. Her dilde çalışan güvenli yol **K düğmesi** (Excel'de Ctrl + 2 de çalışır).
- **Açılır liste ayırıcısı (D4).** `;` olduğuna büyük ölçüde eminim ama denenmeli.
- **Özet Tablo'nun birleştirilmiş başlık satırında verdiği uyarı (D6).** Uyarının tam metni ve çıkıp çıkmadığı denenmeli. Toplam satırının özete girmesi kesin.
- **Para ve yüzde biçimi görünüşü.** Türkçe Excel'de para biçimi “5.000,00 ₺” mi “₺5.000,00” mi (Windows sürümüne göre değişebilir), yüzde “%20” mi? Benzetim “5.000,00 ₺” ve “20%” gösteriyor.
- **Tarih görünüşü.** `05.09.1961` yazılınca Excel bunu “05.09.1961” olarak mı, “5.09.1961” olarak mı gösterir? Bölge ayarındaki kısa tarih biçimine bağlı. `excel6.js:74` metin olarak “05.09.1961” bekliyor; benzetim için sorun yok, yalnızca gerçek Excel'le farkı merak konusu.
- **Geçersiz giriş uyarısının metni.** Benzetim “Girdiğiniz değer geçersiz” diyor (`sheet.js:562`, `excel3.js:167`). Microsoft 365'te metin büyük olasılıkla “Bu değer, bu hücre için tanımlanan veri doğrulama kısıtlamalarıyla eşleşmiyor.” Tam metin denenmeli.
- **“300 TL” yazısı.** Benzetim bunu sayı sayıyor (`sheet.js:20`). Gerçek Türkçe Excel'de “TL” yazılınca sayı mı yazı mı olduğu bilinmiyor; “₺” ile yazılınca sayı olması daha olası.
- **Durum çubuğunun rengi.** `hesap.js:181` “yeşil çubuk” diyor. Excel 2013'te yeşildi, Microsoft 365'te gri. Bu ifade kaldırılabilir.
