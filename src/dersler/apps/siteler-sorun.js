// 8. hafta ek sitesi (uydurma): “Sorunu internette doğru aratın” dersi için arama sonuçları ve sayfalar.
// Mevcut yazici-destek, eski-forum ve super-hizlandirici sitelerinin ALT sayfaları (yol) ile bir Microsoft destek sayfası.
// Ana sayfaları sites.js'te kalır; burada yalnızca bu dersin yolları çizilir (başka yol için null döner).

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });

// Türkçe harfleri sadeleştirip küçültür; tırnak işaretleri de atılır: “Windows 11” yazıcı ÇEVRİMDIŞI → windows 11 yazici cevrimdisi
const norm = (s) => String(s).toLocaleLowerCase('tr').replace(/[ıİ]/g, 'i').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/["“”'‘’]/g, ' ');

const RES = {
  yaziciResmi: { title: 'Yazıcı “Çevrimdışı” görünüyor: nedenleri ve çözümü (Windows 11)', url: 'www.yazici-destek.com.tr/cevrimdisi', snip: 'Güncelleme: 14 Ekim 2026 · Yazıcı üreticisinin resmî destek sayfası. Adım adım, kolaydan zora.' },
  yaziciForum: { title: 'yazıcım çevrimdışı yazıyor ne yapayım??', url: 'www.eski-forum.com/yazici', snip: '12 Mart 2012 · Windows XP’de yazıcı çevrimdışı oldu, 37 cevap…' },
  yaziciProg: { title: 'Yazıcı hatası onarım programı: ücretsiz indir', url: 'www.program-indir.com.tr', snip: 'Tüm yazıcı hatalarını tek tıkla çözen program. Hemen indirin!' },
  bozuldu: { title: 'bilgisayarım bozuldu yardım edin!!!', url: 'www.eski-forum.com/bozuldu', snip: '3 Mayıs 2011 · Bilgisayarım bozuldu, açılmıyor, ne yapacağım bilmiyorum…' },
  bozProg: { title: 'Bilgisayar onarım ve temizleme programları', url: 'www.program-indir.com.tr', snip: 'En iyi 10 onarım programı. İndirin, bilgisayarınız yeni gibi olsun.' },
  sesResmi: { title: 'Windows’ta ses sorunlarını giderme', url: 'support.microsoft.com/ses', snip: 'Microsoft Desteği · Windows 11 ve 10 · Hoparlör, ses düzeyi ve çıkış aygıtını denetleyin.' },
  sesForum: { title: 'sesim gitti, hoparlör çalışmıyor', url: 'www.eski-forum.com/ses', snip: '8 Ocak 2010 · Ses kartı bozulmuş, yenisini alın…' },
};
const ADS = {
  bozuldu: { title: 'Bilgisayarınız BOZULDU mu? Hemen ONARIN!', url: 'www.super-hizlandirici.xyz', snip: 'Ücretsiz tarama! Şimdi indirin!!!' },
  yazici: { title: 'Yazıcı çevrimdışı mı? Uzman destek hattı: 0850 000 00 00', url: 'www.super-hizlandirici.xyz/yazici', snip: '7/24 canlı destek, hemen arayın veya onarım programını indirin.' },
  ses: { title: 'Sesiniz mi gitti? Ses Onarıcı ile 1 dakikada düzeltin', url: 'www.super-hizlandirici.xyz', snip: 'Ücretsiz indirin, her ses sorununu çözer!!!' },
};

// Sorguya göre { ad, hits } ya da null (başka sorgularda sites.js kendi sonuçlarını kullanır)
export function sorunSonuc(q) {
  const n = norm(q);
  const w = (re) => re.test(n);
  if (w(/yazici/) && w(/cevrimdisi|offline/)) return { ad: ADS.yazici, hits: [RES.yaziciResmi, RES.yaziciForum, RES.yaziciProg] };
  if (w(/\bses\b/) && w(/gelmiyor|gitti/)) return { ad: ADS.ses, hits: w(/windows/) ? [RES.sesResmi, RES.sesForum] : [RES.sesForum, RES.bozProg, RES.sesResmi] };
  if (w(/bozul/) && !w(/yazici/)) return { ad: ADS.bozuldu, hits: [RES.bozuldu, RES.bozProg] };
  return null;
}

const NUM = '<b>0850 000 00 00</b>';

export function yaziciSayfa(path) {
  if (path !== '/cevrimdisi') return null;
  return page('Yazıcı çevrimdışı görünüyor', `<header class="pi-head">🖨 Yazıcı Destek</header><div class="pi"><h1>Yazıcı “Çevrimdışı” görünüyor: ne yapmalı?</h1>
    <p class="pi-meta">Renkli Yazıcı R-200 ve benzeri modeller · Windows 11 / 10 · Güncelleme: 14 Ekim 2026</p>
    <p><b>Çevrimdışı</b>, bilgisayarın yazıcıyla şu anda konuşamadığı anlamına gelir. Genellikle yazıcı kapalıdır ya da bağlantı gevşemiştir. Adımları <b>sırayla</b> deneyin:</p>
    <ol>
      <li>Yazıcının <b>açık</b> olduğuna ve ışıklarından birinin <b>kırmızı yanmadığına</b> bakın.</li>
      <li>Yazıcıyı kapatın, <b>30 saniye</b> bekleyin, yeniden açın.</li>
      <li>USB kablosunu çıkarıp yeniden takın. Kablosuz yazıcıysa yazıcı ile bilgisayarın <b>aynı Wi-Fi ağında</b> olduğuna bakın.</li>
      <li>Bilgisayarı yeniden başlatın.</li>
      <li><b>Ayarlar</b> &gt; <b>Bluetooth ve cihazlar</b> &gt; <b>Yazıcılar ve tarayıcılar</b> bölümünde yazıcınıza tıklayıp <b>Yazdırma kuyruğunu aç</b>’a basın. Açılan pencerede <b>Yazıcı</b> menüsüne tıklayın; <b>“Yazıcıyı çevrimdışı kullan”</b> seçili olmasın.</li>
      <li>Hâlâ olmuyorsa aşağıdaki yazıcı yazılımını (sürücüyü) bu sayfadan indirip kurun.</li>
    </ol>
    <p><a class="pi-real" data-download="R200_Surucu.exe">Sürücüyü indir (25 MB)</a></p>
    <p class="scam-note">Bu sayfa sizden şifre ya da kart bilgisi istemez. İstiyorsa yanlış sayfadasınız.</p></div>`);
}

export function forumSayfa(path) {
  if (path === '/yazici') {
    return page('yazıcım çevrimdışı yazıyor', `<header class="pi-head" style="background:#5d4037">💬 Hobi Forumu</header><div class="pi"><h1>yazıcım çevrimdışı yazıyor ne yapayım??</h1>
      <p class="pi-meta">Yazan: bilgisayarci_ahmet · <b>12 Mart 2012</b> · Windows XP</p>
      <p>Yazıcım “çevrimdışı” yazıyor, çıktı alamıyorum. Windows XP kullanıyorum. Yardım edin!</p>
      <hr><p><b>mehmet_usta</b> (2012): Başlat &gt; Yazıcılar ve Fakslar’dan “Çevrimiçi kullan” deyin, XP’de olur.</p>
      <p><b>hizli_bilgisayar</b> (2012): Bence format atın, hepsini çözer.</p>
      <p><b>yardimsever34</b> (2013): Bu programı indirin, her şeyi düzeltir: <a data-href="www.super-hizlandirici.xyz/yazici">Yazıcı Onarım Programı</a></p>
      <p><b>destek_hatti</b> (2013): Ben şu numarayı aradım, çok yardımcı oldular: ${NUM}</p>
      <p class="scam-note">Bu gönderi çok eski: o günün Windows XP’si içindir. Güvenli bağlantı da yok. Burada yazan adımlar bugünkü Windows 11’e uymaz.</p></div>`);
  }
  if (path === '/ses') {
    return page('sesim gitti', `<header class="pi-head" style="background:#5d4037">💬 Hobi Forumu</header><div class="pi"><h1>sesim gitti, hoparlör çalışmıyor</h1>
      <p class="pi-meta">Yazan: murat_k · <b>8 Ocak 2010</b> · Windows Vista</p>
      <p>Bilgisayardan ses gelmiyor, hoparlör çalışmıyor. Ne yapmalıyım?</p><hr><p><b>teknisyen_haluk</b> (2010): Denetim Masası’ndan “Ses ve Ses Aygıtları”na girin, ses kartı sürücüsünü güncelleyin. Vista’da böyle yapılır.</p>
      <p class="scam-note">Tarihe bakın: 2010, Windows Vista. Bu adımlar bugünkü Windows 11 ekranlarına uymaz; öneri eski sürüm içindir.</p></div>`);
  }
  if (path === '/bozuldu') {
    return page('bilgisayarım bozuldu', `<header class="pi-head" style="background:#5d4037">💬 Hobi Forumu</header><div class="pi"><h1>bilgisayarım bozuldu yardım edin!!!</h1>
      <p class="pi-meta">Yazan: ali_61 · <b>3 Mayıs 2011</b> · Windows Vista</p>
      <p>Bilgisayarım bozuldu, açılmıyor. Ne yapacağım bilmiyorum.</p><hr><p><b>usta_abi</b> (2011): Neresi bozuldu, ne yazıyor ekranda? Yazmadan kimse bir şey diyemez.</p>
      <p class="scam-note">Tarihe bakın: 2011. Sorunun ne olduğu bile yazılmamış; böyle bir soruya doğru cevap verilemez. Siz aramanızda sorunu açıkça yazın.</p></div>`);
  }
  return null;
}

export function hizlandiriciSayfa(path) {
  if (path !== '/yazici') return null;
  return page('!!! YAZICI HATASI !!!', `<div class="scam"><h1>⚠ DİKKAT! Yazıcınızda 14 HATA bulundu!</h1><p>Hemen uzman hattını arayın: ${NUM}</p><p>Ya da “Yazıcı Onarıcı”yı indirin, ödeme bilgilerinizi girin, yazıcınız hemen çalışsın!!!</p><div class="scam-btns"><button type="button" class="pi-ad red" data-ad="1">ŞİMDİ İNDİR VE ONAR</button></div><p class="scam-note">(Bu bir alıştırma sayfasıdır. Gerçekte böyle sayfalardaki numaraları aramayın, program indirmeyin, bilgi girmeyin. Telefonda “uzman” diye konuşan kişi sizden uzaktan bağlantı ya da para isteyebilir.)</p></div>`, 'scam-bg');
}

export const SORUN_SITES = {
  'support.microsoft.com': {
    name: 'Microsoft Desteği', secure: true,
    render() {
      return page('Windows’ta ses sorunlarını giderme', `<header class="ed-head" style="background:#0067b8">⊞ Microsoft Desteği</header><div class="ed"><h1>Windows’ta ses sorunlarını giderme</h1>
        <p class="pi-meta">Windows 11 ve Windows 10 · Güncelleme: 2026</p>
        <p>Sesiniz gelmiyorsa şu adımları <b>sırayla</b> deneyin:</p>
        <ol><li>Görev çubuğunun sağındaki <b>hoparlör simgesine</b> bakın: üstünde çarpı varsa ses kapalıdır, simgeye tıklayın.</li>
          <li>Ses düzeyi çubuğunu sağa çekin.</li><li>Hoparlörün ya da kulaklığın <b>prizde takılı</b> ve <b>açık</b> olduğuna bakın.</li>
          <li><b>Ayarlar</b> &gt; <b>Sistem</b> &gt; <b>Ses</b> bölümünde doğru hoparlörün seçili olduğuna bakın.</li><li>Bilgisayarı yeniden başlatın.</li></ol>
        <p class="scam-note">Microsoft sizi telefonla aramaz ve sizden para ya da şifre istemez.</p></div>`);
    },
  },
};
