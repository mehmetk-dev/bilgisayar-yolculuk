// 14. hafta kısa dersi (e-Devlet'ten önce): “İlk e-Devlet şifrenizi alın”
// Giriş yolları, adres (turkiye.gov.tr), PTT'den şifre alma, ilk girişte yeni şifre, unutursanız, cep telefonu, şifreyi saklama.
// Benzetim yok; bilgi adımları ve karar soruları (rehberSoru).
import { desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

export const edevletIlk = {
  id: 'edevlet-ilk-giris', icon: '🔑', title: 'İlk e-Devlet şifrenizi alın', minutes: 20, stage: 'desktop',
  desc: 'e-Devlet şifresi nereden ve nasıl alınır, ilk girişte ne olur, hangi giriş yolları var, şifre unutulursa ne yapılır, şifre nasıl korunur.',
  summary: [
    ['Adres', 'turkiye.gov.tr · adres çubuğunda bunu görün; sahte siteler var'],
    ['Şifre nereden?', 'PTT şubesinden, kimlik kartıyla, şahsen. Küçük bir ücret alınabilir'],
    ['Zarf', 'Şifre kapalı zarfta verilir; zarftaki şifre geçicidir'],
    ['İlk giriş', 'Zarftaki şifreyle girin; sistem yeni bir şifre belirlemenizi ister'],
    ['Başkası adına', 'Vekâletle alınabilir; ayrıntısını PTT\'ye sorun'],
    ['Başka giriş yolları', 'e-imza · mobil imza · çipli kimlik kartı · internet bankacılığı (bankaya göre değişir)'],
    ['Cep telefonu', 'e-Devlet\'e kaydederseniz şifre yenilemek kolaylaşır'],
    ['Şifreyi unutursanız', 'Giriş sayfasındaki şifre yenileme yolu ya da yeniden PTT'],
    ['Şifre sizin', 'Kimseye söylemeyin: memur ya da “yardım edeceğim” diyen biri de dahil'],
    ['Saklamak', 'Yazacaksanız evde güvenli bir yerde saklayın'],
  ],
  steps: [
    {
      title: 'e-Devlet\'e ilk adım',
      html: `<p><b>e-Devlet</b>, devlet işlerinin internetten yapıldığı sitedir: belge almak, randevu almak, borç sorgulamak gibi.</p>
        <p>Bu siteye girmek için bir <b>şifreye</b> ihtiyacınız var. Şifreniz henüz yoksa sorun değil. Bu derste şifreyi <b>nereden</b> alacağınızı ve <b>ilk girişte</b> neler olduğunu göreceksiniz.</p>
        <p>Önce şifrenizi alın, sonra e-Devlet dersine geçin.</p>
        <p class="mut">Şifre almak bir kez yapılır. Sonra yıllarca kullanırsınız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Giriş yolları',
      html: `<p>e-Devlet'e birkaç yolla girilir:</p>
        <ol>
          <li><b>e-Devlet şifresi</b>: en yaygın yol. Bu derste bunu alacağız.</li>
          <li><b>e-imza</b> ve <b>mobil imza</b></li>
          <li><b>Çipli T.C. kimlik kartı</b></li>
          <li><b>İnternet bankacılığı</b>: <b>turkiye.gov.tr</b> giriş sayfasında <b>“İnternet Bankacılığı”</b> seçilir, sonra bankanız seçilir ve bankanın giriş ekranı açılır. Bankanızın kendi sitesinden değil, e-Devlet adresinden başlarsınız.</li>
        </ol>
        <p>Yeni başlayanlar için en kolayı <b>şifredir</b>. Öteki yolların çoğu ek cihaz, kart ya da başvuru ister.</p>
        <p class="mut">Hangi bankanın bu yolu sunduğunu bankanıza sorabilirsiniz.</p>`,
    },
    {
      title: 'Doğru adres',
      html: `<p>e-Devlet'in adresi: <b>turkiye.gov.tr</b></p>
        <p>Tarayıcıyı açtığınızda <b>adres çubuğunda</b> tam olarak bunu görün.</p>
        <p>İnternette e-Devlet'e benzeyen <b>sahte siteler</b> vardır. Sahte site size gerçeği gibi görünür, ama yazdığınız şifreyi çalar.</p>
        <ul>
          <li>Adresi tarayıcıya <b>kendiniz yazın</b>.</li>
          <li>SMS ya da e-postayla gelen bir bağlantıdan e-Devlet'e <b>girmeyin</b>.</li>
          <li>Adres çubuğunda <b>turkiye.gov.tr</b> dışında bir şey yazıyorsa şifrenizi yazmayın.</li>
        </ul>`,
    },
    {
      title: 'Şifre nereden alınır?',
      html: `<p>e-Devlet şifresi <b>PTT şubesinden</b> alınır.</p>
        <ul>
          <li><b>Kimlik kartınızla</b> ve <b>şahsen</b> gidersiniz.</li>
          <li>Küçük bir <b>ücret</b> alınabilir. Tutarı PTT'ye sorun.</li>
          <li>Şifre size <b>kapalı bir zarfta</b> verilir. Zarfı yalnızca siz açın.</li>
          <li>Şifre <b>kapıya gelmez</b>. Kapıya gelip “şifrenizi getirdik” diyen biri dolandırıcıdır.</li>
        </ul>
        <p>Yakınınız gidemiyorsa <b>vekâletle</b> da alınabilir. Ayrıntısını <b>PTT'ye sorun</b>.</p>`,
    },
    rehberSoru({
      title: 'PTT\'ye giderken',
      html: '<p>Yarın PTT şubesine e-Devlet şifrenizi almaya gideceksiniz. Yanınıza <b>ne almalısınız?</b></p>',
      opts: ['Kimlik kartınız ve ücret için biraz para', 'Yalnızca telefon numaranızı yazdığınız kâğıt', 'Komşunuzun kimliği, o sizin yerinize alır'], ok: 0,
      wrong: 'Şifre şahsen ve kimlikle alınır. Kimliksiz işlem yapılmaz.',
      why: 'Doğru. Kimlik kartınız şart. Küçük bir ücret alınabileceği için yanınızda para olsun. Başkası adına almak için vekâlet gerekir; ayrıntısını PTT\'ye sorun.',
    }),
    {
      title: 'İlk giriş: yeni şifre',
      html: `<p>Zarfı açtınız: içinde bir <b>geçici şifre</b> var.</p>
        <ol>
          <li><b>turkiye.gov.tr</b> adresine gidin.</li>
          <li>T.C. kimlik numaranızı ve zarftaki şifreyi yazın.</li>
          <li>Sistem <b>yeni bir şifre belirlemenizi</b> ister.</li>
          <li>Sadece sizin bileceğiniz, <b>tahmin edilmesi zor</b> bir şifre seçin.</li>
        </ol>
        <p>Bundan sonra <b>yeni şifrenizi</b> kullanırsınız. Zarftaki şifre artık geçerli olmaz.</p>
        <p class="mut">Doğum tarihiniz ya da 123456 gibi kolay şifreler seçmeyin.</p>`,
    },
    rehberSoru({
      title: 'Yeni şifre istiyor',
      html: '<p>Zarftaki şifreyle girdiniz. Sistem şimdi sizden <b>yeni bir şifre</b> istiyor. Ne yaparsınız?</p>',
      opts: ['Zarftaki şifreyi aynen yazarım, zaten verdiler', 'Zor tahmin edilen yeni bir şifre belirlerim', 'Doğum yılımı yazarım, böylece unutmam'], ok: 1,
      wrong: 'Zarftaki şifre geçicidir, kolay şifre de güvenli değildir. Yeni şifre güçlü olmalı.',
      why: 'Doğru. Zarftaki şifre yalnızca ilk giriş içindir; sistem bunu değiştirmenizi ister. Yeni şifreyi yalnızca siz bilin ve başkasının tahmin etmesi zor olsun.',
    }),
    {
      title: 'Cep telefonu ve unutma',
      html: `<p><b>Cep telefonu numaranızı</b> e-Devlet'e kaydedin. Bu, şifrenizi yenilemeyi kolaylaştırır.</p>
        <p>Şifrenizi <b>unutursanız</b>:</p>
        <ul>
          <li>e-Devlet'in <b>giriş sayfasındaki</b> şifre yenileme yolunu kullanın. Cep telefonunuz kayıtlıysa ya da internet bankacılığınız varsa bu yol işe yarar.</li>
          <li>Olmuyorsa <b>yeniden PTT'ye</b> gidin.</li>
        </ul>
        <p class="mut">Numaranız değiştiyse e-Devlet'te de güncelleyin.</p>`,
    },
    rehberSoru({
      title: 'Telefondaki ses',
      html: '<p>Telefon çalıyor. Arayan kişi: “Emekli maaşınız yatacak. <b>e-Devlet şifrenizi</b> söyleyin, hemen işleme koyalım.” Ne yaparsınız?</p>',
      opts: ['Şifreyi söylemem, telefonu kapatırım', 'Şifrenin yarısını söylerim, yarısını sonra', 'Önce adını sorarım, sonra şifreyi söylerim'], ok: 0,
      wrong: 'Gerçek bir kurum şifrenizi telefonda istemez. Şifrenin bir kısmını bile vermeyin.',
      why: 'Doğru. Memur da olsa, “yardım edeceğim” de dese, e-Devlet şifrenizi kimseye söylemeyin. Maaş için şifre gerekmez. Kapatın; endişeniz varsa kurumu kendiniz bilinen numaradan arayın.',
    }),
    {
      title: 'Şifrenizi koruyun',
      html: `<p>e-Devlet şifreniz <b>kimliğinizin anahtarıdır</b>. Onunla adınıza işlem yapılabilir.</p>
        <ul>
          <li><b>Kimseye söylemeyin.</b> Memur olduğunu söyleyen de, “yardım edeceğim” diyen de dahil.</li>
          <li>Unutmaktan korkuyorsanız <b>kâğıda yazın</b> ve evde <b>güvenli bir yerde</b> saklayın.</li>
          <li>Kâğıdı cüzdana ya da kimliğin yanına koymayın.</li>
          <li>Ortak bir bilgisayarda işiniz bitince <b>çıkış yapın</b>.</li>
        </ul>
        <p class="mut">Şifrenizi biri öğrendiyse hemen yenileyin.</p>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk e-Devlet şifrenizi almak için bilmeniz gerekenler:</p>' },
  ],
};
