// 12. hafta ek dersleri: Asıl Slayt ile bütün sunuyu bir kerede değiştirmek, slayda tablo ve grafik eklemek;
// yönlendirmesiz Sunu parkuru (hazır sunuyu tamamlayıp PDF olarak kaydetmek).
import { K, desktopReady, maxed, norm, put } from './common.js';
import { rehberSoru } from './kalip.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], master: {}, theme: 'beyaz' };
const li = (...a) => a.map((t) => `<li>${t}</li>`).join('');
const sl = (layout, o = {}) => ({ layout, title: '', sub: '', body: '', body2: '', img: null, trans: 'none', art: null, anim: { effect: 'none', start: 'click' }, auto: 0, imgSize: 'M', ...o });
// Sunuda bir şey değişince (her ppt- olayında) durumu yeniden yoklar
const durum = (test) => ({ check: (c) => !!P(c) && !!test(c), on: (ev, c) => ev.type.startsWith('ppt-') && !!test(c) });
const hucre = (t, r, k) => norm(t?.[r]?.[k] || '');

const TOPLANTI = {
  theme: 'beyaz',
  slides: [
    sl('title', { title: 'Ekim Ayı Toplantısı', sub: 'Dernek üyelerine bilgilendirme' }),
    sl('content', { title: 'Gündem', body: li('Geçen ayın özeti', 'Gezi önerileri', 'Aidatlar') }),
    sl('only', { title: 'Gezi önerileri' }),
    sl('only', { title: 'Kim nereye gitmek istiyor?' }),
    sl('content', { title: 'Aidatlar', body: li('Aylık aidat 100 ₺', 'Son ödeme: ayın 15\'i', 'Banka hesabı panoda') }),
  ],
};

export const asilSlayt = {
  id: 'asil-slayt', icon: '🎨', title: 'Asıl Slayt; slayda tablo ve grafik', minutes: 30, stage: 'desktop',
  desc: 'Logo, alt bilgi, renk ve yazı tipini bütün slaytlara tek seferde vermek; tablo ve grafik eklemek.',
  summary: [
    ['Görünüm → 🎨 Asıl Slayt', 'Bütün slaytların ortak görünüşü; burada yapılan her şey tüm slaytlara uygulanır'],
    ['Asıl Slayt: Logo, Alt bilgi', 'Dernek logosu, kurum adı, tarih: her slaytta aynı yerde'],
    ['Asıl Slayt: Başlık rengi, Yazı tipi', '20 slaydı tek tek değiştirmek yerine bir kez'],
    ['✖ Asıl Görünümü Kapat', 'Normal slaytlara döner; yazılar olduğu gibi kalır'],
    ['Ekle → ▦ Tablo', 'Sütun × satır seçilir; ilk satır başlıktır'],
    [K('Tab') + ' (tabloda)', 'Sonraki hücre; son hücrede yeni satır açar. ' + K('Shift', 'Tab') + ' geri gider'],
    ['Ekle → 📊 Grafik', 'Açılan küçük tabloya kategori ve değer yazılır; grafik kendiliğinden çizilir'],
    ['Sütun / Pasta', 'Sütun: karşılaştırma; Pasta: bütünün payları (yüzde)'],
  ],
  steps: [
    {
      title: 'Dernek toplantısı',
      html: `<p>Emekliler derneğinin <b>Ekim toplantısı</b> için 5 slaytlık bir sunu hazır. Başkan şunu istedi: <i>“Her slaydın köşesinde dernek logosu, altında derneğin adı olsun; başlıklar lacivert olsun.”</i></p>
        <p>Beş slaydı tek tek değiştirmek yerine hepsini bir kerede değiştireceğiz. Bunun yeri <b>Asıl Slayt</b>: bütün slaytların ortak kalıbı.</p>`,
      setup: (c) => {
        desktopReady(c); c.d.closeAll();
        put(c, 'pictures', 'dernek logosu.png', 'file', { emoji: '🌳', bg: ['#e8f5e9', '#a5d6a7'] });
        maxed(c, 'slides', { data: TOPLANTI });
      },
    },
    {
      title: 'Asıl Slayt\'ı açın',
      html: '<p>Üstteki <b>Görünüm</b> sekmesine tıklayın ve <b>🎨 Asıl Slayt</b>\'ı seçin.</p>',
      mouse: '🖱 Görünüm → Asıl Slayt',
      on: (ev) => ev.type === 'ppt-view' && ev.view === 'master',
      done: 'Solda kalıp slayt, sağda bütün slaytlarınız. Üstte yeni bir <b>Asıl Slayt</b> sekmesi açıldı.',
    },
    {
      title: 'Logo ekleyin',
      html: '<p><b>🖼 Logo ekle</b>\'ye tıklayın; <b>Resimler</b> klasöründen <b>dernek logosu.png</b>\'yi seçip <b>Aç</b>\'a basın. Sağdaki küçük slaytlara bakın.</p>',
      ...durum((c) => info(c).master.logo),
      done: 'Logo bir kez eklendi, beş slaydın da sağ üst köşesine yerleşti.',
    },
    {
      title: 'Alt bilgi yazın',
      html: '<p><b>Alt bilgi</b> kutusuna derneğin adını yazın: <b>Çınar Emekliler Derneği</b></p>',
      hint: 'Kutu, Logoyu kaldır düğmesinin sağında. İçine tıklayıp yazın; her harf hemen slaytlara geçer.',
      ...durum((c) => norm(info(c).master.footer || '').includes('emekliler')),
      done: 'Bütün slaytların altında aynı yazı. Tarih, sayfa adı ya da telefon numarası da buraya yazılır.',
    },
    {
      title: 'Başlık rengi',
      html: '<p><b>Başlık rengi</b>\'nden <b>lacivert</b> kareyi seçin (ilk kare).</p>',
      hint: 'Fareyi renk karelerinin üzerinde bekletince adı çıkar.',
      ...durum((c) => info(c).master.color === '#1f3864'),
      done: 'Bütün başlıklar lacivert oldu; başlık slaydı dahil.',
    },
    {
      title: 'Okunaklı yazı tipi',
      html: '<p>Arka sıradakiler de rahat okusun: <b>Yazı tipi</b>\'nden <b>Verdana</b>\'yı seçin.</p>',
      ...durum((c) => info(c).master.font === 'verdana'),
      done: 'Verdana geniş ve açık bir yazı tipi; ekranda ve projeksiyonda kolay okunur.',
    },
    {
      title: 'Asıl görünümü kapatın',
      html: '<p>Sağ uçtaki <b>✖ Asıl Görünümü Kapat</b>\'a basın. Soldaki slaytlara tek tek bakın.</p>',
      on: (ev) => ev.type === 'ppt-view' && ev.from === 'master',
      done: 'Beş slaydın beşi de değişti; içlerindeki yazılara hiç dokunulmadı.',
    },
    rehberSoru({
      title: 'Hangi yol?',
      html: '<p>Derneğin logosu değişti. 30 slaytlık sunuda logoyu değiştirmenin en hızlı yolu?</p>',
      opts: ['30 slayda tek tek girip logoyu değiştirmek', 'Asıl Slayt\'ta logoyu bir kez değiştirmek', 'Sunuyu baştan hazırlamak'], ok: 1,
      wrong: 'Bu çok uzun sürer ve bir slaydı unutmak kolaydır.',
      why: 'Doğru: Asıl Slayt\'ta yapılan değişiklik bütün slaytlara birden geçer.',
    }),
    {
      title: 'Tablo ekleyin',
      html: '<p>Soldan <b>3. slayda</b> (Gezi önerileri) tıklayın. <b>Ekle</b> sekmesinde <b>▦ Tablo</b>\'ya basıp <b>2 sütun × 3 satır</b>\'ı seçin.</p>',
      hint: 'Tablo düğmesi Ekle sekmesinde, SmartArt\'ın sağında. Yanlış slayda eklerseniz aynı listeden “Tabloyu kaldır”.',
      on: (ev, c) => {
        if (ev.type !== 'ppt-table' || !ev.ok) return false;
        if (ev.index !== 2) { c.note('Tablo başka bir slayda eklendi. Ekle → Tablo → Tabloyu kaldır ile silin; 3. slayda geçip yeniden ekleyin.'); return false; }
        if (ev.cols !== 2 || ev.rows !== 3) { c.note('Tablo eklendi ama boyutu farklı. Ekle → Tablo listesinden 2 sütun × 3 satır seçerek yeniden ekleyin.'); return false; }
        return true;
      },
      done: 'İki sütunlu, üç satırlı boş bir tablo geldi. İlk satır renkli: orası başlık satırı.',
    },
    {
      title: 'Tabloyu doldurun',
      html: `<p>İlk hücreye tıklayıp yazın; sonraki hücreye geçmek için ${K('Tab')} tuşuna basın:</p>
        <table class="tbl"><tr><th>Gezi yeri</th><th>Gün</th></tr><tr><td>Kapadokya</td><td>3</td></tr><tr><td>Safranbolu</td><td>2</td></tr></table>`,
      hint: 'Tab sağdaki hücreye, satırın sonunda bir alt satırın başına gider. Yanlış hücreye yazdıysanız Shift + Tab ile geri dönün.',
      ...durum((c) => { const t = info(c).slides[2]?.table; return t && hucre(t, 0, 0) && hucre(t, 1, 0).includes('kapadokya') && hucre(t, 1, 1) === '3' && hucre(t, 2, 0).includes('safranbolu') && hucre(t, 2, 1) === '2'; }),
      done: 'Tablo doldu. Excel\'deki gibi hücre hücre, ama sunuda.',
    },
    {
      title: 'Yeni satır',
      html: `<p>Bir gezi yeri daha eklenecek. <b>Son hücreye</b> (2 yazan) tıklayıp ${K('Tab')}\'a basın: altta yeni bir satır açılır. <b>Amasra</b> ve <b>1</b> yazın.</p>`,
      ...durum((c) => { const t = info(c).slides[2]?.table; return t && hucre(t, 3, 0).includes('amasra') && hucre(t, 3, 1) === '1'; }),
      done: 'Son hücrede Tab, tabloya yeni satır ekler. Satır eklemek için başka bir şey aramanıza gerek yok.',
    },
    {
      title: 'Grafik ekleyin',
      html: '<p>Üyelere hangi geziye katılacaklarını sordunuz. Sonucu grafikle gösterelim: <b>4. slayda</b> tıklayın, <b>Ekle → 📊 Grafik → Sütun grafiği</b>\'ni seçin.</p>',
      on: (ev, c) => {
        if (ev.type !== 'ppt-chart' || !ev.ok) return false;
        if (ev.index !== 3) { c.note('Grafik başka bir slayda eklendi. Ekle → Grafik → Grafiği kaldır ile silin; 4. slayda geçip yeniden ekleyin.'); return false; }
        if (ev.kind !== 'bar') { c.note('Pasta grafiği eklendi. Bu adımda Sütun grafiği isteniyor: Ekle → Grafik → Sütun grafiği.'); return false; }
        return true;
      },
      done: 'Örnek verilerle bir grafik çizildi; sağ altta da <b>Grafik verileri</b> kutusu açıldı. Gerçek PowerPoint\'te bu kutu küçük bir Excel penceresidir.',
    },
    {
      title: 'Verileri yazın',
      html: `<p>Sağ alttaki <b>Grafik verileri</b> kutusunda örnek kategorilerin yerine şunları yazın:</p>
        <table class="tbl"><tr><th>Kategori</th><th>Değer</th></tr><tr><td>Kapadokya</td><td>24</td></tr><tr><td>Safranbolu</td><td>18</td></tr><tr><td>Amasra</td><td>12</td></tr></table>
        <p>Dördüncü satırdaki <b>Kategori 4</b>\'ü ve değerini silin.</p>`,
      hint: 'Kutuya tıklayın, Ctrl + A ile eskisini seçip yazın. Kutu kapandıysa grafiğe çift tıklayın.',
      ...durum((c) => {
        const d = info(c).slides[3]?.chart?.data || [];
        const want = [['kapadokya', 24], ['safranbolu', 18], ['amasra', 12]];
        const used = d.filter(([l, v]) => String(l).trim() && v > 0);
        return used.length === 3 && want.every(([l, v]) => used.some(([a, b]) => norm(a).includes(l) && b === v));
      }),
      done: 'Siz yazdıkça sütunlar boy değiştirdi. En çok kişi Kapadokya\'yı istiyor.',
    },
    {
      title: 'Pasta grafiği',
      html: '<p>Aynı veriyi <b>yüzde</b> olarak görelim: veri kutusunun altındaki <b>Grafik türü</b>\'nden <b>Pasta</b>\'yı seçin.</p>',
      hint: 'Veri kutusu kapandıysa grafiğe çift tıklayın. Ya da Ekle → Grafik → Pasta grafiği.',
      ...durum((c) => info(c).slides[3]?.chart?.type === 'pie'),
      done: 'Pasta, bütünün nasıl paylaşıldığını gösterir: Kapadokya %44, Safranbolu %33, Amasra %22.',
    },
    rehberSoru({
      title: 'Tablo mu, grafik mi?',
      html: '<p>Dinleyiciler “hangisi daha çok?” sorusunun cevabını <b>bir bakışta</b> görsün istiyorsunuz. Hangisi daha uygun?</p>',
      opts: ['Tablo: rakamlar yan yana', 'Grafik: farkı boylar ya da dilimler gösterir', 'Uzun bir paragraf'], ok: 1,
      wrong: 'Tablo kesin rakamları verir ama farkı bir bakışta göstermez.',
      why: 'Doğru: karşılaştırmada grafik, kesin rakamlarda tablo. İkisi aynı sunuda birlikte de kullanılabilir.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Bütün sunuyu tek seferde düzenlemeyi, tablo ve grafik eklemeyi öğrendiniz:</p>' },
  ],
};

const GEZI = {
  theme: 'beyaz',
  slides: [
    sl('title'),
    sl('content', { title: 'Gezi programı' }),
    sl('content', { title: 'Peri bacaları', body: li('Milyonlarca yıllık kayalar', 'Balonla gün doğumu', 'Göreme Açık Hava Müzesi') }),
    sl('content', { title: 'Ücret ve kayıt', body: li('Kişi başı 2.500 ₺', 'Son kayıt: 25 Ekim', 'Dernek sekreterine bildirin') }),
  ],
};
const sunuAcik = (c) => info(c).fileName === 'Kapadokya gezisi.pptx';

export const sunuParkur = {
  id: 'sunu-parkur', icon: '🏁', title: 'Sunu parkuru', minutes: 25, stage: 'desktop', parkur: true,
  desc: 'Orta seviye: yarım kalmış bir sunuyu başlık, madde, fotoğraf, tema ve geçişle tamamlayıp PDF olarak kaydetmek. Süreler tutulur.',
  setup: (c) => {
    put(c, 'docs', 'Kapadokya gezisi.pptx', 'file', GEZI);
    put(c, 'pictures', 'peri bacaları.jpg', 'file', { emoji: '🏜', bg: ['#ffcc80', '#90caf9'] });
  },
  steps: [
    {
      title: 'Sunu parkuru',
      html: `<p>Dernek için Kapadokya gezisi sunusu yarım kalmış. 12. haftada öğrendiklerinizle tamamlayın. <b>Nasıl yapılacağı yazmıyor</b>; takılırsanız 💡 İpucu.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: '1. Sunuyu açın', html: '<p><b>Belgeler</b> klasöründeki <b>Kapadokya gezisi</b> sunusunu açın.</p>',
      hint: 'Dosya Gezgini → Belgeler → Kapadokya gezisi.pptx\'e çift tıklayın.',
      check: sunuAcik, on: (ev, c) => sunuAcik(c),
    },
    {
      title: '2. Başlık slaydı', html: '<p>İlk slaydın başlığına <b>Kapadokya Gezisi</b>, alt başlığına <b>Çınar Emekliler Derneği</b> yazın.</p>',
      hint: 'Soldan 1. slayda tıklayın; “Başlık eklemek için tıklayın” yazan kutuya tıklayıp yazın.',
      ...durum((c) => { const s = info(c).slides[0]; return s && norm(s.title).includes('kapadokya') && norm(s.sub).includes('emekliler'); }),
    },
    {
      title: '3. Maddeler', html: '<p>2. slayda (Gezi programı) <b>en az üç madde</b> yazın. Örneğin: Cuma sabah hareket, Cumartesi Göreme, Pazar dönüş.</p>',
      hint: 'Metin kutusuna tıklayın; her maddeden sonra Enter.',
      ...durum((c) => (info(c).slides[1]?.items.length || 0) >= 3),
    },
    {
      title: '4. Fotoğraf', html: '<p>3. slayda (Peri bacaları) <b>Resimler</b>\'deki <b>peri bacaları.jpg</b> fotoğrafını ekleyin.</p>',
      hint: '3. slaydı seçin → Ekle → 🖼 Resim → peri bacaları.jpg → Aç.',
      ...durum((c) => info(c).slides[2]?.img),
    },
    {
      title: '5. Tema', html: '<p>Sunuya beyaz yerine renkli bir <b>tasarım teması</b> verin.</p>',
      hint: 'Tasarım sekmesinden Okyanus, Bahar ya da Gece.',
      ...durum((c) => info(c).theme && info(c).theme !== 'beyaz'),
    },
    {
      title: '6. Geçişler', html: '<p><b>Bütün slaytlara</b> bir geçiş efekti verin.</p>',
      hint: 'Geçişler sekmesi seçili slayda uygulanır: soldan her slayda tek tek tıklayıp Solma gibi bir geçiş seçin. Geçişi olan slaytın numarasının yanında ★ görünür.',
      ...durum((c) => { const s = info(c).slides; return s.length >= 4 && s.every((x) => x.trans !== 'none'); }),
    },
    {
      title: '7. Son slayt', html: '<p>Sununun <b>en sonuna</b> “Yalnızca başlık” düzeninde bir slayt ekleyin; başlığı <b>Teşekkürler</b> olsun.</p>',
      hint: 'Soldan son slayda tıklayın → Giriş → Yeni Slayt ▾ → Yalnızca başlık. Yeni slayt seçili slaydın altına gelir. Yeni slayda da geçiş vermeyi unutmayın.',
      ...durum((c) => { const s = info(c).slides, z = s[s.length - 1]; return s.length >= 5 && z.layout === 'only' && norm(z.title).includes('teşekkür'); }),
    },
    {
      title: '8. Kaydedin', html: '<p>Sunuyu <b>kaydedin</b> (aynı adla, aynı yere).</p>',
      hint: `${K('Ctrl', 'S')} ya da Dosya → Kaydet.`,
      on: (ev, c) => {
        if (ev.type !== 'ppt-save') return false;
        if (!info(c).slides.every((x) => x.trans !== 'none')) c.note('Kaydedildi. Bir slaytta geçiş eksik görünüyor; son slayda da geçiş verin, sonra yeniden kaydedin.');
        return true;
      },
    },
    {
      title: '9. PDF', html: '<p>Bilgisayarı olmayan üyelere göndermek için sunuyu <b>PDF olarak</b> Belgeler\'e kaydedin.</p>',
      hint: 'Dosya → 📕 PDF olarak kaydet… → Kaydet.',
      on: (ev) => ev.type === 'ppt-pdf' && ev.slides >= 5,
    },
    { final: true, title: 'Parkur bitti! 🏁', html: '<p>Bir sunuyu baştan sona kendiniz tamamladınız.</p>' },
  ],
};
