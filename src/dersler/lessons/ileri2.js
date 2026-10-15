// Ek dersler: Takvim randevu ve hatırlatıcı, Görev Yöneticisi ayrıntıları, Ekran Klavyesi, sanal masaüstleri ve Görev Görünümü (5. hafta),
// vurgu rengi ve görünüm ayarları (7. hafta), adres mektup birleştirme ve büyük/küçük harf, stiller, cetvel (10. hafta), tarayıcıda sayfa notu (13. hafta).
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

// ------------------------------------------------------------------ Takvim: randevu ve hatırlatıcı
const hm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const demoEv = (c) => (c.d.calEvents ||= []).find((e) => e.demo);

export const takvimRandevu = {
  id: 'takvim-randevu', icon: '📅', title: 'Takvim: randevu ve hatırlatıcı', minutes: 25, stage: 'desktop',
  desc: 'Takvime doktor randevusu eklemek, bilgisayarın size önceden hatırlatmasını sağlamak ve randevuyu silmek.',
  summary: [
    ['Takvim → güne tıkla', 'Altta o günün randevuları ve “Randevu ekle” bölümü açılır'],
    ['Ad + Saat + Hatırlatma → Ekle', 'Hatırlatma “15 dk önce” ise randevudan 15 dakika önce bildirim çıkar'],
    ['Günde küçük bir nokta', 'O gün için not ya da randevu var demektir'],
    ['Randevunun yanındaki ✕', 'Randevuyu siler'],
    ['Hatırlatma', 'Bilgisayar açıkken ve sesi açıkken gelir; kapalıysa gelmez'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Doktor, kurs, bayram ziyareti, torunun okul toplantısı… Hepsini aklımızda tutmak yerine <b>Takvim</b>\'e yazabiliriz. Üstelik bilgisayar, randevu saatinden önce bize <b>hatırlatabilir</b>.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Takvimi açın',
      html: '<p>⊞ <b>Başlat</b>\'tan <b>📅 Takvim</b>\'i açın. (Başlat\'ta <b>takvim</b> yazmak da olur.)</p>',
      mouse: '🖱 Başlat → Takvim',
      check: (c) => !!c.d.find('takvim'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'takvim',
      done: 'Bugünün tarihi renkli kutuda. ‹ › ile aylar arasında gezilir; kırmızı günler resmî tatildir.',
    },
    {
      title: 'Randevu ekleyin',
      html: '<ol class="steps"><li>Takvimde <b>bir güne</b> tıklayın (yarın olabilir).</li><li>Altta <b>＋ Randevu ekle</b> bölümüne <b>Doktor randevusu</b> yazın.</li><li>Saati <b>10:30</b> yapın, hatırlatmayı <b>15 dk önce</b> seçin.</li><li><b>Ekle</b>\'ye basın.</li></ol>',
      target: 'Doktor randevusu',
      hint: 'Saat kutusuna tıklayıp 10, 30 yazabilirsiniz.',
      setup: (c) => { c.d.ensure('takvim'); },
      on: (ev, c) => {
        if (ev.type !== 'cal-add') return false;
        if (!norm(ev.title).includes('doktor')) { c.warn('Randevunun adına “Doktor randevusu” yazın.'); return false; }
        if (!ev.time) { c.warn('Saati de seçin: 10:30. Saat yoksa bilgisayar hatırlatamaz.'); return false; }
        if (ev.remind !== 15) { c.warn('Hatırlatma “15 dk önce” olmalı. Yanlış eklenen randevuyu ✕ ile silin, doğrusunu yeniden ekleyin.'); return false; }
        return true;
      },
      done: 'Randevu listede, o günün üstünde de küçük bir nokta belirdi. Bilgisayar açıksa saatinden 15 dakika önce köşede bir bildirim çıkar.',
    },
    {
      title: 'Hatırlatma gelsin',
      html: '<p>Gerçek hatırlatmayı beklemeyelim: size <b>10 dakika sonrasına</b> “Diş doktoru” adlı bir deneme randevusu koyduk (15 dk önceden hatırlatır). <b>Sağ alttaki bildirimi</b> bekleyin; birkaç saniye sürer.</p>',
      hint: 'Ses açıksa kısa bir zil de duyarsınız.',
      setup: (c) => {
        const w = c.d.find('takvim'); if (w) c.d.close(w);
        if (!demoEv(c)) {
          const at = new Date(c.d.now().getTime() + 10 * 60e3);
          c.d.calEvents.push({ id: 'demo', demo: true, date: `${at.getFullYear()}-${at.getMonth() + 1}-${at.getDate()}`, time: hm(at), title: 'Diş doktoru', remind: 15 });
        }
        c.d.ensure('takvim');
      },
      check: (c) => !!demoEv(c)?.fired,
      on: (ev) => ev.type === 'cal-remind',
      done: 'Hatırlatma geldi. Böylece randevuyu unutmazsınız; ama bilgisayar kapalıysa bildirim çıkmaz.',
    },
    {
      title: 'Randevuyu silin',
      html: '<p>Diş doktoru randevusu iptal oldu diyelim. Takvimde bugünün altındaki <b>Diş doktoru</b> satırının yanındaki <b>✕</b>\'e basın.</p>',
      mouse: '🖱 Diş doktoru → ✕',
      setup: (c) => { c.d.ensure('takvim'); },
      check: (c) => !demoEv(c),
      on: (ev) => ev.type === 'cal-del',
      done: 'Randevu silindi; günün üstündeki nokta da kalktı (başka randevu yoksa).',
    },
    rehberSoru({
      title: 'Hatırlatma ne zaman gelir?',
      html: '<p>Takvimdeki hatırlatma için hangisi doğru?</p>',
      opts: ['Bilgisayar açıkken, seçtiğiniz süre kadar önce', 'Bilgisayar kapalıyken de, telefona mesaj olarak', 'Hiçbir zaman; takvime her gün bakmak gerekir'],
      ok: 0,
      wrong: 'Bildirim bilgisayarın kendisinden gelir; bilgisayar kapalıysa ya da uykudaysa çıkamaz.',
      why: 'Hatırlatma bilgisayar açıkken ve sesi açıkken çalışır. Çok önemli randevular (ameliyat, sınav, ilaç) için telefonun takvimi daha güvenlidir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Takvimde randevu ve hatırlatıcı:</p>' },
  ],
};

// ------------------------------------------------------------------ Ekran Klavyesi
const access = (c) => { const w = c.d.ensure('settings'); w.api.go('access'); return w; };
const npText = (c) => c.d.find('notepad')?.el.querySelector('textarea')?.value || '';

export const ekranKlavyesi = {
  id: 'ekran-klavyesi', icon: '⌨', title: 'Ekran Klavyesi: fareyle yazmak', minutes: 20, stage: 'desktop',
  desc: 'Klavyesi bozuk ya da dokunmatik ekranlı bilgisayarda fareyle yazmak.',
  summary: [
    ['Ayarlar → Erişilebilirlik → Ekran klavyesi', 'Başlat\'ta “ekran klavyesi” yazmak da olur'],
    ['Önce yazılacak yere tıklayın', 'Sonra ekran klavyesinin tuşlarına'],
    ['⇧ Shift', 'Büyük harf ya da üstteki işaret için önce buna, sonra tuşa'],
    ['⌫ Geri', 'Son yazılanı siler'],
    ['✕', 'Ekran klavyesini kapatır'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Klavyedeki bir tuş bozulabilir, klavye hiç takılı olmayabilir ya da dokunmatik ekranlı bir bilgisayar kullanıyor olabilirsiniz. Windows\'ta ekranda çizili bir klavye vardır: <b>Ekran Klavyesi</b>. Tuşlara fareyle tıklayarak yazarsınız.</p><p>(Ekranı büyütmek için <b>Büyüteç</b> ayrı bir derstir.)</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Ekran klavyesini açın',
      html: '<p><b>Ayarlar → Erişilebilirlik</b> açıldı. En alttaki <b>⌨ Ekran klavyesi</b> bölümünde <b>Ekran klavyesini aç</b>\'a basın.</p>',
      mouse: '🖱 Ekran klavyesini aç',
      setup: access,
      hint: 'Başlat\'ta “ekran klavyesi” yazarak da açılır.',
      check: (c) => !!c.d.find('osk'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'osk',
      done: 'Ekranın altında bir klavye belirdi. Hep en üstte durur ve tıklayınca yazı alanından odağı çalmaz.',
    },
    {
      title: 'Fareyle yazın',
      html: '<p>Not Defteri açıldı. Önce Not Defteri\'nin <b>yazı alanına bir kez tıklayın</b>, sonra ekran klavyesinin tuşlarına tıklayarak yazın:</p>',
      target: 'merhaba',
      setup: (c) => { c.d.closeAll(); const n = c.d.open('notepad'); n.el.querySelector('textarea').focus(); c.d.open('osk'); },
      hint: 'Büyük harf için önce ⇧ Shift\'e, sonra harfe tıklayın. Hata yaparsanız ⌫ Geri.',
      check: (c) => norm(npText(c)).includes('merhaba'),
      on: (ev, c) => ev.type === 'osk-key' && norm(npText(c)).includes('merhaba'),
      done: 'Klavyesi bozulan bir bilgisayarda acil bir şey yazmak, ya da dokunmatik ekranlı bir bilgisayarda yazmak için kullanılır.',
    },
    rehberSoru({
      title: 'Ekran klavyesi ne zaman işe yarar?',
      html: '<p>Hangisinde ekran klavyesi <b>en çok</b> işe yarar?</p>',
      opts: ['Klavyedeki bir tuş bozulduğunda', 'Hızlı yazmak istediğimde', 'İnternet daha hızlı olsun diye'],
      ok: 0,
      wrong: 'Fareyle tek tek tıklamak klavyeden yavaştır; internetle de ilgisi yoktur.',
      why: 'Bozuk ya da eksik klavye, dokunmatik ekran, elleri titreyen ya da klavye kullanamayan kişiler için. Bankaların bazı “sanal klavye”leri de aynı fikirle çalışır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Ekran Klavyesi:</p>' },
  ],
};

// ------------------------------------------------------------------ Adres mektup birleştirme
const LIST = { A1: 'Ad', B1: 'Adres', C1: 'Şehir', A2: 'Ayşe Kaya', B2: 'Gül Sokak No: 3', C2: 'İzmir', A3: 'Hasan Demir', B3: 'Lale Sokak No: 7', C3: 'Ankara', A4: 'Fatma Ak', B4: 'Nar Sokak No: 1', C4: 'Bursa', A5: 'Mehmet Öz', B5: 'Çam Sokak No: 12', C5: 'İstanbul' };
const LETTER = '<p>Sayın ,</p><p>Adres: </p><p>Mahallemizin geleneksel kermesi bu Pazar saat 11:00\'de okul bahçesinde yapılacaktır. Sizi de aramızda görmekten mutluluk duyarız.</p><p>Saygılarımızla,<br>Kermes Komitesi</p>';
const wdM = (c) => c.d.find('word');
const fields = (c) => wdM(c)?.api.info().fields || [];
const mmOpen = (c) => {
  put(c, 'docs', 'kermes davetlileri.xlsx', 'file', { cells: { ...LIST }, fmt: {}, rules: [] });
  const doc = put(c, 'docs', 'kermes daveti.docx', 'file', { html: LETTER });
  let w = wdM(c);
  if (!w) w = maxed(c, 'word', { node: doc.id });
  else if (!w.max) c.d.maximize(w);
  return w;
};

export const mektup = {
  id: 'mektup', icon: '✉', title: 'Kelime işlemci: adres mektup birleştirme', minutes: 30, stage: 'desktop',
  desc: 'Davet mektubunu listedeki herkes için adı ve adresiyle çoğaltmak.',
  summary: [
    ['Postalar → Alıcıları seç', 'Kişi listesi: hesap tablosu (1. satır: Ad, Adres…)'],
    ['Birleştirme alanı ekle', '«Ad» gibi yer tutucular; her mektupta değişir'],
    ['Sonuçları önizle ◀ ▶', 'Her kişinin mektubuna bakar'],
    ['Bitir ve birleştir', 'Tek tek belgeler ya da doğrudan yazdırma'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Kermes için <b>4 komşuya</b> davet mektubu göndereceğiz. Mektup aynı, yalnızca <b>ad</b> ve <b>adres</b> değişiyor.</p>
        <p>Dört kez kopyala-yapıştır yapmak yerine kelime işlemcinin <b>adres mektup birleştirme</b> özelliğini kullanacağız. Liste 400 kişi olsa da aynı süre sürer.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); mmOpen(c); },
    },
    {
      title: 'Alıcı listesini seçin',
      html: '<ol class="steps"><li>Üstten <b>Postalar</b> sekmesine geçin.</li><li><b>👥 Alıcıları seç…</b>\'e basın.</li><li>Belgeler\'den <b>kermes davetlileri.xlsx</b>\'i açın.</li></ol>',
      mouse: '🖱 Postalar → Alıcıları seç',
      setup: mmOpen,
      hint: 'Liste bir hesap tablosu: 1. satırda sütun adları (Ad, Adres, Şehir), altında her satırda bir kişi.',
      check: (c) => !!wdM(c)?.api.info().merge,
      on: (ev) => ev.type === 'merge-list',
      done: 'Şeritte “kermes davetlileri.xlsx · 4 kişi” yazıyor.',
    },
    {
      title: 'Ad alanını ekleyin',
      html: '<ol class="steps"><li>Mektupta <b>Sayın</b> kelimesinden sonraya, virgülün önüne tıklayın.</li><li><b>⊕ Birleştirme alanı ekle</b> → <b>«Ad»</b>.</li></ol>',
      setup: mmOpen,
      check: (c) => fields(c).includes('Ad'),
      on: (ev) => ev.type === 'merge-field' && ev.field === 'Ad',
      done: 'Mektupta gri bir <b>«Ad»</b> belirdi. Bu bir yer tutucudur: her mektupta yerine o kişinin adı gelecek.',
    },
    {
      title: 'Adres alanını ekleyin',
      html: '<p><b>Adres:</b> satırının sonuna tıklayın ve aynı yolla <b>«Adres»</b> alanını ekleyin. İsterseniz arkasından <b>«Şehir»</b> de ekleyin.</p>',
      setup: mmOpen,
      check: (c) => fields(c).includes('Adres'),
      on: (ev) => ev.type === 'merge-field' && ev.field === 'Adres',
      done: 'Mektubun şablonu hazır.',
    },
    {
      title: 'Sonuçları önizleyin',
      html: '<p><b>👁 Sonuçları önizle</b>\'ye basın. Sonra <b>▶</b> ile sıradaki kişilerin mektuplarına bakın.</p>',
      setup: mmOpen,
      on: (ev) => ev.type === 'merge-preview' && ev.on && ev.index >= 1,
      done: 'Her kişide ad ve adres kendiliğinden değişiyor. Göndermeden önce birkaç tanesine bakmak, hatalı satırı yakalamanın yoludur.',
    },
    {
      title: 'Mektupları oluşturun',
      html: '<p><b>✔ Bitir ve birleştir</b> → <b>📄 Tek tek belgeleri düzenle</b>.</p>',
      setup: mmOpen,
      hint: '“Belgeleri yazdır…” seçeneği hepsini doğrudan yazıcıya gönderir.',
      on: (ev) => ev.type === 'merge-finish',
      done: 'Yeni bir belgede 4 mektup, her biri ayrı sayfada. İsterseniz birine özel not ekleyip yazdırabilirsiniz.',
    },
    rehberSoru({
      title: 'Liste değişirse?',
      html: '<p>Kermese bir komşu daha katıldı. En kolay yol hangisi?</p>',
      opts: ['Hesap tablosuna bir satır ekleyip birleştirmeyi yeniden yapmak', 'Mektubu kopyalayıp adı elle değiştirmek', 'Bütün mektupları baştan yazmak'],
      ok: 0,
      wrong: 'Tek kişi için olur ama liste büyüdükçe hata yapma ihtimali artar.',
      why: 'Şablon ve liste ayrı durduğu için yalnızca listeyi güncellemek yeter. Aynı yöntemle zarf, etiket ve toplu e-posta da hazırlanır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Adres mektup birleştirme:</p>' },
  ],
};

// ------------------------------------------------------------------ Sanal masaüstleri
const tvOpen = (c) => !!c.d.screen.querySelector('.dk-tv');

export const sanalMasaustu = {
  id: 'sanal-masaustu', icon: '🗂', title: 'Sanal masaüstleri ve Görev Görünümü', minutes: 25, stage: 'desktop',
  desc: 'Açık pencereleri görmek, işleri ayrı masaüstlerine bölmek.',
  summary: [
    ['⊞ + Tab ya da görev çubuğundaki ⧉', 'Görev Görünümü'],
    ['＋ Yeni masaüstü (⊞ + Ctrl + D)', 'Boş bir masaüstü daha'],
    ['⊞ + Ctrl + ← / →', 'Masaüstleri arasında geçiş'],
    ['Pencereye sağ tık → Şuraya taşı', 'Pencereyi başka masaüstüne taşır'],
    ['Masaüstündeki ✕', 'Masaüstünü kapatır; pencereler yandakine geçer'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Çok pencere açılınca ekran karışır. Windows\'ta birden çok <b>sanal masaüstü</b> açılabilir: biri iş için (Kelime İşlemci, Hesap Tablosu), biri kişisel işler için (internet, müzik). Masa değiştirmek gibi.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.open('notepad'); c.d.open('calc'); c.d.open('browser'); },
    },
    {
      title: 'Görev Görünümü',
      html: '<p>Görev çubuğunda Ara kutusunun yanındaki <b>üst üste iki kare</b> (⧉) düğmesine tıklayın.</p>',
      mouse: '🖱 Görev çubuğu → ⧉',
      hint: `Kısayolu ${K('⊞', 'Tab')}.`,
      check: tvOpen,
      on: (ev) => ev.type === 'taskview' && ev.open,
      done: 'Açık pencerelerin hepsi yan yana. Birine tıklarsanız ona geçersiniz. Altta masaüstleri var.',
    },
    {
      title: 'Yeni masaüstü',
      html: '<p>Alttaki <b>＋ Yeni masaüstü</b>\'ne tıklayın.</p>',
      setup: (c) => { if (!tvOpen(c)) c.d.taskView(); },
      check: (c) => c.d.vdesks.length > 1,
      on: (ev) => ev.type === 'vd-new',
      done: '<b>Masaüstü 2</b> oluştu ve ona geçildi. Boş: hiçbir pencere yok.',
    },
    {
      title: 'Yeni masaüstünde Paint açın',
      html: '<p>Görev Görünümü açıksa boş yere tıklayıp kapatın. Sonra ⊞ <b>Başlat</b>\'tan <b>Paint</b>\'i açın. Görev çubuğuna bakın: yalnızca Paint var.</p>',
      setup: (c) => { if (c.d.vdesks.length < 2) c.d.newDesk(true); },
      check: (c) => c.d.wins.some((w) => w.app === 'paint' && w.vd >= 1),
      on: (ev, c) => ev.type === 'app-open' && ev.app === 'paint' && c.d.vd >= 1,
      done: 'Not Defteri, Hesap Makinesi ve İnternet kaybolmadı; <b>Masaüstü 1</b>\'de bekliyorlar.',
    },
    {
      title: 'Masaüstü 1\'e dönün',
      html: '<p>⧉ Görev Görünümü\'nü açın ve alttan <b>Masaüstü 1</b>\'e tıklayın.</p>',
      hint: `Kısayolu ${K('⊞', 'Ctrl', '←')}.`,
      check: (c) => c.d.vd === 0 && !tvOpen(c),
      on: (ev) => ev.type === 'vd-switch' && ev.index === 0,
      done: 'İlk masaüstündeki pencereler geri geldi.',
    },
    {
      title: 'Pencereyi taşıyın',
      html: '<p>⧉ Görev Görünümü\'nü açın. <b>Hesap Makinesi</b> penceresine <b>sağ tıklayın</b> → <b>Şuraya taşı</b> → <b>Masaüstü 2</b>.</p>',
      mouse: '🖱 Hesap Makinesi → sağ tık → Şuraya taşı',
      setup: (c) => { if (c.d.vd !== 0) c.d.switchDesk(0, true); },
      check: (c) => c.d.wins.some((w) => w.app === 'calc' && w.vd === 1),
      on: (ev) => ev.type === 'vd-move' && ev.app === 'calc' && ev.to === 1,
      done: 'Hesap Makinesi artık Masaüstü 2\'de, Paint\'in yanında.',
    },
    {
      title: 'Masaüstünü kapatın',
      html: '<p>Görev Görünümü\'nde <b>Masaüstü 2</b>\'nin küçük resminin köşesindeki <b>✕</b>\'e basın.</p>',
      setup: (c) => { if (!tvOpen(c)) c.d.taskView(); },
      check: (c) => c.d.vdesks.length === 1,
      on: (ev) => ev.type === 'vd-close',
      done: 'Masaüstü kapandı ama içindeki <b>Paint ve Hesap Makinesi kapanmadı</b>: Masaüstü 1\'e taşındılar.',
    },
    rehberSoru({
      title: 'Sanal masaüstü ne değildir?',
      html: '<p>Sanal masaüstleri için hangisi <b>yanlıştır</b>?</p>',
      opts: ['Bilgisayarı daha hızlı yapar', 'Pencereleri işlerine göre ayırmaya yarar', 'Masaüstü kapatılınca pencereler yandaki masaüstüne geçer'],
      ok: 0,
      wrong: 'Bu söylenen doğru; derste de gördük. Yanlış olanı arıyoruz.',
      why: 'Sanal masaüstü yalnızca düzen sağlar; programlar arka planda yine çalışır, bellek kullanır. Bilgisayar yavaşsa gereksiz programları kapatmak gerekir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sanal masaüstleri:</p>' },
  ],
};

// ------------------------------------------------------------------ Görev Yöneticisi: sıralama, disk, ağ, yeni görev
const tmOpen = (c) => c.d.ensure('taskmgr');

export const gorevAyrinti = {
  id: 'gorev-ayrinti', icon: '📈', title: 'Görev Yöneticisi: bilgisayarı kim yoruyor?', minutes: 25, stage: 'desktop',
  desc: 'Sütunlara tıklayarak bilgisayarı en çok yoran programı bulmak, tanımadığınız programı fark etmek, Yeni görev çalıştır ile program açmak.',
  summary: [
    ['Sütun başlığına tıklayın', 'Büyükten küçüğe sıralar: en çok kullanan en üste çıkar. Bir daha tıklayınca sıralama kalkar'],
    ['İşlemci', 'Programın çalışma yükü; sürekli yüksekse bilgisayar ağırlaşır'],
    ['Bellek', 'Programın tuttuğu hafıza (MB); tarayıcılar çok tutar'],
    ['Disk ve Ağ', 'Dosya okuma-yazma ve internet kullanımı; tanımadığınız bir programın ağ kullanması şüphelidir'],
    ['▶ Yeni görev çalıştır', 'notepad, calc, mspaint yazarak program açar (menüler kaybolduğunda işe yarar)'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Bilgisayar yavaşladı. Ama <b>hangi program</b> yoruyor? Görev Yöneticisi bunu gösterir: tabloyu sıralayınca en çok kullanan en üste çıkar. Önce birkaç program açtık.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.settings.toolbar = false; c.d.open('browser'); c.d.open('word'); c.d.open('paint'); },
    },
    {
      title: 'Görev Yöneticisi\'ni açın',
      html: `<p>${K('Ctrl', 'Shift', 'Esc')} tuşlarına birlikte basın. Ya da Başlat düğmesine <b>sağ tıklayıp</b> <b>Görev Yöneticisi</b>\'ni seçin.</p>`,
      mouse: '🖱 Başlat → sağ tık → Görev Yöneticisi',
      check: (c) => !!c.d.find('taskmgr'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'taskmgr',
      done: 'Açık programlar ve arka planda çalışanlar listelendi. Sarı zemin ne kadar koyuysa o program o kadar çok kullanıyor.',
    },
    {
      title: 'Belleğe göre sıralayın',
      html: '<p>Tablonun üstündeki <b>Bellek</b> başlığına tıklayın.</p>',
      mouse: '🖱 “Bellek” başlığı',
      setup: tmOpen,
      on: (ev) => ev.type === 'task-sort' && ev.key === 'mem',
      done: 'Liste, en çok bellek kullanan en üstte olacak şekilde sıralandı. Başlıkta ▾ işareti çıktı.',
    },
    rehberSoru({
      title: 'En çok bellek kullanan uygulama',
      html: '<p><b>Uygulamalar</b> bölümüne bakın. En çok bellek kullanan açık program hangisi?</p>',
      opts: ['🌐 İnternet (tarayıcı)', '📝 Not Defteri', '📊 Görev Yöneticisi'],
      ok: 0,
      wrong: 'Bellek sütunundaki sayılara bakın: MB ne kadar büyükse o kadar çok kullanıyor.',
      why: 'Tarayıcılar, özellikle çok sekme açıkken, en çok belleği kullanan programlardır. Bilgisayar yavaşladıysa önce gereksiz sekmeleri kapatın.',
      setup: tmOpen,
    }),
    {
      title: 'İşlemciye göre sıralayın',
      html: '<p>Bu kez <b>İşlemci</b> başlığına tıklayın. <b>Arka plan işlemleri</b> bölümüne bakın: adını bilmediğiniz bir program en üste çıkacak.</p>',
      mouse: '🖱 “İşlemci” başlığı',
      setup: (c) => { c.d.settings.toolbar = true; tmOpen(c); },
      on: (ev) => ev.type === 'task-sort' && ev.key === 'cpu',
      done: '<b>Süper Arama Yardımcısı</b> işlemcinin yaklaşık %34\'ünü kullanıyor. Siz böyle bir program kurmadınız, Windows ile de gelmedi.',
    },
    {
      title: 'İnterneti de kullanıyor mu?',
      html: '<p>Şimdi <b>Ağ</b> başlığına tıklayın. Hangi program internetten en çok veri alıp veriyor?</p>',
      mouse: '🖱 “Ağ” başlığı',
      setup: (c) => { c.d.settings.toolbar = true; tmOpen(c); },
      on: (ev) => ev.type === 'task-sort' && ev.key === 'net',
      done: 'Aynı program interneti de en çok kullananlardan. Tanımadığınız bir programın hem bilgisayarı yorması hem internete bağlanması şüphelidir.',
    },
    rehberSoru({
      title: 'Şüpheli program: ne yaparsınız?',
      html: '<p><b>Süper Arama Yardımcısı</b> tanımadığınız, işlemciyi ve interneti kullanan bir program. Hangisi en doğrusudur?</p>',
      opts: ['Adını internette aratır, güvenli değilse açılışta çalışmasını kapatırım', 'Bilgisayar çalıştığı için dokunmam', 'Bilgisayarı atarım'],
      ok: 0,
      wrong: 'Bu aşırı ya da çok pasif kalıyor. Önce programın ne olduğunu öğrenmek gerekir.',
      why: 'Önce araştırın. Güvenilmezse <b>Başlangıç uygulamaları</b>\'ndan devre dışı bırakın (bu adımı “Program dondu!” dersinde yapmıştınız). Emin değilseniz bir bilene gösterin.',
    }),
    {
      title: 'Yeni görev çalıştır',
      html: '<p>Görev Yöneticisi\'nin üstündeki <b>▶ Yeni görev çalıştır</b>\'a basın, kutuya <b>notepad</b> yazın ve <b>Tamam</b>\'a basın.</p>',
      target: 'notepad',
      setup: tmOpen,
      hint: 'Başlat menüsü ya da görev çubuğu donduğunda programları böyle açabilirsiniz. Açılmazsa adı doğru yazdığınızdan emin olun.',
      on: (ev, c) => {
        if (ev.type !== 'task-run') return false;
        if (ev.app !== 'notepad') { c.warn('Bu kez kutuya notepad yazın (Not Defteri\'nin Windows\'taki adı).'); return false; }
        return true;
      },
      done: 'Not Defteri açıldı. <b>notepad</b> Not Defteri\'nin, <b>calc</b> Hesap Makinesi\'nin, <b>mspaint</b> Paint\'in Windows\'taki adıdır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Görev Yöneticisi ile bilgisayarı yoranı bulmayı öğrendiniz:</p>' },
  ],
};

// ------------------------------------------------------------------ Renkler ve görünüm: vurgu rengi, görev çubuğu, saydamlık
const personal = (c) => { const w = c.d.ensure('settings'); w.api.go('personal'); return w; };
const tgl = (key, on) => (ev) => ev.type === 'toggle' && ev.key === key && ev.on === on;
const defaultLook = (c) => !c.d.settings.accentBars && !c.d.settings.accentTitle && c.d.settings.transparency !== false;

export const gorunumRenk = {
  id: 'gorunum-renk', icon: '🎨', title: 'Renkler: vurgu rengi, görev çubuğu ve saydamlık', minutes: 20, stage: 'desktop',
  desc: 'Vurgu rengini görev çubuğunda ve başlık çubuklarında göstermek, saydamlık efektlerini kapatmak ve her şeyi eski hâline getirmek.',
  summary: [
    ['Ayarlar → Kişiselleştirme → Renkler', 'Vurgu rengi, saydamlık ve renkli çubuklar burada'],
    ['Vurgu rengini görev çubuğunda göster', 'Başlat menüsü ve görev çubuğu seçtiğiniz renge boyanır'],
    ['Vurgu rengini başlık çubuklarında göster', 'Açık olan pencerenin başlığı da aynı renkte olur'],
    ['Saydamlık efektleri', 'Kapatınca Başlat ve görev çubuğu düz renk olur; yazılar daha kolay okunur'],
    ['Eski hâline getirmek', 'Aynı düğmeleri geri çevirmek yeter; hiçbir şey bozulmaz'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Windows\'un görünümünü gözünüze göre ayarlayabilirsiniz: renkli görev çubuğu, renkli pencere başlıkları, yarı saydam ya da düz menüler. Bir şey bozulmaz; hepsini geri alabilirsiniz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.setSetting('accentBars', false); c.d.setSetting('accentTitle', false); c.d.setSetting('transparency', true); },
    },
    {
      title: 'Vurgu rengini seçin',
      html: '<p><b>Ayarlar → Kişiselleştirme</b> açıldı. Aşağı inin, <b>Renkler</b> bölümünde bir <b>vurgu rengi</b> (örneğin kırmızı ya da yeşil) seçin.</p>',
      mouse: '🖱 Renkler → bir renk kutusu',
      setup: personal,
      on: (ev) => ev.type === 'accent',
      done: 'Vurgu rengi değişti. Düğmeler ve seçili öğeler artık bu renkte; bir sonraki adımda görev çubuğunu da boyayacağız.',
    },
    {
      title: 'Görev çubuğunu renklendirin',
      html: '<p><b>Vurgu rengini Başlat menüsünde ve görev çubuğunda göster</b> düğmesini <b>Açık</b> yapın. Ekranın altına bakın.</p>',
      mouse: '🖱 Vurgu rengini Başlat menüsünde ve görev çubuğunda göster → Açık',
      setup: personal,
      check: (c) => !!c.d.settings.accentBars,
      on: tgl('accentBars', true),
      done: 'Görev çubuğu seçtiğiniz renge boyandı. Beğenmediyseniz aynı düğmeyi kapatın.',
    },
    {
      title: 'Başlık çubuklarını renklendirin',
      html: '<p>Şimdi <b>Vurgu rengini başlık çubuklarında göster</b> düğmesini <b>Açık</b> yapın. Ayarlar penceresinin başlığına bakın.</p>',
      setup: personal,
      check: (c) => !!c.d.settings.accentTitle,
      on: tgl('accentTitle', true),
      done: 'Etkin pencerenin başlığı da aynı renkte. Birden çok pencere açıkken hangisinde çalıştığınızı kolay seçersiniz.',
    },
    {
      title: 'Saydamlığı kapatın',
      html: '<p>En üstteki <b>Saydamlık efektleri</b> düğmesini <b>Kapalı</b> yapın. Başlat menüsünü açıp bakın: artık yarı saydam değil.</p>',
      setup: personal,
      check: (c) => c.d.settings.transparency === false,
      on: tgl('transparency', false),
      done: 'Başlat ve görev çubuğu düz renk oldu. Yazılar okunmuyorsa ya da bilgisayar eskiyse bu ayar işe yarar.',
    },
    rehberSoru({
      title: 'Yazılar okunmuyorsa',
      html: '<p>Görev çubuğundaki yazıları arkadaki resimden ayırt edemiyorsunuz. İlk neyi denersiniz?</p>',
      opts: ['Saydamlık efektlerini kapatırım', 'Bilgisayarı satarım', 'Ekranı silerim'],
      ok: 0,
      wrong: 'Bu sorunu çözmez. Ayarlarda bunun için basit bir düğme var.',
      why: 'Saydamlığı kapatınca menüler düz renk olur, yazılar net okunur. Koyu mod ya da daha koyu bir vurgu rengi de yardımcı olur.',
    }),
    {
      title: 'Eski hâline döndürün',
      html: '<p>Üç düğmeyi de ilk hâline getirin: <b>Saydamlık efektleri</b> açık, <b>görev çubuğunda</b> ve <b>başlık çubuklarında vurgu rengi</b> kapalı.</p>',
      setup: personal,
      hint: 'Düğmenin sağındaki yazı “Açık” ya da “Kapalı” der. Saydamlık Açık, öbür ikisi Kapalı olmalı.',
      check: defaultLook,
      on: (ev, c) => ev.type === 'toggle' && defaultLook(c),
      done: 'Her şey eski hâline döndü. Ayarları istediğiniz an böyle geri alabilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Windows\'un görünümünü ayarlamayı öğrendiniz:</p>' },
  ],
};

// ------------------------------------------------------------------ Kelime işlemci: büyük/küçük harf, stiller, cetvel
const DUYURU = '<p>apartman yönetimi duyurusu</p><p>kazan dairesi bakımı</p><p>çarşamba günü kazan dairesinin bakımı yapılacaktır. sıcak su saat 10:00 ile 14:00 arasında verilemeyecektir.</p><p>anlayışınız için teşekkür ederiz.</p>';
const wdK = (c) => c.d.find('word');
const kOpen = (c) => {
  const doc = put(c, 'docs', 'kazan duyurusu.docx', 'file', { html: DUYURU });
  const w = wdK(c);
  if (!w) return maxed(c, 'word', { node: doc.id });
  if (!w.max) c.d.maximize(w);
  return w;
};
const blk = (c, i) => wdK(c)?.api.info().blocks[i]?.text || '';

export const kelimeHarf = {
  id: 'kelime-harf', icon: '🔠', title: 'Kelime işlemci: büyük/küçük harf, stiller, satır aralığı ve cetvel', minutes: 30, stage: 'desktop',
  desc: 'Yanlış yazılmış harfleri tek tıkla düzeltmek (BÜYÜK, küçük, Cümle düzeni), başlık ve alıntı stilleri, satır aralığını açmak, cetveli göstermek.',
  summary: [
    ['Yazıyı seçin → Aa▾', 'BÜYÜK HARF, küçük harf, Cümle düzeni, Her Sözcüğün İlk Harfi Büyük'],
    ['Başlık 3', 'Ara başlıklar için küçük başlık stili'],
    ['Alıntı', 'Girintili, eğik yazı: söz ya da not için'],
    ['Satır aralığı (Giriş sekmesi)', '1,5 ya da 2,0: satırlar arası açılır, uzun yazı daha rahat okunur'],
    ['Görünüm → Cetvel', 'Kenar boşluklarını ve girintiyi ölçmek için cetveli açar'],
    ['Caps Lock yanlışlıkla açıldıysa', 'Yazıyı silmeyin; seçip Aa▾ → küçük harf deyin'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Duyuruyu yazan kişi harfleri hep küçük yazmış; “apartman yönetimi duyurusu” bile küçük harfle başlıyor. Yeniden yazmak yerine <b>Aa▾</b> düğmesiyle düzelteceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); kOpen(c); },
    },
    {
      title: 'Başlığı BÜYÜK HARF yapın',
      html: '<ol class="steps"><li>İlk satırı (<b>apartman yönetimi duyurusu</b>) <b>seçin</b>: farenin sol tuşunu satırın başında basılı tutup sonuna kadar sürükleyin ve bırakın.</li><li>Giriş sekmesinde <b>Aa▾</b> düğmesine basın.</li><li><b>BÜYÜK HARF</b>\'i seçin.</li></ol>',
      mouse: '🖱 İlk satırı seçin → Aa▾ → BÜYÜK HARF',
      setup: kOpen,
      hint: 'Yazı mavi olmuşsa seçilmiştir. Seçim olmazsa “Önce seçin” uyarısı çıkar; yeniden sürükleyin.',
      check: (c) => blk(c, 0) === blk(c, 0).toLocaleUpperCase('tr') && blk(c, 0).length > 3,
      on: (ev, c) => ev.type === 'doc-case' && ev.mode === 'upper' && blk(c, 0) === blk(c, 0).toLocaleUpperCase('tr'),
      done: 'Başlık BÜYÜK HARF oldu. Türkçe harfler de doğru: i → İ, ı → I.',
    },
    {
      title: 'Cümle düzeni',
      html: '<p>Üçüncü paragrafı (<b>çarşamba günü kazan dairesinin…</b>) başından sonuna kadar sürükleyerek seçin ve <b>Aa▾ → Cümle düzeni</b>\'ni seçin. Cümlelerin ilk harfleri büyür.</p>',
      mouse: '🖱 Paragrafı seçin → Aa▾ → Cümle düzeni',
      setup: kOpen,
      check: (c) => /^[A-ZÇĞİÖŞÜ]/.test(blk(c, 2)),
      on: (ev, c) => ev.type === 'doc-case' && ev.mode === 'sentence' && /^[A-ZÇĞİÖŞÜ]/.test(blk(c, 2)),
      done: 'Paragrafın ve her cümlenin ilk harfi büyüdü. Seçeneklerden biri de <b>Her Sözcüğün İlk Harfi Büyük</b>: başlıklar için.',
    },
    {
      title: 'Ara başlık: Başlık 3',
      html: '<p><b>kazan dairesi bakımı</b> satırına tıklayın. Giriş sekmesinde <b>Başlık 3</b> stilini seçin.</p>',
      mouse: '🖱 “kazan dairesi bakımı” → Başlık 3',
      setup: kOpen,
      check: (c) => wdK(c)?.api.info().blocks[1]?.tag === 'H3',
      on: (ev) => ev.type === 'doc-style' && ev.style === 'h3',
      done: 'Ara başlık belirdi. Başlık 1 en büyük, Başlık 2 daha küçük, Başlık 3 en küçük başlıktır.',
    },
    {
      title: 'Alıntı stili',
      html: '<p>Son satıra (<b>anlayışınız için teşekkür ederiz.</b>) tıklayın ve <b>Alıntı</b> stilini seçin.</p>',
      mouse: '🖱 Son satır → Alıntı',
      setup: kOpen,
      check: (c) => wdK(c)?.api.info().blocks.some((b) => b.tag === 'BLOCKQUOTE'),
      on: (ev) => ev.type === 'doc-style' && ev.style === 'blockquote',
      done: 'Satır içeri girdi, eğik ve solunda çizgi var. Söz ve notlar için kullanılır.',
    },
    {
      title: 'Satır aralığını açın',
      html: '<p>Üçüncü paragrafa (<b>Çarşamba günü kazan dairesinin…</b>) tıklayın. Giriş sekmesindeki <b>satır aralığı</b> kutusundan (↕ simgeli açılır liste) <b>1,5</b>\'i seçin.</p>',
      mouse: '🖱 Paragrafa tıklayın → satır aralığı → 1,5',
      setup: kOpen,
      hint: 'Kutu yazı boyutu kutusunun yanındadır; üzerinde “1,15” yazar. Tıklayıp 1,5\'i seçin.',
      check: (c) => parseFloat(wdK(c)?.api.page.children[2]?.style.lineHeight) > 1.6,
      on: (ev) => ev.type === 'doc-format' && ev.cmd === 'lineHeight' && ev.value >= 1.5,
      done: 'Satırlar arası açıldı. Uzun yazıları, özellikle ileri yaştakiler ve uzaktan okuyanlar için daha rahat okunur yapar.',
    },
    {
      title: 'Cetveli açın',
      html: '<p>Üstteki <b>Görünüm</b> sekmesine geçin ve <b>Cetvel</b> kutusunu işaretleyin.</p>',
      mouse: '🖱 Görünüm → Cetvel',
      setup: kOpen,
      check: (c) => !!wdK(c)?.api.info().ruler,
      on: (ev) => ev.type === 'doc-ruler' && ev.on,
      done: 'Sayfanın üstünde cetvel göründü. Kenar boşluklarını ve girintileri ölçmeye yarar. Aynı kutuyla kapatılır.',
    },
    rehberSoru({
      title: 'Caps Lock açık kalmış',
      html: '<p>Yanlışlıkla Caps Lock açık kalmış ve üç paragraf BÜTÜN HARFLERLE yazılmış. En kolay çözüm hangisi?</p>',
      opts: ['Yazıyı seçip Aa▾ → küçük harf (ya da Cümle düzeni)', 'Hepsini silip baştan yazmak', 'Bilgisayarı yeniden başlatmak'],
      ok: 0,
      wrong: 'Bu çok zahmetli ya da işe yaramaz. Word\'de bunun için tek tıklık bir düğme var.',
      why: 'Yazıyı silmenize gerek yok. Seçip <b>Aa▾</b> ile harfleri düzeltebilirsiniz. Cümle düzeni, baş harfleri de kendisi büyütür.',
      setup: kOpen,
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kelime işlemcide harfleri ve stilleri düzeltmeyi öğrendiniz:</p>' },
  ],
};

// ------------------------------------------------------------------ Tarayıcı: Yapışkan Not uzantısı, sık kullanılanlar çubuğu
const brN = (c, url) => maxed(c, 'browser', url ? { url } : {});

export const tarayiciNot = {
  id: 'tarayici-not', icon: '🗒', title: 'Tarayıcı: sayfaya not ve sık kullanılanlar çubuğu', minutes: 25, stage: 'desktop',
  desc: 'Yapışkan Not uzantısıyla bir sayfaya kendinize not bırakmak, sık kullanılanlar çubuğunu açıp kapatmak.',
  summary: [
    ['🧩 → Yeni uzantılar bul → Yapışkan Not', 'Sayfaya not bırakan güvenli, doğrulanmış bir uzantı'],
    ['Araç çubuğundaki 🗒', 'Tıklayınca o sayfa için notunuz açılır; not sayfaya göre saklanır'],
    ['Ctrl + D (☆)', 'Sayfayı sık kullanılanlara ekler'],
    ['Ctrl + Shift + B', 'Sık kullanılanlar çubuğunu gösterir ya da gizler (⋯ menüsünden de olur)'],
    ['Uzantı eklerken', 'Yayımcıya, kullanıcı sayısına ve istenen izinlere bakın'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Bir sayfada gördüğünüz bilgiyi (“fiyatı yarın tekrar bak”) unutmamak için tarayıcıya not bırakabilirsiniz. Bunun için bir <b>uzantı</b> ekleyeceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); brN(c); },
    },
    {
      title: 'Yapışkan Not\'u ekleyin',
      html: '<ol class="steps"><li>Adres çubuğunun sağındaki <b>🧩</b> → <b>Yeni uzantılar bul</b>.</li><li><b>🗒 Yapışkan Not</b>\'a tıklayın. Yayımcıya ve izinlere bakın.</li><li><b>Tarayıcıya ekle</b> → <b>Uzantı ekle</b>.</li></ol>',
      mouse: '🖱 🧩 → Yeni uzantılar bul → Yapışkan Not → Tarayıcıya ekle',
      check: (c) => c.d.settings.ext.note === true,
      on: (ev) => ev.type === 'ext-add' && ev.id === 'note',
      done: 'Adres çubuğunun yanında 🗒 simgesi çıktı. Yalnızca “Notlarınızı bu bilgisayarda saklama” izni istiyor: zararsız.',
    },
    {
      title: 'Not bırakın',
      html: '<ol class="steps"><li>Adres çubuğuna <b>www.hava-durumu.com.tr</b> yazıp Enter\'a basın.</li><li>Araç çubuğundaki <b>🗒</b>\'a tıklayın.</li><li>Kutuya <b>şemsiye al</b> yazın ve <b>💾 Notu kaydet</b>\'e basın.</li></ol>',
      target: 'şemsiye al',
      setup: (c) => { c.d.settings.ext.note = true; brN(c); },
      hint: 'Düğme adres çubuğunun sağında, 🧩\'in yanında.',
      on: (ev, c) => {
        if (ev.type !== 'ext-note') return false;
        if (!ev.text) { c.warn('Önce kutuya bir şey yazın, sonra Notu kaydet\'e basın.'); return false; }
        return true;
      },
      done: 'Not kaydedildi; 🗒 simgesinde küçük bir nokta var. Not, yalnızca bu sayfa için saklanır: başka sitede kutu boş açılır.',
    },
    {
      title: 'Sayfayı sık kullanılanlara ekleyin',
      html: `<p>${K('Ctrl', 'D')} tuşlarına basın ya da adres çubuğundaki <b>☆</b>\'a tıklayın. Sayfanın altında <b>sık kullanılanlar çubuğu</b> çıkar.</p>`,
      setup: (c) => { c.d.settings.ext.note = true; brN(c); },
      on: (ev) => ev.type === 'web-bookmark' && !ev.removed,
      done: 'Sayfa sık kullanılanlara eklendi; çubukta ⭐ ile görünür. Tıklayınca o sayfa açılır.',
    },
    {
      title: 'Çubuğu gizleyin',
      html: `<p>Sık kullanılanlar çubuğu yer kaplıyorsa gizleyebilirsiniz: ${K('Ctrl', 'Shift', 'B')} ya da <b>⋯</b> → <b>Sık kullanılanlar çubuğunu göster/gizle</b>.</p>`,
      mouse: '🖱 ⋯ → Sık kullanılanlar çubuğunu göster/gizle',
      setup: (c) => { c.d.settings.ext.note = true; brN(c); },
      on: (ev) => ev.type === 'web-bmbar' && !ev.on,
      done: 'Çubuk gizlendi. Sık kullanılanlarınız silinmedi; yalnızca görünmüyor.',
    },
    {
      title: 'Çubuğu geri getirin',
      html: `<p>Aynı kısayola (${K('Ctrl', 'Shift', 'B')}) ya da menüdeki aynı maddeye tekrar basın.</p>`,
      setup: (c) => { c.d.settings.ext.note = true; brN(c); },
      on: (ev) => ev.type === 'web-bmbar' && ev.on,
      done: 'Çubuk geri geldi. Aynı düğme hem gösterir hem gizler.',
    },
    rehberSoru({
      title: 'Not nerede saklanır?',
      html: '<p>Yapışkan Not\'a yazdığınız notlar nerede durur?</p>',
      opts: ['Bu bilgisayardaki tarayıcıda', 'Sitenin sahibine gönderilir', 'İnternetteki herkes görebilir'],
      ok: 0,
      wrong: 'Uzantının izni “Notlarınızı bu bilgisayarda saklama” idi: not bilgisayarınızdan çıkmaz.',
      why: 'İzin listesi uzantının neler yapabildiğini söyler. Bu uzantı yalnızca notu bilgisayarınızda saklar. Veri gönderebilen uzantılar, istedikleri izinlerden anlaşılır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarayıcıda sayfaya not bırakmayı öğrendiniz:</p>' },
  ],
};
