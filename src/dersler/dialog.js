// Windows tarzı ortak pencereler: "Farklı kaydet" / "Aç", "Kaydetmek istiyor musunuz?" sorusu ve "Yazdır".
// Pencereler verilen kabın (host) içinde açılır; kabın position değeri relative/absolute olmalıdır.

const BAD_CHARS = /[\\/:*?"<>|]/;
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export class Dialogs {
  constructor(host, onEvent = () => {}) {
    this.host = host;
    this.emit = (type, data = {}) => onEvent({ type, ...data });
    this.open = 0;
  }

  get busy() { return this.open > 0; }

  // Ortak iskelet: arka plan + kutu. back.close(değer) Promise'i çözer.
  // Promise'in gövdesi eşzamanlı çalıştığı için çağıran, oluşan pencereye this._last ile hemen erişebilir.
  shell(cls, title, inner, kind) {
    return new Promise((resolve) => {
      const back = document.createElement('div');
      back.className = 'dlg-back';
      back.innerHTML = `<div class="dlg ${cls}" role="dialog" aria-modal="true"><div class="dlg-title"><span>${esc(title)}</span><button type="button" class="dlg-x" title="Kapat">✕</button></div>${inner}</div>`;
      this.host.append(back);
      this.open++;
      this.emit('dialog', { open: true, kind });
      let done = false;
      const close = (v) => {
        if (done) return;
        done = true;
        back.remove();
        this.open--;
        this.emit('dialog', { open: false, kind, value: v });
        resolve(v);
      };
      back.querySelector('.dlg-x').onclick = () => close(null);
      back.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(null); } });
      back.close = close;
      this._last = back;
      setTimeout(() => (back.querySelector('[autofocus]') || back.querySelector('.dlg-ok') || back.querySelector('button'))?.focus(), 0);
    });
  }

  // mode: 'save' | 'open'. fs: { folders(), list(folderId) → [{id,name,folder}], label(folderId) }
  // accept: açma penceresinde gösterilecek dosyalar (verilmezse uzantıya göre)
  // types (isteğe bağlı, kaydetmede): [[uzantı, etiket], …] → “Kayıt türü” listesi çıkar; uzantı '*' ise yazılan ad olduğu gibi kalır
  file({ mode, fs, folder, name = '', ext = '.txt', typeLabel = 'Metin Belgeleri (*.txt)', accept, types }) {
    const title = mode === 'save' ? 'Farklı kaydet' : 'Aç';
    const inner = `
      <div class="dlg-path"><button type="button" class="dlg-up" title="Bir üst klasör">⬆</button><span class="dlg-crumb"></span></div>
      <div class="dlg-body"><ul class="dlg-side"></ul><ul class="dlg-files"></ul></div>
      <label class="dlg-row"><span>Dosya adı:</span><input class="dlg-name" autocomplete="off" spellcheck="false" autofocus></label>
      <div class="dlg-row"><span>Kayıt türü:</span>${types && mode === 'save' ? `<select class="dlg-type">${types.map(([e, l]) => `<option value="${e}">${esc(l)}</option>`).join('')}</select>` : `<span class="dlg-type">${esc(typeLabel)}</span>`}</div>
      <div class="dlg-err" aria-live="polite"></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">${mode === 'save' ? 'Kaydet' : 'Aç'}</button><button type="button" class="dlg-cancel">İptal</button></div>`;
    const p = this.shell('dlg-file', title, inner, mode);
    const back = this._last;
    const $ = (s) => back.querySelector(s);
    const input = $('.dlg-name');
    input.value = name;
    let cur = folder || fs.folders()[0].id;
    const trail = [];
    let overwrite = null;
    const extRe = new RegExp(ext.replace('.', '\\.') + '$', 'i');
    const acc = accept || extRe;

    const render = () => {
      $('.dlg-crumb').textContent = ['Bu bilgisayar', ...trail.map((t) => t.label), fs.label(cur)].join(' › ');
      $('.dlg-up').disabled = !trail.length;
      $('.dlg-side').innerHTML = fs.folders().map((f) => `<li><button type="button" data-folder="${f.id}" class="${f.id === cur ? 'on' : ''}">${f.icon} ${esc(f.label)}</button></li>`).join('');
      const items = fs.list(cur).filter((it) => it.folder || acc.test(it.name) || mode === 'save');
      $('.dlg-files').innerHTML = items.length
        ? items.map((it) => `<li><button type="button" ${it.folder ? `data-sub="${it.id}"` : `data-file="${esc(it.name)}"`}>${it.folder ? '📁' : fileIcon(it.name)} ${esc(it.name)}</button></li>`).join('')
        : '<li class="dlg-empty">Bu klasör boş.</li>';
      $('.dlg-err').textContent = '';
      overwrite = null;
    };
    render();

    $('.dlg-side').addEventListener('click', (e) => {
      const b = e.target.closest('[data-folder]');
      if (!b) return;
      cur = b.dataset.folder;
      trail.length = 0;
      render();
      this.emit('dialog-folder', { folder: cur });
    });
    $('.dlg-up').onclick = () => { if (trail.length) { cur = trail.pop().id; render(); } };
    $('.dlg-files').addEventListener('click', (e) => {
      const f = e.target.closest('[data-file]');
      if (f) { input.value = f.dataset.file; $('.dlg-files').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === f)); }
    });
    $('.dlg-files').addEventListener('dblclick', (e) => {
      const sub = e.target.closest('[data-sub]');
      if (sub) { trail.push({ id: cur, label: fs.label(cur) }); cur = sub.dataset.sub; render(); return; }
      if (e.target.closest('[data-file]')) ok();
    });
    input.addEventListener('input', () => { overwrite = null; $('.dlg-err').textContent = ''; });
    const typeSel = types && mode === 'save' ? $('select.dlg-type') : null;
    if (typeSel) {
      // Tür değişince adın uzantısı da değişir (ör. resim.png → resim.jpg)
      typeSel.addEventListener('change', () => {
        overwrite = null;
        const v = typeSel.value;
        if (v !== '*') input.value = input.value.replace(/\.[^.\\/]*$/, '') + v;
        this.emit('dialog-type', { ext: v });
      });
      // Açılışta ad zaten bir türe uyuyorsa o tür seçili olsun
      const m = types.find(([e]) => e !== '*' && name.toLocaleLowerCase('tr').endsWith(e));
      if (m) typeSel.value = m[0];
    }
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); ok(); } });

    const err = (t) => { $('.dlg-err').textContent = t; input.focus(); };
    const ok = () => {
      // Windows gibi: adın sonundaki nokta ve boşluklar atılır (“sayfam.html.” → “sayfam.html”)
      let n = input.value.trim().replace(/[.\s]+$/, '');
      if (!n || n === ext || n === '*' + ext) return err('Lütfen “Dosya adı” kutusuna bir ad yazın.');
      if (BAD_CHARS.test(n)) return err('Dosya adında şu işaretler olamaz:  \\ / : * ? " < > |');
      if (typeSel) {
        const hit = types.find(([e]) => e !== '*' && n.toLocaleLowerCase('tr').endsWith(e));
        if (typeSel.value !== '*') { if (hit) typeSel.value = hit[0]; else n += typeSel.value; }
      } else if (!extRe.test(n) && !(mode === 'open' && acc.test(n))) n += ext;
      const exists = fs.list(cur).some((it) => !it.folder && it.name.toLocaleLowerCase('tr') === n.toLocaleLowerCase('tr'));
      if (mode === 'open' && !exists) return err(`“${n}” bulunamadı. Listeden bir dosyaya tıklayın.`);
      if (mode === 'save' && exists && overwrite !== n && !(n === name && cur === folder)) {
        overwrite = n;
        return err(`“${n}” zaten var. Üzerine yazmak için Kaydet'e bir kez daha basın; yoksa başka bir ad yazın.`);
      }
      back.close({ folder: cur, name: n });
    };
    $('.dlg-ok').onclick = ok;
    $('.dlg-cancel').onclick = () => back.close(null);
    setTimeout(() => { input.focus(); input.select(); }, 0);
    return p;
  }

  // buttons: [[değer, etiket, birincil?], ...]
  ask({ title, text, buttons, icon = '' }) {
    const inner = `<div class="dlg-msg">${icon ? `<span class="dlg-icon">${icon}</span>` : ''}<div>${text}</div></div>
      <div class="dlg-btns">${buttons.map(([v, l, primary]) => `<button type="button" data-v="${v}" class="${primary ? 'dlg-ok' : ''}">${esc(l)}</button>`).join('')}</div>`;
    const p = this.shell('dlg-ask', title, inner, 'ask');
    const back = this._last;
    back.querySelector('.dlg-btns').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]');
      if (b) back.close(b.dataset.v);
    });
    return p;
  }

  // Metin kutulu pencere. fields: [{ name, label, value }]. Tamam'da { name: değer } döner; check(değerler) hata metni dönerse kapanmaz.
  form({ title, text = '', fields, ok = 'Tamam', icon = '', check }) {
    const inner = `${text ? `<div class="dlg-msg">${icon ? `<span class="dlg-icon">${icon}</span>` : ''}<div>${text}</div></div>` : ''}
      <div class="dlg-pr">${fields.map((f, i) => `<label class="dlg-row"><span>${esc(f.label)}</span><input class="dlg-name" data-f="${f.name}" value="${esc(f.value || '')}" autocomplete="off" spellcheck="false" ${i ? '' : 'autofocus'}></label>`).join('')}</div>
      <div class="dlg-err"></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">${esc(ok)}</button><button type="button" class="dlg-cancel">İptal</button></div>`;
    const p = this.shell('dlg-form', title, inner, 'form');
    const back = this._last;
    const go = () => {
      const v = Object.fromEntries([...back.querySelectorAll('[data-f]')].map((x) => [x.dataset.f, x.value]));
      const err = check?.(v);
      if (err) { back.querySelector('.dlg-err').textContent = err; return; }
      back.close(v);
    };
    back.querySelector('.dlg-ok').onclick = go;
    back.querySelector('.dlg-cancel').onclick = () => back.close(null);
    back.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('[data-f]')) { e.preventDefault(); go(); } });
    return p;
  }

  // preview (isteğe bağlı): { html, pages, orient, border, wm, padding } — Word gibi programların yazdırma önizlemesi
  // pvHtml: yazdırma önizlemesinin hazır HTML'i (Hesap Tablosu gibi programlar kendisi çizer); pvWide: pencereyi genişletir
  // pages (isteğe bağlı): belgenin sayfa sayısı; verilirse sayfa aralığı, renk, iki yüz ve yaprak sayısı seçenekleri de çıkar (PDF Okuyucu)
  print({ printers, doc, preview, pvHtml, pvWide, pages, current = 1 }) {
    const pv = preview ? `<div class="dlg-pv"><div class="dlg-pvbox ${preview.orient === 'yatay' ? 'yatay' : ''}"><div class="wd-page dlg-pvp ${preview.border === 'kutu' ? 'bordered' : preview.border === 'cift' ? 'bordered2' : ''} ${preview.orient === 'yatay' ? 'yatay' : ''}" data-wm="${esc(preview.wm || '')}" style="padding:${preview.padding}">${preview.html}</div></div>
        <div class="dlg-pvnote ${preview.pages > 1 ? 'bad' : 'ok'}">${preview.pages > 1 ? `⚠ Belge <b>${preview.pages} sayfa</b>; her sayfa ayrı kâğıda çıkar. Tek kâğıda sığdırmak için yazı boyutunu ya da kenar boşluklarını küçültün.` : '✔ Belge <b>tek kâğıda</b> sığıyor.'}<br><small>Kâğıt: A4, ${preview.orient === 'yatay' ? 'yatay' : 'dikey'}</small></div></div>` : '';
    const inner = `${pvHtml ? `<div class="dlg-pv">${pvHtml}</div>` : pv}<div class="dlg-pr">
        <label class="dlg-row"><span>Yazıcı:</span><select class="dlg-printer">${printers.map((p) => `<option>${esc(p)}</option>`).join('')}</select></label>
        <label class="dlg-row"><span>Kopya sayısı:</span><input class="dlg-copies" type="number" min="1" max="9" value="1"></label>
        ${pages ? `<label class="dlg-row"><span>Sayfalar:</span><select class="dlg-range"><option value="all">Tümü (1–${pages})</option><option value="current">Geçerli sayfa (${current})</option><option value="custom">Aralık yaz…</option></select></label>
        <label class="dlg-row dlg-rng-row" hidden><span></span><input class="dlg-rng" placeholder="ör. 1 ya da 1-2" autocomplete="off"></label>
        <label class="dlg-row"><span>Renk:</span><select class="dlg-color"><option value="color">Renkli</option><option value="bw">Siyah-beyaz</option></select></label>
        <label class="dlg-row"><span>İki yüze:</span><input type="checkbox" class="dlg-duplex"> <small>kâğıdın iki yüzüne yazdır (tasarruf)</small></label>
        <div class="dlg-pvnote ok dlg-sheets"></div>` : ''}
        <div class="dlg-row"><span>Belge:</span><b>${esc(doc)}</b></div></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">🖨 Yazdır</button><button type="button" class="dlg-cancel">İptal</button></div>`;
    const p = this.shell('dlg-print', 'Yazdır', inner, 'print');
    const back = this._last;
    if (pvWide) back.querySelector('.dlg').style.width = 'min(62em, 100%)'; // geniş önizleme (Hesap Tablosu): yazı okunsun
    const q = (x) => back.querySelector(x);
    // Seçilen sayfa aralığı: [ilk, son] ya da geçersizse null
    const span = () => {
      if (!pages) return null;
      const r = q('.dlg-range').value;
      if (r === 'all') return [1, pages];
      if (r === 'current') return [current, current];
      const m = q('.dlg-rng').value.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);
      if (!m) return null;
      const a = +m[1], b = +(m[2] || m[1]);
      return a >= 1 && b >= a && b <= pages ? [a, b] : null;
    };
    const info = () => {
      if (!pages) return;
      q('.dlg-rng-row').hidden = q('.dlg-range').value !== 'custom';
      const sp = span(), copies = Math.max(1, +q('.dlg-copies').value || 1), duplex = q('.dlg-duplex').checked;
      const box = q('.dlg-sheets');
      if (!sp) { box.className = 'dlg-pvnote bad dlg-sheets'; box.innerHTML = '⚠ Sayfa aralığını doğru yazın (ör. 1 ya da 1-2; belgede ' + pages + ' sayfa var).'; return; }
      const n = sp[1] - sp[0] + 1, sheets = copies * Math.ceil(n / (duplex ? 2 : 1));
      box.className = 'dlg-pvnote ' + (sheets > 2 ? 'bad' : 'ok') + ' dlg-sheets';
      box.innerHTML = `${n} sayfa × ${copies} kopya${duplex ? ', iki yüzlü' : ''} = <b>${sheets} yaprak kâğıt</b>`;
    };
    back.addEventListener('input', info);
    back.addEventListener('change', info);
    info();
    q('.dlg-ok').onclick = () => {
      const sp = span();
      if (pages && !sp) { info(); return; }
      const copies = +q('.dlg-copies').value || 1;
      const out = { printer: q('.dlg-printer').value, copies };
      if (pages) {
        const duplex = q('.dlg-duplex').checked, n = sp[1] - sp[0] + 1;
        Object.assign(out, { from: sp[0], to: sp[1], pagesPrinted: n, range: q('.dlg-range').value, color: q('.dlg-color').value !== 'bw', duplex, sheets: copies * Math.ceil(n / (duplex ? 2 : 1)) });
      }
      back.close(out);
    };
    q('.dlg-cancel').onclick = () => back.close(null);
    return p;
  }

  closeAll() { this.host.querySelectorAll(':scope > .dlg-back').forEach((b) => b.close?.(null)); }
}

export function fileIcon(name) {
  if (/\.txt$/i.test(name)) return '📝';
  if (/\.(png|jpe?g|bmp)$/i.test(name)) return '🖼';
  if (/\.docx?$/i.test(name)) return '📘';
  if (/\.xlsx?$/i.test(name)) return '📗';
  if (/\.pptx?$/i.test(name)) return '📙';
  if (/\.pdf$/i.test(name)) return '📕';
  if (/\.html?$/i.test(name)) return '🌐';
  if (/\.gif$/i.test(name)) return '🖼';
  if (/\.exe$/i.test(name)) return '💿';
  if (/\.(mp3|wav|m4a)$/i.test(name)) return '🎵';
  if (/\.zip$/i.test(name)) return '🗜';
  if (/\.(mp4|avi|mov)$/i.test(name)) return '🎬';
  return '📄';
}
