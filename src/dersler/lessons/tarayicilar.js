// 8. hafta ek dersi: tarayıcılar hakkında bilgi. Edge, Chrome, Firefox, Safari, Opera, Brave: kim yapar, nerede bulunur;
// tarayıcı ile arama motorunun farkı; varsayılan tarayıcı; güncelleme; aynı işin farklı adları.
import { info, ayir, sec, sekmeler } from './kalip.js';

const fact = (rows) => `<dl class="tb-facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

const TARAYICILAR = [
  { id: 'edge', label: 'Microsoft Edge', icon: '🌊', rows: [['Kim yapar?', 'Microsoft'], ['Nerede bulunur?', '<b>Windows 10 ve 11\'de hazır gelir</b>; ayrıca indirmek gerekmez'], ['Simgesi', 'Mavi-yeşil dalga'], ['Menü düğmesi', 'Sağ üstte üç yatay nokta  <b>…</b>'], ['Not', 'Chrome ile aynı temel üzerine kuruludur; birçok şey benzer. PDF dosyalarını da kendisi açar']] },
  { id: 'chrome', label: 'Google Chrome', icon: '🟢', rows: [['Kim yapar?', 'Google'], ['Nerede bulunur?', 'Windows\'ta sonradan <b>indirilir</b>; Android telefonlarda hazır gelir'], ['Simgesi', 'Kırmızı, sarı, yeşil halkanın ortasında mavi daire'], ['Menü düğmesi', 'Sağ üstte üç dikey nokta  <b>⋮</b>'], ['Not', 'Dünyada en çok kullanılan tarayıcı. Google hesabınızla girerseniz sık kullanılanlarınız telefonunuzla aynı olur']] },
  { id: 'firefox', label: 'Mozilla Firefox', icon: '🦊', rows: [['Kim yapar?', 'Mozilla (kâr amacı gütmeyen bir vakıf)'], ['Nerede bulunur?', 'Windows\'ta sonradan indirilir; Pardus ve birçok Linux\'ta hazır gelir'], ['Simgesi', 'Dünyayı saran turuncu tilki'], ['Menü düğmesi', 'Sağ üstte üç yatay çizgi  <b>☰</b>'], ['Not', 'Gizliliğe önem verir; kullanıcıyı izleyen reklam çerezlerine karşı korumalıdır']] },
  { id: 'safari', label: 'Safari', icon: '🧭', rows: [['Kim yapar?', 'Apple'], ['Nerede bulunur?', '<b>Yalnızca Apple aygıtlarında</b>: iPhone, iPad, Mac. Windows ve Android için yoktur'], ['Simgesi', 'Mavi pusula'], ['Not', 'Torununuzun iPhone\'unda internet açıyorsa büyük olasılıkla Safari\'dir']] },
  { id: 'opera', label: 'Opera', icon: '🔴', rows: [['Kim yapar?', 'Opera (Norveç kökenli bir şirket)'], ['Nerede bulunur?', 'Sonradan indirilir; ücretsizdir'], ['Simgesi', 'Kırmızı “O” harfi'], ['Not', 'Reklam engelleyici ve yan panel gibi ek araçlarla gelir']] },
  { id: 'brave', label: 'Brave', icon: '🦁', rows: [['Kim yapar?', 'Brave Software'], ['Nerede bulunur?', 'Sonradan indirilir; ücretsizdir'], ['Simgesi', 'Turuncu aslan başı'], ['Not', 'Reklamları ve izleyicileri kendiliğinden engeller']] },
];

const AD_FARKI = `<table class="tbl"><tr><th></th><th>Edge</th><th>Chrome</th><th>Firefox</th></tr>
  <tr><th>İz bırakmayan pencere</th><td>InPrivate</td><td>Gizli pencere</td><td>Gizli pencere</td></tr>
  <tr><th>Sık kullanılanlar</th><td>Sık kullanılanlar</td><td>Yer işaretleri</td><td>Yer imleri</td></tr>
  <tr><th>Menü düğmesi</th><td>…</td><td>⋮</td><td>☰</td></tr>
  <tr><th>Yeni sekme</th><td colspan="3"><kbd>Ctrl</kbd> + <kbd>T</kbd> (hepsinde aynı)</td></tr>
  <tr><th>Sayfada ara</th><td colspan="3"><kbd>Ctrl</kbd> + <kbd>F</kbd> (hepsinde aynı)</td></tr></table>`;

export const tarayicilarBilgi = {
  id: 'tarayicilar', icon: '🧭', title: 'Tarayıcılar: Edge, Chrome, Firefox ve diğerleri', minutes: 25, stage: 'scene',
  desc: 'Tarayıcı nedir, hangi tarayıcılar var, nerede bulunur; tarayıcı ile arama motoru (Google, Bing) arasındaki fark; varsayılan tarayıcı ve güncelleme; aynı işin farklı adları.',
  summary: [
    ['Tarayıcı', 'İnternet sitelerini açan program: Edge, Chrome, Firefox, Safari, Opera, Brave'],
    ['Arama motoru', 'Sitelerin fihristi: Google, Bing, Yandex, DuckDuckGo. Tarayıcının içinde kullanılır'],
    ['Hangisi?', 'Hepsi aynı işi yapar. Windows\'ta Edge hazır gelir; Chrome gerekmez'],
    ['İndirme', 'Tarayıcıyı yalnızca resmî sitesinden indirin; “Chrome indir” reklamlarına dikkat'],
    ['Varsayılan tarayıcı', 'Bağlantılara tıklayınca açılan tarayıcı: Ayarlar → Uygulamalar → Varsayılan uygulamalar'],
    ['Güncelleme', 'Menü → Ayarlar → Hakkında; güncel tarayıcı daha güvenlidir'],
    ['Aynı iş, farklı ad', 'Edge: InPrivate; Chrome ve Firefox: Gizli pencere'],
  ],
  steps: [
    {
      title: 'Tarayıcı nedir?',
      html: `<p><b>Tarayıcı</b>, internet sitelerini ekranınızda gösteren programdır. Word yazı yazmak için, Paint resim çizmek için; tarayıcı da <b>internete bakmak</b> içindir.</p>
        <p>Bir kütüphane düşünün: <b>tarayıcı</b>, kütüphane binasının kendisidir; içeri girer, kitapları (siteleri) okursunuz. Hangi kitabın hangi rafta olduğunu bulduran <b>fihrist</b> ise <b>arama motorudur</b>. Bu ikisini çok kişi karıştırır.</p>`,
      scene: info('<div class="sc-big">🏛 📚<br>🌐</div><p>Tarayıcı: bina · Arama motoru: fihrist</p>'),
    },
    {
      title: 'Altı tarayıcı',
      html: '<p>Sağdaki sekmelerde sık görülen altı tarayıcı var. <b>Hepsine sırayla tıklayıp</b> okuyun.</p>',
      scene: sekmeler({ tabs: TARAYICILAR.map((t) => ({ id: t.id, label: t.label, icon: t.icon, html: () => fact(t.rows) })), intro: 'Hepsi aynı işi yapar: siteleri açar. Fark, kimin yaptığı ve nerelerde bulunduğudur.' }),
      on: (ev) => ev.type === 'tabs-done',
      done: 'Hepsini okudunuz. Gördüğünüz gibi: biri bilgisayarınızda hazır gelir, ötekileri isterseniz kurarsınız.',
    },
    ayir({
      title: 'Tarayıcı mı, arama motoru mu?',
      html: '<p>Her kartı doğru kutuya sürükleyin. <b>Tarayıcı</b> bina, <b>arama motoru</b> fihristtir.</p>',
      bins: [{ id: 'tar', label: 'Tarayıcı (program)', icon: '🏛' }, { id: 'ara', label: 'Arama motoru (fihrist)', icon: '🔎' }],
      items: [
        { label: 'Microsoft Edge', icon: '🌊', bin: 'tar', why: 'Bilgisayarınıza kurulu bir programdır.' },
        { label: 'Google Chrome', icon: '🟢', bin: 'tar', why: 'Bir tarayıcıdır; Google\'ın tarayıcısı.' },
        { label: 'Mozilla Firefox', icon: '🦊', bin: 'tar', why: 'Bir tarayıcıdır.' },
        { label: 'Safari', icon: '🧭', bin: 'tar', why: 'Apple\'ın tarayıcısı.' },
        { label: 'Google (google.com)', icon: '🔎', bin: 'ara', why: 'Bir arama sitesidir; tarayıcının içinde açılır.' },
        { label: 'Bing', icon: '🔎', bin: 'ara', why: 'Microsoft\'un arama motoru.' },
        { label: 'Yandex', icon: '🔎', bin: 'ara', why: 'Rusya kökenli, Türkiye\'de de çok kullanılan arama motoru.' },
        { label: 'DuckDuckGo', icon: '🦆', bin: 'ara', why: 'Aramalarınızı izlememeyi vaat eden arama motoru.' },
      ],
      done: 'Tarayıcı programdır; arama motoru, tarayıcının içinde açtığınız bir sitedir.',
    }),
    sec({
      title: 'Komşunun cümlesi', text: '<p>Komşunuz: “Ben internete hep <b>Google’dan</b> giriyorum, tarayıcı falan kullanmıyorum.”</p>',
      q: 'Aslında ne yapıyor?', opts: ['Hiçbir program kullanmıyor, doğrudan Google\'a giriyor', 'Edge ya da Chrome gibi bir tarayıcı açıyor; onun içinde Google arama sitesine gidiyor', 'Google bir tarayıcıdır, doğru söylüyor'], ok: 1,
      why: 'İnternete bakmak için mutlaka bir tarayıcı gerekir. Komşunuz büyük olasılıkla Chrome ya da Edge\'i açıyor ve Google\'ın arama sayfasını kullanıyor.',
    }),
    sec({
      title: 'Hangisini kullanmalı?', text: '<p>Yeni bir Windows bilgisayarı aldınız. Torununuz: “Chrome indir” diyor, ama bilgisayarda mavi-yeşil dalga simgeli bir program zaten var.</p>',
      q: 'Ne yaparsınız?', opts: ['Önce hazır gelen Edge\'i kullanırım; Chrome\'u isterseniz resmî sitesinden indiririm', 'Arama sonucunda çıkan ilk “Chrome indir” reklamına tıklarım', 'Hiç tarayıcı kullanmam'], ok: 0,
      why: 'Hazır gelen tarayıcı işinizi görür. Başka bir tarayıcı isterseniz yalnızca resmî sitesinden (örn. google.com/chrome) indirin; “indir” yazan reklam düğmeleri sahte olabilir.',
    }),
    {
      title: 'Aynı iş, farklı ad',
      html: '<p>Tarayıcılar birbirine çok benzer. Ama bazı şeylerin <b>adı</b> değişir. Tabloyu inceleyin: bir tarayıcıyı öğrendiğinizde ötekilerini de kolayca kullanırsınız.</p>',
      scene: (el) => { el.className = 'sc sc-info'; el.innerHTML = `<div style="width:100%;max-width:34em">${AD_FARKI}<p class="mut" style="margin-top:.8em">Telefonda da aynı: sekmeler, geçmiş, sık kullanılanlar hep vardır.</p></div>`; },
      manual: 'İnceledim ✔',
    },
    sec({
      title: 'İz bırakmayan pencere', text: '<p>Torunun bilgisayarında <b>Microsoft Edge</b> açık. Ortak kullandığınız bir bilgisayarda geçmişe kaydedilmeden bir şeye bakmak istiyorsunuz.</p>',
      q: 'Edge\'de buna ne denir?', opts: ['InPrivate penceresi', 'Hızlı pencere', 'Gizli kasa'], ok: 0,
      why: 'Edge\'de InPrivate; Chrome ve Firefox\'ta “Gizli pencere”. Üçünde de kısayol Ctrl + Shift + N (Firefox\'ta Ctrl + Shift + P). Unutmayın: bu pencere sizi internette görünmez yapmaz; yalnızca bu bilgisayarda geçmiş bırakmaz.',
    }),
    {
      title: 'Varsayılan tarayıcı',
      html: `<p>Bir e-postadaki bağlantıya tıkladınız ve sayfa <b>beklemediğiniz bir tarayıcıda</b> açıldı. Bunun nedeni, bilgisayarın <b>varsayılan tarayıcısıdır</b>: bağlantılar hep onda açılır.</p>
        <p>Değiştirmek için: <b>⊞ Başlat → ⚙ Ayarlar → Uygulamalar → Varsayılan uygulamalar</b>, listeden tarayıcıyı seçip <b>Varsayılan yap</b>.</p>`,
      scene: info('<div class="sc-big">🔗 ➜ 🌐</div><p>Bağlantıya tıklanınca<br><b>varsayılan tarayıcı</b> açılır</p>'),
    },
    sec({
      title: 'Güncel tutmak', text: '<p>Tarayıcınızın üst köşesindeki menü düğmesinde küçük bir <b>“Güncelle”</b> uyarısı çıkıyor.</p>',
      q: 'Ne yaparsınız?', opts: ['Güncellerim: işimi kaydedip tarayıcıyı yeniden başlatırım', 'Uyarıyı hep kapatırım', 'Tarayıcıyı silerim'], ok: 0,
      why: 'Tarayıcı güncellemeleri güvenlik açıklarını kapatır. Menü → Ayarlar → Hakkında bölümünde güncelleme olup olmadığına da bakabilirsiniz. Güncellerken açık sayfalarınızı kaydedin.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Tarayıcıları tanıyorsunuz:</p>', scene: info('<div class="sc-big">🌐 ✔</div>') },
  ],
};
