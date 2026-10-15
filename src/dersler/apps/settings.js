// Ayarlar: ses ve parlaklık, yazıcılar, Wi-Fi, temalar, arka plan, vurgu rengi, yüklü uygulamalar, saat, yazı boyutu, güncelleştirmeler
import { esc, pictureURL, progress, wait, playTune } from './util.js';
import { WALLPAPERS, THEMES, ACCENTS } from '../desktop.js';
import { APPS } from './index.js';
import { strength } from '../lessons/scenes.js';
import { KB } from '../keymap.js';

const PAGES = [
  ['system', '🖥', 'Sistem', 'Ekran, ses'],
  ['devices', '🖨', 'Bluetooth ve cihazlar', 'Yazıcılar, fare'],
  ['network', '📶', 'Ağ ve İnternet', 'Wi-Fi'],
  ['personal', '🎨', 'Kişiselleştirme', 'Temalar, arka plan, renkler'],
  ['apps', '🧩', 'Uygulamalar', 'Yüklü uygulamalar'],
  ['accounts', '👤', 'Hesaplar', 'Şifre, PIN, ekran kilidi'],
  ['time', '🕒', 'Saat ve dil', 'Tarih, saat, klavye'],
  ['access', '♿', 'Erişilebilirlik', 'Metin boyutu, fare işaretçisi, Büyüteç'],
  ['update', '🔄', 'Windows Update', 'Güncelleştirmeler'],
];
export const NETWORKS = [
  { name: 'EvAğı', lock: true, pass: 'evagi2024', bars: 4 },
  { name: 'Komşu_5G', lock: true, pass: 'xq81!kk2', bars: 2 },
  { name: 'Kafe_Ücretsiz', lock: false, bars: 3 },
];
// Çift tıklama hızı 1 (yavaş) … 10 (hızlı): iki tıklama arası en çok kaç ms olabilir
export const dblLimit = (speed) => 900 - (speed - 1) * 70;
export const BT_DEVICES = [
  { name: 'Kablosuz Kulaklık K-30', icon: '🎧', audio: true },
  { name: 'Bluetooth Hoparlör Mini', icon: '🔊', audio: true },
  { name: 'Kablosuz Fare M-10', icon: '🖱' },
  { name: 'TV-4F2A', icon: '❓', unknown: true },
];
const NEW_PRINTER = 'Renkli Yazıcı R-200 (Ağ)';
const ZONES = [['İstanbul (UTC+3)', 3], ['Londra (UTC+0)', 0], ['Berlin (UTC+1)', 1], ['Bakü (UTC+4)', 4], ['New York (UTC-5)', -5]];
const BUILTIN = ['notepad', 'calc', 'paint', 'browser', 'store', 'photos', 'snip', 'mayin'];

export function settings({ desk, body, args, emit, dialogs }) {
  body.classList.add('st');
  const s = desk.settings;
  let page = args.page || 'system';
  body.innerHTML = `<nav class="st-nav"><div class="st-me">👤 <b>${esc(s.user)}</b><small>Yerel hesap</small></div>${PAGES.map(([id, ic, l]) => `<button type="button" data-page="${id}">${ic} ${l}</button>`).join('')}</nav><div class="st-page"></div>`;
  const pg = body.querySelector('.st-page');
  const flow = {}; // sayfa içi akışların durumu (yazıcı arama vb.)

  const toggle = (key, on, label) => `<label class="st-tog"><span>${label}</span><input type="checkbox" data-key="${key}" ${on ? 'checked' : ''}><i></i><b>${on ? 'Açık' : 'Kapalı'}</b></label>`;

  function render() {
    body.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('on', b.dataset.page === page));
    const P = PAGES.find((p) => p[0] === page);
    let h = `<h2>${P[1]} ${P[2]}</h2>`;
    if (page === 'system') {
      h += `<section><h3>Ekran</h3><label class="st-row">☀ Parlaklık <input type="range" data-range="brightness" min="20" max="100" value="${s.brightness}"><b>${s.brightness}</b></label></section>
        <section><h3>Ses</h3><label class="st-row">${s.muted ? '🔇' : '🔊'} Ses düzeyi <input type="range" data-range="volume" min="0" max="100" value="${s.volume}"><b>${s.volume}</b></label>
        ${toggle('muted', s.muted, 'Sesi kapat (sessiz)')}
        <button type="button" class="st-btn" data-act="soundTest">🎵 Sesi dene</button></section>
        <section><h3>Hakkında</h3><dl class="st-about"><dt>Aygıt adı</dt><dd>MASAÜSTÜ-PC</dd><dt>İşlemci</dt><dd>Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz</dd><dt>Yüklü RAM</dt><dd>8,00 GB</dd><dt>Sistem türü</dt><dd>64 bit işletim sistemi</dd>
        <dt>Windows sürümü</dt><dd><b>Windows 11 Home</b></dd></dl><p class="st-note">Bu bilgiler, program alırken “en az 8 GB RAM” gibi gereksinimlerle karşılaştırmanız içindir. Kısa yol: ${'<b>⊞ Windows</b> + <b>R</b>, <b>winver</b>'}.</p></section>`;
    } else if (page === 'devices') {
      const found = flow.bt === 'list' ? BT_DEVICES.filter((d) => !s.btDevices.includes(d.name)) : [];
      h += `<section><h3>Bluetooth</h3>
        <p class="st-note">Bluetooth, kablosuz kulaklık, hoparlör ve fare bağlamak içindir. Kullanmadığınızda kapatın.</p>
        ${toggle('bluetooth', s.bluetooth, 'Bluetooth')}
        <div class="st-list">${s.btDevices.map((n) => { const d = BT_DEVICES.find((x) => x.name === n); return `<div class="st-item"><span>${d.icon}</span><div><b>${esc(n)}</b><small>Bağlı</small></div><button type="button" class="st-btn" data-act="btRemove" data-n="${esc(n)}">Kaldır</button></div>`; }).join('')}</div>
        <div class="st-flow">${!s.bluetooth ? '<small>Cihaz eklemek için önce Bluetooth\'u açın.</small>'
          : flow.bt === 'search' ? '<div class="st-searching"><span class="spin"></span> Cihazlar aranıyor…</div>'
          : flow.bt === 'pairing' ? '<div class="st-prog"></div>'
          : flow.bt === 'list' ? `<div class="st-list">${found.map((d) => `<div class="st-item"><span>${d.icon}</span><div><b>${esc(d.name)}</b><small>${d.unknown ? 'Bilinmeyen cihaz' : 'Eşleşmeye hazır'}</small></div><button type="button" class="st-btn primary" data-act="btPair" data-n="${esc(d.name)}">Bağlan</button></div>`).join('')}</div>`
          : '<button type="button" class="st-btn primary" data-act="btAdd">＋ Cihaz ekle</button>'}</div></section>
        <section><h3>Yazıcılar ve tarayıcılar</h3>
        <div class="st-list">${s.printers.map((p) => `<div class="st-item"><span>🖨</span><b>${esc(p)}</b>${p === NEW_PRINTER ? '<button type="button" class="st-btn" data-act="testPrint">Test sayfası yazdır</button>' : ''}</div>`).join('')}</div>
        <div class="st-flow">${flow.printer || `<button type="button" class="st-btn primary" data-act="addPrinter">＋ Cihaz ekle</button>`}</div></section>
        <section><h3>Fare</h3>
        <label class="st-row">Birincil fare düğmesi <select data-act="primaryBtn"><option value="left" ${s.swapButtons ? '' : 'selected'}>Sol</option><option value="right" ${s.swapButtons ? 'selected' : ''}>Sağ</option></select></label>
        <label class="st-row">Çift tıklama hızı <small>(yavaş ↔ hızlı)</small> <input type="range" data-range="dblSpeed" min="1" max="10" value="${s.dblSpeed}"><b>${s.dblSpeed}</b></label>
        <p class="st-note">Çift tıklamakta zorlanıyorsanız hızı <b>yavaşlatın</b>: iki tıklama arasında daha fazla zaman tanınır.</p>
        <div class="st-dbl"><div class="st-dbl-box" data-test="dbl" title="Çift tıklayın"><span>${flow.dbl ? '📂' : '📁'}</span><small>${flow.dblMsg || 'Klasöre çift tıklayarak deneyin'}</small></div>
        <div class="st-dbl-box" data-test="btn" title="Sol ve sağ düğmeyle tıklayın"><span>🖱</span><small>${flow.btnMsg || 'Sol ve sağ düğmeyle tıklayarak deneyin'}</small></div></div></section>`;
    } else if (page === 'network') {
      h += `<section>${toggle('airplane', s.airplane, '✈ Uçak modu')}<p class="st-note">Uçak modu Wi-Fi ve Bluetooth'u birlikte kapatır. Uçakta ya da yanlışlıkla açılırsa internet kesilir.</p>${toggle('wifi', s.wifi, 'Wi-Fi')}`;
      if (s.wifi) {
        h += `<div class="st-list">${NETWORKS.map((n) => {
          const con = s.network === n.name;
          const open = flow.net === n.name;
          return `<div class="st-item net ${con ? 'con' : ''}" data-net="${esc(n.name)}"><span>${'📶'}</span><div><b>${esc(n.name)}</b><small>${con ? 'Bağlı, güvenli' : n.lock ? '🔒 Güvenli' : '⚠ Açık ağ (güvenli değil)'}</small></div>
            ${con ? '<button type="button" class="st-btn" data-act="disconnect">Bağlantıyı kes</button>' : open ? '' : '<button type="button" class="st-btn" data-act="pick">Bağlan</button>'}
            ${open && !con ? `<div class="st-pass">${n.lock ? `<label>Ağ güvenlik anahtarını (şifreyi) girin:<input type="password" class="st-pw" autocomplete="off"></label><button type="button" class="st-btn primary" data-act="connect">İleri</button>` : `<p class="st-warn">⚠ Bu ağa bağlanan herkes, gönderdiğiniz bilgileri görebilir. Bankacılık işlemi yapmayın.</p><button type="button" class="st-btn primary" data-act="connect">Yine de bağlan</button>`}<button type="button" class="st-btn" data-act="cancelNet">İptal</button><div class="st-err">${flow.netErr || ''}</div></div>` : ''}</div>`;
        }).join('')}</div>`;
      }
      h += '</section>';
    } else if (page === 'personal') {
      // Mağaza'dan indirilmemiş temalar ve resimleri listede görünmez
      const themes = Object.entries(THEMES).filter(([k, th]) => !th.store || s.themes.includes(k));
      const walls = Object.entries(WALLPAPERS).filter(([k, w]) => !w[3] || s.themes.includes(k));
      const mini = (wall, acc, dark) => `<span class="st-mini" style="background:${wall}"><i style="background:${dark ? '#202020' : '#eef2f7'}"><b style="background:${acc}"></b></i></span>`;
      h += `<section><h3>Temalar</h3><p class="st-note">Tema; arka planı, vurgu rengini ve açık/koyu modu birlikte değiştirir.</p>
        <div class="st-preview st-prevdesk" style="background:${desk.wallCss()}"><i class="${s.dark ? 'dark' : ''}"><b style="background:${s.accent}"></b></i></div>
        <p>Geçerli tema: <b>${s.theme === 'custom' ? 'Özel' : esc(THEMES[s.theme]?.name || '')}</b></p>
        <div class="st-themes">${themes.map(([k, th]) => `<button type="button" data-theme="${k}" class="${s.theme === k ? 'on' : ''}">${mini(WALLPAPERS[th.wall][1], th.accent, th.dark)}<span>${th.name}</span></button>`).join('')}</div>
        <button type="button" class="st-btn" data-act="moreThemes">🛍 Mağaza'dan daha fazla tema alın</button></section>
        <section><h3>Arka plan</h3>
        <p>Bir resim seçin:</p><div class="st-walls">${walls.map(([k, [n, css]]) => `<button type="button" data-wall="${k}" title="${n}" class="${s.wallpaper === k ? 'on' : ''}" style="background:${css}"><span>${n}</span></button>`).join('')}</div>
        <button type="button" class="st-btn" data-act="browseWall">🖼 Fotoğraflara göz atın…</button></section>
        <section><h3>Renkler</h3>${toggle('dark', s.dark, 'Koyu mod (pencere başlıkları, görev çubuğu ve Windows uygulamaları koyu renk olur)')}
        ${toggle('transparency', s.transparency, 'Saydamlık efektleri (Başlat menüsü ve görev çubuğu yarı saydam)')}
        <p>Vurgu rengi <small class="st-note">(Başlat düğmesi, seçili düğmeler, açık programın görev çubuğundaki çizgisi)</small></p>
        <div class="st-accents">${ACCENTS.map(([n, c]) => `<button type="button" data-accent="${c}" title="${n}" class="${s.accent === c ? 'on' : ''}" style="background:${c}"></button>`).join('')}</div>
        ${toggle('accentBars', s.accentBars, 'Vurgu rengini Başlat menüsünde ve görev çubuğunda göster')}
        ${toggle('accentTitle', s.accentTitle, 'Vurgu rengini başlık çubuklarında göster')}</section>
        <section><h3>Görev çubuğu</h3>${toggle('taskbarLeft', s.taskbarLeft, 'Görev çubuğu simgelerini sola hizala (eski Windows gibi)')}</section>`;
    } else if (page === 'apps') {
      const list = [...BUILTIN, ...s.installed];
      h += `<section><h3>Yüklü uygulamalar</h3><div class="st-list">${list.map((a) => `<div class="st-item"><span>${APPS[a].icon}</span><b>${APPS[a].name}</b><small>${s.installed.includes(a) ? 'Örnek Yazılım A.Ş. · 48 MB' : 'Windows ile gelir'}</small>
          ${s.installed.includes(a) ? `<button type="button" class="st-btn" data-act="uninstall" data-app="${a}">Kaldır</button>` : ''}</div>`).join('')}</div>
        ${flow.uninstall || ''}</section>`;
    } else if (page === 'accounts') {
      const f = flow.acc;
      h += `<section><h3>Hesabınız</h3><div class="st-item"><span>👤</span><div><b>${esc(s.user)}</b><small>Yerel hesap · Yönetici</small></div></div>
        <p class="st-note">Bilgisayar açılırken ve kilitliyken sizden <b>şifre</b> ya da kısa bir <b>PIN</b> (rakamlardan oluşan şifre) istenir. Başkaları sizin yokluğunuzda bilgilerinize bakamaz.</p></section>
        <section><h3>Oturum açma seçenekleri</h3>
        <div class="st-item"><span>🔑</span><div><b>Şifre</b><small>Harf, rakam ve işaretlerden oluşur</small></div><button type="button" class="st-btn" data-act="accPw">Değiştir</button></div>
        <div class="st-item"><span>🔢</span><div><b>PIN</b><small>${s.pin ? 'Ayarlandı (' + s.pin.length + ' hane)' : 'Ayarlanmadı: 4–6 rakam'}</small></div><button type="button" class="st-btn" data-act="accPin">${s.pin ? 'Değiştir' : 'Ekle'}</button></div>
        ${f === 'pw' ? `<div class="st-pass"><label>Şu anki şifre <input type="password" class="st-a1" autocomplete="off"></label><label>Yeni şifre <input type="password" class="st-a2" autocomplete="off"></label><label>Yeni şifre (tekrar) <input type="password" class="st-a3" autocomplete="off"></label>
          <button type="button" class="st-btn primary" data-act="accPwSave">Kaydet</button><button type="button" class="st-btn" data-act="accCancel">İptal</button><div class="st-err">${flow.accErr || ''}</div></div>` : ''}
        ${f === 'pin' ? `<div class="st-pass"><label>Yeni PIN (4–6 rakam) <input type="password" class="st-a1" inputmode="numeric" maxlength="6" autocomplete="off"></label><label>PIN (tekrar) <input type="password" class="st-a2" inputmode="numeric" maxlength="6" autocomplete="off"></label>
          <button type="button" class="st-btn primary" data-act="accPinSave">Kaydet</button><button type="button" class="st-btn" data-act="accCancel">İptal</button><div class="st-err">${flow.accErr || ''}</div></div>` : ''}</section>
        <section><h3>Ekranı kilitle</h3><p class="st-note">Yerinizden kalkarken ekranı kilitleyin; açık işleriniz yerinde kalır. Kısayolu: ${'<b>⊞ Windows</b> + <b>L</b>'}.</p><button type="button" class="st-btn primary" data-act="accLock">🔒 Şimdi kilitle</button></section>
        <section><h3>Diğer kullanıcılar</h3><p class="st-note">Bilgisayarı başkaları da kullanıyorsa onlara <b>ayrı hesap</b> açılır: kendi masaüstleri, kendi dosyaları olur, sizinkini göremezler. Kısa süreli kullanım için <b>Misafir</b> hesabı, torunlar için <b>çocuk hesabı</b> uygundur.</p></section>`;
    } else if (page === 'time') {
      const d = desk.now();
      h += `<section><div class="st-clock">${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}<small>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
        ${toggle('autoTime', s.autoTime, 'Saati otomatik olarak ayarla')}
        <div class="st-row">Tarih ve saati el ile ayarla <button type="button" class="st-btn" data-act="manualTime" ${s.autoTime ? 'disabled' : ''}>Değiştir</button></div>
        ${flow.time || ''}
        <label class="st-row">Saat dilimi <select data-act="tz">${ZONES.map(([z]) => `<option ${z === s.tz ? 'selected' : ''}>${z}</option>`).join('')}</select></label>
        ${toggle('time24', s.time24 !== false, '24 saatlik biçim (14:05); kapalıysa 02:05 ÖS gibi')}</section>
        <section><h3>Dil ve klavye</h3><p class="st-note">Yazı yazarken hangi klavye düzeninin kullanıldığını sağ alttaki <b>TUR</b> ya da <b>ENG</b> yazısı gösterir. Düzeni değiştirmek için yazıya tıklayın ya da klavyeden <kbd>Alt</kbd> + <kbd>Shift</kbd> tuşlarına basın.</p>
        <div class="st-list">${s.kbList.map((id) => `<div class="st-item"><span>⌨</span><div><b>${KB[id][1]}</b><small>${KB[id][0]}${s.kbLayout === id ? ' · şu an kullanılan' : ''}</small></div>${s.kbLayout === id ? '' : `<button type="button" class="st-btn" data-act="kbUse" data-id="${id}">Kullan</button>`}${s.kbList.length > 1 ? `<button type="button" class="st-btn" data-act="kbDel" data-id="${id}">Kaldır</button>` : ''}</div>`).join('')}</div>
        <label class="st-row">Klavye ekle <select data-act="kbAdd"><option value="">Seçin…</option>${Object.keys(KB).filter((id) => !s.kbList.includes(id)).map((id) => `<option value="${id}">${KB[id][1]}</option>`).join('')}</select></label></section>`;
    } else if (page === 'access') {
      h += `<section><h3>Metin boyutu</h3><div class="st-sample" style="font-size:${(flow.scale || s.textScale) / 100}em">Aa — Örnek yazı boyutu</div>
        <label class="st-row">Metin boyutu <input type="range" data-range="scaleDraft" min="100" max="150" step="10" value="${flow.scale || s.textScale}"><b>%${flow.scale || s.textScale}</b></label>
        <button type="button" class="st-btn primary" data-act="applyScale">Uygula</button></section>
        <section><h3>Fare işaretçisi</h3><p class="st-note">İmleci ekranda bulamıyor musunuz? Büyütüp renklendirin.</p>
        <div class="st-row">Boyut ${[['normal', 'Normal'], ['big', 'Büyük'], ['huge', 'Çok büyük']].map(([k, l]) => `<button type="button" class="st-btn${s.cursorSize === k ? ' primary' : ''}" data-cursize="${k}">${l}</button>`).join('')}</div>
        <div class="st-row">Renk ${[['white', 'Beyaz', '#fff'], ['black', 'Siyah', '#000'], ['yellow', 'Sarı', '#ffd600'], ['green', 'Yeşil', '#2e7d32']].map(([k, l, c]) => `<button type="button" class="st-btn st-swatch${s.cursorColor === k ? ' primary' : ''}" data-curcolor="${k}"><i style="background:${c}"></i>${l}</button>`).join('')}</div></section>
        <section><h3>Büyüteç</h3><p class="st-note">Ekranın bir bölümünü yakınlaştırır. Gerçek bilgisayarda ${'<b>⊞ Windows</b> + <b>artı (+)</b>'} ile açılır, ${'<b>⊞ Windows</b> + <b>Esc</b>'} ile kapanır.</p>
        ${toggle('magnifier', s.magnifier, 'Büyüteç')}
        <div class="st-row">Yakınlaştırma düzeyi <button type="button" class="st-btn" data-mag="-">−</button><b>%${s.magZoom}</b><button type="button" class="st-btn" data-mag="+">＋</button></div></section>
        <section><h3>⌨ Ekran klavyesi</h3><p class="st-note">Klavyesi bozuk olanlar ya da dokunmatik ekran kullananlar için: tuşlara fareyle tıklayarak yazılır.</p>
          <button type="button" class="st-btn" data-act="osk">Ekran klavyesini aç</button></section>`;
    } else if (page === 'update') {
      h += `<section><div class="st-upd">${flow.update || '✅ <b>Güncel durumdasınız</b><small>Son denetim: bugün</small>'}</div>
        ${flow.updateBtns ?? '<button type="button" class="st-btn primary" data-act="checkUpdate">Güncelleştirmeleri denetle</button>'}</section>`;
    }
    pg.innerHTML = h;
  }

  const go = (p) => { page = p; render(); emit('settings-page', { page }); };

  body.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.page) return go(b.dataset.page);
    if (b.dataset.cursize) { desk.setSetting('cursorSize', b.dataset.cursize); render(); emit('cursor-size', { size: b.dataset.cursize }); return; }
    if (b.dataset.curcolor) { desk.setSetting('cursorColor', b.dataset.curcolor); render(); emit('cursor-color', { color: b.dataset.curcolor }); return; }
    if (b.dataset.mag) { desk.setSetting('magZoom', Math.max(150, Math.min(400, s.magZoom + (b.dataset.mag === '+' ? 50 : -50)))); render(); emit('magnifier-zoom', { zoom: s.magZoom }); return; }
    if (b.dataset.theme) { desk.applyTheme(b.dataset.theme); render(); return; }
    if (b.dataset.accent) { desk.setSetting('accent', b.dataset.accent); render(); emit('accent', { color: b.dataset.accent, name: ACCENTS.find((a) => a[1] === b.dataset.accent)[0] }); return; }
    if (b.dataset.wall) { s.customWall = null; desk.setSetting('wallpaper', b.dataset.wall); render(); emit('wallpaper', { name: WALLPAPERS[b.dataset.wall][0], key: b.dataset.wall }); return; }
    const act = b.dataset.act;
    const netEl = b.closest('[data-net]');
    switch (act) {
      case 'accPw': flow.acc = 'pw'; flow.accErr = ''; render(); pg.querySelector('.st-a1')?.focus(); emit('acc-open', { what: 'pw' }); return;
      case 'accPin': flow.acc = 'pin'; flow.accErr = ''; render(); pg.querySelector('.st-a1')?.focus(); emit('acc-open', { what: 'pin' }); return;
      case 'accCancel': flow.acc = null; render(); return;
      case 'accPwSave': {
        const [cur, nu, again] = ['.st-a1', '.st-a2', '.st-a3'].map((q) => pg.querySelector(q).value);
        const err = cur !== s.password ? 'Şu anki şifre yanlış.' : nu.length < 4 ? 'Yeni şifre en az 4 karakter olmalı.' : nu === cur ? 'Yeni şifre eskisinden farklı olmalı.' : nu !== again ? 'İki yeni şifre aynı değil. Tekrar yazın.' : '';
        if (err) { flow.accErr = err; render(); emit('pw-change', { ok: false }); return; }
        s.password = nu;
        flow.acc = null;
        render();
        desk.toast('Şifre değişti', 'Bir sonraki girişte yeni şifrenizi kullanın.', '🔑');
        emit('pw-change', { ok: true, strength: strength(nu), length: nu.length });
        return;
      }
      case 'accPinSave': {
        const [a, b2] = ['.st-a1', '.st-a2'].map((q) => pg.querySelector(q).value);
        const err = !/^\d{4,6}$/.test(a) ? 'PIN yalnızca 4–6 rakamdan oluşmalı.' : a !== b2 ? 'İki PIN aynı değil. Tekrar yazın.' : /^(\d)\1+$|^1234|^0123/.test(a) ? 'Çok kolay tahmin edilir (1111, 1234 gibi). Başka bir PIN seçin.' : '';
        if (err) { flow.accErr = err; render(); emit('pin-set', { ok: false }); return; }
        s.pin = a;
        flow.acc = null;
        render();
        desk.toast('PIN ayarlandı', 'Artık PIN ile de giriş yapabilirsiniz.', '🔢');
        emit('pin-set', { ok: true, length: a.length });
        return;
      }
      case 'accLock': desk.lockScreen('settings'); return;
      case 'kbUse': desk.setKbLayout(b.dataset.id, 'settings'); render(); return;
      case 'kbDel': {
        const id = b.dataset.id;
        s.kbList = s.kbList.filter((x) => x !== id);
        if (s.kbLayout === id) s.kbLayout = s.kbList[0];
        desk.applySettings();
        render();
        emit('kb-remove', { layout: id });
        return;
      }
      case 'btAdd':
        flow.bt = 'search';
        render();
        emit('bt-search');
        await wait(2000);
        flow.bt = 'list';
        render();
        emit('bt-found');
        return;
      case 'btPair': {
        const d = BT_DEVICES.find((x) => x.name === b.dataset.n);
        if (d.unknown) {
          const ans = await dialogs.ask({ title: 'Bağlanılsın mı?', icon: '❓', text: `<b>${esc(d.name)}</b> adlı cihazı tanımıyorsunuz. Bilmediğiniz cihazlarla eşleşmek, yabancıların bilgisayarınıza bağlanmasına yol açabilir.`, buttons: [['yes', 'Yine de bağlan'], ['no', 'Vazgeç', true]] });
          emit('bt-unknown', { answer: ans });
          if (ans !== 'yes') return;
        }
        flow.bt = 'pairing';
        render();
        await progress(pg.querySelector('.st-prog'), 2000, `${d.name} ile eşleşiliyor…`);
        flow.bt = null;
        s.btDevices.push(d.name);
        render();
        desk.toast('Cihaz bağlandı', `${d.icon} ${esc(d.name)}`, '🔵');
        emit('bt-pair', { name: d.name, audio: !!d.audio, unknown: !!d.unknown });
        return;
      }
      case 'btRemove':
        s.btDevices = s.btDevices.filter((n) => n !== b.dataset.n);
        render();
        emit('bt-remove', { name: b.dataset.n });
        return;
      case 'osk': desk.open('osk'); return;
      case 'moreThemes': desk.open('store', { page: 'themes' }); emit('more-themes'); return;
      case 'soundTest': {
        const t = playTune(desk, [523, 659, 784]);
        emit('sound-test', { audible: t > 0, volume: s.volume, muted: s.muted });
        if (!t) desk.toast('Ses kapalı', 'Ses kapalı ya da çok kısık olduğu için duyulmadı.', '🔇');
        return;
      }
      case 'addPrinter':
        flow.printer = '<div class="st-searching"><span class="spin"></span> Yazıcılar aranıyor…</div>';
        render();
        emit('printer-search');
        await wait(2200);
        flow.printer = `<div class="st-list"><div class="st-item"><span>🖨</span><div><b>${NEW_PRINTER}</b><small>Ağda bulundu</small></div><button type="button" class="st-btn primary" data-act="addThis">Cihaz ekle</button></div></div>`;
        render();
        emit('printer-found', { name: NEW_PRINTER });
        return;
      case 'addThis': {
        flow.printer = '<div class="st-prog"></div>';
        render();
        emit('printer-adding');
        await progress(pg.querySelector('.st-prog'), 2600, 'Sürücü yükleniyor… (yazıcının bilgisayarla konuşmasını sağlayan küçük program)');
        flow.printer = null;
        if (!s.printers.includes(NEW_PRINTER)) s.printers.push(NEW_PRINTER);
        render();
        desk.toast('Yazıcı hazır', `${NEW_PRINTER} kullanıma hazır.`, '🖨');
        emit('printer-add', { name: NEW_PRINTER });
        return;
      }
      case 'testPrint':
        desk.toast('Yazdırılıyor', 'Test sayfası yazıcıya gönderildi.', '🖨');
        emit('print', { printer: NEW_PRINTER, doc: 'Test sayfası', copies: 1 });
        return;
      case 'pick': flow.net = netEl.dataset.net; flow.netErr = ''; render(); pg.querySelector('.st-pw')?.focus(); emit('wifi-pick', { name: flow.net }); return;
      case 'cancelNet': flow.net = null; render(); return;
      case 'connect': {
        const n = NETWORKS.find((x) => x.name === flow.net);
        const pw = pg.querySelector('.st-pw')?.value ?? '';
        if (n.lock && pw !== n.pass) {
          flow.netErr = pw ? 'Şifre yanlış. Modemin altındaki etiketi kontrol edin.' : 'Lütfen şifreyi yazın.';
          render();
          pg.querySelector('.st-pw')?.focus();
          emit('wifi-connect', { name: n.name, ok: false });
          return;
        }
        s.network = n.name;
        if (!s.knownNetworks.includes(n.name)) s.knownNetworks.push(n.name);
        flow.net = null;
        desk.applySettings();
        render();
        emit('wifi-connect', { name: n.name, ok: true, open: !n.lock });
        return;
      }
      case 'disconnect': { const name = s.network; s.network = null; desk.applySettings(); render(); emit('wifi-disconnect', { name }); return; }
      case 'browseWall': {
        const api = desk.fs.dialogApi();
        const r = await dialogs.file({ mode: 'open', fs: api, folder: 'pictures', ext: '.jpg', accept: /\.(png|jpe?g)$/i, typeLabel: 'Resimler (*.jpg; *.png)' });
        if (!r) return;
        const n = desk.fs.find(r.folder, r.name);
        if (!n) return;
        s.customWall = pictureURL(n.content);
        desk.setSetting('wallpaper', 'custom');
        render();
        emit('wallpaper', { name: n.name, custom: true });
        return;
      }
      case 'uninstall': {
        const a = b.dataset.app;
        const ans = await dialogs.ask({ title: 'Kaldır', icon: APPS[a].icon, text: `<b>${APPS[a].name}</b> ve ilgili bilgileri kaldırılacak.`, buttons: [['yes', 'Kaldır', true], ['no', 'İptal']] });
        if (ans !== 'yes') return;
        flow.uninstall = '<div class="st-prog"></div>';
        render();
        await progress(pg.querySelector('.st-prog'), 1800, 'Kaldırılıyor…');
        flow.uninstall = null;
        s.installed = s.installed.filter((x) => x !== a);
        for (const n of desk.fs.children('desktop')) if (n.type === 'link' && n.app === a) desk.fs.purge(n.id);
        for (const w of desk.wins.filter((x) => x.app === a)) desk.destroy(w);
        render();
        emit('uninstall', { app: a, name: APPS[a].name });
        return;
      }
      case 'manualTime': {
        const d = desk.now();
        const p2 = (n) => String(n).padStart(2, '0');
        flow.time = `<div class="st-time"><input type="date" class="st-d" value="${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}"><input type="time" class="st-t" value="${p2(d.getHours())}:${p2(d.getMinutes())}"><button type="button" class="st-btn primary" data-act="setTime">Değiştir</button></div>`;
        render();
        return;
      }
      case 'setTime': {
        const dv = pg.querySelector('.st-d').value, tv = pg.querySelector('.st-t').value;
        const t = new Date(`${dv}T${tv}:00`);
        if (isNaN(t)) return;
        s.timeOffset = t - Date.now();
        flow.time = null;
        desk.applySettings();
        render();
        emit('time-set', { hours: t.getHours(), minutes: t.getMinutes() });
        return;
      }
      case 'applyScale':
        desk.setSetting('textScale', flow.scale || s.textScale);
        render();
        emit('text-scale', { value: s.textScale });
        return;
      case 'checkUpdate':
        flow.update = '<span class="spin"></span> Güncelleştirmeler denetleniyor…';
        flow.updateBtns = '';
        render();
        emit('update-check');
        await wait(2000);
        if (s.unknownDevice) {
          flow.update = '⬇ <b>Güncelleştirmeler var</b><small>İsteğe bağlı güncelleştirme: <b>Ses kartı sürücüsü</b> (Yüksek Tanımlı Ses Aygıtı)</small>';
          flow.updateBtns = '<button type="button" class="st-btn primary" data-act="installDriver">İndir ve yükle</button>';
        } else {
          flow.update = null; flow.updateBtns = null;
        }
        render();
        return;
      case 'installDriver':
        flow.update = '<div class="st-prog"></div>';
        flow.updateBtns = '';
        render();
        await progress(pg.querySelector('.st-prog'), 2400, 'Ses kartı sürücüsü indiriliyor ve yükleniyor…');
        s.unknownDevice = false;
        flow.update = '✅ <b>Güncel durumdasınız</b><small>Ses kartı sürücüsü yüklendi.</small>';
        flow.updateBtns = null;
        render();
        desk.wins.filter((w) => w.app === 'devmgr').forEach((w) => w.api.render?.());
        emit('driver-update', { via: 'update' });
        return;
    }
  });

  // Çift tıklama ve düğme testi: eşik süresi “çift tıklama hızı” ayarından gelir
  let lastClick = 0;
  body.addEventListener('mousedown', (e) => {
    const box = e.target.closest('[data-test]');
    if (!box) return;
    if (box.dataset.test === 'btn') {
      const left = e.button === 0;
      const role = left !== !!s.swapButtons ? 'tık' : 'sağ tık';
      flow.btnMsg = `${left ? 'Sol' : 'Sağ'} düğmeye bastınız → ${role === 'tık' ? 'seçme (normal tık)' : 'menü (sağ tık)'} sayılır`;
      box.querySelector('small').textContent = flow.btnMsg;
      emit('mouse-test', { button: left ? 'left' : 'right', role });
      return;
    }
    if (e.button !== 0 && !s.swapButtons) return;
    const now = performance.now(), gap = now - lastClick, limit = dblLimit(s.dblSpeed);
    lastClick = now;
    if (gap > limit) { flow.dbl = false; box.querySelector('span').textContent = '📁'; box.querySelector('small').textContent = 'Seçildi; açılmadı. İkinci tıklama ' + Math.round(limit / 100) / 10 + ' sn içinde olmalı.'; return; }
    flow.dbl = !flow.dbl;
    lastClick = 0;
    box.querySelector('span').textContent = flow.dbl ? '📂' : '📁';
    box.querySelector('small').textContent = flow.dbl ? 'Açıldı! Çift tıklama algılandı.' : 'Kapandı.';
    emit('dbl-test', { gap: Math.round(gap), speed: s.dblSpeed });
  });
  body.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-test]')) e.preventDefault(); });
  body.addEventListener('input', (e) => {
    const r = e.target.dataset.range;
    if (r === 'scaleDraft') { flow.scale = +e.target.value; e.target.nextElementSibling.textContent = '%' + flow.scale; pg.querySelector('.st-sample').style.fontSize = flow.scale / 100 + 'em'; return; }
    if (r === 'dblSpeed') emit('dbl-speed', { speed: +e.target.value });
    if (r) { desk.setSetting(r, +e.target.value); e.target.nextElementSibling.textContent = e.target.value; if (r === 'volume' && s.muted) { desk.setSetting('muted', false); render(); } }
  });
  body.addEventListener('change', (e) => {
    const k = e.target.dataset.key;
    if (k) {
      desk.setSetting(k, e.target.checked);
      if (k === 'wifi') { s.network = e.target.checked ? null : null; flow.net = null; desk.applySettings(); }
      if (k === 'bluetooth') { flow.bt = null; if (!e.target.checked) desk.setSetting('btDevices', []); }
      if (k === 'airplane') desk.setAirplane(e.target.checked);
      if (k === 'autoTime' && e.target.checked) { s.timeOffset = 0; flow.time = null; desk.applySettings(); }
      render();
      emit('toggle', { key: k, on: e.target.checked });
    }
    if (e.target.dataset.act === 'primaryBtn') {
      desk.setSetting('swapButtons', e.target.value === 'right');
      render();
      emit('primary-button', { value: e.target.value });
    }
    if (e.target.dataset.act === 'kbAdd' && e.target.value) {
      s.kbList.push(e.target.value);
      emit('kb-add', { layout: e.target.value });
      render();
      return;
    }
    if (e.target.dataset.act === 'tz') {
      const old = ZONES.find(([z]) => z === s.tz)[1], nu = ZONES.find(([z]) => z === e.target.value)[1];
      s.tz = e.target.value;
      s.timeOffset += (nu - old) * 3600e3;
      desk.applySettings();
      render();
      emit('tz', { tz: s.tz });
    }
  });

  render();
  // Doğrudan bir sayfayla açıldıysa (ör. saate sağ tık → Tarih ve saati ayarla) sayfa açıldı olayı da gitsin
  if (args.page) setTimeout(() => emit('settings-page', { page }), 0);
  return {
    onArgs: (a) => { if (a.page) go(a.page); },
    onSettings: () => { if (!pg.contains(document.activeElement) || document.activeElement.type !== 'range') render(); },
    go,
  };
}
