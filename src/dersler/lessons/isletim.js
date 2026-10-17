// 8. hafta ek dersi: işletim sistemleri. Windows 7, 8.1, 10, 11, Linux (Ubuntu) ve Pardus'un içine girilip
// kullanılan benzetimleri (isletim-sim.js, isletim-os.js): açılış, giriş, Başlat menüsü, pencereler, ayarlar.
import { info, ayir, sec } from './kalip.js';
import { kur } from './isletim-sim.js';
import { OSES } from './isletim-os.js';
import * as I from './isletim-simge.js';

const fact = (rows) => `<dl class="tb-facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

// Sağdaki sahnede tek bir işletim sistemi açılır (bilgisayar açılıştan başlar)
const osSahne = (id) => (el, c) => {
  el.className = 'sc sc-os';
  el.innerHTML = '<div class="oss"></div>';
  kur(el.firstElementChild, OSES[id], c);
};
// Serbest gezinti: üstteki düğmelerle sistemler arasında geçilir
const LOGO = { w7: () => I.w7flag(), w8: () => I.w8logo('#2672ec'), w10: () => I.w8logo('#0078d7'), w11: () => I.w11logo(), lnx: () => I.ubuntu(), prd: () => I.pardus() };
const osGezinti = (ids) => (el, c) => {
  el.className = 'sc sc-os';
  el.innerHTML = `<div class="oss-tabs">${ids.map((id) => `<button type="button" data-os="${id}">${LOGO[id]()}${OSES[id].name}</button>`).join('')}</div><div class="oss"></div>`;
  const box = el.querySelector('.oss');
  let stop;
  const go = (id) => {
    stop?.();
    el.querySelectorAll('[data-os]').forEach((b) => { b.classList.toggle('on', b.dataset.os === id); if (b.dataset.os === id) b.classList.add('seen'); });
    stop = kur(box, OSES[id], c, { skip: 'login' });
  };
  el.querySelector('.oss-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-os]'); if (b) go(b.dataset.os); });
  go(ids[0]);
};
const isOs = (ev, os, type) => ev.type === type && ev.os === os;

export const isletimSistemleri = {
  id: 'isletim-sistemleri', icon: '🪟', title: 'İşletim sistemleri: Windows 7, 8, 10, 11, Linux ve Pardus', minutes: 40, stage: 'scene',
  desc: 'İşletim sistemi nedir; Windows 7, 8.1, 10, 11, Ubuntu ve Pardus\'un içine girip kullanarak farklarını görmek.',
  summary: [
    ['İşletim sistemi', 'Bilgisayarın yöneticisi: parçalarla programlar arasında köprü kurar'],
    ['Windows 7 (2009)', 'Yuvarlak Başlat düğmesi; desteği 2020\'de bitti'],
    ['Windows 8 (2012)', 'Kutucuklu Başlat ekranı; ilk sürümde Başlat düğmesi yoktu; destek 2023\'te bitti'],
    ['Windows 10 (2015)', 'Başlat menüsü geri geldi; ücretsiz güncelleme desteği Ekim 2025\'te bitti'],
    ['Windows 11 (2021)', 'Simgeler ortada; yeni bilgisayar ister'],
    ['Linux', 'Ücretsiz, açık kaynak; Ubuntu, Mint, Pardus gibi çeşitleri var'],
    ['Pardus', 'TÜBİTAK ULAKBİM\'in yerli Linux\'u; okul akıllı tahtalarında (ETAP) çalışır'],
    ['Hangisini kullanıyorum?', 'Başlat → Ayarlar → Sistem → Hakkında; ya da ⊞ + R, winver yazıp Enter'],
    ['Destek bitti ne demek?', 'Yeni güvenlik açıkları kapatılmaz; önemli işleri (bankacılık) güncel sistemde yapın'],
  ],
  steps: [
    {
      title: 'İşletim sistemi nedir?',
      html: `<p><b>İşletim sistemi</b>, bilgisayar açılınca ilk çalışan ve her şeyi yöneten programdır. Bir <b>apartman yöneticisi</b> gibi düşünün: hangi kiracının (programın) hangi daireyi (hafızayı) kullanacağına, elektriği ve suyu (gücü) kimin ne kadar alacağına o karar verir.</p>
        <p>Ekranda gördüğünüz masaüstü, Başlat menüsü, pencereler ve simgeler işletim sisteminin yüzüdür. Aynı bilgisayara farklı işletim sistemi kurulursa görünüş değişir; parçalar aynı kalır.</p>
        <p class="mut">Telefonunuzda da bir işletim sistemi vardır: Android ya da iOS.</p>`,
      scene: info('<div class="sc-big">🏢<br>🖥 ⇄ 🧩</div><p>Yönetici: işletim sistemi<br>Kiracılar: programlar</p>'),
    },
    {
      title: 'Windows 7 (2009)',
      html: `<p>Sağdaki bilgisayarda <b>Windows 7</b> kurulu. Açılışını izleyin, sonra içine girin:</p>
        <ol class="steps"><li>Giriş ekranında parola kutusunun yanındaki <b>ok</b> düğmesine basın (parola gerekmez).</li><li>Sol alttaki <b>yuvarlak, parlak Başlat</b> düğmesine tıklayın.</li><li>Açılan menünün sağ sütunundan <b>Bilgisayar</b>'ı açın.</li></ol>
        ${fact([['Nasıl tanınır', 'Yuvarlak Başlat düğmesi; camsı, yarı saydam pencereler'], ['Durumu', '<b>Desteği 14 Ocak 2020\'de bitti</b>']])}
        <p class="tb-warn">⚠ Destek bitince yeni bulunan güvenlik açıkları kapatılmaz. Bu sistemde internet bankacılığı yapmayın.</p>`,
      hint: 'Başlat düğmesi ekranın sol alt köşesindeki mavi yuvarlaktır. Bilgisayar, menünün sağdaki koyu sütunundadır.',
      scene: osSahne('w7'),
      on: (ev) => isOs(ev, 'w7', 'os-open') && ev.app === 'files',
      done: 'Windows 7\'nin içindesiniz. Pencereyi başlığından tutup sürükleyebilir, sağ üstteki düğmelerle küçültüp kapatabilirsiniz. Dilediğiniz kadar gezinin, sonra Devam\'a basın.',
    },
    {
      title: 'Windows 8.1 (2012–2013)',
      html: `<p>Windows 8 açılınca masaüstü yerine <b>renkli kutucuklardan oluşan Başlat ekranı</b> gelir. Herkesin dokunmatik tablet kullanacağı sanılmıştı.</p>
        <ol class="steps"><li>Kilit ekranına tıklayın, sonra okla giriş yapın.</li><li>Başlat ekranında <b>Masaüstü</b> kutucuğuna tıklayın.</li><li>Masaüstünde sol alttaki <b>Windows simgesine</b> basarak yeniden Başlat ekranına dönün.</li></ol>
        ${fact([['Nasıl tanınır', 'Kutucuklu Başlat ekranı; sağ üst köşeye gidince çıkan siyah <b>düğme çubuğu</b> (Ara, Paylaş, Başlat, Aygıtlar, Ayarlar)'], ['İlginç', 'İlk Windows 8\'de <b>Başlat düğmesi hiç yoktu</b>; kullanıcılar çok şikâyet etti. 8.1\'de düğme geri geldi ama yine bu ekranı açar.'], ['Durumu', '8.1\'in desteği 10 Ocak 2023\'te bitti']])}
        <p class="mut">Hava Durumu gibi kutucuklar tam ekran açılır. Kapatmak için fareyi ekranın en üstüne götürüp ✕'e basın.</p>`,
      hint: 'Masaüstü kutucuğu, içinde mavi bir resim olan geniş kutudur. Masaüstündeyken Başlat ekranına dönmek için sol alttaki Windows simgesine basın.',
      scene: osSahne('w8'),
      on: (ev) => isOs(ev, 'w8', 'os-start') && ev.fromDesk,
      done: 'Windows 8\'de Başlat ekranı ile masaüstü arasında böyle gidip gelinir. İsterseniz sağ üst köşeye fareyi götürüp düğme çubuğunu da deneyin.',
    },
    {
      title: 'Windows 10 (2015)',
      html: `<p>Windows 10\'da <b>Başlat menüsü geri geldi</b>: solda program listesi, sağda kutucuklar.</p>
        <ol class="steps"><li>Kilit ekranına tıklayın ve giriş yapın.</li><li>Sol alttaki <b>Başlat</b> (dört kare) düğmesine basın.</li><li>Soldaki dişli çarktan <b>Ayarlar</b>\'ı açın → <b>Sistem</b> → en alttaki <b>Hakkında</b>.</li></ol>
        ${fact([['Nasıl tanınır', 'Koyu görev çubuğu, solda Başlat ve yanında “Aramak için buraya yazın” kutusu'], ['Durumu', '<b>Ücretsiz güncelleme desteği 14 Ekim 2025\'te bitti</b>']])}`,
      hint: 'Ayarlar, Başlat menüsünün en solundaki ince şeritte dişli çark simgesidir. Arama kutusuna “ayarlar” yazmak da olur.',
      scene: osSahne('w10'),
      on: (ev) => isOs(ev, 'w10', 'os-about'),
      done: 'Hakkında sayfasında <b>Windows belirtimleri → Sürüm</b> satırı, bilgisayarda hangi Windows olduğunu söyler. Kendi bilgisayarınızda da aynı yerden bakabilirsiniz.',
    },
    {
      title: 'Windows 11 (2021)',
      html: `<p>Windows 11\'de <b>simgeler görev çubuğunun ortasındadır</b>, Başlat menüsü de ortada açılır; pencerelerin köşeleri yuvarlaktır.</p>
        <ol class="steps"><li>Giriş yapın.</li><li>Ortadaki mavi <b>Başlat</b> düğmesine basın.</li><li><b>Not Defteri</b>\'ni açın (bulamazsanız üstteki arama kutusuna <b>not</b> yazın) ve adınızı yazın.</li></ol>
        ${fact([['Nasıl tanınır', 'Ortalanmış görev çubuğu, yuvarlak köşeler, sağ altta Wi-Fi/ses/pil tek düğme'], ['Durumu', 'Güncel sürüm; güncelleme almaya devam eder'], ['Dikkat', 'Daha yeni bir bilgisayar ister; her eski bilgisayara kurulamaz']])}`,
      hint: 'Başlat menüsünde “Sabitlenmiş” bölümünde Not Defteri simgesi var. Açılınca beyaz alana tıklayıp yazın.',
      scene: osSahne('w11'),
      on: (ev) => isOs(ev, 'w11', 'os-yaz') && ev.len >= 2,
      done: 'Windows 11\'de de programlar aynı mantıkla açılır; yalnızca yerleri değişmiştir. Sağ alttaki Wi-Fi/ses düğmesine ve saate de tıklayıp bakabilirsiniz.',
    },
    {
      title: 'Linux: Ubuntu',
      html: `<p><b>Linux</b> ücretsizdir ve kodu herkese açıktır. En çok kullanılan çeşitlerinden biri <b>Ubuntu</b>\'dur. Burada Başlat düğmesi yoktur:</p>
        <ol class="steps"><li>Giriş yapın.</li><li>Sol üstteki <b>Etkinlikler</b>\'e tıklayın: açık pencereler ve arama kutusu görünür.</li><li>Soldaki çubuktan ya da çubuğun en altındaki <b>⋮⋮⋮ Uygulamaları Göster</b>\'den <b>Dosyalar</b>\'ı açın.</li></ol>
        ${fact([['Başlangıcı', '1991\'de Linus Torvalds başlattı'], ['Fiyatı', '<b>Ücretsiz</b>; istediğiniz kadar bilgisayara kurulur'], ['Çeşitleri', 'Ubuntu, Linux Mint, Debian, Pardus… Her birine <b>“dağıtım”</b> denir']])}
        <p class="tb-note"><b>Kek tarifi benzetmesi:</b> Windows, tarifi gizli tutulan bir pastane keki gibidir: tadına bakarsınız ama tarifi göremez, değiştiremezsiniz. Linux ise tarifi herkesin görebildiği, değiştirebildiği ve başkasına verebildiği bir kektir. Buna <b>açık kaynak</b> denir.</p>`,
      hint: 'Dosyalar, soldaki koyu çubukta gri bir dosya dolabı simgesidir. Etkinlikler\'de “dosya” yazıp Enter\'a da basabilirsiniz.',
      scene: osSahne('lnx'),
      on: (ev) => isOs(ev, 'lnx', 'os-open') && ev.app === 'files',
      done: 'Linux\'ta “C:” sürücüsü yoktur; dosyalarınız “Ev” klasöründedir. İsterseniz sol alttaki <b>Uygulamaları Göster</b> düğmesiyle yüklü programlara da bakın.',
    },
    {
      title: 'Pardus: yerli işletim sistemimiz',
      html: `<p><b>Pardus</b>, TÜBİTAK ULAKBİM\'in geliştirdiği, <b>Debian Linux</b> tabanlı, ücretsiz ve Türkçe işletim sistemidir. Adı Anadolu parsından gelir.</p>
        <ol class="steps"><li>Giriş ekranında <b>Oturum Aç</b>\'a basın.</li><li>Sol alttaki <b>Pardus menüsü</b> düğmesine tıklayın.</li><li>Sağdaki listeden <b>Sistem</b>\'i, sonra <b>Pardus Hakkında</b>\'yı açın.</li></ol>
        ${fact([['Nerede kullanılır?', 'Kamu kurumları, üniversiteler ve okullardaki <b>akıllı tahtalar</b> (Pardus ETAP)'], ['Güncel sürümler', 'Pardus 23, Pardus 25…']])}
        <p class="mut">Bir devletin kendi kodunu bildiği bir sistem kullanması dışarıya bağımlılığı azaltır.</p>`,
      hint: 'Pardus menüsü, görev çubuğunun en solundaki turuncu damla simgesidir. Menüde arama kutusuna “hakkında” yazmak da olur.',
      scene: osSahne('prd'),
      on: (ev) => isOs(ev, 'prd', 'os-about'),
      done: 'Pardus\'ta pencereler Windows\'takine çok benzer: sağ üstte küçült, büyüt, kapat. Görev çubuğunda açık pencerelerin adı yazar.',
    },
    {
      title: 'Serbest gezinti: karşılaştırın',
      html: `<p>Şimdi altısını yan yana deneyin. Üstteki düğmelerle sistem değiştirin; her birinde:</p>
        <ul class="big-list"><li>Başlat düğmesi (ya da menü) <b>nerede</b>?</li><li>Saat ve tarih <b>nerede</b>?</li><li>Bir pencereyi nasıl <b>kapatıyorsunuz</b>?</li><li>Bilgisayar <b>nasıl kapatılıyor</b>?</li></ul>
        <p class="mut">Masaüstüne sağ tıklamayı da deneyin. İşiniz bitince Devam'a basın.</p>`,
      scene: osGezinti(['w7', 'w8', 'w10', 'w11', 'lnx', 'prd']),
    },
    sec({
      title: 'Başlat düğmesi nerede?', text: '<p>2012\'de çıkan bir Windows sürümü, açılışta <b>renkli kutucuklar</b> gösteriyor ve masaüstünde klasik <b>Başlat düğmesi</b> bulunmuyordu. Kullanıcılar çok şaşırdı.</p>',
      q: 'Bu hangi sürümdür?', opts: ['Windows 7', 'Windows 8', 'Windows 11'], ok: 1,
      why: 'Windows 8. Microsoft herkesin dokunmatik tablet kullanacağını sanıp Başlat menüsünü kaldırdı; tepkiler üzerine Windows 10\'da Başlat menüsü geri geldi.',
    }),
    sec({
      title: 'Simgeler ortada', text: '<p>Bir komşunuzun yeni bilgisayarını açıyorsunuz: <b>görev çubuğundaki simgeler ekranın tam ortasında</b>, Başlat menüsü de ortada açılıyor, pencerelerin köşeleri yuvarlak.</p>',
      q: 'Bu büyük olasılıkla hangi sürüm?', opts: ['Windows 7', 'Windows 10', 'Windows 11'], ok: 2,
      why: 'Windows 11. Windows 10\'da simgeler solda başlar ve Başlat menüsü sol alttadır. (Windows 11\'de bu ayar istenirse sola da alınabilir.)',
    }),
    ayir({
      title: 'Hangi ailede?',
      html: '<p>Her kartı doğru aileye sürükleyin: <b>Windows</b> mu, <b>Linux ailesi</b> mi?</p>',
      bins: [{ id: 'win', label: 'Windows (Microsoft)', icon: '🪟' }, { id: 'lnx', label: 'Linux ailesi', icon: '🐧' }],
      items: [
        { label: 'Windows 10', icon: '🪟', bin: 'win', why: 'Microsoft\'un işletim sistemi.' },
        { label: 'Windows 7', icon: '🪟', bin: 'win', why: 'Windows ailesinden.' },
        { label: 'Pardus', icon: '🐆', bin: 'lnx', why: 'Linux tabanlıdır (Debian Linux).' },
        { label: 'Ubuntu', icon: '🐧', bin: 'lnx', why: 'Çok kullanılan bir Linux çeşididir.' },
        { label: 'Lisans parası ödenir (genelde bilgisayarla birlikte)', icon: '💳', bin: 'win', why: 'Windows ücretlidir; çoğu zaman bilgisayarın fiyatına dahildir.' },
        { label: 'Ücretsiz indirilir, kodu herkese açık', icon: '🎁', bin: 'lnx', why: 'Açık kaynak: tarif herkese açıktır.' },
        { label: 'Okuldaki akıllı tahta (ETAP)', icon: '🏫', bin: 'lnx', why: 'Pardus ETAP, Linux tabanlıdır.' },
      ],
      done: 'Windows ile Linux ailesini ayırt ediyorsunuz.',
    }),
    sec({
      title: 'Akıllı tahta', text: '<p>Çocuğunuzun okulunda sınıftaki <b>akıllı tahta</b> açılırken Ay-yıldızlı Türk bayrağı ve bir <b>parsı</b> logosu görüyorsunuz.</p>',
      q: 'Tahtada hangi işletim sistemi çalışıyor?', opts: ['Pardus (ETAP)', 'Windows 7', 'Android'], ok: 0,
      why: 'Pardus ETAP. TÜBİTAK ULAKBİM tarafından geliştirilen yerli sistemdir; okullardaki akıllı tahtalarda kullanılır.',
    }),
    sec({
      title: 'Destek bitti', text: '<p>Bir tanıdığınız <b>Windows 7</b> yüklü eski bilgisayarında internet bankacılığı yapıyor. “Çalışıyor, bozuk değil” diyor.</p>',
      q: 'Ona ne söylersiniz?', opts: ['Bir şey değiştirmene gerek yok', 'Desteği bittiği için yeni açıklar kapanmıyor; önemli işleri güncel bir bilgisayarda yap, mümkünse sistemi yükselt', 'Saatini ileri al'], ok: 1,
      why: 'Çalışması, güvenli olduğu anlamına gelmez. Güncelleme gelmeyen sistemde yeni bulunan güvenlik açıkları kapanmaz ve zararlı programlar bundan yararlanır. Eski bilgisayara Pardus gibi hafif bir Linux kurmak da bir seçenektir.',
    }),
    sec({
      title: 'Hangisi doğru?', text: '<p>Komşunuz: “Linux ücretsiz olduğuna göre bilgisayarımdaki Word ve Excel dosyalarım orada da aynen çalışır.”</p>',
      q: 'Ne dersiniz?', opts: ['Evet, Windows programları Linux\'ta aynen çalışır', 'Windows programları doğrudan çalışmaz; yerine ücretsiz benzerleri (LibreOffice gibi) kullanılır, Word ve Excel dosyalarını açabilir', 'Linux\'ta hiçbir dosya açılmaz'], ok: 1,
      why: 'Windows için yazılmış programlar Linux\'ta genelde çalışmaz; ama LibreOffice gibi ücretsiz benzerleri vardır ve .docx, .xlsx dosyalarını açar. Pardus\'ta da bunlar hazır gelir.',
    }),
    {
      title: 'Siz hangisini kullanıyorsunuz?',
      html: `<p>Şimdi <b>kendi bilgisayarınıza</b> bakın (burada değil, gerçekte):</p>
        <ol class="steps"><li><b>⊞ Başlat → ⚙ Ayarlar → Sistem → Hakkında</b> sayfasını açın.</li><li><b>Windows belirtimleri</b> bölümünde <b>Sürüm</b> (Windows 10 mu 11 mi?) yazar.</li><li>Kısa yol: klavyede ${'<kbd>⊞ Windows</kbd> + <kbd>R</kbd>'}, kutuya <b>winver</b> yazıp Enter.</li></ol>
        <p class="mut">Sürümünüz Windows 7, 8 ya da 10 ise güncelleme desteği konusunda eğitmeninize danışın.</p>`,
      scene: info('<div class="sc-big">🔎<br>⚙ → Sistem → Hakkında</div><p>Sürümünüzü kendi bilgisayarınızda bulun</p>'),
      manual: 'Baktım ✔',
      done: 'Kendi bilgisayarınızın işletim sistemini artık biliyorsunuz. Bu bilgi, bir program ya da güncelleme ararken hep işe yarar.',
    },
    { final: true, title: 'Tebrikler! 🎉', html: '<p>İşletim sistemleri:</p>', scene: info('<div class="sc-big">🪟 🐧 🐆</div>') },
  ],
};
