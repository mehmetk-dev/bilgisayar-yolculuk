// Haftaların eksik parkurları (yönlendirmesiz, süreli uygulama): 9. hafta e-posta, 12. hafta sunu, 13. hafta günlük işler.
// Eğitmen notu: son ekranda her görevin süresi görünür.
import { desktopReady } from './common.js';
import { mailBox } from '../apps/mail.js';

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
