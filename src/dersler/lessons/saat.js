// 7. hafta ek dersi: saati ve tarihi değiştirmek. Yanlış saat siteleri açtırmaz; otomatik ve elle ayar; 12/24 saat; takvim; saat dilimi.
import { K, desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';

const WRONG = new Date(2019, 2, 3, 9, 12).getTime() - Date.now(); // saat 3 Mart 2019, 09.12 diyor
const onTime = (c) => Math.abs(c.d.now() - Date.now()) < 864e5;
const trDate = () => new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const settingsAt = (c) => { const w = c.d.ensure('settings'); w.api.go('time'); };
const onPage = (page) => ({ check: (c) => !!c.d.find('settings')?.el.querySelector(`[data-page="${page}"].on`), on: (ev) => ev.type === 'settings-page' && ev.page === page });

export const saatTarih = {
  id: 'saat-tarih', icon: '🕒', title: 'Saati ve tarihi değiştirmek', minutes: 30, stage: 'desktop',
  desc: 'Sağ alttaki saat yanlışsa ne olur (siteler açılmaz), saati otomatik ve elle ayarlamak, 24 saatlik biçim, takvim, saat dilimi; saat sürekli sıfırlanıyorsa neden.',
  desktop: { settings: { autoTime: false, timeOffset: WRONG } },
  summary: [
    ['Sağ alttaki saate tıklayın', 'Takvim ve tarih açılır; “Tarih ve saat ayarları” bağlantısı da oradadır'],
    ['Saate sağ tık', 'Tarih ve saati ayarla'],
    ['Ayarlar → Saat ve dil', 'Saati otomatik ayarla (internet gerekir), elle ayarla, saat dilimi, 24 saatlik biçim'],
    ['Saati otomatik ayarla', 'Açık kalsın: bilgisayar saati internetten kendiliğinden düzeltir'],
    ['Elle ayarlama', 'İnternet yoksa: Otomatiği kapatın → Değiştir → tarih ve saati yazın'],
    ['Yanlış saat = site açılmaz', 'Güvenli sitelerde “Bağlantınız gizli değil” hatası; önce tarih ve saate bakın'],
    ['Saat sürekli sıfırlanıyorsa', 'Anakartın düğme pili bitmiştir; teknisyen değiştirir'],
  ],
  steps: [
    {
      title: 'Saat neden önemli?',
      html: `<p>Sağ alttaki saat yalnızca “ne zaman” demek için değildir. <b>Yanlış tarih ve saat</b> randevu ve fatura işlerinde karışıklık yaratır; üstelik <b>internet sitelerinin açılmasını bile engelleyebilir</b>.</p>
        <p>Bu bilgisayarın saati yanlış kurulmuş. Önce neler olduğunu göreceğiz, sonra düzelteceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Saate tıklayın',
      html: () => `<p>Sağ alttaki <b>saate</b> (ve tarihe) tıklayın. Bir takvim açılır.</p><p>Bugün gerçekte <b>${trDate()}</b>. Bilgisayar ne diyor?</p>`,
      mouse: '🖱 Sağ alt: saat',
      on: (ev) => ev.type === 'calendar',
      done: () => `Bilgisayar tarihi <b>3 Mart 2019</b> sanıyor. Aradan yıllar geçmiş! Eski bilgisayarlarda, pil bittiğinde ya da internetle hiç buluşmayınca saat böyle şaşabilir.`,
    },
    {
      title: 'Bir siteyi açın',
      html: '<p>Takvimi kapatın. ⊞ Başlat → <b>🌐 İnternet</b> ile tarayıcıyı açıp adres çubuğuna <b>www.hava-durumu.com.tr</b> yazın.</p>',
      setup: (c) => maxed(c, 'browser'),
      on: (ev) => ev.type === 'web-clock-error',
      done: 'Site açılmadı! <b>“Bağlantınız gizli değil”</b> yazıyor. Güvenli (🔒) siteler, bilgisayarınızın saatiyle kendi sertifikalarının tarihini karşılaştırır; saat 2019 ise sertifika “henüz geçersiz” görünür. Bilgisayar ve site sağlam: sorun saatte.',
    },
    {
      title: 'Ayarları açın',
      html: '<p>Hata sayfasındaki <b>🕒 Tarih ve saat ayarlarını aç</b> düğmesine tıklayın.</p>',
      hint: 'Düğme hata sayfasının ortasında. (Başlat → Ayarlar → Saat ve dil de olur.)',
      ...onPage('time'),
    },
    {
      title: 'Saati otomatik ayarlayın',
      html: '<p><b>Saati otomatik olarak ayarla</b> düğmesini <b>Açık</b> yapın. Bilgisayar saati internetten öğrenip düzeltir.</p>',
      setup: settingsAt,
      check: (c) => c.d.settings.autoTime,
      on: (ev) => ev.type === 'toggle' && ev.key === 'autoTime' && ev.on,
      done: 'Saat bir anda doğru oldu. Bu düğmenin <b>açık kalması</b> en iyisidir: bilgisayar saati kendisi düzeltir, kayma olmaz.',
    },
    {
      title: 'Siteyi yeniden deneyin',
      html: '<p>İnternet penceresine dönün ve <b>⟳ Yeniden dene</b>\'ye (ya da yenile düğmesine) tıklayın.</p>',
      mouse: '🖱 ⟳ Yeniden dene',
      setup: (c) => maxed(c, 'browser'),
      on: (ev, c) => ev.type === 'web-reload' && onTime(c),
      done: 'Site açıldı! Bir “bağlantı güvenli değil” hatası gördüğünüzde ilk kontrol edilecek şey: <b>saat ve tarih</b>.',
    },
    {
      title: 'Otomatiği kapatın',
      html: '<p>İnternet yokken ya da özel bir sebeple saati <b>elle</b> değiştirmek gerekebilir. Ayarlar → Saat ve dil sayfasına dönüp <b>Saati otomatik olarak ayarla</b>\'yı <b>Kapalı</b> yapın.</p>',
      setup: settingsAt,
      on: (ev) => ev.type === 'toggle' && ev.key === 'autoTime' && !ev.on,
      done: 'Otomatik ayar kapalı. Artık “Tarih ve saati el ile ayarla” düğmesi etkin.',
    },
    {
      title: 'Elle ayarlayın',
      html: '<p><b>Tarih ve saati el ile ayarla</b> satırındaki <b>Değiştir</b>\'e tıklayın. Açılan kutulardan saati <b>15:30</b> yapıp <b>Değiştir</b>\'e basın.</p>',
      hint: 'Saat kutusundaki saat ve dakika bölümlerine tıklayıp 15 ve 30 yazın. Tarihe dokunmanıza gerek yok.',
      setup: settingsAt,
      on: (ev, c) => {
        if (ev.type !== 'time-set') return false;
        if (ev.hours !== 15 || ev.minutes !== 30) { c.note(`Saati ${ev.hours}:${String(ev.minutes).padStart(2, '0')} yaptınız. 15:30 olmalı; yeniden Değiştir'e tıklayın.`); return false; }
        return true;
      },
      done: 'Sağ alttaki saat 15:30 oldu. Elle ayarlanan saat zamanla kayar ve bilgisayar yeniden başlayınca bazen sıfırlanır; bu yüzden mümkünse otomatiği kullanın.',
    },
    {
      title: 'Otomatiğe dönün',
      html: '<p>Şimdi <b>Saati otomatik olarak ayarla</b>\'yı yeniden <b>Açık</b> yapın. Ortak bilgisayarı doğru saatte bırakmak gerekir.</p>',
      setup: settingsAt,
      on: (ev, c) => ev.type === 'toggle' && ev.key === 'autoTime' && ev.on && onTime(c),
      done: 'Saat yeniden doğru. Her seferinde bu düğmeyi açık bırakmak sorunların çoğunu önler.',
    },
    {
      title: '24 saatlik biçim',
      html: '<p>Saat <b>14:05</b> mi, yoksa <b>02:05 ÖS</b> gibi mi görünsün? <b>24 saatlik biçim</b> düğmesini <b>Kapalı</b> yapıp sağ alttaki saate bakın; sonra yeniden <b>Açık</b> yapın.</p>',
      on: (ev, c) => { if (ev.type === 'toggle' && ev.key === 'time24' && !ev.on) c.s.off = true; return ev.type === 'toggle' && ev.key === 'time24' && ev.on && !!c.s.off; },
      done: 'ÖÖ/ÖS (öğleden önce/sonra) 12 saatlik düzendir; Türkiye\'de çoğu kişi 24 saatlik biçimi tercih eder: 14.05 demek 2.05 öğleden sonra demektir.',
    },
    {
      title: 'Saate sağ tıklayın',
      html: '<p>Bir kısayol daha: sağ alttaki saate <b>sağ tıklayın</b>. <b>Tarih ve saati ayarla</b> çıkar; doğrudan bu sayfaya götürür.</p>',
      mouse: '🖱 Saate sağ tık',
      on: (ev) => ev.type === 'context' && ev.kind === 'clock',
      done: 'İşte o menü. Tıklarsanız aynı Saat ve dil sayfası açılır.',
    },
    rehberSoru({
      title: 'Saat hep sıfırlanıyor',
      html: '<p>Bir komşunuzun masaüstü bilgisayarı <b>her kapatıp açtığında</b> saati 2010 yılına dönüyor. Ayarlayınca bir süre doğru, kapatınca yine bozuluyor. Neden?</p>',
      opts: ['Windows kötü kurulmuş', 'Anakartın üzerindeki küçük düğme pili bitmiş; teknisyen yenisini takar', 'Virüs bulaşmış'], ok: 1,
      wrong: 'Bilgisayar kapalıyken saati tutan bir şey olmalı. Neydi o?',
      why: 'Bilgisayar kapalıyken saati anakartın üstündeki küçük <b>düğme pil</b> (CR2032) tutar. Bitince saat sıfırlanır. Pil birkaç liralıktır; takmak da kolaydır. Teknik servis ya da bilen biri yapabilir.',
    }),
    rehberSoru({
      title: 'İlk neye bakarsınız?',
      html: '<p>Bir tanıdığınız: “Bankanın sitesi açılmıyor, <b>Bağlantınız gizli değil</b> diyor; başka siteler açılıyor.” Önce neye bakarsınız?</p>',
      opts: ['Bilgisayarın tarih ve saatinin doğru olup olmadığına', 'Bankayı aramaya', 'Bilgisayarı kapatıp açmaya'], ok: 0,
      wrong: 'Hata sertifikayla ilgili. Sertifikanın tarihini bilgisayar neyle karşılaştırır?',
      why: 'Doğru: tarih ve saat. Çoğu zaman yanlış tarih yüzünden güvenli siteler açılmaz. Saat doğruysa o zaman sitedeki sorun ya da sahte bir site olabilir; sormadan şifre yazmayın.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Saati ve tarihi ayarlamayı öğrendiniz:</p>' },
  ],
};
