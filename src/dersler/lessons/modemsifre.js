// 8. hafta ek dersi: Modem ve Wi-Fi şifresi. Modemin altındaki etiketi okumak (Wi-Fi adı, Wi-Fi şifresi, yönetim adresi, yönetim şifresi),
// misafire şifre vermek, tarayıcıda 192.168.1.1'e girip Wi-Fi şifresini değiştirmek, cihazları yeni şifreyle yeniden bağlamak, dokunulmayacak yerler.
// Modem yönetim sayfası uydurmadır (apps/siteler-ag.js); Ayarlar'daki gerçek Wi-Fi ağına dokunmaz.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { MODEM_HOST, MODEM_ETIKET as E, MODEM_CIHAZLAR } from '../apps/siteler-ag.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

// Modemin altındaki etiketin çizimi. rows: hangi satırlar görünsün
const ETIKET = {
  ssid: ['Wi-Fi adı (SSID)', E.ssid], wifi: ['Wi-Fi şifresi (WPA anahtarı)', E.wifi],
  adres: ['Yönetim adresi', MODEM_HOST], user: ['Yönetim kullanıcı adı', E.user], pass: ['Yönetim şifresi', E.pass],
};
const etiket = (rows = Object.keys(ETIKET)) => `<div style="border:2px dashed #555;background:#fffde7;color:#222;padding:0.6em 0.9em;margin:0.6em 0;font-size:0.95em;line-height:1.8;border-radius:4px">
  <b>📟 Modemin altındaki etiket</b><br>${rows.map((k) => `${ETIKET[k][0]}: <b style="font-family:monospace">${ETIKET[k][1]}</b>`).join('<br>')}<br><small style="color:#666">Seri no: 2418-77Z3 · 12V 1A</small></div>`;

export const modemSifre = {
  id: 'modem-wifi-sifre', icon: '🔑', title: 'Modem ve Wi-Fi şifresi: bulmak ve değiştirmek', minutes: 25, stage: 'desktop',
  desc: 'Modemin altındaki etiketi okumak, misafire şifre vermek, modemin sayfasından Wi-Fi şifresini değiştirmek, cihazları yeniden bağlamak.',
  summary: [
    ['Modemin altındaki etiket', 'Wi-Fi adı, Wi-Fi şifresi, yönetim adresi (192.168.1.1) ve yönetim şifresi orada yazar'],
    ['Misafire şifre', 'Etiketteki “Wi-Fi şifresi” satırını okuyun; yönetim şifresini vermeyin'],
    ['192.168.1.1', 'İnternet sitesi değil, modemin kendi sayfasıdır; adres çubuğuna yazılır'],
    ['Yönetim şifresi ≠ Wi-Fi şifresi', 'Modemin sayfasına girmek için etiketteki yönetim şifresi gerekir'],
    ['Yeni Wi-Fi şifresi', 'Modem en az 8 karakter ister; siz 12 ve üzerini tercih edin; doğum yılı ve 1234 olmasın; önce kâğıda yazın'],
    ['Kaydedince', 'Bütün cihazlar (telefon, televizyon, tablet) kopar; her birine yeni şifreyi girin'],
    ['Bilmediğiniz ayara dokunmayın', '“Fabrika ayarlarına dön” ve Reset deliği her şeyi siler, internet de gidebilir; takılırsanız internet sağlayıcınızı arayın'],
  ],
  steps: [
    {
      title: 'Modemin altındaki etiket',
      html: `<p>Evdeki Wi-Fi ağının adı ve şifresi çoğu modemde <b>altındaki ya da arkasındaki etikette</b> yazar. Modemi çevirip bakın. Etiket şuna benzer:</p>${etiket()}
        <p>İki grup bilgi önemli:</p><ul><li><b>Wi-Fi adı</b> ve <b>Wi-Fi şifresi</b>: telefonla, bilgisayarla bağlanırken gerekir.</li><li><b>Yönetim adresi</b> ve <b>yönetim şifresi</b>: modemin ayar sayfasına girmek içindir. İki şifre birbirinden farklıdır.</li></ul>
        <p>Wi-Fi şifresini kâğıda yazıp evde güvenli bir yerde saklayın; misafire etiketten okuyabilirsiniz.</p>
        <p><b>Şifreyi ne zaman değiştirirsiniz?</b> Komşu kullanıyorsa, internet yavaşladıysa ya da şifreyi çok kişiye verdiyseniz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    rehberSoru({
      title: 'Misafir geldi: şifre ne?',
      html: `<p>Evinize misafir geldi ve <b>telefonunu Wi-Fi'ye bağlamak</b> istiyor. Etiketten hangi satırı okursunuz?</p>${etiket()}`,
      opts: ['Yönetim şifresi: Kp7mR4xZ', 'Wi-Fi şifresi (WPA anahtarı): evagi2024', 'Seri no: 2418-77Z3'], ok: 1,
      wrong: 'Bu satır bağlanmaya yaramaz. “Wi-Fi” sözü geçen satıra bakın.',
      why: `Doğru: Wi-Fi şifresi. <b>Yönetim şifresini</b> misafire vermeyin; onunla modemin ayarları değiştirilir. Bilgisayarınız zaten bağlıysa bazı Windows sürümlerinde şifre ağ özelliklerinde de görülebilir; ama etiket her zaman en kolay yoldur.`,
    }),
    {
      title: 'Modemin sayfasını açın: 192.168.1.1',
      html: `<p>Şifreyi değiştirmek için modemin <b>kendi ayar sayfasına</b> girmek gerekir. Bu bir internet sitesi değildir; modemin içindeki bir sayfadır.</p>
        <p>Tarayıcının <b>adres çubuğuna</b> yönetim adresini yazıp <kbd>Enter</kbd> tuşuna basın:</p><p style="font-size:1.3em"><b>${MODEM_HOST}</b></p>
        <p>Rakamların arasında <b>nokta</b> var, boşluk yok.</p>`,
      hint: 'Adres çubuğu pencerenin üstündeki uzun kutudur. Arama kutusuna değil, oraya yazın. Dört sayı ve üç nokta: 192.168.1.1',
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type === 'web-search') c.warn('Bu, arama olarak anlaşıldı. Yalnız şunu yazın: 192.168.1.1 (rakamlar ve noktalar, boşluksuz).');
        return ev.type === 'web-nav' && ev.host === MODEM_HOST;
      },
      done: 'Modemin giriş sayfası açıldı. Adresin yanında “Güvenli değil” yazması modemlerde olağandır; sayfa evinizin içinde.',
    },
    {
      title: 'Yönetim şifresiyle girin',
      html: `<p>Giriş sayfası <b>yönetim</b> kullanıcı adı ve şifresini ister. <b>Wi-Fi şifresini</b> yazmayın; etiketteki şu satırları yazın:</p>${etiket(['user', 'pass'])}
        <p>Büyük-küçük harfe dikkat edin.</p>`,
      hint: 'Kullanıcı adı: admin. Şifre: Kp7mR4xZ (K büyük, p küçük, m küçük, R büyük, 4 rakam, x küçük, Z büyük).',
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type === 'router-login-fail') c.warn(ev.wifiPass ? 'Bu Wi-Fi şifresi. Modemin sayfası için etiketteki “Yönetim şifresi”ni yazın.' : 'Giriş olmadı. Etikete bakıp kullanıcı adı ve yönetim şifresini harf harf yazın.');
        return ev.type === 'router-login';
      },
      done: 'İçerdesiniz. Üstte modemin durumu görünüyor: internet bağlı, bağlı cihazlar listeleniyor.',
    },
    {
      title: 'Menüye bakın, ileri ayarlara dokunmayın',
      html: `<p>Üstteki menüde üç bölüm var: <b>Durum</b>, <b>Kablosuz (Wi-Fi)</b> ve <b>İleri ayarlar</b>.</p>
        <p><b>İleri ayarlar</b>'a tıklayıp yalnızca <b>okuyun</b>. Orada ne olduğunu bilmiyorsanız hiçbir şeye basmayın.</p>`,
      hint: 'Sayfanın üstündeki gri çubukta üç düğme var; sağdakini seçin.',
      setup: (c) => br(c),
      on: (ev) => ev.type === 'router-page' && ev.page === 'ileri',
      done: 'Gördünüz: uzman ayarları. Buradaki “Fabrika ayarlarına dön” her şeyi siler ve internet gidebilir. Siz yine de buraya hiç dokunmayın.',
    },
    {
      title: 'Kablosuz (Wi-Fi) bölümüne gelin',
      html: '<p>Şimdi menüden <b>Kablosuz (Wi-Fi)</b> bölümüne tıklayın. Wi-Fi adı ve şifresi burada.</p>',
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type === 'router-reset-click') c.warn('“Fabrika ayarlarına dön”e basmayın! Gerçek modemde her şey silinir. Menüden Kablosuz (Wi-Fi)\'yi seçin.');
        return ev.type === 'router-page' && ev.page === 'kablosuz';
      },
      done: 'Wi-Fi adı ve şifresi alanları burada. Şifre kutusunda şu anki şifre (etikettekiyle aynı) yazıyor.',
    },
    {
      title: 'Yeni şifreyi önce kâğıda yazın, sonra kaydedin',
      html: `<p>Şifre değişince <b>telefon, televizyon, torunun tableti</b>: bütün cihazlar eski şifreyle bağlıydı ve <b>kopacak</b>. Yeni şifreyi unutursanız hiçbiri bağlanamaz. Bu yüzden <b>önce kâğıda yazın</b>.</p>
        <p>Şifre kutusundaki eski şifreyi silip yeni bir şifre yazın. Modem <b>en az 8 karakter</b> ister; siz <b>12 ve üzerini</b> tercih edin. Doğum yılı, 1234, adınız olmasın. Örnek: <b>Gul-Cay-Bahce-47</b></p>
        <p>Sonra <b>Kaydet</b>'e basın.</p>`,
      hint: 'Önce kutudaki yazıyı Ctrl + A ile seçip silin, sonra yenisini yazın. Wi-Fi adını değiştirmek isterseniz adınızı ya da adresinizi yazmayın.',
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type === 'wifi-pass-weak') c.warn(ev.soft ? 'Şifre kısa: 12 ve üzeri önerilir. Uzatın, ya da bu şifreyle devam etmek isterseniz Kaydet\'e bir kez daha basın.' : 'Sayfadaki kırmızı uyarıyı okuyun. Şifre en az 8 karakter olmalı (12 ve üzeri daha iyi) ve tahmin edilmesi kolay olmamalı.');
        return ev.type === 'wifi-pass-saved';
      },
      done: 'Kaydedildi. Bağlantınız koptu mu? Kablosuz bağlıyken kaydedince bağlantı kopar; <b>bu normaldir</b>. Şimdi cihazlara bakalım.',
    },
    {
      title: 'Bütün cihazlara yeni şifreyi girin',
      html: `<p>Eski şifreyle bağlı her cihaz koptu. Her birinde Wi-Fi listesinden ağınızı seçip <b>yeni şifreyi</b> yazmanız gerekir.</p>
        <p>Sayfadaki cihazların her biri için, yeni şifreyi girdiğinizi varsayıp <b>Yeni şifreyi girdim</b> düğmesine basın.</p>`,
      hint: `Cihazlar: ${MODEM_CIHAZLAR.map(([, i, a]) => `${i} ${a}`).join(', ')}. Hiçbirini atlamayın; atlanan cihazda internet çalışmaz.`,
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type !== 'router-device') return false;
        if (ev.left) c.note(`${MODEM_CIHAZLAR.length - ev.left} / ${MODEM_CIHAZLAR.length} cihaz bağlandı.`);
        return ev.left === 0;
      },
      done: 'Hepsi yeni şifreyle bağlandı. Yeni şifre kâğıtta duruyor; bir yere kaldırın, etikete de yazabilirsiniz.',
    },
    {
      title: 'Takılırsanız: kendi başınıza zorlamayın',
      html: `<ul><li>Yönetim şifresini unuttunuz ya da modemin ayarı bozuldu: <b>internet sağlayıcınızı arayın</b>.</li>
        <li>Modemin arkasında küçük bir <b>“Reset”</b> deliği olur. Ucu ince bir şeyle basılınca modem <b>her şeyi fabrika ayarına döndürür</b>: Wi-Fi adı ve şifresi eski haline gelir, internet de gidebilir. <b>Bunu kendi başınıza yapmayın.</b></li>
        <li>Bilmediğiniz başka ayarlara dokunmayın.</li></ul>`,
      done: 'Kural basit: etiketteki bilgiler elinizde, ayar bozulursa internet şirketi yanınızda.',
    },
    rehberSoru({
      title: 'Komşu kullanıyor galiba!',
      html: `<p>İnternetiniz birkaç gündür yavaş. Komşunuzun Wi-Fi'nizi kullandığından şüpheleniyorsunuz. Şifre de uzun zamandır hiç değişmedi. Ne yaparsınız?</p>`,
      opts: [
        'Modemin arkasındaki Reset deliğine basıp her şeyi sıfırlarım',
        'Modemin sayfasından Wi-Fi şifresini değiştirir, cihazlara yenisini girerim',
        'Şifre etikette yazıyor, ona dokunmam; yavaşlık kendiliğinden geçer',
      ], ok: 1,
      wrong: 'Bu işi çözmez ya da risklidir. Şifreyi değiştiren seçeneği arayın.',
      why: 'Doğru. Önce yeni şifreyi kâğıda yazın, sonra 192.168.1.1\'e etiketteki yönetim şifresiyle girip Wi-Fi şifresini değiştirin, bütün cihazlara yeni şifreyi girin. Etiketteki şifreyi herkes görmüş olabilir; değiştirince komşunuz otomatik düşer. Reset deliği ise her şeyi siler ve interneti kesebilir. Takılırsanız internet sağlayıcınızı arayın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Modemin etiketini okumayı, Wi-Fi şifresini değiştirmeyi ve nelere dokunmamak gerektiğini öğrendiniz:</p>' },
  ],
};
