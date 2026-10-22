// 14. hafta ek dersleri: e-Nabız (reçete, tahlil, aile hekimi), emlak ilanlarında arama ve kapora tuzağı, e-Hizmet parkuru
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { KURS_TC, KURS_SIFRE } from '../apps/siteler-gunluk.js';

const br = (c, url) => { const w = maxed(c, 'browser'); if (url) w.api.go(url, 'link'); return w; };
const nav = (host, path) => (ev) => ev.type === 'web-nav' && ev.host === host && (!path || ev.path === path);
const KART = `<div class="kurs-kart">🪪 Kurs için verilen bilgiler<br>T.C. Kimlik No: <b>${KURS_TC}</b><br>e-Devlet şifresi: <b>${KURS_SIFRE}</b></div>`;

export const eNabiz = {
  id: 'e-nabiz', icon: '🩺', title: 'e-Nabız: reçete ve tahlil sonuçlarınıza bakmak', minutes: 30, stage: 'desktop',
  desc: 'e-Nabız\'a e-Devlet üzerinden girmek, tahlil sonuçlarına bakmak.',
  summary: [
    ['enabiz.gov.tr', '.gov.tr: devletin sitesi; “e-Devlet ile giriş yap” sizi e-Devlet\'e götürür'],
    ['Şifre nerede yazılır?', 'Yalnızca adres çubuğunda turkiye.gov.tr yazan sayfada; e-Nabız şifreyi görmez'],
    ['💊 Reçetelerim', 'Geçmiş ve eczaneden alınabilecek reçeteler'],
    ['🧪 Tahlil sonuçlarım', 'Sonuçlar ve referans aralığı; ⚠ işaretli değeri doktorunuza gösterin'],
    ['⬇ PDF olarak indir', 'Sonucu bilgisayara kaydeder; hekime ya da WhatsApp\'tan gösterilebilir'],
    ['👩‍⚕️ Aile hekimim', 'Hekimin adı, birimi ve telefonu'],
    ['⏻ Çıkış', 'İşiniz bitince mutlaka çıkış yapın'],
  ],
  steps: [
    {
      title: 'Sağlık bilgileriniz internette',
      html: `<p>Doktora gitmeden <b>reçetelerinize</b> ve <b>tahlil sonuçlarınıza</b> evden bakabilirsiniz. Bunun için devletin <b>e-Nabız</b> sitesi vardır. Girişi e-Devlet şifresiyle yapılır.</p>${KART}`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'e-Nabız\'ı açın',
      html: '<p>Adres çubuğuna <b>enabiz.gov.tr</b> yazın.</p><p class="mut">Adreste <b>.gov.tr</b> olduğuna dikkat edin: devletin sitesi.</p>',
      on: nav('enabiz.gov.tr'),
    },
    {
      title: 'e-Devlet ile giriş yap',
      html: '<p>Sayfadaki <b>🇹🇷 e-Devlet ile giriş yap</b> düğmesine tıklayın. Sayfa değişecek: adres çubuğuna bakın.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.turkiye.gov.tr',
      done: 'Adres artık <b>turkiye.gov.tr</b>: e-Nabız sizi e-Devlet\'e gönderdi. Şifrenizi <b>yalnızca bu adreste</b> yazarsınız; e-Nabız şifrenizi hiç görmez. Bir sitenin kendi sayfasında e-Devlet şifresi isteniyorsa o site sahte olabilir.',
    },
    {
      title: 'Kimliğinizi doğrulayın',
      html: `<p>Kutudaki <b>T.C. kimlik numarasını</b> ve <b>şifreyi</b> yazıp <b>Giriş Yap</b>'a tıklayın. Sonra e-Devlet'in sorduğu soruda <b>Onayla ve e-Nabız'a dön</b>'e basın.</p>${KART}`,
      hint: 'Şifrenin ilk harfi büyük K. Kutudaki bilgileri harf harf yazın.',
      on: (ev, c) => {
        if (ev.type === 'edevlet-login' && !ev.ok) c.note('Giriş olmadı: kırmızı yazıyı okuyun.');
        if (ev.type === 'nabiz-login-cancel') c.note('Vazgeçtiniz. e-Nabız\'a girmek için yeniden “e-Devlet ile giriş yap”a basıp Onayla deyin.');
        return ev.type === 'nabiz-login' && ev.ok;
      },
      done: 'Giriş yapıldı ve e-Nabız\'a döndünüz. Üç kutu var: Reçetelerim, Tahlil sonuçlarım, Aile hekimim.',
    },
    {
      title: 'Reçetelerinize bakın',
      html: '<p><b>💊 Reçetelerim</b> kutusuna tıklayın.</p>',
      on: nav('enabiz.gov.tr', '/recete'),
      done: 'Tarih, ilaç, doktor ve durum görünüyor.',
    },
    rehberSoru({
      title: 'Kaç ilaç alınabilir?',
      html: '<p>Tabloya bakın: <b>“Kullanılabilir”</b> durumda kaç reçete var? (Eczaneden alınabilecekler.)</p>',
      opts: ['1', '2', '3'], ok: 1,
      wrong: 'Durum sütununa bakın: yeşil noktalı olanları sayın.',
      why: 'Doğru: 2. Üçüncü reçete (tansiyon ilacı) zaten “Kullanıldı”.',
    }),
    {
      title: 'Tahlil sonuçları',
      html: '<p>Ana sayfaya dönüp <b>🧪 Tahlil sonuçlarım</b>\'a tıklayın, listeden <b>Açlık kan şekeri</b> sonucunu açın.</p>',
      hint: 'e-Nabız yazısına ya da Ana sayfa bağlantısına tıklayın.',
      on: nav('enabiz.gov.tr', '/tahlil/seker'),
      done: 'Sonuç, referans aralığıyla birlikte tabloda.',
    },
    rehberSoru({
      title: 'Sonucu okuyun',
      html: '<p>Tabloda <b>⚠ Sınırın üstünde</b> yazan satırlar var. Bu durumda ne yaparsınız?</p>',
      opts: ['Hemen çok korkarım', 'Sonucu doktora gösterip yorumunu alırım', 'Hiç umursamam'], ok: 1,
      wrong: 'Tek bir sonuç hastalık demek değildir, ama göz ardı da edilmemeli.',
      why: 'Doğru. Referans aralığının dışında çıkan değeri doktorunuzla konuşun; tek başına yorum yapmak ya da panik yapmak doğru değil.',
    }),
    {
      title: 'PDF olarak indirin',
      html: '<p>Sonuç sayfasındaki <b>⬇ PDF olarak indir</b> düğmesine tıklayın. Belge <b>İndirilenler</b> klasörüne kaydedilir.</p>',
      on: (ev) => ev.type === 'nabiz-pdf',
      done: 'Sonuç PDF olarak bilgisayara kaydedildi. Doktora götürmek ya da göndermek için kullanılır.',
    },
    {
      title: 'İndirileni açın',
      html: '<p>Sağdaki indirme panelinde <b>Dosyayı aç</b>\'a tıklayın (ya da <b>Dosya Gezgini → İndirilenler</b>\'den çift tıklayın). PDF Okuyucu açılır.</p>',
      on: (ev) => ev.type === 'app-open' && ev.app === 'pdf',
      done: 'Tahlil sonucu PDF Okuyucu\'da açıldı. İçinde kelime arayabilir, yazdırabilirsiniz.',
    },
    {
      title: 'Aile hekiminiz',
      html: '<p>e-Nabız sekmesine dönüp <b>👩‍⚕️ Aile hekimim</b> bilgisine bakın.</p>',
      setup: (c) => br(c),
      on: nav('enabiz.gov.tr', '/hekim'),
    },
    rehberSoru({
      title: 'Hekiminizin adı?',
      html: '<p>Aile hekiminizin adı nedir?</p>',
      opts: ['Dr. Mehmet Kara', 'Dr. Selin Aksoy', 'Dr. Ayşe Demir'], ok: 1,
      wrong: 'Sayfada “Hekim” satırına bakın.',
      why: 'Doğru: Dr. Selin Aksoy, Çiçek 3 No\'lu Aile Sağlığı Merkezi. Telefonla randevu almak için sayfada numara yazıyor.',
    }),
    {
      title: 'Çıkış yapın',
      html: '<p>Sağ üstteki <b>⏻ Çıkış</b> düğmesiyle e-Nabız\'dan çıkın. Sağlık bilgileriniz özeldir; ortak bilgisayarda mutlaka çıkış yapın.</p><p class="mut">e-Nabız\'a e-Devlet şifrenizle girdiniz; e-Devlet oturumunun da kapandığından emin olmak gerekir.</p>',
      on: (ev) => ev.type === 'nabiz-logout',
      done: 'e-Nabız\'dan çıktınız. e-Devlet oturumu da kapanmış olmalı; yine de e-Devlet sayfasında adınız görünüyorsa oradan da <b>⏻ Çıkış</b> yapın. Ortak bilgisayarda ikisi de kapalı olmalıdır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sağlık bilgilerinize evden ulaşabiliyorsunuz:</p>' },
  ],
};

export const ilanTuzak = {
  id: 'ilan-tuzak', icon: '🏠', title: 'İlan sitelerinde arama ve kapora tuzakları', minutes: 30, stage: 'desktop',
  desc: 'İlan sitelerinde filtre kullanmak, sahte ilanı ve kapora dolandırıcılığını tanımak.',
  summary: [
    ['Filtre', 'İl, oda sayısı ve en çok fiyat: arama sonucunu daraltır'],
    ['Satıcı bilgisi', 'Üyelik süresi, telefon doğrulaması'],
    ['Şüpheli ilan', 'Fiyat çok düşük, ev gösterilmiyor, “anahtar kargoyla”, “hemen kapora yatırın”'],
    ['Kapora', 'Evi görmeden ve sözleşmeyi imzalamadan para göndermeyin'],
    ['🚩 Şikayet et', 'Sahte ilan fark ettiyseniz siteye bildirin'],
  ],
  steps: [
    {
      title: 'İlan siteleri',
      html: `<p>Kiralık ev, ikinci el eşya… <b>ilan siteleri</b> işinize yarar; ama bazı ilanlar <b>sahtedir</b>. Dolandırıcılar çok ucuz fiyat ve “acil” baskısıyla kapora (ön ödeme) toplar, sonra ortadan kaybolur.</p>
        <p>Bugün filtre kullanmayı ve sahte ilanı tanımayı öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.ilanIlkSikayet = null; br(c); },
    },
    {
      title: 'İlan Pazarı\'nı açın',
      html: '<p>Adres çubuğuna <b>www.ilan-pazari.com.tr</b> yazın.</p>',
      on: nav('www.ilan-pazari.com.tr'),
    },
    {
      title: 'İl ve fiyatla arayın',
      html: '<p><b>İl</b>: <b>Ankara</b>; <b>En çok kira</b>: <b>12000</b> yazıp <b>🔍 İlanları göster</b>\'e tıklayın.</p>',
      hint: 'İl kutusuna tıklayıp Ankara\'yı seçin. Fiyat kutusuna yalnızca rakam yazın.',
      on: (ev, c) => { const ok = ev.type === 'ilan-search' && ev.il === 'Ankara' && ev.max > 0 && ev.max <= 12000; if (ok) c.s.max = ev.max; return ok; },
      done: (c) => `Ankara\'daki kiralık evler, en çok ${c.s.max.toLocaleString('tr-TR')} ₺ kira ile listelendi. Filtre, yüzlerce ilanı birkaç tanesine indirir.`,
    },
    {
      title: 'İlk ilanı inceleyin',
      html: '<p>Listeden <b>“Metroya yakın, doğalgazlı 2+1 daire”</b> ilanına tıklayın. Fotoğraflara, fiyata, açıklamaya ve satıcıya bakın.</p>',
      on: nav('www.ilan-pazari.com.tr', '/ilan/1'),
      done: 'Bu ilan sağlam görünüyor: satıcı 4 yıllık üye, telefonu doğrulanmış, “görmek için randevu alın” diyor.',
    },
    {
      title: 'Şüpheli ilanı bulun',
      html: '<p>Aramaya dönün (← Aramaya dön). Listede fiyatı <b>çok düşük</b> olan iki ilan var: “ACİL! Çok ucuz 2+1 kiralık…” ve “Bugüne özel! 1+1 sadece 2.500 TL”. Birini açıp okuyun.</p>',
      on: (ev) => nav('www.ilan-pazari.com.tr', '/ilan/3')(ev) || nav('www.ilan-pazari.com.tr', '/ilan/7')(ev),
      done: 'Dikkat çekici bir ilan: fiyat piyasanın çok altında.',
    },
    rehberSoru({
      title: 'En büyük uyarı?',
      html: '<p>Bu ilandaki <b>en büyük uyarı işareti</b> hangisi?</p>',
      opts: ['Fotoğrafı çok güzel', 'Evi göstermiyor (ya da anahtarı kargoyla gönderiyor) ve hemen kapora istiyor', 'Üç odası var'], ok: 1,
      wrong: 'Güzel fotoğraf ya da oda sayısı şüphe nedeni değil. İlanın açıklamasını tekrar okuyun.',
      why: 'Doğru. Evi göstermemek, “anahtar kargoyla” demek ve hemen kapora istemek klasik dolandırıcılıktır. Bu satıcının üyeliği de yeni, telefonu da doğrulanmamış.',
    }),
    {
      title: 'Şikayet edin',
      html: '<p>Sahte ilanı bildirmek de iyi bir davranıştır: <b>🚩 İlanı şikayet et</b>\'e tıklayın. (Kapora gönder düğmesine <b>tıklamayın</b>.)</p>',
      on: (ev, c) => {
        if (ev.type === 'ilan-kapora') c.warn('Gerçekte para göndermiş olurdunuz! Bu ilan sahte; yalnızca “İlanı şikayet et”e tıklayın.');
        if (ev.type === 'ilan-report' && ev.scam) { c.d.ilanIlkSikayet = ev.id; return true; }
        return false;
      },
      done: 'Şikayet alındı. Siz bir komşunuzu dolandırıcılıktan kurtarmış olabilirsiniz.',
    },
    {
      title: 'Öbür şüpheli ilan',
      html: (c) => `<p>Öbür şüpheli ilanı, <b>${c.d.ilanIlkSikayet === 7 ? '“ACİL! Çok ucuz 2+1 kiralık…”' : '“Bugüne özel! 1+1 sadece 2.500 TL”'}</b> ilanını da açıp şikayet edin. İpucu: aynı işaretler var.</p>`,
      hint: 'Aramaya dönün (← Aramaya dön); listede fiyatı çok düşük olan iki ilandan henüz bildirmediğiniz.',
      on: (ev, c) => ev.type === 'ilan-report' && ev.scam && ev.id !== c.d.ilanIlkSikayet,
      done: 'İkinci sahte ilan da bildirildi. İlan “yalnızca bugün” gibi acele ettiriyorsa hep şüphelenin.',
    },
    rehberSoru({
      title: 'Kapora ne zaman?',
      html: '<p>Gerçek bir ilan buldunuz ve ev sahibi 1 aylık kapora istiyor. Ne yaparsınız?</p>',
      opts: ['Hemen IBAN\'a yatırırım', 'Evi gördükten ve sözleşmeyi imzaladıktan sonra, makbuz alarak öderim', 'Ev sahibinin kimlik fotokopisini isterim ve yatırırım'], ok: 1,
      wrong: 'Para göndermeden önce evi ve sözleşmeyi görmek gerekir.',
      why: 'Doğru. Kaporayı (ve depozitoyu) evi yerinde görüp sözleşmeyi imzaladıktan sonra, makbuz karşılığı verin. Ödemeyi mümkünse banka yoluyla (havale/EFT) yapın ve sözleşmeye yazdırın; elden ya da tanımadığınız birinin hesabına göndermeyin. Bir yakınınızı yanınıza almak da iyi bir fikirdir.',
    }),
    rehberSoru({
      title: 'Sahte ilan işareti değil',
      html: '<p>Aşağıdakilerden hangisi sahte ilan işareti <b>değildir</b>?</p>',
      opts: ['Fiyat piyasanın çok altında', 'Satıcı telefonunu doğrulamış, evi gösterebileceğini söylüyor', '“Ev sahibi yurtdışında, anahtar kargoyla” demesi'], ok: 1,
      wrong: 'Sahte ilan genellikle ev göstermemeye çalışır.',
      why: 'Doğru. Telefonu doğrulanmış, evi göstermeye hazır satıcı güven verir; öbür ikisi tipik dolandırıcılık işaretleridir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlan sitelerini güvenle kullanabilirsiniz:</p>' },
  ],
};

export const eHizmetParkur = {
  id: 'ehizmet-parkur', icon: '🏁', title: 'e-Hizmet parkuru', minutes: 30, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: e-Devlet belgesi, hastane randevusu, e-Nabız. Süreler tutulur.',
  // Eğitmen notu: son ekranda her görevin süresi görünür (öğrenciye gösterilmez).
  steps: [
    {
      title: 'e-Hizmet parkuru',
      html: `<p>14. haftada öğrendiğiniz hizmetleri sırayla yapın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>${KART}`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Tarayıcıyı açın', html: '<p><b>İnternet</b> programını açın.</p>', hint: 'Başlat → İnternet.', check: (c) => !!c.d.find('browser'), on: (ev) => ev.type === 'app-open' && ev.app === 'browser' },
    { title: '2. e-Devlet\'e gidin', html: '<p><b>e-Devlet</b> sitesine gidin.</p>', hint: 'Adres çubuğuna turkiye.gov.tr yazın.', setup: (c) => br(c), on: nav('www.turkiye.gov.tr') },
    { title: '3. Giriş yapın', html: '<p>e-Devlet\'e <b>giriş yapın</b> (kutudaki bilgilerle).</p>', hint: 'Giriş yap bağlantısı sayfanın üstünde. Şifrenin ilk harfi büyük K.', on: (ev) => ev.type === 'edevlet-login' && ev.ok },
    { title: '4. İkametgâh belgesi', html: '<p><b>Yerleşim yeri (ikametgâh) belgesini</b> oluşturup <b>PDF olarak indirin</b>.</p>', hint: 'Hizmet arama kutusuna ikametgâh yazın; belge nereye verilecek seçin; belge oluşturun; indirin.', on: (ev) => ev.type === 'edevlet-download' },
    { title: '5. Hastane randevusu', html: '<p><b>MHRS</b> sitesinden <b>Göz Hastalıkları</b> kliniğine bir <b>randevu alın</b>.</p>', hint: 'mhrs.gov.tr → Randevu al. Zorunlu (*) alanları doldurun; kırmızı yazıları okuyun.', on: (ev) => ev.type === 'appointment' },
    { title: '6. Randevu belgesi', html: '<p>Randevunuzun <b>belgesini PDF olarak indirin</b>.</p>', hint: 'Onay sayfasının altında ⬇ düğmesi var.', on: (ev) => ev.type === 'mhrs-pdf' },
    { title: '7. Randevularım', html: '<p><b>Randevularım</b> sayfasına gidip randevunuzu görün.</p>', hint: 'MHRS sayfasının üstündeki Randevularım bağlantısı.', on: nav('www.mhrs.gov.tr', '/randevularim') },
    { title: '8. e-Nabız\'a girin', html: '<p><b>e-Nabız</b>\'a gidip giriş yapın.</p>', hint: 'enabiz.gov.tr → e-Devlet ile giriş yap → Onayla ve e-Nabız\'a dön.', on: (ev) => ev.type === 'nabiz-login' && ev.ok },
    { title: '9. Tahlil sonucu', html: '<p>Bir <b>tahlil sonucunu PDF olarak indirin</b>.</p>', hint: 'Tahlil sonuçlarım → bir sonuç → PDF olarak indir.', on: (ev) => ev.type === 'nabiz-pdf' },
    { title: '10. Bir PDF\'yi açın', html: '<p>İndirdiğiniz belgelerden <b>birini açın</b>.</p>', hint: 'Dosya Gezgini → İndirilenler → çift tık.', on: (ev) => ev.type === 'app-open' && ev.app === 'pdf' },
    { title: '11. Güvenli çıkış', html: '<p>e-Devlet\'ten <b>çıkış yapın</b>.</p>', hint: 'e-Devlet\'e dönün, sağ üstteki ⏻ Çıkış.', on: (ev) => ev.type === 'edevlet-logout' },
    { final: true, title: 'Parkur bitti! 🎉', html: '<p>Belge aldınız, randevu aldınız, sağlık bilgilerinize baktınız ve güvenle çıktınız.</p>' },
  ],
};
