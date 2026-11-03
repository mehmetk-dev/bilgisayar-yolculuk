// 12. hafta ek dersleri: slayt düzenleri ve Slayt Sıralayıcı, SmartArt ile şema ve soy ağacı, animasyon ve süre ayarı,
// aile ve anı albümü sunusu (fotoğraf albümü, resmi büyütüp kırpma, müzik, PowerPoint Gösterisi, PDF/video çıktısı, 4 slaytlık dinleyici notu)
import { K, desktopReady, maxed, norm } from './common.js';
import { rehberSoru } from './kalip.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], theme: 'beyaz' };
const slidesOpen = (c, data) => maxed(c, 'slides', data ? { data } : {});
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', ...o });
const evs = ['ppt-input', 'ppt-new-slide', 'ppt-theme', 'ppt-trans', 'ppt-insert', 'ppt-move', 'ppt-delete', 'ppt-select', 'ppt-format', 'ppt-dup', 'ppt-smartart', 'ppt-anim', 'ppt-autotime', 'ppt-album', 'ppt-imgsize', 'ppt-music', 'ppt-view', 'ppt-oanim', 'ppt-hide'];
const when = (test) => (ev, c) => evs.includes(ev.type) && !!test(c);

// İki içerikli slaydın sağ listesi (küçük resimden okunur; slayttan ayrılınca da kaybolmaz)
const twoRight = (c) => {
  const i = info(c).slides.findIndex((x) => x.layout === 'two');
  const ul = c.d.find('slides')?.el.querySelectorAll(`.pp-th[data-i="${i}"] .pp-mini ul`)[1];
  return ul ? [...ul.querySelectorAll('li')].map((x) => norm(x.textContent)).filter(Boolean) : [];
};

export const slaytDuzen = {
  id: 'slayt-duzen', icon: '🗂', title: 'Slayt düzenleri, çoğaltma ve Slayt Sıralayıcı', minutes: 30, stage: 'desktop',
  desc: 'Slayt düzeni seçmek, slaytı çoğaltmak ve gizlemek (sağ tık), Slayt Sıralayıcı görünümü.',
  summary: [
    ['Yeni Slayt ▾', 'Düzen seçersiniz: Başlık ve içerik, İki içerik, Yalnızca başlık, Resim Yazısı ile Resim, Boş'],
    ['Sağ tık → Slaytı Çoğalt', 'Soldaki küçük resme sağ tıklanır; slaydın kopyası hemen altına gelir (' + K('Ctrl', 'D') + ')'],
    ['Sağ tık → Slaytı Sil / Slaytı Gizle', 'Siler / slayt durur ama gösteride atlanır'],
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
      html: `<p>“Sebzeler” slaydına benzeyen bir “Meyveler” slaydı lazım. Sıfırdan yazmak yerine: soldaki listede <b>Sebzeler</b> slaydının küçük resmine <b>sağ tıklayın</b>. Açılan menüden <b>Slaytı Çoğalt</b>'ı seçin. Aynı slaydın bir kopyası hemen altına gelir.</p>`,
      hint: 'Sağ tık: farenin sağ tuşu. Menü açılmadıysa küçük resmin tam üzerine sağ tıklayın. Kısayolu: küçük resme tıklayıp Ctrl + D.',
      on: (ev) => ev.type === 'ppt-dup',
      done: 'Kopya hazır. Şimdi başlığını ve maddelerini değiştirmeniz yeter; düzen, renk ve yazı boyutu zaten aynı.',
    },
    {
      title: 'Kopyayı değiştirin',
      html: '<p>Kopyalanan slaydın başlığını <b>Meyveler</b> yapın; maddelerini <b>Elma</b>, <b>Kiraz</b>, <b>Erik</b> olarak değiştirin.</p>',
      hint: 'Başlık yazısının sonuna tıklayın, Backspace ile silip yeniden yazın. Ya da yazının başına tıklayıp sol tuşu basılı tutarak sonuna kadar sürükleyin (seçilir), sonra yazın.',
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
      title: 'Slaytı gizleyin',
      html: '<p><b>Meyve ve çiçek</b> slaydı dursun ama bu sefer gösterilmesin. Soldaki listede küçük resmine <b>sağ tıklayın</b> ve <b>Slaytı Gizle</b>\'yi seçin.</p>',
      hint: 'Sağ tık menüsünün en altında. Geri açmak için aynı yere yeniden tıklanır.',
      on: (ev, c) => ev.type === 'ppt-hide' && ev.hidden && norm(info(c).slides[ev.index]?.title || '').includes('meyve ve'),
      done: 'Küçük resim soluklaştı, numarasının üstü çizildi. Gösteride (F5) bu slayt atlanır ama silinmez.',
    },
    {
      title: 'Fazlalığı silmek, düzeni değiştirmek',
      html: `<ul class="big-list"><li><b>Gereksiz slayt:</b> soldaki listeden slayda tıklayın, ${K('Delete')} tuşuna basın (ya da sağ tık ve <b>Slaytı Sil</b>).</li><li><b>Slayta yeni yazı yeri gerekirse</b> (örneğin Yalnızca başlık düzeninde): gerçek PowerPoint\'te <b>Ekle → Metin Kutusu</b>\'na tıklayın, slaytta bir yere tıklayıp yazın.</li><li><b>Düzen yanlışsa:</b> <b>Giriş → Düzen</b>\'den başka bir düzen seçin; yazılarınız silinmez.</li></ul>`,
    },
    rehberSoru({
      title: 'Hangi yol?',
      html: '<p>Çok benzer iki slayt yapacaksınız; yalnızca başlık ve maddeler değişecek. En hızlı yol?</p>',
      opts: ['İkincisini sıfırdan hazırlamak', 'Birincisine sağ tıklayıp Slaytı Çoğalt, sonra yazıyı değiştirmek', 'Maddeleri elle çizmek'], ok: 1,
      wrong: 'Bu uzun sürer. Slaytı kopyalamanın bir yolu var.',
      why: 'Doğru: küçük resme sağ tık → Slaytı Çoğalt. Düzen ve renkler aynı kalır, siz yalnızca yazıyı değiştirirsiniz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Slayt düzenleri ve sıralama:</p>' },
  ],
};

export const smartArt = {
  id: 'smartart', icon: '🌳', title: 'SmartArt ile şema ve aile soy ağacı', minutes: 25, stage: 'desktop',
  desc: 'Var olan maddeleri tek tıkla renkli kutulara ve oklara dönüştürmek (Giriş → SmartArt\'a Dönüştür), Metin Bölmesi.',
  summary: [
    ['Giriş → SmartArt\'a Dönüştür', 'Slayttaki maddeleri şemaya çevirir'],
    ['Ekle → SmartArt', 'Boş bir şema ekler; yazıları sonra yazarsınız'],
    ['Metin Bölmesi', 'Şemanın solundaki yazı kutusu; her satır bir kutu, Enter yeni kutu açar'],
    ['Liste (renkli kutular)', 'Birbirinden bağımsız başlıklar'],
    ['Süreç (oklu adımlar)', 'Sıralı işler: 1 ➜ 2 ➜ 3'],
    ['Soy ağacı / şema', 'İlk madde üstte, diğerleri altında dallanır'],
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
      html: '<p><b>Giriş</b> sekmesinde <b>🔷 SmartArt\'a Dönüştür</b>\'e tıklayıp <b>Liste (renkli kutular)</b>\'ı seçin.</p><p class="mut">Gerçek PowerPoint\'te önce maddelerin kutusuna tıklarsınız; SmartArt\'a Dönüştür düğmesi Giriş sekmesinde, Paragraf bölümündedir. Şema türlerinin adları orada farklı olabilir.</p>',
      mouse: '🖱 Giriş → SmartArt\'a Dönüştür → Liste',
      hint: 'Ekle → SmartArt boş bir şema ekler; var olan maddeleri çevirmez. Bu yüzden Giriş sekmesindeki düğmeyi kullanıyoruz.',
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
      title: 'Metin Bölmesi\'nden kişi ekleyin',
      html: '<p>Bir kişi eksik. Şemanın solundaki <b>Metin Bölmesi</b>\'nde son satırın (<b>Amcam Ali</b>) sonuna tıklayın. ' + K('Enter') + '\'a basın ve <b>Halam Fatma</b> yazın.</p>',
      hint: 'Metin Bölmesi, şemanın solundaki beyaz kutu. Yazdıkça şemaya yeni bir kutu eklenir. Gerçek PowerPoint\'te bölme görünmüyorsa şemanın sol kenarındaki küçük oka tıklayın.',
      on: when((c) => { const s = info(c).slides[0]; return s.art === 'agac' && s.items.some((x) => norm(x).includes('fatma')); }),
      done: 'Soy ağacında dört değil beş kişi var. Şemayı bozmadan, yazıyı Metin Bölmesi\'nden değiştirirsiniz.',
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
  desc: 'Slayt geçişi ve animasyon farkı; önce nesneyi seçip efekt vermek, yazıların tek tek gelmesi, slaytlara süre vermek.',
  summary: [
    ['Geçiş', 'Bir slayttan ötekine geçerkenki hareket (Geçişler sekmesi)'],
    ['Animasyon', 'Slaydın içindeki yazı ve resimlerin ekrana tek tek gelmesi (Animasyonlar sekmesi)'],
    ['Önce nesneye tıklayın', 'Nesne seçili değilken Animasyonlar sekmesindeki efektler gri durur, seçilemez'],
    ['Başlangıç: Tıklatıldığında', 'Her maddeyi siz tıklayarak getirirsiniz'],
    ['Başlangıç: Öncekinden Sonra', 'Maddeler kimse tıklamadan, arka arkaya kendiliğinden gelir'],
    ['Geçişler → Sonra:', 'Slayt, yazılan süre sonunda sonrakine geçer (00:03,00 = 3 saniye)'],
    ['Geçişler → Tümüne Uygula', 'Seçili slaydın geçişini ve süresini bütün slaytlara verir'],
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
      html: `<ol class="steps"><li>Soldan <b>İlkbahar işleri</b> slaydına tıklayın.</li><li>Slayttaki <b>maddelerin</b> (Fideleri dikmek…) üzerine bir kez tıklayın.</li><li><b>Animasyonlar</b> sekmesini açıp <b>Giriş</b> öbeğinden <b>Soldan gel</b>\'i seçin.</li></ol>
        <p class="mut">Önce nesneyi seçmek gerekir: hiçbir şey seçili değilken efektler gri durur. Gerçek PowerPoint\'te bu efektin adı farklıdır; bir giriş efekti seçip <b>Efekt Seçenekleri</b>\'nden yönünü (Soldan) seçersiniz.</p>`,
      mouse: '🖱 İlkbahar işleri → maddelere tıkla → Animasyonlar → Soldan gel',
      hint: 'Şeridin sağında “Seçili: Maddeler: …” yazmalı. Yazmıyorsa önce maddelerin üzerine tıklayın.',
      on: (ev, c) => ev.type === 'ppt-oanim' && ev.effect === 'left' && ev.t === 'body' && norm(info(c).slides[ev.index]?.title || '').includes('ilkbahar'),
      done: 'Maddelerin solunda küçük numaralar belirdi: her madde bir tıklamada soldan kayarak gelecek.',
    },
    {
      title: 'Önizleme',
      html: '<p>Animasyonu hemen görmek için <b>▶ Önizleme</b>\'ye tıklayın. Maddeler sırayla soldan gelir.</p>',
      on: (ev) => ev.type === 'ppt-anim-preview',
      done: 'Her madde sırayla ekrana kaydı. Ama gösteride maddeler ne zaman gelecek?',
    },
    {
      title: 'Tıklamayla başlasın',
      html: `<p>Şeritte <b>Başlangıç: Tıklatıldığında</b> seçili. Bu yüzden gösteride her maddeyi <b>siz tıklayarak</b> getirirsiniz. ${K('F5')} ile gösteriyi başlatıp 2. slaytta her tıklayışta bir maddenin geldiğini görün; sonra ${K('Esc')}.</p>`,
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
      html: '<p>Slayttaki maddelere yeniden bir kez tıklayın. <b>Animasyonlar</b> sekmesinde <b>Başlangıç</b>\'ın yanındaki <b>Öncekinden Sonra</b>\'yı seçin. Bu kez maddeler kimse tıklamadan, arka arkaya gelir.</p>',
      hint: 'Başlangıç düğmeleri ancak animasyonu olan bir nesne seçiliyken çalışır. Önce maddelere tıklayın.',
      on: (ev) => ev.type === 'ppt-oanim' && ev.op === 'start' && ev.t === 'body' && ev.start === 'after',
      done: 'Maddelerin numaraları 0 oldu: slayt açılınca kendiliğinden oynayacaklar. Sunuyu başka biri izlerken (ya da siz konuşmazken) bu daha kullanışlıdır.',
    },
    {
      title: 'Slayt süresi verin',
      html: `<p><b>Geçişler</b> sekmesini açın. Sağda <b>Sonraki Slayt</b> bölümünde <b>Sonra:</b> kutusunun yanındaki <b>+</b> düğmesine <b>üç kez</b> basın: kutuda <b>00:03,00</b> (3 saniye) yazsın. Sonra <b>Tümüne Uygula</b>'ya basın.</p>
        <p class="mut">Gerçek PowerPoint'te de Geçişler sekmesinin sağında (Zamanlama bölümü) <b>Sonra:</b> kutusu ve <b>Tümüne Uygula</b> düğmesi vardır. Kutuya süreyi yazabilir ya da küçük oklarla artırabilirsiniz.</p>`,
      hint: 'Süre verince Sonra: kutusu kendiliğinden işaretlenir. Fazla bastıysanız − ile azaltın. En son Tümüne Uygula.',
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
      opts: ['Geçişler sekmesi → Solma', 'Maddelere tıklayıp Animasyonlar sekmesinden bir giriş efekti', 'Tasarım sekmesi'], ok: 1,
      wrong: 'Geçiş slaytlar arasındaki hareket içindir.',
      why: 'Doğru: Animasyonlar. Geçiş, bir slayttan ötekine geçişin hareketidir; animasyon ise slaydın içindeki maddeleri ve resimleri tek tek getirir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sununuza hareket kattınız:</p>' },
  ],
};

export const anıAlbumu = {
  id: 'ani-albumu', icon: '📸', title: 'Aile ve anı albümü sunusu', minutes: 45, stage: 'desktop',
  desc: 'Fotoğraflardan anı albümü yapmak, fotoğrafı büyütüp kırpmak, müzik eklemek, PowerPoint Gösterisi, PDF veya video olarak kaydetmek.',
  summary: [
    ['Ekle → 📸 Fotoğraf Albümü', 'Fotoğraflar için birer slayt'],
    ['Altına yazı', 'Tarih ve kısa not; “Bayram 2026: dedenin bahçesinde”'],
    ['Resmin köşesinden sürüklemek', 'Fotoğraf büyür ya da küçülür (Resim Biçimi → Genişlik de olur)'],
    ['Resim Biçimi → Kırp', 'Kenarlardaki siyah çizgiler içeri çekilir; fazlalık kesilir'],
    ['Ekle → Ses', 'Fon müziği; Kayıttan Yürütme → Arka Planda Yürüt seçilmezse yalnızca o slaytta çalar'],
    ['Farklı Kaydet → PowerPoint Gösterisi (.ppsx)', 'Çift tıklanınca doğrudan gösteri olarak açılır'],
    ['Dosya → Dışarı Aktar → PDF/XPS Belgesi Oluştur', 'Bilgisayarı olmayanlar da açabilir, WhatsApp’tan gönderilir'],
    ['Dosya → Dışarı Aktar → Video Oluştur', 'Her slayt kendi süresi kadar gösterilen video (.mp4) olur'],
    ['Yazdır → Dinleyici Notları: 4 Slayt', 'Bir kâğıda 4 slayt; kâğıt tasarrufu'],
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
      done: 'Her fotoğrafa bir slayt açıldı; başlık, dosyanın adı. Gerçek PowerPoint\'te bir pencere açılır: <b>Dosya/Disk…</b> ile fotoğrafları seçip <b>Oluştur</b>\'a basarsınız; albüm <b>yeni bir sunu</b> olarak açılır.',
    },
    {
      title: 'Tarih ve not yazın',
      html: '<p>Fotoğraf slaytlarından <b>en az ikisinin</b> altındaki yazı kutusuna tarih ve not yazın. Örneğin <b>Bayram 2026: hep birlikte</b>. Kutuya tıklayınca yazı yeri açılır.</p>',
      hint: 'Fotoğrafın altındaki “Tarih ve kısa bir not yazın” yazan yere tıklayın. Soldan sırayla slaytlara geçin.',
      on: when((c) => info(c).slides.filter((s) => s.layout === 'photo' && s.sub.length > 4).length >= 2),
      done: 'Notlar, bir sonraki yıl “bu hangi gündü?” diye düşünmenizi önler.',
    },
    {
      title: 'Fotoğrafı büyütün',
      html: '<p>Bir fotoğraf slaydında <b>fotoğrafın üzerine</b> bir kez tıklayın: köşelerinde beyaz yuvarlaklar belirir. <b>Sağ alt köşedeki</b> yuvarlağı farenin sol tuşuyla basılı tutup dışarı doğru (sağ aşağı) sürükleyin, sonra bırakın.</p>',
      mouse: '🖱 Fotoğrafa tıkla → köşeden tut → dışarı sürükle',
      hint: 'Sürüklemek zor gelirse: fotoğraf seçiliyken üstte çıkan <b>Resim Biçimi</b> sekmesinde Genişlik\'in <b>+</b> düğmesine basın.',
      on: (ev) => ev.type === 'ppt-imgsize' && ev.grow && ev.hasImg,
      done: 'Fotoğraf büyüdü. İçeri doğru sürüklerseniz küçülür. Köşeden çekince fotoğrafın en-boy oranı bozulmaz.',
    },
    {
      title: 'Fotoğrafı kırpın',
      html: '<p>Fotoğraf seçiliyken üstte <b>Resim Biçimi</b> sekmesi var. Ona tıklayın, sonra <b>✂ Kırp</b>\'a basın. Fotoğrafın kenarlarında kalın siyah çizgiler belirir. <b>Sol kenardaki</b> siyah çizgiyi içeri (sağa) doğru biraz sürükleyip bırakın.</p>',
      mouse: '🖱 Resim Biçimi → Kırp → siyah çizgiyi sürükle',
      hint: 'Resim Biçimi sekmesi görünmüyorsa önce fotoğrafa bir kez tıklayın. Bitince Kırp düğmesine yeniden basın ya da fotoğrafın dışına tıklayın.',
      on: (ev) => ev.type === 'ppt-crop' && (ev.l > 0 || ev.r > 0 || ev.t > 0 || ev.b > 0),
      done: 'Fotoğrafın kenarı kesildi. Gerçek PowerPoint\'te de aynıdır: Resim Biçimi → Kırp, siyah çizgileri sürükleyin, sonra resmin dışına tıklayın.',
    },
    {
      title: 'Müzik ekleyin',
      html: '<p>Soldan <b>ilk slayda</b> (Aile Albümümüz) tıklayın. <b>Ekle → 🔊 Ses</b>\'e tıklayın. <b>Müzik</b> klasöründen <b>türkü.mp3</b>\'ü seçin.</p><p class="mut">Gerçek PowerPoint\'te Ekle → Ses → <b>Bilgisayarımdaki Ses…</b> yolunu izlersiniz.</p>',
      hint: 'Ses düğmesi Ekle sekmesinde, Slayt Numarası\'nın yanında.',
      on: (ev) => ev.type === 'ppt-music',
      done: 'Slaytta küçük bir 🔊 simgesi belirdi ve üstte <b>Kayıttan Yürütme</b> sekmesi açıldı. Dikkat: şimdilik müzik <b>yalnızca bu slaytta</b> çalar, sonraki fotoğrafa geçince kesilir.',
    },
    {
      title: 'Bütün albüm boyunca çalsın',
      html: '<p><b>Kayıttan Yürütme</b> sekmesinde <b>🎵 Arka Planda Yürüt</b>\'e tıklayın. Müzik artık bütün fotoğraflar boyunca çalar.</p>',
      hint: 'Kayıttan Yürütme sekmesi, sesin olduğu slayt seçiliyken görünür. Görmüyorsanız soldan ilk slayda tıklayın.',
      on: (ev) => ev.type === 'ppt-music-bg' && ev.bg,
      done: 'Arka Planda Yürüt seçildi: müzik slayt değişince kesilmez, gösteri boyunca çalar; ses simgesi de gösteride gizlenir.',
    },
    {
      title: 'Süre verin',
      html: '<p><b>Geçişler</b> sekmesinde <b>Sonra:</b> kutusunun yanındaki <b>+</b> düğmesine <b>beş kez</b> basın: <b>00:05,00</b> yazsın. Sonra <b>Tümüne Uygula</b>\'ya basın. Her fotoğraf 5 saniye gösterilir.</p>',
      hint: 'Fazla bastıysanız − ile azaltın. Tümüne Uygula, Sonra: kutusunun sağında.',
      on: (ev) => ev.type === 'ppt-autotime' && ev.all && ev.secs === 5,
      done: 'Fotoğraflar kendi kendine akacak. Albüm şimdi “film” gibi.',
    },
    {
      title: 'Gösteri olarak kaydedin',
      html: '<p>Albümü torunlarınıza, açılır açılmaz gösteri olarak başlasın diye göndereceksiniz. <b>Dosya → Farklı Kaydet…</b>\'e tıklayın. <b>Kayıt türü</b> listesinden <b>PowerPoint Gösterisi (*.ppsx)</b>\'i seçip <b>Belgeler</b>\'e kaydedin.</p>',
      hint: 'Kayıt türü, pencerenin altında Dosya adı\'nın hemen altındaki liste.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-save') return false;
        if (!ev.show) { c.note('Sunu (.pptx) olarak kaydedildi. Yeniden Dosya → Farklı Kaydet…, bu kez Kayıt türü: PowerPoint Gösterisi (*.ppsx).'); return false; }
        return true;
      },
      done: '.ppsx dosyasına çift tıklanınca PowerPoint düzenleme ekranı değil, doğrudan slayt gösterisi açılır. Düzenlemek için asıl .pptx dosyanızı saklayın.',
    },
    {
      title: 'PDF olarak kaydedin',
      html: '<p>Albümü bilgisayarı olmayan komşuya göndermek için <b>Dosya</b>\'ya tıklayın, <b>📤 Dışarı Aktar</b>\'ı seçin, sonra <b>📕 PDF/XPS Belgesi Oluştur</b>\'a basın ve <b>Belgeler</b>\'e kaydedin.</p><p class="mut">Gerçek PowerPoint\'te sağda bir kez daha <b>PDF/XPS Oluştur</b> düğmesine basılır; açılan pencerede <b>Yayımla</b> denir. Başka yol: Dosya → Farklı Kaydet → Kayıt türü: PDF.</p>',
      hint: 'Dosya menüsü sol üstte. Dışarı Aktar\'a tıklayınca altında iki seçenek açılır.',
      on: (ev) => ev.type === 'ppt-pdf',
      done: 'PDF hazır: yalnızca okunur, herkesin telefonunda açılır.',
    },
    {
      title: 'Video yapın',
      html: '<p><b>Dosya → 📤 Dışarı Aktar → 🎬 Video Oluştur</b>\'u seçip kaydedin. Slaytlar süreleriyle birlikte video (.mp4) olur.</p><p class="mut">Gerçek PowerPoint\'te ayarların altındaki <b>Video Oluştur</b> düğmesine bir kez daha basılır; video hazırlanırken alttaki çubukta ilerleme görünür.</p>',
      on: (ev, c) => {
        if (ev.type !== 'ppt-video') return false;
        if (!ev.timed) c.warn('Videoda süreler verilmemiş. Geçişler → Sonra: kutusuna süre verip Tümüne Uygula\'ya basın, sonra yeniden deneyin.');
        return ev.timed;
      },
      done: 'Video hazır. WhatsApp\'tan göndermek için uygundur.',
    },
    {
      title: 'Bir kâğıda 4 slayt',
      html: `<p>${K('Ctrl', 'P')}'ye basın. Düzen sorulduğunda <b>Dinleyici Notları: 4 Slayt</b>'ı seçin; önizlemede kâğıt sayısını okuyup <b>Yazdır</b>'a tıklayın.</p>
        <p class="mut">Gerçek PowerPoint'te Yazdır ekranında <b>Tam Sayfa Slaytlar</b> düğmesine basınca bu liste açılır; <b>Dinleyici Notları</b> altında <b>4 Slayt</b>'ı seçersiniz.</p>`,
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
