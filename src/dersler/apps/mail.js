// E-posta: web postasına benzeyen bir posta kutusu. Gelen kutusu, okuma, yanıtlama, iletme, ek indirme ve ekleme,
// istenmeyen (sahte) posta. Adresler ve adlar uydurmadır; hiçbir şey gerçekten gönderilmez.
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
  ];
}

// Posta kutusu masaüstüne bağlıdır: ders başında masaüstü sıfırlanınca o da baştan kurulur
const box = (desk) => (desk.mail ||= { mails: seed() });

const FOLDERS = [['inbox', '📥', 'Gelen Kutusu'], ['sent', '📤', 'Gönderilenler'], ['spam', '⚠', 'İstenmeyen'], ['trash', '🗑', 'Çöp Kutusu']];
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

export function mail({ desk, body, emit, setTitle }) {
  const mb = box(desk);
  body.classList.add('pm');
  let folder = 'inbox', view = null; // view: { kind: 'read', id } | { kind: 'compose', ... }
  const $ = (s) => body.querySelector(s);
  const get = (id) => mb.mails.find((m) => m.id === id);
  const unread = () => mb.mails.filter((m) => m.folder === 'inbox' && !m.read).length;

  function render() {
    const n = unread();
    setTitle(`E-posta${n ? ` (${n})` : ''}`);
    body.innerHTML = `<div class="pm-top"><span class="pm-logo">✉ Postam</span><span class="pm-me">${ME}</span></div>
      <div class="pm-main"><nav class="pm-side"><button type="button" class="pm-new">✏ Yeni posta</button>
        ${FOLDERS.map(([id, ic, label]) => `<button type="button" data-folder="${id}" class="${id === folder && !view ? 'on' : ''}">${ic} ${label}${id === 'inbox' && n ? ` <b>${n}</b>` : ''}</button>`).join('')}</nav>
      <section class="pm-pane">${view?.kind === 'read' ? readHtml(get(view.id)) : view?.kind === 'compose' ? composeHtml() : listHtml()}</section></div>`;
    if (view?.kind === 'compose') {
      $('.pm-to').value = view.to; $('.pm-subj').value = view.subject; $('.pm-body').value = view.text;
    }
  }

  function listHtml() {
    const list = mb.mails.filter((m) => m.folder === folder);
    const label = FOLDERS.find((f) => f[0] === folder)[2];
    return `<h2 class="pm-h">${label}</h2>${list.length ? `<ul class="pm-list">${list.map((m) => `<li><button type="button" data-open="${m.id}" class="${m.read ? '' : 'unread'}">
      <span class="pm-from">${esc(folder === 'sent' ? 'Kime: ' + m.to : m.fromName)}</span><span class="pm-subj">${esc(m.subject || '(Konu yok)')}${m.attachments.length ? ' 📎' : ''}</span><span class="pm-time">${esc(m.time)}</span></button></li>`).join('')}</ul>` : '<p class="pm-empty">Bu klasörde posta yok.</p>'}`;
  }

  function readHtml(m) {
    const att = m.attachments.length ? `<div class="pm-atts">${m.attachments.map((a, i) => `<div class="pm-att">${isImage(a.name) ? `<img src="${pictureURL(a.content)}" alt="">` : `<span>${fileIcon(a.name)}</span>`}<b>${esc(a.name)}</b>${m.folder === 'sent' ? '' : `<button type="button" data-dl="${i}">⬇ İndir</button>`}</div>`).join('')}</div>` : '';
    return `<div class="pm-tools"><button type="button" class="pm-back">← Geri</button>
        ${m.folder === 'sent' ? '' : '<button type="button" class="pm-reply">↩ Yanıtla</button>'}<button type="button" class="pm-fwd">↪ İlet</button>
        ${m.folder === 'inbox' ? '<button type="button" class="pm-spam">⚠ İstenmeyen</button>' : ''}${m.folder === 'trash' ? '' : '<button type="button" class="pm-del">🗑 Sil</button>'}</div>
      <h2 class="pm-h">${esc(m.subject || '(Konu yok)')}</h2>
      <div class="pm-meta"><b>${esc(m.fromName || 'Ben')}</b> &lt;${esc(m.from)}&gt;<br><span>Kime: ${esc(m.to)} · ${esc(m.date)} ${esc(m.time)}</span></div>
      <div class="pm-text">${esc(m.body).replace(/\n/g, '<br>')}</div>
      ${m.link ? `<p><a href="#" class="pm-link" data-danger="1">👉 ${esc(m.link)}</a></p>` : ''}${att}`;
  }

  function composeHtml() {
    return `<div class="pm-tools"><button type="button" class="pm-send primary">➤ Gönder</button><button type="button" class="pm-attach">📎 Dosya ekle</button><button type="button" class="pm-discard">✕ Vazgeç</button></div>
      <h2 class="pm-h">${view.title}</h2>
      <label class="pm-field"><span>Kime:</span><input class="pm-to" type="text" spellcheck="false" autocomplete="off" placeholder="ornek@ornek.com"></label>
      <label class="pm-field"><span>Konu:</span><input class="pm-subj" type="text" autocomplete="off"></label>
      ${view.attachments.length ? `<div class="pm-atts">${view.attachments.map((a, i) => `<div class="pm-att">${isImage(a.name) ? `<img src="${pictureURL(a.content)}" alt="">` : `<span>${fileIcon(a.name)}</span>`}<b>${esc(a.name)}</b><button type="button" data-unatt="${i}" title="Eki çıkar">✕</button></div>`).join('')}</div>` : ''}
      <div class="pm-err" aria-live="polite"></div>
      <textarea class="pm-body" spellcheck="false" placeholder="Mesajınızı buraya yazın"></textarea>`;
  }

  // Yazma ekranındaki kutuların içeriği yeniden çizimde kaybolmasın
  const keep = () => { if (view?.kind === 'compose' && $('.pm-to')) { view.to = $('.pm-to').value; view.subject = $('.pm-subj').value; view.text = $('.pm-body').value; } };

  function compose(o = {}) {
    keep();
    view = { kind: 'compose', title: 'Yeni posta', to: '', subject: '', text: '', attachments: [], ...o };
    render();
    emit('mail-compose', { reply: !!o.replyTo, forward: !!o.forwardOf });
    setTimeout(() => (view.to ? $('.pm-body') : $('.pm-to'))?.focus(), 0);
  }

  function openMail(id) {
    const m = get(id);
    m.read = true;
    view = { kind: 'read', id };
    render();
    emit('mail-open', { id, key: m.key, from: m.from, subject: m.subject, folder: m.folder, replyOf: m.replyOf });
  }

  function send() {
    keep();
    const to = view.to.trim(), err = (t) => { $('.pm-err').textContent = t; emit('mail-error', { what: t }); };
    const p = addrProblem(to);
    if (p) { err(p); $('.pm-to').focus(); return; }
    const go = () => {
      const m = { id: 'm' + seq++, folder: 'sent', read: true, from: ME, fromName: 'Ben', to, subject: view.subject.trim(), body: view.text, attachments: view.attachments, date: today(), time: new Date().toTimeString().slice(0, 5), replyTo: view.replyTo, forwardOf: view.forwardOf };
      mb.mails.unshift(m);
      folder = 'inbox';
      view = null;
      render();
      desk.toast('Posta gönderildi', `Kime: ${esc(to)}`, '✉');
      emit('mail-send', { id: m.id, to, subject: m.subject, body: m.body, attachments: m.attachments.map((a) => a.name), replyTo: m.replyTo, replyKey: m.replyTo && get(m.replyTo)?.key, forwardOf: m.forwardOf });
      const c = CONTACTS[to.toLowerCase()];
      if (c) setTimeout(() => {
        if (desk.mail !== mb) return; // bu arada ders değişti
        const r = { id: 'm' + seq++, folder: 'inbox', read: false, from: to.toLowerCase(), fromName: c.name, to: ME, subject: /^Ynt:/.test(m.subject) ? m.subject : 'Ynt: ' + (m.subject || ''), body: c.reply(m), attachments: [], date: today(), time: new Date().toTimeString().slice(0, 5), replyOf: m.id, key: 'cevap' };
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
      view.attachments.push({ name: r.name, content: n?.content });
      render();
      emit('mail-attach', { name: r.name });
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
    if (t.classList.contains('pm-new')) return compose();
    if (t.dataset.folder) { keep(); folder = t.dataset.folder; view = null; render(); emit('mail-folder', { folder }); return; }
    if (t.dataset.open) return openMail(t.dataset.open);
    if (t.classList.contains('pm-back')) { view = null; render(); return; }
    const m = view?.kind === 'read' && get(view.id);
    if (m && t.classList.contains('pm-reply')) return compose({ title: 'Yanıtla', to: m.from, subject: m.subject.startsWith('Ynt:') ? m.subject : 'Ynt: ' + m.subject, text: `\n\n--- ${m.fromName} yazdı ---\n${m.body}`, replyTo: m.id });
    if (m && t.classList.contains('pm-fwd')) return compose({ title: 'İlet', subject: 'İlt: ' + m.subject, text: `\n\n--- İletilen posta ---\nKimden: ${m.fromName} <${m.from}>\nKonu: ${m.subject}\n\n${m.body}`, attachments: [...m.attachments], forwardOf: m.id });
    if (m && (t.classList.contains('pm-del') || t.classList.contains('pm-spam'))) {
      const spam = t.classList.contains('pm-spam');
      m.folder = spam ? 'spam' : 'trash';
      view = null;
      render();
      desk.toast(spam ? 'İstenmeyen olarak işaretlendi' : 'Çöp Kutusu\'na taşındı', esc(m.subject), spam ? '⚠' : '🗑');
      emit(spam ? 'mail-spam' : 'mail-delete', { id: m.id, key: m.key, danger: !!m.danger });
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
      if (t.classList.contains('pm-discard')) { view = null; render(); emit('mail-discard'); }
    }
  });
  render();
  return {
    confirmClose: () => (view?.kind === 'compose' && (keep(), view.text.trim() || view.to.trim())
      ? desk.dialogs.ask({ title: 'E-posta', text: 'Yazdığınız posta gönderilmedi. Kapatılsın mı?', buttons: [['yes', 'Kapat'], ['no', 'Vazgeç', true]] }).then((a) => a === 'yes')
      : true),
    focus: () => {},
  };
}
