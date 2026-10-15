// 13. hafta ek dersleri: PDF dosyalarıyla çalışmak (fatura, tahlil, belge) ve Mesajlaş Web (telefondaki mesajlar bilgisayarda)
import { K, desktopReady, maxed, put, norm } from './common.js';
import { rehberSoru } from './kalip.js';
import { WA_HOST } from '../apps/siteler-mesaj.js';

const br = (c, url) => maxed(c, 'browser', url ? { url } : {});

const FATURA = [
  `<p class="pdf-org">ELEKTRİK DAĞITIM A.Ş.</p><h3>Ekim 2026 Elektrik Faturası</h3><p>Abone adı: <b>Ahmet Yılmaz</b></p><p>Tesisat no: 4417 2209 83</p>
    <table class="pdf-tbl"><tr><th>Dönem</th><th>Tüketim</th></tr><tr><td>Ekim 2026</td><td>312 kWh</td></tr><tr><td>Eylül 2026</td><td>298 kWh</td></tr></table><p class="pdf-small">Sayfa 1: abone ve tüketim bilgileri.</p>`,
  `<p class="pdf-org">ELEKTRİK DAĞITIM A.Ş.</p><h3>Fatura bedeli</h3><table class="pdf-tbl"><tr><td>Enerji bedeli</td><td>1.012,40 ₺</td></tr><tr><td>Dağıtım bedeli</td><td>233,10 ₺</td></tr><tr><th>TOPLAM</th><th>1.245,50 ₺</th></tr></table>
    <p><b>Son ödeme tarihi: 25 Kasım 2026</b></p><p>Son ödeme tarihinden sonra gecikme zammı uygulanır.</p>`,
  `<p class="pdf-org">ELEKTRİK DAĞITIM A.Ş.</p><h3>Ödeme yöntemleri</h3><ul><li>Bankaların şubelerinde ve internet şubelerinde</li><li>PTT ve yetkili ödeme noktalarında</li><li>Otomatik ödeme talimatıyla</li></ul><p>Faturanızı ödemeniz için son gün 25 Kasım'dır; ödeme sonrası dekontu saklayın.</p>`,
];
const TARAMA = [`<p class="pdf-org">T.C. TAPU VE KADASTRO</p><h3>Tapu örneği (tarama)</h3><p>Taşınmaz: Çiçek Mah. Lale Sok. No: 5</p><p>Malik: Ahmet Yılmaz</p><p class="pdf-small">Bu belge yan taranmıştır; okumak için sayfayı döndürün.</p>`];

export const pdfCalis = {
  id: 'pdf-calis', icon: '📑', title: 'PDF dosyalarıyla çalışmak (fatura, tahlil, belge)', minutes: 30, stage: 'desktop',
  desc: 'PDF belgesini açmak, sayfalar arasında gezinmek, içinde kelime aramak.',
  summary: [
    ['PDF', 'Fatura, tahlil, resmî yazı… her bilgisayarda aynı görünür; yalnızca okunur'],
    ['◀ ▶', 'Önceki / sonraki sayfa'],
    ['🔍 Ara (Ctrl + F)', 'Belgede kelime arar; bulunanları boyar'],
    ['⟳ Döndür', 'Yan taranmış sayfayı düzeltir'],
    ['⬇ İndir', 'Belgenin bir kopyasını bilgisayarınıza kaydeder'],
    ['🖨 Yazdır', 'Kâğıda çıkarır; indirme ile karıştırmayın'],
  ],
  steps: [
    {
      title: 'PDF nedir?',
      html: `<p><b>PDF</b>, belgeyi her bilgisayarda ve telefonda <b>aynı görünüşle</b> gösteren dosya türüdür. Fatura, tahlil sonucu, banka dekontu, resmî yazılar çoğunlukla PDF gelir. Yazısı <b>değiştirilemez</b>, yalnızca okunur, aranır ve yazdırılır.</p>
        <p>Masaüstünde bir <b>elektrik faturası</b> ile <b>eski bir tarama</b> hazır.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        put(c, 'desktop', 'elektrik faturası.pdf', 'file', { pages: FATURA });
        put(c, 'desktop', 'tapu örneği (tarama).pdf', 'file', { pages: TARAMA, rot: 90 });
      },
    },
    {
      title: 'PDF\'yi açın',
      html: '<p>Masaüstündeki <b>📕 elektrik faturası.pdf</b> dosyasına <b>çift tıklayın</b>. PDF Okuyucu açılır.</p>',
      mouse: '🖱 elektrik faturası.pdf: çift tık',
      on: (ev) => ev.type === 'app-open' && ev.app === 'pdf',
      done: 'Belge PDF Okuyucu\'da açıldı. Üstte düğmeler var: sayfa, ara, döndür, indir, yazdır.',
    },
    {
      title: 'Sayfalar arasında gezin',
      html: '<p>Üstteki <b>▶</b> düğmesiyle <b>ikinci sayfaya</b> geçin. Sayfa numarası ortada yazar: <b>Sayfa 2 / 3</b>.</p>',
      on: (ev) => ev.type === 'pdf-page' && ev.n === 2,
      done: 'İkinci sayfada fatura bedelleri ve <b>son ödeme tarihi</b> var.',
    },
    {
      title: 'Belgede arayın',
      html: `<p>Uzun belgede aradığınızı bulmak için <b>🔍 Ara</b>'ya ya da ${K('Ctrl', 'F')}'ye basın. Açılan kutuya <b>ödeme</b> yazın. Bulunan her yer sarıya boyanır; <b>▼</b> ile sonraki sonuca geçersiniz.</p>`,
      combo: ['Ctrl', 'KeyF'],
      hint: 'Ara düğmesi PDF Okuyucu\'nun üst çubuğunda.',
      on: (ev) => ev.type === 'pdf-find' && norm(ev.q).includes('ödeme') && ev.found >= 2,
      done: (c) => 'Birkaç yerde “ödeme” geçiyor. Aramak, 30 sayfalık belgede bile saniyeler içinde yerini bulmanızı sağlar.',
    },
    rehberSoru({
      title: 'Son ödeme tarihi?',
      html: '<p>Faturayı okuyun (ikinci sayfa). <b>Son ödeme tarihi</b> nedir?</p>',
      opts: ['5 Ekim 2026', '25 Kasım 2026', '31 Aralık 2026'], ok: 1,
      wrong: 'İkinci sayfada koyu yazılmış satıra bakın.',
      why: 'Doğru: 25 Kasım 2026. Bu tarihten sonra ödeme gecikme zammıyla yapılır.',
    }),
    {
      title: 'Yan çıkmış belge',
      html: '<p><b>Tapu örneği (tarama).pdf</b> yan taranmış. Masaüstünden açın, <b>⟳ Döndür</b>\'e tıklayıp yazıyı dik duruma getirin (gerekirse birkaç kez).</p>',
      hint: 'Dosyaya çift tıklayın; her tıklayışta 90 derece döner. Yazı yatay okunana kadar tıklayın.',
      on: (ev) => ev.type === 'pdf-rotate' && ev.fixed,
      done: 'Sayfa düzeldi. Döndürme belgeyi bozmaz; yalnızca nasıl göründüğünü değiştirir.',
    },
    {
      title: 'Faturayı kopyalayın: ⬇',
      html: `<p>Faturaya (<b>elektrik faturası.pdf</b>) geri dönüp <b>⬇ İndir</b>'e tıklayın. Belgenin bir <b>kopyası</b> <b>İndirilenler</b> klasörüne kaydolur. (Web sitesinden gelen PDF'yi de böyle saklarsınız.)</p>`,
      hint: 'Fatura penceresi arkada kaldıysa görev çubuğundan seçin ya da masaüstünden yeniden açın.',
      on: (ev) => ev.type === 'pdf-download',
      done: 'Bir kopya İndirilenler klasöründe. Asıl belge yerinde kaldı.',
    },
    {
      title: 'Yazdırın: 🖨',
      html: `<p>Faturayı kâğıda çıkarmak için <b>🖨 Yazdır</b>'a (ya da ${K('Ctrl', 'P')}) tıklayıp yazıcıyı seçin ve yazdırın.</p>`,
      combo: ['Ctrl', 'KeyP'],
      on: (ev) => ev.type === 'pdf-print',
      done: 'Fatura yazıcıya gitti. İndirme dosyayı bilgisayara kaydeder, yazdırma kâğıda döker.',
    },
    rehberSoru({
      title: 'Hangi simge hangisi?',
      html: '<p>PDF faturayı <b>bilgisayarınıza saklamak</b> istiyorsunuz (kâğıda değil). Hangi simgeye basarsınız?</p>',
      opts: ['🖨 Yazdır', '⬇ İndir', '⟳ Döndür'], ok: 1,
      wrong: 'Yazdır kâğıda çıkarır. Bilgisayara kaydeden simge hangisi?',
      why: 'Doğru: ⬇ İndir bilgisayara kaydeder. 🖨 kâğıda çıkarır, ⟳ yalnızca sayfayı çevirir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>PDF belgeleriyle rahatça çalışabiliyorsunuz:</p>' },
  ],
};

export const whatsappWeb = {
  id: 'mesajlas-web', icon: '💬', title: 'WhatsApp Web: telefondaki mesajlar bilgisayarda', minutes: 35, stage: 'desktop',
  desc: 'WhatsApp\'ı bilgisayarda açmak, belge göndermek, sahte bağlantıları tanımak.',
  summary: [
    ['Karekod (QR)', 'Telefonunuzdan okutulur; telefonunuzla bilgisayar eşleşir'],
    ['📎 Ataş', 'Bilgisayardaki belge ya da fotoğrafı sohbete ekler'],
    ['⬇ İndir', 'Gelen fotoğrafı İndirilenler klasörüne kaydeder; oradan açıp yazdırılır'],
    ['⋮ → Oturumu kapat', 'Ortak bilgisayarda iş bitince mutlaka'],
    ['Tanımadığınız numara + bağlantı', 'Tıklamayın; doğrulama istemek dolandırıcılıktır'],
  ],
  steps: [
    {
      title: 'Telefondaki mesajlar bilgisayarda',
      html: `<p><b>WhatsApp'ın</b> bir <b>web sürümü</b> vardır (<b>web.whatsapp.com</b>). Bilgisayarın büyük ekranı ve klavyesiyle yazabilir, bilgisayardaki belgeleri hemen gönderebilirsiniz.</p>
        <p>Bağlanmak için telefonla ekrandaki <b>karekodu</b> okutursunuz (telefonda WhatsApp → ⋮ → <b>Bağlı cihazlar</b> → <b>Cihaz bağla</b>). Alıştırmada gerçeğine çok benzeyen <b>Mesajlaş Web</b> sitesini kullanacağız; gerçekte de adımlar aynıdır.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        put(c, 'desktop', 'ikametgâh belgesi.pdf', 'file', { pages: [`<p class="pdf-org">T.C.<br>NÜFUS VE VATANDAŞLIK İŞLERİ</p><h3>Yerleşim Yeri (İkametgâh) Belgesi</h3><p>Adı Soyadı: <b>Ahmet Yılmaz</b></p><p>Adres: Çiçek Mah. Lale Sok. No: 5, Merkez</p>`] });
      },
    },
    {
      title: 'Siteyi açın',
      html: `<p><b>İnternet</b>'i açıp adres çubuğuna <b>${WA_HOST}</b> yazın.</p>`,
      setup: (c) => br(c),
      on: (ev) => ev.type === 'web-nav' && ev.host === WA_HOST,
      done: 'Karekod ekranı açıldı. Sol tarafta üç adım yazıyor.',
    },
    {
      title: 'Karekodu okutun',
      html: '<p>Gerçek hayatta telefonla karekodu okutursunuz. Alıştırmada ekranın sağındaki <b>📷 Telefonla karekodu okut</b> düğmesine tıklayın.</p>',
      on: (ev) => ev.type === 'wa-scan',
      done: 'Telefon eşleşti. Sohbet listesi geldi; ilk sohbet Elif\'in.',
    },
    {
      title: 'Gelen fotoğrafı indirin',
      html: '<p>Elif bayram fotoğrafı göndermiş. Fotoğrafın altındaki <b>⬇ İndir</b> düğmesine tıklayarak bilgisayara kaydedin.</p>',
      on: (ev) => ev.type === 'wa-download',
      done: 'Fotoğraf <b>İndirilenler</b> klasörüne kaydedildi.',
    },
    {
      title: 'Açıp yazdırın',
      html: '<p>Sağ üstte ya da sağ altta çıkan <b>İndirilenler</b> panelinde <b>Dosyayı aç</b>\'a tıklayın. Fotoğraf açılınca <b>🖨 Yazdır</b>\'a tıklayıp yazdırın.</p>',
      hint: 'İndirme paneli kapandıysa tarayıcıdaki ⬇ simgesine tıklayın ya da Dosya Gezgini → İndirilenler.',
      on: (ev) => ev.type === 'photo-print',
      done: 'Fotoğraf yazıcıya gitti. Torununuzun fotoğrafı kâğıtta.',
    },
    {
      title: 'Oğlunuzun sohbeti',
      html: '<p>Sohbet listesinden <b>Ahmet (oğlum)</b>\'e tıklayın ve isteğini okuyun: ikametgâh belgesi istiyor.</p>',
      setup: (c) => br(c),
      on: (ev) => ev.type === 'wa-chat' && /Ahmet/.test(ev.name),
      done: 'Ahmet, bankada lazım olan ikametgâh belgesini (PDF) istiyor.',
    },
    {
      title: 'Belgeyi gönderin',
      html: `<p>Mesaj kutusunun solundaki <b>📎</b> ataşa tıklayın, <b>Masaüstü</b> klasöründen <b>ikametgâh belgesi.pdf</b>'yi seçip <b>Aç</b>'a basın. Belge sohbete eklenir.</p>`,
      hint: 'Masaüstü klasörü iletişim kutusunun solunda. Dosyaya tıklayıp Aç\'a basın.',
      on: (ev, c) => {
        if (ev.type !== 'wa-send-doc') return false;
        if (!/ikametg/i.test(ev.name)) { c.warn(`Gönderilen dosya “${ev.name}”. Doğru olan: ikametgâh belgesi.pdf. Yeniden 📎'a tıklayın.`); return false; }
        if (ev.toId !== 'ahmet') { c.warn('Belge yanlış kişiye gitti! Yalnızca Ahmet\'e gönderilmeliydi. Sohbeti Ahmet\'e geçirip tekrar gönderin.'); return false; }
        return true;
      },
      done: 'Belge gitti. Ahmet birkaç saniye içinde cevap verecek.',
    },
    {
      title: 'Cevabı bekleyin',
      html: '<p>Birkaç saniye bekleyin: Ahmet belgeyi aldığını yazacak.</p>',
      on: (ev) => ev.type === 'wa-reply' && /Ahmet/.test(ev.from),
      done: 'Belge ulaştı. İş tamam: bankaya gitmeye gerek kalmadı.',
    },
    {
      title: 'Tanımadığınız numara',
      html: '<p>Listenin en altındaki <b>+90 555 010 99 88</b> sohbetini açıp yazılanı okuyun. <b>Bağlantıya tıklamayın</b>.</p>',
      on: (ev) => ev.type === 'wa-chat' && /\+90/.test(ev.name),
      done: 'Hesabın kapanacağını söyleyen, tanımadığınız bir numara. Klasik dolandırıcılık.',
    },
    rehberSoru({
      title: 'Ne yaparsınız?',
      html: '<p>Tanımadığınız numaradan: “Hesabınız 24 saat içinde kapatılacak, hemen şu bağlantıyla doğrulayın.” Ne yaparsınız?</p>',
      opts: ['Bağlantıya tıklar, bilgilerimi girerim', 'Tıklamam; numarayı engeller ve yakınlarıma haber veririm', 'Arkadaşlarıma iletirim'], ok: 1,
      wrong: 'Bu bir tuzak. Hesap doğrulaması için hiçbir uygulama size bağlantı göndermez.',
      why: 'Doğru. Mesajlaşma uygulamaları hesabınızı bağlantıyla doğrulamanızı istemez; tıklarsanız sahte sayfaya düşersiniz.',
    }),
    {
      title: 'Oturumu kapatın',
      html: '<p>İşiniz bitti. Pencerenin sol üstündeki <b>⋮</b> işaretine tıklayıp <b>⏻ Oturumu kapat</b>\'ı seçin. Ortak bilgisayarda bunu yapmazsanız sonra gelen herkes mesajlarınızı okuyabilir.</p>',
      hint: 'Üç noktalı ⋮ simgesi, sohbet listesinin en üstünde sağdadır.',
      setup: (c) => br(c),
      on: (ev) => ev.type === 'wa-logout',
      done: 'Oturum kapandı; karekod ekranına döndü. Telefonunuzdaki mesajlar yerinde.',
    },
    rehberSoru({
      title: 'Kütüphane bilgisayarı',
      html: '<p>Kütüphanedeki ortak bilgisayarda mesajlarınıza baktınız. Çıkarken ne yapmalısınız?</p>',
      opts: ['Sekmeyi açık bırakırım', 'Oturumu kapatır, sekmeyi kapatırım', 'Hiçbir şey; bilgisayar kapanınca silinir'], ok: 1,
      wrong: 'Açık kalan oturumu sonra gelen kişi görür.',
      why: 'Doğru. Ortak bilgisayarda iş bitince “Oturumu kapat”; yalnızca sekmeyi kapatmak yetmez.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayarda güvenle mesajlaşabiliyorsunuz:</p>' },
  ],
};
