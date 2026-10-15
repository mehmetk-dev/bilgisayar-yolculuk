// Ek dersler: Takvim randevu ve hatırlatıcı, Ekran Klavyesi, sanal masaüstleri ve Görev Görünümü (5. hafta), adres mektup birleştirme (10. hafta).
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
