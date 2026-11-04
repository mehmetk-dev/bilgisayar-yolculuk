// Mağaza: uygulama, oyun ve tema indirme (internetteki rastgele sitelerden daha güvenli yol). Yayımcı, puan, boyut
// ve izinler okunur; taklit (sahte) uygulamayı tanıma. Ayrıca Mağaza'dan yüklenen iki küçük uygulama: Takvim ve Hava Durumu.
import { esc, progress } from './util.js';
import { THEMES, WALLPAPERS } from '../desktop.js';
import { APPS } from './index.js';
import { APP_ICONS, SYS_ICONS } from './appicons.js';
import { ic, WX } from './w11ikon.js';

const PAGES = [['home', 'home', 'Giriş'], ['apps', 'apps', 'Uygulamalar'], ['games', 'gamepad', 'Oyun'], ['themes', 'palette', 'Temalar'], ['library', 'library', 'Kitaplık']];

// kind: app (yüklenince Başlat'ta çıkar), builtin (Windows ile gelir), theme, fake (taklit uygulama: yüklenmez)
// Liste ilk kullanımda kurulur: desktop.js ile modüller birbirini içe aktardığı için THEMES baştan hazır olmayabilir
let ITEMS_;
const ITEMS_ALL = () => (ITEMS_ ||= [
  { id: 'takvim', kind: 'app', cat: 'apps', pub: 'Takvim Ekibi', stars: 4.6, votes: '12 B', size: '12 MB', age: '3+', perms: [], desc: 'Ayın günlerini, resmî tatilleri ve kendi notlarınızı gösteren sade bir takvim.' },
  { id: 'hava', kind: 'app', cat: 'apps', pub: 'Hava Bilgi A.Ş.', stars: 4.3, votes: '48 B', size: '20 MB', age: '3+', perms: ['Konumunuz (bulunduğunuz şehri bulmak için)', 'İnternet bağlantısı'], desc: 'Bugünün ve önümüzdeki 5 günün hava durumu.' },
  { id: 'viewer', kind: 'app', cat: 'apps', pub: 'Örnek Yazılım A.Ş.', stars: 4.1, votes: '3 B', size: '48 MB', age: '3+', perms: ['Resimler klasörünüz'], desc: 'Resimleri büyük ve hızlı açan bir program. Mağaza\'dan yüklenince ek araç çubuğu kurmaz.' },
  { id: 'fake', kind: 'fake', cat: 'apps', icon: APP_ICONS.word, name: 'Kelime İşlemci PRO 2026 Ücretsiz!!', pub: 'xX Süper Yazılım Xx', stars: 1.8, votes: '96', size: '3 MB', age: '3+', perms: ['Kişileriniz (rehberiniz)', 'Mikrofonunuz', 'Konumunuz', 'Ödeme bilgileriniz'], desc: 'EN İYİ KELİME İŞLEMCİ!!! Hemen indir, PRO özellikler bedava!!! (Uygulama içi satın alma içerir.)' },
  { id: 'mayin', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.4, votes: '250 B', size: '—', age: '3+', perms: [], desc: 'Klasik mayın tarlası: sağ tıkla bayrak koyun.' },
  { id: 'kartlar', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.5, votes: '310 B', size: '—', age: '3+', perms: [], desc: 'Kartları sürükleyerek dizdiğiniz sakin bir oyun.' },
  { id: 'hedef', kind: 'builtin', cat: 'games', pub: 'Microsoft', stars: 4.2, votes: '20 B', size: '—', age: '3+', perms: [], desc: 'Fareyi çabuk ve doğru kullanmak için hedef oyunu.' },
  ...Object.entries(THEMES).filter(([, th]) => th.store).map(([k, th]) => ({ id: k, kind: 'theme', cat: 'themes', icon: ic('palette'), name: th.name, pub: 'Microsoft', stars: 4.7, votes: '30 B', size: th.size, age: '3+', perms: [], desc: th.desc })),
]);
const nameOf = (it) => it.name || APPS[it.id]?.name;
const iconOf = (it) => it.icon || APPS[it.id]?.icon;
const stars = (n) => `<span class="w11st-stars" aria-label="${String(n).replace('.', ',')} yıldız">${[1, 2, 3, 4, 5].map((i) => `<i class="${n >= i - 0.25 ? 'f' : n >= i - 0.75 ? 'h' : ''}">${ic('starf')}</i>`).join('')}</span>`;

export function store({ desk, body, args, emit, dialogs }) {
  body.classList.add('w11a', 'w11st');
  const s = desk.settings;
  let page = args.page || 'home', detail = null, query = '';
  const busy = new Set(); // indirilmekte olanlar
  body.innerHTML = `<div class="w11st-top"><span class="w11st-logo">${APP_ICONS.store}<b>Microsoft Store</b></span><label class="w11st-search">${ic('search')}<input class="w11st-q" type="search" placeholder="Uygulama, oyun, film ve daha fazlasını arayın" autocomplete="off" aria-label="Mağazada ara"></label><span class="w11st-me" title="${esc(s.user || '')}">${SYS_ICONS.user}</span></div>
    <div class="w11st-wrap"><nav class="w11st-nav">${PAGES.map(([id, ico, l]) => `<button type="button" data-page="${id}" title="${l}">${ic(ico)}<span>${l}</span></button>`).join('')}</nav>
    <div class="w11st-page"></div></div>`;
  const pg = body.querySelector('.w11st-page');

  const owned = (it) => it.kind === 'builtin' || (it.kind === 'theme' ? s.themes.includes(it.id) : s.installed.includes(it.id));
  function button(it, big) {
    const c = `w11st-btn${big ? ' big' : ''}`;
    if (busy.has(it.id)) return `<div class="w11st-prog" data-prog="${it.id}"></div>`;
    if (it.kind === 'theme') return owned(it) ? `<button type="button" class="${c}" data-apply="${it.id}" ${s.theme === it.id ? 'disabled' : ''}>${s.theme === it.id ? `${ic('check')}Kullanılıyor` : 'Uygula'}</button>` : `<button type="button" class="${c} acc" data-get="${it.id}">Al</button>`;
    return owned(it) ? `<button type="button" class="${c}" data-open="${it.id}">Aç</button>` : `<button type="button" class="${c} acc" data-get="${it.id}">${it.kind === 'fake' ? 'Yükle' : 'Al'}</button>`;
  }
  const art = (it, cls = '') => (it.kind === 'theme' ? `<span class="w11st-art th ${cls}" style="background:${WALLPAPERS[THEMES[it.id].wall][1]}"></span>` : `<span class="w11st-art ${cls}">${iconOf(it)}</span>`);
  const card = (it) => `<div class="w11st-card" data-detail="${it.id}" tabindex="0">${art(it)}<span class="w11st-ci"><b>${esc(nameOf(it))}</b><small>${esc(it.pub)}</small><span class="w11st-rate">${stars(it.stars)}<small>${String(it.stars).replace('.', ',')}</small></span></span><span class="w11st-act">${button(it)}</span></div>`;
  const section = (title, items) => `<h3 class="w11st-sh">${title}</h3><div class="w11st-grid">${items.map(card).join('')}</div>`;

  function render() {
    body.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('on', b.dataset.page === page && !detail && !query));
    let h = '';
    if (detail) {
      const it = ITEMS_ALL().find((x) => x.id === detail);
      h = `<button type="button" class="w11st-back" data-back="1">${ic('back')}<span>Geri</span></button><div class="w11st-detail">${art(it, 'lg')}<div class="w11st-dinfo"><h2>${esc(nameOf(it))}</h2>
        <a class="w11st-pub">${esc(it.pub)}</a><div class="w11st-meta"><span><b>${String(it.stars).replace('.', ',')} ${ic('starf')}</b><small>${it.votes} değerlendirme</small></span><span><b>${it.size}</b><small>Boyut</small></span><span><b>${it.age}</b><small>Yaş sınırı</small></span></div>
        ${button(it, true)}</div></div>
        <section class="w11st-sec"><h3>Açıklama</h3><p>${esc(it.desc)}</p></section>
        <section class="w11st-sec"><h3>Bu uygulama şunlara erişebilir</h3>${it.perms.length ? `<ul class="w11st-perms">${it.perms.map((p) => `<li>${ic('info')}${esc(p)}</li>`).join('')}</ul>` : '<p class="w11st-mut">Özel bir izin istemiyor.</p>'}</section>
        ${it.kind === 'fake' ? `<section class="w11st-sec w11st-reviews"><h3>Değerlendirmeler</h3><p>${stars(1)} “Açılır açılmaz para istedi.”</p><p>${stars(1)} “Neden rehberime erişmek istiyor?”</p><p>${stars(5)} “süperrr” <small>(1 gün önce açılmış hesap)</small></p></section>` : ''}`;
    } else if (query) {
      const q = query.toLocaleLowerCase('tr');
      const list = ITEMS_ALL().filter((it) => nameOf(it).toLocaleLowerCase('tr').includes(q) || it.desc.toLocaleLowerCase('tr').includes(q) || (APPS[it.id]?.keywords || []).some((k) => k.includes(q)));
      h = `<h2 class="w11st-h">“${esc(query)}” için sonuçlar</h2>${list.length ? `<div class="w11st-grid">${list.map(card).join('')}</div>` : '<p class="w11st-mut">Sonuç bulunamadı.</p>'}`;
    } else if (page === 'home') {
      h = `<div class="w11st-hero"><span class="w11st-hico">${ic('shield')}</span><div><b>Microsoft Store'a hoş geldiniz</b><span>Programları internetteki rastgele sitelerden değil, buradan indirmek daha güvenlidir: uygulamalar denetlenir, reklam ve ek araç çubuğu kurmaz.</span></div></div>
        ${section('Öne çıkan uygulamalar', ITEMS_ALL().filter((i) => i.cat === 'apps'))}${section('Yeni temalar', ITEMS_ALL().filter((i) => i.kind === 'theme'))}`;
    } else if (page === 'library') {
      const mine = ITEMS_ALL().filter((it) => it.kind !== 'builtin' && owned(it));
      h = `<h2 class="w11st-h">Kitaplık</h2><div class="w11st-upd">${ic('check')}<span>Uygulamalarınız güncel</span><button type="button" class="w11st-btn" data-upd="1">Güncelleştirmeleri al</button></div>
        ${mine.length ? `<div class="w11st-list">${mine.map((it) => `<div class="w11st-row">${art(it, 'sm')}<span class="w11st-ci"><b>${esc(nameOf(it))}</b><small>${it.kind === 'theme' ? 'Tema' : 'Uygulama'}</small></span>${button(it)}</div>`).join('')}</div>` : '<p class="w11st-mut">Mağaza\'dan henüz bir şey yüklemediniz.</p>'}`;
    } else {
      h = `<h2 class="w11st-h">${PAGES.find((p) => p[0] === page)[2]}</h2><div class="w11st-grid">${ITEMS_ALL().filter((i) => i.cat === page).map(card).join('')}</div>`;
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
    const bar = pg.querySelector(`[data-prog="${id}"]`);
    await progress(bar || document.createElement('div'), 1800, 'İndiriliyor…');
    busy.delete(id);
    if (it.kind === 'fake') {
      render();
      desk.toast('Mağaza bu uygulamayı kaldırdı', 'Taklit (sahte) uygulama olduğu anlaşıldı ve yüklenmedi. Yayımcının adına, puanlara ve istenen izinlere bakmak sizi korur.', SYS_ICONS.warn, 9000);
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
    if (b?.dataset.page) { page = b.dataset.page; detail = null; query = ''; body.querySelector('.w11st-q').value = ''; render(); emit('store-page', { page }); return; }
    if (b?.dataset.back) { detail = null; render(); return; }
    if (b?.dataset.get) return get(b.dataset.get);
    if (b?.dataset.open) { desk.open(b.dataset.open); emit('store-open', { id: b.dataset.open }); return; }
    if (b?.dataset.apply) { desk.applyTheme(b.dataset.apply); render(); return; }
    if (b?.dataset.upd) { b.outerHTML = '<span class="spin"></span>'; setTimeout(() => { desk.toast('Mağaza', 'Bütün uygulamalarınız güncel.', APP_ICONS.store, 3000); render(); }, 1200); return; }
    const c = e.target.closest('[data-detail]');
    if (c) { detail = c.dataset.detail; render(); emit('store-detail', { id: detail }); }
  });
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.dataset.detail) e.target.click(); });
  body.querySelector('.w11st-q').addEventListener('input', (e) => { query = e.target.value.trim(); detail = null; render(); emit('store-search', { text: query }); });

  render();
  return {
    onArgs: (a) => { if (a.page) { page = a.page; detail = null; query = ''; render(); } },
    onSettings: render,
  };
}

// ---- Takvim ----
const HOLIDAYS = { '1-1': 'Yılbaşı', '23-4': 'Ulusal Egemenlik ve Çocuk Bayramı', '1-5': 'Emek ve Dayanışma Günü', '19-5': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', '15-7': 'Demokrasi ve Millî Birlik Günü', '30-8': 'Zafer Bayramı', '29-10': 'Cumhuriyet Bayramı' };
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export function takvim({ desk, body, emit }) {
  body.classList.add('w11a', 'w11tk');
  const now = desk.now();
  let y = now.getFullYear(), m = now.getMonth(), pick = now.getDate();
  const notes = (desk.calNotes ||= {});
  const events = () => (desk.calEvents ||= []); // randevular: { id, date: 'Y-A-G', time, title, remind (dakika önce; null: hatırlatma yok) }
  function render() {
    const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const isToday = (d) => d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    const key = (d) => `${y}-${m + 1}-${d}`;
    const dayEvs = (d) => events().filter((e) => e.date === key(d)).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    let cells = '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) cells += `<button type="button" data-day="${d}" class="${isToday(d) ? 'today' : ''} ${d === pick ? 'pick' : ''} ${HOLIDAYS[`${d}-${m + 1}`] ? 'hol' : ''}"><b>${d}</b>${notes[key(d)] || dayEvs(d).length ? '<i></i>' : ''}</button>`;
    const hol = HOLIDAYS[`${pick}-${m + 1}`];
    const wd = new Date(y, m, pick).toLocaleDateString('tr-TR', { weekday: 'long' });
    body.innerHTML = `<div class="w11tk-wrap"><section class="w11tk-cal"><div class="w11tk-head"><b>${MONTHS[m]} ${y}</b><span class="w11tk-nav"><button type="button" data-mv="0" class="w11tk-today">Bugün</button><button type="button" data-mv="-1" title="Önceki ay" aria-label="Önceki ay">${ic('chevup')}</button><button type="button" data-mv="1" title="Sonraki ay" aria-label="Sonraki ay">${ic('chevdown')}</button></span></div>
      <div class="w11tk-grid">${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => `<em>${d}</em>`).join('')}${cells}</div></section>
      <section class="w11tk-day"><div class="w11tk-dt"><small>${wd}</small><b>${pick} ${MONTHS[m]} ${y}</b></div>${hol ? `<p class="w11tk-hol">${ic('flag')}${hol}</p>` : ''}
        <label class="w11tk-notel">Not <input class="w11tk-note" value="${esc(notes[key(pick)] || '')}" placeholder="ör. Bugün çiçekleri sula"></label>
        <div class="w11tk-evs">${dayEvs(pick).map((e) => `<div class="w11tk-ev"><b>${e.time || 'Gün boyu'}</b><span>${esc(e.title)}${e.time && e.remind != null ? `<small>${ic('bell')}${e.remind ? `${e.remind} dk önce` : 'tam vaktinde'} hatırlatır</small>` : ''}</span><button type="button" data-evdel="${e.id}" title="Randevuyu sil" aria-label="Randevuyu sil">${ic('close')}</button></div>`).join('') || '<p class="w11st-mut">Bu güne randevu eklenmedi.</p>'}</div>
        <div class="w11tk-evform"><b>${ic('plus')}Randevu ekle</b><input class="w11tk-evt" maxlength="40" placeholder="Ne var? (ör. Doktor randevusu)">
          <div class="w11tk-evrow"><input type="time" class="w11tk-evtime" title="Saat"><select class="w11tk-evrem" title="Hatırlatıcı"><option value="">Hatırlatma yok</option><option value="0">Tam vaktinde</option><option value="5">5 dk önce</option><option value="15">15 dk önce</option><option value="30">30 dk önce</option><option value="60">1 saat önce</option></select><button type="button" class="w11tk-evadd w11-btn acc">Ekle</button></div>
          <p class="w11tk-everr"></p></div></section></div>`;
  }
  body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.day) { pick = +b.dataset.day; render(); emit('cal-pick', { day: pick, month: m + 1 }); return; }
    if (b.dataset.evdel) { desk.calEvents = events().filter((x) => x.id !== b.dataset.evdel); render(); emit('cal-del'); return; }
    if (b.classList.contains('w11tk-evadd')) { addEvent(); return; }
    if (b.dataset.mv === undefined) return;
    const mv = +b.dataset.mv;
    if (mv === 0) { y = now.getFullYear(); m = now.getMonth(); pick = now.getDate(); } else { m += mv; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } pick = 1; }
    render();
  });
  body.addEventListener('input', (e) => {
    if (!e.target.classList.contains('w11tk-note')) return;
    notes[`${y}-${m + 1}-${pick}`] = e.target.value;
    emit('cal-note', { text: e.target.value });
  });
  function addEvent() {
    const title = body.querySelector('.w11tk-evt').value.trim();
    const time = body.querySelector('.w11tk-evtime').value;
    const rem = body.querySelector('.w11tk-evrem').value;
    const err = !title ? 'Önce randevunun adını yazın.' : rem !== '' && !time ? 'Hatırlatma için bir saat seçin.' : '';
    if (err) { body.querySelector('.w11tk-everr').textContent = err; return; }
    const ev = { id: 'e' + Date.now(), date: `${y}-${m + 1}-${pick}`, time, title, remind: rem === '' ? null : +rem };
    events().push(ev);
    render();
    emit('cal-add', { title, time, remind: ev.remind, day: pick, month: m + 1 });
  }
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('w11tk-evt')) addEvent(); });
  body.addEventListener('change', (e) => { if (!e.target.closest('.w11tk-evform')) render(); });
  render();
}

// ---- Hava Durumu ----
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Erzurum'];
const SKY = [['sun', 'Güneşli'], ['partly', 'Parçalı bulutlu'], ['cloud', 'Bulutlu'], ['rain', 'Yağmurlu'], ['storm', 'Gök gürültülü'], ['few', 'Az bulutlu']];

export function hava({ desk, body, emit, dialogs }) {
  body.classList.add('w11a', 'w11hv');
  const st = (desk.weather ||= { city: null, asked: false });
  function render() {
    if (!desk.settings.wifi || !desk.settings.network) {
      body.innerHTML = `<div class="w11hv-off">${WX.off}<p><b>İnternet bağlantısı yok</b></p><p>Hava durumu internetten gelir. Wi-Fi'ye bağlanıp tekrar deneyin.</p></div>`;
      return;
    }
    const city = st.city || 'İstanbul';
    const d0 = desk.now();
    const seed = (i) => (city.length * 7 + d0.getDate() * 3 + i * 5) % SKY.length;
    const temp = (i) => 8 + ((city.length * 3 + d0.getDate() + i * 4) % 15);
    const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(d0); d.setDate(d.getDate() + i); return [i ? d.toLocaleDateString('tr-TR', { weekday: 'long' }) : 'Bugün', SKY[seed(i)], temp(i)]; });
    body.innerHTML = `<div class="w11hv-top"><label class="w11hv-sel">${ic('pin')}<select class="w11hv-city" aria-label="Şehir">${CITIES.map((c) => `<option ${c === city ? 'selected' : ''}>${c}</option>`).join('')}</select></label>${st.city && st.byLocation ? `<small>${ic('pin')}Konumunuzdan</small>` : ''}</div>
      <div class="w11hv-now"><span class="w11hv-big">${WX[days[0][1][0]]}</span><div class="w11hv-t"><b>${days[0][2]}°</b><span>${days[0][1][1]}</span><small>${city}</small></div>
        <ul class="w11hv-det"><li>${ic('thermo')}<span>Hissedilen</span><b>${days[0][2] - 2}°</b></li><li>${ic('drop')}<span>Nem</span><b>%${55 + seed(0) * 5}</b></li><li>${ic('wind')}<span>Rüzgâr</span><b>${8 + seed(0) * 3} km/sa</b></li></ul></div>
      <h3 class="w11hv-h">5 günlük tahmin</h3><div class="w11hv-days">${days.map(([n, [k], t]) => `<div><small>${n}</small><span>${WX[k]}</span><b>${t}°</b><small>${t - 7}°</small></div>`).join('')}</div>`;
  }
  async function ask() {
    st.asked = true;
    const a = await dialogs.ask({ title: 'Hava Durumu', icon: ic('pin'), text: '<b>Hava Durumu, tam konumunuza erişsin mi?</b><br>Bulunduğunuz şehrin havasını kendiliğinden göstermek için kullanılır. İzin vermezseniz şehri kendiniz seçersiniz.', buttons: [['yes', 'Evet'], ['no', 'Hayır', true]] });
    if (a === 'yes') { st.city = 'İstanbul'; st.byLocation = true; }
    emit('weather-location', { answer: a });
    render();
  }
  body.addEventListener('change', (e) => { if (e.target.classList.contains('w11hv-city')) { st.city = e.target.value; st.byLocation = false; render(); emit('weather-city', { city: st.city }); } });
  render();
  if (!st.asked) setTimeout(ask, 300);
  return { onSettings: render };
}
