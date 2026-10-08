// Orta seviye alıştırmalar: ilk derslerde adım adım öğrenilenleri daha az yönlendirmeyle tekrar ettirir.
// Klavye resminde ipucu yanmaz, nasıl yapılacağı yazmaz; takılan öğrenci 💡 İpucu'na bakar.
import { K, lines, closeEnough, desktopReady, put, PIC } from './common.js';
import { sorter, quiz } from './scenes.js';
import { keyLabel } from '../keyboard.js';
import { RECYCLE, USB } from '../vfs.js';

const info = (html) => (el) => { el.className = 'sc sc-info'; el.innerHTML = html; };

// ---------------------------------------------------------------- 1. hafta: eşleştirme oyunları

export const eslestir = {
  id: 'eslestir', icon: '🧩', title: 'Eşleştirme oyunları', minutes: 15, stage: 'scene',
  desc: 'Tekrar: hangi iş hangi fare hareketiyle yapılır? Uyku mu, Kapat mı, Yeniden başlat mı? Kartları sürükleyerek ayırın.',
  summary: [
    ['Tek tık', 'Seçmek, düğmeye basmak'],
    ['Çift tık', 'Açmak (program, dosya, klasör)'],
    ['Sağ tık', 'Menü: Kopyala, Sil, Yeniden adlandır…'],
    ['Sürükle-bırak', 'Taşımak: dosyayı klasöre, pencereyi başka yere'],
    ['Uyku', 'Kısa ara; açık işler bekler'],
    ['Kapat', 'İş bitti, uzun süre kullanılmayacak'],
    ['Yeniden başlat', 'Takılma, donma, güncelleme sonrası'],
  ],
  steps: [
    {
      title: 'Ne yapacağız?',
      html: `<p>Geçen hafta fareyi ve bilgisayarı açıp kapatmayı öğrendik. Şimdi bildiklerimizi bir oyunla tekrar edeceğiz.</p>
        <p>Yandaki kartları <b>tutup doğru kutuya sürükleyeceksiniz</b>. Yanlış kutuya bırakırsanız kart geri döner ve nedeni yazar.</p>`,
      scene: info('<div class="sc-big">🃏 ➜ 📦</div><p>Tut · Taşı · Bırak</p>'),
    },
    {
      title: 'Hangi fare hareketi?',
      html: '<p>Her kartta bir iş yazıyor. Bu iş fareyle <b>nasıl</b> yapılır? Kartı doğru kutuya sürükleyin.</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'tek', label: 'Tek tık', icon: '👆' }, { id: 'cift', label: 'Çift tık', icon: '✌' }, { id: 'sag', label: 'Sağ tık', icon: '📋' }, { id: 'surukle', label: 'Sürükle-bırak', icon: '✋' }],
        items: [
          { label: 'Başlat\'ı açmak', icon: '⊞', bin: 'tek', why: 'Düğmelere bir kez tıklanır.' },
          { label: 'Simgeyi seçmek', icon: '🔵', bin: 'tek', why: 'Tek tık seçer; simge maviye boyanır.' },
          { label: 'Pencereyi küçültmek (—)', icon: '🪟', bin: 'tek', why: 'Pencere düğmelerine bir kez tıklanır.' },
          { label: 'Masaüstündeki programı açmak', icon: '📝', bin: 'cift', why: 'Masaüstündeki simgeler çift tıkla açılır.' },
          { label: 'Klasörü açmak', icon: '📁', bin: 'cift', why: 'Klasörün içine girmek için çift tıklanır.' },
          { label: 'Bir kelimeyi seçmek', icon: '🔤', bin: 'cift', why: 'Yazıda kelimenin üzerine çift tıklayınca o kelime seçilir.' },
          { label: 'Dosyanın adını değiştirmek', icon: '✏', bin: 'sag', why: 'Sağ tık → Yeniden adlandır.' },
          { label: 'Yazıyı kopyalamak (kısayolsuz)', icon: '⧉', bin: 'sag', why: 'Seçili yazıya sağ tık → Kopyala.' },
          { label: 'Dosyayı klasöre koymak', icon: '📄', bin: 'surukle', why: 'Dosyayı tutup klasörün üzerine bırakırız.' },
          { label: 'Pencereyi başka yere taşımak', icon: '↔', bin: 'surukle', why: 'Başlık çubuğundan tutup sürükleriz.' },
          { label: 'Dosyayı çöpe atmak', icon: '🗑', bin: 'surukle', why: 'Geri Dönüşüm Kutusu\'nun üzerine sürükleyip bırakabiliriz (ya da Delete).' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Hepsi yerinde! Kural kısaca: <b>tek tık seçer, çift tık açar, sağ tık menü getirir, sürüklemek taşır.</b>',
    },
    {
      title: 'Uyku mu, Kapat mı, Yeniden başlat mı?',
      html: '<p>Her kartta bir durum yazıyor. Bu durumda bilgisayara ne yaparsınız?</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'uyku', label: 'Uyku', icon: '🌙' }, { id: 'kapat', label: 'Kapat', icon: '⏻' }, { id: 'yeniden', label: 'Yeniden başlat', icon: '🔄' }],
        items: [
          { label: 'Öğle yemeğine kalkıyorum, işim yarım', icon: '🍽', bin: 'uyku', why: 'Kısa ara: Uyku açık işleri bekletir.' },
          { label: 'Telefon geldi, 10 dakika sonra dönerim', icon: '📞', bin: 'uyku', why: 'Kısa ara: Uyku yeter.' },
          { label: 'Akşam oldu, işim bitti', icon: '🌆', bin: 'kapat', why: 'Gün bitti: bilgisayar kapatılır.' },
          { label: 'Birkaç günlüğüne tatile gidiyorum', icon: '🧳', bin: 'kapat', why: 'Uzun süre kullanılmayacak: kapatılır.' },
          { label: 'Fırtına var, elektrik kesilebilir', icon: '⛈', bin: 'kapat', why: 'Elektrik gidip gelirken bilgisayarı kapatmak en güvenlisidir.' },
          { label: 'Program dondu, hiçbir şey tıklanmıyor', icon: '🧊', bin: 'yeniden', why: 'Takılan bilgisayara önce Yeniden başlat denenir.' },
          { label: 'Güncelleme “yeniden başlatın” diyor', icon: '⬆', bin: 'yeniden', why: 'Güncellemeler yeniden başlatınca tamamlanır.' },
          { label: 'Bilgisayar çok yavaşladı', icon: '🐢', bin: 'yeniden', why: 'Yeniden başlatmak çoğu zaman hızlandırır.' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Fişi çekmek ise hiçbir zaman ilk seçenek değildir!',
    },
    {
      title: 'Pencere düğmeleri',
      html: '<p>Pencerenin sağ üst köşesindeki üç düğme ne işe yarar? Kartları doğru kutuya sürükleyin.</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'min', label: '— Küçült', icon: '' }, { id: 'max', label: '☐ Ekranı kapla', icon: '' }, { id: 'kapat', label: '✕ Kapat', icon: '' }],
        items: [
          { label: 'Pencere görev çubuğuna iner', icon: '⬇', bin: 'min', why: '— küçültür; program kapanmaz.' },
          { label: 'Program açık kalır ama görünmez', icon: '🙈', bin: 'min', why: 'Küçülen program görev çubuğunda bekler.' },
          { label: 'Pencere bütün ekranı kaplar', icon: '⬛', bin: 'max', why: '☐ pencereyi en büyük hale getirir.' },
          { label: 'Yazılar daha rahat okunsun', icon: '👓', bin: 'max', why: 'Büyük pencerede daha çok yer olur.' },
          { label: 'Program tamamen kapanır', icon: '🚪', bin: 'kapat', why: '✕ programı kapatır; kaydedilmemiş iş varsa sorar.' },
          { label: 'İşim bitti, bir daha açmayacağım', icon: '✅', bin: 'kapat', why: 'İşi biten programı ✕ ile kapatırız.' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Küçültmek ile kapatmak farklıdır: küçülen pencere görev çubuğundan geri gelir.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bildiklerinizi tekrar ettiniz. Kısaca:</p>', scene: info('<div class="sc-big">🎉</div>') },
  ],
};

// ---------------------------------------------------------------- 2. hafta: tuş avı ve kart yazma

const MODS = ['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'CapsLock'];

// Soruyu okuyup tuşu kendisi bulması gereken adım (ekrandaki klavyede sarı ipucu yanmaz)
function av({ title, q, codes, hint, done }) {
  return {
    title, hint, done,
    html: `<p>${q}</p><p class="mut">Tuşu gerçek klavyenizde bulun ve <b>bir kez</b> basın. Önce Not Defteri'nin beyaz alanına tıklayın.</p>`,
    on: (ev, c) => {
      if (ev.type !== 'key' || ev.e.repeat) return false;
      if (codes.includes(ev.e.code)) return true;
      if (ev.e.key.length > 1 && !MODS.includes(ev.e.key)) c.warn(`Bastığınız tuş: <kbd>${keyLabel(ev.e.code)}</kbd>. Bu değil; bir daha deneyin.`);
      return false;
    },
  };
}

export const tusavi = {
  id: 'tusavi', icon: '🎯', title: 'Tuş avı', minutes: 20, stage: 'notepad',
  desc: 'Orta seviye: ekranda ipucu yanmadan, sorulan tuşu kendiniz bulun. Sonunda işaretler ve e-posta adresi.',
  summary: [
    ['Enter', 'Alt satır'],
    ['⌫ Backspace / Delete', 'Soldakini / sağdakini siler'],
    ['Caps Lock', 'Büyük harf kilidi'],
    ['Home / End', 'Satırın başı / sonu'],
    ['Esc', 'Vazgeç, menüyü kapat'],
    ['Shift', 'Basılı tutunca büyük harf ve tuşun üstündeki işaret'],
    ['AltGr', 'Tuşun sağ altındaki işaret: @ (AltGr + Q)'],
  ],
  steps: [
    {
      title: 'Tuş avı',
      html: `<p>Geçen hafta klavyenin önemli tuşlarını tanıdık. Bu sefer işin zor kısmı sizde: <b>ekrandaki klavyede sarı ışık yanmayacak.</b></p>
        <p>Her adımda bir tuş tarif edilecek. O tuşu gerçek klavyenizde bulup basacaksınız. Bastığınız tuş, aşağıdaki resimde mavi yanar.</p>
        <p>Takılırsanız <b>💡 İpucu</b> düğmesine basın.</p>`,
    },
    av({ title: 'Alt satır', q: 'Yazarken <b>alt satıra geçmeye</b> yarayan tuş hangisi?', codes: ['Enter', 'NumpadEnter'], hint: 'Klavyenin sağ tarafında, büyük, üzerinde ↵ işareti olan tuş.', done: 'Enter. Pencerelerde “Tamam” demek için de kullanılır.' }),
    av({ title: 'Boşluk', q: 'İki kelimenin <b>arasına boşluk</b> koyan tuş hangisi?', codes: ['Space'], hint: 'Klavyenin en altındaki en uzun tuş.', done: 'Boşluk tuşu. Başparmakla basılır.' }),
    av({ title: 'Soldakini silmek', q: 'İmlecin <b>solundaki</b> harfi silen tuş hangisi?', codes: ['Backspace'], hint: 'Rakamların sağ ucunda, üzerinde ← ya da “Backspace” yazan uzun tuş.', done: 'Backspace geriye doğru siler.' }),
    av({ title: 'Sağdakini silmek', q: 'İmlecin <b>sağındaki</b> harfi silen tuş hangisi?', codes: ['Delete'], hint: 'Üzerinde “Delete” ya da “Del” yazar. Genellikle Backspace\'in sağında ya da aşağısındadır.', done: 'Delete ileriye doğru siler. Dosya Gezgini\'nde de seçili dosyayı siler.' }),
    av({ title: 'Büyük harf kilidi', q: 'Basınca <b>her şeyi büyük harfle</b> yazdıran, bir daha basınca kapanan tuş hangisi?', codes: ['CapsLock'], hint: 'Klavyenin sol tarafında, A harfinin solunda.', done: 'Caps Lock. Unutmayın: açık kalırsa şifreniz yanlış yazılır. Şimdi bir kez daha basıp kapatın.' }),
    av({ title: 'Satırın başı', q: 'İmleci <b>satırın en başına</b> götüren tuş hangisi?', codes: ['Home'], hint: 'Üzerinde “Home” yazar. Dizüstü bilgisayarlarda Fn tuşuyla birlikte basmak gerekebilir.', done: 'Home: satır başı.' }),
    av({ title: 'Satırın sonu', q: 'İmleci <b>satırın en sonuna</b> götüren tuş hangisi?', codes: ['End'], hint: 'Üzerinde “End” yazar; Home\'un yakınındadır.', done: 'End: satır sonu.' }),
    av({ title: 'Vazgeçmek', q: 'Açılan bir menüyü ya da pencereyi <b>kapatıp vazgeçmeye</b> yarayan “kaçış” tuşu hangisi?', codes: ['Escape'], hint: 'Klavyenin en sol üst köşesindeki “Esc” tuşu.', done: 'Esc: bir şey yanlışlıkla açıldığında ilk denenecek tuş.' }),
    av({ title: 'Basılı tutulan tuş', q: '<b>Tek bir büyük harf</b> yazmak için basılı tutulan tuş hangisi?', codes: ['ShiftLeft', 'ShiftRight'], hint: 'Caps Lock\'ın hemen altında, üzerinde ⇧ oku olan tuş. Sağda da bir tane vardır.', done: 'Shift. Basılı tutarken tuşların üstündeki işaretleri de yazar (Shift + 1 = !).' }),
    av({ title: '@ için tuş', q: '<b>@</b> işaretini yazarken Q ile birlikte basılı tutulan tuş hangisi?', codes: ['AltRight'], hint: 'Boşluk tuşunun hemen sağındaki <b>AltGr</b> tuşu.', done: 'AltGr. Tuşların sağ altındaki işaretleri yazar.' }),
    {
      title: 'İşaretler',
      html: '<p>Yeni bir satıra şu cümleyi yazın. Soru işaretini ve ünlemi unutmayın:</p>',
      target: 'Geliyor musun? Evet, geliyorum!',
      hint: `? için ${K('Shift', '*')}, ! için ${K('Shift', '1')}. Virgül, M harfinin sağındaki iki tuştan sağdakidir.`,
      on: (ev, c) => ev.type === 'input' && lines(c.np.value).some((l) => closeEnough(l, 'Geliyor musun? Evet, geliyorum!') && /\?/.test(l) && /!/.test(l) && l.includes(',')),
      done: 'İşaretleri doğru yazdınız.',
    },
    {
      title: 'E-posta adresi',
      html: '<p>Yeni bir satıra şu e-posta adresini <b>hatasız</b> yazın. E-posta adreslerinde Türkçe harf ve boşluk olmaz.</p>',
      target: 'ayse.kaya@ornek.com',
      hint: `@ için ${K('AltGr', 'Q')}. Nokta, sağ alttaki <kbd>.</kbd> tuşudur. Adreste noktasız ı yok: <b>i</b> değil, <b>y</b> ile <b>s</b> arasında <b>e</b> var.`,
      on: (ev, c) => ev.type === 'input' && lines(c.np.value).some((l) => l.toLowerCase() === 'ayse.kaya@ornek.com'),
      done: 'Kusursuz! E-posta adresinde tek harf hatası bile mesajın gitmemesine yol açar.',
    },
    {
      title: 'Büyük Türkçe harfler',
      html: '<p>Yeni bir satıra şu adresi <b>büyük harflerle</b> yazın:</p>',
      target: 'İSTANBUL ÜSKÜDAR ÇAMLICA',
      hint: 'Caps Lock\'ı açın. İ, Ş\'nin yanındaki tuştur; I (noktasız) ise O\'nun solundadır. Bitince Caps Lock\'ı kapatmayı unutmayın.',
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('İSTANBUL') && c.np.value.includes('ÜSKÜDAR') && c.np.value.includes('ÇAMLICA'),
      done: 'İ ile I farkını da doğru yaptınız.',
    },
    { final: true, title: 'Avı tamamladınız! 🎯', html: '<p>Bulduğunuz tuşlar:</p>' },
  ],
};

// Bir satırı yazdırır; Enter'a basınca eksik kelime/işaret varsa söyler
const ISARET = { ',': 'virgül (,)', '.': 'nokta (.)', '!': 'ünlem (!)', '?': 'soru işareti (?)' };

function satir({ title, html, target, must, hint, done }) {
  const ok = (l) => must.every((m) => l.includes(m));
  return {
    title, target, hint, done,
    html: html || '<p>Yeni bir satıra yazın (büyük harflere ve işaretlere dikkat):</p>',
    on: (ev, c) => {
      if (ev.type !== 'input') return false;
      const ls = lines(c.np.value);
      if (ls.some(ok)) return true;
      if (ev.inputType === 'insertLineBreak') {
        const near = ls.find((l) => closeEnough(l, target));
        const miss = near && must.filter((m) => !near.includes(m));
        if (miss?.length) c.warn(`Neredeyse oldu! Şunları kontrol edin: ${miss.map((m) => `<b>${ISARET[m] || m}</b>`).join(' · ')}. İmleci oraya götürüp düzeltin.`);
      }
      return false;
    },
  };
}

const HATALI = 'Bugun hava cok guzel. Aksam yemege geliyoruz.';
const DOGRU = 'Bugün hava çok güzel. Akşam yemeğe geliyoruz.';
const FIX = ['Bugün', 'çok', 'güzel', 'Akşam', 'yemeğe'];

export const kart = {
  id: 'kart', icon: '💌', title: 'Bayram kartı yazalım', minutes: 25, stage: 'notepad',
  desc: 'Orta seviye: büyük harf, Türkçe harfler ve noktalama ile bir mesaj yazmak, yazım hatalarını düzeltmek, kaydetmek.',
  summary: [
    ['Cümle başı', 'Büyük harfle başlar (Shift)'],
    ['Cümle sonu', 'Nokta (.), soru (?) ya da ünlem (!)'],
    ['Kesme işareti (\')', 'Shift + 2: İzmir\'e, Ayşe\'ye'],
    ['Hatayı düzeltmek', 'Fareyle tıklayın ya da oklarla gidin, Backspace ile silip doğrusunu yazın'],
    ['Ctrl + S', 'Kaydet'],
  ],
  steps: [
    {
      title: 'Ne yazacağız?',
      html: `<p>Bayramda bir yakınımıza gönderilecek kısa bir mesaj yazacağız. Bu sefer klavyede sarı ipucu yok.</p>
        <ul class="big-list"><li>Cümleler <b>büyük harfle</b> başlar.</li><li>Sonunda <b>nokta, soru ya da ünlem</b> olur.</li><li>Türkçe harfleri (ç, ğ, ı, ö, ş, ü) doğru kullanın.</li></ul>
        <p>Her satırdan sonra ${K('Enter')}'a basın.</p>`,
    },
    satir({ title: 'Hitap', target: 'Sevgili Ayşe Teyze,', must: ['Sevgili', 'Ayşe', 'Teyze', ','], html: '<p>Not Defteri\'ne tıklayın ve ilk satıra yazın:</p>', hint: 'Virgül, M harfinin sağındaki iki tuştan sağdakidir (Ö\'nün yanında değil). Ş, L\'nin sağındaki ikinci tuştur.', done: 'Hitap tamam.' }),
    satir({ title: 'Kutlama', target: 'Bayramınız kutlu olsun!', must: ['Bayramınız', 'kutlu', 'olsun', '!'], hint: `Ünlem: ${K('Shift', '1')}. Noktasız ı, O\'nun solundaki I tuşudur.`, done: 'Güzel.' }),
    satir({ title: 'Soru', target: 'İzmir\'e ne zaman geliyorsunuz?', must: ['İzmir\'e', 'geliyorsunuz', '?'], hint: `Büyük İ: ${K('Shift', 'İ')}. Kesme işareti (\'): ${K('Shift', '2')}. Soru işareti: ${K('Shift', '*')}.`, done: 'Kesme işaretini de doğru koydunuz.' }),
    satir({ title: 'Kapanış', target: 'Ellerinizden öperim.', must: ['Ellerinizden', 'öperim', '.'], hint: 'Ö, Ğ\'nin altındaki tuştur. Nokta sağ alttaki <kbd>.</kbd> tuşudur.', done: 'Neredeyse bitti.' }),
    {
      title: 'İmza',
      html: '<p>En alta kendi adınızı yazın. Adınız büyük harfle başlasın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        const ls = lines(c.np.value).filter(Boolean);
        const i = ls.findIndex((l) => l.includes('öperim'));
        return i >= 0 && ls.slice(i + 1).some((l) => /^\p{Lu}\p{Ll}+/u.test(l));
      },
      done: 'Mesajınız hazır!',
    },
    {
      title: 'Hata avı',
      html: `<p>Mesajın altına aceleyle yazılmış bir not eklendi. Bu notta <b>5 kelimede Türkçe harf hatası</b> var.</p>
        <p>Hatalı harfin yanına tıklayın ya da ok tuşlarıyla gidin, ${K('⌫ Backspace')} ile silin, doğrusunu yazın.</p>`,
      target: DOGRU,
      hint: 'Düzeltilecekler: Bugun → Bugün, cok → çok, guzel → güzel, Aksam → Akşam, yemege → yemeğe.',
      setup: (c) => { if (!/Bugun|Bugün hava/.test(c.np.value)) c.np.setText(c.np.value.replace(/\s*$/, '') + '\n\n' + HATALI); },
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        const v = c.np.value.replace(/[ \t]+/g, ' ');
        if (v.includes(DOGRU)) return true;
        const n = FIX.filter((w) => v.includes(w)).length;
        if (n !== c.s.n) { c.s.n = n; c.note(`Düzeltilen kelime: <b>${n} / 5</b>`); }
        return false;
      },
      done: 'Bütün hataları buldunuz.',
    },
    {
      title: 'Kaydedin',
      html: `<p>Mesajı <b>bayram kartı</b> adıyla kaydedin.</p>`,
      hint: `${K('Ctrl', 'S')} ya da Dosya → Kaydet. Dosya adı kutusuna <b>bayram kartı</b> yazıp Kaydet'e tıklayın.`,
      on: (ev) => ev.type === 'save',
      done: (c) => `Kaydedildi: <b>${c.np.fileName || 'bayram kartı'}</b>.`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk mektubunuzu yazdınız. Hatırlatmalar:</p>' },
  ],
};

// ---------------------------------------------------------------- 3. hafta: liste düzenleme

const LISTE = 'ALIŞVERİŞ LİSTESİ\nEkmek\nDomates\nSüt\nPeynir\nDeterjan';
const items = (c) => lines(c.np.value).filter(Boolean);
const at = (c, w) => items(c).findIndex((l) => closeEnough(l, w));
const count = (c, w) => items(c).filter((l) => closeEnough(l, w)).length;

export const liste = {
  id: 'liste', icon: '🛒', title: 'Alışveriş listesini düzenleyin', minutes: 25, stage: 'notepad',
  desc: 'Orta seviye: hazır bir listede satır taşıma, ekleme, silme, geri alma, çoğaltma ve kaydetme. Nasıl yapılacağı yazmaz.',
  setup: (c) => { if (!c.np.value.trim()) c.np.setText(LISTE); },
  summary: [
    ['Çift tık', 'Kelimeyi seç'],
    ['Üç kez tık', 'Bütün satırı seç'],
    ['Shift + End', 'İmleçten satır sonuna kadar seç'],
    ['Ctrl + X → Ctrl + V', 'Taşı'],
    ['Ctrl + C → Ctrl + V', 'Çoğalt'],
    ['Seçip yazmak', 'Seçili yazının yerine yenisi yazılır'],
    ['Ctrl + Z', 'Geri al'],
  ],
  steps: [
    {
      title: 'Görevler',
      html: `<p>Yandaki Not Defteri'nde hazır bir alışveriş listesi var. Geçen hafta öğrendiğiniz kısayollarla onu düzenleyeceksiniz.</p>
        <p>Bu derste <b>nasıl yapılacağı yazmıyor</b>; yalnızca ne yapılacağı yazıyor. Takılırsanız <b>💡 İpucu</b>'na bakın.</p>
        <p class="mut">Liste bozulursa telaşlanmayın: ${K('Ctrl', 'Z')} her zaman yanınızda.</p>`,
    },
    {
      title: 'Süt en üste',
      html: '<p>Sütü unutmayalım: <b>Süt</b> satırını listenin başına, başlığın hemen altına <b>taşıyın</b>.</p>',
      hint: `Süt'e çift tıklayıp ${K('Ctrl', 'X')} ile kesin. Ekmek'in başına tıklayın, ${K('Ctrl', 'V')} ile yapıştırın, sonra ${K('Enter')}'a basın.`,
      on: (ev, c) => ev.type === 'input' && at(c, 'Süt') === 1 && count(c, 'Süt') === 1,
      done: 'Kes-yapıştır ile taşıdınız. Arada boş satır kaldıysa önemli değil.',
    },
    {
      title: 'Yumurta ekleyin',
      html: '<p><b>Peynir</b>\'in hemen altına yeni bir satır olarak <b>Yumurta</b> ekleyin.</p>',
      hint: `Peynir kelimesinin sonuna tıklayın (ya da ${K('End')}), ${K('Enter')}'a basın ve yazın.`,
      on: (ev, c) => ev.type === 'input' && at(c, 'Peynir') >= 0 && at(c, 'Yumurta') === at(c, 'Peynir') + 1,
      done: 'Eklendi.',
    },
    {
      title: 'Deterjanı silin',
      html: '<p>Deterjan evde varmış. <b>Deterjan</b> satırını silin.</p>',
      hint: `Satırı seçmenin hızlı yolu: satırın üzerine <b>üç kez</b> hızlıca tıklayın ya da satırın başına tıklayıp ${K('Shift', 'End')}. Sonra ${K('Delete')}.`,
      on: (ev, c) => ev.type === 'input' && count(c, 'Deterjan') === 0 && items(c).every((l) => ['ALIŞVERİŞ LİSTESİ', 'Ekmek', 'Domates', 'Süt', 'Peynir', 'Yumurta'].some((w) => closeEnough(l, w))),
      done: 'Silindi.',
    },
    {
      title: 'Fikir değiştirdiniz',
      html: '<p>Deterjan bitmiş! Sildiğiniz satırı <b>yeniden yazmadan</b> geri getirin.</p>',
      hint: `${K('Ctrl', 'Z')}. Bir kez yetmezse birkaç kez basın.`,
      on: (ev, c) => {
        if (ev.type === 'input' && ev.inputType === 'insertText') c.warn(`Yazmadan geri getirmeyi deneyin. Yazdığınızı silip ${K('Ctrl', 'Z')}'ye basın.`);
        return ev.type === 'undo' && count(c, 'Deterjan') === 1;
      },
      done: 'Geri geldi. Geri alma, yanlışlıkla silinen yazılar için de işe yarar.',
    },
    {
      title: 'Komşuya da bir liste',
      html: '<p>Komşunuz da aynı şeyleri istedi. Listenin <b>tamamını kopyalayıp</b> en alta, bir boş satır bıraktıktan sonra <b>yapıştırın</b>.</p>',
      hint: `${K('Ctrl', 'A')} ile hepsini seçin, ${K('Ctrl', 'C')} ile kopyalayın. ${K('Ctrl', 'End')} ile en sona gidin, ${K('Enter')}'a iki kez basın, ${K('Ctrl', 'V')}.`,
      on: (ev, c) => ev.type === 'input' && ev.inputType === 'insertFromPaste' && count(c, 'ALIŞVERİŞ LİSTESİ') >= 2,
      done: 'Liste çoğaldı. Pano\'daki yazı istediğiniz kadar yapıştırılabilir.',
    },
    {
      title: 'İkinci başlığı değiştirin',
      html: '<p>İkinci listenin başlığını <b>KOMŞUNUN LİSTESİ</b> yapın. Başlığı silip yazmayın: <b>seçip üzerine yazın</b>.</p>',
      target: 'KOMŞUNUN LİSTESİ',
      hint: 'İkinci başlığa üç kez tıklayıp seçin. Seçiliyken yazmaya başlayınca eski yazı kendiliğinden silinir. Büyük harf için Caps Lock.',
      on: (ev, c) => ev.type === 'input' && count(c, 'ALIŞVERİŞ LİSTESİ') === 1 && items(c).some((l) => closeEnough(l, 'KOMŞUNUN LİSTESİ')),
      done: 'Seçili yazının üzerine yazmak, silip yeniden yazmaktan hızlıdır.',
    },
    {
      title: 'Kaydedin',
      html: '<p>Listeyi <b>market listesi</b> adıyla kaydedin.</p>',
      hint: `${K('Ctrl', 'S')}, ad kutusuna <b>market listesi</b>, Kaydet.`,
      on: (ev) => ev.type === 'save',
      done: (c) => `Kaydedildi: <b>${c.np.fileName}</b>.`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Listeyi kısayollarla düzenlediniz. Yeni öğrendikleriniz:</p>' },
  ],
};

// ---------------------------------------------------------------- 4. hafta: bilgisayar ilanı okuma

const ilan = (name, rows) => `<div class="ilan"><h4>${name}</h4><table>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table></div>`;
const ILAN = ilan('💻 Kuzey K15 dizüstü bilgisayar', [
  ['İşlemci', '8 çekirdek, 4,2 GHz'],
  ['Bellek (RAM)', '16 GB'],
  ['Depolama', '512 GB SSD'],
  ['Ekran', '15,6 inç'],
  ['İşletim sistemi', 'Windows 11 Home'],
  ['Bağlantılar', '2 × USB, HDMI, kulaklık girişi, Wi-Fi'],
]);
const IKI = `<div class="ilan-2">${ilan('A bilgisayarı', [['RAM', '8 GB'], ['Depolama', '256 GB SSD'], ['Fiyat', '18.000 TL']])}${ilan('B bilgisayarı', [['RAM', '16 GB'], ['Depolama', '1 TB SSD'], ['Fiyat', '24.000 TL']])}</div>`;

function ilanSoru({ title, text = ILAN, q, opts, ok, why }) {
  return {
    title,
    html: '<p>Yandaki ilanı okuyun ve soruyu cevaplayın.</p>',
    scene: quiz({ kind: 'plain', text, question: q, options: opts.map((o, i) => [String(i), o]), correct: String(ok), explain: why, column: true, shuffle: true }),
    on: (ev, c) => {
      if (ev.type === 'quiz' && !ev.ok) c.warn('Bu sefer olmadı. Açıklamayı okuyun ve yeniden deneyin.');
      return ev.type === 'quiz' && ev.ok;
    },
    done: 'Doğru!',
  };
}

export const ilanOku = {
  id: 'ilan', icon: '🏷', title: 'Bilgisayar ilanını okuyalım', minutes: 20, stage: 'scene',
  desc: 'Orta seviye: KB, MB, GB, TB ne demek? Kalıcı ve geçici bellek; bir bilgisayar ilanında RAM, disk ve ekran boyutunu okumak.',
  summary: [
    ['KB → MB → GB → TB', 'Her biri bir öncekinin yaklaşık 1000 katı'],
    ['Bir fotoğraf', 'Yaklaşık 3–5 MB'],
    ['RAM (GB)', 'Aynı anda kaç işi rahat yapacağı; kapanınca boşalır'],
    ['Depolama (SSD/HDD)', 'Dosyaların kalıcı durduğu yer; ne kadar çok GB, o kadar çok dosya'],
    ['SSD', 'HDD\'den çok daha hızlı ve sessiz'],
    ['inç', 'Ekranın köşeden köşeye boyu (1 inç ≈ 2,5 cm)'],
  ],
  steps: [
    {
      title: 'Bilgisayarın ölçü birimleri',
      html: `<p>Dosyaların büyüklüğü ve disklerin ne kadar dosya alacağı <b>bayt</b> ile ölçülür. Tıpkı gram, kilogram, ton gibi:</p>
        <ul class="big-list"><li><b>KB</b> (kilobayt): kısa bir yazı</li><li><b>MB</b> (megabayt): bir fotoğraf ≈ 3–5 MB, bir şarkı ≈ 4 MB</li><li><b>GB</b> (gigabayt): bir film ≈ 2–4 GB</li><li><b>TB</b> (terabayt): 1 TB ≈ 1000 GB ≈ yaklaşık 250.000 fotoğraf</li></ul>
        <p>Her biri bir öncekinin yaklaşık <b>1000 katıdır</b>.</p>`,
      scene: info('<div class="sc-big">📝 KB<br>🖼 MB<br>🎬 GB<br>🗄 TB</div>'),
    },
    {
      title: 'Kalıcı mı, geçici mi?',
      html: '<p>Bilgisayar kapanınca ne kalır, ne kaybolur? Kartları doğru kutuya sürükleyin.</p>',
      mouse: '🖱 Kartı kutuya sürükleyin',
      scene: sorter({
        bins: [{ id: 'kalici', label: 'Kalıcı (kapanınca durur)', icon: '🗄' }, { id: 'gecici', label: 'Geçici (kapanınca gider)', icon: '⚡' }],
        items: [
          { label: 'SSD', icon: '💽', bin: 'kalici', why: 'SSD bir disktir; dosyalar kalıcı durur.' },
          { label: 'Sabit disk (HDD)', icon: '🗄', bin: 'kalici', why: 'HDD bir disktir; dosyalar kalıcı durur.' },
          { label: 'USB bellek', icon: '💾', bin: 'kalici', why: 'Takılıp çıkarılan küçük bir disktir.' },
          { label: 'Kaydedilmiş fotoğraf', icon: '🖼', bin: 'kalici', why: 'Kaydedilen her şey diske yazılır.' },
          { label: 'RAM', icon: '🧮', bin: 'gecici', why: 'RAM çalışma masasıdır; kapanınca boşalır.' },
          { label: 'Kaydedilmemiş yazı', icon: '📝', bin: 'gecici', why: 'Kaydedilmeyen yazı yalnızca RAM\'dedir.' },
          { label: 'Panodaki kopya', icon: '📋', bin: 'gecici', why: 'Pano da RAM\'de durur; kapanınca boşalır.' },
        ],
      }),
      on: (ev) => ev.type === 'sort-done',
      done: 'Bu yüzden önemli işleri sık sık kaydederiz (Ctrl + S).',
    },
    ilanSoru({
      title: 'RAM ne kadar?', q: 'Bu bilgisayarın RAM\'i kaç GB?',
      opts: ['512 GB', '16 GB', '15,6 GB'], ok: 1,
      why: 'RAM satırında 16 GB yazıyor. 512 GB depolamadır (disk), 15,6 ise ekranın inç cinsinden boyudur.',
    }),
    ilanSoru({
      title: 'Fotoğraflar nerede durur?', q: 'Fotoğraflarınız bu bilgisayarda kalıcı olarak nerede saklanır?',
      opts: ['16 GB RAM\'de', '512 GB SSD\'de', '8 çekirdekli işlemcide'], ok: 1,
      why: 'Dosyalar depolama birimine, yani SSD\'ye kaydedilir. RAM geçicidir; işlemci hesap yapar.',
    }),
    ilanSoru({
      title: 'Ekran boyu', q: '“15,6 inç” neyi anlatır?',
      opts: ['Ekranın köşeden köşeye boyunu', 'Bilgisayarın kalınlığını', 'Pilin kaç saat dayandığını'], ok: 0,
      why: 'Ekranlar köşegen boyuyla ölçülür. 1 inç yaklaşık 2,5 cm\'dir; 15,6 inç ≈ 40 cm.',
    }),
    ilanSoru({
      title: 'Hangi parça yazılım?', q: 'İlandaki satırlardan hangisi bir <b>yazılımdır</b>?',
      opts: ['Bellek (RAM)', 'Windows 11 Home', 'Depolama'], ok: 1,
      why: 'Windows 11 Home işletim sistemidir; diğerleri elle tutulur parçalardır.',
    }),
    ilanSoru({
      title: 'Ekran bağlamak', q: 'Bu bilgisayarı evdeki büyük televizyona bağlamak istiyorsunuz. İlandaki hangi bağlantı işe yarar?',
      opts: ['Kulaklık girişi', 'HDMI', 'Wi-Fi'], ok: 1,
      why: 'HDMI kablosu görüntüyü ve sesi televizyona taşır.',
    }),
    ilanSoru({
      title: 'İki ilanı karşılaştırın', text: IKI,
      q: 'Torunlarınızın yıllar boyu fotoğraf ve videolarını saklayacaksınız. Hangisinde daha çok yer var?',
      opts: ['A: 256 GB', 'B: 1 TB', 'İkisi aynı'], ok: 1,
      why: '1 TB yaklaşık 1000 GB eder; yani B\'de A\'nın yaklaşık 4 katı yer var.',
    }),
    ilanSoru({
      title: 'Birimler', text: '<div class="qz-pic">64 GB · 1 TB · 500 GB</div>',
      q: 'Hangisi en büyüktür?',
      opts: ['64 GB', '500 GB', '1 TB'], ok: 2,
      why: '1 TB ≈ 1000 GB. Sıra: 64 GB < 500 GB < 1 TB.',
    }),
    {
      title: 'Gerçek bilgisayarınızda',
      html: `<p>Kendi bilgisayarınızın RAM'ini ve diskini öğrenmek için:</p>
        <ol class="steps"><li>${K('⊞ Windows')} tuşuna basın, <b>hakkında</b> yazın, <b>Bilgisayarınız hakkında</b>'yı açın: <b>Yüklü RAM</b> satırına bakın.</li>
        <li>Dosya Gezgini'nde soldan <b>Bu bilgisayar</b>'a tıklayın: diskin ne kadarının dolu olduğunu çubuk gösterir.</li></ol>`,
      scene: info('<div class="sc-big">🔍💻</div><p>Bilgisayarınız hakkında</p>'),
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Artık bir bilgisayar ilanını okuyabilirsiniz:</p>', scene: info('<div class="sc-big">🏷✔</div>') },
  ],
};

// ---------------------------------------------------------------- 5. hafta: masaüstü parkuru

// Programı Başlat'ta yazarak açtırır; başka yoldan açılırsa uyarır
const aramaIle = (app, name) => (ev, c) => {
  if (ev.type === 'start-open' && ev.app === app) {
    if (ev.via === 'search') return true;
    c.warn(`${name} açıldı ama listeden tıklayarak. Bu görevde <b>yazarak arayın</b>: pencereyi kapatıp yeniden deneyin.`);
  }
  if (ev.type === 'icon-open' && ev.name === name) c.warn(`Masaüstünden açtınız. Bu görevde ⊞ Başlat'ı açıp <b>yazarak arayın</b>.`);
  return false;
};

export const masaustuParkur = {
  id: 'masaustu-parkur', icon: '🏁', title: 'Masaüstü parkuru', minutes: 20, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: 10 görev, yönlendirme yok. Arayarak açma, görev çubuğu, pencereler arası geçiş, ses. Her görevin süresi tutulur.',
  steps: [
    {
      title: 'Masaüstü parkuru',
      html: `<p>Bu hafta öğrendiklerinizi <b>10 görevle</b> tekrar edeceğiz. Görevlerde nasıl yapılacağı yazmıyor; takılırsanız <b>💡 İpucu</b>'na bakın.</p>
        <div class="box">Eğitmen notu: son ekranda her görevin süresi listelenir, en uzun süren kırmızı görünür.</div>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.setSetting('muted', false); c.d.setSetting('volume', 70); },
    },
    {
      title: '1. Paint\'i arayarak açın', html: '<p>⊞ Başlat\'ı açın ve <b>yazarak arayıp</b> Paint\'i açın.</p>',
      hint: `Başlat\'a tıklayın, klavyeden <b>paint</b> yazın, ${K('Enter')}.`,
      on: aramaIle('paint', 'Paint'),
    },
    {
      title: '2. Hesap Makinesi\'ni arayarak açın', html: '<p>Hesap Makinesi\'ni de aynı yolla, <b>yazarak arayıp</b> açın.</p>',
      hint: `Başlat → <b>hesap</b> yazın → ${K('Enter')}.`,
      on: aramaIle('calc', 'Hesap Makinesi'),
    },
    {
      title: '3. Hesap yapın', html: '<p>Pazardan 1250 TL\'lik alışveriş yaptınız, 375 TL indirim var. Ne kadar ödersiniz? Hesap Makinesi\'nde bulun.</p>',
      hint: '1250 − 375 = yapın. Eksi işareti hesap makinesinde <b>−</b> düğmesidir.',
      setup: (c) => c.d.ensure('calc'),
      on: (ev, c) => {
        if (ev.type === 'calc-result' && ev.value !== 875) c.warn(`Sonuç ${ev.value} çıktı. C ile silip 1250 − 375 = yapın.`);
        return ev.type === 'calc-result' && ev.value === 875;
      },
      done: '875 TL.',
    },
    {
      title: '4. Paint\'i öne getirin', html: '<p>Hesap Makinesi önde. <b>Görev çubuğunu</b> kullanarak Paint\'i öne getirin.</p>',
      hint: 'Ekranın en altındaki şeritte 🎨 simgesine tıklayın.',
      setup: (c) => { c.d.ensure('paint'); c.d.ensure('calc'); },
      on: (ev) => ev.type === 'taskbar-click' && ev.app === 'paint',
    },
    {
      title: '5. Hesap Makinesi\'ne geçin', html: '<p>Şimdi Hesap Makinesi\'ne geri geçin. Bu sefer <b>klavyeyi</b> deneyin.</p>',
      hint: `${K('Alt')} tuşunu basılı tutup ${K('Tab')}'a bir kez basın, sonra bırakın. Olmazsa görev çubuğunu kullanabilirsiniz.`,
      setup: (c) => { c.d.ensure('calc'); c.d.ensure('paint'); },
      on: (ev) => ev.type === 'alttab' || (ev.type === 'taskbar-click' && ev.app === 'calc'),
    },
    {
      title: '6. Masaüstünü gösterin', html: '<p>Pencereleri kapatmadan <b>hepsini birden</b> küçültüp masaüstünü gösterin.</p>',
      hint: 'Görev çubuğunun en sağ köşesine, saatin sağındaki ince çizgiye tıklayın.',
      on: (ev) => ev.type === 'show-desktop' && ev.hidden,
    },
    {
      title: '7. Not Defteri\'ni ekranı kaplatın', html: '<p>Not Defteri\'ni açın ve penceresini <b>bütün ekranı kaplayacak</b> şekilde büyütün.</p>',
      hint: 'Masaüstündeki Not Defteri simgesine çift tıklayın. Sonra pencerenin sağ üstündeki ☐ düğmesine tıklayın.',
      on: (ev) => ev.type === 'win-max' && ev.app === 'notepad',
    },
    {
      title: '8. Sesi kapatın', html: '<p>Bir telefon görüşmesi yapacaksınız. Bilgisayarın sesini <b>tamamen kapatın</b> (🔇).</p>',
      hint: 'Sağ alttaki 🔊 simgesine tıklayın; açılan kutuda 🔊 düğmesine basınca 🔇 olur.',
      setup: (c) => c.d.closeMenus(),
      check: (c) => c.d.settings.muted,
      on: (ev) => ev.type === 'setting' && ev.key === 'muted' && ev.value,
    },
    {
      title: '9. Sesi açıp kısın', html: '<p>Görüşme bitti. Sesi yeniden açın ve düzeyini <b>30 civarına</b> getirin.</p>',
      hint: 'Sağ alttaki simgeye tıklayın, çubuğu sola doğru sürükleyin. Çubuğu oynatmak sessizi de kapatır.',
      on: (ev, c) => {
        if (ev.type !== 'setting') return false;
        const { volume, muted } = c.d.settings;
        if (ev.key === 'volume' && volume > 40) c.note(`Ses düzeyi ${volume}. Biraz daha sola çekin.`);
        return !muted && volume >= 20 && volume <= 40;
      },
      done: (c) => `Ses düzeyi ${c.d.settings.volume}.`,
    },
    {
      title: '10. Hepsini kapatın', html: '<p>Açık bütün pencereleri kapatın. Kaydetmek isteyip istemediğiniz sorulursa <b>Kaydetme</b> deyin.</p>',
      hint: 'Küçülmüş pencereler görev çubuğunda bekliyor: önce simgelerine tıklayıp açın, sonra ✕.',
      setup: (c) => c.d.closeMenus(),
      check: (c) => !c.d.wins.length,
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Bütün görevleri tamamladınız.</p>' },
  ],
};

// ---------------------------------------------------------------- 6. hafta: dağınık klasörü toparlama

const lower = (s) => s.toLocaleLowerCase('tr');
const SAGLIK = /sa[gğ]l[iı]k/i;
const nodeNamed = (c, name) => Object.values(c.d.fs.nodes).find((n) => lower(n.name) === lower(name));
const saglik = (c) => c.d.fs.children('docs').find((n) => n.type === 'folder' && SAGLIK.test(n.name));
const parentOf = (c, name) => nodeNamed(c, name)?.parent;
const explorerAt = (folder) => (c) => { const w = c.d.ensure('explorer'); if (folder && w.api.folder !== folder) w.api.go(folder); };

export const dosyaParkur = {
  id: 'dosya-parkur', icon: '🗂', title: 'Dağınık klasörü toparlayın', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: Belgeler klasörü karışmış. Klasör açma, taşıma, silme, geri yükleme, ad değiştirme, arama ve USB\'ye yedekleme görevleri.',
  setup: (c) => {
    put(c, 'docs', 'tahlil sonucu.pdf');
    put(c, 'docs', 'reçete.jpg', 'file', PIC('💊', '#c8e6c9', '#fff9c4'));
    put(c, 'docs', 'doğalgaz faturası.pdf');
    put(c, 'docs', 'eski not.txt', 'file', 'Bu not artık gereksiz.');
  },
  steps: [
    {
      title: 'Belgeler karışmış',
      html: `<p>Belgeler klasöründe sağlık kâğıtları, faturalar ve eski notlar birbirine karışmış. <b>10 görevle</b> toparlayacağız.</p>
        <p>Nasıl yapılacağı yazmıyor; geçen haftaki dersi hatırlayın. Takılırsanız <b>💡 İpucu</b>.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); explorerAt('docs')(c); },
    },
    {
      title: '1. Sağlık klasörü', html: '<p>Belgeler\'in içinde <b>Sağlık</b> adında yeni bir klasör oluşturun.</p>',
      hint: `Üstteki <b>＋ Yeni klasör</b>\'e tıklayın, adı seçiliyken <b>Sağlık</b> yazın, ${K('Enter')}.`,
      setup: explorerAt('docs'),
      check: (c) => !!saglik(c),
      on: (ev, c) => ev.type === 'rename' && !!saglik(c),
    },
    {
      title: '2. Sağlık kâğıtlarını taşıyın', html: '<p><b>tahlil sonucu</b> ve <b>reçete</b> dosyalarını Sağlık klasörüne taşıyın.</p>',
      hint: 'Dosyayı tutup Sağlık klasörünün üzerine sürükleyin; klasör maviye boyanınca bırakın. İkisi için de yapın.',
      setup: explorerAt(),
      check: (c) => ['tahlil sonucu.pdf', 'reçete.jpg'].every((n) => parentOf(c, n) === saglik(c)?.id),
      on: (ev, c) => {
        if (ev.type !== 'fs') return false;
        const n = ['tahlil sonucu.pdf', 'reçete.jpg'].filter((f) => parentOf(c, f) === saglik(c)?.id).length;
        if (n === 1) c.note('Biri tamam. Şimdi öbürünü de taşıyın.');
        return n === 2;
      },
    },
    {
      title: '3. Faturayı yerine koyun', html: '<p><b>doğalgaz faturası</b> dosyasını <b>Faturalar</b> klasörüne taşıyın.</p>',
      hint: 'Belgeler\'e dönün (soldan ya da ← Geri), dosyayı Faturalar klasörünün üzerine sürükleyin.',
      setup: explorerAt(),
      check: (c) => parentOf(c, 'doğalgaz faturası.pdf') === c.d.fs.find('docs', 'Faturalar')?.id,
      on: (ev, c) => ev.type === 'fs' && parentOf(c, 'doğalgaz faturası.pdf') === c.d.fs.find('docs', 'Faturalar')?.id,
    },
    {
      title: '4. Eski notu silin', html: '<p><b>eski not</b> dosyasını silin.</p>',
      hint: `Dosyaya bir kez tıklayın ve ${K('Delete')} tuşuna basın (ya da üstteki 🗑 Sil).`,
      setup: explorerAt(),
      check: (c) => parentOf(c, 'eski not.txt') === RECYCLE,
      on: (ev, c) => ev.type === 'fs' && parentOf(c, 'eski not.txt') === RECYCLE,
    },
    {
      title: '5. Yanlışlıkla silinen', html: '<p>Eyvah! Biri <b>telefon numaraları</b> dosyasını yanlışlıkla silmiş. Onu <b>eski yerine</b> geri getirin.</p>',
      hint: 'Soldan 🗑 Geri Dönüşüm Kutusu\'na gidin, dosyayı seçip üstteki ♻ Geri yükle\'ye tıklayın.',
      setup: (c) => {
        const n = nodeNamed(c, 'telefon numaraları.txt');
        if (n && n.parent !== RECYCLE) c.d.fs.remove(n.id);
        explorerAt()(c);
      },
      on: (ev) => ev.type === 'restore' && /telefon/.test(ev.name),
      done: 'Dosya Belgeler\'e döndü.',
    },
    {
      title: '6. Klasörün adını değiştirin', html: '<p><b>Sağlık</b> klasörünün adını <b>Sağlık Belgeleri</b> olarak değiştirin.</p>',
      hint: `Belgeler\'e gidin, Sağlık klasörüne bir kez tıklayın, ${K('F2')}\'ye basın, yeni adı yazıp ${K('Enter')}.`,
      setup: explorerAt(),
      check: (c) => /belge/i.test(saglik(c)?.name || ''),
      on: (ev, c) => ev.type === 'rename' && /belge/i.test(saglik(c)?.name || ''),
    },
    {
      title: '7. Masaüstüne kopyalayın', html: '<p><b>Faturalar</b> klasöründeki <b>elektrik faturası</b>nı Masaüstü\'ne <b>kopyalayın</b>. Aslı Faturalar\'da kalsın.</p>',
      hint: `Faturalar\'ı açın, dosyayı seçip ${K('Ctrl', 'C')} (ya da ⧉ Kopyala). Soldan Masaüstü\'ne gidip ${K('Ctrl', 'V')} (ya da 📋 Yapıştır).`,
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type !== 'fs') return false;
        const fat = c.d.fs.find('docs', 'Faturalar');
        const desk = c.d.fs.find('desktop', 'elektrik faturası.pdf');
        if (desk && !c.d.fs.find(fat?.id, 'elektrik faturası.pdf')) c.warn('Dosya taşındı, kopyalanmadı: Faturalar\'da kalmadı. Masaüstündekini geri Faturalar\'a sürükleyip Kopyala ile yeniden deneyin.');
        return !!desk && !!c.d.fs.find(fat?.id, 'elektrik faturası.pdf');
      },
    },
    {
      title: '8. Arayın', html: '<p>Tahlil sonucunun nerede olduğunu unuttunuz diyelim. Belgeler\'de <b>arayarak</b> bulun.</p>',
      hint: 'Soldan Belgeler\'e gidin, sağ üstteki <b>Ara</b> kutusuna <b>tahlil</b> yazın.',
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type === 'ex-search' && /tahlil/i.test(ev.text) && !ev.results.length) c.note('Burada bulunamadı. Önce soldan <b>Belgeler</b>\'e gidip yeniden arayın.');
        return ev.type === 'ex-search' && /tahlil/i.test(ev.text) && ev.results.length > 0;
      },
    },
    {
      title: '9. USB\'ye yedekleyin',
      html: `<p>USB belleği takın ve <b>Sağlık Belgeleri</b> klasörünün tamamını USB belleğe kopyalayın.</p>
        <button type="button" class="btn primary usb-btn">💾 USB belleği bilgisayara tak</button>`,
      hint: 'Belgeler\'de Sağlık Belgeleri klasörünü tutup soldaki 💾 USB Bellek (E:)\'nin üzerine sürükleyin.',
      setup: (c) => {
        explorerAt()(c);
        document.querySelector('.usb-btn').onclick = () => c.d.plugUsb();
      },
      on: (ev, c) => c.d.fs.usb && c.d.fs.children(USB).some((n) => n.type === 'folder' && SAGLIK.test(n.name)),
      done: 'Klasör, içindeki dosyalarla birlikte USB\'ye kopyalandı.',
    },
    {
      title: '10. Güvenle çıkarın', html: '<p>USB belleği <b>güvenle</b> çıkarın.</p>',
      hint: 'Dosya Gezgini\'nde USB\'yi açıp ⏏ Çıkar\'a ya da görev çubuğundaki 💾 simgesine tıklayın.',
      setup: (c) => { if (!c.d.fs.usb) c.d.plugUsb(); },
      on: (ev) => ev.type === 'usb' && !ev.on,
    },
    { final: true, title: 'Klasör tertemiz! 🏁', html: '<p>Bütün görevleri tamamladınız.</p>' },
  ],
};
