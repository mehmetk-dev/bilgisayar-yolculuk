// 13. hafta: günlük işler. Aynı işler iki yerde ayrı ayrı: bilgisayarın kendisinde (masaüstü, Dosya Gezgini)
// ve internet tarayıcısında. Ekran görüntüsü, fotoğraf kaydetme, arka plan, kopyalama, yakınlaştırma, sık kullanılanlar.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});
const PHOTO_SITE = 'www.ucretsiz-fotograflar.com.tr';

export const gunlukPc = {
  id: 'gunluk-pc', icon: '🖥', title: 'Günlük işler: bilgisayarda', minutes: 35, stage: 'desktop',
  desc: 'Ekran görüntüsü almak, Paint\'e yapıştırmak, USB belleğe kopyalamak.',
  summary: [
    ['PrtSc (Print Screen)', 'Bütün ekranın resmini panoya alır; Paint\'te Ctrl + V'],
    ['⊞ + Shift + S', 'Ekranın istediğiniz bölümünün resmi (Ekran Alıntısı)'],
    ['Sağ tık → Masaüstü arka planı olarak ayarla', 'Fotoğrafı arka plan yapar'],
    ['Ctrl + C → Ctrl + V', 'Dosyayı kopyalar: aslı yerinde kalır'],
    ['Ctrl + X → Ctrl + V', 'Dosyayı taşır: aslı oradan kalkar'],
    ['Sürükle-bırak', 'Aynı diskte taşır, USB belleğe kopyalar'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Her gün gereken dört işi <b>bilgisayarın kendisinde</b> yapacağız:</p><ul class="big-list"><li>📸 Ekranın resmini almak</li><li>🖼 Bir fotoğrafı arka plan yapmak</li><li>💾 Dosyayı USB belleğe kopyalamak</li><li>↔ Kopyalamak ile taşımak arasındaki fark</li></ul>
        <p class="mut">Bir sonraki ders aynı işlerin <b>internet tarayıcısında</b> nasıl yapıldığını anlatır; ikisi farklıdır.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.ensure('calc'); },
    },
    {
      title: 'Bütün ekranın resmi: PrtSc',
      html: `<p>Klavyenin sağ üst tarafında <b>PrtSc</b> (Print Screen, “ekranı yazdır”) tuşu vardır. Bir kez basın: o anda ekranda ne varsa resmi <b>panoya</b> alınır.</p>
        <p>Şimdi ${K('PrtSc')} tuşuna basın.</p>
        <p class="mut">Dizüstünde ${K('Fn', 'PrtSc')} gerekebilir. Bazı bilgisayarlarda bu tuşa Windows'un kendi aracı yanıt verir ve buraya ulaşmaz; öyle olursa alttaki düğmeyi kullanın.</p>`,
      manual: '📸 Tuş çalışmadı, düğmeyle al',
      on: (ev) => ev.type === 'printscreen',
      leave: (c) => { if (!c.d.imageClip) c.d.printScreen(); },
      done: 'Ekranın resmi panoda. Görmek için bir yere <b>yapıştırmak</b> gerekir.',
    },
    {
      title: 'Paint\'e yapıştırın',
      html: `<p>⊞ Başlat'tan <b>Paint</b>\'i açın ve ${K('Ctrl', 'V')}\'ye basın.</p>`,
      combo: ['Ctrl', 'KeyV'],
      setup: (c) => { if (!c.d.imageClip) c.d.printScreen(); },
      on: (ev) => ev.type === 'paint-paste',
      done: 'Ekranın resmi Paint\'te. Hata mesajlarını göstermek, bir şeyi hatırlamak için çok işe yarar.',
    },
    {
      title: 'Resmi kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Resimler</b> klasörüne <b>ekran</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev) => ev.type === 'save' && ev.app === 'paint',
      done: 'Ekran görüntüsü artık bir dosya: e-postaya ekleyebilir, birine gönderebilirsiniz. Sadece bir bölümün resmi gerekiyorsa ⊞ + Shift + S (Ekran Alıntısı) kullanılır.',
    },
    {
      title: 'Fotoğrafı arka plan yapın',
      html: '<p>Dosya Gezgini\'ni açın, <b>Resimler</b> klasörüne gidin. <b>tatil.jpg</b>\'ye <b>sağ tıklayın</b> ve <b>Masaüstü arka planı olarak ayarla</b>\'yı seçin.</p>',
      mouse: '🖱 Resimler → tatil.jpg → sağ tık',
      setup: (c) => { c.d.closeAll(); c.d.open('explorer', { folder: 'pictures' }); },
      hint: 'Fotoğrafı açıp Fotoğraflar uygulamasındaki “Arka plan yap” düğmesi de aynı işi yapar.',
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Masaüstünün arka planı değişti. Ayarlar → Kişiselleştirme → Arka plan\'dan da yapılabilir.',
    },
    {
      title: 'USB belleği takın',
      html: '<p>Belgelerinizi bir USB belleğe kopyalayacağız. Önce belleği takın:</p><button type="button" class="btn primary usb-btn">💾 USB belleği bilgisayara tak</button>',
      setup: (c) => { document.querySelector('#stepBody .usb-btn').onclick = () => c.d.plugUsb(); },
      check: (c) => c.d.fs.usb,
      on: (ev) => ev.type === 'usb' && ev.on,
      done: 'Dosya Gezgini\'nin solunda <b>USB Bellek (E:)</b> göründü.',
    },
    {
      title: 'Kopyalayın: Ctrl + C, Ctrl + V',
      html: `<ol class="steps"><li>Dosya Gezgini\'nde <b>Belgeler</b>\'e gidin, <b>telefon numaraları.txt</b>\'ye bir kez tıklayın.</li><li>${K('Ctrl', 'C')} ile kopyalayın.</li><li>Soldan <b>USB Bellek (E:)</b>\'e tıklayın, ${K('Ctrl', 'V')} ile yapıştırın.</li></ol>`,
      setup: (c) => { if (!c.d.find('explorer')) c.d.open('explorer', { folder: 'docs' }); },
      hint: 'Sağ tık → Kopyala, sonra USB\'de boş yere sağ tık → Yapıştır da olur.',
      check: (c) => !!c.d.fs.find('usb', 'telefon numaraları.txt'),
      on: (ev, c) => (ev.type === 'file-paste' || ev.type === 'drop' || ev.type === 'fs') && !!c.d.fs.find('usb', 'telefon numaraları.txt'),
      done: 'Dosya USB\'ye kopyalandı. <b>Belgeler</b>\'deki aslı da yerinde duruyor; artık iki kopya var.',
    },
    rehberSoru({
      title: 'Kopyalamak mı, taşımak mı?',
      html: '<p>Fotoğrafları USB belleğe aldınız ve bilgisayardan <b>silinmesini istiyorsunuz</b>. Hangisini kullanırdınız?</p>',
      opts: ['Ctrl + C (kopyala) ve Ctrl + V', 'Ctrl + X (kes) ve Ctrl + V', 'Delete'],
      ok: 1,
      wrong: 'Kopyalarsanız asıl dosya bilgisayarda kalır. Delete ise dosyayı hiçbir yere götürmeden siler.',
      why: 'Doğru: <b>kes + yapıştır</b> dosyayı taşır, aslı oradan kalkar. Önemli dosyalarda önce kopyalayıp USB\'de açılıyor mu bakmak, sonra silmek daha güvenlidir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayardaki günlük işler:</p>' },
  ],
};

export const gunlukWeb = {
  id: 'gunluk-web', icon: '🌐', title: 'Günlük işler: tarayıcıda', minutes: 35, stage: 'desktop',
  desc: 'Tarayıcıda fotoğraf indirmek, yazı kopyalamak, yakınlaştırmak.',
  summary: [
    ['Resme sağ tık → Resmi farklı kaydet', 'Fotoğrafı istediğiniz klasöre kaydeder'],
    ['İndir düğmesi', 'Dosya İndirilenler klasörüne gider'],
    ['Yazıyı seç → Ctrl + C', 'Sayfadaki yazıyı kopyalar; Not Defteri\'nde Ctrl + V'],
    ['Ctrl + Shift + S / ✂', 'Web yakalama: yalnızca sayfanın resmi'],
    ['Ctrl + / Ctrl − / Ctrl + 0', 'Sayfayı büyüt / küçült / eski haline getir'],
    ['☆ / Ctrl + D', 'Sayfayı sık kullanılanlara ekler'],
  ],
  steps: [
    {
      title: 'Bu derste',
      html: `<p>Geçen derste ekran görüntüsü, fotoğraf ve kopyalamayı <b>bilgisayarda</b> yaptık. Tarayıcıda bunların <b>kendine özgü yolları</b> vardır:</p>
        <table class="sum"><tr><th></th><th>Bilgisayarda</th><th>Tarayıcıda</th></tr><tr><td>Ekran resmi</td><td>PrtSc: bütün ekran</td><td>✂ Web yakalama: yalnızca sayfa</td></tr><tr><td>Fotoğraf</td><td>Dosya Gezgini</td><td>Sağ tık → Resmi farklı kaydet</td></tr><tr><td>Kopyalama</td><td>Dosyayı kopyalar</td><td>Seçili yazıyı kopyalar</td></tr></table>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); br(c); },
    },
    {
      title: 'Fotoğraf sitesini bulun',
      html: '<p>Tarayıcıda <b>ücretsiz manzara fotoğrafı</b> diye aratın ve <b>Ücretsiz Fotoğraflar</b> sitesini açın.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.host === PHOTO_SITE,
      hint: 'Sonuçlarda “Reklam” yazanı atlayın; adresin ucretsiz-fotograflar.com.tr olduğuna bakın.',
      done: 'Bu sitedeki fotoğraflar ücretsizdir. Her sitedeki fotoğrafı izinsiz kullanmak doğru değildir; “ücretsiz” ya da “telifsiz” yazan sitelerden indirin.',
    },
    {
      title: 'Sağ tık: Resmi farklı kaydet',
      html: '<p><b>Deniz manzarası</b> fotoğrafının üzerine <b>sağ tıklayın</b>, <b>💾 Resmi farklı kaydet</b>\'i seçin. Açılan pencerede soldan <b>Resimler</b>\'e tıklayıp <b>Kaydet</b>.</p>',
      mouse: '🖱 Fotoğrafa sağ tık',
      setup: (c) => { if (!c.d.find('browser')) br(c, PHOTO_SITE); },
      hint: 'Kaydet penceresi önce İndirilenler klasörünü gösterir; Resimler\'e geçmeyi unutmayın.',
      on: (ev, c) => {
        if (ev.type !== 'web-img-save') return false;
        if (ev.folder !== 'pictures') { c.note(`Resim <b>${c.d.fs.label(ev.folder)}</b> klasörüne kaydedildi. Bu adım için <b>Resimler</b> klasörüne kaydedin.`); return false; }
        return true;
      },
      done: 'Fotoğraf Resimler klasörüne kaydedildi. Sağ tıkla kaydetmenin artısı: <b>nereye</b> ve <b>hangi adla</b> kaydedileceğini siz seçersiniz.',
    },
    {
      title: 'İndir düğmesi',
      html: '<p>Şimdi <b>Kapadokya balonları</b> fotoğrafının altındaki <b>⬇ İndir</b> düğmesine tıklayın.</p>',
      on: (ev) => ev.type === 'download' && /kapadokya/i.test(ev.name),
      done: 'İndir düğmesiyle inen dosyalar soru sorulmadan <b>İndirilenler</b> klasörüne gider. Sağ üstteki ⬇ düğmesi son indirilenleri gösterir.',
    },
    {
      title: 'İndirileni arka plan yapın',
      html: '<p>İndirme bitince sağ üstte <b>İndirilenler</b> kutusu açıldı (kapandıysa <b>⬇</b> düğmesine tıklayın). Oradaki <b>Klasörde göster</b>\'e tıklayın. <b>kapadokya.jpg</b>\'ye sağ tıklayıp <b>Masaüstü arka planı olarak ayarla</b>\'yı seçin.</p>',
      mouse: '🖱 Klasörde göster → sağ tık',
      hint: 'İnternetten inen her şey İndirilenler klasöründedir. Dosya Gezgini\'nin solunda da İndirilenler vardır.',
      on: (ev) => ev.type === 'wallpaper' && /kapadokya/i.test(ev.name),
      done: 'İnternetten indirdiğiniz fotoğraf masaüstünüzde. Yol: <b>indir → İndirilenler → sağ tık → arka plan</b>.',
    },
    {
      title: 'Sayfadan yazı kopyalayın',
      html: `<ol class="steps"><li>Tarayıcıda adres çubuğuna <b>lezzetli-tarifler.com.tr/mercimek</b> yazıp gidin.</li><li>Tarifin yazısını fareyle sürükleyerek seçin, ${K('Ctrl', 'C')}.</li><li>Not Defteri\'ni açıp ${K('Ctrl', 'V')} ile yapıştırın.</li></ol>`,
      setup: (c) => { const w = c.d.find('browser'); if (w) c.d.focus(w); },
      hint: 'Seçili yazıya sağ tıklayıp “Kopyala” da diyebilirsiniz. Tarayıcıda Ctrl + C dosyayı değil, seçili yazıyı kopyalar.',
      on: (ev, c) => {
        if (ev.type === 'web-copy' && ev.text.trim()) c.note('Kopyalandı! Şimdi Not Defteri\'ni açıp Ctrl + V.');
        return ev.type === 'input' && ev.inputType === 'insertFromPaste' && /mercimek|soğan|havuç/i.test(ev.value || '');
      },
      done: 'Tarifi bilgisayarınıza aldınız. Uzun bir yazıyı elle yazmak yerine kopyalamak hem hızlı hem hatasızdır.',
    },
    {
      title: 'Web yakalama',
      html: `<p>Tarayıcıya dönün. Sayfanın resmini almak için tarayıcının kendi aracı: sağ üstteki <b>✂</b> düğmesi ya da ${K('Ctrl', 'Shift', 'S')}.</p>`,
      combo: ['Ctrl', 'Shift', 'KeyS'],
      setup: (c) => { const w = c.d.find('browser'); if (w) c.d.focus(w); },
      on: (ev) => ev.type === 'web-capture',
      done: 'PrtSc bütün ekranı alırdı; web yakalama <b>yalnızca sayfayı</b> alır, görev çubuğu ve diğer pencereler girmez.',
    },
    {
      title: 'Yazıları büyütün',
      html: `<p>Yazılar küçük geliyorsa: ${K('Ctrl')} basılıyken ${K('+')} tuşuna iki kez basın (ya da Ctrl basılıyken fare tekerleğini ileri çevirin). Sonra ${K('Ctrl', '0')} ile eski haline getirin.</p>`,
      hint: 'Sağdaki sayı tuşlarındaki + da olur. Adres çubuğunda büyütme oranı görünür; ona tıklamak da sıfırlar.',
      on: (ev, c) => {
        if (ev.type !== 'web-zoom') return false;
        if (ev.zoom > 100) c.s.big = true;
        if (ev.zoom > 100) c.note(`Şimdi %${ev.zoom}. Ctrl + 0 ile eski haline getirin.`);
        return c.s.big && ev.zoom === 100;
      },
      done: 'Büyütme yalnızca sayfayı etkiler; bilgisayarın diğer yazıları değişmez. Bilgisayardaki bütün yazılar için Ayarlar → Yazı boyutu kullanılır.',
    },
    {
      title: 'Sık kullanılanlara ekleyin',
      html: `<p>Sık girdiğiniz sayfayı kaydedin: adres çubuğunun sağındaki <b>☆</b> yıldıza tıklayın ya da ${K('Ctrl', 'D')}.</p>`,
      combo: ['Ctrl', 'KeyD'],
      on: (ev) => ev.type === 'web-bookmark' && !ev.removed,
      done: 'Sayfa, adres çubuğunun altındaki <b>sık kullanılanlar çubuğuna</b> eklendi. Bir dahaki sefere adres yazmadan tek tıkla açılır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarayıcıdaki günlük işler:</p>' },
  ],
};
