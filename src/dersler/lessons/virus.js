// 8. hafta ek dersi: virüsler ve antivirüs programları. Zararlı yazılım çeşitleri, nasıl bulaşır, belirtileri,
// Windows Güvenliği ve ücretli antivirüsler, bulaştıysa ne yapılır, yedek almanın önemi.
import { info, ayir, sec, sekmeler } from './kalip.js';

const ZARARLI = [
  { id: 'virus', label: 'Virüs', icon: '🦠', html: '<p><b>Virüs</b> dosyalara yapışır ve bilgisayarda çoğalır; tıpkı grip virüsü gibi bir bilgisayardan ötekine bulaşır (USB bellek, e-posta eki).</p><p class="tb-warn">Kendiliğinden gelmez: çoğunlukla biz zararlı bir dosyayı açtığımız için çalışır.</p>' },
  { id: 'truva', label: 'Truva atı', icon: '🐴', html: '<p><b>Truva atı</b>, iyi görünen bir şeyin içine saklanır: “bedava oyun”, “ücretsiz film programı”, “fotoğraf düzenleyici”… Siz kendiniz kurarsınız, içindeki zararlı da birlikte kurulur.</p><p class="tb-note">Adı, eski Yunan hikâyesindeki tahta attan gelir: hediye sanıp kaleye aldılar, içinden asker çıktı.</p>' },
  { id: 'fidye', label: 'Fidye yazılımı', icon: '🔒', html: '<p><b>Fidye yazılımı</b> belgelerinizi, fotoğraflarınızı <b>şifreleyip kilitler</b> ve açmak için para ister: “Dosyalarınız şifrelendi, şu hesaba para gönderin.”</p><p class="tb-warn">Para ödemek dosyaların açılacağını garanti etmez. En iyi çare, önceden alınmış <b>yedek</b>tir.</p>' },
  { id: 'casus', label: 'Casus yazılım', icon: '🕵', html: '<p><b>Casus yazılım</b> sessizce çalışır: yazdıklarınızı (şifreler, kart numarası) kaydeder, ekranınıza bakar ve bunları dolandırıcıya gönderir. Bilgisayar hiç yavaşlamayabilir; fark etmezsiniz.</p><p class="tb-note">Bu yüzden belirti beklemeden güvenlik programını açık tutmak önemlidir.</p>' },
  { id: 'reklam', label: 'Reklam yazılımı', icon: '📢', html: '<p><b>Reklam yazılımı</b> ekranda durmadan reklam penceresi açar, tarayıcının ana sayfasını ve arama motorunu değiştirir, “araç çubukları” ekler. Çoğu zaman bedava bir programın kurulumunda <b>işaretli gelen ek kutudan</b> yüklenir.</p>' },
];

export const virusAntivirus = {
  id: 'virus-antivirus', icon: '🦠', title: 'Virüsler ve antivirüs programları', minutes: 30, stage: 'scene',
  desc: 'Virüs nedir, nasıl bulaşır, belirtileri; bulaştıysa ne yapılır.',
  summary: [
    ['Nasıl bulaşır?', 'Tanımadığınız e-posta eki, “bedava” programlar, başkasından alınan USB, sahte “güncelle” düğmeleri'],
    ['Belirtiler', 'Birden yavaşlama, açılır reklam pencereleri, ana sayfanın değişmesi, tanımadığınız programlar'],
    ['Windows Güvenliği', 'Windows\'ta hazır gelir, kendiliğinden güncellenir: ek antivirüs şart değil'],
    ['İki antivirüs', 'Aynı bilgisayarda iki ayrı antivirüs birbirini bozar: yalnızca birini kullanın'],
    ['“Bedava antivirüs” indirmek', 'Sahte olabilir; resmî sitelerden ve güvendiğiniz kaynaktan'],
    ['Sahte uyarı', 'Siteden çıkan “virüs bulundu” penceresi tuzaktır; gerçek uyarı Windows\'tan gelir'],
    ['Bulaştıysa', 'İnterneti kesin → tam tarama → şüpheli programı kaldırın → şifreleri başka cihazdan değiştirin'],
    ['Fidye isteyen yazılım', 'Para göndermeyin; yedekten geri dönün. Bu yüzden düzenli yedek alın'],
  ],
  steps: [
    {
      title: 'Virüs nedir?',
      html: `<p><b>Bilgisayar virüsü</b>, bilgisayara gizlice girip zarar veren ya da casusluk yapan küçük programdır. Adı gripten gelir: bir bilgisayardan ötekine <b>bulaşır</b>.</p>
        <p>Ama bir fark var: virüs kendi kendine gelmez. Çoğu zaman <b>biz bir şeyi açtığımız için</b> çalışır. Yani en önemli korunma, ne açtığınıza dikkat etmektir.</p>
        <p>Bu derste zararlı yazılımların çeşitlerini, nasıl bulaştıklarını ve ne yapmanız gerektiğini öğreneceğiz.</p>`,
      scene: info('<div class="sc-big">🦠 ➜ 💻</div><p>Çoğu zaman siz açmadan bulaşmaz</p>'),
    },
    {
      title: 'Beş çeşit zararlı yazılım',
      html: '<p>Sağdaki beş sekmeye <b>sırayla tıklayıp</b> okuyun. Hepsine genel olarak “virüs” denir ama her biri farklı davranır.</p>',
      scene: sekmeler({ tabs: ZARARLI, intro: 'Zararlı yazılımlar farklı işler yapar.' }),
      on: (ev) => ev.type === 'tabs-done',
      done: 'Beşini de okudunuz. Hepsinin ortak yolu: sizin bir şeyi açmanız ya da kurmanız.',
    },
    ayir({
      title: 'Nasıl bulaşır?',
      html: '<p>Her kartı sürükleyin: <b>bulaşma riski olan</b> mı, <b>güvenli bir davranış</b> mı?</p>',
      bins: [{ id: 'risk', label: 'Bulaştırabilir', icon: '⚠' }, { id: 'ok', label: 'Güvenli', icon: '✅' }],
      items: [
        { label: 'Tanımadığınız kişiden gelen e-postadaki .exe eki', icon: '📎', bin: 'risk', why: '.exe çalışan bir programdır; zararlı olabilir.' },
        { label: '“Bedava oyun / film” programı kurmak', icon: '🎮', bin: 'risk', why: 'Truva atlarının en sevdiği yol.' },
        { label: 'Başkasından aldığınız USB belleği taratmadan açmak', icon: '💾', bin: 'risk', why: 'Bellekler virüs taşıyabilir; önce taratın.' },
        { label: 'Sitede çıkan “Programınız eski, güncelleyin” düğmesi', icon: '🔄', bin: 'risk', why: 'Sahte güncelleme: gerçek güncellemeler Windows\'tan gelir.' },
        { label: 'Windows güncellemelerini kurmak', icon: '🔧', bin: 'ok', why: 'Güvenlik açıklarını kapatır.' },
        { label: 'Programı yalnızca resmî sitesinden indirmek', icon: '🏛', bin: 'ok', why: 'Kaynağı bilinen program güvenlidir.' },
        { label: 'E-postanın yazısını okumak (ek açmadan, bağlantıya tıklamadan)', icon: '✉', bin: 'ok', why: 'Okumak tek başına zararsızdır; tehlike ek ve bağlantıdadır.' },
        { label: 'Haber sitesinde yazı okumak', icon: '📰', bin: 'ok', why: 'Güvenilir sitede okumak zararsızdır; tehlike indirme ve sahte düğmelerdedir.' },
      ],
      done: 'Bulaşma yolları hep bir “açma, kurma, tıklama” işiyle başlıyor.',
    }),
    sec({
      title: 'Bu belirtiler?', text: '<p>Bir tanıdığınızın bilgisayarı <b>birden çok yavaşladı</b>. Tarayıcının açılış sayfası kendiliğinden değişmiş, ekranda <b>durmadan reklam pencereleri</b> çıkıyor ve tanımadığı bir “araç çubuğu” belirmiş.</p>',
      q: 'Ne olmuş olabilir?', opts: ['Reklam yazılımı bulaşmış olabilir', 'Bilgisayarın saati bozulmuş', 'Klavye kirlenmiş'], ok: 0,
      why: 'Bunlar reklam yazılımının tipik belirtileridir. Çoğu zaman bedava bir programı kurarken işaretli kalan ek kutudan gelir. Windows Güvenliği ile tarama yapın ve tanımadığınız programları kaldırın.',
    }),
    sec({
      title: 'Belgeler kilitlendi', text: '<p>Bir komşunuzun bilgisayarında bütün fotoğraf ve belgeler açılmıyor. Ekranda şöyle yazıyor: <b>“Dosyalarınız şifrelendi! Açmak için 24 saat içinde şu hesaba para gönderin.”</b></p>',
      q: 'Ona ne önerirsiniz?', opts: ['Hemen parayı göndermesini', 'Para göndermemesini; bilgisayarı internetten ayırıp bir uzmana danışmasını, yedeği varsa oradan geri yüklemesini', 'Bilgisayarı kapatıp bir daha açmamasını, dosyaları unutmasını'], ok: 1,
      why: 'Fidye yazılımı. Para ödemek dosyaların geri geleceğini garanti etmez ve suçluları cesaretlendirir. Asıl çare düzenli yedektir: dosyalarınızın bir kopyası harici diskte ya da bulutta duruyorsa kaybınız olmaz.',
    }),
    {
      title: 'Antivirüs nedir?',
      html: `<p><b>Antivirüs</b>, zararlı programları tanıyıp engelleyen bekçidir. Bilinen zararlıların bir listesi vardır; yeni bir dosya geldiğinde ona bakar, tehlikeliyse durdurur.</p>
        <p>İyi haber: <b>Windows 10 ve 11'de antivirüs hazır gelir</b>. Adı <b>Windows Güvenliği</b> (Microsoft Defender). Kendiliğinden açılır, kendini günceller; çoğu ev kullanıcısı için yeterlidir.</p>
        <p class="mut">Başlat → Windows Güvenliği → Virüs ve tehdit koruması. Taramayı nasıl yapacağınızı “Virüs taraması” dersinde görmüştünüz.</p>`,
      scene: info('<div class="sc-big">🛡 ✅</div><p>Windows Güvenliği hazır gelir<br>ve kendiliğinden güncellenir</p>'),
    },
    sec({
      title: 'İki antivirüs', text: '<p>Bir tanıdığınız: “Daha güvenli olsun diye <b>üç ayrı antivirüs</b> kurdum, bilgisayar çok yavaşladı.”</p>',
      q: 'Ne dersiniz?', opts: ['Doğru yapmış, ne kadar çok o kadar güvenli', 'Antivirüsler birbirini engeller ve bilgisayarı yavaşlatır; yalnızca birini kullanmalı', 'Hepsini silsin, antivirüs gerekmez'], ok: 1,
      why: 'Aynı anda birden çok antivirüs birbirini “zararlı” sanabilir, çakışır ve bilgisayarı yavaşlatır. Windows Güvenliği yeterlidir; ücretli bir program kurulacaksa ötekini kaldırmak gerekir.',
    }),
    sec({
      title: '“Ücretsiz antivirüs”', text: '<p>Bir internet sitesinde reklam çıktı: <b>“Bilgisayarınızı koruyan ÜCRETSİZ süper antivirüs – hemen indirin!”</b></p>',
      q: 'Ne yaparsınız?', opts: ['İndiririm, ücretsiz', 'İndirmem; zaten Windows Güvenliği var. Bir program kurmak istersem yalnızca tanınmış firmanın resmî sitesine giderim', 'Arkadaşlarıma da yollarım'], ok: 1,
      why: 'Sahte “antivirüs” programları başlı başına zararlıdır. Reklamla gelen programlara güvenmeyin. Ücretli antivirüsler ebeveyn kontrolü, banka koruması gibi ek özellikler satar; çoğu kişi için şart değildir.',
    }),
    sec({
      title: 'Sahte uyarı', kind: 'web', from: '⚠ Güvenli değil | www.haber-sitesi.xyz',
      text: '<div class="fake-pop"><b>⚠ Windows Güvenlik Uyarısı</b><p>Bilgisayarınızda <b>7 VİRÜS</b> bulundu! Hemen <u>0850 000 00 00</u> numarasını arayın!</p></div>',
      q: 'Ekranınıza bu pencere geldi. Ne yaparsınız?', opts: ['Pencerede yazan numarayı ararım', 'Sekmeyi kapatırım; gerçek taramayı Windows Güvenliği\'nden kendim yaparım', 'Pencerenin gösterdiği programı indiririm'], ok: 1,
      why: 'Bir internet sitesi bilgisayarınızı tarayamaz; bu pencere sahtedir. Aranırsanız “teknik destek” dolandırıcıları bilgisayarınıza uzaktan girip para ister. Gerçek virüs uyarısı yalnızca Windows Güvenliği\'nden gelir.',
    }),
    ayir({
      title: 'Bulaştı sanıyorsanız',
      html: '<p>Bilgisayarınıza virüs bulaştığından şüpheleniyorsunuz. Hangi davranışlar <b>doğru</b>, hangileri <b>yanlış</b>?</p>',
      bins: [{ id: 'yap', label: 'Yapın', icon: '✅' }, { id: 'yapma', label: 'Yapmayın', icon: '🚫' }],
      items: [
        { label: 'Wi-Fi\'yi kapatıp internetle bağlantıyı kesmek', icon: '📶', bin: 'yap', why: 'Zararlının dışarıyla konuşmasını durdurur.' },
        { label: 'Windows Güvenliği ile tam tarama yapmak', icon: '🛡', bin: 'yap', why: 'Bulunanı temizler.' },
        { label: 'Tanımadığınız programı Ayarlar → Uygulamalar\'dan kaldırmak', icon: '🗑', bin: 'yap', why: 'Ayarlar → Uygulamalar → Yüklü uygulamalar (eski Windows\'ta Denetim Masası → Programlar ve Özellikler). Reklam ve casus yazılımlar genelde böyle temizlenir.' },
        { label: 'Şifreleri temiz bir cihazdan (örn. telefondan) değiştirmek', icon: '🔑', bin: 'yap', why: 'Casus yazılım yazdıklarınızı görmüş olabilir.' },
        { label: 'Fidye isteyenlere para göndermek', icon: '💸', bin: 'yapma', why: 'Garantisi yok; suçluyu destekler.' },
        { label: 'Reklamdaki “virüs temizleyici” programı indirmek', icon: '📥', bin: 'yapma', why: 'Çoğu sahtedir, başka zararlı yükler.' },
        { label: 'Hiçbir şey olmamış gibi bankacılık işlemi yapmaya devam etmek', icon: '🏦', bin: 'yapma', why: 'Casus yazılım varsa şifrenizi çalar. Temizlenene kadar bekleyin.' },
      ],
      done: 'Sıra: önce interneti kesin, sonra tarayın, temizleyin ve şifreleri değiştirin.',
    }),
    sec({
      title: 'En iyi savunma', text: '<p>Bütün fotoğraflarınız ve belgeleriniz bilgisayarınızda, <b>başka hiçbir yerde kopyası yok</b>.</p>',
      q: 'Bir virüs ya da bozulan disk karşısında en güvenli çözüm hangisi?', opts: ['Hiçbir şey yapmadan, sorun çıkmaması için beklemek', 'Önemli dosyaların düzenli bir kopyasını (yedek) USB belleğe, harici diske ya da buluta almak', 'Dosyaları masaüstüne taşımak'], ok: 1,
      why: 'Yedek, her tür felakete (virüs, fidye, bozulan disk, çalınan bilgisayar) karşı en iyi korumadır. Kural: önemli bir dosyanın en az iki yerde kopyası olsun.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Virüslere karşı bilmeniz gerekenler:</p>', scene: info('<div class="sc-big">🛡 🦠 ✖</div>') },
  ],
};
