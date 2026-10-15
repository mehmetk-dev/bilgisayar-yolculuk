// 8. hafta ek dersi: işletim sistemleri. Windows 7, 8, 10, 11, Linux ve Pardus: nasıl görünürler, hangisi ne zaman çıktı, desteği bitenler, açık ve kapalı kaynak.
import { info, ayir, sec, sekmeler } from './kalip.js';

const fact = (rows) => `<dl class="tb-facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
const logo = '<i class="osm-logo"></i>';

const OS = [
  {
    id: 'w7', label: 'Windows 7', icon: '🪟',
    mock: '<div class="osm osm-w7"><div class="osm-ic"><span>🗑</span><span>📁</span></div><div class="osm-win"></div><div class="osm-bar"><i class="osm-orb"></i><b></b><b></b><b></b><span class="clk">14:05</span></div></div>',
    rows: [['Çıktığı yıl', '2009'], ['Nasıl tanınır', 'Sol altta yuvarlak, parlak <b>Başlat düğmesi</b>; camsı, yarı saydam pencereler'], ['Durumu', '<b>Desteği 14 Ocak 2020\'de bitti.</b> Artık güvenlik güncellemesi gelmiyor'], ['Kimler kullanır', 'Eski bilgisayarlar; yıllarca en sevilen sürümdü']],
    warn: 'Destek bitince yeni bulunan güvenlik açıkları kapatılmaz. Bu bilgisayarda internet bankacılığı ve şifre işlemleri yapmayın; mümkünse güncel bir sisteme geçin.',
  },
  {
    id: 'w8', label: 'Windows 8 / 8.1', icon: '🟦',
    mock: `<div class="osm osm-w8"><i>✉</i><i>📅</i><i>🌤</i><i>🛍</i><i>📷</i><i>🎵</i><i>🌐</i></div>`,
    rows: [['Çıktığı yıl', '2012 (8.1: 2013)'], ['Nasıl tanınır', 'Açılışta <b>renkli kutucuklardan oluşan Başlat ekranı</b>; 8\'de <b>Başlat düğmesi yoktu</b>'], ['Durumu', '8.1\'in desteği 10 Ocak 2023\'te bitti'], ['İlginç', 'Herkes tablet kullanacak sanıldı ve masaüstündeki Başlat menüsü kaldırıldı. Kullanıcılar çok kızdı; Windows 10\'da geri geldi']],
    warn: 'Destek süresi bitti. Hâlâ kullanıyorsanız güvenlik riski vardır.',
  },
  {
    id: 'w10', label: 'Windows 10', icon: '🪟',
    mock: `<div class="osm osm-w10"><div class="osm-menu"><u></u><span><i></i><i></i><i></i><i></i></span></div><div class="osm-bar">${logo}<b></b><b></b><b></b><span class="clk">14:05</span></div></div>`,
    rows: [['Çıktığı yıl', '2015'], ['Nasıl tanınır', 'Sol altta dört kareli <b>Başlat düğmesi</b>; açılan menüde solda liste, sağda kutucuklar'], ['Durumu', '<b>Microsoft\'un ücretsiz güncelleme desteği 14 Ekim 2025\'te bitti.</b> Güncel sisteme geçmek önerilir'], ['Kimler kullanır', 'Bugün hâlâ çok sayıda bilgisayar, özellikle 2015–2020 arası alınanlar']],
    warn: 'Desteği bitti. Bilgisayarınız yeterliyse Windows 11\'e geçin; değilse bankacılık gibi önemli işleri dikkatli yapın.',
  },
  {
    id: 'w11', label: 'Windows 11', icon: '🪟',
    mock: '<div class="osm osm-w11"><div class="osm-menu"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="osm-bar"><b></b><b></b><b></b><b></b><span class="clk">14:05</span></div></div>',
    rows: [['Çıktığı yıl', '2021'], ['Nasıl tanınır', '<b>Simgeler görev çubuğunun ortasında</b>; Başlat menüsü de ortada açılır; köşeler yuvarlak'], ['Durumu', 'Güncel sürüm; güncelleme almaya devam eder'], ['Dikkat', 'Daha yeni bir bilgisayar ister; her eski bilgisayara kurulamaz']],
  },
  {
    id: 'lnx', label: 'Linux', icon: '🐧',
    mock: '<div class="osm osm-lnx"><div class="osm-top"><span>Etkinlikler</span><em>Çar 14:05</em></div><div class="osm-dock"><b></b><b></b><b></b><b></b></div><div class="osm-win"></div></div>',
    rows: [['Başlangıcı', '1991\'de Linus Torvalds adlı genç bir mühendis başlattı'], ['Fiyatı', '<b>Ücretsiz</b>; internetten indirilir, istediğiniz kadar bilgisayara kurulur'], ['Çeşitleri', 'Ubuntu, Linux Mint, Debian, Pardus… Her birine <b>“dağıtım”</b> denir'], ['Kimler kullanır', 'Sunucular, telefonlar (Android Linux üzerine kuruludur), kamu kurumları, meraklılar']],
    note: '<b>Kek tarifi benzetmesi:</b> Windows, formülü sır olan bir içecek gibidir; parayı verirsiniz ama içinde ne olduğunu göremezsiniz. Linux ise herkese açık bir kek tarifi gibidir: herkes bakar, değiştirir, arkadaşlarına dağıtır. Buna <b>açık kaynak</b> denir.',
  },
  {
    id: 'prd', label: 'Pardus', icon: '🐆',
    mock: '<div class="osm osm-prd"><div class="osm-top"><span>Pardus</span><em>14:05</em></div><div class="osm-paw">🐆</div><div class="osm-win"></div><div class="osm-dock"><b></b><b></b><b></b><b></b><b></b></div></div>',
    rows: [['Kim yaptı?', '<b>TÜBİTAK ULAKBİM</b>: Türkiye\'nin kendi geliştirdiği (yerli ve milli) işletim sistemi'], ['Adı', 'Anadolu parsından gelir 🐆'], ['Temeli', '<b>Debian Linux</b> üzerine kuruludur; ücretsizdir, Türkçedir'], ['Nerede kullanılır?', 'Kamu kurumları, üniversiteler ve okullardaki <b>akıllı tahtalar</b> (Pardus ETAP)'], ['Güncel sürümler', 'Pardus 23, Pardus 25… yeni sürümler çıkmaya devam ediyor']],
    note: 'Okullardaki akıllı tahtanın açılışında gördüğünüz sistem Pardus\'tur. Bir devletin kurumlarında kendi kodunu bildiği bir sistem kullanması, dışarıya bağımlılığı azaltır.',
  },
];

const tabHtml = (o) => `${o.mock}${fact(o.rows)}${o.note ? `<p class="tb-note">${o.note}</p>` : ''}${o.warn ? `<p class="tb-warn">⚠ ${o.warn}</p>` : ''}`;

export const isletimSistemleri = {
  id: 'isletim-sistemleri', icon: '🪟', title: 'İşletim sistemleri: Windows 7, 8, 10, 11, Linux ve Pardus', minutes: 30, stage: 'scene',
  desc: 'İşletim sistemi nedir; Windows, Linux ve yerli sistemimiz Pardus.',
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
      html: `<p><b>İşletim sistemi</b>, bilgisayar açılınca ilk çalışan ve her şeyi yöneten programdır. Bir <b>apartman yöneticisi</b> gibi düşünün: hangi kiracının (programın) hangi daireyi (hafızayı) kullanacağını, elektriği ve suyu (gücü) kim alacak, hepsini o dağıtır.</p>
        <p>Ekranda gördüğünüz masaüstü, Başlat menüsü, pencereler ve simgeler işletim sisteminin yüzüdür. Aynı bilgisayara farklı işletim sistemi kurulursa görünüş değişir; parçalar aynı kalır.</p>
        <p class="mut">Telefonunuzda da bir işletim sistemi vardır: Android ya da iOS.</p>`,
      scene: info('<div class="sc-big">🏢<br>🖥 ⇄ 🧩</div><p>Yönetici: işletim sistemi<br>Kiracılar: programlar</p>'),
    },
    {
      title: 'Altı işletim sistemi',
      html: `<p>Sağda altı sekme var. <b>Hepsine sırayla tıklayın</b> ve okuyun: ekran taslağına, çıkış yılına ve “nasıl tanınır” satırına dikkat edin.</p>`,
      scene: sekmeler({ tabs: OS.map((o) => ({ id: o.id, label: o.label, icon: o.icon, html: () => tabHtml(o) })), intro: 'Bir sekmeye tıklayın. Resimler küçük taslaklardır; gerçek ekran daha ayrıntılıdır.' }),
      on: (ev) => ev.type === 'tabs-done',
      done: 'Altısını da okudunuz. Şimdi birkaç soruyla pekiştirelim.',
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
      title: 'Akıllı tahta', text: '<p>Çocuğunuzun okulunda sınıftaki <b>akıllı tahta</b> açılırken Türk bayrağı, Ay-yıldız ve bir <b>parsı</b> logosu görüyorsunuz.</p>',
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
