// 12. hafta: sunu (PowerPoint benzeri). MEB Bilgisayar İşletmeni programının “Microsoft PowerPoint” ünitesine göre:
// yeni sunu, slayt düzenleri, metin (boyut, renk, hizalama), tasarım teması, arka plan, resim, slayt geçişi, slayt sırası,
// slayt gösterisi, kaydetme.
import { K, desktopReady, maxed, norm } from './common.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], theme: 'beyaz' };
const has = (t, w) => norm(t).includes(norm(w));
const ev = ['ppt-input', 'ppt-new-slide', 'ppt-theme', 'ppt-trans', 'ppt-insert', 'ppt-move', 'ppt-delete', 'ppt-select', 'ppt-format', 'ppt-fontsize', 'ppt-fcolor', 'ppt-align', 'ppt-bg'];
const when = (test) => (e, c) => ev.includes(e.type) && !!test(c);
const open = (c) => maxed(c, 'slides');

export const sunu = {
  id: 'sunu', icon: '📙', title: 'Sunu hazırlayalım', minutes: 45, stage: 'desktop',
  desc: 'Başlık slaytı, yeni slayt, yazının boyutu, rengi ve hizası, tema ve arka plan, resim, F5 ile slayt gösterisi, kaydetme.',
  summary: [
    ['Slayt', 'Sununun her bir sayfası'],
    ['Giriş → Yeni Slayt', 'Düzen seçerek slayt ekler (Başlık ve içerik…)'],
    ['Giriş → Yazı Tipi Boyutu', 'Seçili kutunun puntosu; slaytta en az 24 punto'],
    ['Giriş → Ortala / Yazı Tipi Rengi', 'Önce yazı kutusuna tıklanır; yazı ortalanır ya da rengi değişir'],
    ['Tasarım → tema', 'Bütün slaytların renkleri ve yazı tipleri birlikte değişir'],
    ['Tasarım → Arka Planı Biçimlendir', 'Seçili slaydın arka planı: düz renk ya da resim; Tümüne Uygula ile hepsine'],
    ['Geçişler', 'Bir slayttan ötekine geçerkenki hareket'],
    ['Soldaki listede sürüklemek', 'Slaydın sırasını değiştirir'],
    ['Sağ tık → Slaytı Sil', 'Seçili slaydı siler (ya da Delete tuşu)'],
    ['F5', 'Slayt gösterisini baştan başlatır'],
    ['→ / Boşluk / tık', 'Sonraki slayt'],
    ['Esc', 'Gösteriden çıkar'],
  ],
  steps: [
    {
      title: 'Sunu nedir?',
      html: `<p><b>Sunu</b> (en bilineni Microsoft PowerPoint), bir konuyu topluluğa anlatırken perdeye ya da ekrana yansıtılan <b>slaytlardan</b> oluşur. Her slaytta kısa bir başlık, birkaç madde ve resim olur.</p>
        <p>Bu derste mahalle bahçemizi tanıtan üç slaytlık bir sunu hazırlayacağız.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); },
    },
    {
      title: 'Programı açın',
      html: '<p>⊞ <b>Başlat</b>\'tan <b>📙 Sunu</b>\'yu açın.</p><p class="mut">Gerçek bilgisayarda bu programın adı <b>Microsoft PowerPoint</b>\'tir (turuncu simge, beyaz P). Açılınca önce şablon listesi çıkar; boş sunu için <b>Boş sunu</b>\'ya tıklarsınız.</p>',
      mouse: '🖱 Başlat → Sunu',
      check: (c) => !!c.d.find('slides'),
      on: (e) => e.type === 'app-open' && e.app === 'slides',
      done: 'Solda slaytların küçük resimleri, ortada üzerinde çalıştığınız slayt var. İlk slayt bir <b>başlık slaytıdır</b>.',
    },
    {
      title: 'Başlık slaytı',
      html: '<p>“Başlık eklemek için tıklayın” yazan kutuya tıklayıp <b>Mahalle Bahçemiz</b> yazın. Alttaki kutuya da <b>adınızı</b> yazın.</p>',
      setup: open,
      on: when((c) => { const s = info(c).slides[0]; return s && has(s.title, 'bahçemiz') && s.sub.length >= 2; }),
      done: 'Başlık slaytı sununun kapağıdır: konu ve sunan kişi yazılır.',
    },
    {
      title: 'Tasarım seçin',
      html: '<p>Üstteki <b>Tasarım</b> sekmesine tıklayın ve beğendiğiniz herhangi bir <b>temayı</b> seçin.</p><p class="mut">Gerçek PowerPoint\'te tema adları ve renkleri buradakilerden farklıdır; beğendiğinizi seçmeniz yeter.</p>',
      mouse: '🖱 Tasarım → bir tema',
      on: (e, c) => e.type === 'ppt-theme' && info(c).theme !== 'beyaz',
      done: 'Tema bütün slaytlara birlikte uygulanır; renkler sununun her yerinde uyumlu olur.',
    },
    {
      title: 'Yeni slayt',
      html: '<p><b>Giriş</b> sekmesinde <b>➕ Yeni Slayt</b>\'a tıklayıp <b>Başlık ve içerik</b>\'i seçin. Yeni slaydın başlığına <b>Neler yetiştiriyoruz?</b> yazın.</p>',
      hint: 'Yeni Slayt düğmesi Giriş sekmesinin en solunda. Açılan listeden “Başlık ve içerik”.',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz'))),
      done: 'İkinci slayt geldi. Altında madde yazılacak büyük bir kutu var.',
    },
    {
      title: 'Maddeleri yazın',
      html: `<p>Başlığın altındaki kutuya tıklayın. Her satıra bir tane olmak üzere yazın: <b>Domates</b>, <b>Biber</b>, <b>Çilek</b>. ${K('Enter')} yeni madde açar.</p>`,
      hint: 'Madde işaretleri kendiliğinden gelir. Slaytlara uzun cümleler değil, kısa maddeler yazılır.',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz') && s.items.length >= 3)),
      done: 'Sunularda az yazı, çok resim kuralı vardır: dinleyenler okumaya değil, size bakmalı.',
    },
    {
      title: 'Yazıyı büyütün',
      html: '<p>Arkadaki sıralardan da okunsun: maddelerin yazdığı kutuya (Domates, Biber, Çilek) bir kez tıklayın. Sonra <b>Giriş</b> sekmesindeki <b>Yazı Tipi Boyutu</b> listesinden <b>40</b>\'ı seçin.</p>',
      hint: 'Önce yazı kutusuna tıklamak gerekir; liste, en son tıkladığınız kutunun boyutunu değiştirir.',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz') && (s.fs?.body || 0) >= 36)),
      done: 'Yazı büyüdü. Yazı boyutu <b>punto</b> ile ölçülür; slaytta en az <b>24 punto</b> kullanın, başlıklar daha büyük olsun.',
    },
    {
      title: 'Başlığı ortalayın',
      html: '<p>Aynı slaytta <b>Neler yetiştiriyoruz?</b> başlığına bir kez tıklayın. Sonra <b>Giriş</b> sekmesinde <b>Ortala</b>\'ya tıklayın.</p>',
      hint: 'Ortala düğmesi Giriş sekmesinde, Yazı Tipi Rengi\'nin sağında. Gerçek PowerPoint\'te de Giriş sekmesindedir (Paragraf bölümü).',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz') && s.al?.title === 'center')),
      done: 'Başlık slaydın ortasına geldi. Sola Hizala ve Sağa Hizala da aynı yerde.',
    },
    {
      title: 'Başlığın rengi',
      html: '<p>Başlık hâlâ seçili. <b>Giriş → Yazı Tipi Rengi ▾</b>\'ya tıklayın ve <b>Koyu Kırmızı</b>\'yı (ilk satırın üçüncüsü) seçin.</p>',
      hint: 'Farenizi renk karelerinin üzerinde bekletince adı çıkar. Renk başka kutuya geçtiyse önce başlığa tıklayın, sonra yeniden deneyin.',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz') && s.fc?.title === '#c00000')),
      done: 'Başlık koyu kırmızı oldu. Gerçek PowerPoint\'te bu düğme Giriş sekmesindeki kırmızı çizgili <b>A</b> harfidir.',
    },
    {
      title: 'Resimli slayt',
      html: `<ol class="steps"><li>Yine <b>➕ Yeni Slayt → Yalnızca başlık</b>. Başlığa <b>Bahçemizden</b> yazın.</li><li><b>Ekle</b> sekmesi → <b>🖼 Resim</b> → <b>Resimler</b> klasöründen <b>çiçekler.jpg</b>.</li></ol>`,
      mouse: '🖱 Yeni Slayt → Ekle → Resim',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'bahçemizden') && s.img)),
      done: 'Resimli slaytlar akılda daha çok kalır.',
    },
    {
      title: 'Arka plan rengi',
      html: '<p>Soldan <b>ilk slayda</b> (Mahalle Bahçemiz) tıklayın. <b>Tasarım</b> sekmesinde <b>🎨 Arka Planı Biçimlendir</b>\'e tıklayın. Sağda açılan bölmede <b>Düz dolgu</b> altındaki <b>Açık sarı</b> kareyi seçin.</p>',
      hint: 'Bölme açılmadıysa Tasarım sekmesinin sağındaki Arka Planı Biçimlendir düğmesine yeniden tıklayın. Bütün slaytlara aynı rengi vermek isterseniz bölmenin altındaki Tümüne Uygula.',
      on: when((c) => !!info(c).slides[0]?.bg?.color),
      done: 'Kapak slaydının arka planı değişti, öteki slaytlar temanın renginde kaldı. Bölmeyi sağ üstteki ✖ ile kapatabilirsiniz. Bölmede <b>Resim veya doku dolgusu → Ekle…</b> ile arka plana fotoğraf da konur.',
    },
    {
      title: 'Slayt geçişi',
      html: '<p>Soldaki listeden <b>ikinci slayta</b> tıklayın. Sonra <b>Geçişler</b> sekmesinden <b>Solma</b>\'yı seçin.</p>',
      mouse: '🖱 2. slayt → Geçişler → Solma',
      hint: 'Geçiş uygulanan slaytın numarasının yanında küçük bir ★ çıkar.',
      on: when((c) => info(c).slides.some((s) => s.trans !== 'none')),
      done: 'Geçişleri az ve sade kullanın; her slaytta başka bir hareket dikkat dağıtır.',
    },
    {
      title: 'Sırayı değiştirin',
      html: '<p>Resimli slayt (<b>Bahçemizden</b>) ikinci sırada olsun. Soldaki listede <b>Bahçemizden</b> slaydının küçük resmini farenin sol tuşuyla <b>basılı tutun</b>, bir üstteki slaydın üzerine sürükleyip bırakın.</p>',
      mouse: '🖱 Basılı tut → yukarı sürükle → bırak',
      hint: 'Küçük resmin üzerine gelin, sol tuşu bırakmadan fareyi yukarı götürün. Üstteki slaydın kenarı kırmızı olunca bırakın.',
      on: when((c) => has(info(c).slides[1]?.title || '', 'bahçemizden')),
      done: 'Slaytların sırası değişti. Bir slaydı silmek için küçük resmine <b>sağ tıklayıp Slaytı Sil</b>\'i seçin ya da tıklayıp Delete tuşuna basın.',
    },
    {
      title: 'Slayt gösterisi',
      html: `<p>${K('F5')}\'e basın (ya da <b>Slayt Gösterisi → Baştan başla</b>). Slaytlar tam ekran açılır.</p>
        <p>Sonraki slayt için fareyle tıklayın ya da ${K('→')}. Sonuna kadar gidin ve ${K('Esc')} ile çıkın.</p>`,
      combo: ['F5'],
      hint: 'Dizüstü bilgisayarlarda F5 için Fn tuşu gerekebilir. Slayt Gösterisi sekmesindeki düğme de aynı işi yapar.',
      on: (e) => e.type === 'ppt-show-exit' && e.finished,
      done: 'Sunum yaparken F5 ile başlar, ok tuşlarıyla ilerlersiniz. Perdeye yansıtırken de böyledir.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile <b>Belgeler</b> klasörüne <b>bahçemiz</b> adıyla kaydedin.</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (e) => e.type === 'ppt-save',
      done: 'PowerPoint dosyalarının uzantısı <b>.pptx</b>\'tir; turuncu 📙 simgesiyle görünür. Gerçek PowerPoint\'te ilk kayıtta Kaydet penceresinde dosyanın nereye gideceğine (<b>Bu bilgisayar</b> ya da <b>OneDrive</b>) bakın.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk sununuzu hazırlayıp gösterdiniz:</p>' },
  ],
};
