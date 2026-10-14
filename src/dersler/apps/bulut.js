// Bulut Depo: dosyaları internetteki depoya yüklemek, paylaşım bağlantısı oluşturmak (bağlantıya sahip herkes /
// yalnızca eklenen kişiler), bağlantıyı kopyalamak ya da e-postayla göndermek, paylaşımı kapatmak.
// Bağlantı tarayıcıda açılınca bulut.bulalim.com sayfası dosyayı gösterir. Yedekleme de buraya yapılır.
import { esc, pictureURL, isImage, progress } from './util.js';
import { fmtSize } from './explorer.js';
import { fileIcon } from '../dialog.js';

const QUOTA = 15e9;
const cloud = (desk) => (desk.cloud ||= { files: [], seq: 1 });
const linkOf = (f) => `bulut.bulalim.com/s/${f.key}`;
const KEYCH = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newKey = () => Array.from({ length: 8 }, () => KEYCH[Math.floor(Math.random() * KEYCH.length)]).join('');

export function bulut({ desk, body, args, emit, dialogs }) {
  body.classList.add('bd');
  const c = cloud(desk);
  let page = args.page || 'files', sel = null, share = null; // share: dosya kimliği (paylaş penceresi açık)
  const $ = (s) => body.querySelector(s);
  const used = () => c.files.filter((f) => !f.trash).reduce((s, f) => s + f.size, 0) + 1.2e9;

  function render() {
    const list = c.files.filter((f) => (page === 'trash' ? f.trash : !f.trash && (page !== 'shared' || f.share)));
    body.innerHTML = `<nav class="bd-nav"><div class="bd-logo">☁ Bulut Depo</div><button type="button" class="bd-up primary">⬆ Yükle</button>
      ${[['files', '📁 Dosyalarım'], ['shared', '🔗 Paylaştıklarım'], ['trash', '🗑 Çöp kutusu']].map(([k, l]) => `<button type="button" data-page="${k}" class="${k === page ? 'on' : ''}">${l}</button>`).join('')}
      <div class="bd-quota"><div class="prg"><i style="width:${(used() / QUOTA * 100).toFixed(1)}%"></i></div><small>15 GB alanın ${fmtSize(used())} kadarı kullanılıyor</small></div></nav>
      <section class="bd-main"><h2>${{ files: 'Dosyalarım', shared: 'Paylaştıklarım', trash: 'Çöp kutusu' }[page]}</h2><div class="bd-prog"></div>
      ${list.length ? `<table class="bd-t"><thead><tr><th>Ad</th><th>Boyut</th><th>Paylaşım</th><th></th></tr></thead><tbody>${list.map((f) => `<tr class="${f.id === sel ? 'sel' : ''}" data-f="${f.id}"><td>${fileIcon(f.name)} ${esc(f.name)}</td><td>${fmtSize(f.size)}</td>
        <td>${f.share ? (f.share === 'anyone' ? '🌐 Bağlantıya sahip herkes' : `👥 ${f.people.length} kişi`) : '🔒 Yalnızca siz'}</td>
        <td class="bd-acts">${f.trash ? `<button type="button" data-restore="${f.id}">♻ Geri al</button>` : `<button type="button" data-share="${f.id}">🔗 Paylaş</button><button type="button" data-del="${f.id}" title="Sil">🗑</button>`}</td></tr>`).join('')}</tbody></table>`
        : `<p class="bd-empty">${page === 'files' ? 'Henüz dosya yok. <b>⬆ Yükle</b> ile bilgisayarınızdan dosya ekleyin. Buluttaki dosyalara başka bir bilgisayardan ya da telefondan da ulaşabilirsiniz.' : 'Burada bir şey yok.'}</p>`}
      ${share ? shareHtml(c.files.find((f) => f.id === share)) : ''}</section>`;
  }

  function shareHtml(f) {
    return `<div class="bd-share"><div class="bd-sh-h"><b>🔗 “${esc(f.name)}” paylaş</b><button type="button" data-close="1" title="Kapat">✕</button></div>
      <p>Kimler açabilsin?</p>
      <label class="bd-opt"><input type="radio" name="who" value="people" ${f.share !== 'anyone' ? 'checked' : ''}> <span><b>👥 Yalnızca eklediğim kişiler</b><small>Bağlantı başkasının eline geçse de açamaz. Özel belgeler için.</small></span></label>
      <label class="bd-opt"><input type="radio" name="who" value="anyone" ${f.share === 'anyone' ? 'checked' : ''}> <span><b>🌐 Bağlantıya sahip herkes</b><small>Bağlantıyı kim bilirse açar. Kimlik, banka belgesi gibi şeyler için kullanmayın.</small></span></label>
      <div class="bd-people">${(f.people || []).map((p) => `<span class="bd-chip">${esc(p)}</span>`).join('')}<input class="bd-pmail" placeholder="Kişi ekle: e-posta adresi" spellcheck="false"><button type="button" data-addp="1">Ekle</button></div>
      <div class="bd-link"><input class="bd-url" readonly value="${f.share ? linkOf(f) : 'Bağlantı henüz oluşturulmadı'}"><button type="button" data-copy="1" ${f.share ? '' : 'disabled'}>⧉ Bağlantıyı kopyala</button></div>
      <div class="bd-sh-b"><button type="button" data-apply="1" class="primary">${f.share ? 'Kaydet' : 'Bağlantı oluştur'}</button>${f.share ? '<button type="button" data-unshare="1">🔒 Paylaşımı kapat</button><button type="button" data-mail="1">✉ E-postayla gönder</button>' : ''}</div></div>`;
  }

  async function upload() {
    const r = await dialogs.file({ mode: 'open', fs: desk.fs.dialogApi(), folder: 'pictures', ext: '', typeLabel: 'Bütün dosyalar (*.*)', accept: /./ });
    if (!r) return;
    const n = desk.fs.find(r.folder, r.name);
    if (!n || n.type !== 'file') return;
    const size = desk.fs.sizeOf(n);
    emit('cloud-upload-start', { name: n.name, size });
    await progress($('.bd-prog'), Math.min(3500, 600 + size / 3e5), `⬆ ${n.name} yükleniyor (${fmtSize(size)})…`);
    const f = { id: 'c' + c.seq++, key: newKey(), name: n.name, size, content: structuredClone(n.content), share: null, people: [] };
    c.files.unshift(f);
    page = 'files';
    sel = f.id;
    render();
    desk.toast('Yüklendi', `${esc(n.name)} Bulut Depo'ya yüklendi.`, '☁', 3500);
    emit('cloud-upload', { name: n.name, size, id: f.id });
  }

  body.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    const row = e.target.closest('tr[data-f]');
    if (row && !b) { sel = row.dataset.f; render(); return; }
    if (!b) return;
    const f = share && c.files.find((x) => x.id === share);
    if (b.dataset.page) { page = b.dataset.page; share = null; render(); return; }
    if (b.classList.contains('bd-up')) return upload();
    if (b.dataset.share) { share = b.dataset.share; sel = share; render(); emit('cloud-share-open', { id: share }); return; }
    if (b.dataset.del) { const x = c.files.find((y) => y.id === b.dataset.del); x.trash = true; render(); emit('cloud-delete', { name: x.name }); return; }
    if (b.dataset.restore) { c.files.find((y) => y.id === b.dataset.restore).trash = false; render(); return; }
    if (!f) return;
    if (b.dataset.close) { share = null; render(); return; }
    if (b.dataset.addp) {
      const m = $('.bd-pmail').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(m)) { desk.toast('Adres hatalı', 'Geçerli bir e-posta adresi yazın (ör. elif@ornek.com).', '⚠', 3000); return; }
      if (!f.people.includes(m)) f.people.push(m);
      render();
      emit('cloud-person', { email: m });
      return;
    }
    if (b.dataset.apply) {
      const who = body.querySelector('input[name="who"]:checked').value;
      if (who === 'people' && !f.people.length) { desk.toast('Kişi ekleyin', '“Yalnızca eklediğim kişiler” için önce kişinin e-posta adresini ekleyin.', '👥', 4000); return; }
      f.share = who;
      render();
      emit('cloud-share', { name: f.name, who, link: linkOf(f), people: [...f.people] });
      return;
    }
    if (b.dataset.unshare) { f.share = null; render(); emit('cloud-unshare', { name: f.name }); return; }
    if (b.dataset.copy) {
      const u = $('.bd-url');
      u.select();
      try { await navigator.clipboard.writeText(linkOf(f)); } catch { document.execCommand('copy'); }
      desk.textClip = linkOf(f);
      desk.toast('Bağlantı kopyalandı', `${esc(linkOf(f))}<br>E-postaya ya da mesaja <b>Ctrl + V</b> ile yapıştırabilirsiniz.`, '⧉', 5000);
      emit('cloud-copy', { link: linkOf(f) });
      return;
    }
    if (b.dataset.mail) {
      const w = desk.open('mail');
      w?.api?.compose?.({ subject: f.name, text: `\n\nDosyayı buradan açabilirsin:\n${linkOf(f)}\n` });
      emit('cloud-mail', { link: linkOf(f) });
    }
  });
  render();
  return { onArgs: (a) => { if (a.page) { page = a.page; render(); } } };
}

// Paylaşım bağlantısının açtığı sayfa
export const BULUT_SITE = {
  'bulut.bulalim.com': {
    name: 'Bulut Depo', secure: true,
    render(path, q, ctx) {
      const key = path.match(/^\/s\/(\w+)/)?.[1];
      const f = key && cloud(ctx.desk).files.find((x) => x.key === key);
      const head = '<header class="bd-head">☁ Bulut Depo</header>';
      const wrap = (t, h) => ({ title: t, html: `<div class="wp bdw">${head}${h}</div>` });
      if (!f || f.trash || !f.share) return wrap('Dosya bulunamadı', '<h1>😕 Bu bağlantı çalışmıyor</h1><p>Dosya silinmiş ya da paylaşımı kapatılmış olabilir.</p>');
      return wrap(f.name, `<div class="bdw-file">${isImage(f.name) || f.content?.video ? `<img src="${pictureURL(f.content)}" alt="">` : `<div class="bdw-ic">${fileIcon(f.name)}</div>`}<h1>${esc(f.name)}</h1><p>${fmtSize(f.size)} · Paylaşan: ${esc(ctx.desk.settings.user)}</p>${f.share === 'people' ? `<p class="ed-note">🔒 Bu dosyayı yalnızca ${f.people.map(esc).join(', ')} açabilir. Siz dosyanın sahibi olduğunuz için görüyorsunuz; bağlantı başkasının eline geçse bile o açamaz.</p>` : '<p class="ed-note">🌐 Bu bağlantıyı bilen herkes dosyayı açabilir.</p>'}
        <button type="button" class="ed-btn" data-act="dl">⬇ İndir</button></div>`);
    },
    act(a, v, ctx) {
      const key = ctx.loc.path.match(/^\/s\/(\w+)/)?.[1];
      const f = cloud(ctx.desk).files.find((x) => x.key === key);
      if (a === 'dl' && f) { ctx.download(f.name, structuredClone(f.content)); ctx.emit('cloud-link-download', { name: f.name }); }
    },
  },
};
