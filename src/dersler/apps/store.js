// Mağaza: uygulama, oyun ve tema indirme (internetteki rastgele sitelerden daha güvenli yol). Yayımcı, puan, boyut
// ve izinler okunur; taklit (sahte) uygulamayı tanıma. Ayrıca Mağaza'dan yüklenen iki küçük uygulama: Takvim ve Hava Durumu.
import { esc, progress } from './util.js';
import { THEMES, WALLPAPERS } from '../desktop.js';
import { APPS } from './index.js';

const PAGES = [['home', '🏠', 'Giriş'], ['apps', '🧩', 'Uygulamalar'], ['games', '🎮', 'Oyunlar'], ['themes', '🎨', 'Temalar'], ['library', '📚', 'Kitaplık']];

// kind: app (yüklenince Başlat'ta çıkar), builtin (Windows ile gelir), theme, fake (taklit uygulama: yüklenmez)
// Liste ilk kullanımda kurulur: desktop.js ile modüller birbirini içe aktardığı için THEMES baştan hazır olmayabilir
let ITEMS_;
const ITEMS_ALL = () => (ITEMS_ ||= [
  { id: 'takvim', kind: 'app', cat: 'apps', pub: 'Takvim Ekibi', stars: 4.6, votes: '12 B', size: '12 MB', age: '3+', perms: [], desc: 'Ayın günlerini, resmî tatilleri ve kendi notlarınızı gösteren sade bir takvim.' },
  { id: 'hava', kind: 'app', cat: 'apps', pub: 'Hava Bilgi A.Ş.', stars: 4.3, votes: '48 B', size: '20 MB', age: '3+', perms: ['Konumunuz (bulunduğunuz şehri bulmak için)', 'İnternet bağlantısı'], desc: 'Bugünün ve önümüzdeki 5 günün hava durumu.' },
  { id: 'viewer', kind: 'app', cat: 'apps', pub: 'Örnek Yazılım A.Ş.', stars: 4.1, votes: '3 B', size: '48 MB', age: '3+', perms: ['Resimler klasörünüz'], desc: 'Resimleri büyük ve hızlı açan bir program. Mağaza\'dan yüklenince ek araç çubuğu kurmaz.' },
  { id: 'fake', kind: 'fake', cat: 'apps', icon: '📘', name: 'Kelime İşlemci PRO 2026 Ücretsiz!!', pub: 'xX Süper Yazılım Xx', stars: 1.8, votes: '96', size: '3 MB', age: '3+', perms: ['Kişileriniz (rehberiniz)', 'Mikrofonunuz', 'Konumunuz', 'Ödeme bilgileriniz'], desc: 'EN İYİ KELİME İŞLEMCİ!!! Hemen indir, PRO özellikler bedava!!! (Uygulama içi satın alma içerir.)' },
  { id: 'mayin', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.4, votes: '250 B', size: '—', age: '3+', perms: [], desc: 'Klasik mayın tarlası: sağ tıkla bayrak koyun.' },
  { id: 'kartlar', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.5, votes: '310 B', size: '—', age: '3+', perms: [], desc: 'Kartları sürükleyerek dizdiğiniz sakin bir oyun.' },
  { id: 'hedef', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.2, votes: '20 B', size: '—', age: '3+', perms: [], desc: 'Fareyi çabuk ve doğru kullanmak için hedef oyunu.' },
  ...Object.entries(THEMES).filter(([, th]) => th.store).map(([k, th]) => ({ id: k, kind: 'theme', cat: 'themes', icon: '🎨', name: th.name, pub: 'Microsoft', stars: 4.7, votes: '30 B', size: th.size, age: '3+', perms: [], desc: th.desc })),
]);
const nameOf = (it) => it.name || APPS[it.id]?.name;
const iconOf = (it) => it.icon || APPS[it.id]?.icon;
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

export function store({ desk, body, args, emit, dialogs }) {
  body.classList.add('ms');
  const s = desk.settings;
  let page = args.page || 'home', detail = null, query = '';
  const busy = new Set(); // indirilmekte olanlar
  body.innerHTML = `<nav class="ms-nav">${PAGES.map(([id, ic, l]) => `<button type="button" data-page="${id}">${ic}<span>${l}</span></button>`).join('')}</nav>
    <div class="ms-main"><div class="ms-top"><input class="ms-q" placeholder="🔍 Uygulama, oyun ve tema arayın" aria-label="Mağazada ara"></div><div class="ms-page"></div></div>`;
  const pg = body.querySelector('.ms-page');

  const owned = (it) => it.kind === 'builtin' || (it.kind === 'theme' ? s.themes.includes(it.id) : s.installed.includes(it.id));
  function button(it) {
    if (busy.has(it.id)) return '<div class="ms-prog"></div>';
    if (it.kind === 'theme') return owned(it) ? `<button type="button" class="ms-btn" data-apply="${it.id}" ${s.theme === it.id ? 'disabled' : ''}>${s.theme === it.id ? '✔ Kullanılıyor' : 'Uygula'}</button>` : `<button type="button" class="ms-btn primary" data-get="${it.id}">Al</button>`;
    return owned(it) ? `<button type="button" class="ms-btn" data-open="${it.id}">Aç</button>` : `<button type="button" class="ms-btn primary" data-get="${it.id}">${it.kind === 'fake' ? 'Ücretsiz indir' : 'Al'}</button>`;
  }
  const art = (it) => (it.kind === 'theme' ? `<span class="ms-art" style="background:${WALLPAPERS[THEMES[it.id].wall][1]}"></span>` : `<span class="ms-art ic">${iconOf(it)}</span>`);
  const card = (it) => `<div class="ms-card" data-detail="${it.id}" tabindex="0">${art(it)}<b>${esc(nameOf(it))}</b><small>${esc(it.pub)}</small><small class="ms-stars">${stars(it.stars)} ${String(it.stars).replace('.', ',')}</small><span class="ms-free">${owned(it) ? 'Yüklü' : 'Ücretsiz'}</span></div>`;

  function render() {
    body.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('on', b.dataset.page === page && !detail));
    let h = '';
    if (detail) {
      const it = ITEMS_ALL().find((x) => x.id === detail);
      h = `<button type="button" class="ms-back" data-back="1">← Geri</button><div class="ms-detail">${art(it)}<div class="ms-dinfo"><h2>${esc(nameOf(it))}</h2>
        <a class="ms-pub">${esc(it.pub)}</a><div class="ms-meta"><span><b>${String(it.stars).replace('.', ',')} ★</b><small>${it.votes} değerlendirme</small></span><span><b>${it.size}</b><small>Boyut</small></span><span><b>${it.age}</b><small>Yaş sınırı</small></span></div>
        ${button(it)}</div></div>
        <section><h3>Açıklama</h3><p>${esc(it.desc)}</p></section>
        <section><h3>Bu uygulama şunlara erişebilir</h3>${it.perms.length ? `<ul class="ms-perms">${it.perms.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : '<p class="ms-mut">Özel bir izin istemiyor.</p>'}</section>
        ${it.kind === 'fake' ? '<section class="ms-reviews"><h3>Değerlendirmeler</h3><p>★☆☆☆☆ “Açılır açılmaz para istedi.”</p><p>★☆☆☆☆ “Neden rehberime erişmek istiyor?”</p><p>★★★★★ “süperrr” <small>(1 gün önce açılmış hesap)</small></p></section>' : ''}`;
    } else if (query) {
      const q = query.toLocaleLowerCase('tr');
      const list = ITEMS_ALL().filter((it) => nameOf(it).toLocaleLowerCase('tr').includes(q) || it.desc.toLocaleLowerCase('tr').includes(q) || (APPS[it.id]?.keywords || []).some((k) => k.includes(q)));
      h = `<h2>“${esc(query)}” için sonuçlar</h2>${list.length ? `<div class="ms-grid">${list.map(card).join('')}</div>` : '<p class="ms-mut">Sonuç bulunamadı.</p>'}`;
    } else if (page === 'home') {
      h = `<div class="ms-hero"><b>Mağaza'ya hoş geldiniz</b><span>Programları internetteki rastgele sitelerden değil, buradan indirmek daha güvenlidir: uygulamalar denetlenir, reklam ve ek araç çubuğu kurmaz.</span></div>
        <h3>Öne çıkan uygulamalar</h3><div class="ms-grid">${ITEMS_ALL().filter((i) => i.cat === 'apps').map(card).join('')}</div>
        <h3>Yeni temalar</h3><div class="ms-grid">${ITEMS_ALL().filter((i) => i.kind === 'theme').map(card).join('')}</div>`;
    } else if (page === 'library') {
      const mine = ITEMS_ALL().filter((it) => it.kind !== 'builtin' && owned(it));
      h = `<h2>Kitaplık</h2><div class="ms-upd">✅ Uygulamalarınız güncel <button type="button" class="ms-btn" data-upd="1">Güncelleştirmeleri al</button></div>
        ${mine.length ? `<div class="ms-list">${mine.map((it) => `<div class="ms-row">${art(it)}<b>${esc(nameOf(it))}</b><small>${it.kind === 'theme' ? 'Tema' : 'Uygulama'}</small>${button(it)}</div>`).join('')}</div>` : '<p class="ms-mut">Mağaza\'dan henüz bir şey yüklemediniz.</p>'}`;
    } else {
      h = `<h2>${PAGES.find((p) => p[0] === page)[2]}</h2><div class="ms-grid">${ITEMS_ALL().filter((i) => i.cat === page).map(card).join('')}</div>`;
    }
    pg.innerHTML = h;
  }

  async function get(id) {
    const it = ITEMS_ALL().find((x) => x.id === id);
    if (it.perms.length) {
      const a = await dialogs.ask({ title: nameOf(it), icon: iconOf(it), text: `<b>${esc(nameOf(it))}</b> şunlara erişmek istiyor:<ul>${it.perms.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>Yüklemek istiyor musunuz?`, buttons: [['yes', 'Yükle'], ['no', 'Vazgeç', true]] });
      emit('store-perms', { id, answer: a, fake: it.kind === 'fake' });
      if (a !== 'yes') return;
    }
    busy.add(id);
    render();
    emit('store-get', { id, kind: it.kind });
    const bar = pg.querySelector('.ms-prog');
    await progress(bar || document.createElement('div'), 1800, 'İndiriliyor…');
    busy.delete(id);
    if (it.kind === 'fake') {
      render();
      desk.toast('Mağaza bu uygulamayı kaldırdı', 'Taklit (sahte) uygulama olduğu anlaşıldı ve yüklenmedi. Yayımcının adına, puanlara ve istenen izinlere bakmak sizi korur.', '⚠', 9000);
      emit('store-fake', { id });
      return;
    }
    if (it.kind === 'theme') { if (!s.themes.includes(id)) s.themes.push(id); }
    else if (!s.installed.includes(id)) s.installed.push(id);
    render();
    desk.toast(it.kind === 'theme' ? 'Tema indirildi' : 'Yüklendi', it.kind === 'theme' ? `${esc(nameOf(it))} teması hazır. <b>Uygula</b>'ya basın ya da Ayarlar → Kişiselleştirme'den seçin.` : `${esc(nameOf(it))} Başlat menüsüne eklendi.`, iconOf(it), 5000);
    emit('store-install', { id, kind: it.kind, name: nameOf(it) });
  }

  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b?.dataset.page) { page = b.dataset.page; detail = null; query = ''; body.querySelector('.ms-q').value = ''; render(); emit('store-page', { page }); return; }
    if (b?.dataset.back) { detail = null; render(); return; }
    if (b?.dataset.get) return get(b.dataset.get);
    if (b?.dataset.open) { desk.open(b.dataset.open); emit('store-open', { id: b.dataset.open }); return; }
    if (b?.dataset.apply) { desk.applyTheme(b.dataset.apply); render(); return; }
    if (b?.dataset.upd) { b.outerHTML = '<span class="spin"></span>'; setTimeout(() => { desk.toast('Mağaza', 'Bütün uygulamalarınız güncel.', '🛍', 3000); render(); }, 1200); return; }
    const c = e.target.closest('[data-detail]');
    if (c) { detail = c.dataset.detail; render(); emit('store-detail', { id: detail }); }
  });
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.dataset.detail) e.target.click(); });
  body.querySelector('.ms-q').addEventListener('input', (e) => { query = e.target.value.trim(); detail = null; render(); emit('store-search', { text: query }); });

  render();
  return {
    onArgs: (a) => { if (a.page) { page = a.page; detail = null; render(); } },
    onSettings: render,
  };
}

// ---- Takvim ----
const HOLIDAYS = { '1-1': 'Yılbaşı', '23-4': 'Ulusal Egemenlik ve Çocuk Bayramı', '1-5': 'Emek ve Dayanışma Günü', '19-5': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', '15-7': 'Demokrasi ve Millî Birlik Günü', '30-8': 'Zafer Bayramı', '29-10': 'Cumhuriyet Bayramı' };
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export function takvim({ desk, body, emit }) {
  body.classList.add('tk');
  const now = desk.now();
  let y = now.getFullYear(), m = now.getMonth(), pick = now.getDate();
  const notes = (desk.calNotes ||= {});
  function render() {
    const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const isToday = (d) => d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    const key = (d) => `${y}-${m + 1}-${d}`;
    let cells = '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) cells += `<button type="button" data-day="${d}" class="${isToday(d) ? 'today' : ''} ${d === pick ? 'pick' : ''} ${HOLIDAYS[`${d}-${m + 1}`] ? 'hol' : ''}">${d}${notes[key(d)] ? '<i></i>' : ''}</button>`;
    const hol = HOLIDAYS[`${pick}-${m + 1}`];
    body.innerHTML = `<div class="tk-head"><button type="button" data-mv="-1" title="Önceki ay">‹</button><b>${MONTHS[m]} ${y}</b><button type="button" data-mv="1" title="Sonraki ay">›</button><button type="button" data-mv="0">Bugün</button></div>
      <div class="tk-grid">${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => `<em>${d}</em>`).join('')}${cells}</div>
      <div class="tk-day"><b>${pick} ${MONTHS[m]} ${y}</b>${hol ? `<p class="tk-hol">🇹🇷 ${hol}</p>` : ''}
        <label>Not: <input class="tk-note" value="${esc(notes[key(pick)] || '')}" placeholder="ör. Saat 14.00 doktor randevusu"></label></div>`;
  }
  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.day) { pick = +b.dataset.day; render(); emit('cal-pick', { day: pick, month: m + 1 }); return; }
    const mv = +b.dataset.mv;
    if (mv === 0) { y = now.getFullYear(); m = now.getMonth(); pick = now.getDate(); } else { m += mv; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } pick = 1; }
    render();
  });
  body.addEventListener('input', (e) => {
    if (!e.target.classList.contains('tk-note')) return;
    notes[`${y}-${m + 1}-${pick}`] = e.target.value;
    emit('cal-note', { text: e.target.value });
  });
  body.addEventListener('change', render);
  render();
}

// ---- Hava Durumu ----
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Erzurum'];
const SKY = [['☀', 'Güneşli'], ['⛅', 'Parçalı bulutlu'], ['☁', 'Bulutlu'], ['🌧', 'Yağmurlu'], ['⛈', 'Gök gürültülü'], ['🌤', 'Az bulutlu']];

export function hava({ desk, body, emit, dialogs }) {
  body.classList.add('hv');
  const st = (desk.weather ||= { city: null, asked: false });
  function render() {
    if (!desk.settings.wifi || !desk.settings.network) {
      body.innerHTML = '<div class="hv-off">📶❌<p><b>İnternet bağlantısı yok</b></p><p>Hava durumu internetten gelir. Wi-Fi\'ye bağlanıp tekrar deneyin.</p></div>';
      return;
    }
    const city = st.city || 'İstanbul';
    const d0 = desk.now();
    const seed = (i) => (city.length * 7 + d0.getDate() * 3 + i * 5) % SKY.length;
    const temp = (i) => 8 + ((city.length * 3 + d0.getDate() + i * 4) % 15);
    const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(d0); d.setDate(d.getDate() + i); return [d.toLocaleDateString('tr-TR', { weekday: 'short' }), SKY[seed(i)], temp(i)]; });
    body.innerHTML = `<div class="hv-top"><select class="hv-city">${CITIES.map((c) => `<option ${c === city ? 'selected' : ''}>${c}</option>`).join('')}</select>${st.city && st.byLocation ? '<small>📍 Konumunuzdan</small>' : ''}</div>
      <div class="hv-now"><span>${days[0][1][0]}</span><b>${days[0][2]}°</b><div>${days[0][1][1]}<small>Hissedilen ${days[0][2] - 2}° · Nem %${55 + seed(0) * 5}</small></div></div>
      <div class="hv-days">${days.map(([n, [ic], t]) => `<div><small>${n}</small><span>${ic}</span><b>${t}°</b><small>${t - 7}°</small></div>`).join('')}</div>`;
  }
  async function ask() {
    st.asked = true;
    const a = await dialogs.ask({ title: 'Hava Durumu', icon: '📍', text: '<b>Hava Durumu, tam konumunuza erişsin mi?</b><br>Bulunduğunuz şehrin havasını kendiliğinden göstermek için kullanılır. İzin vermezseniz şehri kendiniz seçersiniz.', buttons: [['yes', 'Evet'], ['no', 'Hayır', true]] });
    if (a === 'yes') { st.city = 'İstanbul'; st.byLocation = true; }
    emit('weather-location', { answer: a });
    render();
  }
  body.addEventListener('change', (e) => { if (e.target.classList.contains('hv-city')) { st.city = e.target.value; st.byLocation = false; render(); emit('weather-city', { city: st.city }); } });
  render();
  if (!st.asked) setTimeout(ask, 300);
  return { onSettings: render };
}
