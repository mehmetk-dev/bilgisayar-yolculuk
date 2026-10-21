// 10. hafta ek dersi: kermes ilanı (MEB Kelime İşlemci: nesne ekleme). Ekle → WordArt ile süslü başlık,
// Ekle → Metin Kutusu ile çerçeveli bilgi kutusu ve yazının yanından akan sağa yaslı kutu; kaydetme ve baskı önizlemesi.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const DOSYA = 'kermes ilanı.docx';
const HTML = `<p><br></p>
<p style="text-align:center"><b>12 Aralık Cumartesi · 11.00–17.00 · Dernek bahçesi</b></p>
<p>Ev yapımı reçel, tarhana, erişte ve el örgüsü ürünler satılacaktır. Kermesin geliri, kış aylarında ihtiyaç sahibi üyelerimizin yakacak yardımına ayrılacaktır. Bağışlarınızı 10 Aralık akşamına kadar dernek sekreterliğine bırakabilirsiniz.</p>
<p>Herkes davetlidir. Komşularınızı da getirin!</p>
<p><br></p>`;

const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], wordArt: [], textBoxes: [] };
const wa = (c) => (info(c).wordArt || [])[0];
const waYazi = (c) => norm(wa(c)?.text || '') === 'yılbaşı kermesi';
const waOrtada = (c) => waYazi(c) && info(c).blocks.find((b) => norm(b.text) === 'yılbaşı kermesi')?.align === 'center';
const kutu = (c, kind) => (info(c).textBoxes || []).find((x) => x.kind === kind);
const telefon = (c) => { const t = norm(kutu(c, 'basit')?.text || ''); return t.includes('fatma') && t.replace(/\s/g, '').includes('05321112233'); };
const ucretsiz = (c) => norm(kutu(c, 'sag')?.text || '').includes('giriş ücretsiz');

export const kelimeIlan = {
  id: 'kelime-ilan', icon: '🅰', title: 'İlan: Metin Kutusu ve WordArt', minutes: 30, stage: 'desktop',
  desc: 'Duyuruya WordArt ile göz alıcı bir başlık koymak; Metin Kutusu ile çerçeveli bir bilgi kutusu ve yazının yanından akan bir kutu eklemek; baskı önizlemesine bakmak.',
  summary: [
    ['Ekle → WordArt ▾', 'Süslü, gölgeli başlık yazısı. Bir biçim seçin, “Metninizi buraya yazın” yerine yazın'],
    ['Ekle → Metin Kutusu ▾', 'Basit Metin Kutusu: çerçeveli ayrı yazı alanı. Sağa yaslı kutu: yazı yanından akar'],
    [K('Ctrl', 'E'), 'İmlecin olduğu satırı ortalar (WordArt da ortalanır)'],
    ['Yer tutucu yazı', 'Kutu eklenince seçili gelir; yazmaya başlayınca yerine geçer'],
    ['WordArt ne zaman?', 'İlan, afiş, davetiye başlığında. Uzun yazıda ve resmî yazıda kullanmayın'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', { html: HTML }); },
  steps: [
    {
      title: 'Kermes ilanı',
      html: `<p>Dernek, yılbaşı kermesi için panoya asılacak bir <b>ilan</b> hazırlıyor. Bilgiler yazılmış ama ilan uzaktan dikkat çekmiyor.</p>
        <p>En üste <b>WordArt</b> ile göz alıcı bir başlık, ilanın içine de çerçeveli <b>metin kutuları</b> koyacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'WordArt ekleyin',
      html: `<p>Belgenin <b>en üstündeki boş satıra</b> tıklayın.</p>
        <p><b>Ekle</b> sekmesinde <b>WordArt ▾</b> düğmesine basın ve beğendiğiniz bir biçimi seçin.</p>`,
      mouse: '🖱 Üstteki boş satır → Ekle → WordArt ▾ → bir biçim',
      hint: 'WordArt düğmesi Ekle sekmesinin sağ tarafında, Metin Kutusu\'nun yanındadır. Dört biçimden hangisini seçtiğiniz fark etmez.',
      check: (c) => !!wa(c),
      on: (ev, c) => ev.type === 'doc-wordart' && !!wa(c),
      done: 'Sayfaya büyük, süslü bir “Metninizi buraya yazın” yazısı geldi ve <b>seçili</b> duruyor.',
    },
    {
      title: 'Başlığı yazın',
      html: `<p>Yazı seçiliyken doğrudan yazın: <b>YILBAŞI KERMESİ</b></p>
        <p>Büyük harfle yazmak için önce ${K('Caps Lock')} tuşuna bir kez basın, bitince yeniden basıp kapatın.</p>`,
      hint: 'Caps Lock açıkken i harfine basınca İ, ı harfine basınca I çıkar. Seçim kalktıysa eski yazıyı Backspace ile silip yeniden yazın.',
      check: waYazi,
      on: (ev, c) => ev.type === 'doc-input' && waYazi(c),
      done: 'Başlık hazır. WordArt\'ın içindeki yazı her zaman değiştirilebilir: tıklayıp düzeltirsiniz.',
    },
    {
      title: 'Ortalayın',
      html: `<p>İmleç başlıktayken ${K('Ctrl', 'E')} tuşlarına basın (ya da Giriş → Ortala).</p>`,
      combo: ['Ctrl', 'KeyE'],
      hint: 'İmleç WordArt\'ın içinde ya da hemen yanında olmalı. Başlığa bir kez tıklayın, sonra Ctrl + E.',
      check: waOrtada,
      on: (ev, c) => (ev.type === 'doc-format' || ev.type === 'doc-shortcut') && waOrtada(c),
      done: 'WordArt sayfanın ortasına geçti. WordArt da bir satırdaki yazı gibi hizalanır.',
    },
    rehberSoru({
      title: 'WordArt nerede kullanılır?',
      html: '<p>Hangisinde WordArt kullanmak <b>uygun değildir</b>?</p>',
      opts: ['Kermes ilanının başlığında', 'Doğum günü davetiyesinde', 'Kaymakamlığa yazılan dilekçede'], ok: 2,
      wrong: 'İlan ve davetiye dikkat çekmek için yazılır; WordArt orada işe yarar.',
      why: 'Doğru. Dilekçe, tutanak, özgeçmiş gibi resmî yazılarda sade yazı kullanılır; WordArt ciddiyeti bozar.',
    }),
    {
      title: 'Metin Kutusu ekleyin',
      html: `<p>En alttaki <b>boş satıra</b> (“Herkes davetlidir…” satırının altına) tıklayın.</p>
        <p><b>Ekle → ▭ Metin Kutusu ▾ → Basit Metin Kutusu</b>\'nu seçin.</p>`,
      mouse: '🖱 En alttaki boş satır → Ekle → Metin Kutusu ▾ → Basit Metin Kutusu',
      hint: 'Boş satır görünmüyorsa “Komşularınızı da getirin!” yazısının sonuna tıklayıp Enter\'a basın.',
      check: (c) => !!kutu(c, 'basit'),
      on: (ev, c) => ev.type === 'doc-textbox' && !!kutu(c, 'basit'),
      done: 'Çerçeveli bir kutu geldi; içindeki “Metninizi buraya yazın” seçili.',
    },
    {
      title: 'Kutuya yazın',
      html: '<p>Kutuya şunu yazın: <b>Bilgi için Fatma Hanım 0532 111 22 33</b></p>',
      hint: 'Rakamlar harflerin üstündeki sıradadır. Kutudan çıktıysanız kutunun içine tıklayıp yazmaya devam edin.',
      check: telefon,
      on: (ev, c) => ev.type === 'doc-input' && telefon(c),
      done: 'Bilgi kutusu hazır. Çerçeve, okuyanın gözünü telefon numarasına çeker.',
    },
    {
      title: 'Yazının yanına kutu',
      html: `<p>Şimdi uzun paragrafın yanına küçük bir kutu koyalım.</p>
        <p><b>Ev yapımı reçel…</b> paragrafının <b>en başına</b> tıklayın (E harfinin önüne). Sonra <b>Ekle → Metin Kutusu ▾ → Sağa yaslı kutu</b>\'yu seçin ve <b>Giriş ücretsizdir</b> yazın.</p>`,
      mouse: '🖱 Paragrafın başı → Ekle → Metin Kutusu ▾ → Sağa yaslı kutu → yazın',
      hint: 'Kutu sağa yaslanır, paragrafın yazısı solunda akar. Yer tutucu yazı seçiliyken yazmaya başlayın.',
      check: ucretsiz,
      on: (ev, c) => (ev.type === 'doc-input' || ev.type === 'doc-textbox') && ucretsiz(c),
      done: 'Yazı kutunun çevresinden akıyor. Gerçek Word\'de kutunun kenarından tutup sürükleyerek yerini de değiştirebilirsiniz.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'doc-save',
      done: 'İlan kaydedildi.',
    },
    {
      title: 'Baskı önizlemesi',
      html: `<p>Panoya asmadan önce kâğıtta nasıl duracağına bakın: ${K('Ctrl', 'P')}.</p>
        <p>Önizlemeye baktıktan sonra pencereyi <b>İptal</b> ya da ✕ ile kapatabilirsiniz.</p>`,
      combo: ['Ctrl', 'KeyP'],
      hint: 'Ctrl + P imleç sayfanın içindeyken çalışır. Olmazsa Dosya → Yazdır….',
      on: (ev) => ev.type === 'doc-print-open',
      done: 'WordArt ve kutular kâğıtta da görünür. Tek sayfaya sığıyorsa yazdırmaya hazırdır.',
    },
    rehberSoru({
      title: 'Metin kutusu mu?',
      html: '<p>Metin kutusunun sıradan bir paragraftan farkı nedir?</p>',
      opts: ['Yazısı yazdırılınca çıkmaz', 'Çerçeveli ayrı bir alandır; yazının yanına ya da arasına konur, göze çarpar', 'İçine yalnızca rakam yazılır'], ok: 1,
      wrong: 'Metin kutusundaki yazı da yazdırılır ve içine her şey yazılabilir.',
      why: 'Doğru. Duyurudaki “önemli not”, iletişim bilgisi, fiyat gibi öne çıkması gereken kısa yazılar için kullanılır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlanınız panoya hazır:</p>' },
  ],
};
