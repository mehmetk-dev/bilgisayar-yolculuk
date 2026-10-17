// 13. hafta sitesi (uydurma): belediye kültür merkezi kurs başvurusu. Vesikalık fotoğraf yüklenirken
// “en fazla 2 MB” ve “dik (vesikalık) olmalı” kuralları denetlenir; Paint'te küçültüp kırpınca geçer.
import { esc, pictureURL, isImage } from './util.js';
import { fmtSize } from './explorer.js';

export const KURS_HOST = 'www.kultur-kurslari.bel.tr';
export const FOTO_SINIR = 2e6;
const KURSLAR = ['Ebru sanatı', 'Resim (yağlı boya)', 'Bilgisayar kullanımı', 'Türk halk müziği'];

// Resmin piksel boyutu: Paint'in kaydettiği büyük resimlerde içerikte yazar, ötekilerde resim açılıp ölçülür
function pixels(content) {
  if (content?.w && content?.h) return Promise.resolve([content.w, content.h]);
  return new Promise((res) => { const im = new Image(); im.onload = () => res([im.naturalWidth, im.naturalHeight]); im.onerror = () => res([0, 0]); im.src = pictureURL(content); });
}

const KURS = {
  name: 'Kültür Kursları', secure: true,
  render(path, q, ctx) {
    const st = ctx.state;
    const head = '<header class="kk-head">🏛 Çınar Belediyesi <span>Kültür Merkezi · Kurs Başvurusu</span></header>';
    if (st.done) {
      return { title: 'Başvurunuz alındı', html: `<div class="wp kk">${head}<div class="kk-main"><div class="kk-ok"><h1>✔ Başvurunuz alındı</h1><p>Başvuru numaranız: <b>${st.done}</b></p>
        <p><b>${esc(st.ad)}</b>, <b>${esc(st.kurs)}</b> kursuna başvurdunuz. Kurs başlamadan bir hafta önce telefonla aranacaksınız.</p>
        <img class="kk-thumb" src="${pictureURL(st.photo.content)}" alt=""></div></div></div>` };
    }
    const p = st.photo;
    return { title: 'Kurs Başvurusu - Çınar Belediyesi', html: `<div class="wp kk">${head}<div class="kk-main"><h1>2026 Güz Dönemi Kurs Başvurusu</h1>
      <form class="kk-form" data-form>
        <label>Adınız soyadınız<input name="ad" autocomplete="off" value="${esc(st.ad || '')}"></label>
        <label>Kurs<select name="kurs"><option value="">Seçin…</option>${KURSLAR.map((k) => `<option${st.kurs === k ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
        <div class="kk-photo"><b>Vesikalık fotoğraf</b>
          <div class="kk-rules">📋 Kurallar: <b>JPG ya da PNG</b> · en fazla <b>2 MB</b> · <b>dik</b> (vesikalık) olmalı, yalnızca yüzünüz görünmeli</div>
          <button type="button" class="kk-pick" data-act="pick">📎 Fotoğraf seç</button>
          ${p ? `<div class="kk-file"><img src="${pictureURL(p.content)}" alt=""><span>✔ <b>${esc(p.name)}</b><small>${fmtSize(p.size)} · ${p.w} × ${p.h} piksel</small></span></div>` : ''}
          ${st.err ? `<div class="kk-err">⚠ ${st.err}</div>` : ''}
        </div>
        <button type="button" class="kk-go" data-act="apply">Başvur</button>
      </form></div></div>` };
  },
  async act(a, v, ctx) {
    const st = ctx.state;
    st.ad = v.ad ?? st.ad; st.kurs = v.kurs ?? st.kurs;
    if (a === 'pick') {
      const r = await ctx.desk.dialogs.file({ mode: 'open', fs: ctx.desk.fs.dialogApi(), folder: 'pictures', ext: '.jpg', typeLabel: 'Bütün dosyalar (*.*)', accept: /./ });
      if (!r) return;
      const n = ctx.desk.fs.find(r.folder, r.name);
      if (!n) return;
      const size = ctx.desk.fs.sizeOf(n);
      const [w, h] = isImage(r.name) ? await pixels(n.content) : [0, 0];
      let reason = null;
      if (!/\.(jpe?g|png)$/i.test(r.name)) { reason = 'type'; st.err = `“${esc(r.name)}” bir fotoğraf dosyası değil. Yalnızca JPG ya da PNG yükleyebilirsiniz.`; }
      else if (size > FOTO_SINIR) { reason = 'size'; st.err = `Dosya boyutu <b>2 MB</b>'den büyük olamaz. Seçtiğiniz dosya: <b>${fmtSize(size)}</b> (${w} × ${h} piksel).`; }
      else if (w >= h) { reason = 'shape'; st.err = `Fotoğraf <b>yatay</b> (${w} × ${h}). Vesikalık fotoğraf <b>dik</b> olmalı ve yalnızca yüzünüz görünmeli: fotoğrafı kırpın.`; }
      else st.err = '';
      st.photo = reason ? null : { name: r.name, size, w, h, content: n.content };
      ctx.emit('foto-upload', { ok: !reason, reason, name: r.name, size, w, h });
      ctx.refresh();
      return;
    }
    if (a === 'apply') {
      if (!st.ad || !st.kurs) { st.err = 'Adınızı yazın ve bir kurs seçin.'; ctx.refresh(); return; }
      if (!st.photo) { st.err = 'Vesikalık fotoğrafınızı ekleyin.'; ctx.refresh(); return; }
      st.done = 'KM-2026-' + (4100 + Math.floor(Math.random() * 800));
      ctx.emit('kurs-basvuru', { ad: st.ad, kurs: st.kurs, photo: st.photo.name });
      ctx.refresh();
    }
  },
};

export const FOTO_SITES = { [KURS_HOST]: KURS };
