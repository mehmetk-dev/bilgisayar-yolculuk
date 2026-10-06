// 5. hafta: masaüstü, Başlat menüsü, görev çubuğu, Alt+Tab
// 6. hafta: Dosya Gezgini ve USB bellek
import { K, desktopReady, put, PIC } from './common.js';

export const masaustu = {
  id: 'masaustu', icon: '🖥', title: 'Masaüstü, Başlat ve görev çubuğu', minutes: 20, stage: 'desktop',
  desc: 'Başlat menüsünden ve aramayla program açma, görev çubuğu, masaüstünü gösterme, Alt+Tab, ses simgesi.',
  summary: [
    ['⊞ Başlat', 'Bütün programlar; açınca hemen yazarak arayabilirsiniz'],
    ['Görev çubuğu', 'Açık programlar: tıklayınca öne gelir ya da küçülür'],
    ['Sağ alt köşe', 'Masaüstünü göster'],
    ['Alt + Tab', 'Açık pencereler arasında geç'],
    ['🔊 / 📶 simgeleri', 'Ses düzeyi ve Wi-Fi'],
  ],
  steps: [
    {
      title: 'Masaüstünün parçaları',
      html: `<ul class="big-list"><li><b>Simgeler</b>: sol taraftaki küçük resimler.</li><li><b>Görev çubuğu</b>: en alttaki şerit.</li><li><b>⊞ Başlat</b>: görev çubuğunun ortasında; bütün programlar burada.</li><li><b>🔍 Ara</b>: program ya da dosya aramak için.</li><li>Sağ altta <b>saat</b>, <b>ses 🔊</b> ve <b>internet 📶</b> simgeleri.</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Başlat\'tan program açın',
      html: '<p>⊞ <b>Başlat</b>\'a tıklayın, açılan menüde <b>Paint</b>\'e tıklayın.</p>',
      mouse: '🖱 Başlat → Paint',
      on: (ev) => ev.type === 'start-open' && ev.app === 'paint',
      done: 'Masaüstünde simgesi olmayan programları da Başlat menüsünde bulursunuz.',
    },
    {
      title: 'Yazarak arayın',
      html: `<p>Programı aramanın en kolay yolu: <b>Başlat'ı açın ve hemen yazın</b>.</p><ol class="steps"><li>⊞ Başlat'a tıklayın.</li><li>Klavyeden <b>hesap</b> yazın.</li><li>${K('Enter')}'a basın.</li></ol>`,
      on: (ev, c) => {
        if (ev.type === 'start-search' && ev.text.length > 1) c.note('Yazdıkça sonuçlar değişiyor. En üstteki “En iyi eşleşme”yi açmak için Enter.');
        return ev.type === 'start-open' && ev.app === 'calc' && ev.via === 'search';
      },
      done: 'Gerçek bilgisayarda da ⊞ tuşuna basıp yazmaya başlamak en hızlı yoldur.',
    },
    {
      title: 'Görev çubuğu',
      html: '<p>Şimdi iki program açık. Görev çubuğunda simgelerinin altında küçük bir çizgi var. <b>🎨 Paint</b> simgesine tıklayın: Paint öne gelir.</p>',
      setup: (c) => { c.d.ensure('paint'); c.d.ensure('calc'); },
      on: (ev) => ev.type === 'taskbar-click' && ev.app === 'paint',
      done: 'Öndeki programın simgesine bir daha tıklarsanız o program küçülür.',
    },
    {
      title: 'Masaüstünü gösterin',
      html: '<p>Görev çubuğunun <b>en sağ köşesindeki ince çizgiye</b> (saatin sağı) tıklayın: bütün pencereler küçülür. Bir daha tıklayınca geri gelirler.</p>',
      mouse: '🖱 Sağ alt köşe',
      on: (ev, c) => {
        if (ev.type === 'show-desktop' && ev.hidden) { c.s.h = true; c.note('Masaüstü göründü. Şimdi aynı yere bir daha tıklayın.'); }
        return !!c.s.h && ev.type === 'show-desktop' && !ev.hidden;
      },
      done: 'Masaüstündeki bir dosyaya hızlıca ulaşmak için kullanışlıdır.',
    },
    {
      title: 'Alt + Tab',
      html: `<p>Pencereler arasında klavyeyle geçmek için:</p><ol class="steps"><li>${K('Alt')} tuşunu <b>basılı tutun</b>,</li><li>${K('Tab')} tuşuna bir kez basın,</li><li>ikisini de bırakın.</li></ol>
        <p class="mut">Gerçek bilgisayarda bu kısayol, tarayıcıdan da çıkıp başka bir programa geçebilir. Öyle olursa yine ${K('Alt', 'Tab')} ile bu sayfaya dönün.</p>`,
      combo: ['AltLeft', 'Tab'],
      manual: '✔ Denedim',
      setup: (c) => { c.d.ensure('paint'); c.d.ensure('calc'); },
      on: (ev) => ev.type === 'alttab',
      done: 'Alt + Tab, açık programlar arasında geçmenin en hızlı yoludur.',
    },
    {
      title: 'Ses düzeyi',
      html: '<p>Sağ alttaki <b>🔊</b> simgesine tıklayın. Açılan küçük pencerede ses çubuğunu sürükleyerek sesi değiştirin.</p>',
      mouse: '🖱 Sağ alttaki 🔊',
      on: (ev, c) => {
        if (ev.type === 'quick' && ev.open) c.note('Şimdi 🔊 yanındaki çubuğu sürükleyin.');
        return ev.type === 'setting' && ev.key === 'volume';
      },
      done: 'Ses düzeyi değişti. Hoparlörden ses gelmiyorsa ilk bakılacak yer burasıdır.',
    },
    {
      title: 'Pencereleri kapatın',
      html: '<p>Açık pencerelerin hepsini <b>✕</b> ile kapatın. Kaydetmek isteyip istemediğiniz sorulursa <b>Kaydetme</b> deyin.</p>',
      setup: (c) => c.d.closeMenus(),
      check: (c) => !c.d.wins.length,
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Masaüstünü, Başlat menüsünü ve görev çubuğunu öğrendiniz.</p>' },
  ],
};

const exFolder = (c) => c.d.find('explorer')?.api.folder;

export const dosyalar = {
  id: 'dosyalar', icon: '📁', title: 'Dosya Gezgini ve USB bellek', minutes: 30, stage: 'desktop',
  desc: 'Klasör oluşturma, ad değiştirme, taşıma, kopyalama, silme, Geri Dönüşüm Kutusu, arama, USB bellek.',
  setup: (c) => put(c, 'docs', 'torun fotoğrafı.jpg', 'file', PIC('👧', '#f8bbd0', '#ce93d8')),
  summary: [
    ['📁 Dosya Gezgini', 'Bilgisayardaki bütün dosya ve klasörler'],
    ['＋ Yeni klasör', 'Boş klasör; adını hemen yazın'],
    ['F2', 'Seçili dosyanın adını değiştir'],
    ['Sürükle-bırak', 'Dosyayı klasöre taşı (USB\'ye sürüklemek kopyalar)'],
    ['Ctrl + C → Ctrl + V', 'Dosyayı kopyala-yapıştır'],
    ['Delete', 'Sil (Geri Dönüşüm Kutusu\'na gider)'],
    ['♻ Geri yükle', 'Silineni eski yerine geri koyar'],
    ['⏏ Çıkar', 'USB belleği çekmeden önce'],
  ],
  steps: [
    {
      title: 'Dosya ve klasör nedir?',
      html: `<ul class="big-list"><li><b>Dosya</b>: bir yazı, bir fotoğraf, bir şarkı… Bir <b>kâğıt</b> gibi düşünün.</li><li><b>Klasör</b>: dosyaları bir arada tutan <b>dosya klasörü</b>. İçine başka klasör de konabilir.</li><li><b>Dosya Gezgini</b>: bu klasörlerin hepsini gösteren program. Simgesi 📁.</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Dosya Gezgini\'ni açın',
      html: '<p>Görev çubuğundaki <b>📁</b> simgesine tıklayın.</p>',
      mouse: '🖱 Görev çubuğundaki 📁',
      check: (c) => !!c.d.find('explorer'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'explorer',
      done: 'Solda klasörlerin listesi, ortada seçili klasörün içi var.',
    },
    {
      title: 'Belgeler klasörüne gidin',
      html: '<p>Soldaki listeden <b>📄 Belgeler</b>\'e tıklayın.</p>',
      setup: (c) => c.d.ensure('explorer'),
      check: (c) => exFolder(c) === 'docs',
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
      done: 'Yazılarınız genellikle Belgeler klasöründe durur.',
    },
    {
      title: 'Yeni klasör oluşturun',
      html: `<ol class="steps"><li>Üstteki <b>＋ Yeni klasör</b>\'e tıklayın.</li><li>Adı mavi seçili gelir: hemen <b>Torunlarım</b> yazın.</li><li>${K('Enter')}'a basın.</li></ol>`,
      setup: (c) => { const w = c.d.ensure('explorer'); if (w.api.folder !== 'docs') w.api.go('docs'); },
      check: (c) => !!c.d.fs.find('docs', 'Torunlarım'),
      on: (ev, c) => {
        if (ev.type === 'new-folder') c.note('Klasör oluştu. Adı seçiliyken <b>Torunlarım</b> yazıp Enter\'a basın.');
        return ev.type === 'rename' && /torun/i.test(ev.name);
      },
      hint: 'Adı yazmadan Enter\'a bastıysanız klasör “Yeni klasör” adıyla kalır. Ona bir kez tıklayıp <kbd>F2</kbd>\'ye basın ve yeniden yazın.',
      done: 'Klasörünüz hazır.',
    },
    {
      title: 'Ad değiştirin: F2',
      html: `<ol class="steps"><li><b>alışveriş listesi</b> dosyasına <b>bir kez</b> tıklayın.</li><li>${K('F2')} tuşuna basın (ya da sağ tık → Yeniden adlandır).</li><li><b>market listesi</b> yazıp ${K('Enter')}'a basın.</li></ol>`,
      combo: ['F2'],
      setup: (c) => { const w = c.d.ensure('explorer'); if (w.api.folder !== 'docs') w.api.go('docs'); },
      on: (ev) => ev.type === 'rename' && /alışveriş/.test(ev.old || ''),
      done: 'Dosyanın adı değişti; içindeki yazı aynı kaldı.',
    },
    {
      title: 'Sürükleyerek taşıyın',
      html: '<p><b>torun fotoğrafı</b> dosyasını tutup <b>Torunlarım</b> klasörünün üzerine sürükleyin. Klasör maviye boyanınca bırakın.</p>',
      mouse: '🖱 Fotoğrafı klasörün üzerine bırakın',
      setup: (c) => {
        const w = c.d.ensure('explorer');
        if (w.api.folder !== 'docs') w.api.go('docs');
        put(c, 'docs', 'Torunlarım', 'folder');
      },
      on: (ev, c) => {
        if (ev.type === 'drop' && ev.name === 'torun fotoğrafı.jpg' && /torun/i.test(ev.toName || '')) return true;
        if (ev.type === 'file-paste' && ev.name === 'torun fotoğrafı.jpg') return true;
        if (ev.type === 'drop' && ev.name === 'torun fotoğrafı.jpg') c.note('Klasörün <b>tam üzerine</b> bırakın.');
        return false;
      },
      done: 'Fotoğraf klasöre taşındı.',
    },
    {
      title: 'Klasörü açın',
      html: '<p><b>Torunlarım</b> klasörüne <b>çift tıklayın</b>. Fotoğraf içinde mi?</p>',
      on: (ev) => ev.type === 'nav' && /torun/i.test(ev.name),
      done: 'Evet! Adres çubuğunda da nerede olduğunuz yazıyor: Belgeler › Torunlarım',
    },
    {
      title: 'Geri dönün',
      html: '<p>Sol üstteki <b>←</b> (Geri) okuna tıklayın. Bir önceki klasöre, Belgeler\'e dönersiniz.</p>',
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
    },
    {
      title: 'Kopyalayın',
      html: `<ol class="steps"><li><b>telefon numaraları</b> dosyasına bir kez tıklayın.</li><li>Üstteki <b>⧉ Kopyala</b>\'ya tıklayın (ya da ${K('Ctrl', 'C')}).</li><li>Soldan <b>🖥 Masaüstü</b>\'ne gidin.</li><li><b>📋 Yapıştır</b>\'a tıklayın (ya da ${K('Ctrl', 'V')}).</li></ol>`,
      setup: (c) => { const w = c.d.ensure('explorer'); if (w.api.folder !== 'docs') w.api.go('docs'); },
      on: (ev, c) => {
        if (ev.type === 'file-clip' && ev.op === 'copy') c.note('Kopyalandı. Şimdi soldan <b>Masaüstü</b>\'ne gidip <b>Yapıştır</b>\'a tıklayın.');
        return ev.type === 'file-paste' && ev.op === 'copy';
      },
      done: 'Dosyanın bir kopyası oluştu; asıl dosya Belgeler\'de duruyor.',
    },
    {
      title: 'Silin',
      html: `<p>Yapıştırdığınız kopyayı seçin ve ${K('Delete')} tuşuna basın (ya da üstteki 🗑 Sil).</p>`,
      combo: ['Delete'],
      on: (ev) => ev.type === 'delete',
      done: 'Dosya silindi… ama tamamen değil!',
    },
    {
      title: 'Geri Dönüşüm Kutusu\'ndan geri yükleyin',
      html: '<p>Soldan <b>🗑 Geri Dönüşüm Kutusu</b>\'na gidin. Sildiğiniz dosyayı seçin ve üstteki <b>♻ Geri yükle</b>\'ye tıklayın.</p>',
      setup: (c) => c.d.ensure('explorer'),
      on: (ev) => ev.type === 'restore',
      done: (c) => 'Dosya eski yerine döndü. Yanlışlıkla silmeler için bu kutu bir can simididir. Kutuyu <b>boşaltırsanız</b> içindekiler tamamen silinir.',
    },
    {
      title: 'Arayın',
      html: '<p>Soldan <b>Belgeler</b>\'e gidin. Sağ üstteki <b>Ara</b> kutusuna tıklayıp <b>fatura</b> yazın.</p>',
      setup: (c) => c.d.ensure('explorer'),
      on: (ev, c) => {
        if (ev.type === 'ex-search' && /fatura/i.test(ev.text) && !ev.results.length) c.note('Burada bulunamadı. Önce soldan <b>Belgeler</b>\'e gidip yeniden arayın.');
        return ev.type === 'ex-search' && /fatura/i.test(ev.text) && ev.results.length > 0;
      },
      done: 'Faturalar klasörünün içindeki dosyalar da bulundu. Bir dosyanın nerede olduğunu unuttuğunuzda arama kurtarır.',
    },
    {
      title: 'USB bellek',
      html: `<p><b>USB bellek</b> (flaş bellek), dosyaları cebinizde taşımanızı sağlar. Bilgisayarın USB girişine takılır.</p>
        <button type="button" class="btn primary usb-btn">💾 USB belleği bilgisayara tak</button>`,
      setup: (c) => {
        c.d.ensure('explorer');
        document.querySelector('.usb-btn').onclick = () => c.d.plugUsb();
      },
      check: (c) => c.d.fs.usb,
      on: (ev) => ev.type === 'usb' && ev.on,
      done: 'Sağ altta bir bildirim çıktı ve soldaki listeye <b>USB Bellek (E:)</b> eklendi.',
    },
    {
      title: 'Fotoğrafı USB\'ye kopyalayın',
      html: '<p>Soldan <b>Resimler</b>\'e gidin. <b>tatil</b> fotoğrafını tutup soldaki <b>💾 USB Bellek (E:)</b>\'nin üzerine sürükleyin.</p><p class="mut">Farklı bir sürücüye (USB) sürükleyince dosya taşınmaz, <b>kopyalanır</b>.</p>',
      setup: (c) => { if (!c.d.fs.usb) c.d.plugUsb(); c.d.ensure('explorer'); },
      on: (ev) => (ev.type === 'drop' && ev.to === 'usb') || (ev.type === 'file-paste' && ev.to === 'usb'),
      done: 'Fotoğraf USB belleğe kopyalandı; aslı Resimler\'de duruyor.',
    },
    {
      title: 'Güvenle çıkarın',
      html: '<p>USB belleği çekmeden önce: Dosya Gezgini\'nde USB\'yi açıp üstteki <b>⏏ Çıkar</b>\'a ya da görev çubuğunun sağındaki <b>💾</b> simgesine tıklayın.</p><p>“Artık çıkarılabilir” yazısını görünce çekin.</p>',
      setup: (c) => { if (!c.d.fs.usb) c.d.plugUsb(); },
      on: (ev) => ev.type === 'usb' && !ev.on,
      done: 'Bu adımı atlayıp çekerseniz, yazılmakta olan dosya bozulabilir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosya ve klasörlerle çalışmayı öğrendiniz.</p>' },
  ],
};
