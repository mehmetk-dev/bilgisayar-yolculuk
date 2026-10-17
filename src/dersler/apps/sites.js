// Tarayıcıda açılan örnek web siteleri. Hepsi uydurmadır; gerçek bir siteye bağlanılmaz.
// Bağlantılar data-href, düğmeler data-act ile çalışır; indirmeler data-download ile yapılır.

import { pictureURL, esc, setCookie } from './util.js';
import { GUNLUK_SITES } from './siteler-gunluk.js';
import { BULUT_SITE } from './bulut.js';
import { MEDYA_SITES } from './siteler-medya.js';
import { HESAP_SITES } from './siteler-hesap.js';
import { MESAJ_SITES } from './siteler-mesaj.js';
import { HIZMET_SITES } from './siteler-hizmet.js';
import { YZ_SITES } from './siteler-yz.js';
import { BELGE_SITES } from './siteler-belge.js';
import { AG_SITES } from './siteler-ag.js';
import { FOTO_SITES } from './siteler-foto.js';
import { HARITA_SITES } from './siteler-harita.js';
import { BANKA_SITES } from './siteler-banka.js';
import { KAMU_SITES } from './siteler-kamu.js';

export const SEARCH_HOST = 'www.bulalim.com';

// Ücretsiz fotoğraf sitesindeki resimler: indirilince dosyanın içeriği bu olur
export const PHOTOS = {
  'deniz-manzarasi': { name: 'deniz manzarası.jpg', emoji: '🌅', bg: ['#ff9a5a', '#2a6fdb'], title: 'Deniz manzarası' },
  'kapadokya': { name: 'kapadokya.jpg', emoji: '🎈', bg: ['#ffd8a8', '#7ab8f5'], title: 'Kapadokya balonları' },
  'orman': { name: 'orman.jpg', emoji: '🌲', bg: ['#a5d6a7', '#1b5e20'], title: 'Orman yolu' },
  'lale': { name: 'lale bahçesi.jpg', emoji: '🌷', bg: ['#f8bbd0', '#81c784'], title: 'Lale bahçesi' },
  'kis': { name: 'karlı dağ.jpg', emoji: '🏔', bg: ['#e3f2fd', '#90a4ae'], title: 'Karlı dağ' },
  'kedi': { name: 'kedi.jpg', emoji: '🐱', bg: ['#fff3e0', '#ffcc80'], title: 'Uykucu kedi' },
};
export const photoContent = (id) => { const p = PHOTOS[id]; return p && { emoji: p.emoji, bg: p.bg }; };

const RESULTS = [
  { keys: ['börek', 'borek', 'tarif', 'yemek', 'ıspanak'], title: 'Ispanaklı Börek Tarifi (Adım Adım)', url: 'www.lezzetli-tarifler.com.tr/borek', snip: 'Çıtır çıtır ıspanaklı börek nasıl yapılır? Malzemeler, püf noktaları ve resimli anlatım…' },
  { keys: ['mercimek', 'çorba', 'corba', 'tarif', 'yemek'], title: 'Mercimek Çorbası Tarifi', url: 'www.lezzetli-tarifler.com.tr/mercimek', snip: 'Lokanta usulü mercimek çorbası: 30 dakikada hazır.' },
  { keys: ['hava', 'durumu', 'yağmur', 'sıcaklık'], title: 'Hava Durumu: 5 Günlük Tahmin', url: 'www.hava-durumu.com.tr', snip: 'İstanbul, Ankara, İzmir ve tüm illerin hava durumu.' },
  { keys: ['haber', 'gündem', 'son dakika', 'haberler'], title: 'Günün Haberleri', url: 'www.gunun-haberleri.com.tr', snip: 'Gündemden, spordan, ekonomiden son haberler.' },
  { keys: ['resim', 'gösterici', 'gosterici', 'program', 'indir', 'fotoğraf'], title: 'Resim Gösterici: Ücretsiz İndir', url: 'www.program-indir.com.tr/resim-gosterici', snip: 'Fotoğraflarınızı kolayca açın, büyütün, döndürün. Ücretsiz ve güvenli indirme.' },
  { keys: ['yazıcı', 'yazici', 'sürücü', 'surucu', 'r-200', 'r200', 'driver'], title: 'Renkli Yazıcı R-200 Sürücüleri', url: 'www.yazici-destek.com.tr/r-200', snip: 'Yazıcınızın resmî sürücü ve yazılım indirme sayfası.' },
  { keys: ['fotoğraf', 'fotograf', 'manzara', 'duvar', 'kağıdı', 'arka', 'plan', 'resim', 'resimler', 'ücretsiz'], title: 'Ücretsiz Fotoğraflar: Manzara, Doğa, Hayvanlar', url: 'www.ucretsiz-fotograflar.com.tr', snip: 'Telif ücreti olmayan, indirip kullanabileceğiniz binlerce fotoğraf ve duvar kâğıdı.' },
  { keys: ['uzantı', 'uzanti', 'eklenti', 'reklam', 'engelle', 'engelleyici', 'sesli', 'okuma', 'karanlık', 'gece'], title: 'Uzantı Mağazası: tarayıcınıza yeni özellikler ekleyin', url: 'uzantilar.bulalim.com', snip: 'Reklam engelleyici, gece okuma modu, sesli okuyucu ve daha fazlası.' },
  { keys: ['banka', 'bankam'], title: 'Bankam: İnternet Şubesi', url: 'www.bankam.com.tr', snip: 'İnternet şubesine güvenli giriş.' },
  { keys: ['e-devlet', 'edevlet', 'devlet', 'türkiye', 'turkiye', 'barkodlu', 'belge'], title: 'e-Devlet Kapısı', url: 'www.turkiye.gov.tr', snip: 'Kamu hizmetlerine tek noktadan, güvenli erişim.' },
  { keys: ['meb', 'milli', 'eğitim', 'egitim', 'okul', 'kurs'], title: 'Millî Eğitim Bakanlığı', url: 'www.meb.gov.tr', snip: 'Bakanlığın resmî sitesi: duyurular, haberler, hayat boyu öğrenme kursları.' },
  { keys: ['randevu', 'hastane', 'mhrs', 'doktor', 'muayene', 'hekim'], title: 'MHRS: Hastane ve Aile Hekimi Randevusu', url: 'www.mhrs.gov.tr', snip: 'Merkezi Hekim Randevu Sistemi. Randevu alın, randevularınızı görün ve iptal edin.' },
  { keys: ['video', 'youtube', 'izle', 'izleyelim', 'radyo', 'altyazı', 'dinle', 'egzersiz', 'domates'], title: 'İzleyelim: videolar ve internet radyosu', url: 'www.izleyelim.com', snip: 'Tarif, bahçe, sağlık videoları ve canlı radyo kanalları.' },
  { keys: ['gazete', 'gazete-oku', 'yerel', 'günlük', 'belediye'], title: 'Gazete Oku: günün yerel haberleri', url: 'www.gazete-oku.com.tr', snip: 'Güne bir bakışta: yerel haberler ve duyurular.' },
  { keys: ['whatsapp', 'mesajlaş', 'mesajlas', 'sohbet', 'karekod', 'qr', 'mesaj'], title: 'Mesajlaş Web: mesajlarınız bilgisayarınızda', url: 'web.mesajlas.com', snip: 'Telefondaki mesajlaşma uygulamasını karekodla bilgisayarda açın.' },
  { keys: ['enabız', 'e-nabız', 'nabız', 'reçete', 'tahlil', 'aile hekimi', 'sağlık'], title: 'e-Nabız: reçete ve tahlil sonuçlarınız', url: 'enabiz.gov.tr', snip: 'Reçetelerinize, tahlil sonuçlarınıza ve aile hekiminize bakın.' },
  { keys: ['ilan', 'kiralık', 'kiralik', 'emlak', 'ev', 'daire', 'satılık'], title: 'İlan Pazarı: kiralık ve satılık evler', url: 'www.ilan-pazari.com.tr', snip: 'Kiralık daire ilanlarını il, oda ve fiyata göre arayın.' },
  { keys: ['yapay', 'zeka', 'zekâ', 'yardımcı', 'yardimci', 'sohbet', 'asistan', 'özetle'], title: 'Dijital Yardımcı: yapay zekâ ile yazışın', url: 'yardimci.bulalim.com', snip: 'Yazı özetletin, tarif ve gezi planı isteyin (alıştırma sürümü).' },
  { keys: ['belediye', 'form', 'dilekçe', 'dilekce', 'başvuru', 'basvuru', 'su abonelik', 'abonelik', 'pdf'], title: 'Örnek Belediyesi: form ve dilekçeler', url: 'www.ornek-belediyesi.bel.tr', snip: 'Su abonelik başvuru formu ve diğer formları PDF olarak indirin.' },
  { keys: ['indirim', 'alışveriş', 'alisveris', 'fırsat', 'firsat', 'kampanya'], title: 'Fırsat Pazarı: günün indirimleri', url: 'www.firsat-pazari.com.tr', snip: 'Mutfak, ev ve elektronikte günün fırsatları.' },
];
const AD = { title: 'Bilgisayarınız YAVAŞ mı? 10 KAT Hızlandırın!', url: 'www.super-hizlandirici.xyz', snip: 'Hemen indirin, ücretsiz tarama yapın!!!' };
// Arama sonuçlarının en üstüne konan sahte e-Devlet reklamı (dolandırıcılar reklam satın alabilir)
const AD_DEVLET = { title: 'e-Devlet Giriş - Hızlı Giriş Yap', url: 'www.turkiye-gov-giris.com', snip: 'e-Devlet şifrenizle hemen giriş yapın. Belgelerinizi anında indirin.' };

// Adresteki asıl site adı (alan adı): sondaki iki parça; .com.tr, .gov.tr gibi ülke uzantılarında üç parça.
// Ör. bankam.com.tr.hesap-dogrulama.xyz → hesap-dogrulama.xyz
export function siteName(host) {
  const p = host.replace(/^www\./, '').split('.');
  const two = p.slice(-2).join('.');
  return /^(com|gov|edu|org|net|bel|k12|gen|av|tsk|pol)\.tr$/.test(two) ? p.slice(-3).join('.') : two;
}

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
    act(a, v, ctx, el) {
      if (a !== 'tab') return;
      ctx.state.tab = el.dataset.v;
      ctx.state.tabQ = ctx.loc.q;
      ctx.emit('search-tab', { tab: el.dataset.v });
      ctx.refresh();
    },
    render(path, q, ctx) {
      if (path.startsWith('/ara')) {
        const tab = ctx && ctx.state.tabQ === q ? ctx.state.tab || 'all' : 'all';
        const tabs = `<div class="se-tabs">${[['all', 'Tümü'], ['img', '🖼 Görseller'], ['news', '📰 Haberler']].map(([k, l]) => `<button type="button" data-act="tab" data-v="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
        if (tab === 'img') {
          const ws = q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
          const all = Object.values(PHOTOS), pick = all.filter((p) => ws.some((w) => (p.title + ' ' + p.name).toLocaleLowerCase('tr').includes(w)));
          const list = pick.length ? pick : all;
          return page(`${q} - Görseller - Bulalım'da ara`, `<div class="se-top"><span class="se-logo small">Bulalım</span><form class="se-form" data-search><input name="q" value="${escAttr(q)}"><button>🔍</button></form></div>${tabs}
            <p class="se-count">“${esc(q)}” için görseller${pick.length ? '' : ' (tam eşleşme yok, benzerleri gösteriliyor)'}</p><div class="se-imgs">${list.map((p) => `<figure><span style="background:linear-gradient(135deg,${p.bg[0]},${p.bg[1]})">${p.emoji}</span><figcaption>${esc(p.title)}</figcaption></figure>`).join('')}</div>
            <p class="mut">Görsellerin çoğunun <b>telif hakkı</b> vardır: izinsiz kullanmayın; serbest kullanım yazan sitelerden alın.</p>`, 'se');
        }
        if (tab === 'news') {
          return page(`${q} - Haberler - Bulalım'da ara`, `<div class="se-top"><span class="se-logo small">Bulalım</span><form class="se-form" data-search><input name="q" value="${escAttr(q)}"><button>🔍</button></form></div>${tabs}
            <p class="se-count">“${esc(q)}” için son haberler</p>${[['Belediyeden yaşlılara ücretsiz bilgisayar kursu', 'Günün Haberleri · 2 saat önce'], ['Kış lastiği uygulaması yarın başlıyor', 'Günün Haberleri · 5 saat önce'], ['Dolandırıcılara karşı uyarı: kodunuzu kimseyle paylaşmayın', 'Günün Haberleri · dün']].map(([t, m]) => `<div class="se-res"><cite>${m}</cite><a data-href="www.gunun-haberleri.com.tr">${t}</a></div>`).join('')}
            <p class="mut">Haber sonuçları tarihe göre sıralanır; yine de haberin asıl kaynağına ve tarihine bakın.</p>`, 'se');
        }
        const words = q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
        const hits = RESULTS.map((r) => ({ r, score: words.filter((w) => r.keys.some((k) => k.includes(w) || w.includes(k))).length })).filter((x) => x.score).sort((a, b) => b.score - a.score).map((x) => x.r);
        const devlet = words.some((w) => w.includes('devlet'));
        const ad = devlet ? AD_DEVLET : AD;
        const showAd = devlet || words.some((w) => ['indir', 'program', 'yavaş', 'hızlandır', 'resim'].some((k) => w.includes(k)));
        return page(`${q} - Bulalım'da ara`, `<div class="se-top"><span class="se-logo small">Bulalım</span><form class="se-form" data-search><input name="q" value="${escAttr(q)}"><button>🔍</button></form></div>
          ${tabs}<p class="se-count">Yaklaşık ${hits.length ? hits.length * 1240 : 0} sonuç bulundu</p>
          ${showAd ? `<div class="se-res ad"><small class="ad-tag">Reklam</small><a data-href="${ad.url}" data-ad="1">${ad.title}</a><cite>${ad.url}</cite><p>${ad.snip}</p></div>` : ''}
          ${hits.map((r) => `<div class="se-res"><cite>${r.url.split('/')[0]}</cite><a data-href="${r.url}">${r.title}</a><p>${r.snip}</p></div>`).join('') || '<p>Aramanızla eşleşen sonuç bulunamadı. Farklı kelimelerle deneyin.</p>'}`, 'se');
      }
      return page('Bulalım', `<div class="se-home"><div class="se-logo">Bulalım</div><form class="se-form big" data-search><input name="q" placeholder="Ne aramak istersiniz?" autocomplete="off"><button>🔍 Ara</button></form>
        <p class="se-tip">Örnek: <a data-q="börek tarifi">börek tarifi</a> · <a data-q="hava durumu">hava durumu</a> · <a data-q="haberler">haberler</a></p></div>`, 'se');
    },
  },
  'www.lezzetli-tarifler.com.tr': {
    name: 'Lezzetli Tarifler', secure: true,
    act(a, v, ctx, el) {
      if (a !== 'ck') return;
      const all = el.dataset.v === 'all';
      ctx.state.cookie = all ? 'all' : 'need';
      setCookie(ctx.desk, { site: 'lezzetli-tarifler.com.tr', name: 'tercihler', party: 'first', purpose: 'Çerez seçiminizi hatırlar; pencere bir daha çıkmaz' });
      if (all) setCookie(ctx.desk, { site: 'reklam-takip.net', name: 'izleme', party: 'third', purpose: 'Gezdiğiniz sayfaları reklam göstermek için izler' });
      ctx.emit('cookie-choice', { choice: ctx.state.cookie });
      ctx.refresh();
    },
    render(path, q, ctx) {
      const r = this.body(path);
      const ban = ctx && !ctx.state.cookie ? `<div class="ck-banner"><b>🍪 Çerezleri kullanıyoruz</b><p>Size daha iyi hizmet vermek ve reklam göstermek için çerez kullanıyoruz.</p><div><button type="button" class="ed-btn small" data-act="ck" data-v="all">Tümünü kabul et</button><button type="button" class="ed-btn small ghost" data-act="ck" data-v="need">Yalnızca gerekli olanlar</button></div></div>` : '';
      return { ...r, html: r.html.replace(/^<div class="wp[^"]*">/, (m) => m + ban) };
    },
    body(path) {
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
  'www.ucretsiz-fotograflar.com.tr': {
    name: 'Ücretsiz Fotoğraflar', secure: true,
    render() {
      return page('Ücretsiz Fotoğraflar', `<header class="uf-head">📷 Ücretsiz Fotoğraflar<small>İndirip dilediğiniz gibi kullanabilirsiniz</small></header>
        <p class="uf-tip">Bir fotoğrafı kaydetmek için üzerine <b>sağ tıklayın</b> ve “Resmi farklı kaydet”i seçin ya da altındaki <b>İndir</b> düğmesini kullanın.</p>
        <div class="uf-grid">${Object.entries(PHOTOS).map(([id, p]) => `<figure><img src="${pictureURL({ emoji: p.emoji, bg: p.bg })}" alt="${p.title}" data-photo="${id}"><figcaption>${p.title}<button type="button" data-download="${p.name}" data-photo="${id}">⬇ İndir</button></figcaption></figure>`).join('')}</div>`);
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
    render(path, q, ctx) {
      // Üçüncü taraf çerezi varsa reklam, başka bir sitede baktığınız ürüne göre kişiselleştirilir
      const ilgi = (ctx?.desk.cookies || []).find((c) => c.party === 'third' && c.interest);
      const reklam = ilgi ? `<div class="ad gh-ad">🎯 <b>Size özel:</b> ${esc(ilgi.interest)} bugün %20 indirimli!<small>Reklam · “az önce baktığınız ürün”</small></div>` : '<div class="ad gh-ad">📣 <b>Yeni sezon ürünleri</b> mağazalarda!<small>Reklam · herkese aynı</small></div>';
      const news = [['Kış lastiği uygulaması yarın başlıyor', 'Sürücülerin kış lastiği takması için son gün yaklaşıyor. Uzmanlar, lastik diş derinliğinin en az 4 mm olmasını öneriyor.'], ['Belediyeden yaşlılara ücretsiz bilgisayar kursu', 'Kurslar her hafta salı ve perşembe günleri yapılacak. Katılımcılara sertifika verilecek.'], ['Dolandırıcılara karşı uyarı: kodunuzu kimseyle paylaşmayın', 'Bankalar, telefonla aranıp şifre ya da doğrulama kodu istenmesinin dolandırıcılık olduğunu hatırlattı.']];
      const m = path.match(/^\/haber\/(\d)/);
      const head = '<header class="gh-head">📰 Günün Haberleri<nav><a data-href="www.gunun-haberleri.com.tr">Ana sayfa</a></nav></header>';
      if (m) { const n = news[+m[1]] || news[0]; return page(n[0], `${head}${reklam}<article class="gh"><h1>${n[0]}</h1><p>${n[1]}</p><p>${n[1]}</p></article>`); }
      return page('Günün Haberleri', `${head}${reklam}<div class="gh">${news.map((n, i) => `<a class="gh-item" data-href="www.gunun-haberleri.com.tr/haber/${i}"><span>📰</span><b>${n[0]}</b></a>`).join('')}</div>`);
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
  'www.turkiye-gov-giris.com': {
    name: 'e-Devlet (sahte)', secure: true,
    render() {
      return page('e-Devlet Kapısı: Giriş', `<header class="ed-head">🇹🇷 e-Devlet Kapısı</header><div class="bk"><h1>Hesabınızın süresi doldu! 24 saat içinde doğrulayın</h1><div class="bk-form"><input placeholder="T.C. Kimlik No" disabled><input placeholder="e-Devlet şifresi" disabled><input placeholder="Kart numarası" disabled><input placeholder="Son kullanma tarihi / CVV" disabled><button type="button" disabled>Doğrula</button></div>
        <p class="scam-note">(Alıştırma: bu sayfa SAHTEDİR. Görünüşü aynı, kilidi de var; ama adresi <b>turkiye-gov-giris.com</b>. Gerçek adres <b>turkiye.gov.tr</b>.)</p></div>`);
    },
  },
  'bankam.com.tr.hesap-dogrulama.xyz': {
    name: 'Bankam (sahte)', secure: true,
    render() {
      return page('Bankam İnternet Şubesi', `<header class="bk-head">🏦 Bankam</header><div class="bk"><h1>Güvenlik doğrulaması</h1><div class="bk-form"><input placeholder="Müşteri numarası" disabled><input placeholder="Şifre" disabled><input placeholder="SMS ile gelen kod" disabled><button type="button" disabled>Onayla</button></div>
        <p class="scam-note">(Alıştırma: bu sayfa SAHTEDİR. Adresin başında “bankam.com.tr” yazsa da site <b>hesap-dogrulama.xyz</b>\'nindir.)</p></div>`);
    },
  },
  'www.eski-forum.com': {
    name: 'Eski Forum', secure: false,
    render() {
      return page('Hobi Forumu', `<header class="pi-head" style="background:#5d4037">💬 Hobi Forumu</header><div class="pi"><h1>Bahçecilik sohbetleri</h1>
        <p>🌱 <b>Domates fidesi ne zaman dikilir?</b> · 42 cevap</p><p>🌷 <b>Lale soğanları için en iyi toprak</b> · 17 cevap</p>
        <div class="bk-form"><input placeholder="Kullanıcı adı" disabled><input placeholder="Şifre" disabled><button type="button" disabled>Üye girişi</button></div>
        <p class="scam-note">Bu site <b>şifreli bağlantı (https)</b> kullanmıyor: adres çubuğunda “⚠ Güvenli değil” yazar. Okumak sorun değil, ama buraya şifre ya da kart bilgisi girmeyin.</p></div>`);
    },
  },
  'www.meb.gov.tr': {
    name: 'Millî Eğitim Bakanlığı', secure: true,
    render() {
      return page('T.C. Millî Eğitim Bakanlığı', `<header class="ed-head" style="background:#0d47a1">🎓 T.C. Millî Eğitim Bakanlığı</header><div class="ed"><h1>Duyurular</h1>
        <p>📢 Halk eğitim merkezlerinde yeni dönem kurs kayıtları başladı: bilgisayar işletmenliği, el sanatları, yabancı dil.</p><p>📢 Hayat boyu öğrenme kurslarına e-Devlet üzerinden başvurulabilir.</p></div>`);
    },
  },
  'www.bankam-guvenlik-giris.xyz': {
    name: 'Bankam (sahte)', secure: false,
    render() {
      return page('Bankam İnternet Şubesi', `<header class="bk-head fake">🏦 Bankam</header><div class="bk"><h1>Hesabınız bloke edildi! Hemen giriş yapın</h1><div class="bk-form"><input placeholder="T.C. Kimlik No" disabled><input placeholder="Şifre" disabled><input placeholder="Kart numarası" disabled><button type="button" disabled>Onayla</button></div><p class="scam-note">(Alıştırma: bu sayfa SAHTEDİR. Adres yanlış, kilit yok, aceleye getiriyor ve kart numarası istiyor.)</p></div>`);
    },
  },
};

Object.assign(SITES, GUNLUK_SITES, BULUT_SITE, MEDYA_SITES, HESAP_SITES, MESAJ_SITES, HIZMET_SITES, YZ_SITES, BELGE_SITES, AG_SITES, FOTO_SITES, HARITA_SITES, BANKA_SITES, KAMU_SITES);

function escAttr(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

// Adres çubuğuna yazılanı çözümler: site adresi mi, arama mı?
export function resolve(input) {
  let t = input.trim();
  if (!t) return null;
  const looksUrl = !/\s/.test(t) && (/\.[a-zçğıöşü]{2,}/i.test(t) || /^tarayici:\/\//i.test(t));
  if (!looksUrl) return { host: SEARCH_HOST, path: '/ara', q: t, search: true };
  if (/^tarayici:\/\//i.test(t)) return { host: 'tarayici', path: '/' + t.slice(11).replace(/^\/+/, ''), q: '' };
  t = t.replace(/^https?:\/\//i, '');
  const slash = t.indexOf('/');
  let host = (slash < 0 ? t : t.slice(0, slash)).toLocaleLowerCase('tr');
  const path = slash < 0 ? '/' : t.slice(slash) || '/';
  if (!SITES[host] && SITES['www.' + host]) host = 'www.' + host;
  // Geçmişten ya da sık kullanılanlardan gelen arama adresleri: www.bulalim.com/ara?q=börek
  const m = path.match(/^(.*)\?q=(.*)$/);
  if (m) return { host, path: m[1] || '/', q: m[2], search: host === SEARCH_HOST && m[1] === '/ara' };
  return { host, path, q: '' };
}
