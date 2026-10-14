// 7. hafta ek ders: temalar ve Mağaza. Tema (arka plan + vurgu rengi + açık/koyu mod), vurgu rengi, Mağaza'dan tema ve
// uygulama indirmek, taklit (sahte) uygulamayı tanımak, görev çubuğunu sola hizalamak.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { THEMES } from '../desktop.js';

const S = (c) => c.d.settings;

export const temalar = {
  id: 'temalar', icon: '🎨', title: 'Temalar ve Mağaza', minutes: 35, stage: 'desktop',
  desc: 'Bilgisayarı kişiselleştirmek: hazır tema, koyu mod, vurgu rengi; Mağaza\'dan tema ve uygulama indirmek; taklit uygulamayı yayımcısından, puanından ve istediği izinlerden tanımak.',
  summary: [
    ['Ayarlar → Kişiselleştirme → Temalar', 'Arka plan, renk ve koyu modu birlikte değiştirir'],
    ['Koyu mod', 'Pencereler ve görev çubuğu koyu renk olur; akşamları gözü yormaz'],
    ['Vurgu rengi', 'Başlat düğmesi, seçili düğmeler ve görev çubuğundaki çizginin rengi'],
    ['Mağaza', 'Uygulama ve temaları güvenle indirme yeri'],
    ['Yüklemeden önce', 'Yayımcıya, puana, değerlendirmelere ve istenen izinlere bakın'],
  ],
  steps: [
    {
      title: 'Bilgisayarınızı kişiselleştirin',
      html: `<p><b>Tema</b>, bilgisayarın görünüşünü bir seferde değiştirir: <b>arka plan resmi</b>, <b>vurgu rengi</b> ve <b>açık/koyu mod</b>.</p>
        <p>Bu derste önce hazır temaları deneyeceğiz, sonra <b>Mağaza</b>'dan yeni tema ve uygulama indireceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Kişiselleştirme',
      html: '<p>Masaüstünün boş bir yerine sağ tıklayıp <b>Kişiselleştir</b>\'i seçin ya da ⊞ Başlat → <b>⚙ Ayarlar</b> → <b>🎨 Kişiselleştirme</b>.</p>',
      mouse: '🖱 Ayarlar → Kişiselleştirme',
      check: (c) => c.d.find('settings') && c.d.root.querySelector('.st-themes'),
      on: (ev, c) => !!c.d.root.querySelector('.st-themes'),
      done: 'En üstte <b>Temalar</b> var. Küçük resimlerin altındaki renkli çizgi, temanın vurgu rengidir.',
    },
    {
      title: 'Koyu tema',
      html: '<p>Temalardan <b>Windows (koyu)</b>\'ya tıklayın. Görev çubuğuna ve pencerelere bakın.</p>',
      mouse: '🖱 Windows (koyu)',
      setup: (c) => maxed(c, 'settings', { page: 'personal' }),
      on: (ev) => ev.type === 'theme' && ev.key === 'koyu',
      done: 'Arka plan, görev çubuğu ve pencereler koyulaştı. Koyu mod akşamları gözü daha az yorar; gündüz ise açık mod daha kolay okunur.',
    },
    {
      title: 'Vurgu rengi',
      html: '<p>Aşağı inin ve <b>Renkler</b> bölümünden beğendiğiniz bir <b>vurgu rengi</b> seçin. Sonra görev çubuğundaki <b>Başlat</b> düğmesine bakın.</p>',
      mouse: '🖱 Renkler → bir renk kutusu',
      on: (ev) => ev.type === 'accent',
      done: 'Vurgu rengi değişti; tema adı da <b>Özel</b> oldu, çünkü temanın bir parçasını kendiniz değiştirdiniz. Başlat düğmesi ve açık programın altındaki çizgi artık bu renkte.',
    },
    {
      title: 'Mağaza\'dan yeni tema',
      html: `<ol class="steps"><li>Temaların altındaki <b>🛍 Mağaza'dan daha fazla tema alın</b>\'a tıklayın.</li><li>Mağaza\'da <b>Kapadokya</b> temasına tıklayın ve <b>Al</b>\'a basın.</li></ol>`,
      mouse: '🖱 Mağaza\'dan daha fazla tema alın → Kapadokya → Al',
      hint: 'Mağaza\'yı Başlat menüsünden de açabilirsiniz: 🛍 Mağaza → soldaki 🎨 Temalar.',
      on: (ev) => ev.type === 'store-install' && ev.kind === 'theme',
      done: 'Tema indirildi. Mağaza\'daki temalar ücretsizdir ve denetlenmiştir.',
    },
    {
      title: 'Temayı uygulayın',
      html: '<p>Mağaza\'daki <b>Uygula</b> düğmesine basın ya da Ayarlar → Kişiselleştirme\'de yeni temaya tıklayın.</p>',
      mouse: '🖱 Uygula',
      check: (c) => THEMES[S(c).theme]?.store,
      on: (ev) => ev.type === 'theme' && THEMES[ev.key]?.store,
      done: 'Yeni temanız uygulandı. İndirdiğiniz temalar artık Ayarlar\'daki listede de durur.',
    },
    {
      title: 'Mağaza\'dan uygulama',
      html: `<p>Programları internetteki rastgele sitelerden değil, mümkünse <b>Mağaza</b>'dan indirmek daha güvenlidir: reklam ve istenmeyen araç çubuğu gelmez.</p>
        <ol class="steps"><li>Mağaza'nın solundaki <b>🧩 Uygulamalar</b>\'a tıklayın.</li><li><b>📅 Takvim</b>\'e tıklayın, <b>Al</b>\'a basın.</li></ol>`,
      mouse: '🖱 Uygulamalar → Takvim → Al',
      setup: (c) => c.d.ensure('store'),
      on: (ev) => ev.type === 'store-install' && ev.id === 'takvim',
      done: 'Takvim yüklendi ve Başlat menüsüne eklendi. Kurulum sihirbazı, “İleri, İleri…” yok; Mağaza her şeyi kendisi yapar.',
    },
    {
      title: 'Taklit uygulamayı inceleyin',
      html: '<p>Mağaza\'da <b>Kelime İşlemci PRO 2026 Ücretsiz!!</b> uygulamasına tıklayıp sayfasını açın. <b>Yayımcısına</b>, <b>puanına</b>, <b>değerlendirmelere</b> ve <b>istediği izinlere</b> bakın. Yüklemeyin!</p>',
      mouse: '🖱 Kelime İşlemci PRO 2026 Ücretsiz!!',
      setup: (c) => c.d.ensure('store', { page: 'apps' }),
      on: (ev, c) => {
        if (ev.type === 'store-perms' && ev.fake && ev.answer === 'yes') c.warn('Yükle\'ye bastınız! Neyse ki Mağaza bu taklit uygulamayı engelledi. Gerçekte izinleri okuyup <b>Vazgeç</b> demek gerekir.');
        return ev.type === 'store-detail' && ev.id === 'fake';
      },
      done: 'Sayfayı açtınız. Şimdi işaretlere bakalım.',
    },
    rehberSoru({
      title: 'Soru',
      html: '<p>Bu uygulamayı neden yüklememeliyiz?</p>',
      opts: ['Boyutu çok küçük olduğu için', 'Yayımcısı tanınmıyor, puanı çok düşük ve bir yazı programı için rehber, mikrofon ve ödeme bilgisi istiyor', 'Adında “PRO” yazdığı için'],
      ok: 1,
      wrong: 'Asıl işaretler başka. Yayımcıya, yıldızlara ve “Bu uygulama şunlara erişebilir” bölümüne bakın.',
      why: 'Doğru. Bir yazı programının rehberinize ya da mikrofonunuza ihtiyacı yoktur. Bol ünlemli ad, düşük puan ve yeni açılmış hesaplardan gelen 5 yıldızlar da tehlike işaretidir.',
    }),
    {
      title: 'Takvim\'i açın',
      html: '<p>⊞ Başlat\'tan <b>📅 Takvim</b>\'i açın (ya da Mağaza\'daki <b>Aç</b> düğmesi). Bugünün tarihi renkli kutudadır; kırmızı günler resmî tatillerdir.</p>',
      mouse: '🖱 Başlat → Takvim',
      check: (c) => !!c.d.find('takvim'),
      on: (ev) => ev.type === 'app-open' && ev.app === 'takvim',
      done: 'Bir güne tıklayıp altına not yazabilirsiniz (ör. doktor randevusu).',
    },
    {
      title: 'Görev çubuğu',
      html: '<p>Son olarak: Ayarlar → Kişiselleştirme\'nin en altında <b>Görev çubuğu simgelerini sola hizala</b>\'yı açın. Eski Windows\'a alışkın olanlar böyle sever.</p>',
      mouse: '🖱 Ayarlar → Kişiselleştirme → Görev çubuğu',
      setup: (c) => c.d.ensure('settings', { page: 'personal' }),
      on: (ev) => ev.type === 'toggle' && ev.key === 'taskbarLeft',
      done: 'Başlat düğmesi sola geçti. Beğenmezseniz aynı anahtarı kapatmanız yeter.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bilgisayarınızı kişiselleştirdiniz:</p>' },
  ],
};
