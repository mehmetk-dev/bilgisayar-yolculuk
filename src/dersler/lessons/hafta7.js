// 7. hafta: Paint, Ekran Alıntısı, Ayarlar
import { K, desktopReady, maxed } from './common.js';

const paintOpen = (c) => maxed(c, 'paint');

export const paint = {
  id: 'paint', icon: '🎨', title: 'Paint ile resim', minutes: 25, stage: 'desktop',
  desc: 'Kalem, renk, fırça, şekiller, yazı, silgi, kaydetme, arka plan yapma.',
  summary: [
    ['✏ Kalem / 🖌 Fırça', 'Sol tuşu basılı tutup çizin'],
    ['Renkler', 'Önce renge tıklayın, sonra çizin'],
    ['▭ ◯ ╱ Şekiller', 'Çapraz sürükleyerek çizilir'],
    ['🪣 Doldur', 'Kapalı bir alanın içini boyar'],
    ['A Metin', 'Resme yazı ekler'],
    ['Ctrl + Z', 'Son yaptığınızı geri alır'],
    ['Ctrl + S', 'Kaydet (Resimler klasörüne)'],
  ],
  steps: [
    {
      title: 'Paint nedir?',
      html: '<p><b>Paint</b>, Windows\'la birlikte gelen basit bir çizim programıdır. Resim çizmek, fotoğrafa yazı eklemek, ekran görüntüsünü düzenlemek için kullanılır.</p><p>Bu derste araçları tek tek öğrenirken adım adım <b>saksıda bir çiçek</b> çizeceğiz:</p><div class="sc-big" style="text-align:center">🌷 ➜ 🪴</div>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Paint\'i açın',
      html: '<p>Masaüstündeki <b>Paint</b> simgesine çift tıklayın (ya da Başlat → Paint).</p>',
      check: (c) => !!c.d.find('paint'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'paint',
    },
    {
      title: 'Kalemle sap çizin',
      html: '<p>Kalem seçili. Üstteki renklerden <b>yeşile</b> tıklayın. Sonra tuvalin <b>ortasında</b>, sol tuşu <b>basılı tutarak</b> yukarıdan aşağıya uzun bir çizgi çizin: bu, çiçeğin <b>sapı</b>.</p>',
      hint: 'Tuvalin üst yarısının ortasından başlayın, aşağıya doğru çekin; altta saksıya yer kalsın.',
      mouse: '🖱 Bas, tut, çiz',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-draw') {
          if (ev.colorName !== 'Yeşil') c.note('Bu çizgi yeşil olmadı. Önce üstteki yeşil renge tıklayın, sonra sapı çizin.');
          else if ((c.s.len = (c.s.len || 0) + ev.len) < 150) c.note('Güzel, biraz daha uzatın.');
        }
        return (c.s.len || 0) >= 150;
      },
      done: 'Sap hazır. Kalemle çizmek bu kadar: basılı tut, gezdir, bırak.',
    },
    {
      title: 'Çiçeği çizin',
      html: '<p>Şimdi <b>kırmızıya</b> tıklayın. Sapın <b>tepesine</b>, küçük yuvarlaklar çizerek çiçeğin yapraklarını yapın (papatya gibi, ortanın çevresinde 5-6 yuvarlak).</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-color') c.note(`Seçili renk: <b>${ev.colorName}</b>`);
        if (ev.type === 'paint-draw' && ev.colorName !== 'Kırmızı') c.note('Bu çizgi başka renkte oldu. Önce kırmızı renge tıklayın.');
        return ev.type === 'paint-draw' && ev.colorName === 'Kırmızı';
      },
    },
    {
      title: 'Fırça ile yapraklar',
      html: '<p><b>🖌 Fırça</b>\'yı seçin, kalınlıktan <b>Kalın</b>\'ı seçin, rengi yeniden <b>yeşil</b> yapın. Sapın iki yanına birer <b>yaprak</b> çizin.</p>',
      hint: 'Yaprak için sapın ortasından yana doğru kısa, kalın bir çizgi yeter.',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-draw' && ev.tool === 'brush' && ev.size < 14) c.note('Fırça oldu; şimdi <b>Kalın</b>\'ı da seçip tekrar çizin.');
        return ev.type === 'paint-draw' && ev.tool === 'brush' && ev.size >= 14;
      },
    },
    {
      title: 'Dikdörtgenle saksı',
      html: '<p>Rengi <b>kahverengi</b> yapın ve <b>▭ Dikdörtgen</b>\'i seçin. Sapın <b>alt ucuna</b> bir saksı çizin: saksının sol üst köşesinden başlayıp sol tuşu basılı tutarak sağ alta doğru <b>çapraz</b> sürükleyin, bırakın.</p>',
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-shape' && ev.shape === 'rect',
      done: 'Saksı yerinde. ◯ Elips ve ╱ Çizgi de aynı şekilde, çapraz sürükleyerek çizilir.',
    },
    {
      title: 'Saksıyı boyayın',
      html: '<p><b>🪣 Doldur</b>\'u seçin, <b>turuncu</b> renge tıklayın, sonra saksının <b>içine</b> tıklayın.</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-fill' && ev.pixels > 200000) c.note('Bütün sayfa boyandı: dikdörtgenin <b>dışına</b> tıkladınız. Ctrl + Z ile geri alıp içine tıklayın.');
        return ev.type === 'paint-fill' && ev.pixels <= 200000;
      },
      done: 'Doldurma, kenarları kapalı bir alanın içini boyar. Çiçeğin ortasını da sarıya boyayabilirsiniz.',
    },
    {
      title: 'Geri alın: Ctrl + Z',
      html: `<p>Bir hata mı yaptınız? ${K('Ctrl', 'Z')} son yaptığınızı geri alır. Deneyin: son yaptığınız şey geri gider. İsterseniz sonra yeniden yaparsınız.</p>`,
      combo: ['Ctrl', 'KeyZ'],
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-undo',
      done: 'Not Defteri\'nde olduğu gibi Paint\'te de Ctrl + Z can simididir.',
    },
    {
      title: 'Yazı ekleyin',
      html: `<p><b>A Metin</b> aracını seçin, saksının <b>altına</b> tıklayın, adınızı yazıp ${K('Enter')}'a basın. Resminizin imzası olsun.</p>`,
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-text',
    },
    {
      title: 'Silgi',
      html: '<p><b>🧽 Silgi</b>\'yi seçin. Taşan bir çizgi ya da beğenmediğiniz bir yer varsa silin (yoksa boş bir köşede deneyin).</p>',
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-draw' && ev.tool === 'eraser',
    },
    {
      title: 'Kaydedin',
      html: `<ol class="steps"><li>${K('Ctrl', 'S')}'ye basın (ya da 💾).</li><li><b>Resimler</b> klasörü seçili; dosya adına <b>çiçeğim</b> yazın.</li><li><b>Kaydet</b>'e tıklayın.</li></ol>`,
      combo: ['Ctrl', 'KeyS'],
      setup: paintOpen,
      on: (ev, c) => { if (ev.type === 'save' && ev.app === 'paint') { c.L.pic = ev.name; return true; } return false; },
      done: (c) => `Resminiz <b>${c.L.pic}</b> adıyla Resimler klasörüne kaydedildi.`,
    },
    {
      title: 'Resmi arka plan yapın',
      html: '<p>Paint\'i kapatın. Dosya Gezgini\'ni (📁) açıp <b>Resimler</b>\'e gidin. Resminize <b>sağ tıklayın</b> → <b>Masaüstü arka planı olarak ayarla</b>.</p>',
      mouse: '🖱 Resme sağ tık',
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Masaüstünüzde artık kendi çiçeğiniz var!',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Paint ile resim yapmayı öğrendiniz.</p>' },
  ],
};

export const alinti = {
  id: 'alinti', icon: '✂', title: 'Ekran Alıntısı', minutes: 20, stage: 'desktop',
  desc: 'Ekranın bir bölümünü resim olarak almak, Paint\'e yapıştırıp işaretlemek, kaydetmek ve yardım isterken göndermek.',
  summary: [
    ['⊞ + Shift + S', 'Gerçek bilgisayarda Ekran Alıntısı kısayolu'],
    ['Print Screen (PrtSc)', 'Bütün ekranı panoya alır'],
    ['Ctrl + V', 'Alınan resmi Paint\'e, WhatsApp\'a, e-postaya yapıştırır'],
    ['Kırmızı daire', 'Paint\'te sorunlu yeri gösterir'],
    ['Dikkat', 'Şifre, kart numarası görünen ekranların resmini paylaşmayın'],
  ],
  steps: [
    {
      title: 'Ekran alıntısı nedir?',
      html: `<p>Ekranda gördüğünüz bir şeyin <b>fotoğrafını çekmek</b> gibidir: bir hata mesajını, bir tarifi, bir adresi resim olarak saklayabilir ya da birine gönderebilirsiniz.</p>
        <p>Gerçek bilgisayarda kısayolu: ${K('⊞', 'Shift', 'S')}. Burada aynı işi <b>Ekran Alıntısı</b> programıyla yapacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.open('browser', { url: 'www.hava-durumu.com.tr' }); },
    },
    {
      title: 'Ekran Alıntısı\'nı açın',
      html: '<p>⊞ Başlat\'ı açın, <b>ekran</b> yazın ve <b>Ekran Alıntısı</b>\'nı açın.</p>',
      check: (c) => !!c.d.find('snip'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'snip',
    },
    {
      title: 'Alıntı alın',
      html: '<p><b>＋ Yeni</b>\'ye tıklayın. Ekran kararır. Hava durumunun olduğu yeri fareyle <b>çerçeveleyin</b>: sol tuşu basılı tutup çapraz sürükleyin, bırakın.</p>',
      mouse: '🖱 Çapraz sürükleyin',
      setup: (c) => c.d.ensure('snip'),
      on: (ev) => ev.type === 'snip',
      done: 'Resim <b>panoya</b> kopyalandı. Sağ altta küçük bir önizleme çıktı.',
    },
    {
      title: 'Paint\'e yapıştırın',
      html: `<p>Paint\'i açın ve ${K('Ctrl', 'V')}'ye basın (ya da 📋 düğmesi).</p>`,
      combo: ['Ctrl', 'KeyV'],
      on: (ev) => ev.type === 'paint-paste',
      done: 'Alıntı Paint\'te!',
    },
    {
      title: 'Önemli yeri işaretleyin',
      html: '<p>Resmi birine gösterirken önemli yeri işaretlemek işi kolaylaştırır. <b>Kırmızı</b> rengi ve <b>◯ Elips</b> aracını seçip bugünkü sıcaklığın çevresine bir daire çizin.</p>',
      on: (ev, c) => {
        if (ev.type !== 'paint-shape' || ev.shape !== 'ellipse') return false;
        if (ev.colorName !== 'Kırmızı') { c.note(`Daire ${ev.colorName.toLowerCase()} oldu. Kırmızı daha dikkat çeker: Ctrl + Z, kırmızıyı seçip yeniden çizin.`); return false; }
        return true;
      },
      done: 'Bakan kişi neyi göstermek istediğinizi hemen görür. Bir hata mesajının resmini torununuza gönderirken de böyle yapabilirsiniz.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Resimler</b> klasörüne <b>hava durumu</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'save' && ev.app === 'paint',
    },
    {
      title: 'Gerçek bilgisayarda',
      html: `<ol class="steps"><li>${K('⊞', 'Shift', 'S')}'ye birlikte basın.</li><li>Ekran kararınca istediğiniz yeri çerçeveleyin.</li><li>Sonra WhatsApp\'ta, e-postada ya da Paint\'te ${K('Ctrl', 'V')} yapın.</li><li>Yardım istiyorsanız altına kısaca ne yapmaya çalıştığınızı yazın.</li></ol>
        <div class="box">⚠ Ekranda şifre, kart numarası ya da kimlik bilgisi görünüyorsa o resmi kimseyle paylaşmayın.</div>`,
      manual: '✔ Anladım',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Ekran alıntısı almayı öğrendiniz.</p>' },
  ],
};

export const ayarlar = {
  id: 'ayarlar', icon: '⚙', title: 'Ayarlar', minutes: 30, stage: 'desktop',
  desc: 'Arka plan, ses, parlaklık, Wi-Fi\'ye bağlanma, saati ve saat dilimini düzeltme, yazı boyutu, güncelleştirmeler.',
  desktop: { settings: { wifi: false, network: null, autoTime: false, timeOffset: -(2 * 3600e3 + 17 * 60e3) } },
  summary: [
    ['Ayarlar → Kişiselleştirme', 'Arka plan, açık/koyu mod'],
    ['Ayarlar → Sistem', 'Ses düzeyi, ekran parlaklığı'],
    ['Ayarlar → Ağ ve İnternet', 'Wi-Fi açma, ağa bağlanma (şifre modemin altında)'],
    ['Ayarlar → Saat ve dil', '“Saati otomatik olarak ayarla” açık olmalı'],
    ['Ayarlar → Erişilebilirlik', 'Metin boyutu: yazıları büyütür'],
    ['Ayarlar → Windows Update', 'Güncelleştirmeleri denetle; ertelemeyin'],
    ['⊞ + I', 'Gerçek bilgisayarda Ayarlar\'ı açar'],
  ],
  steps: [
    {
      title: 'Ayarlar uygulaması',
      html: `<p>Bilgisayarın görünüşü, sesi, interneti, saati… hepsi <b>Ayarlar</b>\'dan değiştirilir.</p><p>Açmanın yolları: ⊞ Başlat → ⚙ <b>Ayarlar</b>, ya da gerçek bilgisayarda ${K('⊞', 'I')}.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Ayarlar\'ı açın',
      html: '<p>⊞ Başlat → <b>⚙ Ayarlar</b>.</p>',
      check: (c) => !!c.d.find('settings'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'settings',
    },
    {
      title: 'Arka planı değiştirin',
      html: '<p>Soldan <b>🎨 Kişiselleştirme</b>\'ye tıklayın. Resimlerden <b>Orman</b>\'a tıklayın.</p>',
      setup: (c) => c.d.ensure('settings'),
      on: (ev, c) => {
        if (ev.type === 'wallpaper' && ev.key !== 'orman') c.note(`Arka plan “${ev.name}” oldu. Bu adımda <b>Orman</b>\'ı seçin.`);
        return ev.type === 'wallpaper' && ev.key === 'orman';
      },
      done: 'Masaüstünün arka planı değişti. Pencereyi biraz kenara çekip bakabilirsiniz.',
    },
    {
      title: 'Kendi fotoğrafınız',
      html: '<p>Aynı sayfada <b>🖼 Fotoğraflara göz atın…</b>\'a tıklayın. <b>Resimler</b> klasöründen <b>kedimiz</b> fotoğrafını seçip <b>Aç</b>\'a tıklayın.</p>',
      setup: (c) => { const w = c.d.ensure('settings'); w.api.go('personal'); },
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Torunlarınızın fotoğrafını da böyle arka plan yapabilirsiniz.',
    },
    {
      title: 'Ses düzeyi',
      html: '<p>Soldan <b>🖥 Sistem</b>\'e gidin. <b>Ses düzeyi</b> çubuğunu <b>30</b> civarına çekin, sonra <b>🎵 Sesi dene</b>\'ye tıklayın.</p>',
      setup: (c) => c.d.ensure('settings'),
      on: (ev, c) => {
        if (ev.type === 'sound-test' && ev.volume > 40) c.note(`Ses düzeyi şu an ${ev.volume}. Çubuğu sola çekip 30 civarına getirin.`);
        return ev.type === 'sound-test' && ev.volume <= 40 && ev.volume > 0 && !ev.muted;
      },
      done: 'Sesi kısmak da açmak da buradan ya da görev çubuğundaki 🔊\'dan yapılır.',
    },
    {
      title: 'Sesi kapatıp açın',
      html: '<p><b>Sesi kapat (sessiz)</b> anahtarına tıklayın: <b>Açık</b> olur. <b>🎵 Sesi dene</b>: ses gelmez. Sonra anahtarı tekrar kapatın.</p>',
      setup: (c) => { const w = c.d.ensure('settings'); w.api.go('system'); },
      on: (ev, c) => {
        if (ev.type === 'toggle' && ev.key === 'muted' && ev.on) { c.s.m = true; c.note('Ses kapandı (🔇). Şimdi anahtarı tekrar kapatıp sesi geri açın.'); }
        return !!c.s.m && ev.type === 'toggle' && ev.key === 'muted' && !ev.on;
      },
      done: 'Bilgisayardan ses gelmediğinde önce “sessiz”in açık olup olmadığına bakın.',
    },
    {
      title: 'Ekran parlaklığı',
      html: '<p>Aynı sayfada <b>Ekran</b> bölümündeki <b>☀ Parlaklık</b> çubuğunu <b>60 ile 80 arasına</b> getirin.</p><p class="mut">Masaüstü bilgisayarda parlaklık monitörün düğmelerindedir; bu çubuk görünmeyebilir.</p>',
      setup: (c) => { const w = c.d.ensure('settings'); w.api.go('system'); },
      on: (ev, c) => ev.type === 'setting' && ev.key === 'brightness' && c.d.settings.brightness >= 60 && c.d.settings.brightness <= 80,
      done: 'Parlaklık odaya uygun olmalı: karanlık odada çok parlak ekran gözü yorar. Dizüstünde klavyedeki ☀ tuşları da (çoğu zaman Fn ile) aynı işi yapar.',
    },
    {
      title: 'Wi-Fi\'yi açın',
      html: '<p>Soldan <b>📶 Ağ ve İnternet</b>\'e gidin. <b>Wi-Fi</b> anahtarı kapalı: tıklayıp açın.</p><p class="mut">Bilgisayarınız modeme kablolu bağlıysa Wi-Fi görünmeyebilir.</p>',
      setup: (c) => c.d.ensure('settings'),
      check: (c) => c.d.settings.wifi,
      on: (ev) => ev.type === 'toggle' && ev.key === 'wifi' && ev.on,
      done: 'Wi-Fi açıldı ve yakındaki ağlar listelendi.',
    },
    {
      title: 'Ağa bağlanın',
      html: `<ol class="steps"><li><b>EvAğı</b>\'nın yanındaki <b>Bağlan</b>\'a tıklayın.</li><li>Şifre olarak <b>evagi2024</b> yazın.</li><li><b>İleri</b>\'ye tıklayın.</li></ol>
        <p class="mut">Gerçekte Wi-Fi şifresi genellikle <b>modemin altındaki etikette</b> yazar.</p>`,
      setup: (c) => { const w = c.d.ensure('settings'); if (!c.d.settings.wifi) c.d.setSetting('wifi', true); w.api.go('network'); },
      check: (c) => c.d.settings.network === 'EvAğı',
      on: (ev, c) => {
        if (ev.type === 'wifi-connect' && !ev.ok) c.warn('Şifre kabul edilmedi. Küçük harflerle <b>evagi2024</b> yazın.');
        if (ev.type === 'wifi-connect' && ev.ok && ev.name !== 'EvAğı') c.note('Bağlandınız ama bu ağ sizin değil. Bağlantıyı kesip EvAğı\'na bağlanın.');
        return ev.type === 'wifi-connect' && ev.ok && ev.name === 'EvAğı';
      },
      done: 'İnternete bağlandınız. Görev çubuğunda 📶 simgesi göründü.',
    },
    {
      title: 'Şifresiz ağlara dikkat',
      html: '<p>Listede <b>Kafe_Ücretsiz</b> gibi şifresiz (açık) ağlar da var. Bu ağlarda <b>bankacılık işlemi yapmayın, şifre girmeyin</b>: aynı ağdaki başkaları görebilir.</p>',
    },
    {
      title: 'Saati düzeltin',
      html: '<p>Görev çubuğundaki saat yanlış! Soldan <b>🕒 Saat ve dil</b>\'e gidin ve <b>Saati otomatik olarak ayarla</b> anahtarını açın.</p>',
      setup: (c) => c.d.ensure('settings'),
      check: (c) => c.d.settings.autoTime,
      on: (ev) => ev.type === 'toggle' && ev.key === 'autoTime' && ev.on,
      done: 'Saat düzeldi. Saat yanlışsa bazı internet siteleri açılmayabilir; bu ayar hep açık kalsın.',
    },
    {
      title: 'Saat dilimi',
      html: '<p>Londra\'daki yakınınızın saatini merak ettiniz. Aynı sayfadaki <b>Saat dilimi</b> listesinden <b>Londra</b>\'yı seçin, sağ alttaki saatin değiştiğini görün, sonra yeniden <b>İstanbul</b> yapın.</p>',
      setup: (c) => { const w = c.d.ensure('settings'); w.api.go('time'); },
      on: (ev, c) => {
        if (ev.type === 'tz' && /Londra/.test(ev.tz)) { c.s.l = true; c.note('Sağ alttaki saat geri gitti. Şimdi yeniden İstanbul.'); }
        return !!c.s.l && ev.type === 'tz' && /İstanbul/.test(ev.tz);
      },
      done: 'Saat yanlış gösteriyorsa bir sebebi de yanlış saat dilimidir. Türkiye için <b>İstanbul</b> seçili olmalı.',
    },
    {
      title: 'Yazıları büyütün',
      html: '<p>Soldan <b>♿ Erişilebilirlik</b>\'e gidin. <b>Metin boyutu</b> çubuğunu <b>%130</b>\'a getirip <b>Uygula</b>\'ya tıklayın.</p>',
      setup: (c) => c.d.ensure('settings'),
      on: (ev) => ev.type === 'text-scale' && ev.value >= 120,
      done: 'Bütün yazılar büyüdü. Gözünüzü yormayan boyutu seçebilirsiniz.',
    },
    {
      title: 'Güncelleştirmeler',
      html: `<p>Soldan <b>🔄 Windows Update</b>\'e gidin ve <b>Güncelleştirmeleri denetle</b>\'ye tıklayın.</p>
        <p class="mut">Güncelleştirmeyi bilgisayar kendisi indirir; bitirmek için yeniden başlatmak gerekir. İşinizi kaydedin, sonra <b>Şimdi yeniden başlat</b>\'a tıklayın. Başlat → Güç menüsünde <b>Güncelleştir ve kapat</b> ya da <b>Güncelleştir ve yeniden başlat</b> yazıyorsa onu seçin; bu normaldir.</p>
        <p class="mut">Açılırken ya da kapanırken <b>“Güncelleştirmeler yapılıyor, bilgisayarınızı kapatmayın”</b> yazarsa sabırla bekleyin. Güç düğmesine basmayın, fişi çekmeyin; bilgisayar bozulabilir.</p>`,
      setup: (c) => c.d.ensure('settings'),
      on: (ev) => ev.type === 'update-check',
      done: 'Güncelleştirmeler güvenlik açıklarını kapatır; ertelemeyin. Bilgisayar “yeniden başlatılması gerekiyor” derse işiniz bitince yeniden başlatın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Ayarlar\'ı kullanmayı öğrendiniz.</p>' },
  ],
};
