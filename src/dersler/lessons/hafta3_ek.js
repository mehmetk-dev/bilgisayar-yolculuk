// 3. hafta ek dersleri: seçmenin incelikleri, kısayol yarışı, tarif düzenleme, kaydetme pratiği, kısayol eşleştirme
import { K, norm, lines, closeEnough } from './common.js';
import { info, ayir, sec, yaz, rehberSoru } from './kalip.js';

// Hazır metinle açılan Not Defteri dersleri için: metin boşsa yerleştirir
const preload = (text) => (c) => { if (!c.np.value.trim()) c.np.setText(text); };
const nonEmpty = (c) => lines(c.np.value).filter(Boolean);
const isCtrl = (e) => e.ctrlKey || e.metaKey;

const GUNLUK = 'Bugün hava çok güzel.\nParkta uzun bir yürüyüş yaptık.\nAkşam torunlar geldi.\nHep birlikte çay içtik.';

export const secme = {
  id: 'secme', icon: '🖍', title: 'Seçmenin incelikleri', minutes: 25, stage: 'notepad',
  desc: 'Sürükleyerek seçme, Shift + ok, Shift + End, üç kez tıklama, Ctrl + ok ile kelime atlama, Ctrl + Home/End.',
  setup: preload(GUNLUK),
  summary: [
    ['Sürüklemek', 'Sol tuş basılı, yazının üzerinden geçin'],
    ['Shift + → / ←', 'Harf harf seçer'],
    ['Shift + End / Home', 'İmleçten satır sonuna / başına kadar seçer'],
    ['Üç kez tıklama', 'Bütün satırı seçer'],
    ['Ctrl + → / ←', 'Kelime kelime atlar'],
    ['Ctrl + Home / End', 'Yazının en başına / en sonuna'],
  ],
  steps: [
    {
      title: 'Neden farklı seçme yolları?',
      html: `<p>Not Defteri'nde kısa bir günlük yazılı. Geçen derste çift tıklayıp tek kelime, ${K('Ctrl', 'A')} ile hepsini seçtik.</p>
        <p>Ama çoğu zaman <b>bir cümlenin bir parçasını</b> ya da <b>bir satırı</b> seçmek isteriz. Bu derste bunun yollarını öğreneceğiz.</p>`,
    },
    {
      title: 'Sürükleyerek seçin',
      html: '<p><b>hava çok güzel</b> sözcüklerini seçin: “hava”nın başına gelin, sol tuşu <b>basılı tutun</b>, “güzel”in sonuna kadar sürükleyip bırakın.</p>',
      mouse: '🖱 Basılı tut ve sürükle',
      hint: 'Fazla ya da eksik seçerseniz boş bir yere tıklayıp yeniden deneyin. Noktayı seçmeseniz de olur.',
      on: (ev) => ev.type === 'select' && norm(ev.text) === 'hava çok güzel',
      done: 'İstediğiniz kadarını seçebiliyorsunuz.',
    },
    {
      title: 'Shift + ok',
      html: `<p>Klavyeyle seçmek daha hassastır. İmleci <b>Parkta</b> kelimesinin başına koyun (P'nin önüne tıklayın).</p><p>Sonra ${K('Shift')} basılıyken ${K('→')} tuşuna 6 kez basın: <b>Parkta</b> seçilir.</p>`,
      combo: ['Shift', 'ArrowRight'],
      on: (ev) => ev.type === 'select' && norm(ev.text) === 'parkta',
      done: 'Shift basılıyken ok tuşları seçimi harf harf büyütür ya da küçültür.',
    },
    {
      title: 'Shift + End',
      html: `<p>İmleci 3. satırın başına (<b>Akşam</b>'ın önüne) koyun ve ${K('Shift', 'End')} tuşlarına basın. Satırın sonuna kadar seçilir.</p>`,
      combo: ['Shift', 'End'],
      hint: `Satırın başına gitmek için ${K('Home')} tuşu da kullanılabilir.`,
      on: (ev) => ev.type === 'select' && ev.text.trim() === 'Akşam torunlar geldi.',
      done: `Tersi de olur: satırın sonundayken ${K('Shift', 'Home')} başına kadar seçer.`,
    },
    {
      title: 'Üç kez tıklama',
      html: '<p>Son satırın (<b>Hep birlikte çay içtik.</b>) üzerine sol tuşla <b>hızlıca üç kez</b> tıklayın: bütün satır seçilir.</p>',
      mouse: '🖱 Tık-tık-tık',
      hint: 'Çift tıklama kelimeyi seçer; üçüncü tıklamayı hemen ardından yapın.',
      on: (ev) => ev.type === 'select' && ev.text.trim() === 'Hep birlikte çay içtik.',
      done: 'Bir tık: imleç, iki tık: kelime, üç tık: satır.',
    },
    {
      title: 'Kelime kelime atlamak',
      html: `<p>${K('Ctrl')} basılıyken ok tuşları imleci <b>harf harf değil, kelime kelime</b> götürür. İlk satırın başına tıklayın ve ${K('Ctrl', '→')} tuşlarına 3 kez basın.</p>`,
      combo: ['Ctrl', 'ArrowRight'],
      on: (ev, c) => {
        if (ev.type !== 'key' || !isCtrl(ev.e) || ev.e.code !== 'ArrowRight') return false;
        c.s.n = (c.s.n || 0) + 1;
        c.note(`Atlanan kelime: ${c.s.n}`);
        return c.s.n >= 3;
      },
      done: `${K('Ctrl', 'Shift', '→')} ise kelime kelime seçer.`,
    },
    {
      title: 'En başa, en sona',
      html: `<p>Uzun yazılarda: ${K('Ctrl', 'End')} yazının <b>en sonuna</b>, ${K('Ctrl', 'Home')} <b>en başına</b> götürür. İkisini de deneyin.</p>`,
      keys: ['ControlLeft', 'Home', 'End'],
      on: (ev, c) => {
        if (ev.type !== 'key' || !isCtrl(ev.e)) return false;
        if (ev.e.code === 'End') c.s.e = true;
        if (ev.e.code === 'Home') c.s.h = true;
        return !!(c.s.e && c.s.h);
      },
      done: 'Sayfalarca yazıda bile tek hamlede baştasınız ya da sondasınız.',
    },
    {
      title: 'Seçip silmek',
      html: `<p>Şimdi öğrendiklerinizi birleştirin: 2. satırın tamamını (<b>Parkta uzun bir yürüyüş yaptık.</b>) seçin ve ${K('Delete')} ile silin.</p>`,
      hint: 'Satıra üç kez tıklayın ya da satırın başında Shift + End, sonra Delete.',
      on: (ev, c) => ev.type === 'input' && !c.np.value.includes('Parkta') && c.np.value.includes('torunlar'),
      done: `Satır silindi. Geri getirmek isteseydiniz: ${K('Ctrl', 'Z')}.`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Seçmenin bütün yollarını öğrendiniz:</p>' },
  ],
};

// Kısayolla yapılması gereken adım: menüden yapılırsa sayılmaz, yeniden kısayolla denetilir
function kisayol({ title, html, combo, test, hint, done }) {
  return {
    title, html, combo, hint, done,
    on: (ev, c) => {
      if (ev.type === 'menu-cmd' || ev.type === 'contextmenu') c.s.menu = true;
      if (!test(ev, c)) return false;
      if (c.s.menu) { c.s.menu = false; c.warn('Bu yarışta menü yok! Aynı işi bir de <b>kısayolla</b> yapın.'); return false; }
      return true;
    },
  };
}

export const kisayolYarisi = {
  id: 'kisayol-yarisi', icon: '⏱', title: 'Kısayol yarışı', minutes: 15, stage: 'notepad', parkur: true,
  desc: 'Orta seviye: 9 görev, yalnızca kısayollarla ve klavyede ipucu yanmadan. Her görevin süresi tutulur.',
  setup: preload('Kısayol yarışı başlasın!\nBu satırı da unutmayın.'),
  steps: [
    {
      title: 'Kısayol yarışı',
      html: `<p>Her görevi <b>klavye kısayoluyla</b> yapın. Menüden yaparsanız sayılmaz. Ekrandaki klavyede ipucu yanmayacak.</p><p>Her görevin süresi tutulur; sonunda hangisinde zorlandığınızı görürsünüz.</p>`,
    },
    kisayol({ title: '1. Hepsini seçin', html: '<p>Not Defteri\'ndeki yazının <b>hepsini seçin</b>.</p>', hint: 'Ctrl + A', test: (ev, c) => ev.type === 'select' && ev.start === 0 && ev.end === c.np.value.length && ev.end > 0 }),
    kisayol({ title: '2. Kopyalayın', html: '<p>Seçili yazıyı <b>kopyalayın</b>.</p>', hint: 'Ctrl + C', test: (ev) => ev.type === 'copy' && !!ev.text }),
    { title: '3. En sona gidin', html: '<p>İmleci yazının <b>en sonuna</b> götürün (fare kullanmadan).</p>', hint: 'Ctrl + End', on: (ev) => ev.type === 'key' && isCtrl(ev.e) && ev.e.code === 'End' },
    kisayol({ title: '4. Yapıştırın', html: `<p>${K('Enter')} ile yeni satır açın ve kopyaladığınızı <b>yapıştırın</b>.</p>`, hint: 'Ctrl + V', test: (ev) => ev.type === 'input' && ev.inputType === 'insertFromPaste' }),
    kisayol({ title: '5. Geri alın', html: '<p>Yapıştırmaktan vazgeçtiniz: <b>geri alın</b>.</p>', hint: 'Ctrl + Z', test: (ev) => ev.type === 'undo' }),
    kisayol({ title: '6. Yineleyin', html: '<p>Fikrinizi yine değiştirdiniz: geri aldığınızı <b>geri getirin</b>.</p>', hint: 'Ctrl + Y', test: (ev) => ev.type === 'redo' }),
    kisayol({ title: '7. Kesin', html: '<p>Son satırdaki <b>unutmayın</b> kelimesini seçip <b>kesin</b>.</p>', hint: 'Kelimeye çift tıklayın, sonra Ctrl + X.', test: (ev) => ev.type === 'cut' && /unutmay/i.test(ev.text) }),
    kisayol({ title: '8. Kaydedin', html: '<p>Yazıyı <b>yarış</b> adıyla <b>kaydedin</b>.</p>', hint: 'Ctrl + S, ad yazıp Enter.', test: (ev) => ev.type === 'save' }),
    { title: '9. Yakınlaştırın', html: '<p>Yazıları büyütün: <b>Ctrl</b> basılıyken fare tekerleğini ileri çevirin.</p>', hint: 'Ctrl tuşunu bırakmadan tekerleği kendinizden uzağa doğru çevirin.', on: (ev) => ev.type === 'zoom' && ev.zoom > 100, done: 'Ctrl + tekerlek internet tarayıcısında da sayfayı büyütür.' },
    { final: true, title: 'Yarış bitti! ⏱', html: '<p>Bütün kısayolları kullandınız.</p>' },
  ],
};

const TARIF = 'MERCİMEK ÇORBASI\n3. Mercimekleri ekleyip 25 dakika pişirin.\n1. Soğanı ve havucu doğrayın.\n4. Blenderdan geçirip tuzunu ayarlayın.\n2. Tereyağında soğanı kavurun.';
const order = (c) => nonEmpty(c).map((l) => l.match(/^(\d)\./)?.[1]).filter(Boolean);
const firstRecipe = (c) => {
  const o = order(c);
  return o.slice(0, 4).join('');
};

export const tarif = {
  id: 'tarif', icon: '🍲', title: 'Tarifi düzene sokun', minutes: 25, stage: 'notepad',
  desc: 'Orta seviye: karışık yazılmış bir tarifin adımlarını sıraya koymak, başlık ve malzeme eklemek, çoğaltıp değiştirmek, kaydetmek.',
  setup: preload(TARIF),
  summary: [
    ['Satır taşımak', 'Üç kez tıkla → Ctrl + X → yeni yere tıkla → Ctrl + V'],
    ['Araya satır eklemek', 'Satır sonunda Enter'],
    ['Seçip üzerine yazmak', 'Eski kelime kendiliğinden silinir'],
    ['Ctrl + Z', 'Bozulursa geri al'],
  ],
  steps: [
    {
      title: 'Karışık tarif',
      html: '<p>Bir mercimek çorbası tarifi aceleyle yazılmış ve adımlar <b>karışmış</b>. Bu derste tarifi düzenleyeceksiniz.</p><p>Nasıl yapılacağı yazmıyor; takılırsanız 💡 İpucu.</p>',
    },
    {
      title: 'Adımları sıraya koyun',
      html: '<p>Satırları taşıyarak adımları <b>1, 2, 3, 4</b> sırasına koyun.</p>',
      hint: `Bir satırı taşımak için: satıra üç kez tıklayıp ${K('Ctrl', 'X')} ile kesin, gideceği satırın başına tıklayıp ${K('Ctrl', 'V')}. Satırlar birleşirse araya ${K('Enter')}.`,
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        const o = firstRecipe(c);
        if (o.length === 4 && o !== '1234') c.note(`Şu anki sıra: <b>${o.split('').join(' · ')}</b>`);
        return o === '1234';
      },
      done: 'Adımlar sırada.',
    },
    {
      title: 'Malzemeleri ekleyin',
      html: '<p>Başlığın altına, adımlardan önce şu satırları ekleyin:</p>',
      target: 'Malzemeler: mercimek, soğan, havuç, tereyağı',
      hint: `Başlığın sonuna tıklayın (ya da ${K('End')}), ${K('Enter')}'a basıp yazın.`,
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        const ls = nonEmpty(c);
        const m = ls.findIndex((l) => closeEnough(l, 'Malzemeler: mercimek, soğan, havuç, tereyağı'));
        const s1 = ls.findIndex((l) => /^1\./.test(l));
        return m > 0 && s1 > m;
      },
      done: 'Malzemeler adımlardan önce geldi.',
    },
    yaz({ title: 'Son söz', html: '<p>Tarifin en altına yeni bir satır ekleyin:</p>', target: 'Afiyet olsun!', must: ['Afiyet', 'olsun', '!'], hint: `En sona gitmek için ${K('Ctrl', 'End')}.` }),
    {
      title: 'Tarifi çoğaltın',
      html: '<p>Komşunuz ezogelin çorbası istedi; tarif hemen hemen aynı. Bütün tarifi <b>kopyalayıp</b> altına, bir boş satırdan sonra <b>yapıştırın</b>.</p>',
      hint: `${K('Ctrl', 'A')}, ${K('Ctrl', 'C')}, ${K('Ctrl', 'End')}, ${K('Enter')} iki kez, ${K('Ctrl', 'V')}.`,
      on: (ev, c) => ev.type === 'input' && nonEmpty(c).filter((l) => /MERCİMEK ÇORBASI/.test(l)).length >= 2,
      done: 'İki tarif oldu.',
    },
    {
      title: 'İkinci başlığı değiştirin',
      html: '<p>İkinci tarifin başlığındaki <b>MERCİMEK</b> kelimesine çift tıklayıp seçin ve üzerine <b>EZOGELİN</b> yazın.</p>',
      hint: 'Kelime seçiliyken yazmaya başlayınca eski kelime silinir. Büyük harf için Caps Lock; büyük İ, Ş\'nin yanındaki tuştur.',
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('EZOGELİN ÇORBASI') && c.np.value.includes('MERCİMEK ÇORBASI'),
      done: 'Seçip üzerine yazmak, silip yeniden yazmaktan hızlıdır.',
    },
    {
      title: 'Kaydedin',
      html: '<p>Tarifleri <b>çorba tarifleri</b> adıyla kaydedin.</p>',
      hint: `${K('Ctrl', 'S')}, dosya adı, Kaydet.`,
      on: (ev) => ev.type === 'save',
      done: (c) => `Kaydedildi: <b>${c.np.fileName}</b>.`,
    },
    { final: true, title: 'Afiyet olsun! 🍲', html: '<p>Tarifi düzenlediniz. Kullandıklarınız:</p>' },
  ],
};

export const kaydetPratik = {
  id: 'kaydet-pratik', icon: '💾', title: 'Kaydetme, farklı kaydetme ve açma', minutes: 25, stage: 'notepad',
  desc: 'Doğru klasöre kaydetmek, değişikliği Ctrl + S ile kaydetmek, Farklı kaydet ile kopya almak, doğru dosyayı yeniden açmak.',
  summary: [
    ['Ctrl + S (ilk kez)', 'Ad ve klasör sorulur'],
    ['Ctrl + S (sonra)', 'Sormadan aynı dosyanın üzerine kaydeder'],
    ['Dosya → Farklı kaydet', 'Başka ad ya da klasörle yeni bir kopya'],
    ['Dosya → Aç (Ctrl + O)', 'Kayıtlı dosyayı açar'],
    ['Başlık çubuğu', 'Hangi dosyanın açık olduğunu gösterir; * kaydedilmemiş demek'],
  ],
  steps: [
    {
      title: 'Kaydet mi, farklı kaydet mi?',
      html: `<ul class="big-list"><li><b>Kaydet</b> (${K('Ctrl', 'S')}): ilk seferde ad ve yer sorar; sonrakilerde sormadan aynı dosyayı günceller.</li>
        <li><b>Farklı kaydet</b>: aynı yazıyı <b>başka bir adla</b> ya da <b>başka bir klasöre</b> yeni dosya olarak kaydeder. Asıl dosya değişmez.</li></ul>
        <p>Bu derste bir randevu notu yazıp ikisini de deneyeceğiz.</p>`,
    },
    yaz({ title: 'Bir not yazın', html: '<p>Not Defteri\'ne tıklayıp yazın:</p>', target: 'Doktor randevusu: Salı 10:30', must: ['randevu', '10:30'], hint: 'İki nokta: Shift + nokta.' }),
    {
      title: 'Belgeler\'e kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin. Açılan pencerede solda <b>Belgeler</b> seçili olsun, dosya adı <b>randevu</b>.</p>`,
      on: (ev, c) => {
        if (ev.type !== 'save') return false;
        if (!/Belgeler/.test(ev.label || ev.folder)) { c.warn(`Dosya <b>${ev.label || ev.folder}</b> klasörüne kaydedildi. Dosya → Farklı kaydet ile yeniden, bu sefer <b>Belgeler</b>'e kaydedin.`); return false; }
        c.L.ilk = ev.name;
        return true;
      },
      done: 'Başlık çubuğunda artık dosyanın adı yazıyor.',
    },
    {
      title: 'Değiştirip yeniden kaydedin',
      html: `<p>Notun altına yeni bir satır ekleyin: <b>Kimlik kartını unutma!</b></p><p>Başlıktaki <b>*</b> işaretine bakın, sonra ${K('Ctrl', 'S')}. Bu sefer hiçbir şey sorulmayacak.</p>`,
      on: (ev, c) => {
        if (ev.type === 'input' && !c.s.y) { c.s.y = true; c.note('Başlığa bakın: adın başında * çıktı. Şimdi Ctrl + S.'); }
        return ev.type === 'save' && ev.quick && /kimlik/i.test(c.np.value);
      },
      done: 'Sormadan kaydetti ve * kayboldu.',
    },
    {
      title: 'Farklı kaydet',
      html: '<p>Bu notun bir kopyasını masaüstüne koyalım. <b>Dosya → Farklı kaydet…</b> menüsünü açın, solda <b>Masaüstü</b>\'nü seçin, adı <b>randevu kopyası</b> yapıp kaydedin.</p>',
      mouse: '🖱 Dosya → Farklı kaydet…',
      on: (ev, c) => {
        if (ev.type !== 'save' || ev.quick) return false;
        if (!/Masaüstü/.test(ev.label || ev.folder)) { c.warn('Bu sefer solda <b>Masaüstü</b>\'nü seçin.'); return false; }
        return true;
      },
      done: 'Artık iki dosya var: Belgeler\'de “randevu”, Masaüstü\'nde “randevu kopyası”. Başlıkta açık olan kopyanın adı yazıyor.',
    },
    {
      title: 'Yeni sayfa',
      html: '<p><b>Dosya → Yeni</b> ile boş bir sayfa açın.</p>',
      on: (ev) => ev.type === 'new',
    },
    {
      title: 'Doğru dosyayı açın',
      html: (c) => `<p>${K('Ctrl', 'O')} ile açma penceresini açın. Solda <b>Belgeler</b>'i seçin ve <b>${(c.L.ilk || 'randevu').replace(/\.txt$/i, '')}</b> dosyasını açın.</p>`,
      on: (ev, c) => {
        if (ev.type !== 'open') return false;
        if (/kopya/i.test(ev.name)) { c.warn('Bu masaüstündeki kopyası. Belgeler\'deki asıl dosyayı açın.'); return false; }
        return /randevu/i.test(ev.name);
      },
      done: 'Asıl dosya açıldı; “Kimlik kartını unutma!” satırı da içinde.',
    },
    rehberSoru({
      title: 'Küçük soru',
      html: `<p>Şimdi “randevu” dosyasına bir satır ekleyip ${K('Ctrl', 'S')} yaparsanız hangi dosya değişir?</p>`,
      opts: ['Yalnızca Belgeler\'deki “randevu”', 'İkisi birden', 'Yalnızca masaüstündeki kopya'], ok: 0,
      why: 'Doğru! Farklı kaydedilen kopya ayrı bir dosyadır; birini değiştirmek diğerini etkilemez.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosyalarınızı nereye kaydettiğinizi artık biliyorsunuz:</p>' },
  ],
};

export const kopyaOyun = {
  id: 'kopya-oyun', icon: '🧩', title: 'Kısayol eşleştirme', minutes: 15, stage: 'scene',
  desc: 'Tekrar: hangi durumda Ctrl + C, X, V, Z? Hangi komut hangi menüde? Pano ve kaydetme soruları.',
  summary: [
    ['Ctrl + C', 'Kopyala: aslı yerinde kalır'],
    ['Ctrl + X', 'Kes: taşımanın ilk adımı'],
    ['Ctrl + V', 'Yapıştır: Pano\'dakini koyar'],
    ['Ctrl + Z', 'Geri al'],
    ['Dosya menüsü', 'Yeni, Aç, Kaydet, Yazdır'],
    ['Düzen menüsü', 'Geri al, Kes, Kopyala, Yapıştır, Tümünü seç'],
  ],
  steps: [
    { title: 'Ne yapacağız?', html: '<p>Not Defteri\'nde öğrendiklerimizi kartlar ve sorularla tekrar edeceğiz.</p>', scene: info('<div class="sc-big">📋 ✂ 📌</div><p>Kısayol eşleştirme</p>') },
    ayir({
      title: 'Hangi kısayol?',
      html: '<p>Her kartta bir durum var. Bu durumda hangi kısayolu kullanırsınız?</p>',
      bins: [{ id: 'c', label: 'Ctrl + C', icon: '⧉' }, { id: 'x', label: 'Ctrl + X', icon: '✂' }, { id: 'v', label: 'Ctrl + V', icon: '📋' }, { id: 'z', label: 'Ctrl + Z', icon: '↶' }],
      items: [
        { label: 'Adresi mesaja da koyacağım, aslı kalsın', icon: '🏠', bin: 'c', why: 'Aslı yerinde kalsın istiyorsak kopyalarız.' },
        { label: 'Aynı yazıyı çoğaltmanın ilk adımı', icon: '➕', bin: 'c', why: 'Önce kopyalanır, sonra istenen kadar yapıştırılır.' },
        { label: 'Satırı başka yere taşımanın ilk adımı', icon: '↕', bin: 'x', why: 'Taşımak için önce keseriz.' },
        { label: 'Yazıyı yerinden alıp Pano\'ya koymak', icon: '📤', bin: 'x', why: 'Kesmek yazıyı yerinden alır.' },
        { label: 'Pano\'daki yazıyı imlecin yerine koymak', icon: '📥', bin: 'v', why: 'Yapıştırmak Pano\'dakini koyar.' },
        { label: 'Kopyaladığım numarayı forma yerleştirmek', icon: '📝', bin: 'v', why: 'Kopyalanan yazı yapıştırılarak yerleştirilir.' },
        { label: 'Yanlışlıkla sildiğimi geri getirmek', icon: '😱', bin: 'z', why: 'Geri al, son yapılanı geri alır.' },
        { label: 'Son yaptığımdan vazgeçmek', icon: '↩', bin: 'z', why: 'Geri al.' },
      ],
      done: 'Kopyala-Kes-Yapıştır-Geri al: bilgisayarın en çok kullanılan dört kısayolu.',
    }),
    ayir({
      title: 'Hangi menüde?',
      html: '<p>Not Defteri\'nin üstündeki menülerde bu komutlar nerede? Kartları doğru menüye sürükleyin.</p>',
      bins: [{ id: 'dosya', label: 'Dosya', icon: '📄' }, { id: 'duzen', label: 'Düzen', icon: '✏' }, { id: 'gorunum', label: 'Görünüm', icon: '🔍' }],
      items: [
        { label: 'Kaydet', icon: '💾', bin: 'dosya', why: 'Dosyayla ilgili işler Dosya menüsündedir.' },
        { label: 'Aç', icon: '📂', bin: 'dosya', why: 'Dosya → Aç.' },
        { label: 'Yeni', icon: '🆕', bin: 'dosya', why: 'Dosya → Yeni.' },
        { label: 'Yazdır', icon: '🖨', bin: 'dosya', why: 'Dosya → Yazdır.' },
        { label: 'Geri al', icon: '↶', bin: 'duzen', why: 'Yazıyı düzenleme işleri Düzen menüsündedir.' },
        { label: 'Kopyala', icon: '⧉', bin: 'duzen', why: 'Düzen → Kopyala.' },
        { label: 'Tümünü seç', icon: '▦', bin: 'duzen', why: 'Düzen → Tümünü seç.' },
        { label: 'Yakınlaştır', icon: '🔍', bin: 'gorunum', why: 'Görünüm, yazının ekranda nasıl göründüğünü değiştirir.' },
        { label: 'Uzaklaştır', icon: '🔎', bin: 'gorunum', why: 'Görünüm → Uzaklaştır.' },
      ],
      done: 'Kısayolu unutursanız menülerde yanında yazar.',
    }),
    sec({
      title: 'Pano\'da ne var?', text: '<div class="qz-pic">elma 📋 armut</div>',
      q: 'Önce “elma”yı, sonra “armut”u kopyaladınız. Ctrl + V neyi yapıştırır?',
      opts: ['elma', 'armut', 'İkisini birden'], ok: 1,
      why: 'Pano\'da tek bir şey durur: en son kopyalanan. Yeni kopya eskisinin yerini alır.',
    }),
    sec({
      title: 'Kesip unutmak', text: '<div class="qz-pic">✂ … ⏻</div>',
      q: 'Bir paragrafı kestiniz ama yapıştırmadan bilgisayarı kapattınız. Ne olur?',
      opts: ['Paragraf kaybolur; Pano kapanınca boşalır', 'Paragraf masaüstüne kaydedilir', 'Paragraf yerine geri döner'], ok: 0,
      why: 'Pano geçicidir. Kestiğiniz yazıyı hemen yapıştırın; emin değilseniz kesmek yerine kopyalayın.',
    }),
    sec({
      title: 'Kapatırken çıkan soru', text: '<div class="qz-pic">💾 ?<small>Kaydet · Kaydetme · İptal</small></div>',
      q: 'Not Defteri\'ni kapatırken “Değişiklikler kaydedilsin mi?” diye soruyor. <b>Kaydetme</b>\'ye basarsanız ne olur?',
      opts: ['Son kayıttan sonraki değişiklikler kaybolur', 'Dosya silinir', 'Program kapanmaz'], ok: 0,
      why: 'Kaydet: değişiklikler kaydedilir. Kaydetme: değişiklikler atılır. İptal: kapatmaktan vazgeçilir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kısayolları ve menüleri iyi biliyorsunuz:</p>', scene: info('<div class="sc-big">🏆</div>') },
  ],
};
