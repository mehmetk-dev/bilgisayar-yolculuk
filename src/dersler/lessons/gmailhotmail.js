// 9. hafta ek dersi: Gmail ve Hotmail (Outlook) farkları. Adresler, hesap türü, görünüm (sekme / klasör), istenmeyen posta klasörü, hangisi seçilmeli.
import { info, ayir, sec, sekmeler } from './kalip.js';

const fact = (rows) => `<dl class="tb-facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

const GMAIL = `<div class="mlm mlm-g"><aside><b>Gmail</b><i class="on">📥 Gelen kutusu</i><i>⭐ Yıldızlı</i><i>📤 Gönderilmiş</i><i>📝 Taslaklar</i><i>🚫 Spam</i><i>🏷 Etiketler</i></aside>
  <main><nav><u class="on">Birincil</u><u>Promosyonlar</u><u>Sosyal</u></nav><p><b>Elif</b> · Bu akşam görüşelim mi?</p><p><b>Belediye</b> · Kurs duyurusu</p><p><b>Ahmet</b> · Fatura ödendi</p></main></div>`;
const OUTLOOK = `<div class="mlm mlm-o"><aside><b>Outlook</b><i class="on">📥 Gelen Kutusu</i><i>🚫 Önemsiz E-posta</i><i>📝 Taslaklar</i><i>📤 Gönderilmiş Öğeler</i><i>🗑 Silinmiş Öğeler</i><i>🗂 Arşiv</i></aside>
  <main><nav><u class="on">Odaklanmış</u><u>Diğer</u></nav><p><b>Elif</b> · Bu akşam görüşelim mi?</p><p><b>Belediye</b> · Kurs duyurusu</p><p><b>Ahmet</b> · Fatura ödendi</p></main></div>`;

const TABS = [
  {
    id: 'gmail', label: 'Gmail', icon: '✉',
    html: () => `${GMAIL}${fact([['Kim yapar?', 'Google'], ['Adres sonu', '<b>@gmail.com</b>'], ['Hesabın adı', '<b>Google hesabı</b>: Android telefon, YouTube, Google Drive, Haritalar, Fotoğraflar hepsi aynı hesap'], ['Depolama', 'Yaklaşık 15 GB; posta, Drive ve fotoğraflar <b>ortak</b> kullanır'], ['Düzen', 'Üstte <b>sekmeler</b> (Birincil, Promosyonlar, Sosyal); klasör yerine <b>etiket</b>'], ['İstenmeyen posta', '“<b>Spam</b>” klasörü'], ['Siteye giriş', 'gmail.com']])}`,
  },
  {
    id: 'outlook', label: 'Hotmail / Outlook', icon: '📧',
    html: () => `${OUTLOOK}${fact([['Kim yapar?', 'Microsoft'], ['Adres sonu', '<b>@hotmail.com</b>, <b>@outlook.com</b>, @live.com'], ['Hesabın adı', '<b>Microsoft hesabı</b>: Windows\'a giriş, Outlook, OneDrive, Teams, Word ve Excel (internette) hepsi aynı hesap'], ['Depolama', 'Posta kutusu yaklaşık 15 GB; bulut depo (OneDrive) ayrıdır'], ['Düzen', 'Soldaki <b>klasörler</b>; üstte Odaklanmış / Diğer'], ['İstenmeyen posta', '“<b>Önemsiz E-posta</b>” klasörü'], ['Siteye giriş', 'outlook.com']])}<p class="tb-note"><b>Hotmail</b> eskiden ayrı bir hizmetti; Microsoft 2013\'te adını <b>Outlook.com</b> yaptı. Eski @hotmail.com adresleri hâlâ çalışır; insanlar da hâlâ “hotmail” der.</p>`,
  },
  {
    id: 'ortak', label: 'Ortak yönleri', icon: '🤝',
    html: () => `${fact([['Fiyat', 'İkisi de <b>ücretsiz</b> (karşılığında reklam gösterir)'], ['Birbirine posta', 'Gmail\'den Hotmail\'e, Hotmail\'den Gmail\'e <b>sorunsuz</b> posta gider'], ['Ek göndermek', 'İkisinde de 📎 ile; çok büyük dosyalar için bulut bağlantısı kullanılır'], ['Telefon uygulaması', 'İkisinin de var'], ['Güvenlik', 'İkisinde de <b>iki adımlı doğrulama</b> (girişte telefona SMS kodu) açılabilir'], ['Şifre kurtarma', 'İkisinde de “Şifremi unuttum” + telefona ya da yedek e-postaya kod']])}<p class="tb-note">Yani biri ötekinden “daha iyi” değil; ikisi de aynı işi yapar. Önemli olan <b>hangisini kullandığınızı bilmek</b> ve şifresini unutmamaktır.</p>`,
  },
  {
    id: 'hangisi', label: 'Hangisini seçmeli?', icon: '🤔',
    html: () => `<ul class="big-list"><li><b>Android telefonunuz varsa:</b> zaten bir Google hesabınız (Gmail) vardır. Aynısını kullanmak en kolayıdır.</li><li><b>iPhone ya da Windows kullanıyorsanız:</b> ikisi de olur; Windows'a Microsoft hesabıyla girdiyseniz Outlook size hazırdır.</li><li><b>İkisini birden</b> kullanabilirsiniz; ama çok sayıda adres ve şifre karışıklık yaratır. Önce bir tanesini iyi öğrenin.</li></ul>
      <p class="tb-warn">⚠ Hangisini seçerseniz seçin: adresi, şifreyi ve kurtarma telefonunu <b>bir deftere yazın</b>.</p>`,
  },
];

export const gmailHotmail = {
  id: 'gmail-hotmail', icon: '✉', title: 'Gmail ve Hotmail (Outlook): farkları nelerdir?', minutes: 25, stage: 'scene',
  desc: 'İki yaygın e-posta hizmeti: Gmail ve Hotmail; hangisini seçmeli?',
  summary: [
    ['Gmail', 'Google; adres sonu @gmail.com; Google hesabı (Android, YouTube, Drive)'],
    ['Hotmail / Outlook', 'Microsoft; @hotmail.com, @outlook.com, @live.com; Microsoft hesabı (Windows, Office, OneDrive)'],
    ['Görünüş', 'Gmail: üstte sekmeler, etiketler; Outlook: soldaki klasörler'],
    ['İstenmeyen posta', 'Gmail\'de “Spam”; Outlook\'ta “Önemsiz E-posta” klasörü'],
    ['Birbirine posta', 'İkisi de ücretsizdir ve birbirine posta gönderir'],
    ['Hangisi?', 'Android\'de Gmail kolaydır; Windows hesabıyla Outlook; ikisi de olur'],
    ['Şifre', 'Adres, şifre ve kurtarma telefonunu deftere yazın; iki adımlı doğrulamayı açın'],
  ],
  steps: [
    {
      title: 'İki ayrı posta hizmeti',
      html: `<p>Çevrenizde herkesin e-posta adresi aynı değildir: kimi <b>@gmail.com</b>, kimi <b>@hotmail.com</b> ile biter. İkisi de <b>ücretsiz e-posta hizmetidir</b> ve çok benzerler; ama arkasındaki firma ve arayüz farklıdır.</p>
        <p>Bugün ikisini karşılaştıracağız. Kendi adresinizin hangisi olduğunu bilmek, şifre unutunca nereye gideceğinizi bilmenizi sağlar.</p>`,
      scene: info('<div class="sc-big">✉ G &nbsp; ✉ H</div><p>@gmail.com ve @hotmail.com<br>aynı işi yapan iki hizmet</p>'),
    },
    {
      title: 'İkisine birlikte bakın',
      html: '<p>Dört sekmeye <b>sırayla tıklayıp</b> okuyun. İlk iki sekmede gelen kutusunun küçük bir taslağını göreceksiniz: <b>soldaki listeye</b> ve <b>üstteki sekmelere</b> dikkat edin.</p>',
      scene: sekmeler({ tabs: TABS, intro: 'Aynı üç posta iki farklı düzende.' }),
      on: (ev) => ev.type === 'tabs-done',
      done: 'Dördünü okudunuz. Şimdi öğrendiklerinizi sınayalım.',
    },
    ayir({
      title: 'Hangisine ait?',
      html: '<p>Her kartı doğru kutuya sürükleyin: <b>Gmail</b>, <b>Hotmail / Outlook</b> ya da <b>ikisinde de</b> olan?</p>',
      bins: [{ id: 'g', label: 'Gmail', icon: '✉' }, { id: 'o', label: 'Hotmail / Outlook', icon: '📧' }, { id: 'b', label: 'İkisinde de', icon: '🤝' }],
      items: [
        { label: 'Adres @gmail.com ile biter', icon: '@', bin: 'g', why: 'Gmail adresleri böyle biter.' },
        { label: 'Adres @hotmail.com ya da @outlook.com ile biter', icon: '@', bin: 'o', why: 'Microsoft\'un posta adresleri.' },
        { label: 'İstenmeyenler “Spam” klasörüne düşer', icon: '🚫', bin: 'g', why: 'Gmail\'de adı Spam.' },
        { label: 'İstenmeyenler “Önemsiz E-posta” klasörüne düşer', icon: '🚫', bin: 'o', why: 'Outlook\'ta adı Önemsiz E-posta.' },
        { label: 'Üstte Birincil / Promosyonlar / Sosyal sekmeleri', icon: '🗂', bin: 'g', why: 'Gmail postaları sekmelere ayırır.' },
        { label: 'Ücretsizdir', icon: '🆓', bin: 'b', why: 'İkisi de ücretsiz, karşılığında reklam gösterir.' },
        { label: 'Birbirine posta gönderir', icon: '🔁', bin: 'b', why: 'Hangi hizmette olursanız olun posta ulaşır.' },
      ],
      done: 'İki hizmeti ayırt ediyorsunuz.',
    }),
    sec({
      title: 'Posta ulaşır mı?', text: '<p>Torununuzun adresi <b>elif@gmail.com</b>, sizin adresiniz <b>ahmet@hotmail.com</b>. Ona e-posta yazacaksınız.</p>',
      q: 'Posta ulaşır mı?', opts: ['Hayır, aynı hizmette olmak gerekir', 'Evet; Gmail ile Hotmail birbirine posta gönderir', 'Yalnızca ek yoksa ulaşır'], ok: 1,
      why: 'E-posta, telefon gibi ortak bir sistemdir: hangi hizmette olursanız olun adresi doğru yazdığınız sürece posta ulaşır.',
    }),
    sec({
      title: 'Hotmail şifresi', text: '<p>Bir komşunuz <b>@hotmail.com</b> adresinin şifresini unuttu. Telefonundan Gmail’e girmeyi deniyor, olmuyor.</p>',
      q: 'Ona ne söylersiniz?', opts: ['Gmail\'e değil, Microsoft\'un sitesine (outlook.com) gidip “Şifremi unuttum”u kullansın', 'Yeni adres açsın, eskisini bıraksın', 'Google\'a şifresini sorsun'], ok: 0,
      why: 'Her hesabın şifresi, o hesabı veren firmanın sitesinden sıfırlanır: Hotmail/Outlook için Microsoft, Gmail için Google. Bunun için adresin sonuna bakmak yeter.',
    }),
    sec({
      title: 'Hangisini açmalı?', text: '<p>Yeni bir <b>Android telefon</b> aldınız ve ilk açılışta sizden bir <b>Google hesabı</b> istiyor. Hiç e-posta adresiniz yok.</p>',
      q: 'Ne yaparsınız?', opts: ['Telefonun önerdiği gibi yeni bir Google hesabı (Gmail adresi) açarım', 'Önce Hotmail açarım; Google hesabı onsuz açılmaz', 'Hesap açmam; telefon hesapsız da tam çalışır'], ok: 0,
      why: 'Android telefonlar Google hesabıyla çalışır; açtığınız Gmail adresi hem e-posta hem telefon hesabınız olur. Hotmail\'e ihtiyaç yoktur; isterseniz sonradan ekleyebilirsiniz.',
    }),
    sec({
      title: 'Şüpheli uyarı', kind: 'mail', from: 'Hotmail Destek <destek@hotmail-hesap.xyz>', subject: 'Hesabınız 24 saat içinde kapatılacak!',
      text: 'Sayın kullanıcı, hesabınız doğrulanamadı. Kapanmaması için şifrenizi şu bağlantıdan hemen yenileyin: <u>http://hotmail-guvenlik.xyz/giris</u>',
      q: 'Ne yaparsınız?', opts: ['Bağlantıya tıklayıp şifremi yazarım', 'Tıklamam; gerçekten bir sorun varsa doğrudan outlook.com\'a kendim girip bakarım', 'Başkalarına iletirim'], ok: 1,
      why: 'Gönderen adresine (.xyz) ve “24 saat” baskısına dikkat: kimlik avıdır. Hiçbir posta hizmeti şifrenizi e-postadaki bağlantıdan istemez. Hesabınızı kontrol etmek için adresi kendiniz yazın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Gmail ve Hotmail:</p>', scene: info('<div class="sc-big">✉ ⇄ ✉</div>') },
  ],
};
