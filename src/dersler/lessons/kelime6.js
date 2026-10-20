// 10. hafta ek dersi: dernek bülteni (MEB Kelime İşlemci). Başlığa gölgelendirme ve kenarlık (Giriş → Paragraf),
// yalnızca seçili haberleri iki sütuna bölmek (Düzen → Sütunlar), kesme çizgisi için üst kenarlık,
// kayıt formunda noktalı öncülü sekme durağı (Sekmeler: 15 cm, öncü 2) ve Tab.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const DOSYA = 'dernek bülteni.docx';
const HTML = `<p style="text-align:center"><span style="font-size:20pt"><b>ÇINAR EMEKLİLER DERNEĞİ BÜLTENİ</b></span></p>
<p style="text-align:center">Kasım 2026 · Sayı 14</p>
<p><b>Bahar gezisi için kayıtlar başladı.</b> Nisan ayında Bursa'ya iki günlük bir gezi düzenliyoruz. Otobüs, otel ve kahvaltı ücrete dahildir. Ayrıntılar dernek panosunda.</p>
<p><b>Bilgisayar kursu sürüyor.</b> Halk eğitim merkeziyle birlikte açtığımız kursun ikinci dönemi ocak ayında başlıyor. e-Devlet, e-posta ve görüntülü görüşme işleniyor.</p>
<p><b>Sağlık taraması.</b> Aile sağlığı merkezinden gelen ekip 20 Kasım Perşembe günü dernek salonunda tansiyon ve şeker ölçümü yapacak. Ölçüm ücretsizdir.</p>
<p><b>Yeni üyelerimize hoş geldiniz.</b> Bu ay derneğimize on iki yeni üye katıldı. Çay sohbetlerimizde her çarşamba sizi de bekliyoruz.</p>
<p>✂ Gezi kayıt formu: doldurup kesin ve dernek sekreterliğine verin.</p>
<p>Adı Soyadı:</p>
<p>Telefon:</p>
<p>Oda arkadaşı:</p>
<p>İmza:</p>`;
const FORM = ['Adı Soyadı:', 'Telefon:', 'Oda arkadaşı:', 'İmza:'];
const HABER = ['bahar gezisi', 'bilgisayar kursu', 'sağlık taraması', 'yeni üyelerimize'];
const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], layout: {} };
const blok = (c, w) => info(c).blocks.find((b) => norm(b.text).startsWith(norm(w)));
const golge = (c) => { const b = blok(c, 'ÇINAR EMEKLİLER'); return !!b && !!b.shade && b.shade !== 'rgba(0, 0, 0, 0)'; };
const cerceve = (c) => blok(c, 'ÇINAR EMEKLİLER')?.border === 'box';
// Yalnızca dört haber iki sütunda; başlık ve form tek sütunda kalmalı
const sutun = (c) => HABER.every((w) => blok(c, w)?.cols === 2) && !blok(c, 'ÇINAR EMEKLİLER')?.cols && !blok(c, 'Adı Soyadı')?.cols && info(c).layout.cols !== 2;
const kesme = (c) => blok(c, '✂ Gezi kayıt')?.border === 'top' || blok(c, 'Gezi kayıt')?.border === 'top';
// Sekme durağı: 10–16 cm arası, noktalı öncü
const durak = (b) => { const [pos, , lead] = (b?.tabStop || '').split('|'); return +pos >= 10 && +pos <= 16 && lead === 'dot'; };
const duraklar = (c) => FORM.every((w) => durak(blok(c, w)));
const sekmeler = (c, n = 4) => FORM.slice(0, n).every((w) => durak(blok(c, w)) && blok(c, w).tabs >= 1);

export const kelimeBulten = {
  id: 'kelime-bulten', icon: '📰', title: 'Bülten: sütunlar, kenarlık, gölgelendirme ve sekmeler', minutes: 30, stage: 'desktop',
  desc: 'Başlığa gölgelendirme ve kenarlık vermek, yalnızca haberleri iki sütuna bölmek, kesme çizgisi çekmek; kayıt formunda noktalı sekme durağı ile düzgün doldurma satırları.',
  summary: [
    ['Giriş → 🪣 Gölgelendirme', 'Paragrafın arkasını boyar (başlık bandı)'],
    ['Giriş → ▢ Kenarlık', 'Dış Kenarlıklar: çevresine çerçeve · Üst / Alt Kenarlık: tek çizgi'],
    ['Düzen → Sütunlar → İki', 'Önce seçerseniz yalnızca seçilen yazı iki sütun olur; seçmezseniz bütün belge'],
    ['Sekmeler…', 'Sekme durağı konumu (15 cm), hizalama, öncü 2 (.....). Gerçek Word\'de: Paragraf bölümünün sağ altındaki ok → Sekmeler…'],
    [K('Tab'), 'İmleci sekme durağına götürür; öncü seçildiyse arayı noktalarla doldurur'],
    ['Boşluk ya da nokta tuşu', 'Hizalamak için kullanmayın: satırların sonu kayar'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', { html: HTML }); },
  steps: [
    {
      title: 'Dernek bülteni',
      html: `<p>Derneğin aylık bülteni yazılmış ama düz ve sıkıcı. Gazete gibi görünsün istiyoruz: <b>renkli bir başlık bandı</b>, <b>iki sütunlu</b> haberler ve altta kesilip verilecek düzgün bir <b>kayıt formu</b>.</p>
        <p>Bunlar MEB sınavında da sık istenen işlerdir: kenarlık ve gölgelendirme, sütunlar, sekmeler.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'Başlığa gölgelendirme',
      html: `<p>En üstteki <b>ÇINAR EMEKLİLER DERNEĞİ BÜLTENİ</b> satırına bir kez tıklayın.</p>
        <p><b>Giriş</b> sekmesinde <b>🪣 Gölgelendirme</b> düğmesine basın ve <b>açık mavi</b>yi seçin.</p>`,
      mouse: '🖱 Başlık → 🪣 → açık mavi',
      hint: 'Boya kovası (🪣), satır aralığı kutusunun sağındaki Kenarlık düğmesinin hemen yanındadır. Gerçek Word\'de Paragraf bölümünün sağ alt köşesindedir.',
      check: golge,
      on: (ev, c) => ev.type === 'doc-para' && golge(c),
      done: 'Başlığın arkası boyandı: satırın bütün enince bir bant. Vurgu rengi (🖍) yalnızca yazının arkasını boyar, gölgelendirme bütün paragrafı.',
    },
    {
      title: 'Başlığa kenarlık',
      html: '<p>İmleç başlıktayken <b>▢ Kenarlık ▾</b> düğmesine basın ve <b>Dış Kenarlıklar</b>\'ı seçin.</p>',
      hint: 'Kenarlık düğmesi gölgelendirmenin solundadır. Sayfa kenarlığı (Düzen sekmesi) bütün sayfayı çerçeveler; bu yalnızca bir paragrafı.',
      check: cerceve,
      on: (ev, c) => ev.type === 'doc-para' && cerceve(c),
      done: 'Başlık çerçeveye alındı. Gerçek Word\'de en altta <b>Kenarlıklar ve Gölgelendirme…</b> seçeneği de vardır: çizginin kalınlığını, rengini, çift çizgiyi oradan seçersiniz.',
    },
    {
      title: 'Haberleri iki sütuna bölün',
      html: `<p>Dört haber paragrafını seçin: <b>Bahar gezisi…</b> sözcüğünün başından <b>…sizi de bekliyoruz.</b> cümlesinin sonuna kadar sürükleyin.</p>
        <p>Sonra <b>Düzen</b> sekmesinde <b>Sütunlar: ▮▮ İki</b>\'ye basın.</p>`,
      mouse: '🖱 Dört haberi seçin → Düzen → İki',
      hint: 'Seçim başlıktan ya da “✂ Gezi kayıt formu” satırından taşmasın. Yanlış olduysa Ctrl + Z ya da aynı yazıyı seçip “Bir”e basın.',
      check: sutun,
      on: (ev, c) => {
        if (ev.type === 'doc-layout' && ev.cols === 2) { c.note('Hiçbir şey seçili değilken bastınız: bütün belge iki sütun oldu. “▮ Bir”e basıp geri alın, sonra önce dört haberi seçin.'); return false; }
        if (ev.type !== 'doc-cols') return false;
        if (!sutun(c)) c.note('Seçim tam olmadı: başlık ya da form da sütuna girdi, ya da bir haber dışarıda kaldı. Ctrl + Z yerine aynı yazıyı seçip “▮ Bir”e basın, sonra yeniden deneyin.');
        return sutun(c);
      },
      done: 'Haberler gazete gibi iki sütuna dizildi; başlık ve form olduğu gibi kaldı. Word bunu seçimin önüne ve arkasına görünmez bir <b>bölüm sonu</b> koyarak yapar.',
    },
    rehberSoru({
      title: 'Seçmeden basılsaydı?',
      html: '<p>Hiçbir şey seçmeden, imleç bir haberin içindeyken <b>Sütunlar → İki</b>\'ye basılsaydı ne olurdu?</p>',
      opts: ['Yalnızca o paragraf iki sütun olurdu', 'Bütün belge (başlık ve form da) iki sütun olurdu', 'Hiçbir şey olmazdı'], ok: 1,
      wrong: 'Sütunlar paragrafa değil bölüme uygulanır. Belgede tek bölüm varsa o da bütün belgedir.',
      why: 'Doğru. Bu yüzden önce yazıyı seçin; Word seçimi kendi bölümüne ayırır ve yalnızca onu sütunlara böler.',
    }),
    {
      title: 'Kesme çizgisi',
      html: '<p><b>✂ Gezi kayıt formu…</b> satırına tıklayın. <b>Giriş → ▢ Kenarlık ▾ → Üst Kenarlık</b>\'ı seçin.</p>',
      hint: 'Satırın üstünde boydan boya bir çizgi çıkar. Okuyan kişi formu bu çizgiden keser.',
      check: kesme,
      on: (ev, c) => ev.type === 'doc-para' && kesme(c),
      done: 'Formun üstüne bir çizgi çekildi. Alt çizgi tuşuna (_) basıp durarak çizgi yapmayın; satır kayar, yazdırınca bozulur.',
    },
    {
      title: 'Sekme durağı',
      html: `<p>Formun dört satırını seçin: <b>Adı Soyadı:</b>\'ndan <b>İmza:</b>\'ya kadar.</p>
        <p><b>Giriş</b> sekmesinde <b>↹ Sekmeler…</b>\'e basın. Açılan kutuda:</p>
        <ul class="big-list"><li><b>Sekme durağı konumu</b>: 15 cm</li><li><b>Öncü</b>: <b>2 ..........</b> (noktalar)</li></ul>
        <p>sonra <b>Tamam</b>.</p>`,
      mouse: '🖱 Dört satır → ↹ Sekmeler… → 15, öncü 2 → Tamam',
      hint: 'Gerçek Word\'de: Giriş → Paragraf bölümünün sağ altındaki küçük ok → açılan pencerenin altındaki Sekmeler… düğmesi. Konumu yazıp öncüyü seçtikten sonra önce Ayarla, sonra Tamam.',
      check: duraklar,
      on: (ev, c) => {
        if (ev.type !== 'doc-tabstop') return false;
        if (ev.leader !== 'dot') c.note('Öncü olarak “2 ..........” seçilmedi. Sekmeler… kutusunu yeniden açıp Öncü\'yü 2 yapın.');
        else if (!duraklar(c)) c.note('Dört satırın hepsi seçili değildi. Adı Soyadı\'ndan İmza\'ya kadar seçip yeniden deneyin.');
        return duraklar(c);
      },
      done: 'Dört satıra 15 cm\'de bir <b>sekme durağı</b> kondu. Şimdilik görünen bir şey yok; durak, Tab tuşuna bastığınızda işe yarar.',
    },
    {
      title: 'Tab ile noktalar',
      html: `<p><b>Adı Soyadı:</b> satırının <b>sonuna</b> tıklayın ve ${K('Tab')} tuşuna bir kez basın.</p>`,
      keys: ['Tab'],
      hint: 'Tab tuşu klavyenin solunda, Q harfinin solundadır. İmleç iki noktanın (:) hemen arkasında olmalı.',
      check: (c) => sekmeler(c, 1),
      on: (ev, c) => ev.type === 'doc-tab' && sekmeler(c, 1),
      done: 'İmleç 15 cm\'ye atladı ve aradaki boşluk <b>noktalarla</b> doldu. İnsan buraya elle adını yazacak.',
    },
    {
      title: 'Kalan satırlar',
      html: `<p>Aynısını <b>Telefon:</b>, <b>Oda arkadaşı:</b> ve <b>İmza:</b> satırlarına yapın: satırın sonuna tıklayın, ${K('Tab')}.</p>`,
      keys: ['Tab'],
      hint: 'Fazladan Tab\'a bastıysanız Backspace ile silin.',
      check: (c) => sekmeler(c),
      on: (ev, c) => ev.type === 'doc-tab' && sekmeler(c),
      done: 'Dört noktalı satırın hepsi <b>aynı yerde</b> bitiyor. “Adı Soyadı” uzun, “İmza” kısa olsa bile.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'Bülten kaydedildi. Yazdırmadan önce ' + K('Ctrl', 'P') + ' ile önizlemeye bakabilirsiniz.',
    },
    rehberSoru({
      title: 'Neden sekme?',
      html: '<p>Noktaları sekme yerine nokta tuşuna basıp durarak (<b>Adı Soyadı: ..........</b>) yazsaydık ne olurdu?</p>',
      opts: ['Hiçbir fark olmazdı', 'Satırların sonu aynı hizada olmazdı; yazı değişince noktalar kayardı', 'Belge kaydedilemezdi'], ok: 1,
      wrong: 'Ekranda yakın görünebilir ama her harfin eni farklıdır; satırlar aynı yerde bitmez.',
      why: 'Doğru. Sekme durağı satırları milimetrik hizalar. Fiyat listesi, içindekiler, imza yeri gibi her “noktalı satır” böyle yapılır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bülteniniz gazete gibi oldu:</p>' },
  ],
};
