// 10. hafta ek dersi: dernek tutanağı (MEB Kelime İşlemci: belgeyi gözden geçirme ve koruma).
// Üye olarak Değişiklikleri İzle ile öneri yapmak ve Yeni Açıklama eklemek; başkan olarak Kabul Et / Reddet;
// sonra Dosya → Bilgi → Belgeyi Koru → Parola ile Şifrele, kaydedip kapatmak ve yanlış / doğru parolayla yeniden açmak.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const DOSYA = 'yönetim kurulu tutanağı.docx';
const PAROLA = 'Cinar2026';
const HASAN = 'Hasan Yılmaz';
const HTML = `<p style="text-align:center"><b>ÇINAR EMEKLİLER DERNEĞİ</b></p>
<p style="text-align:center"><b>Yönetim Kurulu Toplantı Tutanağı</b></p>
<p>Toplantı tarihi: 3 Kasım 2026 · Yer: Dernek salonu</p>
<p>Katılanlar: Mustafa Aydın (Başkan), Hasan Yılmaz, Fatma Demir, Ayşe Kaya</p>
<p><b>Alınan kararlar</b></p>
<p>1. Aylık üye aidatı 1 Ocak 2027'den başlayarak 100 TL olacaktır.</p>
<p>2. Yılbaşı kermesi 12 Aralık Cumartesi günü dernek bahçesinde yapılacaktır.</p>
<p>3. Kermesin geliri kış aylarında <del class="wd-del" data-author="${HASAN}">yakacak yardımına</del><ins class="wd-ins" data-author="${HASAN}">yeni televizyon alımına</ins> ayrılacaktır.</p>
<p>4. Bir sonraki toplantı toplantı 1 Aralık 2026 Salı günü saat 14.00'te yapılacaktır.</p>
<p><br></p>
<p>Başkan: Mustafa Aydın · Yazman: Fatma Demir</p>`;

const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], revisions: [], comments: [], text: '' };
const revs = (c) => info(c).revisions || [];
const metin = (c) => norm(info(c).text || '');
const izleniyor = (c) => !!info(c).track;
const aidatOneri = (c) => revs(c).some((r) => r.type === 'del' && r.text.trim() === '100') && revs(c).some((r) => r.type === 'ins' && r.text.trim() === '150');
const tekrarSilindi = (c) => revs(c).some((r) => r.type === 'del' && norm(r.text) === 'toplantı');
const aciklama = (c) => (info(c).comments || []).find((m) => norm(m.anchor).includes('bahçe'));
const aciklamaTamam = (c) => norm(aciklama(c)?.text || '').includes('salon');
const aidatKabul = (c) => !revs(c).some((r) => /^(100|150)$/.test(r.text.trim())) && /150\s*tl olacaktır/.test(metin(c)) && !metin(c).includes('100 tl');
const hasanBekliyor = (c) => revs(c).some((r) => r.author === HASAN);
const hasanRed = (c) => !hasanBekliyor(c) && metin(c).includes('yakacak yardımına') && !metin(c).includes('televizyon');
const hepsiBitti = (c) => !revs(c).length && metin(c).includes('bir sonraki toplantı 1 aralık');
const dosya = (c) => c.d.fs.find('docs', DOSYA);
const korunuyor = (c) => !!dosya(c)?.content?.pass;

export const kelimeIzle = {
  id: 'kelime-izle', icon: '📝', title: 'Tutanak: değişiklikleri izle, açıklama ve parola', minutes: 40, stage: 'desktop',
  desc: 'Bir belgede öneriyi iz bırakarak yapmak (Değişiklikleri İzle), kenara not düşmek (Yeni Açıklama), önerileri kabul ya da reddetmek; belgeyi parolayla korumak ve parolayla açmak.',
  summary: [
    ['Gözden Geçir → 📝 Değişiklikleri İzle', 'Açıkken eklenen yazı altı çizili renkli, silinen yazı üstü çizili görünür · ' + K('Ctrl', 'Shift', 'E')],
    ['Gözden Geçir → 💬 Yeni Açıklama', 'Seçili yazıya sağ kenarda not balonu; yazının kendisi değişmez'],
    ['Sonraki ▶ / ◀ Önceki', 'Bir sonraki (önceki) değişikliği seçer'],
    ['✔ Kabul Et / ✖ Reddet', 'Öneriyi belgeye işler / geri alır, sonrakine geçer. ▾ ile Tüm Değişiklikleri Kabul Et'],
    ['🗑 Sil', 'Seçili açıklamayı siler'],
    ['Dosya → Bilgi → Belgeyi Koru → Parola ile Şifrele', 'Parola iki kez yazılır; kaydedince belge parolasız açılmaz'],
    ['Parolayı unutursanız', 'Belge kurtarılamaz: parolayı güvenli bir yere yazın'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', { html: HTML }); },
  steps: [
    {
      title: 'Toplantı tutanağı',
      html: `<p>Derneğin yönetim kurulu toplandı; yazman <b>tutanağı</b> yazıp herkese gönderdi. Siz de kurul üyesisiniz ve birkaç düzeltmeniz var.</p>
        <p>Düzeltmeyi doğrudan yaparsanız başkan neyin değiştiğini göremez. Bu yüzden önce <b>Değişiklikleri İzle</b>\'yi açacağız: yaptığınız her değişiklik renkli görünür, başkan da her birini <b>kabul eder</b> ya da <b>reddeder</b>.</p>
        <p>3. kararda başka bir üyenin (<b>Hasan Yılmaz</b>) önerisi zaten duruyor: üstü çizili yazı silinmesini, altı çizili yazı eklenmesini istediği yazıdır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: dosya(c)?.id }); },
    },
    {
      title: 'Değişiklikleri İzle',
      html: `<p>Üstteki <b>Gözden Geçir</b> sekmesine tıklayın. Sonra <b>📝 Değişiklikleri İzle</b> düğmesine basın.</p>
        <p>Düğme mavi kalır ve en alttaki çubukta <b>Değişiklikleri İzle: Açık</b> yazar.</p>`,
      mouse: '🖱 Gözden Geçir → 📝 Değişiklikleri İzle',
      hint: `Kısayolu: ${K('Ctrl', 'Shift', 'E')}. Aynı düğmeye yeniden basarsanız izleme kapanır.`,
      check: izleniyor,
      on: (ev, c) => ev.type === 'doc-track' && izleniyor(c),
      done: 'İzleme açık. Bundan sonra yaptığınız her değişiklik sizin adınızla işaretlenecek.',
    },
    {
      title: 'Aidatı düzeltin',
      html: `<p>Toplantıda aidat <b>150 TL</b> olarak kararlaştırılmıştı ama tutanağa 100 yazılmış.</p>
        <p>1. karardaki <b>100</b> sayısına <b>çift tıklayın</b> (seçilir) ve <b>150</b> yazın.</p>`,
      mouse: '🖱 100\'e çift tık → 150 yazın',
      hint: 'Sayıyı silmeyin, seçip üstüne yazın. Yanlış yere yazdıysanız Backspace ile silin: kendi eklediğiniz yazı iz bırakmadan silinir.',
      check: aidatOneri,
      on: (ev, c) => (ev.type === 'doc-revision' || ev.type === 'doc-input') && aidatOneri(c),
      done: '<b>100</b> silinmedi, <b>üstü çizildi</b>; <b>150</b> altı çizili renkli eklendi. Başkan ikisini de görür. Fareyi değişikliğin üstünde bekletirseniz kimin yaptığı yazar.',
    },
    {
      title: 'Fazla sözcüğü silin',
      html: `<p>4. kararda <b>toplantı toplantı</b> diye bir sözcük iki kez yazılmış.</p>
        <p>İkinci <b>toplantı</b> sözcüğüne çift tıklayın ve ${K('Delete')} tuşuna basın.</p>`,
      keys: ['Delete'],
      hint: 'Delete tuşu klavyenin sağ üst tarafında, Backspace\'in altındadır (Del yazabilir). Backspace de olur.',
      check: tekrarSilindi,
      on: (ev, c) => ev.type === 'doc-revision' && tekrarSilindi(c),
      done: 'Sözcük kaybolmadı, üstü çizili kaldı: “bunu silmeyi öneriyorum” demek. Başkan kabul edince gerçekten silinir.',
    },
    {
      title: 'Açıklama ekleyin',
      html: `<p>2. kararda kermesin yeri için bir sorunuz var ama yazıyı değiştirmek istemiyorsunuz: <b>kenara not</b> düşeceksiniz.</p>
        <ol class="big-list"><li><b>dernek bahçesinde</b> sözcüklerini fareyle sürükleyerek seçin.</li><li><b>Gözden Geçir → 💬 Yeni Açıklama</b>\'ya basın.</li><li>Sağda açılan balona şunu yazın: <b>Yağmur yağarsa kermes salonda yapılsın.</b></li></ol>`,
      mouse: '🖱 Sözcükleri seçin → 💬 Yeni Açıklama → balona yazın',
      hint: 'Balon sayfanın sağında, seçtiğiniz satırın hizasında açılır; imleç içindedir, doğrudan yazabilirsiniz. Nokta tuşu Ç harfinin sağındadır.',
      check: aciklamaTamam,
      on: (ev, c) => (ev.type === 'doc-comment' || ev.type === 'doc-comment-text') && aciklamaTamam(c),
      done: 'Seçtiğiniz sözcükler renklendi, notunuz sağ kenarda adınızla duruyor. Açıklama yazdırılan belgeye girmez; yalnızca belgeyi okuyan kişilere görünür.',
    },
    {
      title: 'Başkanın gözüyle: kabul edin',
      html: `<p>Belge başkana gitti. Şimdi siz <b>başkan</b>sınız ve önerileri tek tek inceleyeceksiniz.</p>
        <ol class="big-list"><li>En üstteki <b>ÇINAR EMEKLİLER DERNEĞİ</b> satırına tıklayın.</li><li><b>Gözden Geçir</b> sekmesinde <b>Sonraki ▶</b>\'ye basın: ilk değişiklik (100 → 150) seçilir.</li><li><b>✔ Kabul Et</b>\'e basın.</li></ol>`,
      mouse: '🖱 Başlık → Sonraki ▶ → ✔ Kabul Et',
      hint: 'Kabul Et düğmesinin sağındaki küçük ▾ okuna değil, düğmenin kendisine basın.',
      check: aidatKabul,
      on: (ev, c) => ev.type === 'doc-review' && aidatKabul(c),
      done: 'Aidat artık düz yazıyla <b>150 TL</b>: 100 kalktı, işaretler kayboldu. Kelime İşlemci hemen bir sonraki değişikliği, Hasan Bey\'in önerisini seçti.',
    },
    {
      title: 'Öneriyi reddedin',
      html: `<p>Hasan Bey kermes gelirinin <b>yeni televizyon alımına</b> ayrılmasını önermiş. Kurul ise yakacak yardımında karar kılmıştı.</p>
        <p>Öneri seçiliyken <b>✖ Reddet</b>\'e basın.</p>`,
      mouse: '🖱 ✖ Reddet',
      hint: 'Öneri seçili değilse 3. karardaki renkli yazıya tıklayın, sonra Reddet. Yanlışlıkla kabul ettiyseniz: “yeni televizyon alımına” sözcüklerini seçip yerine “yakacak yardımına” yazın, sonra Sonraki ▶ ve Kabul Et.',
      check: hasanRed,
      on: (ev, c) => {
        if (ev.type !== 'doc-review') return false;
        if (ev.op === 'accept' && metin(c).includes('televizyon') && !hasanBekliyor(c)) c.note('Öneri kabul edildi. Düzeltmek için ipucuna bakın.');
        return hasanRed(c);
      },
      done: 'Öneri geri alındı: tutanakta yine <b>yakacak yardımına</b> yazıyor. Reddetmek, öneriyi yapan kişiye kırıcı bir şey değildir; karar başkanındır.',
    },
    {
      title: 'Kalanların hepsini kabul edin',
      html: `<p>Geriye 4. karardaki silinen <b>toplantı</b> sözcüğü kaldı. Tek tek uğraşmak yerine hepsini birden kabul edebilirsiniz.</p>
        <p><b>✔ Kabul Et</b>\'in sağındaki küçük <b>▾</b> okuna basın ve <b>Tüm Değişiklikleri Kabul Et</b>\'i seçin.</p>`,
      mouse: '🖱 Kabul Et ▾ → Tüm Değişiklikleri Kabul Et',
      hint: 'Bunu ancak bütün önerileri okuduktan sonra yapın: okumadığınız bir öneriyi de kabul etmiş olursunuz.',
      check: hepsiBitti,
      on: (ev, c) => ev.type === 'doc-review' && hepsiBitti(c),
      done: 'Belgede bekleyen değişiklik kalmadı: “Bir sonraki toplantı 1 Aralık…” diye düzgün okunuyor.',
    },
    {
      title: 'Açıklamayı silin',
      html: `<p>Başkan açıklamayı okudu, yağmur olursa kermesi salonda yapmaya karar verdi. Not artık gerekmiyor.</p>
        <p>Sağdaki balonun içine tıklayın, sonra <b>Gözden Geçir → 🗑 Sil</b>\'e basın.</p>`,
      mouse: '🖱 Balon → 🗑 Sil',
      hint: 'Balonun sağ üstündeki küçük 🗑 düğmesi de aynı işi görür.',
      check: (c) => !(info(c).comments || []).length,
      on: (ev, c) => ev.type === 'doc-comment' && ev.op === 'delete' && !(info(c).comments || []).length,
      done: 'Balon kalktı, sözcüklerin rengi gitti. Belgeyi dışarıya (ör. belediyeye) göndermeden önce değişiklik ve açıklama bırakmayın.',
    },
    {
      title: 'İzlemeyi kapatın',
      html: '<p>İnceleme bitti. <b>📝 Değişiklikleri İzle</b> düğmesine yeniden basıp izlemeyi kapatın.</p>',
      hint: `Alttaki çubukta “Değişiklikleri İzle: Açık” yazısı kaybolmalı. Kısayol: ${K('Ctrl', 'Shift', 'E')}.`,
      check: (c) => !izleniyor(c),
      on: (ev, c) => ev.type === 'doc-track' && !izleniyor(c),
      done: 'İzleme kapandı. Açık unutulursa sonraki her düzeltme de renkli işaretlenir ve belge karışık görünür.',
    },
    {
      title: 'Belgeyi parolayla koruyun',
      html: `<p>Tutanakta üyelerin bilgileri ve kararlar var; parolayı bilmeyen kimse açamasın.</p>
        <ol class="big-list"><li><b>Dosya</b> menüsünden <b>ℹ Bilgi</b>\'yi seçin.</li><li><b>🔒 Belgeyi Koru ▾</b> düğmesine, sonra <b>🔑 Parola ile Şifrele</b>\'ye basın.</li><li>Parola olarak <b>${PAROLA}</b> yazın, <b>Tamam</b>. Açılan ikinci pencerede <b>aynı parolayı</b> yeniden yazın, <b>Tamam</b>.</li></ol>`,
      mouse: '🖱 Dosya → Bilgi → Belgeyi Koru → Parola ile Şifrele',
      hint: `Parolada büyük C ve küçük harfler var: C\'yi ${K('Shift')} ile yazın. Yazdığınız harfler nokta (•) olarak görünür. İki parola aynı olmazsa “Onay parolası aynı değil” yazar; yeniden deneyin.`,
      check: (c) => !!info(c).protected,
      on: (ev, c) => {
        if (ev.type === 'doc-protect' && ev.mismatch) c.note('İki parola aynı değil. İkinci kutuya da tam olarak ' + PAROLA + ' yazın.');
        return ev.type === 'doc-protect' && !!info(c).protected;
      },
      done: '“Belgeyi Koru” kutusu sarıya döndü: <b>Bu belgeyi açmak için parola gerekir.</b> Koruma, belgeyi kaydettiğinizde dosyaya işlenir.',
    },
    {
      title: 'Kaydedin ve kapatın',
      html: '<p>Bilgi ekranının solundaki <b>💾 Kaydet</b>\'e, sonra <b>✕ Kapat</b>\'a basın.</p>',
      hint: `Bilgi ekranından çıktıysanız ${K('Ctrl', 'S')} ile kaydedip pencerenin sağ üstündeki ✕ ile kapatın.`,
      check: (c) => korunuyor(c) && !W(c),
      on: (ev, c) => (ev.type === 'doc-save' || ev.type === 'win-close') && korunuyor(c) && !W(c),
      done: 'Belge parolalı olarak kaydedildi ve kapandı.',
    },
    {
      title: 'Yanlış parolayla deneyin',
      html: `<p><b>Belgeler</b> klasörü açıldı. Parolayı bilmeyen biri ne görür, bakalım.</p>
        <p><b>${DOSYA}</b> dosyasına çift tıklayın. Parola kutusuna <b>bilerek yanlış</b> bir parola yazın (ör. <b>1234</b>) ve <b>Tamam</b>\'a basın. Çıkan uyarıda da <b>Tamam</b>.</p>`,
      setup: (c) => { const w = maxed(c, 'explorer', { folder: 'docs' }); w.api?.go?.('docs'); },
      mouse: '🖱 Dosyaya çift tık → yanlış parola → Tamam',
      hint: 'Dosya “Belgeler” klasöründe, adı “yönetim kurulu tutanağı”.',
      on: (ev) => ev.type === 'doc-open-pass' && !ev.ok && !ev.cancel,
      done: '<b>Girdiğiniz parola yanlış</b>: belge açılmadı, pencere kapandı. Dosyayı e-postayla alan ya da bilgisayarınızı kullanan biri de bunu görür.',
    },
    {
      title: 'Doğru parolayla açın',
      html: `<p>Şimdi aynı dosyaya yeniden çift tıklayın ve doğru parolayı yazın: <b>${PAROLA}</b>.</p>`,
      hint: 'Büyük/küçük harf fark eder: cinar2026 yazarsanız açılmaz.',
      check: (c) => !!W(c) && norm(info(c).text || '').includes('yakacak yardımına'),
      on: (ev, c) => {
        if (ev.type === 'doc-open-pass' && !ev.ok && !ev.cancel) c.note('Parola yine yanlış. Büyük C ile ' + PAROLA + ' yazın.');
        return ev.type === 'doc-open-pass' && ev.ok;
      },
      done: 'Belge açıldı; bütün düzeltmeler yerinde. Alttaki çubukta <b>🔒 Parolalı</b> yazıyor.',
    },
    rehberSoru({
      title: 'Parolayı unutursanız?',
      html: '<p>Belgeye koyduğunuz parolayı unutursanız ne olur?</p>',
      opts: ['Kelime İşlemci parolayı e-postama gönderir', 'Belge açılamaz; parolayı kurtarmanın bir yolu yoktur', 'Bilgisayarın açılış şifresiyle açılır'], ok: 1,
      wrong: 'Belge parolası bir hesap şifresi gibi değildir: “şifremi unuttum” bağlantısı yoktur.',
      why: 'Doğru. Bu yüzden parolayı güvenilir bir yere (ör. kilitli çekmecedeki deftere) yazın. Önemli belgenin parolasız bir kopyasını da güvenli bir yerde saklayabilirsiniz.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bir belgeyi birlikte düzeltmeyi ve korumayı öğrendiniz:</p>' },
  ],
};
