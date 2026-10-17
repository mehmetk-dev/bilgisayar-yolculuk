// 13. hafta ek dersi: “Dosya boyutu 2 MB'den büyük olamaz” hatası. Telefon fotoğrafını Paint'te
// Yeniden boyutlandır ile küçültmek, Seç + Kırp ile vesikalık yapmak, Farklı kaydet ile aslını korumak.
import { K, desktopReady, maxed, put } from './common.js';
import { rehberSoru } from './kalip.js';
import { KURS_HOST, FOTO_SINIR } from '../apps/siteler-foto.js';

const FOTO = 'benim fotoğrafım.jpg';
const isAsil = (n) => n === FOTO;

export const fotoBoyut = {
  id: 'foto-boyut', icon: '📐', title: 'Fotoğrafı küçültmek ve kırpmak (2 MB sınırı)', minutes: 25, stage: 'desktop',
  desc: 'Sitelere fotoğraf yüklerken çıkan “2 MB\'den büyük olamaz” hatasını Paint\'te çözmek.',
  summary: [
    ['MB neden büyük?', 'Telefon fotoğrafı 4000 × 3000 = 12 milyon nokta (piksel); nokta azalınca dosya küçülür'],
    ['Paint → ⤡ Yeniden boyutlandır', 'Yüzde: 50 → yarı en, yarı boy; dosya yaklaşık dörtte birine iner'],
    ['En boy oranını koru', 'Açık kalsın; kapanırsa yüz basık ya da uzun görünür'],
    ['⬚ Seç + ✂ Kırp', 'Kenarlardaki fazlalığı atar; vesikalık için yüzün çevresine dik bir dikdörtgen'],
    ['Farklı kaydet', 'Küçük kopyayı yeni adla kaydedin; asıl fotoğraf bozulmasın'],
    [K('Ctrl', 'Z'), 'Yanlış kırptıysanız geri alın'],
    ['Durum çubuğu', 'Paint\'in altında piksel boyutu ve kayıtlı dosyanın MB\'si yazar'],
    ['Fotoğraflar uygulaması', 'Aynı iş orada da var: ⋯ → Resmi yeniden boyutlandır, ✂ Kırp'],
  ],
  setup: (c) => { put(c, 'pictures', FOTO, 'file', { emoji: '🧓', bg: ['#bbdefb', '#c8e6c9'], w: 4000, h: 3000 }); },
  steps: [
    {
      title: 'Kursa başvuru',
      html: `<p>Belediyenin kültür merkezine internetten kurs başvurusu yapacaksınız. Formda <b>vesikalık fotoğraf</b> isteniyor: <b>en fazla 2 MB</b> ve <b>dik</b>.</p>
        <p>Elinizde telefonla çekilmiş bir fotoğraf var: <b>${FOTO}</b>. Bakalım site kabul edecek mi?</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: KURS_HOST }); },
    },
    {
      title: 'Fotoğrafı yükleyin',
      html: `<p>Adınızı yazın, bir kurs seçin. Sonra <b>📎 Fotoğraf seç</b>'e basın, <b>Resimler</b>'den <b>${FOTO}</b>'ı seçip <b>Aç</b>'a tıklayın.</p>`,
      on: (ev, c) => {
        if (ev.type !== 'foto-upload') return false;
        if (!isAsil(ev.name)) { c.note(`Başka bir dosya seçtiniz. Resimler klasöründen “${FOTO}”ı seçin.`); return false; }
        return true;
      },
      done: 'Site kabul etmedi: dosya <b>4,8 MB</b>, sınır 2 MB. Telefon fotoğraflarında bu çok sık olur.',
    },
    rehberSoru({
      title: 'Neden bu kadar büyük?',
      html: '<p>Kırmızı yazıda fotoğrafın boyutu da yazıyor: <b>4000 × 3000 piksel</b>. Dosya neden bu kadar büyük?</p>',
      opts: ['Fotoğraf çok renkli', 'Fotoğrafta çok fazla nokta (piksel) var: 4000 × 3000 = 12 milyon', 'İnternet yavaş'], ok: 1,
      wrong: 'Dosyanın boyutunu asıl belirleyen, fotoğraftaki nokta sayısıdır.',
      why: 'Doğru: Her nokta yer kaplar. Vesikalık için bu kadar nokta gerekmez; en ve boyu küçültünce dosya da küçülür.',
    }),
    {
      title: 'Paint\'te açın',
      html: `<p>Tarayıcıyı kapatmayın. <b>Başlat → Paint</b>'i açın; <b>📂 Aç</b> düğmesiyle (ya da ${K('Ctrl', 'O')}) <b>Resimler</b>'deki <b>${FOTO}</b>'ı açın.</p>
        <p>Paint'in en altındaki çubuğa bakın: piksel boyutu ve dosyanın MB'si yazar.</p>`,
      hint: 'Başlat\'a tıklayıp “paint” yazın. Paint açılınca sol üstteki 📂 klasör simgesi.',
      on: (ev) => ev.type === 'open' && isAsil(ev.name),
      done: 'Altta “4000 × 3000 piksel” ve “Kayıtlı dosya: 4,8 MB” yazıyor. Fotoğraf ekrana sığsın diye küçük gösteriliyor.',
    },
    {
      title: 'Yeniden boyutlandırın',
      html: '<p><b>Resim</b> grubundaki <b>⤡ Boyutlandır</b>\'a tıklayın. <b>Yüzde</b> seçili kalsın; <b>Yatay</b> kutusuna <b>50</b> yazın. <b>En boy oranını koru</b> işaretli olduğu için Dikey de kendiliğinden 50 olur. <b>Tamam</b>.</p>',
      hint: 'Boyutlandır düğmesi Kırp\'ın yanında. Pencerenin altında yeni boyut yazar: 2000 × 1500 piksel.',
      on: (ev, c) => {
        if (ev.type !== 'paint-resize') return false;
        if (Math.abs(ev.w / ev.h - 4 / 3) > 0.03) { c.warn('En boy oranı bozuldu: fotoğraf basık ya da uzun oldu. Ctrl + Z ile geri alın; “En boy oranını koru” işaretli olsun.'); return false; }
        if (ev.w * ev.h * 0.4 > FOTO_SINIR) { c.note(`Yeni boyut ${ev.w} × ${ev.h}: hâlâ 2 MB'ı geçer. Bir daha küçültün (ör. yüzde 50).`); return false; }
        return true;
      },
      done: 'Fotoğraf küçüldü; görüntü aynı. En yarıya, boy yarıya inince nokta sayısı <b>dörtte birine</b> iner.',
    },
    {
      title: 'Farklı kaydedin',
      html: '<p>Asıl fotoğraf bozulmasın: <b>Farklı kaydet</b>\'e basın (Dosya grubunda). Ad olarak <b>vesikalık.jpg</b> yazıp <b>Resimler</b>\'e kaydedin.</p>',
      hint: `Farklı kaydet düğmesi sol üstte, 📋'nin yanında. Kısayolu ${K('Ctrl', 'Shift', 'S')}.`,
      on: (ev, c) => {
        if (ev.type !== 'save') return false;
        if (isAsil(ev.name)) c.note('Asıl fotoğrafın üstüne kaydettiniz. Bu sefer olur; ama genelde küçük kopyayı yeni bir adla saklamak daha güvenlidir.');
        if (ev.format !== 'jpg') c.note('PNG olarak kaydettiniz; fotoğraflarda JPG çok daha küçük yer kaplar.');
        return true;
      },
      done: 'Kaydedildi. Paint\'in altına bakın: dosya artık yaklaşık <b>1,2 MB</b>.',
    },
    {
      title: 'Yeniden yükleyin',
      html: '<p>Görev çubuğundan tarayıcıya dönün. <b>📎 Fotoğraf seç</b> ile bu kez <b>vesikalık.jpg</b>\'yi seçin.</p>',
      on: (ev, c) => {
        if (ev.type !== 'foto-upload') return false;
        if (ev.reason === 'size') { c.note(`Bu dosya hâlâ büyük (${(ev.size / 1e6).toFixed(1).replace('.', ',')} MB). Küçülttüğünüz dosyayı seçtiğinizden emin olun.`); return false; }
        return true;
      },
      done: 'Boyut tamam. Ama site bu kez başka bir şey söylüyor: fotoğraf <b>yatay</b>, vesikalık <b>dik</b> olmalı. Kırpacağız.',
    },
    {
      title: 'Yüzü seçin',
      html: '<p>Paint\'e dönün. <b>⬚ Seç</b>\'e tıklayın; fotoğraftaki yüzün çevresine, <b>enine göre daha uzun</b> (dik) bir dikdörtgen çizin: fareyi sol üstten sağ alta sürükleyin.</p>',
      hint: 'Kesik çizgili bir çerçeve çıkar. Beğenmezseniz yeniden çizin; eskisi kaybolur.',
      on: (ev, c) => {
        if (ev.type !== 'paint-select') return false;
        if (ev.h <= ev.w) { c.note('Çizdiğiniz alan yatay oldu. Daha dar ve daha uzun çizin: eni boyundan kısa olsun.'); return false; }
        return true;
      },
      done: 'Seçim hazır. Çerçevenin içi kalacak, dışı atılacak.',
    },
    {
      title: 'Kırpın',
      html: '<p><b>✂ Kırp</b>\'a basın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'paint-crop') return false;
        if (ev.h <= ev.w) { c.warn(`Kırpılan resim yatay kaldı (${ev.w} × ${ev.h}). ${K('Ctrl', 'Z')} ile geri alın, daha uzun bir dikdörtgen seçin.`); return false; }
        return true;
      },
      done: 'Kenarlar atıldı; yalnızca yüz kaldı. Altta yeni piksel boyutunu görün: artık dik.',
    },
    {
      title: 'Kaydedin',
      html: `<p>${K('Ctrl', 'S')} ile kaydedin (vesikalık.jpg'nin üstüne).</p>`,
      combo: ['Ctrl', 'KeyS'],
      on: (ev, c) => {
        if (ev.type !== 'save') return false;
        if (ev.h <= ev.w) { c.note('Kaydedilen resim hâlâ yatay. Seç + Kırp ile dik yapın, sonra yeniden kaydedin.'); return false; }
        return true;
      },
      done: 'Kırpılmış vesikalık kaydedildi; dosya daha da küçüldü.',
    },
    {
      title: 'Başvurun',
      html: '<p>Tarayıcıya dönün; <b>vesikalık.jpg</b>\'yi yeniden seçin. Fotoğrafın yanında yeşil ✔ çıkınca <b>Başvur</b>\'a basın.</p>',
      hint: 'Ad ve kurs silindiyse yeniden yazın.',
      on: (ev, c) => {
        if (ev.type === 'foto-upload' && !ev.ok) c.note(ev.reason === 'shape' ? 'Site fotoğrafı hâlâ yatay görüyor. Kırptıktan sonra kaydettiğinizden emin olun.' : 'Site yine kabul etmedi; kırmızı yazıyı okuyun.');
        return ev.type === 'kurs-basvuru';
      },
      done: 'Başvurunuz alındı! Fotoğraf hem küçük hem vesikalık.',
    },
    rehberSoru({
      title: 'Hangisi ne işe yarar?',
      html: '<p>Bir fotoğrafın <b>kenarındaki yabancıları</b> atmak istiyorsunuz; fotoğrafın geri kalanı aynı kalsın. Hangisini kullanırsınız?</p>',
      opts: ['Yeniden boyutlandır', 'Seç + Kırp', 'Farklı kaydet'], ok: 1,
      wrong: 'Yeniden boyutlandır bütün fotoğrafı küçültür; kenardakiler yine görünür.',
      why: 'Doğru: Kırp, fotoğraftan parça keser. Yeniden boyutlandır ise her şeyi olduğu gibi küçültür.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Fotoğraf yükleme hatalarını artık kendiniz çözebilirsiniz:</p>' },
  ],
};
