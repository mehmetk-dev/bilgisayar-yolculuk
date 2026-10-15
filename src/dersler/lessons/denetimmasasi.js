// 7. hafta ek dersi: Denetim Masası. Eski ayar paneli: açmak, kategori ve simge görünümü, aramak, Programlar ve Özellikler (program kaldırmak),
// Sistem (RAM, işlemci), Güç Seçenekleri, Ayarlar'a yönlenen öğeler.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const cp = (c) => c.d.find('denetim');
const cpOpened = (item) => (ev) => ev.type === 'cp-open' && ev.item === item;

export const denetimMasasi = {
  id: 'denetim-masasi', icon: '🎛', title: 'Denetim Masası', minutes: 35, stage: 'desktop',
  desc: 'Windows\'un eski ayar paneli: açmak, program kaldırmak, bilgisayara bakmak.',
  summary: [
    ['Nasıl açılır?', 'Başlat → “Denetim Masası” yazın; Windows 7\'de Başlat menüsünde hazırdır; ⊞ + R, control'],
    ['Kategori / Büyük simgeler', 'Sağ üstteki “Görüntüleme ölçütü”; simge görünümü daha hızlıdır'],
    ['Arama kutusu', 'Sağ üstte: “fare”, “yazıcı”, “saat” yazın; ilgili öğe çıkar'],
    ['Programlar ve Özellikler', 'Yüklü programlar; birini seçip Kaldır'],
    ['Sistem', 'İşlemci, bellek (RAM), Windows sürümü ve bilgisayar adı'],
    ['Güç Seçenekleri', 'Ekran ve uyku süresi; güç planı'],
    ['Ayarlar mı, Denetim Masası mı?', 'Yeni Windows\'ta çoğu ayar Ayarlar\'a taşındı; Denetim Masası\'ndaki bazı öğeler sizi oraya götürür'],
  ],
  desktop: { settings: { installed: ['viewer', 'hava'] } },
  steps: [
    {
      title: 'Denetim Masası nedir?',
      html: `<p><b>Denetim Masası</b>, Windows'un yıllardır kullanılan <b>ayar panelidir</b>: program kaldırma, yazıcı, ses, saat, güç, hesaplar… hepsi oradaydı. Windows 10 ve 11'de ayarların çoğu yeni <b>⚙ Ayarlar</b> uygulamasına taşındı, ama Denetim Masası hâlâ yerinde ve bilgisayar çevresinde herkes ondan söz eder.</p>
        <p>Windows 7'de Başlat menüsünde hazır dururdu. Yeni sürümlerde saklanmıştır: <b>Başlat'a “Denetim Masası” yazarak</b> bulunur.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Denetim Masası\'nı açın',
      html: '<p>⊞ <b>Başlat</b>\'a tıklayın, arama kutusuna <b>denetim</b> yazın ve çıkan <b>🎛 Denetim Masası</b>\'na tıklayın (ya da Enter\'a basın).</p>',
      mouse: '🖱 Başlat → denetim yazın',
      hint: 'Arama kutusu Başlat menüsünün en üstünde. Birkaç harf yazmanız yeter.',
      check: (c) => !!cp(c),
      on: (ev) => ev.type === 'app-open' && ev.app === 'denetim',
      done: 'Denetim Masası açıldı. Sekiz kategori var: Sistem ve Güvenlik, Ağ ve İnternet, Donanım ve Ses…',
    },
    {
      title: 'Büyük simgeler',
      html: '<p>Kategori görünümünde aradığınızı bulmak zor olabilir. Sağ üstte <b>Görüntüleme ölçütü</b> yazan yerden <b>Büyük simgeler</b>\'i seçin.</p>',
      setup: (c) => maxed(c, 'denetim'),
      on: (ev) => ev.type === 'cp-view' && ev.mode === 'big',
      done: 'Bütün öğeler alfabetik sırayla ve tek ekranda. Ne aradığınızı biliyorsanız bu görünüm daha hızlıdır.',
    },
    {
      title: 'Arama kutusu',
      html: '<p>Sağ üstteki <b>Denetim Masası\'nda ara</b> kutusuna <b>fare</b> yazıp Enter\'a basın. İlgili öğeler listelenir.</p>',
      hint: 'Arama kutusu pencerenin sağ üstünde. Yazıp Enter\'a basın.',
      on: (ev) => ev.type === 'cp-search' && /fare|mouse/i.test(ev.q),
      done: 'Fareyle ilgili öğe bulundu. Öğenin adını bilmiyorsanız yapmak istediğiniz şeyi yazın: “saat”, “yazıcı”, “ses”.',
    },
    {
      title: 'Fare\'yi açın',
      html: '<p>Sonuçlardan <b>Fare</b>\'ye tıklayın. Ne oluyor, dikkat edin.</p>',
      on: cpOpened('mouse'),
      done: 'Fare ayarları <b>⚙ Ayarlar</b>\'da açıldı. İşte Windows\'un yeni halinde olan bu: Denetim Masası\'ndaki birçok öğe tıklayınca Ayarlar\'a gider. İkisi birbirini tamamlar.',
    },
    {
      title: 'Programlar ve Özellikler',
      html: '<p>Denetim Masası\'na dönün. Bu panelin en işe yarar öğelerinden biri: <b>Programlar ve Özellikler</b>. Büyük simgelerden ya da <b>Programlar</b> kategorisinden açın.</p>',
      hint: 'Pencere arkada kaldıysa görev çubuğundan 🎛\'ye tıklayın. Öğe “P” harfi bölümünde.',
      setup: (c) => maxed(c, 'denetim'),
      on: cpOpened('programs'),
      done: 'Bilgisayarda yüklü programların listesi: adı, yayımcısı, yüklenme tarihi ve boyutu.',
    },
    {
      title: 'Bir program seçin',
      html: '<p>İhtiyacınız olmayan <b>Hava Durumu</b> programını kaldıracağız. Önce listeden <b>Hava Durumu</b> satırına <b>tıklayarak seçin</b>.</p>',
      on: (ev) => ev.type === 'cp-select' && /Hava Durumu/.test(ev.name),
      done: 'Satır mavi oldu. Üstteki <b>Kaldır</b> düğmesi artık etkin.',
    },
    {
      title: 'Kaldırın',
      html: '<p>Üstteki <b>🗑 Kaldır</b>\'a tıklayın. “Emin misiniz?” sorusuna <b>Evet</b> deyin.</p>',
      mouse: '🖱 Kaldır → Evet',
      on: (ev) => ev.type === 'uninstall' && ev.via === 'cp' && ev.app === 'hava',
      done: 'Hava Durumu kaldırıldı ve listeden silindi. Programı yalnızca <b>ne işe yaradığını bildiğiniz</b> ve artık kullanmadığınız zaman kaldırın. Windows\'un kendi parçalarına dokunmayın.',
    },
    {
      title: 'Sistem bilgileri',
      html: '<p>Şimdi <b>Sistem</b> öğesini açın (Sistem ve Güvenlik kategorisinde). Bilgisayarınızın <b>işlemcisi</b>, <b>belleği (RAM)</b> ve <b>Windows sürümü</b> yazar.</p>',
      setup: (c) => maxed(c, 'denetim'),
      on: cpOpened('system'),
    },
    rehberSoru({
      title: 'Kaç GB RAM?',
      html: '<p>Sistem sayfasına bakın: bu bilgisayarın <b>yüklü belleği (RAM)</b> kaç GB?</p>',
      opts: ['4 GB', '8 GB', '16 GB'], ok: 1,
      wrong: '“Yüklü bellek (RAM)” satırına tekrar bakın.',
      why: 'Doğru: 8 GB. Bir program ya da oyun alırken “en az 8 GB RAM” yazıyorsa sizin bilgisayarınız tam sınırda demektir. RAM, bilgisayarın aynı anda çalışırken kullandığı kısa süreli hafızadır.',
    }),
    {
      title: 'Güç Seçenekleri',
      html: '<p><b>Güç Seçenekleri</b>\'ni açın (Sistem ve Güvenlik ya da Donanım ve Ses kategorisinde). <b>Ekranı kapat</b> süresini <b>5 dakika</b> yapıp <b>Değişiklikleri kaydet</b>\'e basın.</p>',
      hint: 'Ekranı kapat kutusundan “5 dakika”yı seçin, sonra alttaki Kaydet düğmesi.',
      setup: (c) => maxed(c, 'denetim'),
      on: (ev) => ev.type === 'cp-power' && ev.screenOff === 5,
      done: 'Bilgisayar 5 dakika kullanılmazsa ekran kendiliğinden kararır. Uzun uyku süresi elektrik harcar; kısa tutmak hem enerjiyi hem ekranı korur.',
    },
    {
      title: 'Tarih ve Saat',
      html: '<p>Son olarak <b>Tarih ve Saat</b> öğesini açın (Saat ve Bölge kategorisinde) ve <b>Tarih ve saati değiştir…</b> düğmesine tıklayın. Nereye gidiyor?</p>',
      setup: (c) => maxed(c, 'denetim'),
      on: cpOpened('datetime-change'),
      done: 'Yine <b>Ayarlar → Saat ve dil</b> sayfasına. Çoğu eski öğe şimdi buraya çıkıyor.',
    },
    rehberSoru({
      title: 'Hangisi hangisi?',
      html: '<p>Eski bir <b>Windows 7</b> bilgisayarda yazıcı eklemek istiyorsunuz. Ayarlar uygulaması yok. Nereye bakarsınız?</p>',
      opts: ['Denetim Masası → Aygıtlar ve Yazıcılar', 'Hesap Makinesi', 'Paint'], ok: 0,
      wrong: 'Windows 7\'de bütün ayarlar tek bir yerdeydi. Neydi o?',
      why: 'Doğru. Windows 7\'de yazıcı, ses, program kaldırma gibi her ayar Denetim Masası\'ndadır. Yeni Windows\'ta aynı iş için Ayarlar → Bluetooth ve cihazlar da kullanılır.',
    }),
    rehberSoru({
      title: 'Program silerken',
      html: '<p>Komşunuz “bilgisayar yavaşladı” diyerek <b>listedeki bütün programları</b> kaldırmak istiyor. Ona ne dersiniz?</p>',
      opts: ['Evet, ne kadar az program o kadar iyi', 'Yalnızca bilmediği ya da kullanmadığı programları kaldırsın; Windows ve sürücü bileşenlerine dokunmasın', 'Programlar zaten yavaşlatmaz'], ok: 1,
      wrong: 'Bazı programlar bilgisayarın çalışması için gereklidir.',
      why: 'Doğru. Gereksiz programları kaldırmak iyidir; ama Windows\'un kendi bileşenlerini ve sürücüleri (ses, ekran) kaldırırsanız bilgisayar bozulabilir. Emin değilseniz kaldırmayın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Denetim Masası\'nı kullanabiliyorsunuz:</p>' },
  ],
};
