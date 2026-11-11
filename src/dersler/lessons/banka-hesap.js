import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { siteName } from '../apps/sites.js';
import { BANKA_HOST, BANKA_SIFRE } from '../apps/siteler-banka.js';
import { KURS_TC } from '../apps/siteler-gunluk.js';

const BANKA_SITE = siteName(BANKA_HOST);
const HESAP_URL = `${BANKA_HOST}/hesap`;
const bankaDurumu = (c) => (c.d.webState[BANKA_SITE] ||= {});

function bankayiAc(c, url) {
  desktopReady(c);
  const w = maxed(c, 'browser', { url });
  if (w.api.url === url) w.api.refresh();
  else w.api.go(url, 'link');
}

function smsTemizle(st) {
  st.smsEl?.remove();
  st.smsEl = null;
  st.loginCode = null;
  st.err = '';
}

function hesabiAc(c) {
  const st = bankaDurumu(c);
  // Girişten sonraki bir adıma dönüldüğünde örnek oturumu geri aç.
  if (!st.user) {
    smsTemizle(st);
    st.user = true;
  }
  bankayiAc(c, HESAP_URL);
}

export const bankaHesap = {
  id: 'banka-hesap', icon: '🏦', title: 'Hesap bakiyesini ve hareketleri okuyun', minutes: 8, stage: 'desktop',
  desc: 'Örnek banka hesabındaki parayı, gelen ve giden hareketleri bulun. İşiniz bitince oturumu kapatın.',
  summary: [
    ['Bakiye', 'Hesabınızda o anda bulunan para.'],
    ['Son hareketler', 'Tarih, açıklama ve tutar. Bu örnek hesapta + gelen, − giden parayı gösterir.'],
    ['Çıkış', 'İnternet şubesindeki Çıkış düğmesi oturumunuzu kapatır.'],
  ],
  steps: [
    {
      title: 'Örnek banka hesabına giriş yapın',
      html: `<p>Bankam bir alıştırma sitesidir. Girişte aşağıdaki örnek bilgileri kullanın.</p>
        <p>T.C. Kimlik No <b>${KURS_TC}</b><br>Şifre <b>${BANKA_SIFRE}</b></p>
        <p><b>Devam</b>'a basın. Sağ alttaki örnek SMS'te görünen 6 haneli kodu yazıp <b>Giriş</b>'e basın.</p>`,
      hint: 'SMS bildirimi kapandıysa üstteki ilk adıma yeniden tıklayın. Örnek bilgileri yazıp yeni kod isteyin.',
      setup: (c) => {
        const st = bankaDurumu(c);
        if (!st.user) smsTemizle(st);
        bankayiAc(c, st.user ? HESAP_URL : BANKA_HOST);
      },
      check: (c) => !!bankaDurumu(c).user,
      on: (ev) => ev.type === 'bank-login' && ev.host === BANKA_HOST,
      done: 'Hesaplarım sayfası açıldı. Şimdi bakiyeyi ve son hareketleri okuyacağız.',
    },
    rehberSoru({
      title: 'Bakiyeyi bulun',
      html: '<p><b>Hesaplarım</b> sayfasına bakın. Hesabınızda şu anda ne kadar para olduğunu hangi tutar gösterir?</p>',
      opts: ['Son hareketlerdeki en üst tutar', 'Vadesiz TL Hesabı başlığının altındaki tutar', 'Emekli maaşı satırındaki tutar'],
      ok: 1,
      wrong: 'Hesaptaki paranın tamamını görmek için sayfanın üst kısmına bakın.',
      why: 'Vadesiz TL Hesabı başlığının altındaki büyük tutar bakiyedir. Ekrandaki tutarı okuyun.',
      setup: hesabiAc,
    }),
    rehberSoru({
      title: 'Gelen ve giden parayı ayırt edin',
      html: '<p><b>Son hareketler</b> listesindeki <b>Emekli maaşı</b> ve <b>Market</b> satırlarını bulun. Tarihlerini ve tutarlarını okuyun. Hangisi gelen, hangisi giden para?</p>',
      opts: ['Market gelen, emekli maaşı giden para.', 'İkisi de hesaptan giden para.', 'Emekli maaşı gelen, market giden para.'],
      ok: 2,
      wrong: 'Her satırın sonundaki tutarın başına bakın. + hesaba gelen, − hesaptan giden parayı gösterir.',
      why: 'Maaşın tutarı + ile başlıyor. Market harcaması ise − ile gösteriliyor.',
      setup: hesabiAc,
    }),
    {
      title: 'Oturumu kapatın',
      html: '<p>Bankam sayfasının üstündeki <b>Çıkış</b> düğmesine basın. <b>İnternet Şubesi Girişi</b> ekranı yeniden görünür.</p>',
      hint: 'Çıkış düğmesi, Bankam sayfasında Kartlarım bağlantısının yanındadır.',
      setup: hesabiAc,
      on: (ev, c) => ev.type === 'bank-logout' && ev.host === BANKA_HOST && !bankaDurumu(c).user,
      done: 'Oturum kapandı. Özellikle ortak bilgisayarlarda işiniz bitince bankanın Çıkış düğmesini kullanın.',
    },
    {
      final: true,
      title: 'Hesap okuma alıştırması tamamlandı',
      html: '<p>Bakiyeyi buldunuz, gelen ve giden parayı ayırt ettiniz ve internet şubesinden çıktınız.</p>',
    },
  ],
};
