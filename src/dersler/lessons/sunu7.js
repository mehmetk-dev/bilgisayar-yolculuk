// 12. hafta: MEB uygulama sınavına benzeyen yönlendirmesiz parkur. Boş sunudan 5 slayt; tema, yazı rengi ve hizalama,
// resim, bütün slaytlara aynı geçiş (Tümüne Uygula), bir nesneye animasyon, slayt numarası, F5, kaydetme, PDF olarak dışarı aktarma.
import { K, desktopReady, norm, put } from './common.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], master: {}, hf: {}, theme: 'beyaz' };
// Sunuda bir şey değişince (her ppt- olayında) durumu yeniden yoklar
const durum = (test) => ({ check: (c) => !!P(c) && !!test(c), on: (ev, c) => ev.type.startsWith('ppt-') && !!test(c) });
const bul = (c, w) => info(c).slides.find((s) => norm(s.title).includes(w));

export const sunuSinav = {
  id: 'sunu-sinav', icon: '📝', title: 'MEB sınav provası: 5 slaytlık sunu', minutes: 40, stage: 'desktop', parkur: true,
  desc: 'Sınavda istenenlere benzer görevler: boş sunudan 5 slayt, tema, yazı rengi ve hizalama, resim, bütün slaytlara geçiş, animasyon, slayt numarası, gösteri ve PDF. Süreler tutulur.',
  setup: (c) => { put(c, 'pictures', 'kütüphane.jpg', 'file', { emoji: '📚', bg: ['#ffe0b2', '#a1887f'] }); },
  steps: [
    {
      title: 'Sınav provası',
      html: `<p>MEB uygulama sınavında size bir kâğıt verilir ve bir sunu hazırlamanız istenir. Burada da öyle: görevler sırayla geliyor, <b>nasıl yapılacağı yazmıyor</b>. Takılırsanız 💡 İpucu; ipucunda gerçek PowerPoint'teki yol yazar.</p>
        <p>Konu: <b>Mahalle Kütüphanesi</b>'ni tanıtan 5 slaytlık bir sunu.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Programı açın', html: '<p>Sunu programını (<b>PowerPoint</b>) açın; boş bir sunu başlasın.</p>',
      hint: '⊞ Başlat → 📙 Sunu. Gerçek bilgisayarda: Başlat → PowerPoint → Boş sunu.',
      check: (c) => !!P(c),
      on: (ev) => ev.type === 'app-open' && ev.app === 'slides',
    },
    {
      title: '2. Başlık slaytı', html: '<p>İlk slaydın başlığına <b>Mahalle Kütüphanesi</b>, alt başlığına <b>adınızı ve soyadınızı</b> yazın.</p>',
      hint: '“Başlık eklemek için tıklayın” yazan kutuya tıklayıp yazın; sonra alttaki kutuya.',
      ...durum((c) => { const s = info(c).slides[0]; return s && norm(s.title).includes('kütüphane') && s.sub.length >= 3; }),
    },
    {
      title: '3. İkinci slayt', html: '<p><b>Başlık ve içerik</b> düzeninde yeni bir slayt ekleyin. Başlığı <b>Çalışma saatleri</b> olsun; altına en az <b>üç madde</b> yazın (ör. Hafta içi 09.00–18.00).</p>',
      hint: 'Giriş → Yeni Slayt ▾ → Başlık ve içerik. Her maddeden sonra Enter.',
      ...durum((c) => (bul(c, 'çalışma saat')?.items.length || 0) >= 3),
    },
    {
      title: '4. Üçüncü slayt', html: '<p>Yine <b>Başlık ve içerik</b> düzeninde bir slayt: başlığı <b>Neler var?</b>, altında en az <b>üç madde</b> (ör. Kitap, Gazete, Bilgisayar).</p>',
      hint: 'Önce soldan son slayda tıklayın; yeni slayt seçili slaydın altına gelir. Giriş → Yeni Slayt ▾ → Başlık ve içerik.',
      ...durum((c) => (bul(c, 'neler var')?.items.length || 0) >= 3),
    },
    {
      title: '5. Resimli slayt', html: '<p><b>Yalnızca başlık</b> düzeninde bir slayt ekleyin; başlığı <b>Kütüphaneden bir köşe</b> olsun. Bu slayda <b>Resimler</b> klasöründeki <b>kütüphane.jpg</b> resmini ekleyin.</p>',
      hint: 'Giriş → Yeni Slayt ▾ → Yalnızca başlık. Sonra Ekle → 🖼 Resim → kütüphane.jpg → Aç. Gerçek PowerPoint\'te: Ekle → Resimler → Bu Cihaz.',
      ...durum((c) => bul(c, 'bir köşe')?.img),
    },
    {
      title: '6. Son slayt', html: '<p>Sununun <b>en sonuna</b> bir slayt daha ekleyin; başlığı <b>Teşekkürler</b> olsun. Sunuda <b>5 slayt</b> olmalı.</p>',
      hint: 'Soldan son slayda tıklayın → Giriş → Yeni Slayt ▾ → Yalnızca başlık.',
      ...durum((c) => { const s = info(c).slides; return s.length >= 5 && norm(s[s.length - 1].title).includes('teşekkür'); }),
    },
    {
      title: '7. Tema', html: '<p>Sunuya beyaz yerine renkli bir <b>tasarım teması</b> verin.</p>',
      hint: 'Tasarım sekmesinden herhangi bir tema. Tema bütün slaytlara birden uygulanır.',
      ...durum((c) => info(c).theme && info(c).theme !== 'beyaz'),
    },
    {
      title: '8. Başlığı ortalayın', html: '<p><b>Çalışma saatleri</b> slaydının başlığını <b>ortalayın</b>.</p>',
      hint: 'Soldan o slayda tıklayın, sonra başlığın içine tıklayın → Giriş → Ortala. Gerçek PowerPoint\'te Ortala düğmesi Giriş sekmesinin Paragraf bölümündedir (Ctrl + E).',
      ...durum((c) => bul(c, 'çalışma saat')?.al?.title === 'center'),
    },
    {
      title: '9. Yazı rengi', html: '<p>Aynı başlığın <b>yazı rengini</b> değiştirin (ör. koyu kırmızı).</p>',
      hint: 'Başlığın içine tıklayın → Giriş → Yazı Tipi Rengi ▾ → bir renk. Gerçek PowerPoint\'te bu düğme kırmızı çizgili A harfidir; önce yazıyı seçmeniz gerekir.',
      ...durum((c) => !!bul(c, 'çalışma saat')?.fc?.title),
    },
    {
      title: '10. Bütün slaytlara geçiş', html: '<p><b>Bütün slaytlara aynı</b> geçiş efektini verin.</p>',
      hint: 'Geçişler sekmesinde bir geçiş seçin (ör. Solma), sonra sağdaki Tümüne Uygula\'ya basın. Gerçek PowerPoint\'te Tümüne Uygula, Geçişler sekmesinin Zamanlama bölümündedir.',
      ...durum((c) => { const s = info(c).slides; return s.length >= 5 && s.every((x) => x.trans !== 'none' && x.trans === s[0].trans); }),
    },
    {
      title: '11. Animasyon', html: '<p><b>Kütüphaneden bir köşe</b> slaydındaki <b>resme</b> bir giriş animasyonu verin.</p>',
      hint: 'Soldan resimli slayda tıklayın, sonra resmin üzerine tıklayın → Animasyonlar → Giriş öbeğinden bir efekt. Nesne seçilmeden efektler gri durur.',
      ...durum((c) => (bul(c, 'bir köşe')?.anims || []).some((a) => a.t === 'img' && a.kind === 'in')),
    },
    {
      title: '12. Slayt numarası', html: '<p>Slaytlara <b>slayt numarası</b> koyun; kapak (başlık) slaydında görünmesin.</p>',
      hint: 'Ekle → Slayt Numarası (ya da Ekle → Üst Bilgi ve Alt Bilgi). Pencerede Slayt numarası ve Başlık slaydında gösterme işaretlenir, Tümüne Uygula.',
      ...durum((c) => info(c).slideNum && info(c).hf?.hideTitle),
    },
    {
      title: '13. Gösteri', html: '<p>Slayt gösterisini <b>baştan</b> başlatın, sonuna kadar izleyin ve çıkın.</p>',
      hint: `${K('F5')} baştan başlatır (dizüstünde Fn + F5 gerekebilir). Tıklayarak ya da → ile ilerleyin, sonda ${K('Esc')}. Gerçek PowerPoint\'te: Slayt Gösterisi → Baştan Başla.`,
      on: (ev, c) => {
        if (ev.type === 'ppt-show-start') c.s.from0 = ev.from === 0 && !ev.rehearse;
        if (ev.type === 'ppt-show-end') c.s.end = true;
        if (ev.type !== 'ppt-show-exit') return false;
        if (!c.s.from0) { c.note('Gösteri baştan başlamadı. F5 ile 1. slayttan başlatın.'); return false; }
        if (!c.s.end) { c.note('Sona gelmeden çıktınız. F5 ile yeniden başlatıp son slayttan sonra da bir kez tıklayın.'); return false; }
        return true;
      },
    },
    {
      title: '14. Kaydedin', html: '<p>Sunuyu <b>Belgeler</b> klasörüne <b>kütüphane</b> adıyla kaydedin.</p>',
      hint: `${K('Ctrl', 'S')} → Belgeler → Dosya adı: kütüphane → Kaydet. Gerçek PowerPoint\'te ilk kayıtta Bu bilgisayar mı OneDrive mı, ona bakın.`,
      on: (ev, c) => {
        if (ev.type !== 'ppt-save') return false;
        if (!/kütüphane/i.test(ev.name) || ev.show) { c.note(`“${ev.name}” olarak kaydedildi. Dosya → Farklı Kaydet ile adı kütüphane, türü PowerPoint Sunusu (*.pptx) olarak kaydedin.`); return false; }
        return true;
      },
    },
    {
      title: '15. PDF', html: '<p>Sunuyu <b>PDF olarak dışarı aktarın</b> ve Belgeler\'e kaydedin.</p>',
      hint: 'Dosya → 📤 Dışarı Aktar → 📕 PDF/XPS Belgesi Oluştur → Kaydet. Gerçek PowerPoint\'te sağdaki PDF/XPS Oluştur\'a basıp açılan pencerede Yayımla denir.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-pdf') return false;
        if (ev.slides < 5) { c.note('PDF\'te 5\'ten az slayt var. Eksik slaytları ekleyip yeniden dışarı aktarın.'); return false; }
        return true;
      },
    },
    { final: true, title: 'Prova bitti! 📝', html: '<p>Sınavda istenen bir sunuyu baştan sona kendiniz hazırladınız. Aynı görevleri bir de <b>gerçek PowerPoint</b>\'te deneyin: 12. hafta ödevinde yolları yazıyor.</p>' },
  ],
};
