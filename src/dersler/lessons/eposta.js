// 9. hafta: e-posta. Posta okumak, ek indirmek, yanıtlamak, ekli posta göndermek, sahte postayı tanımak.
import { deliverMail, mailBox, ME } from '../apps/mail.js';
import { K, PIC, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';

const mailOpen = (c) => maxed(c, 'mail');
// Yanıtta, alıntılanan eski postanın üstüne öğrencinin yazdığı kısım
const ownText = (body) => body.split(/\n--- /)[0].trim();
const ELIF = 'elif@ornek.com';
const SUBJECT = 'Ynt: Bayram fotoğrafı';
const PHOTO = 'çiçekler.jpg';
const SIMILAR_PHOTO = 'çiçekler-2.jpg';
const BAYRAM = 'bayram.jpg';
const hasBayram = (c, folder) => c.d.fs.children(folder).some((f) => /^bayram/i.test(f.name));

function photos(c) {
  put(c, 'pictures', PHOTO, 'file', PIC('🌻', '#aed581', '#fff59d'));
  put(c, 'pictures', SIMILAR_PHOTO, 'file', PIC('🌷', '#ef9a9a', '#f8bbd0'));
}

function initialReply(c) {
  const mails = mailBox(c.d).mails;
  const original = mails.find((m) => m.key === 'elif');
  return mails.find((m) => m.id === c.L.initialReplyId && m.replyTo === original.id);
}

// Ders yeniden açılınca posta kutusu sıfırlanır. Sonraki adımın kullanacağı yazışmayı hazırla.
function restoreRequest(c) {
  let reply = initialReply(c);
  if (!reply) {
    const original = mailBox(c.d).mails.find((m) => m.key === 'elif');
    reply = deliverMail(c.d, {
      folder: 'sent', from: ME, fromName: 'Ben', to: ELIF, subject: SUBJECT,
      body: 'Teşekkürler Elif, fotoğraf çok güzel!', replyTo: original.id, read: true,
    }, true);
    c.L.initialReplyId = reply.id;
  }
  const mails = mailBox(c.d).mails;
  const request = mails.find((m) => m.folder === 'inbox' && m.replyOf === reply.id && m.from === ELIF)
    || deliverMail(c.d, {
      from: ELIF, fromName: 'Elif (torunum)', subject: SUBJECT, replyOf: reply.id,
      body: 'Bahçenin fotoğrafını gönderebilir misiniz? Resimler klasöründeki ayçiçeklerinin göründüğü çiçekler.jpg dosyasını istiyorum.',
    }, true);
  return request;
}

function setupPhotoReply(c) {
  mailOpen(c);
  photos(c);
  const mails = mailBox(c.d).mails;
  if (!mails.some((m) => m.id === c.L.requestId)) c.L.requestId = restoreRequest(c).id;
}

export const eposta = {
  id: 'eposta', icon: '✉', title: 'E-posta: okuma, yanıtlama, ek', minutes: 40, stage: 'desktop', progressVersion: 2,
  desc: 'Postayı okumak, yanıtlamak, eki kendi klasörünüze taşımak, doğru fotoğrafı yanıtınıza eklemek ve gönderdiğinizi kontrol etmek.',
  summary: [
    ['E-posta adresi', 'ad@ornek.com: Türkçe harf ve boşluk olmaz; @ için AltGr + Q'],
    ['Kalın yazılı posta', 'Henüz okunmamış'],
    ['📎', 'Postada ek (dosya) var'],
    ['⬇ İndir', 'Eki bilgisayara kaydeder (İndirilenler klasörü)'],
    ['İndirilenler', 'Her indirme önce buraya düşer; önemli belgeyi kendi klasörünüze taşıyın'],
    ['Yanıtla', 'Gönderene cevap; Kime kutusu kendiliğinden dolar'],
    ['İlet', 'Postayı başka birine gönder'],
    ['Dosya ekle', 'Postaya fotoğraf ya da belge ekler'],
    ['Önemsiz', 'Sahte ve reklam postaları; bağlantısına tıklamayın'],
  ],
  setup: (c) => {
    desktopReady(c);
    if (!c.d.fs.find('desktop', 'E-posta')) c.d.fs.create('desktop', { type: 'link', name: 'E-posta', app: 'mail' });
    photos(c);
  },
  steps: [
    {
      title: 'E-posta nedir?',
      html: `<p>E-posta, internet üzerinden gönderilen mektuptur. Birkaç saniyede ulaşır; içine fotoğraf ve belge de eklenebilir.</p>
        <ul class="big-list"><li>Herkesin bir <b>e-posta adresi</b> vardır: <b>elif@ornek.com</b></li><li>Ortadaki <b>@</b> (et) işareti için ${K('AltGr', 'Q')}.</li><li>Adreste <b>Türkçe harf</b> (ç, ğ, ı, ö, ş, ü) ve <b>boşluk</b> olmaz.</li></ul>
        <p class="mut">Bu derste alıştırma için bir posta kutusu kullanacağız. Adresler uydurmadır; hiçbir şey gerçekten gönderilmez.</p>`,
      setup: (c) => c.d.closeAll(),
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
      html: `<p>Gerekirse Elif’in <b>Bayram fotoğrafı</b> postasını yeniden açın. Postanın altındaki fotoğrafın yanında <b>⬇ İndir</b> düğmesine tıklayın. Fotoğraf bilgisayarınıza kaydedilir.</p>
        <p class="mut"><b>Önce sorun:</b> bu postayı bekliyor muydunuz, gönderen tanıdık mı? Tanımadığınız birinden gelen ekleri, özellikle <b>.exe</b>, <b>.zip</b> ve “faturanız ektedir” diyen belgeleri açmayın, silin.</p>
        <p class="mut">Gerçek bilgisayarda e-postadan inen bir Word ya da Excel dosyasını açınca üstte sarı <b>Korumalı Görünüm</b> çubuğu çıkabilir: dosyayı yalnızca okuyabilirsiniz. Gönderen tanıdıksa ve bekliyorsanız <b>Düzenlemeyi Etkinleştir</b>\'e basın; bilmediğiniz bir kaynaksa basmayın. <b>İçeriği Etkinleştir</b> (makro) isteyen dosyaya hiç basmayın.</p>`,
      mouse: '🖱 ⬇ İndir',
      setup: (c) => { if (c.resumed) mailOpen(c); },
      on: (ev) => ev.type === 'mail-download' && ev.name === BAYRAM,
      done: 'Fotoğraf <b>İndirilenler</b> klasörüne kaydedildi.',
    },
    {
      title: 'Kendi klasörünüze taşıyın',
      html: `<p>İndirdiğiniz her dosya önce <b>İndirilenler</b> klasörüne düşer. Zamanla orası dolar, aradığınızı bulamazsınız. Önemli dosyayı hemen <b>kendi klasörüne</b> taşıyın.</p>
        <p>Açılan Dosya Gezgini'nde <b>bayram.jpg</b>'ye tıklayın, ${K('Ctrl', 'X')} (kes). Soldan <b>Resimler</b>'e girip ${K('Ctrl', 'V')} (yapıştır). Ya da dosyayı fareyle soldaki <b>Resimler</b>'in üzerine sürükleyin.</p>`,
      hint: 'Kopyala (Ctrl + C) değil Kes (Ctrl + X): taşıyınca dosya İndirilenler\'de kalmaz.',
      setup: (c) => {
        if (!hasBayram(c, 'downloads') && !hasBayram(c, 'pictures')) {
          const original = mailBox(c.d).mails.find((m) => m.key === 'elif');
          put(c, 'downloads', BAYRAM, 'file', original.attachments[0].content);
        }
        const w = c.d.ensure('explorer', { folder: 'downloads' });
        w.api?.go?.('downloads');
      },
      check: (c) => hasBayram(c, 'pictures') && !hasBayram(c, 'downloads'),
      on: (ev, c) => {
        if (!['fs', 'file-paste', 'drop'].includes(ev.type)) return false;
        const inPics = hasBayram(c, 'pictures');
        const inDownloads = hasBayram(c, 'downloads');
        if (inPics && inDownloads) c.note('Dosya iki yerde duruyor: kopyaladınız. İndirilenler\'deki asıl dosyayı silin ya da baştan Kes (Ctrl + X) ile deneyin.');
        return inPics && !inDownloads;
      },
      done: 'Fotoğraf artık <b>Resimler</b>\'de. Faturalar, tahlil sonuçları için de <b>Faturalar</b>, <b>Sağlık</b> gibi klasörler açıp aynı şekilde taşıyabilirsiniz. Dosya Gezgini\'ni kapatın.',
    },
    {
      title: 'Yanıtlayın',
      setup: mailOpen,
      html: `<ol class="steps"><li>Gelen Kutusu’ndan Elif’in <b>Bayram fotoğrafı</b> postasını açın. Üstteki <b>Yanıtla</b> düğmesine tıklayın. <b>Kime</b> ve <b>Konu</b> kendiliğinden dolar.</li>
        <li>Büyük beyaz alanın <b>en üstüne</b> kısa bir cevap yazın, örneğin: <b>Teşekkürler Elif, fotoğraf çok güzel!</b></li>
        <li><b>Gönder</b>'e tıklayın.</li></ol>`,
      hint: 'Mesaj alanında alttaki çizgili kısım Elif\'in eski postasıdır; ona dokunmayın, cevabınızı onun üstüne yazın.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (ev.replyKey !== 'elif') { c.warn('Posta gönderildi ama bu, Elif\'in postasına bir yanıt değil. Elif\'in postasını açıp Yanıtla\'ya tıklayın.'); return false; }
        if (ownText(ev.body).length < 3) { c.warn('Yanıt gitti ama içine bir şey yazmamışsınız. Bir daha deneyin: Elif\'in postasını açın, Yanıtla, kısa bir cevap yazın.'); return false; }
        if (ev.toList.length !== 1 || ev.toList[0].toLowerCase() !== ELIF || ev.cc.length || ev.bcc.length || ev.subject !== SUBJECT || ev.attachments.length) {
          c.warn('Bayram fotoğrafı postasını yeniden yanıtlayın. Kime ve Konu alanlarını olduğu gibi bırakın, ek koymadan kısa bir mesaj yazın.');
          return false;
        }
        c.L.initialReplyId = ev.id;
        return true;
      },
      done: 'Yanıtınız gönderildi. Gönderdiğiniz postalar soldaki <b>Gönderilmiş Öğeler</b> klasöründe durur.',
    },
    {
      title: 'Cevap geldi',
      html: '<p>Birkaç saniye içinde Elif cevap yazacak. <b>Gelen Kutusu</b>’na tıklayın ve Elif’ten gelen <b>Ynt: Bayram fotoğrafı</b> postasını açın. Elif’in hangi fotoğrafı istediğini okuyun.</p>',
      mouse: '🖱 Gelen Kutusu → Elif’in cevabı',
      setup: (c) => {
        mailOpen(c);
        if (!initialReply(c)) restoreRequest(c);
      },
      on: (ev, c) => {
        if (ev.type !== 'mail-open' || ev.folder !== 'inbox' || ev.from !== ELIF || ev.replyOf !== c.L.initialReplyId) return false;
        c.L.requestId = ev.id;
        return true;
      },
      done: 'Elif bahçenin fotoğrafını istiyor. <b>çiçekler.jpg</b> dosyasını açıp bakalım.',
    },
    {
      title: 'Fotoğrafı açıp kontrol edin',
      html: `<p>Dosya Gezgini’nde <b>Resimler</b> klasöründe benzer isimli iki fotoğraf var. <b>${PHOTO}</b> dosyasına çift tıklayın veya dosyayı seçip ${K('Enter')} tuşuna basın. Ayçiçeklerinin göründüğünü kontrol edin.</p>
        <p><b>${SIMILAR_PHOTO}</b> dosyasında laleler var. Dosyanın tam adına ve görüntüsüne bakarak seçiminizi kontrol edin.</p>`,
      setup: (c) => {
        photos(c);
        const w = c.d.ensure('explorer', { folder: 'pictures' });
        w.api?.go?.('pictures');
      },
      on: (ev, c) => {
        const wanted = c.d.fs.find('pictures', PHOTO);
        if (ev.type === 'ex-open') {
          c.s.openedFromExplorer = ev.id === wanted?.id;
          if (ev.name === SIMILAR_PHOTO) c.warn('Bu fotoğrafta laleler var. Resimler klasörüne dönüp çiçekler.jpg dosyasını açın.');
        }
        return c.s.openedFromExplorer && ev.type === 'app-open' && ['photos', 'viewer'].includes(ev.app) && ev.args?.node === wanted?.id;
      },
      done: 'Ayçiçekli fotoğrafı açtınız. E-posta penceresine dönün.',
    },
    {
      title: 'Aynı postaya fotoğrafla yanıt verin',
      setup: setupPhotoReply,
      html: `<ol class="steps"><li>Gelen Kutusu’nda Elif’in <b>Ynt: Bayram fotoğrafı</b> postasını açın. Birden fazla varsa önizlemesinde bahçe fotoğrafını isteyen postayı seçin. <b>Yanıtla</b>’ya tıklayın.</li>
        <li><b>Kime</b> alanında <b>${ELIF}</b>, <b>Konu</b> alanında <b>${SUBJECT}</b> yazdığını kontrol edin. Mesaj alanının en üstüne kısa bir cevap yazın.</li>
        <li><b>Dosya ekle</b>’ye tıklayın, <b>Resimler</b> klasöründen <b>${PHOTO}</b> dosyasını seçip <b>Aç</b>’a basın.</li>
        <li>Ek listesine bakın. Yanlış ya da fazladan bir ek varsa yanındaki <b>× (Eki çıkar)</b> düğmesini kullanın. Listede yalnızca <b>${PHOTO}</b> kaldığında <b>Gönder</b>’e basın.</li></ol>
        <p class="mut">İsterseniz önce <b>${SIMILAR_PHOTO}</b> dosyasını ekleyin ve göndermeden yanındaki <b>×</b> düğmesiyle çıkarın.</p>`,
      hint: 'Eki çıkar düğmesi dosyayı yalnızca bu yanıttan kaldırır. Dosyanız Resimler klasöründe durur.',
      on: (ev, c) => {
        if (ev.type === 'mail-attach' || ev.type === 'mail-detach') {
          if (ev.attachments.length > 1 || ev.attachments.some((name) => name !== PHOTO)) {
            c.warn('Ek listesini kontrol edin. Yanlış veya fazladan ekin yanındaki × düğmesine basın.');
          } else if (ev.attachments.length) {
            c.note('Ek listesinde çiçekler.jpg var. Alıcıyı, konuyu ve mesajınızı kontrol edip gönderin.');
          } else {
            c.note('Ek çıkarıldı. Dosya ekle düğmesiyle çiçekler.jpg dosyasını seçin.');
          }
          return false;
        }
        if (ev.type !== 'mail-send') return false;
        if (ev.replyTo !== c.L.requestId || ev.subject !== SUBJECT || ev.toList.length !== 1 ||
            ev.toList[0].toLowerCase() !== ELIF || ev.cc.length || ev.bcc.length) {
          c.warn('Elif’in fotoğrafı istediği postayı açıp Yanıtla’ya basın. Otomatik doldurulan Kime ve Konu alanlarını koruyun.');
          return false;
        }
        const sent = mailBox(c.d).mails.find((m) => m.id === ev.id);
        const file = c.d.fs.find('pictures', PHOTO);
        if (!file || !sent || sent.attachments.length !== 1 || sent.attachments[0].name !== PHOTO || sent.attachments[0].content !== file.content) {
          c.warn('Elif’in isteğine yeniden yanıt verin. Resimler’deki çiçekler.jpg dosyasını ekleyin ve ek listesinde başka dosya kalmadığını kontrol edin.');
          return false;
        }
        if (ownText(ev.body).length < 3) { c.warn('Elif’in isteğine yeniden yanıt verin ve fotoğrafın yanına kısa bir mesaj yazın.'); return false; }
        c.L.photoReplyId = ev.id;
        return true;
      },
      done: 'Ekli yanıtınız gönderildi. Şimdi Gönderilmiş Öğeler’deki kopyasını açın.',
    },
    {
      title: 'Gönderilen yanıtı kontrol edin',
      html: '<p>Soldan <b>Gönderilmiş Öğeler</b>’e tıklayın. Elif’e gönderdiğiniz <b>Ynt: Bayram fotoğrafı</b> yanıtını açın. Kime alanında <b>elif@ornek.com</b>, ek olarak yalnızca <b>çiçekler.jpg</b> göründüğünü kontrol edin.</p>',
      setup: (c) => {
        setupPhotoReply(c);
        if (!c.resumed) return;
        const file = c.d.fs.find('pictures', PHOTO);
        c.L.photoReplyId = deliverMail(c.d, {
          folder: 'sent', from: ME, fromName: 'Ben', to: ELIF, subject: SUBJECT,
          body: 'Merhaba Elif, istediğin bahçe fotoğrafı ekte.',
          replyTo: c.L.requestId, attachments: [{ name: file.name, content: file.content }], read: true,
        }, true).id;
      },
      on: (ev, c) => {
        if (ev.type !== 'mail-open' || ev.folder !== 'sent') return false;
        if (ev.id === c.L.photoReplyId) return true;
        c.warn('Gönderilmiş Öğeler’de Elif’e yolladığınız, yanında ataş işareti bulunan yanıtı açın.');
        return false;
      },
      done: 'Gönderdiğiniz yanıtın kopyasını açtınız. Fotoğraf ve belgeleri aynı yolla ekleyebilirsiniz. E-postada ek boyutu sınırlıdır. Büyük videolar için bir paylaşım bağlantısı gerekebilir.',
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
        <p>Bu bir <b>dolandırıcılık</b> postasıdır: bankalar e-postayla şifre ya da kart numarası istemez. Bağlantısına <b>tıklamayın</b>; üstteki <b>Önemsiz</b> düğmesine basın.</p>`,
      mouse: '🖱 Postayı açın → Önemsiz',
      hint: 'Gönderenin adresine bakın: bankaniz-dogrulama.xyz. Gerçek bir bankanın adresi değil. Gönderenin yazan adı (“Banka”) kolayca taklit edilir; asıl adrese bakın.',
      setup: (c) => { if (!c.d.find('mail')) mailOpen(c); },
      on: (ev, c) => {
        if (ev.type === 'mail-link') c.warn('Gerçek hayatta bu bağlantıya tıklamak tehlikelidir! Sahte bir siteye gider ve şifrenizi çalabilir. Şimdi Önemsiz\'e basın.');
        if (ev.type === 'mail-open' && ev.key === 'banka') c.note('Gönderenin adresine bakın: <b>bankaniz-dogrulama.xyz</b>. Şimdi Önemsiz\'e basın.');
        return (ev.type === 'mail-spam' || ev.type === 'mail-delete') && ev.key === 'banka';
      },
      done: 'Sahte posta kaldırıldı. Şüphelendiğiniz bir postada bankanızı <b>kartın arkasındaki numaradan</b> kendiniz arayın. Bir ipucu daha: bağlantıya <b>tıklamadan</b> farenin okunu üstüne getirirseniz ekranın alt köşesinde bağlantının gerçek adresi görünür. Yazıda “bankam.com.tr” diyor ama altta başka bir şey yazıyorsa tıklamayın. Bankanın sitesini adresi kendiniz yazarak açın.',
    },
    {
      title: 'Hocanıza yazın',
      setup: mailOpen,
      html: '<p>Şimdi kendi başınıza: hocanıza bir posta gönderin. Adresi: <b>hoca@ornek.com</b></p><p>Konuya ve mesaja ne yazacağınız size kalmış.</p>',
      hint: 'Soldaki Yeni posta → Kime, Konu, mesaj → Gönder.',
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
