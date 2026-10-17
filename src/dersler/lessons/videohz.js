// 8. hafta ek dersi: video kalitesi (144p … 4K) ve Hz (ekranın yenileme hızı).
// İki küçük deney sahnesi: piksel netliği ve saniyedeki kare sayısı; ekran ayarı taslağı.
import { info, sec } from './kalip.js';

// ---- Sahne 1: video kalitesi. Aynı resim, farklı piksel sayısıyla çizilir.
const KALITE = [
  { id: '144', label: '144p', w: 40, px: '256 × 144', n: '37 bin', gb: 'yaklaşık 0,1 GB', ad: 'Çok bulanık: yazılar okunmaz' },
  { id: '360', label: '360p', w: 100, px: '640 × 360', n: '230 bin', gb: 'yaklaşık 0,3 GB', ad: 'Telefonun küçük ekranında idare eder' },
  { id: '720', label: '720p (HD)', w: 200, px: '1280 × 720', n: '921 bin', gb: 'yaklaşık 1 GB', ad: 'Net: çoğu iş için yeterli' },
  { id: '1080', label: '1080p (Full HD)', w: 400, px: '1920 × 1080', n: '2 milyon', gb: 'yaklaşık 2 GB', ad: 'Çok net: bilgisayar ve televizyon için ideal' },
  { id: '2160', label: '4K', w: 800, px: '3840 × 2160', n: '8,3 milyon', gb: 'yaklaşık 7 GB', ad: 'En keskin: ama büyük ekran ve hızlı internet ister' },
];

// 160 × 90 birimlik bir manzara çizer (güneş, tepe, ev, ağaç, yazı)
function manzara(g, W) {
  const k = W / 160;
  g.setTransform(k, 0, 0, k, 0, 0);
  const sky = g.createLinearGradient(0, 0, 0, 90); sky.addColorStop(0, '#6ec3ff'); sky.addColorStop(1, '#d6f0ff');
  g.fillStyle = sky; g.fillRect(0, 0, 160, 90);
  g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(135, 18, 9, 0, 7); g.fill();
  g.fillStyle = '#5fb04a'; g.beginPath(); g.ellipse(50, 95, 100, 38, 0, 0, 7); g.fill();
  g.fillStyle = '#4a9c3b'; g.beginPath(); g.ellipse(140, 98, 70, 30, 0, 0, 7); g.fill();
  g.fillStyle = '#e8c9a0'; g.fillRect(55, 42, 38, 28);
  g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(51, 43); g.lineTo(74, 24); g.lineTo(97, 43); g.fill();
  g.fillStyle = '#7b4a2a'; g.fillRect(70, 54, 8, 16);
  g.fillStyle = '#8fd0ff'; g.fillRect(58, 48, 8, 8); g.fillRect(82, 48, 8, 8);
  g.fillStyle = '#7b4a2a'; g.fillRect(118, 50, 4, 20);
  g.fillStyle = '#2e7d32'; g.beginPath(); g.arc(120, 44, 13, 0, 7); g.fill();
  g.fillStyle = '#1c2430'; g.font = 'bold 10px sans-serif'; g.fillText('Merhaba Dede!', 8, 12);
  g.font = '6px sans-serif'; g.fillText('Bahçe, 14 Ekim', 8, 21);
}

function kaliteSahnesi(el, c) {
  el.className = 'sc sc-vh';
  el.innerHTML = `<div class="vh-screen"><canvas class="vh-cv"></canvas><span class="vh-badge"></span></div>
    <div class="vh-btns">${KALITE.map((q) => `<button type="button" data-q="${q.id}">${q.label}</button>`).join('')}</div>
    <dl class="tb-facts vh-info"><dt>Videonun boyutu</dt><dd class="a"></dd><dt>Nokta (piksel) sayısı</dt><dd class="b"></dd><dt>Bir saat izlerseniz</dt><dd class="d"></dd><dt>Görünüş</dt><dd class="e"></dd></dl>
    <p class="mut vh-hint">Bir kaliteye tıklayın. Resim “temsilidir”; gerçek bir videoda da fark böyledir.</p>`;
  const cv = el.querySelector('.vh-cv'), tried = new Set();
  const draw = (q) => {
    cv.width = q.w; cv.height = Math.round(q.w * 9 / 16);
    cv.style.imageRendering = q.w >= 400 ? 'auto' : 'pixelated';
    manzara(cv.getContext('2d'), q.w);
    el.querySelector('.vh-badge').textContent = q.label;
    el.querySelector('.a').textContent = q.px;
    el.querySelector('.b').textContent = q.n;
    el.querySelector('.d').textContent = `${q.gb} internet kotası`;
    el.querySelector('.e').textContent = q.ad;
  };
  draw(KALITE[2]);
  el.querySelector('.vh-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    el.querySelectorAll('.vh-btns button').forEach((x) => x.classList.toggle('on', x === b));
    draw(KALITE.find((q) => q.id === b.dataset.q));
    tried.add(b.dataset.q);
    c.emit('vh-q', { id: b.dataset.q, tried: [...tried] });
  });
}

// ---- Sahne 2: yenileme hızı. Koşan adam, saniyede N kez yeni konuma çizilir.
const HZ = [5, 15, 30, 60];

function hzSahnesi(el, c) {
  el.className = 'sc sc-vh';
  el.innerHTML = `<div class="hz-track"><span class="hz-man">🏃</span><div class="hz-line"></div></div>
    <div class="vh-btns">${HZ.map((h) => `<button type="button" data-hz="${h}">${h} Hz</button>`).join('')}</div>
    <p class="hz-say">Bir hıza tıklayın: adam hep aynı hızla koşuyor; yalnızca ekranın <b>saniyede kaç kez yenilendiği</b> değişiyor.</p>
    <p class="mut">Gerçekte çoğu ekran ve televizyon 60 Hz gösterir; bazı yeni telefonlar ve özel ekranlar 90–144 Hz gösterir. 144 Hz, 60 Hz’den de akıcıdır.</p>`;
  const man = el.querySelector('.hz-man'), say = el.querySelector('.hz-say'), tried = new Set();
  let timer = 0, x = 0, last = performance.now();
  const stop = () => clearInterval(timer);
  const run = (hz) => {
    stop();
    x = 0; last = performance.now();
    timer = setInterval(() => {
      if (!el.isConnected) { stop(); return; }
      const now = performance.now();
      x = (x + (now - last) / 3200) % 1; // 3,2 saniyede bir tur: her hızda aynı hız
      last = now;
      man.style.left = `calc(${(x * 100).toFixed(2)}% - ${(x * 2.2).toFixed(2)}em)`;
    }, 1000 / hz);
  };
  el.querySelector('.vh-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hz]');
    if (!b) return;
    const hz = +b.dataset.hz;
    el.querySelectorAll('.vh-btns button').forEach((x) => x.classList.toggle('on', x === b));
    say.innerHTML = hz <= 15 ? `<b>${hz} Hz:</b> adam sıçrayarak ilerliyor. Defterin köşesine çizilmiş resimleri çok yavaş çevirmek gibi.` : hz < 60 ? `<b>${hz} Hz:</b> hareket anlaşılıyor ama hâlâ hafif takılıyor.` : `<b>${hz} Hz:</b> akıcı. Saniyede ${hz} sayfa çeviriyoruz, göz sıçramayı fark etmiyor.`;
    run(hz);
    tried.add(hz);
    c.emit('vh-hz', { hz, tried: [...tried] });
  });
  run(60);
}

// ---- Sahne 3: Ayarlar → Ekran taslağı
function ekranAyari(el, c) {
  el.className = 'sc sc-vh';
  const ST = { res: '1366 × 768', hz: '60 Hz' };
  el.innerHTML = `<div class="hz-set"><h3>🖥 Ayarlar › Sistem › Ekran</h3>
    <label>Ekran çözünürlüğü <select data-k="res"><option>1024 × 768</option><option selected>1366 × 768</option><option>1920 × 1080 (Önerilen)</option></select></label>
    <p class="hz-msg" data-for="res"></p>
    <label>Yenileme hızı <select data-k="hz"><option selected>60 Hz</option><option>75 Hz</option></select></label>
    <p class="hz-msg" data-for="hz"></p>
    <div class="vh-fake" data-w="1366"><span>Aa</span> örnek yazı</div></div>
    <p class="mut">Bu taslak ayarlar sayfasıdır. Gerçekte: ⊞ Başlat → ⚙ Ayarlar → Sistem → Ekran (yenileme hızı için “Gelişmiş ekran”).</p>`;
  el.querySelector('.hz-set').addEventListener('change', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    const v = e.target.value;
    ST[k] = v;
    const msg = el.querySelector(`[data-for="${k}"]`);
    if (k === 'res') {
      const rec = /Önerilen/.test(v);
      msg.textContent = rec ? '✔ Ekranın kendi çözünürlüğü: en keskin görüntü.' : '⚠ Önerilen değil: yazılar bulanık ya da yassı görünebilir.';
      msg.className = 'hz-msg ' + (rec ? 'ok' : 'bad');
      el.querySelector('.vh-fake').style.filter = rec ? 'none' : 'blur(1.2px)';
      c.emit('vh-res', { value: v, rec });
    } else {
      msg.textContent = v === '75 Hz' ? 'Ekranınız destekliyorsa daha akıcı olur; ofis işleri için fark küçüktür.' : 'Çoğu ekran için varsayılan değer. Ofis ve internet işleri için yeterlidir.';
      msg.className = 'hz-msg';
      c.emit('vh-hzset', { value: v });
    }
  });
}

export const videoHz = {
  id: 'video-hz', icon: '🎞', title: 'Video kalitesi (360p, 1080p, 4K) ve Hz nedir?', minutes: 30, stage: 'scene',
  desc: 'Video kalitesi (720p, 4K) ve ekran yenileme hızı (Hz) ne demek?',
  summary: [
    ['144p, 360p, 720p, 1080p, 4K', 'Videonun netliği; sayı büyüdükçe daha net, daha çok internet harcar'],
    ['Çözünürlük', 'Ekranda yan yana kaç nokta (piksel) olduğu: 1920 × 1080 = Full HD'],
    ['Kotalı internet', 'Telefonda kotanızı korumak için 360p ya da 480p seçin; 4K bir saatte yaklaşık 7 GB harcar'],
    ['Otomatik kalite', 'Kalite ayarı “Otomatik” ise internet yavaşlayınca video kaliteyi kendiliğinden düşürür'],
    ['Hz (hertz)', 'Ekranın saniyede kaç kez yenilendiği: 60 Hz = saniyede 60 resim'],
    ['60 Hz ve 144 Hz', '144 Hz hareketi daha akıcı gösterir; ofis ve internet için 60 Hz yeterli'],
    ['Hz ve saniyedeki kare', 'Video saniyede 120 kare olsa da 60 Hz ekran saniyede en çok 60 tanesini gösterir'],
    ['Ekran ayarı', 'Çözünürlükte “Önerilen” yazanı seçin; yoksa görüntü bulanıklaşır'],
  ],
  steps: [
    {
      title: 'İki farklı sayı',
      html: `<p>Videoda ve ekranda iki ayrı sayıyla karşılaşırsınız:</p>
        <ul class="big-list"><li><b>360p, 720p, 1080p, 4K</b>: videonun <b>netliği</b></li><li><b>60 Hz, 144 Hz</b>: ekranın <b>akıcılığı</b></li></ul>
        <p>İkisini de kendiniz deneyerek göreceğiz. Hiçbir ayar gerçekten değişmez; yalnızca denersiniz.</p>`,
      scene: info('<div class="sc-big">🎞 1080p<br>🖥 60 Hz</div><p>Netlik ve akıcılık</p>'),
    },
    {
      title: 'Netliği deneyin',
      html: `<p>Sağdaki manzara bir videonun bir karesidir. <b>144p</b>'ye tıklayın; yazıya ve evin penceresine bakın. Sonra <b>1080p</b> ve <b>4K</b>'yı deneyin. Her seferinde sağdaki bilgilere de bakın.</p>
        <p class="mut">1080, ekranın yukarıdan aşağı 1080 nokta (piksel) olduğunu söyler. Sondaki p ise görüntünün tek seferde, satır atlamadan çizildiğini gösterir (İngilizce “progressive”). Siz yalnızca sayıya bakın.</p>`,
      scene: kaliteSahnesi,
      on: (ev, c) => ev.type === 'vh-q' && ev.tried.includes('144') && (ev.tried.includes('1080') || ev.tried.includes('2160')),
      done: '144p’de resim kocaman karelerden oluşuyor, yazı okunmuyor; 1080p ve 4K’da yazı bile keskin. Ama dikkat: kalite arttıkça video çok daha fazla internet harcıyor. Video sitelerinde kaliteyi, videonun üstündeki ⚙ (dişli) simgesinden seçersiniz; “Otomatik” seçiliyse internet yavaşlayınca kalite kendiliğinden düşer.',
    },
    sec({
      title: 'Kotanız dar', text: '<p>Telefonunuzda <b>mobil internet kotanız</b> kısıtlı: ayda 10 GB. Bir yemek tarifi videosunu telefonda izleyeceksiniz.</p>',
      q: 'Hangi kaliteyi seçersiniz?', opts: ['4K: en güzel görünür', '360p ya da 480p: küçük ekranda yeterli, kotanız az harcanır', '144p: bir şey görünmese de olur'], ok: 1,
      why: 'Telefonun küçük ekranında 360p–480p bile yeterince nettir; 4K gereksiz yere kotanızı bitirir. Evde kablosuz internetle (Wi-Fi) izlerken kota sorun olmaz.',
    }),
    sec({
      title: 'Ekran ve video', text: '<p>Bilgisayarınızın ekranı <b>1920 × 1080 (Full HD)</b>. İnternette bir videonun <b>4K</b> sürümü var.</p>',
      q: '4K izlerseniz ne olur?', opts: ['Görüntü iki kat netleşir', 'Ekran Full HD olduğu için 1080p’den çok farklı görünmez; ama daha çok internet harcar', 'Bilgisayar bozulur'], ok: 1,
      why: 'Ekran en fazla kendi nokta sayısı kadar netlik gösterebilir. Full HD ekranda 1080p yeterlidir; 4K video fazladan veri harcar. 4K’nın faydası yalnızca 4K bir ekran ya da televizyonda görülür.',
    }),
    {
      title: 'Akıcılığı deneyin',
      html: `<p>Şimdi ekranın <b>Hz</b> değeri. Bir defterin köşesine koşan bir çöp adam çizdiğinizi düşünün. Sayfaları saniyede 5 kez çevirirseniz adam sıçrar; saniyede 60 kez çevirirseniz <b>koşar gibi</b> görünür.</p>
        <p><b>5 Hz</b>, <b>15 Hz</b>, <b>30 Hz</b> ve <b>60 Hz</b>'i sırayla deneyin. Adam her seferinde aynı hızda koşuyor; yalnızca ekranın <b>yenilenme sayısı</b> değişiyor.</p>`,
      scene: hzSahnesi,
      on: (ev) => ev.type === 'vh-hz' && ev.tried.includes(5) && ev.tried.includes(60) && ev.tried.length >= 3,
      done: 'Hz, ekranın <b>saniyede kaç kez yenilendiğidir</b>. 60 Hz akıcı; 144 Hz’de hareket daha da yumuşak akar. Bu fark en çok maç yayını gibi hızlı hareketlerde fark edilir; ofis ve internet işleri için 60 Hz yeterlidir.',
    },
    sec({
      title: 'Hz nedir?', text: '<div class="qz-pic">🖥 60 Hz</div>',
      q: '60 Hz ne demektir?', opts: ['Ekranın saniyede 60 kez yenilenmesi', 'Ekranın 60 santim olması', 'Bilgisayarın 60 derece ısınması'], ok: 0,
      why: 'Hertz (Hz) “saniyedeki sayı”dır. 60 Hz = saniyede 60 resim. Kablolu elektrikteki 50 Hz de aynı mantık: saniyede 50 titreşim.',
    }),
    sec({
      title: 'Kare sayısı ve Hz', text: '<p>Bir tanıdığınız: “Telefonum maçı saniyede <b>120 kare</b> olarak kaydetti, ama televizyonum <b>60 Hz</b>. Hepsini görebilir miyim?”</p>',
      q: 'Gerçekte ekranda kaç kare görür?', opts: ['120', '60: ekran saniyede en fazla 60 kare gösterebilir', '240'], ok: 1,
      why: 'Kare üreten (kamera, video, bilgisayar) ile kare gösteren (ekran) ayrıdır. 60 Hz ekran saniyede en çok 60 kare gösterir; fazlası görünmez. Bu yüzden çok akıcı görüntü için ekranın da yüksek Hz desteklemesi gerekir.',
    }),
    {
      title: 'Ekran ayarı',
      html: `<p>Ekranın ayarları <b>Ayarlar → Sistem → Ekran</b> sayfasındadır. Sağdaki taslakta <b>Ekran çözünürlüğü</b>ne bakın: bilgisayar sizin için bir ayar seçmiş. Önce başka bir değer seçip yazının nasıl değiştiğine bakın; sonra <b>“Önerilen”</b> yazanı seçin.</p>`,
      scene: ekranAyari,
      on: (ev, c) => {
        if (ev.type === 'vh-res' && !ev.rec) c.s.other = true;
        return ev.type === 'vh-res' && ev.rec && !!c.s.other;
      },
      done: 'Önerilen değer, ekranın kendi nokta sayısıdır; en keskin görüntüyü o verir. Yazılar çok küçük gelirse çözünürlüğü değil, Ayarlar → Ekran → “Ölçek” ya da yazı boyutunu büyütün.',
    },
    sec({
      title: 'Yazılar küçük', text: '<p>Bir tanıdığınızın ekranında yazılar çok küçük. Çözünürlüğü <b>1024 × 768</b>’e düşürmeyi düşünüyor: “Böylece her şey büyür.”</p>',
      q: 'Ne dersiniz?', opts: ['Güzel fikir', 'Önerilen çözünürlük kalsın; yazıyı büyütmek için Ölçek ya da Metin boyutu ayarını kullansın', 'Ekranı yenilesin'], ok: 1,
      why: 'Çözünürlüğü önerilenin altına çekmek görüntüyü bulanıklaştırır. Yazıyı büyütmenin doğru yolu Ayarlar → Ekran → Ölçek ya da Erişilebilirlik → Metin boyutudur.',
    }),
    { final: true, title: 'Tebrikler! 🎉', html: '<p>Video kalitesi ve Hz:</p>', scene: info('<div class="sc-big">🎞 ✔ 🖥</div>') },
  ],
};
