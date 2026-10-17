// Mesajlaş Web: telefondaki mesajlaşma uygulamasını (WhatsApp gibi) bilgisayarda kullanmak. Uydurma site.
// Karekodu telefonla okutmak, sohbet, belge ve fotoğraf göndermek, gelen fotoğrafı indirmek, oturumu kapatmak, sahte mesaj bağlantısı.
import { esc, pictureURL, isImage } from './util.js';
import { fmtSize } from './explorer.js';
import { YONETICI } from './siteler-banka.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
export const WA_HOST = 'web.mesajlas.com';

const CONTACTS = [
  { id: 'elif', name: 'Elif (torunum)', av: '👧', last: 'Fotoğraflar geldi mi?' },
  { id: 'ahmet', name: 'Ahmet (oğlum)', av: '👨', last: 'Bankada lazım olacak belge' },
  { id: 'komsu', name: 'Mahalle Komşuları', av: '🏘', last: 'Cumartesi toplantı' },
  { id: 'yonetici', name: 'Hasan Bey (apt. yöneticisi)', av: '🏢', last: 'Ekim aidatı' },
  { id: 'bilinmeyen', name: '+90 555 010 99 88', av: '❓', last: 'Hesabınız kapatılacak' },
];
const seed = () => ({
  elif: [{ f: 'o', t: 'Dedeciğim, bayramda çektiğimiz fotoğrafları gönderiyorum. Geldi mi?', time: '10:02' }, { f: 'o', kind: 'photo', name: 'bayram sofrası.jpg', content: { emoji: '🍽', bg: ['#ffe082', '#ffab91'] }, time: '10:03' }],
  ahmet: [{ f: 'o', t: 'Baba, bankada işim var. İkametgâh belgeni (PDF) buradan gönderir misin? Masaüstünde duruyor olmalı.', time: '09:15' }],
  komsu: [{ f: 'o', who: 'Fatma Hanım', t: 'Cumartesi 14.00\'te bahçede toplantı var, herkes gelsin 🙂', time: 'Dün' }, { f: 'o', who: 'Mehmet Bey', t: 'Ben de geleceğim.', time: 'Dün' }],
  yonetici: [{ f: 'o', t: `Merhaba komşum, Ekim ayı aidatı ${YONETICI.aidat} ₺. Apartman hesabı benim adıma: ${YONETICI.ad}`, time: '09:30' }, { f: 'o', t: `IBAN: ${YONETICI.iban}`, time: '09:30' }, { f: 'o', t: 'Açıklamaya daire numaranızı yazın lütfen. Ödeyince dekontu buraya atarsanız sevinirim 🙏', time: '09:31' }],
  bilinmeyen: [{ f: 'o', t: '⚠ Mesajlaş hesabınız 24 saat içinde kapatılacaktır! Kapanmaması için hemen doğrulayın:', time: '08:40' }, { f: 'o', kind: 'link', t: 'mesajlas-dogrulama.xyz/hesabi-koru', time: '08:40' }],
});
const REPLY = {
  elif: (m) => (m.kind === 'photo' ? 'Çok güzel olmuş dedeciğim! 😍' : m.kind === 'doc' ? 'Teşekkürler dede, aldım.' : 'Tamam dedeciğim 💙'),
  ahmet: (m) => (m.kind === 'doc' && /ikametg/i.test(m.name) ? 'Teşekkürler baba, belgeyi aldım 👍 Bu iş tamam.' : m.kind === 'doc' ? 'Bu başka bir dosya galiba baba, ikametgâh belgesini gönderir misin?' : 'Tamam baba.'),
  komsu: () => 'Teşekkürler! 👍',
  yonetici: (m) => (m.kind === 'doc' && /dekont/i.test(m.name) ? 'Dekont geldi, aidatınız ulaştı. Teşekkür ederim 🙏' : m.kind === 'doc' ? 'Bu dekont değil galiba; bankadan indirdiğiniz dekontu gönderir misiniz?' : 'Tamamdır 👍'),
  bilinmeyen: () => '',
};
const qrSvg = () => {
  const N = 25, cells = [];
  const fnd = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on;
    if (fnd(x, y)) {
      const [a, b] = [[0, 0], [N - 7, 0], [0, N - 7]].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
      const dx = x - a, dy = y - b;
      on = dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    } else on = ((x * 7 + y * 13 + x * y * 3) % 5) < 2;
    if (on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
  }
  return `<svg viewBox="-1 -1 ${N + 2} ${N + 2}" class="wa-qrsvg" role="img" aria-label="Karekod (QR)"><rect x="-1" y="-1" width="${N + 2}" height="${N + 2}" fill="#fff"/>${cells.join('')}</svg>`;
};

const WA = {
  name: 'Mesajlaş Web', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.msgs ||= seed();
    st.chat ??= 0;
    if (!st.linked) {
      return page('Mesajlaş Web', `<div class="wa-qr"><div class="wa-left"><h1>💬 Mesajlaş Web</h1><h2>Telefonunuzdaki mesajları bilgisayarda kullanın</h2>
        <ol><li>Telefonunuzda <b>Mesajlaş</b> uygulamasını açın.</li><li>Sağ üstteki <b>⋮</b> işaretine, sonra <b>Bağlı cihazlar</b> → <b>Cihaz bağla</b>'ya dokunun.</li><li>Telefonunuzu bu ekrandaki <b>karekoda</b> (QR kodu) doğrultun.</li></ol>
        <p class="wa-warn">⚠ Yalnızca <b>kendi</b> bilgisayarınızda açın. Ortak bilgisayarda işiniz bitince mutlaka <b>oturumu kapatın</b>.</p></div>
        <div class="wa-right"><div class="wa-code">${qrSvg()}<small>Karekod birkaç dakikada bir yenilenir</small></div>
        <div class="wa-phone"><span>📱</span><button type="button" class="ed-btn" data-act="scan">📷 Telefonla karekodu okut</button><small>Alıştırma: gerçek telefonunuz yerine bu düğme karekodu okutur.</small></div></div></div>`, 'wa');
    }
    const cur = CONTACTS[st.chat], msgs = st.msgs[cur.id];
    const bubble = (m, i) => {
      const me = m.f === 'm';
      const body = m.kind === 'photo' ? `<div class="wa-photo"><img src="${pictureURL(m.content)}" alt="${esc(m.name)}"><small>${esc(m.name)}</small>${me ? '' : `<button type="button" class="wa-dl" data-act="dl" data-i="${i}">⬇ İndir</button>`}</div>`
        : m.kind === 'doc' ? `<div class="wa-doc"><span>${/\.pdf$/i.test(m.name) ? '📕' : '📄'}</span><div><b>${esc(m.name)}</b><small>${esc(m.size || '')}</small></div></div>`
        : m.kind === 'link' ? `<a class="wa-link" data-act="scamlink">${esc(m.t)}</a>` : esc(m.t);
      return `<div class="wa-msg ${me ? 'me' : 'them'}">${m.who ? `<b class="wa-who">${esc(m.who)}</b>` : ''}${body}<span class="wa-time">${esc(m.time)}${me ? ' ✓✓' : ''}</span></div>`;
    };
    return page('Mesajlaş Web', `<div class="wa-app"><aside class="wa-list"><div class="wa-me"><span>👤 Ben</span><span class="wa-mwrap"><button type="button" class="wa-menu" data-act="menu" title="Menü">⋮</button>${st.menu ? '<div class="wa-dd"><button type="button" data-act="logout">⏻ Oturumu kapat</button></div>' : ''}</span></div>
        ${CONTACTS.map((c, i) => `<button type="button" class="wa-ct${i === st.chat ? ' on' : ''}" data-act="chat" data-i="${i}"><span class="wa-av">${c.av}</span><div><b>${esc(c.name)}</b><small>${esc(c.last)}</small></div></button>`).join('')}</aside>
        <section class="wa-chat"><header><span class="wa-av">${cur.av}</span><b>${esc(cur.name)}</b><small>${cur.id === 'bilinmeyen' ? 'kayıtlı değil' : 'çevrimiçi'}</small></header>
        <div class="wa-msgs">${msgs.map(bubble).join('')}</div>
        <form class="wa-comp" data-act="send"><button type="button" class="wa-att" data-act="attach" title="Belge ya da fotoğraf ekle">📎</button><input name="msg" placeholder="Bir mesaj yazın" autocomplete="off"><button class="wa-send" title="Gönder">➤</button></form></section></div>`, 'wa');
  },
  mount(el) { const m = el.querySelector('.wa-msgs'); if (m) m.scrollTop = m.scrollHeight; return 0; },
  async act(a, v, ctx, el) {
    const st = ctx.state;
    const cur = () => CONTACTS[st.chat];
    const clock = () => ctx.desk.now().toTimeString().slice(0, 5);
    const reply = (m) => {
      const who = cur().id, text = REPLY[who](m);
      if (!text) return;
      setTimeout(() => { if (!st.linked) return; st.msgs[who].push({ f: 'o', t: text, time: clock() }); ctx.refresh(); ctx.emit('wa-reply', { from: cur().name }); }, 1600);
    };
    if (a === 'scan') { st.linked = true; ctx.desk.toast('Telefon bağlandı', 'Mesajlaş Web artık telefonunuzla eşleşti.', '✅'); ctx.emit('wa-scan'); ctx.refresh(); return; }
    if (a === 'menu') { st.menu = !st.menu; ctx.refresh(); return; }
    if (a === 'logout') { st.linked = false; st.menu = false; ctx.emit('wa-logout'); ctx.desk.toast('Oturum kapatıldı', 'Bu bilgisayardan çıkış yaptınız; mesajlarınıza kimse bakamaz.', '🔒'); ctx.refresh(); return; }
    if (a === 'chat') { st.chat = +el.dataset.i; st.menu = false; ctx.emit('wa-chat', { name: cur().name }); ctx.refresh(); return; }
    if (a === 'send') {
      if (!v.msg) return;
      const m = { f: 'm', t: v.msg, time: clock() };
      st.msgs[cur().id].push(m);
      ctx.emit('wa-send', { text: v.msg, to: cur().name, toId: cur().id });
      ctx.refresh();
      reply(m);
      return;
    }
    if (a === 'attach') {
      const r = await ctx.desk.dialogs.file({ mode: 'open', fs: ctx.desk.fs.dialogApi(), folder: 'desktop', ext: '', typeLabel: 'Bütün dosyalar (*.*)', accept: /./ });
      if (!r) return;
      const n = ctx.desk.fs.find(r.folder, r.name);
      const img = isImage(r.name);
      const m = img ? { f: 'm', kind: 'photo', name: r.name, content: n?.content, time: clock() } : { f: 'm', kind: 'doc', name: r.name, size: fmtSize(ctx.desk.fs.sizeOf(n || { name: r.name, content: '', type: 'file' })), time: clock() };
      st.msgs[cur().id].push(m);
      ctx.emit('wa-send-doc', { name: r.name, to: cur().name, toId: cur().id, image: img });
      ctx.refresh();
      reply(m);
      return;
    }
    if (a === 'dl') {
      const m = st.msgs[cur().id][+el.dataset.i];
      ctx.download(m.name, m.content);
      ctx.emit('wa-download', { name: m.name });
      return;
    }
    if (a === 'scamlink') {
      ctx.emit('wa-scam-click');
      ctx.desk.dialogs.ask({ title: 'Dikkat!', icon: '⚠', text: 'Bu bağlantı Mesajlaş\'a değil, <b>mesajlas-dogrulama.xyz</b> adlı yabancı bir siteye gidiyor. Gerçek uygulama hesabınızı bağlantıyla “doğrulamanızı” asla istemez. Tanımadığınız numaradan gelen böyle bağlantılara tıklamayın.', buttons: [['ok', 'Anladım', true]] });
    }
  },
};

export const MESAJ_SITES = { [WA_HOST]: WA };
