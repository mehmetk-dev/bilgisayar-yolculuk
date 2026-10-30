// 8. hafta ek dersi: bir sorunu internette doğru aratmak. Kötü sorgu / iyi sorgu (hata mesajı, ürün, Windows sürümü), reklam sonucu,
// resmî destek sayfası, eski forum yanıtı, “programı indirin / numarayı arayın” tuzağı, kolay ve geri alınabilir adımla başlamak.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c) => maxed(c, 'browser');
// Türkçe harfleri sadeleştirip küçültür (çevrimdışı = cevrimdisi); tırnaklar da atılır
const norm = (s) => String(s).toLocaleLowerCase('tr').replace(/[ıİ]/g, 'i').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/["“”'‘’]/g, ' ');
// Ortak uyarı: reklama tıklanınca
const adWarn = (ev, c) => { if (ev.type === 'web-ad') c.warn('Bu “Reklam”dı. Reklamlar parayla yukarı çıkar; güvenilir olmak zorunda değildir. Altındaki gerçek sonuçlara bakın.'); };

export const sorunAra = {
  id: 'sorun-ara', icon: '🧭', title: 'Sorunu internette doğru aratın', minutes: 25, stage: 'desktop',
  desc: 'Bir hata çıkınca ya da bir şey yapamayınca doğru sözcüklerle aratıp güvenilir çözüm bulmak; reklam, eski forum ve sahte destek numarasından kaçınmak.',
  summary: [
    ['Hata mesajını yazın', 'Ekranda ne yazıyorsa aynen aratın (gerekirse tırnak içinde): “yazıcı çevrimdışı”'],
    ['Ürün ve sürüm ekleyin', 'Program ya da cihaz adı + Windows sürümü: “Windows 11 yazıcı çevrimdışı”'],
    ['Kısa ve özel', '“Bilgisayarım bozuldu ne yapayım” değil, “Windows 11 ses gelmiyor”'],
    ['Reklam', '“Reklam” ya da “Sponsorlu” yazan sonuç parayla en üste çıkar; çözüm sunmak zorunda değildir'],
    ['Resmî kaynak', 'Üreticinin ya da Microsoft’un destek sayfası; adresi okuyun'],
    ['Tarihe bakın', 'Eski forum yanıtı eski sürüm içindir; bugünkü Windows’a uymaz'],
    ['İndirmeyin, aramayın', '“Her şeyi düzeltir” diyen programı indirmeyin; sayfadaki destek numarasını aramayın'],
    ['Önce kolayı', 'Kapatıp açmak gibi geri alınabilir adımla başlayın; emin değilseniz tanıdığa sorun'],
  ],
  steps: [
    {
      title: 'Bir sorun çıktı',
      html: `<p>Bilgisayarda yazdırmak istiyorsunuz ama yazıcı yazmıyor. Ayarlarda yazıcının altında şu yazıyor:</p>
        <div style="border:2px solid #b0bec5;border-radius:8px;padding:10px 14px;margin:8px 0;background:#fafafa"><b>🖨 Renkli Yazıcı R-200</b><br><span style="color:#b71c1c">Çevrimdışı</span></div>
        <p>Ne yaparsınız? Bu derste <b>sorunu internette aratıp</b> çözümü <b>güvenilir bir yerden</b> bulmayı öğreneceksiniz. Hem de dolandırıcı sayfalara düşmeden.</p>
        <p class="mut">Hata mesajı uzunsa ya da yazması zor geliyorsa ekranın görüntüsünü alıp bir tanıdığa gönderebilirsiniz (<b>Ekran Alıntısı</b> dersine bakın).</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
      manual: 'Anladım ✔',
    },
    {
      title: 'Önce kötü bir arama',
      html: '<p>Önce acemilerin sık yaptığı bir aramayı deneyin. <b>İnternet</b>\'i açın, kutuya <b>bilgisayarım bozuldu ne yapayım</b> yazıp <b>Enter</b>\'a basın.</p>',
      setup: br,
      hint: 'Tarayıcı Bulalım sayfasıyla açılır. Kutuya tıklayıp yazın.',
      on: (ev) => ev.type === 'web-search' && /bozul/.test(norm(ev.q)),
      done: 'Sonuçlara bakın: <b>yazıcıdan</b> hiç söz yok. En üstte bir <b>Reklam</b> var, altında 2011 tarihli bir forum yazısı. Çünkü arama çok <b>genel</b>: bilgisayarın neresi bozuk, belli değil.',
    },
    {
      title: 'İyi arama: hata + ürün + sürüm',
      html: `<p>Şimdi doğru aratın. Ekranda yazan hata mesajını <b>aynen</b> yazın, başına ürünü ve Windows sürümünü ekleyin:</p>
        <p style="font-size:1.15em"><b>Windows 11 yazıcı çevrimdışı</b></p>
        <p class="mut">İsterseniz hata mesajını tırnak içine alabilirsiniz: Windows 11 “yazıcı çevrimdışı”. Tırnak, sözcüklerin birlikte aranmasını sağlar.</p>`,
      hint: 'Sonuç sayfasındaki arama kutusuna yazın ya da Bulalım ana sayfasına dönün.',
      on: (ev, c) => {
        if (ev.type !== 'web-search') return false;
        const n = norm(ev.q);
        if (!/yazici/.test(n) || !/cevrimdisi|offline/.test(n)) return false;
        if (!/windows/.test(n)) { c.warn('Güzel. Bir de başına “Windows 11” ekleyin; sürüme göre çözüm değişir.'); return false; }
        return true;
      },
      done: 'Bu sefer sonuçlar <b>tam sizin sorununuz</b> hakkında. Hata mesajı + ürün + sürüm: üç parça. Aramayı <b>kısa ve özel</b> tutmak işe yarar.',
    },
    {
      title: 'Sonuçları okuyun',
      html: `<p>Sonuç sayfasında üç tür şey görüyorsunuz:</p>
        <ul class="big-list"><li><b>Reklam</b>: en üstte. “Uzman destek hattı”, numara, “hemen arayın” yazıyor. <b>Aramayın.</b></li>
        <li><b>Üreticinin destek sayfası</b>: adı yazıcı markasının sitesi. Altında <b>güncelleme tarihi</b> var. <b>Bu güvenilir.</b></li>
        <li><b>Forum</b> ve <b>“program indir”</b> sayfaları: tarihe ve adrese bakmadan güvenmeyin.</li></ul>
        <p>Kural: önce <b>resmî</b> kaynak (üretici ya da Microsoft), sonra <b>tarih</b>, sonra adres.</p>`,
      manual: 'Anladım ✔',
    },
    {
      title: 'Resmî destek sayfasını açın',
      html: '<p>Adresi <b>yazici-destek.com.tr</b> olan ve “Windows 11” yazan sonuca tıklayın: <b>Yazıcı “Çevrimdışı” görünüyor</b>. En üstteki “Reklam”a tıklamayın.</p>',
      hint: 'Reklam kutusunun altındaki ilk gerçek sonuç.',
      on: (ev, c) => {
        adWarn(ev, c);
        if (ev.type !== 'web-nav') return false;
        if (/eski-forum|program-indir/.test(ev.host)) c.warn('Bu resmî destek sayfası değil. Sonuçlara dönüp adresi yazici-destek.com.tr olanı seçin.');
        return ev.host === 'www.yazici-destek.com.tr' && ev.path === '/cevrimdisi';
      },
      done: 'Doğru. Bu sayfa yazıcı üreticisinin sayfası: adım adım, <b>kolaydan zora</b> doğru yazılmış ve güncelleme tarihi yakın (Ekim 2026). Sizden şifre ya da kart bilgisi de istemiyor.',
    },
    rehberSoru({
      title: 'Hangi adımdan başlarsınız?',
      html: '<p>Sayfada altı adım var. Okudunuz: ilk adımlar yazıcıyı kontrol etmek, kapatıp açmak ve kabloyu takmak; sonraki adımlar ayarlar ve yazılım kurmak. <b>Hangisinden başlarsınız?</b></p>',
      opts: ['Yazıcının sürücüsünü kaldırıp baştan kurarım', 'Yazıcıyı kapatıp 30 saniye sonra açarım', 'Bilgisayarı sıfırlarım, temiz başlar'], ok: 1,
      wrong: 'Önce <b>kolay</b> ve <b>geri alınabilir</b> olanı deneyin. Hangisi hiçbir şeyi bozmaz?',
      why: 'Doğru. Önce <b>kolay ve geri alınabilir</b> olanı deneyin: kapatıp açmak, kabloyu çıkarıp takmak. Çoğu sorun orada çözülür. Büyük adımlara (kurmak, silmek, sıfırlamak) geçmeden önce emin olun; emin değilseniz bir tanıdığa ya da öğretmene sorun.',
    }),
    {
      title: 'Eski bir forum yazısı',
      html: '<p>Tarayıcıda <b>←</b> (geri) düğmesiyle sonuçlara dönün. Şimdi <b>yazıcım çevrimdışı yazıyor ne yapayım??</b> başlıklı <b>eski forum</b> sonucuna tıklayın. Sadece bakacağız.</p>',
      hint: 'Sonuç listesinin ikinci sırasında, adresi eski-forum.com olan.',
      on: (ev, c) => { adWarn(ev, c); return ev.type === 'web-nav' && ev.host === 'www.eski-forum.com' && ev.path === '/yazici'; },
      done: 'Tarihe bakın: <b>12 Mart 2012</b>, Windows XP. Bugünkü Windows 11 için geçerli değil. Yanıtlarda ayrıca bir <b>program</b> ve bir <b>telefon numarası</b> öneriliyor. Bunlara dokunmayın.',
    },
    rehberSoru({
      title: 'Forumdaki öneriler',
      html: '<p>Forum yanıtlarından biri: “<b>Bu programı indirin, her şeyi düzeltir</b>.” Bir başkası: “<b>Şu numarayı aradım, çok yardımcı oldular</b>.” Ne yaparsınız?</p>',
      opts: ['Programı indirir, sonra virüs taraması yaparım', 'Numarayı ararım; sonuçta uzmanlar yardım eder', 'Hiçbirini yapmam; resmî sayfadaki adımlara dönerim'], ok: 2,
      wrong: 'Tanımadığınız programı indirmek ya da numarayı aramak, sizi dolandırıcının eline düşürebilir. Güvenli yol hangisi?',
      why: 'Doğru. “Her şeyi düzeltir” diyen programı <b>indirmeyin</b>, sayfadaki “destek hattı” numarasını <b>aramayın</b>: sahte olabilir, para ya da şifre isteyebilir ve bilgisayarınıza uzaktan bağlanabilirler. Gerçek destek numarasını yalnızca <b>ürünün kutusunda</b> ya da üreticinin <b>kendi sitesinde</b> arayın.',
    }),
    {
      title: 'Bir de siz deneyin: ses yok',
      html: `<p>Başka bir sorun: bilgisayardan ses gelmiyor. Bu sefer <b>kısa ve özel</b> aratın. Arama kutusuna şunu yazın:</p>
        <p style="font-size:1.15em"><b>Windows 11 ses gelmiyor</b></p>`,
      hint: 'Sonuç sayfasındaki ya da Bulalım ana sayfasındaki kutuya yazın.',
      on: (ev, c) => {
        if (ev.type !== 'web-search') return false;
        const n = norm(ev.q);
        if (!/\bses\b/.test(n) || !/gelmiyor|gitti/.test(n)) return false;
        if (!/windows/.test(n)) { c.warn('Başına “Windows 11” de ekleyin; resmî Microsoft sayfası daha üstte çıkar.'); return false; }
        return true;
      },
      done: 'Yine en üstte bir <b>Reklam</b> var ve “1 dakikada düzeltin” diyor. Altındaki sonuçlarda <b>support.microsoft.com</b> adresini arayın.',
    },
    {
      title: 'Microsoft’un destek sayfası',
      html: '<p>Adresi <b>support.microsoft.com</b> olan sonuca tıklayın: <b>Windows’ta ses sorunlarını giderme</b>. Reklama tıklamayın.</p>',
      hint: 'Tarihi yeni olan, “Microsoft Desteği” yazan sonuç.',
      on: (ev, c) => {
        adWarn(ev, c);
        if (ev.type === 'web-nav' && /eski-forum/.test(ev.host)) c.warn('Bu forum yazısı 2010’dan kalma. Microsoft’un destek sayfasını seçin.');
        return ev.type === 'web-nav' && ev.host === 'support.microsoft.com';
      },
      done: 'Doğru. Windows’un kendi sorununu <b>Microsoft’un sayfasından</b> okumak en sağlam yoldur. Yine kolaydan başlıyor: hoparlör simgesi, ses düzeyi, kablo.',
    },
    {
      title: 'Emin değilseniz sorun',
      html: `<p>Okuduğunuz adımın <b>ne yaptığını anlamıyorsanız</b> uygulamayın. Bir tanıdığa ya da öğretmeninize sorun. Ekran görüntüsü alıp (<b>⊞ + Shift + S</b>) onlara göndermek de güzel bir yoldur: <b>Ekran Alıntısı</b> dersinde öğrendiğiniz gibi.</p>
        <ul class="big-list"><li>Çözümü bulduysanız bir kâğıda <b>not alın</b>, bir daha lazım olur.</li><li>Sayfa size <b>para, şifre ya da kart bilgisi</b> sorarsa kapatın.</li></ul>`,
      manual: 'Anladım ✔',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bir sorunu internette doğru aratmayı öğrendiniz:</p>' },
  ],
};
