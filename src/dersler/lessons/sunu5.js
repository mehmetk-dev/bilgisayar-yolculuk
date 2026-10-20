// 12. hafta ek dersleri (MEB Sunu Hazırlama modülünün eksikleri):
// 1) Sunuya hazırlık: Not Sayfası, Okuma Görünümü, geçerli slayttan başlatma, gösteride kalem / vurgulayıcı / silme,
//    Zamanlamaları Prova Et, dinleyici notları yazdırma.
// 2) Şekil, WordArt, video, köprü (web adresi ve slayda), eylem düğmesi, Üst Bilgi ve Alt Bilgi; gösteride deneme.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], master: {}, hf: {}, theme: 'beyaz' };
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', notes: '', ...o });
// Sunuda bir şey değişince (her ppt- olayında) durumu yeniden yoklar
const durum = (test) => ({ check: (c) => !!P(c) && !!test(c), on: (ev, c) => ev.type.startsWith('ppt-') && !!test(c) });

// ---------- 1) Sunuya hazırlık
const SEMINER = {
  theme: 'yesil',
  slides: [
    sl('title', { title: 'Sağlıklı Yaşam Semineri', sub: 'Çınar Emekliler Derneği', notes: 'Herkese hoş geldiniz deyin. Konuşmacı doktorumuzu tanıtın.' }),
    sl('content', { title: 'Her gün yürüyün', body: li('Günde 30 dakika', 'Rahat ayakkabı', 'Yanınızda su'), notes: 'Yürüyüş grubu salı ve perşembe sabahı parkta toplanıyor.' }),
    sl('content', { title: 'Beslenme', body: li('Bol sebze ve meyve', 'Az tuz, az şeker', 'Günde 8 bardak su') }),
    sl('content', { title: 'İyi uyku', body: li('Her gece aynı saatte yatın', 'Yatmadan önce ekrana bakmayın'), trans: 'fade' }),
    sl('only', { title: 'Teşekkürler', trans: 'fade' }),
  ],
};

export const sunuProva = {
  id: 'sunu-prova', icon: '🖊', title: 'Sunuya hazırlık: Not Sayfası, prova, kalem ve dinleyici notları', minutes: 40, stage: 'desktop',
  desc: 'Not Sayfası ve Okuma Görünümü, geçerli slayttan başlatmak, gösteride kalem ve vurgulayıcı, Zamanlamaları Prova Et, dinleyici notları yazdırmak.',
  summary: [
    ['Görünüm → 📄 Not Sayfası', 'Slayt üstte, konuşmacı notu altta; kâğıda çıkacak hâli'],
    ['Görünüm → 📖 Okuma Görünümü', 'Sunuyu pencerenin içinde gösteri gibi izlersiniz; Esc ile Normal\'e dönülür'],
    [K('F5') + ' / ' + K('Shift', 'F5'), 'Baştan başlat / seçili (geçerli) slayttan başlat'],
    [K('Ctrl', 'P') + ' (gösteride)', 'Fare kaleme dönüşür; slaydın üzerine çizersiniz. ' + K('Ctrl', 'A') + ' yeniden ok yapar'],
    ['Sağ tık → İşaretçi Seçenekleri', 'Kalem, Vurgulayıcı, Slayttaki Tüm Mürekkebi Sil'],
    [K('E') + ' (gösteride)', 'O slayttaki bütün çizimleri siler'],
    ['Esc → Sakla / At', 'Çıkarken çizimlerin slaytta kalıp kalmayacağı sorulur'],
    ['Slayt Gösterisi → ⏱ Zamanlamaları Prova Et', 'Her slaytta ne kadar konuştuğunuzu ölçer; Evet derseniz süreler kaydedilir'],
    ['Yazdır → Dinleyici notları (3 slayt)', 'İzleyiciye dağıtılır: slaytların yanında not alma çizgileri'],
    ['Yazdır → Not sayfaları', 'Sizin içindir: her slaydın altında konuşmacı notunuz'],
  ],
  steps: [
    {
      title: 'Sunum provası',
      html: `<p>Derneğin <b>Sağlıklı Yaşam Semineri</b> için 5 slaytlık sunu hazır. Sunumdan önce iyi bir konuşmacı şunları yapar:</p>
        <ul><li>Notlarını gözden geçirir ve <b>kâğıda</b> döker,</li><li>sunuyu baştan sona bir kez <b>okur</b>,</li><li>gösteride önemli yerleri <b>kalemle</b> göstermeyi dener,</li><li>ne kadar süreceğini <b>ölçer</b>,</li><li>dinleyicilere dağıtmak için <b>çıktı</b> alır.</li></ul>
        <p>Bu derste hepsini sırayla yapacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'slides', { data: SEMINER }); },
    },
    {
      title: 'Not Sayfası',
      html: '<p>Üstteki <b>Görünüm</b> sekmesine tıklayın, sonra <b>📄 Not Sayfası</b>\'nı seçin.</p>',
      mouse: '🖱 Görünüm → Not Sayfası',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'notes',
      done: 'Slayt bir kâğıdın üstünde, altında da o slaydın <b>konuşmacı notu</b> duruyor. Yazdırınca kâğıda böyle çıkar.',
    },
    {
      title: 'Notu sayfada yazın',
      html: `<p><b>Sonraki ▶</b> düğmesiyle <b>3. sayfaya</b> (Beslenme) gelin. Slaydın altındaki boş kutuya tıklayıp bir not yazın:</p>`,
      target: 'Tuzu azaltmak tansiyona iyi gelir',
      hint: 'Sonraki düğmesi kâğıdın üstünde. Sayfa numarası “Sayfa 3 / 5” olunca alttaki kutuya tıklayıp yazın.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-notes' || ev.length < 10) return false;
        if (ev.index !== 2) { c.note(`Bu not ${ev.index + 1}. slayda yazıldı. Sonraki ▶ / ◀ Önceki ile 3. sayfaya (Beslenme) geçip orada yazın.`); return false; }
        return true;
      },
      done: 'Not kaydedildi. Normal görünümde slaydın altındaki <b>Konuşmacı notları</b> kutusunda da aynı yazı görünür; ikisi aynı yerdir.',
    },
    {
      title: 'Okuma Görünümü',
      html: '<p>Şimdi sunuyu tam ekran olmadan okuyalım. <b>Görünüm → 📖 Okuma Görünümü</b>\'ne tıklayın. Okuma, o an seçili slayttan (3.) başlar.</p>',
      mouse: '🖱 Görünüm → Okuma Görünümü',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'reading',
      done: 'Şerit kayboldu; sunu pencerenin içinde gösteri gibi oynuyor. Altta slayt numarası ve ◀ ▶ düğmeleri var. E-postayla gelen bir sunuya göz atmak için de bu görünüm kullanılır.',
    },
    {
      title: 'Sona kadar okuyun',
      html: `<p>Slayta tıklayarak ya da alttaki <b>▶</b> düğmesiyle <b>son slayda</b> (Teşekkürler) kadar ilerleyin. Sonra ${K('Esc')} tuşuna basarak Normal görünüme dönün.</p>`,
      hint: 'Sağ ok tuşu da bir sonraki slayda geçirir. Son slayda gelmeden Esc\'e bastıysanız Görünüm → Okuma Görünümü ile yeniden açın.',
      keys: ['Escape'],
      on: (ev, c) => {
        if (ev.type === 'ppt-read' && (ev.last || ev.end)) c.s.last = true;
        if (ev.type === 'ppt-view' && ev.from === 'reading' && !c.s.last) { c.note('Sona gelmeden çıktınız. Görünüm → 📖 Okuma Görünümü ile yeniden açıp son slayda kadar ilerleyin.'); return false; }
        return ev.type === 'ppt-view' && ev.from === 'reading' && !!c.s.last;
      },
      done: 'Sunuyu sonuna kadar okudunuz. Yazım hatalarını ve sırası yanlış slaytları böyle bir okumada yakalarsınız.',
    },
    {
      title: 'Geçerli slayttan başlatın',
      html: `<p>Bazen sunuyu baştan değil, kaldığınız yerden göstermek istersiniz. Soldan <b>2. slayda</b> (Her gün yürüyün) tıklayın, sonra ${K('Shift', 'F5')} tuşlarına basın.</p>
        <p class="mut">${K('F5')} her zaman 1. slayttan başlatır; ${K('Shift', 'F5')} seçili slayttan.</p>`,
      combo: ['Shift', 'F5'],
      hint: 'Önce soldaki küçük slaytlardan 2.\'ye tıklayın. Sonra Shift tuşunu basılı tutup F5\'e basın. Ya da Slayt Gösterisi → ▶ Geçerli slayttan.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-show-start') return false;
        if (ev.from !== 1) { c.note(`Gösteri ${ev.from + 1}. slayttan başladı. ${K('Esc')} ile çıkın, soldan 2. slayda tıklayın ve yeniden ${K('Shift', 'F5')}.`); return false; }
        return true;
      },
      done: 'Gösteri doğrudan 2. slayttan başladı.',
    },
    {
      title: 'Kalem: Ctrl + P',
      html: `<p>Gösteri açıkken ${K('Ctrl', 'P')}'ye basın: fare <b>kalem</b> olur. Sonra farenin sol tuşunu basılı tutarak <b>“Günde 30 dakika”</b> yazısının çevresine bir daire çizin.</p>`,
      combo: ['Ctrl', 'KeyP'],
      hint: 'Ctrl tuşunu basılı tutup P\'ye basın; imleç artı (+) işaretine döner. Gösteriden çıktıysanız soldan 2. slaydı seçip Shift + F5.',
      on: (ev, c) => {
        if (ev.type === 'ppt-show-exit') c.note(`Gösteriden çıktınız. 2. slaydı seçip ${K('Shift', 'F5')} ile yeniden başlatın, sonra ${K('Ctrl', 'P')}.`);
        return ev.type === 'ppt-ink' && ev.tool === 'pen';
      },
      done: 'Slaydın üzerine kırmızı kalemle çizdiniz. Dinleyicilere “şuraya bakın” demenin en kolay yolu.',
    },
    {
      title: 'Çizimi silin: E',
      html: `<p>Çizim yanlış oldu diyelim. Klavyeden <b>E</b> harfine basın: bu slayttaki bütün çizimler silinir.</p>`,
      keys: ['KeyE'],
      hint: 'Yalnızca E harfine basın (Ctrl olmadan). Silgi gibi düşünün.',
      on: (ev) => ev.type === 'ppt-ink-clear' && ev.had > 0,
      done: 'Çizim silindi; slayt tertemiz.',
    },
    {
      title: 'Vurgulayıcı',
      html: `<p>Slaydın üzerinde <b>sağ tıklayın</b>. Açılan menüde <b>İşaretçi Seçenekleri</b> altındaki <b>🖍 Vurgulayıcı</b>\'yı seçin. Sonra fareyle <b>“Rahat ayakkabı”</b> yazısının üzerinden soldan sağa geçin.</p>`,
      mouse: '🖱 Sağ tık → Vurgulayıcı',
      hint: 'Vurgulayıcı, kitaplarda kullanılan sarı fosforlu kalem gibidir; yazının üstünden geçince yazı okunmaya devam eder.',
      on: (ev) => ev.type === 'ppt-ink' && ev.tool === 'hl',
      done: 'Sarı vurgu yazıyı kapatmadan öne çıkardı. Aynı menüde <b>Slayttaki Tüm Mürekkebi Sil</b> ve oku geri getiren <b>Ok</b> da var.',
    },
    {
      title: 'Çıkın ve saklayın',
      html: `<p>${K('Esc')} ile gösteriden çıkın. Çizimlerin kalıp kalmayacağı sorulacak: <b>Sakla</b>\'ya tıklayın.</p>`,
      keys: ['Escape'],
      hint: 'Pencere çıkmadıysa çizim yapılmamış olabilir: sağ tık → Vurgulayıcı ile yeniden çizin.',
      on: (ev, c) => {
        if (ev.type === 'ppt-ink-keep' && !ev.keep) { c.note(`“At” seçildi, çizim silindi. 2. slaytta ${K('Shift', 'F5')}, sağ tık → Vurgulayıcı ile yeniden çizin, Esc → Sakla.`); return false; }
        return ev.type === 'ppt-ink-keep' && ev.keep;
      },
      done: 'Vurgu slaytta kaldı; soldaki küçük resimde de görünüyor. Sunuyu kaydederseniz çizim de saklanır. İstemediğiniz bir çizimde <b>At</b> denir.',
    },
    {
      title: 'Zamanlamaları Prova Et',
      html: `<p>Sunumunuz kaç dakika sürüyor? Ölçelim. <b>Slayt Gösterisi</b> sekmesine tıklayın ve <b>⏱ Zamanlamaları Prova Et</b>\'i seçin.</p>`,
      mouse: '🖱 Slayt Gösterisi → Zamanlamaları Prova Et',
      on: (ev) => ev.type === 'ppt-show-start' && ev.rehearse,
      done: 'Gösteri baştan başladı ve sol üstte bir <b>Kayıt</b> çubuğu belirdi: bu slaytta ve toplamda geçen süreyi sayıyor.',
    },
    {
      title: 'Provayı bitirin',
      html: `<p>Her slaytta, söyleyeceklerinizi içinizden söyler gibi <b>birkaç saniye</b> bekleyin; sonra tıklayarak ya da <b>➡ Sonraki</b> ile ilerleyin. Son slayttan sonra bir kez daha tıklayın. Süreleri kaydetmek isteyip istemediğiniz sorulunca <b>Evet</b> deyin.</p>`,
      hint: 'Bütün slaytları gezmeden Esc\'e basarsanız yalnızca gördüğünüz slaytların süresi kaydedilir. Baştan almak için Slayt Gösterisi → Zamanlamaları Prova Et.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-rehearse') return false;
        if (!ev.saved) { c.note('Süreler kaydedilmedi. Yeniden Slayt Gösterisi → ⏱ Zamanlamaları Prova Et ile başlayın; sonda Evet deyin.'); return false; }
        if (!ev.all) { c.note('Bütün slaytları gezmeden çıktınız. Slayt Gösterisi → ⏱ Zamanlamaları Prova Et ile baştan alın ve son slayda kadar ilerleyin.'); return false; }
        return true;
      },
      done: (c) => `Sunu toplam <b>${(() => { const t = info(c).slides.reduce((n, s) => n + (s.auto || 0), 0); return `${Math.floor(t / 60)} dakika ${t % 60} saniye`; })()}</b> sürdü. Her slaydın süresi kaydedildi; gösteri artık bu sürelerle <b>kendiliğinden ilerler</b>.`,
    },
    {
      title: 'Süreleri görün',
      html: '<p><b>Görünüm → ▦ Slayt Sıralayıcı</b>\'yı açın. Her slaydın numarasının yanında süresini görün.</p>',
      mouse: '🖱 Görünüm → Slayt Sıralayıcı',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'sorter',
      done: 'Her slaydın sağ üstünde süre yazıyor (ör. 00:04). En uzun süren slayt, konuşmanızın en ağır yeridir; gerekirse kısaltın.',
    },
    {
      title: 'Dinleyici notları yazdırın',
      html: `<p>Dinleyicilere dağıtmak için çıktı alalım. ${K('Ctrl', 'P')}'ye basın (ya da <b>Dosya → Yazdır</b>). Düzen sorulunca <b>Dinleyici notları (3 slayt)</b>\'yı seçin; önizlemeye bakıp <b>Yazdır</b>\'a tıklayın.</p>`,
      hint: 'Ctrl + P çalışmazsa soldaki slaytlardan birine tıklayıp yeniden deneyin ya da sol üstteki Dosya → 🖨 Yazdır.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-print') return false;
        if (ev.kind !== 'handout') { c.note('Başka bir düzenle yazdırıldı. Yeniden Ctrl + P, bu kez “Dinleyici notları (3 slayt)”.'); return false; }
        return true;
      },
      done: 'Her kâğıtta 3 slayt ve yanında not alma çizgileri var: 5 slayt 2 kâğıda çıktı. Dinleyiciler konuşurken bu çizgilere not alır.',
    },
    rehberSoru({
      title: 'Hangi çıktı?',
      html: '<p>Sunum sırasında <b>kendi elinizde</b> tutacağınız, her slaydın altında ne söyleyeceğinizin yazdığı kâğıtlar hangisi?</p>',
      opts: ['Dinleyici notları (3 slayt)', 'Not sayfaları', 'Bir kâğıda 6 slayt'], ok: 1,
      wrong: 'Bu çıktıda sizin konuşmacı notlarınız yok; izleyiciye dağıtılır.',
      why: 'Doğru: <b>Not sayfaları</b> her slaydı kendi konuşmacı notuyla basar; sizin içindir. <b>Dinleyici notları</b> ise izleyiciye dağıtılır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sunuma hazırlığın bütün adımlarını yaptınız:</p>' },
  ],
};

// ---------- 2) Şekil, WordArt, video, köprü ve eylem düğmeleri
const KURS = {
  theme: 'beyaz',
  slides: [
    sl('title', { title: 'Kültür Evi Kursları', sub: '2026 Güz dönemi' }),
    sl('content', { title: 'Kurslarımız', body: li('Bilgisayar', 'Ebru sanatı', 'Bağlama', 'Kayıt ve iletişim') }),
    sl('content', { title: 'Bilgisayar kursu', body: li('Haftada 2 gün, 3 ay', 'Başlangıç seviyesi', 'Yetişkinler için') }),
    sl('only', { title: 'Kurstan görüntüler' }),
    sl('content', { title: 'Kayıt ve iletişim', body: li('Kayıt: 1–15 Eylül', 'Kültür Evi, Çınar Sokak No: 5', 'e-yaygin.meb.gov.tr') }),
  ],
};
const sekil = (c, i, kind) => (info(c).slides[i]?.shapes || []).find((o) => o.kind === kind);

export const sunuBaglanti = {
  id: 'sunu-baglanti', icon: '🔗', title: 'Şekil, WordArt, video, köprü ve eylem düğmeleri', minutes: 40, stage: 'desktop',
  desc: 'Slayda şekil, WordArt ve video eklemek; yazıya web adresi ve slayt bağlantısı vermek; eylem düğmesi; tarih, slayt numarası ve alt bilgi.',
  summary: [
    ['Ekle → 𝒜 WordArt', 'Süslü, gölgeli başlık yazısı; örnek yazının yerine kendi yazınızı yazarsınız'],
    ['Ekle → ⬟ Şekiller', 'Dikdörtgen, ok, yıldız, konuşma balonu; içine yazı yazılır, sürükleyerek taşınır'],
    ['Şekil Biçimi → Şekil Dolgusu', 'Şekle tıklayınca çıkan sekme; şeklin rengi'],
    ['Ekle → 🎬 Video', 'Bilgisayardaki videoyu slayda koyar; gösteride tıklayınca oynar'],
    [K('Ctrl', 'K') + ' / Ekle → 🔗 Bağlantı', 'Seçili yazıya köprü: web adresi ya da “Bu Belgeye Yerleştir” ile başka bir slayt'],
    ['Şekiller → Eylem Düğmeleri', 'Gösteride tıklanınca belirlenen slayda gider (Giriş, Geri, İleri, Son)'],
    ['Ekle → ▤ Üst Bilgi ve Alt Bilgi', 'Tarih, slayt numarası, alt bilgi; “Başlık slaydında gösterme”; Tümüne Uygula'],
  ],
  setup: (c) => { put(c, 'pictures', 'kurs tanıtımı.mp4', 'file', { emoji: '💻', bg: ['#90caf9', '#1565c0'], video: true }); },
  steps: [
    {
      title: 'Kurs tanıtım sunusu',
      html: `<p>Mahallenin Kültür Evi, güz dönemi kurslarını tanıtmak için bir sunu hazırlıyor. Sunu hazır ama <b>sade</b>: yalnızca başlıklar ve maddeler var.</p>
        <p>Bu derste sunuya göz alıcı bir başlık, şekil ve video ekleyeceğiz; gösteride <b>tıklanınca başka slayda ya da web sitesine giden</b> bağlantılar koyacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'slides', { data: KURS }); },
    },
    {
      title: 'WordArt',
      html: `<p>1. slayt seçili. <b>Ekle</b> sekmesinde <b>𝒜 WordArt ▾</b>\'ya tıklayın ve <b>Turuncu, gölgeli</b> stili seçin. Örnek yazı seçili gelir; hemen yazmaya başlayın:</p>`,
      target: 'Kayıtlar başladı!',
      hint: 'WordArt düğmesi Ekle sekmesinde, Şekiller\'in yanında. Örnek yazı silinmediyse WordArt\'ın içine tıklayıp Ctrl + A ile seçin, sonra yazın.',
      ...durum((c) => { const o = sekil(c, 0, 'wordart'); return o && norm(o.text).includes('kayıtlar başladı'); }),
      done: 'Başlık slaydının altında süslü bir yazı belirdi. WordArt\'ı az kullanın: bir sunuda bir iki tane yeter.',
    },
    {
      title: 'Şekil ekleyin',
      html: `<p>Soldan <b>3. slayda</b> (Bilgisayar kursu) tıklayın. <b>Ekle → ⬟ Şekiller ▾ → ★ Yıldız</b>\'ı seçin. İmleç yıldızın içinde yanıp söner; yazın:</p>`,
      target: 'Ücretsiz!',
      hint: 'Yıldız başka bir slayda geldiyse Şekil Biçimi → 🗑 Şekli sil ile silin, 3. slayda geçip yeniden ekleyin.',
      ...durum((c) => { const o = sekil(c, 2, 'star'); return o && norm(o.text).includes('ücretsiz'); }),
      done: 'Yıldız slaydın sağına yerleşti, içinde yazınız var. Ok, konuşma balonu, dikdörtgen de aynı yolla eklenir.',
    },
    {
      title: 'Şeklin rengi',
      html: '<p>Yıldız seçiliyken üstte yeni bir sekme belirdi: <b>Şekil Biçimi</b>. Ona tıklayın ve <b>Şekil Dolgusu</b>\'ndan <b>kırmızı</b> kareyi seçin.</p>',
      hint: 'Şekil Biçimi sekmesi görünmüyorsa yıldızın üzerine bir kez tıklayın. Fareyi kareler üzerinde bekletince renk adı çıkar.',
      ...durum((c) => sekil(c, 2, 'star')?.fill === '#c00000'),
      done: 'Yıldız kırmızı oldu. Bu sekme yalnızca bir şekil seçiliyken görünür; şekilden başka yere tıklayınca kaybolur.',
    },
    {
      title: 'Şekli taşıyın',
      html: '<p>Yıldızı farenin sol tuşuyla <b>basılı tutup</b> slaydın <b>sağ üst köşesine</b> doğru sürükleyin, sonra bırakın.</p>',
      mouse: '🖱 Basılı tut → sürükle → bırak',
      hint: 'Yıldızın kenarına yakın bir yerden tutun. Fare imleci dört yönlü ok olur.',
      on: (ev) => ev.type === 'ppt-shape-move' && ev.kind === 'star' && ev.y < 20,
      done: 'Şekiller, resimler ve WordArt sürüklenerek istenen yere konur.',
    },
    {
      title: 'Video ekleyin',
      html: '<p>Soldan <b>4. slayda</b> (Kurstan görüntüler) tıklayın. <b>Ekle → 🎬 Video</b>\'ya basın; <b>Resimler</b> klasöründeki <b>kurs tanıtımı.mp4</b>\'ü seçip <b>Aç</b>\'a tıklayın.</p>',
      hint: 'Gerçek PowerPoint\'te Ekle → Video → Bu Cihaz yolunu izlersiniz.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-video-insert') return false;
        if (ev.index !== 3) { c.note('Video başka bir slayda eklendi. Videoya tıklayıp Şekil Biçimi → 🗑 Şekli sil ile silin, 4. slayda geçip yeniden ekleyin.'); return false; }
        return true;
      },
      done: 'Video slaydın ortasına yerleşti. Gösteride üzerine tıklayınca oynar. Video dosyası sunuyla birlikte taşınmalıdır; flash belleğe sunuyu atarken videoyu da atın.',
    },
    {
      title: 'Web adresine bağlantı',
      html: `<p>Soldan <b>5. slayda</b> tıklayın. Son maddedeki <b>e-yaygin.meb.gov.tr</b> yazısına <b>üç kez hızlıca</b> tıklayarak satırı seçin. Sonra ${K('Ctrl', 'K')}'ye basın. Açılan <b>Köprü Ekle</b> penceresinde adres kendiliğinden yazılı; <b>Tamam</b>\'a tıklayın.</p>`,
      combo: ['Ctrl', 'KeyK'],
      hint: 'Üç kez tıklama satırın tamamını seçer. Ctrl + K yerine Ekle → 🔗 Bağlantı da olur. Adres kutusu boşsa e-yaygin.meb.gov.tr yazın.',
      ...durum((c) => (info(c).slides[4]?.links || []).some((l) => l.href.includes('e-yaygin'))),
      done: 'Yazının altı çizildi: artık bir <b>köprü</b> (bağlantı). Gösteride tıklanınca internet tarayıcısında o site açılır.',
    },
    {
      title: 'Başka slayda bağlantı',
      html: `<p>Soldan <b>2. slayda</b> (Kurslarımız) tıklayın. <b>Bilgisayar</b> maddesine üç kez tıklayıp seçin, ${K('Ctrl', 'K')}'ye basın. Pencerenin solunda <b>📑 Bu Belgeye Yerleştir</b>\'i seçin, listeden <b>3. Bilgisayar kursu</b>\'na tıklayıp <b>Tamam</b>.</p>`,
      hint: 'Listede önce Sonraki, Önceki, İlk ve Son slayt; altında slaytların adları var.',
      ...durum((c) => (info(c).slides[1]?.links || []).some((l) => norm(l.text) === 'bilgisayar' && l.href === 'slayt:3')),
      done: '“Bilgisayar” yazısı artık 3. slayda götüren bir köprü. Böylece dinleyici hangi kursu sorarsa doğrudan oraya atlarsınız.',
    },
    {
      title: 'Eylem düğmesi',
      html: `<p>Soldan <b>3. slayda</b> tıklayın. <b>Ekle → ⬟ Şekiller ▾</b> listesinin altındaki <b>Eylem Düğmeleri</b>\'nden <b>⌂ Giriş</b>\'i seçin. <b>Eylem Ayarları</b> penceresi açılır: <b>Köprü</b> listesinden <b>2. Kurslarımız</b>\'ı seçip <b>Tamam</b>\'a tıklayın.</p>`,
      hint: 'Giriş düğmesi normalde ilk slayda götürür; listeden 2. slaydı seçerek bunu değiştiriyoruz. Pencereyi kapattıysanız düğmeye tıklayıp Ekle → ⚡ Eylem.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-action' || !ev.ok) return false;
        if (ev.index !== 2) { c.note('Düğme başka bir slayda eklendi. Üzerine tıklayıp Şekil Biçimi → 🗑 Şekli sil; 3. slayttan yeniden ekleyin.'); return false; }
        if (ev.link !== 'slayt:2') { c.note('Düğme başka bir yere gidiyor. Düğmeye tıklayın, Ekle → ⚡ Eylem ile pencereyi açıp Köprü listesinden “2. Kurslarımız”ı seçin.'); return false; }
        return true;
      },
      done: 'Sol altta mavi bir ⌂ düğmesi belirdi. Gösteride tıklanınca Kurslarımız slaydına döner.',
    },
    {
      title: 'Üst Bilgi ve Alt Bilgi',
      html: `<p><b>Ekle → ▤ Üst Bilgi ve Alt Bilgi</b>\'ye tıklayın. Pencerede:</p>
        <ul><li><b>Tarih ve saat</b> kutusunu işaretleyin (Otomatik olarak güncelleştir kalsın),</li><li><b>Slayt numarası</b>\'nı işaretleyin,</li><li><b>Alt bilgi</b> kutusuna <b>Kültür Evi</b> yazın,</li><li><b>Başlık slaydında gösterme</b>\'yi işaretleyin,</li></ul>
        <p>sonra <b>Tümüne Uygula</b>\'ya basın.</p>`,
      hint: 'Kutucuğa ya da yanındaki yazıya tıklayınca işaret (✔) konur. Bir şey eksik kaldıysa pencereyi yeniden açıp düzeltin.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-hf') return false;
        const eksik = [!ev.date && 'Tarih ve saat', !ev.num && 'Slayt numarası', !norm(ev.footer || '').includes('kültür evi') && 'Alt bilgi (Kültür Evi)', !ev.hideTitle && 'Başlık slaydında gösterme'].filter(Boolean);
        if (eksik.length) { c.note(`Eksik kalan: <b>${eksik.join(', ')}</b>. Ekle → ▤ Üst Bilgi ve Alt Bilgi ile pencereyi yeniden açın.`); return false; }
        return true;
      },
      done: 'Başlık slaydı dışındaki bütün slaytlarda solda tarih, ortada “Kültür Evi”, sağda slayt numarası var. Tarih her açılışta kendiliğinden günün tarihi olur.',
    },
    {
      title: 'Bağlantıyı deneyin',
      html: `<p>${K('F5')} ile gösteriyi baştan başlatın. Bir kez tıklayıp <b>2. slayda</b> geçin, sonra <b>Bilgisayar</b> yazısına tıklayın.</p>`,
      combo: ['F5'],
      hint: 'Köprülü yazının üzerine gelince fare imleci el işaretine döner. Yazının dışına tıklarsanız sunu sırayla ilerler; ← ile geri dönün.',
      on: (ev) => ev.type === 'ppt-show-link' && ev.kind === 'slide' && ev.from === 'text' && ev.to === 3,
      done: 'Bağlantı sizi doğrudan 3. slayda (Bilgisayar kursu) getirdi.',
    },
    {
      title: 'Eylem düğmesine tıklayın',
      html: '<p>Sol alttaki <b>⌂</b> düğmesine tıklayın.</p>',
      hint: 'Düğme slaydın sol alt köşesinde, mavi kare.',
      on: (ev) => ev.type === 'ppt-show-link' && ev.from === 'shape' && ev.to === 2,
      done: 'Kurslarımız slaydına geri döndünüz. Bağlantılar ve eylem düğmeleri birlikte kullanılınca sunu bir menü gibi gezilir.',
    },
    {
      title: 'Video ve web bağlantısı',
      html: `<p>${K('→')} tuşuyla <b>4. slayda</b> gelin ve <b>videoya tıklayın</b>: oynamaya başlar. Sonra ${K('→')} ile 5. slayda geçip <b>e-yaygin.meb.gov.tr</b> yazısına tıklayın. En sonda ${K('Esc')} ile gösteriden çıkın.</p>`,
      hint: 'Videoyu oynatmak için videonun üzerine, bağlantı için altı çizili yazının üzerine tıklayın. Başka yere tıklarsanız sunu ilerler; ← ile geri dönebilirsiniz.',
      on: (ev, c) => {
        if (ev.type === 'ppt-video-play' && ev.playing) c.s.video = true;
        if (ev.type === 'ppt-show-link' && ev.kind === 'url') c.s.web = true;
        if (ev.type === 'ppt-show-exit' && !(c.s.video && c.s.web)) { c.note(`Bir şey eksik kaldı: ${c.s.video ? '' : 'video oynatılmadı. '}${c.s.web ? '' : 'web bağlantısına tıklanmadı. '}F5 ile yeniden başlatıp deneyin.`); return false; }
        return ev.type === 'ppt-show-exit' && !!c.s.video && !!c.s.web;
      },
      done: 'Video oynadı; web bağlantısına tıklayınca hangi adresin açılacağı göründü. Gerçek bilgisayarda internet tarayıcısı açılır, sunuya dönmek için görev çubuğundan sunuya tıklarsınız.',
    },
    rehberSoru({
      title: 'Hangisi?',
      html: '<p>Sunudaki bir yazıya tıklanınca <b>belediyenin web sitesi</b> açılsın istiyorsunuz. Ne yaparsınız?</p>',
      opts: ['Yazıyı WordArt yaparım', 'Yazıyı seçip Ctrl + K ile köprü veririm', 'Yazıyı kırmızıya boyarım'], ok: 1,
      wrong: 'Bu yalnızca yazının görünüşünü değiştirir; tıklanınca bir şey olmaz.',
      why: 'Doğru: yazıyı seçip <b>Ctrl + K</b> (Ekle → Bağlantı) ile web adresi verilir. Şekillere ve resimlere de aynı yolla köprü verilebilir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sunuya şekil, WordArt, video ve bağlantılar eklediniz:</p>' },
  ],
};
