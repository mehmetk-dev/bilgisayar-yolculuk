// 13. hafta ek ders: tarayıcıyı ustaca kullanmak. Uzantılar (uzantı mağazası, izinler, reklam engelleyici, zararlı
// uzantıyı kaldırmak), ⋯ menüsü, geçmiş ve göz atma verilerini temizlemek, gizli pencere, sayfada bul.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const tarayici = {
  id: 'tarayici', icon: '🧩', title: 'Tarayıcı: uzantılar, geçmiş, gizli pencere', minutes: 40, stage: 'desktop',
  desc: 'Uzantı eklemek, geçmişi temizlemek, gizli pencere, sayfada bul (Ctrl + F).',
  summary: [
    ['🧩 → Yeni uzantılar bul', 'Uzantı mağazasını açar'],
    ['Uzantı eklemeden önce', 'Doğrulanmış yayımcı ✔, kullanıcı sayısı, puan ve izinler'],
    ['⋯ → Uzantılar', 'Uzantıları kapatma ve kaldırma'],
    ['Ctrl + H', 'Geçmiş: gezdiğiniz sayfalar'],
    ['Ctrl + Shift + Delete', 'Göz atma verilerini temizle'],
    ['Ctrl + Shift + N', 'Gizli pencere: geçmiş tutulmaz (ama görünmez olmazsınız)'],
    ['Ctrl + F', 'Sayfada bul: uzun sayfada bir kelimeyi bulur'],
  ],
  steps: [
    {
      title: 'Uzantı nedir?',
      html: `<p><b>Uzantı</b> (eklenti), tarayıcıya eklenen küçük bir programdır: reklamları gizler, sayfayı sesli okur, sayfaları koyu renkte gösterir…</p>
        <p>Ama dikkat: uzantılar gezdiğiniz sayfaları görebilir. <b>Kötü bir uzantı</b> şifrelerinizi çalabilir, tarayıcıya reklam doldurabilir.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'Uzantı mağazası',
      html: '<p>Adres çubuğunun sağındaki <b>🧩</b> düğmesine tıklayın, sonra <b>Yeni uzantılar bul</b>\'a tıklayın.</p>',
      mouse: '🖱 🧩 → Yeni uzantılar bul',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'uzantilar.bulalim.com',
      done: 'Uzantı mağazası açıldı. Sarı kutudaki üç soruyu aklınızda tutun: yayımcı doğrulanmış mı, kaç kişi kullanıyor, hangi izinleri istiyor?',
    },
    {
      title: 'Reklam engelleyici ekleyin',
      html: `<ol class="steps"><li><b>🛡 Reklam Kalkanı</b>\'na tıklayın. Yayımcının yanında <b>✔ Doğrulanmış yayımcı</b> yazdığını, 10 milyon kişinin kullandığını görün.</li><li><b>Tarayıcıya ekle</b>\'ye tıklayın, izinleri okuyun ve <b>Uzantı ekle</b> deyin.</li></ol>`,
      mouse: '🖱 Reklam Kalkanı → Tarayıcıya ekle → Uzantı ekle',
      on: (ev) => ev.type === 'ext-add' && ev.id === 'adblock',
      done: 'Adres çubuğunun yanında 🛡 simgesi çıktı.',
    },
    {
      title: 'Reklamlar nereye gitti?',
      html: '<p>Adres çubuğuna <b>resim gösterici indir</b> yazıp aratın, sonra çıkan <b>Program İndir</b> sayfasına girin. Daha önce burada büyük yanıp sönen “İNDİR” reklamları vardı.</p>',
      target: 'resim gösterici indir',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.program-indir.com.tr',
      done: 'Sahte “İNDİR” düğmeleri yok; yalnızca gerçek indirme bağlantısı kaldı. 🛡 simgesindeki kırmızı sayı, bu sayfada engellenen reklam sayısıdır.',
    },
    {
      title: 'Şüpheli uzantı',
      html: '<p>🧩 → <b>Yeni uzantılar bul</b> → <b>⚡ Süper İndirici PRO</b> sayfasını açın. Ekleme! Yalnızca bakın.</p>',
      mouse: '🖱 🧩 → Yeni uzantılar bul → Süper İndirici PRO',
      on: (ev, c) => {
        if (ev.type === 'ext-ask' && ev.fake && ev.answer === 'add') c.warn('Eklediniz! Bir sonraki adımda onu kaldırmayı öğreneceğiz.');
        return ev.type === 'web-nav' && ev.host === 'uzantilar.bulalim.com' && ev.path === '/fake';
      },
      done: 'Sayfa açıldı. İşaretlere bakalım.',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Süper İndirici PRO\'yu neden eklememeliyiz?</p>',
      opts: ['Bütün sitelerdeki verilerinizi ve kayıtlı şifrelerinizi istiyor; yayımcısı doğrulanmamış, 312 kişi kullanıyor', 'Adı çok uzun', 'İndirmeleri hızlandırdığı için'],
      ok: 0,
      wrong: 'İzinler bölümüne ve yayımcının yanındaki yazıya bakın.',
      why: 'Doğru. Bir indirme aracının şifrelerinize ihtiyacı yoktur. “10 KAT HIZLI!!! BEDAVA!!!” gibi bağıran sözler de tehlike işaretidir.',
    }),
    {
      title: 'Zararlı uzantıyı kaldırın',
      html: `<p>Diyelim ki bir yakınınız bilmeden bu uzantıyı eklemiş: tarayıcıya sarı bir reklam çubuğu gelmiş.</p>
        <ol class="steps"><li>Sağ üstteki <b>⋯</b> (Ayarlar ve diğer) menüsünü açın, <b>🧩 Uzantılar</b>\'a tıklayın.</li><li>Kırmızı çerçeveli <b>Süper İndirici PRO</b>\'nun yanındaki <b>Kaldır</b>\'a basın.</li></ol>`,
      mouse: '🖱 ⋯ → Uzantılar → Kaldır',
      setup: (c) => {
        const s = c.d.settings;
        if (s.ext.fake === undefined) { s.ext.fake = true; c.d.setSetting('toolbar', true); }
        c.d.wins.filter((w) => w.app === 'browser').forEach((w) => w.api.refresh?.());
      },
      on: (ev) => ev.type === 'ext-remove' && ev.fake,
      done: 'Uzantı ve reklam çubuğu gitti. Tarayıcınız kendiliğinden değiştiyse ⋯ → Ayarlar → <b>Ayarları varsayılanlarına sıfırla</b> da işe yarar.',
    },
    {
      title: 'Geçmiş',
      html: `<p>${K('Ctrl', 'H')}\'ye basın ya da <b>⋯ → 🕘 Geçmiş</b>. Bugün gezdiğiniz sayfaları saatleriyle görün.</p>`,
      combo: ['Ctrl', 'KeyH'],
      hint: 'Tuşlar çalışmazsa önce sayfaya bir kez tıklayın, sonra yeniden deneyin.',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'tarayici' && ev.path === '/gecmis',
      done: 'Dün bulduğunuz bir tarifi kaybettiyseniz geçmişten bulabilirsiniz. Satırın yanındaki ✕ yalnızca o sayfayı siler.',
    },
    {
      title: 'Göz atma verilerini temizleyin',
      html: `<p>Ortak kullanılan bir bilgisayarda (kütüphane, iş yeri) işiniz bitince izlerinizi silin. Kısayolu bütün tarayıcılarda aynıdır: ${K('Ctrl', 'Shift', 'Delete')}. Açılan pencerede <b>Şimdi temizle</b>.</p>`,
      combo: ['Ctrl', 'Shift', 'Delete'],
      hint: 'Kısayol çalışmazsa önce sayfaya bir kez tıklayın. Geçmiş sayfasındaki <b>🧹 Göz atma verilerini temizle</b> düğmesi de aynı pencereyi açar.',
      on: (ev) => ev.type === 'web-clear',
      done: 'Geçmiş ve çerezler silindi; sitelerdeki oturumlarınız da kapandı. İndirilen dosyalar ve sık kullanılanlar yerinde durur.',
    },
    {
      title: 'Gizli pencere',
      html: `<p><b>⋯ → 🕶 Yeni gizli pencere</b>\'yi açın. Kısayolu: Chrome ve Edge\'de ${K('Ctrl', 'Shift', 'N')}, Firefox\'ta ${K('Ctrl', 'Shift', 'P')}. Açılan mor pencerede yazanları okuyun.</p>`,
      mouse: '🖱 ⋯ → Yeni gizli pencere',
      hint: 'Tuşlar çalışmazsa önce sayfaya bir kez tıklayın ya da ⋯ menüsünü kullanın.',
      on: (ev) => ev.type === 'web-private' || (ev.type === 'app-open' && ev.app === 'browser' && ev.args?.private),
      done: 'Gizli pencerede gezdikleriniz geçmişe yazılmaz. Başkasının bilgisayarında e-postanıza bakarken işe yarar.',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Gizli pencerede gezdiğiniz siteleri kim yine de görebilir?</p>',
      opts: ['Hiç kimse göremez', 'Yalnızca bilgisayarı sonra kullanan kişi', 'İnternet sağlayıcınız ve bağlandığınız ağın sahibi (iş yeri, kafe)'],
      ok: 2,
      wrong: 'Gizli pencere yalnızca bu bilgisayarda iz bırakmaz. Bilgiler yine internetten geçer.',
      why: 'Doğru. Gizli pencere sizi internette görünmez yapmaz; yalnızca bu bilgisayarda geçmiş ve çerez bırakmaz.',
    }),
    {
      title: 'Sayfada bul',
      html: `<p>Gizli pencereyi kapatın. Ana pencerede <b>www.lezzetli-tarifler.com.tr/borek</b> adresine gidin. Uzun tarifte <b>fırın</b> kelimesini aramak için ${K('Ctrl', 'F')}\'ye basın (ya da <b>⋯ → Sayfada bul</b>) ve <b>fırın</b> yazın.</p>`,
      combo: ['Ctrl', 'KeyF'],
      hint: 'Bulunan yerler sarıyla boyanır; Enter sonrakine geçer, Esc kutuyu kapatır. Ctrl + F çalışmazsa önce sayfaya bir kez tıklayın.',
      on: (ev) => ev.type === 'web-find' && /fır/i.test(ev.q) && ev.count > 0,
      done: 'Uzun bir sayfayı baştan sona okumadan aradığınız kelimeye gittiniz. Ctrl + F Kelime İşlemci\'de ve PDF\'lerde de çalışır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarayıcıyı ustaca kullanmak:</p>' },
  ],
};
