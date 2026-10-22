// 14. hafta ek dersi: e-Devlet'te sık kullanılan diğer hizmetler (SGK hizmet dökümü, emekli aylığı ve kesintiler,
// adıma kayıtlı hatlar, şirket ortaklığı: dolandırıcılık önlemi), belediyeye fotoğraflı arıza bildirimi ve CİMER.
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { KURS_TC, KURS_SIFRE } from '../apps/siteler-gunluk.js';
import { BELEDIYE_HOST, CIMER_HOST } from '../apps/siteler-kamu.js';

const ED = 'www.turkiye.gov.tr';

export const kamuHizmet = {
  id: 'edevlet-kamu', icon: '🏛', title: 'e-Devlet: SGK, emekli aylığı, kayıtlı hatlar; belediye ve CİMER', minutes: 35, stage: 'desktop',
  desc: 'Hizmet dökümü ve aylık kesintileri görmek, adınıza açılmış hat ya da şirket var mı bakmak, arızayı belediyeye ve CİMER\'e bildirmek.',
  summary: [
    ['SGK Tescil ve Hizmet Dökümü', 'Kaç gün sigortalı çalıştığınız; belge olarak indirilir'],
    ['SGK Emekli Aylık Bilgileri', 'Her ay yatan aylık ve kesintiler; tanımadığınız kesintiyi ALO 170\'e sorun'],
    ['Mobil Hat Sorgulama', 'Adınıza açılmış bütün hatlar; bilmediğiniz hat = operatöre ve savcılığa başvuru'],
    ['Şirket Ortaklık Bilgileri', 'Adınıza kurulmuş şirket var mı; yılda bir bakın'],
    ['Belediye → çözüm merkezi (belediyenizin internet sitesi ya da çağrı hattı)', 'Lamba, çukur, çöp… Fotoğraf ve açık adres ekleyin, başvuru numarasını not edin'],
    ['CİMER', 'Kurumdan sonuç alamazsanız; önceki başvuru numarasını yazın. Cevap 30 gün içinde'],
    ['⏻ Çıkış', 'e-Devlet\'ten her zaman çıkış yapın'],
  ],
  setup: (c) => { put(c, 'pictures', 'yanmayan lamba.jpg', 'file', { emoji: '💡', bg: ['#263238', '#546e7a'] }); },
  steps: [
    {
      title: 'e-Devlet\'te başka neler var?',
      html: `<p>e-Devlet'te belge almayı öğrenmiştik. Bugün emeklilerin en çok kullandığı hizmetlere bakacağız; sonra sokağınızdaki bir arızayı <b>belediyeye</b> bildirip <b>CİMER</b>'i tanıyacağız.</p>
        <p>Alıştırma giriş bilgileri: T.C. <b>${KURS_TC}</b>, şifre <b>${KURS_SIFRE}</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: ED }); },
    },
    {
      title: 'Giriş yapın',
      html: `<p>Sağ üstteki <b>Giriş yap</b>'a tıklayıp T.C. Kimlik No ve şifreyle girin.</p><p class="mut">T.C.: <b>${KURS_TC}</b> · Şifre: <b>${KURS_SIFRE}</b></p>`,
      on: (ev) => ev.type === 'edevlet-login' && ev.ok,
      done: 'Girdiniz. Sağ üstte adınız yazıyor.',
    },
    {
      title: 'Hizmet dökümü',
      html: '<p>Arama kutusuna <b>hizmet dökümü</b> yazıp arayın; <b>SGK Tescil ve Hizmet Dökümü</b>\'ne girin. Belgenin nereye verileceğini seçip <b>Belge Oluştur</b>, sonra <b>📄 Belgeyi indir</b>.</p>',
      hint: '“Belge nereye verilecek?” listesinden herhangi birini seçin (ör. Resmî kuruma verilecek).',
      on: (ev) => ev.type === 'edevlet-download' && ev.svc === 'sgk',
      done: 'Hizmet dökümü İndirilenler\'e indi.',
    },
    rehberSoru({
      title: 'Kaç gün?',
      html: '<p>İndirilen belgeyi açın (İndirilenler panelinde <b>Dosyayı aç</b>). <b>Toplam hizmet gün sayısı</b> kaç?</p>',
      hint: 'İndirme paneli kapandıysa tarayıcıdaki ⬇ simgesine tıklayın.',
      opts: ['3.600', '7.845', '9.000'], ok: 1,
      wrong: 'Belgede “Toplam hizmet gün sayısı” satırını okuyun.',
      why: 'Doğru: 7.845 gün, yaklaşık 21,5 yıl. Emeklilik için gereken gün sayısını bu belgeyle kontrol edersiniz.',
    }),
    {
      title: 'Emekli aylığı',
      html: '<p>Tarayıcıya dönün. Arama kutusuna <b>emekli aylık</b> yazın ve <b>SGK Emekli Aylık Bilgileri</b>\'ni açın.</p>',
      hint: 'Arama kutusu e-Devlet ana sayfasında; sol üstteki “Ana sayfa” bağlantısı da oraya götürür.',
      on: (ev) => ev.type === 'edevlet-view' && ev.svc === 'emekli',
      done: 'Son üç ayın aylığı, kesintiler ve ödeme günleri tabloda.',
    },
    rehberSoru({
      title: 'Kesinti',
      html: '<p>Ekim aylığından bir kesinti yapılmış. Neden?</p>',
      opts: ['Vergi kesintisi', 'Kredi taksiti (Bankam)', 'Kesinti yok'], ok: 1,
      wrong: 'Ekim satırında kesintinin altında küçük yazıyla nedeni yazıyor.',
      why: 'Doğru. Bu kesintiyi tanıyorsanız sorun yok; tanımıyorsanız ALO 170\'i arayın.',
    }),
    {
      title: 'Adınıza kayıtlı hatlar',
      html: '<p>Şimdi önemli bir güvenlik kontrolü: <b>hat</b> diye arayıp <b>Mobil Hat Sorgulama</b>\'yı açın.</p>',
      on: (ev) => ev.type === 'edevlet-view' && ev.svc === 'hat',
      done: 'Adınıza açılmış bütün telefon hatları listelendi.',
    },
    rehberSoru({
      title: 'Bilmediğiniz hat',
      html: '<p>Siz iki hat kullanıyorsunuz ama listede <b>üç</b> hat var; biri bu ay açılmış. Ne yaparsınız?</p>',
      opts: ['Önemsiz, bırakırım', 'Hattı açan operatöre başvurup kapattırırım; gerekirse savcılığa şikâyette bulunurum', 'Ben de kullanırım'], ok: 1,
      wrong: 'Adınıza açılan hat dolandırıcılıkta kullanılabilir; sorumluluk size kalır.',
      why: 'Doğru. Kimliğiniz kopyalanıp adınıza hat çıkarılmış olabilir; hemen kapattırın.',
    }),
    {
      title: 'Şirket ortaklığı',
      html: '<p>Bir kontrol daha: <b>şirket</b> diye arayıp <b>Şirket Ortaklık Bilgileri</b>\'ni açın.</p>',
      on: (ev) => ev.type === 'edevlet-view' && ev.svc === 'sirket',
      done: 'Adınıza şirket yok. Kimliği çalınanların adına şirket kurulup borç çıkarılabiliyor; yılda bir bakmak iyi bir alışkanlık.',
    },
    {
      title: 'Belediyeye bildirin',
      html: `<p>Evinizin önündeki sokak lambası bir haftadır yanmıyor. ${K('Ctrl', 'T')} ile yeni sekmede <b>${BELEDIYE_HOST}</b> adresine gidin, <b>Çözüm Merkezi</b>'ni açın.</p>
        <p>Formu doldurun: Konu <b>Sokak lambası yanmıyor</b>, adres <b>Çiçek Mah. Lale Sokak No: 5 önü</b>, kısa bir açıklama, <b>Resimler</b>'deki <b>yanmayan lamba.jpg</b> fotoğrafı, adınız ve cep telefonunuz. <b>Başvuruyu gönder</b>.</p>`,
      hint: 'Telefon 05 ile başlayan 11 haneli olmalı (alıştırma: 05321234567). Fotoğraf: 📎 Fotoğraf ekle → yanmayan lamba.jpg → Aç.',
      on: (ev, c) => {
        if (ev.type === 'belediye-form' && !ev.ok) c.note('Form gönderilmedi: kırmızı yazıyı okuyun.');
        if (ev.type !== 'belediye-basvuru') return false;
        if (!ev.photo) c.note('Başvuru gitti ama fotoğraf eklemediniz. Fotoğraf, ekibin yeri hemen bulmasını sağlar.');
        return true;
      },
      done: 'Başvuru alındı. <b>Başvuru numarasını</b> bir kâğıda yazın: durumunu sorgulamak ve gerekirse CİMER\'e başvurmak için lazım.',
    },
    rehberSoru({
      title: 'Lamba hâlâ yanmıyor',
      html: '<p>Belediyeye başvurdunuz; iki hafta geçti, lamba hâlâ yanmıyor ve cevap da gelmedi. Şimdi ne yapabilirsiniz?</p>',
      opts: ['Hiçbir şey yapılamaz', 'CİMER\'e başvurup belediyedeki başvuru numaramı yazarım', '112\'yi ararım'], ok: 1,
      wrong: '112 acil durumlar içindir. Kamu kurumundan sonuç alamayınca başka bir yol var.',
      why: 'Doğru: CİMER, kurumlardan sonuç alamadığınızda başvurulan yerdir. Önceki başvuru numarası işi hızlandırır.',
    }),
    {
      title: 'CİMER\'e başvurun',
      html: `<p>Yeni sekmede <b>${CIMER_HOST}</b> adresine gidin; <b>e-Devlet ile giriş yap</b>'a basın (e-Devlet'te oturumunuz açık olduğu için hemen girer).</p>
        <p>Tür: <b>Şikâyet</b>, kurum: <b>Çınar Belediyesi</b>, önceki başvuru numaranızı yazın; metinde sorunu birkaç cümleyle anlatıp <b>Başvuruyu gönder</b>.</p>`,
      hint: 'Önceki başvuru numarası belediye sekmesinde yazıyor (ÇB-2026-…). Oradan seçip kopyalayabilirsiniz.',
      on: (ev, c) => {
        if (ev.type === 'cimer-form' && !ev.ok) c.note('Form gönderilmedi: kırmızı yazıyı okuyun.');
        if (ev.type !== 'cimer-basvuru') return false;
        if (!ev.prior) c.note('Başvuru gitti. Bir dahaki sefere belediyedeki başvuru numaranızı da yazın; işiniz hızlanır.');
        else if (!ev.priorOk) c.note('Yazdığınız önceki başvuru numarası belediyedekiyle aynı değil gibi görünüyor; numaraları harf harf kontrol edin.');
        return true;
      },
      done: 'CİMER başvurunuz alındı; cevap en geç 30 gün içinde gelir.',
    },
    {
      title: 'e-Devlet\'ten çıkın',
      html: '<p>e-Devlet sekmesine dönüp sağ üstteki <b>⏻ Çıkış</b>\'a basın.</p>',
      on: (ev) => ev.type === 'edevlet-logout',
      done: 'Güvenli çıkış yaptınız.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>e-Devlet\'te kendi bilgilerinizi kontrol etmeyi ve şikâyetinizi doğru yere iletmeyi öğrendiniz:</p>' },
  ],
};
