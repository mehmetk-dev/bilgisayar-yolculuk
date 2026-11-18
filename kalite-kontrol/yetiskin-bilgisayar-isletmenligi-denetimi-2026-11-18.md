# Yetişkinler için Bilgisayar İşletmenliği denetimi

18 Kasım 2026 · Bilgisayara yeni başlayan orta yaşlı yetişkinler · Genel müfredat, Word, Excel ve PowerPoint

**Karar.** Müfredatı koruyup önce öğreneni kilitleyen, yanlış işlem öğreten ve kişisel veri riski yaratan adımları düzeltin. Sonra derslerin gerçekten neyi ölçtüğünü ve tahta materyallerini güncelleyin. Ardından ilk haftalara kısa bir temel beceri rotası ve her Office modülüne gerçek bilgisayarda uygulama koyun. Yeni içerik işlerini bu çekirdek düzeltmelerin arkasına alın.

## Kapsam ve dayanak

Denetim güncel ders kodunu, yetişkin kursunun tahta sunumu kaynaklarını ve ilgili PDF'yi kapsıyor. Bulgular statik incelemeye dayanıyor. Brave, sandbox içinde Crashpad `setsockopt` hatasıyla başlatılamadı. Gerçek Office'te işlem ve kursiyerle sınıf denemesi yapılmadı. Ders tarama aracı sayfanın açılışını inceleyebilir. Öğrenci eylemlerini gerçekleştirmediği için bir görevin tamamlanabildiğini kanıtlamaz. [Müfredat](../src/dersler/lessons/index.js#L118), [ders dökümü aracı](../tools/ders-dokumu.mjs#L1), [ders tarama aracı](../tools/ders-tara.mjs#L1).

| Bölüm | Kalem | Tahmini süre |
| --- | ---: | ---: |
| 15 hafta ve ek bölüm | 217 | 5.886 dk |
| 8. hafta | 21 | 556 dk |
| 10. hafta · Word | 24 | 741 dk |
| 11. hafta · Excel | 21 | 678 dk |
| 12. hafta · PowerPoint | 15 | 512 dk |

Office haftaları birlikte 60 kalem ve 1.931 dakika tutuyor. Bu, toplam tahmini sürenin yaklaşık üçte biri. Kalem ve süre hesabına alıştırma, parkur, ödev ve test giriyor. Dakika alanları planlama tahminidir. Sınıftaki gerçek uygulama süresi, bireysel yeterlilik ve MEB programına uygunluk ayrıca değerlendirilir. [Yerel eşleştirmedeki hesap yöntemi](../MEB-ESLESTIRME.md#L6).

Merzifon HEM altı modülde toplam 163 ders saati ve Excel için 35 ders saati yayımlıyor. Avcılar HEM sayfası kurs kazanımlarını tarif ediyor. Yerel eşleştirme, HEM'in modül toplamı ile 2019 ÖÖKGM'nin 160 saatlik Bilgisayar İşletmeni Yetiştirme Kurs Programı'nı tek referans gibi sunuyor. Eşleştirmede kurum, program adı, toplam, sürüm ve kapsamı ayrı satırlarda gösterin. HEM'in 35 ders saatlik Excel hedefi planlama temeli seçilirse sitedeki 678 dakika yaklaşık 17 ders saati eder. Aradaki yaklaşık 18 ders saatini gerçek Excel uygulamasıyla planlayın ve gerçekleşen çalışmayı kaydedin. [Yerel referans](../MEB-ESLESTIRME.md#L5), [Merzifon HEM](https://merzifonhem.meb.k12.tr/icerikler/bilgisayarisletmenligioperatorlugukursumuz_16954823.html), [Avcılar HEM](https://avcilarhem.meb.k12.tr/icerikler/bilgisayarisletmenligikursu_16814249.html), [2019 ÖÖKGM programı, s. 2 ve 4](https://ookgm.meb.gov.tr/meb_iys_dosyalar/2019_09/03164428_Bilgisayar_YYletmeni_YetiYtirme_Kurs_ProgramY_2019_25.pdf).

Güncel ders koşulları Node ve esbuild ile 10 örnek olay veya hücre durumu üzerinden de çalıştırıldı. Bu denemeler işlevlerin verilen girdilere tepkisini gösterir. Fare, klavye ve dosya kaydetme akışları tarayıcı üzerinden uçtan uca doğrulanamadı.

| Koşul denemesi | Gözlenen sonuç |
| --- | --- |
| Excel parkuru | İlk ürün adı, beş fiyat ve B6'da elle girilen 304,25 yeterli oldu. Masaüstündeki eski `pazar.xlsx` kaydı kabul edildi. |
| Word provası | 16 puntolu başlık ile Masaüstü'ndeki başka bir PDF kabul edildi. |
| PowerPoint çıkışı ve kaydı | Bitirme bayrağı olmadan çıkış reddedildi. Masaüstündeki `taslak.pptx` kabul edildi. |
| PowerPoint provası ve PDF | Altı slayt, Masaüstü'ne altı sayfalı PDF ve önceki bitirme bayrağı varken yeni gösteriden hemen çıkma kabul edildi. |

## P1 · Sürdürme, güvenlik ve yanlış öğrenme

- **Excel'e kaldığı yerden dönüş.** İlk Excel dersinde adım geri yüklenirken masaüstü ve çalışma sayfası sıfırlanabiliyor. B3'e 900 yazma adımı, daha önceki değerleri ve B6 formülünü bekliyor. Çalışma kaydı veya adıma uygun başlangıç durumu ekleyin.

  **Kabul ölçütü.** Ders yarıda kapatılıp yeniden açıldığında ilgili adımda önceden kurulmuş 10.050 toplamı görünür. B3'e 900 girince 10.200 oluşur. B2 silinip Geri Al uygulandığında değer ve toplam geri gelir. [Derse dönüş](../src/dersler/app.js#L386-L402), [kaydedilen ilerleme alanları](../src/dersler/app.js#L704-L709), [Excel adımları](../src/dersler/lessons/hesap.js#L109-L151).
- **Ortak bilgisayarda ödev güvenliği.** Kimlik, sağlık ve banka görevlerinde eğitim hesabı ve sentetik belge kullanın. Oturum kapatmayı ve indirilen eğitim dosyasını temizlemeyi ayrı adımlarda gösterin.

  **Kabul ölçütü.** Ödev, kişinin kimlik, sağlık veya banka verisini girmeden tamamlanır. Eğitmen çıkışı ve indirilen dosyanın temizlendiğini ayrı ayrı kontrol edebilir. [Mevcut ödev](../src/dersler/lessons/odevler.js#L173-L181).
- **Bitiş ve yeterlilik kaydı.** Atlanan adımlarla erişilen bitişi yeterlilik kaydından ayırın. Eğitmen ödev sonucunu elle kaydedebilsin. Süre isteğe bağlı gözlem olarak tutulsun.

  **Kabul ölçütü.** Zorunlu bir adım atlandığında ilerleme görülebilir ve yeterlilik kaydı ancak gerçek bilgisayardaki ipucusuz görev çıktısı kontrol edildiğinde oluşur. [Adım ilerlemesi](../src/dersler/app.js#L495), [bitirme akışı](../src/dersler/app.js#L586), [tamamlama ekranı](../src/dersler/app.js#L715).
- **Excel'de toplama ve sıralama.** Hücre aralığına uygulanan TOPLA metni atlar. Aynı sayısal olmayan metin hücresi `+` ile doğrudan kullanıldığında hata verir. Ödeve ve teste bunun görülebildiği aynı örneği koyun. Başlangıç hücresine bağlı sıralamayı benzetimin davranışı olarak belirtin. Gerçek Excel'de Veri → Sırala üzerinden tabloyu bir bütün olarak sıralatın.

  **Kabul ölçütü.** Kursiyer farkı iki formülle gözlemler ve sıralama sonunda her adın tutarı kendi satırında kalır. [Ödev ve örnekler](../src/dersler/lessons/odevler.js#L138-L142), [test](../src/dersler/lessons/testler.js#L694), [ders](../src/dersler/lessons/hesap.js#L210-L217), [Excel parkuru](../src/dersler/lessons/excel2.js#L358), [Microsoft TOPLA](https://support.microsoft.com/tr-tr/excel/functions/sum-function), [Microsoft sıralama](https://support.microsoft.com/tr-tr/excel/sort-data-in-a-range-or-table-in-excel).
- **PowerPoint'te sunuyu bitirme.** Son slaytta Esc yönergesiyle bitiş ekranına geçişi birbirine bağlayan ders adımı ayrışıyor. Öğrenci tarif edildiği gibi Esc'ye basınca ders ilerleyebilmeli. Bitiş ekranını görmek ayrı hedefse son slayttan bir kez daha ilerleme açıkça öğretilmeli.

  **Kabul ölçütü.** Ders yönergesini izleyen öğrenci son slayttan çıkıp düzenleme görünümüne döner ve adım tamamlanır. [Ders](../src/dersler/lessons/sunu.js#L125-L138), [sunum ilerletme](../src/dersler/apps/slides.js#L661-L665), [sunum tuşları](../src/dersler/apps/slides.js#L722).

## P2 · Word dersleri ve tahta materyali

- **Paragrafı ayırma.** Yazma adımı iki ibareyi tek paragrafta kabul ediyor. Sonraki adım ise en az üç blok bekliyor. Yazma adımında başlık, gövde ve kapanış paragraflarını gösterip denetleyin. Üç tıkla seçimden önce sürükleme veya klavyeyle seçim gösterin ve Geri Al'ı erkene taşıyın.

  **Kabul ölçütü.** Yönergeyi tamamlayan kişi biçimlendirme adımına geçebilir. Tek paragrafla ilerlemeye çalışırsa hangi satırı ayırması gerektiğini görür. [Seçim](../src/dersler/lessons/kelime.js#L57-L79), [paragraf koşulları](../src/dersler/lessons/kelime.js#L84-L99).
- **Kaydedilen dosya ve biçim.** Bazı kontroller yanlış klasördeki veya başka adlı bir çıktıyla, başka bir PDF'yle ya da karışık punto ve yanlış dolguyla geçebiliyor.

  **Kabul ölçütü.** Yanlış ad, klasör veya PDF ayrı ayrı reddedilir. İstenen başlık puntosu, gövdenin tamamı ve dolgu doğrulanır. Doğru belge ve ondan üretilen PDF kabul edilir. [İlk dosya adımı](../src/dersler/lessons/kelime.js#L130-L138), [PDF adımı](../src/dersler/lessons/kelime.js#L229-L231), [kaydetme kontrolü](../src/dersler/lessons/kelime2.js#L473), [parkur kontrolleri](../src/dersler/lessons/kelime2.js#L509-L525).
- **Yazım denetimi.** Var olan yazım denetimine denetim dilini seçme ve bir öneriyi cümleye göre kabul etme veya geçme adımı ekleyin.

  **Kabul ölçütü.** Öğrenci Türkçe denetimi seçebilir, bir düzeltmeyi uygular ve örnek bir özel adı olduğu gibi bırakabilir. [Var olan ders adımı](../src/dersler/lessons/kelime.js#L308-L312), [Microsoft denetim dili](https://support.microsoft.com/en-us/word/troubleshoot-checking-spelling-and-grammar-in-multiple-languages).
- **10. hafta sunumu ve PDF.** Materyaldeki 18 ders ve 19 soru bilgisi güncel 24 kalem ve 24 soruyla eşleşmiyor. Sayfa kenarlığı için Tasarım yolunu, Paragraf penceresini, 1/1 sayacının anlamını ve Değişiklikleri İzle görünümünü sınıfta kullanılan sürüme göre kontrol edin.

  **Kabul ölçütü.** Tahta kaynağı, hafta PDF'si ve ilgili birleşik PDF aynı sayım tanımını ve dersle tutarlı yönergeleri gösterir. [Hafta kaynağı](../sunum/yetiskin-kursu/kaynak/hafta10.html#L2-L18), [üretici ders listesi](../sunum/yetiskin-kursu/kaynak/uret.py#L1303-L1312), [hafta PDF'si](../sunum/yetiskin-kursu/PDF/Bilgisayar-Isletmenligi-hafta10.pdf).

## P2 · Excel dersleri ve tahta materyali

- **Parkur denetimi.** İlk satır ve hesaplanan sonuç, tam tabloyu doğrulamak için yetersiz.

  **Kabul ölçütü.** Beş ad-tutar çifti, tüm sıralama, toplam formülü, dosya adı ve klasör ayrı ayrı kontrol edilir. Aynı toplamı elle yazmak, orta satırları karıştırmak ve dosyayı başka klasöre kaydetmek parkuru geçirmez. [Parkur doğrulaması](../src/dersler/lessons/excel2.js#L353-L359).
- **11. hafta tahta kaynağı.** Üreticideki eski ders listesi ve özet, güncel 21 kalem ve 22 soruluk hafta testiyle eşleştirilmeli. Formül, sıralama ve filtre örnekleri sınıfta kullanılan Excel sürümünde denenmeli.

  **Kabul ölçütü.** Üretici kaynakları ve yeniden üretilen PDF'ler güncel hafta sırasını ve uygulama yönergelerini gösterir. [Üretici ders listesi](../sunum/yetiskin-kursu/kaynak/uret.py#L1459-L1464), [üretici özet](../sunum/yetiskin-kursu/kaynak/uret.py#L1557).

## P2 · PowerPoint dersleri ve tahta materyali

- **Alıştırma ve prova.** Kapadokya parkurunun geçiş adımı son slaytta geçiş eksik olduğunda uyarıyor ve tamamlanabiliyor. MEB sınav provasında slayt sırasını, düzenini, fotoğrafı, hedef klasörü ve tüm slaytları kapsayan yeni provayı birlikte kontrol edin.

  **Kabul ölçütü.** Beş slayt istenen sıra ve düzendedir. Eksik geçiş, yanlış fotoğraf, yanlış klasör veya önceki denemeden kalan prova bayrağıyla parkur bitmez. Yeniden deneme prova durumunu sıfırlar. [Geçiş adımı](../src/dersler/lessons/sunu4.js#L224-L245), [parkur istekleri](../src/dersler/lessons/sunu7.js#L34-L51), [parkur denetimi](../src/dersler/lessons/sunu7.js#L84-L110).
- **Dışa aktarma.** Benzetimdeki PDF ve video çıktısını sanal uygulama çıktısı olarak işaretleyin. Paylaşılabilir çıktı üretmeyi gerçek PowerPoint uygulamasında gösterin.

  **Kabul ölçütü.** Öğrenci PPTX'i yeniden açar ve oluşturduğu PDF'yi ayrı görüntüleyicide kontrol eder. Video istenen uygulamada, gerçek video dosyası açılıp oynatılır. [Ders](../src/dersler/lessons/sunu2.js#L349-L363), [sanal dışa aktarma](../src/dersler/apps/slides.js#L1116-L1136).
- **12. hafta tahta kaynağı.** MEB prova içeriğini ve 21 soruluk hafta testi bilgisini güncelleyin. Yanlış SmartArt dönüştürme yolunu sınıftaki PowerPoint sürümünde doğrulayıp düzeltin.

  **Kabul ölçütü.** Eğitmen yazılı adımları izleyerek dönüştürme ve prova işlemlerini gerçek PowerPoint'te yapabilir. Güncel yol hafta PDF'sine de yansır. [Prova ve ders dizisi](../sunum/yetiskin-kursu/kaynak/uret.py#L1577-L1582), [tahta yönergeleri](../sunum/yetiskin-kursu/kaynak/uret.py#L1602-L1611).

## P2 · Başlangıç rotası ve gerçek bilgisayara geçiş

İlk haftadaki açma-kapama ile tek ve çift tık çalışmasına, 5. haftadaki okuma konforu ve fare hassasiyetinden kısa bir giriş ekleyin. İlk sekiz haftada dosya bulma, kaydetme, indirme ve yazdırma kısa görevlerle birkaç kez geri gelsin. İleri konuları rotanın sonuna alın ve zorunlu kazanımları koruyun. Talimat başına bir hedef verin. Hata geri bildirimi ne olduğunu ve nasıl geri alınacağını göstersin. İş, kurs, dernek ve ev senaryoları arasından seçim sunun. Bağlamı torun sahibi olma veya emeklilik varsayımına bağlamayın.

**Kabul ölçütü.** Kursiyer ilk hafta fare ve okunurluk ayarına erişebilir. Sekizinci haftanın sonunda örnek indirilen dosyayı bulur, düzenlediği kopyayı kaydeder ve yazdırma önizlemesini açar. [Hafta dizisi](../src/dersler/lessons/index.js#L119-L126), [mevcut final örneği](../src/dersler/lessons/final.js#L59), [mevcut işlem örneği](../src/dersler/lessons/islemler.js#L315), [DigComp](https://publications.jrc.ec.europa.eu/repository/handle/JRC144121).

Her modül sonunda eğitmen aşağıdaki görevleri gerçek bilgisayarda verir. Kursiyer görev metnini ve örnek dosyaları kullanabilir. Menü yolu veya işlem sırası ipucu verilmez. Eğitmen sonucu, varsa hatadan geri dönüşü ve gerekiyorsa yeniden deneme tarihini kaydeder.

| Modül | Görev | Kabul ölçütü |
| --- | --- | --- |
| Word | Dilekçe veya duyuru hazırlayıp PDF olarak gönderin. | Düzenlenebilir DOCX açılır. Aynı içerikli PDF okunur, doğru ekle eğitim adresine gönderilir. |
| Excel | Sentetik gelir-gider tablosuna bir satır ekleyin. | Toplam formülle doğru güncellenir. İstenen filtre sonucu görünür ve satır bütünlüğü korunur. |
| PowerPoint | Üç slayt hazırlayıp gerçek bilgisayarda projektörle sunun. | PPTX açılır, tüm slaytlar sunulur. Arka sıradan başlık, metin ve görseller seçilir. Kontrast ve PDF sırası kontrol edilir. |

### Küçük sınıf denemesi

Önerilen denemeye bilgisayara yeni başlayan 4–6 gönüllü katılır. Uygulamadan yedi gün sonra aynı üç beceriyi farklı belge ve verilerle gerçek bilgisayarda yeniden denerler. Eğitmen dosya adını, konumunu ve çıktısını kontrol eder. Yardım istenen noktayı, hatanın nasıl fark edildiğini ve kursiyerin kaldığı yere dönüp dönemediğini de kaydeder. Süre, takılma noktalarını yorumlamak için isteğe bağlı gözlemdir. Sonuçları ders düzeltmelerine yön veren sınıf gözlemi olarak kullanın.

## P3 · Mevcut dersleri birleştiren kısa görevler

Fotoğrafla belge tarama, PDF'yi e-postayla gönderme, kayıp dosyayı arama, görüntülü görüşme, e-Devlet, güvenlik ve düzenlenebilir Excel–Word aktarımı mevcut. Bunları tekrar yazmadan birden fazla beceriyi birlikte kullanmayı gerektiren görevler ekleyin. [Telefonla tarama](../src/dersler/lessons/telefontarama.js#L1), [belge gönderme](../src/dersler/lessons/belgegonder.js#L1), [günlük işlemler](../src/dersler/lessons/islemler.js#L14), [kayıp dosya](../src/dersler/lessons/kayipdosya.js#L30), [güvenlik](../src/dersler/lessons/parkurlar.js#L150), [Excel–Word](../src/dersler/lessons/excel-word-tablo.js#L37).

Mevcut bulut dersi paylaşımı eklenen kişilerle sınırlandırıyor ve son ekranda kapatmayı anlatıyor. Yeni mini görev, izin türünü seçmeyi ve geri çekilen erişimi ayrı bir hesapla doğrulamayı uygulatır. [Bulut dersi](../src/dersler/lessons/programlar2.js#L158-L191).

| Görev | Kabul ölçütü |
| --- | --- |
| Başvuru dosyasını hazırlayıp güvenli yükleme | Eğitim portalı uygunsuz biçim ve boyut için anlaşılır geri bildirim verir. Kursiyer doğru dosyayı ve doğru belge türünü seçer, yükleme dekontunu bulur. |
| Bulut erişimi verme ve geri çekme | Kursiyer eğitim hesabına görüntüleme veya düzenleme erişimini görevde istenen şekilde verir. Sonra erişimi geri çeker ve ikinci hesapla sonucu kontrol eder. |
| Ortak okul veya iş bilgisayarında çıkış | Kursiyer eğitim hesabından çıkar, indirilen örnek dosyayı temizler ve yeni sekmede oturumun kapalı olduğunu doğrular. |
| Görüşmede ekran paylaşma | Kursiyer istenen pencereyi veya sekmeyi paylaşır, karşı tarafa doğru içeriğin gittiğini kontrol eder ve paylaşımı durdurur. |

## Uygulama sırası

1. P1 akışlarını düzeltin. Her biri için bir başarılı deneme ve hatalı eylemle bir olumsuz deneme yapın.
2. Office görevlerinin kod denetimini güçlendirin. Tahta kaynağını ve PDF'leri aynı müfredat sürümünden güncelleyin. MEB eşleştirmesindeki iki programın kaynaklarını düzeltin.
3. Kısa başlangıç rotası ve gerçek bilgisayar görevlerini hedef kitleyle küçük bir sınıf denemesinde uygulayın. Önerilen kabul ölçütlerini gözlenen tökezleme noktalarıyla yeniden kontrol edin.
4. Sınıf denemesinden sonra başvuru, paylaşım ve ortak bilgisayar senaryolarını ekleyin.
