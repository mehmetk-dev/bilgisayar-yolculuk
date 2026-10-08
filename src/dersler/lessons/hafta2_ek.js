// 2. hafta ek dersleri: on parmak temel sıra, rakamlar, işaretler, klavye eşleştirme oyunu
import { K } from './common.js';
import { info, ayir, sec, yaz } from './kalip.js';

const HOME = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'];

export const onparmak = {
  id: 'onparmak', icon: '🖐', title: 'On parmak: temel sıra', minutes: 25, stage: 'notepad',
  desc: 'Doğru oturuş, parmakların klavyedeki yeri (A S D F – J K L Ş), F ve J\'deki çıkıntılar; kademeli yazma alıştırmaları.',
  summary: [
    ['Sol el', 'Serçe parmak A, yüzük S, orta D, işaret F'],
    ['Sağ el', 'İşaret J, orta K, yüzük L, serçe Ş'],
    ['Başparmaklar', 'Boşluk tuşu'],
    ['F ve J', 'Üzerindeki küçük çıkıntılar: parmaklar bakmadan yerini bulur'],
    ['Oturuş', 'Sırt dik, bilekler düz, ekran göz hizasının biraz altında'],
  ],
  steps: [
    {
      title: 'Doğru oturuş',
      html: `<ul class="big-list"><li>Sırtınız dik, ayaklarınız yere basık olsun.</li><li>Ekran bir kol boyu uzakta, göz hizasının biraz altında.</li><li>Bilekleriniz düz dursun; klavyeye bastırmayın.</li><li>Arada bir ellerinizi silkeleyip dinlendirin.</li></ul>
        <p>Hızlı yazmak için acele etmeyin: önce <b>doğru parmak</b>, hız sonra gelir.</p>`,
    },
    {
      title: 'Parmaklar nereye?',
      html: `<p>Parmakların bekleme yerine <b>temel sıra</b> denir. Aşağıdaki klavyede sarı yanıyorlar.</p>
        <ul class="big-list"><li>Sol el: <b>A S D F</b></li><li>Sağ el: <b>J K L Ş</b></li><li>İki başparmak: <b>Boşluk</b></li></ul>
        <p><b>F</b> ve <b>J</b> tuşlarının üzerindeki küçük çıkıntıları parmağınızla bulun. İşaret parmaklarınız bunların üzerinde durur; böylece klavyeye bakmadan yerinizi bulursunuz.</p>`,
      keys: HOME,
    },
    yaz({ title: 'Sol el', html: '<p>Not Defteri\'ne tıklayın. Yalnızca <b>sol elinizle</b>, her parmak kendi tuşuna basarak yazın:</p>', target: 'asdf asdf asdf', keys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'Space'], done: 'Sol eliniz yerini öğrendi.' }),
    yaz({ title: 'Sağ el', html: `<p>Şimdi ${K('Enter')} ile alt satıra geçin ve yalnızca <b>sağ elinizle</b> yazın:</p>`, target: 'jklş jklş jklş', keys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Space'], done: 'Sağ eliniz de hazır.' }),
    yaz({ title: 'İki el birlikte', target: 'fjfj dkdk slsl aşaş', keys: HOME, hint: 'Her harfi kendi parmağıyla yazın: f ve j işaret parmakları, d ve k orta parmaklar…', done: 'İki eliniz birlikte çalışıyor.' }),
    yaz({ title: 'İlk kelimeler', html: '<p>Bu kelimelerin hepsi temel sıradaki harflerle yazılır:</p>', target: 'kal sal dal şal asla', keys: HOME, done: 'Kelime yazmaya başladınız!' }),
    yaz({ title: 'G ve H', html: '<p>İşaret parmakları bir yana da uzanır: sol işaret parmağı <b>G</b>\'ye, sağ işaret parmağı <b>H</b>\'ye. Yazın:</p>', target: 'hala dağ sakal kafa', keys: [...HOME, 'KeyG', 'KeyH', 'BracketLeft'], hint: 'Ğ, P\'nin sağındaki tuştur; sağ serçe parmakla basılır.', done: 'Güzel.' }),
    yaz({ title: 'Üst sıraya uzanmak', html: '<p>Parmaklar yukarı da uzanır, sonra yine temel sıraya döner. Sol orta parmak <b>E</b>\'ye, sağ işaret parmağı <b>U</b>\'ya, sağ orta parmak <b>I</b>\'ya gider. Yazın:</p>', target: 'ders eski kule sulu', keys: [...HOME, 'KeyE', 'KeyR', 'KeyU', 'KeyI'], done: 'Her uzanıştan sonra parmaklar temel sıraya döner.' }),
    yaz({ title: 'Bir cümle', html: '<p>Son olarak büyük harfle başlayan ve noktayla biten bir cümle yazın:</p>', target: 'Ali dalda elma aldı.', must: ['Ali', 'dalda', 'elma', 'aldı', '.'], hint: 'Büyük A için sağ elinizle Shift\'i tutun, sol serçe parmakla A\'ya basın. Noktasız ı, O\'nun solundaki tuştur.', done: 'Harika! Her gün birkaç dakika bu satırları yazmak parmaklarınızı hızlandırır.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Parmaklarınızın yerini öğrendiniz:</p>' },
  ],
};

export const rakamlar = {
  id: 'rakamlar', icon: '🔢', title: 'Rakamlar ve sayılar', minutes: 25, stage: 'notepad',
  desc: 'Rakam sırası, telefon numarası, tarih, saat, para tutarı, yüzde; sağdaki sayı tuşları ve Num Lock.',
  summary: [
    ['Rakam sırası', 'Harflerin üstündeki 1 2 3 … 0'],
    ['Tarih', '29.10.2026 (nokta: sağ alttaki . tuşu)'],
    ['Saat', '14:30 (iki nokta: Shift + .)'],
    ['Para', '1.250,50 TL (binlik nokta, kuruş virgül)'],
    ['%', 'Shift + 5'],
    ['+', 'Shift + 4'],
    ['Num Lock', 'Sağdaki sayı tuşlarını açar/kapatır'],
  ],
  steps: [
    {
      title: 'Rakamlar nerede?',
      html: `<p>Klavyede rakamlar iki yerde bulunur:</p><ul class="big-list"><li><b>Rakam sırası</b>: harflerin hemen üstünde, 1'den 0'a.</li><li><b>Sayı tuş takımı</b>: masaüstü klavyelerde en sağda, hesap makinesi gibi dizilmiş. Dizüstü bilgisayarların çoğunda yoktur.</li></ul>`,
      keys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
    },
    yaz({ title: 'Rakam sırası', html: '<p>Not Defteri\'ne tıklayın ve rakamları aralarında boşlukla yazın:</p>', target: '1 2 3 4 5 6 7 8 9 0', keys: ['Digit1', 'Digit5', 'Digit0'], done: 'Rakam sırası tamam.' }),
    yaz({ title: 'Telefon numarası', html: '<p>Yeni satıra bir telefon numarası yazın (gruplar arasında boşluk):</p>', target: '0555 123 45 67', done: 'Telefon numaralarını gruplara ayırmak okumayı kolaylaştırır.' }),
    yaz({ title: 'Tarih', html: '<p>Tarihleri gün, ay ve yıl arasına <b>nokta</b> koyarak yazarız. Yeni satıra yazın:</p>', target: '29.10.2026', keys: ['Slash'], hint: 'Nokta, Ç\'nin sağındaki tuştur.', done: 'Cumhuriyet Bayramı! Ay ve gün tek haneliyse başına 0 konur: 07.10.2026.' }),
    yaz({ title: 'Saat', html: `<p>Saatte saat ile dakika arasına <b>iki nokta (:)</b> konur. İki nokta için ${K('Shift', '.')}. Yeni satıra yazın:</p>`, target: 'Randevu saat 14:30', keys: ['Shift', 'Slash'], done: 'İki noktayı buldunuz.' }),
    yaz({ title: 'Para tutarı', html: '<p>Türkçede büyük sayılarda binler <b>nokta</b> ile, kuruş ise <b>virgül</b> ile ayrılır. Yeni satıra yazın:</p>', target: 'Toplam: 1.250,50 TL', keys: ['Slash', 'Backslash'], hint: 'Virgül, İ\'nin sağındaki tuştur. Büyük T için Shift.', done: 'Bin iki yüz elli lira elli kuruş.' }),
    yaz({ title: 'Yüzde ve artı', html: `<p>${K('Shift', '5')} yüzde (%), ${K('Shift', '4')} artı (+) işaretini yazar. Yeni satıra yazın:</p>`, target: 'İndirim %20, ülke kodu +90', keys: ['Shift', 'Digit5', 'Digit4'], done: 'Türkiye\'nin telefon kodu +90\'dır; yurt dışından aranırken numaranın başına eklenir.' }),
    {
      title: 'Sağdaki sayı tuşları',
      html: `<p>Klavyenizin en sağında sayı tuşları varsa:</p><ol class="steps"><li>Üstündeki <b>Num Lock</b> ışığına bakın. Işık sönükse rakam yazmaz; <b>Num Lock</b>'a bir kez basın.</li><li>Sağdaki tuşlarla <b>2026</b> yazın.</li></ol>
        <p class="mut">Dizüstü bilgisayarınızda bu tuşlar yoksa alttaki düğmeye basın.</p>`,
      manual: '✔ Klavyemde sayı tuşları yok',
      on: (ev, c) => {
        if (ev.type === 'key' && ev.e.code === 'NumLock') c.note(`Num Lock şu an: <b>${ev.e.getModifierState('NumLock') ? 'AÇIK' : 'KAPALI'}</b>`);
        if (ev.type === 'key' && /^Numpad\d$/.test(ev.e.code)) c.s.pad = (c.s.pad || 0) + 1;
        return ev.type === 'input' && (c.s.pad || 0) >= 4 && c.np.value.includes('2026');
      },
      done: 'Sayı tuş takımı, çok rakam yazanlar için (fatura, hesap) çok hızlıdır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Rakamları ve sayıları doğru yazabiliyorsunuz:</p>' },
  ],
};

export const isaretler = {
  id: 'isaretler', icon: '❗', title: 'İşaretler: ( ) / = " # €', minutes: 20, stage: 'notepad',
  desc: 'Parantez, eğik çizgi, tire, eşittir, tırnak, alt çizgi, # ve € işaretleri. Shift ve AltGr ile hangi işaret yazılır?',
  summary: [
    ['Shift + 8 / Shift + 9', '( ve )'],
    ['Shift + 7', '/ (eğik çizgi)'],
    ['Shift + 0', '= (eşittir)'],
    ['" tuşu (1\'in solu)', '" (tırnak)'],
    ['Shift + -', '_ (alt çizgi)'],
    ['AltGr + 3', '#'],
    ['AltGr + E', '€'],
    ['Kural', 'Tuşun üstündeki işaret Shift ile, sağ altındaki AltGr ile yazılır'],
  ],
  steps: [
    {
      title: 'Bir tuşta üç işaret',
      html: `<p>Bazı tuşların üzerinde iki, hatta üç işaret vardır:</p><ul class="big-list"><li><b>Alttaki</b> işaret: tuşa doğrudan basınca.</li><li><b>Üstteki</b> işaret: ${K('Shift')} basılıyken.</li><li><b>Sağ alttaki</b> işaret: ${K('AltGr')} basılıyken.</li></ul>
        <p>Örneğin <b>3</b> tuşu: 3 · Shift ile ^ · AltGr ile #.</p>`,
      keys: ['Shift', 'AltRight'],
    },
    yaz({ title: 'Parantez', html: `<p>Parantez: ${K('Shift', '8')} açar, ${K('Shift', '9')} kapatır. Not Defteri\'ne tıklayıp yazın:</p>`, target: '(0212) 444 00 00', keys: ['Shift', 'Digit8', 'Digit9'], done: 'Alan kodu çoğu zaman parantez içinde yazılır.' }),
    yaz({ title: 'Eğik çizgi', html: `<p>Eğik çizgi: ${K('Shift', '7')}. Adreslerde daire numarası için kullanılır. Yeni satıra yazın:</p>`, target: 'Çiçek Sokak No: 12/3', keys: ['Shift', 'Digit7', 'Slash'], hint: 'İki nokta için Shift + . (nokta).', done: '12/3: 12 numaralı binanın 3 numaralı dairesi.' }),
    yaz({ title: 'Tire ve eşittir', html: `<p>Tire (-), 0'ın sağındaki ikinci tuştur; doğrudan basılır. Eşittir: ${K('Shift', '0')}. Yeni satıra yazın:</p>`, target: 'Kadıköy - İstanbul 2+2=4', keys: ['Equal', 'Shift', 'Digit0', 'Digit4'], hint: 'Artı (+) için Shift + 4.', done: 'Tire ve eşittir tamam.' }),
    yaz({ title: 'Tırnak işareti', html: '<p>Tırnak ("), klavyenin sol üstünde, 1\'in solundaki tuştur. Birinin sözünü yazarken kullanılır. Yeni satıra yazın:</p>', target: 'Annem "Geliyorum" dedi.', must: ['Annem', '"Geliyorum"', 'dedi', '.'], keys: ['Backquote'], done: 'Kesme işareti (\') ise farklıdır: Shift + 2.' }),
    yaz({ title: 'Alt çizgi', html: `<p>Alt çizgi (_), tirenin tuşunda ${K('Shift')} ile yazılır. Kullanıcı adlarında görülür. Yeni satıra yazın:</p>`, target: 'ayse_kaya', keys: ['Shift', 'Equal'], done: 'Alt çizgi ile tire karışmasın: biri altta, biri ortadadır.' }),
    yaz({ title: '# ve €', html: `<p>${K('AltGr', '3')} diyez (#), ${K('AltGr', 'E')} avro (€) yazar. Yeni satıra yazın:</p>`, target: '#bayram 20 €', keys: ['AltRight', 'Digit3', 'KeyE'], hint: 'AltGr, boşluğun sağındaki Alt tuşudur. Yoksa Ctrl + Alt birlikte basılı tutulur.', done: 'AltGr ile @ (Q), # (3), € (E) yazılır.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İşaretleri öğrendiniz. Kural: <b>üstteki işaret Shift, sağ alttaki AltGr.</b></p>' },
  ],
};

export const klavyeOyun = {
  id: 'klavye-oyun', icon: '🧩', title: 'Klavye eşleştirme oyunu', minutes: 15, stage: 'scene',
  desc: 'Tekrar: hangi tuş ne işe yarar? Hangi işaret Shift ile, hangisi AltGr ile yazılır? Kartları sürükleyerek ayırın.',
  summary: [
    ['Silme', 'Backspace (sol), Delete (sağ)'],
    ['Hareket', 'Ok tuşları, Home, End, Tab'],
    ['Büyük harf ve işaret', 'Shift, Caps Lock, AltGr'],
    ['Onay / vazgeç', 'Enter, Esc'],
  ],
  steps: [
    {
      title: 'Ne yapacağız?',
      html: '<p>Klavyede öğrendiklerimizi kartlarla tekrar edeceğiz. Kartları tutup doğru kutuya sürükleyin.</p>',
      scene: info('<div class="sc-big">⌨ ➜ 📦</div><p>Klavye eşleştirme</p>'),
    },
    ayir({
      title: 'Hangi tuş ne yapar?',
      bins: [{ id: 'sil', label: 'Silme', icon: '🧽' }, { id: 'hareket', label: 'Hareket', icon: '↔' }, { id: 'buyuk', label: 'Büyük harf ve işaret', icon: '🔠' }, { id: 'onay', label: 'Onay / vazgeç', icon: '✅' }],
      items: [
        { label: 'Backspace', icon: '⌫', bin: 'sil', why: 'İmlecin solundakini siler.' },
        { label: 'Delete', icon: '🗑', bin: 'sil', why: 'İmlecin sağındakini siler.' },
        { label: 'Ok tuşları', icon: '⬅', bin: 'hareket', why: 'İmleci harf harf, satır satır taşır.' },
        { label: 'Home', icon: '⏮', bin: 'hareket', why: 'Satırın başına götürür.' },
        { label: 'End', icon: '⏭', bin: 'hareket', why: 'Satırın sonuna götürür.' },
        { label: 'Tab', icon: '⇥', bin: 'hareket', why: 'Formlarda bir sonraki kutuya geçirir.' },
        { label: 'Shift', icon: '⇧', bin: 'buyuk', why: 'Basılı tutunca büyük harf ve üstteki işaret.' },
        { label: 'Caps Lock', icon: '🔒', bin: 'buyuk', why: 'Açıkken her şey büyük harf.' },
        { label: 'AltGr', icon: '@', bin: 'buyuk', why: 'Sağ alttaki işaretler: @ # €.' },
        { label: 'Enter', icon: '↵', bin: 'onay', why: 'Alt satır ya da “Tamam”.' },
        { label: 'Esc', icon: '⎋', bin: 'onay', why: 'Vazgeç, menüyü kapat.' },
      ],
      done: 'Tuşları gruplarıyla öğrenmek akılda tutmayı kolaylaştırır.',
    }),
    ayir({
      title: 'Hangi tuşla yazılır?',
      html: '<p>Bu işaretler nasıl yazılır? Kartları doğru kutuya sürükleyin.</p>',
      bins: [{ id: 'tek', label: 'Doğrudan', icon: '👆' }, { id: 'shift', label: 'Shift ile', icon: '⇧' }, { id: 'altgr', label: 'AltGr ile', icon: '⌥' }],
      items: [
        { label: '. (nokta)', icon: '', bin: 'tek', why: 'Ç\'nin sağındaki tuşa doğrudan basılır.' },
        { label: ', (virgül)', icon: '', bin: 'tek', why: 'İ\'nin sağındaki tuşa doğrudan basılır.' },
        { label: '- (tire)', icon: '', bin: 'tek', why: '0\'ın sağındaki ikinci tuş.' },
        { label: '! (ünlem)', icon: '', bin: 'shift', why: 'Shift + 1.' },
        { label: '? (soru)', icon: '', bin: 'shift', why: 'Shift + *.' },
        { label: ': (iki nokta)', icon: '', bin: 'shift', why: 'Shift + . (nokta).' },
        { label: '( (parantez)', icon: '', bin: 'shift', why: 'Shift + 8.' },
        { label: '@ (et)', icon: '', bin: 'altgr', why: 'AltGr + Q.' },
        { label: '# (diyez)', icon: '', bin: 'altgr', why: 'AltGr + 3.' },
        { label: '€ (avro)', icon: '', bin: 'altgr', why: 'AltGr + E.' },
      ],
      done: 'Üstteki işaret Shift, sağ alttaki AltGr.',
    }),
    sec({
      title: 'Dizüstünde Home yok', text: '<div class="qz-pic">💻 <kbd>Fn</kbd></div>',
      q: 'Dizüstü bilgisayarınızda Home ya da End tuşu görünmüyor. Ne yaparsınız?',
      opts: ['Fn tuşunu basılı tutup ok tuşlarına (← →) basarım', 'Yeni klavye alırım', 'Home\'u kullanamam'], ok: 0,
      why: 'Dizüstülerde bazı tuşlar Fn ile çalışır. Tuşun üstünde küçük ve farklı renkte yazan işlev Fn ile kullanılır.',
    }),
    sec({
      title: 'Klavye dili', text: '<div class="qz-pic">ş ➜ ;</div>',
      q: 'Ş\'ye basınca ; (noktalı virgül) yazıyor, Türkçe harfler çıkmıyor. Neden olabilir?',
      opts: ['Klavye dili İngilizceye geçmiş (sağ altta ENG yazar)', 'Klavye bozuldu', 'Caps Lock açık'], ok: 0,
      why: 'Sağ alttaki TUR / ENG yazısına tıklayıp Türkçe Q\'yu seçin. Gerçek bilgisayarda ⊞ Windows + Boşluk da dili değiştirir.',
    }),
    sec({
      title: 'Klavyedeki ışıklar', text: '<div class="qz-pic">💡 💡 💡</div>',
      q: 'Klavyenin üstündeki küçük ışıklar neyi gösterir?',
      opts: ['Klavyenin şarjını', 'Caps Lock ve Num Lock\'ın açık olup olmadığını', 'İnternet bağlantısını'], ok: 1,
      why: 'Caps Lock ışığı yanıyorsa büyük harf yazılır; Num Lock ışığı sönükse sağdaki sayı tuşları rakam yazmaz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Klavyeyi iyi tanıyorsunuz:</p>', scene: info('<div class="sc-big">⌨🏆</div>') },
  ],
};
