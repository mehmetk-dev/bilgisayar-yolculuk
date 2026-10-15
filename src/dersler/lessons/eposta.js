// 9. hafta: e-posta. Posta okumak, ek indirmek, yanıtlamak, ekli posta göndermek, sahte postayı tanımak.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const mailOpen = (c) => maxed(c, 'mail');
// Yanıtta, alıntılanan eski postanın üstüne öğrencinin yazdığı kısım
const ownText = (body) => body.split(/\n--- /)[0].trim();

export const eposta = {
  id: 'eposta', icon: '✉', title: 'E-posta: okuma, yanıtlama, ek', minutes: 35, stage: 'desktop',
  desc: 'Postayı okumak, yanıtlamak, eki indirmek, yeni posta göndermek.',
  summary: [
    ['E-posta adresi', 'ad@ornek.com: Türkçe harf ve boşluk olmaz; @ için AltGr + Q'],
    ['Kalın yazılı posta', 'Henüz okunmamış'],
    ['📎', 'Postada ek (dosya) var'],
    ['⬇ İndir', 'Eki bilgisayara kaydeder (İndirilenler klasörü)'],
    ['↩ Yanıtla', 'Gönderene cevap; Kime kutusu kendiliğinden dolar'],
    ['↪ İlet', 'Postayı başka birine gönder'],
    ['📎 Dosya ekle', 'Postaya fotoğraf ya da belge ekler'],
    ['⚠ İstenmeyen', 'Sahte ve reklam postaları; bağlantısına tıklamayın'],
  ],
  steps: [
    {
      title: 'E-posta nedir?',
      html: `<p>E-posta, internet üzerinden gönderilen mektuptur. Birkaç saniyede ulaşır; içine fotoğraf ve belge de eklenebilir.</p>
        <ul class="big-list"><li>Herkesin bir <b>e-posta adresi</b> vardır: <b>elif@ornek.com</b></li><li>Ortadaki <b>@</b> (et) işareti için ${K('AltGr', 'Q')}.</li><li>Adreste <b>Türkçe harf</b> (ç, ğ, ı, ö, ş, ü) ve <b>boşluk</b> olmaz.</li></ul>
        <p class="mut">Bu derste alıştırma için bir posta kutusu kullanacağız. Adresler uydurmadır; hiçbir şey gerçekten gönderilmez.</p>`,
      setup: (c) => {
        desktopReady(c);
        c.d.closeAll();
        if (!c.d.fs.find('desktop', 'E-posta')) c.d.fs.create('desktop', { type: 'link', name: 'E-posta', app: 'mail' });
      },
    },
    {
      title: 'Posta kutusunu açın',
      html: '<p>Masaüstündeki <b>✉ E-posta</b> simgesine çift tıklayın.</p>',
      mouse: '🖱 ✉ E-posta: çift tık',
      hint: 'Simge masaüstünün solundaki simgelerin arasında. Başlat menüsünde de “E-posta” var.',
      check: (c) => !!c.d.find('mail'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'mail',
      done: 'Posta kutunuz açıldı. Soldaki <b>Gelen Kutusu</b>, size gelen postaları gösterir.',
    },
    {
      title: 'Postayı okuyun',
      html: `<p>Gelen Kutusu'nda <b>kalın</b> yazılı postalar henüz okunmamıştır. <b>📎</b> işareti, postada bir <b>ek</b> (dosya) olduğunu gösterir.</p>
        <p><b>Elif</b>'ten gelen “Bayram fotoğrafı” postasına tıklayıp açın.</p>`,
      mouse: '🖱 Postaya tıklayın',
      setup: mailOpen,
      on: (ev) => ev.type === 'mail-open' && ev.key === 'elif',
      done: 'Üstte kimden geldiği, altta mesaj ve ek görünüyor.',
    },
    {
      title: 'Eki indirin',
      html: '<p>Postanın altındaki fotoğrafın yanında <b>⬇ İndir</b> düğmesine tıklayın. Fotoğraf bilgisayarınıza kaydedilir.</p>',
      mouse: '🖱 ⬇ İndir',
      on: (ev) => ev.type === 'mail-download',
      done: 'Fotoğraf <b>İndirilenler</b> klasörüne kaydedildi. Dosya Gezgini\'nden açabilirsiniz.',
    },
    {
      title: 'Yanıtlayın',
      html: `<ol class="steps"><li>Üstteki <b>↩ Yanıtla</b> düğmesine tıklayın. <b>Kime</b> ve <b>Konu</b> kendiliğinden dolar.</li>
        <li>Büyük beyaz alanın <b>en üstüne</b> kısa bir cevap yazın, örneğin: <b>Teşekkürler Elif, fotoğraf çok güzel!</b></li>
        <li><b>➤ Gönder</b>'e tıklayın.</li></ol>`,
      hint: 'Mesaj alanında alttaki çizgili kısım Elif\'in eski postasıdır; ona dokunmayın, cevabınızı onun üstüne yazın.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (ev.replyKey !== 'elif') { c.warn('Posta gönderildi ama bu, Elif\'in postasına bir yanıt değil. Elif\'in postasını açıp ↩ Yanıtla\'ya tıklayın.'); return false; }
        if (ownText(ev.body).length < 3) { c.warn('Yanıt gitti ama içine bir şey yazmamışsınız. Bir daha deneyin: Elif\'in postasını açın, ↩ Yanıtla, kısa bir cevap yazın.'); return false; }
        return true;
      },
      done: 'Yanıtınız gönderildi. Gönderdiğiniz postalar soldaki <b>📤 Gönderilenler</b> klasöründe durur.',
    },
    {
      title: 'Cevap geldi',
      html: '<p>Birkaç saniye içinde Elif cevap yazacak. Ekranın sağ altında “Yeni posta” bildirimi çıkınca <b>📥 Gelen Kutusu</b>\'na tıklayın ve en üstteki yeni postayı açın.</p>',
      mouse: '🖱 Gelen Kutusu → yeni posta',
      on: (ev) => ev.type === 'mail-open' && !!ev.replyOf,
      done: 'Elif sizden bir fotoğraf istiyor. Şimdi postaya fotoğraf ekleyeceğiz.',
    },
    {
      title: 'Fotoğraf gönderin',
      html: `<ol class="steps"><li>Soldaki <b>✏ Yeni posta</b>'ya tıklayın.</li><li><b>Kime</b>: <b>elif@ornek.com</b></li><li><b>Konu</b>: <b>Bahçemiz</b></li>
        <li><b>📎 Dosya ekle</b>'ye tıklayın, <b>Resimler</b> klasöründen <b>çiçekler.jpg</b>'yi seçip <b>Aç</b>'a basın.</li><li>Kısa bir mesaj yazıp <b>➤ Gönder</b>.</li></ol>`,
      hint: `@ işareti için ${K('AltGr', 'Q')}. Adreste Türkçe harf yok: elif@ornek.com. Dosya seçme penceresinde soldan “Resimler”e tıklayın.`,
      on: (ev, c) => {
        if (ev.type === 'mail-attach') c.note(`Eklendi: <b>${ev.name}</b>. Şimdi mesajınızı yazıp Gönder'e basın.`);
        if (ev.type !== 'mail-send' || ev.to.toLowerCase() !== 'elif@ornek.com') return false;
        if (!ev.attachments.includes('çiçekler.jpg')) { c.warn('Posta gitti ama içinde çiçekler.jpg yok. Yeni bir posta açıp önce 📎 Dosya ekle\'ye tıklayın.'); return false; }
        return true;
      },
      done: 'Ekli postanız gönderildi. Fotoğraf, belge, fatura… her türlü dosya böyle gönderilir.',
    },
    rehberSoru({
      title: 'Hangi adres doğru?',
      html: '<p>Elif\'in adresini bir kâğıda yazmışlar. Hangisi <b>doğru</b> yazılmış?</p>',
      opts: ['elif ornek.com', 'elif@örnek.com', 'elif@ornek,com', 'elif@ornek.com'], ok: 3,
      wrong: 'Bu adreste bir hata var. @ işareti, Türkçe harf ve nokta-virgül farkına dikkat edin.',
      why: 'Doğru! Adreste bir @ olur, Türkçe harf ve boşluk olmaz, sonda virgül değil nokta vardır. Tek harf yanlışsa posta gitmez.',
    }),
    {
      title: 'Sahte posta',
      html: `<p>Gelen Kutusu'nda <b>“ACİL: Hesabınız askıya alındı!”</b> diye bir posta var. Açıp okuyun.</p>
        <p>Bu bir <b>dolandırıcılık</b> postasıdır: bankalar e-postayla şifre ya da kart numarası istemez. Bağlantısına <b>tıklamayın</b>; üstteki <b>⚠ İstenmeyen</b> düğmesine basın.</p>`,
      mouse: '🖱 Postayı açın → ⚠ İstenmeyen',
      hint: 'Gönderenin adresine bakın: bankaniz-dogrulama.xyz. Gerçek bir bankanın adresi değil.',
      setup: (c) => { if (!c.d.find('mail')) mailOpen(c); },
      on: (ev, c) => {
        if (ev.type === 'mail-link') c.warn('Gerçek hayatta bu bağlantıya tıklamak tehlikelidir! Sahte bir siteye gider ve şifrenizi çalabilir. Şimdi ⚠ İstenmeyen\'e basın.');
        if (ev.type === 'mail-open' && ev.key === 'banka') c.note('Gönderenin adresine bakın: <b>bankaniz-dogrulama.xyz</b>. Şimdi ⚠ İstenmeyen\'e basın.');
        return (ev.type === 'mail-spam' || ev.type === 'mail-delete') && ev.key === 'banka';
      },
      done: 'Sahte posta kaldırıldı. Şüphelendiğiniz bir postada bankanızı <b>kartın arkasındaki numaradan</b> kendiniz arayın.',
    },
    {
      title: 'Hocanıza yazın',
      html: '<p>Şimdi kendi başınıza: hocanıza bir posta gönderin. Adresi: <b>hoca@ornek.com</b></p><p>Konuya ve mesaja ne yazacağınız size kalmış.</p>',
      hint: 'Soldaki ✏ Yeni posta → Kime, Konu, mesaj → ➤ Gönder.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (ev.to.toLowerCase() !== 'hoca@ornek.com') { c.warn(`Posta <b>${ev.to}</b> adresine gitti. Hocanın adresi: hoca@ornek.com`); return false; }
        if (ownText(ev.body).length < 3) { c.warn('Posta gitti ama mesaj kısmı boş. Bir de mesaj yazarak tekrar gönderin.'); return false; }
        return true;
      },
      done: 'Hocanız da cevap yazacak; Gelen Kutusu\'na bakabilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Artık e-posta okuyup gönderebiliyorsunuz:</p>' },
  ],
};
