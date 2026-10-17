// 14. hafta ek dersi: internet bankacılığında güvenli işler. Asıl kartı internet alışverişine kapatıp limitli
// sanal kart oluşturmak; mesajdaki IBAN'ı kopyalayıp yapıştırarak aidat ödemek; dekontu PDF indirip göndermek.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { BANKA_HOST, BANKA_SIFRE, YONETICI } from '../apps/siteler-banka.js';
import { KURS_TC } from '../apps/siteler-gunluk.js';
import { WA_HOST } from '../apps/siteler-mesaj.js';

const ibanKey = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

export const sanalKart = {
  id: 'sanal-kart-iban', icon: '💳', title: 'Sanal kart, IBAN kopyalama ve dekont', minutes: 35, stage: 'desktop',
  desc: 'Limitli sanal kartla güvenli alışveriş; IBAN\'ı yazmadan kopyalayıp aidat ödemek, dekontu indirip göndermek.',
  summary: [
    ['Asıl kart: internete kapalı', 'Kartlarım → “İnternet alışverişine açık” kutusunu boşaltın; numara çalınsa da internetten harcanamaz'],
    ['Sanal kart', 'İnternet için ayrı numara; yalnızca belirlediğiniz limit kadar harcanır, sonra silinebilir'],
    ['IBAN', 'TR + 24 rakam = 26 karakter. Elle yazmayın: seçip ' + K('Ctrl', 'C') + ', kutuya ' + K('Ctrl', 'V')],
    ['Alıcı adı', 'Banka adı IBAN sahibiyle karşılaştırır; uyuşmazsa para gitmez'],
    ['SMS kodu', 'Yalnızca bankanın sitesine yazılır; kimse telefonla isteyemez'],
    ['📄 Dekont (PDF)', 'Ödediğinizin kanıtı; İndirilenler\'e iner, mesajla ya da e-postayla gönderilir'],
    ['⏻ Çıkış', 'İş bitince internet şubesinden mutlaka çıkın'],
  ],
  steps: [
    {
      title: 'Bankacılık işleri',
      html: `<p>Bugün iki iş yapacağız: <b>internet alışverişi için güvenli bir kart</b> hazırlamak ve apartman yöneticisinin gönderdiği <b>IBAN'a aidat ödemek</b>.</p>
        <p>Alıştırma bankasına giriş bilgileri: T.C. Kimlik No <b>${KURS_TC}</b>, şifre <b>${BANKA_SIFRE}</b>. Gerçek şifrenizi kimseye söylemeyin, hiçbir yere yazmayın.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: BANKA_HOST }); },
    },
    {
      title: 'Giriş yapın',
      html: `<p>T.C. Kimlik No ve şifreyi yazıp <b>Devam</b>'a basın. Sağ altta bankadan <b>SMS</b> gelir; içindeki 6 haneli kodu yazıp <b>Giriş</b>'e basın.</p>
        <p class="mut">T.C.: <b>${KURS_TC}</b> · Şifre: <b>${BANKA_SIFRE}</b></p>`,
      hint: 'SMS bildirimi sağ altta 30 saniye kalır. Kodu oradan okuyup kutuya yazın.',
      on: (ev) => ev.type === 'bank-login',
      done: 'Girdiniz. Şifre ve SMS kodu birlikte istendiği için şifrenizi öğrenen biri tek başına giremez.',
    },
    {
      title: 'Asıl kartı internete kapatın',
      html: '<p>Üstten <b>Kartlarım</b>\'a tıklayın. Banka kartınızın altındaki <b>İnternet alışverişine açık</b> kutusunun işaretini kaldırın.</p>',
      on: (ev) => ev.type === 'bank-card-online' && !ev.on,
      done: 'Asıl kartınız artık internette kullanılamaz. Market ve ATM\'de yine çalışır.',
    },
    {
      title: 'Sanal kart oluşturun',
      html: '<p>Sağdaki <b>Sanal kart oluştur</b> bölümünde limit olarak <b>500</b> yazın, geçerlilik <b>1 ay</b> kalsın; <b>Oluştur</b>\'a basın.</p>',
      hint: 'Limit kutusuna yalnızca rakam yazın: 500',
      on: (ev, c) => {
        if (ev.type !== 'bank-vcard') return false;
        if (ev.limit > 1000) c.note(`Limit ${ev.limit} ₺ oldu. Sanal kartın amacı küçük limit: alışverişiniz kadar.`);
        return true;
      },
      done: 'Mor renkli sanal kart hazır: kendi numarası, son kullanma tarihi ve güvenlik kodu (CVV) var.',
    },
    {
      title: 'Kart bilgileri',
      html: '<p>Numaranın tamamı gizli. <b>👁 Bilgileri göster</b>\'e basın. Alışveriş sitesinde bu numarayı ve CVV\'yi kullanacaksınız.</p>',
      on: (ev) => ev.type === 'bank-vcard-show' && ev.on,
      done: 'Alışveriş sırasında bu numarayı <b>📋 Numarayı kopyala</b> ile kopyalayıp sitedeki kart kutusuna yapıştırabilirsiniz.',
    },
    rehberSoru({
      title: 'Neden sanal kart?',
      html: '<p>Sanal kartla alışveriş yaptığınız sitenin bilgileri çalındı. Ne olur?</p>',
      opts: ['Hesabımdaki bütün para gider', 'En fazla sanal kartın limiti (500 ₺) kadar harcanabilir; kartı silerim, biter', 'Asıl kartımın şifresi de çalınır'], ok: 1,
      wrong: 'Sanal kartın numarası asıl kartınızdan ve hesabınızdan ayrıdır.',
      why: 'Doğru: sanal kartın limiti bir duvardır. İş bitince “Sanal kartı sil” derseniz numara tamamen geçersiz olur.',
    }),
    {
      title: 'Yöneticinin mesajı',
      html: `<p>Şimdi aidat. ${K('Ctrl', 'T')} ile <b>yeni sekme</b> açıp <b>${WA_HOST}</b> adresine gidin; karekodu okutun ve <b>Hasan Bey (apt. yöneticisi)</b> sohbetini açın.</p>`,
      hint: 'Yeni sekmede adres çubuğuna web.mesajlas.com yazıp Enter. 📷 Telefonla karekodu okut → soldan Hasan Bey.',
      on: (ev) => ev.type === 'wa-chat' && /Hasan/.test(ev.name),
      done: `Hasan Bey aidatın ${YONETICI.aidat} ₺ olduğunu ve IBAN'ını yazmış.`,
    },
    {
      title: 'IBAN\'ı kopyalayın',
      html: `<p>IBAN'ı <b>elle yazmayacağız</b>. Fareyle <b>TR</b>'nin hemen soluna basılı tutun, IBAN'ın sonuna kadar sürükleyip bırakın: IBAN mavi boyanır. Sonra ${K('Ctrl', 'C')}.</p>`,
      hint: 'Fazladan “IBAN:” yazısı da seçilse sorun olmaz; banka yalnızca TR ve rakamları alır. Sağ tık → Kopyala da olur.',
      on: (ev, c) => {
        if (ev.type !== 'web-copy') return false;
        if (!ibanKey(ev.text).includes(ibanKey(YONETICI.iban))) { c.note('Kopyalanan yazıda IBAN\'ın tamamı yok. TR\'den son rakama kadar seçip yeniden kopyalayın.'); return false; }
        return true;
      },
      done: '26 karakter panoda. Tek rakam bile kaçmadı.',
    },
    {
      title: 'Bankaya yapıştırın',
      html: `<p>Banka sekmesine dönün; üstten <b>Para Gönder</b>'e tıklayın. <b>Alıcı IBAN</b> kutusuna tıklayıp ${K('Ctrl', 'V')} ile yapıştırın.</p>`,
      hint: 'Sekmeler pencerenin en üstünde. Bankam sekmesine tıklayın.',
      on: (ev, c) => {
        if (ev.type !== 'bank-iban-paste') return false;
        if (!ev.same) { c.note('Yapıştırılan IBAN yöneticininki değil. Kutuyu temizleyip yeniden yapıştırın.'); return false; }
        return true;
      },
      done: 'IBAN yerinde. Kopyala-yapıştır, 26 karakteri tek tek yazmaktan hem hızlı hem güvenli.',
    },
    {
      title: 'Ödemeyi yapın',
      html: `<p>Alıcının adı: <b>${YONETICI.ad}</b> · Tutar: <b>${YONETICI.aidat}</b> · Açıklama: <b>Ekim aidatı Daire 7</b>. <b>Devam</b>'a basın, bilgileri kontrol edin; SMS kodunu yazıp <b>Onayla ve gönder</b>.</p>`,
      hint: 'Alıcı adını mesajdaki gibi yazın: Hasan Demir. Tutar yalnızca rakam: 750.',
      on: (ev, c) => {
        if (ev.type === 'bank-send' && !ev.ok) c.note('Banka formu kabul etmedi: kırmızı yazıyı okuyun.');
        if (ev.type !== 'bank-transfer') return false;
        if (ev.tutar !== YONETICI.aidat) c.note(`${ev.tutar} ₺ gönderildi; aidat ${YONETICI.aidat} ₺ idi. Gerçekte tutarı göndermeden önce mutlaka kontrol edin.`);
        return true;
      },
      done: 'Para gönderildi. Banka, alıcının adını IBAN sahibiyle karşılaştırdı ve SMS ile onayınızı aldı.',
    },
    {
      title: 'Dekontu indirin',
      html: '<p><b>📄 Dekontu indir (PDF)</b>\'e basın.</p>',
      on: (ev) => ev.type === 'bank-dekont',
      done: 'Dekont <b>İndirilenler</b> klasörüne indi. Ödediğinizin resmî kanıtıdır.',
    },
    {
      title: 'Dekontu gönderin',
      html: `<p>Mesajlaş sekmesine dönün. Hasan Bey'in sohbetinde <b>📎</b>'a tıklayın, <b>İndirilenler</b>'den <b>dekont</b> dosyasını seçip <b>Aç</b>'a basın.</p>`,
      hint: 'Açılan pencerenin solunda İndirilenler klasörü var. Dosyanın adı “dekont-” ile başlar.',
      on: (ev, c) => {
        if (ev.type !== 'wa-send-doc') return false;
        if (ev.toId !== 'yonetici') { c.warn('Dekont başka birine gitti! Hasan Bey\'in sohbetini açıp yeniden gönderin.'); return false; }
        if (!/dekont/i.test(ev.name)) { c.note(`Gönderilen dosya “${ev.name}”. Bankadan indirdiğiniz dekontu gönderin.`); return false; }
        return true;
      },
      done: 'Dekont gitti; Hasan Bey birazdan teşekkür edecek.',
    },
    {
      title: 'Çıkış yapın',
      html: '<p>Banka sekmesine dönüp sağ üstteki <b>⏻ Çıkış</b>\'a basın.</p>',
      hint: 'İndirilenler paneli açık kaldıysa çıkış düğmesinin üstünü kapatıyor olabilir: panelin ✕ işaretine basın.',
      on: (ev) => ev.type === 'bank-logout',
      done: 'İnternet şubesinden çıktınız. Ortak bilgisayarda bu adım çok önemlidir.',
    },
    rehberSoru({
      title: 'Telefon geldi',
      html: '<p>Biri arayıp “Bankanızdan arıyorum, hesabınızı korumak için telefonunuza gelen kodu söyleyin” diyor. Ne yaparsınız?</p>',
      opts: ['Kodu söylerim, bankadan arıyorlar', 'Kodu söylemem, telefonu kapatırım; bankanın kendi numarasını ben ararım', 'Yalnızca ilk üç rakamı söylerim'], ok: 1,
      wrong: 'Banka SMS kodunu asla telefonla istemez. Kodu söylerseniz paranızı onlar gönderir.',
      why: 'Doğru: SMS kodu yalnızca bankanın sitesine yazılır. Şüphelenince kartın arkasındaki numarayı kendiniz arayın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternet bankacılığında güvenli işler:</p>' },
  ],
};
