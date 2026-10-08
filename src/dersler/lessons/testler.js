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
  desc: 'Klavyenin tuşları, büyük harf, Türkçe harfler ve işaretler üzerine 10 soru.',
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
  desc: 'Paint, Ekran Alıntısı ve Ayarlar (arka plan, ses, Wi-Fi, yazı boyutu) üzerine 10 soru.',
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
  ],
});

export const test8 = test({
  id: 'test8', no: 8, title: '8. hafta testi',
  desc: 'İnternet, indirme, program kurma ve kaldırma, sürücüler ve işletim sistemi kurulumu üzerine 10 soru.',
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
  ],
});
