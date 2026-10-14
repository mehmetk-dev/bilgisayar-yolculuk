// 8. hafta ek ders: internet adresini (URL) okumak. Adresin parçaları (https, www, alan adı, uzantı, yol), kilit ve
// site bilgileri, .gov.tr / .com.tr / .xyz uzantıları, yazım hatası, arama sonucundaki sahte reklam, kilitli sahte site,
// alt alan adı tuzağı, “Güvenli değil” (http), adres çubuğu önerileri, bildirim izni, adresi kopyalamak.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const B = (c) => c.d.find('browser')?.api;
const goTo = (c, url) => { const w = maxed(c, 'browser'); w.api.go(url, 'link'); };
const URL_PARTS = `<div class="url-anat"><span class="bu-scheme">https://</span><span class="bu-www">www.</span><span class="bu-name">turkiye</span><span class="bu-tld">.gov.tr</span><span class="bu-path">/giris</span></div>
  <ul class="url-legend"><li><span class="bu-scheme">https://</span> şifreli bağlantı (s = secure, güvenli)</li><li><span class="bu-www">www.</span> çoğu adreste olur; yazmasanız da olur</li>
  <li><span class="bu-name">turkiye</span><span class="bu-tld">.gov.tr</span> <b>alan adı: sitenin asıl adı</b>. En önemli parça budur.</li><li><span class="bu-path">/giris</span> sitenin içindeki sayfa</li></ul>`;

export const adres = {
  id: 'adres', icon: '🔗', title: 'İnternet adresini (URL) okumak', minutes: 40, stage: 'desktop',
  desc: 'Adresin parçaları (https, www, alan adı, uzantı, sayfa), kilit simgesi ve site bilgileri, .gov.tr ve .com.tr, yazım hatası, sahte reklam, kilitli sahte site, alt alan adı tuzağı, “Güvenli değil”, adres önerileri, bildirim izni, adresi kopyalamak.',
  summary: [
    ['Alan adı', 'Adresin ilk “/” işaretinden hemen önceki kısmı: sitenin asıl adı (turkiye.gov.tr)'],
    ['Sağdan sola okuyun', 'bankam.com.tr.hesap-dogrulama.xyz → site hesap-dogrulama.xyz\'nindir'],
    ['.gov.tr / .edu.tr / .bel.tr', 'Yalnızca devlet / üniversite / belediye alabilir'],
    ['.com, .xyz', 'Herkes alabilir'],
    ['🔒 Kilit', 'Bağlantı şifreli demektir; site dürüst demek DEĞİLDİR'],
    ['⚠ Güvenli değil', 'Şifre ve kart bilgisi girmeyin'],
    ['Kilide tıklamak', 'Site bilgileri: adresin parçaları, sertifika, izinler'],
    ['Bildirim izni', 'Tanımadığınız sitelere “Engelle”'],
    ['Adres çubuğuna tık → Ctrl + C', 'Adresi kopyalar (e-postaya, mesaja yapıştırmak için)'],
  ],
  steps: [
    {
      title: 'Adres (URL) nedir?',
      html: `<p>Her web sayfasının bir <b>adresi</b> vardır; buna <b>URL</b> da denir. Evlerin adresi gibi: adresi doğru okuyan, doğru kapıyı çalar.</p>${URL_PARTS}
        <p>Dolandırıcılar en çok <b>adresle</b> kandırır: sayfayı gerçeğinin aynısı yapabilirler, ama <b>gerçek alan adını alamazlar</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser'); },
    },
    {
      title: 'Adresi yazın',
      html: `<p>Adres çubuğuna tıklayın, <b>turkiye.gov.tr</b> yazıp ${K('Enter')}\'a basın.</p>`,
      target: 'turkiye.gov.tr',
      hint: 'Adres çubuğu en üstteki uzun beyaz kutudur. Tıklayınca içindeki yazı seçilir; yazmaya başlayınca silinir.',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.turkiye.gov.tr',
      done: 'e-Devlet açıldı. Siz yalnızca <b>turkiye.gov.tr</b> yazdınız; <b>www.</b> ve <b>https://</b> kısmını tarayıcı kendisi tamamladı.',
    },
    {
      title: 'Kilide tıklayın',
      html: '<p>Adres çubuğunun solundaki <b>🔒 kilide</b> tıklayın. Açılan kutuda adresin renkli parçalarına, “Bu site” satırına ve sertifikaya bakın.</p>',
      mouse: '🖱 🔒 kilit',
      on: (ev) => ev.type === 'web-siteinfo',
      done: 'Sarı ve mavi parça <b>alan adıdır</b>: <b>turkiye.gov.tr</b>. Sertifika da bu ada verilmiş. Kutuyu ✕ ile kapatabilirsiniz.',
    },
    rehberSoru({
      title: 'Sitenin asıl adı',
      html: '<p><b>https://www.bankam.com.tr/kredi-karti/basvuru</b> adresinde sitenin asıl adı (alan adı) hangisi?</p>',
      opts: ['https', 'bankam.com.tr', 'kredi-karti/basvuru'],
      ok: 1,
      wrong: 'Alan adı, ilk tek “/” işaretinden hemen önceki kısımdır.',
      why: 'Doğru. “/” işaretinden sonrası sitenin içindeki sayfalardır; sitenin sahibini <b>alan adı</b> söyler.',
    }),
    rehberSoru({
      title: 'Uzantılar',
      html: `<p>Adresin sonundaki <b>uzantı</b> da ipucu verir:</p><ul><li><b>.gov.tr</b> devlet kurumu · <b>.edu.tr</b> üniversite · <b>.k12.tr</b> okul · <b>.bel.tr</b> belediye</li><li><b>.com.tr</b> Türkiye'de şirket</li><li><b>.com</b>, <b>.net</b>, <b>.xyz</b> herkes alabilir</li></ul>
        <p>Vergi borcunuza bakmak istiyorsunuz. Hangi adres gerçek bir devlet sitesi olabilir?</p>`,
      opts: ['www.vergi-borcu-sorgula.com', 'www.gib.gov.tr', 'www.devlet-vergi.xyz'],
      ok: 1,
      wrong: '.com ve .xyz adreslerini herkes satın alabilir. Devlet sitesinin adresi neyle biter?',
      why: 'Doğru. .gov.tr uzantısını yalnızca devlet kurumları alabilir; dolandırıcı alamaz.',
    }),
    {
      title: 'Bir harf eksik olursa',
      html: '<p>Adres çubuğuna bu sefer bilerek yanlış yazın: <b>turkye.gov.tr</b> (i harfi eksik) ve Enter.</p>',
      target: 'turkye.gov.tr',
      on: (ev) => ev.type === 'web-nav' && ev.error,
      done: '“Bu siteye ulaşılamıyor”: tek harf eksik olunca tarayıcı bambaşka bir adres arar. <b>Daha kötüsü:</b> dolandırıcılar yanlış yazılan adresleri satın alıp sahte site koyar. Adresi harf harf yazın.',
    },
    {
      title: 'Arama sonucunda reklam',
      html: `<p>Adres çubuğuna <b>e-devlet</b> yazıp Enter (bu bir arama olur). Sonuçlardan <b>gerçek e-Devlet</b>\'e tıklayın.</p><p class="mut">İpucu: üstte “Reklam” yazan sonucun adresine dikkat edin.</p>`,
      target: 'e-devlet',
      on: (ev, c) => {
        if (ev.type === 'web-ad') { c.warn('Bu bir <b>reklamdı</b>! Adresi turkiye-gov-giris.com, yani .gov.tr değil. Dolandırıcılar arama motorlarında reklam satın alabilir. Geri dönüp gerçek sonucu seçin.'); return false; }
        return ev.type === 'web-nav' && ev.host === 'www.turkiye.gov.tr' && ev.via === 'link';
      },
      done: 'Doğru sonucu seçtiniz. Arama sonuçlarının en üstündeki “Reklam” etiketli bağlantılar parayla oraya konur; en güvenilir sonuç olmayabilir. Bankanızı, e-Devlet\'i sık kullanılanlara (☆) eklemek daha güvenlidir.',
    },
    {
      title: 'Kilidi olan sahte site',
      html: `<p>Diyelim ki telefonunuza “e-Devlet hesabınızın süresi doldu” diye bir mesaj geldi ve bağlantıya tıkladınız. Yandaki sayfa e-Devlet\'e benziyor ve <b>kilidi bile var</b>.</p>
        <p><b>🔒 kilide</b> tıklayın ve <b>“Bu site”</b> satırını okuyun.</p>`,
      mouse: '🖱 🔒 kilit → Bu site',
      setup: (c) => goTo(c, 'www.turkiye-gov-giris.com'),
      on: (ev) => ev.type === 'web-siteinfo' && ev.site === 'turkiye-gov-giris.com',
      done: 'Bu site <b>turkiye-gov-giris.com</b>; gerçeği turkiye.gov.tr. Kilit yalnızca “bağlantı şifreli” demektir: sahte site de kilit alabilir.',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Bu sayfaya bilgilerinizi girer misiniz?</p>',
      opts: ['Evet, kilit var, demek ki güvenli', 'Hayır: alan adı .gov.tr değil; üstelik kart numarası istiyor ve acele ettiriyor'],
      ok: 1,
      wrong: 'Kilit, sitenin kime ait olduğunu söylemez. Adrese bakın.',
      why: 'Doğru. e-Devlet asla kart numarası istemez. Şüphelendiğinizde bağlantıya tıklamayın; adresi kendiniz yazın.',
    }),
    {
      title: 'Alt alan adı tuzağı',
      html: `<p>Bir başka mesajdaki bağlantı şu adresi açtı. Adresin <b>başında</b> bankanın adı var:</p><div class="target">bankam.com.tr.hesap-dogrulama.xyz</div>
        <p>🔒 kilide tıklayıp <b>“Bu site”</b> satırına bakın. Kırmızı boyalı parça neyi anlatıyor?</p>`,
      mouse: '🖱 🔒 kilit',
      setup: (c) => goTo(c, 'bankam.com.tr.hesap-dogrulama.xyz'),
      on: (ev) => ev.type === 'web-siteinfo' && ev.site === 'hesap-dogrulama.xyz',
      done: 'Alan adı <b>sağdan</b> okunur: ilk “/” işaretine kadar gidin, oradan geriye doğru son iki parça (Türkiye uzantılarında üç parça) sitenin sahibidir. Önüne eklenen “bankam.com.tr.” kısmını site sahibi istediği gibi yazabilir.',
    },
    rehberSoru({
      title: 'Kimin sitesi?',
      html: '<p><b>www.turkiye.gov.tr.belge-indir.net/giris</b> adresi kimin sitesidir?</p>',
      opts: ['turkiye.gov.tr (devletin)', 'belge-indir.net', 'giris'],
      ok: 1,
      wrong: 'İlk “/” işaretine kadar gidin ve oradan sola doğru okuyun.',
      why: 'Doğru: belge-indir.net. Başındaki “turkiye.gov.tr” süsten ibaret.',
    }),
    {
      title: '“Güvenli değil” yazan site',
      html: '<p>Adres çubuğuna <b>www.eski-forum.com</b> yazıp gidin. Adres çubuğunun solunda ne yazıyor? Kilide (uyarıya) tıklayıp okuyun.</p>',
      target: 'www.eski-forum.com',
      on: (ev) => ev.type === 'web-siteinfo' && ev.site === 'eski-forum.com' && !ev.secure,
      done: 'Bu site <b>http</b> kullanıyor (s harfi yok): bilgiler yolda şifrelenmeden gider. Okumak sorun değil; ama <b>“Güvenli değil”</b> yazan yere şifre ve kart bilgisi girilmez.',
    },
    {
      title: 'Adres çubuğu önerileri',
      html: '<p>Adres çubuğuna yalnızca <b>lezz</b> yazın. Altta açılan önerilerden <b>www.lezzetli-tarifler.com.tr</b>\'ye tıklayın (ya da ↓ okla seçip Enter).</p>',
      mouse: '🖱 Öneriye tıklayın',
      hint: '🕘 saat simgeli öneriler geçmişten, ⭐ olanlar sık kullanılanlardan, 🔍 olan arama yapar.',
      on: (ev) => ev.type === 'web-nav' && ev.via === 'suggest' && ev.host === 'www.lezzetli-tarifler.com.tr',
      done: 'Uzun adresi baştan sona yazmadan açtınız. Önerilere de dikkat: yanlış bir öneriye tıklamak yanlış siteye götürür.',
    },
    {
      title: 'Bildirim izni',
      html: '<p>Adres çubuğuna <b>www.firsat-pazari.com.tr</b> yazıp gidin. Site size bir şey soracak. Ne yapmalısınız?</p>',
      target: 'www.firsat-pazari.com.tr',
      on: (ev, c) => {
        if (ev.type !== 'web-perm' || ev.perm !== 'notify') return false;
        if (ev.value === 'allow') { c.warn('İzin verdiniz: site artık size istediği zaman reklam bildirimi gönderebilir. Düzeltin: 🔒 kilit → <b>Bildirimler: Engelle</b>.'); return false; }
        return ev.value === 'block';
      },
      done: 'Engellendi. Siteler bildirim, konum, kamera ve mikrofon için izin ister. Gerçekten gerekmedikçe <b>Engelle</b>. Fikrinizi değiştirirseniz 🔒 kilit → izinlerden düzeltebilirsiniz.',
    },
    {
      title: 'Adresi kopyalayın',
      html: `<p>Bir sayfayı birine göndermek için adresi kopyalarız: <b>adres çubuğuna bir kez tıklayın</b> (bütün adres mavi seçilir), sonra ${K('Ctrl', 'C')}.</p>`,
      combo: ['Ctrl', 'KeyC'],
      on: (ev) => ev.type === 'web-url-copy',
      done: 'Adres panoya kopyalandı. E-postaya ya da mesaja Ctrl + V ile yapıştırabilirsiniz. Size gelen bağlantılara tıklamadan önce de aynı şeyi yapın: adresini okuyun.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Artık adresleri okuyabiliyorsunuz:</p>' },
  ],
};
