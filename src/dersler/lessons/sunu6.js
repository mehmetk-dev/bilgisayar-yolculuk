// 12. hafta ek dersi (MEB Sunu Hazırlama: özel animasyon): kermes duyurusu sunusunda nesnelere tek tek animasyon.
// Giriş, vurgu (Darbe) ve çıkış (Kaybolma) efektleri; Animasyon Ekle ile aynı nesneye ikinci animasyon;
// Animasyon Bölmesi'nde sıra değiştirme ve Oynat; Başlangıç (Tıklatıldığında / Öncekiyle / Öncekinden Sonra), Süre, Gecikme.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [] };
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', notes: '', ...o });

// 2. slayttaki şekiller: 0 eski tarih, 1 yeni tarih, 2 fiyat balonu
const ESKI = 'shp:0', YENI = 'shp:1', FIYAT = 'shp:2';
const KERMES = {
  theme: 'beyaz',
  slides: [
    sl('title', { title: 'Okul Aile Birliği Kermesi', sub: 'Bütün mahalle davetlidir' }),
    sl('content', {
      title: 'Hayır Kermesi',
      body: li('Ev yapımı börek ve tatlılar', 'El işi örgüler', 'Çocuklar için oyunlar'),
      shapes: [
        { kind: 'rect', text: '18 Ekim Cumartesi', fill: '#7f7f7f', x: 62, y: 24, w: 32, h: 13 },
        { kind: 'rect', text: 'Yeni tarih: 25 Ekim', fill: '#70ad47', x: 62, y: 41, w: 32, h: 13 },
        { kind: 'callout', text: 'Bir tabak 50 TL', fill: '#c00000', x: 62, y: 62, w: 32, h: 16 },
      ],
    }),
    sl('only', { title: 'Hepinizi bekleriz!' }),
  ],
};
// 2. slaydın nesne animasyonları
const an = (c) => info(c).slides[1]?.anims || [];
const bul = (c, t, effect) => an(c).find((a) => a.t === t && (!effect || a.effect === effect));
const durum = (test) => ({ check: (c) => !!P(c) && !!test(c), on: (ev, c) => ev.type.startsWith('ppt-') && !!test(c) });
// Seçili nesne yokken giriş efekti eski yolla bütün maddelere uygulanır: öğrenciyi uyarır
const eskiYol = (ev, c) => {
  if (ev.type === 'ppt-anim' && ev.effect !== 'none') c.note('Slaytta hiçbir nesne seçili değildi; efekt bütün maddelere uygulandı. Önce <b>Giriş → Yok</b>\'a basıp geri alın, sonra nesnenin üzerine tıklayıp efekti yeniden seçin.');
  if (ev.type === 'ppt-oanim' && ev.index !== 1) c.note('Bu animasyon başka bir slayda verildi. Soldan 2. slayda (Hayır Kermesi) tıklayıp orada yapın.');
};

export const animasyonBolmesi = {
  id: 'animasyon-bolmesi', icon: '🌟', title: 'Vurgu ve çıkış animasyonları, Animasyon Bölmesi', minutes: 40, stage: 'desktop',
  desc: 'Nesnelere tek tek animasyon vermek; Darbe ile vurgulamak, Kaybolma ile çıkarmak; Animasyon Bölmesi\'nde sırayı düzeltmek; Öncekiyle ve Öncekinden Sonra ile tıklamadan oynatmak.',
  summary: [
    ['Nesneye tıkla → Animasyonlar', 'Efekt yalnızca seçili nesneye (başlık, maddeler, şekil, resim) verilir'],
    ['Giriş (yeşil)', 'Nesne ekrana gelir: Belirme, Soldan gel, Büyüme'],
    ['Vurgu (sarı)', 'Ekrandaki nesne dikkat çeker: Darbe, Döndür, Büyüt/Küçült'],
    ['Çıkış (kırmızı)', 'Nesne ekrandan gider: Kaybolma, Uçarak Çıkma'],
    ['✚ Animasyon Ekle', 'Aynı nesneye ikinci bir animasyon ekler. Galeriden seçmek ise var olanı değiştirir'],
    ['☰ Animasyon Bölmesi', 'Slayttaki bütün animasyonların sıralı listesi; ▲ ▼ ile sıra değişir, ▶ Oynat ile izlenir'],
    ['Başlangıç: Tıklatıldığında', 'Animasyon sizin tıklamanızı bekler (🖱)'],
    ['Başlangıç: Öncekiyle', 'Bir önceki animasyonla aynı anda oynar'],
    ['Başlangıç: Öncekinden Sonra', 'Bir önceki bitince kendiliğinden oynar (🕒)'],
    ['Süre / Gecikme', 'Animasyonun ne kadar süreceği / başlamadan önce kaç saniye bekleyeceği'],
  ],
  steps: [
    {
      title: 'Kermes duyurusu',
      html: `<p>Okul Aile Birliği kermes düzenliyor. Duyuru sunusu hazır, ama bir sorun var: kermesin <b>tarihi değişti</b>. Eski tarih slaytta duruyor, yenisi de altına eklenmiş.</p>
        <p>Gösteride şöyle olsun istiyoruz:</p>
        <ul><li>başlık ekrana gelsin,</li><li>fiyat balonu gelip <b>dikkat çekmek için</b> bir kez atsın (vurgu),</li><li>eski tarih <b>ekrandan silinsin</b> (çıkış), yeni tarih aynı anda gelsin,</li><li>maddeler arkasından <b>kendiliğinden</b> gelsin.</li></ul>
        <p>Geçen derste bütün maddelere tek bir animasyon vermiştik. Bu kez <b>her nesneye ayrı</b> animasyon vereceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'slides', { data: KERMES }); },
    },
    {
      title: 'Başlık gelsin',
      html: '<p>Soldan <b>2. slayda</b> (Hayır Kermesi) tıklayın. Sonra slayttaki <b>Hayır Kermesi</b> başlığının üzerine bir kez tıklayın. Üstte <b>Animasyonlar</b> sekmesini açın ve yeşil <b>Giriş</b> öbeğinden <b>Belirme</b>\'yi seçin.</p>',
      mouse: '🖱 2. slayt → başlığa tıkla → Animasyonlar → Giriş: Belirme',
      hint: 'Şeridin sağında “Seçili: Başlık: Hayır Kermesi” yazmalı. Yazmıyorsa önce başlığın üzerine tıklayın.',
      check: (c) => !!bul(c, 'title', 'fade'),
      on: (ev, c) => { eskiYol(ev, c); return ev.type.startsWith('ppt-') && !!bul(c, 'title', 'fade'); },
      done: 'Başlığın sol üstünde küçük bir <b>1</b> belirdi: gösteride ilk tıklamada bu başlık gelecek. Bu numaralar yalnızca düzenlerken görünür.',
    },
    {
      title: 'Fiyatı vurgulayın',
      html: '<p>Sağ alttaki kırmızı <b>Bir tabak 50 TL</b> balonuna tıklayın. Sarı <b>Vurgu</b> öbeğinden <b>Darbe</b>\'yi seçin.</p>',
      mouse: '🖱 Fiyat balonuna tıkla → Vurgu: Darbe',
      hint: 'Vurgu efekti, zaten ekranda duran bir nesnenin dikkat çekmesi içindir: atar, döner, büyür.',
      check: (c) => !!bul(c, FIYAT, 'pulse'),
      on: (ev, c) => { eskiYol(ev, c); return ev.type.startsWith('ppt-') && !!bul(c, FIYAT, 'pulse'); },
      done: 'Fiyat balonu artık gösteride kalp gibi bir kez atacak. Giriş efekti nesneyi <b>getirir</b>, vurgu efekti ekrandaki nesneyi <b>öne çıkarır</b>.',
    },
    {
      title: 'Animasyon Bölmesi',
      html: '<p>Şeritte <b>☰ Animasyon Bölmesi</b>\'ne tıklayın. Sağda bir liste açılır.</p>',
      mouse: '🖱 Animasyonlar → ☰ Animasyon Bölmesi',
      on: (ev) => ev.type === 'ppt-anim-pane' && ev.open,
      check: (c) => !!info(c).animPane,
      done: 'Listede slayttaki bütün animasyonlar <b>oynayacakları sırayla</b> duruyor: başlık 1, fiyat balonu 2. Yeşil ★ giriş, sarı ★ vurgu demek. 🖱 işareti “tıklayınca oynar” anlamına gelir.',
    },
    {
      title: 'Aynı nesneye ikinci animasyon',
      html: `<p>Fiyat balonu ekrana birden gelmesin, <b>büyüyerek</b> gelsin istiyoruz. Ama Darbe de kalsın. Balon seçiliyken şeritte <b>✚ Animasyon Ekle ▾</b>\'ye tıklayın ve listeden <b>Giriş → Büyüme</b>\'yi seçin.</p>
        <p class="mut">Galerideki düğmeler var olan animasyonu <b>değiştirir</b>; <b>Animasyon Ekle</b> ise <b>yanına ekler</b>.</p>`,
      hint: 'Balon seçili değilse önce balona tıklayın. Darbe kaybolduysa Vurgu → Darbe ile geri getirin, sonra Animasyon Ekle.',
      check: (c) => !!(bul(c, FIYAT, 'pulse') && bul(c, FIYAT, 'zoom')),
      on: (ev, c) => {
        eskiYol(ev, c);
        if (ev.type === 'ppt-oanim' && ev.op === 'change' && ev.t === FIYAT) c.note('Galeriden seçince yeni efekt Darbe\'nin <b>yerine</b> geçti. Vurgu → <b>Darbe</b> ile geri alın, sonra <b>✚ Animasyon Ekle ▾</b> → Büyüme.');
        return ev.type.startsWith('ppt-') && !!(bul(c, FIYAT, 'pulse') && bul(c, FIYAT, 'zoom'));
      },
      done: 'Bölmede fiyat balonu iki kez görünüyor: önce Darbe, sonra Büyüme. Ama bu sıra yanlış: balon önce ekranda atacak, <b>sonra</b> bir daha gelecek!',
    },
    {
      title: 'Sırayı düzeltin',
      html: '<p>Bölmede <b>Büyüme</b> satırı seçili (renkli). Bölmenin üstündeki <b>▲</b> düğmesine bir kez tıklayın: Büyüme, Darbe\'nin üstüne çıkar.</p>',
      mouse: '🖱 Bölmede Büyüme satırı → ▲',
      hint: 'Büyüme satırı seçili değilse önce üzerine tıklayın. Şeritte de aynı iş için “Animasyonu Yeniden Sırala: ▲ Önceye Taşı” var.',
      ...durum((c) => { const x = an(c); const z = x.findIndex((a) => a.t === FIYAT && a.effect === 'zoom'), p = x.findIndex((a) => a.t === FIYAT && a.effect === 'pulse'); return z >= 0 && p >= 0 && z < p; }),
      done: 'Şimdi doğru: balon önce büyüyerek gelir, sonra atar. Sıra her zaman bölmede yukarıdan aşağıya okunur.',
    },
    {
      title: 'Öncekinden Sonra',
      html: '<p>Balon gelince atması için ayrıca tıklamak gerekmesin. Bölmede <b>Darbe</b> satırına tıklayın. Şeritte <b>Başlangıç</b> yanındaki <b>Öncekinden Sonra</b>\'yı seçin.</p>',
      mouse: '🖱 Bölmede Darbe → Başlangıç: Öncekinden Sonra',
      hint: '“Başlangıç: Tıklatıldığında / Öncekiyle / Öncekinden Sonra” düğmeleri şeridin ikinci satırında.',
      ...durum((c) => bul(c, FIYAT, 'pulse')?.start === 'after'),
      done: 'Darbe satırının numarası kalktı, yerine 🕒 geldi: artık Büyüme bitince <b>kendiliğinden</b> oynayacak.',
    },
    {
      title: 'Süre',
      html: `<p>Darbe biraz ağır olsun. Darbe seçiliyken şeritteki <b>Süre</b> kutusunun <b>+</b> düğmesine iki kez basarak süreyi <b>01,00</b> saniye yapın.</p>`,
      hint: 'Her basış süreyi çeyrek saniye değiştirir: 00,50 → 00,75 → 01,00. Fazla olduysa − ile azaltın.',
      ...durum((c) => bul(c, FIYAT, 'pulse')?.dur === 1),
      done: 'Darbe artık 1 saniye sürüyor. <b>Süre</b> animasyonun ne kadar hızlı oynadığıdır; uzun süre yavaş, kısa süre hızlı demektir.',
    },
    {
      title: 'Eski tarih çıksın',
      html: '<p>Gri <b>18 Ekim Cumartesi</b> kutusuna tıklayın. Kırmızı <b>Çıkış</b> öbeğinden <b>Kaybolma</b>\'yı seçin.</p>',
      mouse: '🖱 Gri kutu → Çıkış: Kaybolma',
      hint: 'Çıkış efekti, ekranda duran bir nesneyi gösteri sırasında ekrandan kaldırır.',
      check: (c) => !!bul(c, ESKI, 'vanish'),
      on: (ev, c) => { eskiYol(ev, c); return ev.type.startsWith('ppt-') && !!bul(c, ESKI, 'vanish'); },
      done: 'Bölmede kırmızı bir ★ belirdi. Eski tarih başta ekranda olacak, 3. tıklamada silinip gidecek.',
    },
    {
      title: 'Yeni tarih aynı anda',
      html: '<p>Yeşil <b>Yeni tarih: 25 Ekim</b> kutusuna tıklayın. <b>Giriş → Soldan gel</b>\'i seçin. Sonra <b>Başlangıç</b>\'ta <b>Öncekiyle</b>\'ye tıklayın: eski tarih giderken yenisi aynı anda gelsin.</p>',
      mouse: '🖱 Yeşil kutu → Giriş: Soldan gel → Başlangıç: Öncekiyle',
      hint: 'Önce efekti seçin; Başlangıç düğmeleri ancak bir animasyon seçiliyken çalışır.',
      check: (c) => bul(c, YENI, 'left')?.start === 'with',
      on: (ev, c) => { eskiYol(ev, c); return ev.type.startsWith('ppt-') && bul(c, YENI, 'left')?.start === 'with'; },
      done: 'Yeni tarih, eski tarihle <b>aynı tıklamada</b> oynayacak: biri giderken öteki gelir.',
    },
    {
      title: 'Maddeler kendiliğinden',
      html: `<p>Soldaki <b>maddelerin</b> üzerine tıklayın. <b>Giriş → Belirme</b>\'yi seçin. Sonra:</p>
        <ul><li><b>Başlangıç: Öncekinden Sonra</b>,</li><li><b>Gecikme</b> kutusunun <b>+</b> düğmesine iki kez basarak <b>00,50</b>.</li></ul>`,
      hint: 'Gecikme, animasyon başlamadan önceki kısa bekleyiştir. Maddeler tarih değiştikten yarım saniye sonra gelmeye başlar.',
      check: (c) => { const a = bul(c, 'body', 'fade'); return !!a && a.start === 'after' && a.delay === 0.5; },
      on: (ev, c) => { eskiYol(ev, c); const a = bul(c, 'body', 'fade'); return ev.type.startsWith('ppt-') && !!a && a.start === 'after' && a.delay === 0.5; },
      done: 'Maddeler tek tek, arka arkaya kendiliğinden gelecek. Slayttaki küçük numaralara bakın: tarih kutuları ve maddeler hep <b>3</b>; hepsi 3. tıklamada başlıyor.',
    },
    {
      title: 'Oynatıp bakın',
      html: '<p>Bölmenin üstündeki <b>▶ Oynat</b>\'a tıklayın ve slayda bakın. Bütün animasyonlar tıklama beklemeden sırayla oynar.</p>',
      mouse: '🖱 Animasyon Bölmesi → ▶ Oynat',
      hint: 'Bölme kapandıysa Animasyonlar → ☰ Animasyon Bölmesi. Şeritteki ▶ Önizleme de aynı işi yapar.',
      on: (ev) => ev.type === 'ppt-anim-preview' && ev.effect === 'nesne',
      done: 'Başlık geldi, fiyat balonu büyüyüp attı, eski tarih silinirken yenisi geldi, maddeler arkasından sıralandı. Önizleme bitince slayt eski hâline döner.',
    },
    {
      title: 'Gösteride deneyin',
      html: `<p>${K('F5')} ile gösteriyi başlatın. Her tıklamada ne olduğuna bakın. 2. slaydın sonuna kadar gidin (maddelerin üçü de gelsin), sonra ${K('Esc')} ile çıkın.</p>
        <p class="mut">Kaç kez tıkladığınızı sayın: bu slaytta 7 animasyon var.</p>`,
      combo: ['F5'],
      hint: 'Tıklama yerine → (sağ ok) ya da boşluk tuşu da olur. Çıktıysanız F5 ile yeniden başlatın.',
      on: (ev, c) => {
        if (ev.type === 'ppt-anim-done' && ev.index === 1) c.s.clicks = ev.clicks;
        if (ev.type !== 'ppt-show-exit') return false;
        if (!c.s.clicks) { c.note(`Gösteri 2. slaydın sonuna gelmeden kapandı. ${K('F5')} ile yeniden başlatıp maddelerin üçü de gelene kadar ilerleyin.`); return false; }
        return true;
      },
      done: (c) => `2. slaytta 7 animasyon oynadı ama siz yalnızca <b>${c.s.clicks || 3} kez</b> tıkladınız${(c.s.clicks || 3) > 3 ? ' (animasyon bitmeden tıklayınca o adım hemen tamamlanır)' : ''}. <b>Öncekiyle</b> ve <b>Öncekinden Sonra</b> tıklama beklemez; konuşurken elinizi rahatlatır.`,
    },
    rehberSoru({
      title: 'Hangi başlangıç?',
      html: '<p>Bir fotoğraf ekrana gelince, <b>altındaki yazı da tam aynı anda</b> gelsin istiyorsunuz. Yazının Başlangıç ayarı ne olmalı?</p>',
      opts: ['Tıklatıldığında', 'Öncekiyle', 'Öncekinden Sonra'], ok: 1,
      wrong: 'Bu ayarda yazı ya tıklamanızı ya da fotoğrafın bitmesini bekler.',
      why: 'Doğru: <b>Öncekiyle</b>. Fotoğrafla aynı anda başlar. Öncekinden Sonra seçseydiniz fotoğraf bittikten sonra gelirdi.',
    }),
    rehberSoru({
      title: 'Hangi efekt türü?',
      html: '<p>Toplantı sunusunda bir madde “iptal edildi”. Gösteri sırasında o maddenin <b>ekrandan gitmesini</b> istiyorsunuz. Hangi türden efekt seçersiniz?</p>',
      opts: ['Giriş (yeşil)', 'Vurgu (sarı)', 'Çıkış (kırmızı)'], ok: 2,
      wrong: 'Bu tür nesneyi ekrandan kaldırmaz.',
      why: 'Doğru: <b>Çıkış</b>. Giriş getirir, vurgu dikkat çeker, çıkış ekrandan götürür.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Nesnelere ayrı ayrı animasyon verip sırasını ve zamanlamasını ayarladınız:</p>' },
  ],
};
