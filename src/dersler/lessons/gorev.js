// 5. hafta ek ders: Görev Yöneticisi. Donan (yanıt vermeyen) programı kapatmak, performans (işlemci, bellek),
// başlangıç uygulamaları. Görev Yöneticisi'ni açmanın yolları: görev çubuğuna sağ tık, Ctrl + Shift + Esc, Ctrl + Alt + Delete.
import { K, desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

const TM = (c) => c.d.find('taskmgr')?.api;
const hungWord = (c) => c.d.wins.find((w) => w.app === 'word' && w.hung);

export const gorev = {
  id: 'gorev', icon: '📊', title: 'Program dondu! Görev Yöneticisi', minutes: 30, stage: 'desktop',
  desc: 'Yanıt vermeyen programı Görev Yöneticisi ile kapatmak, işlemci ve bellek kullanımına bakmak, bilgisayarı yavaş açan başlangıç uygulamalarını kapatmak.',
  summary: [
    ['Görev çubuğuna sağ tık → Görev Yöneticisi', 'Görev Yöneticisi\'ni açar'],
    ['Ctrl + Shift + Esc', 'Görev Yöneticisi\'ni doğrudan açar'],
    ['Ctrl + Alt + Delete', 'Kilitle, oturumu kapat, Görev Yöneticisi ekranı'],
    ['İşlemler → Görevi sonlandır', 'Donan programı zorla kapatır (kaydedilmemiş iş kaybolur)'],
    ['Performans', 'İşlemci, bellek (RAM), disk ve ağın ne kadar dolu olduğu'],
    ['Başlangıç uygulamaları', 'Bilgisayar açılırken kendiliğinden çalışanlar; gereksizler devre dışı bırakılır'],
  ],
  steps: [
    {
      title: 'Program donarsa',
      html: `<p>Bazen bir program <b>donar</b>: tıklamalara cevap vermez, penceresi beyazlaşır, başlığında <b>(Yanıt vermiyor)</b> yazar.</p>
        <p>Önce <b>biraz bekleyin</b>: çoğu zaman program ağır bir işi bitirince kendine gelir. Geçmezse <b>Görev Yöneticisi</b> ile kapatılır.</p>
        <p>Yandaki Kelime İşlemci birazdan donacak.</p>`,
      setup: (c) => {
        desktopReady(c);
        c.d.closeAll();
        c.d.open('browser');
        const w = c.d.open('word');
        setTimeout(() => c.d.hang(w), 900);
      },
    },
    {
      title: 'Donan pencereye tıklayın',
      html: '<p>Kelime İşlemci\'nin sayfasına birkaç kez tıklayın. Ne oluyor?</p>',
      mouse: '🖱 Donan pencereye tıklayın',
      setup: (c) => { const w = c.d.find('word'); if (w && !w.hung) c.d.hang(w); },
      on: (ev) => ev.type === 'hung-click',
      done: 'Pencere iyice beyazladı, imleç dönen daireye döndü: program tıklamaları duymuyor.',
    },
    {
      title: 'Kapat düğmesini deneyin',
      html: '<p>Pencerenin sağ üstündeki <b>✕</b>\'e tıklayın. Windows ne soruyor? <b>Programın yanıt vermesini bekle</b>\'yi seçin.</p>',
      mouse: '🖱 ✕ → Programın yanıt vermesini bekle',
      on: (ev, c) => {
        if (ev.type === 'hung-answer' && ev.answer === 'close') { c.note('Program kapandı. Ders için yeniden açılıp donduruldu; bu sefer <b>bekle</b>\'yi seçin.'); const w = c.d.open('word'); c.d.hang(w); return false; }
        return ev.type === 'hung-answer' && ev.answer === 'wait';
      },
      done: 'Yanıt vermeyen pencerede ✕ de hemen çalışmaz; Windows “bekleyeyim mi, kapatayım mı?” diye sorar. Beklemek de sonuç vermezse Görev Yöneticisi\'ne geçilir.',
    },
    {
      title: 'Görev Yöneticisi\'ni açın',
      html: `<p><b>Görev çubuğunun boş bir yerine sağ tıklayın</b> ve <b>📊 Görev Yöneticisi</b>\'ni seçin.</p>
        <p class="mut">Kısayolu: ${K('Ctrl', 'Shift', 'Esc')}. Bilgisayar tamamen kilitlenmişse ${K('Ctrl', 'Alt', 'Delete')} da çalışır. (Bu tuşları gerçek Windows kendisi yakalayabilir; öyleyse sağ tıkı kullanın.)</p>`,
      mouse: '🖱 Görev çubuğuna sağ tık → Görev Yöneticisi',
      setup: (c) => { const w = c.d.find('word'); if (w && !w.hung) c.d.hang(w); },
      check: (c) => !!c.d.find('taskmgr'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'taskmgr',
      done: '<b>İşlemler</b> sekmesinde açık programlar (Uygulamalar) ve görünmeden çalışanlar (Arka plan işlemleri) listelenir. Her birinin <b>işlemci</b> ve <b>bellek</b> kullanımı yanında yazar.',
    },
    {
      title: 'Donan programı seçin',
      html: '<p>Listede durumu <b>⏳ Yanıt vermiyor</b> olan satıra (Kelime İşlemci) bir kez tıklayın.</p>',
      mouse: '🖱 Yanıt vermiyor satırına tıklayın',
      setup: (c) => { c.d.ensure('taskmgr', { tab: 'proc' }); if (TM(c)?.tab !== 'proc') c.d.find('taskmgr').api.onArgs({ tab: 'proc' }); },
      on: (ev) => ev.type === 'task-select' && ev.id === 'app:word',
      done: 'Seçili satır mavi oldu ve sağ üstteki <b>Görevi sonlandır</b> düğmesi açıldı.',
    },
    {
      title: 'Görevi sonlandırın',
      html: '<p>Sağ üstteki <b>⊘ Görevi sonlandır</b>\'a tıklayın. (Satıra sağ tıklayıp da seçebilirsiniz.)</p>',
      mouse: '🖱 Görevi sonlandır',
      hint: 'Önce satırı seçmezseniz düğme soluk kalır.',
      on: (ev) => ev.type === 'task-end' && ev.app === 'word',
      done: 'Program kapandı. <b>Dikkat:</b> görevi sonlandırmak programa “kaydet” fırsatı vermez; kaydedilmemiş yazılar kaybolur. Bu yüzden sık sık Ctrl + S!',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Bir program donunca sırasıyla ne yapılır?</p>',
      opts: ['Hemen bilgisayarın fişini çekerim', 'Biraz beklerim; düzelmezse Görev Yöneticisi\'nden görevi sonlandırırım', 'Bilgisayarı satarım'],
      ok: 1,
      wrong: 'Fişi çekmek bütün programları ve kaydedilmemiş her şeyi kaybettirir, diske de zarar verebilir.',
      why: 'Doğru. Fişi çekmek ya da güç düğmesine uzun basmak en son çaredir.',
    }),
    {
      title: 'Performans',
      html: '<p>Soldaki <b>📈 Performans</b>\'a tıklayın, sonra listeden <b>Bellek (RAM)</b>\'i seçin.</p>',
      mouse: '🖱 Performans → Bellek',
      setup: (c) => c.d.ensure('taskmgr'),
      on: (ev) => ev.type === 'task-perf' && ev.kind === 'mem',
      done: 'Grafik, belleğin son 60 saniyede ne kadar dolu olduğunu gösterir. Bellek hep %90\'ın üstündeyse bilgisayar yavaşlar: ya programları kapatın ya da RAM ekletin (donanım dersindeki “çalışma masası”).',
    },
    rehberSoru({
      title: 'Bilgisayarınızı tanıyın',
      html: '<p>Yandaki Performans sayfasında <b>İşlemci (CPU)</b>\'ya tıklayın. Bu bilgisayarda hangi işlemci var?</p>',
      opts: ['Intel Core i5-12400', '8,0 GB DDR4', 'NVMe SSD 512 GB'],
      ok: 0,
      setup: (c) => c.d.ensure('taskmgr', { tab: 'perf' }),
      wrong: 'O işlemci değil. İşlemci (CPU) satırına tıklayıp sağ üst köşedeki yazıya bakın.',
      why: '“i5” işlemcinin sınıfı, “12” onun nesli (12. nesil). Bilgisayar alırken ilanlarda yazan bilgiler burada görülür.',
    }),
    {
      title: 'Bilgisayar geç açılıyor',
      html: `<p>Bazı programlar bilgisayar açılırken <b>kendiliğinden</b> çalışır ve açılışı yavaşlatır.</p>
        <ol class="steps"><li>Soldaki <b>🚀 Başlangıç uygulamaları</b>\'na tıklayın.</li><li>Yayımcısı <b>Bilinmiyor</b>, etkisi <b>Yüksek</b> olan <b>Süper Arama Yardımcısı</b>\'nı seçin.</li><li><b>Devre dışı bırak</b>\'a tıklayın.</li></ol>`,
      mouse: '🖱 Başlangıç uygulamaları → Süper Arama Yardımcısı → Devre dışı bırak',
      setup: (c) => { c.d.settings.toolbar = true; c.d.ensure('taskmgr'); },
      on: (ev) => ev.type === 'startup-toggle' && ev.id === 'toolbar' && !ev.on,
      done: 'Son açılış süresi kısaldı. Bu program bir kurulumda “ek yazılım” kutucuğu boşaltılmadığı için gelmişti; kalıcı çözüm onu <b>Ayarlar → Uygulamalar</b>\'dan kaldırmaktır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Görev Yöneticisi:</p>' },
  ],
};
