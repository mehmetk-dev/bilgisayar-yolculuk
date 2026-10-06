// 8. hafta: internette gezinme ve indirme, program kurma, yazıcı ve sürücüler, işletim sistemi kurulumu (gösterim)
import { K, desktopReady, maxed } from './common.js';

const brOpen = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const internet = {
  id: 'internet', icon: '🌐', title: 'İnternette gezinme ve indirme', minutes: 25, stage: 'desktop',
  desc: 'Adres çubuğu ile arama farkı, sonuçlar, geri dönme, sekmeler, reklam tuzakları ve dosya indirme.',
  summary: [
    ['Adres çubuğu', 'Adresi biliyorsanız yazın (www…); bilmiyorsanız aradığınızı kelimelerle yazın'],
    ['←', 'Bir önceki sayfaya dön'],
    ['＋', 'Yeni sekme'],
    ['Sekmedeki ✕', 'Sekmeyi kapat'],
    ['“Reklam” yazan sonuçlar', 'Genellikle tıklanmaz'],
    ['Büyük yeşil “İNDİR” düğmeleri', 'Çoğunlukla reklamdır; programın adının yazdığı sade bağlantıyı kullanın'],
    ['İndirilenler klasörü', 'İndirdiğiniz her şey buraya gelir'],
  ],
  steps: [
    {
      title: 'İnternet tarayıcısı',
      html: `<p>İnternete girmek için kullanılan programa <b>tarayıcı</b> denir (Edge, Chrome…).</p><ul class="big-list"><li><b>Adres çubuğu</b>: en üstteki uzun kutu.</li><li><b>Sekmeler</b>: aynı anda birkaç sayfa açmanızı sağlar.</li><li><b>←</b>: bir önceki sayfaya döner.</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'İnternet\'i açın',
      html: '<p>Masaüstündeki <b>🌐 İnternet</b> simgesine çift tıklayın (ya da görev çubuğundaki 🌐).</p>',
      check: (c) => !!c.d.find('browser'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'browser',
    },
    {
      title: 'Arama yapın',
      html: `<p>Adres çubuğuna tıklayın, <b>börek tarifi</b> yazıp ${K('Enter')}'a basın.</p><p class="mut">Adresi bilmediğiniz şeyleri kelimelerle yazın; tarayıcı sizin için arar.</p>`,
      setup: (c) => brOpen(c),
      on: (ev) => ev.type === 'web-search' && /b[öo]rek/i.test(ev.q),
      done: 'Arama sonuçları çıktı. Dikkat: en üstte <b>Reklam</b> yazanlar reklamdır.',
    },
    {
      title: 'Sonuca tıklayın',
      html: '<p>Mavi başlıklardan <b>Ispanaklı Börek Tarifi</b>\'ne tıklayın.</p>',
      setup: (c) => brOpen(c),
      on: (ev) => ev.type === 'web-nav' && ev.path === '/borek',
    },
    {
      title: 'Sayfayı kaydırın',
      html: '<p>Fare tekerleğiyle sayfanın en altına inin.</p>',
      mouse: '🖱 Tekerlek',
      setup: (c) => { if (!/borek/.test(c.d.find('browser')?.api.url || '')) brOpen(c, 'www.lezzetli-tarifler.com.tr/borek'); },
      on: (ev) => ev.type === 'web-scroll' && ev.atBottom,
    },
    {
      title: 'Geri dönün',
      html: '<p>Sol üstteki <b>←</b> okuna tıklayın: arama sonuçlarına dönersiniz.</p>',
      setup: (c) => brOpen(c),
      on: (ev) => ev.type === 'web-back',
    },
    {
      title: 'Yeni sekme açın',
      html: '<p>Sekmelerin yanındaki <b>＋</b>\'ya tıklayın.</p>',
      setup: (c) => brOpen(c),
      on: (ev) => ev.type === 'web-tab-new',
      done: 'Yeni bir sekme açıldı; ötekisi kapanmadı, üstte duruyor.',
    },
    {
      title: 'Adres yazın',
      html: `<p>Adres çubuğuna <b>www.hava-durumu.com.tr</b> yazıp ${K('Enter')}'a basın.</p>`,
      target: 'www.hava-durumu.com.tr',
      setup: (c) => brOpen(c),
      on: (ev, c) => {
        if (ev.type === 'web-nav' && ev.error) c.warn('Bu adres bulunamadı: harflerden biri yanlış yazılmış olabilir. Adres çubuğuna tıklayıp düzeltin.');
        return ev.type === 'web-nav' && ev.host === 'www.hava-durumu.com.tr' && ev.via === 'address';
      },
      done: 'Adresi tam bildiğiniz sitelere böyle doğrudan gidebilirsiniz. Soldaki 🔒 kilit, bağlantının güvenli olduğunu gösterir.',
    },
    {
      title: 'Sekmeyi kapatın',
      html: '<p>Hava durumu sekmesinin üzerindeki küçük <b>✕</b>\'e tıklayın.</p>',
      setup: (c) => brOpen(c),
      on: (ev) => ev.type === 'web-tab-close',
    },
    {
      title: 'İndirme ve reklam tuzakları',
      html: `<p>İnternetten program indirirken en büyük tuzak <b>sahte indirme düğmeleri</b>dir: büyük, renkli, yanıp sönen “İNDİR” yazıları çoğu zaman reklamdır.</p>
        <p>Gerçek bağlantı genellikle <b>programın adının</b> yazdığı sade bağlantıdır. En güvenlisi programı <b>kendi resmî sitesinden</b> indirmektir.</p>`,
    },
    {
      title: 'Program indirin',
      html: `<ol class="steps"><li>Adres çubuğuna <b>resim gösterici indir</b> yazıp aratın.</li><li>“Resim Gösterici: Ücretsiz İndir” sonucuna tıklayın.</li><li>Sayfadaki reklamlara değil, <b>Resim Gösterici'yi indir (12 MB)</b> bağlantısına tıklayın.</li></ol>`,
      setup: (c) => brOpen(c),
      on: (ev, c) => {
        if (ev.type === 'web-ad') c.warn('Bu bir <b>reklamdı</b>! Programın adının yazdığı sade bağlantıyı bulun.');
        return ev.type === 'download';
      },
      done: 'Dosya indirildi. Tarayıcının sağ üstünde indirmeler kutusu açıldı.',
    },
    {
      title: 'İndirilenler klasörü',
      html: '<p>İndirdiğiniz her şey <b>İndirilenler</b> klasörüne gider. İndirme kutusundaki <b>Klasörde göster</b>\'e tıklayın.</p><p class="mut">Kutu kapandıysa tarayıcının sağ üstündeki ⬇ simgesine tıklayın.</p>',
      on: (ev) => ev.type === 'download-folder' || (ev.type === 'nav' && ev.folder === 'downloads') || (ev.type === 'app-open' && ev.app === 'explorer' && ev.args?.folder === 'downloads'),
      done: 'İndirdiğiniz dosya burada: <b>ResimGosterici_Kurulum.exe</b>. Kurulumunu sonraki derste yapacağız.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternette gezinmeyi ve güvenle indirmeyi öğrendiniz.</p>' },
  ],
};

const exeReady = (c) => { if (!c.d.fs.find('downloads', 'ResimGosterici_Kurulum.exe')) c.d.fs.write('downloads', 'ResimGosterici_Kurulum.exe', { setup: 'viewer' }); };

export const kurulum = {
  id: 'kurulum', icon: '💿', title: 'Program kurma ve kaldırma', minutes: 20, stage: 'desktop',
  desc: 'İndirilen programı kurmak: izin penceresi, lisans, ek yazılım tuzakları; kaldırmak.',
  setup: exeReady,
  summary: [
    ['.exe dosyası', 'Kurulum dosyası: çift tıklayınca kurulum başlar'],
    ['“Değişiklik yapılsın mı?”', 'Programı siz indirdiyseniz Evet; tanımıyorsanız Hayır'],
    ['Lisans', 'Kabul etmeden kurulum ilerlemez'],
    ['“Önerilen” ek yazılımlar', 'İşaretlerini kaldırın!'],
    ['Ayarlar → Uygulamalar → Kaldır', 'Programı bilgisayardan siler'],
  ],
  steps: [
    {
      title: 'Program kurmak',
      html: `<p>İnternetten indirdiğimiz programlar önce bilgisayara <b>kurulur</b> (yüklenir). Kurulum dosyalarının adı çoğunlukla <b>…Kurulum.exe</b> ya da <b>…Setup.exe</b> diye biter.</p>
        <div class="box">⚠ Yalnızca güvendiğiniz yerden indirdiğiniz programları kurun.</div>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); exeReady(c); },
    },
    {
      title: 'İndirilenler klasörünü açın',
      html: '<p>📁 Dosya Gezgini\'ni açın ve soldan <b>⬇ İndirilenler</b>\'e gidin.</p>',
      check: (c) => c.d.find('explorer')?.api.folder === 'downloads',
      on: (ev) => ev.type === 'nav' && ev.folder === 'downloads',
    },
    {
      title: 'Kurulum dosyasını açın',
      html: '<p><b>ResimGosterici_Kurulum</b> dosyasına <b>çift tıklayın</b>.</p>',
      setup: (c) => { const w = c.d.ensure('explorer'); if (w.api.folder !== 'downloads') w.api.go('downloads'); },
      on: (ev) => ev.type === 'exe-open',
    },
    {
      title: 'İzin penceresi',
      html: '<p>Ekran karardı ve “<b>Bu uygulamanın cihazınızda değişiklik yapmasına izin vermek istiyor musunuz?</b>” diye soruluyor.</p><p>Programı siz bilerek indirdiyseniz <b>Evet</b>\'e tıklayın.</p>',
      on: (ev, c) => {
        if (ev.type === 'uac' && ev.answer === 'no') c.note('Hayır dediniz; kurulum başlamadı. Dosyaya yeniden çift tıklayın ve bu sefer Evet deyin.');
        return ev.type === 'uac' && ev.answer === 'yes';
      },
      done: 'Bu soru, haberiniz olmadan program kurulmasın diye sorulur. Tanımadığınız bir program için çıkarsa <b>Hayır</b> deyin.',
    },
    {
      title: 'Hoş geldiniz',
      html: '<p>Kurulum sihirbazı açıldı. <b>İleri ></b>\'ye tıklayın.</p>',
      on: (ev) => ev.type === 'setup-page' && ev.page === 'license',
    },
    {
      title: 'Lisans sözleşmesi',
      html: '<p><b>Sözleşmeyi kabul ediyorum</b> seçeneğine tıklayın, sonra <b>İleri ></b>.</p><p class="mut">Kabul etmeden İleri düğmesi çalışmaz.</p>',
      on: (ev) => ev.type === 'setup-page' && ev.page === 'folder',
    },
    {
      title: 'Kurulum yeri',
      html: '<p>Programın kurulacağı yeri değiştirmeye gerek yok. <b>İleri ></b>.</p>',
      on: (ev) => ev.type === 'setup-page' && ev.page === 'extras',
    },
    {
      title: '⚠ Dikkat: ek yazılımlar',
      html: '<p>Burası tuzak! “Önerilen” diye <b>istemediğiniz programlar</b> da kurulmak isteniyor. <b>İki kutucuğun da işaretini kaldırın</b>, sonra İleri.</p>',
      on: (ev, c) => {
        if (ev.type === 'setup-extra') c.s.clean = !ev.all;
        if (ev.type === 'setup-page' && ev.page === 'ready') {
          if (c.s.clean) return true;
          c.warn('Kutucuklar hâlâ işaretli! <b>< Geri</b> ile dönüp iki işareti de kaldırın.');
        }
        return false;
      },
      done: 'Çok iyi! Böylece istenmeyen araç çubukları ve reklam programları kurulmadı.',
    },
    {
      title: 'Kur',
      html: '<p><b>Kur</b>\'a tıklayın ve kurulumun bitmesini bekleyin.</p>',
      on: (ev) => ev.type === 'setup-page' && ev.page === 'done',
    },
    {
      title: 'Son',
      html: '<p><b>Son</b>\'a tıklayın. Program açılacak; masaüstüne de kısayolu eklendi.</p>',
      on: (ev) => ev.type === 'setup-done',
    },
    {
      title: 'Programı kullanın',
      html: '<p>Resim Gösterici açıldı. Bir fotoğrafa tıklayıp açın.</p>',
      setup: (c) => { if (c.d.settings.installed.includes('viewer')) c.d.ensure('viewer'); },
      on: (ev) => ev.type === 'photo-open',
    },
    {
      title: 'Programı kaldırın',
      html: '<p>Artık istemiyorsak programı kaldırabiliriz: ⊞ Başlat → ⚙ <b>Ayarlar</b> → <b>🧩 Uygulamalar</b> → Resim Gösterici\'nin yanındaki <b>Kaldır</b>.</p>',
      on: (ev) => ev.type === 'uninstall',
      done: 'Program ve masaüstü kısayolu silindi. Kullanmadığınız programları kaldırmak bilgisayarı rahatlatır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Program kurmayı ve kaldırmayı öğrendiniz.</p>' },
  ],
};

export const yazici = {
  id: 'yazici', icon: '🖨', title: 'Yazıcı ve sürücüler', minutes: 20, stage: 'desktop',
  desc: 'Yazıcı ekleme, test sayfası, Not Defteri\'nden yazdırma, Aygıt Yöneticisi ile sürücü güncelleme.',
  summary: [
    ['Sürücü (driver)', 'Bir parçanın bilgisayarla anlaşmasını sağlayan küçük program'],
    ['Ayarlar → Bluetooth ve cihazlar → Yazıcılar', 'Cihaz ekle'],
    ['Ctrl + P', 'Yazdır'],
    ['⊞ Başlat\'a sağ tık → Aygıt Yöneticisi', 'Sarı ünlemli aygıt = sürücüsü eksik'],
    ['Sağ tık → Sürücüyü güncelleştir', 'Otomatik ara'],
  ],
  steps: [
    {
      title: 'Sürücü nedir?',
      html: `<p>Yazıcı, kamera, ses kartı gibi parçaların bilgisayarla “konuşabilmesi” için <b>sürücü</b> (driver) denen küçük bir program gerekir. Bir <b>tercüman</b> gibi düşünün.</p>
        <p>Windows çoğu sürücüyü kendisi bulur. Bulamazsa üreticinin sitesinden indirilir.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Yazıcılar sayfasını açın',
      html: '<p>⊞ Başlat → ⚙ <b>Ayarlar</b> → soldan <b>🖨 Bluetooth ve cihazlar</b>.</p>',
      on: (ev) => ev.type === 'settings-page' && ev.page === 'devices',
    },
    {
      title: 'Cihaz ekleyin',
      html: '<p><b>＋ Cihaz ekle</b>\'ye tıklayın. Windows yakındaki yazıcıları arayacak.</p>',
      setup: (c) => { const w = c.d.ensure('settings'); w.api.go('devices'); },
      on: (ev) => ev.type === 'printer-found',
      done: 'Bir yazıcı bulundu.',
    },
    {
      title: 'Yazıcıyı ekleyin',
      html: '<p>Bulunan yazıcının yanındaki <b>Cihaz ekle</b>\'ye tıklayın. Sürücüsü kendiliğinden yüklenecek.</p>',
      check: (c) => c.d.settings.printers.length > 1,
      on: (ev) => ev.type === 'printer-add',
      done: 'Yazıcı hazır.',
    },
    {
      title: 'Test sayfası',
      html: '<p>Yazıcının yanındaki <b>Test sayfası yazdır</b>\'a tıklayın.</p>',
      setup: (c) => { if (c.d.settings.printers.length < 2) c.d.settings.printers.push('Renkli Yazıcı R-200 (Ağ)'); const w = c.d.ensure('settings'); w.api.go('devices'); },
      on: (ev) => ev.type === 'print' && /R-200/.test(ev.printer),
    },
    {
      title: 'Not Defteri\'nden yazdırın',
      html: `<ol class="steps"><li>Not Defteri\'ni açın ve bir şey yazın.</li><li>${K('Ctrl', 'P')}'ye basın (ya da Dosya → Yazdır).</li><li>Yazıcı olarak <b>Renkli Yazıcı R-200</b>\'ü seçin.</li><li><b>🖨 Yazdır</b>\'a tıklayın.</li></ol>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev, c) => {
        if (ev.type === 'print' && ev.app === 'notepad' && !/R-200/.test(ev.printer)) c.note('“PDF olarak kaydet” seçiliydi: kâğıda değil dosyaya yazdırır. Yazıcı listesinden R-200\'ü seçin.');
        return ev.type === 'print' && ev.app === 'notepad' && /R-200/.test(ev.printer);
      },
      done: 'Belge yazıcıya gönderildi.',
    },
    {
      title: 'Aygıt Yöneticisi',
      html: '<p>Bir parça çalışmıyorsa sürücüsüne <b>Aygıt Yöneticisi</b>\'nden bakılır: ⊞ <b>Başlat düğmesine sağ tıklayın</b> → <b>Aygıt Yöneticisi</b>.</p>',
      mouse: '🖱 Başlat\'a sağ tık',
      setup: (c) => c.d.closeAll(),
      check: (c) => !!c.d.find('devmgr'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'devmgr',
    },
    {
      title: 'Sürücüsü eksik aygıt',
      html: '<p>Listede <b>⚠ Bilinmeyen aygıt</b> var: sarı ünlem, sürücüsünün eksik olduğunu gösterir. Üzerine <b>sağ tıklayın</b> → <b>Sürücüyü güncelleştir</b> → <b>Sürücüleri otomatik olarak ara</b>.</p>',
      setup: (c) => c.d.ensure('devmgr'),
      on: (ev) => ev.type === 'driver-update',
      done: 'Sürücü yüklendi; sarı ünlem kayboldu ve aygıt “Yüksek Tanımlı Ses Aygıtı” olarak göründü.',
    },
    {
      title: 'Sürücüyü başka nereden bulurum?',
      html: `<ul class="big-list"><li><b>Ayarlar → Windows Update</b>: “İsteğe bağlı güncelleştirmeler”de sürücüler çıkar.</li><li><b>Üreticinin resmî sitesi</b>: yazıcının markası ve modeliyle aratın (ör. “R-200 sürücü”).</li><li>“Sürücü güncelleyici” diye reklamı yapılan programlardan uzak durun.</li></ul>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Yazıcı eklemeyi ve sürücü sorunlarını çözmeyi öğrendiniz.</p>' },
  ],
};

const osWait = (screen) => (ev) => ev.type === 'os-screen' && ev.screen === screen;

export const oskurulum = {
  id: 'oskurulum', icon: '🪟', title: 'İşletim sistemi kurulumu (gösterim)', minutes: 20, stage: 'desktop',
  desc: 'Windows\'un sıfırdan kurulumunu adım adım izleyin: dil, ürün anahtarı, disk, ilk ayarlar.',
  summary: [
    ['Önce yedek!', 'Kurulum, seçilen diskteki her şeyi silebilir'],
    ['Kurulum USB\'si', 'Windows\'un resmî aracıyla hazırlanır'],
    ['Açılışta F12 / F11 / Esc', 'USB\'den başlatma menüsü (markaya göre değişir)'],
    ['“Ürün anahtarım yok”', 'Daha önce etkinleştirilmiş bilgisayarda internete bağlanınca kendiliğinden etkinleşir'],
    ['Özel: Yalnızca Windows\'u yükle', 'Temiz kurulum'],
    ['PIN', 'Kolay hatırlanan ama tahmin edilemeyen bir sayı'],
  ],
  steps: [
    {
      title: 'İşletim sistemi nedir?',
      html: `<p>Bilgisayarı çalıştıran ana yazılıma <b>işletim sistemi</b> denir: Windows gibi. Bilgisayar çok yavaşladığında ya da bozulduğunda <b>yeniden kurulabilir</b>.</p>
        <div class="box">⚠ Kurulum, diskteki fotoğrafları ve belgeleri <b>silebilir</b>. Önce mutlaka bir USB belleğe ya da buluta <b>yedek</b> alınır.</div>
        <p>Gerekenler: Windows kurulum USB'si ve açılışta USB'den başlatmak (çoğunlukla <kbd>F12</kbd>, <kbd>F11</kbd> ya da <kbd>Esc</kbd> tuşu).</p><p>Bu bir <b>gösterimdir</b>: gerçek bilgisayarınıza dokunmaz.</p>`,
      setup: desktopReady,
    },
    {
      title: 'Kurulumu başlatın',
      html: '<p>Bilgisayar kurulum USB\'siyle açılıyor. Başlatmak için aşağıdaki düğmeye basın, sonra ekrana tıklayın.</p><button type="button" class="btn primary os-start">▶ Kurulum USB\'siyle başlat</button>',
      setup: (c) => { document.querySelector('.os-start').onclick = () => c.d.osInstall(); },
      on: osWait('lang'),
    },
    { title: 'Dil ve klavye', html: '<p>Dil <b>Türkçe</b>, klavye <b>Türkçe Q</b> seçili. <b>İleri</b>\'ye tıklayın.</p>', on: osWait('install') },
    { title: 'Şimdi yükle', html: '<p>Ortadaki <b>Şimdi yükle</b> düğmesine tıklayın.</p><p class="mut">“Bilgisayarınızı onarın”, bozuk bir Windows\'u onarmak içindir.</p>', on: osWait('key') },
    {
      title: 'Ürün anahtarı',
      html: '<p>Ürün anahtarı, Windows\'u satın alınca verilen 25 karakterlik koddur. Bu bilgisayar daha önce etkinleştirildiyse gerekmez: <b>Ürün anahtarım yok</b>\'a tıklayın.</p>',
      on: (ev, c) => { if (ev.type === 'os-wrong' && ev.what === 'key') c.note('Anahtar yazmadan İleri olmuyor. “Ürün anahtarım yok” bağlantısına tıklayın.'); return osWait('edition')(ev); },
    },
    { title: 'Sürüm', html: '<p>Ev bilgisayarları için <b>Windows 11 Home</b>\'u seçip <b>İleri</b>.</p>', on: osWait('license') },
    { title: 'Lisans', html: '<p><b>Kabul ediyorum</b> kutusunu işaretleyip <b>İleri</b>.</p>', on: osWait('type') },
    {
      title: 'Yükleme türü',
      html: '<p>Temiz kurulum için <b>Özel: Yalnızca Windows\'u yükleyin</b>\'i seçin.</p>',
      on: (ev, c) => { if (ev.type === 'os-wrong' && ev.what === 'upgrade') c.note('Yükseltme, bilgisayarda zaten Windows varken çalışır. “Özel”i seçin.'); return osWait('disk')(ev); },
    },
    { title: 'Disk seçimi', html: '<p>Diski (Sürücü 0) seçip <b>İleri</b>. Uyarıyı okuyun: biçimlendirme her şeyi siler.</p>', on: osWait('copy') },
    { title: 'Dosyalar kopyalanıyor', html: '<p>Şimdi beklemek gerekiyor. Gerçekte bu 15–30 dakika sürer ve bilgisayar birkaç kez yeniden başlar. <b>Kapatmayın!</b></p>', on: osWait('region') },
    { title: 'Bölge ve klavye', html: '<p><b>Türkiye</b> → Evet, <b>Türkçe Q</b> → Evet. İkinci klavye düzenine <b>Atla</b>.</p>', on: osWait('network') },
    {
      title: 'İnternete bağlanın',
      html: '<p><b>EvAğı</b>\'na tıklayın, şifre: <b>evagi2024</b> → Bağlan → İleri.</p>',
      on: osWait('name'),
    },
    { title: 'Adınız', html: '<p>Bilgisayarı kullanacak kişinin adını yazın (ör. kendi adınız) → İleri.</p>', on: osWait('pin') },
    { title: 'PIN', html: '<p>En az 4 rakamlık bir <b>PIN</b> belirleyin ve iki kez yazın. Doğum yılınız ya da 1234 olmasın!</p><p class="mut">Bu PIN alıştırma bilgisayarının şifresi olacak; unutmayın.</p>', on: osWait('privacy') },
    { title: 'Gizlilik', html: '<p>Ayarları okuyun; istemediklerinizi kapatabilirsiniz. <b>Kabul et</b>.</p>', on: (ev) => ev.type === 'os-done' },
    { final: true, title: 'Kurulum bitti! 🎉', html: '<p>Windows kuruldu ve masaüstü açıldı. Gerçek kurulumda bundan sonra: Windows Update ile güncelleme, sürücüler ve programlar kurulur, yedekler geri yüklenir.</p>' },
  ],
};
