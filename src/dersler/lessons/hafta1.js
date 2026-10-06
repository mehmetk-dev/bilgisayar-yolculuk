// 1. hafta: bilgisayarı açıp kapatma ve fare
import { K, maxed, desktopReady, put, PIC } from './common.js';

const MOUSE_SVG = `<svg class="mouse-svg" viewBox="0 0 160 220" role="img" aria-label="Fare: sol tuş, sağ tuş ve tekerlek">
  <path d="M80 10 C35 10 18 45 18 90 L18 150 C18 190 45 212 80 212 C115 212 142 190 142 150 L142 90 C142 45 125 10 80 10 Z" fill="#f4f6f9" stroke="#556" stroke-width="4"/>
  <path d="M80 10 L80 95 M18 95 L142 95" stroke="#556" stroke-width="3"/>
  <path d="M22 92 L22 80 C22 45 40 14 78 12 L78 92 Z" fill="#cfe3ff"/>
  <rect x="72" y="35" width="16" height="34" rx="8" fill="#333"/>
  <text x="46" y="70" font-size="13" text-anchor="middle" fill="#0a3d7a" font-weight="700">SOL</text>
  <text x="114" y="70" font-size="13" text-anchor="middle" fill="#556" font-weight="700">SAĞ</text>
</svg>`;

// Ekranın dört köşesine fare götürme alıştırması için köşe işaretleri
function cornerGame(c) {
  const scr = c.d.screen;
  const marks = ['tl', 'tr', 'br', 'bl'].map((k) => {
    const m = document.createElement('div');
    m.className = 'corner-mark ' + k;
    m.textContent = { tl: '↖', tr: '↗', br: '↘', bl: '↙' }[k];
    scr.append(m);
    return m;
  });
  const hit = new Set();
  const move = (e) => {
    const r = scr.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const k = x < 0.15 && y < 0.18 ? 'tl' : x > 0.85 && y < 0.18 ? 'tr' : x > 0.85 && y > 0.75 ? 'br' : x < 0.15 && y > 0.75 ? 'bl' : null;
    if (!k || hit.has(k)) return;
    hit.add(k);
    marks.find((m) => m.classList.contains(k)).classList.add('ok');
    c.emit('corner', { n: hit.size });
  };
  scr.addEventListener('pointermove', move);
  c.s.cleanup = () => { scr.removeEventListener('pointermove', move); marks.forEach((m) => m.remove()); };
}

export const ackapa = {
  id: 'ackapa', icon: '⏻', title: 'Bilgisayarı açma ve kapatma', minutes: 15, stage: 'desktop',
  desc: 'Kasa ve ekran, güç düğmesi, oturum açma; Uyku, Kapat ve Yeniden başlat farkı.',
  desktop: { power: 'off' },
  summary: [
    ['Kasadaki ⏻ düğmesi', 'Bilgisayarı açar (bir kez basılır, basılı tutulmaz)'],
    ['Ekranın düğmesi', 'Yalnızca ekranı açar/kapatır'],
    ['Başlat ⊞ → ⏻ → Uyku', 'Kısa aralar için: her şey yerinde kalır'],
    ['Başlat ⊞ → ⏻ → Kapat', 'Gün sonunda'],
    ['Başlat ⊞ → ⏻ → Yeniden başlat', 'Bilgisayar yavaşladığında ya da tuhaflaştığında'],
    ['Fişten çekmek', 'Asla! Önce “Kapat”, ışık sönünce fiş'],
  ],
  steps: [
    {
      title: 'Bilgisayarın parçaları',
      html: `<p>Masaüstü bir bilgisayar dört parçadan oluşur:</p>
        <ul class="big-list"><li>🗄 <b>Kasa</b>: asıl bilgisayar budur. Bütün işi o yapar.</li><li>🖥 <b>Ekran</b> (monitör): kasanın yaptığını gösterir.</li><li>⌨ <b>Klavye</b>: yazı yazarız.</li><li>🖱 <b>Fare</b>: ekrandaki oku hareket ettirir, tıklarız.</li></ul>
        <p>Dizüstü bilgisayarda (laptop) bunların hepsi tek parçadır.</p>
        <p class="mut">Kasanın içini görmek isterseniz: <a href="bilgisayar.html">Bilgisayarın İçine Yolculuk (3B)</a></p>`,
    },
    {
      title: 'Bilgisayarı açın',
      html: `<p>Yandaki resimde bir ekran ve bir kasa var. Bilgisayarı açmak için <b>kasanın üzerindeki ⏻ düğmesine bir kez</b> basın (fareyle tıklayın).</p>
        <p class="mut">Gerçekte bu düğmeye bir kez basılır; basılı tutulmaz. Basılı tutmak, donmuş bir bilgisayarı zorla kapatır.</p>`,
      mouse: '🖱 Kasadaki ⏻ düğmesine tıklayın',
      setup: (c) => { if (!['off'].includes(c.d.power)) c.d.setPower('off', true); },
      on: (ev, c) => {
        if (ev.type === 'monitor-button') c.note('O, ekranın düğmesiydi. Bilgisayarı açan düğme <b>kasanın</b> üzerindedir.');
        return ev.type === 'power-button';
      },
      done: 'Bilgisayar açılıyor. Biraz bekleyin; açılış birkaç saniye sürer.',
    },
    {
      title: 'Kilit ekranı',
      html: `<p>Ekranda büyük bir <b>saat</b> ve <b>tarih</b> göründü. Buna <b>kilit ekranı</b> denir.</p><p>Ekrana bir kez tıklayın ya da klavyede herhangi bir tuşa basın.</p>`,
      mouse: '🖱 Ekrana tıklayın',
      setup: (c) => { if (c.d.power === 'off') c.d.setPower('lock', true); },
      check: (c) => ['login', 'welcome', 'desktop'].includes(c.d.power),
      on: (ev) => ev.type === 'power' && ev.state === 'login',
      done: 'Şifre ekranı geldi.',
    },
    {
      title: 'Şifrenizi yazın',
      html: `<p>Bilgisayarı başkası kullanmasın diye bir şifre vardır. Alıştırma şifresi: <b>1234</b></p>
        <ol class="steps"><li>Şifre kutusuna <b>1234</b> yazın.</li><li>${K('Enter')} tuşuna basın (ya da ➜ okuna tıklayın).</li></ol>
        <p class="mut">Şifre yazılırken harfler yerine nokta (●) görünür; yanınızdakiler görmesin diye. 👁 düğmesi yazdığınızı gösterir.</p>`,
      combo: ['Enter'],
      setup: (c) => { if (['off', 'boot', 'lock'].includes(c.d.power)) c.d.setPower('login', true); },
      check: (c) => c.d.power === 'desktop',
      on: (ev, c) => {
        if (ev.type === 'login' && !ev.ok) c.warn('Şifre yanlış yazıldı. Kutuya yeniden <b>1234</b> yazıp Enter\'a basın.');
        return ev.type === 'power' && ev.state === 'desktop';
      },
      done: 'Bilgisayar açıldı! Karşınızdaki ekrana <b>masaüstü</b> denir.',
    },
    {
      title: 'Başlat menüsünü açın',
      html: `<p>Ekranın altındaki çubuğa <b>görev çubuğu</b> denir. Ortasındaki dört kareli simge <b>Başlat</b> düğmesidir.</p><p>Başlat düğmesine bir kez tıklayın.</p>`,
      mouse: '🖱 Görev çubuğundaki ⊞ Başlat\'a tıklayın',
      setup: desktopReady,
      check: (c) => !c.d.startEl.hidden,
      on: (ev) => ev.type === 'start' && ev.open,
      done: 'Başlat menüsü açıldı. Bütün programlar buradadır.',
    },
    {
      title: 'Güç düğmesi',
      html: `<p>Başlat menüsünün <b>sağ alt köşesinde</b> ⏻ işareti var. Ona tıklayın.</p><p class="mut">Menü kapandıysa önce yine Başlat'a tıklayın.</p>`,
      mouse: '🖱 Başlat menüsünde ⏻\'a tıklayın',
      setup: desktopReady,
      on: (ev) => ev.type === 'power-menu',
      done: 'Üç seçenek çıktı: <b>Uyku</b>, <b>Kapat</b>, <b>Yeniden başlat</b>.',
    },
    {
      title: 'Üç seçenek ne demek?',
      html: `<table class="sum"><tr><th>🌙 Uyku</th><td>Bilgisayar dinlenir. Açık programlar yerinde kalır. Fareyi oynatınca hemen uyanır. <b>Kısa aralar</b> için.</td></tr>
        <tr><th>⏻ Kapat</th><td>Bilgisayar tamamen kapanır. <b>Gün sonunda</b> ya da uzun süre kullanmayacaksanız.</td></tr>
        <tr><th>🔄 Yeniden başlat</th><td>Kapanıp hemen yeniden açılır. Bilgisayar <b>yavaşladığında, donduğunda</b> ya da bir güncellemeden sonra.</td></tr></table>
        <p>Şimdi üçünü de sırayla deneyeceğiz.</p>`,
      setup: (c) => c.d.closeMenus(),
    },
    {
      title: 'Uyku',
      html: `<ol class="steps"><li>Başlat ⊞ → ⏻ → <b>Uyku</b>'ya tıklayın. Ekran kararacak.</li><li>Sonra <b>fareyi oynatın</b>: bilgisayar uyanır.</li><li>Kilidi açıp şifreyle (1234) yeniden girin.</li></ol>`,
      setup: desktopReady,
      on: (ev, c) => {
        if (ev.type === 'power' && ev.state === 'sleep') { c.s.sleep = true; c.note('Ekran karardı: bilgisayar uyuyor. Şimdi fareyi oynatın.'); }
        if (ev.type === 'wake') c.note('Uyandı! Ekrana tıklayın ve şifrenizi yazın.');
        return !!c.s.sleep && ev.type === 'power' && ev.state === 'desktop';
      },
      done: 'Uyku modu kısa aralar için idealdir: açık olan her şey sizi bekler.',
    },
    {
      title: 'Yeniden başlat',
      html: `<p>Başlat ⊞ → ⏻ → <b>Yeniden başlat</b>'a tıklayın. Bilgisayar kapanıp açılacak; sonra şifrenizle girin.</p>`,
      setup: desktopReady,
      on: (ev, c) => {
        if (ev.type === 'power' && ev.state === 'restart') c.s.r = true;
        if (ev.type === 'power' && ev.state === 'sleep') c.note('Bu “Uyku” oldu. Bu sefer <b>Yeniden başlat</b>\'ı seçin.');
        return !!c.s.r && ev.type === 'power' && ev.state === 'desktop';
      },
      done: 'Bir şeyler ters gittiğinde ilk yapılacak şey çoğu zaman <b>yeniden başlatmaktır</b>.',
    },
    {
      title: 'Kapat',
      html: `<p>Başlat ⊞ → ⏻ → <b>Kapat</b>'a tıklayın. Bilgisayar kendini kapatacak.</p>`,
      setup: desktopReady,
      on: (ev) => ev.type === 'power' && ev.state === 'off',
      done: 'Bilgisayar kapandı.',
    },
    {
      title: 'Neden fişten çekilmez?',
      html: `<p>Bilgisayar kapanırken açık dosyaları kaydeder, işlerini toparlar. Fişi çekerseniz:</p>
        <ul><li>Kaydedilmemiş yazılarınız <b>kaybolur</b>.</li><li>Güncelleme yarım kalırsa bilgisayar <b>bir daha açılmayabilir</b>.</li><li>Disk zarar görebilir.</li></ul>
        <div class="box"><b>Bilgisayar tamamen donduysa?</b> Fare de klavye de çalışmıyorsa, kasadaki ⏻ düğmesini <b>5–10 saniye basılı tutun</b>. Bu son çaredir.</div>`,
    },
    {
      title: 'Şimdi gerçek bilgisayarınızda',
      html: `<p>Kendi bilgisayarınızda deneyin:</p><ol class="steps"><li>Bilgisayarı <b>açın</b> ve şifrenizle girin.</li><li>Başlat → ⏻ → <b>Kapat</b>.</li><li>Bunu 2–3 kez tekrarlayın. Bir kez de <b>Yeniden başlat</b> deneyin.</li></ol><p>Bitince aşağıdaki düğmeye basın.</p>`,
      manual: '✔ Yaptım',
      done: 'Harika! Artık bilgisayarı güvenle açıp kapatabiliyorsunuz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bu dersi bitirdiniz. Özet:</p>' },
  ],
};

export const fare1 = {
  id: 'fare1', icon: '🖱', title: 'Fareyi tutma ve tek tık', minutes: 15, stage: 'desktop',
  desc: 'Elin fare üzerindeki duruşu, imleci gezdirme, sol tık, hedef oyunu, simge seçme.',
  summary: [
    ['Sol tuş (tek tık)', 'Seçer, düğmelere basar'],
    ['İmleç (ok)', 'Farenin ekrandaki ucu; tıklarken ucunu hedefin içine getirin'],
    ['Boş yere tık', 'Seçimi kaldırır, menüleri kapatır'],
  ],
  steps: [
    {
      title: 'Fareyi nasıl tutarız?',
      html: `<div class="mouse-box">${MOUSE_SVG}<ul class="big-list"><li>Avucunuzu farenin üstüne <b>rahatça</b> koyun.</li><li><b>İşaret parmağınız</b> sol tuşta, <b>orta parmağınız</b> sağ tuşta dursun.</li><li>Bileğinizi masaya dayayın, fareyi masada kaydırın.</li><li>Fare masanın kenarına gelirse <b>kaldırıp ortaya koyun</b>: ekrandaki ok yerinde kalır.</li></ul></div>`,
    },
    {
      title: 'İmleci gezdirin',
      html: `<p>Fareyi masada yavaşça kaydırın; ekrandaki ok da (buna <b>imleç</b> denir) hareket eder.</p><p>İmleci yandaki ekranın <b>dört köşesine</b> sırayla götürün. Köşelerdeki işaretler yeşile döner.</p>`,
      mouse: '🖱 Dört köşeye gidin',
      setup: (c) => { desktopReady(c); c.d.closeAll(); cornerGame(c); },
      leave: (c) => c.s.cleanup?.(),
      on: (ev, c) => { if (ev.type === 'corner') { c.note(`Köşe: ${ev.n} / 4`); return ev.n >= 4; } return false; },
      done: 'Fareyi istediğiniz yere götürebiliyorsunuz.',
    },
    {
      title: 'Hedef oyunu: tek tık',
      html: `<p>Yeşil dairelere <b>sol tuşla bir kez</b> tıklayın. 10 hedef var; daireler gittikçe küçülür.</p><p class="mut">İmlecin <b>ucunu</b> dairenin içine getirin, fareyi oynatmadan tıklayın.</p>`,
      mouse: '🖱 Sol tuşla bir kez',
      setup: (c) => maxed(c, 'hedef', { mode: 'click', total: 10 }),
      leave: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'game-hit' && ev.mode === 'click') c.note(`Vurulan: ${ev.n} / ${ev.total}`);
        return ev.type === 'game-done' && ev.mode === 'click';
      },
      done: (c) => 'On hedefin hepsini vurdunuz! İsterseniz oyunu tekrar oynayabilirsiniz.',
    },
    {
      title: 'Simgeye tek tıklayın',
      html: `<p>Masaüstündeki küçük resimlere <b>simge</b> denir. <b>Geri Dönüşüm Kutusu</b> simgesine <b>bir kez</b> tıklayın.</p><p>Simgenin etrafı açık renkle çevrilir: bu, <b>seçili</b> demektir.</p>`,
      mouse: '🖱 Bir kez tıklayın',
      setup: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'app-open') c.note('Bu bir <b>çift tıklama</b> oldu ve pencere açıldı. Sorun değil; pencereyi sağ üstteki ✕ ile kapatıp <b>tek</b> tıklamayı deneyin.');
        return ev.type === 'icon-select' && ev.id === 'sys:recycle';
      },
      done: 'Simge seçildi.',
    },
    {
      title: 'Başka bir simge seçin',
      html: '<p>Şimdi <b>Hesap Makinesi</b> simgesine bir kez tıklayın. Önceki simgenin seçimi kendiliğinden kalkar.</p>',
      mouse: '🖱 Bir kez tıklayın',
      on: (ev) => ev.type === 'icon-select' && ev.name === 'Hesap Makinesi',
      done: 'Aynı anda bir simge seçili olur.',
    },
    {
      title: 'Seçimi kaldırın',
      html: '<p>Masaüstünde <b>boş bir yere</b> (simge olmayan bir yere) bir kez tıklayın. Seçim kalkar.</p>',
      mouse: '🖱 Boş bir yere tıklayın',
      on: (ev) => ev.type === 'desktop-click' && ev.button === 0,
      done: 'Boş bir yere tıklamak seçimi kaldırır ve açık menüleri kapatır.',
    },
    {
      title: 'Düğmeye tıklamak',
      html: '<p>Görev çubuğundaki <b>⊞ Başlat</b> düğmesine tıklayın: menü açılır. Aynı düğmeye bir kez daha tıklayın: menü kapanır.</p>',
      mouse: '🖱 Başlat\'a iki ayrı kez tıklayın',
      on: (ev, c) => {
        if (ev.type === 'start' && ev.open) { c.s.o = true; c.note('Açıldı. Şimdi kapatmak için yine Başlat\'a tıklayın.'); }
        return !!c.s.o && ev.type === 'start' && !ev.open;
      },
      done: 'Düğmelere tek tıkla basılır.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Fareyi tutmayı ve tek tıklamayı öğrendiniz.</p>' },
  ],
};

export const fare2 = {
  id: 'fare2', icon: '👆', title: 'Çift tık, sağ tık ve tekerlek', minutes: 20, stage: 'desktop',
  desc: 'Çift tıkla açma, sağ tık menüleri, tekerlekle kaydırma; balon oyunu ve Mayın Tarlası.',
  summary: [
    ['Çift tık (tık-tık)', 'Simgeyi, dosyayı, programı açar'],
    ['Sağ tık', '“Bununla neler yapabilirim?” menüsünü açar'],
    ['Tekerlek', 'Uzun sayfaları aşağı/yukarı kaydırır'],
    ['✕', 'Pencereyi kapatır'],
  ],
  steps: [
    {
      title: 'Çift tık nedir?',
      html: `<p>Sol tuşa <b>hızlıca iki kez</b> basmaya <b>çift tık</b> denir: <b>tık-tık</b>.</p><p>Simgeleri, dosyaları ve programları açmak için kullanılır.</p>
        <div class="box"><b>Püf noktası:</b> tıklarken fareyi oynatmayın. Yalnızca parmağınız hareket etsin. İki tıklama arasında beklemeyin.</div>
        <p>Çift tık başta herkesi zorlar; acele etmeyin. Önce balon oyunuyla alıştırma yapalım.</p>`,
    },
    {
      title: 'Balon oyunu: çift tık',
      html: '<p>Balonlara <b>çift tıklayın</b> (tık-tık). Tek tıklarsanız balon patlamaz ve size haber verilir. 6 balon var.</p>',
      mouse: '🖱 Tık-tık',
      setup: (c) => maxed(c, 'hedef', { mode: 'dbl', total: 6 }),
      leave: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'game-hit' && ev.mode === 'dbl') c.note(`Patlayan balon: ${ev.n} / ${ev.total}`);
        return ev.type === 'game-done' && ev.mode === 'dbl';
      },
      done: 'Çift tıklamayı başardınız!',
    },
    {
      title: 'Çift tıklayarak açın',
      html: '<p>Masaüstündeki <b>Not Defteri</b> simgesine <b>çift tıklayın</b>. Not Defteri penceresi açılacak.</p>',
      mouse: '🖱 Simgeye tık-tık',
      setup: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'icon-select' && ev.name === 'Not Defteri') c.s.sel = (c.s.sel || 0) + 1;
        if (c.s.sel >= 3 && ev.type === 'icon-select') c.note('Simge seçiliyor ama açılmıyor: iki tıklamayı <b>daha hızlı</b> yapın. Olmazsa simge seçiliyken <kbd>Enter</kbd> da açar.');
        return ev.type === 'app-open' && ev.app === 'notepad';
      },
      done: 'Program açıldı.',
    },
    {
      title: 'Pencereyi kapatın',
      html: '<p>Açılan pencerenin <b>sağ üst köşesindeki ✕</b> işaretine bir kez tıklayın.</p>',
      mouse: '🖱 ✕\'e tıklayın',
      setup: (c) => c.d.ensure('notepad'),
      on: (ev) => ev.type === 'win-close',
      done: 'Pencere kapandı. ✕ her pencerede aynı yerdedir.',
    },
    {
      title: 'Sağ tık nedir?',
      html: `<p>Farenin <b>sağ tuşu</b>, “bununla neler yapabilirim?” diye sorar: bir <b>menü</b> açılır.</p>
        <ul class="big-list"><li>Menüden bir şey seçmek için <b>sol tuşla</b> tıklarsınız.</li><li>Vazgeçmek için boş bir yere <b>sol tıklayın</b>.</li></ul>`,
    },
    {
      title: 'Simgeye sağ tıklayın',
      html: '<p><b>Paint</b> simgesine <b>sağ tuşla</b> bir kez tıklayın. Açılan menüden <b>Aç</b>\'a <b>sol tuşla</b> tıklayın.</p>',
      mouse: '🖱 Sağ tık → Aç',
      setup: (c) => c.d.closeAll(),
      leave: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'context' && ev.kind === 'icon') c.note('Menü açıldı. Şimdi en üstteki <b>Aç</b>\'a sol tuşla tıklayın.');
        if (ev.type === 'icon-open' && !ev.via) c.note('Bu bir çift tıklama oldu. Bu sefer <b>sağ tuşla</b> tek tıklayın.');
        return ev.type === 'menu-cmd' && ev.kind === 'icon' && ev.cmd === 'open';
      },
      done: 'Sağ tık menüsünde <b>Aç, Kes, Kopyala, Sil, Yeniden adlandır</b> gibi işler vardır.',
    },
    {
      title: 'Masaüstüne sağ tık',
      html: '<p>Masaüstünde <b>boş bir yere sağ tıklayın</b>. Farklı bir menü çıkar (Yeni, Kişiselleştir…). Sonra menüyü kapatmak için boş bir yere <b>sol tıklayın</b>.</p>',
      mouse: '🖱 Boş yere sağ tık, sonra sol tık',
      on: (ev, c) => {
        if (ev.type === 'context' && ev.kind === 'desktop') { c.s.c = true; c.note('Gördünüz mü? Nereye sağ tıklarsanız ona göre bir menü çıkar. Şimdi boş bir yere sol tıklayın.'); }
        return !!c.s.c && ev.type === 'desktop-click' && ev.button === 0;
      },
      done: 'Menü kapandı.',
    },
    {
      title: 'Karışık hedef oyunu',
      html: '<p>Bu sefer iki renk var: <b style="color:#2e7d32">yeşile sol tık</b>, <b style="color:#e65100">turuncuya sağ tık</b>. 10 hedef.</p>',
      mouse: '🖱 Yeşil: sol · Turuncu: sağ',
      setup: (c) => maxed(c, 'hedef', { mode: 'mixed', total: 10 }),
      leave: (c) => c.d.closeAll(),
      on: (ev, c) => {
        if (ev.type === 'game-hit') c.note(`Vurulan: ${ev.n} / ${ev.total}`);
        return ev.type === 'game-done' && ev.mode === 'mixed';
      },
      done: 'Sol ve sağ tuşu ayırt edebiliyorsunuz.',
    },
    {
      title: 'Tekerlek',
      html: `<p>Farenin iki tuşunun arasındaki küçük çarka <b>tekerlek</b> denir.</p><ul class="big-list"><li>Tekerleği <b>kendinize doğru</b> çevirin: sayfa <b>aşağı</b> iner.</li><li>Tekerleği <b>ileri</b> çevirin: sayfa <b>yukarı</b> çıkar.</li></ul>`,
    },
    {
      title: 'Tarifi sonuna kadar kaydırın',
      html: '<p>Yanda uzun bir yemek tarifi açıldı. Fareyi sayfanın üzerine getirip <b>tekerlekle aşağı</b> kaydırın. Sayfanın en altında gizli bir kelime var!</p>',
      mouse: '🖱 Tekerleği kendinize doğru çevirin',
      setup: (c) => maxed(c, 'browser', { url: 'www.lezzetli-tarifler.com.tr/borek' }),
      on: (ev) => ev.type === 'web-scroll' && ev.atBottom && ev.path === '/borek',
      done: 'Gizli kelime: <b>AFİYET</b>! Yukarı çıkmak için tekerleği ileri çevirin.',
    },
    {
      title: 'Bonus: Mayın Tarlası',
      html: `<p>Sol ve sağ tık için harika bir oyun:</p><ul class="big-list"><li><b>Sol tık</b>: kareyi açar. Sayılar, çevredeki mayın sayısını söyler.</li><li><b>Sağ tık</b>: mayın olduğunu düşündüğünüz kareye 🚩 bayrak koyar.</li></ul><p>Hem açın hem de en az bir bayrak koyun. Mayına basarsanız gülen yüze tıklayıp yeniden başlayın.</p>`,
      mouse: '🖱 Sol: aç · Sağ: bayrak',
      setup: (c) => { c.d.closeAll(); c.d.open('mayin'); },
      on: (ev, c) => {
        if (ev.type === 'mine-flag' && ev.on) c.s.f = true;
        if (['mine-reveal', 'mine-lose', 'mine-win'].includes(ev.type)) c.s.r = true;
        if (ev.type === 'mine-lose') c.note('Mayına bastınız; olur böyle şeyler! 🙂 yüzüne tıklayıp yeniden deneyin.');
        if (c.s.f && !c.s.r) c.note('Bayrak koydunuz. Şimdi sol tıkla birkaç kare açın.');
        if (c.s.r && !c.s.f) c.note('Kare açtınız. Şimdi bir kareye <b>sağ tıklayıp</b> bayrak koyun.');
        return !!(c.s.f && c.s.r);
      },
      done: 'Gerçek bilgisayarda da Başlat\'a “Minesweeper” ya da “Solitaire” yazıp bu oyunları bulabilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Çift tık, sağ tık ve tekerleği öğrendiniz.</p>' },
  ],
};

export const surukle = {
  id: 'surukle', icon: '✋', title: 'Sürükle-bırak', minutes: 15, stage: 'desktop',
  desc: 'Tut, taşı, bırak: simgeleri taşıma, kart dizme oyunu, dosyayı klasöre ve çöpe atma.',
  setup: (c) => {
    put(c, 'desktop', 'Fotoğraflarım', 'folder');
    put(c, 'desktop', 'deniz.jpg', 'file', PIC('🌊', '#81d4fa', '#0277bd'));
    put(c, 'desktop', 'eski not.txt', 'file', 'Bu not artık gereksiz.');
  },
  summary: [
    ['Sürükle-bırak', 'Sol tuşa bas → basılı tut → kaydır → bırak'],
    ['Klasörün üzerine bırakmak', 'Dosyayı klasörün içine taşır'],
    ['Geri Dönüşüm Kutusu\'na bırakmak', 'Dosyayı siler (geri alınabilir)'],
  ],
  steps: [
    {
      title: 'Sürükle-bırak nedir?',
      html: `<p>Bir şeyi tutup başka yere götürmeye <b>sürükle-bırak</b> denir:</p>
        <ol class="steps big"><li>Fareyi nesnenin üzerine getirin.</li><li>Sol tuşa <b>basın ve basılı tutun</b>.</li><li>Parmağınızı kaldırmadan fareyi <b>kaydırın</b>.</li><li>Gideceği yere gelince tuşu <b>bırakın</b>.</li></ol>`,
    },
    {
      title: 'Simgeyi taşıyın',
      html: '<p><b>Hesap Makinesi</b> simgesini tutup masaüstünün <b>sağ tarafına</b> sürükleyin ve bırakın.</p>',
      mouse: '🖱 Bas, tut, kaydır, bırak',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
      on: (ev, c) => {
        if (ev.type === 'icon-move' && ev.name === 'Hesap Makinesi') {
          if ((c.d.iconPos[ev.id]?.c || 0) >= 2) return true;
          c.note('Taşıdınız ama biraz daha <b>sağa</b> götürün.');
        }
        return false;
      },
      done: 'Simgeyi istediğiniz yere taşıyabiliyorsunuz.',
    },
    {
      title: 'Kart dizme oyunu',
      html: '<p>Kartları tutup aşağıdaki yerlerine sürükleyin: <b>A, 2, 3, 4, 5</b>. Yanlış yere bırakırsanız kart geri döner.</p>',
      mouse: '🖱 Kartı tut, yerine bırak',
      setup: (c) => maxed(c, 'kartlar'),
      leave: (c) => c.d.closeAll(),
      on: (ev) => ev.type === 'cards-done',
      done: 'Bütün kartları dizdiniz!',
    },
    {
      title: 'Dosyayı klasöre koyun',
      html: '<p><b>deniz.jpg</b> resmini tutup <b>Fotoğraflarım</b> klasörünün üzerine sürükleyin. Klasör <b>maviye boyanınca</b> bırakın.</p>',
      mouse: '🖱 Resmi klasörün üzerine bırakın',
      setup: (c) => { c.d.closeAll(); put(c, 'desktop', 'Fotoğraflarım', 'folder'); },
      check: (c) => !!c.d.fs.find(c.d.fs.find('desktop', 'Fotoğraflarım')?.id, 'deniz.jpg'),
      on: (ev, c) => {
        if (ev.type === 'drop' && ev.name === 'deniz.jpg') {
          if (ev.toName === 'Fotoğraflarım') return true;
          if (ev.to === 'desktop-move') c.note('Resim taşındı ama klasörün içine girmedi. Klasörün <b>tam üzerine</b> getirin; klasör mavi olunca bırakın.');
        }
        return false;
      },
      done: 'Resim artık klasörün içinde. Masaüstünde görünmüyor.',
    },
    {
      title: 'Klasörü açıp bakın',
      html: '<p><b>Fotoğraflarım</b> klasörüne <b>çift tıklayın</b>. Resim içinde mi?</p>',
      mouse: '🖱 Klasöre çift tık',
      on: (ev, c) => (ev.type === 'app-open' && ev.app === 'explorer') || (ev.type === 'nav' && ev.name === 'Fotoğraflarım'),
      done: 'Evet, resim klasörün içinde! Klasörler, dosyaları düzenli tutmak içindir.',
    },
    {
      title: 'Pencereyi kapatın',
      html: '<p>Klasör penceresini sağ üstteki <b>✕</b> ile kapatın.</p>',
      on: (ev) => ev.type === 'win-close',
      check: (c) => !c.d.wins.length,
    },
    {
      title: 'Çöpe atın',
      html: '<p><b>eski not</b> dosyasını tutup <b>Geri Dönüşüm Kutusu</b>\'nun üzerine sürükleyip bırakın.</p>',
      mouse: '🖱 Dosyayı çöp kutusunun üzerine bırakın',
      setup: (c) => put(c, 'desktop', 'eski not.txt', 'file', 'Bu not artık gereksiz.'),
      on: (ev) => (ev.type === 'drop' && ev.to === 'recycle') || (ev.type === 'delete' && ev.name === 'eski not.txt'),
      done: 'Dosya silindi. Geri Dönüşüm Kutusu\'nun simgesi değişti: içinde artık bir şey var.',
    },
    {
      title: 'Silinen dosya nereye gider?',
      html: `<p>Silinen dosyalar hemen yok olmaz; <b>Geri Dönüşüm Kutusu</b>\'na gider. Yanlışlıkla sildiyseniz oradan geri alabilirsiniz (6. haftada göreceğiz).</p>
        <div class="box"><b>Gerçek bilgisayarda alıştırma:</b> Başlat'a <b>Solitaire</b> yazın. Bu kart oyunu sürükle-bırak için birebirdir.</div>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sürükle-bırakı öğrendiniz.</p>' },
  ],
};

export const pencereler = {
  id: 'pencereler', icon: '🪟', title: 'Pencereler', minutes: 20, stage: 'desktop',
  desc: 'Program açma, küçültme, ekranı kaplama, kapatma, pencereyi sürükleme, görev çubuğundan geri getirme.',
  summary: [
    ['—', 'Simge durumuna küçült: pencere görev çubuğuna iner'],
    ['☐', 'Ekranı kapla (büyüt)'],
    ['❐', 'Önceki boyutuna getir'],
    ['✕', 'Kapat'],
    ['Başlık çubuğu', 'Tutup sürükleyince pencere taşınır'],
    ['Görev çubuğu', 'Açık programlar burada; tıklayınca öne gelir'],
  ],
  steps: [
    {
      title: 'Pencerenin parçaları',
      html: `<div class="win-demo"><div class="wd-bar"><span>🧮 Hesap Makinesi</span><i>—</i><i>☐</i><i class="x">✕</i></div><div class="wd-body">Pencerenin içi</div></div>
        <ul class="big-list"><li><b>Başlık çubuğu</b>: en üstteki şerit. Programın adı yazar.</li><li><b>—</b> küçült · <b>☐</b> ekranı kapla · <b>✕</b> kapat</li><li>Sağ alt köşe: pencereyi büyütüp küçültmek için.</li></ul>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Hesap Makinesi\'ni açın',
      html: '<p>Masaüstündeki <b>Hesap Makinesi</b> simgesine <b>çift tıklayın</b>.</p>',
      mouse: '🖱 Çift tık',
      check: (c) => !!c.d.find('calc'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'calc',
      done: 'Hesap Makinesi açıldı.',
    },
    {
      title: 'Bir hesap yapın',
      html: '<p>Tuşlara tıklayarak hesaplayın: <b>12 + 7 =</b></p><p class="mut">Klavyedeki rakamlarla da yazabilirsiniz. Yanlış yazarsanız <b>C</b> ile silin.</p>',
      setup: (c) => c.d.ensure('calc'),
      on: (ev, c) => {
        if (ev.type === 'calc-result') {
          if (ev.value === 19) return true;
          c.note(`Sonuç ${String(ev.value).replace('.', ',')} çıktı. <b>C</b>'ye basıp 1, 2, +, 7, = sırasıyla deneyin.`);
        }
        return false;
      },
      done: '12 + 7 = 19 ✔',
    },
    {
      title: 'Küçültün',
      html: '<p>Pencerenin sağ üstündeki <b>—</b> düğmesine tıklayın.</p>',
      mouse: '🖱 — düğmesi',
      setup: (c) => c.d.ensure('calc'),
      on: (ev) => ev.type === 'win-min' && ev.app === 'calc',
      done: 'Pencere kayboldu ama <b>kapanmadı</b>! Görev çubuğunda simgesi duruyor; altındaki çizgi “açık” demektir.',
    },
    {
      title: 'Görev çubuğundan geri getirin',
      html: '<p>Alttaki görev çubuğunda <b>🧮</b> simgesine bir kez tıklayın. Pencere geri gelir.</p>',
      mouse: '🖱 Görev çubuğundaki 🧮',
      setup: (c) => { const w = c.d.ensure('calc'); if (!w.min) c.d.minimize(w, true); },
      on: (ev) => ev.type === 'win-restore' && ev.app === 'calc',
      done: 'Küçülttüğünüz pencereler görev çubuğunda sizi bekler.',
    },
    {
      title: 'Ekranı kaplatın',
      html: '<p>Şimdi <b>☐</b> (kare) düğmesine tıklayın. Pencere bütün ekranı kaplar.</p>',
      mouse: '🖱 ☐ düğmesi',
      setup: (c) => c.d.ensure('calc'),
      on: (ev) => ev.type === 'win-max' && ev.app === 'calc',
      done: 'Pencere büyüdü. Kare düğmesinin şekli değişti: ❐',
    },
    {
      title: 'Önceki boyutuna getirin',
      html: '<p>Aynı yerdeki <b>❐</b> düğmesine tıklayın. Pencere eski boyutuna döner.</p>',
      setup: (c) => { const w = c.d.ensure('calc'); if (!w.max) c.d.maximize(w); },
      on: (ev) => ev.type === 'win-unmax' && ev.app === 'calc',
    },
    {
      title: 'Pencereyi taşıyın',
      html: '<p>Pencerenin en üstündeki <b>başlık çubuğundan</b> (Hesap Makinesi yazan yer) tutup <b>sağa</b> doğru sürükleyin.</p>',
      mouse: '🖱 Başlık çubuğunu sürükleyin',
      setup: (c) => { const w = c.d.ensure('calc'); if (w.max) c.d.restoreSize(w); },
      on: (ev, c) => {
        if (ev.type === 'win-move' && ev.app === 'calc') {
          if (Math.abs(ev.dx) > 60 || Math.abs(ev.dy) > 60) return true;
          c.note('Biraz daha uzağa sürükleyin.');
        }
        return false;
      },
      done: 'Pencereleri istediğiniz yere taşıyabilirsiniz.',
    },
    {
      title: 'Boyutunu değiştirin',
      html: '<p>Pencerenin <b>sağ alt köşesindeki</b> çizgili köşeden tutup dışarı doğru sürükleyin. Pencere büyür.</p>',
      mouse: '🖱 Sağ alt köşeyi sürükleyin',
      setup: (c) => { const w = c.d.ensure('calc'); if (w.max) c.d.restoreSize(w); },
      on: (ev) => ev.type === 'win-resize' && (Math.abs(ev.dw) > 30 || Math.abs(ev.dh) > 30),
      done: 'Pencerenin boyutunu kendiniz ayarladınız.',
    },
    {
      title: 'İkinci bir pencere',
      html: '<p>Şimdi <b>Not Defteri</b>\'ni de açın (masaüstünde çift tık). İki pencere üst üste açık olacak.</p>',
      check: (c) => !!c.d.find('notepad'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'notepad',
    },
    {
      title: 'Pencereler arasında geçiş',
      html: '<p>Görev çubuğundaki <b>🧮</b> simgesine tıklayın: Hesap Makinesi öne gelir. Sonra <b>📝</b> simgesine tıklayın: Not Defteri öne gelir.</p>',
      setup: (c) => { c.d.ensure('calc'); c.d.ensure('notepad'); },
      on: (ev, c) => {
        if (ev.type === 'taskbar-click') (c.s.seen ||= new Set()).add(ev.app);
        return c.s.seen?.has('calc') && c.s.seen?.has('notepad');
      },
      done: 'Görev çubuğu, açık programlar arasında geçmenin en kolay yoludur.',
    },
    {
      title: 'Hepsini kapatın',
      html: '<p>İki pencereyi de sağ üstteki <b>✕</b> ile kapatın.</p>',
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
      check: (c) => !c.d.wins.length,
      done: 'Masaüstü tertemiz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Pencereleri yönetmeyi öğrendiniz.</p>' },
  ],
};

// Her adım bir görev; süreler son adımda listelenir (eğitmen kimin nerede takıldığını görür)
export const parkur = {
  id: 'parkur', icon: '🏁', title: 'Fare parkuru', minutes: 15, stage: 'desktop', parkur: true,
  desc: 'Tekrar: 11 görevlik parkur. Her görevin süresi tutulur; sonunda kim nerede takıldı görülür.',
  setup: (c) => put(c, 'desktop', 'çöp.txt', 'file', ''),
  steps: [
    {
      title: 'Fare parkuru',
      html: `<p>Şimdiye kadar öğrendiklerinizi tek tek deneyeceğiz. Her görev için süre tutulacak; acele etmeyin, doğru yapmak önemli.</p><p>Sonunda hangi görevin ne kadar sürdüğünü göreceksiniz.</p>
        <div class="box">Eğitmen notu: parkuru herkes sırayla yapabilir. Son ekrandaki tabloda en uzun süren görev kırmızı görünür.</div>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Hesap Makinesi\'ni açın', html: '<p>Masaüstündeki Hesap Makinesi\'ne çift tıklayın.</p>', on: (ev) => ev.type === 'app-open' && ev.app === 'calc' },
    {
      title: '2. 25 + 17 hesaplayın', html: '<p>Hesap Makinesi\'nde <b>25 + 17 =</b> yapın.</p>',
      setup: (c) => c.d.ensure('calc'),
      on: (ev, c) => { if (ev.type === 'calc-result' && ev.value !== 42) c.warn('Sonuç 42 olmalı. C ile silip tekrar deneyin.'); return ev.type === 'calc-result' && ev.value === 42; },
    },
    { title: '3. Küçültün', html: '<p>Hesap Makinesi\'ni <b>—</b> ile küçültün.</p>', setup: (c) => c.d.ensure('calc'), on: (ev) => ev.type === 'win-min' && ev.app === 'calc' },
    {
      title: '4. Geri getirin', html: '<p>Görev çubuğundan geri getirin.</p>',
      setup: (c) => { const w = c.d.ensure('calc'); if (!w.min) c.d.minimize(w, true); },
      on: (ev) => ev.type === 'win-restore' && ev.app === 'calc',
    },
    { title: '5. Kapatın', html: '<p>Hesap Makinesi\'ni <b>✕</b> ile kapatın.</p>', setup: (c) => c.d.ensure('calc'), on: (ev) => ev.type === 'win-close' && ev.app === 'calc' },
    {
      title: '6. Başlat\'tan Not Defteri', html: '<p><b>Başlat menüsünden</b> Not Defteri\'ni açın (masaüstündeki simgeyi kullanmayın).</p>',
      on: (ev, c) => {
        if (ev.type === 'app-open' && ev.app === 'notepad' && !c.s.start) { c.warn('Açıldı ama masaüstünden. Bu görevde Başlat menüsünü kullanın: pencereyi kapatıp yeniden deneyin.'); }
        if (ev.type === 'start-open' && ev.app === 'notepad') return true;
        return false;
      },
    },
    {
      title: '7. Adınızı yazın', html: `<p>Not Defteri'ne adınızı yazıp ${K('Enter')}'a basın.</p>`,
      setup: (c) => c.d.ensure('notepad'),
      on: (ev) => ev.type === 'input' && ev.app === 'notepad' && ev.inputType === 'insertLineBreak' && ev.value.trim().length >= 2,
    },
    {
      title: '8. Pencereyi taşıyın', html: '<p>Not Defteri penceresini başlık çubuğundan tutup başka bir yere sürükleyin.</p>',
      setup: (c) => c.d.ensure('notepad'),
      on: (ev) => ev.type === 'win-move' && ev.app === 'notepad' && Math.hypot(ev.dx, ev.dy) > 60,
    },
    {
      title: '9. Kaydetmeden kapatın', html: '<p>Not Defteri\'ni <b>✕</b> ile kapatın. “Kaydetmek istiyor musunuz?” sorusuna <b>Kaydetme</b> deyin.</p>',
      setup: (c) => c.d.ensure('notepad'),
      on: (ev) => ev.type === 'win-close' && ev.app === 'notepad',
    },
    {
      title: '10. Çöpe atın', html: '<p>Masaüstündeki <b>çöp.txt</b> dosyasını Geri Dönüşüm Kutusu\'na sürükleyin.</p>',
      setup: (c) => put(c, 'desktop', 'çöp.txt', 'file', ''),
      on: (ev) => (ev.type === 'drop' && ev.to === 'recycle') || (ev.type === 'delete' && ev.name === 'çöp.txt'),
    },
    {
      title: '11. Yeniden başlatın', html: '<p>Bilgisayarı <b>yeniden başlatın</b> ve şifrenizle (1234) girin.</p>',
      setup: desktopReady,
      on: (ev, c) => { if (ev.type === 'power' && ev.state === 'restart') c.s.r = true; return !!c.s.r && ev.type === 'power' && ev.state === 'desktop'; },
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Bütün görevleri tamamladınız.</p>' },
  ],
};
