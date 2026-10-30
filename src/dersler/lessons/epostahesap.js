// 9. hafta ek dersi: kendi e-posta adresinizi açmak. Ad ve doğum tarihi, kullanıcı adı (alınmış uyarısı, öneri), uzun şifre,
// kurtarma telefonu ve SMS kodu, şartlar, adresi güvenli bir yere yazmak. Uydurma site: E-Hesabım (adresler ornek.com ile biter).
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const SITE = 'www.e-hesabim.com.tr';
const br = (c, url) => maxed(c, 'browser', url ? { url } : {});
const KART = `<div class="kurs-kart">🪪 Kurs için verilen bilgiler<br>Ad: <b>Ayşe</b> · Soyad: <b>Yılmaz</b><br>Doğum tarihi: <b>12 Mart 1958</b><br>Cep telefonu: <b>0555 123 45 67</b></div>`;

export const epostaHesap = {
  id: 'eposta-hesap-ac', icon: '🆕', title: 'Kendi e-posta adresinizi açın', minutes: 30, stage: 'desktop',
  desc: 'Ad ve doğum tarihi, kullanıcı adı seçmek, uzun şifre, kurtarma telefonu, SMS kodu; adresi deftere yazmak.',
  summary: [
    ['Kendi adresiniz', 'Torunun ya da komşunun açtığı adres değil, şifresini bildiğiniz kendi adresiniz'],
    ['Kullanıcı adı', 'ad.soyad ve rakam: ayse.yilmaz1958. Küçük harf, rakam, nokta; Türkçe harf ve boşluk yok'],
    ['“Alınmış” uyarısı', 'Çok kişi aynı adı ister; öneriden seçin ya da sonuna doğum yılınızı ekleyin'],
    ['Şifre', 'Site en az 8 ister; siz 12 ve üzerini tercih edin: uzun bir cümle gibi'],
    ['Kurtarma telefonu', 'Şifrenizi unutunca SMS kodu oraya gelir; mutlaka sizin numaranız olsun'],
    ['SMS kodu', 'Yalnızca sitenin kutusuna yazılır; telefonla arayana asla söylenmez'],
    ['Kurtarma e-postası', 'İsteğe bağlı; ikinci bir adresiniz varsa yazın'],
    ['Adres ve şifre', 'Evde güvenli bir yerdeki deftere yazın; ekrana, monitöre yapıştırmayın'],
  ],
  steps: [
    {
      title: 'Neden kendi adresiniz?',
      html: `<p>E-posta adresi, internetteki <b>kimliğinizdir</b>. e-Devlet, banka, alışveriş, hastane randevusu: hepsi sizden bir adres ister ve şifre sıfırlama kodu da oraya gelir.</p>
        <p>Çoğu kişinin adresini <b>torunu ya da komşusu açmıştır</b> ve şifresini bilmez. Böyle bir adres, ihtiyaç anında işe yaramaz. Bugün <b>kendi adresinizi kendiniz</b> açacaksınız.</p>
        <p class="mut">Gerçek hayatta adresler <b>@gmail.com</b> ya da <b>@outlook.com</b> gibi biter. Bu derste uydurma bir sitede çalışıyoruz; adresiniz <b>@ornek.com</b> ile bitecek. Adımlar gerçeğinin hemen hemen aynısıdır. Bilgileriniz bu kartta:</p>${KART}`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Siteyi açın',
      html: `<p>İnternet'i açın, adres çubuğuna <b>${SITE}</b> yazın. Giriş sayfasının altındaki <b>Hesap oluştur</b> bağlantısına tıklayın.</p>`,
      hint: 'Hesap oluştur bağlantısı, Şifremi unuttum bağlantısının altında.',
      setup: (c) => br(c),
      on: (ev, c) => {
        if (ev.type === 'web-nav' && ev.host === SITE && ev.path === '/kayit') return true;
        if (ev.type === 'web-nav' && ev.host === SITE) c.note('Site açıldı. Şimdi giriş kutusunun altındaki “Hesap oluştur” bağlantısına tıklayın.');
        return false;
      },
      done: 'Hesap oluşturma sayfası açıldı. Altı küçük adım var; sayfanın üstünde “Adım 1 / 6” yazar.',
    },
    {
      title: 'Ad, soyad ve doğum tarihi',
      html: `<p>Karttaki bilgileri yazın: <b>Ayşe</b>, <b>Yılmaz</b>. Doğum tarihi için gün kutusuna <b>12</b>, <b>Ay</b> listesinden <b>Mart</b>, yıl kutusuna <b>1958</b>. Sonra <b>Sonraki</b>.</p>
        <p class="mut">Gerçek hayatta <b>gerçek bilgilerinizi</b> yazın. Hesabınızı kurtarırken bunlar sorulur.</p>`,
      hint: 'Ay bir açılır listedir: tıklayın, Mart\'ı seçin. Yıl 4 rakam olmalı.',
      on: (ev, c) => {
        if (ev.type === 'acct-name' && !ev.ok) c.warn('Sayfadaki kırmızı uyarıyı okuyun ve düzeltin. Ad, soyad, gün, ay ve yılın hepsi dolu olmalı.');
        return ev.type === 'acct-name' && ev.ok;
      },
      done: 'Ad ve doğum tarihi alındı.',
    },
    {
      title: 'Kullanıcı adı: “alınmış”',
      html: `<p>Adresinizin başı sizin seçtiğiniz <b>kullanıcı adıdır</b>. Küçük harfle, ad ve soyadı bir noktayla birleştirerek yazın: <b>ayse.yilmaz</b>. Türkçe harf (ç, ğ, ı, ö, ş, ü) ve boşluk kullanamazsınız; <b>ş</b> yerine <b>s</b>, <b>ı</b> yerine <b>i</b> yazın. Sonra <b>Sonraki</b>.</p>
        <p class="mut">Bu ad büyük olasılıkla <b>başkasına aittir</b>. Uyarı çıkması normaldir.</p>`,
      hint: 'Ayşe Yılmaz için: ayse.yilmaz (hepsi küçük, aralarında nokta, boşluk yok).',
      on: (ev, c) => {
        if (ev.type === 'acct-name-taken') return true;
        if (ev.type === 'acct-user' && !ev.ok) c.warn('Kırmızı uyarıyı okuyun. Yalnızca küçük harf (a-z), rakam ve nokta; en az 6 karakter. Örnek: ayse.yilmaz');
        if (ev.type === 'acct-user' && ev.ok) { c.L.adSecildi = true; c.note('Bu ad boşmuş. Genellikle ad.soyad alınmış olur; sorun değil, yola devam edelim.'); return true; }
        return false;
      },
      done: 'Böyle uyarılar gerçek sitelerde de çıkar: kullanıcı adları <b>herkes için tektir</b>, bir kişi bir adı alınca başkası alamaz.',
    },
    {
      title: 'Öneriden ya da rakamla seçin',
      html: `<p>Sitenin önerdiği adreslerden birini seçin; kutuya yazılır. <b>ayse.yilmaz1958</b> gibi (ad, nokta, soyad, <b>doğum yılı</b>) olanı seçmeniz önerilir: okuması da söylemesi de kolaydır. Sonra <b>Sonraki</b>'ye tıklayın.</p>
        <p class="mut">Adreste doğum yılı olabilir, çünkü adres herkese görünür bir addır. Şifrede ise doğum yılı kullanmayın; tahmin edilir.</p>
        <p class="mut">Kaçının: çok uzun adlar, art arda rakamlar (ayse.yilmaz3847291). Telefonda birine adresinizi söylerken zor olur.</p>`,
      hint: 'Öneriler sarı kutuda düğme olarak duruyor. Birine tıklayınca kutuya yazılır; sonra Sonraki\'ye basın.',
      check: (c) => !!c.L.adSecildi,
      on: (ev, c) => {
        if (ev.type === 'acct-pick') c.note('Adres kutuya yazıldı. Şimdi <b>Sonraki</b>\'ye tıklayın.');
        if (ev.type === 'acct-name-taken') c.warn('Bu ad da alınmış. Öneri düğmelerinden birini seçin.');
        if (ev.type === 'acct-user' && !ev.ok && ev.reason !== 'alinmis') c.warn('Kırmızı uyarıyı okuyun; kullanıcı adı yalnızca küçük harf, rakam ve nokta içerebilir.');
        return ev.type === 'acct-user' && ev.ok;
      },
      done: 'Adresiniz belli oldu. Okuması kolay bir ad, ileride işinizi çok kolaylaştırır.',
    },
    {
      title: 'Uzun bir şifre belirleyin',
      html: `<p>İki kutuya da <b>aynı şifreyi</b> yazın. Site en az <b>8 karakter</b> ister; siz <b>12 ve üzerini</b> tercih edin. En kolayı <b>uzun bir cümle</b>: üç dört kelimeyi yan yana yazın, bir yerine büyük harf ve rakam ekleyin. Örneğin <b>Mavi kedim her sabah 7de uyanir</b>.</p>
        <p class="mut">Bu örneği <b>aynen yazmayın</b>, kendi cümlenizi uydurun. Adınız, soyadınız, doğum yılınız ya da 123456 olmasın. <b>👁 Şifreyi göster</b> ile yazdığınızı gözle kontrol edebilirsiniz; yanınızda kimse yokken.</p>`,
      hint: 'Boşluk da bir karakterdir: kelimeleri boşlukla ayırabilirsiniz. Sitenin renkli çubuğu şifrenin gücünü gösterir.',
      on: (ev, c) => {
        if (ev.type === 'acct-pass-show') c.note('Şifreyi gözle kontrol edebilirsiniz; ama yalnızca yanınızda kimse yokken gösterin.');
        if (ev.type !== 'acct-pass') return false;
        if (ev.ok && ev.len >= 12) return true;
        if (ev.ok) { c.warn('Site bu şifreyi kabul etti ama kursun kuralı 12 karakter. Sonraki sayfadaki “← Şifreyi değiştir” bağlantısıyla geri dönüp daha uzun bir cümle yazın.'); return false; }
        if (ev.soft) c.warn('Site 8 karakteri kabul eder ama bu şifre kısa. 12 ve üzeri olacak şekilde uzatın: birkaç kelime daha ekleyin.');
        else if (ev.reason === 'uyusmuyor') c.warn('İki şifre aynı değil. İkinci kutuya birincinin aynısını yazın; kopyalamak için şifreyi gösterebilirsiniz.');
        else c.warn('Şifre kabul edilmedi; sayfadaki kırmızı uyarıyı okuyup düzeltin.');
        return false;
      },
      done: 'Şifre kabul edildi. Uzun bir cümle, kısa ve karmaşık bir şifreden hem daha güçlü hem hatırlaması daha kolaydır.',
    },
    {
      title: 'Kurtarma telefonu',
      html: `<p>Şimdi telefon numaranızı yazın: <b>0555 123 45 67</b>. Şifrenizi unutursanız ya da biri hesabınıza girmeye çalışırsa <b>SMS kodu</b> bu numaraya gelir.</p>
        <p><b>Kurtarma e-postası</b> isteğe bağlıdır: başka bir adresiniz varsa yazarsınız, yoksa <b>boş bırakın</b>. Sonra <b>Kod gönder</b>'e tıklayın.</p>
        <p class="mut">Telefon <b>sizin</b> numaranız olsun; torununuzunki değil. Kod başkasına giderse hesap sizin olmaz.</p>`,
      hint: 'Numarayı 0555 123 45 67 ya da 05551234567 diye yazabilirsiniz.',
      on: (ev, c) => {
        if (ev.type === 'acct-phone' && !ev.ok) c.warn('Kırmızı uyarıyı okuyun. Numara 05 ile başlar ve 11 rakamdır. Kurtarma e-postasını yazmayacaksanız boş bırakın.');
        return ev.type === 'acct-phone' && ev.ok;
      },
      done: 'Telefonunuza SMS gönderildi. Ekranın sağ altında “SMS · E-HESABIM” çıkacak.',
    },
    {
      title: 'SMS kodunu yazın',
      html: '<p>Sağ altta çıkan <b>SMS</b>\'teki <b>6 haneli kodu</b> sayfadaki kutuya yazın ve <b>Doğrula</b>\'ya tıklayın.</p><p class="mut">Kod gelmediyse “Yeniden gönder”e basın.</p>',
      hint: 'Kod 6 rakamdır. SMS kutusu 40 saniye kalır.',
      on: (ev, c) => {
        if (ev.type === 'acct-code' && !ev.ok) c.warn('Kod yanlış. SMS\'teki 6 haneli sayıyı dikkatle yazın; gerekirse “Yeniden gönder”e basın.');
        return ev.type === 'acct-code' && ev.ok;
      },
      done: 'Telefon doğrulandı. Bu kodu <b>kimseye söylemeyin</b>; hiçbir görevli sizi arayıp kod istemez.',
    },
    {
      title: 'Şartları kabul edin',
      html: '<p>Gizlilik ve şartlar metnini aşağı kaydırarak okuyun. <b>Şartları okudum ve kabul ediyorum</b> kutusunu işaretleyip <b>Hesabı oluştur</b>\'a tıklayın.</p><p class="mut">Gerçek sitelerde bu metin çok uzundur; en azından <b>şifreden kimin sorumlu olduğuna</b> ve <b>bilgilerin nasıl kullanıldığına</b> göz atın.</p>',
      hint: 'Kutuya tıklayınca içinde ✔ işareti çıkar.',
      on: (ev, c) => {
        if (ev.type === 'acct-terms') c.warn('Hesap açmak için kutuyu işaretlemeniz gerekir.');
        if (ev.type === 'acct-created') { c.L.mail = ev.mail; return true; }
        return false;
      },
      done: 'Hesabınız açıldı. Sayfada yeni adresiniz büyük harflerle yazıyor.',
    },
    {
      title: 'Yeni adresle giriş',
      html: (c) => `<p>Yeni adresiniz: <b>${c.L.mail || 'ayse.yilmaz1958@ornek.com'}</b>. Önce bir deftere <b>adresi ve şifreyi</b> yazın; defter evde, güvenli bir yerde dursun.</p>
        <p>Sonra sayfadaki <b>giriş sayfasına</b> bağlantısına tıklayın ve yeni adresiniz ile şifrenizle <b>Giriş yap</b>'a tıklayın.</p>`,
      hint: 'Adresi @ornek.com ile birlikte tam yazın. Şifre, iki kutuya yazdığınız şifredir.',
      on: (ev, c) => {
        if (ev.type === 'hesap-login' && !ev.ok) c.note('Giriş olmadı. Adresi @ornek.com ile birlikte tam yazın; şifreyi büyük-küçük harfine dikkat ederek yazın.');
        return ev.type === 'hesap-login' && ev.ok && ev.yeni;
      },
      done: 'İçeri girdiniz: hesabınız çalışıyor. Çıkış yapmayı unutmayın.',
    },
    rehberSoru({
      title: 'Telefon geldi',
      html: '<p>Birisi sizi arıyor: “Hesabınıza girilmeye çalışıldı. Telefonunuza <b>6 haneli bir kod</b> geldi, okur musunuz, hesabınızı koruyalım.” Ne yaparsınız?</p>',
      opts: ['Kodu okurum, hesabımı korumaya çalışıyor', 'Telefonu kapatırım; kodu kimseye söylemem', 'Kodun yarısını söylerim'], ok: 1,
      wrong: 'Bu dolandırıcılığın klasik yolu. Kod kimseye söylenmez.',
      why: 'Doğru. Kod yalnızca sizin sitenin kutusuna yazmanız içindir. İsteyen herkes dolandırıcıdır; bankalar ve e-posta şirketleri sizi arayıp kod istemez.',
    }),
    rehberSoru({
      title: 'Adres ve şifre nerede dursun?',
      html: '<p>Yeni adresinizi ve şifrenizi nerede saklarsınız?</p>',
      opts: ['Monitörün kenarına yapışkan notla', 'Evdeki güvenli bir defterde', 'Telefonda “şifrem” adlı notta'], ok: 1,
      wrong: 'Bu pek güvenli değil. Başkası görebilecek bir yer olmasın.',
      why: 'Doğru. Defteri evde güvenli bir yerde, bilgisayardan uzakta saklayın ve başkasına göstermeyin. Yapışkan not ve telefon notunu başkası görebilir. Aklınızda tutmaya çalışmayın; yazmak yanlış değildir, yeter ki başkası ulaşamasın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kendi e-posta adresinizi açtınız:</p>' },
  ],
};
