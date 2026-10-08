// 6. hafta ek dersleri: dosya türleri, fotoğraflar, klasör içinde klasör, Geri Dönüşüm Kutusu, dosya senaryoları
import { K, desktopReady, put, PIC } from './common.js';
import { info, ayir, sec } from './kalip.js';
import { RECYCLE } from '../vfs.js';

const explorerAt = (folder) => (c) => { const w = c.d.ensure('explorer'); if (folder && w.api.folder !== folder) w.api.go(folder); };

export const dosyaTurleri = {
  id: 'dosya-turleri', icon: '🏷', title: 'Dosya türleri ve uzantılar', minutes: 20, stage: 'scene',
  desc: '.txt, .pdf, .docx, .jpg, .mp3, .mp4, .exe, .zip ne demek? Hangi dosya hangi programla açılır? Tehlikeli uzantılar.',
  summary: [
    ['.txt', 'Düz yazı (Not Defteri)'],
    ['.docx', 'Word belgesi'],
    ['.pdf', 'Değiştirilmeyen belge: fatura, dilekçe, e-Devlet çıktısı'],
    ['.jpg / .png', 'Fotoğraf, resim'],
    ['.mp3 / .mp4', 'Müzik / video'],
    ['.zip', 'Sıkıştırılmış paket: içinde birçok dosya'],
    ['.exe', 'Program! Tanımadığınız yerden geldiyse açmayın'],
  ],
  steps: [
    {
      title: 'Dosyanın soyadı: uzantı',
      html: `<p>Her dosyanın adının sonunda, noktadan sonra gelen kısa bir ek vardır: <b>uzantı</b>. Dosyanın türünü söyler.</p>
        <p><b>tatil.jpg</b> → adı <i>tatil</i>, türü <i>jpg</i> (fotoğraf).</p>
        <table class="tbl"><tr><th>.txt .docx .pdf</th><td>Yazı ve belge</td></tr><tr><th>.jpg .png</th><td>Fotoğraf ve resim</td></tr><tr><th>.mp3 .mp4</th><td>Müzik ve video</td></tr><tr><th>.zip</th><td>Sıkıştırılmış paket</td></tr><tr><th>.exe</th><td>Program: çalışır, bilgisayarda değişiklik yapabilir</td></tr></table>`,
      scene: info('<div class="sc-big">📄 🖼 🎵 🎬 📦 ⚙</div><p>ad<b>.uzantı</b></p>'),
    },
    ayir({
      title: 'Türlerine ayırın',
      html: '<p>Dosyaları türlerine göre doğru kutuya sürükleyin.</p>',
      bins: [{ id: 'yazi', label: 'Yazı ve belge', icon: '📄' }, { id: 'resim', label: 'Resim', icon: '🖼' }, { id: 'ses', label: 'Müzik ve video', icon: '🎵' }, { id: 'prog', label: 'Program ve paket', icon: '⚙' }],
      items: [
        { label: 'mektup.txt', icon: '', bin: 'yazi', why: '.txt düz yazıdır.' },
        { label: 'dilekçe.docx', icon: '', bin: 'yazi', why: '.docx Word belgesidir.' },
        { label: 'fatura.pdf', icon: '', bin: 'yazi', why: '.pdf değiştirilmeyen belgedir.' },
        { label: 'tatil.jpg', icon: '', bin: 'resim', why: '.jpg fotoğraftır.' },
        { label: 'ekran.png', icon: '', bin: 'resim', why: '.png resimdir (ekran alıntıları genellikle png olur).' },
        { label: 'türkü.mp3', icon: '', bin: 'ses', why: '.mp3 müziktir.' },
        { label: 'düğün.mp4', icon: '', bin: 'ses', why: '.mp4 videodur.' },
        { label: 'kurulum.exe', icon: '', bin: 'prog', why: '.exe programdır.' },
        { label: 'fotoğraflar.zip', icon: '', bin: 'prog', why: '.zip birçok dosyanın sıkıştırılıp paketlendiği dosyadır.' },
      ],
      done: 'Uzantıya bakarak dosyanın ne olduğunu anlayabilirsiniz.',
    }),
    sec({ title: 'Şüpheli ek', kind: 'mail', from: 'Kargo Bilgi <bilgi@kargo-takip-tr.co>', subject: 'Kargonuz yolda', text: 'Sayın müşterimiz, kargo bilgileriniz ektedir.<br><br>📎 <b>kargo_bilgisi.pdf.exe</b>', q: 'Bu e-postanın ekini açar mısınız?', opts: ['Açarım, PDF yazıyor', 'Açmam: sonu .exe, yani program; PDF gibi görünmeye çalışıyor', 'Önce arkadaşlarıma gönderirim'], ok: 1, why: 'Dosyanın gerçek türü <b>en sondaki</b> uzantıdır: .exe. Virüsler böyle kılık değiştirir. Beklemediğiniz eklerdeki .exe dosyalarını asla açmayın.' }),
    sec({ title: 'Hangi programla?', text: '<div class="qz-pic">📄 fatura.pdf</div>', q: 'fatura.pdf dosyası hangi programla açılır?', opts: ['Hesap Makinesi', 'PDF okuyucu ya da internet tarayıcısı', 'Paint'], ok: 1, why: 'Bilgisayar dosyayı uzantısına bakarak uygun programla kendisi açar; çift tıklamanız yeterlidir.' }),
    sec({ title: 'En büyük dosya', text: '<div class="qz-pic">📄 🖼 🎬</div>', q: 'Bunlardan hangisi genellikle en çok yer kaplar?', opts: ['mektup.txt', 'tatil.jpg', 'düğün videosu.mp4'], ok: 2, why: 'Yazı birkaç KB, fotoğraf birkaç MB, video ise GB\'larca olabilir. Disk dolduğunda önce videolara bakın.' }),
    sec({ title: 'Zip dosyası', text: '<div class="qz-pic">📦 fotoğraflar.zip</div>', q: 'Torununuz “fotoğraflar.zip” gönderdi. Ne yaparsınız?', opts: ['Sağ tık → Tümünü ayıkla ile paketi açıp içindeki fotoğraflara bakarım', 'Silerim, açılmaz', 'Adını .jpg yaparım'], ok: 0, why: 'Zip, birçok dosyayı tek pakette gönderir. Ayıklayınca aynı adlı bir klasör oluşur, fotoğraflar içindedir.' }),
    sec({ title: 'Uzantıyı değiştirmek', text: '<div class="qz-pic">mektup.txt ➜ mektup.jpg</div>', q: 'Bir dosyanın adını değiştirirken uzantısını da değiştirirseniz ne olur?', opts: ['Dosya fotoğrafa dönüşür', 'Dosya açılmayabilir; uzantıya dokunmayın', 'Dosya küçülür'], ok: 1, why: 'Uzantı türü değiştirmez, yalnızca bilgisayarı şaşırtır. F2 ile ad değiştirirken yalnızca noktadan önceki kısmı değiştirin.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosya türlerini tanıyorsunuz:</p>', scene: info('<div class="sc-big">🏷✔</div>') },
  ],
};

export const fotograflar = {
  id: 'fotograflar', icon: '🖼', title: 'Fotoğraflarla çalışmak', minutes: 25, stage: 'desktop',
  desc: 'Resimler klasörü, fotoğraf açma, sonraki/önceki, yakınlaştırma, arka plan yapma, Albüm klasörü oluşturup fotoğraf kopyalama, ad verme.',
  setup: (c) => {
    put(c, 'pictures', 'torunum.jpg', 'file', PIC('👶', '#ffe0b2', '#f8bbd0'));
    put(c, 'pictures', 'bahçe.jpg', 'file', PIC('🌷', '#c8e6c9', '#fff59d'));
  },
  summary: [
    ['🖼 Resimler', 'Fotoğrafların durduğu klasör'],
    ['Çift tık', 'Fotoğrafı Fotoğraflar uygulamasında açar'],
    ['◀ ▶', 'Önceki / sonraki fotoğraf'],
    ['＋ / －', 'Yakınlaştır / uzaklaştır'],
    ['Sağ tık → Arka plan olarak ayarla', 'Masaüstü resmi yapar'],
    ['Ctrl + C → Ctrl + V', 'Fotoğrafı albüme kopyalar'],
  ],
  steps: [
    {
      title: 'Fotoğraflar nerede?',
      html: '<p>Telefondan aktardığınız ya da indirdiğiniz fotoğraflar genellikle <b>🖼 Resimler</b> klasöründe durur. Bu derste fotoğraflara bakıp onları düzenleyeceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Resimler klasörü',
      html: '<p>📁 Dosya Gezgini\'ni açın ve soldan <b>🖼 Resimler</b>\'e gidin.</p>',
      check: (c) => c.d.find('explorer')?.api.folder === 'pictures',
      on: (ev) => ev.type === 'nav' && ev.folder === 'pictures',
    },
    {
      title: 'Bir fotoğraf açın',
      html: '<p><b>torunum</b> fotoğrafına çift tıklayın.</p>',
      setup: explorerAt('pictures'),
      on: (ev) => (ev.type === 'app-open' && ev.app === 'photos') || ev.type === 'photo-open',
      done: 'Fotoğraf, Fotoğraflar uygulamasında açıldı.',
    },
    {
      title: 'Sonraki fotoğraf',
      html: '<p>Pencerenin altındaki <b>▶</b> düğmesiyle sonraki fotoğraflara geçin. Hepsine bakın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'photo-open') return false;
        c.s.n = (c.s.n || 0) + 1;
        c.note(`Bakılan fotoğraf: ${c.s.n}`);
        return c.s.n >= 3;
      },
    },
    {
      title: 'Yakınlaştırın',
      html: '<p>Fotoğrafı <b>＋</b> düğmesiyle büyütün, sonra <b>－</b> ile eski haline getirin.</p>',
      on: (ev, c) => {
        if (ev.type !== 'photo-zoom') return false;
        if (ev.zoom > 1) c.s.big = true;
        return !!c.s.big && ev.zoom <= 1;
      },
      done: 'Küçük ayrıntıları görmek için yakınlaştırmak işe yarar.',
    },
    {
      title: 'Arka plan yapın',
      html: '<p>Beğendiğiniz fotoğrafı <b>masaüstü arka planı</b> yapın: Fotoğraflar penceresindeki <b>🖼 Arka plan yap</b> düğmesi ya da Dosya Gezgini\'nde fotoğrafa sağ tık → <b>Masaüstü arka planı olarak ayarla</b>.</p>',
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Masaüstünüzde artık kendi fotoğrafınız var.',
    },
    {
      title: 'Albüm klasörü',
      html: '<p>Fotoğraflar penceresini kapatın. Dosya Gezgini\'nde Resimler\'in içinde <b>Albüm</b> adında yeni bir klasör oluşturun.</p>',
      setup: explorerAt('pictures'),
      check: (c) => !!c.d.fs.find('pictures', 'Albüm'),
      on: (ev, c) => ev.type === 'rename' && !!c.d.fs.find('pictures', 'Albüm'),
    },
    {
      title: 'Albüme kopyalayın',
      html: `<p><b>torunum</b> ve <b>bahçe</b> fotoğraflarını Albüm klasörüne <b>kopyalayın</b>: fotoğrafı seçip ${K('Ctrl', 'C')}, Albüm'ü açıp ${K('Ctrl', 'V')}. Asılları Resimler'de kalsın.</p>`,
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type !== 'fs') return false;
        const a = c.d.fs.find('pictures', 'Albüm');
        if (!a) return false;
        const inA = ['torunum.jpg', 'bahçe.jpg'].filter((f) => c.d.fs.find(a.id, f));
        const kept = ['torunum.jpg', 'bahçe.jpg'].filter((f) => c.d.fs.find('pictures', f));
        if (inA.length && kept.length < 2) c.warn('Fotoğraf taşındı, kopyalanmadı. Albüm\'deki fotoğrafı Resimler\'e geri sürükleyin ve Kopyala / Yapıştır ile yeniden deneyin.');
        else if (inA.length === 1) c.note('Biri tamam, şimdi öbürü.');
        return inA.length === 2 && kept.length === 2;
      },
      done: 'Fotoğrafların bir kopyası albümde, asılları yerinde.',
    },
    {
      title: 'Fotoğrafa ad verin',
      html: `<p>Resimler'deki <b>kedimiz</b> fotoğrafının adını <b>Pamuk</b> yapın.</p>`,
      hint: 'Fotoğrafa bir kez tıklayın, F2, yeni adı yazıp Enter. Sondaki .jpg\'ye dokunmayın.',
      setup: explorerAt('pictures'),
      on: (ev) => ev.type === 'rename' && /pamuk/i.test(ev.name),
      done: 'Fotoğraflara anlamlı adlar vermek, sonra bulmayı kolaylaştırır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Fotoğraflarınızı düzenleyebilirsiniz:</p>' },
  ],
};

const ev_ = (c) => c.d.fs.find('docs', 'Ev');

export const klasorAgaci = {
  id: 'klasor-agaci', icon: '🌳', title: 'Klasör içinde klasör', minutes: 25, stage: 'desktop',
  desc: 'Dolap-çekmece-dosya düzeni: iç içe klasör oluşturma, klasörü klasöre taşıma, adres çubuğunu okuma, geri dönme, iç klasörlerde arama.',
  summary: [
    ['İç içe klasör', 'Dolap → çekmece → dosya gibi'],
    ['Adres çubuğu', 'Belgeler › Ev › Faturalar: neredeyim?'],
    ['Adres çubuğunda bir ada tıklamak', 'O klasöre hemen döner'],
    ['← Geri', 'Bir önceki klasör'],
    ['Ara', 'İçteki bütün klasörlere de bakar'],
  ],
  steps: [
    {
      title: 'Dolap, çekmece, dosya',
      html: '<p>Evde belgeleri nasıl saklarız? <b>Dolabın</b> içinde <b>çekmeceler</b>, çekmecelerin içinde <b>dosyalar</b>. Bilgisayarda da klasörlerin içine klasör koyabiliriz:</p><p><b>Belgeler › Ev › Faturalar 2026 › elektrik.pdf</b></p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); explorerAt('docs')(c); },
    },
    {
      title: 'Ev klasörü',
      html: '<p>Belgeler\'in içinde <b>Ev</b> adında bir klasör oluşturun.</p>',
      setup: explorerAt('docs'),
      check: (c) => !!ev_(c),
      on: (ev, c) => ev.type === 'rename' && !!ev_(c),
    },
    {
      title: 'İçine girin',
      html: '<p><b>Ev</b> klasörüne çift tıklayıp içine girin. Adres çubuğuna bakın.</p>',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.name === 'Ev',
      done: 'Adres çubuğu: Belgeler › Ev. Klasör şimdilik boş.',
    },
    {
      title: 'İçeride iki klasör',
      html: '<p>Ev\'in içinde iki klasör daha oluşturun: <b>Sağlık</b> ve <b>Tapu ve sözleşmeler</b>.</p>',
      setup: explorerAt(),
      on: (ev, c) => {
        if (ev.type !== 'rename' && ev.type !== 'fs') return false;
        const e = ev_(c);
        const kids = e ? c.d.fs.children(e.id).filter((n) => n.type === 'folder').map((n) => n.name) : [];
        const ok = [/sa[gğ]l[iı]k/i, /tapu/i].filter((r) => kids.some((k) => r.test(k))).length;
        if (ok === 1 && ev.type === 'rename') c.note('Biri tamam, şimdi öbürü.');
        return ok === 2;
      },
    },
    {
      title: 'Adres çubuğuyla dönün',
      html: '<p>Adres çubuğunda <b>Belgeler</b> yazısına tıklayarak Belgeler\'e dönün.</p>',
      hint: 'Sol üstteki ← Geri de olur, ama adres çubuğu birkaç klasör birden geri gitmeyi sağlar.',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
    },
    {
      title: 'Klasörü klasöre taşıyın',
      html: '<p>Belgeler\'deki <b>Faturalar</b> klasörünü tutup <b>Ev</b> klasörünün üzerine bırakın. Klasörler de dosyalar gibi taşınır; içindekilerle birlikte.</p>',
      setup: explorerAt('docs'),
      check: (c) => c.d.fs.find(ev_(c)?.id, 'Faturalar'),
      on: (ev, c) => ev.type === 'fs' && !!c.d.fs.find(ev_(c)?.id, 'Faturalar'),
      done: 'Faturalar artık Ev\'in içinde; içindeki faturalar da onunla gitti.',
    },
    {
      title: 'Derine inin',
      html: '<p>Ev\'e, sonra içindeki Faturalar\'a çift tıklayarak inin. Adres çubuğunda ne yazıyor?</p>',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.name === 'Faturalar',
      done: 'Belgeler › Ev › Faturalar: üç kat derindesiniz.',
    },
    {
      title: 'Geri gelin',
      html: '<p>Sol üstteki <b>←</b> ile iki kez geri giderek Belgeler\'e dönün.</p>',
      setup: explorerAt(),
      on: (ev) => ev.type === 'nav' && ev.folder === 'docs',
    },
    {
      title: 'Derindeki dosyayı arayın',
      html: '<p>Belgeler\'deyken Ara kutusuna <b>su faturası</b> yazın. Dosya iki klasör derinde olsa da bulunur mu?</p>',
      setup: explorerAt('docs'),
      on: (ev) => ev.type === 'ex-search' && ev.results.some((n) => /su fatura/i.test(n)),
      done: 'Arama, içteki bütün klasörlere de bakar. Dosyanın yerini unutursanız en üst klasörde arayın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Klasörlerinizi dolap gibi düzenleyebilirsiniz:</p>' },
  ],
};

export const copKutusu = {
  id: 'cop-kutusu', icon: '🗑', title: 'Geri Dönüşüm Kutusu', minutes: 20, stage: 'desktop',
  desc: 'Üç yoldan silmek (sürükleme, Delete, sağ tık), kutuyu açmak, geri yüklemek ve kutuyu boşaltmak.',
  setup: (c) => {
    put(c, 'desktop', 'eski liste.txt', 'file', 'Ekmek');
    put(c, 'desktop', 'deneme.txt', 'file', 'deneme');
    put(c, 'desktop', 'taslak.txt', 'file', 'taslak');
  },
  summary: [
    ['Sürükle → 🗑', 'Silmenin fareyle yolu'],
    ['Delete', 'Seçili dosyayı siler'],
    ['Sağ tık → Sil', 'Menüyle silmek'],
    ['♻ Geri yükle', 'Dosyayı eski yerine koyar'],
    ['Kutuyu boşalt', 'İçindekiler tamamen silinir: geri gelmez'],
  ],
  steps: [
    {
      title: 'Silinen dosya nereye gider?',
      html: '<p>Bilgisayarda silinen dosya hemen yok olmaz; önce <b>Geri Dönüşüm Kutusu</b>\'na gider. Tıpkı evdeki çöp kutusu gibi: çöpü dökmeden önce yanlışlıkla atılanı geri alabilirsiniz.</p><p>Masaüstünde üç gereksiz dosya var. Üçünü üç farklı yoldan sileceğiz.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. yol: sürükleyin',
      html: '<p><b>eski liste</b> dosyasını tutup masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'nun üzerine bırakın.</p>',
      on: (ev) => ev.type === 'drop' && ev.to === RECYCLE,
    },
    {
      title: '2. yol: Delete',
      html: `<p><b>deneme</b> dosyasına bir kez tıklayın ve ${K('Delete')} tuşuna basın.</p>`,
      combo: ['Delete'],
      on: (ev) => ev.type === 'delete' && /deneme/.test(ev.name),
    },
    {
      title: '3. yol: sağ tık',
      html: '<p><b>taslak</b> dosyasına sağ tıklayın ve menüden <b>Sil</b>\'i seçin.</p>',
      mouse: '🖱 Sağ tık → Sil',
      on: (ev) => ev.type === 'delete' && /taslak/.test(ev.name),
    },
    {
      title: 'Kutuyu açın',
      html: '<p>Masaüstündeki <b>Geri Dönüşüm Kutusu</b>\'na çift tıklayın. Sildiğiniz üç dosya içinde mi?</p>',
      on: (ev) => (ev.type === 'nav' && ev.folder === RECYCLE) || (ev.type === 'app-open' && ev.app === 'explorer' && ev.args?.folder === RECYCLE) || (ev.type === 'icon-open' && /Geri Dönüşüm/.test(ev.name)),
      done: 'Üçü de burada bekliyor.',
    },
    {
      title: 'Geri yükleyin',
      html: '<p>Fikrinizi değiştirdiniz: <b>deneme</b> dosyasını seçip üstteki <b>♻ Geri yükle</b>\'ye tıklayın.</p>',
      setup: explorerAt(RECYCLE),
      on: (ev) => ev.type === 'restore' && /deneme/.test(ev.name),
      done: (c) => `Dosya eski yerine döndü: <b>${c.d.fs.find('desktop', 'deneme.txt') ? 'Masaüstü' : 'eski klasörü'}</b>. Masaüstüne bakın.`,
    },
    {
      title: 'Kutuyu boşaltın',
      html: '<p>Kalan iki dosyaya artık gerek yok. Geri Dönüşüm Kutusu\'nu <b>boşaltın</b>: üstteki <b>🗑 Geri Dönüşüm Kutusunu boşalt</b> düğmesi ya da masaüstündeki kutuya sağ tık → boşalt. Çıkan soruya <b>Evet</b>.</p>',
      setup: explorerAt(RECYCLE),
      on: (ev) => ev.type === 'recycle-empty',
      done: 'Kutu boşaldı. Bu dosyalar artık geri getirilemez.',
    },
    {
      title: 'Bir uyarı',
      html: '<ul class="big-list"><li><b>USB bellekten</b> silinen dosyalar kutuya gitmez, doğrudan silinir.</li><li>Kutuyu boşaltmadan önce içine bir göz atın.</li><li>Gerçekten önemli dosyaların yedeğini (USB bellek ya da bulut) alın.</li></ul>',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Silmeyi ve geri getirmeyi öğrendiniz:</p>' },
  ],
};

export const dosyaSenaryo = {
  id: 'dosya-senaryo', icon: '🤔', title: 'Ne yapardınız? Dosya durumları', minutes: 20, stage: 'scene',
  desc: 'Günlük hayattan dosya durumları: USB\'den fotoğraf almak, dağınık masaüstü, silinen belge, biçimlendirme uyarısı, dolu disk.',
  summary: [
    ['USB\'den almak', 'Kopyalayın; aslı USB\'de kalsın'],
    ['Dağınık masaüstü', 'Klasör açıp içine taşıyın'],
    ['Yedek', 'Önemli dosyaların bir kopyası USB\'de ya da bulutta'],
    ['“Biçimlendirmeniz gerekiyor”', 'Basmayın: her şey silinir'],
    ['Dosya adında olmaz', '\\ / : * ? " < > |'],
    ['Disk dolu', 'İndirilenler\'i ve kutuyu temizleyin, videoları taşıyın'],
  ],
  steps: [
    { title: 'Durumlar', html: '<p>Dosyalarla ilgili günlük hayatta karşılaşacağınız durumlar. Her birinde ne yapardınız?</p>', scene: info('<div class="sc-big">📁🤔</div>') },
    sec({ title: 'Torunun USB\'si', text: '<div class="qz-pic">👧 💾 ➜ 💻</div>', q: 'Torununuz USB bellekte fotoğraflar getirdi; bilgisayarınıza almak istiyorsunuz.', opts: ['USB\'deki fotoğrafları Resimler\'e kopyalarım (sürükleyerek)', 'USB\'yi bilgisayara takılı bırakırım, oradan bakarım', 'Fotoğrafların resmini telefonla çekerim'], ok: 0, why: 'Farklı sürücüden sürüklemek kopyalar; fotoğraflar sizde kalır, torununuzun USB\'si de boşalmaz.' }),
    sec({ title: 'Dağınık masaüstü', text: '<div class="qz-pic">📄📄📄📄📄📄</div>', q: 'Masaüstü dosyalarla doldu, aradığınızı bulamıyorsunuz.', opts: ['Hepsini silerim', '“Faturalar”, “Fotoğraflar” gibi klasörler açıp dosyaları içlerine taşırım', 'Simgeleri küçültürüm'], ok: 1, why: 'Klasörler düzen sağlar. Masaüstünde yalnızca sık kullandıklarınızı bırakın.' }),
    sec({ title: 'Kutu da boşaldı', text: '<div class="qz-pic">📄 ➜ 🗑 ➜ ∅</div>', q: 'Önemli bir belgeyi sildiniz ve Geri Dönüşüm Kutusu\'nu da boşalttınız.', opts: ['Kutuyu tekrar açarsam geri gelir', 'Kendim kurtaramam; yedeğim varsa oradan alırım', 'Bilgisayarı yeniden başlatırsam geri gelir'], ok: 1, why: 'Bu yüzden önemli dosyaların yedeğini almak gerekir. Hemen bilgisayarı az kullanıp bir uzmana danışmak bazen işe yarar.' }),
    sec({ title: 'Kopya dosya', text: '<div class="qz-pic">📄 mektup · 📄 mektup - Kopya</div>', q: 'Klasörde “mektup” ve “mektup - Kopya” diye iki dosya var. Ne olmuş?', opts: ['Virüs bulaşmış', 'Aynı klasörde kopyala-yapıştır yapılmış; gereksizse kopyayı silerim', 'Dosya ikiye bölünmüş'], ok: 1, why: 'Aynı yere yapıştırınca Windows ada “- Kopya” ekler; iki dosya birbirinden bağımsızdır.' }),
    sec({ title: 'Biçimlendirme uyarısı', text: '<div class="qz-pic">💾 ⚠ “Kullanmadan önce biçimlendirmeniz gerekiyor”</div>', q: 'USB belleği takınca bu uyarı çıktı. Ne yaparsınız?', opts: ['Biçimlendir\'e basarım', 'Basmam: biçimlendirmek içindekileri siler; İptal deyip başka bilgisayarda denerim, gerekirse danışırım', 'USB\'yi kırarım'], ok: 1, why: 'Biçimlendirmek diski sıfırlar. İçindeki dosyalar önemliyse önce kurtarmak gerekir.' }),
    sec({ title: 'Dosya adı', text: '<div class="qz-pic">📄 ?</div>', q: 'Hangi dosya adı kabul <b>edilmez</b>?', opts: ['market listesi', 'Ekim-2026 faturası', 'Neden geldin?'], ok: 2, why: 'Dosya adlarında \\ / : * ? " < > | işaretleri kullanılamaz. Tire, boşluk ve Türkçe harfler olur.' }),
    sec({ title: 'Disk dolu', text: '<div class="qz-pic">🗄 ▓▓▓▓▓▓▓▓▓▓ %98</div>', q: 'Bilgisayar “disk alanı az” diyor. İlk ne yaparsınız?', opts: ['İndirilenler\'deki gereksiz dosyaları silip Geri Dönüşüm Kutusu\'nu boşaltırım; büyük videoları USB\'ye taşırım', 'Windows klasörünü silerim', 'Programları rastgele kaldırırım'], ok: 0, why: 'İndirilenler zamanla dolar. Windows\'un kendi klasörlerine dokunmayın.' }),
    sec({ title: 'Dosyayı göndermek', text: '<div class="qz-pic">📎 ❓</div>', q: 'Bir belgeyi e-postaya ekleyeceksiniz ama nereye kaydettiğinizi hatırlamıyorsunuz.', opts: ['Belgeyi yeniden yazarım', 'Dosya Gezgini\'nde adından bir kelimeyle ararım; e-postada “Ekle” deyince de aynı pencere çıkar', 'E-postayı göndermem'], ok: 1, why: 'Dosya ekleme penceresi de bir Dosya Gezgini\'dir: klasörler ve arama kutusu oradadır.' }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Dosya durumlarında ne yapacağınızı biliyorsunuz:</p>', scene: info('<div class="sc-big">📁✔</div>') },
  ],
};
