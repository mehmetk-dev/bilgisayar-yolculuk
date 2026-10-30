// 13. hafta: Belgeyi telefonla tarayıp bilgisayara almak (telefon tarafı çizimlerle anlatılır; bilgisayar tarafı Mesajlaş Web ve Dosya Gezgini ile yapılır)
import { desktopReady, maxed, K } from './common.js';
import { rehberSoru } from './kalip.js';
import { WA_HOST } from '../apps/siteler-mesaj.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});
const exGo = (c, folder) => { const w = c.d.ensure('explorer'); if (w.api.folder !== folder) w.api.go(folder); };

// Telefon ekranı çizimi (yalnızca anlatım için; tıklanmaz)
const FRAME = 'display:inline-block;vertical-align:top;margin:0.3em;width:9.5em;border:3px solid #333;border-radius:1.2em;background:#222;padding:0.5em 0.4em 0.6em;text-align:center;color:#fff;font-size:0.85em;line-height:1.3';
const phone = (cap, inner, bg = '#3a3a3a') => `<figure style="margin:0;display:inline-block;vertical-align:top"><div style="${FRAME}"><div style="background:${bg};border-radius:0.7em;padding:0.7em 0.3em;min-height:11em;position:relative;overflow:hidden">${inner}</div></div><figcaption style="font-size:0.85em;max-width:11em;margin:0 auto">${cap}</figcaption></figure>`;
const paper = (extra = '') => `<div style="background:#fff;color:#333;margin:0.2em auto;width:6em;height:7.5em;padding:0.4em;text-align:left;font-size:0.7em;box-sizing:border-box;${extra}"><b>KİMLİK</b><div style="height:0.4em;background:#bbb;margin:0.3em 0"></div><div style="height:0.4em;background:#bbb;margin:0.3em 0;width:70%"></div><div style="height:0.4em;background:#bbb;margin:0.3em 0;width:85%"></div><div style="height:0.4em;background:#bbb;margin:0.3em 0;width:50%"></div></div>`;
const corners = '<span style="position:absolute;inset:1.1em 0.9em 2.6em;border:2px dashed #ffd54f;border-radius:4px"></span>';
const taraBtn = '<span style="position:absolute;left:50%;bottom:0.5em;transform:translateX(-50%);background:#fff;color:#1a73e8;font-weight:700;border-radius:1em;padding:0.15em 0.9em">📷 Tara</span>';

export const telefonTarama = {
  id: 'telefon-tarama', icon: '📷', title: 'Belgeyi telefonla tarayıp bilgisayara alın', minutes: 28, stage: 'desktop',
  desc: 'Kimliği, faturayı, diplomayı telefonla PDF olarak taramak; bilgisayara almak, adını değiştirmek, saklamak.',
  summary: [
    ['Tarama', 'Telefonun kamerasıyla belgenin düz, temiz, PDF hâlini çıkarmak; evde tarayıcı gerekmez'],
    ['Android', 'Çoğu telefonda Google Drive uygulaması → ＋ → Tara; ya da kameradaki belge modu'],
    ['iPhone', 'Notlar uygulaması → ataş (ya da kamera simgesi) → Belgeleri Tara'],
    ['İyi tarama', 'Düz, koyu zemin; gölge yok; iyi ışık; bütün kenarlar görünsün; yazılar okunsun'],
    ['Bilgisayara almak', 'Kendinize e-posta, “Kendime” sohbeti, kablo ya da bulut; dosya İndirilenler\'e düşer'],
    ['Dosya adı', 'kimlik-on-yuz.pdf gibi; “tarama.pdf” ya da “IMG_2041” anlamsızdır'],
    ['Kimlik taraması', 'Yalnızca istenen ve güvendiğiniz kuruma; bir not düşün; işiniz bitince silin'],
  ],
  steps: [
    {
      title: 'Taranmış hâlini gönderin',
      html: `<p>Kurumlar sık sık şunu ister: <b>“Kimliğinizin, diplomanızın, faturanızın taranmış hâlini gönderin.”</b></p>
        <p>Evde <b>tarayıcı</b> (scanner) çoğu zaman yoktur. İyi haber: <b>telefonunuz</b> bu işi görür. Telefonla tarayınca belgenin kenarları düzelir, ortaya temiz bir <b>PDF</b> çıkar.</p>
        <p>Bu derste önce telefonda <b>nasıl taranır</b> onu çizimlerle göreceğiz. Sonra taramanın bilgisayara gelmesini ve düzenli saklanmasını <b>bilgisayarda</b> yapacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Telefonda nasıl taranır?',
      html: `<p>Ekranlar telefona ve sürüme göre biraz değişir. Çoğu telefonda yol şöyledir:</p>
        <div style="text-align:center">${phone('<b>Android</b>: Google Drive → ＋ → Tara', `<div style="font-size:0.75em;color:#ccc">Drive</div>${corners}${paper('margin-top:1.1em')}${taraBtn}`)}${phone('<b>iPhone</b>: Notlar → ataş → Belgeleri Tara', `<div style="font-size:0.75em;color:#ccc">Notlar</div>${corners}${paper('margin-top:1.1em')}${taraBtn}`)}</div>
        <ul class="big-list"><li>🔎 Uygulamayı bulamazsanız telefonun <b>kamerasını</b> açıp “belge” ya da “tara” seçeneğine bakın.</li>
        <li>📐 Uygulama belgenin <b>kenarlarını kendisi bulur</b> (sarı çerçeve) ve eğriliği düzeltir.</li>
        <li>📄 Birden çok sayfa varsa sırayla tarayın; hepsi <b>tek PDF</b> olur.</li></ul>`,
    },
    {
      title: 'İyi tarama nasıl olur?',
      html: `<div style="text-align:center">${phone('<b>İyi</b>: düz, koyu zemin; bütün kenarlar görünüyor', `${corners}${paper('margin-top:1.1em')}`, '#1e1e1e')}${phone('<b>Kötü</b>: eğri, gölgeli, köşe kesik', `<div style="position:absolute;inset:0;background:linear-gradient(120deg,#8a7a5a 55%,#4b3f28)"></div><div style="position:relative;transform:rotate(14deg) translate(0.5em,0.8em)">${paper('margin-left:1.5em;margin-right:-1em;box-shadow:-0.8em 0.4em 0.6em #0008')}</div>`, '#6d5f43')}</div>
        <ul class="big-list"><li>⬛ Belgeyi <b>düz ve koyu renkli</b> bir yere koyun (masa, koyu örtü).</li>
        <li>☀ <b>İyi ışık</b>: pencere önü ya da lamba. Kendi gölgenizi belgenin üstüne düşürmeyin.</li>
        <li>🔲 <b>Dört kenar</b> da çerçevede görünsün; köşe kesilmesin.</li>
        <li>🔍 Taramadan sonra ekranda <b>yazılar okunuyor mu</b> bakın. Okunmuyorsa yeniden tarayın.</li></ul>`,
    },
    {
      title: 'Kaydedin ve ad verin',
      html: `<p>Tarama bitince <b>Kaydet</b>'e dokunun. Uygulama size bir ad sorar; çoğu zaman “Tarama 2026-10-30” gibi bir ad önerir.</p>
        <p>Anlamlı bir ad yazın: <b>kimlik-on-yuz.pdf</b>, <b>kimlik-arka-yuz.pdf</b>, <b>diploma.pdf</b>. Aylar sonra aradığınızda hemen bulursunuz.</p>
        <p>Kurum dosya boyutuna sınır koyuyorsa (ör. 2 MB) ve PDF büyük çıkarsa, tarama uygulamasında kalite ya da boyut ayarına bakın. Bulamazsanız yakınınızdan yardım isteyin.</p>`,
    },
    {
      title: 'Bilgisayara almanın dört yolu',
      html: `<ul class="big-list"><li>✉ <b>E-posta</b>: PDF'yi kendi adresinize gönderin; bilgisayarda e-postayı açıp ekini indirin.</li>
        <li>💬 <b>“Kendime” sohbeti</b>: WhatsApp'ta kendinize mesaj gönderin; bilgisayarda WhatsApp Web'den indirin. (Aşağıda bunu yapacağız.)</li>
        <li>🔌 <b>Kablo</b>: telefonu bağlayıp dosyayı kopyalarsınız (<b>Telefondan bilgisayara fotoğraf</b> dersindeki gibi).</li>
        <li>☁ <b>Bulut</b>: telefonda buluta yükleyin, bilgisayarda aynı hesapla açın.</li></ul>
        <p>Hangisini seçerseniz seçin, indirilen dosya bilgisayarda çoğunlukla <b>İndirilenler</b> klasörüne düşer.</p>`,
    },
    {
      title: 'Mesajlaş Web\'i açın',
      html: `<p>Telefondan kendinize bir PDF yolladığımızı düşünelim. <b>İnternet</b>'i açıp adres çubuğuna <b>${WA_HOST}</b> yazın.</p>`,
      setup: (c) => br(c),
      on: (ev) => ev.type === 'web-nav' && ev.host === WA_HOST,
      done: 'Karekod ekranı açıldı.',
    },
    {
      title: 'Telefonu bağlayın',
      html: '<p>Gerçekte telefonla karekodu okutursunuz. Alıştırmada <b>📷 Telefonla karekodu okut</b> düğmesine tıklayın.</p>',
      on: (ev) => ev.type === 'wa-scan',
      done: 'Bağlandı. Sohbet listesi geldi.',
    },
    {
      title: '“Kendime” sohbetini açın',
      html: '<p>Sohbet listesinde <b>Kendime mesaj (siz)</b> sohbetine tıklayın. Telefonunuzdan kendinize yolladığınız tarama burada.</p>',
      hint: 'Listede 📝 simgeli sohbet; Hasan Bey\'in altında.',
      on: (ev) => ev.type === 'wa-chat' && /Kendime/.test(ev.name),
      done: 'Taramayı gördünüz: <b>tarama.pdf</b>. Henüz yalnızca sohbette; bilgisayara inmedi.',
    },
    {
      title: 'PDF\'yi indirin',
      html: '<p><b>tarama.pdf</b> belgesinin altındaki <b>⬇ İndir</b> düğmesine tıklayın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'wa-download') return false;
        if (ev.name !== 'tarama.pdf') { c.warn('Bu başka bir dosya. Kendime sohbetindeki tarama.pdf\'yi indirin.'); return false; }
        return true;
      },
      done: 'Dosya <b>İndirilenler</b> klasörüne kaydedildi.',
    },
    {
      title: 'İndirilenler\'de bulun',
      html: '<p>Dosya nereye düştü? İndirme panelindeki <b>Klasörde göster</b>\'e tıklayın ya da <b>Dosya Gezgini</b>\'ni açıp soldan <b>İndirilenler</b>\'e tıklayın.</p>',
      hint: 'Tarayıcıdaki ⬇ simgesi paneli yeniden açar. Dosya Gezgini\'nin soldaki listesinde İndirilenler vardır.',
      on: (ev) => (ev.type === 'nav' && ev.folder === 'downloads') || ev.type === 'download-folder',
      done: 'Dosya buradaydı. Dosyayı bulamazsanız Dosya Gezgini\'nde <b>İndirilenler</b>\'e bakın; indirilen her şey genellikle oraya düşer.',
    },
    {
      title: 'Açıp okunuyor mu bakın',
      html: '<p><b>tarama.pdf</b> dosyasına <b>çift tıklayarak</b> açın. Yazılar net okunuyor mu, bütün kenarlar görünüyor mu kontrol edin. Göndermeden önce bu bakış önemlidir.</p>',
      setup: (c) => exGo(c, 'downloads'),
      on: (ev) => (ev.type === 'ex-open' && /tarama/i.test(ev.name)) || (ev.type === 'download-open' && /tarama/i.test(ev.name)),
      done: 'Belge net. Gerçek taramada okunmayan yer olsaydı telefonda yeniden tarardınız.',
    },
    {
      title: 'Dosyanın adını değiştirin',
      html: `<ol class="steps"><li><b>tarama.pdf</b> dosyasına bir kez tıklayın.</li><li>${K('F2')} tuşuna basın (ya da sağ tıklayıp <b>Yeniden adlandır</b>).</li><li><b>kimlik-on-yuz</b> yazıp ${K('Enter')}'a basın.</li></ol><p>Sondaki <b>.pdf</b>'e dokunmayın; o dosyanın türünü gösterir.</p>`,
      hint: 'Ad kutusunda yalnızca “tarama” kısmı seçili gelir; yazdığınız onun yerine geçer.',
      setup: (c) => exGo(c, 'downloads'),
      on: (ev, c) => {
        if (ev.type !== 'rename') return false;
        if (!/kimlik/i.test(ev.name)) { c.warn('Adın içinde “kimlik” geçsin: kimlik-on-yuz. Dosyayı yeniden adlandırın.'); return false; }
        return true;
      },
      done: 'Artık adı <b>kimlik-on-yuz.pdf</b>. Gönderirken ve ararken kolayca tanınır.',
    },
    {
      title: 'Belgeler klasörüne taşıyın',
      html: `<p>İndirilenler klasörü zamanla karışır. Önemli belgeyi <b>Belgeler</b>'e alın: dosyayı sürükleyip soldaki <b>Belgeler</b>'in üzerine bırakın. Ya da dosyaya tıklayıp <b>✂ Kes</b>, <b>Belgeler</b>'e gidip <b>📋 Yapıştır</b>.</p>`,
      setup: (c) => exGo(c, 'downloads'),
      on: (ev, c) => {
        const kopya = 'Kopyaladınız; dosya İndirilenler\'de de duruyor. Taşımak için Kes (Ctrl + X) kullanın ya da sürükleyin.';
        if (ev.type === 'drop' && ev.to === 'docs') { if (ev.op === 'copy') { c.warn(kopya); return false; } return true; }
        if (ev.type === 'file-paste' && ev.to === 'docs') { if (ev.op !== 'cut') { c.warn(kopya); return false; } return true; }
        return false;
      },
      done: 'Belge artık <b>Belgeler</b> klasöründe. Gerektiğinde buradan bulup gönderirsiniz.',
    },
    {
      title: 'Kimlik gönderirken dikkat',
      html: `<ul class="big-list"><li>🏛 Kimlik taramasını <b>yalnızca istenen ve güvendiğiniz</b> kuruma gönderin. Kurumu kendi bildiğiniz telefon ya da adresten doğrulayın; size gelen mesajdaki numaraya güvenmeyin.</li>
        <li>📝 Mümkünse belgenin bir yerine <b>“… kurumuna … için verilmiştir”</b> gibi bir not yazın. Bu, başkasının sizin adınıza kullanmasını zorlaştırabilir. (Bu bir öneridir; her kurum kabul etmeyebilir.)</li>
        <li>🗑 Gönderdikten sonra gerekmiyorsa <b>Kendime</b> sohbetinden, İndirilenler'den ve telefondan silin. Kimlik kopyaları ortada kalmasın.</li>
        <li>💻 Kendi bilgisayarınız değilse işiniz bitince <b>oturumu kapatın</b> ve dosyayı silin.</li></ul>`,
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Tanımadığınız biri telefonla arıyor: “Devlet desteği için kimliğinizin iki yüzünün fotoğrafını hemen WhatsApp\'tan atın.” Ne yaparsınız?</p>',
      opts: ['Hemen çekip yollarım; destek kaçmasın, geç kalmak istemem', 'Yalnızca arka yüzünü yollarım, ön yüzünü yollamam', 'Yollamam; kapatır, kurumu kendi bildiğim numaradan ararım'], ok: 2,
      wrong: 'Kimliğin yarısı bile kötüye kullanılabilir. Tanımadığınıza vermeyin.',
      why: 'Doğru. Gerçek kurum telefonda acele ettirip kimlik fotoğrafı istemez. Şüpheniz varsa kapatın, kurumu kendi bildiğiniz numaradan arayın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Belge taramak ve saklamak:</p>' },
  ],
};
