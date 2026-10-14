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
  desc: 'e-Devlet\'e şifreyle giriş, hizmet arama, yerleşim yeri (ikametgâh) belgesi oluşturma, PDF olarak indirme, açma ve yazdırma, barkodla belge doğrulama, güvenli çıkış.',
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
      html: `<p><b>Giriş Yap</b>\\'a tıklayın. Kimlik numarasını ve şifreyi yazıp <b>Giriş Yap</b>\\'a basın.</p>${KART}
        <p class="mut">Şifre yazarken nokta (•) görünür; başkası görmesin diye. Büyük-küçük harf farklıdır: <b>K</b>urs2026.</p>`,
      hint: 'Kimlik numarasının 11 hane olduğunu kontrol edin.',
      on: (ev, c) => {
        if (ev.type === 'edevlet-login' && !ev.ok) { c.note('Giriş olmadı: kırmızı yazıyı okuyun. Şifrenin ilk harfi büyük K.'); return false; }
        return ev.type === 'edevlet-login' && ev.ok;
      },
      done: 'Giriş yaptınız; sağ üstte adınız görünüyor. e-Devlet sizi aradığınız hizmete geri getirdi.',
    },
    {
      title: 'Belgeyi oluşturun',
      html: '<p>“Belge kimin için?” → <b>Kendim</b>. “Belge nereye verilecek?” kutusundan <b>Bankaya verilecek</b>\'yi seçin ve <b>Belge Oluştur</b>\'a basın.</p>',
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
      html: `<p>PDF Okuyucu\\'nun üstündeki <b>🖨 Yazdır</b>\\'a basın (ya da ${K('Ctrl', 'P')}) ve yazdırın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'pdf-print',
      done: 'Belgeniz yazıcıya gitti. Bankaya kâğıdı ya da e-postayla PDF\'i verebilirsiniz.',
    },
    {
      title: 'Barkodla doğrulayın',
      html: `<p>Size biri bir belge verdiğinde gerçek mi diye bakabilirsiniz. PDF\\'i kapatın; e-Devlet ana sayfasında <b>🔎 Barkodlu Belge Doğrulama</b>\\'ya tıklayın, belgedeki barkod numarasını yazıp <b>Doğrula</b>\\'ya basın.</p>`,
      hint: 'Barkod numarası “NVI-” ile başlar; e-Devlet\'teki belge sayfasında ve PDF\'in altında yazıyor.',
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
  desc: 'MHRS\'den hastane randevusu almak: zorunlu alanlar (*), hata iletilerini okumak, açılır liste, seçenek düğmeleri, onay kutusu; randevuyu görmek ve iptal etmek.',
  summary: [
    ['* (yıldız)', 'Doldurulması zorunlu alan'],
    ['Kırmızı yazı', 'O alanda hata var: okuyun, düzeltin, yeniden gönderin'],
    ['Açılır liste ⌄', 'Tıklayın, listeden seçin'],
    ['Seçenek düğmeleri', 'Birini seçersiniz (gün, saat)'],
    ['☐ Onay kutusu', 'Tıklayınca ✔ olur'],
    ['Tab', 'Bir sonraki kutuya geçer'],
    ['Randevularım → İptal et', 'Gidemeyeceğiniz randevuyu bırakın'],
  ],
  steps: [
    {
      title: 'İnternette form',
      html: `<p>Randevu, başvuru, sipariş… İnternetteki işlerin çoğu bir <b>form</b> doldurmaktır: kutulara yazı yazılır, listelerden seçilir, kutucuklar işaretlenir.</p>
        <p>Bu derste <b>MHRS</b>\\'den (Merkezi Hekim Randevu Sistemi) göz doktoruna randevu alacağız. Telefonla <b>182</b>\\'yi aramak da olur.</p>`,
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
      html: '<p>Hiçbir şey yazmadan en alttaki <b>Randevuyu onayla</b>\'ya basın. Ne oluyor?</p>',
      mouse: '🖱 Randevuyu onayla',
      on: (ev) => ev.type === 'form-submit' && ev.site === 'mhrs' && ev.errors.length > 0,
      done: 'Form gönderilmedi; eksik alanların altında <b>kırmızı yazılar</b> çıktı. Bir form gönderilmeyince hep böyle kırmızı yazılara bakın: ne eksik olduğunu söylerler.',
    },
    {
      title: 'Formu doldurun',
      html: `<ol class="steps"><li><b>T.C. Kimlik No</b>: ${KURS_TC}</li><li><b>Cep telefonu</b>: 0555 123 45 67</li><li><b>Klinik</b>: Göz Hastalıkları · <b>Hastane</b>: bulunduğunuz şehre en yakın olan</li>
        <li>Bir <b>gün</b> ve boş bir <b>saat</b> seçin (gri olanlar dolu).</li><li><b>Aydınlatma metnini okudum</b> kutusunu işaretleyin.</li><li><b>Randevuyu onayla</b>.</li></ol>`,
      hint: `Bir kutudan sonrakine ${'Tab'} tuşuyla geçebilirsiniz. Kırmızı yazı kalırsa o alana tekrar bakın.`,
      on: (ev, c) => {
        if (ev.type === 'form-submit' && ev.errors.length) c.note(`Hâlâ ${ev.errors.length} alanda sorun var. Kırmızı yazıları okuyun.`);
        if (ev.type === 'appointment' && !/Göz/.test(ev.klinik)) { c.note('Randevu alındı ama klinik Göz Hastalıkları değil. Yine de devam edebilirsiniz.'); }
        return ev.type === 'appointment';
      },
      done: 'Randevunuz alındı! Randevu kodunu bir yere not edin. Sağ altta SMS de geldi.',
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
      done: 'Randevu iptal edildi. Gitmediğiniz randevuyu iptal etmek, o saati başka bir hastanın kullanmasını sağlar.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternette form doldurmak:</p>' },
  ],
};

export const alisveris = {
  id: 'alisveris', icon: '🛒', title: 'İnternetten güvenli alışveriş', minutes: 40, stage: 'desktop',
  desc: 'Sepete ekleme, adet değiştirme, kargo ücreti, teslimat adresi, kapıda ödeme ile kartla ödeme farkı, “kartımı kaydet” kutusu, 3D Secure SMS kodu, sipariş takibi.',
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
        <p>Bu derste <b>Fırsat Pazarı</b>\\'ndan alışveriş yapacağız. Gerçek para harcanmaz; kart bilgisi de deneme kartıdır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c, 'www.firsat-pazari.com.tr'); },
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
      on: (ev, c) => nav('www.firsat-pazari.com.tr', '/sepet')(ev) && (c.d.webState?.['firsat-pazari.com.tr']?.cart || []).length >= 2,
      done: 'Sepetinizde iki ürün var. Alttaki sarı yazı, kargonun bedava olması için ne kadar daha alışveriş gerektiğini söylüyor.',
    },
    {
      title: 'Adedi değiştirin',
      html: '<p>Ampulden <b>2 paket</b> olsun: ampulün yanındaki <b>+</b>\'ya basın. Toplamın ve kargonun nasıl değiştiğine bakın.</p>',
      mouse: '🖱 +',
      on: (ev) => ev.type === 'shop-cart' && ev.op === 'inc',
      done: 'Toplam 500 ₺\'yi geçince kargo <b>bedava</b> oldu. Ödemeden önce her zaman sepetteki adetlere ve toplama bakın.',
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
      on: (ev, c) => {
        if (ev.type === 'form-submit' && ev.site === 'shop-pay' && !ev.errors.length && ev.save) c.note('“Kartımı kaydet” işaretli kaldı. Sorun değil ama genelde kaldırmak daha güvenli.');
        return ev.type === 'shop-3d' || (ev.type === 'shop-order' && ev.yontem === 'kapida');
      },
      done: 'Bankanızın <b>3D Secure</b> sayfası açıldı ve telefonunuza (sağ altta) bir SMS geldi.',
    },
    {
      title: 'SMS kodunu girin',
      html: '<p>Sağ alttaki <b>SMS · BANKAM</b> mesajındaki 6 haneli kodu okuyun. Mesajda <b>tutarın</b> ve <b>mağazanın adının</b> doğru olduğunu kontrol edin, sonra kodu yazıp <b>Onayla</b>\'ya basın.</p>',
      on: (ev, c) => {
        if (ev.type === 'shop-3d-wrong') c.note('Kod yanlış. SMS\'teki rakamları tek tek karşılaştırın.');
        return ev.type === 'shop-order';
      },
      done: 'Siparişiniz alındı! SMS kodu, ödemeyi <b>sizin</b> yaptığınızı bankaya kanıtlar.',
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

const DAVET = { key: 'gorusme', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Bu akşam görüntülü görüşelim mi? 📹', url: 'gorusme.bulalim.com/aile', urlText: 'Görüşmeye katılmak için tıklayın',
  body: 'Merhaba!\n\nBu akşam hep birlikte görüntülü görüşelim. Ahmet amcam da gelecek. Aşağıdaki bağlantıya tıklamanız yeterli; hiçbir şey kurmanıza gerek yok.\n\nSevgiler,\nElif' };

export const gorusme = {
  id: 'gorusme', icon: '📹', title: 'Görüntülü görüşme', minutes: 30, stage: 'desktop',
  desc: 'E-postadaki davet bağlantısıyla görüşmeye katılmak, kamera ve mikrofon izni, sessize alma ve sesi açma, kamerayı kapatma, sohbete yazma, el kaldırma, görüşmeden ayrılma.',
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
      done: 'Postanın altında bir bağlantı ve onun <b>adresi</b> var: gorusme.bulalim.com. Tanıdık birinden ve beklediğiniz bir davet.',
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
      html: '<p>Tarayıcı, sitenin <b>kameranızı</b> ve <b>mikrofonunuzu</b> kullanmasına izin isteyip istemediğinizi soruyor. Görüntülü görüşme için <b>İzin ver</b>\'e basın.</p>',
      mouse: '🖱 İzin ver',
      on: (ev, c) => {
        if (ev.type === 'meet-perm' && ev.value === 'block') { c.warn('Engellediniz. Düzeltmek için: adres çubuğundaki 🔒 kilit → Kamera ve Mikrofon → İzin ver, sonra ⟳ yenile.'); return false; }
        return (ev.type === 'meet-perm' && ev.value === 'allow') || (ev.type === 'web-perm' && ev.perm === 'mic' && ev.value === 'allow' && c.d.sitePerms?.['bulalim.com']?.camera === 'allow');
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
      title: 'El kaldırın, sonra ayrılın',
      html: '<p>Kalabalık görüşmelerde söz istemek için <b>✋ El kaldır</b>\'a basın. Sonra görüşmeyi bitirmek için kırmızı <b>📞 Ayrıl</b>\'a basın.</p>',
      mouse: '🖱 ✋ → 📞 Ayrıl',
      on: (ev) => ev.type === 'meet-leave',
      done: 'Görüşmeden ayrıldınız. Pencereyi ya da sekmeyi kapatmak da görüşmeden çıkarır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Görüntülü görüşme:</p>' },
  ],
};

const inPhone = (c, id) => id && c.d.fs.get(id) && c.d.fs.isInside(id, PHONE);
export const telefon = {
  id: 'telefon', icon: '📱', title: 'Telefondan bilgisayara fotoğraf', minutes: 30, stage: 'desktop',
  desc: 'Telefonu kabloyla bağlamak, telefonda “Dosya aktarımı”nı seçmek, telefondaki fotoğrafları Dosya Gezgini\'nde bulup kopyalamak, hepsini birden içeri aktarmak.',
  summary: [
    ['Kabloyu takınca', 'Telefon önce yalnızca şarj olur'],
    ['Telefonda bildirim → Dosya aktarımı', 'Bilgisayar telefonun içini görür'],
    ['Telefonum › Dahili depolama › DCIM › Kamera', 'Telefonla çekilen fotoğraflar'],
    ['Ctrl + C → Resimler → Ctrl + V', 'Seçtiğiniz fotoğrafı kopyalar'],
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
      done: 'Telefon bağlandı (sağ altta). Ama bilgisayarda hiçbir şey çıkmadı! Telefonun ekranına bakın: “Bu cihaz USB ile şarj ediliyor”.',
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
      done: 'Telefonla çekilen fotoğraflar burada. Adları tarihle başlar: IMG_20261003… 3 Ekim 2026 demektir.',
    },
    {
      title: 'Bir fotoğrafı kopyalayın',
      html: `<p>Doğum günü pastalı fotoğrafa (<b>🎂</b>) bir kez tıklayıp ${K('Ctrl', 'C')} ile kopyalayın. Soldan <b>🖼 Resimler</b>\\'e geçip ${K('Ctrl', 'V')} ile yapıştırın.</p>`,
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
