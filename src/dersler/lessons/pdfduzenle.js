// 13. hafta ek dersi: PDF formu internetten indirmek, bilgisayarda doldurmak (yazı, vurgu, imza), kaydetmek ve yazdırmak (sayfa seçmek, kopya, iki yüz).
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { BELEDIYE_HOST } from '../apps/siteler-belge.js';

const br = (c) => maxed(c, 'browser');
const pdfInfo = (c) => c.d.find('pdf')?.api.info() || { annots: 0, page: 1 };

export const pdfDuzenle = {
  id: 'pdf-duzenle', icon: '✍', title: 'PDF formu indirmek, doldurmak ve yazdırmak', minutes: 40, stage: 'desktop',
  desc: 'PDF formunu bilgisayarda doldurmak ve yalnızca gereken sayfayı yazdırmak.',
  summary: [
    ['⬇ PDF indir', 'Formu bilgisayara kaydeder: İndirilenler klasörü'],
    ['T Yazı ekle', 'Boşluğa tıklayıp yazı yazın (formu elle doldurmanıza gerek kalmaz)'],
    ['🖍 Vurgula', 'Fareyi sürükleyerek önemli yeri sarıya boyar'],
    ['✍ İmza', 'İmza yerine tıklayın'],
    ['💾 Kaydet', 'Doldurduğunuz hâli yeni bir dosya olarak saklar; asıl form bozulmaz'],
    ['Yazdırma → Sayfalar', 'Yalnızca gerekli sayfayı seçin: kâğıt ve mürekkep tasarrufu'],
    ['Kopya, iki yüz, renk', 'Kopya sayısı, kâğıdın iki yüzüne yazdırma, siyah-beyaz'],
    ['Asıl yazıyı değiştirmek', 'PDF\'in kendi yazısı değiştirilemez; asıl belge (Word) gerekir'],
  ],
  steps: [
    {
      title: 'Formu bilgisayarda dolduralım',
      html: `<p>Bir kuruma başvururken çoğu zaman bir <b>form</b> doldurmanız istenir. Formlar genellikle <b>PDF</b> olarak sitelerden indirilir. İki yol var:</p>
        <ul class="big-list"><li>Yazdırıp <b>elle</b> doldurmak</li><li>Bilgisayarda <b>yazıp</b> yazdırmak: yazınız okunaklı olur, hata yaparsanız silersiniz.</li></ul>
        <p>Bugün <b>Örnek Belediyesi</b>'nin su abonelik formunu indirip bilgisayarda dolduracağız, sonra yazdıracağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Belediyenin sitesi',
      html: `<p><b>İnternet</b>'i açın, adres çubuğuna <b>${BELEDIYE_HOST}</b> yazın. Sonra <b>📄 Form ve dilekçeler</b>'e tıklayın.</p>`,
      setup: br,
      on: (ev) => ev.type === 'web-nav' && ev.host === BELEDIYE_HOST && ev.path === '/formlar',
      done: 'Formlar listelendi. Adreste <b>.bel.tr</b> yazıyor: belediye sitesi demek.',
    },
    {
      title: 'Formu indirin',
      html: '<p><b>Su abonelik başvuru formu</b>\'nun yanındaki <b>⬇ PDF indir</b> düğmesine tıklayın.</p>',
      on: (ev) => ev.type === 'download' && /su abonelik/i.test(ev.name),
      done: 'Form <b>İndirilenler</b> klasörüne indi. İndirme panelinde “Dosyayı aç” çıktı.',
    },
    {
      title: 'Formu açın',
      html: '<p>Sağdaki indirme panelinde <b>Dosyayı aç</b>\'a tıklayın (kaçırdıysanız tarayıcıdaki ⬇ simgesine ya da Dosya Gezgini → İndirilenler\'e bakın). <b>PDF Okuyucu</b> açılır.</p>',
      check: (c) => !!c.d.find('pdf'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'pdf',
      done: 'Form PDF Okuyucu\'da açıldı. Üstteki <b>✎ Düzenle</b> şeridini kullanacağız.',
    },
    {
      title: 'Yazı ekleyin',
      html: `<p><b>T Yazı ekle</b> düğmesine tıklayın, sonra formda <b>“Adı soyadı”</b> yazısının yanındaki boşluğa tıklayıp adınızı yazın, <b>Enter</b>'a basın. Aynı şekilde <b>Adres</b> boşluğuna da bir adres yazın.</p>
        <p class="mut">Gerçek kimlik ve telefon numaranızı yazmayın; alıştırma için uydurma bilgi yeterli.</p>`,
      hint: 'Düğme basılı kalır (mavi). Boşluk, “Adı soyadı:” yazısının sağındaki çizgidir. Yazdıktan sonra Enter.',
      on: (ev, c) => {
        if (ev.type === 'pdf-annot' && ev.kind === 'text') c.s.n = (c.s.n || 0) + 1;
        return (c.s.n || 0) >= 2;
      },
      done: 'İki boşluğu doldurdunuz. Yazıyı yanlış yere koyduysanız <b>↶ Geri al</b> ile son eklediğinizi silebilirsiniz.',
    },
    {
      title: 'Önemli yeri vurgulayın',
      html: '<p><b>🖍 Vurgula</b>\'ya tıklayın. Fareyi <b>“Başvuru ücreti: 150 ₺”</b> satırının üzerinde soldan sağa <b>basılı tutarak sürükleyin</b>. Satır sarıya boyanır.</p>',
      hint: 'Düğmeye bastıktan sonra farenin sol tuşunu satırın başında basılı tutun, sağa ve biraz aşağı sürükleyip bırakın.',
      on: (ev, c) => {
        if (ev.type !== 'pdf-annot' || ev.kind !== 'hl') return false;
        if (!/150/.test(ev.covers || '')) { c.note('Vurgu bu satırı kapsamadı. “Başvuru ücreti: 150 ₺” satırının üstünde sürükleyin.'); return false; }
        return true;
      },
      done: 'Ücret satırı sarı oldu. Bir belgede önemli tarih, tutar ya da uyarıyı böyle işaretlersiniz.',
    },
    {
      title: 'İmzalayın',
      html: '<p><b>✍ İmza</b>\'ya tıklayın, sonra formun altındaki <b>“İmza:”</b> yazısının yanındaki boşluğa tıklayın.</p>',
      on: (ev) => ev.type === 'pdf-annot' && ev.kind === 'sign',
      done: 'İmza yerleşti. Bu, belgeye <b>görüntü olarak</b> konan bir imzadır: kurumlar çoğu zaman yine de ıslak imza ister. Başvuru sayfasında “elektronik imza kabul edilir” yazıyorsa geçerlidir.',
    },
    {
      title: 'Kaydedin',
      html: `<p>Doldurduğunuz formu saklayın: <b>💾 Kaydet</b>'e tıklayın. Açılan pencerede <b>Belgeler</b> klasörünü seçili bırakın, ad olarak kendiliğinden gelen <b>“… (doldurulmuş).pdf”</b>'yi kabul edip <b>Kaydet</b>'e basın.</p>`,
      on: (ev, c) => {
        if (ev.type !== 'pdf-save') return false;
        if (ev.annots < 3) { c.note('Dosya kaydedildi ama içinde az bilgi var. Adı, adresi ve imzayı eklediğinizden emin olun.'); }
        return true;
      },
      done: 'Doldurulmuş hâli yeni dosya olarak kaydedildi. Asıl boş form İndirilenler\'de duruyor: bir başkası için yeniden doldurabilirsiniz.',
    },
    {
      title: 'Yazdırma seçeneklerini açın',
      html: `<p>Formu yazdıracağız. <b>🖨 Yazdır</b>'a (ya da ${K('Ctrl')} + ${K('P')}) tıklayın. Bu sefer pencerede <b>Sayfalar</b>, <b>Renk</b> ve <b>İki yüze</b> seçenekleri var; en altta da <b>kaç yaprak kâğıt</b> harcanacağı yazıyor.</p>`,
      combo: ['Ctrl', 'KeyP'],
      hint: 'Ctrl + P çalışmazsa önce belgeye bir kez tıklayın, ya da 🖨 Yazdır düğmesini kullanın.',
      on: (ev) => ev.type === 'pdf-print-open',
      done: 'Yazdırma penceresi açıldı. Seçenekleri değiştirdikçe alttaki yaprak sayısı da değişir.',
    },
    {
      title: 'Yalnızca gereken sayfayı yazdırın',
      html: `<p>Belediyeye yalnızca <b>1. sayfayı</b> teslim edeceksiniz; 2. sayfa bilgilendirme. Pencerede şunları ayarlayıp <b>Yazdır</b>'a basın:</p>
        <ol class="steps"><li><b>Sayfalar</b>: <b>Geçerli sayfa (1)</b> ya da <b>Aralık</b>: <b>1</b></li><li><b>Kopya sayısı</b>: <b>2</b> (biri sizde kalsın)</li><li><b>Renk</b>: <b>Siyah-beyaz</b> (mürekkep tasarrufu)</li></ol>`,
      hint: 'Sayfalar kutusundan “Geçerli sayfa” seçilebilir; 1. sayfadaysanız aynı işi görür. Altta “2 yaprak” yazmalı.',
      on: (ev, c) => {
        if (ev.type !== 'pdf-print') return false;
        if (ev.pagesPrinted !== 1) { c.warn(`${ev.pagesPrinted} sayfa yazdırdınız. Teslim edilecek yalnızca 1. sayfa: gereksiz kâğıt harcamayın. Yeniden deneyin.`); return false; }
        if (ev.from !== 1) { c.warn('1. sayfayı seçmediniz; formun doldurulan yeri 1. sayfa. Yeniden deneyin.'); return false; }
        if (ev.copies !== 2) { c.note('Kopya sayısını 2 yapın: biri teslim, biri sizde.'); return false; }
        if (ev.color) { c.note('Renkli yazdırdınız; form için siyah-beyaz yeter. Yine de yazdırıldı: bir daha yazdırıp Renk kutusunu Siyah-beyaz yapın.'); return false; }
        return true;
      },
      done: 'Yalnızca 1. sayfa, 2 kopya ve siyah-beyaz: toplam 2 yaprak. Bütün belgeyi renkli yazdırsaydınız mürekkep ve kâğıt iki katını harcayacaktı. Gerçek yazıcı seçiliyse kâğıt çıkar; “PDF olarak kaydet” seçiliyse dosya olarak kaydedilir.',
    },
    rehberSoru({
      title: 'Kâğıt hesabı',
      html: '<p>Bir belgenin <b>2 sayfasını</b> yazdıracaksınız, <b>2 kopya</b> ve <b>kâğıdın iki yüzüne</b>. Kaç yaprak kâğıt harcanır?</p>',
      opts: ['2', '1', '4'], ok: 0,
      wrong: 'Her kopya 2 sayfa; iki yüzlü yazdırınca 2 sayfa 1 yaprağa sığar.',
      why: 'Doğru: 2. Her kopya iki yüzlü 1 yaprak tutar; 2 kopya = 2 yaprak. İki yüzlü yazdırmak kâğıdı yarıya indirir.',
    }),
    rehberSoru({
      title: 'Yazıyı değiştirmek',
      html: '<p>Bir PDF faturadaki <b>adres yazısını</b> düzeltmek istiyorsunuz. PDF Okuyucu\'da asıl yazıya tıklayıp yazmayı denediniz, olmadı. Neden?</p>',
      opts: ['Program bozuk', 'Yazıyı silmek yasak', 'PDF’in kendi yazısı değiştirilemez; yalnızca üstüne yazı eklenir. Düzeltme için asıl belge (Word) gerekir'], ok: 2,
      wrong: 'PDF, belgenin “fotoğrafı” gibidir. Düzenleme araçları yalnızca üstüne ekleme yapar.',
      why: 'PDF\'in amacı belgenin aynen korunmasıdır. Üstüne yazı, vurgu, imza eklenir; asıl yazı ise ancak belgenin kaynağından (Word dosyası) ya da özel dönüştürme programlarıyla değiştirilir. Resmî bir belgeyi değiştirmek de doğru değildir.',
    }),
    rehberSoru({
      title: 'Taranmış belge',
      html: '<p>Bir kurumun taranarak gönderdiği PDF\'te Ctrl + F ile <b>kelime aradınız</b> ama hiçbir şey bulunamadı. Metin açıkça görünüyor. Neden?</p>',
      opts: ['Taranmış PDF aslında bir resimdir; yazılar “yazı” değil, görüntü olarak durur', 'Bilgisayar kelimeyi bilmiyor', 'Kelime yanlış yazılmış'], ok: 0,
      wrong: 'Bilgisayar, resimdeki harfleri okuyamaz. Ama tarama nasıl bir dosya üretir?',
      why: 'Taranmış belge bir fotoğraf gibidir; arama ve kopyalama çalışmaz. Gerçek yazı içeren (bilgisayarda üretilmiş) PDF’lerde arama çalışır.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>PDF form doldurmayı ve yazdırmayı öğrendiniz:</p>' },
  ],
};
