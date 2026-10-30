# 1–4. hafta: gerçek bilgisayarda eksik ya da yetersiz kalanlar

Tarih: 2026-10-30. Kaynak: `dokum-2026-10-30.md` (7–567. satırlar) ve ilgili `src/dersler/lessons/*.js` dosyaları (dökümde görünmeyen test soruları ve adımların devamı için). Hiçbir kod değiştirilmedi.

Her bulgu için: öncelik, tür (yanlış / eksik / yetersiz), ders (id) ve adım, sorun, önerilen metin. Adım numaraları dökümdeki numaralardır. Önerilen metinler "siz" hitabıyla yazıldı, olduğu gibi derse konabilir.

"Emin değilim" yazanlar, Windows ya da Notepad'in gerçek davranışından tam emin olmadığım yerlerdir; sınıftaki gerçek bilgisayarda bir kez denenmeli.

## Özet

| Öncelik | Sayı | Bulgular |
|---|---|---|
| YÜKSEK | 5 | B1–B5 |
| ORTA | 7 | B6–B12 |
| DÜŞÜK | 2 | B13–B14 |

---

## YÜKSEK

### B1. "Bilgisayar donduysa güç düğmesine 5–10 sn basın" kuralı, güncelleme ve yavaş açılışla karışıyor
- Tür: yetersiz (zarar verebilecek biçimde)
- Ders / adım: `ackapa`, adım 11 "Neden fişten çekilmez?" (kutudaki "Bilgisayar tamamen donduysa?"). Ayrıca `odev1` Görev 1 ipucu.
- Sorun: Kutu, "fare de klavye de çalışmıyorsa" güç düğmesini basılı tutmayı söylüyor. Ama Windows güncelleme yüklerken ("Güncelleştirmeler yükleniyor %37, bilgisayarınızı kapatmayın") ya da yavaş açılırken de fare ve klavye çalışmaz; bilgisayar donmamıştır. Aynı dersin 11. adımı "güncelleme yarım kalırsa bilgisayar açılmayabilir" diyor, ama kursiyer donma ile beklemeyi ayıramıyor. Güç menüsündeki "Güncelleştir ve kapat" / "Güncelleştir ve yeniden başlat" seçenekleri de hiçbir yerde gösterilmiyor (hafta 7 ödevinde yalnızca "güncelleme sırasında kapatmayın" geçiyor).
- Öneri: 11. adımdaki kutuyu şununla değiştirin:
  > **Bilgisayar donduysa güç düğmesine basmadan önce:**
  > 1. Ekranda "Güncelleştirmeler yükleniyor" ya da dönen noktalar varsa bilgisayar **donmamıştır**, çalışıyordur. "Bilgisayarınızı kapatmayın" yazıyorsa bekleyin; bu 10–30 dakika sürebilir.
  > 2. Caps Lock tuşuna bir kez basın. Işık yanıp sönüyorsa bilgisayar çalışıyor demektir, biraz daha bekleyin.
  > 3. Işık tepki vermiyorsa ve ekran 5 dakikadır hiç değişmiyorsa bilgisayar donmuştur. O zaman güç düğmesini 5–10 saniye basılı tutun. Bu son çaredir.
  > Tek bir program donduysa bilgisayarı kapatmanıza gerek yok: 5. haftada göreceğimiz Görev Yöneticisi ile o programı kapatırsınız.
- Ek (7. adım "Üç seçenek ne demek?" altına): "Başlat → ⏻ menüsünde Kapat'ın yerine **Güncelleştir ve kapat** yazıyorsa bilgisayar güncelleme bekliyor demektir. Onu seçin; bilgisayar güncellemeyi yapıp kapanır."
- Not: Caps Lock ışığı testi, ışığı bilgisayar (işletim sistemi) yaktığı için çalışır. Işığı olmayan klavyelerde Num Lock ışığı ya da hiç ışık yoksa "5 dakika bekleyin" kuralı yeter.

### B2. 1. hafta Windows 11'e göre anlatılıyor; Windows 10'da Başlat ve ⏻ başka yerde, haftalarca söylenmiyor
- Tür: yanlış (Windows 10 kullanan için) / eksik
- Ders / adım: `ackapa` adım 5 ("Ortasındaki dört kareli simge Başlat'tır") ve adım 6 ("Başlat menüsünün sağ alt köşesinde ⏻"); `odev1` Görev 6; `pencereler` ve `parkur` ("Başlat'tan Not Defteri").
- Sorun: Windows 10'da Başlat düğmesi görev çubuğunun **sol ucundadır**, ⏻ ise Başlat menüsünün **sol kenarındaki** dar şeritte, dişli (Ayarlar) simgesinin altındadır. Kursiyerin evdeki bilgisayarı Windows 10 ise 1. hafta ödevinde "ortada" ve "sağ alt" diye arayıp bulamaz. Windows 10/11 farkı ilk kez 8. haftada (işletim sistemi benzetimleri) anlatılıyor; 5. hafta masaustu dersi de yalnızca "ortasında" diyor.
- Öneri:
  - Adım 5'e ekleyin: "Windows 11'de Başlat düğmesi ortadadır. Windows 10'da en solda, sol alttadır. Hangisi sizdeyse onu kullanın; ikisi de aynı işi yapar."
  - Adım 6'ya ekleyin: "Windows 10'da ⏻ işareti Başlat menüsünün sol kenarındaki dar şeritte, en altta (dişli simgesinin altında) durur."
  - `odev1`, giriş adımına ekleyin: "Bilgisayarınızda Başlat düğmesi ekranın altında ortada mı, solda mı? Bunu kâğıda yazın; Windows 11 ortada, Windows 10 solda olur."
  - Kalıcı çözüm: `ackapa` benzetimine "Windows 10 görünümü" seçeneği (8. haftadaki Windows 10 benzetimi hazır).

### B3. Çift tık zor gelince çıkış yolu yanlış tarif ediliyor, kolay bir yedek yol hiç öğretilmiyor
- Tür: yanlış + eksik
- Ders / adım: `fare2` adım 1 ve 3 (çift tık "başta herkesi zorlar, acele etmeyin" der ama çözüm vermez); `odev1` Görev 3 (adım 4) ipucu: "Ayarlar → Fare'den çift tıklama hızını yavaşlatın".
- Sorun:
  1. Gerçek Windows 10/11'de "Fare" sayfasında çift tıklama hızı çubuğu **yoktur**. Çubuk, sayfadaki **Ek fare ayarları** (Windows 10'da "Ek fare seçenekleri") bağlantısıyla açılan eski "Fare Özellikleri" penceresinin **Düğmeler** sekmesindedir. Ödev ipucu bu yüzden kursiyeri çıkmaza sokar. (Yüksek güvenle böyle; emin değilim kısmı yalnızca menü adlarının birebir yazılışı.) 7. haftadaki `fare-ayar` dersi çubuğu doğrudan Fare sayfasında gösteriyor; benzetim gerçeğe uymuyor, o ders de buna göre düzeltilmeli.
  2. Çift tıklayamayan biri için en kolay yol hiç anlatılmıyor: simgeyi tek tıkla seçip **Enter**'a basmak.
- Öneri:
  - `fare2` adım 1'e ekleyin: "Çift tık hâlâ zor geliyorsa şu yolu kullanın: simgeye **bir kez** tıklayın (seçilir), sonra klavyede **Enter**'a basın. Çift tıkla aynı işi yapar."
  - `odev1` Görev 3 ipucunu değiştirin: "Çift tıklamak zor geliyorsa: simgeyi bir kez tıklayıp Enter'a basın. Hızı yavaşlatmak için: Ayarlar → Bluetooth ve cihazlar → Fare → Ek fare ayarları → Düğmeler sekmesi → 'Çift tıklama hızı' çubuğunu sola çekin (Windows 10'da: Ayarlar → Aygıtlar → Fare → Ek fare seçenekleri). 7. haftada bunu birlikte yapacağız."

### B4. Dizüstüde touchpad ile sürükleme ve yazı seçme hiç anlatılmıyor
- Tür: eksik
- Ders / adım: `dizustu` (tek parmak, tık, sağ tık, kaydırma, yakınlaştırma var; sürükleme yok); `surukle` adım 1 ("sol tuşa basın ve basılı tutun"); `secme` adım 2 ("sol tuşu basılı tutup sürükleyin").
- Sorun: 3. hafta seçme dersi ve pencere taşıma, masaüstündeki simgeyi taşıma hep "tuşu basılı tutup kaydırın" der. Fare kullanan için kolay, touchpad'de ise tuşa basıp aynı elle kaydırmak yeni başlayan için çok zor. Dizüstü kullanan kursiyer 1. haftadan itibaren takılır ve "bu iş bana göre değil" diye düşünür.
- Öneri: `dizustu`'ya, "Hangi hareket?" adımından önce yeni bir adım ekleyin: **"Sürükleme ve seçme"**
  > Touchpad'de bir şeyi sürüklemek için iki kolay yol var:
  > 1. **İki el:** Bir elinizin başparmağıyla touchpad'in sol alt köşesine basılı tutun, öbür elinizin işaret parmağıyla yüzeyde kaydırın. Bırakınca yazı ya da simge yerinde kalır.
  > 2. **Tek el:** Parmağınızla iki kez hızlıca dokunun; ikinci dokunuşta parmağınızı kaldırmadan kaydırın. Bu ayar bazı bilgisayarlarda kapalıdır; çalışmazsa 1. yolu kullanın.
  > Bu yöntem yazı seçerken, pencere taşırken ve simge sürüklerken aynıdır.
  
  Ardından bir soru ekleyin: "Yazının bir kısmını touchpad ile seçmek için ne yaparsınız?" Ayrıca `surukle` adım 1'e kısa not: "Dizüstü kullanıyorsanız 'basılı tutma' için 1. haftadaki touchpad dersine bakın."
- Not: İkinci yöntem Windows'ta çoğunlukla varsayılan açıktır, ama emin değilim; sınıftaki dizüstüde denenmeli.

### B5. Dosya "Belgeler" ama hangi Belgeler? OneDrive hiç geçmiyor
- Tür: eksik
- Ders / adım: `kaydet-pratik` adım 3 ("Belgeler'e kaydedin"), adım 7; `odev3` Görev 4; `notdefteri` adım 15.
- Sorun: Kursun hiçbir yerinde "OneDrive" kelimesi geçmiyor. Microsoft hesabıyla kurulmuş Windows 10/11 bilgisayarlarda Masaüstü, Belgeler ve Resimler klasörleri çoğu zaman OneDrive'a bağlıdır. Kaydet penceresinde yol "OneDrive > Belgeler" görünür; sol listede "OneDrive" ayrıca vardır. Kursiyer "Belgeler'e kaydettim, bulamıyorum" ya da "iki tane Belgeler var" diye şaşırır. Dosyaların internette (OneDrive'da) durması da bilinmediği için bazıları bunu sonradan fark edip korkar. Benzetimde yalnızca düz "Belgeler" var, gerçekte gördükleri farklı. (Sınıf bilgisayarlarında OneDrive olup olmadığını ben görmedim; emin değilim, ama ev bilgisayarlarında çok yaygındır.)
- Öneri: `kaydet-pratik` adım 3'ün sonuna ekleyin:
  > **Gerçek bilgisayarda:** Kaydet penceresinin üstündeki yol çubuğunu okuyun. "Bu bilgisayar > Belgeler" ya da "OneDrive > Belgeler" yazabilir. İkisi de Belgeler klasörüdür; ama OneDrive'dakiler internette de saklanır ve Microsoft hesabınıza bağlıdır. Hangisi çıkıyorsa her seferinde aynısına kaydedin, böylece dosyalarınız tek yerde olur.

  Kısa bir yeni ders fikri için aşağıda "Yeni ders fikirleri / 3" bölümüne bakın.

---

## ORTA

### B6. "Kaydetmek istiyor musunuz?" sorusunun üç düğmesi ilk haftalarda anlatılmıyor; üstelik "Kaydetme deyin" alışkanlığı veriliyor
- Tür: yetersiz
- Ders / adım: `parkur` adım 10 ("9. Kaydetmeden kapatın… Kaydetme deyin"), `notdefteri` adım 18, `masaustu` adım 10, `ackapa` adım 11. Soru ve düğmelerin anlamı ancak 8. haftada (pencere oyunları, "Oyun 5: Kaydedilsin mi?") işleniyor. 3. haftadaki test (`test3`) bu soruyu içermiyor; ilgili soru (`kopya-oyun`, "Kapatırken çıkan soru") müfredata bağlı değil.
- Sorun: Kursiyer 1.–7. haftalar boyunca "Kaydetme deyin"i tekrar tekrar yapıyor; düğmelerin anlamını bilmeden. Gerçek işinde yazdığı şeyi "Kaydetme" ile kaybedebilir. Bu, gerçek hayatta en çok veri kaybettiren hatalardan biri.
- Öneri:
  - `kaydet-pratik`'e (adım 7'den sonra) yeni adım **"Kapatırken çıkan soru"**:
    > Bir pencereyi kapatırken "Değişiklikler kaydedilsin mi?" diye sorarsa:
    > • **Kaydet:** yazdıklarınız saklanır.
    > • **Kaydetme:** yazdıklarınız silinir, geri gelmez.
    > • **İptal:** vazgeçtiniz, pencere açık kalır.
    > Emin değilseniz **İptal**'e basın, sonra durumu düşünün.
  - `parkur` adım 10, `notdefteri` adım 18 ve `masaustu` adım 10 metinlerine ekleyin: "(Bu derste yazdıklarımız deneme olduğu için Kaydetme diyoruz. Gerçek bir yazı yazdıysanız Kaydet'e basın.)"
  - `test3`'e bu soruyu ekleyin ("Kaydetme'ye basarsanız ne olur?").

### B7. "Kapat tamamen kapanır" deniyor; Windows'ta "Kapat" ile "Yeniden başlat" aynı değil
- Tür: yanlış (kısmen)
- Ders / adım: `ackapa` adım 7 (Kapat: "Bilgisayar tamamen kapanır"), `test1` "Yeniden başlat" sorusu, `sorun-giderme` adım 1.
- Sorun: Windows 10/11'de "Hızlı Başlatma" varsayılan olarak çoğu bilgisayarda açıktır. "Kapat" bilgisayarı tam sıfırlamaz; sistemin bir kısmını bir sonraki açılışı hızlandırmak için saklar. Bu yüzden "bilgisayar takıldı, kapatıp açtım, yine aynı" olur; asıl temizleyen **Yeniden başlat**'tır. Dersteki "Yeniden başlat yavaşlayınca işe yarar" bilgisi doğru, ama "Kapat tamamen kapanır" cümlesi bunu gizliyor. (Hızlı Başlatma ayarı bilgisayardan bilgisayara değişebilir; ana fikir yüksek güvenle doğru.)
- Öneri: adım 7'de Kapat satırını şöyle yazın: "Bilgisayar kapanır. Gün sonunda ya da uzun süre kullanmayacaksanız. **Not:** Windows, kapatırken sistemin bir kısmını hazır tutar. Bilgisayar takılıyorsa kapatıp açmak yetmeyebilir; **Yeniden başlat** daha etkilidir."

### B8. Uyku: nasıl uyandırılır, ve elektrik kesilirse ne olur
- Tür: eksik
- Ders / adım: `ackapa` adım 7 ve 8 ("Fareyi oynatınca hemen uyanır"); `test1` "Uyku" sorusu ("açık işlerimiz kaybolmasın istiyoruz → Uyku").
- Sorun:
  1. Gerçekte dizüstünün çoğu fareyle (touchpad) uyanmaz; klavyede bir tuşa ya da güç düğmesine **kısa** basmak gerekir. Kursiyer "bozuldu" sanıp düğmeye art arda basar ya da basılı tutar, bilgisayarı kapatır. Ekranın uyanması birkaç saniye sürebilir.
  2. Uykuda bilgisayar bellekteki işi elektrikle tutar. Elektrik kesilirse (masaüstü, ya da pili biten dizüstü) kaydedilmemiş iş kaybolur. Ders "açık işlerimiz kaybolmasın → Uyku" diyor; bu eksik bilgi yanıltıcı.
- Öneri: adım 8 sonuna ekleyin:
  > **Gerçek bilgisayarda:** Uyandırmak için fareyi oynatın ya da klavyede bir tuşa basın. Dizüstüyse kapağı açın. Uyanmazsa güç düğmesine **bir kez, kısaca** basın ve birkaç saniye bekleyin; art arda basmayın. Uykuda bilgisayar az da olsa elektrik kullanır; elektrik kesilirse kaydetmediğiniz işler gider. Uykuya yatırmadan önce işinizi kaydedin (Ctrl + S).

### B9. Ctrl, Alt ve Windows tuşunun yeri 2. haftada gösterilmiyor; 3. haftada kullanılıyor
- Tür: eksik
- Ders / adım: `klavye` (adım 15'ten sonra); `notdefteri` adım 1 ("Klavyedeki ⊞ Windows tuşuna basın" ama yeri söylenmiyor), `klavye-dili` (Alt + Shift).
- Sorun: Klavye dersi Boşluk, Enter, Shift, Caps Lock, AltGr, Home/End, Tab, Esc'i tanıtıyor ama kısayolların temeli olan **Ctrl**'ü, **Alt**'ı ve **Windows tuşunu** tanıtmıyor. Windows tuşunun yeri ("Ctrl ile Alt arasında") yalnızca 5. haftada geçiyor; oysa 3. haftanın ilk adımı bu tuşu kullanıyor.
- Öneri: `klavye`'ye adım 15'ten sonra yeni adım **"Alt sıradaki tuşlar"**:
  > Klavyenin en alt sırasında, boşluk çubuğunun solunda sırayla şunlar var: **Ctrl**, **⊞ Windows** (pencere işareti), **Alt**. Dizüstünde Ctrl'nin yanında bir de **Fn** olur. Boşluğun sağında **AltGr** vardır.
  > • **Ctrl:** başka bir tuşla birlikte basılır (kopyala, kaydet gibi). Tek başına bir şey yapmaz.
  > • **⊞ Windows:** bir kez basın, Başlat menüsü açılır. Bir daha basın, kapanır.
  > • **Alt:** menü ve pencere kısayollarında kullanılır.
  > Ctrl, Alt ve Shift'in solda da sağda da birer tane olduğunu fark edin; ikisi de aynı işi yapar.

### B10. "Ses yok": ses başka bir yere gidiyor olabilir (televizyon, Bluetooth kulaklık)
- Tür: eksik
- Ders / adım: `sorun-giderme` adım 4 "Ses yok"
- Sorun: Kontrol listesi sessiz/kısık/kulaklık/video sesini sayıyor; ama ev kullanıcısında en sık neden: bilgisayar HDMI ile televizyona bağlıyken ya da Bluetooth kulaklık/hoparlör hâlâ bağlıyken sesin **o cihaza** gitmesi. Sağ alttaki ses simgesi "açık" görünür ama hoparlörden ses gelmez. Dökümde "ses çıkış aygıtı seçme" hiçbir yerde yok (7. haftada Bluetooth dersi bağlamayı anlatıyor, ama sorun gidermede kullanılmıyor).
- Öneri: adım 4'ün açıklamasına ekleyin: "Hâlâ ses yoksa sesin başka bir cihaza gitmesi olabilir: televizyon (HDMI) ya da Bluetooth kulaklık bağlıdır. Sağ alttaki 🔊 simgesine tıklayın; ses çubuğunun yanındaki ok simgesine basıp listeden 'Hoparlör' ya da kendi hoparlörünüzü seçin." (Windows 10 ve 11'de listenin açılış yeri biraz farklı olabilir; menü adlarından emin değilim.)

### B11. Sorun giderme, öğretilmemiş araçlara gönderme yapıyor ve yaygın yavaşlık sorununu atlıyor
- Tür: yetersiz
- Ders / adım: `sorun-giderme` adım 7 "Donan program", adım 10 "Hiçbiri olmadı" (ve özet satırı 6).
- Sorun:
  - Adım 7: "Programı kapatırım" diyor ama **nasıl** kapatılacağını söylemiyor. Cevap 5. haftadaki Görev Yöneticisi (`gorev`).
  - Adım 10: "Ekranın resmini çekin (Ekran Alıntısı)" öneriyor; Ekran Alıntısı ancak 7. haftada öğretiliyor. 4. haftadaki kursiyer ne yapacağını bilemez.
  - "Bilgisayar çok yavaş" gündelik yaygın bir şikâyet; ders kapsamıyor (5. hafta `gorev-ayrinti` var ama burada gönderme yok).
- Öneri:
  - Adım 7 açıklamasına: "Program hâlâ kapanmıyorsa 5. haftada öğreneceğimiz Görev Yöneticisi ile (Ctrl + Shift + Esc) kapatırsınız."
  - Adım 10 açıklamasına: "Ekran Alıntısı'nı henüz görmedik. Şimdilik telefonunuzla ekranın fotoğrafını çekin; yardım edecek kişiye onu gösterin."
  - Yeni kısa soru **"Bilgisayar çok yavaş"**: doğru cevap: "Önce Yeniden başlat; olmazsa açık program ve sekmeleri azaltın, diskin dolu olup olmadığına bakın (Bu bilgisayar'daki mavi çubuk). Daha fazlasını 5. haftada göreceğiz."

### B12. Açılmayan bilgisayar: takılı USB bellek / İngilizce siyah ekran
- Tür: eksik
- Ders / adım: `sorun-giderme` adım 2 "Kapkara ekran" (mevcut yalnızca ekran düğmesi ve uyku ihtimali)
- Sorun: Gerçek bilgisayarlarda sık görülen bir durum: açılışta siyah ekranda beyaz İngilizce yazılar çıkıp ilerlememesi (ör. "Operating system not found", "Insert boot media", "Press any key"). Çoğu zaman kasada unutulmuş USB bellek, CD/DVD ya da harici disk yüzündendir. Kursiyer bunu "bilgisayar bozuldu" diye algılar. 4. haftada USB bellek takmayı öğrenen biri tam bu hataya açıktır.
- Öneri: adım 2 açıklamasına ekleyin: "Bilgisayar açılırken siyah ekranda İngilizce yazılar çıkıp ilerlemiyorsa: bilgisayara takılı USB bellek, CD/DVD ya da harici disk var mı bakın. Varsa çıkarın, güç düğmesini basılı tutarak kapatıp bilgisayarı yeniden açın." Aynı uyarıyı `portlar` dersinde "Girmeyen USB" sorusunun sonuna kısa bir cümleyle ekleyin: "Bilgisayarı kapatıp açmadan önce takılı USB belleği çıkarmak iyi bir alışkanlıktır."

---

## DÜŞÜK

### B13. "Insert tuşu / Üzerine yaz (INS)" anlatımı gerçek Not Defteri'nde görünmeyebilir; Not Defteri'nin yeni sürümü farklı davranıyor olabilir
- Tür: yanlış olabilir (emin değilim)
- Ders / adım: `yazi-sorun` adım 3, 4, 10; `notdefteri` adım 15, 16, 18 (Kaydet / Yeni / kapatınca soru)
- Sorun:
  - Klasik Windows 10 Not Defteri'nde "üzerine yaz" kipi yoktur, Insert tuşu bir şey yapmaz. Word'de de Insert tuşu varsayılan olarak kapalıdır. Yeni Windows 11 Not Defteri'nde durum çubuğunda INS göstergesi olup olmadığından emin değilim. Kursiyer evde "harfler yutuluyor" durumunu Insert sanıp aramaya kalkarsa bulamayabilir. Ders gerçek bir durumu anlatıyor (bazı programlarda ve form alanlarında olur), ama "Not Defteri'nde de böyle olur" izlenimi veriyor.
  - Windows 11'in yeni Not Defteri sekmelidir ve kapatırken yazıyı sormadan kaydedip bir sonraki açılışta geri getirebilir (oturumu hatırlama). Ders ise her zaman "Kaydetmek istiyor musunuz?" sorusunu varsayıyor. (Bu davranıştan emin değilim; sürüme göre değişir.)
- Öneri: Sınıftaki gerçek bilgisayarda Not Defteri sürümüne bakıp deneyin. `yazi-sorun` adım 4'e güvenli bir cümle ekleyin: "Bazı programlarda Insert tuşu yazının üstüne yazmaya geçirir. Her programda olmaz; ama harfler yutuluyorsa Insert'e bir kez basmak denenecek ilk şeydir." `notdefteri`'ye: "Not Defteri'nin yeni sürümlerinde üstte sekmeler vardır; yeni sayfa için + simgesine basın. Kapatırken soru sormayabilir; yine de önemli yazıları Ctrl + S ile kaydedin."

### B14. Yazı sorunları listesinde eksik üç durum
- Tür: eksik
- Ders / adım: `yazi-sorun` (adım 8–10 civarı yeni adım ya da sonuna "Bunlar da olabilir" kutusu)
- Sorun: Gerçek hayatta sık görülen ama kapsanmayan üç durum (Yapışkan Tuşlar kursun hiçbir yerinde geçmiyor):
  1. **Harfler yerine rakam çıkıyor** (J K L yerine 1 2 3; U I O yerine 4 5 6): küçük dizüstülerde Num Lock açılınca olur. Mevcut ders yalnızca "sayı yazılmıyor" (kapalı Num Lock) durumunu anlatıyor.
  2. **Bir tuşa uzun basınca harf çoğalıyor** ("aaaaaaa", özellikle yaşlıların elinde): tuşa basıp hemen bırakmak gerek; hızı ayarlardan değiştirmek de mümkün.
  3. **Shift'e art arda 5 kez basınca ya da Shift'i uzun tutunca "Yapışkan Tuşlar" penceresi çıkıyor** ve kursiyer ne olduğunu anlamıyor.
- Öneri: `yazi-sorun`'a "Bunlar da olabilir" adımı:
  > • **Harf yerine rakam çıkıyorsa:** Num Lock açık kalmıştır. Num Lock ya da Fn + Num Lk tuşuna basın.
  > • **Harf çoğalıyorsa:** tuşa basıp hemen bırakın; basılı tutunca bilgisayar harfi tekrarlar.
  > • **Shift'e art arda basınca bir pencere çıkıp "Yapışkan Tuşlar" diyorsa:** "Hayır"a basıp kapatın. Bilgisayar bozulmadı; bu bir kolay erişim özelliğidir, kapatabilirsiniz.

---

## Yeni ders fikirleri (en fazla 3)

1. **"Açılmıyor, kapanmıyor, donmuş mu?" (15–20 dk, 1. hafta sonu ya da 4. hafta `sorun-giderme`'den önce)**
   Altı durumlu senaryo dersi: ekran siyah ama kasa çalışıyor; "Güncelleştirmeler yükleniyor, kapatmayın"; siyah ekranda İngilizce yazı + USB takılı; program donmuş (fare oynuyor); fare de oynamıyor, Caps Lock ışığı tepki vermiyor; dizüstü şarjı bitmiş. Her durumda "bekle / şunu dene / güç düğmesini uzun bas" kararı verilir. B1, B7, B8 ve B12'yi tek derste toplar. Bugün dağınık duruyor ve en çok panik yapılan konu.

2. **"Dizüstünde touchpad ile iş görmek" (15 dk, 1. hafta)**
   Yalnızca dizüstü kullananlar için ek alıştırma: touchpad ile sürükleyerek pencere taşıma, yazı seçme, simge taşıma, kaydırma; başparmakla köşeye basma yöntemi; sınıfta gerçek dizüstü ile yapılan 5 görev. B4'ün uzantısı. `dizustu` mevcut hâliyle sorulu cevaplı, hiç "yapın" adımı yok (touchpad'i gerçekten kullandırmıyor).

3. **"Dosyam nerede? Kaydet penceresini okumak" (15 dk, 3. hafta sonu, `kaydet-pratik`'ten sonra)**
   Kaydet penceresinin parçaları: yol çubuğu, sol liste (Masaüstü, Belgeler, İndirilenler, OneDrive), dosya adı, dosya türü. "Belgeler"in iki yerde görünmesi, hangi klasöre kaydettiğini okuma. 6. haftadaki `kayip-dosya` dersi bulmayı anlatıyor; bu ders kaydederken doğru yere koymayı öğretir.

---

## Dökümde zaten olduğu için eksik saymadıklarım

- Caps Lock açık kalması (`klavye` 8, `yazi-sorun` 6–7, `odev2` Görev 3: şifre yanlış çıkıyorsa Caps Lock), Num Lock, ı/İ farkı, AltGr + Q ile @ ve Ctrl + Alt + Q, TUR/ENG ve Alt + Shift, F/Q klavye.
- Takılan programı kapatma ve Görev Yöneticisi (5. hafta `gorev`), Ctrl + Alt + Delete, ⊞ + L ile kilitleme (5. hafta `hesap-pin`).
- USB'yi güvenle çıkarma (6. hafta `dosyalar`, 15. hafta yedek dersi). Yine de `portlar` dersinde USB takmayı anlatırken tek cümlelik bir gönderme yararlı olur: "Belleği çekmeden önce Dosya Gezgini'nden ⏏ Çıkar'a basın (6. hafta)."
- GB/TB, RAM/disk farkı (`ilan`), "Bilgisayarınız hakkında" ile RAM/işlemci bakma (`ilan`, `odev4`).
- Fişten çekmenin zararı, güç düğmesini basılı tutma (son çare olarak) (`ackapa` 11; yalnız B1'deki ölçüt eksikliği var).
- Ekran alıntısı, yazıcı sorunları, virüs/dolandırıcı destek uyarısı (`sorun-giderme` 9).
- Yazı boyutunu büyütme (7. hafta), Ctrl + tekerlek ile yakınlaştırma (`kisayol-yarisi` 9).

## Küçük notlar (bulgu sayılmadı)

- `surukle` adım 8: "Başlat'a Solitaire yazın" önerisi. Windows 11'de oyun Microsoft Store uygulaması olarak gelir; reklam, hesap açma ve abonelik istemi çıkarabilir, bazı bilgisayarlarda hiç kurulu olmayabilir (emin değilim). Alternatif: sınıfta Dosya Gezgini'nde dosyayı klasöre sürükleme ya da Paint'te çizgi çizme.
- `ilan`: "512 GB SSD" ilanda yazar ama Windows'ta kullanılabilir alan yaklaşık %7–10 daha az görünür (örneğin 476 GB); Windows ve programlar da yer kaplar. Bir cümleyle eklenebilir: "Kendi bilgisayarınızda biraz daha az görünmesi normaldir." İnternet hızı birimi Mbps (megabit) ile MB (megabayt) farkı kursun hiçbir yerinde anlatılmıyor; `ilan` ya da 8. haftadaki hız testi dersine bir cümle eklenebilir: "İnternet hızı megabit (Mbps) olarak yazılır; 8 megabit yaklaşık 1 megabayt eder."
- `ackapa` adım 4: Gerçek bilgisayarda şifre yerine PIN, parmak izi ya da yüz tanıma çıkabilir. Bir cümle yeterli: "Bilgisayarınızda şifre yerine rakamlardan oluşan bir PIN ya da parmak izi/yüz tanıma olabilir; 5. haftada göreceğiz."
