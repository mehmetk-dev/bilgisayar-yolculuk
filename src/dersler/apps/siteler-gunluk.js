// Günlük işlerin yapıldığı örnek siteler: e-Devlet (giriş, hizmet arama, barkodlu belge, belge doğrulama),
// hastane randevusu (zorunlu alanlı form), internetten alışveriş (sepet, adres, kapıda/kartla ödeme, 3D Secure kodu,
// sipariş takibi) ve görüntülü görüşme (kamera/mikrofon izni, sessize alma, sohbet). Hepsi uydurmadır.
// render(path, q, ctx) sayfayı çizer; act(ad, formDeğerleri, ctx, düğme) data-act düğmelerine ve formlarına cevap verir.
// ctx.state her sitenin kendi bilgisidir (giriş yapıldı mı, sepet…); masaüstü sıfırlanınca silinir.
import { esc } from './util.js';

const page = (title, html, cls = '') => ({ title, html: `<div class="wp ${cls}">${html}</div>` });
const tl = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
const code = (n) => String(Math.floor(10 ** (n - 1) + Math.random() * 9 * 10 ** (n - 1)));
const digits = (s) => String(s || '').replace(/\D/g, '');
// Hata iletileri: alanın altında kırmızı yazı
const errOf = (st, k) => (st.err?.[k] ? `<small class="wf-err">⚠ ${st.err[k]}</small>` : '');
const errTop = (st) => (st.err && Object.keys(st.err).length ? '<div class="wf-errtop">⚠ Lütfen kırmızıyla işaretli alanları düzeltin.</div>' : '');
const val = (st, k) => esc(st.form?.[k] ?? '');

export const KURS_TC = '12345678950';
export const KURS_SIFRE = 'Kurs2026';
export const TEST_KART = '4242 4242 4242 4242';

// ======================================================================= e-Devlet
const SERVICES = [
  { id: 'yerlesim', name: 'Yerleşim Yeri (İkametgâh) ve Diğer Adres Belgesi Sorgulama', kurum: 'Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü', keys: ['ikametgah', 'ikametgâh', 'yerleşim', 'yerlesim', 'adres', 'ikamet'], belge: true },
  { id: 'sgk', name: 'SGK Tescil ve Hizmet Dökümü', kurum: 'Sosyal Güvenlik Kurumu', keys: ['sgk', 'hizmet', 'döküm', 'dokum', 'sigorta', 'emekli'], belge: true },
  { id: 'adli', name: 'Adli Sicil Kaydı (Sabıka Kaydı) Sorgulama', kurum: 'Adalet Bakanlığı', keys: ['sabıka', 'sabika', 'adli', 'sicil'], belge: true },
  { id: 'recete', name: 'Reçete Bilgilerim', kurum: 'Sağlık Bakanlığı', keys: ['reçete', 'recete', 'ilaç', 'ilac'] },
  { id: 'arac', name: 'Adıma Kayıtlı Araç Sorgulama', kurum: 'Emniyet Genel Müdürlüğü', keys: ['araç', 'arac', 'araba', 'plaka'] },
];
const AMAC = ['Resmî kuruma verilecek', 'Bankaya verilecek', 'İşverene verilecek', 'Okula verilecek'];
const edHead = (st) => `<header class="ed-head">🇹🇷 e-Devlet Kapısı<nav><a data-href="www.turkiye.gov.tr">Ana sayfa</a>
  ${st.user ? `<span class="ed-user">👤 ${esc(st.userName)}</span><button type="button" class="ed-out" data-act="logout">⏻ Çıkış</button>` : '<a data-href="www.turkiye.gov.tr/giris">Giriş yap</a>'}</nav></header>`;
const searchBox = (q = '') => `<form class="ed-search" data-act="search"><input name="q" value="${esc(q)}" placeholder="Hizmet ara (ör. ikametgâh)" autocomplete="off"><button>🔍 Ara</button></form>`;

function belgeHtml(svc, st, desk, barkod, amac) {
  const d = desk.now().toLocaleDateString('tr-TR');
  const body = {
    yerlesim: `<p>T.C. Kimlik No: <b>${KURS_TC.slice(0, 3)}******${KURS_TC.slice(-2)}</b></p><p>Adı Soyadı: <b>${esc(st.userName)}</b></p><p>Yerleşim yeri adresi: Çiçek Mah. Lale Sok. No: 5 İç Kapı No: 2, Merkez</p><p>Adrese giriş tarihi: 01.03.2018</p>`,
    sgk: '<p>Toplam hizmet gün sayısı: <b>7.845</b></p><p>İlk işe giriş tarihi: 15.09.1994</p><p>Son işyeri: Örnek Tekstil A.Ş.</p>',
    adli: '<p>Adli sicil kaydı: <b>Yoktur.</b></p><p>Arşiv kaydı: <b>Yoktur.</b></p>',
  }[svc.id];
  return `<p class="pdf-org">T.C.<br>${esc(svc.kurum)}</p><h3>${esc(svc.name.replace(/ Sorgulama$/, ''))} Belgesi</h3>${body}<p>Belgenin veriliş amacı: ${esc(amac)}</p>
    <p class="pdf-barkod">||||| |||| ||| |||||| || |||| <br>Barkod: <b>${barkod}</b> · ${d}</p><p class="pdf-small">Bu belgenin doğruluğunu turkiye.gov.tr adresinden <b>barkod numarası</b> ile kontrol edebilirsiniz.</p>`;
}

const EDEVLET = {
  name: 'e-Devlet Kapısı', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, head = edHead(st);
    if (path === '/giris') {
      return page('e-Devlet Kapısı: Giriş', `${head}<form class="ed-login" data-act="login"><h1>Kimliğinizi doğrulayın</h1><p class="ed-tabs"><b>🔑 e-Devlet Şifresi</b> <span>📱 Mobil İmza</span> <span>💳 e-İmza</span></p>
        ${errTop(st)}<label>T.C. Kimlik No<input name="tc" inputmode="numeric" maxlength="11" autocomplete="off" value="${val(st, 'tc')}"></label>${errOf(st, 'tc')}
        <label>e-Devlet Şifresi<input name="sifre" type="password" autocomplete="off"></label>${errOf(st, 'sifre')}
        <button class="ed-btn">Giriş Yap</button><p class="ed-small">Şifreniz yoksa kimliğinizle PTT\'den alabilirsiniz. Şifrenizi kimseyle paylaşmayın.</p></form>`);
    }
    if (path === '/cikis') return page('e-Devlet Kapısı', `${head}<div class="ed"><h1>✅ Güvenli çıkış yaptınız</h1><p>Ortak kullanılan bilgisayarlarda işiniz bitince her zaman <b>Çıkış</b> yapın.</p></div>`);
    if (path === '/ara') {
      const t = q.toLocaleLowerCase('tr');
      const hits = SERVICES.filter((s) => s.keys.some((k) => t.includes(k) || k.includes(t)) || s.name.toLocaleLowerCase('tr').includes(t));
      return page(`${q} - e-Devlet`, `${head}<div class="ed">${searchBox(q)}<h2>“${esc(q)}” için ${hits.length} hizmet</h2>
        ${hits.map((s) => `<a class="ed-row" data-href="www.turkiye.gov.tr/hizmet/${s.id}"><b>${esc(s.name)}</b><small>${esc(s.kurum)}</small></a>`).join('') || '<p>Hizmet bulunamadı. Başka bir kelimeyle arayın.</p>'}</div>`);
    }
    const m = path.match(/^\/hizmet\/(\w+)/);
    if (m) {
      const svc = SERVICES.find((s) => s.id === m[1]);
      if (!svc) return page('Sayfa bulunamadı', `${head}<div class="ed"><h1>404 · Sayfa bulunamadı</h1></div>`);
      if (!st.user) {
        return page(svc.name, `${head}<div class="ed"><h1>${esc(svc.name)}</h1><p class="ed-kurum">${esc(svc.kurum)}</p><div class="ed-note">🔒 Bu hizmeti kullanmak için <b>giriş yapmalısınız</b>.</div>
          <button type="button" class="ed-btn" data-act="needLogin" data-next="${path}">Giriş Yap</button></div>`);
      }
      const doc = st.docs?.[svc.id];
      if (!svc.belge) return page(svc.name, `${head}<div class="ed"><h1>${esc(svc.name)}</h1><p class="ed-kurum">${esc(svc.kurum)}</p><p>Bu hizmette kayıtlı bilgi bulunmamaktadır.</p></div>`);
      return page(svc.name, `${head}<div class="ed"><h1>${esc(svc.name)}</h1><p class="ed-kurum">${esc(svc.kurum)}</p>
        ${doc ? `<div class="ed-ok">✅ Belgeniz oluşturuldu.<br>Barkod numarası: <b>${doc.barkod}</b></div><button type="button" class="ed-btn" data-act="dl" data-svc="${svc.id}">📄 Belgeyi indir (PDF)</button>
          <p class="ed-small">Belgeyi yazdırıp götürebilir ya da e-postayla gönderebilirsiniz. Alan kurum barkoddan doğruluğunu kontrol eder.</p>`
        : `<form class="ed-form" data-act="make" data-svc="${svc.id}">${errTop(st)}<fieldset><legend>Belge kimin için?</legend><label><input type="radio" name="kim" value="kendim" checked> Kendim</label><label><input type="radio" name="kim" value="hane"> Hane halkımdan biri</label></fieldset>
          <label>Belge nereye verilecek?<select name="amac"><option value="">Seçiniz</option>${AMAC.map((a) => `<option>${a}</option>`).join('')}</select></label>${errOf(st, 'amac')}
          <button class="ed-btn">Belge Oluştur</button></form>`}</div>`);
    }
    if (path === '/dogrula') {
      const r = st.verify;
      return page('Barkodlu Belge Doğrulama', `${head}<div class="ed"><h1>Barkodlu Belge Doğrulama</h1><form class="ed-form" data-act="verify"><label>Barkod numarası<input name="barkod" autocomplete="off" placeholder="NVI-0000-0000" value="${esc(r?.barkod || '')}"></label><button class="ed-btn">Doğrula</button></form>
        ${r ? (r.ok ? `<div class="ed-ok">✅ Bu belge gerçektir: ${esc(r.name)}</div>` : '<div class="ed-bad">❌ Bu barkodla bir belge bulunamadı. Belge sahte olabilir.</div>') : ''}</div>`);
    }
    return page('e-Devlet Kapısı', `${head}<div class="ed">${st.user ? `<h1>Hoş geldiniz, ${esc(st.userName)}</h1>` : '<h1>Hizmetler</h1>'}${searchBox()}
      <div class="ed-grid">${SERVICES.map((s) => `<a class="ed-card" data-href="www.turkiye.gov.tr/hizmet/${s.id}">${esc(s.name)}<small>${esc(s.kurum)}</small></a>`).join('')}<a class="ed-card" data-href="www.turkiye.gov.tr/dogrula">🔎 Barkodlu Belge Doğrulama<small>Size verilen bir belgenin gerçek olup olmadığını kontrol edin</small></a></div>
      ${st.user ? '' : '<p class="ed-note">Hizmetlerin çoğu için <b>Giriş yap</b> gerekir. e-Devlet şifrenizi PTT\'den alabilirsiniz.</p>'}</div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    st.err = {};
    if (a === 'search') { if (v.q) { ctx.emit('edevlet-search', { q: v.q }); ctx.go('/ara', v.q); } return; }
    if (a === 'needLogin') { st.next = el.dataset.next; ctx.go('/giris'); return; }
    if (a === 'login') {
      st.form = { tc: v.tc };
      const tc = digits(v.tc);
      if (tc.length !== 11) st.err.tc = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';
      if (!v.sifre) st.err.sifre = 'Şifrenizi yazın.';
      else if (!st.err.tc && (tc !== KURS_TC || v.sifre !== KURS_SIFRE)) { st.err.sifre = 'T.C. Kimlik Numarası veya şifre hatalı. (Büyük-küçük harfe dikkat edin.)'; }
      ctx.emit('edevlet-login', { ok: !Object.keys(st.err).length });
      if (Object.keys(st.err).length) { ctx.refresh(); return; }
      st.user = true;
      st.userName = ctx.desk.settings.user;
      st.form = {};
      ctx.go(st.next || '/');
      st.next = null;
      return;
    }
    if (a === 'logout') { st.user = false; ctx.emit('edevlet-logout'); ctx.go('/cikis'); return; }
    if (a === 'make') {
      if (!v.amac) { st.err.amac = 'Belgenin nereye verileceğini seçin.'; ctx.emit('edevlet-form-error'); ctx.refresh(); return; }
      const id = el.dataset.svc;
      (st.docs ||= {})[id] = { barkod: `NVI-${code(4)}-${code(4)}`, amac: v.amac };
      ctx.emit('edevlet-doc', { svc: id });
      ctx.refresh();
      return;
    }
    if (a === 'dl') {
      const svc = SERVICES.find((s) => s.id === el.dataset.svc), doc = st.docs[svc.id];
      const name = { yerlesim: 'yerlesim_yeri_belgesi.pdf', sgk: 'hizmet_dokumu.pdf', adli: 'adli_sicil_kaydi.pdf' }[svc.id];
      ctx.download(name, { html: belgeHtml(svc, st, ctx.desk, doc.barkod, doc.amac), barkod: doc.barkod });
      ctx.emit('edevlet-download', { svc: svc.id, name });
      return;
    }
    if (a === 'verify') {
      const b = (v.barkod || '').toUpperCase().replace(/\s/g, '');
      const hit = Object.entries(st.docs || {}).find(([, d]) => d.barkod === b);
      st.verify = { barkod: b, ok: !!hit, name: hit && SERVICES.find((s) => s.id === hit[0]).name.replace(/ Sorgulama$/, '') };
      ctx.emit('edevlet-verify', { ok: !!hit });
      ctx.refresh();
    }
  },
};

// ======================================================================= Hastane randevusu
const KLINIK = ['Aile Hekimliği', 'Dahiliye (İç Hastalıkları)', 'Göz Hastalıkları', 'Kulak Burun Boğaz', 'Kardiyoloji', 'Ortopedi'];
const HASTANE = ['Ankara Şehir Hastanesi', 'İstanbul Başakşehir Şehir Hastanesi', 'İzmir Tepecik Eğitim ve Araştırma Hastanesi', 'Bursa Şehir Hastanesi'];
const SAAT = [['09:00', 1], ['09:20', 0], ['10:40', 1], ['11:00', 0], ['14:00', 1], ['15:20', 1]];
function days(desk) {
  const out = [];
  const d = new Date(desk.now());
  while (out.length < 5) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) out.push(new Date(d)); }
  return out;
}
const dayLabel = (d) => d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'long' });

const MHRS = {
  name: 'Merkezi Hekim Randevu Sistemi', secure: true,
  render(path, q, ctx) {
    const st = ctx.state, f = st.form || {};
    const head = '<header class="mh-head">🏥 MHRS · Hastane Randevusu<nav><a data-href="www.mhrs.gov.tr">Ana sayfa</a> <a data-href="www.mhrs.gov.tr/randevularim">Randevularım</a></nav></header>';
    if (path === '/randevu') {
      const dd = days(ctx.desk);
      const sel = (name, list) => `<select name="${name}"><option value="">Seçiniz</option>${list.map((x) => `<option ${f[name] === x ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
      return page('Randevu al - MHRS', `${head}<form class="wf" data-act="book"><h1>Randevu al</h1><p class="wf-req">* işaretli alanların doldurulması zorunludur.</p>${errTop(st)}
        <label>T.C. Kimlik No *<input name="tc" maxlength="11" inputmode="numeric" autocomplete="off" value="${val(st, 'tc')}"></label>${errOf(st, 'tc')}
        <label>Cep telefonu *<input name="tel" placeholder="05XX XXX XX XX" autocomplete="off" value="${val(st, 'tel')}"></label>${errOf(st, 'tel')}
        <label>Klinik (bölüm) *${sel('klinik', KLINIK)}</label>${errOf(st, 'klinik')}
        <label>Hastane *${sel('hastane', HASTANE)}</label>${errOf(st, 'hastane')}
        <fieldset><legend>Gün *</legend><div class="wf-days">${dd.map((d, i) => `<label class="wf-chip"><input type="radio" name="gun" value="${i}" ${f.gun === String(i) ? 'checked' : ''}><span>${dayLabel(d)}</span></label>`).join('')}</div></fieldset>${errOf(st, 'gun')}
        <fieldset><legend>Saat * <small>(gri olanlar dolu)</small></legend><div class="wf-days">${SAAT.map(([s, free]) => `<label class="wf-chip ${free ? '' : 'full'}"><input type="radio" name="saat" value="${s}" ${free ? '' : 'disabled'} ${f.saat === s ? 'checked' : ''}><span>${s}</span></label>`).join('')}</div></fieldset>${errOf(st, 'saat')}
        <label class="wf-check"><input type="checkbox" name="kvkk" ${f.kvkk ? 'checked' : ''}> <span><u>Kişisel verilerin korunması aydınlatma metnini</u> okudum. *</span></label>${errOf(st, 'kvkk')}
        <button class="ed-btn">Randevuyu onayla</button></form>`);
    }
    if (path === '/onay' && st.last) {
      const r = st.last;
      return page('Randevunuz alındı - MHRS', `${head}<div class="ed"><div class="ed-ok">✅ Randevunuz alındı.</div><dl class="mh-dl"><dt>Randevu kodu</dt><dd>${r.kod}</dd><dt>Hastane</dt><dd>${esc(r.hastane)}</dd><dt>Klinik</dt><dd>${esc(r.klinik)}</dd><dt>Tarih</dt><dd>${esc(r.gun)} · ${r.saat}</dd></dl>
        <p class="ed-note">Randevu saatinden 15 dakika önce hastanede olun. Gidemeyecekseniz <b>Randevularım</b>'dan iptal edin; başka biri o saati kullanabilir.</p></div>`);
    }
    if (path === '/randevularim') {
      const list = st.list || [];
      return page('Randevularım - MHRS', `${head}<div class="ed"><h1>Randevularım</h1>${list.length ? list.map((r, i) => `<div class="mh-row ${r.iptal ? 'off' : ''}"><div><b>${esc(r.gun)} · ${r.saat}</b><small>${esc(r.klinik)} · ${esc(r.hastane)}</small></div>${r.iptal ? '<span>İptal edildi</span>' : `<button type="button" class="ed-btn small" data-act="cancel" data-i="${i}">İptal et</button>`}</div>`).join('') : '<p>Randevunuz yok.</p>'}
        <p><a data-href="www.mhrs.gov.tr/randevu">＋ Yeni randevu al</a></p></div>`);
    }
    return page('MHRS', `${head}<div class="ed"><h1>Hastane ve aile hekimi randevusu</h1><p>Randevularınızı internetten ya da <b>182</b>\'yi arayarak alabilirsiniz.</p>
      <div class="ed-grid"><a class="ed-card" data-href="www.mhrs.gov.tr/randevu">📅 Randevu al<small>Hastane, bölüm, gün ve saat seçin</small></a><a class="ed-card" data-href="www.mhrs.gov.tr/randevularim">🗂 Randevularım<small>Aldığınız randevular, iptal</small></a></div></div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    if (a === 'book') {
      st.form = v;
      const e = (st.err = {});
      if (digits(v.tc).length !== 11) e.tc = v.tc ? 'T.C. Kimlik Numarası 11 haneli olmalıdır.' : 'Bu alan zorunludur.';
      const tel = digits(v.tel);
      if (!tel) e.tel = 'Bu alan zorunludur.'; else if (!/^05\d{9}$/.test(tel)) e.tel = 'Telefon 05 ile başlamalı ve 11 haneli olmalı (05XX XXX XX XX).';
      for (const k of ['klinik', 'hastane']) if (!v[k]) e[k] = 'Lütfen seçin.';
      if (!v.gun) e.gun = 'Bir gün seçin.';
      if (!v.saat) e.saat = 'Bir saat seçin.';
      if (!v.kvkk) e.kvkk = 'Devam etmek için aydınlatma metnini onaylamalısınız.';
      ctx.emit('form-submit', { site: 'mhrs', errors: Object.keys(e) });
      if (Object.keys(e).length) { ctx.refresh(); return; }
      const r = { kod: 'R' + code(7), klinik: v.klinik, hastane: v.hastane, gun: dayLabel(days(ctx.desk)[+v.gun]), saat: v.saat };
      (st.list ||= []).push(r);
      st.last = r;
      st.form = {};
      ctx.desk.toast('SMS · MHRS', `${r.gun} ${r.saat} ${esc(r.klinik)} randevunuz alınmıştır. Kod: ${r.kod}`, '💬', 8000);
      ctx.emit('appointment', { ...r });
      ctx.go('/onay');
      return;
    }
    if (a === 'cancel') {
      const r = st.list[+el.dataset.i];
      ctx.desk.dialogs.ask({ title: 'Randevu iptali', icon: '❓', text: `<b>${esc(r.gun)} ${r.saat}</b> tarihli randevunuz iptal edilsin mi?`, buttons: [['yes', 'Evet, iptal et'], ['no', 'Vazgeç', true]] }).then((ans) => {
        if (ans !== 'yes') return;
        r.iptal = true;
        ctx.emit('appointment-cancel', { kod: r.kod });
        ctx.refresh();
      });
    }
  },
};

// ======================================================================= Alışveriş
const URUNLER = [
  { id: 'tava', icon: '🍳', name: 'Döküm tava (28 cm)', price: 649, stars: 4.6 },
  { id: 'caydanlik', icon: '🫖', name: 'Çaydanlık takımı', price: 899, stars: 4.4 },
  { id: 'sepet', icon: '🧺', name: 'Çamaşır sepeti', price: 229, stars: 4.1 },
  { id: 'ampul', icon: '💡', name: 'LED ampul (4\'lü)', price: 159, stars: 4.7 },
  { id: 'battaniye', icon: '🛏', name: 'Pamuklu battaniye', price: 549, stars: 4.5 },
  { id: 'termos', icon: '🥤', name: 'Çelik termos', price: 389, stars: 4.3 },
];
const KARGO = 39.9, KAPIDA = 19.9, BEDAVA = 500;
const total = (st) => (st.cart || []).reduce((s, c) => s + URUNLER.find((u) => u.id === c.id).price * c.n, 0);
const cargo = (st) => (total(st) >= BEDAVA ? 0 : KARGO);
const count = (st) => (st.cart || []).reduce((s, c) => s + c.n, 0);
const STAGES = ['Sipariş alındı', 'Hazırlanıyor', 'Kargoya verildi', 'Dağıtımda', 'Teslim edildi'];

const SHOP = {
  name: 'Fırsat Pazarı', secure: true, askNotify: true,
  render(path, q, ctx) {
    const st = ctx.state, f = st.form || {};
    const head = `<header class="pi-head fp-head">🛒 Fırsat Pazarı<nav><a data-href="www.firsat-pazari.com.tr">Ürünler</a> <a data-href="www.firsat-pazari.com.tr/siparisler">Siparişlerim</a> <a data-href="www.firsat-pazari.com.tr/sepet" class="fp-cart">🛒 Sepetim <b>${count(st)}</b></a></nav></header>`;
    const steps = (i) => `<ol class="fp-steps">${['Sepet', 'Adres', 'Ödeme', 'Onay'].map((s, j) => `<li class="${j <= i ? 'on' : ''}">${s}</li>`).join('')}</ol>`;
    const sum = () => `<div class="fp-sum"><div><span>Ürünler</span><b>${tl(total(st))}</b></div><div><span>Kargo</span><b>${cargo(st) ? tl(cargo(st)) : 'Bedava'}</b></div>${st.pay === 'kapida' ? `<div><span>Kapıda ödeme hizmet bedeli</span><b>${tl(KAPIDA)}</b></div>` : ''}<div class="fp-tot"><span>Toplam</span><b>${tl(total(st) + cargo(st) + (st.pay === 'kapida' ? KAPIDA : 0))}</b></div></div>`;
    if (path === '/sepet') {
      const cart = st.cart || [];
      return page('Sepetim - Fırsat Pazarı', `${head}<div class="pi">${steps(0)}<h1>Sepetim</h1>${cart.length ? `${cart.map((c) => { const u = URUNLER.find((x) => x.id === c.id); return `<div class="fp-line"><span>${u.icon}</span><b>${esc(u.name)}</b>
          <span class="fp-qty"><button type="button" data-act="dec" data-id="${u.id}" title="Azalt">−</button>${c.n}<button type="button" data-act="inc" data-id="${u.id}" title="Artır">+</button></span><b>${tl(u.price * c.n)}</b><button type="button" class="fp-del" data-act="del" data-id="${u.id}" title="Sepetten çıkar">🗑</button></div>`; }).join('')}
        ${cargo(st) ? `<p class="fp-hint">🚚 ${tl(BEDAVA - total(st))} daha alışveriş yaparsanız kargo bedava.</p>` : '<p class="fp-hint ok">🚚 Kargo bedava!</p>'}${sum()}<button type="button" class="ed-btn" data-act="toAddr">Alışverişi tamamla ›</button>`
        : '<p>Sepetiniz boş. <a data-href="www.firsat-pazari.com.tr">Ürünlere göz atın</a></p>'}</div>`);
    }
    if (path === '/adres') {
      return page('Teslimat adresi - Fırsat Pazarı', `${head}<form class="wf" data-act="addr">${steps(1)}<h1>Teslimat adresi</h1>${errTop(st)}
        <label>Ad Soyad *<input name="ad" value="${val(st, 'ad')}" autocomplete="off"></label>${errOf(st, 'ad')}
        <label>Cep telefonu *<input name="tel" placeholder="05XX XXX XX XX" value="${val(st, 'tel')}" autocomplete="off"></label>${errOf(st, 'tel')}
        <label>İl *<select name="il"><option value="">Seçiniz</option>${['Ankara', 'İstanbul', 'İzmir', 'Bursa', 'Konya'].map((x) => `<option ${f.il === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>${errOf(st, 'il')}
        <label>Açık adres * <small>(mahalle, sokak, bina ve daire no)</small><textarea name="adres" rows="2">${val(st, 'adres')}</textarea></label>${errOf(st, 'adres')}
        <button class="ed-btn">Kaydet ve devam et ›</button></form>`);
    }
    if (path === '/odeme') {
      return page('Ödeme - Fırsat Pazarı', `${head}<form class="wf" data-act="pay">${steps(2)}<h1>Ödeme</h1>${errTop(st)}
        <fieldset><legend>Ödeme yöntemi *</legend><label><input type="radio" name="yontem" value="kart" ${f.yontem !== 'kapida' ? 'checked' : ''}> 💳 Kart ile öde</label><label><input type="radio" name="yontem" value="kapida" ${f.yontem === 'kapida' ? 'checked' : ''}> 🚪 Kapıda nakit/kartla öde (+${tl(KAPIDA)})</label></fieldset>
        <div class="fp-card"><label>Kart numarası<input name="kart" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="off" value="${val(st, 'kart')}"></label>${errOf(st, 'kart')}
          <label>Kart üzerindeki ad<input name="kartad" autocomplete="off" value="${val(st, 'kartad')}"></label>${errOf(st, 'kartad')}
          <div class="fp-row"><label>Son kullanma (AA/YY)<input name="skt" maxlength="5" placeholder="AA/YY" autocomplete="off" value="${val(st, 'skt')}"></label><label>Güvenlik kodu (CVV)<input name="cvv" maxlength="3" inputmode="numeric" autocomplete="off" type="password"></label></div>${errOf(st, 'skt')}${errOf(st, 'cvv')}
          <label class="wf-check"><input type="checkbox" name="kaydet" ${f.kaydet === false ? '' : 'checked'}> <span>Kartımı sonraki alışverişler için kaydet</span></label></div>
        <label class="wf-check"><input type="checkbox" name="sozlesme" ${f.sozlesme ? 'checked' : ''}> <span><u>Mesafeli satış sözleşmesini</u> okudum, onaylıyorum. *</span></label>${errOf(st, 'sozlesme')}
        ${sum()}<button class="ed-btn">Siparişi onayla</button><p class="ed-small">🔒 Ödeme sayfasının adresi firsat-pazari.com.tr ve kilitli. Kart bilgisi yalnızca böyle sayfalara girilir.</p></form>`);
    }
    if (path === '/3d') {
      return page('Bankam 3D Secure', `<div class="bk3"><header class="bk-head">🏦 Bankam · Güvenli Ödeme</header><form class="wf" data-act="verify3d"><p>Üye işyeri: <b>Fırsat Pazarı</b></p><p>Tutar: <b>${tl(st.order.tutar)}</b></p><p>Kart: **** **** **** ${st.order.son4}</p>
        <label>Telefonunuza SMS ile gelen <b>6 haneli doğrulama kodunu</b> girin<input name="kod" maxlength="6" inputmode="numeric" autocomplete="off"></label>${errOf(st, 'kod')}
        <button class="ed-btn">Onayla</button><button type="button" class="ed-btn ghost" data-act="cancel3d">İptal</button>
        <p class="ed-small">Bu kod yalnızca bu ödeme içindir. <b>Kodu kimseye söylemeyin</b>; banka sizi arayıp bu kodu sormaz.</p></form></div>`, 'bk3-bg');
    }
    if (path === '/tamam' && st.last) {
      return page('Siparişiniz alındı - Fırsat Pazarı', `${head}<div class="pi">${steps(3)}<div class="ed-ok">✅ Siparişiniz alındı. Sipariş no: <b>${st.last.no}</b></div><p>Sipariş özeti e-posta ve SMS ile gönderildi. Kargonun nerede olduğunu <a data-href="www.firsat-pazari.com.tr/siparisler">Siparişlerim</a>\'den takip edebilirsiniz.</p></div>`);
    }
    if (path === '/siparisler') {
      const list = st.orders || [];
      return page('Siparişlerim - Fırsat Pazarı', `${head}<div class="pi"><h1>Siparişlerim</h1>${list.length ? list.map((o) => `<div class="fp-order"><div><b>Sipariş ${o.no}</b> · ${tl(o.tutar)} · ${o.yontem === 'kapida' ? 'Kapıda ödeme' : 'Kart'}</div>
          <ol class="fp-track">${STAGES.map((s, i) => `<li class="${i <= o.stage ? 'on' : ''}">${s}</li>`).join('')}</ol><small>Kargo takip no: ${o.kargo}</small></div>`).join('') : '<p>Henüz siparişiniz yok.</p>'}</div>`);
    }
    return page('Fırsat Pazarı', `${head}<div class="pi"><h1>Günün fırsatları</h1><div class="fp-grid">${URUNLER.map((u) => `<div class="fp-card"><span>${u.icon}</span><b>${esc(u.name)}</b><small class="fp-stars">★ ${String(u.stars).replace('.', ',')}</small><small>${tl(u.price)}</small><button type="button" class="ed-btn small" data-act="add" data-id="${u.id}">Sepete ekle</button></div>`).join('')}</div></div>`);
  },
  act(a, v, ctx, el) {
    const st = ctx.state;
    const cart = (st.cart ||= []);
    const line = el?.dataset.id && cart.find((c) => c.id === el.dataset.id);
    st.err = {};
    if (a === 'add') {
      if (line) line.n++; else cart.push({ id: el.dataset.id, n: 1 });
      ctx.desk.toast('Sepete eklendi', `${esc(URUNLER.find((u) => u.id === el.dataset.id).name)} · Sepette ${count(st)} ürün`, '🛒', 2500);
      ctx.emit('shop-add', { id: el.dataset.id, count: count(st) });
      ctx.refresh();
      return;
    }
    if (a === 'inc' || a === 'dec' || a === 'del') {
      if (a === 'inc') line.n++;
      else if (a === 'dec' && line.n > 1) line.n--;
      else st.cart = cart.filter((c) => c !== line);
      ctx.emit('shop-cart', { op: a, id: el.dataset.id, count: count(st), total: total(st) });
      ctx.refresh();
      return;
    }
    if (a === 'toAddr') { ctx.emit('shop-checkout', { total: total(st) }); ctx.go('/adres'); return; }
    if (a === 'addr') {
      st.form = { ...st.form, ...v };
      if (!v.ad || v.ad.split(/\s+/).length < 2) st.err.ad = 'Adınızı ve soyadınızı yazın.';
      if (!/^05\d{9}$/.test(digits(v.tel))) st.err.tel = 'Telefon 05 ile başlamalı ve 11 haneli olmalı.';
      if (!v.il) st.err.il = 'İl seçin.';
      if ((v.adres || '').length < 10) st.err.adres = 'Kargonun size ulaşması için açık adresinizi yazın.';
      ctx.emit('form-submit', { site: 'shop-addr', errors: Object.keys(st.err) });
      if (Object.keys(st.err).length) { ctx.refresh(); return; }
      ctx.go('/odeme');
      return;
    }
    if (a === 'pay') {
      st.form = { ...st.form, ...v };
      st.pay = v.yontem;
      if (v.yontem === 'kart') {
        if (digits(v.kart).length !== 16) st.err.kart = 'Kart numarası 16 haneli olmalı.';
        if (!v.kartad) st.err.kartad = 'Kart üzerindeki adı yazın.';
        if (!/^(0[1-9]|1[0-2])\/\d\d$/.test(v.skt || '')) st.err.skt = 'Son kullanma tarihini AA/YY biçiminde yazın (ör. 12/28).';
        if (digits(v.cvv).length !== 3) st.err.cvv = 'Kartın arkasındaki 3 haneli kodu yazın.';
      }
      if (!v.sozlesme) st.err.sozlesme = 'Sözleşmeyi onaylamadan sipariş verilemez.';
      ctx.emit('form-submit', { site: 'shop-pay', errors: Object.keys(st.err), save: !!v.kaydet });
      if (Object.keys(st.err).length) { ctx.refresh(); return; }
      const tutar = total(st) + cargo(st) + (v.yontem === 'kapida' ? KAPIDA : 0);
      st.order = { tutar, yontem: v.yontem, son4: digits(v.kart).slice(-4), kaydet: !!v.kaydet };
      if (v.yontem === 'kapida') return SHOP.finish(ctx);
      st.code = code(6);
      ctx.go('/3d');
      setTimeout(() => ctx.desk.toast('SMS · BANKAM', `Fırsat Pazarı ${tl(tutar)} harcamanız için doğrulama kodu: <b>${st.code}</b>. Bu kodu kimseyle paylaşmayın.`, '💬', 30000), 900);
      ctx.emit('shop-3d', { tutar });
      return;
    }
    if (a === 'verify3d') {
      if (digits(v.kod) !== st.code) { st.err.kod = 'Kod hatalı. SMS\'teki 6 haneli kodu girin.'; ctx.emit('shop-3d-wrong'); ctx.refresh(); return; }
      SHOP.finish(ctx);
      return;
    }
    if (a === 'cancel3d') { ctx.emit('shop-3d-cancel'); ctx.go('/odeme'); }
  },
  finish(ctx) {
    const st = ctx.state;
    const o = { no: 'FP' + code(8), kargo: 'KRG' + code(10), tutar: st.order.tutar, yontem: st.order.yontem, stage: 1 };
    (st.orders ||= []).unshift(o);
    st.last = o;
    st.cart = [];
    st.form = {};
    if (st.order.kaydet && st.order.yontem === 'kart') ctx.desk.toast('Kartınız kaydedildi', '“Kartımı kaydet” işaretli kaldığı için kart bilgileriniz bu sitede saklanıyor. İstemiyorsanız o kutuyu boşaltın.', 'ℹ', 7000);
    ctx.emit('shop-order', { no: o.no, yontem: o.yontem, saved: st.order.kaydet });
    ctx.go('/tamam');
  },
};

// ======================================================================= Görüntülü görüşme
const PEOPLE = [['Elif', '👩', 'Torununuz'], ['Ahmet', '👴', 'Kardeşiniz']];
const MEET = {
  name: 'Görüntülü Görüşme', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    st.phase ||= 'pre';
    if (st.mic === undefined) { st.mic = true; st.cam = true; st.chat = [{ who: 'Elif', text: 'Herkes hoş geldi! 🙂' }]; }
    const camP = ctx.perm('camera'), micP = ctx.perm('mic');
    const blocked = camP === 'block' || micP === 'block';
    const micOn = st.mic && micP === 'allow', camOn = st.cam && camP === 'allow';
    const me = (big) => `<div class="mt-tile me ${big ? 'big' : ''}">${camOn ? '<div class="mt-cam">🙂</div>' : `<div class="mt-av">${esc((st.name || ctx.desk.settings.user || '?')[0])}</div>`}<span>${esc(st.name || 'Siz')} (siz) ${micOn ? '' : '🔇'}</span></div>`;
    const bar = (inCall) => `<div class="mt-bar"><button type="button" data-act="mic" class="${micOn ? '' : 'off'}" title="Mikrofon (sessize al)">${micOn ? '🎤' : '🔇'}<small>${micOn ? 'Sessize al' : 'Sesi aç'}</small></button>
      <button type="button" data-act="cam" class="${camOn ? '' : 'off'}" title="Kamera">${camOn ? '📷' : '🚫'}<small>${camOn ? 'Kamerayı kapat' : 'Kamerayı aç'}</small></button>
      ${inCall ? `<button type="button" data-act="hand" class="${st.hand ? 'on' : ''}">✋<small>El kaldır</small></button><button type="button" data-act="chatT" class="${st.chatOpen ? 'on' : ''}">💬<small>Sohbet</small></button><button type="button" data-act="leave" class="mt-leave">📞<small>Ayrıl</small></button>` : ''}</div>`;
    if (st.phase === 'left') return page('Görüşmeden ayrıldınız', `<div class="mt mt-pre"><h1>Görüşmeden ayrıldınız</h1><p>Görüşme bağlantısını kapatmak için sekmeyi kapatabilirsiniz.</p><button type="button" class="ed-btn" data-act="rejoin">Yeniden katıl</button></div>`, 'mt-bg');
    if (st.phase === 'pre') {
      return page('Aile toplantısı - Görüntülü Görüşme', `<div class="mt mt-pre"><h1>📹 Aile toplantısı</h1><p>Elif ve Ahmet görüşmede.</p>
        ${blocked ? '<div class="ed-bad">🚫 Kamera ya da mikrofon <b>engellendi</b>. Adres çubuğundaki 🔒 kilide tıklayın, <b>Kamera</b> ve <b>Mikrofon</b>\'u “İzin ver” yapın, sonra sayfayı yenileyin (⟳).</div>' : !camP || !micP ? '<div class="ed-note">Tarayıcı kamera ve mikrofon için izin soruyor (yukarıda). Görüntülü görüşme için <b>İzin ver</b> deyin.</div>' : ''}
        ${me(true)}${bar(false)}<form class="mt-join" data-act="join"><label>Adınız<input name="ad" value="${esc(st.name || '')}" autocomplete="off" placeholder="Görüşmede görünecek adınız"></label>${errOf(st, 'ad')}<button class="ed-btn">Şimdi katıl</button></form></div>`, 'mt-bg');
    }
    return page('Aile toplantısı - Görüntülü Görüşme', `<div class="mt mt-in"><div class="mt-main"><div class="mt-grid">${PEOPLE.map(([n, e, w], i) => `<div class="mt-tile ${i === 0 && st.talk ? 'talk' : ''}"><div class="mt-cam">${e}</div><span>${n} · ${w} ${i === 1 ? '🔇' : ''}</span></div>`).join('')}${me(false)}${st.hand ? '<div class="mt-handnote">✋ Elinizi kaldırdınız</div>' : ''}</div>${bar(true)}</div>
      ${st.chatOpen ? `<aside class="mt-chat"><b>Sohbet</b><div class="mt-msgs">${st.chat.map((m) => `<p><b>${esc(m.who)}:</b> ${esc(m.text)}</p>`).join('')}</div><form data-act="send"><input name="msg" placeholder="Mesaj yazın" autocomplete="off"><button>➤</button></form></aside>` : ''}</div>`, 'mt-bg');
  },
  mount(el, ctx) {
    const st = ctx.state;
    if (st.phase === 'pre' && (!ctx.perm('camera') || !ctx.perm('mic')) && !st.asked) {
      st.asked = true;
      setTimeout(() => ctx.askPerm(['camera', 'mic'], (v) => { ctx.emit('meet-perm', { value: v }); ctx.refresh(); }), 400);
    }
    if (st.phase !== 'in') return 0;
    // Elif konuşuyor: çerçevesi yanıp söner. Siz sessizdeyken sizi duyamadığını yazar.
    return setInterval(() => {
      if (!el.isConnected) return;
      st.talk = !st.talk;
      el.querySelector('.mt-grid .mt-tile')?.classList.toggle('talk', st.talk);
      st.tick = (st.tick || 0) + 1;
      if (st.tick >= 3 && !(st.mic && ctx.perm('mic') === 'allow') && !st.toldMute) {
        st.toldMute = true;
        st.chat.push({ who: 'Elif', text: 'Sizi duyamıyoruz 🙂 Mikrofonunuz kapalı galiba, alttaki 🔇 düğmesine basın.' });
        st.chatOpen = true;
        ctx.emit('meet-cant-hear');
        ctx.refresh();
      }
    }, 1200);
  },
  act(a, v, ctx) {
    const st = ctx.state;
    st.err = {};
    if (a === 'mic' || a === 'cam') {
      const p = ctx.perm(a === 'mic' ? 'mic' : 'camera');
      if (p !== 'allow') { ctx.desk.toast('İzin gerekli', `${a === 'mic' ? 'Mikrofon' : 'Kamera'} için izin verilmedi. Adres çubuğundaki 🔒 kilitten “İzin ver” yapın.`, '🔒', 5000); ctx.emit('meet-need-perm', { what: a }); return; }
      st[a] = !st[a];
      ctx.emit('meet-toggle', { what: a, on: st[a] });
      if (a === 'mic' && st[a] && st.phase === 'in' && st.toldMute && !st.thanked) { st.thanked = true; st.chat.push({ who: 'Elif', text: 'Şimdi duyuyoruz! 👋 Merhaba!' }); }
      ctx.refresh();
      return;
    }
    if (a === 'join') {
      if (!v.ad) { st.err.ad = 'Görüşmede görünecek adınızı yazın.'; ctx.refresh(); return; }
      st.name = v.ad;
      st.phase = 'in';
      st.tick = 0;
      ctx.emit('meet-join', { name: v.ad, mic: st.mic && ctx.perm('mic') === 'allow', cam: st.cam && ctx.perm('camera') === 'allow' });
      ctx.refresh();
      return;
    }
    if (a === 'hand') { st.hand = !st.hand; ctx.emit('meet-hand', { on: st.hand }); ctx.refresh(); return; }
    if (a === 'chatT') { st.chatOpen = !st.chatOpen; ctx.emit('meet-chat-open', { on: st.chatOpen }); ctx.refresh(); return; }
    if (a === 'send') {
      if (!v.msg) return;
      st.chat.push({ who: st.name || 'Siz', text: v.msg });
      ctx.emit('meet-chat', { text: v.msg });
      ctx.refresh();
      setTimeout(() => { st.chat.push({ who: 'Ahmet', text: 'Bizi görmek güzel! 😊' }); if (st.phase === 'in') ctx.refresh(); }, 2000);
      return;
    }
    if (a === 'leave') { st.phase = 'left'; st.hand = false; ctx.emit('meet-leave'); ctx.refresh(); return; }
    if (a === 'rejoin') { st.phase = 'pre'; ctx.refresh(); }
  },
};

export const GUNLUK_SITES = {
  'www.turkiye.gov.tr': EDEVLET,
  'www.mhrs.gov.tr': MHRS,
  'www.firsat-pazari.com.tr': SHOP,
  'gorusme.bulalim.com': MEET,
};
