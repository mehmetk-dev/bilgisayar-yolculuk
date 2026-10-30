// 12. hafta ek dersleri: slayt düzenleri ve Slayt Sıralayıcı, SmartArt ile şema ve soy ağacı, animasyon ve süre ayarı,
// aile ve anı albümü sunusu (fotoğraf albümü, müzik, PDF/video çıktısı, bir kâğıda 4 slayt)
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], theme: 'beyaz' };
const slidesOpen = (c, data) => maxed(c, 'slides', data ? { data } : {});
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', ...o });
const evs = ['ppt-input', 'ppt-new-slide', 'ppt-theme', 'ppt-trans', 'ppt-insert', 'ppt-move', 'ppt-delete', 'ppt-select', 'ppt-format', 'ppt-dup', 'ppt-smartart', 'ppt-anim', 'ppt-autotime', 'ppt-album', 'ppt-imgsize', 'ppt-music', 'ppt-view'];
const when = (test) => (ev, c) => evs.includes(ev.type) && !!test(c);

// İki içerikli slaydın sağ listesi (küçük resimden okunur; slayttan ayrılınca da kaybolmaz)
const twoRight = (c) => {
  const i = info(c).slides.findIndex((x) => x.layout === 'two');
  const ul = c.d.find('slides')?.el.querySelectorAll(`.pp-th[data-i="${i}"] .pp-mini ul`)[1];
  return ul ? [...ul.querySelectorAll('li')].map((x) => norm(x.textContent)).filter(Boolean) : [];
};

export const slaytDuzen = {
  id: 'slayt-duzen', icon: '🗂', title: 'Slayt düzenleri, çoğaltma ve Slayt Sıralayıcı', minutes: 30, stage: 'desktop',
  desc: 'Slayt düzeni seçmek, slaytı çoğaltmak, Slayt Sıralayıcı görünümü.',
  summary: [
    ['Yeni Slayt ▾', 'Düzen seçersiniz: Başlık ve içerik, İki içerik, Yalnızca başlık, Fotoğraf ve yazı, Boş'],
    ['⧉ Slaytı Çoğalt', 'Seçili slaydın kopyasını hemen altına ekler'],
    ['Görünüm → Slayt Sıralayıcı', 'Bütün slaytlar küçük resim olarak; sürükleyerek sıra değiştirilir'],
    ['Çift tık (sıralayıcıda)', 'O slaytı düzenlemek için açar'],
    ['Aynı düzen', 'Benzer slaytları sıfırdan yapmayın: çoğaltın, yalnızca yazıyı değiştirin'],
  ],
  steps: [
    {
      title: 'Hazır bir sunu',
      html: `<p>Torunlarınıza <b>“Bahçemizde neler var?”</b> diye bir sunu hazırlıyorsunuz. Başlık slaydı ve bir madde slaydı hazır. Bugün yeni slayt düzenlerini, slayt çoğaltmayı ve Slayt Sıralayıcı'yı öğreneceğiz.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        slidesOpen(c, { theme: 'yesil', slides: [sl('title', { title: 'Bahçemizde Neler Var?', sub: 'Dedenin bahçesi' }), sl('content', { title: 'Sebzeler', body: li('Domates', 'Biber', 'Salatalık') })] });
      },
    },
    {
      title: 'İki içerikli slayt',
      html: `<p><b>Giriş</b> sekmesinde <b>➕ Yeni Slayt</b>'a tıklayıp <b>İki içerik</b>'i seçin. Yan yana iki liste kutusu olan bir slayt gelir. Başlığına <b>Meyve ve çiçek</b> yazın.</p>`,
      hint: 'Yeni Slayt ▾ düğmesi Giriş sekmesinin solunda. Açılan listeden İki içerik.',
      on: when((c) => info(c).slides.some((s) => s.layout === 'two' && norm(s.title).includes('meyve'))),
      done: 'İki sütunlu düzen, “önce – sonra” ya da “meyve – çiçek” gibi karşılaştırmalar içindir.',
    },
    {
      title: 'İki listeyi doldurun',
      html: '<p>Sol kutuya <b>Elma</b>, <b>Armut</b>; sağ kutuya <b>Gül</b>, <b>Papatya</b> yazın (her biri ayrı satır).</p>',
      hint: 'Kutuya tıklayıp yazın, Enter yeni madde açar. Maddeler yan yana iki sütunda görünür.',
      on: when((c) => { const s = info(c).slides.find((x) => x.layout === 'two'); const r = twoRight(c); return s && s.items.length >= 2 && r.length >= 2 && r.some((x) => x.includes('gül')) && r.some((x) => x.includes('papatya')); }),
      check: () => false,
      done: 'İki liste yan yana doldu: solda meyveler, sağda çiçekler.',
    },
    {
      title: 'Slaytı çoğaltın',
      html: `<p>“Sebzeler” slaydına benzeyen bir “Meyveler” slaydı lazım. Sıfırdan yazmak yerine: soldaki listeden <b>Sebzeler</b> slaydına tıklayın ve <b>⧉ Slaytı Çoğalt</b>'a basın. Aynı slaydın bir kopyası hemen altına gelir.</p>`,
      hint: 'Slayt çoğaltma, Giriş sekmesindeki ▲ Yukarı düğmesinin solunda.',
      on: (ev) => ev.type === 'ppt-dup',
      done: 'Kopya hazır. Şimdi başlığını ve maddelerini değiştirmeniz yeter; düzen, renk ve yazı boyutu zaten aynı.',
    },
    {
      title: 'Kopyayı değiştirin',
      html: '<p>Kopyalanan slaydın başlığını <b>Meyveler</b> yapın; maddelerini <b>Elma</b>, <b>Kiraz</b>, <b>Erik</b> olarak değiştirin.</p>',
      hint: 'Başlık kutusuna üç tıkla seçip yazın. Maddeleri de tek tek değiştirin ya da hepsini seçip yeniden yazın.',
      on: when((c) => info(c).slides.some((s) => norm(s.title) === 'meyveler' && s.items.some((x) => norm(x) === 'kiraz'))),
      done: 'Çoğaltıp değiştirmek, benzer slaytları dakikalar yerine saniyelerde hazırlatır.',
    },
    {
      title: 'Slayt Sıralayıcı',
      html: '<p>Üstteki <b>Görünüm</b> sekmesine tıklayın ve <b>▦ Slayt Sıralayıcı</b>\'yı seçin. Bütün slaytlar tek ekranda küçük resim olarak görünür.</p>',
      mouse: '🖱 Görünüm → Slayt Sıralayıcı',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'sorter',
      done: 'Kuşbakışı bakmak, sununun akışını görmenizi sağlar.',
    },
    {
      title: 'Sırayı değiştirin',
      html: '<p>“<b>Meyveler</b>” slaydını fareyle tutup <b>“Sebzeler”</b> slaydının <b>önüne</b> sürükleyip bırakın.</p>',
      hint: 'Küçük resmi basılı tutup başka bir küçük resmin üzerine götürün, bırakın.',
      on: (ev, c) => ev.type === 'ppt-move' && ev.sorter && info(c).slides.findIndex((s) => norm(s.title) === 'meyveler') < info(c).slides.findIndex((s) => norm(s.title) === 'sebzeler'),
      done: 'Slaytların sırası sürükleyerek değişti.',
    },
    {
      title: 'Bir slaydı açın',
      html: '<p>Düzenlemek istediğiniz slayda <b>çift tıklayın</b>: Normal görünüme dönülür ve o slayt açılır.</p>',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'normal' && ev.open !== undefined,
      done: 'Sıralayıcı bakmak ve yerleştirmek için; asıl yazı işi Normal görünümde yapılır.',
    },
    {
      title: 'Fazlalığı silmek, atlamak',
      html: `<ul class="big-list"><li><b>Gereksiz slayt:</b> soldaki listeden slayda tıklayın, ${K('Delete')} tuşuna basın (ya da sağ tık ve <b>Slaytı Sil</b>).</li><li><b>Slayt dursun ama gösteride atlansın:</b> sağ tık ve <b>Slaytı Gizle</b>.</li><li><b>Slayta yeni yazı yeri gerekirse</b> (örneğin Yalnızca başlık düzeninde): gerçek PowerPoint\'te <b>Ekle → Metin Kutusu</b>\'na tıklayın, slaytta bir yere tıklayıp yazın.</li><li><b>Düzen yanlışsa:</b> <b>Giriş → Düzen</b>\'den başka bir düzen seçin; yazılarınız silinmez.</li></ul>`,
    },
    rehberSoru({
      title: 'Hangi yol?',
      html: '<p>Çok benzer iki slayt yapacaksınız; yalnızca başlık ve maddeler değişecek. En hızlı yol?</p>',
      opts: ['İkincisini sıfırdan hazırlamak', 'Birincisini Slaytı Çoğalt ile kopyalayıp yazıyı değiştirmek', 'Maddeleri elle çizmek'], ok: 1,
      wrong: 'Bu uzun sürer. Slaytı kopyalayan bir düğme var.',
      why: 'Doğru: Slaytı Çoğalt. Düzen ve renkler aynı kalır, siz yalnızca yazıyı değiştirirsiniz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Slayt düzenleri ve sıralama:</p>' },
  ],
};

export const smartArt = {
  id: 'smartart', icon: '🌳', title: 'SmartArt ile şema ve aile soy ağacı', minutes: 25, stage: 'desktop',
  desc: 'Maddeleri tek tıkla renkli kutulara ve oklara dönüştürmek (SmartArt).',
  summary: [
    ['Ekle → SmartArt', 'Maddeleri şemaya çevirir; yazıyı değiştirmek için önce listeye dönün'],
    ['Liste (renkli kutular)', 'Birbirinden bağımsız başlıklar'],
    ['Süreç (oklu adımlar)', 'Sıralı işler: 1 ➜ 2 ➜ 3'],
    ['Soy ağacı / şema', 'İlk madde üstte, diğerleri altında dallanır'],
    ['↩ Listeye geri dön', 'Şemayı kapatıp maddeleri yeniden yazılabilir yapar'],
  ],
  steps: [
    {
      title: 'Şema ne işe yarar?',
      html: `<p>Bir listeyi <b>görsel</b> yapmak dinleyicilerin ilgisini artırır. Slayttaki <b>SmartArt</b> maddeleri tek tıkla kutulara, oklara ve ağaca dönüştürür; çizim bilgisi istemez.</p>
        <p>Önünüzde <b>“Ailemiz”</b> slaydı var. Maddelerini soy ağacına çevireceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); slidesOpen(c, { theme: 'beyaz', slides: [sl('content', { title: 'Ailemiz', body: li('Dedem Mehmet', 'Babam Ahmet', 'Halam Ayşe', 'Amcam Ali') })] }); },
    },
    {
      title: 'Renkli kutular',
      html: '<p><b>Ekle</b> sekmesinde <b>🔷 SmartArt</b>\'a tıklayıp <b>Liste (renkli kutular)</b>\'ı seçin.</p>',
      mouse: '🖱 Ekle → SmartArt → Liste',
      on: (ev) => ev.type === 'ppt-smartart' && ev.kind === 'liste' && ev.ok,
      done: 'Dört madde dört renkli kutu oldu.',
    },
    {
      title: 'Süreç okları',
      html: '<p>Şimdi aynı yerden <b>Süreç (oklu adımlar)</b>\'ı seçin. Kutular oklarla birleşir: adım adım işleri anlatmak içindir.</p>',
      on: (ev) => ev.type === 'ppt-smartart' && ev.kind === 'surec' && ev.ok,
      done: 'Dedem ➜ Babam ➜ Halam ➜ Amcam. Soy ağacı için bu uygun değil; bir de “ağaç”a bakalım.',
    },
    {
      title: 'Aile soy ağacı',
      html: '<p><b>Soy ağacı / şema</b>\'yı seçin. <b>İlk madde</b> (Dedem Mehmet) üstte, diğerleri altında dallanır.</p>',
      on: (ev) => ev.type === 'ppt-smartart' && ev.kind === 'agac' && ev.ok,
      done: 'Aile ağacı hazır! Şirket ya da dernek organizasyon şeması da böyle yapılır.',
    },
    {
      title: 'Listeye dönüp değiştirin',
      html: '<p>Bir kişi eksik: <b>Ekle → SmartArt → ↩ Listeye geri dön</b>\'ü seçin, listeye <b>Halam Fatma</b> maddesini ekleyip yeniden <b>Soy ağacı</b> yapın.</p>',
      hint: 'Önce Listeye geri dön, maddeler yazılabilir olur. Son maddenin sonuna tıklayıp Enter ve yeni madde.',
      on: when((c) => { const s = info(c).slides[0]; return s.art === 'agac' && s.items.some((x) => norm(x).includes('fatma')); }),
      done: 'Soy ağacında dört değil beş kişi var. Şemayı değiştirmek için önce listeye dönmek gerekir.',
    },
    {
      title: 'Slayt gösterisinde bakın',
      html: `<p>${K('F5')} ile slayt gösterisini başlatıp ağacı tam ekranda görün; ${K('Esc')} ile çıkın.</p>`,
      combo: ['F5'],
      on: (ev) => ev.type === 'ppt-show-exit',
      done: 'Soy ağacı büyük ekranda net görünür.',
    },
    rehberSoru({
      title: 'Hangi şema?',
      html: '<p>Bir tarifin dört adımını sırayla (1 ➜ 2 ➜ 3 ➜ 4) göstermek istiyorsunuz. Hangi SmartArt uygundur?</p>',
      opts: ['Liste (renkli kutular)', 'Süreç (oklu adımlar)', 'Soy ağacı'], ok: 1,
      wrong: 'Sıra göstermek için oklar gerekir.',
      why: 'Doğru: Süreç. Oklar sıra olduğunu belirtir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Maddeleri şemaya çevirdiniz:</p>' },
  ],
};

export const animasyon = {
  id: 'animasyon', icon: '✨', title: 'Nesnelere animasyon ekleme ve süre ayarı', minutes: 30, stage: 'desktop',
  desc: 'Slayt geçişi ve animasyon farkı; yazıların tek tek gelmesi.',
  summary: [
    ['Geçiş', 'Bir slayttan ötekine geçerkenki hareket (Geçişler sekmesi)'],
    ['Animasyon', 'Slaydın içindeki yazı ve resimlerin ekrana tek tek gelmesi (Animasyonlar sekmesi)'],
    ['Tıklayınca', 'Her maddeyi siz tıklayarak getirirsiniz'],
    ['Kendiliğinden', 'Maddeler 1’er saniye arayla kendi kendine gelir'],
    ['Kendiliğinden ilerle', 'Slayt, verilen süre sonunda sonrakine geçer (3 sn, 5 sn)'],
    ['▶ Önizleme', 'Animasyonu slaytta oynatıp görmenizi sağlar'],
  ],
  steps: [
    {
      title: 'Geçiş mi, animasyon mu?',
      html: `<p>İki ayrı şey var, karıştırılır:</p>
        <ul class="big-list"><li><b>Geçiş</b>: bir slayttan <b>ötekine</b> geçerken olur.</li><li><b>Animasyon</b>: <b>aynı slaydın içinde</b> yazıların, resimlerin tek tek gelmesidir.</li></ul>
        <p>Bu derste animasyon ve slaytları kendi kendine akıtma süresini öğreneceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); slidesOpen(c, { theme: 'mavi', slides: [sl('title', { title: 'Bahçe Takvimi', sub: 'Her mevsim' }), sl('content', { title: 'İlkbahar işleri', body: li('Fideleri dikmek', 'Toprağı çapalamak', 'Sulamayı başlatmak') }), sl('content', { title: 'Yaz işleri', body: li('Sabah sulamak', 'Domatesleri toplamak') })] }); },
    },
    {
      title: 'Animasyon seçin',
      html: '<p>Soldan <b>İlkbahar işleri</b> slaydına tıklayın. <b>Animasyonlar</b> sekmesinde <b>Soldan gel</b>\'e tıklayın.</p>',
      mouse: '🖱 İlkbahar işleri → Animasyonlar → Soldan gel',
      on: (ev, c) => ev.type === 'ppt-anim' && ev.effect === 'left' && norm(info(c).slides[ev.index]?.title || '').includes('ilkbahar'),
      done: 'Bu slaydın maddeleri soldan kayarak gelecek.',
    },
    {
      title: 'Önizleme',
      html: '<p>Animasyonu hemen görmek için <b>▶ Önizleme</b>\'ye tıklayın. Maddeler sırayla soldan gelir.</p>',
      on: (ev) => ev.type === 'ppt-anim-preview',
      done: 'Her madde sırayla ekrana kaydı. Ama gösteride maddeler ne zaman gelecek?',
    },
    {
      title: 'Tıklamayla başlasın',
      html: `<p><b>Başlangıç</b> kutularında <b>Tıklayınca</b> seçili. Bu yüzden gösteride her maddeyi <b>siz tıklayarak</b> getirirsiniz. ${K('F5')} ile gösteriyi başlatıp 2. slaytta her tıklayışta bir maddenin geldiğini görün; sonra ${K('Esc')}.</p>`,
      on: (ev, c) => ev.type === 'ppt-anim-step' && ev.index === 1 && ev.n >= 2,
      done: 'Her tıklayışta bir madde geldi: konuşurken sırayla anlatmak için.',
    },
    {
      title: 'Esc ile çıkın',
      html: `<p>${K('Esc')} tuşuyla gösteriden çıkın.</p>`,
      keys: ['Escape'],
      on: (ev) => ev.type === 'ppt-show-exit',
      done: 'Gösteri kapandı, düzenleme ekranına döndünüz.',
    },
    {
      title: 'Kendiliğinden gelsin',
      html: '<p>Animasyonlar sekmesinde <b>Başlangıç → Kendiliğinden</b>\'i seçin. Bu kez maddeler kimse tıklamadan, 1\'er saniye arayla gelir.</p>',
      on: (ev) => ev.type === 'ppt-anim' && ev.start === 'auto',
      done: 'Sunuyu başka biri izlerken (ya da siz konuşmazken) bu daha kullanışlıdır.',
    },
    {
      title: 'Slayt süresi verin',
      html: `<p><b>Geçişler</b> sekmesinde <b>Kendiliğinden ilerle: 3 sn</b>'yi seçin, sonra <b>Tüm slaytlara uygula</b>'ya basın. Slaytlar kendi kendine akacak.</p>`,
      hint: 'Geçişler sekmesinde, sağ tarafta “Kendiliğinden ilerle” yazan yer.',
      on: (ev) => ev.type === 'ppt-autotime' && ev.all && ev.secs > 0,
      done: 'Her slayt 3 saniye sonra kendiliğinden sonrakine geçecek. Fuarda, vitrinde, aile toplantısında ekranda dönen sunu için ideal.',
    },
    {
      title: 'Gösteriyi izleyin',
      html: `<p>${K('F5')} ile gösteriyi başlatın ve eliniz fareden uzakken bırakın: slaytlar kendiliğinden ilerlemeli. İlk slayttan ikinciye geçince adım tamamlanır.</p>`,
      combo: ['F5'],
      on: (ev) => ev.type === 'ppt-auto-advance',
      done: 'Slayt kendi kendine ilerledi! Esc ile çıkabilirsiniz.',
    },
    rehberSoru({
      title: 'Geçiş mi, animasyon mu?',
      html: '<p>Bir slayttaki maddelerin ekrana <b>tek tek gelmesini</b> istiyorsunuz. Hangisini kullanırsınız?</p>',
      opts: ['Geçişler sekmesi → Solma', 'Animasyonlar sekmesi → Soldan gel', 'Tasarım sekmesi'], ok: 1,
      wrong: 'Geçiş slaytlar arasındaki hareket içindir.',
      why: 'Doğru: Animasyonlar. Geçiş, bir slayttan ötekine geçişin hareketidir; animasyon ise slaydın içindeki maddeleri ve resimleri tek tek getirir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sununuza hareket kattınız:</p>' },
  ],
};

export const anıAlbumu = {
  id: 'ani-albumu', icon: '📸', title: 'Aile ve anı albümü sunusu', minutes: 40, stage: 'desktop',
  desc: 'Fotoğraflardan anı albümü yapmak, müzik eklemek, PDF veya video kaydetmek.',
  summary: [
    ['Ekle → 📸 Fotoğraf Albümü', 'Resimler klasöründeki fotoğraflar için birer slayt'],
    ['Altına yazı', 'Tarih ve kısa not; “Bayram 2026: dedenin bahçesinde”'],
    ['Resim boyutu', 'Küçük / Orta / Büyük: Ekle sekmesinde'],
    ['🎵 Ses', 'Fon müziği; gösteri başlayınca çalar'],
    ['Dosya → PDF olarak kaydet', 'Bilgisayarı olmayanlar da açabilir, WhatsApp’tan gönderilir'],
    ['Dosya → Video olarak kaydet (.mp4)', 'Her slayt kendi süresi kadar gösterilen video olur'],
    ['Bir kâğıda 4 slayt', 'Yazdırırken düzen seçilir; kâğıt tasarrufu'],
  ],
  steps: [
    {
      title: 'Anı albümü',
      html: `<p>Bir yıl boyunca çektiğiniz fotoğraflar klasörlerde bekliyor. Bunları <b>slayt gösterisi</b> yapıp ailenizle seyredebilir, PDF ya da video olarak gönderebilirsiniz. Bu en keyifli sunu türüdür.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        for (const [name, emoji, a, b] of [['bayram sofrası.jpg', '🍽', '#ffe082', '#ffab91'], ['torunum bahçede.jpg', '🧒', '#aed581', '#fff59d'], ['piknik.jpg', '🧺', '#81d4fa', '#c5e1a5']]) if (!c.d.fs.find('pictures', name)) c.d.fs.create('pictures', { type: 'file', name, content: { emoji, bg: [a, b] } });
      },
    },
    {
      title: 'Sunuyu açın',
      html: '<p><b>📙 Sunu</b> açıldı. İlk slayda başlık olarak <b>Aile Albümümüz</b> yazın.</p>',
      setup: (c) => slidesOpen(c),
      on: when((c) => norm(info(c).slides[0]?.title || '').includes('albüm')),
    },
    {
      title: 'Fotoğraf Albümü',
      html: '<p><b>Ekle</b> sekmesinde <b>📸 Fotoğraf Albümü</b>\'ne tıklayın. <b>Resimler</b> klasöründeki fotoğraflar için slaytlar oluşturulur; <b>Albümü oluştur</b>\'a basın.</p>',
      hint: 'Ekle sekmesi, Giriş\'in sağında. Fotoğraf Albümü düğmesi Resim\'in yanında.',
      on: (ev) => ev.type === 'ppt-album' && ev.count >= 3,
      done: 'Her fotoğrafa bir slayt açıldı; başlık, dosyanın adı.',
    },
    {
      title: 'Tarih ve not yazın',
      html: '<p>Fotoğraf slaytlarından <b>en az ikisinin</b> altındaki yazı kutusuna tarih ve not yazın. Örneğin <b>Bayram 2026: hep birlikte</b>. Kutuya tıklayınca yazı yeri açılır.</p>',
      hint: 'Fotoğrafın altındaki “Tarih ve kısa bir not yazın” yazan yere tıklayın. Soldan sırayla slaytlara geçin.',
      on: when((c) => info(c).slides.filter((s) => s.layout === 'photo' && s.sub.length > 4).length >= 2),
      done: 'Notlar, bir sonraki yıl “bu hangi gündü?” diye düşünmenizi önler.',
    },
    {
      title: 'Fotoğraf boyutu',
      html: '<p>Bir fotoğraf slaydı seçin; <b>Ekle</b> sekmesinde <b>Resim boyutu → Büyük</b>\'ü seçin. Fotoğraf slayta daha çok yayılır.</p>',
      hint: 'Önce soldan bir fotoğraf slaydına tıklayın.',
      on: (ev) => ev.type === 'ppt-imgsize' && ev.size === 'L' && ev.hasImg,
      done: 'Fotoğraf büyüdü. Küçük de yapabilirsiniz: yazıyla birlikte dengeli durur.',
    },
    {
      title: 'Müzik ekleyin',
      html: '<p><b>Ekle → 🎵 Ses</b>\'e tıklayın. <b>Müzik</b> klasöründen <b>türkü.mp3</b>\'ü seçin. Gösteri başlayınca müzik çalar.</p>',
      on: (ev) => ev.type === 'ppt-music',
      done: 'Sunu müzikli. Sağ üstte 🔊 türkü.mp3 yazıyor.',
    },
    {
      title: 'Süre verin',
      html: '<p><b>Geçişler</b> sekmesinde <b>Kendiliğinden ilerle → 5 sn</b>\'yi seçin, sonra <b>Tüm slaytlara uygula</b>\'ya basın. Her fotoğraf 5 saniye gösterilir.</p>',
      on: (ev) => ev.type === 'ppt-autotime' && ev.all && ev.secs === 5,
      done: 'Fotoğraflar kendi kendine akacak. Albüm şimdi “film” gibi.',
    },
    {
      title: 'PDF olarak kaydedin',
      html: '<p>Albümü bilgisayarı olmayan komşuya göndermek için <b>Dosya → 📕 PDF olarak kaydet</b>\'i seçin ve <b>Belgeler</b>\'e kaydedin.</p>',
      on: (ev) => ev.type === 'ppt-pdf',
      done: 'PDF hazır: yalnızca okunur, herkesin telefonunda açılır.',
    },
    {
      title: 'Video yapın',
      html: '<p><b>Dosya → 🎬 Video olarak kaydet (.mp4)</b>\'i seçip kaydedin. Slaytlar süreleriyle birlikte video olur.</p>',
      on: (ev, c) => {
        if (ev.type !== 'ppt-video') return false;
        if (!ev.timed) c.warn('Videoda süreler verilmemiş. Geçişler sekmesinden “Kendiliğinden ilerle” seçip yeniden kaydedin.');
        return ev.timed;
      },
      done: 'Video hazır. WhatsApp\'tan göndermek için uygundur.',
    },
    {
      title: 'Bir kâğıda 4 slayt',
      html: `<p>${K('Ctrl', 'P')}'ye basın. Düzen sorulduğunda <b>Bir kâğıda 4 slayt</b>'ı seçin; önizlemede kâğıt sayısını okuyup <b>Yazdır</b>'a tıklayın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'ppt-print' && ev.perPage === 4,
      done: 'Dört slayt tek kâğıda sığdı: kâğıt ve mürekkep tasarrufu.',
    },
    rehberSoru({
      title: 'Hangisi hangisi?',
      html: '<p>Albümü <b>telefonu olan akrabalarınıza WhatsApp\'tan</b> göndereceksiniz. Hangi çıktıyı seçersiniz?</p>',
      opts: ['Yalnızca .pptx (PowerPoint dosyası)', 'PDF ya da video (.mp4)', 'Yazıcıdan çıkarıp kargolamak'], ok: 1,
      wrong: 'Herkesin bilgisayarında PowerPoint olmayabilir.',
      why: 'Doğru: PDF ya da video herkesin telefonunda açılır; .pptx için PowerPoint gerekir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Anı albümünüzü hazırladınız ve paylaşmaya hazırsınız:</p>' },
  ],
};
