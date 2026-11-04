// Denetim Masası (Windows 11): kategori ve simge görünümü, arama, adres çubuğu. Programlar ve Özellikler (kaldırma), Sistem, Güç Seçenekleri ve
// Tarih ve Saat kendi sayfalarında açılır; öteki öğeler (Fare, Ses, Yazıcılar…) Windows'taki gibi Ayarlar'a ya da ilgili programa gider.
import { esc, progress } from './util.js';
import { APPS } from './index.js';
import { SYS_ICONS as SI, APP_ICONS as AI, WIN_LOGO } from './appicons.js';
import { NAV, MI, CP } from './w11-simge.js';

// [simge, ad, açıklama, anahtar kelimeler]
const ITEMS = {
  system: [SI.pc, 'Sistem', 'Bilgisayarınızın işlemcisini, belleğini (RAM) ve Windows sürümünü görün', 'işlemci ram bellek windows sürüm bilgisayar adı hakkında'],
  firewall: [CP.firewall, 'Windows Güvenlik Duvarı', 'Güvenlik duvarını açın ya da kapatın', 'güvenlik duvarı firewall virüs antivirüs'],
  power: [CP.power, 'Güç Seçenekleri', 'Ekranın ve bilgisayarın ne zaman uykuya geçeceğini belirleyin', 'güç uyku ekran kapanma pil enerji'],
  update: [NAV.update, 'Windows Update', 'Güncelleştirmeleri denetleyin', 'güncelleme update'],
  network: [NAV.network, 'Ağ ve Paylaşım Merkezi', 'Wi-Fi ve internet bağlantısını görün', 'ağ wifi internet bağlantı'],
  inet: [SI.globe, 'İnternet Seçenekleri', 'Tarayıcı ayarları: ana sayfa, geçmiş, çerezler', 'internet tarayıcı ana sayfa çerez geçmiş'],
  devices: [SI.printer, 'Aygıtlar ve Yazıcılar', 'Yazıcı, fare ve öteki aygıtları görün, yazıcı ekleyin', 'yazıcı aygıt cihaz bluetooth'],
  sound: [CP.sound, 'Ses', 'Ses düzeyi, hoparlör ve mikrofon', 'ses hoparlör mikrofon kulaklık'],
  mouse: [CP.mouse, 'Fare', 'Çift tıklama hızı, düğmeler, işaretçi', 'fare mouse çift tıklama işaretçi imleç'],
  keyboard: [CP.keyboard, 'Klavye', 'Klavye dili ve düzeni (Türkçe Q, F)', 'klavye dil düzen f q'],
  devmgr: [AI.devmgr, 'Aygıt Yöneticisi', 'Donanımları ve sürücülerini görün', 'aygıt sürücü donanım driver'],
  programs: [CP.programs, 'Programlar ve Özellikler', 'Yüklü programları görün, istemediğinizi kaldırın', 'program kaldır uygulama yüklü kurulum uninstall'],
  users: [SI.user, 'Kullanıcı Hesapları', 'Şifre, PIN ve hesap seçenekleri', 'kullanıcı hesap şifre pin'],
  personal: [CP.display, 'Kişiselleştirme', 'Arka plan, tema ve renkler', 'arka plan tema renk görünüm'],
  datetime: [AI.saat, 'Tarih ve Saat', 'Saati ve tarihi değiştirin', 'saat tarih zaman dilimi'],
  region: [CP.region, 'Bölge', 'Ülke, dil ve biçimler', 'bölge dil ülke biçim'],
  access: [NAV.access, 'Erişim Kolaylığı Merkezi', 'Büyüteç, metin boyutu, fare işaretçisi', 'erişim büyüteç yazı boyutu kolaylık'],
};
// [kategori adı, simge, [öğeler], giriş ekranındaki alt bağlantılar: [yazı, öğe]]
const CATS = [
  ['Sistem ve Güvenlik', AI.guvenlik, ['system', 'firewall', 'power', 'update'], [['Bilgisayarınızın durumunu gözden geçirin', 'system'], ['Windows Güvenlik Duvarı', 'firewall'], ['Bilgisayar uyku zamanını değiştirin', 'power']]],
  ['Ağ ve İnternet', NAV.network, ['network', 'inet'], [['Ağ durumunu ve görevlerini görüntüleyin', 'network']]],
  ['Donanım ve Ses', SI.printer, ['devices', 'sound', 'mouse', 'power'], [['Aygıtları ve yazıcıları görüntüleyin', 'devices'], ['Aygıt ekle', 'devices'], ['Ses düzeyini ayarlayın', 'sound']]],
  ['Programlar', CP.programs, ['programs'], [['Program kaldırma', 'programs']]],
  ['Kullanıcı Hesapları', SI.user, ['users'], [['Hesap türünü değiştirin', 'users']]],
  ['Görünüm ve Kişiselleştirme', CP.display, ['personal'], [['Masaüstü arka planını değiştirin', 'personal']]],
  ['Saat ve Bölge', AI.saat, ['datetime', 'region'], [['Tarih ve saati ayarlayın', 'datetime'], ['Tarih, saat veya sayı biçimlerini değiştirin', 'region']]],
  ['Erişim Kolaylığı', NAV.access, ['access'], [['Windows\'un önerdiği ayarları kullanın', 'access'], ['Görsel ekranı iyileştirin', 'access']]],
];
// Ayarlar'da karşılığı olan öğeler
const TO_SETTINGS = { update: 'update', network: 'network', devices: 'devices', sound: 'system', mouse: 'devices', keyboard: 'time', users: 'accounts', personal: 'personal', region: 'time', access: 'access' };
const FIXED = [
  ['Microsoft Edge', 'Microsoft Corporation', '12.03.2026', '—', AI.browser],
  ['Intel(R) Grafik Sürücüsü', 'Intel Corporation', '08.09.2025', '288 MB', CP.display],
  ['Realtek Yüksek Tanımlı Ses Sürücüsü', 'Realtek Semiconductor Corp.', '08.09.2025', '12,4 MB', CP.sound],
];
const PLANS = [['dengeli', 'Dengeli', 'Önerilen: hem hızlı hem tasarruflu'], ['tasarruf', 'Güç tasarrufu', 'Pil ve elektrik harcamasını azaltır'], ['performans', 'Yüksek performans', 'En hızlı çalışır, en çok enerji harcar']];
const MINS = [[2, '2 dakika'], [5, '5 dakika'], [10, '10 dakika'], [15, '15 dakika'], [30, '30 dakika'], [60, '1 saat'], [0, 'Hiçbir zaman']];
const SIZES = { viewer: '48 MB', takvim: '36 MB', hava: '22 MB' };
const mb = (t) => (/GB/.test(t) ? parseFloat(t.replace(',', '.')) * 1024 : parseFloat(t.replace(',', '.')) || 0);

export function denetim({ desk, body, args = {}, emit, dialogs }) {
  body.classList.add('dtm');
  const s = () => desk.settings;
  const pcName = () => s().pcName || 'MASAÜSTÜ-PC';
  let view = 'cat'; // 'cat' | 'icons' | 'item' | 'category' | 'search'
  let page = null; // item anahtarı ya da kategori sırası
  let mode = 'cat';
  let q = '';
  let sel = null;
  let busy = null;
  const hist = [], fwd = [];
  const cur = () => ({ view, page, q });
  const nav = (v, p = null, qq = q) => { hist.push(cur()); fwd.length = 0; view = v; page = p; q = qq; sel = null; render(); };
  const home = () => nav(mode === 'cat' ? 'cat' : 'icons');

  const link = (k, label) => `<a data-item="${k}" tabindex="0">${label || ITEMS[k][1]}</a>`;
  const crumbs = () => {
    const parts = ['<a data-home tabindex="0">Denetim Masası</a>'];
    if (view === 'category') parts.push(`<span>${CATS[page][0]}</span>`);
    if (view === 'item') parts.push(`<span>${ITEMS[page][1]}</span>`);
    if (view === 'search') parts.push(`<span>Arama sonuçları: “${esc(q)}”</span>`);
    return parts.join(`<i>${MI.chevright}</i>`);
  };
  const left = (extra = '') => `<nav class="dtm-left"><a data-home tabindex="0">Denetim Masası Giriş</a>${extra}</nav>`;
  const row = (k) => `<div class="dtm-row"><span class="dtm-ic">${ITEMS[k][0]}</span><div><a data-item="${k}" tabindex="0" class="dtm-it">${ITEMS[k][1]}</a><small>${ITEMS[k][2]}</small></div></div>`;

  function render() {
    let main = '', pane = '';
    if (view === 'cat') {
      main = `<div class="dtm-hd"><h2>Bilgisayar ayarlarınızı düzenleyin</h2></div><div class="dtm-cats">${CATS.map(([n, ic, , subs], i) => `<div class="dtm-cat"><span class="dtm-ic big">${ic}</span><div><a class="dtm-ct" data-cat="${i}" tabindex="0">${n}</a>${subs.map(([t, k]) => link(k, t)).join('')}</div></div>`).join('')}</div>`;
    } else if (view === 'icons') {
      main = `<div class="dtm-hd"><h2>Tüm Denetim Masası Öğeleri</h2></div><div class="dtm-icons ${mode === 'small' ? 'small' : ''}">${Object.keys(ITEMS).sort((a, b) => ITEMS[a][1].localeCompare(ITEMS[b][1], 'tr')).map((k) => `<a data-item="${k}" tabindex="0"><span class="dtm-ic">${ITEMS[k][0]}</span>${ITEMS[k][1]}</a>`).join('')}</div>`;
    } else if (view === 'category') {
      pane = left();
      main = `<div class="dtm-hd"><h2>${CATS[page][0]}</h2></div><div class="dtm-list">${CATS[page][2].map(row).join('')}</div>`;
    } else if (view === 'search') {
      pane = left();
      const t = q.toLocaleLowerCase('tr').trim();
      const hits = Object.keys(ITEMS).filter((k) => (ITEMS[k][1] + ' ' + ITEMS[k][2] + ' ' + ITEMS[k][3]).toLocaleLowerCase('tr').includes(t));
      main = `<div class="dtm-hd"><h2>“${esc(q)}” için ${hits.length} sonuç</h2></div><div class="dtm-list">${hits.map(row).join('') || '<p>Sonuç bulunamadı. Başka bir sözcük deneyin.</p>'}</div>`;
    } else if (page === 'programs') {
      pane = left('<a data-item="update" tabindex="0">Yüklü güncelleştirmeleri görüntüle</a>');
      const own = s().installed.map((a) => [APPS[a].name, 'Örnek Yazılım A.Ş.', '14.10.2026', SIZES[a] || '30 MB', APPS[a].icon, a]);
      const rows = [...own, ...FIXED.map((r) => [...r, null])];
      const total = rows.reduce((t, r) => t + mb(r[3]), 0);
      const totalTxt = total >= 1024 ? (total / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' GB' : Math.round(total).toLocaleString('tr-TR') + ' MB';
      const mine = sel && rows.find((r) => r[0] === sel)?.[5];
      main = `<div class="dtm-hd"><h2>Programı kaldırın ya da değiştirin</h2></div><p class="dtm-note">Bir programı kaldırmak için listeden seçin ve ardından <b>Kaldır</b> ya da <b>Değiştir</b>'e tıklayın.</p>
        <div class="dtm-bar"><button type="button" data-do="uninstall" ${mine ? '' : 'disabled'}>Kaldır</button><button type="button" data-do="change" ${mine ? '' : 'disabled'}>Değiştir</button></div>
        <div class="dtm-tw"><table class="dtm-tbl"><tr><th>Ad</th><th>Yayımcı</th><th>Yüklendiği tarih</th><th>Boyut</th></tr>${rows.map((r) => `<tr data-prog="${esc(r[0])}" class="${sel === r[0] ? 'on' : ''}"><td><span class="dtm-ic s">${r[4]}</span>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table></div>
        ${busy ? '<div class="dtm-prog"></div>' : ''}
        <div class="dtm-stat"><span class="dtm-ic">${CP.programs}</span><div><b>Şu anda yüklü programlar</b> &nbsp; Toplam boyut: ${totalTxt}<br><small>${rows.length} program yüklü</small></div></div>
        <p class="dtm-note">Alt satırlar Windows ve bilgisayarın parçalarıdır; bunları kaldırmayın.</p>`;
    } else if (page === 'system') {
      pane = left('<a data-open="devmgr" tabindex="0">Aygıt Yöneticisi</a>');
      main = `<div class="dtm-hd"><h2>Bilgisayarınızla ilgili temel bilgileri görüntüleyin</h2></div>
        <div class="dtm-box"><h3>Windows sürümü</h3><div class="dtm-win"><span class="dtm-logo">${WIN_LOGO}</span><div><b>Windows 11 Home</b><br>© Microsoft Corporation. Tüm hakları saklıdır.</div></div></div>
        <div class="dtm-box"><h3>Sistem</h3><dl><dt>İşlemci:</dt><dd>Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz &nbsp; 3.19 GHz</dd><dt>Yüklü bellek (RAM):</dt><dd>8,00 GB</dd><dt>Sistem türü:</dt><dd>64 bit işletim sistemi</dd></dl></div>
        <div class="dtm-box"><h3>Bilgisayar adı ve ayarları</h3><dl><dt>Bilgisayar adı:</dt><dd>${esc(pcName())}</dd><dt>Kullanıcı:</dt><dd>${esc(s().user)}</dd></dl></div>
        <div class="dtm-box"><h3>Windows etkinleştirme</h3><p>Windows etkinleştirildi</p></div>
        <p class="dtm-note">İşlemcinin sonundaki sayı (3.20GHz) hızını, “8,00 GB” ise belleğini gösterir. Yeni bir program alırken “en az ... GB RAM” gereksinimlerini bu bilgilerle karşılaştırın.</p>`;
    } else if (page === 'power') {
      pane = left();
      main = `<div class="dtm-hd"><h2>Bir güç planı seçin</h2></div><div class="dtm-plans">${PLANS.map(([id, n, d]) => `<label><input type="radio" name="plan" value="${id}" ${s().powerPlan === id ? 'checked' : ''}> <b>${n}</b><small>${d}</small></label>`).join('')}</div>
        <div class="dtm-box"><h3>Plan ayarları</h3><label class="dtm-sel">Ekranı kapat <select data-sel="screenOff">${MINS.map(([v, l]) => `<option value="${v}" ${s().screenOff === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="dtm-sel">Bilgisayarı uykuya geçir <select data-sel="sleepAfter">${MINS.map(([v, l]) => `<option value="${v}" ${s().sleepAfter === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <button type="button" class="primary" data-do="savePower">Değişiklikleri kaydet</button></div>
        <p class="dtm-note"><b>Uyku</b>, bilgisayarı kapatmadan düşük enerjiye alır; fareye dokununca hemen açılır. Uzun süre yanınızda yoksa süreyi kısaltmak elektrik tasarrufu sağlar.</p>`;
    } else if (page === 'datetime') {
      pane = left();
      const d = desk.now();
      main = `<div class="dtm-hd"><h2>Tarih ve Saat</h2></div><div class="dtm-box"><div class="dtm-clock">${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div><p>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p>Saat dilimi: <b>${esc(s().tz)}</b></p><p><button type="button" class="primary" data-do="changeTime">Tarih ve saati değiştir…</button></p></div>
        <p class="dtm-note">Yeni Windows'larda tarih ve saat ayarı <b>Ayarlar → Saat ve dil</b> sayfasına taşınmıştır; bu düğme sizi oraya götürür.</p>`;
    }
    body.innerHTML = `<div class="dtm-top"><button type="button" data-do="back" title="Geri" aria-label="Geri" ${hist.length ? '' : 'disabled'}>${MI.back}</button><button type="button" data-do="fwd" title="İleri" aria-label="İleri" ${fwd.length ? '' : 'disabled'}>${MI.forward}</button><button type="button" data-do="up" title="Yukarı" aria-label="Yukarı" ${view === 'cat' || view === 'icons' ? 'disabled' : ''}>${MI.up}</button>
      <div class="dtm-addr"><span class="dtm-ai">${AI.denetim}</span><i>${MI.chevright}</i>${crumbs()}</div>
      <form class="dtm-search"><input name="q" placeholder="Denetim Masası'nda ara" aria-label="Denetim Masası'nda ara" value="${view === 'search' ? esc(q) : ''}" autocomplete="off"><button aria-label="Ara">${MI.search}</button></form></div>
      <div class="dtm-body">${pane}<div class="dtm-main">${view === 'cat' || view === 'icons' ? `<div class="dtm-view">Görüntüleme ölçütü: <select data-view><option value="cat" ${mode === 'cat' ? 'selected' : ''}>Kategori</option><option value="big" ${mode === 'big' ? 'selected' : ''}>Büyük simgeler</option><option value="small" ${mode === 'small' ? 'selected' : ''}>Küçük simgeler</option></select></div>` : ''}${main}</div></div>`;
    if (busy) progress(body.querySelector('.dtm-prog'), 1800, 'Kaldırılıyor…').then(busy.done);
  }

  const goItem = (k) => {
    if (k === 'programs' || k === 'system' || k === 'power' || k === 'datetime') { nav('item', k); emit('cp-open', { item: k, native: true }); return; }
    // Öteki öğeler, gerçek Windows'ta olduğu gibi Ayarlar'a ya da ilgili programa gider
    emit('cp-open', { item: k, native: false });
    desk.toast('Denetim Masası', `“${ITEMS[k][1]}” artık Ayarlar'da açılıyor: yeni Windows'ta bu ayarlar oraya taşındı.`, AI.denetim, 4500);
    if (k === 'firewall') desk.open('guvenlik', { page: 'duvar' });
    else if (k === 'devmgr') desk.open('devmgr');
    else if (k === 'inet') desk.open('browser');
    else desk.open('settings', { page: TO_SETTINGS[k] });
  };

  body.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-home]')) { home(); return; }
    const it = t.closest('[data-item]');
    if (it) { goItem(it.dataset.item); return; }
    const cat = t.closest('[data-cat]');
    if (cat) { nav('category', +cat.dataset.cat); emit('cp-category', { name: CATS[page][0] }); return; }
    const op = t.closest('[data-open]');
    if (op) { desk.open(op.dataset.open); return; }
    const pr = t.closest('[data-prog]');
    if (pr && !busy) { sel = pr.dataset.prog; render(); emit('cp-select', { name: sel }); return; }
    const d = t.closest('[data-do]')?.dataset.do;
    if (d === 'back' && hist.length) { fwd.push(cur()); ({ view, page, q } = hist.pop()); sel = null; render(); return; }
    if (d === 'fwd' && fwd.length) { hist.push(cur()); ({ view, page, q } = fwd.pop()); sel = null; render(); return; }
    if (d === 'up') { home(); return; }
    if (d === 'changeTime') { emit('cp-open', { item: 'datetime-change' }); desk.open('settings', { page: 'time' }); return; }
    if (d === 'savePower') {
      const plan = body.querySelector('[name=plan]:checked')?.value || s().powerPlan;
      s().powerPlan = plan;
      s().screenOff = +body.querySelector('[data-sel=screenOff]').value;
      s().sleepAfter = +body.querySelector('[data-sel=sleepAfter]').value;
      desk.toast('Güç Seçenekleri', 'Ayarlarınız kaydedildi.', CP.power, 3000);
      emit('cp-power', { plan, screenOff: s().screenOff, sleepAfter: s().sleepAfter });
      return;
    }
    if (d === 'change') {
      const a = s().installed.find((x) => APPS[x].name === sel);
      if (!a) return;
      const ans = await dialogs.ask({ title: 'Programlar ve Özellikler', icon: APPS[a].icon, text: `<b>${APPS[a].name}</b> için kurulum sihirbazı açılırdı: programı <b>onarabilir</b> ya da değiştirebilirdiniz.`, buttons: [['fix', 'Onar', true], ['no', 'İptal']] });
      if (ans === 'fix') desk.toast('Programlar ve Özellikler', `${esc(APPS[a].name)} onarıldı.`, CP.programs, 3000);
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
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('a[tabindex]')) e.target.click(); });
  body.addEventListener('change', (e) => {
    if (e.target.dataset.view !== undefined) {
      mode = e.target.value;
      hist.push(cur()); fwd.length = 0;
      view = mode === 'cat' ? 'cat' : 'icons';
      page = null;
      render();
      emit('cp-view', { mode });
    }
  });
  body.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = e.target.q.value.trim();
    if (!v) return;
    nav('search', null, v);
    emit('cp-search', { q: v });
  });
  render();
  if (args.item) goItem(args.item);
  return { onSettings: () => { if (!busy && view === 'item' && page === 'datetime') render(); }, onArgs: (a) => { if (a.item) goItem(a.item); } };
}
