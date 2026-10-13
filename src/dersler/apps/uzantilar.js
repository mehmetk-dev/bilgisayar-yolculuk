// Tarayıcının uzantıları (eklentileri) ve kendi iç sayfaları: tarayici://gecmis, indirilenler, uzantilar, magaza, ayarlar.
// Uzantılar gerçekten iş görür: reklamları gizler, sayfayı koyulaştırır, seçili yazıyı okur, sayfaya not ekler.
// Biri bilerek kötü: çok izin ister, her sayfaya reklam koyar, arama motorunu değiştirir (kaldırmayı öğretmek için).
import { esc } from './util.js';

export const INTERNAL = 'tarayici';

export const EXTS = {
  reklam: {
    name: 'Reklam Engelleyici', icon: '🛡', pub: 'Açık Kaynak Topluluğu', verified: true, users: '10.000.000+', stars: 4.7, size: '3 MB',
    desc: 'Sitelerdeki reklamları ve “Bilgisayarınızda virüs var!” gibi açılır pencereleri gizler. Sayfalar daha sade ve hızlı açılır.',
    perms: ['Ziyaret ettiğiniz sitelerdeki reklamları okuma ve gizleme'],
    reviews: [['Ayşe K.', 5, 'Haber sitelerinde artık reklam görmüyorum, çok rahat.'], ['Mehmet T.', 4, 'Kurması kolay, işini yapıyor.']],
  },
  karanlik: {
    name: 'Karanlık Okuma', icon: '🌙', pub: 'Okuma Araçları', verified: true, users: '2.000.000+', stars: 4.5, size: '1 MB',
    desc: 'Sitelerin beyaz zeminini koyulaştırır. Gece ya da uzun süre okurken gözü yormaz.',
    perms: ['Ziyaret ettiğiniz sitelerin görünümünü değiştirme'],
    reviews: [['Fatma Y.', 5, 'Akşamları tarif okurken gözüm kamaşmıyor.']],
  },
  sesli: {
    name: 'Sesli Okuma', icon: '🔊', pub: 'Erişilebilirlik Derneği', verified: true, users: '800.000+', stars: 4.4, size: '2 MB',
    desc: 'Sayfadaki yazıyı ya da seçtiğiniz bölümü yüksek sesle okur. Gözü yorulanlar ve okumakta zorlananlar için.',
    perms: ['Seçtiğiniz yazıyı okuma'],
    reviews: [['Hasan B.', 5, 'Gözlüğüm yokken haberleri dinliyorum.']],
  },
  not: {
    name: 'Yapışkan Not', icon: '🗒', pub: 'Verimlilik Araçları', verified: true, users: '500.000+', stars: 4.2, size: '1 MB',
    desc: 'Bir sayfaya kendinize küçük bir not yapıştırın; o sayfayı yeniden açınca not orada olsun.',
    perms: ['Notlarınızı bu bilgisayarda saklama'],
    reviews: [['Zeynep A.', 4, 'Tariflere “tuzu az koy” diye not alıyorum.']],
  },
  indirim: {
    name: 'SÜPER İndirim Bulucu 🔥🔥', icon: '🔥', pub: 'mega-firsat-kazan.xyz', verified: false, users: '120', stars: 2.1, size: '9 MB', bad: true,
    desc: 'TÜM sitelerde EN UCUZ fiyatı bulur!!! Her gün PARA KAZANIN!!! Hemen ekleyin, fırsatı kaçırmayın!!!',
    perms: ['Ziyaret ettiğiniz TÜM sitelerdeki verilerinizi okuma ve değiştirme', 'Tarama geçmişinizi okuma', 'Ana sayfanızı ve arama motorunuzu değiştirme', 'İndirmelerinizi yönetme'],
    reviews: [['Kemal D.', 1, 'Kurduktan sonra her sayfada reklam çıkmaya başladı!'], ['Sevgi Ö.', 1, 'Arama motorumu değiştirdi, nasıl kaldıracağımı bilemedim.'], ['xX_firsat_Xx', 5, 'Süper!!! Herkes kursun!!!']],
  },
};

const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
const wp = (title, html, cls = '') => ({ title, html: `<div class="wp bi ${cls}">${html}</div>` });
const side = (cur) => `<nav class="bi-side">${[['gecmis', '🕘', 'Geçmiş'], ['indirilenler', '⬇', 'İndirilenler'], ['uzantilar', '🧩', 'Uzantılar'], ['ayarlar', '⚙', 'Ayarlar']]
  .map(([p, i, l]) => `<a data-href="${INTERNAL}://${p}" class="${cur === p ? 'on' : ''}">${i} ${l}</a>`).join('')}</nav>`;

// Tarayıcının iç sayfaları. st: { desk, history, downloads, flow }
export function internalPage(path, st) {
  const s = st.desk.settings;
  const p = path.replace(/^\/+/, '');
  if (p === 'gecmis') {
    const f = (st.flow.histQ || '').toLocaleLowerCase('tr');
    const list = st.history.filter((h) => !f || (h.title + ' ' + h.url).toLocaleLowerCase('tr').includes(f));
    return wp('Geçmiş', `${side('gecmis')}<div class="bi-main"><h1>🕘 Geçmiş</h1>
      <div class="bi-row"><input class="bi-search" data-hist-q placeholder="Geçmişte ara" value="${esc(st.flow.histQ || '')}"><button type="button" class="bi-btn" data-bi="clearOpen">🧹 Tarama verilerini temizle</button></div>
      ${st.flow.clear ? clearBox() : ''}
      <h3>Bugün</h3>${list.length ? `<div class="bi-list">${list.map((h) => `<div class="bi-item"><span class="bi-time">${h.time}</span><a data-href="${esc(h.url)}"><b>${esc(h.title)}</b><small>${esc(h.url)}</small></a><button type="button" class="bi-x" data-hist-del="${h.id}" title="Geçmişten sil">✕</button></div>`).join('')}</div>` : '<p class="bi-empty">Geçmiş boş. Gezdiğiniz sayfalar burada listelenir (InPrivate pencereler hariç).</p>'}</div>`);
  }
  if (p === 'indirilenler') {
    return wp('İndirilenler', `${side('indirilenler')}<div class="bi-main"><h1>⬇ İndirilenler</h1>
      ${st.downloads.length ? `<div class="bi-list">${st.downloads.map((d) => `<div class="bi-item"><span class="bi-ic">${/\.(jpe?g|png)$/i.test(d.name) ? '🖼' : '💿'}</span><div><b>${esc(d.name)}</b><small>İndirilenler klasörü · Tamamlandı</small></div><button type="button" class="bi-btn" data-open="${d.id}">Aç</button><button type="button" class="bi-btn" data-folder="1">Klasörde göster</button></div>`).join('')}</div>` : '<p class="bi-empty">Henüz bir şey indirmediniz.</p>'}
      <p class="bi-note">İndirdiğiniz dosyalar bilgisayardaki <b>İndirilenler</b> klasörüne kaydedilir. Buradaki listeyi silmek dosyaları silmez.</p></div>`);
  }
  if (p === 'uzantilar') {
    const mine = Object.keys(s.extensions).filter((k) => EXTS[k]);
    return wp('Uzantılar', `${side('uzantilar')}<div class="bi-main"><h1>🧩 Uzantılar</h1>
      <p class="bi-note">Uzantı (eklenti), tarayıcıya yeni bir özellik ekleyen küçük programdır. Yalnızca güvendiğiniz, çok kullanılan ve <b>az izin isteyen</b> uzantıları kurun. Tanımadığınız bir uzantıyı kapatın ya da kaldırın.</p>
      ${mine.length ? `<div class="bi-cards">${mine.map((k) => { const e = EXTS[k], on = s.extensions[k].on; return `<div class="bi-card ${on ? '' : 'off'} ${e.bad ? 'bad' : ''}"><div class="bi-ch"><span>${e.icon}</span><div><b>${esc(e.name)}</b><small>${esc(e.pub)}</small></div>
        <label class="bi-tog" title="${on ? 'Kapat' : 'Aç'}"><input type="checkbox" data-ext-on="${k}" ${on ? 'checked' : ''}><i></i></label></div><p>${esc(e.desc)}</p>
        <div class="bi-cb"><a data-href="${INTERNAL}://magaza/${k}">Ayrıntılar</a><button type="button" class="bi-btn" data-ext-del="${k}">Kaldır</button></div></div>`; }).join('')}</div>` : '<p class="bi-empty">Hiç uzantı kurulu değil.</p>'}
      <p><a class="bi-link" data-href="${INTERNAL}://magaza">🛍 Uzantı mağazasından yeni uzantı alın</a></p></div>`);
  }
  if (p === 'magaza' || p.startsWith('magaza/')) {
    const id = p.split('/')[1];
    const e = EXTS[id];
    if (e) {
      const have = !!s.extensions[id];
      return wp(e.name, `<div class="bi-store"><a class="bi-link" data-href="${INTERNAL}://magaza">← Tüm uzantılar</a>
        <div class="bi-detail"><div class="bi-big">${e.icon}</div><div><h1>${esc(e.name)}</h1><p class="bi-pub">${esc(e.pub)} ${e.verified ? '<span class="bi-ver" title="Yayımcı doğrulandı">✔ Doğrulanmış</span>' : '<span class="bi-unver">⚠ Doğrulanmamış yayımcı</span>'}</p>
          <p><span class="bi-stars">${stars(e.stars)}</span> ${String(e.stars).replace('.', ',')} · <b>${e.users}</b> kullanıcı · ${e.size}</p>
          ${have ? `<button type="button" class="bi-btn" data-ext-del="${id}">Kaldır</button>` : `<button type="button" class="bi-btn primary" data-ext-get="${id}">Al</button>`}</div></div>
        <h3>Açıklama</h3><p>${esc(e.desc)}</p>
        <h3>İzinler <small>(bu uzantı neler yapabilir?)</small></h3><ul class="bi-perms ${e.perms.length > 2 ? 'many' : ''}">${e.perms.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <h3>Kullanıcı yorumları</h3>${e.reviews.map(([n, k, t]) => `<div class="bi-rev"><b>${esc(n)}</b> <span class="bi-stars">${stars(k)}</span><p>${esc(t)}</p></div>`).join('')}</div>`);
    }
    return wp('Uzantı Mağazası', `<div class="bi-store"><h1>🛍 Uzantı Mağazası</h1><p class="bi-note">Kurmadan önce bakın: <b>yayımcı</b> doğrulanmış mı, <b>kaç kişi</b> kullanıyor, <b>yorumlar</b> ne diyor, <b>hangi izinleri</b> istiyor?</p>
      <div class="bi-grid">${Object.entries(EXTS).map(([k, x]) => `<a class="bi-tile ${x.bad ? 'bad' : ''}" data-href="${INTERNAL}://magaza/${k}"><span>${x.icon}</span><b>${esc(x.name)}</b><small>${esc(x.pub)}</small><small><span class="bi-stars">${stars(x.stars)}</span> · ${x.users} kullanıcı</small>${s.extensions[k] ? '<em>✔ Eklendi</em>' : ''}</a>`).join('')}</div></div>`);
  }
  if (p === 'ayarlar') {
    const hijacked = s.extensions.indirim?.on;
    return wp('Ayarlar', `${side('ayarlar')}<div class="bi-main"><h1>⚙ Tarayıcı ayarları</h1>
      <section><h3>Başlangıçta</h3><label class="bi-opt"><input type="radio" name="sp" data-bset="startPage" value="home" ${s.startPage !== 'newtab' ? 'checked' : ''}> Ana sayfayı aç (Bulalım)</label><label class="bi-opt"><input type="radio" name="sp" data-bset="startPage" value="newtab" ${s.startPage === 'newtab' ? 'checked' : ''}> Yeni sekme sayfasını aç</label></section>
      <section><h3>Adres çubuğunda kullanılan arama motoru</h3><select data-bset="searchEngine" ${hijacked ? 'disabled' : ''}><option value="bulalim">Bulalım</option>${hijacked ? '<option selected>Süper Arama (bir uzantı tarafından ayarlandı)</option>' : ''}</select>
        ${hijacked ? '<p class="bi-warn">⚠ Bu ayarı <b>SÜPER İndirim Bulucu</b> uzantısı değiştirdi. Düzeltmek için uzantıyı kaldırın ya da aşağıdan ayarları sıfırlayın.</p>' : ''}</section>
      <section><h3>İndirmeler</h3><label class="bi-opt"><input type="checkbox" data-bset="askDownload" ${s.askDownload ? 'checked' : ''}> Her indirmeden önce dosyanın nereye kaydedileceğini sor</label></section>
      <section><h3>Gizlilik</h3><button type="button" class="bi-btn" data-bi="clearOpen">🧹 Tarama verilerini temizle</button>${st.flow.clear ? clearBox() : ''}</section>
      <section><h3>Ayarları sıfırla</h3><p class="bi-note">Tarayıcı garip davranıyorsa (kendi kendine reklam açılıyor, arama motoru değişmiş): ayarlar ilk hâline döner, <b>bütün uzantılar kapatılır</b>. Sık kullanılanlarınız ve şifreleriniz silinmez.</p><button type="button" class="bi-btn" data-bi="reset">↺ Ayarları varsayılan değerlerine geri yükle</button></section></div>`);
  }
  return wp('Bulunamadı', `<div class="bi-main"><h1>😕 Bu sayfa yok</h1><p><b>${INTERNAL}://${esc(p)}</b></p></div>`);
}

function clearBox() {
  return `<div class="bi-clear"><b>Tarama verilerini temizle</b>
    <label class="bi-row">Zaman aralığı <select data-clear-range><option>Son bir saat</option><option>Son 24 saat</option><option selected>Tüm zamanlar</option></select></label>
    <label class="bi-opt"><input type="checkbox" data-clear="history" checked> <span><b>Tarama geçmişi</b><small>Gezdiğiniz sayfaların listesi</small></span></label>
    <label class="bi-opt"><input type="checkbox" data-clear="cookies" checked> <span><b>Çerezler ve diğer site verileri</b><small>Sitelerde oturumunuz kapanır; yeniden giriş yapmanız gerekir</small></span></label>
    <label class="bi-opt"><input type="checkbox" data-clear="cache" checked> <span><b>Önbelleğe alınmış resimler ve dosyalar</b><small>Sayfalar bir sonraki açılışta biraz yavaş yüklenebilir</small></span></label>
    <div class="bi-row"><button type="button" class="bi-btn primary" data-bi="clearNow">Şimdi temizle</button><button type="button" class="bi-btn" data-bi="clearCancel">İptal</button></div></div>`;
}

// Sayfa çizildikten sonra açık uzantıların etkisi. Engellenen reklam sayısını döndürür.
// Uzantılar tarayıcının kendi sayfalarına (tarayici://) dokunamaz; oradan her zaman kaldırılabilirler.
export function applyExtensions(pageEl, s, notes, key) {
  if (key.startsWith(INTERNAL + ':')) { pageEl.classList.remove('br-darkread'); return 0; }
  const on = (k) => s.extensions[k]?.on;
  let blocked = 0;
  if (on('reklam')) pageEl.querySelectorAll('.se-res.ad, .pi-ad').forEach((x) => { x.remove(); blocked++; });
  pageEl.classList.toggle('br-darkread', !!on('karanlik'));
  if (on('indirim')) {
    const b = document.createElement('div');
    b.className = 'br-spam';
    b.innerHTML = '🔥🔥 SÜPER FIRSAT! Bu ürün başka yerde %70 UCUZ! <button type="button" data-spam="1">HEMEN TIKLA</button> <small>SÜPER İndirim Bulucu</small>';
    pageEl.prepend(b);
  }
  if (on('not') && notes[key]) {
    const n = document.createElement('div');
    n.className = 'br-note';
    n.innerHTML = `<b>🗒 Notunuz</b><p>${esc(notes[key])}</p>`;
    pageEl.prepend(n);
  }
  return blocked;
}
