// 14. hafta sitesi (uydurma): Bankam İnternet Şubesi. Giriş (şifre + SMS kodu), hesap ve IBAN (kopyala),
// para gönderme (IBAN yapıştırma, alıcı adı denetimi, SMS onayı), PDF dekont indirme,
// kartlar (asıl kartı internet alışverişine kapatma, limitli sanal kart oluşturma, kartı geçici kapatma),
// şüpheli harcamaya itiraz (hareket listesinde 4. alanı 'sus' olan satırlar).
import { esc } from './util.js';
import { KURS_TC } from './siteler-gunluk.js';

export const BANKA_HOST = 'www.bankam.com.tr';
export const BANKA_SIFRE = '246810';
export const YONETICI = { ad: 'Hasan Demir', iban: 'TR33 0006 1005 1978 6457 8413 26', aidat: 750 };
const MY_IBAN = 'TR32 0001 2009 4520 0058 0012 34';

const digits = (s) => String(s || '').replace(/\D/g, '');
// Yapıştırılan yazıdan IBAN'ı ayıklar (“IBAN:” gibi fazlalıklar ve boşluklar atılır)
const ibanKey = (s) => { const k = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return k.match(/TR\d{24}/)?.[0] || k.replace(/^IBAN/, ''); };
const tl = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
const code = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const low = (s) => String(s || '').toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim();
const group4 = (s) => s.replace(/(.{4})/g, '$1 ').trim();
// IBAN denetimi (mod 97): tek hane yanlış yazılınca da yakalanır
function ibanOk(s) {
  const k = ibanKey(s);
  if (!/^TR\d{24}$/.test(k)) return false;
  const r = (k.slice(4) + k.slice(0, 4)).replace(/[A-Z]/g, (c) => c.charCodeAt(0) - 55);
  let m = 0;
  for (const ch of r) m = (m * 10 + +ch) % 97;
  return m === 1;
}

function copyText(t) {
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.append(ta); ta.select();
  try { document.execCommand('copy'); } catch { /* pano yoksa da sorun değil */ }
  ta.remove();
}

const page = (title, html) => ({ title, html: `<div class="wp bn">${html}</div>` });

const BANKA = {
  name: 'Bankam', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.bal ??= 18450.75;
    st.moves ||= [['14.10.2026', 'Emekli maaşı', 15240], ['15.10.2026', 'Elektrik faturası', -1245.5], ['16.10.2026', 'Market', -386.4]];
    st.cardOnline ??= true;
    const head = `<header class="bn-head">🏦 Bankam <span>İnternet Şubesi</span>${st.user ? `<nav><a data-href="${BANKA_HOST}/hesap">Hesaplarım</a><a data-href="${BANKA_HOST}/gonder">Para Gönder</a><a data-href="${BANKA_HOST}/kartlar">Kartlarım</a><button type="button" data-act="logout">⏻ Çıkış</button></nav>` : ''}</header>`;
    const err = st.err ? `<div class="bn-err">⚠ ${st.err}</div>` : '';
    if (!st.user) {
      if (st.loginCode) {
        return page('Bankam: SMS doğrulama', `${head}<div class="bn-box"><h1>📱 SMS doğrulama</h1><p>Telefonunuza 6 haneli bir kod gönderdik. Kodu yazın:</p>
          <form class="bn-form" data-act="login2"><input name="kod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="______">${err}<button class="bn-btn">Giriş</button></form>
          <p class="bn-note">🔒 Bu kodu <b>kimseyle paylaşmayın</b>. Bankam sizi arayıp bu kodu asla sormaz.</p></div>`);
      }
      return page('Bankam İnternet Şubesi', `${head}<div class="bn-box"><h1>İnternet Şubesi Girişi</h1>
        <form class="bn-form" data-act="login"><label>T.C. Kimlik No<input name="tc" inputmode="numeric" maxlength="11" autocomplete="off"></label><label>Şifre<input name="sifre" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label>${err}<button class="bn-btn">Devam</button></form>
        <p class="bn-note">🔒 Adres çubuğunda kilit ve <b>bankam.com.tr</b> var mı? Bankanız sizden telefonla ya da SMS ile <b>asla</b> şifre istemez.</p></div>`);
    }
    if (path === '/gonder') {
      const f = st.form || {};
      return page('Para Gönder - Bankam', `${head}<div class="bn-main"><h1>💸 Para Gönder (IBAN'a)</h1><form class="bn-form wide" data-act="send">
        <label>Alıcı IBAN<input name="iban" class="bn-iban" value="${esc(f.iban || '')}" placeholder="TR__ ____ ____ ____ ____ ____ __" autocomplete="off" spellcheck="false"></label>
        <label>Alıcının adı soyadı<input name="ad" value="${esc(f.ad || '')}" autocomplete="off"></label>
        <label>Tutar (₺)<input name="tutar" inputmode="decimal" value="${esc(f.tutar || '')}" autocomplete="off"></label>
        <label>Açıklama<input name="acik" value="${esc(f.acik || '')}" placeholder="ör. Ekim aidatı, Daire 7" autocomplete="off"></label>${err}
        <p class="bn-small">Gönderen hesap: Vadesiz TL · Bakiye <b>${tl(st.bal)}</b></p><button class="bn-btn">Devam</button></form>
        <p class="bn-note">💡 IBAN 26 karakterdir. Elle yazmak yerine <b>kopyalayıp yapıştırın</b>: tek rakam yanlış olursa para gitmez ya da yanlış kişiye gider.</p></div>`);
    }
    if (path === '/onay' && st.pending) {
      const p = st.pending;
      return page('İşlem onayı - Bankam', `${head}<div class="bn-main"><h1>✅ İşlemi kontrol edin</h1><table class="bn-tbl"><tr><th>Alıcı</th><td>${esc(p.ad)}</td></tr><tr><th>IBAN</th><td>${esc(group4(p.iban))}</td></tr><tr><th>Tutar</th><td><b>${tl(p.tutar)}</b></td></tr><tr><th>Açıklama</th><td>${esc(p.acik || '-')}</td></tr></table>
        <p>Telefonunuza gelen SMS onay kodunu yazın:</p><form class="bn-form" data-act="confirm"><input name="kod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="______">${err}<button class="bn-btn">Onayla ve gönder</button><button type="button" class="bn-btn ghost" data-act="cancel">Vazgeç</button></form></div>`);
    }
    if (path === '/tamam' && st.last) {
      const l = st.last;
      return page('İşlem başarılı - Bankam', `${head}<div class="bn-main"><div class="bn-ok">✔ <b>${tl(l.tutar)}</b> ${esc(l.ad)} adına gönderildi.</div><p>İşlem numarası: <b>${l.no}</b></p>
        <p>Ödediğinizi göstermek için <b>dekont</b> (makbuz) indirin; aidatı, kirayı ödediğiniz kişiye gönderebilirsiniz.</p>
        <button type="button" class="bn-btn" data-act="dekont">📄 Dekontu indir (PDF)</button></div>`);
    }
    if (path === '/kartlar') {
      const v = st.vcard;
      const vc = v ? `<div class="bn-card virt"><small>SANAL KART · ${v.months} ay geçerli</small><b class="bn-cno">${st.show ? group4(v.no) : '•••• •••• •••• ' + v.no.slice(-4)}</b><span>SKT ${v.skt} · CVV ${st.show ? v.cvv : '•••'}</span><span>Limit: <b>${tl(v.limit)}</b></span></div>
        <div class="bn-cbtns"><button type="button" class="bn-btn ghost" data-act="show">${st.show ? '🙈 Gizle' : '👁 Bilgileri göster'}</button><button type="button" class="bn-btn ghost" data-act="copyno">📋 Numarayı kopyala</button><button type="button" class="bn-btn ghost" data-act="vdel">🗑 Sanal kartı sil</button></div>`
        : `<form class="bn-form wide bn-vform" data-act="vcard"><b>Sanal kart oluştur</b><p class="bn-small">İnternet alışverişleri için ayrı bir kart numarası. Yalnızca belirlediğiniz limit kadar harcanabilir.</p>
          <label>Limit (₺)<input name="limit" inputmode="numeric" placeholder="ör. 500" autocomplete="off"></label>
          <div class="bn-radio">Geçerlilik: <label><input type="radio" name="ay" value="1" checked> 1 ay</label><label><input type="radio" name="ay" value="6"> 6 ay</label><label><input type="radio" name="ay" value="12"> 1 yıl</label></div>${err}<button class="bn-btn">Oluştur</button></form>`;
      return page('Kartlarım - Bankam', `${head}<div class="bn-main"><h1>💳 Kartlarım</h1><div class="bn-cards"><div><div class="bn-card"><small>BANKAM KART · Banka kartı</small><b class="bn-cno">•••• •••• •••• 4417</b><span>Hesaba bağlı: ${tl(st.bal)}</span></div>
        <label class="bn-sw"><input type="checkbox" class="bn-online" ${st.cardOnline ? 'checked' : ''}><span></span> İnternet alışverişine açık</label>
        <p class="bn-small">${st.cardOnline ? 'Bu kartla internette alışveriş yapılabilir.' : '🔒 Bu kart internette kullanılamaz: numarası çalınsa bile internetten harcama yapılamaz.'}</p>
        ${st.cardBlocked ? '<div class="bn-err">🚫 <b>Kart geçici olarak kapalı.</b> Hiçbir yerde (internet, market, ATM) kullanılamaz.</div><button type="button" class="bn-btn ghost small" data-act="unblock">Kartı yeniden aç</button>'
          : '<button type="button" class="bn-btn ghost small" data-act="block">🚫 Kartı geçici olarak kapat</button><p class="bn-small">Kartınız kaybolduysa ya da bilgileri çalındıysa hemen kapatın.</p>'}</div><div>${vc}</div></div></div>`);
    }
    return page('Hesaplarım - Bankam', `${head}<div class="bn-main"><h1>👋 Hoş geldiniz</h1><div class="bn-acc"><div><small>Vadesiz TL Hesabı</small><b class="bn-bal">${tl(st.bal)}</b></div>
      <div class="bn-ibanrow"><small>IBAN</small><code>${MY_IBAN}</code><button type="button" class="bn-btn ghost small" data-act="copyiban">📋 Kopyala</button></div></div>
      <h2>Son hareketler</h2><table class="bn-tbl">${st.moves.map((m, i) => [m, i]).reverse().map(([[d, a, t, flag], i]) => `<tr><td>${d}</td><td>${esc(a)}${flag === 'sus' ? `<br><button type="button" class="bn-btn ghost small" data-act="dispute" data-v="${i}">⚠ Bu harcamayı ben yapmadım: itiraz et</button>` : flag === 'itiraz' ? '<br><small class="bn-small">✔ İtirazınız alındı. Banka inceleyip size bilgi verecek.</small>' : ''}</td><td class="${t < 0 ? 'neg' : 'pos'}">${t < 0 ? '' : '+'}${tl(t)}</td></tr>`).join('')}</table></div>`);
  },
  mount(el, ctx) {
    const inp = el.querySelector('.bn-iban');
    if (inp) inp.addEventListener('paste', () => setTimeout(() => {
      const k = ibanKey(inp.value);
      if (/^TR\d{24}$/.test(k)) inp.value = group4(k); // banka sitesi gibi: dörtlü gruplar hâlinde gösterir
      ctx.emit('bank-iban-paste', { valid: ibanOk(k), same: k === ibanKey(YONETICI.iban) });
    }, 0));
    el.querySelector('.bn-online')?.addEventListener('change', (e) => { ctx.state.cardOnline = e.target.checked; ctx.emit('bank-card-online', { on: e.target.checked }); ctx.refresh(); });
    return 0;
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    st.err = '';
    // SMS bildirimi: kod doğru girilince kapanır (sayfadaki düğmelerin üstünü kapatmasın)
    const sms = (what, c) => { st.smsEl?.remove(); st.smsEl = ctx.desk.toast('SMS · BANKAM', `${what} için doğrulama kodunuz: <b>${c}</b>. Bu kodu kimseyle paylaşmayın.`, '💬', 30000); };
    const smsDone = () => { st.smsEl?.remove(); st.smsEl = null; };
    if (a === 'login') {
      if (digits(v.tc) !== KURS_TC || v.sifre !== BANKA_SIFRE) { st.err = 'T.C. Kimlik No veya şifre hatalı.'; ctx.emit('bank-login-err'); ctx.refresh(); return; }
      st.loginCode = code(6);
      ctx.refresh();
      setTimeout(() => sms('İnternet şubesi girişi', st.loginCode), 700);
      return;
    }
    if (a === 'login2') {
      if (digits(v.kod) !== st.loginCode) { st.err = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; ctx.refresh(); return; }
      st.user = true; st.loginCode = null; smsDone();
      ctx.emit('bank-login');
      ctx.go('/hesap');
      return;
    }
    if (a === 'logout') { st.user = false; st.show = false; ctx.emit('bank-logout'); ctx.go('/'); return; }
    if (a === 'copyiban') { copyText(MY_IBAN); ctx.desk.toast('Kopyalandı', 'IBAN panoya kopyalandı; istediğiniz yere Ctrl + V ile yapıştırın.', '📋', 3000); ctx.emit('bank-iban-copy'); return; }
    if (a === 'send') {
      st.form = v;
      const tutar = parseFloat(String(v.tutar).replace(/\./g, '').replace(',', '.'));
      let reason = null;
      if (!ibanOk(v.iban)) { reason = 'iban'; st.err = ibanKey(v.iban).length !== 26 ? `IBAN 26 karakter olmalı; siz ${ibanKey(v.iban).length} karakter yazdınız.` : 'IBAN hatalı: bir rakam yanlış yazılmış olabilir. Elle yazmak yerine kopyalayıp yapıştırın.'; }
      else if (ibanKey(v.iban) === ibanKey(YONETICI.iban) && low(v.ad) !== low(YONETICI.ad)) { reason = 'ad'; st.err = 'Alıcının adı soyadı bu IBAN\'ın sahibiyle uyuşmuyor. Adı, mesajda yazdığı gibi yazın.'; }
      else if (ibanKey(v.iban) !== ibanKey(YONETICI.iban)) { reason = 'other'; st.err = 'Bu alıştırmada yalnızca apartman yöneticisinin IBAN\'ına para gönderilebilir.'; }
      else if (!(tutar > 0)) { reason = 'tutar'; st.err = 'Tutarı yazın (ör. 750).'; }
      else if (tutar > st.bal) { reason = 'bakiye'; st.err = 'Bakiye yetersiz.'; }
      ctx.emit('bank-send', { ok: !reason, reason, tutar: tutar || 0 });
      if (reason) { ctx.refresh(); return; }
      st.pending = { iban: ibanKey(v.iban), ad: v.ad, tutar, acik: v.acik, code: code(6) };
      ctx.go('/onay');
      setTimeout(() => sms(`${tl(tutar)} tutarındaki para gönderme işlemi`, st.pending.code), 700);
      return;
    }
    if (a === 'cancel') { st.pending = null; ctx.go('/gonder'); return; }
    if (a === 'confirm') {
      const p = st.pending;
      if (!p) return;
      if (digits(v.kod) !== p.code) { st.err = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; ctx.refresh(); return; }
      smsDone();
      st.bal -= p.tutar;
      const d = ctx.desk.now();
      const date = d.toLocaleDateString('tr-TR');
      st.moves.push([date, `${p.ad}: ${p.acik || 'Para gönderme'}`, -p.tutar]);
      st.last = { ...p, no: 'FAST' + code(10), date, time: d.toTimeString().slice(0, 5) };
      st.pending = null; st.form = {};
      ctx.emit('bank-transfer', { tutar: p.tutar, ad: p.ad, acik: p.acik || '' });
      ctx.go('/tamam');
      return;
    }
    if (a === 'dekont') {
      const l = st.last;
      const name = `dekont-${(l.acik || 'odeme').toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'odeme'}.pdf`;
      ctx.download(name, { pages: [`<p class="pdf-org">BANKAM A.Ş.</p><h3>Para Gönderme Dekontu (FAST)</h3><table class="pdf-tbl"><tr><td>İşlem tarihi</td><td>${l.date} ${l.time}</td></tr><tr><td>İşlem no</td><td>${l.no}</td></tr><tr><td>Gönderen</td><td>${MY_IBAN}</td></tr><tr><td>Alıcı</td><td>${esc(l.ad)} · ${esc(group4(l.iban))}</td></tr><tr><td>Açıklama</td><td>${esc(l.acik || '-')}</td></tr><tr><th>Tutar</th><th>${tl(l.tutar)}</th></tr></table><p class="pdf-small">Bu dekont elektronik ortamda üretilmiştir; imza gerektirmez.</p>`] });
      ctx.emit('bank-dekont', { name });
      return;
    }
    if (a === 'vcard') {
      const limit = parseInt(digits(v.limit), 10);
      if (!limit) { st.err = 'Limiti yazın (ör. 500).'; ctx.refresh(); return; }
      if (limit > st.bal) { st.err = 'Limit, hesabınızdaki paradan büyük olamaz.'; ctx.refresh(); return; }
      const m = +v.ay || 1, d = ctx.desk.now();
      const e = new Date(d.getFullYear(), d.getMonth() + m, 1);
      st.vcard = { limit, months: m, no: '5' + code(15), cvv: code(3), skt: `${String(e.getMonth() + 1).padStart(2, '0')}/${String(e.getFullYear()).slice(-2)}` };
      st.show = false;
      ctx.emit('bank-vcard', { limit, months: m });
      ctx.refresh();
      return;
    }
    if (a === 'show') { st.show = !st.show; ctx.emit('bank-vcard-show', { on: st.show }); ctx.refresh(); return; }
    if (a === 'copyno') { copyText(st.vcard.no); ctx.desk.toast('Kopyalandı', 'Sanal kart numarası panoya kopyalandı.', '📋', 3000); ctx.emit('bank-vcard-copy'); return; }
    if (a === 'vdel') { st.vcard = null; ctx.emit('bank-vcard-del'); ctx.refresh(); return; }
    if (a === 'block' || a === 'unblock') { st.cardBlocked = a === 'block'; ctx.emit('bank-card-block', { on: st.cardBlocked }); ctx.refresh(); return; }
    if (a === 'dispute') {
      const m = st.moves[+el.dataset.v];
      if (!m) return;
      m[3] = 'itiraz';
      ctx.emit('bank-dispute', { what: m[1], tutar: -m[2], blocked: !!st.cardBlocked });
      ctx.refresh();
    }
  },
};

export const BANKA_SITES = { [BANKA_HOST]: BANKA };
