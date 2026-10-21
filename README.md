# Bilgisayarın İçine Yolculuk

Bilgisayar bileşenlerini 1990'lardan 2025'e kadar anlatan, tarayıcıda çalışan etkileşimli bir 3B ders uygulaması.

## Hızlı başlangıç

`dist/index.html` (dersler, ana sayfa) ya da `dist/bilgisayar.html` (3B bilgisayar) dosyasını Chrome, Edge, Firefox ya da Brave ile açın. İnternet bağlantısı gerekmez: Three.js ve bütün dokular dosyanın içine gömülüdür. Kurulum da gerekmez.

## Dersteki kullanım

| Ne yapmak istiyorsunuz? | Nasıl? |
|---|---|
| Donanımı sınıfta adım adım anlatmak | Üstte **🎓 Donanım dersi** (ya da adresin sonuna `#ders`): 22 adım. Kamera parçaya gider, parça vurgulanır; panelde yalın anlatım, günlük hayattan örnek ve “Sınıfa sorun” (cevabı düğmeyle açılır). <kbd>←</kbd> <kbd>→</kbd> adımlar arasında geçer. Metinler `src/ders.js` içindedir |
| Dönem değiştirmek | Alttaki zaman çizgisi ya da <kbd>1</kbd>–<kbd>4</kbd> tuşları |
| Döndürmek / yakınlaştırmak | Sol tuşla sürükleyin, tekerlek ile yakınlaştırın, sağ tuşla kaydırın |
| Kasayı açmak | "Kasayı aç" ya da <kbd>O</kbd> |
| Ön, arka, iç ve arka panel görünüşleri | Sol menüdeki "Görünüş" düğmeleri |
| Parçaları katman katman ayırmak | "Parçaları ayır" kaydırıcısı |
| Bir parçayı incelemek | Parçaya tıklayın (diğer parçalar soluklaşır). Sekmeler: Ne işe yarar? · Nereye takılır? · Bu dönemde nasıldı? |
| Tek bir parçayı çıkarıp yerine takmak | Bilgi panelindeki "Çıkar" düğmesi |
| HDD, CD/DVD, SSD ve M.2'nin içini görmek | "İçini göster": HDD'de plakalar döner, CD/DVD'de lazer kızağı hareket eder |
| İşlemcinin iç yapısını göstermek | "İç yapısı (şema)". Bu, öğretici bir şemadır; gerçek yongayı göstermez |
| Portları tanıtmak | Arka paneldeki ya da ön paneldeki herhangi bir porta tıklayın |
| Kabloları göstermek | "Güç kabloları" (turuncu) ve "Veri bağlantıları" (mavi). HDD için "Kablolarını göster": güç ve veri kablosu birlikte görünür |
| Anakart soketlerini göstermek | "Anakart soketleri": işlemci soketi, RAM yuvaları, PCI/AGP/PCIe, IDE/SATA/M.2, güç konnektörleri |
| Güç tüketimini anlatmak | "Güç tüketimi": PSU kapasitesi ile anlık tüketim ayrı gösterilir. Boşta, ofis ve oyun durumları vardır; 2025 için ofis ve oyun bilgisayarı seçilebilir |
| Eski ve yeni parçaları karşılaştırmak | "Karşılaştır": iki parça cetvel üzerinde gerçek ölçekte yan yana durur, altında tablo vardır |
| Öğrencilere parça buldurmak | "Buldurma oyunu": etiketler gizlenir, soru sorulur, puan tutulur |
| Anlatım düzeyini değiştirmek | Üstte "Basit anlatım" / "Teknik anlatım" |
| Sunum için ayar yapmak | Tam ekran (<kbd>F</kbd>), A−/A+ ile yazı boyutu, animasyonu durdurma (<kbd>Boşluk</kbd>), sonraki/önceki parça (<kbd>←</kbd> <kbd>→</kbd>) |
| Yavaş bilgisayarda çalıştırmak | "Grafik: düşük" seçeneği gölgeleri kapatır ve çözünürlüğü düşürür. Açılışta kare hızı düşükse uygulama bunu kendiliğinden yapar |

## Dersler (ana sayfa: `index.html`)

Bilgisayarı yeni öğrenen yetişkinler için adım adım alıştırmalar. Sitenin ana sayfasıdır; buradaki **Bilgisayarı canlı gör** bağlantısı 3B bilgisayarı açar, oradaki **📝 Derslere dön** düğmesi geri getirir. Her adımda ne yapılacağı yazar; sayfa öğrencinin yaptığını algılar ve doğru yapınca bir sonraki adıma geçirir.

Sağ tarafta gerçek bilgisayara benzeyen bir **alıştırma bilgisayarı** vardır. Masaüstü, görev çubuğu, Başlat menüsü, pencereler, Not Defteri, Hesap Makinesi, E-posta, Kelime İşlemci (.docx), Hesap Tablosu (.xlsx), Sunu (.pptx), Dosya Gezgini, Paint, Ayarlar, internet tarayıcısı, kurulum sihirbazı ve Aygıt Yöneticisi içerir. Hepsi bellekte çalışır, öğrencinin gerçek dosyalarına dokunmaz. Site, adres ve marka adları uydurmadır.

| Hafta | Dersler |
|---|---|
| 1 | Açma-kapama · Fareyi tutma ve tek tık · Çift tık, sağ tık, tekerlek · Sürükle-bırak · Pencereler · Dizüstü bilgisayar ve touchpad (tek/iki parmak hareketleri, avuç içi, pil, Fn ile kapanan ses ve Wi-Fi) · Fare parkuru · Eşleştirme oyunları · **Ödev: gerçek bilgisayarda deneyin** (6 görev, yazdırılabilir kâğıt) · Test |
| 2 | Klavyeyi tanıyalım · Harf bulma alıştırması (tuşların yerini yeni öğrenenler için; zorlanılan harfler tekrar sorulur) · On parmak: temel sıra · Rakamlar ve sayılar (tarih, saat, para, Num Lock) · İşaretler ( ) / = " # € · Yazı yazarken başıma gelenler (yazı gelmiyor/odak kaybı, Insert ile harf yutma, Caps Lock, Num Lock, klavye dili ENG) · Tuş avı (ipucusuz) · Bayram kartı ve hata avı · Klavye eşleştirme oyunu · **F klavye ve Q klavye** (iki düzenin karşılaştırması) · **Klavye dili ve düzeni** (TUR/ENG, Alt + Shift, ş ğ ü neden çıkmaz, @, Türkçe F klavye ekleme ve kullanma) · Ödev · Test |
| 3 | Not Defteri ve kısayollar · Seçmenin incelikleri (Shift + ok/End, üç tık, Ctrl + ok) · Kaydetme, farklı kaydetme ve açma · Alışveriş listesi · Tarifi düzene sokun · Kısayol yarışı (süreli) · Kısayol eşleştirme · Ödev · Test |
| 4 | 3B uygulama · 🎓 Donanım dersi (3B, adım adım) · Donanım mı, yazılım mı? · Kasanın içi: parçalar · Portlar ve kablolar · Bilgisayar ilanı okuma · Bakım ve sağlıklı kullanım · Sağlıklı ve güvenli çalışma (ekran mesafesi, oturuş, mola, kablolar, statik elektrik, elektrik yangını, acil durum) · Sorun giderme: ilk kontroller · Ödev · Test · Donanım testi: kasanın içi (15 soru) |
| 5 | Masaüstü, Başlat ve görev çubuğu · Başlat menüsünü keşif · Masaüstünü düzenleme · Hesap Makinesi ile günlük hesaplar · Yapışkan Notlar, Ses Kaydedici ve Saat (alarm, zamanlayıcı) · Takvim: randevu ve hatırlatıcı · Fareyi kendinize göre ayarlayın (çift tıklama hızı, sol-sağ el, işaretçi boyutu ve rengi) · Gözümüz yorulmasın: Büyüteç ve Ctrl + tekerlek · Oyunlarla pratik (Mayın Tarlası, Kart Dizme) · Program dondu! Görev Yöneticisi (yanıt vermeyen programı kapatma, Ctrl + Shift + Esc, performans grafikleri, başlangıç uygulamaları) · Ekran Klavyesi (fareyle yazmak) · Sanal masaüstleri ve Görev Görünümü (⊞ + Tab) · Görev Yöneticisi ayrıntıları (sütuna göre sıralama, disk ve ağ, Yeni görev çalıştır) · Masaüstü parkuru (süreli) · Masaüstü haritası · **İki pencereyi yan yana** (⊞ + ← / →, kenara çarptırma, yerleşim kutusu) · Ödev · Test |
| 6 | Dosya Gezgini ve USB bellek · Dosya türleri ve uzantılar · **Resim ve web dosyaları: PNG, JPG, HTML** (Paint'ten iki türde kaydetme, Not Defteri'nde web sayfası yazıp tarayıcıda açma, Ctrl + U) · Klasör içinde klasör · Fotoğraflarla çalışmak · Geri Dönüşüm Kutusu · Dağınık klasörü toparlama (süreli) · Ne yapardınız? Dosya durumları · **Çoklu seçim** (Ctrl, Shift, çerçeve, onay kutuları) · **Kayıp dosyayı bulmak** (Giriş ve Son kullanılanlar, Bu Bilgisayar'da arama, indirilenin klasörü) · Ödev · Test |
| 7 | Paint · Paint ile ev çizimi · Paint ile tebrik kartı · Ekran Alıntısı · Ekran alıntısıyla yardım istemek · Ayarlar · Temalar ve Mağaza (tema, koyu mod, vurgu rengi, Mağaza'dan tema ve uygulama indirme, taklit uygulamayı tanıma) · Bluetooth (eşleştirme, uçak modu) · Bilgisayara şifre ve PIN koymak, ekranı kilitlemek · **Saati ve tarihi değiştirmek** (yanlış saatte siteler açılmaz, otomatik/elle ayar, 12/24 saat, takvim) · **Kısayol, ekran ayarı ve geri yükleme** (Gönder → Masaüstü (kısayol oluştur), çözünürlük ve ölçek, Sistem Geri Yükleme, Dosya Geçmişi) · **Denetim Masası** (kategori ve simge görünümü, arama, Programlar ve Özellikler, Sistem, Güç Seçenekleri, Ayarlar'la farkı) · Renkler: vurgu rengi, renkli görev çubuğu ve başlık çubuğu, saydamlık · Ayarlar parkuru (süreli) · Ödev · Test |
| 8 | İnternette gezinme ve indirme · **Tarayıcılar: Edge, Chrome, Firefox ve diğerleri** · İnternet adresini (URL) okumak (adresin parçaları, alan adı, .gov.tr / .com.tr / .xyz, kilit ve site bilgileri, yazım hatası, sahte reklam, kilitli sahte site, alt alan adı tuzağı, “Güvenli değil”, adres önerileri, bildirim izni, adresi kopyalama) · İnternette bilgi bulmak (okuyup soru cevaplama) · İnternetten video izleme, radyo ve gazete okuma (reklamı atla, tam ekran/Esc, altyazı, hız, galeri ve reklam tuzakları) · İnternetteki tuzaklar · Program kurma/kaldırma · Yazıcı ve sürücüler · Virüs taraması, güvenlik duvarı ve Disk Temizleme (Windows Güvenliği, USB bellek taraması) · **Virüsler ve antivirüs programları** (zararlı yazılım çeşitleri, bulaşma yolları, Windows Güvenliği, sahte antivirüs, bulaştıysa ne yapılır) · **İşletim sistemleri: Windows 7, 8, 10, 11, Linux ve Pardus** · İşletim sistemi kurulumu (gösterim) · **Arama motorları** (Görseller ve Haberler sekmeleri, reklam sonucu, tırnakla arama) · **Video kalitesi (360p, 1080p, 4K) ve Hz nedir?** (piksel ve yenileme hızı deneyleri) · İnternet parkuru (süreli) · **Ekranda çıkan İngilizce kelimeler** (Allow, Block, Skip… karar oyunu) · **İnternet kesildi!** (modem ışıkları, 10 saniye kuralı, telefondan erişim noktası, hız testi) · Ödev · Test |
| 9 | E-posta: posta okuma, ek indirme, yanıtlama, fotoğraf ekleyip gönderme, adres yazımı, sahte (dolandırıcılık) postası · **Gmail ve Hotmail (Outlook) farkları** · Yanıtla/İlet, Bilgi (Cc), Gizli (Bcc), taslaklar · Kişiler, imza, istenmeyenler · Gelen belgeleri indirip kendi klasörüne taşımak · Büyük dosyayı buluttan paylaşmak · “Şifremi unuttum” (SMS kodu, yeni şifre, şifre defteri) · **E-posta kutusu doldu** (ek:var, kimden:, büyük: aramaları; abonelikten çıkma; büyük ekleri silme) · **E-posta parkuru** (süreli) · Ödev · Test (12 soru) |
| 10 | Kelime işlemci (Word benzeri): dilekçe yazma, kalın, ortalama, yazı boyutu, iki yana yaslama, tarih, kaydetme, yazdırma · Liste, tablo (Tab ile hücreler), yazı rengi, resim, PDF olarak kaydetme · Hazır bülteni düzenleme: Konu Başlığı / Başlık 1 stilleri, Bul ve Değiştir (Ctrl + H), yazım denetimi (F7), vurgu rengi, kenar boşlukları, sözcük sayısı · Apartman duyurusu (ortalı büyük başlık, renk, sayfa kenarlığı, yazdırma önizlemesi) · Tablo incelikleri (satır/sütun ekleme-silme, hücre birleştirme, kalın çizgi, hücre içi hizalama) · Sayfa düzeni ve yazdırma hataları (taşan satırlar, yatay kâğıt, filigran, Ctrl + Enter) · Simgeler ve şekiller (₺ °C ½ ©, kutu ve ok) · Adres mektup birleştirme (Postalar sekmesi) · Büyük/küçük harf, Başlık 3 ve Alıntı stilleri, satır aralığı, cetvel · Dilekçe parkuru (süreli) · **Word'de resim neden kaçıyor?** (Metni kaydır: Kare / Sıkı, orantılı küçültme, kırpma) · **Biçim Boyacısı, satır aralığı ve girintiler** · **Üst bilgi, alt bilgi, sayfa numarası, dipnot ve köprü** · **Uzun belge: numaralandırma, başlıklar ve içindekiler tablosu** (Başlık 1, Başvurular → İçindekiler Tablosu, Tabloyu Güncelleştir, Ctrl + tık) · **Bülten: sütunlar, kenarlık, gölgelendirme ve sekmeler** (yalnızca seçili yazıyı iki sütuna bölmek, noktalı sekme durağı) · **Tutanak: değişiklikleri izle, açıklama ve parola** (Gözden Geçir → Değişiklikleri İzle, Yeni Açıklama, Kabul Et / Reddet; Dosya → Bilgi → Belgeyi Koru → Parola ile Şifrele) · **İlan: Metin Kutusu ve WordArt** · Ödev · Test |
| 11 | Hesap tablosu (Excel benzeri): hücre adresi, veri girişi, ∑ Otomatik Toplam, TOPLA, ORTALAMA, dört işlem · Kalın ve ₺ biçimi, durum çubuğu, sıralama, sütun grafiği, yazdırma · Not çizelgesi: formülü kopyalama (Ctrl + C / V, doldurma tutamacı), göreli başvuru, EĞER, koşullu biçimlendirme, MAK, EĞERSAY, formüllü tabloyu sıralama · Alışveriş ve faturalar: yüzde, $ ile sabit başvuru, ETOPLA, filtre · Hücre incelikleri (Birleştir ve Ortala, Metni Kaydır, ##### hatası, sütun genişliği) · Otomatik doldurma (1, 2, 3… ve Ocak, Şubat… listeleri) ve Üst Satırı Dondur · Çalışma sayfaları (yeni sayfa, ad ve renk, Taşı veya Kopyala) · Excel'de yazdırma (önizleme, tek sayfaya sığdırma, yatay kâğıt, kılavuz çizgileri) · **DÜŞEYARA** (fiyat listesinden değer getirme) · **Açılır liste ve aidat takibi** (veri doğrulama, EĞERSAY, koşullu biçim) · Tablo parkuru (süreli) · **Excel hataları ve Özet Tablo** (#DEĞER!, #AD?, #SAYI/0!; formülsüz özet) · **Yazı işlevleri, YUVARLA ve sayfayı koruma** (YAZIM.DÜZENİ, BÜYÜKHARF, KÜÇÜKHARF, BİRLEŞTİR, hücre kilidi) · **Tarihler ve sayma işlevleri** (tarih yazmak, BUGÜN, ETARİHLİ ile yaş, tarihe gün eklemek, BAĞ_DEĞ_SAY, BAĞ_DEĞ_DOLU_SAY, BOŞLUKSAY) · **Alt Toplam** (önce sıralama, her kategorinin altına toplam satırı, 1-2-3 anahat düzeyleri, ALTTOPLAM ile TOPLA farkı, Tümünü Kaldır) · Ödev · Test |
| 12 | Sunu (PowerPoint benzeri): başlık slaytı, yeni slayt ve maddeler, tasarım teması, resim, slayt geçişi, slayt sırası, slayt gösterisi (F5), kaydetme · Slayt düzenleri, Slaytı Çoğalt ve Slayt Sıralayıcı · SmartArt (renkli liste, süreç okları, aile soy ağacı) · Animasyon ve süre ayarı (geçişten farkı, tıklamayla ya da kendiliğinden, kendiliğinden ilerle) · **Vurgu ve çıkış animasyonları, Animasyon Bölmesi** (Darbe, Kaybolma, Animasyon Ekle ile ikinci animasyon, bölmede ▲ ▼ ile sıra ve Oynat, Başlangıç: Tıklatıldığında / Öncekiyle / Öncekinden Sonra, Süre, Gecikme) · Aile ve anı albümü (Fotoğraf Albümü, altına tarih ve not, müzik, PDF ve video çıktısı, bir kâğıda 4 slayt) · **İyi bir sunu nasıl olur?** (yazı miktarı, renk, hazırlık, ⊞ + P) · **Sunum anı** (konuşmacı notları, slayt numarası, B/W, rakam + Enter) · **Sunuya hazırlık** (Not Sayfası, Okuma Görünümü, Shift + F5, gösteride kalem ve vurgulayıcı: Ctrl + P, sağ tık, E ile silme, Sakla/At; Zamanlamaları Prova Et; dinleyici notları ve not sayfası yazdırma) · **Asıl Slayt; slayda tablo ve grafik** (logo, alt bilgi, başlık rengi ve yazı tipi bütün slaytlara; Tab ile tablo; sütun ve pasta grafiği) · **Şekil, WordArt, video, köprü ve eylem düğmeleri** (Şekil Biçimi ve dolgu, şekli sürükleme, Ctrl + K ile web adresi ve Bu Belgeye Yerleştir, Eylem Ayarları, Üst Bilgi ve Alt Bilgi: tarih, slayt numarası, başlık slaydında gösterme) · **Sunu parkuru** (süreli) · Ödev · Test (14 soru) |
| 13 | Günlük işler, iki ayrı ders: **bilgisayarda** (PrtSc ile ekran görüntüsü → Paint, fotoğrafı arka plan yapma, USB'ye kopyalama, kopyalama/taşıma farkı) · **tarayıcıda** (resme sağ tık → Resmi farklı kaydet, İndir düğmesi ve İndirilenler, indirileni arka plan yapma, sayfadan yazı kopyalama, ✂ web yakalama, Ctrl + / Ctrl − yakınlaştırma, ☆ sık kullanılanlar) · Tarayıcı: uzantı mağazası ve izinler, reklam engelleyici, zararlı uzantıyı kaldırma, geçmiş (Ctrl + H), göz atma verilerini temizleme, gizli pencere, sayfada bul (Ctrl + F) · PDF dosyalarıyla çalışmak (sayfa gezinme, belgede arama, yan taranmış sayfayı döndürme, indir/yazdır simgeleri) · Bilgisayarda mesajlaşma (karekod, belge gönderme, gelen fotoğrafı indirip yazdırma, sahte bağlantı, oturumu kapatma) · **Çerezler** (çerez penceresi, takip eden reklam, üçüncü taraf çerez, listeleme ve silme) · **PDF formu indirmek, doldurmak ve yazdırmak** (yazı ekleme, vurgulama, imza, kaydetme, sayfa seçerek yazdırma, kâğıt hesabı) · Tarayıcıda sayfaya not (Yapışkan Not uzantısı) ve sık kullanılanlar çubuğu · **Fotoğrafı küçültmek ve kırpmak** (“2 MB'den büyük olamaz” hatası, Paint'te Yeniden boyutlandır, Seç + Kırp, Farklı kaydet) · **Haritalar** (yer arama, uydu, konum izni, yürüyerek ve otobüsle yol tarifi, sarı insanla Sokak Görünümü) · **Günlük işler parkuru** (süreli) · Ödev · Test (14 soru) |
| 14 | İnternette işlemler: e-Devlet'ten barkodlu belge (giriş, hizmet arama, PDF indirme, belge doğrulama, güvenli çıkış) · Hastane randevusu (MHRS formu, zorunlu alanlar, randevu belgesini indirme, iptal) · İnternetten alışveriş (sepet, adres, ödeme, SMS doğrulama kodu) · Görüntülü görüşme (kamera ve mikrofon izni, sessize alma) · e-Nabız (reçete, tahlil sonucu, aile hekimi, PDF indirme) · İlan sitelerinde arama ve kapora tuzakları · e-Hizmet parkuru (süreli) · **Sanal kart, IBAN ve dekont** (asıl kartı internet alışverişine kapatma, limitli sanal kart, IBAN'ı kopyala-yapıştır, SMS onayı, PDF dekontu gönderme) · **e-Devlet: SGK, emekli aylığı, kayıtlı hatlar; belediye ve CİMER** (hizmet dökümü, kesintiler, adına açılmış hat ve şirket kontrolü, fotoğraflı arıza bildirimi, CİMER başvurusu) · Ödev · Test (13 soru) |
| 15 | **Bilgi güvenliği** (MEB “Bilgi Güvenliği Bilinçlendirme” modülü): Yedekleme (USB bellek ve bulut, yedeği açıp denemek, üç kopya kuralı, fidye yazılımı) · İki adımlı doğrulama ve yedek kodlar · Sosyal medyada güvenlik (gizlilik ayarları, tatil ve konum paylaşımı, taklit hesap, para isteyen mesaj, çekiliş tuzağı) · Kişisel veriler ve ortak Wi-Fi (T.C. kimlik no, kimlik fotoğrafı, KVKK, kafe ve hastane Wi-Fi'si) · Dolandırıldım, ne yapmalıyım? (kartı kapatmak, itiraz, delil, şifreler, karakol/savcılık, 155, CİMER) · Bilgi güvenliği parkuru (süreli) · Ödev · Test |
| Ek | İnternette güvenlik: sahte SMS, arama ve siteler; doğrulama kodu; sahte virüs uyarısı; güçlü şifre · Yapay zekâya soru soralım (resmî yazıyı özetletme, tarif, gezi planı, dilekçe taslağı; kimlik ve kart bilgisi yazmama kuralı; cevabı doğrulama) · Yazma hızı ölçümü: dakikada kelime ve hata; her ölçüm öğrencinin profilinde saklanır, haftadan haftaya karşılaştırılır · **Büyük parkur: torunun doğum günü** (kursun tamamı tek görevde: klasör, davetiye, harcama tablosu, e-posta, yol tarifi, sanal kart; süreli) · **Kurs bitirme sınavı** (25 soru; %70 ve üstünde yazdırılabilir belge) |

MEB kurs programının modülleriyle hangi haftaların eşleştiği ve süre karşılaştırması: [MEB-ESLESTIRME.md](MEB-ESLESTIRME.md).

Eğitmen için:
- Ekrandaki klavye basılan tuşu ve adımın istediği tuşları yakar. **Pano** kutusu kopyalanan yazıyı gösterir.
- Sık yapılan hatalarda (Ctrl'yi basılı tutmayı unutmak, yazıyı yanlışlıkla silmek, reklama tıklamak…) uyarı çıkar. 40 saniye ilerlenmezse ipucu açılır. Algılanamayan bir durumda "Adımı geç" kullanılabilir.
- Her haftanın sonunda **orta seviye alıştırmalar** vardır: klavyede sarı ipucu yanmaz, nasıl yapılacağı yazmaz; takılan öğrenci İpucu'na bakar. Parkurlarda her görevin süresi listelenir.
- **Haftalık testler** 10 sorudur, seçenekler her açılışta karışık sıradadır. Yanlış cevapta açıklama çıkar ve doğrusu bulununca geçilir. Sonunda ilk denemede doğru bilinen soru sayısı ve tekrar bakılacak konular görünür; puan ana sayfadaki kartta da yazar.
- Her adımın süresi tutulur. Fare parkurunun sonunda her görevin süresi listelenir, en uzun süren kırmızı görünür. Diğer derslerde en uzun süren üç adım gösterilir.
- İlerleme tarayıcıda saklanır ve **her öğrenci için ayrıdır**: açılışta (ya da üstteki öğrenci düğmesiyle) öğrenci seçilir; "Misafir" eski ortak kaydı kullanır. Sayfa yenilense de kaldığı yerden devam eder; ders sırasında sekme kapatılmak istenirse (Ctrl + W) tarayıcı önce sorar. sayfa yenilense de kaldığı yerden devam eder. Ders sonunda özet kartı yazdırılabilir.
- **Özet** (üst çubuk): bu bilgisayardaki her öğrencinin hafta hafta bitirdiği ders sayısı, test puanı, yazma hızı ve son çalıştığı gün. Yazdırılabilir.
- Klavye dili yanlışsa (ENG ya da Türkçe F) ve Caps Lock açık kalmışsa rehberin üstünde uyarı çıkar.
- Her haftanın sonunda **“N. hafta ödevi: gerçek bilgisayarda deneyin”** dersi vardır: kursiyer alıştırma bilgisayarında değil kendi (ya da kurstaki gerçek) bilgisayarında 6–8 küçük görev yapar, her birini “Yaptım ✔” ile işaretler. Son ekrandaki **Özet kartını yazdır** düğmesi ödev kâğıdını (görev listesi, not boşlukları, “takıldığım yerler”) basar.
- Alıştırma bilgisayarında sağ alttaki **TUR / ENG** yazısı çalışır: tıklayarak ya da Alt + Shift ile klavye dili değişir; **ENG** ve **Türkçe F** düzeninde gerçek klavyedeki tuşlar farklı harf yazar (ş tuşu `;` olur, F tuşu `a` olur). Saate tıklayınca takvim açılır; bilgisayarın saati yılları geriyse güvenli siteler “Bağlantınız gizli değil” der.
- Site kabuğu (üst çubuk, ders listesi, ders paneli) **sade bir temayla** hazırlanmıştır: tek vurgu rengi, ince çizgiler, süssüz düğmeler. Alıştırma bilgisayarının içi bilerek gerçek Windows'a benzetilmiştir ve bu temadan etkilenmez.

Kaynak: `src/dersler/`
- `app.js`: ders akışı. `lessons/`: ders metinleri ve adımlar (`hafta2_ek.js` … `hafta8_ek.js` ve `alistirmalar.js`: ek dersler ve orta seviye alıştırmalar, `testler.js`: haftalık testler, `kalip.js`: soru ve ayırma adımı kalıpları, `ileri2.js`: Takvim randevu ve hatırlatıcı, Görev Yöneticisi ayrıntıları, Ekran Klavyesi, sanal masaüstleri, renkler, adres mektup birleştirme, büyük/küçük harf ve stiller, tarayıcıda sayfa notu). Her adımın hangi olayla tamamlanacağı burada yazılıdır; alanlar `lessons/common.js` başında anlatılır.
- `desktop.js`: alıştırma masaüstü (temalar ve vurgu rengi, yanıt vermeyen pencere, Ctrl + Alt + Delete ekranı da burada). `apps/`: programlar (Görev Yöneticisi `taskmgr.js`; Mağaza, Takvim ve Hava Durumu `store.js`; tarayıcı uzantıları `browser.js`). `vfs.js`: bellekteki dosya sistemi. `dialog.js`: kaydet/aç/yazdır pencereleri.
- `notepad.js`, `keyboard.js`: Not Defteri ve ekran klavyesi. `keymap.js`: klavye düzenleri (Türkçe F, İngilizce). Yeni derslerin dosyaları: `lessons/isletim.js`, `tarayicilar.js`, `virus.js`, `videohz.js`, `gmailhotmail.js`, `fqklavye.js`, `saat.js`, `denetimmasasi.js` (+ `apps/denetim.js`), `resimweb.js`, `cerezler.js`, `aramamotoru.js`, `pdfduzenle.js` (+ `apps/siteler-belge.js`), `sunu3.js`, `excel3.js`, `odevler.js`, `windows2.js`, `kelime4.js`, `excel5.js`, `bilgiguvenligi.js` ve `bilgiguvenligi2.js` (+ `apps/siteler-sosyal.js`). `css/`: stiller (derlemede sayfaya gömülür).

## Temsilî sistemler

| | 1990'lar (~1997) | 2000'ler (~2004) | 2010'lar (~2014) | 2025 |
|---|---|---|---|---|
| Kasa | Bej yatay masaüstü kasa; turbo düğmesi, kilit ve MHz göstergesi | ATX orta kule (bej ya da siyah-gümüş), CPU hava kanalı | Siyah kule, 2+1 adet 120 mm fan, PSU altta | Cam yan panel, PSU bölmesi, ARGB |
| İşlemci | Pentium sınıfı, Socket 7 | Pentium 4 sınıfı, Socket 478 | 4 çekirdek, LGA 1150 | 8 çekirdek, AM5 |
| RAM | 72-pin EDO SIMM (çift olarak takılır) | DDR-400 | DDR3-1600 | DDR5-6000 |
| Ekran kartı | PCI, VGA | AGP 8x, VGA/S-Video/DVI | PCIe 3.0, iki fanlı | PCIe 5.0, üç fanlı, 12V-2x6 |
| Depolama | IDE HDD, disket, CD-ROM | SATA HDD, disket, IDE DVD±RW | SATA SSD, HDD, SATA DVD | M.2 NVMe |
| PSU | 200 W, monitör çıkışlı | 350 W ATX12V | 500 W Bronze | 850 W Gold modüler (ofis sürümü: 450 W) |

Bu sistemler kesin geçiş tarihlerini göstermez. Her dönemin farkını anlatmak için seçilmiş tipik parçalardır. Marka ve model adları uydurmadır; gerçek logo kullanılmamıştır. Güç tüketimi değerleri tahminidir.

## Kaynaklar

- Intel ATX Specification 2.2, ATX12V ve ATX 3.x PSU tasarım kılavuzları
- JEDEC modül standartları (SIMM/DIMM ölçüleri, pin sayıları)
- PC 99 System Design Guide (port renk kodları)
- SATA-IO, PCI-SIG (PCI, PCIe, M.2), USB-IF belgeleri
- MEB MEGEP, "İç Donanım Birimleri" öğrenme materyali

## Geliştirme

```bash
npm install
node build.mjs          # dist/index.html (dersler) ve dist/bilgisayar.html (3B) (küçültülmüş, internetsiz çalışır)
node build.mjs --dev    # okunabilir çıktı
node tools/shot.mjs senaryo.json   # ekran görüntüsü (Brave/Chromium + puppeteer-core)
python3 sunum/uret.py && node sunum/pdf.mjs donanim   # slaytlar (donanım sunusu: sunum/Bilgisayar-Isletmenligi-donanim.pdf, görseller sunum/img2/dh_*.jpg)
```

### Klasör yapısı

```
src/
  main.js          Uygulama: sahne, kamera, seçim, paneller, kablo modları, karşılaştırma, oyun
  index.html       Arayüz (HTML/CSS)
  content.js       Bütün Türkçe metinler ve veriler (parçalar, portlar, güç, karşılaştırma, sorular)
  assemble.js      Parça kaydı, anakart yerleşimi, kablo oluşturucu
  geom.js          Geometri yardımcıları, statik birleştirme (draw call azaltma), kablo/şerit geometrisi
  materials.js     PBR malzemeler, PC 99 renkleri
  textures.js      Canvas dokuları: PCB izleri, yonga yazıları, etiketler, ızgaralar
  compare.js       Karşılaştırma sahnesi ve cetvel
  cpuSchema.js     İşlemci iç yapısı şeması (SVG)
  parts/           board, cpu, ram, cards, drives, psu, fan, ports, cases
  eras/            era1990, era2000, era2010, era2025 (her dönemin montajı)
tools/shot.mjs     Kalite kontrol için ekran görüntüsü betiği
kalite-kontrol/    Her dönem için dış görünüş, kasa açık, parçalar ayrılmış ve arka panel ekran görüntüleri
```

Lisans notu: Three.js MIT lisanslıdır ve derlenmiş dosyaya gömülüdür.
