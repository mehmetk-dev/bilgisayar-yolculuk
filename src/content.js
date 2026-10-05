// Ders içeriği (Türkçe). k: çocuklar için kısa anlatım, t: gençler için teknik ayrıntı.
// Sayısal değerler "temsilî"dir; kesin olmayan bilgiler "yaklaşık / tahmini" diye belirtilmiştir.

export const ERA_KEYS = ['1990', '2000', '2010', '2025'];

export const ERAS = {
  1990: {
    name: "1990'lar", period: 'Temsilî sistem: ~1997', title: 'Bej masaüstü kasa, Pentium sınıfı işlemci',
    k: "Bilgisayarlar bej renkli ve yatay dururdu. Disket ve CD kullanılırdı. İnternete telefon hattından, modemle bağlanılırdı.",
    t: "On yılın başında 386/486 işlemciler, ISA/VLB kartlar ve 30-pin SIMM bellekler vardı. Bu sahnede on yılın ikinci yarısından tipik bir Pentium sınıfı sistem gösteriliyor: Socket 7, 72-pin EDO SIMM, PCI ekran kartı, ISA ses kartı ve modem, IDE sabit disk, 1,44 MB disket ve CD-ROM.",
    facts: ['İşlemci: ~200 MHz, 1 çekirdek', 'Bellek: 32 MB', 'Depolama: 2,1 GB HDD', 'Güç kaynağı: 200 W'],
  },
  2000: {
    name: "2000'ler", period: 'Temsilî sistem: ~2004', title: 'ATX orta kule, Pentium 4 sınıfı işlemci',
    k: "Kasalar dik durmaya başladı. DVD yazıcılar geldi, USB bellekler disketin yerini almaya başladı. Önde USB girişleri vardı.",
    t: "Socket 478 Pentium 4 sınıfı işlemci (Hyper-Threading), çift kanal DDR-400, AGP 8x ekran kartı, yeni SATA arayüzlü sabit disk, IDE DVD yazıcı ve hâlâ bir disket sürücüsü. ATX12V güç kaynağı işlemci için ayrı 4-pin 12 V kablosu getirdi.",
    facts: ['İşlemci: 2,8 GHz, 1 çekirdek / 2 iş parçacığı', 'Bellek: 1 GB DDR', 'Depolama: 160 GB HDD', 'Güç kaynağı: 350 W'],
  },
  2010: {
    name: "2010'lar", period: 'Temsilî sistem: ~2014', title: 'Siyah orta kule, 4 çekirdekli işlemci',
    k: "Kasalar siyah oldu, fanlar büyüdü. Hızlı SSD'ler geldi; büyük dosyalar için yine sabit disk kullanıldı.",
    t: "LGA 1150 soketli 4 çekirdekli işlemci (tümleşik grafik ve bellek denetleyicisi yongada), çift kanal DDR3-1600, PCIe 3.0 x16 ekran kartı, işletim sistemi için 2,5\" SATA SSD + veriler için 3,5\" HDD, tek bir SATA DVD yazıcı. Güç kaynağı alta taşındı.",
    facts: ['İşlemci: 3,4 GHz, 4 çekirdek', 'Bellek: 8 GB DDR3', 'Depolama: 250 GB SSD + 1 TB HDD', 'Güç kaynağı: 500 W'],
  },
  2025: {
    name: '2025', period: 'Temsilî sistem: 2025', title: 'Cam yan panelli kule, 8 çekirdekli işlemci',
    k: "Kasanın yanı camdır, içi ışıklı olabilir. CD/DVD sürücüsü yoktur; programlar internetten iner. Depolama, sakız büyüklüğünde bir karttır.",
    t: "AM5 (LGA 1718) soketli 8 çekirdekli işlemci, çift kanal DDR5, PCIe 5.0 x16 yuvasında büyük üç fanlı ekran kartı (12V-2x6 güç), kablosuz M.2 NVMe SSD, alt bölmede modüler 850 W güç kaynağı. Ofis sürümünde ayrı ekran kartı yoktur; işlemcinin tümleşik grafiği kullanılır.",
    facts: ['İşlemci: ~5 GHz\'e kadar, 8 çekirdek / 16 iş parçacığı', 'Bellek: 32 GB DDR5', 'Depolama: 2 TB NVMe SSD', 'Güç kaynağı: 850 W (ofis: 450 W)'],
  },
};

// ---------------------------------------------------------------- Parça türleri
export const PARTS = {
  kasa: {
    name: 'Kasa',
    ne: { k: 'Bilgisayarın evidir. İçindeki parçaları tozdan ve darbelerden korur.', t: 'Çelik şasi anakartı dikmelerle taşır; sürücü yuvalarını, fan yerlerini ve hava akışını belirler. Topraklı metal gövde elektromanyetik gürültüyü de azaltır.' },
    nereye: { k: 'Masanın üstüne ya da yanına konur. Bütün parçalar onun içine takılır.', t: 'Kasa ile anakartın form faktörü (AT, ATX, mATX…) uyumlu olmalıdır: vida delikleri ve arka panel (I/O) açıklığı buna göre konumlanır.' },
  },
  yanPanel: {
    name: 'Yan kapak',
    ne: { k: 'Kasanın içini kapatır. Açınca parçaları görebiliriz.', t: 'Bakım için sökülen sac panel. Hava akışını yönlendirdiği için kapalı çalıştırmak soğutma açısından daha doğrudur.' },
    nereye: { k: 'Kasanın sol yanına vidalarla takılır.', t: 'Arka kenardaki tırtıllı vidalar sökülüp panel arkaya kaydırılarak çıkarılır.' },
  },
  camPanel: {
    name: 'Cam yan panel',
    ne: { k: 'İçerideki parçaları görmemizi sağlayan cam kapak.', t: 'Temperli camdan yapılır. Gösterişlidir ama metal panelden ağırdır; düşerse kırılabilir.' },
    nereye: { k: 'Kasanın sol yanına vidalarla takılır.', t: 'Köşelerdeki el vidalarıyla ya da menteşe/kilit düzeneğiyle tutturulur.' },
  },
  onPanel: {
    name: 'Ön panel',
    ne: { k: 'Açma düğmesi, ışıklar ve öndeki girişler buradadır.', t: 'Güç ve reset düğmeleri, durum LED\'leri, ön USB/ses girişleri ve sürücü yuvası kapakları ön paneldedir. Kablolar anakarttaki ön panel başlıklarına bağlanır.' },
    nereye: { k: 'Kasanın önüne tırnaklarla takılır.', t: 'Plastik tırnaklarla şasiye geçer; ön portların kabloları anakarttaki USB/HD Audio başlıklarına gider.' },
  },
  anakart: {
    name: 'Anakart',
    ne: { k: 'Bütün parçaların takıldığı büyük devre kartıdır. Üzerindeki ince yollar, parçaların birbiriyle konuşmasını sağlar.', t: 'Çok katmanlı baskı devre kartı (PCB). İşlemci soketi, bellek yuvaları, yonga seti, genişleme yuvaları, depolama bağlantıları, BIOS/UEFI yongası ve arka panel portlarını taşır; veri yollarını ve güç dağıtımını sağlar.' },
    nereye: { k: 'Kasanın yan duvarına vidalarla tutturulur.', t: 'Kasadaki dikmelere (standoff) vidalanır; arka portlar I/O kalkanından dışarı bakar.' },
  },
  islemci: {
    name: 'İşlemci (CPU)',
    ne: { k: 'Bilgisayarın beynidir. Programlardaki komutları çok hızlı hesaplar.', t: 'Komutları getirir, çözer ve yürütür. Performansı saat hızı, çekirdek sayısı, önbellek ve mimari belirler. Çalışırken ısı üretir; soğutucusuz çalıştırılmaz.' },
    nereye: { k: 'Anakarttaki kare yuvaya (sokete) oturur. Üstüne soğutucu takılır.', t: 'Köşedeki üçgen işaret sokettekiyle eşleştirilerek konur; ZIF kolu ya da yük plakasıyla sabitlenir. Soğutucu ile arasına termal macun sürülür.' },
  },
  sogutucu: {
    name: 'İşlemci soğutucusu',
    ne: { k: 'İşlemci çalışırken ısınır. Soğutucu bu ısıyı metal kanatlara alır, fan da sıcak havayı uzaklaştırır.', t: 'Isı; işlemcinin ısı dağıtıcısından termal macun aracılığıyla bakır/alüminyum tabana, ısı borularıyla kanatçıklara taşınır. Fan havayı kanatçıkların arasından geçirir.' },
    nereye: { k: 'İşlemcinin tam üstüne takılır, fan kablosu anakarta bağlanır.', t: 'Sokete özgü tutucuya (klips, itmeli pim ya da vida/arka plaka) bağlanır; fan kablosu CPU_FAN başlığına takılır.' },
  },
  ram: {
    name: 'Bellek (RAM)',
    ne: { k: 'Bilgisayarın çalışma masasıdır. Açık olan programlar burada durur. Bilgisayar kapanınca içindekiler silinir.', t: 'Geçici (uçucu) ana bellek. İşlemcinin o anda kullandığı veri ve komutlar burada tutulur. Kapasite (GB), hız (MT/s) ve gecikme önemlidir; çift kanal kullanım bant genişliğini artırır.' },
    nereye: { k: 'Anakarttaki uzun yuvalara dik olarak takılır. Mandallar kilitler.', t: 'Modülün altındaki çentik yuvadaki çıkıntıyla eşleşmelidir. Her nesil (SDRAM, DDR … DDR5) farklı çentik yerine sahiptir; yanlış nesil yuvaya girmez.' },
  },
  ekranKarti: {
    name: 'Ekran kartı (GPU)',
    ne: { k: 'Ekranda gördüğümüz resimleri çizen parçadır. Oyunlarda çok çalışır.', t: 'Kendi grafik işlemcisi ve belleği (VRAM) vardır. Modern kartlar binlerce paralel çekirdekle 3B sahneleri hesaplar; video işleme ve yapay zekâ işleri için de kullanılır.' },
    nereye: { k: 'Anakarttaki uzun yuvaya takılır. Ekran kablosu arkasındaki çıkışa bağlanır.', t: 'Dönemine göre ISA/PCI → AGP → PCI Express yuvasına takılır; braket kasaya vidalanır. Güçlü kartlar ek güç kablosu ister.' },
  },
  sesKarti: {
    name: 'Ses kartı',
    ne: { k: 'Bilgisayardan ses ve müzik çıkmasını sağlar.', t: 'Sayısal sesi analoğa (DAC), mikrofon sesini sayısala (ADC) çevirir. 90\'larda FM sentez yongası ve oyun kolu/MIDI portu da taşırdı.' },
    nereye: { k: 'Anakarttaki siyah, uzun ISA yuvasına takılır.', t: '16-bit ISA yuvası; IRQ/DMA ayarları çoğu zaman atlama telleriyle (jumper) yapılırdı. Bugün ses devresi anakartın üzerindedir.' },
  },
  modem: {
    name: 'Modem',
    ne: { k: 'Bilgisayarı telefon hattıyla internete bağlar. Bağlanırken cızırtılı sesler çıkarır.', t: 'MODülatör-DEModülatör: sayısal veriyi telefon hattında taşınabilen seslere çevirir. 1990\'larda 14,4 → 28,8/33,6 → 56 kbit/s hızlara ulaşıldı.' },
    nereye: { k: 'Genişleme yuvasına takılır; telefon kablosu arkasına bağlanır.', t: 'ISA ya da PCI yuvası. LINE girişine duvardaki hat, PHONE çıkışına telefon makinesi bağlanır.' },
  },
  hdd: {
    name: 'Sabit disk (HDD)',
    ne: { k: 'Fotoğraflar, oyunlar ve ödevler burada kalıcı olarak saklanır. İçinde çok hızlı dönen parlak diskler vardır.', t: 'Manyetik kayıt yapar: plakalar dakikada 5400–7200 devir döner, okuma/yazma kafası plakaya değmeden çok küçük bir mesafede uçar. Elektrik kesilince veri silinmez (kalıcı depolama). Hareketli parçaları olduğu için SSD\'den yavaştır ve darbeye hassastır.' },
    nereye: { k: 'Kasadaki disk yuvasına vidalanır. İki kablo ister: biri elektrik (güç), biri bilgi (veri).', t: 'Veri: IDE/PATA (40-pin yassı kablo) ya da SATA (7-pin). Güç: Molex 4-pin ya da SATA 15-pin. Güç ve veri ayrı kablolardır.' },
  },
  ssd: {
    name: 'SSD (2,5")',
    ne: { k: 'Hareketli parçası olmayan, çok hızlı bir depolama birimi. Bilgiyi yongalarda saklar.', t: 'NAND flaş yongaları + denetleyici (+ çoğunda DRAM önbellek). SATA arayüzünde yaklaşık 550 MB/s; erişim süresi HDD\'ye göre çok daha kısadır. Elektriksiz veri saklar.' },
    nereye: { k: 'Kasadaki küçük yuvaya vidalanır, iki kablo takılır.', t: 'HDD gibi SATA veri + SATA güç kablosu kullanır; 2,5" yuvaya ya da tutucuya vidalanır.' },
  },
  m2: {
    name: 'M.2 NVMe SSD',
    ne: { k: 'Sakız paketi büyüklüğünde, çok hızlı depolama. Kablosu yok; doğrudan anakarta takılır.', t: 'PCIe hatlarını NVMe protokolüyle kullanır. PCIe 4.0 x4 ile yaklaşık 7 GB/s, PCIe 5.0 ile daha yüksek sıralı okuma hızları mümkündür. "2280" = 22 mm genişlik × 80 mm uzunluk.' },
    nereye: { k: 'Anakarttaki küçük yuvaya eğik takılır, ucundan tek vidayla tutturulur.', t: 'M.2 (M anahtarlı) yuvaya girer. Ayrı güç ve veri kablosu yoktur: ikisi de yuvadan gelir. Üstündeki soğutucu kapak anakarta aittir.' },
  },
  disket: {
    name: 'Disket sürücüsü',
    ne: { k: 'Küçük kare disketleri okuyup yazan sürücü. Bir diskete yalnızca 1,44 MB sığar; bu, bugünkü bir telefon fotoğrafından bile azdır.', t: '3,5" HD disket: 80 iz × 2 yüz × 18 sektör × 512 bayt = 1.474.560 bayt (“1,44 MB”). Manyetik, çıkarılabilir ortam. Dosya taşımak ve sistem açılış disketi için kullanılırdı.' },
    nereye: { k: 'Kasanın önündeki küçük yuvaya takılır.', t: '34-pin yassı kablo (sürücü A için kablonun ucunda bükülmüş bölüm) ve küçük 4-pin (Berg) güç konnektörü.' },
  },
  optik: {
    name: 'CD/DVD sürücüsü',
    ne: { k: 'Diskleri lazerle okuyan sürücü. Disk çıkarılıp başka bilgisayara götürülebilir.', t: 'Lazer, diskin yansıtıcı katmanındaki çukur (pit) ve düzlükleri okur. CD ~700 MB (780 nm kızılötesi lazer), tek katmanlı DVD 4,7 GB (650 nm kırmızı lazer).' },
    nereye: { k: 'Kasanın önündeki geniş yuvaya takılır.', t: '5,25" yuva. 90\'lar ve 2000\'lerde IDE + Molex; 2010\'larda SATA veri + SATA güç kullanılır.' },
  },
  psu: {
    name: 'Güç kaynağı (PSU)',
    ne: { k: 'Prizdeki elektriği parçaların kullanabileceği düşük gerilime çevirir.', t: 'Şebekedeki AC gerilimi (230 V) +12 V, +5 V ve +3,3 V DC gerilime dönüştürür. Etiketteki watt değeri verebileceği EN FAZLA güçtür; bilgisayar her an bu kadar çekmez. Verim (80 PLUS) dönüşümde ısıya giden kaybı gösterir.' },
    nereye: { k: 'Kasanın arkasına vidalanır. Kabloları bütün parçalara gider.', t: 'Eskiden kasanın üstüne, bugün çoğunlukla altına monte edilir. Modüler modellerde yalnızca gereken kablolar takılır.' },
  },
  kasaFani: {
    name: 'Kasa fanı',
    ne: { k: 'Kasanın içindeki sıcak havayı dışarı atar, serin havayı içeri alır.', t: 'Öndeki fanlar genelde içeri, arka/üst fanlar dışarı üfler; kasada önden arkaya bir hava akışı oluşur. Büyük fan (80 → 120/140 mm) aynı havayı daha düşük devirde, daha sessiz taşır.' },
    nereye: { k: 'Kasanın önüne ve arkasına vidalanır.', t: 'Kablosu anakarttaki SYS_FAN başlığına (3-pin DC / 4-pin PWM) bağlanır; ARGB fanların ışık kablosu ayrıdır.' },
  },
  psuBolmesi: {
    name: 'Güç kaynağı bölmesi',
    ne: { k: 'Güç kaynağını ve fazla kabloları saklayan alt bölme.', t: 'PSU ve kablo fazlasını gizler, görünümü sadeleştirir; PSU\'nun hava akışını ana bölmeden ayırır.' },
    nereye: { k: 'Kasanın alt kısmında, şasinin parçasıdır.', t: 'Şasiye perçinli ya da vidalıdır; üzerinde kablo geçiş delikleri bulunur.' },
  },
};

// ---------------------------------------------------------------- Dönem ayrıntıları (spec + "Bu dönemde nasıldı?")
export const ERA_PART = {
  1990: {
    kasa: { spec: 'Yatay masaüstü kasa, ~42 × 16 × 43 cm, bej', k: 'Bilgisayar masanın üstünde yatay dururdu; monitör çoğu zaman kasanın üstüne konurdu.', t: 'AT/erken ATX masaüstü kasa. Ön panelde turbo düğmesi, anahtar kilidi (klavyeyi kilitler), güç/turbo/HDD ışıkları. Kapak, U biçimli tek parçadır ve arkaya kaydırılarak çıkarılır.' },
    yanPanel: { spec: 'U biçimli üst kapak', k: 'Kapak tek parçaydı; arkadaki vidalar sökülüp geriye kaydırılırdı.', t: 'Üst ve yanları tek sacdan bükülmüş kapak. İç kenarlarındaki raylar şasiye geçer.' },
    onPanel: { spec: 'Turbo, kilit, LED\'ler', k: 'Önde "Turbo" düğmesi vardı. Basınca bilgisayar eski oyunlar için yavaşlardı!', t: 'Turbo düğmesi, eski yazılımların çok hızlı çalışmaması için işlemciyi yavaşlatan bir anahtardı; 90\'ların sonunda kayboldu. Anahtar kilidi klavye girişini kilitlerdi.' },
    anakart: { spec: 'ATX, Socket 7, ISA + PCI yuvaları', k: 'Üzerinde siyah (ISA) ve beyaz (PCI) yuvalar birlikte vardı.', t: 'Socket 7 anakart: 72-pin SIMM yuvaları, anakart üzerinde L2 önbellek yongaları, IDE ve disket başlıkları, ayarlar için çok sayıda atlama teli (jumper). Bu sahnedeki kart erken ATX biçimindedir; on yılın başında AT/Baby AT kartlar yaygındı.' },
    islemci: { spec: 'Pentium sınıfı, 200 MHz, 1 çekirdek, Socket 7 (321 pin), 0,35 µm, ~15 W', k: 'Tek çekirdekli, bugünkülerden yaklaşık 25 kat daha yavaş saatli bir işlemci.', t: 'Seramik PGA paket; L1 önbellek yongada, L2 önbellek anakartta. Bellek denetleyicisi işlemcide değil, yonga setindeydi. ZIF kolu kaldırılarak pinlere güç uygulamadan takılırdı.' },
    sogutucu: { spec: 'Alüminyum iğne kanatlı soğutucu + 50 mm fan', k: 'Küçük bir soğutucu ve minik bir fan yeterliydi.', t: '~15 W ısı küçük bir soğutucuyla atılabiliyordu. Tel klips soketin tırnaklarına takılırdı.' },
    ram: { spec: '2 × 16 MB 72-pin EDO SIMM = 32 MB', k: 'Bellek modülleri kısaydı ve çift olarak takılırdı.', t: 'Pentium\'un 64-bit veri yolu, 32-bit SIMM\'lerin çift takılmasını gerektirirdi. SIMM: 107,95 mm uzunluk. Sonraki DIMM\'ler (133,35 mm) daha uzundur — bellek her nesilde küçülmedi!' },
    ekranKarti: { spec: 'PCI, 4 MB, yalnızca VGA çıkışı, soğutucusuz', k: 'Küçük bir karttı, fanı bile yoktu.', t: 'Çoğunlukla 2B hızlandırıcı; 3B hızlandırma ayrı kartlarla yeni başlıyordu. Fan gerekmeyecek kadar az güç (birkaç watt) harcardı.' },
    sesKarti: { spec: 'ISA, 16-bit, FM sentez + oyun/MIDI portu', k: 'Oyunlarda müzik için ayrı bir kart takılırdı.', t: 'Hat girişi, mikrofon, hoparlör çıkışı, ses tekerleği ve DA-15 oyun kolu/MIDI portu. Bazı kartlarda CD-ROM için arabirim de bulunurdu.' },
    modem: { spec: 'ISA, 33,6 kbit/s, 2 × RJ11', k: 'İnternete bağlanırken telefon meşgul olurdu.', t: 'Dahili modem: LINE (hat) ve PHONE (telefon) girişleri. 56k modemler 90\'ların sonunda yaygınlaştı.' },
    hdd: { spec: '3,5", 2,1 GB, 5400 rpm, IDE (PATA)', k: 'Bugünkü bir telefonun binde biri kadar yer vardı.', t: '40-pin IDE yassı kablo + Molex güç. Bir IDE kablosuna iki cihaz (master/slave) bağlanır, atlama teliyle ayarlanırdı.' },
    disket: { spec: '3,5", 1,44 MB', k: 'Ödevler disketle okula taşınırdı.', t: 'Sistem açılış (boot) disketleri ve dosya taşıma için temel ortamdı.' },
    optik: { spec: 'CD-ROM, 24x, IDE', k: 'Oyunlar ve ansiklopediler CD ile gelirdi.', t: 'Yalnızca okuyabilir. Ön panelde kulaklık girişi ve ses ayarı vardı: CD\'deki müzik doğrudan buradan dinlenebilirdi. Ses kartına analog ses kablosu bağlanırdı.' },
    psu: { spec: 'ATX 200 W, 230/115 V seçmeli, monitör çıkışlı', k: 'Arkasında monitörün fişi için ikinci bir priz vardı.', t: 'Kırmızı voltaj seçicisi yanlış konumdaysa kaynak zarar görebilirdi. Arka tarafta monitör için IEC çıkış prizi bulunurdu.' },
    kasaFani: { spec: 'Ayrı kasa fanı genelde yok', k: 'Çoğu zaman tek fan, güç kaynağının içindeydi.', t: 'Kasa havalandırması büyük ölçüde PSU fanına dayanırdı.' },
  },
  2000: {
    kasa: { spec: 'ATX orta kule, ~20 × 43 × 45 cm', k: 'Kasalar dik durmaya başladı. Önde birçok sürücü yuvası vardı.', t: 'ATX orta kule: güç kaynağı üstte, önde 4 × 5,25" ve 2 × 3,5" dış yuva. Bej ya da siyah-gümüş renk yaygındı. 2004 dolaylarında bazı kasaların yan panelinde işlemci için hava kanalı bulunurdu.' },
    yanPanel: { spec: 'Sac panel, işlemci hava kanalı', k: 'Yan kapakta işlemciye serin hava getiren yuvarlak bir delik vardı.', t: 'Yan paneldeki kanal (o dönemin kasa tasarım kılavuzlarına uygun) işlemci soğutucusuna doğrudan dış hava verirdi.' },
    onPanel: { spec: 'Ön USB 2.0 + ses, sürücü kapakları', k: 'Önde USB girişleri geldi; USB bellek takmak kolaylaştı.', t: 'Ön USB 2.0 ve HD Audio/AC\'97 girişleri anakarttaki başlıklara kabloyla bağlanır.' },
    anakart: { spec: 'ATX, Socket 478, AGP + PCI, IDE + SATA', k: 'Hem eski geniş kablolar hem yeni ince SATA kabloları birlikte kullanılıyordu.', t: '865 sınıfı yonga seti: kuzey köprü (bellek denetleyicisi + AGP) ve güney köprü (IDE, SATA, USB 2.0, ses, ağ). Bellek denetleyicisi henüz işlemcide değildi.' },
    islemci: { spec: 'Pentium 4 sınıfı, 2,8 GHz, 1 çekirdek / 2 iş parçacığı (HT), Socket 478, 130 nm, ~68 W', k: 'Saat hızı yüksekti ama tek çekirdekliydi ve çok ısınırdı.', t: 'Yüksek saat hızına dayalı uzun boru hattı tasarımı. Hyper-Threading tek çekirdeğin işletim sistemine iki mantıksal işlemci gibi görünmesini sağlar. Isı dağıtıcı kapak (IHS) vardır.' },
    sogutucu: { spec: 'Kutu soğutucu: alüminyum + bakır çekirdek, 70 mm fan', k: 'İşlemci daha çok ısındığı için soğutucu büyüdü.', t: 'Sokete çevresindeki tutucu çerçeveye iki kollu klipsle bağlanırdı.' },
    ram: { spec: '2 × 512 MB DDR-400 (PC3200), 184-pin, çift kanal', k: 'Bellek modülleri SIMM\'den daha uzundu!', t: 'DDR, saat sinyalinin hem yükselen hem düşen kenarında veri aktarır. 184-pin, 133,35 mm. Aynı renkteki yuvalara takılınca çift kanal çalışır.' },
    ekranKarti: { spec: 'AGP 8x, 128 MB DDR, VGA + S-Video + DVI-I', k: 'Ekran kartlarına küçük bir fan geldi.', t: 'AGP, ekran kartına özel kahverengi bir yuvaydı. DVI dijital ekranlar (LCD) için, S-Video televizyona bağlamak içindi.' },
    hdd: { spec: '3,5", 160 GB, 7200 rpm, SATA', k: 'Sabit diskler büyüdü, ince kırmızı kablolar geldi.', t: 'Seri ATA (1,5 Gbit/s): ince 7-pinli veri kablosu, 15-pinli güç konnektörü. Aynı dönemde IDE diskler de çok yaygındı.' },
    disket: { spec: '3,5", 1,44 MB', k: 'Disket hâlâ vardı ama USB bellekler onun yerini almaya başladı.', t: 'BIOS güncelleme ve sürücü yükleme gibi işler için hâlâ kullanılıyordu.' },
    optik: { spec: 'DVD±RW yazıcı, 16x, IDE', k: 'Artık DVD\'ye de yazabiliyorduk: filmler ve yedekler DVD\'deydi.', t: 'DVD yazıcı CD\'leri de okur/yazar. IDE yassı kablo + Molex güç. Sabit diskin YERİNE değil, onunla BİRLİKTE bulunur: biri çıkarılabilir ortam, diğeri kalıcı depolamadır.' },
    psu: { spec: 'ATX12V 350 W, 115/230 V seçmeli', k: 'İşlemci için ayrı, küçük bir güç kablosu geldi.', t: 'ATX12V: Pentium 4 ile gelen 4-pin 12 V işlemci konnektörü. 20-pin ana konnektör; Molex, Berg ve yeni SATA güç kabloları.' },
    kasaFani: { spec: '80 mm arka fan', k: 'Arkada küçük bir fan sıcak havayı dışarı atar.', t: '80 mm fanlar yüksek devirde dönerdi; gürültülü olabilirdi.' },
  },
  2010: {
    kasa: { spec: 'Siyah orta kule, ~21 × 46 × 49 cm', k: 'Kasalar siyah oldu ve fanlar büyüdü.', t: 'Güç kaynağı alta taşındı, kablo yönetimi için anakart tepsisinde delikler açıldı. Önde tek bir 5,25" yuva, ön üstte USB 3.0.' },
    yanPanel: { spec: 'Siyah sac panel', k: 'Yan kapak düz ve siyahtı.', t: 'Bazı modellerde pencere vardı; bu sahnede düz panel gösteriliyor.' },
    onPanel: { spec: 'Örgülü hava girişi, USB 3.0', k: 'Önde mavi USB 3.0 girişleri vardı.', t: 'Ön panel arkasında 2 × 120 mm fan ve toz filtresi.' },
    anakart: { spec: 'ATX, LGA 1150, PCIe 3.0, SATA 6 Gb/s', k: 'Kablolar azaldı, yuvalar sadeleşti.', t: 'Kuzey köprü kalktı: bellek denetleyicisi ve PCIe hatları işlemciye taşındı. Tek bir PCH yongası (SATA, USB, ses, ağ) kaldı. BIOS\'un yerini UEFI aldı.' },
    islemci: { spec: '4 çekirdekli (Haswell nesli), 3,4 GHz, LGA 1150, 22 nm, 84 W', k: '4 çekirdek: aynı anda 4 iş yapabilen bir beyin.', t: 'Tümleşik grafik, bellek denetleyicisi ve PCIe 3.0 denetleyicisi aynı yongada. LGA soketinde pinler sokettedir, işlemcide yalnızca temas pedleri vardır.' },
    sogutucu: { spec: 'Kutu soğutucu: yuvarlak alüminyum kanat + bakır çekirdek', k: 'İtmeli pimlerle anakarta takılır.', t: 'Dört itmeli pim anakarttaki deliklere geçer; fan PWM ile hız ayarlıdır.' },
    ram: { spec: '2 × 4 GB DDR3-1600, 240-pin', k: 'Kapasite çok arttı ama modülün boyu aynı kaldı.', t: 'DDR3: 1,5 V, 240 pin, 133,35 mm. Çentik konumu DDR/DDR2\'den farklıdır.' },
    ekranKarti: { spec: 'PCIe 3.0 x16, 2 GB GDDR5, çift fan, 6+8 pin güç', k: 'Ekran kartları büyüdü ve iki fanlı oldu!', t: 'Çift yuva kalınlığı; DVI-I, DVI-D, HDMI ve DisplayPort çıkışları. ~170 W\'a kadar güç: yuva (75 W) yetmediği için ek 6/8-pin kablolar.' },
    hdd: { spec: '3,5", 1 TB, 7200 rpm, SATA 6 Gb/s', k: 'Büyük dosyalar (fotoğraf, video) için sabit disk.', t: 'SSD pahalı olduğu için işletim sistemi SSD\'ye, veriler HDD\'ye konurdu.' },
    ssd: { spec: '2,5", 250 GB, SATA 6 Gb/s', k: 'Bilgisayarı birkaç saniyede açan hızlı disk.', t: 'SATA arayüzü SSD\'nin hızını ~550 MB/s ile sınırlar; daha sonra M.2 NVMe bu sınırı aştı.' },
    optik: { spec: 'DVD-RW, 24x, SATA', k: 'Tek bir DVD sürücüsü kaldı.', t: 'SATA veri + SATA güç kablosu. On yılın sonunda birçok kasada optik yuva tamamen kalktı.' },
    psu: { spec: '500 W, 80 PLUS Bronze, aktif PFC', k: 'Güç kaynağı kasanın altına taşındı.', t: '24-pin ana, 4+4 (8) pin EPS, 6+2 pin PCIe. Aktif PFC\'li kaynaklar 100–240 V\'u kendisi algılar; voltaj seçici kalktı.' },
    kasaFani: { spec: '2 × 120 mm ön, 1 × 120 mm arka', k: 'Fanlar büyüdü, daha sessiz çalıştı.', t: '120 mm fanlar aynı havayı daha düşük devirde taşır.' },
  },
  2025: {
    kasa: { spec: 'Cam yan panelli orta kule, ~23 × 48 × 45 cm', k: 'Kasanın yanı camdır; içi ışıklı olabilir.', t: 'Optik sürücü yuvası yoktur. Güç kaynağı alt bölmede, kablolar anakart tepsisinin arkasında. Ön ve üst fan/radyatör yerleri.' },
    camPanel: { spec: 'Temperli cam', k: 'İçerisi bir vitrin gibi görünür.', t: 'Siyah serigrafi kenarlıklı temperli cam; el vidalarıyla takılır.' },
    onPanel: { spec: 'Örgü ön panel, 3 × 120 mm ARGB fan', k: 'Önde ışıklı fanlar vardır (isteğe bağlı).', t: 'Örgü panel yüksek hava akışı sağlar. Ön I/O üstte: USB-C, USB-A ve kulaklık/mikrofon birleşik girişi.' },
    anakart: { spec: 'ATX, AM5, PCIe 5.0, M.2, DDR5', k: 'Anakartın üstü metal soğutucu kapaklarla kaplıdır.', t: 'VRM soğutucuları, M.2 kapakları, önceden takılı I/O kalkanı, Wi-Fi ve 2,5 GbE. SATA bağlantıları azaldı; depolama artık çoğunlukla M.2 yuvalarında.' },
    islemci: { spec: '8 çekirdek / 16 iş parçacığı, AM5 (LGA 1718), ~5 GHz\'e kadar', k: '8 çekirdekli, aynı anda 16 işi idare edebilen bir beyin.', t: 'Yonga parçacığı (chiplet) tasarımı: çekirdekler ayrı bir yongada, bellek/PCIe denetleyicisi ve küçük tümleşik grafik ayrı bir G/Ç yongasında. Kesin üretim süreci modele göre değişir.' },
    sogutucu: { spec: 'Isı borulu kule soğutucu, 120 mm fan', k: 'İşlemcinin üstünde kocaman bir metal kule var!', t: 'Dört ısı borusu ısıyı tabandan ince alüminyum kanatçıklara taşır; fan havayı arkaya, arka fana doğru üfler. Ofis sürümünde alçak profilli küçük soğutucu yeterlidir.' },
    ram: { spec: '2 × 16 GB DDR5-6000, 288-pin, soğutuculu', k: '32 GB! 90\'lardaki bilgisayarın tam 1000 katı.', t: 'DDR5\'te güç yönetimi yongası (PMIC) modülün üzerindedir; her modül iki bağımsız 32-bit alt kanala ayrılır. Modül boyu yine 133,35 mm.' },
    ekranKarti: { spec: 'PCIe 5.0 x16, 12 GB GDDR7, üç fan, ~250 W, 12V-2x6', k: 'Ekran kartı kocaman oldu: 30 cm\'den uzun!', t: '2,5 yuva kalınlık, arka plaka, ısı boruları. Tek 16-pin 12V-2x6 konnektörle beslenir. Çıkışlar: 3 × DisplayPort + 1 × HDMI. Ekran kablosu anakarttaki değil, ekran kartındaki çıkışa takılmalıdır.' },
    m2: { spec: 'M.2 2280 NVMe, PCIe 4.0 x4, 2 TB', k: 'Kablosuz, minik ve süper hızlı.', t: 'Sıralı okuma yaklaşık 7 GB/s: 90\'lardaki diskten binlerce kat hızlı. Anakarttaki alüminyum kapak ısıyı dağıtır.' },
    psu: { spec: 'Oyun: 850 W ATX 3.1, 80 PLUS Gold, modüler · Ofis: 450 W', k: 'Kaynak güçlü ama bilgisayar her zaman bu kadar elektrik çekmez.', t: 'Tamamen modüler: kullanılmayan kablolar takılmaz. ATX 3.x ekran kartlarının kısa süreli güç sıçramalarına göre tasarlanır; 12V-2x6 kablosu doğrudan karta gider.' },
    kasaFani: { spec: '3 × 120 mm ARGB ön + 1 × 120 mm arka', k: 'Işıklı fanlar hem soğutur hem süsler.', t: 'Ön fanlar içeri, arka fan dışarı üfler. ARGB ışıklar soğutmaya katkı yapmaz, isteğe bağlıdır.' },
    psuBolmesi: { spec: 'Alt bölme', k: 'Güç kaynağı burada gizlenir.', t: 'PSU ve kablo fazlası buradadır; ana bölme temiz görünür.' },
  },
};

// ---------------------------------------------------------------- Portlar
// donem: genel "Bu dönemde nasıldı?" metni; eraNote: döneme özel ek
export const PORTS = {
  ps2kb: { name: 'PS/2 klavye girişi (mor)', k: 'Klavyenin takıldığı yuvarlak giriş.', t: '6-pinli mini-DIN. Mor renk PC 99 kılavuzuyla standartlaştı. Bilgisayar çalışırken takıp çıkarmak önerilmez.', donem: '80\'lerin sonunda IBM PS/2 ile geldi; daha önce büyük 5-pinli DIN klavye girişi vardı. 2000\'lerden sonra USB yerini aldı; bugün çoğu kartta hiç yok ya da tek bir birleşik PS/2 kalmış.' },
  ps2mouse: { name: 'PS/2 fare girişi (yeşil)', k: 'Farenin takıldığı yeşil yuvarlak giriş.', t: '6-pinli mini-DIN; klavye girişiyle aynı biçimdedir, renkleri karıştırmamak için kodlanmıştır.', donem: '90\'ların başında fareler çoğunlukla seri porta takılırdı. PS/2 fare portu seri portu boşa çıkardı; 2000\'lerde USB fareler yaygınlaştı.' },
  ps2combo: { name: 'Birleşik PS/2 (mor-yeşil)', k: 'Klavye ya da fare takılabilen tek giriş.', t: 'Yarısı mor yarısı yeşil: klavye veya fare. Bazı oyuncu klavyeleri ve eski cihazlar için korunmuştur.', donem: '2010\'larda iki PS/2 girişi teke indi; 2020\'lerde birçok kartta tamamen kalktı.' },
  serial: { name: 'Seri port (COM, DE-9)', k: 'Eski fare, modem gibi cihazların takıldığı 9 iğneli giriş.', t: 'RS-232 seri arayüz: bitleri tek hat üzerinden sırayla gönderir. Erkek (iğneli) DE-9 konnektör, turkuaz renk kodu.', donem: '90\'larda fare, harici modem ve yazar kasa gibi cihazlar için kullanılırdı. Yerini USB aldı; bugün endüstriyel cihazlarda ve ağ cihazlarının konsol bağlantısında yaşıyor.' },
  parallel: { name: 'Paralel port (LPT, DB-25)', k: 'Yazıcıların takıldığı uzun, 25 delikli giriş.', t: 'Centronics/IEEE 1284 paralel arayüz: 8 veri bitini aynı anda ayrı hatlardan gönderir. Dişi DB-25, bordo renk kodu.', donem: '90\'larda ve 2000\'lerin başında yazıcı ve tarayıcıların standart bağlantısıydı. USB yazıcılarla birlikte kayboldu.' },
  vga: { name: 'VGA (mavi, DE-15)', k: 'Monitörün takıldığı mavi giriş.', t: 'Analog RGB görüntü sinyali; 3 sıra 15 delik. Vidalarla sabitlenir.', donem: '1987\'den beri. CRT monitörlerin standardıydı; LCD\'lerle önce DVI, sonra HDMI/DisplayPort yaygınlaştı. 2010\'larda bazı anakartlarda hâlâ vardı, 2025 kartlarında genellikle yok.' },
  game: { name: 'Oyun kolu / MIDI portu (DA-15)', k: 'Oyun kolunun (joystick) takıldığı giriş.', t: 'Analog oyun kolu ve MIDI cihazları (elektronik klavye) için. Ses kartının üzerindeydi.', donem: '90\'larda ses kartlarının vazgeçilmeziydi. USB oyun kolları ile 2000\'lerde kayboldu.' },
  usb1: { name: 'USB (ilk nesil)', k: 'Yeni, küçük ve her cihaza uyan giriş.', t: 'USB 1.x: 12 Mbit/s. Tak-çalıştır; cihaza 5 V güç de verir.', donem: 'USB 1996\'da tanıtıldı; 90\'ların sonundaki anakartlarda ilk kez göründü ama işletim sistemi desteği yeni oturuyordu. Çoğu cihaz hâlâ PS/2, seri ve paralel portlara takılıyordu.' },
  usb2: { name: 'USB 2.0 (siyah/beyaz)', k: 'Fare, klavye, USB bellek takılan giriş.', t: 'USB 2.0: 480 Mbit/s. Yalıtkan dil genelde siyah ya da beyazdır.', donem: '2000\'lerin standardı. Bugün klavye/fare gibi yavaş cihazlar için hâlâ bulunur.' },
  usb3: { name: 'USB 3.x 5 Gbps (mavi)', k: 'Daha hızlı USB girişi. Mavi renginden tanınır.', t: 'USB 3.0 / 3.2 Gen 1: 5 Gbit/s. Konnektör içinde ek kontaklar vardır; mavi renk yaygın bir uygulamadır.', donem: '2010\'larda yaygınlaştı; harici diskleri çok hızlandırdı.' },
  usb10: { name: 'USB 3.2 Gen 2 10 Gbps (kırmızı)', k: 'Çok hızlı USB girişi.', t: '10 Gbit/s. Renk üreticiye göre değişir (kırmızı, turkuaz…); kesin bilgi için kılavuza ya da yanındaki yazıya bakılmalıdır.', donem: '2020\'lerde yaygın.' },
  usbc: { name: 'USB-C', k: 'İki yönlü takılabilen, oval küçük giriş.', t: 'Simetrik 24-pin konnektör. Hız (5–40 Gbit/s) ve güç desteği bağlantı noktasına göre değişir; şekil aynı olsa da yetenekler farklı olabilir.', donem: '2014\'te tanıtıldı; 2020\'lerde telefonlardan masaüstüne kadar her yerde.' },
  rj45: { name: 'Ethernet (RJ45)', k: 'İnternet kablosunun takıldığı giriş.', t: 'Kablolu yerel ağ. 2000\'lerde 10/100 Mbit/s, sonra 1 Gbit/s. Işıklar bağlantı ve veri trafiğini gösterir.', donem: '90\'larda ev bilgisayarlarında nadirdi (ayrı ağ kartı gerekirdi). 2000\'lerde anakarta tümleşti.' },
  rj45_25: { name: 'Ethernet 2,5 Gbit/s (RJ45)', k: 'İnternet kablosu girişi; eskisinden 2,5 kat hızlı.', t: '2.5GBASE-T: mevcut Cat5e kablolarla 2,5 Gbit/s.', donem: '2020\'lerde orta ve üst sınıf anakartlarda yaygınlaştı.' },
  rj11line: { name: 'Modem LINE (RJ11)', k: 'Duvardaki telefon hattının takıldığı giriş.', t: 'Telefon hattı girişi (2 tel). Modem buradan çevirir.', donem: '90\'larda internete böyle bağlanılırdı; bağlıyken telefon meşgul olurdu. Sonra ADSL ve kablolu ağlar geldi.' },
  rj11phone: { name: 'Modem PHONE (RJ11)', k: 'Telefon makinesinin takıldığı giriş.', t: 'Hattı telefon makinesine aktarır; modem kullanılmadığında telefon çalışır.', donem: '90\'lara özgü.' },
  audio: { name: 'Renk kodlu ses jakları (3,5 mm)', k: 'Hoparlör (yeşil), mikrofon (pembe) ve hat girişi (mavi).', t: 'Açık yeşil: hat çıkışı/hoparlör; pembe: mikrofon; açık mavi: hat girişi. Çok kanallı sistemlerde turuncu (merkez/bas), siyah (arka) ve gri (yan) da bulunur.', donem: 'Renk kodları PC 99 kılavuzuyla yaygınlaştı. 90\'larda bu jaklar ses kartının üzerindeydi; 2000\'lerden itibaren anakarta tümleşti.' },
  lineIn: { name: 'Hat girişi (açık mavi)', k: 'Kasetçalar gibi cihazlardan ses almak için.', t: 'Hat seviyesinde analog ses girişi.', donem: '90\'larda ses kartının braketindeydi.' },
  micIn: { name: 'Mikrofon girişi (pembe)', k: 'Mikrofon takılır.', t: 'Mikrofon seviyesinde giriş; ön yükselteçlidir.', donem: '90\'larda ses kartının braketindeydi.' },
  spkOut: { name: 'Hoparlör çıkışı (açık yeşil)', k: 'Hoparlör ya da kulaklık takılır.', t: 'Bazı 90\'lar kartlarında güçlendirilmiş (amfili) çıkıştı.', donem: '90\'larda ses kartının braketindeydi.' },
  hdmi: { name: 'HDMI', k: 'Televizyon ve monitörler için görüntü + ses kablosu girişi.', t: 'Sayısal görüntü ve ses aynı kabloda. 2010\'larda bilgisayarlarda yaygınlaştı.', donem: '2003\'te tanıtıldı; 2010\'larda ekran kartı ve anakartların standart çıkışı oldu.' },
  hdmiMb: { name: 'HDMI (anakart – tümleşik grafik)', k: 'İşlemcinin kendi grafiği için görüntü çıkışı.', t: 'İşlemcide tümleşik grafik varsa çalışır. Ayrı ekran kartı takılıysa monitör kablosu ekran kartına takılmalıdır!', donem: 'Ofis bilgisayarlarında monitör buraya takılır.' },
  dp: { name: 'DisplayPort', k: 'Yüksek çözünürlüklü monitörler için görüntü girişi.', t: 'Sayısal görüntü/ses; yüksek yenileme hızları. Bir köşesi pahlıdır.', donem: '2008\'de tanıtıldı; 2010\'larda ekran kartlarında, 2020\'lerde oyun monitörlerinde standart.' },
  dpMb: { name: 'DisplayPort (anakart – tümleşik grafik)', k: 'İşlemcinin kendi grafiği için görüntü çıkışı.', t: 'Ayrı ekran kartı varken monitörü buraya değil, ekran kartına bağlayın.', donem: '2020\'lerde yaygın.' },
  dviI: { name: 'DVI-I (beyaz)', k: 'Düz ekran (LCD) monitörler için görüntü çıkışı.', t: 'Hem sayısal hem analog sinyal taşır (yanındaki 4 delik analog). Adaptörle VGA\'ya dönüşebilir.', donem: '1999\'da tanıtıldı. 2000\'lerde LCD monitörlerle yaygınlaştı; 2010\'ların sonunda yerini HDMI/DP\'ye bıraktı.' },
  dviD: { name: 'DVI-D (beyaz)', k: 'Düz ekran monitör girişi.', t: 'Yalnızca sayısal; analog pinleri yoktur.', donem: '2000\'ler ve 2010\'lar.' },
  svideo: { name: 'S-Video / TV çıkışı', k: 'Bilgisayarı televizyona bağlamak için.', t: 'Parlaklık (Y) ve renk (C) ayrı taşınan analog görüntü. Çoğu kartta 7-pin mini-DIN.', donem: '2000\'lerde tüplü televizyonlara bağlantı için ekran kartlarında yaygındı.' },
  spdif: { name: 'Optik S/PDIF', k: 'Ses sistemine ışıkla ses gönderen çıkış.', t: 'Sayısal ses ışık darbeleriyle (TOSLINK) taşınır; elektriksel gürültüden etkilenmez.', donem: '2000\'lerden beri anakartlarda.' },
  wifi: { name: 'Wi-Fi anten bağlantısı', k: 'Kablosuz internet için anten takılır.', t: 'RP-SMA vidalı soket. Anakart üzerindeki Wi-Fi modülü (Wi-Fi 6E/7) ve Bluetooth için harici anten.', donem: '2010\'larda isteğe bağlı kartlarla; 2020\'lerde birçok anakartta tümleşik.' },
  esata: { name: 'eSATA', k: 'Harici sabit disk bağlamak için.', t: 'SATA\'nın dış cihazlar için korumalı sürümü (3–6 Gbit/s). Güç taşımaz.', donem: '2010\'ların başında yaygındı; USB 3.0 gelince kayboldu.' },
  btnFlash: { name: 'BIOS geri yükleme düğmesi', k: 'Anakartın yazılımını güncellemeye yarar.', t: 'İşlemci takılı olmadan bile USB bellekten UEFI güncellemesi yapılmasını sağlar.', donem: '2020\'lerde yaygın.' },
  btnCmos: { name: 'CMOS sıfırlama düğmesi', k: 'Ayarları fabrika ayarına döndürür.', t: 'UEFI ayarlarını varsayılana döndürür. Eskiden bunun için anakart üzerindeki atlama teli kullanılırdı.', donem: '90\'larda pil çıkarılır ya da jumper takılırdı.' },
  iecC14: { name: 'Güç girişi (IEC C14)', k: 'Elektrik kablosunun takıldığı giriş.', t: 'Şebeke gerilimi (AC) buradan girer. Üç pin: faz, nötr, toprak.', donem: 'Her dönemde aynı. Kablo standardı değişmedi.' },
  iecC13: { name: 'Monitör güç çıkışı (IEC C13)', k: 'Monitörün fişi buraya takılırdı.', t: 'Güç kaynağından monitöre aktarılan AC çıkış: bilgisayar kapanınca monitör de kapanırdı.', donem: '90\'lara özgü. CRT monitörler 70–100 W çekebiliyordu.' },
  psuSwitch: { name: 'Güç kaynağı anahtarı (I/O)', k: 'Güç kaynağının ana açma-kapama düğmesi.', t: 'Kapalıyken (O) anakarta bekleme gerilimi (+5 Vsb) bile gitmez; bakımdan önce kapatılmalıdır.', donem: 'ATX ile yaygınlaştı.' },
  voltSel: { name: 'Voltaj seçici (115/230 V)', k: 'Ülkenin elektriğine göre ayarlanan kırmızı düğme.', t: 'Türkiye\'de 230 V. Yanlış konum kaynağa zarar verebilirdi. Aktif PFC\'li modern kaynaklar 100–240 V\'u kendisi algılar.', donem: '90\'lar ve 2000\'lerde vardı; 2010\'larda kayboldu.' },
  frontHp: { name: 'Ön kulaklık girişi', k: 'Kulaklık önden takılır.', t: 'Kablosu anakarttaki HD Audio/AC\'97 başlığına bağlanır.', donem: '2000\'lerde ön panele taşındı.' },
  frontMic: { name: 'Ön mikrofon girişi', k: 'Mikrofon önden takılır.', t: 'Kablosu anakarttaki HD Audio/AC\'97 başlığına bağlanır.', donem: '2000\'ler.' },
  frontUsbc: { name: 'Ön USB-C', k: 'Telefonu önden takmak için oval giriş.', t: 'Kasadaki kablo anakarttaki USB-C (Key-A) başlığına bağlanır; hızı başlığa bağlıdır (çoğunlukla 10 veya 20 Gbit/s).', donem: '2020\'lerde yaygınlaştı.' },
  frontUsb3: { name: 'Ön USB 3.x', k: 'Önden hızlı USB bellek takmak için.', t: '19-pin USB 3 başlığına kalın bir kabloyla bağlanır.', donem: '2010\'lardan beri.' },
  frontCombo: { name: 'Birleşik kulaklık/mikrofon girişi', k: 'Mikrofonlu kulaklığın tek fişi buraya takılır.', t: '4 kutuplu (TRRS) 3,5 mm jak.', donem: '2020\'lerde ayrı jakların yerini aldı.' },
};

// Özellikler: anakart soketleri/yuvaları
export const FEATURES = {
  cpuSocket: { name: 'İşlemci soketi', k: 'İşlemcinin oturduğu kare yuva.', t: { 1990: 'Socket 7: 321 delikli ZIF (sıfır itme kuvvetli) soket. Kol kaldırılır, pinli işlemci yerleştirilir, kol indirilir.', 2000: 'Socket 478: 478 delikli ZIF soket, çevresinde soğutucu tutucu çerçeve.', 2010: 'LGA 1150: pinler sokette, işlemcide temas pedleri var. Metal yük plakası işlemciyi bastırır. Pinler çok hassastır!', 2025: 'AM5 (LGA 1718): 1718 temas noktası; yük plakası ve AM tipi soğutucu tutucular.' } },
  ramSlots: { name: 'Bellek yuvaları', k: 'RAM modüllerinin takıldığı uzun yuvalar.', t: { 1990: '72-pin SIMM yuvaları: metal tırnaklı, Pentium için çift çift kullanılır.', 2000: '184-pin DDR DIMM yuvaları; aynı renkli yuvalar çift kanal eşleridir.', 2010: '240-pin DDR3 yuvaları, çift kanal.', 2025: '288-pin DDR5 yuvaları; iki modül için A2 ve B2 yuvaları önerilir.' } },
  expSlots: { name: 'Genişleme yuvaları', k: 'Ekran kartı gibi kartların takıldığı yuvalar.', t: { 1990: 'Siyah ISA (16-bit, ~8 MB/s) ve beyaz PCI (32-bit 33 MHz, 133 MB/s) yuvaları birlikte.', 2000: 'Kahverengi AGP 8x (2,1 GB/s) ekran kartı için, beyaz PCI yuvaları diğer kartlar için.', 2010: 'PCIe 3.0 x16 (~16 GB/s yön başına) ve x1 yuvaları; eski PCI kayboluyor.', 2025: 'Metal zırhlı PCIe 5.0 x16 (~64 GB/s yön başına) — ağır ekran kartını taşımak için güçlendirilmiş.' } },
  storage: { name: 'Depolama bağlantıları', k: 'Disklerin ve sürücülerin kablolarının takıldığı yerler.', t: { 1990: 'İki IDE (40-pin) başlığı — her biri 2 cihaz — ve bir disket (34-pin) başlığı.', 2000: 'IDE + disket başlıklarının yanında yeni SATA portları: geçiş dönemi.', 2010: 'SATA 6 Gb/s portları; IDE ve disket başlığı yok.', 2025: 'M.2 yuvaları (kablosuz, doğrudan PCIe) + az sayıda yan bakan SATA portu.' } },
  power: { name: 'Güç konnektörleri', k: 'Güç kaynağından gelen kabloların takıldığı yerler.', t: { 1990: 'ATX 20-pin ana güç (on yılın başındaki AT kartlarda P8/P9 çifti vardı).', 2000: '20-pin ATX + işlemci için 4-pin ATX12V.', 2010: '24-pin ATX + 8-pin EPS (işlemci).', 2025: '24-pin ATX + 2 × 8-pin EPS: güçlü işlemciler için.' } },
  io: { name: 'Arka panel (I/O)', k: 'Kasanın arkasındaki girişlerin hepsi anakarta bağlıdır.', t: { 1990: 'PS/2, seri, paralel ve ilk USB portları.', 2000: 'PS/2, seri, paralel, USB 2.0, Ethernet ve ses.', 2010: 'USB 3.0, görüntü çıkışları (tümleşik grafik için), eSATA.', 2025: 'USB-A/USB-C, 2,5 GbE, Wi-Fi antenleri, BIOS düğmeleri; önceden takılı kalkan.' } },
  chipset: { name: 'Yonga seti', k: 'Anakartın trafik polisi.', t: { 1990: 'Kuzey köprü (bellek, PCI) + güney köprü (ISA, IDE).', 2000: 'Kuzey köprü (bellek denetleyicisi, AGP) soğutuculu + güney köprü (IDE, SATA, USB, ses).', 2010: 'Kuzey köprü işlemciye taşındı; tek PCH yongası kaldı.', 2025: 'Tek yonga seti (PCH) USB, SATA ve ek PCIe hatlarını yönetir; bellek ve ana PCIe hatları doğrudan işlemcide.' } },
};

// ---------------------------------------------------------------- Güç tüketimi (tahmini, DC tarafı, watt)
export const POWER = {
  1990: { psu: 200, eff: 0.65, effLabel: 'verim ~%60–70 (tahmini)', states: { bosta: { cpu: 8, gpu: 4, board: 10, storage: 8, fans: 2, other: 4 }, ofis: { cpu: 12, gpu: 5, board: 11, storage: 9, fans: 2, other: 4 }, oyun: { cpu: 16, gpu: 6, board: 12, storage: 14, fans: 2, other: 5 } }, labels: { oyun: 'Oyun / CD' }, note: 'CRT monitör bu değerlere dahil değildir; tek başına yaklaşık 70–100 W çekebilirdi.' },
  2000: { psu: 350, eff: 0.7, effLabel: 'verim ~%65–75 (tahmini)', states: { bosta: { cpu: 30, gpu: 12, board: 22, storage: 9, fans: 3, other: 2 }, ofis: { cpu: 45, gpu: 14, board: 24, storage: 10, fans: 3, other: 2 }, oyun: { cpu: 68, gpu: 35, board: 26, storage: 12, fans: 4, other: 2 } }, note: 'Bu dönemin işlemcileri boştayken bile oldukça fazla güç harcıyordu.' },
  2010: { psu: 500, eff: 0.85, effLabel: '80 PLUS Bronze (~%85)', states: { bosta: { cpu: 8, gpu: 10, board: 18, storage: 7, fans: 4, other: 2 }, ofis: { cpu: 25, gpu: 12, board: 20, storage: 8, fans: 4, other: 2 }, oyun: { cpu: 70, gpu: 160, board: 24, storage: 9, fans: 5, other: 2 } }, note: 'Güç tasarrufu özellikleri sayesinde boşta tüketim çok düştü.' },
  2025: { psu: 850, eff: 0.9, effLabel: '80 PLUS Gold (~%90)', states: { bosta: { cpu: 20, gpu: 15, board: 30, storage: 2, fans: 8, other: 2 }, ofis: { cpu: 35, gpu: 20, board: 32, storage: 3, fans: 8, other: 2 }, oyun: { cpu: 85, gpu: 240, board: 35, storage: 5, fans: 12, other: 3 } }, note: '850 W kaynak, bilgisayar sürekli 850 W çekiyor demek değildir: oyunda bile yaklaşık yarısı kullanılır. Pay; ekran kartının kısa süreli güç sıçramaları, verimli çalışma bölgesi ve ileride yükseltme içindir.' },
  '2025ofis': { psu: 450, eff: 0.87, effLabel: '80 PLUS (~%85–90)', states: { bosta: { cpu: 12, gpu: 0, board: 14, storage: 1, fans: 2, other: 1 }, ofis: { cpu: 22, gpu: 0, board: 15, storage: 2, fans: 2, other: 1 }, oyun: { cpu: 85, gpu: 0, board: 18, storage: 4, fans: 3, other: 1 } }, labels: { oyun: 'Yoğun iş (derleme, video)' }, note: 'Ayrı ekran kartı yok: görüntüyü işlemcinin tümleşik grafiği üretir (tüketimi CPU değerine dahil).' },
};
export const POWER_COMP = [
  ['cpu', 'İşlemci', '#ff7a45'], ['gpu', 'Ekran kartı', '#4f8cff'], ['board', 'Anakart + RAM', '#35c48b'],
  ['storage', 'Depolama/sürücüler', '#e8c33a'], ['fans', 'Fanlar/ışıklar', '#b07cff'], ['other', 'Diğer kartlar', '#9aa3ad'],
];
export const POWER_STATES = [['bosta', 'Boşta'], ['ofis', 'Ofis / İnternet'], ['oyun', 'Oyun']];

// ---------------------------------------------------------------- İşlemci şeması (öğretici, ölçekli değildir)
export const CPU_SCHEMA = {
  1990: { title: 'Pentium sınıfı (tek çekirdek)', cores: 1, threads: 1, clock: '200 MHz', l1: '16 + 16 KB', l2: '256–512 KB (anakartta!)', l3: '—', mc: 'Yonga setinde (işlemci dışında)', gpu: 'Yok (ayrı kart)', process: '350 nm', transistors: '~4,5 milyon', chiplets: false, ext: ['L2 önbellek', 'Bellek denetleyicisi'] },
  2000: { title: 'Pentium 4 sınıfı (tek çekirdek, HT)', cores: 1, threads: 2, clock: '2,8 GHz', l1: '8 KB veri + iz önbelleği', l2: '512 KB', l3: '—', mc: 'Kuzey köprüde (işlemci dışında)', gpu: 'Yok (AGP kart)', process: '130 nm', transistors: '~55 milyon', chiplets: false, ext: ['Bellek denetleyicisi'] },
  2010: { title: '4 çekirdekli (Haswell nesli)', cores: 4, threads: 4, clock: '3,4 GHz (turbo 3,8)', l1: '32 + 32 KB / çekirdek', l2: '256 KB / çekirdek', l3: '6 MB paylaşımlı', mc: 'Yongada (DDR3, çift kanal)', gpu: 'Tümleşik grafik', process: '22 nm', transistors: '~1,4 milyar', chiplets: false, ext: [] },
  2025: { title: '8 çekirdek / 16 iş parçacığı (yonga parçacıklı)', cores: 8, threads: 16, clock: '~5 GHz\'e kadar', l1: '~80 KB / çekirdek', l2: '1 MB / çekirdek', l3: '32 MB paylaşımlı', mc: 'G/Ç yongasında (DDR5, çift kanal)', gpu: 'Küçük tümleşik grafik (G/Ç yongasında)', process: 'Çekirdek yongası ~4 nm sınıfı, G/Ç yongası ~6 nm sınıfı', transistors: 'Milyarlarca (modele göre değişir)', chiplets: true, ext: [] },
};

// ---------------------------------------------------------------- Karşılaştırma
// Her öğe için model anahtarı (compare sahnesi kurar) ve tablo satırları
export const COMPARE = {
  depolama: {
    name: 'Depolama: HDD ↔ SSD', default: ['2000', '2025'],
    items: {
      1990: { model: 'hdd-ide', title: 'HDD (IDE)', rows: { Boyut: '102 × 26 × 147 mm (3,5")', Kapasite: '2,1 GB', Bağlantı: 'IDE 40-pin veri + Molex güç', Hız: '~5–10 MB/s', 'Hareketli parça': 'Var: dönen plakalar, kafa kolu', Görev: 'Kalıcı depolama' } },
      2000: { model: 'hdd-sata', title: 'HDD (SATA)', rows: { Boyut: '102 × 26 × 147 mm (3,5")', Kapasite: '160 GB', Bağlantı: 'SATA 7-pin veri + SATA 15-pin güç', Hız: '~60 MB/s', 'Hareketli parça': 'Var: 7200 devir/dk', Görev: 'Kalıcı depolama' } },
      2010: { model: 'ssd25', title: 'SSD (2,5" SATA)', rows: { Boyut: '70 × 7 × 100 mm (2,5")', Kapasite: '250 GB', Bağlantı: 'SATA 7-pin veri + SATA 15-pin güç', Hız: '~550 MB/s', 'Hareketli parça': 'Yok: NAND flaş yongaları', Görev: 'Kalıcı depolama (işletim sistemi)' } },
      2025: { model: 'm2', title: 'M.2 NVMe SSD', rows: { Boyut: '22 × 80 mm, ~2–3 mm kalınlık', Kapasite: '2 TB', Bağlantı: 'M.2 yuvası (PCIe 4.0 x4) — kablo yok', Hız: '~7.000 MB/s', 'Hareketli parça': 'Yok', Görev: 'Kalıcı depolama' } },
    },
    lesson: 'Depolama hem küçüldü hem binlerce kat hızlandı. Ama bütün parçalar böyle değil — Bellek ve Ekran kartı karşılaştırmalarına da bak!',
  },
  bellek: {
    name: 'Bellek (RAM)', default: ['1990', '2025'],
    items: {
      1990: { model: 'ram-simm72', title: '72-pin SIMM', rows: { Boyut: '108 × 25 mm', Kapasite: '16 MB (modül başına)', Bağlantı: '72 kontak, çift takılır', Hız: 'EDO, 60 ns', Görev: 'Geçici çalışma belleği' } },
      2000: { model: 'ram-ddr', title: 'DDR-400 DIMM', rows: { Boyut: '133 × 32 mm', Kapasite: '512 MB', Bağlantı: '184 kontak', Hız: '400 MT/s', Görev: 'Geçici çalışma belleği' } },
      2010: { model: 'ram-ddr3', title: 'DDR3-1600 DIMM', rows: { Boyut: '133 × 30 mm', Kapasite: '4 GB', Bağlantı: '240 kontak', Hız: '1600 MT/s', Görev: 'Geçici çalışma belleği' } },
      2025: { model: 'ram-ddr5', title: 'DDR5-6000 DIMM', rows: { Boyut: '133 × 31 mm (soğutucuyla ~42 mm)', Kapasite: '16 GB', Bağlantı: '288 kontak', Hız: '6000 MT/s', Görev: 'Geçici çalışma belleği' } },
    },
    lesson: 'Kapasite 1000 kat, hız yaklaşık 100 kat arttı — ama masaüstü bellek modülleri KISALMADI: SIMM 108 mm, bugünkü DDR5 133 mm.',
  },
  ekranKarti: {
    name: 'Ekran kartı', default: ['1990', '2025'],
    items: {
      1990: { model: 'gpu-pci90', title: 'PCI ekran kartı', rows: { Boyut: '~175 × 95 mm, tek yuva, fansız', Kapasite: '4 MB bellek', Bağlantı: 'PCI yuvası; VGA çıkışı', Güç: '~5 W (yuvadan)', Görev: 'Çoğunlukla 2B görüntü' } },
      2000: { model: 'gpu-agp00', title: 'AGP ekran kartı', rows: { Boyut: '~190 × 105 mm, tek yuva, küçük fan', Kapasite: '128 MB', Bağlantı: 'AGP 8x; VGA, DVI, S-Video', Güç: '~25–40 W', Görev: '3B oyunlar' } },
      2010: { model: 'gpu-pcie10', title: 'PCIe ekran kartı', rows: { Boyut: '~240 × 111 mm, çift yuva, 2 fan', Kapasite: '2 GB GDDR5', Bağlantı: 'PCIe 3.0 x16; DVI, HDMI, DP', Güç: '~170 W (6+8 pin)', Görev: '3B oyunlar, video' } },
      2025: { model: 'gpu-pcie25', title: 'PCIe 5.0 ekran kartı', rows: { Boyut: '~304 × 126 mm, 2,5 yuva, 3 fan', Kapasite: '12 GB GDDR7', Bağlantı: 'PCIe 5.0 x16; 3 × DP, HDMI', Güç: '~250 W (12V-2x6)', Görev: '3B oyunlar, yapay zekâ, video' } },
    },
    lesson: 'Güçlü ekran kartları KÜÇÜLMEDİ, BÜYÜDÜ: daha fazla güç = daha fazla ısı = daha büyük soğutucu ve fan.',
  },
  cikarilabilir: {
    name: 'Çıkarılabilir ortam', default: ['1990', '2025'],
    items: {
      1990: { model: 'floppy', title: 'Disket sürücüsü + disket', rows: { Boyut: 'Disket 90 × 94 mm', Kapasite: '1,44 MB', Bağlantı: '34-pin + Berg güç', Görev: 'Dosya taşıma, açılış disketi', Ortam: 'Manyetik, çıkarılabilir' } },
      2000: { model: 'optical-dvd', title: 'DVD yazıcı', rows: { Boyut: '5,25" sürücü, disk 120 mm', Kapasite: '4,7 GB (DVD) / 700 MB (CD)', Bağlantı: 'IDE + Molex', Görev: 'Yedek, film, kurulum', Ortam: 'Optik, çıkarılabilir' } },
      2010: { model: 'optical-sata', title: 'DVD-RW (SATA)', rows: { Boyut: '5,25" sürücü', Kapasite: '4,7 GB', Bağlantı: 'SATA veri + güç', Görev: 'Kurulum, film', Ortam: 'Optik, çıkarılabilir' } },
      2025: { model: 'usbstick', title: 'USB bellek', rows: { Boyut: '~40 × 15 mm', Kapasite: '128 GB', Bağlantı: 'USB-A / USB-C portu (kasada sürücü yok)', Görev: 'Dosya taşıma, kurulum', Ortam: 'Flaş, çıkarılabilir' } },
    },
    lesson: 'Disket, CD/DVD ve USB bellek ÇIKARILABİLİR ortamdır: veri bir bilgisayardan diğerine taşınır. Sabit disk/SSD ise içeride kalan KALICI depolamadır. Eskiden ikisi de aynı bilgisayarda birlikte bulunurdu.',
  },
  arkaPanel: {
    name: 'Arka panel girişleri', default: ['1990', '2025'],
    items: {
      1990: { model: 'io-1990', title: '1990\'lar arka panel', rows: { Klavye: 'PS/2 (mor)', Fare: 'PS/2 (yeşil) ya da seri port', Yazıcı: 'Paralel port (DB-25)', Görüntü: 'VGA (ekran kartında)', Ağ: 'Modem (RJ11)', USB: '2 × USB 1.x (yeni)' } },
      2000: { model: 'io-2000', title: '2000\'ler arka panel', rows: { Klavye: 'PS/2 (mor)', Fare: 'PS/2 (yeşil)', Yazıcı: 'Paralel ya da USB', Görüntü: 'VGA/DVI (ekran kartında)', Ağ: 'Ethernet 100 Mbit/s', USB: '4 × USB 2.0' } },
      2010: { model: 'io-2010', title: '2010\'lar arka panel', rows: { Klavye: 'PS/2 birleşik ya da USB', Fare: 'USB', Yazıcı: 'USB', Görüntü: 'VGA, DVI, HDMI (anakart) + ekran kartı', Ağ: 'Ethernet 1 Gbit/s', USB: 'USB 2.0 + USB 3.0 (mavi)' } },
      2025: { model: 'io-2025', title: '2025 arka panel', rows: { Klavye: 'USB', Fare: 'USB / kablosuz', Yazıcı: 'USB / Wi-Fi', Görüntü: 'HDMI, DP (anakart) + 3×DP, HDMI (ekran kartında)', Ağ: '2,5 Gbit/s Ethernet + Wi-Fi 7', USB: 'USB-A (5/10 Gbps) + USB-C' } },
    },
    lesson: 'Eskiden her cihazın kendi özel girişi vardı (klavye, fare, yazıcı, oyun kolu). Bugün neredeyse hepsi USB\'ye toplandı.',
  },
  islemci: {
    name: 'İşlemci', default: ['1990', '2025'],
    items: {
      1990: { model: 'cpu-s7', title: 'Socket 7 işlemci', rows: { Boyut: '49,5 × 49,5 mm seramik', Çekirdek: '1', Saat: '200 MHz', Bağlantı: '321 pin (işlemcide)', Güç: '~15 W' } },
      2000: { model: 'cpu-s478', title: 'Socket 478 işlemci', rows: { Boyut: '35 × 35 mm', Çekirdek: '1 (2 iş parçacığı)', Saat: '2,8 GHz', Bağlantı: '478 pin (işlemcide)', Güç: '~68 W' } },
      2010: { model: 'cpu-lga1150', title: 'LGA 1150 işlemci', rows: { Boyut: '37,5 × 37,5 mm', Çekirdek: '4', Saat: '3,4 GHz', Bağlantı: '1150 ped (pinler sokette)', Güç: '84 W' } },
      2025: { model: 'cpu-am5', title: 'AM5 işlemci', rows: { Boyut: '40 × 40 mm', Çekirdek: '8 (16 iş parçacığı)', Saat: '~5 GHz\'e kadar', Bağlantı: '1718 ped (pinler sokette)', Güç: '~65–120 W' } },
    },
    lesson: 'İşlemci paketi neredeyse aynı boyutta kaldı ama içindeki transistör sayısı milyonlardan milyarlara çıktı.',
  },
  psu: {
    name: 'Güç kaynağı', default: ['1990', '2025'],
    items: {
      1990: { model: 'psu-at90', title: '200 W ATX', rows: { Boyut: '150 × 86 × 140 mm', Kapasite: '200 W', Bağlantı: '20-pin ATX, Molex, Berg', Verim: '~%60–70', Özellik: 'Voltaj seçici, monitör çıkışı' } },
      2000: { model: 'psu-atx00', title: '350 W ATX12V', rows: { Boyut: '150 × 86 × 140 mm', Kapasite: '350 W', Bağlantı: '20-pin, 4-pin 12V, Molex, SATA', Verim: '~%65–75', Özellik: 'Voltaj seçici' } },
      2010: { model: 'psu-atx10', title: '500 W', rows: { Boyut: '150 × 86 × 160 mm', Kapasite: '500 W', Bağlantı: '24-pin, 8-pin EPS, PCIe 6+2', Verim: '80 PLUS Bronze', Özellik: 'Aktif PFC, 120 mm fan' } },
      2025: { model: 'psu-atx25', title: '850 W ATX 3.1', rows: { Boyut: '150 × 86 × 160 mm', Kapasite: '850 W', Bağlantı: 'Modüler; 24-pin, 2×8 EPS, 12V-2x6', Verim: '80 PLUS Gold', Özellik: '135 mm fan, modüler kablolar' } },
    },
    lesson: 'Güç kaynağının dış ölçüsü (ATX) neredeyse aynı kaldı; kapasite arttı. Kapasite, bilgisayarın her an çektiği güç değildir — "Güç" panelinde karşılaştır.',
  },
};

// ---------------------------------------------------------------- Kavramlar
export const CONCEPTS = [
  { title: 'Çıkarılabilir ortam ≠ kalıcı depolama', k: 'CD/DVD ve disket, sabit diskin yerini almadı. Eskiden aynı bilgisayarda hem disket/CD/DVD sürücüsü hem de sabit disk vardı. Sabit disk bilgileri içeride saklar; disk ve disketler ise bir bilgisayardan diğerine taşınır.', t: 'Sabit disk/SSD: kalıcı (uçucu olmayan), sabit takılı depolama — işletim sistemi ve programlar buradadır. Disket/CD/DVD/USB bellek: çıkarılabilir ortam — taşıma, yedek ve kurulum için. Optik sürücüler 2010\'larda yavaş yavaş kalktı; yerini internetten indirme ve USB bellek aldı. Kalıcı depolama ise HDD → SSD → M.2 NVMe olarak gelişti.', show: ['hdd', 'ssd', 'm2', 'disket', 'optik'] },
  { title: 'Her şey küçülmedi!', k: 'Depolama küçüldü ama bellek modülleri aynı boyda kaldı (hatta SIMM\'den uzundur). Ekran kartları ise kocaman oldu.', t: 'RAM: SIMM 108 mm → DIMM\'ler 133,35 mm; kapasite ~1000 kat arttı, boy kısalmadı. Ekran kartı: 90\'larda ~17 cm ve fansız, bugün 30 cm\'yi aşan, 2,5–3 yuva kalınlığında üç fanlı kartlar. Daha fazla güç = daha fazla ısı = daha büyük soğutucu. İşlemci paketi yaklaşık aynı boyda kaldı; içindeki transistörler küçüldü.', compare: 'ekranKarti' },
  { title: 'Bir hard disk iki kabloya ihtiyaç duyar', k: 'Sabit diske bir güç kablosu (elektrik) ve bir veri kablosu (bilgi) takılır.', t: 'Güç: güç kaynağından gelir (Molex 4-pin → SATA 15-pin). Veri: anakarta gider (IDE 40-pin → SATA 7-pin). M.2 SSD\'de ikisi de yuvadan gelir, kablo yoktur.', cables: true },
  { title: 'Güç kaynağı kapasitesi ≠ tüketim', k: 'Etikette 850 W yazması, bilgisayarın hep 850 W harcadığı anlamına gelmez.', t: 'Watt değeri kaynağın verebileceği en fazla güçtür. Gerçek tüketim yapılan işe göre değişir: boşta düşük, oyunda yüksek. Prizden çekilen güç, verim yüzünden biraz daha fazladır.', power: true },
];

// ---------------------------------------------------------------- Buldurma soruları
export const QUIZ = [
  { q: 'Bu bilgisayarda KALICI depolama nerede?', targets: ['hdd', 'ssd', 'm2'], ok: 'Doğru! Bilgiler elektrik kesilse bile burada kalır.', hint: 'Elektrik kesilince silinmeyen yer…' },
  { q: 'İşlemci (CPU) nerede?', targets: ['islemci', 'sogutucu'], ok: 'Doğru! İşlemci, soğutucunun hemen altında.', hint: 'Üstünde soğutucu ve fan vardır.' },
  { q: 'Bellek (RAM) nerede?', targets: ['ram'], ok: 'Doğru! Uzun, ince modüller.', hint: 'İşlemcinin yanındaki uzun ince kartlar.' },
  { q: 'Güç kaynağı nerede?', targets: ['psu'], ok: 'Doğru! Elektrik kablosu bunun arkasına takılır.', hint: 'Arkasında elektrik fişinin girdiği kutu.' },
  { q: 'Ekran kartı nerede?', targets: ['ekranKarti'], ok: 'Doğru! Monitör kablosu bunun arkasına takılır.', hint: 'Anakarttaki yuvaya takılan kart; arkasında görüntü çıkışları var.', need: 'ekranKarti' },
  { q: 'ÇIKARILABİLİR ortam sürücüsü nerede?', targets: ['disket', 'optik'], ok: 'Doğru! Buraya takılan disk/disket başka bilgisayara götürülebilir.', hint: 'Önden disk ya da disket takılan sürücü.', need: ['disket', 'optik'] },
  { q: 'Anakart nerede?', targets: ['anakart'], ok: 'Doğru! Bütün parçalar ona bağlanır.', hint: 'Her şeyin takıldığı büyük devre kartı.' },
];

export const TOUR = {
  1990: ['kasa', 'onPanel', 'yanPanel', 'anakart', 'islemci', 'sogutucu', 'ram1', 'ekranKarti', 'sesKarti', 'modem', 'hdd', 'disket', 'optik', 'psu'],
  2000: ['kasa', 'onPanel', 'yanPanel', 'anakart', 'islemci', 'sogutucu', 'ram1', 'ekranKarti', 'hdd', 'disket', 'optik', 'psu', 'fanArka'],
  2010: ['kasa', 'onPanel', 'yanPanel', 'anakart', 'islemci', 'sogutucu', 'ram1', 'ekranKarti', 'ssd', 'hdd', 'optik', 'psu', 'onFanlar', 'fanArka'],
  2025: ['kasa', 'onPanel', 'yanPanel', 'anakart', 'islemci', 'sogutucu', 'ram1', 'ekranKarti', 'm2', 'psuBolmesi', 'psu', 'onFanlar', 'fanArka'],
};

export const SOURCES = [
  'Intel – ATX Specification (sürüm 2.2) ve ATX12V Power Supply Design Guide: kart/kasa/PSU ölçüleri, konnektörler.',
  'Intel – ATX Version 3.x Multi Rail Desktop Platform Power Supply Design Guide: 12V-2x6 konnektörü.',
  'JEDEC – JESD21-C modül standartları ve JESD79 (DDR … DDR5) belge ailesi: bellek modülü ölçüleri ve pin sayıları.',
  'Microsoft & Intel – PC 99 System Design Guide: port renk kodları.',
  'SATA-IO – Serial ATA spesifikasyonu; PCI-SIG – PCI/PCI Express ve M.2 (form faktörü 2280) belgeleri; USB-IF – USB 2.0/3.x/Type-C belgeleri.',
  'MEB MEGEP – Bilişim Teknolojileri alanı “İç Donanım Birimleri” öğrenme materyali: anakart, işlemci, bellek, depolama ve güç kaynağı kavramları.',
  'Not: Sistemler "temsilî"dir; marka ve model adları uydurmadır. Güç tüketimi değerleri tahminidir ve gerçek ölçümlere göre değişir.',
];
