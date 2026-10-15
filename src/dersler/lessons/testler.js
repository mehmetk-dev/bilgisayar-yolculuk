// Haftalık tekrar testleri. Her soru bir adımdır: yanlış cevapta açıklama çıkar, doğru cevap bulununca geçilir.
// Son adımda ilk denemede doğru bilinen soruların sayısı ve tekrar bakılacak konular gösterilir (lesson.test).
import { quiz } from './scenes.js';
import { K } from './common.js';

const IDS = ['a', 'b', 'c', 'd'];
const info = (html) => (el) => { el.className = 'sc sc-info'; el.innerHTML = html; };

// Bir soru: { t: adım başlığı, pic: resim/emoji (isteğe bağlı), q: soru, opts: seçenekler, ok: doğru seçeneğin sırası (0'dan), why: açıklama }
function soru({ t, pic, q, opts, ok, why }) {
  return {
    title: t,
    quiz: true,
    html: '<p>Yandaki soruyu okuyun ve doğru cevaba tıklayın.</p>',
    scene: quiz({
      kind: 'plain', text: pic ? `<div class="qz-pic">${pic}</div>` : '', question: q,
      options: opts.map((o, i) => [IDS[i], o]), correct: IDS[ok], explain: why,
      column: opts.some((o) => o.replace(/<[^>]+>/g, '').length > 24), shuffle: true,
    }),
    on: (ev, c) => {
      if (ev.type === 'quiz' && !ev.ok) c.warn('Bu sefer olmadı. Yandaki açıklamayı okuyun ve başka bir seçeneği deneyin.');
      return ev.type === 'quiz' && ev.ok;
    },
    done: 'Doğru!',
  };
}

function test({ id, no, title, desc, qs }) {
  return {
    id, icon: '✅', title, desc, stage: 'scene', test: true, minutes: Math.round(qs.length * 1.5),
    steps: [
      {
        title: 'Nasıl çözülür?',
        html: `<p>${no}. haftada öğrendiklerimizi <b>${qs.length} soruyla</b> tekrar edeceğiz.</p>
          <ul class="big-list"><li>Her soruda doğru cevaba tıklayın.</li><li>Yanlış seçerseniz açıklama çıkar; okuyup yeniden deneyin.</li><li>Sonunda kaç soruyu <b>ilk denemede</b> bildiğinizi göreceksiniz.</li></ul>
          <p class="mut">Not değil, tekrar içindir. Acele etmeyin.</p>`,
        scene: info(`<div class="sc-big">✅ ❓ ✅</div><p>${no}. hafta tekrar testi</p>`),
      },
      ...qs.map(soru),
      { final: true, title: 'Test bitti! 🎉', html: '', scene: info('<div class="sc-big">🏆</div><p>Tebrikler! Sonucunuz solda.</p>') },
    ],
  };
}

export const test1 = test({
  id: 'test1', no: 1, title: '1. hafta testi',
  desc: 'Açma-kapama, fare, sürükle-bırak ve pencereler üzerine 10 soru.',
  qs: [
    {
      t: 'Bilgisayarı açmak', pic: '⏻',
      q: 'Bilgisayarı açmak için nereye basarız?',
      opts: ['Klavyedeki Enter tuşuna', 'Kasadaki güç düğmesine', 'Farenin sol tuşuna'], ok: 1,
      why: 'Güç düğmesi kasanın önündedir; üzerinde ⏻ işareti vardır. Dizüstü bilgisayarda klavyenin üst köşesindedir.',
    },
    {
      t: 'Bilgisayarı kapatmak', pic: '🔌',
      q: 'İşimiz bitti. Bilgisayarı nasıl kapatırız?',
      opts: ['Fişini çekeriz', 'Ekranın düğmesine basarız', 'Başlat → ⏻ Güç → Kapat'], ok: 2,
      why: 'Fişi çekmek açık dosyaları bozabilir. Ekranın düğmesi yalnızca ekranı kapatır; kasa çalışmaya devam eder.',
    },
    {
      t: 'Uyku', pic: '🌙',
      q: 'Yarım saat ara vereceğiz, açık işlerimiz kaybolmasın istiyoruz. Hangisini seçeriz?',
      opts: ['Uyku', 'Kapat', 'Yeniden başlat'], ok: 0,
      why: 'Uyku, açık programları olduğu gibi bekletir. Fareyi oynatınca ya da bir tuşa basınca kaldığınız yerden devam edersiniz.',
    },
    {
      t: 'Yeniden başlat', pic: '🐢',
      q: 'Bilgisayar çok yavaşladı, takılıyor. İlk ne denenir?',
      opts: ['Fişi çekip takmak', 'Yeniden başlatmak', 'Uykuya almak'], ok: 1,
      why: 'Yeniden başlat, bilgisayarı düzgünce kapatıp açar ve takılan programları temizler. Fişi çekmek son çaredir.',
    },
    {
      t: 'Şifre neden görünmez?', pic: '🔒 ●●●●',
      q: 'Şifreyi yazarken harfler yerine ●●●● görünüyor. Neden?',
      opts: ['Klavye bozuk', 'Yanımızdakiler şifreyi görmesin diye', 'Caps Lock açık'], ok: 1,
      why: 'Şifre her zaman gizli gösterilir. Yazdığınız harfler bilgisayara yine de ulaşır.',
    },
    {
      t: 'Çift tık', pic: '📝',
      q: 'Masaüstündeki bir programı açmak için ne yaparız?',
      opts: ['Bir kez tıklarız', 'Hızlıca iki kez tıklarız', 'Sağ tuşla tıklarız'], ok: 1,
      why: 'Tek tık yalnızca seçer (simge mavi olur). Çift tık açar. İki tıklama arasında beklemeyin: “tık-tık”.',
    },
    {
      t: 'Sağ tık', pic: '🖱',
      q: 'Bir dosyayı silmek ya da adını değiştirmek için çıkan küçük menüyü nasıl açarız?',
      opts: ['Farenin sağ tuşuna bir kez basarak', 'Tekerleği çevirerek', 'Sol tuşa üç kez basarak'], ok: 0,
      why: 'Sağ tık, üzerine tıkladığınız şeyle ilgili işlerin listesini açar: Aç, Kopyala, Sil, Yeniden adlandır…',
    },
    {
      t: 'Sürükle-bırak', pic: '📄 ➜ 📁',
      q: 'Bir dosyayı klasöre sürüklerken doğru sıra hangisi?',
      opts: ['Tıkla, bırak, sonra taşı', 'Sol tuşu basılı tut → taşı → klasörün üzerinde bırak', 'Çift tıkla, sonra sağ tıkla'], ok: 1,
      why: 'Tut, taşı, bırak. Sol tuşu klasörün tam üzerine gelene kadar bırakmayın.',
    },
    {
      t: 'Pencere düğmeleri', pic: '<b>—</b> &nbsp; ☐ &nbsp; ✕',
      q: 'Pencerenin sağ üstündeki <b>—</b> düğmesi ne yapar?',
      opts: ['Pencereyi kapatır', 'Pencereyi küçültüp görev çubuğuna indirir', 'Pencereyi ekranı kaplayacak kadar büyütür'], ok: 1,
      why: '— küçültür, ☐ ekranı kaplatır, ✕ kapatır. Küçülen pencere kapanmaz; görev çubuğundaki simgesine tıklayınca geri gelir.',
    },
    {
      t: 'Silinen dosya', pic: '🗑',
      q: 'Yanlışlıkla sildiğimiz bir dosya önce nereye gider?',
      opts: ['Tamamen yok olur', 'Masaüstüne', 'Geri Dönüşüm Kutusu\'na'], ok: 2,
      why: 'Silinen dosya Geri Dönüşüm Kutusu\'nda bekler; oradan geri yüklenebilir. Kutu boşaltılınca tamamen silinir.',
    },
  ],
});

export const test2 = test({
  id: 'test2', no: 2, title: '2. hafta testi',
  desc: 'Klavyenin tuşları, büyük harf, Türkçe harfler ve işaretler üzerine 12 soru.',
  qs: [
    {
      t: 'Enter', pic: '<kbd>Enter ↵</kbd>',
      q: 'Not Defteri\'nde Enter tuşuna basınca ne olur?',
      opts: ['Bir harf silinir', 'Alt satıra geçilir', 'Harfler büyür'], ok: 1,
      why: 'Enter yeni bir satır açar. Pencerelerde ise “Tamam” demek yerine de kullanılır.',
    },
    {
      t: 'Backspace ve Delete', pic: '<kbd>⌫</kbd> &nbsp; <kbd>Delete</kbd>',
      q: 'Backspace ile Delete arasındaki fark nedir?',
      opts: ['İkisi aynı işi yapar', 'Backspace imlecin solundakini, Delete sağındakini siler', 'Backspace sağındakini, Delete solundakini siler'], ok: 1,
      why: 'Backspace geriye (sola), Delete ileriye (sağa) doğru siler.',
    },
    {
      t: 'Tek büyük harf', pic: 'Ali',
      q: '“Ali” yazarken yalnızca A\'yı büyük yazmak için ne yaparız?',
      opts: ['Caps Lock\'a basarız', 'Shift\'i basılı tutup A\'ya basarız', 'Enter\'a basarız'], ok: 1,
      why: 'Shift, basılı tuttuğunuz sürece büyük harf yazar. Caps Lock ise kapatana kadar her şeyi büyük yazar.',
    },
    {
      t: 'Hep büyük harf', pic: 'MERHABA NASILSIN',
      q: 'Yazdığınız her şey BÜYÜK HARFLE çıkıyor. Neden olabilir?',
      opts: ['Caps Lock açık kalmış', 'Ekran bozulmuş', 'Fare takılı değil'], ok: 0,
      why: 'Caps Lock\'a bir kez basınca açılır, bir daha basınca kapanır. Çoğu klavyede açıkken küçük bir ışık yanar.',
    },
    {
      t: 'Şifre kabul edilmiyor', pic: '🔒 “Şifre yanlış”',
      q: 'Şifrenizi doğru bildiğiniz halde “şifre yanlış” diyor. İlk neye bakarsınız?',
      opts: ['Ekranın parlaklığına', 'Caps Lock ışığı yanıyor mu?', 'Farenin pili bitmiş mi?'], ok: 1,
      why: 'Şifrelerde büyük-küçük harf farklıdır. Caps Lock açıksa şifre yanlış yazılır.',
    },
    {
      t: '@ işareti', pic: '@',
      q: 'Türkçe Q klavyede @ işareti nasıl yazılır?',
      opts: [K('Shift', '2'), K('AltGr', 'Q'), K('Ctrl', 'A')], ok: 1,
      why: 'AltGr (boşluğun sağındaki Alt) basılı tutulup Q\'ya basılır. AltGr yoksa Ctrl + Alt + Q da olur.',
    },
    {
      t: 'Soru işareti', pic: '?',
      q: 'Soru işareti hangi tuşlarla yazılır?',
      opts: [K('Shift', '1'), K('Shift', '*'), K('AltGr', '?')], ok: 1,
      why: 'Shift + * soru işareti yazar. Shift + 1 ise ünlem (!) yazar.',
    },
    {
      t: 'İ ile I', pic: 'İZMİR · IĞDIR',
      q: 'İZMİR\'deki noktalı büyük <b>İ</b> hangi tuştadır?',
      opts: ['O\'nun solundaki I tuşunda', 'Ş\'nin yanındaki İ tuşunda', 'Caps Lock\'ın üstünde'], ok: 1,
      why: 'Türkçe klavyede iki ayrı tuş vardır: I tuşu noktasız ı/I, İ tuşu noktalı i/İ yazar.',
    },
    {
      t: 'Satırın sonu', pic: '<kbd>Home</kbd> &nbsp; <kbd>End</kbd>',
      q: 'İmleç uzun bir satırın ortasında. Tek tuşla satırın sonuna nasıl gidilir?',
      opts: ['Home', 'Enter', 'End'], ok: 2,
      why: 'Home satırın başına, End satırın sonuna götürür.',
    },
    {
      t: 'İmleç', pic: 'Merhaba<span style="color:var(--acc)">|</span>',
      q: 'Yazının içinde yanıp sönen ince çizginin adı nedir?',
      opts: ['Fare oku', 'İmleç', 'Kaydırma çubuğu'], ok: 1,
      why: 'İmleç, bir sonraki harfin nereye yazılacağını gösterir. Fareyle tıklayarak ya da ok tuşlarıyla yerini değiştirebilirsiniz.',
    },
    { t: 'F ve Q klavye', pic: '⌨ Q · F', q: 'Klavyenizde üst harf sırası “Q W E R T Y” diye gidiyor. Bu hangi klavyedir?', opts: ['Q klavye', 'F klavye', 'Hiçbiri'], ok: 0, why: 'Q klavye. F klavyenin üst sırası “F G Ğ I O D” ile başlar.' },
    { t: 'ENG yazısı', pic: 'TUR · ENG', q: 'Yazarken ş, ğ, ü harfleri yerine işaretler çıkıyor. Sağ alttaki yazıya bakınca ENG görüyorsunuz. Ne yaparsınız?', opts: ['Alt + Shift ile (ya da yazıya tıklayıp) TUR yaparım', 'Bilgisayarı sıfırlarım', 'Klavyeyi değiştiririm'], ok: 0, why: 'Klavye dili İngilizce olmuş. Alt + Shift ya da sağ alttaki yazıya tıklayıp TUR seçmek yeter.' },
  ],
});

export const test3 = test({
  id: 'test3', no: 3, title: '3. hafta testi',
  desc: 'Seçme, kopyalama, kesme, geri alma, kaydetme ve açma üzerine 10 soru.',
  qs: [
    {
      t: 'Önce seçmek', pic: '<span style="background:#b3d4fc">bilgisayar</span>',
      q: 'Bir yazıyı kopyalamadan önce ne yapmalıyız?',
      opts: ['Kaydetmeliyiz', 'Seçmeliyiz (mavi olmalı)', 'Enter\'a basmalıyız'], ok: 1,
      why: 'Kopyalama, kesme ve silme işlemleri seçili (mavi) yazıya uygulanır.',
    },
    {
      t: 'Hepsini seçmek', pic: K('Ctrl', 'A'),
      q: 'Ctrl + A ne yapar?',
      opts: ['Hepsini seçer', 'Kaydeder', 'Yazıyı siler'], ok: 0,
      why: 'A, İngilizce “All” (hepsi) kelimesinden gelir.',
    },
    {
      t: 'Kopyala ile Kes', pic: K('Ctrl', 'C') + ' &nbsp; ' + K('Ctrl', 'X'),
      q: 'Kopyala ile Kes arasındaki fark nedir?',
      opts: ['İkisi aynıdır', 'Kes, yazıyı tamamen siler; geri gelmez', 'Kopyalada yazı yerinde kalır; keste yerinden alınır'], ok: 2,
      why: 'İkisinde de yazı Pano\'ya gider. Kesilen yazı Ctrl + V ile yeni yerine konur: buna taşımak denir.',
    },
    {
      t: 'Pano', pic: '📋',
      q: 'Pano nedir?',
      opts: ['Kopyaladığımız ya da kestiğimiz yazının geçici olarak durduğu yer', 'Masaüstündeki bir klasör', 'Yazıcının bir parçası'], ok: 0,
      why: 'Pano\'daki yazı, siz yeni bir şey kopyalayana kadar orada kalır; istediğiniz kadar yapıştırabilirsiniz.',
    },
    {
      t: 'Can simidi', pic: '😱',
      q: 'Bütün yazı seçiliyken yanlışlıkla bir harfe bastınız ve yazının hepsi gitti! Ne yaparsınız?',
      opts: ['Bilgisayarı kapatırım', 'Baştan yazarım', `${K('Ctrl', 'Z')} ile geri alırım`], ok: 2,
      why: 'Ctrl + Z son yaptığınızı geri alır; yazı geri gelir. Birkaç kez basarak daha da geriye gidebilirsiniz.',
    },
    {
      t: 'Yinele', pic: K('Ctrl', 'Y'),
      q: 'Ctrl + Y ne zaman işe yarar?',
      opts: ['Ctrl + Z ile geri aldığımı geri getirmek için', 'Yazıyı yazdırmak için', 'Yeni sayfa açmak için'], ok: 0,
      why: 'Ctrl + Z geri alır, Ctrl + Y yineler. Bir şey geri almadıysanız Ctrl + Y bir şey yapmaz.',
    },
    {
      t: 'Fareyle kopyalamak', pic: '🖱 Sağ tık',
      q: 'Kısayolu unuttunuz. Seçili yazıyı fareyle nasıl kopyalarsınız?',
      opts: ['Yazıya üç kez tıklarım', 'Seçili yazıya sağ tıklayıp “Kopyala”yı seçerim', 'Tekerleği çeviririm'], ok: 1,
      why: 'Sağ tık menüsünde Kes, Kopyala ve Yapıştır hep vardır.',
    },
    {
      t: 'Başlıktaki yıldız', pic: '*Adsız - Not Defteri',
      q: 'Pencerenin başlığında *Adsız yazıyor. Baştaki yıldız ne demek?',
      opts: ['Dosya çok önemli', 'Kaydedilmemiş değişiklik var', 'Dosya silinmiş'], ok: 1,
      why: 'Kaydedince yıldız kaybolur ve başlıkta dosyanın adı yazar.',
    },
    {
      t: 'Kaydetmek', pic: '💾',
      q: 'Yazdıklarımızın kaybolmaması için hangi kısayolu kullanırız?',
      opts: [K('Ctrl', 'S'), K('Ctrl', 'O'), K('Ctrl', 'V')], ok: 0,
      why: 'S, İngilizce “Save” (kaydet) kelimesinden gelir. İlk kayıtta dosyaya bir ad verilir.',
    },
    {
      t: 'Açmak', pic: '📂',
      q: 'Dün kaydettiğiniz bir yazıyı Not Defteri\'nde yeniden açmak için?',
      opts: [K('Ctrl', 'Z'), K('Ctrl', 'O'), K('Ctrl', 'A')], ok: 1,
      why: 'Ctrl + O (Dosya → Aç) kaydettiğiniz dosyaların listesini gösterir. O, İngilizce “Open” (aç) kelimesinden gelir.',
    },
  ],
});

export const test4 = test({
  id: 'test4', no: 4, title: '4. hafta testi',
  desc: 'Donanım-yazılım, giriş-çıkış birimleri, RAM, disk ve işletim sistemi üzerine 10 soru.',
  qs: [
    {
      t: 'Donanım', pic: '⌨ 🎨 🪟',
      q: 'Hangisi donanımdır?',
      opts: ['Paint', 'Klavye', 'Windows'], ok: 1,
      why: 'Donanım elle tutulur. Paint ve Windows ise programdır, yani yazılımdır.',
    },
    {
      t: 'Yazılım', pic: '🖨 📝 🖱',
      q: 'Hangisi yazılımdır?',
      opts: ['Yazıcı', 'Fare', 'Not Defteri'], ok: 2,
      why: 'Not Defteri bir programdır, elle tutulmaz. Yazıcı ve fare donanımdır.',
    },
    {
      t: 'Giriş birimi', pic: '➡ 🗄',
      q: 'Hangisi giriş birimidir (bilgisayara bilgi verir)?',
      opts: ['Hoparlör', 'Mikrofon', 'Yazıcı'], ok: 1,
      why: 'Mikrofon sesimizi bilgisayara verir. Hoparlör ve yazıcı bilgisayardan bilgi alır: çıkış birimidir.',
    },
    {
      t: 'Çıkış birimi', pic: '🗄 ➡',
      q: 'Hangisi çıkış birimidir (bilgisayardan bilgi alır)?',
      opts: ['Ekran', 'Kamera', 'Klavye'], ok: 0,
      why: 'Ekran, bilgisayarın gösterdiğini bize iletir. Kamera ve klavye giriş birimidir.',
    },
    {
      t: 'Dokunmatik ekran', pic: '👆📱',
      q: 'Dokunmatik ekran hangisidir?',
      opts: ['Yalnızca giriş', 'Yalnızca çıkış', 'Hem giriş hem çıkış'], ok: 2,
      why: 'Görüntüyü gösterir (çıkış), dokunuşumuzu da bilgisayara verir (giriş).',
    },
    {
      t: 'RAM', pic: '⚡ 📝 ❌',
      q: 'Elektrik kesildi; yazdığınız ama kaydetmediğiniz yazı kayboldu. Çünkü yazı neredeydi?',
      opts: ['Diskte', 'RAM\'de (çalışma masası)', 'USB bellekte'], ok: 1,
      why: 'RAM, o an açık olan işlerin durduğu çalışma masasıdır; elektrik gidince boşalır. Kaydedilen dosya ise diske yazılır ve kalıcıdır.',
    },
    {
      t: 'İşlemci', pic: '🧠',
      q: 'Bilgisayarın “beyni” sayılan, hesapları yapan parça hangisi?',
      opts: ['İşlemci (CPU)', 'Güç kaynağı', 'Kasa fanı'], ok: 0,
      why: 'İşlemci, programların istediği bütün hesapları yapar. Güç kaynağı elektrik verir, fan soğutur.',
    },
    {
      t: 'Dosya taşımak', pic: '💾 ➜ 🏠',
      q: 'Fotoğrafları evdeki başka bir bilgisayara götürmek istiyorsunuz. Hangisini kullanırsınız?',
      opts: ['RAM', 'Ekran kartı', 'USB bellek'], ok: 2,
      why: 'USB bellek takılıp çıkarılabilen küçük bir disktir; dosyaları cebinizde taşırsınız.',
    },
    {
      t: 'İşletim sistemi', pic: '🪟',
      q: 'Windows nedir?',
      opts: ['Bir donanım parçası', 'İşletim sistemi: bilgisayarı çalıştıran ana yazılım', 'Bir internet sitesi'], ok: 1,
      why: 'İşletim sistemi açılışta ilk çalışan yazılımdır; diğer programlar onun üzerinde çalışır.',
    },
    {
      t: 'Ekran kablosu', pic: '🖥 🔌',
      q: 'Ekranı bilgisayara bağlamak için günümüzde en çok hangi giriş kullanılır?',
      opts: ['HDMI', 'Kulaklık girişi', 'İnternet (Ethernet) girişi'], ok: 0,
      why: 'HDMI görüntüyü (ve sesi) ekrana taşır. Eski bilgisayarlarda mavi VGA girişi de görülür. Portları 3B uygulamada inceleyebilirsiniz.',
    },
  ],
});

export const test5 = test({
  id: 'test5', no: 5, title: '5. hafta testi',
  desc: 'Başlat menüsü, arama, görev çubuğu, Alt+Tab ve sağ alttaki simgeler üzerine 10 soru.',
  qs: [
    {
      t: 'Başlat menüsü', pic: '⊞',
      q: 'Bilgisayardaki bütün programları nerede bulursunuz?',
      opts: ['Geri Dönüşüm Kutusu\'nda', '⊞ Başlat menüsünde', 'Saatin içinde'], ok: 1,
      why: 'Başlat menüsü görev çubuğundadır. Masaüstünde simgesi olmayan programlar da oradadır.',
    },
    {
      t: 'Yazarak aramak', pic: '⊞ 🔍',
      q: 'Bir programı en hızlı nasıl bulursunuz?',
      opts: ['Başlat\'ı açıp programın adını yazmaya başlarım', 'Bütün klasörleri tek tek açarım', 'Bilgisayarı yeniden başlatırım'], ok: 0,
      why: 'Başlat açıkken yazmaya başlayınca arama yapılır; en üstteki sonucu Enter ile açarsınız.',
    },
    {
      t: 'Görev çubuğu', pic: '▁▁▁▁▁',
      q: 'Görev çubuğu nerededir?',
      opts: ['Pencerenin en üstünde', 'Ekranın en altındaki şeritte', 'Klavyenin üstünde'], ok: 1,
      why: 'Görev çubuğunda Başlat, arama, açık programlar ve sağda saat, ses, internet simgeleri bulunur.',
    },
    {
      t: 'Simgenin altındaki çizgi', pic: '🎨<br><span style="font-size:.4em">▬</span>',
      q: 'Görev çubuğundaki bir simgenin altında küçük bir çizgi var. Bu ne demek?',
      opts: ['Program açık', 'Program bozuk', 'Program silinecek'], ok: 0,
      why: 'Çizgi, programın açık olduğunu gösterir. Simgeye tıklayınca pencere öne gelir.',
    },
    {
      t: 'Küçülen pencere', pic: '<b>—</b>',
      q: 'Küçültülmüş (—) bir pencereyi nasıl geri getirirsiniz?',
      opts: ['Programı yeniden kurarım', 'Bilgisayarı yeniden başlatırım', 'Görev çubuğundaki simgesine tıklarım'], ok: 2,
      why: 'Küçülen pencere kapanmaz; görev çubuğunda bekler.',
    },
    {
      t: 'Alt + Tab', pic: K('Alt', 'Tab'),
      q: 'Alt + Tab ne işe yarar?',
      opts: ['Açık pencereler arasında geçmeye', 'Bilgisayarı kapatmaya', 'Yazıyı büyütmeye'], ok: 0,
      why: 'Alt\'ı basılı tutup Tab\'a basınca açık pencereler sırayla öne gelir.',
    },
    {
      t: 'Masaüstünü göstermek', pic: '🪟🪟🪟',
      q: 'Masaüstündeki bir dosyaya bakmak istiyorsunuz ama pencereler önünü kapatıyor. En hızlı yol?',
      opts: ['Hepsini tek tek kapatırım', 'Görev çubuğunun en sağ köşesine tıklarım', 'Bilgisayarı kapatırım'], ok: 1,
      why: 'Sağ alt köşedeki ince çizgi bütün pencereleri küçültür; bir daha tıklayınca geri gelirler.',
    },
    {
      t: 'Ses gelmiyor', pic: '🔇',
      q: 'Hoparlörden ses gelmiyor. İlk nereye bakarsınız?',
      opts: ['Sağ alttaki 🔊 simgesine', 'Başlat menüsündeki Paint\'e', 'Geri Dönüşüm Kutusu\'na'], ok: 0,
      why: 'Ses kısılmış ya da kapatılmış (🔇) olabilir. Simgeye tıklayıp çubuğu sağa çekin.',
    },
    {
      t: 'İnternet simgesi', pic: '📶',
      q: 'Sağ alttaki 📶 simgesi neyi gösterir?',
      opts: ['Pilin doluluğunu', 'İnternet (Wi-Fi) bağlantısını', 'Sesin düzeyini'], ok: 1,
      why: 'Wi-Fi simgesi, kablosuz internete bağlı olup olmadığınızı gösterir. Tıklayınca ağlar listelenir.',
    },
    {
      t: 'Masaüstü simgeleri', pic: '📝 🧮 🎨',
      q: 'Masaüstündeki simgeler ne işe yarar?',
      opts: ['Bilgisayarı soğutur', 'Saati gösterir', 'Sık kullanılan programlara ve dosyalara hızlı ulaşmayı sağlar'], ok: 2,
      why: 'Simgeye çift tıklayınca program ya da dosya açılır.',
    },
  ],
});

export const test6 = test({
  id: 'test6', no: 6, title: '6. hafta testi',
  desc: 'Dosya ve klasör, taşıma-kopyalama, silme ve geri yükleme, arama ve USB bellek üzerine 10 soru.',
  qs: [
    {
      t: 'Dosya ve klasör', pic: '📄 📁',
      q: 'Dosya ile klasör arasındaki fark nedir?',
      opts: ['İkisi aynıdır', 'Dosya bir kâğıt gibidir; klasör dosyaları bir arada tutar', 'Klasör bir programdır'], ok: 1,
      why: 'Klasörün içine dosya da başka klasör de konabilir.',
    },
    {
      t: 'Ad değiştirmek', pic: '✏',
      q: 'Seçili bir dosyanın adını değiştirmek için hangi tuşa basılır?',
      opts: ['F2', 'Enter', 'Delete'], ok: 0,
      why: 'F2 (ya da sağ tık → Yeniden adlandır). Yeni adı yazıp Enter\'a basılır.',
    },
    {
      t: 'Klasöre sürüklemek', pic: '📄 ➜ 📁',
      q: 'Bir dosyayı aynı diskteki bir klasörün üzerine sürüklerseniz ne olur?',
      opts: ['Kopyalanır', 'Silinir', 'Taşınır'], ok: 2,
      why: 'Aynı disk içinde sürüklemek taşır: dosya eski yerinden kalkar, yeni yerine gider.',
    },
    {
      t: 'USB\'ye sürüklemek', pic: '📄 ➜ 💾',
      q: 'Bir fotoğrafı USB belleğe sürüklerseniz ne olur?',
      opts: ['Kopyalanır; aslı yerinde kalır', 'Taşınır; aslı silinir', 'Hiçbir şey olmaz'], ok: 0,
      why: 'Farklı bir sürücüye (USB bellek gibi) sürüklemek kopyalar.',
    },
    {
      t: 'Silineni geri getirmek', pic: '♻',
      q: 'Delete ile sildiğiniz dosyayı nasıl geri getirirsiniz?',
      opts: ['Geri getirilemez', 'Geri Dönüşüm Kutusu\'nu açıp “Geri yükle”ye tıklarım', 'Bilgisayarı yeniden başlatırım'], ok: 1,
      why: 'Geri yükle, dosyayı silindiği eski yerine koyar.',
    },
    {
      t: 'Kutuyu boşaltmak', pic: '🗑 ➜ ∅',
      q: 'Geri Dönüşüm Kutusu boşaltılırsa içindekilere ne olur?',
      opts: ['Masaüstüne geri gelir', 'Tamamen silinir', 'USB belleğe taşınır'], ok: 1,
      why: 'Boşaltmadan önce içinde gerekli bir şey olmadığından emin olun.',
    },
    {
      t: 'USB\'yi çıkarmak', pic: '⏏',
      q: 'USB belleği bilgisayardan çekmeden önce ne yapmalısınız?',
      opts: ['Hiçbir şey, hemen çekebilirim', 'Bilgisayarı kapatmalıyım', '⏏ Çıkar\'a basıp “artık çıkarılabilir” yazısını beklemeliyim'], ok: 2,
      why: 'Dosya yazılırken çekilirse dosya bozulabilir.',
    },
    {
      t: 'Adres çubuğu', pic: '<small>Adres çubuğu</small>📄 Belgeler › Torunlarım',
      q: 'Dosya Gezgini\'nin adres çubuğunda “Belgeler › Torunlarım” yazıyor. Neredesiniz?',
      opts: ['Belgeler\'in içindeki Torunlarım klasöründe', 'Masaüstünde', 'USB bellekte'], ok: 0,
      why: 'Adres çubuğu, hangi klasörün içinde olduğunuzu soldan sağa gösterir. ← Geri ile bir önceki klasöre dönersiniz.',
    },
    {
      t: 'Kaybolan dosya', pic: '🔍',
      q: 'Bir dosyayı nereye kaydettiğinizi unuttunuz. Ne yaparsınız?',
      opts: ['Dosya Gezgini\'nde Ara kutusuna adını yazarım', 'Yeniden yazarım', 'Bilgisayarı kapatıp açarım'], ok: 0,
      why: 'Arama, açık klasörün içindeki bütün alt klasörlere de bakar.',
    },
    {
      t: 'Dosyada kısayollar', pic: K('Ctrl', 'C') + ' ➜ ' + K('Ctrl', 'V'),
      q: 'Not Defteri\'ndeki Ctrl + C ve Ctrl + V kısayolları dosyalarda da çalışır mı?',
      opts: ['Hayır, yalnızca yazıda çalışır', 'Evet: dosyayı seçip Ctrl + C, gideceği klasörde Ctrl + V', 'Yalnızca USB bellekte çalışır'], ok: 1,
      why: 'Ctrl + X ile kesip Ctrl + V ile yapıştırmak da dosyayı taşır.',
    },
  ],
});

export const test7 = test({
  id: 'test7', no: 7, title: '7. hafta testi',
  desc: 'Paint, Ekran Alıntısı ve Ayarlar (arka plan, ses, Wi-Fi, yazı boyutu) üzerine 12 soru.',
  qs: [
    {
      t: 'Paint', pic: '🎨',
      q: 'Paint ne işe yarar?',
      opts: ['Resim çizmeye ve düzenlemeye', 'Yazı yazmaya ve hesap yapmaya', 'İnternette gezinmeye'], ok: 0,
      why: 'Paint basit bir resim programıdır: kalem, fırça, şekil, doldurma, yazı ve silgi araçları vardır.',
    },
    {
      t: 'Renk seçmek', pic: '🔴🟢🔵',
      q: 'Paint\'te kırmızı bir çizgi çizmek istiyorsunuz. Sıra nasıl olmalı?',
      opts: ['Önce çizerim, sonra rengi seçerim', 'Önce kırmızıya tıklarım, sonra çizerim', 'Renk değiştirilemez'], ok: 1,
      why: 'Seçtiğiniz renk, bundan sonra çizeceklerinize uygulanır.',
    },
    {
      t: 'İçini boyamak', pic: '▭ ➜ 🟥',
      q: 'Çizdiğiniz bir dikdörtgenin içini tek tıkla boyamak için hangi araç?',
      opts: ['Silgi', 'Kalem', 'Doldur (🪣 boya kovası)'], ok: 2,
      why: 'Doldur aracı kapalı bir alanın içini boyar. Şeklin çizgisinde boşluk varsa boya taşar; o zaman Ctrl + Z.',
    },
    {
      t: 'Yanlış çizim', pic: '〰❌',
      q: 'Paint\'te yanlış bir şey çizdiniz. En hızlı düzeltme hangisi?',
      opts: [K('Ctrl', 'Z'), 'Paint\'i kapatıp açmak', 'Bütün resmi silgiyle silmek'], ok: 0,
      why: 'Ctrl + Z, Not Defteri\'nde olduğu gibi Paint\'te de son yaptığınızı geri alır.',
    },
    {
      t: 'Ekran Alıntısı', pic: '✂',
      q: 'Ekran Alıntısı ne işe yarar?',
      opts: ['Ekranın bir bölümünün resmini almaya', 'Ekranı kapatmaya', 'Yazıları büyütmeye'], ok: 0,
      why: 'Örneğin bir hata mesajının resmini alıp yardım isteyeceğiniz kişiye gönderebilirsiniz.',
    },
    {
      t: 'Alıntı kısayolu', pic: '✂ ⌨',
      q: 'Gerçek Windows bilgisayarda Ekran Alıntısı hangi kısayolla açılır?',
      opts: [K('Ctrl', 'S'), K('⊞', 'Shift', 'S'), K('Alt', 'Tab')], ok: 1,
      why: 'Windows tuşu + Shift + S. Alınan resim panoya gider; Ctrl + V ile Paint\'e, e-postaya ya da mesaja yapıştırılır.',
    },
    {
      t: 'Arka plan', pic: '🖼',
      q: 'Masaüstünün arka plan resmini nereden değiştirirsiniz?',
      opts: ['Ayarlar → Kişiselleştirme', 'Ayarlar → Saat ve dil', 'Hesap Makinesi'], ok: 0,
      why: 'Kişiselleştirme\'den hazır resimlerden birini ya da kendi fotoğrafınızı seçebilirsiniz.',
    },
    {
      t: 'Wi-Fi şifresi', pic: '📶 🔑',
      q: 'Evdeki Wi-Fi ağına bağlanırken istenen şifre nedir?',
      opts: ['Bankamın şifresi', 'Modemin altında yazan (ya da ev sahibinden alınan) ağ şifresi', 'E-posta şifrem'], ok: 1,
      why: 'Wi-Fi şifresi modemin altındaki etikette yazar. Başka hiçbir şifrenizi buraya yazmayın.',
    },
    {
      t: 'Şifresiz ağlar', pic: '📶 🔓',
      q: 'Kafede şifresiz (açık) bir Wi-Fi ağına bağlandınız. Ne yapmamalısınız?',
      opts: ['Haber okumak', 'Hava durumuna bakmak', 'Banka işlemi yapmak, şifre girmek'], ok: 2,
      why: 'Şifresiz ağlarda gönderdikleriniz başkalarınca görülebilir. Banka işlemlerini evde ya da telefonun kendi internetiyle yapın.',
    },
    {
      t: 'Küçük yazılar', pic: '<span style="font-size:.35em">küçük yazı</span> ➜ büyük',
      q: 'Ekrandaki yazılar okunamayacak kadar küçük. Ne yaparsınız?',
      opts: ['Ayarlar → Erişilebilirlik → Metin boyutu ile büyütürüm', 'Ekranı değiştiririm', 'Gözlüğümü çıkarırım'], ok: 0,
      why: 'Metin boyutu bütün programlardaki yazıları büyütür. Tarayıcıda ise Ctrl + tekerlek de sayfayı büyütür.',
    },
    { t: 'Saat yanlış', pic: '🕒 ❌', q: 'Bilgisayarın saati yıllarca geride ve güvenli siteler “Bağlantınız gizli değil” diyor. İlk neye bakarsınız?', opts: ['Tarih ve saatin doğru olup olmadığına: Ayarlar → Saat ve dil → Saati otomatik ayarla', 'Sitelerin hepsinin bozuk olduğuna', 'Fareye'], ok: 0, why: 'Yanlış tarih, sitelerin sertifikasını geçersiz gösterir. Saati otomatik ayarlamak çoğu zaman sorunu çözer.' },
    { t: 'Denetim Masası', pic: '🎛', q: 'Windows 7’de bir programı kaldırmak için hangi yol izlenir?', opts: ['Denetim Masası → Programlar ve Özellikler → programı seç → Kaldır', 'Masaüstündeki simgeyi Geri Dönüşüm Kutusu’na atmak', 'Bilgisayarı kapatmak'], ok: 0, why: 'Programlar ve Özellikler, yüklü programların listesini gösterir ve kaldırır. Yeni Windows’ta aynı iş Ayarlar → Uygulamalar’dan da yapılır.' },
  ],
});

export const test8 = test({
  id: 'test8', no: 8, title: '8. hafta testi',
  desc: 'İnternet, indirme, program kurma ve kaldırma, sürücüler ve işletim sistemi kurulumu üzerine 14 soru.',
  qs: [
    {
      t: 'Adresi bilmiyorsanız', pic: '🔍',
      q: 'Bir sitenin adresini bilmiyorsunuz. Ne yaparsınız?',
      opts: ['Aradığımı kelimelerle yazıp ararım', 'Rastgele bir adres uydururum', 'İnterneti kapatırım'], ok: 0,
      why: 'Adresi biliyorsanız adres çubuğuna yazın; bilmiyorsanız aradığınızı kelimelerle yazın, sonuçlardan seçin.',
    },
    {
      t: '“Reklam” yazan sonuç', pic: '<span class="ad-tag">Reklam</span>',
      q: 'Arama sonuçlarının en üstünde “Reklam” yazan bir sonuç var. Bu ne demek?',
      opts: ['En güvenilir sonuçtur', 'Para verilerek üste konmuştur; genellikle tıklanmaz', 'Devletin resmî sitesidir'], ok: 1,
      why: 'Reklamlar bazen asıl siteye benzeyen sahte ya da ücretli sayfalara götürür. Altındaki normal sonuçlara bakın.',
    },
    {
      t: 'Hangi İNDİR düğmesi?', pic: '🟩 İNDİR 🟩 İNDİR',
      q: 'Bir program sayfasında birçok büyük yeşil “İNDİR” düğmesi var. Hangisine tıklarsınız?',
      opts: ['En büyüğüne', 'Hepsine sırayla', 'Hiçbirine; programın adının yazdığı sade indirme bağlantısına'], ok: 2,
      why: 'Büyük, parlak İNDİR düğmeleri çoğunlukla reklamdır. Mümkünse programın kendi resmî sitesinden indirin.',
    },
    {
      t: 'İndirilenler', pic: '⬇',
      q: 'İnternetten indirdiğiniz dosyalar nereye gider?',
      opts: ['Masaüstüne', 'İndirilenler klasörüne', 'Geri Dönüşüm Kutusu\'na'], ok: 1,
      why: 'Dosya Gezgini\'nin solunda ⬇ İndirilenler klasörü vardır.',
    },
    {
      t: 'İzin penceresi', pic: '🛡 “Değişiklik yapılsın mı?”',
      q: 'Kurulumda “Bu uygulamanın cihazınızda değişiklik yapmasına izin veriyor musunuz?” sorusu çıktı. Ne yaparsınız?',
      opts: ['Her zaman Evet derim', 'Programı ben indirdiysem Evet; tanımıyorsam Hayır derim', 'Bilgisayarı kapatırım'], ok: 1,
      why: 'Bu pencere sizi korumak içindir. Siz başlatmadığınız bir kurulumda çıkarsa Hayır deyin.',
    },
    {
      t: 'Ek yazılımlar', pic: '☑ Araç çubuğunu da kur',
      q: 'Kurulum sırasında önceden işaretlenmiş “Önerilen: araç çubuğunu da kur” kutucukları var. Ne yaparsınız?',
      opts: ['İşaretlerini kaldırırım', 'Olduğu gibi bırakırım', 'Kurulumu yarıda keserim'], ok: 0,
      why: 'Bu ek yazılımlar çoğunlukla istenmeyen reklam programlarıdır. Her kurulum ekranını okuyarak ilerleyin.',
    },
    {
      t: 'Programı kaldırmak', pic: '🗑 💿',
      q: 'Artık kullanmadığınız bir programı nasıl kaldırırsınız?',
      opts: ['Masaüstündeki simgesini silerim', 'Ayarlar → Uygulamalar → Kaldır', 'Bilgisayarı yeniden başlatırım'], ok: 1,
      why: 'Masaüstündeki simge yalnızca bir kısayoldur; silmek programı kaldırmaz.',
    },
    {
      t: 'Sürücü', pic: '🖨 ↔ 🗄',
      q: 'Sürücü (driver) nedir?',
      opts: ['Bilgisayarı taşıyan kişi', 'Bir parçanın (yazıcı gibi) bilgisayarla anlaşmasını sağlayan küçük program', 'Bir çeşit USB bellek'], ok: 1,
      why: 'Sürücüsü olmayan yazıcı takılı olsa bile çalışmaz.',
    },
    {
      t: 'Sarı ünlem', pic: '⚠',
      q: 'Aygıt Yöneticisi\'nde bir aygıtın yanında sarı ünlem var. Ne demek?',
      opts: ['Aygıt çok yeni', 'Aygıt kapalı', 'O aygıtın sürücüsü eksik ya da sorunlu'], ok: 2,
      why: 'Sağ tık → Sürücüyü güncelleştir ile çözülebilir; olmazsa üreticinin kendi sitesinden indirilir.',
    },
    {
      t: 'Kurulumdan önce', pic: '💽 ➜ 🗄',
      q: 'İşletim sistemini yeniden kurmadan önce ilk ne yapılmalı?',
      opts: ['Önemli dosyaların yedeği alınmalı', 'Ekran temizlenmeli', 'Fare değiştirilmeli'], ok: 0,
      why: 'Kurulum seçilen diski biçimlendirebilir; diskteki her şey silinir.',
    },
    { t: 'İşletim sistemi', pic: '🪟 🐧 🐆', q: 'Okullardaki akıllı tahtalarda çalışan yerli işletim sistemi hangisidir?', opts: ['Pardus (ETAP)', 'Windows 7', 'macOS'], ok: 0, why: 'Pardus, TÜBİTAK ULAKBİM’in geliştirdiği Linux tabanlı yerli işletim sistemidir; akıllı tahtalarda Pardus ETAP kullanılır.' },
    { t: 'Tarayıcı mı, arama motoru mu?', pic: '🌐 🔎', q: 'Hangisi bir arama motorudur?', opts: ['Microsoft Edge', 'Google Chrome', 'Bing'], ok: 2, why: 'Edge ve Chrome tarayıcıdır (program); Bing, Google, Yandex arama motorudur (tarayıcının içinde açılan site).' },
    { t: 'Antivirüs', pic: '🛡', q: 'Windows 10 ve 11’de ek antivirüs programı almak zorunlu mudur?', opts: ['Hayır; Windows Güvenliği hazır gelir ve kendiliğinden güncellenir', 'Evet, yoksa bilgisayar açılmaz', 'Evet, en az üç tane'], ok: 0, why: 'Windows Güvenliği çoğu ev kullanıcısı için yeterlidir. Birden çok antivirüs birbirini bozar.' },
    { t: 'Video kalitesi', pic: '🎞 1080p', q: 'Telefonda kotanız kısıtlı. Video izlerken hangi kalite kotanızı en az harcar?', opts: ['4K', '360p', '1080p'], ok: 1, why: 'Sayı küçüldükçe video daha az veri harcar. Küçük ekranda 360p–480p yeterlidir.' },
  ],
});

// 3B "Donanım dersi"nin (bilgisayar.html#ders) tekrar testi
export const testDonanim = test({
  id: 'testDonanim', no: 4, title: 'Donanım testi: kasanın içi',
  desc: '3B donanım dersinin tekrarı: anakart, işlemci, RAM, disk, SSD, ekran kartı, güç kaynağı, fan ve kablolar üzerine 15 soru.',
  qs: [
    { t: 'Anakart', pic: '🟩', q: 'Bütün parçaların takıldığı, onları birbirine bağlayan büyük kart hangisi?', opts: ['Ekran kartı', 'Anakart', 'Güç kaynağı'], ok: 1, why: 'Anakart şehrin yolları gibidir: işlemci, RAM, disk ve kartlar onun üzerinden haberleşir.' },
    { t: 'İşlemci', pic: '🧠', q: 'Bilgisayarın “beyni”, bütün hesapları yapan parça hangisi?', opts: ['İşlemci (CPU)', 'RAM', 'Fan'], ok: 0, why: 'İşlemci lokantadaki aşçı gibidir: tıkladığımız, yazdığımız her şey onun hesabından geçer.' },
    { t: 'İşlemcinin adı', pic: 'i5-4590', q: 'İlanda “Intel Core i5-4590” yazıyor. Tireden sonraki ilk sayı (4) ne demek?', opts: ['4. nesil: hangi yılın işlemcisi olduğu', '4 GB RAM', '4 tane fan'], ok: 0, why: 'Tireden sonraki ilk sayı nesildir, yani işlemcinin yılı: 4. nesil 2014 civarı, 12. nesil 2022 civarı. i3, i5, i7 ise sınıfıdır.' },
    { t: 'Yeni mi, güçlü mü?', pic: '🚗 2014 · 2022', q: 'Hangisi büyük ihtimalle daha hızlıdır?', opts: ['i7, 4. nesil', 'i5, 12. nesil', 'İkisi aynı'], ok: 1, why: 'Arabanın model yılı gibi: yeni nesil, eski nesilden çoğu zaman hızlıdır. Önce nesle, sonra sınıfa bakılır.' },
    { t: 'Soğutucu', pic: '🌡 🌀', q: 'İşlemcinin üstündeki metal kanatlar ve fan ne işe yarar?', opts: ['İşlemciyi hızlandırır', 'İşlemcinin ısısını alıp uzaklaştırır', 'Elektrik verir'], ok: 1, why: 'İşlemci çalışırken çok ısınır. Soğutucu arabanın radyatörü gibidir; olmasa işlemci kendini korumak için kapanır.' },
    { t: 'RAM: geçici hafıza', pic: '🗒', q: 'RAM için hangisi doğrudur?', opts: ['Fotoğraflar yıllarca burada saklanır', 'Açık işleri tutar; elektrik gidince içi silinir', 'Görüntüyü ekrana gönderir'], ok: 1, why: 'RAM çalışma masasıdır: üzerinde çalıştığınız işler oradadır, akşam masa temizlenir. Kalıcı saklama diskin işidir.' },
    { t: 'Elektrik kesildi', pic: '⚡ 📝 ❌', q: 'Kaydetmediğiniz yazı elektrik kesilince kayboldu. Yazı neredeydi?', opts: ['Diskte', 'RAM’de', 'Ekran kartında'], ok: 1, why: 'Yazı masanın üstündeydi (RAM), dolaba (diske) konmamıştı. Ctrl + S ile kaydetmek, masadakini dolaba koymaktır.' },
    { t: 'Disk dolu', pic: '🗄 100%', q: 'Bilgisayar “Disk dolu” uyarısı veriyor. Ne gerekir?', opts: ['Daha çok RAM', 'Daha büyük disk ya da gereksiz dosyaları silmek', 'Daha güçlü fan'], ok: 1, why: 'Dolap dolmuştur. RAM ise masadır; aynı anda çok program açınca yavaşlama oluyorsa artırılır.' },
    { t: 'İlan okumak', pic: '🏷', q: 'İlanda “16 GB RAM, 512 GB SSD” yazıyor. Fotoğraflarınız hangisine kaydedilir?', opts: ['16 GB RAM’e', '512 GB SSD’ye', 'İkisine de sığmaz'], ok: 1, why: 'SSD diskidir: dosyalar orada kalıcı durur. 16 GB RAM, o an açık işler için masadır.' },
    { t: 'SSD', pic: '⚡💽', q: 'Eski bilgisayar çok geç açılıyor. Hangi değişiklik en çok hızlandırır?', opts: ['Daha büyük ekran', 'HDD yerine SSD takmak', 'Yeni klavye'], ok: 1, why: 'SSD’de dönen parça yoktur; bilgiyi yongalarda saklar ve HDD’den kat kat hızlıdır.' },
    { t: 'Ekran kartı', pic: '🎨 ➜ 🖥', q: 'Ekrandaki görüntüyü çizip monitöre gönderen parça hangisi?', opts: ['Ekran kartı', 'Güç kaynağı', 'Disk'], ok: 0, why: 'Ekran kartı ressam gibidir; saniyede onlarca resim çizer. Monitör kablosu onun çıkışına takılır.' },
    { t: 'Güç kaynağı', pic: '🔌', q: 'Güç kaynağı (PSU) ne yapar?', opts: ['Dosyaları saklar', 'Prizdeki elektriği parçalara uygun hale getirip dağıtır', 'İnternete bağlar'], ok: 1, why: 'Telefonun şarj aleti gibidir: prizdeki güçlü elektriği parçalara uygun zayıf elektriğe çevirir ve kablolarla dağıtır.' },
    { t: 'Kablolar', pic: '🟧 🟦', q: 'Bir diske hangi kablolar takılır?', opts: ['Yalnızca güç kablosu', 'Yalnızca veri kablosu', 'Bir güç, bir veri kablosu'], ok: 2, why: 'Güç kablosu elektrik getirir, veri kablosu bilgiyi anakarta taşır. Biri eksikse bilgisayar diski kullanamaz.' },
    { t: 'Fotoğrafın yolculuğu', pic: '🖼', q: 'Bir fotoğrafı açınca parçalar hangi sırayla çalışır?', opts: ['Ekran kartı → işlemci → disk → RAM', 'Disk → RAM → işlemci → ekran kartı', 'RAM → disk → ekran kartı → işlemci'], ok: 1, why: 'Dolaptan alınır (disk), masaya konur (RAM), işlenir (işlemci), çizilip gösterilir (ekran kartı → ekran).' },
    { t: 'Güvenlik', pic: '🔧 ⚠', q: 'Kasanın kapağını açmadan önce ilk ne yapılır?', opts: ['Bilgisayar kapatılır ve fişi çekilir', 'Fanlar elle durdurulur', 'Hiçbir şey; açıkken daha kolay'], ok: 0, why: 'Önce kapatıp fişi çekin, sonra bir metale dokunup statik elektriği boşaltın. Güç kaynağının içini ise hiç açmayın.' },
  ],
});

export const test9 = test({
  id: 'test9', no: 9, title: '9. hafta testi',
  desc: 'E-posta okuma, yanıtlama, iletme, Bilgi ve Gizli alıcılar, taslak, ek indirme, istenmeyen posta, bulut paylaşımı ve şifre sıfırlama üzerine 11 soru.',
  qs: [
    { t: 'E-posta adresi', pic: '✉', q: 'Hangi e-posta adresi doğru yazılmıştır?', opts: ['ayse yilmaz@ornek.com', 'ayse@örnek.com', 'ayse.yilmaz@ornek.com'], ok: 2, why: 'Adreste boşluk ve Türkçe harf (ç, ğ, ı, ö, ş, ü) olmaz; bir tane @ ve sonra noktalı bir alan adı olur.' },
    { t: 'Yanıtla', pic: '↩', q: 'Torununuz size fotoğraf gönderdi, teşekkür etmek istiyorsunuz. Hangi düğmeye basarsınız?', opts: ['↩ Yanıtla', '↪ İlet', '🗑 Sil'], ok: 0, why: 'Yanıtla: size yazana cevap verir; Kime kutusu kendiliğinden dolar.' },
    { t: 'İlet', pic: '↪', q: 'Gelen faturayı oğlunuza da göstermek istiyorsunuz. Ne yaparsınız?', opts: ['Yanıtla\'ya basarım', 'İlet\'e basıp Kime\'ye oğlumun adresini yazarım', 'Faturayı silerim'], ok: 1, why: 'İlet, postayı ve eklerini başkasına gönderir. Yanıtla yalnızca gönderene cevap verir.' },
    { t: 'Bilgi (Cc)', pic: 'Cc', q: 'Bilgi (Cc) alanındaki kişiler için hangisi doğrudur?', opts: ['Posta onlara gizlice gider; kimse görmez', 'Postayı alır ve herkes onların adresini de görür', 'Postayı alamazlar'], ok: 1, why: 'Cc “bilgisi olsun” demektir. Kime, Cc\'deki herkes birbirini görür. Gizlilik için Bcc kullanılır.' },
    { t: 'Gizli (Bcc)', pic: 'Bcc', q: '30 kişilik gruba bayram mesajı atarken adreslerin birbirine görünmemesi için ne yaparsınız?', opts: ['Hepsini Kime\'ye yazarım', 'Hepsini Gizli (Bcc) alanına yazarım', 'Her birine ayrı ayrı telefon ederim'], ok: 1, why: 'Bcc\'deki alıcılar birbirinin adresini göremez. Kime ya da Cc\'ye yazarsanız adresler herkese görünür.' },
    { t: 'Taslak', pic: '📝', q: 'Posta yazarken yarıda kaldınız ve başka bir klasöre geçtiniz. Posta ne oldu?', opts: ['Silindi', 'Taslaklar klasöründe bekliyor', 'Kendiliğinden gönderildi'], ok: 1, why: 'Yarım postalar Taslaklar\'a kaydedilir; oradan açıp yazmaya devam edebilir ve gönderebilirsiniz.' },
    { t: 'Ek indirme', pic: '📎 ⬇', q: 'Tahlil sonucunu e-postadan indirdiniz. Dosya nereye kaydedildi?', opts: ['Masaüstüne', 'İndirilenler klasörüne', 'Bilgisayarın dışına'], ok: 1, why: 'İndirilen her dosya önce İndirilenler klasörüne düşer. Önemli belgeleri oradan kendi klasörünüze taşıyın.' },
    { t: 'Sahte posta', pic: '🎣', q: '“Hesabınız askıya alındı, hemen şifrenizi girin” diyen bir posta geldi. Ne yaparsınız?', opts: ['Bağlantıya tıklayıp şifremi girerim', 'Bağlantıya tıklamam, İstenmeyen\'e atar ve gerekirse bankamı kendim ararım', 'Postayı arkadaşlarıma iletirim'], ok: 1, why: 'Bankalar e-postayla şifre istemez. Bağlantıya tıklamayın; şüphede bankayı kartın arkasındaki numaradan arayın.' },
    { t: 'Büyük dosya', pic: '🎬 ☁', q: 'Torunun düğün videosu 850 MB. E-postaya sığmıyor. Ne yaparsınız?', opts: ['Videoyu parçalayıp 50 postayla gönderirim', 'Buluta yükleyip paylaşım bağlantısını postayla gönderirim', 'Videoyu silerim'], ok: 1, why: 'E-postayla en fazla 25 MB gönderilir. Büyük dosyalar buluta yüklenir, bağlantı gönderilir.' },
    { t: 'Şifre sıfırlama', pic: '🔑', q: 'Biri sizi arayıp “size gelen SMS kodunu söyleyin” diyor. Ne yaparsınız?', opts: ['Kodu söylerim', 'Kapatırım; doğrulama kodu yalnızca ilgili sayfaya yazılır', 'Kodun yarısını söylerim'], ok: 1, why: 'Hiçbir görevli kodu telefonda istemez. İsteyen dolandırıcıdır. Kod yalnızca kendi ekranınızdaki sayfaya yazılır.' },
    { t: 'Gmail ve Hotmail', pic: '@gmail · @hotmail', q: 'Adresi @hotmail.com olan biri ile @gmail.com olan biri birbirine e-posta gönderebilir mi?', opts: ['Evet, e-posta hizmetleri birbirine posta gönderir', 'Hayır, aynı hizmette olmaları gerekir', 'Yalnızca ek yoksa'], ok: 0, why: 'E-posta ortak bir sistemdir: hangi hizmette olursanız olun adres doğruysa posta ulaşır.' },
  ],
});

export const test10 = test({
  id: 'test10', no: 10, title: '10. hafta testi',
  desc: 'Kelime işlemci: biçimlendirme, sayfa düzeni ve yazdırma, tablo, simge ve şekil, kaydetme üzerine 10 soru.',
  qs: [
    { t: 'Başlık', pic: '📢', q: 'Merdivene asılacak duyurunun başlığını uzaktan okunur yapmak için ne yapılır?', opts: ['Küçük ve sola dayalı yazılır', 'Büyük, kalın ve ortalı yazılır', 'Altı çizgili yazılır'], ok: 1, why: 'Büyük, kalın ve ortalı başlık uzaktan okunur. Boyut “punto” ile ayarlanır (24–28).' },
    { t: 'İki yana yasla', pic: '≣', q: 'Resmî yazıların (dilekçe) paragrafları genellikle nasıl hizalanır?', opts: ['Ortalı', 'İki yana yaslı', 'Sağa dayalı'], ok: 1, why: 'İki yana yaslama (Ctrl + J) paragrafın iki kenarını da düz yapar. Tarih ve imza ise sağa hizalanır.' },
    { t: 'Kâğıda sığdırmak', pic: '📄 📄', q: 'Belgenin son iki satırı ikinci sayfaya taştı. En iyi çözüm hangisi?', opts: ['Enter\'a basarak sayfayı doldurmak', 'Kenar boşluklarını daraltmak ya da yazıyı bir punto küçültmek', 'İkinci sayfayı hiç yazdırmamak'], ok: 1, why: 'Kenar boşluğunu daraltmak ve yazıyı biraz küçültmek sayfa sayısını azaltır.' },
    { t: 'Yazdırma önizlemesi', pic: '🖨 👁', q: 'Yazdırmadan önce Ctrl + P ile neye bakarsınız?', opts: ['Yazıcının rengine', 'Kâğıtta nasıl çıkacağına ve kaç sayfa olduğuna', 'Bilgisayarın hızına'], ok: 1, why: 'Önizleme kâğıt israf etmeden hatayı yakalatır: taşan satır, yatay-dikey, kaç sayfa…' },
    { t: 'Yatay kâğıt', pic: '▭ ▯', q: 'Çok sütunlu geniş bir çizelge dikey kâğıda sığmıyor. Ne yaparsınız?', opts: ['Yazıyı bir harf yapmak', 'Düzen → Yönlendirme → Yatay', 'Yazıcıyı değiştirmek'], ok: 1, why: 'Yatay kâğıt geniş çizelgeler içindir. Mektup ve dilekçe dikeydir.' },
    { t: 'Filigran', pic: '🔖', q: 'Taslak bir belgenin sayfa arkasında silik “TASLAK” yazısı çıksın istiyorsunuz. Neyi kullanırsınız?', opts: ['Filigran', 'Sayfa sonu', 'Üst bilgi'], ok: 0, why: 'Filigran, arka plana silik yazı koyar; yazıyı etkilemez.' },
    { t: 'Sayfa sonu', pic: '⤓', q: 'Bir sonraki bölümün yeni sayfadan başlamasını nasıl sağlarsınız?', opts: ['Enter\'a otuz kez basarım', 'Ctrl + Enter (sayfa sonu)', 'Bilgisayarı yeniden başlatırım'], ok: 1, why: 'Ctrl + Enter yeni sayfa açar. Enter ile boşluk bırakılırsa metin değişince düzen bozulur.' },
    { t: 'Tabloya satır ekleme', pic: '▦ +', q: 'Hazır tabloya yeni bir komşu eklemek istiyorsunuz. Ne yaparsınız?', opts: ['Yeni tablo çizerim', 'Tabloya tıklayıp Tablo Düzeni → Alta ekle', 'Tabloyu silip baştan yazarım'], ok: 1, why: 'Tabloya tıklayınca Tablo Düzeni çıkar; oradan satır ya da sütun eklenip silinir.' },
    { t: 'Hücreleri birleştirme', pic: '⊞', q: 'Tablonun üstüne tek parça bir başlık koymak için ne yapılır?', opts: ['Hücreler seçilip birleştirilir', 'Sütunlar silinir', 'Yazı küçültülür'], ok: 0, why: 'Yan yana hücreleri seçip “Hücreleri birleştir” dersiniz; tek büyük hücre olur.' },
    { t: 'Simge', pic: '₺ ½ ©', q: 'Klavyenizde ₺ ya da ½ işareti bulamıyorsunuz. Ne yaparsınız?', opts: ['İnternetten kopyalarım', 'Ekle → Simge menüsünden seçerim', 'O işareti hiç yazamam'], ok: 1, why: 'Simge menüsünde klavyede olmayan işaretler hazır durur.' },
  ],
});

export const test11 = test({
  id: 'test11', no: 11, title: '11. hafta testi',
  desc: 'Hesap tablosu: formüller, doldurma, sütun genişliği ve #####, birleştirme, çalışma sayfaları, yazdırma üzerine 11 soru.',
  qs: [
    { t: 'Formül', pic: '=', q: 'B2 ile B5 arasındaki sayıların toplamını bulan formül hangisidir?', opts: ['=TOPLA(B2:B5)', '=B2+B5', 'TOPLA B2 B5'], ok: 0, why: 'Formüller = ile başlar. TOPLA(B2:B5) iki nokta ile aralığı verir: B2, B3, B4 ve B5.' },
    { t: 'Otomatik doldurma', pic: '■ ↓', q: 'A2 hücresine Ocak yazdınız. Aralık\'a kadar devam ettirmenin en hızlı yolu hangisi?', opts: ['Her ayı tek tek yazmak', 'Hücrenin sağ alt köşesindeki kareyi aşağı çekmek', 'Hücreyi silmek'], ok: 1, why: 'Doldurma tutamacı ay, gün ve sayı listelerini kendiliğinden devam ettirir.' },
    { t: '#####', pic: '#####', q: 'Bir hücrede ##### görünüyor. Bu ne demektir?', opts: ['Sayı silindi', 'Sütun dar, sayı sığmıyor', 'Bilgisayar virüslü'], ok: 1, why: '##### yalnızca “sütun dar” demektir. Sütun çizgisine çift tıklayınca genişler.' },
    { t: 'Sütunu genişletmek', pic: '↔', q: 'Bir sütunu içeriğine göre otomatik genişletmenin en kolay yolu?', opts: ['Sütun harflerinin arasındaki çizgiye çift tıklamak', 'Sütunu silip yeniden yazmak', 'Yazıyı küçültmek'], ok: 0, why: 'Başlıktaki çizgiye çift tıklamak, sütunu en uzun yazıya göre genişletir.' },
    { t: 'Birleştir ve Ortala', pic: '⊞', q: 'Tablonun üstündeki başlığı birkaç hücreye yaymak için ne yapılır?', opts: ['Hücreler seçilip Birleştir ve Ortala\'ya tıklanır', 'Başlık her hücreye ayrı yazılır', 'Sütunlar silinir'], ok: 0, why: 'Yan yana hücreleri seçip Birleştir ve Ortala dersiniz; başlık tek hücre olur ve ortalanır.' },
    { t: 'Metni Kaydır', pic: '↲', q: 'Hücrenin içindeki uzun yazı kesiliyor. Sütunu genişletmeden alt satıra indirmek için hangi düğme kullanılır?', opts: ['Metni Kaydır', 'Filtre', 'Üst Satırı Dondur'], ok: 0, why: 'Metni Kaydır uzun yazıyı hücre içinde alt satıra indirir ve satırı yükseltir.' },
    { t: 'Üst satırı dondur', pic: '❄', q: '300 satırlık listede aşağı inince başlıkların kaybolmaması için ne yapılır?', opts: ['Üst Satırı Dondur', 'Sütunları silmek', 'Yazı rengini değiştirmek'], ok: 0, why: 'Üst Satırı Dondur, başlık satırının hep ekranda kalmasını sağlar.' },
    { t: 'Çalışma sayfası', pic: '📑', q: 'Ocak ayı tablosunu bozmadan Şubat için aynısını hazırlamanın en kolay yolu?', opts: ['Ocak sekmesine sağ tık → Taşı veya Kopyala → Kopya oluştur', 'Her şeyi sıfırdan yazmak', 'Ocak\'u silip Şubat yazmak'], ok: 0, why: 'Kopya hazır tabloyu korur; yalnızca değişen rakamları güncellersiniz. Ocak aynen kalır.' },
    { t: 'Sayfa sekmeleri', pic: '＋', q: 'Çalışma kitabına yeni bir sayfa eklemek için nereye tıklanır?', opts: ['Alttaki sekmelerin yanındaki ＋', 'Formül çubuğuna', 'Sütun harflerine'], ok: 0, why: 'Alt kısımdaki ＋ düğmesi yeni çalışma sayfası ekler. Sekmeye çift tıklayarak adı değiştirilir.' },
    { t: 'Yazdırma', pic: '🖨', q: 'Tablonun son sütunu ikinci kâğıda taşıyor. Hangisi çözüm değildir?', opts: ['Tüm sütunları bir sayfaya sığdır', 'Kâğıdı yatay yapmak', 'Yazıcının kablosunu değiştirmek'], ok: 2, why: 'Çözüm yazdırma ayarlarındadır: yatay kâğıt ya da bir sayfaya sığdırma. Kablonun alakası yok.' },
    { t: 'DÜŞEYARA', pic: '🔎 =DÜŞEYARA(…)', q: 'Ürün adını yazınca fiyatını fiyat listesinden getiren işlev hangisidir?', opts: ['TOPLA', 'DÜŞEYARA', 'ORTALAMA'], ok: 1, why: 'DÜŞEYARA, bir listede aranan değeri bulup yanındaki bilgiyi getirir. Bulamazsa #YOK çıkar.' },
  ],
});

export const test12 = test({
  id: 'test12', no: 12, title: '12. hafta testi',
  desc: 'Sunu: slayt düzenleri, çoğaltma, Slayt Sıralayıcı, SmartArt, geçiş ve animasyon farkı, anı albümü, PDF/video çıktısı üzerine 12 soru.',
  qs: [
    { t: 'Slayt nedir?', pic: '📙', q: 'Bir sunudaki her bir sayfaya ne denir?', opts: ['Slayt', 'Hücre', 'Paragraf'], ok: 0, why: 'Sununun her sayfasına slayt denir. Kısa başlık, birkaç madde ve resim koyulur.' },
    { t: 'Az yazı', pic: '✍', q: 'Slaytlara yazı nasıl yazılmalıdır?', opts: ['Kısa maddelerle, az yazıyla', 'Uzun paragraflarla, bütün bilgiyi sığdırarak', 'En küçük punto ile'], ok: 0, why: 'Dinleyiciler okumaya değil sizi dinlemeye bakmalı. Slayta kısa maddeler ve resim koyulur.' },
    { t: 'Slaytı çoğalt', pic: '⧉', q: 'Çok benzer ikinci bir slayt yapacaksınız. En hızlı yol hangisi?', opts: ['Slaytı Çoğalt, sonra yazıyı değiştirmek', 'İkincisini sıfırdan çizmek', 'Hiç slayt yapmamak'], ok: 0, why: 'Slaytı Çoğalt, düzeni ve renkleri korur; siz yalnızca yazıyı değiştirirsiniz.' },
    { t: 'Slayt Sıralayıcı', pic: '▦', q: 'Bütün slaytları kuşbakışı görüp sürükleyerek yerlerini değiştirmek için hangi görünüm kullanılır?', opts: ['Slayt Sıralayıcı', 'Yazdırma önizlemesi', 'Slayt gösterisi'], ok: 0, why: 'Slayt Sıralayıcı: küçük resimler tek ekranda; sürükleyip bırakınca sıra değişir.' },
    { t: 'SmartArt', pic: '🌳', q: 'Aile soy ağacı çizmek için en kolay yol hangisi?', opts: ['Maddeleri SmartArt\'ta Soy ağacı yapmak', 'Her kutuyu elle çizmek', 'Fotoğrafını çekmek'], ok: 0, why: 'SmartArt maddeleri tek tıkla kutulara, oklara ya da soy ağacına çevirir.' },
    { t: 'Sıra göstermek', pic: '1 ➜ 2 ➜ 3', q: 'Bir tarifin adımlarını okla bağlı göstermek istiyorsunuz. Hangi SmartArt?', opts: ['Süreç', 'Liste', 'Soy ağacı'], ok: 0, why: 'Süreç, kutuları oklarla bağlar ve sıra olduğunu belirtir.' },
    { t: 'Geçiş mi, animasyon mu?', pic: '✨ ⟷ 🎞', q: 'Slayttaki maddelerin ekrana tek tek gelmesi nedir?', opts: ['Geçiş', 'Animasyon', 'Tasarım'], ok: 1, why: 'Animasyon aynı slayt içindeki yazı ve resimlerin hareketidir. Geçiş, slayttan slayda geçerken olur.' },
    { t: 'Otomatik ilerleme', pic: '⏱', q: 'Sununun kimse tıklamadan kendi kendine akmasını istiyorsunuz. Ne yaparsınız?', opts: ['Geçişlerde “Kendiliğinden ilerle” süresi vermek', 'Fareyi sürekli oynatmak', 'Bilgisayarı kapatmak'], ok: 0, why: 'Kendiliğinden ilerle: her slayt verilen süre sonra sonrakine geçer.' },
    { t: 'PDF mi, pptx mi?', pic: '📕', q: 'Albümü bilgisayarı olmayan akrabaya göndermek için hangisi daha uygun?', opts: ['PDF ya da video', 'Yalnızca .pptx', 'Yazıcıdan çıkarıp postalamak'], ok: 0, why: 'PDF ve video telefon dahil her cihazda açılır. .pptx için PowerPoint gerekir.' },
    { t: 'Kâğıt tasarrufu', pic: '🖨 4', q: '30 slaytlık sunuyu az kâğıtla yazdırmak için ne yaparsınız?', opts: ['Bir kâğıda 4 slayt düzenini seçerim', 'Her slaytı ayrı kâğıda yazdırırım', 'Hiç yazdırmam'], ok: 0, why: 'Yazdırırken “bir kâğıda 4 slayt” seçilirse 30 slayt yalnızca 8 kâğıda çıkar.' },
    { t: 'Kara ekran', pic: '▶ B', q: 'Slayt gösterisi sırasında ekranı geçici olarak karartmak için hangi tuşa basılır?', opts: ['B', 'Z', 'Esc'], ok: 0, why: 'B kara ekran, W beyaz ekran yapar. Aynı tuşla ya da başka bir tuşla sunuya dönülür. Esc gösteriyi bitirir.' },
    { t: 'Yazı miktarı', pic: '📄', q: 'İyi bir slaytta yazı nasıl olmalıdır?', opts: ['Bütün cümleler küçük puntoyla yazılı', 'Az, kısa maddeler ve büyük punto', 'Sadece resim, hiç yazı yok'], ok: 1, why: 'Slayt dinleyiciye yardım eder, sizin yerinize konuşmaz: 3–5 kısa madde, büyük yazı.' },
  ],
});

export const test13 = test({
  id: 'test13', no: 13, title: '13. hafta testi',
  desc: 'Günlük işler: ekran görüntüsü, fotoğraf kaydetme, tarayıcı, PDF dosyaları ve bilgisayarda mesajlaşma üzerine 12 soru.',
  qs: [
    { t: 'Ekran görüntüsü', pic: '📸', q: 'Bütün ekranın resmini almak için hangi tuşa basılır?', opts: ['Print Screen (PrtSc)', 'Caps Lock', 'Insert'], ok: 0, why: 'PrtSc bütün ekranı panoya alır; Paint\'e Ctrl + V ile yapıştırılır.' },
    { t: 'Kopyala ve taşı', pic: '⧉ ✂', q: 'Bir dosyayı USB belleğe kopyalarsanız asıl dosya ne olur?', opts: ['Yerinde kalır', 'Silinir', 'Bozulur'], ok: 0, why: 'Kopyalamada dosya iki yerde olur; taşımada asıl yerinden alınır.' },
    { t: 'Sayfada yazı arama', pic: 'Ctrl + F', q: 'Uzun bir internet sayfasında bir kelimeyi bulmak için hangi kısayol kullanılır?', opts: ['Ctrl + F', 'Ctrl + P', 'Ctrl + Z'], ok: 0, why: 'Ctrl + F “sayfada bul” kutusunu açar; PDF Okuyucu\'da da aynı kısayol çalışır.' },
    { t: 'Yakınlaştırma', pic: '🔍', q: 'İnternet sayfasındaki yazılar küçük. En hızlı çözüm hangisi?', opts: ['Ctrl basılıyken fare tekerleği', 'Bilgisayarı yeniden başlatmak', 'Ekranı değiştirmek'], ok: 0, why: 'Ctrl + tekerlek (ya da Ctrl ve +) sayfayı yakınlaştırır; Ctrl + 0 eski boyuna döndürür.' },
    { t: 'PDF', pic: '📕', q: 'PDF belgesi için hangisi doğrudur?', opts: ['Her cihazda aynı görünür, yazısı değiştirilemez', 'Yalnızca Word ile açılır', 'Yalnızca yazıcıdan çıkar'], ok: 0, why: 'PDF fatura ve resmî belgeler için idealdir: görünüşü bozulmaz, yazısı değişmez.' },
    { t: 'PDF simgeleri', pic: '⬇ 🖨', q: 'PDF faturayı bilgisayara kaydetmek için hangi simge kullanılır?', opts: ['⬇ İndir', '🖨 Yazdır', '⟳ Döndür'], ok: 0, why: '⬇ bilgisayara kaydeder; 🖨 kâğıda çıkarır; ⟳ yalnızca sayfayı çevirir.' },
    { t: 'Karekod', pic: '▦', q: 'Mesajlaşma uygulamasını bilgisayarda açmak için ne yapılır?', opts: ['Telefonla ekrandaki karekodu okutmak', 'Şifreyi yabancılara söylemek', 'Telefonu bilgisayara yapıştırmak'], ok: 0, why: 'Telefonla karekodu okutursunuz; telefon ve bilgisayar eşleşir. Şifre ya da kod kimseye söylenmez.' },
    { t: 'Belge gönderme', pic: '📎 📕', q: 'Bilgisayarınızdaki PDF belgesini sohbette göndermek için hangi simgeye tıklanır?', opts: ['📎 Ataş', '➤ Gönder yazısına', '⋮ Menüsüne'], ok: 0, why: 'Ataş, bilgisayardan belge ya da fotoğraf seçip sohbete ekler.' },
    { t: 'Oturumu kapat', pic: '⏻', q: 'Ortak bilgisayarda mesajlarınıza baktınız. Ne yapmalısınız?', opts: ['Oturumu kapatmalı', 'Sekmeyi açık bırakmalı', 'Hiçbir şey yapmamalı'], ok: 0, why: 'Açık kalan oturumu sonraki kişi görür. İş bitince mutlaka oturumu kapatın.' },
    { t: 'Sahte mesaj', pic: '🎣', q: 'Tanımadığınız numaradan “hesabınız kapanacak, bağlantıya tıklayın” mesajı geldi. Ne yaparsınız?', opts: ['Tıklamam, numarayı engellerim', 'Tıklar doğrularım', 'Şifremi gönderirim'], ok: 0, why: 'Hiçbir uygulama hesabınızı bağlantıyla doğrulatmaz. Tıklarsanız sahte sayfaya düşersiniz.' },
    { t: 'Çerez', pic: '🍪', q: 'Alışveriş sitesinde baktığınız ürünün reklamı başka sitelerde de karşınıza çıkıyorsa bunun nedeni nedir?', opts: ['Bilgisayarınız dinleniyor', 'Üçüncü taraf (reklam) çerezleri', 'Tesadüf'], ok: 1, why: 'Reklam şirketleri birçok sitede çerez bırakıp sizi tanır. Üçüncü taraf çerezleri engellemek bunu azaltır.' },
    { t: 'PDF yazdırma', pic: '🖨 PDF', q: 'Beş sayfalık bir PDF’den yalnızca ikinci sayfayı yazdıracaksınız. Ne yaparsınız?', opts: ['Hepsini yazdırıp gerisini atarım', 'Yazdırma penceresinde Sayfalar’dan yalnızca 2. sayfayı seçerim', 'PDF’i silerim'], ok: 1, why: 'Sayfalar bölümünden “Aralık: 2” yazılarak yalnızca istenen sayfa yazdırılır; kâğıt ve mürekkep tasarrufu olur.' },
  ],
});

export const test14 = test({
  id: 'test14', no: 14, title: '14. hafta testi',
  desc: 'İnternette işlemler: e-Devlet, MHRS, e-Nabız, alışveriş, görüntülü görüşme ve ilan sitelerinde güvenlik üzerine 10 soru.',
  qs: [
    { t: 'Resmî site', pic: '🇹🇷', q: 'Devletin resmî sitelerinin adresi nasıl biter?', opts: ['.gov.tr', '.xyz', '.com'], ok: 0, why: '.gov.tr devlet kurumlarına verilir. turkiye-gov-giris.com gibi benzer adresler sahte olabilir.' },
    { t: 'Barkodlu belge', pic: '📄 ||||', q: 'e-Devlet\'ten aldığınız belgenin doğruluğunu karşı taraf nasıl kontrol eder?', opts: ['Belgedeki barkod numarasıyla e-Devlet\'te doğrulayarak', 'Yazıcıdan bakarak', 'Telefonla arayarak şifre sorarak'], ok: 0, why: 'Barkodlu belge, e-Devlet\'te barkod numarası yazılarak doğrulanır.' },
    { t: 'Zorunlu alan', pic: '* ⚠', q: 'Formu gönderdiniz, bir alanın altında kırmızı yazı çıktı. Ne yaparsınız?', opts: ['Kırmızı yazıyı okuyup o alanı düzeltirim', 'Sayfayı kapatırım', 'Aynı bilgiyi tekrar tekrar gönderirim'], ok: 0, why: 'Kırmızı yazı neyin eksik ya da hatalı olduğunu söyler. Düzeltince form gider.' },
    { t: 'SMS kodu', pic: '💬 123456', q: 'Alışverişte telefonunuza doğrulama kodu geldi. Kodu nereye yazarsınız?', opts: ['Yalnızca açık olan ödeme sayfasına', 'Telefonla arayan kişiye', 'Arkadaşlarıma iletirim'], ok: 0, why: 'Doğrulama kodu sadece sizin ekranınızdaki ilgili sayfaya yazılır. Telefonda kimse kodu sormaz.' },
    { t: 'Görüntülü görüşme', pic: '🎤 📷', q: 'Görüntülü görüşmede karşıdakiler sizi duyamıyor. İlk neye bakarsınız?', opts: ['Mikrofonun açık olup olmadığına', 'Klavyeye', 'Yazıcıya'], ok: 0, why: 'Çoğu zaman mikrofon sessize alınmıştır ya da tarayıcıda izin verilmemiştir.' },
    { t: 'e-Nabız', pic: '🩺', q: 'e-Nabız\'da bir tahlil değerinin yanında ⚠ işareti var. Ne yaparsınız?', opts: ['Doktora gösterip yorum alırım', 'Hemen çok korkarım', 'Sonucu silerim'], ok: 0, why: 'Referans dışı değer tek başına hastalık demek değildir; doktor yorumlar.' },
    { t: 'Randevu belgesi', pic: '⬇ 📕', q: 'Randevu belgesini bilgisayarınıza saklamak için hangi düğmeye basarsınız?', opts: ['İndir (PDF)', 'Sil', 'Yenile'], ok: 0, why: 'İndir düğmesi belgeyi İndirilenler klasörüne kaydeder; oradan açılır ve yazdırılır.' },
    { t: 'Sahte ilan', pic: '🏚 💸', q: '“Ev sahibi yurtdışında, anahtar kargoyla, hemen kapora yatırın” diyen ilan hakkında ne düşünürsünüz?', opts: ['Dolandırıcılık olabilir; kapora göndermem', 'Çok iyi fırsat, hemen yatırırım', 'Ev sahibi çok güvenilir'], ok: 0, why: 'Evi göstermeden ve acele ettirerek para isteyen ilan genellikle sahtedir.' },
    { t: 'Kapora zamanı', pic: '💰', q: 'Kaporayı ne zaman verirsiniz?', opts: ['Evi görüp sözleşmeyi imzaladıktan sonra, makbuzla', 'Hemen, ilanı gördüğüm gün', 'Fotoğrafı beğenince'], ok: 0, why: 'Evi görmeden ve sözleşmesiz hiçbir ödeme yapılmaz.' },
    { t: 'Çıkış', pic: '⏻', q: 'Kütüphanede e-Devlet\'ten belge aldınız. Çıkarken ne yapmalısınız?', opts: ['Çıkış yapmalı', 'Sekmeyi açık bırakmalı', 'Hiçbir şey yapmamalı'], ok: 0, why: 'Ortak bilgisayarda mutlaka çıkış yapılır; açık oturumu sonraki kişi kullanabilir.' },
  ],
});
