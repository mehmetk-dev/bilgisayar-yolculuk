// 6. hafta ek dersi: “Az önce kaydettim, nereye gitti?” Kayıp dosyayı bulmanın üç yolu:
// Giriş → Son kullanılan dosyalar (Dosya konumunu aç), bütün bilgisayarda arama, tarihe göre sıralama (Bugün grubu)
// ve tarayıcıda Ctrl + J → Klasörde göster.
import { K, desktopReady, maxed, PIC } from './common.js';
import { rehberSoru } from './kalip.js';

const DAY = 86400e3;
const DILEKCE = 'kira artış dilekçesi.docx';
const ex = (c) => c.d.find('explorer');

function hazirla(c) {
  const fs = c.d.fs, now = Date.now();
  const mk = (parent, name, ago, content, type = 'file') => fs.find(parent, name) || fs.create(parent, { type, name, content, mtime: now - ago }, true);
  mk('docs', 'kira sözleşmesi.pdf', 61 * DAY);
  mk('docs', 'aidat listesi.xlsx', 19 * DAY);
  mk('docs', 'bayram mektubu.docx', 9 * DAY, { html: '<p>Sevgili kardeşim,</p>' });
  mk('docs', 'pilav tarifi.txt', 3 * DAY, 'Pirinç, tereyağı, tuz, su.');
  mk('docs', 'tapu fotokopisi.jpg', 2.5 * 3600e3, PIC('📜', '#fff8e1', '#d7ccc8'));
  const eski = mk('docs', 'Eski işler', 120 * DAY, undefined, 'folder');
  const y = mk(eski.id, '2019', 400 * DAY, undefined, 'folder');
  const yeni = mk(y.id, 'Yeni klasör', 30 * 60e3, undefined, 'folder');
  const dil = mk(yeni.id, DILEKCE, 25 * 60e3, { html: '<p>Sayın Ev Sahibi,</p><p>Kira artış oranı hakkında görüşmek istiyorum.</p>' });
  const dok = mk('downloads', 'SGK hizmet dökümü.pdf', 70 * 60e3, { pages: ['<p class="pdf-org">SOSYAL GÜVENLİK KURUMU</p><h3>Hizmet Dökümü</h3><p>Toplam prim günü: 7.240</p>'] });
  const tarif = fs.find('docs', 'pilav tarifi.txt'), aidat = fs.find('docs', 'aidat listesi.xlsx');
  c.d.recent = [dil.id, tarif.id, aidat.id];
  c.d.dlList = [{ name: dok.name, id: dok.id, when: 'Bugün ' + new Date(now - 70 * 60e3).toTimeString().slice(0, 5) }];
}

export const kayipDosya = {
  id: 'kayip-dosya', icon: '🕵', title: '“Az önce kaydettim, nereye gitti?” Kayıp dosyayı bulmak', minutes: 20, stage: 'desktop',
  desc: 'Son kullanılan dosyalar, bütün bilgisayarda arama, tarihe göre sıralama ve tarayıcıda Ctrl + J.',
  summary: [
    ['📁 → 🏠 Giriş', 'Son açtığınız ve kaydettiğiniz dosyalar en üstte; yanında konumu yazar'],
    ['Sağ tık → Dosya konumunu aç', 'Dosyanın durduğu klasörü açar'],
    ['Bu Bilgisayar → Ara kutusu', 'Adının bir parçasını yazın; bütün klasörlere bakar'],
    ['Sırala: Tarih', 'En yeni en üstte; “Bugün”, “Dün” diye gruplanır'],
    [K('Ctrl', 'J'), 'Tarayıcıda İndirilenler; “Klasörde göster” dosyanın yerini açar'],
    ['Kaydederken', 'Kaydet penceresinin üstündeki klasör adına bakın; emin değilseniz Belgeler\'i seçin'],
  ],
  setup: hazirla,
  steps: [
    {
      title: 'Kaydettim ama nerede?',
      html: `<p>Yarım saat önce Word'de <b>kira artış dilekçesi</b> yazıp kaydettiniz. Şimdi bulamıyorsunuz: ne masaüstünde ne Belgeler'de.</p>
        <p>Paniğe gerek yok; dosya silinmedi, yalnızca <b>başka bir klasöre</b> kaydedildi. Bulmanın üç kolay yolu var.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. yol: Giriş sayfası',
      html: '<p>Görev çubuğundaki <b>📁 Dosya Gezgini</b>\'ni açın. Soldaki listenin en üstündeki <b>🏠 Giriş</b>\'e tıklayın.</p>',
      mouse: '🖱 📁 → 🏠 Giriş',
      hint: 'Dosya Gezgini, görev çubuğunda sarı klasör simgesi. Açılınca sol listede en üstte 🏠 Giriş var.',
      check: (c) => ex(c)?.api.folder === 'home',
      on: (ev) => ev.type === 'nav' && ev.folder === 'home',
      done: '“Son kullanılan dosyalar” listesinin en üstünde dilekçe duruyor. Yanındaki <b>Konum</b> sütunu nerede olduğunu söylüyor.',
    },
    {
      title: 'Dosyanın yerini açın',
      html: `<p><b>${DILEKCE}</b> satırına <b>sağ tıklayın</b> ve <b>📂 Dosya konumunu aç</b>\'ı seçin. Dosyanın durduğu klasör açılır.</p>`,
      mouse: '🖱 Sağ tık → Dosya konumunu aç',
      hint: 'Çift tıklarsanız dosya Word\'de açılır; biz yerini görmek istiyoruz. Sağ tıklayın.',
      setup: (c) => { const w = maxed(c, 'explorer', { folder: 'home' }); if (w.api.folder !== 'home') w.api.go('home'); },
      on: (ev, c) => {
        if (ev.type === 'app-open' && ev.app === 'word') c.note('Dosya Word\'de açıldı; bu da bir yol. Ama yerini görmek için Dosya Gezgini\'nde sağ tıklayıp “Dosya konumunu aç”ı seçin.');
        return ev.type === 'ex-location' && ev.name === DILEKCE;
      },
      done: 'Klasör açıldı; yukarıdaki adres çubuğunda yolu görüyorsunuz.',
    },
    rehberSoru({
      title: 'Nereye kaydolmuş?',
      html: '<p>Yukarıdaki adres çubuğuna bakın. Dilekçe hangi klasördeymiş?</p>',
      opts: ['Masaüstü', 'Belgeler', 'Belgeler › Eski işler › 2019 › Yeni klasör'], ok: 2,
      wrong: 'Pencerenin üstündeki adres çubuğunu soldan sağa okuyun.',
      why: 'Doğru. Word, en son hangi klasöre kaydettiyseniz yine oraya kaydetmeyi önerir. Kaydederken pencerenin üstündeki klasör adına bakmak bu kaybolmayı önler.',
    }),
    {
      title: '2. yol: Bütün bilgisayarda arayın',
      html: `<p>Adının bir parçasını hatırlıyorsanız arayın. Soldan <b>💻 Bu Bilgisayar</b>\'a tıklayın, sağ üstteki <b>Ara</b> kutusuna <b>su fatura</b> yazın.</p>
        <p>Bu Bilgisayar'da arama bütün klasörlere bakar; her sonucun altında bulunduğu klasör yazar.</p>`,
      hint: 'Arama kutusu pencerenin sağ üstünde, adres çubuğunun yanında.',
      on: (ev, c) => {
        if (ev.type !== 'ex-search') return false;
        const ok = ev.results.includes('su faturası.pdf');
        if (!ok && /su/i.test(ev.text) && ex(c)?.api.folder !== 'pc') c.note('Belki yanlış klasörde arıyorsunuz. Önce soldan “Bu Bilgisayar”a tıklayıp öyle arayın.');
        return ok;
      },
      done: '“su faturası.pdf” bulundu; altında <b>Faturalar</b> yazıyor. Sağ tıklayıp “Dosya konumunu aç” ile yine yerine gidebilirsiniz.',
    },
    {
      title: '3. yol: Tarihe göre sıralayın',
      html: `<p>Adını da hatırlamıyorsanız <b>ne zaman</b> kaydettiğinizi hatırlarsınız. Soldan <b>📄 Belgeler</b>\'e gidin. Sağ üstteki <b>Sırala:</b> kutusundan <b>Tarih</b>\'i seçin.</p>
        <p>En yeni dosyalar en üste gelir ve <b>Bugün</b>, <b>Dün</b> diye gruplanır.</p>`,
      hint: 'Önce arama kutusunu temizleyin ya da soldan Belgeler\'e tıklayın. “Sırala:” kutusu komut çubuğunun sağında.',
      on: (ev, c) => ev.type === 'ex-sort' && ev.by === 'date' && ex(c)?.api.folder === 'docs',
      done: 'Belgeler tarihe göre sıralandı; en üstte “Bugün” grubu var.',
    },
    rehberSoru({
      title: 'Bu sabahki belge',
      html: '<p>Bu sabah tarayıcıdan (scanner) bir belge tarattınız. <b>Bugün</b> grubunda hangi dosya var?</p>',
      opts: ['kira sözleşmesi.pdf', 'tapu fotokopisi.jpg', 'pilav tarifi.txt'], ok: 1,
      wrong: 'Bu dosya daha eski bir grupta. “Bugün” başlığının altına bakın.',
      why: 'Doğru: tapu fotokopisi bugün kaydedilmiş. Tarihe göre sıralamak, adını unuttuğunuz dosyayı bulmanın en kolay yoludur.',
    }),
    {
      title: '4. yol: İnternetten indirdikleriniz',
      html: `<p>İnternetten indirdiğiniz belge kaybolduysa tarayıcı da söyler. <b>🌐 İnternet</b>\'i açıp ${K('Ctrl', 'J')}'ye basın (ya da sağ üstteki <b>⋯</b> → <b>⬇ İndirilenler</b>).</p>`,
      combo: ['Ctrl', 'KeyJ'],
      hint: 'Ctrl + J çalışmazsa önce tarayıcı penceresine bir kez tıklayın ya da ⋯ menüsünü kullanın.',
      on: (ev) => ev.type === 'web-menu-cmd' && ev.cmd === 'downloads',
      done: 'İndirilenler listesi açıldı: bugün indirdiğiniz “SGK hizmet dökümü.pdf” orada.',
    },
    {
      title: 'Klasörde gösterin',
      html: '<p>Listede <b>SGK hizmet dökümü.pdf</b>\'nin altındaki <b>Klasörde göster</b>\'e tıklayın.</p>',
      hint: 'Liste kapandıysa yine Ctrl + J.',
      on: (ev) => ev.type === 'download-folder' && /hizmet/.test(ev.name || ''),
      done: 'Dosya Gezgini <b>İndirilenler</b> klasöründe açıldı; dosya seçili duruyor.',
    },
    rehberSoru({
      title: 'Genelde nereye gider?',
      html: '<p>İnternetten indirdiğiniz dosyalar <b>kendiliğinden</b> çoğunlukla hangi klasöre kaydolur?</p>',
      opts: ['İndirilenler', 'Resimler', 'Geri Dönüşüm Kutusu'], ok: 0,
      wrong: 'Tarayıcı indirdiklerini özel bir klasöre koyar. Adı ne?',
      why: 'Doğru: İndirilenler. Bir şey indirdiyseniz ilk bakacağınız yer orası.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Kaybolan dosyayı bulmanın yollarını biliyorsunuz:</p>' },
  ],
};
