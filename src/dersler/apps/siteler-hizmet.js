// 14. hafta siteleri (uydurma): e-Nabız (reçete, tahlil sonucu, aile hekimi) ve İlan Pazarı (emlak araması, sahte ilan ve kapora tuzağı)
import { esc } from './util.js';
import { KURS_TC } from './siteler-gunluk.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
const digits = (s) => String(s || '').replace(/\D/g, '');
const tl = (n) => n.toLocaleString('tr-TR') + ' ₺';

// ======================================================================= e-Nabız
const TAHLIL = [
  { id: 'kan', ad: 'Tam kan sayımı', tarih: '12 Ekim 2026', kurum: 'Devlet Hastanesi', rows: [['Hemoglobin', '13,8 g/dL', '12–16', true], ['Lökosit', '6,2 bin/µL', '4–10', true], ['Trombosit', '245 bin/µL', '150–400', true]] },
  { id: 'seker', ad: 'Açlık kan şekeri', tarih: '12 Ekim 2026', kurum: 'Devlet Hastanesi', rows: [['Glukoz (açlık)', '108 mg/dL', '70–100', false], ['HbA1c', '5,8 %', '4–5,6', false]] },
  { id: 'kolesterol', ad: 'Kolesterol paneli', tarih: '3 Eylül 2026', kurum: 'Aile Sağlığı Merkezi', rows: [['Total kolesterol', '186 mg/dL', '<200', true], ['LDL', '112 mg/dL', '<130', true], ['Trigliserid', '140 mg/dL', '<150', true]] },
];
const RECETE = [
  ['12 Ekim 2026', 'Metformin 500 mg', 'Dr. Selin Aksoy', 'Kullanılabilir'],
  ['12 Ekim 2026', 'D vitamini damla', 'Dr. Selin Aksoy', 'Kullanılabilir'],
  ['3 Eylül 2026', 'Tansiyon ilacı 5 mg', 'Dr. Mehmet Kara', 'Kullanıldı'],
];
const nbHead = (st) => `<header class="ed-head nb-head">🩺 e-Nabız<nav><a data-href="enabiz.gov.tr">Ana sayfa</a>${st.user ? `<span class="ed-user">👤 ${esc(st.name)}</span><button type="button" class="ed-out" data-act="logout">⏻ Çıkış</button>` : ''}</nav></header>`;

const ENABIZ = {
  name: 'e-Nabız', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, head = nbHead(st);
    if (!st.user) {
      return page('e-Nabız: Giriş', `${head}<div class="ed-login"><h1>Sağlık bilgilerinize güvenle ulaşın</h1><p>e-Nabız'a girmek için kimliğiniz <b>e-Devlet</b> üzerinden doğrulanır.</p>
        <button type="button" class="ed-btn" data-act="edevlet">🇹🇷 e-Devlet ile giriş yap</button>
        <p class="ed-small">Şifrenizi bu sayfaya <b>yazmazsınız</b>: e-Devlet'in kendi sayfasına yönlendirilirsiniz, işiniz bitince buraya dönersiniz.</p></div>`);
    }
    if (path === '/recete') {
      return page('Reçetelerim - e-Nabız', `${head}<div class="ed"><h1>💊 Reçetelerim</h1><table class="nb-tbl"><tr><th>Tarih</th><th>İlaç</th><th>Doktor</th><th>Durum</th></tr>${RECETE.map(([t, i, d, du]) => `<tr><td>${t}</td><td><b>${i}</b></td><td>${d}</td><td>${du === 'Kullanılabilir' ? '🟢' : '⚪'} ${du}</td></tr>`).join('')}</table>
        <p class="ed-note">“Kullanılabilir” reçeteyi eczaneden alabilirsiniz; sadece T.C. kimlik numaranızı söylemeniz yeter.</p></div>`);
    }
    const m = path.match(/^\/tahlil\/(\w+)/);
    if (m) {
      const t = TAHLIL.find((x) => x.id === m[1]);
      if (!t) return page('Bulunamadı', `${head}<div class="ed"><h1>404</h1></div>`);
      return page(`${t.ad} - e-Nabız`, `${head}<div class="ed"><h1>🧪 ${esc(t.ad)}</h1><p class="ed-kurum">${esc(t.tarih)} · ${esc(t.kurum)}</p>
        <table class="nb-tbl"><tr><th>Test</th><th>Sonuç</th><th>Referans aralığı</th><th>Durum</th></tr>${t.rows.map(([a, b, r, ok]) => `<tr class="${ok ? '' : 'hi'}"><td>${a}</td><td><b>${b}</b></td><td>${r}</td><td>${ok ? '✅ Normal' : '⚠ Sınırın üstünde'}</td></tr>`).join('')}</table>
        <p><button type="button" class="ed-btn small" data-act="pdf" data-id="${t.id}">⬇ PDF olarak indir</button></p><p class="ed-small">Değerlerin yorumu için doktorunuza danışın; tek bir sonuç hastalık demek değildir.</p></div>`);
    }
    if (path === '/tahlil') {
      return page('Tahlil sonuçlarım - e-Nabız', `${head}<div class="ed"><h1>🧪 Tahlil sonuçlarım</h1>${TAHLIL.map((t) => `<a class="ed-row" data-href="enabiz.gov.tr/tahlil/${t.id}"><b>${esc(t.ad)}</b><small>${esc(t.tarih)} · ${esc(t.kurum)}</small></a>`).join('')}</div>`);
    }
    if (path === '/hekim') {
      return page('Aile hekimim - e-Nabız', `${head}<div class="ed"><h1>👩‍⚕️ Aile hekimim</h1><dl class="mh-dl"><dt>Hekim</dt><dd>Dr. Selin Aksoy</dd><dt>Birim</dt><dd>Çiçek 3 No'lu Aile Sağlığı Merkezi</dd><dt>Adres</dt><dd>Çiçek Mah. Lale Sok. No: 12</dd><dt>Telefon</dt><dd>0312 000 45 67</dd><dt>Çalışma saatleri</dt><dd>Hafta içi 08:00 – 17:00</dd></dl>
        <p class="ed-note">Aile hekiminizi değiştirmek isterseniz <a data-href="www.mhrs.gov.tr">MHRS</a> ya da e-Devlet üzerinden başvurabilirsiniz.</p></div>`);
    }
    return page('e-Nabız', `${head}<div class="ed"><h1>Hoş geldiniz, ${esc(st.name)}</h1><div class="ed-grid"><a class="ed-card" data-href="enabiz.gov.tr/recete">💊 Reçetelerim<small>Geçmiş ve güncel reçeteler</small></a><a class="ed-card" data-href="enabiz.gov.tr/tahlil">🧪 Tahlil sonuçlarım<small>Sonuçlara bakın, PDF indirin</small></a><a class="ed-card" data-href="enabiz.gov.tr/hekim">👩‍⚕️ Aile hekimim<small>Hekim ve birim bilgisi</small></a></div></div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    if (a === 'edevlet') {
      // Gerçekte olduğu gibi: kimlik e-Devlet'te doğrulanır, e-Nabız şifreyi görmez
      const ed = ((ctx.desk.webState ||= {})['turkiye.gov.tr'] ||= {});
      ed.back = 'enabiz';
      ctx.emit('nabiz-edevlet');
      ctx.visit('www.turkiye.gov.tr', ed.user ? '/onay' : '/giris');
      return;
    }
    if (a === 'logout') {
      st.user = false;
      // e-Nabız e-Devlet kimliğiyle açıldığı için, çıkışta e-Devlet oturumu da kapatılır (ortak bilgisayarda açık kalmasın)
      const ed = (ctx.desk.webState ||= {})['turkiye.gov.tr'];
      let closed = false;
      if (ed?.user) { ed.user = false; ed.back = null; ctx.desk.toast('Güvenli çıkış', 'e-Nabız ile birlikte e-Devlet oturumunuz da kapatıldı.', '🔒', 5000); closed = true; }
      ctx.emit('nabiz-logout');
      if (closed) ctx.emit('edevlet-logout', { via: 'nabiz' }); // e-Devlet'ten çıkış sayılır (e-Hizmet parkuru bu olayı bekler)
      ctx.go('/');
      return;
    }
    if (a === 'pdf') {
      const t = TAHLIL.find((x) => x.id === el.dataset.id);
      const name = `tahlil sonucu - ${t.ad.toLocaleLowerCase('tr')}.pdf`;
      ctx.download(name, { pages: [`<p class="pdf-org">T.C. SAĞLIK BAKANLIĞI<br>e-Nabız</p><h3>${esc(t.ad)}</h3><p>${esc(t.tarih)} · ${esc(t.kurum)}</p><table class="pdf-tbl"><tr><th>Test</th><th>Sonuç</th><th>Referans</th></tr>${t.rows.map(([x, y, z]) => `<tr><td>${x}</td><td>${y}</td><td>${z}</td></tr>`).join('')}</table><p class="pdf-small">Bu belge bilgilendirme amaçlıdır; yorum için doktorunuza başvurunuz.</p>`] });
      ctx.emit('nabiz-pdf', { name, id: t.id });
    }
  },
};

// ======================================================================= İlan Pazarı
const ILANLAR = [
  { id: 1, il: 'Ankara', ilce: 'Çankaya', oda: '2+1', fiyat: 11500, emoji: '🏢', baslik: 'Metroya yakın, doğalgazlı 2+1 daire', aciklama: 'Kızılay metrosuna 5 dakika yürüme. 3. kat, asansörlü, doğalgaz kombi. Depozito 1 kira. Görmek için telefonla randevu alın.', satici: 'Ayşe H.', uye: '4 yıllık üye', tel: true, scam: false },
  { id: 2, il: 'Ankara', ilce: 'Keçiören', oda: '3+1', fiyat: 9500, emoji: '🏠', baslik: 'Bahçeli, geniş 3+1 müstakil', aciklama: 'Sakin bir sokakta bahçeli ev. Okula ve pazara yakın. Bahçe kullanımı dahil. Yerinde görülüp anlaşılır.', satici: 'Mehmet K.', uye: '2 yıllık üye', tel: true, scam: false },
  { id: 3, il: 'Ankara', ilce: 'Yenimahalle', oda: '2+1', fiyat: 3000, emoji: '🏘', baslik: 'ACİL! Çok ucuz 2+1 kiralık, kaçırmayın!!!', aciklama: 'Ev sahibi yurtdışında olduğu için ev <b>çok ucuza</b> kiralanacak. Evi göstermem mümkün değil, <b>anahtarı kargoyla</b> gönderirim. Ciddi olanlar <b>hemen kapora yatırsın</b>: IBAN TR00 0000 0000 0000 0000 0000 00. Kimlik fotokopinizi de gönderin.', satici: 'Mustafa Y.', uye: 'Üyeliği 1 gün', tel: false, scam: true },
  { id: 4, il: 'İstanbul', ilce: 'Kadıköy', oda: '1+1', fiyat: 18000, emoji: '🏙', baslik: 'Deniz manzaralı 1+1', aciklama: 'Moda\'ya 10 dk. Asansörlü, eşyalı. Yerinde görülüp anlaşılır.', satici: 'Hülya T.', uye: '3 yıllık üye', tel: true, scam: false },
  { id: 5, il: 'İzmir', ilce: 'Karşıyaka', oda: '2+1', fiyat: 10500, emoji: '🌇', baslik: 'Tramvaya yakın 2+1', aciklama: 'Karşıyaka çarşısına 7 dakika. Doğalgazlı, balkonlu.', satici: 'Kemal Ö.', uye: '5 yıllık üye', tel: true, scam: false },
  { id: 6, il: 'Ankara', ilce: 'Etimesgut', oda: '2+1', fiyat: 10800, emoji: '🏡', baslik: 'Yeni binada 2+1', aciklama: 'Yeni yapı, otoparklı. Hafta sonu görülebilir. Depozito 1 kira.', satici: 'Zeynep A.', uye: '1 yıllık üye', tel: true, scam: false },
  { id: 7, il: 'Ankara', ilce: 'Çankaya', oda: '1+1', fiyat: 2500, emoji: '🏚', baslik: 'Bugüne özel! 1+1 sadece 2.500 TL', aciklama: 'Yalnızca <b>bugün</b> geçerli fiyat! Arayan bile olmadan <b>WhatsApp\'tan yazın</b>, kaporayı IBAN\'a yatırınca ev sizin. Fotoğraflar internetten alınmıştır, yerinde görmenize gerek yok.', satici: 'Emlak Fırsat', uye: 'Üyeliği 2 gün', tel: false, scam: true },
];

const ilHead = '<header class="ip-head">🏠 İlan Pazarı<small>Kiralık ve satılık ilanlar</small></header>';

const ILAN = {
  name: 'İlan Pazarı', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    const m = path.match(/^\/ilan\/(\d+)/);
    if (m) {
      const i = ILANLAR.find((x) => x.id === +m[1]);
      if (!i) return page('İlan bulunamadı', `${ilHead}<div class="ip"><h1>İlan bulunamadı</h1></div>`);
      return page(`${i.baslik} - İlan Pazarı`, `${ilHead}<div class="ip"><nav class="ip-nav"><a data-href="www.ilan-pazari.com.tr">← Aramaya dön</a></nav><h1>${esc(i.baslik)}</h1>
        <div class="ip-photos"><div>${i.emoji}</div><div>🛏</div><div>🛁</div></div>
        <div class="ip-price">${tl(i.fiyat)} / ay</div><p class="ip-meta">${esc(i.il)} / ${esc(i.ilce)} · ${i.oda}</p><p class="ip-text">${i.aciklama}</p>
        <div class="ip-seller"><b>Satıcı:</b> ${esc(i.satici)}<br><small>${esc(i.uye)} · ${i.tel ? '✔ Telefonu doğrulanmış' : '✖ Telefonu doğrulanmamış'}</small></div>
        <div class="ip-btns"><button type="button" class="ed-btn small" data-act="mesaj" data-id="${i.id}">✉ Mesaj yaz</button><button type="button" class="ed-btn small" data-act="kapora" data-id="${i.id}">💰 Kapora gönder</button><button type="button" class="ed-btn small ghost" data-act="report" data-id="${i.id}">🚩 İlanı şikayet et</button></div>
        <aside class="ip-tips"><b>🛡 Dolandırıcılıktan korunmak için</b><ul><li>Evi <b>yerinde görmeden</b> kapora ya da para göndermeyin.</li><li>Fiyat piyasanın çok altındaysa şüphelenin.</li><li>“Ev sahibi yurtdışında, anahtar kargoyla” diyen ilan çoğunlukla dolandırıcılıktır.</li><li>Kimlik ve banka bilginizi ilan sahibine göndermeyin.</li></ul></aside></div>`);
    }
    const f = st.f || { il: '', oda: '', max: '' };
    const list = ILANLAR.filter((x) => (!f.il || x.il === f.il) && (!f.oda || x.oda === f.oda) && (!f.max || x.fiyat <= +f.max));
    const sel = (name, opts) => `<select name="${name}"><option value="">Tümü</option>${opts.map((o) => `<option ${f[name] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    return page('İlan Pazarı: Kiralık ev', `${ilHead}<div class="ip"><form class="ip-form" data-act="search"><label>İl ${sel('il', ['Ankara', 'İstanbul', 'İzmir'])}</label><label>Oda ${sel('oda', ['1+1', '2+1', '3+1'])}</label><label>En çok kira (₺) <input name="max" inputmode="numeric" value="${esc(f.max)}" placeholder="ör. 12000" autocomplete="off"></label><button class="ed-btn">🔍 İlanları göster</button></form>
      <h2>${list.length} ilan bulundu</h2>${list.map((i) => `<a class="ip-card" data-href="www.ilan-pazari.com.tr/ilan/${i.id}"><span class="ip-th">${i.emoji}</span><div><b>${esc(i.baslik)}</b><small>${esc(i.il)} / ${esc(i.ilce)} · ${i.oda}</small></div><em>${tl(i.fiyat)}</em></a>`).join('') || '<p>Bu özelliklerde ilan bulunamadı.</p>'}</div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    if (a === 'search') {
      st.f = { il: v.il, oda: v.oda, max: digits(v.max) };
      const n = ILANLAR.filter((x) => (!st.f.il || x.il === st.f.il) && (!st.f.oda || x.oda === st.f.oda) && (!st.f.max || x.fiyat <= +st.f.max)).length;
      ctx.emit('ilan-search', { il: st.f.il, oda: st.f.oda, max: +st.f.max || 0, count: n });
      ctx.refresh();
      return;
    }
    const i = ILANLAR.find((x) => x.id === +el.dataset.id);
    if (!i) return;
    if (a === 'kapora') {
      ctx.emit('ilan-kapora', { id: i.id, scam: i.scam });
      ctx.desk.dialogs.ask({ title: i.scam ? '⚠ DOLANDIRICILIK!' : 'Kapora göndermeden önce', icon: i.scam ? '🚨' : '💰', text: i.scam ? 'Bu ilan <b>sahte</b>: fiyat çok düşük, ev gösterilmiyor, anahtar “kargoyla” geliyor, satıcının telefonu doğrulanmamış. Para göndermiş olsaydınız geri alamazdınız!' : 'Gerçek bir ilanda bile kaporayı <b>evi yerinde gördükten ve sözleşmeyi imzalamadan önce</b> göndermeyin.', buttons: [['ok', 'Anladım', true]] });
      return;
    }
    if (a === 'report') {
      ctx.emit('ilan-report', { id: i.id, scam: i.scam });
      ctx.desk.toast(i.scam ? 'Şikayetiniz alındı' : 'Şikayet alındı', i.scam ? 'Şüpheli ilanı bildirdiğiniz için teşekkürler; ilan incelenecek.' : 'İlan incelenecek.', '🚩');
      return;
    }
    if (a === 'mesaj') ctx.desk.toast('Mesajınız gönderildi', 'Satıcı size uygulama içinden dönecek. Telefon ya da kimlik bilgisi paylaşmayın.', '✉');
  },
};

export const HIZMET_SITES = { 'enabiz.gov.tr': ENABIZ, 'www.ilan-pazari.com.tr': ILAN };
