# 9–12. hafta (E-posta, Word, Excel, PowerPoint): derste eksik, yanlış ya da yetersiz kalanlar

Tarih: 2026-10-30. Kaynak: `kalite-kontrol/dokum-2026-10-30.md`, 1509–2470. satırlar. Önermeden önce bütün dökümde (1–3059. satır) arama yapıldı. Başka haftada anlatılan şeyler (uzantılar ve `.exe` tehlikesi: `dosya-turleri`, PDF'in değiştirilemezliği: `pdf-duzenle`, projeksiyon ve ⊞ + P: `sunu-kurallar`, sahte site/e-Devlet: `adres`, `tuzaklar`, `iki-adimli`, Ctrl + Z: `hesap1` adım 8) eksik sayılmadı.

Kod değiştirilmedi. Adım numaraları dökümdeki numaralardır.

Not: "emin değilim" yazan Office düğme adlarını gerçek Türkçe Office'te bir kez gözle doğrulamak gerekir.

Özet: 15 bulgu. YÜKSEK 6, ORTA 8, DÜŞÜK 1. Ayrıca 3 yeni ders fikri.

---

## YÜKSEK

### 1. Excel'de sıralama: "Toplam satırı sıralamaya girmez" iddiası gerçek Excel'de yanlış
- Öncelik: YÜKSEK. Tür: yanlış.
- Ders / adım: `hesap2`, adım 5 (ipucu). Aynı yanlış izlenim `hesap3` adım 10'da da var.
- Sorun: İpucu, "tek bir hücreye tıklayın; program başlık ve toplam satırı dışındaki bütün satırları sıralar" diyor. Gerçek Excel tek hücre seçilince o hücrenin bitişiğindeki bütün dolu alanı sıralar. Toplam satırı tablonun hemen altındaysa o da sıralanır. `=TOPLA(B2:B5)` ortalara karışır ve sonuç bozulur. Kursiyer bütçesini sıralarken bunu yaşar. `tablo-parkur` adım 6'da "A1:B5'i seçin" denmesi doğru. Çelişki var.
- Öneri (hesap2 adım 5 yeni metin): "Sıralayacağınız satırları fareyle seçin: A2'den B5'e kadar. Başlık satırını ve Toplam satırını seçmeyin. Sonra ↓ Z→A'ya basın. Neden seçtik? Tek hücreye tıklarsanız Excel bitişik bütün dolu hücreleri sıralar. Toplam satırı da karışır ve hesap bozulur. Toplamı tablodan bir boş satırla ayırmak da işe yarar."
- Benzetim notu: Şu an benzetim tek hücrede Toplam'ı dışarıda bırakıyor. Ya adım yukarıdaki gibi "aralığı seç" şeklinde yazılmalı ya da benzetim gerçek davranışı göstermeli (tek hücreyle sıralanınca Toplam ortaya karışsın, sonra Ctrl + Z ile geri alınsın). İkincisi daha öğretici, çünkü kursiyer hatayı güvenle görmüş olur.

### 2. Excel'de sayı mı yazı mı: ondalık virgül/nokta, sola yaslı sayı, baştaki 0
- Öncelik: YÜKSEK. Tür: eksik.
- Ders / adım: `hesap1`, adım 5 sonrasına yeni adım. Dağınık ipuçları: `odev11` Görev 1 ("Ondalık için virgül kullanın") ve Görev 8 ("sola yaslandıysa Excel yazı sanmıştır"). Derste hiçbir yerde bu konu anlatılmıyor.
- Sorun: Gerçek hayatta en sık Excel sorunu bu. Türkçe Excel'de `45.50` yazınca sayı olmaz. Yazı kalır (sola yaslanır) ya da tarihe dönüşür (`1.5` yazınca 1 Mayıs olur). Toplam da o hücreyi saymaz, kimse nedenini anlamaz. Telefon ve T.C. kimlik numarasında baştaki 0 kaybolur (`0532…` → `532…`). Hesap1'de bütün tutarlar tam sayı, parkurda ise `120,50` var ama neden virgül olduğu söylenmiyor.
- Öneri (hesap1, adım 5'ten sonra yeni adım "Sayı mı, yazı mı?"): "Sayılar hücrede **sağa** yaslanır, yazılar **sola**. Ondalık için virgül kullanın: 45,50. Nokta yazarsanız (45.50) Excel bunu sayı saymaz; toplam yanlış çıkar. Bir sayı sola yaslıysa ve toplama girmiyorsa yazı sanılmıştır: hücreyi silip virgülle yeniden yazın. Telefon numarasını yazarken baştaki 0 silinir. Önce hücreyi seçip Giriş → Sayı biçimi listesinden **Metin**'i seçin, sonra numarayı yazın." Ek olarak kısa quiz: "B3'te 45.50 yazıyor, sola yaslı. Toplam neden 45,50'yi saymadı?"
- Benzetim notu: Benzetime "nokta ile yazılan sayı metne döner (sola yaslanır, toplama girmez)" davranışı ve hücrede yeşil üçgen eklenmeli. Gerçek Excel'deki "Sayıya Dönüştür" seçeneği (hücrenin yanındaki sarı ünlem) emin değilim; bilgi kutusu olarak yazılabilir.

### 3. Programların gerçek adı ve açılış ekranı ("Boş belge" tıklanmazsa belge açılmaz)
- Öncelik: YÜKSEK. Tür: eksik (ve adlandırma uyumsuzluğu).
- Ders / adım: `dilekce` adım 2, `hesap1` adım 2, `sunu` adım 2 ve sonraki derslerdeki "⊞ Başlat → Kelime İşlemci / Hesap Tablosu / Sunu".
- Sorun: Dersler programa "Kelime İşlemci", "Hesap Tablosu", "Sunu" diyor. Gerçek bilgisayarda böyle bir program yok. Kursiyer Başlat'ta "Kelime İşlemci" arayıp bulamaz. Dahası Word, Excel ve PowerPoint açılınca doğrudan boş sayfa vermez. Önce şablon listesi (başlangıç ekranı) çıkar. Boş sayfa için "Boş belge" ("Boş çalışma kitabı", "Boş sunu") kutusuna tıklamak gerekir. Bunu hiç görmeyen yaşlı kursiyer "program bozuk" sanar. Dökümde "Boş belge" geçmiyor.
- Öneri (dilekce adım 2'ye ekleyin, hesap1 ve sunu'ya uyarlayın): "Gerçek bilgisayarda bu programın adı **Word**'dür (mavi simge, beyaz W). Başlat'a Word yazıp açın. Önünüze şablonlar gelir; kendi yazınızı yazmak için **Boş belge**'ye tıklayın. Excel'de (yeşil X) **Boş çalışma kitabı**, PowerPoint'te (turuncu P) **Boş sunu** seçilir." (Tam düğme adları için emin değilim.)
- Benzetim notu: Benzetimde açılış adımına "şablon listesi → Boş belge" ara ekranı eklenebilir. En azından ders başlıklarına parantezle gerçek ad yazılmalı: "Kelime İşlemci (Word)", "Hesap Tablosu (Excel)", "Sunu (PowerPoint)".

### 4. Kaydetme: dosya nereye gitti (OneDrive), kapatırken sorulan soru ve Otomatik Kurtarma
- Öncelik: YÜKSEK. Tür: eksik.
- Ders / adım: `dilekce` adım 10; birleşik konu için `belge-duzen` adım 9'dan sonra yeni adım.
- Sorun: Word dersleri hep "Ctrl + S ile Belgeler'e kaydedin" diyor. Yeni Office'te ilk kayıtta çoğu kez "OneDrive" ya da "Bu Bilgisayar" sorulur. Kursiyer farkında olmadan bulut klasörüne kaydeder, sonra dosyayı Dosya Gezgini'nde bulamaz (`kayip-dosya` dersi genel bir çözüm veriyor ama sebebi söylemiyor). Aşağıdakiler dökümde hiç geçmiyor: "değişiklikleri kaydetmek istiyor musunuz? Kaydet / Kaydetme / İptal" sorusu Word'de (Not Defteri'nde adım 126'da var ama Word'de yok), Otomatik Kurtarma, kaydedilmemiş belgeyi geri getirme. Elektrik gidince ya da program donunca yazının kaybolması yaşlı kullanıcının en büyük korkusu.
- Öneri (dilekce adım 10'a ekleyin): "İlk kaydederken Word 'OneDrive' ya da 'Bu Bilgisayar' diye sorabilir. **Bu Bilgisayar → Belgeler**'i seçin. OneDrive internet üzerindeki depodur; seçerseniz dosyanız bilgisayarın Belgeler klasöründe olmaz." Yeni adım "Kapatırken ve elektrik giderse" (belge-duzen sonu): "Kaydetmeden kapatmaya çalışırsanız Word sorar: **Kaydet** (değişiklikleri sakla), **Kaydetme** (at), **İptal** (kapatma, geri dön). Emin değilseniz Kaydet'e basın. Elektrik gitti ya da program kapandıysa üzülmeyin: Word belgeyi kendiliğinden birkaç dakikada bir yedekler. Word'ü yeniden açın; solda 'Belge Kurtarma' çıkar, belgenize tıklayıp Farklı Kaydet'le saklayın. Çıkmazsa: Dosya → Bilgi → Belgeyi Yönet → Kaydedilmemiş Belgeleri Kurtar." (Tam menü adları için emin değilim.) Aynısı Excel için de geçerli (Çalışma Kitabını Yönet). Her ders başında "Ctrl + S'ye basma alışkanlığı" cümlesi de güçlendirilebilir.
- Benzetim notu: Gerek yok; bilgi kutusu/yeni adım yeter. Word benzetiminde kapatma anında üç düğmeli soru çıkarılırsa iyi olur.

### 5. E-postayla gelen eki açma: "Korumalı Görünüm / Düzenlemeyi Etkinleştir", makro uyarısı, hangi ek açılmaz
- Öncelik: YÜKSEK. Tür: eksik.
- Ders / adım: `eposta` adım 4 (eki indirin). `odev9` Görev 8'e de eklenmeli.
- Sorun: Adım 4 eki hiç şüphe uyandırmadan "İndir" dedirtiyor. Sahte posta uyarısı (adım 10) ayrı ve ek konusuna bağlanmıyor. Gerçek hayatta e-postadan inen Word/Excel dosyası sarı çubukla açılır ("Korumalı Görünüm ... Düzenlemeyi Etkinleştir"). Kursiyer yazamayınca "bozuk" sanır, düğmeye basar. Bu, gelen ek tanıdık birinden bekleniyorsa doğru, tanımadık kaynaktansa tehlikeli. Excel'de ayrıca "Makrolar devre dışı — İçeriği Etkinleştir" çubuğu çıkar; oltalama ekleri tam burada kullanılır. Dökümde "Korumalı Görünüm", "Düzenlemeyi etkinleştir", "makro" geçmiyor. `dosya-turleri` adım 5 "Şüpheli ek" sorusu tek başına kalıyor, e-posta dersine bağlanmıyor.
- Öneri (eposta adım 4'e ek 3 cümle): "Eki indirmeden önce sorun: bu postayı bekliyor muydunuz, gönderen tanıdık mı? Tanımadığınız birinden gelen ekleri, özellikle `.exe`, `.zip` ve 'faturanız ektedir' diyen belgeleri açmayın, silin. Word ya da Excel dosyasını açınca üstte sarı **Korumalı Görünüm** çubuğu çıkarsa: dosyayı yalnızca okuyabilirsiniz. Gönderen tanıdıksa ve bekliyorsanız **Düzenlemeyi Etkinleştir**'e basın. Bilmediğiniz bir kaynaksa basmayın. 'İçeriği Etkinleştir' (makro) isteyen dosyaya hiç basmayın."
- Benzetim notu: `eposta` benzetimine sarı çubuklu bir Word eki eklenebilir (basınca düzenlenir hale gelsin). Olmazsa bilgi kutusu yeterli.

### 6. Gerçek posta kutusu: "Gönderdiğim posta nerede?" (Gönderilmiş), Gmail'de Arşivle, göndermeyi geri alma, ek boyutu sınırı
- Öncelik: YÜKSEK. Tür: eksik.
- Ders / adım: `eposta` adım 8'den sonra yeni adım (fotoğraf gönderildi); `eposta2` adım 1 (klasör anlatımı); `bulut-paylas` adım 1.
- Sorun: Benzetimde Gelen Kutusu, İstenmeyen, Taslaklar, Çöp Kutusu var. Gönderilmiş klasörü ("Gönderilmiş Postalar" Gmail'de, "Gönderilmiş Öğeler" Outlook'ta) dökümde hiç geçmiyor. Kursiyer yolladığı postanın gidip gitmediğini bu klasörden anlar; yanıt gelmeyince "gitmedi mi" diye panikler. Gmail'in en sık şaşırtan düğmesi **Arşivle** (silmez, postayı Gelen Kutusu'ndan kaldırır; bulmak için "Tüm Postalar"). Derste ne Arşiv ne de Gmail'deki "Geri al" (gönderdikten sonraki birkaç saniye) var. `bulut-paylas`: "Video e-postaya sığmıyor" deniyor ama sınırın neden ve ne kadar olduğu söylenmiyor (Gmail 25 MB, Outlook yaklaşık 20 MB).
- Öneri (eposta, adım 8'den sonra yeni adım "Gönderdim mi?"): "Yolladığınız postanın bir kopyası **Gönderilmiş** klasöründe durur. Emin olmak için oraya bakın. Gmail'de gönderdikten hemen sonra altta kısa süre 'Geri al' çıkar; hatalı gönderdiysanız hemen basın." `eposta2` adım 1 sonuna: "Gmail'de ayrıca **Arşivle** düğmesi var: postayı silmez, Gelen Kutusu'ndan kaldırır. Kayboldu sanırsanız soldan Tüm Postalar'a bakın." `bulut-paylas` adım 1'e: "E-postalarda ek sınırı yaklaşık 20–25 MB'tır; büyük video ve çok fotoğraf buna sığmaz." (Klasör adlarının Türkçe tam hâli için emin değilim.)
- Benzetim notu: Benzetim e-posta programına "Gönderilmiş" klasörü eklenmeli (gönderilen postalar oraya düşsün). Düşük maliyetli ve gerçeğe yaklaştırır.

---

## ORTA

### 7. "Yanıtla" ile "Tümünü yanıtla" ayrımı
- Öncelik: ORTA. Tür: eksik.
- Ders / adım: `eposta-iletme` adım 1 ve 8.
- Sorun: Ders Yanıtla/İlet/Cc/Bcc'yi anlatıyor ama "Tümünü yanıtla" yok (dökümde geçmiyor). Çok kişiye gönderilmiş bir postada yanlış düğmeye basılınca özel cevap herkese gider. Klasik utanç.
- Öneri (adım 1'e ek): "Postada üç düğme olur: **Yanıtla** (yalnızca gönderene), **Tümünü yanıtla** (gönderen ve Kime/Bilgi'deki herkese), **İlet** (başka birine). Özel bir şey yazacaksanız Yanıtla'yı seçin ve Kime kutusuna bakın." Quiz: "Dernek duyurusuna yalnızca başkana teşekkür edeceksiniz. Hangisine basarsınız?"
- Benzetim notu: Benzetim e-posta ekranına "Tümünü yanıtla" düğmesi ve çok alıcılı bir posta eklenmeli. Olmazsa bilgi kutusu.

### 8. Sahte postayı tanıma: bağlantının gerçek adresine bakmak ve görünen ad taklidi
- Öncelik: ORTA. Tür: yetersiz.
- Ders / adım: `eposta` adım 10.
- Sorun: Adım gönderen adresine bakmayı öğretiyor (iyi). Ama gerçek oltalama postalarında görünen ad ("Garanti BBVA", "PTT Kargo") kolayca taklit edilir; asıl ayırt edici bağlantının üzerine gelince alt köşede görünen gerçek adres ve görünen yazıyla adresin uyuşmamasıdır. Bu hiç öğretilmiyor.
- Öneri (adım 10'a ek 2 cümle): "Gönderenin yazan adı sahte olabilir; adresine bakın. Bağlantıya **tıklamadan** farenin okunu üstüne getirin: ekranın alt köşesinde bağlantının gerçek adresi görünür. Yazıda 'bankam.com.tr' diyor ama altta başka bir şey yazıyorsa tıklamayın. Şüpheliyse postayı değil, bankanın sitesini adresi kendiniz yazarak açın."
- Benzetim notu: Benzetimde bağlantı üzerinde fare bekleyince alt çubukta gerçek adres gösterilebilir.

### 9. Word'den PDF: gerçek menü adı ve ne zaman .docx, ne zaman PDF gönderilir
- Öncelik: ORTA. Tür: yanlış (menü adı) ve yetersiz (neden).
- Ders / adım: `belge-ekle` adım 8; `ozgecmis` adım 8; `dilekce-parkur` adım 10; `odev10` Görev 4.
- Sorun: "Dosya menüsünden PDF olarak kaydet" gerçek Word'de bu adla yok. Gerçekte **Dosya → Farklı Kaydet** → "Kayıt türü: PDF" ya da **Dosya → Dışa Aktar → PDF/XPS Belgesi Oluştur** (menü adları için emin değilim). Ayrıca ne zaman PDF yollanacağı söylenmiyor: özgeçmişi ve dilekçeyi karşı taraf değiştirmesin, bozulmadan görünsün diye PDF; kendi düzenleme için Word dosyası (.docx) saklanır. PDF'in değiştirilemezliği 13. haftada var ama burada bağlanmıyor. İki dosya (aynı adla farklı uzantı) ortaya çıkar; kursiyer birini silip diğerini kaybedebilir.
- Öneri (belge-ekle adım 8'e): "Word'de **Dosya → Farklı Kaydet**'i açın, 'Kayıt türü' listesinden **PDF**'i seçin. PDF'e çevirdikten sonra yazıyı değiştiremezsiniz; bu yüzden **Word dosyanızı da saklayın**: düzeltme gerekirse onu değiştirir, yeniden PDF yaparsınız. Başkasına göndereceğiniz, bozulmaması gereken belgeyi (özgeçmiş, dilekçe) PDF yollayın; birlikte düzenleyeceğiniz belgeyi Word olarak yollayın."
- Benzetim notu: Benzetim menü etiketi "PDF olarak kaydet" yerine "Farklı Kaydet → PDF" yönlendirmesi eklenebilir (ya da tek tıklık kısayol kalıp ipucunda gerçek yol yazılabilir).

### 10. Word'de "Sayfa kenarlığı" ve "Filigran" Düzen sekmesinde değil, Tasarım sekmesinde
- Öncelik: ORTA. Tür: yanlış (gerçek Word'e göre).
- Ders / adım: `apartman-duyuru` adım 7 ("Düzen sekmesi → Sayfa kenarlığı → Kutu"); `sayfa-duzeni` adım 6–7 ("Düzen → Filigran").
- Sorun: Word 2013 ve sonrasında (2016/2019/365) Sayfa Kenarlıkları ve Filigran **Tasarım** sekmesindeki "Sayfa Arka Planı" grubundadır. Kursiyer Düzen'de arayıp bulamaz. Kenar boşlukları, Yönlendirme ve Sütunlar ise doğru yerde, Düzen'dedir.
- Öneri: Adım metinlerine ipucu: "Gerçek Word'de bu düğmeler **Tasarım** sekmesinde, 'Sayfa Arka Planı' grubunda: Filigran, Sayfa Kenarlıkları." Tercihen benzetimde bu iki düğmeyi Tasarım sekmesine taşıyın.
- Benzetim notu: Taşıma kolay olmayabilir; olmazsa ipucu yeter. Kesin doğrulama için gerçek Word'de bir kez bakın.

### 11. Yazım denetimi: yazarken çıkan kırmızı ve mavi çizgiler ne demek
- Öncelik: ORTA. Tür: yetersiz.
- Ders / adım: `dilekce` adım 3–7 (ilk yazı yazılan yer; çizgiden hiç söz edilmiyor), `belge-duzen` adım 5.
- Sorun: Kursiyer ilk dilekçesini yazarken ismin ve mahalle adının altı kırmızı dalgalı çizilir; ne olduğunu bilmez, bozuldu sanır. `belge-duzen` yazım denetimini yalnızca F7'ye indirgiyor. Aşağıdakiler yok: çizginin her zaman hata olmadığı (özel ad, mahalle adı), sağ tıklayınca öneri ve Yoksay / Sözlüğe Ekle, mavi çift çizgi (dilbilgisi/biçim önerisi), Türkçe sözlük kapalıysa her kelime kırmızı çıkması (Gözden Geçir → Dil → Yazım denetimi dilini ayarla).
- Öneri (dilekce adım 7'ye sonra yeni bilgi adımı, 2 cümle + 1 quiz): "Yazarken bazı kelimelerin altı **kırmızı dalgalı** çizilir: Word bu kelimeyi sözlüğünde bulamadı, yazım hatası olabilir. Sağ tıklayın, doğrusu önerilir. Özel isimler (Çınar Mahallesi) sözlükte olmadığı için çizilebilir; doğruysa **Yoksay** deyin. **Mavi** çizgi dilbilgisi ya da düzen önerisidir. Çizgiler yazdırılmaz." Quiz: "Muhtarlığın adının altı kırmızı. Ne yaparsınız?" Ek: "Hemen her kelime kırmızıysa dil Türkçe seçili değildir: Gözden Geçir → Dil'den kontrol edin." (Menü adı için emin değilim.)
- Benzetim notu: Benzetimde Word'e yazım denetimi çizgisi eklenmeli ya da en azından Konu Başlığı'ndaki özel isim kırmızı çizgili gösterilmeli.

### 12. Bilgi kopyalayıp Word'e yapıştırırken biçim taşınması (Yapıştırma Seçenekleri)
- Öncelik: ORTA. Tür: eksik.
- Ders / adım: `dilekce` adım 7 ya da `belge-duzen` sonu yeni adım. İlgili: `yan-yana` adım 9 (tarifi Word'e geçirme sorusu); `gunluk-web` adım 6 (yalnızca Not Defteri'ne yapıştırıyor, Word'e değil).
- Sorun: İnternetten ya da e-postadan kopyalanan yazı Word'e yapıştırılınca kaynağın yazı tipini, rengini, boyutunu, bazen bağlantısını ve arka planını da getirir. Metin belgenin geri kalanından farklı çıkar, kursiyer "belge bozuldu" sanır. Dökümde "Yapıştırma Seçenekleri" ya da "Yalnızca metni koru" yok.
- Öneri (yeni adım, 3 cümle): "İnternetteki ya da postadaki yazıyı Word'e yapıştırınca kendi renk ve yazı tipiyle gelebilir. Yapıştırdığınız yerin yanında küçük bir **(Ctrl)** düğmesi çıkar; ona tıklayıp **Yalnızca Metni Koru** (üstünde A harfi olan simge) deyin. Yazı belgenizin biçimine uyar." (Düğme adı ve Ctrl + Shift + V kısayolu için emin değilim.)
- Benzetim notu: Benzetimde biçimli bir yazıyı yapıştırıp küçük (Ctrl) düğmesini gösteren kısa bir adım eklenebilir.

### 13. PowerPoint'te en çok gereken işler: metin kutusu eklemek, slaytı silmek, gizlemek, düzeni değiştirmek
- Öncelik: ORTA. Tür: eksik.
- Ders / adım: `sunu` adım 5'ten sonra (slayt düzeni), `slayt-duzen` adım 8'den sonra.
- Sorun: Sunu derslerinde "Yalnızca başlık" düzeninde yazı yazılacak yer olmayınca ne yapılacağı hiç anlatılmıyor: Ekle → Metin Kutusu (Word'de var, `kelime-ilan`; PowerPoint'te yok). Yanlış slaytı silme (soldan seçip Delete / sağ tık → Slaytı Sil), sunumda bir slaytı atlamak için **Slaytı Gizle**, düzeni sonradan değiştirme (Giriş → Düzen) dökümde geçmiyor (`Slaytı sil`, `Gizle` aranınca sonuç yok). Slayt silmek ve slayt eklemek ilk gün sorulan şeylerdir.
- Öneri (slayt-duzen adım 8'den sonra yeni adım "Fazlalığı silmek, atlamak"): "Gereksiz slayt: soldaki listeden slayda tıklayın, **Delete** tuşuna basın (ya da sağ tık → Slaytı Sil). Slayt dursun ama gösteride atlansın istiyorsanız: sağ tık → **Slaytı Gizle**. Slayttaki yeni yazı yeri gerekirse: Ekle → **Metin Kutusu**, slaytta bir yere tıklayıp yazın. Slaydın düzeni yanlışsa Giriş → **Düzen**'den başka düzen seçin."
- Benzetim notu: Silme ve metin kutusu benzetimde muhtemelen yok. Eklenmeli ya da bilgi kutusu olarak anlatılmalı.

### 14. Excel'de hücre içeriğini düzeltme (çift tık / F2 / Esc) ve toplam aralığına yeni satır girmemesi
- Öncelik: ORTA. Tür: eksik.
- Ders / adım: `hesap1` adım 7'den sonra yeni adım; `hucre-ince` adım 8'e ek.
- Sorun: Bütün dersler hücreye tıklayıp üstüne yazdırıyor. Kısmi düzeltme (uzun yazıdaki tek harfi, uzun formüldeki bir sayıyı değiştirmek) için kullanılan **çift tık / F2**, yanlış yazıdan vazgeçmek için **Esc** dökümde yok. Yalnızca `excel-hata` adım 4'te formül çubuğu kullanılıyor. Ayrıca `hucre-ince` adım 7–8'de araya satır ekleniyor ve toplam kendiliğinden doğru kalıyor gibi görünüyor. Gerçekte listenin sonuna (toplam satırının hemen altına ya da üstüne) eklenen satır `=TOPLA(B2:B5)` aralığına her zaman girmez; kursiyer yeni tutarın toplama girmediğini fark etmez.
- Öneri (yeni adım "Hücreyi düzeltmek"): "Hücrenin içindekini baştan yazmak yerine çift tıklayın (ya da hücreyi seçip **F2**'ye basın): imleç hücrenin içine girer, tek harfi düzeltirsiniz. Yazarken vazgeçerseniz **Esc**. Enter onaylar." `hucre-ince` adım 8 sonuna: "Listenin sonuna satır eklediyseniz toplam hücresine çift tıklayın: formülün seçtiği alan renkli çerçeveyle görünür. Yeni satır çerçevenin dışındaysa toplamı yeniden seçtirin (∑ Otomatik Toplam)."
- Benzetim notu: Benzetimde hücre düzenleme modu ve renkli aralık çerçevesi yoksa bilgi kutusu yeter.

---

## DÜŞÜK

### 15. Geçiş ve animasyon adları benzetimde sadeleştirilmiş; gerçek PowerPoint'te farklı
- Öncelik: DÜŞÜK. Tür: yanlış olabilir (emin değilim).
- Ders / adım: `sunu` adım 8 ("Solma"); `animasyon` adım 2 ("Soldan gel"), adım 7 ("Kendiliğinden ilerle: 3 sn", "Tüm slaytlara uygula"); `animasyon-bolmesi` adım 5 ("Büyüme"); `odev12` Görev 3.
- Sorun: Bu adların bir kısmı gerçek Türkçe PowerPoint'te farklı. Emin olduklarım: geçiş zamanlaması "Sonraki Slayda Geç" altında "Fare tıklatıldığında" ve "Sonra: 00:03" onay kutularıdır (ders "Kendiliğinden ilerle" diyor). "Tüm slaytlara uygula" düğmesi de "Tümüne Uygula" olabilir. Emin olmadıklarım: "Solma" geçişinin adı (büyük olasılıkla "Soldurma"), "Soldan gel" animasyonu (büyük olasılıkla "Uçarak Giriş" ve yön seçeneği "Soldan"). Kursiyer aynı adı gerçekte aramak zorunda kalır.
- Öneri: Bu adımlara ipucu: "Gerçek PowerPoint'te bu düğmenin adı farklı olabilir: 'Soldurma', 'Uçarak Giriş', 'Sonra:' kutusu." Kesin adlar gerçek PowerPoint'ten gözle doğrulanıp benzetim etiketleri düzeltilmeli.
- Benzetim notu: Etiket değişikliği küçük iş; testlerde ya da `tools/` taramalarında bu adlara dayanan seçiciler varsa onlar da güncellenmeli.

---

## Yeni ders fikirleri (en fazla 3)

1. **Dilekçeyi baştan sona: Word'de yaz, PDF yap, e-postayla gönder** (hafta 10'un sonu ya da 12'den sonra, 30 dk). Bugün Word ve e-posta ayrı haftalarda, ama kursiyerin gerçek işi bunları birleştirmek. İçerik: gerçek dilekçe bölümleri (makam, ad-soyad, T.C. kimlik no, adres, telefon, konu, metin, tarih, imza, "EK:" satırı), PDF yapma, e-postada Dosya ekle ile ekleme, Gönderilmiş klasöründe doğrulama, kopyayı kendine Bilgi (Cc) yapma. Benzetim: Word benzetiminden oluşan PDF'in e-posta benzetiminde Dosya ekle penceresinde görünmesi gerekir. Mevcut dosya sistemi ortaksa kolay olmalı.
2. **Evde Office yoksa: Word Online, Google Dokümanlar/E-Tablolar, LibreOffice ve dil farkı** (bilgi dersi, 20 dk). Çoğu emekli evinde ücretli Office yok; ödevler ("Word ya da benzeri bir program", `odev10`) bu yüzden uygulanamaz. İçerik: ücretsiz seçeneklerin adları, Gmail hesabıyla Google Dokümanlar'ın açılması, .docx/.xlsx açıp kaydetme, Excel işlev adlarının Türkçe/İngilizce karşılığı (TOPLA = SUM, EĞER = IF, DÜŞEYARA = VLOOKUP, ORTALAMA = AVERAGE; İngilizce Office'te ayırıcı noktalı virgül yerine virgül olabilir). Benzetim gerekmez; ekran görüntülü anlatım yeter.
3. **Bankadan/e-Devlet'ten gelen Excel dosyası: .xls ve .csv açma, sayı-tarih düzeltme** (hafta 11 sonu, 30 dk). Hesap hareketi dökümü, SGK dökümü gibi dosyalar .xls ya da .csv gelir. İçerik: dosya türleri (.xlsx, .xls, .csv fark), Korumalı Görünüm'den çıkma, "yazı gibi duran" sayıları düzeltme (bulgu 2'nin devamı), tarihleri tanıma, sütun genişletme, filtre ile bir gideri bulma, dosyayı .xlsx olarak yeniden kaydetme. Benzetime örnek bir .csv ve "Sayıya Dönüştür" davranışı eklenmeli.
