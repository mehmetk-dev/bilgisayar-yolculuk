// Programların ileri özellikleri: sıkıştırılmış (zip) dosyalar ve ayrıntılar görünümü (6. hafta), e-postada kişiler,
// imza ve istenmeyen klasörü; büyük dosyayı buluttan paylaşma (9. hafta), şablondan özgeçmiş, üst/alt bilgi (10. hafta),
// şablondan ev bütçesi ve pasta grafiği (11. hafta).
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const ex = (c, folder) => maxed(c, 'explorer', { folder });

export const zip = {
  id: 'zip', icon: '🗜', title: 'Sıkıştırılmış (zip) dosyalar ve ayrıntılar', minutes: 30, stage: 'desktop',
  desc: 'Dosya Gezgini görünümleri, sıralama; zip dosyasını açmak ve klasörü sıkıştırmak.',
  summary: [
    ['☰ Ayrıntılar', 'Dosyaların boyutu, tarihi ve türü sütun sütun'],
    ['Sütun başlığına tık', 'O sütuna göre sıralar (bir daha tık: ters)'],
    ['.zip (🗜)', 'İçinde birden çok dosya olan, küçültülmüş paket'],
    ['Tümünü ayıkla', 'Zip\'in içindekileri normal bir klasöre çıkarır'],
    ['Sağ tık → Sıkıştırılmış (zip) klasöre gönder', 'Klasörü tek dosya yapar (e-postayla göndermek için)'],
    ['Ara kutusu', 'Klasörün içinde (alt klasörler dahil) dosya bulur'],
  ],
  steps: [
    {
      title: 'Dosyaların ayrıntıları',
      html: '<p>Dosya Gezgini dosyaları büyük simgelerle gösterir. Ama bazen <b>ne kadar yer kapladığını</b> ya da <b>ne zaman değiştiğini</b> bilmek gerekir.</p><p>Yandaki pencerede <b>İndirilenler</b> açık.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); ex(c, 'downloads'); },
    },
    {
      title: 'Ayrıntılar görünümü',
      html: '<p>Komut çubuğunun sağındaki <b>☰ Ayrıntılar</b>\'a tıklayın.</p>',
      mouse: '🖱 ☰ Ayrıntılar',
      on: (ev) => ev.type === 'ex-view' && ev.mode === 'details',
      done: 'Artık her dosyanın <b>değiştirme tarihi</b>, <b>türü</b> ve <b>boyutu</b> görünüyor. KB < MB < GB: 1000 KB bir MB, 1000 MB bir GB eder.',
    },
    {
      title: 'En büyük dosya',
      html: '<p>Soldan <b>Resimler</b>\'e geçin ve <b>Boyut</b> sütun başlığına tıklayın (en büyüğü en üste gelene kadar).</p>',
      mouse: '🖱 Resimler → Boyut',
      on: (ev, c) => ev.type === 'ex-sort' && ev.by === 'size' && ev.desc && c.d.find('explorer')?.api.folder === 'pictures',
      done: 'Dosyalar büyükten küçüğe sıralandı. Bilgisayar dolduğunda en çok yer kaplayanları böyle bulursunuz.',
    },
    rehberSoru({
      title: 'Okuyun',
      html: '<p>Resimler klasöründe en çok yer kaplayan dosya hangisi?</p>',
      opts: ['tatil.jpg', 'torunumun düğünü.mp4', 'kedimiz.jpg'],
      ok: 1,
      wrong: 'Boyut sütununda en büyük sayıya bakın (GB ve MB\'ye dikkat).',
      why: 'Doğru: video 850 MB. Videolar fotoğraflardan çok daha büyüktür; bir dakikalık video yüzlerce fotoğraf kadar yer tutabilir.',
    }),
    {
      title: 'Zip dosyasını açın',
      html: '<p>Soldan <b>İndirilenler</b>\'e dönün. <b>🗜 tatil fotoğrafları.zip</b> dosyasına çift tıklayın ve <b>Ayıkla</b>\'ya basın.</p>',
      mouse: '🖱 İndirilenler → tatil fotoğrafları.zip (çift tık) → Ayıkla',
      hint: 'Dosyayı seçip üstteki sarı <b>🗜 Tümünü ayıkla</b> düğmesine de basabilirsiniz.',
      on: (ev) => ev.type === 'zip-extract',
      done: 'Zip\'in içindeki dört fotoğraf <b>“tatil fotoğrafları”</b> adlı normal bir klasöre çıktı. Zip; e-postayla ya da internetten gelen, birçok dosyayı tek pakette taşıyan bir “koli”dir.',
    },
    {
      title: 'Klasörü sıkıştırın',
      html: '<p>Faturalarınızı muhasebeciye tek dosya olarak göndereceksiniz. <b>Belgeler</b>\'e gidin, <b>Faturalar</b> klasörüne <b>sağ tıklayın</b> ve <b>🗜 Sıkıştırılmış (zip) klasöre gönder</b>\'i seçin.</p>',
      mouse: '🖱 Belgeler → Faturalar (sağ tık) → Sıkıştırılmış (zip) klasöre gönder',
      on: (ev) => ev.type === 'zip-make' && /fatura/i.test(ev.name),
      done: '<b>Faturalar.zip</b> oluştu; asıl klasör de yerinde duruyor. E-postaya klasör eklenemez ama zip dosyası eklenebilir.',
    },
    {
      title: 'Dosya arayın',
      html: '<p>Bir dosyanın nerede olduğunu unuttunuz. Soldan <b>Belgeler</b>\'deyken sağ üstteki <b>Ara</b> kutusuna <b>su</b> yazın.</p>',
      target: 'su',
      on: (ev) => ev.type === 'ex-search' && ev.results.some((n) => /su faturası/i.test(n)),
      done: 'Arama, alt klasörlerin içine de bakar: <b>su faturası.pdf</b> Faturalar klasöründe bulundu (altında yazıyor).',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosyaların ayrıntıları ve zip:</p>' },
  ],
};

export const eposta2 = {
  id: 'eposta2', icon: '👥', title: 'E-posta: kişiler, imza ve istenmeyenler', minutes: 30, stage: 'desktop',
  desc: 'İstenmeyen klasöründeki postayı kurtarmak, adres defteri, imza oluşturmak.',
  summary: [
    ['⚠ İstenmeyen', 'Şüpheli postalar buraya düşer; ara sıra kontrol edin'],
    ['✔ İstenmeyen değil', 'Yanlışlıkla oraya düşen postayı Gelen Kutusu\'na alır'],
    ['👥 Kişiler', 'Adres defteri: ad ve e-posta adresi'],
    ['Kime: ilk harfler', 'Kayıtlı adres önerilir'],
    ['⚙ Ayarlar → İmza', 'Her postanın sonuna kendiliğinden eklenen yazı'],
  ],
  steps: [
    {
      title: 'İstenmeyen klasörü',
      html: '<p><b>✉ E-posta</b>\'yı açın ve soldaki <b>⚠ İstenmeyen</b> klasörüne tıklayın. Buraya şüpheli postalar kendiliğinden düşer.</p>',
      mouse: '🖱 E-posta → İstenmeyen',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
      on: (ev) => ev.type === 'mail-folder' && ev.folder === 'spam',
      done: 'İçinde iki posta var: biri gerçekten dolandırıcılık (“1.000.000 TL KAZANDINIZ!!!”), diğeri ise belediyeden gelen gerçek bir duyuru.',
    },
    {
      title: 'Gerçek postayı kurtarın',
      html: '<p><b>Perşembe günü planlı su kesintisi</b> postasını açın. Gönderen adresi <b>belediye.bel.tr</b> (.bel.tr belediyelere verilir). Üstteki <b>✔ İstenmeyen değil</b>\'e basın.</p>',
      mouse: '🖱 Su kesintisi postası → İstenmeyen değil',
      on: (ev) => ev.type === 'mail-notspam' && ev.key === 'belediye',
      done: 'Posta Gelen Kutusu\'na taşındı. Önemli bir posta bekliyorsanız ve gelmediyse önce İstenmeyen klasörüne bakın.',
    },
    {
      title: 'Kişi ekleyin',
      html: '<p>Soldaki <b>👥 Kişiler</b>\'e tıklayın. <b>Yeni kişi</b> bölümüne ad olarak <b>Fatma Teyze</b>, adres olarak <b>fatma@ornek.com</b> yazıp <b>Kaydet</b>\'e basın.</p>',
      target: 'fatma@ornek.com',
      on: (ev) => ev.type === 'mail-contact-add' && ev.email === 'fatma@ornek.com',
      done: 'Fatma Teyze adres defterinizde. Artık adresini ezbere bilmeniz gerekmez.',
    },
    {
      title: 'İmza oluşturun',
      html: '<p>Soldaki <b>⚙ Ayarlar</b>\'a tıklayın. <b>İmza</b> kutusuna adınızı ve (uydurma) telefonunuzu iki satır halinde yazın, <b>Kaydet</b>\'e basın.</p>',
      mouse: '🖱 Ayarlar → İmza → Kaydet',
      on: (ev) => ev.type === 'mail-signature' && ev.text.length >= 3,
      done: 'İmzanız kaydedildi. Yazacağınız her postanın altına kendiliğinden eklenecek.',
    },
    {
      title: 'Kayıtlı kişiye yazın',
      html: '<p><b>✏ Yeni posta</b>\'ya basın. <b>Kime</b> kutusuna yalnızca <b>fat</b> yazın ve çıkan öneriden Fatma Teyze\'nin adresini seçin. Konuya <b>Merhaba</b>, metne kısa bir selam yazıp gönderin. İmzanın en altta olduğuna bakın.</p>',
      mouse: '🖱 Yeni posta → Kime: fat… → öneri',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (ev.to !== 'fatma@ornek.com') { c.note('Posta gitti ama Fatma Teyze\'ye değil. Kime kutusuna “fat” yazıp öneriden seçin.'); return false; }
        return true;
      },
      done: 'Gönderildi. Postanın sonuna imzanız eklendi; adresi de tek harf yanlış yazmadan öneriden seçtiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>E-postada düzen:</p>' },
  ],
};

export const bulutPaylas = {
  id: 'bulut-paylas', icon: '☁', title: 'Büyük dosyayı buluttan paylaşmak', minutes: 35, stage: 'desktop',
  desc: 'Büyük videoyu Bulut Depo\'ya yükleyip bağlantıyla paylaşmak.',
  summary: [
    ['E-posta eki sınırı', 'Genellikle 25 MB'],
    ['☁ Bulut Depo → Yükle', 'Dosyayı internetteki deponuza koyar'],
    ['🔗 Paylaş', 'Dosyaya bağlantı (link) oluşturur'],
    ['👥 Yalnızca eklediğim kişiler', 'Bağlantıyı başkası bulsa da açamaz'],
    ['🌐 Bağlantıya sahip herkes', 'Kişisel belgeler için kullanmayın'],
    ['⧉ Bağlantıyı kopyala → Ctrl + V', 'Bağlantıyı postaya yapıştırır'],
  ],
  steps: [
    {
      title: 'Video e-postaya sığmıyor',
      html: '<p>Torununuzun düğün videosunu Elif\'e göndermek istiyorsunuz. <b>✉ E-posta</b>\'yı açın, <b>✏ Yeni posta</b>, <b>Kime</b>: elif@ornek.com. <b>📎 Dosya ekle</b> ile <b>Resimler</b>\'deki <b>torunumun düğünü.mp4</b>\'ü ekleyip <b>Gönder</b>\'e basın.</p>',
      mouse: '🖱 E-posta → Yeni posta → Dosya ekle → Gönder',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
      on: (ev) => ev.type === 'mail-too-big',
      done: 'Gönderilmedi: video <b>850 MB</b>, e-postayla en fazla <b>25 MB</b> gönderilebilir. Çözüm: dosyayı <b>buluta</b> koyup bağlantısını göndermek. Posta penceresini açık bırakın.',
    },
    {
      title: 'Buluta yükleyin',
      html: '<p>⊞ Başlat\'tan <b>☁ Bulut Depo</b>\'yu açın. <b>⬆ Yükle</b>\'ye basın ve <b>Resimler</b>\'den <b>torunumun düğünü.mp4</b>\'ü seçin.</p>',
      mouse: '🖱 Bulut Depo → Yükle → video',
      hint: 'Bulut; dosyalarınızın internette, bir şirketin bilgisayarlarında saklanmasıdır. Başka bilgisayardan, telefondan da açılır.',
      on: (ev) => ev.type === 'cloud-upload' && /düğün/.test(ev.name),
      done: 'Video buluta yüklendi. Sol alttaki çubuk, 15 GB\'lık bulut alanınızın ne kadarının dolduğunu gösterir.',
    },
    {
      title: 'Yalnızca Elif görsün',
      html: `<ol class="steps"><li>Videonun yanındaki <b>🔗 Paylaş</b>\\'a basın.</li><li><b>👥 Yalnızca eklediğim kişiler</b> seçili kalsın.</li><li>Kişi ekle kutusuna <b>elif@ornek.com</b> yazıp <b>Ekle</b>\\'ye basın.</li><li><b>Bağlantı oluştur</b>.</li></ol>`,
      mouse: '🖱 Paylaş → Kişi ekle → Bağlantı oluştur',
      on: (ev, c) => {
        if (ev.type === 'cloud-share' && ev.who === 'anyone') { c.note('“Bağlantıya sahip herkes” seçtiniz. Aile videosu için “Yalnızca eklediğim kişiler” daha güvenli; değiştirip Kaydet\'e basın.'); return false; }
        return ev.type === 'cloud-share' && ev.who === 'people' && ev.people.includes('elif@ornek.com');
      },
      done: 'Paylaşım bağlantısı oluştu. Bağlantı başkasının eline geçse bile yalnızca Elif açabilir.',
    },
    {
      title: 'Bağlantıyı kopyalayın',
      html: '<p><b>⧉ Bağlantıyı kopyala</b>\'ya basın.</p>',
      mouse: '🖱 Bağlantıyı kopyala',
      on: (ev) => ev.type === 'cloud-copy',
      done: 'Bağlantı panoya kopyalandı. Şimdi onu postaya yapıştıracağız.',
    },
    {
      title: 'Postaya yapıştırıp gönderin',
      html: `<p>Görev çubuğundan <b>✉ E-posta</b> penceresine dönün. Ekteki videoyu <b>✕</b> ile çıkarın. Metin kutusuna tıklayıp ${K('Ctrl', 'V')} ile bağlantıyı yapıştırın, konuya <b>Düğün videosu</b> yazıp <b>Gönder</b>.</p>`,
      combo: ['Ctrl', 'KeyV'],
      hint: 'Posta penceresini kapattıysanız yeniden açıp Yeni posta yazın. Bağlantıyı yapıştıramazsanız Bulut Depo\'daki “✉ E-postayla gönder” düğmesini kullanın.',
      on: (ev, c) => {
        if (ev.type === 'mail-too-big') { c.note('Video hâlâ ekli. Ekin yanındaki ✕ ile çıkarın; bağlantı yeterli.'); return false; }
        return ev.type === 'mail-send' && /bulut\.bulalim\.com\/s\//.test(ev.body) && !ev.attachments.length;
      },
      done: 'Gönderildi! Elif bağlantıya tıklayınca videoyu izleyip indirebilecek. Posta küçük kaldı, video bulutta.',
    },
    {
      title: 'Bağlantıyı deneyin',
      html: '<p>Bulut Depo\'da paylaş penceresindeki bağlantıyı kopyaladınız; aynısını tarayıcıda açalım. <b>🌐 İnternet</b>\'i açın, adres çubuğuna tıklayıp <b>Ctrl + V</b> ve Enter.</p>',
      combo: ['Ctrl', 'KeyV'],
      hint: 'Pano boşaldıysa adresi Bulut Depo\'nun paylaş penceresinden okuyup yazabilirsiniz: bulut.bulalim.com/s/…',
      on: (ev) => ev.type === 'web-nav' && ev.host === 'bulut.bulalim.com',
      done: 'Paylaşılan dosyanın sayfası açıldı. Sayfada kimlerin açabileceği yazıyor. İşiniz bitince Bulut Depo\'dan <b>🔒 Paylaşımı kapat</b> diyebilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Büyük dosya paylaşmak:</p>' },
  ],
};

const W = (c) => c.d.find('word')?.api;
const winfo = (c) => W(c)?.info() || { blocks: [], text: '' };
const docEv = ['doc-input', 'doc-format', 'doc-replace', 'doc-hf', 'doc-pagenum', 'doc-new', 'doc-style'];

export const ozgecmis = {
  id: 'ozgecmis', icon: '👤', title: 'Şablondan özgeçmiş (CV)', minutes: 40, stage: 'desktop',
  desc: 'Şablondan özgeçmiş hazırlamak, üst bilgi, sayfa numarası, PDF.',
  summary: [
    ['Dosya → Yeni… → şablon', 'Başlıkları ve düzeni hazır belge'],
    ['[Köşeli parantez]', 'Kendi bilginizle değiştirilecek yer'],
    ['Ctrl + F → [', 'Doldurmayı unuttuğunuz yerleri bulur'],
    ['Ekle → Üst bilgi / Alt bilgi', 'Her sayfanın üstünde / altında tekrarlanan yazı'],
    ['Ekle → Sayfa numarası', 'Alt bilgiye “Sayfa 1 / 2” ekler'],
    ['Dosya → PDF olarak kaydet', 'İş başvurusunda gönderilecek biçim'],
  ],
  steps: [
    {
      title: 'Özgeçmiş nedir?',
      html: '<p><b>Özgeçmiş</b> (CV), iş başvurusunda kendinizi tanıttığınız bir iki sayfalık belgedir: iletişim bilgileri, deneyim, eğitim, beceriler.</p><p>Boş sayfadan başlamak yerine kelime işlemcinin <b>şablonunu</b> kullanacağız.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word'); },
    },
    {
      title: 'Şablonu açın',
      html: '<p>Kelime İşlemci\'de <b>Dosya</b> → <b>📄 Yeni…</b>\'ye tıklayın ve <b>👤 Özgeçmiş (CV)</b>\'yi seçin.</p>',
      mouse: '🖱 Dosya → Yeni… → Özgeçmiş',
      on: (ev) => ev.type === 'doc-new' && ev.template === 'cv',
      done: 'Başlıklar, düzen ve renkler hazır. Yapmanız gereken <b>[köşeli parantez]</b> içindekileri kendi bilgilerinizle değiştirmek.',
    },
    {
      title: 'Adınızı yazın',
      html: '<p><b>[Adınız Soyadınız]</b> yazısını fareyle sürükleyerek seçin (köşeli parantezler dahil) ve adınızı soyadınızı yazın. Seçili yazının üstüne yazınca eskisi silinir.</p>',
      hint: 'Satıra üç kez hızlıca tıklamak da bütün satırı seçer.',
      on: (ev, c) => docEv.includes(ev.type) && !winfo(c).blocks[0]?.text.includes('[') && winfo(c).blocks[0]?.text.length >= 3,
      done: 'Başlık sizin adınız oldu; biçimi (büyük, ince yazı) bozulmadı.',
    },
    {
      title: 'İletişim ve Hakkımda',
      html: '<p>Aynı yolla ikinci satırdaki <b>[Telefon]</b>, <b>[E-posta]</b>, <b>[Şehir]</b> yerlerini ve <b>Hakkımda</b> altındaki paragrafı doldurun (uydurma bilgi de olur).</p>',
      on: (ev, c) => { if (!docEv.includes(ev.type)) return false; const b = winfo(c).blocks; const h = b.findIndex((x) => norm(x.text) === 'hakkımda'); return b[1] && !b[1].text.includes('[') && h > 0 && b[h + 1] && !b[h + 1].text.includes('[') && b[h + 1].text.length > 15; },
      done: 'Hakkımda bölümü en çok okunan yerdir: kısa, olumlu ve net olsun.',
    },
    {
      title: 'Unutulan yerleri bulun',
      html: `<p>Uzun belgede doldurmayı unuttuğunuz yer kalmasın: ${K('Ctrl', 'F')} ile <b>Bul</b>\\'u açın ve <b>[</b> yazıp <b>Sonrakini bul</b>\\'a basın. Bulunan her yeri doldurun ya da o satırı silin. Hiç <b>[</b> kalmayınca adım tamamlanır.</p>`,
      combo: ['Ctrl', 'KeyF'],
      hint: '[ işareti klavyede AltGr + 8 ile yazılır. İstemediğiniz bir satırı (ör. hiç iş deneyiminiz yoksa) seçip Delete ile silebilirsiniz.',
      on: (ev, c) => docEv.includes(ev.type) && !winfo(c).text.includes('['),
      done: 'Belgede doldurulmamış yer kalmadı.',
    },
    {
      title: 'Üst bilgi',
      html: '<p><b>Ekle</b> sekmesinde <b>▔ Üst bilgi</b>\'ye basın ve sayfanın üstünde açılan alana <b>Özgeçmiş</b> yazın.</p>',
      mouse: '🖱 Ekle → Üst bilgi',
      on: (ev) => ev.type === 'doc-hf' && ev.which === 'header' && /özgeçmiş/i.test(ev.text),
      done: 'Üst bilgi her sayfanın en üstünde tekrarlanır. Resmî yazılarda kurum adı, raporlarda belgenin adı yazılır.',
    },
    {
      title: 'Sayfa numarası',
      html: '<p><b>Ekle</b> sekmesinde <b>#️ Sayfa numarası</b>\'na basın. Sayfanın en altına bakın.</p>',
      mouse: '🖱 Ekle → Sayfa numarası',
      on: (ev) => ev.type === 'doc-pagenum' && ev.on,
      done: 'Alt bilgide “Sayfa 1 / 1” çıktı. Belge yazdırılıp sayfalar karışırsa sırası bulunur.',
    },
    {
      title: 'PDF olarak kaydedin',
      html: '<p><b>Dosya → 📕 PDF olarak kaydet…</b> ile <b>Belgeler</b>\'e <b>özgeçmiş</b> adıyla kaydedin.</p>',
      mouse: '🖱 Dosya → PDF olarak kaydet',
      on: (ev) => ev.type === 'doc-pdf',
      done: 'İş başvurularında özgeçmiş genellikle <b>PDF</b> gönderilir: her bilgisayarda aynı görünür, kolayca değiştirilemez.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Şablondan belge hazırlamak:</p>' },
  ],
};

const X = (c) => c.d.find('sheet')?.api;
export const butce = {
  id: 'butce', icon: '💰', title: 'Ev bütçesi ve pasta grafiği', minutes: 35, stage: 'desktop',
  desc: 'Bütçe şablonuyla gelir ve gider yazmak, toplamlar ve pasta grafiği.',
  summary: [
    ['Dosya → Yeni… → Aylık ev bütçesi', 'Formülleri hazır şablon'],
    ['Rakamı değiştirmek', 'Toplam ve kalan kendiliğinden hesaplanır'],
    ['🥧 Pasta grafiği', 'Her kalemin bütünün yüzde kaçı olduğu'],
    ['📊 Sütun grafiği', 'Kalemleri birbiriyle karşılaştırır'],
    ['Ctrl + S', 'Kaydet'],
  ],
  steps: [
    {
      title: 'Bütçe neden tutulur?',
      html: '<p>Ayın sonunu getirmenin yolu paranın <b>nereye gittiğini</b> bilmektir. Hesap tablosundaki <b>bütçe şablonu</b> toplama, çıkarma işlerini sizin yerinize yapar.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'sheet'); },
    },
    {
      title: 'Şablonu açın',
      html: '<p>Hesap Tablosu\'nda <b>Dosya → 📄 Yeni…</b> → <b>💰 Aylık ev bütçesi</b>.</p>',
      mouse: '🖱 Dosya → Yeni… → Aylık ev bütçesi',
      on: (ev) => ev.type === 'xl-new' && ev.template === 'butce',
      done: 'Gelirler, giderler, toplamlar ve <b>KALAN</b> hazır. Kalın yazılı toplam hücrelerinde formül var; onlara dokunmayın.',
    },
    rehberSoru({
      title: 'Okuyun',
      html: '<p>Şablondaki rakamlarla ay sonunda ne kadar para kalıyor? (B18 hücresi)</p>',
      opts: ['18.500 ₺', '3.680 ₺', '14.820 ₺'],
      ok: 1,
      wrong: 'KALAN satırına (18. satır) bakın.',
      why: 'Doğru: 18.500 − 14.820 = 3.680 ₺. Bu hesabı tablo yaptı.',
    }),
    {
      title: 'Market gideri arttı',
      html: '<p>Bu ay market <b>6500</b> tuttu. <b>B10</b> hücresine tıklayın, <b>6500</b> yazıp Enter\'a basın. <b>Toplam gider</b> ve <b>KALAN</b>\'a bakın.</p>',
      target: '6500',
      on: (ev, c) => X(c)?.cell('B10').value === 6500,
      done: 'Siz yalnızca bir rakamı değiştirdiniz; toplam gider ve kalan kendiliğinden yeniden hesaplandı. Formülün gücü budur.',
    },
    {
      title: 'Pasta grafiği',
      html: '<p>Giderlerin adlarını ve tutarlarını seçin: <b>A9</b>\'dan <b>B15</b>\'e kadar fareyle sürükleyin. Sonra şeritteki <b>🥧 Pasta grafiği</b>\'ne tıklayın.</p>',
      mouse: '🖱 A9:B15 seç → Pasta grafiği',
      hint: 'A9 (Kira) hücresine basılı tutup B15 (ilaç tutarı) hücresine kadar sürükleyin. Toplam satırını seçmeyin.',
      on: (ev) => ev.type === 'xl-chart' && ev.kind === 'pie' && /A9/.test(ev.range) && /B15/.test(ev.range),
      check: (c) => X(c)?.chart?.type === 'pie',
      done: 'Pastanın her dilimi bir gider; ne kadar büyükse bütçeden o kadar pay alıyor.',
    },
    rehberSoru({
      title: 'Okuyun',
      html: '<p>Pasta grafiğine göre en büyük gider hangisi?</p>',
      opts: ['Market', 'Elektrik', 'İlaç'],
      ok: 0,
      wrong: 'En büyük dilime ve yanındaki yüzdeye bakın.',
      why: 'Doğru. Kira yerine market en büyük olabilir; tasarruf etmek için önce en büyük dilime bakılır.',
    }),
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Belgeler</b>\\'e <b>bütçe</b> adıyla kaydedin. Gelecek ay aynı dosyayı açıp rakamları değiştirmeniz yeter.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'xl-save',
      done: 'Kaydedildi. Her ay için ayrı bir kopya isterseniz “Farklı kaydet” ile “bütçe ekim”, “bütçe kasım” diye kaydedebilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Ev bütçesi:</p>' },
  ],
};
