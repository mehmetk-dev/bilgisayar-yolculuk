// 5. hafta ek dersleri: Hesap Makinesi, masaüstünü düzenleme, Başlat menüsünü keşif, oyunlarla pratik, masaüstü haritası
import { K, desktopReady, put, PIC } from './common.js';
import { info, ayir, sec } from './kalip.js';

const near = (a, b) => Math.abs(a - b) < 0.001;
const tl = (v) => v.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

// Hesap Makinesi'nde istenen sonucu bulan adım
function hesap({ title, html, value, hint, done }) {
  return {
    title, hint, html,
    setup: (c) => c.d.ensure('calc'),
    on: (ev, c) => {
      if (ev.type !== 'calc-result') return false;
      if (near(ev.value, value)) return true;
      c.warn(`Sonuç <b>${tl(ev.value)}</b> çıktı, olmadı. ${K('C')} ile silip yeniden deneyin.`);
      return false;
    },
    done: done || `Sonuç: <b>${tl(value)}</b>.`,
  };
}

export const hesapMakinesi = {
  id: 'hesap-makinesi', icon: '🧮', title: 'Hesap Makinesi ile günlük hesaplar', minutes: 25, stage: 'desktop',
  desc: 'Market toplamı, fatura, kişi başı pay, aylık gider, indirim (%) ve para üstü. Hatalı rakamı ⌫ ile silmek, C ile sıfırlamak.',
  summary: [
    ['+ − × ÷', 'Toplama, çıkarma, çarpma, bölme'],
    ['=', 'Sonucu gösterir (klavyede Enter)'],
    [', (virgül)', 'Kuruşlu sayılar: 32,50'],
    ['⌫', 'Son yazılan rakamı siler'],
    ['C', 'Her şeyi sıfırlar'],
    ['2000 − 20 % =', 'Yüzde 20 indirimli fiyat'],
    ['Klavye', 'Rakamlar ve + − * / tuşları da çalışır'],
  ],
  steps: [
    {
      title: 'Hesap Makinesi',
      html: `<p>Hesap Makinesi, gerçek bir hesap makinesi gibi çalışır. Düğmelere fareyle tıklayabilir ya da klavyedeki rakamları kullanabilirsiniz.</p>
        <ul class="big-list"><li><b>×</b> çarpma, <b>÷</b> bölme. Klavyede <kbd>*</kbd> ve <kbd>/</kbd>.</li><li><b>,</b> kuruş için: 32,50.</li><li><b>⌫</b> son rakamı siler, <b>C</b> her şeyi sıfırlar.</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.ensure('calc'); },
    },
    hesap({ title: 'Market toplamı', html: '<p>Marketten 45 TL\'lik peynir, 32,50 TL\'lik zeytin ve 18 TL\'lik ekmek aldınız. Toplam ne kadar?</p>', value: 95.5, hint: '45 + 32,5 + 18 = . Arka arkaya + basabilirsiniz; en sonda =.', done: 'Toplam 95,50 TL.' }),
    hesap({ title: 'Faturalar', html: '<p>Elektrik faturası 412,50 TL, su faturası 187,30 TL. İkisi birden ne kadar eder?</p>', value: 599.8, done: 'Toplam 599,80 TL.' }),
    hesap({ title: 'Kişi başı', html: '<p>4 kardeş, annelerine 1.200 TL\'lik bir hediye alacak. Kişi başı ne kadar düşer?</p>', value: 300, hint: '1200 ÷ 4 = . Bölme düğmesi ÷ işaretlidir.', done: 'Kişi başı 300 TL.' }),
    hesap({ title: 'Bir yıllık gider', html: '<p>Aylık internet faturası 750 TL. Bir yılda (12 ay) ne kadar ödenir?</p>', value: 9000, hint: '750 × 12 = .', done: 'Yılda 9.000 TL.' }),
    hesap({ title: 'İndirim', html: '<p>2.000 TL\'lik buzdolabında <b>%20 indirim</b> var. İndirimli fiyat ne?</p>', value: 1600, hint: '2000 − 20 % = . Önce 2000, sonra −, sonra 20, sonra % düğmesi, en son =.', done: 'İndirimli fiyat 1.600 TL; 400 TL kazandınız.' }),
    hesap({ title: 'Para üstü', html: '<p>137,50 TL\'lik alışverişe 200 TL verdiniz. Ne kadar para üstü almalısınız?</p>', value: 62.5, done: 'Para üstü 62,50 TL.' }),
    {
      title: 'Hatayı düzeltin',
      html: `<p>Bu sefer bilerek yanlış yazalım: <b>1259</b> yazın. Son rakam yanlış oldu: <b>⌫</b> ile silin, yerine <b>0</b> yazın ve <b>1250 + 250 =</b> yapın.</p>`,
      setup: (c) => c.d.ensure('calc'),
      on: (ev, c) => {
        if (ev.type === 'calc' && ev.key === '⌫') c.s.back = true;
        if (ev.type !== 'calc-result') return false;
        if (!c.s.back) { c.warn('Bu sefer ⌫ düğmesini kullanmayı deneyin: 1259 yazın, ⌫ ile 9\'u silin.'); return false; }
        return near(ev.value, 1500);
      },
      done: 'Bütün sayıyı silmeye gerek yok: ⌫ son rakamı siler.',
    },
    {
      title: 'Klavyeyle hesap',
      html: `<p>Hesap Makinesi penceresine bir kez tıklayın, sonra yalnızca <b>klavyeyi</b> kullanarak <b>25 × 4</b> hesaplayın: ${K('2')} ${K('5')} ${K('*')} ${K('4')} ${K('Enter')}.</p>`,
      setup: (c) => c.d.ensure('calc'),
      hint: 'Çarpma işareti klavyede * tuşudur (0\'ın sağında). Sağda sayı tuşları varsa oradaki * ve Enter da olur.',
      on: (ev) => ev.type === 'calc-result' && near(ev.value, 100),
      done: 'Çok sayı yazarken klavye fareden hızlıdır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Günlük hesapları kendiniz yapabilirsiniz:</p>' },
  ],
};

export const masaustuDuzen = {
  id: 'masaustu-duzen', icon: '🗂', title: 'Masaüstünü düzenleyin', minutes: 20, stage: 'desktop',
  desc: 'Masaüstünde sağ tıkla yeni klasör, dosyaları içine taşımak, simgeleri büyütmek ve taşımak, arka planı değiştirmek, çöpü boşaltmak.',
  setup: (c) => {
    put(c, 'desktop', 'fatura.pdf');
    put(c, 'desktop', 'tatil fotoğrafı.jpg', 'file', PIC('🏖', '#4fc3f7', '#ffe082'));
    put(c, 'desktop', 'eski not.txt', 'file', 'Bu not artık gereksiz.');
  },
  summary: [
    ['Masaüstüne sağ tık → Yeni → Klasör', 'Masaüstünde yeni klasör'],
    ['Sağ tık → Görünüm', 'Büyük / orta boy simgeler'],
    ['Simgeyi sürüklemek', 'Yerini değiştirir'],
    ['Sağ tık → Kişiselleştir', 'Arka plan'],
    ['Geri Dönüşüm Kutusu\'na sağ tık', 'Boşalt'],
  ],
  steps: [
    {
      title: 'Dağınık masaüstü',
      html: '<p>Masaüstüne birkaç dosya bırakılmış. Masaüstü dağınık olunca aradığımızı bulmak zorlaşır. Bu derste masaüstünü toparlayacağız.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Yeni klasör',
      html: '<p>Masaüstünde <b>boş bir yere sağ tıklayın</b> → <b>Yeni</b> → <b>📁 Klasör</b>. Adı seçiliyken <b>Önemli</b> yazıp Enter\'a basın.</p>',
      mouse: '🖱 Boş yere sağ tık → Yeni → Klasör',
      hint: 'Yeni\'nin üzerine gelince yanında küçük bir menü açılır; oradaki Klasör\'e tıklayın.',
      check: (c) => !!c.d.fs.find('desktop', 'Önemli'),
      on: (ev, c) => ev.type === 'rename' && !!c.d.fs.find('desktop', 'Önemli'),
      done: 'Masaüstünde klasörünüz hazır.',
    },
    {
      title: 'Dosyaları klasöre koyun',
      html: '<p><b>fatura</b> ve <b>tatil fotoğrafı</b> dosyalarını sürükleyip <b>Önemli</b> klasörünün üzerine bırakın.</p>',
      mouse: '🖱 Sürükle, klasörün üzerine bırak',
      on: (ev, c) => {
        if (ev.type !== 'fs') return false;
        const k = c.d.fs.find('desktop', 'Önemli');
        const n = ['fatura.pdf', 'tatil fotoğrafı.jpg'].filter((f) => k && c.d.fs.find(k.id, f)).length;
        if (n === 1) c.note('Biri tamam, şimdi öbürü.');
        return n === 2;
      },
      done: 'Masaüstü sadeleşti.',
    },
    {
      title: 'Eski notu atın',
      html: '<p><b>eski not</b> dosyasını Geri Dönüşüm Kutusu\'na sürükleyin.</p>',
      on: (ev) => (ev.type === 'drop' && ev.to === 'recycle') || (ev.type === 'delete' && /eski not/.test(ev.name)),
    },
    {
      title: 'Simgeleri büyütün',
      html: '<p>Simgeler küçük mü geliyor? Masaüstünde boş yere sağ tıklayın → <b>Görünüm</b> → <b>Büyük simgeler</b>.</p>',
      on: (ev) => ev.type === 'menu-cmd' && ev.cmd === 'big',
      done: 'Simgeler büyüdü. Geri almak için: Görünüm → Orta boy simgeler.',
    },
    {
      title: 'Simgenin yerini değiştirin',
      html: '<p><b>Önemli</b> klasörünü tutup masaüstünün başka bir boş yerine (örneğin sağ tarafa) sürükleyin.</p>',
      on: (ev) => ev.type === 'icon-move',
      done: 'Simgeleri istediğiniz gibi dizebilirsiniz.',
    },
    {
      title: 'Arka planı değiştirin',
      html: '<p>Boş yere sağ tıklayın → <b>Kişiselleştir</b>. Açılan Ayarlar\'da beğendiğiniz bir arka plan resmine tıklayın, sonra Ayarlar\'ı kapatın.</p>',
      on: (ev, c) => {
        if (ev.type === 'wallpaper') c.s.w = true;
        if (c.s.w && !c.d.find('settings')) return true;
        if (ev.type === 'wallpaper') c.note('Arka plan değişti. Şimdi Ayarlar penceresini ✕ ile kapatın.');
        return false;
      },
    },
    {
      title: 'Çöpü boşaltın',
      html: '<p>Masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'na sağ tıklayın → <b>Geri Dönüşüm Kutusunu boşalt</b>. Çıkan soruya <b>Evet</b> deyin.</p>',
      hint: 'Boşaltılan dosyalar geri gelmez. Emin değilseniz önce kutuyu açıp içine bakın.',
      on: (ev) => ev.type === 'recycle-empty',
      done: 'Kutu boşaldı; içindekiler tamamen silindi.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Masaüstünüz derli toplu:</p>' },
  ],
};

export const baslatKesif = {
  id: 'baslat-kesif', icon: '⊞', title: 'Başlat menüsünü keşfedin', minutes: 20, stage: 'desktop',
  desc: 'Başlat menüsündeki programlar, aramayla açma, görev çubuğundaki 🔍, güç menüsü, Esc ile kapatma, Ayarlar ve Dosya Gezgini.',
  summary: [
    ['⊞ Başlat', 'Programlar, arama, güç düğmesi'],
    ['Başlat açıkken yazmak', 'Arama yapar'],
    ['🔍 Ara', 'Görev çubuğundan doğrudan arama'],
    ['Esc', 'Başlat\'ı kapatır'],
    ['⏻ Güç', 'Uyku, Kapat, Yeniden başlat'],
    ['⊞ + E / ⊞ + I', 'Gerçek bilgisayarda Dosya Gezgini / Ayarlar'],
  ],
  steps: [
    {
      title: 'Başlat menüsü',
      html: '<p>Başlat menüsü bilgisayarın “ana kapısı”dır: bütün programlar, arama ve güç düğmesi buradadır. Bu derste Başlat\'tan farklı programlar açacağız.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Açıp kapatmak',
      html: `<p>⊞ <b>Başlat</b>\'ı açın, sonra klavyedeki ${K('Esc')} tuşuyla kapatın.</p>`,
      on: (ev, c) => {
        if (ev.type === 'start' && ev.open) { c.s.o = true; c.note('Açıldı. Şimdi Esc.'); }
        return !!c.s.o && ev.type === 'start' && !ev.open;
      },
      done: 'Esc, açılan menüleri kapatmanın en kolay yoludur. Başlat\'a bir kez daha tıklamak da kapatır.',
    },
    {
      title: 'Ayarlar',
      html: '<p>Başlat menüsündeki <b>⚙ Ayarlar</b>\'a tıklayın.</p>',
      on: (ev) => ev.type === 'start-open' && ev.app === 'settings',
      done: 'Bilgisayarın bütün ayarları burada. 7. haftada ayrıntılı göreceğiz. Şimdi Ayarlar\'ı kapatın.',
    },
    {
      title: 'Dosya Gezgini\'ni arayın',
      html: '<p>Başlat\'ı açın ve <b>dosya</b> yazın. Çıkan <b>Dosya Gezgini</b>\'ni Enter ile açın.</p>',
      on: (ev) => ev.type === 'start-open' && ev.app === 'explorer',
    },
    {
      title: 'Görev çubuğundan arama',
      html: '<p>Başlat\'ın yanındaki <b>🔍 Ara</b> kutusuna tıklayın, <b>fotoğraf</b> yazıp <b>Fotoğraflar</b> uygulamasını açın.</p>',
      on: (ev) => ev.type === 'start-open' && ev.app === 'photos',
      done: 'Arama kutusu Başlat\'la aynı işi yapar.',
    },
    {
      title: 'Bir oyun bulun',
      html: '<p>Arayarak <b>Mayın Tarlası</b>\'nı açın. İpucu: <b>oyun</b> yazınca bütün oyunlar listelenir.</p>',
      on: (ev) => ev.type === 'start-open' && ev.app === 'mayin',
      done: 'Programın tam adını bilmeseniz de ne işe yaradığını yazarak bulabilirsiniz.',
    },
    {
      title: 'Güç menüsü',
      html: '<p>Başlat\'ı açın ve sağ alttaki <b>⏻ Güç</b> düğmesine tıklayın. Üç seçeneği görün, ama <b>hiçbirine basmayın</b>: Esc ile kapatın.</p>',
      on: (ev) => ev.type === 'power-menu',
      done: 'Uyku, Kapat, Yeniden başlat burada.',
    },
    {
      title: 'Hepsini kapatın',
      html: '<p>Açtığınız bütün pencereleri kapatın.</p>',
      setup: (c) => c.d.closeMenus(),
      check: (c) => !c.d.wins.length,
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
    },
    {
      title: 'Gerçek bilgisayarda',
      html: `<p>Gerçek Windows'ta Başlat'ı açmanın en kısa yolu klavyedeki ${K('⊞ Windows')} tuşudur. Birkaç kısayol daha:</p>
        <ul class="big-list"><li>${K('⊞', 'E')}: Dosya Gezgini</li><li>${K('⊞', 'I')}: Ayarlar</li><li>${K('⊞', 'D')}: Masaüstünü göster</li><li>${K('⊞', 'L')}: Bilgisayarı kilitle (kalkarken)</li></ul>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Başlat menüsünü keşfettiniz:</p>' },
  ],
};

export const oyunlar = {
  id: 'oyunlar', icon: '🎮', title: 'Oyunlarla pratik', minutes: 25, stage: 'desktop',
  desc: 'Mola dersi: Mayın Tarlası (tıklama, sağ tıkla bayrak) ve Kart Dizme (sürükle-bırak). Pencereler arası geçiş ve kapatma.',
  summary: [
    ['Mayın Tarlası: sol tık', 'Kareyi açar; rakam, çevresindeki mayın sayısıdır'],
    ['Mayın Tarlası: sağ tık', 'Mayın olduğunu düşündüğünüz kareye bayrak'],
    ['Kart Dizme', 'Kartları sürükleyerek sıraya dizin'],
    ['Görev çubuğu / Alt + Tab', 'Oyunlar arasında geçiş'],
  ],
  steps: [
    {
      title: 'Oyun da bir alıştırmadır',
      html: '<p>Bilgisayar oyunları fareyi kullanmanın en eğlenceli alıştırmasıdır: tıklama, sağ tıklama ve sürükleme. Bu derste iki küçük oyun oynayacağız.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Mayın Tarlası\'nı açın',
      html: '<p>Başlat\'ı açıp arayarak <b>Mayın Tarlası</b>\'nı açın.</p>',
      on: (ev) => ev.type === 'app-open' && ev.app === 'mayin',
    },
    {
      title: 'Nasıl oynanır?',
      html: '<ul class="big-list"><li>Bir kareye <b>sol tıklayın</b>: açılır.</li><li>Rakam, o karenin çevresindeki 8 karede <b>kaç mayın</b> olduğunu söyler.</li><li>Mayın olduğunu düşündüğünüz kareye <b>sağ tıklayın</b>: 🚩 bayrak konur.</li></ul><p>Şimdi birkaç kare açın.</p>',
      setup: (c) => c.d.ensure('mayin'),
      on: (ev, c) => {
        if (ev.type === 'mine-lose') c.note('Mayına bastınız; olur böyle şeyler! 🙂 yüzüne tıklayıp yeniden başlayın.');
        if (ev.type === 'mine-reveal') c.s.n = Math.max(c.s.n || 0, ev.opened);
        return (c.s.n || 0) >= 10 || ev.type === 'mine-win';
      },
      done: 'Güzel gidiyor.',
    },
    {
      title: 'Bayrak koyun',
      html: '<p>Mayın olduğunu düşündüğünüz bir kareye <b>sağ tıklayıp</b> bayrak koyun. Emin değilseniz de deneyin; bayrağı bir sağ tıkla kaldırabilirsiniz.</p>',
      setup: (c) => c.d.ensure('mayin'),
      on: (ev) => ev.type === 'mine-flag' && ev.on,
      done: 'Bayraklı kare yanlışlıkla açılmaz.',
    },
    {
      title: 'Küçültün',
      html: '<p>Oyunu kapatmadan <b>küçültün</b> (—).</p>',
      setup: (c) => c.d.ensure('mayin'),
      on: (ev) => ev.type === 'win-min' && ev.app === 'mayin',
    },
    {
      title: 'Kart Dizme\'yi açın',
      html: '<p>Şimdi arayarak <b>Kart Dizme</b> oyununu açın.</p>',
      on: (ev) => ev.type === 'app-open' && ev.app === 'kartlar',
    },
    {
      title: 'Kartları dizin',
      html: '<p>Kartları tutup <b>sırayla</b> yerlerine sürükleyin.</p>',
      mouse: '🖱 Tut, taşı, bırak',
      setup: (c) => c.d.ensure('kartlar'),
      on: (ev, c) => {
        if (ev.type === 'card-drop' && !ev.ok && !ev.none) c.note('Bu kart oraya gelmiyor; sırayı kontrol edin.');
        return ev.type === 'cards-done';
      },
      done: 'Sürükle-bırak artık parmaklarınızda!',
    },
    {
      title: 'Mayın Tarlası\'na dönün',
      html: '<p>Küçülttüğünüz Mayın Tarlası\'nı geri getirin.</p>',
      hint: 'Görev çubuğundaki 💣 simgesine tıklayın ya da Alt + Tab.',
      on: (ev) => (ev.type === 'win-restore' || ev.type === 'win-focus' || ev.type === 'alttab') && (ev.app === 'mayin' || ev.type === 'alttab'),
    },
    {
      title: 'Oyunları kapatın',
      html: '<p>Oyunu bitirdiyseniz ya da yeterince oynadıysanız iki pencereyi de kapatın.</p>',
      check: (c) => !c.d.wins.length,
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
    },
    { final: true, title: 'Mola bitti! 🎮', html: '<p>Oyunlarda kullandıklarınız:</p>' },
  ],
};

export const masaustuHarita = {
  id: 'masaustu-harita', icon: '🗺', title: 'Masaüstü haritası', minutes: 15, stage: 'scene',
  desc: 'Tekrar: neyi nerede bulurum? Görev çubuğu, Başlat menüsü ve pencere üzerindeki parçaları ayırma oyunu ve sorular.',
  summary: [
    ['Görev çubuğu', 'Başlat, arama, açık programlar, saat, ses, Wi-Fi'],
    ['Başlat menüsü', 'Bütün programlar, Ayarlar, güç düğmesi'],
    ['Pencerenin üstü', 'Programın adı, — ☐ ✕, menüler'],
  ],
  steps: [
    { title: 'Neyi nerede bulurum?', html: '<p>Masaüstünün parçalarını tekrar edelim. Kartları ait oldukları yere sürükleyin.</p>', scene: info('<div class="sc-big">🗺</div><p>Masaüstü haritası</p>') },
    ayir({
      title: 'Nerede?',
      bins: [{ id: 'gorev', label: 'Görev çubuğunda', icon: '▁' }, { id: 'baslat', label: 'Başlat menüsünde', icon: '⊞' }, { id: 'pencere', label: 'Pencerenin üstünde', icon: '🪟' }],
      items: [
        { label: 'Saat ve tarih', icon: '🕒', bin: 'gorev', why: 'Görev çubuğunun sağında.' },
        { label: 'Ses simgesi', icon: '🔊', bin: 'gorev', why: 'Sağ altta, saatin yanında.' },
        { label: 'Açık programların simgeleri', icon: '🎨', bin: 'gorev', why: 'Görev çubuğunun ortasında.' },
        { label: 'Bütün programlar listesi', icon: '📋', bin: 'baslat', why: 'Başlat menüsünde.' },
        { label: 'Kapat / Yeniden başlat', icon: '⏻', bin: 'baslat', why: 'Başlat → Güç düğmesi.' },
        { label: 'Ayarlar ⚙', icon: '⚙', bin: 'baslat', why: 'Başlat menüsünde (⊞ + I).' },
        { label: 'Küçült — ve kapat ✕', icon: '✕', bin: 'pencere', why: 'Pencerenin sağ üstünde.' },
        { label: 'Programın ve dosyanın adı', icon: '🏷', bin: 'pencere', why: 'Pencerenin başlık çubuğunda.' },
        { label: 'Dosya, Düzen menüleri', icon: '📄', bin: 'pencere', why: 'Pencerenin üst kısmında.' },
      ],
      done: 'Masaüstünün haritası kafanızda!',
    }),
    sec({ title: 'Kaybolan pencere', text: '<div class="qz-pic">🪟❓</div>', q: 'Not Defteri penceresi birden ekrandan kayboldu. Büyük ihtimalle ne oldu?', opts: ['Silindi', 'Küçültüldü ya da başka bir pencerenin arkasında kaldı; görev çubuğundan bulunur', 'Bilgisayar bozuldu'], ok: 1, why: 'Görev çubuğunda simgesi duruyorsa program açıktır; tıklayınca öne gelir.' }),
    sec({ title: 'Saat yanlış', text: '<div class="qz-pic">🕒 ❌</div>', q: 'Sağ alttaki saat yanlış. Nereden düzeltilir?', opts: ['Ayarlar → Saat ve dil', 'Hesap Makinesi\'nden', 'Saate çift tıklayıp yeni saati yazarak'], ok: 0, why: '“Saati otomatik olarak ayarla” açıksa bilgisayar saati internetten kendisi alır.' }),
    sec({ title: 'Çok pencere', text: '<div class="qz-pic">🪟🪟🪟🪟</div>', q: 'Beş pencere açık; aradığınızı bulmanın en hızlı yolu hangisi?', opts: ['Hepsini kapatıp yeniden açmak', 'Alt\'ı basılı tutup Tab\'a basarak pencereler arasında dolaşmak', 'Bilgisayarı yeniden başlatmak'], ok: 1, why: 'Alt + Tab bütün açık pencereleri küçük resimlerle gösterir; Alt\'ı bırakınca seçtiğiniz öne gelir.' }),
    sec({ title: 'Simge kayboldu', text: '<div class="qz-pic">📝❓</div>', q: 'Masaüstündeki Not Defteri simgesini yanlışlıkla sildiniz. Program da silindi mi?', opts: ['Evet, program da gitti', 'Hayır; simge yalnızca kısayoldur, program Başlat menüsünde duruyor', 'Bilgisayar açılmaz'], ok: 1, why: 'Masaüstündeki program simgeleri kısayoldur. Programı Başlat\'tan açabilirsiniz.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Masaüstünde her şeyin yerini biliyorsunuz:</p>', scene: info('<div class="sc-big">🗺✔</div>') },
  ],
};
