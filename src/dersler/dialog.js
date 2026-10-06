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
  file({ mode, fs, folder, name = '', ext = '.txt', typeLabel = 'Metin Belgeleri (*.txt)', accept }) {
    const title = mode === 'save' ? 'Farklı kaydet' : 'Aç';
    const inner = `
      <div class="dlg-path"><button type="button" class="dlg-up" title="Bir üst klasör">⬆</button><span class="dlg-crumb"></span></div>
      <div class="dlg-body"><ul class="dlg-side"></ul><ul class="dlg-files"></ul></div>
      <label class="dlg-row"><span>Dosya adı:</span><input class="dlg-name" autocomplete="off" spellcheck="false" autofocus></label>
      <div class="dlg-row"><span>Kayıt türü:</span><span class="dlg-type">${esc(typeLabel)}</span></div>
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
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); ok(); } });

    const err = (t) => { $('.dlg-err').textContent = t; input.focus(); };
    const ok = () => {
      let n = input.value.trim();
      if (!n || n === ext || n === '*' + ext) return err('Lütfen “Dosya adı” kutusuna bir ad yazın.');
      if (BAD_CHARS.test(n)) return err('Dosya adında şu işaretler olamaz:  \\ / : * ? " < > |');
      if (!extRe.test(n) && !(mode === 'open' && acc.test(n))) n += ext;
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

  print({ printers, doc }) {
    const inner = `<div class="dlg-pr">
        <label class="dlg-row"><span>Yazıcı:</span><select class="dlg-printer">${printers.map((p) => `<option>${esc(p)}</option>`).join('')}</select></label>
        <label class="dlg-row"><span>Kopya sayısı:</span><input class="dlg-copies" type="number" min="1" max="9" value="1"></label>
        <div class="dlg-row"><span>Belge:</span><b>${esc(doc)}</b></div></div>
      <div class="dlg-btns"><button type="button" class="dlg-ok">🖨 Yazdır</button><button type="button" class="dlg-cancel">İptal</button></div>`;
    const p = this.shell('dlg-print', 'Yazdır', inner, 'print');
    const back = this._last;
    back.querySelector('.dlg-ok').onclick = () => back.close({ printer: back.querySelector('.dlg-printer').value, copies: +back.querySelector('.dlg-copies').value || 1 });
    back.querySelector('.dlg-cancel').onclick = () => back.close(null);
    return p;
  }

  closeAll() { this.host.querySelectorAll(':scope > .dlg-back').forEach((b) => b.close?.(null)); }
}

export function fileIcon(name) {
  if (/\.txt$/i.test(name)) return '📝';
  if (/\.(png|jpe?g|bmp)$/i.test(name)) return '🖼';
  if (/\.pdf$/i.test(name)) return '📕';
  if (/\.exe$/i.test(name)) return '💿';
  if (/\.(mp3|wav)$/i.test(name)) return '🎵';
  return '📄';
}
