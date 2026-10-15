// 8. hafta ek dersi: arama motorları. Fihrist benzetmesi, Google/Bing/Yandex/DuckDuckGo, sonuç parçaları, reklam sonucu, Görseller ve Haberler sekmeleri,
// iyi arama kelimeleri, ilk sonucun doğru olduğunu varsaymamak, aramalara özel bilgi yazmamak.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c) => maxed(c, 'browser');
const searched = (re) => (ev) => ev.type === 'web-search' && re.test(ev.q);

export const aramaMotorlari = {
  id: 'arama-motorlari', icon: '🔎', title: 'Arama motorları: Google, Bing, Yandex… nasıl aranır?', minutes: 35, stage: 'desktop',
  desc: 'Arama motoru nedir, sonuç sayfasını okumak, reklamı ayırt etmek.',
  summary: [
    ['Arama motoru', 'Siteleri sürekli tarayan dev bir fihrist: Google, Bing, Yandex, DuckDuckGo'],
    ['Tarayıcı değil', 'Chrome, Edge gibi tarayıcının içinde açılan bir sitedir'],
    ['Sonuç satırı', 'Mavi başlık = tıklanan bağlantı; altındaki gri = sitenin adresi; kısa açıklama'],
    ['Reklam', '“Reklam” yazan sonuçlar parayla yukarı çıkar; doğru ya da güvenli olmak zorunda değil'],
    ['Sekmeler', 'Tümü, Görseller, Haberler: aynı aramayı farklı biçimde gösterir'],
    ['İyi arama', 'Konu + yer + ne istediğiniz: “Ankara belediyesi su abonelik formu”'],
    ['Tırnak', 'Tırnak içine yazılan cümle olduğu gibi aranır: “su abonelik başvuru formu”'],
    ['Adrese bakın', '.gov.tr, .bel.tr, .com.tr: sonuca tıklamadan önce adresi okuyun'],
    ['Kişisel bilgi yazmayın', 'T.C. kimlik no, kart numarası, şifre aramaya yazılmaz'],
  ],
  steps: [
    {
      title: 'Arama motoru nedir?',
      html: `<p>İnternette milyonlarca site var. Aradığınızı nasıl bulursunuz? <b>Arama motoruyla.</b> Arama motoru, internetin <b>dev bir fihristidir</b>: siteleri gece gündüz gezip not alır; siz bir şey yazınca o notlardan uygun olanları sıralar.</p>
        <p>Bilinen arama motorları: <b>Google</b>, <b>Bing</b> (Microsoft), <b>Yandex</b>, <b>DuckDuckGo</b>. Bu derste <b>Bulalım</b> adlı alıştırma arama motorunu kullanacağız; gerçekleri de aynı çalışır.</p>
        <p class="mut">Arama motoru, tarayıcı <b>değildir</b>: tarayıcının (Edge, Chrome) içinde açılan bir sitedir.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Bir arama yapın',
      html: '<p><b>İnternet</b>\'i açın. Ortadaki arama kutusuna <b>börek tarifi</b> yazıp <b>🔍 Ara</b>\'ya ya da <b>Enter</b>\'a basın.</p>',
      setup: br,
      hint: 'Tarayıcı Bulalım sayfasıyla açılır. Kutuya tıklayıp yazın.',
      on: searched(/b[öo]rek/i),
      done: 'Sonuçlar geldi. “Yaklaşık … sonuç bulundu” yazıyor: binlerce sayfa. Arama motoru bunları <b>uygunluk sırasına</b> dizer.',
    },
    {
      title: 'Sonuç satırını okuyun',
      html: `<p>Her sonuç üç parçadır:</p><ul class="big-list"><li><b>Mavi başlık</b>: tıkladığınız bağlantı</li><li><b>Gri adres</b>: sitenin adresi (kimin sitesi?)</li><li><b>Kısa açıklama</b>: sayfanın ne anlattığı</li></ul>
        <p>Tıklamadan önce <b>adrese</b> bakmak en önemli alışkanlıktır.</p>`,
      manual: 'Anladım ✔',
    },
    {
      title: 'Reklam sonucu',
      html: '<p>Şimdi <b>resim gösterici program indir</b> diye arayın. Sonuçların en üstünde <b>“Reklam”</b> yazan bir kutu çıkacak.</p>',
      on: searched(/indir|program/i),
      done: 'En üstte <b>Reklam</b> yazan bir sonuç var. Reklamlar parayla yukarı çıkar: gerçeğine benzeyebilir ama güvenilir olmak zorunda değildir.',
    },
    {
      title: 'Doğru sonuca tıklayın',
      html: '<p>“Reklam” yazan kutuya <b>tıklamayın</b>. Altındaki gerçek sonuçlardan <b>Resim Gösterici: Ücretsiz İndir</b> başlığına tıklayın. Adresi <b>program-indir.com.tr</b> olan.</p>',
      on: (ev, c) => {
        if (ev.type === 'web-ad') c.warn('Reklama tıkladınız. “Reklam” yazan kutu parayla çıkar; altındaki normal sonuca tıklayın.');
        return ev.type === 'web-nav' && ev.host === 'www.program-indir.com.tr';
      },
      done: 'Doğru. Reklamın adresi <b>super-hizlandirici.xyz</b> gibi bir şeydi: tanımadığınız ve .xyz ile biten adres uyarı işaretidir.',
    },
    {
      title: 'Görseller sekmesi',
      html: '<p>Aynı aramayı resim olarak görmek için üstteki <b>Görseller</b> sekmesi vardır. Önce <b>manzara</b> diye arayın, sonra <b>🖼 Görseller</b> sekmesine tıklayın.</p>',
      hint: 'Önce arama kutusuna manzara yazıp Enter; sonuç sayfasında Tümü yanındaki Görseller.',
      setup: br,
      on: (ev) => ev.type === 'search-tab' && ev.tab === 'img',
      done: 'Resimler küçük kareler olarak sıralandı. Unutmayın: <b>görsellerin çoğunun telif hakkı vardır</b>. Kendi kullanımınız için bakmak serbesttir; başkasına ait fotoğrafı izinsiz kullanmayın.',
    },
    {
      title: 'Haberler sekmesi',
      html: '<p>Şimdi <b>📰 Haberler</b> sekmesine tıklayın. Burada yalnızca <b>haber siteleri</b> gösterilir ve <b>yenisi üstte</b>.</p>',
      on: (ev) => ev.type === 'search-tab' && ev.tab === 'news',
      done: 'Güncel bir olayı arıyorsanız Haberler sekmesi daha uygundur: tarihe göre sıralar. Yine de haberin <b>tarihine</b> ve kaynağına bakın.',
    },
    rehberSoru({
      title: 'Hangi arama daha iyi?',
      html: '<p>Belediyeden su abonelik formunu arıyorsunuz. Hangi arama <b>daha iyi sonuç</b> verir?</p>',
      opts: ['form', 'Örnek Belediyesi su abonelik başvuru formu', 'su'], ok: 1,
      wrong: 'Çok kısa aramalar binlerce alakasız sonuç getirir. Ne, nerede, ne işe yarayan?',
      why: 'Doğru. <b>Konu</b> (su abonelik), <b>yer</b> (belediye) ve <b>ne istediğiniz</b> (başvuru formu) kelimeleri sonucu daraltır. Tek kelime (“form”) çok geniştir.',
    }),
    rehberSoru({
      title: 'Tırnak içinde arama',
      html: '<p>Bir şiirin tam bir dizesini hatırlıyorsunuz ve <b>aynen o cümlenin</b> geçtiği sayfaları istiyorsunuz. Ne yaparsınız?</p>',
      opts: ['Cümleyi tırnak içine alıp aratırım: “...”', 'Hiçbir şey; arama motoru bunu yapamaz', 'Cümleyi büyük harfle yazarım'], ok: 0,
      wrong: 'Arama motorunun “sözcükleri birlikte ara” diyen bir işareti var.',
      why: 'Doğru. Tırnak (“ ”) içindeki cümle, sözcükler dağılmadan <b>aynı sırayla</b> aranır. Tarif adı, şiir dizesi, bir kişinin adı soyadı gibi aramalarda işe yarar.',
    }),
    rehberSoru({
      title: 'İlk sonuç doğru mu?',
      html: '<p>Bir ilaç hakkında arama yaptınız. İlk sonuç, tanımadığınız bir sitede “<b>Bu ilaç kesin çözüm!</b>” diyor. Ne yaparsınız?</p>',
      opts: ['İlk sonuç en doğrusudur, inanırım', 'Adrese bakarım; sağlık gibi konularda resmî kaynağa (.gov.tr, hastane sitesi) ve doktora danışırım', 'Hepsini silerim'], ok: 1,
      wrong: 'İlk sıra “en doğru” demek değildir: sıralama reklam ve popülerliğe de bağlıdır.',
      why: 'Doğru. Arama motoru sayfaları <b>sıralar</b>, doğruluğunu <b>garanti etmez</b>. Sağlık, para ve hukuk konularında resmî kaynaktan ve uzmandan doğrulayın.',
    }),
    rehberSoru({
      title: 'Kutuya ne yazılmaz?',
      html: '<p>Arama kutusuna hangisini <b>yazmamalısınız</b>?</p>',
      opts: ['“hava durumu Ankara”', 'T.C. kimlik numaranızı ya da kart numaranızı', '“ıspanaklı börek tarifi”'], ok: 1,
      wrong: 'Aramalar kaydedilebilir. Para ya da kimlik çalınmasına yol açabilecek olan hangisi?',
      why: 'Doğru. Arama motoruna yazdıklarınız kaydedilebilir. Kimlik numarası, kart bilgisi, şifre ve SMS kodunu <b>hiçbir yere yazdığınız arama kutusuna</b> yazmayın.',
    }),
    {
      title: 'Kendi bilgisayarınızda',
      html: `<p>Kendi tarayıcınızda hangi arama motorunun kullanıldığını görmek için tarayıcının <b>Ayarlar</b> sayfasında <b>“Arama motoru”</b> bölümüne bakın: Google, Bing, Yandex ya da DuckDuckGo seçilebilir.</p>
        <p>Hangisi daha iyi? Hepsi işinizi görür. <b>DuckDuckGo</b> aramalarınızı izlememeyi vaat eder; <b>Google</b> en çok sonucu bulur; <b>Yandex</b> Türkçe sonuçlarda güçlüdür; <b>Bing</b> Windows ile gelir.</p>`,
      manual: 'Baktım ✔',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Arama motorunu kullanmayı öğrendiniz:</p>' },
  ],
};
