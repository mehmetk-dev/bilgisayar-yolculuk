// 2. hafta ek dersleri: F klavye ve Q klavye (iki düzenin karşılaştırması) ve klavye dili/düzeni (TUR, ENG, Q, F) uygulaması.
import { K, desktopReady } from './common.js';
import { sec, rehberSoru } from './kalip.js';

// ---- Karşılaştırma sahnesi: iki klavyenin harf sıraları
const Q_ROWS = ['QWERTYUIOPĞÜ', 'ASDFGHJKLŞİ', 'ZXCVBNMÖÇ'];
const F_ROWS = ['FGĞIODRNHPQW', 'UİEAÜTKMLYŞ', 'JÖVCÇZSB'];
const OFFS = [0, 0.5, 1];

function klavyeSahnesi(el, c) {
  el.className = 'sc sc-fq';
  const kb = (title, rows, id) => `<div class="fq-kb" data-kb="${id}"><h3>${title}</h3>${rows.map((r, i) => `<div class="fq-row ${i === 1 ? 'home' : ''}" style="margin-left:${OFFS[i] * 2.4}em">${[...r].map((ch) => `<b data-ch="${ch}">${ch}</b>`).join('')}</div>`).join('')}</div>`;
  el.innerHTML = `${kb('Q klavye', Q_ROWS, 'q')}${kb('F klavye', F_ROWS, 'f')}<p class="fq-say">Bir harfe tıklayın: iki klavyede de nerede olduğunu görürsünüz. <b>A</b> ve <b>K</b> harflerini bulun.</p>
    <p class="mut">Koyu satır, parmaklarınızın durduğu <b>ana sıradır</b>.</p>`;
  const found = new Set();
  const say = el.querySelector('.fq-say');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ch]');
    if (!b) return;
    const ch = b.dataset.ch;
    el.querySelectorAll('[data-ch]').forEach((x) => x.classList.toggle('pick', x.dataset.ch === ch));
    const rowOf = (rows) => ['üst', 'ana', 'alt'][rows.findIndex((r) => r.includes(ch))];
    say.innerHTML = `<b>${ch}</b>: Q klavyede <b>${rowOf(Q_ROWS)}</b> sırada, F klavyede <b>${rowOf(F_ROWS)}</b> sırada.`;
    found.add(ch);
    c.emit('fq-pick', { ch, found: [...found] });
  });
}

const kbIntro = '<div class="fq-big">⌨ Q &nbsp;·&nbsp; F</div>';

export const fqKlavye = {
  id: 'fq-klavye', icon: '⌨', title: 'F klavye ve Q klavye: fark nedir?', minutes: 20, stage: 'scene',
  desc: 'Q ve F klavye düzeni: hangisini kullandığınızı nasıl anlarsınız?',
  summary: [
    ['Q klavye', 'Üst sıra QWERTY…; bilgisayarların çoğunda böyledir; dünyada yaygın düzenin Türkçeye uyarlaması'],
    ['F klavye', 'Üst sıra FGĞIOD…; 1955\'te Türkçenin harf sıklığına göre tasarlanmış; sesli harfler sol elin altında'],
    ['Hangisi bende?', 'Üst harf sırasının ilk tuşuna bakın: Q mu F mi?'],
    ['Daktilo bilenler', 'Çoğu daktilo kursu F klavyeyle öğretti; bilgisayarda F düzeni eklenebilir'],
    ['Windows\'ta F eklemek', 'Ayarlar → Saat ve dil → Klavye ekle → Türkçe F'],
    ['Ortak bilgisayar', 'Düzeni değiştirdiyseniz işiniz bitince eski hâline getirin'],
  ],
  steps: [
    {
      title: 'İki ayrı düzen',
      html: `<p>Türkiye'de bilgisayar klavyelerinin çoğu <b>Q klavyedir</b>: üst harf sırası <b>Q W E R T Y</b> diye gider. Ama bir de <b>F klavye</b> vardır: üst sırası <b>F G Ğ I O D</b> ile başlar.</p>
        <p>Daktilo kullananlar F klavyeyi bilir: Türkiye'de daktilo kurslarının çoğu <b>F klavyeyle</b> öğretti. Bilgisayara geçince Q ile karşılaşıp şaşıranlar çoktur.</p>`,
      scene: (el) => { el.className = 'sc sc-info'; el.innerHTML = `${kbIntro}<p>Aynı harfler, farklı yerlerde</p>`; },
    },
    {
      title: 'İki klavyeyi karşılaştırın',
      html: `<p>Sağda iki klavyenin harfleri var. <b>A</b> harfine tıklayın: iki klavyede de nerede olduğuna bakın. Sonra <b>K</b> harfine tıklayın.</p>
        <p class="mut">Gerçek klavyelerde sayılar, noktalama ve diğer tuşlar da var; burada yalnızca harfler gösteriliyor.</p>`,
      scene: klavyeSahnesi,
      on: (ev) => ev.type === 'fq-pick' && ev.found.includes('A') && ev.found.includes('K'),
      done: 'F klavyede <b>A</b> ve <b>K</b>, işaret parmaklarınızın tam altında. Çünkü Türkçede en çok kullanılan harfler bunlardır; en güçlü parmaklara verilmiştir.',
    },
    sec({
      title: 'Hangi klavye?', text: '<div class="qz-pic">Üst sıra: <b>F G Ğ I O D R N H P Q W</b></div>',
      q: 'Bu harf sırası hangi klavyeye aittir?', opts: ['Q klavye', 'F klavye'], ok: 1,
      why: 'F klavye: üst sıra F ile başlar. Q klavyede ise Q ile başlar (Q W E R T Y…).',
    }),
    sec({
      title: 'Sesli harfler', text: '<div class="qz-pic">A E I İ O Ö U Ü</div>',
      q: 'F klavyede sesli harfler (a, e, ı, i, o, ö, u, ü) nerededir?', opts: ['Her yere dağılmıştır', 'Hepsi sol elin altında toplanmıştır; böylece eller sırayla çalışır', 'Hepsi sağ elin altındadır'], ok: 1,
      why: 'F klavye 1955\'te Türkçedeki harf sıklıklarına göre tasarlandı: sesli harfler solda, sessiz harfler sağda. Eller sırayla çalışır, yorulmadan hızlı yazılır.',
    }),
    sec({
      title: 'Kendi klavyeniz', text: '<p>Bilgisayarınızın klavyesine bakıyorsunuz. Üst harf sırasının <b>en solundaki tuşta “Q”</b> yazıyor.</p>',
      q: 'Klavyeniz hangisi?', opts: ['Q klavye', 'F klavye'], ok: 0,
      why: 'Tuşların üstündeki harflere bakmak yeter: üst sıra Q ile başlıyorsa Q, F ile başlıyorsa F klavyedir. Tuşların harfleri silinmişse bir yazı programında “q” tuşuna basıp ne çıktığına da bakabilirsiniz.',
    }),
    sec({
      title: 'Daktilo bilen komşu', text: '<p>Komşunuz yıllarca <b>F klavyeyle daktilo</b> yazdı. Yeni bilgisayarının klavyesi Q ve her şeyi aramaktan yazamıyor.</p>',
      q: 'Ona ne önerirsiniz?', opts: ['Bilgisayarı geri versin', 'Windows\'ta Türkçe F klavyeyi ekleyip kullansın; tuşların üstü Q yazar ama F düzeninde çıkan harfleri ezbere bildiği için sorun olmaz', 'Hepsini yeniden öğrensin, F klavye bilgisayarda çalışmaz'], ok: 1,
      why: 'Windows\'ta Türkçe F düzeni vardır: Ayarlar → Saat ve dil → klavye ekle. Tuşların üstündeki harfler Q olduğu için ya ezbere yazılır, ya da klavyeye F etiketleri yapıştırılır. Bir sonraki derste bunu kendiniz deneyeceksiniz.',
    }),
    sec({
      title: 'Ortak bilgisayar', text: '<p>Kurstaki ortak bilgisayarda klavye düzenini <b>F</b> yaptınız ve işiniz bitti.</p>',
      q: 'Kalkarken ne yaparsınız?', opts: ['Hiçbir şey; kalsın', 'Eski düzene (Türkçe Q) döndürürüm: sonraki kişi kafa karışıklığı yaşamasın', 'Bilgisayarı kapatırım'], ok: 1,
      why: 'Bir sonraki kullanıcı Q yazdığını sanıp harfleri karışık görür ve “klavye bozulmuş” diye düşünür. Ortak bilgisayarda ayarı eski hâline getirmek nezaket kuralıdır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>F ve Q klavye:</p>', scene: (el) => { el.className = 'sc sc-info'; el.innerHTML = `${kbIntro}<p>Artık farkı biliyorsunuz</p>`; } },
  ],
};

// ---- Uygulama: TUR / ENG, Alt + Shift, klavye ekleme, F düzeni
const npText = (c) => c.d.find('notepad')?.api.np?.value || '';
const layoutNow = (c) => c.d.settings.kbLayout;

export const klavyeDili = {
  id: 'klavye-dili', icon: '🌐', title: 'Klavye dili ve düzeni: TUR, ENG, Q, F', minutes: 30, stage: 'desktop',
  desc: 'TUR / ENG yazısı, klavye dilini değiştirmek, ş ğ ü neden çıkmaz.',
  summary: [
    ['TUR / ENG', 'Sağ alttaki yazı: klavye dili. ENG\'de ş ğ ü ö ç ı yazılmaz'],
    ['Alt + Shift', 'Klavye dilini değiştirir (aynı iş: ⊞ Windows + Boşluk)'],
    ['ENG\'de ş tuşu', '; (noktalı virgül) yazar'],
    ['@ işareti', 'Türkçe Q: AltGr + Q. İngilizce: Shift + 2'],
    ['Ayarlar → Saat ve dil', 'Klavye ekle: Türkçe F ya da İngilizce'],
    ['F düzeni', 'Q klavyenin tuşlarıyla F harfleri yazılır: F tuşu a, H tuşu t…'],
    ['Eski hâline getirin', 'Ortak bilgisayarda işiniz bitince TUR Q\'ya dönün'],
  ],
  steps: [
    {
      title: 'Harfler neden değişti?',
      html: `<p>Bazen yazarken <b>ş, ğ, ü</b> yerine <b>; [ ]</b> gibi işaretler çıkar. Bilgisayar bozulmamıştır: <b>klavye dili</b> değişmiştir. Sağ alttaki saatin yanında <b>TUR</b> ya da <b>ENG</b> yazar.</p>
        <p>Bu derste dili kendimiz değiştirip ne olduğunu göreceğiz; sonra <b>Türkçe F klavyeyi</b> ekleyip deneyeceğiz.</p>
        <p class="mut">Alıştırma bilgisayarında klavyenizin gerçek harfleri değil, burada seçtiğiniz düzen geçerlidir.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Not Defteri\'ni açın',
      html: '<p>⊞ Başlat → <b>📝 Not Defteri</b>. Beyaz yazı alanının içine bir kez tıklayın.</p>',
      check: (c) => !!c.d.find('notepad'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'notepad',
    },
    {
      title: 'Dil göstergesi',
      html: '<p>Sağ altta saatin yanındaki <b>TUR</b> yazısına <b>tıklayın</b>. Seçenekler listesi açılır: hangileri var?</p>',
      mouse: '🖱 Sağ alt: TUR',
      hint: 'Saatin hemen solunda, Wi-Fi simgesinin yanında.',
      on: (ev) => ev.type === 'context' && ev.kind === 'lang',
      done: 'Listede <b>TUR Türkçe Q klavye</b> ve <b>ENG İngilizce klavye</b> var. Tik işareti şu an kullanılanı gösterir.',
    },
    {
      title: 'ENG\'yi seçin',
      html: '<p>Listeden <b>ENG İngilizce (ABD) klavye</b>\'yi seçin. Bir yanlışlıkla bu olabilir; bakalım ne olacak.</p>',
      check: (c) => layoutNow(c) === 'eng',
      on: (ev) => ev.type === 'kb-layout' && ev.layout === 'eng',
      done: 'Sağ alttaki yazı <b>ENG</b> oldu. Şimdi yazı yazalım.',
    },
    {
      title: 'ş tuşuna basın',
      html: `<p>Not Defteri'ne tıklayın ve klavyede <b>L</b> harfinin sağındaki <b>ş</b> tuşuna basın. Ekrana ne çıktı?</p>`,
      hint: 'L tuşunun hemen sağındaki tuş. Üzerinde ş ve Ş yazar.',
      on: (ev, c) => ev.type === 'input' && npText(c).includes(';'),
      done: 'ş yerine <b>;</b> çıktı! ENG kipinde Türkçe harf tuşları işaret yazar: ş tuşu ;, ğ tuşu [, ü tuşu ], i tuşu \' (kesme işareti). Bilgisayar bozuk değil, dil değişmiş.',
    },
    {
      title: '@ işareti',
      html: `<p>E-posta adreslerindeki <b>@</b> da dile göre farklı yazılır. <b>ENG</b> kipinde ${K('Shift')} + <b>2</b> tuşlarına basarak <b>@</b> yazın.</p>
        <p class="mut">Türkçe klavyede @ için ${K('AltGr')} + <b>Q</b> kullanılır. Aynı işaret için iki ayrı yol: dil değişince alışkanlık da değişir.</p>`,
      hint: 'Shift tuşunu basılı tutup üst sıradaki 2 tuşuna basın.',
      on: (ev, c) => ev.type === 'input' && npText(c).includes('@'),
      done: 'ENG kipinde Shift + 2 = @. Türkçe Q klavyede ise 2 tuşuyla Shift basınca <b>"</b> (tırnak) çıkar. Şifre ve e-posta yazarken dilin doğru olduğundan emin olun.',
    },
    {
      title: 'Türkçe\'ye dönün: Alt + Shift',
      html: `<p>Klavye dilini değiştirmenin kısayolu: ${K('Alt')} + ${K('Shift')} (ikisine birlikte basıp bırakın). Bir kez basın ve sağ alttaki yazıya bakın: <b>TUR</b> olmalı.</p>`,
      hint: 'Alt, boşluk çubuğunun solunda; Shift, harf tuşlarının sol alt kenarında. Önce Alt\'ı basılı tutup sonra Shift\'e basın.',
      check: (c) => layoutNow(c) === 'trq',
      on: (ev) => ev.type === 'kb-layout' && ev.layout === 'trq',
      done: 'Tekrar <b>TUR</b>. Bir şeyler garip yazılıyorsa önce sağ alttaki TUR / ENG yazısına bakın; Alt + Shift ile düzelir. (Bazı bilgisayarlarda ⊞ Windows + Boşluk da aynı işi yapar.)',
    },
    {
      title: 'Ayarlar: Saat ve dil',
      html: '<p>Şimdi başka bir klavye düzeni ekleyelim. ⊞ Başlat → <b>⚙ Ayarlar</b> → soldan <b>🕒 Saat ve dil</b>. Aşağıda <b>Dil ve klavye</b> bölümü var.</p>',
      setup: (c) => c.d.ensure('settings'),
      check: (c) => c.d.find('settings')?.el.querySelector('[data-page="time"].on'),
      on: (ev) => ev.type === 'settings-page' && ev.page === 'time',
    },
    {
      title: 'Türkçe F klavye ekleyin',
      html: '<p><b>Klavye ekle</b> kutusundan <b>Türkçe F klavye</b>\'yi seçin. Listeye eklenir.</p>',
      check: (c) => c.d.settings.kbList.includes('trf'),
      on: (ev) => ev.type === 'kb-add' && ev.layout === 'trf',
      done: 'Türkçe F klavye listede. Gerçek Windows\'ta da yol bu: Ayarlar → Saat ve dil → Dil ve bölge → klavye ekle.',
    },
    {
      title: 'F düzenini kullanın',
      html: '<p>Sağ alttaki <b>TUR</b> yazısına tıklayıp <b>Türkçe F klavye</b>\'yi seçin. (Yazı yine TUR kalır; yalnızca düzen değişir.)</p>',
      check: (c) => layoutNow(c) === 'trf',
      on: (ev) => ev.type === 'kb-layout' && ev.layout === 'trf',
      done: 'Artık tuşlar F düzenine göre yazıyor: tuşların üstündeki harfler Q klavye yazsa da.',
    },
    {
      title: 'F ile yazın: ata',
      html: `<p>Not Defteri'ne tıklayıp yazı alanını temizleyin (${K('Ctrl')} + ${K('A')}, sonra ${K('Delete')}). Sonra <b>klavyenizde sırayla F, H, F</b> tuşlarına basın.</p>
        <p class="mut">F klavyede <b>a</b> harfi, Q klavyedeki F tuşunun yerindedir; <b>t</b> ise H tuşunun yerindedir. Hangi kelime çıkacak?</p>`,
      hint: 'Tuşların üstünde F, H, F yazıyor; siz Q klavyedeki harflere basıyorsunuz ama ekrana F düzeninin harfleri çıkıyor.',
      on: (ev, c) => ev.type === 'input' && /ata$/i.test(npText(c).trim()),
      done: '<b>ata</b> çıktı! Klavyedeki F, H, F tuşlarına bastınız ama F düzeninin harfleri yazıldı. Daktilodan F klavyeyi bilenler bu yüzden düzeni seçip tuşlara bakmadan yazabilir.',
    },
    rehberSoru({
      title: 'D tuşuna basarsanız?',
      html: '<p>Düzen şu an <b>Türkçe F</b>. Klavyede <b>D</b> tuşuna basarsanız ekrana hangi harf çıkar? <small>(Not Defteri\'nde deneyebilirsiniz.)</small></p>',
      opts: ['d', 'e', 'y'], ok: 1,
      wrong: 'Not Defteri\'nde D tuşuna basıp bakın. F düzeninde tuşların yerleri değişir.',
      why: 'D tuşu F düzeninde <b>e</b> yazar. F klavyede sesli harfler sol elin altındadır: İ (S tuşu), E (D tuşu), A (F tuşu).',
    }),
    {
      title: 'Eski düzene dönün',
      html: '<p>Kurstaki bilgisayarı ortak kullanıyoruz. Sağ alttaki <b>TUR</b>\'a tıklayıp <b>Türkçe Q klavye</b>\'yi seçerek düzeni eski hâline getirin.</p>',
      check: (c) => layoutNow(c) === 'trq',
      on: (ev) => ev.type === 'kb-layout' && ev.layout === 'trq',
      done: 'Düzen yeniden Türkçe Q. Başkası bu bilgisayarı kullanınca şaşırmaz.',
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Bir komşunuz arıyor: “Bilgisayarda yazı yazarken <b>ş, ğ, ü</b> harfleri çıkmıyor, yerine garip işaretler geliyor.” Ona ne söylersiniz?</p>',
      opts: ['Klavyeyi değiştir', 'Sağ alttaki yazıya bak: ENG yazıyorsa Alt + Shift ile TUR yap', 'Bilgisayarı yeniden kurdur'], ok: 1,
      wrong: 'Bu kadar büyük bir adıma gerek yok. Sağ alt köşedeki küçük yazıya bakmak yeter.',
      why: 'Aynen öyle: yazı dili ENG olmuştur. Alt + Shift ya da yazıya tıklayıp TUR seçmek sorunu çözer.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Klavye dili ve düzeni:</p>' },
  ],
};
