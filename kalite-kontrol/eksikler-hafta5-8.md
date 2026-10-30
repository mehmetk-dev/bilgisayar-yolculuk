# 5–8. hafta: gerçek bilgisayarda eksik, yanlış ve yetersiz kalan yerler

Tarih: 2026-10-30. Kaynak: `kalite-kontrol/dokum-2026-10-30.md` (568–1508. satırlar) ve `src/dersler/lessons/*.js`. Kod değiştirilmedi.

Toplam 15 bulgu: 7 YÜKSEK, 7 ORTA, 1 DÜŞÜK.

Önerilen metinler "siz" hitabıyla, doğrudan derse yapıştırılabilir biçimde yazıldı. "Emin değilim" yazan yerlerde Windows'taki tam Türkçe ifade, bir gerçek bilgisayarda doğrulanmalı.

Önceki haftalarda ve sonrasında zaten olan şeyler, bu yüzden önerilmedi: güç düğmesini basılı tutma (hafta1), Windows 10 desteğinin bitmesi (`isletim-sistemleri`), uzantıları görünür yapma ve `.pdf.exe` hilesi, USB "biçimlendirmeniz gerekiyor" uyarısı, dosya adında yasak karakterler (`dosya-senaryo`), PrtSc (hafta13), telefondan kabloyla fotoğraf aktarma (hafta13), sahte "numarayı arayın" uyarısı (`sorun-giderme`, `tuzaklar`), e-posta ekini İndirilenler'den taşıma (hafta9), İngilizce düğmeler, Ctrl+Z.

---

## YÜKSEK

### 1. [YANLIŞ] Fare: "Çift tıklama hızı" Ayarlar'da değil
- **Ders / adım:** `fare-ayar` adım 2, 3, 4 ve 11 (soru). Aynı yanlış yol `odev1`'de de geçiyor ("Ayarlar → Fare'den çift tıklama hızını yavaşlatın").
- **Sorun:** Derste çubuk "Ayarlar → Bluetooth ve cihazlar → Fare" sayfasında gösteriliyor. Gerçek Windows 10/11'de bu sayfada yalnızca birincil düğme, işaretçi hızı ve kaydırma var. Çift tıklama hızı, sayfanın altındaki "Ek fare ayarları" bağlantısıyla açılan eski "Fare Özellikleri" penceresindeki Düğmeler sekmesindedir (Windows 11'in en yeni sürümlerinde de böyle olduğundan büyük ölçüde eminim). Kursiyer evde çubuğu arayıp bulamaz; çift tık sorunu yaşlılarda en sık şikâyettir.
- **Öneri (adım 4'e eklenecek):** "Gerçek bilgisayarda bu çubuk Ayarlar sayfasında değil, bir adım içeridedir. Fare sayfasında en alta inin, Ek fare ayarları'na tıklayın. Açılan Fare Özellikleri penceresinde Düğmeler sekmesinde Çift tıklama hızı çubuğunu yavaşa doğru çekin, Uygula'ya basın. Aynı pencereye Denetim Masası → Fare yoluyla da ulaşırsınız."
- **Öneri (adım 11'in doğru şıkkı):** "Ayarlar → Fare → Ek fare ayarları'ndan çift tıklama hızını yavaşlat". `odev1`'in ipucu da aynı biçimde düzeltilmeli. Ek olarak `denetim-masasi` adım 5'e "Gerçek çift tıklama hızı ayarı burada" cümlesi eklenebilir.

### 2. [YANLIŞ / GÜNCEL DEĞİL] Windows 11'in kısa sağ tık menüsü anlatılmıyor
- **Ders / adım:** `masaustu-duzen` 2; `dosyalar` 5 ve 10; `cop-kutusu` 4 ("menüden Sil"); `zip` 6; `windows-araclar` 2 ("Gönder → Masaüstü (kısayol oluştur)"); `odev6` görev 3 ve 4.
- **Sorun:** Windows 11'de bir dosyaya sağ tıklayınca kısa menü açılır. Üstte yazısız bir simge sırası vardır: Kes, Kopyala, Yeniden adlandır, Paylaş, Sil. "Gönder", "Kısayol oluştur" gibi eski maddeler yalnızca "Diğer seçenekleri göster" altındadır. Derste ise "sağ tık → Yeniden adlandır / Sil / Gönder" yazıyor; Windows 11 kullanan kursiyer bu yazıları göremez ve takılır. Zip için de Windows 11'in kısa menüsünde "ZIP dosyasına sıkıştır" gibi bir madde bulunur (tam Türkçe ifadeden emin değilim).
- **Öneri (`windows-araclar` adım 2 ipucuna):** "Windows 11'de menüde Gönder görünmüyorsa en alttaki Diğer seçenekleri göster'e tıklayın (ya da sağ tıklarken Shift tuşunu basılı tutun). Gönder orada."
- **Öneri (yeni kısa adım, `dosyalar` adım 5'ten sonra):** "Menüde yazı yerine küçük simgeler görüyorsanız şaşırmayın. Windows 11'de en üstteki sıra şudur: Kes, Kopyala, Yeniden adlandır, Paylaş, Sil. Simgenin üzerinde fareyi bekletirseniz adı çıkar. Eski, yazılı menü için Diğer seçenekleri göster'e tıklayın."

### 3. [EKSİK] Aynı adla kaydedince / kopyalayınca "üzerine yaz" uyarısı
- **Ders / adım:** `dosyalar` adım 9 (kopyala-yapıştır); `kayip-dosya`; `dosya-senaryo` (yeni soru). Ders kaynağında uyarı penceresi var (`dialog.js`: "… zaten var. Üzerine yazmak için…") ama hiçbir derste anlatılmıyor.
- **Sorun:** Gerçek hayatta çok sık: "dilekçe" adıyla yeni bir belgeyi kaydedince eskisinin üzerine yazılır ya da USB'den dosya kopyalarken "Hedefte aynı ada sahip dosya var" penceresi çıkar. Üç seçenek vardır (değiştir / atla / ikisini de tut). Kursiyer ya uyarıyı okumadan Evet der ve eski dosyayı kaybeder ya da panikler.
- **Öneri (`dosyalar` adım 9'a ipucu veya yeni adım):** "Aynı klasöre aynı adlı bir dosya yapıştırırsanız Windows sorar: Hedefteki dosyayı değiştir (eskisi silinir), Bu dosyayı atla (hiçbir şey olmaz), İki dosyayı da tut (yenisinin adına (2) eklenir). Emin değilseniz İki dosyayı da tut'u seçin; hiçbir şey kaybolmaz."
- **Öneri (`dosya-senaryo` yeni soru):** "Faturalar klasöründe 'Ekim' adlı belge var. Aynı adlı başka bir dosyayı kopyaladınız ve 'Değiştir mi?' sorusu çıktı. Hangisi güvenli? Doğru cevap: İki dosyayı da tut." Açıklama: "Değiştir derseniz eski dosya geri dönüşüm kutusuna bile gitmeden kaybolabilir."

### 4. [EKSİK] Zip, USB ya da e-posta ekinin içinden doğrudan açıp düzenlemek
- **Ders / adım:** `zip` adım 5 ("Tümünü ayıkla"); `dosyalar` adım 13–14 (USB).
- **Sorun:** Zip'e çift tıklayınca Windows içindekileri bir klasör gibi gösterir; kursiyer içindeki Word dosyasını açıp düzenler, kaydeder ve dosya "kayıp" olur (geçici bir klasöre gitmiştir). USB'den doğrudan açıp düzenlemek de aynı sorunu yaratır: USB çekilince değişiklikler ve dosya gider, bazen "kaydedilemedi" hatası çıkar. Ders yalnızca doğru yolu (ayıkla) gösteriyor, yanlış alışkanlığı uyarmıyor. Ayrıca ayıklanan klasörün nerede oluştuğu belirtilmiyor.
- **Öneri (`zip` adım 5'in altına):** "Zip'in içindeki bir dosyaya çift tıklayıp açmak mümkündür ama yapmayın: değişiklikleriniz kaybolabilir. Önce Tümünü ayıklayın. Ayıklanan klasör, zip dosyasının yanında (İndirilenler'de) aynı adla oluşur. Dosyayı oradan açın."
- **Öneri (`dosyalar` adım 14'ün altına):** "USB'deki dosyayı doğrudan açıp düzenlemeyin. Önce Belgeler'e kopyalayın, düzenleyin, bitince yeni hâlini USB'ye tekrar kopyalayın. Aksi hâlde belleği çekince çalışmanız kaybolabilir."
- **Küçük ek (`dosyalar` adım 15):** Güvenle çıkarma simgesi çoğu bilgisayarda görev çubuğunun sağındaki ^ (gizli simgeler) okunun altındadır. Ayrıca "ilerleme çubuğu bitmeden çıkarmayın."

### 5. [EKSİK] Dosyayı başka programla açmak ("Birlikte aç", varsayılan program)
- **Ders / adım:** `dosya-turleri` adım 6 ("Hangi programla?"). Yalnızca "bilgisayar kendisi açar" deniyor. Varsayılan program yalnızca tarayıcı için (`tarayicilar` adım 8) anlatılıyor.
- **Sorun:** Gerçek hayatta fotoğraf yanlış programda açılır, PDF tarayıcıda açılır, bir Word belgesi "Bu dosyayı nasıl açmak istiyorsunuz?" diye sorar ya da hiç açılmaz (program kurulu değil). Kursiyer ne yapacağını bilemez.
- **Öneri (`dosya-turleri` adım 6'ya ek ya da yeni adım):** "Dosya beklemediğiniz programda açıldıysa ya da 'Bu dosyayı nasıl açmak istiyorsunuz?' sorusu çıktıysa: dosyaya sağ tıklayın → Birlikte aç → istediğiniz programı seçin. Hep aynı programda açılsın istiyorsanız aşağıdaki 'Her zaman' kutusunu işaretleyin. Listede hiç uygun program yoksa dosya türüne bakın (örneğin .docx için Word ya da LibreOffice gerekir)."

### 6. [YETERSİZ] Windows Update: yeniden başlatma ve "kapatmayın" ekranı
- **Ders / adım:** `ayarlar` adım 14 (yalnızca "Güncelleştirmeleri denetle'ye tıklayın"); `ayarlar-parkur` 11; `odev7`. Hafta1'de yalnızca "güncellemeden sonra yeniden başlat" geçiyor.
- **Sorun:** Gerçek hayatta güncelleme şöyle görünür: kapatırken menüde "Güncelleştir ve kapat", açılırken "Güncelleştirmeler yapılıyor %37. Bilgisayarınızı kapatmayın", Ayarlar'da "Şimdi yeniden başlat". Kursiyer korkup düğmeden basılı tutarak kapatır ve bilgisayarı bozabilir. Derste bu ekran hiç görülmüyor.
- **Öneri (`ayarlar` adım 14'e ekleme):** "Güncelleme gelince bilgisayar kendiliğinden indirir; bitirmek için yeniden başlatmak gerekir. Şimdi yeniden başlat çıkarsa işinizi kaydedip tıklayın. Başlat → Güç menüsünde Güncelleştir ve kapat yazıyorsa onu seçin; bu normaldir. Açılırken 'Güncelleştirmeler yapılıyor, bilgisayarınızı kapatmayın' çıkarsa 10–30 dakika bekleyin; düğmeye basmayın, fişi çekmeyin. Yeniden başlatmayı geceye ertelemek isterseniz Zamanla'yı seçebilirsiniz."
- **Not (emin değilim):** "Etkin saatler" ayarının tam yolu (Windows 11: Windows Update → Gelişmiş seçenekler) sürüme göre değişir; derse eklenecekse gerçek makinede kontrol edin.

### 7. [EKSİK] İndirilen dosyayı açarken çıkan uyarılar: Korumalı Görünüm ve tarayıcı "tehlikeli olabilir"
- **Ders / adım:** `internet` adım 12 (İndirilenler); `dosya-turleri` (yeni adım); `odev8` görev 4. Hafta 10'da "Korumalı Görünüm" ya da "Düzenlemeyi etkinleştir" hiç geçmiyor (kodda arandı, yok).
- **Sorun:** İnternetten ya da e-postadan inen her Word/Excel belgesi gerçek Office'te sarı "KORUMALI GÖRÜNÜM … Düzenlemeyi Etkinleştir" şeridiyle açılır. Kursiyer yazı yazamaz, "bilgisayar bozuk" sanır. Öte yandan şeridin başka biçimi olan "İçeriği Etkinleştir" (makro) tehlikelidir. Tarayıcı da bazı indirmelerde "bu dosya zararlı olabilir / yaygın olarak indirilmiyor" diye sorar (tam ifade tarayıcıya göre değişir, emin değilim).
- **Öneri (yeni adım, `dosya-turleri` adım 6'dan sonra):** "İndirdiğiniz Word ya da Excel belgesi üstte sarı bir şeritle açılırsa buna Korumalı Görünüm denir: Windows dosyayı sizi korumak için salt okunur açtı. Dosyayı tanıyorsanız (torunun gönderdiği tarif, bankanın faturası) Düzenlemeyi Etkinleştir'e basın. Yalnızca 'İçeriği Etkinleştir' ya da 'Makroları etkinleştir' diyorsa basmayın; tanımadığınız kişiden geldiyse dosyayı hiç açmayın."
- **Öneri (`internet` adım 12'ye):** "İndirirken tarayıcı 'Bu dosya zararlı olabilir' derse, dosyayı resmî siteden kendiniz indirdiyseniz bile emin değilseniz Sil'e basın; yeniden resmî siteden deneyin."

---

## ORTA

### 8. [YETERSİZ] Yazıcı: "çevrimdışı", takılan iş, kağıt sıkışması, varsayılan yazıcı
- **Ders / adım:** `yazici` adım 3–6; `sorun-giderme` "Yazıcı yazmıyor" sorusu yalnızca temel kontrolü sayıyor.
- **Sorun:** Gerçek hayatta en sık: yazıcı "Çevrimdışı" görünür, bekleyen bir iş kuyrukta takılıp sonrakileri engeller, kağıt sıkışır, yanlış (örneğin eski ya da PDF) yazıcı seçili kalır. Derste yalnızca ekleme, test sayfası ve Ctrl + P anlatılıyor; yazıcının USB kabloyla mı Wi-Fi'yle mi bağlandığı hiç söylenmiyor.
- **Öneri (`yazici` adım 3'e ipucu):** "USB kablolu yazıcıyı bilgisayara takıp açınca Windows çoğunlukla kendisi tanır; Cihaz ekle'ye gerek kalmaz. Wi-Fi'li yazıcı ile bilgisayar aynı Wi-Fi ağında olmalıdır."
- **Öneri (yeni adım, adım 6'dan sonra, "Yazıcı yazmıyor: sırayla bakın"):** "1) Yazıcı açık mı, kablosu takılı mı, Wi-Fi'li ise bağlı mı? 2) Ayarlar → Bluetooth ve cihazlar → Yazıcılar ve tarayıcılar'da yazıcının altında 'Çevrimdışı' yazıyorsa yazıcıyı kapatıp açın. 3) Yazıcıya tıklayıp Yazdırma kuyruğunu açın; takılı kalmış iş varsa sağ tıklayıp İptal edin. 4) Kâğıt sıkıştıysa yazıcıyı kapatın, kapağı açın, kâğıdı yırtmadan yavaşça çekin. 5) Yazdır penceresinde doğru yazıcıyı seçtiğinizden emin olun; 'PDF olarak kaydet' kâğıda değil dosyaya yazdırır."

### 9. [EKSİK] Kurulumda gerçekte çıkan SmartScreen, yayımcı bilgisi ve "Hızlı/Özel" kurulum
- **Ders / adım:** `kurulum` adım 4 ("izin penceresi: siz indirdiyseniz Evet") ve adım 8 (ek yazılımlar).
- **Sorun:** Derste izin penceresi tek cevapla biter. Gerçekte ilk olarak mavi bir uyarı çıkabilir: "Windows bilgisayarınızı korudu / Microsoft Defender SmartScreen tanınmayan bir uygulamanın başlamasını engelledi" ("Ek bilgi → Yine de çalıştır"; tam ifadeden emin değilim). Kursiyer ya panikler ya da koşulsuz tıklar. Ayrıca izin penceresinde "Doğrulanmış yayımcı" yazıp yazmadığına bakmak öğretilmiyor. Bazı gerçek sihirbazlar ek yazılımı kutucuksuz, "Hızlı kurulum (önerilen)" arkasına gizler.
- **Öneri (adım 4'e):** "İzin penceresinde Doğrulanmış yayımcı: ve şirketin adı yazar (örneğin Google LLC). 'Bilinmeyen yayımcı' yazıyorsa ve programı resmî siteden indirmediyseniz Hayır deyin."
- **Öneri (yeni kısa adım, adım 4'ten önce):** "Bazen mavi bir pencere çıkar: 'Windows bilgisayarınızı korudu'. Bu, programın az kişi tarafından indirildiğini söyler. Programı kendiniz resmî siteden indirdiyseniz Ek bilgi → Yine de çalıştır diyebilirsiniz. Bilmediğiniz bir yerden geldiyse Çalıştırma deyin."
- **Öneri (adım 8'e):** "Sihirbaz 'Hızlı kurulum (önerilen)' ve 'Özel kurulum' diye ikiye ayrılıyorsa Özel'i seçin; ek yazılımlar orada görünür."

### 10. [YETERSİZ] Windows 10 kullananlar için yollar ve adlar
- **Ders / adım:** `masaustu` adım 1 ("Başlat görev çubuğunun ortasında"); `fare-ayar`, `yazici`, `bluetooth` ("Bluetooth ve cihazlar"); `okuma-kolay`, `ekran-klavyesi`, `ayarlar` adım 13 ("Erişilebilirlik"); `temalar` adım 11 ("simgeleri sola hizala"); `ayarlar` adım 14 ("Windows Update"); `saat-tarih` adım 10.
- **Sorun:** Bütün dersler Windows 11 adlarıyla yazılmış; Windows 10 yolu yalnızca ödev kâğıtlarında parantez içinde. Windows 10 hâlâ yaygın (destek bitti ama makineler çalışıyor). Windows 10'da Başlat sol altta, "Bluetooth ve cihazlar" yerine "Aygıtlar", "Erişilebilirlik" yerine "Erişim Kolaylığı", "Windows Update" yerine "Güncelleştirme ve Güvenlik" vardır; simgeleri sola hizalama ayarı hiç yoktur çünkü zaten soldadır. `saat-tarih` adım 10'daki "24 saatlik biçim" düğmesi de gerçekte Ayarlar → Saat ve dil → Dil ve bölge → Bölgesel biçim yolundadır (emin değilim, kontrol edilmeli).
- **Öneri (`masaustu` adım 1'e kutu):** "Windows 10 kullanıyorsanız Başlat düğmesi ekranın sol alt köşesindedir. Bu derslerde 'Bluetooth ve cihazlar' yazıyorsa Windows 10'da 'Aygıtlar', 'Erişilebilirlik' yazıyorsa 'Erişim Kolaylığı', 'Windows Update' yazıyorsa 'Güncelleştirme ve Güvenlik' bakın. Eğitmeniz size ayrıca gösterecektir."
- **Öneri:** `temalar` adım 11'e "Bu ayar yalnızca Windows 11'de vardır" notu.

### 11. [EKSİK] Masaüstü bilgisayarda parlaklık, Wi-Fi ve pil yok
- **Ders / adım:** `ayarlar` adım 7 (parlaklık), 8–9 (Wi-Fi); `ayarlar-parkur` 5; `odev7` görev 4 ve 6.
- **Sorun:** Ayarlar'daki Parlaklık çubuğu çoğu masaüstü bilgisayarda (harici monitör) hiç çıkmaz; parlaklık monitörün kendi düğmeleriyle ayarlanır. Kablolu bağlı masaüstünde Wi-Fi anahtarı bile olmayabilir; ağ simgesi bir kablo ya da bilgisayar çizimidir. Kursiyer "benim ekranımda bu yok" der ve kendini eksik hisseder. `odev7` yalnızca dizüstü için "güneş tuşları"nı söylüyor.
- **Öneri (`ayarlar` adım 7'ye ipucu):** "Masaüstü bilgisayarda bu çubuğu görmeyebilirsiniz. Parlaklık monitörün alt ya da yan kenarındaki küçük düğmelerle ayarlanır (menü düğmesine basıp Parlaklık'ı seçin)."
- **Öneri (`ayarlar` adım 8'e ipucu):** "Bilgisayarınız modeme kabloyla bağlıysa Wi-Fi açık olmayabilir; sağ alttaki simge Wi-Fi yerine kablo/bilgisayar olur. İnternet çalışıyorsa sorun yok."

### 12. [EKSİK] OneDrive: dosyalar "Belgeler"de değil bulutta görünüyor
- **Ders / adım:** `dosyalar` adım 3; `kayip-dosya` adım 4–5; `klasor-agaci`. Derslerde OneDrive hiç yok.
- **Sorun:** Microsoft hesabıyla kurulmuş Windows 11 bilgisayarda Masaüstü, Belgeler ve Resimler klasörleri çoğunlukla OneDrive'a yönlendirilmiştir. Dosya Gezgini'nin adres çubuğunda "OneDrive › Belgeler" yazar, dosyaların yanında bulut/yeşil tik simgeleri olur. "Dosya OneDrive'a yedeklendi", "depolama alanı dolu" bildirimleri çıkar. Kursiyer yolu anlamaz; bulut simgeli dosya internet yokken açılmaz; OneDrive'dan silince başka cihazlarda da silinir.
- **Öneri (`kayip-dosya` adım 4'ün hemen altına):** "Adres çubuğunda OneDrive yazıyorsa dosyanız hem bilgisayarda hem internetteki OneDrive hesabınızdadır. Bu zararlı değildir, hatta yedek sağlar. Yeşil tik: dosya bilgisayardadır. Bulut simgesi: dosya yalnızca internette; açmak için internet gerekir. Bir dosyayı OneDrive'dan silerseniz başka cihazlarda da silinir."

### 13. [EKSİK] Windows girişinde PIN ya da parola unutulursa
- **Ders / adım:** `hesap-pin` adım 3–7. `sifre-sifirla` (hafta9) yalnızca web sitesi şifresini anlatıyor.
- **Sorun:** PIN koymayı öğretiyor ama unutulduğunda ne olacağını söylemiyor. Yaşlılarda en sık tuzak budur. Ayrıca Microsoft hesabıyla kurulu bir bilgisayarda parolayı Ayarlar'dan değil hesabın internet sayfasından değiştirmek gerekebilir (emin değilim, gerçek makinede doğrulanmalı).
- **Öneri (yeni adım, adım 5'ten sonra):** "PIN'inizi unutursanız giriş ekranında PIN'imi unuttum yazısı çıkar. Ona tıklayınca Microsoft hesabınıza bağlı e-posta ya da telefona bir kod gelir; yeni PIN'i bununla belirlersiniz. Bu yüzden e-posta adresinizi ve telefon numaranızı güncel tutun. Yerel hesapta (internetsiz) kurtarmanın kolay bir yolu yoktur; PIN'i güvenli bir yere yazın."

### 14. [GÜNCEL DEĞİL] Chrome'da kilit simgesi artık yok
- **Ders / adım:** `adres` adım 3, 8, 10, 12; `odev8` görev 2 ("🔒 kilide tıklayın").
- **Sorun:** Chrome, 2023'ten beri kilit yerine iki kaydırıcı çizgili bir "Site bilgileri" simgesi gösterir. Edge ve Firefox kilidi korudu. Kursiyerin tarayıcısı Chrome ise "kilit nerede?" diye durur. Chrome ayrıca adresin başındaki https:// kısmını gizler, bu yüzden adres bu dersteki örnekteki gibi görünmez.
- **Öneri (`adres` adım 3'e ipucu):** "Chrome'da kilit yerine iki çizgili küçük bir simge görürsünüz; aynı yere tıklayın. Chrome adresin başındaki https:// kısmını göstermeyebilir; önemli olan alan adıdır."

---

## DÜŞÜK

### 15. [EKSİK] Programı görev çubuğuna sabitlemek; kaybolan masaüstü simgeleri
- **Ders / adım:** `masaustu` adım 2–6 ve `masaustu-duzen`. "Sabitle" ifadesi hiçbir derste yok (kodda arandı, `isletim-sistemleri` içindeki yalnızca görsel "Sabitlenmiş" etiketi dışında).
- **Sorun:** Her gün kullanılan program (tarayıcı, Word) için kestirme yok; kursiyer her seferinde Başlat'a girip yazıyor. Ayrıca torun ya da yanlış bir tıklama masaüstü simgelerini gizlediğinde kursiyer "dosyalarım silindi" sanır.
- **Öneri (`masaustu` adım 5'ten sonra yeni adım):** "Sık kullandığınız programı hep görev çubuğunda tutmak için: Başlat'ta programı bulun, sağ tıklayın, Görev çubuğuna sabitle'yi seçin. Kaldırmak için simgeye sağ tıklayıp Görev çubuğundan kaldır deyin. Masaüstündeki bütün simgeler birden kaybolduysa masaüstüne sağ tıklayın → Görünüm → Masaüstü simgelerini göster; dosyalarınız silinmemiştir."

---

## Yeni ders fikirleri (en fazla 3)

1. **"İndirdim ama açılmıyor!" (20–25 dk, hafta 8 sonu).** Yukarıdaki 4., 5. ve 7. bulguyu tek senaryoda toplar: zip içinden açma tuzağı, "Bu dosyayı nasıl açmak istiyorsunuz?" penceresi, Korumalı Görünüm şeridi, tarayıcı indirme uyarısı. Her biri için tek ekranlı sahte pencere ve "ne yaparsınız?" sorusu.
2. **"Yazıcı yazmıyor!" (15–20 dk).** 8. bulgudaki sırayla: açık mı, çevrimdışı mı, kuyrukta takılı iş, kâğıt sıkışması, doğru yazıcı. Yazdırma kuyruğu penceresinin sahtesi yeter.
3. **"Bilgisayar güncelleniyor, kapatmayın" (10–15 dk).** Güç menüsünde "Güncelleştir ve kapat", "Güncelleştirmeler yapılıyor %37" ekranı ve ardından açılış. Ekranda geri sayım yok; tek ders, tek kural: bekleyin, fişi çekmeyin. 6. bulguyu `ayarlar`'a sığdıramazsanız ayrı ders olur.

---

## Emin olamadığım, bulgu saymadığım noktalar (gerçek makinede bakılmalı)

- `takvim-randevu`: Microsoft'un eski "Posta ve Takvim" uygulaması 2024 sonunda kalkıp yeni Outlook'a geçti. Güncel Windows 11'de Başlat'ta "Takvim" yazınca bu dersteki uygulama bulunmayabilir.
- `windows-araclar` adım 6: Sistem Geri Yükleme bazı bilgisayarlarda varsayılan olarak kapalıdır ("Sistem Koruması: Kapalı"). Derse "kapalıysa Yapılandır'dan açın" eklenebilir.
- `masaustu` adım 7: Windows 11'de saatin sağındaki "masaüstünü göster" köşesi sürüme göre varsayılan olarak kapalı olabilir; çalışmazsa ⊞ + D yedek olarak yazılmalı.
- `bluetooth`/`ayarlar`: Wi-Fi'ye en çok kullanılan yol sağ alttaki ağ simgesidir (Ayarlar değil); `ayarlar` adım 8–9'a "Günlük yol: sağ alttaki ağ simgesi → Wi-Fi'nin yanındaki ok → ağı seçip Bağlan" cümlesi eklenebilir. Ev ağında "EvAğı" ve "EvAğı_5G" gibi iki ad görülmesi de açıklanabilir.
