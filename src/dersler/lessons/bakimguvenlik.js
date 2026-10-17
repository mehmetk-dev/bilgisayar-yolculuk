// 8. hafta ek dersi: bilgisayarın bakımı. Virüs taraması (bilgisayar ve USB bellek), güvenlik duvarı, Disk Temizleme.
import { desktopReady } from './common.js';
import { rehberSoru } from './kalip.js';

const ws = (page) => (c) => { const w = c.d.ensure('guvenlik'); w.api.onArgs?.({ page }); };

export const bakimGuvenlik = {
  id: 'bakim-guvenlik', icon: '🛡', title: 'Virüs taraması, güvenlik duvarı ve Disk Temizleme', minutes: 30, stage: 'desktop',
  desc: 'Virüs taraması, güvenlik duvarı ve gereksiz dosyaları silip yer açmak.',
  summary: [
    ['Windows Güvenliği', 'Windows\'un kendi virüs programı; ek program indirmeye gerek yok'],
    ['⚡ Hızlı tarama', 'Bilgisayarı birkaç dakikada tarar'],
    ['USB belleği tara', 'Başkasından aldığınız belleği açmadan önce'],
    ['Güvenlik duvarı', 'Açık kalmalı; internetten gelen izinsiz bağlantıyı durdurur'],
    ['Disk Temizleme', 'Geçici dosyaları siler, yer açar'],
    ['İndirilenler\'i silerken dikkat', 'Kendi indirdiğiniz fatura ve fotoğraflar oradadır'],
    ['Sahte virüs uyarısı', 'Siteden çıkan “virüs bulundu” yazılarına inanmayın; gerçek uyarı Windows\'tan gelir'],
  ],
  steps: [
    {
      title: 'Bilgisayarın sağlığı',
      html: `<p>Bilgisayarı <b>dişlerimizi fırçalamak</b> gibi düşünün: ara sıra bakım gerekir. Bugün üç iş yapacağız:</p>
        <ul class="big-list"><li>🛡 <b>Virüs taraması</b>: zararlı program var mı?</li><li>🧱 <b>Güvenlik duvarı</b>: açık mı?</li><li>🧹 <b>Disk Temizleme</b>: yer dolmuş mu, açalım</li></ul>
        <p class="mut">Windows'ta bunlar için ayrıca program almak gerekmez, hepsi hazır gelir. Sahte “virüs temizleyici” programlardan uzak durun.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); c.d.fs.plugUsb(false); },
    },
    {
      title: 'Windows Güvenliği\'ni açın',
      html: '<p>⊞ Başlat → <b>🛡 Windows Güvenliği</b>.</p>',
      mouse: '🖱 Başlat → Windows Güvenliği',
      check: (c) => !!c.d.find('guvenlik'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'guvenlik',
      done: 'Soldaki menüde virüs koruması, güvenlik duvarı ve Disk Temizleme bölümleri var. Şimdilik “Virüs ve tehdit koruması” açık.',
    },
    {
      title: 'Hızlı tarama',
      html: '<p><b>⚡ Hızlı tarama</b>\'ya tıklayın ve bitmesini bekleyin. Tarama sırasında bilgisayarı kullanmaya devam edebilirsiniz.</p>',
      setup: ws('virus'),
      on: (ev) => ev.type === 'scan-done' && ev.kind === 'quick',
      done: 'Tehdit bulunamadı. Bilgisayar güvenli. Ayda bir tarama yapmak yeterlidir; Windows zaten arka planda kendisi de tarar.',
    },
    {
      title: 'Güvenlik duvarı',
      html: '<p>Soldan <b>🧱 Güvenlik duvarı</b>\'na tıklayın ve okuyun. Durumun <b>açık</b> olduğunu görün.</p>',
      mouse: '🖱 Güvenlik duvarı',
      setup: ws('virus'),
      on: (ev) => ev.type === 'ws-page' && ev.page === 'duvar',
      done: 'Güvenlik duvarı bir bina girişindeki görevli gibi izinsiz gelenleri geri çevirir. Açık kalmalı.',
    },
    rehberSoru({
      title: 'Kapatalım mı?',
      html: '<p>Bir internet sitesi şöyle diyor: “Programı kurabilmek için önce <b>güvenlik duvarını kapatın</b>.” Ne yaparsınız?</p>',
      opts: ['Kapatırım, site öyle diyor', 'Kurulum bitince geri açmak şartıyla kapatırım', 'Kapatmam; böyle isteyen site şüphelidir'], ok: 2,
      wrong: 'Bu pek güvenli değil. Güvenilir programlar duvarı kapatmanızı istemez.',
      why: 'Doğru. Güvenlik duvarını kapatmanızı isteyen program ya da site çoğu zaman zararlıdır. Açık bırakın.',
    }),
    {
      title: 'USB belleği takın',
      html: `<p>Bir akraba size bir USB bellek verdi ve “fotoğraflar var” dedi. Açmadan önce taratacağız. Önce belleği takın:</p>
        <button type="button" class="btn primary usb-btn">💾 USB belleği bilgisayara tak</button>`,
      setup: (c) => {
        ws('virus')(c);
        document.querySelector('#stepBody .usb-btn').onclick = () => {
          c.d.plugUsb();
          if (!c.d.fs.find('usb', 'bedava-oyun.exe')) c.d.fs.create('usb', { type: 'file', name: 'bedava-oyun.exe', content: '' }, true);
        };
      },
      check: (c) => c.d.fs.usb,
      on: (ev) => ev.type === 'usb' && ev.on,
      done: 'Bellek takıldı. İçinde bir fotoğraf ve bir de garip bir program var.',
    },
    {
      title: 'USB belleği tarayın',
      html: `<p>Windows Güvenliği\'nde <b>Virüs ve tehdit koruması</b>\'na dönün ve <b>💾 USB belleği tara</b>\'ya tıklayın.</p>
        <p class="mut">Bu bir alıştırma penceresidir. Gerçek Windows\'ta USB belleği taramak için Dosya Gezgini\'nde sürücüye sağ tıklayıp <b>Microsoft Defender ile tara</b> seçin.</p>`,
      setup: ws('virus'),
      on: (ev, c) => {
        if (ev.type === 'scan-nousb') c.note('USB bellek takılı değil. Önce önceki adımdaki düğmeyle belleği takın.');
        return ev.type === 'scan-done' && ev.kind === 'usb' && ev.threats > 0;
      },
      done: 'Tehdit bulundu! Belleğin içindeki “bedava-oyun.exe” zararlı çıktı.',
    },
    {
      title: 'Tehdidi kaldırın',
      html: '<p><b>Tehditleri kaldır</b>\'a tıklayın. Zararlı dosya bellekten silinir.</p>',
      mouse: '🖱 Tehditleri kaldır',
      on: (ev) => ev.type === 'threat-remove',
      done: 'Bellek temizlendi. Bilmediğiniz kişilerden gelen belleği ve “.exe” programlarını açmadan önce hep taratın.',
    },
    {
      title: 'Disk Temizleme',
      html: `<p>Bilgisayarınızın diski neredeyse dolmuş. Soldan <b>🧹 Disk Temizleme</b>\'ye tıklayın; üstteki çubuğa ve boş alana bakın.</p>
        <p class="mut">Bu bir alıştırma penceresidir. Gerçek Windows\'ta Disk Temizleme ayrı bir programdır: Başlat\'a <b>Disk Temizleme</b> yazıp açın.</p>`,
      setup: ws('virus'),
      on: (ev) => ev.type === 'ws-page' && ev.page === 'disk',
    },
    {
      title: 'Güvenle temizleyin',
      html: `<p>Listede ön seçili olanlar (<b>geçici dosyalar, güncelleme artıkları, küçük resimler</b>) güvenle silinir. <b>İndirilenler</b> klasörü sarı: kendi dosyalarınız orada, <b>işaretlemeyin</b>.</p>
        <p>🗑 <b>Temizle</b>'ye tıklayın.</p>`,
      hint: 'İndirilenler satırının yanındaki kutu boş kalmalı. Sadece Temizle düğmesine basın.',
      setup: ws('disk'),
      on: (ev, c) => {
        if (ev.type === 'disk-downloads-ask') c.note('İndirilenler\'i silmeyin: faturalarınız, fotoğraflarınız orada olabilir. “Vazgeç”e basıp işareti kaldırın.');
        if (ev.type !== 'disk-clean') return false;
        c.s.dl = !!ev.downloads;
        return true;
      },
      done: (c) => c.s.dl
        ? 'Yer açıldı ama <b>İndirilenler</b> klasörünü de sildiniz. Gerçek hayatta oradaki faturalar, fotoğraflar geri gelmez; temizlemeden önce o klasöre bakın ve işaretini kaldırın.'
        : 'Yer açıldı! Üstteki çubuk kısaldı. Önemli dosyalara dokunmadan gereksizleri temizlediniz.',
    },
    rehberSoru({
      title: 'Bilgisayar yavaşladı',
      html: '<p>Bir tanıdığınızın bilgisayarının diski dolmuş, yavaşlamış. Önce ne önerirsiniz?</p>',
      opts: ['Hemen yeni bir bilgisayar satın almasını', 'Önce Disk Temizleme yapıp yedek almasını', 'Disk dolu olduğu için bütün dosyaları silmesini'], ok: 1,
      wrong: 'Bu çok büyük bir adım. Daha hafif bir çözüm var.',
      why: 'Doğru. Önce geçici dosyalar temizlenir; yer yine de yetmezse önemli dosyalar USB belleğe ya da buluta yedeklenip gerekmeyenler silinir.',
    }),
    rehberSoru({
      title: 'Sahte uyarı',
      html: '<p>Bir internet sitesinde kırmızı bir pencere çıktı: “<b>Bilgisayarınızda 7 virüs bulundu! Hemen bu programı indirin.</b>” Ne yaparsınız?</p>',
      opts: ['Pencereyi kapatır, Windows Güvenliği ile kendim tararım', 'Programı hemen indirir, kurarım; çok acil görünüyor', 'Pencerede yazan numarayı ararım'], ok: 0,
      wrong: 'Bu bir tuzak olabilir. Gerçek uyarılar nereden gelir?',
      why: 'Doğru. Bir internet sitesi bilgisayarınızı tarayamaz; bu pencere sahtedir. Gerçek virüs uyarısını Windows Güvenliği verir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayarınızın bakımını yapabiliyorsunuz:</p>' },
  ],
};
