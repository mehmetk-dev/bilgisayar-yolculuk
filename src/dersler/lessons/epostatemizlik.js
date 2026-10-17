// 9. hafta ek dersi: e-posta kutusu doldu! Arama çubuğuyla eski postayı bulmak (kelime, ek:var, kimden:),
// bültenlerden “Abonelikten çık” ile kurtulmak, büyük ekli postaları silip Çöp Kutusu'nu boşaltarak yer açmak.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { deliverMail, mailBox, QUOTA } from '../apps/mail.js';

const MB = 1e6;
const video = (name, size) => ({ name, size, content: { emoji: '🎬', bg: ['#f8bbd0', '#fff9c4'], video: true } });

function kur(c) {
  const d = c.d;
  const posta = (o) => deliverMail(d, { read: true, date: '', ...o }, true);
  posta({ key: 'fat2025', from: 'fatura@elektrik-dagitim.com.tr', fromName: 'Elektrik Dağıtım', subject: 'Ekim 2025 elektrik faturanız', time: '14.10.2025',
    body: 'Sayın Ahmet Yılmaz,\n\nEkim 2025 dönemi faturanız ektedir.\nTutar: 1.012,30 TL\nSon ödeme: 25.11.2025', attachments: [{ name: 'ekim 2025 elektrik faturası.pdf', size: 186e3, content: { pages: ['<h3>Ekim 2025 Elektrik Faturası</h3><p>Tutar: 1.012,30 TL</p>'] } }] });
  posta({ key: 'buyuk1', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Düğün videosu (1. bölüm)', time: '02.06.2025', body: 'Düğünün videosunu iki parça gönderiyorum.', attachments: [video('düğün 1.mp4', 24 * MB)] });
  posta({ key: 'buyuk2', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Düğün videosu (2. bölüm)', time: '02.06.2025', body: 'İkinci parça.', attachments: [video('düğün 2.mp4', 23 * MB)] });
  ['Haftanın fırsatları!', 'Hafta sonuna özel indirim', 'SON GÜN: %50 indirim'].forEach((sub, i) => {
    posta({ key: 'market' + i, from: 'kampanya@indirim-market.com', fromName: 'İndirim Market', list: true, subject: sub, time: `${11 + i}.10.2026`, read: false, body: 'Bu hafta yüzlerce üründe büyük indirim! Kaçırmayın.\n\nİndirim Market' });
  });
  posta({ key: 'buyuk3', from: 'hoca@ornek.com', fromName: 'Bilgisayar Hocası', subject: 'Ders videosu: fare kullanımı', time: '18.09.2025', body: 'Derste çektiğimiz videoyu gönderiyorum.', attachments: [video('ders videosu.mp4', 19 * MB)] });
  posta({ key: 'gezi1', from: 'bulten@gezi-dergisi.com.tr', fromName: 'Gezi Dergisi', list: true, subject: 'Bu ay: Kapadokya rehberi', time: '01.10.2026', body: 'Gezi Dergisi aylık bülteni.' });
  posta({ key: 'buyuk4', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Bayram fotoğrafları (hepsi)', time: '12.04.2024', body: 'Bütün fotoğraflar zip içinde.', attachments: [{ name: 'bayram fotoğrafları.zip', size: 21 * MB, content: { zip: [] } }] });
  posta({ key: 'buyuk5', from: 'ahmet@ornek.com', fromName: 'Ahmet (oğlum)', subject: 'Tatil fotoğrafları', time: '25.08.2024', body: 'Tatilden hepsi.', attachments: [{ name: 'tatil.zip', size: 22 * MB, content: { zip: [] } }] });
  posta({ key: 'fat2026', from: 'fatura@elektrik-dagitim.com.tr', fromName: 'Elektrik Dağıtım', subject: 'Eylül 2026 elektrik faturanız', time: '12.09.2026', body: 'Eylül 2026 faturanız: 988,40 TL', attachments: [{ name: 'eylül 2026 elektrik faturası.pdf', size: 186e3 }] });
  // Kutu neredeyse dolu: büyükler silinip Çöp Kutusu boşaltılınca %99'un altına iner
  const mb = mailBox(d);
  mb.storageBase = 0;
  const now = mb.mails.reduce((t, m) => t + 30e3 + m.attachments.reduce((a, x) => a + (x.size || 0), 0), 0);
  mb.storageBase = 14.94e9 - now;
}
const usedNow = (c) => { const mb = mailBox(c.d); return mb.storageBase + mb.mails.reduce((t, m) => t + 30e3 + m.attachments.reduce((a, x) => a + (x.size ?? c.d.fs.sizeOf({ name: x.name, content: x.content, type: 'file' })), 0), 0); };
const mail = (c) => maxed(c, 'mail');

export const epostaTemizlik = {
  id: 'eposta-temizlik', icon: '🧹', title: 'E-posta kutusu doldu! Eski postayı bulmak, abonelikten çıkmak', minutes: 20, stage: 'desktop',
  desc: 'Arama çubuğu (ek:var, kimden:), “Abonelikten çık” ve büyük ekli postaları silip yer açmak.',
  summary: [
    ['Arama kutusu', 'Konudaki, gönderendeki ya da yazıdaki bir kelimeyi yazıp Enter'],
    ['ek:var', 'Yalnızca ekli postalar (Gmail\'de: has:attachment)'],
    ['kimden:ad', 'Bir kişinin ya da firmanın postaları (Gmail\'de: from:ad)'],
    ['büyük:10mb', 'Ekleri 10 MB\'tan büyük olanlar (Gmail\'de: larger:10M)'],
    ['Abonelikten çık', 'Reklam bültenleri bir daha gelmez; postanın üstündeki düğmeyi kullanın'],
    ['Çöp Kutusu\'nu boşaltın', 'Silinen posta boşaltılana kadar yer kaplamaya devam eder'],
  ],
  setup: kur,
  steps: [
    {
      title: 'Kutunuz dolmak üzere',
      html: `<p>E-posta açınca kırmızı bir uyarı: <b>“Posta kutunuz dolmak üzere”</b>. Ücretsiz posta kutularının alanı sınırlıdır (çoğunda 15 GB). Dolarsa <b>yeni postalar size ulaşmaz</b>; e-Devlet'ten, bankadan gelen bildirimleri kaçırırsınız.</p>
        <p>Bu derste aradığınızı saniyede bulmayı, reklam postalarını durdurmayı ve yer açmayı öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); mail(c); },
    },
    rehberSoru({
      title: 'Ne kadar dolu?',
      html: '<p>E-posta penceresinin <b>sol altındaki Depolama</b> çubuğuna bakın. Ne kadar dolu?</p>',
      opts: ['Yarısı boş', '15 GB\'ın yaklaşık 14,9 GB\'ı dolu', 'Hiç dolu değil'], ok: 1,
      wrong: 'Sol alttaki kırmızı çubuğun altındaki yazıyı okuyun.',
      why: 'Doğru: neredeyse dolu. Yer kaplayanlar çoğunlukla <b>büyük ekli</b> postalardır (video, fotoğraf), yazılar değil.',
    }),
    {
      title: 'Geçen yılki faturayı bulun',
      html: '<p>Geçen yılın <b>Ekim</b> elektrik faturasına bakmanız gerekti. Postaları tek tek kaydırmayın: en üstteki <b>arama kutusuna</b> <b>elektrik</b> yazıp <b>Enter</b>\'a basın.</p>',
      hint: 'Arama kutusu kırmızı şeridin ortasında: “Postalarda ara”.',
      setup: mail,
      on: (ev) => ev.type === 'mail-search' && ev.results.some((r) => r.key === 'fat2025'),
      done: 'Elektrik faturalarının hepsi listelendi; konuda ve gönderende “elektrik” geçenler.',
    },
    {
      title: 'Faturayı açın',
      html: '<p>Listeden <b>“Ekim 2025 elektrik faturanız”</b> postasını açın.</p>',
      on: (ev) => ev.type === 'mail-open' && ev.key === 'fat2025',
      done: 'Fatura ve PDF eki önünüzde. Bir yıllık postada bile arama saniyeler sürer.',
    },
    {
      title: 'Yalnızca ekli postalar: ek:var',
      html: '<p>Bazen kelimeyi değil, “içinde dosya olan” postayı ararsınız. Arama kutusuna <b>ek:var</b> yazıp Enter\'a basın (iki nokta üst üste: ' + '<kbd>Shift</kbd> + <kbd>.</kbd>).</p>',
      hint: 'Kutudaki eski yazıyı silin, yalnızca ek:var yazın. Boşluk bırakmayın.',
      on: (ev) => ev.type === 'mail-search' && /ek:var/i.test(ev.q),
      done: 'Yalnızca ekli postalar listelendi. Gmail\'de aynı iş için <b>has:attachment</b> yazılır.',
    },
    {
      title: 'Bir göndereni arayın: kimden:',
      html: '<p>Şimdi reklam bültenlerini bulalım. Arama kutusuna <b>kimden:market</b> yazıp Enter\'a basın.</p>',
      on: (ev) => ev.type === 'mail-search' && /kimden:market/i.test(ev.q) && ev.results.length > 0,
      done: 'İndirim Market\'ten gelen postalar listelendi. Her hafta yenileri geliyor.',
    },
    {
      title: 'Abonelikten çıkın',
      html: '<p>Listeden bir İndirim Market postasını açın. Konunun altındaki gri şeritte <b>Abonelikten çık</b> düğmesine basıp onaylayın.</p>',
      hint: 'Düğme, postanın başlığının hemen altında: “Bu postayı İndirim Market bülteninden alıyorsunuz”.',
      on: (ev) => ev.type === 'mail-unsub' && /market/.test(ev.from),
      done: 'Artık İndirim Market\'ten posta gelmeyecek. Bültenleri silmek yerine abonelikten çıkmak, kutunun yeniden dolmasını önler.',
    },
    {
      title: 'Yer kaplayanları bulun: büyük:10mb',
      html: '<p>Arama kutusuna <b>büyük:10mb</b> yazıp Enter\'a basın. Ekleri 10 MB\'tan büyük postalar listelenir; her birinin yanında kırmızıyla boyutu yazar.</p>',
      on: (ev) => ev.type === 'mail-search' && /b[üu]y[üu]k:\s*10/i.test(ev.q) && ev.results.length >= 3,
      done: 'Beş büyük posta bulundu: videolar ve zip dosyaları. Bunları bilgisayarınıza ya da buluta kaydettiyseniz postada durmalarına gerek yok.',
    },
    {
      title: 'Büyükleri silin',
      html: '<p>Listenin üstündeki <b>🗑 Bulunan … postanın hepsini sil</b> düğmesine basın.</p>',
      hint: 'Düğme, “Arama: büyük:10mb” başlığının hemen altında. Göremiyorsanız aramayı yeniden yapın.',
      on: (ev) => ev.type === 'mail-delete-many' && ev.size > 50e6,
      done: 'Postalar Çöp Kutusu\'na taşındı. Ama sol alttaki çubuğa bakın: hâlâ kırmızı!',
    },
    {
      title: 'Çöp Kutusu\'nu boşaltın',
      html: '<p>Silinen postalar Çöp Kutusu\'nda 30 gün bekler ve <b>yer kaplamaya devam eder</b>. Soldan <b>🗑 Çöp Kutusu</b>\'na girin, <b>Çöp Kutusunu şimdi boşalt</b>\'a basıp onaylayın.</p>',
      check: (c) => usedNow(c) / QUOTA < 0.99,
      on: (ev, c) => ev.type === 'mail-empty-trash' && usedNow(c) / QUOTA < 0.99,
      done: (c) => `Yer açıldı: ${(usedNow(c) / 1e9).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} GB. Çubuk artık kırmızı değil; yeni postalar gelebilir.`,
    },
    rehberSoru({
      title: 'Dikkat: sahte bülten',
      html: '<p>Tanımadığınız, <b>“Hesabınızı doğrulayın”</b> diyen şüpheli bir postanın en altında “abonelikten çıkmak için tıklayın” bağlantısı var. Ne yaparsınız?</p>',
      opts: ['Bağlantıya tıklayıp abonelikten çıkarım', 'Tıklamam; postayı İstenmeyen\'e taşırım', 'Cevap yazıp beni listeden çıkarın derim'], ok: 1,
      wrong: 'Dolandırıcı postadaki bağlantı ya da cevap, adresinizin gerçek olduğunu onlara bildirir.',
      why: 'Doğru. “Abonelikten çık” yalnızca tanıdığınız firmaların bültenlerinde güvenlidir. Şüpheli postayı İstenmeyen\'e taşıyın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Posta kutunuzu düzenli tutabiliyorsunuz:</p>' },
  ],
};
