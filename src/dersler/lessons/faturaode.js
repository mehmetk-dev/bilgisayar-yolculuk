// 14. hafta ek dersi: faturayı internetten ödemek. Faturada abone numarasını, tutarı ve son ödeme tarihini bulmak;
// internet şubesinde Ödemeler → Fatura Öde → borç sorgula → ad ve tutar kontrolü → SMS onayı → PDF makbuz;
// otomatik ödeme talimatının artısı ve eksisi; "faturanız ödenmedi" SMS'i tuzağı.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { BANKA_HOST, BANKA_SIFRE, FATURA_BANKA as F } from '../apps/siteler-banka.js';
import { KURS_TC } from '../apps/siteler-gunluk.js';

// Kâğıt faturanın küçük bir çizimi: üç bilgi renkli işaretli
const FATURA_CIZIM = `<div style="border:2px solid #666;background:#fffef8;color:#222;padding:0.6em 0.8em;font-size:0.9em;line-height:1.55;max-width:25em;margin:0.5em 0">
  <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #2e7d32;padding-bottom:0.3em;margin-bottom:0.3em"><b style="color:#2e7d32;font-size:1.15em">🌳 ${F.kurum.toLocaleUpperCase('tr')}</b><span>Elektrik faturası</span></div>
  <div>Sayın <b>${F.ad}</b> · Dönem: Ekim 2026</div>
  <div style="background:#fff59d;padding:0.1em 0.4em;margin:0.2em 0">Abone no: <b>${F.no}</b></div>
  <div style="background:#c8e6c9;padding:0.1em 0.4em;margin:0.2em 0">Ödenecek tutar: <b>${F.tutar} ₺</b></div>
  <div style="background:#ffcdd2;padding:0.1em 0.4em;margin:0.2em 0">Son ödeme tarihi: <b>${F.son}</b></div>
</div>`;

export const faturaOde = {
  id: 'fatura-ode', icon: '🧾', title: 'Faturayı internetten ödeyin', minutes: 30, stage: 'desktop',
  desc: 'Faturadan abone numarasını bulmak; internet şubesinde borç sorgulayıp ad ve tutarı kontrol ederek ödemek; makbuzu saklamak.',
  summary: [
    ['Faturada bakılacaklar', '<b>Abone (tesisat) numarası</b>, <b>tutar</b> ve <b>son ödeme tarihi</b>. Numara kurumdan kuruma ad değiştirir'],
    ['Nereden ödenir', 'Yalnızca güvenilir yerlerden ödeyin: bankanızın sitesi ya da uygulaması, kurumun resmî sitesi, e-Devlet. SMS ya da e-postayla gelen bağlantıdan ödemeyin'],
    ['Yol', 'Ödemeler → Fatura Öde → kurumu seç → abone no → <b>Borç sorgula</b>'],
    ['Ödemeden önce', '<b>Adı</b> (ör. AH*** YI***) ve <b>tutarı</b> faturayla karşılaştırın; numara yanlışsa başkasının borcu çıkar'],
    ['SMS kodu', 'Yalnızca bankanın sitesine yazılır; kimseye söylenmez'],
    ['📄 Makbuz (PDF)', 'Ödemenin kanıtı; <b>Belgeler\\Faturalar</b> gibi bir klasörde saklayın'],
    ['Otomatik ödeme', 'Artı: son günü kaçırmazsınız. Eksi: tutar ne çıkarsa ödenir; hesabı yine de takip edin'],
    ['“Faturanız ödenmedi” SMS\'i', 'İçindeki bağlantıya tıklamayın; bankanın ya da kurumun kendi sitesine kendiniz girin'],
  ],
  steps: [
    {
      title: 'Faturada neye bakılır?',
      html: `<p>Fatura kâğıtta, e-postada ya da telefonda gelir; üç bilgi hepsinde vardır:</p>${FATURA_CIZIM}
        <p><b style="background:#fff59d">Abone numarası</b> (bazen “tesisat no”) ödeyeceğiniz faturayı bulur. <b style="background:#c8e6c9">Tutar</b> ve <b style="background:#ffcdd2">son ödeme tarihi</b> da yazar.</p>
        <p>Ödemek için güvenli yerler: <b>bankanızın internet şubesi ya da uygulaması</b>, <b>kurumun resmî sitesi</b>, PTT. Bugün internet şubesini kullanacağız.</p>
        <p class="mut">Giriş bilgileri: T.C. Kimlik No <b>${KURS_TC}</b>, şifre <b>${BANKA_SIFRE}</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: BANKA_HOST }); },
    },
    {
      title: 'Giriş yapın',
      html: `<p>T.C. Kimlik No ve şifreyi yazıp <b>Devam</b>'a basın. Sağ altta gelen <b>SMS</b>'teki 6 haneli kodu yazıp <b>Giriş</b>'e basın.</p>
        <p class="mut">T.C.: <b>${KURS_TC}</b> · Şifre: <b>${BANKA_SIFRE}</b></p>`,
      hint: 'SMS bildirimi sağ altta 30 saniye kalır. Kodu oradan okuyup kutuya yazın.',
      on: (ev) => ev.type === 'bank-login',
      done: 'Girdiniz. Fatura ödemesi de para gönderme gibi SMS koduyla onaylanır.',
    },
    {
      title: 'Fatura Öde sayfasını açın',
      html: '<p>Üstteki menüden <b>Ödemeler</b>\'e tıklayın.</p>',
      hint: 'Menü sayfanın en üstünde: Hesaplarım, Para Gönder, Ödemeler, Kartlarım.',
      on: (ev) => ev.type === 'bill-open',
      done: 'Fatura Öde sayfası açıldı: kurum ve abone numarası soruyor.',
    },
    {
      title: 'Bilerek bir yanlışlık yapalım',
      html: `<p>Numarayı yanlış yazmak kolaydır. Ne olduğunu görmek için <b>bilerek</b> yanlış yazacağız.</p>
        <p>Kurum olarak <b>Elektrik: ${F.kurum}</b>'ı seçin. Abone numarasına <b>${F.yanlis}</b> yazın (doğrusunda son iki rakam ters). <b>Borç sorgula</b>'ya basın.</p>`,
      hint: `Kurum listesinden Elektrik: ${F.kurum}. Numara kutusuna ${F.yanlis} yazın.`,
      on: (ev, c) => {
        if (ev.type !== 'bill-query') return false;
        if (!ev.found) { c.warn(ev.reason === 'kurum' ? 'Önce listeden Elektrik: Çınar Elektrik\'i seçin.' : ev.reason === 'bos' ? `Abone numarasını yazın: ${F.yanlis}` : `Borç bulunamadı. Numarayı ${F.yanlis} diye yazın.`); return false; }
        if (ev.mine) { c.warn(`Bu kez numarayı doğru yazdınız. Alıştırma için ${F.yanlis} yazın (son iki rakam ters).`); return false; }
        return true;
      },
      done: 'Borç çıktı ama bu sizin borcunuz değil: başka birinin elektrik faturası. Banka hata saymadı, çünkü o numara da gerçek bir abonelik.',
    },
    rehberSoru({
      title: 'Bu fatura sizin mi?',
      html: `<p>Ekranda <b>Abone adı: ME*** KA***</b> ve <b>3.412,80 ₺</b> yazıyor. Sizin adınız ${F.ad}. Ne yaparsınız?</p>`,
      opts: ['Hayır, numarayı yeniden yazarım', 'Evet, borç görünüyor; hemen ödeyip kurtulayım', 'Tutar da yüksek, yine de bankaya güvenirim'], ok: 0,
      wrong: 'Ad sizin adınız değilse bu fatura sizin değildir. Ödeme çoğu zaman geri alınmaz.',
      why: 'Doğru: ad kısmen gizli (ilk iki harf) ama size ait değilse hemen durun. Numarayı faturadan bir daha okuyun; tutarı da faturayla karşılaştırın.',
    }),
    {
      title: 'Doğru numarayla sorgulayın',
      html: `<p>Şimdi faturadaki numarayı yazın: <b>${F.no}</b>. Kurum yine <b>${F.kurum}</b>. <b>Borç sorgula</b>'ya basın.</p>
        <p>Çıkan ekranda kontrol edin: <b>ad</b> (AH*** YI***), <b>tutar</b> (${F.tutar} ₺) ve <b>son ödeme tarihi</b> faturadakiyle aynı mı?</p>`,
      hint: `Numara kutusundaki eski yazıyı silin, ${F.no} yazın. Boşluk koymasanız da olur.`,
      on: (ev, c) => {
        if (ev.type !== 'bill-query') return false;
        if (!ev.found) { c.warn(ev.reason === 'kurum' ? 'Önce listeden kurumu seçin.' : 'Borç bulunamadı. Numarayı faturadan bir daha okuyun.'); return false; }
        if (!ev.mine) { c.warn('Bu hâlâ başkasının faturası: ad ME*** KA***. Numaranın son iki rakamını faturadaki gibi yazın.'); return false; }
        return true;
      },
      done: 'Ad sizin, tutar ve tarih faturayla aynı. Ödeme öncesi bu kontrol yeter; bunu alışkanlık yapın.',
    },
    {
      title: 'Ödeyin ve SMS ile onaylayın',
      html: '<p><b>Öde</b>\'ye basın. Bilgileri bir daha kontrol edin; sağ altta gelen SMS kodunu yazıp <b>Onayla ve öde</b>\'ye basın.</p>',
      hint: 'SMS bildirimi birkaç saniye sonra sağ altta çıkar. Kod 6 hanelidir.',
      on: (ev, c) => {
        if (ev.type === 'bill-pay-other') c.warn('Bu fatura sizin değil. Önce doğru numarayla yeniden sorgulayın.');
        return ev.type === 'bill-paid';
      },
      done: 'Fatura ödendi. SMS kodunu yalnızca bankanın kendi sayfasına yazdık; telefonda ya da mesajla kimse sizden bu kodu isteyemez.',
    },
    {
      title: 'Makbuzu indirin',
      html: `<p><b>📄 Makbuzu indir (PDF)</b>'e basın.</p>
        <p>PDF indiremezseniz ekran görüntüsü de olur: ${K('PrtSc')} tuşu ekranı kaydeder. Ama bankanın PDF makbuzu daha düzgündür.</p>`,
      hint: 'Düğme ödeme tamamlandı yazısının hemen altındadır.',
      on: (ev) => ev.type === 'bill-receipt',
      done: 'Makbuz <b>İndirilenler</b>\'e indi. Ödediğinizin kanıtıdır; fatura bir yanlışlıkla “ödenmemiş” görünürse bunu gösterirsiniz. Belgeler içinde “Faturalar” adlı bir klasörde saklayın.',
    },
    {
      title: 'Otomatik ödeme nedir?',
      html: '<p>Aynı sayfada <b>ℹ Otomatik ödeme talimatı nedir?</b> düğmesine basıp yazıyı okuyun.</p>',
      on: (ev) => ev.type === 'bill-auto-info' && ev.on,
      done: 'Artısı: son günü kaçırmazsınız. Eksisi: tutar ne olursa ödenir, hesapta para yoksa ödeme olmaz. Kullanırsanız hesabınızı her ay yine kontrol edin.',
    },
    {
      title: 'Çıkış yapın',
      html: '<p>Sağ üstteki <b>⏻ Çıkış</b>\'a basın.</p><p class="mut">İndirilenler paneli açıksa önce sağ üstündeki ✕ ile kapatın.</p>',
      hint: 'İndirilenler paneli açık kaldıysa çıkış düğmesinin üstünü kapatıyor olabilir: panelin ✕ işaretine basın.',
      setup: () => document.querySelectorAll('.br-dlpanel').forEach((p) => { p.hidden = true; }),
      on: (ev) => ev.type === 'bank-logout',
      done: 'İnternet şubesinden çıktınız. Ortak bilgisayarda bu adımı atlamayın.',
    },
    rehberSoru({
      title: 'Telefona SMS geldi',
      html: '<p>“Elektrik faturanız ödenmedi, kesinti olacak. Hemen ödemek için bu bağlantıya tıklayın” yazan bir SMS geldi. Ne yaparsınız?</p>',
      opts: ['Tıklamam, bankaya kendim girerim', 'Hemen tıklarım, elektrik kesilmesin', 'Tıklayıp yalnızca tutara bakarım ama ödemem'], ok: 0,
      wrong: 'Bağlantı sahte bir ödeme sayfasına gidebilir; kart ve şifre bilgilerinizi çalarlar. “Sadece bakmak” bile risklidir.',
      why: 'Doğru: bağlantıya basmayın. Gerçek borcu bankanın kendi sitesinden ya da kurumun resmî sitesinden, adresi kendiniz yazarak görün. Bu tuzağın ayrıntısını 15. haftada “Dolandırıldım, ne yapmalıyım?” dersinde göreceğiz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Faturayı internetten güvenle ödemeyi öğrendiniz:</p>' },
  ],
};
