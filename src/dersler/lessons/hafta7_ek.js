// 7. hafta ek dersleri: Paint ile ev çizimi, tebrik kartı, ekran alıntısıyla yardım istemek, Ayarlar parkuru
import { K, desktopReady, maxed } from './common.js';

const paintReady = (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'paint'); };
const paintOpen = (c) => { if (!c.d.find('paint')) maxed(c, 'paint'); };
const settingsAt = (page) => (c) => { const w = c.d.ensure('settings'); if (page) w.api.go(page); };

// Paint'te belli bir şekli bekleyen adım
const shape = (kind, test = () => true) => (ev) => ev.type === 'paint-shape' && ev.shape === kind && test(ev);

export const evCiz = {
  id: 'ev-ciz', icon: '🏠', title: 'Paint ile ev çizelim', minutes: 25, stage: 'desktop',
  desc: 'Şekil araçlarıyla bir ev: dikdörtgen gövde, çizgilerle çatı, kapı ve pencereler, sarı güneş, doldurma, fırçayla çimen; kaydetme.',
  summary: [
    ['▭ Dikdörtgen', 'Bir köşeden karşı köşeye sürükleyin'],
    ['╱ Çizgi', 'Başlangıçtan bitişe sürükleyin'],
    ['◯ Elips', 'Shift basılıyken tam daire'],
    ['🪣 Doldur', 'Kapalı şeklin içine tıklayın'],
    ['🖌 Fırça', 'Kalın ve yumuşak çizgi'],
    ['Ctrl + Z', 'Beğenmediğinizi geri alın'],
  ],
  steps: [
    {
      title: 'Ne çizeceğiz?',
      html: '<p>Şekil araçlarıyla basit bir ev resmi yapacağız: <b>gövde, çatı, kapı, pencereler, güneş ve çimen</b>.</p><p>Beğenmediğiniz her şeyi ' + K('Ctrl', 'Z') + ' ile geri alabilirsiniz.</p>',
      setup: paintReady,
    },
    {
      title: 'Evin gövdesi',
      html: '<p><b>▭ Dikdörtgen</b> aracını seçin. Tuvalin ortasında, sol üstten sağ alta doğru sürükleyerek <b>büyük</b> bir dikdörtgen çizin.</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (shape('rect')(ev) && (ev.w < 120 || ev.h < 80)) c.note('Biraz daha büyük çizin; içine kapı ve pencere sığacak.');
        return shape('rect', (e) => e.w >= 120 && e.h >= 80)(ev);
      },
      done: 'Gövde hazır.',
    },
    {
      title: 'Çatı',
      html: '<p><b>╱ Çizgi</b> aracını seçin. Gövdenin sol üst köşesinden yukarı-ortaya, oradan sağ üst köşeye <b>iki çizgi</b> çekerek üçgen bir çatı yapın.</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (!shape('line')(ev)) return false;
        c.s.n = (c.s.n || 0) + 1;
        if (c.s.n === 1) c.note('Bir çizgi tamam, şimdi öbür yanı.');
        return c.s.n >= 2;
      },
      done: 'Çatı oldu.',
    },
    {
      title: 'Kapı',
      html: '<p>Rengi <b>kahverengi</b> yapın ve gövdenin altına, ortaya <b>uzun ince</b> bir dikdörtgen çizin: kapı.</p>',
      setup: paintOpen,
      on: shape('rect', (e) => e.h > e.w),
      done: 'Kapı yerinde.',
    },
    {
      title: 'Pencereler',
      html: '<p>Rengi <b>mavi</b> yapın ve kapının iki yanına iki küçük kare çizin.</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (!shape('rect')(ev)) return false;
        c.s.n = (c.s.n || 0) + 1;
        return c.s.n >= 2;
      },
    },
    {
      title: 'Güneş',
      html: '<p>Rengi <b>sarı</b> yapın, <b>◯ Elips</b> aracıyla sağ üst köşeye bir güneş çizin. Sonra <b>🪣 Doldur</b> ile içine tıklayıp sarıya boyayın.</p>',
      setup: paintOpen,
      on: (ev, c) => {
        if (shape('ellipse')(ev)) { c.s.e = true; c.note('Güneş çizildi. Şimdi Doldur aracıyla içine tıklayın.'); }
        return !!c.s.e && ev.type === 'paint-fill';
      },
      done: '☀ Güneş parlıyor.',
    },
    {
      title: 'Gövdeyi boyayın',
      html: '<p>Bir renk seçin (örneğin turuncu) ve <b>🪣 Doldur</b> ile evin gövdesine, kapı ve pencerelerin dışında bir yere tıklayın.</p>',
      hint: 'Boya bütün tuvale taştıysa çizgilerde boşluk vardır: Ctrl + Z ile geri alın ve boşluğu kapatın.',
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-fill',
    },
    {
      title: 'Çimen',
      html: '<p><b>🖌 Fırça</b> aracını ve <b>yeşil</b> rengi seçin. Evin altına sola-sağa sürükleyerek çimen çizin.</p>',
      setup: paintOpen,
      on: (ev) => ev.type === 'paint-draw' && ev.tool === 'brush' && ev.len > 100,
      done: 'Resminiz tamam!',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile resmi <b>evim</b> adıyla kaydedin.</p>`,
      setup: paintOpen,
      on: (ev) => ev.type === 'save' && ev.app === 'paint',
      done: (c) => 'Resminiz Resimler klasöründe.',
    },
    { final: true, title: 'Ne güzel bir ev! 🏠', html: '<p>Kullandığınız araçlar:</p>' },
  ],
};

export const tebrikKarti = {
  id: 'tebrik-karti', icon: '🎂', title: 'Paint ile tebrik kartı', minutes: 25, stage: 'desktop',
  desc: 'Orta seviye: arka planı boyamak, şekil ve doldurma, yazı eklemek, fırça kalınlığı, geri alma, kaydetme ve arka plan yapma.',
  summary: [
    ['🪣 Boş tuvale Doldur', 'Bütün arka planı boyar'],
    ['A Metin', 'Tıklayın, yazın, Enter'],
    ['Kalınlık', 'Fırçanın ve çizgilerin kalınlığı'],
    ['Ctrl + Z', 'Geri al'],
    ['Sağ tık → Masaüstü arka planı', 'Kartı masaüstüne koyar'],
  ],
  steps: [
    {
      title: 'Doğum günü kartı',
      html: '<p>Bir yakınınız için doğum günü kartı hazırlayacağız. Bu sefer adımlar kısa; araçları önceki derslerden hatırlayın. Takılırsanız 💡 İpucu.</p>',
      setup: paintReady,
    },
    {
      title: 'Arka plan rengi',
      html: '<p>Açık bir renk seçip (sarı, pembe…) <b>boş tuvali baştan sona boyayın</b>.</p>',
      hint: 'Doldur (🪣) aracını seçip boş tuvalin herhangi bir yerine bir kez tıklayın.',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-fill' && ev.pixels < 20000) c.note('Küçük bir alan boyandı. Boş, beyaz bir yere tıklayın.');
        return ev.type === 'paint-fill' && ev.pixels >= 20000;
      },
    },
    {
      title: 'Bir balon',
      html: '<p>Kartın üstüne büyükçe bir <b>balon</b> çizin (elips) ve içini başka bir renge boyayın.</p>',
      hint: '◯ Elips ile sürükleyin, sonra renk seçip Doldur ile içine tıklayın.',
      setup: paintOpen,
      on: (ev, c) => {
        if (shape('ellipse', (e) => e.w > 40)(ev)) c.s.e = true;
        return !!c.s.e && ev.type === 'paint-fill';
      },
    },
    {
      title: 'Balonun ipi',
      html: '<p>Balonun altından aşağı doğru bir ip çizin. Kalınlığı inceltmeyi unutmayın.</p>',
      hint: 'Kalem ya da Çizgi aracı. Kalınlık seçenekleri araçların yanında.',
      setup: paintOpen,
      on: (ev) => shape('line')(ev) || (ev.type === 'paint-draw' && ev.len > 40),
    },
    {
      title: 'Yazı',
      html: '<p><b>A Metin</b> aracıyla kartın ortasına <b>İyi ki doğdun!</b> yazın.</p>',
      hint: 'Metin aracını seçin, tuvale tıklayın, yazıp Enter\'a basın.',
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type !== 'paint-text') return false;
        if (!/doğdun/i.test(ev.text)) { c.note(`“${ev.text}” yazıldı. Kartta <b>İyi ki doğdun!</b> yazsın.`); return false; }
        return true;
      },
      done: 'Kartın mesajı hazır.',
    },
    {
      title: 'Süsleyin ve geri alın',
      html: `<p>Fırçanın <b>kalınlığını değiştirin</b> ve kartın kenarlarına süs çizin. Sonra son çizdiğinizi ${K('Ctrl', 'Z')} ile geri alıp yeniden çizin.</p>`,
      setup: paintOpen,
      on: (ev, c) => {
        if (ev.type === 'paint-size') c.s.size = true;
        if (ev.type === 'paint-draw' && c.s.size) c.s.drew = true;
        if (ev.type === 'paint-undo' && c.s.drew) { c.s.undo = true; c.note('Geri alındı. Şimdi yeniden çizin.'); }
        return !!c.s.undo && ev.type === 'paint-draw';
      },
    },
    {
      title: 'Kaydedin',
      html: '<p>Kartı <b>doğum günü kartı</b> adıyla kaydedin.</p>',
      hint: 'Ctrl + S.',
      setup: paintOpen,
      on: (ev) => ev.type === 'save' && ev.app === 'paint',
    },
    {
      title: 'Arka plan yapın',
      html: '<p>Paint\'i kapatın. Dosya Gezgini\'nde <b>Resimler</b>\'deki kartınıza sağ tıklayıp <b>Masaüstü arka planı olarak ayarla</b>\'yı seçin.</p>',
      on: (ev) => ev.type === 'wallpaper' && ev.custom,
      done: 'Kartınız masaüstünde! Gerçekte bu resmi e-postayla ya da mesajla da gönderebilirsiniz.',
    },
    { final: true, title: 'İyi ki doğdun! 🎂', html: '<p>Kartınız hazır:</p>' },
  ],
};

export const alintiPratik = {
  id: 'alinti-pratik', icon: '🆘', title: 'Ekran alıntısıyla yardım istemek', minutes: 20, stage: 'desktop',
  desc: 'Bir hata sayfasının resmini almak, Paint\'te sorunlu yeri kırmızıyla işaretlemek ve kaydetmek: yardım isterken en büyük kolaylık.',
  summary: [
    ['⊞ + Shift + S', 'Gerçek bilgisayarda Ekran Alıntısı'],
    ['Alanı sürükleyin', 'Yalnızca gerekli kısmı alın'],
    ['Ctrl + V', 'Paint\'e, e-postaya, WhatsApp\'a yapıştırır'],
    ['Kırmızı daire', 'Sorunlu yeri gösterir'],
    ['Dikkat', 'Şifre, kart numarası görünen ekranların resmini paylaşmayın'],
  ],
  steps: [
    {
      title: 'Bir sorun çıktı',
      html: '<p>Belediyenin randevu sayfasına girmek istediniz ama sayfa açılmadı. Torununuza sormak istiyorsunuz. Anlatmak yerine <b>ekranın resmini</b> göndermek çok daha kolaydır.</p>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: 'www.belediye-randevu.com.tr' }); },
    },
    {
      title: 'Ekran Alıntısı\'nı açın',
      html: '<p>Başlat\'tan arayarak <b>Ekran Alıntısı</b>\'nı açın.</p>',
      hint: 'Başlat → “alıntı” yazın → Enter.',
      on: (ev) => ev.type === 'app-open' && ev.app === 'snip',
    },
    {
      title: 'Hata yazısının resmini alın',
      html: '<p><b>＋ Yeni</b>\'ye tıklayın. Ekran soluklaşınca hata yazısının olduğu bölgeyi <b>çapraz sürükleyerek</b> seçin.</p>',
      hint: 'Sol tuşu basılı tutun, hata yazısının sol üstünden sağ altına doğru sürükleyip bırakın.',
      on: (ev, c) => {
        if (ev.type === 'snip-cancel' && ev.small) c.note('Alan çok küçüktü; biraz daha büyük sürükleyin.');
        return ev.type === 'snip';
      },
      done: 'Resim panoya alındı.',
    },
    {
      title: 'Paint\'e yapıştırın',
      html: `<p>Paint'i açın ve ${K('Ctrl', 'V')} ile yapıştırın.</p>`,
      on: (ev) => ev.type === 'paint-paste',
    },
    {
      title: 'Sorunlu yeri işaretleyin',
      html: '<p><b>Kırmızı</b> rengi ve <b>◯ Elips</b> aracını seçip hata yazısının çevresine bir daire çizin.</p>',
      on: (ev, c) => {
        if (shape('ellipse')(ev) && ev.colorName !== 'Kırmızı') c.note(`Daire ${ev.colorName.toLowerCase()} oldu. Kırmızı daha dikkat çeker: Ctrl + Z, kırmızıyı seçip yeniden çizin.`);
        return shape('ellipse', (e) => e.colorName === 'Kırmızı')(ev);
      },
      done: 'Bakan kişi sorunu hemen görür.',
    },
    {
      title: 'Kaydedin',
      html: '<p>Resmi <b>hata mesajı</b> adıyla kaydedin.</p>',
      hint: 'Ctrl + S.',
      on: (ev) => ev.type === 'save' && ev.app === 'paint',
      done: 'Resimler klasörüne kaydedildi; artık e-postaya ya da mesaja ekleyebilirsiniz.',
    },
    {
      title: 'Gerçek hayatta',
      html: `<ol class="steps"><li>${K('⊞', 'Shift', 'S')} ile alanı seçin.</li><li>WhatsApp Web'de ya da e-postada mesaj kutusuna tıklayıp ${K('Ctrl', 'V')}.</li><li>Altına kısaca ne yapmaya çalıştığınızı yazın.</li></ol>
        <div class="box">⚠ Ekranda şifre, kart numarası ya da kimlik bilgisi görünüyorsa o resmi kimseyle paylaşmayın.</div>`,
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Yardım istemenin en kolay yolunu öğrendiniz:</p>' },
  ],
};

export const ayarlarParkur = {
  id: 'ayarlar-parkur', icon: '🏁', title: 'Ayarlar parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: 11 görev, yönlendirme yok. Koyu mod, arka plan, parlaklık, yazı boyutu, Wi-Fi, saat dilimi, güncelleme. Süreler tutulur.',
  steps: [
    {
      title: 'Ayarlar parkuru',
      html: '<p>Ayarlar\'da öğrendiklerinizi <b>11 görevle</b> tekrar edeceğiz. Nasıl yapılacağı yazmıyor; takılırsanız 💡 İpucu.</p><div class="box">Eğitmen notu: son ekranda her görevin süresi görünür.</div>',
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    { title: '1. Ayarlar\'ı açın', html: '<p><b>Ayarlar</b> uygulamasını açın.</p>', hint: 'Başlat → ⚙ Ayarlar.', on: (ev) => ev.type === 'app-open' && ev.app === 'settings' },
    { title: '2. Koyu mod', html: '<p><b>Koyu modu</b> açın.</p>', hint: 'Kişiselleştirme → Renkler → Koyu mod.', setup: settingsAt(), on: (ev) => ev.type === 'toggle' && ev.key === 'dark' && ev.on },
    { title: '3. Açık moda dönün', html: '<p>Koyu modu yeniden <b>kapatın</b>.</p>', setup: settingsAt(), on: (ev) => ev.type === 'toggle' && ev.key === 'dark' && !ev.on },
    { title: '4. Arka plan', html: '<p>Masaüstü arka planını <b>Orman</b> yapın.</p>', hint: 'Kişiselleştirme → Arka plan.', setup: settingsAt(), on: (ev) => ev.type === 'wallpaper' && ev.key === 'orman' },
    {
      title: '5. Parlaklık', html: '<p>Ekran parlaklığını <b>60 ile 80 arasına</b> getirin.</p>', hint: 'Sistem → Ekran → Parlaklık çubuğu.', setup: settingsAt(),
      on: (ev, c) => ev.type === 'setting' && ev.key === 'brightness' && c.d.settings.brightness >= 60 && c.d.settings.brightness <= 80,
    },
    { title: '6. Yazıları büyütün', html: '<p>Metin boyutunu <b>%130</b> yapıp uygulayın.</p>', hint: 'Erişilebilirlik → Metin boyutu çubuğu → Uygula.', setup: settingsAt(), on: (ev) => ev.type === 'text-scale' && ev.value === 130 },
    { title: '7. Eski boyuta dönün', html: '<p>Metin boyutunu yeniden <b>%100</b> yapın.</p>', setup: settingsAt(), on: (ev) => ev.type === 'text-scale' && ev.value === 100 },
    {
      title: '8. Açık ağa bağlanın', html: '<p>Bir kafedesiniz: <b>Kafe_Ücretsiz</b> ağına bağlanın.</p>', hint: 'Ağ ve İnternet → Kafe_Ücretsiz → Bağlan. Çıkan uyarıyı okuyun.', setup: settingsAt(),
      on: (ev) => ev.type === 'wifi-connect' && ev.ok && /Kafe/.test(ev.name),
      done: 'Bağlandınız; ama bu ağ şifresiz ve güvensiz. Burada banka işlemi yapmayın!',
    },
    {
      title: '9. Ev ağına dönün', html: '<p>Eve döndünüz: <b>EvAğı</b>\'na bağlanın. Şifre modemin altında yazıyor: <b>evagi2024</b></p>', hint: 'EvAğı → Bağlan → şifreyi yazıp İleri.', setup: settingsAt(),
      on: (ev, c) => {
        if (ev.type === 'wifi-connect' && !ev.ok) c.note('Şifre yanlış. Büyük-küçük harfe dikkat ederek yeniden yazın: evagi2024');
        return ev.type === 'wifi-connect' && ev.ok && ev.name === 'EvAğı';
      },
    },
    {
      title: '10. Saat dilimi', html: '<p>Londra\'daki oğlunuzun saatini merak ettiniz. Saat dilimini <b>Londra</b> yapın, saatin değiştiğini görün, sonra yeniden <b>İstanbul</b> yapın.</p>', hint: 'Saat ve dil → Saat dilimi listesi.', setup: settingsAt(),
      on: (ev, c) => {
        if (ev.type === 'tz' && /Londra/.test(ev.tz)) { c.s.l = true; c.note('Sağ alttaki saat 3 saat geri gitti. Şimdi yeniden İstanbul.'); }
        return !!c.s.l && ev.type === 'tz' && /İstanbul/.test(ev.tz);
      },
    },
    { title: '11. Güncelleştirmeler', html: '<p>Bilgisayarın güncel olup olmadığını <b>denetleyin</b>.</p>', hint: 'Windows Update → Güncelleştirmeleri denetle.', setup: settingsAt(), on: (ev) => ev.type === 'update-check' },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Bütün ayarları kendiniz yaptınız.</p>' },
  ],
};
