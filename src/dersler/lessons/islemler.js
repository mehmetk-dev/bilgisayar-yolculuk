// 14. hafta: internette işlemler. e-Devlet'ten barkodlu belge, hastane randevusu (form doldurma), internetten
// alışveriş (sepet, adres, kartla ödeme, SMS doğrulama kodu), görüntülü görüşme. Ayrıca telefondan bilgisayara fotoğraf.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { KURS_TC, KURS_SIFRE, TEST_KART } from '../apps/siteler-gunluk.js';
import { deliverMail } from '../apps/mail.js';
import { PHONE } from '../vfs.js';

const br = (c, url) => { const w = maxed(c, 'browser'); if (url) w.api.go(url, 'link'); return w; };
const nav = (host, path) => (ev) => ev.type === 'web-nav' && ev.host === host && (!path || ev.path === path);
const KART = `<div class="kurs-kart">🪪 Kurs için verilen bilgiler<br>T.C. Kimlik No: <b>${KURS_TC}</b><br>e-Devlet şifresi: <b>${KURS_SIFRE}</b></div>`;

export const edevlet = {
  id: 'edevlet', icon: '🇹🇷', title: 'e-Devlet\'ten belge almak', minutes: 40, stage: 'desktop',
  desc: 'e-Devlet\'e giriş, ikametgâh belgesi almak, PDF indirmek, barkodla doğrulamak.',
  summary: [
    ['turkiye.gov.tr', 'e-Devlet\'in tek gerçek adresi (.gov.tr)'],
    ['Giriş yap → e-Devlet şifresi', 'T.C. Kimlik No ve şifre; şifre PTT\'den alınır'],
    ['Hizmet ara', 'Kelimeyle arayın: ikametgâh, SGK, sabıka…'],
    ['Belge Oluştur → İndir', 'Belge PDF olarak İndirilenler klasörüne iner'],
    ['PDF → 🖨 Yazdır', 'Belgeyi kâğıda basar'],
    ['Barkodlu Belge Doğrulama', 'Size verilen belgenin gerçek olup olmadığını kontrol eder'],
    ['⏻ Çıkış', 'Ortak bilgisayarda işiniz bitince mutlaka'],
  ],
  steps: [
    {
      title: 'e-Devlet nedir?',
      html: `<p><b>e-Devlet</b>, devlet dairesine gitmeden belge almanızı, başvuru yapmanızı sağlar: ikametgâh, SGK hizmet dökümü, sabıka kaydı, reçeteler, randevular…</p>
        <p>Bu derste banka için <b>yerleşim yeri (ikametgâh) belgesi</b> alacağız. Gerçek bilgileriniz kullanılmaz; aşağıdaki kurs bilgileri yeterli:</p>${KART}`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'Adresi yazın',
      html: '<p>Adres çubuğuna <b>turkiye.gov.tr</b> yazıp Enter. (Arama motorundaki reklamlara değil, adresi kendiniz yazmak en güvenlisi.)</p>',
      target: 'turkiye.gov.tr',
      on: nav('www.turkiye.gov.tr'),
      done: 'Adres <b>turkiye.gov.tr</b>, kilit var. Doğru yerdesiniz.',
    },
    {
      title: 'Hizmeti arayın',
      html: '<p>Sayfadaki <b>Hizmet ara</b> kutusuna <b>ikametgâh</b> yazıp <b>🔍 Ara</b>\'ya basın. Çıkan listeden <b>Yerleşim Yeri (İkametgâh) ve Diğer Adres Belgesi Sorgulama</b>\'ya tıklayın.</p>',
      target: 'ikametgâh',
      hint: '“â” yerine “a” yazsanız da bulur.',
      on: nav('www.turkiye.gov.tr', '/hizmet/yerlesim'),
      done: 'Hizmet sayfası açıldı ama bir uyarı var: önce <b>giriş yapmak</b> gerekiyor.',
    },
    {
      title: 'Giriş yapın',
      html: `<p><b>Giriş Yap</b>'a tıklayın. Kimlik numarasını ve şifreyi yazıp <b>Giriş Yap</b>'a basın.</p>${KART}
        <p class="mut">Şifre yazarken nokta (•) görünür; başkası görmesin diye. Büyük-küçük harf farklıdır: <b>K</b>urs2026.</p>`,
      hint: 'Kimlik numarasının 11 hane olduğunu kontrol edin.',
      on: (ev, c) => {
        if (ev.type === 'edevlet-login' && !ev.ok) { c.note('Giriş olmadı: kırmızı yazıyı okuyun. Şifrenin ilk harfi büyük K.'); return false; }
        return ev.type === 'edevlet-login' && ev.ok;
      },
      done: 'Giriş yaptınız; sağ üstte adınız görünüyor. Artık giriş isteyen hizmetleri kullanabilirsiniz.',
    },
    {
      title: 'Belgeyi oluşturun',
      html: '<p>“Belge kimin için?” → <b>Kendim</b>. “Belge nereye verilecek?” kutusundan <b>Bankaya verilecek</b>\'yi seçin ve <b>Belge Oluştur</b>\'a basın.</p><p class="mut">Hizmet sayfasında değilseniz: <b>Hizmet ara</b> kutusuna ikametgâh yazıp hizmeti yeniden açın.</p>',
      mouse: '🖱 Bankaya verilecek → Belge Oluştur',
      on: (ev, c) => {
        if (ev.type === 'edevlet-form-error') c.note('Önce “Belge nereye verilecek?” kutusundan bir seçim yapın.');
        return ev.type === 'edevlet-doc';
      },
      done: 'Belgeniz hazır. Altında bir <b>barkod numarası</b> var: belgeyi alan kurum bu numarayla belgenin gerçek olduğunu kontrol eder.',
    },
    {
      title: 'PDF olarak indirin',
      html: '<p><b>📄 Belgeyi indir (PDF)</b>\'ye tıklayın. Sağ üstte açılan İndirilenler kutusunda <b>Dosyayı aç</b>\'a basın.</p>',
      mouse: '🖱 Belgeyi indir → Dosyayı aç',
      on: (ev) => ev.type === 'app-open' && ev.app === 'pdf',
      done: 'Belge <b>PDF Okuyucu</b>\'da açıldı. PDF, her bilgisayarda aynı görünen ve değiştirilemeyen belgedir. Dosya <b>İndirilenler</b> klasöründe de duruyor.',
    },
    {
      title: 'Yazdırın',
      html: `<p>PDF Okuyucu'nun üstündeki <b>🖨 Yazdır</b>'a basın (ya da ${K('Ctrl', 'P')}) ve yazdırın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'pdf-print',
      done: 'Yazdır\'a bastınız. Gerçek bir yazıcıda belge kâğıda çıkar; yazıcı yerine “PDF olarak kaydet” seçiliyse belge dosya olarak kaydedilir. Bankaya kâğıdı ya da e-postayla PDF\'i verebilirsiniz.',
    },
    {
      title: 'Barkodla doğrulayın',
      html: `<p>Size biri bir belge verdiğinde gerçek mi diye bakabilirsiniz. PDF'i kapatın; e-Devlet ana sayfasında <b>🔎 Barkodlu Belge Doğrulama</b>'ya tıklayın, belgedeki barkod numarasını yazıp <b>Doğrula</b>'ya basın.</p>`,
      hint: 'Bu alıştırmada barkod numarası “NVI-” ile başlar; e-Devlet\'teki belge sayfasında ve PDF\'in altında yazıyor. Gerçek belgelerde barkodun biçimi farklı olabilir: belgede ne yazıyorsa onu yazın.',
      on: (ev, c) => {
        if (ev.type === 'edevlet-verify' && !ev.ok) { c.note('Bu numarayla belge bulunamadı. Barkodu harf harf karşılaştırın.'); return false; }
        return ev.type === 'edevlet-verify' && ev.ok;
      },
      done: '“Bu belge gerçektir.” Sahte belgede bu doğrulama çıkmaz.',
    },
    {
      title: 'Güvenli çıkış',
      html: '<p>İşiniz bitti. Sağ üstteki <b>⏻ Çıkış</b>\'a basın.</p>',
      mouse: '🖱 ⏻ Çıkış',
      on: (ev) => ev.type === 'edevlet-logout',
      done: 'Çıkış yaptınız. Ortak bilgisayarlarda (kütüphane, iş yeri) çıkış yapmazsanız sonraki kişi hesabınızı görebilir.',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Telefonla arayan biri “e-Devlet şifrenizin süresi doldu, yenilemek için şifrenizi söyleyin” diyor. Ne yaparsınız?</p>',
      opts: ['Şifremi söylerim', 'Telefonu kapatırım; şifremi kimseye söylemem', 'Yalnızca kimlik numaramı söylerim'],
      ok: 1,
      wrong: 'Devlet kurumları telefonla şifre istemez.',
      why: 'Doğru. e-Devlet şifresini yalnızca siz bilirsiniz; unutursanız PTT\'den yenisini alırsınız.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>e-Devlet\'ten belge almayı öğrendiniz:</p>' },
  ],
};

export const randevu = {
  id: 'randevu', icon: '🏥', title: 'Hastane randevusu: form doldurmak', minutes: 30, stage: 'desktop',
  desc: 'MHRS\'den hastane randevusu almak, hataları okumak, randevuyu iptal etmek.',
  summary: [
    ['* (yıldız)', 'Doldurulması zorunlu alan'],
    ['Kırmızı yazı', 'O alanda hata var: okuyun, düzeltin, yeniden gönderin'],
    ['Açılır liste ⌄', 'Tıklayın, listeden seçin'],
    ['Seçenek düğmeleri', 'Birini seçersiniz (gün, saat)'],
    ['☐ Onay kutusu', 'Tıklayınca ✔ olur'],
    ['Tab', 'Bir sonraki kutuya geçer'],
    ['⬇ Randevu belgesini indir (PDF)', 'Randevu kodu ve saati elinizde olsun'],
    ['Randevularım → İptal et', 'Gidemeyeceğiniz randevuyu iptal edin'],
    ['Gerçek MHRS', 'Önce giriş: T.C. Kimlik No ve e-Devlet ya da MHRS şifresi'],
  ],
  steps: [
    {
      title: 'İnternette form',
      html: `<p>Randevu, başvuru, sipariş… İnternetteki işlerin çoğu bir <b>form</b> doldurmaktır: kutulara yazı yazılır, listelerden seçilir, kutucuklar işaretlenir.</p>
        <p>Bu derste <b>MHRS</b>'den (Merkezi Hekim Randevu Sistemi) göz doktoruna randevu alacağız. Telefonla <b>182</b>'yi aramak da olur.</p>
        <p class="mut">Gerçek MHRS'de randevu almadan önce <b>giriş yapılır</b>: T.C. Kimlik Numaranız ve e-Devlet (ya da MHRS) şifrenizle. Bu alıştırmada giriş adımı yok; doğrudan randevu formuna geçeceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'Siteyi bulun',
      html: '<p>Adres çubuğuna <b>hastane randevusu</b> yazıp aratın. Sonuçlardan <b>MHRS</b>\'ye tıklayın, sonra <b>📅 Randevu al</b>\'a basın.</p>',
      target: 'hastane randevusu',
      on: nav('www.mhrs.gov.tr', '/randevu'),
      done: 'Adres <b>mhrs.gov.tr</b>: .gov.tr, yani devletin sitesi. Formun üstünde “* işaretli alanlar zorunludur” yazıyor.',
    },
    {
      title: 'Boş göndermeyi deneyin',
      html: '<p>Hiçbir şey yazmadan en alttaki <b>Randevuyu onayla</b>\'ya basın. Ne oluyor?</p><p class="mut">Düğme formun en altındadır; görünmüyorsa sayfayı aşağı kaydırın.</p>',
      mouse: '🖱 Randevuyu onayla',
      on: (ev) => ev.type === 'form-submit' && ev.site === 'mhrs' && ev.errors.length > 0,
      done: 'Form gönderilmedi; eksik alanların altında <b>kırmızı yazılar</b> çıktı. Bir form gönderilmeyince hep böyle kırmızı yazılara bakın: ne eksik olduğunu söylerler.',
    },
    {
      title: 'Formu doldurun',
      html: `<ol class="steps"><li><b>T.C. Kimlik No</b>: ${KURS_TC}</li><li><b>Cep telefonu</b>: 0555 123 45 67</li><li><b>Klinik</b>: Göz Hastalıkları · <b>Hastane</b>: bulunduğunuz şehre en yakın olan</li>
        <li>Bir <b>gün</b> ve boş bir <b>saat</b> seçin (gri olanlar dolu).</li><li><b>Aydınlatma metnini okudum</b> kutusunu işaretleyin.</li><li>Aşağı kaydırıp <b>Randevuyu onayla</b>'ya basın.</li></ol>`,
      hint: `Bir kutudan sonrakine ${'Tab'} tuşuyla geçebilirsiniz. Kırmızı yazı kalırsa o alana tekrar bakın.`,
      on: (ev, c) => {
        if (ev.type === 'form-submit' && ev.errors.length) c.note(`Hâlâ ${ev.errors.length} alanda sorun var. Kırmızı yazıları okuyun.`);
        if (ev.type === 'appointment' && !/Göz/.test(ev.klinik)) { c.note('Randevu alındı ama klinik Göz Hastalıkları değil. Yine de devam edebilirsiniz.'); }
        return ev.type === 'appointment';
      },
      done: 'Randevunuz alındı! Randevu kodunu bir yere not edin. Sağ altta SMS de geldi.',
    },
    {
      title: 'Randevu belgesini indirin',
      html: '<p>Onay sayfasının altındaki <b>⬇ Randevu belgesini indir (PDF)</b> düğmesine basın. Randevu kodunuz ve saatiniz bu belgede yazar; telefonunuzda ya da kâğıtta yanınızda olsun.</p>',
      mouse: '🖱 ⬇ Randevu belgesini indir (PDF)',
      hint: 'Düğme onay sayfasının en altında. Görünmüyorsa aşağı kaydırın.',
      on: (ev) => ev.type === 'mhrs-pdf',
      done: 'Randevu belgesi İndirilenler klasörüne kaydedildi. Hastaneye giderken kimliğinizi de unutmayın.',
    },
    rehberSoru({
      title: 'Okuyun',
      html: '<p>Onay sayfasına göre randevu saatinden ne kadar önce hastanede olmalısınız?</p>',
      opts: ['1 saat', '15 dakika', 'Tam saatinde'],
      ok: 1,
      wrong: 'Onay sayfasındaki sarı kutuyu okuyun.',
      why: 'Doğru: 15 dakika önce.',
    }),
    {
      title: 'Randevuyu iptal edin',
      html: '<p>Diyelim ki o gün gidemeyeceksiniz. Üstteki <b>Randevularım</b>\'a tıklayın, randevunun yanındaki <b>İptal et</b>\'e basın ve onaylayın.</p>',
      mouse: '🖱 Randevularım → İptal et → Evet',
      on: (ev) => ev.type === 'appointment-cancel',
      done: 'Randevu iptal edildi. Gitmediğiniz randevuyu iptal etmek, o saati başka bir hastanın kullanmasını sağlar. Gidemeyecekseniz mutlaka iptal edin: gitmediğiniz randevular kayda geçer ve üst üste olursa bir süre yeni randevu alamayabilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternette form doldurmak:</p>' },
  ],
};

export const alisveris = {
  id: 'alisveris', icon: '🛒', title: 'İnternetten güvenli alışveriş', minutes: 40, stage: 'desktop',
  desc: 'Sepete eklemek, kargo, kapıda ödeme, 3D Secure SMS kodu, sipariş takibi.',
  summary: [
    ['Sepete ekle → Sepetim', 'Almak istediklerinizi toplar; − / + ile adet'],
    ['Kargo', 'Çoğu site belli tutarın üstünde kargoyu bedava yapar'],
    ['Kapıda ödeme', 'Ürün gelince ödersiniz; biraz ek ücreti olur'],
    ['Kart ile ödeme', 'Yalnızca 🔒 ve adresini bildiğiniz sitelerde'],
    ['Kartımı kaydet', 'İstemiyorsanız işareti kaldırın'],
    ['3D Secure SMS kodu', 'Ödemeyi onaylar. Kimseye söylenmez'],
    ['Siparişlerim', 'Kargonun nerede olduğu'],
  ],
  steps: [
    {
      title: 'İnternetten alışveriş',
      html: `<p>İnternetten alışveriş evden çıkmadan yapılır ama dikkat ister: <b>doğru site</b>, <b>doğru tutar</b> ve <b>kart güvenliği</b>.</p>
        <p>Bu derste <b>Fırsat Pazarı</b>'ndan alışveriş yapacağız. Gerçek para harcanmaz; kart bilgisi de deneme kartıdır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.alisverisYol = null; br(c, 'www.firsat-pazari.com.tr'); },
    },
    {
      title: 'Bildirim sorusu',
      html: '<p>Site açılınca “Bildirim göster” izni istiyor. Reklam bildirimleri almamak için <b>Engelle</b>\'ye basın.</p>',
      mouse: '🖱 Engelle',
      check: (c) => c.d.sitePerms?.['firsat-pazari.com.tr']?.notify === 'block',
      on: (ev, c) => {
        if (ev.type === 'web-perm' && ev.value === 'allow') { c.warn('İzin verdiniz. Düzeltmek için: 🔒 kilit → Bildirimler → Engelle.'); return false; }
        return ev.type === 'web-perm' && ev.perm === 'notify' && ev.value === 'block';
      },
      done: 'Engellendi; site size bildirim gönderemez.',
    },
    {
      title: 'Sepete ekleyin',
      html: '<p><b>Döküm tava</b> ve <b>LED ampul</b>\'ün altındaki <b>Sepete ekle</b>\'ye basın. Sonra sağ üstteki <b>🛒 Sepetim</b>\'e tıklayın.</p>',
      mouse: '🖱 Sepete ekle (iki ürün) → Sepetim',
      hint: 'İki ürün de sepette olmalı: Döküm tava ve LED ampul. Ürünler sayfasına dönüp eksik olanı ekleyin, sonra yeniden Sepetim\'e tıklayın.',
      on: (ev, c) => {
        if (!nav('www.firsat-pazari.com.tr', '/sepet')(ev)) return false;
        const n = (c.d.webState?.['firsat-pazari.com.tr']?.cart || []).length;
        if (n < 2) { c.note(`Sepette şimdilik ${n} ürün var. Ürünler sayfasına dönüp eksik olanı da ekleyin, sonra yeniden Sepetim\'e tıklayın.`); return false; }
        return true;
      },
      done: 'Sepetinizde iki ürün var. Sepetteki sarı yazıya bakın: kargonun bedava olması için ne kadar daha alışveriş gerektiğini söyler.',
    },
    {
      title: 'Adedi değiştirin',
      html: '<p>Ampulden <b>2 paket</b> olsun: ampulün yanındaki <b>+</b>\'ya basın. Toplamın ve kargonun nasıl değiştiğine bakın.</p>',
      mouse: '🖱 +',
      on: (ev) => ev.type === 'shop-cart' && ev.op === 'inc',
      done: 'Toplam değişti. Sepetteki sarı yazıya ve <b>Kargo</b> satırına bakın: belli bir tutarı geçince kargo <b>bedava</b> olur. Ödemeden önce her zaman sepetteki adetlere ve toplama bakın.',
    },
    {
      title: 'Teslimat adresi',
      html: '<p><b>Alışverişi tamamla</b>\'ya basın. Adınızı soyadınızı, telefonunuzu (05… ile), ilinizi ve açık adresinizi yazıp <b>Kaydet ve devam et</b>\'e basın.</p>',
      hint: 'Kırmızı yazı çıkarsa o alanı düzeltin: ad ve soyad birlikte, telefon 11 haneli olmalı.',
      on: nav('www.firsat-pazari.com.tr', '/odeme'),
      done: 'Ödeme sayfasındasınız. Adres çubuğuna bakın: <b>firsat-pazari.com.tr</b> ve 🔒. Kart bilgisi yalnızca böyle bir sayfaya girilir.',
    },
    {
      title: 'Kartla ödeyin',
      html: `<p><b>Kart ile öde</b> seçili kalsın ve deneme kartını yazın:</p><div class="kurs-kart">💳 Kart no: <b>${TEST_KART}</b><br>Ad: <b>adınız</b> · Son kullanma: <b>12/28</b> · CVV: <b>123</b></div>
        <ol class="steps"><li><b>Kartımı kaydet</b> kutusundaki işareti <b>kaldırın</b> (sık alışveriş yapmadığınız sitelerde kart saklatmayın).</li><li><b>Mesafeli satış sözleşmesini</b> onaylayın.</li><li><b>Siparişi onayla</b>.</li></ol>`,
      hint: '<b>Kart ile öde</b> seçili kalsın (kapıda ödemede SMS kodu çıkmaz). Kırmızı yazı çıkarsa o alanı düzeltin.',
      on: (ev, c) => {
        if (ev.type === 'form-submit' && ev.site === 'shop-pay' && !ev.errors.length && ev.save) c.note('“Kartımı kaydet” işaretli kaldı. Sorun değil ama genelde kaldırmak daha güvenli.');
        // Kapıda ödeme seçilirse sipariş hemen verilir, SMS adımı gelmez: sonraki adım kendiliğinden geçilir
        if (ev.type === 'shop-order' && ev.yontem === 'kapida') { c.s.yol = c.d.alisverisYol = 'kapida'; return true; }
        if (ev.type === 'shop-3d') { c.s.yol = c.d.alisverisYol = 'kart'; return true; }
        return false;
      },
      done: (c) => (c.s.yol === 'kapida'
        ? 'Kapıda ödemeyi seçtiniz: sipariş verildi ve banka SMS kodu istemedi; parayı paketi getirene ödersiniz (biraz ek ücreti olur). Kartla ödemede ise SMS kodu girilir; sıradaki adım bunu anlatıyor.'
        : 'Bankanızın <b>3D Secure</b> sayfası açıldı ve telefonunuza (sağ altta) bir SMS geldi.'),
    },
    {
      title: 'SMS kodunu girin',
      html: (c) => (c.d.alisverisYol === 'kapida'
        ? '<p>Siz kapıda ödemeyi seçtiğiniz için banka SMS kodu göndermedi. Kartla ödemede sağ altta <b>SMS · BANKAM</b> mesajı gelir; içindeki 6 haneli kod sayfaya yazılır.</p>'
        : '<p>Sağ alttaki <b>SMS · BANKAM</b> mesajındaki 6 haneli kodu okuyun. Mesajda <b>tutarın</b> ve <b>mağazanın adının</b> doğru olduğunu kontrol edin, sonra kodu yazıp <b>Onayla</b>\'ya basın.</p>'),
      hint: 'SMS kaybolduysa sayfadaki <b>Kodu yeniden gönder</b>\'e basın. Kod 6 rakamdır; mesajdaki rakamları tek tek karşılaştırın.',
      check: (c) => c.d.alisverisYol === 'kapida',
      on: (ev, c) => {
        if (ev.type === 'shop-3d-wrong') c.note('Kod yanlış. SMS\'teki rakamları tek tek karşılaştırın.');
        if (ev.type === 'shop-3d-cancel') c.note('Vazgeçtiniz. Ödeme sayfasında deneme kartını yeniden yazıp <b>Siparişi onayla</b>\'ya basın; yeni bir SMS gelir.');
        if (ev.type === 'shop-3d') c.note('Yeni bir SMS kodu geldi. En son gelen kodu yazın.');
        return ev.type === 'shop-order';
      },
      done: (c) => (c.d.alisverisYol === 'kapida'
        ? 'Kapıda ödemede banka SMS kodu istemez; ödemeyi kapıda yaparsınız. Kartla ödemede ise bu kod şarttır ve kimseye söylenmez.'
        : 'Siparişiniz alındı! SMS kodu, ödemeyi <b>sizin</b> yaptığınızı bankaya kanıtlar.'),
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Bir gün telefonla arayan biri “Bankadan arıyoruz, siparişinizi iptal etmek için telefonunuza gelen kodu söyleyin” diyor. Ne yaparsınız?</p>',
      opts: ['Kodu söylerim, banka arıyor', 'Kodu kimseye söylemem; telefonu kapatıp bankamın numarasını kendim ararım', 'Kodun yarısını söylerim'],
      ok: 1,
      wrong: 'SMS\'teki “Bu kodu kimseyle paylaşmayın” yazısını hatırlayın.',
      why: 'Doğru. O kodu isteyen kişi, sizin kartınızla ödeme yapmaya çalışan dolandırıcıdır. Banka bu kodu asla sormaz.',
    }),
    {
      title: 'Siparişi takip edin',
      html: '<p>Üstteki <b>Siparişlerim</b>\'e tıklayın. Kargonuz hangi aşamada?</p>',
      mouse: '🖱 Siparişlerim',
      on: nav('www.firsat-pazari.com.tr', '/siparisler'),
      done: 'Yeşil çizgi siparişin nerede olduğunu gösterir: hazırlanıyor → kargoya verildi → dağıtımda → teslim edildi. Kargo takip numarasıyla kargo firmasının sitesinden de bakılabilir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Güvenli alışveriş:</p>' },
  ],
};

const permOk = (c) => { const p = c.d.sitePerms?.['bulalim.com']; return p?.camera === 'allow' && p?.mic === 'allow'; };
const DAVET = { key: 'gorusme', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Bu akşam görüntülü görüşelim mi? 📹', url: 'gorusme.bulalim.com/aile', urlText: 'Görüşmeye katılmak için tıklayın',
  body: 'Merhaba!\n\nBu akşam hep birlikte görüntülü görüşelim. Kardeşiniz Ahmet de gelecek. Aşağıdaki bağlantıya tıklamanız yeterli; hiçbir şey kurmanıza gerek yok.\n\nSevgiler,\nElif' };

export const gorusme = {
  id: 'gorusme', icon: '📹', title: 'Görüntülü görüşme', minutes: 30, stage: 'desktop',
  desc: 'Görüşmeye katılmak, kamera ve mikrofon, sessize alma, sohbete yazma.',
  summary: [
    ['Davet bağlantısı', 'Tıklayınca görüşme tarayıcıda açılır (adresine bakın!)'],
    ['Kamera ve mikrofon izni', 'Tanıdığınız görüşme sitesine “İzin ver”'],
    ['🎤 / 🔇', 'Sesinizi açar / kapatır (sessize alır)'],
    ['📷 / 🚫', 'Kameranızı açar / kapatır'],
    ['💬 Sohbet', 'Yazıyla mesaj'],
    ['✋ El kaldır', 'Söz istemek için'],
    ['📞 Ayrıl', 'Görüşmeden çıkar'],
  ],
  steps: [
    {
      title: 'Davet geldi',
      html: '<p>Torununuz Elif bir görüntülü görüşme daveti gönderdi. <b>✉ E-posta</b> programını açın ve <b>“Bu akşam görüntülü görüşelim mi?”</b> postasını okuyun.</p>',
      mouse: '🖱 Başlat → E-posta → posta',
      setup: (c) => { desktopReady(c); c.d.closeAll(); deliverMail(c.d, DAVET); },
      on: (ev) => ev.type === 'mail-open' && ev.key === 'gorusme',
      done: 'Postanın altında bir bağlantı ve onun <b>adresi</b> var: gorusme.bulalim.com. Bu davet tanıdık birinden geldi ve siz onu bekliyordunuz. Beklemediğiniz bir davet gelirse önce gönderene sorun.',
    },
    {
      title: 'Bağlantıya tıklayın',
      html: '<p>Postadaki <b>👉 Görüşmeye katılmak için tıklayın</b> bağlantısına tıklayın.</p>',
      mouse: '🖱 Bağlantı',
      on: nav('gorusme.bulalim.com'),
      done: 'Görüşme tarayıcıda açıldı ve tarayıcı bir şey soruyor.',
    },
    {
      title: 'Kamera ve mikrofon izni',
      html: '<p>Tarayıcı, sitenin <b>kameranızı</b> ve <b>mikrofonunuzu</b> kullanmasına izin isteyip istemediğinizi soruyor (adres çubuğunun altındaki kutu). Görüntülü görüşme için <b>İzin ver</b>\'e basın.</p>',
      mouse: '🖱 İzin ver',
      hint: 'Kutu kapandıysa ya da yanlışlıkla Engelle dediyseniz: adres çubuğundaki 🔒 kilide tıklayın, Kamera ve Mikrofon\'u “İzin ver” yapın.',
      // Soru "Devam"dan önce cevaplanmış ya da izinler kilit menüsünden tek tek verilmiş olabilir: olaya değil duruma bakılır
      check: permOk,
      on: (ev, c) => {
        if (ev.type === 'meet-perm' && ev.value === 'block') { c.warn('Engellediniz. Düzeltmek için: adres çubuğundaki 🔒 kilit → Kamera ve Mikrofon → “İzin ver” yapın, sonra sayfayı yenileyin (⟳).'); return false; }
        return (ev.type === 'meet-perm' || ev.type === 'web-perm') && permOk(c);
      },
      done: 'İzin verdiniz; kendi görüntünüzü görüyorsunuz. Bu izni yalnızca tanıdığınız görüşme sitelerine verin.',
    },
    {
      title: 'Katılın',
      html: '<p><b>Adınız</b> kutusuna adınızı yazın ve <b>Şimdi katıl</b>\'a basın.</p>',
      on: (ev) => ev.type === 'meet-join',
      done: 'Görüşmedesiniz! Elif konuşurken onun çerçevesi yeşil yanıyor.',
    },
    {
      title: 'Sesinizi açın',
      html: '<p>Görüşmede bazen mikrofon kapalı kalır, kimse sizi duyamaz. Elif sohbete bir şey yazacak. Mikrofonunuz kapalıysa alttaki <b>🔇 Sesi aç</b>\'a basın.</p>',
      setup: (c) => {
        // Mikrofonu kapalı başlat ki öğrenci açmayı öğrensin
        const st = c.d.webState?.['bulalim.com'];
        if (st && st.mic && !st.toldMute) { st.mic = false; c.d.find('browser')?.api.refresh?.(); }
      },
      on: (ev) => ev.type === 'meet-toggle' && ev.what === 'mic' && ev.on,
      done: '“Şimdi duyuyoruz!” Sesinizi kapatmak (sessize almak), çevrenizde gürültü varken işe yarar; konuşacağınız zaman açarsınız.',
    },
    {
      title: 'Kamerayı kapatıp açın',
      html: '<p><b>📷 Kamerayı kapat</b>\'a basın: görüntünüz yerine adınızın ilk harfi görünür. Sonra yeniden açın.</p>',
      mouse: '🖱 📷 → 🚫 → 📷',
      on: (ev, c) => { if (ev.type === 'meet-toggle' && ev.what === 'cam' && !ev.on) c.s.off = true; return c.s.off && ev.type === 'meet-toggle' && ev.what === 'cam' && ev.on; },
      done: 'Kameranızı kapatınca karşı taraf sizi görmez ama duyar.',
    },
    {
      title: 'Sohbete yazın',
      html: '<p>Sohbet kutusuna (açık değilse <b>💬 Sohbet</b>\'e basın) <b>Herkese selamlar!</b> yazıp Enter\'a basın.</p>',
      target: 'Herkese selamlar!',
      on: (ev) => ev.type === 'meet-chat',
      done: 'Mesajınız herkese gitti. Ses gelmediğinde ya da bağlantı kötüyken sohbet çok işe yarar.',
    },
    {
      title: 'El kaldırın',
      html: '<p>Kalabalık görüşmelerde herkes aynı anda konuşmasın diye söz istemek için <b>✋ El kaldır</b>\'a basın.</p>',
      mouse: '🖱 ✋ El kaldır',
      on: (ev) => ev.type === 'meet-hand' && ev.on,
      done: 'Elinizi kaldırdınız; ekranda “Elinizi kaldırdınız” yazıyor. Söz sırası size gelince elinizi indirirsiniz (aynı düğme).',
    },
    {
      title: 'Görüşmeden ayrılın',
      html: '<p>Görüşmeyi bitirmek için kırmızı <b>📞 Ayrıl</b> düğmesine basın.</p>',
      mouse: '🖱 📞 Ayrıl',
      hint: 'Düğmeler görüşme ekranının altında, ortada. Ayrıl en sağdaki kırmızı düğmedir.',
      on: (ev) => ev.type === 'meet-leave',
      done: 'Görüşmeden ayrıldınız. Pencereyi ya da sekmeyi kapatmak da görüşmeden çıkarır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Görüntülü görüşme:</p>' },
  ],
};

const inPhone = (c, id) => id && c.d.fs.get(id) && c.d.fs.isInside(id, PHONE);
export const telefon = {
  id: 'telefon', icon: '📱', title: 'Telefondan bilgisayara fotoğraf', minutes: 30, stage: 'desktop',
  desc: 'Telefonu kabloyla bağlayıp fotoğrafları bilgisayara kopyalamak.',
  summary: [
    ['Kabloyu takınca', 'Telefon önce yalnızca şarj olur'],
    ['Telefonda bildirim → Dosya aktarımı', 'Bilgisayar telefonun içini görür'],
    ['Telefonum › Dahili depolama › DCIM › Kamera', 'Telefonla çekilen fotoğraflar'],
    ['Fotoğrafı kopyalamak', 'Fotoğrafı seçip Ctrl+C ile kopyalayın, Resimler\'e gidip Ctrl+V ile yapıştırın'],
    ['Fotoğrafları içeri aktar', 'Hepsini tarihli bir klasöre kopyalar'],
  ],
  steps: [
    {
      title: 'Telefonu bağlayın',
      html: `<p>Telefonla çektiğiniz fotoğrafları bilgisayara almanın en kolay yolu <b>şarj kablosudur</b>.</p><p><button type="button" class="btn usb-btn">🔌 Telefonu kabloyla bağla</button></p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        document.querySelector('#stepBody .usb-btn').onclick = () => c.d.plugPhone();
      },
      on: (ev) => ev.type === 'phone' && ev.on,
      done: 'Telefon bağlandı: ekranda telefonun resmi göründü. Ama bilgisayarda hiçbir şey çıkmadı! Telefonun ekranına bakın: “Bu cihaz USB ile şarj ediliyor”.',
    },
    {
      title: 'Dosya aktarımı',
      html: '<p>Telefonlar güvenlik için önce yalnızca <b>şarj</b> olur. Telefonun ekranındaki bildirime dokunun ve <b>Dosya aktarımı</b>\'nı seçin.</p>',
      mouse: '🖱 Telefondaki bildirim → Dosya aktarımı',
      hint: 'iPhone\'larda bunun yerine “Bu bilgisayara güvenilsin mi?” sorusu çıkar: “Güven” denir.',
      check: (c) => c.d.fs.phone,
      on: (ev) => ev.type === 'phone-mode' && ev.mode !== 'charge',
      done: 'Bilgisayar telefonu tanıdı; sağ altta “Telefonum” bildirimi çıktı.',
    },
    {
      title: 'Telefonun içine bakın',
      html: '<p>Bildirimdeki <b>📂 Dosyaları görmek için cihazı aç</b>\'a tıklayın (kaçırdıysanız Dosya Gezgini\'nin solundaki <b>📱 Telefonum</b>). Sonra <b>Dahili depolama › DCIM › Kamera</b> klasörlerine çift tıklayarak girin.</p>',
      mouse: '🖱 Telefonum → Dahili depolama → DCIM → Kamera',
      hint: 'DCIM, “dijital kamera görüntüleri” demektir; bütün telefonlarda fotoğraflar buradadır.',
      on: (ev, c) => ev.type === 'nav' && c.d.fs.get(ev.folder)?.name === 'Kamera' && inPhone(c, ev.folder),
      done: 'Telefonla çekilen fotoğraflar burada. Adları IMG_ ile başlar ve tarihi içerir: IMG_20261001… 1 Ekim 2026 demektir.',
    },
    {
      title: 'Bir fotoğrafı kopyalayın',
      html: `<p>Listedeki <b>ilk fotoğrafa</b> (adı <b>IMG_20261001_0912</b>) bir kez tıklayıp ${K('Ctrl', 'C')} ile kopyalayın. Soldan <b>🖼 Resimler</b>'e geçip ${K('Ctrl', 'V')} ile yapıştırın.</p>`,
      hint: 'Resimler\'e geçince pencerede dosyaların olduğu boş bir yere tıklayın, sonra Ctrl + V\'ye basın.',
      on: (ev) => ev.type === 'file-paste' && ev.to === 'pictures' && /^IMG_/.test(ev.name),
      done: 'Fotoğraf bilgisayarın <b>Resimler</b> klasörüne kopyalandı. Telefondaki de yerinde duruyor (kopyaladık, taşımadık).',
    },
    {
      title: 'Hepsini birden aktarın',
      html: '<p>Dosya Gezgini\'nde yeniden telefonun içine girin. Üstte <b>🖼 Fotoğrafları içeri aktar</b> düğmesi var; ona basın.</p>',
      mouse: '🖱 Telefonum → 🖼 Fotoğrafları içeri aktar',
      on: (ev) => ev.type === 'phone-import',
      done: 'Bütün fotoğraflar <b>Resimler</b> içinde tarihli yeni bir klasöre kopyalandı. Bildirime tıklayarak klasörü açabilirsiniz.',
    },
    {
      title: 'Kabloyu çıkarın',
      html: '<p>Kopyalama bittikten sonra kabloyu çıkarabilirsiniz: telefonun altındaki <b>🔌 Kabloyu çıkar</b>\'a basın.</p>',
      on: (ev) => ev.type === 'phone' && !ev.on,
      done: 'Telefonlarda USB bellekteki gibi “güvenle kaldır” gerekmez; ama kopyalama sürerken kabloyu çıkarmayın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Telefondan fotoğraf almak:</p>' },
  ],
};
