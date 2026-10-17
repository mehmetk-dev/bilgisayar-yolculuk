// E-posta: web postasına benzeyen bir posta kutusu. Gelen kutusu, okuma, yanıtlama, iletme, ek indirme ve ekleme,
// istenmeyen (sahte) posta ve yanlışlıkla oraya düşen gerçek posta, kişiler (adres defteri), imza, büyük ek sınırı.
// Adresler ve adlar uydurmadır; hiçbir şey gerçekten gönderilmez.
import { fmtSize } from './explorer.js';
import { esc, pictureURL, isImage } from './util.js';
import { fileIcon } from '../dialog.js';

export const ME = 'ogrenci@ornek.com';

// Kişiler: posta gönderilince kısa süre sonra cevap verenler
const CONTACTS = {
  'elif@ornek.com': { name: 'Elif (torunum)', reply: (m) => m.attachments.length
    ? `Çok teşekkürler! ${m.attachments.map((a) => a.name).join(', ')} geldi, çok güzel olmuş. 😍\n\nSevgiler,\nElif`
    : 'Postanız geldi, çok sevindim! Bahçenin fotoğrafını da gönderebilir misiniz? “Resimler” klasöründe “çiçekler.jpg” diye bir fotoğraf vardı.\n\nSevgiler,\nElif' },
  'hoca@ornek.com': { name: 'Bilgisayar Hocası', reply: () => 'Postanızı aldım, eline sağlık! Böyle devam.\n\nHocanız' },
};

const today = () => new Date().toLocaleDateString('tr-TR');
let seq = 1;

function seed() {
  const m = (o) => ({ id: 'm' + seq++, folder: 'inbox', read: false, attachments: [], date: today(), to: ME, ...o });
  return [
    m({ key: 'elif', from: 'elif@ornek.com', fromName: 'Elif (torunum)', subject: 'Bayram fotoğrafı', time: '09:42',
      body: 'Merhaba!\n\nBayramda hep birlikte çektiğimiz fotoğrafı ekte gönderiyorum. İndirip bilgisayarınıza kaydedebilirsiniz.\n\nGörüşmek üzere,\nElif',
      attachments: [{ name: 'bayram.jpg', content: { emoji: '👨‍👩‍👧‍👦', bg: ['#ffe082', '#ffab91'] } }] }),
    m({ key: 'banka', from: 'guvenlik@bankaniz-dogrulama.xyz', fromName: 'Bankanız Güvenlik', subject: 'ACİL: Hesabınız askıya alındı!', time: '08:15', danger: true,
      body: 'Sayın müşterimiz,\n\nHesabınızda şüpheli işlem tespit edildi. 24 saat içinde bilgilerinizi doğrulamazsanız hesabınız KAPATILACAKTIR.\n\nHemen aşağıdaki bağlantıya tıklayıp kart numaranızı ve şifrenizi girin.',
      link: 'Hesabımı doğrula' }),
    m({ key: 'eczane', from: 'bilgi@mahalle-eczanesi.com.tr', fromName: 'Mahalle Eczanesi', subject: 'İlacınız hazır', time: 'Dün', read: true,
      body: 'Merhaba,\n\nSipariş ettiğiniz ilaç eczanemize gelmiştir. Hafta içi 09:00 – 19:00 arasında alabilirsiniz.\n\nGeçmiş olsun,\nMahalle Eczanesi' }),
    m({ key: 'hoca', from: 'hoca@ornek.com', fromName: 'Bilgisayar Hocası', subject: 'Bu haftaki ders', time: 'Dün', read: true,
      body: 'Merhaba,\n\nBu hafta e-posta göndermeyi öğreneceğiz. Derste görüşmek üzere!\n\nHocanız' }),
    m({ key: 'piyango', folder: 'spam', from: 'odul@kazandiniz-hemen.xyz', fromName: 'ÖDÜL MERKEZİ', subject: '1.000.000 TL KAZANDINIZ!!!', time: 'Dün', danger: true,
      body: 'Tebrikler! Çekilişte büyük ödülü kazandınız. Ödülünüzü almak için 499 TL işlem ücretini hemen gönderin!!!' }),
    m({ key: 'belediye', folder: 'spam', from: 'duyuru@belediye.bel.tr', fromName: 'Belediye Duyuru', subject: 'Perşembe günü planlı su kesintisi', time: '2 gün önce',
      body: 'Sayın vatandaşımız,\n\nŞebeke bakımı nedeniyle Perşembe günü 09:00 – 15:00 saatleri arasında mahallenizde su kesintisi yapılacaktır.\n\nAnlayışınız için teşekkür ederiz.\nBelediye Su İşleri' }),
  ];
}

// Posta kutusu masaüstüne bağlıdır: ders başında masaüstü sıfırlanınca o da baştan kurulur
const box = (desk) => (desk.mail ||= { mails: seed(), contacts: Object.entries(CONTACTS).map(([email, c]) => ({ name: c.name, email })).concat([{ name: 'Mahalle Eczanesi', email: 'bilgi@mahalle-eczanesi.com.tr' }]), signature: '', unsub: [], storageBase: 0 });
export const mailBox = box;
export const QUOTA = 15e9; // posta kutusunun alanı (15 GB)
// Kullanılan alan: storageBase verilmişse (ders “kutu dolmak üzere” diye kurduysa) gösterilir. Çöp Kutusu boşaltılana kadar yer açılmaz.
const used = (desk, mb) => mb.storageBase + mb.mails.reduce((t, m) => t + 30e3 + m.attachments.reduce((a, x) => a + attSize(desk, x), 0), 0);
const gb = (b) => (b / 1e9).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const FULL = 0.99; // bu oranın üstünde kutu “dolu” sayılır

// Arama: düz kelimeler konu, gönderen ve yazıda aranır. ek:var / has:attachment → ekli postalar,
// kimden:ad / from:ad → gönderen, büyük:10mb / larger:10M → ekleri o boyuttan büyük olanlar
export function searchMail(desk, mails, q) {
  const words = q.toLocaleLowerCase('tr').split(/\s+/).filter(Boolean);
  return mails.filter((m) => m.folder !== 'trash' && words.every((w) => {
    let r;
    if (/^(ek:var|has:attachment)$/.test(w)) return m.attachments.length > 0;
    if ((r = w.match(/^(?:kimden|from):(.+)$/))) return `${m.fromName} ${m.from}`.toLocaleLowerCase('tr').includes(r[1]);
    if ((r = w.match(/^(?:büyük|buyuk|larger):(\d+)\s*(mb|m)?$/))) return m.attachments.reduce((t, a) => t + attSize(desk, a), 0) > +r[1] * 1e6;
    return `${m.subject} ${m.fromName} ${m.from} ${m.body}`.toLocaleLowerCase('tr').includes(w);
  }));
}
export const MAX_ATTACH = 25e6; // e-postayla gönderilebilecek en büyük ek (25 MB)

// Derslerin gelen kutusuna posta koyması için (ör. görüntülü görüşme daveti). url: postadaki bağlantının adresi
export function deliverMail(desk, o, quiet) {
  const mb = box(desk);
  if (o.key && mb.mails.some((m) => m.key === o.key)) return;
  if (mb.unsub.includes(o.from)) return; // abonelikten çıkılan gönderen artık posta göndermez
  const m = { id: 'm' + seq++, folder: 'inbox', read: false, attachments: [], date: today(), time: new Date().toTimeString().slice(0, 5), to: ME, ...o };
  mb.mails.unshift(m);
  desk.wins.filter((w) => w.app === 'mail').forEach((w) => w.api.refresh?.());
  if (!quiet) desk.toast('Yeni posta', `${esc(m.fromName)}: ${esc(m.subject)}`, '📩');
  return m;
}

const FOLDERS = [['inbox', '📥', 'Gelen Kutusu'], ['drafts', '📝', 'Taslaklar'], ['sent', '📤', 'Gönderilenler'], ['spam', '⚠', 'İstenmeyen'], ['trash', '🗑', 'Çöp Kutusu']];
const attSize = (desk, a) => a.size ?? desk.fs.sizeOf({ name: a.name, content: a.content, type: 'file' });
// E-posta adresinde Türkçe harf, boşluk ve virgül olmaz; bir tane @ ve @'den sonra noktalı bir alan adı olur
export function addrProblem(a) {
  if (!a) return 'Kime kutusu boş. Postayı kime göndereceğinizi yazın.';
  if (/\s/.test(a)) return 'Adreste boşluk olamaz.';
  if (!a.includes('@')) return 'Adreste @ işareti yok. @ için AltGr + Q.';
  if ((a.match(/@/g) || []).length > 1) return 'Adreste yalnızca bir tane @ olur.';
  if (/[çğıöşüÇĞİÖŞÜ]/.test(a)) return 'E-posta adreslerinde Türkçe harf (ç, ğ, ı, ö, ş, ü) olmaz.';
  if (a.includes(',')) return 'Adreste virgül değil nokta olur: ornek.com';
  if (!/^[^@]+@[^@]+\.[a-z]{2,}$/i.test(a)) return '@ işaretinden sonra “ornek.com” gibi noktalı bir adres olmalı.';
  return '';
}

// Birden çok alıcı noktalı virgülle (;) ayrılır: ali@ornek.com; ayse@ornek.com
export const splitAddrs = (s) => String(s || '').split(';').map((x) => x.trim()).filter(Boolean);
const listProblem = (s) => splitAddrs(s).map(addrProblem).find(Boolean) || '';

export function mail({ desk, body, emit, setTitle }) {
  const mb = box(desk);
  body.classList.add('pm');
  let folder = 'inbox', view = null; // view: { kind: 'read', id } | { kind: 'compose', ... }
  let query = ''; // folder === 'search' iken arama sorgusu
  const $ = (s) => body.querySelector(s);
  const get = (id) => mb.mails.find((m) => m.id === id);
  const unread = () => mb.mails.filter((m) => m.folder === 'inbox' && !m.read).length;

  function render() {
    const n = unread();
    setTitle(`E-posta${n ? ` (${n})` : ''}`);
    const u = mb.storageBase ? used(desk, mb) : 0;
    body.innerHTML = `<div class="pm-top"><span class="pm-logo">✉ Postam</span><form class="pm-sform"><input class="pm-search" type="search" placeholder="Postalarda ara (ör. fatura, ek:var)" value="${esc(query)}" autocomplete="off" spellcheck="false"></form><span class="pm-me">${ME}</span></div>
      <div class="pm-main"><nav class="pm-side"><button type="button" class="pm-new">✏ Yeni posta</button>
        ${FOLDERS.map(([id, ic, label]) => `<button type="button" data-folder="${id}" class="${id === folder && !view ? 'on' : ''}">${ic} ${label}${id === 'inbox' && n ? ` <b>${n}</b>` : ''}</button>`).join('')}
        <hr><button type="button" data-folder="contacts" class="${folder === 'contacts' && !view ? 'on' : ''}">👥 Kişiler</button><button type="button" data-folder="settings" class="${folder === 'settings' && !view ? 'on' : ''}">⚙ Ayarlar</button>
        ${u ? `<div class="pm-quota ${u / QUOTA > FULL ? 'full' : ''}" title="Posta kutusunun alanı"><small>Depolama</small><div class="pm-qbar"><i style="width:${Math.min(100, (u / QUOTA) * 100).toFixed(1)}%"></i></div><small><b>${gb(u)} GB</b> / 15 GB kullanıldı</small></div>` : ''}</nav>
      <section class="pm-pane">${view?.kind === 'read' ? readHtml(get(view.id)) : view?.kind === 'compose' ? composeHtml() : folder === 'contacts' ? contactsHtml() : folder === 'settings' ? settingsHtml() : listHtml()}</section></div>
      <datalist id="pm-people">${mb.contacts.map((c) => `<option value="${esc(c.email)}">${esc(c.name)}</option>`).join('')}</datalist>`;
    if (view?.kind === 'compose') {
      $('.pm-to').value = view.to; $('.pm-subj').value = view.subject; $('.pm-body').value = view.text;
      if ($('.pm-cc')) { $('.pm-cc').value = view.cc; $('.pm-bcc').value = view.bcc; }
    }
  }

  function contactsHtml() {
    return `<h2 class="pm-h">👥 Kişiler</h2><p class="pm-hint">Kayıtlı kişilere posta yazarken adresin ilk harflerini yazmanız yeter; tamamı önerilir.</p>
      <ul class="pm-people">${mb.contacts.map((c, i) => `<li><span class="pm-av">${esc(c.name[0])}</span><div><b>${esc(c.name)}</b><small>${esc(c.email)}</small></div><button type="button" data-write="${i}">✉ Posta yaz</button><button type="button" data-cdel="${i}" title="Kişiyi sil">🗑</button></li>`).join('')}</ul>
      <form class="pm-addc"><b>＋ Yeni kişi</b><input name="cname" placeholder="Ad (ör. Fatma teyze)" autocomplete="off"><input name="cmail" placeholder="E-posta adresi" autocomplete="off" spellcheck="false"><button type="submit">Kaydet</button><div class="pm-err"></div></form>`;
  }
  function settingsHtml() {
    return `<h2 class="pm-h">⚙ Ayarlar</h2><label class="pm-sig"><b>İmza</b><small>Yazdığınız her postanın sonuna kendiliğinden eklenir (adınız, telefonunuz…)</small><textarea rows="4" placeholder="ör.\nAyşe Yılmaz\n0555 123 45 67">${esc(mb.signature)}</textarea></label><button type="button" class="pm-sigsave primary">Kaydet</button>`;
  }

  function listHtml() {
    const list = folder === 'search' ? searchMail(desk, mb.mails, query) : mb.mails.filter((m) => m.folder === folder);
    const label = folder === 'search' ? `🔍 Arama: “${esc(query)}” · ${list.length} posta` : FOLDERS.find((f) => f[0] === folder)[2];
    const big = (m) => m.attachments.reduce((t, a) => t + attSize(desk, a), 0);
    const full = folder === 'inbox' && mb.storageBase && used(desk, mb) / QUOTA > FULL;
    return `<h2 class="pm-h">${label}</h2>${full ? '<p class="pm-hint pm-full">⚠ <b>Posta kutunuz dolmak üzere.</b> Yer açmazsanız yeni postalar size ulaşamaz. Büyük ekli postaları silip Çöp Kutusu\'nu boşaltın.</p>' : ''}${folder === 'search' && list.length ? `<p class="pm-bulk"><button type="button" class="pm-delall">🗑 Bulunan ${list.length} postanın hepsini sil</button></p>` : ''}${folder === 'trash' && list.length ? '<p class="pm-hint">🗑 Silinen postalar burada 30 gün durur ve yer kaplamaya devam eder. <button type="button" class="pm-empty-trash">Çöp Kutusunu şimdi boşalt</button></p>' : ''}${folder === 'search' ? '<p class="pm-hint">İpucu: <b>ek:var</b> ekli postaları, <b>kimden:ad</b> bir kişinin postalarını, <b>büyük:10mb</b> 10 MB\'tan büyük ekleri bulur.</p>' : ''}${folder === 'spam' ? '<p class="pm-hint">⚠ İstenmeyen klasörüne şüpheli postalar kendiliğinden düşer. Ara sıra bakın: bazen gerçek postalar da buraya düşer.</p>' : ''}${list.length ? `<ul class="pm-list">${list.map((m) => `<li><button type="button" data-open="${m.id}" class="${m.read ? '' : 'unread'}">
      <span class="pm-from">${esc(folder === 'sent' ? 'Kime: ' + m.to : folder === 'drafts' ? '📝 Taslak' + (m.to ? ' · ' + m.to : '') : m.fromName)}</span><span class="pm-subj">${esc(m.subject || '(Konu yok)')}${m.attachments.length ? ` 📎${big(m) > 1e6 ? ` <small class="pm-size">${fmtSize(big(m))}</small>` : ''}` : ''}</span><span class="pm-time">${esc(m.time)}${folder === 'search' && m.folder !== 'inbox' ? ` · ${FOLDERS.find((f) => f[0] === m.folder)?.[2] || ''}` : ''}</span></button></li>`).join('')}</ul>` : `<p class="pm-empty">${folder === 'search' ? 'Aramanızla eşleşen posta yok.' : 'Bu klasörde posta yok.'}</p>`}`;
  }

  function readHtml(m) {
    const att = m.attachments.length ? `<div class="pm-atts">${m.attachments.map((a, i) => `<div class="pm-att">${isImage(a.name) ? `<img src="${pictureURL(a.content)}" alt="">` : `<span>${fileIcon(a.name)}</span>`}<b>${esc(a.name)}</b>${m.folder === 'sent' ? '' : `<button type="button" data-dl="${i}">⬇ İndir</button>`}</div>`).join('')}</div>` : '';
    return `<div class="pm-tools"><button type="button" class="pm-back">← Geri</button>
        ${m.folder === 'sent' ? '' : '<button type="button" class="pm-reply">↩ Yanıtla</button>'}<button type="button" class="pm-fwd">↪ İlet</button>
        ${m.folder === 'inbox' ? '<button type="button" class="pm-spam">⚠ İstenmeyen</button>' : ''}${m.folder === 'spam' ? '<button type="button" class="pm-notspam">✔ İstenmeyen değil</button>' : ''}
        ${m.folder !== 'sent' && !mb.contacts.some((c) => c.email === m.from) && !m.danger ? '<button type="button" class="pm-savec">👤 Kişilere ekle</button>' : ''}${m.folder === 'trash' ? '' : '<button type="button" class="pm-del">🗑 Sil</button>'}</div>
      <h2 class="pm-h">${esc(m.subject || '(Konu yok)')}</h2>
      ${m.list && m.folder !== 'sent' ? `<div class="pm-unsub">${mb.unsub.includes(m.from) ? `✔ <b>${esc(m.fromName)}</b> listesinden çıktınız; bu gönderenden artık posta gelmeyecek.` : `📰 Bu postayı <b>${esc(m.fromName)}</b> bülteninden alıyorsunuz. <button type="button" class="pm-unsub-btn">Abonelikten çık</button>`}</div>` : ''}
      <div class="pm-meta"><b>${esc(m.fromName || 'Ben')}</b> &lt;${esc(m.from)}&gt;<br><span>Kime: ${esc(m.to)}${m.cc ? ` · Bilgi: ${esc(m.cc)}` : ''}${m.bcc ? ` · Gizli: ${esc(m.bcc)}` : ''} · ${esc(m.date)} ${esc(m.time)}</span></div>
      <div class="pm-text">${esc(m.body).replace(/\n/g, '<br>')}</div>
      ${m.link ? `<p><a href="#" class="pm-link" data-danger="1">👉 ${esc(m.link)}</a></p>` : ''}${m.url ? `<p><a href="#" class="pm-url" data-url="${esc(m.url)}" title="${esc(m.url)}">👉 ${esc(m.urlText || m.url)}</a><br><small class="pm-urlnote">Bağlantı adresi: ${esc(m.url)}</small></p>` : ''}${att}`;
  }

  function composeHtml() {
    return `<div class="pm-tools"><button type="button" class="pm-send primary">➤ Gönder</button><button type="button" class="pm-attach">📎 Dosya ekle</button><button type="button" class="pm-discard">✕ Vazgeç</button></div>
      <h2 class="pm-h">${view.title}</h2>
      <label class="pm-field"><span>Kime:</span><input class="pm-to" type="text" spellcheck="false" autocomplete="off" placeholder="ornek@ornek.com (birden çok adres için ; ile ayırın)" list="pm-people">${view.showCc ? '' : '<button type="button" class="pm-ccbtn" title="Bilgi (Cc) ve Gizli (Bcc) alanlarını göster">Bilgi / Gizli</button>'}</label>
      ${view.showCc ? `<label class="pm-field"><span>Bilgi (Cc):</span><input class="pm-cc" type="text" spellcheck="false" autocomplete="off" placeholder="Bilgisi olsun istediğiniz kişiler (herkes görür)"></label>
      <label class="pm-field"><span>Gizli (Bcc):</span><input class="pm-bcc" type="text" spellcheck="false" autocomplete="off" placeholder="Gizli alıcılar (diğerleri görmez)"></label>` : ''}
      <label class="pm-field"><span>Konu:</span><input class="pm-subj" type="text" autocomplete="off"></label>
      ${view.attachments.length ? `<div class="pm-atts">${view.attachments.map((a, i) => `<div class="pm-att">${isImage(a.name) ? `<img src="${pictureURL(a.content)}" alt="">` : `<span>${fileIcon(a.name)}</span>`}<b>${esc(a.name)}</b><small>${fmtSize(attSize(desk, a))}</small><button type="button" data-unatt="${i}" title="Eki çıkar">✕</button></div>`).join('')}</div>` : ''}
      <div class="pm-err" aria-live="polite"></div>
      <textarea class="pm-body" spellcheck="false" placeholder="Mesajınızı buraya yazın"></textarea>`;
  }

  // Yazma ekranındaki kutuların içeriği yeniden çizimde kaybolmasın
  const keep = () => {
    if (view?.kind === 'compose' && $('.pm-to')) {
      view.to = $('.pm-to').value; view.subject = $('.pm-subj').value; view.text = $('.pm-body').value;
      if ($('.pm-cc')) { view.cc = $('.pm-cc').value; view.bcc = $('.pm-bcc').value; }
    }
  };

  // Yazma ekranından ayrılınca (başka klasöre geçince, başka posta açınca) yarım kalan posta Taslaklar'a kaydedilir
  function saveDraft() {
    keep();
    if (view?.kind !== 'compose') return;
    const filled = view.to.trim() || view.cc.trim() || view.subject.trim() || view.text.trim() !== view.initText.trim() || view.attachments.length;
    if (!filled) return;
    let d = view.draftId && get(view.draftId);
    if (!d) { d = { id: 'm' + seq++, folder: 'drafts', read: true, from: ME, fromName: 'Ben', date: today(), attachments: [] }; mb.mails.unshift(d); view.draftId = d.id; }
    Object.assign(d, { to: view.to.trim(), cc: view.cc, bcc: view.bcc, subject: view.subject.trim(), body: view.text, attachments: view.attachments, time: new Date().toTimeString().slice(0, 5), replyTo: view.replyTo, forwardOf: view.forwardOf, initText: view.initText, title: view.title });
    desk.toast('Taslak kaydedildi', 'Yarım kalan postanız Taslaklar klasöründe duruyor.', '📝', 3500);
    emit('mail-draft-save', { id: d.id, subject: d.subject });
  }

  function compose(o = {}) {
    saveDraft();
    view = { kind: 'compose', title: 'Yeni posta', to: '', cc: '', bcc: '', showCc: false, subject: '', text: mb.signature ? `\n\n--\n${mb.signature}` : '', attachments: [], ...o };
    if (o.text != null && mb.signature) view.text = `\n\n--\n${mb.signature}${o.text}`;
    if (view.cc || view.bcc) view.showCc = true;
    view.initText = o.draftId ? (o.initText ?? '') : view.text;
    render();
    emit('mail-compose', { reply: !!o.replyTo, forward: !!o.forwardOf });
    setTimeout(() => { (view.to ? $('.pm-body') : $('.pm-to'))?.focus(); if (view.to) caretTop(); }, 0);
  }
  // İmza önceden kutuya konduğu için imleç imzanın altına gitmesin: kutu henüz değişmediyse imleç en başa (imzanın ÜSTÜNE) konur
  const untouched = (b) => view?.kind === 'compose' && mb.signature && b.value === view.initText;
  function caretTop() { const b = $('.pm-body'); if (b && untouched(b)) b.setSelectionRange(0, 0); }
  body.addEventListener('mousedown', (e) => {
    const b = e.target.closest('.pm-body');
    if (!b || !untouched(b)) return;
    e.preventDefault();
    b.focus();
    b.setSelectionRange(0, 0);
    b.scrollTop = 0;
  });

  function openMail(id) {
    const m = get(id);
    if (m.folder === 'drafts') {
      compose({ title: m.title || 'Taslak', to: m.to, cc: m.cc || '', bcc: m.bcc || '', subject: m.subject, text: m.body, attachments: [...m.attachments], replyTo: m.replyTo, forwardOf: m.forwardOf, draftId: m.id, initText: m.initText });
      emit('mail-draft-open', { id: m.id, subject: m.subject });
      return;
    }
    saveDraft();
    m.read = true;
    view = { kind: 'read', id };
    render();
    emit('mail-open', { id, key: m.key, from: m.from, subject: m.subject, folder: m.folder, replyOf: m.replyOf });
  }

  function send() {
    keep();
    const to = view.to.trim(), err = (t) => { $('.pm-err').textContent = t; emit('mail-error', { what: t }); };
    const p = !splitAddrs(to).length ? addrProblem('') : listProblem(to);
    if (p) { err(p); $('.pm-to').focus(); return; }
    const pc = listProblem(view.cc) || listProblem(view.bcc);
    if (pc) { err('Bilgi (Cc) ya da Gizli (Bcc) alanında: ' + pc); return; }
    const big = view.attachments.find((a) => attSize(desk, a) > MAX_ATTACH);
    if (big) { err(`Ek çok büyük: “${big.name}” ${fmtSize(attSize(desk, big))}. E-postayla en fazla 25 MB gönderilebilir. Dosyayı buluta (☁ Bulut Depo) yükleyip paylaşım bağlantısını gönderin.`); emit('mail-too-big', { name: big.name }); return; }
    const go = () => {
      const m = { id: 'm' + seq++, folder: 'sent', read: true, from: ME, fromName: 'Ben', to, cc: view.cc.trim(), bcc: view.bcc.trim(), subject: view.subject.trim(), body: view.text, attachments: view.attachments, date: today(), time: new Date().toTimeString().slice(0, 5), replyTo: view.replyTo, forwardOf: view.forwardOf };
      mb.mails.unshift(m);
      if (view.draftId) mb.mails = mb.mails.filter((x) => x.id !== view.draftId);
      folder = 'inbox';
      view = null;
      render();
      desk.toast('Posta gönderildi', `Kime: ${esc(to)}`, '✉');
      emit('mail-send', { id: m.id, to, toList: splitAddrs(to), cc: splitAddrs(m.cc), bcc: splitAddrs(m.bcc), subject: m.subject, body: m.body, attachments: m.attachments.map((a) => a.name), replyTo: m.replyTo, replyKey: m.replyTo && get(m.replyTo)?.key, forwardOf: m.forwardOf });
      const c = CONTACTS[splitAddrs(to)[0].toLowerCase()];
      if (c) setTimeout(() => {
        if (desk.mail !== mb) return; // bu arada ders değişti
        const r = { id: 'm' + seq++, folder: 'inbox', read: false, from: splitAddrs(to)[0].toLowerCase(), fromName: c.name, to: ME, subject: /^Ynt:/.test(m.subject) ? m.subject : 'Ynt: ' + (m.subject || ''), body: c.reply(m), attachments: [], date: today(), time: new Date().toTimeString().slice(0, 5), replyOf: m.id, key: 'cevap' };
        mb.mails.unshift(r);
        if (!view) render(); else setTitle(`E-posta (${unread()})`);
        body.querySelectorAll('[data-folder="inbox"]').forEach((b) => { b.innerHTML = `📥 Gelen Kutusu <b>${unread()}</b>`; });
        desk.toast('Yeni posta', `${esc(c.name)}: ${esc(r.subject)}`, '📩');
        emit('mail-new', { id: r.id, from: r.from });
      }, 3500);
    };
    if (!view.subject.trim()) {
      desk.dialogs.ask({ title: 'Konu yok', icon: '✉', text: 'Bu postanın konusu boş. Yine de gönderilsin mi?', buttons: [['send', 'Gönder'], ['back', 'Geri dön, konu yazayım', true]] })
        .then((a) => { if (a === 'send') go(); else { $('.pm-subj').focus(); emit('mail-error', { what: 'konu' }); } });
      return;
    }
    go();
  }

  function attach() {
    keep();
    desk.dialogs.file({ mode: 'open', fs: desk.fs.dialogApi(), folder: 'pictures', ext: '', typeLabel: 'Bütün dosyalar (*.*)', accept: /./ }).then((r) => {
      if (!r) return;
      const n = desk.fs.find(r.folder, r.name);
      const a = { name: r.name, content: n?.content, size: n ? desk.fs.sizeOf(n) : 0 };
      view.attachments.push(a);
      render();
      if (a.size > MAX_ATTACH) $('.pm-err').textContent = `⚠ Bu dosya ${fmtSize(a.size)}; e-postayla en fazla 25 MB gönderilebilir.`;
      emit('mail-attach', { name: r.name, size: a.size, tooBig: a.size > MAX_ATTACH });
    });
  }

  body.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.classList.contains('pm-link')) {
      e.preventDefault();
      emit('mail-link', { danger: !!t.dataset.danger });
      desk.dialogs.ask({ title: 'Dikkat!', icon: '⚠', text: 'Bu bağlantı bankanızın sitesine değil, <b>bankaniz-dogrulama.xyz</b> adlı yabancı bir siteye gidiyor. Bankalar e-postayla şifre ya da kart numarası istemez.', buttons: [['ok', 'Anladım', true]] });
      return;
    }
    if (t.classList.contains('pm-url')) {
      e.preventDefault();
      emit('mail-url', { url: t.dataset.url });
      desk.open('browser', { url: t.dataset.url });
      return;
    }
    if (t.classList.contains('pm-new')) return compose();
    if (t.classList.contains('pm-delall')) {
      const list = searchMail(desk, mb.mails, query);
      const size = list.reduce((t2, m) => t2 + m.attachments.reduce((a, x) => a + attSize(desk, x), 0), 0);
      list.forEach((m) => { m.folder = 'trash'; });
      render();
      desk.toast('Çöp Kutusu\'na taşındı', `${list.length} posta`, '🗑');
      emit('mail-delete-many', { count: list.length, size, q: query, keys: list.map((m) => m.key) });
      return;
    }
    if (t.classList.contains('pm-empty-trash')) {
      desk.dialogs.ask({ title: 'Çöp Kutusu', icon: '🗑', text: 'Çöp Kutusu\'ndaki bütün postalar <b>kalıcı olarak</b> silinsin mi?', buttons: [['yes', 'Evet, boşalt', true], ['no', 'Vazgeç']] }).then((a) => {
        if (a !== 'yes') return;
        const n = mb.mails.filter((m) => m.folder === 'trash').length;
        mb.mails = mb.mails.filter((m) => m.folder !== 'trash');
        render();
        emit('mail-empty-trash', { count: n, used: mb.storageBase ? used(desk, mb) : 0 });
      });
      return;
    }
    if (t.classList.contains('pm-unsub-btn') && view?.kind === 'read') {
      const m = get(view.id);
      desk.dialogs.ask({ title: 'Abonelikten çık', icon: '📰', text: `<b>${esc(m.fromName)}</b> (${esc(m.from)}) size bir daha posta göndermesin mi?`, buttons: [['yes', 'Abonelikten çık', true], ['no', 'Vazgeç']] }).then((a) => {
        if (a !== 'yes') return;
        if (!mb.unsub.includes(m.from)) mb.unsub.push(m.from);
        render();
        desk.toast('Abonelikten çıkıldı', `${esc(m.fromName)} artık size posta göndermeyecek.`, '📰');
        emit('mail-unsub', { from: m.from, name: m.fromName });
      });
      return;
    }
    if (t.dataset.write) { const c = mb.contacts[+t.dataset.write]; return compose({ to: c.email }); }
    if (t.dataset.cdel) { mb.contacts.splice(+t.dataset.cdel, 1); render(); return; }
    if (t.classList.contains('pm-sigsave')) {
      mb.signature = $('.pm-sig textarea').value.trim();
      desk.toast('İmza kaydedildi', 'Yeni postalarınızın sonuna eklenecek.', '✍', 3000);
      emit('mail-signature', { text: mb.signature });
      return;
    }
    if (t.dataset.folder) { saveDraft(); folder = t.dataset.folder; view = null; query = ''; render(); emit('mail-folder', { folder }); return; }
    if (t.dataset.open) return openMail(t.dataset.open);
    if (t.classList.contains('pm-back')) { view = null; render(); return; } // arama sonuçlarından açıldıysa sonuçlara döner
    if (t.classList.contains('pm-ccbtn')) { keep(); view.showCc = true; render(); emit('mail-cc-show'); setTimeout(() => $('.pm-cc')?.focus(), 0); return; }
    const m = view?.kind === 'read' && get(view.id);
    if (m && t.classList.contains('pm-reply')) return compose({ title: 'Yanıtla', to: m.from, subject: m.subject.startsWith('Ynt:') ? m.subject : 'Ynt: ' + m.subject, text: `\n\n--- ${m.fromName} yazdı ---\n${m.body}`, replyTo: m.id });
    if (m && t.classList.contains('pm-fwd')) return compose({ title: 'İlet', subject: 'İlt: ' + m.subject, text: `\n\n--- İletilen posta ---\nKimden: ${m.fromName} <${m.from}>\nKonu: ${m.subject}\n\n${m.body}`, attachments: [...m.attachments], forwardOf: m.id });
    if (m && (t.classList.contains('pm-del') || t.classList.contains('pm-spam'))) {
      const spam = t.classList.contains('pm-spam');
      m.folder = spam ? 'spam' : 'trash';
      view = null;
      render();
      desk.toast(spam ? 'İstenmeyen olarak işaretlendi' : 'Çöp Kutusu\'na taşındı', esc(m.subject), spam ? '⚠' : '🗑');
      emit(spam ? 'mail-spam' : 'mail-delete', { id: m.id, key: m.key, danger: !!m.danger, size: m.attachments.reduce((a, x) => a + attSize(desk, x), 0), used: mb.storageBase ? used(desk, mb) : 0 });
      return;
    }
    if (m && t.classList.contains('pm-notspam')) {
      m.folder = 'inbox';
      view = null;
      render();
      desk.toast('Gelen Kutusu\'na taşındı', esc(m.subject), '✔');
      emit('mail-notspam', { id: m.id, key: m.key });
      return;
    }
    if (m && t.classList.contains('pm-savec')) {
      mb.contacts.push({ name: m.fromName, email: m.from });
      render();
      emit('mail-contact-add', { email: m.from });
      return;
    }
    if (m && t.dataset.dl) {
      const a = m.attachments[+t.dataset.dl];
      const node = desk.fs.write('downloads', a.name, a.content);
      desk.toast('İndirildi', `${esc(a.name)} → İndirilenler`, '⬇');
      emit('mail-download', { name: a.name, id: node.id });
      return;
    }
    if (view?.kind === 'compose') {
      if (t.classList.contains('pm-send')) return send();
      if (t.classList.contains('pm-attach')) return attach();
      if (t.dataset.unatt) { keep(); view.attachments.splice(+t.dataset.unatt, 1); render(); return; }
      if (t.classList.contains('pm-discard')) { if (view.draftId) mb.mails = mb.mails.filter((x) => x.id !== view.draftId); view = null; render(); emit('mail-discard'); }
    }
  });
  // Arama kutusu: Enter'a basınca sonuçlar listelenir
  body.addEventListener('submit', (e) => {
    if (!e.target.classList.contains('pm-sform')) return;
    e.preventDefault();
    const q = $('.pm-search').value.trim();
    saveDraft();
    query = q;
    folder = q ? 'search' : 'inbox';
    view = null;
    render();
    if (q) emit('mail-search', { q, results: searchMail(desk, mb.mails, q).map((m) => ({ key: m.key, subject: m.subject, folder: m.folder })) });
  });
  // Yeni kişi formu
  body.addEventListener('submit', (e) => {
    if (!e.target.classList.contains('pm-addc')) return;
    e.preventDefault();
    const f = e.target, name = f.cname.value.trim(), email = f.cmail.value.trim();
    const p = !name ? 'Kişinin adını yazın.' : addrProblem(email);
    if (p) { f.querySelector('.pm-err').textContent = p; return; }
    mb.contacts.push({ name, email });
    render();
    desk.toast('Kişi kaydedildi', `${esc(name)} &lt;${esc(email)}&gt;`, '👤', 3000);
    emit('mail-contact-add', { email, name });
  });

  render();
  return {
    refresh: () => { if (view?.kind !== 'compose') render(); else setTitle(`E-posta (${unread()})`); },
    compose: (o) => compose(o),
    confirmClose: () => (view?.kind === 'compose' && (keep(), view.text.trim() || view.to.trim())
      ? desk.dialogs.ask({ title: 'E-posta', text: 'Yazdığınız posta gönderilmedi. Kapatılsın mı?', buttons: [['yes', 'Kapat'], ['no', 'Vazgeç', true]] }).then((a) => a === 'yes')
      : true),
    focus: () => {},
  };
}
