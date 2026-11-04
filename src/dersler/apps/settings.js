// Ayarlar (Windows 11): ses ve parlaklık, yazıcılar, Wi-Fi, temalar, arka plan, vurgu rengi, yüklü uygulamalar, saat, yazı boyutu, güncelleştirmeler.
// Görünüm: sol gezinti (kullanıcı kartı, "Bir ayar bul" arama kutusu, renkli simgeler), sağda sayfa başlığı ve yuvarlak köşeli ayar kartları.
// Ders olayları, sayfa adları (system, devices, network, personal, apps, accounts, time, access, update) ve [data-page] düğmeleri eskisi gibidir.
import { esc, pictureURL, progress, wait, playTune } from './util.js';
import { WALLPAPERS, THEMES, ACCENTS } from '../desktop.js';
import { APPS } from './index.js';
import { strength } from '../lessons/scenes.js';
import { KB } from '../keymap.js';
import { HOTSPOT, online } from './modem.js';
import { SYS_ICONS as SI } from './appicons.js';
import { NAV, MI, wifiBars } from './w11-simge.js';

const PAGES = [
  ['system', 'Sistem'],
  ['devices', 'Bluetooth ve cihazlar'],
  ['network', 'Ağ ve internet'],
  ['personal', 'Kişiselleştirme'],
  ['apps', 'Uygulamalar'],
  ['accounts', 'Hesaplar'],
  ['time', 'Saat ve dil'],
  ['gaming', 'Oyun'],
  ['access', 'Erişilebilirlik'],
  ['privacy', 'Gizlilik ve güvenlik'],
  ['update', 'Windows Update'],
];
// Arama kutusu: [ad, sayfa, anahtar sözcükler]
const FIND = [
  ['Ekran ve parlaklık', 'system', 'ekran parlaklık ışık'], ['Ses', 'system', 'ses hoparlör ses düzeyi sessiz'], ['Hakkında', 'system', 'hakkında işlemci ram bellek bilgisayar adı windows sürümü'],
  ['Bilgisayarı yeniden adlandır', 'system', 'ad adlandır bilgisayar adı'],
  ['Bluetooth', 'devices', 'bluetooth kulaklık hoparlör eşleştir'], ['Yazıcılar ve tarayıcılar', 'devices', 'yazıcı tarayıcı yazdır'],
  ['Fare', 'devices', 'fare mouse çift tıklama düğme'], ['Cihaz ekle', 'devices', 'cihaz ekle'],
  ['Wi-Fi', 'network', 'wifi wi-fi kablosuz internet ağ şifre'], ['Uçak modu', 'network', 'uçak modu'], ['Ağ profili (Özel / Ortak)', 'network', 'ağ profili özel ortak'],
  ['Temalar', 'personal', 'tema'], ['Arka plan', 'personal', 'arka plan duvar kâğıdı resim'], ['Renkler (koyu mod, vurgu rengi)', 'personal', 'renk koyu mod vurgu saydamlık'],
  ['Görev çubuğu', 'personal', 'görev çubuğu hizala'],
  ['Yüklü uygulamalar', 'apps', 'uygulama program kaldır yüklü'],
  ['Parola', 'accounts', 'parola şifre'], ['PIN', 'accounts', 'pin'], ['Ekranı kilitle', 'accounts', 'kilit ekran'], ['Diğer kullanıcılar', 'accounts', 'kullanıcı hesap misafir aile'],
  ['Tarih ve saat', 'time', 'tarih saat saat dilimi'], ['Dil ve klavye', 'time', 'dil klavye türkçe f q düzen'],
  ['Oyun Modu', 'gaming', 'oyun'],
  ['Metin boyutu', 'access', 'metin yazı boyutu büyüt'], ['Fare işaretçisi', 'access', 'imleç işaretçi fare boyut renk'], ['Büyüteç', 'access', 'büyüteç yakınlaştır'], ['Ekran klavyesi', 'access', 'ekran klavyesi'],
  ['Windows Güvenliği', 'privacy', 'güvenlik virüs duvar'], ['Konum', 'privacy', 'konum'], ['Kamera', 'privacy', 'kamera'], ['Mikrofon', 'privacy', 'mikrofon'],
  ['Windows Update', 'update', 'güncelleme güncelleştirme update sürücü'],
];
export const NETWORKS = [
  { name: 'EvAğı', lock: true, pass: 'evagi2024', bars: 4 },
  { name: 'Komşu_5G', lock: true, pass: 'xq81!kk2', bars: 2 },
  { name: 'Kafe_Ücretsiz', lock: false, bars: 3 },
];
// Çift tıklama hızı 1 (yavaş) … 10 (hızlı): iki tıklama arası en çok kaç ms olabilir
export const dblLimit = (speed) => 900 - (speed - 1) * 70;
export const BT_DEVICES = [
  { name: 'Kablosuz Kulaklık K-30', icon: MI.headphones, audio: true },
  { name: 'Bluetooth Hoparlör Mini', icon: MI.speakerdev, audio: true },
  { name: 'Kablosuz Fare M-10', icon: MI.mouse },
  { name: 'TV-4F2A', icon: MI.question, unknown: true },
];
const NEW_PRINTER = 'Renkli Yazıcı R-200 (Ağ)';
const ZONES = [['İstanbul (UTC+3)', 3], ['Londra (UTC+0)', 0], ['Berlin (UTC+1)', 1], ['Bakü (UTC+4)', 4], ['New York (UTC-5)', -5]];
const BUILTIN = ['notepad', 'calc', 'paint', 'browser', 'store', 'photos', 'snip', 'mayin'];
const FOLDER_OPEN = MI.folderopen, FOLDER_SHUT = SI.folder;
const K = (...keys) => keys.map((k) => `<kbd>${k}</kbd>`).join(' + ');

export function settings({ desk, body, args, emit, dialogs }) {
  body.classList.add('ayr');
  const s = desk.settings;
  const pcName = () => s.pcName || 'MASAÜSTÜ-PC';
  const nets = () => [...NETWORKS, ...(desk.hotspot ? [HOTSPOT] : [])]; // telefonun erişim noktası açıksa onun ağı da görünür
  let page = args.page || 'system';
  body.innerHTML = `<nav class="ayr-nav" aria-label="Ayarlar gezinti">
      <div class="ayr-me"><span class="ayr-av">${NAV.user}</span><div><b>${esc(s.user)}</b><small>Yerel Hesap</small></div></div>
      <div class="ayr-find"><input type="search" class="ayr-q" placeholder="Bir ayar bul" aria-label="Bir ayar bul" autocomplete="off" spellcheck="false">${MI.search}<div class="ayr-fres" hidden></div></div>
      ${PAGES.map(([id, l]) => `<button type="button" data-page="${id}"><span class="ayr-ni">${NAV[id]}</span><span>${l}</span></button>`).join('')}
    </nav>
    <div class="ayr-main"><div class="ayr-top"><button type="button" class="ayr-hb" data-act="navToggle" aria-label="Gezinti menüsü" title="Menü">${MI.menu}</button><h2 class="ayr-title"></h2></div><div class="ayr-page"></div></div>`;
  const pg = body.querySelector('.ayr-page');
  const flow = { closed: {} }; // sayfa içi akışların durumu (yazıcı arama vb.); closed: kapatılmış açılır kartlar

  // ---- Kart parçaları ----
  const R = ({ ic = '', t, d = '', ctl = '', cls = '', attrs = '' }) => `<div class="ayr-row ${cls}" ${attrs}>${ic ? `<span class="ayr-ri">${ic}</span>` : ''}<div class="ayr-rt"><b>${t}</b>${d ? `<small>${d}</small>` : ''}</div>${ctl ? `<div class="ayr-rc">${ctl}</div>` : ''}</div>`;
  const tog = (key, on, t, d = '', ic = '') => `<label class="ayr-row ayr-tg">${ic ? `<span class="ayr-ri">${ic}</span>` : ''}<div class="ayr-rt"><b>${t}</b>${d ? `<small>${d}</small>` : ''}</div><span class="ayr-sw"><em>${on ? 'Açık' : 'Kapalı'}</em><input type="checkbox" data-key="${key}" ${on ? 'checked' : ''}><i></i></span></label>`;
  const slider = (key, val, min, max, t, ic, step = 1, shown = val) => `<label class="ayr-row"><span class="ayr-ri">${ic}</span><div class="ayr-rt"><b>${t}</b></div><div class="ayr-rc ayr-rng"><input type="range" data-range="${key}" min="${min}" max="${max}" step="${step}" value="${val}"><b>${shown}</b></div></label>`;
  const btn = (act, label, cls = '', extra = '') => `<button type="button" class="ayr-btn ${cls}" data-act="${act}" ${extra}>${label}</button>`;
  const grp = (t, inner) => `<section class="ayr-sec">${t ? `<h3 class="ayr-gh">${t}</h3>` : ''}${inner}</section>`;
  const exp = (key, ic, t, d, inner) => {
    const open = !flow.closed[key];
    return `<section class="ayr-exp${open ? ' open' : ''}"><button type="button" class="ayr-row ayr-eh" data-exp="${key}" aria-expanded="${open}"><span class="ayr-ri">${ic}</span><div class="ayr-rt"><b>${t}</b>${d ? `<small>${d}</small>` : ''}</div><span class="ayr-chev">${MI.chevdown}</span></button>${open ? `<div class="ayr-eb">${inner}</div>` : ''}</section>`;
  };
  const note = (h) => `<p class="ayr-note">${h}</p>`;
  const link = (act, label, extra = '') => `<button type="button" class="ayr-lnk" data-act="${act}" ${extra}>${label}</button>`;

  // Ağ profili: Özel (ev) ağda bilgisayar öteki cihazlara görünür; Ortak (kafe, hastane) ağda gizlenir.
  // İlk kez bağlanılan ağda soru sorulur (Windows 10'daki gibi); bağlıyken profil değiştirilebilir.
  const profs = () => (s.netProfiles ||= { EvAğı: 'ozel' });
  const profHtml = (n) => {
    const p = profs()[n.name];
    if (!p) return `<div class="ayr-sub ayr-prof"><p><b>Bu ağdaki başka cihazlar bilgisayarınızı görebilsin mi?</b></p><p class="ayr-note">Evinizde güvendiğiniz ağda <b>Evet</b>, kafe, hastane, otogar gibi herkese açık yerlerde <b>Hayır</b> deyin.</p>
      <div class="ayr-btns"><button type="button" class="ayr-btn" data-act="prof" data-v="ozel">Evet (Özel ağ)</button><button type="button" class="ayr-btn primary" data-act="prof" data-v="ortak">Hayır (Ortak ağ)</button></div></div>`;
    return `<div class="ayr-sub ayr-prof"><small>Ağ profili:</small>${[['ortak', 'Ortak ağ (önerilen)', 'Bilgisayarınız bu ağdaki öteki cihazlardan gizlenir'], ['ozel', 'Özel ağ', 'Yalnızca evdeki gibi güvendiğiniz ağlar için']].map(([k, l, d]) => `<button type="button" class="ayr-radio${p === k ? ' on' : ''}" data-act="prof" data-v="${k}" title="${d}" role="radio" aria-checked="${p === k}"><i></i>${l}</button>`).join('')}</div>`;
  };

  const title = () => PAGES.find((p) => p[0] === page)[1];

  function render() {
    body.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('on', b.dataset.page === page));
    body.querySelector('.ayr-title').textContent = title();
    let h = '';
    if (page === 'system') {
      const cur = s.network && s.wifi ? s.network : null;
      h += `<div class="ayr-hero"><span class="ayr-pc">${SI.pc}</span><div class="ayr-hn"><b>${esc(pcName())}</b><small>Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz</small>${link('rename', 'Yeniden adlandır')}</div>
          <div class="ayr-tiles">
            <button type="button" class="ayr-tile" data-goto="network"><span class="ayr-ri">${wifiBars(cur ? 4 : 1)}</span><div><b>Wi-Fi</b><small>${cur ? esc(cur) + ', bağlı' : 'Bağlı değil'}</small></div></button>
            <button type="button" class="ayr-tile" data-goto="update"><span class="ayr-ri">${NAV.update}</span><div><b>Windows Update</b><small>Güncelsiniz</small></div></button>
            <button type="button" class="ayr-tile" data-goto="devices"><span class="ayr-ri">${MI.bluetooth}</span><div><b>Bluetooth</b><small>${s.bluetooth ? 'Açık' : 'Kapalı'}</small></div></button>
          </div></div>`;
      h += grp('Ekran', `${slider('brightness', s.brightness, 20, 100, 'Parlaklık', MI.brightness)}`);
      h += grp('Ses', `${slider('volume', s.volume, 0, 100, 'Ses düzeyi', s.muted ? MI.vol0 : MI.vol2)}
        ${tog('muted', s.muted, 'Sesi kapat (sessiz)', 'Hoparlör ve kulaklıktan ses gelmez', MI.vol0)}
        ${R({ ic: MI.speak, t: 'Sesi dene', d: 'Kısa bir melodi çalar', ctl: btn('soundTest', 'Sesi dene') })}`);
      h += grp('Hakkında', `<div class="ayr-row ayr-ab"><span class="ayr-ri">${MI.info}</span><div class="ayr-rt"><b>Cihaz özellikleri</b>
        <dl class="ayr-about"><dt>Aygıt adı</dt><dd>${esc(pcName())}</dd><dt>İşlemci</dt><dd>Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz</dd><dt>Yüklü RAM</dt><dd>8,00 GB</dd><dt>Sistem türü</dt><dd>64 bit işletim sistemi</dd></dl></div></div>
        <div class="ayr-row ayr-ab"><span class="ayr-ri">${MI.monitor}</span><div class="ayr-rt"><b>Windows belirtimleri</b>
        <dl class="ayr-about"><dt>Sürüm</dt><dd><b>Windows 11 Home</b></dd><dt>Etkinleştirme</dt><dd>Windows etkinleştirildi</dd></dl></div></div>
        ${note(`Bu bilgiler, program alırken “en az 8 GB RAM” gibi gereksinimlerle karşılaştırmanız içindir. Kısa yol: ${K('<b>⊞ Windows</b>', 'R')} ve <b>winver</b> yazın.`)}`);
    } else if (page === 'devices') {
      const found = flow.bt === 'list' ? BT_DEVICES.filter((d) => !s.btDevices.includes(d.name)) : [];
      h += tog('bluetooth', s.bluetooth, 'Bluetooth', 'Kablosuz kulaklık, hoparlör ve fare bağlamak içindir. Kullanmadığınızda kapatın.', MI.bluetooth);
      h += grp('Cihazlar', `${s.btDevices.map((n) => { const d = BT_DEVICES.find((x) => x.name === n); return R({ ic: d.icon, t: esc(n), d: 'Bağlı', ctl: btn('btRemove', 'Kaldır', '', `data-n="${esc(n)}"`) }); }).join('')}
        ${!s.bluetooth ? R({ ic: MI.plus, t: 'Cihaz ekle', d: 'Cihaz eklemek için önce Bluetooth\'u açın.', cls: 'ayr-dim' })
          : flow.bt === 'search' ? R({ ic: '<span class="ayr-spin"></span>', t: 'Cihazlar aranıyor…', d: 'Cihazınızı açın ve yakına getirin' })
          : flow.bt === 'pairing' ? `<div class="ayr-row"><div class="ayr-rt"><div class="ayr-prog"></div></div></div>`
          : flow.bt === 'list' ? `${found.map((d) => R({ ic: d.icon, t: esc(d.name), d: d.unknown ? 'Bilinmeyen cihaz' : 'Eşleşmeye hazır', ctl: btn('btPair', 'Bağlan', 'primary', `data-n="${esc(d.name)}"`) })).join('')}`
          : R({ ic: MI.plus, t: 'Cihaz ekle', d: 'Bluetooth, kablosuz ekran, yuva ve daha fazlası', ctl: btn('btAdd', 'Cihaz ekle', 'primary') })}`);
      h += exp('printers', MI.printer, 'Yazıcılar ve tarayıcılar', 'Tercihler, sorun giderme', `${s.printers.map((p) => R({ ic: SI.printer, t: esc(p), ctl: p === NEW_PRINTER ? btn('testPrint', 'Test sayfası yazdır') : '' })).join('')}
        ${flow.printer ? `<div class="ayr-row ayr-flow">${flow.printer}</div>` : R({ ic: MI.plus, t: 'Yazıcı ya da tarayıcı ekle', ctl: btn('addPrinter', 'Cihaz ekle', 'primary') })}`);
      h += exp('mouse', MI.mouse, 'Fare', 'Fare düğmeleri, çift tıklama hızı', `<label class="ayr-row"><div class="ayr-rt"><b>Birincil fare düğmesi</b></div><div class="ayr-rc"><select data-act="primaryBtn"><option value="left" ${s.swapButtons ? '' : 'selected'}>Sol</option><option value="right" ${s.swapButtons ? 'selected' : ''}>Sağ</option></select></div></label>
        ${R({ t: 'Ek fare ayarları', d: 'Çift tıklama hızı bu sayfada değildir; <b>Fare Özellikleri</b> penceresindedir.', ctl: `<button type="button" class="ayr-btn" data-act="mouseProps">${MI.external} Ek fare ayarları</button>` })}
        ${flow.mprops ? `<div class="ayr-mp"><div class="ayr-mp-t">Fare Özellikleri</div>
          <div class="ayr-mp-tabs"><span class="on">Düğmeler</span><span>İşaretçiler</span><span>Tekerlek</span></div>
          <div class="ayr-mp-b">
            <label class="ayr-rng2">Çift tıklama hızı <small>(yavaş ↔ hızlı)</small> <input type="range" data-range="dblSpeed" min="1" max="10" value="${s.dblSpeed}"><b>${s.dblSpeed}</b></label>
            <p class="ayr-note">Çift tıklamakta zorlanıyorsanız hızı <b>yavaşlatın</b>: iki tıklama arasında daha fazla zaman tanınır.</p>
            <div class="ayr-dbl"><div class="ayr-dbl-box" data-test="dbl" title="Çift tıklayın"><span>${flow.dbl ? FOLDER_OPEN : FOLDER_SHUT}</span><small>${flow.dblMsg || 'Klasöre çift tıklayarak deneyin'}</small></div></div>
            <div class="ayr-mp-f">${btn('mousePropsOk', 'Tamam', 'primary')}</div>
          </div></div>` : ''}
        <div class="ayr-row ayr-flow"><div class="ayr-dbl"><div class="ayr-dbl-box" data-test="btn" title="Sol ve sağ düğmeyle tıklayın"><span>${MI.mouse}</span><small>${flow.btnMsg || 'Sol ve sağ düğmeyle tıklayarak deneyin'}</small></div></div></div>`);
    } else if (page === 'network') {
      h += tog('airplane', s.airplane, 'Uçak modu', 'Wi-Fi ve Bluetooth\'u birlikte kapatır. Uçakta ya da yanlışlıkla açılırsa internet kesilir.', MI.airplane);
      h += tog('wifi', s.wifi, 'Wi-Fi', 'Kablosuz ağlara bağlanın', MI.wifi);
      if (s.wifi) {
        h += grp('Kullanılabilir ağlar', nets().map((n) => {
          const con = s.network === n.name;
          const open = flow.net === n.name;
          const state = con ? (s.netSim && !online(desk) ? 'Bağlı, internet yok' : n.lock || n.phone ? 'Bağlı, güvenli' : 'Bağlı · Açık ağ (şifresiz)') : n.phone ? 'Telefon (mobil veri) · Güvenli' : n.lock ? 'Güvenli' : 'Açık ağ (güvenli değil)';
          return `<div class="ayr-net${con ? ' con' : ''}" data-net="${esc(n.name)}"><div class="ayr-row ${con ? 'con' : ''}"><span class="ayr-ri">${n.phone ? MI.hotspot : wifiBars(n.bars)}</span><div class="ayr-rt"><b>${esc(n.name)}</b><small>${n.lock || n.phone ? MI.lock : MI.warn} ${state}</small></div>
              <div class="ayr-rc">${con ? btn('disconnect', 'Bağlantıyı kes') : open ? '' : btn('pick', 'Bağlan')}</div></div>
            ${open && !con ? `<div class="ayr-sub ayr-pass">${n.lock ? `<label>Ağ güvenlik anahtarını (şifreyi) girin:<input type="password" class="ayr-pw" autocomplete="off"></label><div class="ayr-btns">${btn('connect', 'İleri', 'primary')}${btn('cancelNet', 'İptal')}</div>` : `<p class="ayr-warn">${MI.warn} Bu ağa bağlanan herkes, gönderdiğiniz bilgileri görebilir. Bankacılık işlemi yapmayın.</p><div class="ayr-btns">${btn('connect', 'Yine de bağlan', 'primary')}${btn('cancelNet', 'İptal')}</div>`}<div class="ayr-err">${flow.netErr || ''}</div></div>` : ''}
            ${con ? profHtml(n) : ''}</div>`;
        }).join(''));
      }
    } else if (page === 'personal') {
      // Mağaza'dan indirilmemiş temalar ve resimleri listede görünmez
      const themes = Object.entries(THEMES).filter(([k, th]) => !th.store || s.themes.includes(k));
      const walls = Object.entries(WALLPAPERS).filter(([k, w]) => !w[3] || s.themes.includes(k));
      const mini = (wall, acc, dark) => `<span class="ayr-tmini" style="background:${wall}"><i style="background:${dark ? '#202020' : '#eef2f7'}"><b style="background:${acc}"></b></i></span>`;
      h += `<div class="ayr-hero ayr-th"><div class="ayr-prev" style="background:${desk.wallCss()}"><span class="ayr-pwin ${s.dark ? 'dark' : ''}"><em></em><em></em></span><i class="${s.dark ? 'dark' : ''}"><b style="background:${s.accent}"></b></i></div>
          <div class="ayr-thr"><b>Bir tema seçin</b><small>Geçerli tema: <b>${s.theme === 'custom' ? 'Özel' : esc(THEMES[s.theme]?.name || '')}</b>. Tema; arka planı, vurgu rengini ve açık/koyu modu birlikte değiştirir.</small>
          <div class="st-themes ayr-themes">${themes.map(([k, th]) => `<button type="button" data-theme="${k}" class="${s.theme === k ? 'on' : ''}" aria-pressed="${s.theme === k}">${mini(WALLPAPERS[th.wall][1], th.accent, th.dark)}<span>${th.name}</span></button>`).join('')}</div>
          ${btn('moreThemes', `${MI.store} Mağaza'dan daha fazla tema alın`)}</div></div>`;
      h += exp('wall', MI.image, 'Arka plan', 'Arka plan resmi, bir resim seçin', `<div class="ayr-row ayr-flow"><div class="ayr-walls">${walls.map(([k, [n, css]]) => `<button type="button" data-wall="${k}" title="${n}" class="${s.wallpaper === k ? 'on' : ''}" style="background:${css}"><span>${n}</span></button>`).join('')}</div></div>
        ${R({ ic: MI.image, t: 'Bir fotoğraf seçin', d: 'Kendi resimlerinizden birini arka plan yapın', ctl: btn('browseWall', 'Fotoğraflara göz atın') })}`);
      h += exp('colors', MI.palette, 'Renkler', 'Koyu mod, vurgu rengi, saydamlık', `${tog('dark', s.dark, 'Koyu mod', 'Pencere başlıkları, görev çubuğu ve Windows uygulamaları koyu renk olur')}
        ${tog('transparency', s.transparency, 'Saydamlık efektleri', 'Başlat menüsü ve görev çubuğu yarı saydam olur')}
        <div class="ayr-row ayr-flow"><div class="ayr-rt"><b>Vurgu rengi</b><small>Başlat düğmesi, seçili düğmeler, açık programın görev çubuğundaki çizgisi</small>
          <div class="ayr-accents">${ACCENTS.map(([n, c]) => `<button type="button" data-accent="${c}" title="${n}" aria-label="${n}" class="${s.accent === c ? 'on' : ''}" style="background:${c}">${s.accent === c ? MI.check : ''}</button>`).join('')}</div></div></div>
        ${tog('accentBars', s.accentBars, 'Vurgu rengini Başlat menüsünde ve görev çubuğunda göster')}
        ${tog('accentTitle', s.accentTitle, 'Vurgu rengini başlık çubuklarında göster')}`);
      h += exp('taskbar', MI.taskbar, 'Görev çubuğu', 'Görev çubuğu davranışları', tog('taskbarLeft', s.taskbarLeft, 'Görev çubuğu simgelerini sola hizala', 'Eski Windows sürümlerindeki gibi'));
    } else if (page === 'apps') {
      const list = [...BUILTIN, ...s.installed];
      h += R({ ic: MI.list, t: 'Yüklü uygulamalar', d: 'Uygulamalarınızı arayın, kaldırın ya da taşıyın', cls: 'ayr-big' });
      h += grp('', `${list.map((a) => R({ ic: APPS[a].icon, t: APPS[a].name, d: s.installed.includes(a) ? 'Örnek Yazılım A.Ş. · 48 MB · 14.10.2026' : 'Microsoft Corporation · Windows ile gelir', ctl: s.installed.includes(a) ? btn('uninstall', 'Kaldır', '', `data-app="${a}"`) : '', cls: 'ayr-app' })).join('')}
        ${flow.uninstall ? `<div class="ayr-row ayr-flow">${flow.uninstall}</div>` : ''}`);
    } else if (page === 'accounts') {
      const f = flow.acc;
      h += `<div class="ayr-hero ayr-ac"><span class="ayr-bigav">${NAV.user}</span><div class="ayr-hn"><b>${esc(s.user)}</b><small>Yerel Hesap · Yönetici</small></div></div>
        ${note('Bilgisayar açılırken ve kilitliyken sizden <b>şifre</b> ya da kısa bir <b>PIN</b> (rakamlardan oluşan şifre) istenir. Başkaları sizin yokluğunuzda bilgilerinize bakamaz.')}`;
      h += grp('Oturum açma seçenekleri', `${R({ ic: MI.key, t: 'Parola', d: 'Harf, rakam ve işaretlerden oluşur', ctl: btn('accPw', 'Değiştir') })}
        ${f === 'pw' ? `<div class="ayr-row ayr-flow"><div class="ayr-sub ayr-pass"><label>Şu anki şifre <input type="password" class="ayr-a1" autocomplete="off"></label><label>Yeni şifre <input type="password" class="ayr-a2" autocomplete="off"></label><label>Yeni şifre (tekrar) <input type="password" class="ayr-a3" autocomplete="off"></label>
          <div class="ayr-btns">${btn('accPwSave', 'Kaydet', 'primary')}${btn('accCancel', 'İptal')}</div><div class="ayr-err">${flow.accErr || ''}</div></div></div>` : ''}
        ${R({ ic: MI.pin, t: 'PIN (Windows Hello)', d: s.pin ? 'Ayarlandı (' + s.pin.length + ' hane)' : 'Ayarlanmadı: 4–6 rakam', ctl: btn('accPin', s.pin ? 'Değiştir' : 'Ekle') })}
        ${f === 'pin' ? `<div class="ayr-row ayr-flow"><div class="ayr-sub ayr-pass"><label>Yeni PIN (4–6 rakam) <input type="password" class="ayr-a1" inputmode="numeric" maxlength="6" autocomplete="off"></label><label>PIN (tekrar) <input type="password" class="ayr-a2" inputmode="numeric" maxlength="6" autocomplete="off"></label>
          <div class="ayr-btns">${btn('accPinSave', 'Kaydet', 'primary')}${btn('accCancel', 'İptal')}</div><div class="ayr-err">${flow.accErr || ''}</div></div></div>` : ''}`);
      h += grp('Ekranı kilitle', R({ ic: MI.lock, t: 'Ekranı kilitle', d: `Yerinizden kalkarken ekranı kilitleyin; açık işleriniz yerinde kalır. Kısayolu: ${K('<b>⊞ Windows</b>', 'L')}`, ctl: btn('accLock', 'Şimdi kilitle', 'primary') }));
      h += grp('Diğer kullanıcılar', R({ ic: MI.family, t: 'Aile ve diğer kullanıcılar', d: 'Bilgisayarı başkaları da kullanıyorsa onlara <b>ayrı hesap</b> açılır: kendi masaüstleri, kendi dosyaları olur, sizinkini göremezler. Kısa süreli kullanım için <b>Misafir</b> hesabı, torunlar için <b>çocuk hesabı</b> uygundur.' }));
    } else if (page === 'time') {
      const d = desk.now();
      h += `<div class="ayr-hero ayr-clk"><b class="ayr-bigt">${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</b><small>${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>`;
      h += grp('Tarih ve saat', `${tog('autoTime', s.autoTime, 'Saati otomatik olarak ayarla', 'Bilgisayar saati internetten kendiliğinden düzeltir', MI.clock)}
        ${R({ ic: MI.calendar, t: 'Tarihi ve saati el ile ayarla', ctl: `<button type="button" class="ayr-btn" data-act="manualTime" ${s.autoTime ? 'disabled' : ''}>Değiştir</button>` })}
        ${flow.time ? `<div class="ayr-row ayr-flow">${flow.time}</div>` : ''}
        <label class="ayr-row"><span class="ayr-ri">${MI.globe}</span><div class="ayr-rt"><b>Saat dilimi</b></div><div class="ayr-rc"><select data-act="tz">${ZONES.map(([z]) => `<option ${z === s.tz ? 'selected' : ''}>${z}</option>`).join('')}</select></div></label>
        ${tog('time24', s.time24 !== false, '24 saatlik biçim', '14:05 gibi; kapalıysa 02:05 ÖS gibi')}`);
      h += grp('Dil ve klavye', `${note(`Yazı yazarken hangi klavye düzeninin kullanıldığını sağ alttaki <b>TUR</b> ya da <b>ENG</b> yazısı gösterir. Düzeni değiştirmek için yazıya tıklayın ya da klavyeden ${K('Alt', 'Shift')} tuşlarına basın.`)}
        ${s.kbList.map((id) => R({ ic: MI.keyboard, t: KB[id][1], d: `${KB[id][0]}${s.kbLayout === id ? ' · şu an kullanılan' : ''}`, ctl: `${s.kbLayout === id ? '' : btn('kbUse', 'Kullan', '', `data-id="${id}"`)}${s.kbList.length > 1 ? btn('kbDel', 'Kaldır', '', `data-id="${id}"`) : ''}` })).join('')}
        <label class="ayr-row"><span class="ayr-ri">${MI.language}</span><div class="ayr-rt"><b>Klavye ekle</b></div><div class="ayr-rc"><select data-act="kbAdd"><option value="">Seçin…</option>${Object.keys(KB).filter((id) => !s.kbList.includes(id)).map((id) => `<option value="${id}">${KB[id][1]}</option>`).join('')}</select></div></label>`);
    } else if (page === 'gaming') {
      h += grp('', `${tog('gameMode', !!s.gameMode, 'Oyun Modu', 'Oyun oynarken bilgisayarın arka plan işlerini azaltır, oyunun daha akıcı çalışmasına yardım eder', MI.gamepad)}
        ${tog('gameBar', s.gameBar !== false, 'Xbox Game Bar', 'Oyun sırasında kısayolla ses ve ekran kaydı denetimlerini açar', MI.gamepad)}`);
      h += note('Bu bölümdeki ayarlar alıştırma amaçlıdır; oyun oynamıyorsanız ellemenize gerek yoktur.');
    } else if (page === 'access') {
      h += grp('Metin boyutu', `<div class="ayr-row ayr-flow"><div class="ayr-sample" style="font-size:${(flow.scale || s.textScale) / 100}em">Aa — Örnek yazı boyutu</div></div>
        ${slider('scaleDraft', flow.scale || s.textScale, 100, 150, 'Metin boyutu', MI.textsize, 10, '%' + (flow.scale || s.textScale))}
        ${R({ t: 'Metin boyutunu uygula', ctl: btn('applyScale', 'Uygula', 'primary') })}`);
      h += grp('Fare işaretçisi', `${note('İmleci ekranda bulamıyor musunuz? Büyütüp renklendirin.')}
        ${R({ ic: MI.cursor, t: 'İşaretçi boyutu', ctl: `<div class="ayr-seg">${[['normal', 'Normal'], ['big', 'Büyük'], ['huge', 'Çok büyük']].map(([k, l]) => `<button type="button" class="ayr-btn${s.cursorSize === k ? ' primary' : ''}" data-cursize="${k}">${l}</button>`).join('')}</div>` })}
        ${R({ ic: MI.palette, t: 'İşaretçi rengi', ctl: `<div class="ayr-seg">${[['white', 'Beyaz', '#fff'], ['black', 'Siyah', '#000'], ['yellow', 'Sarı', '#ffd600'], ['green', 'Yeşil', '#2e7d32']].map(([k, l, c]) => `<button type="button" class="ayr-btn${s.cursorColor === k ? ' primary' : ''}" data-curcolor="${k}"><i class="ayr-dot" style="background:${c}"></i>${l}</button>`).join('')}</div>` })}`);
      h += grp('Büyüteç', `${tog('magnifier', s.magnifier, 'Büyüteç', `Ekranın bir bölümünü yakınlaştırır. Gerçek bilgisayarda ${K('<b>⊞ Windows</b>', '<b>artı (+)</b>')} ile açılır, ${K('<b>⊞ Windows</b>', 'Esc')} ile kapanır.`, MI.zoom)}
        ${R({ t: 'Yakınlaştırma düzeyi', ctl: `<div class="ayr-seg"><button type="button" class="ayr-btn" data-mag="-" aria-label="Azalt">−</button><b class="ayr-zv">%${s.magZoom}</b><button type="button" class="ayr-btn" data-mag="+" aria-label="Artır">+</button></div>` })}`);
      h += grp('Ekran klavyesi', R({ ic: MI.keyboard, t: 'Ekran klavyesi', d: 'Klavyesi bozuk olanlar ya da dokunmatik ekran kullananlar için: tuşlara fareyle tıklayarak yazılır.', ctl: btn('osk', 'Ekran klavyesini aç') }));
    } else if (page === 'privacy') {
      h += grp('Güvenlik', `${R({ ic: NAV.privacy, t: 'Windows Güvenliği', d: 'Virüs, güvenlik duvarı ve cihaz güvenliği ayarları', ctl: btn('openSec', 'Windows Güvenliği\'ni aç', 'primary') })}`);
      h += grp('Uygulama izinleri', `${tog('privLocation', s.privLocation !== false, 'Konum', 'Haritalar ve hava durumu gibi uygulamalar yerinizi öğrenebilir', MI.location)}
        ${tog('privCamera', s.privCamera !== false, 'Kamera', 'Uygulamaların kameraya erişmesine izin verin', MI.camera)}
        ${tog('privMic', s.privMic !== false, 'Mikrofon', 'Uygulamaların mikrofona erişmesine izin verin', MI.mic)}`);
      h += note('Kullanmadığınız uygulamaların kamera ve mikrofona erişimini kapatmak iyi bir alışkanlıktır.');
    } else if (page === 'update') {
      const checking = flow.checking, avail = flow.updAvail;
      h += `<div class="ayr-hero ayr-upd"><span class="ayr-uic">${checking ? '<span class="ayr-spin big"></span>' : avail ? MI.download : MI.ok}</span>
        <div class="ayr-hn"><b>${checking ? 'Güncelleştirmeler denetleniyor…' : avail ? 'Güncelleştirmeler var' : 'Güncelsiniz'}</b>${flow.update ? `<div class="ayr-ustat">${flow.update}</div>` : `<small>${avail ? 'İsteğe bağlı güncelleştirme: <b>Ses kartı sürücüsü</b> (Yüksek Tanımlı Ses Aygıtı)' : 'Son denetleme: bugün'}</small>`}</div>
        <div class="ayr-hb2">${flow.updateBtns ?? btn('checkUpdate', 'Güncelleştirmeleri denetle', 'primary')}</div></div>`;
      h += exp('hist', MI.history, 'Güncelleştirme geçmişi', 'Yüklenen güncelleştirmelerin listesi', `${R({ t: 'Windows güvenlik güncelleştirmesi', d: 'Başarıyla yüklendi · 12.10.2026' })}${R({ t: 'Microsoft Defender virüs tanımları', d: 'Başarıyla yüklendi · 14.10.2026' })}${R({ t: 'Aygıt sürücüsü güncelleştirmesi', d: 'Başarıyla yüklendi · 08.09.2025' })}`);
      h += note('Güncelleştirmeler, güvenlik açıklarını kapatır. Bilgisayarı kapatırken “güncelleştir ve kapat” çıkarsa ertelemeyin, kabul edin.');
    }
    pg.innerHTML = h;
  }

  // ---- Arama kutusu ----
  const norm = (t) => t.toLocaleLowerCase('tr').trim();
  const hits = (q) => { const t = norm(q); return t ? FIND.filter(([n, , k]) => norm(n + ' ' + k).includes(t)) : []; };
  const find = body.querySelector('.ayr-q'), fres = body.querySelector('.ayr-fres');
  const closeFind = () => { fres.hidden = true; };
  find.addEventListener('input', () => {
    const r = hits(find.value);
    fres.innerHTML = r.length ? r.map(([n, p], i) => `<button type="button" data-fp="${p}" data-fi="${i}"><b>${n}</b><small>${PAGES.find((x) => x[0] === p)[1]}</small></button>`).join('') : '<div class="ayr-fnone">Sonuç bulunamadı. Başka bir sözcük deneyin.</div>';
    fres.hidden = !find.value.trim();
    emit('settings-search', { q: find.value.trim() });
  });
  find.addEventListener('keydown', (e) => { if (e.key === 'Enter') fres.querySelector('[data-fp]')?.click(); if (e.key === 'Escape') { find.value = ''; closeFind(); } });
  find.addEventListener('blur', () => setTimeout(closeFind, 150));
  fres.addEventListener('mousedown', (e) => e.preventDefault());

  const go = (p) => { if (p !== page) flow.mprops = false; page = p; body.classList.remove('ayr-navopen'); render(); emit('settings-page', { page }); };

  body.addEventListener('click', async (e) => {
    const fp = e.target.closest('[data-fp]');
    if (fp) { find.value = ''; closeFind(); return go(fp.dataset.fp); }
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.page) return go(b.dataset.page);
    if (b.dataset.goto) return go(b.dataset.goto);
    if (b.dataset.exp) { flow.closed[b.dataset.exp] = !flow.closed[b.dataset.exp]; render(); return; }
    if (b.dataset.cursize) { desk.setSetting('cursorSize', b.dataset.cursize); render(); emit('cursor-size', { size: b.dataset.cursize }); return; }
    if (b.dataset.curcolor) { desk.setSetting('cursorColor', b.dataset.curcolor); render(); emit('cursor-color', { color: b.dataset.curcolor }); return; }
    if (b.dataset.mag) { desk.setSetting('magZoom', Math.max(150, Math.min(400, s.magZoom + (b.dataset.mag === '+' ? 50 : -50)))); render(); emit('magnifier-zoom', { zoom: s.magZoom }); return; }
    if (b.dataset.theme) { desk.applyTheme(b.dataset.theme); render(); return; }
    if (b.dataset.accent) { desk.setSetting('accent', b.dataset.accent); render(); emit('accent', { color: b.dataset.accent, name: ACCENTS.find((a) => a[1] === b.dataset.accent)[0] }); return; }
    if (b.dataset.wall) { s.customWall = null; desk.setSetting('wallpaper', b.dataset.wall); render(); emit('wallpaper', { name: WALLPAPERS[b.dataset.wall][0], key: b.dataset.wall }); return; }
    const act = b.dataset.act;
    const netEl = b.closest('[data-net]');
    switch (act) {
      case 'navToggle': body.classList.toggle('ayr-navopen'); return;
      case 'rename': {
        const r = await dialogs.form({ title: 'Bu bilgisayarı yeniden adlandırın', text: 'Bilgisayarınıza ağda görünecek bir ad verin. Harf, rakam ve tire kullanabilirsiniz.', icon: 'pc', fields: [{ name: 'ad', label: 'Bilgisayar adı:', value: pcName() }], ok: 'İleri', check: (v) => (!v.ad.trim() ? 'Bir ad yazın.' : /[^A-Za-z0-9ÇĞİÖŞÜçğıöşü-]/.test(v.ad.trim()) ? 'Ad yalnızca harf, rakam ve tire içerebilir (boşluk olmaz).' : '') });
        if (!r) return;
        s.pcName = r.ad.trim().toLocaleUpperCase('tr');
        render();
        emit('pc-rename', { name: s.pcName });
        return;
      }
      case 'openSec': desk.open('guvenlik'); return;
      case 'accPw': flow.acc = 'pw'; flow.accErr = ''; render(); pg.querySelector('.ayr-a1')?.focus(); emit('acc-open', { what: 'pw' }); return;
      case 'accPin': flow.acc = 'pin'; flow.accErr = ''; render(); pg.querySelector('.ayr-a1')?.focus(); emit('acc-open', { what: 'pin' }); return;
      case 'accCancel': flow.acc = null; render(); return;
      case 'mouseProps': flow.mprops = true; render(); emit('mouse-props', { open: true }); return;
      case 'mousePropsOk': flow.mprops = false; render(); emit('mouse-props', { open: false }); return;
      case 'accPwSave': {
        const [cur, nu, again] = ['.ayr-a1', '.ayr-a2', '.ayr-a3'].map((q) => pg.querySelector(q).value);
        const err = cur !== s.password ? 'Şu anki şifre yanlış.' : nu.length < 4 ? 'Yeni şifre en az 4 karakter olmalı.' : nu === cur ? 'Yeni şifre eskisinden farklı olmalı.' : nu !== again ? 'İki yeni şifre aynı değil. Tekrar yazın.' : '';
        if (err) { flow.accErr = err; render(); emit('pw-change', { ok: false }); return; }
        s.password = nu;
        flow.acc = null;
        render();
        desk.toast('Şifre değişti', 'Bir sonraki girişte yeni şifrenizi kullanın.', MI.key);
        emit('pw-change', { ok: true, strength: strength(nu), length: nu.length });
        return;
      }
      case 'accPinSave': {
        const [a, b2] = ['.ayr-a1', '.ayr-a2'].map((q) => pg.querySelector(q).value);
        const err = !/^\d{4,6}$/.test(a) ? 'PIN yalnızca 4–6 rakamdan oluşmalı.' : a !== b2 ? 'İki PIN aynı değil. Tekrar yazın.' : /^(\d)\1+$|^1234|^0123/.test(a) ? 'Çok kolay tahmin edilir (1111, 1234 gibi). Başka bir PIN seçin.' : '';
        if (err) { flow.accErr = err; render(); emit('pin-set', { ok: false }); return; }
        s.pin = a;
        flow.acc = null;
        render();
        desk.toast('PIN ayarlandı', 'Artık PIN ile de giriş yapabilirsiniz.', MI.pin);
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
          const ans = await dialogs.ask({ title: 'Bağlanılsın mı?', icon: 'warn', text: `<b>${esc(d.name)}</b> adlı cihazı tanımıyorsunuz. Bilmediğiniz cihazlarla eşleşmek, yabancıların bilgisayarınıza bağlanmasına yol açabilir.`, buttons: [['yes', 'Yine de bağlan'], ['no', 'Vazgeç', true]] });
          emit('bt-unknown', { answer: ans });
          if (ans !== 'yes') return;
        }
        flow.bt = 'pairing';
        render();
        await progress(pg.querySelector('.ayr-prog'), 2000, `${d.name} ile eşleşiliyor…`);
        flow.bt = null;
        s.btDevices.push(d.name);
        render();
        desk.toast('Cihaz bağlandı', esc(d.name), MI.bluetooth);
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
        if (!t) desk.toast('Ses kapalı', 'Ses kapalı ya da çok kısık olduğu için duyulmadı.', MI.vol0);
        return;
      }
      case 'addPrinter':
        flow.printer = '<span class="ayr-spin"></span> Yazıcılar aranıyor…';
        render();
        emit('printer-search');
        await wait(2200);
        flow.printer = `<div class="ayr-found"><span class="ayr-ri">${SI.printer}</span><div class="ayr-rt"><b>${NEW_PRINTER}</b><small>Ağda bulundu</small></div>${btn('addThis', 'Cihaz ekle', 'primary')}</div>`;
        render();
        emit('printer-found', { name: NEW_PRINTER });
        return;
      case 'addThis': {
        flow.printer = '<div class="ayr-prog"></div>';
        render();
        emit('printer-adding');
        await progress(pg.querySelector('.ayr-prog'), 2600, 'Sürücü yükleniyor… (yazıcının bilgisayarla konuşmasını sağlayan küçük program)');
        flow.printer = null;
        if (!s.printers.includes(NEW_PRINTER)) s.printers.push(NEW_PRINTER);
        render();
        desk.toast('Yazıcı hazır', `${NEW_PRINTER} kullanıma hazır.`, SI.printer);
        emit('printer-add', { name: NEW_PRINTER });
        return;
      }
      case 'testPrint':
        desk.toast('Yazdırılıyor', 'Test sayfası yazıcıya gönderildi.', SI.printer);
        emit('print', { printer: NEW_PRINTER, doc: 'Test sayfası', copies: 1 });
        return;
      case 'pick': flow.net = netEl.dataset.net; flow.netErr = ''; render(); pg.querySelector('.ayr-pw')?.focus(); emit('wifi-pick', { name: flow.net }); return;
      case 'cancelNet': flow.net = null; render(); return;
      case 'connect': {
        const n = nets().find((x) => x.name === flow.net);
        const pw = pg.querySelector('.ayr-pw')?.value ?? '';
        if (n.lock && pw !== n.pass) {
          flow.netErr = pw ? 'Şifre yanlış. Modemin altındaki etiketi kontrol edin.' : 'Lütfen şifreyi yazın.';
          render();
          pg.querySelector('.ayr-pw')?.focus();
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
      case 'prof': { const name = s.network; if (!name) return; profs()[name] = b.dataset.v; render(); emit('net-profile', { name, profile: b.dataset.v, open: !nets().find((x) => x.name === name)?.lock }); return; }
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
        flow.uninstall = '<div class="ayr-prog"></div>';
        render();
        await progress(pg.querySelector('.ayr-prog'), 1800, 'Kaldırılıyor…');
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
        flow.time = `<div class="ayr-time"><input type="date" class="ayr-d" value="${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}"><input type="time" class="ayr-t" value="${p2(d.getHours())}:${p2(d.getMinutes())}">${btn('setTime', 'Değiştir', 'primary')}</div>`;
        render();
        return;
      }
      case 'setTime': {
        const dv = pg.querySelector('.ayr-d').value, tv = pg.querySelector('.ayr-t').value;
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
        flow.checking = true;
        flow.update = null;
        flow.updateBtns = '';
        render();
        emit('update-check');
        await wait(2000);
        flow.checking = false;
        if (s.unknownDevice) {
          flow.updAvail = true;
          flow.updateBtns = btn('installDriver', 'İndir ve yükle', 'primary');
        } else {
          flow.updAvail = false; flow.updateBtns = null;
        }
        render();
        return;
      case 'installDriver':
        flow.update = '<div class="ayr-prog"></div>';
        flow.updateBtns = '';
        render();
        await progress(pg.querySelector('.ayr-prog'), 2400, 'Ses kartı sürücüsü indiriliyor ve yükleniyor…');
        s.unknownDevice = false;
        flow.updAvail = false;
        flow.update = 'Ses kartı sürücüsü yüklendi.';
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
    if (gap > limit) { flow.dbl = false; box.querySelector('span').innerHTML = FOLDER_SHUT; box.querySelector('small').textContent = 'Seçildi; açılmadı. İkinci tıklama ' + Math.round(limit / 100) / 10 + ' sn içinde olmalı.'; return; }
    flow.dbl = !flow.dbl;
    lastClick = 0;
    box.querySelector('span').innerHTML = flow.dbl ? FOLDER_OPEN : FOLDER_SHUT;
    box.querySelector('small').textContent = flow.dbl ? 'Açıldı! Çift tıklama algılandı.' : 'Kapandı.';
    emit('dbl-test', { gap: Math.round(gap), speed: s.dblSpeed });
  });
  body.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-test]')) e.preventDefault(); });
  body.addEventListener('input', (e) => {
    const r = e.target.dataset.range;
    if (r === 'scaleDraft') { flow.scale = +e.target.value; e.target.nextElementSibling.textContent = '%' + flow.scale; pg.querySelector('.ayr-sample').style.fontSize = flow.scale / 100 + 'em'; return; }
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
    mouseProps: (open) => { flow.mprops = open; render(); }, // Fare Özellikleri penceresini (Ek fare ayarları) açar / kapatır; ders kurulumu için
    onSettings: () => { if (!pg.contains(document.activeElement) || document.activeElement.type !== 'range') render(); },
    go,
  };
}
