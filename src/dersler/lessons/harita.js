// 13. hafta ek dersi: Haritalar. Yer aramak, yakınlaştırmak, uydu görünümü, konum izni,
// yürüyerek ve otobüsle yol tarifi, sarı insanla Sokak Görünümü'nde hastanenin kapısını bulmak.
import { desktopReady, maxed } from './common.js';
import { rehberSoru } from './kalip.js';
import { HARITA_HOST } from '../apps/siteler-harita.js';

const SOKAK = { ataturk: 'Atatürk Caddesi', hastane: 'Hastane Caddesi', lale: 'Lale Sokak', pazar: 'Pazar Caddesi', cinar: 'Çınar Bulvarı', menekse: 'Menekşe Sokak' };

export const harita = {
  id: 'harita', icon: '🗺', title: 'Haritalar, yol tarifi ve Sokak Görünümü', minutes: 25, stage: 'desktop',
  desc: 'Gideceğiniz yeri önceden haritada bulmak, yol tarifi almak, sokağı ekranda gezmek.',
  summary: [
    ['Arama kutusu', 'Yerin adı ya da adresi: “hastane”, “Menekşe Sokak 8”'],
    ['＋ / －', 'Yakınlaştırır / uzaklaştırır (fare tekerleği de olur)'],
    ['🛰 Uydu', 'Yukarıdan çekilmiş fotoğraf görünümü; 🗺 Harita ile geri dönülür'],
    ['➜ Yol tarifi', 'Nereden – Nereye; 🚶 yürüyerek, 🚌 toplu taşıma, 🚗 arabayla'],
    ['📍 Konumunuz', 'Site konum izni ister; vermezseniz adresinizi elle yazarsınız'],
    ['🧍 Sarı insan', 'Bir sokağa sürükleyip bırakın: Sokak Görünümü açılır'],
    ['⬆ ↶ ↷', 'Sokak Görünümü\'nde ilerlemek ve sağa sola bakmak'],
    ['Telefonda', 'Aynı harita telefonda da var; yola çıkınca “Başlat” sesli yön tarifi verir'],
  ],
  steps: [
    {
      title: 'Yarın hastaneye gideceksiniz',
      html: `<p>Yarın <b>Çınar Devlet Hastanesi</b>'nde randevunuz var ama oraya hiç gitmediniz. Haritalar sitesiyle evden çıkmadan yolu öğrenecek, hatta hastanenin kapısını ekranda göreceğiz.</p>`,
      setup: (c) => { desktopReady(c); c.d.closeAll(); maxed(c, 'browser', { url: HARITA_HOST }); },
    },
    {
      title: 'Hastaneyi arayın',
      html: '<p>Üstteki <b>Haritalarda arayın</b> kutusuna <b>hastane</b> yazıp Enter\'a basın.</p>',
      on: (ev, c) => {
        if (ev.type !== 'map-search') return false;
        if (ev.place !== 'hastane') { c.note('Bulunan yer hastane değil. Kutuya yalnızca “hastane” yazıp yeniden deneyin.'); return false; }
        return true;
      },
      done: 'Hastane haritada kırmızı işaretle gösterildi; solda bilgileri çıktı.',
    },
    rehberSoru({
      title: 'Bilgi kartı',
      html: '<p>Soldaki bilgi kartını okuyun. Hastanenin <b>acil servisi</b> ne zaman açık?</p>',
      opts: ['Yalnızca 08:00–17:00', 'Her gün, günün her saati (7/24)', 'Hafta sonu kapalı'], ok: 1,
      wrong: 'Kartta “Acil servis” yazan satırı okuyun.',
      why: 'Doğru: 7/24, yani günde 24 saat, haftada 7 gün. Poliklinikler ise 08:00–17:00 arası.',
    }),
    {
      title: 'Yakınlaştırın',
      html: '<p>Sağ alttaki <b>＋</b> düğmesine basarak sonuna kadar (iki kez) yakınlaştırın. Hastanenin çevresindeki sokaklar büyür.</p>',
      on: (ev) => ev.type === 'map-zoom' && ev.max,
      done: 'Yakınlaşınca sokak adları ve binalar daha iyi görünür. <b>－</b> ile uzaklaşırsınız.',
    },
    {
      title: 'Uydu görünümü',
      html: '<p>Sol alttaki <b>🛰 Uydu</b>\'ya basın.</p>',
      on: (ev) => ev.type === 'map-layer' && ev.layer === 'sat',
      done: 'Uydu görünümü, yukarıdan çekilmiş bir fotoğraf gibidir: çatılar, parklar, otoparklar. Aynı düğme (🗺 Harita) ile geri dönülür.',
    },
    {
      title: 'Yol tarifi',
      html: '<p>Soldaki kartta <b>➜ Yol tarifi</b>\'ne basın. “Nereye” kutusu hastaneyle dolar.</p>',
      on: (ev) => ev.type === 'map-diropen' && ev.to === 'hastane',
      done: 'Şimdi nereden yola çıkacağınızı söylemeniz gerek.',
    },
    {
      title: 'Konumunuz',
      html: '<p><b>📍 Konumunuz</b>\'a basın. Tarayıcı, sitenin konumunuzu öğrenmesine izin verip vermeyeceğinizi sorar: <b>İzin ver</b>.</p>',
      hint: 'İzin sorusu adres çubuğunun hemen altında çıkar.',
      on: (ev, c) => {
        if (ev.type !== 'map-myloc') return false;
        if (!ev.ok) c.note('İzin vermediniz; sorun değil. “Nereden” kutusuna adresinizi elle yazın: Lale Sokak 5');
        return true;
      },
      done: 'Harita sitesinin konumunuzu bilmesi yol tarifi için gereklidir. Başka sitelere konum izni verirken düşünün: gerçekten gerekli mi?',
    },
    {
      title: 'Yürüyerek',
      html: '<p><b>🚶 Yürüyerek</b> seçili olsun; <b>Yol tarifi al</b>\'a basın.</p>',
      on: (ev) => ev.type === 'map-route' && ev.to === 'hastane' && ev.mode === 'walk',
      done: 'Yol haritada mavi noktalarla çizildi; solda süre, mesafe ve hangi sokaktan döneceğiniz yazıyor.',
    },
    {
      title: 'Otobüsle',
      html: '<p>Yürümek uzun sürecek. <b>🚌 Toplu taşıma</b>\'yı seçip yeniden <b>Yol tarifi al</b>\'a basın.</p>',
      on: (ev) => ev.type === 'map-route' && ev.to === 'hastane' && ev.mode === 'bus',
      done: 'Hangi otobüse, hangi duraktan bineceğiniz ve nerede ineceğiniz yazıyor.',
    },
    rehberSoru({
      title: 'Kaç durak?',
      html: '<p>Yol tarifine bakın: otobüsle <b>kaç durak</b> gideceksiniz?</p>',
      opts: ['3 durak', '5 durak', '7 durak'], ok: 1,
      wrong: 'Soldaki listede 🚌 satırını okuyun.',
      why: 'Doğru: 12 numaralı otobüsle 5 durak. Durakları saymak, nerede ineceğinizi kaçırmamanızı sağlar.',
    }),
    {
      title: 'Sarı insan',
      html: '<p>Şimdi hastanenin kapısını görelim. Haritanın sağ altındaki <b>🧍 sarı insanı</b> fareyle tutun ve hastane işaretinin <b>hemen altına</b>, <b>Hastane Caddesi</b>\'nin üzerine sürükleyip bırakın.</p>',
      hint: 'Sürüklerken sokaklar mavi çizgiyle gösterilir. Sürüklemek zor gelirse sarı insana bir kez tıklayın, sonra sokağa tıklayın.',
      on: (ev, c) => {
        if (ev.type === 'sv-miss') c.note('Sarı insanı bir sokağın tam üzerine bırakın; sokaklar mavi çizgiyle gösterilir.');
        if (ev.type !== 'sv-open') return false;
        if (ev.street !== 'hastane') { c.note(`Burası ${SOKAK[ev.street]}. Sol üstteki “⬅ Haritaya dön” ile çıkın ve Hastane Caddesi'ne bırakın.`); return false; }
        return true;
      },
      done: 'Sokak Görünümü açıldı: o sokakta duruyormuş gibi etrafı görüyorsunuz.',
    },
    {
      title: 'Kapıyı bulun',
      html: '<p>Alttaki <b>⬆</b> ile ilerleyin. Hastane <b>solunuzda</b> kalacak; binanın önüne gelince <b>↶</b> ile sola dönüp kapıya bakın.</p>',
      hint: 'Yanlış yöne baktıysanız ↶ ↷ ile dönün. Yol sonunda ⬆ çalışmaz; arkanıza dönüp gelin.',
      on: (ev) => ev.type === 'sv-move' && ev.facing === 'hastane',
      done: 'Acil girişi karşınızda! Yarın gittiğinizde burayı tanıyacaksınız.',
    },
    {
      title: 'Gerçek haritada evinizi bulun',
      html: `<p>Şimdi aynısını gerçek haritada deneyin. Kendi bilgisayarınızda ya da telefonunuzda:</p>
        <ol class="steps"><li>Tarayıcıda <b>maps.google.com</b> adresini açın (telefonda <b>Haritalar</b> uygulaması da olur).</li>
        <li>Arama kutusuna <b>kendi adresinizi</b> yazın: mahalle, sokak, kapı numarası, ilçe. Örnek: <i>Lale Sokak 8, Çankaya</i>.</li>
        <li>Çıkan kırmızı işareti <b>yakınlaştırın</b>; <b>Uydu</b> görünümüne geçip evinizin çatısını bulun.</li>
        <li>Sarı insanı evinizin önündeki sokağa bırakın: <b>Sokak Görünümü</b>'nde kapınızı görün.</li>
        <li>Son olarak <b>Yol tarifi</b> ile evinizden en yakın sağlık ocağına ya da eczaneye yürüyerek kaç dakika olduğuna bakın.</li></ol>
        <p class="mut">Bazı küçük sokaklarda Sokak Görünümü olmayabilir; o zaman uydu görünümü yeter.</p>
        <div class="box">⚠ Ev adresinizi ve evinizin harita ekran görüntüsünü tanımadığınız kişilerle paylaşmayın.</div>`,
      manual: '✔ Evimi buldum',
      done: 'Harika! Gideceğiniz her yeri artık evden çıkmadan önce haritada görebilirsiniz.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Haritayla yer bulmayı, yol tarifi almayı ve sokağı ekranda gezmeyi öğrendiniz:</p>' },
  ],
};
