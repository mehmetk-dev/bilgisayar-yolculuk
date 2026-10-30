// "Şifremi unuttum" akışı: giriş, yanlış şifre, e-posta ya da telefona doğrulama kodu, yeni şifre (uydurma site).
// Ayrıca “Hesap oluştur” akışı (/kayit…): ad, doğum tarihi, kullanıcı adı, şifre, telefon + SMS kodu, şartlar; adres ornek.com ile biter.
// Kod, ekranın köşesinde “SMS” olarak görünür. Gerçek sitelerde olduğu gibi kod yalnızca sitenin kendisine yazılır.
import { esc } from './util.js';
import { strength } from '../lessons/scenes.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
export const HESAP_MAIL = 'ogrenci@ornek.com';
export const HESAP_ESKI = 'Kedi2019';
const head = '<header class="ed-head">🔐 E-Hesabım<nav><a data-href="www.e-hesabim.com.tr">Giriş</a></nav></header>';
const err = (st, k) => (st.err?.[k] ? `<small class="wf-err">⚠ ${st.err[k]}</small>` : '');

// ---- Hesap oluşturma (/kayit…): gerçek e-posta sitelerindeki adımların genel hali ----
export const HESAP_ALAN = 'ornek.com';
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const KAYIT = ['/kayit', '/kayit/adres', '/kayit/sifre', '/kayit/telefon', '/kayit/kod', '/kayit/sartlar'];
const TR = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
const sade = (t) => String(t || '').toLocaleLowerCase('tr').replace(/[çğıöşüâîû]/g, (h) => TR[h]).replace(/[^a-z0-9]/g, '');
const ALINMIS = ['ogrenci', 'kursiyer', 'ahmet.yilmaz', 'mehmet.kaya', 'ali.demir', 'fatma.kaya'];
const alinmis = (u, st) => {
  const a = sade(st.f?.ad), s = sade(st.f?.soyad);
  if (ALINMIS.includes(u)) return true;
  return !!(a && s && (u === `${a}${s}` || new RegExp(`^${a}\\.?${s}\\d{0,2}$`).test(u)));
};
const yilOf = (st) => String(st.f?.yil || '').padStart(4, '0');
const oneriler = (st) => {
  const a = sade(st.f?.ad), s = sade(st.f?.soyad), y = yilOf(st);
  return [`${a}.${s}${y}`, `${a}.${s}.${y.slice(2)}`, `${a}${s}${y}`];
};
const adim = (n) => `<p class="ed-small">Adım ${n} / 6</p>`;
const val = (st, k) => esc(st.f?.[k] ?? '');
const kayitSayfa = (path, st) => {
  const sira = KAYIT.indexOf(path);
  if (sira < 0) return page('Sayfa yok', `${head}<div class="ed"><h1>Sayfa bulunamadı</h1><p><a data-href="www.e-hesabim.com.tr">Ana sayfaya dönün</a></p></div>`);
  if (sira > (st.ks || 0)) return page('Önce önceki adımlar', `${head}<div class="ed"><h1>Önce bir önceki adımı bitirin</h1><p><a data-href="www.e-hesabim.com.tr/kayit">Hesap oluşturmaya baştan başlayın</a></p></div>`);
  if (path === '/kayit') {
    const gun = val(st, 'gun'), yil = val(st, 'yil');
    return page('Hesap oluştur', `${head}<form class="ed-login" data-act="k-ad">${adim(1)}<h1>Hesap oluşturun</h1><p>Önce adınızı ve doğum tarihinizi yazın. <b>Gerçek bilgilerinizi</b> yazın; hesabınızı kurtarmanız gerekirse bunlar sorulur.</p>
      <label>Ad<input name="ad" autocomplete="off" value="${val(st, 'ad')}"></label>${err(st, 'ad')}<label>Soyad<input name="soyad" autocomplete="off" value="${val(st, 'soyad')}"></label>${err(st, 'soyad')}
      <div style="display:flex;gap:0.6em;align-items:flex-end"><label>Gün<input name="gun" maxlength="2" inputmode="numeric" autocomplete="off" style="width:4em" value="${gun}"></label>
      <label>Ay<select name="ay"><option value="">Seçin</option>${AYLAR.map((m, i) => `<option value="${i + 1}"${String(st.f?.ay) === String(i + 1) ? ' selected' : ''}>${m}</option>`).join('')}</select></label>
      <label>Yıl<input name="yil" maxlength="4" inputmode="numeric" autocomplete="off" style="width:5em" value="${yil}"></label></div>${err(st, 'dogum')}
      <button class="ed-btn">Sonraki</button></form>`);
  }
  if (path === '/kayit/adres') {
    const sug = st.sug?.length ? `<div class="ed-note">Bu ad alınmış. Şunlardan birini seçebilirsiniz:<div style="display:flex;flex-direction:column;align-items:flex-start;gap:0.3em;margin-top:0.4em">${st.sug.map((u) => `<button type="button" class="ed-btn ghost small" style="margin-left:0" data-act="k-pick" data-user="${esc(u)}">${esc(u)}@${HESAP_ALAN}</button>`).join('')}</div></div>` : '';
    return page('Kullanıcı adı', `${head}<form class="ed-login" data-act="k-adres">${adim(2)}<h1>E-posta adresiniz ne olsun?</h1><p>Adresiniz <b>kullanıcı adı@${HESAP_ALAN}</b> biçiminde olur. Yalnızca <b>küçük harf (a-z), rakam ve nokta</b> kullanın; Türkçe harf (ç, ğ, ı, ö, ş, ü) ve boşluk olmaz. Okunması ve söylenmesi kolay olsun.</p>
      <label>Kullanıcı adı<span style="display:flex;align-items:center;gap:0.4em"><input name="user" autocomplete="off" spellcheck="false" style="flex:1;min-width:0" value="${val(st, 'user')}"><span>@${HESAP_ALAN}</span></span></label>${err(st, 'user')}${sug}
      <button class="ed-btn">Sonraki</button></form>`);
  }
  if (path === '/kayit/sifre') {
    const p1 = st.f?.p1 || '', s = p1 ? strength(p1) : -1, tip = st.show ? 'text' : 'password';
    const metre = p1 && st.sifreDenendi ? `<div class="pw-meter"><i data-s="${Math.max(s, 0)}" style="width:${(Math.max(s, 0) + 1) * 20}%"></i></div><small>${['Çok zayıf', 'Zayıf', 'Orta', 'İyi', 'Çok güçlü'][Math.max(s, 0)]}</small>` : '';
    return page('Şifre', `${head}<form class="ed-login" data-act="k-sifre">${adim(3)}<h1>Bir şifre belirleyin</h1><p>Site en az <b>8 karakter</b> ister; siz <b>12 ve üzerini</b> tercih edin. Üç dört kelimelik uzun bir cümle hem hatırlanır hem güçlüdür. Adınız ve doğum yılınız olmasın.</p>
      <label>Şifre<input name="p1" type="${tip}" autocomplete="off" value="${esc(p1)}"></label>${err(st, 'p1')}${metre}<label>Şifre (tekrar)<input name="p2" type="${tip}" autocomplete="off" value="${val(st, 'p2')}"></label>${err(st, 'p2')}
      <p><button type="button" class="ed-btn ghost small" style="margin-left:0" data-act="k-goster">👁 ${st.show ? 'Şifreyi gizle' : 'Şifreyi göster'}</button></p><button class="ed-btn">Sonraki</button></form>`);
  }
  if (path === '/kayit/telefon') {
    return page('Telefon', `${head}<form class="ed-login" data-act="k-telefon">${adim(4)}<h1>Telefon numaranız</h1><p>Şifrenizi unutursanız ya da biri hesabınıza girmeye çalışırsa <b>telefonunuza SMS kodu</b> göndeririz. Bu yüzden telefon numarası ister.</p>
      <label>Cep telefonu<input name="tel" inputmode="tel" autocomplete="off" placeholder="05xx xxx xx xx" value="${val(st, 'tel')}"></label>${err(st, 'tel')}
      <label>Kurtarma e-postası <small>(isteğe bağlı)</small><input name="kurt" autocomplete="off" spellcheck="false" value="${val(st, 'kurt')}"></label>${err(st, 'kurt')}
      <p class="ed-small">Kurtarma e-postası, başka bir adresiniz varsa yardımcı olur. Yoksa boş bırakabilirsiniz.</p><button class="ed-btn">Kod gönder</button>
      <p class="ed-small"><a data-href="www.e-hesabim.com.tr/kayit/sifre">← Şifreyi değiştir</a></p></form>`);
  }
  if (path === '/kayit/kod') {
    return page('Telefon doğrulama', `${head}<form class="ed-login" data-act="k-kod">${adim(5)}<h1>Telefonunuzu doğrulayın</h1><p>Telefonunuza bir <b>SMS</b> gönderdik (ekranın sağ altında görünür). İçindeki <b>6 haneli kodu</b> yazın.</p>
      <label>Doğrulama kodu<input name="kod" maxlength="6" inputmode="numeric" autocomplete="off"></label>${err(st, 'kod')}<button class="ed-btn">Doğrula</button>
      <p class="ed-small">Kod gelmedi mi? <button type="button" class="ed-btn ghost small" data-act="k-tekrar">Yeniden gönder</button></p>
      <p class="ed-small">⚠ Bu kodu <b>yalnızca bu sayfaya</b> yazın. Kimse sizi arayıp kodu istemez; isterse dolandırıcıdır.</p></form>`);
  }
  return page('Şartlar', `${head}<form class="ed-login" data-act="k-sartlar">${adim(6)}<h1>Gizlilik ve şartlar</h1><p>Hesabı açmadan önce hizmet şartlarını kabul etmeniz gerekir. Metni aşağı kaydırarak okuyabilirsiniz.</p>
    <div style="max-height:9em;overflow:auto;border:1px solid #bbb;border-radius:6px;padding:0.5em 0.8em;background:#fafafa;font-size:0.9em"><p><b>Kullanım şartları (özet)</b></p><p>1. Hesabınızın şifresinden siz sorumlusunuz; şifrenizi başkalarıyla paylaşmayın.</p><p>2. Hesabı yasalara aykırı iş için kullanmayın.</p><p>3. Bilgileriniz, hizmeti sunmak ve hesabınızı korumak için işlenir.</p><p>4. Hesabınızı istediğiniz zaman kapatabilirsiniz.</p><p>5. Hizmet reklam gösterebilir.</p></div>
    <label style="flex-direction:row;align-items:center;gap:0.5em;font-weight:600"><input type="checkbox" name="kabul"> Şartları okudum ve kabul ediyorum</label>${err(st, 'kabul')}<button class="ed-btn">Hesabı oluştur</button></form>`);
};

const kayitAct = (a, v, ctx, el, sms) => {
  const st = ctx.state;
  st.f = { ...(st.f || {}), ...v };
  const yenile = (olay, veri) => { ctx.emit(olay, { ok: false, ...veri }); ctx.refresh(); };
  const ilerle = (ks, path) => { st.ks = Math.max(st.ks || 0, ks); ctx.go(path); };
  if (a === 'k-ad') {
    const yil = +v.yil, gun = +v.gun, ay = +v.ay;
    if (!v.ad) st.err.ad = 'Adınızı yazın.';
    if (!v.soyad) st.err.soyad = 'Soyadınızı yazın.';
    if (!v.gun || !v.ay || !v.yil) st.err.dogum = 'Doğum tarihinizi tamamlayın: gün, ay ve yıl.';
    else if (!(yil >= 1900) || yil > new Date().getFullYear() || v.yil.length !== 4) st.err.dogum = 'Yıl yanlış görünüyor. 4 haneli yazın, örneğin 1958.';
    else if (!gun || new Date(yil, ay - 1, gun).getMonth() !== ay - 1) st.err.dogum = 'Bu tarih takvimde yok. Günü ve ayı kontrol edin.';
    else if (new Date().getFullYear() - yil < 13) st.err.dogum = 'Hesap açmak için en az 13 yaşında olmak gerekir.';
    if (st.err.ad || st.err.soyad || st.err.dogum) return yenile('acct-name', {});
    st.sug = null;
    ctx.emit('acct-name', { ok: true, ad: v.ad, soyad: v.soyad });
    return ilerle(1, '/kayit/adres');
  }
  if (a === 'k-pick') {
    st.f.user = el.dataset.user;
    st.sug = null;
    ctx.emit('acct-pick', { user: st.f.user });
    return ctx.refresh();
  }
  if (a === 'k-adres') {
    const u = String(v.user).toLowerCase();
    st.f.user = u;
    let neden = '';
    if (!u) { neden = 'bos'; st.err.user = 'Bir kullanıcı adı yazın.'; }
    else if (/[^a-z0-9.]/.test(u)) { neden = 'gecersiz'; st.err.user = 'Yalnızca küçük harf (a-z), rakam ve nokta kullanabilirsiniz. Türkçe harf (ç, ğ, ı, ö, ş, ü) ve boşluk olmaz.'; }
    else if (u.length < 6) { neden = 'kisa'; st.err.user = 'En az 6 karakter olmalı.'; }
    else if (/^\.|\.$|\.\./.test(u)) { neden = 'nokta'; st.err.user = 'Nokta başta, sonda ya da art arda olamaz.'; }
    else if (alinmis(u, st)) { neden = 'alinmis'; st.err.user = `“${u}@${HESAP_ALAN}” adresi başkasına ait.`; st.sug = oneriler(st); }
    if (neden) {
      if (neden === 'alinmis') ctx.emit('acct-name-taken', { user: u });
      return yenile('acct-user', { reason: neden, user: u });
    }
    st.sug = null;
    ctx.emit('acct-user', { ok: true, user: u, digits: /\d/.test(u) });
    return ilerle(2, '/kayit/sifre');
  }
  if (a === 'k-goster') {
    st.show = !st.show;
    ctx.emit('acct-pass-show', { shown: st.show });
    return ctx.refresh();
  }
  if (a === 'k-sifre') {
    const p1 = v.p1, ad = sade(st.f.ad), soyad = sade(st.f.soyad), kok = sade(st.f.user);
    const duz = sade(p1);
    let neden = '';
    if (!p1) { neden = 'bos'; st.err.p1 = 'Bir şifre yazın.'; }
    else if (p1.length < 8) { neden = 'kisa'; st.err.p1 = 'En az 8 karakter olmalı. Siz 12 ve üzerini tercih edin.'; }
    else if ((ad.length >= 3 && duz.includes(ad)) || (soyad.length >= 3 && duz.includes(soyad)) || (kok.length >= 6 && duz.includes(kok))) { neden = 'kisisel'; st.err.p1 = 'Şifrede adınızı, soyadınızı ya da kullanıcı adınızı kullanmayın.'; }
    else if (strength(p1) < 2) { neden = 'zayif'; st.err.p1 = 'Bu şifre kolay tahmin edilir. Büyük ve küçük harf, rakam ekleyin ya da daha uzun bir cümle yazın; 123 gibi dizilerden ve doğum yılından kaçının.'; }
    else if (p1 !== v.p2) { neden = 'uyusmuyor'; st.err.p2 = 'İki şifre aynı değil. İkincisine aynısını yazın.'; }
    st.sifreDenendi = true;
    if (neden) return yenile('acct-pass', { reason: neden, len: p1.length });
    if (p1.length < 12 && st.soft !== p1) {
      st.soft = p1;
      st.err.p1 = 'Kabul edilir ama kısa. 12 ve üzeri karakterli, uzun bir cümle çok daha güvenlidir. Yine de bu şifreyle devam etmek isterseniz Sonraki\'ye tekrar basın.';
      return yenile('acct-pass', { reason: 'kisa12', soft: true, len: p1.length });
    }
    st.sifre = p1;
    ctx.emit('acct-pass', { ok: true, len: p1.length, strength: strength(p1) });
    return ilerle(3, '/kayit/telefon');
  }
  if (a === 'k-telefon' || a === 'k-tekrar') {
    if (a === 'k-tekrar') { sms(); ctx.emit('acct-resend'); return; }
    const tel = String(v.tel).replace(/[\s()-]/g, '');
    if (!tel) st.err.tel = 'Cep telefonu numaranızı yazın.';
    else if (!/^(\+90|0)?5\d{9}$/.test(tel)) st.err.tel = 'Numara geçersiz görünüyor. Örnek: 0555 123 45 67 (başında 05, toplam 11 rakam).';
    if (v.kurt && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.kurt)) st.err.kurt = 'E-posta adresi geçersiz. Örnek: ad@site.com. İsterseniz boş bırakın.';
    if (st.err.tel || st.err.kurt) return yenile('acct-phone', {});
    sms();
    ctx.emit('acct-phone', { ok: true, kurtarma: !!v.kurt });
    return ilerle(4, '/kayit/kod');
  }
  if (a === 'k-kod') {
    if (String(v.kod).replace(/\D/g, '') !== st.code) { st.err.kod = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; return yenile('acct-code', {}); }
    ctx.emit('acct-code', { ok: true });
    return ilerle(5, '/kayit/sartlar');
  }
  if (a === 'k-sartlar') {
    if (!v.kabul) { st.err.kabul = 'Devam etmek için şartları kabul etmelisiniz.'; return yenile('acct-terms', {}); }
    st.acct = { mail: `${st.f.user}@${HESAP_ALAN}`, pass: st.sifre, tel: st.f.tel };
    ctx.emit('acct-created', { mail: st.acct.mail, user: st.f.user, kurtarma: !!st.f.kurt });
    st.f = {};
    st.ks = 0;
    st.soft = st.sifre = null;
    st.sifreDenendi = false;
    st.show = false;
    return ctx.go('/kayit/tamam');
  }
};

const HESAP = {
  name: 'E-Hesabım', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.pass ||= HESAP_ESKI;
    if (path === '/kayit/tamam') {
      if (!st.acct) return kayitSayfa('/kayit/sartlar', st);
      return page('Hesabınız hazır', `${head}<div class="ed"><h1>✅ Hesabınız hazır</h1><p>Yeni e-posta adresiniz:</p><p style="font-size:1.5em;font-weight:800;color:#c62828">${esc(st.acct.mail)}</p>
        <div class="ed-note">📒 <b>Adresinizi ve şifrenizi</b> şimdi bir deftere yazın. Defteri <b>evde, güvenli bir yerde</b> saklayın; bilgisayarın yanına koymayın, ekrana ya da telefona fotoğraf diye kaydetmeyin.</div>
        <p>Hazır olunca <a data-href="www.e-hesabim.com.tr">giriş sayfasına</a> gidip yeni adresinizle girin.</p></div>`);
    }
    if (path === '/kayit' || path.startsWith('/kayit/')) return kayitSayfa(path, st);
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
      return page('Hesabım', `${head}<div class="ed"><h1>👋 Hoş geldiniz</h1>${st.who ? `<p><b>${esc(st.who)}</b></p>` : ''}<p>E-Hesabım'a giriş yaptınız. <button type="button" class="ed-btn small" data-act="logout">⏻ Çıkış</button></p></div>`);
    }
    return page('E-Hesabım: Giriş', `${head}<form class="ed-login" data-act="login"><h1>Hesabınıza giriş yapın</h1><p class="mut">Alıştırma hesabı: <b>${HESAP_MAIL}</b> · şifre <b>${st.pass === HESAP_ESKI ? 'unuttuğunuzu varsayın' : 'yeni şifreniz'}</b></p>
      ${st.err?.top ? `<div class="wf-errtop">⚠ ${st.err.top}</div>` : ''}<label>E-posta<input name="mail" autocomplete="off" spellcheck="false" value="${esc(st.form?.mail ?? '')}"></label><label>Şifre<input name="pw" type="password" autocomplete="off"></label>
      <button class="ed-btn">Giriş yap</button><p class="ed-small"><a data-href="www.e-hesabim.com.tr/sifirla">Şifremi unuttum</a></p><p class="ed-small">Hesabınız yok mu? <a data-href="www.e-hesabim.com.tr/kayit">Hesap oluştur</a></p></form>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    st.err = {};
    st.form = v;
    const sms = () => {
      st.code = String(Math.floor(100000 + Math.random() * 900000));
      setTimeout(() => ctx.desk.toast('SMS · E-HESABIM', `Doğrulama kodunuz: <b>${st.code}</b>. Bu kodu kimseyle paylaşmayın.`, '💬', 40000), 700);
    };
    if (a.startsWith('k-')) { kayitAct(a, v, ctx, el, sms); return; }
    if (a === 'login') {
      if (st.acct && v.mail.toLowerCase() === st.acct.mail && v.pw === st.acct.pass) { st.who = st.acct.mail; ctx.emit('hesap-login', { ok: true, newPass: false, yeni: true }); ctx.go('/hesap'); return; }
      if (v.mail.toLowerCase() === HESAP_MAIL && v.pw === st.pass) { ctx.emit('hesap-login', { ok: true, newPass: st.pass !== HESAP_ESKI }); ctx.go('/hesap'); return; }
      st.err.top = 'E-posta ya da şifre yanlış.';
      ctx.emit('hesap-login', { ok: false });
      ctx.refresh();
      return;
    }
    if (a === 'logout') { st.who = null; ctx.emit('hesap-logout'); ctx.go('/'); return; }
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
