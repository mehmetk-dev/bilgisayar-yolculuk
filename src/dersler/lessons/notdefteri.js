// 3. hafta: metin seçme, kısayollar, Not Defteri'nde kaydetme ve açma
import { K, norm, closeEnough } from './common.js';

const caretAtEnd = (np) => {
  const { start, end } = np.sel();
  return start === end && np.value.slice(end).trim() === '';
};

const SENTENCE = 'Bugün bilgisayar öğreniyorum.';

export const notdefteri = {
  id: 'notdefteri',
  icon: '📝',
  title: 'Not Defteri ve kısayollar',
  desc: 'Seçme, Ctrl+A/C/V/X/Z/Y, sağ tık menüsü, kaydetme (Ctrl+S) ve kaydettiğini yeniden açma (Ctrl+O).',
  minutes: 25,
  stage: 'notepad',
  summary: [
    ['Enter', 'Alt satıra geç'],
    ['⌫ Backspace', 'İmlecin solundaki harfi sil'],
    ['Çift tıklama', 'Bir kelimeyi seç'],
    ['Ctrl + A', 'Hepsini seç'],
    ['Ctrl + C', 'Kopyala (yazı yerinde kalır)'],
    ['Ctrl + X', 'Kes (yazı yerinden alınır)'],
    ['Ctrl + V', 'Yapıştır'],
    ['Ctrl + Z', 'Geri al'],
    ['Ctrl + Y', 'Yinele (geri aldığını geri getir)'],
    ['Ctrl + S', 'Kaydet'],
    ['Ctrl + O', 'Aç (kaydettiğiniz dosyayı)'],
    ['Dosya → Yeni', 'Boş bir sayfa'],
    ['Sağ tık', 'Kes, Kopyala, Yapıştır menüsü'],
  ],
  steps: [
    {
      title: 'Not Defteri nedir?',
      html: `<p>Not Defteri, bilgisayardaki <b>en basit yazı programıdır</b>. Alışveriş listesi, telefon numarası ya da kısa notlar yazmak için kullanılır.</p>
        <p>Yandaki pencere gerçek Not Defteri'nin bir benzeridir. Burada gönül rahatlığıyla deneme yapabilirsiniz: <b>hiçbir şey bozulmaz.</b></p>
        <div class="box"><b>Gerçek bilgisayarda nasıl açılır?</b><ol>
          <li>Klavyedeki ${K('⊞ Windows')} tuşuna basın.</li>
          <li><b>not defteri</b> yazın.</li>
          <li>${K('Enter')} tuşuna basın.</li></ol></div>`,
      keys: ['Meta'],
    },
    {
      title: 'Adınızı yazın',
      html: `<p>Yandaki beyaz alana <b>bir kez tıklayın</b>. Yanıp sönen ince bir çizgi görünecek. Bu çizgiye <b>imleç</b> denir; yazdığınız harfler oraya gelir.</p>
        <p>Şimdi <b>adınızı ve soyadınızı</b> yazın. Bitince ${K('Enter')} tuşuna basın.</p>`,
      combo: ['Enter'],
      keys: ['Shift', 'Space'],
      hint: `Büyük harf için ${K('⇧ Shift')} tuşunu basılı tutup harfe basın. İki kelime arasına boşluk koymak için en alttaki uzun <kbd>Boşluk</kbd> tuşunu kullanın.`,
      on: (ev, c) => ev.type === 'input' && c.np.value.includes('\n') && c.np.value.split('\n')[0].trim().length >= 2,
      done: `Çok güzel! ${K('Enter')} tuşu sizi bir alt satıra geçirdi.`,
    },
    {
      title: 'Bir cümle yazın',
      html: '<p>Şimdi ikinci satıra şu cümleyi yazın:</p>',
      target: SENTENCE,
      keys: ['BracketLeft', 'Comma', 'Slash'],
      hint: `<b>Ğ</b> ve <b>Ö</b> harfleri klavyenin sağ tarafındadır; aşağıdaki klavyede sarı yanıyorlar. Nokta (.) için sağ alttaki <kbd>.</kbd> tuşunu kullanın.`,
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        const lines = c.np.value.split('\n').slice(1);
        return lines.some((l) => closeEnough(l, SENTENCE) && (norm(l).length >= norm(SENTENCE).length || ev.inputType === 'insertLineBreak'));
      },
      done: 'Mükemmel! Küçük yazım hatalarını dert etmeyin; şimdi nasıl düzelteceğimizi öğreneceğiz.',
    },
    {
      title: 'Silmek: Backspace',
      html: `<p>Yanlış bir harf yazdığınızda ${K('⌫ Backspace')} tuşu ile silebilirsiniz. Bu tuş <b>imlecin solundaki</b> harfi siler.</p>
        <p>Deneyin: cümlenin sonundaki <b>noktayı silin</b>, sonra <b>tekrar yazın</b>.</p>`,
      combo: ['Backspace'],
      keys: ['Slash'],
      hint: 'Backspace, klavyenin sağ üst tarafındaki uzun tuştur. Üzerinde ← işareti ya da “Backspace” yazar. İmleç cümlenin sonunda değilse önce oraya tıklayın.',
      on: (ev, c) => {
        if (ev.type !== 'input') return false;
        if (ev.inputType.startsWith('delete')) { c.s.deleted = true; c.note(`Sildiniz. Şimdi noktayı (<kbd>.</kbd>) tekrar yazın.`); return false; }
        return !!c.s.deleted && ev.inputType === 'insertText';
      },
      done: `Sildiniz ve yeniden yazdınız. Bir de <kbd>Delete</kbd> tuşu vardır: o da siler ama imlecin <b>sağındaki</b> harfi.`,
    },
    {
      title: 'Bir kelimeyi seçmek',
      html: `<p>Bir yazıyla bir şey yapmadan önce (kopyalamak, silmek…) onu <b>seçmemiz</b> gerekir.</p>
        <p>Fareyle <b>bilgisayar</b> kelimesinin üzerine gelin ve farenin sol tuşuna <b>hızlıca iki kez</b> tıklayın.</p>
        <p>Kelimenin arkası maviye boyanırsa seçilmiş demektir.</p>`,
      mouse: '🖱 Sol tuşa iki kez tıklayın',
      hint: 'İki tıklama arasında beklemeyin: “tık-tık”. Olmazsa farenin sol tuşunu basılı tutup kelimenin üzerinden sürükleyerek de seçebilirsiniz.',
      on: (ev, c) => ev.type === 'select' && ev.text.trim().length >= 2 && ev.text.length < c.np.value.length,
      done: 'Seçili yazı mavi görünür. Bundan sonra yaptığınız işlem bu seçili yazıya uygulanır. Boş bir yere tıklarsanız seçim kalkar.',
    },
    {
      title: 'Hepsini seçmek: Ctrl + A',
      html: `<p>Bütün yazıyı bir seferde seçmek için:</p>
        <ol class="steps"><li>Sol alttaki ${K('Ctrl')} tuşunu <b>basılı tutun</b>,</li>
        <li>parmağınızı kaldırmadan ${K('A')} tuşuna <b>bir kez</b> basın,</li>
        <li>iki tuşu da bırakın.</li></ol>
        <p class="mut">A harfi İngilizce “All” yani “hepsi” kelimesinden gelir.</p>`,
      combo: ['Ctrl', 'KeyA'],
      hint: 'Ctrl tuşu klavyenin en alt sırasında, en soldadır. Önce Ctrl, sonra A. Ctrl\'yi bırakmadan A\'ya basmanız önemli.',
      on: (ev, c) => ev.type === 'select' && ev.start === 0 && ev.end === c.np.value.length && ev.end > 0,
      done: `Bütün yazı mavi oldu, yani hepsi seçili. <b>Dikkat:</b> şimdi bir harfe basarsanız seçili yazının yerine o harf yazılır. Öyle olursa ${K('Ctrl', 'Z')} ile geri getirebilirsiniz.`,
    },
    {
      title: 'Kopyalamak: Ctrl + C',
      html: `<p>Yazı seçiliyken ${K('Ctrl')} tuşunu basılı tutup ${K('C')} tuşuna basın.</p>
        <p>Ekranda bir şey değişmez; ama yazının bir kopyası bilgisayarın hafızasına alınır. Bu hafızaya <b>Pano</b> denir. Aşağıdaki <b>📋 Pano</b> kutusuna bakın.</p>
        <p class="mut">C harfi İngilizce “Copy” yani “kopyala” kelimesinden gelir.</p>`,
      combo: ['Ctrl', 'KeyC'],
      hint: `Yazı mavi (seçili) değilse önce ${K('Ctrl', 'A')} ile hepsini seçin, sonra ${K('Ctrl', 'C')}.`,
      on: (ev) => ev.type === 'copy' && ev.text.length > 0,
      done: 'Kopyalandı! Pano kutusunda yazınızı görebilirsiniz. Şimdi bu kopyayı başka bir yere koyacağız.',
    },
    {
      title: 'Yazının sonuna gitmek',
      html: `<p>Kopyayı yazının altına koyacağız. Bunun için imleci en sona götürmeliyiz:</p>
        <ol class="steps"><li>Yazının <b>en sonuna</b>, son kelimeden sonraki boşluğa fareyle tıklayın. Mavi seçim kalkar.</li>
        <li>Sonra ${K('Enter')} tuşuna basarak yeni bir satır açın.</li></ol>`,
      mouse: '🖱 Yazının sonuna tıklayın',
      combo: ['Enter'],
      hint: `Klavyeyle de olur: ${K('Ctrl', 'End')} imleci yazının en sonuna götürür.`,
      on: (ev, c) => {
        if (ev.type === 'select' && caretAtEnd(c.np)) c.note(`İmleç en sonda. Şimdi ${K('Enter')} tuşuna basın.`);
        return ev.type === 'input' && ev.inputType === 'insertLineBreak' && caretAtEnd(c.np) && c.np.value.trim().length > 0;
      },
      done: 'İmleç yeni satırda bekliyor.',
    },
    {
      title: 'Yapıştırmak: Ctrl + V',
      html: `<p>Şimdi Pano'daki yazıyı buraya koyalım: ${K('Ctrl')} tuşunu basılı tutup ${K('V')} tuşuna basın.</p>
        <p class="mut">C ile V klavyede yan yanadır; bu yüzden ikisi hep birlikte kullanılır.</p>`,
      combo: ['Ctrl', 'KeyV'],
      hint: 'V tuşu, C tuşunun hemen sağındadır.',
      on: (ev) => ev.type === 'input' && ev.inputType === 'insertFromPaste',
      done: `Yazınız ikinci kez geldi! Pano'daki yazı, siz yeni bir şey kopyalayana kadar orada kalır. İsterseniz bir kez daha ${K('Ctrl', 'V')} yapıp deneyin.`,
    },
    {
      title: 'Geri almak: Ctrl + Z',
      html: `<p>Bir şeyi yanlışlıkla sildiniz ya da yanlış yere yapıştırdınız mı? Telaşa gerek yok.</p>
        <p>${K('Ctrl')} tuşunu basılı tutup ${K('Z')} tuşuna basın: <b>son yaptığınız iş geri alınır.</b></p>
        <p>Deneyin: yapıştırdığınız yazı kaybolacak.</p>`,
      combo: ['Ctrl', 'KeyZ'],
      hint: 'Z tuşu, en alt harf sırasının en solundadır (Ctrl\'ye yakın).',
      on: (ev) => ev.type === 'undo',
      done: `Geri alındı. ${K('Ctrl', 'Z')}'ye birkaç kez basarsanız daha da geriye gidersiniz. Bilgisayardaki “can simidi” budur!`,
    },
    {
      title: 'Geri getirmek: Ctrl + Y',
      html: `<p>Geri aldığınız şeyi yine istiyorsanız: ${K('Ctrl', 'Y')}.</p>
        <p>Deneyin: kaybolan yazı geri gelecek.</p>`,
      combo: ['Ctrl', 'KeyY'],
      on: (ev) => ev.type === 'redo',
      done: `Yazı geri geldi. Kısacası: ${K('Ctrl', 'Z')} geri al, ${K('Ctrl', 'Y')} yinele.`,
    },
    {
      title: 'Taşımak (1): Kesmek',
      html: `<p>Kopyalamada yazı yerinde kalır. Ama bazen bir yazıyı <b>başka bir yere taşımak</b> isteriz. Bunun için <b>kesme</b> kullanılır.</p>
        <ol class="steps"><li>İlk satırdaki <b>adınızın</b> üzerine çift tıklayarak seçin.</li>
        <li>${K('Ctrl', 'X')} tuşlarına basın.</li></ol>
        <p>Adınız kaybolacak ama merak etmeyin: Pano'ya gitti.</p>`,
      combo: ['Ctrl', 'KeyX'],
      mouse: '🖱 Önce çift tıklayıp seçin',
      hint: 'X tuşu, Z ile C\'nin arasındadır. Kesmek için yazının önce seçili (mavi) olması gerekir.',
      on: (ev) => ev.type === 'cut' && ev.text.trim().length > 0,
      done: 'Kesildi! Yazı yerinden alındı ve Pano\'ya kondu. Pano kutusuna bakın.',
    },
    {
      title: 'Taşımak (2): Yapıştırmak',
      html: `<p>Şimdi kestiğiniz yazıyı yeni yerine koyalım:</p>
        <ol class="steps"><li>Yazının <b>en sonuna</b> tıklayın.</li>
        <li>${K('Ctrl', 'V')} tuşlarına basın.</li></ol>
        <p class="mut">Yapıştırmadan önce bir <kbd>Boşluk</kbd> bırakırsanız kelimeler bitişik olmaz.</p>`,
      combo: ['Ctrl', 'KeyV'],
      on: (ev) => ev.type === 'input' && ev.inputType === 'insertFromPaste',
      done: '<b>Taşıdınız!</b><br><b>Kopyala</b>: yazı yerinde kalır, bir kopyası gider.<br><b>Kes</b>: yazı yerinden alınıp götürülür.',
    },
    {
      title: 'Kısayolu unutursanız: Sağ tık',
      html: `<p>Kısayolları unutursanız fare de aynı işi yapar:</p>
        <ol class="steps"><li>Bir kelimeyi çift tıklayarak seçin.</li>
        <li>Seçili yazının üzerine farenin <b>sağ tuşuyla</b> bir kez tıklayın.</li>
        <li>Açılan menüden <b>Kopyala</b>'yı seçin.</li></ol>`,
      mouse: '🖱 Sağ tuşa bir kez tıklayın',
      hint: 'Farenin iki tuşu vardır. Şimdiye kadar hep soldakini kullandık; bu sefer sağdakine basın. Açılan küçük listede “Kopyala” yazısına sol tuşla tıklayın.',
      on: (ev, c) => {
        if (ev.type === 'contextmenu') c.s.menu = true;
        if (ev.type === 'key' && (ev.e.ctrlKey || ev.e.metaKey) && ev.e.code === 'KeyC') c.s.keyboard = true;
        if (ev.type !== 'copy' || !ev.text) return false;
        if (c.s.menu && !c.s.keyboard) return true;
        c.s.keyboard = false;
        c.warn('Bu sefer klavyeyi değil, farenin <b>sağ tuşunu</b> deneyin; açılan menüden “Kopyala”yı seçin.');
        return false;
      },
      done: 'Sağ tık menüsünde <b>Kes</b>, <b>Kopyala</b>, <b>Yapıştır</b> hep vardır. Klavye kısayolları ise daha hızlıdır.',
    },
    {
      title: 'Kaydetmek: Ctrl + S',
      html: `<p>Yazdıklarınızın kaybolmaması için <b>kaydetmeniz</b> gerekir. Pencerenin en üstüne bakın: <b>*Adsız</b> yazıyor. Baştaki yıldız (*), <b>kaydedilmemiş değişiklik</b> olduğunu gösterir.</p>
        <ol class="steps"><li>${K('Ctrl', 'S')} tuşlarına basın.</li>
        <li>Açılan pencerede <b>Dosya adı</b> kutusuna bir ad yazın (örneğin: <i>ilk yazım</i>).</li>
        <li><b>Kaydet</b> düğmesine tıklayın.</li></ol>`,
      combo: ['Ctrl', 'KeyS'],
      hint: 'Kısayol yerine pencerenin üstündeki <b>Dosya</b> menüsünden <b>Kaydet</b>\'i de seçebilirsiniz.',
      on: (ev, c) => {
        if (ev.type === 'dialog' && ev.open) c.note('Şimdi <b>Dosya adı</b> kutusuna bir ad yazıp <b>Kaydet</b>\'e tıklayın.');
        if (ev.type === 'save') { c.L.saved = ev.name; c.L.folder = ev.label || ev.folder; return true; }
        return false;
      },
      done: (c) => `Kaydedildi! Başlıkta artık <b>${c.L.saved.replace(/\.txt$/i, '')}</b> yazıyor ve yıldız kayboldu. Dosyanız <b>${c.L.folder}</b> klasöründe duruyor.`,
    },
    {
      title: 'Yeni bir sayfa',
      html: `<p>Şimdi boş bir sayfa açalım. Not Defteri penceresinin üstündeki <b>Dosya</b> menüsüne tıklayın, sonra <b>Yeni</b>'yi seçin.</p>
        <p class="mut">Gerçek Not Defteri'nde ${K('Ctrl', 'N')} de aynı işi yapar. Bu sayfada Ctrl+N tarayıcıda yeni pencere açabileceği için menüyü kullanıyoruz.</p>`,
      mouse: '🖱 Dosya → Yeni',
      on: (ev, c) => {
        if (ev.type === 'ask') c.note(ev.answer === 'discard' ? 'Kaydetmeden devam ettiniz.' : 'Tamam.');
        return ev.type === 'new';
      },
      done: 'Boş bir sayfa açıldı. Kaydettiğiniz yazı kaybolmadı; dosyada duruyor.',
    },
    {
      title: 'Bir şey yazın',
      html: '<p>Yeni sayfaya <b>deneme</b> yazın.</p>',
      on: (ev, c) => ev.type === 'input' && norm(c.np.value).includes('deneme'),
    },
    {
      title: 'Kaydettiğinizi açın: Ctrl + O',
      html: (c) => `<ol class="steps"><li>${K('Ctrl', 'O')} tuşlarına basın (ya da Dosya → Aç…).</li>
        <li>Not Defteri, “deneme” yazısını kaydetmek isteyip istemediğinizi soracak: <b>Kaydetme</b> deyin.</li>
        <li>Açılan pencerede <b>${(c.L.saved || 'kaydettiğiniz dosya').replace(/\.txt$/i, '')}</b> dosyasına tıklayıp <b>Aç</b>'a basın.</li></ol>`,
      combo: ['Ctrl', 'KeyO'],
      on: (ev, c) => {
        if (ev.type === 'ask' && ev.answer === 'discard') c.note('Şimdi listeden dosyanızı seçip <b>Aç</b>\'a tıklayın.');
        if (ev.type === 'ask' && ev.answer === 'cancel') c.note('İptal ettiniz. Yeniden Ctrl + O\'ya basın ve bu sefer <b>Kaydetme</b>\'yi seçin.');
        return ev.type === 'open';
      },
      done: 'Kaydettiğiniz yazı geri geldi! Kaydedilen dosyalar, bilgisayarı kapatsanız da kaybolmaz.',
    },
    {
      final: true,
      title: 'Tebrikler! 🎉',
      html: '<p>Bu dersi bitirdiniz. Öğrendikleriniz:</p>',
    },
  ],
};
