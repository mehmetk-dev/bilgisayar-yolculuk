// 8. hafta ek dersleri: internette bilgi bulmak, tuzakları tanımak, internet parkuru
import { desktopReady, maxed } from './common.js';
import { info, ayir, sec, rehberSoru } from './kalip.js';

const brOpen = (c, url) => maxed(c, 'browser', url ? { url } : {});
const brEnsure = (c) => { if (!c.d.find('browser')) brOpen(c); };
const dec = (p) => { try { return decodeURIComponent(p || ''); } catch { return p || ''; } };

export const aramaPratik = {
  id: 'arama-pratik', icon: '🔎', title: 'İnternette bilgi bulmak', minutes: 25, stage: 'desktop',
  desc: 'Orta seviye: aramayla hava durumu, tarif ve haber bulmak; sayfayı okuyup soruyu cevaplamak; sekmeler, geri dönme.',
  summary: [
    ['Kısa arama', '“izmir hava durumu”, “mercimek çorbası tarifi”: birkaç anahtar kelime yeter'],
    ['Sonuçlar', 'Adrese (yeşil yazı) bakın; “Reklam” yazanları atlayın'],
    ['Okumak', 'Sayfayı tekerlekle kaydırarak sonuna kadar'],
    ['＋ Yeni sekme', 'Açık sayfayı kaybetmeden başka bir şey aramak'],
    ['← Geri', 'Bir önceki sayfa'],
  ],
  steps: [
    {
      title: 'İyi arama nasıl yapılır?',
      html: `<ul class="big-list"><li>Uzun cümle yerine <b>birkaç anahtar kelime</b> yazın: “yarın izmirde hava nasıl olacak acaba” yerine <b>izmir hava durumu</b>.</li><li>Sonuçlarda başlığın üstündeki <b>adrese</b> bakın.</li><li>“Reklam” yazan sonuçları atlayın.</li></ul>
        <p>Bu derste bulduğunuz sayfaları <b>okuyup</b> sorulara cevap vereceksiniz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); brOpen(c); },
    },
    {
      title: 'Hava durumunu arayın',
      html: '<p>Arama kutusuna <b>hava durumu</b> yazıp aratın ve hava durumu sitesini açın.</p>',
      setup: brEnsure,
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.hava-durumu.com.tr',
    },
    {
      title: 'İzmir',
      html: '<p>Sayfanın üstündeki şehirlerden <b>İzmir</b>\'e tıklayın.</p>',
      setup: brEnsure,
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.hava-durumu.com.tr' && /İzmir/i.test(dec(ev.path)),
    },
    rehberSoru({
      title: 'Okuyun: yarın kaç derece?',
      html: '<p>Sayfaya bakın: İzmir\'de <b>yarın</b> hava kaç derece olacak?</p>',
      opts: ['24°', '29°', '18°'], ok: 1,
      why: 'Doğru: yarın İzmir\'de 29°, güneşli.',
      wrong: 'Bu değil. Sayfada “Yarın” yazan kutuya bakın.',
    }),
    {
      title: 'Yeni sekmede tarif',
      html: '<p>Hava durumu sayfası açık kalsın. <b>＋</b> ile yeni bir sekme açın ve <b>mercimek çorbası tarifi</b> arayıp tarifi açın.</p>',
      setup: brEnsure,
      on: (ev, c) => {
        if (ev.type === 'web-tab-new') c.s.t = true;
        if (ev.type === 'web-nav' && ev.path === '/mercimek' && !c.s.t) c.note('Tarif açıldı, ama aynı sekmede. Bir dahaki sefere önce ＋ ile yeni sekme açın.');
        return ev.type === 'web-nav' && ev.path === '/mercimek';
      },
    },
    rehberSoru({
      title: 'Okuyun: kaç dakika?',
      html: '<p>Tarife göre çorba kaç dakika pişiyor?</p>',
      opts: ['10 dakika', '25 dakika', '1 saat'], ok: 1,
      why: 'Doğru: 25 dakika pişirilip blenderdan geçiriliyor.',
      wrong: 'Bu değil. Tarifteki yazıyı yeniden okuyun.',
    }),
    {
      title: 'Adres yazarak haberler',
      html: '<p>Bu sefer arama yapmadan, adres çubuğuna doğrudan <b>www.gunun-haberleri.com.tr</b> yazıp Enter\'a basın.</p>',
      target: 'www.gunun-haberleri.com.tr',
      setup: brEnsure,
      on: (ev, c) => {
        if (ev.type === 'web-nav' && ev.error) c.warn('Adres bulunamadı; bir harf yanlış olabilir. Adres çubuğuna tıklayıp düzeltin.');
        return ev.type === 'web-nav' && ev.host === 'www.gunun-haberleri.com.tr';
      },
    },
    {
      title: 'Kurs haberi',
      html: '<p>Haber listesinde <b>bilgisayar kursu</b> haberini bulup açın.</p>',
      setup: brEnsure,
      on: (ev) => ev.type === 'web-nav' && ev.host === 'www.gunun-haberleri.com.tr' && /^\/haber\/1/.test(ev.path),
    },
    rehberSoru({
      title: 'Okuyun: hangi günler?',
      html: '<p>Haberde yazana göre kurslar hangi günler yapılacak?</p>',
      opts: ['Pazartesi ve çarşamba', 'Salı ve perşembe', 'Hafta sonu'], ok: 1,
      why: 'Doğru: salı ve perşembe günleri.',
      wrong: 'Bu değil. Haberin metnini dikkatle okuyun.',
    }),
    {
      title: 'Geri dönün ve kapatın',
      html: '<p>Sol üstteki <b>←</b> ile haber listesine dönün, sonra bu sekmeyi sekmedeki <b>✕</b> ile kapatın.</p>',
      setup: brEnsure,
      on: (ev, c) => {
        if (ev.type === 'web-back') { c.s.b = true; c.note('Geri döndünüz. Şimdi sekmeyi ✕ ile kapatın.'); }
        return !!c.s.b && ev.type === 'web-tab-close';
      },
      done: 'Öbür sekmeler açık kaldı; tarayıcı kapanmadı.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternette aradığınızı bulup okuyabiliyorsunuz:</p>' },
  ],
};

export const tuzaklar = {
  id: 'tuzaklar', icon: '🪤', title: 'İnternetteki tuzakları tanıyalım', minutes: 20, stage: 'scene',
  desc: 'Sahte indirme düğmeleri, “ödül kazandınız” pencereleri, bildirim izni, sahte güncelleme, çerez uyarısı, benzer adresler.',
  summary: [
    ['Büyük renkli İNDİR', 'Genellikle reklam'],
    ['“Kazandınız!”', 'Kapatın; kimse bedava telefon vermez'],
    ['“Bildirim göstermek istiyor”', 'Engelle'],
    ['“Programınız eski, güncelleyin”', 'Siteden değil, Windows Update\'ten'],
    ['Çerez penceresi', 'Kabul ya da Reddet; ikisi de güvenli'],
    ['Adres', 'Harf harf okuyun: bankam / bankarn'],
  ],
  steps: [
    { title: 'Tuzaklar', html: '<p>İnternette karşınıza çıkabilecek tuzaklara bakacağız. Her ekranı okuyun ve ne yapacağınızı seçin.</p>', scene: info('<div class="sc-big">🪤⚠</div><p>Dur · Oku · Düşün</p>') },
    sec({
      title: 'Hangi düğme?', kind: 'web', from: '🔒 www.program-indir.com.tr/resim-gosterici',
      text: '<div style="display:grid;gap:.4em"><span class="btn" style="background:#2e7d32;color:#fff">⬇⬇ HEMEN İNDİR ⬇⬇ <small>Sponsorlu</small></span><span><b>Resim Gösterici 2.4</b><br><u style="color:#1a0dab">Resim Gösterici\'yi indir (12 MB)</u></span><span class="btn" style="background:#c62828;color:#fff">⚠ 3 sorun bulundu! Şimdi onarın</span></div>',
      q: 'Resim Gösterici\'yi indirmek için hangisine tıklarsınız?',
      opts: ['Yeşil HEMEN İNDİR', 'Programın adının yazdığı sade bağlantı', 'Kırmızı “3 sorun bulundu”'], ok: 1,
      why: '“Sponsorlu” yazan ve korkutan düğmeler reklamdır. Gerçek bağlantı programın adını ve boyutunu söyler.',
    }),
    sec({
      title: 'Ödül kazandınız', kind: 'web', from: '⚠ Güvenli değil | www.sanslı-ziyaretci.xyz',
      text: '<div class="fake-pop"><b>🎉 TEBRİKLER!</b><p>1.000.000. ziyaretçimiz oldunuz! Yeni telefonunuzu almak için bilgilerinizi girin. Kalan süre: 00:59</p></div>',
      q: 'Ne yaparsınız?',
      opts: ['Bilgilerimi girerim, süre bitmeden', 'Sekmeyi kapatırım', 'Arkadaşlarıma gönderirim'], ok: 1,
      why: 'Kimse bedava telefon dağıtmaz. Geri sayım acele ettirmek içindir. Bilgileriniz ve kart numaranız çalınır.',
    }),
    sec({
      title: 'Bildirim izni', kind: 'web', from: '🔒 www.haber-sitesi.xyz',
      text: '<div class="pl" style="border:1px solid #ccc;border-radius:8px;padding:.6em;background:#fff">🔔 <b>www.haber-sitesi.xyz</b> bildirim göstermek istiyor<br><br><span class="btn">İzin ver</span> <span class="btn">Engelle</span></div>',
      q: 'Bu küçük pencere çıktı. Ne seçersiniz?',
      opts: ['İzin ver', 'Engelle'], ok: 1,
      why: 'İzin verirseniz site, siz bakmasanız bile ekranın köşesine reklam ve sahte uyarılar gönderebilir. Tanımadığınız sitelere hep Engelle.',
    }),
    sec({
      title: 'Sahte güncelleme', kind: 'web', from: '⚠ Güvenli değil | www.film-izle-bedava.xyz',
      text: '<div class="fake-pop"><b>⚠ Video oynatıcınız eski!</b><p>Filmi izlemek için hemen güncelleyin.</p><p><span class="btn">Güncelle</span></p></div>',
      q: 'Film izlerken bu çıktı. Ne yaparsınız?',
      opts: ['Güncelle\'ye basarım', 'Basmam; sekmeyi kapatırım. Güncellemeler Windows Update\'ten ya da programın kendisinden gelir', 'Bilgisayarı kapatırım'], ok: 1,
      why: 'Sitelerin “güncelle” diye indirttiği dosyalar çoğunlukla virüstür.',
    }),
    sec({
      title: 'Çerez penceresi', kind: 'web', from: '🔒 www.lezzetli-tarifler.com.tr',
      text: '<div class="pl" style="border:1px solid #ccc;border-radius:8px;padding:.6em;background:#fff">🍪 Bu site, deneyiminizi iyileştirmek için çerezler kullanır.<br><br><span class="btn">Kabul et</span> <span class="btn">Reddet</span> <span class="btn">Ayarlar</span></div>',
      q: 'Tarif sitesinde bu pencere çıktı. Tehlikeli mi?',
      opts: ['Evet, hemen tarayıcıyı kapatırım', 'Hayır; yasal bir bilgilendirmedir. Kabul ya da Reddet\'i seçip devam ederim', 'Bilgilerimi girmem gerekir'], ok: 1,
      why: 'Çerez pencereleri yasa gereği çıkar ve kişisel bilgi istemez. Reddet derseniz site yine çalışır.',
    }),
    sec({
      title: 'Benzer adres', kind: 'plain',
      text: '<div class="addr-cmp"><div><b>A</b><span class="fake-addr">🔒 www.bankam.com.tr</span></div><div><b>B</b><span class="fake-addr">🔒 www.bankarn.com.tr</span></div></div>',
      q: 'İkisinde de kilit var. Hangisi gerçek banka?',
      opts: ['A', 'B'], ok: 0,
      why: 'B\'de “m” yerine “r” ve “n” yan yana yazılmış: bankarn. Uzaktan aynı görünür! Kilit yalnızca bağlantının şifreli olduğunu söyler, sitenin gerçek olduğunu değil.',
    }),
    ayir({
      title: 'Güvenli mi, şüpheli mi?',
      html: '<p>Son olarak kartları ayırın.</p>',
      bins: [{ id: 'ok', label: 'Güvenli', icon: '✅' }, { id: 'no', label: 'Şüpheli', icon: '🚩' }],
      items: [
        { label: 'Adresi kendim yazdığım banka sitesi', icon: '🏦', bin: 'ok', why: 'Adresi kendiniz yazmak en güvenli yoldur.' },
        { label: 'Programın kendi resmî sitesi', icon: '🌐', bin: 'ok', why: 'Programı yapan firmanın sitesi güvenilirdir.' },
        { label: 'Çerez penceresinde Reddet', icon: '🍪', bin: 'ok', why: 'Zararsızdır.' },
        { label: '“Virüs bulundu, bu numarayı arayın”', icon: '📞', bin: 'no', why: 'Sahte destek dolandırıcılığı.' },
        { label: '“Bedava telefon kazandınız”', icon: '🎁', bin: 'no', why: 'Bilgi toplamak için kurulan tuzak.' },
        { label: 'Sponsorlu yeşil İNDİR düğmesi', icon: '⬇', bin: 'no', why: 'Reklam.' },
        { label: '“Video oynatıcınızı güncelleyin”', icon: '▶', bin: 'no', why: 'Sahte güncelleme.' },
      ],
      done: 'Tuzakları tanıyorsunuz! Emin olmadığınızda: dur, düşün, sor.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İnternette dikkat edilecekler:</p>', scene: info('<div class="sc-big">🛡</div>') },
  ],
};

export const internetParkur = {
  id: 'internet-parkur', icon: '🏁', title: 'İnternet parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: 11 görev, yönlendirme yok. Arama, sayfayı okuma, adres yazma, doğru bağlantıdan indirme, kurulumu başlatma. Süreler tutulur.',
  steps: [
    {
      title: 'İnternet parkuru',
      html: '<p>8. haftada öğrendiklerinizi <b>11 görevle</b> tekrar edeceğiz. Nasıl yapılacağı yazmıyor; takılırsanız 💡 İpucu.</p><div class="box">Eğitmen notu: son ekranda her görevin süresi görünür.</div>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Tarayıcıyı arayarak açın', html: '<p>İnternet tarayıcısını <b>Başlat\'tan arayarak</b> açın.</p>', hint: 'Başlat → “internet” yazın → Enter.',
      on: (ev) => ev.type === 'start-open' && ev.app === 'browser',
    },
    { title: '2. Tarif arayın', html: '<p><b>börek tarifi</b> arayın.</p>', setup: brEnsure, on: (ev) => ev.type === 'web-search' && /b[öo]rek/i.test(ev.q) },
    { title: '3. Tarifi açın', html: '<p>Sonuçlardan ıspanaklı börek tarifini açın.</p>', setup: brEnsure, on: (ev) => ev.type === 'web-nav' && ev.path === '/borek' },
    {
      title: '4. Sonuna kadar okuyun', html: '<p>Sayfanın <b>en sonuna</b> kadar kaydırın; orada gizli bir kelime var.</p>', hint: 'Fare tekerleğini kendinize doğru çevirin.',
      setup: (c) => { if (!/borek/.test(c.d.find('browser')?.api.url || '')) brOpen(c, 'www.lezzetli-tarifler.com.tr/borek'); },
      on: (ev) => ev.type === 'web-scroll' && ev.atBottom,
      done: 'Gizli kelime: AFİYET.',
    },
    { title: '5. Yeni sekme', html: '<p>Yeni bir sekme açın.</p>', setup: brEnsure, on: (ev) => ev.type === 'web-tab-new' },
    {
      title: '6. Adresi yazın', html: '<p>Adres çubuğuna <b>www.program-indir.com.tr</b> yazıp gidin.</p>', setup: brEnsure,
      on: (ev, c) => {
        if (ev.type === 'web-nav' && ev.error) c.warn('Adres bulunamadı; harfleri kontrol edin.');
        return ev.type === 'web-nav' && ev.host === 'www.program-indir.com.tr';
      },
    },
    { title: '7. Programın sayfası', html: '<p><b>Resim Gösterici</b>\'nin sayfasını açın.</p>', setup: brEnsure, on: (ev) => ev.type === 'web-nav' && ev.path === '/resim-gosterici' },
    {
      title: '8. Doğru bağlantıdan indirin', html: '<p>Programı <b>reklamlara tıklamadan</b> indirin.</p>', hint: 'Programın adının ve boyutunun yazdığı sade bağlantı.',
      setup: (c) => { if (!/resim-gosterici/.test(c.d.find('browser')?.api.url || '')) brOpen(c, 'www.program-indir.com.tr/resim-gosterici'); },
      on: (ev, c) => {
        if (ev.type === 'web-ad') c.warn('Bu bir <b>reklamdı</b>! Sade bağlantıyı bulun.');
        return ev.type === 'download';
      },
    },
    {
      title: '9. İndirilenler', html: '<p>İndirdiğiniz dosyanın durduğu klasörü açın.</p>', hint: 'İndirme kutusundaki “Klasörde göster” ya da Dosya Gezgini → İndirilenler.',
      on: (ev) => ev.type === 'download-folder' || (ev.type === 'nav' && ev.folder === 'downloads') || (ev.type === 'app-open' && ev.app === 'explorer' && ev.args?.folder === 'downloads'),
    },
    {
      title: '10. Kurulumu başlatın', html: '<p>Kurulum dosyasını açın ve izin penceresinde doğru cevabı verin.</p>', hint: 'Dosyaya çift tıklayın. Programı siz indirdiniz: Evet.',
      on: (ev, c) => {
        if (ev.type === 'uac' && ev.answer === 'no') c.note('Hayır dediniz. Programı siz indirdiyseniz Evet diyebilirsiniz; dosyaya yeniden çift tıklayın.');
        return ev.type === 'uac' && ev.answer === 'yes';
      },
      done: 'Kurulum başladı. Gerisini Program kurma dersinde yapmıştık.',
    },
    {
      title: '11. Hepsini kapatın', html: '<p>Kurulum penceresi dahil bütün pencereleri kapatın.</p>',
      check: (c) => !c.d.wins.length,
      on: (ev, c) => ev.type === 'win-close' && !c.d.wins.length,
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>İnternette güvenle gezinip indirme yapabiliyorsunuz.</p>' },
  ],
};
