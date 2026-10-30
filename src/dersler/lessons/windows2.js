// 7. hafta ek dersi (MEB Windows modülü): masaüstüne kısayol, ekran çözünürlüğü ve ölçek, Sistem Geri Yükleme, Dosya Geçmişi.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const docs = (c) => { const w = maxed(c, 'explorer', { folder: 'docs' }); if (w.api.folder !== 'docs') w.api.go('docs'); };
const link = (c) => c.d.fs.children('desktop').find((n) => n.type === 'link' && n.target && /Faturalar/.test(n.name));

export const windowsAraclar = {
  id: 'windows-araclar', icon: '🧰', title: 'Kısayol, ekran ayarı ve geri yükleme', minutes: 30, stage: 'desktop',
  desc: 'Masaüstüne kısayol koymak; çözünürlük ve ölçek; Sistem Geri Yükleme ve Dosya Geçmişi ne işe yarar.',
  summary: [
    ['Sağ tık → Gönder → Masaüstü (kısayol oluştur)', 'Sık açılan klasör ya da dosyanın masaüstünde bir “yol göstericisi” olur'],
    ['Kısayol simgesindeki küçük ok ↗', 'Bu bir kısayoldur; silmek asıl dosyayı silmez'],
    ['Ayarlar → Sistem → Ekran', 'Çözünürlük: “Önerilen” kalsın. Yazılar küçükse Ölçek’i %125 ya da %150 yapın'],
    ['Sistem Geri Yükleme', 'Bilgisayarı bozulmadan önceki bir güne döndürür: programlar ve ayarlar geri gelir, belgeler ve fotoğraflar değişmez'],
    ['Geri yükleme noktası', 'Büyük bir program ya da sürücü kurmadan önce Windows (ya da siz) oluşturur'],
    ['Dosya Geçmişi', 'Belgelerin ve fotoğrafların kopyasını düzenli olarak bir USB diske alır; silinen dosyanın eski hâli geri getirilir'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>MEB kursunun Windows bölümünde sorulan dört konu: <b>masaüstüne kısayol</b>, <b>ekran çözünürlüğü ve ölçek</b>, <b>Sistem Geri Yükleme</b> ve <b>Dosya Geçmişi</b>.</p><p>İlkini alıştırma bilgisayarında yapacağız, diğerlerini sorularla öğreneceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Masaüstüne kısayol gönderin',
      html: '<p>Her ay <b>Faturalar</b> klasörünü açıyorsunuz ama her seferinde Dosya Gezgini → Belgeler → Faturalar diye aramak zahmetli. Masaüstüne bir <b>kısayol</b> koyacağız.</p><p>Yandaki Dosya Gezgini’nde <b>Belgeler</b> açık. <b>Faturalar</b> klasörüne <b>sağ tıklayın</b>; menüde <b>Gönder</b>’in üzerine gelin ve yandan açılan <b>🖥 Masaüstü (kısayol oluştur)</b>’a tıklayın.</p><p class="mut">Gerçek Windows 11’de menüde <b>Gönder</b> görünmüyorsa en alttaki <b>Diğer seçenekleri göster</b>’e tıklayın (ya da sağ tıklarken ' + K('Shift') + ' tuşunu basılı tutun). Gönder orada.</p>',
      mouse: '🖱 Faturalar → sağ tık → Gönder ›',
      hint: 'Faturalar klasörüne sağ tık → Gönder › → Masaüstü (kısayol oluştur).',
      setup: docs,
      check: (c) => !!link(c),
      on: (ev) => ev.type === 'shortcut' && /Faturalar/.test(ev.target),
      done: 'Masaüstünde <b>Faturalar - Kısayol</b> belirdi. Asıl klasör Belgeler’deki yerinde duruyor; masaüstündeki yalnızca ona giden bir <b>yol göstericidir</b>.',
    },
    {
      title: 'Kısayolu açın',
      html: `<p>Dosya Gezgini’ni kapatın (${K('Alt', 'F4')} ya da ✕). Masaüstündeki <b>Faturalar - Kısayol</b> simgesine <b>çift tıklayın</b>.</p>`,
      mouse: '🖱 Masaüstü: Faturalar - Kısayol → çift tık',
      on: (ev) => ev.type === 'shortcut-open' && /Faturalar/.test(ev.target),
      done: 'Tek çift tıkla Belgeler → Faturalar açıldı. Sık kullandığınız klasörler ve dosyalar için kısayol işinizi kolaylaştırır.',
    },
    rehberSoru({
      title: 'Kısayolu silersem?',
      html: '<p>Masaüstü kalabalıklaştı, <b>Faturalar - Kısayol</b>’u Geri Dönüşüm Kutusu’na attınız. Ne olur?</p>',
      opts: ['Faturalar klasörü ve içindeki bütün faturalar silinir', 'Yalnızca kısayol gider; Faturalar klasörü Belgeler’de durur', 'Bilgisayar hata verir'],
      ok: 1,
      why: 'Doğru. Kısayol bir yol işaretidir. Onu silmek asıl klasöre dokunmaz. Tersi ise sorun olur: <b>asıl klasörü</b> silerseniz kısayol “boşa” gösterir ve açılmaz.',
    }),
    rehberSoru({
      title: 'Ekran çözünürlüğü',
      html: '<p><b>Ayarlar → Sistem → Ekran</b>’da iki ayar vardır:</p><ul class="big-list"><li><b>Çözünürlük</b> (ör. 1920 × 1080): ekranda kaç nokta (piksel) olduğu. Yanında <b>(Önerilen)</b> yazan seçilir.</li><li><b>Ölçek</b> (ör. %100, %125, %150): yazı ve simgelerin büyüklüğü.</li></ul><p>Komşunuz “yazılar çok küçük” diyor. Hangisini değiştirmeli?</p>',
      opts: ['Çözünürlüğü 800 × 600 gibi küçük bir değere düşürmeli', 'Çözünürlük “Önerilen”de kalmalı; Ölçek %125 ya da %150 yapılmalı', 'Yeni bir ekran almalı'],
      ok: 1,
      why: 'Doğru. Çözünürlüğü düşürmek yazıları büyütür ama her şeyi <b>bulanık</b> ve sığmaz hâle getirir. Doğru yol: çözünürlük “Önerilen”de kalır, <b>Ölçek</b> büyütülür. (Tek bir programda yazı büyütmek için ' + K('Ctrl') + ' + tekerlek de olur.)',
    }),
    rehberSoru({
      title: 'Sistem Geri Yükleme',
      html: '<p>Dün bir program kurdunuz; bugün bilgisayar çok yavaş, bazı ayarlar bozuk. <b>Sistem Geri Yükleme</b> bilgisayarı, sorun başlamadan önceki bir <b>geri yükleme noktasına</b> döndürür.</p><p class="mut">Başlat’ta “geri yükleme noktası oluştur” yazın → Sistem Koruması → <b>Sistem Geri Yükleme…</b> → bir tarih seçin → İleri → Son.</p><p>Geri yükleme yapınca <b>belgeleriniz ve fotoğraflarınız</b> ne olur?</p>',
      opts: ['Hepsi silinir, o güne döner', 'Değişmez; yalnızca programlar, sürücüler ve ayarlar o güne döner', 'USB belleğe taşınır'],
      ok: 1,
      why: 'Doğru. Sistem Geri Yükleme <b>kişisel dosyalara dokunmaz</b>; o tarihten sonra kurulan programları kaldırır, ayarları geri alır. Bu yüzden belgelerin yedeği için başka bir yol gerekir: Dosya Geçmişi ya da USB/bulut yedeği (15. hafta).',
    }),
    rehberSoru({
      title: 'Geri yükleme noktası ne zaman?',
      html: '<p>Windows, büyük güncellemelerden önce kendiliğinden geri yükleme noktası oluşturur. Siz de elle oluşturabilirsiniz (Sistem Koruması → <b>Oluştur…</b>).</p><p>Hangisinden <b>önce</b> elle bir nokta oluşturmak akıllıca olur?</p>',
      opts: ['Bir fotoğrafı açmadan önce', 'Yeni bir yazıcı sürücüsü ya da büyük bir program kurmadan önce', 'İnternete girmeden önce'],
      ok: 1,
      why: 'Doğru. Sürücü ve program kurulumu sistemi değiştirir; bir şey ters giderse o noktaya dönersiniz.',
    }),
    rehberSoru({
      title: 'Dosya Geçmişi',
      html: '<p><b>Dosya Geçmişi</b> (Denetim Masası → Dosya Geçmişi), takılı bir USB diske Belgeler, Resimler, Masaüstü gibi klasörlerin kopyasını <b>saatte bir</b> kendiliğinden alır. Bir dosyayı yanlışlıkla silerseniz ya da bozarsanız “Kişisel dosyaları geri yükle” ile eski hâlini seçip geri getirirsiniz.</p><p>Hangisi doğru?</p>',
      opts: ['Dosya Geçmişi programları geri getirir', 'Dosya Geçmişi belgelerin eski kopyalarını saklar; çalışması için USB disk takılı olmalı', 'Dosya Geçmişi ile Sistem Geri Yükleme aynı şeydir'],
      ok: 1,
      why: 'Doğru. Kısaca: <b>Sistem Geri Yükleme</b> → programlar ve ayarlar; <b>Dosya Geçmişi</b> → belgeler ve fotoğraflar. İkisi birbirinin yerini tutmaz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bu derste masaüstüne kısayol koydunuz; çözünürlük ile ölçeğin farkını, Sistem Geri Yükleme ve Dosya Geçmişi’nin ne işe yaradığını öğrendiniz.</p>' },
  ],
};
