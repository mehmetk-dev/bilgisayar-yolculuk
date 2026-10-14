// Adım adım donanım dersi (3B uygulamada "🎓 Donanım dersi"; adres sonuna #ders yazılınca kendiliğinden açılır)
//
// Bir adımın alanları:
//   title, text            → panelde anlatım (yalın dil)
//   ornek                  → günlük hayattan benzetme
//   soru, cevap            → öğrencinin düşüneceği soru; cevap düğmeyle açılır
//   tablo                  → [[sol, sağ], …] küçük karşılaştırma tablosu
//   era                    → bu adımın bilgisayarı (1990 · 2000 · 2010 · 2025)
//   view                   → başlangıç kamerası: front · rear · inside · io
//   open, explode          → kasa açık mı, parçalar ne kadar ayrık (0–1)
//   show                   → vurgulanan parçalar (kamera bunlara gider, diğerleri soluklaşır)
//   labels                 → adı yazılan parçalar (verilmezse show; diğer parçaların adı gizlenir ki karışmasın)
//   keep                   → vurgulanmadan görünür kalan parçalar (ör. kasa)
//   spot                   → [nesne adı, merkez [x,y,z], yarıçap]: kamera parçanın içindeki küçük bir yere bakar
//   marks                  → [[nesne adı, [x,y,z], yazı], …] o adımda gösterilen ek etiketler (ör. açma düğmesi)
//   dir                    → kamera yönü [x, y, z] (verilmezse iç görünüşün yönü)
//   zoom                   → kamera uzaklığı çarpanı
//   remove                 → yerinden çıkarılan parçalar (ör. işlemcinin üstündeki soğutucu)
//   inside                 → içi gösterilen parça (HDD plakaları, SSD yongaları)
//   tray                   → CD/DVD tepsisi açık
//   cables                 → 'power' · 'data' · parça kimliği (o parçanın güç + veri kabloları)
//   flow                   → [[parçalar, etiket], …] sırayla yanıp sönen yolculuk
//   btns                   → [[etiket, eylem], …] ek düğmeler (schema · power · compare:… · quiz · test)

export const DERS_TITLE = 'Donanım: bilgisayarın içini adım adım tanıyalım';

export const DERS = [
  {
    title: 'Bilgisayar neden oluşur?',
    era: '2010', view: 'front',
    text: 'Masaüstü bilgisayar iki kısımdır: <b>kasa</b> ve kasaya takılan <b>ekran, klavye, fare</b> gibi parçalar. Asıl bilgisayar kasadır. Bugün kasanın içine bakacağız.',
    ornek: 'Araba gibi: direksiyonu ve pedalları kullanırız (klavye, fare), göstergeye bakarız (ekran). Arabayı yürüten ise kaputun altındaki motordur. Bilgisayarın motoru da kasanın içindedir.',
    soru: 'Ekran bozulursa fotoğraflarınız da gider mi?',
    cevap: 'Hayır. Ekran sadece gösterir. Fotoğraflar kasanın içinde saklıdır. Başka bir ekran takınca hepsi yerindedir.',
  },
  {
    title: 'Düğmeler ve girişler',
    era: '2010', view: 'front', show: ['onPanel'], keep: ['kasa'], labels: [], dir: [0.3, 1.0, 1.1],
    spot: ['onIO', [-2.5, 0.2, 0], 12],
    marks: [['onIO', [-4.4, 0.4, 0.2], '⏻ Açma düğmesi'], ['onIO', [-0.3, 0.4, 0.2], 'USB girişleri'], ['onIO', [3.05, 0.4, 0.2], 'Kulaklık · mikrofon'], ['onIO', [5.3, 0.4, 0.2], 'Yeniden başlat']],
    text: 'Bu kasada düğmeler <b>üstte, önde</b>: yuvarlak ışıklı olan <b>açma düğmesi</b> (⏻). Yanında <b>USB bellek</b> takılan girişler, <b>kulaklık</b> (yeşil) ve <b>mikrofon</b> (pembe) girişleri var. Bazı kasalarda bunlar ön yüzdedir. Açma düğmesinde hep ⏻ işareti olur.',
    ornek: 'Evin kapısı ve zili gibi: dışarıdan içeriye ulaştığımız yer. Açma düğmesi de evin anahtarıdır.',
    soru: 'Bilgisayar dondu, fare de klavye de çalışmıyor. Ne yaparsınız?',
    cevap: 'Önce bir-iki dakika bekleyin. Düzelmezse açma düğmesine 5–10 saniye basılı tutun; bilgisayar kapanır. Kaydedilmemiş işler gider, o yüzden başka çare yoksa yapılır. Normalde Başlat → Güç → Kapat ile kapatılır.',
  },
  {
    title: 'Kasayı açalım',
    era: '2010', view: 'inside', open: true,
    text: 'Yan kapağı açtık. İçeride birkaç parça ve kablolar var. Şimdi bu parçaları <b>birer birer</b> tanıyacağız.',
    ornek: 'Buzdolabının arkasını açmadan önce fişini çekeriz. Gerçek bir bilgisayarı açmadan önce de <b>fişi çekilir</b>.',
    soru: 'Kasayı açmadan önce ilk ne yapılır?',
    cevap: 'Bilgisayar kapatılır ve fişi çekilir. Parçalara kenarlarından tutarak dokunulur.',
  },
  {
    title: 'Anakart: her şeyin takıldığı kart',
    era: '2010', view: 'inside', open: true, show: ['anakart'], zoom: 0.8,
    text: '<b>Anakart</b> kasanın içindeki en büyük karttır. Diğer bütün parçalar ona takılır. Parçalar birbiriyle anakart üzerinden haberleşir.',
    ornek: 'Bir şehrin <b>yolları</b> gibi. Diğer parçalar binalardır, anakart aralarındaki yollardır. Yol kapanırsa kimse kimseye ulaşamaz.',
    soru: 'Anakart bozulursa ne olur?',
    cevap: 'Bilgisayar çoğu zaman hiç açılmaz. İçindeki dosyalar ise genelde kurtarılabilir.',
  },
  {
    title: 'İşlemci: bilgisayarın beyni',
    era: '2010', view: 'inside', open: true, show: ['islemci'], remove: ['sogutucu'], zoom: 1.6,
    text: '<b>İşlemci</b> bilgisayarın beynidir. Tıkladığınız, yazdığınız her şeyi o hesaplar. Küçük, kare bir parçadır. Normalde üstünde bir fan durur; görebilmeniz için onu kaldırdık.',
    ornek: 'Bir lokantanın <b>aşçısı</b> gibi: siparişleri (sizin tıklamalarınızı) o hazırlar. Aşçı ne kadar iyiyse yemek o kadar çabuk gelir.',
    soru: 'Bilgisayar her işte çok yavaşsa sebebi işlemci olabilir mi?',
    cevap: 'Evet, eski ya da zayıf bir işlemci bilgisayarı yavaşlatır. Ama önce disk ve bellek (birazdan göreceğiz) kontrol edilir; çoğu zaman sorun onlardadır.',
  },
  {
    title: 'İşlemcinin adı: “i5, 4. nesil” ne demek?',
    era: '2010', view: 'inside', open: true, show: ['islemci'], remove: ['sogutucu'], zoom: 1.6,
    text: 'İlanlarda işlemci şöyle yazar: <b>Intel Core i5-4590</b>. İki şeye bakmak yeter:',
    tablo: [
      ['<b>i3 · i5 · i7 · i9</b>', '<b>Sınıfı.</b> Sayı büyüdükçe daha güçlü: i3 ev işleri, i5 orta, i7 güçlü, i9 en güçlü.'],
      ['<b>Tireden sonraki ilk sayı</b>', '<b>Nesli</b>, yani hangi yılın işlemcisi olduğu. i5-<b>4</b>590 → 4. nesil (2014 civarı). i5-<b>12</b>400 → 12. nesil (2022 civarı).'],
      ['<b>AMD Ryzen 3 · 5 · 7 · 9</b>', 'Öteki marka; aynı mantık. Ryzen 5 ≈ i5.'],
    ],
    ornek: 'Araba gibi: <b>i3, i5, i7</b> aynı arabanın donanım paketleridir (temel, orta, dolu). <b>Nesil</b> ise model yılıdır. 2014 model “dolu paket” bir araba, 2023 model “orta paket” arabadan çoğu zaman daha geridir. Yani <b>yeni bir i5, eski bir i7’den hızlı olabilir</b>. Bu derste gördüğünüz 2010’lar bilgisayarı tam da bir “4. nesil” dönemi bilgisayardır.',
    soru: 'İkinci elde iki bilgisayar var: “i7, 4. nesil” ve “i5, 12. nesil”. Hangisi daha hızlıdır?',
    cevap: 'Büyük ihtimalle i5, 12. nesil. Arada 8 nesil, yani yaklaşık 8 yıl var. Önce nesle, sonra sınıfa bakın.',
  },
  {
    title: 'Fan: işlemciyi serin tutar',
    era: '2010', view: 'inside', open: true, show: ['sogutucu'], zoom: 1.3,
    text: 'İşlemci çalışırken <b>ısınır</b>. Üstündeki metal parça ısıyı çeker, <b>fan</b> da sıcak havayı üfleyip uzaklaştırır. Bilgisayar zorlanınca fan hızlanır, sesi artar. Bu normaldir.',
    ornek: 'Sıcak çorbayı üfleyerek soğutmak gibi: fan da işlemciyi sürekli üfler.',
    soru: 'Dizüstü bilgisayarı yorganın üstünde kullanırsak ne olur?',
    cevap: 'Alttaki hava delikleri kapanır, bilgisayar ısınır. Önce yavaşlar, çok ısınırsa kendiliğinden kapanır. Masa gibi düz ve sert bir yerde kullanın.',
  },
  {
    title: 'RAM: geçici hafıza',
    era: '2010', view: 'inside', open: true, show: ['ram1', 'ram2'], labels: ['ram1'], zoom: 1.6,
    text: '<b>RAM</b>, o an açık olan işleri tutar: açık programlar, yazdığınız ama <b>henüz kaydetmediğiniz</b> yazı. Çok hızlıdır ama <b>geçicidir</b>: bilgisayar kapanınca ya da elektrik gidince içi silinir. Büyüklüğü <b>GB</b> ile söylenir: 8 GB, 16 GB.',
    ornek: 'RAM bir <b>çalışma masasıdır</b>: dosyayı dolaptan alıp masaya koyarsınız, üzerinde çalışırsınız; akşam masa temizlenir. Ya da bir telefon numarasını <b>çevirene kadar aklınızda tutmak</b> gibi: arayınca unutursunuz. Masa büyükse (çok GB) aynı anda çok iş açık durur.',
    soru: 'Yazı yazarken elektrik kesildi, kaydetmemiştiniz. Yazı neden kayboldu?',
    cevap: 'Yazı henüz RAM’deydi, yani masanın üstündeydi; dolaba (diske) konmamıştı. Elektrik gidince RAM boşaldı. Bu yüzden sık sık Ctrl + S ile kaydedin.',
  },
  {
    title: 'Disk: kalıcı hafıza',
    era: '2010', view: 'inside', open: true, show: ['hdd'], inside: 'hdd',
    text: 'Fotoğraflar, belgeler, programlar <b>diskte</b> saklanır. Bilgisayar kapansa da <b>silinmez</b>. Bu eski tip diskin (HDD) içinde plak gibi <b>dönen</b> parlak bir disk ve onu okuyan bir kol var. Büyüklüğü <b>GB</b> ya da <b>TB</b> ile söylenir; 1 TB = 1000 GB.',
    ornek: 'Disk bir <b>dolaptır</b>: eşyalar orada kalıcı durur. Bu eski diskin içi ise bir <b>pikap</b> gibi: plak döner, iğne okur.',
    soru: 'Çalışan bilgisayarın kasasına çarparsanız hangi parça zarar görebilir?',
    cevap: 'Bu dönen disk (HDD). Okuyan kol dönen plağa çarpıp çizebilir, dosyalar kaybolabilir. Çalışan kasayı sarsmayın.',
  },
  {
    title: 'SSD: hızlı disk',
    era: '2010', view: 'inside', open: true, show: ['ssd'], inside: 'ssd',
    text: '<b>SSD</b> de bir disktir, dosyaları kalıcı saklar. Ama içinde dönen bir şey yoktur, küçük yongalar vardır. Eski diskten <b>çok daha hızlıdır</b>: bilgisayar birkaç saniyede açılır.',
    ornek: 'Eski disk, kütüphanede raflar arasında yürüyüp kitap aramak gibidir. SSD ise kitabın <b>elinizin altındaki çekmecede</b> durması gibi.',
    soru: 'Eski bilgisayarınız çok geç açılıyor. Ne yaptırmak en çok işe yarar?',
    cevap: 'Eski disk yerine SSD taktırmak. Eski bilgisayarları en çok bu hızlandırır.',
  },
  {
    title: 'RAM mi, disk mi? En çok karıştırılan konu',
    era: '2010', view: 'inside', open: true, show: ['ram1', 'ram2', 'hdd', 'ssd'], labels: ['ram1', 'hdd', 'ssd'], zoom: 0.9,
    text: 'İkisine de “hafıza” denir ama işleri farklıdır. <b>Kaydet</b>’e basmak, masadakini dolaba koymaktır.',
    tablo: [['', '<b>RAM</b> (masa)', '<b>Disk</b> (dolap)'], ['Ne tutar?', 'Şu an açık işler', 'Bütün dosyalar'], ['Kapanınca', 'Silinir', 'Kalır'], ['Hız', 'Çok hızlı', 'Daha yavaş'], ['Ne kadar?', '8–32 GB', '256 GB – 2 TB']],
    ornek: 'İlanda “16 GB RAM, 512 GB SSD” yazıyorsa: 16 GB’lık masa, 512 GB’lık dolap demektir.',
    soru: 'Bilgisayar “Disk dolu” diyor. RAM mi gerekir, disk mi?',
    cevap: 'Disk: dolap dolmuş. Gereksiz dosyaları silin ya da daha büyük disk taktırın. RAM, aynı anda çok program açınca bilgisayar yavaşlıyorsa artırılır.',
  },
  {
    title: 'Ekran kartı: görüntüyü çizer',
    era: '2010', view: 'inside', open: true, show: ['ekranKarti'], zoom: 1.0,
    text: '<b>Ekran kartı</b>, ekranda gördüğünüz her şeyi çizip ekrana gönderir. Ekranın kablosu onun arkasına takılır. Oyun ve video işi için güçlüsü gerekir; internet ve yazı için basit olanı yeter.',
    ornek: 'Bir <b>ressam</b> gibi: saniyede onlarca resim çizer. Resimler hızla değişince biz hareket görürüz; çizgi film gibi.',
    soru: 'Bilgisayarın ışığı yanıyor, fanı dönüyor ama ekranda görüntü yok. Neye bakarsınız?',
    cevap: 'Ekranın fişine ve düğmesine; sonra ekran kablosunun iki ucunun da tam takılı olduğuna.',
  },
  {
    title: 'Güç kaynağı: elektriği hazırlar',
    era: '2010', view: 'inside', open: true, show: ['psu'], zoom: 1.2,
    text: '<b>Güç kaynağı</b>, bilgisayarın fişinin takıldığı kutudur. Prizdeki güçlü elektriği parçaların kaldırabileceği <b>zayıf elektriğe</b> çevirir ve kablolarla her parçaya dağıtır.',
    ornek: 'Telefonun <b>şarj aleti</b> gibi: prizdeki elektriği telefona uygun hale getirir.',
    soru: 'Elektrik sık kesiliyor. Bilgisayarı korumak için ne kullanılır?',
    cevap: 'Kesintisiz güç kaynağı (UPS) denen bir cihaz. Elektrik gidince birkaç dakika çalıştırır; işinizi kaydedip kapatırsınız.',
    btns: [['⚡ Ne kadar elektrik harcıyor?', 'power']],
  },
  {
    title: 'Kablolar: elektrik ve bilgi',
    era: '2010', view: 'inside', open: true, cables: 'hdd',
    text: 'Diske <b>iki kablo</b> takılır: <b class="pw">turuncu</b> olan elektrik getirir, <b class="dt">mavi</b> olan bilgiyi taşır. Biri eksikse disk çalışmaz.',
    ornek: 'Evinize de iki ayrı kablo gelir: biri elektrik, biri internet. Bilgisayarın içi de öyledir.',
    soru: 'Diske yalnızca elektrik kablosu takılıysa bilgisayar diski görür mü?',
    cevap: 'Görmez. Disk çalışır ama bilgi kablosu olmadığı için bilgisayar ona ulaşamaz.',
  },
  {
    title: 'Kasa fanları: içeriyi havalandırır',
    era: '2010', view: 'inside', open: true, show: ['onFanlar', 'fanArka'], keep: ['kasa', 'anakart', 'psu'], dir: [-1, 0.35, 0.3], zoom: 0.9,
    text: 'Öndeki fanlar serin havayı <b>içeri alır</b>, arkadaki fan sıcak havayı <b>dışarı atar</b>.',
    ornek: 'Evde karşılıklı iki pencereyi açınca olan <b>cereyan</b> gibi.',
    soru: 'Fan sesi eskisinden çok daha fazla. Ne olabilir?',
    cevap: 'İçeride toz birikmiş olabilir. Fiş çekiliyken tozu temizletin. Kasayı duvara dayamayın, arkasında boşluk kalsın.',
  },
  {
    title: 'CD/DVD sürücüsü',
    era: '2010', view: 'front', show: ['optik'], keep: ['kasa'], tray: true, dir: [0.4, 0.3, 1], zoom: 1.4,
    text: 'CD ve DVD’leri okur. Yeni bilgisayarların çoğunda artık yoktur; yerini <b>USB bellek</b> ve internet aldı.',
    ornek: 'Pikap gibi döner, ama okuyan bir iğne değil, ince bir ışıktır.',
    soru: 'Yeni bilgisayarınızda DVD yeri yok. Eski düğün DVD’nizi nasıl izlersiniz?',
    cevap: 'USB ile takılan ayrı bir DVD sürücüsü alınır. Bir kez bilgisayara kopyalayıp saklamak da iyi olur.',
  },
  {
    title: 'Arkadaki girişler: hangi kablo nereye?',
    era: '2010', view: 'io',
    text: 'Kasanın arkasında kablo girişleri var: <b>USB</b> (fare, klavye, yazıcı), <b>HDMI</b> (ekran, televizyon), <b>internet kablosu</b> girişi ve <b>ses girişleri</b> (yeşil: hoparlör, pembe: mikrofon). Bir girişe tıklarsanız adı yazar.',
    ornek: 'Her kablonun ucu farklıdır, yanlış yere girmez. Girmiyorsa <b>zorlamayın</b>; çevirip yeniden deneyin.',
    soru: 'USB bellek girmiyor. Ne yaparsınız?',
    cevap: 'Zorlamayın; ters çevirip yeniden deneyin. USB çoğu zaman ilk denemede ters gelir.',
  },
  {
    title: 'Hepsi bir arada',
    era: '2010', view: 'front', explode: 1, dir: [-0.85, 0.35, 0.75], zoom: 1.0,
    text: 'Parçaları ayırdık. Her biri bir iş yapar; hiçbiri tek başına bilgisayar değildir. Birlikte çalışınca bilgisayar olurlar. Alttaki kaydırıcıyla parçaları toplayıp yeniden ayırabilirsiniz.',
    ornek: 'Bir lokanta gibi: aşçı (işlemci), tezgâh (RAM), kiler (disk), garson (ekran kartı) ve elektrik (güç kaynağı). Biri eksik olursa yemek gelmez.',
    soru: 'Hangi parça olmadan bilgisayar hiç açılmaz?',
    cevap: 'Anakart, işlemci, RAM ve güç kaynağı olmadan açılmaz. Disk olmadan açılır ama Windows gelmez.',
  },
  {
    title: 'Bir fotoğrafı açınca içeride ne olur?',
    era: '2010', view: 'inside', open: true, zoom: 0.9,
    flow: [[['hdd', 'ssd'], '1. Disk fotoğrafı bulur (dolaptan çıkarılır)'], [['ram1', 'ram2'], '2. Fotoğraf RAM’e gelir (masaya konur)'], [['islemci', 'sogutucu'], '3. İşlemci fotoğrafı açar (aşçı hazırlar)'], [['ekranKarti'], '4. Ekran kartı ekrana çizer (ressam gösterir)']],
    text: 'Bir fotoğrafa çift tıkladığınızda parçalar sırayla çalışır. Yanan parçayı izleyin:',
    ornek: 'Dolaptan dosyayı alırsınız, masaya koyarsınız, okursunuz, sonra karşınızdakine gösterirsiniz.',
    soru: 'Fotoğrafı kırptınız ama kaydetmeden kapattınız. Hangisi kalır?',
    cevap: 'Eski hali. Kırpılmış hali yalnızca RAM’deydi; kaydetmeden kapatınca silindi.',
  },
  {
    title: 'Bugünün bilgisayarı: küçücük disk',
    era: '2025', view: 'inside', open: true, show: ['m2'], keep: ['anakart', 'ram1', 'ram2', 'islemci'], remove: ['ekranKarti', 'sogutucu'], dir: [-0.7, 1, 0.35], zoom: 3.2,
    text: 'Bugün disk, <b>sakız paketi</b> kadar küçük olabilir (adı M.2 SSD). Kablosu yoktur, doğrudan anakarta takılır ve çok hızlıdır. Parçalar değişse de görevleri aynıdır.',
    ornek: 'Sakız paketi kadar ama içine on binlerce fotoğraf sığar. Dizüstü bilgisayarlarda da genelde bu disk vardır.',
    soru: 'Dizüstü bilgisayarda bu parçalar nerede?',
    cevap: 'Klavyenin altındaki gövdede, küçültülmüş olarak. Bir de pil vardır.',
  },
  {
    title: 'Eskiden: disket',
    era: '1990', view: 'front', show: ['disket'], keep: ['kasa'], dir: [0.3, 0.35, 1], zoom: 1.6,
    text: '1990’larda dosyalar <b>disketle</b> taşınırdı. Bir diskete bugünkü <b>tek bir telefon fotoğrafı</b> bile sığmaz! Bugünkü bir diske yüz binlerce disket sığar.',
    ornek: 'Disket bir kartpostal, bugünkü disk bir kütüphane.',
    soru: 'Disketin yerini bugün ne aldı?',
    cevap: 'USB bellek ve internet (e-posta, bulut).',
    btns: [['⇄ Eski ve yeni diskleri karşılaştır', 'compare:depolama']],
  },
  {
    title: 'Özet',
    era: '2010', view: 'inside', open: true,
    text: 'Bugün kasanın içini tanıdık:',
    tablo: [['🟩 Anakart', 'Şehrin yolları: her şey ona takılır'], ['🧠 İşlemci', 'Beyin, aşçı. i3–i9 sınıfı, nesil yılı'], ['🗒 RAM', 'Masa: geçici, kapanınca silinir'], ['🗄 Disk (HDD/SSD)', 'Dolap: kalıcı, kapanınca da durur'], ['🎨 Ekran kartı', 'Ressam: görüntüyü çizer'], ['🔌 Güç kaynağı', 'Şarj aleti: elektriği hazırlar'], ['🌀 Fan', 'Serinletir']],
    ornek: 'Şimdi buldurma oyunuyla parçaları bulun, sonra testi çözün.',
    btns: [['❓ Buldurma oyunu', 'quiz'], ['✅ Testi çöz', 'test']],
  },
];
