// 8. hafta ek dersi: internette video, radyo ve gazete. YouTube benzeri sitede arama, reklamı atlama, tam ekran, altyazı, hız; radyo; gazete okurken reklam ve galeri tuzakları.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const medya = {
  id: 'video-gazete', icon: '▶', title: 'İnternetten video izleme, radyo ve gazete okuma', minutes: 35, stage: 'desktop',
  desc: 'Video izlemek, altyazı açmak, internetten radyo dinlemek.',
  summary: [
    ['🔍 Video ara', 'Konuyu yazın: “çay demleme”'],
    ['Reklamı atla ▶', 'Birkaç saniye sonra çıkar; reklamın kendisine tıklamayın'],
    ['⛶ Tam ekran', 'Büyük izlemek için; çıkış: Esc'],
    ['CC', 'Altyazı açar/kapatır'],
    ['⚙ Hız', 'Yavaşlatınca konuşma rahat anlaşılır (0,75x, 0,5x)'],
    ['📻 Radyo', 'Kanalın yanındaki ▶; başka kanal seçince öncekisi susar'],
    ['Gazete', 'Habere tıklayın; “Sponsorlu” kutular reklamdır; “Galeri” sayfaları sizi oyalar'],
    ['Reklam engelleyici', 'Tarayıcı uzantısı; reklamların çoğunu engeller'],
  ],
  steps: [
    {
      title: 'İnternette izleyelim, dinleyelim, okuyalım',
      html: `<p>İnternette <b>video</b> izleyebilir, <b>radyo</b> dinleyebilir, <b>gazete</b> okuyabilirsiniz. Tarif, egzersiz, bahçe işleri… neredeyse her şeyin videosu var.</p>
        <p>Ama bu siteler <b>reklamla</b> para kazanır; bazen reklamlar asıl içeriğin önüne geçer. Bugün hem keyifle izleyeceğiz hem de tuzaklardan kaçacağız.</p>
        <p class="mut">Siteler uydurmadır: İzleyelim (video, radyo) ve Gazete Oku.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'İzleyelim\'i açın',
      html: '<p>⊞ Başlat → <b>🌐 İnternet</b> açın. Adres çubuğuna <b>www.izleyelim.com</b> yazıp <b>Enter</b>\'a basın.</p>',
      setup: (c) => br(c),
      hint: 'Adres çubuğu pencerenin en üstünde. Tıklayıp yazın.',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.izleyelim.com',
    },
    {
      title: 'Video arayın',
      html: '<p>Üstteki arama kutusuna <b>çay</b> yazıp <b>🔍</b>\'ya ya da <b>Enter</b>\'a basın.</p>',
      hint: 'Kutu İzleyelim yazısının sağında, “Video ara” yazıyor.',
      on: (ev) => ev.type === 'iz-search' && /çay|cay/i.test(ev.q),
      done: 'Çay ile ilgili video bulundu.',
    },
    {
      title: 'Videoyu açın',
      html: '<p>Sonuçlardan <b>Çay nasıl demlenir?</b> videosuna tıklayın.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.path === '/izle/cay',
      done: 'Video sayfası açıldı. Ama önce bir reklam çıktı.',
    },
    {
      title: 'Reklamı atlayın',
      html: `<p>Videonun başında bir <b>reklam</b> oynuyor. Birkaç saniye sonra sağ altta <b>Reklamı atla ▶</b> düğmesi çıkar. Ona tıklayın.</p>
        <p><b>Dikkat:</b> reklamın kendisine tıklamayın; sizi satıcının sayfasına götürür.</p>`,
      hint: 'Sağ altta beliren beyaz “Reklamı atla ▶” düğmesi. Beklemeniz gerekebilir (5 saniye).',
      on: (ev, c) => {
        if (ev.type === 'iz-ad-click') c.warn('Reklamın kendisine tıkladınız. Gerçekte başka sayfa açılırdı. Beklenen: sağ alttaki “Reklamı atla” düğmesi.');
        return ev.type === 'iz-ad-skip';
      },
      done: 'Reklam geçildi, video başladı. “Atla” düğmesi yoksa reklam bitene kadar beklemek gerekir.',
    },
    {
      title: 'Tam ekran',
      html: `<p>Videoyu büyük izlemek için alt çubuktaki <b>⛶</b> (tam ekran) düğmesine tıklayın.</p>`,
      mouse: '🖱 ⛶ Tam ekran',
      hint: 'Videonun altındaki çubukta en sağdaki düğme.',
      on: (ev) => ev.type === 'iz-full' && ev.on,
      done: 'Video bütün pencereyi kapladı.',
    },
    {
      title: 'Esc ile çıkın',
      html: `<p>Tam ekrandan çıkmak için klavyede <b>${K('Esc')}</b> tuşuna basın (sol üst köşede). Aynı düğmeye tekrar tıklamak da olur.</p>`,
      keys: ['Escape'],
      hint: 'Esc tuşu klavyenin en sol üst köşesindedir.',
      on: (ev) => ev.type === 'iz-full' && !ev.on,
      done: 'Çıktınız. Takılırsanız hep Esc deneyin; tam ekrandan çıkmanın genel yolu.',
    },
    {
      title: 'Altyazı açın',
      html: '<p>Konuşma duyulmuyorsa <b>altyazı</b> açabilirsiniz. Alt çubuktaki <b>CC</b> düğmesine tıklayın. Videonun altında yazılar belirir.</p>',
      mouse: '🖱 CC',
      on: (ev) => ev.type === 'iz-cc' && ev.on,
      done: 'Altyazı açık. Kısık sesle ya da kalabalıkta izlerken de işe yarar.',
    },
    {
      title: 'Konuşmayı yavaşlatın',
      html: `<p>Konuşma çok hızlı geliyorsa <b>⚙ 1x</b> düğmesine tıklayarak hızı değiştirin. Düğmeye her tıklayışta hız değişir. <b>0,75x</b> ya da <b>0,5x</b> yapın.</p>`,
      hint: 'Düğme “⚙ 1x” yazıyor. Tıkladıkça 0,75x, 0,5x, 1,25x… diye değişir.',
      on: (ev) => ev.type === 'iz-speed' && ev.speed < 1,
      done: 'Video yavaşladı; tarifi not almak ya da yabancı dil dinlemek için çok iyi.',
    },
    {
      title: 'Radyo dinleyin',
      html: '<p>Üstteki <b>📻 Radyo</b>\'ya tıklayın. <b>Türkü Radyo</b> yanındaki <b>▶ Dinle</b>\'ye tıklayın.</p>',
      hint: 'Ses duyulmuyorsa sağ alttaki 🔊 simgesinden sesi açın.',
      on: (ev) => ev.type === 'iz-radio' && ev.on && /Türkü/.test(ev.name),
      done: 'Radyo çalıyor. Başka kanala geçince öncekisi susar; durdurmak için ■ Durdur.',
    },
    {
      title: 'Gazete okuyalım',
      html: `<p>Şimdi adres çubuğuna <b>www.gazete-oku.com.tr</b> yazın.</p>`,
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.gazete-oku.com.tr',
    },
    {
      title: 'Tuzaklara dikkat',
      html: `<p>Sayfada <b>üç tür şey</b> var: gerçek haberler, <b>“Reklam”</b> yazan kutular ve <b>“ŞOK!”</b> diye başlayan galeri bağlantısı.</p>
        <p>Gerçek habere tıklayın: <b>Belediyeden yaşlılara ücretsiz bilgisayar kursu</b>.</p>`,
      hint: '“Reklam” yazan sarı kutulara ve kırmızı “ŞOK!” bağlantısına tıklamayın.',
      on: (ev, c) => {
        if (ev.type === 'gz-ad-click') c.warn('Reklama tıkladınız. Reklamlar “Reklam” ya da “Sponsorlu” yazar. Gerçek haber başlığına tıklayın.');
        if (ev.type === 'gz-gallery') c.warn('Galeri bağlantısına tıkladınız. Böyle sayfalar sizi 20 sayfa gezdirip reklam gösterir. Geri (←) ile dönün ve gerçek habere tıklayın.');
        return ev.type === 'web-nav' && ev.path === '/haber/0';
      },
      done: 'Doğru haberi açtınız.',
    },
    rehberSoru({
      title: 'Haberi okuyun',
      html: '<p>Haberi okuyup bulun: Bilgisayar kursu <b>hangi günler</b> yapılacak? (Ortadaki büyük yeşil “HABERİN DEVAMI İÇİN TIKLAYIN” düğmesine <b>tıklamayın</b>, o reklamdır.)</p>',
      opts: ['Salı ve perşembe', 'Pazartesi ve çarşamba', 'Cumartesi ve pazar'], ok: 0,
      wrong: 'Haberin ilk paragrafına tekrar bakın.',
      why: 'Doğru: her salı ve perşembe saat 10.00. Haberin gerçek metni zaten sayfada; “devamı için tıklayın” diyen düğme reklam tuzağıdır.',
    }),
    {
      title: 'Reklamı kapatın',
      html: '<p>Haberin içindeki kutulardan birinin sağ üst köşesinde küçük bir <b>✕</b> var. Reklamı kapatmak için ona tıklayın. (Reklamın <b>kendisine</b> değil, yalnızca ✕\'e.)</p>',
      hint: 'Sarı kutunun sağ üstündeki küçük gri ✕.',
      on: (ev, c) => { if (ev.type === 'gz-ad-click') c.note('Reklamın kendisine değil, yalnızca sağ üstteki küçük ✕\'e tıklayın.'); return ev.type === 'gz-ad-close'; },
      done: 'Reklam kapandı. Çok bunaltıyorsa tarayıcıya “reklam engelleyici” uzantısı eklenebilir (13. hafta).',
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Bir haber sayfasında “<b>Ünlünün son hâli (Galeri 1/20)</b>” bağlantısı var. Tıklarsanız ne olur?</p>',
      opts: ['Haberin tamamını tek sayfada görürüm', 'Hiçbir şey olmaz, sayfa açılmaz', 'Sayfa sayfa gezdirilirim, her sayfada reklam görürüm'], ok: 2,
      wrong: 'Bu pek öyle değil. Böyle bağlantıların amacı ne olabilir?',
      why: 'Doğru. Galeri bağlantıları sizi sayfa sayfa gezdirip her adımda reklam gösterir. Asıl haber çoğu zaman ilk sayfada zaten vardır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Artık internette rahatça izleyip dinleyip okuyabilirsiniz:</p>' },
  ],
};
