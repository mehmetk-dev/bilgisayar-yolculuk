// 10. hafta ek dersi: belgeyi yazıp PDF yapmak ve e-postayla göndermek (muhtarlık, okul, işyeri)
import { K, desktopReady, maxed, norm } from './common.js';

const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], text: '', tables: 0, images: 0, layout: {}, pages: 1, table: null };
const wordOpen = (c) => maxed(c, 'word');
const mailOpen = (c) => maxed(c, 'mail');
const formatEvents = ['doc-format', 'doc-input', 'doc-shortcut', 'doc-insert', 'doc-cell', 'doc-layout', 'doc-table'];
const when = (test) => (ev, c) => formatEvents.includes(ev.type) && !!test(c);
const isPdf = (n) => /\.pdf$/i.test(n || '');
const isDocx = (n) => /\.docx$/i.test(n || '');

export const belgeGonder = {
  id: 'belge-gonder', icon: '📨', title: 'Belgeyi PDF yapıp e-postayla gönderin', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Kısa bir dilekçe yazın, PDF yapın, e-postaya ekleyip gönderin; Gönderilenler\'den kontrol edin.',
  summary: [
    ['Ctrl + S', 'Word belgesini kaydeder (Belgeler klasörü)'],
    ['Dosya → PDF olarak kaydet', 'PDF kopyası çıkarır. Gerçek Word\'de: Dosya → Farklı Kaydet → Kayıt türü: PDF'],
    ['PDF', 'Karşı taraf değiştiremez; her telefonda ve bilgisayarda aynı görünür'],
    ['✏ Yeni posta', 'Boş bir posta açar: Kime, Konu, mesaj'],
    ['📎 Dosya ekle', 'Belgeler klasöründen PDF\'i seçin (.pdf ile biten)'],
    ['➤ Gönder', 'Postayı yollar; kopyası 📤 Gönderilenler\'de kalır'],
    ['Gönderilenler', 'Postanın gittiğinden ve ekin yanında olduğundan emin olun'],
  ],
  steps: [
    {
      title: 'Belge gönderme parkuru',
      html: `<p>Muhtarlığa, okula ya da işyerine bir <b>dilekçe</b> göndermeniz gerekebilir. Artık kâğıda yazıp elden vermek şart değil; e-postayla da gider.</p>
        <p>Bu parkurda sırayla şunları yapacaksınız:</p>
        <ul class="big-list"><li>Kısa bir belge yazıp <b>kaydetmek</b></li><li>Belgeyi <b>PDF</b> yapmak</li><li>E-postaya <b>eklemek</b> ve <b>göndermek</b></li><li>Gittiğini <b>kontrol etmek</b></li></ul>
        <p><b>Neden PDF?</b> Word dosyasını alan kişi içini değiştirebilir. Ayrıca telefonunda Word yoksa yazı kayabilir. PDF ise <b>değiştirilemez</b> ve her cihazda <b>aynı görünür</b>.</p>
        <p class="mut">Nasıl yapılacağı yazmıyor; takılırsanız 💡 İpucu. Adresler uydurmadır; hiçbir şey gerçekten gönderilmez.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Kelime İşlemci\'yi açın',
      html: '<p><b>Kelime İşlemci</b> programını açın.</p>',
      hint: 'Başlat menüsüne tıklayın, listeden Kelime İşlemci\'yi seçin.',
      check: (c) => !!c.d.find('word'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'word',
    },
    {
      title: '2. Kısa bir dilekçe yazın',
      html: `<p>Boş sayfaya muhtarlığa <b>2–3 satırlık</b> bir istek yazın. Örnek:</p>
        <p class="mut">ÇINAR MAHALLESİ MUHTARLIĞINA<br>Sokağımızdaki lamba bir aydır yanmıyor. Değiştirilmesini rica ederim.<br>Gereğini saygılarımla arz ederim.</p>
        <p>Kendi sözlerinizle de yazabilirsiniz. İlk satırda <b>muhtarlığına</b> kelimesi geçsin.</p>`,
      hint: `Büyük harf için Shift ya da Caps Lock. İ, Ş, Ğ harflerine dikkat. Satır sonunda ${K('Enter')} yeni satıra geçer.`,
      setup: wordOpen,
      on: when((c) => { const t = info(c); return t.blocks.filter((b) => b.text.trim()).length >= 2 && t.text.trim().length >= 50 && norm(t.text).includes('muhtar'); }),
    },
    {
      title: '3. Belgeler\'e kaydedin',
      html: '<p>Belgeyi <b>muhtarlık dilekçesi</b> adıyla <b>Belgeler</b> klasörüne kaydedin.</p>',
      hint: `${K('Ctrl', 'S')}. Açılan pencerede soldan Belgeler\'in seçili olduğuna bakın, “Dosya adı” kutusuna adı yazıp Kaydet\'e basın.`,
      on: (ev, c) => {
        if (ev.type !== 'doc-save') return false;
        if (ev.folder !== 'docs') { c.warn('Belge Belgeler klasörüne kaydedilmedi. Ctrl + S\'e basıp pencerenin solundan <b>Belgeler</b>\'e tıklayın, yeniden kaydedin.'); return false; }
        return true;
      },
      done: 'Word belgeniz <b>.docx</b> uzantısıyla Belgeler\'de duruyor. Bu, düzenleyebileceğiniz asıl dosyanızdır; saklayın.',
    },
    {
      title: '4. PDF olarak kaydedin',
      html: `<p>Aynı belgeyi şimdi <b>PDF</b> olarak da kaydedin. Kaydedilen yeri <b>Belgeler</b> olarak bırakın.</p>
        <p class="mut">Gerçek Word\'de yol: <b>Dosya → Farklı Kaydet → Kayıt türü: PDF</b>. Bu bilgisayardaki programda ise <b>Dosya → PDF olarak kaydet</b> yazıyor.</p>`,
      hint: 'Üstte Dosya\'ya tıklayın, listeden “📕 PDF olarak kaydet…”i seçin. Ad kutusunda .pdf ile biten bir ad olacak; Kaydet\'e basın.',
      on: (ev, c) => {
        if (ev.type !== 'doc-pdf') return false;
        if (ev.folder !== 'docs') { c.warn('PDF Belgeler klasörüne kaydedilmedi; e-postada bulması zor olur. Yeniden deneyin ve Belgeler\'i seçin.'); return false; }
        return true;
      },
      done: 'Belgeler klasöründe artık iki dosya var: <b>.docx</b> (sizin düzenleyeceğiniz) ve <b>.pdf</b> (göndereceğiniz).',
    },
    {
      title: '5. E-postayı açın',
      html: '<p><b>E-posta</b> programını açın.</p>',
      hint: 'Başlat menüsünden E-posta\'ya tıklayın.',
      check: (c) => !!c.d.find('mail'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'mail',
    },
    {
      title: '6. Yeni posta açın',
      html: '<p>Boş bir posta yazma ekranı açın.</p>',
      hint: 'Soldaki ✏ Yeni posta düğmesine tıklayın.',
      setup: mailOpen,
      on: (ev) => ev.type === 'mail-compose',
    },
    {
      title: '7. Kime, konu ve mesaj',
      html: `<ol class="steps"><li><b>Kime</b>: <b>muhtarlik@ornek.com</b></li><li><b>Konu</b>: <b>Sokak lambası dilekçesi</b></li><li>Büyük beyaz alana kısa bir mesaj: <b>Ekte dilekçem var. Bilgilerinize sunarım.</b></li></ol>
        <p>Üçünü de yazdıktan sonra aşağıdaki düğmeye basın.</p>`,
      hint: `@ işareti için ${K('AltGr', 'Q')}. Adreste Türkçe harf ve boşluk olmaz: muhtarlik@ornek.com. Kutudan kutuya geçmek için ${K('Tab')} ya da fareyle tıklayın.`,
      manual: 'Yazdım ✔',
    },
    {
      title: '8. PDF dosyasını ekleyin',
      html: `<p><b>📎 Dosya ekle</b>\'ye tıklayın. Açılan pencere <b>Resimler</b> klasöründen başlar; soldan <b>Belgeler</b>\'e geçin ve <b>.pdf</b> ile biten dosyayı seçin.</p>
        <p class="mut">Aynı adlı iki dosya göreceksiniz: biri <b>.docx</b>, biri <b>.pdf</b>. Siz <b>.pdf</b> olanı ekleyin.</p>`,
      hint: 'Seçmek için dosyaya bir kez tıklayın, sonra Aç\'a basın (ya da çift tıklayın). Yanlışı eklediyseniz, eklenen dosyanın yanındaki ✕ ile çıkarıp yenisini ekleyin.',
      on: (ev, c) => {
        if (ev.type !== 'mail-attach') return false;
        if (isDocx(ev.name)) { c.warn(`Word dosyasını (<b>${ev.name}</b>) eklediniz. PDF olanı ekleyin: eklenen dosyanın yanındaki ✕ ile bunu çıkarın, sonra 📎 Dosya ekle ile <b>.pdf</b> ile biten dosyayı seçin.`); return false; }
        if (!isPdf(ev.name)) { c.warn(`<b>${ev.name}</b> bir PDF değil. Belgeler klasöründeki <b>.pdf</b> ile biten dosyayı ekleyin.`); return false; }
        return true;
      },
      done: 'PDF postaya eklendi; dosya adı mesajın altında görünüyor.',
    },
    {
      title: '9. Gönderin',
      html: '<p>Her şey tamamsa <b>➤ Gönder</b>\'e tıklayın.</p>',
      hint: 'Göndermeden önce Kime ve Konu kutularına son bir kez bakın. Konu kutusu boşsa program “Konu yok” diye sorar; “Geri dön, konu yazayım”ı seçip konuyu yazın ve yeniden gönderin.',
      on: (ev, c) => {
        if (ev.type !== 'mail-send') return false;
        if (!ev.attachments.some(isPdf)) { c.warn('Posta gitti ama içinde PDF yok. Yeni posta açın, 📎 Dosya ekle ile Belgeler\'deki <b>.pdf</b> dosyayı ekleyip tekrar gönderin.'); return false; }
        if (ev.body.trim().length < 3) { c.warn('Posta PDF ile gitti ama mesaj kısmı boş. Resmî postalara bir iki cümle yazmak nezaket gereğidir; bir dahaki sefere yazın. Şimdilik tekrar gönderin.'); return false; }
        return true;
      },
      done: 'Posta gitti. Şimdi gerçekten gittiğinden emin olalım.',
    },
    {
      title: '10. Gönderilenler\'de kontrol edin',
      html: `<p>Soldaki <b>📤 Gönderilenler</b> klasörüne tıklayın. Az önceki postayı bulup açın ve <b>📎 PDF'in</b> yanında durduğuna bakın.</p>
        <p class="mut">Önemli bir belgeyi gönderdiyseniz bu kontrolü her seferinde yapın.</p>`,
      hint: 'Postanın satırında Kime: muhtarlik@ornek.com yazar. Satıra tıklayınca açılır.',
      setup: mailOpen,
      on: (ev, c) => {
        if (ev.type === 'mail-folder' && ev.folder === 'sent') { c.note('Gönderilenler açıldı. Şimdi en üstteki postaya tıklayıp açın.'); return false; }
        return ev.type === 'mail-open' && ev.folder === 'sent';
      },
      done: 'Postanız ve PDF eki Gönderilenler\'de duruyor; gönderme tamam. Gmail\'de adı “Gönderilmiş”, Outlook\'ta “Gönderilmiş Öğeler”.',
    },
    { final: true, title: 'Parkur bitti! 🎉', html: '<p>Bir belgeyi yazıp PDF yaptınız ve e-postayla gönderdiniz:</p>' },
  ],
};
