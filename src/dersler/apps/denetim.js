// Denetim Masası: kategori ve simge görünümü, arama. Programlar ve Özellikler (kaldırma), Sistem, Güç Seçenekleri ve
// Tarih ve Saat kendi sayfalarında açılır; öteki öğeler (Fare, Ses, Yazıcılar…) Windows'taki gibi Ayarlar'a ya da ilgili programa gider.
import { esc, progress } from './util.js';
import { APPS } from './index.js';

// [simge, ad, açıklama, anahtar kelimeler, nereye]
const ITEMS = {
  system: ['🖥', 'Sistem', 'Bilgisayarınızın işlemcisini, belleğini (RAM) ve Windows sürümünü görün', 'işlemci ram bellek windows sürüm bilgisayar adı hakkında'],
  firewall: ['🧱', 'Windows Güvenlik Duvarı', 'Güvenlik duvarını açın ya da kapatın', 'güvenlik duvarı firewall virüs antivirüs'],
  power: ['🔋', 'Güç Seçenekleri', 'Ekranın ve bilgisayarın ne zaman uykuya geçeceğini belirleyin', 'güç uyku ekran kapanma pil enerji'],
  update: ['🔄', 'Windows Update', 'Güncelleştirmeleri denetleyin', 'güncelleme update'],
  network: ['📶', 'Ağ ve Paylaşım Merkezi', 'Wi-Fi ve internet bağlantısını görün', 'ağ wifi internet bağlantı'],
  inet: ['🌐', 'İnternet Seçenekleri', 'Tarayıcı ayarları: ana sayfa, geçmiş, çerezler', 'internet tarayıcı ana sayfa çerez geçmiş'],
  devices: ['🖨', 'Aygıtlar ve Yazıcılar', 'Yazıcı, fare ve öteki aygıtları görün, yazıcı ekleyin', 'yazıcı aygıt cihaz bluetooth'],
  sound: ['🔊', 'Ses', 'Ses düzeyi, hoparlör ve mikrofon', 'ses hoparlör mikrofon kulaklık'],
  mouse: ['🖱', 'Fare', 'Çift tıklama hızı, düğmeler, işaretçi', 'fare mouse çift tıklama işaretçi imleç'],
  keyboard: ['⌨', 'Klavye', 'Klavye dili ve düzeni (Türkçe Q, F)', 'klavye dil düzen f q'],
  devmgr: ['🧩', 'Aygıt Yöneticisi', 'Donanımları ve sürücülerini görün', 'aygıt sürücü donanım driver'],
  programs: ['📦', 'Programlar ve Özellikler', 'Yüklü programları görün, istemediğinizi kaldırın', 'program kaldır uygulama yüklü kurulum uninstall'],
  users: ['👤', 'Kullanıcı Hesapları', 'Şifre, PIN ve hesap seçenekleri', 'kullanıcı hesap şifre pin'],
  personal: ['🎨', 'Kişiselleştirme', 'Arka plan, tema ve renkler', 'arka plan tema renk görünüm'],
  datetime: ['🕒', 'Tarih ve Saat', 'Saati ve tarihi değiştirin', 'saat tarih zaman dilimi'],
  region: ['🌍', 'Bölge', 'Ülke, dil ve biçimler', 'bölge dil ülke biçim'],
  access: ['♿', 'Erişim Kolaylığı Merkezi', 'Büyüteç, metin boyutu, fare işaretçisi', 'erişim büyüteç yazı boyutu kolaylık'],
};
const CATS = [
  ['Sistem ve Güvenlik', '🛡', ['system', 'firewall', 'power', 'update']],
  ['Ağ ve İnternet', '🌐', ['network', 'inet']],
  ['Donanım ve Ses', '🖨', ['devices', 'sound', 'mouse', 'power']],
  ['Programlar', '📦', ['programs']],
  ['Kullanıcı Hesapları', '👤', ['users']],
  ['Görünüm ve Kişiselleştirme', '🎨', ['personal']],
  ['Saat ve Bölge', '🕒', ['datetime', 'region']],
  ['Erişim Kolaylığı', '♿', ['access']],
];
// Ayarlar'da karşılığı olan öğeler
const TO_SETTINGS = { update: 'update', network: 'network', devices: 'devices', sound: 'system', mouse: 'devices', keyboard: 'time', users: 'accounts', personal: 'personal', region: 'time', access: 'access' };
const FIXED = [
  ['Microsoft Edge', 'Microsoft Corporation', '12.03.2026', '—'],
  ['Intel(R) Grafik Sürücüsü', 'Intel Corporation', '08.09.2025', '288 MB'],
  ['Realtek Yüksek Tanımlı Ses Sürücüsü', 'Realtek Semiconductor Corp.', '08.09.2025', '12,4 MB'],
];
const PLANS = [['dengeli', 'Dengeli', 'Önerilen: hem hızlı hem tasarruflu'], ['tasarruf', 'Güç tasarrufu', 'Pil ve elektrik harcamasını azaltır'], ['performans', 'Yüksek performans', 'En hızlı çalışır, en çok enerji harcar']];
const MINS = [[2, '2 dakika'], [5, '5 dakika'], [10, '10 dakika'], [15, '15 dakika'], [30, '30 dakika'], [60, '1 saat'], [0, 'Hiçbir zaman']];
const SIZES = { viewer: '48 MB', takvim: '36 MB', hava: '22 MB' };

export function denetim({ desk, body, emit, dialogs }) {
  body.classList.add('cp');
  const s = () => desk.settings;
  let view = 'cat'; // 'cat' | 'icons' | 'item' | 'category' | 'search'
  let page = null; // item anahtarı ya da kategori sırası
  let mode = 'cat';
  let q = '';
  let sel = null;
  let busy = null;

  const link = (k) => `<a data-item="${k}">${ITEMS[k][1]}</a>`;
  const crumbs = () => {
    const parts = ['<a data-home>Denetim Masası</a>'];
    if (view === 'category') parts.push(`<span>${CATS[page][0]}</span>`);
    if (view === 'item') parts.push(`<span>${ITEMS[page][1]}</span>`);
    if (view === 'search') parts.push(`<span>“${esc(q)}” için arama sonuçları</span>`);
    return parts.join(' <i>›</i> ');
  };

  function render() {
    let main = '';
    if (view === 'cat') {
      main = `<h2>Bilgisayar ayarlarınızı düzenleyin</h2><div class="cp-cats">${CATS.map(([n, ic, items], i) => `<div class="cp-cat"><span class="cp-ic">${ic}</span><div><a class="cp-ct" data-cat="${i}">${n}</a>${items.slice(0, 3).map(link).join('')}</div></div>`).join('')}</div>`;
    } else if (view === 'icons') {
      main = `<h2>Tüm Denetim Masası Öğeleri</h2><div class="cp-icons ${mode === 'small' ? 'small' : ''}">${Object.keys(ITEMS).sort((a, b) => ITEMS[a][1].localeCompare(ITEMS[b][1], 'tr')).map((k) => `<a data-item="${k}"><span>${ITEMS[k][0]}</span>${ITEMS[k][1]}</a>`).join('')}</div>`;
    } else if (view === 'category') {
      main = `<h2>${CATS[page][1]} ${CATS[page][0]}</h2><div class="cp-list">${CATS[page][2].map((k) => `<div class="cp-row"><span class="cp-ic">${ITEMS[k][0]}</span><div><a data-item="${k}">${ITEMS[k][1]}</a><small>${ITEMS[k][2]}</small></div></div>`).join('')}</div>`;
    } else if (view === 'search') {
      const t = q.toLocaleLowerCase('tr').trim();
      const hits = Object.keys(ITEMS).filter((k) => (ITEMS[k][1] + ' ' + ITEMS[k][2] + ' ' + ITEMS[k][3]).toLocaleLowerCase('tr').includes(t));
      main = `<h2>“${esc(q)}” için ${hits.length} sonuç</h2><div class="cp-list">${hits.map((k) => `<div class="cp-row"><span class="cp-ic">${ITEMS[k][0]}</span><div><a data-item="${k}">${ITEMS[k][1]}</a><small>${ITEMS[k][2]}</small></div></div>`).join('') || '<p>Sonuç bulunamadı. Başka bir sözcük deneyin.</p>'}</div>`;
    } else if (page === 'programs') {
      const own = s().installed.map((a) => [APPS[a].name, 'Örnek Yazılım A.Ş.', '14.10.2026', SIZES[a] || '30 MB', a]);
      const rows = [...own, ...FIXED.map((r) => [...r, null])];
      main = `<h2>Programı kaldırın ya da değiştirin</h2><p class="cp-note">Bir programı kaldırmak için listeden seçin ve <b>Kaldır</b>'a tıklayın.</p>
        <div class="cp-bar"><button type="button" data-do="uninstall" ${sel && rows.find((r) => r[0] === sel)?.[4] ? '' : 'disabled'}>🗑 Kaldır</button><button type="button" disabled>Değiştir</button></div>
        <table class="cp-tbl"><tr><th>Ad</th><th>Yayımcı</th><th>Yüklendiği tarih</th><th>Boyut</th></tr>${rows.map((r) => `<tr data-prog="${esc(r[0])}" class="${sel === r[0] ? 'on' : ''}"><td>${r[4] ? APPS[r[4]].icon : '▫'} ${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>
        ${busy ? '<div class="cp-prog"></div>' : ''}<p class="cp-note">Alt satırlar Windows ve bilgisayarın parçalarıdır; bunları kaldırmayın.</p>`;
    } else if (page === 'system') {
      main = `<h2>Bilgisayarınızla ilgili temel bilgileri görüntüleyin</h2>
        <div class="cp-box"><h3>Windows sürümü</h3><p><b>Windows 11 Home</b><br>© Microsoft Corporation. Tüm hakları saklıdır.</p></div>
        <div class="cp-box"><h3>Sistem</h3><dl><dt>İşlemci</dt><dd>Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz</dd><dt>Yüklü bellek (RAM)</dt><dd>8,00 GB</dd><dt>Sistem türü</dt><dd>64 bit işletim sistemi</dd></dl></div>
        <div class="cp-box"><h3>Bilgisayar adı ve ayarları</h3><dl><dt>Bilgisayar adı</dt><dd>MASAÜSTÜ-PC</dd><dt>Kullanıcı</dt><dd>${esc(s().user)}</dd><dt>Windows etkinleştirme</dt><dd>Windows etkinleştirildi</dd></dl></div>
        <p class="cp-note">İşlemcinin sonundaki sayı (3.20GHz) hızını, “8,00 GB” ise belleğini gösterir. Yeni bir program alırken “en az ... GB RAM” gereksinimlerini bu bilgilerle karşılaştırın.</p><p><a data-open="devmgr">🧩 Aygıt Yöneticisi</a></p>`;
    } else if (page === 'power') {
      main = `<h2>Bir güç planı seçin</h2><div class="cp-plans">${PLANS.map(([id, n, d]) => `<label><input type="radio" name="plan" value="${id}" ${s().powerPlan === id ? 'checked' : ''}> <b>${n}</b><small>${d}</small></label>`).join('')}</div>
        <div class="cp-box"><h3>Plan ayarları</h3><label class="cp-sel">Ekranı kapat <select data-sel="screenOff">${MINS.map(([v, l]) => `<option value="${v}" ${s().screenOff === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="cp-sel">Bilgisayarı uykuya geçir <select data-sel="sleepAfter">${MINS.map(([v, l]) => `<option value="${v}" ${s().sleepAfter === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <button type="button" class="primary" data-do="savePower">Değişiklikleri kaydet</button></div>
        <p class="cp-note"><b>Uyku</b>, bilgisayarı kapatmadan düşük enerjiye alır; fareye dokununca hemen açılır. Uzun süre yanınızda yoksa süreyi kısaltmak elektrik tasarrufu sağlar.</p>`;
    } else if (page === 'datetime') {
      const d = desk.now();
      main = `<h2>Tarih ve Saat</h2><div class="cp-box"><div class="cp-clock">${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div><p>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p>Saat dilimi: <b>${esc(s().tz)}</b></p><p><button type="button" class="primary" data-do="changeTime">Tarih ve saati değiştir…</button></p></div>
        <p class="cp-note">Yeni Windows'larda tarih ve saat ayarı <b>Ayarlar → Saat ve dil</b> sayfasına taşınmıştır; bu düğme sizi oraya götürür.</p>`;
    }
    body.innerHTML = `<div class="cp-top"><button type="button" data-do="back" title="Geri" ${view === 'cat' && !page ? 'disabled' : ''}>←</button><div class="cp-addr"><span>🎛</span>${crumbs()}</div>
      <form class="cp-search"><input name="q" placeholder="Denetim Masası'nda ara" value="${view === 'search' ? esc(q) : ''}" autocomplete="off"><button>🔍</button></form></div>
      <div class="cp-view">Görüntüleme ölçütü: <select data-view><option value="cat" ${mode === 'cat' ? 'selected' : ''}>Kategori</option><option value="big" ${mode === 'big' ? 'selected' : ''}>Büyük simgeler</option><option value="small" ${mode === 'small' ? 'selected' : ''}>Küçük simgeler</option></select></div>
      <div class="cp-main">${main}</div>`;
    if (busy) progress(body.querySelector('.cp-prog'), 1800, 'Kaldırılıyor…').then(busy.done);
  }

  const goItem = (k) => {
    if (k === 'programs' || k === 'system' || k === 'power' || k === 'datetime') { view = 'item'; page = k; sel = null; render(); emit('cp-open', { item: k, native: true }); return; }
    // Öteki öğeler, gerçek Windows'ta olduğu gibi Ayarlar'a ya da ilgili programa gider
    emit('cp-open', { item: k, native: false });
    desk.toast('Denetim Masası', `“${ITEMS[k][1]}” artık Ayarlar'da açılıyor: yeni Windows'ta bu ayarlar oraya taşındı.`, '🎛', 4500);
    if (k === 'firewall') desk.open('guvenlik', { page: 'duvar' });
    else if (k === 'devmgr') desk.open('devmgr');
    else if (k === 'inet') desk.open('browser');
    else desk.open('settings', { page: TO_SETTINGS[k] });
  };

  body.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-home]')) { view = mode === 'cat' ? 'cat' : 'icons'; page = null; render(); return; }
    const it = t.closest('[data-item]');
    if (it) { goItem(it.dataset.item); return; }
    const cat = t.closest('[data-cat]');
    if (cat) { view = 'category'; page = +cat.dataset.cat; render(); emit('cp-category', { name: CATS[page][0] }); return; }
    const op = t.closest('[data-open]');
    if (op) { desk.open(op.dataset.open); return; }
    const pr = t.closest('[data-prog]');
    if (pr && !busy) { sel = pr.dataset.prog; render(); emit('cp-select', { name: sel }); return; }
    const d = t.closest('[data-do]')?.dataset.do;
    if (d === 'back') { view = mode === 'cat' ? 'cat' : 'icons'; page = null; render(); return; }
    if (d === 'changeTime') { emit('cp-open', { item: 'datetime-change' }); desk.open('settings', { page: 'time' }); return; }
    if (d === 'savePower') {
      const plan = body.querySelector('[name=plan]:checked')?.value || s().powerPlan;
      s().powerPlan = plan;
      s().screenOff = +body.querySelector('[data-sel=screenOff]').value;
      s().sleepAfter = +body.querySelector('[data-sel=sleepAfter]').value;
      desk.toast('Güç Seçenekleri', 'Ayarlarınız kaydedildi.', '🔋', 3000);
      emit('cp-power', { plan, screenOff: s().screenOff, sleepAfter: s().sleepAfter });
      return;
    }
    if (d === 'uninstall') {
      const a = s().installed.find((x) => APPS[x].name === sel);
      if (!a) return;
      const ans = await dialogs.ask({ title: 'Programlar ve Özellikler', icon: APPS[a].icon, text: `<b>${APPS[a].name}</b> programını kaldırmak istediğinizden emin misiniz?`, buttons: [['yes', 'Evet', true], ['no', 'Hayır']] });
      if (ans !== 'yes') return;
      busy = { done: () => {
        busy = null;
        s().installed = s().installed.filter((x) => x !== a);
        for (const n of desk.fs.children('desktop')) if (n.type === 'link' && n.app === a) desk.fs.purge(n.id);
        for (const w of desk.wins.filter((x) => x.app === a)) desk.destroy(w);
        sel = null;
        render();
        emit('uninstall', { app: a, name: APPS[a].name, via: 'cp' });
      } };
      render();
    }
  });
  body.addEventListener('change', (e) => {
    if (e.target.dataset.view !== undefined) {
      mode = e.target.value;
      view = mode === 'cat' ? 'cat' : 'icons';
      page = null;
      render();
      emit('cp-view', { mode });
    }
  });
  body.addEventListener('submit', (e) => {
    e.preventDefault();
    q = e.target.q.value.trim();
    if (!q) return;
    view = 'search';
    page = null;
    render();
    emit('cp-search', { q });
  });
  render();
  return { onSettings: () => { if (!busy && view === 'item' && page === 'datetime') render(); }, onArgs: (a) => { if (a.item) goItem(a.item); } };
}
