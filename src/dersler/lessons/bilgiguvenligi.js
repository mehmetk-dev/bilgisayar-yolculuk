// 15. hafta dersleri (Bilgi güvenliği): yedekleme (USB bellek ve bulut, yedeği denemek, üç kopya, fidye yazılımı
// canlandırması), iki adımlı doğrulama (SMS kodu, yedek kodlar), sosyal medyada güvenlik (gizlilik ayarları, tatil
// paylaşımı, taklit hesap, ele geçirilmiş hesaptan para isteyen mesaj, çekiliş tuzağı).
// Virüs çeşitleri virus.js'de, sahte SMS ve güçlü şifre guvenlik.js'de, sanal kart odeme.js'de anlatılır; burada tekrar edilmez.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { USB } from '../vfs.js';
import { DOST_HOST, DOST_MAIL, DOST_SIFRE } from '../apps/siteler-sosyal.js';

const lower = (s) => String(s || '').toLocaleLowerCase('tr');
const yedek = (c) => c.d.fs.usb && c.d.fs.children(USB).find((n) => n.type === 'folder' && /yedek/i.test(n.name));
// Bir klasörün içindeki (alt klasörler dahil) bütün adlar
const namesIn = (c, id) => { const out = []; const walk = (x) => c.d.fs.children(x).forEach((n) => { out.push(lower(n.name)); if (n.type === 'folder') walk(n.id); }); if (id) walk(id); return out; };
const PICS = ['tatil.jpg', 'çiçekler.jpg', 'kedimiz.jpg', 'torunumun düğünü.mp4'];
const DOCS = ['alışveriş listesi.txt', 'telefon numaraları.txt', 'faturalar'];
const explorerAt = (folder) => (c) => { const w = c.d.ensure('explorer'); if (folder && w.api.folder !== folder) w.api.go(folder); };
const usbBtn = (label = '💾 USB belleği bilgisayara tak') => `<button type="button" class="btn primary usb-btn">${label}</button>`;
const bindUsb = (c) => { const b = document.querySelector('#stepBody .usb-btn'); if (b) b.onclick = () => c.d.plugUsb(); };
// Dostlarım sitesinin durumu (ders içinde ayar vermek için)
const dost = (c) => ((c.d.webState ||= {})['dostlarim.com.tr'] ||= {});

export const yedekleme = {
  id: 'yedekleme', icon: '💾', title: 'Yedekleme: fotoğrafları ve belgeleri kaybetmeyin', minutes: 40, stage: 'desktop',
  desc: 'Fotoğrafları ve belgeleri USB belleğe ve buluta yedeklemek, yedeği açıp denemek; üç kopya kuralı ve fidye yazılımı.',
  summary: [
    ['Yedek', 'Önemli dosyalarınızın başka bir yerdeki kopyası. Bilgisayar bozulsa, çalınsa da dosyalar kurtulur'],
    ['USB belleğe yedek', 'Klasörü açın → ' + K('Ctrl', 'A') + ' → ' + K('Ctrl', 'C') + ' → USB › Yedek → ' + K('Ctrl', 'V')],
    ['Yedeği deneyin', 'Yedekteki bir dosyayı açıp bakın: açılmayan yedek, yedek değildir'],
    ['☁ Bulut Depo → Yükle', 'Dosyanın bir kopyası internette, evin dışında durur'],
    ['Üç kopya', 'Bilgisayarda + USB bellekte + bulutta. En az biri evin dışında olsun'],
    ['Belleği takılı bırakmayın', 'Yedek alınca güvenle çıkarın: fidye yazılımı takılı belleği de kilitler'],
    ['Fidye yazılımı', 'Dosyaları kilitleyip para ister. Ödemeyin; temizletip yedekten geri yükleyin'],
    ['Ne sıklıkla?', 'Ayda bir (çok fotoğraf çekiyorsanız haftada bir). Windows\'ta Dosya Geçmişi bunu kendisi de yapabilir'],
  ],
  steps: [
    {
      title: 'Yedek nedir?',
      html: `<p>Torunlarınızın fotoğrafları, faturalar, dilekçeler… Hepsi yalnızca bilgisayardaysa bir arıza, hırsızlık ya da virüs hepsini götürebilir.</p>
        <p><b>Yedek</b>, önemli dosyalarınızın <b>başka bir yerde duran kopyasıdır</b>. Bugün fotoğraflarınızı ve belgelerinizi önce <b>USB belleğe</b>, sonra <b>buluta</b> yedekleyeceğiz; sonra da yedeğin işe yaradığını göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.fs.plugUsb(false); explorerAt('pictures')(c); },
    },
    {
      title: 'USB belleği takın',
      html: `<p>Önce belleği bilgisayara takın:</p>${usbBtn()}`,
      setup: bindUsb,
      check: (c) => c.d.fs.usb,
      on: (ev) => ev.type === 'usb' && ev.on,
      done: 'Bellek takıldı. Dosya Gezgini\'nin solunda <b>💾 USB Bellek (E:)</b> göründü.',
    },
    {
      title: 'Yedek klasörü',
      html: `<p>Dosya Gezgini'nde soldan <b>💾 USB Bellek (E:)</b>'e tıklayın. Üstteki <b>＋ Yeni klasör</b> ile <b>Yedek</b> adında bir klasör oluşturun.</p>`,
      hint: `Yeni klasörün adı seçili gelir: hemen <b>Yedek</b> yazıp ${K('Enter')}'a basın.`,
      setup: explorerAt(),
      check: (c) => !!yedek(c),
      on: (ev, c) => (ev.type === 'rename' || ev.type === 'fs') && !!yedek(c),
      done: 'USB bellekte <b>Yedek</b> klasörü hazır.',
    },
    {
      title: 'Fotoğrafları kopyalayın',
      html: `<ol class="steps"><li>Soldan <b>🖼 Resimler</b>'e gidin.</li><li>${K('Ctrl', 'A')} ile hepsini seçin, ${K('Ctrl', 'C')} ile kopyalayın.</li><li>USB Bellek › <b>Yedek</b> klasörünü açın ve ${K('Ctrl', 'V')} ile yapıştırın.</li></ol>`,
      hint: 'Kes (Ctrl + X) değil, Kopyala (Ctrl + C) kullanın: asılları bilgisayarda kalmalı. Düğün videosu büyük olduğu için yapıştırmak biraz sürebilir.',
      setup: explorerAt(),
      check: (c) => PICS.every((n) => namesIn(c, yedek(c)?.id).includes(n)),
      on: (ev, c) => {
        if (ev.type !== 'fs' && ev.type !== 'file-paste') return false;
        if (ev.type === 'file-paste' && ev.op === 'cut') c.warn('Dosyaları taşıdınız! Asılları Resimler\'de kalmalıydı. Yedek\'ten Resimler\'e geri kopyalayın; bir dahaki sefere Ctrl + C kullanın.');
        return PICS.every((n) => namesIn(c, yedek(c)?.id).includes(n));
      },
      done: 'Dört dosya da bellekte. Asılları Resimler\'de duruyor: artık iki kopyası var.',
    },
    {
      title: 'Belgeleri de kopyalayın',
      html: `<p>Aynısını <b>📄 Belgeler</b> için yapın: Belgeler'i açın, ${K('Ctrl', 'A')}, ${K('Ctrl', 'C')}, sonra USB › <b>Yedek</b> içinde ${K('Ctrl', 'V')}.</p>`,
      hint: 'Faturalar klasörü de seçilir; klasör, içindeki dosyalarla birlikte kopyalanır.',
      setup: explorerAt(),
      check: (c) => DOCS.every((n) => namesIn(c, yedek(c)?.id).includes(n)),
      on: (ev, c) => (ev.type === 'fs' || ev.type === 'file-paste') && DOCS.every((n) => namesIn(c, yedek(c)?.id).includes(n)),
      done: 'Belgeler ve Faturalar klasörü de yedeklendi.',
    },
    {
      title: 'Yedek açılıyor mu?',
      html: '<p>Yedeği alınca <b>bir dosyasını açıp deneyin</b>. USB › Yedek içindeki <b>kedimiz.jpg</b>\'ye çift tıklayın; fotoğraf açılsın, sonra pencereyi kapatın.</p>',
      hint: 'Çift tıklamada zorlanırsanız dosyaya bir kez tıklayıp Enter\'a basın.',
      setup: explorerAt(),
      on: (ev, c) => ev.type === 'ex-open' && c.d.fs.get(ev.id)?.type === 'file' && c.d.fs.isInside(ev.id, USB),
      done: 'Yedekteki fotoğraf açıldı. <b>Açılmayan yedek, yedek değildir</b>: ara sıra bir iki dosyayı açıp deneyin.',
    },
    {
      title: 'Buluta da yükleyin',
      html: '<p>Şimdi önemli bir belgeyi <b>buluta</b> koyalım. ⊞ Başlat → <b>☁ Bulut Depo</b> → <b>⬆ Yükle</b> → <b>Belgeler</b>\'den <b>telefon numaraları.txt</b>.</p>',
      mouse: '🖱 Başlat → Bulut Depo → Yükle',
      hint: 'Açılan pencerenin solunda Belgeler klasörüne tıklayın, dosyayı seçip Aç\'a basın.',
      on: (ev) => ev.type === 'cloud-upload' && /telefon/i.test(ev.name),
      done: 'Dosya buluta yüklendi. Ev su bassa, bilgisayar ve bellek birlikte kaybolsa bile buluttaki kopya durur.',
    },
    rehberSoru({
      title: 'Üç kopya',
      html: '<p>Uzmanlar önemli dosyalar için “<b>üç kopya</b>” der. Hangisi bu kurala uyar?</p>',
      opts: ['Bilgisayarda iki ayrı klasörde', 'Bilgisayarda + USB bellekte + bulutta (biri evin dışında)', 'Yalnızca bulutta'], ok: 1,
      wrong: 'Aynı bilgisayardaki iki klasör aynı arızada birlikte gider; tek kopya ise hiç yedek demek değildir.',
      why: 'Doğru: asıl dosya bilgisayarda, bir kopya USB bellekte (ya da harici diskte), bir kopya bulutta. Biri bozulsa öbürü kalır; buluttaki evin dışında olduğu için yangın, hırsızlık gibi durumlarda da kurtulur.',
    }),
    {
      title: 'Belleği güvenle çıkarın',
      html: '<p>Yedek bitti. Belleği <b>güvenle çıkarın</b>: Dosya Gezgini\'nde USB\'yi açıp <b>⏏ Çıkar</b>\'a ya da görev çubuğundaki 💾 simgesine tıklayın.</p>',
      hint: 'Bellek takılı kalırsa bilgisayara bulaşan bir zararlı yazılım onu da bozabilir.',
      setup: explorerAt(),
      on: (ev) => ev.type === 'usb' && !ev.on,
      done: 'Bellek çıkarıldı. Yedek belleğini bir çekmecede saklayın; her gün takılı durmasın.',
    },
    {
      title: 'Fidye yazılımı!',
      html: `<p>Şimdi kötü bir günü <b>canlandıralım</b> (gerçek değil, alıştırma). Bir tanıdığınızın gönderdiği “fatura” ekini açtınız; ekte <b>fidye yazılımı</b> vardı.</p>
        <button type="button" class="btn primary fid-btn">▶ Canlandırmayı başlat</button>`,
      setup: (c) => {
        document.querySelector('#stepBody .fid-btn').onclick = async () => {
          for (const n of c.d.fs.children('pictures')) if (n.type === 'file' && !/\.kilitli$/.test(n.name)) { c.d.fs.rename(n.id, n.name + '.kilitli'); n.content = { emoji: '🔒', bg: ['#424242', '#b71c1c'] }; }
          explorerAt('pictures')(c);
          await c.d.dialogs.ask({ title: '⚠ DOSYALARINIZ ŞİFRELENDİ', icon: '🔒', text: '<b>Bütün fotoğraflarınız kilitlendi!</b><br>Açmak için 48 saat içinde 15.000 TL gönderin. Aksi hâlde dosyalarınız silinecek.<br><br><small>(Bu bir alıştırma canlandırmasıdır.)</small>', buttons: [['ok', 'Tamam', true]] });
          c.complete();
        };
      },
      on: () => false,
      done: 'Resimler\'deki dosyaların adı <b>.kilitli</b> oldu, hiçbiri açılmıyor. Fidye yazılımları tam olarak böyle yapar.',
    },
    rehberSoru({
      title: 'Parayı öder misiniz?',
      html: '<p>Ekranda para isteyen bir yazı var. Ne yaparsınız?</p>',
      opts: ['Hemen öderim, fotoğraflar gitmesin', 'Ödemem; bilgisayarı internetten ayırıp temizletirim, dosyaları yedekten geri yüklerim', 'Bilgisayarı atarım'], ok: 1,
      wrong: 'Para ödemek dosyaların geri geleceğini garanti etmez; dolandırıcıyı da cesaretlendirir.',
      why: 'Doğru. Yedeğiniz olduğu için korkmanıza gerek yok. Gerçekte önce bilgisayarı bir uzmana temizletirsiniz (virüs dersini hatırlayın), sonra yedekten geri yüklersiniz.',
    }),
    {
      title: 'Yedekten geri yükleyin',
      html: `<p>Bilgisayarın temizlendiğini varsayalım. Belleği yeniden takın; USB › <b>Yedek</b> içindeki <b>fotoğrafları ve videoyu</b> seçip ${K('Ctrl', 'C')}, <b>Resimler</b>'de ${K('Ctrl', 'V')}.</p>${usbBtn('💾 USB belleği yeniden tak')}`,
      hint: 'Yedek klasöründe Belgeler\'den gelenler de var. Yalnızca dört resim/video dosyasını seçmek için Ctrl basılıyken tek tek tıklayın; hepsini kopyalarsanız da sorun olmaz.',
      setup: (c) => { bindUsb(c); explorerAt()(c); },
      check: (c) => PICS.every((n) => c.d.fs.find('pictures', n)),
      on: (ev, c) => (ev.type === 'fs' || ev.type === 'file-paste') && PICS.every((n) => c.d.fs.find('pictures', n)),
      done: 'Fotoğraflar geri geldi! Yedek olmasaydı hepsi kaybolacaktı.',
    },
    {
      title: 'Kilitli dosyaları silin',
      html: `<p>Resimler'deki <b>.kilitli</b> dosyaları seçip ${K('Delete')} ile silin.</p>`,
      hint: 'Ctrl basılıyken kilitli dosyalara tek tek tıklayın, sonra Delete.',
      setup: explorerAt('pictures'),
      check: (c) => !c.d.fs.children('pictures').some((n) => /\.kilitli$/.test(n.name)),
      on: (ev, c) => ev.type === 'fs' && !c.d.fs.children('pictures').some((n) => /\.kilitli$/.test(n.name)),
      done: 'Resimler klasörü eski hâline döndü. Belleği güvenle çıkarmayı unutmayın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Yedekleme kuralları:</p>' },
  ],
};

export const ikiAdim = {
  id: 'iki-adimli', icon: '📱', title: 'İki adımlı doğrulama ve yedek kodlar', minutes: 30, stage: 'desktop',
  desc: 'Bir hesapta iki adımlı doğrulamayı açmak, SMS koduyla girmek, yedek kodları saklamak ve telefon yokken onlarla girmek.',
  summary: [
    ['İki adımlı doğrulama', 'Girişte şifreden sonra telefonunuza gelen kod da sorulur. Şifreyi öğrenen tek başına giremez'],
    ['Nerede açılır?', 'Hesabın Ayarlar → Güvenlik bölümünde. E-posta, sosyal medya ve alışveriş hesaplarınızda açın'],
    ['SMS kodu', 'Yalnızca girdiğiniz sitenin sayfasına yazılır. Telefonda soran herkes dolandırıcıdır'],
    ['Doğrulama uygulaması', 'Telefona kurulur, her 30 saniyede yeni kod üretir; SMS gerekmez'],
    ['Yedek kodlar', 'Telefon kaybolursa girmenin yolu. Kâğıda yazıp evde saklayın; her biri bir kez kullanılır'],
    ['Siz istemeden kod geldi', 'Biri şifrenizi biliyor demektir: kodu kimseye vermeyin, şifrenizi hemen değiştirin'],
  ],
  steps: [
    {
      title: 'İki kilit',
      html: `<p>Bir kapıda iki kilit düşünün: biri <b>bildiğiniz</b> şey (şifre), öbürü <b>cebinizdeki</b> şey (telefon). Hırsız şifrenizi öğrense bile telefonunuz olmadan kapıyı açamaz. Buna <b>iki adımlı doğrulama</b> denir.</p>
        <p>Bankalar bunu zaten yapar (şifre + SMS). Bugün bir sosyal ağ hesabında bu korumayı <b>kendimiz açacağız</b>.</p>
        <p class="mut">Alıştırma sitesi: <b>${DOST_HOST}</b> · e-posta <b>${DOST_MAIL}</b> · şifre <b>${DOST_SIFRE}</b></p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: DOST_HOST }); },
    },
    {
      title: 'Giriş yapın',
      html: `<p>E-posta ve şifreyle <b>Giriş yap</b>'a basın.</p><p class="mut">${DOST_MAIL} · ${DOST_SIFRE}</p>`,
      hint: 'Şifrede büyük B harfi ve nokta var: Bahar.2026',
      on: (ev) => ev.type === 'ds-login',
      done: 'Girdiniz. Şu an yalnızca şifreyle girildi: şifreyi bilen herkes girebilir.',
    },
    {
      title: 'Güvenlik ayarları',
      html: '<p>Üstten <b>⚙ Ayarlar</b>\'a tıklayın. <b>🛡 Güvenlik</b> bölümünde iki adımlı doğrulama <b>Kapalı</b> yazıyor; yanındaki <b>Aç</b>\'a basın.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.path === '/iki-adim',
      done: 'İki yöntem var: SMS ile kod ya da telefona kurulan doğrulama uygulaması.',
    },
    {
      title: 'SMS ile açın',
      html: '<p><b>💬 SMS ile kod</b> seçili kalsın, <b>Devam</b>\'a basın. Sağ altta gelen SMS\'teki 6 haneli kodu yazıp <b>Doğrula ve aç</b>.</p>',
      hint: 'SMS bildirimi sağ altta bir süre kalır. Kaçırdıysanız Devam\'a yeniden basın.',
      on: (ev) => ev.type === 'ds-2fa-on',
      done: 'İki adımlı doğrulama açıldı. Ekranda 8 tane <b>yedek kod</b> çıktı.',
    },
    {
      title: 'Yedek kodları indirin',
      html: '<p>Telefonunuz kaybolursa ya da bozulursa bu kodlarla girersiniz. <b>⬇ Yedek kodları indir (.txt)</b>\'e basın.</p>',
      on: (ev) => ev.type === 'ds-backup-dl',
      done: 'Kodlar <b>İndirilenler</b> klasörüne indi. Gerçekte bunları bir kâğıda da yazıp evde güvenli bir yere koyun.',
    },
    rehberSoru({
      title: 'Kodları nerede saklarsınız?',
      html: '<p>Yedek kodları en iyi nerede saklarsınız?</p>',
      opts: ['Kâğıda yazıp evde güvenli bir yerde (ya da evde duran bir USB bellekte)', 'Fotoğrafını çekip ailenin mesaj grubuna atarım', 'Dostlarım\'da kendime gönderi olarak paylaşırım'], ok: 0,
      wrong: 'Kodları gören herkes hesabınıza girebilir. Paylaşılan yerlere koymayın.',
      why: 'Doğru. Yedek kodlar bir anahtar gibidir: kimseye göstermeyin, internette paylaşmayın. Bir kod kullanılınca listeden çizilir.',
    }),
    {
      title: 'Çıkış yapın',
      html: '<p>Sağ üstteki <b>⏻ Çıkış</b>\'a basın. Sonra yeniden gireceğiz.</p>',
      hint: 'İndirilenler paneli açıksa düğmenin üstünü kapatabilir: panelin ✕ işaretine basın.',
      on: (ev) => ev.type === 'ds-logout',
    },
    {
      title: 'Yeniden girin',
      html: '<p>Aynı e-posta ve şifreyle girin. Bu kez şifreden sonra <b>kod da</b> sorulacak: SMS\'teki kodu yazıp <b>Doğrula</b>.</p>',
      on: (ev, c) => {
        if (ev.type === 'ds-login' && ev.via !== 'sms') { c.note('Girdiniz ama SMS koduyla değil. Bir sonraki adımda yedek kodu deneyeceğiz.'); return true; }
        return ev.type === 'ds-login';
      },
      done: 'Şifre + telefon: iki adım. Şifrenizi biri öğrense bile artık tek başına giremez.',
    },
    {
      title: 'Yine çıkın',
      html: '<p><b>⏻ Çıkış</b>\'a basın.</p>',
      on: (ev) => ev.type === 'ds-logout',
    },
    {
      title: 'Telefon kayboldu!',
      html: `<p>Diyelim telefonunuz kayboldu; SMS gelmeyecek. Şifreyle girin; kod sayfasında <b>Telefonuma erişemiyorum: yedek kod kullan</b>'a tıklayın.</p>
        <p>İndirdiğiniz kodlara bakmak için sağ üstteki <b>⬇ İndirilenler</b>'den <b>dostlarim-yedek-kodlar.txt</b>'yi açın (ya da Dosya Gezgini → İndirilenler). Bir kodu yazıp <b>Giriş</b>.</p>`,
      hint: 'Kodu boşluklu ya da boşluksuz yazabilirsiniz: 1234 5678. Not Defteri penceresi tarayıcının üstünü kapatırsa görev çubuğundan tarayıcıya dönün.',
      setup: (c) => { dost(c).noSms = true; },
      leave: (c) => { dost(c).noSms = false; },
      on: (ev, c) => {
        if (ev.type === 'ds-code-err' && ev.used) c.note('O kod kullanılmış. Listeden başka bir kod seçin.');
        return ev.type === 'ds-login' && ev.via === 'backup';
      },
      done: 'Telefon olmadan yedek kodla girdiniz. O kod artık geçersiz; listede üstü çizili görünür.',
    },
    rehberSoru({
      title: 'Telefon geldi',
      html: '<p>Biri arıyor: “Dostlarım güvenlik ekibinden arıyorum, hesabınızı korumak için telefonunuza gelen kodu söyler misiniz?”</p>',
      opts: ['Söylerim, güvenlik ekibi istiyor', 'Söylemem, kapatırım. Kodu yalnızca giriş yaptığım sayfaya ben yazarım', 'Yalnızca ilk üç rakamı söylerim'], ok: 1,
      wrong: 'Kodu söylerseniz iki adımlı doğrulamanın hiçbir faydası kalmaz: hesabınıza onlar girer.',
      why: 'Doğru. Hiçbir şirket kodu telefonla istemez. Kodu soran kişi şifrenizi zaten ele geçirmiş ve ikinci kilidi açmaya çalışıyordur.',
    }),
    rehberSoru({
      title: 'İstemediğiniz kod',
      html: '<p>Evde oturuyorsunuz, hiçbir yere girmiyorsunuz; telefonunuza “Dostlarım giriş kodunuz: 381920” diye SMS geldi. Ne demektir?</p>',
      opts: ['Önemsiz, silerim', 'Biri şifremi bilip girmeye çalışıyor: kodu kimseye vermem, şifremi hemen değiştiririm', 'Kodu siteye yazıp ne olduğuna bakarım'], ok: 1,
      wrong: 'Kod, birinin girmeye çalıştığını gösterir. Bu bir uyarıdır.',
      why: 'Doğru. İki adımlı doğrulama sizi korudu ama şifreniz başkasının elinde. Şifreyi Ayarlar → Güvenlik\'ten değiştirin; başka sitelerde de aynı şifreyi kullanıyorsanız oraları da değiştirin.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İki adımlı doğrulama:</p>' },
  ],
};

export const sosyalMedya = {
  id: 'sosyal-medya-guvenlik', icon: '👥', title: 'Sosyal medyada güvenlik', minutes: 35, stage: 'desktop',
  desc: 'Profilinizi kimin gördüğü, gizlilik ayarları, tatil ve konum paylaşımı, taklit hesap, arkadaş hesabından para isteyen mesaj, çekiliş tuzağı.',
  summary: [
    ['👁 Başkası nasıl görüyor?', 'Profilinizi arkadaşınız olmayan birinin gözüyle görün'],
    ['Ayarlar → Gizlilik', 'Profil ve gönderiler: Arkadaşlar · Telefon: Yalnızca ben · Konum: kapalı'],
    ['Tatil paylaşımı', '“Ev boş” demeyin: tatil fotoğraflarını döndükten sonra, yalnızca arkadaşlara paylaşın'],
    ['Taklit hesap', 'Zaten arkadaşınız olan birinden yeni istek, 0 ortak arkadaş, yeni açılmış hesap → Sahte hesap olarak bildirin'],
    ['“Acil para lazım” mesajı', 'Para göndermeyin; kişiyi bildiğiniz numarasından arayın, mesajı şikâyet edin'],
    ['Çekiliş tuzağı', 'Kart bilgisi, “kargo ücreti”, garip adres isteyen çekiliş sahtedir: tıklamayın, şikâyet edin'],
    ['⏻ Çıkış', 'Ortak bilgisayarda iş bitince çıkış yapın'],
  ],
  steps: [
    {
      title: 'Sosyal medya ve güvenlik',
      html: `<p>Sosyal medyada aile fotoğraflarını görmek güzel. Ama paylaştıklarımızı <b>tanımadığımız insanlar da</b> görebilir: dolandırıcılar ve hırsızlar da.</p>
        <p>Bugün bir sosyal ağ hesabını güvenli hâle getireceğiz. Alıştırma sitesi: <b>${DOST_HOST}</b> · <b>${DOST_MAIL}</b> · şifre <b>${DOST_SIFRE}</b></p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: DOST_HOST }); },
    },
    {
      title: 'Giriş yapın',
      html: `<p>E-posta ve şifreyle girin.</p><p class="mut">${DOST_MAIL} · ${DOST_SIFRE}</p>`,
      on: (ev) => ev.type === 'ds-login',
    },
    {
      title: 'Başkası ne görüyor?',
      html: '<p>Üstten <b>👤 Profilim</b>\'e gidin ve <b>👁 Başkası nasıl görüyor?</b>\'e basın. Tanımadığınız biri neleri görüyor?</p>',
      on: (ev) => ev.type === 'ds-viewas' && ev.pub,
      done: 'Telefonunuz, mahalleniz, doğum gününüz ve arkadaş listeniz <b>herkese açık</b>! Dolandırıcı bunlarla kendini tanıdık gibi tanıtabilir.',
    },
    {
      title: 'Gizlilik ayarları',
      html: `<p><b>⚙ Ayarlar</b> → <b>🔒 Gizlilik</b> bölümünde şunları seçip <b>Kaydet</b>:</p>
        <ul class="big-list"><li>Profil ve gönderiler: <b>👥 Arkadaşlar</b></li><li>Telefon numarası: <b>🔒 Yalnızca ben</b></li><li>Arkadaş listesi: <b>👥 Arkadaşlar</b></li><li>📍 Konum ekleme kutusunun işaretini <b>kaldırın</b></li></ul>`,
      on: (ev, c) => {
        if (ev.type !== 'ds-privacy') return false;
        const miss = [];
        if (ev.profil !== 'arkadas') miss.push('profil');
        if (ev.gonderi === 'herkes') miss.push('gönderiler');
        if (ev.telefon !== 'ben') miss.push('telefon');
        if (ev.arkadas === 'herkes') miss.push('arkadaş listesi');
        if (ev.konum) miss.push('konum');
        if (miss.length) { c.note(`Kaydedildi ama şunlar hâlâ açık: <b>${miss.join(', ')}</b>. Düzeltip yeniden Kaydet'e basın.`); return false; }
        return true;
      },
      done: 'Gizlilik ayarlarınız sıkılaştı.',
    },
    {
      title: 'Yeniden bakın',
      html: '<p><b>👤 Profilim</b> → <b>👁 Başkası nasıl görüyor?</b> Şimdi ne görünüyor?</p>',
      on: (ev) => ev.type === 'ds-viewas' && ev.pub && ev.priv.profil === 'arkadas',
      done: 'Tanımadıklar artık yalnızca adınızı ve fotoğrafınızı görüyor.',
    },
    rehberSoru({
      title: 'Tatil paylaşımı',
      html: '<p>Yarın iki haftalık tatile gidiyorsunuz. Hangi paylaşım <b>güvenlidir</b>?</p>',
      opts: ['“Yarından itibaren 2 hafta Antalya\'dayız, ev boş 😎” (herkese açık, konumlu)', 'Hiçbir şey paylaşmam; tatil fotoğraflarını döndükten sonra yalnızca arkadaşlara paylaşırım', 'Uçağa binerken bilet fotoğrafı (barkodlu) paylaşırım'], ok: 1,
      wrong: '“Ev boş” paylaşımı hırsıza davetiyedir; bilet barkodunda da kişisel bilgileriniz vardır.',
      why: 'Doğru. Evden uzakta olduğunuzu ve evinizin yerini aynı anda söylemeyin. Döndükten sonra paylaşmak hem güvenli hem keyifli.',
    }),
    {
      title: 'Güvenli bir paylaşım',
      html: '<p><b>🏠 Akış</b>\'a gidin. Kutuya <b>Tatilden döndük, çok güzeldi</b> yazın. <b>Kimler görsün</b>: <b>👥 Arkadaşlar</b>, <b>📍 Konum ekle</b> boş olsun. <b>Paylaş</b>.</p>',
      on: (ev, c) => {
        if (ev.type !== 'ds-post') return false;
        if (ev.audience === 'herkes') { c.note('Paylaşım herkese açık oldu. Bir dahaki sefere “Arkadaşlar” seçin; şimdi bir daha deneyin.'); return false; }
        if (ev.location) { c.note('Konum eklendi: evinizin yeri belli olur. Kutunun işaretini kaldırıp bir daha paylaşın.'); return false; }
        return true;
      },
      done: 'Yalnızca arkadaşlarınız görecek; konum yok.',
    },
    {
      title: 'Arkadaşlık istekleri',
      html: `<p>Üstten <b>🤝 İstekler</b>'e gidin. <b>Hasan Demir</b>'den istek gelmiş. Aşağıdaki listeye bakın: Hasan Demir <b>zaten arkadaşınız</b>!</p>
        <p>İsteğin altındaki bilgileri okuyun ve uygun düğmeye basın.</p>`,
      hint: 'Ortak arkadaş 0, hesap 2 gün önce açılmış: biri Hasan Bey\'in adını ve fotoğrafını kopyalamış.',
      on: (ev, c) => {
        if (ev.type !== 'ds-request' || ev.id !== 'sahte') return false;
        if (ev.action === 'ok') { c.warn('Taklit hesabı onayladınız! Bu kişi artık size Hasan Bey gibi yazıp para isteyebilir. Gerçekte hemen arkadaşlıktan çıkarın ve şikâyet edin.'); return true; }
        if (ev.action === 'del') c.note('İsteği sildiniz. Daha da iyisi “⚑ Sahte hesap” ile bildirmek: başkaları da kandırılmasın.');
        return true;
      },
      done: 'Taklit hesaplar, tanıdığınızın adını ve fotoğrafını kopyalar. Şüphelenirseniz gerçek kişiye telefonla sorun.',
    },
    {
      title: 'Gerçek istek',
      html: '<p><b>Fatma Kaya</b>\'nın isteğine bakın: 14 ortak arkadaş, 6 yıllık hesap, komşunuz. <b>Onayla</b>\'ya basın.</p>',
      on: (ev) => ev.type === 'ds-request' && ev.id === 'fatma',
      done: 'Ortak arkadaşı çok, eski ve tanıdığınız biri: güvenle eklenir.',
    },
    {
      title: 'Bir mesaj',
      html: '<p>Üstten <b>💬 Mesajlar</b>\'a gidin ve <b>Zeynep Arslan</b>\'ın mesajını okuyun.</p>',
      on: (ev) => ev.type === 'web-nav' && ev.path === '/mesajlar/zeynep',
      done: 'Zeynep acil para istiyor ve “kimseye söyleme” diyor.',
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Zeynep\'in hesabından gelen bu mesaja ne yaparsınız?</p>',
      opts: ['Hemen gönderirim, arkadaşım zor durumda', 'Para göndermem; Zeynep\'i bildiğim telefon numarasından ararım', 'Mesajdan IBAN\'ı sorup yarısını gönderirim'], ok: 1,
      wrong: 'Hesaplar ele geçirilebilir. Mesajı yazan Zeynep olmayabilir.',
      why: 'Doğru. Dolandırıcılar ele geçirdikleri hesaptan bütün arkadaşlara aynı mesajı atar. İşaretler: acele, gizlilik (“kimseye söyleme”), başkasının adına IBAN.',
    }),
    {
      title: 'Şikâyet edin',
      html: '<p>Sohbetin üstündeki <b>⚑ Şikâyet et</b>\'e basın. Sitedeki ekip hesabı inceler.</p>',
      on: (ev) => ev.type === 'ds-report' && ev.id === 'hacked',
      done: 'Bildirildi. Gerçekte Zeynep\'e telefonla haber verin: şifresini değiştirmesi gerekir.',
    },
    {
      title: 'Çekiliş',
      html: '<p><b>🏠 Akış</b>\'a dönün. <b>Dostlarım Hediye 🎁</b> sayfasının çekiliş gönderisini okuyun. Bağlantıya <b>tıklamadan</b>, gönderinin sağ üstündeki <b>⚑ Şikâyet et</b>\'e basın.</p>',
      hint: 'İşaretler: “son 2 saat” acelesi, kart bilgisi ve kargo ücreti istemesi, sitenin adresi olmayan bir adres (.xyz), 3 gün önce açılmış sayfa.',
      on: (ev, c) => {
        if (ev.type === 'ds-scam-link') c.warn('Bağlantıya tıkladınız! Gerçekte sahte sayfaya giderdiniz. Hiçbir bilgi yazmadan geri dönün ve gönderiyi şikâyet edin.');
        if (ev.type === 'ds-share' && ev.id === 'cekilis') c.warn('Tuzağı paylaştınız: arkadaşlarınız da görecek. Gerçekte paylaşımı silin.');
        return ev.type === 'ds-report' && ev.id === 'cekilis';
      },
      done: 'Gerçek çekilişler kart bilgisi ya da “kargo ücreti” istemez. Tanımadığınız sayfaların çekilişlerine katılmayın.',
    },
    {
      title: 'Çıkış yapın',
      html: '<p>Sağ üstteki <b>⏻ Çıkış</b>\'a basın.</p>',
      on: (ev) => ev.type === 'ds-logout',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Sosyal medyada güvenlik:</p>' },
  ],
};
