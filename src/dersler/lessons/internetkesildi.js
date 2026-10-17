// 8. hafta ek dersi: İnternet kesildi! “Wi-Fi bağlı ama internet yok” ne demek, modem ışıkları,
// modemi kapatıp 10 saniye bekleyip açmak, acil durumda telefonun internetini paylaşmak (Kişisel Erişim Noktası), hız testi.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { modemPanel, hotspotPhone, online, HOTSPOT, LEDS } from '../apps/modem.js';
import { HIZ_HOST } from '../apps/siteler-ag.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const internetKesildi = {
  id: 'internet-kesildi', icon: '📶', title: 'İnternet kesildi! Modem ışıkları ve telefondan internet', minutes: 25, stage: 'desktop',
  desc: '“Wi-Fi bağlı ama internet yok”, modemi doğru yeniden başlatmak, telefonun internetini paylaşmak, hız testi.',
  summary: [
    ['🌐 Wi-Fi bağlı, internet yok', 'Bilgisayar modeme bağlı ama modem internete çıkamıyor: sorun modemde ya da hatta'],
    ['Power · DSL · Internet', 'Elektrik var mı · hat geliyor mu · internete bağlandı mı'],
    ['Internet ışığı sönük / kırmızı', 'Modemi kapatın, 10 saniye bekleyin, açın; ışıkların yerleşmesi için 2-3 dakika bekleyin'],
    ['DSL ışığı hiç yanmıyor', 'Hat gelmiyor: kabloları kontrol edin, düzelmezse internet şirketini arayın'],
    ['Kişisel Erişim Noktası', 'Telefonun internetini bilgisayara paylaşır; mobil veri paketinden harcar'],
    ['Hız testi', 'İndirme (Mbps) ve ping (ms); görüntülü görüşmeye 3 Mbps, film için 5 Mbps yeter'],
  ],
  steps: [
    {
      title: 'Wi-Fi var, internet yok!',
      html: `<p>Haberlere bakmak istediniz ama sayfa açılmıyor: <b>“İnternete bağlı değilsiniz”</b>. Oysa Wi-Fi bağlı görünüyor. Nasıl olur?</p>
        <p>Evdeki internet iki parçadır: <b>bilgisayar ↔ modem</b> arası Wi-Fi ile, <b>modem ↔ dış dünya</b> arası telefon ya da fiber hattıyla bağlıdır. Wi-Fi sağlam olabilir ama modem dışarıya çıkamıyorsa internet olmaz.</p>
        <p>Masanın köşesinde <b>modeminiz</b> duruyor (sol altta).</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); modemPanel(c.d); br(c, 'www.gunun-haberleri.com.tr'); },
    },
    {
      title: 'Sağ alttaki simgeye bakın',
      html: '<p>Saatin yanındaki ağ simgesi değişti: <b>🌐</b>. Üzerine tıklayın; Wi-Fi düğmesinde ne yazdığını okuyun.</p>',
      mouse: '🖱 Sağ alttaki 🌐 simgesi',
      on: (ev) => ev.type === 'quick' && ev.open,
      done: '“EvAğı · İnternet yok”: bilgisayar modeme bağlı, ama modemin interneti yok. Sorunu modemde arayacağız.',
    },
    {
      title: 'Modemin ışıklarını tanıyın',
      html: '<p>Modemin önündeki <b>beş ışığa</b> sırayla tıklayın; her birinin ne anlattığı modemin altında yazar.</p>',
      mouse: '🖱 Modemdeki ışıklar',
      setup: (c) => { c.s.seen = new Set(); },
      on: (ev, c) => {
        if (ev.type !== 'modem-led') return false;
        c.s.seen.add(ev.id);
        if (c.s.seen.size < LEDS.length) c.note(`${c.s.seen.size} / ${LEDS.length} ışık okundu.`);
        return c.s.seen.size >= LEDS.length;
      },
      done: 'Beş ışığı da tanıdınız. Şimdi hangisinin sorun çıkardığına bakalım.',
    },
    rehberSoru({
      title: 'Hangi ışık sorunlu?',
      html: '<p>Modemdeki ışıklara bakın. Hangisi sorunu gösteriyor?</p>',
      opts: ['Power: elektrik', 'Internet: kırmızı yanıyor', 'WLAN: yanıp sönüyor'], ok: 1,
      wrong: 'Bu ışık normal görünüyor. Rengi farklı olana bakın.',
      why: 'Doğru: Internet ışığı kırmızı. Modemin elektriği ve hattı var ama internete bağlanamamış. En sık çözüm: modemi yeniden başlatmak.',
    }),
    {
      title: 'Modemi kapatın',
      html: '<p>Modemin <b>arkasındaki ⏻ düğmesine</b> basarak kapatın. (Düğme yoksa fişini çekmek de olur.) Bütün ışıklar söner.</p>',
      mouse: '🖱 Modemin arkasındaki ⏻',
      check: (c) => c.d.modem && !c.d.modem.on && !c.d.modem.booting,
      on: (ev) => ev.type === 'modem-power' && !ev.on,
      done: 'Modem kapandı. Şimdi acele etmeyin!',
    },
    {
      title: '10 saniye bekleyin, sonra açın',
      html: `<p>Modemi kapattıktan sonra <b>en az 10 saniye</b> bekleyin. Bu sürede içindeki elektrik tamamen boşalır, hafızası sıfırlanır. Hemen açarsanız sorun çoğu zaman geçmez.</p>
        <p>Modemin altında kaç saniyedir kapalı olduğu yazıyor. <b>10'u geçince</b> ⏻'a yeniden basın ve ışıkların yerleşmesini bekleyin.</p>`,
      hint: 'Önce DSL ışığı yanıp söner, sonra sabitlenir; en son Internet ışığı yeşil yanar. Gerçek modemde bu 2-3 dakika sürebilir.',
      check: (c) => online(c.d),
      on: (ev, c) => {
        if (ev.type === 'modem-power' && ev.on && ev.waited < 10000) c.warn(`Modemi ${Math.round(ev.waited / 1000)} saniye sonra açtınız. Çok erken! Işıklar yerleşince ne olacağına bakın; olmazsa yeniden kapatıp 10 saniye bekleyin.`);
        if (ev.type === 'modem-power' && ev.on && ev.waited >= 10000) c.note('Güzel, yeterince beklediniz. Işıkların yerleşmesini bekleyin…');
        if (ev.type === 'modem-ready' && !ev.internet) c.warn('Internet ışığı yine kırmızı: modem yeterince kapalı kalmadı. ⏻ ile kapatın, 10 saniye bekleyip açın.');
        return ev.type === 'modem-ready' && ev.internet;
      },
      done: 'Internet ışığı yeşil! Sağ alttaki simge de 📶 oldu.',
    },
    {
      title: 'Sayfayı yeniden deneyin',
      html: '<p>Tarayıcıdaki <b>⟳ Yeniden dene</b> düğmesine (ya da adres çubuğunun yanındaki ⟳ yenile düğmesine) basın.</p>',
      setup: (c) => br(c),
      on: (ev, c) => (ev.type === 'web-reload' || ev.type === 'web-nav') && online(c.d),
      done: 'Haber sitesi açıldı. Çoğu internet sorunu bu kadarla çözülür.',
    },
    {
      title: 'İnternetiniz ne kadar hızlı?',
      html: `<p>Adres çubuğuna <b>${HIZ_HOST}</b> yazıp açın ve <b>BAŞLA</b>'ya basın. Ölçüm birkaç saniye sürer.</p>`,
      setup: (c) => br(c),
      on: (ev) => ev.type === 'speed-test' && !ev.phone,
      done: 'İndirme yaklaşık 48 Mbps: ev internetiniz rahat. Sonuçların altında ne anlama geldikleri yazıyor.',
    },
    {
      title: 'Acil durum: hat kopmuş',
      html: `<p>Ertesi gün internet yine kesildi. Bu kez <b>DSL ışığı hiç yanmıyor</b>: sokaktaki hat kopmuş, internet şirketi yarın gelecek. Modemi kapatıp açmak bu sefer işe yaramaz.</p>
        <p>Ama bugün e-Devlet'ten acil bir belge almanız lazım. Çare: <b>telefonun internetini bilgisayarla paylaşmak</b>. Sağ altta telefonunuz duruyor.</p>
        <p>Telefonda <b>Kişisel Erişim Noktası</b> anahtarını açın.</p>`,
      hint: 'Gerçek telefonda: Ayarlar → Bağlantılar (ya da Ağ ve İnternet) → Mobil Erişim Noktası / Kişisel Erişim Noktası.',
      setup: (c) => { if (!c.d.modem) modemPanel(c.d); c.d.modem.setFault('line'); if (!c.d.screen.querySelector('.dk-hotspot')) hotspotPhone(c.d); },
      check: (c) => !!c.d.hotspot,
      on: (ev) => ev.type === 'hotspot' && ev.on,
      done: `Telefon artık küçük bir modem gibi yayın yapıyor. Ekranda ağın adı (<b>${HOTSPOT.name}</b>) ve şifresi yazıyor.`,
    },
    {
      title: 'Bilgisayarı telefona bağlayın',
      html: `<p>Bilgisayardan bu ağa bağlanın: <b>⚙ Ayarlar → Ağ ve İnternet</b>. Listede <b>📱 ${HOTSPOT.name}</b> çıktı. <b>Bağlan</b>'a basın, telefondaki şifreyi yazıp <b>İleri</b>.</p>`,
      hint: `Şifre telefonun ekranında: ${HOTSPOT.pass}. Telefon ya da modem pencereyi kapatıyorsa üstlerindeki ▾ Küçült düğmesine basın. Ayarlar'ı Başlat menüsünden ya da sağ alttaki simge → Tüm ayarlar'dan açabilirsiniz.`,
      check: (c) => c.d.settings.network === HOTSPOT.name,
      on: (ev, c) => {
        if (ev.type === 'wifi-connect' && !ev.ok) c.note(`Şifre telefonun ekranında yazıyor: ${HOTSPOT.pass}`);
        return ev.type === 'wifi-connect' && ev.ok && ev.name === HOTSPOT.name;
      },
      done: 'Bağlandınız! Bilgisayar internete telefon üzerinden çıkıyor.',
    },
    {
      title: 'Telefonun hızını ölçün',
      html: `<p>Tarayıcıda <b>${HIZ_HOST}</b> sitesinde yeniden ölçün (<b>⟳ Yeniden ölç</b> ya da sayfayı yenileyip <b>BAŞLA</b>).</p>`,
      setup: (c) => br(c, HIZ_HOST),
      on: (ev) => ev.type === 'speed-test' && ev.phone,
      done: 'Yaklaşık 18 Mbps: ev internetinden yavaş ama e-Devlet, e-posta, hatta görüntülü görüşme için yeter. Yalnız <b>mobil veri paketinizden</b> harcar; film izlemeyin, iş bitince erişim noktasını kapatın.',
    },
    rehberSoru({
      title: 'İlk ne yaparsınız?',
      html: '<p>Wi-Fi bağlı görünüyor ama hiçbir site açılmıyor. Modemde <b>Internet</b> ışığı sönük. İlk ne yaparsınız?</p>',
      opts: ['Bilgisayara yeni bir tarayıcı kurarım', 'Modemi kapatır, 10 saniye bekler, açarım', 'Wi-Fi şifresini değiştiririm'], ok: 1,
      wrong: 'Sorun bilgisayarda değil, modemde. Modemle ilgili seçeneğe bakın.',
      why: 'Doğru. Düzelmezse ve DSL ışığı da yanmıyorsa internet şirketinizi arayın; arıza kaydı açtırın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternet kesilince ne yapacağınızı biliyorsunuz:</p>' },
  ],
};
