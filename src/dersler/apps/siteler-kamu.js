// 14. hafta siteleri (uydurma): Çınar Belediyesi Çözüm Merkezi (sokaktaki arızayı fotoğraflı bildirmek, başvuru takibi)
// ve CİMER (kuruma başvurup sonuç alamayınca; e-Devlet oturumuyla giriş).
import { esc, pictureURL, isImage } from './util.js';
import { KURS_HOST } from './siteler-foto.js';

export const BELEDIYE_HOST = 'www.cinar.bel.tr';
export const CIMER_HOST = 'www.cimer.gov.tr';
const KONULAR = ['Sokak lambası yanmıyor', 'Yolda çukur / bozuk kaldırım', 'Çöp toplanmadı', 'Su arızası', 'Başıboş hayvan', 'Diğer'];
const KURUMLAR = ['Çınar Belediyesi', 'Sosyal Güvenlik Kurumu', 'Sağlık Bakanlığı', 'Milli Eğitim Bakanlığı'];
const TURLER = ['Şikâyet', 'İstek', 'Bilgi edinme', 'Öneri'];
const code = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const digits = (s) => String(s || '').replace(/\D/g, '');
const page = (title, cls, html) => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
const opts = (list, cur) => `<option value="">Seçiniz</option>${list.map((k) => `<option${cur === k ? ' selected' : ''}>${k}</option>`).join('')}`;

const BELEDIYE = {
  name: 'Çınar Belediyesi', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, f = st.form || {};
    const head = `<header class="bl-head">🏛 Çınar Belediyesi<nav><a data-href="${BELEDIYE_HOST}">Ana sayfa</a><a data-href="${BELEDIYE_HOST}/cozum">Çözüm Merkezi</a><a data-href="${BELEDIYE_HOST}/takip">Başvurum ne oldu?</a></nav></header>`;
    const err = st.err ? `<div class="bl-err">⚠ ${st.err}</div>` : '';
    if (path === '/cozum') {
      if (st.done) {
        return page('Başvurunuz alındı - Çınar Belediyesi', 'bl', `${head}<div class="bl-main"><div class="bl-ok"><h1>✔ Başvurunuz alındı</h1><p>Başvuru numaranız: <b class="bl-no">${st.done.no}</b></p>
          <p>Bu numarayı not edin; <b>Başvurum ne oldu?</b> sayfasından durumunu takip edebilirsiniz. Ekip genellikle 3 iş günü içinde gelir.</p></div></div>`);
      }
      return page('Çözüm Merkezi - Çınar Belediyesi', 'bl', `${head}<div class="bl-main"><h1>📣 Çözüm Merkezi: Talep ve Şikâyet</h1><form class="bl-form" data-form>
        <label>Konu<select name="konu">${opts(KONULAR, f.konu)}</select></label>
        <label>Sorunun adresi (mahalle, sokak, kapı no)<input name="adres" value="${esc(f.adres || '')}" placeholder="ör. Çiçek Mah. Lale Sokak No: 5 önü" autocomplete="off"></label>
        <label>Açıklama<textarea name="acik" rows="3" placeholder="Sorunu kısaca anlatın">${esc(f.acik || '')}</textarea></label>
        <div class="bl-photo"><b>Fotoğraf</b> <small>(isteğe bağlı ama ekibin yeri bulmasını kolaylaştırır)</small><button type="button" class="bl-pick" data-act="photo">📎 Fotoğraf ekle</button>
          ${st.photo ? `<div class="bl-file"><img src="${pictureURL(st.photo.content)}" alt=""><span>✔ ${esc(st.photo.name)}</span></div>` : ''}</div>
        <label>Adınız soyadınız<input name="ad" value="${esc(f.ad || '')}" autocomplete="off"></label>
        <label>Cep telefonunuz<input name="tel" value="${esc(f.tel || '')}" inputmode="numeric" placeholder="05__ ___ __ __" autocomplete="off"></label>${err}
        <button type="button" class="bl-go" data-act="send">Başvuruyu gönder</button></form></div>`);
    }
    if (path === '/takip') {
      const t = st.track;
      return page('Başvuru takibi - Çınar Belediyesi', 'bl', `${head}<div class="bl-main"><h1>🔎 Başvurum ne oldu?</h1><form class="bl-form" data-act="track"><label>Başvuru numarası<input name="no" value="${esc(t?.no || '')}" placeholder="ÇB-2026-00000" autocomplete="off"></label><button class="bl-go">Sorgula</button></form>
        ${t ? (t.ok ? `<ol class="bl-steps"><li class="on">Başvuru alındı</li><li class="on">Fen İşleri Müdürlüğü'ne iletildi</li><li>Ekip yönlendirildi</li><li>Sonuçlandı</li></ol>` : '<div class="bl-err">Bu numarayla bir başvuru bulunamadı.</div>') : ''}</div>`);
    }
    return page('Çınar Belediyesi', 'bl', `${head}<div class="bl-main"><h1>Hoş geldiniz</h1><div class="bl-grid">
      <a class="bl-card" data-href="${BELEDIYE_HOST}/cozum">📣<b>Çözüm Merkezi</b><small>Sokak lambası, çukur, çöp… arıza ve şikâyet bildirin</small></a>
      <a class="bl-card" data-href="${BELEDIYE_HOST}/takip">🔎<b>Başvurum ne oldu?</b><small>Başvuru numarasıyla durumu sorgulayın</small></a>
      <a class="bl-card" data-href="${KURS_HOST}">🎭<b>Kültür Merkezi</b><small>Kurs başvuruları</small></a>
      <div class="bl-card">☎<b>Beyaz Masa: 153</b><small>Telefonla da bildirebilirsiniz</small></div></div></div>`);
  },
  async act(a, v, ctx) {
    const st = ctx.state;
    st.err = '';
    if (a === 'photo') {
      st.form = { ...st.form, ...v };
      const r = await ctx.desk.dialogs.file({ mode: 'open', fs: ctx.desk.fs.dialogApi(), folder: 'pictures', ext: '.jpg', typeLabel: 'Resimler (*.jpg; *.png)', accept: /\.(png|jpe?g)$/i });
      if (!r) return;
      const n = ctx.desk.fs.find(r.folder, r.name);
      if (n && isImage(r.name)) { st.photo = { name: r.name, content: n.content }; ctx.emit('belediye-photo', { name: r.name }); }
      ctx.refresh();
      return;
    }
    if (a === 'send') {
      st.form = v;
      if (!v.konu) st.err = 'Konuyu seçin.';
      else if ((v.adres || '').length < 8) st.err = 'Ekibin yeri bulabilmesi için adresi açık yazın (mahalle, sokak).';
      else if ((v.acik || '').length < 10) st.err = 'Sorunu birkaç kelimeyle anlatın.';
      else if (!v.ad) st.err = 'Adınızı yazın.';
      else if (!/^05\d{9}$/.test(digits(v.tel))) st.err = 'Telefon 05 ile başlamalı ve 11 haneli olmalı.';
      ctx.emit('belediye-form', { ok: !st.err });
      if (st.err) { ctx.refresh(); return; }
      st.done = { no: 'ÇB-2026-' + code(5), konu: v.konu, photo: !!st.photo };
      ctx.emit('belediye-basvuru', { konu: v.konu, photo: !!st.photo, no: st.done.no });
      ctx.refresh();
      return;
    }
    if (a === 'track') {
      const no = String(v.no || '').toLocaleUpperCase('tr').replace(/\s/g, '');
      st.track = { no, ok: !!st.done && no === st.done.no.toLocaleUpperCase('tr') };
      ctx.emit('belediye-track', { ok: st.track.ok });
      ctx.refresh();
    }
  },
};

const CIMER = {
  name: 'CİMER', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, f = st.form || {};
    const head = '<header class="cm-head">🇹🇷 CİMER <span>Cumhurbaşkanlığı İletişim Merkezi</span></header>';
    if (st.done) {
      return page('Başvurunuz alındı - CİMER', 'cm', `${head}<div class="cm-main"><div class="bl-ok"><h1>✔ Başvurunuz alındı</h1><p>Başvuru numaranız: <b>${st.done.no}</b></p><p>Başvurunuz <b>${esc(st.done.kurum)}</b>'ne iletilecek. Cevap en geç <b>30 gün</b> içinde e-Devlet ve e-posta yoluyla bildirilir.</p></div></div>`);
    }
    if (!st.user) {
      return page('CİMER', 'cm', `${head}<div class="cm-main"><h1>Başvuru yapın</h1><p>Kamu kurumlarıyla ilgili şikâyet, istek ve önerilerinizi buradan iletebilirsiniz.</p>
        <div class="cm-tip">💡 Önce sorunu ilgili kuruma (ör. belediyeye) bildirin. Sonuç alamazsanız CİMER'e başvurun ve <b>önceki başvuru numaranızı</b> yazın.</div>
        <button type="button" class="cm-go" data-act="login">🇹🇷 e-Devlet ile giriş yap</button>${st.err ? `<div class="bl-err">⚠ ${st.err}</div>` : ''}</div>`);
    }
    return page('Yeni başvuru - CİMER', 'cm', `${head}<div class="cm-main"><h1>📝 Yeni başvuru</h1><form class="bl-form" data-form>
      <fieldset class="cm-tur"><legend>Başvuru türü</legend>${TURLER.map((t) => `<label><input type="radio" name="tur" value="${t}" ${f.tur === t ? 'checked' : ''}> ${t}</label>`).join('')}</fieldset>
      <label>İlgili kurum<select name="kurum">${opts(KURUMLAR, f.kurum)}</select></label>
      <label>Daha önce kuruma başvurdunuz mu? Başvuru numarası<input name="onceki" value="${esc(f.onceki || '')}" placeholder="ör. ÇB-2026-00000 (yoksa boş bırakın)" autocomplete="off"></label>
      <label>Başvuru metni<textarea name="metin" rows="4" placeholder="Ne oldu, ne zaman, ne istiyorsunuz? Kısa ve açık yazın.">${esc(f.metin || '')}</textarea></label>${st.err ? `<div class="bl-err">⚠ ${st.err}</div>` : ''}
      <button type="button" class="cm-go" data-act="send">Başvuruyu gönder</button></form></div>`);
  },
  act(a, v, ctx) {
    const st = ctx.state;
    st.err = '';
    if (a === 'login') {
      const ed = ctx.desk.webState?.['turkiye.gov.tr'];
      if (!ed?.user) { st.err = 'Önce e-Devlet\'e giriş yapın (turkiye.gov.tr), sonra bu sayfaya dönüp yeniden deneyin.'; ctx.emit('cimer-login', { ok: false }); ctx.refresh(); return; }
      st.user = true;
      ctx.desk.toast('e-Devlet ile giriş', 'Açık olan e-Devlet oturumunuzla CİMER\'e girdiniz.', '🇹🇷', 4000);
      ctx.emit('cimer-login', { ok: true });
      ctx.refresh();
      return;
    }
    if (a === 'send') {
      st.form = v;
      if (!v.tur) st.err = 'Başvuru türünü seçin.';
      else if (!v.kurum) st.err = 'İlgili kurumu seçin.';
      else if ((v.metin || '').length < 30) st.err = 'Başvuru metni çok kısa. Ne olduğunu, nerede ve ne zamandan beri olduğunu yazın.';
      ctx.emit('cimer-form', { ok: !st.err });
      if (st.err) { ctx.refresh(); return; }
      const prev = ctx.desk.webState?.['cinar.bel.tr']?.done?.no; // belediyeye yapılan başvurunun numarası
      st.done = { no: 'CMR-' + code(9), kurum: v.kurum };
      ctx.emit('cimer-basvuru', { tur: v.tur, kurum: v.kurum, prior: !!v.onceki, priorOk: !!prev && v.onceki.toLocaleUpperCase('tr').replace(/\s/g, '') === prev.toLocaleUpperCase('tr') });
      ctx.refresh();
    }
  },
};

export const KAMU_SITES = { [BELEDIYE_HOST]: BELEDIYE, [CIMER_HOST]: CIMER };
