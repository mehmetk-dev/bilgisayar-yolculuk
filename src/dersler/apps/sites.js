// Tarayıcıda açılan örnek web siteleri. Hepsi uydurmadır; gerçek bir siteye bağlanılmaz.
// Bağlantılar data-href, düğmeler data-act ile çalışır; indirmeler data-download ile yapılır.

export const SEARCH_HOST = 'www.bulalim.com';

const RESULTS = [
  { keys: ['börek', 'borek', 'tarif', 'yemek', 'ıspanak'], title: 'Ispanaklı Börek Tarifi (Adım Adım)', url: 'www.lezzetli-tarifler.com.tr/borek', snip: 'Çıtır çıtır ıspanaklı börek nasıl yapılır? Malzemeler, püf noktaları ve resimli anlatım…' },
  { keys: ['mercimek', 'çorba', 'corba', 'tarif', 'yemek'], title: 'Mercimek Çorbası Tarifi', url: 'www.lezzetli-tarifler.com.tr/mercimek', snip: 'Lokanta usulü mercimek çorbası: 30 dakikada hazır.' },
  { keys: ['hava', 'durumu', 'yağmur', 'sıcaklık'], title: 'Hava Durumu: 5 Günlük Tahmin', url: 'www.hava-durumu.com.tr', snip: 'İstanbul, Ankara, İzmir ve tüm illerin hava durumu.' },
  { keys: ['haber', 'gündem', 'son dakika', 'haberler'], title: 'Günün Haberleri', url: 'www.gunun-haberleri.com.tr', snip: 'Gündemden, spordan, ekonomiden son haberler.' },
  { keys: ['resim', 'gösterici', 'gosterici', 'program', 'indir', 'fotoğraf'], title: 'Resim Gösterici: Ücretsiz İndir', url: 'www.program-indir.com.tr/resim-gosterici', snip: 'Fotoğraflarınızı kolayca açın, büyütün, döndürün. Ücretsiz ve güvenli indirme.' },
  { keys: ['yazıcı', 'yazici', 'sürücü', 'surucu', 'r-200', 'r200', 'driver'], title: 'Renkli Yazıcı R-200 Sürücüleri', url: 'www.yazici-destek.com.tr/r-200', snip: 'Yazıcınızın resmî sürücü ve yazılım indirme sayfası.' },
  { keys: ['banka', 'bankam'], title: 'Bankam: İnternet Şubesi', url: 'www.bankam.com.tr', snip: 'İnternet şubesine güvenli giriş.' },
];
const AD = { title: 'Bilgisayarınız YAVAŞ mı? 10 KAT Hızlandırın!', url: 'www.super-hizlandirici.xyz', snip: 'Hemen indirin, ücretsiz tarama yapın!!!' };

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });

const BOREK_STEPS = [
  'Ispanakları bol suda iyice yıkayın, saplarını ayıklayıp ince ince doğrayın.',
  'Soğanı yemeklik doğrayın ve iki yemek kaşığı zeytinyağında pembeleşinceye kadar kavurun.',
  'Ispanakları ekleyip suyunu salıp çekene kadar pişirin. Tuzunu ve karabiberini ayarlayın.',
  'Ilınan ıspanaklı harca ufaladığınız beyaz peyniri ekleyip karıştırın.',
  'Sos için yumurta, süt ve sıvı yağı bir kapta çırpın. Yumurtanın birazını üstüne sürmek için ayırın.',
  'Tepsiyi yağlayın. Yufkanın birini tepsiye serin, üzerine sosu fırça ile sürün.',
  'İkinci yufkayı buruşturarak yerleştirin, yine sos sürün. Böylece yufkaların yarısını dizin.',
  'Ispanaklı harcı eşit şekilde yayın.',
  'Kalan yufkaları da aynı şekilde sos sürerek dizin.',
  'Böreği dilimleyin, üzerine ayırdığınız yumurtayı sürün, susam serpin.',
  'Önceden ısıtılmış 180 derece fırında üzeri kızarana kadar yaklaşık 40 dakika pişirin.',
  'Fırından çıkınca üzerini bir bezle örtüp 10 dakika dinlendirin, sonra servis yapın.',
];

export const SITES = {
  [SEARCH_HOST]: {
    name: 'Bulalım', secure: true,
    render(path, q) {
      if (path.startsWith('/ara')) {
        const words = q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
        const hits = RESULTS.map((r) => ({ r, score: words.filter((w) => r.keys.some((k) => k.includes(w) || w.includes(k))).length })).filter((x) => x.score).sort((a, b) => b.score - a.score).map((x) => x.r);
        const showAd = words.some((w) => ['indir', 'program', 'yavaş', 'hızlandır', 'resim'].some((k) => w.includes(k)));
        return page(`${q} - Bulalım'da ara`, `<div class="se-top"><span class="se-logo small">Bulalım</span><form class="se-form" data-search><input name="q" value="${escAttr(q)}"><button>🔍</button></form></div>
          <p class="se-count">Yaklaşık ${hits.length ? hits.length * 1240 : 0} sonuç bulundu</p>
          ${showAd ? `<div class="se-res ad"><small class="ad-tag">Reklam</small><a data-href="${AD.url}" data-ad="1">${AD.title}</a><cite>${AD.url}</cite><p>${AD.snip}</p></div>` : ''}
          ${hits.map((r) => `<div class="se-res"><cite>${r.url.split('/')[0]}</cite><a data-href="${r.url}">${r.title}</a><p>${r.snip}</p></div>`).join('') || '<p>Aramanızla eşleşen sonuç bulunamadı. Farklı kelimelerle deneyin.</p>'}`, 'se');
      }
      return page('Bulalım', `<div class="se-home"><div class="se-logo">Bulalım</div><form class="se-form big" data-search><input name="q" placeholder="Ne aramak istersiniz?" autocomplete="off"><button>🔍 Ara</button></form>
        <p class="se-tip">Örnek: <a data-q="börek tarifi">börek tarifi</a> · <a data-q="hava durumu">hava durumu</a> · <a data-q="haberler">haberler</a></p></div>`, 'se');
    },
  },
  'www.lezzetli-tarifler.com.tr': {
    name: 'Lezzetli Tarifler', secure: true,
    render(path) {
      const head = '<header class="lt-head">🥘 Lezzetli Tarifler<nav><a data-href="www.lezzetli-tarifler.com.tr">Ana sayfa</a></nav></header>';
      if (path === '/borek') {
        return page('Ispanaklı Börek Tarifi', `${head}<article class="lt"><h1>Ispanaklı Börek</h1><div class="lt-img">🥧</div>
          <p class="lt-meta">Hazırlık: 30 dk · Pişirme: 40 dk · 8 kişilik</p>
          <h2>Malzemeler</h2><ul><li>5 adet yufka</li><li>1 bağ ıspanak</li><li>1 adet soğan</li><li>200 g beyaz peynir</li><li>2 yumurta</li><li>1 su bardağı süt</li><li>Yarım su bardağı sıvı yağ</li><li>Tuz, karabiber, susam</li></ul>
          <h2>Nasıl yapılır?</h2><ol>${BOREK_STEPS.map((s) => `<li>${s}</li>`).join('')}</ol>
          <h2>Püf noktaları</h2><p>Yufkaları buruşturarak dizerseniz börek daha kabarık olur. Ispanağın suyunu iyice çekmezseniz börek hamur kalabilir.</p>
          <h2>Yorumlar (3)</h2><div class="lt-c"><b>Fatma H.</b><p>Tarif harika oldu, ailecek bayıldık.</p></div><div class="lt-c"><b>Mehmet K.</b><p>Peyniri biraz fazla koydum, çok güzel oldu.</p></div><div class="lt-c"><b>Zeynep A.</b><p>Susam yerine çörek otu da yakışıyor.</p></div>
          <div class="lt-end" data-end="1">🎉 Sayfanın sonuna geldiniz!<br>Gizli kelime: <b>AFİYET</b></div></article>`);
      }
      if (path === '/mercimek') return page('Mercimek Çorbası', `${head}<article class="lt"><h1>Mercimek Çorbası</h1><div class="lt-img">🍲</div><p>1 su bardağı kırmızı mercimek, 1 soğan, 1 havuç, 1 kaşık un, tereyağı, tuz ve 6 su bardağı su. Hepsini 25 dakika pişirip blenderdan geçirin.</p></article>`);
      return page('Lezzetli Tarifler', `${head}<div class="lt-grid"><a data-href="www.lezzetli-tarifler.com.tr/borek">🥧<b>Ispanaklı Börek</b></a><a data-href="www.lezzetli-tarifler.com.tr/mercimek">🍲<b>Mercimek Çorbası</b></a></div>`);
    },
  },
  'www.hava-durumu.com.tr': {
    name: 'Hava Durumu', secure: true,
    render(path) {
      const city = decodeURIComponent(path.slice(1)) || 'İstanbul';
      const data = { İstanbul: ['☀', 24, '⛅', 22, '🌧', 18, '🌧', 17, '☀', 23], Ankara: ['☀', 20, '☀', 21, '⛅', 19, '☀', 22, '⛅', 18], İzmir: ['☀', 28, '☀', 29, '☀', 27, '⛅', 26, '☀', 28] }[city] || ['☀', 24, '⛅', 22, '🌧', 18, '🌧', 17, '☀', 23];
      const days = ['Bugün', 'Yarın', 'Perşembe', 'Cuma', 'Cumartesi'];
      return page(`${city} Hava Durumu`, `<header class="hd-head">🌤 Hava Durumu</header><div class="hd"><div class="hd-cities">${['İstanbul', 'Ankara', 'İzmir'].map((c) => `<a data-href="www.hava-durumu.com.tr/${c}" class="${c === city ? 'on' : ''}">${c}</a>`).join('')}</div>
        <h1>${city}</h1><div class="hd-days">${days.map((d, i) => `<div><b>${d}</b><span>${data[i * 2]}</span>${data[i * 2 + 1]}°</div>`).join('')}</div></div>`);
    },
  },
  'www.gunun-haberleri.com.tr': {
    name: 'Günün Haberleri', secure: true,
    render(path) {
      const news = [['Kış lastiği uygulaması yarın başlıyor', 'Sürücülerin kış lastiği takması için son gün yaklaşıyor. Uzmanlar, lastik diş derinliğinin en az 4 mm olmasını öneriyor.'], ['Belediyeden yaşlılara ücretsiz bilgisayar kursu', 'Kurslar her hafta salı ve perşembe günleri yapılacak. Katılımcılara sertifika verilecek.'], ['Dolandırıcılara karşı uyarı: kodunuzu kimseyle paylaşmayın', 'Bankalar, telefonla aranıp şifre ya da doğrulama kodu istenmesinin dolandırıcılık olduğunu hatırlattı.']];
      const m = path.match(/^\/haber\/(\d)/);
      const head = '<header class="gh-head">📰 Günün Haberleri<nav><a data-href="www.gunun-haberleri.com.tr">Ana sayfa</a></nav></header>';
      if (m) { const n = news[+m[1]] || news[0]; return page(n[0], `${head}<article class="gh"><h1>${n[0]}</h1><p>${n[1]}</p><p>${n[1]}</p></article>`); }
      return page('Günün Haberleri', `${head}<div class="gh">${news.map((n, i) => `<a class="gh-item" data-href="www.gunun-haberleri.com.tr/haber/${i}"><span>📰</span><b>${n[0]}</b></a>`).join('')}</div>`);
    },
  },
  'www.program-indir.com.tr': {
    name: 'Program İndir', secure: true,
    render(path) {
      const head = '<header class="pi-head">⬇ Program İndir<nav><a data-href="www.program-indir.com.tr">Ana sayfa</a></nav></header>';
      const adBox = (txt, cls = '') => `<button type="button" class="pi-ad ${cls}" data-ad="1">${txt}</button>`;
      if (path === '/resim-gosterici') {
        return page('Resim Gösterici indir', `${head}<div class="pi">
          ${adBox('⬇⬇ HEMEN İNDİR ⬇⬇<small>Hızlı indirme yöneticisi</small>', 'big')}
          <div class="pi-card"><div class="pi-ic">🌄</div><div><h1>Resim Gösterici 2.4</h1><p>Fotoğraflarınızı açmak, büyütmek ve döndürmek için ücretsiz program.</p>
          <p class="pi-meta">Yayıncı: Örnek Yazılım A.Ş. · Boyut: 12 MB · Lisans: Ücretsiz · Windows 10/11</p>
          <a class="pi-real" data-download="ResimGosterici_Kurulum.exe">Resim Gösterici'yi indir (12 MB)</a></div></div>
          ${adBox('▶ İNDİR (Ücretsiz)<small>Sponsorlu</small>', 'green')}
          ${adBox('⚠ Bilgisayarınızda 3 sorun bulundu! Şimdi onarın', 'red')}</div>`);
      }
      return page('Program İndir', `${head}<div class="pi"><h1>Popüler programlar</h1><a class="pi-row" data-href="www.program-indir.com.tr/resim-gosterici">🌄 <b>Resim Gösterici</b> · Fotoğraf görüntüleyici</a>${adBox('🚀 Bilgisayarınızı hızlandırın!')}</div>`);
    },
  },
  'www.yazici-destek.com.tr': {
    name: 'Yazıcı Destek', secure: true,
    render() {
      return page('R-200 Sürücüleri', `<header class="pi-head">🖨 Yazıcı Destek</header><div class="pi"><div class="pi-card"><div class="pi-ic">🖨</div><div><h1>Renkli Yazıcı R-200</h1><p>Sürücü (driver): yazıcının bilgisayarla anlaşmasını sağlayan programdır.</p><p class="pi-meta">Windows 11 / 10 · 64 bit · Sürüm 3.1</p><a class="pi-real" data-download="R200_Surucu.exe">Sürücüyü indir (25 MB)</a></div></div></div>`);
    },
  },
  'www.super-hizlandirici.xyz': {
    name: 'Süper Hızlandırıcı', secure: false,
    render() {
      return page('!!! HIZLANDIR !!!', `<div class="scam"><h1>⚠ DİKKAT! Bilgisayarınız ÇOK YAVAŞ!</h1><p>Hemen “Hızlandırıcı”yı indirin, ödeme bilgilerinizi girin, bilgisayarınız 10 kat hızlansın!!!</p><div class="scam-btns"><button type="button" class="pi-ad red" data-ad="1">ŞİMDİ ÖDE VE HIZLANDIR</button></div><p class="scam-note">(Bu bir alıştırma sayfasıdır. Gerçekte böyle sayfalarda hiçbir şey indirmeyin, bilgi girmeyin.)</p></div>`, 'scam-bg');
    },
  },
  'www.bedava-hediye-kazan.xyz': {
    name: 'Hediye', secure: false,
    popup: true,
    render() {
      return page('TEBRİKLER!!!', `<div class="scam"><h1>🎁 TEBRİKLER! 1.000.000. ZİYARETÇİMİZ SİZSİNİZ!</h1><p>Yeni telefonunuzu kazanmak için kart bilgilerinizi girin. Kargo ücreti sadece 9,90 TL!</p><div class="scam-form"><input placeholder="Kart numarası" disabled><input placeholder="Son kullanma tarihi" disabled><input placeholder="CVV" disabled></div><p class="scam-note">(Alıştırma sayfasıdır. Gerçekte asla kart bilgisi girmeyin.)</p></div>`, 'scam-bg');
    },
  },
  'www.bankam.com.tr': {
    name: 'Bankam', secure: true,
    render() {
      return page('Bankam İnternet Şubesi', `<header class="bk-head">🏦 Bankam</header><div class="bk"><h1>İnternet Şubesi</h1><div class="bk-form"><input placeholder="T.C. Kimlik No" disabled><input placeholder="Şifre" disabled><button type="button" disabled>Giriş</button></div><p class="bk-note">🔒 Adres çubuğunda kilit işareti ve <b>bankam.com.tr</b> adresi var.<br>Bankanız sizden asla telefonla ya da SMS ile şifre istemez.</p></div>`);
    },
  },
  'www.bankam-guvenlik-giris.xyz': {
    name: 'Bankam (sahte)', secure: false,
    render() {
      return page('Bankam İnternet Şubesi', `<header class="bk-head fake">🏦 Bankam</header><div class="bk"><h1>Hesabınız bloke edildi! Hemen giriş yapın</h1><div class="bk-form"><input placeholder="T.C. Kimlik No" disabled><input placeholder="Şifre" disabled><input placeholder="Kart numarası" disabled><button type="button" disabled>Onayla</button></div><p class="scam-note">(Alıştırma: bu sayfa SAHTEDİR. Adres yanlış, kilit yok, aceleye getiriyor ve kart numarası istiyor.)</p></div>`);
    },
  },
};

function escAttr(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

// Adres çubuğuna yazılanı çözümler: site adresi mi, arama mı?
export function resolve(input) {
  let t = input.trim();
  if (!t) return null;
  const looksUrl = !/\s/.test(t) && /\.[a-zçğıöşü]{2,}/i.test(t);
  if (!looksUrl) return { host: SEARCH_HOST, path: '/ara', q: t, search: true };
  t = t.replace(/^https?:\/\//i, '');
  const slash = t.indexOf('/');
  let host = (slash < 0 ? t : t.slice(0, slash)).toLocaleLowerCase('tr');
  const path = slash < 0 ? '/' : t.slice(slash) || '/';
  if (!SITES[host] && SITES['www.' + host]) host = 'www.' + host;
  return { host, path, q: '' };
}
