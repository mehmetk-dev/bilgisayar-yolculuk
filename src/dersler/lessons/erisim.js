// 5. hafta ek dersleri: fare ayarları (çift tıklama, sol-sağ el, işaretçi) ve okuma kolaylıkları (Büyüteç, Ctrl + tekerlek)
import { K, desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

const ayarlarda = (page) => (c) => { const w = c.d.ensure('settings'); w.api.go(page); };

export const fareAyar = {
  id: 'fare-ayar', icon: '🖱', title: 'Fareyi kendinize göre ayarlayın', minutes: 25, stage: 'desktop',
  desc: 'Fare hızını, düğmeleri ve imleç boyutunu kendinize göre ayarlamak.',
  desktop: { settings: { dblSpeed: 10 } },
  summary: [
    ['Ayarlar → Bluetooth ve cihazlar → Fare', 'Çift tıklama hızı, birincil düğme'],
    ['Çift tıklama hızı', 'Yavaşa çekerseniz iki tıklama arasında daha uzun süre tanınır'],
    ['Birincil düğme', 'Sol elini kullananlar için Sağ yapılabilir; tık ile sağ tık yer değiştirir'],
    ['Ayarlar → Erişilebilirlik → Fare işaretçisi', 'Boyut ve renk: kaybolan imleci bulmanın yolu'],
    ['Kısaca', 'Fare size uymuyorsa suç sizde değil; ayarı değiştirin'],
  ],
  steps: [
    {
      title: 'Fare size uymuyor mu?',
      html: `<p>Çift tıklamakta zorlanmak çok yaygındır; iki tıklama arasında beklemeniz gereken süre bilgisayara göre çok kısa olabilir. Bunun için <b>fareyi ayarlamak</b> yeter.</p>
        <ul class="big-list"><li>Çift tık zor geliyor: <b>hızı yavaşlatın</b></li><li>Sol elinizi kullanıyorsunuz: <b>düğmeleri değiştirin</b></li><li>İmleci bulamıyorsunuz: <b>büyütün, renklendirin</b></li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Fare ayarlarını açın',
      html: '<p>⊞ Başlat → <b>⚙ Ayarlar</b>. Soldan <b>🖨 Bluetooth ve cihazlar</b>\'a tıklayın; aşağıda <b>Fare</b> bölümü var.</p>',
      setup: (c) => c.d.ensure('settings'),
      check: (c) => c.d.find('settings')?.el.querySelector('[data-page="devices"].on'),
      on: (ev) => ev.type === 'settings-page' && ev.page === 'devices',
    },
    {
      title: 'Çift tıklamayı deneyin',
      html: `<p>Fare bölümünün altındaki <b>📁 klasör</b> kutusuna <b>çift tıklayın</b>. Açılırsa (📂 olur) çift tıklama algılandı demektir.</p>
        <p>Bu sefer hız <b>en yüksek</b> (10) ayarlandı; çift tıklamak bilerek zorlaştırıldı. Kutuya hızlı hızlı çift tıklamayı deneyin; olmuyorsa sonraki adıma geçin.</p>`,
      manual: 'Denedim ✔',
      setup: ayarlarda('devices'),
      done: 'Çok hızlı ayarda iki tıklama arasında çok az süre vardır. Şimdi bunu yavaşlatalım.',
    },
    {
      title: 'Hızı yavaşlatın',
      html: '<p><b>Çift tıklama hızı</b> çubuğunu <b>sola</b> (yavaş tarafa) çekip <b>3 ya da daha az</b> yapın. Sonra klasör kutusuna yeniden çift tıklayın ve 📂\'ın açıldığını görün.</p>',
      hint: 'Çubuk, “Çift tıklama hızı” yazan satırda. Sola sürükleyin; yanındaki sayı küçülsün. Sonra kutuya iki kez, aralıksız tıklayın.',
      setup: ayarlarda('devices'),
      on: (ev, c) => {
        if (ev.type === 'dbl-speed' && ev.speed > 3) c.note(`Hız şu an ${ev.speed}. Daha yavaş olması için 3 ya da daha küçük bir sayıya getirin.`);
        if (ev.type === 'dbl-test' && ev.speed > 3) { c.warn('Çift tıklama açıldı ama hız hâlâ yüksek. Çubuğu 3 ya da daha az yapıp bir kez daha deneyin.'); return false; }
        return ev.type === 'dbl-test' && ev.speed <= 3;
      },
      done: 'Yavaş ayarda iki tıklama arasında rahat zaman var. Kendi elinize uygun hızı böyle bulursunuz.',
    },
    {
      title: 'Sol elini kullananlar',
      html: `<p><b>Birincil fare düğmesi</b> seçeneğini <b>Sağ</b> yapın. Böylece sağ düğme asıl (tık), sol düğme menü (sağ tık) olur. Sol elini kullananlar için kolaylık.</p>`,
      setup: ayarlarda('devices'),
      on: (ev) => ev.type === 'primary-button' && ev.value === 'right',
      done: 'Artık düğmelerin görevi yer değiştirdi. Altındaki “🖱” kutusuna sol ve sağ düğmeyle tıklayıp deneyin.',
    },
    {
      title: 'Deneyin',
      html: '<p>🖱 kutusuna <b>sol düğmeyle</b> tıklayın ve yazıyı okuyun. Sonra <b>sağ düğmeyle</b> tıklayın.</p>',
      setup: ayarlarda('devices'),
      on: (ev, c) => {
        if (ev.type !== 'mouse-test') return false;
        if (ev.button === 'left') c.s.l = true; else c.s.r = true;
        return !!(c.s.l && c.s.r);
      },
      done: 'Sol düğme artık sağ tık gibi çalıştı. Bu ayarı değiştirmeyi unutursanız bilgisayarı başkası kullanırken şaşırır; kendi bilgisayarınızda yapın.',
    },
    {
      title: 'Eski hâline getirin',
      html: '<p>Sınıfta ortak bilgisayar kullanıyoruz. <b>Birincil fare düğmesi</b>ni tekrar <b>Sol</b> yapın.</p>',
      setup: ayarlarda('devices'),
      on: (ev) => ev.type === 'primary-button' && ev.value === 'left',
      done: 'Ortak bilgisayarda bıraktığınız ayarı eski hâline getirmek iyi bir davranıştır.',
    },
    {
      title: 'İmleç kayboldu',
      html: `<p>Ekranda imleci (oku) bulamıyor musunuz? Soldan <b>♿ Erişilebilirlik</b>'e geçin. <b>Fare işaretçisi</b> bölümünde boyutu <b>Çok büyük</b> yapın.</p>`,
      setup: ayarlarda('access'),
      on: (ev) => ev.type === 'cursor-size' && ev.size === 'huge',
      done: 'İmleç büyüdü. Fareyi ekranda gezdirip görün.',
    },
    {
      title: 'Rengini değiştirin',
      html: '<p>Aynı yerde işaretçi <b>rengi</b> olarak <b>Sarı</b>\'yı seçin. Siyah ya da ters renkli imleç açık zeminde, beyaz imleç koyu zeminde iyi seçilir. Renkli imleçte canlı bir renk seçmek gerekir; sarı bunlardan biridir ve koyu zeminde çok belirgindir.</p>',
      setup: ayarlarda('access'),
      on: (ev) => ev.type === 'cursor-color' && ev.color === 'yellow',
      done: 'Sarı, büyük bir imleç çok daha rahat görünür.',
    },
    {
      title: 'Normale dönün',
      html: '<p>Şimdi imleci <b>Normal</b> boyuta ve <b>Beyaz</b> renge geri alın (iki ayrı düğme).</p>',
      setup: ayarlarda('access'),
      on: (ev, c) => {
        if (ev.type === 'cursor-size') c.s.size = ev.size;
        if (ev.type === 'cursor-color') c.s.color = ev.color;
        return c.d.settings.cursorSize === 'normal' && c.d.settings.cursorColor === 'white';
      },
    },
    rehberSoru({
      title: 'Ne önerirsiniz?',
      html: '<p>Bir komşunuz: “Çift tıklayamıyorum, bazen iki ayrı tık sayıyor.” Ona ne dersiniz?</p>',
      opts: ['Fareyi yenile', 'Ayarlar → Bluetooth ve cihazlar → Fare’den çift tıklama hızını yavaşlat', 'Yalnızca tek tıkla çalış, çift tık gereksiz'], ok: 1,
      wrong: 'Bu değil. Önce ayarı denemek gerekir; fare bozuk değil.',
      why: 'Evet: çoğu zaman fare sağlamdır; yalnızca hız ayarı el hızına uymamıştır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Fareyi kendinize göre ayarlayabiliyorsunuz:</p>' },
  ],
};

export const okumaKolay = {
  id: 'okuma-kolay', icon: '🔍', title: 'Gözümüz yorulmasın: Büyüteç ve okuma kolaylıkları', minutes: 20, stage: 'desktop',
  desc: 'Küçük yazıları büyütmek: Ctrl + fare tekerleği ve Windows Büyüteç.',
  summary: [
    ['Ctrl + fare tekerleği', 'Pencerede yazıyı büyütür / küçültür'],
    ['Ctrl + artı / eksi', 'Aynı iş, klavyeyle'],
    ['⊞ + artı (+)', 'Büyüteç\'i açar (ekranın hepsini yakınlaştırır)'],
    ['⊞ + Esc', 'Büyüteç\'i kapatır'],
    ['Ayarlar → Erişilebilirlik → Büyüteç', 'Düğmeyle de açılıp kapanır'],
    ['Metin boyutu', 'Ayarlar → Erişilebilirlik: bütün yazıları büyütür'],
  ],
  steps: [
    {
      title: 'Yazılar küçük geliyor',
      html: `<p>Ekrandaki yazıları okurken gözünüzü yoruyorsanız bilgisayarı değiştirmenize gerek yok; yazıyı <b>büyütebilirsiniz</b>. İki yol öğreneceğiz:</p>
        <ul class="big-list"><li><b>Tek pencere</b> için: ${K('Ctrl')} + fare tekerleği</li><li><b>Bütün ekran</b> için: <b>Büyüteç</b></li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Not Defteri\'ni açın',
      html: '<p>⊞ Başlat → <b>📝 Not Defteri</b>. İçine bir iki cümle yazın.</p>',
      check: (c) => !!c.d.find('notepad'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'notepad',
    },
    {
      title: 'Ctrl ile tekerlek',
      html: `<p>Not Defteri'nin yazı alanındayken ${K('Ctrl')} tuşunu <b>basılı tutup</b> fare tekerleğini <b>ileri</b> çevirin: yazı büyür. Pencerenin sağ altında <b>%</b> değeri yükselir.</p>`,
      setup: (c) => c.d.ensure('notepad'),
      hint: `Alternatif: ${K('Ctrl')} basılıyken ${K('+')} tuşuna basın. Tekerlek yoksa bu yolu kullanın.`,
      on: (ev) => ev.type === 'zoom' && ev.zoom >= 130,
      done: 'Bu yöntem tarayıcıda, Word\'de, e-postada, hemen her programda çalışır. Geri döndürmek için Ctrl + 0.',
    },
    {
      title: 'Ayarlar → Erişilebilirlik',
      html: '<p>Şimdi bütün ekran için: ⚙ <b>Ayarlar</b>\'ı açın, soldan <b>♿ Erişilebilirlik</b>\'e geçin. Aşağıda <b>Büyüteç</b> bölümü var.</p>',
      setup: (c) => c.d.ensure('settings'),
      check: (c) => c.d.find('settings')?.el.querySelector('[data-page="access"].on'),
      on: (ev) => ev.type === 'settings-page' && ev.page === 'access',
    },
    {
      title: 'Büyüteç\'i açın',
      html: `<p><b>Büyüteç</b> düğmesini <b>Açık</b> yapın. Ekran yakınlaşır ve fareyi gezdirdikçe görüntü fareyi izler.</p>
        <p class="mut">Gerçek bilgisayarda ${K('⊞', '+')} ile açılır.</p>`,
      setup: ayarlarda('access'),
      on: (ev) => ev.type === 'toggle' && ev.key === 'magnifier' && ev.on,
      done: 'Büyüteç açıldı. Fareyi ekranın köşelerine götürün; görüntü izliyor.',
    },
    {
      title: 'Fareyi gezdirin',
      html: '<p>Fareyi ekranın farklı yerlerine götürün. Büyütülen bölüm fareyi izler. Üstte küçük bir kumanda çubuğu var: <b>− ＋ ✕</b>.</p>',
      manual: 'Gördüm ✔',
    },
    {
      title: 'Daha çok yakınlaştırın',
      html: '<p>Üstteki çubuktaki <b>＋</b> düğmesine basarak yakınlaştırmayı <b>%300</b> ya da daha fazlasına çıkarın.</p>',
      hint: 'Çubuk ekranın üst ortasında: 🔍 Büyüteç − %200 ＋ ✕',
      on: (ev) => (ev.type === 'magnifier' || ev.type === 'magnifier-zoom') && ev.zoom >= 300,
      done: 'Çok küçük yazıyı bu düzeyde rahat okursunuz. Çok yakınlaştırınca ekranda gezinmek zorlaşır; kendinize göre ayarlayın.',
    },
    {
      title: 'Büyüteç\'i kapatın',
      html: `<p>İşiniz bitince üstteki çubuktaki <b>✕</b> düğmesine tıklayarak Büyüteç'i kapatın. (Gerçek bilgisayarda ${K('⊞', 'Esc')}.)</p>`,
      on: (ev, c) => (ev.type === 'magnifier' || (ev.type === 'toggle' && ev.key === 'magnifier')) && !c.d.settings.magnifier,
      done: 'Büyüteç kapandı, ekran eski boyuna döndü.',
    },
    rehberSoru({
      title: 'Hangi yol?',
      html: '<p>Bir internet sayfasındaki yazı küçük, ama bilgisayarın geri kalanı iyi. En hızlı çözüm hangisi?</p>',
      opts: ['Bilgisayarı yeniden başlatmak', `${K('Ctrl')} basılıyken fare tekerleğiyle sayfayı yakınlaştırmak`, 'Ekranı değiştirmek'], ok: 1,
      wrong: 'Bu kadar büyük bir işe gerek yok. Pencerenin içindeki yazıyı büyütmenin kısa bir yolu var.',
      why: 'Evet. Ctrl + tekerlek yalnızca o sayfayı büyütür; beğenmezseniz Ctrl + 0 ile eski boyuna dönersiniz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Gözünüzü yormadan okumanın yolları:</p>' },
  ],
};
