// 15. hafta “Telefonum kayboldu” dersinin alıştırma sitesi (uydurma): Cihazımı Bul.
// Gerçeği Android'de android.com/find, iPhone'da icloud.com/find. Hesapla girilir; haritada telefonun son yeri,
// Çaldır, Kilitle (kilit ekranına mesaj ve ulaşılacak numara), Sil (geri alınamaz uyarısı, Vazgeç).
// Olaylar: cb-login, cb-ring {on}, cb-lock {tel, msg}, cb-lock-error, cb-wipe-ask, cb-wipe-cancel, cb-wipe.
import { esc } from './util.js';

export const BUL_HOST = 'www.cihazimi-bul.com';
export const BUL_HESAP = 'ogrenci@ornek.com';
const page = (title, html) => ({ title, html: `<div class="wp cb">${html}</div>` });
const digits = (s) => String(s || '').replace(/\D/g, '');

const BUL = {
  name: 'Cihazımı Bul', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    const head = `<header class="cb-head">📍 Cihazımı Bul${st.in ? `<span>👤 ${esc(BUL_HESAP)}</span>` : ''}</header>`;
    if (!st.in) {
      return page('Cihazımı Bul', `${head}<div class="cb-login"><h1>Hesabınızla giriş yapın</h1>
        <p>Kaybolan telefonda hangi hesap açıksa (Android'de Gmail hesabı) onunla girin.</p>
        <button type="button" class="cb-acc" data-act="login"><b>👤</b><span><b>${esc(ctx.desk.settings.user || 'Öğrenci')}</b><small>${esc(BUL_HESAP)}</small></span></button>
        <p class="ed-small">Alıştırma: hesap kayıtlı, şifre sorulmaz. Gerçekte şifrenizi yazarsınız.</p></div>`);
    }
    if (st.wiped) {
      return page('Cihazımı Bul', `${head}<div class="cb-body"><div class="ed-bad">🗑 Telefonun içi silindi. Artık yeri de görünmüyor, çaldırılamıyor.</div><p><button type="button" class="ed-btn small ghost" data-act="reset">↻ Alıştırmayı baştan alın</button></p></div>`);
    }
    const ask = st.ask === 'wipe' ? `<div class="cb-panel cb-warn"><b>⚠ Telefonun içindeki her şey silinsin mi?</b>
        <p>Fotoğraflar, mesajlar, uygulamalar silinir. <b>Geri alınamaz.</b> Silindikten sonra telefonun <b>yeri de görünmez</b>.</p>
        <p><button type="button" class="ed-btn ghost" data-act="wipeNo">Vazgeç</button><button type="button" class="ed-btn cb-red" data-act="wipeYes">Sil</button></p></div>`
      : st.ask === 'lock' ? `<form class="cb-panel ed-form" data-act="lock"><b>🔒 Telefonu kilitle</b>
        <label>Kilit ekranında görünecek mesaj<input name="msg" value="${esc(st.form?.msg ?? 'Bu telefon kayıp. Lütfen sahibine ulaşın.')}" autocomplete="off"></label>
        <label>Bulan kişinin arayacağı numara (başka bir telefon)<input name="tel" inputmode="tel" value="${esc(st.form?.tel ?? '')}" placeholder="0 5__ ___ __ __" autocomplete="off"></label>
        ${st.err ? `<small class="wf-err">⚠ ${st.err}</small>` : ''}
        <p><button type="button" class="ed-btn ghost" data-act="cancel">Vazgeç</button><button class="ed-btn">Kilitle</button></p></form>` : '';
    const lock = st.lock ? `<div class="ed-ok">🔒 Telefon kilitlendi. Kilit ekranında: “${esc(st.lock.msg)}” · 📞 ${esc(st.lock.tel)}</div>` : '';
    const ring = st.ring ? '<div class="ed-ok">🔔 Telefon <b>5 dakika</b> boyunca tam sesle çalıyor (sessize alınmış olsa bile). <button type="button" class="ed-btn small ghost" data-act="ringOff">Durdur</button></div>' : '';
    return page('Cihazımı Bul', `${head}<div class="cb-body">
      <div class="cb-side"><div class="cb-dev"><b>📱 Telefonum</b><small>Son görülme: 12 dakika önce</small><small>🔋 Pil: %38 · Bağlantı: mobil veri</small></div>
        <button type="button" class="cb-btn" data-act="ring">🔔 Çaldır<small>Yakındaysa sesinden bulun</small></button>
        <button type="button" class="cb-btn" data-act="lockAsk">🔒 Kilitle<small>Ekrana mesaj ve numara yazın</small></button>
        <button type="button" class="cb-btn cb-del" data-act="wipeAsk">🗑 Cihazı sil<small>Geri alınamaz</small></button></div>
      <div class="cb-main">${ring}${lock}${ask}
        <div class="cb-map"><i class="cb-r1"></i><i class="cb-r2"></i><i class="cb-r3"></i><span class="cb-lbl l1">Çarşı Market</span><span class="cb-lbl l2">Lale Sk.</span><span class="cb-lbl l3">Park</span>
          <div class="cb-pin">📍<small>Telefonum · yaklaşık 20 m</small></div></div>
        <p class="ed-small">Yer yaklaşıktır. Telefon kapalıysa ya da konumu kapalıysa son görüldüğü yer gösterilir.</p></div></div>`);
  },
  act(a, v, ctx) {
    const st = ctx.state;
    st.err = '';
    if (a === 'login') { st.in = true; ctx.emit('cb-login'); ctx.refresh(); return; }
    if (a === 'ring') { st.ring = true; st.ask = ''; ctx.emit('cb-ring', { on: true }); ctx.refresh(); return; }
    if (a === 'ringOff') { st.ring = false; ctx.emit('cb-ring', { on: false }); ctx.refresh(); return; }
    if (a === 'lockAsk') { st.ask = 'lock'; ctx.refresh(); return; }
    if (a === 'cancel') { st.ask = ''; st.form = null; ctx.refresh(); return; }
    if (a === 'lock') {
      st.form = { msg: v.msg, tel: v.tel };
      if (digits(v.tel).length < 10) { st.err = 'Bulan kişinin sizi arayabileceği bir numara yazın (başka bir telefon: eşiniz, çocuğunuz, ev telefonu).'; ctx.emit('cb-lock-error'); ctx.refresh(); return; }
      st.lock = { msg: v.msg || 'Bu telefon kayıp.', tel: v.tel };
      st.ask = '';
      ctx.emit('cb-lock', { tel: v.tel, msg: v.msg });
      ctx.refresh();
      return;
    }
    if (a === 'wipeAsk') { st.ask = 'wipe'; ctx.emit('cb-wipe-ask'); ctx.refresh(); return; }
    if (a === 'wipeNo') { st.ask = ''; ctx.emit('cb-wipe-cancel'); ctx.refresh(); return; }
    if (a === 'reset') { st.wiped = false; st.lock = null; ctx.refresh(); return; }
    if (a === 'wipeYes') { st.ask = ''; st.wiped = true; st.ring = false; ctx.emit('cb-wipe'); ctx.refresh(); }
  },
};

export const BUL_SITES = { [BUL_HOST]: BUL };
