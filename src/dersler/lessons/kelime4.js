// 10. hafta ek dersi: uzun belgelerde üst bilgi, alt bilgi, sayfa numarası, dipnot (Başvurular → Dipnot Ekle) ve
// köprü (bağlantı, Ctrl + K; Ctrl + tık ile açılır). Üst bilgi ve sayfa numarası özgeçmiş dersinde de kısaca geçer.
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { BELEDIYE_HOST } from '../apps/siteler-kamu.js';

const DOSYA = 'gezi bilgi notu.docx';
const HTML = `<h1>Kültür gezisi bilgi notu</h1>
<p>Derneğimiz 8 Kasım Cumartesi günü Çınar Kent Müzesi'ne gezi düzenliyor. Otobüs saat 09.00'da dernek binasının önünden kalkacak.</p>
<p>Müze girişi 65 yaş ve üstü için ücretsizdir.</p>
<p>Gezi programı ve müzenin ziyaret saatleri Çınar Belediyesi sitesinde yayımlanmıştır.</p>
<p>Öğle yemeği müzenin bahçesindeki lokantada yenecek; yemek ücreti kişi başı 250 TL'dir.</p>
<p>Kayıt için en geç 3 Kasım'a kadar dernek sekreterliğine adınızı yazdırın.</p>
<p style="text-align:right">Dernek Yönetim Kurulu</p>`;
const W = (c) => c.d.find('word')?.api;
const info = (c) => W(c)?.info() || { blocks: [], footnotes: [], linkList: [] };

export const kelimeDipnot = {
  id: 'kelime-dipnot', icon: '📑', title: 'Üst bilgi, alt bilgi, sayfa numarası, dipnot ve köprü', minutes: 35, stage: 'desktop',
  desc: 'Bir bilgi notuna dernek adını üst bilgi, hazırlayanı alt bilgi olarak eklemek; sayfa numarası, dipnot ve internet köprüsü.',
  summary: [
    ['Ekle → Üst bilgi', 'Her sayfanın en üstünde tekrarlanan yazı (kurum adı, belgenin adı)'],
    ['Ekle → Alt bilgi', 'Her sayfanın en altında tekrarlanan yazı (hazırlayan, tarih)'],
    ['Ekle → Sayfa numarası', 'Alt bilgiye “Sayfa 1 / 2” ekler; sayfalar karışırsa sırası bulunur'],
    ['Başvurular → Dipnot Ekle', 'İmlecin yerine küçük bir sayı koyar; açıklama sayfanın altına yazılır. Kısayolu ' + K('Alt', 'Ctrl', 'F')],
    ['Dipnotu silmek', 'Metindeki küçük sayıyı silin: alttaki açıklama da kalkar, numaralar yeniden sıralanır'],
    ['Köprü (bağlantı)', 'Yazıyı seçin → ' + K('Ctrl', 'K') + ' → adresi yazın → Ekle'],
    ['Köprüyü açmak', K('Ctrl') + ' basılıyken köprüye tıklayın: tarayıcıda açılır'],
  ],
  setup: (c) => { put(c, 'docs', DOSYA, 'file', { html: HTML }); },
  steps: [
    {
      title: 'Uzun belgelerin süsleri',
      html: `<p>Dernek için hazırlanmış bir <b>gezi bilgi notu</b> açık. Bugün ona resmî belgelerde sık görülen beş şeyi ekleyeceğiz:</p>
        <ul class="big-list"><li>▔ <b>Üst bilgi</b> ve ▁ <b>alt bilgi</b>: her sayfada tekrarlanan yazı</li><li>#️ <b>Sayfa numarası</b></li><li>¹ <b>Dipnot</b>: bir sözcüğe eklenen küçük açıklama</li><li>🔗 <b>Köprü</b>: tıklayınca internet sayfası açan yazı</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'word', { node: c.d.fs.find('docs', DOSYA)?.id }); },
    },
    {
      title: 'Üst bilgi',
      html: '<p>Üstten <b>Ekle</b> sekmesine geçin, <b>▔ Üst bilgi</b>\'ye basın. Sayfanın üstünde açılan alana <b>Çınar Emekliler Derneği</b> yazın.</p>',
      mouse: '🖱 Ekle → Üst bilgi',
      on: (ev) => ev.type === 'doc-hf' && ev.which === 'header' && norm(ev.text).includes('emekliler derneği'),
      done: 'Üst bilgi her sayfanın en üstünde aynen tekrarlanır. Belge kaç sayfa olursa olsun bir kez yazmanız yeter.',
    },
    {
      title: 'Alt bilgi',
      html: '<p>Aynı sekmede <b>▁ Alt bilgi</b>\'ye basın; sayfanın altında açılan alana <b>Hazırlayan:</b> yazıp yanına adınızı soyadınızı yazın.</p>',
      mouse: '🖱 Ekle → Alt bilgi',
      hint: 'Alt bilgi alanı sayfanın en altındadır; görmüyorsanız fare tekerleğiyle aşağı inin.',
      on: (ev) => ev.type === 'doc-hf' && ev.which === 'footer' && /hazırlayan:?\s*\S{2,}/i.test(ev.text),
      done: 'Alt bilgi de her sayfanın en altında görünür.',
    },
    {
      title: 'Sayfa numarası',
      html: '<p><b>Ekle</b> sekmesinde <b>#️ Sayfa numarası</b>\'na basın. Alt bilginin sağında “Sayfa 1 / 1” çıkar.</p>',
      on: (ev) => ev.type === 'doc-pagenum' && ev.on,
      done: 'Numara kendiliğinden artar; belgeye sayfa eklenince “1 / 2, 2 / 2” olur.',
    },
    {
      title: 'İmleci yerleştirin',
      html: '<p>Üçüncü satırdaki <b>“ücretsizdir.”</b> sözcüğünün <b>sonuna</b>, noktanın hemen arkasına tıklayın. Dipnot imlecin olduğu yere eklenecek.</p>',
      manual: 'Tıkladım ✔',
      hint: 'Satırın sonundaki boşluğa tıklamak da imleci satırın sonuna götürür. Ya da satıra tıklayıp End tuşuna basın.',
    },
    {
      title: 'Dipnot ekleyin',
      html: `<p>Üstten <b>Başvurular</b> sekmesine geçin ve <b>ab¹ Dipnot Ekle</b>'ye basın. Sözcüğün yanında küçük bir <b>1</b> çıkar; imleç sayfanın altına iner.</p>`,
      mouse: '🖱 Başvurular → Dipnot Ekle',
      hint: `Kısayolu: ${K('Alt', 'Ctrl', 'F')}. Sayı yanlış yere eklendiyse ${K('Ctrl', 'Z')} ile geri alıp imleci yeniden yerleştirin.`,
      on: (ev, c) => {
        if (ev.type !== 'doc-footnote') return false;
        const p = W(c)?.page.querySelector('sup.wd-fnref')?.closest('p');
        if (p && !/ücretsiz/i.test(p.innerText)) c.note('Dipnot başka bir satıra eklendi. Ctrl + Z ile geri alıp imleci “ücretsizdir.” sözcüğünün sonuna koyabilirsiniz; ya da böyle devam edin.');
        return true;
      },
      done: 'Metinde küçük 1, sayfanın altında çizginin altında 1 numaralı satır çıktı.',
    },
    {
      title: 'Dipnotu yazın',
      html: '<p>Sayfanın altındaki 1 numaralı satıra tıklayıp <b>Kimlik kartınızı yanınızda getirin.</b> yazın.</p>',
      on: (ev) => ev.type === 'doc-fn-text' && norm(ev.text).includes('kimlik kartınızı'),
      done: 'Dipnot, ana yazıyı uzatmadan ek bilgi verir. Kitaplarda kaynak göstermek için de kullanılır.',
    },
    {
      title: 'Köprü için seçin',
      html: '<p>Dördüncü satırdaki <b>Çınar Belediyesi</b> sözcüklerini fareyle sürükleyerek seçin (mavi boyansın).</p>',
      manual: 'Seçtim ✔',
      hint: 'Ç harfinin hemen soluna basılı tutun, “Belediyesi”nin sonuna kadar sürükleyip bırakın.',
    },
    {
      title: 'Köprü ekleyin',
      html: `<p>${K('Ctrl', 'K')} tuşlarına basın (ya da Ekle → <b>🔗 Bağlantı</b>). Adres kutusuna <b>${BELEDIYE_HOST}</b> yazıp <b>Ekle</b>'ye basın.</p>`,
      combo: ['Ctrl', 'KeyK'],
      on: (ev, c) => {
        if (ev.type !== 'doc-link') return false;
        if (!/cinar\.bel\.tr/i.test(ev.url)) { c.note(`Adres “${ev.url}” oldu. Doğrusu ${BELEDIYE_HOST}; Ctrl + Z ile geri alıp yeniden deneyin.`); return false; }
        if (!/çınar belediyesi/i.test(ev.text)) c.note('Köprü eklendi ama yazısı “Çınar Belediyesi” değil. Önce yazıyı seçerseniz köprü o yazıya bağlanır.');
        return true;
      },
      done: '“Çınar Belediyesi” mavi ve altı çizili oldu: bu bir köprü. Belgeyi PDF yapıp e-postayla gönderdiğinizde de tıklanabilir kalır.',
    },
    {
      title: 'Köprüyü deneyin',
      html: `<p>${K('Ctrl')} tuşunu <b>basılı tutup</b> köprüye tıklayın. Belediyenin sitesi tarayıcıda açılmalı.</p>`,
      hint: 'Ctrl\'ye basmadan tıklarsanız yalnızca imleç oraya gider; bu, yanlışlıkla açılmasın diyedir.',
      on: (ev) => ev.type === 'doc-link-open' || (ev.type === 'web-nav' && /cinar\.bel\.tr/.test(ev.host)),
      done: 'Site açıldı. Tarayıcıyı kapatıp Kelime İşlemci\'ye dönün.',
    },
    {
      title: 'Kaydedin',
      html: `<p>Kelime İşlemci'ye dönün ve ${K('Ctrl', 'S')} ile kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      hint: 'Görev çubuğundaki 📘 simgesine tıklayın, sonra Ctrl + S.',
      on: (ev) => ev.type === 'doc-save',
      done: 'Üst bilgi, alt bilgi, sayfa numarası, dipnot ve köprü belgeyle birlikte kaydedildi.',
    },
    rehberSoru({
      title: 'Hangisi?',
      html: '<p>Bir rapordaki “%30” rakamının nereden alındığını, sayfanın altında küçük yazıyla belirtmek istiyorsunuz. Neyi kullanırsınız?</p>',
      opts: ['Dipnot', 'Üst bilgi', 'Sayfa sonu'], ok: 0,
      wrong: 'Üst bilgi her sayfada aynı yazıyı tekrarlar; sayfa sonu yeni sayfa açar.',
      why: 'Doğru. Dipnot yalnızca o sözcüğe bağlıdır ve numaralanır; ikinci dipnot eklerseniz 2 olur, araya eklerseniz numaralar kendiliğinden kayar.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Belgeye eklediğiniz öğeler:</p>' },
  ],
};
