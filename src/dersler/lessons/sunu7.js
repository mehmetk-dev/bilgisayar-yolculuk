// 12. hafta: MEB uygulama sınavına benzeyen yönlendirmesiz parkur. Boş sunudan 5 slayt; tema, yazı rengi ve hizalama,
// resim, bütün slaytlara aynı geçiş (Tümüne Uygula), bir nesneye animasyon, slayt numarası, F5, kaydetme, PDF olarak dışarı aktarma.
import { K, desktopReady, norm, put } from './common.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], master: {}, hf: {}, theme: 'beyaz' };
// Sunuda bir şey değişince (her ppt- olayında) durumu yeniden yoklar
const durum = (test) => ({ check: (c) => !!P(c) && !!test(c), on: (ev, c) => ev.type.startsWith('ppt-') && !!test(c) });
const slidesMatch = [
  (s) => s.layout === 'title' && norm(s.title) === 'mahalle kütüphanesi' && norm(s.sub).split(' ').length >= 2,
  (s) => s.layout === 'content' && norm(s.title) === 'çalışma saatleri' && s.items.length >= 3,
  (s) => s.layout === 'content' && norm(s.title) === 'neler var' && s.items.length >= 3,
  (s) => s.layout === 'only' && norm(s.title) === 'kütüphaneden bir köşe'
    && s.imgSource?.folder === 'pictures' && s.imgSource.name.toLocaleLowerCase('tr') === 'kütüphane.jpg',
  (s) => s.layout === 'only' && norm(s.title) === 'teşekkürler',
];
const firstSlidesMatch = (slides, count) => slides.length >= count
  && slidesMatch.slice(0, count).every((match, i) => match(slides[i]));
const hasSameTransition = (slides) => slides.every((s) => s.trans && s.trans !== 'none' && s.trans === slides[0].trans);
function readyForShow(d, c) {
  const { slides } = d;
  if (slides.length !== 5 || !firstSlidesMatch(slides, 5)) {
    c.note('Beş slaydın sırasını, düzenlerini ve içeriklerini kontrol edin. 4. slaytta Resimler klasöründen kütüphane.jpg olmalı.');
    return false;
  }
  if (slides.some((s) => s.hidden) || !hasSameTransition(slides)) {
    c.note('Beş slaydın hepsi görünür olmalı ve aynı geçiş efektini kullanmalı.');
    return false;
  }
  if (!d.theme || d.theme === 'beyaz' || slides[1].al?.title !== 'center' || !slides[1].fc?.title
    || !slides[3].anims?.some((a) => a.t === 'img' && a.kind === 'in') || !d.slideNum || !d.hf?.hideTitle) {
    c.note('Renkli temayı, 2. slaydın başlık biçimini, resmin giriş animasyonunu ve kapak hariç slayt numaralarını kontrol edin.');
    return false;
  }
  return true;
}

const blankPresentation = (c) => {
  const d = info(c);
  return !d.fileName && d.slides.length === 1 && d.slides[0].layout === 'title' && !d.slides[0].title && !d.slides[0].sub;
};

export const sunuSinav = {
  id: 'sunu-sinav', icon: '📝', title: 'MEB sınav provası: 5 slaytlık sunu', minutes: 40, stage: 'desktop', parkur: true, progressVersion: 2,
  restartOnResume: true,
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
      check: blankPresentation,
      on: (ev, c) => ev.type === 'app-open' && ev.app === 'slides' && blankPresentation(c),
    },
    {
      title: '2. Başlık slaytı', html: '<p>İlk slaydın başlığına <b>Mahalle Kütüphanesi</b>, alt başlığına <b>adınızı ve soyadınızı</b> yazın.</p>',
      hint: '“Başlık eklemek için tıklayın” yazan kutuya tıklayıp yazın; sonra alttaki kutuya.',
      ...durum((c) => firstSlidesMatch(info(c).slides, 1)),
    },
    {
      title: '3. İkinci slayt', html: '<p><b>Başlık ve içerik</b> düzeninde yeni bir slayt ekleyin. Başlığı <b>Çalışma saatleri</b> olsun; altına en az <b>üç madde</b> yazın (ör. Hafta içi 09.00–18.00).</p>',
      hint: 'Giriş → Yeni Slayt ▾ → Başlık ve içerik. Her maddeden sonra Enter.',
      ...durum((c) => firstSlidesMatch(info(c).slides, 2)),
    },
    {
      title: '4. Üçüncü slayt', html: '<p>Yine <b>Başlık ve içerik</b> düzeninde bir slayt: başlığı <b>Neler var?</b>, altında en az <b>üç madde</b> (ör. Kitap, Gazete, Bilgisayar).</p>',
      hint: 'Önce soldan son slayda tıklayın; yeni slayt seçili slaydın altına gelir. Giriş → Yeni Slayt ▾ → Başlık ve içerik.',
      ...durum((c) => firstSlidesMatch(info(c).slides, 3)),
    },
    {
      title: '5. Resimli slayt', html: '<p><b>Yalnızca başlık</b> düzeninde bir slayt ekleyin; başlığı <b>Kütüphaneden bir köşe</b> olsun. Bu slayda <b>Resimler</b> klasöründeki <b>kütüphane.jpg</b> resmini ekleyin.</p>',
      hint: 'Giriş → Yeni Slayt ▾ → Yalnızca başlık. Sonra Ekle → 🖼 Resim → kütüphane.jpg → Aç. Gerçek PowerPoint\'te: Ekle → Resimler → Bu Cihaz.',
      ...durum((c) => firstSlidesMatch(info(c).slides, 4)),
    },
    {
      title: '6. Son slayt', html: '<p>Sununun <b>en sonuna</b> <b>Yalnızca başlık</b> düzeninde bir slayt ekleyin; başlığı <b>Teşekkürler</b> olsun. Sunuda <b>5 slayt</b> olmalı.</p>',
      hint: 'Soldan son slayda tıklayın → Giriş → Yeni Slayt ▾ → Yalnızca başlık.',
      ...durum((c) => { const { slides } = info(c); return slides.length === 5 && firstSlidesMatch(slides, 5); }),
    },
    {
      title: '7. Tema', html: '<p>Sunuya beyaz yerine renkli bir <b>tasarım teması</b> verin.</p>',
      hint: 'Tasarım sekmesinden herhangi bir tema. Tema bütün slaytlara birden uygulanır.',
      ...durum((c) => info(c).theme && info(c).theme !== 'beyaz'),
    },
    {
      title: '8. Başlığı ortalayın', html: '<p><b>Çalışma saatleri</b> slaydının başlığını <b>ortalayın</b>.</p>',
      hint: 'Soldan o slayda tıklayın, sonra başlığın içine tıklayın → Giriş → Ortala. Gerçek PowerPoint\'te Ortala düğmesi Giriş sekmesinin Paragraf bölümündedir (Ctrl + E).',
      ...durum((c) => info(c).slides[1]?.al?.title === 'center'),
    },
    {
      title: '9. Yazı rengi', html: '<p>Aynı başlığın <b>yazı rengini</b> değiştirin (ör. koyu kırmızı).</p>',
      hint: 'Başlığın içine tıklayın → Giriş → Yazı Tipi Rengi ▾ → bir renk. Gerçek PowerPoint\'te bu düğme kırmızı çizgili A harfidir; önce yazıyı seçmeniz gerekir.',
      ...durum((c) => !!info(c).slides[1]?.fc?.title),
    },
    {
      title: '10. Bütün slaytlara geçiş', html: '<p><b>Bütün slaytlara aynı</b> geçiş efektini verin.</p>',
      hint: 'Geçişler sekmesinde bir geçiş seçin (ör. Solma), sonra sağdaki Tümüne Uygula\'ya basın. Gerçek PowerPoint\'te Tümüne Uygula, Geçişler sekmesinin Zamanlama bölümündedir.',
      ...durum((c) => { const s = info(c).slides; return s.length === 5 && hasSameTransition(s); }),
    },
    {
      title: '11. Animasyon', html: '<p><b>Kütüphaneden bir köşe</b> slaydındaki <b>resme</b> bir giriş animasyonu verin.</p>',
      hint: 'Soldan resimli slayda tıklayın, sonra resmin üzerine tıklayın → Animasyonlar → Giriş öbeğinden bir efekt. Nesne seçilmeden efektler gri durur.',
      ...durum((c) => (info(c).slides[3]?.anims || []).some((a) => a.t === 'img' && a.kind === 'in')),
    },
    {
      title: '12. Slayt numarası', html: '<p>Slaytlara <b>slayt numarası</b> koyun; kapak (başlık) slaydında görünmesin.</p>',
      hint: 'Ekle → Slayt Numarası (ya da Ekle → Üst Bilgi ve Alt Bilgi). Pencerede Slayt numarası ve Başlık slaydında gösterme işaretlenir, Tümüne Uygula.',
      ...durum((c) => info(c).slideNum && info(c).hf?.hideTitle),
    },
    {
      title: '13. Gösteri', html: '<p>Slayt gösterisini <b>baştan</b> başlatın, sonuna kadar izleyin ve çıkın.</p>',
      hint: `${K('F5')} baştan başlatır (dizüstünde Fn + F5 gerekebilir). Tıklayarak ya da → ile ilerleyin; animasyonlu resim için fazladan bir kez tıklamanız gerekebilir. Son slaytta ${K('Esc')} ile çıkın. Gerçek PowerPoint\'te: Slayt Gösterisi → Baştan Başla.`,
      on: (ev, c) => {
        if (ev.type !== 'ppt-show-exit') return false;
        const d = info(c);
        if (!readyForShow(d, c)) return false;
        if (ev.from === 0 && !ev.rehearse && ev.allSeen && (ev.finished || ev.at === d.slides.length - 1)) return true;
        c.note('F5 ile yeniden başlatın. Beş slaydın hepsini gösterin ve son slaytta Esc ile çıkın.');
        return false;
      },
    },
    {
      title: '14. Kaydedin', html: '<p>Sunuyu <b>Belgeler</b> klasörüne <b>kütüphane</b> adıyla kaydedin.</p>',
      hint: `${K('Ctrl', 'S')} → Belgeler → Dosya adı: kütüphane → Kaydet. Gerçek PowerPoint\'te ilk kayıtta Bu bilgisayar mı OneDrive mı, ona bakın.`,
      on: (ev, c) => {
        if (ev.type !== 'ppt-save' && ev.type !== 'ppt-pdf') return false;
        if (ev.type !== 'ppt-save' || ev.folder !== 'docs' || ev.name.toLocaleLowerCase('tr') !== 'kütüphane.pptx') {
          c.note('Dosya → Farklı Kaydet ile Belgeler klasörüne kütüphane adıyla, PowerPoint Sunusu (*.pptx) türünde kaydedin.');
          return false;
        }
        return readyForShow(info(c), c);
      },
    },
    {
      title: '15. PDF', html: '<p>Sunuyu <b>sanal PDF olarak dışarı aktarın</b> ve Belgeler\'e kaydedin.</p>',
      hint: 'Dosya → 📤 Dışarı Aktar → 📕 PDF/XPS Belgesi Oluştur → Kaydet. Gerçek PowerPoint\'te sağdaki PDF/XPS Oluştur\'a basıp açılan pencerede Yayımla denir.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-pdf') return false;
        const d = info(c);
        if (!readyForShow(d, c)) return false;
        if (d.dirty || d.folder !== 'docs' || d.fileName?.toLocaleLowerCase('tr') !== 'kütüphane.pptx') {
          c.note('Önce güncel sunuyu Belgeler klasörüne kütüphane.pptx olarak kaydedin.');
          return false;
        }
        if (ev.folder === 'docs' && /\.pdf$/i.test(ev.name) && ev.slides === 5) return true;
        c.note('Beş sayfalık PDF’yi Belgeler klasörüne dışarı aktarın.');
        return false;
      },
    },
    { final: true, title: 'Prova bitti! 📝', html: '<p>Sınavda istenen bir sunuyu baştan sona kendiniz hazırladınız. Aynı görevleri bir de <b>gerçek PowerPoint</b>\'te deneyin: 12. hafta ödevinde yolları yazıyor. Kaydettiğiniz PPTX dosyasını yeniden açıp düzeni kontrol edin. Dışarı aktardığınız gerçek PDF’yi de ayrı bir PDF okuyucuda açıp beş sayfanın sırasına bakın.</p>' },
  ],
};
