// 5. hafta ek dersi: iki pencereyi yan yana koymak (ekranı ikiye bölmek). Solda e-postadaki fatura, sağda Not Defteri.
import { K, desktopReady, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { deliverMail } from '../apps/mail.js';

const npText = (c) => c.d.find('notepad')?.api.np?.value || '';
const snapped = (c, app, side) => { const w = c.d.find(app); return !!w && w.snap === side && !w.max && !w.min; };
const yazildi = (c) => /845[,.]20/.test(npText(c)) && /28\s*ekim/i.test(npText(c));

export const yanYana = {
  id: 'yan-yana', icon: '🪟', title: 'İki pencereyi yan yana koymak', minutes: 20, stage: 'desktop',
  desc: 'Ekranı ikiye bölmek: solda faturayı okurken sağda yazmak.',
  summary: [
    ['Başlık çubuğunu kenara sürükleyin', 'Fare ekranın soluna ya da sağına değince gölge çıkar; bırakınca pencere o yarıya yerleşir'],
    ['Öbür yarıda çıkan liste', 'Diğer açık pencereler; tıkladığınız boş yarıya yerleşir'],
    ['☐ üzerinde bekleyin', 'Küçük yerleşim kutusu çıkar: sol yarı ya da sağ yarı (Windows 11)'],
    [K('⊞', '←') + ' / ' + K('⊞', '→'), 'Seçili pencereyi sola / sağa yaslar'],
    [K('⊞', '↑'), 'Ekranı kaplar'],
    ['Başlık çubuğunu ortaya sürükleyin', 'Pencere kenardan ayrılır, eski boyutuna döner'],
  ],
  steps: [
    {
      title: 'Bir bakıyorum, bir yazıyorum',
      html: `<p>Faturadaki tutarı bir yere yazmak, internetteki tarifi deftere geçirmek, e-postadaki adresi dilekçeye yazmak… Hep <b>iki pencere</b> birden lazım olur.</p>
        <p>Pencereler üst üste binince birini açıp öbürünü kapatırken kaybolursunuz. Çözüm: <b>ekranı ikiye bölmek</b>. Bir pencere solda, öbürü sağda durur.</p>
        <p>Ekranda <b>E-posta</b> ile <b>Not Defteri</b> açık; şu an üst üste duruyorlar.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        deliverMail(c.d, {
          key: 'dogalgaz', from: 'fatura@sehir-dogalgaz.com.tr', fromName: 'Şehir Doğalgaz', subject: 'Ekim 2026 doğalgaz faturanız', time: '10:05',
          body: 'Sayın Ahmet Yılmaz,\n\nEkim 2026 dönemine ait doğalgaz faturanız hazırlanmıştır.\n\nAbone no: 7730 1456\nTüketim: 96 m³\nFatura tutarı: 845,20 TL\nSon ödeme tarihi: 28 Ekim 2026\n\nİyi günler dileriz.\nŞehir Doğalgaz',
        }, true);
        const n = put(c, 'docs', 'ekim ödemeleri.txt', 'file', 'Ekim ayı ödemeleri\nElektrik: 1.245,50 TL (son gün 25 Kasım)\n');
        c.d.open('mail');
        c.d.open('notepad', { node: n.id });
      },
    },
    {
      title: 'Faturayı açın',
      html: '<p>E-posta penceresinde <b>“Ekim 2026 doğalgaz faturanız”</b> postasına tıklayın.</p>',
      hint: 'E-posta penceresi Not Defteri\'nin arkasında kaldıysa görev çubuğundaki ✉ simgesine tıklayın.',
      on: (ev) => ev.type === 'mail-open' && ev.key === 'dogalgaz',
      done: 'Fatura açıldı. Şimdi bunu ekranın sol yarısına yerleştireceğiz.',
    },
    {
      title: 'E-postayı sola yaslayın',
      html: `<p>E-posta penceresinin en üstündeki <b>başlık çubuğundan</b> (✉ E-posta yazan şerit) tutun ve fareyi <b>ekranın sol kenarına</b> kadar sürükleyin.</p>
        <p>Fare kenara değince ekranın sol yarısında <b>saydam bir gölge</b> çıkar. O zaman fareyi bırakın.</p>`,
      mouse: '🖱 Başlık çubuğu → ekranın sol kenarı',
      hint: 'Fareyi ekranın en soluna, kenara değene kadar götürün; gölge çıkmadan bırakırsanız pencere yalnızca yer değiştirir. Tekrar deneyin.',
      check: (c) => snapped(c, 'mail', 'left'),
      on: (ev, c) => {
        if (ev.type === 'win-move' && ev.app === 'mail') c.note('Pencere kaydı ama kenara değmedi. Fareyi ekranın en sol kenarına kadar götürün.');
        return ev.type === 'win-snap' && ev.app === 'mail' && ev.side === 'left';
      },
      done: 'E-posta ekranın sol yarısına yerleşti. Sağ tarafta bir liste çıktı: “Bu yarıya hangi pencere gelsin?”',
    },
    {
      title: 'Sağ yarıya Not Defteri',
      html: '<p>Sağ yarıda açık pencereler listeleniyor. <b>📝 Not Defteri</b>\'ne tıklayın; sağ yarıya yerleşsin.</p>',
      hint: 'Liste kapandıysa Not Defteri\'nin başlık çubuğunu tutup ekranın sağ kenarına sürükleyin.',
      check: (c) => snapped(c, 'mail', 'left') && snapped(c, 'notepad', 'right'),
      on: (ev, c) => ev.type === 'win-snap' && snapped(c, 'mail', 'left') && snapped(c, 'notepad', 'right'),
      done: 'İki pencere yan yana! Hiçbiri öbürünü kapatmıyor.',
    },
    {
      title: 'Solda okuyun, sağda yazın',
      html: `<p>Soldaki faturaya bakarak Not Defteri'nde yeni bir satıra şunu yazın:</p>
        <p class="target">Doğalgaz: 845,20 TL (son gün 28 Ekim)</p>
        <p>Tutarı ve tarihi faturadan okuyun; pencere değiştirmenize gerek yok.</p>`,
      hint: 'Not Defteri\'nde son satırın sonuna tıklayın, Enter\'a basıp yazın. Virgüllü yazın: 845,20',
      check: (c) => yazildi(c),
      on: (ev, c) => ev.type === 'input' && yazildi(c),
      done: 'Faturadaki bilgi deftere geçti. Gözünüz bir solda bir sağda; hiçbir şey kaybolmadı.',
    },
    {
      title: 'Yer değiştirin: ☐ üzerinde bekleyin',
      html: `<p>Bir yol daha var. Not Defteri'nin sağ üstündeki <b>☐ (Ekranı kapla)</b> düğmesinin üzerine fareyi getirip <b>tıklamadan bekleyin</b>. Altında küçük bir kutu açılır.</p>
        <p>Kutudaki <b>sol yarıya</b> tıklayın: Not Defteri sola geçer.</p>`,
      mouse: '🖱 ☐ üzerinde bekleyin → sol yarı',
      hint: 'Fareyi ☐ düğmesinin üzerinde bir saniye tutun; tıklarsanız pencere ekranı kaplar. Öyle olursa ❐ ile geri alıp tekrar deneyin.',
      check: (c) => snapped(c, 'notepad', 'left'),
      on: (ev) => ev.type === 'win-snap' && ev.app === 'notepad' && ev.side === 'left',
      done: (c) => `Not Defteri sola geçti. ${snapped(c, 'mail', 'right') ? '' : 'Sağda yine liste çıktı; E-posta\'yı seçerseniz o da sağa yerleşir.'}`,
    },
    {
      title: 'Pencereyi kenardan ayırın',
      html: '<p>Bir pencereyi eski hâline getirmek için başlık çubuğundan tutup <b>ekranın ortasına</b> doğru sürükleyin. Pencere kenardan ayrılır ve eski boyutuna döner.</p>',
      mouse: '🖱 Başlık çubuğu → ekranın ortası',
      on: (ev) => ev.type === 'win-unsnap',
      done: 'Pencere kenardan ayrıldı; artık yine serbestçe taşınabilir.',
    },
    {
      title: 'Klavyeyle: ⊞ + ← ve ⊞ + →',
      html: `<p>Gerçek Windows'ta en hızlı yol klavyedir: bir pencereye tıklayıp ${K('⊞', '←')} basarsanız sola, ${K('⊞', '→')} basarsanız sağa yaslanır. ${K('⊞', '↑')} ekranı kaplatır.</p>
        <p>Bu alıştırma da bir pencerenin içinde çalışıyor; bu yüzden ⊞ tuşlu kısayollar burada değil, <b>bu sayfanın kendi penceresinde</b> çalışır. İsterseniz şimdi deneyin: ${K('⊞', '←')} ile bu ders sola kayar, ${K('⊞', '↑')} ile yine ekranı kaplar.</p>`,
      manual: 'Anladım ✔',
    },
    rehberSoru({
      title: 'Hangisi en kolayı?',
      html: '<p>İnternetteki bir tarifi Word\'e geçireceksiniz. En rahat yol hangisi?</p>',
      opts: ['Tarayıcıyı ve Word\'ü sürekli küçültüp büyütmek', 'Tarayıcıyı bir yarıya, Word\'ü öbür yarıya yaslamak', 'Tarifi önce kâğıda yazdırmak'], ok: 1,
      wrong: 'Bu yorucu ve yavaş. İkisini aynı anda görmenin yolu vardı.',
      why: 'Doğru: ekranı ikiye bölünce ikisini birden görürsünüz; okumak ve yazmak aynı anda olur. Tarifi kopyalayıp Word\'e yapıştırınca (Ctrl + V) yazı kendi renk ve yazı tipiyle gelebilir. Yapıştırdığınız yerdeki küçük (Ctrl) düğmesinden <b>Yalnızca Metni Koru</b>\'yu seçin.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Ekranı ikiye bölüp iki pencereyle birlikte çalışabiliyorsunuz:</p>' },
  ],
};
