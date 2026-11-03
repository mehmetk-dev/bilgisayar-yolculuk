// 14. hafta kısa dersi (e-Devlet'ten önce): “İlk e-Devlet şifrenizi alın”
// Giriş yolları, adres (turkiye.gov.tr), PTT'den şifre alma, ilk girişte yeni şifre, unutursanız, cep telefonu, şifreyi saklama.
// Bilgi adımları, karar soruları (rehberSoru) ve e-Devlet benzetiminde (apps/siteler-gunluk.js) uygulama: adresi yazmak,
// zarftaki geçici şifreyle girmek, yeni şifre belirlemek, çıkıp yeni şifreyle yeniden girmek.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { KURS_TC, ZARF_SIFRE } from '../apps/siteler-gunluk.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});
const ED = 'turkiye.gov.tr'; // tarayıcıdaki site durumu anahtarı (giriş, ilk giriş, yeni şifre)
const edSt = (c) => (((c.d.webState ||= {})[ED]) ||= {});
const ZARF = `<div style="border:2px solid #b08a3e;background:#fff8e6;color:#222;padding:0.6em 0.9em;margin:0.6em 0;border-radius:6px;line-height:1.8;max-width:22em">
  <b>✉ PTT zarfının içi</b><br>T.C. Kimlik No: <b style="font-family:monospace">${KURS_TC}</b><br>Geçici şifre: <b style="font-family:monospace;font-size:1.15em">${ZARF_SIFRE}</b>
  <br><small style="color:#666">Bu şifre yalnızca ilk giriş içindir. Alıştırma bilgileridir.</small></div>`;

export const edevletIlk = {
  id: 'edevlet-ilk-giris', icon: '🔑', title: 'İlk e-Devlet şifrenizi alın', minutes: 30, stage: 'desktop',
  desc: 'e-Devlet şifresi nereden ve nasıl alınır, ilk girişte ne olur, hangi giriş yolları var, şifre unutulursa ne yapılır, şifre nasıl korunur.',
  summary: [
    ['Adres', 'turkiye.gov.tr · adres çubuğunda bunu görün; sahte siteler var'],
    ['Şifre nereden?', 'PTT şubesinden, kimlik kartıyla, şahsen. Küçük bir ücret alınabilir'],
    ['Zarf', 'Şifre kapalı zarfta verilir; zarftaki şifre geçicidir'],
    ['İlk giriş', 'Zarftaki şifreyle girin; sistem yeni bir şifre belirlemenizi ister; iki kutuya aynısını yazın'],
    ['Sonraki girişler', 'Yeni şifrenizle; zarftaki şifre artık geçmez'],
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
      title: 'Adresi kendiniz yazın',
      html: '<p>Tarayıcı açıldı. Adres çubuğuna <b>turkiye.gov.tr</b> yazıp <b>Enter</b>\'a basın.</p>',
      setup: (c) => { (c.d.webState ||= {})[ED] = { ilk: true }; br(c); },
      hint: 'Adres çubuğu pencerenin en üstünde. Tıklayın, yazın, Enter.',
      on: (ev) => ev.type === 'web-nav' && /(^|\.)turkiye\.gov\.tr$/.test(ev.host),
      done: 'Adres çubuğunda <b>turkiye.gov.tr</b> yazıyor. Doğru yerdesiniz.',
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
      title: 'Zarftaki şifreyle girin',
      html: `<p>PTT'den zarfı aldınız ve evde açtınız:</p>${ZARF}
        <p>Sağ üstteki <b>Giriş yap</b>'a tıklayın. T.C. Kimlik No ve <b>geçici şifreyi</b> yazıp <b>Giriş Yap</b>'a basın.</p>`,
      setup: (c) => { const st = edSt(c); if (!st.sifre && !st.mustChange) st.ilk = true; br(c); },
      hint: `T.C. Kimlik No: ${KURS_TC} · Geçici şifre: ${ZARF_SIFRE}. Şifre kutusunda yazdıklarınız nokta olarak görünür; bu normaldir.`,
      on: (ev, c) => {
        if (ev.type === 'edevlet-login' && !ev.ok) c.note('Rakamları zarftan tek tek kontrol edin.');
        return ev.type === 'edevlet-login' && ev.ok && ev.zarf;
      },
      done: 'Girdiniz. Ama sistem hemen <b>yeni bir şifre</b> istiyor: zarftaki şifre geçicidir.',
    },
    {
      title: 'Yeni şifrenizi belirleyin',
      html: `<p>Sayfadaki kuralları okuyun. Yalnızca sizin bileceğiniz bir şifre düşünün ve <b>iki kutuya da aynısını</b> yazın.</p>
        <p>Örnek bir yol: sevdiğiniz iki kelime ve bir sayı, ör. <b>LimonAgaci47Bahce</b>. (Bunu değil, kendinizinkini seçin.)</p>
        <p class="mut">Unutmaktan korkuyorsanız önce kâğıda yazın; kâğıdı evde güvenli bir yerde saklayın.</p>`,
      hint: 'En az 8 karakter, harf ve rakam birlikte. Doğum yılı, 1234 ya da T.C. numarası olmasın. İki kutuya aynısını yazın.',
      on: (ev, c) => {
        if (ev.type === 'edevlet-newpass' && !ev.ok) c.note(ev.err);
        return ev.type === 'edevlet-newpass' && ev.ok;
      },
      done: 'Şifreniz değişti. Bundan sonra <b>yeni şifrenizi</b> kullanırsınız; zarftaki artık geçmez.',
    },
    {
      title: 'Çıkış yapın',
      html: '<p>İşiniz bitti. Sağ üstteki <b>⏻ Çıkış</b>\'a tıklayın. Ortak bilgisayarda bunu hiç unutmayın.</p>',
      on: (ev) => ev.type === 'edevlet-logout',
    },
    {
      title: 'Yeni şifrenizle girin',
      html: '<p>Şimdi yeniden girin: <b>Giriş yap</b> → T.C. Kimlik No ve <b>az önce belirlediğiniz yeni şifre</b>.</p><p class="mut">İsterseniz önce zarftaki şifreyi deneyin; artık geçmediğini görün.</p>',
      hint: `T.C. Kimlik No: ${KURS_TC}. Şifre: bir önceki adımda kendinizin yazdığı yeni şifre.`,
      on: (ev, c) => {
        if (ev.type === 'edevlet-login' && !ev.ok) c.note('Yeni belirlediğiniz şifreyi yazın. Büyük-küçük harfe dikkat edin.');
        return ev.type === 'edevlet-login' && ev.ok && ev.yeni;
      },
      done: 'Yeni şifrenizle girdiniz. Artık e-Devlet\'i kullanmaya hazırsınız.',
    },
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
