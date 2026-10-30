// 15. hafta dersleri (Bilgi güvenliği): kişisel veriler ve KVKK'nın sade anlamı, ortak Wi-Fi (açık ağ, ağ profili);
// “Dolandırıldım, ne yapmalıyım?” (kartı kapatmak, harcamaya itiraz, ekran alıntısıyla delil, şifre değiştirmek,
// bilinmeyen cihazın oturumunu kapatmak, karakol / savcılık, 155, CİMER). Karar soruları rehberSoru kalıbıyladır.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { BANKA_HOST, BANKA_SIFRE } from '../apps/siteler-banka.js';
import { KURS_TC } from '../apps/siteler-gunluk.js';
import { DOST_HOST, DOST_MAIL, DOST_SIFRE } from '../apps/siteler-sosyal.js';

const KAFE = 'Kafe_Ücretsiz';
const settingsNet = (c) => { const w = c.d.ensure('settings', { page: 'network' }); w.api?.onArgs?.({ page: 'network' }); };

export const kisiselVeri = {
  id: 'kisisel-veri', icon: '🪪', title: 'Kişisel veriler ve ortak Wi-Fi', minutes: 30, stage: 'desktop',
  desc: 'T.C. kimlik no, kimlik fotoğrafı, anne kızlık soyadı kime verilmez; KVKK ne demek; kafe ve hastane Wi-Fi\'sinde nelere dikkat edilir.',
  summary: [
    ['Kişisel veri', 'Sizi tanıtan her bilgi: ad, T.C. kimlik no, adres, telefon, fotoğraf, sağlık bilgisi, banka bilgisi'],
    ['Telefonda bilgi isteyen', 'T.C. kimlik no, anne kızlık soyadı, kart ve şifre telefonda söylenmez; kurumu kendiniz arayın'],
    ['Kimlik fotokopisi', 'Gerçekten gerekli mi diye sorun; verirseniz üstüne “… için verilmiştir” ve tarih yazın'],
    ['KVKK', 'Kişisel Verilerin Korunması Kanunu: kurumlar bilginizi yalnızca gerekli işte, size haber vererek kullanabilir; ne tuttuklarını sorabilir, silinmesini isteyebilirsiniz'],
    ['Açık (şifresiz) Wi-Fi', 'Kafe, hastane, otogar: haber okumak olur; banka, e-Devlet, alışveriş olmaz'],
    ['Ağ profili', 'Herkese açık yerlerde “Ortak ağ”; yalnızca evde “Özel ağ”'],
    ['Acil iş', 'Wi-Fi\'yi kesip telefonun mobil internetini kullanın'],
  ],
  steps: [
    {
      title: 'Kişisel veri nedir?',
      html: `<p><b>Kişisel veri</b>, sizi tanıtan her bilgidir: adınız, <b>T.C. kimlik numaranız</b>, adresiniz, telefonunuz, fotoğrafınız, sağlık ve banka bilgileriniz, <b>anne kızlık soyadınız</b>.</p>
        <p>Dolandırıcılar bu bilgileri parça parça toplar: birinden doğum tarihinizi, ötekinden T.C. numaranızı… Sonra sizin adınıza hat açar, kredi çeker ya da bankayı “siz” gibi arar.</p>
        <p><b>KVKK</b> (Kişisel Verilerin Korunması Kanunu) şunu söyler: kurumlar bilginizi <b>yalnızca gerekli iş için</b> ve <b>size haber vererek</b> kullanabilir. Sizin de hakkınız var: “Hakkımda ne kaydettiniz?” diye sorabilir, yanlışsa düzeltilmesini, gereksizse silinmesini isteyebilirsiniz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    rehberSoru({
      title: 'Kargo araması',
      html: '<p>Bir kargo şirketinden aradıklarını söyleyen biri: “Paketinizi teslim edebilmemiz için <b>T.C. kimlik numaranızı ve anne kızlık soyadınızı</b> doğrulamamız gerekiyor.”</p>',
      opts: ['Söylerim, paketim gelsin', 'Söylemem; kapatıp kargo şirketinin kendi numarasını ya da sitesini ben ararım', 'Yalnızca anne kızlık soyadımı söylerim'], ok: 1,
      wrong: 'Anne kızlık soyadı birçok bankada “güvenlik sorusu”dur. Kargo için gerekmez.',
      why: 'Doğru. Kargo teslimatı için anne kızlık soyadı gerekmez. Arayan kişinin kim olduğunu bilemezsiniz; kurumu her zaman kendiniz arayın.',
    }),
    rehberSoru({
      title: 'Kimlik fotokopisi',
      html: '<p>Mahalledeki spor salonu üyelik için <b>kimliğinizin fotokopisini</b> istiyor. Ne yaparsınız?</p>',
      opts: ['Gerçekten gerekli mi diye sorarım; verirsem üstüne “Yalnızca spor salonu üyeliği için verilmiştir” ve tarihi yazarım', 'Kimliğimin fotoğrafını çekip WhatsApp\'tan herkese atarım', 'Kimliğimin aslını bırakırım'], ok: 0,
      wrong: 'Kimliğin aslı ya da her yere dağılan fotoğrafı başkasının elinde sizin adınıza kullanılabilir.',
      why: 'Doğru. Fotokopinin üstüne ne için verildiğini yazmak, başka bir işte kullanılmasını zorlaştırır. Kimliğin aslını kimseye bırakmayın.',
    }),
    rehberSoru({
      title: 'Hangisi paylaşılmaz?',
      html: '<p>Sosyal medyada hangisini <b>asla</b> paylaşmazsınız?</p>',
      opts: ['Bahçedeki çiçeklerin fotoğrafı', 'Kimlik kartının, banka kartının ya da uçak biletinin (barkodlu) fotoğrafı', 'Bir yemek tarifi'], ok: 1,
      wrong: 'Kimlik, kart ve barkodlu biletler kişisel verilerle doludur.',
      why: 'Doğru. “Yeni kimliğimi aldım” fotoğrafında T.C. numaranız, doğum tarihiniz, anne ve baba adınız görünür. Kart fotoğrafında numara ve güvenlik kodu vardır.',
    }),
    {
      title: 'Kafede Wi-Fi',
      html: `<p>Şimdi bir kafede (ya da hastane bekleme salonunda) olduğunuzu düşünün. <b>⚙ Ayarlar → 📶 Ağ ve İnternet</b> sayfası açık. Listede <b>${KAFE}</b> var; yanında “Açık ağ” yazıyor. <b>Bağlan</b>'a basın, uyarıyı okuyun ve <b>Yine de bağlan</b>.</p>`,
      hint: 'Açık ağ şifre istemez. Şifresizse herkes bağlanabilir ve gönderdikleriniz başkalarınca görülebilir.',
      setup: (c) => { if (c.d.settings.network !== KAFE) { c.d.settings.network = null; c.d.applySettings(); } settingsNet(c); },
      on: (ev) => ev.type === 'wifi-connect' && ev.ok && ev.name === KAFE,
      done: 'Bağlandınız. Windows bir soru soruyor.',
    },
    {
      title: 'Ortak ağ',
      html: '<p>“Bu ağdaki başka cihazlar bilgisayarınızı görebilsin mi?” sorusuna kafede <b>Hayır (Ortak ağ)</b> deyin.</p>',
      hint: 'Soruyu göremiyorsanız Kafe_Ücretsiz satırının altına bakın; “Ağ profili” düğmelerinden Ortak ağ\'ı seçin.',
      setup: settingsNet,
      on: (ev, c) => {
        if (ev.type !== 'net-profile') return false;
        if (ev.profile !== 'ortak') { c.note('Özel ağ seçtiniz: kafedeki başka bilgisayarlar sizinkini görebilir. “Ortak ağ”ı seçin.'); return false; }
        return true;
      },
      done: 'Ortak ağda bilgisayarınız oradaki öteki cihazlardan gizlenir. Evdeki ağınız “Özel” kalabilir.',
    },
    rehberSoru({
      title: 'Banka işi',
      html: `<p>Kafenin şifresiz ağına bağlısınız ve faturanın son günü bugün. Ne yaparsınız?</p>`,
      opts: ['Bu ağdan bankaya girip öderim', 'Bu ağda banka, e-Devlet ve alışverişe girmem; eve dönünce öderim ya da telefonun mobil internetini kullanırım', 'Kafedeki birinden telefonunu ödünç alırım'], ok: 1,
      wrong: 'Şifresiz ağda aynı ağdaki biri trafiği izleyebilir ya da kafeninkine benzeyen sahte bir ağ kurmuş olabilir.',
      why: 'Doğru. Açık ağda haber okumak, hava durumuna bakmak olur. Şifre ve kart bilgisi yazacağınız işler için kendi mobil internetinizi ya da ev ağınızı kullanın.',
    }),
    {
      title: 'Bağlantıyı kesin',
      html: `<p>Kafeden çıkıyorsunuz. <b>${KAFE}</b> satırındaki <b>Bağlantıyı kes</b>'e basın.</p>`,
      setup: settingsNet,
      on: (ev) => ev.type === 'wifi-disconnect' && ev.name === KAFE,
    },
    {
      title: 'Evde',
      html: '<p>Eve döndünüz. <b>EvAğı</b>\'na bağlanın. Şifresi modemin altındaki etikette yazar: <b>evagi2024</b></p>',
      setup: settingsNet,
      on: (ev, c) => {
        if (ev.type === 'wifi-connect' && !ev.ok) c.note('Şifre yanlış. Küçük harflerle: evagi2024');
        return ev.type === 'wifi-connect' && ev.ok && ev.name === 'EvAğı';
      },
      done: 'Ev ağınız şifreli (🔒) ve “Özel ağ”. Bankacılık işlerini burada yapabilirsiniz.',
    },
    rehberSoru({
      title: 'Hakkınız var',
      html: '<p>Hiç alışveriş yapmadığınız bir mağaza her gün size adınızla reklam SMS\'i atıyor. Numaranızı nereden aldığını söylemiyor. Ne yapabilirsiniz?</p>',
      opts: ['Hiçbir şey yapılamaz', 'Mağazaya yazılı başvurup hakkımda ne kaydettiğini sorar, silmesini isterim; sonuç alamazsam Kişisel Verileri Koruma Kurumu\'na şikâyet ederim', 'Mağazayı arayıp T.C. numaramı söylerim ki kaydı bulsunlar'], ok: 1,
      wrong: 'KVKK size bilgi isteme ve silinmesini isteme hakkı verir.',
      why: 'Doğru. Kurum bilgilerinizi neden ve nereden aldığını açıklamak zorundadır. Bazı reklam SMS\'lerinde “ret” için kısa bir yol da yazar.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kişisel verilerinizi koruyorsunuz:</p>' },
  ],
};

export const dolandirildim = {
  id: 'dolandirildim', icon: '🆘', title: 'Dolandırıldım, ne yapmalıyım?', minutes: 35, stage: 'desktop',
  desc: 'Kartı hemen kapatmak, harcamaya itiraz, ekran görüntüsüyle delil, şifreleri değiştirmek; karakol, savcılık, 155 ve CİMER.',
  summary: [
    ['1. Kartı kapatın', 'İnternet şubesi → Kartlarım → Kartı geçici olarak kapat; ya da kartın arkasındaki numarayı arayın'],
    ['2. İtiraz edin', 'Tanımadığınız harcama için bankaya “ben yapmadım” deyin; ne kadar erken o kadar iyi'],
    ['Para gönderdiyseniz', 'Havale ya da EFT ile para gönderdiyseniz bankanızı kartın arkasındaki numaradan hemen arayın; işlemin durdurulmasını ve alıcı hesabın incelenmesini isteyin'],
    ['3. Delil saklayın', 'Mesajın, sahte sitenin, hesap hareketinin ekran görüntüsü: ' + K('⊞ Windows', 'Shift', 'S') + ' ya da Ekran Alıntısı'],
    ['4. Şifreleri değiştirin', 'Sahte siteye yazdığınız şifreyi ve aynı şifreyi kullandığınız bütün hesapları'],
    ['5. Tanımadığınız cihaz', 'Ayarlar → Oturum açılan cihazlar → Oturumu kapat'],
    ['6. Şikâyet', 'Delillerle karakola, jandarmaya ya da Cumhuriyet Başsavcılığına gidin'],
    ['155 / 156', 'Tehlike anında Polis İmdat (155), jandarma bölgesinde 156'],
    ['CİMER', 'Bir kamu kurumundan sonuç alamazsanız; başvuru numaranızı yazın'],
    ['e-Devlet', 'Kimliğiniz de gittiyse: adınıza hat ya da şirket açılmış mı bakın (14. hafta)'],
  ],
  steps: [
    {
      title: 'Kötü bir sürpriz',
      html: `<p>Dün sosyal medyada bir “çekiliş” gördünüz; “kargo ücreti” için <b>kart bilgilerinizi</b> ve Dostlarım <b>şifrenizi</b> sahte bir sayfaya yazdınız. Bugün bankadan SMS geldi: kartınızdan <b>tanımadığınız bir harcama</b> yapılmış.</p>
        <p>Utanmayın: dolandırıcılık herkesin başına gelebilir. Önemli olan <b>hızlı ve sırayla</b> hareket etmek. Hepsini alıştırma bilgisayarında yapacağız.</p>
        <p class="mut">Banka: T.C. <b>${KURS_TC}</b>, şifre <b>${BANKA_SIFRE}</b> · Dostlarım: <b>${DOST_MAIL}</b>, şifre <b>${DOST_SIFRE}</b></p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        const ws = (c.d.webState ||= {});
        ws['bankam.com.tr'] ||= { moves: [['14.10.2026', 'Emekli maaşı', 15240], ['15.10.2026', 'Elektrik faturası', -1245.5], ['16.10.2026', 'Market', -386.4], ['18.10.2026', 'İNTERNET ALIŞVERİŞ · HEDİYE-KAZAN', -1249, 'sus']] };
        ws['dostlarim.com.tr'] ||= { devices: [{ id: 'pc', name: '💻 Bu bilgisayar · Windows', place: 'İstanbul', when: 'Şu an etkin', now: true }, { id: 'tel', name: '📱 Telefonum · Android', place: 'İstanbul', when: 'Dün' }, { id: 'yab', name: '📱 Bilinmeyen cihaz · Android', place: 'Ankara', when: 'Bu sabah 06:12', unknown: true }] };
        maxed(c, 'browser', { url: BANKA_HOST });
      },
    },
    rehberSoru({
      title: 'İlk iş',
      html: '<p>Kartınızdan tanımadığınız harcama yapıldığını gördünüz. <b>İlk</b> ne yaparsınız?</p>',
      opts: ['Kartı hemen kapatırım: internet şubesinden ya da kartın arkasındaki numarayı arayarak', 'Birkaç gün beklerim, belki para geri yatar', 'Önce sosyal medyada herkese anlatırım'], ok: 0,
      wrong: 'Beklemek, dolandırıcıya daha çok harcama zamanı verir.',
      why: 'Doğru. Kart açık kaldıkça yeni harcamalar gelebilir. Banka uygulaması ya da internet şubesi yoksa kartın arkasındaki müşteri hizmetleri numarasını arayın; oradaki numarayı siz arayın, size gelen mesajdaki numarayı değil.',
    }),
    {
      title: 'Bankaya girin',
      html: `<p>T.C. Kimlik No ve şifreyle girin, SMS kodunu yazın.</p><p class="mut">T.C.: <b>${KURS_TC}</b> · Şifre: <b>${BANKA_SIFRE}</b></p>`,
      on: (ev) => ev.type === 'bank-login',
    },
    {
      title: 'Kartı kapatın',
      html: '<p>Üstten <b>Kartlarım</b>\'a gidin ve banka kartınızın altındaki <b>🚫 Kartı geçici olarak kapat</b>\'a basın.</p>',
      on: (ev) => ev.type === 'bank-card-block' && ev.on,
      done: 'Kart kapandı: internette, markette, ATM\'de çalışmaz. Gerekirse banka size yeni numaralı kart gönderir.',
    },
    {
      title: 'Harcamaya itiraz edin',
      html: '<p>Üstten <b>Hesaplarım</b>\'a dönün. Son hareketlerde <b>HEDİYE-KAZAN</b> harcamasının altındaki <b>⚠ Bu harcamayı ben yapmadım: itiraz et</b>\'e basın.</p>',
      on: (ev) => ev.type === 'bank-dispute',
      done: 'İtiraz bankaya ulaştı. Banka harcamayı inceler; ne kadar erken bildirirseniz paranızı geri alma şansınız o kadar artar.',
    },
    {
      title: 'Delil: ekran alıntısı',
      html: `<p>Hesap hareketlerinin <b>ekran görüntüsünü</b> alalım. ⊞ Başlat → <b>✂ Ekran Alıntısı</b> → <b>＋ Yeni</b>. Sonra fareyle hareket listesinin üstünde sürükleyip çerçeveleyin.</p>`,
      mouse: '🖱 Ekran Alıntısı → Yeni → sürükleyin',
      hint: `Gerçek Windows'ta kısayol: ${K('⊞ Windows', 'Shift', 'S')}. Alan çok küçük olursa yeniden deneyin.`,
      on: (ev) => ev.type === 'snip',
      done: 'Alıntı panoya alındı ve Ekran Alıntısı penceresinde görünüyor.',
    },
    {
      title: 'Delili kaydedin',
      html: '<p>Ekran Alıntısı penceresinde <b>💾 Kaydet</b>\'e basın; adına <b>delil banka</b> yazıp Kaydet.</p>',
      hint: 'Pencere görünmüyorsa görev çubuğundaki ✂ simgesine tıklayın.',
      on: (ev) => ev.type === 'save' && /\.png$/i.test(ev.name || ''),
      done: 'Delil Resimler\'e kaydedildi. Dolandırıcının mesajının, sahte sitenin adresinin ve hesap hareketinin görüntüleri şikâyette çok işe yarar.',
    },
    rehberSoru({
      title: 'Şifre de gitti',
      html: '<p>Sahte sayfaya Dostlarım şifrenizi de yazmıştınız. Aynı şifreyi e-postanızda da kullanıyorsunuz. Ne yaparsınız?</p>',
      opts: ['Dostlarım\'ın ve aynı şifreyi kullandığım bütün hesapların şifresini hemen değiştiririm', 'Yalnızca Dostlarım\'ınkini değiştiririm', 'Hiçbirini değiştirmem, kimse denemez'], ok: 0,
      wrong: 'Dolandırıcılar ele geçirdikleri şifreyi başka sitelerde de dener.',
      why: 'Doğru. Bu yüzden her yerde ayrı şifre kullanmak önemlidir. Şimdi Dostlarım\'a girip şifreyi değiştireceğiz.',
    }),
    {
      title: 'Dostlarım\'a girin',
      html: `<p>${K('Ctrl', 'T')} ile yeni sekme açın, <b>${DOST_HOST}</b> adresine gidip <b>${DOST_MAIL}</b> ve <b>${DOST_SIFRE}</b> ile girin.</p>`,
      on: (ev) => ev.type === 'ds-login',
    },
    {
      title: 'Tanımadığınız cihaz',
      html: '<p><b>⚙ Ayarlar</b> → en alttaki <b>💻 Oturum açılan cihazlar</b>\'a bakın. Ankara\'dan, bu sabah 06:12\'de bir <b>Bilinmeyen cihaz</b> girmiş! Yanındaki <b>Oturumu kapat</b>\'a basın.</p>',
      on: (ev) => ev.type === 'ds-device-out' && ev.unknown,
      done: 'Dolandırıcının oturumu kapandı.',
    },
    {
      title: 'Şifreyi değiştirin',
      html: `<p>Aynı sayfada <b>🔑 Şifre değiştir</b>: şu anki şifre <b>${DOST_SIFRE}</b>; yeni şifre uzun olsun (alıştırma en az 8 ister, siz 12 ve üzerini tercih edin), büyük ve küçük harf, rakam içersin (ör. <b>MaviÇay.47kiraz</b>). Yeni şifreyi iki kez yazıp <b>Şifreyi değiştir</b>.</p>`,
      hint: 'Kırmızı yazı neyin eksik olduğunu söyler. Şifreyi kâğıda yazacaksanız evde güvenli bir yerde saklayın; bilgisayarın yanına ya da telefon kılıfına koymayın.',
      on: (ev) => ev.type === 'ds-pass' && ev.ok,
      done: 'Şifre değişti. Eski şifreyle artık kimse giremez. Bir sonraki adım iki adımlı doğrulamayı açmak olurdu (bu haftanın dersi).',
    },
    rehberSoru({
      title: 'Para gönderdim, kodu söyledim',
      html: '<p>Başka bir gün: telefonda “güvenli hesap” diyen birine <b>havale yaptınız</b> ya da <b>SMS kodunu söylediniz</b>; sonra fark ettiniz. Ne yaparsınız?</p>',
      opts: ['Hemen bankamı kartın arkasındaki numaradan ararım', 'Utandığım için kimseye söylemem', 'Arayan kişiyi geri arayıp parayı iade etmesini rica ederim'], ok: 0,
      wrong: 'Dakikalar önemlidir. Gönderilen para çoğu zaman geri alınamaz, ama ne kadar erken bildirirseniz şansınız o kadar artar.',
      why: 'Doğru. Bankayı hemen arayın; kartı kapattırın, işlemin durdurulmasını isteyin, sonra şifrelerinizi değiştirip savcılığa ya da polise başvurun. Ekran görüntülerini ve mesajları saklayın. Telefonunuza program kurdurulduysa interneti kesin ve programı silin. Utanmayın; bu kişiler işini bilir, herkes kandırılabilir.',
    }),
    rehberSoru({
      title: 'Şikâyet',
      html: '<p>Kart kapalı, şifreler değişti. Dolandırıcılığı resmî olarak nereye bildirirsiniz?</p>',
      opts: ['Ekran görüntüleri ve hesap hareketleriyle karakola, jandarmaya ya da Cumhuriyet Başsavcılığına gidip şikâyetçi olurum', 'Hiçbir yere; nasılsa bulunmaz', 'Dolandırıcının numarasını arayıp parayı isterim'], ok: 0,
      wrong: 'Şikâyet olmadan soruşturma başlamaz; dolandırıcıyı aramak da yeni bir tuzağa düşürebilir.',
      why: 'Doğru. Şikâyetinizle soruşturma başlar; bankanın itiraz sürecinde de bu şikâyet işe yarar. Yanınıza kimliğinizi, ekran görüntülerini ve hesap dökümünü alın.',
    }),
    rehberSoru({
      title: '155 ne zaman?',
      html: '<p><b>155 (Polis İmdat)</b>\'ı hangi durumda ararsınız?</p>',
      opts: ['“Polisiz” diyen biri şu an evime gelip para ya da altın istiyor', 'Bir haftalık şikâyetimin ne olduğunu sormak için', 'Kargo takip numarası öğrenmek için'], ok: 0,
      wrong: '155 acil durum hattıdır; dosya takibi için karakola ya da savcılığa başvurulur.',
      why: 'Doğru. Gerçek polis ve savcı telefonla para, altın ya da “güvenli hesaba” havale istemez. Böyle biri kapınızdaysa hemen 155\'i (jandarma bölgesinde 156) arayın.',
    }),
    rehberSoru({
      title: 'CİMER ne işe yarar?',
      html: '<p>Belediyeye ya da başka bir <b>kamu kurumuna</b> başvurdunuz, aylardır cevap gelmedi. Ne yaparsınız?</p>',
      opts: ['CİMER\'e başvurup önceki başvuru numaramı yazarım', '155\'i ararım', 'Bankaya şikâyet ederim'], ok: 0,
      wrong: '155 acil durumlar içindir. Kamu kurumlarından sonuç alamayınca CİMER\'e yazılır.',
      why: 'Doğru. CİMER, kamu kurumlarına yapılan başvurulardan sonuç alamayınca kullanılır (14. haftada denediğiniz gibi). Dolandırıcılık şikâyeti ise karakola ya da savcılığa yapılır.',
    }),
    rehberSoru({
      title: 'Kimlik de gittiyse',
      html: '<p>Sahte sayfaya <b>kimliğinizin fotoğrafını</b> da yüklediniz. Ek olarak ne yaparsınız?</p>',
      opts: ['e-Devlet\'te adıma açılmış telefon hattı ya da şirket var mı diye bakarım; varsa hemen başvururum', 'Kimliğimi değiştirmek için hiçbir şey yapmam', 'Kimlik fotoğrafımı başka sitelere de yüklerim'], ok: 0,
      wrong: 'Kimlik bilgisiyle adınıza hat açılabilir, şirket kurulabilir.',
      why: 'Doğru. e-Devlet\'teki “Mobil Hat Sorgulama” ve “Şirket Ortaklık Bilgileri” hizmetlerini 14. haftada görmüştünüz. Birkaç hafta boyunca ara ara bakın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dolandırılınca sırayla:</p>' },
  ],
};
