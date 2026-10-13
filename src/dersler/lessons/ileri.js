// 14. hafta: daha ileri. Görev Yöneticisi (donan programı kapatmak, başlangıç uygulamaları), kişiselleştirme (temalar,
// vurgu rengi, görev çubuğu), tarayıcının ayrıntıları (uzantılar, geçmiş, sayfada bul, InPrivate) ve kelime işlemcide
// ileri özellikler (stiller, vurgu, yazım denetimi, bul-değiştir, üst bilgi, sayfa numarası).
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

// ------------------------------------------------------------------ Görev Yöneticisi
const tm = (c) => c.d.find('taskmgr');
const hungWord = (c) => {
  const w = c.d.find('word') || c.d.open('word');
  if (!w.hung) c.d.hang(w);
  return w;
};

export const gorevYoneticisi = {
  id: 'gorev-yoneticisi', icon: '📊', title: 'Görev Yöneticisi: donan programı kapatmak', minutes: 35, stage: 'desktop',
  desc: 'Yanıt vermeyen programı Görev Yöneticisi ile kapatmak; hangi programın bilgisayarı yorduğunu görmek; açılışı yavaşlatan programları kapatmak.',
  summary: [
    ['Ctrl + Shift + Esc', 'Görev Yöneticisi\'ni doğrudan açar'],
    ['Görev çubuğuna sağ tık', 'Görev Yöneticisi'],
    ['⊞ Başlat\'a sağ tık', 'Görev Yöneticisi (⊞ + X menüsü)'],
    ['Ctrl + Alt + Delete', 'Güvenlik ekranı → Görev Yöneticisi'],
    ['İşlemler → Görevi sonlandır', 'Donan programı kapatır (kaydedilmemiş bilgiler gider)'],
    ['Performans', 'İşlemci, bellek, disk ve ağ grafikleri'],
    ['Başlangıç uygulamaları', 'Açılışta kendiliğinden başlayanları kapatmak'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Bazen bir program <b>donar</b>: tıklarsınız, yazarsınız, hiçbir şey olmaz. Başlıkta <b>(Yanıt Vermiyor)</b> yazar.</p>
        <ul class="big-list"><li>⏳ Önce biraz beklemek</li><li>📊 Olmazsa <b>Görev Yöneticisi</b> ile kapatmak</li><li>📈 Bilgisayarı neyin yorduğunu görmek</li><li>🚀 Açılışı hızlandırmak</li></ul>
        <p class="mut">Gerçek bilgisayarda en çok tarayıcı ve büyük belgeler donar.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.open('browser'); c.d.open('notepad'); },
    },
    {
      title: 'Program dondu',
      html: `<p>Kelime İşlemci donmuş. Başlığına bakın: <b>(Yanıt Vermiyor)</b>.</p><p>Pencerenin içine <b>iki kez</b> tıklayın. Windows ne yapmak istediğinizi soracak; önce <b>Programın yanıt vermesini bekle</b>\'yi seçin.</p>`,
      mouse: '🖱 Donmuş pencereye iki tık',
      setup: (c) => { const w = hungWord(c); c.d.focus(w, true); },
      hint: 'Pencerenin sağ üstündeki ✕ düğmesine basarsanız da aynı soru çıkar.',
      on: (ev) => ev.type === 'hang-wait' || (ev.type === 'end-task' && ev.via === 'dialog'),
      done: 'Program bazen birkaç saniye sonra kendine gelir; beklemek kaydedilmemiş yazıyı korur. Gelmezse kapatmak gerekir. Şimdi bunu Görev Yöneticisi ile yapacağız.',
    },
    {
      title: 'Görev Yöneticisi\'ni açın',
      html: `<p>${K('Ctrl', 'Shift', 'Esc')} tuşlarına birlikte basın.</p>
        <p>Ya da <b>görev çubuğunun boş bir yerine sağ tıklayıp</b> <b>Görev Yöneticisi</b>\'ni seçin.</p>
        <p class="mut">Bazı bilgisayarlarda bu kısayolu gerçek Windows yakalar ve buraya ulaşmaz; öyle olursa sağ tık yolunu kullanın.</p>`,
      mouse: '🖱 Görev çubuğunda boş yere sağ tık',
      check: (c) => !!tm(c),
      on: (ev) => ev.type === 'app-open' && ev.app === 'taskmgr',
      done: 'Görev Yöneticisi açıldı. <b>İşlemler</b> sekmesinde açık programlar ve arka planda çalışanlar listelenir.',
    },
    {
      title: 'Donan programı kapatın',
      html: '<p>Listede <b>Kelime İşlemci</b> satırına bakın: Durum sütununda <b>⏳ Yanıt vermiyor</b> yazıyor.</p><ol class="steps"><li>O satıra <b>bir kez</b> tıklayın.</li><li>Sağ üstteki <b>⊘ Görevi sonlandır</b>\'a basın.</li></ol>',
      mouse: '🖱 Satır → Görevi sonlandır',
      setup: (c) => { hungWord(c); c.d.ensure('taskmgr'); },
      hint: 'Satıra sağ tıklayıp “Görevi sonlandır” da olur.',
      check: (c) => !c.d.find('word'),
      on: (ev) => ev.type === 'end-task' && ev.target === 'word',
      done: 'Program kapandı. Dikkat: kaydedilmemiş yazı varsa kaybolur. Bu yüzden önemli işlerde sık sık <b>Ctrl + S</b>.',
    },
    {
      title: 'Bilgisayarı en çok ne yoruyor?',
      html: '<p>Tablonun üstündeki <b>Bellek</b> başlığına tıklayın. Liste, en çok bellek kullanan program en üstte olacak şekilde sıralanır.</p>',
      mouse: '🖱 “Bellek” başlığı',
      setup: (c) => { c.d.ensure('taskmgr'); },
      on: (ev) => ev.type === 'taskmgr-sort' && ev.key === 'mem',
      done: 'Sarı renk ne kadar koyuysa o program o kadar çok kullanıyor demektir.',
    },
    rehberSoru({
      title: 'En çok bellek kullanan uygulama',
      html: '<p>Görev Yöneticisi\'nde <b>Uygulamalar</b> bölümüne bakın. En çok bellek kullanan açık program hangisi?</p>',
      opts: ['🌐 İnternet (tarayıcı)', '📝 Not Defteri', '📊 Görev Yöneticisi'],
      ok: 0,
      wrong: 'Bellek sütunundaki sayılara bakın: MB ne kadar büyükse o kadar çok kullanıyor.',
      why: 'Tarayıcılar, özellikle çok sekme açıkken, en çok belleği kullanan programlardır. Bilgisayar yavaşladıysa gereksiz sekmeleri kapatmak ilk çaredir.',
    }),
    {
      title: 'Performans grafikleri',
      html: '<p>Soldan <b>📈 Performans</b>\'a tıklayın. Sonra soldaki listeden <b>Bellek (RAM)</b>\'e tıklayıp ne kadarının dolu olduğuna bakın.</p>',
      mouse: '🖱 Performans → Bellek',
      setup: (c) => { c.d.ensure('taskmgr'); },
      on: (ev) => ev.type === 'taskmgr-perf' && ev.part === 'mem',
      done: 'İşlemci (CPU) grafiği sürekli %100\'e yakınsa ya da bellek hep doluysa bilgisayar ağırlaşır. Bilgisayar alırken “8 GB RAM” gibi bilgiler bu yüzden önemlidir.',
    },
    {
      title: 'Açılışı hızlandırın',
      html: `<p>Soldan <b>🚀 Başlangıç uygulamaları</b>\'na geçin. Bunlar bilgisayar açılırken kendiliğinden başlayan programlardır.</p>
        <ol class="steps"><li>Başlangıç etkisi <b>Yüksek</b> olan <b>Sohbet Uygulaması</b>\'na tıklayın.</li><li><b>Devre dışı bırak</b>\'a basın.</li></ol><p>Üstteki tahmini açılış süresine bakın.</p>`,
      mouse: '🖱 Sohbet Uygulaması → Devre dışı bırak',
      setup: (c) => { c.d.ensure('taskmgr'); },
      check: (c) => c.d.settings.startup.chat === false,
      on: (ev) => ev.type === 'startup-toggle' && ev.id === 'chat' && !ev.on,
      done: 'Program silinmedi; yalnızca açılışta kendiliğinden başlamayacak. İstediğinizde Başlat\'tan yine açabilirsiniz.',
    },
    rehberSoru({
      title: 'Hangisi kapatılmamalı?',
      html: '<p>Başlangıç uygulamalarından hangisini <b>açık bırakmak</b> gerekir?</p>',
      opts: ['🛡 Windows Güvenlik', '💬 Sohbet Uygulaması', '🎵 Müzik Çalar Yardımcısı'],
      ok: 0,
      wrong: 'Bunu kapatsanız bilgisayar yine güvende olur. Bir de koruma programını düşünün.',
      why: 'Virüs koruması bilgisayar açılır açılmaz çalışmalıdır. Tanımadığınız bir programı kapatmadan önce de adını internette aratın.',
    }),
    {
      title: 'Yeni görev çalıştır',
      html: '<p>Görev Yöneticisi\'nin üstündeki <b>▶ Yeni görev çalıştır</b>\'a basın, kutuya <b>notepad</b> yazın ve <b>Tamam</b>\'a basın.</p>',
      target: 'notepad',
      setup: (c) => { c.d.ensure('taskmgr'); },
      hint: 'Başlat menüsü ya da görev çubuğu donduğunda programları böyle açabilirsiniz. Görev çubuğu tamamen kaybolursa listede “Windows Gezgini”ni seçip “Yeniden başlat” deyin.',
      on: (ev) => ev.type === 'run-task' && ev.target === 'notepad',
      done: 'Not Defteri açıldı. <b>notepad</b> Not Defteri\'nin, <b>calc</b> Hesap Makinesi\'nin, <b>mspaint</b> Paint\'in Windows\'taki adıdır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Görev Yöneticisi:</p>' },
  ],
};

// ------------------------------------------------------------------ Kişiselleştirme: temalar
const stPersonal = (c) => { const w = c.d.ensure('settings'); w.api.go('personal'); if (!w.max) c.d.maximize(w); };

export const temalar = {
  id: 'temalar', icon: '🖌', title: 'Kişiselleştirme: temalar ve renkler', minutes: 30, stage: 'desktop',
  desc: 'Hazır tema uygulamak, Mağaza\'dan ücretsiz tema indirmek, vurgu rengini seçmek, görev çubuğunu renklendirmek ve sola almak, eski hâline döndürmek.',
  summary: [
    ['Masaüstüne sağ tık → Kişiselleştir', 'Ayarlar → Kişiselleştirme'],
    ['Tema', 'Arka plan + vurgu rengi + açık/koyu mod birlikte'],
    ['Mağaza\'dan daha fazla tema', 'Ücretsiz ve güvenli temalar'],
    ['Renkler → Vurgu rengi', 'Düğmelerin, seçili öğelerin rengi'],
    ['Görev çubuğu hizalaması', 'Başlat düğmesi ortada ya da solda'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Bilgisayarı kendi zevkinize göre düzenleyeceğiz. Windows\'ta buna <b>kişiselleştirme</b> denir.</p>
        <p><b>Tema</b>, birkaç ayarı birlikte değiştirir: masaüstü resmi, <b>vurgu rengi</b> (düğmeler, seçili öğeler) ve <b>açık/koyu mod</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Kişiselleştirme\'yi açın',
      html: '<p>Masaüstünün boş bir yerine <b>sağ tıklayın</b> ve <b>Kişiselleştir</b>\'i seçin.</p>',
      mouse: '🖱 Masaüstüne sağ tık → Kişiselleştir',
      hint: '⊞ Başlat → Ayarlar → Kişiselleştirme yolu da aynı yere gider.',
      check: (c) => !!c.d.find('settings'),
      on: (ev) => (ev.type === 'app-open' && ev.app === 'settings') || (ev.type === 'settings-page' && ev.page === 'personal'),
      leave: stPersonal,
      done: 'En üstte <b>Temalar</b> bölümü var. Her küçük resim bir temanın önizlemesidir.',
    },
    {
      title: 'Hazır bir tema uygulayın',
      html: '<p><b>Temalar</b> bölümünden <b>Gün batımı</b> ya da <b>Orman</b> temasına tıklayın. Arka planın, görev çubuğundaki çizginin ve düğmelerin rengine bakın.</p>',
      mouse: '🖱 Bir temaya tıklayın',
      setup: stPersonal,
      on: (ev) => ev.type === 'theme' && ev.key !== 'windows',
      done: 'Tema uygulandı: tek tıkla arka plan, vurgu rengi ve açık/koyu mod birlikte değişti.',
    },
    {
      title: 'Mağaza\'dan tema indirin',
      html: '<ol class="steps"><li><b>🛍 Mağaza\'dan daha fazla tema alın</b>\'a tıklayın.</li><li>Beğendiğiniz bir temanın altındaki <b>Al</b> düğmesine basın ve indirmenin bitmesini bekleyin.</li></ol>',
      mouse: '🖱 Mağaza → Al',
      setup: stPersonal,
      check: (c) => c.d.settings.themes.length > 0,
      on: (ev) => ev.type === 'theme-get',
      done: 'Tema indirildi ve Temalar listesine eklendi. Temalar ücretsizdir; internette “ücretsiz tema programı” diye bir şey indirmeyin.',
    },
    {
      title: 'İndirdiğiniz temayı uygulayın',
      html: '<p>İndirdiğiniz temanın yanındaki <b>Uygula</b>\'ya ya da yukarıdaki Temalar listesinde ona tıklayın.</p>',
      setup: stPersonal,
      check: (c) => c.d.settings.themes.includes(c.d.settings.theme),
      on: (ev, c) => ev.type === 'theme' && c.d.settings.themes.includes(ev.key),
      done: 'Yeni masaüstünüz hazır. Arka plan listesinde de bu temanın resmi göründü.',
    },
    {
      title: 'Vurgu rengini seçin',
      html: '<p>Aşağı inip <b>🎨 Renkler</b> bölümünü bulun. <b>Vurgu rengi</b> karelerinden birine tıklayın. Ayarlar\'daki anahtarların ve düğmelerin rengi değişecek.</p>',
      mouse: '🖱 Renkler → bir renk karesi',
      setup: stPersonal,
      on: (ev) => ev.type === 'accent',
      done: 'Vurgu rengi değişti. Tema da artık <b>Özel</b> oldu, çünkü onu siz değiştirdiniz.',
    },
    {
      title: 'Görev çubuğunu renklendirin',
      html: '<p>Aynı bölümde <b>Vurgu rengini Başlat menüsünde ve görev çubuğunda göster</b> anahtarını <b>Açık</b> yapın. Ekranın altına bakın.</p>',
      setup: stPersonal,
      check: (c) => c.d.settings.accentBars,
      on: (ev) => ev.type === 'toggle' && ev.key === 'accentBars' && ev.on,
      done: 'Görev çubuğu vurgu renginde. Başlık çubukları için de ayrı bir anahtar var; isterseniz onu da deneyin.',
    },
    {
      title: 'Başlat düğmesini sola alın',
      html: '<p><b>▭ Görev çubuğu</b> bölümünde <b>Görev çubuğu hizalaması</b>\'nı <b>Sol</b> yapın.</p>',
      setup: stPersonal,
      hint: 'Windows 10\'a alışkın olanlar Başlat düğmesini solda görmek ister.',
      check: (c) => c.d.settings.taskbarAlign === 'left',
      on: (ev) => ev.type === 'taskbar-align' && ev.value === 'left',
      done: 'Başlat düğmesi ve programlar sola geçti. Başlat menüsü de soldan açılır.',
    },
    rehberSoru({
      title: 'Nereden tema indirilir?',
      html: '<p>Komşunuz “bilgisayarıma güzel bir tema kurmak istiyorum” diyor. Ona ne önerirsiniz?</p>',
      opts: ['Ayarlar → Kişiselleştirme → Mağaza\'dan tema alın', 'İnternette “bedava tema indir” yazan siteden program indirin', 'E-postayla gelen “süper_tema.exe” dosyasını açın'],
      ok: 0,
      wrong: 'Tema için program (.exe) indirmek gerekmez. Bu yollarla bilgisayara istenmeyen yazılım bulaşabilir.',
      why: 'Windows temaları Mağaza\'dan ücretsiz ve güvenle indirilir. “.exe” ile gelen “tema”lar çoğu zaman reklam ya da virüs taşır.',
    }),
    {
      title: 'Eski hâline döndürün',
      html: '<p>Sınıftaki bilgisayarı bir sonraki kişiye düzgün bırakalım: <b>Temalar</b>\'dan <b>Windows (açık)</b>\'a tıklayın; <b>Görev çubuğu hizalaması</b>\'nı yeniden <b>Ortala</b> yapın.</p>',
      setup: stPersonal,
      check: (c) => c.d.settings.theme === 'windows' && c.d.settings.taskbarAlign !== 'left',
      on: (ev, c) => (ev.type === 'theme' || ev.type === 'taskbar-align') && c.d.settings.theme === 'windows' && c.d.settings.taskbarAlign !== 'left',
      done: 'Bilgisayar ilk görünüşüne döndü. Not: Tema vurgu rengini değiştirir ama “görev çubuğunda göster” anahtarı sizin seçiminiz olarak kalır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kişiselleştirme:</p>' },
  ],
};

// ------------------------------------------------------------------ Tarayıcı: uzantılar, geçmiş, bul, InPrivate
const brw = (c) => c.d.find('browser');
const brOpen = (c, url) => { const w = maxed(c, 'browser'); if (url) w.api.go(url); return w; };
const brAt = (path) => (c) => { const w = maxed(c, 'browser'); if (!w.api.url.startsWith('tarayici:/' + path)) w.api.go('tarayici:/' + path); };

export const uzantilar = {
  id: 'tarayici-uzanti', icon: '🧩', title: 'Tarayıcı: uzantılar, geçmiş ve gizli pencere', minutes: 40, stage: 'desktop',
  desc: 'Tarayıcıya uzantı (eklenti) kurmak ve sabitlemek, kötü niyetli uzantıyı tanıyıp kaldırmak, geçmişi görmek ve temizlemek, sayfada kelime bulmak, InPrivate pencere.',
  summary: [
    ['⋯ → Uzantılar', 'Kurulu uzantılar: aç/kapat, kaldır'],
    ['🧩 → 📌', 'Uzantıyı araç çubuğuna sabitler'],
    ['Ctrl + H', 'Geçmiş'],
    ['Ctrl + Shift + Delete', 'Tarama verilerini temizle'],
    ['Ctrl + J', 'İndirilenler'],
    ['Ctrl + F', 'Sayfada bul'],
    ['Ctrl + Shift + N', 'Yeni InPrivate (gizli) pencere'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p><b>Uzantı</b> (eklenti), tarayıcıya yeni bir özellik ekleyen küçük programdır: reklam engelleyici, sesli okuma, not alma…</p>
        <p>İyileri işinizi kolaylaştırır; kötüleri ise her sayfaya reklam koyar, arama motorunuzu değiştirir, bilgilerinizi okur. İkisini ayırt etmeyi öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); brOpen(c); },
    },
    {
      title: '⋯ menüsünden Uzantılar',
      html: '<p>Tarayıcının sağ üstündeki <b>⋯</b> (Ayarlar ve diğer) düğmesine tıklayın, <b>🧩 Uzantılar</b>\'ı seçin.</p>',
      mouse: '🖱 ⋯ → Uzantılar',
      setup: (c) => { if (!brw(c)) brOpen(c); },
      on: (ev) => ev.type === 'web-internal' && ev.page === 'uzantilar',
      done: 'Henüz hiç uzantı kurulu değil. Bu sayfada sonradan kurduklarınızı açıp kapatabilir, kaldırabilirsiniz.',
    },
    {
      title: 'Uzantı mağazasına gidin',
      html: '<p>Sayfanın altındaki <b>🛍 Uzantı mağazasından yeni uzantı alın</b> bağlantısına tıklayın.</p>',
      setup: brAt('/uzantilar'),
      on: (ev) => ev.type === 'web-nav' && ev.path === '/magaza',
      done: 'Mağazada her uzantının <b>yayımcısı</b>, <b>kullanıcı sayısı</b> ve <b>yıldızları</b> görünüyor.',
    },
    {
      title: 'Reklam Engelleyici\'yi kurun',
      html: '<ol class="steps"><li><b>🛡 Reklam Engelleyici</b>\'ye tıklayın; açıklamasını, izinlerini ve yorumları okuyun.</li><li><b>Al</b>\'a basın. Çıkan pencerede istediği izni okuyup <b>Uzantı ekle</b> deyin.</li></ol>',
      mouse: '🖱 Reklam Engelleyici → Al → Uzantı ekle',
      setup: brAt('/magaza'),
      check: (c) => !!c.d.settings.extensions.reklam,
      on: (ev) => ev.type === 'ext-install' && ev.id === 'reklam',
      done: 'Yalnızca <b>bir</b> izin istedi, yayımcısı doğrulanmış ve milyonlarca kişi kullanıyor: güvenilir bir uzantının işaretleri.',
    },
    {
      title: 'Araç çubuğuna sabitleyin',
      html: '<p>Adres çubuğunun sağındaki <b>🧩</b> düğmesine tıklayın. Reklam Engelleyici\'nin yanındaki <b>📌</b> işaretine basın.</p>',
      mouse: '🖱 🧩 → 📌',
      setup: (c) => { if (!brw(c)) brOpen(c); },
      check: (c) => !!c.d.settings.extensions.reklam?.pin,
      on: (ev) => ev.type === 'ext-pin' && ev.id === 'reklam' && ev.pin,
      done: 'Uzantının simgesi 🛡 artık hep görünecek. Üzerindeki kırmızı sayı, o sayfada kaç reklamın engellendiğini gösterir.',
    },
    {
      title: 'Deneyin',
      html: '<p>Adres çubuğuna <b>program indir</b> yazıp aratın. Arama sonuçlarının başındaki “Reklam” yazılı sonuç artık görünmüyor; 🛡 simgesine bakın.</p>',
      target: 'program indir',
      setup: (c) => { if (!brw(c)) brOpen(c); },
      on: (ev) => ev.type === 'ext-block' && ev.count > 0,
      done: 'Reklam gizlendi. Sahte “virüs bulundu” pencereleri de artık açılmaz.',
    },
    rehberSoru({
      title: 'Bu uzantı kurulur mu?',
      html: '<p>Mağazada <b>SÜPER İndirim Bulucu 🔥🔥</b> uzantısına bakın. Kurar mıydınız?</p>',
      setup: (c) => brOpen(c, 'tarayici://magaza/indirim'),
      opts: ['Hayır: yayımcısı doğrulanmamış, az kullanıcısı ve çok izni var', 'Evet: ücretsiz para kazandırıyor', 'Evet: bir yorumda 5 yıldız var'],
      ok: 0,
      wrong: 'Sayfaya yeniden bakın: yayımcı, kullanıcı sayısı, yıldız ortalaması ve kırmızıyla yazılan izinler.',
      why: 'Uyarı işaretleri: <b>⚠ Doğrulanmamış yayımcı</b>, yalnızca <b>120</b> kullanıcı, <b>2,1</b> yıldız, “TÜM sitelerdeki verilerinizi okuma” gibi <b>çok fazla izin</b>, ünlemlerle dolu açıklama ve şikâyet eden yorumlar.',
    }),
    {
      title: 'Kötü uzantıyı kaldırın',
      html: `<p>Diyelim ki evdeki biri bu uzantıyı kurmuş: her sayfada sarı bir reklam şeridi var, ⌂ Ana sayfa düğmesi de başka bir siteye gidiyor.</p>
        <p><b>⋯ → Uzantılar</b>\'a gidin ve <b>SÜPER İndirim Bulucu</b>\'nun altındaki <b>Kaldır</b>\'a basın.</p>`,
      setup: (c) => {
        const es = c.d.settings.extensions;
        if (!es.indirim) c.d.settings.extensions = { ...es, indirim: { on: true, pin: false } };
        brOpen(c, 'www.gunun-haberleri.com.tr');
      },
      hint: '🧩 düğmesi → Uzantıları yönet de aynı sayfayı açar. Tarayıcı ayarlarındaki “Ayarları sıfırla” da bütün uzantıları kapatır.',
      check: (c) => !c.d.settings.extensions.indirim,
      on: (ev) => ev.type === 'ext-remove' && ev.id === 'indirim',
      done: 'Kaldırıldı. Reklam şeridi ve değişen ana sayfa da gitti. Tarayıcı kendi kendine garipleştiyse ilk bakılacak yer <b>Uzantılar</b>\'dır.',
    },
    {
      title: 'Geçmiş: Ctrl + H',
      html: `<p>${K('Ctrl', 'H')} tuşlarına basın (ya da ⋯ → Geçmiş). Gezdiğiniz sayfalar saatleriyle listelenir.</p><p class="mut">Önce sayfaya bir kez tıklayın ki kısayol tarayıcıya gitsin.</p>`,
      combo: ['Ctrl', 'KeyH'],
      setup: (c) => { if (!brw(c)) brOpen(c); },
      on: (ev) => ev.type === 'web-internal' && ev.page === 'gecmis',
      done: 'Dün baktığınız bir tarifi ya da haberi adresini hatırlamadan buradan bulabilirsiniz. Üstteki kutuya bir kelime yazıp arayabilirsiniz.',
    },
    {
      title: 'Tarama verilerini temizleyin',
      html: '<ol class="steps"><li><b>🧹 Tarama verilerini temizle</b>\'ye tıklayın.</li><li>Seçenekleri okuyun ve <b>Şimdi temizle</b>\'ye basın.</li></ol>',
      setup: brAt('/gecmis'),
      hint: 'Ortak kullanılan bir bilgisayarda (kütüphane, iş yeri) işiniz bitince bunu yapmak iyi bir alışkanlıktır.',
      on: (ev) => ev.type === 'web-clear',
      done: '<b>Çerezleri</b> silince sitelerdeki oturumlarınız kapanır; e-postanıza yeniden giriş yapmanız gerekir. Bu, başkasının bilgisayarında tam istediğimiz şeydir.',
    },
    {
      title: 'Sayfada kelime bulun: Ctrl + F',
      html: `<p>Börek tarifi açıldı. Tarifte <b>yumurta</b> nerede geçiyor? Sayfaya bir kez tıklayın, ${K('Ctrl', 'F')}\'ye basın ve <b>yumurta</b> yazın.</p>`,
      target: 'yumurta',
      combo: ['Ctrl', 'KeyF'],
      setup: (c) => brOpen(c, 'www.lezzetli-tarifler.com.tr/borek'),
      hint: '⋯ → Sayfada bul da aynı kutuyu açar. ↓ düğmesi ya da Enter bir sonrakine gider.',
      on: (ev) => ev.type === 'web-find' && norm(ev.q).includes('yumurta') && ev.count > 0,
      done: 'Bulunan yerler sarıyla işaretlendi. Uzun sayfalarda, sözleşmelerde, faturalarda aradığınızı bulmanın en hızlı yolu.',
    },
    {
      title: 'InPrivate (gizli) pencere',
      html: '<p><b>⋯</b> menüsünden <b>🕶 Yeni InPrivate penceresi</b>\'ni açın ve yeni sekmedeki açıklamayı okuyun.</p>',
      mouse: '🖱 ⋯ → Yeni InPrivate penceresi',
      setup: (c) => { if (!brw(c)) brOpen(c); },
      check: (c) => c.d.wins.some((w) => w.app === 'browser' && w.api.private),
      on: (ev) => ev.type === 'app-open' && ev.app === 'browser' && ev.args?.private,
      done: 'Mor renkli pencere gizli penceredir. Bu pencerede gezdikleriniz <b>Geçmiş</b>\'e yazılmaz; kapatınca çerezler silinir.',
    },
    rehberSoru({
      title: 'Gizli pencere neyi yapmaz?',
      html: '<p>InPrivate pencere için hangisi <b>yanlıştır</b>?</p>',
      opts: ['Beni internette görünmez yapar, kimse ne yaptığımı bilemez', 'Gezdiğim sayfalar bu bilgisayarın geçmişine yazılmaz', 'Kapatınca sitelerdeki oturumlarım kapanır'],
      ok: 0,
      wrong: 'Bu söylenen, gizli pencerenin gerçekten yaptığı bir şey. Yanlış olanı arıyoruz.',
      why: 'Gizli pencere yalnızca <b>bu bilgisayarda</b> iz bırakmaz. İnternet sağlayıcınız, iş yeri ağı ve girdiğiniz siteler yine görebilir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarayıcının ayrıntıları:</p>' },
  ],
};

// ------------------------------------------------------------------ Kelime işlemci: ileri özellikler
const WD = (c) => c.d.find('word')?.api;
const winfo = (c) => WD(c)?.info() || { blocks: [], text: '', header: '' };
const blk = (c, w) => winfo(c).blocks.find((b) => norm(b.text).includes(norm(w)));
const DOC = `<p>Mahalle Toplantısı Duyurusu</p><p>Değerli komşularımız,</p>
  <p>Mahallemizin sorunlarını konuşmak için Cumartesi saat 10:00'da muhtarlıkta toplanıyoruz. herkez davetlidir. Toplantıyı muhtarımız Ahmet Bey yönetecek; malesef çay ikramı olmayacak.</p>
  <p>Sorularınız için Ahmet Bey'i arayabilirsiniz: 0 555 000 00 00</p><p>Muhtar Ahmet Yılmaz</p>`;
const wdOpen = (c) => {
  let w = c.d.find('word');
  if (!w) { w = maxed(c, 'word'); w.api.load({ html: DOC }); }
  else if (!w.max) c.d.maximize(w);
  return w;
};
const wdEvents = ['doc-format', 'doc-input', 'doc-style', 'doc-spacing', 'doc-replace', 'doc-spell-fix', 'doc-hf-input', 'doc-pagenum'];
const wdWhen = (test) => (ev, c) => wdEvents.includes(ev.type) && !!test(c);

export const kelimeIleri = {
  id: 'kelime-ileri', icon: '📘', title: 'Kelime işlemci: ileri özellikler', minutes: 40, stage: 'desktop',
  desc: 'Hazır bir duyuruyu düzeltmek: başlık stili, metin vurgulama, yazım denetimi, bul ve değiştir, satır aralığı, üst bilgi, sayfa numarası, sözcük sayımı.',
  summary: [
    ['Giriş → Stiller', 'Başlık 1, Başlık 2: başlıklar tek tıkla'],
    ['🖍 Metin vurgu rengi', 'Fosforlu kalem gibi'],
    ['F7', 'Yazım ve Dil Bilgisi denetimi'],
    ['Ctrl + F / Ctrl + H', 'Bul / Bul ve değiştir'],
    ['Ctrl + 1 / Ctrl + 5 / Ctrl + 2', 'Satır aralığı 1 / 1,5 / 2'],
    ['Ekle → Üst bilgi, Sayfa numarası', 'Her sayfada tekrar eden yazılar'],
    ['Ctrl + Enter', 'Sayfa sonu: yeni sayfaya geç'],
    ['🖌 Biçim boyacısı', 'Bir yazının biçimini başkasına kopyalar'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Muhtarlık için hazırlanmış bir <b>duyuru</b> açılacak. İçinde yazım hataları var, başlığı sade, önemli bilgi göze çarpmıyor.</p>
        <p>Kelime işlemcinin daha ileri araçlarıyla onu düzelteceğiz. Yeni sekmeler: <b>Düzen</b>, <b>Gözden Geçir</b>, <b>Görünüm</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); wdOpen(c); },
    },
    {
      title: 'Başlık stili',
      html: '<ol class="steps"><li>İlk satıra (<b>Mahalle Toplantısı Duyurusu</b>) bir kez tıklayın.</li><li><b>Giriş</b> sekmesinin sağındaki stillerden <b>Başlık 1</b>\'e basın.</li></ol>',
      mouse: '🖱 İlk satır → Başlık 1',
      setup: wdOpen,
      hint: 'Stil, yazı tipini, boyutunu ve rengini tek seferde ayarlar. Uzun belgelerde bütün başlıkların aynı görünmesini sağlar.',
      check: (c) => blk(c, 'toplantısı duyurusu')?.tag === 'H1',
      on: wdWhen((c) => blk(c, 'toplantısı duyurusu')?.tag === 'H1'),
      done: 'Başlık mavi ve büyük oldu. Normal\'e dönmek için yine stillerden <b>Normal</b>\'e basılır.',
    },
    {
      title: 'Önemli bilgiyi vurgulayın',
      html: '<ol class="steps"><li><b>Cumartesi saat 10:00</b> yazısını fareyle sürükleyerek seçin.</li><li>Şeritteki <b>🖍</b> düğmesine, sonra <b>sarı</b> renge tıklayın.</li></ol>',
      mouse: '🖱 Seç → 🖍 → Sarı',
      setup: wdOpen,
      check: (c) => blk(c, 'cumartesi')?.highlight,
      on: wdWhen((c) => blk(c, 'cumartesi')?.highlight),
      done: 'Fosforlu kalemle çizilmiş gibi. Okuyan kişinin gözü önce oraya gider.',
    },
    {
      title: 'Yazım denetimi: F7',
      html: '<p><b>Gözden Geçir</b> sekmesine geçip <b>✓ Yazım ve Dil Bilgisi</b>\'ne basın (ya da <b>F7</b>). Sağda çıkan bölmede her hata için <b>Değiştir</b>\'e basın; “Yazım denetimi tamamlandı” görünene kadar devam edin.</p>',
      mouse: '🖱 Gözden Geçir → Yazım ve Dil Bilgisi',
      setup: wdOpen,
      hint: 'Kırmızı dalgalı çizgili kelimeler hatalıdır. “Yoksay” kelimeyi olduğu gibi bırakır (ör. bir soyadı).',
      check: (c) => !/herkez|malesef/i.test(winfo(c).text),
      on: (ev, c) => ['doc-spell-done', 'doc-spell-fix', 'doc-input'].includes(ev.type) && !/herkez|malesef/i.test(winfo(c).text),
      done: '“herkez” → <b>herkes</b>, “malesef” → <b>Maalesef</b>. Program her hatayı yakalayamaz; belgeyi göndermeden önce bir kez de siz okuyun.',
    },
    {
      title: 'Bul ve değiştir',
      html: '<p>Muhtar değişmiş! Belgede <b>Ahmet</b> geçen her yere <b>Mehmet</b> yazmamız gerekiyor. Tek tek düzeltmek yerine:</p><ol class="steps"><li><b>Giriş</b> sekmesinde <b>⇄ Değiştir</b>\'e basın (ya da Ctrl + H).</li><li><b>Aranan:</b> Ahmet, <b>Yeni değer:</b> Mehmet</li><li><b>Tümünü değiştir</b>\'e basın.</li></ol>',
      mouse: '🖱 Giriş → Değiştir',
      setup: wdOpen,
      check: (c) => !/ahmet/i.test(winfo(c).text) && /mehmet/i.test(winfo(c).text),
      on: wdWhen((c) => !/ahmet/i.test(winfo(c).text) && /mehmet/i.test(winfo(c).text)),
      done: 'Üç yer birden değişti. Yüzlerce sayfalık belgede bile aynı süre sürer.',
    },
    {
      title: 'Satır aralığı',
      html: '<p>Uzun paragrafa (<b>Mahallemizin sorunlarını…</b>) tıklayın. <b>Giriş</b>\'teki <b>↕ Aralık</b> kutusundan <b>1,5</b>\'i seçin.</p>',
      setup: wdOpen,
      hint: 'Kısayolu: Ctrl + 5. Ctrl + 1 tek aralığa döndürür.',
      check: (c) => blk(c, 'sorunlarını')?.lineHeight === '1.5',
      on: wdWhen((c) => blk(c, 'sorunlarını')?.lineHeight === '1.5'),
      done: 'Satırlar arası açıldı; yaşlılar ve uzaktan okuyanlar için daha rahat.',
    },
    {
      title: 'Üst bilgi',
      html: '<p><b>Ekle</b> sekmesinde <b>▔ Üst bilgi</b>\'ye basın ve sayfanın en üstündeki kutuya şunu yazın:</p>',
      target: 'Çiçek Mahallesi Muhtarlığı',
      setup: wdOpen,
      hint: 'Üst bilgi, belge kaç sayfa olursa olsun her sayfanın tepesinde tekrar eder: kurum adı, tarih gibi.',
      check: (c) => norm(winfo(c).header).includes(norm('Çiçek Mahallesi')),
      on: wdWhen((c) => norm(winfo(c).header).includes(norm('Çiçek Mahallesi'))),
      done: 'Üst bilgi yazıldı. Asıl yazıya dönmek için sayfanın ortasına tıklamanız yeterli.',
    },
    {
      title: 'Sayfa numarası',
      html: '<p><b>Ekle</b> sekmesinde <b># Sayfa numarası</b>\'na basın. Sayfanın en altına bakın.</p>',
      setup: wdOpen,
      check: (c) => winfo(c).pageNum,
      on: (ev) => ev.type === 'doc-pagenum' && ev.on,
      done: 'Alt bilgide “Sayfa 1 / 1” yazıyor. Çok sayfalı belgeler yazdırılınca karışırsa sıraya koymayı kolaylaştırır.',
    },
    rehberSoru({
      title: 'Yeni sayfaya geçmek',
      html: '<p>Duyurunun ikinci bölümünü <b>yeni bir sayfadan</b> başlatmak istiyorsunuz. En doğru yol hangisi?</p>',
      opts: ['Ctrl + Enter (Ekle → Sayfa sonu)', 'Enter\'a, sayfa bitene kadar defalarca basmak', 'Yeni bir belge açmak'],
      ok: 0,
      wrong: 'Bu da bir yol gibi görünüyor ama yukarıya bir satır eklenince her şey kayar.',
      why: '<b>Sayfa sonu</b> yazının kalanını her zaman yeni sayfadan başlatır; üstte değişiklik yapsanız bile kaymaz.',
    }),
    {
      title: 'Sözcük sayımı',
      html: '<p><b>Gözden Geçir</b> sekmesinde <b>123 Sözcük sayımı</b>\'na basın. Duyuruda kaç sözcük var?</p>',
      setup: wdOpen,
      hint: 'Dilekçe ve ödevlerde “en fazla 300 sözcük” gibi sınırlar olur; bunu buradan kontrol edersiniz. Alttaki durum çubuğunda da sözcük sayısı görünür.',
      on: (ev) => ev.type === 'doc-wordcount',
      done: 'Pencerede sayfa, sözcük, karakter ve paragraf sayıları var.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile belgeyi <b>Belgeler</b> klasörüne <b>toplantı duyurusu</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      setup: wdOpen,
      on: (ev) => ev.type === 'doc-save',
      done: 'Kaydedildi. Üst bilgi, sayfa numarası ve düzen ayarları da belgeyle birlikte saklandı.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kelime işlemcide ileri özellikler:</p>' },
  ],
};
