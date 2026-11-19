// 2. hafta: klavye
import { K, norm, lines } from './common.js';

const hasCI = (c, word) => norm(c.np.value).split(/\s+/).includes(norm(word));

const kursFormu = {
  title: 'Kurs kayıt formunda alıştırma',
  html: `<p>Ad Soyad alanına tıklayıp <b>Deniz Yılmaz</b> yazın. ${K('Tab')} ile önce Telefon, sonra E-posta alanına geçin. E-posta alanına <b>deniz@example.com</b> yazın.</p>
    <p>Telefonun son rakamı yanlış. E-posta alanından ${K('Shift', 'Tab')} ile telefona dönüp numarayı <b>000 000 00 00</b> olarak düzeltin. Sonra <b>Kontrol et</b> düğmesine basın.</p>
    <p class="mut kurs-formu-dokunmatik">Dokunmatik tuş şeridinde Tab’a veya sırasıyla Shift ve Tab’a dokunun.</p>
    <p class="mut" id="kurs-formu-not">Örnek bilgileri kullanın. Formdaki bilgiler gönderilmez.</p>
    <form class="kurs-formu" aria-label="Örnek kurs kayıt formu" aria-describedby="kurs-formu-not" autocomplete="off" novalidate>
      <label>Ad Soyad <input type="text" required></label>
      <label>Telefon <input type="tel" value="000 000 00 01" required></label>
      <label>E-posta <input type="email" required></label>
      <button type="submit" class="btn">Kontrol et</button>
      <div role="status"></div>
    </form>`,
  setup: (c) => {
    const form = document.querySelector('.kurs-formu');
    const alanlar = [...form.querySelectorAll('input, button')];
    const [ad, telefon, eposta] = alanlar;
    const sonuc = form.querySelector('[role="status"]');
    let fromTab = null;
    let ters = false;
    let adim = 0;

    form.addEventListener('keydown', (e) => {
      fromTab = e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey ? e.target : null;
      ters = e.shiftKey;
      // Dokunmatik tuş şeridinden gelen olay tarayıcının normal Tab hareketini başlatmaz.
      if (fromTab && !e.isTrusted) {
        const hedef = alanlar[alanlar.indexOf(fromTab) + (ters ? -1 : 1)];
        if (hedef) {
          e.preventDefault();
          hedef.focus();
        }
      }
    });
    form.addEventListener('focusin', (e) => {
      if (fromTab === e.relatedTarget) {
        if (!ters && fromTab === ad && e.target === telefon && adim === 0) adim = 1;
        if (!ters && fromTab === telefon && e.target === eposta && adim === 1) adim = 2;
        if (ters && fromTab === eposta && e.target === telefon && adim === 2) adim = 3;
      }
      fromTab = null;
    });
    form.addEventListener('focusout', (e) => {
      if (!form.contains(e.relatedTarget)) fromTab = null;
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (adim < 2) sonuc.textContent = 'Tab ile Ad Soyad alanından Telefon, ardından E-posta alanına geçin.';
      else if (adim < 3) sonuc.textContent = 'E-posta alanına tıklayın ve Shift + Tab ile Telefon alanına dönün.';
      else if (norm(ad.value) !== norm('Deniz Yılmaz')) sonuc.textContent = 'Ad Soyad alanına Deniz Yılmaz yazın.';
      else if (telefon.value.replace(/\s/g, '') !== '0000000000') sonuc.textContent = 'Telefonu 000 000 00 00 olarak düzeltin.';
      else if (eposta.value.trim().toLowerCase() !== 'deniz@example.com') sonuc.textContent = 'E-posta alanına deniz@example.com yazın.';
      else {
        sonuc.textContent = 'Üç alan da doğru.';
        c.emit('kurs-formu-dogru');
      }
    });
  },
  keys: ['Tab', 'Shift'],
  on: (ev) => ev.type === 'kurs-formu-dogru',
  done: 'Tab ile ileri gittiniz, Shift + Tab ile önceki alana dönüp telefonu düzelttiniz.',
};

export const klavye = {
  id: 'klavye', icon: '⌨', title: 'Klavyeyi tanıyalım', minutes: 25, stage: 'notepad',
  progressVersion: 1,
  desc: 'Boşluk, Enter, Backspace, Delete, Shift, Caps Lock, Türkçe harfler, ok tuşları, Tab ve Esc.',
  summary: [
    ['Boşluk', 'Kelimeler arasına boşluk'],
    ['Enter', 'Alt satıra geç'],
    ['⌫ Backspace', 'İmlecin solundaki harfi siler'],
    ['Delete', 'İmlecin sağındaki harfi siler'],
    ['Shift + harf', 'Tek bir büyük harf'],
    ['Caps Lock', 'Hepsi büyük harf (aç/kapat)'],
    ['Shift + 1', '! işareti'],
    ['Shift + *', '? işareti'],
    ['AltGr + Q', '@ işareti (e-posta)'],
    ['↑ ↓ ← →', 'İmleci hareket ettirir'],
    ['Home / End', 'Satırın başına / sonuna'],
    ['Tab', 'Formda sonraki kutuya geçer'],
    ['Shift + Tab', 'Formda önceki kutuya döner'],
    ['Esc', 'Vazgeç, menüyü kapat'],
    ['⊞ Windows', 'Başlat menüsünü açar'],
  ],
  steps: [
    {
      title: 'Klavyeyi tanıyalım',
      html: `<p>Aşağıda klavyenin bir resmi var. Gerçek klavyenizde <b>hangi tuşa basarsanız</b>, ekrandaki resimde de o tuş <b style="color:#2f8cff">mavi</b> yanar.</p>
        <p>Sarı yanan tuşlar, o adımda kullanacağınız tuşlardır.</p>
        <p>Önce birkaç tuşa basıp deneyin: harfler, rakamlar, en alttaki uzun <b>Boşluk</b> tuşu…</p>`,
    },
    {
      title: 'Harf yazın',
      html: '<p>Not Defteri\'nin beyaz alanına tıklayın ve <b>elma</b> yazın.</p>',
      keys: ['KeyE', 'KeyL', 'KeyM', 'KeyA'],
      on: (ev, c) => ev.type === 'input' && hasCI(c, 'elma'),
      done: 'Yazdığınız harfler, yanıp sönen çizginin (imlecin) olduğu yere gelir.',
    },
    {
      title: 'Boşluk',
      html: `<p>En alttaki uzun tuş <b>Boşluk</b> tuşudur. Bir boşluk bırakıp <b>armut</b> yazın:</p>`,
      target: 'elma armut',
      combo: ['Space'],
      on: (ev, c) => ev.type === 'input' && /elma\s+armut/.test(norm(c.np.value)),
      done: 'Kelimeler arasına bir boşluk yeter.',
    },
    {
      title: 'Enter: alt satır',
      html: `<p>${K('Enter ↵')} tuşuna basın ve alt satıra <b>kiraz</b> yazın.</p>`,
      combo: ['Enter'],
      on: (ev, c) => ev.type === 'input' && lines(c.np.value).slice(1).some((l) => norm(l).includes('kiraz')),
      done: 'Enter her basışta yeni bir satır açar.',
    },
    {
      title: 'Backspace: soldaki harfi sil',
      html: `<p>İmleç “kiraz” kelimesinin sonundayken ${K('⌫ Backspace')} tuşuna <b>bir kez</b> basın. Son harf silinir ve <b>kira</b> kalır.</p>`,
      combo: ['Backspace'],
      on: (ev, c) => ev.type === 'input' && ev.inputType === 'deleteContentBackward' && lines(c.np.value).some((l) => norm(l).endsWith('kira')),
      done: 'Backspace, imlecin <b>solundaki</b> harfi siler.',
    },
    {
      title: 'Delete: sağdaki harfi sil',
      html: `<p>Şimdi imleci <b>kira</b> kelimesinin <b>en başına</b>, k harfinin önüne getirin (fareyle tıklayarak ya da ${K('←')} okuyla).</p><p>Sonra ${K('Delete')} tuşuna bir kez basın: sağdaki <b>k</b> silinir, <b>ira</b> kalır.</p>`,
      combo: ['Delete'],
      hint: 'Delete tuşu genellikle Backspace\'in sağında ya da aşağısındadır. Üzerinde “Del” de yazabilir. Dizüstü bilgisayarlarda klavyenin sağ üst köşesinde olur.',
      on: (ev, c) => ev.type === 'input' && ev.inputType === 'deleteContentForward',
      done: 'Delete, imlecin <b>sağındaki</b> harfi siler. Kısaca: Backspace geriye, Delete ileriye siler.',
    },
    {
      title: 'Büyük harf: Shift',
      html: `<p>Tek bir büyük harf için ${K('⇧ Shift')} tuşunu <b>basılı tutun</b> ve harfe basın.</p><p>Yeni bir satıra (${K('Enter')}) <b>Ali</b> yazın: A büyük, l ve i küçük.</p>`,
      combo: ['Shift', 'KeyA'],
      on: (ev, c) => ev.type === 'input' && lines(c.np.value).some((l) => /(^|\s)Ali(\s|$)/.test(l)),
      done: 'Shift\'i bırakınca harfler yine küçük yazılır.',
    },
    {
      title: 'Caps Lock: hepsi büyük',
      html: `<p>${K('Caps Lock')} tuşuna <b>bir kez</b> basın (basılı tutmayın). Çoğu klavyede küçük bir ışık yanar.</p>
        <p>Yeni satıra <b>ANKARA</b> yazın. Sonra Caps Lock'a bir kez daha basıp kapatın ve yanına küçük harfle <b>ankara</b> yazın.</p>`,
      target: 'ANKARA ankara',
      combo: ['CapsLock'],
      on: (ev, c) => {
        if (ev.type === 'key' && ev.e.getModifierState) {
          const caps = ev.e.getModifierState('CapsLock');
          if (caps !== c.s.caps) { c.s.caps = caps; c.note(`Caps Lock şu an: <b>${caps ? 'AÇIK' : 'KAPALI'}</b>`); }
        }
        if (ev.type !== 'input') return false;
        const v = c.np.value;
        const i = v.indexOf('ANKARA');
        return i >= 0 && /ankara/.test(v.slice(i + 6));
      },
      done: 'Caps Lock açık kalırsa her şey büyük harf yazılır. Şifre yazarken buna dikkat edin!',
    },
    {
      title: 'Türkçe harfler',
      html: `<p>Türkçe harfler klavyenin sağ tarafındadır. Yeni satıra şu kelimeleri yazın:</p>`,
      target: 'çiçek ağaç ışık göz şeker üzüm',
      keys: ['Period', 'BracketLeft', 'KeyI', 'Comma', 'Semicolon', 'BracketRight', 'Quote'],
      hint: '<b>I</b> tuşu noktasız <b>ı</b> yazar. Noktalı <b>i</b> ise Ş\'nin yanındaki <b>İ</b> tuşudur.',
      on: (ev, c) => ev.type === 'input' && ['çiçek', 'ağaç', 'ışık', 'göz', 'şeker', 'üzüm'].every((w) => c.np.value.toLocaleLowerCase('tr').includes(w)),
      done: 'Ç, Ğ, I, Ö, Ş, Ü ve İ tuşlarını buldunuz.',
    },
    {
      title: 'İ ile I farkı',
      html: '<p>Büyük harfle şu iki şehri yazın (Caps Lock ya da Shift ile):</p>',
      target: 'İZMİR IĞDIR',
      keys: ['Quote', 'KeyI', 'CapsLock'],
      hint: 'İZMİR\'deki <b>İ</b> noktalıdır (Ş\'nin yanındaki tuş). IĞDIR\'daki <b>I</b> noktasızdır (O\'nun solundaki tuş).',
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('İZMİR') && c.np.value.includes('IĞDIR'),
      done: 'Türkçede İ ve I ayrı harflerdir; klavyede de ayrı tuşlardır.',
    },
    {
      title: 'İşaretler: Shift ile',
      html: `<p>Bazı tuşların üzerinde iki işaret vardır. <b>Üstteki</b> işaret için Shift'e basılı tutulur.</p>
        <ul class="big-list"><li>${K('Shift', '1')} → <b>!</b></li><li>${K('Shift', '*')} → <b>?</b> (sağ üstte, 0'ın yanında)</li></ul><p>Yeni satıra yazın:</p>`,
      target: 'Nasılsın? Harika!',
      keys: ['Shift', 'Digit1', 'Minus'],
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('?') && c.np.value.includes('!'),
      done: 'Soru ve ünlem işaretlerini yazabiliyorsunuz.',
    },
    {
      title: '@ işareti: AltGr',
      html: `<p>E-posta adreslerindeki <b>@</b> (et) işareti için: <b>AltGr</b> tuşunu (boşluğun sağındaki) basılı tutup <b>Q</b>'ya basın.</p><p>Yeni satıra yazın:</p>`,
      target: 'ali@ornek.com',
      combo: ['AltRight', 'KeyQ'],
      hint: 'AltGr yoksa Ctrl ve Alt\'ı birlikte basılı tutup Q\'ya basmak da @ yazar.',
      on: (ev, c) => ev.type === 'input' && c.np.value.toLocaleLowerCase('tr').includes('ali@ornek.com'),
      done: 'Artık e-posta adresi yazabilirsiniz.',
    },
    {
      title: 'Ok tuşları',
      html: `<p>Ok tuşları imleci harf harf, satır satır hareket ettirir. Dördüne de basın: ${K('↑')} ${K('↓')} ${K('←')} ${K('→')}</p>`,
      keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
      on: (ev, c) => {
        if (ev.type !== 'key' || !ev.e.key.startsWith('Arrow')) return false;
        (c.s.a ||= new Set()).add(ev.e.key);
        c.note(`Basılan oklar: ${[...c.s.a].map((k) => ({ ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' })[k]).join(' ')}`);
        return c.s.a.size === 4;
      },
      done: 'Fareye gerek kalmadan imleci istediğiniz yere götürebilirsiniz.',
    },
    {
      title: 'Home ve End',
      html: `<p>${K('Home')}: imleç satırın <b>başına</b> gider. ${K('End')}: satırın <b>sonuna</b> gider. İkisine de basın.</p>
        <p class="mut">Dizüstü bilgisayarlarda Home ve End çoğu zaman ok tuşlarının üzerinde küçük yazar; ${K('Fn')} tuşunu basılı tutup basılır (ör. ${K('Fn', '←')}). Hiç bulamazsanız alttaki düğmeye basın.</p>`,
      keys: ['Home', 'End'],
      manual: '✔ Klavyemde Home/End yok',
      hint: 'Fn tuşu genellikle en alt sırada, Ctrl\'nin yanındadır. Fn\'yi basılı tutup ← (Home) ya da → (End) okuna basmayı deneyin.',
      on: (ev, c) => {
        if (ev.type !== 'key') return false;
        if (ev.e.key === 'Home') c.s.h = true;
        if (ev.e.key === 'End') c.s.e = true;
        return !!(c.s.h && c.s.e);
      },
      done: 'Uzun bir satırda bu iki tuş çok zaman kazandırır.',
    },
    {
      title: 'Tab ve Esc',
      html: `<p>İki tuş daha: ${K('Tab')} (Q'nun solunda) ve ${K('Esc')} (sol üst köşede).</p>
        <ul class="big-list"><li>${K('Tab')}: formlarda <b>bir sonraki kutuya</b> geçirir. Yazıda biraz ileri boşluk bırakır.</li><li>${K('Esc')}: <b>vazgeç</b> demektir. Açılan menüyü ya da pencereyi kapatır.</li></ul>
        <p>Not Defteri açıkken önce ${K('Esc')}, sonra ${K('Tab')} tuşuna basın.</p>`,
      keys: ['Escape', 'Tab'],
      on: (ev, c) => {
        if (ev.type !== 'key') return false;
        if (ev.e.key === 'Tab') c.s.t = true;
        if (ev.e.key === 'Escape') c.s.esc = true;
        return !!(c.s.t && c.s.esc);
      },
      done: 'Bir de ⊞ <b>Windows</b> tuşu var (Ctrl ile Alt arasında, pencere resimli). Başlat menüsünü açar; 5. haftada kullanacağız.',
    },
    kursFormu,
    {
      title: 'Alt sıradaki tuşlar',
      html: `<p>Klavyenin en alt sırasında, boşluk çubuğunun solunda sırayla şunlar var: ${K('Ctrl')}, <b>⊞ Windows</b> (pencere işareti), ${K('Alt')}. Dizüstünde Ctrl'nin yanında bir de ${K('Fn')} olur. Boşluğun sağında ${K('AltGr')} vardır.</p>
        <ul class="big-list"><li>${K('Ctrl')}: başka bir tuşla <b>birlikte</b> basılır (kopyala, kaydet gibi). Tek başına bir şey yapmaz.</li><li><b>⊞ Windows</b>: bir kez basın, Başlat menüsü açılır. Bir daha basın, kapanır.</li><li>${K('Alt')}: menü ve pencere kısayollarında kullanılır.</li></ul>
        <p>Ctrl ve Shift'in solda da sağda da birer tane olduğunu fark edin; ikisi de aynı işi yapar.</p>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Klavyenin önemli tuşlarını öğrendiniz:</p>' },
  ],
};

