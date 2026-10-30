// 8. hafta ek sitesi (uydurma): internet hız testi. İndirme / yükleme hızı (Mbps) ve gecikme (ping) ölçülür;
// sonuçların ne anlama geldiği sade bir dille yazılır.
// Modem yönetim sayfası (192.168.1.1): giriş (etiketteki yönetim şifresi), Durum, Kablosuz (Wi-Fi adı ve şifresi), ileri ayarlar.
// Wi-Fi şifresi yalnızca bu sitenin kendi içinde değişir; Ayarlar'daki gerçek Wi-Fi ağına dokunmaz.
import { HOTSPOT } from './modem.js';
import { esc } from './util.js';
import { strength } from '../lessons/scenes.js';

export const HIZ_HOST = 'www.hiztesti.com.tr';
const fmt = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });

const HIZ = {
  name: 'Hız Testi', secure: true,
  render(path, q, ctx) {
    const r = ctx.state.result;
    const res = r ? `<div class="ht-res"><div><small>⬇ İndirme</small><b>${fmt(r.down)}</b><span>Mbps</span></div><div><small>⬆ Yükleme</small><b>${fmt(r.up)}</b><span>Mbps</span></div><div><small>⏱ Gecikme (ping)</small><b>${r.ping}</b><span>ms</span></div></div>
      <p class="ht-via">Bağlantı: <b>${r.phone ? '📱 ' + HOTSPOT.name + ' (mobil veri)' : '📶 EvAğı (ev interneti)'}</b></p>
      <div class="ht-exp"><b>Ne demek?</b><ul><li><b>İndirme</b>: internetten size gelen hız. Görüntülü görüşme için 3 Mbps, film için 5 Mbps, çok net (4K) film için 25 Mbps yeter.</li>
        <li><b>Yükleme</b>: sizden internete giden hız (fotoğraf gönderme, görüntülü görüşmede kameranız).</li><li><b>Ping</b>: tepki süresi. Küçük olması iyidir; 100 ms'nin altı rahattır.</li></ul></div>
      <p><button type="button" class="ht-go small" data-act="start">⟳ Yeniden ölç</button></p>` : '';
    return { title: 'Hız Testi', html: `<div class="wp ht"><header class="ht-head">⚡ hiztesti<span>İnternet hızınızı ölçün</span></header>
      <div class="ht-main">${r ? res : '<button type="button" class="ht-go" data-act="start">BAŞLA</button><p class="ht-note">Ölçüm sırasında başka bir şey indirmeyin.</p>'}</div></div>` };
  },
  act(a, v, ctx, el) {
    if (a !== 'start' || ctx.state.running) return;
    ctx.state.running = true;
    const phone = ctx.desk.settings.network === HOTSPOT.name;
    const r = phone ? { down: 18.4, up: 6.2, ping: 41, phone } : { down: 48.7, up: 9.8, ping: 18, phone };
    const main = el.closest('.ht').querySelector('.ht-main');
    main.innerHTML = '<div class="ht-gauge"><b class="ht-num">0</b><span>Mbps</span><small class="ht-what">İndirme ölçülüyor…</small></div>';
    const num = main.querySelector('.ht-num'), what = main.querySelector('.ht-what');
    const t0 = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - t0) / 1000;
      if (!num.isConnected) { clearInterval(id); ctx.state.running = false; return; }
      if (t < 2.4) num.textContent = fmt(r.down * Math.min(1, t / 1.6) * (0.92 + Math.random() * 0.12));
      else if (t < 4) { what.textContent = 'Yükleme ölçülüyor…'; num.textContent = fmt(r.up * (0.9 + Math.random() * 0.15)); }
      else {
        clearInterval(id);
        ctx.state.running = false;
        ctx.state.result = r;
        ctx.refresh();
        ctx.emit('speed-test', { down: r.down, up: r.up, ping: r.ping, phone });
      }
    }, 120);
  },
};

// ---- Modem yönetim sayfası ----
export const MODEM_HOST = '192.168.1.1';
// Modemin altındaki etiket. Wi-Fi bilgileri Ayarlar'daki “EvAğı” ağıyla aynıdır.
export const MODEM_ETIKET = { ssid: 'EvAğı', wifi: 'evagi2024', user: 'admin', pass: 'Kp7mR4xZ' };
export const MODEM_CIHAZLAR = [['phone', '📱', 'Telefon'], ['tv', '📺', 'Televizyon'], ['tablet', '💻', 'Torunun tableti']];

const mpage = (title, html) => ({ title, html: `<div class="wp">${html}</div>` });
const mhead = '<header class="ed-head" style="background:#37474f;margin-bottom:0">📡 Modem Yönetimi<nav><span style="font-size:0.65em;font-weight:400">192.168.1.1</span></nav></header>';
const merr = (st, k) => (st.err?.[k] ? `<small class="wf-err">⚠ ${st.err[k]}</small>` : '');
const MENU = [['/durum', 'Durum'], ['/kablosuz', 'Kablosuz (Wi-Fi)'], ['/ileri', 'İleri ayarlar']];
const menu = (path) => `<nav style="display:flex;gap:0.3em;flex-wrap:wrap;background:#eceff1;padding:0.5em 1em;border-bottom:1px solid #cfd8dc">${MENU.map(([p, l]) => `<a data-href="${MODEM_HOST}${p}" style="padding:0.35em 0.9em;border-radius:6px;cursor:pointer;${p === path ? 'background:#37474f;color:#fff' : 'color:#263238'}">${l}</a>`).join('')}<button type="button" class="ed-btn ghost small" data-act="logout" style="margin-left:auto">⏻ Çıkış</button></nav>`;
const body = (path, inner) => `${mhead}${menu(path)}<div class="ed" style="max-width:40em;margin:0 auto;padding:1em">${inner}</div>`;

const MODEM = {
  name: 'Modem Yönetimi', secure: false,
  render(path, q, ctx) {
    const st = ctx.state;
    st.ssid ||= MODEM_ETIKET.ssid;
    st.wpa ||= MODEM_ETIKET.wifi;
    st.dev ||= {};
    const seen = (page) => setTimeout(() => ctx.emit('router-page', { page }), 0);
    if (!st.in) {
      return mpage('Modem Yönetimi: Giriş', `${mhead}<form class="ed-login" data-act="login" style="padding-top:1.5em"><h1>Yönetim girişi</h1>
        <p class="mut">Kullanıcı adı ve yönetim şifresi modemin altındaki etikette yazar. (Bu, Wi-Fi şifresi değildir.)</p>
        ${st.err?.top ? `<div class="wf-errtop">⚠ ${st.err.top}</div>` : ''}
        <label>Kullanıcı adı<input name="user" autocomplete="off" spellcheck="false"></label>
        <label>Yönetim şifresi<input name="pw" type="password" autocomplete="off"></label>
        <button class="ed-btn" style="background:#37474f">Giriş</button></form>`);
    }
    if (path === '/kablosuz') {
      seen('kablosuz');
      const f = st.form || {};
      return mpage('Kablosuz ayarları', body('/kablosuz', `<h1>📶 Kablosuz (Wi-Fi) ayarları</h1>
        <form class="ed-login" data-act="savewifi" style="margin:0">
        <label>Wi-Fi adı (SSID)<input name="ssid" autocomplete="off" spellcheck="false" value="${esc(f.ssid ?? st.ssid)}"></label>${merr(st, 'ssid')}
        <small class="ed-small">Evdeki ağınızın adı. Adınızı ya da adresinizi yazmayın.</small>
        <label>Wi-Fi şifresi (WPA anahtarı)<input name="wpa" autocomplete="off" spellcheck="false" value="${esc(f.wpa ?? st.wpa)}"></label>${merr(st, 'wpa')}
        <small class="ed-small">Modem en az 8 karakter ister; siz 12 ve üzerini tercih edin. Doğum yılı, 1234 gibi tahmin edilebilir şeyler olmasın.</small>
        <label>Şifreleme<select name="enc" disabled><option>WPA2-PSK (önerilen)</option></select></label>
        <p><button class="ed-btn" style="background:#37474f">Kaydet</button></p></form>`));
    }
    if (path === '/kaydedildi') {
      const left = MODEM_CIHAZLAR.filter(([id]) => st.dev[id] !== 'ok').length;
      return mpage('Kaydedildi', body('/kablosuz', `<h1>✅ Ayarlar kaydedildi</h1>
        <div class="ed-note">Kablosuz ağ yeniden başlıyor. <b>Kablosuz bağlıysanız bağlantınız koptu; bu normaldir.</b> Eski şifreyle bağlı bütün cihazlar da koptu. Her birine <b>yeni şifreyi</b> yazmanız gerekir.</div>
        <p>Yeni Wi-Fi adı: <b>${esc(st.ssid)}</b></p>
        <table style="border-collapse:collapse;width:100%;margin:0.6em 0">${MODEM_CIHAZLAR.map(([id, ic, ad]) => `<tr style="border-bottom:1px solid #ddd"><td style="padding:0.5em">${ic} ${ad}</td>
          <td style="padding:0.5em">${st.dev[id] === 'ok' ? '<b style="color:#2e7d32">✔ Yeni şifreyle bağlandı</b>' : '<span style="color:#b00020">Bağlantı koptu</span>'}</td>
          <td style="padding:0.5em;text-align:right">${st.dev[id] === 'ok' ? '' : `<button type="button" class="ed-btn small" data-act="dev" data-id="${id}" style="background:#37474f">Yeni şifreyi girdim</button>`}</td></tr>`).join('')}</table>
        <p class="ed-small">Gerçekte bunu her cihazın kendi ekranında yaparsınız: Wi-Fi listesinden ağınızı seçip yeni şifreyi yazarsınız. Burada her cihaz için “Yeni şifreyi girdim”e basın.</p>
        ${left === 0 ? '<div class="ed-note" style="background:#e3f4e3">🎉 Bütün cihazlar yeni şifreyle bağlandı.</div>' : ''}`));
    }
    if (path === '/ileri') {
      seen('ileri');
      return mpage('İleri ayarlar', body('/ileri', `<h1>⚠ İleri ayarlar</h1>
        <div class="wf-errtop">Bu bölüm uzmanlar içindir. Ne işe yaradığını bilmediğiniz hiçbir ayara dokunmayın; internetiniz kesilebilir.</div>
        <ul style="line-height:2.2"><li>Güvenlik duvarı <small class="ed-small">(modemin dışarıdan gelenleri süzmesi)</small></li><li>Port yönlendirme <small class="ed-small">(kamera, uzaktan erişim gibi özel işler)</small></li><li>DNS ve hat ayarları <small class="ed-small">(internet sağlayıcınızın bilgileri)</small></li>
        <li>Yazılım güncelleme</li></ul>
        <p><button type="button" class="ed-btn ghost small" data-act="factory" style="margin:0">Fabrika ayarlarına dön</button></p>
        ${st.factory ? '<div class="ed-note">Bu alıştırmada hiçbir şey olmaz. Gerçek modemde bu düğme <b>bütün ayarları siler</b>: Wi-Fi adı ve şifresi eski haline döner, internet bağlantı bilgileri de gidebilir ve internet kesilir. Bunu kendi başınıza yapmayın; internet sağlayıcınızı arayın.</div>' : ''}`));
    }
    seen('durum');
    const devs = MODEM_CIHAZLAR.map(([id, ic, ad]) => `<li>${ic} ${ad}${st.saved && st.dev[id] !== 'ok' ? ' <small class="wf-err">(koptu)</small>' : ''}</li>`).join('');
    return mpage('Modem durumu', body('/durum', `<h1>📊 Durum</h1>
      <table style="border-collapse:collapse"><tr><td style="padding:0.3em 1em 0.3em 0">İnternet</td><td><b style="color:#2e7d32">● Bağlı</b></td></tr>
      <tr><td style="padding:0.3em 1em 0.3em 0">Wi-Fi adı</td><td><b>${esc(st.ssid)}</b></td></tr><tr><td style="padding:0.3em 1em 0.3em 0">Bağlı cihazlar</td><td><ul style="margin:0;padding-left:1.2em"><li>🖥 Bu bilgisayar</li>${devs}</ul></td></tr></table>`));
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    st.err = {};
    if (a === 'login') {
      st.form = null;
      if (v.user.toLowerCase() === MODEM_ETIKET.user && v.pw === MODEM_ETIKET.pass) { st.in = true; ctx.emit('router-login', {}); ctx.go('/durum'); return; }
      st.err.top = 'Kullanıcı adı ya da şifre yanlış. Modemin altındaki etikette “yönetim şifresi” yazan satıra bakın; Wi-Fi şifresi değildir.';
      ctx.emit('router-login-fail', { wifiPass: v.pw === st.wpa || v.pw === MODEM_ETIKET.wifi });
      ctx.refresh();
      return;
    }
    if (a === 'logout') { st.in = false; st.form = null; ctx.emit('router-logout'); ctx.go('/'); return; }
    if (a === 'factory') { st.factory = true; ctx.emit('router-reset-click'); ctx.refresh(); return; }
    if (a === 'dev') {
      st.dev[el.dataset.id] = 'ok';
      const left = MODEM_CIHAZLAR.filter(([id]) => st.dev[id] !== 'ok').length;
      ctx.emit('router-device', { id: el.dataset.id, left });
      ctx.refresh();
      return;
    }
    if (a === 'savewifi') {
      st.form = v;
      if (!v.ssid) st.err.ssid = 'Wi-Fi adı boş olamaz.';
      if (v.wpa.length < 8) st.err.wpa = 'Çok kısa. En az 8 karakter olmalı. Siz 12 ve üzerini tercih edin.';
      else if (v.wpa === st.wpa) st.err.wpa = 'Bu, şu anki şifrenizle aynı. Yeni bir şifre yazın.';
      else if (strength(v.wpa) < 2) st.err.wpa = 'Tahmin edilmesi kolay: 1234, doğum yılı ya da kolay bir sözcük içeriyor. Birkaç sözcüğü, rakamı ve işareti karıştırın.';
      if (st.err.ssid || st.err.wpa) { ctx.emit('wifi-pass-weak', { why: st.err.wpa ? 'wpa' : 'ssid', len: v.wpa.length }); ctx.refresh(); return; }
      // 8-11 karakter: kabul edilir ama kısa; aynı şifreyle ikinci basışta kaydedilir
      if (v.wpa.length < 12 && st.soft !== v.wpa) {
        st.soft = v.wpa;
        st.err.wpa = 'Kabul edilir ama kısa. 12 ve üzeri karakter daha güvenlidir. Yine de bu şifreyle devam etmek isterseniz Kaydet\'e tekrar basın.';
        ctx.emit('wifi-pass-weak', { why: 'kisa12', soft: true, len: v.wpa.length });
        ctx.refresh();
        return;
      }
      st.soft = null;
      st.ssid = v.ssid;
      st.wpa = v.wpa;
      st.saved = true;
      st.form = null;
      st.dev = {};
      ctx.emit('wifi-pass-saved', { ssid: v.ssid, len: v.wpa.length });
      ctx.go('/kaydedildi');
    }
  },
};

export const AG_SITES = { [HIZ_HOST]: HIZ, [MODEM_HOST]: MODEM };
