// 15. hafta kısa dersi (Bilgi güvenliği): “Telefonum kayboldu ya da çalındı: ilk bir saatte ne yaparım?”
// Sakin kalmak, telefonu aramak, bilgisayardan bulmak / kilitlemek, hattı ve mobil bankacılığı kapattırmak,
// şifreleri değiştirmek, çalıntıysa başvuru, önceden hazırlık. Benzetim yok; bilgi adımları ve karar soruları (rehberSoru).
import { desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

export const telefonKayip = {
  id: 'telefon-kayip', icon: '📵', title: 'Telefonum kayboldu: ilk bir saatte ne yaparım?', minutes: 20, stage: 'desktop',
  desc: 'Telefon kaybolunca ya da çalınınca sakin kalmak, bilgisayardan bulmak ya da kilitlemek, hattı ve mobil bankacılığı kapattırmak, şifreleri değiştirmek.',
  summary: [
    ['1. Sakin olun', 'Telefonu başka bir telefondan arayın; yakındadır ya da bulan kişi açar'],
    ['2. Bilgisayardan bulun', 'Android: android.com/find (Gmail hesabı) · iPhone: icloud.com/find (Apple Kimliği)'],
    ['Silmek', 'En son seçin; silince telefonun yeri de görünmez'],
    ['3. Hattı kapattırın', 'Operatörünüzü arayın; SMS kodları başkasına gitmesin. Yeni SIM kart aynı numarayla, kimlikle, operatör mağazasından alınır'],
    ['4. Bankayı arayın', 'Kartın arkasındaki numaradan; mobil bankacılığı geçici olarak durdurmalarını isteyin'],
    ['5. Şifreler', 'Önce e-posta, sonra e-Devlet ve sosyal medya; bilgisayardan değiştirin'],
    ['WhatsApp', 'Yeni SIM kartla başka telefonda numaranızla girin; eski telefondaki oturum kapanır'],
    ['6. Çalındıysa', 'Karakola ya da savcılığa başvurun; IMEI numarası (kutuda ya da faturada) gerekebilir. Kutuyu ve faturayı saklayın'],
    ['Önceden hazırlık', 'Ekran kilidi · “Cihazımı Bul” / “Bul” açık · yedek kodlar ve telefon numaraları kâğıtta · fotoğraflar otomatik yedekte'],
    ['Yedek kodlar', 'İki adımlı doğrulama dersindeki “Telefon kayboldu!” adımı'],
  ],
  steps: [
    {
      title: 'Telefon yok!',
      html: `<p>Çantanıza baktınız, cebinize baktınız: <b>telefon yok.</b> Kalbiniz hızlı atabilir; bu çok normal.</p>
        <p>Telefonda mesajlarınız, fotoğraflarınız ve bankanızın uygulaması olabilir. Üstelik bankadan, e-Devlet'ten, WhatsApp'tan gelen <b>SMS kodları</b> da o telefona gider. Bu yüzden <b>ilk bir saat</b> önemlidir.</p>
        <p>Ama korkmayın: yapılacaklar belli ve çoğunu <b>bilgisayardan</b> yapabilirsiniz. Bu derste sırayla bakacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'İlk bir saat: sıra',
      html: `<ol>
          <li><b>Sakin olun</b> ve telefonu başka bir telefondan arayın.</li>
          <li>Bulamazsanız bilgisayardan <b>bulun ya da kilitleyin</b>.</li>
          <li><b>Operatörünüzü</b> arayıp hattı geçici olarak kapattırın.</li>
          <li><b>Bankanızı</b> arayın; mobil bankacılığı durdurmalarını isteyin.</li>
          <li>Bilgisayardan önemli <b>şifreleri</b> değiştirin.</li>
          <li>Çalındıysa <b>karakola ya da savcılığa</b> başvurun.</li>
        </ol>
        <p>Önce telefonu arayın: belki koltuğun arasındadır, belki bulan biri açıp size verir. Aramadan harekete geçmek boşuna telaş olabilir.</p>
        <p class="mut">Hepsini aynı dakikada yapmanız gerekmez; sırayla ilerleyin.</p>`,
    },
    {
      title: 'Bilgisayardan bulmak',
      html: `<p>Bilgisayarda tarayıcıyı açıp telefonunuzun türüne göre bir adrese gidersiniz:</p>
        <p>📱 <b>Android telefon:</b> <b>android.com/find</b> (Google “Cihazımı Bul”). Telefonda kullandığınız <b>Gmail hesabıyla</b> girin. Telefonu <b>çaldırabilir</b>, <b>kilitleyebilir</b> ya da <b>silebilirsiniz</b>.</p>
        <p>🍎 <b>iPhone:</b> <b>icloud.com/find</b> (iCloud “Bul”). <b>Apple Kimliğinizle</b> girin.</p>
        <p>Telefon <b>kapalıysa</b> ya da konum özelliği kapalıysa yeri bulunamayabilir. Bu durumda kilitlemek ve öteki adımlara geçmek daha önemlidir.</p>
        <p><b>Silme</b> seçeneğine en son başvurun: silerseniz telefonun yeri de artık görünmez.</p>`,
    },
    {
      title: 'Hat ve banka',
      html: `<p><b>Operatörünüzü</b> arayın ve <b>hattınızı (SIM kartınızı) geçici olarak kapattırın.</b> Böylece SMS ile gelen kodlar bir başkasına gitmez.</p>
        <p>Sonra aynı numarayla <b>yeni SIM kart</b> alabilirsiniz: operatörün mağazasına <b>kimliğinizle</b> gidin.</p>
        <p><b>Bankanızı</b> kartınızın <b>arkasındaki numaradan</b> arayın ve <b>mobil bankacılığı geçici olarak durdurmalarını</b> isteyin. Telefonda banka uygulaması varsa, bulan kişi giremesin diye bu çok önemlidir.</p>
        <p class="mut">Operatör ve banka telefon numaralarını kâğıtta saklarsanız, telefon yokken aramak kolaylaşır.</p>`,
    },
    {
      title: 'Şifreler ve WhatsApp',
      html: `<p>Bilgisayardan şifreleri şu sırayla değiştirin:</p>
        <ol>
          <li><b>E-posta</b>: en önemlisi. Öteki şifreler çoğu zaman e-postayla sıfırlanır; e-posta başkasının eline geçerse hepsi gider.</li>
          <li><b>e-Devlet</b></li>
          <li><b>Sosyal medya</b> hesapları</li>
        </ol>
        <p><b>WhatsApp:</b> yeni SIM kartı aldıktan sonra WhatsApp'a <b>başka bir telefonda numaranızla yeniden girin</b>. Bu, eski telefondaki oturumu kapatır. Bunun için yeni SIM kart gerekir.</p>
        <p class="mut">Telefon yokken iki adımlı doğrulama kodu isteniyorsa, saklamış olduğunuz <b>yedek kodlar</b> işe yarar. Bunu “İki adımlı doğrulama” dersinde görmüştünüz.</p>`,
    },
    rehberSoru({
      title: 'Önce kimi ararsınız?',
      html: '<p>Marketten çıktınız, telefonunuz yok. Evde değilsiniz, bilgisayar yanınızda değil. <b>İlk</b> ne yaparsınız?</p>',
      opts: ['Hemen bütün tanıdıklarıma ve sosyal medyada duyuru yaparım', 'Sakin olur, telefonu başka bir telefondan ararım', 'Birkaç gün beklerim, belki biri telefonu getirir'], ok: 1,
      wrong: 'Bir an durup düşünün: telefon yakında olabilir. İlk iş onu aramaktır.',
      why: 'Doğru. Telefon yakında olabilir ya da bulan kişi açabilir; arama bazen işi hemen çözer. Bulamazsanız eve ya da bilgisayarın başına geçip sıradaki adımlara bakarsınız.',
    }),
    rehberSoru({
      title: '“Sil” düğmesi',
      html: '<p>Eve geldiniz, <b>android.com/find</b>\'a girdiniz. Telefonun son yeri haritada görünüyor. Ekranda <b>Çaldır</b>, <b>Kilitle</b> ve <b>Sil</b> seçenekleri var. Ne yaparsınız?</p>',
      opts: ['Hemen Sil\'e basarım, ne olur ne olmaz', 'Hiçbirine basmam, telefon kendiliğinden bulunur', 'Önce çaldırır ve kilitlerim; silmeyi en son seçerim'], ok: 2,
      wrong: 'Silme geri alınamaz ve telefonu bulma imkânını kaldırır. Önce yeri görmeye ve kilitlemeye bakın.',
      why: 'Doğru. Silince telefonun yeri de görünmez, bu yüzden silme en sondadır. Kilit ekranı bulan kişinin bilgilerinize girmesini zorlaştırır. Telefon bulunamayacaksa ve içindekilerin ele geçmesinden korkuyorsanız en son silmeyi seçersiniz.',
    }),
    rehberSoru({
      title: 'Kodu isteyen kişi',
      html: '<p>Telefonunuz kayıp. Komşunuzun telefonuna (ya da e-postanıza) yabancı biri yazıyor: “Telefonunuzu buldum! Vermeden önce doğrulamak için size gelen <b>SMS kodunu</b> ve şifrenizi yazın.” Ne yaparsınız?</p>',
      opts: ['Kod ve şifre vermem; telefonu gerçekten bulan bunları istemez', 'Kodu söylerim, şifreyi söylemem', 'Yalnızca kodun son iki rakamını söylerim'], ok: 0,
      wrong: 'SMS kodu hesaplarınızın anahtarıdır; bir kısmını bile vermeyin.',
      why: 'Doğru. SMS kodu ve şifre hesaplarınızın anahtarıdır; bir kısmını bile vermeyin. Kodlar yalnızca bankaya ya da e-Devlet\'e girerken sizin yazdığınız yerlere yazılır. Bu, dolandırıcıların sık kullandığı bir yoldur. Bulan kişiyle buluşacaksanız kalabalık, güvenli bir yer seçin.',
    }),
    {
      title: 'Çalındıysa',
      html: `<p>Telefonun <b>çalındığını</b> düşünüyorsanız <b>karakola ya da savcılığa</b> başvurun.</p>
        <p>Yanınıza <b>kimliğinizi</b> alın. Telefonun <b>IMEI numarası</b> kutusunda ya da faturasında yazar. Telefonu kapattırma işlemleri için bu numara gerekebilir.</p>
        <p><b>Kutuyu ve faturayı saklayın.</b> Çöpe atmayın; böyle bir günde işinize yarar.</p>`,
    },
    {
      title: 'Önceden hazırlık',
      html: `<p>En iyi hazırlık, telefon kaybolmadan yapılır. Telefonunuz yanınızdayken şunları kontrol edin:</p>
        <ol>
          <li><b>Ekran kilidi</b> koyun (şifre, desen ya da parmak izi).</li>
          <li><b>“Cihazımı Bul”</b> (Android) ya da <b>“Bul”</b> (iPhone) <b>açık</b> olsun.</li>
          <li><b>Yedek kodlarınızı</b> ve <b>operatör ile banka telefon numaralarını</b> kâğıda yazıp evde güvenli bir yerde saklayın.</li>
          <li><b>Fotoğraflarınız</b> otomatik yedeklensin; telefon gitse de anılar kalsın.</li>
        </ol>
        <p class="mut">Kâğıdı telefon kılıfına ya da çantaya koymayın; telefonla birlikte kaybolur.</p>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Telefon kaybolunca, ilk bir saatte:</p>' },
  ],
};
