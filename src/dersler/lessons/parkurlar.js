// Haftaların eksik parkurları (yönlendirmesiz, süreli uygulama): 9. hafta e-posta, 13. hafta günlük işler,
// 15. hafta bilgi güvenliği (12. hafta sunu parkuru sunu4.js'de). Eğitmen notu: son ekranda her görevin süresi görünür.
import { desktopReady, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { mailBox } from '../apps/mail.js';
import { FATURA } from './gunluk2.js';
import { HARITA_HOST } from '../apps/siteler-harita.js';
import { WA_HOST } from '../apps/siteler-mesaj.js';
import { DOST_HOST, DOST_MAIL, DOST_SIFRE } from '../apps/siteler-sosyal.js';
import { USB } from '../vfs.js';

const keyOf = (c, id) => mailBox(c.d).mails.find((m) => m.id === id)?.key;
const lower = (s) => String(s || '').toLocaleLowerCase('tr');

export const epostaParkur = {
  id: 'eposta-parkur', icon: '🏁', title: 'E-posta parkuru', minutes: 20, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: eki indirip doğru klasöre koymak, yanıtlamak, Bilgi (Cc) ile iletmek, sahte postayı silmek. Süreler tutulur.',
  steps: [
    {
      title: 'E-posta parkuru',
      html: `<p>9. haftada öğrendiklerinizi sırayla yapın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>
        <p>Adresler: Ahmet (oğlunuz) <b>ahmet@ornek.com</b>, Elif (torununuz) <b>elif@ornek.com</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Postayı açın', html: '<p><b>E-posta</b> programını açıp Elif\'in <b>Bayram fotoğrafı</b> postasını okuyun.</p>', hint: 'Başlat → E-posta. Gelen Kutusu\'nda Elif\'in postasına tıklayın.', on: (ev) => ev.type === 'mail-open' && ev.key === 'elif' },
    { title: '2. Eki indirin', html: '<p>Postadaki fotoğrafı <b>bilgisayara indirin</b>.</p>', hint: 'Fotoğrafın altındaki ⬇ İndir.', on: (ev) => ev.type === 'mail-download' },
    {
      title: '3. Doğru klasöre koyun', html: '<p>İndirdiğiniz <b>bayram.jpg</b>\'yi <b>Resimler</b> klasörüne taşıyın.</p>',
      hint: 'Dosya Gezgini → İndirilenler. bayram.jpg\'yi soldaki Resimler\'in üzerine sürükleyin (ya da Kes → Resimler → Yapıştır).',
      check: (c) => !!c.d.fs.find('pictures', 'bayram.jpg'),
      on: (ev, c) => (ev.type === 'fs' || ev.type === 'drop' || ev.type === 'file-paste') && !!c.d.fs.find('pictures', 'bayram.jpg'),
    },
    {
      title: '4. Hocaya yanıt', html: '<p>Bilgisayar Hocası\'nın <b>“Bu haftaki ders”</b> postasını <b>yanıtlayın</b>: derse geleceğinizi yazın.</p>',
      hint: 'Postayı açın → ↩ Yanıtla. Kime ve Konu kendiliğinden dolar; yalnızca mesajı yazıp ➤ Gönder.',
      on: (ev, c) => {
        if (ev.type === 'mail-send' && ev.replyKey === 'hoca' && ev.body.trim().length < 25) c.note('Gönderildi ama mesaj çok kısa görünüyor. Bir dahaki sefere birkaç kelime yazın.');
        return ev.type === 'mail-send' && ev.replyKey === 'hoca';
      },
    },
    {
      title: '5. Bilgi (Cc) ile iletin', html: '<p>Mahalle Eczanesi\'nin <b>“İlacınız hazır”</b> postasını <b>Ahmet\'e iletin</b>; Elif de <b>Bilgi (Cc)</b> olarak eklensin.</p>',
      hint: 'Postayı açın → ↪ İlet. Kime: ahmet@ornek.com. “Bilgi / Gizli” düğmesine basıp Bilgi (Cc) kutusuna elif@ornek.com yazın.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send' || keyOf(c, ev.forwardOf) !== 'eczane') return false;
        const to = ev.toList.map(lower), cc = ev.cc.map(lower);
        if (!to.includes('ahmet@ornek.com')) { c.warn('İletildi ama Kime kutusunda ahmet@ornek.com yoktu. Postayı yeniden iletin.'); return false; }
        if (!cc.includes('elif@ornek.com')) { c.warn('Elif Bilgi (Cc) kutusunda değildi. Yeniden iletin; “Bilgi / Gizli” düğmesini kullanın.'); return false; }
        return true;
      },
    },
    { title: '6. Sahte posta', html: '<p>Gelen Kutusu\'nda <b>sahte</b> bir posta var. Bulun ve <b>silin</b>.</p>', hint: '“Hesabınız askıya alındı” diyen, adresi garip postayı açın → 🗑 Sil. Bağlantısına tıklamayın!', on: (ev, c) => {
      if (ev.type === 'mail-link') c.warn('Sahte postadaki bağlantıya tıkladınız! Gerçek hayatta bu tehlikeli olurdu. Postayı silin.');
      return (ev.type === 'mail-delete' || ev.type === 'mail-spam') && ev.key === 'banka';
    } },
    { title: '7. Kaçan posta', html: '<p>Belediyenin <b>su kesintisi</b> duyurusu yanlışlıkla bir yere düşmüş. Bulun ve <b>Gelen Kutusu\'na</b> alın.</p>', hint: 'Soldan ⚠ İstenmeyen klasörüne bakın; postayı açıp ✔ İstenmeyen değil.', on: (ev) => ev.type === 'mail-notspam' && ev.key === 'belediye' },
    {
      title: '8. Ekli posta gönderin', html: '<p>Elif\'e yeni bir posta yazın; konusu <b>Çiçekler</b> olsun ve <b>Resimler</b>\'deki <b>çiçekler.jpg</b>\'yi ekleyin.</p>',
      hint: '✏ Yeni posta → Kime: elif@ornek.com, Konu: Çiçekler → 📎 Dosya ekle → Resimler → çiçekler.jpg → Aç → ➤ Gönder.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send' || !ev.toList.map(lower).includes('elif@ornek.com')) return false;
        if (!ev.attachments.some((a) => /çiçek/i.test(a))) { c.warn('Posta gitti ama çiçekler.jpg ekli değildi. Yeniden gönderin; 📎 Dosya ekle\'yi kullanın.'); return false; }
        return true;
      },
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>E-postayla ilgili bütün işleri kendiniz yaptınız.</p>' },
  ],
};

export const gunlukParkur = {
  id: 'gunluk-parkur', icon: '🏁', title: 'Günlük işler parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: yol tarifinin ekran resmini kaydetmek, PDF\'de bilgi bulup tek sayfa yazdırmak, belge gönderip oturumu kapatmak. Süreler tutulur.',
  setup: (c) => { put(c, 'desktop', 'elektrik faturası.pdf', 'file', { pages: FATURA }); },
  steps: [
    {
      title: 'Günlük işler parkuru',
      html: `<p>13. haftada öğrendiklerinizi sırayla yapın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>
        <p>Adresler: Haritalar <b>${HARITA_HOST}</b>, Mesajlaş Web <b>${WA_HOST}</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Yol tarifi', html: '<p>Haritalar sitesinde evinizden <b>Kültür Merkezi</b>\'ne <b>otobüsle</b> yol tarifi alın.</p>',
      hint: `İnternet → ${HARITA_HOST} → “kültür” arayın → ➜ Yol tarifi → Nereden: 📍 Konumunuz (ya da Lale Sokak 5) → 🚌 → Yol tarifi al.`,
      on: (ev, c) => {
        if (ev.type !== 'map-route') return false;
        if (ev.to !== 'kultur') { c.note('Yol tarifi başka bir yere çıktı. Nereye kutusuna “kültür merkezi” yazın.'); return false; }
        if (ev.mode !== 'bus') { c.note('Yol tarifi alındı ama otobüsle değil: 🚌 Toplu taşıma\'yı seçip yeniden deneyin.'); return false; }
        return true;
      },
    },
    {
      title: '2. Ekran resmi', html: '<p>Yol tarifi ekrandayken <b>ekranın resmini</b> alın.</p>',
      hint: 'PrtSc tuşu bütün ekranı, ⊞ + Shift + S istediğiniz parçayı alır.',
      on: (ev) => ev.type === 'printscreen' || ev.type === 'snip',
    },
    {
      title: '3. Resmi kaydedin', html: '<p>Ekran resmini Paint\'e yapıştırıp <b>Resimler</b> klasörüne <b>yol tarifi</b> adıyla kaydedin.</p>',
      hint: 'Başlat → Paint → Ctrl + V → Ctrl + S → Resimler → Dosya adı: yol tarifi → Kaydet.',
      on: (ev, c) => {
        if (ev.type !== 'save' || !/^yol tarifi\.(png|jpe?g)$/i.test(ev.name || '')) return false;
        if (ev.folder !== 'pictures') { c.note(`Kaydedildi ama ${ev.label || 'başka bir klasöre'}. Resimler klasörüne kaydedin (Farklı kaydet).`); return false; }
        return true;
      },
    },
    rehberSoru({
      title: '4. Faturada bilgi',
      html: '<p>Masaüstündeki <b>elektrik faturası.pdf</b>\'yi açın. Faturanın <b>son ödeme tarihi</b> ne?</p>',
      hint: 'Belgeyi açıp Ctrl + F ile “ödeme” arayın ya da sayfalar arasında gezin.',
      opts: ['25 Ekim 2026', '25 Kasım 2026', '1 Aralık 2026'], ok: 1,
      wrong: 'PDF\'de “Son ödeme tarihi” satırını bulun.',
      why: 'Doğru: 25 Kasım 2026, ikinci sayfada.',
    }),
    {
      title: '5. Tek sayfa yazdırın', html: '<p>Faturanın <b>yalnızca son ödeme tarihinin yazdığı sayfayı</b> yazdırın.</p>',
      hint: 'PDF Okuyucu → 🖨 Yazdır → Sayfalar: Geçerli sayfa (2. sayfadayken) ya da Aralık yaz → 2.',
      on: (ev, c) => {
        if (ev.type !== 'pdf-print') return false;
        if (ev.pagesPrinted !== 1 || ev.from !== 2) { c.note(`${ev.pagesPrinted} sayfa yazdırıldı (${ev.from}–${ev.to}). Yalnızca 2. sayfa çıkmalıydı: yeniden yazdırın.`); return false; }
        return true;
      },
    },
    {
      title: '6. Mesajlaş Web', html: '<p>Mesajlaş Web\'i açıp telefonunuzla <b>bağlanın</b>.</p>',
      hint: `İnternet → ${WA_HOST} → 📷 Telefonla karekodu okut.`,
      on: (ev) => ev.type === 'wa-scan',
    },
    {
      title: '7. Faturayı gönderin', html: '<p>Faturayı (<b>elektrik faturası.pdf</b>) <b>Ahmet</b>\'e gönderin.</p>',
      hint: 'Ahmet (oğlum) sohbetini açın → 📎 → Masaüstü → elektrik faturası.pdf → Aç.',
      on: (ev, c) => {
        if (ev.type !== 'wa-send-doc') return false;
        if (!/fatura/i.test(ev.name)) { c.note(`Gönderilen dosya “${ev.name}”. Elektrik faturasını gönderin.`); return false; }
        if (ev.toId !== 'ahmet') { c.warn('Belge yanlış kişiye gitti! Ahmet\'in sohbetini açıp yeniden gönderin.'); return false; }
        return true;
      },
    },
    {
      title: '8. Oturumu kapatın', html: '<p>Ortak bilgisayardasınız: Mesajlaş Web\'den <b>çıkın</b>.</p>',
      hint: 'Sohbet listesinin üstündeki ⋮ → ⏻ Oturumu kapat.',
      on: (ev) => ev.type === 'wa-logout',
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Günlük işleri yönlendirme olmadan kendiniz yaptınız.</p>' },
  ],
};

// 15. hafta: Bilgi güvenliği parkuru
const usbHas = (c, name) => c.d.fs.usb && Object.values(c.d.fs.nodes).some((n) => n.type === 'file' && lower(n.name) === name && c.d.fs.isInside(n.id, USB));

export const guvenlikParkur = {
  id: 'guvenlik-parkur', icon: '🏁', title: 'Bilgi güvenliği parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: belgeyi USB\'ye yedeklemek, iki adımlı doğrulamayı açıp yedek kodları indirmek, gizlilik, taklit hesap, çekiliş tuzağı, ortak Wi-Fi. Süreler tutulur.',
  steps: [
    {
      title: 'Bilgi güvenliği parkuru',
      html: `<p>15. haftada öğrendiklerinizi sırayla yapın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>
        <p>Dostlarım: <b>${DOST_HOST}</b> · <b>${DOST_MAIL}</b> · şifre <b>${DOST_SIFRE}</b></p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.fs.plugUsb(false); },
    },
    {
      title: '1. Yedek',
      html: '<p>USB belleği takın ve Belgeler\'deki <b>telefon numaraları</b> dosyasını belleğe <b>kopyalayın</b> (aslı Belgeler\'de kalsın).</p><button type="button" class="btn primary usb-btn">💾 USB belleği bilgisayara tak</button>',
      hint: 'Dosya Gezgini → Belgeler → dosyayı seç → Ctrl + C → USB Bellek (E:) → Ctrl + V.',
      setup: (c) => { document.querySelector('#stepBody .usb-btn').onclick = () => c.d.plugUsb(); },
      check: (c) => usbHas(c, 'telefon numaraları.txt') && !!c.d.fs.find('docs', 'telefon numaraları.txt'),
      on: (ev, c) => {
        if (ev.type === 'file-paste' && ev.op === 'cut') c.warn('Dosyayı taşıdınız; aslı Belgeler\'de kalmalıydı. Geri kopyalayın.');
        return usbHas(c, 'telefon numaraları.txt') && !!c.d.fs.find('docs', 'telefon numaraları.txt');
      },
    },
    { title: '2. Belleği çıkarın', html: '<p>USB belleği <b>güvenle</b> çıkarın.</p>', hint: 'Dosya Gezgini\'nde USB\'yi açıp ⏏ Çıkar ya da görev çubuğundaki 💾.', on: (ev) => ev.type === 'usb' && !ev.on },
    {
      title: '3. İki adımlı doğrulama', html: '<p>Dostlarım hesabınızda <b>iki adımlı doğrulamayı</b> SMS ile açın.</p>',
      hint: `İnternet → ${DOST_HOST} → giriş → ⚙ Ayarlar → Güvenlik → Aç → SMS ile kod → SMS'teki kodu yazın.`,
      on: (ev) => ev.type === 'ds-2fa-on',
    },
    { title: '4. Yedek kodlar', html: '<p>Yedek kodları <b>bilgisayara indirin</b>.</p>', hint: 'Açılan sayfadaki ⬇ Yedek kodları indir.', on: (ev) => ev.type === 'ds-backup-dl' },
    {
      title: '5. Telefon numarası', html: '<p>Telefon numaranızı <b>yalnızca sizin</b> görebileceğiniz hâle getirin.</p>',
      hint: '⚙ Ayarlar → Gizlilik → Telefon numaramı kimler görebilir? → 🔒 Yalnızca ben → Kaydet.',
      on: (ev) => ev.type === 'ds-privacy' && ev.telefon === 'ben',
    },
    {
      title: '6. Taklit hesap', html: '<p>Arkadaşlık istekleri arasındaki <b>taklit hesabı</b> bulun ve bildirin.</p>',
      hint: '🤝 İstekler: zaten arkadaşınız olan Hasan Demir adına, 0 ortak arkadaşlı yeni hesap → ⚑ Sahte hesap.',
      on: (ev, c) => {
        if (ev.type !== 'ds-request') return false;
        if (ev.id === 'sahte' && ev.action === 'ok') { c.warn('Taklit hesabı onayladınız! Gerçekte hemen arkadaşlıktan çıkarın.'); return false; }
        if (ev.id === 'fatma' && ev.action === 'report') c.note('Fatma Kaya gerçek bir komşunuzdu (14 ortak arkadaş).');
        return ev.id === 'sahte' && ev.action === 'report';
      },
    },
    {
      title: '7. Çekiliş tuzağı', html: '<p>Akıştaki <b>çekiliş tuzağını</b> şikâyet edin. Bağlantısına tıklamayın.</p>',
      hint: '🏠 Akış → Dostlarım Hediye gönderisi → ⚑ Şikâyet et.',
      on: (ev, c) => { if (ev.type === 'ds-scam-link') c.warn('Bağlantıya tıkladınız! Gerçekte sahte sayfaya giderdiniz.'); return ev.type === 'ds-report' && ev.id === 'cekilis'; },
    },
    {
      title: '8. Kafe ağı', html: '<p><b>Kafe_Ücretsiz</b> ağına bağlanıp onu <b>Ortak ağ</b> yapın; sonra bağlantıyı kesin.</p>',
      hint: 'Başlat → Ayarlar → Ağ ve İnternet → Kafe_Ücretsiz → Bağlan → Yine de bağlan → Hayır (Ortak ağ) → Bağlantıyı kes.',
      on: (ev, c) => {
        if (ev.type === 'net-profile' && ev.name === 'Kafe_Ücretsiz') c.s.prof = ev.profile;
        if (ev.type !== 'wifi-disconnect' || ev.name !== 'Kafe_Ücretsiz') return false;
        if (c.s.prof !== 'ortak') { c.note('Bağlantı kesildi ama ağ “Ortak ağ” yapılmamıştı. Yeniden bağlanıp Ortak ağ seçin, sonra kesin.'); return false; }
        return true;
      },
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Bilgi güvenliği işlerini yönlendirme olmadan kendiniz yaptınız.</p>' },
  ],
};
