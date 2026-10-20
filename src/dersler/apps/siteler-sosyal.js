// 15. hafta sitesi (uydurma): Dostlarım sosyal ağı. Giriş (şifre, iki adımlı doğrulama: SMS kodu ya da yedek kod),
// akış ve paylaşım (kitle, konum), profilin başkalarına görünüşü, gizlilik ayarları, arkadaşlık istekleri (taklit hesap),
// mesajlar (ele geçirilmiş hesaptan para isteyen mesaj), çekiliş tuzağı, şikâyet; güvenlik: iki adımlı doğrulama,
// yedek kodlar, şifre değiştirme, oturum açılan cihazlar.
import { esc } from './util.js';

export const DOST_HOST = 'www.dostlarim.com.tr';
export const DOST_MAIL = 'ogrenci@ornek.com';
export const DOST_SIFRE = 'Bahar.2026';
export const DOST_SCAM = 'dostlarim-hediye.xyz';
const PHONE = '0555 000 12 34';

const code = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const digits = (s) => String(s || '').replace(/\D/g, '');
const page = (title, html) => ({ title, html: `<div class="wp ds">${html}</div>` });
const KITLE = { herkes: ['🌐', 'Herkese açık'], arkadas: ['👥', 'Arkadaşlar'], ben: ['🔒', 'Yalnızca ben'] };
const sel = (name, cur, keys = ['herkes', 'arkadas', 'ben']) => `<select name="${name}">${keys.map((k) => `<option value="${k}" ${cur === k ? 'selected' : ''}>${KITLE[k][0]} ${KITLE[k][1]}</option>`).join('')}</select>`;

const FEED = [
  { id: 'elif', who: 'Elif Yıldız', av: '👧', when: '2 saat önce', text: 'Mezuniyet töreninden bir kare 🎓 Babaanneme kocaman teşekkürler!', pic: '🎓' },
  { id: 'cekilis', who: 'Dostlarım Hediye 🎁', av: '🎁', when: '5 saat önce', page: true, scam: true,
    text: `🎉 <b>10. YILIMIZA ÖZEL ÇEKİLİŞ!</b> İlk 100 kişiye akıllı telefon! Bu gönderiyi paylaşın, yorumlara telefon numaranızı yazın. Kargo ücreti yalnızca 49 TL: kart bilgilerinizi <a data-act="scamlink">${DOST_SCAM}/kazan</a> adresine girin. ⏰ Son 2 saat!` },
  { id: 'hasan', who: 'Hasan Demir', av: '👴', when: 'Dün', text: 'Bahçedeki domatesler kızardı 🍅 Komşulara da dağıttık.', pic: '🍅' },
];
const REQS = [
  { id: 'sahte', who: 'Hasan Demir', av: '👴', info: 'Ortak arkadaş: <b>0</b> · Hesap <b>2 gün önce</b> açıldı · 3 arkadaşı var · Paylaşımı yok' },
  { id: 'fatma', who: 'Fatma Kaya', av: '👵', info: 'Ortak arkadaş: <b>14</b> · Çınar Mahallesi · Hesap 6 yıl önce açıldı' },
];
const CONVS = {
  zeynep: { who: 'Zeynep Arslan', av: '👩', msgs: [['o', 'Merhaba canım, nasılsın? Pazar günü pazarda görüşelim mi?', 'Dün'], ['o', 'Çok acil bir durum var, kimseye söyleme lütfen 🙏 Kartım bloke oldu, 2.500 TL\'yi şu hesaba atar mısın? Yarın sabah geri veririm.', '10:12'], ['o', 'IBAN: TR00 0000 0000 0000 0000 0000 00 · Alıcı: Murat K.', '10:12']] },
  elif: { who: 'Elif Yıldız', av: '👧', msgs: [['o', 'Babaanne, bilgisayar kursu nasıl gidiyor? 😊', 'Dün'], ['m', 'Çok güzel, her hafta yeni şeyler öğreniyorum.', 'Dün']] },
};
const DEVICES = [
  { id: 'pc', name: '💻 Bu bilgisayar · Windows', place: 'İstanbul', when: 'Şu an etkin', now: true },
  { id: 'tel', name: '📱 Telefonum · Android', place: 'İstanbul', when: 'Dün' },
];

const DOST = {
  name: 'Dostlarım', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, user = ctx.desk.settings.user;
    st.pass ??= DOST_SIFRE;
    st.priv ||= { profil: 'herkes', gonderi: 'herkes', telefon: 'herkes', arkadas: 'herkes', konum: true };
    st.posts ||= [];
    st.reqs ||= {};
    st.conv ||= { zeynep: [], elif: [] };
    st.devices ||= DEVICES.map((d) => ({ ...d }));
    st.hidden ||= [];
    if (st.user && path === '/mesajlar/zeynep') st.readZ = true;
    if (path !== '/profil') st.viewAs = null; // “başkası nasıl görüyor” görünümü profilden çıkınca kapanır
    const err = st.err ? `<div class="ds-err">⚠ ${st.err}</div>` : '';
    const nreq = REQS.filter((r) => !st.reqs[r.id]).length;
    const head = `<header class="ds-head"><span class="ds-logo">👥 Dostlarım</span>${st.user ? `<nav><a data-href="${DOST_HOST}/akis">🏠 Akış</a><a data-href="${DOST_HOST}/profil">👤 Profilim</a><a data-href="${DOST_HOST}/mesajlar">💬 Mesajlar${st.readZ ? '' : ' <i>1</i>'}</a><a data-href="${DOST_HOST}/istekler">🤝 İstekler${nreq ? ` <i>${nreq}</i>` : ''}</a><a data-href="${DOST_HOST}/ayarlar">⚙ Ayarlar</a><button type="button" data-act="logout">⏻ Çıkış</button></nav>` : ''}</header>`;
    if (!st.user) {
      if (path === '/yedek' && st.waiting) {
        return page('Yedek kodla giriş - Dostlarım', `${head}<form class="ds-box" data-act="backup"><h1>🗝 Yedek kodla giriş</h1><p>İki adımlı doğrulamayı açarken indirdiğiniz ya da yazdığınız <b>yedek kodlardan birini</b> yazın. Her kod <b>yalnızca bir kez</b> kullanılır.</p>
          <label>Yedek kod<input name="kod" autocomplete="off" spellcheck="false" placeholder="ör. 1234 5678"></label>${err}<button class="ds-btn">Giriş</button>
          <p class="ds-small"><a data-href="${DOST_HOST}/">← Geri dön</a></p></form>`);
      }
      if (st.waiting) {
        return page('İki adımlı doğrulama - Dostlarım', `${head}<form class="ds-box" data-act="login2"><h1>📱 İki adımlı doğrulama</h1><p>Şifreniz doğru. Şimdi telefonunuza (<b>0555 *** ** 34</b>) gönderdiğimiz <b>6 haneli kodu</b> yazın.</p>
          <label>Doğrulama kodu<input name="kod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="______"></label>${err}<button class="ds-btn">Doğrula</button>
          <p class="ds-small">Telefonunuz yanınızda değil mi? <a data-href="${DOST_HOST}/yedek">Telefonuma erişemiyorum: yedek kod kullan</a></p>
          <p class="ds-note">🔒 Bu kodu kimseyle paylaşmayın. Dostlarım çalışanları sizden asla kod istemez.</p></form>`);
      }
      return page('Dostlarım: Giriş', `${head}<div class="ds-welcome"><div><h1>Dostlarınızla bağlantıda kalın</h1><p>Aileniz ve arkadaşlarınız ne paylaşıyor, görün.</p></div>
        <form class="ds-box" data-act="login"><h2>Giriş yap</h2><p class="ds-small">Alıştırma hesabı: <b>${DOST_MAIL}</b> · şifre <b>${st.pass === DOST_SIFRE ? DOST_SIFRE : 'yeni şifreniz'}</b></p>
        <label>E-posta<input name="mail" autocomplete="off" spellcheck="false" value="${esc(st.form?.mail ?? '')}"></label><label>Şifre<input name="pw" type="password" autocomplete="off"></label>${err}
        <button class="ds-btn">Giriş yap</button></form></div>`);
    }
    if (path === '/profil') {
      const pub = st.viewAs === 'public', P = st.priv;
      const see = (k) => !pub || P[k] === 'herkes';
      const body = pub && P.profil !== 'herkes'
        ? '<p class="ds-locked">🔒 Bu profil yalnızca arkadaşlarına açık. Arkadaşı olmayanlar yalnızca adını ve fotoğrafını görür.</p>'
        : `<dl class="ds-info">${see('telefon') ? `<dt>📞 Telefon</dt><dd>${PHONE}</dd>` : ''}<dt>🎂 Doğum günü</dt><dd>12 Mart</dd><dt>🏠 Yaşadığı yer</dt><dd>Çınar Mahallesi, İstanbul</dd>${see('arkadas') ? '<dt>👥 Arkadaşlar</dt><dd>86 arkadaş</dd>' : ''}</dl>
          ${st.posts.filter((p) => see('gonderi') && (!pub || p.kitle === 'herkes')).map(post).join('') || (pub ? '<p class="ds-small">Herkese açık paylaşım yok.</p>' : '')}`;
      return page('Profilim - Dostlarım', `${head}<div class="ds-main"><div class="ds-prof"><span class="ds-av big">🙂</span><div><h1>${esc(user)}</h1><p class="ds-small">${pub ? '👁 <b>Arkadaşınız olmayan biri</b> profilinizi böyle görüyor' : 'Sizin gördüğünüz profil'}</p></div>
        <button type="button" class="ds-btn ghost" data-act="viewas">${pub ? '↩ Kendi görünümüme dön' : '👁 Başkası nasıl görüyor?'}</button></div>${body}</div>`);
    }
    if (path === '/ayarlar') {
      const P = st.priv;
      return page('Ayarlar - Dostlarım', `${head}<div class="ds-main"><h1>⚙ Ayarlar</h1>
        <form class="ds-sec" data-form><h2>🔒 Gizlilik</h2>
        <label class="ds-row">Profilimi kimler görebilir? ${sel('profil', P.profil, ['herkes', 'arkadas'])}</label>
        <label class="ds-row">Gönderilerimi kimler görebilir? ${sel('gonderi', P.gonderi)}</label>
        <label class="ds-row">Telefon numaramı kimler görebilir? ${sel('telefon', P.telefon)}</label>
        <label class="ds-row">Arkadaş listemi kimler görebilir? ${sel('arkadas', P.arkadas)}</label>
        <label class="ds-row ds-chk"><input type="checkbox" name="konum" ${P.konum ? 'checked' : ''}> 📍 Paylaşımlarıma konumumu kendiliğinden ekle</label>
        <button type="button" class="ds-btn" data-act="privacy">Kaydet</button>${st.privOk ? '<span class="ds-ok">✔ Kaydedildi</span>' : ''}</form>
        <div class="ds-sec"><h2>🛡 Güvenlik</h2>
        <div class="ds-row"><span>📱 İki adımlı doğrulama: <b class="${st.twofa ? 'ds-on' : 'ds-off'}">${st.twofa ? 'Açık' : 'Kapalı'}</b></span>${st.twofa ? `<button type="button" class="ds-btn ghost small" data-act="codes">🗝 Yedek kodları göster</button>` : `<a class="ds-btn small" data-href="${DOST_HOST}/iki-adim">Aç</a>`}</div>
        <p class="ds-small">Açıkken şifrenizi öğrenen biri de giremez: girişte telefonunuza gelen kod da istenir.</p>
        ${st.showCodes ? codesHtml(st) : ''}</div>
        <form class="ds-sec" data-form><h2>🔑 Şifre değiştir</h2><label>Şu anki şifre<input name="eski" type="password" autocomplete="off"></label><label>Yeni şifre<input name="yeni" type="password" autocomplete="off"></label><label>Yeni şifre (tekrar)<input name="yeni2" type="password" autocomplete="off"></label>${st.passErr ? `<div class="ds-err">⚠ ${st.passErr}</div>` : ''}${st.passOk ? '<div class="ds-ok">✔ Şifreniz değişti.</div>' : ''}
        <button type="button" class="ds-btn" data-act="pass">Şifreyi değiştir</button></form>
        <div class="ds-sec"><h2>💻 Oturum açılan cihazlar</h2>${st.devices.map((d) => `<div class="ds-row ds-dev${d.unknown ? ' bad' : ''}"><span><b>${d.name}</b><small>${d.place} · ${d.when}</small></span>${d.now ? '<small>Bu cihaz</small>' : `<button type="button" class="ds-btn ghost small" data-act="devout" data-v="${d.id}">Oturumu kapat</button>`}</div>`).join('')}
        ${st.devices.length > 1 ? '<button type="button" class="ds-btn ghost" data-act="alldevout">Diğer bütün cihazlardan çıkış yap</button>' : ''}<p class="ds-small">Tanımadığınız bir cihaz görürseniz oturumunu kapatın ve şifrenizi hemen değiştirin.</p></div></div>`);
    }
    if (path === '/iki-adim') {
      if (st.twofa) return page('İki adımlı doğrulama - Dostlarım', `${head}<div class="ds-main"><h1>✅ İki adımlı doğrulama açık</h1>${codesHtml(st)}<p><a class="ds-btn" data-href="${DOST_HOST}/ayarlar">Bitti</a></p></div>`);
      const f = st.fa || {};
      const step = f.sent ? `<form class="ds-sec" data-act="faverify"><h2>2. Kodu yazın</h2><p>Telefonunuza (<b>0555 *** ** 34</b>) gelen 6 haneli kodu yazın.</p><label>Doğrulama kodu<input name="kod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="______"></label>${err}<button class="ds-btn">Doğrula ve aç</button></form>`
        : `<form class="ds-sec" data-act="fasend"><h2>1. Yöntem seçin</h2>
          <label class="ds-opt"><input type="radio" name="yol" value="sms" checked> <span><b>💬 SMS ile kod</b><small>Her girişte telefonunuza 6 haneli kod gelir. Telefon: 0555 *** ** 34</small></span></label>
          <label class="ds-opt"><input type="radio" name="yol" value="uyg"> <span><b>🔐 Doğrulama uygulaması</b><small>Telefona kurulan bir uygulama her 30 saniyede yeni kod üretir. İnternet ya da SMS gerekmez.</small></span></label>${err}
          <button class="ds-btn">Devam</button></form>`;
      return page('İki adımlı doğrulama - Dostlarım', `${head}<div class="ds-main"><h1>📱 İki adımlı doğrulamayı açın</h1><p>Girişte <b>şifrenizden sonra</b> bir de <b>telefonunuza gelen kod</b> sorulur. Şifrenizi biri öğrense bile telefonunuz olmadan giremez.</p>${step}</div>`);
    }
    if (path.startsWith('/mesajlar')) {
      const id = path.split('/')[2];
      const list = Object.entries(CONVS).map(([k, c]) => `<a class="ds-conv${k === id ? ' on' : ''}" data-href="${DOST_HOST}/mesajlar/${k}"><span class="ds-av">${c.av}</span><b>${c.who}</b>${k === 'zeynep' && !st.readZ ? '<i>1</i>' : ''}</a>`).join('');
      const c = CONVS[id];
      const chat = c ? `<div class="ds-chat"><div class="ds-chead"><span class="ds-av">${c.av}</span><b>${c.who}</b>${id === 'zeynep' ? `<button type="button" class="ds-btn ghost small" data-act="report" data-v="hacked">⚑ Şikâyet et</button>` : ''}</div>
        <div class="ds-msgs">${[...c.msgs, ...(st.conv[id] || [])].map(([f, t, w]) => `<div class="ds-msg ${f === 'm' ? 'me' : ''}">${esc(t)}<small>${w}</small></div>`).join('')}</div>
        ${st.reported?.hacked && id === 'zeynep' ? '<div class="ds-ok">✔ Bildiriminiz alındı. Hesabı inceleyeceğiz. Arkadaşınıza başka bir yoldan (telefonla) haber verin.</div>' : ''}
        <form class="ds-send" data-act="msg" data-v="${id}"><input name="t" placeholder="Bir mesaj yazın…" autocomplete="off"><button class="ds-btn small">Gönder</button></form></div>`
        : '<p class="ds-small">Soldan bir sohbet seçin.</p>';
      return page('Mesajlar - Dostlarım', `${head}<div class="ds-main ds-mbox"><div class="ds-convs">${list}</div>${chat}</div>`);
    }
    if (path === '/istekler') {
      return page('Arkadaşlık istekleri - Dostlarım', `${head}<div class="ds-main"><h1>🤝 Arkadaşlık istekleri</h1>${REQS.map((r) => {
        const s = st.reqs[r.id];
        return `<div class="ds-req"><span class="ds-av">${r.av}</span><div><b>${r.who}</b><small>${r.info}</small></div><div class="ds-acts">${s ? `<b class="ds-ok">${{ ok: '✔ Arkadaş oldunuz', del: '🗑 İstek silindi', report: '⚑ Sahte hesap olarak bildirildi' }[s]}</b>`
          : `<button type="button" class="ds-btn small" data-act="req" data-v="${r.id}:ok">Onayla</button><button type="button" class="ds-btn ghost small" data-act="req" data-v="${r.id}:del">Sil</button><button type="button" class="ds-btn ghost small" data-act="req" data-v="${r.id}:report">⚑ Sahte hesap</button>`}</div></div>`;
      }).join('')}
        <h2>👥 Arkadaşlarınız (86)</h2><div class="ds-req"><span class="ds-av">👴</span><div><b>Hasan Demir</b><small>Ortak arkadaş: 23 · Çınar Mahallesi · 8 yıldır arkadaşsınız</small></div></div>
        <div class="ds-req"><span class="ds-av">👩</span><div><b>Zeynep Arslan</b><small>Ortak arkadaş: 31 · Komşunuz</small></div></div><div class="ds-req"><span class="ds-av">👧</span><div><b>Elif Yıldız</b><small>Torununuz</small></div></div></div>`);
    }
    // Akış
    return page('Akış - Dostlarım', `${head}<div class="ds-main"><form class="ds-compose" data-form><span class="ds-av">🙂</span><textarea name="text" rows="2" placeholder="Ne düşünüyorsunuz, ${esc(user)}?"></textarea>
      <div class="ds-crow">Kimler görsün: ${sel('kitle', st.priv.gonderi)}<label class="ds-chk"><input type="checkbox" name="konum" ${st.priv.konum ? 'checked' : ''}> 📍 Konum ekle</label><button type="button" class="ds-btn" data-act="post">Paylaş</button></div>${err}</form>
      ${st.posts.slice().reverse().map(post).join('')}
      ${FEED.filter((p) => !st.hidden.includes(p.id)).map((p) => `<article class="ds-post${p.scam ? ' scam' : ''}"><header><span class="ds-av">${p.av}</span><div><b>${p.who}</b><small>${p.when}${p.page ? ' · Sayfa · 3 gün önce açıldı' : ''}</small></div>
        <button type="button" class="ds-btn ghost small" data-act="report" data-v="${p.id}">⚑ Şikâyet et</button></header><p>${p.text}</p>${p.pic ? `<div class="ds-pic">${p.pic}</div>` : ''}
        <footer><button type="button" data-act="like" data-v="${p.id}">👍 Beğen</button><button type="button" data-act="share" data-v="${p.id}">↗ Paylaş</button></footer></article>`).join('')}</div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    st.err = '';
    const arg = el?.dataset.v;
    const sms = (c) => { if (st.noSms) return; st.smsEl?.remove(); st.smsEl = ctx.desk.toast('SMS · DOSTLARIM', `Doğrulama kodunuz: <b>${c}</b>. Bu kodu kimseyle paylaşmayın.`, '💬', 40000); };
    const smsDone = () => { st.smsEl?.remove(); st.smsEl = null; };
    const enter = (via) => { st.user = true; st.waiting = false; smsDone(); ctx.emit('ds-login', { via }); ctx.go('/akis'); };
    if (a === 'login') {
      st.form = v;
      if (v.mail.toLowerCase().trim() !== DOST_MAIL || v.pw !== st.pass) { st.err = 'E-posta ya da şifre yanlış.'; ctx.emit('ds-login-err'); ctx.refresh(); return; }
      if (!st.twofa) { enter('pass'); return; }
      st.waiting = true; st.code = code(6);
      ctx.refresh();
      setTimeout(() => sms(st.code), 700);
      ctx.emit('ds-login-code');
      return;
    }
    if (a === 'login2') {
      if (digits(v.kod) !== st.code) { st.err = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; ctx.emit('ds-code-err'); ctx.refresh(); return; }
      enter('sms');
      return;
    }
    if (a === 'backup') {
      const k = digits(v.kod);
      const hit = (st.backup || []).find((b) => digits(b) === k);
      if (!hit) { st.err = 'Bu yedek kod geçersiz. Kodu harf harf, rakam rakam kontrol edin.'; ctx.emit('ds-code-err', { backup: true }); ctx.refresh(); return; }
      if ((st.used ||= []).includes(hit)) { st.err = 'Bu yedek kod daha önce kullanıldı. Listeden başka bir kod seçin.'; ctx.emit('ds-code-err', { backup: true, used: true }); ctx.refresh(); return; }
      st.used.push(hit);
      enter('backup');
      return;
    }
    if (a === 'logout') { st.user = false; st.viewAs = null; st.showCodes = false; ctx.emit('ds-logout'); ctx.go('/'); return; }
    if (a === 'viewas') { st.viewAs = st.viewAs === 'public' ? null : 'public'; ctx.emit('ds-viewas', { pub: st.viewAs === 'public', priv: { ...st.priv } }); ctx.refresh(); return; }
    if (a === 'privacy') {
      st.priv = { profil: v.profil, gonderi: v.gonderi, telefon: v.telefon, arkadas: v.arkadas, konum: !!v.konum };
      st.privOk = true;
      ctx.emit('ds-privacy', { ...st.priv });
      ctx.refresh();
      setTimeout(() => { st.privOk = false; }, 0);
      return;
    }
    if (a === 'post') {
      const text = String(v.text || '').trim();
      if (!text) { st.err = 'Önce bir şey yazın.'; ctx.refresh(); return; }
      st.posts.push({ text, kitle: v.kitle, konum: !!v.konum, when: 'Az önce' });
      ctx.emit('ds-post', { text, audience: v.kitle, location: !!v.konum });
      ctx.refresh();
      return;
    }
    if (a === 'like' || a === 'share') { ctx.emit('ds-' + a, { id: arg }); if (a === 'share' && arg === 'cekilis') ctx.desk.toast('Dikkat', 'Çekiliş tuzağını paylaşırsanız arkadaşlarınız da kandırılabilir.', '⚠', 5000); return; }
    if (a === 'scamlink') { ctx.emit('ds-scam-link'); ctx.desk.toast('Bu bir tuzak olabilir!', `<b>${DOST_SCAM}</b> Dostlarım'ın adresi değil. Gerçek çekilişte kart bilgisi ve “kargo ücreti” istenmez.`, '⚠', 8000); return; }
    if (a === 'report') {
      (st.reported ||= {})[arg] = true;
      if (FEED.some((p) => p.id === arg)) st.hidden.push(arg);
      ctx.emit('ds-report', { id: arg });
      ctx.desk.toast('Şikâyetiniz alındı', arg === 'hacked' ? 'Hesap incelemeye alındı. Arkadaşınızı bildiğiniz numarasından arayıp haber verin.' : 'Gönderi sizin akışınızdan kaldırıldı ve incelemeye alındı.', '⚑', 5000);
      ctx.refresh();
      return;
    }
    if (a === 'req') { const [id, what] = arg.split(':'); st.reqs[id] = what; ctx.emit('ds-request', { id, action: what }); ctx.refresh(); return; }
    if (a === 'msg') {
      const t = String(v.t || '').trim();
      if (!t) return;
      (st.conv[arg] ||= []).push(['m', t, 'Şimdi']);
      ctx.emit('ds-msg-send', { to: arg, text: t });
      ctx.refresh();
      return;
    }
    if (a === 'fasend') {
      if (v.yol === 'uyg') { st.err = 'Bu alıştırmada telefonunuzda doğrulama uygulaması yok. <b>SMS ile kod</b>\'u seçin.'; ctx.emit('ds-2fa-method', { method: 'uyg' }); ctx.refresh(); return; }
      st.fa = { sent: true, code: code(6) };
      ctx.emit('ds-2fa-method', { method: 'sms' });
      ctx.refresh();
      setTimeout(() => sms(st.fa.code), 700);
      return;
    }
    if (a === 'faverify') {
      if (digits(v.kod) !== st.fa?.code) { st.err = 'Kod hatalı. SMS\'teki 6 haneli kodu yazın.'; ctx.emit('ds-code-err'); ctx.refresh(); return; }
      smsDone();
      st.twofa = 'sms'; st.fa = null; st.used = [];
      st.backup = Array.from({ length: 8 }, () => `${code(4)} ${code(4)}`);
      ctx.emit('ds-2fa-on', { method: 'sms' });
      ctx.refresh();
      return;
    }
    if (a === 'codes') { st.showCodes = !st.showCodes; ctx.refresh(); return; }
    if (a === 'dlcodes') {
      const txt = `Dostlarım yedek kodlarım (${DOST_MAIL})\nTelefonunuza ulaşamazsanız bu kodlardan biriyle giriş yapabilirsiniz.\nHer kod yalnızca bir kez kullanılır. Bu kâğıdı kimseye göstermeyin.\n\n${st.backup.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n`;
      ctx.download('dostlarim-yedek-kodlar.txt', txt);
      ctx.emit('ds-backup-dl');
      return;
    }
    if (a === 'pass') {
      st.passErr = ''; st.passOk = false;
      if (v.eski !== st.pass) st.passErr = 'Şu anki şifreniz yanlış.';
      else if (String(v.yeni).length < 8) st.passErr = 'Yeni şifre en az 8 karakter olmalı.';
      else if (v.yeni === st.pass) st.passErr = 'Yeni şifre eskisiyle aynı olamaz.';
      else if (!/\d/.test(v.yeni) || !/[a-zçğıöşü]/.test(v.yeni) || !/[A-ZÇĞİÖŞÜ]/.test(v.yeni)) st.passErr = 'Büyük harf, küçük harf ve rakam kullanın.';
      else if (v.yeni !== v.yeni2) st.passErr = 'İki yeni şifre aynı değil.';
      if (!st.passErr) { st.pass = v.yeni; st.passOk = true; }
      ctx.emit('ds-pass', { ok: !st.passErr });
      ctx.refresh();
      return;
    }
    if (a === 'devout' || a === 'alldevout') {
      const out = st.devices.filter((d) => !d.now && (a === 'alldevout' || d.id === arg));
      st.devices = st.devices.filter((d) => !out.includes(d));
      ctx.emit('ds-device-out', { ids: out.map((d) => d.id), unknown: out.some((d) => d.unknown), left: st.devices.length });
      ctx.refresh();
    }
  },
};

function post(p) {
  return `<article class="ds-post mine"><header><span class="ds-av">🙂</span><div><b>Siz</b><small>${p.when} · ${KITLE[p.kitle]?.[0] || ''} ${KITLE[p.kitle]?.[1] || ''}${p.konum ? ' · 📍 Çınar Mahallesi, İstanbul' : ''}</small></div></header><p>${esc(p.text)}</p></article>`;
}
function codesHtml(st) {
  return `<div class="ds-codes"><h2>🗝 Yedek kodlarınız</h2><p>Telefonunuz kaybolur ya da bozulursa bu kodlarla girersiniz. Her kod <b>bir kez</b> kullanılır. İndirip saklayın ya da bir kâğıda yazıp evde güvenli bir yere koyun.</p>
    <ol>${st.backup.map((b) => `<li class="${st.used?.includes(b) ? 'used' : ''}">${b}</li>`).join('')}</ol><button type="button" class="ds-btn" data-act="dlcodes">⬇ Yedek kodları indir (.txt)</button></div>`;
}

export const SOSYAL_SITES = { [DOST_HOST]: DOST };
