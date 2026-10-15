// "Şifremi unuttum" akışı: giriş, yanlış şifre, e-posta ya da telefona doğrulama kodu, yeni şifre (uydurma site).
// Kod, ekranın köşesinde “SMS” olarak görünür. Gerçek sitelerde olduğu gibi kod yalnızca sitenin kendisine yazılır.
import { esc } from './util.js';
import { strength } from '../lessons/scenes.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
export const HESAP_MAIL = 'ogrenci@ornek.com';
export const HESAP_ESKI = 'Kedi2019';
const head = '<header class="ed-head">🔐 E-Hesabım<nav><a data-href="www.e-hesabim.com.tr">Giriş</a></nav></header>';
const err = (st, k) => (st.err?.[k] ? `<small class="wf-err">⚠ ${st.err[k]}</small>` : '');

const HESAP = {
  name: 'E-Hesabım', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.pass ||= HESAP_ESKI;
    if (path === '/sifirla') {
      return page('Şifremi unuttum', `${head}<form class="ed-login" data-act="send"><h1>Şifrenizi sıfırlayalım</h1><p>Hesabınıza bağlı e-posta adresini yazın. Telefonunuza <b>6 haneli bir doğrulama kodu</b> (SMS) göndereceğiz.</p>
        <label>E-posta adresi<input name="mail" autocomplete="off" value="${esc(st.form?.mail ?? '')}" spellcheck="false"></label>${err(st, 'mail')}<button class="ed-btn">Kod gönder</button></form>`);
    }
    if (path === '/kod') {
      return page('Doğrulama kodu', `${head}<form class="ed-login" data-act="verify"><h1>Doğrulama kodunu girin</h1><p>Kayıtlı telefonunuza bir <b>SMS</b> gönderdik (ekranın sağ altında görünür). İçindeki <b>6 haneli kodu</b> yazın.</p>
        <label>Doğrulama kodu<input name="kod" maxlength="6" inputmode="numeric" autocomplete="off"></label>${err(st, 'kod')}<button class="ed-btn">Doğrula</button>
        <p class="ed-small">Kod gelmedi mi? <button type="button" class="ed-btn ghost small" data-act="resend">Yeniden gönder</button></p>
        <p class="ed-small">⚠ Bu kodu <b>yalnızca bu sayfaya</b> yazın. Kimse sizi arayıp kodu okumanızı isteyemez; isterse dolandırıcıdır.</p></form>`);
    }
    if (path === '/yeni') {
      if (!st.verified) return page('Doğrulama gerekli', `${head}<div class="ed"><h1>Önce kimliğinizi doğrulayın</h1><a data-href="www.e-hesabim.com.tr/sifirla">Şifremi unuttum</a></div>`);
      const s = st.draft ? strength(st.draft) : -1;
      return page('Yeni şifre', `${head}<form class="ed-login" data-act="newpass"><h1>Yeni şifre belirleyin</h1><p>En az <b>8 karakter</b>, <b>büyük ve küçük harf</b>, bir <b>rakam</b> kullanın. Adınız, doğum yılınız olmasın. Eski şifrenizi yazmayın.</p>
        <label>Yeni şifre<input name="p1" type="password" autocomplete="off"></label>${err(st, 'p1')}<label>Yeni şifre (tekrar)<input name="p2" type="password" autocomplete="off"></label>${err(st, 'p2')}<button class="ed-btn">Şifreyi kaydet</button></form>`);
    }
    if (path === '/tamam') {
      return page('Şifre değişti', `${head}<div class="ed"><h1>✅ Şifreniz değişti</h1><p>Artık yeni şifrenizle <a data-href="www.e-hesabim.com.tr">giriş yapabilirsiniz</a>.</p>
        <div class="ed-note">📒 <b>Yeni şifrenizi</b> evde güvenli bir yerde duran bir deftere yazın. Başka bir sitede kullandığınız şifreyi tekrar kullanmayın.</div></div>`);
    }
    if (path === '/hesap') {
      return page('Hesabım', `${head}<div class="ed"><h1>👋 Hoş geldiniz</h1><p>E-Hesabım'a giriş yaptınız. <button type="button" class="ed-btn small" data-act="logout">⏻ Çıkış</button></p></div>`);
    }
    return page('E-Hesabım: Giriş', `${head}<form class="ed-login" data-act="login"><h1>Hesabınıza giriş yapın</h1><p class="mut">Alıştırma hesabı: <b>${HESAP_MAIL}</b> · şifre <b>${st.pass === HESAP_ESKI ? 'unuttuğunuzu varsayın' : 'yeni şifreniz'}</b></p>
      ${st.err?.top ? `<div class="wf-errtop">⚠ ${st.err.top}</div>` : ''}<label>E-posta<input name="mail" autocomplete="off" spellcheck="false" value="${esc(st.form?.mail ?? '')}"></label><label>Şifre<input name="pw" type="password" autocomplete="off"></label>
      <button class="ed-btn">Giriş yap</button><p class="ed-small"><a data-href="www.e-hesabim.com.tr/sifirla">Şifremi unuttum</a></p></form>`);
  },
  act(a, v, ctx) {
    const st = ctx.state;
    st.err = {};
    st.form = v;
    const sms = () => {
      st.code = String(Math.floor(100000 + Math.random() * 900000));
      setTimeout(() => ctx.desk.toast('SMS · E-HESABIM', `Doğrulama kodunuz: <b>${st.code}</b>. Bu kodu kimseyle paylaşmayın.`, '💬', 40000), 700);
    };
    if (a === 'login') {
      if (v.mail.toLowerCase() === HESAP_MAIL && v.pw === st.pass) { ctx.emit('hesap-login', { ok: true, newPass: st.pass !== HESAP_ESKI }); ctx.go('/hesap'); return; }
      st.err.top = 'E-posta ya da şifre yanlış.';
      ctx.emit('hesap-login', { ok: false });
      ctx.refresh();
      return;
    }
    if (a === 'logout') { ctx.emit('hesap-logout'); ctx.go('/'); return; }
    if (a === 'send') {
      if (v.mail.toLowerCase() !== HESAP_MAIL) { st.err.mail = `Bu adresle kayıtlı hesap bulunamadı. Doğru adres: ${HESAP_MAIL}`; ctx.emit('hesap-send', { ok: false }); ctx.refresh(); return; }
      sms();
      ctx.emit('hesap-send', { ok: true });
      ctx.go('/kod');
      return;
    }
    if (a === 'resend') { sms(); ctx.emit('hesap-resend'); return; }
    if (a === 'verify') {
      if (String(v.kod).replace(/\D/g, '') !== st.code) { st.err.kod = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; ctx.emit('hesap-verify', { ok: false }); ctx.refresh(); return; }
      st.verified = true;
      ctx.emit('hesap-verify', { ok: true });
      ctx.go('/yeni');
      return;
    }
    if (a === 'newpass') {
      if (v.p1.length < 8) st.err.p1 = 'En az 8 karakter olmalı.';
      else if (v.p1 === st.pass) st.err.p1 = 'Eski şifrenizi tekrar kullanamazsınız.';
      else if (strength(v.p1) < 2) st.err.p1 = 'Biraz daha güçlü olsun: büyük ve küçük harf, rakam ekleyin.';
      if (!st.err.p1 && v.p1 !== v.p2) st.err.p2 = 'İki şifre aynı değil.';
      if (st.err.p1 || st.err.p2) { ctx.emit('hesap-newpass', { ok: false }); ctx.refresh(); return; }
      st.pass = v.p1;
      st.verified = false;
      ctx.emit('hesap-newpass', { ok: true, strength: strength(v.p1) });
      ctx.go('/tamam');
    }
  },
};

export const HESAP_SITES = { 'www.e-hesabim.com.tr': HESAP };
