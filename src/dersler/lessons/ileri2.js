// 15. hafta: daha da ileri. ZIP ile sıkıştırma/ayıklama, Takvim ve Alarmlar, erişilebilirlik (Büyüteç, Ekran Klavyesi),
// kelime işlemcide adres mektup birleştirme, sanal masaüstleri ve Görev Görünümü.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

// ------------------------------------------------------------------ ZIP
const exDocs = (c) => { const w = c.d.ensure('explorer', { folder: 'docs' }); if (w.api.folder !== 'docs') w.api.go('docs'); return w; };

export const zip = {
  id: 'zip', icon: '🗜', title: 'ZIP: dosyaları sıkıştırmak ve ayıklamak', minutes: 25, stage: 'desktop',
  desc: 'Bir klasörü tek bir ZIP dosyasına sıkıştırmak, içine bakmak, ayıklamak ve e-postayla göndermek.',
  summary: [
    ['Sağ tık → ZIP dosyasına sıkıştır', 'Klasörü ya da dosyayı tek, küçük bir .zip dosyası yapar'],
    ['ZIP\'e çift tık', 'İçinde ne olduğunu gösterir'],
    ['Sağ tık → Tümünü ayıkla', 'Dosyaları normal bir klasöre çıkarır'],
    ['E-posta → 📎 Dosya ekle', 'Klasör eklenemez ama ZIP eklenebilir'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>E-postaya bir <b>klasör</b> eklenemez; on tane dosyayı tek tek eklemek de zahmetlidir.</p>
        <p>Çözüm: dosyaları bir <b>ZIP</b> dosyasında toplamak. ZIP, içindekileri <b>sıkıştırır</b> (daha az yer kaplar) ve hepsini <b>tek dosya</b> yapar. Bavula eşya yerleştirmek gibi.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); exDocs(c); },
    },
    {
      title: 'Klasörü sıkıştırın',
      html: '<p>Dosya Gezgini\'nde <b>Belgeler</b> açık. <b>Faturalar</b> klasörüne <b>sağ tıklayın</b> ve <b>🗜 ZIP dosyasına sıkıştır</b>\'ı seçin.</p>',
      mouse: '🖱 Faturalar → sağ tık → ZIP dosyasına sıkıştır',
      setup: exDocs,
      check: (c) => !!c.d.fs.find('docs', 'Faturalar.zip'),
      on: (ev) => ev.type === 'zip',
      done: 'Yanında <b>🗜 Faturalar.zip</b> belirdi. Klasör de yerinde duruyor; ZIP onun sıkıştırılmış bir kopyasıdır.',
    },
    rehberSoru({
      title: 'ZIP ne işe yarar?',
      html: '<p>Faturaları ZIP\'leyerek ne kazandık?</p>',
      opts: ['Hepsi tek dosya oldu ve daha az yer kaplıyor', 'Faturalar virüslerden temizlendi', 'Dosyalar şifrelendi, kimse açamaz'],
      ok: 0,
      wrong: 'ZIP yalnızca paketler ve küçültür; virüs temizlemez, kendiliğinden şifre de koymaz.',
      why: 'Tek dosya ve daha küçük: e-postayla göndermek, USB belleğe almak kolaylaşır. Dikkat: tanımadığınız birinden gelen ZIP\'in içinde virüs olabilir.',
    }),
    {
      title: 'İçine bakın',
      html: '<p><b>Faturalar.zip</b>\'e <b>çift tıklayın</b>. İçindeki dosyaları ve boyutunun ne kadar küçüldüğünü görün.</p>',
      mouse: '🖱 Faturalar.zip → çift tık',
      setup: exDocs,
      on: (ev) => ev.type === 'zip-open',
      done: 'ZIP\'in içindeki dosyalar görünüyor. Ama bunları değiştirmek için önce <b>ayıklamak</b> gerekir.',
    },
    {
      title: 'Tümünü ayıklayın',
      html: '<p>Açılan pencerede <b>Tümünü ayıkla</b>\'ya basın. (Pencereyi kapattıysanız: ZIP\'e sağ tık → <b>📂 Tümünü ayıkla…</b>)</p>',
      on: (ev) => ev.type === 'unzip',
      done: 'Dosyalar yeni bir klasöre çıkarıldı. Aynı adda klasör olduğu için Windows ona <b>Faturalar (2)</b> adını verdi.',
    },
    {
      title: 'E-postayla gönderin',
      html: `<ol class="steps"><li>⊞ Başlat\'tan <b>E-posta</b>\'yı açın, <b>Yeni posta</b>\'ya basın.</li><li>Kime: <b>elif@ornek.com</b>, Konu: <b>Faturalar</b></li><li><b>📎 Dosya ekle</b> → Belgeler → <b>Faturalar.zip</b></li><li><b>Gönder</b></li></ol>`,
      mouse: '🖱 E-posta → Yeni posta → 📎',
      setup: (c) => { if (!c.d.fs.find('docs', 'Faturalar.zip')) c.d.zipNodes([c.d.fs.find('docs', 'Faturalar').id], 'docs'); },
      hint: 'Ek penceresinin solundan Belgeler\'e tıklayın.',
      on: (ev) => ev.type === 'mail-send' && ev.attachments.some((a) => /\.zip$/i.test(a)),
      done: 'Bütün faturalar tek ekle gitti. Karşı taraf ZIP\'e sağ tıklayıp <b>Tümünü ayıkla</b> diyerek dosyaları açar.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>ZIP:</p>' },
  ],
};

// ------------------------------------------------------------------ Takvim ve Alarmlar
const tkOpen = (c, tab) => { const w = c.d.ensure('takvim', tab ? { tab } : {}); if (tab) w.api.onArgs({ tab }); return w; };

export const takvimDers = {
  id: 'takvim', icon: '📅', title: 'Takvim, alarm ve zamanlayıcı', minutes: 25, stage: 'desktop',
  desc: 'Takvime randevu ve hatırlatıcı eklemek, ilaç saati için alarm kurmak, alarmı kapatmak, mutfakta işe yarayan zamanlayıcıyı kullanmak.',
  summary: [
    ['Takvim → güne tıkla → Kaydet', 'Randevu, doğum günü; isterseniz önceden hatırlatır'],
    ['Alarm → Yeni alarm', 'Her gün aynı saatte çalar (ilaç, uyanma)'],
    ['Alarm anahtarı', 'Silmeden geçici olarak kapatır'],
    ['Zamanlayıcı', 'Geri sayım: çay, yemek, mola'],
    ['Ertele', 'Çalan alarmı 5 dakika sonraya bırakır'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Bilgisayar bir <b>ajanda</b> ve <b>çalar saat</b> gibi de kullanılabilir: randevuları unutmamak, ilaç saatini hatırlamak, fırındaki yemeği kaçırmamak için.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Programı açın',
      html: '<p>⊞ <b>Başlat</b>\'tan <b>📅 Takvim ve Alarmlar</b>\'ı açın. (Başlat\'ta <b>takvim</b> yazmak da olur.)</p>',
      mouse: '🖱 Başlat → Takvim ve Alarmlar',
      check: (c) => !!c.d.find('takvim'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'takvim',
      done: 'Bugünün tarihi renkli kutuda. ◀ ▶ ile aylar arasında gezilir.',
    },
    {
      title: 'Randevu ekleyin',
      html: '<ol class="steps"><li>Takvimde <b>yarına</b> tıklayın.</li><li>Sağdaki kutuya <b>Doktor randevusu</b> yazın, saat olarak <b>10:30</b> seçin.</li><li>Hatırlatıcı <b>15 dk önce</b> kalsın; <b>Kaydet</b>\'e basın.</li></ol>',
      target: 'Doktor randevusu',
      setup: (c) => tkOpen(c, 'cal'),
      on: (ev) => ev.type === 'cal-add' && norm(ev.title).includes('doktor'),
      done: 'Günün altında bir nokta belirdi. Bilgisayar açıksa saatinden 15 dakika önce köşede bir hatırlatma çıkar.',
    },
    {
      title: 'İlaç alarmı kurun',
      html: '<p>Soldan <b>⏰ Alarm</b>\'a geçin. Saati <b>08:00</b> yapın, adına <b>İlaç</b> yazın ve <b>Kaydet</b>\'e basın.</p>',
      setup: (c) => tkOpen(c, 'alarm'),
      on: (ev) => ev.type === 'alarm-add',
      done: 'Alarm her gün 08:00\'de çalacak. Çaldığında <b>Ertele</b> 5 dakika sonra yeniden çaldırır.',
    },
    {
      title: 'Alarmı kapatın',
      html: '<p>Hafta sonu ilaç yok diyelim. Alarmı <b>silmeden</b>, yanındaki anahtara tıklayarak <b>kapatın</b>.</p>',
      setup: (c) => tkOpen(c, 'alarm'),
      on: (ev) => ev.type === 'alarm-toggle' && !ev.on,
      done: 'Alarm soluklaştı: kapalı ama duruyor. Pazartesi aynı anahtarla açarsınız.',
    },
    {
      title: 'Zamanlayıcı',
      html: '<p>Soldan <b>⏱ Zamanlayıcı</b>\'ya geçin ve <b>10 sn</b> düğmesine basın. Geri sayımı izleyin.</p>',
      setup: (c) => tkOpen(c, 'timer'),
      hint: 'Gerçekte “5 dk” ya da kendi yazdığınız süreyi kullanırsınız; burada beklememek için 10 saniye.',
      on: (ev) => ev.type === 'timer-start',
      done: 'Sayıyor…',
    },
    {
      title: 'Süre dolsun',
      html: '<p>Süre dolunca sağ altta bir bildirim çıkar ve (ses açıksa) zil çalar. Bekleyin.</p>',
      setup: (c) => tkOpen(c, 'timer'),
      check: (c) => !!c.d.clock.timer?.done,
      on: (ev) => ev.type === 'ring',
      done: 'Süre doldu! Çay demlemek, ilaç aralığı, bilgisayar başında mola vermek için kullanışlı.',
    },
    rehberSoru({
      title: 'Alarm ne zaman çalar?',
      html: '<p>Bilgisayardaki alarm için hangisi doğru?</p>',
      opts: ['Bilgisayar açıkken ve sesi açıkken çalar', 'Bilgisayar kapalıyken de çalar', 'Yalnızca Takvim programı açıkken çalar'],
      ok: 0,
      wrong: 'Program kapalı olsa da alarm çalar; ama bilgisayarın kendisi kapalıysa çalamaz.',
      why: 'Bilgisayar kapalıysa ya da sesi kısıksa alarm duyulmaz. Önemli ilaçlar için telefonun alarmı daha güvenlidir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Takvim ve Alarmlar:</p>' },
  ],
};

// ------------------------------------------------------------------ Erişilebilirlik: Büyüteç ve Ekran Klavyesi
const access = (c) => { const w = c.d.ensure('settings'); w.api.go('access'); return w; };
const npText = (c) => c.d.find('notepad')?.el.querySelector('textarea')?.value || '';

export const erisilebilirlik = {
  id: 'erisilebilirlik', icon: '♿', title: 'Erişilebilirlik: Büyüteç ve Ekran Klavyesi', minutes: 25, stage: 'desktop',
  desc: 'Ekranı büyüten Büyüteç (görme zorluğu, küçük yazılar) ve fareyle yazılan Ekran Klavyesi (bozuk klavye, dokunmatik ekran).',
  summary: [
    ['⊞ + +', 'Büyüteci açar / daha çok büyütür'],
    ['⊞ + −', 'Küçültür'],
    ['⊞ + Esc', 'Büyüteci kapatır'],
    ['Ayarlar → Erişilebilirlik', 'Büyüteç, ekran klavyesi, metin boyutu'],
    ['Ekran klavyesi', 'Önce yazılacak yere tıklayın, sonra tuşlara'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: '<p>Windows, görme ya da el kullanımı zorluğu olanlar için yardımcı araçlarla gelir. Bunlara <b>erişilebilirlik</b> araçları denir.</p><ul class="big-list"><li>🔍 <b>Büyüteç</b>: ekranı büyütür</li><li>⌨ <b>Ekran Klavyesi</b>: fareyle yazdırır</li></ul>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Büyüteci açın',
      html: '<p><b>Ayarlar → Erişilebilirlik</b> açıldı. <b>🔍 Büyüteç</b> bölümündeki <b>Büyüteci aç</b>\'a basın.</p>',
      mouse: '🖱 Büyüteci aç',
      setup: access,
      hint: `Kısayolu ${K('⊞', '+')}. Başlat'ta “büyüteç” yazmak da olur.`,
      check: (c) => c.d.mag > 1,
      on: (ev) => ev.type === 'magnifier' && ev.on,
      done: 'Her şey iki kat büyüdü. Fareyi ekranın kenarlarına doğru götürün: görüntü fareyi izler.',
    },
    {
      title: 'Daha çok büyütün',
      html: '<p>Üstteki küçük <b>Büyüteç</b> çubuğunda <b>＋</b>\'ya basarak <b>%300</b>\'e çıkarın.</p>',
      on: (ev) => ev.type === 'magnifier' && ev.zoom >= 300,
      done: 'Küçük yazıları okumak, ayrıntıya bakmak için birkaç saniyeliğine büyütüp sonra kapatmak en pratik kullanımdır.',
    },
    {
      title: 'Büyüteci kapatın',
      html: '<p>Büyüteç çubuğundaki <b>✕</b>\'e basın.</p>',
      hint: `Kısayolu ${K('⊞', 'Esc')}.`,
      check: (c) => c.d.mag === 1,
      on: (ev) => ev.type === 'magnifier' && !ev.on,
      done: 'Ekran normale döndü. Sürekli büyük yazı isteyenler için Erişilebilirlik\'teki <b>Metin boyutu</b> daha uygundur.',
    },
    {
      title: 'Ekran klavyesini açın',
      html: '<p>Aynı sayfada <b>⌨ Ekran klavyesi</b> bölümündeki <b>Ekran klavyesini aç</b>\'a basın.</p>',
      setup: access,
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
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Erişilebilirlik:</p>' },
  ],
};

// ------------------------------------------------------------------ Adres mektup birleştirme
const LIST = { A1: 'Ad', B1: 'Adres', C1: 'Şehir', A2: 'Ayşe Kaya', B2: 'Gül Sokak No: 3', C2: 'İzmir', A3: 'Hasan Demir', B3: 'Lale Sokak No: 7', C3: 'Ankara', A4: 'Fatma Ak', B4: 'Nar Sokak No: 1', C4: 'Bursa', A5: 'Mehmet Öz', B5: 'Çam Sokak No: 12', C5: 'İstanbul' };
const LETTER = '<p>Sayın ,</p><p>Adres: </p><p>Mahallemizin geleneksel kermesi bu Pazar saat 11:00\'de okul bahçesinde yapılacaktır. Sizi de aramızda görmekten mutluluk duyarız.</p><p>Saygılarımızla,<br>Kermes Komitesi</p>';
const wdM = (c) => c.d.find('word');
const fields = (c) => wdM(c)?.api.info().fields || [];
const mmOpen = (c) => {
  put(c, 'docs', 'kermes davetlileri.xlsx', 'file', { cells: { ...LIST }, fmt: {}, rules: [] });
  let w = wdM(c);
  if (!w) { w = maxed(c, 'word'); w.api.load({ html: LETTER }); }
  else if (!w.max) c.d.maximize(w);
  return w;
};

export const mektup = {
  id: 'mektup', icon: '✉', title: 'Kelime işlemci: adres mektup birleştirme', minutes: 30, stage: 'desktop',
  desc: 'Bir davet mektubunu, hesap tablosundaki listede bulunan her kişi için adı ve adresi değişecek şekilde otomatik çoğaltmak.',
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
  desc: 'Açık pencereleri tek ekranda görmek, işleri ayrı masaüstlerine bölmek (iş / kişisel), pencereyi başka masaüstüne taşımak.',
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
