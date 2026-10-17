// Haftaların eksik parkurları (yönlendirmesiz, süreli uygulama): 9. hafta e-posta, 13. hafta günlük işler
// (12. hafta sunu parkuru sunu4.js'de). Eğitmen notu: son ekranda her görevin süresi görünür.
import { desktopReady, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { mailBox } from '../apps/mail.js';
import { FATURA } from './gunluk2.js';
import { HARITA_HOST } from '../apps/siteler-harita.js';
import { WA_HOST } from '../apps/siteler-mesaj.js';

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
