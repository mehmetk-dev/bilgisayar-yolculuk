// 13. hafta ek dersi: çerezler. Çerez penceresi, sepetin hatırlanması, “beni takip eden reklam”, birinci ve üçüncü taraf çerez,
// çerez listesini görmek, üçüncü tarafı engellemek, silmek.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c) => maxed(c, 'browser');
const brUrl = (c) => c.d.find('browser')?.api.url || '';
const nav = (host, path) => (ev) => ev.type === 'web-nav' && ev.host === host && (!path || ev.path === path);
const third = (c) => (c.d.cookies || []).some((k) => k.party === 'third');

export const cerezler = {
  id: 'cerezler', icon: '🍪', title: 'Çerezler: sizi hatırlayan küçük notlar', minutes: 35, stage: 'desktop',
  desc: 'Çerez nedir, çerez penceresinde ne seçilir, çerezleri görmek ve silmek.',
  summary: [
    ['Çerez', 'Sitenin tarayıcınıza bıraktığı küçük not: giriş, sepet, tercihlerinizi hatırlar'],
    ['Birinci taraf çerez', 'Gezdiğiniz sitenin kendi çerezi: çoğu zaman yararlıdır'],
    ['Üçüncü taraf çerez', 'Sayfaya gömülü başka şirketin (reklam) çerezi: sizi siteden siteye izler'],
    ['Çerez penceresi', '“Yalnızca gerekli olanlar” en güvenlisi; “Tümünü kabul et” izlemeye de izin verir'],
    ['Listeyi görmek', '⋯ menü → Ayarlar → Çerezler ya da Geçmiş sayfasından'],
    ['Üçüncü tarafı engelle', 'Çerez ayarında bir düğme; reklam takibi azalır'],
    ['Çerezleri silmek', 'Siteler sizi unutur: girişler ve sepetler silinir'],
    ['Ortak bilgisayar', 'Çıkış yapın; gerekirse göz atma verilerini silin ya da gizli pencere kullanın'],
  ],
  steps: [
    {
      title: 'Çerez nedir?',
      html: `<p>İnternette bir siteye ikinci kez girdiğinizde bazen <b>sizi tanır</b>: “hoş geldiniz”, sepetinizdeki ürünler hâlâ oradadır. Bunu <b>çerez</b> sağlar.</p>
        <p>Mahalledeki bakkalı düşünün: gittiğinizde sizi tanır, “her zamankinden mi?” der. Çerez, sitenin tarayıcınıza bıraktığı küçük bir <b>not kâğıdıdır</b>. Virüs değildir; yalnızca yazıdır.</p>
        <p>Bu notların çoğu işinize yarar; bazıları ise sizi izleyip reklam göstermek içindir. Farkı birlikte göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Çerez penceresi',
      html: `<p><b>İnternet</b>\'i açıp <b>www.lezzetli-tarifler.com.tr</b> adresine gidin. Sayfanın üstünde bir <b>çerez penceresi</b> çıkacak. <b>Yalnızca gerekli olanlar</b>\'a tıklayın.</p>
        <p class="mut">Dikkat: siteler “Tümünü kabul et” düğmesini bilerek büyük ve renkli yapar. Düğmenin rengine değil, yazısına bakarak seçin.</p>`,
      setup: br,
      hint: 'Pencerede iki düğme var: Tümünü kabul et ve Yalnızca gerekli olanlar. İkincisini seçin.',
      on: (ev, c) => {
        if (ev.type !== 'cookie-choice') return false;
        c.s.choice = ev.choice;
        return true;
      },
      done: (c) => c.s.choice === 'need'
        ? 'Güvenli seçim: yalnızca sitenin çalışması için gerekli çerezler kaldı. “Tümünü kabul et” deseydiniz izleme çerezlerine de izin vermiş olurdunuz. Bu seçim yalnızca bu site için geçerlidir; başka sitelerde ayrıca karşınıza çıkar ya da hiç sorulmaz.'
        : '“Tümünü kabul et” dediniz: bu, reklam amaçlı izleme çerezlerine de izin verir. Sorun değil; birazdan listede görüp silmeyi öğreneceğiz. Sonraki sefer “Yalnızca gerekli olanlar”ı deneyin. Bu seçim yalnızca bu site için geçerlidir.',
    },
    {
      title: 'Sepete ürün koyun',
      html: '<p>Şimdi <b>www.firsat-pazari.com.tr</b> adresine gidin. <b>Döküm tava</b>\'nın altındaki <b>Sepete ekle</b>\'ye tıklayın.</p>',
      on: (ev) => ev.type === 'shop-add' && ev.id === 'tava',
      done: 'Ürün sepette. Sayfayı kapatıp yarın dönseniz bile sepetiniz durur: çünkü site tarayıcınıza bir <b>çerez</b> bıraktı. Bu sitede çerez penceresi çıkmadı; yani önceki sitede yaptığınız seçim buraya geçmez, her site kendi kuralıyla çalışır.',
    },
    {
      title: 'Başka bir sitede',
      html: '<p>Şimdi alışverişle ilgisi olmayan bir yere gidin: <b>www.gunun-haberleri.com.tr</b>. Sayfanın üstündeki <b>reklama</b> bakın: ne diyor?</p>',
      on: nav('www.gunun-haberleri.com.tr'),
      done: 'Haber sitesinde <b>“Size özel: Döküm tava bugün %20 indirimli”</b> yazıyor! Az önce baktığınız ürün, bambaşka bir sitede karşınıza çıktı. Neden?',
    },
    rehberSoru({
      title: 'Reklam neden çıktı?',
      html: '<p>Haber sitesi, alışveriş sitesinde ne baktığınızı <b>nereden</b> biliyor?</p>',
      opts: ['Bilgisayarınızı dinliyor', 'Tesadüf', 'Alışveriş sitesine gömülü bir reklam şirketi, tarayıcınıza “üçüncü taraf çerez” bıraktı ve haber sitesinde sizi tanıdı'], ok: 2,
      wrong: 'Bu tesadüf ya da dinleme değil. Notu kim bıraktı, kim okudu?',
      why: 'Doğru. Bir reklam şirketi birçok sitede reklam gösterir. Birinde bıraktığı çerezi diğerinde okuyunca “bu kişi tava bakıyordu” diye bilir. Buna <b>üçüncü taraf çerez</b> denir. Siz o şirketle hiç ilişki kurmadınız ama sizi tanır.',
    }),
    {
      title: 'Çerez listesini açın',
      html: '<p>Tarayıcının sağ üstündeki <b>⋯</b> menüsüne tıklayın, <b>Ayarlar</b>\'a gidin ve <b>🍪 Çerezler ve site verilerini gör</b> bağlantısına tıklayın (ya da üstteki <b>Çerezler</b> sekmesine).</p>',
      hint: 'Sayfanın sol tarafında Geçmiş, Uzantılar, Çerezler, Ayarlar sekmeleri var.',
      on: nav('tarayici', '/cerezler'),
      done: 'Tarayıcının sakladığı bütün çerezler listede: hangi sitenin, ne amaçla bıraktığı yazıyor.',
    },
    rehberSoru({
      title: 'Hangisi izliyor?',
      html: '<p>Listeye bakın: <b>“Üçüncü taraf”</b> etiketli çerezi hangi adres bırakmış?</p>',
      opts: ['reklam-takip.net', 'firsat-pazari.com.tr', 'lezzetli-tarifler.com.tr'], ok: 0,
      wrong: 'Üçüncü taraf, gezdiğiniz sitenin kendisi değil, başka bir şirkettir. Turuncu etiketi arayın.',
      why: 'Doğru: reklam-takip.net. Siz bu adrese hiç girmediniz, ama gezdiğiniz sitelere gömülü reklamlarla çerezini bıraktı. Birinci taraf çerezler (firsat-pazari, lezzetli-tarifler) kendi sitenizin hatırlama notlarıdır.',
    }),
    {
      title: 'Üçüncü tarafı engelleyin',
      html: '<p>Listenin üstündeki <b>Üçüncü taraf çerezlerini engelle</b> kutusunu işaretleyin. Mevcut reklam çerezi silinir, yenisi de bırakılamaz.</p>',
      check: (c) => !!c.d.settings.blockThird,
      on: (ev) => ev.type === 'cookie-block-third' && ev.on,
      done: 'Engellendi. Artık reklam şirketleri çerez bırakamaz; sizi siteden siteye izlemeleri çok zorlaşır. Siteler yine çalışır.',
    },
    {
      title: 'Haber sitesine dönün',
      html: '<p><b>www.gunun-haberleri.com.tr</b> sayfasına yeniden gidin (adres çubuğuna yazın). Reklam hâlâ tavayı gösteriyor mu?</p>',
      on: (ev, c) => (ev.type === 'web-nav' && ev.host === 'www.gunun-haberleri.com.tr') && !third(c),
      done: 'Reklam artık herkese aynı: <b>“Yeni sezon ürünleri”</b>. Sizi tanımadı, kişiye özel gösteremedi. Sizin için reklam azalmadı, ama <b>sizi izlemesi</b> bitti.',
    },
    {
      title: 'Sepet çerezini silin',
      html: '<p>Çerez listesine dönün (⋯ → Ayarlar → Çerezler). <b>firsat-pazari.com.tr · sepet</b> satırının yanındaki <b>✕ Sil</b>\'e tıklayın.</p>',
      hint: 'Liste boşsa alışveriş sitesine gidip sepete bir ürün ekleyin, sonra listeye dönün.',
      on: (ev) => ev.type === 'cookie-delete' && ev.name === 'sepet',
      done: 'Sepet çerezi silindi: site sizi artık hatırlamıyor, sepetiniz boşaldı. Giriş çerezini (oturum) silseydiniz oturumunuz kapanırdı.',
    },
    {
      title: 'Hepsini temizleyin',
      html: '<p>Sayfadaki <b>🗑 Tümünü sil</b> düğmesine (ya da <b>Göz atma verilerini temizle</b>\'ye) tıklayın. Ortak bilgisayarda işiniz bitince yapılacak iyi bir iştir.</p>',
      on: (ev) => ev.type === 'cookie-clear-all' || ev.type === 'web-clear',
      done: 'Çerezler silindi. Siteler sizi unuttu: her yerde yeniden giriş yapmanız gerekir, çerez pencereleri de yeniden çıkar. İşte bunun bedeli budur; ortak bilgisayarda değerlidir, kendi bilgisayarınızda gereksizdir.',
    },
    rehberSoru({
      title: 'Çerez virüs müdür?',
      html: '<p>Bir komşunuz: “Çerezler virüs, hepsini kapatmak lazım” diyor. Ne dersiniz?</p>',
      opts: ['Doğru, çerez virüstür', 'Çerezler bilgisayarı çok yavaşlatır', 'Hayır: çerez yalnızca bir yazı dosyasıdır; ama bazıları sizi izlemek için kullanılır'], ok: 2,
      wrong: 'Çerez çalışan bir program değildir. Ama amacı yararlı ya da gözetleyici olabilir.',
      why: 'Çerez bir program değil, küçük bir yazı notudur; bilgisayara zarar vermez. Sorun, bazılarının sizi izlemek için kullanılmasıdır. Bu yüzden “yalnızca gerekli olanlar” seçmek ve üçüncü tarafları engellemek iyi alışkanlıktır.',
    }),
    rehberSoru({
      title: 'Ortak bilgisayar',
      html: '<p>Kütüphanede ortak bir bilgisayarda e-postanıza girdiniz. Çıkarken en güvenli davranış hangisi?</p>',
      opts: ['Sekmeyi açık bırakmak', '“Çıkış yap”a basmak ve göz atma verilerini silmek (ya da en baştan gizli pencere kullanmak)', 'Bilgisayarı kapatmadan kalkmak'], ok: 1,
      wrong: 'Giriş çerezi hâlâ duruyorsa sonraki kişi oturumunuza girebilir.',
      why: 'Doğru. Giriş çerezi oturumu açık tutar; çıkış yapmak ve verileri silmek onu kaldırır. Gizli pencere ise kapanınca çerezleri kendiliğinden siler.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Çerezleri tanıyorsunuz:</p>' },
  ],
};
