// 7. hafta ek dersleri: Bluetooth ve uçak modu; hesap şifresi, PIN ve ekranı kilitleme
import { K, desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

const ayarlarda = (page) => (c) => { const w = c.d.ensure('settings'); w.api.go(page); };
const ayarlar = (c) => c.d.ensure('settings');

export const bluetooth = {
  id: 'bluetooth', icon: '🎧', title: 'Bluetooth: kablosuz kulaklık ve hoparlör', minutes: 25, stage: 'desktop',
  desc: 'Bluetooth\'u açmak, kablosuz kulaklık ya da hoparlör eşleştirmek.',
  desktop: { settings: { bluetooth: false } },
  summary: [
    ['Ayarlar → Bluetooth ve cihazlar', 'Bluetooth\'u açın, ＋ Cihaz ekle'],
    ['Eşleştirme', 'Cihazı bulup “Bağlan”: bir kez yapılır, sonra kendiliğinden bağlanır'],
    ['Tanımadığınız cihaz', 'Bağlanmayın; yabancı biri bağlanmaya çalışıyor olabilir'],
    ['Sağ alt simgeler', 'Hızlı ayarlar: Wi-Fi, Bluetooth, uçak modu'],
    ['✈ Uçak modu', 'Wi-Fi ve Bluetooth\'u birlikte kapatır; internet yoksa buna bakın'],
    ['Kulaklık sesi vermiyor', 'Önce Bluetooth açık mı, kulaklık şarjlı ve açık mı, eşleşti mi?'],
  ],
  steps: [
    {
      title: 'Kablosuz bağlantı',
      html: `<p><b>Bluetooth</b>, kablo olmadan kısa mesafede bağlantı kurar: <b>kablosuz kulaklık</b>, <b>hoparlör</b>, <b>fare</b>, klavye… Telefonunuz da bununla kulaklığa bağlanır.</p>
        <p>Bağlamak için iki cihazın tanışması gerekir; buna <b>eşleştirme</b> denir. Bir kez eşleşince sonra kendiliğinden bağlanırlar.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Cihaz ayarlarını açın',
      html: '<p>⊞ Başlat → <b>⚙ Ayarlar</b>. Soldan <b>🖨 Bluetooth ve cihazlar</b>\'a tıklayın.</p>',
      setup: ayarlar,
      check: (c) => c.d.find('settings')?.el.querySelector('[data-page="devices"].on'),
      on: (ev) => ev.type === 'settings-page' && ev.page === 'devices',
    },
    {
      title: 'Bluetooth\'u açın',
      html: '<p>En üstteki <b>Bluetooth</b> düğmesi <b>Kapalı</b>. Tıklayarak <b>Açık</b> yapın.</p>',
      setup: ayarlarda('devices'),
      check: (c) => c.d.settings.bluetooth,
      on: (ev) => ev.type === 'toggle' && ev.key === 'bluetooth' && ev.on,
      done: 'Bluetooth açık. Artık yakındaki cihazları arayabilirsiniz.',
    },
    {
      title: 'Cihaz arayın',
      html: '<p><b>＋ Cihaz ekle</b>\'ye tıklayın. Bilgisayar yakındaki cihazları arar; birkaç saniye bekleyin.</p><p class="mut">Gerçek hayatta kulaklığınızın da açık olması ve eşleştirme kipine alınması gerekir (genellikle düğmesine birkaç saniye basılır).</p>',
      setup: ayarlarda('devices'),
      on: (ev) => ev.type === 'bt-found',
      done: 'Yakında dört cihaz bulundu. Hepsi sizin değil!',
    },
    {
      title: 'Kulaklığınıza bağlanın',
      html: `<p>Listede <b>Kablosuz Kulaklık K-30</b> sizin kulaklığınız. Yanındaki <b>Bağlan</b>'a tıklayın.</p>
        <p>Listede <b>TV-4F2A</b> diye tanımadığınız bir cihaz da var. Ona bağlanmayın.</p>`,
      hint: 'Bağlan düğmesi cihazın sağında. Eşleşme birkaç saniye sürer.',
      setup: ayarlarda('devices'),
      on: (ev, c) => {
        if (ev.type === 'bt-unknown') c.note('Doğru karar: tanımadığınız cihaza bağlanmayın. Listeden <b>Kablosuz Kulaklık K-30</b>\'u seçin.');
        if (ev.type !== 'bt-pair') return false;
        if (ev.unknown) { c.warn('Tanımadığınız bir cihaza bağlandınız. Gerçekte bu, yabancıların ses ve bilgi sızdırmasına yol açabilir. “Kaldır” ile silin ve kulaklığınıza bağlanın.'); return false; }
        return /Kulaklık/.test(ev.name);
      },
      done: 'Kulaklığınız bağlandı. Bu bilgisayar onu artık tanıyor; bir dahaki sefer kendiliğinden bağlanır.',
    },
    {
      title: 'Müziği kulaklıkta dinleyin',
      html: '<p>Müzik Çalar açıldı. <b>▶ Çal</b>\'a tıklayın. Ekranın köşesinde sesin nereden çaldığı yazacak.</p>',
      mouse: '🖱 ▶ Çal',
      hint: 'Ses duyulmuyorsa sağ alttaki 🔊 simgesinden sesi açın.',
      setup: (c) => c.d.ensure('music'),
      on: (ev, c) => {
        if (ev.type !== 'music-play') return false;
        if (!ev.audible) { c.warn('Ses kapalı ya da sıfırda. 🔊 simgesinden sesi açıp tekrar ▶ Çal\'a basın.'); return false; }
        return /Kulaklık/.test(ev.output);
      },
      done: 'Ses kulaklıktan geliyor. Bluetooth cihaz bağlıyken ses ona gider; bağlı değilse bilgisayarın hoparlöründen çalar.',
    },
    {
      title: 'Hızlı ayarlardan kapatın',
      html: '<p>İşiniz bitince Bluetooth\'u kapatmak pil tasarrufu sağlar. Sağ alttaki <b>Wi-Fi / ses simgelerine</b> tıklayın; açılan paneldeki <b>🔵 Bluetooth</b> düğmesiyle kapatın.</p>',
      mouse: '🖱 Sağ alt köşe → Bluetooth',
      hint: 'Saatin yanındaki 📶 ve 🔊 simgelerine tıklayınca “hızlı ayarlar” paneli açılır.',
      on: (ev) => ev.type === 'toggle' && ev.key === 'bluetooth' && !ev.on,
      done: 'Bluetooth kapandı; kulaklığın bağlantısı da kesildi.',
    },
    {
      title: 'İnternet yok! (Uçak modu)',
      html: `<p>Bir komşunuzun bilgisayarında sağ altta <b>✈</b> simgesi var ve internet çalışmıyor. Bunu siz yaratın: <b>Ayarlar → Ağ ve İnternet</b> sayfasında <b>✈ Uçak modu</b>'nu açın.</p>`,
      setup: ayarlarda('network'),
      on: (ev) => ev.type === 'airplane' && ev.on,
      done: 'Uçak modu Wi-Fi\'yi ve Bluetooth\'u birlikte kapattı. Sağ altta ✈ görünüyor. Yanlışlıkla açılınca “bilgisayar bozuldu” sanılır.',
    },
    {
      title: 'Uçak modunu kapatın',
      html: '<p>Şimdi <b>✈ Uçak modu</b>\'nu <b>Kapalı</b> yapın; Wi-Fi geri gelsin. (Sağ alttaki hızlı ayarlardan ✈ düğmesiyle de olur.)</p>',
      on: (ev) => ev.type === 'airplane' && !ev.on,
      done: 'Wi-Fi geri geldi. İnternet yoksa önce uçak modu ve Wi-Fi simgelerine bakın.',
    },
    rehberSoru({
      title: 'Kulaklık çalışmıyor',
      html: '<p>Komşunuzun Bluetooth kulaklığı eşleşmiş ama ses gelmiyor. İlk neye bakarsınız?</p>',
      opts: ['Bilgisayarı sıfırlarım', 'Bluetooth açık mı, kulaklık açık ve şarjlı mı, bağlı görünüyor mu', 'Kulaklığı hemen yenisiyle değiştiririm'], ok: 1,
      wrong: 'Bu kadar büyük bir adıma gerek yok. Önce basit kontroller yapılır.',
      why: 'Evet. Çoğu zaman kulaklığın şarjı bitmiş, Bluetooth kapalı, uçak modu açık ya da kulaklık başka bir cihaza (telefona) bağlıdır.',
    }),
    rehberSoru({
      title: 'Bilmediğiniz cihaz',
      html: '<p>Aramada “TV-4F2A” adında bir cihaz çıkıyor ve siz televizyon almadınız. Ne yaparsınız?</p>',
      opts: ['Bağlanırım, belki işe yarar', 'Bağlanmam', 'Bağlanır, şifre sorarsa 0000 yazarım'], ok: 1,
      wrong: 'Tanımadığınız bir cihaza bağlanmamak gerekir.',
      why: 'Doğru. Bilmediğiniz cihazlara bağlanmayın; komşunun televizyonu olabilir ama yabancı biri de olabilir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kablosuz cihazları rahatça kullanabilirsiniz:</p>' },
  ],
};

export const hesapPin = {
  id: 'hesap-pin', icon: '🔐', title: 'Bilgisayara şifre ve PIN koymak, ekranı kilitlemek', minutes: 25, stage: 'desktop',
  desc: 'Şifre ya da PIN koymak, ekranı kilitlemek (⊞ + L), ayrı hesaplar.',
  summary: [
    ['Ayarlar → Hesaplar', 'Şifre değiştirme, PIN ekleme'],
    ['Şifre', '8+ karakter, büyük-küçük harf ve rakam; ad, doğum yılı olmasın'],
    ['PIN', '4–6 rakam: kısa, çabuk girilir; 1234, 1111 olmasın'],
    ['⊞ + L', 'Ekranı kilitler; işler yerinde kalır'],
    ['Başlat → hesap adı → Kilitle', 'Kısayolu hatırlamıyorsanız'],
    ['Ayrı hesap', 'Her kullanıcının kendi dosyaları olur; ortak bilgisayarda en iyisi'],
  ],
  steps: [
    {
      title: 'Bilgisayarınızı koruyun',
      html: `<p>Bilgisayarda fotoğraflarınız, belgeleriniz, e-postanız var. Başka biri açıp bakmasın diye <b>açılışta şifre</b> istenir. Yerinizden kalkarken de <b>ekranı kilitlemek</b> iyi bir alışkanlıktır.</p>
        <p class="mut">Alıştırma bilgisayarının şifresi <b>1234</b>'tür.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Hesap ayarlarını açın',
      html: '<p>⊞ Başlat → <b>⚙ Ayarlar</b> → soldan <b>👤 Hesaplar</b>.</p>',
      setup: ayarlar,
      check: (c) => c.d.find('settings')?.el.querySelector('[data-page="accounts"].on'),
      on: (ev) => ev.type === 'settings-page' && ev.page === 'accounts',
    },
    {
      title: 'Şifreyi güçlendirin',
      html: `<p><b>Şifre</b> satırında <b>Değiştir</b>'e tıklayın. <b>Şu anki şifre</b>: 1234. <b>Yeni şifre</b> için şunlara dikkat edin:</p>
        <ul class="big-list"><li>Site en az <b>8 karakter</b> ister; siz <b>12 ve üzerini</b> tercih edin</li><li><b>Büyük ve küçük harf</b>, bir <b>rakam</b></li><li>Adınız, doğum yılınız olmasın</li></ul>
        <p>Yeni şifreyi iki kez yazıp <b>Kaydet</b>'e tıklayın. Şifrenizi <b>unutmayacağınız ama başkalarının tahmin edemeyeceği</b> bir cümleden yapabilirsiniz (kendi şifrenizi uydurun; örnek: “Kedim2Yasinda!”).</p>`,
      hint: 'Şu anki şifre 1234. Yeni şifreyi kendiniz uydurun; örnek: Kedim2Yasinda! (kendi şifrenizi yazın, bunu değil).',
      setup: ayarlarda('accounts'),
      on: (ev, c) => {
        if (ev.type !== 'pw-change') return false;
        if (!ev.ok) { c.warn('Şifre değişmedi: yazdığınız bilgileri kontrol edin (şu anki şifre 1234, yeni şifreler aynı olmalı).'); return false; }
        if (ev.strength < 2) { c.warn('Şifre değişti ama zayıf. Daha uzun (tercihen 12 ve üzeri), büyük ve küçük harf içeren bir şifreyle yeniden değiştirin.'); return false; }
        return true;
      },
      done: 'Şifreniz değişti. Yeni şifreyi bilgisayarın başında değil, güvenli bir deftere yazın; ekrana ya da klavyenin altına yapıştırmayın.',
    },
    {
      title: 'PIN ekleyin',
      html: `<p><b>PIN</b>, 4–6 rakamdan oluşan kısa bir şifredir; her seferinde uzun şifre yazmaktan kurtarır. <b>PIN</b> satırında <b>Ekle</b>'ye tıklayın, <b>1234 olmayan</b> 4 rakam yazıp aynısını tekrar girin.</p>`,
      hint: '1234 ve 1111 gibi kolay sayıları bilgisayar kabul etmez. Doğum yılınızdan da kaçının; örneğin 4072.',
      setup: ayarlarda('accounts'),
      on: (ev, c) => {
        if (ev.type !== 'pin-set') return false;
        if (!ev.ok) { c.warn('PIN kaydedilmedi. Yalnızca rakam, 4–6 hane, iki kutu aynı ve kolay olmasın.'); return false; }
        return true;
      },
      done: 'PIN ayarlandı. Kilit ekranında hem şifre hem PIN kabul edilir.',
    },
    {
      title: 'PIN\'i unutursanız',
      html: `<p>Giriş ekranında PIN\'i unutursanız <b>PIN\'imi unuttum</b> yazısı çıkar. Ona tıklayınca Microsoft hesabınıza bağlı e-postaya ya da telefona bir kod gelir; yeni PIN\'i bununla belirlersiniz. Bu yüzden <b>e-posta adresinizi ve telefon numaranızı güncel tutun</b>.</p>
        <p>Yerel hesapta şifrenizle girip PIN\'i yenilersiniz; şifreyi de unutursanız kurtarmak zordur, bu yüzden şifrenizi güvenli bir yere not edin.</p>`,
    },
    {
      title: 'Ekranı kilitleyin',
      html: `<p>Çay almaya kalkacaksınız. Ekranı kilitleyin: <b>⊞ Başlat</b> açıp altta <b>hesap adınıza</b> tıklayın ve <b>🔒 Kilitle</b>'yi seçin. (Klavyede ${K('⊞', 'L')}; bazı bilgisayarlarda sayfa bunu algılamayabilir.)</p>
        <p>Kilit ekranı açılınca ekrana tıklayın, <b>PIN</b>'inizi ya da şifrenizi yazın ve girin.</p>
        <p class="mut">Kilit ekranında alıştırma için bir şifre ipucu yazabilir; bu yalnız alıştırma içindir. Gerçekte şifrenizi kimse görmemeli, ekranda ya da bir kâğıtta bırakmayın.</p>`,
      hint: 'Başlat menüsünün altında sol köşede 👤 ile hesap adınız yazıyor. Ona tıklayın.',
      on: (ev, c) => {
        if (ev.type === 'screen-lock') c.s.locked = true;
        if (ev.type === 'login' && ev.ok && c.s.locked) return true;
        if (ev.type === 'login' && !ev.ok) c.note('Şifre ya da PIN yanlış. PIN\'i hatırlamıyorsanız yeni şifrenizi deneyin.');
        return false;
      },
      done: 'Kilit açıldı ve işleriniz olduğu gibi duruyor. Ekranı kilitlemek bilgisayarı kapatmaz.',
    },
    rehberSoru({
      title: 'Ortak bilgisayar',
      html: '<p>Bilgisayarı sizden başka torununuz da kullanıyor. Belgelerinizi görmesini istemiyorsunuz. En doğru çözüm hangisi?</p>',
      opts: ['Şifreyi herkesin gördüğü bir kâğıda yazarım', 'Torunum için ayrı bir hesap açarım', 'Bilgisayarı kimseye vermem'], ok: 1,
      wrong: 'Bu pek işe yaramaz. Ayarlar → Hesaplar altında daha iyi bir yol var.',
      why: 'Ayrı hesapta torununuzun kendi masaüstü ve dosyaları olur; sizinkileri göremez. Misafir hesabı da kısa süreli kullanım içindir.',
    }),
    rehberSoru({
      title: 'Şifre nereye yazılır?',
      html: '<p>Şifrenizi unutmamak için nereye yazarsınız?</p>',
      opts: ['Monitörün kenarına yapışkan notla', 'Evde güvenli bir yerde duran deftere, ne için olduğunu açıkça yazmadan', 'Telefonda “şifrem” adlı kişiye'], ok: 1,
      wrong: 'Bu pek güvenli değil. Başkasının göremeyeceği bir yer seçin.',
      why: 'Evet. Unutmamak için yazmak kötü değil, ama başkası görmemeli. Yapışkan not ekranın kenarında durursa şifre sokağa bırakılmış olur.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayarınızı koruyabiliyorsunuz:</p>' },
  ],
};
