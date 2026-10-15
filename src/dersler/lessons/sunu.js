// 12. hafta: sunu (PowerPoint benzeri). MEB Bilgisayar İşletmeni programının “Microsoft PowerPoint” ünitesine göre:
// yeni sunu, slayt düzenleri, metin, tasarım teması, resim, slayt geçişi, slayt sırası, slayt gösterisi, kaydetme.
import { K, desktopReady, maxed, norm } from './common.js';

const P = (c) => c.d.find('slides')?.api;
const info = (c) => P(c)?.info() || { slides: [], theme: 'beyaz' };
const has = (t, w) => norm(t).includes(norm(w));
const ev = ['ppt-input', 'ppt-new-slide', 'ppt-theme', 'ppt-trans', 'ppt-insert', 'ppt-move', 'ppt-delete', 'ppt-select', 'ppt-format'];
const when = (test) => (e, c) => ev.includes(e.type) && !!test(c);
const open = (c) => maxed(c, 'slides');

export const sunu = {
  id: 'sunu', icon: '📙', title: 'Sunu hazırlayalım', minutes: 40, stage: 'desktop',
  desc: 'Başlık slaytı, yeni slayt, resim, tema, F5 ile slayt gösterisi, kaydetme.',
  summary: [
    ['Slayt', 'Sununun her bir sayfası'],
    ['Giriş → Yeni Slayt', 'Düzen seçerek slayt ekler (Başlık ve içerik…)'],
    ['Tasarım', 'Bütün slaytların renk ve arka planı'],
    ['Geçişler', 'Bir slayttan ötekine geçerkenki hareket'],
    ['▲ / ▼', 'Seçili slaytın sırasını değiştirir'],
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
      html: '<p>⊞ <b>Başlat</b>\'tan <b>📙 Sunu</b>\'yu açın.</p>',
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
      html: '<p>Üstteki <b>Tasarım</b> sekmesine tıklayın ve beğendiğiniz bir temayı seçin (örneğin <b>Bahar</b>).</p>',
      mouse: '🖱 Tasarım → bir tema',
      on: (e, c) => e.type === 'ppt-theme' && info(c).theme !== 'beyaz',
      done: 'Tema bütün slaytlara birlikte uygulanır; renkler sununun her yerinde uyumlu olur.',
    },
    {
      title: 'Yeni slayt',
      html: `<ol class="steps"><li><b>Giriş</b> sekmesinde <b>➕ Yeni Slayt</b>\'a tıklayıp <b>Başlık ve içerik</b>\'i seçin.</li><li>Başlığa <b>Neler yetiştiriyoruz?</b> yazın.</li>
        <li>Alttaki kutuya her satıra bir tane olmak üzere yazın (${K('Enter')} yeni madde açar): <b>Domates</b>, <b>Biber</b>, <b>Çilek</b>.</li></ol>`,
      hint: 'Madde işaretleri kendiliğinden gelir. Slaytlara uzun cümleler değil, kısa maddeler yazılır.',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'yetiştiriyoruz') && s.items.length >= 3)),
      done: 'Sunularda az yazı, çok resim kuralı vardır: dinleyenler okumaya değil, size bakmalı.',
    },
    {
      title: 'Resimli slayt',
      html: `<ol class="steps"><li>Yine <b>➕ Yeni Slayt → Yalnızca başlık</b>. Başlığa <b>Bahçemizden</b> yazın.</li><li><b>Ekle</b> sekmesi → <b>🖼 Resim</b> → <b>Resimler</b> klasöründen <b>çiçekler.jpg</b>.</li></ol>`,
      mouse: '🖱 Yeni Slayt → Ekle → Resim',
      on: when((c) => info(c).slides.some((s) => has(s.title, 'bahçemizden') && s.img)),
      done: 'Resimli slaytlar akılda daha çok kalır.',
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
      html: '<p>Resimli slayt (<b>Bahçemizden</b>) ikinci sırada olsun: soldan ona tıklayın, <b>Giriş</b> sekmesinde <b>▲ Yukarı</b>\'ya basın.</p>',
      mouse: '🖱 Slayt → ▲ Yukarı',
      on: when((c) => has(info(c).slides[1]?.title || '', 'bahçemizden')),
      done: 'Slaytların sırası her zaman değiştirilebilir. Seçili slaytı silmek için 🗑 Sil ya da Delete tuşu.',
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
      done: 'PowerPoint dosyalarının uzantısı <b>.pptx</b>\'tir; turuncu 📙 simgesiyle görünür.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İlk sununuzu hazırlayıp gösterdiniz:</p>' },
  ],
};
